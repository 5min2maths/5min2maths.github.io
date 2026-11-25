/* Recalcul indépendant (26.11, garde-fou demandé après la canette « hauteur minimale » acceptée à 9,6 au lieu de 9,7).
   Chaque « oracle » relit les nombres de l'énoncé (le texte que l'élève voit, pas les variables du générateur), refait le
   calcul par une autre voie, puis compare à la réponse attendue (q.spec) et au corrigé (q.sol).
   RECALC.check(item) → null (énoncé non reconnu) ou { ok, msg, rule } ; item = { id, code, raw, txt, sol, spec } (VRAI.items).
   Deux familles :
   - oracles génériques sur le TeX : « Calcule : … » (évaluation de l'expression), « Résous : … » (racines cherchées
     numériquement, toutes, sur [-200 ; 200]), « Résous le système » (Cramer), « Développe / Factorise » (équivalence) ;
   - règles de texte (énoncés à contexte) : un gabarit par forme, # = un nombre lu dans l'énoncé.
   L'arrondi demandé (« au dixième », « au mm supérieur », « minimal »…) est lu dans le texte et appliqué au recalcul. */
const RECALC = (() => {
  const NUM = "([−-]?\\d+(?:'\\d{3})*(?:,\\d+)?)";
  const num = (s) => +String(s).replace(/'/g, "").replace(",", ".").replace("−", "-");
  const PI = Math.PI, rad = (d) => (d * PI) / 180, deg = (r) => (r * 180) / PI;
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a)), lcm = (a, b) => Math.abs(a * b) / gcd(a, b);

  /* ---------- TeX → expression lisible par Expr ---------- */
  function args(s, i, n) { /* lit n groupes {…} à partir de s[i] ; rend [groupes, fin] */
    const out = [];
    for (let k = 0; k < n; k++) {
      while (s[i] === " ") i++;
      if (s[i] !== "{") { /* argument d'un seul caractère : \frac12 */ out.push(s[i]); i++; continue; }
      let d = 0, j = i;
      for (; j < s.length; j++) { if (s[j] === "{") d++; else if (s[j] === "}" && --d === 0) break; }
      out.push(s.slice(i + 1, j)); i = j + 1;
    }
    return [out, i];
  }
  function macro(s, name, n, f) {
    const key = "\\" + name;
    for (let i = s.indexOf(key); i >= 0; i = s.indexOf(key)) {
      if (/[a-zA-Z]/.test(s[i + key.length] || "")) { const j = s.indexOf(key, i + 1); if (j < 0) break; s = s.slice(0, i) + "\u0001" + s.slice(i + 1); continue; }
      const [a, e] = args(s, i + key.length, n);
      s = s.slice(0, i) + f(...a.map(tex2e)) + s.slice(e);
    }
    return s.replace(/\u0001/g, "\\");
  }
  function tex2e(t) {
    let s = String(t)
      .replace(/\\left|\\right|\\big|\\Big/g, "").replace(/\\[,;:!]|\\ |~|\\quad|\\qquad/g, " ")
      .replace(/\{,\}/g, ".").replace(/\\text\{'\}|\{'\}|\\'|'/g, "")
      .replace(/\\(?:text|mathrm|textrm)\{\s*[a-zA-Zµ²³°%]*\s*(?:\^?\{?\d\}?)?\}/g, "")
      .replace(/\\(?:cdot|times)/g, "*").replace(/\\div/g, "/").replace(/\\pi\b/g, "π")
      .replace(/\\(?:d|t)frac/g, "\\frac").replace(/\\sqrt\s*\[3\]/g, "\\cbrt").replace(/\\(sin|cos|tan|ln|log|exp)\b/g, "$1")
      .replace(/\\mathrm\{e\}/g, "e");
    s = macro(s, "frac", 2, (a, b) => "((" + a + ")/(" + b + "))");
    s = macro(s, "cbrt", 1, (a) => "cbrt(" + a + ")");
    s = macro(s, "sqrt", 1, (a) => "sqrt(" + a + ")");
    s = s.replace(/\^\s*\{/g, "^(").replace(/[{]/g, "(").replace(/[}]/g, ")").replace(/\\%/g, "/100");
    return s;
  }
  const math = (raw) => (String(raw).match(/\\\(([\s\S]*?)\\\)/g) || []).map((m) => m.slice(2, -2));
  /* arbre Expr → fonction JS rapide (env = { x: … }) */
  function compile(n) {
    const c = (n) => {
      switch (n.t) {
        case "num": return "(" + n.v + ")";
        case "const": return n.v === "e" ? "Math.E" : "Math.PI";
        case "var": return "e." + n.v;
        case "par": return c(n.a);
        case "neg": return "(-" + c(n.a) + ")";
        case "add": return "(" + c(n.a) + "+" + c(n.b) + ")";
        case "sub": return "(" + c(n.a) + "-" + c(n.b) + ")";
        case "mul": return "(" + c(n.a) + "*" + c(n.b) + ")";
        case "div": return "(" + c(n.a) + "/" + c(n.b) + ")";
        case "pow": return "Math.pow(" + c(n.a) + "," + c(n.b) + ")";
        case "fn": return ({ sqrt: "Math.sqrt", cbrt: "Math.cbrt", ln: "Math.log", log: "Math.log10", sin: "Math.sin", cos: "Math.cos", tan: "Math.tan", exp: "Math.exp" })[n.f] + "(" + c(n.a) + ")";
        default: throw new Error("nœud " + n.t);
      }
    };
    return new Function("e", "return " + c(n));
  }
  const ev = (t) => { const tr = Expr.parse(tex2e(t)); if (Expr.vars(tr).size) throw new Error("lettre"); return Expr.evaluate(tr); };

  /* ---------- arrondi demandé dans le texte ---------- */
  function rounding(ask) {
    let st = null, dir = 0, m;
    if (/au dixième/i.test(ask)) st = 0.1; else if (/au centième/i.test(ask)) st = 0.01; else if (/au millième/i.test(ask)) st = 0.001;
    else if ((m = new RegExp("à " + NUM + " ?[a-zA-Z/²³]* près").exec(ask))) st = num(m[1]);
    else if (/à l'unité|à l'entier|au (franc|centime|degré|cm³|cm²|m²|m³|mètre|kilomètre|litre|km|m|cm|mm|L) près|arrondie? au (franc|degré|mètre|centimètre|kilo|gramme|litre)\b|(entier|unité) (supérieur|inférieur)/i.test(ask)) st = 1;
    if (/supérieur|par excès|minimal|au minimum|au moins|faut-il prévoir|faut-il acheter/i.test(ask)) dir = 1;
    else if (/inférieur|par défaut|maximal|au maximum|au plus/i.test(ask)) dir = -1;
    return { st, dir };
  }
  const roundTo = (v, st, dir) => {
    const k = +(v / st).toFixed(8), e = 1e-9; /* 5,225 / 0,01 = 522,4999… en binaire : arrondi commercial sur la valeur décimale */
    const r = dir > 0 ? Math.ceil(k - e) : dir < 0 ? Math.floor(k + e) : Math.round(k);
    return +(r * st).toFixed(10);
  };
  const fmt = (v) => { if (Math.abs(v) < 1e-12) return "0"; let s = (+v.toPrecision(14)).toFixed(Math.max(0, 14 - Math.floor(Math.log10(Math.abs(v))))); if (s.includes(".")) s = s.replace(/0+$/, "").replace(/\.$/, ""); return s; };
  const bare = (sp) => ({ kind: "value", value: sp.value, round: sp.round });

  /* ---------- le corrigé contient-il la valeur finale ? ---------- */
  function solHas(sol, v, st, rawSol) {
    const s = String(sol).replace(/(\d)'(?=\d{3})/g, "$1").replace(/(\d) (?=\d{3}\b)/g, "$1");
    const C = [];
    let m;
    const RE = /(-|−)?\d+(?:,\d+)?(?:\s*·\s*10\^\(?(-?\d+)\)?)?/g;
    while ((m = RE.exec(s))) { const t = m[0].replace(/\s/g, ""); const [a, e] = t.split("·10^"); let c = num(a); if (e !== undefined) c *= 10 ** num(e.replace(/[()]/g, "")); C.push([c, (a.split(",")[1] || "").length, e !== undefined]); }
    const RF = /\((-?\d+)\)\/\((\d+)\)/g; while ((m = RF.exec(s))) C.push([num(m[1]) / num(m[2]), 12, true]);
    const RP = /(\d+(?:,\d+)?)?\s*π/g; while ((m = RP.exec(s))) C.push([(m[1] ? num(m[1]) : 1) * PI, 12, true]);
    const RFP = /\((\d+)\)\/\((\d+)\)\s*π/g; while ((m = RFP.exec(s))) C.push([(num(m[1]) / num(m[2])) * PI, 12, true]);
    const RR = /(\d+)?\s*√\(?(\d+)\)?(?:\s*\/\s*\(?(\d+)\)?)?/g; while ((m = RR.exec(s))) C.push([((m[1] ? num(m[1]) : 1) * Math.sqrt(num(m[2]))) / (m[3] ? num(m[3]) : 1), 12, true]);
    const RRF = /\((\d*)\s*√\((\d+)\)\)\/\((\d+)\)/g; while ((m = RRF.exec(s))) C.push([((m[1] ? num(m[1]) : 1) * Math.sqrt(num(m[2]))) / num(m[3]), 12, true]);
    for (const seg of math(rawSol || "")) for (const piece of seg.split(/=|\\approx|\\simeq|\\;|\\quad|\\text\{ ou \}|\\text\{ et \}|\\text\{ou\}|\\iff|\\Leftrightarrow|\\Rightarrow|,\s|;/)) {
      if (!/\d/.test(piece) || piece.length > 80) continue;
      try { const c = ev(piece); if (isFinite(c)) C.push([c, 12, true]); } catch (e) {}
    }
    for (const [c, d, exact] of C) {
      for (const w of [v, -v]) {
        if (exact && Math.abs(c - w) <= 1e-6 * Math.max(1, Math.abs(w))) return true;
        if (st && Math.abs(c - w) <= st / 2 + 1e-9) return true;
        if (Math.abs(c - w) <= Math.max(0.5 * 10 ** -d + 1e-9, 1e-9 * Math.abs(w)) && Math.abs(c - w) <= 0.006 * Math.max(Math.abs(w), 1e-9) + 1e-12) return true;
      }
    }
    return false;
  }

  /* ---------- comparaison d'une valeur recalculée à la réponse attendue ---------- */
  function cmpValue(item, sp, res, ask) {
    if (!sp || sp.kind !== "value") return "réponse attendue de type " + (sp && sp.kind) + " (valeur recalculée " + fmt(res.v) + ")";
    if (!isFinite(res.v)) return "recalcul impossible (" + res.v + ")";
    const R0 = rounding(ask), st = res.st !== undefined ? res.st : R0.st, dir = res.dir !== undefined ? res.dir : R0.dir;
    const S = bare(sp), ok = (x) => checkAnswer(S, fmt(x)).status === "correct";
    if (st) {
      const r = roundTo(res.v, st, dir);
      if (!ok(r)) return "attendu " + fmt(sp.value) + (sp.round ? " (±" + sp.round / 2 + ")" : "") + ", recalcul " + fmt(res.v) + " → " + fmt(r) + (dir ? (dir > 0 ? " (arrondi vers le haut)" : " (arrondi vers le bas)") : "");
      if (dir && ok(roundTo(res.v, st, -dir)) && Math.abs(roundTo(res.v, st, -dir) - r) > 1e-9) return "arrondi dans le mauvais sens aussi accepté : " + fmt(roundTo(res.v, st, -dir)) + " (attendu " + fmt(r) + ")";
      if (!dir && (ok(r + st) || ok(r - st))) return "tolérance trop large : " + fmt(r + st) + " ou " + fmt(r - st) + " accepté";
      if (res.sol !== false && !solHas(item.sol, r, st, item.rawSol) && !solHas(item.sol, res.v, st, item.rawSol)) return "corrigé sans la valeur finale " + fmt(r);
    } else {
      if (sp.round ? !ok(res.v) : !Expr.sameValue(sp.value, res.v, 1e-7)) return "attendu " + fmt(sp.value) + (sp.round ? " (±" + sp.round / 2 + ")" : "") + ", recalcul " + fmt(res.v);
      if (res.sol !== false && !solHas(item.sol, res.v, sp.round, item.rawSol)) return "corrigé sans la valeur finale " + fmt(res.v);
    }
    return null;
  }
  const sameSet = (a, b) => a.length === b.length && a.every((u) => b.some((w) => Math.abs(u - w) <= 1e-6 * Math.max(1, Math.abs(w)))) && b.every((w) => a.some((u) => Math.abs(u - w) <= 1e-6 * Math.max(1, Math.abs(w))));

  /* ---------- racines réelles de f (toutes, sur [-L ; L]) ----------
     f(x) rend [A, B] (membres de gauche et de droite) : racine = changement de signe de A − B (pas un pôle), ou minimum
     local isolé de |A − B| (racine double) ; « isolé » écarte les queues plates des exponentielles (2^x ≈ 3^x vers −∞). */
  function roots(f, L = 200) {
    const out = [], h = 0.01, N = Math.round((2 * L) / h);
    const same = (x) => { const [a, b] = f(x); return isFinite(a) && isFinite(b) && Math.abs(a - b) <= 1e-9 * (1 + Math.abs(a) + Math.abs(b)); };
    if ([-7.31, -2.17, 0.43, 1.91, 3.77, 6.13, 11.3].every(same)) return null; /* identité : tous les nombres */
    const D = (x) => { const [a, b] = f(x); const y = a - b; return isFinite(y) ? y : NaN; };
    const small = (x) => { const [a, b] = f(x); return isFinite(a) && isFinite(b) && Math.abs(a - b) <= 1e-7 * (Math.abs(a) + Math.abs(b)) + 1e-12; };
    const add = (r) => { if (!out.some((u) => Math.abs(u - r) < 1e-5 * Math.max(1, Math.abs(r)))) out.push(r); };
    let x0 = -L, y0 = D(x0), yPrev = NaN;
    for (let i = 1; i <= N; i++) {
      const x1 = -L + i * h, y1 = D(x1);
      if (y0 === 0) { if (Math.max(Math.abs(yPrev) || 0, Math.abs(y1) || 0) > 1e-200) add(x0); } /* zéro entouré de quasi-zéros = sous-dépassement (queues d'exponentielles) */
      else if (isFinite(y0) && isFinite(y1) && y0 * y1 < 0) {
        let a = x0, b = x1, fa = y0;
        for (let k = 0; k < 80; k++) { const m = (a + b) / 2, fm = D(m); if (!isFinite(fm)) break; if (fa * fm <= 0) b = m; else { a = m; fa = fm; } }
        const r = (a + b) / 2, [A, B] = f(r);
        if (isFinite(A) && isFinite(B) && Math.abs(A - B) <= 1e-6 * (1 + Math.abs(A) + Math.abs(B))) add(+r.toFixed(9)); /* sinon : pôle */
      } else if (isFinite(yPrev) && isFinite(y0) && isFinite(y1) && Math.abs(y0) < Math.abs(yPrev) && Math.abs(y0) < Math.abs(y1)) {
        let a = x0 - h, b = x1;
        for (let k = 0; k < 100; k++) { const m1 = a + (b - a) / 3, m2 = b - (b - a) / 3; if (Math.abs(D(m1)) < Math.abs(D(m2))) b = m2; else a = m1; }
        const r = (a + b) / 2, yr = Math.abs(D(r)), ya = Math.abs(D(r - 0.05)), yb = Math.abs(D(r + 0.05));
        if (small(r) && ya > 1e4 * yr && yb > 1e4 * yr && ya > 1e-9 && yb > 1e-9) add(+r.toFixed(7));
      }
      yPrev = y0; x0 = x1; y0 = y1;
    }
    return out.sort((a, b) => a - b);
  }
  function eqFun(eq, v = "x") {
    const parts = tex2e(eq).split("=");
    if (parts.length !== 2) return null;
    const A = Expr.parse(parts[0]), B = Expr.parse(parts[1]);
    const vs = new Set([...Expr.vars(A), ...Expr.vars(B)]);
    if (vs.size !== 1 || !vs.has(v)) return null;
    const fa = compile(A), fb = compile(B);
    return (x) => [fa({ x }), fb({ x })];
  }


  /* ---------- réponse exacte stockée arrondie (r6 & co.) ----------
     Une valeur sans tolérance qui est l'arrondi à 5–8 décimales d'une fraction p/q (q ≤ 30) non décimale, ou de
     (p/q)·π, (p/q)·√n : l'élève qui tape la valeur exacte (1/3, π/4, √3/2) est refusé (« très proche »). */
  const SQF = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19, 21, 22, 23, 26, 29, 30];
  function truncated(v) {
    if (typeof v !== "number" || !isFinite(v) || Number.isInteger(v)) return null;
    const t = String(+v.toFixed(12)), k = t.includes(".") ? t.split(".")[1].length : 0;
    if (k < 5 || k > 8) return null;
    const tol = 0.5 * 10 ** -k + 1e-12, near = (x) => Math.abs(x - v) <= tol && !Expr.sameValue(x, v);
    const term = (q) => { while (q % 2 === 0) q /= 2; while (q % 5 === 0) q /= 5; return q === 1; };
    for (let q = 3; q <= 30; q++) { if (term(q)) continue; const p = Math.round(v * q); if (gcd(p, q) === 1 && near(p / q)) return p + "/" + q; }
    if (k >= 6) for (let q = 1; q <= 12; q++) { const p = Math.round((v * q) / PI); if (p && near((p * PI) / q)) return p + "π/" + q; for (const n of SQF) { const p2 = Math.round((v * q) / Math.sqrt(n)); if (p2 && near((p2 * Math.sqrt(n)) / q)) return p2 + "√" + n + "/" + q; } }
    return null;
  }
  function truncSpec(sp) {
    if (!sp || sp.round) return null;
    if (sp.kind === "value") { const t = truncated(sp.value); return t && "valeur exacte arrondie : " + fmt(sp.value) + " au lieu de " + t + " (la réponse exacte serait refusée)"; }
    if (sp.kind === "set" || sp.kind === "pair") for (const v of sp.values || []) { const t = truncated(v); if (t) return "valeur exacte arrondie : " + fmt(v) + " au lieu de " + t; }
    if (sp.kind === "expr" && /\d\.\d{5,}/.test(sp.expr)) return "coefficient arrondi dans la réponse attendue : " + sp.expr;
    return null;
  }

  /* ---------- oracles génériques (TeX) ---------- */
  const G = [];
  /* « Calcule : expr » et variantes : la valeur de l'expression affichée */
  G.push({ name: "calcul TeX", f(x) {
    const q = x.raw.replace(/<br\s*\/?>/g, " ").trim();
    let m = /^(?:Calcule|Effectue|Évalue|Donne la valeur de)(?: et donne le résultat [^:]*| et simplifie| sans calculatrice| astucieusement| mentalement| la valeur exacte(?: de)?)?\s*:?\s*\\\(([\s\S]+?)\\\)(?: avec une identité remarquable| sans calculatrice)?\s*\.?\s*(\((?:fraction|fraction acceptée|valeur exacte|nombre décimal|en fraction)[^)]*\))?\s*\.?$/.exec(q);
    if (!m) m = /^Écris (?:en notation scientifique|en nombre décimal|sous forme décimale)\s*:\s*\\\(([\s\S]+?)\\\)\s*\.?$/.exec(q) || /^Écris \\\(([\s\S]+?)\\\) (?:en notation scientifique|en nombre décimal|sous forme décimale)\s*\.?$/.exec(q);
    if (!m) return null;
    const e = m[1];
    if (/\\square|\\ldots|=|[a-zA-Z]\s*\(|\\[a-zA-Z]*(?:vec|binom|log|ln|sin|cos|tan)/.test(e.replace(/\\frac|\\cdot|\\times|\\sqrt|\\left|\\right|\\div|\\text\{'\}|\\pi|\\,/g, ""))) return null;
    let v; try { v = ev(e); } catch (er) { return null; }
    return { v };
  } });
  /* « Complète : a^m · a^n = a^□. Quel est l'exposant ? » */
  G.push({ name: "exposant", f(x) {
    if (!/Quel est l'exposant|donne le bon exposant/.test(x.raw)) return null;
    const M = math(x.raw).find((t) => /\\square|=/.test(t)); if (!M) return null;
    const [L, Rr] = M.split("=");
    if (!/\\square/.test(Rr || "")) return null;
    const b = /^\s*\(?\s*(-?[\d{},]+)\s*\)?\s*\^/.exec(Rr); if (!b) return null;
    let v; try { v = ev(L); } catch (e) { return null; }
    const B = ev(b[1]); return { v: Math.log(Math.abs(v)) / Math.log(Math.abs(B)) };
  } });
  /* « Soit f(x) = … » : image, préimages, zéros, ordonnée à l'origine */
  G.push({ name: "fonction", f(x) {
    const m = /^Soit \\\(f\(x\) = ([\s\S]+?)\\\)\.? ?([\s\S]*)$/.exec(x.raw); if (!m) return null;
    let F; try { F = Expr.parse(tex2e(m[1])); } catch (e) { return null; }
    if ([...Expr.vars(F)].some((v) => v !== "x")) return null;
    const f = compile(F), rest = m[2];
    let a;
    if (/ordonnée à l'origine/.test(rest) && x.spec.kind === "value") return { v: f({ x: 0 }) };
    if ((a = /(?:Calcule|donne|Que vaut) \\\(f\(([^)]+)\)\\\)/.exec(rest)) && x.spec.kind === "value") { let t; try { t = ev(a[1]); } catch (e) { return null; } return { v: f({ x: t }) }; }
    if ((a = /Détermine (?:la|les) préimages? de \\\(([^\\]+)\\\)/.exec(rest))) { let k; try { k = ev(a[1]); } catch (e) { return null; } const g = (t) => [f({ x: t }), k], rs = roots(g); return rs ? { set: rs, f: g } : null; }
    if (/Détermine les zéros de/.test(rest)) { const g = (t) => [f({ x: t }), 0], rs = roots(g); return rs ? { set: rs, f: g } : null; }
    return null;
  } });
  /* « Calcule E pour x = 2 (et y = …) » ; « Utilise la formule A = … pour L = … » */
  G.push({ name: "substitution", f(x) {
    if (!/^(Calcule|Utilise la formule|L'aire|L'aire totale|Le périmètre|Évalue)/.test(x.raw) || !/ pour /.test(x.raw) || x.spec.kind !== "value") return null;
    const S = math(x.raw), env = {}; let E = null;
    for (const t of S) {
      const a = /^\s*([a-zA-Z])\s*=\s*([^=]+)$/.exec(t);
      if (a) { let v = null; try { v = ev(a[2]); } catch (e) {} if (v !== null && isFinite(v)) { env[a[1]] = v; continue; } }
      if (E === null && /[a-zA-Z]/.test(t.replace(/\\[a-zA-Z]+/g, "")) && /[-+=^]|\\cdot|\\frac|[a-zA-Z]{2}|\d[a-zA-Z]/.test(t)) E = t.includes("=") ? t.split("=").pop() : t;
    }
    if (E === null || !Object.keys(env).length) return null;
    /* les lettres sont remplacées par leur valeur dans le TeX (Expr confond L et l) */
    let sub = "", miss = false;
    for (let i = 0; i < E.length; i++) {
      if (E[i] === "\\") { let j = i + 1; while (j < E.length && /[a-zA-Z]/.test(E[j])) j++; sub += E.slice(i, j); i = j - 1; continue; }
      if (/[a-zA-Z]/.test(E[i])) { if (!(E[i] in env)) miss = true; sub += "(" + env[E[i]] + ")"; continue; }
      sub += E[i];
    }
    if (miss) return null;
    let v; try { v = ev(sub); } catch (e) { return null; }
    return { v };
  } });
  /* « Résous : équation » (une inconnue x) : toutes les racines réelles */
  G.push({ name: "équation", f(x) {
    if (!/^(Résous|[A-ZÉ][a-zéèï]+ résout)/.test(x.raw) || /par rapport à|en fonction de|dans \\\(\\mathbb|sur \\\(|\[0|intervalle|système|\\begin|\\sin|\\cos|\\tan|graphique/.test(x.raw)) return null;
    const M = math(x.raw).find((t) => /=/.test(t) && !/\\le|\\ge|<|>|\\neq/.test(t)); if (!M) return null;
    let f; try { f = eqFun(M); } catch (e) { return null; }
    if (!f) return null;
    const rs = roots(f);
    return rs ? { set: rs, f } : { set: [], all: true, f };
  } });
  /* systèmes 2 × 2 linéaires (Cramer à partir des valeurs en (0;0), (1;0), (0;1)) */
  G.push({ name: "système", f(x) {
    if (!/\\begin\{cases\}/.test(x.raw) || !x.spec || x.spec.kind !== "pair" || x.spec.values.length !== 2) return null;
    const c = /\\begin\{cases\}([\s\S]*?)\\end\{cases\}/.exec(x.raw)[1].split("\\\\");
    if (c.length !== 2) return null;
    const L = [];
    for (const eq of c) {
      const p = tex2e(eq.replace(/&/g, "")).split("="); if (p.length !== 2) return null;
      let A, B; try { A = Expr.parse(p[0]); B = Expr.parse(p[1]); } catch (e) { return null; }
      const vs = new Set([...Expr.vars(A), ...Expr.vars(B)]); if ([...vs].some((v) => v !== "x" && v !== "y")) return null;
      const g = (x, y) => Expr.evaluate(A, { x, y }) - Expr.evaluate(B, { x, y });
      const c0 = g(0, 0), a = g(1, 0) - c0, b = g(0, 1) - c0;
      if (Math.abs(g(2, 3) - (2 * a + 3 * b + c0)) > 1e-9 * (1 + Math.abs(c0))) return null; /* non linéaire */
      L.push([a, b, -c0]);
    }
    const D = L[0][0] * L[1][1] - L[0][1] * L[1][0];
    if (Math.abs(D) < 1e-12) return { pair: null };
    return { pair: [(L[0][2] * L[1][1] - L[0][1] * L[1][2]) / D, (L[0][0] * L[1][2] - L[0][2] * L[1][0]) / D] };
  } });
  /* « Résous : inéquation » (une ou deux inégalités, une inconnue) : appartenance point par point à l'ensemble attendu */
  G.push({ name: "inéquation", f(x) {
    if (!x.spec || x.spec.kind !== "solset" || !/^Résous/.test(x.raw) || /système|\\begin| sur \\\(|\\sin|\\cos|\\tan/.test(x.raw)) return null;
    const M = math(x.raw).find((t) => /\\le|\\ge|<|>/.test(t)); if (!M) return null;
    const parts = tex2e(M.replace(/\\leqslant|\\leq|\\le\b/g, "≤").replace(/\\geqslant|\\geq|\\ge\b/g, "≥")).split(/(≤|≥|<|>)/);
    if (parts.length !== 3 && parts.length !== 5) return null;
    let fs; try { fs = parts.filter((_, i) => i % 2 === 0).map((p) => Expr.parse(p)); } catch (e) { return null; }
    if (fs.some((t) => [...Expr.vars(t)].some((v) => v !== "x"))) return null;
    const F = fs.map(compile), ops = parts.filter((_, i) => i % 2 === 1);
    /* comparaison exacte, sauf aux bornes (bruit de calcul : 1e-9 relatif aux termes) */
    const cmp = (a, o, b, L) => { const e = L ? 1e-9 * (1 + Math.abs(a) + Math.abs(b)) : 0; return o === "<" ? a < b - e : o === ">" ? a > b + e : o === "≤" ? a <= b + e : a >= b - e; };
    const truth = (t, L) => { const v = F.map((f) => f({ x: t })); if (v.some((u) => !isFinite(u))) return false; return ops.every((o, i) => cmp(v[i], o, v[i + 1], L)); };
    const bnd = []; for (let i = 0; i + 1 < F.length; i++) { const r = roots((t) => [F[i]({ x: t }), F[i + 1]({ x: t })], 100); if (r) bnd.push(...r); }
    return { ineq: truth, pts: bnd };
  } });
  /* « Donne f'(x) pour f(x) = … » : dérivée numérique comparée à la réponse attendue */
  G.push({ name: "dérivée", f(x) {
    if (!x.spec || x.spec.kind !== "expr") return null;
    const m = /f'\(x\)\\\) (?:pour|si|de) \\\(f\(x\) = ([\s\S]+?)\\\)/.exec(x.raw) || /[Dd]érive \\\(f\(x\) = ([\s\S]+?)\\\)/.exec(x.raw);
    if (!m) return null;
    let F; try { F = Expr.parse(tex2e(m[1])); } catch (e) { return null; }
    if ([...Expr.vars(F)].some((v) => v !== "x")) return null;
    return { deriv: compile(F) };
  } });
  /* systèmes 3 × 3 linéaires */
  G.push({ name: "système 3×3", f(x) {
    if (!/\\begin\{cases\}/.test(x.raw) || !x.spec || x.spec.kind !== "pair" || x.spec.values.length !== 3) return null;
    const c = /\\begin\{cases\}([\s\S]*?)\\end\{cases\}/.exec(x.raw)[1].split("\\\\"); if (c.length !== 3) return null;
    const L = [];
    for (const eq of c) {
      const p = tex2e(eq.replace(/&/g, "")).split("="); if (p.length !== 2) return null;
      let A, B; try { A = Expr.parse(p[0]); B = Expr.parse(p[1]); } catch (e) { return null; }
      if ([...new Set([...Expr.vars(A), ...Expr.vars(B)])].some((v) => !"xyz".includes(v))) return null;
      const g = (x, y, z) => Expr.evaluate(A, { x, y, z }) - Expr.evaluate(B, { x, y, z }), c0 = g(0, 0, 0);
      const r = [g(1, 0, 0) - c0, g(0, 1, 0) - c0, g(0, 0, 1) - c0, -c0];
      if (Math.abs(g(2, 3, 5) - (2 * r[0] + 3 * r[1] + 5 * r[2] + c0)) > 1e-9 * (1 + Math.abs(c0))) return null;
      L.push(r);
    }
    const det = (m) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
    const A = L.map((r) => r.slice(0, 3)), D = det(A); if (Math.abs(D) < 1e-12) return { pair: null };
    return { pair: [0, 1, 2].map((j) => det(A.map((r, i) => r.map((v, k) => (k === j ? L[i][3] : v)))) / D) };
  } });
  /* « Développe / Factorise / Réduis : expr » : la réponse attendue est égale à l'expression affichée */
  G.push({ name: "équivalence", f(x) {
    if (!x.spec || x.spec.kind !== "expr" || !/^(Développe|Factorise|Réduis|Simplifie|Supprime les parenthèses)/.test(x.raw)) return null;
    const M = math(x.raw).filter((t) => !/=|\\mathbb/.test(t)); if (M.length !== 1) return null;
    let A; try { A = Expr.parse(tex2e(M[0])); } catch (e) { return null; }
    return { expr: A };
  } });

  /* ---------- règles de texte ---------- */
  const RULES = [];
  /* gabarit : texte littéral ; # = nombre ; … = n'importe quoi (court) ; § = un mot ou groupe de mots */
  const pat = (s) => new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/#/g, NUM).replace(/…/g, "[^]*?").replace(/§/g, "[^.?!;:]*?"), "i");
  function T(ids, p, f, o = {}) { RULES.push({ ids: ids && new Set(ids.split(" ")), re: typeof p === "string" ? pat(p) : p, f, o }); }
  const H = (h, mi) => h + (mi || 0) / 60;

  /* --- pourcentages --- */
  T(null, "Calcule # % de #", (p, a) => (p * a) / 100);
  T(null, "contient # % de matières grasses. Combien de grammes … dans # g", (p, a) => (p * a) / 100);
  T(null, "compte # élèves ; # % d'entre eux", (a, p) => (a * p) / 100);
  T(null, "coûte # CHF. Son prix baisse de # %. Quel est le nouveau prix", (a, p) => a * (1 - p / 100));
  T(null, "coûte # CHF. Son prix augmente de # %. Quel est le nouveau prix", (a, p) => a * (1 + p / 100));
  T(null, /(?:coûte|de|à) ([\d']+(?:,\d+)?) CHF ?;? (?:son |le )?(?:prix |montant )?augmente de ([\d,]+) ?%\. (?:Nouveau|Quel)/i, (a, p) => a * (1 + p / 100));
  T(null, /(?:de|à) ([\d']+(?:,\d+)?) CHF (?:baisse|diminue) de ([\d,]+) ?%\. (?:Nouveau|Quel)/i, (a, p) => a * (1 - p / 100));
  T(null, "coûte # CHF. Les étudiants ont # % de réduction", (a, p) => a * (1 - p / 100));
  T(null, /à ([\d']+(?:,\d+)?) CHF (?:est en promotion de|bénéficie d'une réduction de|est soldée? de) ([\d,]+) ?%/i, (a, p) => a * (1 - p / 100));
  T(null, /Après une (?:hausse|augmentation) de ([\d,]+) ?%, (?:un prix vaut|un article coûte|il y en a) ([\d']+(?:,\d+)?)/i, (p, a) => a / (1 + p / 100));
  T(null, /Après une (?:baisse|diminution|réduction) de ([\d,]+) ?%, (?:un prix vaut|un article coûte) ([\d']+(?:,\d+)?)/i, (p, a) => a / (1 - p / 100));
  T(null, "a augmenté de # % ; il y en a maintenant #", (p, a) => a / (1 + p / 100));
  T(null, /(?:remise|acompte|réduction) de ([\d']+(?:,\d+)?) CHF (?:correspond à|représente) ([\d,]+) ?%/i, (a, p) => (a * 100) / p);
  T(null, /passe de ([\d']+(?:,\d+)?) à ([\d']+(?:,\d+)?)\. Quel est le pourcentage de variation/i, (a, b) => ((b - a) / a) * 100);
  T(null, /de ([\d']+(?:,\d+)?) CHF augmente de ([\d,]+) ?%, puis baisse de ([\d,]+) ?%/i, (a, p, q) => a * (1 + p / 100) * (1 - q / 100));
  T(null, "Un prix augmente de # %, puis baisse de # %. Quelle est la variation globale", (p, q) => ((1 + p / 100) * (1 - q / 100) - 1) * 100);
  T(null, "Un prix baisse de # %, puis augmente de # %. Quelle est la variation globale", (p, q) => ((1 - p / 100) * (1 + q / 100) - 1) * 100);
  T(null, "Augmenter une quantité de # % revient à la multiplier par", (p) => 1 + p / 100);
  T(null, "Diminuer une quantité de # % revient à la multiplier par", (p) => 1 - p / 100);
  T(null, "la TVA normale est de # %. Un appareil coûte # CHF TVA comprise. Quel est le montant de la TVA", (t, a) => a - a / (1 + t / 100));
  T(null, "la TVA normale est de # %. Un appareil coûte # CHF TVA comprise. Quel est son prix hors taxe", (t, a) => a / (1 + t / 100));

  /* --- proportionnalité --- */
  T(null, /^([\d,]+) cahiers coûtent ([\d',]+) CHF\. Combien coûtent ([\d,]+) cahiers/i, (a, p, b) => (p / a) * b);
  T(null, /^([\d,]+) (?:kg de pommes|m de tissu) coûtent ([\d',]+) CHF\. Combien coûtent ([\d,]+) (?:kg|m)/i, (a, p, b) => (p / a) * b);
  T(null, "# euro vaut # CHF. Combien d'euros obtient-on pour # CHF", (u, t, a) => (a * u) / t);
  T(null, "En # h, une machine fabrique # pièces. Combien en fabrique-t-elle en # h", (h, n, k) => (n / h) * k);
  T(null, "Pour # personnes, une recette demande # g de farine. Combien en faut-il pour # personnes", (n, g, k) => (g / n) * k);
  T(null, "Un robinet remplit # L en # minutes. En combien de minutes remplit-il # L", (l, t, k) => (k * t) / l);
  T(null, /imprime ([\d,]+) pages en ([\d,]+) minutes?\. Combien de pages imprime-t-elle en ([\d,]+) minutes/i, (n, t, k) => (n / t) * k);
  T(null, "consomme # L pour # km. Combien consomme-t-elle pour # km", (l, d, k) => (l / d) * k);

  /* --- vitesses --- */
  T(null, /parcourt ([\d',]+) km en ([\d,]+) h\. Quelle est sa vitesse moyenne/i, (d, t) => d / t);
  T(null, /parcourt ([\d',]+) km en ([\d,]+) h ([\d,]+) min\. Quelle est sa vitesse moyenne en km\/h/i, (d, h, m) => d / H(h, m));
  T(null, /parcourt ([\d',]+) km en ([\d,]+) min\. Quelle est sa vitesse moyenne en km\/h/i, (d, m) => d / H(0, m));
  T(null, /Sans calculatrice : [^.]* parcourt ([\d',]+) km en ([\d,]+) h ([\d,]+) min\. Donne un ordre de grandeur de sa vitesse moyenne \(à ([\d,]+) km\/h près\)/i, (d, h, m, p) => ({ v: d / H(h, m), st: undefined, sol: false }));
  T(null, /on entend le tonnerre ([\d,]+) s après[^.]*\. Le son va à ([\d,]+) m\/s/i, (t, v) => t * v);
  T(null, /compte ([\d,]+) secondes entre l'éclair et le tonnerre\. Le son va à ([\d,]+) m\/s[^?]*\(en (k?)m\)/i, (t, v, k) => (t * v) / (k ? 1000 : 1), { raw: true });
  T(null, /roule à ([\d,]+) km\/h\. Combien d'heures lui faut-il pour parcourir ([\d',]+) km/i, (v, d) => d / v);
  T(null, /roule à ([\d,]+) km\/h\. Combien de minutes lui faut-il pour parcourir ([\d',]+) km/i, (v, d) => (d / v) * 60);
  T(null, /vole à ([\d',]+) km\/h\. Combien d'heures dure un vol de ([\d',]+) km/i, (v, d) => d / v);
  T(null, /(?:file|roule) à ([\d,]+) km\/h pendant ([\d,]+) h ([\d,]+) min\. Quelle distance/i, (v, h, m) => v * H(h, m));
  T(null, /roule à ([\d,]+) km\/h pendant ([\d,]+) h ?\. Quelle distance/i, (v, h) => v * h);
  T(null, /vole à ([\d,]+) m\/s pendant ([\d,]+) s ?\. Quelle distance/i, (v, t) => v * t);
  T(null, /parcourt ([\d',]+) m en ([\d,]+) s\. Quelle est sa vitesse moyenne \(en m\/s\)/i, (d, t) => d / t);
  T(null, /avance à ([\d,]+) mm\/s\. Quelle distance parcourt-[a-z]+ en une heure \(en m\)/i, (v) => (v * 3600) / 1000);
  T(null, /avance de ([\d,]+) cm par jour\. De combien de mètres avance-t-il en ([\d']+) jours/i, (c, j) => (c * j) / 100);
  T(null, /record du ([\d']+) m en ([\d,]+) s\. Quelle a été sa vitesse moyenne en km\/h/i, (d, t) => (d / t) * 3.6);
  T(null, /record du ([\d']+) m en ([\d,]+) min ([\d,]+) s\. Quelle a été sa vitesse moyenne en km\/h/i, (d, m, s) => (d / (60 * m + s)) * 3.6);
  T(null, /fait un aller de ([\d',]+) km à ([\d,]+) km\/h et le retour à ([\d,]+) km\/h/i, (d, a, b) => (2 * d) / (d / a + d / b));
  T(null, /roule ([\d,]+) min à ([\d,]+) km\/h, puis ([\d,]+) h ([\d,]+) min à ([\d,]+) km\/h/i, (m1, v1, h2, m2, v2) => (v1 * H(0, m1) + v2 * H(h2, m2)) / (H(0, m1) + H(h2, m2)));
  T(null, /roule ([\d,]+) min à ([\d,]+) km\/h, puis ([\d,]+) min à ([\d,]+) km\/h/i, (m1, v1, m2, v2) => (v1 * m1 + v2 * m2) / (m1 + m2));
  T(null, /parcourt ([\d',]+) km en ([\d,]+) h ([\d,]+) min\. [^«]*«[^»]*»\. Trouve l'erreur, puis donne la bonne vitesse/i, (d, h, m) => d / H(h, m));

  /* --- volumes, aires --- */
  T(null, /volume d'un pavé droit de ([\d,]+) cm × ([\d,]+) cm × ([\d,]+) cm/i, (a, b, c) => a * b * c);
  T(null, /(?:la forme d'un pavé de|mesure) ([\d,]+) cm × ([\d,]+) cm × ([\d,]+) cm\. Combien de litres/i, (a, b, c) => (a * b * c) / 1000);
  T(null, /volume d'un cylindre de rayon ([\d,]+) cm et de hauteur ([\d,]+) cm/i, (r, h) => PI * r * r * h);
  T(null, /aire totale d'un cylindre de rayon ([\d,]+) cm et de hauteur ([\d,]+) cm/i, (r, h) => 2 * PI * r * r + 2 * PI * r * h);
  T(null, /a un rayon intérieur de ([\d,]+) cm et une hauteur de ([\d,]+) cm\. Quelle est sa contenance, en cL/i, (r, h) => (PI * r * r * h) / 10);
  T(null, /cylindre creux : rayon extérieur ([\d,]+) cm, rayon intérieur ([\d,]+) cm, longueur ([\d,]+) cm/i, (R, r, l) => PI * (R * R - r * r) * l);
  T(null, /base un triangle rectangle de cathètes ([\d,]+) cm et ([\d,]+) cm\. Sa longueur est ([\d,]+) cm\. Calcule son aire totale/i, (a, b, l) => a * b + (a + b + Math.hypot(a, b)) * l);
  T(null, /base un triangle de base ([\d,]+) cm et de hauteur ([\d,]+) cm\. La longueur du prisme est ([\d,]+) cm\. Calcule son volume/i, (b, h, l) => (b * h * l) / 2);
  T(null, /base un trapèze de bases ([\d,]+) cm et ([\d,]+) cm, et de hauteur ([\d,]+) cm\. La profondeur du prisme est ([\d,]+) cm\. Calcule son volume/i, (a, b, h, p) => ((a + b) * h * p) / 2);
  T(null, /volume d'un cône de rayon ([\d,]+) cm et de hauteur ([\d,]+) cm/i, (r, h) => (PI * r * r * h) / 3);
  T(null, /cône de diamètre ([\d,]+) cm et de hauteur ([\d,]+) cm\. Calcule son volume/i, (d, h) => (PI * d * d * h) / 12);
  T(null, /volume d'une boule de rayon ([\d,]+) cm/i, (r) => (4 / 3) * PI * r ** 3);
  T(null, /aire d'une sphère de rayon ([\d,]+) cm/i, (r) => 4 * PI * r * r);
  T(null, /demi-boule de rayon intérieur ([\d,]+) cm\. Calcule son volume/i, (r) => (2 / 3) * PI * r ** 3);
  T(null, /volume d'une pyramide à base carrée de côté ([\d,]+) cm et de hauteur ([\d,]+) cm/i, (c, h) => (c * c * h) / 3);
  T(null, /pyramide a pour base un rectangle de ([\d,]+) cm sur ([\d,]+) cm, et une hauteur de ([\d,]+) cm\. Calcule son volume/i, (a, b, h) => (a * b * h) / 3);
  T(null, /Un cône a un rayon de ([\d,]+) cm et une génératrice de ([\d,]+) cm\. Calcule son volume/i, (r, g) => (PI * r * r * Math.sqrt(g * g - r * r)) / 3);
  T(null, /Un cône a un rayon de ([\d,]+) cm et une hauteur de ([\d,]+) cm\. [^«]*«[^»]*»\. Trouve l'erreur, puis donne le bon volume/i, (r, h) => (PI * r * r * h) / 3);
  T(null, /pyramide est inscrite dans un cube d'arête ([\d,]+) cm[^.]*\. Calcule (?:le|son) volume/i, (a) => a ** 3 / 3);
  T(null, /On multiplie l'arête d'un cube par ([\d,]+)\. Par combien son volume/i, (k) => k ** 3);
  T(null, /On multiplie le rayon d'une boule par ([\d,]+)\. Par combien son volume/i, (k) => k ** 3);
  T(null, /On multiplie toutes les dimensions d'une pyramide par ([\d,]+)\. Par combien son volume/i, (k) => k ** 3);
  T(null, /On multiplie le rayon (?:d'un cylindre|de la base d'un cône) \(même hauteur\) par ([\d,]+)\. Par combien son volume/i, (k) => k * k);
  T(null, /Une canette de 33 cL a un rayon de ([\d,]+) cm\..*Hauteur minimale pour contenir les 33 cL \(cm, au dixième supérieur\)/i, (r) => ({ v: 330 / (PI * r * r), st: 0.1, dir: 1 }));
  T(null, /contient 33 cL\. Son rayon intérieur est ([\d,]+) cm\..*¶ Calcule la hauteur minimale de la canette \(au mm supérieur/i, (r) => ({ v: 330 / (PI * r * r), st: 0.1, dir: 1 }));

  /* --- cercle, disque --- */
  T(null, /aire d'un disque de rayon ([\d,]+) cm/i, (r) => PI * r * r);
  T(null, /disque a un diamètre de ([\d,]+) cm\. Calcule son aire/i, (d) => (PI * d * d) / 4);
  T(null, /aire d'un secteur circulaire de rayon ([\d,]+) cm et d'angle ([\d,]+)°/i, (r, a) => (PI * r * r * a) / 360);
  T(null, /longueur de l'arc d'un secteur de rayon ([\d,]+) cm et d'angle ([\d,]+)°/i, (r, a) => (2 * PI * r * a) / 360);
  T(null, /périmètre d'un cercle de diamètre ([\d,]+) cm/i, (d) => PI * d);
  T(null, /périmètre d'un cercle de rayon ([\d,]+) cm/i, (r) => 2 * PI * r);
  T(null, /roue d'un vélo a un rayon de ([\d,]+) cm\. Quelle distance parcourt-elle en un tour/i, (r) => 2 * PI * r);
  T(null, /Le diamètre d'[^.]* mesure ([\d,]+) cm\. [^«]*«[^»]*»\. Trouve l'erreur, puis donne l'aire/i, (d) => (PI * d * d) / 4);
  T(null, /Un cercle a un périmètre de ([\d,]+)π cm\. Quel est son rayon/i, (k) => k / 2);
  T(null, /Un disque a un périmètre de ([\d,]+)π cm\. Calcule son aire/i, (k) => PI * (k / 2) ** 2);
  T(null, /Un secteur circulaire de rayon ([\d,]+) cm a une aire de ([\d,]+)π cm²\. Quel est son angle/i, (r, k) => (k / (r * r)) * 360);
  T(null, /Un secteur circulaire de rayon ([\d,]+) cm a une aire de \((\d+)\)\/\((\d+)\)π cm²\. Quel est son angle/i, (r, a, b) => (a / b / (r * r)) * 360);

  /* --- Pythagore --- */
  const seg = (t, P) => { const m = new RegExp("\\b(?:" + P + "|" + P[1] + P[0] + ") = " + NUM + " ?cm").exec(t); return m ? num(m[1]) : null; };
  T(null, /Le triangle ([A-Z])([A-Z])([A-Z]) est rectangle en ([A-Z]), avec ([A-Z]{2}) = ([\d,]+) cm et ([A-Z]{2}) = ([\d,]+) cm\. Calcule ([A-Z]{2})/, (...a) => {
    const [P, Q, Rr, rt, s1, v1, s2, v2, u] = a; const hyp = [P, Q, Rr].filter((c) => c !== rt).join(""), isH = (s) => s.split("").sort().join("") === hyp.split("").sort().join("");
    const V1 = num(v1), V2 = num(v2);
    if (isH(u)) return Math.hypot(V1, V2);
    return Math.sqrt(isH(s1) ? V1 * V1 - V2 * V2 : V2 * V2 - V1 * V1);
  }, { raw: true });
  T(null, /Dans un repère orthonormé \(unité : 1 cm\), A\(([−-]?[\d,]+) ; ([−-]?[\d,]+)\) et B\(([−-]?[\d,]+) ; ([−-]?[\d,]+)\)\. Calcule la distance AB/i, (a, b, c, d) => Math.hypot(c - a, d - b));
  T(null, /parc rectangulaire de ([\d,]+) m sur ([\d,]+) m, [^.]* coupe en diagonale[^.]*\. Combien de mètres économise/i, (a, b) => a + b - Math.hypot(a, b));
  T(null, /mesure ([\d,]+) m sur ([\d,]+) m\. [^.]* d'un coin au coin opposé en diagonale plutôt que par les bords\. Combien de mètres/i, (a, b) => a + b - Math.hypot(a, b));
  T(null, /Un carré ABCD est inscrit dans un cercle de rayon ([\d,]+) cm\. Calcule l'aire du carré/i, (r) => 2 * r * r);
  T(null, /ficelle tendue de ([\d,]+) m\. Il se trouve exactement au-dessus d'un arbre situé à ([\d,]+) m/i, (l, d) => Math.sqrt(l * l - d * d));
  T(null, /Un mât vertical est tenu par un câble de ([\d,]+) m fixé au sol à ([\d,]+) m du pied/i, (l, d) => Math.sqrt(l * l - d * d));
  T(null, /(?:descend|monte) de ([\d,]+) m sur une distance horizontale de ([\d,]+) m\. Quelle est la longueur de la pente/i, (h, d) => Math.hypot(h, d));
  T(null, /hypoténuse mesure ([\d,]+) cm et une cathète ([\d,]+) cm\. [^«]*«[^»]*»\. Trouve l'erreur, puis calcule/i, (c, a) => Math.sqrt(c * c - a * a));
  T(null, /triangle rectangle a des cathètes de ([\d,]+) cm et ([\d,]+) cm\. Calcule son périmètre/i, (a, b) => a + b + Math.hypot(a, b));
  T(null, /triangle rectangle isocèle a une hypoténuse de ([\d,]+) cm\. Calcule la longueur de ses cathètes/i, (c) => c / Math.SQRT2);
  T(null, /échelle de ([\d,]+) m est appuyée contre un mur vertical\. Son pied est à ([\d,]+) m du mur\. À quelle hauteur/i, (l, d) => Math.sqrt(l * l - d * d));

  /* --- trigonométrie (angles en degrés) --- */
  T(null, /l'hypoténuse mesure ([\d,]+) cm et le côté opposé à α mesure ([\d,]+) cm\. Calcule α/i, (h, o) => deg(Math.asin(o / h)));
  T(null, /l'hypoténuse mesure ([\d,]+) cm et le côté adjacent à α mesure ([\d,]+) cm\. Calcule α/i, (h, a) => deg(Math.acos(a / h)));
  T(null, /l'hypoténuse mesure ([\d,]+) cm et un angle aigu ([\d,]+)°\. Calcule le côté adjacent/i, (h, a) => h * Math.cos(rad(a)));
  T(null, /l'hypoténuse mesure ([\d,]+) cm et un angle aigu ([\d,]+)°\. Calcule le côté opposé/i, (h, a) => h * Math.sin(rad(a)));
  T(null, /l'hypoténuse mesure ([\d,]+) cm et un angle aigu vaut ([\d,]+)°\. Pour le côté opposé[^«]*«[^»]*»\. Trouve l'erreur/i, (h, a) => h * Math.sin(rad(a)));
  T(null, /le côté adjacent à un angle de ([\d,]+)° mesure ([\d,]+) cm\. Calcule le côté opposé/i, (a, c) => c * Math.tan(rad(a)));
  T(null, /le côté adjacent à un angle de ([\d,]+)° mesure ([\d,]+) cm\. Calcule l'hypoténuse/i, (a, c) => c / Math.cos(rad(a)));
  T(null, /Le côté opposé à un angle de ([\d,]+)° d'un triangle rectangle mesure ([\d,]+) cm\. Calcule l'hypoténuse/i, (a, o) => o / Math.sin(rad(a)));
  T(null, /Les cathètes d'un triangle rectangle mesurent ([\d,]+) cm \(opposée à α\) et ([\d,]+) cm \(adjacente\)\. Calcule α/i, (o, a) => deg(Math.atan(o / a)));
  T(null, /yeux sont à ([\d,]+) m du sol se tient à ([\d,]+) m d'un immeuble\. Elle voit son sommet sous un angle de ([\d,]+)°[^.]*\. Quelle est la hauteur/i, (y, d, a) => y + d * Math.tan(rad(a)));
  T(null, /Une route monte de ([\d,]+) m sur une distance horizontale de ([\d,]+) km\. Quel angle/i, (h, d) => deg(Math.atan(h / (d * 1000))));
  T(null, /échelle de ([\d,]+) m est appuyée contre un mur ; elle fait un angle de ([\d,]+)° avec le sol\. À quelle distance du mur/i, (l, a) => l * Math.cos(rad(a)));
  T(null, /échelle de ([\d,]+) m est appuyée contre un mur ; elle fait un angle de ([\d,]+)° avec le sol\. À quelle hauteur/i, (l, a) => l * Math.sin(rad(a)));

  /* --- Thalès --- */
  const TH = /Dans un triangle ABC, D ?\[AB\], E ?\[AC\] et \(DE\) ?\(BC\)[.,]/;
  function thales(t) {
    if (!TH.test(t)) return null;
    const g = (k) => { const m = new RegExp("\\b" + k + " = " + NUM).exec(t); return m ? num(m[1]) : null; };
    let [AD, AB, DB, AE, AC, EC, DE, BC] = ["AD", "AB", "DB", "AE", "AC", "EC", "DE", "BC"].map(g);
    if (/AD = x/.test(t)) { if (DB && AE && EC) return (DB * AE) / EC; return null; }
    if (AB == null && AD != null && DB != null) AB = AD + DB;
    const k = AB / AD;
    const ask = (/Calcule ([A-Z]{2})\.|Calcule ([A-Z]{2})$|calcule ([A-Z]{2})\.?$/.exec(t) || []).slice(1).find(Boolean);
    if (/périmètre du trapèze DECB/.test(t)) { const bc = DE * k, ac = AE * k; return (AB - AD) + bc + (ac - AE) + DE; }
    if (ask === "DE") return BC / k; if (ask === "BC") return DE * k; if (ask === "AE") return AC / k; if (ask === "AC") return AE * k; if (ask === "EC") return AC != null ? AC - AC / k : AE * k - AE; if (ask === "DB") return AB - AD;
    return null;
  }
  T(null, TH, (t) => thales(t), { text: true });
  T(null, /Les droites \(BD\) et \(CE\) se coupent en A[^.]*\. AD = ([\d,]+), AB = ([\d,]+) et DE = ([\d,]+)\. Calcule BC/i, (ad, ab, de) => (de * ab) / ad);
  T(null, /Un bâton vertical de ([\d,]+) m a une ombre de ([\d,]+) m\. Au même moment, l'ombre d'[^.]* mesure ([\d,]+) m\. Quelle est la hauteur/i, (b, o, O) => (b * O) / o);

  /* --- statistiques --- */
  const LIST = "((?:[−-]?\\d+(?:,\\d+)? ; )+[−-]?\\d+(?:,\\d+)?)";
  const L = (s) => s.split(" ; ").map(num);
  const mean = (a) => a.reduce((u, v) => u + v, 0) / a.length;
  const median = (a) => { const b = [...a].sort((u, v) => u - v), n = b.length; return n % 2 ? b[(n - 1) / 2] : (b[n / 2 - 1] + b[n / 2]) / 2; };
  T(null, new RegExp("Calcule la moyenne de la série : " + LIST), (s) => mean(L(s)), { raw: true });
  T(null, new RegExp("Donne la médiane de la série : " + LIST), (s) => median(L(s)), { raw: true });
  T(null, new RegExp("mode de la série : " + LIST), (s) => { const a = L(s), c = {}; a.forEach((v) => (c[v] = (c[v] || 0) + 1)); const mx = Math.max(...Object.values(c)), md = Object.keys(c).filter((k) => c[k] === mx); return md.length === 1 ? +md[0] : null; }, { raw: true });
  T(null, new RegExp("écart-type (?:σ )?de la série " + LIST), (s) => { const a = L(s), m = mean(a); return Math.sqrt(mean(a.map((v) => (v - m) ** 2))); }, { raw: true });
  T(null, new RegExp("a eu les notes " + LIST + "\\. Quelle note lui faut-il au prochain test pour avoir exactement " + NUM + " de moyenne"), (s, m) => { const a = L(s); return num(m) * (a.length + 1) - a.reduce((u, v) => u + v, 0); }, { raw: true });
  T(null, /moyenne de ([\d,]+)(?: points)? et un écart-type de ([\d,]+)\. On ajoute ([\d,]+) à toutes les valeurs\. Quelle est la nouvelle moyenne/i, (m, s, k) => m + k);
  T(null, /moyenne de ([\d,]+)(?: points)? et un écart-type de ([\d,]+)\. On multiplie toutes les valeurs par ([\d,]+)\. Quel est le nouvel écart-type/i, (m, s, k) => s * k);
  T(null, /moyenne de ([\d,]+) points et un écart-type de ([\d,]+)\. Chaque joueur reçoit un bonus de ([\d,]+) points\. Quel est le nouvel écart-type/i, (m, s) => s);
  T(null, /array ?c\|c+ (?:note|pièces|valeur|[a-zé ]+) ((?:& [\d,]+ )+)\\? ?(?:hline )?effectif ((?:& [\d,]+ ?)+)array\. (Calcule la moyenne|Quelle est la médiane)/i, (vs, es, what) => {
    const v = vs.trim().split(/ ?& ?/).filter(Boolean).map(num), e = es.trim().split(/ ?& ?/).filter(Boolean).map(num); if (v.length !== e.length) return null;
    const all = []; v.forEach((x, i) => { for (let k = 0; k < e[i]; k++) all.push(x); });
    return /moyenne/.test(what) ? mean(all) : median(all);
  }, { raw: true });
  T(null, /Notes d'un test : ((?:[\d,]+ \(\d+ élèves?\),? ?)+)\. Calcule la moyenne de la classe/i, (s) => { let n = 0, t = 0; for (const m of s.matchAll(/([\d,]+) \((\d+) élèves?\)/g)) { n += num(m[2]); t += num(m[1]) * num(m[2]); } return t / n; }, { raw: true });
  T(null, /diagramme circulaire qui représente ([\d']+) élèves, un secteur mesure ([\d,]+)°\. Combien d'élèves/i, (n, a) => (n * a) / 360);
  T(null, /une catégorie représente ([\d,]+) ?% du total\. Quel angle/i, (p) => (p * 360) / 100);
  T(null, /Dans une classe de (\d+) élèves, (\d+) viennent à vélo\. Dans un diagramme circulaire, quel angle/i, (n, k) => (k * 360) / n);
  T(null, /Sur ([\d']+) élèves interrogés, ([\d']+) viennent à vélo\. Dans un diagramme circulaire, quel angle/i, (n, k) => (k * 360) / n);

  /* --- arithmétique --- */
  T(null, /Détermine le PGDC de (\d+) et (\d+)\./i, gcd);
  T(null, /Quel est le plus grand nombre qui divise à la fois (\d+) et (\d+)/i, gcd);
  T(null, /Détermine le PPMC de (\d+) et (\d+)\./i, lcm);
  T(null, /plus petit nombre non nul qui soit à la fois multiple de (\d+) et de (\d+)/i, lcm);
  T(null, /L'un repart toutes les (\d+) minutes, l'autre toutes les (\d+) minutes\. Dans combien de minutes/i, lcm);
  T(null, /On répartit (\d+) billes rouges et (\d+) billes bleues dans des sachets tous identiques[^.]*\. Combien de sachets/i, gcd);
  T(null, /paver un rectangle de (\d+) cm sur (\d+) cm avec des carrés tous identiques, les plus grands possible\. Quel est le côté/i, gcd);
  T(null, /Par quel nombre faut-il simplifier \((\d+)\)\/\((\d+)\) pour obtenir directement une fraction irréductible/i, gcd);
  T(null, /plus petit dénominateur commun de \((\d+)\)\/\((\d+)\) et \((\d+)\)\/\((\d+)\)/i, (a, b, c, d) => lcm(b / gcd(a, b), d / gcd(c, d)));

  /* --- angles, polygones --- */
  T(null, /complément d'un angle de ([\d,]+)°/i, (a) => 90 - a);
  T(null, /supplément d'un angle de ([\d,]+)°/i, (a) => 180 - a);
  T(null, /l'angle au centre ∠AOB mesure ([\d,]+)°\. Combien mesure l'angle inscrit/i, (a) => a / 2);
  T(null, /l'angle au centre ∠AOB mesure ([\d,]+)°\. Combien mesure l'angle ∠OAB/i, (a) => (180 - a) / 2);
  T(null, /l'angle inscrit ∠ACB mesure ([\d,]+)°\. Combien mesure l'angle au centre/i, (a) => 2 * a);
  T(null, /∠AMB = ([\d,]+)°\. Combien mesure ∠ANB/i, (a) => a);
  const linx = (s) => { const m = /\(([\d,]*)x ([+-]) ([\d,]+)\)° et \(([\d,]*)x ([+-]) ([\d,]+)\)°/.exec(s); if (!m) return null; const a = m[1] ? num(m[1]) : 1, b = (m[2] === "-" ? -1 : 1) * num(m[3]), c = m[4] ? num(m[4]) : 1, d = (m[5] === "-" ? -1 : 1) * num(m[6]); return [a, b, c, d]; };
  T(null, /alternes-internes mesurent (\([^)]*\)° et \([^)]*\)°)\. Que vaut x/i, (s) => { const k = linx(s); return k && (k[3] - k[1]) / (k[0] - k[2]); }, { raw: true });
  T(null, /forment un angle plat\. Ils mesurent (\([^)]*\)° et \([^)]*\)°)\. Que vaut x/i, (s) => { const k = linx(s); return k && (180 - k[1] - k[3]) / (k[0] + k[2]); }, { raw: true });
  T(null, /Dans le triangle ABC, ∠A = ([\d,]+)° et ∠B = ([\d,]+)°\. On prolonge \[BC\] au-delà de C\. Que mesure l'angle extérieur en C/i, (a, b) => a + b);
  T(null, /Dans un parallélogramme, un angle mesure ([\d,]+)°\. Que mesure un angle voisin/i, (a) => 180 - a);
  T(null, /Dans un triangle, deux angles mesurent ([\d,]+)° et ([\d,]+)°\. Que mesure le troisième/i, (a, b) => 180 - a - b);
  T(null, /un angle mesure ([\d,]+)° de plus que le plus petit, et le troisième ([\d,]+)° de plus que le plus petit\. Combien mesure le plus petit/i, (a, b) => (180 - a - b) / 3);
  T(null, /Les angles d'un triangle sont proportionnels à (\d+), (\d+) et (\d+)\. Que mesure le plus grand/i, (a, b, c) => (180 * Math.max(a, b, c)) / (a + b + c));
  T(null, /Que mesure chaque angle d'un polygone régulier à (\d+) côtés/i, (n) => 180 - 360 / n);
  T(null, /Chaque angle d'un polygone régulier mesure ([\d,]+)°\. Combien a-t-il de côtés/i, (a) => 360 / (180 - a));
  T(null, /Un quadrilatère a trois angles de ([\d,]+)°, ([\d,]+)° et ([\d,]+)°\. Que mesure le quatrième/i, (a, b, c) => 360 - a - b - c);
  T(null, /Un quadrilatère a trois angles égaux de ([\d,]+)° chacun\. Combien mesure le quatrième/i, (a) => 360 - 3 * a);
  T(null, /Un trapèze rectangle a deux angles droits\. Un autre de ses angles mesure ([\d,]+)°\. Combien mesure le quatrième/i, (a) => 180 - a);
  T(null, /triangle isocèle a deux angles à la base de ([\d,]+)°\. Que mesure l'angle au sommet/i, (a) => 180 - 2 * a);
  T(null, /triangle isocèle a un angle au sommet de ([\d,]+)°\. Que mesure chacun des angles à la base/i, (a) => (180 - a) / 2);
  T(null, /L'angle au centre d'un polygone régulier mesure ([\d,]+)°\. Combien le polygone a-t-il de côtés/i, (a) => 360 / a);
  T(null, /La somme des angles intérieurs d'un polygone vaut ([\d']+)°\. Combien a-t-il de côtés/i, (s) => s / 180 + 2);
  T(null, /Quelle est la mesure d'un angle intérieur d'un polygone régulier à (\d+) côtés/i, (n) => 180 - 360 / n);
  const NG = { triangle: 3, carré: 4, pentagone: 5, hexagone: 6, heptagone: 7, octogone: 8, ennéagone: 9, nonagone: 9, décagone: 10, dodécagone: 12 };
  T(null, /Quelle est la mesure d'un angle intérieur d'un (pentagone|hexagone|heptagone|octogone|ennéagone|nonagone|décagone|dodécagone) régulier/i, (n) => 180 - 360 / NG[n.toLowerCase()], { raw: true });
  T(null, /Quelle est la mesure de l'angle au centre d'un (pentagone|hexagone|heptagone|octogone|ennéagone|nonagone|décagone|dodécagone) régulier/i, (n) => 360 / NG[n.toLowerCase()], { raw: true });
  T(null, /Quelle est la mesure de l'angle au centre d'un polygone régulier à (\d+) côtés/i, (n) => 360 / n);
  T(null, /Quelle est la somme des angles intérieurs d'un polygone à (\d+) côtés/i, (n) => (n - 2) * 180);
  T(null, /Un angle intérieur d'un polygone régulier mesure ([\d,]+)°\. Combien le polygone a-t-il de côtés/i, (a) => 360 / (180 - a));
  T(null, /Une roue a (\d+) rayons régulièrement espacés\. Quel angle forment deux rayons voisins/i, (n) => 360 / n);

  /* --- échelles, pentes, similitudes --- */
  T(null, /En agrandissant un cube, son volume est multiplié par ([\d']+)\. Par combien ses arêtes/i, (k) => Math.cbrt(k));
  T(null, /On agrandit une figure de rapport ([\d,]+)\. Son aire était de ([\d',]+) cm²\. Quelle est sa nouvelle aire/i, (k, a) => k * k * a);
  T(null, /On réduit une figure dans le rapport \((\d+)\)\/\((\d+)\)\. Son aire était de ([\d',]+) cm²\. Quelle est sa nouvelle aire/i, (p, q, a) => (p / q) ** 2 * a);
  T(null, /le salon mesure ([\d,]+) cm sur ([\d,]+) cm\. En réalité, sa longueur est de ([\d,]+) m\. Quelle est sa largeur réelle/i, (L, l, R) => (R * l) / L);
  T(null, /Sur un plan à l'échelle 1 : ([\d']+), un mur mesure ([\d,]+) cm\. Quelle est sa longueur réelle, en mètres/i, (n, c) => (c * n) / 100);
  T(null, /Sur une carte au 1 : ([\d']+), deux refuges sont à ([\d,]+) cm l'un de l'autre\. À quelle distance sont-ils sur une carte au 1 : ([\d']+)/i, (n, c, m) => (c * n) / m);
  T(null, /Sur une carte au 1 : ([\d']+), deux villages sont distants de ([\d,]+) km en réalité\. Quelle est leur distance sur la carte \(en cm\)/i, (n, k) => (k * 100000) / n);
  T(null, /Sur une carte au 1 : ([\d']+), un lac mesure ([\d,]+) cm de long\. Quelle est sa longueur réelle, en km/i, (n, c) => (c * n) / 100000);
  T(null, /Sur une carte à l'échelle 1 : ([\d']+), deux villages sont à ([\d,]+) cm(?: l'un de l'autre)?\. (?:[^«]*«[^»]*»\. Trouve l'erreur, puis donne la distance réelle|Quelle est la distance réelle), en (k?m)/i, (n, c, u) => (num(c) * num(n)) / (u === "km" ? 100000 : 100), { raw: true });
  T(null, /Sur une carte, ([\d,]+) cm représentent ([\d,]+) km\. L'échelle est 1 : n\. Que vaut n/i, (c, k) => (k * 100000) / c);
  T(null, /Un sentier de ([\d,]+) km mesure ([\d,]+) cm sur une carte\. L'échelle de la carte est 1 : n\. Que vaut n/i, (k, c) => (k * 100000) / c);
  T(null, /Une figure agrandie dans le rapport ([\d,]+) a une aire de ([\d',]+) cm²\. Quelle était l'aire de la figure de départ/i, (k, a) => a / (k * k));
  T(null, /Une locomotive réelle mesure ([\d,]+) m de long ; sa maquette mesure ([\d,]+) cm\. L'échelle de la maquette est 1 : n/i, (m, c) => (m * 100) / c);
  T(null, /Une maquette est ([\d']+) fois plus petite que l'objet réel\. Son volume est de ([\d,]+) dm³\. Quel est le volume de l'objet réel/i, (k, v) => v * k ** 3);
  T(null, /Un chemin de pente ([\d,]+) ?% monte sur ([\d',]+) m de distance horizontale\. Quel dénivelé/i, (p, d) => (p * d) / 100);
  T(null, /Un chemin doit gravir ([\d',]+) m de dénivelé avec une pente constante de ([\d,]+) ?%\. Quelle distance horizontale/i, (h, p) => (h * 100) / p);
  T(null, /(?:descend|monte) de ([\d,']+) m (?:sur|pour) une distance horizontale de ([\d,']+) m\. Quelle est sa pente, en pour cent/i, (h, d) => (h / d) * 100);
  T(null, /Une descente a une pente de ([\d,]+) ?%\. De combien de mètres descend-on sur une distance horizontale de ([\d,]+) km/i, (p, k) => p * k * 10);
  T(null, /Une droite passe par l'origine et par le point \(([\d,]+) ; ([\d,]+)\)\. Quelle est sa pente, en pour cent/i, (x, y) => (y / x) * 100);
  T(null, /Une rampe d'accès doit avoir une pente de ([\d,]+) ?%\. Elle doit permettre de monter de ([\d,]+) m\. Quelle doit être sa longueur horizontale/i, (p, h) => (h * 100) / p);
  T(null, /Une route a une pente de ([\d,]+) ?%\. De combien de mètres monte-t-on pour une distance horizontale de ([\d',]+) m/i, (p, d) => (p * d) / 100);
  T(null, /Une route de pente ([\d,]+) ?% permet de monter de ([\d',]+) m\. Quelle distance horizontale parcourt-on \(en km\)/i, (p, h) => (h * 100) / p / 1000);
  T(null, /Deux figures semblables ont pour aires ([\d',]+) cm² et ([\d',]+) cm²\. Le périmètre de la petite est ([\d,]+) cm\. Quel est le périmètre de la grande/i, (a, b, p) => p * Math.sqrt(Math.max(a, b) / Math.min(a, b)));
  T(null, /Deux figures semblables ont pour aires ([\d',]+) cm² et ([\d',]+) cm²\. Quel est le rapport d'agrandissement/i, (a, b) => Math.sqrt(Math.max(a, b) / Math.min(a, b)));
  T(null, /Les côtés du petit mesurent ([\d,]+), ([\d,]+) et ([\d,]+) cm\. Le côté du grand qui correspond à ([\d,]+) cm mesure ([\d,]+) cm\. Combien mesure (?:le côté du grand qui correspond à|celui qui correspond à) ([\d,]+) cm/i, (a, b, c, s, S, t) => (t * S) / s);
  T(null, /L'homothétie de centre O et de rapport ([\d,]+) envoie A sur A' et B sur B'\. OA = ([\d,]+) cm et AB = ([\d,]+) cm\. Calcule AA'/i, (k, oa) => (k - 1) * oa);
  T(null, /L'homothétie de centre O et de rapport ([\d,]+) envoie A sur A' et B sur B'\. OA = ([\d,]+) cm et AB = ([\d,]+) cm\. Calcule A'B'/i, (k, oa, ab) => k * ab);
  T(null, /a une aire de ([\d',]+) cm²\. On l'agrandit : toutes les longueurs sont multipliées par ([\d,]+)\. [^«]*«[^»]*»\. Trouve l'erreur/i, (a, k) => a * k * k);
  T(null, /Un polygone de périmètre ([\d,]+) cm est agrandi de rapport ([\d,]+)\. Quel est le nouveau périmètre/i, (p, k) => p * k);
  T(null, /Un triangle est agrandi : un côté de ([\d,]+) cm devient ([\d,]+) cm\. Quel est le rapport d'agrandissement/i, (a, b) => b / a);
  T(null, /Une maquette est à l'échelle 1 : (\d+)\. Son volume est de ([\d',]+) cm³\. Quel est le volume réel, en litres/i, (n, v) => (v * n ** 3) / 1000);

  /* --- triangle quelconque (sinus, cosinus) --- */
  const al = (s) => s.normalize("NFC");
  T(null, /Dans le triangle ABC, a = ([\d,]+)(?: cm)?, b = ([\d,]+)(?: cm)? et α = ([\d,]+)°\. Calcule l'angle β/i, (a, b, A) => deg(Math.asin((b * Math.sin(rad(A))) / a)));
  T(null, /Dans le triangle ABC, a = ([\d,]+) cm, α = ([\d,]+)° et β = ([\d,]+)°\. Calcule b/i, (a, A, B) => (a * Math.sin(rad(B))) / Math.sin(rad(A)));
  T(null, /Dans le triangle ABC, c = ([\d,]+) cm, α = ([\d,]+)° et β = ([\d,]+)°\. Calcule a/i, (c, A, B) => (c * Math.sin(rad(A))) / Math.sin(rad(180 - A - B)));
  T(null, /Dans le triangle ABC, a = ([\d,]+) cm, b = ([\d,]+) cm et (?:l'angle compris )?γ = ([\d,]+)°\.(?: [^«]*«[^»]*»\. Trouve l'erreur, puis)? [Cc]alcule c/i, (a, b, C) => Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(rad(C))));
  T(null, /Dans le triangle ABC, a = ([\d,]+)(?: cm)?, b = ([\d,]+)(?: cm)? et γ = ([\d,]+)°\. Calcule l'angle β/i, (a, b, C) => { const c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(rad(C))); return deg(Math.acos((a * a + c * c - b * b) / (2 * a * c))); });
  T(null, /Résous complètement le triangle ABC a = ([\d,]+) cm, b = ([\d,]+) cm et γ = ([\d,]+)°\. Calcule c, puis α, puis β\. Donne β/i, (a, b, C) => { const c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(rad(C))); return deg(Math.acos((a * a + c * c - b * b) / (2 * a * c))); });
  T(null, /Un triangle a pour côtés a = ([\d,]+), b = ([\d,]+) et c = ([\d,]+)\. Calcule l'angle γ/i, (a, b, c) => deg(Math.acos((a * a + b * b - c * c) / (2 * a * b))));
  T(null, /Un parallélogramme a des côtés de ([\d,]+) cm et ([\d,]+) cm, et un angle de ([\d,]+)°\. Calcule la longueur de la diagonale opposée à l'angle de ([\d,]+)°/i, (a, b, x, y) => Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(rad(y))));
  T(null, /un bateau est à ([\d,]+) km et un autre à ([\d,]+) km ; les deux directions forment un angle de ([\d,]+)°\. Quelle distance/i, (a, b, C) => Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(rad(C))));
  T(null, /forment un angle de ([\d,]+)°\. \S+ marche ([\d,]+) km sur l'un, \S+ ([\d,]+) km sur l'autre\. Quelle distance/i, (C, a, b) => Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(rad(C))));
  T(null, /Deux observateurs A et B sont à ([\d',]+) m l'un de l'autre[^.]*\. Ils visent une bouée C : l'angle en A vaut ([\d,]+)° et l'angle en B ([\d,]+)°\. Quelle est la distance AC/i, (c, A, B) => (c * Math.sin(rad(B))) / Math.sin(rad(180 - A - B)));
  T(null, /Deux observateurs A et B sont à ([\d',]+) m l'un de l'autre[^.]*\. Ils visent une bouée C : l'angle en A vaut ([\d,]+)° et l'angle en B ([\d,]+)°\. Quelle est la distance BC/i, (c, A, B) => (c * Math.sin(rad(A))) / Math.sin(rad(180 - A - B)));

  /* --- grandeurs composées --- */
  T(null, /(?:Un|Une) [^.]* (?:monte|avance) à ([\d,]+) m\/min\. Quelle est sa vitesse en km\/h/i, (v) => (v * 60) / 1000);
  T(null, /avance à ([\d,]+) cm\/s\. Quelle est sa vitesse en km\/h/i, (v) => v * 0.036);
  T(null, /débit de ([\d,]+) L\/min\. Exprime ce débit en m\^?3\/h/i, (d) => (d * 60) / 1000);
  T(null, /débite ([\d,]+) m\^?3\/h\. Exprime ce débit en L\/min/i, (d) => (d * 1000) / 60);
  T(null, /consomme ([\d,]+) m\^?3\/h\. Exprime ce débit en L\/min/i, (d) => (d * 1000) / 60);
  T(null, /parcourt (?:environ )?([\d',]+) m par minute[^.]*\. Quelle est sa vitesse en m\/s/i, (d) => d / 60);
  T(null, /convertit ([\d,]+) km\/h en m\/s : [^«]*«[^»]*»\. Trouve l'erreur, puis donne la bonne vitesse en m\/s/i, (v) => v / 3.6);
  T(null, /(?:court|roule|descend|va|vole) à ([\d,]+) km\/h\. Quelle est sa vitesse en m\/s/i, (v) => v / 3.6);
  T(null, /(?:court|roule|nage|vole|va|souffle) à ([\d,]+) m\/s\. Quelle est sa vitesse en km\/h/i, (v) => v * 3.6);
  T(null, /va à ([\d,]+) m\/s et un [^.]* à ([\d,]+) km\/h\. Quelle est la différence entre leurs vitesses, en km\/h/i, (a, b) => Math.abs(a * 3.6 - b));
  T(null, /masse volumique de ([\d',]+) kg\/m\^?3\. Exprime-la en g\/cm\^?3/i, (r) => r / 1000);
  T(null, /masse volumique de ([\d',]+) g\/cm\^?3\. Exprime-la en kg\/m\^?3/i, (r) => r * 1000);
  T(null, /débit de ([\d,]+) L\/min\. Combien de litres coulent en ([\d,]+) min ([\d,]+) s/i, (d, m, s) => d * (m + s / 60));
  T(null, /de ([\d,]+) m\^?3 est remplie? (?:avec|par) un[^.]* qui débite ([\d,]+) L\/min\. Combien de minutes/i, (v, d) => (v * 1000) / d);
  T(null, /remplit un (?:seau|arrosoir|bouteille) de ([\d,]+) L en ([\d,]+) s\. Quel est son débit en L\/min/i, (l, s) => (l / s) * 60);
  T(null, /remplit une bouteille de ([\d,]+) L en ([\d,]+) s\. Quel est son débit en L\/min/i, (l, s) => (l / s) * 60);
  T(null, /a une masse volumique de ([\d,]+) kg\/L\. Quelle est la masse de ([\d,]+) L/i, (r, v) => r * v);
  T(null, /a un volume de ([\d,]+) cm\^?3 et une masse de ([\d',]+) g\. Calcule sa masse volumique/i, (v, m) => m / v);
  T(null, /\(([\d,]+) g\/cm\^?3\) a une masse de ([\d',]+) g\. Quel est son volume/i, (r, m) => m / r);
  T(null, /([\d,]+) tonnes de pierres occupent ([\d,]+) m\^?3\. Quelle est leur masse volumique en kg\/m\^?3/i, (t, v) => (t * 1000) / v);
  T(null, /l'air a une masse volumique de ([\d,]+) kg\/m\^?3\. Quelle est la masse de l'air contenu dans [^.]* de ([\d,]+) m sur ([\d,]+) m et ([\d,]+) m de haut/i, (r, a, b, c) => r * a * b * c);
  T(null, /Un bloc de cuivre de ([\d,]+) cm\^?3 pèse ([\d',]+) g\. [^«]*«[^»]*»\. Trouve l'erreur, puis donne la bonne masse volumique/i, (v, m) => m / v);

  /* --- cercle (équation), droites, repère --- */
  T(null, /Détermine le rayon du cercle x\^2 \+ y\^2 ([+-]) (\d+)x ([+-]) (\d+)y ([+-]) (\d+) = 0/i, (s1, a, s2, b, s3, c) => { const A = (s1 === "-" ? -1 : 1) * num(a), B = (s2 === "-" ? -1 : 1) * num(b), C = (s3 === "-" ? -1 : 1) * num(c); return Math.sqrt((A * A + B * B) / 4 - C); }, { raw: true });
  T(null, /Calcule la distance entre A\(([−-]?[\d,]+) ; ([−-]?[\d,]+)\) et B\(([−-]?[\d,]+) ; ([−-]?[\d,]+)\)/i, (a, b, c, d) => Math.hypot(c - a, d - b));
  T(null, /Calcule l'aire du triangle ABC avec A\(([−-]?[\d,]+) ; ([−-]?[\d,]+)\), B\(([−-]?[\d,]+) ; ([−-]?[\d,]+)\) et C\(([−-]?[\d,]+) ; ([−-]?[\d,]+)\)/i, (a, b, c, d, e, f) => Math.abs((c - a) * (f - b) - (e - a) * (d - b)) / 2);
  T(null, /Pour quelle valeur de k la droite y = kx [+-] [\d,]+ est-elle perpendiculaire à y = ([−-]?[\d,]*)x/i, (m) => -1 / (m === "" ? 1 : m === "-" || m === "−" ? -1 : num(m)), { raw: true });
  T(null, /Le point P\(([−-]?[\d,]+) ; y\) est sur la droite qui passe par A\(([−-]?[\d,]+) ; ([−-]?[\d,]+)\) et B\(([−-]?[\d,]+) ; ([−-]?[\d,]+)\)\. Que vaut y/i, (x, a, b, c, d) => b + ((d - b) / (c - a)) * (x - a));
  T(null, /Un taxi facture ([\d,]+) CHF de prise en charge, puis ([\d,]+) CHF par kilomètre\. Combien paie-t-on pour ([\d,]+) km/i, (f, p, k) => f + p * k);
  T(null, /Une location de vélo coûte ([\d,]+) CHF, plus ([\d,]+) CHF par heure\. Combien paie-t-on pour ([\d,]+) h/i, (f, p, h) => f + p * h);
  T(null, /Forfait A : ([\d,]+) CHF par mois plus ([\d,]+) CHF par minute\. Forfait B : ([\d,]+) CHF par minute, sans frais fixes\. Pour combien de minutes/i, (f, a, b) => f / (b - a));
  T(null, /fonction affine des degrés Celsius : ([−-]?[\d,]+) ?°C = ([−-]?[\d,]+) ?°F et ([−-]?[\d,]+) ?°C = ([−-]?[\d,]+) ?°F\. Combien de degrés Fahrenheit (?:font|vaut|valent|correspondent à) ([−-]?[\d,]+) ?°C/i, (c1, f1, c2, f2, c) => f1 + ((f2 - f1) / (c2 - c1)) * (c - c1));

  /* --- aires de pyramides --- */
  const apo = (c, h) => Math.sqrt(h * h + (c / 2) ** 2);
  T(null, /pyramide régulière à base carrée a un côté de base de ([\d,]+) cm et un apothème de ([\d,]+) cm\. Calcule son aire latérale/i, (c, a) => 2 * c * a);
  T(null, /pyramide régulière à base carrée a un côté de base de ([\d,]+) cm et un apothème de ([\d,]+) cm\. Calcule son aire totale/i, (c, a) => 2 * c * a + c * c);
  T(null, /pyramide régulière à base carrée a un côté de base de ([\d,]+) cm et une hauteur de ([\d,]+) cm\. Calcule son aire latérale/i, (c, h) => 2 * c * apo(c, h));
  T(null, /pyramide régulière à base carrée a un côté de base de ([\d,]+) cm et une hauteur de ([\d,]+) cm\. Calcule son apothème/i, (c, h) => apo(c, h));
  T(null, /pyramide régulière à base carrée a des arêtes latérales de ([\d,]+) cm et un côté de base de ([\d,]+) cm\. Calcule son aire totale/i, (l, c) => 2 * c * Math.sqrt(l * l - (c / 2) ** 2) + c * c);
  T(null, /La pyramide du Louvre a une base carrée de côté ([\d,]+) m et une hauteur de ([\d,]+) m\. Ses quatre faces sont en verre\. Calcule la surface de verre/i, (c, h) => 2 * c * apo(c, h));
  T(null, /quatre faces d'une tente en forme de pyramide \(base carrée de ([\d,]+) dm, apothème ([\d,]+) dm\)\. Quelle surface de toile/i, (c, a) => 2 * c * a);
  T(null, /quatre faces du toit d'une tour, en forme de pyramide \(base carrée de ([\d,]+) dm, apothème ([\d,]+) dm\)\. Quelle surface de toile/i, (c, a) => 2 * c * a);

  /* --- probabilités (dénombrement exact) --- */
  const C = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return r; };
  const dice2 = (pred) => { let c = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (pred(a, b)) c++; return c / 36; };
  const isPrime = (n) => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
  T(null, /Dans un lot de (\d+) ampoules, (\d+) sont défectueuses\. On en prend une au hasard\. Quelle est la probabilité qu'elle fonctionne/i, (n, d) => (n - d) / n);
  T(null, /Une tombola compte (\d+) billets, dont (\d+) gagnants\. Tu achètes un billet\. Quelle est la probabilité de ne PAS gagner/i, (n, g) => (n - g) / n);
  T(null, /On lance (\d+) pièces équilibrées\. Quelle est la probabilité d'obtenir exactement (\d+) fois pile/i, (n, k) => C(n, k) / 2 ** n);
  T(null, /On lance trois pièces équilibrées\. Quelle est la probabilité d'obtenir au moins une fois pile/i, () => 7 / 8);
  T(null, /On lance deux dés équilibrés et on additionne les points\. Quelle est la probabilité d'obtenir (\d+)/i, (s) => dice2((a, b) => a + b === s));
  T(null, /On lance deux dés équilibrés et on multiplie les points\. Quelle est la probabilité que le produit vaille (\d+)/i, (p) => dice2((a, b) => a * b === p));
  T(null, /On lance deux dés équilibrés\. Quelle est la probabilité d'obtenir au moins un (\d)/i, () => 1 - (5 / 6) ** 2);
  T(null, /On lance trois dés équilibrés\. Quelle est la probabilité d'obtenir au moins un (\d)/i, () => 1 - (5 / 6) ** 3);
  const die = (n, pred) => { let c = 0; for (let k = 1; k <= n; k++) if (pred(k)) c++; return c / n; };
  T(null, /dé équilibré à (\d+) faces numérotées de 1 à (\d+)\. Quelle est la probabilité d'obtenir un multiple de (\d+)/i, (n, m, k) => die(n, (x) => x % k === 0));
  T(null, /dé équilibré à (\d+) faces numérotées de 1 à (\d+)\. Quelle est la probabilité d'obtenir un nombre pair/i, (n) => die(n, (x) => x % 2 === 0));
  T(null, /dé équilibré à (\d+) faces numérotées de 1 à (\d+)\. Quelle est la probabilité d'obtenir un nombre premier/i, (n) => die(n, isPrime));
  T(null, /dé équilibré à (\d+) faces numérotées de 1 à (\d+)\. Quelle est la probabilité d'obtenir un nombre supérieur à (\d+)/i, (n, m, k) => die(n, (x) => x > k));
  T(null, /dé équilibré à (\d+) faces\. \S+ calcule la probabilité d'obtenir un nombre pair ou au moins (\d+) : [^«]*«[^»]*»\. Trouve l'erreur/i, (n, k) => die(n, (x) => x % 2 === 0 || x >= k));
  T(null, /On écrit chaque lettre du mot ([A-ZÉÈ]+) sur un carton, et on tire un carton au hasard\. Quelle est la probabilité de tirer une voyelle/i, (w) => w.split("").filter((c) => /[AEIOUYÉÈ]/.test(c)).length / w.length, { raw: true });
  T(null, /Une urne contient (\d+) boules rouges, (\d+) bleues et (\d+) vertes?\. On tire une boule au hasard\. Quelle est la probabilité qu'elle soit (rouge|bleue|verte)/i, (r, b, v, c) => ({ rouge: +r, bleue: +b, verte: +v })[c] / (+r + +b + +v), { raw: true });
  T(null, /Une urne contient (\d+) boules rouges et (\d+) (?:bleues|vertes)\. On tire une boule, on la remet, puis on en tire une deuxième\. Quelle est la probabilité d'obtenir deux rouges/i, (r, b) => (r / (r + b)) ** 2);
  T(null, /Une urne contient (\d+) boules rouges et (\d+) (?:bleues|vertes)\. On tire deux boules sans remise\. Quelle est la probabilité d'obtenir deux boules de la même couleur/i, (r, b) => (r * (r - 1) + b * (b - 1)) / ((r + b) * (r + b - 1)));
  T(null, /Une urne contient (\d+) boules rouges et (\d+) (?:bleues|vertes)\. On tire deux boules sans remise\. Quelle est la probabilité d'obtenir une boule de chaque couleur/i, (r, b) => (2 * r * b) / ((r + b) * (r + b - 1)));
  T(null, /Une urne contient (\d+) boules rouges et (\d+) (?:bleues|vertes)\. On tire deux boules sans remise\. Quelle est la probabilité d'obtenir deux boules rouges/i, (r, b) => (r * (r - 1)) / ((r + b) * (r + b - 1)));

  /* --- notation scientifique, conversions --- */
  const UM = { km: 1e3, m: 1, dm: 0.1, cm: 0.01, mm: 1e-3, "µm": 1e-6, nm: 1e-9, t: 1e6, kg: 1e3, g: 1, mg: 1e-3, "µg": 1e-6, L: 1, dl: 0.1, cl: 0.01, ml: 1e-3, s: 1, ms: 1e-3, "µs": 1e-6, h: 3600, min: 60 };

  /* --- statistiques (suite), Thalès et Pythagore réciproques --- */
  T(null, new RegExp("Quelle est l'étendue de la série " + LIST), (s) => { const a = L(s); return Math.max(...a) - Math.min(...a); }, { raw: true });
  T(null, /L'étendue d'une série vaut ([\d,]+) et sa plus petite valeur ([−-]?[\d,]+)\. Quelle est sa plus grande valeur/i, (e, m) => m + e);
  T(null, /la température minimale a été de ([−-]?[\d,]+) ?°C et l'étendue des températures de ([\d,]+) ?°C\. Quelle a été la température maximale/i, (m, e) => m + e);
  T(null, /la boîte va de ([\d,]+) à ([\d,]+)\. Quel est l'écart interquartile/i, (a, b) => b - a);
  T(null, /Q_?1 = ([\d,]+) et Q_?3 = ([\d,]+)\. On considère comme « valeur extrême » toute valeur supérieure à Q_?3 \+ 1,5 · \(Q_?3 - Q_?1\)/i, (a, b) => b + 1.5 * (b - a));
  T(null, /Sur ([\d']+) (?:apprentis interrogés|réponses à un sondage|personnes interrogées|élèves interrogés), ([\d']+) [^.]*\. Quelle est la fréquence \(en %\)/i, (n, k) => (k / n) * 100);
  T(null, /Dans un sondage auprès de ([\d']+) personnes, ([\d,]+) ?% ont répondu « oui »\. Combien de personnes/i, (n, p) => (n * p) / 100);
  T(null, /Dans un diagramme circulaire, un secteur mesure ([\d,]+)°\. Quelle fréquence \(en %\)/i, (a) => (a / 360) * 100);
  T(null, /Sur ([\d']+) personnes interrogées, ([\d']+) ont choisi la réponse A\. Dans un diagramme circulaire, quel est l'angle/i, (n, k) => (k / n) * 360);
  T(null, /Un diagramme circulaire représente les ([\d']+) élèves d'une école\. Le secteur « vélo » mesure ([\d,]+)°\. Combien d'élèves/i, (n, a) => (n * a) / 360);
  T(null, /D ?\[AB\], E ?\[AC\],? AD = ([\d,]+), AE = ([\d,]+) et AC = ([\d,]+)\. Quelle longueur AB faut-il/i, (ad, ae, ac) => (ad * ac) / ae);
  T(null, /AD = ([\d,]+), AB = ([\d,]+) et AE = ([\d,]+)(?: \(en cm\))?\. Quelle (?:longueur AC faut-il|doit être AC)/i, (ad, ab, ae) => (ae * ab) / ad);
  T(null, /D ?\[AB\],? E ?\[AC\],? AD = ([\d,]+), DB = ([\d,]+), AE = ([\d,]+)\. Quelle longueur EC faut-il/i, (ad, db, ae) => (ae * db) / ad);
  T(null, /avec AD = ([\d,]+), AB = ([\d,]+), AE = ([\d,]+), AC = ([\d,]+)\. Calcule AD · AC - AE · AB/i, (ad, ab, ae, ac) => ad * ac - ae * ab);
  T(null, /AD = ([\d,]+), AB = ([\d,]+), AE = ([\d,]+), AC = ([\d,]+) et BC = ([\d,]+)\. Montre que \(DE\) ?\(BC\), puis calcule DE/i, (ad, ab, ae, ac, bc) => (bc * ad) / ab);
  T(null, /se coupent en A\. AD = ([\d,]+), AB = ([\d,]+), AE = ([\d,]+), AC = ([\d,]+) et DE = ([\d,]+)\. Vérifie que \(DE\) ?\(BC\), puis calcule BC/i, (ad, ab, ae, ac, de) => (de * ab) / ad);
  T(null, /Un triangle a pour côtés ([\d,]+) cm, ([\d,]+) cm et ([\d,]+) cm\. Est-il rectangle \? Pour le savoir, calcule de combien le carré du plus grand côté dépasse la somme des carrés/i, (a, b, c) => { const s = [a, b, c].sort((u, v) => u - v); return s[2] ** 2 - s[0] ** 2 - s[1] ** 2; });
  T(null, /Un triangle a pour côtés ([\d,]+) ?c?m?, ([\d,]+) ?c?m? et ([\d,]+) ?c?m?\.(?: Pour savoir s'il est rectangle,)? [Cc]alcule la somme des carrés des deux plus petits côtés/i, (a, b, c) => { const s = [a, b, c].sort((u, v) => u - v); return s[0] ** 2 + s[1] ** 2; });
  T(null, /Un cadre rectangulaire doit mesurer ([\d,]+) cm sur ([\d,]+) cm\. [^.]*\. Quelle devrait être la diagonale/i, (a, b) => Math.hypot(a, b));
  T(null, /un triangle de côtés ([\d,]+) cm, ([\d,]+) cm et x cm soit rectangle, x étant le plus grand côté/i, (a, b) => Math.hypot(a, b));

  /* ---------- application ---------- */
  function ruleFor(x, txt) {
    for (const r of RULES) {
      if (r.ids && !r.ids.has(x.id)) continue;
      if (!r.f) continue;
      const m = r.re.exec(txt); if (!m) continue;
      const res = r.o.text ? r.f(txt) : r.o.raw ? r.f(...m.slice(1)) : r.f(...m.slice(1).map(num));
      if (res === null || res === undefined) continue;
      return [r.re.source.slice(0, 60), typeof res === "number" ? { v: res } : res];
    }
    return null;
  }
  /* item : { id, code, raw, txt, sol, spec, parts: [{label, spec}] } → liste de { rule, msg|null } */
  function check(x) {
    const out = [];
    if (x.spec) for (const g of G) {
      let res; try { res = g.f(x); } catch (e) { res = null; }
      if (!res) continue;
      const sp = x.spec;
      if ("v" in res) out.push({ rule: g.name, msg: cmpValue(x, sp, res, x.txt) });
      else if ("set" in res) {
        if (sp.kind === "set") {
          if (sp.all || res.all) out.push({ rule: g.name, msg: sp.all && res.all ? null : sp.all ? "« tous les nombres » attendu, racines trouvées : " + res.set.slice(0, 12).map(fmt).join(" ; ") : "équation vraie pour tout x, attendu {" + sp.values.map(fmt).join(" ; ") + "}" });
          else {
            const W = [...new Set(sp.values)], near = (u, w) => Math.abs(u - w) <= 1e-4 * Math.max(1, Math.abs(w));
            const isRoot = (v) => { const [a, b] = res.f(v); return isFinite(a) && isFinite(b) && Math.abs(a - b) <= 1e-6 * (1 + Math.abs(a) + Math.abs(b)); };
            const Win = W.filter((v) => Math.abs(v) < 199.9), ok = W.every(isRoot) && res.set.every((u) => W.some((v) => near(u, v))) && Win.every((v) => res.set.some((u) => near(u, v)));
            out.push({ rule: g.name, msg: ok ? null : "attendu {" + sp.values.map(fmt).join(" ; ") + "}, racines {" + res.set.slice(0, 12).map(fmt).join(" ; ") + "}" });
          }
        } else if (sp.kind === "value") {
          if (res.all) { out.push({ rule: g.name, msg: "équation vraie pour tout x, une valeur attendue (" + fmt(sp.value) + ")" }); continue; }
          const [a, b] = res.f(sp.value), isR = isFinite(a) && isFinite(b) && Math.abs(a - b) <= 1e-6 * (1 + Math.abs(a) + Math.abs(b));
          if (res.set.length === 0 && Math.abs(sp.value) >= 199.9 && isR) out.push({ rule: g.name, msg: null });
          else if (res.set.length !== 1) out.push({ rule: g.name, msg: "une valeur attendue (" + fmt(sp.value) + "), racines {" + res.set.slice(0, 12).map(fmt).join(" ; ") + "}" });
          else out.push({ rule: g.name, msg: cmpValue(x, sp, { v: res.set[0] }, x.txt) });
        } else continue;
      } else if ("pair" in res) {
        if (!res.pair) continue;
        out.push({ rule: g.name, msg: res.pair.every((v, i) => sameSet([sp.values[i]], [v])) ? null : "attendu (" + sp.values.map(fmt).join(" ; ") + "), Cramer (" + res.pair.map(fmt).join(" ; ") + ")" });
      } else if ("ineq" in res) {
        const want = (t) => sp.ivs.some(([a, ai, b, bi]) => { a = a === null || !isFinite(a) ? -Infinity : a; b = b === null || !isFinite(b) ? Infinity : b; return (t > a || (ai && Math.abs(t - a) < 1e-9)) && (t < b || (bi && Math.abs(t - b) < 1e-9)); });
        const T0 = [], TB = []; for (let t = -60; t <= 60; t += 0.37) T0.push(t);
        for (const [a, , b] of sp.ivs) for (const e of [a, b]) if (e !== null && isFinite(e)) { TB.push(e); T0.push(e - 1e-3, e + 1e-3); }
        for (const e of res.pts) T0.push(e - 1e-3, e + 1e-3); /* racines approchées : seulement de part et d'autre */
        const bad = T0.find((t) => res.ineq(t) !== want(t)) ?? TB.find((t) => res.ineq(t, true) !== want(t));
        out.push({ rule: g.name, msg: bad === undefined ? null : "ensemble attendu " + JSON.stringify(sp.ivs) + " faux en x = " + fmt(bad) + " (inéquation " + (res.ineq(bad, true) ? "vraie" : "fausse") + ")" });
      } else if ("deriv" in res) {
        let T2; try { T2 = Expr.parse(sp.expr); } catch (e) { out.push({ rule: g.name, msg: "réponse attendue illisible : " + sp.expr }); continue; }
        const P = [-2.3, -1.1, 0.7, 1.6, 2.9, 3.4].filter((t) => isFinite(res.deriv({ x: t })) && isFinite(Expr.evaluate(T2, { x: t })));
        const bad = P.find((t) => { const h = 1e-4, d = (res.deriv({ x: t + h }) - res.deriv({ x: t - h })) / (2 * h), w = Expr.evaluate(T2, { x: t }); return Math.abs(d - w) > 1e-5 * Math.max(1, Math.abs(w)); });
        out.push({ rule: g.name, msg: P.length < 3 ? null : bad === undefined ? null : "f'(x) attendue " + sp.expr + " ≠ dérivée de f en x = " + bad });
      } else if ("expr" in res) {
        let T2; try { T2 = Expr.parse(sp.expr); } catch (e) { out.push({ rule: g.name, msg: "réponse attendue illisible : " + sp.expr }); continue; }
        out.push({ rule: g.name, msg: Expr.equivalent(T2, res.expr, sp.pos) ? null : "réponse attendue " + sp.expr + " ≠ expression de l'énoncé" });
      }
      break;
    }
    if (!out.length && x.spec && x.spec.kind === "value") {
      const r = ruleFor(x, x.txt);
      if (r) out.push({ rule: r[0], msg: cmpValue(x, x.spec, r[1], x.txt) });
    }
    for (const p of x.parts || []) if (p.spec && p.spec.kind === "value") {
      const r = ruleFor(x, x.txt + " ¶ " + p.label);
      if (r) out.push({ rule: r[0], msg: cmpValue(x, p.spec, r[1], p.label) });
    }
    return out;
  }
  return { check, truncSpec, tex2e, roots, rounding, solHas, RULES, fmt };
})();
