/* Recalcul indépendant, suite (27.11, agent recalc34) : notions des niveaux 1 à 3 de la 3e et de la 4e du Collège (MA1 et
   MA2 renforcé) et notions MP 3e–4e encore sous 20 % de couverture. Déclencheur : le noyau faux d'appllin (4e Collège).
   Même principe que tests/recalc_oracles.js : chaque oracle relit l'énoncé (TeX affiché à l'élève, pas les variables du
   générateur), refait le calcul par une autre voie (calcul numérique : dérivées par différences centrées, limites par
   extrapolation, intégrales par Simpson adaptatif, extremums par balayage, algèbre linéaire, nombres complexes) et
   compare à la réponse attendue, quelle que soit sa forme : valeur (arrondi et corrigé contrôlés par cmpValue), ensemble,
   couple ou triplet, expression (comparée en plusieurs points), nombre complexe a + bi, intervalles.
   Les oracles sont placés en tête de RECALC.G et ne s'appliquent qu'aux notions nommées. Couverture : tools/recalcul.md. */
(() => {
  const R = RECALC, G = R.G, { tex2e, compile, fmt } = R;
  const nn = (s) => +String(s).replace(/[\s'’]/g, "").replace(/\{,\}/g, ".").replace(",", ".").replace(/−/g, "-");
  const NB = String.raw`(-?\d+(?:'\d{3})*(?:[.,]\d+)?)`; /* nombre du texte lisible */
  const segs = (raw) => (String(raw).match(/\\\(([\s\S]*?)\\\)/g) || []).map((m) => m.slice(2, -2).trim());
  /* TeX → fonction JS (lettres permises : vs) */
  function fn(tex, vs = ["x"]) {
    let s = String(tex).replace(/\\left|\\right/g, "").replace(/\\,|\\;|\\!/g, " ").replace(/\\operatorname\{([a-z]+)\}/g, "\\$1");
    s = s.replace(/([A-Z])e\^/g, "$1\\cdot e^");
    s = s.replace(/\\(sin|cos|tan)\^\{?(\d)\}?\s*\(([^()]*)\)/g, "(\\$1($3))^$2").replace(/\\(sin|cos|tan|ln|exp|sqrt|log)(?![a-z])/g, " \\$1");
    s = s.replace(/\\log_\{?(\d+|[a-z])\}?\s*/g, (m, b) => "(1/\\ln(" + b + "))*\\ln "); /* log en base b */
    let e; try { e = tex2e(s); } catch (er) { return null; }
    if (/\\(?!pi)[a-zA-Z]/.test(e)) return null;
    let tr; try { tr = Expr.parse(e); } catch (er) { return null; }
    const lv = vs.map((v) => v.toLowerCase()); /* Expr met les lettres en minuscules */
    if ([...Expr.vars(tr)].some((v) => !lv.includes(v))) return null;
    const c = compile(tr);
    return vs.length === 1 ? (t) => c({ [lv[0]]: t }) : (env) => { const e2 = {}; for (const k in env) e2[k.toLowerCase()] = env[k]; return c(e2); };
  }
  const val = (tex) => { const f = fn(tex, []); if (!f) return NaN; return f({}); };
  /* définitions « f(x) = … » des segments */
  function defs(raw) {
    const D = {};
    for (const s of segs(raw)) {
      const m = /^([A-Za-z](?:_\{?[A-Za-z0-9]+\}?)?)\(([a-z])\)\s*=\s*([\s\S]+)$/.exec(s);
      if (!m || /\\begin|\\circ|<|>|\\leq?(?![a-z])|\\geq?(?![a-z])/.test(m[3])) continue;
      const f = fn(m[3], [m[2]]); if (f && !D[m[1]]) D[m[1]] = Object.assign(f, { tex: m[3], v: m[2] });
    }
    return D;
  }
  /* ---------- outils numériques ---------- */
  const fin = (v) => typeof v === "number" && isFinite(v);
  function snap(v, tol = 1e-8, Q = 400) {
    if (!fin(v)) return v; if (Math.abs(v - Math.round(v)) < tol * Math.max(1, Math.abs(v))) return Math.round(v);
    for (let q = 2; q <= Q; q++) { const p = Math.round(v * q); if (Math.abs(p / q - v) < tol * Math.max(1, Math.abs(v))) return p / q; }
    return v;
  }
  const d1 = (f, t, h = 1e-3) => (8 * (f(t + h) - f(t - h)) - (f(t + 2 * h) - f(t - 2 * h))) / (12 * h);
  const d2 = (f, t, h = 1e-2) => (-f(t + 2 * h) + 16 * f(t + h) - 30 * f(t) + 16 * f(t - h) - f(t - 2 * h)) / (12 * h * h);
  /* zéros (changements de signe et racines doubles) de g sur [-L ; L] */
  const zeros = (g, L = 60) => R.roots((t) => [g(t), 0], L) || [];
  /* zéros avec changement de signe seulement */
  const zsc = (g, L = 60) => zeros(g, L).filter((r) => { const a = g(r - 1e-4), b = g(r + 1e-4); return fin(a) && fin(b) && a * b < 0; });
  /* extremums locaux : changements de signe de f' (pas les pôles) */
  function extrema(f, L = 60) {
    const g = (t) => d1(f, t), out = [];
    for (const r of zsc(g, L)) { if (!fin(f(r)) || Math.abs(g(r)) > 1e-5) continue; out.push({ x: snap(r, 1e-7), max: g(r - 1e-3) > 0 }); }
    return out;
  }
  /* limite en a (bilatérale, extrapolation de Richardson) et en ±∞ */
  const lim = (f, a, side = 0) => {
    const S = (h) => (side ? f(a + side * h) : (f(a + h) + f(a - h)) / 2);
    if (side) { const h = 1e-4; return snap(2 * S(h / 2) - S(h), 1e-6); }
    return snap((4 * S(5e-4) - S(1e-3)) / 3, 1e-8);
  };
  const limInf = (f, s = 1, tex = "") => {
    if (/e\^|\\exp/.test(tex)) { const a = f(350 * s), b = f(700 * s); return Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b)) ? snap(b, 1e-7) : NaN; } /* exponentielle : convergence rapide, pas d'extrapolation */
    if (/\\ln|\\log/.test(tex)) return snap(f(1e12 * s), 1e-7); /* logarithme : ln(x)/x ≈ 3·10⁻¹¹ */
    const X = 2e4 * s, a = f(X), b = f(2 * X), c = f(4 * X); return snap((8 * c - 6 * b + a) / 3, 1e-7); };
  /* intégrale (Simpson adaptatif) */
  function integ(f, a, b, eps = 1e-12) {
    const sim = (a, b, fa, fm, fb) => ((b - a) / 6) * (fa + 4 * fm + fb);
    const rec = (a, b, fa, fm, fb, S, e, d) => { const m = (a + b) / 2, l = (a + m) / 2, r = (m + b) / 2, fl = f(l), fr = f(r), S1 = sim(a, m, fa, fl, fm), S2 = sim(m, b, fm, fr, fb);
      if (d > 40 || (d > 5 && Math.abs(S1 + S2 - S) <= 15 * e)) return S1 + S2 + (S1 + S2 - S) / 15; return rec(a, m, fa, fl, fm, S1, e / 2, d + 1) + rec(m, b, fm, fr, fb, S2, e / 2, d + 1); };
    if (a === b) return 0; if (a > b) return -integ(f, b, a, eps);
    const fa = f(a), fb = f(b), fm = f((a + b) / 2); return rec(a, b, fa, fm, fb, sim(a, b, fa, fm, fb), eps, 0);
  }
  /* extremum global sur [lo ; hi] : balayage puis section dorée */
  function opt(f, lo, hi, sgn = 1, N = 4000) {
    let bi = -1, bv = -Infinity; const h = (hi - lo) / N;
    for (let i = 0; i <= N; i++) { const v = sgn * f(lo + i * h); if (fin(v) && v > bv) { bv = v; bi = i; } }
    if (bi < 0) return [NaN, NaN];
    let a = Math.max(lo, lo + (bi - 1) * h), b = Math.min(hi, lo + (bi + 1) * h);
    for (let k = 0; k < 200; k++) { const m1 = a + (b - a) * 0.382, m2 = a + (b - a) * 0.618, v1 = sgn * f(m1), v2 = sgn * f(m2); if (!(v1 >= v2) && fin(v2)) a = m1; else b = m2; }
    const xb = snap((a + b) / 2, 1e-6); return [xb, f(xb)];
  }
  /* solution de g(k) = 0, g affine en k */
  const lin = (g) => { const a = g(0), b = g(1) - a; return snap(-a / b, 1e-7); };
  const det2 = (a, b, c, d) => a * d - b * c;
  const det3 = (M) => M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
  /* Cramer n × n (n = 2 ou 3) : A x = b */
  function cramer(A, b) {
    const n = A.length, D = n === 2 ? det2(A[0][0], A[0][1], A[1][0], A[1][1]) : det3(A); if (!D) return null;
    return A[0].map((_, j) => { const M = A.map((row, i) => row.map((v, k) => (k === j ? b[i] : v))); return snap((n === 2 ? det2(M[0][0], M[0][1], M[1][0], M[1][1]) : det3(M)) / D, 1e-9); });
  }
  const dot = (u, v) => u.reduce((s, a, i) => s + a * v[i], 0), nrm = (u) => Math.sqrt(dot(u, u));
  const sub = (u, v) => u.map((a, i) => a - v[i]), add = (u, v) => u.map((a, i) => a + v[i]), mul = (k, u) => u.map((a) => k * a);
  const cross = (u, v) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
  const deg = (r) => (r * 180) / Math.PI, rad = (d) => (d * Math.PI) / 180;
  /* ---------- lecture des structures TeX ---------- */
  const mats = (raw) => [...String(raw).matchAll(/\\begin\{pmatrix\}([\s\S]*?)\\end\{pmatrix\}/g)].map((m) => m[1].split(/\\\\/).map((r) => r.split("&").map((c) => val(c.trim()))));
  const vecs = (raw) => mats(raw).filter((M) => M.every((r) => r.length === 1)).map((M) => M.map((r) => r[0]));
  const cases = (raw) => [...String(raw).matchAll(/\\begin\{cases\}([\s\S]*?)\\end\{cases\}/g)].map((m) => m[1].split(/\\\\/).map((r) => r.trim()).filter(Boolean));
  /* système paramétrique « x = … \\ y = … \\ z = … » → { P0, dir: { t: […], s: […] } } */
  function param(rows) {
    const F = rows.map((r) => { const m = /^([xyz])\s*=\s*([\s\S]+)$/.exec(r); return m ? fn(m[2], ["t", "s"]) : null; });
    if (F.some((f) => !f)) return null;
    const at = (t, s) => F.map((f) => f({ t, s }));
    const P0 = at(0, 0), dt = sub(at(1, 0), P0), ds = sub(at(0, 1), P0); return { P0, t: dt, s: ds, dir: dt.some((v) => v) ? dt : ds, at: (k, l) => (dt.some((v) => v) ? at(k, l) : at(l, k)) };
  }
  /* points « A(1 ; 2 ; 3) » du texte lisible */
  const pt = (txt, name) => { const m = new RegExp("\\b" + name + "\\((-?[\\d,]+(?: ; -?[\\d,]+){1,2})\\)").exec(txt); return m ? m[1].split(" ; ").map(nn) : null; };
  /* plan « ax + by + cz + d = 0 » → [a, b, c, d] ; droite « ax + by = c » (sans z) */
  function plane(tex) {
    const m = /^([\s\S]*?)=\s*(-?[\d{},.]+)$/.exec(tex.trim()); if (!m) return null;
    const f = fn(m[1], ["x", "y", "z"]); if (!f) return null; const rhs = val(m[2]);
    const d = f({ x: 0, y: 0, z: 0 }) - rhs; return [f({ x: 1, y: 0, z: 0 }) - d - rhs, f({ x: 0, y: 1, z: 0 }) - d - rhs, f({ x: 0, y: 0, z: 1 }) - d - rhs, d];
  }
  const planes = (raw) => segs(raw).map((s) => { const m = /^(?:\\pi(?:_\d|')?|\\pi_\{?\d\}?)\s*:\s*([\s\S]*=[\s\S]*)$/.exec(s); return m ? plane(m[1]) : null; }).filter(Boolean);
  /* ---------- comparaison à la réponse attendue ---------- */
  const near = (a, b, tol = 1e-6) => fin(a) && fin(b) && Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const show = (a) => a.map((v) => (fin(v) ? fmt(+v.toPrecision(10)) : String(v))).join(" ; ");
  function judge(x, r) {
    const sp = x.spec;
    if (typeof r === "number") r = { v: r };
    if ("v" in r) {
      if (!fin(r.v)) return { err: "recalcul impossible (" + r.v + ")" };
      if (sp.kind === "value") return r.dir === undefined ? { ...r, dir: 0 } : r; /* « au moins un 6 », « au plus une pièce » : l'événement, pas le sens de l'arrondi */
      if (sp.kind === "set") r = { S: [r.v] }; else return { err: "réponse attendue de type " + sp.kind + ", recalcul " + fmt(r.v) };
    }
    if (r.S) {
      const S = []; for (const v of r.S) if (!S.some((u) => near(u, v, 1e-7))) S.push(v);
      if (sp.kind === "value" && S.length === 1) return { v: S[0] };
      if (sp.kind !== "set" || sp.all) return { err: "réponse attendue " + (sp.all ? "« tous les nombres »" : "de type " + sp.kind) + ", recalcul {" + show(S) + "}" };
      const W = []; for (const v of sp.values) if (!W.some((u) => near(u, v, 1e-7))) W.push(v);
      const ok = S.every((v) => fin(v)) && W.length === S.length && W.every((w) => S.some((v) => near(v, w))) && S.every((v) => W.some((w) => near(v, w)));
      return { err: ok ? null : "attendu {" + show(sp.values) + "}, recalcul {" + show(S) + "}" };
    }
    if (r.P) {
      if (sp.kind !== "pair" || sp.values.length !== r.P.length) return { err: "réponse attendue de type " + sp.kind + ", recalcul (" + show(r.P) + ")" };
      return { err: r.P.every((v, i) => near(sp.values[i], v)) ? null : "attendu (" + show(sp.values) + "), recalcul (" + show(r.P) + ")" };
    }
    if (r.E) {
      if (sp.kind !== "expr") return { err: "réponse attendue de type " + sp.kind + " (expression recalculée)" };
      let T; try { T = Expr.parse(sp.expr); } catch (e) { return { err: "réponse attendue illisible : " + sp.expr }; }
      const v = r.v0 || "x"; if ([...Expr.vars(T)].some((u) => u !== v)) return { err: "réponse attendue " + sp.expr + " : lettre inattendue" };
      const P = (r.pts || (r.pos ? [0.7, 1.3, 2.2, 3.7, 4.1, 5.9] : [-2.3, -1.1, 0.7, 1.6, 2.9, 3.4])).filter((t) => fin(r.E(t)) && fin(Expr.evaluate(T, { [v]: t })));
      if (P.length < 3) return null;
      const bad = P.find((t) => !near(Expr.evaluate(T, { [v]: t }), r.E(t), 1e-6));
      return { err: bad === undefined ? null : "réponse attendue " + sp.expr + " ≠ recalcul en " + v + " = " + bad + " (" + fmt(r.E(bad)) + ")" };
    }
    if (r.C) {
      if (sp.kind !== "expr") return { err: "réponse attendue de type " + sp.kind + ", recalcul " + show(r.C) };
      let T; try { T = Expr.parse(sp.expr); } catch (e) { return { err: "réponse attendue illisible : " + sp.expr }; }
      if ([...Expr.vars(T)].some((u) => u !== "i")) return { err: "réponse attendue " + sp.expr + " : lettre inattendue" };
      const e0 = Expr.evaluate(T, { i: 0 }), e1 = Expr.evaluate(T, { i: 1 }), e2 = Expr.evaluate(T, { i: 2 });
      const ok = near(e0, r.C[0]) && near(e1 - e0, r.C[1]) && near(e2 - e0, 2 * (e1 - e0));
      return { err: ok ? null : "attendu " + sp.expr + ", recalcul " + fmt(+r.C[0].toPrecision(10)) + " + " + fmt(+r.C[1].toPrecision(10)) + "i" };
    }
    if (r.I) {
      let want;
      if (sp.kind === "solset") want = (t) => sp.ivs.some(([a, ai, b, bi]) => { a = a === null || !isFinite(a) ? -Infinity : a; b = b === null || !isFinite(b) ? Infinity : b; return (t > a || (ai && Math.abs(t - a) < 1e-9)) && (t < b || (bi && Math.abs(t - b) < 1e-9)); });
      else if (sp.kind === "ineq") { const v = sp.value, o = sp.op; want = (t) => (o === ">" ? t > v : o === "<" ? t < v : o === ">=" ? t >= v - 1e-9 : t <= v + 1e-9); }
      else return { err: "réponse attendue de type " + sp.kind + " (intervalles recalculés)" };
      const E = [...(r.pts || [])]; if (sp.kind === "solset") for (const [a, , b] of sp.ivs) E.push(a, b); else E.push(sp.value);
      const T0 = []; for (let t = -60; t <= 60; t += 0.37) T0.push(+t.toFixed(4));
      for (const e of E) if (e !== null && isFinite(e)) { T0.push(e - 1e-3, e + 1e-3); if (Math.abs(e * 1000 - Math.round(e * 1000)) < 1e-6) T0.push(e); } /* borne exacte seulement si elle est décimale (2/3 est stocké arrondi) */
      const bad = T0.find((t) => !!r.I(t) !== !!want(t));
      return { err: bad === undefined ? null : "ensemble attendu " + JSON.stringify(sp.ivs || [sp.op, sp.value]) + " faux en " + fmt(+bad.toFixed(6)) };
    }
    return null;
  }
  const LIST = [];
  /* un oracle : ids (séparés par des espaces), f(c) → résultat ou null ; c = { x, raw, txt, S, D } */
  const IDS = new Set(); /* notions munies d'un oracle de ce fichier : page tests/recalcul3.html */
  function O(ids, f) {
    const set = new Set(ids.split(" ")); for (const i of set) IDS.add(i);
    LIST.push({ name: "recalc34 " + ids, f(x) {
      if (!set.has(x.id) || !x.spec) return null;
      const c = { x, raw: String(x.raw).replace(/<br\s*\/?>/g, " ").replace(/[\u00a0\u202f]/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\\\)\s*\\\(\s*=\s*/g, " = "), txt: String(x.txt).replace(/[\u00a0\u202f]/g, " "), get S() { return segs(this.raw); }, get D() { return this._D || (this._D = defs(this.raw)); } };
      const r = f(c); return r === null || r === undefined ? null : judge(x, r);
    } });
  }
  const has = (c, re) => re.test(c.raw);
  const m1 = (c, re) => { const m = re.exec(c.raw); return m ? m.slice(1) : null; };
  const mt = (c, re) => { const m = re.exec(c.txt); return m ? m.slice(1).map(nn) : null; };
  /* « \(…\) » numérique qui suit un texte */
  const after = (c, re) => { const m = new RegExp(re.source + String.raw`\s*\\\(([^\\]*?(?:\\(?:frac|sqrt|dfrac|tfrac|pi|ln|left|right|,)[^\\]*?)*?)\\\)`).exec(c.raw); return m ? val(m[m.length - 1]) : NaN; };
  const fOf = (c, name = "f") => c.D[name] || null;
  const lastFn = (c) => { const k = Object.keys(c.D); return k.length ? c.D[k[0]] : null; };

  /* ================= 3e Collège : analyse ================= */
  /* compo */
  O("compo fctmp", (c) => {
    const D = c.D;
    if (/expression (?:développée )?de \\\(\((\w) \\circ (\w)\)\(x\)\\\)|Donne l'expression de \\\(\((\w) \\circ (\w)\)\(x\)\\\)|Donne \\\(\((\w) \\circ (\w)\)\(x\)\\\) sous la forme/.test(c.raw)) {
      const m = /\((\w) \\circ (\w)\)\(x\)/.exec(c.raw), F = D[m[1]], H = D[m[2]]; if (!F || !H) return null; return { E: (t) => F(H(t)) };
    }
    let m = /^Calcule \\\(([^]*?\\circ[^]*?)(?: = [^=]*)?\\\)\.$/.exec(c.S.length ? c.raw.slice(c.raw.lastIndexOf("Calcule")) : "");
    if (m) { let ok = true; const e = m[1].replace(/\((\w) \\circ (\w)\)\(([^)]+)\)/g, (u, a, b, t) => { if (!D[a] || !D[b]) { ok = false; return "0"; } return "(" + D[a](D[b](val(t))) + ")"; }); if (!ok) return null; return val(e); }
    if ((m = /domaine de définition de \\\((\w) \\circ (\w)\\\)/.exec(c.raw))) { const F = D[m[1]], H = D[m[2]]; if (!F || !H) return null; return { I: (t) => fin(H(t)) && fin(F(H(t))) }; }
    if ((m = /exclure du domaine de \\\((\w) \\circ (\w)\\\)/.exec(c.raw))) {
      const F = D[m[1]], H = D[m[2]]; if (!F || !H) return null;
      const poles = (g) => zsc((t) => 1 / g(t)).filter((p) => Math.abs(g(p + 1e-7)) > 1e5);
      const pf = poles(H), ph = poles(F); /* F ∘ H : H non définie, ou H(x) pôle de F */
      const out = [...pf]; for (const p of ph) for (const r of zsc((t) => H(t) - p)) out.push(r);
      return { S: out.map((v) => snap(v, 1e-7)) };
    }
    return null;
  });
  /* tauxvar */
  O("tauxvar", (c) => {
    const f = lastFn(c); if (!f) return null; let m;
    if ((m = mt(c, new RegExp(`taux de variation moyen entre ${NB} et ${NB} \\+ h`)))) { const a = m[0]; return { E: (h) => (f(a + h) - f(a)) / h, v0: "h" }; }
    if ((m = mt(c, new RegExp(`entre (?:t = )?${NB} et (?:t = )?${NB}`))) && !/un nombre b/.test(c.txt)) return (f(m[1]) - f(m[0])) / (m[1] - m[0]);
    if ((m = mt(c, new RegExp(`passe de ${NB} à ${NB}`)))) return (f(m[1]) - f(m[0])) / (m[1] - m[0]);
    if ((m = mt(c, new RegExp(`entre ${NB} et un nombre b ≠ ${NB} vaut ${NB}`))) || (m = mt(c, new RegExp(`entre ${NB} et un nombre b\\s+${NB} vaut ${NB}`)))) {
      const a = m[0]; return { S: zsc((b) => (Math.abs(b - a) < 1e-9 ? NaN : (f(b) - f(a)) / (b - a) - m[2])).map((v) => snap(v)) };
    }
    return null;
  });
  /* tangente (et lnexp : ordonnée à l'origine de la tangente) */
  O("tangente lnexp derivref derivregles", (c) => {
    const f = fOf(c); let m;
    if ((m = mt(c, new RegExp(`On sait que f\\(${NB}\\) = ${NB} et f'\\(${NB}\\) = ${NB}`))) && /équation de la tangente/.test(c.txt)) { const [a, b, , k] = m; return { E: (t) => b + k * (t - a) }; }
    if (!f) return null;
    const a = after(c, /au point d'abscisse/);
    if (/équation de la tangente/.test(c.txt) && fin(a)) return { E: (t) => f(a) + d1(f, a) * (t - a) };
    if (/(?:coupe-t-elle l'axe des|ordonnée à l'origine de la tangente)/.test(c.txt) && fin(a)) return snap(f(a) - a * d1(f, a), 1e-8);
    if ((m = mt(c, new RegExp(`une pente égale à ${NB}`)))) { const r = zeros((t) => d1(f, t) - m[0]).map((v) => snap(v)); return r.length === 1 ? { P: [r[0], f(r[0])] } : { err: "pente atteinte en " + r.length + " points" }; }
    if (/tangentes? au graphe de [^?]* passent par l'origine/.test(c.txt)) return { S: zeros((t) => f(t) - t * d1(f, t)).map((v) => snap(v)) };
    if ((m = mt(c, new RegExp(`On part de x_0 = ${NB}`))) && /Où cette tangente coupe-t-elle l'axe des x/.test(c.txt)) { const a0 = m[0]; return snap(a0 - f(a0) / d1(f, a0)); }
    if ((m = /approximation affine de \\\(f\(x\) = \\sqrt\{x\}\\\) en \\\((\d+)\\\)[^]*valeur approchée de \\\(\\sqrt\{(\d+)\}\\\)/.exec(c.raw))) { const a0 = +m[1], x0 = +m[2]; return snap(f(a0) + d1(f, a0) * (x0 - a0)); }
    return null;
  });
  /* variations, etudefct, derivseconde, etudelnexp, lnexp : extremums, monotonie, zéros */
  O("variations", (c) => {
    const m = /La dérivée d'une fonction \\\(f\\\) est \\\(f'\(x\) = ([^]*?)\\\)\. En quelle abscisse \\\(f\\\) admet-elle un extremum local/.exec(c.raw); if (!m) return null;
    const g = fn(m[1]); return g ? { S: zsc(g).map((v) => snap(v)) } : null;
  });
  O("variations etudefct etudelnexp lnexp derivprodquot derivcomp derivref", (c) => {
    const f = fOf(c); if (!f) return null; const t = c.txt; let m;
    if (/En quelles abscisses [^?]*extremum local/.test(t)) return { S: extrema(f).map((e) => e.x) };
    if ((m = /admet un (minimum|maximum)\. En quelle abscisse/.exec(t))) return opt(f, /x > 0/.test(t) ? 1e-6 : -30, 30, m[1] === "minimum" ? -1 : 1, 12000)[0];
    if ((m = /valeur (?:du|de son) (maximum|minimum) local/.exec(t))) { const e = extrema(f).filter((u) => u.max === (m[1] === "maximum")); return e.length === 1 ? snap(f(e[0].x), 1e-7) : null; }
    if ((m = /coordonnées « x ; y » du (maximum|minimum)( local)?/.exec(t))) { const e = extrema(f).filter((u) => u.max === (m[1] === "maximum")); return e.length === 1 ? { P: [e[0].x, snap(f(e[0].x), 1e-7)] } : null; }
    if ((m = /intervalle (?:\(fermé\) )?la fonction [^?]* est-elle (décroissante|croissante)/.exec(t))) { const s = m[1] === "croissante" ? 1 : -1; return { I: (u) => fin(f(u)) && s * d1(f, u) >= -1e-7, pts: extrema(f).map((e) => e.x) }; }
    if ((m = /Pour x > 0, la fonction [^?]* admet un (minimum|maximum)\. Quelle est sa valeur/.exec(t)) || (m = /pour x > 0\. Quelle est la valeur de son (minimum|maximum)/.exec(t))) return snap(opt(f, 1e-3, 60, m[1] === "minimum" ? -1 : 1)[1], 1e-7);
    if ((m = /Quelle est la valeur (minimale|maximale) de f\(x\)/.exec(t))) { const lo = /pour x ≥ 0|\]0 ; \+/.test(t) ? 0 : -30; return snap(opt(f, lo + (lo === 0 ? 1e-9 : 0), 30, m[1] === "minimale" ? -1 : 1, 12000)[1], 1e-7); }
    if ((m = /En quelle abscisse [^?]*atteint-elle son (minimum|maximum)/.exec(t))) { const lo = /x > 0/.test(t) ? 1e-6 : -30; return opt(f, lo, 30, m[1] === "minimum" ? -1 : 1, 12000)[0]; }
    if (/Quels sont les zéros de f\(x\)/.test(t) || /^Trouve le zéro de f\(x\)/.test(t)) return { S: zeros(f).map((v) => snap(v)) };
    if ((m = /l'équation (.*) = m a-t-elle trois solutions/.exec(t))) { const e = extrema(f); if (e.length !== 2) return null; const [lo, hi] = [f(e.find((u) => !u.max).x), f(e.find((u) => u.max).x)].map((v) => snap(v, 1e-7)); return { I: (u) => zsc((s) => f(s) - u).length === 3, pts: [lo, hi] }; }
    return null;
  });
  O("etudefct fratmp", (c) => {
    let m;
    if (/Quelles? (?:valeurs? faut-il exclure de l'ensemble de définition|sont les valeurs interdites|est la valeur interdite)/.test(c.txt)) {
      const s = c.S.find((u) => /^f\(x\) = /.test(u)); if (!s || !(m = /\\frac\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}\{([^]*)\}$/.exec(s))) return null;
      const g = fn(m[1]); return g ? { S: zeros(g).map((v) => snap(v)) } : null;
    }
    return null;
  });
  O("derivseconde", (c) => {
    const f = fOf(c); if (!f) return null; const t = c.txt; let m;
    const g2 = (u) => d2(f, u), infl = () => zsc(g2, 60).map((v) => snap(v, 1e-6)).filter((v) => fin(f(v)));
    if ((m = mt(c, new RegExp(`Calcule f''\\(${NB}\\)`)))) return snap(d2(f, m[0]), 1e-7);
    if (/En quelle abscisse la courbe de f\(x\) = .* point d'inflexion/.test(t)) return { S: infl() };
    if (/abscisses des points d'inflexion/.test(t)) return { S: infl() };
    if (/coordonnées « x ; y » du point d'inflexion/.test(t)) { const r = infl(); return r.length === 1 ? { P: [r[0], snap(f(r[0]), 1e-7)] } : null; }
    if ((m = /est-elle (concave|convexe)/.exec(t))) { const s = m[1] === "convexe" ? 1 : -1; return { I: (u) => s * g2(u) >= -1e-6, pts: infl() }; }
    if (/tangente à sa courbe au point d'inflexion a pour équation y = mx \+ n\. Que vaut n/.test(t)) { const r = infl(); return r.length === 1 ? snap(f(r[0]) - r[0] * d1(f, r[0]), 1e-6) : null; }
    return null;
  });
  /* paramètre k (ou m) affine dans f : extremum, inflexion */
  O("variations derivseconde", (c) => {
    let m = /Pour quelle valeur de \\\(k\\\) (?:la fonction|la courbe de) \\\(f\(x\) = ([^]*?)\\\) (admet-elle un extremum local|a-t-elle un point d'inflexion) en \\\(x = ([^\\]+)\\\)/.exec(c.raw); if (!m) return null;
    const F = fn(m[1], ["x", "k"]), a = val(m[3]); if (!F) return null;
    return lin((k) => (/extremum/.test(m[2]) ? d1((u) => F({ x: u, k }), a) : d2((u) => F({ x: u, k }), a)));
  });
  /* optimderiv */
  O("optimderiv", (c) => {
    const t = c.txt, D = c.D; let m;
    if ((m = mt(c, new RegExp(`ont pour somme ${NB}\\. On veut rendre le produit P = x y\\^2`)))) { const S = m[0], [y, P] = opt((u) => (S - u) * u * u, 0, S, 1); return /valeur de y/.test(t) ? y : /valeur maximale de P/.test(t) ? snap(P, 1e-7) : null; }
    if ((m = /coût total C\(q\) = .*Le coût moyen par pièce/.exec(t)) && D.C) { const [q, v] = opt((u) => D.C(u) / u, 0.01, 2000, -1, 20000); return /Quelle production/.test(t) ? q : /coût moyen minimal/.test(t) ? snap(v, 1e-7) : null; }
    if ((m = mt(c, new RegExp(`à base carrée de côté x, est fabriquée avec ${NB} cm\\^2 de carton`)))) { const A = m[0], [x0, V] = opt((u) => (u * (A - u * u)) / 4, 0, Math.sqrt(A), 1); return /Quel côté/.test(t) ? x0 : /volume maximal/.test(t) ? snap(V, 1e-7) : null; }
    if ((m = mt(c, new RegExp(`feuille carrée de carton de ${NB} cm de côté`)))) { const L = m[0], [x0, V] = opt((u) => u * (L - 2 * u) ** 2, 0, L / 2, 1); return /Quelle valeur de x|Quel côté/.test(t) ? x0 : /volume maximal/.test(t) ? snap(V, 1e-7) : null; }
    if ((m = mt(c, new RegExp(`sur la parabole y = ${NB} - x\\^2`)))) { const k = m[0], [x0, A] = opt((u) => 2 * u * (k - u * u), 0, Math.sqrt(k), 1); return /Quelle valeur de x/.test(t) ? x0 : /aire maximale \?$/.test(t) ? snap(A, 1e-7) : null; }
    if ((m = /Quel est le bénéfice maximal|Quelle production q rend le bénéfice maximal/.exec(t)) && D.B) { const [q, v] = opt(D.B, 0, 200, 1, 40000); return /Quelle production/.test(t) ? q : snap(v, 1e-7); }
    if ((m = mt(c, new RegExp(`à base carrée, doit contenir ${NB} cm\\^3`)))) { const V = m[0], [x0] = opt((u) => -(u * u + (4 * V) / u), 0.01, 200, 1, 40000); return /côté de base/.test(t) ? x0 : /hauteur/.test(t) ? snap(V / (x0 * x0), 1e-7) : /aire minimale/.test(t) ? snap(x0 * x0 + (4 * V) / x0, 1e-7) : null; }
    if ((m = /Quelle vitesse rend ce coût minimal/.exec(t)) && D.C) return opt(D.C, 1, 300, -1, 30000)[0];
    if ((m = mt(c, new RegExp(`cylindrique doit contenir ${NB}π cm\\^3`)))) { const V = m[0] * Math.PI, [r] = opt((u) => -(2 * Math.PI * u * u + (2 * V) / u), 0.01, 100, 1, 40000); return /hauteur/.test(t) ? snap(V / (Math.PI * r * r), 1e-6) : /rayon/.test(t) ? r : null; }
    return null;
  });
  /* limites, limitinf, asymptotes, continuite, fratmp */
  const limSeg = (c) => { for (const s of c.S) { const m = /^\\lim_\{([a-z]) \\to ([^}]*)\}\s*([\s\S]*?)(?:\s*=\s*([^=]+))?$/.exec(s); if (m) return m.slice(1); } return null; };
  O("limites limitinf etudelnexp lnexp", (c) => {
    const L = limSeg(c); if (!L) return null; const [v, to, body, eq] = L;
    if (/^Calcule/.test(c.txt) && !eq) {
      const f = fn(body.replace(/^\((.*)\)$/, "$1"), [v]); if (!f) return null;
      if (/infty/.test(to)) return limInf(f, /^-/.test(to) ? -1 : 1, body);
      const a = val(to); return fin(a) ? lim(f, a) : null;
    }
    if (eq && /Pour quelle valeur de \\\(k\\\)/.test(c.raw)) { const F = fn(body, [v, "k"]); if (!F) return null; return lin((k) => limInf((u) => F({ [v]: u, k }), /^-/.test(to) ? -1 : 1) - val(eq)); }
    let m;
    if ((m = /Pour quelle valeur de \\\(k\\\) la limite/.exec(c.raw)) && (m = /\\frac\{([^{}]*)\}\{([^{}]*)\}/.exec(body))) { const N = fn(m[1], [v, "k"]), a = val(to); return N && fin(a) ? lin((k) => N({ [v]: a, k })) : null; }
    return null;
  });
  O("limitinf", (c) => { const f = lastFn(c); return f && /quand \\\(t\\\) devient très grand/.test(c.raw) ? limInf(f) : null; });
  const poles = (f) => zsc((t) => 1 / f(t)).filter((p) => Math.abs(f(p + 1e-7)) > 1e4).map((v) => snap(v));
  O("asymptotes fratmp", (c) => {
    let m;
    if ((m = /Pour quelles valeurs de \\\(k\\\) la fonction \\\(f\(x\) = \\frac\{[^}]*\}\{x\^2 \+ kx \+ (\d+)\}\\\) a-t-elle une seule asymptote verticale/.exec(c.raw))) { const q = +m[1]; return { S: [-2 * Math.sqrt(q), 2 * Math.sqrt(q)] }; }
    const f = fOf(c), t = c.txt; if (!f || /graphique|traitillé|pointillés/.test(t)) return null;
    if (/coupe son asymptote horizontale en un point\. Quelle est son abscisse/.test(t)) { const L = limInf(f); return { S: zeros((u) => f(u) - L).map((v) => snap(v)) }; }
    if (/asymptote horizontale (?:de f\(x\) = .* )?a pour équation y = k|a une asymptote horizontale y = k/.test(t)) return limInf(f);
    if (/Son asymptote verticale a pour équation x = c/.test(t)) { const p = poles(f); return p.length === 1 ? p[0] : null; }
    if (/Les deux asymptotes de f\(x\) = .* se coupent/.test(t)) { const p = poles(f); return p.length === 1 ? { P: [p[0], limInf(f)] } : null; }
    if (/Quelles sont les asymptotes verticales/.test(t)) return { S: poles(f) };
    if (/asymptote oblique a pour équation y = mx \+ p/.test(t)) { const a = limInf((u) => f(u) / u), b = limInf((u) => f(u) - a * u); return { P: [a, b] }; }
    if (/Donne les asymptotes de f\(x\) = .*Verticale x = et horizontale y = /.test(t)) { const p = poles(f); return p.length === 1 ? { P: [p[0], limInf(f)] } : null; }
    if ((m = /Pour quelles valeurs de \\\(k\\\) la fonction \\\(f\(x\) = \\frac\{[^}]*\}\{x\^2 \+ kx \+ (\d+)\}\\\) a-t-elle une seule asymptote verticale/.exec(c.raw))) { const q = +m[1]; return { S: [-2 * Math.sqrt(q), 2 * Math.sqrt(q)] }; }
    return null;
  });
  O("continuite derivth", (c) => {
    const t = c.txt, C = cases(c.raw)[0]; let m;
    if ((m = /On pose \\\(f\(x\) = ([^]*?)\\\) pour \\\(x \\neq ([^\\]+)\\\)/.exec(c.raw))) { const f = fn(m[1]), a = val(m[2]); return f && fin(a) ? lim(f, a) : null; }
    if ((m = mt(c, new RegExp(`P\\(x\\) = ${NB}x CHF pour x ≤ ${NB} [^,]*, puis P\\(x\\) = ${NB}x \\+ k`)))) return snap(m[0] * m[1] - m[2] * m[1], 1e-9);
    if (!C) return null;
    const rows = C.map((r) => /^([\s\S]*?)\s*&\s*\\text\{si \}\s*([\s\S]*)$/.exec(r)).filter(Boolean); if (rows.length !== C.length) return null;
    const cut = (s) => { const u = /x\s*(?:<|>|\\le|\\ge|\\leq|\\geq)\s*([^\\]+?)\s*$/.exec(s.replace(/\\le\b|\\leq\b/g, "\\le").replace(/\\ge\b|\\geq\b/g, "\\ge")); return u ? val(u[1]) : NaN; };
    if (rows.length === 2 && /Pour quelle valeur de \\\(k\\\) la fonction/.test(c.raw) && /continue/.test(t)) {
      const A = fn(rows[0][1], ["x", "k"]), B = fn(rows[1][1], ["x", "k"]), a = cut(rows[0][2]); if (!A || !B || !fin(a)) return null;
      return lin((k) => A({ x: a, k }) - B({ x: a, k }));
    }
    if (rows.length === 3 && /Trouve \\\(a\\\) et \\\(b\\\) pour que/.test(c.raw) && /continue/.test(t)) {
      const A = fn(rows[0][1]), Cc = fn(rows[2][1]), p = cut(rows[0][2]), q = cut(rows[2][2]); if (!A || !Cc) return null;
      const sol = cramer([[p, 1], [q, 1]], [A(p), Cc(q)]); return sol ? { P: sol } : null;
    }
    if (rows.length === 2 && /dérivable en/.test(t) && /Trouve \\\(a\\\) et \\\(b\\\)/.test(c.raw)) {
      const A = fn(rows[0][1]), p = cut(rows[0][2]); if (!A || !fin(p)) return null; const a = snap(d1(A, p), 1e-7); return { P: [a, snap(A(p) - a * p, 1e-7)] };
    }
    if (rows.length === 2 && /pente de la demi-tangente à (gauche|droite)/.test(t)) { const A = fn(rows[/gauche/.test(t) ? 0 : 1][1]), p = cut(rows[0][2]); return A && fin(p) ? snap(d1(A, p), 1e-7) : null; }
    return null;
  });
  O("derivth", (c) => {
    const t = c.txt, f = fOf(c); let m;
    if ((m = mt(c, new RegExp(`sur \\[${NB} ; ${NB}\\]`))) && f) {
      const [a, b] = m;
      if (/théorème de Rolle|telles que f'\(c\) = 0/.test(t)) { const r = zeros((u) => d1(f, u)).filter((u) => u > a && u < b).map((v) => snap(v)); return { S: r }; }
      if (/accroissements finis|parallèle à la corde/.test(t)) { const s = (f(b) - f(a)) / (b - a), r = zeros((u) => d1(f, u) - s).filter((u) => u > a && u < b).map((v) => snap(v)); return { S: r }; }
    }
    if ((m = /La fonction \\\(f\(x\) = \\left\|([^|]*)\\right\|[^)]*\\\) n'est pas dérivable en un point|La fonction \\\(f\(x\) = \|([^|]*)\|[^)]*\\\) n'est pas dérivable en un point/.exec(c.raw))) { const g = fn(m[1] || m[2]); return g ? { S: zeros(g).map((v) => snap(v)) } : null; }
    if ((m = mt(c, new RegExp(`distantes de ${NB} km\\. Une voiture les franchit à ${NB} min d'intervalle`)))) return (m[0] / m[1]) * 60;
    if ((m = mt(c, new RegExp(`f\\(${NB}\\) = ${NB} et f'\\(x\\) ≤ ${NB} pour tout x\\. Quelle est la plus grande valeur possible de f\\(${NB}\\)`)))) return m[1] + m[2] * (m[3] - m[0]);
    return null;
  });


  /* ================= 3e Collège : probabilités ================= */
  const Cn = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return r; };
  const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
  O("probaxiomes probarbre", (c) => {
    const t = c.txt; let m;
    if ((m = mt(c, new RegExp(`contient ${NB} \\S+ \\S+ et ${NB} \\S+ \\S+\\. On en tire deux simultanément`)))) {
      const [a, b] = m, n = a + b, T = Cn(n, 2);
      if (/de chaque couleur/.test(t)) return (a * b) / T; if (/de même couleur/.test(t)) return (Cn(a, 2) + Cn(b, 2)) / T; return null;
    }
    if ((m = mt(c, new RegExp(`On lance ${NB} dés équilibrés\\. Quelle est la probabilité d'obtenir au moins un 6`)))) return 1 - (5 / 6) ** m[0];
    if ((m = /mot de passe de (\d+) (?:lettres|chiffres|symboles), chacune? tirée? au hasard parmi ((?:\w, )+\w)\. [^?]*tous ses symboles soient différents/.exec(t))) { const k = +m[1], n = m[2].split(", ").length; return fact(n) / fact(n - k) / n ** k; }
    if ((m = mt(c, new RegExp(`classe de ${NB} élèves, ${NB} [^,]+, ${NB} [^,]+ et ${NB} font les deux`)))) {
      const [N, a, b, d] = m;
      if (/ni [^?]* ni /.test(t)) return (N - (a + b - d)) / N; if (/au moins l'un|l'un ou l'autre/.test(t)) return (a + b - d) / N; if (/un seul|exactement un/.test(t)) return (a + b - 2 * d) / N; return null;
    }
    if (/jeu de jass de 36 cartes/.test(t) && (m = /tirer une? (?:cœur|carreau|trèfle|pique)(?: ou|,) (une carte de valeur ((?:\d+, )*\d+ ou \d+)|une figure|(?:une? (?:as|roi|valet|dame|dix|\d+)(?:, | ou )?)+) /.exec(t))) { const r = m[2] ? m[2].split(/, | ou /).length : /figure/.test(m[1]) ? 3 : (m[1].match(/une? /g) || []).length; return (9 + 3 * r) / 36; }
    if ((m = /P\(A\) = (\d+(?:\{,\}\d+)?),? P\(B\) = (\d+(?:\{,\}\d+)?) et P\(A \\(cup|cap) B\) = (\d+(?:\{,\}\d+)?)/.exec(c.raw.replace(/\\\)|\\\(/g, "")))) {
      const [a, b] = [val(m[1]), val(m[2])], u = val(m[4]), I = m[3] === "cup" ? a + b - u : u, U = m[3] === "cup" ? u : a + b - u;
      if (/Calcule \\\(P\(A \\cap B\)\\\)/.test(c.raw)) return I; if (/Calcule \\\(P\(A \\cup B\)\\\)/.test(c.raw)) return U;
      if (/A se réalise, mais pas B/.test(t)) return a - I; if (/B se réalise, mais pas A/.test(t)) return b - I; return null;
    }
    if (/On lance deux dés équilibrés/.test(t)) {
      const P = (pr) => { let k = 0; for (let i = 1; i <= 6; i++) for (let j = 1; j <= 6; j++) if (pr(i, j)) k++; return k / 36; };
      if (/produit pair/.test(t)) return P((i, j) => (i * j) % 2 === 0); if (/produit impair/.test(t)) return P((i, j) => (i * j) % 2 === 1);
      if (/somme paire/.test(t)) return P((i, j) => (i + j) % 2 === 0); if ((m = /somme égale à (\d+)/.exec(t))) return P((i, j) => i + j === +m[1]);
      if ((m = /somme (?:supérieure|plus grande) (?:ou égale )?à (\d+)/.exec(t))) return P((i, j) => (/ou égale/.test(t) ? i + j >= +m[1] : i + j > +m[1]));
      if (/au moins un 6/.test(t)) return P((i, j) => i === 6 || j === 6); if (/un double/.test(t)) return P((i, j) => i === j); return null;
    }
    if ((m = /le 6 sort (\d+) fois plus souvent que chacune des autres faces/.exec(t))) {
      const k = +m[1], p = 1 / (5 + k), w = (f) => (f === 6 ? k * p : p), S = (pr) => [1, 2, 3, 4, 5, 6].filter(pr).reduce((s, f) => s + w(f), 0);
      if (/nombre pair/.test(t)) return S((f) => f % 2 === 0); if (/nombre impair/.test(t)) return S((f) => f % 2 === 1); if ((m = /obtenir un (\d)\b/.exec(t))) return w(+m[1]); return null;
    }
    /* probarbre */
    if ((m = mt(c, new RegExp(`contient ${NB} \\S+ \\S+ et ${NB} \\S+ \\S+\\. On en tire (?:deux|une)`)))) {
      const [a, b] = m, n = a + b, sans = /sans remise/.test(t), q = sans ? n - 1 : n, col = /contient \d+ \S+ (\S+) et \d+ \S+ (\S+)\./.exec(t), A = col[1].replace(/s$/, ""), B = col[2].replace(/s$/, "");
      const pAA = (a / n) * ((sans ? a - 1 : a) / q), pBB = (b / n) * ((sans ? b - 1 : b) / q), pAB = (a / n) * (b / q) + (b / n) * (a / q);
      if (/que la deuxième soit/.test(t)) { const w = /deuxième soit (\S+)/.exec(t)[1].replace(/s$/, ""); return w === A ? a / n : w === B ? b / n : null; }
      if (/deux couleurs différentes|une \S+ de chaque couleur|exactement une/.test(t) && !/exactement une \S+ \S+ et/.test(t)) return pAB;
      if ((m = /obtenir deux \S+ (\S+) \?/.exec(t))) { const w = m[1].replace(/s$/, ""); return w === A ? pAA : w === B ? pBB : null; }
      if (/de même couleur/.test(t)) return pAA + pBB; return null;
    }
    if ((m = mt(c, new RegExp(`fonctionne avec la probabilité ${NB}, B avec ${NB}, C avec ${NB}`)))) return m[0] * (1 - (1 - m[1]) * (1 - m[2]));
    if ((m = mt(c, new RegExp(`donne un 6 avec la probabilité ${NB}, à chaque lancer et indépendamment\\. Quelle est la probabilité qu'on obtienne un 6 pour la première fois au ${NB}e lancer`)))) return (1 - m[0]) ** (m[1] - 1) * m[0];
    if ((m = /U₁ contient (\d+) boules? rouges? et (\d+) bleues? ; l'urne U₂, (\d+) rouges? et (\d+) bleues?\. On lance (un dé : avec 1 ou 2|un dé : avec 1, 2 ou 3|une pièce)/.exec(t))) {
      const [r1, b1, r2, b2] = m.slice(1, 5).map(Number), p1 = /1 ou 2/.test(m[5]) ? 1 / 3 : 1 / 2, p2 = 1 - p1;
      if (/tirer une boule rouge/.test(t)) return p1 * (r1 / (r1 + b1)) + p2 * (r2 / (r2 + b2)); if (/tirer une boule bleue/.test(t)) return p1 * (b1 / (r1 + b1)) + p2 * (b2 / (r2 + b2)); return null;
    }
    return null;
  });

  /* ================= 3e Collège : géométrie dans l'espace ================= */
  /* vecteurs dont des composantes contiennent m (ou k, t…) : fonctions de la lettre */
  const vecsL = (raw, L = "m") => [...String(raw).matchAll(/\\begin\{pmatrix\}([\s\S]*?)\\end\{pmatrix\}/g)].map((mm) => mm[1].split(/\\\\/).map((r) => fn(r.trim(), [L])));
  const ptL = (txt, name, L = "m") => { const mm = new RegExp("\\b" + name + "\\(([^)]*)\\)").exec(txt); if (!mm) return null; const p = mm[1].split(" ; ").map((u) => fn(u.replace(/^-/, "-").trim(), [L])); return p.every(Boolean) ? (k) => p.map((f) => f(k)) : null; };
  const comb = (c, names) => { /* « -3\vec{u} - 2\vec{v} » → vecteur */
    const mm = /composantes de \\\(([^\\]*(?:\\vec\{\w\}[^\\]*)+)\\\)/.exec(c.raw); if (!mm) return null;
    const e = mm[1].replace(/\\vec\{(\w)\}/g, "$1"), f = fn(e, names); if (!f) return null; return f;
  };
  O("vect3d coordmp vectmp", (c) => {
    const t = c.txt; let m;
    const A = pt(t, "A"), B = pt(t, "B"), C = pt(t, "C"), V = vecs(c.raw);
    if (/milieu (?:M )?de \[AB\]/.test(t) && A && B && !/est le milieu/.test(t)) return { P: A.map((a, i) => (a + B[i]) / 2) };
    if (/composantes du vecteur AB/.test(t) && A && B) return { P: sub(B, A) };
    if (/composantes de|calcule [-\d]*u [-+]/.test(t) && V.length >= 2) { const f = comb(c, ["u", "v", "w"]) || (() => { const mm = /calcule \\\(([^\\]*(?:\\vec\{\w\}[^\\]*)+)\\\)/.exec(c.raw); return mm ? fn(mm[1].replace(/\\vec\{(\w)\}/g, "$1"), ["u", "v", "w"]) : null; })(); if (!f) return null; return { P: V[0].map((_, i) => f({ u: V[0][i], v: V[1][i], w: (V[2] || [])[i] || 0 })) }; }
    if (/parallélogramme/.test(t) && /coordonnées de D/.test(t) && A && B && C) return { P: add(A, sub(C, B)) };
    if (/Calcule la distance AB|Calcule la distance entre A/.test(t) && A && B) return nrm(sub(B, A));
    if (/Calcule la norme du vecteur/.test(t) && V.length === 1) return nrm(V[0]);
    if ((m = /a-t-il pour norme \\\(([^\\]+)\\\)/.exec(c.raw))) { const W = vecsL(c.raw)[0]; if (!W) return null; const N = val(m[1]), k = W.map((f) => f(0)), idx = W.findIndex((f) => f(1) !== f(0)); const s2 = N * N - k.reduce((s, v, i) => s + (i === idx ? 0 : v * v), 0); return Math.sqrt(s2); }
    if (/centre de gravité/.test(t) && A && B && C) return { P: A.map((a, i) => (a + B[i] + C[i]) / 3) };
    if ((m = /(\w)\((-?[\d,]+) ; (-?[\d,]+)\) est le milieu de \[AB\] avec A\((-?[\d,]+) ; (-?[\d,]+)\)/.exec(t))) return { P: [2 * nn(m[2]) - nn(m[4]), 2 * nn(m[3]) - nn(m[5])] };
    if ((m = /Pour quelle valeur de m les vecteurs/.exec(t)) && /colinéaires/.test(t)) { const W = vecsL(c.raw); if (W.length !== 2) return null; return colM(W); }
    return null;
  });
  /* colinéarité avec une composante inconnue m */
  function colM(W) {
    const [u, v] = W, n = u.length, known = (f) => f(0) === f(1);
    for (let j = 0; j < n; j++) if (known(u[j]) && known(v[j]) && u[j](0)) { const k = v[j](0) / u[j](0); for (let i = 0; i < n; i++) if (!known(u[i]) || !known(v[i])) return lin((m) => v[i](m) - k * u[i](m)); }
    return null;
  }
  O("colin vect3d bases vectmp appllin", (c) => {
    const t = c.txt, V = vecs(c.raw); let m;
    if (/sont colinéaires : v = k u\. Que vaut k/.test(t) && V.length === 2) { const j = V[0].findIndex((a) => a); const k = V[1][j] / V[0][j]; return V[1].every((b, i) => near(b, k * V[0][i])) ? k : { err: "vecteurs non colinéaires" }; }
    if (/Pour quelle valeur de m les vecteurs/.test(t) && /colinéaires/.test(t)) { const W = vecsL(c.raw); return W.length === 2 ? colM(W) : null; }
    if ((m = /Trouve (?:α et β|les nombres a et b) tels que (?:w|t) = (?:α|a) ?u \+ (?:β|b) ?v/.exec(t)) && V.length === 3) {
      const [u, v, w] = V; for (const [i, j] of [[0, 1], [0, 2], [1, 2]]) { if (i >= u.length || j >= u.length) continue; const s = cramer([[u[i], v[i]], [u[j], v[j]]], [w[i], w[j]]); if (s) return u.every((_, k) => near(s[0] * u[k] + s[1] * v[k], w[k])) ? { P: s } : { err: "w n'est pas combinaison de u et v" }; }
      return null;
    }
    if ((m = mt(c, new RegExp(`part de A\\(${NB} ; ${NB} ; ${NB}\\) et passe par B\\(${NB} ; ${NB} ; ${NB}\\) \\(en m\\)\\. À quelle hauteur z passe-t-il à la verticale du point \\(${NB} ; ${NB} ; 0\\)`)))) {
      const A = m.slice(0, 3), B = m.slice(3, 6), u = sub(B, A), k = u[0] ? (m[6] - A[0]) / u[0] : (m[7] - A[1]) / u[1]; return A[2] + k * u[2];
    }
    if (/Pour quelle valeur de m les points A.*sont-ils coplanaires/.test(t)) {
      const P = ["A", "B", "C", "D"].map((n) => ptL(t, n)); if (P.some((p) => !p)) return null;
      return lin((k) => { const [A, B, C, D] = P.map((p) => p(k)); return det3([sub(B, A), sub(C, A), sub(D, A)]); });
    }
    return null;
  });
  /* point sur une droite paramétrique : valeur de t */
  const tOf = (L, P) => { for (let i = 0; i < 3; i++) if (L.t[i]) { const k = (P[i] - L.P0[i]) / L.t[i]; return L.at(k, 0).every((v, j) => near(v, P[j])) ? k : NaN; } return NaN; };
  O("droite3d droiteparam posdroites", (c) => {
    const t = c.txt, K = cases(c.raw).map(param); let m;
    if (!K.length || K.some((k) => !k)) return null; const L = K[0], dim = L.P0.length;
    if ((m = /Le point P\(([^)]*)\) (?:est sur|appartient à) la droite/.exec(t))) {
      const P = m[1].split(" ; "); if (/Pour quelle valeur du paramètre/.test(t)) { const v = P.map(nn); return tOf(L, v); }
      const j = P.findIndex((u) => /^[a-z]$/.test(u.trim())); if (j < 0) return null;
      for (let i = 0; i < dim; i++) if (i !== j && L.t[i]) { const k = (nn(P[i]) - L.P0[i]) / L.t[i]; return L.at(k, 0)[j]; }
      return null;
    }
    if ((m = /passe par B\(([^)]*)\) et est parallèle à la droite d'.*obtenu pour t = (-?\d+)/.exec(t))) { const B = m[1].split(" ; ").map(nn); return { P: add(B, mul(+m[2], L.t)) }; }
    if ((m = /(?:Donne le point de d|Donne le point de la droite .*?|point de d) obtenu pour t = (-?\d+)/.exec(t))) return { P: L.at(+m[1], 0) };
    if ((m = /avec le plan (yOz|xOz|xOy)|coupe-t-elle l'axe des (abscisses|ordonnées)/.exec(t))) { const i = m[1] ? { yOz: 0, xOz: 1, xOy: 2 }[m[1]] : m[2] === "abscisses" ? 1 : 0; if (!L.t[i]) return null; const k = -L.P0[i] / L.t[i]; return { P: L.at(k, 0).map((v) => snap(v)) }; }
    if (K.length === 2 && /sécantes\. Donne leur point d'intersection|sont sécantes\. Donne/.test(t)) {
      const [D1, D2] = K; for (const [i, j] of [[0, 1], [0, 2], [1, 2]]) { const s = cramer([[D1.dir[i], -D2.dir[i]], [D1.dir[j], -D2.dir[j]]], [D2.P0[i] - D1.P0[i], D2.P0[j] - D1.P0[j]]); if (s) { const P = add(D1.P0, mul(s[0], D1.dir)), Q = add(D2.P0, mul(s[1], D2.dir)); return P.every((v, k) => near(v, Q[k])) ? { P: P.map((v) => snap(v)) } : { err: "droites non sécantes" }; } }
      return null;
    }
    if ((m = mt(c, new RegExp(`atteint-il l'altitude de ${NB}`)))) return (m[0] - L.P0[2]) / L.t[2];
    if ((m = /On écrit la droite \(AB\) avec A\(([^)]*)\) comme point de départ et AB comme vecteur directeur, pour B\(([^)]*)\)\. Quel point obtient-on pour t = (-?\d+)/.exec(t))) { const A = m[1].split(" ; ").map(nn), B = m[2].split(" ; ").map(nn); return { P: add(A, mul(+m[3], sub(B, A))) }; }
    return null;
  });
  O("droiteparam", (c) => {
    const t = c.txt; let m;
    if ((m = /On écrit la droite \(AB\) avec A\(([^)]*)\) comme point de départ et AB comme vecteur directeur, pour B\(([^)]*)\)\. Quel point obtient-on pour t = (-?\d+)/.exec(t))) { const A = m[1].split(" ; ").map(nn), B = m[2].split(" ; ").map(nn); return { P: add(A, mul(+m[3], sub(B, A))) }; }
    const V = vecs(c.raw);
    if (/angle aigu entre deux droites de vecteurs directeurs/.test(t) && V.length === 2) return { v: deg(Math.acos(Math.abs(dot(V[0], V[1])) / (nrm(V[0]) * nrm(V[1])))) };
    if ((m = mt(c, new RegExp(`Quelle distance a-t-il parcourue après ${NB} s`))) && V.length === 1) return m[0] * nrm(V[0]);
    return null;
  });
  O("plans sphere posrel", (c) => {
    const t = c.txt, PL = planes(c.raw); let m;
    if ((m = /Le point P\(([^)]*)\) appartient au plan π : ([^.]*= 0)\. Que vaut (\w)/.exec(t))) {
      const s = c.S.find((u) => /^\\pi\s*:/.test(u)); const pl = s && plane(s.replace(/^\\pi\s*:\s*/, "")); if (!pl) return null;
      const P = m[1].split(" ; "), j = P.findIndex((u) => /^[a-z]$/.test(u.trim())); let s0 = pl[3]; P.forEach((u, i) => { if (i !== j) s0 += pl[i] * nn(u); }); return -s0 / pl[j];
    }
    const K = cases(c.raw).map(param).filter(Boolean);
    if ((m = mt(c, new RegExp(`point de π obtenu pour s = ${NB} et t = ${NB}`))) && K.length) return { P: K[0].at(m[1], m[0]) };
    if ((m = /coupe-t-il l'axe O([xyz])/.exec(t)) && PL.length) { const i = "xyz".indexOf(m[1]), p = PL[0], P = [0, 0, 0]; P[i] = -p[3] / p[i]; return { P }; }
    if (/La trace du plan .* dans le plan xOy \(où z = 0\)/.test(t) && PL.length) { const [a, b, , d] = PL[0]; return { E: (x) => -(a * x + d) / b }; }
    if ((m = /passe par A\(([^)]*)\) et est parallèle au plan π/.exec(t)) && PL.length) { const A = m[1].split(" ; ").map(nn); return -(PL[0][0] * A[0] + PL[0][1] * A[1] + PL[0][2] * A[2]); }
    if ((m = mt(c, new RegExp(`passe par les points A\\(${NB} ; ${NB} ; ${NB}\\), B\\(${NB} ; ${NB} ; ${NB}\\) et C\\(${NB} ; ${NB} ; ${NB}\\).*au-dessus du point \\(${NB} ; ${NB} ; 0\\)`)))) {
      const A = m.slice(0, 3), B = m.slice(3, 6), C = m.slice(6, 9), n = cross(sub(B, A), sub(C, A)); return A[2] - (n[0] * (m[9] - A[0]) + n[1] * (m[10] - A[1])) / n[2];
    }
    if (/Écris une équation cartésienne du plan π .* sous la forme x \+ by \+ cz \+ d = 0/.test(t) && K.length) { const n = cross(K[0].s, K[0].t); if (!n[0]) return null; const u = mul(1 / n[0], n); return { P: [u[1], u[2], -dot(u, K[0].P0)] }; }
    return null;
  });
  /* plans avec une lettre (m, k, d) dans l'équation : [a(L), b(L), c(L), d(L)] */
  const planesL = (raw, L) => segs(raw).map((s) => { const mm = /^\\pi(?:_\d|_\{\d\}|')?\s*:\s*([\s\S]*?)=\s*0$/.exec(s); if (!mm) return null; const f = fn(mm[1], ["x", "y", "z", L]); if (!f) return null;
    return (k) => { const d = f({ x: 0, y: 0, z: 0, [L]: k }); return [f({ x: 1, y: 0, z: 0, [L]: k }) - d, f({ x: 0, y: 1, z: 0, [L]: k }) - d, f({ x: 0, y: 0, z: 1, [L]: k }) - d, d]; }; }).filter(Boolean);
  O("posrel", (c) => {
    const t = c.txt; let m;
    if (/Pour quelle valeur de m les plans .* sont-ils parallèles/.test(t)) { const [P1, P2] = planesL(c.raw, "m"); if (!P2) return null; const a = P1(0), b0 = P2(0), b1 = P2(1); const j = [0, 1, 2].find((i) => b0[i] === b1[i] && a[i]); const k = b0[j] / a[j]; const i = [0, 1, 2].find((u) => b0[u] !== b1[u]); return lin((mm) => P2(mm)[i] - k * a[i]); }
    const K = cases(c.raw).map(param).filter(Boolean), PL = planes(c.raw);
    if (/Donne le point d'intersection de la droite d .* et du plan π/.test(t) && K.length && PL.length) { const [a, b, cc, d] = PL[0], L = K[0], n = [a, b, cc], k = -(dot(n, L.P0) + d) / dot(n, L.t); return { P: L.at(k, 0) }; }
    if (/Pour quelle valeur de m une droite de vecteur directeur u = .* est-elle parallèle au plan/.test(t) && PL.length) { const W = vecsL(c.raw)[0]; if (!W) return null; return lin((k) => W.reduce((s, f, i) => s + f(k) * PL[0][i], 0)); }
    if ((m = mt(c, new RegExp(`point de cette droite dont la cote vaut z = ${NB}`))) && PL.length === 2) { const z = m[0], [p, q] = PL; const s = cramer([[p[0], p[1]], [q[0], q[1]]], [-(p[2] * z + p[3]), -(q[2] * z + q[3])]); return s ? { P: [s[0], s[1], z] } : null; }
    if (/Pour quelle valeur de k la droite est-elle contenue dans le plan/.test(t) && K.length) { const [P] = planesL(c.raw, "k"); if (!P) return null; return lin((k) => { const [a, b, cc, d] = P(k); return a * K[0].P0[0] + b * K[0].P0[1] + cc * K[0].P0[2] + d; }); }
    if ((m = mt(c, new RegExp(`lampe ponctuelle est en S\\(${NB} ; ${NB} ; ${NB}\\) ; le sommet d'un poteau vertical est en P\\(${NB} ; ${NB} ; ${NB}\\)`)))) { const S = m.slice(0, 3), P = m.slice(3, 6), u = sub(P, S), k = -S[2] / u[2]; return { P: add(S, mul(k, u)).map((v) => snap(v)) }; }
    if (/point d'intersection des trois plans/.test(t) && PL.length === 3) { const s = cramer(PL.map((p) => p.slice(0, 3)), PL.map((p) => -p[3])); return s ? { P: s } : null; }
    return null;
  });
  O("pscal3d scalmp projmp pvectmp", (c) => {
    const t = c.txt, V = vecs(c.raw), A = pt(t, "A"), B = pt(t, "B"), C = pt(t, "C"); let m;
    if (/(?:Calcule le produit scalaire|Calcule) u · v avec/.test(t) && V.length === 2) return dot(V[0], V[1]);
    if (/Pour quelle valeur de m les vecteurs u = .* et v = .* sont-ils orthogonaux/.test(t)) { const W = vecsL(c.raw); return W.length === 2 ? lin((k) => W[0].reduce((s, f, i) => s + f(k) * W[1][i](k), 0)) : null; }
    if (/Pour quelle valeur de m le triangle de sommets .* est-il rectangle en A/.test(t)) { const P = ["A", "B", "C"].map((n) => ptL(t, n)); if (P.some((p) => !p)) return null; return lin((k) => { const [a, b, cc] = P.map((p) => p(k)); return dot(sub(b, a), sub(cc, a)); }); }
    if ((m = /Le triangle A\(([^)]*)\), B\(([^)]*)\), C\(([^)]*)\) est rectangle en A\. Que vaut (\w)/.exec(t))) { const P = [m[1], m[2], m[3]].map((s) => s.split(" ; ").map((u) => fn(u.trim(), [m[4]]))); if (P.flat().some((f) => !f)) return null; return lin((k) => { const [a, b, cc] = P.map((p) => p.map((f) => f(k))); return dot(sub(b, a), sub(cc, a)); }); }
    if (/Calcule l'angle ∠BAC du triangle/.test(t) && A && B && C) { const u = sub(B, A), v = sub(C, A); return deg(Math.acos(dot(u, v) / (nrm(u) * nrm(v)))); }
    if (/Calcule l'angle entre (?:les vecteurs )?u = .* et v = /.test(t) && V.length === 2) return deg(Math.acos(dot(V[0], V[1]) / (nrm(V[0]) * nrm(V[1]))));
    if (/longueur de la projection orthogonale du vecteur v = .* sur la direction de u = /.test(t) && V.length === 2) return Math.abs(dot(V[0], V[1])) / nrm(V[1]);
    if ((m = /projeté orthogonal (?:du vecteur v = .* sur la droite dirigée par u = |de u = .* sur v = )/.exec(t)) && V.length === 2) { const [p, q] = /de u = /.test(t) ? [V[0], V[1]] : [V[0], V[1]]; return { P: mul(dot(p, q) / dot(q, q), q).map((v) => snap(v)) }; }
    if ((m = /Donne le projeté orthogonal H du point P\(([^)]*)\) sur la droite d/.exec(t))) { const L = cases(c.raw).map(param)[0]; if (!L) return null; const P = m[1].split(" ; ").map(nn), k = dot(sub(P, L.P0), L.t) / dot(L.t, L.t); return { P: L.at(k, 0).map((v) => snap(v)) }; }
    if ((m = /Donne le projeté orthogonal H de P\(([^)]*)\) sur d/.exec(t)) && A && V.length === 1) { const P = m[1].split(" ; ").map(nn), k = dot(sub(P, A), V[0]) / dot(V[0], V[0]); return { P: add(A, mul(k, V[0])).map((v) => snap(v)) }; }
    if ((m = /Décompose u = .* en une partie parallèle à v = .* Donne la partie orthogonale/.exec(t)) && V.length === 2) { const p = mul(dot(V[0], V[1]) / dot(V[1], V[1]), V[1]); return { P: sub(V[0], p).map((v) => snap(v)) }; }
    if ((m = /dimensions AB = (\d+), AD = (\d+) et AE = (\d+)\..*angle entre la diagonale \[AG\] et (l'arête \[A([BDE])\]|la diagonale \[A([CFH])\])/.exec(t))) {
      const [a, b, h] = m.slice(1, 4).map(Number), Gv = [a, b, h], W = { B: [a, 0, 0], D: [0, b, 0], E: [0, 0, h], C: [a, b, 0], F: [a, 0, h], H: [0, b, h] }[m[5] || m[6]];
      return deg(Math.acos(dot(Gv, W) / (nrm(Gv) * nrm(W))));
    }
    if ((m = mt(c, new RegExp(`force de ${NB} N qui fait un angle de ${NB}° avec le sol, sur ${NB} m`)))) return m[0] * m[2] * Math.cos(rad(m[1]));
    if ((m = mt(c, new RegExp(`la force vaut ${NB} N, inclinée de ${NB}° par rapport au canal`)))) return m[0] * Math.cos(rad(m[1]));
    if ((m = /Calcule la distance du point P\(([^)]*)\) à la droite passant par A\(([^)]*)\) de vecteur directeur/.exec(t)) && V.length === 1) { const P = m[1].split(" ; ").map(nn), A0 = m[2].split(" ; ").map(nn), u = V[0], w = sub(P, A0), k = dot(w, u) / dot(u, u); return nrm(sub(w, mul(k, u))); }
    if ((m = /Triangle A\(([^)]*)\), B\(([^)]*)\), C\(([^)]*)\)\. Calcule son aire/.exec(t))) { const [a, b, cc] = [m[1], m[2], m[3]].map((s) => s.split(" ; ").map(nn)); return Math.abs(det2(b[0] - a[0], cc[0] - a[0], b[1] - a[1], cc[1] - a[1])) / 2; }
    return null;
  });
  const distPL = (P, p) => Math.abs(p[0] * P[0] + p[1] * P[1] + p[2] * P[2] + p[3]) / Math.hypot(p[0], p[1], p[2]);
  const distPD = (P, A, u) => nrm(cross(sub(P, A), u)) / nrm(u);
  O("distances pvect pvectmp sphere", (c) => {
    const t = c.txt, PL = planes(c.raw), V = vecs(c.raw), Pt = (n) => pt(t, n); let m;
    if ((m = /Calcule la distance du point P\(([^)]*)\) au plan π/.exec(t)) && PL.length) return distPL(m[1].split(" ; ").map(nn), PL[0]);
    if (/distance entre les plans parallèles/.test(t) && PL.length === 2) { const [p, q] = PL, j = [0, 1, 2].find((i) => q[i]); const P = [0, 0, 0]; P[j] = -q[3] / q[j]; return distPL(P, p); }
    if ((m = /Calcule la distance du point P\(([^)]*)\) à la droite d/.exec(t))) { const L = cases(c.raw).map(param)[0]; return L ? distPD(m[1].split(" ; ").map(nn), L.P0, L.t) : null; }
    if ((m = /Calcule la distance du point (?:M|P)\(([^)]*)\) à la droite passant par A\(([^)]*)\) de vecteur directeur/.exec(t)) && V.length === 1) return distPD(m[1].split(" ; ").map(nn), m[2].split(" ; ").map(nn), V[0]);
    if ((m = /Calcule la distance du point P\(([^)]*)\) à la droite cases/.exec(t))) { const L = cases(c.raw).map(param)[0]; return L ? distPD(m[1].split(" ; ").map(nn), L.P0, L.t) : null; }
    const A = Pt("A"), B = Pt("B"), C = Pt("C"), D = Pt("D");
    if (/(?:Calcule (?:son aire|l'aire du triangle)|Calcule l'aire du triangle)/.test(t) && A && B && C && A.length === 3 && !/parallélogramme/.test(t)) return nrm(cross(sub(B, A), sub(C, A))) / 2;
    if ((m = mt(c, new RegExp(`triangle du plan π : .*, d'aire ${NB}\\. Son sommet est T\\(${NB} ; ${NB} ; ${NB}\\)`))) && PL.length) return (m[0] * distPL(m.slice(1, 4), PL[0])) / 3;
    if ((m = /Pour quelles valeurs de m le point P\(([^)]*)\) est-il à la distance (\d+) du plan π/.exec(t)) && PL.length) { const P = ptL(t, "P"), p = PL[0], N = Math.hypot(p[0], p[1], p[2]), g = (k) => { const Q = P(k); return p[0] * Q[0] + p[1] * Q[1] + p[2] * Q[2] + p[3]; }; const a = g(0), b = g(1) - a, d = +m[2] * N; return { S: [(d - a) / b, (-d - a) / b].map((v) => snap(v)) }; }
    if (/produit mixte/.test(t) && V.length === 3 && /Calcule le produit mixte/.test(t)) return det3(V);
    if (/aire du parallélogramme construit sur u = .* et v = /.test(t) && V.length === 2) { if (V[0].length === 2) return Math.abs(det2(V[0][0], V[1][0], V[0][1], V[1][1])); return nrm(cross(V[0], V[1])); }
    if (/volume du tétraèdre ABCD/.test(t) && A && B && C && D) return Math.abs(det3([sub(B, A), sub(C, A), sub(D, A)])) / 6;
    if (/volume du parallélépipède construit sur/.test(t) && V.length === 3) return Math.abs(det3(V));
    if (/Pour quelle valeur de m les points A.*sont-ils coplanaires/.test(t)) { const P = ["A", "B", "C", "D"].map((n) => ptL(t, n)); if (P.some((p) => !p)) return null; return lin((k) => { const [a, b, cc, d] = P.map((p) => p(k)); return det3([sub(b, a), sub(cc, a), sub(d, a)]); }); }
    if ((m = /Deux droites gauches : d_1 passe par A\(([^)]*)\) avec u = .*, d_2 passe par B\(([^)]*)\) avec v = /.exec(t)) && V.length === 2) { const n = cross(V[0], V[1]); return Math.abs(dot(sub(B, A), n)) / nrm(n); }
    if (/On a calculé u · v = .* Quelle est l'aire du parallélogramme/.test(t) && V.length === 1) return nrm(V[0]);
    if (/parallélogramme construit sur u = .* \(en \w+\)\. On les écrit dans l'espace/.test(t) && V.length === 2) return Math.abs(det2(V[0][0], V[1][0], V[0][1], V[1][1]));
    if (/le bras de levier est r = .* et la force F = .*norme du moment/.test(t) && V.length === 2) return nrm(cross(V[0], V[1]));
    if (/Calcule le vecteur normal n = AB · AC/.test(t) && A && B && C) return { P: cross(sub(B, A), sub(C, A)) };
    if (/forme d'un parallélogramme ABCD avec A\(.*Calcule son aire/.test(t) && A && B && C) return nrm(cross(sub(B, A), sub(C, B)));
    if ((m = /Trouve k pour que les trois points soient alignés/.exec(t))) { const P = ["A", "B", "C"].map((n) => ptL(t, n, "k")); if (P.some((p) => !p)) return null; const u = sub(P[1](0), P[0](0)); const j = [0, 1, 2].find((i) => u[i]); const s = (P[2](0)[j] - P[0](0)[j]) / u[j]; const i = [0, 1, 2].find((q) => P[2](0)[q] !== P[2](1)[q]); return lin((k) => P[2](k)[i] - P[0](0)[i] - s * u[i]); }
    if (/triangle de sommets A.* est rectangle en A .* Calcule son aire/.test(t) && A && B && C) return nrm(cross(sub(B, A), sub(C, A))) / 2;
    return null;
  });
  /* sphères : équation développée ou centrée */
  const sph = (s) => { const mm = /^([\s\S]*?)=\s*([\s\S]+)$/.exec(s); if (!mm || !/x\^2|\(x/.test(mm[1]) || !/z/.test(mm[1])) return null; const f = fn(mm[1], ["x", "y", "z"]), r = val(mm[2]); if (!f || !fin(r)) return null;
    const g = (x, y, z) => f({ x, y, z }) - r, C = [(g(-1, 0, 0) - g(1, 0, 0)) / 4, (g(0, -1, 0) - g(0, 1, 0)) / 4, (g(0, 0, -1) - g(0, 0, 1)) / 4]; return { C, r2: dot(C, C) - g(0, 0, 0) }; };
  O("sphere", (c) => {
    const t = c.txt, S = c.S.map(sph).filter(Boolean), PL = planes(c.raw); let m;
    if ((m = /rayon de la sphère de centre C\(([^)]*)\) qui passe par A\(([^)]*)\)/.exec(t))) return nrm(sub(m[2].split(" ; ").map(nn), m[1].split(" ; ").map(nn)));
    if (/Donne le centre de la sphère/.test(t) && S.length) return { P: S[0].C };
    if (/a quel rayon/.test(t) && S.length) return Math.sqrt(S[0].r2);
    if ((m = /Le plan π passe par A\(([^)]*)\) et admet n = .* comme vecteur normal/.exec(t))) { const n = vecs(c.raw)[0], A = m[1].split(" ; ").map(nn); return -dot(n, A); }
    if ((m = /Le plan médiateur de \[AB\], avec A\(([^)]*)\) et B\(([^)]*)\), a une équation de la forme ([^.]*?) \+ d = 0/.exec(t))) { const A = m[1].split(" ; ").map(nn), B = m[2].split(" ; ").map(nn), s = c.S.find((u) => /\+ d = 0$/.test(u)); const f = s && fn(s.replace(/\+ d = 0$/, ""), ["x", "y", "z"]); if (!f) return null; const n = [f({ x: 1, y: 0, z: 0 }), f({ x: 0, y: 1, z: 0 }), f({ x: 0, y: 0, z: 1 })]; if (!near(Math.abs(dot(n, sub(B, A))), nrm(n) * nrm(sub(B, A)))) return { err: "normale non parallèle à AB" }; return -dot(n, mul(0.5, add(A, B))); }
    if ((m = /Le point T\(([^)]*)\) est sur la sphère de centre C\(([^)]*)\)\. Le plan tangent à la sphère en T a une équation de la forme (-?\d*)x \+ by/.exec(t))) { const T = m[1].split(" ; ").map(nn), C = m[2].split(" ; ").map(nn), n = sub(T, C), a0 = m[3] === "-" ? -1 : m[3] === "" ? 1 : +m[3], k = a0 / n[0]; return { P: [k * n[1], k * n[2], -k * dot(n, T)] }; }
    if (/Pour quelles valeurs de t la droite d .* coupe-t-elle la sphère/.test(t) && S.length) { const L = cases(c.raw).map(param)[0]; if (!L) return null; const w = sub(L.P0, S[0].C), a = dot(L.t, L.t), b = 2 * dot(w, L.t), cc = dot(w, w) - S[0].r2, D = b * b - 4 * a * cc; return { S: D < 0 ? [] : [(-b - Math.sqrt(D)) / (2 * a), (-b + Math.sqrt(D)) / (2 * a)].map((v) => snap(v)) }; }
    if (/coupe le plan π : .* selon un cercle\. Calcule le rayon de ce cercle/.test(t) && S.length && PL.length) { const d = distPL(S[0].C, PL[0]); return Math.sqrt(S[0].r2 - d * d); }
    if ((m = /La sphère de centre C\(([^)]*)\) est tangente au plan π : .* Que vaut r\^2/.exec(t)) && PL.length) { const d = distPL(m[1].split(" ; ").map(nn), PL[0]); return d * d; }
    return null;
  });


  /* compléments (formes rencontrées au balayage) */
  O("colin vect3d", (c) => {
    const t = c.txt; let m;
    if ((m = /Les points A\(([^)]*)\), B\(([^)]*)\) et C\(([^)]*)\) sont alignés\. (?:Que vaut (\w)|Donne (\w) et (\w))/.exec(t))) {
      const A = m[1].split(" ; ").map(nn), B = m[2].split(" ; ").map(nn), Cs = m[3].split(" ; "), u = sub(B, A), j = Cs.findIndex((v, i) => !/^[a-z]$/.test(v.trim()) && u[i]); if (j < 0) return null;
      const k = (nn(Cs[j]) - A[j]) / u[j], P = add(A, mul(k, u)), out = Cs.map((v, i) => (/^[a-z]$/.test(v.trim()) ? P[i] : null)).filter((v) => v !== null);
      return out.length === 1 ? out[0] : { P: out };
    }
    if ((m = /Les points A\(([^)]*)\), B\(([^)]*)\), C\(([^)]*)\) et D\(([^)]*)\) sont coplanaires\. Que vaut (\w)/.exec(t))) { const L = m[5], P = ["A", "B", "C", "D"].map((n) => ptL(t, n, L)); if (P.some((p) => !p)) return null; return lin((k) => { const [a, b, cc, d] = P.map((p) => p(k)); return det3([sub(b, a), sub(cc, a), sub(d, a)]); }); }
    if (/On connaît AB = .* et AC = .*Donne les composantes de BC/.test(t)) { const V = vecs(c.raw); return V.length === 2 ? { P: sub(V[1], V[0]) } : null; }
    if ((m = /Le point B est le symétrique de A\(([^)]*)\) par rapport à M\(([^)]*)\)/.exec(t))) { const A = m[1].split(" ; ").map(nn), M = m[2].split(" ; ").map(nn); return { P: sub(mul(2, M), A) }; }
    return null;
  });
  O("distances", (c) => {
    const t = c.txt, PL = planes(c.raw); let m;
    if (/La droite d : .* est parallèle au plan π : .* Calcule la distance entre d et π/.test(t) && PL.length) { const L = cases(c.raw).map(param)[0]; return L ? distPL(L.P0, PL[0]) : null; }
    if ((m = /relie A\(([^)]*)\) et B\(([^)]*)\) \(en m\)\. Un drone est en P\(([^)]*)\)/.exec(t))) { const [A, B, P] = [m[1], m[2], m[3]].map((u) => u.split(" ; ").map(nn)); return distPD(P, A, sub(B, A)); }
    return null;
  });
  O("droite3d", (c) => {
    const t = c.txt; let m;
    if ((m = /par \(x ; y ; z\) = A \+ t AB, avec A\(([^)]*)\) et B\(([^)]*)\)\. Donne l'expression de ([xyz]) en fonction de t/.exec(t))) { const A = m[1].split(" ; ").map(nn), B = m[2].split(" ; ").map(nn), i = "xyz".indexOf(m[3]); return { E: (k) => A[i] + k * (B[i] - A[i]), v0: "t" }; }
    if ((m = /Pour quelle valeur de m la droite d : .* passe-t-elle par P\(([^)]*)\)/.exec(t))) {
      const rows = (cases(c.raw)[0] || []).map((r) => fn(r.replace(/^[xyz]\s*=\s*/, ""), ["t", "m"])); if (rows.length !== 3 || rows.some((f) => !f)) return null; const P = m[1].split(" ; ").map(nn);
      const i = rows.findIndex((f) => f({ t: 0, m: 0 }) === f({ t: 0, m: 1 }) && f({ t: 1, m: 0 }) === f({ t: 1, m: 1 }) && f({ t: 1, m: 0 }) !== f({ t: 0, m: 0 })); if (i < 0) return null;
      const k = (P[i] - rows[i]({ t: 0, m: 0 })) / (rows[i]({ t: 1, m: 0 }) - rows[i]({ t: 0, m: 0 })), j = rows.findIndex((f) => f({ t: k, m: 0 }) !== f({ t: k, m: 1 })); return lin((mm) => rows[j]({ t: k, m: mm }) - P[j]);
    }
    return null;
  });
  O("plans pvect", (c) => {
    const t = c.txt; let m;
    if ((m = /Le point P\(([^)]*)\) appartient au plan cases/.exec(t))) { const L = cases(c.raw).map(param)[0]; if (!L) return null; const P = m[1].split(" ; "), j = P.findIndex((u) => /^[a-z]$/.test(u.trim())), I = [0, 1, 2].filter((i) => i !== j); const s0 = cramer(I.map((i) => [L.t[i], L.s[i]]), I.map((i) => nn(P[i]) - L.P0[i])); return s0 ? L.P0[j] + s0[0] * L.t[j] + s0[1] * L.s[j] : null; }
    if ((m = /Le plan passant par A\(([^)]*)\), B\(([^)]*)\) et C\(([^)]*)\) a une équation de la forme (-?\d*)x \+ by \+ cz \+ d = 0/.exec(t))) { const [A, B, C] = [m[1], m[2], m[3]].map((u) => u.split(" ; ").map(nn)), n = cross(sub(B, A), sub(C, A)), a0 = m[4] === "" ? 1 : m[4] === "-" ? -1 : +m[4], u = mul(a0 / n[0], n); return { P: [u[1], u[2], -dot(u, A)] }; }
    if ((m = /Écris une équation cartésienne du plan π .* sous la forme (-?\d*)x \+ by \+ cz \+ d = 0/.exec(t))) { const L = cases(c.raw).map(param)[0]; if (!L) return null; const n = cross(L.s, L.t), a0 = m[1] === "" ? 1 : m[1] === "-" ? -1 : +m[1], u = mul(a0 / n[0], n); return { P: [u[1], u[2], -dot(u, L.P0)] }; }
    if ((m = /Le plan passant par A\(([^)]*)\), B\(([^)]*)\) et C\(([^)]*)\) a pour vecteur normal n = .* Son équation s'écrit .* \+ d = 0\. Que vaut d/.exec(t))) { const [A, B, C] = [m[1], m[2], m[3]].map((u) => u.split(" ; ").map(nn)), n = vecs(c.raw)[0]; if (!n || !near(nrm(cross(n, cross(sub(B, A), sub(C, A)))), 0)) return { err: "n n'est pas normal au plan ABC" }; return -dot(n, A); }
    if (/Calcule le produit vectoriel u · v avec/.test(t)) { const V = vecs(c.raw); return V.length === 2 ? { P: cross(V[0], V[1]) } : null; }
    return null;
  });
  O("posrel", (c) => {
    const t = c.txt; let m;
    if ((m = /La droite \(AB\), avec A\(([^)]*)\) et B\(([^)]*)\), perce le plan π/.exec(t))) { const PL = planes(c.raw); if (!PL.length) return null; const A = m[1].split(" ; ").map(nn), u = sub(m[2].split(" ; ").map(nn), A), [a, b, cc, d] = PL[0], k = -(a * A[0] + b * A[1] + cc * A[2] + d) / (a * u[0] + b * u[1] + cc * u[2]); return { P: add(A, mul(k, u)).map((v) => snap(v)) }; }
    if (/Pour quelle valeur de m les droites d_1 : .* et d_2 : .* sont-elles sécantes/.test(t)) {
      const K = cases(c.raw).map((rows) => rows.map((r) => fn(r.replace(/^[xyz]\s*=\s*/, ""), ["t", "s", "m"]))); if (K.length !== 2 || K.flat().some((f) => !f)) return null;
      const g = (D, k, l, mm) => D.map((f) => f({ t: k, s: l, m: mm })), i0 = [0, 1, 2].filter((i) => K.every((D) => D[i]({ t: 1, s: 1, m: 0 }) === D[i]({ t: 1, s: 1, m: 1 })));
      if (i0.length < 2) return null; const [i, j] = i0, A0 = g(K[0], 0, 0, 0), a = sub(g(K[0], 1, 0, 0), A0).map((v, q) => v + sub(g(K[0], 0, 1, 0), A0)[q]), B0 = g(K[1], 0, 0, 0), b = sub(g(K[1], 1, 0, 0), B0).map((v, q) => v + sub(g(K[1], 0, 1, 0), B0)[q]);
      const sol = cramer([[a[i], -b[i]], [a[j], -b[j]]], [B0[i] - A0[i], B0[j] - A0[j]]); if (!sol) return null; const z = [0, 1, 2].find((q) => q !== i && q !== j);
      return lin((mm) => { const P = add(g(K[0], 0, 0, mm), mul(sol[0], a)), Q = add(g(K[1], 0, 0, mm), mul(sol[1], b)); return P[z] - Q[z]; });
    }
    return null;
  });
  O("probaxiomes probarbre", (c) => {
    const t = c.txt; let m;
    if ((m = mt(c, new RegExp(`avec la probabilité ${NB},? à chaque (?:tir|lancer|essai)(?:,)? (?:et )?indépendamment\\. Quelle est la probabilité qu'(?:elle|il|on) [^?]* pour la première fois au ${NB}e`)))) return (1 - m[0]) ** (m[1] - 1) * m[0];
    if ((m = mt(c, new RegExp(`passe ${NB} feux indépendants ; chacun est rouge avec la probabilité ${NB}\\. Quelle est la probabilité qu'elle rencontre au moins un feu rouge`)))) return 1 - (1 - m[1]) ** m[0];
    if ((m = mt(c, new RegExp(`avec la probabilité ${NB} à chaque tir, indépendamment\\. Il tire ${NB} fois\\. Quelle est la probabilité qu'il touche la cible au moins une fois`)))) return 1 - (1 - m[0]) ** m[1];
    if ((m = mt(c, new RegExp(`germe avec la probabilité ${NB}\\. On plante ${NB} graines \\(indépendantes\\)\\. Quelle est la probabilité qu'au moins une graine germe`)))) return 1 - (1 - m[0]) ** m[1];
    if ((m = mt(c, new RegExp(`contient ${NB} \\S+ \\S+ et ${NB} \\S+ \\S+\\. On en tire trois, l'une après l'autre, sans remise\\. Quelle est la probabilité qu'elles soient toutes de la même couleur`)))) { const [a, b] = m, n = a + b; return (a * (a - 1) * (a - 2) + b * (b - 1) * (b - 2)) / (n * (n - 1) * (n - 2)); }
    if ((m = mt(c, new RegExp(`groupe de ${NB} personnes, chacune est née un mois au hasard \\(12 mois équiprobables\\)\\. Quelle est la probabilité que toutes soient nées des mois différents`)))) { let p = 1; for (let i = 0; i < m[0]; i++) p *= (12 - i) / 12; return p; }
    if ((m = mt(c, new RegExp(`Un code de ${NB} chiffres \\(de 0 à 9\\) est choisi au hasard\\. Quelle est la probabilité que tous ses symboles soient différents`)))) { let p = 1; for (let i = 0; i < m[0]; i++) p *= (10 - i) / 10; return p; }
    if ((m = /contient (\d+) \S+ (\S+) et (\d+) \S+ (\S+)\. On en tire deux simultanément\. Quelle est la probabilité d'obtenir deux \S+ (\S+) \?/.exec(t))) { const a = +m[1], b = +m[3], w = m[5], T = Cn(a + b, 2); return w === m[2] ? Cn(a, 2) / T : w === m[4] ? Cn(b, 2) / T : null; }
    if (/jeu de jass de 36 cartes/.test(t) && (m = /tirer une? (?:cœur|carreau|trèfle|pique) ((?:ou une? (?:as|roi|valet|dame|dix|six|sept|huit|neuf|\d+) ?)+)\?/.exec(t))) { const r = (m[1].match(/une? /g) || []).length; return (9 + 3 * r) / 36; }
    if (/On lance deux dés équilibrés/.test(t) && (m = /somme d'au moins (\d+)/.exec(t))) { let k = 0; for (let i = 1; i <= 6; i++) for (let j = 1; j <= 6; j++) if (i + j >= +m[1]) k++; return k / 36; }
    return null;
  });


  /* ================= 4e Collège : intégrales, primitives, équations différentielles ================= */
  /* \int_a^b corps \,dx → [a, b, corps, variable] */
  function intSeg(s) {
    const i = s.indexOf("\\int"); if (i < 0) return null; let j = i + 4;
    const grp = () => { while (s[j] === " ") j++; if (s[j] === "{") { let d = 0, k = j; for (; k < s.length; k++) { if (s[k] === "{") d++; else if (s[k] === "}" && --d === 0) break; } const g = s.slice(j + 1, k); j = k + 1; return g; } if (s[j] === "\\") { const mm = /^\\[a-zA-Z]+/.exec(s.slice(j)); j += mm[0].length; return mm[0]; } return s[j++]; };
    if (s[j] !== "_") return null; j++; const a = grp(); while (s[j] === " ") j++; if (s[j] !== "^") return null; j++; const b = grp();
    const rest = s.slice(j), mm = /^([\s\S]*?)\\?,?\s*\\?,?\s*\\?(?:mathrm\{)?d\}?([a-z])\s*$/.exec(rest.replace(/\\,/g, " ").trim()); if (!mm) return null;
    return [val(a), val(b), mm[1].trim(), mm[2]];
  }
  O("integrale intparties intsubst aireint densite", (c) => {
    const S = c.S.map(intSeg).filter(Boolean), t = c.txt; let m;
    if (/^Calcule/.test(t) && S.length === 1 && !/On sait que/.test(t)) {
      const [a, b, body, v] = S[0]; let f = fn(body.replace(/^\((.*)\)$/, "$1"), [v]);
      if (!f && /^f\(x\)$/.test(body) && c.D.f) f = c.D.f; if (!f && /f\(x\)/.test(body)) return null;
      if (!f || !fin(a) || !fin(b)) return null; return snap(integ(f, a, b), 1e-9);
    }
    if (/Calcule \\\(\\int.*grâce à l'aire du domaine coloré/.test(c.raw) && S.length && c.D.f) return snap(integ(c.D.f, S[0][0], S[0][1]), 1e-9);
    if (/On sait que/.test(t) && S.length === 3) { const [I1, I2, I3] = S, V = segs(c.raw).filter((u) => /\\int/.test(u)).map((u) => val(u.split("=")[1] || "")); /* ∫_a^b + ∫_b^c */
      if (I1[1] === I2[0] && I3[0] === I1[0] && I3[1] === I2[1]) return V[0] + V[1]; if (I1[0] === I3[0] && I3[1] === I2[1] && I1[1] === I2[0]) return V[0] + V[1]; return null; }
    return null;
  });
  O("integrale", (c) => {
    const t = c.txt, D = c.D; let m; const f = Object.values(D)[0]; if (!f) return null;
    if ((m = mt(c, new RegExp(`Entre ${NB} h et ${NB} h après`))) && /moyenne/.test(t)) return snap(integ(f, m[0], m[1]) / (m[1] - m[0]), 1e-9);
    if (/jusqu'à l'arrêt\. Quelle distance/.test(t)) { const T = zeros(f).filter((u) => u > 0)[0]; return snap(integ(f, 0, T), 1e-9); }
    if ((m = mt(c, new RegExp(`se remplit pendant ${NB} min`)))) return snap(integ(f, 0, m[0]), 1e-9);
    return null;
  });
  O("aireint", (c) => {
    const t = c.txt, D = c.D; let m;
    const ys = c.S.map((u) => { const mm = /^y = ([\s\S]+)$/.exec(u); return mm ? fn(mm[1]) : null; }).filter(Boolean);
    const between = (f, g) => { const d = (u) => f(u) - g(u), Z = zeros(d); if (Z.length < 2) return NaN; let s = 0; for (let i = 0; i + 1 < Z.length; i++) s += Math.abs(integ(d, Z[i], Z[i + 1])); return snap(s, 1e-8); };
    if ((m = mt(c, new RegExp(`et les droites x = ${NB} et x = ${NB}`))) && D.f) { const Z = zeros(D.f).filter((u) => u > m[0] && u < m[1]), B = [m[0], ...Z, m[1]]; let s = 0; for (let i = 0; i + 1 < B.length; i++) s += Math.abs(integ(D.f, B[i], B[i + 1])); return snap(s, 1e-8); }
    if ((m = mt(c, new RegExp(`aire totale du domaine compris entre la courbe de f\\(x\\) = .* et l'axe des abscisses, entre x = ${NB} et x = ${NB}`))) && D.f) { const Z = zeros(D.f).filter((u) => u > m[0] && u < m[1]), B = [m[0], ...Z, m[1]]; let s = 0; for (let i = 0; i + 1 < B.length; i++) s += Math.abs(integ(D.f, B[i], B[i + 1])); return snap(s, 1e-8); }
    if (/aire totale du domaine compris entre la courbe de f\(x\) = .* et l'axe des abscisses\.$/.test(t) && D.f) return between(D.f, () => 0);
    if (/compris entre les courbes de f\(x\) = .* et g\(x\) = /.test(t) && D.f && D.g) return between(D.f, D.g);
    if (/compris entre (?:la parabole|les courbes|la courbe) y = .* et (?:la droite |)y = /.test(t) && ys.length === 2) return between(ys[0], ys[1]);
    if ((m = /Pour quel nombre a > 0 l'aire sous la (?:parabole|courbe) y = .* entre x = 0 et x = a, vaut-elle (\d+(?:,\d+)?)/.exec(t)) && ys.length) { const A = nn(m[1]), r = zeros((a) => (a > 0 ? integ(ys[0], 0, a) - A : NaN)).filter((u) => u > 0); return r.length === 1 ? snap(r[0], 1e-7) : null; }
    return null;
  });
  O("volrev", (c) => {
    const t = c.txt, D = c.D; let m;
    const ys = c.S.map((u) => { const mm = /^y = ([\s\S]+)$/.exec(u); return mm ? fn(mm[1]) : null; }).filter(Boolean);
    if ((m = mt(c, new RegExp(`entre x = ${NB} et x = ${NB}`))) && D.f) return { v: Math.PI * integ((u) => D.f(u) ** 2, m[0], m[1]) };
    if ((m = mt(c, new RegExp(`\\(pour ${NB} ≤ x ≤ ${NB}\\) tourne autour de l'axe des abscisses`))) && ys.length === 2) return { v: Math.PI * Math.abs(integ((u) => ys[0](u) ** 2 - ys[1](u) ** 2, m[0], m[1])) };
    return null;
  });
  /* primitives : F(x) = ∫_a^x f + b, vérifiée par dérivation */
  O("primitives intparties intsubst", (c) => {
    const t = c.txt, D = c.D; let m;
    if ((m = /Les primitives de \\\(f\(x\) = ([^]*?)\\\) s'écrivent \\\(F\(x\) = ([^]*?)\\\)\. Trouve la constante \\\(C\\\) pour que \\\(F\(([^)]*)\) = ([^\\]*)\\\)/.exec(c.raw))) {
      const f = fn(m[1]), F = fn(m[2], ["x", "C"]); if (!f || !F) return null; const a = val(m[3]), b = val(m[4]);
      if (![-1.3, 0.4, 2.1].every((u) => near(d1((v) => F({ x: v, C: 0 }), u), f(u), 1e-6))) return { err: "F' ≠ f" }; return b - F({ x: a, C: 0 });
    }
    if (/est une primitive de f\. Donne f\(x\)/.test(t) && D.F) return { E: (u) => d1(D.F, u) };
    const f = D.f;
    if ((m = mt(c, new RegExp(`Soit F la primitive de f\\(x\\) = .* telle que F\\(${NB}\\) = ${NB}\\. Calcule F\\(${NB}\\)`))) && f) return snap(m[1] + integ(f, m[0], m[2]), 1e-9);
    if ((m = mt(c, new RegExp(`et F sa primitive telle que F\\(${NB}\\) = ${NB}\\. Calcule F\\(${NB}\\)`))) && f) return snap(m[1] + integ(f, m[0], m[2]), 1e-9);
    if ((m = /Donne la primitive \\\(F\\\) de \\\(f\(x\) = [^]*?\\\)(?: \(pour \\\(x (?:>|\\geq?) 0\\\)\))? (?:qui s'annule en \\\(x = ([^\\]*(?:\\frac\{[^}]*\}\{[^}]*\})?[^\\]*)\\\)|qui vérifie \\\(F\(([^)]*)\) = 0\\\))/.exec(c.raw)) && f) {
      const a = val(m[1] !== undefined ? m[1] : m[2]); if (!fin(a)) return null; const pos = /x > 0|x \\geq? 0/.test(c.raw);
      return { E: (u) => integ(f, a, u), pos, pts: pos ? [0.7, 1.3, 2.2, 3.7] : [-2.3, -1.1, 0.7, 1.6, 2.9] };
    }
    if ((m = mt(c, new RegExp(`a pour pente .* La courbe passe par \\(${NB} ; ${NB}\\)\\. Que vaut F\\(${NB}\\)`)))) { const s = m1(c, /a pour pente \\\(([^\\]*)\\\)/); const g = s && fn(s[0]); if (!g) return null; return snap(m[1] + integ(g, m[0], m[2]), 1e-9); }
    return null;
  });
  /* équations différentielles y' = a y + b (ou g(x)) */
  const odeRHS = (s) => { const mm = /^([a-zA-Z])'\s*=\s*([\s\S]+)$/.exec(s); if (!mm) return null; const y = mm[1], f = fn(mm[2], [y, "x", "b", "k", "t"]); return f ? { y, f: (Y, X = 0, B = 0) => f({ [y]: Y, x: X, b: B, k: 0, t: X }), tex: mm[2] } : null; };
  O("eqdiff", (c) => {
    const t = c.txt, E = c.S.map(odeRHS).filter(Boolean)[0]; let m;
    if ((m = mt(c, new RegExp(`(?:Donne la solution de|Résous) [a-z]' = .* qui vérifie y\\(0\\) = ${NB}`))) && E) { const a = E.f(1) - E.f(0), b = E.f(0), y0 = m[0]; return { E: (u) => (y0 + b / a) * Math.exp(a * u) - b / a }; }
    if ((m = /Pour toute constante \\\(C\\\), la fonction \\\(y\(x\) = ([^]*?)\\\) est solution de \\\(y' = ([^]*?)\\\)\. Trouve \\\(b\\\)/.exec(c.raw))) { const Y = fn(m[1], ["x", "C"]), F = fn(m[2], ["y", "b"]); if (!Y || !F) return null; return lin((b) => d1((u) => Y({ x: u, C: 1 }), 0.3) - F({ y: Y({ x: 0.3, C: 1 }), b })); }
    if ((m = mt(c, new RegExp(`vérifie y' = ky, y\\(0\\) = ${NB} et y\\(${NB}\\) = ${NB}\\. Trouve k`)))) return Math.log(m[2] / m[0]) / m[1];
    if (/Vers quelle (?:valeur|vitesse limite)/.test(t) && E) { const a = E.f(1) - E.f(0), b = E.f(0); return snap(-b / a, 1e-9); }
    if ((m = /Trouve la solution particulière de la forme \\\(p\(x\) = mx \+ q\\\) de l'équation \\\(y' = ([^]*?) \+ g\(x\)\\\) avec \\\(g\(x\) = ([^]*?)\\\)/.exec(c.raw))) { const A = fn(m[1], ["y"]), g = fn(m[2]); if (!A || !g) return null; const a = A(1) - A(0), al = g(1) - g(0), be = g(0), mm = -al / a, q = (mm - be) / a; return { E: (u) => mm * u + q }; }
    if ((m = mt(c, new RegExp(`T' = -k\\(T - ${NB}\\).*Il est à ${NB} °C au départ et à ${NB} °C après ${NB} minutes`)))) return Math.log((m[1] - m[0]) / (m[2] - m[0])) / m[3];
    if ((m = /Résous \\\(y' = ([^]*?)\\\) avec \\\(y\(0\) = ([^\\]*)\\\)/.exec(c.raw))) {
      const F = fn(m[1], ["y", "x"]), y0 = val(m[2]); if (!F) return null;
      const rk = (X) => { let y = y0, x = 0; const N = 400, h = X / N; for (let i = 0; i < N; i++) { const k1 = F({ y, x }), k2 = F({ y: y + (h / 2) * k1, x: x + h / 2 }), k3 = F({ y: y + (h / 2) * k2, x: x + h / 2 }), k4 = F({ y: y + h * k3, x: x + h }); y += (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4); x += h; } return y; };
      return { E: rk, pts: [0.05, 0.1, 0.2, 0.3] };
    }
    return null;
  });
  O("croissance lnexp croissexp explogfn", (c) => {
    const t = c.txt; let m;
    if ((m = mt(c, new RegExp(`demi-vie d[ue] .* est ${NB} (?:jours|ans|heures|minutes)\\. Il y en a ${NB} g au départ\\..* après ${NB} (?:jours|ans|heures|minutes)`)))) return m[1] * 2 ** (-m[2] / m[0]);
    if ((m = mt(c, new RegExp(`ne contient plus que ${NB} % du carbone 14 .* demi-vie du carbone 14 est ${NB} ans`)))) return (m[1] * Math.log(m[0] / 100)) / Math.log(0.5);
    if ((m = mt(c, new RegExp(`Au départ, on compte ${NB} \\S+ ; après ${NB} heures, il y en a ${NB}\\..*que vaut k`)))) return Math.log(m[2] / m[0]) / m[1];
    if ((m = mt(c, new RegExp(`Un capital rapporte ${NB} % d'intérêts par an \\(composés\\)\\. Au bout de combien d'années double-t-il`)))) return Math.log(2) / Math.log(1 + m[0] / 100);
    const f = Object.values(c.D)[0];
    if (f && (m = mt(c, new RegExp(`combien vaut N'\\(${NB}\\)`)))) return d1(f, m[0]);
    if (f && (m = mt(c, new RegExp(`Après combien de (?:jours|heures|semaines) atteint-elle ${NB}`)))) { const r = zeros((u) => f(u) - m[0]).filter((u) => u > 0); return r.length === 1 ? r[0] : null; }
    if (f && (m = mt(c, new RegExp(`Que vaut N\\(${NB}\\)`)))) return f(m[0]);
    if (f && (m = mt(c, new RegExp(`Quand atteint-on ${NB} % du maximum ${NB}`)))) { const r = zeros((u) => f(u) - (m[0] / 100) * m[1]).filter((u) => u > 0); return r.length === 1 ? r[0] : null; }
    return null;
  });

  /* ================= 4e Collège : matrices, applications linéaires, bases, systèmes ================= */
  const mmul = (A, B) => A.map((r) => B[0].map((_, j) => r.reduce((s, a, k) => s + a * B[k][j], 0)));
  const matsL = (raw, L) => [...String(raw).matchAll(/\\begin\{pmatrix\}([\s\S]*?)\\end\{pmatrix\}/g)].map((mm) => mm[1].split(/\\\\/).map((r) => r.split("&").map((cc) => fn(cc.trim(), [L]))));
  const sq2 = (M) => M.length === 2 && M.every((r) => r.length === 2);
  /* système « ax + by = c » (lignes d'un cases) → [A, b] */
  const linsys = (rows, vs = ["x", "y", "z"]) => { const A = [], b = []; for (const r of rows) { const mm = /^([\s\S]*?)=\s*([\s\S]+)$/.exec(r.replace(/&/g, "")); if (!mm) return null; const f = fn(mm[1], vs), rhs = val(mm[2]); if (!f || !fin(rhs)) return null; const z = Object.fromEntries(vs.map((v) => [v, 0])), c0 = f(z); A.push(vs.map((v) => f({ ...z, [v]: 1 }) - c0)); b.push(rhs - c0); } return [A, b]; };
  O("matrices translin appllin syslin bases", (c) => {
    const t = c.txt, M = mats(c.raw), raw = c.raw; let m;
    const Ms = M.filter((X) => X[0].length > 1), V = M.filter((X) => X[0].length === 1).map((X) => X.map((r) => r[0]));
    if (/^Calcule \\\(\\begin\{pmatrix\}[^]*\\end\{pmatrix\}\s*\\begin\{pmatrix\}/.test(raw) && Ms.length === 1 && V.length === 1) return { P: mmul(Ms[0], V[0].map((v) => [v])).map((r) => r[0]) };
    if ((m = /Calcule le déterminant de \\\((?:A = )?\\begin/.exec(raw)) && Ms.length === 1) return Ms[0].length === 2 ? det2(Ms[0][0][0], Ms[0][0][1], Ms[0][1][0], Ms[0][1][1]) : det3(Ms[0]);
    if ((m = /Calcule le déterminant de la matrice des coefficients/.exec(raw)) && Ms.length === 1) return Ms[0].length === 2 ? det2(Ms[0][0][0], Ms[0][0][1], Ms[0][1][0], Ms[0][1][1]) : det3(Ms[0]);
    const row = /donne la (première|deuxième) ligne/i.exec(t), ri = row ? (row[1] === "première" ? 0 : 1) : -1;
    if (row && /de l'inverse de/.test(t) && Ms.length === 1) { const [[a, b], [cc, d]] = Ms[0], D = det2(a, b, cc, d), I = [[d / D, -b / D], [-cc / D, a / D]]; return { P: I[ri] }; }
    if (row && /du produit AB/.test(t) && Ms.length === 2) return { P: mmul(Ms[0], Ms[1])[ri] };
    if (row && (m = /donne la (?:première|deuxième) ligne de \\\(([^\\]*)\\\)/.exec(raw)) && Ms.length === 2 && /[AB]/.test(m[1]) && !/\^/.test(m[1])) { const f = fn(m[1], ["A", "B"]); if (!f) return null; return { P: Ms[0][ri].map((_, j) => f({ A: Ms[0][ri][j], B: Ms[1][ri][j] })) }; }
    if (row && /A\^2 = A · A|A\^2/.test(t) && Ms.length === 1) return { P: mmul(Ms[0], Ms[0])[ri] };
    if (/Pour quelle valeur de \\\(m\\\) la matrice/.test(raw) && /n'est-elle pas inversible/.test(t)) { const W = matsL(raw, "m")[0]; return W ? lin((k) => det2(W[0][0](k), W[0][1](k), W[1][0](k), W[1][1](k))) : null; }
    if ((m = /On sait que \\\(\\det\s*A = (-?\d+)\\\)(?: et \\\(\\det\s*B = (-?\d+)\\\))?[^.]*\. Que vaut \\\(\\det\s*\(([^\\]*)\)\\\)/.exec(raw))) {
      const a = +m[1], b = m[2] !== undefined ? +m[2] : NaN, e = m[3].trim(), n = /2 × 2|2 \\times 2/.test(raw) || !/3 × 3/.test(raw) ? 2 : 3;
      if (e === "AB" || e === "BA") return a * b; if ((m = /^(-?\d*)A$/.exec(e))) { const k = m[1] === "-" ? -1 : +m[1]; return k ** n * a; } if (e === "A^{-1}" || e === "A^-1") return 1 / a; if ((m = /^A\^\{?(\d+)\}?$/.exec(e))) return a ** +m[1]; if (/^A\^\{?T\}?$/.test(e)) return a; return null;
    }
    return null;
  });
  O("translin appllin", (c) => {
    const t = c.txt, M = mats(c.raw).filter((X) => X[0].length > 1); let m;
    if ((m = /Donne l'image du point P\(([^)]*)\)/.exec(t)) && M.length === 1) { const P = m[1].split(" ; ").map(nn); return { P: mmul(M[0], P.map((v) => [v])).map((r) => r[0]) }; }
    if ((m = mt(c, new RegExp(`d'aire ${NB} (?:unités²|unités\\^2)? ?est transformée? par l'application linéaire de matrice`))) && M.length === 1) return Math.abs(det2(M[0][0][0], M[0][0][1], M[0][1][0], M[0][1][1])) * m[0];
    if ((m = /envoie le point P sur Q\(([^)]*)\)\. Retrouve P/.exec(t)) && M.length === 1) { const s = cramer(M[0], m[1].split(" ; ").map(nn)); return s ? { P: s } : null; }
    if ((m = /envoie \(1 ; 0\) sur \(([^)]*)\) et \(0 ; 1\) sur \(([^)]*)\)\. Image de P\(([^)]*)\)/.exec(t))) { const [a, b, P] = [m[1], m[2], m[3]].map((u) => u.split(" ; ").map(nn)); return { P: add(mul(P[0], a), mul(P[1], b)) }; }
    if ((m = mt(c, new RegExp(`Un triangle d'aire ${NB} subit la transformation de matrice`))) && M.length === 2) return M.reduce((s, X) => s * Math.abs(det2(X[0][0], X[0][1], X[1][0], X[1][1])), m[0]);
    if ((m = mt(c, new RegExp(`transforme un carré d'aire ${NB} en une figure d'aire ${NB}\\. Que vaut k`)))) { const W = matsL(c.raw, "k")[0]; return W ? lin((k) => det2(W[0][0](k), W[0][1](k), W[1][0](k), W[1][1](k)) - m[1] / m[0]) : null; }
    return null;
  });
  O("appllin bases", (c) => {
    const t = c.txt, raw = c.raw; let m;
    if (/Son noyau est la droite des vecteurs .* engendrée par \(1 ; m\)\. Que vaut m/.test(t)) { const A = mats(raw)[0]; if (!A) return null; if (Math.abs(det2(A[0][0], A[0][1], A[1][0], A[1][1])) > 1e-9) return { err: "matrice inversible" }; const r = A[0][1] ? A[0] : A[1]; const k = -r[0] / r[1]; return A.every((q) => near(q[0] + q[1] * k, 0)) ? k : { err: "(1 ; m) hors du noyau" }; }
    if (/Pour la valeur de \\\(t\\\) qui rend la matrice non inversible, le noyau est engendré par \(1 ; m\)/.test(raw)) { const W = matsL(raw, "t")[0]; if (!W) return null; const tv = lin((k) => det2(W[0][0](k), W[0][1](k), W[1][0](k), W[1][1](k))), A = W.map((r) => r.map((f) => f(tv))); const r = A[0][1] ? A[0] : A[1], k = -r[0] / r[1]; return A.every((q) => near(q[0] + q[1] * k, 0)) ? k : { err: "(1 ; m) hors du noyau" }; }
    if (/son image est une droite passant par l'origine, d'équation y = mx\. Que vaut m/.test(t)) { const A = mats(raw)[0]; if (!A) return null; const col = A[0][0] || A[1][0] ? [A[0][0], A[1][0]] : [A[0][1], A[1][1]]; return col[1] / col[0]; }
    if ((m = /Dans la base B = \( ?u ; v\) avec u = \(([^)]*)\) et v = \(([^)]*)\), le vecteur w a pour composantes \(([^)]*)\)\. Donne ses coordonnées dans la base canonique/.exec(t))) { const [u, v, w] = [m[1], m[2], m[3]].map((s) => s.split(" ; ").map(nn)); return { P: add(mul(w[0], u), mul(w[1], v)) }; }
    if ((m = /Base B : u = \(([^)]*)\), v = \(([^)]*)\)\. Donne les composantes \(α ; β\) de w = \(([^)]*)\)/.exec(t))) { const [u, v, w] = [m[1], m[2], m[3]].map((s) => s.split(" ; ").map(nn)), s = cramer([[u[0], v[0]], [u[1], v[1]]], w); return s ? { P: s } : null; }
    if ((m = /f vérifie f\(([^)]*)\) = \(([^)]*)\) et f\(([^)]*)\) = \(([^)]*)\)\. Calcule f\(([^)]*)\)/.exec(t))) { const [a, fa, b, fb, w] = m.slice(1, 6).map((s) => s.split(" ; ").map(nn)), s = cramer([[a[0], b[0]], [a[1], b[1]]], w); return s ? { P: add(mul(s[0], fa), mul(s[1], fb)) } : null; }
    const V = vecs(raw);
    if (/forment une base (?:du plan|de l'espace)\. Donne les composantes de (?:w|t) = /.test(t) && V.length >= 3) { const W = V.slice(0, -1), w = V[V.length - 1], s = cramer(w.map((_, i) => W.map((u) => u[i])), w); return s ? { P: s } : null; }
    if (/Pour quelle valeur de m les vecteurs u = .* sont-ils coplanaires/.test(t)) { const W = vecsL(raw); if (W.length !== 3) return null; return lin((k) => det3(W.map((u) => u.map((f) => f(k))))); }
    if ((m = /Le vecteur w a pour composantes \(([^)]*)\) dans la base u = .*, v = .*\. Donne ses composantes dans la base u' = /.exec(t)) && V.length === 4) { const k = m[1].split(" ; ").map(nn), w = add(mul(k[0], V[0]), mul(k[1], V[1])), s = cramer([[V[2][0], V[3][0]], [V[2][1], V[3][1]]], w); return s ? { P: s } : null; }
    if (/Pour quelle valeur de r le vecteur .* appartient-il au sous-espace engendré par/.test(t)) { const W = vecsL(raw, "r"); if (W.length !== 3) return null; const [w, u, v] = W.map((q) => q.map((f) => f(0))); const s = cramer([[u[0], v[0]], [u[1], v[1]]], [w[0], w[1]]); return s ? s[0] * u[2] + s[1] * v[2] : null; }
    return null;
  });
  O("syslin matrices", (c) => {
    const t = c.txt, raw = c.raw, K = cases(raw); let m;
    if (!K.length) {
      if ((m = mt(c, new RegExp(`à ${NB} CHF, .* à ${NB} CHF\\. On a ${NB} .* pour (?:une recette|un prix total|un montant) de ${NB} CHF`)))) { const s = cramer([[1, 1], [m[0], m[1]]], [m[2], m[3]]); return s ? { P: s } : null; }
      return null;
    }
    const L = linsys(K[0], /z/.test(K[0].join(" ")) ? ["x", "y", "z"] : ["x", "y"]);
    if (L) {
      const [A, b] = L, n = A.length, D = n === 2 ? det2(A[0][0], A[0][1], A[1][0], A[1][1]) : det3(A);
      if (/Calcule \\\(\\det\s*A\\\)|Calcule \\\(\\det A\\\)/.test(raw)) return D;
      if ((m = /calcule le déterminant \\\(D_([xyz])\\\)/.exec(raw))) { const j = "xyz".indexOf(m[1]), Mx = A.map((r, i) => r.map((v, k) => (k === j ? b[i] : v))); return n === 2 ? det2(Mx[0][0], Mx[0][1], Mx[1][0], Mx[1][1]) : det3(Mx); }
      if ((m = /et donne \\\(([xyz])\\\)/.exec(raw))) { const s = cramer(A, b); return s ? s["xyz".indexOf(m[1])] : null; }
      if (/Réponds « x ; y(?: ; z)? »/.test(t) && /Résous/.test(t)) { const s = cramer(A, b); return s ? { P: s } : null; }
    }
    if (/Pour quelle valeur de \\\(m\\\) le système/.test(raw) && /n'a-t-il pas une solution unique/.test(t)) { const rows = K[0].map((r) => fn(r.replace(/=.*$/, ""), ["x", "y", "m"])); if (rows.some((f) => !f)) return null; return lin((k) => { const A = rows.map((f) => { const c0 = f({ x: 0, y: 0, m: k }); return [f({ x: 1, y: 0, m: k }) - c0, f({ x: 0, y: 1, m: k }) - c0]; }); return det2(A[0][0], A[0][1], A[1][0], A[1][1]); }); }
    if (/Pour quelles valeurs de \\\(m\\\) et de \\\(k\\\) a-t-il une infinité de solutions/.test(raw)) {
      const rows = K[0].map((r) => { const mm = /^([\s\S]*?)=\s*([\s\S]+)$/.exec(r); return mm ? [fn(mm[1], ["x", "y", "m"]), fn(mm[2], ["k"])] : null; }); if (rows.some((q) => !q || !q[0] || !q[1])) return null;
      const co = (f, k) => { const c0 = f({ x: 0, y: 0, m: k }); return [f({ x: 1, y: 0, m: k }) - c0, f({ x: 0, y: 1, m: k }) - c0]; };
      const mv = lin((k) => { const a = co(rows[0][0], k), b = co(rows[1][0], k); return det2(a[0], a[1], b[0], b[1]); }), a = co(rows[0][0], mv), b = co(rows[1][0], mv), r = a[0] ? b[0] / a[0] : b[1] / a[1];
      return { P: [mv, snap(r * rows[0][1]({ k: 0 }), 1e-9)] };
    }
    return null;
  });


  /* compléments 4e (formes rencontrées au balayage) */
  const NK = String.raw`(-?\d+(?:'\d{3})*(?:,\d+)?)`; /* nombre avec séparateur des milliers */
  const afterFrac = (c, re) => { const mm = new RegExp(re.source + String.raw`\s*\\\(([^]*?)\\\)`).exec(c.raw); return mm ? val(mm[1]) : NaN; };
  O("aireint volrev integrale", (c) => {
    const t = c.txt, D = c.D; let m;
    const ys = c.S.map((u) => { const mm = /^y = ([\s\S]+)$/.exec(u); return mm ? fn(mm[1]) : null; }).filter(Boolean);
    const between = (f, g) => { const d = (u) => f(u) - g(u), Z = zeros(d); if (Z.length < 2) return NaN; let s = 0; for (let i = 0; i + 1 < Z.length; i++) s += Math.abs(integ(d, Z[i], Z[i + 1])); return snap(s, 1e-8); };
    if (/compris entre la courbe de f\(x\) = .* et l'axe des abscisses\.$/.test(t) && D.f) return between(D.f, () => 0);
    if ((m = mt(c, new RegExp(`Les points A\\(${NB} ; ${NB}\\) et B\\(${NB} ; ${NB}\\) sont sur la parabole`))) && ys.length) { const [xa, ya, xb, yb] = m, L = (u) => ya + ((yb - ya) * (u - xa)) / (xb - xa); if (!near(ys[0](xa), ya) || !near(ys[0](xb), yb)) return { err: "A ou B hors de la parabole" }; return snap(Math.abs(integ((u) => L(u) - ys[0](u), xa, xb)), 1e-8); }
    if (/Pour quel nombre a > 0 l'aire sous la parabole/.test(t) && ys.length) { const A = afterFrac(c, /vaut-elle/); const r = zeros((a) => (a > 0 ? integ(ys[0], 0, a) - A : NaN)).filter((u) => u > 0); return r.length === 1 ? snap(r[0], 1e-7) : null; }
    if (/Pour quel nombre m > 0 l'aire du domaine entre la parabole y = x\^2 et la droite y = mx vaut-elle/.test(t)) { const A = afterFrac(c, /vaut-elle/); const r = zeros((k) => (k > 0 ? integ((u) => k * u - u * u, 0, k) - A : NaN)).filter((u) => u > 0); return r.length === 1 ? snap(r[0], 1e-7) : null; }
    if ((m = /engendre un solide de volume \\\(([^\\]*(?:\\pi)?)\\\)\. Que vaut \\\(a\\\)/.exec(c.raw)) && D.f) { const V = val(m[1]), r = zeros((a) => (a > 0 ? Math.PI * integ((u) => D.f(u) ** 2, 0, a) - V : NaN)).filter((u) => u > 0); return r.length === 1 ? snap(r[0], 1e-7) : null; }
    if ((m = mt(c, new RegExp(`valeur moyenne de f\\(x\\) = .* sur l'intervalle \\[${NB} ; ${NB}\\]`))) && D.f) return snap(integ(D.f, m[0], m[1]) / (m[1] - m[0]), 1e-9);
    if (/Trouve le nombre c > 0 tel que/.test(t)) { const s = c.S.find((u) => /\\int_0\^c/.test(u)); if (!s) return null; const mm = /^\\int_0\^c\s*([\s\S]*?)\\?,?\s*dx\s*=\s*([\s\S]+)$/.exec(s.replace(/\\,/g, " ")); if (!mm) return null; const f = fn(mm[1].replace(/^\((.*)\)$/, "$1")), A = val(mm[2]); if (!f) return null; const r = zeros((k) => (k > 0 ? integ(f, 0, k) - A : NaN)).filter((u) => u > 0); return r.length === 1 ? snap(r[0], 1e-7) : null; }
    if (/calcule \\\(\\int.*grâce à l'aire du domaine coloré/i.test(c.raw) && D.f) { const S0 = c.S.map(intSeg).filter(Boolean)[0]; return S0 ? snap(integ(D.f, S0[0], S0[1]), 1e-9) : null; }
    if (/^On sait que/.test(t)) {
      const K = {}; let target = null;
      for (const s of c.S) { const I = intSeg(s.replace(/\s*=\s*[^=]*$/, "")); if (!I) continue; const eq = /=\s*([^=]+)$/.exec(s); const name = /^\(?\s*([fg])\(x\)\s*\)?$/.exec(I[2]); if (eq && name) (K[name[1]] = K[name[1]] || []).push([I[0], I[1], val(eq[1])]); else if (!eq) target = I; }
      if (!target) return null; const [a, b, body] = target;
      const I = (n, p, q) => { const L = K[n] || []; for (const [u, v, w] of L) { if (u === p && v === q) return w; if (u === q && v === p) return -w; } for (const [u, v, w] of L) for (const [u2, v2, w2] of L) if (u === p && v === u2 && v2 === q) return w + w2; return NaN; };
      const f = fn(body.replace(/f\(x\)/g, "F").replace(/g\(x\)/g, "G"), ["F", "G"]); if (!f) return null;
      const c0 = f({ F: 0, G: 0 }), cf = f({ F: 1, G: 0 }) - c0, cg = f({ F: 0, G: 1 }) - c0;
      return (cf ? cf * I("f", a, b) : 0) + (cg ? cg * I("g", a, b) : 0) + c0 * (b - a);
    }
    return null;
  });
  O("primitives", (c) => {
    const t = c.txt; let m;
    if ((m = /le coût marginal vaut \\\(C'\(q\) = ([^\\]*(?:\{,\}[^\\]*)*)\\\) CHF par pièce, et les coûts fixes \\\(C\(0\) = ([^\\]*)\\\) CHF\. Quel est le coût total \\\(C\((\d+)\)\\\)/.exec(c.raw))) { const g = fn(m[1], ["q"]); return g ? snap(val(m[2]) + integ(g, 0, +m[3]), 1e-9) : null; }
    if ((m = /sa vitesse vaut \\\(v\(t\) = ([^\\]*)\\\) m\/s après \\\(t\\\) secondes\. Au départ \(\\\(t = 0\\\)\), (?:sa hauteur|son altitude) est \\\((\d+)\\ ?\\text\{ ?m\}\\\)\. Que vaut (?:sa hauteur|son altitude) \(en m\) à \\\(t = (\d+)\\\)/.exec(c.raw))) { const g = fn(m[1], ["t"]); return g ? snap(+m[2] + integ(g, 0, +m[3]), 1e-9) : null; }
    return null;
  });
  O("croissance", (c) => {
    const t = c.txt; let m;
    if ((m = mt(c, new RegExp(`demi-vie d'un \\S+ est ${NB} (?:heures|jours|ans)\\. Il y en a ${NB} mg au départ\\..* après ${NB} (?:heures|jours|ans)`)))) return m[1] * 2 ** (-m[2] / m[0]);
    if ((m = /suit le modèle N\(t\) = N_0 e\^(-?[\d,]+)t .*Quel est son temps de doublement/.exec(t))) return Math.log(2) / nn(m[1]);
    if ((m = mt(c, new RegExp(`double toutes les ${NB} heures\\. Dans le modèle N\\(t\\) = N_0 e\\^kt .*que vaut k`)))) return Math.log(2) / m[0];
    if ((m = mt(c, new RegExp(`Au départ, on compte ${NK} \\S+ ; après ${NB} \\S+, il y en a ${NK}\\..*que vaut k`)))) return Math.log(m[2] / m[0]) / m[1];
    if ((m = mt(c, new RegExp(`diminue de moitié toutes les ${NB} heures\\. Après combien d'heures n'en reste-t-il que ${NB} %`)))) return (m[0] * Math.log(m[1] / 100)) / Math.log(0.5);
    if ((m = mt(c, new RegExp(`Après combien de (?:jours|heures) atteint-elle ${NK}`))) && Object.values(c.D)[0]) { const f = Object.values(c.D)[0], r = zeros((u) => f(u) - m[0]).filter((u) => u > 0); return r.length === 1 ? r[0] : null; }
    if ((m = mt(c, new RegExp(`Quelle est sa température après ${NB} minutes`))) && c.D.T) return c.D.T(m[0]);
    if ((m = mt(c, new RegExp(`augmente de ${NB} % par an\\. Écris ce modèle sous la forme N\\(t\\) = N_0 e\\^kt\\.? Que vaut k`)))) return Math.log(1 + m[0] / 100);
    return null;
  });
  O("eqdiff", (c) => {
    const t = c.txt; let m;
    if ((m = /On considère l'équation \\\(y' = ([^]*?) \+ f\(x\)\\\) avec \\\(f\(x\) = ([^]*?)\\\)\. La fonction \\\(p\(x\) = ([^]*?)\\\) en est une solution particulière\. Donne la solution qui vérifie \\\(y\(0\) = ([^\\]*)\\\)/.exec(c.raw))) {
      const A = fn(m[1], ["y"]), g = fn(m[2]), p = fn(m[3]), y0 = val(m[4]); if (!A || !g || !p) return null; const a = A(1) - A(0);
      if (![0.3, 1.1].every((u) => near(d1(p, u), a * p(u) + g(u)))) return { err: "p n'est pas solution particulière" }; return { E: (u) => (y0 - p(0)) * Math.exp(a * u) + p(u) };
    }
    if ((m = /solution particulière de la forme \\\(p\(x\) = k([^\\]*)\\\) de l'équation \\\(y' = ([^]*?)y \+ ([^\\]*)\\\)\. Que vaut \\\(k\\\)/.exec(c.raw))) { const g = fn(m[1].replace(/^\\cdot\s*/, "")), a = val(m[2] === "" ? "1" : m[2] === "-" ? "-1" : m[2]), h = fn(m[3]); if (!g || !h) return null; return lin((k) => k * d1(g, 0.37) - a * k * g(0.37) - h(0.37)); }
    if ((m = /avec \\\(v' = ([^\\]*)\\\) et \\\(v\(0\) = ([^\\]*)\\\).*Calcule \\\(v\((\d+)\)\\\)/.exec(c.raw))) { const F = fn(m[1], ["v"]); if (!F) return null; const a = F(1) - F(0), b = F(0), v0 = val(m[2]); return (v0 + b / a) * Math.exp(a * +m[3]) - b / a; }
    return null;
  });
  O("appllin bases translin matrices", (c) => {
    const t = c.txt, raw = c.raw; let m;
    if (/Pour quelle valeur de \\\(k\\\) la matrice .* a-t-elle un noyau non réduit/.test(raw)) { const W = matsL(raw, "k")[0]; return W ? lin((k) => det2(W[0][0](k), W[0][1](k), W[1][0](k), W[1][1](k))) : null; }
    if ((m = /L'image de l'application de matrice .* est une droite\. Pour quelle valeur de k le vecteur \(k ; (-?\d+)\) appartient-il à l'image/.exec(t))) { const A = mats(raw)[0]; const col = A[0][0] || A[1][0] ? [A[0][0], A[1][0]] : [A[0][1], A[1][1]]; return (+m[1] * col[0]) / col[1]; }
    if ((m = /Le vecteur w a pour composantes \(([^)]*)\) dans la base \(\(([^)]*)\) ; \(([^)]*)\)\)\. Quelles sont ses composantes dans la base \(\(([^)]*)\) ; \(([^)]*)\)\)/.exec(t))) { const [k, u, v, u2, v2] = m.slice(1, 6).map((s) => s.split(" ; ").map(nn)), w = add(mul(k[0], u), mul(k[1], v)), s = cramer([[u2[0], v2[0]], [u2[1], v2[1]]], w); return s ? { P: s } : null; }
    if ((m = /Dans la base \( ?u ; v\) avec u = .* et v = .*, le vecteur w a pour composantes \(([^)]*)\)\. Donne ses coordonnées dans la base usuelle/.exec(t))) { const V = vecs(raw), k = m[1].split(" ; ").map(nn); return V.length === 2 ? { P: add(mul(k[0], V[0]), mul(k[1], V[1])) } : null; }
    if (/Pour quelle valeur de m les vecteurs u = .* et v = .* sont-ils liés/.test(t)) { const W = vecsL(raw); return W.length === 2 ? lin((k) => det2(W[0][0](k), W[1][0](k), W[0][1](k), W[1][1](k))) : null; }
    if (/Quelle est la dimension du sous-espace engendré par/.test(t)) { const V = vecs(raw); if (V.length !== 3) return null; if (Math.abs(det3(V)) > 1e-9) return 3; return V.some((u, i) => V.some((w, j) => j > i && nrm(cross(u, w)) > 1e-9)) ? 2 : 1; }
    if ((m = /image du point P\(([^)]*)\) par l'homothétie de centre O et de rapport (-?[\d,]+)/.exec(t))) return { P: mul(nn(m[2]), m[1].split(" ; ").map(nn)) };
    if ((m = /image du point P\(([^)]*)\) par la rotation de (-?\d+)° \(sens (trigonométrique|horaire)\) autour de l'origine/.exec(t))) { const [x, y] = m[1].split(" ; ").map(nn), a = rad(+m[2] * (m[3] === "horaire" ? -1 : 1)); return { P: [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)].map((v) => snap(v)) }; }
    if ((m = /image du point P\(([^)]*)\) par la symétrie d'axe (la droite y = x|la droite y = -x|l'axe des abscisses|l'axe des ordonnées)/.exec(t))) { const [x, y] = m[1].split(" ; ").map(nn); return { P: { "la droite y = x": [y, x], "la droite y = -x": [-y, -x], "l'axe des abscisses": [x, -y], "l'axe des ordonnées": [-x, y] }[m[2]] }; }
    if ((m = /On applique d'abord f de matrice .*, puis g de matrice .*\. Image de P\(([^)]*)\) par g ° f/.exec(t))) { const M2 = mats(raw); if (M2.length < 2) return null; const P = m[1].split(" ; ").map(nn); return { P: mmul(M2[1], mmul(M2[0], P.map((v) => [v]))).map((r) => r[0]) }; }
    if ((m = /Par la rotation de centre O et d'angle (-?\d+)°, quelle est l'(abscisse|ordonnée) de l'image de P\(([^)]*)\)/.exec(t))) { const [x, y] = m[3].split(" ; ").map(nn), a = rad(+m[1]); return m[2] === "abscisse" ? x * Math.cos(a) - y * Math.sin(a) : x * Math.sin(a) + y * Math.cos(a); }
    return null;
  });


  /* ================= 4e Collège : probabilités et statistique ================= */
  const pc = (s) => nn(s) / 100;
  /* tableau « array » : [[cases de la 1re ligne], …] (texte, nombres) */
  const arr = (raw) => { const mm = /\\begin\{array\}\{[^}]*\}([\s\S]*?)\\end\{array\}/.exec(raw); if (!mm) return null; return mm[1].replace(/\\hline/g, "").split(/\\\\/).map((r) => r.split("&").map((x) => x.trim().replace(/\\text\{([^}]*)\}/g, "$1"))); };
  O("varalea statdesc", (c) => {
    const t = c.txt, A = arr(c.raw); let m;
    if (A && A.length === 2 && /x_i/.test(A[0][0])) {
      const X = A[0].slice(1).map((v) => (/^[a-z]$/.test(v) ? v : val(v))), P = A[1].slice(1).map((v) => (/^[a-z]$/.test(v) ? v : val(v)));
      if ((m = /Que vaut \\\(p\\\)/.exec(c.raw))) return 1 - P.filter((v) => typeof v === "number").reduce((s, v) => s + v, 0);
      if ((m = /Sachant que \\\(E\(X\) = ([^\\]*)\\\), que vaut \\\(([a-z])\\\)/.exec(c.raw))) { const E = val(m[1]); return lin((a) => X.reduce((s, x, i) => s + (typeof x === "number" ? x : a) * P[i], 0) - E); }
      if (X.some((x) => typeof x !== "number") || P.some((x) => typeof x !== "number")) return null;
      const E = X.reduce((s, x, i) => s + x * P[i], 0), V = X.reduce((s, x, i) => s + x * x * P[i], 0) - E * E;
      if (/Calcule l'espérance/.test(t)) return snap(E, 1e-9); if (/Calcule la variance/.test(t)) return snap(V, 1e-9); if (/Calcule l'écart-type/.test(t)) return Math.sqrt(V); return null;
    }
    if (A && A.length === 2 && /effectif/.test(A[1][0])) {
      const X = A[0].slice(1).map(val), N = A[1].slice(1).map((v) => (/^[a-z]$/.test(v) ? v : val(v)));
      if ((m = /La moyenne vaut \\\(([^\\]*)\\\)\. Que vaut l'effectif \\\(([a-z])\\\)/.exec(c.raw))) { const mu = val(m[1]); return lin((k) => X.reduce((s, x, i) => s + x * (typeof N[i] === "number" ? N[i] : k), 0) - mu * N.reduce((s, n) => s + (typeof n === "number" ? n : k), 0)); }
      if (N.some((x) => typeof x !== "number")) return null; const n = N.reduce((s, v) => s + v, 0), mu = X.reduce((s, x, i) => s + x * N[i], 0) / n, V = X.reduce((s, x, i) => s + N[i] * (x - mu) ** 2, 0) / n;
      if (/écart-type/.test(t)) return Math.sqrt(V); if (/variance/.test(t)) return V; if (/moyenne/.test(t)) return mu; return null;
    }
    if (A && /Estime la médiane par interpolation linéaire/.test(t)) {
      const rows = A.slice(1).map((r) => { const iv = /\[\s*(-?[\d{},]+)\s*\\?,?;\\?,?\s*(-?[\d{},]+)\s*\[/.exec(r[0]); return iv ? [val(iv[1]), val(iv[2]), val(r[1])] : null; }); if (rows.some((r) => !r)) return null;
      const n = rows.reduce((s, r) => s + r[2], 0), h = n / 2; let cum = 0; for (const [a, b, k] of rows) { if (cum + k >= h) return a + ((h - cum) / k) * (b - a); cum += k; } return null;
    }
    if ((m = /On lance un dé équilibré\. Avec un 6, on gagne \\\((\d+)\\ \\text\{CHF\}\\\) ; avec un 4 ou un 5, on gagne \\\((\d+)\\ \\text\{CHF\}\\\) ; sinon, on perd \\\((\d+)\\ \\text\{CHF\}\\\)/.exec(c.raw))) return (+m[1] + 2 * +m[2] - 3 * +m[3]) / 6;
    if ((m = mt(c, new RegExp(`il fait gagner ${NB} CHF avec la probabilité ${NB} \\(rien sinon\\)\\. Le gain net X vaut donc ${NB} ou ${NB}\\. Calcule l'écart-type`)))) { const [, p, a, b] = m, E = a * p + b * (1 - p); return Math.sqrt(a * a * p + b * b * (1 - p) - E * E); }
    if ((m = mt(c, new RegExp(`Une tombola vend ${NB} billets\\. Il y a un gros lot de ${NB} CHF et ${NB} lots de ${NB} CHF`)))) return (m[1] + m[2] * m[3]) / m[0];
    if ((m = /On sait que \\\(E\(X\) = ([^\\]*)\\\) et \\\(V\(X\) = ([^\\]*)\\\)\. Soit \\\(Y = ([^\\]*)\\\)\. Calcule \\\(([EV])\(Y\)\\\)/.exec(c.raw))) { const g = fn(m[3], ["X"]); if (!g) return null; const b = g(0), a = g(1) - b; return m[4] === "E" ? a * val(m[1]) + b : a * a * val(m[2]); }
    if ((m = mt(c, new RegExp(`Une urne contient ${NB} boules (\\S+) et ${NB} \\S+\\. On en tire deux sans remise ; X est le nombre de boules \\S+ tirées\\. Calcule E\\(X\\)`)))) return (2 * m[0]) / (m[0] + m[2]);
    /* statdesc */
    if ((m = /moyenne \\\(\\bar x = ([^\\]*)\\\) ; la moyenne des carrés des valeurs vaut \\\(\\overline\{x\^2\} = ([^\\]*)\\\)\. Calcule (?:sa variance|son écart-type)/.exec(c.raw))) { const V = val(m[2]) - val(m[1]) ** 2; return /variance/.test(t) ? V : Math.sqrt(V); }
    if ((m = mt(c, new RegExp(`ont pour moyenne ${NB} CHF et pour écart-type ${NB} CHF\\. Chaque salaire est augmenté de ${NB} %, puis d'une prime de ${NB} CHF\\. Quel(?:le)? est (?:la nouvelle moyenne|le nouvel écart-type)`)))) { const a = 1 + m[2] / 100; return /nouvelle moyenne/.test(t) ? a * m[0] + m[3] : a * m[1]; }
    if ((m = mt(c, new RegExp(`Classe A : ${NB} élèves, moyenne ${NB}, écart-type ${NB}\\. Classe B : ${NB} élèves, moyenne ${NB}, écart-type ${NB}\\.`)))) { const [na, ma, sa, nb2, mb, sb] = m, n = na + nb2, mu = (na * ma + nb2 * mb) / n, q = (na * (sa * sa + ma * ma) + nb2 * (sb * sb + mb * mb)) / n; return /écart-type de l'ensemble/.test(t) ? Math.sqrt(q - mu * mu) : /moyenne de l'ensemble/.test(t) ? mu : null; }
    if ((m = mt(c, new RegExp(`Une série de ${NB} valeurs a pour moyenne ${NB} et pour écart-type ${NB}\\. On ajoute la valeur ${NB}\\. Quel(?:le)? est (?:le nouvel écart-type|la nouvelle moyenne)`)))) { const [n, mu, s, v] = m, mu2 = (n * mu + v) / (n + 1), q = (n * (s * s + mu * mu) + v * v) / (n + 1); return /écart-type/.test(t) ? Math.sqrt(q - mu2 * mu2) : mu2; }
    if ((m = mt(c, new RegExp(`obtient ${NB} points à un test A \\(moyenne ${NB}, écart-type ${NB}\\)\\. Quel score au test B \\(moyenne ${NB}, écart-type ${NB}\\)`)))) return m[3] + ((m[0] - m[1]) / m[2]) * m[4];
    return null;
  });
  O("binomiale", (c) => {
    const t = c.txt, raw = c.raw; let m;
    if ((m = mt(c, new RegExp(`avec la probabilité ${NB} \\(essais indépendants\\)\\. Sur ${NB} .*attend-on en moyenne`)))) return m[0] * m[1];
    if ((m = mt(c, new RegExp(`avec une probabilité ${NB}, indépendamment\\. Sur ${NB} jours, quelle est la probabilité qu'il \\S+ au moins une fois`)))) return 1 - (1 - m[0]) ** m[1];
    if ((m = mt(c, new RegExp(`avec la probabilité ${NB}, indépendamment\\. On prélève ${NB} pièces\\. Quelle est la probabilité d'au plus une`)))) { const [p, n] = m; return (1 - p) ** n + n * p * (1 - p) ** (n - 1); }
    if ((m = mt(c, new RegExp(`On tire au but ${NB} fois\\. Dans l'arbre des issues, combien de chemins comportent exactement ${NB} buts`)))) return Cn(m[0], m[1]);
    if ((m = /X \\sim B\((\d+) \\,;\\, ([\d{},]+)\)\\\)\. Calcule (l'écart-type|l'espérance|la variance)/.exec(raw))) { const n = +m[1], p = val(m[2]), V = n * p * (1 - p); return /écart/.test(m[3]) ? Math.sqrt(V) : /espérance/.test(m[3]) ? n * p : V; }
    if ((m = /avec \\\(E\(X\) = ([^\\]*)\\\) et \\\(V\(X\) = ([^\\]*)\\\)\. Que vaut \\\(([pn])\\\)/.exec(raw))) { const E = val(m[1]), V = val(m[2]), p = 1 - V / E; return m[3] === "p" ? snap(p, 1e-9) : snap(E / p, 1e-9); }
    if ((m = mt(c, new RegExp(`réussit avec la probabilité ${NB}\\. Combien de tirs faut-il au minimum pour que la probabilité d'au moins une réussite dépasse ${NB}`)))) { let n = 1; while (1 - (1 - m[0]) ** n <= m[1] && n < 1e4) n++; return n; }
    if ((m = mt(c, new RegExp(`répond au hasard aux ${NB} questions d'un QCM \\(${NB} réponses proposées, une seule juste\\)\\. Quelle est la probabilité qu'il ait au moins ${NB} réponses justes`)))) { const [n, r, k] = m, p = 1 / r; let s = 0; for (let j = k; j <= n; j++) s += Cn(n, j) * p ** j * (1 - p) ** (n - j); return s; }
    if ((m = mt(c, new RegExp(`avec la probabilité ${NB}.*Sur ${NB} \\S+.*exactement ${NB}`)))) { const [p, n, k] = m; return Cn(n, k) * p ** k * (1 - p) ** (n - k); }
    return null;
  });
  /* règle 68-95-99,7 : fonction de répartition aux multiples entiers de σ (en %) */
  const RULE = { "-3": 0.15, "-2": 2.5, "-1": 16, 0: 50, 1: 84, 2: 97.5, 3: 99.85 };
  const Fr = (z) => { const k = Math.round(z); return Math.abs(z - k) < 1e-9 && RULE[k] !== undefined ? RULE[k] : NaN; };
  const ev2 = (s, mu, sg) => { /* événement « a \le X \le b », « X \le a », « X \ge a » → probabilité (en %) */
    s = s.replace(/\\leq?(?![a-z])|<|\\lt/g, "≤").replace(/\\geq?(?![a-z])|>|\\gt/g, "≥"); let mm;
    if ((mm = /^([^≤≥]+)≤\s*X\s*≤([^≤≥]+)$/.exec(s))) return Fr((val(mm[2]) - mu) / sg) - Fr((val(mm[1]) - mu) / sg);
    if ((mm = /^X\s*≤([^≤≥]+)$/.exec(s))) return Fr((val(mm[1]) - mu) / sg); if ((mm = /^X\s*≥([^≤≥]+)$/.exec(s))) return 100 - Fr((val(mm[1]) - mu) / sg); return NaN; };
  O("normale", (c) => {
    const t = c.txt, raw = c.raw; let m; const P0 = /moyenne \\\(\\mu = ([^\\]*)\\\) et d'écart-type \\\(\\sigma = ([^\\]*)\\\)/.exec(raw), P = P0 ? [val(P0[1]), val(P0[2])] : null;
    const evs = c.S.filter((s) => /X/.test(s) && /\\le|\\ge|<|>/.test(s) && !/\\mid/.test(s));
    if (P) {
      const [mu, sg] = P;
      if (/Quelle est la probabilité, en %, que/.test(t) && !/Sachant/.test(t)) { if (/\\\) ou \\\(/.test(raw) && evs.length === 2) return { v: ev2(evs[0], mu, sg) + ev2(evs[1], mu, sg) }; return evs.length === 1 ? { v: ev2(evs[0], mu, sg) } : null; }
      if ((m = mt(c, new RegExp(`Sur ${NB} observations indépendantes, combien de fois attend-on`)))) { const p = evs.length === 2 && /\\\) ou \\\(/.test(raw) ? ev2(evs[0], mu, sg) + ev2(evs[1], mu, sg) : evs.length === 1 ? ev2(evs[0], mu, sg) : NaN; return (m[0] * p) / 100; }
      if ((m = /Calcule la valeur centrée réduite .* de \\\(x = ([^\\]*)\\\)/.exec(raw))) return (val(m[1]) - mu) / sg;
      if ((m = /Sachant que \\\(([^\\]*)\\\), quelle est la probabilité, en %, que \\\(([^\\]*)\\\)/.exec(raw))) return (100 * ev2(m[2], mu, sg)) / ev2(m[1], mu, sg);
      if ((m = /(Au-dessus|En dessous) de quelle valeur se trouvent les \\\(([\d{},]+)\\,\\%\\\)/.exec(raw))) { const p = val(m[2]), k = [1, 2, 3].find((q) => near(100 - Fr(q), p)); return k ? mu + (m[1] === "Au-dessus" ? 1 : -1) * k * sg : null; }
    }
    if ((m = /Environ \\\(([\d{},]+)\\,\\%\\\) des valeurs se trouvent entre \\\(([^\\]*)\\\) et \\\(([^\\]*)\\\)/.exec(raw))) { const p = val(m[1]), k = [1, 2, 3].find((q) => near(Fr(q) - Fr(-q), p)); return k ? (val(m[3]) - val(m[2])) / (2 * k) : null; }
    if ((m = /d'écart-type \\\(\\sigma = ([^\\]*)\\\)\. Environ \\\(([\d{},]+)\\,\\%\\\) des valeurs sont (supérieures|inférieures) à \\\(([^\\]*)\\\)/.exec(raw))) { const sg = val(m[1]), p = val(m[2]), k = [1, 2, 3].find((q) => near(100 - Fr(q), p)); return k ? val(m[4]) + (m[3] === "supérieures" ? -1 : 1) * k * sg : null; }
    return null;
  });
  O("approxnorm", (c) => {
    const t = c.txt, raw = c.raw; let m;
    let n = NaN, p = NaN;
    if ((m = /(\d+) % de ses clients .* sur (\d+(?:'\d{3})*) clients/.exec(t))) { p = +m[1] / 100; n = nn(m[2]); }
    else if ((m = /produit (\d+(?:'\d{3})*) pièces, chacune défectueuse avec la probabilité (\d+(?:,\d+)?)/.exec(t))) { n = nn(m[1]); p = nn(m[2]); }
    else if ((m = /(?:sème|plante) (\d+(?:'\d{3})*) graines ; chacune germe avec la probabilité (\d+(?:,\d+)?)/.exec(t))) { n = nn(m[1]); p = nn(m[2]); }
    else if ((m = /^(\d+(?:'\d{3})*) élèves répondent au hasard à une même question à (\d+) choix/.exec(t))) { n = nn(m[1]); p = 1 / +m[2]; }
    else if ((m = /On lance (\d+) fois une pièce équilibrée/.exec(t))) { n = +m[1]; p = 0.5; }
    else if ((m = /accepte (\d+) inscriptions pour (\d+) places.*avec la probabilité (\d+(?:,\d+)?)/.exec(t))) { n = +m[1]; p = nn(m[3]); }
    else if ((m = /suit la loi B\((\d+) ; (\d+(?:,\d+)?)\)/.exec(t))) { n = +m[1]; p = nn(m[2]); }
    if (!fin(n) || !fin(p)) return null;
    const mu = n * p, sg = Math.sqrt(n * p * (1 - p));
    if (/Donne σ\.?$/.test(t)) return sg; if (/Donne μ\.?$/.test(t)) return mu;
    if ((m = /On approche \\\(P\(X \\le (\d+)\)\\\) par \\\(P\(Y \\le ([\d{},]+)\)\\\)/.exec(raw)) && /valeur centrée réduite/.test(t)) { if (!near(val(m[2]), +m[1] + 0.5)) return { err: "correction de continuité" }; return (val(m[2]) - mu) / sg; }
    if ((m = /D'après la règle 68-95-99,7, que vaut environ \\\(P\(Y \\le (\d+)\)\\\)/.exec(raw))) return Fr((+m[1] - mu) / sg);
    /* table de Φ donnée */
    const PH = {}; for (const q of raw.matchAll(/\\Phi\(([\d{},]+)\) \\approx ([\d{},]+)/g)) PH[val(q[1]).toFixed(4)] = val(q[2]);
    const Phi = (z) => { const k = Math.abs(z).toFixed(4); if (!(k in PH)) return NaN; return z >= 0 ? PH[k] : 1 - PH[k]; };
    if ((m = /Calcule une valeur approchée de \\\(P\(X (\\le|\\ge|<|>) (\d+)\)\\\)/.exec(raw))) { const k = +m[2]; const z = m[1] === "\\le" ? (k + 0.5 - mu) / sg : m[1] === "<" ? (k - 0.5 - mu) / sg : m[1] === "\\ge" ? (k - 0.5 - mu) / sg : (k + 0.5 - mu) / sg; const F = Phi(+z.toFixed(6)); return /\\le|</.test(m[1]) ? F : 1 - F; }
    if ((m = /Calcule une valeur approchée de \\\(P\((\d+) \\le X \\le (\d+)\)\\\)/.exec(raw))) return Phi(+((+m[2] + 0.5 - mu) / sg).toFixed(6)) - Phi(+((+m[1] - 0.5 - mu) / sg).toFixed(6));
    if ((m = /Quel est le plus petit entier \\\(k\\\) tel que \\\(P\(X \\le k\) \\ge ([\d{},]+)\\\)/.exec(raw))) { const q = val(m[1]), z = Object.keys(PH).find((k) => near(PH[k], q)); if (z === undefined) return null; return Math.ceil(mu + +z * sg - 0.5 - 1e-9); }
    if ((m = /accepte (\d+) inscriptions pour (\d+) places/.exec(t)) && /Trop de monde|plus de monde|trop d'inscrits|probabilité que/.test(t)) { const z = (+m[2] + 0.5 - mu) / sg; return 1 - Phi(+z.toFixed(6)); }
    return null;
  });
  O("densite", (c) => {
    const t = c.txt, raw = c.raw; let m;
    const iv = mt(c, new RegExp(`sur \\[${NB} ; ${NB}\\]`));
    if ((m = /Pour quelle valeur de \\\(k\\\) la fonction \\\(f\(x\) = ([^\\]*)\\\) sur/.exec(raw)) && iv) { const F = fn(m[1], ["x", "k"]); if (!F) return null; return snap(1 / integ((u) => F({ x: u, k: 1 }), iv[0], iv[1]), 1e-9); }
    if ((m = /loi exponentielle de densité .* avec \\\(\\lambda = ([^\\]*(?:\\frac\{\d+\}\{\d+\})?[^\\]*)\\\)\. Calcule \\\(P\(X (\\le|\\ge) ([\d{},]+)\)\\\)/.exec(raw))) { const l = val(m[1]), q = 1 - Math.exp(-l * val(m[3])); return m[2] === "\\le" ? q : 1 - q; }
    if ((m = /a pour densité \\\(f\(x\) = ([^\\]*(?:\\frac\{[^}]*\}\{[^}]*\})?[^\\]*)\\\) sur/.exec(raw)) && iv) {
      let F = fn(m[1], ["x", "k"]); if (!F) return null; const K = 1 / integ((u) => F({ x: u, k: 1 }), iv[0], iv[1]), f = (u) => (u < iv[0] || u > iv[1] ? 0 : F({ x: u, k: /k/.test(m[1]) ? K : 1 }));
      if (!/k/.test(m[1]) && !near(integ(f, iv[0], iv[1]), 1)) return { err: "f n'est pas une densité (intégrale ≠ 1)" };
      let q;
      if ((q = /Calcule \\\(P\(([^\\]*?) \\le X \\le ([^\\]*?)\)\\\)/.exec(raw))) return snap(integ(f, val(q[1]), val(q[2])), 1e-9);
      if ((q = /Calcule \\\(P\(X \\le ([^)]*)\)\\\)/.exec(raw))) return snap(integ(f, iv[0], val(q[1])), 1e-9);
      if ((q = /Calcule \\\(P\(X \\ge ([^)]*)\)\\\)/.exec(raw))) return snap(integ(f, val(q[1]), iv[1]), 1e-9);
      if (/Calcule son espérance/.test(t)) return snap(integ((u) => u * f(u), iv[0], iv[1]), 1e-9);
      if (/Calcule sa variance/.test(t)) { const E = integ((u) => u * f(u), iv[0], iv[1]); return snap(integ((u) => u * u * f(u), iv[0], iv[1]) - E * E, 1e-9); }
      return null;
    }
    if (/suit une loi uniforme sur/.test(t) && iv) { const [a, b] = iv; if (/variance/.test(t)) return (b - a) ** 2 / 12; if (/espérance/.test(t)) return (a + b) / 2; if ((m = /Calcule \\\(P\(([^\\]*?) \\le X \\le ([^\\]*?)\)\\\)/.exec(raw))) return (val(m[2]) - val(m[1])) / (b - a); return null; }
    return null;
  });
  /* tableau de contingence : probabilité conditionnelle lue sur le tableau */
  function contingence(c) {
    const A = arr(c.raw); if (!A || A.length < 3) return null; const cols = A[0].slice(1).map((s) => s.toLowerCase()), rows = A.slice(1).map((r) => [r[0].toLowerCase(), r.slice(1).map(val)]);
    const q = c.txt.toLowerCase(), cut = q.search(/quelle est la probabilité/); if (cut < 0) return null; const cond = q.slice(0, cut), evt = q.slice(cut);
    const hit = (lab, s) => { const w = lab.split(/\s+/).filter((x) => x.length > 2); return w.length && w.every((x) => s.includes(x)); };
    const rc = rows.findIndex(([l]) => hit(l, cond.slice(cond.lastIndexOf("array")))), cc = cols.findIndex((l) => hit(l, cond.slice(cond.lastIndexOf("array")))), re = rows.findIndex(([l]) => hit(l, evt)), ce = cols.findIndex((l) => hit(l, evt));
    if (rc >= 0 && ce >= 0 && cc < 0) { const r = rows[rc][1]; return r[ce] / r.reduce((s, v) => s + v, 0); }
    if (cc >= 0 && re >= 0 && rc < 0) { const tot = rows.reduce((s, r) => s + r[1][cc], 0); return rows[re][1][cc] / tot; }
    return null;
  }
  O("condbayes bayes", (c) => {
    const t = c.txt, raw = c.raw.replace(/\\,/g, "").replace(/\\%/g, "%"); let m;
    if (/\\begin\{array\}/.test(raw)) return contingence(c);
    if ((m = /\\\(P\(A\) = ([\d{},]+)\\\)\. Elle germe \(G\) avec \\\(P_\{A\}\(G\) = ([\d{},]+)\\\) et \\\(P_\{\\overline\{A\}\}\(G\) = ([\d{},]+)\\\)\. Calcule \\\(([^\\]*(?:\\overline\{A\}[^\\]*)?)\\\)/.exec(raw))) {
      const a = val(m[1]), g1 = val(m[2]), g0 = val(m[3]), q = m[4]; const PG = a * g1 + (1 - a) * g0;
      if (/^P\(\\overline\{A\} \\cap G\)$/.test(q)) return (1 - a) * g0; if (/^P\(A \\cap G\)$/.test(q)) return a * g1; if (/^P\(G\)$/.test(q)) return PG; if (/^P_\{?G\}?\(A\)$/.test(q)) return (a * g1) / PG; if (/^P_\{?G\}?\(\\overline\{A\}\)$/.test(q)) return ((1 - a) * g0) / PG; return null;
    }
    if ((m = /Les événements \\\(A\\\) et \\\(B\\\) sont indépendants, avec \\\(P\(A\) = ([\d{},]+)\\\) et \\\(P\((B|A \\cup B)\) = ([\d{},]+)\\\)\. Calcule \\\(P\(([^)]*)\)\\\)/.exec(raw))) { const a = val(m[1]), v = val(m[3]); if (m[2] === "B") { if (m[4] === "A \\cup B") return a + v - a * v; if (m[4] === "A \\cap B") return a * v; return null; } if (m[4] === "B") return (v - a) / (1 - a); return null; }
    if ((m = /fabriqué dans l'usine U avec la probabilité \\\(([\d{},]+)\\\) ; sinon[^.]*\. Dans le premier cas, il est défectueux avec la probabilité \\\(([\d{},]+)\\\) ; dans le second, avec la probabilité \\\(([\d{},]+)\\\)\. Quelle est la probabilité qu'il soit défectueux/.exec(raw))) { const [a, d1_, d2_] = [m[1], m[2], m[3]].map(val); return a * d1_ + (1 - a) * d2_; }
    if ((m = /On sait que \\\(P\(([AB])\) = ([\d{},]+)\\\) et \\\(P\(A \\cap B\) = ([\d{},]+)\\\)\. Calcule \\\(P_\{?([AB])\}?\(([AB])\)\\\)/.exec(raw)) && m[1] === m[4]) return val(m[3]) / val(m[2]);
    if ((m = mt(c, new RegExp(`Une boîte contient ${NB} boules (\\S+) et ${NB} boules \\S+\\. On en tire deux successivement, sans remise\\. Le premier tirage donne \\S+\\. Quelle est la probabilité que le second aussi`)))) { const [a, , b] = m, w = /donne (\S+)\./.exec(t)[1], k = /rouge/.test(w) === /rouge/.test(/boules (\S+) et/.exec(t)[1]) ? a : b; return (k - 1) / (a + b - 1); }
    if ((m = /deux machines : \\\(A\\\) en fait \\\((\d+)%\\\), avec \\\((\d+)%\\\) de défauts ; \\\(B\\\) le reste, avec \\\((\d+)%\\\) de défauts\. Une pièce est défectueuse : quelle est la probabilité qu'elle vienne de \\\(([AB])\\\)/.exec(raw))) { const a = +m[1] / 100, da = +m[2] / 100, db = +m[3] / 100, PA = a * da, PB = (1 - a) * db; return m[4] === "A" ? PA / (PA + PB) : PB / (PA + PB); }
    /* tests de dépistage */
    if ((m = /\\\((\d+(?:\{,\}\d+)?)%\\\) des personnes ont (?:une maladie|un virus)\. Un test est positif chez \\\((\d+(?:\{,\}\d+)?)%\\\) des malades et (positif|négatif) chez \\\((\d+(?:\{,\}\d+)?)%\\\) des personnes saines\. Une personne a un test (positif|négatif) : quelle est la probabilité qu'elle soit malade/.exec(raw))) {
      const p = val(m[1]) / 100, s = val(m[2]) / 100, f = m[3] === "positif" ? val(m[4]) / 100 : 1 - val(m[4]) / 100; return m[5] === "positif" ? (p * s) / (p * s + (1 - p) * f) : (p * (1 - s)) / (p * (1 - s) + (1 - p) * (1 - f));
    }
    if ((m = /avec la probabilité \\\(([\d{},]+)\\\)\. Dans ce cas, [^;]* avec la probabilité \\\(([\d{},]+)\\\) ; sinon, avec la probabilité \\\(([\d{},]+)\\\)\. Sachant que/.exec(raw))) { const [a, s, f] = [m[1], m[2], m[3]].map(val); return (a * s) / (a * s + (1 - a) * f); }
    if ((m = /On sait que \\\(P\(A\) = ([\d{},]+)\\\), \\\(P_A\(B\) = ([\d{},]+)\\\) et \\\(P\(B\) = ([\d{},]+)\\\)\. Calcule \\\(P_B\((A|\\overline\{A\})\)\\\)/.exec(raw))) { const q = (val(m[1]) * val(m[2])) / val(m[3]); return m[4] === "A" ? q : 1 - q; }
    if ((m = /touche \\\((\d+)%\\\) d'une population\. Le test détecte \\\((\d+)%\\\) des malades et il est négatif chez \\\((\d+)%\\\) des personnes saines\. Le test d'une personne est négatif : quelle est la probabilité qu'elle soit quand même malade \(en %/.exec(raw))) { const p = +m[1] / 100, s = +m[2] / 100, sp = +m[3] / 100; return (100 * p * (1 - s)) / (p * (1 - s) + (1 - p) * sp); }
    if ((m = /On teste \\\([\d\\text{}']+\\\) personnes ; \\\((\d+(?:\{,\}\d+)?)%\\\) sont malades\. Le test est positif chez \\\((\d+)%\\\) des malades et chez \\\((\d+(?:\{,\}\d+)?)%\\\) des personnes saines\. Parmi les personnes au test positif, quel pourcentage est vraiment malade/.exec(raw))) { const p = val(m[1]) / 100, s = +m[2] / 100, f = val(m[3]) / 100; return (100 * p * s) / (p * s + (1 - p) * f); }
    if ((m = /(?:trois fournisseurs|trois lignes de bus|trois \S+) \\\(([A-Z])_1, [A-Z]_2, [A-Z]_3\\\)\s*(?:Ils|Elles) représentent \\\((\d+)%\\\), \\\((\d+)%\\\), \\\((\d+)%\\\) de l'ensemble, avec \\\((\d+)%\\\), \\\((\d+)%\\\), \\\((\d+)%\\\) de cas[^:]*: quelle est la probabilité qu'(?:elle|il) vienne de \\\([A-Z]_(\d)\\\)/.exec(raw))) { const w = [m[2], m[3], m[4]].map((v) => +v / 100), d = [m[5], m[6], m[7]].map((v) => +v / 100), k = +m[8] - 1, P = w.reduce((s, v, i) => s + v * d[i], 0); return (w[k] * d[k]) / P; }
    if ((m = /Un test est positif chez \\\((\d+)%\\\) des malades et chez \\\((\d+)%\\\) des personnes saines\. Quelle devrait être la proportion de malades .* exactement une chance sur deux/.exec(raw))) { const s = +m[1] / 100, f = +m[2] / 100; return (100 * f) / (s + f); }
    return null;
  });

  /* ================= 4e Collège (MA2) : nombres complexes ================= */
  /* expression TeX → fonction complexe de z (et w) ; [re, im] */
  const C_ = { add: (a, b) => [a[0] + b[0], a[1] + b[1]], sub: (a, b) => [a[0] - b[0], a[1] - b[1]], mul: (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]], div: (a, b) => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; },
    exp: (a) => [Math.exp(a[0]) * Math.cos(a[1]), Math.exp(a[0]) * Math.sin(a[1])], abs: (a) => Math.hypot(a[0], a[1]), arg: (a) => Math.atan2(a[1], a[0]) };
  C_.pow = (a, b) => { if (b[1] === 0 && Number.isInteger(b[0]) && Math.abs(b[0]) < 50) { let r = [1, 0]; for (let i = 0; i < Math.abs(b[0]); i++) r = C_.mul(r, a); return b[0] < 0 ? C_.div([1, 0], r) : r; } if (a[1] === 0 && a[0] > 0) return C_.exp(C_.mul([Math.log(a[0]), 0], b)); if (Math.abs(a[0] - Math.E) < 1e-12 && a[1] === 0) return C_.exp(b); return [NaN, NaN]; };
  function cfn(tex, vars = ["z", "w"]) {
    let s = String(tex).replace(/\\left|\\right/g, "").replace(/\\,|\\;|\\!/g, " ").replace(/\\(?:overline|bar)\s*\{?\s*([zw])\s*\}?/g, "$1b").replace(/\\mathrm\{i\}/g, "i").replace(/\\mathrm\{e\}/g, "e").replace(/\\cdot|\\times/g, "*").replace(/\\pi/g, "π").replace(/\\(cos|sin)/g, " $1");
    s = R.tex2e(s); const toks = []; let i = 0;
    while (i < s.length) { const ch = s[i]; if (/\s/.test(ch)) { i++; continue; } if (/[\d.]/.test(ch)) { let j = i; while (j < s.length && /[\d.]/.test(s[j])) j++; toks.push(["n", +s.slice(i, j)]); i = j; continue; }
      if (/[a-zπ]/i.test(ch)) { let j = i; while (j < s.length && /[a-zπ]/i.test(s[j])) j++; let w = s.slice(i, j); i = j; for (const nm of ["sqrt", "cos", "sin", "zb", "wb"]) if (w.startsWith(nm)) { toks.push(["id", nm]); w = w.slice(nm.length); } for (const L of w) toks.push(["id", L]); continue; }
      if ("+-*/^()".includes(ch)) { toks.push(["o", ch]); i++; continue; } return null; }
    let p = 0; const pk = () => toks[p], isO = (o) => pk() && pk()[0] === "o" && pk()[1] === o;
    const expr = () => { let a = term(); while (isO("+") || isO("-")) { const o = toks[p++][1], b = term(); const A = a, B = b; a = o === "+" ? (e) => C_.add(A(e), B(e)) : (e) => C_.sub(A(e), B(e)); } return a; };
    const term = () => { let a = unary(); for (;;) { if (isO("*") || isO("/")) { const o = toks[p++][1], b = unary(); const A = a, B = b; a = o === "*" ? (e) => C_.mul(A(e), B(e)) : (e) => C_.div(A(e), B(e)); } else if (pk() && (pk()[0] !== "o" || pk()[1] === "(")) { const b = power(); const A = a; a = (e) => C_.mul(A(e), b(e)); } else return a; } };
    const unary = () => { if (isO("-")) { p++; const a = unary(); return (e) => C_.mul([-1, 0], a(e)); } if (isO("+")) { p++; return unary(); } return power(); };
    const power = () => { const b = atom(); if (isO("^")) { p++; const x = unary(); return (e) => C_.pow(b(e), x(e)); } return b; };
    const atom = () => { const k = toks[p++]; if (!k) throw new Error("fin"); if (k[0] === "n") return () => [k[1], 0]; if (k[0] === "o" && k[1] === "(") { const a = expr(); if (!isO(")")) throw new Error(")"); p++; return a; }
      if (k[0] === "id") { const w = k[1]; if (w === "i") return () => [0, 1]; if (w === "e") return () => [Math.E, 0]; if (w === "π") return () => [Math.PI, 0];
        if (["sqrt", "cos", "sin"].includes(w)) { const a = power(); return (e) => { const v = a(e); if (Math.abs(v[1]) > 1e-12) return [NaN, NaN]; return [w === "sqrt" ? Math.sqrt(v[0]) : w === "cos" ? Math.cos(v[0]) : Math.sin(v[0]), 0]; }; }
        if (w === "zb" || w === "wb") return (e) => [e[w[0]][0], -e[w[0]][1]]; if (vars.includes(w)) return (e) => e[w]; } throw new Error("jeton " + k[1]); };
    try { const f = expr(); if (p !== toks.length) return null; return f; } catch (er) { return null; }
  }
  const cval = (tex, env = {}) => { const f = cfn(tex); return f ? f(env) : [NaN, NaN]; };
  const cfix = (v) => v.map((x) => snap(x, 1e-9));
  const argP = (v) => { let a = C_.arg(v); if (a <= -Math.PI + 1e-12) a += 2 * Math.PI; return a; };
  O("cplxalg cplxtrig cplxeq", (c) => {
    const t = c.txt, raw = c.raw, S = c.S; let m;
    const env = {}; for (const s of S) { const q = /^([zw])(?:_1|_2)? = ([\s\S]+)$/.exec(s); if (q && !/\\(?:overline|bar)/.test(q[2])) { const v = cval(q[2]); if (fin(v[0])) env[q[1]] = env[q[1]] || v; } }
    for (const s of S) { const q = /^z_([12]) = ([\s\S]+)$/.exec(s); if (q) env["z" + q[1]] = cval(q[2]); }
    if ((m = /(?:donne|Calcule|Écris) \\\(([^\\]*(?:\\(?:bar|overline|cdot|frac|sqrt|left|right|pi|cos|sin)[^\\]*)*)\\\) (?:sous la forme \\\(a \+ bi\\\)|et écris-le sous la forme)/.exec(raw)) && !/=/.test(m[1])) { const f = cfn(m[1]); return f ? { C: cfix(f(env)) } : null; }
    if ((m = /^Calcule le produit \\\(([^\\]*)\\\) et écris-le/.exec(raw))) { const f = cfn(m[1]); return f ? { C: cfix(f(env)) } : null; }
    if ((m = /^(?:Soit \\\(z = [^\\]*\\\)\. )?Calcule \\\(([^\\=]*)\\\)\.$/.exec(raw)) && env.z) { const v = cfn(m[1])(env); return Math.abs(v[1]) < 1e-9 ? snap(v[0], 1e-9) : { err: "résultat non réel" }; }
    if ((m = /Résous dans \\\(\\mathbb\{C\}\\\) : \\\(([^=]*)=([^\\]*)\\\)\. Donne \\\(z\\\)/.exec(raw))) { const L = cfn(m[1]), Rr = cfn(m[2]); if (!L || !Rr) return null; const a = L({ z: [0, 0] }), b = C_.sub(L({ z: [1, 0] }), a), rhs = Rr({}); return { C: cfix(C_.div(C_.sub(rhs, a), b)) }; }
    if ((m = /Donne la partie (réelle|imaginaire) de \\\(([^\\]*(?:\\frac\{[^}]*\}\{[^}]*\})?[^\\]*)\\\)/.exec(raw))) { const v = cval(m[2], env); return snap(m[1] === "réelle" ? v[0] : v[1], 1e-9); }
    if ((m = /Trouve le nombre complexe \\\(z\\\) tel que \\\(([^=]*)=([^\\]*)\\\)/.exec(raw))) { const L = cfn(m[1]), rhs = cval(m[2]); if (!L) return null; const a = L({ z: [0, 0] }), u = C_.sub(L({ z: [1, 0] }), a), v = C_.sub(L({ z: [0, 1] }), a), s = cramer([[u[0], v[0]], [u[1], v[1]]], C_.sub(rhs, a)); return s ? { C: s } : null; }
    if ((m = /Trouve la racine carrée de \\\(([^\\]*)\\\) dont la partie réelle est positive/.exec(raw))) { const v = cval(m[1]), r = C_.abs(v), x = Math.sqrt((r + v[0]) / 2), y = v[1] / (2 * x); return { C: cfix([x, y]) }; }
    /* forme trigonométrique et exponentielle */
    if ((m = /^Écris \\\(z = ([\s\S]*?)\\\) sous la forme/.exec(raw))) return { C: cfix(cval(m[1])) };
    if ((m = /Calcule le module de \\\(z = ([^\\]*(?:\\sqrt\{\d+\}[^\\]*)?)\\\)/.exec(raw))) return C_.abs(cval(m[1]));
    if ((m = /Donne l'argument principal (?:\(dans [^)]*\) )?de \\\(z = ([^\\]*(?:\\sqrt\{\d+\}[^\\]*)?)\\\)/.exec(raw))) return argP(cval(m[1]));
    if ((m = /Donne l'argument principal de \\\(z\^(\d+)\\\) avec \\\(z = ([^\\]*(?:\\sqrt\{\d+\}[^\\]*)?)\\\)/.exec(raw))) return argP(C_.pow(cval(m[2]), [+m[1], 0]));
    if ((m = /Donne l'argument principal de \\\(([\s\S]*?)\\\)\.$/.exec(raw))) { const v = cval(m[1]); return fin(v[0]) ? argP(v) : null; }
    if ((m = /Calcule \\\(([^\\]*(?:\\sqrt\{\d+\}[^\\]*)?)\\\) sous la forme \\\(a \+ bi\\\)/.exec(raw))) return { C: cfix(cval(m[1])) };
    if ((m = /Avec \\\(z_1 = ([^\\]*(?:\\frac\{[^}]*\}\{[^}]*\}[^\\]*)*)\\\) et \\\(z_2 = ([^\\]*(?:\\frac\{[^}]*\}\{[^}]*\}[^\\]*)*)\\\), donne (le module|l'argument principal) de \\\(([^\\]*(?:\\frac\{[^}]*\}\{[^}]*\})?)\\\)/.exec(raw))) {
      const z1 = cval(m[1]), z2 = cval(m[2]); const f = cfn(m[4].replace(/z_1/g, "z").replace(/z_2/g, "w")); if (!f) return null; const v = f({ z: z1, w: z2 }); return m[3] === "le module" ? C_.abs(v) : argP(v);
    }
    if ((m = /Quel est le plus petit entier \\\(n \\geq? 1\\\) tel que \\\(\(([^)]*)\)\^n\\\) soit un nombre réel (positif|négatif)/.exec(raw))) { const z = cval(m[1]); for (let n = 1; n < 100; n++) { const v = C_.pow(z, [n, 0]); if (Math.abs(v[1]) < 1e-6 * C_.abs(v) && (m[2] === "positif" ? v[0] > 0 : v[0] < 0)) return n; } return null; }
    /* équations */
    const pol = (tex) => { const f = cfn(tex, ["z"]); if (!f) return null; const c0 = f({ z: [0, 0] }), p1 = f({ z: [1, 0] }), m1_ = f({ z: [-1, 0] }), p2 = f({ z: [2, 0] }); const a = C_.mul([0.5, 0], C_.sub(C_.add(p1, m1_), C_.mul([2, 0], c0))), b = C_.mul([0.5, 0], C_.sub(p1, m1_)); const chk = C_.add(C_.add(C_.mul(a, [4, 0]), C_.mul(b, [2, 0])), c0); return near(chk[0], p2[0]) && near(chk[1], p2[1]) ? [a, b, c0] : null; };
    const croots = ([a, b, cc]) => { const D = C_.sub(C_.mul(b, b), C_.mul([4, 0], C_.mul(a, cc))), r = C_.abs(D), sq = [Math.sqrt((r + D[0]) / 2), (D[1] >= 0 ? 1 : -1) * Math.sqrt(Math.max(0, (r - D[0]) / 2))], d2a = C_.mul([2, 0], a); return [C_.div(C_.add(C_.mul([-1, 0], b), sq), d2a), C_.div(C_.sub(C_.mul([-1, 0], b), sq), d2a)]; };
    if ((m = /Résous \\\(([^=]*)= 0\\\) dans \\\(\\mathbb\{C\}\\\)[^.]*(?:et|;) donne la solution de partie imaginaire (positive|négative)/.exec(raw))) { const P = pol(m[1]); if (!P) return null; const r = croots(P).filter((v) => (m[2] === "positive" ? v[1] > 1e-9 : v[1] < -1e-9)); return r.length === 1 ? { C: cfix(r[0]) } : null; }
    if ((m = /Calcule le discriminant de \\\(([^=]*)= 0\\\)/.exec(raw))) { const P = pol(m[1]); if (!P) return null; const D = C_.sub(C_.mul(P[1], P[1]), C_.mul([4, 0], C_.mul(P[0], P[2]))); return Math.abs(D[1]) < 1e-9 ? D[0] : null; }
    if ((m = /Le nombre \\\(([^\\]*)\\\) est solution de \\\(z\^2 \+ bz \+ c = 0\\\) avec \\\(b\\\) et \\\(c\\\) réels\. Donne \\\(([bc])\\\)/.exec(raw))) { const z = cval(m[1]); return m[2] === "b" ? -2 * z[0] : z[0] * z[0] + z[1] * z[1]; }
    if ((m = /Le nombre \\\(([^\\]*)\\\) est solution de \\\(([^=]*)= 0\\\)\. Trouve l'autre solution/.exec(raw))) { const P = pol(m[2]), z = cval(m[1]); if (!P) return null; const v = C_.sub(C_.mul([-1, 0], C_.div(P[1], P[0])), z); return { C: cfix(v) }; }
    if ((m = /Résous \\\(z\^(\d) = ([^\\]*)\\\) dans \\\(\\mathbb\{C\}\\\)\. Donne la solution (imaginaire pure|réelle)/.exec(raw))) { const n = +m[1], w = cval(m[2]), r = C_.abs(w) ** (1 / n), a0 = C_.arg(w); const R0 = []; for (let k = 0; k < n; k++) { const a = (a0 + 2 * Math.PI * k) / n; R0.push([r * Math.cos(a), r * Math.sin(a)]); } const sel = R0.filter((v) => (m[3] === "réelle" ? Math.abs(v[1]) < 1e-9 : Math.abs(v[0]) < 1e-9)); return sel.length === 1 ? { C: cfix(sel[0]) } : null; }
    if ((m = /On résout \\\(z\^(\d) = ([^\\]*(?:\\frac\{[^}]*\}\{[^}]*\})?[^\\]*)\\\)\. Parmi les \d solutions, quel est le plus petit argument strictement positif/.exec(raw))) { const n = +m[1], w = cval(m[2]); const A = []; for (let k = 0; k < n; k++) { let a = (C_.arg(w) + 2 * Math.PI * k) / n; while (a <= 1e-12) a += 2 * Math.PI; while (a > 2 * Math.PI) a -= 2 * Math.PI; A.push(a); } return Math.min(...A); }
    return null;
  });

  /* ================= suites, séries ================= */
  O("suitegeom serie suitegeo suitearith", (c) => {
    const t = c.txt, raw = c.raw; let m;
    if ((m = mt(c, new RegExp(`Suite géométrique de premier terme u_([01]) = ${NB} et de raison q = ${NB}\\. Calcule u_${NB}`)))) return m[1] * m[2] ** (m[3] - m[0]);
    if ((m = mt(c, new RegExp(`Suite arithmétique de premier terme u_([01]) = ${NB} et de raison r = ${NB}\\. Calcule u_${NB}`)))) return m[1] + (m[3] - m[0]) * m[2];
    if ((m = mt(c, new RegExp(`Dans une suite arithmétique, u_${NB} = ${NB} et u_${NB} = ${NB}\\. Quelle est la raison`)))) return (m[3] - m[1]) / (m[2] - m[0]);
    if ((m = mt(c, new RegExp(`Dans une suite géométrique (?:de raison positive)?,? ?u_${NB} = ${NB} et u_${NB} = ${NB}\\. Quelle est la raison`)))) { const q = (m[3] / m[1]) ** (1 / (m[2] - m[0])); return q; }
    if ((m = mt(c, new RegExp(`Suite géométrique : u_1 = ${NB}, q = ${NB}\\. À partir de quel rang n a-t-on u_n > ${NB}`)))) { let n = 1; while (m[0] * m[1] ** (n - 1) <= m[2] && n < 1e4) n++; return n; }
    if ((m = mt(c, new RegExp(`on pose ${NB} grains sur la première case, puis on multiplie par ${NB} à chaque case\\. Combien de grains en tout sur les ${NB} premières cases`)))) return (m[0] * (m[1] ** m[2] - 1)) / (m[1] - 1);
    if ((m = mt(c, new RegExp(`le premier mois, elle met de côté ${NB} CHF, puis chaque mois ${NB} CHF de plus\\. Combien a-t-elle épargné en tout après ${NB} mois`)))) { const [a, r, n] = m; return (n * (2 * a + (n - 1) * r)) / 2; }
    if ((m = mt(c, new RegExp(`la première rangée compte ${NB} places, chaque rangée en a ${NB} de plus que la précédente\\. Combien de places en tout dans les ${NB} rangées`)))) { const [a, r, n] = m; return (n * (2 * a + (n - 1) * r)) / 2; }
    if ((m = mt(c, new RegExp(`on verse ${NB} CHF sur un compte rémunéré à ${NB} % par an \\(intérêts composés\\)\\. Combien vaut le compte juste après le ${NB}e versement`)))) { const q = 1 + m[1] / 100; return (m[0] * (q ** m[2] - 1)) / (q - 1); }
    if ((m = mt(c, new RegExp(`Suite arithmétique : u_1 = ${NB}, r = ${NB}\\. Combien de termes faut-il additionner pour obtenir S_n = ${NB}`)))) { for (let n = 1; n < 1e4; n++) if (near((n * (2 * m[0] + (n - 1) * m[1])) / 2, m[2])) return n; return { err: "aucun n entier" }; }
    if ((m = /On définit \\\(u_0 = ([^\\]*)\\\) et \\\(u_\{n \+ 1\} = ([^\\]*)\\\)\..*calcule \\\(u_\{?(\d+)\}?\\\)/.exec(raw))) { const f = fn(m[2].replace(/u_n/g, "U"), ["U"]); if (!f) return null; let u = val(m[1]); for (let k = 0; k < +m[3]; k++) u = f(u); return u; }
    /* séries */
    if ((m = /Calcule la somme de la série géométrique \\\(([^+]+) \+ ([^+]+) \+/.exec(raw))) { const a = val(m[1]), b = val(m[2]), q = b / a; return Math.abs(q) < 1 ? a / (1 - q) : { err: "série divergente" }; }
    if ((m = mt(c, new RegExp(`On lâche une balle d'une hauteur de ${NB} m\\. À chaque rebond, elle remonte à ${NB} % de la hauteur précédente\\. Quelle distance totale`)))) { const h = m[0], p = m[1] / 100; return h + (2 * h * p) / (1 - p); }
    if ((m = /Série \\\(\\sum_\{k = 0\}\^\{\+\\infty\} ([\d{},]+)\^k\\\).*plus petit \\\(n\\\) tel que .* inférieur à \\\(([\d{},]+)\\\)/.exec(raw))) { const q = val(m[1]), e = val(m[2]); let n = 0; while (q ** n / (1 - q) >= e && n < 1e5) n++; return n; }
    if ((m = /terme général \\\(a_n = ([^\\]*(?:\\frac\{[^}]*\}\{[^}]*\})?[^\\]*)\\\), calcule \\\(\\lim_\{n \\to \+\\infty\} \\frac\{a_\{n \+ 1\}\}\{a_n\}\\\)/.exec(raw))) { const f = fn(m[1], ["n"]); if (!f) return null; const r = (n) => f(n + 1) / f(n); return snap(2 * r(200) - r(100), 1e-4); }
    if ((m = /Pour quelle valeur de \\\(x\\\) \(avec \\\(\|x\| < (\d+)\\\)\) a-t-on \\\(\\sum_\{n = 0\}\^\{\+\\infty\} ([\s\S]*?)\^n = ([^\\]*)\\\)/.exec(raw))) { const g = fn(m[2]), S = val(m[3]); if (!g) return null; const r = zeros((x) => (Math.abs(x) < +m[1] ? 1 / (1 - g(x)) - S : NaN), 10); return r.length === 1 ? snap(r[0], 1e-7) : null; }
    if ((m = mt(c, new RegExp(`On dessine un carré de côté ${NB} cm, puis le carré dont les sommets sont les milieux de ses côtés`)))) return 2 * m[0] * m[0];
    if ((m = /développement de Mac-Laurin de \\\(f\(x\) = e\^\{(-?\d*)x\}\\\), quel est le coefficient de \\\(x\^\{?(\d+)\}?\\\)/.exec(raw))) { const a = m[1] === "" ? 1 : m[1] === "-" ? -1 : +m[1], k = +m[2]; return a ** k / fact(k); }
    if ((m = /Calcule \\\(\\sum_\{n = (\d+)\}\^\{(\d+)\} ([\s\S]*?)\\\)/.exec(raw))) { const f = fn(m[3], ["n"]); if (!f) return null; let s = 0; for (let n = +m[1]; n <= +m[2]; n++) s += f(n); return snap(s, 1e-10, 2000); }
    return null;
  });
  /* géométrie dans l'espace (4e) */
  O("geoesp", (c) => {
    const t = c.txt; let m;
    if ((m = mt(c, new RegExp(`dimensions AB = ${NB} cm, BC = ${NB} cm et AE = ${NB} cm\\. Calcule la longueur de sa diagonale \\[AG\\]`)))) return Math.hypot(...m);
    if ((m = mt(c, new RegExp(`base carrée a une base de côté ${NB} cm\\. La hauteur de chaque face latérale \\(apothème[^)]*\\) mesure ${NB} cm\\. Calcule le volume`)))) { const [a, ap] = m, h = Math.sqrt(ap * ap - (a / 2) ** 2); return (a * a * h) / 3; }
    if ((m = mt(c, new RegExp(`base carrée de côté ${NB} cm et une hauteur SO = ${NB} cm\\. Calcule l'angle entre l'arête \\[SA\\] et la base`)))) return deg(Math.atan(m[1] / ((m[0] * Math.SQRT2) / 2)));
    if ((m = mt(c, new RegExp(`On coupe un cube ABCDEFGH d'arête ${NB} cm par le plan qui passe par les sommets B, D et E`)))) return (Math.sqrt(3) / 4) * 2 * m[0] * m[0];
    if ((m = mt(c, new RegExp(`mesure AB = ${NB} cm, BC = ${NB} cm et AE = ${NB} cm\\. On le coupe par le plan qui contient les arêtes \\[AE\\] et \\[CG\\]`)))) return Math.hypot(m[0], m[1]) * m[2];
    if ((m = mt(c, new RegExp(`base carrée a une base de côté ${NB} cm et une hauteur de ${NB} cm\\. On la coupe par un plan parallèle à la base, à ${NB} cm au-dessus de la base\\. Calcule l'aire de la section`)))) { const k = (m[1] - m[2]) / m[1]; return (k * m[0]) ** 2; }
    if ((m = /Un cône de révolution a un rayon de base de (\d+) cm et une hauteur de (\d+) cm\. On le coupe par un plan parallèle à la base qui passe aux \\\(\\frac\{(\d+)\}\{(\d+)\}\\\) de la hauteur en partant du sommet\. Calcule le volume du (tronc de cône|petit cône)/.exec(c.raw))) { const r = +m[1], h = +m[2], k = +m[3] / +m[4], V = (Math.PI * r * r * h) / 3; return m[5] === "petit cône" ? V * k ** 3 : V * (1 - k ** 3); }
    return null;
  });


  /* ================= MP 3e–4e ================= */
  const piSnap = (v) => Math.PI * snap(v / Math.PI, 1e-7, 60);
  O("logdef logprop eqlog", (c) => {
    const t = c.txt, raw = c.raw; let m;
    if ((m = /^Résous \\\(\\log_\{?(\d+)\}? x = ([^\\]*)\\\)\.?/.exec(raw))) return { S: [(+m[1]) ** val(m[2])] };
    if ((m = /^Calcule sans calculatrice \\\(([^\\]*(?:\\(?:log|frac|sqrt|cdot)[^\\]*)*)\\\)\.?(?: \(fraction\))?$/.exec(raw))) { const v = val(m[1]); return fin(v) ? snap(v, 1e-9) : null; }
    if ((m = /^Résous \\\(([\d{},]+)\^\{x\} = ([\d{},]+)\\\)/.exec(raw))) return Math.log(val(m[2])) / Math.log(val(m[1]));
    if ((m = /Calcule \\\(L\\\) pour un son \\\(([^\\]*(?:\\cdot[^\\]*)?)\\\) fois plus intense/.exec(raw))) return 10 * Math.log10(val(m[1]));
    if ((m = /Calcule le pH si \\\(\[H\^\+\] = ([^\\]*(?:\\cdot[^\\]*)?)\\\)/.exec(raw))) return -Math.log10(val(m[1]));
    if ((m = /^Sachant que \\\(\\log 2 \\approx ([\d{},]+)\\\)(?: et \\\(\\log 3 \\approx ([\d{},]+)\\\))?, calcule sans calculatrice \\\(\\log ([\d{},]+)\\\)/.exec(raw))) {
      const l2 = val(m[1]), l3 = m[2] ? val(m[2]) : NaN, n = val(m[3]);
      for (let a = -6; a <= 6; a++) for (let b = m[2] ? -6 : 0; b <= (m[2] ? 6 : 0); b++) for (let e = -4; e <= 4; e++) if (near(2 ** a * 3 ** b * 10 ** e, n, 1e-12)) return { v: a * l2 + (b ? b * l3 : 0) + e };
      return null;
    }
    if ((m = /^Simplifie \\\(\\log_a\\left\(([\s\S]*?)\\right\)\\\)/.exec(raw))) { const f = fn(m[1], ["a"]); if (!f) return null; const v2 = Math.log(f(2)) / Math.log(2), v3 = Math.log(f(3)) / Math.log(3); return near(v2, v3) ? snap(v2, 1e-9) : { err: "dépend de a" }; }
    if ((m = /^Résous \\\(\\log_\{?(\d+)\}? x = ([^\\]*)\\\)/.exec(raw))) { const v = val(m[2]); return fin(v) ? { S: [snap((+m[1]) ** v, 1e-9)] } : null; }
    return null;
  });
  O("croissexp explogfn", (c) => {
    const t = c.txt, raw = c.raw, f = Object.values(c.D)[0]; let m;
    if ((m = mt(c, new RegExp(`Combien y a-t-il de bactéries après ${NB} heures`))) && f) return f(m[0]);
    if ((m = mt(c, new RegExp(`achetée ${NB} CHF perd ${NB} % de sa valeur chaque année\\. Que vaut-elle après ${NB} ans`)))) return m[0] * (1 - m[1] / 100) ** m[2];
    if ((m = mt(c, new RegExp(`Un capital de ${NB} CHF est placé à ${NB} % d'intérêts composés par an\\. Que vaut-il après ${NB} ans`)))) return m[0] * (1 + m[1] / 100) ** m[2];
    if ((m = mt(c, new RegExp(`Un capital est placé à ${NB} % d'intérêts composés\\. Après combien d'années entières aura-t-il doublé`)))) { let n = 1; while ((1 + m[0] / 100) ** n < 2) n++; return n; }
    if ((m = mt(c, new RegExp(`Une culture de ${NB} bactéries double toutes les ${NB} heures\\. Après combien d'heures y en aura-t-il ${NB}`)))) return m[1] * Math.log2(m[2] / m[0]);
    if ((m = mt(c, new RegExp(`Un capital de ${NB} CHF placé à intérêts composés vaut ${NB} CHF après ${NB} ans\\. Quel est le taux annuel`)))) return 100 * ((m[1] / m[0]) ** (1 / m[2]) - 1);
    if ((m = mt(c, new RegExp(`Le corps élimine ${NB} % d'un médicament par heure\\. Après combien d'heures entières en reste-t-il moins de ${NB} %`)))) { let n = 1; while ((1 - m[0] / 100) ** n >= m[1] / 100) n++; return n; }
    if ((m = mt(c, new RegExp(`passe par \\(0 ; ${NB}\\) et \\(${NB} ; ${NB}\\)\\. (?:Que vaut b|Calcule f\\(${NB}\\))`)))) { const a = m[0], b = (m[2] / a) ** (1 / m[1]); return /Que vaut b/.test(t) ? snap(b, 1e-9) : a * b ** m[3]; }
    if ((m = /Quel est le zéro de \\\(f\(x\) = ([^\\]*(?:\\log[^\\]*)*)\\\)/.exec(raw))) { const g = fn(m[1]); return g ? { S: zeros(g, 200).map((v) => snap(v)) } : null; }
    if ((m = /Quel est son zéro/.exec(t)) && (m = /\\\(g\(x\) = ([^\\]*(?:\\log[^\\]*)*)\\\)/.exec(raw))) { const g = fn(m[1]); return g ? { S: zeros(g).map((v) => snap(v)) } : null; }
    if (/Quel est l'ensemble de définition de/.test(t) && f) return { I: (u) => fin(f(u)), pts: zeros((u) => (fin(f(u)) ? 1 : -1)) };
    if ((m = mt(c, new RegExp(`Estime la population après ${NB} ans`))) && f) return f(m[0]);
    if ((m = /Calcule \\\(f\^\{-1\}\(([^)]*)\)\\\)/.exec(raw)) && f) { const y = val(m[1]), r = zeros((u) => f(u) - y); return r.length === 1 ? snap(r[0]) : null; }
    if ((m = /Après combien de jours y a-t-il \\\(([\d\\text{}']+)\\\) malades/.exec(raw)) && f) { const y = val(m[1].replace(/\\text\{'\}/g, "")), r = zeros((u) => f(u) - y); return r.length === 1 ? r[0] : null; }
    return null;
  });
  O("similmp", (c) => {
    const t = c.txt; let m;
    if ((m = mt(c, new RegExp(`figure d'aire ${NB} cm\\^2 Toutes ses longueurs sont multipliées par ${NB}`))) || (m = mt(c, new RegExp(`figure d'aire ${NB} cm\\^2\\.? Toutes ses longueurs sont multipliées par ${NB}`)))) return m[0] * m[1] ** 2;
    if ((m = mt(c, new RegExp(`solide de volume ${NB} cm\\^3\\.? Ses longueurs sont multipliées par ${NB}`)))) return m[0] * m[1] ** 3;
    if ((m = /Une statue de ([\d,]+) (m|cm) pèse ([\d']+) kg\. Quelle est la masse d'une copie semblable, dans le même matériau, de ([\d,]+) (m|cm)/.exec(t))) { const L = (v, u) => nn(v) * (u === "m" ? 100 : 1); return nn(m[3]) * (L(m[4], m[5]) / L(m[1], m[2])) ** 3; }
    if ((m = /Un verre conique \(pointe en bas\) est rempli jusqu'aux \\\(\\frac\{(\d+)\}\{(\d+)\}\\\) de sa hauteur/.exec(c.raw))) return 100 * (+m[1] / +m[2]) ** 3;
    if ((m = mt(c, new RegExp(`Deux bouteilles semblables mesurent ${NB} cm et ${NB} cm de haut\\. La première contient ${NB} L`)))) return m[2] * (m[1] / m[0]) ** 3;
    if ((m = mt(c, new RegExp(`Sur une carte au 1 : ${NB}, un terrain couvre ${NB} cm\\^2\\. Quelle est sa surface réelle \\(en m²\\)`)))) return (m[1] * m[0] * m[0]) / 1e4;
    if ((m = mt(c, new RegExp(`Deux cônes semblables ont des volumes de ${NB} cm\\^3 et ${NB} cm\\^3\\. Quel est le rapport de leurs hauteurs \\(petit ÷ grand\\)`)))) return snap(Math.cbrt(m[0] / m[1]), 1e-9);
    if ((m = mt(c, new RegExp(`Deux boîtes semblables ont des surfaces de ${NB} cm\\^2 et ${NB} cm\\^2\\. La première a un volume de ${NB} cm\\^3`)))) return m[2] * (m[1] / m[0]) ** 1.5;
    if ((m = /Un cône a un volume de \\\((\d+)\\ ?\\text\{ ?cm\}\^3\\\)\. On le coupe par un plan parallèle à la base, aux \\\(\\frac\{(\d+)\}\{(\d+)\}\\\) de sa hauteur depuis la pointe\. Quel est le volume du (tronc de cône|petit cône)/.exec(c.raw)) || (m = /Un cône a un volume de \\\((\d+)\\\) cm\^3\. On le coupe[^\\]*\\\(\\frac\{(\d+)\}\{(\d+)\}\\\)[^?]*volume du (tronc de cône|petit cône)/.exec(c.raw))) { const V = +m[1], k = +m[2] / +m[3]; return m[4] === "petit cône" ? V * k ** 3 : V * (1 - k ** 3); }
    if ((m = mt(c, new RegExp(`On veut multiplier par ${NB} le volume d'un ballon sphérique de rayon ${NB} cm\\. Quel doit être le nouveau rayon`)))) return m[1] * Math.cbrt(m[0]);
    return null;
  });
  O("sinusmp", (c) => {
    const t = c.txt, raw = c.raw, f = Object.values(c.D)[0]; let m;
    if (/Quelle est la période de/.test(t) && f) { const S0 = (raw.match(/\\sin\\?l?e?f?t?\(?\s*([^)]*?)x/) || []); const b = /\\sin\\left\(\\frac\{(\d+)\}\{(\d+)\}x\\right\)|\\sin\((\d*)x\)|\\sin\\left\((\d*)x\\right\)/.exec(raw); if (!b) return null; const k = b[1] ? +b[1] / +b[2] : b[3] !== undefined ? (b[3] === "" ? 1 : +b[3]) : b[4] === "" ? 1 : +b[4]; return piSnap((2 * Math.PI) / k); }
    if ((m = mt(c, new RegExp(`varie au cours de l'année entre ${NB}° C et ${NB}° C\\. On la modélise par f\\(x\\) = a sin\\(b x\\) \\+ d\\. Que vaut (d|a)`)))) return /Que vaut d/.test(t) ? (m[0] + m[1]) / 2 : (m[1] - m[0]) / 2;
    if ((m = /donne le premier \\\(x > ([^\\]*(?:\\frac\{[^}]*\}\{[^}]*\})?[^\\]*)\\\) où \\\(f\\\) est (maximale|minimale)/.exec(raw)) && f) {
      const x0 = val(m[1]), s = m[2] === "maximale" ? 1 : -1, g = (u) => d1(f, u); const r = zsc(g, 40).filter((u) => u > x0 + 1e-9 && s * g(u - 1e-3) > 0).sort((a, b) => a - b); return r.length ? piSnap(r[0]) : null;
    }
    if ((m = mt(c, new RegExp(`À quelle heure la hauteur vaut-elle ${NB} m pour la première fois`))) && f) { const r = zeros((u) => f(u) - m[0], 30).filter((u) => u > 0).sort((a, b) => a - b); return r.length ? r[0] : null; }
    return null;
  });
  O("fctmp", (c) => {
    const t = c.txt, raw = c.raw, D = c.D; let m;
    if ((m = /La fonction \\\(f\(x\) = ([^\\]*)\\\) est bijective de \\\(([^\\]*(?:\\[a-z]+[^\\]*)*)\\\) vers .*Calcule \\\(f\^\{-1\}\(([^)]*)\)\\\)/.exec(raw))) {
      const f = fn(m[1]), y = val(m[3]); if (!f) return null; const I = m[2].replace(/\\,|;/g, " "), pos = /^\[\s*0\s/.test(I), neg = /\s0\s*\]$/.test(I.trim());
      const r = zeros((u) => f(u) - y).filter((u) => (pos ? u >= -1e-12 : neg ? u <= 1e-12 : true)); return r.length === 1 ? snap(r[0]) : { err: r.length + " antécédents dans l'intervalle" };
    }
    if ((m = /On sait que \\\(f\(([^)]*)\) = ([^\\]*)\\\)\. Soit \\\(g\(x\) = ([^\\]*)\\\)\. Que vaut \\\(g\(([^)]*)\)\\\)/.exec(raw))) {
      const a = val(m[1]), b = val(m[2]), x0 = val(m[4]), q = /f\(([^()]*)\)/.exec(m[3]); if (!q) return null; const inner = fn(q[1]), outer = fn(m[3].replace(/f\([^()]*\)/, "F"), ["F"]); if (!inner || !outer) return null;
      return near(inner(x0), a) ? outer(b) : { err: "g(" + x0 + ") ne fait pas intervenir f(" + a + ")" };
    }
    if ((m = /Le point \\\(\(([^\\]*)\)\\\) est sur le graphe de \\\(f\\\)\. Donne le point correspondant du graphe de \\\(g\(x\) = ([^\\]*(?:\\frac\{\d+\}\{\d+\}[^\\]*)*)\\\)/.exec(raw))) {
      const [x0, y0] = m[1].split(/\\,;\\,|;/).map((u) => val(u)), q = /f\(([^()]*)\)/.exec(m[2]); if (!q) return null; const inner = fn(q[1]), outer = fn(m[2].replace(/f\([^()]*\)/, "F"), ["F"]); if (!inner || !outer) return null;
      const a = inner(1) - inner(0), b = inner(0); return { P: [snap((x0 - b) / a), outer(y0)] };
    }
    if ((m = /Donne l'expression de \\\(f\^\{-1\}\(x\)\\\)/.exec(raw)) && D.f) { const f = D.f, inv = (y) => { const r = zsc((u) => f(u) - y, 60); return r.length === 1 ? r[0] : NaN; }; return { E: inv, pts: [-2.3, -1.1, 0.7, 1.6, 2.9, 3.4, 7.7, 11.2] }; }
    if (/Quel est l'ensemble de définition de/.test(t) && D.f) return { I: (u) => fin(D.f(u)), pts: zeros((u) => (fin(D.f(u)) ? 1 : -1)) };
    if (/coordonnées du point d'intersection des graphes de f\(x\) = .* et g\(x\) = /.test(t) && D.f && D.g) { const r = zeros((u) => D.f(u) - D.g(u)).filter((u) => fin(D.f(u))); return r.length === 1 ? { P: [snap(r[0]), snap(D.f(r[0]))] } : { err: r.length + " intersections" }; }
    return null;
  });
  O("posdroites", (c) => {
    const t = c.txt, raw = c.raw; let m;
    const K = cases(raw);
    if ((m = /coupe la droite \\\(g\\\) ?:? ?\\\(y = ([^\\]*)\\\)|coupe la droite g y = /.exec(raw)) || /coupe la droite g/.test(t)) {
      const L = K.length && param(K[0]); const s = c.S.find((u) => /^y = /.test(u)); const G = s && fn(s.slice(4)); if (!L || !G) return null; const k = lin((u) => { const P = L.at(u, 0); return P[1] - G(P[0]); }); return { P: L.at(k, 0).map((v) => snap(v)) };
    }
    if ((m = /Pour quelle valeur de \\\(m\\\) la droite \\\(d\\\) : .* est-elle parallèle à la droite \\\(g\\\) : \\\(([^=]*)=\s*([^\\]*)\\\)/.exec(raw))) {
      const rows = K[0].map((r) => fn(r.replace(/^[xy]\s*=\s*/, ""), ["t", "m"])), gl = fn(m[1], ["x", "y"]); if (rows.some((f) => !f) || !gl) return null; const a = gl({ x: 1, y: 0 }) - gl({ x: 0, y: 0 }), b = gl({ x: 0, y: 1 }) - gl({ x: 0, y: 0 });
      return lin((k) => { const dx = rows[0]({ t: 1, m: k }) - rows[0]({ t: 0, m: k }), dy = rows[1]({ t: 1, m: k }) - rows[1]({ t: 0, m: k }); return dx * -a - dy * b; });
    }
    if ((m = /Pour quelle valeur du paramètre \\\(t\\\) la droite \\\(d\\\) : .* coupe-t-elle la droite \\\(([^=]*)=\s*([^\\]*)\\\)/.exec(raw))) { const L = param(K[0]), gl = fn(m[1], ["x", "y"]), r = val(m[2]); if (!L || !gl) return null; return lin((u) => { const P = L.at(u, 0); return gl({ x: P[0], y: P[1] }) - r; }); }
    if ((m = /sont parallèles\. Pour quelle valeur de \\\(c\\\) sont-elles confondues/.exec(raw)) && K.length === 2) {
      const L = param(K[0]), rows = K[1].map((r) => fn(r.replace(/^[xyz]\s*=\s*/, ""), ["s", "c"])); if (!L || rows.some((f) => !f)) return null;
      const i = rows.findIndex((f) => f({ s: 0, c: 0 }) === f({ s: 0, c: 1 })), j = rows.findIndex((f) => f({ s: 0, c: 0 }) !== f({ s: 0, c: 1 })); if (i < 0 || j < 0 || !L.dir[i]) return null;
      const k = (rows[i]({ s: 0, c: 0 }) - L.P0[i]) / L.dir[i]; return lin((cc) => rows[j]({ s: 0, c: cc }) - (L.P0[j] + k * L.dir[j]));
    }
    if (/Pour quelle valeur de \\\(m\\\) les droites de l'espace .* sont-elles parallèles/.test(raw) && K.length === 2) {
      const D2 = K.map((rows) => rows.map((r) => fn(r.replace(/^[xyz]\s*=\s*/, ""), ["t", "s", "m"]))); if (D2.flat().some((f) => !f)) return null;
      const dir = (D, k) => D.map((f) => f({ t: 1, s: 1, m: k }) - f({ t: 0, s: 0, m: k })); const W = [0, 1].map((q) => [0, 1, 2].map((i) => (k) => dir(D2[q], k)[i])); return colM(W);
    }
    if (/Pour quelle valeur de \\\(m\\\) les droites \\\(d\\\) : .* et \\\(g\\\) : .* sont-elles sécantes/.test(raw) && K.length === 2) {
      const KK = K.map((rows) => rows.map((r) => fn(r.replace(/^[xyz]\s*=\s*/, ""), ["t", "s", "m"]))); if (KK.flat().some((f) => !f)) return null;
      const g = (D, k, l, mm) => D.map((f) => f({ t: k, s: l, m: mm })), i0 = [0, 1, 2].filter((i) => KK.every((D) => D[i]({ t: 1, s: 1, m: 0 }) === D[i]({ t: 1, s: 1, m: 1 }))); if (i0.length < 2) return null;
      const [i, j] = i0, A0 = g(KK[0], 0, 0, 0), a = add(sub(g(KK[0], 1, 0, 0), A0), sub(g(KK[0], 0, 1, 0), A0)), B0 = g(KK[1], 0, 0, 0), b = add(sub(g(KK[1], 1, 0, 0), B0), sub(g(KK[1], 0, 1, 0), B0));
      const sol = cramer([[a[i], -b[i]], [a[j], -b[j]]], [B0[i] - A0[i], B0[j] - A0[j]]); if (!sol) return null; const z = [0, 1, 2].find((q) => q !== i && q !== j);
      return lin((mm) => add(g(KK[0], 0, 0, mm), mul(sol[0], a))[z] - add(g(KK[1], 0, 0, mm), mul(sol[1], b))[z]);
    }
    return null;
  });
  O("polymp", (c) => {
    const t = c.txt, raw = c.raw, P = c.D.P; let m;
    if (/^Donne les zéros de P\(x\)|^Trouve tous les zéros de P\(x\)/.test(t) && P) return { S: zeros(P).map((v) => snap(v)) };
    if ((m = /Le nombre \\\(([^\\]*)\\\) est un zéro de \\\(P\(x\) = ([^\\]*)\\\)\. Que vaut \\\(([a-z])\\\)/.exec(raw))) { const F = fn(m[2], ["x", m[3]]); if (!F) return null; const a = val(m[1]); return lin((k) => F({ x: a, [m[3]]: k })); }
    if ((m = /Le nombre \\\(([^\\]*)\\\) est un zéro de \\\(P\(x\) = ([^\\]*)\\\)\. Trouve les autres zéros/.exec(raw)) && P) { const a = val(m[1]); if (!near(P(a), 0)) return { err: a + " n'est pas un zéro" }; return { S: zeros(P).filter((u) => !near(u, a, 1e-7)).map((v) => snap(v)) }; }
    if ((m = /Quel est le reste de la division de \\\(P\(x\) = [^\\]*\\\) par \\\(([^\\]*)\\\)/.exec(raw)) && P) { const d = fn(m[1]); if (!d) return null; const r = zeros(d); return r.length === 1 ? snap(P(r[0])) : null; }
    if ((m = /Effectue la division de \\\(P\(x\) = [^\\]*\\\) par \\\(([^\\]*)\\\)\. Donne le quotient/.exec(raw)) && P) { const d = fn(m[1]); if (!d) return null; const a = zeros(d)[0], r = P(a); return { E: (u) => (P(u) - r) / d(u) }; }
    if ((m = /^Résous \\\(([^≤≥]*?) (\\le|\\ge|<|>) 0\\\)\.?$/.exec(raw))) { const g = fn(m[1]); if (!g) return null; const o = m[2]; return { I: (u) => { const v = g(u); return o === "\\le" ? v <= 1e-9 : o === "\\ge" ? v >= -1e-9 : o === "<" ? v < -1e-12 : v > 1e-12; }, pts: zeros(g) }; }
    return null;
  });
  O("volmp coordmp", (c) => {
    const t = c.txt; let m;
    if ((m = mt(c, new RegExp(`Un ballon sphérique a un diamètre de ${NB} cm\\. Quel volume d'air contient-il, en litres`)))) return ((4 / 3) * Math.PI * (m[0] / 2) ** 3) / 1000;
    if ((m = mt(c, new RegExp(`Calcule le volume d'un cône de rayon ${NB} cm et de hauteur ${NB} cm`)))) return (Math.PI * m[0] ** 2 * m[1]) / 3;
    if ((m = mt(c, new RegExp(`Calcule le volume d'une boule de rayon ${NB} cm`)))) return (4 / 3) * Math.PI * m[0] ** 3;
    if ((m = mt(c, new RegExp(`Calcule le volume d'un cylindre de rayon ${NB} cm et de hauteur ${NB} cm`)))) return Math.PI * m[0] ** 2 * m[1];
    if ((m = mt(c, new RegExp(`Un cône de hauteur ${NB} cm a un volume de ${NB}π cm\\^3\\. Quel est son rayon`)))) return Math.sqrt((3 * m[1]) / m[0]);
    if ((m = mt(c, new RegExp(`Un cylindre de rayon ${NB} cm a un volume de ${NB}π cm\\^3\\. Quelle est sa hauteur`)))) return m[1] / m[0] ** 2;
    if ((m = mt(c, new RegExp(`base un triangle rectangle dont les côtés de l'angle droit mesurent ${NB} cm et ${NB} cm\\. Sa hauteur vaut ${NB} cm\\. Calcule son volume`)))) return (m[0] * m[1] * m[2]) / 2;
    if ((m = mt(c, new RegExp(`Un silo est formé d'un cylindre de rayon ${NB} m et de hauteur ${NB} m, surmonté d'un cône de même rayon et de hauteur ${NB} m`)))) return Math.PI * m[0] ** 2 * (m[1] + m[2] / 3);
    if ((m = mt(c, new RegExp(`Un silo est formé d'un cylindre de rayon ${NB} m et de hauteur ${NB} m, surmonté d'une demi-boule de même rayon`)))) return Math.PI * m[0] ** 2 * m[1] + (2 / 3) * Math.PI * m[0] ** 3;
    if ((m = mt(c, new RegExp(`Un cône a un rayon de ${NB} cm et une génératrice de ${NB} cm\\. Calcule son volume`)))) return (Math.PI * m[0] ** 2 * Math.sqrt(m[1] ** 2 - m[0] ** 2)) / 3;
    if ((m = /coordonnées polaires \(r ; θ\) = \((\d+(?:,\d+)?) ; (-?\d+)°\)/.exec(t))) { const r = nn(m[1]), a = rad(+m[2]); return { P: [r * Math.cos(a), r * Math.sin(a)] }; }
    if ((m = mt(c, new RegExp(`Trouve le point P\\(x ; 0\\) de l'axe des abscisses situé à égale distance de A\\(${NB} ; ${NB}\\) et de B\\(${NB} ; ${NB}\\)`)))) { const [xa, ya, xb, yb] = m; return lin((x) => (x - xa) ** 2 + ya * ya - (x - xb) ** 2 - yb * yb); }
    return null;
  });


  /* 3e Collège : compléments (polyfact, log, expo) */
  O("polyfact log expo logdef logprop", (c) => {
    const t = c.txt, raw = c.raw; let m;
    if ((m = /Sachant que \\\(([^\\]*)\\\) est racine de : \\\(P\(x\) = ([^\\]*)\\\)/.exec(raw)) && /résous/.test(t)) { const P = fn(m[2]); if (!P) return null; if (!near(P(val(m[1])), 0)) return { err: "la racine annoncée n'en est pas une" }; return { S: zeros(P).map((v) => snap(v)) }; }
    if ((m = /^Calcule(?: sans calculatrice)? ?:? \\\(([^\\]*(?:\\(?:log|ln|frac)[^\\]*)+)\\\)\.?$/.exec(raw)) && /\\log|\\ln/.test(m[1])) { const v = val(m[1]); return fin(v) ? snap(v, 1e-9) : null; }
    if ((m = mt(c, new RegExp(`Un capital est placé à ${NB} % d'intérêt composé par an\\. Au bout de combien d'années complètes aura-t-il au moins doublé`)))) { let n = 1; while ((1 + m[0] / 100) ** n < 2) n++; return { v: n, st: null }; }
    if ((m = mt(c, new RegExp(`Après ${NB} ans à ${NB} % d'intérêt composé, un capital vaut ${NB} CHF\\. Quel était le capital de départ`)))) return m[2] / (1 + m[1] / 100) ** m[0];
    if ((m = mt(c, new RegExp(`Un capital de ${NB} CHF est placé à ${NB} % d'intérêt composé par an\\. Que vaut-il après ${NB} ans`)))) return m[0] * (1 + m[1] / 100) ** m[2];
    return null;
  });


  /* dérivées : nombre dérivé, fonction dérivée, pentes (derivref, derivregles, derivprodquot, derivcomp) */
  O("derivref derivregles derivprodquot derivcomp lnexp nbderive", (c) => {
    const t = c.txt, raw = c.raw; let m; const f = Object.values(c.D)[0];
    if ((m = /calcule \\\(([a-zA-Z])'\(([^)]*)\)\\\)/.exec(raw)) && c.D[m[1]]) return snap(d1(c.D[m[1]], val(m[2])), 1e-8);
    if (/Donne la fonction dérivée de f\(x\) = .* Écris seulement l'expression de f'\(x\)/.test(t) && c.D.f) { const pos = /\\sqrt|\\ln|x\^\{?-?\\frac|x\^\{-/.test(raw); return { E: (u) => d1(c.D.f, u), pos }; }
    if ((m = mt(c, new RegExp(`En quelles abscisses la tangente au graphe de f\\(x\\) = .* a-t-elle une pente égale à ${NB}`))) && c.D.f) return { S: zeros((u) => d1(c.D.f, u) - m[0]).map((v) => snap(v, 1e-7)) };
    if (/En quelles abscisses la tangente au graphe de f\(x\) = .* est-elle horizontale/.test(t) && c.D.f) return { S: zeros((u) => d1(c.D.f, u)).filter((u) => fin(c.D.f(u))).map((v) => snap(v, 1e-7)) };
    if (/Après combien d'heures la concentration est-elle maximale/.test(t) && f) return opt(f, 0, 60, 1, 20000)[0];
    if ((m = /À quelle vitesse (?:verticale )?\(en m\/(?:h|min)\) .* à \\\(t = ([^\\]*)\\\)/.exec(raw)) && f) { const v = d1(f, val(m[1])); return { v: Math.PI * snap(v / Math.PI, 1e-7, 60) }; }
    if ((m = /Pour \\\(f\(x\) = ([^\\]*)\\\), on sait que \\\(f'\(([^)]*)\) = ([^\\]*)\\\)\. Que vaut \\\(([a-z])\\\)/.exec(raw))) { const F = fn(m[1].replace(/\\cdot/g, "*"), ["x", m[4]]); if (!F) return null; return lin((k) => d1((u) => F({ x: u, [m[4]]: k }), val(m[2])) - val(m[3])); }
    return null;
  });
  O("eqlog eqexp logdef", (c) => {
    const m = /^Résous \\\(([^=]*\\log[^=]*)=([^\\]*)\\\)\.?/.exec(c.raw); if (!m) return null; const L = fn(m[1]), Rr = fn(m[2]); if (!L || !Rr) return null;
    const g = (u) => L(u) - Rr(u), big = zeros((w) => g(Math.exp(w)), 25).map(Math.exp).filter((u) => u > 199); /* grandes solutions (x = 1012, 1000) : recherche en ln x */
    return { S: [...zeros(g, 200), ...big].map((v) => snap(v, 1e-8)) };
  });
  O("eqlog", (c) => { const m = mt(c, new RegExp(`Un son a un niveau de ${NB} dB\\. Combien de fois son intensité est-elle plus grande que I_0`)); return m ? 10 ** (m[0] / 10) : null; });
  O("puisrat", (c) => {
    const raw = c.raw; let m;
    if ((m = /^Simplifie \\\(([^\\]*(?:\\frac\{[^}]*\}\{[^}]*\}[^\\]*|\\cdot[^\\]*|\\sqrt[^\\]*)*)\\\) en \\\(x\^k\\\)/.exec(raw)) || (m = /^Écris \\\(([^\\]*(?:\\sqrt(?:\[\d\])?\{[^}]*\}[^\\]*|\\frac\{[^}]*\}\{[^}]*\}[^\\]*)*)\\\) sous la forme \\\(x\^k\\\)/.exec(raw))) { const f = fn(m[1]); if (!f) return null; const k2 = Math.log(f(2)) / Math.log(2), k3 = Math.log(f(3)) / Math.log(3); return near(k2, k3) ? snap(k2, 1e-9) : { err: "pas une puissance de x" }; }
    if ((m = /^Simplifie \\\(([^\\]*(?:\\frac\{[^}]*\}\{[^}]*\}[^\\]*|\\cdot[^\\]*|\\sqrt[^\\]*)*)\\\) \(avec \\\(x > 0\\\)\)/.exec(raw))) { const f = fn(m[1]); return f ? { E: f, pos: true } : null; }
    return null;
  });
  O("sinusmp", (c) => {
    const t = c.txt, raw = c.raw, f = Object.values(c.D)[0]; let m;
    if ((m = /Quelle est la valeur (maximale|minimale) de f\(x\)/.exec(t)) && f) return snap(opt(f, 0, 40, m[1] === "maximale" ? 1 : -1, 20000)[1], 1e-7);
    if ((m = /Calcule \\\(f\(([^)]*(?:\\frac\{[^}]*\}\{[^}]*\})?[^)]*)\)\\\)/.exec(raw)) && f) return snap(f(val(m[1])), 1e-9);
    if ((m = mt(c, new RegExp(`varie entre ${NB} m et ${NB} m\\. On la modélise par f\\(x\\) = a sin\\(b x\\) \\+ d\\. Que vaut (?:l'amplitude a|d)`)))) return /amplitude/.test(t) ? (m[1] - m[0]) / 2 : (m[0] + m[1]) / 2;
    if ((m = mt(c, new RegExp(`Une sinusoïde coupe son axe en (montant|descendant) en x = 0, varie entre ${NB} et ${NB} et a une période de`)))) { const per = /période de \\\(([^\\]*)\\\)/.exec(raw); if (!per) return null; const T = val(per[1]), a = ((m[2] - m[1]) / 2) * (/montant/.test(t) ? 1 : -1), d = (m[1] + m[2]) / 2, b = (2 * Math.PI) / T; return { E: (u) => a * Math.sin(b * u) + d }; }
    return null;
  });
  O("geoesp", (c) => {
    const t = c.txt; let m;
    if ((m = mt(c, new RegExp(`On coupe un cube d'arête ${NB} cm par le plan qui passe par les milieux de six de ses arêtes`)))) { const s0 = m[0] / Math.SQRT2; return ((3 * Math.sqrt(3)) / 2) * s0 * s0; }
    if ((m = mt(c, new RegExp(`Un cube a des arêtes de ${NB} cm\\. Calcule la longueur de sa grande diagonale`)))) return m[0] * Math.sqrt(3);
    if ((m = mt(c, new RegExp(`base carrée de côté ${NB} cm et une hauteur de ${NB} cm\\. Calcule l'angle entre une face latérale et la base`)))) return deg(Math.atan(m[1] / (m[0] / 2)));
    if ((m = mt(c, new RegExp(`réduites par le coefficient ${NB}\\. Une arête fuyante mesure ${NB} cm en réalité`)))) return m[0] * m[1];
    return null;
  });
  O("statdesc", (c) => {
    const A = arr(c.raw); if (!A || !/Calcule la moyenne de la série \(avec les centres/.test(c.txt)) return null;
    const rows = A.slice(1).map((r) => { const iv = /\[\s*(-?[\d{},]+)\s*\\?,?;\\?,?\s*(-?[\d{},]+)\s*\[/.exec(r[0]); return iv ? [(val(iv[1]) + val(iv[2])) / 2, val(r[1])] : null; }); if (rows.some((r) => !r)) return null;
    return rows.reduce((s, [x, n]) => s + x * n, 0) / rows.reduce((s, [, n]) => s + n, 0);
  });
  O("condbayes bayes", (c) => {
    const t = c.txt, raw = c.raw.replace(/\\,/g, ""); let m;
    if ((m = mt(c, new RegExp(`Une boîte contient ${NB} \\S+ \\S+ et ${NB} \\S+ \\S+\\. On en tire deux successivement, sans remise\\. Quelle est la probabilité d'obtenir deux couleurs différentes`)))) { const [a, b] = m, n = a + b; return (2 * a * b) / (n * (n - 1)); }
    if ((m = /\\\(P\(([A-Z])\) = ([\d{},]+)\\\)\. [^.]*avec \\\(P_\{?\1\}?\(([A-Z])\) = ([\d{},]+)\\\) et \\\(P_\{\\overline\{\1\}\}\(\3\) = ([\d{},]+)\\\)\. Calcule \\\(([^\\]*(?:\\overline\{[A-Z]\}[^\\]*)?)\\\)/.exec(raw))) {
      const [, A, a0, B, g1s, g0s, q] = m, a = val(a0), g1 = val(g1s), g0 = val(g0s), PB = a * g1 + (1 - a) * g0, n = (s) => s.replace(/\s+/g, "");
      const Q = n(q); if (Q === n(`P(\\overline{${A}}\\cap${B})`)) return (1 - a) * g0; if (Q === n(`P(${A}\\cap${B})`)) return a * g1; if (Q === n(`P(${B})`)) return PB; if (Q === n(`P_{${B}}(${A})`) || Q === n(`P_${B}(${A})`)) return (a * g1) / PB; return null;
    }
    return null;
  });

  for (const o of LIST.reverse()) G.unshift(o);
  LIST.length = 0;
  R.IDS34 = IDS; R._34 = { O, judge, fn, val, defs, segs, snap, d1, d2, zeros, zsc, extrema, lim, limInf, integ, opt, lin, cramer, dot, nrm, sub, add, mul, cross, deg, rad, mats, vecs, cases, param, pt, plane, planes, near, nn, NB, has, m1, mt, after, fOf, lastFn, fin, det2, det3, LIST };
})();
