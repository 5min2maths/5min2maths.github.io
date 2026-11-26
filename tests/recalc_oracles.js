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
      .replace(/\\mathrm\{e\}/g, "e").replace(/\\[lr]?vert|\\mid/g, "|");
    for (let k = 0; k < 6 && /\|[^|]*\|/.test(s); k++) s = s.replace(/\|([^|]*)\|/, "sqrt(($1)^2)"); /* valeur absolue (26.11) */
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
    const s0 = String(sol).replace(/(\d)'(?=\d{3})/g, "$1"), s = s0.replace(/(\d) (?=\d{3}\b)/g, "$1");
    const C = [];
    let m;
    const RE = /(-|−)?\d+(?:,\d+)?(?:\s*·\s*10\^\(?(-?\d+)\)?)?/g;
    /* 26.11 : « 21 : 133 » devient « 21 133 » en texte lisible ; on lit aussi les nombres sans fusionner les blocs de 3 chiffres */
    for (const t of s0.match(/(?:^|[^\d,])(\d+(?:,\d+)?)(?![\d,])/g) || []) { const u = t.replace(/^[^\d]/, ""); C.push([num(u), (u.split(",")[1] || "").length, false]); }
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
      const z = saisie(sp, res.v, st, r, ask); if (z) return z;
    } else {
      if (sp.round ? !ok(res.v) : !Expr.sameValue(sp.value, res.v, 1e-7)) return "attendu " + fmt(sp.value) + (sp.round ? " (±" + sp.round / 2 + ")" : "") + ", recalcul " + fmt(res.v);
      if (res.sol !== false && !solHas(item.sol, res.v, sp.round, item.rawSol)) return "corrigé sans la valeur finale " + fmt(res.v);
      const z = saisie(sp, res.v, sp.round, sp.round ? roundTo(res.v, sp.round, 0) : null, ask); if (z) return z;
    }
    return null;
  }
  /* ---------- la saisie accepte-t-elle les écritures justes ? (26.11) ----------
     Avec la réponse attendue complète (formes exigées : plain, radical, final, sci) : l'arrondi annoncé tapé avec la
     virgule, la fraction irréductible (« fraction acceptée », ou décimal illimité), kπ, a√b quand la valeur en est un. */
  const ratOf = (v, Q = 120) => { for (let q = 1; q <= Q; q++) { const p = Math.round(v * q); if (Math.abs(p / q - v) <= 1e-9 * Math.max(1, Math.abs(v))) return [p, q]; } return null; };
  const termQ = (q) => { while (q % 2 === 0) q /= 2; while (q % 5 === 0) q /= 5; return q === 1; };
  const fr = ([p, q]) => (q === 1 ? String(p) : p + "/" + q);
  function saisie(sp, v, st, r, ask) {
    if (!sp || sp.kind !== "value" || sp.sci) return null;
    const tryIt = (inp) => { let c; try { c = checkAnswer(sp, inp); } catch (e) { c = { status: "exception " + e.message }; } return c.status === "correct" ? null : "saisie : « " + inp + " » refusée (" + c.status + (c.message ? " : " + c.message : "") + ")"; };
    const exact = /valeur exacte|fraction|écris par exemple 3√|avec π|touche √/i.test(ask);
    if (st) return exact ? null : tryIt(fmt(r).replace(".", ","));
    const R = ratOf(v);
    if (R) {
      if (R[1] === 1 || termQ(R[1])) { const m = tryIt(fmt(v).replace(".", ",")); if (m && !(R[1] > 1 && /fraction/i.test(ask))) return m; }
      if (R[1] > 1 && !termQ(R[1])) return sp.plain ? "réponse attendue " + fmt(v) + " (fraction " + fr(R) + ") mais la saisie n'accepte qu'un décimal (plain)" : tryIt(fr(R));
      if (R[1] > 1 && /fraction/i.test(ask) && !sp.plain) return tryIt(fr(R));
      return null;
    }
    const P = ratOf(v / PI, 24); if (P && P[0]) return tryIt((P[0] === 1 ? "" : P[0] === -1 ? "-" : P[0]) + "π" + (P[1] > 1 ? "/" + P[1] : ""));
    for (const n of SQF) { const S = ratOf(v / Math.sqrt(n), 24); if (S && S[0]) return tryIt((Math.abs(S[0]) === 1 ? (S[0] < 0 ? "-" : "") : S[0]) + "√" + n + (S[1] > 1 ? "/" + S[1] : "")); }
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
      } else if (isFinite(yPrev) && isFinite(y0) && isFinite(y1) && Math.abs(y0) < Math.abs(yPrev) && Math.abs(y0) <= Math.abs(y1)) { /* ≤ : racine double à mi-chemin de deux pas (26.11) */
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

  /* « Lequel / Combien de ces nombres est (sont) solution(s) de … ? a ; b ; c » (eqverif, 26.11) : chaque proposition est
     substituée ; « Lequel » exige exactement une solution parmi les propositions (sinon la question est ambiguë). */
  G.push({ name: "vérification", f(x) {
    const m = /^(Lequel|Combien) de ces nombres (?:est|sont) solutions? de (?:l'équation )?\\\(([\s\S]+?)\\\)\s*\?([\s\S]*)$/.exec(x.raw);
    if (!m || x.spec.kind !== "value") return null;
    let f; try { f = eqFun(m[2]); } catch (e) { return null; }
    if (!f) return null;
    let C = math(m[3]); if (!C.length) C = m[3].replace(/<[^>]*>/g, " ").trim().split(/[\s;]+/).filter(Boolean);
    let vals; try { vals = C.map(ev); } catch (e) { return null; }
    if (vals.length < 2 || vals.some((v) => !isFinite(v))) return null;
    const isR = (v) => { const [a, b] = f(v); return isFinite(a) && isFinite(b) && Math.abs(a - b) <= 1e-9 * (1 + Math.abs(a) + Math.abs(b)); };
    const S = vals.filter(isR);
    if (m[1] === "Combien") return { v: S.length };
    if (S.length !== 1) return { err: "propositions " + vals.map(fmt).join(" ; ") + " : " + S.length + " solution(s) au lieu d'une" };
    return { v: S[0] };
  } });
  /* « Résous sin(2x) = … pour 0° ≤ x < 360° » (trigeq, 26.11) : toutes les solutions de l'intervalle, en degrés (ou en
     radians sur [0 ; 2π[), cherchées numériquement (changements de signe, minima isolés pour sin x = ±1). */
  G.push({ name: "équation trigonométrique", f(x) {
    if (!x.spec || x.spec.kind !== "set" || !/^Résous/.test(x.raw)) return null;
    const m = /^Résous\s*:?\s*\\\(([\s\S]+?)\\\),? (?:pour|sur|dans) \\\((?:0\s*°?\s*\\leq?\s*x\s*<\s*(360\s*°?|2\s*\\pi)|\[0\s*;\s*(360\s*°?|2\s*\\pi)\s*\[)\\\)/.exec(x.raw);
    if (!m || !/\\(sin|cos|tan)/.test(m[1])) return null;
    const deg = /360/.test(m[2] || m[3]), P = deg ? 360 : 2 * PI;
    let t = m[1].replace(/\\(sin|cos|tan)\^\{?2\}?\s*(\([^()]*\)|[a-z])/g, "(\\$1($2))^2").replace(/\\(sin|cos|tan)\s*(?!\s*\()(\d*\s*[a-z])/g, "\\$1($2)");
    const parts = tex2e(t).replace(/°/g, "*π/180").replace(/\^\s*\\circ|\\circ/g, "*π/180").split("=");
    if (parts.length !== 2) return null;
    let A, B; try { A = Expr.parse(parts[0]); B = Expr.parse(parts[1]); } catch (e) { return null; }
    if ([...new Set([...Expr.vars(A), ...Expr.vars(B)])].some((v) => v !== "x")) return null;
    const fa = compile(A), fb = compile(B), k = deg ? PI / 180 : 1, sc = P / 36.2; /* balayage de [−0,1 ; 1,005]·P en 3'620 pas */
    const g = (X) => [fa({ x: X * k }), fb({ x: X * k })], gu = (u) => g(u * sc + P / 2);
    const rs = roots(gu, 18.1);
    if (!rs) return null;
    const S = []; for (const ru of rs) { const r = +(ru * sc + P / 2).toFixed(7), v = Math.abs(r) < 1e-6 ? 0 : r; if (v >= 0 && v < P - 1e-6 && !S.some((u) => Math.abs(u - v) < 1e-5)) S.push(v); }
    return { set: S.sort((a, b) => a - b), f: g };
  } });

  /* « Calcule : 4y · 9y » (monômes, 26.11) : réponse attendue de type expression égale à l'expression affichée ;
     « Trouve le monôme M … tel que M^2 = … » / « M · a = b » ; « … écrit : « A = B ». Trouve l'erreur » : A */
  G.push({ name: "monômes", f(x) {
    if (!x.spec || x.spec.kind !== "expr") return null;
    let m = /^Calcule\s*:\s*\\\(([^=]+?)\\\)\.?\s*$/.exec(x.raw);
    if (m) { try { return { expr: Expr.parse(tex2e(m[1])) }; } catch (e) { return null; } }
    m = /écrit : « \\\(([^=]+?)=[^)]*\\\) »\. Trouve l'erreur, puis donne le bon (?:produit|résultat)/.exec(x.raw);
    if (m) { try { return { expr: Expr.parse(tex2e(m[1])) }; } catch (e) { return null; } }
    m = /monôme M[^\\]*\\\(M\^2 = ([^)]+?)\\\)/.exec(x.raw);
    if (m) { try { const R = Expr.parse(tex2e(m[1])), E = Expr.parse(x.spec.expr); return { err: Expr.equivalent(Expr.parse("(" + x.spec.expr + ")^2"), R) && /^\d/.test(x.spec.expr) ? null : "M = " + x.spec.expr + " : M² ≠ " + m[1], ok: true }; } catch (e) { return null; } }
    m = /monôme M[^\\]*\\\(M \\cdot ([^=]+?) = ([^)]+?)\\\)/.exec(x.raw);
    if (m) { try { const R = Expr.parse(tex2e(m[2])); return { err: Expr.equivalent(Expr.parse("(" + x.spec.expr + ")*(" + tex2e(m[1]) + ")"), R) ? null : "M = " + x.spec.expr + " : M · " + m[1] + " ≠ " + m[2] }; } catch (e) { return null; } }
    return null;
  } });

  /* « Écris 0,2\overline{7} sous forme de fraction » (26.11) : valeur exacte du nombre périodique */
  G.push({ name: "périodique", f(x) {
    const m = /^Écris (?:le nombre )?(?:périodique )?\\\((-?\d+)\{,\}(\d*)\\overline\{(\d+)\}\\\)/.exec(x.raw);
    if (!m || x.spec.kind !== "value") return null;
    const [, e, pre, per] = m, p = pre.length, l = per.length;
    const v = Math.abs(+e) + (+(pre + per) - +(pre || 0)) / ((10 ** l - 1) * 10 ** p);
    return { v: +e < 0 || /^-/.test(e) ? -v : v, st: null };
  } });

  /* Domaine de définition (26.11) : appartenance point par point (f calculable), pôles et bords des racines vérifiés exactement */
  G.push({ name: "domaine", f(x) {
    if (!x.spec || x.spec.kind !== "solset") return null;
    const m = /domaine de définition de \\\(f\(x\) = ([\s\S]+?)\\\)/.exec(x.raw); if (!m) return null;
    let F; try { F = Expr.parse(tex2e(m[1])); } catch (e) { return null; }
    if ([...Expr.vars(F)].some((v) => v !== "x")) return null;
    const f = compile(F), ex = [];
    const walk = (n) => { if (!n || typeof n !== "object") return; if (n.t === "div" || (n.t === "fn" && (n.f === "sqrt" || n.f === "ln" || n.f === "log"))) { const g = compile(n.t === "div" ? n.b : n.a), r = roots((t) => [g({ x: t }), 0], 100); if (r) ex.push(...r); } walk(n.a); walk(n.b); };
    walk(F);
    return { ineq: (t) => isFinite(f({ x: t })), pts: ex, exact: ex };
  } });
  /* Paraboles (f2, f2expr, f2trois, 26.11) : sommet, zéros, extremum, expression à partir des conditions de l'énoncé */
  const quad = (F) => { const f = compile(F), c = f({ x: 0 }), p = f({ x: 1 }), q = f({ x: -1 }), a = (p + q) / 2 - c, b = (p - q) / 2; return Math.abs(f({ x: 2.5 }) - (a * 6.25 + b * 2.5 + c)) < 1e-9 * (1 + Math.abs(c)) && a ? [a, b, c] : null; };
  const solve3 = (P) => { const [[x1, y1], [x2, y2], [x3, y3]] = P, D = (x1 - x2) * (x1 - x3) * (x2 - x3); if (!D) return null;
    const a = (x3 * (y2 - y1) + x2 * (y1 - y3) + x1 * (y3 - y2)) / D, b = (x3 * x3 * (y1 - y2) + x2 * x2 * (y3 - y1) + x1 * x1 * (y2 - y3)) / D; return [a, b, y1 - a * x1 * x1 - b * x1]; };
  const PT = String.raw`\(\s*([−-]?\d+(?:,\d+)?)\s*;\s*([−-]?\d+(?:,\d+)?)\s*\)`;
  const pts = (t) => [...t.matchAll(new RegExp(PT, "g"))].map((m) => [num(m[1]), num(m[2])]);
  const qexpr = ([a, b, c]) => ({ expr: Expr.parse(a + "*x^2+(" + b + ")*x+(" + c + ")") });
  G.push({ name: "parabole", f(x) {
    const t = x.txt, sp = x.spec; let m, Q = null;
    const fm = /(?:parabole |zéros de |(?:minimale|maximale) de )\\\((?:f\(x\)|y) = ([\s\S]+?)\\\)/.exec(x.raw);
    if (fm && !/a\(x|ax\^2/.test(fm[1])) { try { const F = Expr.parse(tex2e(fm[1])); if ([...Expr.vars(F)].every((v) => v === "x")) Q = quad(F); } catch (e) {} }
    if (Q) {
      const [a, b, c] = Q, h = -b / (2 * a), k = c - (b * b) / (4 * a);
      if (/sommet/.test(t) && sp.kind === "pair") return { pair: [h, k] };
      if (/valeur (?:minimale|maximale)/.test(t) && sp.kind === "value") return /minimale/.test(t) === a > 0 ? { v: k, st: null } : { err: "extremum demandé de la mauvaise nature (a = " + fmt(a) + ")" };
      if (/ordonnée à l'origine/.test(t) && sp.kind === "value") return { v: c, st: null };
      if (/zéros/.test(t) && sp.kind === "set") { const g = (u) => [a * u * u + b * u + c, 0], r = roots(g); return r ? { set: r, f: g } : null; }
      return null;
    }
    if ((m = /Pour quelle valeur de c la parabole y = (-?\d*)x\^2 ([+-] \d+)x \+ c touche-t-elle l'axe des x en un seul point/.exec(t))) { const a = m[1] === "" ? 1 : m[1] === "-" ? -1 : +m[1], b = num(m[2].replace(/ /g, "")); return { v: (b * b) / (4 * a), st: null }; }
    if ((m = new RegExp("sommet S" + PT + " et coefficient a = ([−-]?\\d+(?:,\\d+)?)\\. Quels sont ses zéros").exec(t)) && sp.kind === "set") { const h = num(m[1]), k = num(m[2]), a = num(m[3]), g = (u) => [a * (u - h) ** 2 + k, 0], r = roots(g); return r ? { set: r, f: g } : null; }
    /* expression à partir des conditions */
    if ((m = new RegExp("sommet S" + PT + " et pour coefficient dominant a = ([−-]?\\d+(?:,\\d+)?)").exec(t))) { const h = num(m[1]), k = num(m[2]), a = num(m[3]); Q = [a, -2 * a * h, a * h * h + k]; }
    else if ((m = /pour zéros ([−-]?\d+(?:,\d+)?) et ([−-]?\d+(?:,\d+)?), et pour coefficient dominant ([−-]?\d+(?:,\d+)?)/.exec(t))) { const [p, q, a] = [m[1], m[2], m[3]].map(num); Q = [a, -a * (p + q), a * p * q]; }
    else if ((m = new RegExp("sommet S" + PT + " et passe par P" + PT).exec(t))) { const [h, k, u, w] = [1, 2, 3, 4].map((i) => num(m[i])), a = (w - k) / (u - h) ** 2; Q = [a, -2 * a * h, a * h * h + k]; }
    else if ((m = new RegExp("pour zéros ([−-]?\\d+(?:,\\d+)?) et ([−-]?\\d+(?:,\\d+)?) et passe par P" + PT).exec(t))) { const [p, q, u, w] = [1, 2, 3, 4].map((i) => num(m[i])), a = w / ((u - p) * (u - q)); Q = [a, -a * (p + q), a * p * q]; }
    else if ((m = /pour zéros ([−-]?\d+(?:,\d+)?) et ([−-]?\d+(?:,\d+)?), et sa valeur (minimale|maximale) est ([−-]?\d+(?:,\d+)?)/.exec(t))) { const p = num(m[1]), q = num(m[2]), e = num(m[4]), h = (p + q) / 2, a = e / ((h - p) * (h - q)); if ((a > 0) !== (m[3] === "minimale")) return { err: "valeur " + m[3] + " impossible (a = " + fmt(a) + ")" }; Q = [a, -a * (p + q), a * p * q]; }
    else if ((m = /coupe l'axe des x en ([−-]?\d+(?:,\d+)?) et ([−-]?\d+(?:,\d+)?), et l'axe des y en ([−-]?\d+(?:,\d+)?)/.exec(t))) { const [p, q, c] = [1, 2, 3].map((i) => num(m[i])), a = c / (p * q); Q = [a, -a * (p + q), c]; }
    else if ((m = /axe de symétrie la droite x = ([−-]?\d+(?:,\d+)?), coupe l'axe des y en ([−-]?\d+(?:,\d+)?) et passe par \(\s*([−-]?\d+(?:,\d+)?)\s*;\s*([−-]?\d+(?:,\d+)?)\s*\)/.exec(t))) { const [s, c, u, w] = [1, 2, 3, 4].map((i) => num(m[i])), a = (w - c) / (u * u - 2 * s * u); Q = [a, -2 * a * s, c]; }
    else if (/passe par \(/.test(t) && pts(t.split(/\.|Que vaut|Calcule|Quel/)[0] + ".").length === 3) Q = solve3(pts(t.split(/\.|Que vaut|Calcule|Quel/)[0] + "."));
    else if ((m = /vaut ([\d,]+) au départ, ([\d,]+) après 1 s et ([\d,]+) après 2 s.*hauteur après ([\d,]+) s/.exec(t))) { const q = solve3([[0, num(m[1])], [1, num(m[2])], [2, num(m[3])]]); return q && { v: q[0] * num(m[4]) ** 2 + q[1] * num(m[4]) + q[2], st: null }; }
    if (!Q || !Q.every(isFinite)) return null;
    const [a, b, c] = Q;
    if (sp.kind === "expr") return qexpr(Q);
    if (sp.kind === "pair" && /sommet/.test(t)) return { pair: [-b / (2 * a), c - (b * b) / (4 * a)] };
    if (sp.kind === "value" && (m = /Que vaut ([abc]) \?/.exec(t))) return { v: { a, b, c }[m[1]], st: null };
    if (sp.kind === "value" && (m = /Calcule f\(([−-]?\d+)\)/.exec(t))) { const u = num(m[1]); return { v: a * u * u + b * u + c, st: null }; }
    return null;
  } });
  /* « Détermine le zéro de f(x) = … » (affzero) */
  G.push({ name: "zéro", f(x) {
    if (x.spec.kind !== "value") return null;
    const m = /^Détermine le zéro de \\\(f\(x\) = ([\s\S]+?)\\\)/.exec(x.raw); if (!m) return null;
    let F; try { F = Expr.parse(tex2e(m[1])); } catch (e) { return null; }
    if ([...Expr.vars(F)].some((v) => v !== "x")) return null;
    const f = compile(F), g = (u) => [f({ x: u }), 0], r = roots(g); return r ? { set: r, f: g } : null;
  } });

  /* Inéquations du 1er degré à réponse « x > a » (spec ineq, affzero, 26.11) : ensemble comparé point par point */
  G.push({ name: "inéquation x > a", f(x) {
    if (!x.spec || x.spec.kind !== "ineq") return null;
    const S = math(x.raw), fx = (n) => { const u = S.find((t) => new RegExp("^\\s*" + n + "\\(x\\) = ").test(t)); return u && u.split("=").slice(1).join("="); };
    let L, R, op, m;
    if ((m = /a-t-on \\\(f\(x\) (>|<|\\geq?|\\leq?) (0|g\(x\))\\\)/.exec(x.raw))) { L = fx("f"); R = m[2] === "0" ? "0" : fx("g"); op = m[1]; }
    else if (/^Résous/.test(x.raw)) { const u = S.find((t) => /\\le|\\ge|<|>/.test(t)); if (!u) return null; const p = u.split(/(\\leq?|\\geq?|<|>)/); if (p.length !== 3) return null; [L, op, R] = p; }
    if (!L || !R) return null;
    let A, B; try { A = compile(Expr.parse(tex2e(L))); B = compile(Expr.parse(tex2e(R))); } catch (e) { return null; }
    const o = op.replace(/\\leq?/, "≤").replace(/\\geq?/, "≥");
    const cmp = (a, b, Lb) => { const e = Lb ? 1e-9 * (1 + Math.abs(a) + Math.abs(b)) : 0; return o === "<" ? a < b - e : o === ">" ? a > b + e : o === "≤" ? a <= b + e : a >= b - e; };
    const r = roots((t) => [A({ x: t }), B({ x: t })], 100);
    return { ineq: (t, Lb) => cmp(A({ x: t }), B({ x: t }), Lb), pts: r || [] };
  } });

  /* « Dans la formule … , exprime v en fonction des autres lettres » (formule, 26.11) : la réponse attendue, substituée
     dans la formule, la vérifie pour des valeurs positives quelconques des autres lettres */
  G.push({ name: "formule", f(x) {
    if (!x.spec || x.spec.kind !== "expr") return null;
    const m = /Dans la formule \\\(([^]*?)\\\),? (?:exprime \\\(([a-zA-Z])\\\)|exprime ([a-zA-Z]) |[A-ZÉ]\S+ isole \\\(([a-zA-Z])\\\)|[A-ZÉ]\S+ isole ([a-zA-Z]) )/.exec(x.raw);
    if (!m || !/=/.test(m[1])) return null;
    const v = (m[2] || m[3] || m[4] || m[5]).toLowerCase(), lets = m[1].replace(/\\[a-zA-Z]+/g, "").match(/[a-zA-Z]/g) || [];
    if (new Set(lets).size !== new Set(lets.map((c) => c.toLowerCase())).size) return null; /* même lettre en majuscule et minuscule */
    const [L, R] = tex2e(m[1]).split("=");
    let A, B, E; try { A = Expr.parse(L); B = Expr.parse(R); E = Expr.parse(x.spec.expr); } catch (e) { return null; }
    const vs = [...new Set([...Expr.vars(A), ...Expr.vars(B)])].filter((u) => u !== v);
    if ([...Expr.vars(E)].includes(v)) return { err: "la réponse attendue " + x.spec.expr + " contient encore " + v };
    let n = 0;
    for (let i = 0; i < 6; i++) {
      const env = {}; vs.forEach((u, j) => (env[u] = 1.3 + ((i * 7 + j * 3) % 11) * 0.41 + j * 0.13));
      const val = Expr.evaluate(E, env); if (!isFinite(val)) continue;
      env[v] = val; const a = Expr.evaluate(A, env), b = Expr.evaluate(B, env);
      if (!isFinite(a) || !isFinite(b)) continue; n++;
      if (Math.abs(a - b) > 1e-8 * (1 + Math.abs(a) + Math.abs(b))) return { err: v + " = " + x.spec.expr + " ne vérifie pas la formule " + m[1] };
    }
    return n >= 3 ? { err: null } : null;
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

  /* ========== extension du 26.11 (agent/recalc2) : volumes composés et manquants, Pythagore en figure, conversions,
     fractions (simplifier, comparer, périodiques, d'une quantité), périmètres et aires, grandeurs manquantes ========== */
  /* Q`…` : gabarit en expression régulière brute ; # = un nombre, ~ = une unité de longueur facultative */
  const RX = (src) => new RegExp(src.replace(/#/g, NUM).replace(/~/g, "(?: ?(?:km|hm|dam|m|dm|cm|mm))?"), "i");
  const Q = (s, ...v) => RX(s.raw ? String.raw(s, ...v) : s[0]);
  const FR = String.raw`\((\d+)\)\/\((\d+)\)`; /* fraction (a)/(b) du texte lisible */
  const F = (s, ...v) => RX(String.raw(s, ...v).replace(/§F/g, FR));

  /* --- volumes composés (volcomp, voldecomp) --- */
  T(null, Q`formé d'un cube d'arête # ~, surmonté d'une pyramide de même base et de hauteur # ~`, (a, h) => a ** 3 + (a * a * h) / 3);
  T(null, Q`formée? d'un pavé (?:droit )?de # ~ × # ~ × # ~, surmonté d'un toit en prisme dont la base est un triangle de base # ~ et de hauteur # ~ \(sur toute la longueur # ~\)`, (a, b, c, tb, th, l) => a * b * c + ((tb * th) / 2) * l);
  T(null, Q`la forme d'un pavé droit de # ~ de long, # ~ de large et # ~ de haut, surmonté d'un toit en forme de prisme dont la base est un triangle de base # ~ et de hauteur # ~`, (L, l, h, tb, th) => L * l * h + ((tb * th) / 2) * L);
  T(null, Q`formé d'un cylindre de rayon # ~ et de hauteur # ~, surmonté d'un cône de même base et de hauteur # ~`, (r, h, k) => PI * r * r * h + (PI * r * r * k) / 3);
  T(null, Q`formé d'un cylindre de rayon # ~ et de hauteur # ~, surmonté d'une demi-boule de même rayon`, (r, h) => PI * r * r * h + (2 / 3) * PI * r ** 3);
  T(null, Q`cylindre terminé par deux demi-boules\. Son diamètre est # ~ et sa longueur totale # ~`, (d, L) => (4 / 3) * PI * (d / 2) ** 3 + PI * (d / 2) ** 2 * (L - d));
  T(null, Q`trou cylindrique de rayon # ~ de part en part dans un cube d'arête # ~`, (r, a) => a ** 3 - PI * r * r * a);
  T(null, Q`dans un cube d'arête # ~ la plus grande pyramide possible[^?]*\. Quel volume de matière enlève-t-on`, (a) => (2 / 3) * a ** 3);
  T(null, Q`face avant est un triangle isocèle de base # ~ et de côtés # ~ ; la tente est longue de # ~`, (b, c, l) => ((b * Math.sqrt(c * c - (b / 2) ** 2)) / 2) * l);
  T(null, Q`un cône de rayon # ~ et de hauteur # ~, rempli et surmonté d'une demi-boule de glace de même rayon`, (r, h) => (PI * r * r * h) / 3 + (2 / 3) * PI * r ** 3);
  T(null, Q`D'un pavé droit de # ~ × # ~ × # ~, on enlève un cube de # ~ d'arête`, (a, b, c, k) => a * b * c - k ** 3);
  T(null, Q`deux pavés droits accolés : l'un de # ~ × # ~ × # ~, l'autre de # ~ × # ~ × # ~`, (a, b, c, d, e, f) => a * b * c + d * e * f);
  T(null, /escalier de \d+ marches est formé de \d+ pavés de [\d,]+ dm de large, [\d,]+ dm de profondeur et de hauteurs [\d, cmet]+\. Quel est son volume \(en dm³\)/i, (t) => { const m = /pavés de ([\d,]+) dm de large, ([\d,]+) dm de profondeur et de hauteurs ([\d, cmet]+)\./.exec(t); return num(m[1]) * num(m[2]) * m[3].match(/\d+(?:,\d+)?/g).reduce((s, h) => s + num(h) / 10, 0); }, { text: true });
  T(null, Q`deux bassins de # ~ de profondeur : l'un de # ~ sur # ~, l'autre de # ~ sur # ~`, (p, a, b, c, d) => (a * b + c * d) * p);
  T(null, Q`bloc de béton de # cm × # cm × # cm est traversé de haut en bas par un trou carré de # cm de côté\. Quel est le volume de béton \(en dm³\)`, (a, b, c, t) => ((a * b - t * t) * c) / 1000);
  T(null, Q`la forme d'un cube de # m d'arête\. Combien de litres`, (a) => a ** 3 * 1000);
  T(null, Q`bassin rectangulaire de # m sur # m est rempli d'eau sur une hauteur de # m\. Combien de litres`, (a, b, h) => a * b * h * 1000);
  T(null, F`aquarium de # cm × # cm × # cm est rempli aux §F\. Combien de litres`, (a, b, c, p, q) => (a * b * c * p) / q / 1000);

  /* --- volumes : grandeur manquante (volmanq) --- */
  T(null, Q`pavé droit a un volume de # cm³ et une base de # cm sur # cm\. Quelle est sa hauteur`, (V, a, b) => V / (a * b));
  T(null, Q`cylindre de rayon # ~ a un volume de #π`, (r, V) => V / (r * r));
  T(null, Q`prisme droit a pour base un triangle de base # ~ et de hauteur # ~\. Son volume est # cm³\. Quelle est sa longueur`, (b, h, V) => V / ((b * h) / 2));
  T(null, Q`cône de hauteur # ~ a un volume de #π`, (h, V) => Math.sqrt((3 * V) / h));
  T(null, Q`boule a un volume de #π`, (V) => Math.cbrt((3 * V) / 4));
  T(null, Q`pyramide à base carrée de côté # ~ a un volume de # [a-z]m³\. Quelle est sa hauteur`, (c, V) => (3 * V) / (c * c));
  T(null, Q`boîte cylindrique de rayon # cm doit contenir # (L|dL|cL|mL)\. Quelle doit être sa hauteur \(en cm`, (r, V, u) => (num(V) * { L: 1000, dL: 100, cL: 10, mL: 1 }[u]) / (PI * num(r) ** 2), { raw: true });
  T(null, Q`entonnoir en forme de cône a un diamètre de # ~ et contient #π`, (d, V) => (3 * V) / (d / 2) ** 2);
  T(null, Q`piscine rectangulaire de # m sur # m doit contenir # m³`, (a, b, V) => V / (a * b));

  /* --- Pythagore dans les figures (pythfig) --- */
  T(null, Q`diagonale d'un carré de côté # ~`, (c) => c * Math.SQRT2);
  T(null, Q`diagonale d'un rectangle de # ~ sur # ~`, (a, b) => Math.hypot(a, b));
  T(null, Q`triangle isocèle a deux côtés de # ~ et une base de # ~\. Calcule la hauteur relative à la base`, (a, b) => Math.sqrt(a * a - (b / 2) ** 2));
  T(null, Q`rectangulaire mesure # ~ de large et # ~ de haut\. Calcule sa diagonale`, (a, b) => Math.hypot(a, b));
  T(null, Q`rectangulaire de # ~ sur # ~ est renforcé par une barre en diagonale`, (a, b) => Math.hypot(a, b));
  T(null, Q`hauteur d'un triangle équilatéral de côté # ~`, (c) => (c * Math.sqrt(3)) / 2);
  T(null, Q`pavé droit mesure # ~ × # ~ × # ~\. Calcule la longueur de sa grande diagonale`, (a, b, c) => Math.hypot(a, b, c));
  T(null, Q`grande diagonale d'un cube d'arête # ~`, (a) => a * Math.sqrt(3));
  T(null, Q`pyramide régulière à base carrée a un côté de base de # ~ et des arêtes latérales de # ~\. Calcule sa hauteur`, (c, l) => Math.sqrt(l * l - (c * c) / 2));
  T(null, Q`cône a une génératrice de # ~ et un rayon de # ~\. Calcule sa hauteur`, (g, r) => Math.sqrt(g * g - r * r));
  T(null, Q`cône a un rayon de # ~ et une hauteur de # ~\. Calcule sa génératrice`, (r, h) => Math.hypot(r, h));
  T(null, Q`pyramide régulière à base carrée de côté # ~ et de hauteur # ~\. Calcule son apothème`, (c, h) => Math.hypot(h, c / 2));
  T(null, Q`pavé droit [A-H]{8} a pour dimensions # ~, # ~ et # ~\. Calcule la longueur de la diagonale`, (a, b, c) => Math.hypot(a, b, c));

  /* --- conversions d'unités (ulong, uaire, uvol, umasse, ucomp…) --- */
  const ULEN = { km: 1e3, hm: 1e2, dam: 10, m: 1, dm: 0.1, cm: 0.01, mm: 1e-3, "µm": 1e-6 };
  const UMAS = { t: 1e6, q: 1e5, kg: 1e3, hg: 100, dag: 10, g: 1, dg: 0.1, cg: 0.01, mg: 1e-3 };
  const UCAP = { hl: 100, dal: 10, l: 1, dl: 0.1, cl: 0.01, ml: 1e-3 };
  const UTPS = { j: 86400, h: 3600, min: 60, s: 1, ms: 1e-3 };
  const UNAMES = { mètres: "m", mètre: "m", centimètres: "cm", millimètres: "mm", kilomètres: "km", grammes: "g", kilogrammes: "kg", litres: "L", minutes: "min", secondes: "s", heures: "h" };
  function unit1(u) { /* → [dimension, facteur SI] */
    u = String(u).trim().replace(/²/g, "^2").replace(/³/g, "^3"); u = UNAMES[u] || u;
    let m;
    if ((m = /^([a-zµ]+)\^([23])$/.exec(u)) && ULEN[m[1]]) return [m[2] === "2" ? "A" : "V", ULEN[m[1]] ** +m[2]];
    if (u === "a") return ["A", 100]; if (u === "ha") return ["A", 1e4]; if (u === "ca") return ["A", 1];
    if (ULEN[u]) return ["L", ULEN[u]];
    if (UMAS[u]) return ["M", UMAS[u]];
    if (/^(h|da|d|c|m)?[lL]$/.test(u) && UCAP[u.toLowerCase()]) return ["V", UCAP[u.toLowerCase()] * 1e-3];
    if (UTPS[u]) return ["T", UTPS[u]];
    return null;
  }
  function unitF(u) { /* unités composées : km/h, m^3/h, g/cm^3 */
    const p = String(u).split("/"); if (p.length > 2) return null;
    const a = unit1(p[0]); if (!a) return null; if (p.length === 1) return a;
    const b = unit1(p[1]); if (!b) return null; return [a[0] + "/" + b[0], a[1] / b[1]];
  }
  const conv = (v, u1, u2) => { const a = unitF(u1), b = unitF(u2); return a && b && a[0] === b[0] ? (num(v) * a[1]) / b[1] : null; };
  const UN = String.raw`([a-zA-Zµ]+(?:\^[23]|[²³])?(?:\/[a-zA-Zµ]+(?:\^[23]|[²³])?)?)`;
  T(null, Q([String.raw`^(?:Convertis|Exprime) (?:en [^:]+: )?# ${UN} en ${UN}\s*[.?]?\s*$`]), conv, { raw: true });
  T(null, Q([String.raw`convertit # ${UN} en ${UN} : «[^»]*»\. Trouve l'erreur, puis donne la bonne mesure`]), conv, { raw: true });
  T(null, Q([String.raw`à raison de # ${UN}\. Exprime ce débit en ${UN}\s*\.?$`]), conv, { raw: true });
  T(null, Q`piste d'athlétisme(?: couverte)? mesure # m\. Combien de tours faut-il faire pour courir # km`, (m, k) => (k * 1000) / m);
  T(null, Q`colis de # kg contient un objet de # g ; le reste est l'emballage\. Quelle est la masse de l'emballage, en grammes`, (k, g) => k * 1000 - g);
  T(null, Q([String.raw`^Calcule en (\S+) : # ${UN} ([+−-]) # ${UN}\s*\.?$`]), (u, a, ua, s, b, ub) => { const x = conv(a, ua, UNAMES[u] || u), y = conv(b, ub, UNAMES[u] || u); return x === null || y === null ? null : s === "+" ? x + y : x - y; }, { raw: true });

  /* --- durées (utemps) --- */
  T(null, Q`# h # min[^.,]*,? puis (?:il y a |il faut )?# min[^.]*\. Quelle est la durée totale, en minutes`, (h, m, k) => h * 60 + m + k);
  T(null, Q`# h # min # s\. Combien de secondes`, (h, m, s) => h * 3600 + m * 60 + s);
  T(null, Q`# min # s\. Combien de secondes`, (m, s) => m * 60 + s);
  T(null, Q`# h # min\. Combien de minutes`, (h, m) => h * 60 + m);
  T(null, Q`« # h = # h # min »\. Trouve son erreur, puis donne la bonne durée en minutes`, (x) => x * 60);
  T(null, Q`# h\. Combien de minutes cela fait-il`, (x) => x * 60);
  T(null, Q`^Convertis # h en minutes`, (x) => x * 60);
  T(null, Q`^Écris # min # s en minutes \(nombre décimal\)`, (m, s) => m + s / 60);
  T(null, Q`dure # h # min\. Écris cette durée en heures`, (h, m) => h + m / 60);
  T(null, Q`part à # h # et arrive à # h #\. Combien de minutes dure le voyage`, (a, b, c, d) => c * 60 + d - (a * 60 + b));
  T(null, Q`^Écris # s en heures, minutes et secondes\. Combien de minutes restent après les heures entières`, (s) => Math.floor((s % 3600) / 60));

  /* --- fractions : amplifier, simplifier (fracsimp) --- */
  const irr = (a, b) => { const g = gcd(a, b); return [a / g, b / g]; };
  T(null, F`Par quel nombre a-t-on amplifié §F pour obtenir §F`, (a, b, c, d) => (c / a === d / b ? c / a : NaN));
  T(null, F`Complète : §F = \((\d+)\)\/\(\?\)`, (a, b, c) => (c * b) / a);
  T(null, F`Complète : §F = \(\?\)\/\((\d+)\)`, (a, b, d) => (a * d) / b);
  T(null, F`Par quel nombre faut-il simplifier §F pour la rendre irréductible`, (a, b) => gcd(a, b));
  T(null, F`Rends la fraction §F irréductible\. Quel est le dénominateur`, (a, b) => irr(a, b)[1]);
  T(null, F`Rends la fraction §F irréductible\. Quel est le numérateur`, (a, b) => irr(a, b)[0]);
  const dec2f = (s) => { const [e, d = ""] = String(s).replace("−", "-").split(","); const q = 10 ** d.length; return irr(Math.round(num(s) * q), q); };
  T(null, Q`^Écris # sous forme de fraction irréductible\. Quel est son dénominateur`, (s) => dec2f(s)[1], { raw: true, not: /\\overline/ });
  T(null, Q`^Écris # sous forme de fraction irréductible\. Quel est son numérateur`, (s) => dec2f(s)[0], { raw: true, not: /\\overline/ });

  /* --- fractions : comparer, encadrer (fracrep) --- */
  T(null, F`On range dans l'ordre croissant §F, §F, §F\. Quelle fraction est au milieu`, (a, b, c, d, e, f) => [a / b, c / d, e / f].sort((u, w) => u - w)[1]);
  T(null, F`Quelle est la plus grande de ces deux fractions : §F ou §F`, (a, b, c, d) => Math.max(a / b, c / d));
  T(null, F`Quelle est la plus petite de ces deux fractions : §F ou §F`, (a, b, c, d) => Math.min(a / b, c / d));
  T(null, F`Quelle fraction est la plus proche de 1 : §F ou §F`, (a, b, c, d) => (Math.abs(1 - a / b) < Math.abs(1 - c / d) ? a / b : Math.abs(1 - a / b) > Math.abs(1 - c / d) ? c / d : NaN));
  T(null, F`Combien de nombres entiers sont strictement compris entre §F et §F`, (a, b, c, d) => { const lo = Math.min(a / b, c / d), hi = Math.max(a / b, c / d); let n = 0; for (let k = Math.floor(lo) - 1; k <= hi + 1; k++) if (k > lo && k < hi) n++; return n; });
  T(null, F`La fraction §F est comprise entre deux entiers consécutifs\. Quel est le plus petit`, (a, b) => (a % b ? Math.floor(a / b) : NaN));
  T(null, F`La fraction §F est comprise entre deux entiers consécutifs\. Quel est le plus grand`, (a, b) => (a % b ? Math.floor(a / b) + 1 : NaN));

  /* --- écritures décimales périodiques (fracper) : division posée --- */
  const decs = (a, b, n) => { let r = a % b; const out = []; for (let i = 0; i < n; i++) { r *= 10; out.push(Math.floor(r / b)); r %= b; } return out; };
  const period = (a, b) => { /* [pré-période, période] de a/b */ const seen = new Map(); let r = a % b, i = 0; while (r && !seen.has(r)) { seen.set(r, i++); r = (r * 10) % b; } return r ? [seen.get(r), i - seen.get(r)] : [i, 0]; };
  T(null, Q`Le nombre # répète le groupe (\d+)\. Quel est son (\d+)e chiffre après la virgule`, (x, g, n) => +g[(+n - 1) % g.length], { raw: true });
  T(null, F`écriture décimale de §F, quel est le (\d+)e chiffre après la virgule`, (a, b, n) => decs(a, b, n)[n - 1]);
  T(null, F`écriture décimale de §F, quel chiffre se répète`, (a, b) => { const [p, l] = period(a, b); return l === 1 ? decs(a, b, p + 1)[p] : NaN; });
  T(null, F`Combien de chiffres contient la période de l'écriture décimale de §F`, (a, b) => period(a, b)[1]);
  T(null, F`Calcule §F \+ §F et écris le résultat en nombre décimal\. Quel chiffre se répète`, (a, b, c, d) => { const n = a * d + c * b, m = b * d, [p, l] = period(n, m); return l === 1 ? decs(n, m, p + 1)[p] : NaN; });
  T(null, F`L'écriture décimale de §F répète indéfiniment un groupe de deux chiffres\. Lequel`, (a, b) => { const [p, l] = period(a, b); return l === 2 ? +decs(a, b, p + 2).slice(p).join("") : NaN; });
  const perVal = (s, hint) => { /* « 0,2777 (seul le 7 se répète) » : plus courte pré-période, puis plus courte période répétée ≥ 2 fois */
    const [e, d] = String(s).split(","); if (!d) return NaN;
    for (let p = 0; p < d.length; p++) for (let l = 1; l <= 3; l++) {
      const t = d.slice(p); if (t.length < 2 * l) continue;
      if (![...t].every((c, i) => c === t[i % l])) continue;
      if (hint && t.slice(0, l) !== hint) continue;
      const pre = d.slice(0, p), per = t.slice(0, l);
      return +e + (+(pre + per) - +(pre || 0)) / ((10 ** l - 1) * 10 ** p);
    }
    return NaN;
  };
  T(null, Q`^Écris le nombre #(?: \(seul le (\d+) se répète\))? sous forme de fraction`, (s, h) => perVal(s, h), { raw: true });

  /* --- fraction d'une quantité (fractout) --- */
  T(null, F`^Calcule les §F de #`, (a, b, n) => (n * a) / b);
  T(null, F`Combien de minutes y a-t-il dans les §F d'une heure`, (a, b) => (60 * a) / b);
  T(null, F`Les §F d'un nombre valent #\. Quel est ce nombre`, (a, b, n) => (n * b) / a);
  T(null, F`Après avoir dépensé les §F de son argent, \S+ a encore # CHF`, (a, b, n) => n / (1 - a / b));
  T(null, F`rempli aux §F contient # L\. Quelle est sa capacité`, (a, b, n) => (n * b) / a);
  T(null, F`(?:coupé en|de) # (?:parts|L|élèves)[^.]*\. [^.]*les §F[^.]*\. Combien (?:de parts|de litres) reste-t-il|(?:coupé en|de) # (?:parts|L|élèves)[^.]*, les §F sont des filles\. Combien y a-t-il de garçons`, (n, a, b, n2, a2, b2) => (n !== undefined && !isNaN(n) ? n * (1 - a / b) : n2 * (1 - a2 / b2)));
  T(null, F`(?:mesure|fait|contient|a) # (?:km|CHF|pages|L)\. [^.]*les §F\.(?: \S+ calcule : «[^»]*»\. Trouve l'erreur, puis donne le bon nombre de (?:km|CHF|pages)[^.?]*| Combien de kilomètres a-t-on parcourus)`, (n, a, b) => (n * a) / b);

  /* --- périmètres (perim) --- */
  T(null, Q`périmètre d'un rectangle de # ~ sur # ~`, (a, b) => 2 * (a + b));
  T(null, Q`périmètre d'un carré de côté # ~`, (c) => 4 * c);
  T(null, Q`périmètre d'un triangle équilatéral de côté # ~`, (c) => 3 * c);
  T(null, Q`Un triangle a des côtés de # ~, # ~ et # ~\. Quel est son périmètre`, (a, b, c) => a + b + c);
  T(null, Q`triangle isocèle a un périmètre de # ~ et une base de # ~\. Combien mesure chacun des deux côtés égaux`, (p, b) => (p - b) / 2);
  T(null, Q`rectangle a un périmètre de # ~ et une (?:largeur|longueur) de # ~\. Quelle est sa (?:longueur|largeur)`, (p, a) => p / 2 - a);
  T(null, Q`rectangulaire de # ~ sur # ~, \S+ calcule la longueur de [^«]*«[^»]*»\. Trouve l'erreur, puis donne la bonne longueur`, (a, b) => 2 * (a + b));
  T(null, Q`On colle (\d+) carrés de # ~ de côté, côte à côte, en ligne\. Quel est le périmètre`, (n, c) => 2 * (n * c + c));
  T(null, Q`Au milieu d'un côté de # ~ d'un rectangle de # ~ sur # ~, on découpe une encoche carrée de # ~ de côté\. Quel est le périmètre`, (s, a, b, c) => 2 * (a + b) + 2 * c);
  T(null, Q`Dans un coin d'un rectangle de # ~ sur # ~, on découpe un rectangle de # ~ sur # ~\. Quel est le périmètre`, (a, b) => 2 * (a + b));
  T(null, Q`carré a un périmètre de # ~\. Quelle est son aire`, (p) => (p / 4) ** 2);

  /* --- aires (aire1, aire2, aire3) et grandeur manquante (grandmanq) --- */
  T(null, Q`aire d'un carré de côté # ~`, (c) => c * c);
  T(null, Q`aire d'un rectangle de # ~ sur # ~`, (a, b) => a * b);
  T(null, Q`rectangle a une aire de # [a-z]*m² et une (?:largeur|longueur) de # ~\. Quelle est sa (?:longueur|largeur)`, (A, a) => A / a);
  T(null, Q`triangle a une aire de # [a-z]*m² et une base de # ~\. Quelle est (?:la|sa) hauteur`, (A, b) => (2 * A) / b);
  T(null, Q`aire d'un triangle de base # ~ et de hauteur # ~`, (b, h) => (b * h) / 2);
  T(null, Q`triangle est rectangle\. Les côtés de l'angle droit mesurent # ~ et # ~\. Quelle est son aire`, (a, b) => (a * b) / 2);
  T(null, Q`La base d'une? (?:voile|fanion) triangulaire mesure # ~ et la hauteur correspondante # ~\. [^«]*«[^»]*»\. Trouve l'erreur, puis donne l'aire`, (b, h) => (b * h) / 2);
  T(null, Q`chambre mesure # m sur # m\. Le parquet coûte # CHF le m²`, (a, b, p) => a * b * p);
  T(null, Q`triangle rectangle a des côtés de l'angle droit de # (dm|cm|mm|m) et # (dm|cm|mm|m)\. Quelle est son aire, en (dm|cm|mm|m)²`, (a, ua, b, ub, u) => (conv(a, ua, u) * conv(b, ub, u)) / 2, { raw: true });
  T(null, Q`aire d'un parallélogramme de base # ~ et de hauteur # ~`, (b, h) => b * h);
  T(null, Q`parallélogramme a une aire de # [a-z]*m² et une base de # ~\. Quelle est sa hauteur`, (A, b) => A / b);
  T(null, Q`parallélogramme a une aire de # [a-z]*m² et une hauteur de # ~\. Quelle est la base`, (A, h) => A / h);
  T(null, Q`a des diagonales perpendiculaires de # ~ et # ~\. Quelle est son aire`, (a, b) => (a * b) / 2);
  T(null, Q`aire d'un losange dont les diagonales mesurent # ~ et # ~`, (a, b) => (a * b) / 2);
  T(null, Q`losange a une aire de # [a-z]*m²\.? (?:et une|L'une de ses) diagonales? (?:de|mesure) # ~\. Combien mesure l'autre`, (A, d) => (2 * A) / d);
  T(null, Q`parallélogramme a une base de # ~, un côté oblique de # ~ et une hauteur \(relative à la base\) de # ~\. Quelle est son aire`, (b, c, h) => b * h);
  T(null, Q`triangle a une base de # ~ et un autre côté de # ~ ; la hauteur relative à la base mesure # ~\. Quelle est son aire`, (b, c, h) => (b * h) / 2);
  T(null, Q`parallélogramme a des côtés de # ~ et # ~\. La hauteur relative au côté de # ~ mesure # ~\. Combien mesure la hauteur relative au côté de # ~`, (a, b, c, h, d) => (c * h) / d);
  T(null, Q`formée d'un rectangle de # ~ sur # ~ accolé à un rectangle de # ~ sur # ~\. Quelle est son aire`, (a, b, c, d) => a * b + c * d);
  T(null, Q`formée d'un carré de # ~ de côté, surmonté d'un triangle de même base et de # ~ de hauteur\. Quelle est son aire`, (c, h) => c * c + (c * h) / 2);
  T(null, Q`lettre T est formée d'une barre de # ~ sur # ~, posée sur un pied de # ~ sur # ~\. Quelle est son aire`, (a, b, c, d) => a * b + c * d);
  T(null, Q`formée de (\d+) fanions triangulaires de # ~ de base et # ~ de hauteur\. Quelle est l'aire totale`, (n, b, h) => (n * b * h) / 2);
  T(null, Q`la forme d'un rectangle de # ~ de large et # ~ de haut, surmonté d'un triangle de base # ~ et de hauteur # ~\. Quelle est son aire`, (a, b, c, h) => a * b + (c * h) / 2);
  T(null, Q`trapèze rectangle a des bases de # ~ et # ~ et une hauteur de # ~\. On le découpe`, (a, b, h) => ((a + b) * h) / 2);
  T(null, Q`cadre rectangulaire mesure # ~ sur # ~ à l'extérieur\. Sa bordure a partout # ~ de large\. Quelle est l'aire de la bordure`, (a, b, e) => a * b - (a - 2 * e) * (b - 2 * e));
  T(null, Q`chemin de # ~ de large fait le tour, à l'extérieur, d'un jardin rectangulaire de # ~ sur # ~\. Quelle est l'aire du chemin`, (e, a, b) => (a + 2 * e) * (b + 2 * e) - a * b);
  T(null, Q`pelouse rectangulaire de # ~ sur # ~ entoure un bassin carré de # ~ de côté\. Quelle est l'aire de la pelouse`, (a, b, c) => a * b - c * c);
  T(null, Q`carré a une aire de # [a-z]*m²\. Combien mesure son côté`, (A) => Math.sqrt(A));
  T(null, Q`rectangle a une longueur double de sa largeur et une aire de # [a-z]*m²\. Quelle est sa largeur`, (A) => Math.sqrt(A / 2));
  T(null, Q`trapèze a des bases de # ~ et # ~ et une aire de # [a-z]*m²\. Quelle est sa hauteur`, (a, b, A) => (2 * A) / (a + b));
  T(null, Q`parallélogramme de base # ~ a la même aire qu'un carré de # ~ de côté\. Quelle est sa hauteur`, (b, c) => (c * c) / b);
  T(null, Q`triangle de base # ~ a la même aire qu'un rectangle de # ~ sur # ~\. Quelle est sa hauteur`, (b, x, y) => (2 * x * y) / b);

  /* --- nombres décimaux, arrondis, divisibilité, premiers, proportionnalité, change, agrandissement, ordre de grandeur
     (notions de 9e, 26.11) : réponses exactes (TE : pas d'arrondi relu dans l'énoncé, « au dixième » y est une donnée) --- */
  const TE = (ids, p, f, o = {}) => T(ids, p, f, { ...o, exact: true });
  const RW = { "au dixième": 0.1, "au centième": 0.01, "au millième": 0.001, "à l'unité": 1, "à la dizaine": 10, "à la centaine": 100, "au millier": 1000, "à la dizaine de milliers": 1e4 };
  const RWS = "(au dixième|au centième|au millième|à l'unité|à la dizaine de milliers|à la dizaine|à la centaine|au millier)";
  const rnd = (v, w) => roundTo(num(v), RW[w] || num(w), 0);
  const LS = (s) => String(s).split(/\s*;\s*|\s+/).filter((t) => /\d/.test(t)).map(num);
  const LST = String.raw`((?:[−-]?\d+(?:'\d{3})*(?:,\d+)?(?: ; |\s+))+[−-]?\d+(?:'\d{3})*(?:,\d+)?)`;
  const R2 = (s) => RX(s.replace(/LST/g, LST).replace(/RWS/g, RWS));
  const Z = (s, ...v) => R2(String.raw(s, ...v));
  TE(null, Z`^Arrondis # RWS\.?$`, (v, w) => rnd(v, w), { raw: true });
  TE(null, Z`plus grand nombre à deux chiffres après la virgule qui s'arrondit à # au dixième`, (a) => +(a + 0.04).toFixed(2));
  TE(null, Z`plus petit nombre à deux chiffres après la virgule qui s'arrondit à # au dixième`, (a) => +(a - 0.05).toFixed(2));
  TE(null, Z`On encadre # par deux nombres consécutifs à un chiffre après la virgule\. Quel est le plus grand`, (a) => (Number.isInteger(+(a * 10).toFixed(6)) ? NaN : Math.ceil(a * 10) / 10));
  TE(null, Z`On encadre # par deux nombres consécutifs à un chiffre après la virgule\. Quel est le plus petit`, (a) => (Number.isInteger(+(a * 10).toFixed(6)) ? NaN : Math.floor(a * 10) / 10));
  TE(null, Z`Quel est le plus petit de ces deux nombres : # ou #`, (a, b) => Math.min(a, b));
  TE(null, Z`Quel est le plus grand de ces deux nombres : # ou #`, (a, b) => Math.max(a, b));
  TE(null, Z`De combien le plus grand de ces deux nombres dépasse-t-il le plus petit : # ou #`, (a, b) => +Math.abs(a - b).toFixed(10));
  TE(null, Z`On range dans l'ordre croissant : LST\. Quel nombre est en (\d+)e position`, (l, k) => LS(l).sort((u, w) => u - w)[+k - 1], { raw: true });
  TE(null, Z`On range dans l'ordre décroissant : LST\. Quel nombre est en (\d+)e position`, (l, k) => LS(l).sort((u, w) => w - u)[+k - 1], { raw: true });
  TE(null, Z`Quel est le plus petit de ces nombres \? LST\s*\.?$`, (l) => Math.min(...LS(l)), { raw: true });
  TE(null, Z`Quel est le plus grand de ces nombres \? LST\s*\.?$`, (l) => Math.max(...LS(l)), { raw: true });
  TE(null, Z`plus petit nombre à deux chiffres après la virgule strictement plus grand que #`, (a) => (Math.floor(+(a * 100).toFixed(6)) + 1) / 100);
  TE(null, Z`plus grand nombre à deux chiffres après la virgule strictement plus petit que #`, (a) => (Math.ceil(+(a * 100).toFixed(6)) - 1) / 100);
  TE(null, Z`Quel nombre est exactement au milieu entre # et #`, (a, b) => +((a + b) / 2).toFixed(10));
  TE(null, Z`Combien y a-t-il de nombres à deux chiffres après la virgule strictement compris entre # et #`, (a, b) => Math.ceil(+(Math.max(a, b) * 100).toFixed(6)) - Math.floor(+(Math.min(a, b) * 100).toFixed(6)) - 1);
  TE(null, Z`Combien y a-t-il de nombres à un chiffre après la virgule strictement compris entre # et #`, (a, b) => Math.ceil(+(Math.max(a, b) * 10).toFixed(6)) - Math.floor(+(Math.min(a, b) * 10).toFixed(6)) - 1);
  /* problèmes avec des décimaux (decprob) */
  T(null, Z`(?:pèse|coûte|contient|mesure) # (?:kg|CHF|L|m)\. Combien (?:pèsent|coûtent|mesurent) # `, (a, n) => a * n);
  T(null, Z`contient # L\. Quelle quantité faut-il pour remplir # verres`, (a, n) => a * n);
  T(null, Z`coûte # CHF de prise en charge, puis # CHF par kilomètre\. Combien coûte une course de # km`, (a, b, k) => a + b * k);
  T(null, Z`Tu achètes # \S+ à # CHF et # \S+ à # CHF\. Tu paies avec un billet de # CHF\. Combien te rend-on`, (n1, p1, n2, p2, B) => B - n1 * p1 - n2 * p2);
  T(null, Z`Tu as # CHF\. Tu achètes # [^.]*? à # CHF et (?:un|une) [^.]*? à # CHF\. Combien te reste-t-il`, (A, n, p, q) => A - n * p - q);
  T(null, Z`D'une corde de # m, on retire d'abord # m abîmés, puis on coupe le reste en # morceaux égaux`, (L, a, n) => (L - a) / n);
  T(null, Z`^# amis offrent un cadeau à # CHF et une carte à # CHF\. Ils partagent`, (n, a, b) => (a + b) / n);
  T(null, Z`^# amis partagent équitablement une addition : # CHF de [^.]*? et # CHF de`, (n, a, b) => (a + b) / n);
  /* divisibilité (divcrit), multiples et diviseurs (multdiv), nombres premiers (premiers) */
  const dvs = (n) => { const o = []; for (let d = 1; d <= n; d++) if (n % d === 0) o.push(d); return o; };
  const pf = (n) => { const o = []; for (let d = 2; d * d <= n; d++) while (n % d === 0) { o.push(d); n /= d; } if (n > 1) o.push(n); return o; };
  const isP = (n) => n > 1 && pf(n).length === 1;
  const divBy = (n, ks) => ks.every((k) => n % k === 0);
  const ksOf = (s) => (s.match(/\d+/g) || []).map(Number);
  const holes = (pat, ks) => { const o = []; for (let c = 0; c <= 9; c++) { const n = +pat.replace(/\s/g, "").replace("■", c); if (divBy(n, ks)) o.push(c); } return o; };
  const one = (a) => (a.length === 1 ? a[0] : NaN);
  TE(null, Z`Lequel de ces nombres est divisible par ([\d et par]+?) \? LST\s*\.?$`, (k, l) => one(LS(l).filter((n) => divBy(n, ksOf(k)))), { raw: true });
  TE(null, Z`Combien de ces nombres sont divisibles par ([\d et par]+?) \? LST\s*\.?$`, (k, l) => LS(l).filter((n) => divBy(n, ksOf(k))).length, { raw: true });
  TE(null, Z`Quel chiffre faut-il écrire à la place de ■ pour que ([\d ■]+) soit divisible par ([\d et par]+?)\s*\?`, (p, k) => one(holes(p, ksOf(k))), { raw: true });
  TE(null, Z`Quel est le plus grand chiffre (?:à écrire à la place de )?■ pour que ([\d ■]+) soit divisible par ([\d et par]+?)\s*\?`, (p, k) => Math.max(...holes(p, ksOf(k))), { raw: true });
  TE(null, Z`Quel est le plus petit chiffre (?:à écrire à la place de )?■ pour que ([\d ■]+) soit divisible par ([\d et par]+?)\s*\?`, (p, k) => Math.min(...holes(p, ksOf(k))), { raw: true });
  TE(null, Z`Combien de chiffres ■ \(de 0 à 9\) rendent ([\d ■]+) divisible par ([\d et par]+?)\s*\?`, (p, k) => holes(p, ksOf(k)).length, { raw: true });
  TE(null, Z`plus petit nombre strictement supérieur à # divisible (?:à la fois )?par ([\d et par]+?)\s*\?`, (a, k) => { let n = num(a) + 1; while (!divBy(n, ksOf(k))) n++; return n; }, { raw: true });
  TE(null, Z`Combien de nombres entre # et # \(compris\) sont divisibles (?:à la fois )?par ([\d et par]+?)\s*\?`, (a, b, k) => { let c = 0; for (let n = num(a); n <= num(b); n++) if (divBy(n, ksOf(k))) c++; return c; }, { raw: true });
  TE(null, Z`plus petit multiple de # strictement supérieur à #`, (k, a) => (Math.floor(a / k) + 1) * k);
  TE(null, Z`plus grand multiple de # strictement inférieur à #`, (k, a) => (Math.ceil(a / k) - 1) * k);
  TE(null, Z`Quel est le (\d+)e multiple de #`, (i, k) => i * k);
  TE(null, Z`Combien de diviseurs le nombre # possède-t-il`, (n) => dvs(n).length);
  TE(null, Z`plus petit diviseur de # autre que 1`, (n) => dvs(n)[1]);
  TE(null, Z`plus grand diviseur de #, autre que # lui-même`, (n) => dvs(n).slice(-2)[0]);
  TE(null, Z`Combien y a-t-il de multiples de # entre # et #`, (k, a, b) => Math.floor(b / k) - Math.ceil(a / k) + 1);
  TE(null, Z`Combien de nombres entre # et # sont multiples à la fois de # et de #`, (a, b, k1, k2) => { const k = lcm(k1, k2); return Math.floor(b / k) - Math.ceil(a / k) + 1; });
  TE(null, Z`Combien y a-t-il de nombres premiers entre # et #`, (a, b) => { let c = 0; for (let n = a; n <= b; n++) if (isP(n)) c++; return c; });
  TE(null, Z`plus petit nombre premier strictement supérieur à #`, (a) => { let n = a + 1; while (!isP(n)) n++; return n; });
  TE(null, Z`plus grand nombre premier strictement inférieur à #`, (a) => { let n = a - 1; while (!isP(n)) n--; return n; });
  TE(null, Z`plus petit facteur premier de #`, (n) => pf(n)[0]);
  TE(null, Z`plus grand facteur premier de #|Décompose # en produit de facteurs premiers\. Quel est son plus grand facteur premier`, (n, m) => Math.max(...pf(isNaN(n) ? m : n)));
  TE(null, Z`On décompose # en produit de facteurs premiers\. Quel est l'exposant de #`, (n, p) => pf(n).filter((d) => d === p).length);
  TE(null, Z`Combien de nombres premiers différents apparaissent dans la décomposition de #`, (n) => new Set(pf(n)).size);
  TE(null, Z`On décompose # en produit de facteurs premiers\. Combien de facteurs le produit contient-il`, (n) => pf(n).length);
  TE(null, Z`Quel nombre a pour décomposition en produit de facteurs premiers ([\d ·^]+?)\s*\?`, (e) => { let v; try { v = ev(e.replace(/·/g, "*")); } catch (er) { return null; } return v; }, { raw: true });
  /* tableaux de proportionnalité (proptab), change, agrandissement (agrand) */
  T(null, Z`# kg de [^.]* coûtent # CHF\. Quel est le coefficient de proportionnalité`, (m, p) => p / m);
  T(null, Z`tableau de proportionnalité, # correspond à #(?: et # à #)?\. (?:Par quel nombre multiplie-t-on|Quel est le coefficient)`, (a, b, c, d) => (isNaN(c) || Math.abs(d / c - b / a) < 1e-9 ? b / a : NaN));
  T(null, Z`recette demande # g de [^.]* pour # personnes\. Quelle quantité [^.?]* par personne`, (g, n) => g / n);
  T(null, Z`proportionnalité : # # et # \?\. Quel nombre manque`, (a, b, c) => (c * b) / a);
  T(null, Z`proportionnalité : # # et \? #\. Quel nombre manque`, (a, b, d) => (d * a) / b);
  T(null, Z`proportionnalité : # # et # #\. Quel nombre correspond à #`, (a, b, c, d, k) => (Math.abs(d / c - b / a) < 1e-9 ? (k * b) / a : NaN));
  T(null, Z`Pour 1 CHF, on obtient # EUR\. Combien d'euros obtient-on pour # CHF`, (t, a) => a * t);
  T(null, Z`Pour 1 EUR, on obtient # CHF\. Combien de francs obtient-on pour # EUR`, (t, a) => a * t);
  T(null, Z`coûte # EUR [^.]*\. Le taux est 1 EUR = # CHF\. Combien cela fait-il en francs`, (a, t) => a * t);
  T(null, Z`1 EUR = # CHF\. Combien de francs obtient-on pour # EUR`, (t, a) => a * t);
  T(null, Z`1 EUR = # CHF\. Combien d'euros obtient-on pour # CHF`, (t, a) => a / t);
  T(null, Z`Tu as # CHF\. Combien d'euros reçois-tu au taux 1 EUR = # CHF`, (a, t) => a / t);
  T(null, Z`Au taux 1 EUR = # CHF, [^.]* coûte # CHF\. Quel est son prix en euros`, (t, a) => a / t);
  T(null, Z`coûte # EUR en France et # CHF en Suisse\. Le taux est 1 EUR = # CHF\. Quelle est la différence de prix`, (e, c, t) => +Math.abs(e * t - c).toFixed(10));
  T(null, Z`coûte # EUR la nuit en France\. En Suisse, # nuits coûtent # CHF\. Le taux est 1 EUR = # CHF`, (e, n, c, t) => +Math.abs(n * e * t - c).toFixed(10));
  T(null, Z`coûtent # EUR en ligne et # CHF en magasin\. Le taux est 1 EUR = # CHF\. De combien`, (e, c, t) => +Math.abs(e * t - c).toFixed(10));
  T(null, Z`une longueur de # cm devient # cm\. Par quel nombre`, (a, b) => b / a);
  T(null, Z`de # cm de large est réduite à # cm de large\. Par quelle fraction`, (a, b) => b / a);
  T(null, Z`rectangle de # cm sur # cm est (?:agrandi|réduit) en un rectangle de # cm sur # cm\. Par quel nombre`, (a, b, c, d) => (Math.abs(c / a - d / b) < 1e-9 ? c / a : NaN));
  T(null, Z`triangle de côtés # cm, # cm et # cm est (?:agrandi|réduit) d'un facteur #\. Combien mesure son plus long côté`, (a, b, c, k) => Math.max(a, b, c) * k);
  T(null, Z`triangle de côtés # cm, # cm et # cm est (?:agrandi|réduit) d'un facteur #\. Combien mesure son plus petit côté`, (a, b, c, k) => Math.min(a, b, c) * k);
  T(null, Z`On réduit de moitié les longueurs d'un rectangle de # cm sur # cm\. Quel est le périmètre`, (a, b) => a + b);
  T(null, Z`photo de # cm sur # cm : sa largeur passe de # cm à # cm\. Quelle est sa nouvelle longueur`, (a, b, c, d) => (a === c ? (b * d) / c : NaN));
  T(null, F`chaque longueur est multipliée par §F\. Que devient un segment de # cm`, (p, q, a) => (a * p) / q);
  T(null, Z`un segment de # cm devient un segment de # cm\. Que devient un segment de # cm`, (a, b, c) => (c * b) / a);
  T(null, Z`un côté de # cm est devenu # cm\. Que devient un autre côté de # cm`, (a, b, c) => (c * b) / a);
  /* ordre de grandeur (ordgr) */
  const OPS = { "+": (a, b) => a + b, "-": (a, b) => a - b, "−": (a, b) => a - b, "·": (a, b) => a * b, ":": (a, b) => a / b };
  TE(null, Z`^Estime # ([+−·:-]) # en arrondissant chaque nombre RWS`, (a, o, b, w) => OPS[o](rnd(a, w), rnd(b, w)), { raw: true });
  TE(null, Z`^Estime # ([+−·:-]) # en arrondissant le premier nombre RWS et le second RWS`, (a, o, b, w1, w2) => OPS[o](rnd(a, w1), rnd(b, w2)), { raw: true });
  TE(null, Z`coûte # CHF et [^.]*? # CHF\. Estime le prix [^.]*? en arrondissant chaque prix RWS`, (a, b, w) => rnd(a, w) + rnd(b, w), { raw: true });
  TE(null, Z`Pour vérifier, donne l'ordre de grandeur # · #`, (a, b) => a * b);
  TE(null, Z`coûte # CHF le litre\. Estime le prix de # litres en arrondissant le prix RWS et le volume RWS`, (p, l, w1, w2) => rnd(p, w1) * rnd(l, w2), { raw: true });
  TE(null, Z`Ordre de grandeur de # · # Arrondis # à # et # RWS\. Résultat`, (a, b, a2, ra, b2, w) => (num(a) === num(a2) && num(b) === num(b2) ? num(ra) * rnd(b, w) : NaN), { raw: true });
  TE(null, Z`récolte # CHF, à partager entre # projets\. Estime la part de chacun en arrondissant la somme RWS`, (a, n, w) => rnd(a, w) / num(n), { raw: true });

  /* --- relatifs sur la droite, décimaux (×10, additions, lecture), fraction ↔ décimal ↔ %, racines, cercle de Thalès,
     dénombrement (26.11) --- */
  TE(null, Z`il fait # °C ; l'après-midi, # °C\. De combien de degrés la température a-t-elle (?:monté|baissé)`, (a, b) => Math.abs(b - a));
  TE(null, Z`distance entre les points d'abscisses # et #`, (a, b) => Math.abs(b - a));
  TE(null, Z`Quel nombre est à égale distance de # et de # sur la droite graduée`, (a, b) => (a + b) / 2);
  TE(null, Z`Le point A a pour abscisse #\. Le milieu de \[AB\] a pour abscisse #\. Quelle est l'abscisse de B`, (a, m) => 2 * m - a);
  TE(null, Z`Par quel nombre faut-il multiplier # pour obtenir #`, (a, b) => +(b / a).toPrecision(12));
  TE(null, Z`Par quel nombre faut-il diviser # pour obtenir #`, (a, b) => +(a / b).toPrecision(12));
  TE(null, Z`^Complète : \? · # = #`, (k, b) => +(b / k).toPrecision(12));
  TE(null, Z`^Complète : # · \? = #`, (k, b) => +(b / k).toPrecision(12));
  TE(null, Z`^Complète : \? : # = #`, (k, b) => +(b * k).toPrecision(12));
  TE(null, Z`^Complète : # \+ \? = #`, (a, b) => +(b - a).toPrecision(12));
  TE(null, Z`^Complète : # - \? = #`, (a, b) => +(a - b).toPrecision(12));
  TE(null, Z`^Complète : \? - # = #`, (a, b) => +(a + b).toPrecision(12));
  TE(null, Z`Un paquet de # feuilles pèse # g\. Combien pèse une feuille`, (n, g) => +(g / n).toPrecision(12));
  TE(null, Z`écrit : « # · # = # »\. Trouve l'erreur, puis donne le bon résultat`, (a, b) => +(a * b).toPrecision(12));
  TE(null, Z`écrit : « # : # = # »\. Trouve l'erreur, puis donne le bon résultat`, (a, b) => +(a / b).toPrecision(12));
  TE(null, Z`place de cinéma à # CHF et tu paies avec un billet de # CHF\. Combien te rend-on`, (p, b) => +(b - p).toFixed(10));
  TE(null, Z`lance le poids à # m et \S+ # m\. Quel est l'écart`, (a, b) => +Math.abs(a - b).toFixed(10));
  TE(null, Z`colis pèse # kg ; on en retire un objet de # kg\. Nouvelle masse`, (a, b) => +(a - b).toFixed(10));
  TE(null, Z`On coupe # m d'un ruban de # m\. Quelle longueur reste-t-il`, (a, b) => +(b - a).toFixed(10));
  TE(null, Z`Avec # CHF, \S+ achète un \S+ à # CHF, un \S+ à # CHF et un \S+ à # CHF\. Combien lui reste-t-il`, (A, a, b, c) => +(A - a - b - c).toFixed(10));
  TE(null, Z`il fait # °C\. La température monte de # °C, puis baisse de # °C\. Quelle température`, (a, b, c) => +(a + b - c).toFixed(10));
  TE(null, Z`il fait # °C\. La température baisse de # °C, puis monte de # °C\. Quelle température`, (a, b, c) => +(a - b + c).toFixed(10));
  const PLACE = { "millièmes": -3, "centièmes": -2, "dixièmes": -1, "unités": 0, "dizaines": 1, "centaines": 2, "milliers": 3 };
  TE(null, Z`Dans le nombre #, quel est le chiffre des (millièmes|centièmes|dixièmes|unités|dizaines|centaines|milliers)`, (n, p) => Math.floor(+(Math.abs(num(n)) / 10 ** PLACE[p]).toFixed(6)) % 10, { raw: true });
  const DEC = { milliers: 1000, centaines: 100, dizaines: 10, dizaine: 10, centaine: 100, millier: 1000, unités: 1, unité: 1, dixièmes: 0.1, dixième: 0.1, centièmes: 0.01, centième: 0.01, millièmes: 0.001, millième: 0.001 };
  TE(null, /^Écris en nombre décimal : ((?:\d+ [a-zéè]+(?:, | et )?)+)\.?$/i, (s) => +(s.match(/\d+ [a-zéè]+/g).reduce((t, x) => { const [n, w] = x.split(" "); return t + +n * DEC[w]; }, 0)).toFixed(10), { raw: true });
  TE(null, Z`Quel nombre obtient-on en ajoutant # (dixièmes?|centièmes?|millièmes?|unités?|dizaines?) à #`, (k, w, a) => +(num(a) + num(k) * DEC[w]).toFixed(10), { raw: true });
  TE(null, Z`Quel nombre obtient-on en retirant # (dixièmes?|centièmes?|millièmes?|unités?|dizaines?) à #`, (k, w, a) => +(num(a) - num(k) * DEC[w]).toFixed(10), { raw: true });
  TE(null, Z`Combien y a-t-il de (dixièmes|centièmes|millièmes|dizaines|centaines) en tout dans #`, (w, a) => Math.round(+(num(a) / DEC[w]).toFixed(6)), { raw: true });
  TE(null, Z`test de # questions, \S+ répond juste à # questions\. Quel est son pourcentage`, (n, k) => +((k / n) * 100).toFixed(10));
  TE(null, Z`Dans une classe de # élèves, # font partie d'un club[^.]*\. Quel pourcentage`, (n, k) => +((k / n) * 100).toFixed(10));
  TE(null, Z`^Écris # sous forme de fraction irréductible\.?$`, (s) => { const [a, b] = dec2f(s); return a / b; }, { raw: true, not: /\\overline/ });
  TE(null, Z`^Écris # \(soit # \) sous forme de fraction irréductible`, (a, s) => perVal(s), { raw: true });
  TE(null, Z`^Écris # % sous forme de fraction irréductible`, (p) => p / 100);
  TE(null, F`^Écris §F en pourcentage`, (a, b) => +((a / b) * 100).toFixed(10));
  TE(null, F`Quel est le plus grand de ces nombres : §F, # ou # % \? Donne sa valeur en nombre décimal`, (a, b, d, p) => Math.max(a / b, d, p / 100));
  TE(null, F`Quel est le plus petit de ces nombres : §F, # ou # % \? Donne sa valeur en nombre décimal`, (a, b, d, p) => Math.min(a / b, d, p / 100));
  TE(null, F`Un prix baisse d'abord de §F, puis le nouveau prix baisse de # %\. De quel pourcentage`, (a, b, p) => +((1 - (1 - a / b) * (1 - p / 100)) * 100).toFixed(10));
  TE(null, F`Un prix augmente d'abord de §F, puis le nouveau prix augmente de # %\. De quel pourcentage`, (a, b, p) => +(((1 + a / b) * (1 + p / 100) - 1) * 100).toFixed(10));
  TE(null, F`^Calcule # % de §F`, (p, a, b) => ((p / 100) * a) / b);
  const SQ = String.raw`(\d*)√\((\d+)\)`, sq = (k, n) => (k ? +k : 1) * Math.sqrt(+n);
  const Y = (s, ...v) => R2(String.raw(s, ...v).replace(/SQ/g, SQ));
  TE(null, Y`Quel est l'entier le plus proche de SQ`, (k, n) => Math.round(sq(k, n)), { raw: true });
  TE(null, Y`Le nombre SQ est compris entre deux entiers consécutifs\. Quel est le plus petit`, (k, n) => Math.floor(sq(k, n)), { raw: true });
  TE(null, Y`Le nombre SQ est compris entre deux entiers consécutifs\. Quel est le plus grand`, (k, n) => Math.floor(sq(k, n)) + 1, { raw: true });
  TE(null, Y`Quel est le plus petit de ces deux nombres : # ou SQ`, (a, k, n) => Math.min(num(a), sq(k, n)), { raw: true });
  TE(null, Y`Quel est le plus grand de ces deux nombres : # ou SQ`, (a, k, n) => Math.max(num(a), sq(k, n)), { raw: true });
  TE(null, Y`Quel est le plus grand : SQ ou SQ`, (k, n, l, m) => Math.max(sq(k, n), sq(l, m)), { raw: true });
  TE(null, Y`Quel est le plus petit : SQ ou SQ`, (k, n, l, m) => Math.min(sq(k, n), sq(l, m)), { raw: true });
  TE(null, Y`On range SQ, # et # dans l'ordre croissant\. Lequel est au milieu`, (k, n, a, b) => [sq(k, n), num(a), num(b)].sort((u, w) => u - w)[1], { raw: true });
  TE(null, Y`Encadre SQ au dixième : quel est le nombre a`, (k, n) => Math.floor(sq(k, n) * 10 + 1e-9) / 10, { raw: true });
  TE(null, Y`Combien y a-t-il de nombres entiers n tels que # < √\(n\) < #`, (a, b) => { let c = 0; for (let n = 0; n <= 1e4; n++) if (Math.sqrt(n) > num(a) && Math.sqrt(n) < num(b)) c++; return c; }, { raw: true });
  TE(null, Y`Quel est le plus grand entier n tel que √\(n\) < #`, (a) => Math.ceil(num(a) ** 2 - 1e-9) - 1, { raw: true });
  TE(null, Y`Combien de nombres entiers sont compris entre SQ et SQ`, (k, n, l, m) => { const lo = sq(k, n), hi = sq(l, m); let c = 0; for (let i = Math.floor(lo); i <= hi; i++) if (i > lo && i < hi) c++; return c; }, { raw: true });
  /* cercle de Thalès, tangente (cercthales) */
  TE(null, Z`\[AB\] est un diamètre d'un cercle et C un point du cercle\. ∠CAB = #°\. Combien mesure ∠CBA`, (a) => 90 - a);
  TE(null, Z`\[AB\] est un diamètre d'un cercle et C un point du cercle\. ∠CBA = #°\. Combien mesure ∠CAB`, (a) => 90 - a);
  T(null, Z`\[AB\] est un diamètre de # cm d'un cercle, et C un point du cercle tel que AC = # cm\. Calcule BC`, (d, a) => Math.sqrt(d * d - a * a));
  T(null, Z`D'un point P à # cm du centre O d'un cercle de rayon # cm, on trace une tangente qui touche le cercle en T\. Calcule PT`, (d, r) => Math.sqrt(d * d - r * r));
  TE(null, Z`tangente en T à un cercle de centre O\. ∠OPT = #°\. Combien mesure ∠POT`, (a) => 90 - a);
  TE(null, Z`tangente en T à un cercle de centre O\. ∠POT = #°\. Combien mesure ∠OPT`, (a) => 90 - a);
  T(null, Z`triangle ABC est rectangle en C, avec AC = # cm et BC = # cm\. Quel est le rayon de son cercle circonscrit`, (a, b) => Math.hypot(a, b) / 2);
  T(null, Z`touche un cercle de centre O en T\. OP = # cm et PT = # cm\. Quel est le rayon`, (d, t) => Math.sqrt(d * d - t * t));
  T(null, Z`\[AB\] est un diamètre de # cm et C un point du cercle tel que AC = # cm\. Calcule l'aire du triangle ABC`, (d, a) => (a * Math.sqrt(d * d - a * a)) / 2);
  TE(null, Z`\[AB\] est un diamètre d'un cercle de centre O, et C un point du cercle\. ∠ACO = #°\. Combien mesure ∠BCO`, (a) => 90 - a);
  T(null, Z`D'un point P à # cm du centre O d'un cercle de rayon # cm, on trace les deux tangentes[^.]*\. Quel est le périmètre du quadrilatère`, (d, r) => 2 * r + 2 * Math.sqrt(d * d - r * r));
  /* dénombrement (denombr) */
  const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1)), arr = (n, k) => fact(n) / fact(n - k);
  TE(null, /(?:tu as|propose|on choisit) ((?:(?:un \S+ parmi )?\d+ [^,.]+?(?:, | et |\. ))+)Combien de (?:tenues|pizzas|glaces|menus|repas)/i, (s) => { const n = s.match(/\d+/g) || []; return n.length >= 2 ? n.reduce((p, k) => p * +k, 1) : null; }, { raw: true });
  TE(null, Z`code secret est formé de # symboles, chacun choisi parmi # \(on peut répéter\)`, (k, n) => n ** k);
  TE(null, Z`cadenas a # molettes portant chacune les chiffres de # à #`, (k, a, b) => (b - a + 1) ** k);
  TE(null, Z`de A à B, il y a # chemins ; de B à C, il y a # chemins`, (a, b) => a * b);
  TE(null, Z`classe de # élèves élit un délégué et un suppléant`, (n) => n * (n - 1));
  TE(null, Z`De combien de façons peut-on ranger # (?:amis|coureurs|livres|personnes)`, (n) => fact(n));
  TE(null, Z`# coureurs participent à une course\. Combien de podiums`, (n) => arr(n, 3));
  TE(null, Z`code de # chiffres utilise les chiffres de # à #, tous différents`, (k, a, b) => arr(b - a + 1, k));
  TE(null, Z`Combien de diagonales a un polygone convexe à # côtés`, (n) => (n * (n - 3)) / 2);
  TE(null, Z`tournoi réunit # équipes\. Chaque équipe rencontre chacune des autres une seule fois`, (n) => (n * (n - 1)) / 2);
  TE(null, Z`Codes de # chiffres choisis parmi # \(répétition permise\)\. Combien de codes contiennent au moins deux chiffres identiques`, (k, n) => n ** k - arr(n, k));

  T(null, Z`bougie mesure # mm et raccourcit de # mm par heure[^.?]*\. Après combien d'heures est-elle entièrement consumée`, (h, v) => h / v);

  /* --- Euclide et hauteur (euclide), droites remarquables (droitesrem), relations trigonométriques (trigrel), 26.11 --- */
  T(null, Z`rectangle en C, d'hypoténuse c = # cm\. La projection de la cathète a sur l'hypoténuse mesure # cm\. Calcule a`, (c, p) => Math.sqrt(p * c));
  T(null, Z`triangle rectangle a une hypoténuse de # cm et une cathète a = # cm\. Calcule la projection p`, (c, a) => (a * a) / c);
  T(null, Z`la hauteur issue de l'angle droit découpe l'hypoténuse en segments de # cm et # cm\. Calcule la hauteur`, (p, q) => Math.sqrt(p * q));
  T(null, Z`une cathète mesure # cm et sa projection sur l'hypoténuse # cm\. Calcule l'hypoténuse`, (a, p) => (a * a) / p);
  T(null, Z`triangle rectangle a des cathètes de # cm et # cm\. Calcule la hauteur relative à l'hypoténuse`, (a, b) => (a * b) / Math.hypot(a, b));
  T(null, Z`la hauteur relative à l'hypoténuse mesure # cm et l'un des segments de l'hypoténuse # cm\. Calcule l'autre segment`, (h, p) => (h * h) / p);
  T(null, Z`triangle rectangle a des cathètes de # cm et # cm\. La hauteur issue de l'angle droit coupe l'hypoténuse en deux segments\. De combien le plus long dépasse-t-il le plus court`, (a, b) => Math.abs(a * a - b * b) / Math.hypot(a, b));
  T(null, Z`découpe l'hypoténuse en # cm et # cm\. Calcule l'aire du triangle`, (p, q) => ((p + q) * Math.sqrt(p * q)) / 2);
  T(null, Z`la hauteur relative à l'hypoténuse découpe celle-ci en # cm et # cm\. Calcule le périmètre`, (p, q) => p + q + Math.sqrt(p * (p + q)) + Math.sqrt(q * (p + q)));
  T(null, Z`triangle rectangle a des cathètes de # cm et # cm\. Quel est le rayon de son cercle circonscrit`, (a, b) => Math.hypot(a, b) / 2);
  T(null, Z`La médiane \[AM\] d'un triangle mesure # cm\. Calcule la distance GM`, (m) => m / 3);
  T(null, Z`la médiane \[CM\] mesure # cm\. G est le centre de gravité\. Calcule CG`, (m) => (2 * m) / 3);
  T(null, Z`le centre de gravité G est à # cm du sommet B\. Quelle est la longueur de la médiane issue de B`, (g) => (3 * g) / 2);
  TE(null, Z`∠B = #°\. On trace la hauteur issue de A, qui coupe \[BC\] en H\. Que mesure ∠BAH`, (b) => 90 - b);
  TE(null, Z`∠A = #°\. I est le point d'intersection des bissectrices\. Que mesure ∠BIC`, (a) => 90 + a / 2);
  T(null, Z`triangle rectangle a des côtés de #, # et # cm\. Le rayon de son cercle inscrit`, (a, b, c) => { const [u, v, w] = [a, b, c].sort((p, q) => p - q); return Math.abs(u * u + v * v - w * w) < 1e-9 ? (u + v - w) / 2 : NaN; });
  T(null, Z`médiatrice du segment \[AB\], avec AB = # cm et PA = # cm\. Calcule la distance de P à la droite \(AB\)`, (ab, pa) => Math.sqrt(pa * pa - (ab / 2) ** 2));
  TE(null, Z`tous ses angles aigus et ∠A = #°\. H est son orthocentre[^.]*\. Que mesure ∠BHC`, (a) => 180 - a);
  TE(null, Z`∠A = #° et ∠B = #°\. I est le centre du cercle inscrit\. Que mesure ∠AIB`, (a, b) => 180 - a / 2 - b / 2);
  T(null, Z`isocèle en A[^.]*AB = AC = # cm et BC = # cm\. G est son centre de gravité\. Calcule AG`, (a, b) => (2 / 3) * Math.sqrt(a * a - (b / 2) ** 2));
  const TV = String.raw`(?:\((\d+)\)\/\((\d+)\)|(\d+(?:,\d+)?))`, tv = (p, q, d) => (d !== undefined ? num(d) : +p / +q);
  const W = (s, ...v) => R2(String.raw(s, ...v).replace(/TV/g, TV));
  const trig3 = (f, v) => { let s, c; if (f === "sin") { s = v; c = Math.sqrt(1 - v * v); } else if (f === "cos") { c = v; s = Math.sqrt(1 - v * v); } else { c = 1 / Math.sqrt(1 + v * v); s = v * c; } return { sin: s, cos: c, tan: s / c }; };
  T(null, W`(?:Pour un angle aigu α,|L'angle α est aigu et) (sin|cos|tan)α = TV\.? Calcule (?:la valeur exacte de )?(sin|cos|tan)α`, (f, p, q, d, g) => trig3(f, tv(p, q, d))[g], { raw: true });
  T(null, W`Pour un angle aigu α, sinα = TV et cosα = TV\. Calcule tanα`, (p, q, d, p2, q2, d2) => tv(p, q, d) / tv(p2, q2, d2), { raw: true });
  T(null, W`L'angle α est aigu et (sin|cos|tan)α = TV\. Calcule sin\^2α \+ cos\^2α \+ tanα · cosα`, (f, p, q, d) => 1 + trig3(f, tv(p, q, d)).sin, { raw: true });
  T(null, W`L'angle α est aigu et (sin|cos|tan)α = TV\. Calcule tan\(90° - α\)`, (f, p, q, d) => 1 / trig3(f, tv(p, q, d)).tan, { raw: true });
  T(null, W`L'angle α est aigu et (sin|cos|tan)α = TV\. Calcule (sin|cos)\(90° - α\)`, (f, p, q, d, g) => trig3(f, tv(p, q, d))[g === "sin" ? "cos" : "sin"], { raw: true });

  T(null, Z`triangle équilatéral a des côtés de # cm\. Calcule le rayon de son cercle circonscrit`, (c) => c / Math.sqrt(3));
  T(null, Z`triangle équilatéral a des côtés de # cm\. Calcule le rayon de son cercle inscrit`, (c) => c / (2 * Math.sqrt(3)));

  /* --- problèmes : mise en équation (probeq, probeq2) et systèmes (sysprob), 26.11 --- */
  const qroots = (a, b, c) => { const D = b * b - 4 * a * c; if (D < -1e-12) return []; const s = Math.sqrt(Math.max(D, 0)); return [(-b - s) / (2 * a), (-b + s) / (2 * a)].sort((u, w) => u - w); };
  const posRoot = (a, b, c) => { const r = qroots(a, b, c).filter((v) => v > 1e-9); return r.length === 1 || (r.length === 2 && Math.abs(r[0] - r[1]) < 1e-9) ? r[0] : NaN; };
  const sys2 = (a1, b1, c1, a2, b2, c2) => { const D = a1 * b2 - a2 * b1; return D ? { pair: [(c1 * b2 - c2 * b1) / D, (a1 * c2 - a2 * c1) / D] } : null; };
  const KM = { double: 2, triple: 3, quadruple: 4, quintuple: 5 };
  T(null, Z`a le (double|triple|quadruple|quintuple) de l'âge de (?:sa|son) [^.]*\. Dans # ans, (?:ils|elles) auront à eux deux # ans\. Quel âge a (?:le|la) [^?]* aujourd'hui`, (k, n, S) => { const K = KM[k], x = (num(S) - 2 * num(n)) / (K + 1); return K * x; }, { raw: true });
  T(null, Z`somme de # nombres entiers consécutifs vaut #\. Quel est le plus petit`, (n, S) => (S - (n * (n - 1)) / 2) / n);
  T(null, Z`somme de # nombres entiers consécutifs vaut #\. Quel est le plus grand`, (n, S) => (S - (n * (n - 1)) / 2) / n + n - 1);
  T(null, Z`le multiplie par #, puis (retire|ajoute) #\. \S+ le multiplie par #, puis (retire|ajoute) #\. Ils obtiennent le même résultat`, (a, o1, b, c, o2, d) => { const B = (o1 === "ajoute" ? 1 : -1) * num(b), D = (o2 === "ajoute" ? 1 : -1) * num(d); return (D - B) / (num(a) - num(c)); }, { raw: true });
  T(null, F`§F sont [^,]*, §F sont [^,]*, et les # autres [^.]*\. Combien y en a-t-il en tout`, (a, b, c, d, n) => n / (1 - a / b - c / d));
  T(null, Z`trapèze de petite base # m et de hauteur # m\. Quelle doit être la grande base \(en m\) pour que l'aire de la coupe soit # m²`, (b, h, A) => (2 * A) / h - b);
  T(null, Z`en # jours : en tout # \S+\. Chaque jour, \S+ (?:range|lit|fait|parcourt) # \S+ de plus que la veille\. Combien le premier jour`, (n, T0, k) => (T0 - (k * n * (n - 1)) / 2) / n);
  T(null, Z`part de \S+ à # km/h\. # h plus tard, une voiture part du même endroit, sur la même route, à # km/h\. Au bout de combien de temps`, (v1, d, v2) => (v1 * d) / (v2 - v1));
  T(null, Z`Les # élèves d'une classe vont au restaurant\. Au moment de payer, # d'entre eux ont oublié[^.]*\. Les autres paient chacun # CHF de plus`, (N, k, a) => ((N - k) * a) / k);
  T(null, Z`propose une (?:séance|entrée) à # CHF, ou un abonnement annuel à # CHF qui fait payer une (?:séance|entrée) # CHF\. Pour combien d'entrées`, (p, A, q) => A / (p - q));
  T(null, Z`salaire horaire d'un employé est de # CHF pour les # premières heures[^.]*une fois et demie le tarif normal\. Cette semaine, il a gagné # CHF\. Combien d'heures supplémentaires`, (r, h, G) => (G - r * h) / (1.5 * r));
  T(null, Z`entier positif n tel que son carré diminué de # soit égal à # fois le nombre suivant, augmenté de #`, (a, k, b) => posRoot(1, -k, -a - k - b));
  T(null, Z`entier positif n tel que son carré augmenté de # soit égal à # fois le nombre suivant, augmenté de #`, (a, k, b) => posRoot(1, -k, a - k - b));
  T(null, Z`produit de deux nombres entiers positifs consécutifs vaut #\. Quel est le plus petit`, (P) => posRoot(1, 1, -P));
  T(null, Z`produit de deux nombres entiers positifs consécutifs vaut #\. Quel est le plus grand`, (P) => posRoot(1, 1, -P) + 1);
  T(null, Z`Si l'on augmente de # cm le côté d'un carré, son aire augmente de # cm²`, (d, A) => (A - d * d) / (2 * d));
  T(null, Z`Deux nombres positifs ont pour somme # et pour produit #\. Quel est le plus grand`, (S, P) => qroots(1, -S, P)[1]);
  T(null, Z`Deux nombres positifs ont pour somme # et pour produit #\. Quel est le plus petit`, (S, P) => qroots(1, -S, P)[0]);
  T(null, Z`l'hypoténuse mesure # cm et l'un des côtés de l'angle droit dépasse l'autre de # cm\. Combien mesure le plus petit côté`, (c, d) => posRoot(2, 2 * d, d * d - c * c));
  T(null, /hauteur au-dessus de la mer est h\(t\) = ([^(]*?) \(en m[^.]*\. Au bout de combien de secondes touche-t-elle l'eau/i, (e) => { let F; try { F = Expr.parse(e.replace(/−/g, "-").replace(/,/g, ".").replace(/t/g, "x")); } catch (er) { return null; } const q = quad(F); return q ? posRoot(...q) : null; }, { raw: true });
  T(null, Z`photo de # cm sur # cm est entourée d'un cadre de largeur constante x\. L'ensemble \(photo et cadre\) a une aire de # cm²`, (a, b, A) => posRoot(4, 2 * (a + b), a * b - A));
  T(null, F`Un nombre positif augmenté de son inverse vaut §F\. Quel est ce nombre, s'il est plus grand que 1`, (p, q) => qroots(1, -p / q, 1)[1]);
  T(null, F`Un nombre positif augmenté de son inverse vaut §F\. Quel est ce nombre, s'il est plus petit que 1`, (p, q) => qroots(1, -p / q, 1)[0]);
  T(null, Z`jardin rectangulaire de # m sur # m est traversé par deux allées perpendiculaires de même largeur x[^.]*\. Le reste est du gazon\. Quelle largeur faut-il aux allées pour que les allées et le gazon aient la même aire`, (L, l) => qroots(1, -(L + l), (L * l) / 2)[0]);
  T(null, Z`on découpe un carré de # cm de côté à chaque coin, puis on plie les bords pour faire une boîte sans couvercle de # cm³\. Quel est le côté de la plaque`, (c, V) => 2 * c + Math.sqrt(V / c));
  T(null, Z`parcourt # km\. Si elle roulait # km/h plus vite, elle mettrait # h de moins\. Quelle est sa vitesse`, (D, k, t) => posRoot(t, t * k, -D * k));
  /* systèmes (réponse en couple) */
  T(null, Z`il y a # billets de # CHF et de # CHF, pour un total de # CHF`, (n, a, b, S) => sys2(1, 1, n, a, b, S));
  T(null, Z`et (?:sa sœur|son frère) ont ensemble # ans\. (?:La sœur|Le frère) a # ans de plus`, (S, d) => ({ pair: [(S - d) / 2, (S + d) / 2] }));
  T(null, Z`rectangle a un périmètre de # cm\. Sa longueur dépasse sa largeur de # cm`, (P, d) => ({ pair: [P / 4 + d / 2, P / 4 - d / 2] }));
  T(null, Z`mélange un café à # CHF/kg et un café à # CHF/kg\. Il obtient # kg de mélange qui valent # CHF`, (a, b, n, S) => sys2(1, 1, n, a, b, S));
  T(null, Z`parcourt # km en descendant une rivière en # h, et remonte la même distance en # h`, (D, t1, t2) => ({ pair: [(D / t1 + D / t2) / 2, (D / t1 - D / t2) / 2] }));
  T(null, Z`achète # boissons : des \S+ à # CHF et des \S+ à # CHF\. Elle dépense exactement # CHF`, (n, a, b, S) => sys2(1, 1, n, a, b, S));
  T(null, Z`solution de sirop à # % de sucre et une autre à # %, pour obtenir # L à # %`, (p, q, n, r) => sys2(1, 1, n, p / 100, q / 100, (n * r) / 100));
  T(null, Z`deux villes distantes de # km, l'un vers l'autre, à # km/h et # km/h`, (D, v1, v2) => ({ pair: [D / (v1 + v2), (v1 * D) / (v1 + v2)] }));
  TE(null, Z`nombre de deux chiffres a une somme des chiffres égale à #\. Si on permute ses chiffres, on obtient un nombre plus grand de #`, (s, k) => { const u = (s + k / 9) / 2, d = s - u; return Number.isInteger(u) && Number.isInteger(d) ? 10 * d + u : NaN; });
  TE(null, Z`nombre de deux chiffres a une somme des chiffres égale à #\. Si on permute ses chiffres, on obtient un nombre plus petit de #`, (s, k) => { const d = (s + k / 9) / 2, u = s - d; return Number.isInteger(u) && Number.isInteger(d) ? 10 * d + u : NaN; });

  /* ---------- défis (niveau 4) rendus aléatoires le 26.11 (agent defis2) : un oracle par contexte, partie par partie ----------
     Le texte reçu est « énoncé ¶ question » ; NaN = énoncé incohérent (signalé « recalcul impossible »). */
  const nn = (s) => +String(s).replace(/[\s'’]/g, "").replace(",", ".").replace("−", "-");
  const DF = (ids, re, f) => T(ids, re, (txt) => { const m = re.exec(txt); if (!m || !/ ¶ /.test(txt)) return null; /* parties de défi seulement */ const lab = txt.split(" ¶ ").slice(1).join(" ¶ "); return f(m.slice(1), lab, txt); }, { text: true });
  const lm = (lab, re) => { const m = re.exec(lab); return m ? m.slice(1).map(nn) : null; };
  const simpson = (g, a, b, n = 4000) => { const h = (b - a) / n; let s = g(a) + g(b); for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * g(a + i * h); return (s * h) / 3; };
  const erfPhi = (z) => { const t = 1 / (1 + 0.2316419 * Math.abs(z)), d = 0.3989422804014327 * Math.exp((-z * z) / 2), p = d * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429)))); return z >= 0 ? 1 - p : p; };
  const jsf = (s) => { const e = String(s).replace(/√\(/g, "Math.sqrt(").replace(/\^/g, "**").replace(/(\d)\s*x/g, "$1*x").replace(/−/g, "-"); if (/[^-+*/().\d\sxMathsqr]/.test(e)) return null; try { return new Function("x", "return " + e); } catch (e2) { return null; } };
  /* polynôme « -x^2 + 3x - 4 » → [a, b, c] */
  const poly = (s) => { const c = [0, 0, 0]; for (const t of String(s).replace(/−/g, "-").replace(/\s+/g, "").replace(/-/g, "+-").split("+").filter(Boolean)) { const m = /^(-?\d*(?:\.\d+)?)(x(?:\^2)?)?$/.exec(t); if (!m) return null; const k = m[1] === "" ? 1 : m[1] === "-" ? -1 : +m[1]; c[m[2] === "x^2" ? 0 : m[2] === "x" ? 1 : 2] += m[2] ? k : +m[1]; } return c; };
  /* symax (6e, fr_fin) */
  DF("symax", /AB = (\d+) cm, BC = (\d+) cm, AC = (\d+) cm et pour angles ∠A = (\d+)°, ∠B = (\d+)°/, (g, lab) => { const [ab, bc, ac, A, B] = g.map(nn), deg = (x, y, o) => (Math.acos((x * x + y * y - o * o) / (2 * x * y)) * 180) / Math.PI;
    if (Math.abs(deg(ab, ac, bc) - A) > 0.6 || Math.abs(deg(ab, bc, ac) - B) > 0.6) return NaN; return /A'B'/.test(lab) ? ab : /A'C'/.test(lab) ? ac : /angle/.test(lab) ? 180 - A - B : /Périmètre/.test(lab) ? 2 * ab + 2 * ac : null; });
  DF("symax", /statue S est à (\d+) m de l'axe ; un banc B est à (\d+) m de l'axe, du même côté/, (g, lab) => { const [d, b] = g.map(nn); return /SS'/.test(lab) ? 2 * d : /S'B'/.test(lab) ? d - b : /SB'/.test(lab) ? d + b : null; });
  DF("symax", /longueur AB = (\d+) cm et pour largeur BC = (\d+(?:,\d+)?) cm\. On trace son symétrique par rapport à la droite \(BC\)/, (g, lab) => { const [L, l] = g.map(nn); return /AA'/.test(lab) ? 2 * L : /Périmètre/.test(lab) ? 2 * (2 * L + l) : /Aire/.test(lab) ? 2 * L * l : null; });
  /* mediatrice (6e, fr_fin) */
  DF("mediatrice", /AB = (\d+) m, BC = (\d+) m et la distance PA = (\d+) m/, (g, lab) => { const [ab, bc, r] = g.map(nn); if (ab >= 2 * r || bc >= 2 * r) return NaN; return /PB \(/.test(lab) ? r : /PAB/.test(lab) ? 2 * r + ab : /PBC/.test(lab) ? 2 * r + bc : null; });
  DF("mediatrice", /distants de (\d+) km\. .*? à (\d+(?:,\d+)?) km de A\./, (g, lab) => { const [ab, x] = g.map(nn); if (x <= ab / 2) return NaN; return /MB/.test(lab) ? x : /AI/.test(lab) ? ab / 2 : /trajet/.test(lab) ? 2 * x : null; });
  DF("mediatrice", /\[AB\] mesure (\d+) cm ; .*?CA = (\d+) cm et DA = (\d+) cm/, (g, lab) => { const [t, c, d] = g.map(nn); if (c <= t / 2 || d <= t / 2) return NaN; return /tour/.test(lab) ? 2 * c + 2 * d : /CB/.test(lab) ? c : /DB/.test(lab) ? d : null; });
  /* echelle6 (6e, fr_fin) */
  DF("echelle6", /carte au 1\/([\d ]+), .*?: (\d+(?:,\d+)?) cm, puis (\d+(?:,\d+)?) cm, puis (\d+(?:,\d+)?) cm/, (g, lab) => { const [s, a, b, c] = g.map(nn), cm = a + b + c, km = (cm * s) / 100000, v = lm(lab, /à (\d+) km\/h/);
    return /sur la carte/.test(lab) ? cm : /réelle \(km\)/.test(lab) ? km : v ? (km / v[0]) * 60 : null; });
  DF("echelle6", /plan d'un appartement au 1\/(\d+), .*? rectangle de (\d+(?:,\d+)?) cm sur (\d+(?:,\d+)?) cm/, (g, lab) => { const [s, a, b] = g.map(nn); return /Longueur/.test(lab) ? (a * s) / 100 : /Largeur/.test(lab) ? (b * s) / 100 : /Aire/.test(lab) ? (a * s * b * s) / 10000 : null; });
  DF("echelle6", /maquette .*? au 1\/(\d+)\. En réalité, il mesure ([\d ]+) m de long\. Sur la maquette, .*? mesure (\d+(?:,\d+)?) cm/, (g, lab) => { const [s, L, h] = g.map(nn), s2 = lm(lab, /au 1\/(\d+)/);
    return s2 ? (L * 100) / s2[0] : /Longueur de la maquette/.test(lab) ? (L * 100) / s : /Hauteur réelle/.test(lab) ? (h * s) / 100 : null; });
  /* proba6 (6e, fr_fin) */
  DF("proba6", /contient (\d+) \S+ [^,]+, (\d+) \S+ [^,]+ et (\d+) \S+ .+?\. On en tire un au hasard/, (g, lab) => { const [r, b, v] = g.map(nn), T = r + b + v, t = lm(lab, /soit (\d+(?:,\d+)?)$/);
    return t ? T - r / t[0] : /ne pas tirer/.test(lab) ? (r + b) / T : /Probabilité de tirer/.test(lab) ? r / T : null; });
  DF("proba6", /partagée en (\d+) secteurs égaux : (\d+) rouges?, (\d+) jaunes? et les autres bleus/, (g, lab) => { const [n, r, j] = g.map(nn), t = lm(lab, /P\(rouge\) = (\d+(?:,\d+)?)/);
    return t ? t[0] * n - r : /ne pas tomber sur le bleu/.test(lab) ? (r + j) / n : /tomber sur le rouge/.test(lab) ? r / n : null; });
  DF("proba6", /contient (\d+) cartes numérotées de 1 à (\d+)\./, (g, lab) => { const [n, N] = g.map(nn); if (n !== N) return NaN; const cnt = (p) => Array.from({ length: N }, (_, i) => i + 1).filter(p).length, m = lm(lab, /multiples? de (\d+)/), k = lm(lab, /supérieur ou égal à (\d+)/);
    return /reste-t-il/.test(lab) && m ? N - cnt((u) => u % m[0] === 0) : m ? cnt((u) => u % m[0] === 0) / N : k ? cnt((u) => u >= k[0]) / N : null; });
  /* empil (5e, fr_fin) */
  DF("empil", /pyramide de cubes à étages carrés/, (g, lab) => { const p = lm(lab, /pyramide de (\d+) étages/), d = lm(lab, /vue de dessus \((\d+) étages\)/); let s = 0; if (p) for (let i = 1; i <= p[0]; i++) s += i * i; return p ? s : d ? d[0] * d[0] : null; });
  DF("empil", /escalier de (\d+) marches .*?l'escalier a (\d+) cubes de largeur/, (g, lab) => { const [n, p] = g.map(nn); let prof = 0; for (let i = 1; i <= n; i++) prof += i; return /vue de côté/.test(lab) ? prof : /Nombre de cubes/.test(lab) ? prof * p : /vue de dessus/.test(lab) ? n * p : null; });
  DF("empil", /contour d'un carré de (\d+) cubes de côté .*?la tour a (\d+) étages/, (g, lab) => { const [c, h] = g.map(nn); let b = 0; for (let i = 0; i < c; i++) for (let j = 0; j < c; j++) if (i === 0 || j === 0 || i === c - 1 || j === c - 1) b++;
    return /d'un étage/.test(lab) ? b : /de la tour/.test(lab) ? b * h : /remplir/.test(lab) ? (c * c - b) * h : null; });
  /* compdiff (2nde, fr_fin) */
  DF("compdiff", /A coûte (\d+(?:,\d+)?) € pour (\d+) g, B coûte (\d+(?:,\d+)?) € pour (\d+) g/, (g, lab) => { const [a, ma, b, mb] = g.map(nn), pa = a / (ma / 1000), pb = b / (mb / 1000); return /Prix de A/.test(lab) ? pa : /Prix de B/.test(lab) ? pb : /Quotient/.test(lab) ? pa / pb : null; });
  DF("compdiff", /passée de ([\d ]+) à ([\d ]+) habitants, et le village B de ([\d ]+) à ([\d ]+) habitants/, (g, lab) => { const [p1, p2, q1, q2] = g.map(nn); return /Augmentation de A/.test(lab) ? p2 - p1 : /Augmentation de B/.test(lab) ? q2 - q1 : /Quotient/.test(lab) ? q2 / q1 : null; });
  DF("compdiff", /consommé (\d+(?:,\d+)?) L d'essence pour (\d+) km, la voiture B (\d+(?:,\d+)?) L pour (\d+) km/, (g, lab) => { const [la, da, lb, db] = g.map(nn), ca = (100 * la) / da, cb = (100 * lb) / db; return /de A aux/.test(lab) ? ca : /de B aux/.test(lab) ? cb : /Différence/.test(lab) ? ca - cb : null; });
  /* posrelc (1re, fr_fin) : racines et extremum de la différence */
  const diffQ = (F, G, lab) => { if (!F || !G) return null; const [a, b, c] = [F[0] - G[0], F[1] - G[1], F[2] - G[2]], D = b * b - 4 * a * c; if (!a || D <= 0) return NaN; const r = [(-b - Math.sqrt(D)) / (2 * a), (-b + Math.sqrt(D)) / (2 * a)].sort((u, v) => u - v);
    return /Plus petite/.test(lab) ? r[0] : /Plus grande/.test(lab) ? r[1] : /(?:minimale|maximal)/.test(lab) ? c - (b * b) / (4 * a) : null; };
  DF("posrelc", /Soit f\(x\) = (.+?) et g\(x\) = (.+?)\. On étudie/, (g, lab) => diffQ(poly(g[0]), poly(g[1]), lab));
  DF("posrelc", /C\(x\) = (.+?) et la recette R\(x\) = (.+?), en milliers/, (g, lab) => diffQ(poly(g[1]), poly(g[0]), lab));
  /* intmaj (Tle, fr_fin) : monotonie vérifiée, encadrement contrôlé par l'intégrale (Simpson) */
  DF("intmaj", /Soit ([IJ]) = _(\d+)\^(\d+) (.+?) dx\. La fonction x .+? est (croissante|décroissante)/, (g, lab) => { const a = nn(g[1]), b = nn(g[2]), f = jsf(g[3]), cr = g[4] === "croissante"; if (!f) return null;
    for (let i = 0; i < 40; i++) { const u = a + ((b - a) * i) / 40, v = a + ((b - a) * (i + 1)) / 40; if (cr ? f(v) < f(u) : f(v) > f(u)) return NaN; }
    const L = b - a, lo = L * Math.min(f(a), f(b)), hi = L * Math.max(f(a), f(b)), I = simpson(f, a, b); if (I < lo || I > hi) return NaN;
    const at = lm(lab, /en (\d+)$/); return at ? f(at[0]) : /Amplitude/.test(lab) ? hi - lo : /Minorant/.test(lab) ? lo : /Majorant/.test(lab) ? hi : /Centre/.test(lab) ? (lo + hi) / 2 : null; });
  DF("intmaj", /d\(t\) = (\d+) \+ √\(t\), .*?entre 0 et (\d+) minutes/, (g, lab) => { const [c, T] = g.map(nn), f = (t) => c + Math.sqrt(t); return /au départ/.test(lab) ? f(0) : /au bout/.test(lab) ? f(T) : /Majorant/.test(lab) ? T * f(T) : null; });
  /* suiteint (Tle, fr_fin) : intégrales recalculées par Simpson */
  DF("suiteint", /I_n = _0\^ 1 x\^n\(([^)]+)\)(\^2)? dx/, (g, lab) => { const h = jsf(g[0]), p = g[1] ? 2 : 1; if (!h) return null; const I = (n) => simpson((x) => x ** n * h(x) ** p, 0, 1, n > 200 ? 200000 : 4000);
    const k = lm(lab, /^\S+ I_(\d+)/), s = lm(lab, /I_n < \(1\)\/\((\d+)\)/);
    if (s) { for (let n = 0; n < 100; n++) if (I(n) < 1 / s[0]) return n; return NaN; }
    if (/Limite de n I_n/.test(lab)) { const L = 2 * (2000 * I(2000)) - 1000 * I(1000); return Math.abs(L - Math.round(L)) < 0.01 ? Math.round(L) : L; }
    return k ? I(k[0]) : null; });
  /* isom (9e, perco) */
  DF("isom", /au point A\((-?\d+) ; (-?\d+)\) la symétrie d'axe (vertical|horizontal) [xy] = (-?\d+), puis la symétrie d'axe \S+ [xy] = (-?\d+)\./, (g, lab) => { const [px, py, , a, b] = g.map(nn), p = g[2] === "vertical" ? px : py, X1 = 2 * a - p, X2 = 2 * b - X1;
    return /1re symétrie/.test(lab) ? X1 : /image finale/.test(lab) ? X2 : /glissé/.test(lab) ? X2 - p : null; });
  DF("isom", /sommets A\((-?\d+) ; (-?\d+)\), B\((-?\d+) ; (-?\d+)\) et C\((-?\d+) ; (-?\d+)\)\. On lui applique la symétrie de centre [^(]*\((-?\d+) ; (-?\d+)\)/, (g, lab) => { const [ax, ay, bx, by, cx, cy, h, k] = g.map(nn);
    return /Abscisse de B'/.test(lab) ? 2 * h - bx : /Ordonnée de C'/.test(lab) ? 2 * k - cy : /Aire/.test(lab) ? Math.abs((bx - ax) * (cy - ay) - (cx - ax) * (by - ay)) / 2 : null; });
  DF("isom", /envoie le point B\((-?\d+) ; (-?\d+)\) sur le point C\((-?\d+) ; (-?\d+)\)\. Un sommet du motif est A\((-?\d+) ; (-?\d+)\)/, (g, lab) => { const [bx, by, cx, cy, ax, ay] = g.map(nn);
    return /Abscisse de A'(?!')/.test(lab) ? ax + cx - bx : /Ordonnée de A'/.test(lab) ? ay + cy - by : /A''/.test(lab) ? ax + 2 * (cx - bx) : null; });
  /* numer (9e, perco) */
  const romVal = (s) => { const V = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }; let t = 0; for (let i = 0; i < s.length; i++) t += V[s[i]] < (V[s[i + 1]] || 0) ? -V[s[i]] : V[s[i]]; return t; };
  DF("numer", /(?:inscription|la date|construction :) ([MDCLXVI]{3,}) \./, (g, lab) => { const v = romVal(g[0]); return /Année/.test(lab) ? v : /jusqu'en 2026/.test(lab) ? 2026 - v : /symboles/.test(lab) ? g[0].length : null; });
  DF("numer", /en binaire : ([01]+) (?:puis|et) ([01]+) \./, (g, lab) => { const a = parseInt(g[0], 2), b = parseInt(g[1], 2); return lab.startsWith("a)") ? a : lab.startsWith("b)") ? b : /somme/.test(lab) ? a + b : null; });
  DF("numer", /un scribe écrit un nombre avec (.+?)\./, (g, lab) => { const c = (re) => { const m = re.exec(g[0]); return m ? +m[1] : 0; }, n = 1000 * c(/(\d+) fleurs? de lotus/) + 100 * c(/(\d+) cordes? enroulées?/) + 10 * c(/(\d+) anses?/) + c(/(\d+) bâtons?/), ds = (x) => String(x).split("").reduce((s, z) => s + +z, 0);
    return /Quel est ce nombre/.test(lab) ? n : /a-t-il utilisés/.test(lab) ? ds(n) : /double/.test(lab) ? ds(2 * n) : null; });
  /* approxnorm (4e Collège, ch4c_trous) : table de Φ contrôlée, z recalculé */
  const tabPhi = (txt) => { const m = /On donne [^(]*\((\d+(?:,\d+)?)\) ≈ (\d+(?:,\d+)?)/.exec(txt); if (!m) return null; const z = nn(m[1]), p = nn(m[2]); return Math.abs(erfPhi(z) - p) < 6e-5 ? [z, p] : [z, NaN]; };
  DF("approxnorm", /vend (\d+) billets pour un vol de (\d+) places ; chaque passager se présente avec la probabilité (\d+(?:,\d+)?)/, (g, lab, txt) => { const [n, S, p] = g.map(nn), mu = n * p, s = Math.sqrt(n * p * (1 - p)), t = tabPhi(txt);
    if (/moyen/.test(lab)) return mu; if (/Écart-type/.test(lab)) return s; if (!t || !(Math.abs((S + 0.5 - mu) / s - t[0]) <= 1e-9)) return NaN; return 1 - t[1]; });
  DF("approxnorm", /(\d+) graines ; chacune germe avec la probabilité (\d+(?:,\d+)?)/, (g, lab, txt) => { const [n, p] = g.map(nn), mu = n * p, s = Math.sqrt(n * p * (1 - p)), t = tabPhi(txt), k = lm(lab, /au moins (\d+) graines/);
    if (/Moyenne/.test(lab)) return mu; if (/Écart-type/.test(lab)) return s; if (!k) return null; if (!t || !(Math.abs((mu - (k[0] - 0.5)) / s - t[0]) <= 1e-9)) return NaN; return t[1]; });
  DF("approxnorm", /(?:On lance (\d+) fois une pièce équilibrée|On interroge ([\d' ]+) personnes)/, (g, lab, txt) => { const n = nn(g[0] || g[1]), mu = n / 2, s = Math.sqrt(n / 4), t = tabPhi(txt), I = lm(lab, /P\((\d+) ≤ X ≤ (\d+)\)/);
    if (/Moyenne/.test(lab)) return mu; if (/Écart-type/.test(lab)) return s; if (!I) return null; if (!t || I[0] + I[1] !== 2 * mu || !(Math.abs((I[1] + 0.5 - mu) / s - t[0]) <= 1e-9)) return NaN; return 2 * t[1] - 1; });

  /* ==== défis rendus variés (agent defis3, 26.11 soir) ==== */
  /* Même modèle que les défis du soir (DF : « énoncé ¶ question », un oracle par contexte). WST3 : arrondi annoncé en mots. */
  const WST3 = (lab) => (/au million/.test(lab) ? 1e6 : /centaine de milliers/.test(lab) ? 1e5 : /dizaine de milliers/.test(lab) ? 1e4 : /au millier/.test(lab) ? 1e3 : /à la centaine/.test(lab) ? 100 : /à la dizaine/.test(lab) ? 10 : /à l'unité/.test(lab) ? 1 : null);
  const QF = "\\((\\d+)\\)\\/\\((\\d+)\\)";
  /* fracmul (11e, ch11_no) */
  DF("fracmul", new RegExp("([\\d']+) (?:hectares|élèves|m²) : les " + QF + " [^;]+; les " + QF), (g, lab) => { const [n, a, b, c, e] = g.map(nn), f = (a / b) * (c / e);
    return lab.startsWith("a)") ? (n * a) / b : /Fraction/.test(lab) ? f : lab.startsWith("c)") ? n * f : null; });
  DF("fracmul", new RegExp("(?:mesure|contient) (\\d+) (?:m|L)\\..*?\\(\\(1\\)\\/\\((\\d+)\\)\\), puis .*? de " + QF + " (?:m|L)\\."), (g, lab) => { const [L, k, p, q] = g.map(nn), rest = L - L / k;
    return lab.startsWith("a)") ? L / k : lab.startsWith("b)") ? rest : lab.startsWith("c)") ? rest / (p / q) : null; });
  /* fracconv (11e, ch11_no) */
  DF("fracconv", new RegExp("au même prix de (\\d+) CHF\\. Le premier fait un rabais de " + QF + " du prix, le deuxième un rabais de (\\d+) %, le troisième augmente d'abord son prix de (\\d+) %, puis retire (\\d+,\\d+) du nouveau prix"), (g, lab) => { const [P0, a, b, p, h, d] = g.map(nn);
    return lab.startsWith("a)") ? P0 * (1 - a / b) : lab.startsWith("b)") ? (P0 * (100 - p)) / 100 : lab.startsWith("c)") ? P0 * (1 + h / 100) * (1 - d) : null; });
  DF("fracconv", /Nombres périodiques/, (g, lab) => { let m;
    if ((m = /^a\) 0,(\d)\1\1…/.exec(lab))) return +m[1] / 9; if ((m = /^b\) 0,(\d\d)\1…/.exec(lab))) return +m[1] / 99; if ((m = /^c\) 0,(\d)999…/.exec(lab))) return (+m[1] + 1) / 10; return null; });
  DF("fracconv", new RegExp("sondage auprès de ([\\d']+) élèves, les " + QF + " préfèrent .+?, (\\d+) % préfèrent"), (g, lab) => { const [n, a, b, p] = g.map(nn), r = 100 - (100 * a) / b - p;
    return lab.startsWith("a)") ? a / b : lab.startsWith("b)") ? (n * a) / b : lab.startsWith("c)") ? r : lab.startsWith("d)") ? (n * r) / 100 : null; });
  /* sci (11e, defis.js) */
  DF("sci", /^(?:Un|Une) .+? (?:a un diamètre d'environ|mesure environ) (\d+(?:,\d+)?) · 10\^(-\d+) m\./, (g, lab) => { const d = nn(g[0]) * 10 ** nn(g[1]), u = lm(lab, /1 (?:nm|µm) = 10(⁻⁹|⁻⁶) m/);
    if (lab.startsWith("a)") && u) return d / (u[0] === undefined ? NaN : /⁻⁹/.test(lab) ? 1e-9 : 1e-6); if (lab.startsWith("b)")) { const st = WST3(lab); return st ? { v: 1e-3 / d, st } : null; } return null; });
  DF("sci", /Le rayon de .+? vaut environ (\d+(?:,\d+)?) · 10\^3 km/, (g, lab) => { const r = nn(g[0]) * 1000; return lab.startsWith("a)") ? r * 1000 : lab.startsWith("b)") && WST3(lab) ? { v: 2 * Math.PI * r, st: WST3(lab) } : null; });
  DF("sci", /est à environ (\d+(?:,\d+)?) · 10\^(\d+) km du Soleil\. La lumière parcourt 3 · 10\^5 km par seconde/, (g, lab) => { const [m, e] = g.map(nn), t = (m * 10 ** e) / 3e5, me = Math.floor(Math.log10(m * 10 ** (e + 3)));
    return lab.startsWith("a)") ? me : lab.startsWith("b)") ? t : lab.startsWith("c)") ? t / 60 : null; });
  /* scicalc (11e, ch11_no) */
  DF("scicalc", /La lumière va à 3 · 10\^5 km\/s, et une année compte environ 3,15 · 10\^7 s\. L'étoile .+? est à (\d+(?:,\d+)?) années-lumière/, (g, lab) => { const al = 3e5 * 3.15e7, D = nn(g[0]) * al;
    return lab.startsWith("a)") ? al : /deux décimales/.test(lab) ? { v: D, st: 10 ** (Math.floor(Math.log10(D)) - 2) } : null; });
  DF("scicalc", /contient environ (\d+(?:,\d+)?) L de sang, et chaque mm³ de sang contient environ (\d+(?:,\d+)?) · 10\^6 globules/, (g, lab) => { const [V, c] = g.map(nn); return lab.startsWith("a)") ? 1e6 : lab.startsWith("b)") ? V * 1e6 * c * 1e6 : null; });
  DF("scicalc", /un cœur bat environ (\d+) fois par minute\. Une année compte environ 5,26 · 10\^5 minutes/, (g, lab) => { const an = nn(g[0]) * 5.26e5, A = lm(lab, /en (\d+) ans/), v = lab.startsWith("a)") ? an : A ? an * A[0] : null;
    return v === null ? null : { v, st: 10 ** (Math.floor(Math.log10(v)) - 1) }; });
  const NR = "(\\d+(?:,\\d+)?)";
  /* pythfig (11e, ch11_gm) */
  DF("pythfig", /(\d+) cm de (?:long|large), (\d+) cm de (?:large|profondeur) et (\d+) cm de haut\. On veut y ranger, en diagonale, .+? (\d+) cm\./, (g, lab) => { const [a, b, c, L] = g.map(nn), d = Math.sqrt(a * a + b * b + c * c);
    return lab.startsWith("a)") ? Math.sqrt(a * a + b * b) : lab.startsWith("b)") ? d : lab.startsWith("c)") ? { v: L < d ? 1 : 0, sol: false } : null; });
  DF("pythfig", /de rayon (\d+) (?:cm|m)\b.*?carré.*?coins touchent/, (g, lab) => { const r = nn(g[0]); return lab.startsWith("a)") ? 2 * r : lab.startsWith("b)") ? 2 * r * r : lab.startsWith("c)") ? Math.PI * r * r - 2 * r * r : null; });
  /* pythrec (11e, ch11_gm) */
  DF("pythrec", /A\((-?\d+) ; (-?\d+)\), B\((-?\d+) ; (-?\d+)\) et C\((-?\d+) ; (-?\d+)\)/, (g, lab) => { const [ax, ay, bx, by, cx, cy] = g.map(nn), ab = (ax - bx) ** 2 + (ay - by) ** 2, bc = (bx - cx) ** 2 + (by - cy) ** 2, ac = (ax - cx) ** 2 + (ay - cy) ** 2, S = [ab, bc, ac].sort((u, v) => u - v);
    return lab.startsWith("a)") ? ab : lab.startsWith("b)") ? bc : lab.startsWith("c)") ? ac : lab.startsWith("d)") ? { v: S[0] + S[1] === S[2] ? 1 : 0, sol: false } : null; });
  DF("pythrec", /On prend n = (\d+)\./, (g, lab) => { const n = nn(g[0]); return lab.startsWith("a)") ? n * n + 1 : lab.startsWith("b)") ? (n * n - 1) ** 2 + 4 * n * n : lab.startsWith("c)") ? (n * n + 1) ** 2 : null; });
  DF("pythrec", /deux côtés mesurent (\d+) cm et (\d+) cm, et la diagonale mesure (\d+) cm/, (g, lab) => { const [a, b, d] = g.map(nn); return lab.startsWith("a)") ? a * a + b * b : lab.startsWith("b)") ? d * d : lab.startsWith("c)") ? { v: a * a + b * b === d * d ? 1 : 0, sol: false } : null; });
  /* vol (10e–11e, ch11_gm) */
  DF("vol", new RegExp("piscine de (\\d+) m de long et (\\d+) m de large a une profondeur de " + NR + " m d'un côté et " + NR + " m de l'autre"), (g, lab) => { const [L, l, h1, h2] = g.map(nn), A = ((h1 + h2) * L) / 2;
    return lab.startsWith("a)") ? A : lab.startsWith("b)") ? A * l : lab.startsWith("c)") ? A * l * 1000 : null; });
  DF("vol", new RegExp("profil en trapèze : " + NR + " m de large en haut, " + NR + " m au fond et " + NR + " m de profondeur\\. Il mesure (\\d+) m de long"), (g, lab) => { const [B, b, h, L] = g.map(nn), A = ((B + b) * h) / 2;
    return lab.startsWith("a)") ? A : lab.startsWith("b)") ? A * L : lab.startsWith("c)") ? A * L * 1000 : null; });
  DF("vol", new RegExp("triangle de " + NR + " m de base et " + NR + " m de haut, et la tente mesure " + NR + " m de long"), (g, lab) => { const [b, h, L] = g.map(nn), A = (b * h) / 2;
    return lab.startsWith("a)") ? A : lab.startsWith("b)") ? A * L : lab.startsWith("c)") ? A * L * 1000 : null; });
  DF("vol", new RegExp("doit contenir (\\d+) cL\\. Son rayon intérieur est de " + NR + " cm"), (g, lab) => { const [c, r] = g.map(nn), V = 10 * c, A = Math.PI * r * r;
    return lab.startsWith("a)") ? V : lab.startsWith("b)") ? A : lab.startsWith("c)") ? V / A : null; });
  /* airepyr (11e, ch11_gm) */
  DF("airepyr", new RegExp("base carrée de " + NR + " (?:m|cm) de côté et de " + NR + " (?:m|cm) de haut"), (g, lab) => { const [c, h] = g.map(nn), a = Math.sqrt(h * h + (c * c) / 4);
    return lab.startsWith("a)") ? a : lab.startsWith("b)") ? 2 * c * a : lab.startsWith("c)") ? (c * c * h) / 3 : null; });
  DF("airepyr", /un carré de (\d+) cm de côté et quatre triangles isocèles d'apothème \(hauteur\) (\d+) cm/, (g, lab) => { const [c, a] = g.map(nn), h = Math.sqrt(a * a - (c * c) / 4);
    return lab.startsWith("a)") ? c * c + 2 * c * a : lab.startsWith("b)") ? h : lab.startsWith("c)") ? (c * c * h) / 3 : null; });
  /* volcomp (11e, ch11_gm) */
  DF("volcomp", new RegExp("cylindre de rayon " + NR + " m et de hauteur " + NR + " m, avec un fond en cône de même rayon et de hauteur " + NR + " m"), (g, lab) => { const [r, H, h] = g.map(nn), Vc = Math.PI * r * r * H, Vk = (Math.PI * r * r * h) / 3;
    return lab.startsWith("a)") ? Vc : lab.startsWith("b)") ? Vk : lab.startsWith("c)") ? (Vc + Vk) * 1000 : null; });
  DF("volcomp", /un cube de (\d+) cm d'arête surmonté d'une pyramide de même base et de (\d+) cm de hauteur/, (g, lab) => { const [a, h] = g.map(nn), rho = lm(lab, /pèse (\d+(?:,\d+)?) g/);
    return lab.startsWith("a)") ? a ** 3 : lab.startsWith("b)") ? (a * a * h) / 3 : rho ? (a ** 3 + (a * a * h) / 3) * rho[0] : null; });
  /* thales (11e, ch11_thales) */
  DF("thales", new RegExp("de " + NR + " m de haut a une ombre de " + NR + " m, et l'ombre .+? mesure " + NR + " m\\."), (g, lab) => { const [h1, s1, S] = g.map(nn), h3 = lm(lab, /arbre de (\d+) m/);
    return lab.startsWith("a)") ? S / s1 : lab.startsWith("b)") ? (S * h1) / s1 : h3 ? (h3[0] * s1) / h1 : null; });
  DF("thales", new RegExp("AD = " + NR + "(?: d?m)?, DB = " + NR + "(?: d?m)?, AE = " + NR + "(?: d?m)? et DE = " + NR), (g, lab) => { const [a, b, c, d] = g.map(nn), k = (a + b) / a;
    return lab.startsWith("a)") ? a + b : lab.startsWith("b)") ? c * k : lab.startsWith("c)") ? d * k : lab.startsWith("d)") ? b + d * k + (c * k - c) + d : null; });
  DF("thales", /AD = (\d+) m, DB = (\d+) m et DE = (\d+) m/, (g, lab) => { const [a, b, d] = g.map(nn); return lab.startsWith("a)") ? a + b : lab.startsWith("b)") ? (d * (a + b)) / a : null; });
  /* repere (10e–11e, ch11_fct) */
  DF("repere", /A\((-?\d+) ; (-?\d+)\), B\((-?\d+) ; (-?\d+)\) et C\((-?\d+) ; (-?\d+)\)/, (g, lab, txt) => { const [ax, ay, bx, by, cx, cy] = g.map(nn), D = [ax + cx - bx, ay + cy - by], ar = Math.abs((bx - ax) * (D[1] - ay) - (by - ay) * (D[0] - ax));
    return lab.startsWith("a)") ? D[0] : lab.startsWith("b)") ? D[1] : lab.startsWith("c)") ? ar : lab.startsWith("d)") ? ar * (/1 carreau = 10 m/.test(txt) ? 100 : /1 carreau = 8 pixels/.test(txt) ? 64 : NaN) : null; });
  DF("repere", /M\((-?\d+) ; (-?\d+)\)/, (g, lab, txt) => { const [mx, my] = g.map(nn), a = /A\((-?\d+) ; (-?\d+)\)/.exec(txt); if (!a) return null;
    return lab.startsWith("a)") ? 2 * mx - nn(a[1]) : lab.startsWith("b)") ? 2 * my - nn(a[2]) : null; });
  /* sysprob (11e–1re, ch1c_sys) : têtes et pattes ; vitesses avec et contre le vent ou le courant */
  DF("sysprob", /on compte (\d+) (?:têtes|véhicules|sièges) et (\d+) (?:pattes|roues|pieds)/, (g, lab, txt) => { const [T, P0] = g.map(nn), l1 = /tabourets à 3 pieds/.test(txt) ? 3 : 2, l2 = 4, b = (P0 - l1 * T) / (l2 - l1);
    return lab.startsWith("a)") ? T - b : lab.startsWith("b)") ? b : null; });
  DF("sysprob", /parcourt ([\d']+) km .*?en (\d+) h .*?, et en (\d+) h/, (g, lab) => { const [D, t1, t2] = g.map(nn), s1 = D / t1, s2 = D / t2;
    return lab.startsWith("a)") ? s1 : lab.startsWith("b)") ? s2 : lab.startsWith("c)") ? (s1 + s2) / 2 : lab.startsWith("d)") ? (s1 - s2) / 2 : null; });
  /* sysgraph (1re Collège, ch1c_sys) */
  DF("sysgraph", /cases (-?\d*)x ([+-]) (\d*)y = (-?\d+) \\ (\d+)x \+ my = k cases/, (g, lab) => { const a1 = g[0] === "" ? 1 : g[0] === "-" ? -1 : nn(g[0]), b1 = (g[1] === "-" ? -1 : 1) * (g[2] === "" ? 1 : nn(g[2])), c1 = nn(g[3]), a2 = nn(g[4]), f = a2 / a1, mk = lm(lab, /m = (\d+) et k = (-?\d+)/);
    if (lab.startsWith("a)")) return f * b1; if (lab.startsWith("b)")) return f * c1;
    if (!mk) return null; const [m, k] = mk, det = a1 * m - b1 * a2; if (!det) return NaN;
    return lab.startsWith("c)") ? (c1 * m - b1 * k) / det : lab.startsWith("d)") ? (a1 * k - a2 * c1) / det : null; });
  DF("sysgraph", /A (?:coûte|demande) ([\d,]+) CHF (?:par mois|de frais de dossier|par an) plus ([\d,]+) CHF (?:la minute|de l'heure|la séance) ; (?:B|l'agence B|la formule B) (?:coûte|demande) ([\d,]+) CHF/, (g, lab) => { const [F, pA, pB] = g.map(nn), n = lm(lab, /pour (\d+) /);
    return lab.startsWith("a)") && n ? F + pA * n[0] : lab.startsWith("b)") && n ? pB * n[0] : lab.startsWith("c)") ? F / (pB - pA) : null; });
  /* sysineq (1re Collège, ch1c_sys) */
  DF("sysineq", /dispose de ([\d']+) CHF.*? coûte (\d+) CHF et (?:l'entrée|le repas|l'inscription) (\d+) CHF par \S+\. .*?au moins (\d+)/, (g, lab) => { const [B, C, p, mn] = g.map(nn), mx = Math.floor((B - C) / p + 1e-9);
    return lab.startsWith("a)") ? mx : lab.startsWith("b)") ? mn : lab.startsWith("c)") ? mx - mn + 1 : null; });
  DF("sysineq", /à la fois (\d+)x - (\d+) (>|≥) (-?\d+) et (\d+) - x ≥ (-?\d+)/, (g, lab) => { const a = nn(g[0]), b = nn(g[1]), st = g[2] === ">", c = nn(g[3]), d = nn(g[4]), e = nn(g[5]), L = (c + b) / a, Rr = d - e;
    let n = 0; for (let x = Math.ceil(L - 1); x <= Rr; x++) if ((st ? x > L : x >= L) && x <= Rr) n++;
    return lab.startsWith("a)") ? L : lab.startsWith("b)") ? Rr : lab.startsWith("c)") ? n : null; });
  /* eqfrac (10e–11e, ch1c_eq) : travail à deux */
  DF("eqfrac", /en (\d+) (?:h|min) ; .*?en (\d+) (?:h|min)\./, (g, lab) => { const [a, b] = g.map(nn); return lab.startsWith("a)") ? 1 / a : lab.startsWith("b)") ? 1 / a + 1 / b : lab.startsWith("c)") ? (a * b) / (a + b) : null; });
  /* bicarre (1re Collège, ch1c_eq) : X = x² recalculé par le discriminant */
  const bic = (b, c) => { const D = b * b - 4 * c; if (D < 0) return null; return [(-b - Math.sqrt(D)) / 2, (-b + Math.sqrt(D)) / 2]; };
  DF("bicarre", /x\^4(?: ([+-]) (\d*)x\^2)? ([+-]) (\d+) = 0 et l'on pose X = x\^2/, (g, lab) => { const b = g[0] ? (g[0] === "-" ? -1 : 1) * (g[1] === "" ? 1 : nn(g[1])) : 0, c = (g[2] === "-" ? -1 : 1) * nn(g[3]), X = bic(b, c); if (!X) return NaN;
    return lab.startsWith("a)") ? X[0] : lab.startsWith("b)") ? X[1] : lab.startsWith("c)") ? X.reduce((s, v) => s + (v > 1e-12 ? 2 : Math.abs(v) <= 1e-12 ? 1 : 0), 0) : null; });
  DF("bicarre", /aire de (\d+) cm² et une diagonale de (\d+) cm/, (g, lab) => { const [A, d] = g.map(nn), X = bic(-d * d, A * A); if (!X) return NaN;
    return lab.startsWith("a)") ? X[0] : lab.startsWith("b)") ? Math.sqrt(X[0]) : lab.startsWith("c)") ? A / Math.sqrt(X[0]) : null; });
  DF("bicarre", /produit de deux nombres positifs vaut (\d+) et la somme de leurs carrés vaut (\d+)/, (g, lab) => { const [P0, S] = g.map(nn), X = bic(-S, P0 * P0); if (!X) return NaN;
    return lab.startsWith("a)") ? X[1] : lab.startsWith("b)") ? Math.sqrt(X[1]) : lab.startsWith("c)") ? Math.sqrt(X[0]) : null; });
  /* lectgraph (1re Collège–MP, defis.js) : parabole relue sur la figure (moindres carrés, figRead plus bas : fonction hissée) */
  T("lectgraph", /Le graphique montre une parabole \(fonction f\) et une droite/, (txt, x) => { if (!/ ¶ /.test(txt) || !x || !x.fig) return null; const lab = txt.split(" ¶ ").slice(1).join(" ¶ "), F = figRead(x.fig); if (!F) return null; const q = quadFit(F.curve); if (!q) return null;
    const [a, b, c] = q, h = -b / (2 * a), k = c - (b * b) / (4 * a), A = Math.round(a * 2) / 2, H = Math.round(h), K = Math.round(k), at = lm(lab, /f\((-?\d+)\)/);
    if (Math.abs(A - a) > 0.05 || Math.abs(H - h) > 0.08 || Math.abs(K - k) > 0.08) return NaN;
    return lab.startsWith("a)") ? A : lab.startsWith("b)") && at ? A * (at[0] - H) ** 2 + K : null; }, { text: true });
  /* trigexact (1re Collège–MP, defis.js) */
  DF("trigexact", /triangle équilatéral de (\d+) cm de côté/, (g, lab) => { const a = nn(g[0]), s3 = Math.sqrt(3); return lab.startsWith("a)") ? (a * s3) / 2 : lab.startsWith("b)") ? (a * a * s3) / 4 : lab.startsWith("c)") ? (a * s3) / 6 : null; });
  DF("trigexact", /hexagone régulier de (\d+) cm de côté/, (g, lab) => { const a = nn(g[0]), s3 = Math.sqrt(3); return lab.startsWith("a)") ? (a * s3) / 2 : lab.startsWith("b)") ? (3 * a * a * s3) / 2 : lab.startsWith("c)") ? 2 * a : null; });
  DF("trigexact", /chevron de toit de (\d+) m est incliné à (\d+)°/, (g, lab) => { const [L, t] = g.map(nn), h = L * Math.sin((t * Math.PI) / 180), w = L * Math.cos((t * Math.PI) / 180);
    return lab.startsWith("a)") ? h : lab.startsWith("b)") ? w : lab.startsWith("c)") ? (h * w) / 2 : null; });
  /* droitesrem (1re Collège–MP, defis.js) */
  DF("droitesrem", /rectangle en C, (?:avec AC = (\d+) (?:cm|m) et BC = (\d+) (?:cm|m)|d'hypoténuse AB = (\d+) cm et de côté AC = (\d+) cm)/, (g, lab) => { let a, b, c; if (g[0]) { a = nn(g[0]); b = nn(g[1]); c = Math.hypot(a, b); } else { c = nn(g[2]); a = nn(g[3]); b = Math.sqrt(c * c - a * a); }
    return lab.startsWith("a)") ? c / 2 : lab.startsWith("b)") ? c / 3 : lab.startsWith("c)") ? (a * b) / c : null; });
  /* polyreg (10e, defis_910) */
  DF("polyreg", /dont la somme vaut ([\d']+)°/, (g, lab) => { const S = nn(g[0]), n = S / 180 + 2; return lab.startsWith("a)") ? n : lab.startsWith("b)") ? S / n : lab.startsWith("c)") ? 360 / n : null; });
  DF("polyreg", /Chaque angle intérieur du plancher mesure (\d+(?:,\d+)?)°/, (g, lab) => { const ai = nn(g[0]), n = 360 / (180 - ai); return lab.startsWith("a)") ? 180 - ai : lab.startsWith("b)") ? n : lab.startsWith("c)") ? (n - 2) * 180 : null; });
  DF("polyreg", /polygone régulier à (\d+) côtés/, (g, lab) => { const n = nn(g[0]); return lab.startsWith("a)") ? 360 / n : lab.startsWith("b)") ? ((n - 2) * 180) / n : lab.startsWith("c)") ? (n - 2) * 180 : null; });
  /* graphefct (1re Collège, ch1c_trous) */
  DF("graphefct", /le cercle x\^2 \+ y\^2 = (\d+) et la droite verticale x = (\d+)/, (g, lab) => { const [r2, a] = g.map(nn), r = Math.sqrt(r2), a1 = lm(lab, /Image de (\d+)/);
    return lab.startsWith("a)") ? (a * a < r2 ? 2 : a * a === r2 ? 1 : 0) : a1 ? Math.sqrt(r2 - a1[0] ** 2) : lab.startsWith("c)") ? r : null; });
  DF("graphefct", /demi-cercle de rayon (\d+) m\./, (g, lab) => { const r = nn(g[0]), a = lm(lab, /à (\d+) m du centre/);
    return a ? Math.sqrt(r * r - a[0] ** 2) : lab.startsWith("b)") ? 2 * r : lab.startsWith("c)") ? { v: 1, sol: false } : null; });
  DF("graphefct", /courbe d'équation x = y\^2(?: ([+-]) (\d+))? \(une parabole « couchée »\) et la droite verticale x = (-?\d+)/, (g, lab) => { const c = g[0] ? (g[0] === "-" ? -1 : 1) * nn(g[1]) : 0, k = nn(g[2]), kk = lm(lab, /d'abscisse (-?\d+)/);
    return lab.startsWith("a)") ? (k > c ? 2 : k === c ? 1 : 0) : kk ? Math.sqrt(kk[0] - c) : lab.startsWith("c)") ? { v: 0, sol: false } : null; });
  /* ineqgraph (2e Collège, ch1c_trous) : zéros par le discriminant, entiers comptés un à un */
  const coef2 = (s) => { const m = /^(-?)x\^2(?: ([+-]) (\d*)x)?(?: ([+-]) (\d+))?$/.exec(s.trim()); if (!m) return null; return [m[1] ? -1 : 1, m[2] ? (m[2] === "-" ? -1 : 1) * (m[3] === "" ? 1 : nn(m[3])) : 0, m[4] ? (m[4] === "-" ? -1 : 1) * nn(m[5]) : 0]; };
  DF("ineqgraph", /(?:f|B)\(x\) = (-?x\^2[^=(]*?) (?:coupe|\(en milliers)/, (g, lab) => { const C = coef2(g[0]); if (!C) return null; const [a, b, c] = C, D = b * b - 4 * a * c; if (D <= 0) return NaN;
    const z = [(-b - Math.sqrt(D)) / (2 * a), (-b + Math.sqrt(D)) / (2 * a)].sort((u, v) => u - v), f = (x) => a * x * x + b * x + c, o = /(≤|≥|<|>) 0/.exec(lab), t = (x) => (o[1] === "<" ? f(x) < 0 : o[1] === "≤" ? f(x) <= 0 : o[1] === ">" ? f(x) > 0 : f(x) >= 0);
    if (lab.startsWith("a)")) return z[0]; if (lab.startsWith("b)")) return z[1]; if (!o) return null;
    if (/Nombre (?:d'entiers|de quantités entières)/.test(lab)) { let n = 0; for (let x = -50; x <= 50; x++) if (t(x)) n++; return n; }
    if (/Plus petit entier positif/.test(lab)) { for (let x = 1; x <= 100; x++) if (t(x)) return x; return NaN; } return null; });
  /* repere3d (11e, ch11_rep3d) */
  DF("repere3d", /le sommet opposé à O est F\((\d+) ; (\d+) ; (\d+)\)/, (g, lab) => { const [a, b, c] = g.map(nn);
    return lab.startsWith("a)") ? a * b * c : lab.startsWith("b)") ? (/Abscisse/.test(lab) ? a : /Ordonnée/.test(lab) ? b : c) / 2 : lab.startsWith("c)") ? Math.sqrt(a * a + b * b + c * c) : null; });
  /* bayes, syslin, bases, etudelnexp (4e Collège, ch4c_ana) */
  DF("bayes", /(\d+(?:,\d+)?) % [^%]*?(\d+(?:,\d+)?) % [^%]*?(\d+(?:,\d+)?) %/, (g, lab) => { const [p, s, f] = g.map((v) => nn(v) / 100), pos = p * s + (1 - p) * f;
    return lab.startsWith("a)") ? 100 * pos : lab.startsWith("b)") ? (100 * p * s) / pos : lab.startsWith("c)") ? (100 * p * s * s) / (p * s * s + (1 - p) * f * f) : null; });
  const det3 = (A) => A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) - A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) + A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);
  DF("syslin", /coûtent ([\d',]+) CHF ; mardi/, (g, lab, txt) => { const L = [...txt.split(" ¶ ")[0].matchAll(/(\d+) [^,0-9]+?, (\d+) [^0-9]+? et (\d+) [^0-9]+? coûtent ([\d',]+) CHF/g)]; if (L.length !== 3) return null;
    const A = L.map((m) => [nn(m[1]), nn(m[2]), nn(m[3])]), B = L.map((m) => nn(m[4])), D = det3(A), col = (k) => A.map((r, i) => r.map((v, j) => (j === k ? B[i] : v)));
    return lab.startsWith("a)") ? D : lab.startsWith("b)") ? det3(col(0)) / D : lab.startsWith("c)") ? det3(col(2)) / D : null; });
  DF("bases", /u = \((-?\d+) ; (-?\d+) ; (-?\d+)\), v = \((-?\d+) ; (-?\d+) ; (-?\d+)\) et w = \((-?\d+) ; m ; (-?\d+)\)/, (g, lab) => { const [u0, u1, u2, v0, v1, v2, w0, w2] = g.map(nn), u = [u0, u1, u2], v = [v0, v1, v2];
    const dm = (m) => det3([[u0, v0, w0], [u1, v1, m], [u2, v2, w2]]), a = dm(1) - dm(0), b = dm(0);
    if (lab.startsWith("a)")) return a; if (lab.startsWith("b)")) return -b / a;
    const t = lm(lab, /t = \((-?\d+) ; (-?\d+) ; (-?\d+)\)/), k = /composante α/.test(lab) ? 0 : /composante β/.test(lab) ? 1 : /composante γ/.test(lab) ? 2 : -1; if (!t || k < 0) return null;
    const M3 = [[u0, v0, w0], [u1, v1, 0], [u2, v2, w2]], D = det3(M3); return det3(M3.map((r, i) => r.map((x, j) => (j === k ? t[i] : x)))) / D; });
  DF("etudelnexp", /Soit f\(x\) = (\d*)x·e\^\(−x\/(\d+)\) pour x ≥ 0/, (g, lab) => { const a = g[0] ? nn(g[0]) : 1, k = nn(g[1]); return lab.startsWith("a)") ? k : lab.startsWith("b)") ? (a * k) / Math.E : lab.startsWith("c)") ? 0 : null; });
  DF("etudelnexp", /Soit f\(x\) = (\d*)x²·e\^\(−x\/(\d+)\) pour x ≥ 0/, (g, lab) => { const a = g[0] ? nn(g[0]) : 1, k = nn(g[1]); return lab.startsWith("a)") ? 2 * k : lab.startsWith("b)") ? 4 * a * k * k * Math.exp(-2) : lab.startsWith("c)") ? 0 : null; });
  DF("etudelnexp", /Soit f\(x\) = (\d*)ln\(x\)\/x pour x > 0/, (g, lab) => { const a = g[0] ? nn(g[0]) : 1; return lab.startsWith("a)") ? Math.E : lab.startsWith("b)") ? a / Math.E : lab.startsWith("c)") ? 0 : null; });
  /* geoesp, densite (4e Collège, ch4c_trous) */
  DF("geoesp", new RegExp("pyramide régulière à base carrée de côté " + NR + " (?:m|cm) et de hauteur " + NR + " (?:m|cm)"), (g, lab) => { const [c, h] = g.map(nn);
    return lab.startsWith("a)") ? Math.sqrt(h * h + (c * c) / 2) : lab.startsWith("b)") ? (Math.atan(h / (c / 2)) * 180) / Math.PI : lab.startsWith("c)") ? (c * c * h) / 3 : null; });
  DF("densite", /f\(x\) = kx sur \[0 ; (\d+)\]/, (g, lab) => { const b = nn(g[0]), t = lm(lab, /P\(X ≤ (\d+(?:,\d+)?)\)/);
    return lab.startsWith("a)") ? 2 / (b * b) : t ? (t[0] * t[0]) / (b * b) : lab.startsWith("c)") ? (2 * b) / 3 : null; });
  /* probaxiomes, derivth (3e Collège, ch3c_ana) */
  DF("probaxiomes", /la somme vaut (\d+) » ; B : « ([^»]+) »/, (g, lab) => { const s = nn(g[0]), B = /double/.test(g[1]) ? (r, b) => r === b : /au moins un 6/.test(g[1]) ? (r, b) => r === 6 || b === 6 : /rouge donne un nombre pair/.test(g[1]) ? (r) => r % 2 === 0 : null; if (!B) return null;
    let a = 0, bb = 0, u = 0; for (let r = 1; r <= 6; r++) for (let b = 1; b <= 6; b++) { const A = r + b === s, E = B(r, b); a += A; bb += E; u += A || E; }
    return lab.startsWith("a)") ? a / 36 : lab.startsWith("b)") ? bb / 36 : lab.startsWith("c)") ? u / 36 : null; });
  const sgn = (o, v) => (o === "-" ? 1 : -1) * nn(v); /* (x − p) : p = +v ; (x + p) : p = −v */
  DF("derivth", /f\(x\) = \|\(x ([+-]) (\d+)\)\(x ([+-]) (\d+)\)\|/, (g, lab) => { const p = sgn(g[0], g[1]), q = sgn(g[2], g[3]), lo = Math.min(p, q), hi = Math.max(p, q);
    return lab.startsWith("a)") ? hi : lab.startsWith("b)") ? -(hi - lo) : lab.startsWith("c)") ? (lo + hi) / 2 : null; });
  DF("derivth", /f\(x\) = \|x ([+-]) (\d+)\| \+ \|x ([+-]) (\d+)\|/, (g, lab) => { const p = sgn(g[0], g[1]), q = sgn(g[2], g[3]), f = (x) => Math.abs(x - p) + Math.abs(x - q), hi = Math.max(p, q);
    return lab.startsWith("a)") ? hi : lab.startsWith("b)") ? (f(hi + 1e-3) - f(hi)) / 1e-3 : lab.startsWith("c)") ? f((p + q) / 2) : null; });
  DF("derivth", /f\(x\) = x\^3 sur \[0 ; (\d+)\]/, (g, lab) => { const b = nn(g[0]); return lab.startsWith("a)") ? b ** 3 / b : lab.startsWith("b)") ? Math.sqrt((b * b) / 3) : lab.startsWith("c)") ? 3 * b * b : null; });
  /* trigcercle, optimderiv, eqlog, eqbic (defis.js, 2e–4e Collège et MP) */
  DF("trigcercle", /On considère l'angle (?:θ )?= (\d+)°\./, (g, lab) => { const t = nn(g[0]), d = lm(lab, /\(kπ\)\/\((\d+)\)/);
    if (lab.startsWith("a)") && d) return (t * d[0]) / 180; if (lab.startsWith("b)")) return { v: Math.cos((t * Math.PI) / 180), sol: false }; /* corrigé exact ±√3/2 : fraction imbriquée, illisible en texte simple */ if (/même sinus/.test(lab)) return (540 - t) % 360; if (/même cosinus/.test(lab)) return 360 - t; return null; });
  DF("trigcercle", /(?:a un rayon de|a une portée de) (\d+) m\..*?l'angle (?:θ )?= (\d+)°/, (g, lab) => { const [R0, t] = g.map(nn), d = lm(lab, /\(kπ\)\/\((\d+)\)/), r = (t * Math.PI) / 180;
    return lab.startsWith("a)") && d ? (t * d[0]) / 180 : lab.startsWith("b)") ? R0 * Math.cos(r) : lab.startsWith("c)") ? R0 * Math.sin(r) : null; });
  DF("optimderiv", /Dans une feuille de (\d+) cm sur (\d+) cm, on découpe un carré/, (g, lab) => { const [a, b] = g.map(nn), V = (x) => x * (a - 2 * x) * (b - 2 * x), D2 = 16 * (a + b) ** 2 - 48 * a * b, x = (4 * (a + b) - Math.sqrt(D2)) / 24, c = (a + b) / 2;
    return lab.startsWith("a)") ? x : lab.startsWith("b)") ? V(x) : lab.startsWith("c)") ? (2 * c ** 3) / 27 : null; });
  DF("optimderiv", /cylindrique doit contenir ([\d']+) cm\^3/, (g, lab) => { const V = nn(g[0]), r = Math.cbrt(V / (2 * Math.PI)); return lab.startsWith("a)") ? r : lab.startsWith("b)") ? V / (Math.PI * r * r) : lab.startsWith("c)") ? { v: 2 * Math.PI * r * r + (2 * V) / r, st: 1, dir: 0 } : null; }); /* « surface minimale (à l'unité) » : arrondi au plus proche */
  DF("optimderiv", /Avec (\d+) m de clôture, on délimite .+? le long d'un mur/, (g, lab) => { const L = nn(g[0]); let best = 0; for (let i = 1; i < 4000; i++) { const x = (i * L) / 8000; if (x * (L - 2 * x) > best * (L - 2 * best)) best = x; }
    const x = L / 4; if (Math.abs(best - x) > L / 4000) return NaN; return lab.startsWith("a)") ? x : lab.startsWith("b)") ? L - 2 * x : lab.startsWith("c)") ? x * (L - 2 * x) : null; });
  DF("eqlog", /On résout (?:log)?_(\d) x \+ (?:log)?_\d\(x - (\d+)\) = (\d+)\./, (g, lab) => { const [B, a, n] = g.map(nn), D = a * a + 4 * B ** n, r = (a + Math.sqrt(D)) / 2;
    return lab.startsWith("a)") ? a : lab.startsWith("b)") ? r : lab.startsWith("c)") ? { v: 2, sol: false } : null; });
  DF("eqlog", /On résout (?:log)?_2\(x \+ (\d+)\) - (?:log)?_2\(x - (\d+)\) = (\d+)\./, (g, lab) => { const [b, a, k] = g.map(nn), K = 2 ** k, x = (b + K * a) / (K - 1);
    return lab.startsWith("a)") ? a : lab.startsWith("b)") ? x : lab.startsWith("c)") ? (x + b) / (x - a) : null; });
  const bicXY = (S, P2) => { const D = S * S - 4 * P2; return D < 0 ? null : [(S - Math.sqrt(D)) / 2, (S + Math.sqrt(D)) / 2].map(Math.sqrt); };
  DF("eqbic", /diagonale de (\d+) cm et une aire de ([\d']+) cm²/, (g, lab) => { const [d, A] = g.map(nn), s = bicXY(d * d, A * A); if (!s) return NaN; return lab.startsWith("b)") ? s[1] : lab.startsWith("c)") ? 2 * (s[0] + s[1]) : null; });
  DF("eqbic", /ont pour produit (\d+) et la somme de leurs carrés vaut (\d+)/, (g, lab) => { const [P0, S] = g.map(nn), s = bicXY(S, P0 * P0); if (!s) return NaN; return lab.startsWith("b)") ? s[1] : lab.startsWith("c)") ? s[0] + s[1] : null; });
  DF("eqbic", /hypoténuse de (\d+) cm et une aire de (\d+(?:,\d+)?) cm²/, (g, lab) => { const [r, A] = g.map(nn), s = bicXY(r * r, 4 * A * A); if (!s) return NaN; return lab.startsWith("b)") ? s[1] : lab.startsWith("c)") ? s[0] + s[1] + r : null; });
  /* dec10, pow9, aire1 (9e, defis_9) */
  DF("dec10", /(?:1'000 feuilles de papier a une épaisseur de|1'000 pièces de monnaie identiques mesure) (\d+(?:,\d+)?) cm/, (g, lab) => { const e = nn(g[0]), H = lm(lab, /mesure (\d+(?:,\d+)?) m\./);
    return lab.startsWith("a)") ? (e * 10) / 1000 : lab.startsWith("b)") ? e : H ? ((H[0] * 100) / e) * 1000 : null; });
  DF("dec10", /1'000 grains de riz pèse (\d+(?:,\d+)?) g\./, (g, lab) => { const e = nn(g[0]), H = lm(lab, /pèse (\d+(?:,\d+)?) kg/);
    return lab.startsWith("a)") ? e : lab.startsWith("b)") ? (100 * e) / 1000 : H ? ((H[0] * 1000) / e) * 1000 : null; });
  DF("pow9", /se divise en deux toutes les 20 minutes/, (g, lab) => { const h = lm(lab, /[Aa]près (\d+) heures/), n = lm(lab, /y a-t-il ([\d']+) bactéries/);
    return lab.startsWith("a)") && h ? 2 ** (3 * h[0]) : lab.startsWith("b)") && h ? 3 * h[0] : n ? 20 * Math.log2(n[0]) : null; });
  DF("pow9", /la raconte à 3 nouvelles personnes/, (g, lab) => { const d = lm(lab, /le jour (\d+)/i), n = lm(lab, /([\d']+) nouvelles personnes/);
    return lab.startsWith("a)") && d ? 3 ** d[0] : lab.startsWith("b)") && d ? d[0] : n ? Math.log(n[0]) / Math.log(3) : null; });
  DF("pow9", /le nombre de couches double/, (g, lab) => { const p = lm(lab, /[Aa]près (\d+) pliages/), n = lm(lab, /obtenir ([\d']+) couches/);
    return lab.startsWith("a)") && p ? 2 ** p[0] : lab.startsWith("b)") && p ? p[0] : n ? Math.log2(n[0]) : null; });
  DF("aire1", /même aire qu'(?:un carré|une pelouse carrée|une affiche carrée) de (\d+) (?:cm|m|dm) de côté\. Sa largeur mesure (\d+)/, (g, lab) => { const [s, w] = g.map(nn), L = (s * s) / w;
    return lab.startsWith("a)") ? s * s : lab.startsWith("b)") ? L : lab.startsWith("c)") ? 2 * (L + w) - 4 * s : null; });
  /* quadri, decarr, airelat (9e–10e, defis_910) */
  DF("quadri", /losange ABCD, l'angle ∠BAC .*?mesure (\d+)°/, (g, lab) => { const a = nn(g[0]); return lab.startsWith("a)") ? 2 * a : lab.startsWith("b)") ? 90 : lab.startsWith("c)") ? 180 - 2 * a : null; });
  DF("quadri", /rectangle ABCD, .*?l'angle ∠OAB mesure (\d+)°/, (g, lab) => { const a = nn(g[0]); return lab.startsWith("a)") ? a : lab.startsWith("b)") ? 180 - 2 * a : lab.startsWith("c)") ? 2 * a : null; });
  DF("quadri", /l'angle ∠BAD mesure (\d+)° et la diagonale \[AC\] fait avec le côté \[AB\] un angle ∠BAC de (\d+)°/, (g, lab) => { const [A, b] = g.map(nn); return lab.startsWith("a)") ? 180 - A : lab.startsWith("b)") ? A - b : lab.startsWith("c)") ? b : null; });
  DF("decarr", /achète (\d+) [^0-9]+? à (\d+,\d+) CHF pièce/, (g, lab) => { const [n, p] = g.map(nn); return lab.startsWith("a)") ? n * p : lab.startsWith("b)") ? n * Math.round(p) : lab.startsWith("c)") ? Math.abs(n * Math.round(p) - n * p) : null; });
  DF("airelat", /diamètre de (\d+) cm et une (?:hauteur|longueur) de (\d+) cm/, (g, lab) => { const [d, h] = g.map(nn), AL = Math.PI * d * h;
    return lab.startsWith("a)") ? AL : lab.startsWith("b)") ? AL + (Math.PI * d * d) / 2 : lab.startsWith("c)") ? Math.PI * d : null; });
  /* fracadd (9e–11e, ch11_no) */
  DF("fracadd", /\((\d+)\)\/\((\d+)\) des élèves votent pour \S+, \((\d+)\)\/\((\d+)\) pour \S+, et le reste pour \S+\. L'école compte (\d+) élèves/, (g, lab) => { const [a, b, c, e, t] = g.map(nn), r = 1 - a / b - c / e;
    return lab.startsWith("a)") ? r : lab.startsWith("b)") ? (t * a) / b : lab.startsWith("c)") ? t * r : null; });
  DF("fracadd", /on met \((\d+)\)\/\((\d+)\) [^,]+, \((\d+)\)\/\((\d+)\) .+? et le reste d'eau gazeuse/, (g, lab) => { const [a, b, c, e] = g.map(nn), V = lm(lab, /(\d+(?:,\d+)?) L/);
    return lab.startsWith("a)") ? 1 - a / b - c / e : lab.startsWith("b)") && V ? (V[0] * a) / b : lab.startsWith("c)") && V ? (V[0] * c) / e : null; });
  DF("fracadd", /reçoit (\d+) CHF d'argent de poche : \((\d+)\)\/\((\d+)\) part .*?, \((\d+)\)\/\((\d+)\) dans/, (g, lab) => { const [A, a, b, c, e] = g.map(nn), r = 1 - a / b - c / e;
    return lab.startsWith("a)") ? r : lab.startsWith("b)") ? (A * a) / b : lab.startsWith("c)") ? A * r : null; });
  /* ==== fin agent defis3 ==== */

  /* ==== défis à 3 contextes (agent defisch, 26.11 soir) : un oracle par contexte, partie par partie ==== */
  const NB = "(\\d+(?:'\\d{3})*(?:,\\d+)?)", rx = (s) => new RegExp(s.replace(/#/g, NB)), L0 = (lab, k) => lab.startsWith(k + ")");
  const pick = (lab, o) => { for (const k of Object.keys(o)) if (L0(lab, k)) return typeof o[k] === "function" ? o[k]() : o[k]; return null; };
  /* --- 9e (defis_9.js) --- */
  DF("decread", rx("formé de # dizaines, # unités, # dixièmes et # millièmes"), (g, lab) => { const [d, u, t, m] = g.map(nn), n = 10 * d + u + t / 10 + m / 1000, T = Math.round(n * 1000);
    return pick(lab, { a: n, b: Math.floor(T / 10) % 10, c: { v: n, st: 0.01 } }); });
  DF("decread", rx("chronomètre électronique affiche pour \\S+ : # s"), (g, lab) => { const t = nn(g[0]), T = Math.round(t * 1000); return pick(lab, { a: Math.floor(T / 10) % 10, b: Math.floor(T / 100), c: { v: t, st: 0.01 } }); });
  DF("decread", /chiffre des dizaines est (\d)\. .*?dixièmes, qui vaut (\d)\. .*?millièmes est (\d),/, (g, lab) => { const [t, a, c] = g.map(nn), n = 10 * t + 2 * a + a / 10 + (t - a) / 100 + c / 1000;
    return pick(lab, { a: n, b: Math.floor(Math.round(n * 1000) / 10), c: { v: n, st: 0.1 } }); });
  DF("deccomp", rx("(temps|masses|épaisseurs) \\(en (?:secondes|kg|mm)\\) : ([\\d,; ]+)\\."), (g, lab) => { const v = g[1].split(" ; ").map(nn).sort((x, y) => x - y), lo = lm(lab, /entre (\d+(?:,\d+)?) \S+ et (\d+(?:,\d+)?)/);
    return pick(lab, { a: /plus lourd/.test(lab) ? v[4] : v[0], b: /plus lourd/.test(lab) ? v[v.length - 3] : v[2], c: lo ? v.filter((x) => x > lo[0] && x < lo[1]).length : null }); });
  DF("ulong", rx("rouleau de ficelle de # m est coupé en morceaux de # cm, autant que possible\\. La ficelle pèse # g par mètre"), (g, lab) => { const [L, c, m] = g.map(nn), n = Math.floor((L * 100) / c + 1e-9);
    return pick(lab, { a: n, b: L * 100 - n * c, c: (n * c * m) / 100000 }); });
  DF("ulong", rx("planche de # m est sciée en tablettes de # cm"), (g, lab) => { const [L, c] = g.map(nn), n = Math.floor((L * 100) / c + 1e-9), k = lm(lab, /On scie (\d+) planches/);
    return pick(lab, { a: n, b: L * 100 - n * c, c: k ? (k[0] * (L * 100 - n * c)) / 100 : null }); });
  DF("ulong", rx("ruban de # m en morceaux de # cm"), (g, lab) => { const [L, c] = g.map(nn), n = Math.floor((L * 100) / c + 1e-9), k = lm(lab, /emballer (\d+) cadeaux/);
    return pick(lab, { a: n, b: L * 100 - n * c, c: k ? Math.ceil(k[0] / n) : null }); });
  DF("uaire", rx("pièce rectangulaire de # m sur # m est recouvert de carreaux carrés de # cm"), (g, lab) => { const [a, b, c] = g.map(nn); return pick(lab, { a: a * b, b: (c / 100) ** 2, c: (a * b) / (c / 100) ** 2 }); });
  DF("uaire", rx("terrasse rectangulaire de # m sur # m est couverte de dalles carrées de 40 cm de côté\\. Une dalle coûte # CHF"), (g, lab) => { const [a, b, p] = g.map(nn), n = Math.round((a * b) / 0.16);
    return pick(lab, { a: a * b, b: n, c: n * p }); });
  DF("uaire", rx("timbres rectangulaire mesure # cm sur # cm\\. .*?carrés de # mm"), (g, lab) => { const [a, b, s] = g.map(nn), t = (s / 10) ** 2; return pick(lab, { a: a * b, b: t, c: (a * b) / t }); });
  DF("uvol", rx("aquarium a la forme d'un pavé de # cm de long, # cm de large et # cm de haut\\. On y verse # litres"), (g, lab) => { const [a, b, c, x] = g.map(nn);
    return pick(lab, { a: (a * b * c) / 1000, b: (x * 1000) / (a * b), c: ((a * b * c) / 1000 - x) * 10 }); });
  DF("uvol", rx("récupérateur d'eau de pluie a la forme d'un pavé de # cm de long, # cm de large et # cm de haut\\. .*?il contient # litres"), (g, lab) => { const [a, b, c, x] = g.map(nn), k = lm(lab, /arrosoirs de (\d+) L/);
    return pick(lab, { a: (a * b * c) / 1000, b: (x * 1000) / (a * b), c: k ? Math.floor(x / k[0] + 1e-9) : null }); });
  DF("uvol", rx("piscine hors-sol a la forme d'un pavé de # m sur # m, avec des parois de # m de haut\\. On la remplit avec # m³ d'eau, à l'aide d'un tuyau qui débite # litres par minute"), (g, lab) => { const [a, b, h, x, d] = g.map(nn);
    return pick(lab, { a: a * b * h, b: (100 * x) / (a * b), c: (x * 1000) / d }); });
  DF("angtype", /Sur une horloge, on mesure le plus petit angle/, (g, lab) => { const sm = (v) => Math.min(v % 360, 360 - (v % 360)); let m;
    if ((m = lm(lab, /^a\) Angle à (\d+) h pile/))) return sm(30 * m[0]); if ((m = lm(lab, /en (\d+) minutes/))) return 6 * m[0]; if ((m = lm(lab, /^c\) Angle à (\d+) h 30/))) return sm(Math.abs(30 * m[0] + 15 - 180)); return null; });
  DF("angtype", /gâteau rond est coupé en (\d+) parts égales/, (g, lab) => { const n = nn(g[0]), p = 360 / n, k = lm(lab, /formé par (\d+) parts/); let o = 1; while (o * p <= 90) o++;
    return pick(lab, { a: p, b: k ? k[0] * p : null, c: o }); });
  const ROSE = { nord: 0, "nord-est": 45, est: 90, "sud-est": 135, sud: 180, "sud-ouest": 225, ouest: 270, "nord-ouest": 315 };
  DF("angtype", /Sur une rose des vents/, (g, lab) => { const m = /directions? (\S+) (?:et|à la direction) (?:la direction )?(\S+?)(?:,| en)/.exec(lab); if (!m) return null; const x = ROSE[m[1]], y = ROSE[m[2]]; if (x === undefined || y === undefined) return null;
    return L0(lab, "c") ? (y - x + 360) % 360 : Math.min(Math.abs(x - y), 360 - Math.abs(x - y)); });
  DF("perim", rx("rectangle a un périmètre de # cm, et sa longueur dépasse sa largeur de # cm"), (g, lab) => { const [P, d] = g.map(nn), l = (P / 2 - d) / 2; return pick(lab, { a: P / 2, b: l, c: l + d }); });
  DF("perim", rx("Il faut # m de clôture pour les trois autres côtés, et le côté le long du mur mesure # m\\. La clôture coûte # CHF le mètre"), (g, lab) => { const [C, L, p] = g.map(nn), w = (C - L) / 2;
    return pick(lab, { a: w, b: 2 * (L + w), c: C * p }); });
  DF("perim", rx("fil de fer de # cm"), (g, lab) => { const F = nn(g[0]); return pick(lab, { a: F / 4, b: F / 3, c: F / 6 }); });
  DF("aire2", rx("base \\[AB\\] de # cm et une hauteur relative à cette base de # cm\\. Son côté \\[BC\\] mesure # cm"), (g, lab) => { const [b, h, c] = g.map(nn), A = b * h, d = lm(lab, /diagonale de (\d+) cm/);
    return pick(lab, { a: A, b: A / c, c: d ? (2 * A) / d[0] : null }); });
  DF("aire2", rx("Sa base mesure # m et la hauteur relative à cette base # m\\. Le côté le plus long de la voile mesure # m"), (g, lab) => { const [b, h, c] = g.map(nn), A = (b * h) / 2, p = lm(lab, /coûte (\d+) CHF/);
    if (c <= h) return NaN; return pick(lab, { a: A, b: (2 * A) / c, c: p ? A * p[0] : null }); });
  DF("aire2", rx("losange dont les diagonales mesurent # cm et # cm"), (g, lab) => { const [d1, d2] = g.map(nn), A = (d1 * d2) / 2, k = lm(lab, /on en fabrique (\d+)/); return pick(lab, { a: A, b: A / 100, c: k ? (k[0] * A) / 10000 : null }); });
  DF("aire3", rx("jardin rectangulaire de # m sur # m est entouré d'une allée de # m de large\\. On couvre l'allée de gravier à # CHF"), (g, lab) => { const [a, b, l, p] = g.map(nn), G = (a + 2 * l) * (b + 2 * l);
    return pick(lab, { a: G, b: G - a * b, c: (G - a * b) * p }); });
  DF("aire3", rx("bassin rectangulaire de # m sur # m est entouré d'une bordure de dalles de 50 cm"), (g, lab) => { const [a, b] = g.map(nn), G = (a + 1) * (b + 1); return pick(lab, { a: G, b: G - a * b, c: (G - a * b) / 0.25 }); });
  DF("aire3", rx("photo de # cm sur # cm est collée sur un passe-partout en carton qui dépasse de # cm"), (g, lab) => { const [a, b, l] = g.map(nn), G = (a + 2 * l) * (b + 2 * l); return pick(lab, { a: G, b: G - a * b, c: (G - a * b) / 100 }); });
  DF("volpave", rx("boîte sans couvercle a la forme d'un pavé de # cm sur # cm, et # cm de haut"), (g, lab) => { const [a, b, c] = g.map(nn), k = lm(lab, /cubes de (\d+) cm/);
    return pick(lab, { a: a * b * c, b: a * b + 2 * a * c + 2 * b * c, c: k ? Math.floor(a / k[0]) * Math.floor(b / k[0]) * Math.floor(c / k[0]) : null }); });
  DF("volpave", rx("carton de déménagement fermé a la forme d'un pavé de # cm sur # cm, et # cm de haut"), (g, lab) => { const [a, b, c] = g.map(nn), k = lm(lab, /cubiques de (\d+) cm/);
    return pick(lab, { a: (a * b * c) / 1000, b: 2 * (a * b + a * c + b * c), c: k ? Math.floor(a / k[0]) * Math.floor(b / k[0]) * Math.floor(c / k[0]) : null }); });
  DF("volpave", rx("jardinière a la forme d'un pavé de # cm de long, # cm de large et # cm de haut .*?sacs de # L"), (g, lab) => { const [a, b, c, s] = g.map(nn), V = (a * b * c) / 1000;
    return pick(lab, { a: V, b: 2 * (a + b) * c, c: Math.ceil(V / s - 1e-9) }); });
  DF("fracrep", /^Trois amis (?:partagent|partent|ont des gourdes)/, (g, lab, txt) => { const F = [...txt.split(" ¶ ")[0].matchAll(/\((\d+)\)\/\((\d+)\)/g)].map((m) => [+m[1], +m[2]]); if (F.length !== 3) return null;
    const gd = (a, b) => (b ? gd(b, a % b) : a), D = F.reduce((m, [, q]) => (m * q) / gd(m, q), 1), big = F.reduce((x, y) => (y[0] / y[1] > x[0] / x[1] ? y : x));
    return pick(lab, { a: F.filter(([p, q]) => 2 * p > q).length, b: D, c: (big[0] * D) / big[1] }); });
  DF("fracsimp", /(?:simplifier la fraction \((\d+)\)\/\((\d+)\)|a gagné (\d+) de ses (\d+) matchs|sondage, (\d+(?:'\d{3})?) des (\d+(?:'\d{3})?) élèves)/, (g, lab) => { const [p0, q0] = (g[0] ? g.slice(0, 2) : g[2] ? g.slice(2, 4) : g.slice(4, 6)).map(nn), gd = (a, b) => (b ? gd(b, a % b) : a), k = gd(p0, q0), p = p0 / k, q = q0 / k;
    if (L0(lab, "a")) return p; if (L0(lab, "b")) return q; const m = lm(lab, /sur (\d+(?:'\d{3})?) (?:matchs|\S+ ont|\S+ font|\S+ viennent)/) || lm(lab, /sur (\d+(?:'\d{3})?)/);
    if (/entre 20 et 50/.test(lab)) { let c = 0; for (let d = 20; d <= 50; d++) if (d % q === 0) c++; return c; } return m ? (m[0] * p) / q : null; });
  DF("fractout", /(?:classe de|a|contient) (\d+) (?:élèves|CHF|bonbons)\b.*?\((\d+)\)\/\((\d+)\) .*?\((\d+)\)\/\((\d+)\)/, (g, lab) => { const [n, a, b, c, d] = g.map(nn), f = (n * a) / b, mu = ((n - f) * c) / d;
    return pick(lab, { a: f, b: mu, c: n - f - mu }); });
  DF("proptab", rx("(?:cerises est proportionnel à leur masse|essence est proportionnel au volume) : # (kg|litres) coûtent # CHF"), (g, lab) => { const m1 = nn(g[0]), P = nn(g[2]), u = P / m1, m2 = lm(lab, /^b\) Prix de (\d+(?:,\d+)?) /), X3 = lm(lab, /pour (\d+(?:'\d{3})*(?:,\d+)?) CHF|avec (\d+(?:'\d{3})*(?:,\d+)?) CHF/);
    return pick(lab, { a: u, b: m2 ? m2[0] * u : null, c: X3 ? (X3[0] || X3[1]) / u : null }); });
  DF("proptab", rx("Au rayon fromage, .*?: # g de \\S+ coûtent # CHF"), (g, lab) => { const [m1, P] = g.map(nn), u = (P * 1000) / m1, m2 = lm(lab, /Prix de (\d+) g/), X3 = lm(lab, /pour (\d+(?:,\d+)?) CHF/);
    return pick(lab, { a: u, b: m2 ? (m2[0] * u) / 1000 : null, c: X3 ? (X3[0] * 1000) / u : null }); });
  DF("prop", rx("(?:recette pour # personnes demande # g de farine et # œufs|Pour # litres de boisson .*?on mélange # ml de sirop et le jus de # citrons|Pour monter # m² de mur, un maçon utilise # briques et # sacs)"), (g, lab) => { const v = g.filter((x) => x !== undefined).map(nn); if (v.length !== 3) return null; const [G, A, B] = v, n = lm(lab, /(?:pour|Avec) (\d+(?:'\d{3})*) /);
    if (!n) return null; return L0(lab, "b") ? (n[0] * G) / A : L0(lab, "a") ? (n[0] * A) / G : L0(lab, "c") ? (n[0] * B) / G : null; });
  DF("change", rx("1 (?:euro|dollar|livre sterling) vaut # CHF à la banque"), (g, lab) => { const r = nn(g[0]); let m;
    if ((m = lm(lab, /^a\) Combien coûtent (\d+) /))) return m[0] * r; if ((m = lm(lab, /pour (\d+) CHF/))) return { v: m[0] / r, st: 0.01 }; if ((m = lm(lab, /il reste (\d+) \S+, que la banque rachète à (\d+,\d+) CHF/))) return m[0] * m[1]; return null; });
  DF("agrand", rx("(?:photo|logo) de # (cm|mm) (?:sur|de large et) # (?:cm|mm)(?: de haut)? (?:est agrandie?|est agrandi pour être imprimé sur un t-shirt) : sa largeur passe à # (?:cm|mm)"), (g, lab) => { const a = nn(g[0]), b = nn(g[2]), A = nn(g[3]), k = A / a, k2 = lm(lab, /coefficient de (\d+(?:,\d+)?)/);
    return pick(lab, { a: k, b: b * k, c: k2 ? A * k2[0] : null }); });
  DF("agrand", rx("agrandit un plan de # cm sur # cm : sur la copie, la longueur mesure # cm"), (g, lab) => { const [a, b, A] = g.map(nn), k = A / a, q = lm(lab, /à (\d+) %/);
    return pick(lab, { a: 100 * k, b: b * k, c: q ? (A * q[0]) / 100 : null }); });
  /* --- 9e–11e (defis_910.js) --- */
  const LSTN = (s) => s.split(" ; ").map((t) => nn(t.replace(/ ?°C$/, "")));
  DF("diagr", /a obtenu ces notes en maths : ([\d,; ]+)\. Il reste un test/, (g, lab) => { const v = LSTN(g[0]), S = v.reduce((a, b) => a + b, 0), t = lm(lab, /exactement (\d+(?:,\d+)?) de moyenne/);
    return pick(lab, { a: S / v.length, b: S, c: t ? t[0] * (v.length + 1) - S : null }); });
  DF("diagr", /premiers matchs de basket, \S+ a marqué ([\d; ]+) points/, (g, lab) => { const v = LSTN(g[0]), S = v.reduce((a, b) => a + b, 0), t = lm(lab, /exactement (\d+) points de moyenne/);
    return pick(lab, { a: S / v.length, b: S, c: t ? t[0] * (v.length + 1) - S : null }); });
  DF("diagr", /température à midi pendant \d+ jours de janvier : ([-−\d °C;]+)\. On attend/, (g, lab) => { const v = LSTN(g[0].trim()), S = v.reduce((a, b) => a + b, 0), t = lm(lab, /soit exactement (-?\d+) °C/);
    return pick(lab, { a: S / v.length, b: S, c: t ? t[0] * (v.length + 1) - S : null }); });
  const divs = (n) => { let c = 0; for (let d = 1; d <= n; d++) if (n % d === 0) c++; return c; };
  const sqk = (n) => { for (let k = 1; k <= n; k++) { const r = Math.round(Math.sqrt(n * k)); if (r * r === n * k) return k; } return NaN; };
  const nfp = (n) => { let c = 0; for (let p = 2; n > 1; p++) while (n % p === 0) { n /= p; c++; } return c; };
  DF("premiers", rx("On considère le nombre #\\.(?: |$)"), (g, lab) => { const n = nn(g[0]); return pick(lab, { a: nfp(n), b: divs(n), c: sqk(n) }); });
  DF("premiers", rx("fanfare de # musiciens"), (g, lab) => { const n = nn(g[0]), s = Math.ceil(Math.sqrt(n) - 1e-9); return pick(lab, { a: divs(n), b: divs(n) - 2, c: s * s - n }); });
  DF("premiers", rx("dispose de # dalles carrées"), (g, lab) => { const n = nn(g[0]); return pick(lab, { a: divs(n), b: Math.ceil(divs(n) / 2), c: sqk(n) }); });
  /* fracper : x lu dans l'énoncé (« 0,4272727… » ou « 0,48484848… »), puis rapport irréductible */
  const perFrac = (s, per) => { const [, dec] = String(s).split(","), k = dec.indexOf(per), pre = dec.slice(0, k), L = per.length, num = +(pre + per) - +(pre || "0"), den = (10 ** L - 1) * 10 ** pre.length; return [num, den]; };
  DF("fracper", /(?:écrire|affiche) (0,\d+)(?:…|\.\.\.)? \((?:le groupe « (\d+) »|seul le chiffre « (\d) »)/, (g, lab) => { const per = g[1] || g[2], [num, den] = perFrac(g[0], per), gd = (a, b) => (b ? gd(b, a % b) : a), k = gd(num, den);
    return pick(lab, { a: num, b: num / k, c: den / k }); });
  DF("decprob", rx("pique-nique de # personnes, on prévoit # L de jus par personne\\. Le jus est vendu en bouteilles de # L à # CHF la bouteille\\. On paie avec un billet de # CHF"), (g, lab) => { const [n, l, pl, pu, b] = g.map(nn), L = n * l, k = Math.ceil(L / pl - 1e-9);
    return pick(lab, { a: L, b: k, c: b - k * pu }); });
  DF("decprob", rx("# m² à couvrir, en deux couches\\. Il faut # L de peinture par m² et par couche\\. .*?pots de # L à # CHF le pot\\. On paie avec un billet de # CHF"), (g, lab) => { const [S, d, pl, pu, b] = g.map(nn), L = 2 * S * d, k = Math.ceil(L / pl - 1e-9);
    return pick(lab, { a: L, b: k, c: b - k * pu }); });
  DF("decprob", rx("pelouse de # m², il faut # g de graines par m²\\. .*?sacs de # kg à # CHF le sac\\. On paie avec un billet de # CHF"), (g, lab) => { const [S, d, pl, pu, b] = g.map(nn), L = (S * d) / 1000, k = Math.ceil(L / pl - 1e-9);
    return pick(lab, { a: L, b: k, c: b - k * pu }); });
  const ppmc = (a, b) => { for (let m = Math.max(a, b); ; m++) if (m % a === 0 && m % b === 0) return m; };
  DF("multdiv", /nombres entiers de (\d+) à (\d+) \(bornes comprises\)/, (g, lab) => { const [lo, hi] = g.map(nn), ab = lm(lab, /de (\d+) et de (\d+)/), a = lm(lab, /multiples de (\d+) \?/), cnt = (k) => { let c = 0; for (let x = lo; x <= hi; x++) if (x % k === 0) c++; return c; };
    return L0(lab, "a") && a ? cnt(a[0]) : L0(lab, "b") && ab ? ppmc(ab[0], ab[1]) : L0(lab, "c") && ab ? cnt(ppmc(ab[0], ab[1])) : null; });
  DF("multdiv", /la ligne A repart ensuite toutes les (\d+) minutes, la ligne B toutes les (\d+) minutes\. On observe les départs de (\d+) h 00 à (\d+) h 00/, (g, lab) => { const [a, b, h0, h1] = g.map(nn), T = 60 * (h1 - h0), L = ppmc(a, b);
    return pick(lab, { a: Math.floor(T / a) + 1, b: L, c: Math.floor(T / L) + 1 }); });
  DF("multdiv", /premier envoie un éclair toutes les (\d+) secondes, le second toutes les (\d+) secondes\. On compte les éclairs pendant les (\d+) secondes/, (g, lab) => { const [a, b, T] = g.map(nn), L = ppmc(a, b);
    return pick(lab, { a: Math.floor(T / a), b: L, c: Math.floor(T / L) }); });
  DF("relrep", /point A a pour abscisse (-?\d+), le point B a pour abscisse (-?\d+) et le point C a pour abscisse (-?\d+)/, (g, lab) => { const [a, b, c] = g.map(nn); return pick(lab, { a: Math.abs(b - a), b: (a + b) / 2, c: b + (b - a) - c }); });
  DF("relrep", /du niveau (-?\d+) \(parking\) au niveau (-?\d+), puis redescend au niveau (-?\d+)/, (g, lab) => { const [a, b, c] = g.map(nn); return pick(lab, { a: b - a, b: (a + b) / 2, c: b - c }); });
  DF("relrep", /plongeuse est à l'altitude (-?\d+) m .*?truite nage à (-?\d+) m et un goéland vole à (\d+) m/, (g, lab) => { const [a, c, b] = g.map(nn); return pick(lab, { a: b - a, b: (a + b) / 2, c: c - a }); });
  /* symetries, rotation (réponses en couple) : A, C, T lus dans l'énoncé */
  const PTN = (txt, P) => { const m = new RegExp("\\b" + P + "\\((-?\\d+) ; (-?\\d+)\\)").exec(txt); return m ? [nn(m[1]), nn(m[2])] : null; };
  DF("symetries", /symétrique de A par rapport à C|image de A par la symétrie de centre C/, (g, lab, txt) => { const t = txt.split(" ¶ ")[0], A = PTN(t, "A"), C = PTN(t, "C"), T = PTN(t, "T"); if (!A || !C || !T) return null; const B = [2 * C[0] - A[0], 2 * C[1] - A[1]];
    return pick(lab, { a: { pair: B }, b: { pair: [B[0] + T[0], B[1] + T[1]] }, c: { pair: [-A[0], A[1]] } }); });
  DF("rotation", /sens inverse des aiguilles d'une montre/, (g, lab, txt) => { const A = PTN(txt.split(" ¶ ")[0], "A"); if (!A) return null; const C = PTN(lab, "C"), [x, y] = A;
    return pick(lab, { a: { pair: [-y, x] }, b: { pair: [-x, -y] }, c: C ? { pair: [C[0] - (y - C[1]), C[1] + (x - C[0])] } : null }); });
  DF("rac", rx("cube a un volume de # cm³"), (g, lab) => { const s = Math.cbrt(nn(g[0])), k = lm(lab, /est (\d+) fois celle/); return pick(lab, { a: s, b: 6 * s * s, c: k ? Math.sqrt(k[0] * s * s) : null }); });
  DF("rac", rx("terrain carré a une aire de # m²\\. On veut l'entourer d'une clôture à # CHF"), (g, lab) => { const [A, p] = g.map(nn), s = Math.sqrt(A), k = lm(lab, /carré (\d+) fois plus grand/); return pick(lab, { a: s, b: 4 * s * p, c: k ? Math.sqrt(k[0] * A) : null }); });
  DF("rac", rx("aquarium cubique \\(sans couvercle\\) contient exactement # litres"), (g, lab) => { const s = Math.cbrt(nn(g[0]) * 1000); return pick(lab, { a: s, b: 5 * s * s, c: Math.cbrt(8 * s ** 3) }); });
  DF("disque", rx("(?:secteur de disque de rayon # (?:cm|m) et d'angle (\\d+)°|aiguille des minutes d'une horloge mesure # cm\\. On observe son mouvement pendant # minutes)"), (g, lab) => { const [r1, a1, r2, m] = g.map(nn), r = r1 || r2, a = a1 || 6 * m, L = (a / 360) * 2 * Math.PI * r;
    return pick(lab, { a: L, b: L + 2 * r, c: (a / 360) * Math.PI * r * r }); });
  DF("grandmanq", rx("trapèze a des bases de # cm et # cm\\. Son aire vaut # cm²\\. Un rectangle de largeur # cm"), (g, lab) => { const [b1, b2, A, w] = g.map(nn); return pick(lab, { a: (2 * A) / (b1 + b2), b: A / w, c: Math.sqrt(2 * A) }); });
  DF("grandmanq", rx("champ a la forme d'un trapèze dont les côtés parallèles mesurent # m et # m\\. Son aire vaut # m²"), (g, lab) => { const [b1, b2, A] = g.map(nn), w = lm(lab, /rectangulaire de (\d+) m de large/), p = lm(lab, /coûte (\d+) CHF par are/);
    return pick(lab, { a: (2 * A) / (b1 + b2), b: w ? A / w[0] : null, c: p ? (A / 100) * p[0] : null }); });
  DF("grandmanq", rx("canal d'irrigation est un trapèze : largeur # m au fond, # m en haut\\. L'aire de cette section vaut # m²"), (g, lab) => { const [b1, b2, A] = g.map(nn), L = lm(lab, /dans (\d+) m de canal/);
    return pick(lab, { a: (2 * A) / (b1 + b2), b: L ? A * L[0] : null, c: L ? A * L[0] * 1000 : null }); });
  DF("voldecomp", rx("piscine a la forme d'un pavé de # m sur # m\\. Sur la moitié de sa longueur, la profondeur est de # m ; sur l'autre moitié, elle est de # m"), (g, lab) => { const [L, l, h1, h2] = g.map(nn), V = (L / 2) * l * (h1 + h2), t = lm(lab, /débit de (\d+) m³/);
    return pick(lab, { a: V, b: V * 1000, c: t ? V / t[0] : null }); });
  DF("voldecomp", rx("a (\\d) marches\\. Vu de côté, .*?Chaque bloc est un pavé de # m de large, 30 cm de profondeur et # cm de haut"), (g, lab) => { const [n, w, h] = g.map(nn), V = ((n * (n + 1)) / 2) * w * 0.3 * (h / 100);
    return pick(lab, { a: V, b: V * 2400, c: Math.ceil((V * 2400) / 40 - 1e-9) }); });
  DF("voldecomp", rx("deux bacs pavés accolés, de # m de haut : l'un de # m sur # m, l'autre de # m sur # m\\. On la remplit de terre, vendue en sacs de # L"), (g, lab) => { const [h, a, b, c, d, s] = g.map(nn), V = (a * b + c * d) * h;
    return pick(lab, { a: V, b: V * 1000, c: Math.ceil((V * 1000) / s - 1e-9) }); });
  /* eqverif : les nombres proposés sont substitués dans l'équation lue dans le libellé ou l'énoncé */
  DF("eqverif", /On considère l'équation x\^2 \+ (\d+) = (\d+)x et les nombres ([-−\d ;]+)\./, (g, lab) => { const p = nn(g[0]), s = nn(g[1]), c = LSTN(g[2].trim()), ok = c.filter((x) => x * x + p === s * x), z = lm(lab, /le nombre (\d+) est-il/);
    return pick(lab, { a: ok.length, b: ok.reduce((t, x) => t + x, 0), c: z ? s * z[0] - z[0] * z[0] : null }); });
  DF("eqverif", /largeur de x cm et une longueur de x \+ (\d+) cm\. Son aire vaut (\d+) cm²\. On propose pour x les nombres ([-−\d ;]+)\./, (g, lab) => { const d = nn(g[0]), A = nn(g[1]), c = LSTN(g[2].trim()), ok = c.filter((x) => x * (x + d) === A), r = ok.find((x) => x > 0);
    return pick(lab, { a: ok.length, b: r, c: 2 * (2 * r + d) }); });
  DF("eqverif", /Le carré de ce nombre, diminué de (\d+), est égal à (\d+) fois ce nombre\. Elle propose à son frère les nombres ([-−\d ;]+)\./, (g, lab) => { const p = nn(g[0]), s = nn(g[1]), c = LSTN(g[2].trim()), ok = c.filter((x) => x * x - p === s * x), z = lm(lab, /le nombre (\d+) vérifie/);
    return pick(lab, { a: ok.length, b: ok.find((x) => x > 0), c: z ? z[0] * z[0] - s * z[0] : null }); });
  DF("pente", rx("route de montagne a une pente constante de # %\\. Elle franchit une distance horizontale de # m\\. Un panneau prévient : « dénivelé de # %"), (g, lab) => { const [p, d, t] = g.map(nn), dh = (p * d) / 100;
    return pick(lab, { a: dh, b: 10000 / p, c: (dh * 100) / t }); });
  DF("pente", rx("pente de 6 % au plus\\. Il faut franchir une marche de # cm"), (g, lab) => { const h = nn(g[0]), Lr = lm(lab, /rampe de (\d+(?:,\d+)?) m/), L2 = lm(lab, /sur (\d+(?:,\d+)?) m de longueur/);
    return pick(lab, { a: h / 6, b: Lr ? h / Lr[0] : null, c: L2 ? 0.06 * L2[0] * 100 : null }); });
  DF("pente", rx("funiculaire monte avec une pente moyenne de # % sur une distance horizontale de # m\\. Plus haut, un deuxième tronçon s'élève de # m sur # m"), (g, lab) => { const [p, d, D, d2] = g.map(nn);
    return pick(lab, { a: (p * d) / 100, b: 10000 / p, c: (100 * D) / d2 }); });
  /* --- défis communs CO / Collège / France (defis.js, OUT) : gabarit d'origine et gabarits ajoutés --- */
  const SN = "([-−]?\\d+(?:'\\d{3})*(?:,\\d+)?)";
  const rs = (s) => new RegExp(s.replace(/#/g, NB).replace(/§/g, SN));
  DF("rel", rs("la température passe de § °C à 7 h à § °C à 14 h, puis baisse de # °C jusqu'à minuit"), (g, lab) => { const [t1, t2, d] = g.map(nn), t3 = t2 - d;
    return pick(lab, { a: t2 - t1, b: t3, c: (t1 + t2 + t3) / 3, d: t3 - t1 }); });
  DF("rel", rs("termine ses trois premiers tours à §, \\+(\\d+) et §\\."), (g, lab) => { const [a, b, c] = g.map(nn), s = a + b + c, tg = lm(lab, /terminer à ([-−]?\d+) au total/);
    return pick(lab, { a: s, b: Math.max(a, b, c) - Math.min(a, b, c), c: s / 3, d: tg ? tg[0] - s : null }); });
  DF("rel", rs("son solde vaut -(\\d+) CHF le 1er avril\\. Le club encaisse # CHF de cotisations, puis paie une facture de # CHF"), (g, lab) => { const [a, b, c] = g.map(nn), s1 = b - a, s2 = s1 - c;
    return pick(lab, { a: s1, b: s2, c: s2 + a, d: 500 - s2 }); });
  const SEQ = (h0, ops) => { const z = [h0]; for (const o of ops) z.push(z[z.length - 1] + o); return z; };
  DF("reladd", rs("part d'un lac à l'altitude # m\\. Il monte de # m, redescend de # m, remonte de # m puis redescend de # m"), (g, lab) => { const [h, u1, d1, u2, d2] = g.map(nn), z = SEQ(h, [u1, -d1, u2, -d2]);
    return pick(lab, { a: Math.max(...z), b: z[4], c: u1 + u2, d: z[4] - h }); });
  DF("reladd", rs("Elle descend de # m, remonte de # m, redescend de # m puis remonte de # m"), (g, lab) => { const [a, b, c, d] = g.map(nn), z = SEQ(0, [-a, b, -c, d]);
    return pick(lab, { a: Math.min(...z), b: z[4], c: a + c, d: -z[4] }); });
  DF("reladd", rs("il fait § °C à 7 h\\. La température monte de # °C jusqu'à midi, baisse de # °C avec un nuage, remonte de # °C, puis baisse de # °C"), (g, lab) => { const [t, u1, d1, u2, d2] = g.map(nn), z = SEQ(t, [u1, -d1, u2, -d2]);
    return pick(lab, { a: Math.max(...z), b: z[4], c: u1 + u2, d: z[4] - t }); });
  DF("decadd", rs("a # CHF\\. Elle achète un livre à # CHF et un stylo à # CHF"), (g, lab) => { const [B, p1, p2] = g.map(nn), j = lm(lab, /jeu à (\d+(?:,\d+)?) CHF/);
    return pick(lab, { a: p1 + p2, b: B - p1 - p2, c: j ? j[0] - (B - p1 - p2) : null }); });
  DF("decadd", /les quatre coureurs de la classe réalisent (\d+,?\d*) s, (\d+,?\d*) s, (\d+,?\d*) s, (\d+,?\d*) s\. Le record de l'école est de (\d+,?\d*) s/, (g, lab) => { const v = g.map(nn), t = v.slice(0, 4), S = t[0] + t[1] + t[2] + t[3];
    return pick(lab, { a: S, b: S - v[4], c: Math.max(...t) - Math.min(...t) }); });
  DF("decadd", rs("sentier de randonnée mesure # km\\. Le matin, un groupe parcourt deux étapes de # km et # km"), (g, lab) => { const [L, e1, e2] = g.map(nn), e3 = lm(lab, /fait encore (\d+(?:,\d+)?) km/);
    return pick(lab, { a: e1 + e2, b: L - e1 - e2, c: e3 ? L - e1 - e2 - e3[0] : null }); });
  DF("decdiv", rs("groupe de # amis paie # CHF au restaurant .*?boisson à # CHF"), (g, lab) => { const [n, tot, b] = g.map(nn), B = lm(lab, /avec (\d+) CHF/);
    return pick(lab, { a: tot / n, b: tot / n - b, c: B ? Math.floor(B[0] / b + 1e-9) : null }); });
  DF("decdiv", rs("Au marché, # kg d(?:e |')\\S+ coûtent # CHF"), (g, lab) => { const [m, P0] = g.map(nn), u = P0 / m, B = lm(lab, /avec (\d+) CHF/);
    return pick(lab, { a: u, b: B ? B[0] / u : null, c: m / 0.25 }); });
  DF("decdiv", rs("cycliste parcourt # km en # h"), (g, lab) => { const [d, t] = g.map(nn), v = d / t, d2 = lm(lab, /pour (\d+) km/), Lp = lm(lab, /boucle de (\d+(?:,\d+)?) km/);
    return pick(lab, { a: v, b: d2 ? d2[0] / v : null, c: Lp ? Math.floor(d / Lp[0] + 1e-9) : null }); });
  DF("carres", rs("carrelage carré est formé de # dalles carrées identiques de # cm"), (g, lab) => { const [N, s] = g.map(nn), n = Math.sqrt(N), k = lm(lab, /ajoutant (\d+) dalles/);
    return pick(lab, { a: n, b: ((n * s) / 100) ** 2, c: k ? (n + k[0]) ** 2 - N : null }); });
  DF("carres", rs("# élèves se placent en carré plein"), (g, lab) => { const N = nn(g[0]), n = Math.sqrt(N), k = lm(lab, /avec (\d+) élèves? de plus/);
    return pick(lab, { a: n, b: 4 * n - 4, c: k ? (n + k[0]) ** 2 - N : null }); });
  DF("carres", rs("verger compte # pommiers plantés en carré .*?, # m entre deux arbres"), (g, lab) => { const [N, s] = g.map(nn), n = Math.sqrt(N), k = lm(lab, /ajoute (\d+) arbres/);
    return pick(lab, { a: n, b: (n - 1) * s, c: k ? (n + k[0]) ** 2 - N : null }); });
  const ORD = (n, C, e, lab) => { const r = (x, s) => Math.round(x / s) * s, tot = C + n * e; return pick(lab, { a: r(n, 10) * r(e, 10), b: r(C, 100) + r(n, 10) * r(e, 10), c: tot, d: Math.ceil(tot / n - 1e-9) }); };
  DF("ordgr", rs("classe de # élèves part en course d'école\\. Le car coûte # CHF et l'entrée au musée # CHF"), (g, lab) => ORD(...g.map(nn), lab));
  DF("ordgr", rs("classe de # élèves part en camp de ski\\. Le chalet coûte # CHF pour la semaine et le forfait de ski # CHF"), (g, lab) => ORD(...g.map(nn), lab));
  DF("ordgr", rs("# joueurs s'inscrivent\\. La location du terrain coûte # CHF et chaque joueur reçoit un maillot à # CHF"), (g, lab) => ORD(...g.map(nn), lab));
  const FQ = "\\((\\d+)\\)\\/\\((\\d+)\\)";
  DF("fracops", new RegExp("A = " + FQ + " - " + FQ + " · " + FQ + " et B"), (g, lab) => { const [a, b, c, d, e, f] = g.map(nn), A = a / b - (c / d) * (e / f), B = (a / b - c / d) * (e / f);
    return pick(lab, { a: A, b: B, c: A - B }); });
  DF("fracops", new RegExp("A = " + FQ + " \\+ " + FQ + " : " + FQ + " et B"), (g, lab) => { const [a, b, c, d, e, f] = g.map(nn), A = a / b + c / d / (e / f), B = (a / b + c / d) / (e / f);
    return pick(lab, { a: A, b: B, c: B - A }); });
  DF("fracops", new RegExp("devoirs pendant " + FQ + " h, puis joue du piano pendant les " + FQ + " de ce temps, et enfin s'entraîne au basket pendant " + FQ + " h"), (g, lab) => { const [a, b, c, d, e, f] = g.map(nn), p = (a / b) * (c / d), T = a / b + p + e / f;
    return pick(lab, { a: p, b: T, c: 60 * T }); });
  const cntD = (L, k) => L.filter((N) => N % k === 0);
  DF("divcrit", /nombres de quatre chiffres (\d) (\d) ■ ■/, (g, lab) => { const [a, b] = g.map(nn), L = []; for (let x = 0; x < 100; x++) L.push(1000 * a + 100 * b + x); const d45 = cntD(L, 45);
    return pick(lab, { a: d45.length, b: Math.max(...d45), c: cntD(L, 36).length }); });
  DF("divcrit", /nombres de quatre chiffres (\d) ■ (\d) ■/, (g, lab) => { const [a, b] = g.map(nn), L = []; for (let x = 0; x <= 9; x++) for (let y = 0; y <= 9; y++) L.push(1000 * a + 100 * x + 10 * b + y); const d15 = cntD(L, 15);
    return pick(lab, { a: d15.length, b: Math.min(...d15), c: cntD(L, 18).length }); });
  DF("divcrit", /commencent tous par (\d) (\d) ■/, (g, lab) => { const [a, b] = g.map(nn), L = []; for (let y = 0; y <= 9; y++) L.push(100 * a + 10 * b + y);
    return pick(lab, { a: cntD(L, 3).length, b: Math.max(...cntD(L, 9)), c: cntD(L, 6).length }); });
  DF("racenc", /On étudie √\((\d+)\) sans calculatrice/, (g, lab) => { const n = nn(g[0]), k = Math.floor(Math.sqrt(n)), m = lm(lab, /(\d+) < √\(m\) < (\d+)/);
    return pick(lab, { a: k, b: { v: Math.sqrt(n), st: 0.1 }, c: m ? m[1] ** 2 - m[0] ** 2 - 1 : null }); });
  DF("racenc", /jardin carré a une aire de (\d+) m²/, (g, lab) => { const A = nn(g[0]); return pick(lab, { a: Math.floor(Math.sqrt(A)), b: { v: Math.sqrt(A), st: 0.1 }, c: { v: 4 * Math.sqrt(A), st: 1, dir: 1 } }); });
  DF("racenc", /du haut d'une falaise de (\d+) m/, (g, lab) => { const t = Math.sqrt(nn(g[0]) / 5), s = lm(lab, /dure exactement (\d+) s/); return pick(lab, { a: Math.floor(t), b: { v: t, st: 0.1 }, c: s ? 5 * s[0] ** 2 : null }); });
  DF("tradexpr", rs("Un nombre x vaut §\\."), (g, lab) => { const x = nn(g[0]); let m;
    if ((m = lm(lab, /double de la somme de x et (\d+)/))) return 2 * (x + m[0]); if ((m = lm(lab, /somme du double de x et de (\d+)/))) return 2 * x + m[0];
    if ((m = lm(lab, /carré de la différence entre x et (\d+)/))) return (x - m[0]) ** 2; if ((m = lm(lab, /carré de x et le carré de (\d+)/))) return x * x - m[0] ** 2; return null; });
  DF("tradexpr", /ajoute-lui (\d+), multiplie le résultat par (\d+), puis soustrais le carré du nombre choisi/, (g, lab) => { const [a, b] = g.map(nn), f = (x) => b * (x + a) - x * x, x = lm(lab, /avec le nombre ([-−]?\d+)/), V = lm(lab, /on lit (\d+)/);
    return x ? f(x[0]) : V ? V[0] / b - a : null; });
  DF("tradexpr", /dépasse le double de sa largeur de (\d+) cm\. On prend x = (\d+)/, (g, lab) => { const [a, x] = g.map(nn); return pick(lab, { a: 2 * x + a, b: 2 * (3 * x + a), c: x * (2 * x + a) }); });
  DF("valnum", /d = \(v\^2\)\/\((\d+)\), avec v en km\/h/, (g, lab) => { const k = nn(g[0]), v = lm(lab, /pour v = (\d+) km\/h/), m = lm(lab, /multipliée par (\d+)/), D2 = lm(lab, /vaut (\d+(?:,\d+)?) m/);
    return v ? (v[0] * v[0]) / k : m ? m[0] ** 2 : D2 ? Math.sqrt(k * D2[0]) : null; });
  DF("valnum", /tombe d'environ d = 5t\^2 mètres/, (g, lab) => { const t = lm(lab, /pour t = (\d+(?:,\d+)?) s/), m = lm(lab, /multipliée par (\d+)/), D2 = lm(lab, /chute de (\d+) m/);
    return t ? 5 * t[0] ** 2 : m ? m[0] ** 2 : D2 ? Math.sqrt(D2[0] / 5) : null; });
  DF("valnum", /F = 1,8 · C \+ 32/, (g, lab) => { const c = lm(lab, /pour C = ([-−]?\d+)/), f = lm(lab, /indique (\d+(?:,\d+)?) °F/), k = lm(lab, /hausse de (\d+) °C/);
    return c ? 1.8 * c[0] + 32 : f ? (f[0] - 32) / 1.8 : k ? 1.8 * k[0] : null; });
  const PV = (P0, h, b, lab, aOf) => { const P2 = P0 * (1 + h / 100) * (1 - b / 100); return pick(lab, { a: aOf(P2), b: (P2 / P0 - 1) * 100, c: { v: (P0 / P2 - 1) * 100, st: 0.1 } }); };
  DF("pctvar", rs("vélo coûte # CHF\\. Son prix augmente de # %, puis il est soldé à -(\\d+) %"), (g, lab) => PV(...g.map(nn), lab, (x) => x));
  DF("pctvar", rs("compte # abonnés au 1er janvier\\. Leur nombre augmente de # % en janvier, puis baisse de # %"), (g, lab) => PV(...g.map(nn), lab, (x) => x));
  DF("pctvar", rs("verger a produit # kg de pommes\\. .*?augmente de # % ; .*?baisser de # %"), (g, lab) => PV(...g.map(nn), lab, (x) => x));
  const AFF = (x1, c1, x2, c2, lab) => { const p = (c2 - c1) / (x2 - x1), f = c1 - p * x1, B = lm(lab, /avec (\d+) CHF/), t = lm(lab, /intervention de (\d+(?:,\d+)?) h/);
    return pick(lab, { a: p, b: f, c: B ? Math.floor((B[0] - f) / p + 1e-9) : t ? f + p * t[0] : null }); };
  DF("affine", rs("Une course de # km a coûté # CHF, une course de # km # CHF"), (g, lab) => AFF(...g.map(nn), lab));
  DF("affine", rs("Une location de # h a coûté # CHF, une location de # h # CHF"), (g, lab) => AFF(...g.map(nn), lab));
  DF("affine", rs("Une intervention de # h a coûté # CHF, une intervention de # h # CHF"), (g, lab) => AFF(...g.map(nn), lab));
  DF("pyth", rs("échelle de # m est appuyée contre un mur vertical, son pied à # m du mur\\. Le pied glisse et s'arrête à # m du mur"), (g, lab) => { const [L, a, b] = g.map(nn), h1 = Math.sqrt(L * L - a * a), h2 = Math.sqrt(L * L - b * b);
    return pick(lab, { a: h1, b: h2, c: (h1 - h2) * 100 }); });
  DF("pyth", rs("parc rectangulaire mesure # m sur # m\\. .*?Ils marchent à # m/s"), (g, lab) => { const [L, l, v] = g.map(nn), d = Math.sqrt(L * L + l * l); return pick(lab, { a: d, b: L + l - d, c: (L + l - d) / v }); });
  DF("pyth", rs("à # m du sol\\. La ficelle mesure # m, et le cerf-volant est à la verticale d'un arbre situé à # m"), (g, lab) => { const [m, L, d] = g.map(nn), h = Math.sqrt(L * L - d * d); return pick(lab, { a: h, b: h + m, c: (d * h) / 2 }); });
  DF("simil", rs("photo de # cm sur # cm est agrandie : sa largeur passe à # cm\\. .*?l'original coûte # CHF"), (g, lab) => { const [w, l, W, p] = g.map(nn), k = W / w; return pick(lab, { a: k, b: k * l, c: p * k * k }); });
  DF("simil", rs("échelle 1 : #\\. Sur la maquette : hauteur # cm, aire au sol # cm², volume # cm³"), (g, lab) => { const [n, h, A, V] = g.map(nn); return pick(lab, { a: (h * n) / 100, b: (A * n * n) / 1e4, c: (V * n ** 3) / 1e6 }); });
  DF("simil", rs("petite pizza a un diamètre de # cm et coûte # CHF ; la grande a un diamètre de # cm"), (g, lab) => { const [d1, p, d2] = g.map(nn), k = d2 / d1, m = lm(lab, /garnie de (\d+) g/); return pick(lab, { a: k, b: p * k * k, c: m ? m[0] * k * k : null }); });
  /* --- eq1, probeq, probeq2 (ch1c_eq), litelab, parenth (ch11_litt), fctlec (perco) --- */
  const EQL = (A0, a, B0, b, lab, k) => { const t = (B0 - A0) / (a - b); return pick(lab, { a: A0 + k * a, b: t, c: A0 + a * t }); };
  DF("eq1", rs("La bougie A mesure # cm et raccourcit de # cm par heure ; la bougie B mesure # cm et raccourcit de # cm par heure"), (g, lab) => { const [h1, a, h2, b] = g.map(nn); return EQL(h1, -a, h2, -b, lab, 2); });
  DF("eq1", rs("La citerne A contient # L et perd # L par minute ; la citerne B contient # L et perd # L par minute"), (g, lab) => { const [h1, a, h2, b] = g.map(nn); return EQL(h1, -a, h2, -b, lab, 3); });
  DF("eq1", rs("a # CHF dans sa tirelire et y ajoute # CHF chaque semaine\\. \\S+ a # CHF et y ajoute # CHF chaque semaine"), (g, lab) => { const [A0, a, B0, b] = g.map(nn); return EQL(A0, a, B0, b, lab, 4); });
  const BRK = (F1, p1, F2, p2, lab, n) => { const x = (F2 - F1) / (p1 - p2); return pick(lab, { a: F1 + n * p1, b: x, c: F1 + p1 * x }); };
  DF("probeq", rs("musée propose l'entrée à # CHF, ou un abonnement de # CHF qui fait payer l'entrée # CHF"), (g, lab) => { const [a, A, b] = g.map(nn); return BRK(0, a, A, b, lab, 10); });
  DF("probeq", rs("l'agence A demande # CHF plus # CHF par km ; l'agence B demande # CHF plus # CHF par km"), (g, lab) => { const [F1, p1, F2, p2] = g.map(nn); return BRK(F1, p1, F2, p2, lab, 100); });
  DF("probeq", rs("l'imprimerie A facture # CHF de frais fixes plus # CHF par affiche ; l'imprimerie B facture # CHF de frais fixes plus # CHF par affiche"), (g, lab) => { const [F1, p1, F2, p2] = g.map(nn); return BRK(F1, p1, F2, p2, lab, 50); });
  const posR = (a, b, c) => (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
  DF("probeq2", rs("photo de # cm sur # cm est entourée d'un cadre de largeur x\\. L'ensemble mesure # cm²"), (g, lab) => { const [w, h, A] = g.map(nn); return pick(lab, { a: w * h, b: posR(4, 2 * (w + h), w * h - A), c: A - w * h }); });
  DF("probeq2", rs("deux nombres entiers positifs consécutifs vaut #\\."), (g, lab) => { const n = posR(1, 1, -nn(g[0])); return pick(lab, { a: n, b: n + 1, c: n * n + (n + 1) ** 2 }); });
  DF("probeq2", rs("carré de # cm de côté en allongeant chaque côté de x cm\\. Son aire augmente alors de # cm²"), (g, lab) => { const [c, D] = g.map(nn), x = posR(1, 2 * c, -D); return pick(lab, { a: c * c, b: x, c: 4 * (c + x) }); });
  DF("litelab", /rectangle a une largeur x cm et une longueur x \+ (\d+) cm/, (g, lab) => { const k = nn(g[0]), x = lm(lab, /pour x = (\d+)/), P = lm(lab, /périmètre de (\d+) cm/);
    return pick(lab, { a: x ? 4 * x[0] + 2 * k : null, b: x ? x[0] * (x[0] + k) : null, c: P ? (P[0] - 2 * k) / 4 : null }); });
  DF("litelab", /triangle isocèle a une base de x cm, et ses deux autres côtés mesurent chacun x \+ (\d+) cm/, (g, lab) => { const k = nn(g[0]), x = lm(lab, /pour x = (\d+)/), P = lm(lab, /périmètre (?:de|vaut) (\d+) cm/);
    return pick(lab, { a: x ? 3 * x[0] + 2 * k : null, b: P ? (P[0] - 2 * k) / 3 : null, c: P ? (P[0] - 2 * k) / 3 + k : null }); });
  DF("litelab", /a x ans\. \S+ \S+ a (\d+) ans de plus qu(?:e \S+|'elle), et leur mère a le triple/, (g, lab) => { const k = nn(g[0]), x = lm(lab, /pour x = (\d+)/), S2 = lm(lab, /vaut (\d+) ans/); return pick(lab, { a: x ? 5 * x[0] + k : null, b: S2 ? (S2[0] - k) / 5 : null, c: S2 ? (3 * (S2[0] - k)) / 5 : null }); });
  DF("parenth", /E = (\d+)x - \(2x - (\d+)\) - \(x \+ (\d+)\)/, (g, lab) => { const [a, b, c] = g.map(nn), k = a - 3, s = b - c, x = lm(lab, /x = (\d+)/); return pick(lab, { a: k, b: s, c: x ? k * x[0] + s : null }); });
  DF("parenth", /E = (\d+)\(x \+ (\d+)\) - 2\(x - (\d+)\)/, (g, lab) => { const [a, b, c] = g.map(nn), k = a - 2, s = a * b + 2 * c, x = lm(lab, /x = (\d+)/); return pick(lab, { a: k, b: s, c: x ? k * x[0] + s : null }); });
  const LIN = (b0, p, lab, re) => { const m = lm(lab, re), ds = lab.match(/de (\d+) \S+ à (\d+) /); if (L0(lab, "c") && ds) return p * (nn(ds[2]) - nn(ds[1])); return m ? b0 + p * m[0] : null; };
  DF("fctlec", rs("taxi facture # CHF de prise en charge, puis # CHF par kilomètre"), (g, lab) => { const [b0, p] = g.map(nn); return LIN(b0, p, lab, /course de (\d+) km/); });
  DF("fctlec", rs("location d'un kayak coûte # CHF de base, plus # CHF par heure"), (g, lab) => { const [b0, p] = g.map(nn); return LIN(b0, p, lab, /Prix pour (\d+) h/); });
  DF("fctlec", rs("abonnement de # CHF, plus # CHF par kWh"), (g, lab) => { const [b0, p] = g.map(nn); return LIN(b0, p, lab, /Facture pour (\d+) kWh/); });
  /* ==== fin agent defisch ==== */

  /* ---------- 26.11 (agent defis2) : notions encore sous 20 % (transf, trigcercle, trigfn, recip, lectures de graphique
     de f2 / f2expr, histoires de probeq, formes de decadd) ---------- */
  const fxT = (tex) => { const c = compile(Expr.parse(tex2e(tex))); return (u) => c({ x: u }); };
  const DEG = Math.PI / 180;
  /* lecture d'une figure FIG.plot : graduations → échelle ; courbe (1er chemin f-accent) ; points marqués (f-dot) */
  function figRead(svg) {
    if (!svg || typeof DOMParser === "undefined") return null;
    const doc = new DOMParser().parseFromString(String(svg), "image/svg+xml"), tx = [], ty = [];
    for (const t of doc.querySelectorAll("text")) { if (!/f-tick/.test(t.getAttribute("class") || "")) continue; const v = +t.textContent.replace("−", "-"); if (!isFinite(v)) continue;
      if (t.getAttribute("text-anchor") === "middle") tx.push([v, +t.getAttribute("x")]); else ty.push([v, +t.getAttribute("y") - 4]); }
    if (tx.length < 2 || ty.length < 2) return null;
    const lin = (P) => { const [a, b] = [P[0], P[P.length - 1]], k = (b[1] - a[1]) / (b[0] - a[0]); return (px) => a[0] + (px - a[1]) / k; };
    const X = lin(tx), Y = lin(ty), path = doc.querySelector("path.f-accent, path[class~='f-accent']");
    const curve = []; if (path) for (const m of (path.getAttribute("d") || "").matchAll(/(-?[\d.]+),(-?[\d.]+)/g)) curve.push([X(+m[1]), Y(+m[2])]);
    const dots = [...doc.querySelectorAll("circle")].filter((c) => /f-dot/.test(c.getAttribute("class") || "")).map((c) => ({ x: X(+c.getAttribute("cx")), y: Y(+c.getAttribute("cy")), px: +c.getAttribute("cx"), py: +c.getAttribute("cy"), lab: "" }));
    for (const t of doc.querySelectorAll("text")) { if ((t.getAttribute("class") || "") !== "f-txt") continue; const px = +t.getAttribute("x"), py = +t.getAttribute("y"); let best = null, bd = 30;
      for (const d of dots) { const dd = Math.hypot(d.px - px, d.py - py); if (dd < bd) { bd = dd; best = d; } } if (best) best.lab = t.textContent.trim(); }
    return { curve, dots };
  }
  /* parabole lue : moindres carrés sur les points du tracé → [a, b, c] ; lecture « propre » à la demi-unité */
  const quadFit = (P) => { if (P.length < 10) return null; const S = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]; for (const [x, y] of P) { const r = [x * x, x, 1]; for (let i = 0; i < 3; i++) { for (let j = 0; j < 3; j++) S[i][j] += r[i] * r[j]; S[i][3] += r[i] * y; } }
    for (let i = 0; i < 3; i++) { let p = i; for (let k = i + 1; k < 3; k++) if (Math.abs(S[k][i]) > Math.abs(S[p][i])) p = k; [S[i], S[p]] = [S[p], S[i]]; for (let k = 0; k < 3; k++) if (k !== i) { const f = S[k][i] / S[i][i]; for (let j = i; j < 4; j++) S[k][j] -= f * S[i][j]; } }
    return [S[0][3] / S[0][0], S[1][3] / S[1][1], S[2][3] / S[2][2]]; };
  const clean = (v, st = 0.5, tol = 0.08) => { const r = Math.round(v / st) * st; return Math.abs(v - r) <= tol ? r : NaN; };
  const quadRead = (x) => { const F = figRead(x.fig); if (!F) return null; const q = quadFit(F.curve); if (!q) return null; const [a, b, c] = q, D = b * b - 4 * a * c, h = -b / (2 * a);
    return { F, a, h: clean(h), k: clean(c - (b * b) / (4 * a)), z: D > 0 ? [(-b - Math.sqrt(D)) / (2 * a), (-b + Math.sqrt(D)) / (2 * a)].sort((u, v) => u - v).map((u) => clean(u)) : [] }; };
  G.push({ name: "parabole lue sur la figure", f(x) {
    if (!["f2", "f2expr"].includes(x.id) || !x.fig || !/parabole|Parabole/.test(x.raw) || !/[Ll]is|lue?s?\b|marqués?|point marqué/.test(x.raw)) return null;
    const Q = quadRead(x); if (!Q) return null;
    if (x.spec.kind === "set" && /Lis ses zéros/.test(x.raw)) return { set: Q.z, f: (u) => [Q.a * (u - Q.z[0]) * (u - Q.z[1]), 0] };
    if (x.spec.kind === "value" && /axe de symétrie/.test(x.raw) && /zéros/.test(x.raw)) return Q.z.length === 2 ? { v: (Q.z[0] + Q.z[1]) / 2 } : { v: NaN };
    if (x.spec.kind === "pair" && /Lis les coordonnées de son sommet/.test(x.raw)) return { pair: [Q.h, Q.k] };
    if (x.spec.kind === "expr" && /Lis son sommet et son orientation/.test(x.raw)) return { expr: Expr.parse((Q.a < 0 ? "-" : "") + "(x-(" + Q.h + "))^2+(" + Q.k + ")") };
    if (x.spec.kind === "expr" && /Lis le sommet sur le graphique \(la parabole a la même ouverture que \\\(y = (-?)x\^2\\\)\)/.test(x.raw)) { const s = /même ouverture que \\\(y = -x\^2/.test(x.raw) ? -1 : 1; if (Math.abs(Q.a - s) > 0.05) return { err: "ouverture lue " + Q.a.toFixed(2) + " au lieu de " + s }; return { expr: Expr.parse((s < 0 ? "-" : "") + "(x-(" + Q.h + "))^2+(" + Q.k + ")") }; }
    if (x.spec.kind === "value" && /sommet \\\(S\\\) et passe par le point \\\(P\\\)/.test(x.raw)) { const S = Q.F.dots.find((d) => d.lab === "S"), P = Q.F.dots.find((d) => d.lab === "P"); if (!S || !P) return null; const sx = clean(S.x), sy = clean(S.y), px = clean(P.x), py = clean(P.y); return { v: (py - sy) / (px - sx) ** 2 }; }
    if (x.spec.kind === "value" && /a\(x - x_1\)\(x - x_2\)/.test(x.raw) && /ordonnée à l'origine/.test(x.raw)) { const d0 = Q.F.dots.find((d) => Math.abs(d.x) < 0.05); if (!d0 || Q.z.length !== 2) return null; return { v: clean(d0.y) / (Q.z[0] * Q.z[1]) }; }
    return null;
  } });
  /* f2, f2expr : sommet par la formule ; parabole donnée par son axe, son ordonnée à l'origine et un point */
  G.push({ name: "parabole (sommet, axe)", f(x) {
    if (!["f2", "f2expr"].includes(x.id)) return null; let m;
    if (x.spec.kind === "pair" && (m = /^Détermine le sommet de \\\(f\(x\) = (.+?)\\\)/.exec(x.raw))) { const f = fxT(m[1]), a = (f(1) + f(-1) - 2 * f(0)) / 2, b = (f(1) - f(-1)) / 2; if (!a) return null; const h = -b / (2 * a); return { pair: [h, f(h)] }; }
    if (x.spec.kind === "expr" && (m = /pour axe de symétrie la droite \\\(x = (-?\d+)\\\), coupe l'axe des \\\(y\\\) en \\\((-?\d+)\\\) et passe par \\\(\((-?\d+) \\,;\\, (-?\d+)\)\\\)/.exec(x.raw))) { const [h, c, p, q] = m.slice(1).map(Number), den = (p - h) ** 2 - h * h; if (!den) return { err: "point symétrique de l'ordonnée à l'origine : parabole non déterminée" }; const a = (q - c) / den, k = c - a * h * h; return { expr: Expr.parse("(" + a + ")*(x-(" + h + "))^2+(" + k + ")") }; }
    return null;
  } });
  /* transf : translations et dilatations verticales de graphes */
  G.push({ name: "transformation de graphe", f(x) {
    if (x.id !== "transf") return null;
    const r = x.raw; let m;
    if (x.spec.kind === "expr" && (m = /On décale la parabole \\\(y = x\^2\\\) de \\\((\d+)\\\) vers la (gauche|droite) et de \\\((\d+)\\\) vers le (haut|bas)/.exec(r))) { const h = (m[2] === "gauche" ? -1 : 1) * +m[1], k = (m[4] === "bas" ? -1 : 1) * +m[3]; return { expr: Expr.parse("(x-(" + h + "))^2+(" + k + ")") }; }
    const gdef = /g\(x\) = (-?\d*)f\(x ([+-]) (\d+)\)(?: ([+-]) (\d+))?/.exec(r), A = gdef ? (gdef[1] === "" ? 1 : gdef[1] === "-" ? -1 : +gdef[1]) : 1, H = gdef ? (gdef[2] === "-" ? +gdef[3] : -gdef[3]) : 0, K = gdef && gdef[4] ? (gdef[4] === "+" ? +gdef[5] : -gdef[5]) : 0;
    const argmin = (f) => { let lo = -60, hi = 60; for (let i = 0; i < 200; i++) { const a = lo + (hi - lo) / 3, b = hi - (hi - lo) / 3; if (f(a) < f(b)) hi = b; else lo = a; } const u = (lo + hi) / 2; return [+u.toFixed(6), +f(u).toFixed(6)]; };
    if (x.spec.kind === "pair" && (m = /^Le graphe de \\\(g\(x\) = ([^\\]+?)\\\) est obtenu en déplaçant celui de \\\(f\(x\) = x\^2\\\)\. Quel est le sommet/.exec(r))) return { pair: argmin(fxT(m[1])) };
    if (x.spec.kind === "pair" && gdef && (m = /^Soit \\\(f\(x\) = ([^\\]+?)\\\) et \\\(g\(x\)/.exec(r)) && /sommet de la parabole de/.test(r)) { const f = fxT(m[1]); return { pair: argmin((u) => A * f(u - H) + K) }; }
    if (x.spec.kind === "value" && gdef && (m = /^Soit \\\(f\(x\) = (.+?)\\\) et \\\(g\(x\)/.exec(r)) && /minimum de \\\(g\\\) est-il atteint/.test(r)) { const f = fxT(m[1]); return { v: argmin((u) => A * f(u - H) + K)[0] }; }
    if (x.spec.kind === "pair" && gdef && (m = /Le point \\\(P\((-?\d+) ; (-?\d+)\)\\\) est sur le graphe de \\\(f\\\)/.exec(r))) return { pair: [+m[1] + H, A * +m[2] + K] };
    if (x.spec.kind === "value" && gdef && (m = /On sait que \\\(f\((-?\d+)\) = (-?\d+)\\\)\..*Calcule \\\(g\((-?\d+)\)\\\)/.exec(r))) return +m[3] - H === +m[1] ? { v: A * +m[2] + K } : { err: "g(" + m[3] + ") demande f(" + (+m[3] - H) + "), inconnu (on donne f(" + m[1] + "))" };
    if (x.spec.kind === "value" && (m = /^Le graphe de \\\(g\(x\) = ([^\\]+?)\\\) est celui de \\\(f\(x\) = ([^\\]+?)\\\) déplacé\. De combien d'unités est-il décalé (horizontalement|verticalement)/.exec(r))) { const a = argmin(fxT(m[1])), b = argmin(fxT(m[2])); return { v: m[3] === "horizontalement" ? a[0] - b[0] : a[1] - b[1] }; }
    if (x.spec.kind === "value" && gdef && (m = /^Soit \\\(f\(x\) = (.+?)\\\) et \\\(g\(x\)/.exec(r)) && /Quelle est la valeur minimale de \\\(g\\\)/.test(r)) { const f = fxT(m[1]); return { v: argmin((u) => A * f(u - H) + K)[1] }; }
    if (x.spec.kind === "pair" && (m = /envoie la parabole \\\(y = x\^2\\\) sur \\\(y = ([^\\]+?)\\\)/.exec(r))) return { pair: argmin(fxT(m[1])) };
    return null;
  } });
  /* trigcercle, trigfn : cercle trigonométrique et fonctions sinusoïdales (balayage numérique) */
  G.push({ name: "trigonométrie (cercle, fonctions)", f(x) {
    if (!["trigcercle", "trigfn"].includes(x.id)) return null;
    const r = x.raw, sp = x.spec; let m;
    if (sp.kind === "value" && (m = /^Convertis \\\((-?\d+)°\\\) en radians/.exec(r))) return { v: +m[1] * DEG };
    if (sp.kind === "value" && (m = /^Convertis \\\((.+?)\\\) radians en degrés/.exec(r))) return { v: ev(m[1]) / DEG };
    if (sp.kind === "value" && (m = /quadrant du cercle trigonométrique se trouve l'angle \\\((-?\d+)°\\\)/.exec(r))) { const a = ((+m[1] % 360) + 360) % 360; return a % 90 ? { v: Math.floor(a / 90) + 1 } : { err: "angle sur un axe : pas de quadrant" }; }
    if (sp.kind === "value" && (m = /a le même point sur le cercle trigonométrique que \\\((-?\d+)°\\\)/.exec(r))) return { v: ((+m[1] % 360) + 360) % 360 };
    if (sp.kind === "value" && (m = /^Donne la valeur exacte de \\\(\\(sin|cos|tan) (-?\d+)°\\\)/.exec(r))) return { v: Math[m[1]](+m[2] * DEG) };
    if (sp.kind === "pair" && (m = /cercle trigonométrique associé à (?:\\\((-?\d+)°\\\)|l'angle \\\((.+?)\\\) \(en radians\))/.exec(r))) { const t = m[1] !== undefined ? +m[1] * DEG : ev(m[2]); return { pair: [Math.cos(t), Math.sin(t)] }; }
    if (sp.kind === "value" && (m = /^Quel angle \\\(\\alpha\\\) compris entre \\\((\d+)°\\\) et \\\((\d+)°\\\) vérifie \\\(\\(sin|cos|tan) \\alpha = (.+?)\\\)/.exec(r))) { const w = ev(m[4]), S = []; for (let t = +m[1]; t <= +m[2]; t++) if (Math.abs(Math[m[3]](t * DEG) - w) < 1e-9) S.push(t); return S.length === 1 ? { v: S[0] } : { err: S.length + " angles conviennent : " + S.join(", ") }; }
    /* fonctions sinusoïdales (x en degrés sauf mention « radians ») */
    const fm = /f\(x\) = ([^\\]*?(?:\\(?:sin|cos)[^\\]*?)+)\\\)/.exec(r); if (!fm) { if ((m = /a pour maximum \\\((-?[\d{},]+)\\\) et pour minimum \\\((-?[\d{},]+)\\\)\. Que vaut \\\(([ad])\\\)/.exec(r))) { const M2 = ev(m[1]), m2 = ev(m[2]); return { v: m[3] === "d" ? (M2 + m2) / 2 : (M2 - m2) / 2 }; } return null; }
    if (/f\(x\) = a\\sin\(x\) \+ d/.test(r)) { if ((m = /a pour maximum \\\((-?[\d{},]+)\\\) et pour minimum \\\((-?[\d{},]+)\\\)\. Que vaut \\\(([ad])\\\)/.exec(r))) { const M2 = ev(m[1]), m2 = ev(m[2]); return { v: m[3] === "d" ? (M2 + m2) / 2 : (M2 - m2) / 2 }; } return null; }
    let f; try { f = fxT(fm[1]); } catch (e) { return null; }
    const fd = (d) => f(d * DEG), grid = (a, b, st) => { const out = []; for (let i = 0; a + i * st <= b + 1e-9; i++) out.push(+(a + i * st).toFixed(6)); return out; };
    const G1 = grid(0, 360, 0.25), V = G1.map(fd), mx = Math.max(...V), mn = Math.min(...V);
    if (sp.kind === "value" && /amplitude/.test(r)) return { v: (mx - mn) / 2 };
    if (sp.kind === "value" && (m = /valeur (minimale|maximale) de/.exec(r))) return { v: m[1] === "minimale" ? mn : mx };
    if (sp.kind === "value" && (m = /^Sur l'intervalle \\\(0° \\le x < 360°\\\), en quel \\\(x\\\) la fonction .* atteint-elle son (minimum|maximum)/.exec(r))) { const w = m[1] === "minimum" ? mn : mx, S = G1.filter((d, i) => d < 360 && Math.abs(V[i] - w) < 1e-9); return S.length === 1 ? { v: S[0] } : { err: "extremum atteint en " + S.join(", ") }; }
    if (sp.kind === "value" && (m = /^En quel plus petit \\\(x > 0\\\) \(en degrés\) la fonction .* atteint-elle son (minimum|maximum)/.exec(r))) { const w = m[1] === "minimum" ? mn : mx; for (const d of grid(0.25, 720, 0.25)) if (Math.abs(fd(d) - w) < 1e-9) return { v: d }; return { v: NaN }; }
    if (sp.kind === "value" && (m = /\(x en degrés\)\. Calcule \\\(f\((-?\d+)°\)\\\)/.exec(r))) return { v: fd(+m[1]) };
    if (sp.kind === "value" && /^Quelle est la période/.test(r)) { const rad = /x en radians/.test(r), u = rad ? 1 : DEG, P0 = [0.3, 1.1, 2.7, 4.2], err = (t) => P0.reduce((a, p) => a + Math.abs(f(p + t * u) - f(p)), 0), st = rad ? 0.002 : 0.1, top = rad ? 30 : 1800;
      for (let t = st; t <= top; t += st) { if (!(err(t) < err(t - st) && err(t) <= err(t + st) && err(t) < 0.05)) continue; let lo = t - st, hi = t + st; for (let i = 0; i < 100; i++) { const a = lo + (hi - lo) / 3, b = hi - (hi - lo) / 3; if (err(a) < err(b)) hi = b; else lo = a; } const T = (lo + hi) / 2; if (err(T) < 1e-7) return { v: T }; }
      return { v: NaN }; }
    if (sp.kind === "value" && /coupe-t-elle l'axe des abscisses pour \\\(0° \\le x \\le 360°\\\)/.test(r)) { let n = 0; const st = 0.25; for (let i = 0; i < G1.length; i++) { if (Math.abs(V[i]) < 1e-9) n++; else if (i && Math.abs(V[i - 1]) >= 1e-9 && V[i - 1] * V[i] < 0) n++; } return { v: n }; }
    return null;
  } });
  /* recip : réciproque (valeur et expression), composée */
  G.push({ name: "réciproque", f(x) {
    if (x.id !== "recip") return null;
    const r = x.raw, sp = x.spec; let m;
    if (sp.kind === "value" && (m = /\\\(f\(x\) = (.+?)\\\) et \\\(g\(x\) = (.+?)\\\)\. Calcule \\\(\((f|g) \\circ (f|g)\)\((-?\d+)\)\\\)/.exec(r))) { const F = { f: fxT(m[1]), g: fxT(m[2]) }; return { v: F[m[3]](F[m[4]](+m[5])) }; }
    const fm = /(?:^Soit|^La fonction) \\\(f\(x\) = (.+?)\\\)/.exec(r); if (!fm) return null; let f; try { f = fxT(fm[1]); } catch (e) { return null; }
    const dom = /(?:\\\(A = |bijection de \\\()\[(-?\d+) \\,;\\, \+\\infty\[/.exec(r), lo = dom ? +dom[1] : -Infinity;
    if (sp.kind === "value" && (m = /Calcule \\\(f\^\{-1\}\((-?\d+)\)\\\)/.exec(r))) { const y = +m[1], S = (roots((u) => [f(u), y]) || []).filter((u) => u >= lo - 1e-9); return S.length === 1 ? { v: S[0] } : { err: S.length + " antécédents de " + y + " : " + S.map(fmt).join(" ; ") }; }
    if (sp.kind === "expr" && /Donne l'expression de \\\(f\^\{-1\}\(x\)\\\)/.test(r)) { let E; try { E = compile(Expr.parse(sp.expr)); } catch (e) { return null; }
      const im = /vers \\\(\[(-?\d+) \\,;\\, \+\\infty\[/.exec(r), y0 = im ? +im[1] : -5; let n = 0;
      for (const t of [0.4, 1.3, 2.9, 5.1, 7.7]) { const y = y0 + t, u = E({ x: y }), b = f(u); if (!isFinite(u) || !isFinite(b)) continue; n++; if (Math.abs(b - y) > 1e-7 * (1 + Math.abs(y))) return { err: "f(f⁻¹(" + fmt(y) + ")) = " + fmt(b) }; }
      return n >= 3 ? { err: null } : null; }
    return null;
  } });

  /* probeq : histoires restantes ; decadd : rendu de monnaie, écarts, bouteille */
  T("probeq", /La somme de (\d+) nombres (pairs |impairs |entiers )?consécutifs vaut (-?\d+)\. Quel est le plus (petit|grand)/i, (k, t, S, w) => { k = +k; S = +S; const st = t ? 2 : 1, n = (S - (st * k * (k - 1)) / 2) / k; return w === "petit" ? n : n + st * (k - 1); }, { raw: true });
  T("probeq", /a obtenu les notes ((?:\d+(?:,\d+)?, )+\d+(?:,\d+)?)\. Quelle note doit-il obtenir au prochain test pour avoir exactement (\d+(?:,\d+)?) de moyenne/i, (L, m) => { const v = L.split(", ").map(num); return num(m) * (v.length + 1) - v.reduce((a, b) => a + b, 0); }, { raw: true });
  T(null, /Après une réduction de (\d+(?:,\d+)?) ?%, [^.]*? coûte (\d+(?:'\d{3})*(?:,\d+)?) (?:CHF|€)\. Quel était son prix avant/i, (p, P) => P / (1 - p / 100));
  T("probeq", /(Deux|Trois|Quatre) amis partagent un sac de [^.]+\. Chacun se réveille à son tour et mange (la moitié|un tiers|un quart) de ce qui reste dans le sac\. Au matin, il reste (\d+) /i, (n, f, r) => { const k = { deux: 2, trois: 3, quatre: 4 }[n.toLowerCase()], q = { "la moitié": 1 / 2, "un tiers": 1 / 3, "un quart": 1 / 4 }[f]; return +r / (1 - q) ** k; }, { raw: true });
  T(null, /à (\d+(?:,\d+)?) (?:CHF|€) et tu paies avec un billet de (\d+) (?:CHF|€)\. Combien te rend-on/i, (a, b) => b - a);
  T(null, /court le 100 m en (\d+(?:,\d+)?) s et \S+ (\d+(?:,\d+)?) s\. Quel est l'écart/i, (a, b) => Math.abs(a - b));
  T(null, /saute en longueur (\d+(?:,\d+)?) m et \S+ (\d+(?:,\d+)?) m\. Quel est l'écart/i, (a, b) => Math.abs(a - b));
  T(null, /contient (\d+(?:,\d+)?) L ; on en verse (\d+(?:,\d+)?) L\. Combien reste-t-il/i, (a, b) => a - b);

  /* ---------- 26.11 (agent defis2) : autres notions fréquentes encore non couvertes (inter, homog, polydiv, nbderive,
     combi, milieux, suites arithmétiques et géométriques, tauxevol) ---------- */
  const fdefs = (raw) => { const o = {}; for (const t of math(raw)) { const m = /^\s*(?:([a-zA-Z])\(([xt])\)|(?:[de] : )?y) = ([\s\S]+)$/.exec(t); if (!m) continue; const k = m[1] || "y" + Object.keys(o).length; try { o[k] = fxT(m[2] === "t" ? m[3].replace(/(?<![a-zA-Z\\])t(?![a-zA-Z])/g, "x") : m[3]); } catch (e) {} } return o; };
  G.push({ name: "intersections de graphes", f(x) {
    if (x.id !== "inter") return null; const r = x.raw, sp = x.spec, F = Object.values(fdefs(r)); let m;
    if ((m = /la droite \\\(y = k\\\) est-elle tangente à la parabole \\\(f\(x\) = (.+?)\\\)/.exec(r))) { const f = fxT(m[1]), a = (f(1) + f(-1) - 2 * f(0)) / 2, b = (f(1) - f(-1)) / 2; return { v: f(-b / (2 * a)) }; }
    if (F.length < 2) return null; const [f, g] = F, R0 = roots((u) => [f(u), g(u)]); if (!R0) return null;
    if (sp.kind === "set") return { set: R0, f: (u) => [f(u), g(u)] };
    if (sp.kind === "value" && /Combien de points d'intersection/.test(r)) return { v: R0.length };
    if (sp.kind === "value" && /distance horizontale/.test(r)) return R0.length === 2 ? { v: Math.abs(R0[1] - R0[0]) } : { err: R0.length + " points communs" };
    if (sp.kind === "pair") { let u; if (R0.length === 1) u = R0[0]; else if (/abscisse positive/.test(r)) { const P2 = R0.filter((t) => t > 0); if (P2.length !== 1) return { err: P2.length + " points d'abscisse positive" }; u = P2[0]; } else if (/abscisse négative/.test(r)) { const P2 = R0.filter((t) => t < 0); if (P2.length !== 1) return { err: P2.length + " points d'abscisse négative" }; u = P2[0]; } else if (/plus à droite/.test(r)) u = Math.max(...R0); else if (/plus à gauche/.test(r)) u = Math.min(...R0); else return { err: R0.length + " points communs, lequel ?" }; return { pair: [u, f(u)] }; }
    return null;
  } });
  G.push({ name: "fonction homographique", f(x) {
    if (x.id !== "homog") return null; const r = x.raw; const m = /^Soit \\\(f\(x\) = (.+?)\\\)\./.exec(r); if (!m) return null; let f; try { f = fxT(m[1]); } catch (e) { return null; }
    if (x.spec.kind === "value" && /asymptote verticale/.test(r)) { const d = /\\frac\{.+?\}\{(.+?)\}$/.exec(m[1]); if (!d) return null; const R0 = roots((u) => [fxT(d[1])(u), 0]); return R0 && R0.length === 1 ? { v: R0[0] } : null; }
    if (x.spec.kind === "value" && /asymptote horizontale/.test(r)) { const a = f(1e7), b = f(-1e7); return { v: (a + b) / 2 }; }
    if (x.spec.kind === "expr" && /réciproque/.test(r)) { let E; try { E = compile(Expr.parse(x.spec.expr)); } catch (e) { return null; } let n = 0;
      for (const y of [-7.3, -2.2, 0.6, 3.1, 9.4]) { const u = E({ x: y }), b = f(u); if (!isFinite(u) || !isFinite(b) || Math.abs(u) > 1e6) continue; n++; if (Math.abs(b - y) > 1e-7 * (1 + Math.abs(y))) return { err: "f(f⁻¹(" + fmt(y) + ")) = " + fmt(b) }; }
      return n >= 3 ? { err: null } : null; }
    return null;
  } });
  G.push({ name: "division de polynômes", f(x) {
    if (x.id !== "polydiv") return null; const r = x.raw, sp = x.spec; let m;
    const P = /([PA])\(x\) = ([^\\]+?)\\\)/.exec(r); if (!P) return null;
    if (sp.kind === "value" && (m = /reste de la division de \\\(P\(x\) = (.+?)\\\) par \\\(x ([+-]) (\d+)\\\)/.exec(r))) return { v: fxT(m[1])((m[2] === "-" ? 1 : -1) * +m[3]) };
    if (sp.kind === "expr" && (m = /divisible par \\\(x ([+-]) (\d+)\\\), donne le quotient/.exec(r))) { const p = fxT(P[2]), a = (m[1] === "-" ? 1 : -1) * +m[2]; let Q; try { Q = compile(Expr.parse(sp.expr)); } catch (e) { return null; }
      for (const t of [-2.3, -0.7, 1.4, 3.6]) { const w = Q({ x: t }) * (t - a), v = p(t); if (Math.abs(w - v) > 1e-7 * (1 + Math.abs(v))) return { err: "Q(x)·(x − " + a + ") ≠ P(x) en x = " + t }; } return { err: null }; }
    if (sp.kind === "expr" && (m = /de \\\(A\(x\) = (.+?)\\\) par \\\(B\(x\) = (.+?)\\\)\. Donne le reste/.exec(r))) { const A = fxT(m[1]), B = fxT(m[2]), Rr = roots((u) => [B(u), 0]); let Re; try { Re = compile(Expr.parse(sp.expr)); } catch (e) { return null; } if (!Rr || Rr.length !== 2) return null;
      for (const t of Rr) { const d = A(t) - Re({ x: t }); if (Math.abs(d) > 1e-6 * (1 + Math.abs(A(t)))) return { err: "A − R ne s'annule pas en la racine " + fmt(t) + " de B" }; } return /x\^[2-9]/.test(sp.expr) ? { err: "reste de degré ≥ 2" } : { err: null }; }
    const lin = (expr, vars, pts) => { const T2 = Expr.parse(tex2e(expr)), ev2 = (env) => Expr.evaluate(T2, env); return pts.map((t) => { const e0 = { x: t }; vars.forEach((v) => (e0[v] = 0)); const c0 = ev2(e0); return [...vars.map((v) => { const e1 = { ...e0 }; e1[v] = 1; return ev2(e1) - c0; }), -c0]; }); };
    if (sp.kind === "value" && (m = /\\\(P\(x\) = (.+?)\\\) soit divisible par \\\(x ([+-]) (\d+)\\\)/.exec(r)) && /Détermine \\\(k\\\)/.test(r)) { const [[a, c]] = lin(m[1], ["k"], [(m[2] === "-" ? 1 : -1) * +m[3]]); return a ? { v: c / a } : null; }
    if (sp.kind === "pair" && (m = /\\\(P\(x\) = (.+?)\\\) soit divisible par \\\((.+?)\\\)\. Réponds « a ; b »/.exec(r))) { const Rr = roots((u) => [fxT(m[2])(u), 0]); if (!Rr || Rr.length !== 2) return null; const [[a1, b1, c1], [a2, b2, c2]] = lin(m[1], ["a", "b"], Rr), D = a1 * b2 - a2 * b1; return D ? { pair: [(c1 * b2 - c2 * b1) / D, (a1 * c2 - a2 * c1) / D] } : null; }
    return null;
  } });
  G.push({ name: "nombre dérivé", f(x) {
    if (!["nbderive", "tangente"].includes(x.id) || x.spec.kind !== "value") return null; const r = x.raw; let m;
    if (!(m = /\\\(([fs])'\((-?\d+)\)\\\)/.exec(r)) && !(m = /([fs])'\((-?\d+)\)/.exec(r))) return null; const D2 = fdefs(r)[m[1]]; if (!D2) return null;
    if (!/calcule|vitesse instantanée|Calcule|pente de la tangente/.test(r)) return null;
    const a = +m[2], h = 1e-3; return { v: (8 * (D2(a + h) - D2(a - h)) - (D2(a + 2 * h) - D2(a - 2 * h))) / (12 * h) };
  } });
  /* combi */
  const Cnk = (n, k) => (k < 0 || k > n ? 0 : Math.round(fact(n) / (fact(k) * fact(n - k)))), Ank = (n, k) => Math.round(fact(n) / fact(n - k));
  T("combi", /^(\d+) \S+ participent à une course \(sans ex æquo\)\. Combien d'ordres/i, (n) => fact(n));
  T("combi", /^(\d+) \S+ posent en ligne pour une photo/i, (n) => fact(n));
  T("combi", /choisit (\d+) \S+ parmi les (\d+) /i, (k, n) => Cnk(n, k));
  T("combi", /^(\d+) \S+ disputent une finale\. Combien de podiums/i, (n) => Ank(n, 3));
  T("combi", /tire simultanément (\d+) cartes d'un jeu de \S+ de (\d+) cartes/i, (k, n) => Cnk(n, k));
  T("combi", /on coche (\d+) numéros parmi (\d+)/i, (k, n) => Cnk(n, k));
  T("combi", /club de (\d+) membres élit un président, un vice-président et un caissier/i, (n) => Ank(n, 3));
  T("combi", /^(\d+) chevaux prennent le départ\. Un pari « tiercé dans l'ordre »/i, (n) => Ank(n, 3));
  T("combi", /avec toutes les lettres du mot ([A-ZÉÈ]+)/, (w) => { const c = {}; for (const ch of w) c[ch] = (c[ch] || 0) + 1; return Object.values(c).reduce((a, k) => a / fact(k), fact(w.length)); }, { raw: true });
  T("combi", /QCM a (\d+) questions, chacune avec (\d+) réponses possibles/i, (n, k) => k ** n);
  T("combi", /propose (\d+) garnitures\. Combien de pizzas différentes peut-on composer avec (\d+) garnitures différentes/i, (n, k) => Cnk(n, k));
  T("combi", /codes de (\d+) lettres \(de A à Z, répétitions permises\)/i, (k) => 26 ** k);
  T("combi", /^(\d+) personnes se saluent/i, (n) => Cnk(n, 2));
  T("combi", /cadenas a (\d+) roues de (\d+) symboles/i, (r, s) => s ** r);
  T("combi", /classe de (\d+) élèves choisit (\d+) délégués \(sans rôle/i, (n, k) => Cnk(n, k));
  T("combi", /compte (\d+) filles et (\d+) garçons\. On forme un comité de (\d+) élèves\. Combien de comités comptent exactement (\d+) filles/i, (f, g, n, k) => Cnk(f, k) * Cnk(g, n - k));
  T("combi", /On compte (\d+) poignées de main\. Combien y a-t-il d'invités/i, (P) => { for (let n = 2; n < 200; n++) if ((n * (n - 1)) / 2 === P) return n; return NaN; });
  T("combi", /^(\d+) amis, dont \S+ et \S+, s'assoient sur un banc de \d+ places\. [^?]*côte à côte/i, (n) => 2 * fact(n - 1));
  T("combi", /nombres de (\d+) chiffres \(le premier n'est pas 0\) ont tous leurs chiffres différents/i, (k) => 9 * Ank(9, k - 1));
  /* milieux (théorème des milieux) */
  T("milieux", Z`milieux des côtés \[\w+\] et \[\w+\] du triangle \w+, et \w+ = # cm\. Calcule`, (c) => c / 2);
  T("milieux", Z`est le milieu de \[\w+\] et \w+ celui de \[\w+\]\. On mesure \w+ = # cm\. Quelle est la longueur`, (c) => 2 * c);
  T("milieux", Z`milieux des côtés \[\w+\], \[\w+\] et \[\w+\] du triangle \w+, avec \w+ = # cm, \w+ = # cm et \w+ = # cm\. Quel est le périmètre`, (a, b, c) => (a + b + c) / 2);
  T("milieux", Z`La parallèle à \(\w+\) passant par \w+ coupe \[\w+\] en \w+\. On sait que \w+ = # cm\. Calcule`, (c) => c / 2);
  T("milieux", Z`parallèle à \(\w+\) coupe \[\w+\] en \w+\. Sachant que \w+ = # cm, calcule`, (c) => c / 2);
  T("milieux", Z`du quadrilatère \w+\. Ses diagonales mesurent \w+ = # cm et \w+ = # cm\. Quel est le périmètre`, (a, b) => a + b);
  /* suites arithmétiques et géométriques (formes directes) */
  T(null, Z`suite (arithmétique|géométrique)[^.]*? premier terme u_(\d+) = # et (?:pour|de) raison (?:[rq] = )?#\. Calcule u_(\d+)\b`, (t, i, a, q, n) => (/arith/i.test(t) ? num(a) + (num(n) - num(i)) * num(q) : num(a) * num(q) ** (num(n) - num(i))), { raw: true });
  T(null, Z`suite arithmétique vérifie u_(\d+) = # et u_(\d+) = #\. Quelle est sa raison`, (i, a, j, b) => (b - a) / (j - i));
  T(null, Z`suite arithmétique vérifie u_(\d+) = # et u_(\d+) = #\. Calcule u_0`, (i, a, j, b) => a - (i * (b - a)) / (j - i));
  T(null, Z`suite arithmétique \(u_n\) a pour premier terme u_0 = # et pour raison #\. Pour quel entier n a-t-on u_n = #`, (a, q, v) => (v - a) / q);

  /* ---------- application ---------- */
  function ruleFor(x, txt) {
    for (const r of RULES) {
      if (r.ids && !r.ids.has(x.id)) continue;
      if (r.o.not && r.o.not.test(x.raw)) continue; /* 26.11 : \overline disparaît du texte lisible */
      if (!r.f) continue;
      const m = r.re.exec(txt); if (!m) continue;
      const res = r.o.text ? r.f(txt, x) /* 26.11 soir (agent defis3) : l'item aussi, pour les défis lus sur une figure */ : r.o.raw ? r.f(...m.slice(1)) : r.f(...m.slice(1).map(num));
      if (res === null || res === undefined) continue;
      return [r.re.source.slice(0, 60), typeof res === "number" ? (r.o.exact ? { v: res, st: null } : { v: res }) : res];
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
      if ("err" in res) out.push({ rule: g.name, msg: res.err });
      else if ("v" in res) out.push({ rule: g.name, msg: cmpValue(x, sp, res, x.txt) });
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
        if (sp.kind === "ineq") { const v = sp.value, o = sp.op, w = (t) => (o === ">" ? t > v : o === "<" ? t < v : o === ">=" ? t >= v : t <= v), P = [-60, -7.3, -1.1, 0.4, 2.9, 13.7, 60, v - 1e-3, v + 1e-3, ...res.pts.flatMap((e) => [e - 1e-3, e + 1e-3])], bad = P.find((t) => res.ineq(t) !== w(t)) ?? (res.ineq(v, true) !== w(v) ? v : undefined);
          out.push({ rule: g.name, msg: bad === undefined ? null : "« x " + o + " " + fmt(v) + " » faux en x = " + fmt(bad) }); break; }
        const want = (t) => sp.ivs.some(([a, ai, b, bi]) => { a = a === null || !isFinite(a) ? -Infinity : a; b = b === null || !isFinite(b) ? Infinity : b; return (t > a || (ai && Math.abs(t - a) < 1e-9)) && (t < b || (bi && Math.abs(t - b) < 1e-9)); });
        const T0 = [], TB = []; for (let t = -60; t <= 60; t += 0.37) T0.push(t);
        for (const [a, , b] of sp.ivs) for (const e of [a, b]) if (e !== null && isFinite(e)) { TB.push(e); T0.push(e - 1e-3, e + 1e-3); }
        for (const e of res.pts) T0.push(e - 1e-3, e + 1e-3); /* racines approchées : seulement de part et d'autre */
        for (const e of res.exact || []) TB.push(e); /* domaine : pôles et bords exacts (26.11) */
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
      if (r && !("pair" in r[1])) out.push({ rule: r[0], msg: cmpValue(x, x.spec, r[1], x.txt) });
    }
    if (!out.length && x.spec && x.spec.kind === "pair") { /* problèmes à deux inconnues (26.11) */
      const r = ruleFor(x, x.txt);
      if (r && r[1].pair) out.push({ rule: r[0], msg: r[1].pair.length === x.spec.values.length && r[1].pair.every((v, i) => sameSet([x.spec.values[i]], [v])) ? null : "attendu (" + x.spec.values.map(fmt).join(" ; ") + "), recalcul (" + r[1].pair.map(fmt).join(" ; ") + ")" });
    }
    for (const p of x.parts || []) if (p.spec && p.spec.kind === "value") {
      const r = ruleFor(x, x.txt + " ¶ " + p.label);
      if (r && "v" in r[1]) out.push({ rule: r[0], msg: cmpValue(x, p.spec, r[1], p.label) });
    }
    /* 26.11 soir (agent defisch) : parties de défi à réponse en couple (coordonnées) */
    for (const p of x.parts || []) if (p.spec && p.spec.kind === "pair") {
      const r = ruleFor(x, x.txt + " ¶ " + p.label);
      if (r && r[1].pair) out.push({ rule: r[0], msg: r[1].pair.length === p.spec.values.length && r[1].pair.every((v, i) => sameSet([p.spec.values[i]], [v])) ? null : "attendu (" + p.spec.values.map(fmt).join(" ; ") + "), recalcul (" + r[1].pair.map(fmt).join(" ; ") + ")" });
    }
    return out;
  }
  return { check, truncSpec, tex2e, roots, rounding, solHas, RULES, fmt, saisie };
})();
