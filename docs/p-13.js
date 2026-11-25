// 2e du Collège de Genève (grade 13) · audit de niveau du 24.11 (agent niv2c ; étalons et tableau d'audit dans
// tools/niveau_2c.md, registre tools/niveau.json). Règle de l'enseignant : au Collège, une question en dessous du niveau
// de la classe décrédibilise l'app. Références : programme CdG 2021 (2e MA1/MA2), épreuves regroupées 2MA1 (déc. 2023)
// et 2MA2 (juin 2024) du Collège Sismondi, brochure 2MA (Vorpe), manuel Sésamath Ma2.
// Contenu :
//  1. nouvelle notion « ineqpoly » (inéquations polynomiales, tableau des signes ; Sésamath Ma2 Ch3, programme 2e :
//     « résoudre des inéquations à une inconnue (tableau des signes) », « étudier les fonctions polynomiales ») ;
//  2. niveaux remontés au niveau des épreuves de 2e pour des notions propres au Collège (cart, droites, polyexpr, modexp,
//     recip, compo, vecteurs) : les formes trop faciles (niveau CO ou 1re) passent au niveau inférieur ou disparaissent ;
//  3. formes de niveau 3 ajoutées (variantes, tirées avec les formes d'origine) pour des notions partagées avec d'autres
//     classes (trigeq : MP 2e ; absval : 1re et 2nde FR), sans retirer les formes existantes.
// Chargé après ch4c_ana.js (et donc après variantes.js et competences.js), avant riche.js et lessons.js.
(function () {
  if (typeof NOTIONS === "undefined" || typeof GEN === "undefined") return;
  // ---------- outils (mêmes conventions que ch3c_ana.js) ----------
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; };
  const r6 = (v) => +(+v).toFixed(9);
  const den = (v) => { for (let d = 1; d <= 400; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-7) return d; return 0; };
  const fT = (v) => { v = r6(v); const d = den(v); if (d === 1 || !d || d > 60) return nb(v); const n = Math.round(v * d); return (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
  const fS = (v) => { v = r6(v); const d = den(v); if (d === 1) return String(Math.round(v)); if (!d) return String(v); return Math.round(v * d) + "/" + d; };
  const sg = (v) => (v < 0 ? " - " + fT(-v) : " + " + fT(v));
  const P2 = (cs, x = "x") => poly(ptrim(cs), x);
  const tp = (cs, x = "x") => { cs = ptrim(cs); const d = cs.length - 1; let o = "";
    cs.forEach((c, i) => { const p = d - i; if (!c) return; const a = Math.abs(c), co = p === 0 ? fS(a) : a === 1 ? "" : Number.isInteger(r6(a)) ? fS(a) : "(" + fS(a) + ")";
      const t = co + (p === 0 ? "" : p === 1 ? x : x + "^" + p); o += o === "" ? (c < 0 ? "-" : "") + t : (c < 0 ? " - " : " + ") + t; });
    return o || "0"; };
  const pmul2 = (a, b) => { const r = Array(a.length + b.length - 1).fill(0); a.forEach((x, i) => b.forEach((y, j) => (r[i + j] += x * y))); return r; };
  const prod = (...ps) => ps.reduce((a, b) => pmul2(a, b), [1]);
  const pv = (cs, x) => cs.reduce((a, c) => a * x + c, 0);
  const fac = (r) => "(" + P2([1, -r]) + ")"; /* (x − r) en TeX */
  const pt = (n, x, y) => n + "(" + fT(x) + " \\,;\\, " + fT(y) + ")";
  const vcT = (x, y) => "\\begin{pmatrix} " + fT(x) + " \\\\ " + fT(y) + " \\end{pmatrix}";
  const keepT = (spec, traps) => { const seen = new Set(); return (traps || []).filter((tr) => {
    if (!tr) return false;
    if (tr.e) { try { const t = Expr.parse(tr.e); if (Expr.equivalent(t, Expr.parse(spec.expr))) return false; if (seen.has(tr.e)) return false; seen.add(tr.e); return true; } catch (e) { return false; } }
    if (tr.s) { if (spec.kind !== "set" || !tr.s.every(isFinite)) return false; const k = tr.s.map(fS).sort().join(";"); if (seen.has(k) || checkAnswer(spec, tr.s.map(fS).join(" ; ")).status === "correct") return false; seen.add(k); return true; }
    if (tr.spec) { const c = tr.spec.kind === "pair" ? tr.spec.values.map(fS).join(" ; ") : SolSet.show(tr.spec.ivs, false); if (seen.has(c) || checkAnswer(spec, c).status === "correct" || checkAnswer(tr.spec, c).status !== "correct") return false; seen.add(c); return true; }
    const tol = Math.max(spec.round || 0, 1e-9);
    if (!isFinite(tr.v) || Math.abs(tr.v - spec.value) <= tol || seen.has(r6(tr.v))) return false; seen.add(r6(tr.v)); return true; }); };
  const mk = (q, spec, sol, o) => { const x = { q, spec, sol, guide: o.guide, ctx: o.ctx, traps: keepT(spec, o.traps) }; if (o.fig) x.fig = o.fig; if (o.canon) x.canon = o.canon; return x; };
  const QN = (q, value, sol, o) => mk(q, { kind: "value", value }, sol, o);
  const QR = (q, value, round, sol, o) => mk(q, { kind: "value", value, round }, sol, o);
  const QX = (q, expr, sol, o) => mk(q, { kind: "expr", expr }, sol, Object.assign({ canon: expr }, o));
  const QSet = (q, vals, sol, o) => mk(q, { kind: "set", values: [...new Set(vals.map(r6))].sort((a, b) => a - b) }, sol, o);
  const QP = (q, vals, sol, o) => mk(q, { kind: "pair", values: vals }, sol, Object.assign({ canon: vals.map(fS).join(" ; ") }, o));
  const QS = (q, ivs, sol, o) => mk(q, solsetSpec(ivs), sol, Object.assign({ canon: SolSet.show(ivs, false) }, o));
  const GX = (ask, expr, sol) => ({ ask, spec: { kind: "expr", expr }, sol });
  const GSet = (ask, vals, sol) => ({ ask, spec: { kind: "set", values: [...new Set(vals.map(r6))].sort((a, b) => a - b) }, sol });
  const GP = (ask, vals, sol) => ({ ask, spec: { kind: "pair", values: vals }, sol });
  const GSS = (ask, ivs, sol) => ({ ask, spec: solsetSpec(ivs), sol });
  const TX = (e, m) => ({ e, m });
  const TSt = (s, m) => ({ s, m });
  const TP = (vals, m) => ({ spec: { kind: "pair", values: vals }, m });
  const TS = (ivs, m) => ({ spec: solsetSpec(ivs), m });
  const TR = TRAP;
  const dg = (v) => nb(r6(v)) + "°";
  const NEG = { "<": ">=", "<=": ">", ">": "<=", ">=": "<" };
  const ssT = (ivs) => SolSet.show(ivs, true);
  /* Remplace les niveaux d'une notion existante : lv[d] = liste de formes (ou fonction d → question) ; niveaux absents :
     générateur d'origine. Les variantes (VAR) des niveaux remplacés sont retirées (elles en faisaient partie). */
  const OLD = {};
  const remonte = (id, lv) => {
    const g0 = GEN[id]; if (!g0) return;
    const old = (typeof VAR !== "undefined" && VAR[id]) || {};
    OLD[id] = { g0, var: Object.assign({}, old) };
    if (typeof VAR !== "undefined") { VAR[id] = Object.assign({}, old); for (const d of Object.keys(lv)) delete VAR[id][d]; if (lv[3] && !lv[4]) delete VAR[id][4]; }
    /* Les formes « Trouve l'erreur » (ctx « erreur », tests/trouve_erreur.html) d'un niveau remplacé sont gardées à ce niveau. */
    for (const d of Object.keys(lv)) { const err = (old[d] || []).filter((f) => { try { const q = f(); return q && q.ctx === "erreur"; } catch (e) { return false; } });
      if (err.length && Array.isArray(lv[d])) lv[d] = lv[d].concat(err); }
    GEN[id] = (d) => { const L = lv[Math.min(d, 4)] || (d >= 4 && lv[3]); return L ? (typeof L === "function" ? L(d) : pickForm(L)) : g0(d); };
  };
  /* Une forme d'origine (générateur + ses variantes) d'un niveau donné, pour la garder à un niveau inférieur. */
  const ancien = (id, d) => () => { const o = OLD[id], vs = (o.var && o.var[d]) || [], k = Math.floor(R.rand() * (vs.length + 1)), q = k ? vs[k - 1]() : o.g0(d); if (q && !q.ctx) q.ctx = id + "-n" + d + "-" + k; return q; };

  // ======================= ineqpoly : inéquations polynomiales (tableau des signes) =======================
  const opT = (op) => OPT[op];
  const sgn = (f, zs, op) => signSet(f, zs, [], op);
  const facT = (r) => (r === 0 ? "x" : fac(r));
  const IP = {
    1: [
      /* produit de trois facteurs du 1er degré, zéros entiers distincts */
      () => { const rs = []; while (rs.length < 3) { const r = R.int(-6, 6); if (!rs.includes(r)) rs.push(r); } rs.sort((a, b) => a - b);
        const op = pk(["<", "<=", ">", ">="]), f = (x) => (x - rs[0]) * (x - rs[1]) * (x - rs[2]), ivs = sgn(f, rs, op), sh = rs.slice().sort(() => R.rand() - 0.5);
        return QS("Résous " + M(sh.map(facT).join("") + " " + opT(op) + " 0") + ". Donne l'ensemble des solutions (intervalles).", ivs,
          "Zéros : " + rs.map(fT).join(", ") + ". Tableau des signes : le produit est positif à droite de " + M(fT(rs[2])) + ", puis change de signe à chaque zéro simple. " + M("S = " + ssT(ivs)) + ".",
          { ctx: "produit-3", guide: [GSet("Zéros du membre de gauche ? (sépare par « ; »)", rs, rs.map(fT).join(" ; ") + "."), GSS("Ensemble des solutions (tableau des signes) ?", ivs, M(ssT(ivs)) + ".")],
            traps: [TS(sgn(f, rs, NEG[op]), "Tu as pris les intervalles du signe contraire : à droite du plus grand zéro, le produit est positif."),
              TS(sgn(f, rs, op.length === 2 ? op[0] : op + "="), op.length === 2 ? "Inégalité large : les zéros font partie des solutions." : "Inégalité stricte : les zéros ne sont pas solutions."),
              TS(sgn((x) => -f(x), rs, op), "Vérifie le signe : prends une valeur test dans chaque intervalle.")] }); },
      /* un facteur (k − x) : le signe s'inverse */
      () => { const k = R.int(-4, 6); let a = R.int(-6, 5), b = R.int(-6, 6); if (a === k || b === k || a === b) return null; if (a > b) [a, b] = [b, a];
        const op = pk(["<", "<=", ">", ">="]), f = (x) => (k - x) * (x - a) * (x - b), rs = [a, b, k].sort((u, v) => u - v), ivs = sgn(f, rs, op);
        return QS("Résous " + M("(" + (k ? fT(k) + " - x" : "-x") + ")" + facT(a) + facT(b) + " " + opT(op) + " 0") + ". Donne l'ensemble des solutions (intervalles).", ivs,
          "Attention au facteur " + M("(" + fT(k) + " - x)") + " : il est positif pour " + M("x < " + fT(k)) + ". " + M("S = " + ssT(ivs)) + ".",
          { ctx: "facteur-negatif", guide: [GSet("Zéros du membre de gauche ?", rs, rs.map(fT).join(" ; ") + "."), GSS("Ensemble des solutions ?", ivs, M(ssT(ivs)) + ".")],
            traps: [TS(sgn((x) => (x - k) * (x - a) * (x - b), rs, op), "Le facteur (" + k + " − x) est négatif à droite de " + k + " : le signe du produit est inversé."),
              TS(sgn(f, rs, NEG[op]), "Tu as pris les intervalles du signe contraire.")] }); },
      /* zéro double : pas de changement de signe */
      () => { const a = R.int(-5, 5); let b = R.int(-5, 5); if (a === b) return null;
        const op = pk(["<=", ">=", "<", ">"]), f = (x) => (x - a) ** 2 * (x - b), ivs = sgn(f, [a, b], op);
        return QS("Résous " + M(fac(a) + "^2" + facT(b) + " " + opT(op) + " 0") + ". Donne l'ensemble des solutions (intervalles ; un point isolé s'écrit par exemple « x = 2 »).", ivs,
          M(fac(a) + "^2 \\ge 0") + " ne change pas de signe en " + M(fT(a)) + " (zéro double) : seul " + M(facT(b)) + " décide du signe" + (op.length === 2 ? ", et " + M("x = " + fT(a)) + " annule le produit" : "") + ". " + M("S = " + ssT(ivs)) + ".",
          { ctx: "zero-double", guide: [GSet("Zéros du membre de gauche ?", [a, b], [a, b].sort((u, v) => u - v).map(fT).join(" ; ") + "."), GSS("Ensemble des solutions ?", ivs, M(ssT(ivs)) + ".")],
            traps: [TS(sgn((x) => (x - a) * (x - b), [a, b], op), "Le carré ne change pas de signe en " + a + " : ce n'est pas un zéro simple."),
              TS(sgn((x) => x - b, [b], op), op.length === 2 ? "Le zéro double " + a + " annule le produit : il fait partie des solutions." : "Inégalité stricte : " + a + " annule le produit, il n'est pas solution."),
              TS(sgn(f, [a, b], NEG[op]), "Tu as pris les intervalles du signe contraire.")] }); },
    ],
    2: [
      /* facteur x² + k toujours positif */
      () => { const k = R.int(1, 9); let a = R.int(-6, 6), b = R.int(-6, 6); if (a === b) return null; if (a > b) [a, b] = [b, a];
        const op = pk(["<", "<=", ">", ">="]), f = (x) => (x * x + k) * (x - a) * (x - b), ivs = sgn(f, [a, b], op);
        return QS("Résous " + M("(x^2 + " + k + ")" + facT(a) + facT(b) + " " + opT(op) + " 0") + ". Donne l'ensemble des solutions (intervalles).", ivs,
          M("x^2 + " + k + " > 0") + " pour tout " + M("x") + " (pas de zéro) : le signe est celui de " + M(facT(a) + facT(b)) + ". " + M("S = " + ssT(ivs)) + ".",
          { ctx: "trinome-positif", guide: [GN("Combien de zéros réels a le facteur " + M("x^2 + " + k) + " ?", 0, "Aucun : " + M("x^2 + " + k + " \\ge " + k) + "."), GSS("Ensemble des solutions ?", ivs, M(ssT(ivs)) + ".")],
            traps: [TS(sgn((x) => (x * x - k) * (x - a) * (x - b), [a, b, -Math.sqrt(k), Math.sqrt(k)].filter((v, i, t) => t.indexOf(v) === i), op), "x² + " + k + " ne s'annule jamais (il ne vaut pas (x − √" + k + ")(x + √" + k + "))."),
              TS(sgn(f, [a, b], NEG[op]), "Tu as pris les intervalles du signe contraire.")] }); },
      /* mise en évidence : a x³ − a m² x */
      () => { const m = R.int(2, 7), a = pk([1, 2, 3, -1, -2]), op = pk(["<", "<=", ">", ">="]), cs = [a, 0, -a * m * m, 0], f = (x) => pv(cs, x), rs = [-m, 0, m], ivs = sgn(f, rs, op);
        return QS("Résous " + M(P2(cs) + " " + opT(op) + " 0") + ". Donne l'ensemble des solutions (intervalles).", ivs,
          M(P2(cs) + " = " + (a === 1 ? "" : a === -1 ? "-" : a) + "x(x - " + m + ")(x + " + m + ")") + ". Zéros " + M("-" + m) + ", 0, " + M(m) + (a < 0 ? " ; le coefficient " + a + " inverse les signes" : "") + ". " + M("S = " + ssT(ivs)) + ".",
          { ctx: "mise-en-evidence", guide: [GX("Factorise " + M(P2(cs)) + " au maximum.", a + "*x*(x-" + m + ")*(x+" + m + ")", M((a === 1 ? "" : a === -1 ? "-" : a) + "x(x - " + m + ")(x + " + m + ")") + "."), GSet("Zéros ?", rs, "−" + m + " ; 0 ; " + m + "."), GSS("Ensemble des solutions ?", ivs, M(ssT(ivs)) + ".")],
            traps: [TS(sgn((x) => a * (x * x - m * m), [-m, m], op), "Tu as divisé par x : on ne divise pas une inéquation par une expression de signe inconnu."),
              TS(sgn((x) => -f(x), rs, op), a < 0 ? "Le coefficient " + a + " est négatif : il inverse tous les signes." : "Vérifie le signe : à droite de " + m + ", " + M(P2(cs)) + " est positif.")] }); },
      /* zéro demi-entier : (2x − p) */
      () => { const p = pk([1, 3, 5, -1, -3, -5, 7]), h = p / 2; let a = R.int(-5, 5), b = R.int(-5, 5); if (a === b || a === h || b === h) return null;
        const op = pk(["<", "<=", ">", ">="]), f = (x) => (2 * x - p) * (x - a) * (x - b), rs = [h, a, b].sort((u, v) => u - v), ivs = sgn(f, rs, op);
        return QS("Résous " + M("(" + P2([2, -p]) + ")" + facT(a) + facT(b) + " " + opT(op) + " 0") + ". Donne l'ensemble des solutions (intervalles ; fractions acceptées).", ivs,
          "Zéros : " + rs.map(fT).map(M).join(", ") + " (" + M(P2([2, -p]) + " = 0 \\iff x = " + fT(h)) + "). " + M("S = " + ssT(ivs)) + ".",
          { ctx: "demi-entier", guide: [GN("Zéro de " + M(P2([2, -p])) + " ?", h, M("x = " + fT(h)) + "."), GSS("Ensemble des solutions ?", ivs, M(ssT(ivs)) + ".")],
            traps: [TS(sgn((x) => (x - p) * (x - a) * (x - b), [p, a, b].filter((v, i, t) => t.indexOf(v) === i), op), "2x − " + p + " s'annule en " + fS(h) + ", pas en " + p + "."),
              TS(sgn(f, rs, NEG[op]), "Tu as pris les intervalles du signe contraire.")] }); },
    ],
    3: [
      /* degré 3 à factoriser : racine évidente */
      () => { const r1 = pk([1, -1, 2, -2]); let r2 = R.int(-6, 6), r3 = R.int(-6, 6); if (new Set([r1, r2, r3]).size < 3 || r2 === 0 || r3 === 0) return null;
        const cs = prod([1, -r1], [1, -r2], [1, -r3]), op = pk(["<", "<=", ">", ">="]), f = (x) => pv(cs, x), rs = [r1, r2, r3].sort((u, v) => u - v), ivs = sgn(f, rs, op), q = prod([1, -r2], [1, -r3]);
        return QS("Résous " + M(P2(cs) + " " + opT(op) + " 0") + ". (Cherche d'abord une racine évidente.)", ivs,
          M("P(" + r1 + ") = 0") + ", donc " + M(P2(cs) + " = " + fac(r1) + "(" + P2(q) + ") = " + fac(r1) + fac(r2) + fac(r3)) + ". " + M("S = " + ssT(ivs)) + ".",
          { ctx: "racine-evidente", guide: [GN("Une racine évidente parmi ±1, ±2 ?", r1, M("P(" + r1 + ") = 0") + "."), GX("Quotient de la division par " + M(fac(r1)) + " ?", tp(q), M(P2(q)) + "."), GSet("Toutes les racines ?", rs, rs.join(" ; ") + "."), GSS("Ensemble des solutions ?", ivs, M(ssT(ivs)) + ".")],
            traps: [TS(sgn(f, rs, NEG[op]), "Tu as pris les intervalles du signe contraire."), TS(sgn((x) => (x - r2) * (x - r3), [r2, r3].sort((u, v) => u - v), op), "N'oublie pas le facteur " + fac(r1).replace(/\\/g, "") + " dans le tableau des signes.")] }); },
      /* bicarrée */
      () => { const p = R.int(1, 3), q = p + R.int(1, 3), op = pk(["<", "<=", ">", ">="]), cs = [1, 0, -(p * p + q * q), 0, p * p * q * q], f = (x) => pv(cs, x), rs = [-q, -p, p, q], ivs = sgn(f, rs, op);
        return QS("Résous " + M(P2(cs) + " " + opT(op) + " 0") + ". Donne l'ensemble des solutions (intervalles).", ivs,
          "Avec " + M("X = x^2") + " : " + M("X^2 - " + (p * p + q * q) + "X + " + p * p * q * q + " = (X - " + p * p + ")(X - " + q * q + ")") + ", donc " + M(P2(cs) + " = (x - " + p + ")(x + " + p + ")(x - " + q + ")(x + " + q + ")") + ". " + M("S = " + ssT(ivs)) + ".",
          { ctx: "bicarree", guide: [GSet("Valeurs de " + M("X = x^2") + " qui annulent " + M("X^2 - " + (p * p + q * q) + "X + " + p * p * q * q) + " ?", [p * p, q * q], p * p + " ; " + q * q + "."), GSet("Zéros en " + M("x") + " ?", rs, rs.join(" ; ") + "."), GSS("Ensemble des solutions ?", ivs, M(ssT(ivs)) + ".")],
            traps: [TS(sgn((x) => (x - p * p) * (x - q * q), [p * p, q * q], op), "Ce sont les solutions en X = x² : reviens à x (x² = " + p * p + " donne x = ±" + p + ")."),
              TS(sgn(f, rs, NEG[op]), "Tu as pris les intervalles du signe contraire.")] }); },
      /* comparer x³ et k·x² : ne pas diviser par x² */
      () => { const k = nz(-6, 6), op = pk(["<", "<=", ">", ">="]), f = (x) => x * x * (x - k), rs = [0, k].sort((u, v) => u - v), ivs = sgn(f, rs, op);
        return QS("Résous " + M("x^3 " + opT(op) + " " + (k === 1 ? "" : k === -1 ? "-" : k) + "x^2") + ". Donne l'ensemble des solutions (intervalles ; un point isolé s'écrit « x = 0 »).", ivs,
          M("x^3 - " + (k < 0 ? "(" + k + ")" : k) + "x^2 = x^2(x " + (k < 0 ? "+ " + -k : "- " + k) + ")") + " ; " + M("x^2") + " ne change pas de signe (zéro double en 0). " + M("S = " + ssT(ivs)) + ".",
          { ctx: "comparer", guide: [GX("Factorise " + M("x^3 - " + (k < 0 ? "(" + k + ")" : k) + "x^2") + ".", "x^2*(x" + (k < 0 ? "+" + -k : "-" + k) + ")", M("x^2(x" + sg(-k) + ")") + "."), GSS("Ensemble des solutions ?", ivs, M(ssT(ivs)) + ".")],
            traps: [TS(sgn((x) => x - k, [k], op), "Tu as divisé par x² : c'est permis seulement si x ≠ 0, et x = 0 doit être examiné à part."),
              TS(sgn((x) => x * (x - k), rs, op), "Le facteur x² ne change pas de signe en 0 : ce n'est pas un zéro simple.")] }); },
    ],
  };
  const GN = (ask, value, sol) => ({ ask, spec: { kind: "value", value }, sol });

  // ======================= cart : distance, milieu… (2e : figures et parallélogrammes) =======================
  const ptR = () => [R.int(-6, 6), R.int(-6, 6)];
  const CART = {
    2: [
      () => { const A = ptR(), B = ptR(), C = ptR(); const D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]];
        if ((B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0]) === 0) return null;
        return QP("Soit " + M(pt("A", ...A)) + ", " + M(pt("B", ...B)) + " et " + M(pt("C", ...C)) + ". Donne les coordonnées du point " + M("D") + " tel que " + M("ABCD") + " soit un parallélogramme. Réponds « x ; y ».", D,
          M("ABCD") + " parallélogramme ⟺ " + M("\\vec{AD} = \\vec{BC}") + " : " + M("\\vec{BC} = " + vcT(C[0] - B[0], C[1] - B[1])) + ", donc " + M(pt("D", ...D)) + ".",
          { ctx: "parallelogramme", guide: [GP("Composantes de " + M("\\vec{BC}") + " ?", [C[0] - B[0], C[1] - B[1]], M(vcT(C[0] - B[0], C[1] - B[1])) + "."), GP("Coordonnées de " + M("D = A + \\vec{BC}") + " ?", D, M(pt("D", ...D)) + ".")],
            traps: [TP([B[0] + C[0] - A[0], B[1] + C[1] - A[1]], "C'est le point tel que ABDC est un parallélogramme : l'ordre des lettres compte (AD = BC)."), TP([A[0] + B[0] - C[0], A[1] + B[1] - C[1]], "Dans ABCD, [AC] et [BD] sont les diagonales : D = A + C − B."), TP([C[0] - B[0], C[1] - B[1]], "Ce sont les composantes de BC ; ajoute-les à A.")] }); },
      () => { const A = ptR(), B = ptR(); if (A[0] === B[0] && A[1] === B[1]) return null; const S = [2 * B[0] - A[0], 2 * B[1] - A[1]];
        return QP("Donne les coordonnées du symétrique " + M("A'") + " de " + M(pt("A", ...A)) + " par rapport à " + M(pt("B", ...B)) + ". Réponds « x ; y ».", S,
          M("B") + " est le milieu de " + M("[AA']") + " : " + M("A' = 2B - A") + ", donc " + M(pt("A'", ...S)) + ".",
          { ctx: "symetrique", guide: [GP("Composantes de " + M("\\vec{AB}") + " ?", [B[0] - A[0], B[1] - A[1]], M(vcT(B[0] - A[0], B[1] - A[1])) + "."), GP(M("A' = B + \\vec{AB}") + " ?", S, M(pt("A'", ...S)) + ".")],
            traps: [TP([(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], "C'est le milieu de [AB] ; ici B est le milieu de [AA']."), TP([B[0] - A[0], B[1] - A[1]], "Ce sont les composantes de AB ; ajoute-les à B.")] }); },
      () => { const A = ptR(), k = pk([3, 4]), j = R.int(1, k - 1), u = [nz(-3, 3) * k, nz(-3, 3) * k], B = [A[0] + u[0], A[1] + u[1]], P = [A[0] + u[0] * j / k, A[1] + u[1] * j / k];
        const fr = j + "/" + k, frT = "\\frac{" + j + "}{" + k + "}";
        return QP("Soit " + M(pt("A", ...A)) + " et " + M(pt("B", ...B)) + ". Donne les coordonnées du point " + M("P") + " de " + M("[AB]") + " tel que " + M("\\vec{AP} = " + frT + "\\,\\vec{AB}") + ". Réponds « x ; y ».", P,
          M("\\vec{AB} = " + vcT(...u)) + ", " + M(frT + "\\vec{AB} = " + vcT(u[0] * j / k, u[1] * j / k)) + ", donc " + M(pt("P", ...P)) + ".",
          { ctx: "partage", guide: [GP("Composantes de " + M("\\vec{AB}") + " ?", u, M(vcT(...u)) + "."), GP("Coordonnées de " + M("P = A + " + frT + "\\vec{AB}") + " ?", P, M(pt("P", ...P)) + ".")],
            traps: [TP([u[0] * j / k, u[1] * j / k], "Ce sont les composantes de AP : ajoute-les aux coordonnées de A."), TP([B[0] - u[0] * j / k, B[1] - u[1] * j / k], "On part de A (AP = " + fr + " AB), pas de B.")] }); },
    ],
    3: [
      () => { const A = ptR(), u = [nz(-6, 6), nz(-6, 6)], v = [nz(-6, 6), nz(-6, 6)], det = u[0] * v[1] - u[1] * v[0]; if (!det || Math.abs(det) < 6) return null;
        const B = [A[0] + u[0], A[1] + u[1]], C = [A[0] + v[0], A[1] + v[1]], ar = Math.abs(det) / 2;
        return QN("Calcule l'aire du triangle " + M("ABC") + " avec " + M(pt("A", ...A)) + ", " + M(pt("B", ...B)) + " et " + M(pt("C", ...C)) + ".", ar,
          M("\\vec{AB} = " + vcT(...u)) + ", " + M("\\vec{AC} = " + vcT(...v)) + " ; " + M("\\det(\\vec{AB}, \\vec{AC}) = " + fT(u[0]) + " \\cdot " + (v[1] < 0 ? "(" + v[1] + ")" : v[1]) + " - " + (u[1] < 0 ? "(" + u[1] + ")" : u[1]) + " \\cdot " + (v[0] < 0 ? "(" + v[0] + ")" : v[0]) + " = " + det) + ", aire " + M("= \\frac{|" + det + "|}{2} = " + fT(ar)) + ".",
          { ctx: "aire-determinant", guide: [GP("Composantes de " + M("\\vec{AB}") + " ?", u, M(vcT(...u)) + "."), GP("Composantes de " + M("\\vec{AC}") + " ?", v, M(vcT(...v)) + "."), GN(M("\\det(\\vec{AB}, \\vec{AC})") + " ?", det, M(det) + "."), GN("Aire ?", ar, M("\\frac{|" + det + "|}{2} = " + fT(ar)) + ".")],
            traps: [TR(Math.abs(det), "Le déterminant donne l'aire du parallélogramme : divise par 2."), TR(Math.abs(u[0] * v[1] + u[1] * v[0]) / 2, "Déterminant : x₁y₂ − y₁x₂ (une soustraction)."), TR(Math.abs(u[0] * v[0] + u[1] * v[1]) / 2, "C'est le produit scalaire : l'aire utilise le déterminant.")] }); },
      () => { const A = ptR(), B = ptR(); if (A[0] === B[0]) return null; const x = (B[0] ** 2 + B[1] ** 2 - A[0] ** 2 - A[1] ** 2) / (2 * (B[0] - A[0])); if (den(x) > 2 || A[1] === 0 && B[1] === 0) return null;
        return QN("Sur l'axe des abscisses, quel point " + M("P(x \\,;\\, 0)") + " est à égale distance de " + M(pt("A", ...A)) + " et de " + M(pt("B", ...B)) + " ? Donne " + M("x") + ".", x,
          M("PA^2 = PB^2") + " : " + M("(x" + sg(-A[0]) + ")^2 + " + A[1] ** 2 + " = (x" + sg(-B[0]) + ")^2 + " + B[1] ** 2) + ", les " + M("x^2") + " s'éliminent : " + M("x = " + fT(x)) + ".",
          { ctx: "equidistant", guide: [GN("Développe " + M("PA^2 = PB^2") + " : les termes en " + M("x^2") + " s'éliminent. Coefficient de " + M("x") + " dans " + M("PA^2 - PB^2") + " ?", 2 * (B[0] - A[0]), M("-2 \\cdot " + par(A[0]) + " + 2 \\cdot " + par(B[0]) + " = " + 2 * (B[0] - A[0])) + "."), GN(M("x") + " ?", x, M("x = " + fT(x)) + ".")],
            traps: [TR((A[0] + B[0]) / 2, "C'est l'abscisse du milieu de [AB] : il n'est pas sur l'axe des abscisses en général."), TR(-x, "Vérifie le signe en résolvant l'équation du 1er degré.")] }); },
      () => { const A = ptR(), p = pk([1, 2, -1, -2, 3]), q = nz(-5, 5), B = [A[0] + p, A[1] + q], c = R.int(-6, 6), t = c - A[1]; const s = -q * t / p; if (!Number.isInteger(s) || t === 0) return null; const k = A[0] + s, C = [k, c];
        return QN("Soit " + M(pt("A", ...A)) + ", " + M(pt("B", ...B)) + " et " + M("C(k \\,;\\, " + c + ")") + ". Pour quelle valeur de " + M("k") + " le triangle " + M("ABC") + " est-il rectangle en " + M("A") + " ?", k,
          "Rectangle en " + M("A") + " ⟺ " + M("\\vec{AB} \\cdot \\vec{AC} = 0") + " : " + M(fT(p) + "(k" + sg(-A[0]) + ")" + sg(q) + " \\cdot " + par(t) + " = 0") + ", donc " + M("k = " + k) + ".",
          { ctx: "angle-droit", guide: [GP("Composantes de " + M("\\vec{AB}") + " ?", [p, q], M(vcT(p, q)) + "."), GN(M("\\vec{AB} \\cdot \\vec{AC} = 0") + " : valeur de " + M("k") + " ?", k, M("k = " + k) + ".")],
            traps: [TR(A[0] - s, "Vérifie le signe : AB · AC = " + p + "(k − " + A[0] + ") + " + q + " · " + t + "."), TR(A[0] + p * t / q, "C'est la condition de colinéarité (déterminant nul) : pour un angle droit, le produit scalaire est nul.")] }); },
    ],
  };
  const par = (v) => (v < 0 ? "(" + fT(v) + ")" : fT(v));
  CART[1] = [ancien("cart", 1), ancien("cart", 2)];

  // ======================= droites : niveau 1 (automatismes de 2e) =======================
  const DR1 = [
    () => { const a = nz(-6, 6), b = nz(-5, 5), c = R.int(-9, 9); if (Math.abs(b) === 1) return null; const m = -a / b, h = -c / b;
      const eq = P2([a, 0]).replace(/x$/, "x") + (b < 0 ? " - " + (b === -1 ? "" : -b) : " + " + (b === 1 ? "" : b)) + "y" + (c ? sg(c) : "") + " = 0";
      return QX("Écris la droite " + M(eq) + " sous la forme " + M("y = mx + h") + ". (fractions acceptées) Écris « y = … ».", tp([m, h]), M("y = " + P2([m, h])) + " : on isole " + M("y") + ", puis on divise par " + M(b) + ".",
        { ctx: "cartesienne-reduite", guide: [GN("Pente " + M("m") + " ?", m, M("m = -\\frac{a}{b} = " + fT(m)) + "."), GX("Équation réduite ?", tp([m, h]), M("y = " + P2([m, h])) + ".")],
          traps: [TX(tp([a / b, h]), "En isolant y, ax passe de l'autre côté : la pente est −a/b."), TX(tp([-a, -c]), "Divise aussi par le coefficient de y (" + b + ")."), TX(tp([m, -h]), "Vérifie le signe de l'ordonnée à l'origine : −c/b.")] }); },
    () => { const a = nz(-6, 6), b = nz(-6, 6), c = R.int(-9, 9); if (Math.abs(a) === Math.abs(b)) return null; const m = -a / b, mp = b / a;
      return QN("Quelle est la pente d'une droite perpendiculaire à la droite " + M(P2([a, 0]) + (b < 0 ? " - " + (b === -1 ? "" : -b) : " + " + (b === 1 ? "" : b)) + "y = " + c) + " ? (fraction acceptée)", mp,
        "Pente de la droite : " + M(fT(m)) + " ; perpendiculaire : " + M("m' = -\\frac{1}{m} = " + fT(mp)) + " (produit des pentes " + M("= -1") + ").",
        { ctx: "pente-perp", guide: [GN("Pente de la droite donnée ?", m, M(fT(m)) + "."), GN("Pente perpendiculaire " + M("-\\frac{1}{m}") + " ?", mp, M(fT(mp)) + ".")],
          traps: [TR(m, "C'est la pente de la droite donnée (parallèle)."), TR(-m, "Perpendiculaire : on prend l'inverse et on change le signe."), TR(1 / m, "N'oublie pas de changer le signe : m · m' = −1.")] }); },
    () => { const p = pk([1, 2, -2, 3, 4]), q = nz(-6, 6), x0 = R.int(-5, 5), y0 = R.int(-6, 6), m = q / p, h = y0 - m * x0; if (den(m) > 4 || q % p === 0 && Math.abs(q / p) === 1 && R.rand() < 0.5) return null;
      return QX("Donne l'équation de la droite qui passe par " + M(pt("P", x0, y0)) + " et de vecteur directeur " + M("\\vec{d} = " + vcT(p, q)) + ". Écris « y = … » (fractions acceptées).", tp([m, h]),
        "Pente " + M("m = \\frac{" + q + "}{" + p + "} = " + fT(m)) + " ; " + M("y = " + fT(m) + "(x" + sg(-x0) + ")" + sg(y0) + " = " + P2([m, h])) + ".",
        { ctx: "vecteur-directeur", guide: [GN("Pente " + M("m = \\frac{d_2}{d_1}") + " ?", m, M(fT(m)) + "."), GX("Équation ?", tp([m, h]), M("y = " + P2([m, h])) + ".")],
          traps: [TX(tp([p / q, y0 - p / q * x0]), "La pente est d₂/d₁ (vertical sur horizontal)."), TX(tp([m, y0]), "L'ordonnée à l'origine n'est pas y₀ : h = y₀ − m·x₀.")] }); },
  ];

  // ======================= polyexpr : niveau 3 (conditions sur le polynôme, forme développée) =======================
  const PE3 = [
    () => { let r1 = R.int(-4, 4), r2 = R.int(-4, 4); if (r1 === r2) return null; const x0 = pk([-2, -1, 1, 2, 3].filter((v) => v !== r1 && v !== r2)), a = pk([1, -1, 2, -2, 3]);
      const v = a * (x0 - r1) * (x0 - r2) * (x0 * x0 + 1), cs = prod([a], [1, -r1], [1, -r2], [1, 0, 1]);
      return QX("Détermine le polynôme " + M("P(x)") + " de degré 4 tel que : " + M(fT(r1)) + " et " + M(fT(r2)) + " sont des racines de " + M("P") + ", " + M("P(x)") + " est divisible par " + M("x^2 + 1") + ", et " + M("P(" + x0 + ") = " + v) + ". Donne " + M("P(x)") + " sous forme développée.", tp(cs),
        M("P(x) = a" + fac(r1) + fac(r2) + "(x^2 + 1)") + " ; " + M("P(" + x0 + ") = a \\cdot " + (x0 - r1) * (x0 - r2) * (x0 * x0 + 1) + " = " + v) + " donne " + M("a = " + a) + ", d'où " + M("P(x) = " + P2(cs)) + ".",
        { ctx: "deg4-conditions", guide: [GN("On écrit " + M("P(x) = a" + fac(r1) + fac(r2) + "(x^2 + 1)") + ". Que vaut " + M("a") + " ?", a, M("a = \\frac{" + v + "}{" + (x0 - r1) * (x0 - r2) * (x0 * x0 + 1) + "} = " + a) + "."), GX("Forme développée de " + M("P(x)") + " ?", tp(cs), M(P2(cs)) + ".")],
          traps: [TX(tp(prod([1, -r1], [1, -r2], [1, 0, 1])), "Utilise la condition P(" + x0 + ") = " + v + " pour trouver le coefficient a."), TX(tp(prod([a], [1, r1], [1, r2], [1, 0, 1])), "Une racine r donne le facteur (x − r), pas (x + r).")] }); },
    () => { const r = R.int(-3, 3); let s = R.int(-4, 4); if (s === r) return null; const x0 = pk([-2, -1, 1, 2, 3, 4].filter((v) => v !== r && v !== s)), a = pk([1, -1, 2, -2, 3, 0.5, -0.5]);
      const v = a * (x0 - r) ** 2 * (x0 - s); if (!Number.isInteger(v)) return null; const cs = prod([a], [1, -r], [1, -r], [1, -s]);
      return QX("Une fonction polynomiale " + M("f") + " de degré 3 a un zéro double en " + M(fT(r)) + ", un zéro simple en " + M(fT(s)) + ", et son graphe passe par " + M(pt("", x0, v)) + ". Donne " + M("f(x)") + " sous forme développée.", tp(cs),
        M("f(x) = a" + fac(r) + "^2" + fac(s)) + " ; " + M("f(" + x0 + ") = a \\cdot " + (x0 - r) ** 2 * (x0 - s) + " = " + v) + " donne " + M("a = " + fT(a)) + ", d'où " + M("f(x) = " + P2(cs)) + ".",
        { ctx: "zero-double-point", guide: [GN("On écrit " + M("f(x) = a" + fac(r) + "^2" + fac(s)) + ". Que vaut " + M("a") + " ?", a, M("a = " + fT(a)) + "."), GX("Forme développée ?", tp(cs), M(P2(cs)) + ".")],
          traps: [TX(tp(prod([a], [1, -r], [1, -s])), "Zéro double : le facteur (x − " + r + ") apparaît au carré (degré 3)."), TX(tp(prod([1, -r], [1, -r], [1, -s])), "Utilise le point du graphe pour trouver a.")] }); },
    () => { const rs = []; while (rs.length < 3) { const r = R.int(-4, 4); if (!rs.includes(r)) rs.push(r); } const x0 = pk([-3, -2, -1, 1, 2, 3, 5].filter((v) => !rs.includes(v))), a = pk([1, -1, 2, -2, 0.5, -0.5]);
      const k = (x0 - rs[0]) * (x0 - rs[1]) * (x0 - rs[2]), v = a * k; if (!Number.isInteger(v)) return null; const cs = prod([a], [1, -rs[0]], [1, -rs[1]], [1, -rs[2]]);
      return QX("Une fonction polynomiale " + M("f") + " de degré 3 s'annule en " + rs.map(fT).map(M).join(", ") + " et vérifie " + M("f(" + x0 + ") = " + v) + ". Donne " + M("f(x)") + " sous forme développée.", tp(cs),
        M("f(x) = a" + rs.map(fac).join("")) + " ; " + M("f(" + x0 + ") = " + k + "a = " + v) + ", " + M("a = " + fT(a)) + " ; " + M("f(x) = " + P2(cs)) + ".",
        { ctx: "trois-zeros-point", guide: [GN("Que vaut " + M("a") + " dans " + M("f(x) = a" + rs.map(fac).join("")) + " ?", a, M("a = \\frac{" + v + "}{" + k + "} = " + fT(a)) + "."), GX("Forme développée ?", tp(cs), M(P2(cs)) + ".")],
          traps: [TX(tp(prod([1, -rs[0]], [1, -rs[1]], [1, -rs[2]])), "Il manque le coefficient a, donné par f(" + x0 + ") = " + v + "."), TX(tp(prod([a], [1, rs[0]], [1, rs[1]], [1, rs[2]])), "Un zéro r donne le facteur (x − r).")] }); },
  ];

  // ======================= modexp : croissance exponentielle (étalon : épreuve 2MA2, question 4) =======================
  const pct = (t) => nb(r6(t * 100)) + "\\,\\%";
  const MX2 = [
    () => { const C = pk([2500, 4000, 6000, 8500, 12000]), t = pk([0.0125, 0.015, 0.0175, 0.022, 0.024, 0.028]), n = R.int(6, 15), v = C * (1 + t) ** n;
      return QR("Un capital de " + M(nb(C)) + " CHF est placé à " + M(pct(t)) + " d'intérêt composé par an. Que vaut-il après " + n + " ans (au centime) ?", v, 0.01,
        M("C_n = C_0 \\cdot (1 + t)^n = " + nb(C) + " \\cdot " + nb(1 + t) + "^{" + n + "} \\approx " + nb(+v.toFixed(2))) + " CHF.",
        { ctx: "capital", guide: [GN("Facteur multiplicatif annuel " + M("1 + t") + " ?", r6(1 + t), M(nb(r6(1 + t)))), GS("Valeur après " + n + " ans ?", v, M("\\approx " + nb(+v.toFixed(2))), 0.01)],
          traps: [TR(+(C * (1 + n * t)).toFixed(2), "Intérêts composés : on multiplie par (1 + t) chaque année, on n'ajoute pas n fois le même intérêt."), TR(+(C * (1 + t * 100) ** n).toFixed(2), "Le taux " + nb(t * 100) + " % s'écrit " + nb(t) + " : facteur " + nb(1 + t) + ".")] }); },
    () => { const N0 = R.int(120, 480) * 100, t = pk([0.012, 0.016, 0.018, 0.021, 0.025]), n = R.int(5, 12), y = R.int(2015, 2022), N = Math.round(N0 * (1 + t) ** n);
      const v = N / (1 + t) ** n;
      return QR("En " + (y + n) + ", une commune compte " + M(nb(N)) + " habitants, après " + n + " années de croissance de " + M(pct(t)) + " par an. Combien en comptait-elle en " + y + " (à l'unité) ?", v, 1,
        M("N_0 = \\frac{" + nb(N) + "}{" + nb(1 + t) + "^{" + n + "}} \\approx " + nb(Math.round(v))) + " habitants.",
        { ctx: "remonter-le-temps", guide: [GN("Facteur sur " + n + " ans " + M("(1 + t)^{" + n + "}") + " (au millième) ?", +((1 + t) ** n).toFixed(3), M("\\approx " + nb(+((1 + t) ** n).toFixed(3)))), GS("Population en " + y + " ?", v, M("\\approx " + nb(Math.round(v))), 1)],
          traps: [TR(Math.round(N * (1 - t) ** n), "Revenir en arrière : on divise par (1 + t)ⁿ, on ne multiplie pas par (1 − t)ⁿ."), TR(Math.round(N * (1 - n * t)), "Le taux s'applique chaque année sur la nouvelle valeur.")] }); },
    () => { const t = pk([0.025, 0.035, 0.04, 0.045, 0.06]), n = pk([8, 10, 12, 15]), g = ((1 + t) ** n - 1) * 100;
      return QR("Une population augmente de " + M(pct(t)) + " par an. De quel pourcentage a-t-elle augmenté au total en " + n + " ans (au dixième de %) ?", g, 0.1,
        M(nb(1 + t) + "^{" + n + "} \\approx " + nb(+((1 + t) ** n).toFixed(4))) + " : augmentation de " + M(nb(+g.toFixed(1)) + "\\,\\%") + ".",
        { ctx: "taux-global", guide: [GN("Facteur sur " + n + " ans (au millième) ?", +((1 + t) ** n).toFixed(3), M("\\approx " + nb(+((1 + t) ** n).toFixed(3)))), GS("Augmentation totale (en %) ?", g, M("\\approx " + nb(+g.toFixed(1)) + "\\,\\%"), 0.1)],
          traps: [TR(n * t * 100, "Les pourcentages ne s'additionnent pas : ils se composent (facteur (1 + t)ⁿ)."), TR((1 + t) ** n * 100, "C'est le facteur en % ; l'augmentation vaut (facteur − 1) · 100.")] }); },
  ];
  const MX3 = [
    () => { const A = pk([10, 12, 25, 40, 80]), k = pk([3, 4, 5, 6, 8]), n = R.int(15, 60), B = A * k, t = (k ** (1 / n) - 1) * 100;
      return QR("Une grandeur passe de " + M(nb(A)) + " à " + M(nb(B)) + " en " + n + " ans, avec un taux annuel constant. Quel est ce taux (en %, au centième) ?", t, 0.01,
        M("(1 + t)^{" + n + "} = \\frac{" + nb(B) + "}{" + nb(A) + "} = " + k) + ", donc " + M("1 + t = " + k + "^{\\frac{1}{" + n + "}} \\approx " + nb(+(k ** (1 / n)).toFixed(5))) + " : " + M("t \\approx " + nb(+t.toFixed(2)) + "\\,\\%") + ".",
        { ctx: "taux-cible", guide: [GN("Facteur total " + M("(1 + t)^{" + n + "}") + " ?", k, M(k) + "."), GS(M("1 + t") + " (au cent-millième) ?", k ** (1 / n), M(k + "^{\\frac{1}{" + n + "}} \\approx " + nb(+(k ** (1 / n)).toFixed(5))), 0.00001), GS("Taux en % ?", t, M("\\approx " + nb(+t.toFixed(2))), 0.01)],
          traps: [TR((k - 1) / n * 100, "La croissance n'est pas linéaire : (1 + t)ⁿ = " + k + ", on prend la racine n-ième."), TR(k / n * 100, "Il faut résoudre (1 + t)ⁿ = " + k + ".")] }); },
    () => { const t = pk([0.03, 0.04, 0.05, 0.06, 0.08, 0.1]), m = ((1 + t) ** (1 / 12) - 1) * 100;
      return QR("Un placement rapporte " + M(pct(t)) + " par an (intérêts composés). Quel taux mensuel constant donne le même résultat sur une année (en %, au millième) ?", m, 0.001,
        M("(1 + t_m)^{12} = " + nb(1 + t)) + ", " + M("t_m = " + nb(1 + t) + "^{\\frac{1}{12}} - 1 \\approx " + nb(+m.toFixed(3)) + "\\,\\%") + ".",
        { ctx: "taux-mensuel", guide: [GS(M("1 + t_m = " + nb(1 + t) + "^{\\frac{1}{12}}") + " (au cent-millième) ?", (1 + t) ** (1 / 12), M("\\approx " + nb(+((1 + t) ** (1 / 12)).toFixed(5))), 0.00001), GS("Taux mensuel en % ?", m, M("\\approx " + nb(+m.toFixed(3))), 0.001)],
          traps: [TR(t * 100 / 12, "Diviser le taux annuel par 12 donne un peu trop : les intérêts mensuels se composent."), TR(((1 + t) ** 12 - 1) * 100, "Sur un mois, on prend la racine 12e, pas la puissance 12.")] }); },
    () => { const A = pk([10, 50, 120, 800]), t = pk([0.035, 0.042, 0.056, 0.064, 0.072]), k = pk([5, 8, 12, 20, 30]), S = A * k, x = Math.log(k) / Math.log(1 + t), n = Math.ceil(x); if (n - x < 0.05 || n - x > 0.95) return null;
      return QN("Une consommation vaut " + M(nb(A)) + " unités et augmente de " + M(pct(t)) + " par an. Au bout de combien d'années complètes dépassera-t-elle " + M(nb(S)) + " unités ?", n,
        M(nb(A) + " \\cdot " + nb(1 + t) + "^n > " + nb(S) + " \\iff " + nb(1 + t) + "^n > " + k) + " ; " + M("n > \\frac{\\log " + k + "}{\\log " + nb(1 + t) + "} \\approx " + nb(+x.toFixed(2))) + " : " + n + " ans.",
        { ctx: "seuil", guide: [GN("Rapport " + M("\\frac{" + nb(S) + "}{" + nb(A) + "}") + " ?", k, M(k) + "."), GS("Solution de " + M(nb(1 + t) + "^n = " + k) + " (au centième) ?", x, M("\\approx " + nb(+x.toFixed(2))), 0.01), GN("Nombre d'années complètes ?", n, n + " ans.")],
          traps: [TR(n - 1, "Après " + (n - 1) + " ans, le seuil n'est pas encore dépassé : arrondis vers le haut."), TR(Math.ceil((k - 1) / t), "La croissance est exponentielle, pas linéaire.")] }); },
  ];

  // ======================= recip : niveau 3 (bijection restreinte, racine, cube) =======================
  const RC3 = [
    () => { const h = nz(-5, 5), k = R.int(-6, 6), m = R.int(2, 6), v = k + m * m; if (Math.abs(h + m) <= 1) return null; /* 25.11 (robot) : réponse 0 ou ±1 écartée */
      return QN("La fonction " + M("f(x) = " + fac(h) + "^2" + (k ? sg(k) : "")) + " est une bijection de " + M("[" + h + " \\,;\\, +\\infty[") + " vers " + M("[" + k + " \\,;\\, +\\infty[") + ". Calcule " + M("f^{-1}(" + v + ")") + ".", h + m,
        M("f(x) = " + v + " \\iff " + fac(h) + "^2 = " + m * m + " \\iff x = " + h + " \\pm " + m) + " ; seule " + M("x = " + (h + m)) + " est dans " + M("[" + h + " \\,;\\, +\\infty[") + ".",
        { ctx: "parabole-restreinte", guide: [GSet("Solutions de " + M("f(x) = " + v) + " sur " + M("\\mathbb{R}") + " ?", [h - m, h + m], (h - m) + " ; " + (h + m) + "."), GN("Laquelle est dans l'ensemble de départ ?", h + m, M(h + m) + ".")],
          traps: [TR(h - m, "Cette solution n'est pas dans [" + h + " ; +∞[ : la réciproque prend ses valeurs dans l'ensemble de départ."), TR((h + v) ** 2 + k, "C'est f(" + v + ") ; on demande f⁻¹(" + v + ").")] }); },
    () => { const b = R.int(-3, 4), c = R.int(-4, 5), top = b * b + c, m = R.int(2, 5), v = top - m * m; if (Math.abs(b + m) <= 1) return null; /* 25.11 (robot) : réponse 0 ou ±1 écartée (recip-4-aab) */
      return QN("Soit " + M("f(x) = " + P2([-1, 2 * b, c])) + ". On la restreint à " + M("A = [" + b + " \\,;\\, +\\infty[") + " ; elle est alors une bijection de " + M("A") + " vers " + M("]-\\infty \\,;\\, " + top + "]") + ". Calcule " + M("f^{-1}(" + v + ")") + ".", b + m,
        M("f(x) = -(x" + sg(-b) + ")^2 + " + top) + " ; " + M("f(x) = " + v + " \\iff (x" + sg(-b) + ")^2 = " + m * m) + ", et " + M("x \\ge " + b) + " donne " + M("x = " + (b + m)) + ".",
        { ctx: "sommet-restreint", guide: [GN("Ordonnée du sommet (maximum de " + M("f") + ") ?", top, M(top) + "."), GN(M("(x" + sg(-b) + ")^2") + " vaut ?", m * m, M(top + " - (" + v + ") = " + m * m) + "."), GN(M("f^{-1}(" + v + ")") + " ?", b + m, M(b + m) + ".")],
          traps: [TR(b - m, "Cette solution est hors de A = [" + b + " ; +∞[."), TR(-(v * v) + 2 * b * v + c, "C'est f(" + v + ") ; on demande f⁻¹(" + v + ").")] }); },
    () => { const a = pk([2, 3, 4, -2]), bb = R.int(-6, 6), c = nz(-4, 4);
      const ex = "((x" + (c < 0 ? "+" + -c : "-" + c) + ")^2" + (bb ? (bb < 0 ? "+" + -bb : "-" + bb) : "") + ")/(" + a + ")";
      return QX("Soit " + M("f(x) = \\sqrt{" + P2([a, bb]) + "}" + sg(c)) + ", bijection de son domaine vers " + M("[" + c + " \\,;\\, +\\infty[") + ". Donne l'expression de " + M("f^{-1}(x)") + ".", ex,
        M("y = \\sqrt{" + P2([a, bb]) + "}" + sg(c) + " \\iff (y" + sg(-c) + ")^2 = " + P2([a, bb])) + ", donc " + M("f^{-1}(x) = \\frac{(x" + sg(-c) + ")^2" + sg(-bb).replace(" + 0", "") + "}{" + a + "}") + " (pour " + M("x \\ge " + c) + ").",
        { ctx: "racine", guide: [GN("Pour commencer : " + M("f^{-1}(" + c + ")") + ", c'est-à-dire le " + M("x") + " tel que " + M("\\sqrt{" + P2([a, bb]) + "} = 0") + " ? (fraction acceptée)", -bb / a, M(fT(-bb / a)) + "."), GX(M("f^{-1}(x)") + " ?", ex, M("\\frac{(x" + sg(-c) + ")^2" + sg(-bb).replace(" + 0", "") + "}{" + a + "}") + ".")],
          traps: [TX("((x" + (c < 0 ? "-" + -c : "+" + c) + ")^2" + (bb ? (bb < 0 ? "+" + -bb : "-" + bb) : "") + ")/(" + a + ")", "Isole d'abord la racine : on retire " + c + " (signe)."), TX("(x" + (c < 0 ? "+" + -c : "-" + c) + ")^2" + (bb ? (bb < 0 ? "+" + -bb : "-" + bb) : "") , "Divise aussi par " + a + ".")] }); },
    () => { const a = pk([2, 3, -2, 4]), b = R.int(-9, 9), m = pk([-4, -3, -2, 2, 3, 4]), v = a * m ** 3 + b; /* 25.11 (robot) : réponse jamais ±1 */
      return QN("Soit " + M("f(x) = " + P2([a, 0, 0, b])) + " (bijection de " + M("\\mathbb{R}") + " vers " + M("\\mathbb{R}") + "). Calcule " + M("f^{-1}(" + v + ")") + ".", m,
        M(P2([a, 0, 0, b]) + " = " + v + " \\iff x^3 = \\frac{" + (v - b) + "}{" + a + "} = " + m ** 3 + " \\iff x = " + m) + ".",
        { ctx: "cube", guide: [GN("Valeur de " + M("x^3") + " ?", m ** 3, M(m ** 3) + "."), GN(M("f^{-1}(" + v + ")") + " ?", m, M("\\sqrt[3]{" + m ** 3 + "} = " + m) + ".")],
          traps: [TR(a * v ** 3 + b, "C'est f(" + v + ") ; on cherche x tel que f(x) = " + v + "."), TR(Math.cbrt(v / a), "Retire d'abord " + b + ", puis divise par " + a + ".")] }); },
  ];

  // ======================= compo : niveau 3 (homographiques et domaines ; étalon 2MA2 Q1) =======================
  const CP3 = [
    () => { const a = nz(-4, 5), b = nz(-6, 6), c = nz(-5, 5), p = nz(-3, 3), q = R.int(-6, 6); if (a * c === b) return null;
      const N = [a * p, a * q + b], D = [p, q + c]; if (N[0] * D[1] === N[1] * D[0]) return null; const ex = "(" + tp(N) + ")/(" + tp(D) + ")", xv = -(q + c) / p;
      return QX("Soit " + M("f(x) = \\frac{" + P2([a, b]) + "}{x" + sg(c) + "}") + " et " + M("g(x) = " + P2([p, q])) + ". Donne " + M("(f \\circ g)(x)") + " sous la forme d'une seule fraction.", ex,
        M("(f \\circ g)(x) = \\frac{" + a + "(" + P2([p, q]) + ")" + sg(b) + "}{" + P2([p, q]) + sg(c) + "} = \\frac{" + P2(N) + "}{" + P2(D) + "}") + ", pour " + M("x \\neq " + fT(xv)) + ".",
        { ctx: "homographique-affine", guide: [GX("Numérateur : " + M(a + "\\,g(x)" + sg(b)) + " ?", tp(N), M(P2(N)) + "."), GX("Dénominateur : " + M("g(x)" + sg(c)) + " ?", tp(D), M(P2(D)) + "."), GX(M("(f \\circ g)(x)") + " ?", ex, M("\\frac{" + P2(N) + "}{" + P2(D) + "}") + ".")],
          traps: [TX(tp(prod([p, q], [a, b])) + "", "On remplace x par g(x) dans f : on ne multiplie pas f par g."), TX("(" + p + "*(" + tp([a, b]) + "))/(x" + (c < 0 ? "-" + -c : "+" + c) + ")" + (q < 0 ? "-" + -q : "+" + q), "C'est g(f(x)) : pour f ∘ g, on applique g d'abord, puis f.")] }); },
    () => { const a = nz(-3, 5), b = nz(-6, 6), c = nz(-4, 4), al = nz(-4, 4), be = nz(-6, 6), ga = nz(-4, 4);
      if (a * c === b || al * ga === be || a + ga === 0 || c === ga) return null; const x2 = -(b + ga * c) / (a + ga); if (r6(x2) === -c || r6(x2) === -ga || !den(x2) || den(x2) > 6) return null;
      const vals = [-c, x2];
      return QSet("Soit " + M("f(x) = \\frac{" + P2([a, b]) + "}{x" + sg(c) + "}") + " et " + M("h(x) = \\frac{" + P2([al, be]) + "}{x" + sg(ga) + "}") + ". Quelles valeurs faut-il exclure du domaine de " + M("h \\circ f") + " ? Sépare-les par « ; » (fractions acceptées).", vals,
        M("f") + " n'est pas définie en " + M(fT(-c)) + " ; " + M("h(f(x))") + " ne l'est pas quand " + M("f(x) = " + fT(-ga)) + " : " + M(P2([a, b]) + " = " + fT(-ga) + "(x" + sg(c) + ") \\iff x = " + fT(x2)) + ".",
        { ctx: "domaine-composee", guide: [GN("Valeur interdite de " + M("f") + " ?", -c, M(fT(-c)) + "."), GN("Pour quel " + M("x") + " a-t-on " + M("f(x) = " + fT(-ga)) + " (valeur interdite de " + M("h") + ") ?", x2, M(fT(x2)) + "."), GSet("Valeurs exclues ?", vals, vals.map((v) => M(fT(v))).join(" ; ") + ".")],
          traps: [TSt([-c, -ga], "La valeur interdite de h concerne f(x), pas x : il faut résoudre f(x) = " + (-ga) + "."), TSt([-c], "Il faut aussi exclure les x pour lesquels f(x) est la valeur interdite de h."), TSt([-ga], "N'oublie pas la valeur interdite de f elle-même.")] }); },
    () => { const m = R.int(2, 7), op = pk(["fg", "gf"]); const ivs = op === "fg" ? [[-Infinity, false, -m, true], [m, true, Infinity, false]] : [[0, true, Infinity, false]];
      return QS("Soit " + M("f(x) = \\sqrt{x}") + " et " + M("g(x) = x^2 - " + m * m) + ". Donne le domaine de définition de " + M(op === "fg" ? "f \\circ g" : "g \\circ f") + " (intervalles).", ivs,
        op === "fg" ? M("(f \\circ g)(x) = \\sqrt{x^2 - " + m * m + "}") + " existe si " + M("x^2 \\ge " + m * m) + ", soit " + M("x \\le -" + m) + " ou " + M("x \\ge " + m) + "." : M("(g \\circ f)(x) = (\\sqrt{x})^2 - " + m * m) + " exige d'abord " + M("x \\ge 0") + " (domaine de " + M("f") + ") : " + M("D = [0 \\,;\\, +\\infty[") + ".",
        { ctx: "domaine-racine", guide: [op === "fg" ? GSet("Zéros de " + M("x^2 - " + m * m) + " ?", [-m, m], M("-" + m) + " ; " + M(m) + ".") : GN("On applique d'abord " + M("f(x) = \\sqrt{x}") + " : plus petite valeur de " + M("x") + " permise ?", 0, M("x \\ge 0") + "."), GSS("Domaine ?", ivs, M(ssT(ivs)) + ".")],
          traps: op === "fg" ? [TS([[m, true, Infinity, false]], "x ≤ −" + m + " convient aussi : x² ≥ " + m * m + "."), TS([[-m, true, m, true]], "La racine exige x² − " + m * m + " ≥ 0 : à l'extérieur de [−" + m + " ; " + m + "]."), TS([[0, true, Infinity, false]], "C'est le domaine de g ∘ f.")]
            : [TS([[-Infinity, false, Infinity, false]], "g ∘ f se simplifie en x − " + m * m + ", mais √x doit d'abord exister : x ≥ 0."), TS([[m * m, true, Infinity, false]], "On applique f d'abord : seule la condition x ≥ 0 compte.")] }); },
  ];

  // ======================= vecteurs : niveau 3 (angle, colinéarité, norme ; étalon 2MA1 Q7) =======================
  const VC3 = [
    () => { const u = [nz(-6, 6), nz(-6, 6)], v = [nz(-6, 6), nz(-6, 6)], ps = u[0] * v[0] + u[1] * v[1], nu = Math.hypot(...u), nv = Math.hypot(...v); if (!ps || Math.abs(u[0] * v[1] - u[1] * v[0]) < 1) return null;
      const ang = Math.acos(ps / (nu * nv)) * 180 / Math.PI;
      return QR("Calcule l'angle entre " + M("\\vec{u} = " + vcT(...u)) + " et " + M("\\vec{v} = " + vcT(...v)) + " (en degrés, au centième).", ang, 0.01,
        M("\\cos\\alpha = \\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{u}\\| \\, \\|\\vec{v}\\|} = \\frac{" + ps + "}{\\sqrt{" + (u[0] ** 2 + u[1] ** 2) + "} \\cdot \\sqrt{" + (v[0] ** 2 + v[1] ** 2) + "}}") + ", " + M("\\alpha \\approx " + nb(+ang.toFixed(2)) + "°") + ".",
        { ctx: "angle", guide: [GN(M("\\vec{u} \\cdot \\vec{v}") + " ?", ps, M(ps) + "."), GS(M("\\cos\\alpha") + " (au dix-millième) ?", ps / (nu * nv), M("\\approx " + nb(+(ps / (nu * nv)).toFixed(4))), 0.0001), GS("Angle (au centième de degré) ?", ang, M("\\approx " + dg(+ang.toFixed(2))), 0.01)],
          traps: [TR(180 - ang, "Le signe du produit scalaire compte : " + (ps < 0 ? "négatif, l'angle est obtus." : "positif, l'angle est aigu.")), TR(Math.acos(ps / (nu * nv)), "Mets la calculatrice en degrés (ce résultat est en radians).")] }); },
    () => { const p = nz(-6, 6), q = nz(-7, 7), a = nz(-8, 8); if (Math.abs(p) === Math.abs(a) || p === 1) return null; const y = a * q / p;
      return QN("Quelle doit être la valeur de " + M("y") + " pour que " + M("\\vec{a} = \\begin{pmatrix} " + fT(a) + " \\\\ y \\end{pmatrix}") + " soit colinéaire à " + M("\\vec{u} = " + vcT(p, q)) + " ? (fraction acceptée)", y,
        "Colinéaires ⟺ " + M("\\det(\\vec{a}, \\vec{u}) = " + a + " \\cdot " + par(q) + " - y \\cdot " + par(p) + " = 0") + ", donc " + M("y = " + fT(y)) + ".",
        { ctx: "colineaire", guide: [GN("Facteur " + M("k") + " tel que " + M("\\vec{a} = k\\,\\vec{u}") + " (première composante) ?", a / p, M("k = \\frac{" + a + "}{" + p + "} = " + fT(a / p)) + "."), GN(M("y = k \\cdot " + par(q)) + " ?", y, M(fT(y)) + ".")],
          traps: [TR(p * q / a, "Le facteur est a/p = " + fS(a / p) + " (de u vers a), pas l'inverse."), TR(-a * p / q, "Colinéaires (même direction), pas perpendiculaires.")] }); },
    () => { const u = [nz(-5, 5), nz(-5, 5)], v = [nz(-5, 5), nz(-5, 5)], k = pk([2, 3, -2]), l = pk([3, -3, 2, -1]), w = [k * u[0] + l * v[0], k * u[1] + l * v[1]], n = Math.hypot(...w); if (Number.isInteger(n) && R.rand() < 0.5 || !w[0] || !w[1]) return null;
      return QR("Soit " + M("\\vec{u} = " + vcT(...u)) + " et " + M("\\vec{v} = " + vcT(...v)) + ". Calcule " + M("\\|" + (k === 1 ? "" : k) + "\\vec{u}" + (l < 0 ? " - " + (l === -1 ? "" : -l) : " + " + l) + "\\vec{v}\\|") + " (au centième).", n, 0.01,
        M((k) + "\\vec{u}" + (l < 0 ? " - " + (l === -1 ? "" : -l) : " + " + l) + "\\vec{v} = " + vcT(...w)) + ", norme " + M("\\sqrt{" + w[0] ** 2 + " + " + w[1] ** 2 + "} \\approx " + nb(+n.toFixed(2))) + ".",
        { ctx: "norme-combinaison", guide: [GP("Composantes de la combinaison ?", w, M(vcT(...w)) + "."), GS("Norme (au centième) ?", n, M("\\approx " + nb(+n.toFixed(2))), 0.01)],
          traps: [TR(Math.abs(k) * Math.hypot(...u) + Math.abs(l) * Math.hypot(...v), "La norme d'une somme n'est pas la somme des normes : calcule d'abord les composantes."), TR(w[0] ** 2 + w[1] ** 2, "N'oublie pas la racine carrée.")] }); },
  ];

  // ======================= trigeq : niveau 3, équations de la forme sin(f(x)) = c (variantes) =======================
  const VAL = [[0.5, "\\frac{1}{2}", 30], [-0.5, "-\\frac{1}{2}", -30], [Math.SQRT1_2, "\\frac{\\sqrt{2}}{2}", 45], [Math.sqrt(3) / 2, "\\frac{\\sqrt{3}}{2}", 60], [-Math.sqrt(3) / 2, "-\\frac{\\sqrt{3}}{2}", -60]];
  const in360 = (xs) => [...new Set(xs.map((x) => r6(((x % 360) + 360) % 360)))].sort((a, b) => a - b);
  const TQ3 = [
    () => { const [, cT, al] = pk(VAL), k = pk([2, 3]), sols = []; for (let j = -3; j < 3 * k; j++) { sols.push((al + 360 * j) / k, (180 - al + 360 * j) / k); }
      const S = in360(sols.filter((x) => x >= 0 && x < 360));
      return QSet("Résous " + M("\\sin(" + k + "x) = " + cT) + " pour " + M("0° \\le x < 360°") + ". Sépare les solutions par « ; » (en degrés).", S,
        M(k + "x = " + al + "° + k \\cdot 360°") + " ou " + M(k + "x = " + (180 - al) + "° + k \\cdot 360°") + ", donc " + M("x = " + fT(al / k) + "° + k \\cdot " + fT(360 / k) + "°") + " ou " + M("x = " + fT((180 - al) / k) + "° + k \\cdot " + fT(360 / k) + "°") + " : " + S.length + " solutions.",
        { ctx: "sin-kx", guide: [GSet("Valeurs de " + M(k + "x") + " dans " + M("[0° \\,;\\, 360°[") + " ?", in360([al, 180 - al]), in360([al, 180 - al]).join(" ; ") + "."), GSet("Toutes les solutions en " + M("x") + " ?", S, S.join(" ; ") + ".")],
          traps: [TSt(in360([al, 180 - al]).map((v) => v / k), "La période est divisée par " + k + " : ajoute des multiples de " + fS(360 / k) + "°."), TSt(in360([al, 180 - al]), "Ce sont les valeurs de " + k + "x : divise par " + k + " (et ajoute les multiples de " + fS(360 / k) + "°).")] }); },
    () => { const b = pk([-60, -30, 30, 60, 90]), c = pk([-45, 0, 45, 120]), u = c - b, w = 180 - c - b; if (u % 2 || w % 4) return null;
      const S = in360([...[0, 1].map((j) => u / 2 + 180 * j), ...[0, 1, 2, 3].map((j) => w / 4 + 90 * j)]);
      return QSet("Résous " + M("\\sin(3x" + (b < 0 ? " - " + -b : " + " + b) + "°) = \\sin(x" + (c ? (c < 0 ? " - " + -c : " + " + c) + "°" : "") + ")") + " pour " + M("0° \\le x < 360°") + ". Sépare les solutions par « ; ».", S,
        M("\\sin A = \\sin B \\iff A = B + k \\cdot 360°") + " ou " + M("A = 180° - B + k \\cdot 360°") + " : " + M("2x = " + u + "° + k \\cdot 360°") + " ou " + M("4x = " + w + "° + k \\cdot 360°") + ".",
        { ctx: "sin-egal-sin", guide: [GSet("Cas " + M("3x" + (b < 0 ? " - " + -b : " + " + b) + " = x" + (c ? (c < 0 ? " - " + -c : " + " + c) : "") + " + k \\cdot 360") + " : solutions dans " + M("[0 \\,;\\, 360[") + " ?", in360([0, 1].map((j) => u / 2 + 180 * j)), "Solutions du 1er cas : " + in360([0, 1].map((j) => u / 2 + 180 * j)).join(" ; ") + "."), GSet("Toutes les solutions ?", S, S.join(" ; ") + ".")],
          traps: [TSt(in360([0, 1].map((j) => u / 2 + 180 * j)), "Il y a un second cas : 3x + " + b + " = 180° − (x + " + c + ") + k · 360°."), TSt(in360([u / 2, w / 4]), "Ajoute les multiples de la période (180° pour 2x, 90° pour 4x).")] }); },
  ];

  // ======================= absval : niveau 3, inéquations (variantes) =======================
  const AB3 = [
    () => { const a = nz(-6, 6), b = R.int(2, 7), op = pk(["<", "<="]), cl = op === "<=", ivs = [[a - b, cl, a + b, cl]];
      return QS("Résous " + M("|x" + sg(-a) + "| " + opT(op) + " " + b) + ". Donne l'ensemble des solutions (intervalle).", ivs,
        M("|x" + sg(-a) + "| " + opT(op) + " " + b) + " : la distance de " + M("x") + " à " + M(a) + " est " + (cl ? "au plus " : "inférieure à ") + b + ", donc " + M(ssT(ivs)) + ".",
        { ctx: "distance-inf", guide: [GSet("Solutions de " + M("|x" + sg(-a) + "| = " + b) + " ?", [a - b, a + b], (a - b) + " ; " + (a + b) + "."), GSS("Ensemble des solutions ?", ivs, M(ssT(ivs)) + ".")],
          traps: [TS([[-Infinity, false, a - b, cl], [a + b, cl, Infinity, false]], "|x − a| petit : x est proche de a, donc entre les deux bornes."), TS([[-b - a, cl, b - a, cl]], "Le centre de l'intervalle est " + a + " (x" + (a < 0 ? " + " + -a : " − " + a) + " = 0).")] }); },
    () => { const k = pk([2, 3]), a = nz(-7, 7), b = R.int(1, 7), op = pk([">", ">="]), cl = op === ">=", lo = (a - b) / k, hi = (a + b) / k, ivs = [[-Infinity, false, lo, cl], [hi, cl, Infinity, false]];
      return QS("Résous " + M("|" + P2([k, -a]) + "| " + opT(op) + " " + b) + ". Donne l'ensemble des solutions (intervalles ; fractions acceptées).", ivs,
        M(P2([k, -a]) + " " + opT(op) + " " + b) + " ou " + M(P2([k, -a]) + " " + (cl ? "\\le" : "<") + " -" + b) + " : " + M("x " + (cl ? "\\ge " : "> ") + fT(hi)) + " ou " + M("x " + (cl ? "\\le " : "< ") + fT(lo)) + ".",
        { ctx: "distance-sup", guide: [GSet("Solutions de " + M("|" + P2([k, -a]) + "| = " + b) + " ?", [lo, hi], M(fT(lo)) + " ; " + M(fT(hi)) + "."), GSS("Ensemble des solutions ?", ivs, M(ssT(ivs)) + ".")],
          traps: [TS([[lo, !cl, hi, !cl]], "|…| > " + b + " : on est loin du centre, donc à l'extérieur des bornes."), TS([[hi, cl, Infinity, false]], "Il y a deux cas : " + P2([k, -a]).replace(/\\/g, "") + " ≥ " + b + " ou ≤ −" + b + ".")] }); },
    () => { let a = R.int(-6, 6), b = R.int(-6, 6); if (Math.abs(a - b) < 2) return null; const m = (a + b) / 2, op = pk(["<", "<="]), ivs = a < b ? [[-Infinity, false, m, op === "<="]] : [[m, op === "<=", Infinity, false]];
      return QS("Résous " + M("|x" + sg(-a) + "| " + opT(op) + " |x" + sg(-b) + "|") + ". Donne l'ensemble des solutions (intervalle ; fraction acceptée).", ivs,
        "Points plus proches de " + M(a) + " que de " + M(b) + " : du côté de " + M(a) + " par rapport au milieu " + M(fT(m)) + ". " + M("S = " + ssT(ivs)) + ".",
        { ctx: "plus-proche", guide: [GN("Abscisse du point à égale distance de " + M(a) + " et de " + M(b) + " ?", m, M(fT(m)) + "."), GSS("Ensemble des solutions ?", ivs, M(ssT(ivs)) + ".")],
          traps: [TS(a < b ? [[m, op === "<=", Infinity, false]] : [[-Infinity, false, m, op === "<="]], "On veut les points plus proches de " + a + " : du côté de " + a + "."), TS(a < b ? [[-Infinity, false, a, op === "<="]] : [[a, op === "<=", Infinity, false]], "La frontière est le milieu de " + a + " et " + b + ", pas " + a + ".")] }); },
  ];

  // ======================= polydiv : niveau 3, division par un polynôme de degré 2 (variantes ; étalon 2MA1 Q1) =======================
  const pdiv = (A, B) => { let r = A.slice(); const q = []; while (r.length >= B.length) { const c = r[0] / B[0]; q.push(c); r = r.map((v, i) => v - (B[i] !== undefined ? c * B[i] : 0)).slice(1); } return [q, ptrim(r.length ? r : [0])]; };
  const PD3 = [
    () => { const r1 = R.int(-3, 3); let r2 = R.int(-3, 3); if (r1 === r2) return null; const B = prod([1, -r1], [1, -r2]), A = [nz(-3, 3), R.int(-4, 4), R.int(-5, 5), R.int(-6, 6), R.int(-6, 6)];
      const [Q, Rm] = pdiv(A, B); if (Rm.length < 2 || !Rm[0] || !Rm[1] || Q.some((c) => !Number.isInteger(c))) return null;
      /* 25.11 (formule de 362 px sur téléphone) : corrigé « Quotient Q(x) = … et A(x) = B(x) Q(x) + R(x) ». */
      return QX("Effectue la division euclidienne de " + M("A(x) = " + P2(A)) + " par " + M("B(x) = " + P2(B)) + ". Donne le reste " + M("R(x)") + ".", tp(Rm),
        "Quotient " + M("Q(x) = " + P2(Q)) + " et " + M("A(x) = B(x)\\,Q(x) + " + P2(Rm)) + " : le reste " + M(P2(Rm)) + " est de degré 1, inférieur au degré du diviseur.",
        { ctx: "division-deg2", guide: [GX("Quotient " + M("Q(x)") + " ?", tp(Q), M(P2(Q)) + "."), GX("Reste " + M("R(x) = A(x) - B(x)\\,Q(x)") + " ?", tp(Rm), M(P2(Rm)) + ".")],
          traps: [TX(tp(Q), "C'est le quotient ; on demande le reste."), TX(tp(Rm.map((c) => -c)), "Le reste est A − B·Q : vérifie les signes des soustractions."), TX(tp([Rm[1]]), "Le reste a un degré strictement inférieur à celui du diviseur (ici : degré 1 au plus).")] }); },
    () => { const r1 = nz(-3, 3); let r2 = nz(-3, 3), s = nz(-4, 4); if (r1 === r2 || s === r1 || s === r2) return null; const c0 = -r1 * r2 * s, a = -(r1 + r2 + s), b = r1 * r2 + r1 * s + r2 * s, B = prod([1, -r1], [1, -r2]);
      return QP("Détermine " + M("a") + " et " + M("b") + " pour que " + M("P(x) = x^3 + ax^2 + bx" + sg(c0)) + " soit divisible par " + M(P2(B)) + ". Réponds « a ; b ».", [a, b],
        M(P2(B) + " = " + fac(r1) + fac(r2)) + " : " + M(r1) + " et " + M(r2) + " sont racines de " + M("P") + ". Le produit des trois racines vaut " + M(fT(-c0)) + ", donc la troisième est " + M(s) + " et " + M("P(x) = " + fac(r1) + fac(r2) + fac(s) + " = " + P2([1, a, b, c0])) + ".",
        { ctx: "divisible-deg2", guide: [GSet("Racines de " + M(P2(B)) + " ?", [r1, r2], [r1, r2].sort((u, v) => u - v).join(" ; ") + "."), GN("On écrit " + M("P(x) = " + fac(r1) + fac(r2) + "(x - s)") + ". Le terme constant donne " + M("s") + " = ?", s, M(fT(r1 * r2) + " \\cdot (-s) = " + c0) + ", " + M("s = " + s) + "."), GP(M("a ; b") + " ?", [a, b], M("a = " + a) + ", " + M("b = " + b) + ".")],
          traps: [TP([b, a], "L'ordre est « a ; b » : a est le coefficient de x²."), TP([-a, -b], "Développe (x − r₁)(x − r₂)(x − s) en gardant les signes.")] }); },
  ];

  // ---------- enregistrement ----------
  /* Nouvelle notion de 2e : ineqpoly (chapitre Sésamath Ma2 Ch3, Fonctions polynomiales). */
  const NEW = [
    { id: "ineqpoly", theme: "fa", label: "Inéquations polynomiales (tableau des signes)", ex: "(x + 2)(3 - x)(x - 5) \\le 0", CH: [13], lv: IP,
      hint: "Ramène tout d'un côté (… ≥ 0), factorise au maximum, cherche les zéros, puis dresse le tableau des signes : un facteur au carré ne change pas de signe.",
      lesson: ["Inéquations polynomiales", "Le tableau des signes : la méthode de 2e pour toutes les inéquations.", "1. Mettre l'inéquation sous la forme \\(P(x) \\ge 0\\) (ou \\(<\\), \\(\\le\\), \\(>\\)). 2. Factoriser \\(P(x)\\) au maximum (mise en évidence, identités, racine évidente). 3. Placer les zéros dans l'ordre et chercher le signe de chaque facteur. 4. Le signe du produit se lit colonne par colonne ; inégalité large : les zéros sont solutions. Un facteur \\((x - a)^2\\) ne change pas de signe ; un facteur \\(x^2 + k\\) (\\(k > 0\\)) est toujours positif.",
        ["\\((x + 2)(x - 1)(x - 4) < 0\\) : \\(S = \\,]-\\infty \\,;\\, -2[\\, \\cup \\,]1 \\,;\\, 4[\\)", "\\(x^3 \\ge 4x^2 \\iff x^2(x - 4) \\ge 0\\) : \\(S = \\{0\\} \\cup [4 \\,;\\, +\\infty[\\)"], "Ne divise jamais une inéquation par une expression dont tu ne connais pas le signe (x, x², x − 1…) : factorise plutôt."],
      comps: ["Résoudre une inéquation produit (tableau des signes)", "Factoriser puis résoudre (facteur toujours positif, zéro fractionnaire)", "Résoudre une inéquation polynomiale de degré 3 ou 4"], },
  ];
  for (const n of NEW) {
    if (!NOTIONS.some((x) => x.id === n.id)) NOTIONS.push({ id: n.id, theme: n.theme, label: n.label, ex: n.ex, CH: n.CH, MP: null, FR: null });
    GEN[n.id] = (d) => pickForm(n.lv[Math.min(Math.max(d, 1), 3)]);
    HINTS_EXTRA[n.id] = n.hint;
    LESSONS_EXTRA[n.id] = n.lesson;
    if (typeof COMPS !== "undefined") COMPS[n.id] = n.comps;
  }
  /* Niveaux remontés (notions propres au Collège ; cart et recip servent aussi en France, 2nde et 1re, où ces formes
     restent au programme). */
  remonte("cart", { 1: CART[1], 2: CART[2], 3: CART[3] });
  remonte("droites", { 1: DR1 });
  remonte("polyexpr", { 3: PE3 });
  remonte("modexp", { 1: [ancien("modexp", 2), ancien("modexp", 3), MX2[0]], 2: MX2, 3: MX3 });
  remonte("recip", { 2: [ancien("recip", 2), ancien("recip", 3)], 3: RC3 });
  remonte("compo", { 2: [ancien("compo", 2), ancien("compo", 3)], 3: CP3 });
  remonte("vecteurs", { 2: [ancien("vecteurs", 2), ancien("vecteurs", 3)], 3: VC3 });
  if (typeof COMPS !== "undefined") {
    COMPS.cart = ["Calculer une distance ou un milieu", "Construire un point (parallélogramme, symétrique, partage)", "Aire d'un triangle, point équidistant, angle droit"];
    COMPS.droites = ["Passer d'une équation cartésienne à y = mx + h ; pente perpendiculaire", "Trouver une droite parallèle ou perpendiculaire", "Trouver l'intersection de deux droites"];
    COMPS.polyexpr = ["Retrouver un polynôme par ses zéros", "Retrouver un polynôme (zéro double)", "Déterminer un polynôme vérifiant plusieurs conditions"];
    COMPS.modexp = ["Calculer une croissance par doublements ou demi-vies", "Intérêts composés, valeur initiale, taux global", "Trouver un taux ou une durée (racine n-ième, seuil)"];
    COMPS.recip = ["Calculer avec une réciproque", "Composée et réciproque d'une fonction affine", "Réciproque d'une bijection (parabole restreinte, racine, cube)"];
    COMPS.compo = ["Calculer avec une composée", "Trouver l'expression d'une composée", "Composer des fonctions homographiques ; domaine d'une composée"];
    COMPS.vecteurs = ["Calculer les composantes d'un vecteur", "Combinaisons de vecteurs et produit scalaire", "Angle entre deux vecteurs, colinéarité, norme"];
  }
  /* Variantes ajoutées au niveau 3 (les formes d'origine restent tirées). */
  if (typeof VAR !== "undefined") {
    const add = (id, d, fns) => { VAR[id] = VAR[id] || {}; VAR[id][d] = (VAR[id][d] || []).concat(fns.map((f) => () => pickForm([f]))); }; /* pickForm : une forme peut refuser un tirage (null) */
    add("trigeq", 3, TQ3);
    add("absval", 3, AB3);
    add("polydiv", 3, PD3);
  }
  /* Ordre et chapitre : src/ordre.js (ineqpoly, Ma2 Ch3). */
})();

// 2e Collège (23.11) : sujets de préparation riches des chapitres de 2e (équations cartésiennes, polynômes, fonctions
// rationnelles, exponentielles, composition et réciproque, logarithmes, trigonométrie, vecteurs). Niveau Collège de
// Genève (DF), nettement au-dessus de la MP : paramètres, valeurs exactes, justification. Outils communs : RX
// (riche_mp2.js). Banques réservées au Collège (track: "col").
(function () {
  const { N, A, Q, pk, g2, FR, lin, cx, sg, par, X, ul, who, tab, VF, shuffle, D } = RX;
  const T = (v) => M(N(v));
  const FRp = (v) => FR(v).replace(/\\frac\{(\d+)\}\{(\d+)\}/, "$1/$2"); // forme tapée d'une fraction
  // Racine simplifiée : n = k²·m → [latex, forme tapée].
  const sq = (n) => { let k = 1; for (let d = 2; d * d <= n; d++) while (n % (d * d) === 0) { n /= d * d; k *= d; } return n === 1 ? [String(k), String(k)] : [(k === 1 ? "" : k) + "\\sqrt{" + n + "}", (k === 1 ? "" : k) + "√" + n]; };
  // Polynôme (coefficients du plus haut degré au terme constant), coefficients exacts.
  const poly = (c, x = "x") => { const n = c.length - 1; let s = ""; c.forEach((a, i) => { const e = n - i; if (Math.abs(a) < 1e-12) return; const mono = e === 0 ? FR(Math.abs(a)) : (Math.abs(Math.abs(a) - 1) < 1e-12 ? "" : FR(Math.abs(a))) + x + (e > 1 ? "^{" + e + "}" : ""); s += s ? (a < 0 ? " - " : " + ") + mono : (a < 0 ? "-" : "") + mono; }); return s || "0"; };
  const pv = (c, x) => c.reduce((s, a) => s * x + a, 0);
  const fac = (r, x = "x") => "(" + x + (r < 0 ? " + " + FR(-r) : " - " + FR(r)) + ")";
  const pt = (x, y) => "(" + FR(x) + " \\,;\\, " + FR(y) + ")";
  const sh = (x, v) => (Math.abs(v) < 1e-12 ? x : "(" + x + sg(-v) + ")"); // (x - v), ou x si v = 0

  // ===================== 2e · 1. Équations cartésiennes =====================
  const EXC = [
    // Le triangle rectangle caché (distance, milieu, cercle circonscrit)
    () => { const xa = R.int(-4, 0), ya = R.int(-3, 1), [p0, q0] = pk([[2, 1], [1, 2], [3, 1], [1, 3], [2, 3], [3, 2]]), s1 = pk([1, -1]), p = p0 * s1, q = q0, k = pk([1, 2]);
      const C = [xa + p, ya + q], B = [C[0] - k * q, C[1] + k * p], O = [(xa + B[0]) / 2, (ya + B[1]) / 2], r2 = ((1 + k * k) * (p * p + q * q)) / 4, on = R.rand() < 0.5, Dp = [xa + B[0] - C[0] + (on ? 0 : 1), ya + B[1] - C[1]], dd = (Dp[0] - O[0]) ** 2 + (Dp[1] - O[1]) ** 2;
      const AC = sq(p * p + q * q), BC = sq(k * k * (p * p + q * q)), AB = sq((1 + k * k) * (p * p + q * q));
      return X({ id: "cart", lv: 1, titre: "Le triangle et son cercle",
        q: "On donne " + M("A" + pt(xa, ya)) + ", " + M("B" + pt(B[0], B[1])) + " et " + M("C" + pt(C[0], C[1])) + ".",
        parts: [{ label: "Calcule les longueurs exactes " + M("AB") + ", " + M("AC") + " et " + M("BC") + ".", pts: 2 }, { label: "Montre que le triangle " + M("ABC") + " est rectangle. En quel sommet ?", pts: 1 }, { label: "Donne le centre, le rayon et l'équation du cercle circonscrit au triangle.", pts: 2 }, { label: "Le point " + M("D" + pt(Dp[0], Dp[1])) + " est-il sur ce cercle ? Justifie.", pts: 1 }],
        sol: ul([M("AB = \\sqrt{" + (1 + k * k) * (p * p + q * q) + "} = " + AB[0]) + ", " + M("AC = " + AC[0]) + ", " + M("BC = " + BC[0]) + ".", M("AC^2 + BC^2 = " + (p * p + q * q) + " + " + k * k * (p * p + q * q) + " = " + (1 + k * k) * (p * p + q * q) + " = AB^2") + " : rectangle en " + M("C") + " (réciproque de Pythagore).", "L'hypoténuse est un diamètre : centre " + M("\\Omega" + pt(O[0], O[1])) + " (milieu de " + M("[AB]") + "), rayon " + M("\\frac{AB}{2}") + ", " + M("r^2 = " + FR(r2)) + " : " + M(sh("x", O[0]) + "^2 + " + sh("y", O[1]) + "^2 = " + FR(r2)) + ".", M((Math.abs(O[0]) < 1e-12 ? par(Dp[0]) : "(" + FR(Dp[0]) + sg(-O[0]) + ")") + "^2 + " + (Math.abs(O[1]) < 1e-12 ? par(Dp[1]) : "(" + FR(Dp[1]) + sg(-O[1]) + ")") + "^2 = " + FR(dd)) + (on ? " : oui, " + M("D") + " est sur le cercle (c'est le symétrique de " + M("C") + " par rapport à " + M("\\Omega") + ")." : " ≠ " + M(FR(r2)) + " : non.")]),
        chk: [[Math.hypot(B[0] - xa, B[1] - ya), AB[1]], [r2, FRp(r2)], [dd, FRp(dd)]] }); },
    // La route et la maison (perpendiculaire, intersection, distance point-droite)
    () => { const [p, q] = pk([[2, 1], [1, 2], [-1, 2], [-2, 1], [1, 3], [3, 1], [-3, 1], [-1, 3]]), m = p / q, F = [pk([-3, -2, -1, 1, 2, 3]), R.int(-2, 3)], k = pk([1, 2]) * pk([1, -1]);
      const R1 = [F[0] - q, F[1] - p], R2 = [F[0] + 2 * q, F[1] + 2 * p], H = [F[0] - k * p, F[1] + k * q], h = F[1] - m * F[0], mp = -1 / m, hp = H[1] - mp * H[0], dist = sq(k * k * (p * p + q * q)), cost = pk([80, 120, 150]);
      return X({ id: "droitesinter", lv: 2, titre: "La route et la maison",
        q: "Dans un repère (unité : 10 m), une route rectiligne passe par " + M("R_1" + pt(R1[0], R1[1])) + " et " + M("R_2" + pt(R2[0], R2[1])) + ". Une maison est en " + M("H" + pt(H[0], H[1])) + ". On veut la relier à la route par le chemin le plus court ; il coûte " + Q(cost, "CHF") + " par mètre.",
        parts: [{ label: "Donne l'équation de la route " + M("d") + ".", pts: 1 }, { label: "Donne l'équation de la droite " + M("p") + " perpendiculaire à " + M("d") + " passant par " + M("H") + ".", pts: 1 }, { label: "Calcule le point " + M("F") + " où le chemin rejoint la route.", pts: 2 }, { label: "Calcule la longueur du chemin (valeur exacte, puis en mètres au décimètre) et son coût.", pts: 2 }],
        sol: ul(["Pente " + M(FR(m)) + " ; " + M("d : y = " + lin(m, h)) + ".", "Pente " + M(FR(mp)) + " (produit des pentes −1) ; " + M("p : y = " + lin(mp, hp)) + ".", M(lin(m, h) + " = " + lin(mp, hp)) + " ⟺ " + M("x = " + F[0]) + " ; " + M("F" + pt(F[0], F[1])) + ".", M("HF = \\sqrt{" + (k * p) ** 2 + " + " + (k * q) ** 2 + "} = " + dist[0]) + " unités, soit " + M("\\approx " + A(10 * Math.hypot(k * p, k * q), 1)) + " m ; coût " + M("\\approx " + N(Math.round(10 * Math.hypot(k * p, k * q) * cost))) + " CHF."]),
        chk: [[(hp - h) / (m - mp), String(F[0])], [Math.hypot(H[0] - F[0], H[1] - F[1]), dist[1]], [10 * Math.hypot(k * p, k * q), A(10 * Math.hypot(k * p, k * q), 1), 0.1]] }); },
    // Cercle donné sous forme développée, corde
    () => { let a, b, s; do { a = pk([-3, -2, -1, 1, 2, 3]); b = pk([-2, -1, 1, 2, 4]); s = pk([1, 2]); } while (a * a + b * b === 25 * s * s);
      const r2 = 25 * s * s, F = a * a + b * b - r2, h = b - a + s, P1 = [a + 3 * s, b + 4 * s], P2 = [a - 4 * s, b - 3 * s], Pq = [a + pk([1, 2]) * s, b - pk([3, 6]) * s], dq = (Pq[0] - a) ** 2 + (Pq[1] - b) ** 2;
      return X({ id: "cercle", lv: 2, titre: "Un cercle déguisé",
        q: "On considère l'équation " + M("x^2 + y^2" + (a ? sg(-2 * a) + "x" : "") + sg(-2 * b) + "y" + sg(F) + " = 0") + " et la droite " + M("d : y = " + lin(1, h)) + ".",
        parts: [{ label: "Montre que c'est l'équation d'un cercle ; donne son centre et son rayon.", pts: 2 }, { label: "Le point " + M("P" + pt(Pq[0], Pq[1])) + " est-il à l'intérieur ou à l'extérieur du cercle ?", pts: 1 }, { label: "Calcule les points d'intersection du cercle et de " + M("d") + ".", pts: 2 }, { label: "Calcule la longueur de la corde obtenue.", pts: 1 }],
        sol: ul(["On complète les carrés : " + M("(x" + sg(-a) + ")^2 + (y" + sg(-b) + ")^2 = " + (a * a) + " + " + (b * b) + sg(-F) + " = " + r2) + " : centre " + M(pt(a, b)) + ", rayon " + M(5 * s) + ".", "Distance au centre au carré : " + M(dq) + (dq < r2 ? " \\lt " : " > ") + M(r2) + " : " + (dq < r2 ? "à l'intérieur." : "à l'extérieur."), "On remplace " + M("y") + " : " + M(sh("x", a) + "^2 + " + sh("x", b - h) + "^2 = " + r2) + ", soit " + M(poly([2, -2 * a + 2 * (h - b), a * a + (h - b) ** 2 - r2]) + " = 0") + " ; " + M("x = " + P1[0]) + " ou " + M("x = " + P2[0]) + " : " + M(pt(P1[0], P1[1])) + " et " + M(pt(P2[0], P2[1])) + ".", M("\\sqrt{" + (7 * s) ** 2 + " + " + (7 * s) ** 2 + "} = " + 7 * s + "\\sqrt{2}") + "."]),
        chk: [[Math.sqrt(a * a + b * b - F), String(5 * s)], [P1[0] + h, String(P1[1])], [P2[0] + h, String(P2[1])], [Math.hypot(P1[0] - P2[0], P1[1] - P2[1]), 7 * s + "√2"]] }); },
    // Tangentes à un cercle
    () => { const a = pk([-2, -1, 1, 2, 3]), [u0, v0] = pk([[3, 4], [4, 3]]), u = u0 * pk([1, -1]), v = v0 * pk([1, -1]), b = pk([-3, -1, 1, 2].filter((y) => y + v !== 0 && y - v !== 0)), T1 = [a + u, b + v], T2 = [a - u, b - v];
      const mt = -u / v, h1 = T1[1] - mt * T1[0], h2 = T2[1] - mt * T2[0];
      return X({ id: "cercletan", lv: 3, titre: "Deux tangentes parallèles",
        q: "Le cercle " + M("\\Gamma") + " a pour équation " + M("(x" + sg(-a) + ")^2 + (y" + sg(-b) + ")^2 = 25") + ". On considère le point " + M("T" + pt(T1[0], T1[1])) + ".",
        parts: [{ label: "Vérifie que " + M("T") + " est sur " + M("\\Gamma") + ".", pts: 1 }, { label: "Donne l'équation de la tangente " + M("t") + " à " + M("\\Gamma") + " en " + M("T") + ".", pts: 2 }, { label: "Une autre tangente est parallèle à " + M("t") + ". En quel point touche-t-elle le cercle ? Donne son équation.", pts: 2 }, { label: "Quelle est la distance entre ces deux tangentes ? Justifie sans calcul.", pts: 1 }],
        sol: ul([M("(" + T1[0] + sg(-a) + ")^2 + (" + T1[1] + sg(-b) + ")^2 = " + u * u + " + " + v * v + " = 25") + " ✓.", "La tangente est perpendiculaire au rayon " + M("\\Omega T") + ", de pente " + M(FR(v / u)) + " : pente " + M(FR(mt)) + ", " + M("t : y = " + lin(mt, h1)) + ".", "Au point diamétralement opposé " + M("T'" + pt(T2[0], T2[1])) + " (symétrique de " + M("T") + " par rapport au centre) : " + M("y = " + lin(mt, h2)) + ".", "Elle vaut le diamètre, 10 : les deux tangentes sont perpendiculaires au même diamètre " + M("[TT']") + "."]),
        chk: [[(T1[0] - a) ** 2 + (T1[1] - b) ** 2, "25"], [mt * T2[0] + h2, String(T2[1])], [Math.abs(h1 - h2) / Math.sqrt(1 + mt * mt), "10"]] }); },
  ];
  const RAISONC = [
    () => { const xa = R.int(-5, -1), ya = R.int(1, 6), xb = pk([2, 3, 4, 6, 7, 8].filter((x) => x !== -xa)), yb = R.int(-4, -1), w = who();
      return X({ id: "cart", lv: 1, titre: "Trouve l'erreur",
        q: w + " calcule le milieu de " + M("[AB]") + " avec " + M("A" + pt(xa, ya)) + " et " + M("B" + pt(xb, yb)) + " : « " + M("M = \\left(\\frac{" + xb + " - " + par(xa) + "}{2} \\,;\\, \\frac{" + yb + " - " + ya + "}{2}\\right) = " + pt((xb - xa) / 2, (yb - ya) / 2)) + " ».",
        parts: [{ label: "Calcule " + M("AM") + " et " + M("MB") + " avec son point. Que constates-tu ?", pts: 1 }, { label: "Corrige.", pts: 1 }],
        sol: ul(["Les deux distances ne sont pas égales (son point n'est d'ailleurs pas sur le segment) : ce n'est pas le milieu.", "On fait la moyenne des coordonnées : " + M("M = \\left(\\frac{" + xa + " + " + xb + "}{2} \\,;\\, \\frac{" + ya + " + " + par(yb) + "}{2}\\right) = " + pt((xa + xb) / 2, (ya + yb) / 2)) + "."]),
        chk: [[(xa + xb) / 2, FRp((xa + xb) / 2)]] }); },
    () => VF("cercle", 2, [["« " + M("x^2 + y^2 + 4 = 0") + " est l'équation d'un cercle. »", false, "On aurait " + M("x^2 + y^2 = -4") + " : impossible, aucun point."],
      ["« Le cercle " + M("(x - 1)^2 + (y + 2)^2 = 9") + " passe par l'origine. »", false, M("1 + 4 = 5 \\neq 9") + "."],
      ["« Une tangente à un cercle est perpendiculaire au rayon au point de contact. »", true, "C'est la propriété de la tangente (distance minimale au centre)."],
      ["« Les droites " + M("2x - y + 1 = 0") + " et " + M("x + 2y = 5") + " sont perpendiculaires. »", true, "Pentes 2 et " + M("-\\frac{1}{2}") + " : produit −1."],
      ["« Une droite coupe toujours un cercle en deux points. »", false, "Elle peut être tangente (1 point) ou extérieure (aucun)."],
      ["« La médiatrice de " + M("[AB]") + " est l'ensemble des points équidistants de " + M("A") + " et " + M("B") + ". »", true, "C'est sa définition ; elle passe par le milieu, perpendiculairement à " + M("(AB)") + "."]]),
  ];

  // ===================== 2e · 3. Fonctions polynomiales =====================
  const EXP = [
    // Racine évidente, factorisation, inéquation
    () => { let r1, r2, r3; do { r1 = pk([1, -1, 2]); r2 = R.int(-4, 4); r3 = R.int(-4, 4); } while (new Set([r1, r2, r3]).size < 3 || r2 * r3 === 0 || r2 + r3 === 0 || r1 + r2 + r3 === 0 || r1 * r2 + r1 * r3 + r2 * r3 === 0);
      const c = [1, -(r1 + r2 + r3), r1 * r2 + r1 * r3 + r2 * r3, -r1 * r2 * r3], [q1, q2, q3] = [r1, r2, r3].sort((x, y) => x - y);
      return X({ id: "polyfact", lv: 2, titre: "Une racine évidente",
        q: "Soit " + M("P(x) = " + poly(c)) + ".",
        parts: [{ label: "Calcule " + M("P(" + r1 + ")") + ". Que peux-tu en déduire ?", pts: 1 }, { label: "Divise " + M("P(x)") + " par " + M(fac(r1).slice(1, -1)) + " (schéma de Horner ou division).", pts: 1 }, { label: "Factorise complètement " + M("P(x)") + ".", pts: 1 }, { label: "Résous " + M("P(x) \\ge 0") + " (tableau de signes).", pts: 2 }],
        sol: ul([M("P(" + r1 + ") = 0") + " : " + M(r1) + " est une racine, donc " + M(fac(r1)) + " divise " + M("P(x)") + ".", "Quotient " + M(poly([1, -(r2 + r3), r2 * r3])) + ", reste 0.", M("P(x) = " + fac(q1) + fac(q2) + fac(q3)) + ".", "Signe d'un polynôme de degré 3 de coefficient dominant positif : −, +, −, + : " + M("S = [" + q1 + " \\,;\\, " + q2 + "] \\cup [" + q3 + " \\,;\\, +\\infty[") + "."]),
        chk: [[r2 + r3, String(r2 + r3)], [pv(c, q1 - 0.5) < 0 ? 1 : 0, "1"]] }); },
    // La boîte sans couvercle (modéliser, racine connue, factoriser)
    () => { const [L, l, x0] = pk([[20, 12, 2], [24, 16, 2], [30, 20, 3], [16, 10, 1], [24, 14, 3], [30, 16, 2], [40, 24, 4]]), V0 = x0 * (L - 2 * x0) * (l - 2 * x0), b = -2 * (L + l) + 4 * x0, c = L * l + b * x0, Dl = b * b - 16 * c, r = [(-b - Math.sqrt(Dl)) / 8, (-b + Math.sqrt(Dl)) / 8], ok = r.filter((x) => x > 0 && x < l / 2), no = r.filter((x) => !(x > 0 && x < l / 2));
      return X({ id: "polyexpr", lv: 2, titre: "La boîte sans couvercle",
        q: "Dans une plaque de carton de " + Q(L, "cm") + " sur " + Q(l, "cm") + ", on découpe un carré de côté " + M("x") + " cm à chaque coin, puis on relève les bords pour former une boîte sans couvercle.",
        parts: [{ label: "Exprime le volume " + M("V(x)") + " sous forme factorisée puis développée.", pts: 2 }, { label: "Pour quelles valeurs de " + M("x") + " la boîte existe-t-elle ?", pts: 1 }, { label: "Calcule " + M("V(" + x0 + ")") + ".", pts: 1 }, { label: "Trouve toutes les autres valeurs de " + M("x") + " qui donnent le même volume (au centième).", pts: 2 }],
        sol: ul([M("V(x) = x(" + L + " - 2x)(" + l + " - 2x) = " + poly([4, -2 * (L + l), L * l, 0])) + ".", M("0 \\lt x \\lt " + l / 2) + " (la largeur " + M(l + " - 2x") + " doit rester positive).", M("V(" + x0 + ") = " + x0 + " \\cdot " + (L - 2 * x0) + " \\cdot " + (l - 2 * x0) + " = " + V0) + " cm³.", M(poly([4, -2 * (L + l), L * l, -V0]) + " = 0") + " a la racine " + M(x0) + " ; division par " + M("(x - " + x0 + ")") + " : " + M(poly([4, b, c]) + " = 0") + ", " + M("x = \\frac{" + -b + " \\pm \\sqrt{" + Dl + "}}{8}") + ", soit " + M("x \\approx " + A(r[0], 2)) + " ou " + M("x \\approx " + A(r[1], 2)) + ". Seule " + M(A(ok[0], 2)) + " convient (" + M(A(no[0], 2)) + " est hors du domaine)."]),
        chk: [[V0, String(V0)], [ok[0], A(ok[0], 2), 0.01], [ok[0] * (L - 2 * ok[0]) * (l - 2 * ok[0]), String(V0), 1e-6]] }); },
    // Retrouver un polynôme à partir de son graphe
    () => { let r, a, y0; do { r = shuffle([-3, -2, -1, 1, 2, 3]).slice(0, 3).sort((x, y) => x - y); a = pk([0.5, -0.5, 1, -1]); y0 = -a * r[0] * r[1] * r[2]; } while (Math.abs(y0) > 7 || Math.abs(y0) < 2 || Number.isInteger(y0) === false);
      const c = [a, -a * (r[0] + r[1] + r[2]), a * (r[0] * r[1] + r[0] * r[2] + r[1] * r[2]), y0], f = (x) => a * (x - r[0]) * (x - r[1]) * (x - r[2]);
      const neg = a > 0 ? "]-\\infty \\,;\\, " + r[0] + "[ \\cup \\,]" + r[1] + " \\,;\\, " + r[2] + "[" : "]" + r[0] + " \\,;\\, " + r[1] + "[ \\cup \\,]" + r[2] + " \\,;\\, +\\infty[";
      return X({ id: "polyexpr", lv: 3, titre: "Retrouver le polynôme",
        q: "Le graphe ci-dessous est celui d'un polynôme " + M("P") + " de degré 3. Ses zéros et son ordonnée à l'origine sont des nombres entiers.", fig: FIG.plot([{ f }], [[r[0], 0, ""], [r[1], 0, ""], [r[2], 0, ""], [0, y0, ""]], { numbers: true, xr: [-5, 5], yr: [-8, 8], step: 2, squash: 0.6 }),
        parts: [{ label: "Lis les zéros et écris " + M("P(x)") + " sous forme factorisée avec un coefficient " + M("a") + " inconnu.", pts: 1 }, { label: "Détermine " + M("a") + " à l'aide de l'ordonnée à l'origine.", pts: 2 }, { label: "Écris " + M("P(x)") + " sous forme développée.", pts: 1 }, { label: "Résous " + M("P(x) \\lt 0") + ".", pts: 1 }],
        sol: ul([M("P(x) = a" + fac(r[0]) + fac(r[1]) + fac(r[2])) + ".", M("P(0) = " + -r[0] * r[1] * r[2] + "a = " + y0) + " (produit des opposés des zéros)" + " : " + M("a = " + FR(a)) + ".", M("P(x) = " + poly(c)) + ".", M("S = " + neg) + " (lu sur le graphe ou par le tableau de signes)."]),
        chk: [[y0 / (-r[0] * r[1] * r[2]), FRp(a)], [pv(c, 0), String(y0)], [pv(c, r[1]) === 0 ? 7 : 0, "7"]] }); },
    // Paramètre : divisibilité, reste
    () => { let a, r2, r3, k; do { a = pk([2, -2, 3, -1]); r2 = R.int(-4, 4); r3 = R.int(-4, 4); k = -(a + r2 + r3); } while (new Set([a, r2, r3]).size < 3 || r2 * r3 === 0 || k === 0 || a * r2 + a * r3 + r2 * r3 === 0);
      const b = a * r2 + a * r3 + r2 * r3, c = -a * r2 * r3, t = pk([1, -3, 4].filter((x) => ![a, r2, r3].includes(x)).concat([5])), cP = [1, k, b, c], rest = pv(cP, t);
      return X({ id: "polydiv", lv: 2, titre: "Trouver le paramètre",
        q: "Soit " + M("P(x) = x^3 + kx^2" + ((t2) => (t2.startsWith("-") ? " - " + t2.slice(1) : " + " + t2))(poly([b, c]))) + ", où " + M("k") + " est un nombre réel.",
        parts: [{ label: "Détermine " + M("k") + " pour que " + M("P(x)") + " soit divisible par " + M(fac(a).slice(1, -1)) + ".", pts: 2 }, { label: "Avec cette valeur, factorise " + M("P(x)") + " complètement.", pts: 2 }, { label: "Sans effectuer la division, donne le reste de la division de " + M("P(x)") + " par " + M(fac(t).slice(1, -1)) + ".", pts: 1 }],
        sol: ul(["Il faut " + M("P(" + a + ") = 0") + " : " + M(a ** 3 + " + " + a * a + "k" + sg(b * a) + sg(c) + " = 0") + " ⟺ " + M("k = " + k) + ".", M("P(x) = " + poly(cP)) + " ; division par " + M(fac(a)) + " : " + M(poly([1, -(r2 + r3), r2 * r3])) + ", d'où " + M("P(x) = " + fac(a) + fac(Math.min(r2, r3)) + fac(Math.max(r2, r3))) + ".", "Le reste est " + M("P(" + t + ") = " + rest) + "."]),
        chk: [[-(a ** 3 + b * a + c) / (a * a), String(k)], [rest, String(rest)]] }); },
  ];
  const RAISONP = [
    () => { const k = pk([4, 9, 16, 25]), w = who();
      return X({ id: "ineq", lv: 1, titre: "Trouve l'erreur",
        q: w + " résout " + M("x^2 > " + k) + " : « " + M("x > " + Math.sqrt(k)) + " ».",
        parts: [{ label: "Teste " + M("x = " + -(Math.sqrt(k) + 1)) + ". Que constates-tu ?", pts: 1 }, { label: "Donne l'ensemble des solutions.", pts: 1 }],
        sol: ul([M("(" + -(Math.sqrt(k) + 1) + ")^2 = " + (Math.sqrt(k) + 1) ** 2 + " > " + k) + " : c'est une solution oubliée.", M("x^2 - " + k + " = (x - " + Math.sqrt(k) + ")(x + " + Math.sqrt(k) + ") > 0") + " : " + M("S = \\,]-\\infty \\,;\\, " + -Math.sqrt(k) + "[ \\cup \\,]" + Math.sqrt(k) + " \\,;\\, +\\infty[") + "."]),
        chk: [[Math.sqrt(k), String(Math.sqrt(k))]] }); },
    () => VF("polydiv", 2, [["« Un polynôme de degré 3 a toujours au moins un zéro réel. »", true, "Ses valeurs vont de " + M("-\\infty") + " à " + M("+\\infty") + " (ou l'inverse) : le graphe coupe l'axe des x."],
      ["« Si " + M("P(2) = 0") + ", alors " + M("(x + 2)") + " divise " + M("P(x)") + ". »", false, "C'est " + M("(x - 2)") + " qui divise " + M("P(x)") + "."],
      ["« Le reste de la division de " + M("P(x)") + " par " + M("(x - a)") + " est " + M("P(a)") + ". »", true, M("P(x) = (x - a)Q(x) + r") + " ; en " + M("x = a") + " : " + M("P(a) = r") + "."],
      ["« Le produit de deux polynômes de degré 2 est de degré 4. »", true, "Les degrés s'additionnent (les coefficients dominants ne s'annulent pas)."],
      ["« Un polynôme de degré 4 a toujours 4 zéros réels. »", false, M("x^4 + 1") + " n'en a aucun."],
      ["« " + M("x^3 - x") + " est négatif pour tout " + M("x \\lt 0") + ". »", false, "Pour " + M("x = -\\frac{1}{2}") + " : " + M("-\\frac{1}{8} + \\frac{1}{2} > 0") + "."]]),
  ];

  // ===================== 2e · 4. Fonctions rationnelles =====================
  const EXR = [
    // Le coût moyen (fonction homographique en situation)
    () => { const F = pk([400, 600, 900, 1200]), c = pk([3, 4, 5, 8]), d = pk([1, 2, 3]), x1 = pk([50, 100]), x2 = pk([200, 300]), xs = F / d, mq = c + pk([0.5, 2.5]), xq = F / (mq - c);
      return X({ id: "homog", lv: 1, titre: "Le coût moyen",
        q: "Un artisan fabrique des tasses. Ses frais fixes sont de " + Q(F, "CHF") + " par mois et chaque tasse lui coûte " + Q(c, "CHF") + " de matière. Le coût moyen d'une tasse, quand il en fabrique " + M("x") + ", est " + M("m(x) = \\frac{" + F + " + " + c + "x}{x}") + ".",
        parts: [{ label: "Calcule " + M("m(" + x1 + ")") + " et " + M("m(" + x2 + ")") + ". Interprète.", pts: 1 }, { label: "Quelle est l'asymptote horizontale du graphe de " + M("m") + " ? Que signifie-t-elle pour l'artisan ?", pts: 2 }, { label: "Combien de tasses doit-il fabriquer pour que le coût moyen soit au plus de " + Q(c + d, "CHF") + " ?", pts: 1 }, { label: "Exprime " + M("x") + " en fonction de " + M("m") + " (fonction réciproque), puis calcule " + M("x") + " pour un coût moyen de " + Q(mq, "CHF") + ".", pts: 2 }],
        sol: ul([M("m(" + x1 + ") = " + N(c + F / x1)) + " CHF, " + M("m(" + x2 + ") = " + N(c + F / x2)) + " CHF : plus il en fabrique, moins chaque tasse coûte.", M("m(x) = " + c + " + \\frac{" + F + "}{x}") + " : asymptote " + M("y = " + c) + ". Le coût moyen s'approche de " + c + " CHF (la matière) sans jamais l'atteindre.", M(c + " + \\frac{" + F + "}{x} \\le " + (c + d)) + " ⟺ " + M("x \\ge " + xs) + " tasses.", M("m = " + c + " + \\frac{" + F + "}{x}") + " ⟺ " + M("x = \\frac{" + F + "}{m - " + c + "}") + " ; " + M("x = \\frac{" + F + "}{" + N(mq - c) + "} = " + N(xq)) + " tasses."]),
        chk: [[c + F / x1, N(c + F / x1)], [F / d, String(xs)], [F / (mq - c), N(xq)]] }); },
    // Le cycliste (équation rationnelle)
    () => { const [v, dv, dt, d] = pk([[20, 5, 1, 100], [15, 5, 1, 60], [24, 6, 1, 120], [30, 10, 0.5, 60], [40, 10, 0.5, 100]]), o = -v - dv;
      return X({ id: "probrat", lv: 2, titre: "Le cycliste",
        q: "Un cycliste parcourt " + Q(d, "km") + ". S'il roulait " + Q(dv, "km/h") + " plus vite, il mettrait " + (dt === 1 ? "1 heure" : "30 minutes") + " de moins. On note " + M("v") + " sa vitesse (km/h).",
        parts: [{ label: "Exprime la durée du trajet en fonction de " + M("v") + " dans les deux cas, puis écris une équation.", pts: 2 }, { label: "Quelles sont les valeurs interdites ?", pts: 1 }, { label: "Résous l'équation et conclus.", pts: 2 }],
        sol: ul(["Durées " + M("\\frac{" + d + "}{v}") + " et " + M("\\frac{" + d + "}{v + " + dv + "}") + " ; " + M("\\frac{" + d + "}{v} - \\frac{" + d + "}{v + " + dv + "} = " + N(dt)) + ".", M("v \\neq 0") + " et " + M("v \\neq -" + dv) + ".", "On multiplie par " + M("v(v + " + dv + ")") + " : " + M(d * dv + " = " + N(dt) + "v(v + " + dv + ")") + ", soit " + M(poly([dt, dt * dv, -d * dv], "v") + " = 0") + " ; " + M("v = " + v) + " ou " + M("v = " + o) + " (négative, rejetée). Il roule à " + v + " km/h et met " + M(N(d / v)) + " h."]),
        chk: [[d / v - d / (v + dv), N(dt)], [v + o, String(-dv)]] }); },
    // Équation rationnelle, fraction à étages, simplification
    () => { const a = pk([2, 3, 4, 5]);
      return X({ id: "eqrat", lv: 2, titre: "Une solution de trop",
        q: "Soit " + M("a = " + a) + ". On considère l'équation " + M("\\frac{x}{x - " + a + "} + \\frac{" + a + "}{x + " + a + "} = \\frac{" + 2 * a * a + "}{x^2 - " + a * a + "}") + ".",
        parts: [{ label: "Donne les valeurs interdites.", pts: 1 }, { label: "Résous l'équation.", pts: 2 }, { label: "Simplifie " + M("\\frac{1 + \\frac{" + a + "}{x}}{1 - \\frac{" + a * a + "}{x^2}}") + " en précisant les conditions.", pts: 2 }, { label: "Simplifie " + M("\\frac{x^2 - " + a * a + "}{x^2 + " + a + "x}") + ".", pts: 1 }],
        sol: ul([M("x \\neq " + a) + " et " + M("x \\neq -" + a) + " (" + M("x^2 - " + a * a + " = (x - " + a + ")(x + " + a + ")") + ").", "Dénominateur commun : " + M("x(x + " + a + ") + " + a + "(x - " + a + ") = " + 2 * a * a) + " ⟺ " + M("x^2 + " + 2 * a + "x - " + 3 * a * a + " = 0") + " ⟺ " + M("(x - " + a + ")(x + " + 3 * a + ") = 0") + ". " + M("x = " + a) + " est interdite : " + M("S = \\{-" + 3 * a + "\\}") + ".", "On multiplie haut et bas par " + M("x^2") + " : " + M("\\frac{x^2 + " + a + "x}{x^2 - " + a * a + "} = \\frac{x(x + " + a + ")}{(x - " + a + ")(x + " + a + ")} = \\frac{x}{x - " + a + "}") + ", pour " + M("x \\neq 0") + ", " + M("x \\neq \\pm " + a) + ".", M("\\frac{(x - " + a + ")(x + " + a + ")}{x(x + " + a + ")} = \\frac{x - " + a + "}{x}") + " pour " + M("x \\neq 0") + ", " + M("x \\neq -" + a) + "."]),
        chk: [[-3 * a, String(-3 * a)], [-3 * a * (-3 * a + a) + a * (-3 * a - a), String(2 * a * a)]] }); },
    // Inéquation fractionnaire
    () => { let p, q; do { p = R.int(-4, 5); q = R.int(-3, 3); } while (p + q <= 0 || q === 0 || p === 0 || p + 2 * q === 0);
      const z = p + 2 * q;
      return X({ id: "ineqfrac", lv: 3, titre: "Une inéquation fractionnaire",
        q: "On veut résoudre " + M("\\frac{x" + sg(p) + "}{x" + sg(-q) + "} \\le 2") + ".",
        parts: [{ label: "Pourquoi ne peut-on pas simplement multiplier les deux membres par " + M("x" + sg(-q)) + " ?", pts: 1 }, { label: "Ramène l'inéquation à la forme " + M("\\frac{\\ldots}{\\ldots} \\le 0") + ".", pts: 1 }, { label: "Dresse le tableau de signes et donne l'ensemble des solutions.", pts: 2 }],
        sol: ul(["Son signe dépend de " + M("x") + " : s'il est négatif, le sens de l'inégalité change.", M("\\frac{x" + sg(p) + " - 2(x" + sg(-q) + ")}{x" + sg(-q) + "} = \\frac{" + lin(-1, z) + "}{x" + sg(-q) + "} \\le 0") + ".", "Le numérateur s'annule en " + M(z) + " (positif avant, négatif après), le dénominateur en " + M(q) + " (valeur interdite). " + M("S = \\,]-\\infty \\,;\\, " + q + "[ \\cup [" + z + " \\,;\\, +\\infty[") + "."]),
        chk: [[z, String(z)], [((z + 1 + p) / (z + 1 - q) <= 2 && (q - 0.5 + p) / (q - 0.5 - q) <= 2 && !((q + 0.5 + p) / (q + 0.5 - q) <= 2)) ? 1 : 0, "1"]] }); },
    // Fonction homographique et sa réciproque
    () => { let a, b, c, x1; do { a = pk([2, 3, -2]); c = pk([-3, -1, 2, 4]); b = R.int(-6, 6); x1 = R.int(-5, 5); } while (b === a * c || b === 0 || x1 === 0 || x1 === -c || (a * x1 + b) % (x1 + c) !== 0 || a * x1 + b === 0);
      const k = (a * x1 + b) / (x1 + c), f = (x) => (a * x + b) / (x + c);
      return X({ id: "homogrec", lv: 2, titre: "Fonction homographique",
        q: "Soit " + M("f(x) = \\frac{" + lin(a, b) + "}{x" + sg(c) + "}") + ".", fig: FIG.plot([{ f }], [], { numbers: true, xr: [-8, 8], yr: [-8, 8], step: 2, squash: 0.7, vlines: [-c] }),
        parts: [{ label: "Donne le domaine de " + M("f") + " et les équations des asymptotes.", pts: 2 }, { label: "Calcule le zéro de " + M("f") + " et son ordonnée à l'origine.", pts: 1 }, { label: "Détermine la fonction réciproque " + M("f^{-1}") + " et son domaine.", pts: 2 }, { label: "Pour quel " + M("x") + " a-t-on " + M("f(x) = " + k) + " ? Utilise " + M("f^{-1}") + ".", pts: 1 }],
        sol: ul([M("D = \\mathbb{R} \\setminus \\{" + -c + "\\}") + " ; asymptote verticale " + M("x = " + -c) + ", horizontale " + M("y = " + a) + " (quotient des coefficients de " + M("x") + ").", "Zéro " + M(FR(-b / a)) + " ; " + M("f(0) = " + FR(b / c)) + ".", M("y(x" + sg(c) + ") = " + lin(a, b)) + " ⟺ " + M("x(y" + sg(-a) + ") = " + lin(-c, b, "y")) + " : " + M("f^{-1}(x) = \\frac{" + lin(-c, b) + "}{x" + sg(-a) + "}") + ", domaine " + M("\\mathbb{R} \\setminus \\{" + a + "\\}") + ".", M("f^{-1}(" + k + ") = \\frac{" + (b - c * k) + "}{" + (k - a) + "} = " + x1) + "."]),
        chk: [[(b - c * k) / (k - a), String(x1)], [f((b - c * 7) / (7 - a)), "7", 1e-9]] }); },
  ];
  const RAISONR = [
    () => { const a = pk([2, 3, 4]), w = who();
      return X({ id: "eqrat", lv: 1, titre: "Trouve l'erreur",
        q: w + " résout " + M("\\frac{x^2}{x - " + a + "} = \\frac{" + a * a + "}{x - " + a + "}") + " : « " + M("x^2 = " + a * a) + ", donc " + M("S = \\{-" + a + " \\,;\\, " + a + "\\}") + " ».",
        parts: [{ label: "Quelle étape a été oubliée ?", pts: 1 }, { label: "Donne le bon ensemble des solutions.", pts: 1 }],
        sol: ul(["Les valeurs interdites : " + M("x \\neq " + a) + ".", M(a) + " est interdite : " + M("S = \\{-" + a + "\\}") + "."]),
        chk: [[-a, String(-a)]] }); },
    () => VF("fracrat", 2, [["« " + M("\\frac{x + 3}{x + 5} = \\frac{3}{5}") + " (on simplifie par " + M("x") + "). »", false, "On ne simplifie que des facteurs : pour " + M("x = 1") + ", " + M("\\frac{4}{6} \\neq \\frac{3}{5}") + "."],
      ["« " + M("\\frac{x^2 - 1}{x - 1} = x + 1") + " pour tout " + M("x") + ". »", false, "Seulement pour " + M("x \\neq 1") + " : en 1, la fraction n'est pas définie."],
      ["« La fonction " + M("f(x) = \\frac{2x + 1}{x - 3}") + " a pour asymptote horizontale " + M("y = 2") + ". »", true, M("f(x) = 2 + \\frac{7}{x - 3}") + " ; le second terme tend vers 0."],
      ["« Une fonction homographique est bijective de son domaine vers " + M("\\mathbb{R}") + ". »", false, "Elle n'atteint jamais la valeur de l'asymptote horizontale : vers " + M("\\mathbb{R}") + " privé de cette valeur."],
      ["« " + M("\\frac{1}{x} \\lt 1") + " équivaut à " + M("x > 1") + ". »", false, "Les nombres négatifs sont aussi solutions : " + M("S = \\,]-\\infty \\,;\\, 0[ \\cup \\,]1 \\,;\\, +\\infty[") + "."]]),
  ];

  RICH.cart2c = { ids: ["droites", "cart", "droitesinter", "cercle", "cercletan"], track: "col", label: "Équations cartésiennes", ex: EXC, raison: RAISONC, minutes: 45 };
  RICH.poly2c = { ids: ["ineq", "polydiv", "polyfact", "polyexpr"], track: "col", label: "Fonctions polynomiales", ex: EXP, raison: RAISONP, minutes: 45 };
  RICH.rat2c = { ids: ["ineqfrac", "valint", "fracrat", "fracetage", "eqrat", "probrat", "homog", "homogrec"], track: "col", label: "Fonctions rationnelles", ex: EXR, raison: RAISONR, minutes: 45 };
})();

// 2e Collège · 5. Exponentielles, 6. Composition et réciproque, 7. Logarithmes (23.11).
(function () {
  const { N, A, Q, pk, FR, lin, sg, par, X, ul, who, VF } = RX;
  const FRp = (v) => FR(v).replace(/\\frac\{(\d+)\}\{(\d+)\}/, "$1/$2");
  const lg = Math.log10;

  // ===================== 5. Exponentielles =====================
  const EXE = [
    // Le placement (intérêts composés, comparaison, doublement par essais)
    () => { const C0 = pk([2000, 5000, 8000, 10000]), t = pk([2, 2.5, 3, 4]), n = pk([5, 8, 10]), Cn = C0 * (1 + t / 100) ** n, Cs = C0 * (1 + (n * t) / 100), nd = Math.ceil(Math.log(2) / Math.log(1 + t / 100));
      return X({ id: "modexp", lv: 1, titre: "Le placement",
        q: "On place " + Q(C0, "CHF") + " à " + N(t).replace("{,}", ",") + " % d'intérêts composés par an (les intérêts s'ajoutent au capital chaque année).",
        parts: [{ label: "Exprime le capital " + M("C(n)") + " après " + M("n") + " années.", pts: 1 }, { label: "Calcule le capital après " + n + " ans (au centime).", pts: 1 }, { label: "Avec des intérêts simples (" + N(t).replace("{,}", ",") + " % du capital de départ chaque année), combien aurait-on après " + n + " ans ? Compare.", pts: 1 }, { label: "Par essais successifs, après combien d'années entières le capital aura-t-il doublé ?", pts: 2 }],
        sol: ul([M("C(n) = " + N(C0) + " \\cdot " + N(1 + t / 100) + "^n") + " (fonction exponentielle de base " + M(N(1 + t / 100)) + ").", M("C(" + n + ") \\approx " + A(Cn, 2)) + " CHF.", M(N(C0) + " + " + n + " \\cdot " + N((C0 * t) / 100) + " = " + N(Cs)) + " CHF : moins que les intérêts composés (les intérêts rapportent eux aussi des intérêts).", M("C(" + (nd - 1) + ") \\approx " + A(C0 * (1 + t / 100) ** (nd - 1), 2)) + " < " + N(2 * C0) + " et " + M("C(" + nd + ") \\approx " + A(C0 * (1 + t / 100) ** nd, 2)) + " ≥ " + N(2 * C0) + " : après " + nd + " ans."]),
        chk: [[Cn, A(Cn, 2), 0.01], [Cs, N(Cs)], [(1 + t / 100) ** nd >= 2 && (1 + t / 100) ** (nd - 1) < 2 ? nd : -1, String(nd)]] }); },
    // Le médicament (décroissance, modèle à partir de deux mesures)
    () => { const D0 = pk([400, 500, 800]), p = pk([20, 25, 30]), b = 1 - p / 100, t1 = 2, t2 = 4, q1 = D0 * b ** t1, q2 = D0 * b ** t2, h = pk([3, 5]), qh = D0 * b ** h;
      return X({ id: "modexp", lv: 2, titre: "Le médicament",
        q: "Après une injection, la quantité de médicament dans le sang diminue de façon exponentielle : " + M("Q(t) = Q_0 \\cdot b^t") + " (" + M("t") + " en heures). On mesure " + Q(q1, "mg") + " après " + t1 + " h et " + Q(q2, "mg") + " après " + t2 + " h.",
        parts: [{ label: "Calcule " + M("b") + " (indice : " + M("\\frac{Q(" + t2 + ")}{Q(" + t1 + ")}") + ").", pts: 2 }, { label: "Calcule la dose injectée " + M("Q_0") + ".", pts: 1 }, { label: "De quel pourcentage la quantité diminue-t-elle chaque heure ?", pts: 1 }, { label: "Quelle quantité reste-t-il après " + h + " h (au dixième de mg) ?", pts: 1 }],
        sol: ul([M("\\frac{Q_0 b^{" + t2 + "}}{Q_0 b^{" + t1 + "}} = b^2 = \\frac{" + N(q2) + "}{" + N(q1) + "} = " + N(b * b)) + ", d'où " + M("b = " + N(b)) + " (" + M("b > 0") + ").", M("Q_0 = \\frac{" + N(q1) + "}{" + N(b) + "^2} = " + N(D0)) + " mg.", M("1 - " + N(b) + " = " + N(p / 100)) + " : " + p + " % par heure.", M("Q(" + h + ") = " + D0 + " \\cdot " + N(b) + "^{" + h + "} \\approx " + A(qh, 1)) + " mg."]),
        chk: [[Math.sqrt(q2 / q1), N(b)], [q1 / (b * b), String(D0)], [qh, A(qh, 1), 0.1]] }); },
    // Exposants fractionnaires
    () => { const [base, e] = pk([[8, 3], [27, 3], [16, 4], [32, 5]]), r = Math.round(base ** (1 / e)), k = pk([2, 3]), m = pk([2, 3]), n = pk([2, 5]);
      return X({ id: "expfrac", lv: 2, titre: "Exposants fractionnaires",
        q: "Sans calculatrice.",
        parts: [{ label: "Calcule " + M(base + "^{\\frac{" + k + "}{" + e + "}}") + " et " + M(base + "^{-\\frac{1}{" + e + "}}") + ".", pts: 2 }, { label: "Écris " + M("\\sqrt[" + n + "]{x^{" + m + "}} \\cdot \\sqrt{x}") + " sous la forme " + M("x^r") + " (" + M("x > 0") + ").", pts: 1 }, { label: "Résous " + M(r + "^x = " + base + "\\sqrt{" + r + "}") + ".", pts: 2 }],
        sol: ul([M(base + "^{\\frac{" + k + "}{" + e + "}} = (\\sqrt[" + e + "]{" + base + "})^{" + k + "} = " + r + "^{" + k + "} = " + r ** k) + " ; " + M(base + "^{-\\frac{1}{" + e + "}} = \\frac{1}{" + r + "}") + ".", M("x^{\\frac{" + m + "}{" + n + "}} \\cdot x^{\\frac{1}{2}} = x^{" + FR(m / n + 0.5) + "}") + ".", M(base + "\\sqrt{" + r + "} = " + r + "^{" + e + "} \\cdot " + r + "^{\\frac{1}{2}} = " + r + "^{" + FR(e + 0.5) + "}") + " : " + M("x = " + FR(e + 0.5)) + "."]),
        chk: [[base ** (k / e), String(r ** k), 1e-9], [m / n + 0.5, FRp(m / n + 0.5)], [Math.log(base * Math.sqrt(r)) / Math.log(r), FRp(e + 0.5), 1e-9]] }); },
    // Lecture du graphe d'une exponentielle
    () => { const a = pk([1, 2, 3]), b = pk([2, 3, 0.5]), f = (x) => a * b ** x, x3 = b > 1 ? 3 : -3, y3 = f(x3);
      return X({ id: "expo", lv: 2, titre: "Lire une exponentielle",
        q: "Le graphe ci-dessous est celui de " + M("f(x) = a \\cdot b^x") + ". Il passe par deux points à coordonnées entières, en " + M("x = 0") + " et en " + M("x = 1") + ".", fig: FIG.plot([{ f }], [[0, a, ""], [1, f(1), ""]], { numbers: true, xr: [-4, 4], yr: [-1, 8], squash: 0.8 }),
        parts: [{ label: "Lis " + M("a") + " et " + M("b") + ". La fonction est-elle croissante ou décroissante ?", pts: 2 }, { label: "Quelle est l'asymptote du graphe ?", pts: 1 }, { label: "Résous " + M("f(x) = " + N(y3)) + " sans calculatrice.", pts: 1 }, { label: "Donne l'expression de la fonction dont le graphe est le symétrique de celui de " + M("f") + " par rapport à l'axe des ordonnées.", pts: 1 }],
        sol: ul([M("f(0) = a = " + a) + ", " + M("f(1) = ab = " + N(f(1))) + " : " + M("b = " + N(b)) + " ; " + (b > 1 ? "croissante (" + M("b > 1") + ")." : "décroissante (" + M("0 \\lt b \\lt 1") + ")."), "L'axe des abscisses " + M("y = 0") + " (du côté " + (b > 1 ? "gauche" : "droit") + ").", M(a + " \\cdot " + N(b) + "^x = " + N(y3)) + " ⟺ " + M(N(b) + "^x = " + N(y3 / a)) + " ⟺ " + M("x = " + x3) + ".", M("g(x) = f(-x) = " + a + " \\cdot \\left(" + FR(1 / b) + "\\right)^x") + "."]),
        chk: [[f(x3), N(y3)], [1 / b, FRp(1 / b)]] }); },
  ];
  const RAISONE = [
    () => { const a = pk([2, 3, 5]), b = pk([3, 4, 7]), x = pk([2, 3]), w = who();
      return X({ id: "expo", lv: 1, titre: "Trouve l'erreur",
        q: w + " écrit : « " + M(a + " \\cdot " + b + "^x = " + a * b + "^x") + " ».",
        parts: [{ label: "Teste avec " + M("x = " + x) + ".", pts: 1 }, { label: "Explique l'erreur.", pts: 1 }],
        sol: ul([M(a + " \\cdot " + b + "^" + x + " = " + a * b ** x) + " mais " + M(a * b + "^" + x + " = " + (a * b) ** x) + ".", "L'exposant ne porte que sur " + b + ", pas sur le facteur " + a + "."]),
        chk: [[a * b ** x, String(a * b ** x)]] }); },
    () => VF("expo", 1, [["« " + M("f(x) = \\left(\\frac{1}{2}\\right)^x") + " est décroissante. »", true, "Base entre 0 et 1."],
      ["« " + M("2^x") + " peut être négatif. »", false, "Une exponentielle de base positive est toujours strictement positive."],
      ["« Deux hausses de 5 % font une hausse de 10 %. »", false, M("1{,}05^2 = 1{,}1025") + " : 10,25 %."],
      ["« " + M("8^{\\frac{1}{3}} = 2") + ". »", true, M("2^3 = 8") + "."],
      ["« " + M("a^0 = 1") + " pour tout " + M("a > 0") + ". »", true, M("a^0 = \\frac{a^n}{a^n} = 1") + "."],
      ["« Le graphe de " + M("3^x") + " coupe l'axe des abscisses. »", false, "Il s'en approche sans jamais l'atteindre (asymptote)."]]),
  ];

  // ===================== 6. Composition et réciproque =====================
  const EXF = [
    // Composer
    () => { let a, b, c, x1, v; do { a = pk([2, 3, -2]); b = pk([-3, -1, 1, 4]); c = pk([-4, -1, 2, 5]); x1 = pk([-2, 2, 3]); v = pk([1, 2, 3]); } while ((a * x1 + b) ** 2 + c === 0 || a * (x1 * x1 + c) + b === 0 || a * c + b === 0 || v * v + c === 0 || v === b || v === -b || a * x1 + b === 0 || x1 * x1 + c === 0);
      const gf = (x) => (a * x + b) ** 2 + c, fg = (x) => a * (x * x + c) + b, target = v * v + c, s1 = (v - b) / a, s2 = (-v - b) / a;
      return X({ id: "compo", lv: 1, titre: "Composer deux fonctions",
        q: "Soit " + M("f(x) = " + lin(a, b)) + " et " + M("g(x) = x^2" + sg(c)) + ".",
        parts: [{ label: "Calcule " + M("(g \\circ f)(" + x1 + ")") + " et " + M("(f \\circ g)(" + x1 + ")") + ".", pts: 1 }, { label: "Donne les expressions de " + M("(g \\circ f)(x)") + " et " + M("(f \\circ g)(x)") + ". La composition est-elle commutative ?", pts: 2 }, { label: "Résous " + M("(g \\circ f)(x) = " + target) + ".", pts: 2 }],
        sol: ul([M("f(" + x1 + ") = " + (a * x1 + b)) + ", " + M("g(" + (a * x1 + b) + ") = " + gf(x1)) + " ; " + M("g(" + x1 + ") = " + (x1 * x1 + c)) + ", " + M("f(" + (x1 * x1 + c) + ") = " + fg(x1)) + ".", M("(g \\circ f)(x) = (" + lin(a, b) + ")^2" + sg(c)) + " ; " + M("(f \\circ g)(x) = " + a + "(x^2" + sg(c) + ")" + sg(b) + " = " + a + "x^2" + sg(a * c + b)) + ". Non : les résultats diffèrent.", M("(" + lin(a, b) + ")^2 = " + v * v) + " ⟺ " + M(lin(a, b) + " = \\pm " + v) + " : " + M("x = " + FR(s1)) + " ou " + M("x = " + FR(s2)) + "."]),
        chk: [[gf(x1), String(gf(x1))], [fg(x1), String(fg(x1))], [gf(s1), String(target), 1e-9], [s2, FRp(s2)]] }); },
    // Décomposer et domaine
    () => { const a = pk([2, 3, 4]), b = pk([-8, -6, 6]), c = pk([1, 2, 5]), x0 = -b / a, xv = pk([5, 6, 7]), val = Math.sqrt(a * xv + b) - c;
      return X({ id: "decomp", lv: 2, titre: "Décomposer une fonction",
        q: "Soit " + M("h(x) = \\sqrt{" + lin(a, b) + "}" + sg(-c)) + ".",
        parts: [{ label: "Écris " + M("h") + " comme composée de deux fonctions " + M("f") + " et " + M("g") + " : " + M("h = g \\circ f") + ".", pts: 1 }, { label: "Détermine le domaine de " + M("h") + ".", pts: 1 }, { label: "Calcule " + M("h(" + xv + ")") + " (au centième).", pts: 1 }, { label: "Pour quel " + M("x") + " a-t-on " + M("h(x) = " + (2 * c)) + " ?", pts: 2 }],
        sol: ul(["Par exemple " + M("f(x) = " + lin(a, b)) + " puis " + M("g(x) = \\sqrt{x}" + sg(-c)) + " (on calcule d'abord " + M(lin(a, b)) + ").", M(lin(a, b) + " \\ge 0") + " ⟺ " + M("x \\ge " + FR(x0)) + " : " + M("D = [" + FR(x0) + " \\,;\\, +\\infty[") + ".", M("h(" + xv + ") = \\sqrt{" + (a * xv + b) + "}" + sg(-c) + " \\approx " + A(val, 2)) + ".", M("\\sqrt{" + lin(a, b) + "} = " + 3 * c) + " ⟺ " + M(lin(a, b) + " = " + 9 * c * c) + " ⟺ " + M("x = " + FR((9 * c * c - b) / a)) + " (dans le domaine)."]),
        chk: [[val, A(val, 2), 0.01], [(9 * c * c - b) / a, FRp((9 * c * c - b) / a)]] }); },
    // Le parking (fonction définie par morceaux)
    () => { const g = pk([0.5, 1]), p1 = pk([2, 3]), p2 = pk([1.5, 2]), f = (t) => (t <= g ? 0 : t <= 3 ? p1 * (t - g) : p1 * (3 - g) + p2 * (t - 3)), tq = pk([2, 2.5]), tr = pk([5, 6]), pay = f(tr);
      return X({ id: "morceaux", lv: 2, titre: "Le tarif du parking",
        q: "Un parking est gratuit pendant " + (g === 1 ? "la première heure" : "la première demi-heure") + ". Ensuite, il coûte " + Q(p1, "CHF") + " par heure jusqu'à 3 h de stationnement, puis " + Q(p2, "CHF") + " par heure au-delà (tarif proportionnel au temps).",
        parts: [{ label: "Écris le prix " + M("P(t)") + " (" + M("t") + " en heures) comme fonction définie par morceaux.", pts: 2 }, { label: "Calcule " + M("P(" + N(tq) + ")") + " et " + M("P(" + tr + ")") + ".", pts: 1 }, { label: "La fonction est-elle continue en " + M("t = 3") + " ? Justifie.", pts: 1 }, { label: "Un automobiliste a payé " + Q(pay, "CHF") + ". Combien de temps est-il resté ?", pts: 1 }],
        sol: ul([M("P(t) = 0") + " si " + M("0 \\le t \\le " + N(g)) + " ; " + M(p1 + "(t - " + N(g) + ")") + " si " + M(N(g) + " \\lt t \\le 3") + " ; " + M(N(p1 * (3 - g)) + " + " + N(p2) + "(t - 3)") + " si " + M("t > 3") + ".", M("P(" + N(tq) + ") = " + N(f(tq))) + " CHF ; " + M("P(" + tr + ") = " + N(pay)) + " CHF.", "Oui : les deux morceaux donnent " + M(N(p1 * (3 - g))) + " en " + M("t = 3") + ".", "Plus que " + N(p1 * (3 - g)) + " CHF, donc " + M("t > 3") + " : " + M(N(p1 * (3 - g)) + " + " + N(p2) + "(t - 3) = " + N(pay)) + ", " + M("t = " + tr) + " h."]),
        chk: [[f(tq), N(f(tq))], [3 + (pay - p1 * (3 - g)) / p2, String(tr)]] }); },
    // Tolérance de fabrication (valeur absolue)
    () => { const L = pk([40, 50, 80]), e = pk([0.2, 0.5]), m = pk([0.3, 0.6, 0.1]), vals = [L - 0.7, L + e, L - m, L + 0.05].map((v) => Math.round(v * 100) / 100);
      return X({ id: "absval", lv: 2, titre: "La pièce usinée",
        q: "Une pièce doit mesurer " + Q(L, "mm") + " avec une tolérance de " + Q(e, "mm") + " : sa longueur " + M("x") + " doit vérifier " + M("|x - " + L + "| \\le " + N(e)) + ".",
        parts: [{ label: "Écris cette condition sous forme d'intervalle.", pts: 1 }, { label: "Les pièces mesurant " + vals.map((v) => Q(v, "mm")).join(", ") + " sont-elles acceptées ?", pts: 2 }, { label: "Résous " + M("|2x - " + 2 * L + "| = " + N(3 * e)) + " et interprète.", pts: 2 }],
        sol: ul([M("-" + N(e) + " \\le x - " + L + " \\le " + N(e)) + " ⟺ " + M("x \\in [" + N(L - e) + " \\,;\\, " + N(L + e) + "]") + ".", vals.map((v) => N(v).replace("{,}", ",") + (Math.abs(v - L) <= e + 1e-9 ? " oui" : " non")).join(" ; ") + " (on compare l'écart " + M("|x - " + L + "|") + " à " + N(e).replace("{,}", ",") + ").", M("|2x - " + 2 * L + "| = 2|x - " + L + "| = " + N(3 * e)) + " ⟺ " + M("|x - " + L + "| = " + N(1.5 * e)) + " : " + M("x = " + N(L - 1.5 * e)) + " ou " + M("x = " + N(L + 1.5 * e)) + " ; deux pièces à " + N(1.5 * e).replace("{,}", ",") + " mm de la cote, refusées."]),
        chk: [[L + 1.5 * e, N(L + 1.5 * e)], [L - e, N(L - e)]] }); },
    // Réciproque d'une restriction
    () => { let a, b, y1, x1; do { a = pk([-2, 1, 2, 3]); b = pk([-4, -1, 3, 5]); y1 = b + pk([4, 9, 16]); x1 = a + Math.sqrt(y1 - b); } while (x1 === 0 || y1 === 0 || b === -1);
      return X({ id: "recip", lv: 3, titre: "Restreindre pour inverser",
        q: "Soit " + M("f(x) = (x" + sg(-a) + ")^2" + sg(b)) + ".",
        parts: [{ label: "Montre que " + M("f") + " n'est pas injective sur " + M("\\mathbb{R}") + " (donne deux nombres qui ont la même image).", pts: 1 }, { label: "Sur quel intervalle " + M("[a \\,;\\, +\\infty[") + " la fonction est-elle bijective vers " + M("[" + b + " \\,;\\, +\\infty[") + " ?", pts: 1 }, { label: "Détermine la réciproque de cette restriction.", pts: 2 }, { label: "Calcule " + M("f^{-1}(" + y1 + ")") + " et vérifie.", pts: 1 }],
        sol: ul([M("f(" + (a - 1) + ") = f(" + (a + 1) + ") = " + (1 + b)) + " (symétrie par rapport à " + M("x = " + a) + ").", "Sur " + M("[" + a + " \\,;\\, +\\infty[") + " (à droite du sommet " + M("(" + a + " \\,;\\, " + b + ")") + "), " + M("f") + " est strictement croissante.", M("y = (x" + sg(-a) + ")^2" + sg(b)) + " ⟺ " + M("x" + sg(-a) + " = \\sqrt{y" + sg(-b) + "}") + " (racine positive car " + M("x \\ge " + a) + ") : " + M("f^{-1}(x) = " + a + " + \\sqrt{x" + sg(-b) + "}") + ", pour " + M("x \\ge " + b) + ".", M("f^{-1}(" + y1 + ") = " + a + " + \\sqrt{" + (y1 - b) + "} = " + x1) + " ; " + M("f(" + x1 + ") = " + (x1 - a) ** 2 + sg(b) + " = " + y1) + " ✓."]),
        chk: [[x1, String(x1)], [(x1 - a) ** 2 + b, String(y1)]] }); },
  ];
  const RAISONF = [
    () => { const w = who(), x = pk([2, 3]);
      return X({ id: "compo", lv: 1, titre: "Trouve l'erreur",
        q: "Avec " + M("f(x) = x + 1") + " et " + M("g(x) = x^2") + ", " + w + " écrit : « " + M("(g \\circ f)(x) = g(x) \\cdot f(x) = x^3 + x^2") + " ».",
        parts: [{ label: "Calcule " + M("(g \\circ f)(" + x + ")") + " directement et avec la formule de " + w + ".", pts: 1 }, { label: "Donne la bonne expression.", pts: 1 }],
        sol: ul([M("g(f(" + x + ")) = g(" + (x + 1) + ") = " + (x + 1) ** 2) + ", mais " + M(x + "^3 + " + x + "^2 = " + (x ** 3 + x * x)) + ".", "Composer, c'est appliquer " + M("g") + " au résultat de " + M("f") + " : " + M("(g \\circ f)(x) = (x + 1)^2") + "."]),
        chk: [[(x + 1) ** 2, String((x + 1) ** 2)]] }); },
    () => VF("bijection", 2, [["« " + M("|a + b| = |a| + |b|") + " pour tous réels " + M("a, b") + ". »", false, M("|3 + (-3)| = 0 \\neq 6") + "."],
      ["« " + M("f(x) = x^2") + " est injective sur " + M("\\mathbb{R}") + ". »", false, M("f(-2) = f(2)") + "."],
      ["« " + M("(f \\circ f^{-1})(x) = x") + " pour tout " + M("x") + " du domaine de " + M("f^{-1}") + ". »", true, "C'est la définition de la réciproque."],
      ["« Le graphe de " + M("f^{-1}") + " est le symétrique de celui de " + M("f") + " par rapport à la droite " + M("y = x") + ". »", true, "On échange les coordonnées de chaque point."],
      ["« " + M("|-x| = x") + " pour tout réel " + M("x") + ". »", false, "Pour " + M("x = -3") + " : " + M("|3| = 3 \\neq -3") + "."],
      ["« Une fonction strictement croissante sur un intervalle y est injective. »", true, "Deux nombres différents ont des images différentes."]]),
  ];

  // ===================== 7. Logarithmes =====================
  const EXL = [
    // Doubler un placement
    () => { const t = pk([2, 3, 4, 5]), C0 = pk([3000, 5000]), S = pk([8000, 10000]), n2 = Math.log(2) / Math.log(1 + t / 100), nS = Math.log(S / C0) / Math.log(1 + t / 100);
      return X({ id: "log", lv: 1, titre: "Quand le capital double-t-il ?",
        q: "Un capital de " + Q(C0, "CHF") + " est placé à " + t + " % d'intérêts composés : " + M("C(n) = " + N(C0) + " \\cdot " + N(1 + t / 100) + "^n") + ".",
        parts: [{ label: "Écris l'équation qui donne le temps de doublement et résous-la avec les logarithmes (au centième).", pts: 2 }, { label: "Le temps de doublement dépend-il du capital de départ ? Justifie.", pts: 1 }, { label: "Après combien d'années entières le capital dépasse-t-il " + Q(S, "CHF") + " ?", pts: 2 }],
        sol: ul([M(N(C0) + " \\cdot " + N(1 + t / 100) + "^n = " + N(2 * C0)) + " ⟺ " + M(N(1 + t / 100) + "^n = 2") + " ⟺ " + M("n = \\frac{\\log 2}{\\log " + N(1 + t / 100) + "} \\approx " + A(n2, 2)) + " ans.", "Non : " + M("C_0") + " se simplifie, il reste " + M(N(1 + t / 100) + "^n = 2") + ".", M("n > \\frac{\\log(" + N(S) + " : " + N(C0) + ")}{\\log " + N(1 + t / 100) + "} \\approx " + A(nS, 2)) + " : après " + Math.ceil(nS) + " ans."]),
        chk: [[n2, A(n2, 2), 0.01], [Math.ceil(nS), String(Math.ceil(nS))]] }); },
    // Les décibels
    () => { const L1 = pk([60, 70, 80]), k = pk([2, 4, 10]), dL = pk([20, 30]), add = 10 * lg(k);
      return X({ id: "log", lv: 2, titre: "Les décibels",
        q: "Le niveau sonore (en dB) d'un son d'intensité " + M("I") + " est " + M("L = 10 \\log\\left(\\frac{I}{I_0}\\right)") + ", où " + M("I_0 = 10^{-12}") + " W/m² est le seuil d'audition. Une tondeuse produit " + Q(L1, "dB") + ".",
        parts: [{ label: "Calcule l'intensité " + M("I") + " de la tondeuse.", pts: 1 }, { label: "Quel est le niveau sonore de " + k + " tondeuses identiques ensemble (au dixième de dB) ?", pts: 2 }, { label: "Par combien l'intensité est-elle multipliée quand le niveau augmente de " + dL + " dB ?", pts: 1 }],
        sol: ul([M("\\log\\left(\\frac{I}{I_0}\\right) = " + L1 / 10) + " ⟺ " + M("I = 10^{" + L1 / 10 + "} \\cdot 10^{-12} = 10^{" + (L1 / 10 - 12) + "}") + " W/m².", M("10 \\log\\left(\\frac{" + k + "I}{I_0}\\right) = 10\\log " + k + " + " + L1 + " \\approx " + A(L1 + add, 1)) + " dB (et non " + k * L1 + " dB !).", M("10^{" + dL / 10 + "} = " + N(10 ** (dL / 10))) + " : l'intensité est multipliée par " + N(10 ** (dL / 10)).replace(/\\text\{'\}/g, "'") + "."]),
        chk: [[L1 + add, A(L1 + add, 1), 0.1], [10 ** (dL / 10), String(10 ** (dL / 10))]] }); },
    // Équation logarithmique, changement de base
    () => { const [x0, d, k] = pk([[4, 2, 3], [8, 4, 5], [4, 3, 2], [8, 6, 4], [16, 8, 7]]), c = pk([5, 7, 20, 40]), b = pk([2, 3]), sol = Math.log(c) / Math.log(b), m = pk([48, 80, 24]);
      return X({ id: "logbase", lv: 2, titre: "Équations et changement de base",
        q: "Résous ou calcule.",
        parts: [{ label: M("\\log_2(x) + \\log_2(x - " + d + ") = " + k) + " (attention au domaine).", pts: 2 }, { label: M(b + "^x = " + c) + " (au millième).", pts: 1 }, { label: "Calcule " + M("\\log_2(" + m + ")") + " avec le changement de base (au millième), puis vérifie qu'il est entre deux entiers que tu préciseras.", pts: 2 }],
        sol: ul(["Domaine " + M("x > " + d) + ". " + M("\\log_2(x(x - " + d + ")) = " + k) + " ⟺ " + M("x^2 - " + d + "x - " + 2 ** k + " = 0") + " ⟺ " + M("x = " + x0) + " ou " + M("x = " + (d - x0)) + " (hors du domaine) : " + M("S = \\{" + x0 + "\\}") + ".", M("x = \\frac{\\log " + c + "}{\\log " + b + "} \\approx " + A(sol, 3)) + ".", M("\\log_2(" + m + ") = \\frac{\\log " + m + "}{\\log 2} \\approx " + A(Math.log2(m), 3)) + " ; " + M("2^{" + Math.floor(Math.log2(m)) + "} = " + 2 ** Math.floor(Math.log2(m)) + " \\lt " + m + " \\lt " + 2 ** Math.ceil(Math.log2(m)) + " = 2^{" + Math.ceil(Math.log2(m)) + "}") + "."]),
        chk: [[x0, String(x0)], [x0 * (x0 - d), String(2 ** k)], [sol, A(sol, 3), 0.001], [Math.log2(m), A(Math.log2(m), 3), 0.001]] }); },
    // Le pH
    () => { const c1 = pk([2, 3, 5]), e1 = pk([3, 4, 5]), H = c1 * 10 ** -e1, ph = -lg(H), ph2 = pk([2.5, 3.5, 6.2]), H2 = 10 ** -ph2, f = pk([10, 100]);
      return X({ id: "log", lv: 2, titre: "Le pH d'une solution",
        q: "Le pH d'une solution est " + M("\\text{pH} = -\\log[\\text{H}^+]") + ", où " + M("[\\text{H}^+]") + " est la concentration en ions hydrogène (mol/L).",
        parts: [{ label: "Calcule le pH d'une solution où " + M("[\\text{H}^+] = " + c1 + " \\cdot 10^{-" + e1 + "}") + " (au centième).", pts: 1 }, { label: "Une boisson a un pH de " + N(ph2).replace("{,}", ",") + ". Calcule sa concentration (notation scientifique, 3 chiffres significatifs).", pts: 2 }, { label: "On dilue une solution " + f + " fois (la concentration est divisée par " + f + "). Comment varie le pH ? Justifie avec une propriété du logarithme.", pts: 1 }],
        sol: ul([M("-\\log(" + c1 + " \\cdot 10^{-" + e1 + "}) = " + e1 + " - \\log " + c1 + " \\approx " + A(ph, 2)) + ".", M("[\\text{H}^+] = 10^{-" + N(ph2) + "} \\approx " + A(H2 * 10 ** Math.ceil(ph2), 2) + " \\cdot 10^{-" + Math.ceil(ph2) + "}") + " mol/L.", M("-\\log\\left(\\frac{c}{" + f + "}\\right) = -\\log c + \\log " + f + " = \\text{pH} + " + lg(f)) + " : le pH augmente de " + lg(f) + "."]),
        chk: [[ph, A(ph, 2), 0.01], [H2 * 10 ** Math.ceil(ph2), A(H2 * 10 ** Math.ceil(ph2), 2), 0.01]] }); },
  ];
  const RAISONL = [
    () => { const a = pk([2, 5]), b = pk([3, 8]), w = who();
      return X({ id: "log", lv: 1, titre: "Trouve l'erreur",
        q: w + " écrit : « " + M("\\log(" + a + " + " + b + ") = \\log " + a + " + \\log " + b) + " ».",
        parts: [{ label: "Compare les deux membres avec la calculatrice (au millième).", pts: 1 }, { label: "Quelle propriété " + w + " a-t-" + (["Lina", "Inès", "Mia", "Elsa"].includes(w) ? "elle" : "il") + " déformée ?", pts: 1 }],
        sol: ul([M("\\log " + (a + b) + " \\approx " + A(lg(a + b), 3)) + " mais " + M("\\log " + a + " + \\log " + b + " = \\log " + a * b + " \\approx " + A(lg(a * b), 3)) + ".", "La propriété concerne le produit : " + M("\\log(ab) = \\log a + \\log b") + ". Il n'y a pas de règle pour " + M("\\log(a + b)") + "."]),
        chk: [[lg(a * b), A(lg(a * b), 3), 0.001]] }); },
    () => VF("logbase", 2, [["« " + M("\\log 100 = 2") + ". »", true, M("10^2 = 100") + "."],
      ["« " + M("\\log(-10) = -1") + ". »", false, "Le logarithme n'est défini que pour les nombres strictement positifs."],
      ["« " + M("\\log_2 8 = 3") + ". »", true, M("2^3 = 8") + "."],
      ["« " + M("\\frac{\\log a}{\\log b} = \\log(a - b)") + ". »", false, "C'est " + M("\\log_b a") + " (changement de base)."],
      ["« " + M("\\log(x^3) = 3\\log x") + " pour " + M("x > 0") + ". »", true, "Propriété de la puissance."],
      ["« La fonction " + M("\\log") + " est la réciproque de " + M("10^x") + ". »", true, M("10^{\\log x} = x") + " et " + M("\\log(10^x) = x") + "."]]),
  ];

  RICH.exp2c = { ids: ["expo", "expfrac", "modexp"], track: "col", label: "Exponentielles", ex: EXE, raison: RAISONE, minutes: 45 };
  RICH.compo2c = { ids: ["absval", "morceaux", "compo", "decomp", "bijection", "recip"], track: "col", label: "Composition et réciproque", ex: EXF, raison: RAISONF, minutes: 45 };
  RICH.log2c = { ids: ["log", "logbase"], track: "col", label: "Logarithmes", ex: EXL, raison: RAISONL, minutes: 45 };
})();

// 2e Collège · 8. Triangle quelconque, 9. Fonctions trigonométriques, Géométrie vectorielle (23.11).
(function () {
  const { N, A, Q, pk, FR, sg, par, X, ul, who, VF, D } = RX;
  const FRp = (v) => FR(v).replace(/\\frac\{(\d+)\}\{(\d+)\}/, "$1/$2");
  const pt = (x, y) => "(" + FR(x) + " \\,;\\, " + FR(y) + ")";
  const sh = (x, v) => (Math.abs(v) < 1e-12 ? x : "(" + x + sg(-v) + ")"); // (x - v), ou x si v = 0
  const vec = (x, y) => "\\begin{pmatrix} " + FR(x) + " \\\\ " + FR(y) + " \\end{pmatrix}";
  const sq = (n) => { let k = 1; for (let d = 2; d * d <= n; d++) while (n % (d * d) === 0) { n /= d * d; k *= d; } return n === 1 ? [String(k), String(k)] : [(k === 1 ? "" : k) + "\\sqrt{" + n + "}", (k === 1 ? "" : k) + "√" + n]; };

  // ===================== 8. Trigonométrie du triangle quelconque =====================
  const EXT = [
    // Trois côtés connus
    () => { let a, b, c; do { a = R.int(5, 14); b = R.int(5, 14); c = R.int(5, 14); } while (a + b <= c + 2 || a + c <= b + 2 || b + c <= a + 2 || new Set([a, b, c]).size < 3);
      const M3 = Math.max(a, b, c), [p, q] = [a, b, c].filter((x) => x !== M3), gm = Math.acos((p * p + q * q - M3 * M3) / (2 * p * q)) / D, S = 0.5 * p * q * Math.sin(gm * D), s = (a + b + c) / 2, H = Math.sqrt(s * (s - a) * (s - b) * (s - c));
      return X({ id: "sinlaw", lv: 1, titre: "Un triangle de côtés connus",
        q: "Un triangle a des côtés de " + Q(a, "cm") + ", " + Q(b, "cm") + " et " + Q(c, "cm") + ".",
        parts: [{ label: "Calcule son plus grand angle (au centième de degré). Le triangle est-il obtusangle ?", pts: 2 }, { label: "Calcule son aire (au centième de cm²).", pts: 1 }, { label: "Vérifie l'aire avec la formule de Héron " + M("\\mathcal{A} = \\sqrt{s(s - a)(s - b)(s - c)}") + ", " + M("s") + " étant le demi-périmètre.", pts: 1 }],
        sol: ul(["Il est opposé au plus grand côté (" + M3 + ") : " + M("\\cos\\gamma = \\frac{" + p + "^2 + " + q + "^2 - " + M3 + "^2}{2 \\cdot " + p + " \\cdot " + q + "}") + ", " + M("\\gamma \\approx " + A(gm, 2) + "°") + (gm > 90 ? " : obtusangle." : " : le triangle est acutangle (plus grand angle aigu)."), M("\\mathcal{A} = \\frac{1}{2} \\cdot " + p + " \\cdot " + q + " \\cdot \\sin\\gamma \\approx " + A(S, 2)) + " cm².", M("s = " + N(s)) + " ; " + M("\\sqrt{" + N(s) + " \\cdot " + N(s - a) + " \\cdot " + N(s - b) + " \\cdot " + N(s - c) + "} \\approx " + A(H, 2)) + " ✓."]),
        chk: [[gm, A(gm, 2), 0.01], [S, A(S, 2), 0.01], [H, A(S, 2), 0.01]] }); },
    // La tour inaccessible
    () => { const al = R.int(20, 32), be = al + R.int(12, 25), d = pk([40, 50, 60, 80]), BS = (d * Math.sin(al * D)) / Math.sin((be - al) * D), h = BS * Math.sin(be * D), eye = 1.6;
      return X({ id: "sinlaw", lv: 2, titre: "La tour inaccessible",
        q: "Une tour se dresse au milieu d'un étang. D'un point " + M("A") + ", on voit son sommet sous un angle d'élévation de " + M(al + "°") + ". On avance de " + Q(d, "m") + " vers la tour jusqu'en " + M("B") + " : l'angle devient " + M(be + "°") + ". Les angles sont mesurés à " + Q(eye, "m") + " du sol.",
        parts: [{ label: "Calcule les angles du triangle " + M("ABS") + " (" + M("S") + " = sommet).", pts: 1 }, { label: "Calcule " + M("BS") + " (au centimètre).", pts: 2 }, { label: "Calcule la hauteur de la tour (au centimètre).", pts: 2 }],
        sol: ul([M("\\widehat{A} = " + al + "°") + ", " + M("\\widehat{ABS} = 180° - " + be + "° = " + (180 - be) + "°") + ", " + M("\\widehat{S} = " + be + "° - " + al + "° = " + (be - al) + "°") + ".", "Théorème du sinus : " + M("BS = \\frac{" + d + " \\cdot \\sin " + al + "°}{\\sin " + (be - al) + "°} \\approx " + A(BS, 2)) + " m.", M("BS \\cdot \\sin " + be + "° \\approx " + A(h, 2)) + " m au-dessus des yeux, soit " + M("\\approx " + A(h + eye, 2)) + " m."]),
        chk: [[BS, A(BS, 2), 0.01], [h + eye, A(h + eye, 2), 0.01]] }); },
    // Le cas ambigu
    () => { const al = R.int(28, 45), b = pk([10, 12, 15]), lo = b * Math.sin(al * D), a = Math.round((lo + (b - lo) * pk([0.4, 0.6])) * 10) / 10, b1 = Math.asin((b * Math.sin(al * D)) / a) / D, b2 = 180 - b1, g1 = 180 - al - b1, g2 = 180 - al - b2, c1 = (a * Math.sin(g1 * D)) / Math.sin(al * D), c2 = (a * Math.sin(g2 * D)) / Math.sin(al * D);
      return X({ id: "sinlaw", lv: 3, titre: "Deux triangles possibles",
        q: "Dans un triangle " + M("ABC") + ", on connaît " + M("\\alpha = " + al + "°") + ", " + M("b = AC = " + b) + " cm et " + M("a = BC = " + N(a)) + " cm.",
        parts: [{ label: "Calcule " + M("\\sin\\beta") + ". Pourquoi y a-t-il deux valeurs possibles de " + M("\\beta") + " ?", pts: 2 }, { label: "Calcule les deux valeurs de " + M("\\beta") + " et de " + M("\\gamma") + " (au centième de degré).", pts: 1 }, { label: "Calcule les deux longueurs possibles de " + M("c") + " (au centième).", pts: 2 }],
        sol: ul([M("\\sin\\beta = \\frac{" + b + " \\sin " + al + "°}{" + N(a) + "} \\approx " + A(Math.sin(b1 * D), 4)) + ". Deux angles ont ce sinus (" + M("\\beta") + " et " + M("180° - \\beta") + ") ; les deux conviennent car " + M("\\alpha + 180° - \\beta \\lt 180°") + " (le côté " + M("a") + " est plus court que " + M("b") + ").", M("\\beta_1 \\approx " + A(b1, 2) + "°, \\gamma_1 \\approx " + A(g1, 2) + "°") + " ; " + M("\\beta_2 \\approx " + A(b2, 2) + "°, \\gamma_2 \\approx " + A(g2, 2) + "°") + ".", M("c = \\frac{a \\sin\\gamma}{\\sin\\alpha}") + " : " + M("c_1 \\approx " + A(c1, 2)) + " cm, " + M("c_2 \\approx " + A(c2, 2)) + " cm."]),
        chk: [[b1, A(b1, 2), 0.01], [g2, A(g2, 2), 0.01], [c1, A(c1, 2), 0.01], [c2, A(c2, 2), 0.01]] }); },
    // Le parallélogramme
    () => { const a = pk([6, 8, 9, 12]), b = pk([4, 5, 7]), th = R.int(50, 75), d1 = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(th * D)), d2 = Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(th * D)), S = a * b * Math.sin(th * D), S2 = Math.round(a * b * 0.6), t2 = Math.asin(S2 / (a * b)) / D;
      return X({ id: "triaire", lv: 2, titre: "Le parallélogramme",
        q: "Un parallélogramme a des côtés de " + Q(a, "cm") + " et " + Q(b, "cm") + " ; ils forment un angle de " + M(th + "°") + ".",
        parts: [{ label: "Calcule les longueurs des deux diagonales (au centième).", pts: 2 }, { label: "Calcule son aire (au centième).", pts: 1 }, { label: "Quel angle faudrait-il entre les côtés pour une aire de " + Q(S2, "cm^2") + " ? (deux réponses)", pts: 2 }],
        sol: ul(["Petite diagonale : " + M("d_1^2 = " + a + "^2 + " + b + "^2 - 2 \\cdot " + a + " \\cdot " + b + " \\cos " + th + "°") + ", " + M("d_1 \\approx " + A(d1, 2)) + " cm ; l'autre angle vaut " + M((180 - th) + "°") + " : " + M("d_2 \\approx " + A(d2, 2)) + " cm.", "Deux triangles égaux : " + M("\\mathcal{A} = " + a + " \\cdot " + b + " \\cdot \\sin " + th + "° \\approx " + A(S, 2)) + " cm².", M("\\sin\\theta = \\frac{" + S2 + "}{" + a * b + "}") + " : " + M("\\theta \\approx " + A(t2, 2) + "°") + " ou " + M(A(180 - t2, 2) + "°") + " (même parallélogramme vu de l'autre angle)."]),
        chk: [[d1, A(d1, 2), 0.01], [d2, A(d2, 2), 0.01], [S, A(S, 2), 0.01], [t2, A(t2, 2), 0.01]] }); },
  ];
  const RAISONT = [
    () => { const w = who();
      return X({ id: "sinlaw", lv: 2, titre: "Trouve l'erreur",
        q: "Dans un triangle, " + M("\\alpha = 30°") + ", " + M("a = 6") + " et " + M("b = 10") + ". " + w + " calcule " + M("\\sin\\beta = \\frac{10 \\sin 30°}{6} = \\frac{5}{6}") + " et conclut : « " + M("\\beta \\approx 56{,}44°") + ", c'est la seule possibilité ».",
        parts: [{ label: "Montre que " + M("\\beta \\approx 123{,}56°") + " donne aussi un triangle.", pts: 1 }, { label: "Dans quel cas n'y a-t-il qu'une seule solution ?", pts: 1 }],
        sol: ul([M("30° + 123{,}56° = 153{,}56° \\lt 180°") + " : il reste " + M("\\gamma \\approx 26{,}44°") + ", un vrai triangle.", "Quand le côté opposé à l'angle connu est le plus long (" + M("a \\ge b") + ") : l'angle obtus est alors impossible."]),
        chk: [[180 - Math.asin(5 / 6) / D, "123,56", 0.01]] }); },
    () => VF("triaire", 1, [["« Dans tout triangle, " + M("\\frac{a}{\\sin\\alpha} = \\frac{b}{\\sin\\beta}") + ". »", true, "Théorème du sinus."],
      ["« L'aire d'un triangle vaut " + M("\\frac{1}{2}ab\\sin\\gamma") + ", où " + M("\\gamma") + " est l'angle entre " + M("a") + " et " + M("b") + ". »", true, "La hauteur relative à " + M("a") + " vaut " + M("b\\sin\\gamma") + "."],
      ["« Si " + M("\\cos\\gamma \\lt 0") + ", le triangle est obtusangle. »", true, M("\\gamma > 90°") + "."],
      ["« Deux côtés et un angle déterminent toujours un seul triangle. »", false, "Pas si l'angle n'est pas compris entre les côtés : cas ambigu."],
      ["« Un triangle de côtés 3, 4 et 8 existe. »", false, M("3 + 4 \\lt 8") + " : inégalité triangulaire violée."]]),
  ];

  // ===================== 9. Fonctions trigonométriques =====================
  // Graphe de A·sin(bx) + c sur [0 ; 2π], graduations en π/2 (SVG lisible à 360 px).
  const trigFig = (Am, b, c) => {
    const y0 = c - Am - 1, y1 = c + Am + 1, H = 30 + 24 * (y1 - y0), X0 = 36, W = 270, Xs = (x) => X0 + (x / (2 * Math.PI)) * W, Ys = (y) => 12 + ((y1 - y) / (y1 - y0)) * (H - 30);
    const ln = (a, bb, e, f, k, x = "") => '<line x1="' + a + '" y1="' + bb + '" x2="' + e + '" y2="' + f + '" class="' + k + '" ' + x + "/>", tx = (x, y, s, an = "middle") => '<text x="' + x + '" y="' + y + '" class="f-txt f-tick" text-anchor="' + an + '" font-size="11">' + s + "</text>";
    let g = "";
    for (let y = Math.ceil(y0); y <= y1; y++) g += ln(X0, Ys(y), X0 + W, Ys(y), "f-grid") + tx(X0 - 6, Ys(y) + 4, y < 0 ? "−" + -y : y, "end");
    ["", "π/2", "π", "3π/2", "2π"].forEach((s, i) => { const x = Xs((i * Math.PI) / 2); g += ln(x, Ys(y0), x, Ys(y1), "f-grid") + (s ? tx(x, Ys(y0) + 14, s) : ""); });
    g += ln(X0, Ys(Math.max(y0, Math.min(0, y1))), X0 + W + 6, Ys(Math.max(y0, Math.min(0, y1))), "f-line") + ln(X0, Ys(y0), X0, Ys(y1), "f-line");
    let d = ""; for (let i = 0; i <= 240; i++) { const x = (i / 240) * 2 * Math.PI; d += (i ? " L" : "M") + Xs(x).toFixed(1) + "," + Ys(Am * Math.sin(b * x) + c).toFixed(1); }
    return '<svg class="fig" viewBox="0 0 320 ' + (H + 6) + '" role="img" aria-label="graphe d\'une fonction sinusoïdale" xmlns="http://www.w3.org/2000/svg">' + g + '<path d="' + d + '" class="f-accent" fill="none" stroke-width="2.4"/></svg>';
  };
  const EXG = [
    // La grande roue (modèle, équation)
    () => { const H = pk([20, 25, 30]), Rr = pk([16, 18, 20]), T = pk([12, 15, 24]), h = (t) => H - Rr * Math.cos((2 * Math.PI * t) / T);
      return X({ id: "trigeq2", lv: 3, titre: "Un tour de grande roue",
        q: "La hauteur (en m) d'une cabine de grande roue est " + M("h(t) = " + H + " - " + Rr + "\\cos\\left(\\frac{2\\pi t}{" + T + "}\\right)") + ", " + M("t") + " en minutes.",
        parts: [{ label: "Donne la hauteur au départ, la hauteur maximale et la durée d'un tour.", pts: 2 }, { label: "Calcule la hauteur après " + T / 6 + " minutes (valeur exacte).", pts: 1 }, { label: "À quels instants du premier tour la cabine est-elle à " + Q(H + Rr / 2, "m") + " ?", pts: 2 }, { label: "Pendant combien de temps par tour est-elle au-dessus de " + Q(H + Rr / 2, "m") + " ?", pts: 1 }],
        sol: ul([M("h(0) = " + H + " - " + Rr + " = " + (H - Rr)) + " m ; maximum " + M(H + " + " + Rr + " = " + (H + Rr)) + " m (quand le cosinus vaut −1) ; période " + M("\\frac{2\\pi}{2\\pi / " + T + "} = " + T) + " min.", M("h(" + T / 6 + ") = " + H + " - " + Rr + "\\cos\\frac{\\pi}{3} = " + (H - Rr / 2)) + " m.", M("\\cos\\left(\\frac{2\\pi t}{" + T + "}\\right) = -\\frac{1}{2}") + " ⟺ " + M("\\frac{2\\pi t}{" + T + "} = \\frac{2\\pi}{3}") + " ou " + M("\\frac{4\\pi}{3}") + " : " + M("t = " + T / 3) + " min ou " + M("t = " + (2 * T) / 3) + " min.", "Entre " + T / 3 + " et " + (2 * T) / 3 + " min : " + T / 3 + " minutes."]),
        chk: [[h(T / 6), String(H - Rr / 2), 1e-9], [h(T / 3), N(H + Rr / 2), 1e-9], [h((2 * T) / 3), N(H + Rr / 2), 1e-9]] }); },
    // Relations et angles associés
    () => { const [p, q] = pk([[3, 5], [4, 5], [5, 13], [12, 13], [8, 17], [15, 17]]), r = Math.sqrt(q * q - p * p);
      return X({ id: "trigrel", lv: 2, titre: "Un angle du 2e quadrant",
        q: "On sait que " + M("\\sin\\alpha = \\frac{" + p + "}{" + q + "}") + " et que " + M("\\frac{\\pi}{2} \\lt \\alpha \\lt \\pi") + ".",
        parts: [{ label: "Calcule la valeur exacte de " + M("\\cos\\alpha") + ". Justifie son signe.", pts: 2 }, { label: "Calcule " + M("\\tan\\alpha") + ".", pts: 1 }, { label: "Déduis-en " + M("\\sin(\\pi - \\alpha)") + ", " + M("\\cos(\\pi + \\alpha)") + " et " + M("\\sin\\left(\\frac{\\pi}{2} - \\alpha\\right)") + ".", pts: 2 }],
        sol: ul([M("\\cos^2\\alpha = 1 - \\frac{" + p * p + "}{" + q * q + "} = \\frac{" + r * r + "}{" + q * q + "}") + " ; au 2e quadrant le cosinus est négatif : " + M("\\cos\\alpha = -\\frac{" + r + "}{" + q + "}") + ".", M("\\tan\\alpha = \\frac{\\sin\\alpha}{\\cos\\alpha} = -\\frac{" + p + "}{" + r + "}") + ".", M("\\sin(\\pi - \\alpha) = \\sin\\alpha = \\frac{" + p + "}{" + q + "}") + " ; " + M("\\cos(\\pi + \\alpha) = -\\cos\\alpha = \\frac{" + r + "}{" + q + "}") + " ; " + M("\\sin\\left(\\frac{\\pi}{2} - \\alpha\\right) = \\cos\\alpha = -\\frac{" + r + "}{" + q + "}") + "."]),
        chk: [[-Math.sqrt(1 - (p / q) ** 2), "-" + r + "/" + q, 1e-9], [Math.tan(Math.PI - Math.asin(p / q)), "-" + p + "/" + r, 1e-9]] }); },
    // Équation du second degré en sinus ou cosinus
    () => { const s = R.rand() < 0.5, eq = s ? "2\\sin^2 x - \\sin x - 1 = 0" : "2\\cos^2 x + \\cos x - 1 = 0", u = s ? "\\sin x" : "\\cos x", roots = s ? ["1", "-\\frac{1}{2}"] : ["\\frac{1}{2}", "-1"], sols = s ? ["\\frac{\\pi}{2}", "\\frac{7\\pi}{6}", "\\frac{11\\pi}{6}"] : ["\\frac{\\pi}{3}", "\\pi", "\\frac{5\\pi}{3}"], num = s ? [Math.PI / 2, (7 * Math.PI) / 6, (11 * Math.PI) / 6] : [Math.PI / 3, Math.PI, (5 * Math.PI) / 3], k = pk([2, 3]);
      return X({ id: "trigeq", lv: 2, titre: "Une équation qui se ramène au degré 2",
        q: "Résous dans " + M("[0 \\,;\\, 2\\pi[") + " sans calculatrice.",
        parts: [{ label: M(eq) + " (pose " + M("u = " + u) + ").", pts: 3 }, { label: M("\\cos(" + k + "x) = \\frac{1}{2}") + " : combien de solutions dans " + M("[0 \\,;\\, 2\\pi[") + " ? Donne-les.", pts: 2 }],
        sol: ul([M("2u^2 " + (s ? "- u" : "+ u") + " - 1 = 0") + " : " + M("u = " + roots[0]) + " ou " + M("u = " + roots[1]) + ". Solutions " + sols.map((x) => M(x)).join(", ") + ".", M(k + "x = \\pm\\frac{\\pi}{3} + 2n\\pi") + ", " + M("x = \\pm\\frac{\\pi}{" + 3 * k + "} + \\frac{2n\\pi}{" + k + "}") + " : " + 2 * k + " solutions, " + Array.from({ length: k }, (_, n) => [1 + 6 * n, 6 * (n + 1) - 1]).flat().map((m) => M("\\frac{" + m + "\\pi}{" + 3 * k + "}")).join(", ") + "."]),
        chk: [...num.map((x) => [s ? 2 * Math.sin(x) ** 2 - Math.sin(x) : 2 * Math.cos(x) ** 2 + Math.cos(x), "1", 1e-9]), [Math.cos(k * (Math.PI / (3 * k))), "1/2", 1e-9]] }); },
    // Lire le graphe d'une fonction sinusoïdale
    () => { const Am = pk([1, 2, 3]), b = pk([1, 2]), c = pk([-1, 1, 2].filter((y) => y + Am !== 0 && y !== Am));
      return X({ id: "trigfn", lv: 2, titre: "Lire une sinusoïde",
        q: "Le graphe ci-dessous est celui de " + M("f(x) = A\\sin(bx) + c") + " sur " + M("[0 \\,;\\, 2\\pi]") + ", avec " + M("A > 0") + " et " + M("b > 0") + ".", fig: trigFig(Am, b, c),
        parts: [{ label: "Lis le maximum et le minimum de " + M("f") + ". Déduis-en " + M("A") + " et " + M("c") + ".", pts: 2 }, { label: "Lis la période et déduis-en " + M("b") + ".", pts: 1 }, { label: "Pour quels " + M("x") + " de " + M("[0 \\,;\\, 2\\pi]") + " la fonction atteint-elle son maximum ?", pts: 1 }],
        sol: ul(["Max " + M(c + Am) + ", min " + M(c - Am) + " : " + M("A = \\frac{" + (c + Am) + " - " + par(c - Am) + "}{2} = " + Am) + ", " + M("c = \\frac{" + (c + Am) + " + " + par(c - Am) + "}{2} = " + c) + ".", "Période " + M(b === 1 ? "2\\pi" : "\\pi") + " ; " + M("\\frac{2\\pi}{b} = " + (b === 1 ? "2\\pi" : "\\pi")) + " : " + M("b = " + b) + ".", M((b === 1 ? "" : b) + "x = \\frac{\\pi}{2} + 2n\\pi") + " : " + (b === 1 ? M("x = \\frac{\\pi}{2}") : M("x = \\frac{\\pi}{4}") + " et " + M("x = \\frac{5\\pi}{4}")) + "."]),
        chk: [[Am * Math.sin(b * (Math.PI / (2 * b))) + c, String(Am + c)], [Am, String(Am)]] }); },
    // Cercle trigonométrique et longueur d'arc
    () => { const [n, d] = pk([[5, 6], [3, 4], [2, 3], [7, 6], [5, 4], [5, 3], [11, 6]]), deg = (180 * n) / d, r = pk([3, 5, 12]), s = r * (n / d) * Math.PI;
      const ex = { 30: ["\\frac{\\sqrt{3}}{2}", "\\frac{1}{2}"], 45: ["\\frac{\\sqrt{2}}{2}", "\\frac{\\sqrt{2}}{2}"], 60: ["\\frac{1}{2}", "\\frac{\\sqrt{3}}{2}"] }, ref = deg <= 90 ? deg : deg <= 180 ? 180 - deg : deg <= 270 ? deg - 180 : 360 - deg, cs = (deg > 90 && deg < 270 ? "-" : "") + ex[ref][0], sn = (deg > 180 ? "-" : "") + ex[ref][1];
      return X({ id: "trigcercle", lv: 1, titre: "Sur le cercle trigonométrique",
        q: "On considère l'angle " + M("\\theta = \\frac{" + n + "\\pi}{" + d + "}") + ".", fig: FIG.unitCircle(deg, ""),
        parts: [{ label: "Convertis " + M("\\theta") + " en degrés et donne son quadrant.", pts: 1 }, { label: "Donne les coordonnées exactes du point du cercle trigonométrique associé à " + M("\\theta") + ".", pts: 2 }, { label: "Sur un cercle de rayon " + Q(r, "cm") + ", quelle est la longueur de l'arc intercepté par cet angle au centre (au centième) ?", pts: 1 }],
        sol: ul([M("\\frac{" + n + " \\cdot 180°}{" + d + "} = " + deg + "°") + " ; " + (deg < 90 ? "1er" : deg < 180 ? "2e" : deg < 270 ? "3e" : "4e") + " quadrant.", "Angle de référence " + M(ref + "°") + " ; " + M("(\\cos\\theta \\,;\\, \\sin\\theta) = \\left(" + cs + " \\,;\\, " + sn + "\\right)") + ".", M("\\ell = r\\theta = " + r + " \\cdot \\frac{" + n + "\\pi}{" + d + "} \\approx " + A(s, 2)) + " cm."]),
        chk: [[deg, String(deg)], [s, A(s, 2), 0.01]] }); },
  ];
  const RAISONG = [
    () => { const w = who();
      return X({ id: "trigrel", lv: 1, titre: "Trouve l'erreur",
        q: w + " écrit : « " + M("\\sin(2x) = 2\\sin x") + " ».",
        parts: [{ label: "Teste avec " + M("x = \\frac{\\pi}{2}") + ".", pts: 1 }, { label: "Quelle est la bonne formule ?", pts: 1 }],
        sol: ul([M("\\sin\\pi = 0") + " mais " + M("2\\sin\\frac{\\pi}{2} = 2") + ".", M("\\sin(2x) = 2\\sin x\\cos x") + "."]),
        chk: [[2 * Math.sin(Math.PI / 2), "2"]] }); },
    () => VF("trigfn", 2, [["« " + M("\\sin^2 x + \\cos^2 x = 1") + " pour tout " + M("x") + ". »", true, "Pythagore dans le cercle trigonométrique."],
      ["« " + M("\\cos(\\pi - x) = \\cos x") + ". »", false, "Symétrie par rapport à l'axe vertical : " + M("\\cos(\\pi - x) = -\\cos x") + "."],
      ["« La période de " + M("\\sin(2x)") + " est " + M("\\pi") + ". »", true, M("\\frac{2\\pi}{2} = \\pi") + "."],
      ["« La tangente est définie pour tout réel. »", false, "Pas en " + M("\\frac{\\pi}{2} + k\\pi") + " (cosinus nul)."],
      ["« " + M("\\sin x = 2\\cos x") + " équivaut à " + M("\\tan x = 2") + ". »", true, "On divise par " + M("\\cos x") + ", qui n'est pas nul ici (sinon " + M("\\sin x") + " le serait aussi)."]]),
  ];

  // ===================== Géométrie vectorielle =====================
  const EXV = [
    // Le parallélogramme
    () => { let A0, u, v; do { A0 = [R.int(-4, 0), R.int(-3, 1)]; u = [pk([3, 4, 5]), pk([-1, 1, 2])]; v = [pk([-2, -1, 1]), pk([3, 4])]; } while (A0[0] + v[0] === 0 || A0[1] + v[1] === 0 || 2 * A0[0] + u[0] + v[0] === 0);
      const B = [A0[0] + u[0], A0[1] + u[1]], Dd = [A0[0] + v[0], A0[1] + v[1]], C = [B[0] + v[0], B[1] + v[1]], ps = u[0] * v[0] + u[1] * v[1];
      return X({ id: "vecteurs", lv: 1, titre: "Compléter un parallélogramme",
        q: "On donne " + M("A" + pt(A0[0], A0[1])) + ", " + M("B" + pt(B[0], B[1])) + " et " + M("C" + pt(C[0], C[1])) + ".",
        parts: [{ label: "Calcule les composantes de " + M("\\vec{AB}") + " et " + M("\\vec{BC}") + ".", pts: 1 }, { label: "Détermine " + M("D") + " pour que " + M("ABCD") + " soit un parallélogramme.", pts: 2 }, { label: "Calcule le centre du parallélogramme.", pts: 1 }, { label: "Est-ce un rectangle ? Justifie avec un produit scalaire.", pts: 1 }],
        sol: ul([M("\\vec{AB} = " + vec(u[0], u[1])) + ", " + M("\\vec{BC} = " + vec(v[0], v[1])) + ".", M("\\vec{AD} = \\vec{BC}") + " : " + M("D = A + \\vec{BC} = " + pt(Dd[0], Dd[1])) + ".", "Milieu de " + M("[AC]") + " : " + M(pt((A0[0] + C[0]) / 2, (A0[1] + C[1]) / 2)) + ".", M("\\vec{AB} \\cdot \\vec{BC} = " + u[0] + " \\cdot " + par(v[0]) + " + " + par(u[1]) + " \\cdot " + v[1] + " = " + ps) + (ps === 0 ? " : oui, angle droit." : " ≠ 0 : non.")]),
        chk: [[Dd[0], String(Dd[0])], [Dd[1], String(Dd[1])], [(A0[0] + C[0]) / 2, FRp((A0[0] + C[0]) / 2)]] }); },
    // Angle d'un triangle par le produit scalaire
    () => { let A0, B, C, ps; do { A0 = [R.int(-3, 1), R.int(-3, 1)]; B = [A0[0] + R.int(2, 6), A0[1] + R.int(-2, 2)]; C = [A0[0] + R.int(-1, 3), A0[1] + R.int(3, 6)]; ps = (B[0] - A0[0]) * (C[0] - A0[0]) + (B[1] - A0[1]) * (C[1] - A0[1]); } while (ps === 0);
      const u = [B[0] - A0[0], B[1] - A0[1]], v = [C[0] - A0[0], C[1] - A0[1]], nu = u[0] ** 2 + u[1] ** 2, nv = v[0] ** 2 + v[1] ** 2, ang = Math.acos(ps / Math.sqrt(nu * nv)) / D;
      return X({ id: "vecteurs", lv: 2, titre: "L'angle en A",
        q: "On donne le triangle " + M("A" + pt(A0[0], A0[1])) + ", " + M("B" + pt(B[0], B[1])) + ", " + M("C" + pt(C[0], C[1])) + ".",
        parts: [{ label: "Calcule " + M("\\vec{AB}") + ", " + M("\\vec{AC}") + " et leurs normes (valeurs exactes).", pts: 2 }, { label: "Calcule le produit scalaire " + M("\\vec{AB} \\cdot \\vec{AC}") + ".", pts: 1 }, { label: "Calcule l'angle " + M("\\widehat{BAC}") + " (au centième de degré).", pts: 2 }],
        sol: ul([M("\\vec{AB} = " + vec(u[0], u[1])) + ", " + M("\\|\\vec{AB}\\| = " + sq(nu)[0]) + " ; " + M("\\vec{AC} = " + vec(v[0], v[1])) + ", " + M("\\|\\vec{AC}\\| = " + sq(nv)[0]) + ".", M(u[0] + " \\cdot " + par(v[0]) + " + " + par(u[1]) + " \\cdot " + par(v[1]) + " = " + ps) + ".", M("\\cos\\widehat{A} = \\frac{" + ps + "}{" + sq(nu)[0] + " \\cdot " + sq(nv)[0] + "}") + ", " + M("\\widehat{A} \\approx " + A(ang, 2) + "°") + "."]),
        chk: [[ps, String(ps)], [Math.sqrt(nu), sq(nu)[1]], [ang, A(ang, 2), 0.01]] }); },
    // Le bateau et le courant
    () => { const b = [0, pk([3, 4, 5])], c = [pk([1, 1.5, 2]), 0], w = 120 * pk([1, 2, 3]), res = [b[0] + c[0], b[1] + c[1]], sp = Math.hypot(res[0], res[1]), ang = Math.atan(c[0] / b[1]) / D, t = w / b[1], drift = c[0] * t;
      return X({ id: "vecteurs", lv: 2, titre: "Traverser la rivière",
        q: "Un bateau traverse une rivière de " + Q(w, "m") + " de large. Il vise la rive d'en face perpendiculairement, à " + Q(b[1], "m/s") + " (vecteur " + M(vec(b[0], b[1])) + "). Le courant le pousse à " + Q(c[0], "m/s") + " (vecteur " + M(vec(c[0], 0)) + ").",
        parts: [{ label: "Calcule le vecteur vitesse réelle et la vitesse réelle (au centième).", pts: 2 }, { label: "Quel angle fait la trajectoire avec la direction visée (au dixième de degré) ?", pts: 1 }, { label: "Combien de temps dure la traversée ? De combien est-il déporté ?", pts: 2 }],
        sol: ul([M("\\vec{v} = " + vec(res[0], res[1])) + ", " + M("\\|\\vec{v}\\| = \\sqrt{" + N(res[0] ** 2) + " + " + res[1] ** 2 + "} \\approx " + A(sp, 2)) + " m/s.", M("\\tan\\varphi = \\frac{" + N(c[0]) + "}{" + b[1] + "}") + ", " + M("\\varphi \\approx " + A(ang, 1) + "°") + ".", "Seule la composante perpendiculaire fait traverser : " + M(w + " : " + b[1] + " = " + N(t)) + " s ; déport " + M(N(c[0]) + " \\cdot " + N(t) + " = " + N(drift)) + " m."]),
        chk: [[sp, A(sp, 2), 0.01], [ang, A(ang, 1), 0.1], [drift, N(drift)]] }); },
    // Paramètre : colinéaires, perpendiculaires
    () => { const k = pk([2, 3, 4]), p = pk([2, 3, 5]), q = pk([1, 3, 4]);
      return X({ id: "vecteurs", lv: 2, titre: "Choisir le paramètre",
        q: "Soit " + M("\\vec{u} = \\begin{pmatrix} m \\\\ 2 \\end{pmatrix}") + " et " + M("\\vec{v} = " + "\\begin{pmatrix} " + 2 * k * k + " \\\\ m \\end{pmatrix}") + ", où " + M("m") + " est un réel.",
        parts: [{ label: "Pour quelles valeurs de " + M("m") + " les vecteurs sont-ils colinéaires ?", pts: 2 }, { label: "Pour quelle valeur de " + M("m") + " le vecteur " + M("\\vec{u}") + " est-il perpendiculaire à " + M("\\vec{w} = " + vec(p, -q)) + " ?", pts: 1 }, { label: "Pour " + M("m = " + 2 * k) + ", calcule " + M("\\|\\vec{u} + \\vec{v}\\|") + " (valeur exacte).", pts: 2 }],
        sol: ul(["Déterminant nul : " + M("m \\cdot m - 2 \\cdot " + 2 * k * k + " = 0") + " ⟺ " + M("m^2 = " + 4 * k * k) + " ⟺ " + M("m = \\pm " + 2 * k) + ".", M(p + "m - 2 \\cdot " + q + " = 0") + " ⟺ " + M("m = " + FR((2 * q) / p)) + ".", M("\\vec{u} + \\vec{v} = " + vec(2 * k + 2 * k * k, 2 + 2 * k)) + " ; norme " + M("\\sqrt{" + ((2 * k + 2 * k * k) ** 2 + (2 + 2 * k) ** 2) + "} = " + sq((2 * k + 2 * k * k) ** 2 + (2 + 2 * k) ** 2)[0]) + "."]),
        chk: [[Math.sqrt(4 * k * k), String(2 * k)], [(2 * q) / p, FRp((2 * q) / p)], [Math.hypot(2 * k + 2 * k * k, 2 + 2 * k), sq((2 * k + 2 * k * k) ** 2 + (2 + 2 * k) ** 2)[1]]] }); },
    // Le travail d'une force
    () => { const F = [pk([30, 40, 60]), pk([10, 20, 30])], d = [pk([5, 8, 10]), 0], W = F[0] * d[0], nF = Math.hypot(F[0], F[1]), ang = Math.atan(F[1] / F[0]) / D, F2 = pk([50, 80]), a2 = pk([30, 45, 60]), W2 = F2 * d[0] * Math.cos(a2 * D);
      return X({ id: "vecteurs", lv: 3, titre: "Tirer une luge",
        q: "On tire une luge avec une force " + M("\\vec{F} = " + vec(F[0], F[1])) + " (en N) ; elle se déplace de " + M("\\vec{d} = " + vec(d[0], 0)) + " (en m). Le travail de la force est " + M("W = \\vec{F} \\cdot \\vec{d}") + " (en J).",
        parts: [{ label: "Calcule le travail " + M("W") + ".", pts: 1 }, { label: "Calcule l'intensité de la force et l'angle entre la corde et le sol (au dixième).", pts: 2 }, { label: "Avec une force de " + Q(F2, "N") + " inclinée à " + M(a2 + "°") + ", quel serait le travail sur le même déplacement (au joule) ? Pourquoi la composante verticale ne travaille-t-elle pas ?", pts: 2 }],
        sol: ul([M("W = " + F[0] + " \\cdot " + d[0] + " + " + F[1] + " \\cdot 0 = " + W) + " J.", M("\\|\\vec{F}\\| = \\sqrt{" + F[0] ** 2 + " + " + F[1] ** 2 + "} \\approx " + A(nF, 1)) + " N ; " + M("\\tan\\theta = \\frac{" + F[1] + "}{" + F[0] + "}") + ", " + M("\\theta \\approx " + A(ang, 1) + "°") + ".", M("W = " + F2 + " \\cdot " + d[0] + " \\cdot \\cos " + a2 + "° \\approx " + A(W2, 0)) + " J. La composante verticale est perpendiculaire au déplacement : produit scalaire nul."]),
        chk: [[W, String(W)], [nF, A(nF, 1), 0.1], [W2, A(W2, 0), 1]] }); },
  ];
  const RAISONV = [
    () => { const A0 = [R.int(-4, -1), R.int(1, 5)], B = [R.int(2, 6), R.int(-3, 0)], w = who();
      return X({ id: "vecteurs", lv: 1, titre: "Trouve l'erreur",
        q: "Avec " + M("A" + pt(A0[0], A0[1])) + " et " + M("B" + pt(B[0], B[1])) + ", " + w + " écrit : « " + M("\\vec{AB} = " + vec(A0[0] - B[0], A0[1] - B[1])) + " ».",
        parts: [{ label: "Quelle est l'erreur ?", pts: 1 }, { label: "Donne le bon vecteur et vérifie avec " + M("A + \\vec{AB} = B") + ".", pts: 1 }],
        sol: ul([w + " a calculé " + M("A - B") + " (c'est " + M("\\vec{BA}") + ").", M("\\vec{AB} = B - A = " + vec(B[0] - A0[0], B[1] - A0[1])) + " ; " + M(pt(A0[0], A0[1]) + " + " + vec(B[0] - A0[0], B[1] - A0[1]) + " = " + pt(B[0], B[1])) + " ✓."]),
        chk: [[B[0] - A0[0], String(B[0] - A0[0])]] }); },
    () => VF("vecteurs", 2, [["« " + M("\\|\\vec{u} + \\vec{v}\\| = \\|\\vec{u}\\| + \\|\\vec{v}\\|") + " pour tous vecteurs. »", false, "Contre-exemple : " + M(vec(1, 0)) + " et " + M(vec(0, 1)) + " : " + M("\\sqrt{2} \\neq 2") + "."],
      ["« Deux vecteurs non nuls de produit scalaire nul sont perpendiculaires. »", true, M("\\cos\\theta = 0") + ", " + M("\\theta = 90°") + "."],
      ["« Le produit scalaire de deux vecteurs est un vecteur. »", false, "C'est un nombre réel."],
      ["« " + M(vec(2, 3)) + " et " + M(vec(4, 6)) + " sont colinéaires. »", true, "Le second est le double du premier."],
      ["« " + M("\\vec{u} \\cdot \\vec{u} = \\|\\vec{u}\\|^2") + ". »", true, M("x^2 + y^2") + "."]]),
  ];

  RICH.tri2c = { ids: ["sinlaw", "triaire"], track: "col", label: "Trigonométrie du triangle quelconque", ex: EXT, raison: RAISONT, minutes: 45 };
  RICH.trigfn2c = { ids: ["trigrel", "trigcercle", "trigassoc", "trigeq", "trigfn", "trigeq2"], track: "col", label: "Fonctions trigonométriques", ex: EXG, raison: RAISONG, minutes: 45 };
  RICH.vec2c = { ids: ["vecteurs"], track: "col", label: "Géométrie vectorielle", ex: EXV, raison: RAISONV, minutes: 45 };
})();

// Chantier MP 2e (20.11, « interactive mp2, fais tout ») : leçons actives (devine / calcule / retiens) pour droites,
// droitesinter, recipaff, trigcercle, trigfn, sinlaw, trigeq, trigassoc, trigeq2, triaire, statfreq, stats, quartiles.
// Même moteur que act_1c.js (outils recopiés) ; réponses tapées (mode ask), nombres décimaux ou fractions.
(function () {
  // ---------- outils ----------
  const nb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const fr = (n, d) => { const g = gcd(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n).replace("-", "−") : String(n).replace("-", "−") + "/" + d; };
  const SUP = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
  const sup = (n) => String(n).split("").map((c) => SUP[c] || c).join("");
  const ok = (good, low) => (good ? '<b class="act-ok">✓ égalité</b>' : low ? "trop petit" : "trop grand");
  const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;
  // Chercheur : un curseur, l'affichage calculé en direct ; chaque défi vérifie la valeur.
  // Commentaire testeur du 17.11 : « les manipulations où on ne fait que toucher des curseurs n'apportent pas grand-chose ».
  // Mode réponse (o.ask) : l'élève calcule et tape sa réponse ; la figure se met à jour seulement après « Vérifier ».
  // Le curseur reste pour les vraies manipulations (colorier, descendre l'escalier) : o.ask absent.
  // o et mk gardés sur la fonction : actPrep (active.js) peut ne garder que 2 questions (22.11).
  const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });
  const hunt0 = (o) => (box, onWin) => {
    let x = o.ask ? null : o.start, step = 0;
    const draw = () => {
      const s = Math.min(step, o.wins.length - 1), fig = x === null ? (o.blank ? o.blank(s) : "") : o.show(x, s);
      const ctl = o.ask ? (actAnswerHtml(o.label || "Ta réponse"))
        : actStepper(o.label || "x", nb(x), "x");
      box.innerHTML = fig + ctl + (o.note ? `<div class="small muted">${o.note}</div>` : "");
      if (o.ask) {
        const inp = box.querySelector(".act-in"); if (x !== null) inp.value = nb(x).replace("−", "-"); const go = () => { const v = Number(String(inp.value).replace(/,/g, ".").replace("−", "-").replace(/\s/g, "").replace(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/, (s, u, w) => String(u / w))); if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre."); return; } x = v; draw(); if (!check()) $hint(box, o.miss || (box.querySelector("svg.fig") ? "Pas encore : regarde la figure, puis recalcule." : "Pas encore : relis les calculs affichés, puis recalcule.")); };
        actAnswerBind(box, go);
      } else box.querySelectorAll('[data-st="x"]').forEach((b) => (b.onclick = () => { x = Math.max(o.min, Math.min(o.max, +(x + +b.dataset.d * (o.step || 1)).toFixed(6))); draw(); check(); }));
    };
    const check = () => { if (step >= o.wins.length) return false; const m = o.wins[step](x); if (m) { onWin(step, m); step++; if (o.ask) x = null; draw(); return true; } return false; };
    draw();
  };
  const W = (target, msg) => (x) => (Math.abs(x - target) < 1e-9 ? msg : "");
  // Barre de fraction : a/b de la longueur, avec graduations en 1/n
  const bar = (a, b, n, y, cls) => { const x0 = 20, w = 280; let g = `<rect x="${x0}" y="${y}" width="${w}" height="18" class="f-soft" stroke="var(--ink)" stroke-width="1"/><rect x="${x0}" y="${y}" width="${(w * a) / b}" height="18" class="${cls}"/>`;
    if (n && n <= 60) for (let k = 1; k < n; k++) g += `<line x1="${x0 + (w * k) / n}" y1="${y}" x2="${x0 + (w * k) / n}" y2="${y + 18}" class="f-line" stroke-width="0.6"/>`;
    return g; };
  const T = (x, y, s, a = "middle", sz = 12, cls = "f-txt") => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${a}" font-size="${sz}">${s}</text>`;
  const L = (x1, y1, x2, y2, cls = "f-line", w = 1.6) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" stroke-width="${w}"/>`;
  // Droite graduée de −12 à 12, avec un départ et une arrivée.
  const line = (from, to) => { const X = (v) => 160 + v * 12; let g = L(10, 30, 310, 30); for (let v = -12; v <= 12; v++) g += L(X(v), 26, X(v), 34, "f-line", v % 5 ? 0.6 : 1.2) + (v % 5 ? "" : T(X(v), 50, String(v).replace("-", "−"), "middle", 10));
    if (from !== null) g += `<circle cx="${X(from)}" cy="30" r="5" class="f-dot"/>`; if (to !== null && Math.abs(to) <= 12) g += `<path d="M${X(from)},22 Q${(X(from) + X(to)) / 2},2 ${X(to)},22" class="f-accent" fill="none" stroke-width="2"/><circle cx="${X(to)}" cy="30" r="5" class="f-accent"/>`;
    return svg(320, 58, g, "droite graduée"); };
  // Configuration de Thalès schématique (étiquettes de longueurs).
  const thal = (k, labs) => { const A = [30, 120], B = [290, 140], C = [230, 20], D = [A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k], E = [A[0] + (C[0] - A[0]) * k, A[1] + (C[1] - A[1]) * k];
    let g = `<polygon points="${A} ${B} ${C}" class="f-shape"/>` + L(D[0], D[1], E[0], E[1], "f-accent", 2.4) + T(A[0] - 10, A[1] + 4, "A") + T(B[0] + 8, B[1] + 4, "B") + T(C[0] + 8, C[1], "C") + T(D[0], D[1] + 16, "D") + T(E[0] - 8, E[1] - 6, "E");
    const mid = (P, Q, dy) => [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2 + dy];
    for (const [k2, P, Q, dy] of [["AD", A, D, 16], ["DB", D, B, 16], ["AE", A, E, -8], ["EC", E, C, -8], ["DE", D, E, 0], ["BC", B, C, 0]]) if (labs[k2]) { const [x, y] = mid(P, Q, dy); g += T(x + (k2 === "DE" || k2 === "BC" ? 14 : 0), y, labs[k2], "middle", 12, /\?/.test(labs[k2]) ? "f-txt f-accent" : "f-txt"); }
    return svg(320, 160, g, "configuration de Thalès"); };
  const plain = (html) => `<div class="act-out">${html}</div>`;

  const tu = (x) => " ; tu proposes <b>" + nb(x) + "</b>";
  // Deux droites dans un repère quadrillé ; x proposé : verticale et les deux y lus (droitesinter, 22.11).
  const DI2 = [
    { f: (x) => 2 * x - 1, g: (x) => x + 3, fl: "y = 2x − 1", gl: "y = x + 3", xr: [-1, 8], yr: [-3, 16], gx: 1, gy: 2 },
    { f: (x) => 3 * x - 2, g: (x) => -x + 6, fl: "y = 3x − 2", gl: "y = −x + 6", xr: [-1, 5], yr: [-4, 12], gx: 1, gy: 2 },
    { f: (x) => 20 + 2 * x, g: (x) => 50 + x, fl: "A : 20 + 2x", gl: "B : 50 + x", xr: [0, 50], yr: [0, 130], gx: 5, gy: 10, unit: " CHF" },
  ];
  const twoLines = (s, x) => {
    const D = DI2[s], W0 = 300, H0 = 190, ml = 30, mb = 20, X = (v) => ml + ((v - D.xr[0]) / (D.xr[1] - D.xr[0])) * (W0 - ml - 10), Y = (v) => H0 - mb - ((v - D.yr[0]) / (D.yr[1] - D.yr[0])) * (H0 - mb - 10);
    let g = "";
    for (let v = Math.ceil(D.xr[0] / D.gx) * D.gx; v <= D.xr[1]; v += D.gx) g += L(X(v), Y(D.yr[0]), X(v), Y(D.yr[1]), "f-grid", 0.7);
    for (let v = Math.ceil(D.yr[0] / D.gy) * D.gy; v <= D.yr[1]; v += D.gy) g += L(X(D.xr[0]), Y(v), X(D.xr[1]), Y(v), "f-grid", 0.7);
    if (D.yr[0] <= 0) g += L(X(D.xr[0]), Y(0), X(D.xr[1]), Y(0), "f-line", 1.2);
    if (D.xr[0] <= 0) g += L(X(0), Y(D.yr[0]), X(0), Y(D.yr[1]), "f-line", 1.2);
    for (let v = Math.ceil(D.xr[0] / D.gx) * D.gx; v <= D.xr[1]; v += D.gx * (D.gx === 1 ? 1 : 2)) if (v) g += T(X(v), Y(Math.max(D.yr[0], 0)) + 13, nb(v), "middle", 9);
    for (let v = Math.ceil(D.yr[0] / D.gy) * D.gy; v <= D.yr[1]; v += D.gy * 2) if (v) g += T(X(Math.max(D.xr[0], 0)) - 4, Y(v) + 3, nb(v), "end", 9);
    const seg = (f, cls) => L(X(D.xr[0]), Y(f(D.xr[0])), X(D.xr[1]), Y(f(D.xr[1])), cls, 2.2);
    g = `<defs><clipPath id="di-clip"><rect x="${ml}" y="10" width="${W0 - ml - 10}" height="${H0 - mb - 10}"/></clipPath></defs>` + g + `<g clip-path="url(#di-clip)">${seg(D.f, "f-accent")}${seg(D.g, "f-blue")}</g>`;
    g += T(W0 - 12, 22, D.fl, "end", 11, "f-txt f-accent") + T(W0 - 12, 36, D.gl, "end", 11, "f-txt f-blue");
    let out = "";
    if (x !== null && x >= D.xr[0] && x <= D.xr[1]) {
      const y1 = D.f(x), y2 = D.g(x), same = Math.abs(y1 - y2) < 1e-9;
      g += L(X(x), Y(D.yr[0]), X(x), Y(D.yr[1]), "f-line", 1) + `<circle cx="${X(x)}" cy="${Y(y1)}" r="4" class="f-dot"/><circle cx="${X(x)}" cy="${Y(y2)}" r="4" class="f-dot"/>`;
      out = `<div class="act-out">x = ${nb(x)} : ${D.fl.split(":")[0].replace("y = ", "")} donne <b>${nb(y1)}${D.unit || ""}</b>, ${D.gl.split(":")[0].replace("y = ", "")} donne <b>${nb(y2)}${D.unit || ""}</b> → ${same ? '<b class="act-ok">même valeur : c\'est le point commun</b>' : "pas encore le même"}</div>`;
    } else if (x !== null) out = `<div class="act-out">x = ${nb(x)} est hors du graphique : essaie entre ${nb(D.xr[0])} et ${nb(D.xr[1])}.</div>`;
    return svg(W0, H0, g, "deux droites dans un repère") + out;
  };
  Object.assign(ACTIVE, {
    droites: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Pente par deux points : \\(m = \\frac{y_B - y_A}{x_B - x_A}\\) (variation verticale ÷ variation horizontale) : quand x augmente de 1, y augmente de \\(m\\). Deux droites perpendiculaires ont des pentes dont le produit vaut \\(-1\\).", exemple: ["Par \\((0 \\, ; 1)\\) et \\((2 \\, ; 5)\\) : \\(m = \\frac{4}{2} = 2\\)", "Perpendiculaire à \\(y = 3x - 1\\) : pente \\(-\\frac{1}{3}\\)"], piege: "Perpendiculaire à une pente 3 : pente \\(-\\frac{1}{3}\\) (produit \\(-1\\)), pas \\(-3\\)." },
      predict: { q: "Une droite passe par (0 ; 1) et (2 ; 5). Sa pente vaut…", choices: ["2", "4", "1/2"], good: 0, why: "Pente = variation verticale ÷ variation horizontale = (5 − 1) ÷ (2 − 0) = 4 ÷ 2 = 2 : quand x augmente de 1, y augmente de 2." },
      defis: ["Pente de la droite qui passe par (1 ; 3) et (4 ; 9) ?", "La droite y = 2x + h passe par (3 ; 4). Que vaut h ?", "Pente d'une droite perpendiculaire à y = 3x − 1 ? (fraction)"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["(9 − 3) ÷ (4 − 1)", "4 = 2 · 3 + h", "pente · 3 = −1"][s] + tu(x)),
        wins: [W(2, "6 ÷ 3 = 2."), W(-2, "4 = 6 + h, donc h = −2."), W(-1 / 3, "Perpendiculaires : produit des pentes = −1, donc −1/3.")] }),
    },
    droitesinter: {
      /* 24.11 : perpendiculaires (notion « Intersection de droites, médiatrice, hauteur »), en défi court */
      plus: [{ d: "La droite d : \\(y = 3x - 2\\). Deux droites (non verticales) sont perpendiculaires quand le produit de leurs pentes vaut \\(-1\\). Tape la pente \\(m\\) d'une perpendiculaire à d.", ans: -1 / 3, ok: "3 · m = −1, donc m = −1/3 : on inverse la pente et on change son signe.", no: "Cherche m tel que 3 · m = −1 (fraction acceptée)." }],
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Intersection de deux droites : au point commun, les deux \\(y\\) sont égaux. On égale les deux expressions, on résout en \\(x\\), puis on calcule \\(y\\). Deux droites de pentes \\(m\\) et \\(m'\\) sont perpendiculaires si \\(m \\cdot m' = -1\\).", exemple: ["Perpendiculaire à \\(y = 3x - 2\\) : pente \\(-\\frac{1}{3}\\).", "\\(y = x + 1\\) et \\(y = -x + 5\\) : \\(x + 1 = -x + 5\\), donc \\(x = 2\\) et \\(y = 3\\).", "Offres \\(20 + 2x\\) et \\(50 + x\\) : \\(20 + 2x = 50 + x\\), même prix pour 30 km."], piege: "Le point d'intersection a deux coordonnées : une fois \\(x\\) trouvé, calcule \\(y\\)." },
      predict: { q: "Les droites y = x + 1 et y = −x + 5 se coupent pour x = …", choices: ["2", "3", "1"], good: 0, why: "Au point d'intersection, les deux y sont égaux : x + 1 = −x + 5, donc 2x = 4 et x = 2 (puis y = 3)." },
      // Défis repris le 22.11 (« les défis, c'est confusing ») : toujours la même tâche (l'abscisse du point commun),
      // avec le graphique des deux droites ; la réponse tapée place une verticale qui montre les deux y.
      defis: ["y = 2x − 1 et y = x + 3 : pour quel x les deux droites donnent-elles le même y ?", "y = 3x − 2 et y = −x + 6 : pour quel x ont-elles le même y ?", "Location d'une voiture. Offre A : 20 CHF + 2 CHF par km ; offre B : 50 CHF + 1 CHF par km. Pour combien de km les deux offres coûtent-elles le même prix ?"],
      play: hunt({ ask: true, label: "x =", blank: (s) => twoLines(s, null), show: (x, s) => twoLines(s, x),
        wins: [W(4, "2 · 4 − 1 = 7 et 4 + 3 = 7 : les droites se coupent en (4 ; 7)."), W(2, "3 · 2 − 2 = 4 et −2 + 6 = 4 : point commun (2 ; 4)."), W(30, "20 + 2 · 30 = 80 CHF et 50 + 30 = 80 CHF : pour 30 km, même prix ; au-delà, B est moins chère.")] }),
    },
    recipaff: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Si \\(f(a) = b\\), alors \\(f^{-1}(b) = a\\) : \\(f^{-1}(b)\\) est le nombre dont l'image vaut \\(b\\), on résout \\(f(x) = b\\). Le point \\((a ; b)\\) du graphique de \\(f\\) devient \\((b ; a)\\) sur celui de \\(f^{-1}\\).", exemple: ["\\(f(x) = 2x + 3\\) : \\(2x + 3 = 11\\), donc \\(f^{-1}(11) = 4\\)", "\\(f(x) = 3x - 6\\) : \\(3x - 6 = 0\\), donc \\(f^{-1}(0) = 2\\)", "\\((2 ; 9)\\) sur \\(f\\) donne \\((9 ; 2)\\) sur \\(f^{-1}\\)"] },
      predict: { q: "f(x) = 2x + 3. Que vaut f⁻¹(11) ?", choices: ["4", "25", "1/11"], good: 0, why: "f⁻¹(11) est le nombre dont l'image vaut 11 : 2x + 3 = 11, donc x = 4. (25, c'est f(11) ; 1/11 n'a rien à voir.)" },
      defis: ["f(x) = 3x − 6. Que vaut f⁻¹(0) ?", "f(x) = 5x + 2. Que vaut f⁻¹(27) ?", "Le point (2 ; 9) est sur le graphique de f. Le point de f⁻¹ d'ordonnée 2 a quelle abscisse ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["3x − 6 = 0", "5x + 2 = 27", "on échange x et y"][s] + tu(x)),
        wins: [W(2, "3x = 6, donc x = 2."), W(5, "5x = 25, donc x = 5."), W(9, "La réciproque échange les coordonnées : (9 ; 2).")] }),
    },
    trigcercle: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Un tour complet mesure \\(2\\pi\\) radians, donc \\(180° = \\pi\\) rad. Le point associé à l'angle \\(\\alpha\\) a pour coordonnées \\((\\cos\\alpha \\, ; \\sin\\alpha)\\). Pour un angle du 2e quadrant, on part de l'angle de référence (120° → 60°) et on met le signe du quadrant.", exemple: ["\\(\\frac{\\pi}{6}\\) rad \\(= \\frac{180°}{6} = 30°\\)", "\\(\\cos 120° = -\\cos 60° = -0{,}5\\)"] },
      predict: { q: "Un demi-tour (180°) vaut combien de radians ?", choices: ["π", "2π", "180"], good: 0, why: "Un tour complet mesure 2π radians (le périmètre du cercle de rayon 1), donc un demi-tour vaut π." },
      defis: ["Combien de degrés vaut π/6 rad ?", "135° = k · π/4. Que vaut k ?", "cos 120° (en décimal) ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["π = 180°, donc π/6 = 180° ÷ 6", "π/4 = 45°", "120° : quadrant 2, angle de référence 60°"][s] + tu(x)),
        wins: [W(30, "180 ÷ 6 = 30°."), W(3, "135 ÷ 45 = 3, soit 3π/4."), W(-0.5, "cos 60° = 0,5 et le cosinus est négatif dans le quadrant 2 : −0,5.")] }),
    },
    trigfn: {
      predict: { q: "La période de sin(2x) (x en degrés) est…", choices: ["180°", "720°", "360°"], good: 0, why: "Avec 2x, l'angle va deux fois plus vite : la courbe se répète deux fois plus souvent, période 360° ÷ 2 = 180°." },
      defis: ["Valeur maximale de 3 sin x + 2 ?", "Période (en degrés) de cos(4x) ?", "Plus petit x > 0 (en degrés) où sin(3x) = 1 ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["sin x vaut au plus 1", "360° ÷ 4", "sin vaut 1 pour un angle de 90°"][s] + tu(x)),
        wins: [W(5, "3 · 1 + 2 = 5."), W(90, "360 ÷ 4 = 90°."), W(30, "3x = 90°, donc x = 30°.")] }),
    },
    sinlaw: {
      predict: { q: "Dans un triangle, le plus grand côté est toujours en face…", choices: ["du plus grand angle", "du plus petit angle", "d'un angle droit"], good: 0, why: "Théorème du sinus : a ÷ sin α = b ÷ sin β. Plus l'angle est grand, plus le côté opposé est long." },
      defis: ["α = 30°, β = 90° et a = 5. Calcule b.", "a = 3, b = 4 et γ = 90°. Que vaut c² ?", "Triangle équilatéral : que vaut cos γ ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["b = a · sin β ÷ sin α = 5 · 1 ÷ 0,5", "c² = a² + b² − 2ab cos 90°", "côtés égaux : cos γ = (a² + a² − a²) ÷ (2a²)"][s] + tu(x)),
        wins: [W(10, "5 ÷ 0,5 = 10 : le côté en face de l'angle droit est le plus long."), W(25, "cos 90° = 0 : on retrouve Pythagore, c² = 25."), W(0.5, "cos γ = a² ÷ (2a²) = 0,5, donc γ = 60°.")] }),
    },
    trigeq: {
      predict: { q: "Combien de solutions a sin x = 0,5 pour 0° ≤ x < 360° ?", choices: ["2", "1", "4"], good: 0, why: "Deux points du cercle ont l'ordonnée 0,5 : 30° et 180° − 30° = 150°." },
      defis: ["Plus grande solution de sin x = 0,5 (entre 0° et 360°) ?", "Plus petite solution de cos x = −0,5 ?", "Solution de tan x = 1 entre 180° et 360° ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["sin(180° − x) = sin x", "cos 60° = 0,5 ; cosinus négatif dans le quadrant 2", "tan 45° = 1 ; la tangente se répète tous les 180°"][s] + tu(x)),
        wins: [W(150, "180° − 30° = 150°."), W(120, "180° − 60° = 120° (l'autre est 240°)."), W(225, "45° + 180° = 225°.")] }),
    },
    trigassoc: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\(\\sin(180° - \\alpha) = \\sin \\alpha\\) (symétrie par rapport à l'axe vertical : même ordonnée). \\(\\cos(-\\alpha) = \\cos \\alpha\\) (même abscisse). Toujours : \\(\\sin^2 \\alpha + \\cos^2 \\alpha = 1\\).", exemple: ["\\(\\sin \\alpha = 0{,}6\\) : \\(\\sin(180° - \\alpha) = 0{,}6\\)", "\\(\\cos \\alpha = 0{,}8\\) : \\(\\cos(-\\alpha) = 0{,}8\\)", "\\(\\sin \\alpha = 0{,}6\\), \\(\\alpha\\) aigu : \\(\\cos^2 \\alpha = 1 - 0{,}36 = 0{,}64\\), \\(\\cos \\alpha = 0{,}8\\)"], piege: "Avec \\(\\sin^2 \\alpha + \\cos^2 \\alpha = 1\\), choisis le signe selon le quadrant : positif pour un angle aigu." },
      predict: { q: "Si sin α = 0,6, alors sin(180° − α) vaut…", choices: ["0,6", "−0,6", "0,8"], good: 0, why: "α et 180° − α sont symétriques par rapport à l'axe vertical : même ordonnée, donc même sinus." },
      defis: ["cos α = 0,8. Que vaut cos(−α) ?", "sin α = 0,6. Que vaut sin(180° + α) ?", "sin α = 0,6 et α aigu. Que vaut cos α ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["−α : symétrie par rapport à l'axe horizontal", "180° + α : symétrie par rapport au centre", "cos² α = 1 − sin² α"][s] + tu(x)),
        wins: [W(0.8, "Même abscisse, donc cos(−α) = cos α = 0,8."), W(-0.6, "Point opposé : ordonnée opposée, −0,6."), W(0.8, "cos² α = 1 − 0,36 = 0,64, donc cos α = 0,8 (positif, angle aigu).")] }),
    },
    trigeq2: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\(h(t) = d + a\\sin(bt)\\) : hauteur moyenne \\(d\\), amplitude \\(a\\) ; maximum \\(d + a\\), minimum \\(d - a\\). Période : \\(\\frac{360°}{b}\\). Le premier maximum arrive quand \\(bt = 90°\\).", exemple: ["\\(h(t) = 4 + 2\\sin(30t)\\) : maximum 6 m, période \\(360 \\div 30 = 12\\) h", "Marée haute : \\(30t = 90\\), donc \\(t = 3\\) h"], piege: "4 m est la hauteur moyenne et 2 m l'amplitude : le maximum est \\(4 + 2 = 6\\) m." },
      predict: { q: "La marée d'un port : h(t) = 4 + 2 sin(30t) (en m). La hauteur maximale est…", choices: ["6 m", "4 m", "2 m"], good: 0, why: "sin vaut au plus 1 : 4 + 2 · 1 = 6 m. (4 m, c'est la hauteur moyenne ; 2 m, l'amplitude.)" },
      defis: ["Période de h, en heures (le sinus fait un tour pour 30t = 360) ?", "Hauteur minimale (en m) ?", "À quelle heure la marée est-elle haute pour la première fois ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["30t = 360", "sin vaut au moins −1", "30t = 90"][s] + tu(x)),
        wins: [W(12, "t = 12 h : deux marées hautes par jour."), W(2, "4 − 2 = 2 m."), W(3, "t = 3 h.")] }),
    },
    triaire: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Aire du triangle : \\(\\frac{1}{2} \\cdot a \\cdot b \\cdot \\sin\\gamma\\), où \\(\\gamma\\) est l'angle entre les côtés \\(a\\) et \\(b\\). Un parallélogramme est fait de deux tels triangles : aire \\(a \\cdot b \\cdot \\sin\\gamma\\).", exemple: ["\\(a = 6\\), \\(b = 8\\), \\(\\gamma = 30°\\) : aire \\(= \\frac{1}{2} \\cdot 48 \\cdot \\frac{1}{2} = 12\\).", "Angle droit : \\(\\sin 90° = 1\\), aire \\(\\frac{1}{2} \\cdot 10 \\cdot 4 = 20\\).", "Parallélogramme 5 et 8, angle 30° : \\(5 \\cdot 8 \\cdot 0{,}5 = 20\\)."] },
      predict: { q: "Un triangle a deux côtés de 6 cm et 8 cm qui forment un angle de 30°. Son aire vaut…", choices: ["12 cm²", "24 cm²", "48 cm²"], good: 0, why: "Aire = ½ · 6 · 8 · sin 30° = ½ · 48 · 0,5 = 12 cm². La hauteur sur le côté 8 vaut 6 · sin 30° = 3." },
      defis: ["Côtés 10 et 4, angle de 90° entre eux : aire ?", "Côtés 6 et 6, angle de 150° : aire ? (sin 150° = 0,5)", "Parallélogramme de côtés 5 et 8, angle de 30° : aire ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["½ · 10 · 4 · sin 90°", "½ · 6 · 6 · 0,5", "5 · 8 · sin 30° (deux triangles)"][s] + tu(x)),
        wins: [W(20, "sin 90° = 1 : on retrouve base × hauteur ÷ 2 = 20."), W(9, "½ · 36 · 0,5 = 9."), W(20, "40 · 0,5 = 20.")] }),
    },
    statfreq: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Fréquence \\(= \\frac{\\text{effectif}}{\\text{effectif total}}\\) (souvent en \\(\\%\\)). Diagramme circulaire : angle \\(= \\text{fréquence} \\cdot 360°\\).", exemple: ["10 sur 40 : \\(25\\,\\%\\), angle \\(0{,}25 \\cdot 360° = 90°\\)", "Secteur de 72° : \\(\\frac{72}{360} = 20\\,\\%\\)"] },
      predict: { q: "Sur 40 personnes, 10 répondent « oui ». La fréquence de « oui » est…", choices: ["25 %", "10 %", "40 %"], good: 0, why: "Fréquence = effectif ÷ total = 10 ÷ 40 = 0,25 = 25 %." },
      defis: ["Angle du secteur « oui » (10 sur 40) dans un diagramme circulaire ?", "30 % de 60 personnes, c'est combien de personnes ?", "Un secteur mesure 72° : quel pourcentage ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["0,25 · 360°", "0,3 · 60", "72 ÷ 360"][s] + tu(x)),
        wins: [W(90, "Un quart du tour : 90°."), W(18, "0,3 · 60 = 18."), W(20, "72 ÷ 360 = 0,2 = 20 %.")] }),
    },
    stats: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Moyenne : la somme des valeurs divisée par l'effectif. Médiane : la valeur du milieu de la série triée. Une valeur extrême tire la moyenne, pas la médiane.", exemple: ["Série 2 ; 3 ; 100 : moyenne 35, médiane 3.", "Notes 4 et 5, moyenne visée 5 : somme \\(3 \\cdot 5 = 15\\), 3e note 6."] },
      predict: { q: "Série 2 ; 3 ; 100. Quel nombre représente le mieux une valeur « typique » ?", choices: ["la médiane, 3", "la moyenne, 35", "l'étendue, 98"], good: 0, why: "La valeur extrême 100 tire la moyenne vers le haut (35) ; la médiane (3) n'est pas influencée." },
      defis: ["Moyenne de 4 ; 5 ; 9 ?", "Médiane de 7 ; 1 ; 4 ; 10 ; 3 ?", "Notes 4 et 5 : quelle 3e note pour une moyenne de 5 ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["(4 + 5 + 9) ÷ 3", "on trie : 1 ; 3 ; 4 ; 7 ; 10", "il faut une somme de 3 · 5 = 15"][s] + tu(x)),
        wins: [W(6, "18 ÷ 3 = 6."), W(4, "Valeur du milieu : 4."), W(6, "15 − 4 − 5 = 6.")] }),
    },
    quartiles: {
      predict: { q: "Dans une boîte à moustaches, la « boîte » (de Q1 à Q3) contient…", choices: ["environ la moitié des valeurs", "environ un quart des valeurs", "toutes les valeurs"], good: 0, why: "Q1, la médiane et Q3 partagent la série en quatre parts d'environ 25 % : la boîte en contient deux, soit la moitié." },
      defis: ["Étendue de 3 ; 9 ; 15 ; 4 ?", "Série triée 2 ; 4 ; 5 ; 7 ; 9 ; 12 ; 15 : Q1 ?", "Et Q3 ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["max − min", "moitié inférieure : 2 ; 4 ; 5 (sans la médiane 7)", "moitié supérieure : 9 ; 12 ; 15"][s] + tu(x)),
        wins: [W(12, "15 − 3 = 12."), W(4, "Médiane de 2 ; 4 ; 5 : 4."), W(12, "Médiane de 9 ; 12 ; 15 : 12 (écart interquartile 8).")] }),
    },
  });
})();

// Chantier 2e Collège (23.11) : leçons actives (devine / manipule ou calcule / retiens) pour cart, cercle, polydiv,
// polyfact, polyexpr, fracetage, eqrat, probrat, homog, homogrec, expo, expfrac, modexp, compo, decomp, bijection,
// recip, log, logbase, vecteurs. Même moteur que act_1c.js et act_mp2.js (outils recopiés : fichier autonome).
// Deux briques :
// - hunt (réponse tapée, o.ask) : avec o.blank → « Essaie sur la figure » (tous les défis), sans → « À toi » (2 questions) ;
// - slide (vraie manipulation) : un ou plusieurs curseurs qui déforment une courbe ou déplacent une figure ; l'objectif
//   n'est vérifié qu'AU LÂCHER (événement change), pour qu'on ne gagne pas en balayant ; une question « à toi » tapée,
//   sans la figure, peut suivre le geste (o.ask[étape]).
// Pas de TeX dans ce qui est redessiné (figures, messages) ; TeX seulement dans les consignes (rendues par setGoal).
(function () {
  // ---------- outils ----------
  const nb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");
  // Nombre arrondi à d décimales, milliers séparés par ' (1'551,33).
  const mil = (v, d = 2) => { const s = (+(+v).toFixed(d)).toString().split("."), i = s[0].replace("-", ""), neg = s[0][0] === "-";
    return (neg ? "−" : "") + i.replace(/\B(?=(\d{3})+(?!\d))/g, "'") + (s[1] ? "," + s[1] : ""); };
  const SUP = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
  const sup = (n) => String(n).split("").map((c) => SUP[c] || c).join("");
  const pw = (b, x) => (Number.isInteger(x) ? b + sup(x) : b + "^" + nb(x));
  const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;
  const T = (x, y, s, a = "middle", sz = 12, cls = "f-txt") => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${a}" font-size="${sz}">${s}</text>`;
  const L = (x1, y1, x2, y2, cls = "f-line", w = 1.6, dash) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
  const plain = (html) => `<div class="act-out">${html}</div>`;
  const tu = (x) => "tu proposes <b>" + nb(x) + "</b>";
  const parseNum = (s) => Number(String(s).replace(/,/g, ".").replace(/−/g, "-").replace(/\s|'/g, "").replace(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/, (m, u, w) => String(u / w)));
  // Facteur (x − z) écrit proprement : (x + 2), (x − 3).
  const fac = (z) => (z < 0 ? "(x + " + -z + ")" : "(x − " + z + ")");

  // Repère : o = { xr, yr, eq (même unité sur les deux axes), H, gx, gy, lx, ly, fns: [{ f, cls, w, dash, from, to }],
  //   vl: [[x, cls]], hl: [[y, cls]], segs: [[x1, y1, x2, y2, cls, w, dash]], circles: [[cx, cy, r, cls]],
  //   arrows: [[x1, y1, x2, y2, cls]], pts: [[x, y, étiquette, cls, position]], fy (format des graduations y), lab }
  let UID = 0;
  const graph = (o) => {
    // o.pad : marge à gauche (px) pour les graduations quand l'axe des x commence à 0 (grands nombres).
    const W = 320, m = 6, ml = m + (o.pad || 0), xr = o.xr, yr = o.yr, ux = (W - m - ml) / (xr[1] - xr[0]);
    const H = o.H || (o.eq ? Math.round((yr[1] - yr[0]) * ux + 2 * m) : 230), uy = (H - 2 * m) / (yr[1] - yr[0]);
    const X = (v) => +(ml + (v - xr[0]) * ux).toFixed(1), Y = (v) => +(H - m - (v - yr[0]) * uy).toFixed(1), id = "c2c" + ++UID;
    const gx = o.gx || 1, gy = o.gy || 1, lx = o.lx || gx * 2, ly = o.ly || gy * 2, fy = o.fy || nb;
    let g = "", c = "";
    for (let v = Math.ceil(xr[0] / gx) * gx; v <= xr[1] + 1e-9; v += gx) g += L(X(v), Y(yr[0]), X(v), Y(yr[1]), "f-grid", 0.7);
    for (let v = Math.ceil(yr[0] / gy) * gy; v <= yr[1] + 1e-9; v += gy) g += L(X(xr[0]), Y(v), X(xr[1]), Y(v), "f-grid", 0.7);
    const y0 = Math.min(Math.max(0, yr[0]), yr[1]), x0 = Math.min(Math.max(0, xr[0]), xr[1]);
    g += L(X(xr[0]), Y(y0), X(xr[1]), Y(y0), "f-line", 1.2) + L(X(x0), Y(yr[0]), X(x0), Y(yr[1]), "f-line", 1.2);
    for (let v = Math.ceil(xr[0] / lx) * lx; v <= xr[1] + 1e-9; v += lx) if (Math.abs(v) > 1e-9 && v < xr[1] - 1e-9) g += T(X(v), Math.min(Y(y0) + 13, H - 2), nb(+v.toFixed(6)), "middle", 10);
    for (let v = Math.ceil(yr[0] / ly) * ly; v <= yr[1] + 1e-9; v += ly) if (Math.abs(v) > 1e-9 && v < yr[1] - 1e-9) g += T(Math.max(X(x0) - 4, o.pad ? ml - 3 : 24), Y(v) + 3.5, fy(+v.toFixed(6)), "end", 10);
    const span = yr[1] - yr[0];
    for (const F of o.fns || []) {
      const a = Math.max(xr[0], F.from ?? -Infinity), b = Math.min(xr[1], F.to ?? Infinity), N = 360; let d = "", prev = null;
      for (let i = 0; i <= N; i++) { const x = a + ((b - a) * i) / N, y = F.f(x);
        if (!isFinite(y) || y < yr[0] - span || y > yr[1] + span || (prev !== null && Math.abs(y - prev) > span)) { prev = null; continue; }
        d += (prev === null ? "M" : "L") + X(x) + "," + Y(y) + " "; prev = y; }
      if (d) c += `<path d="${d}" class="${F.cls || "f-blue"}" fill="none" stroke-width="${F.w || 2.4}"${F.dash ? ' stroke-dasharray="5 4"' : ""}/>`;
    }
    for (const [x, cls] of o.vl || []) c += L(X(x), Y(yr[0]), X(x), Y(yr[1]), cls || "f-accent", 1.6, "6 4");
    for (const [y, cls] of o.hl || []) c += L(X(xr[0]), Y(y), X(xr[1]), Y(y), cls || "f-accent", 1.6, "6 4");
    for (const [x1, y1, x2, y2, cls, w, dash] of o.segs || []) c += L(X(x1), Y(y1), X(x2), Y(y2), cls || "f-line", w || 1.6, dash);
    for (const [cx, cy, r, cls] of o.circles || []) c += `<ellipse cx="${X(cx)}" cy="${Y(cy)}" rx="${(r * ux).toFixed(1)}" ry="${(r * uy).toFixed(1)}" class="${cls || "f-blue"}" fill="none" stroke-width="2.4"/>`;
    for (const [x1, y1, x2, y2, cls] of o.arrows || []) {
      const p = [X(x1), Y(y1)], q = [X(x2), Y(y2)], dx = q[0] - p[0], dy = q[1] - p[1], n = Math.hypot(dx, dy);
      if (n < 1) continue; const ex = dx / n, ey = dy / n, k = Math.min(11, n * 0.45), b = [q[0] - ex * k, q[1] - ey * k];
      c += L(p[0], p[1], b[0].toFixed(1), b[1].toFixed(1), cls || "f-blue", 2.6) + `<polygon points="${q[0]},${q[1]} ${(b[0] - ey * 5).toFixed(1)},${(b[1] + ex * 5).toFixed(1)} ${(b[0] + ey * 5).toFixed(1)},${(b[1] - ex * 5).toFixed(1)}" class="${cls === "f-accent" ? "f-headacc" : "f-head"}" style="${cls === "f-blue" || !cls ? "fill:var(--blue)" : ""}"/>`;
    }
    let p = "";
    for (const [x, y, lab, cls, pos] of o.pts || []) {
      if (x < xr[0] || x > xr[1] || y < yr[0] || y > yr[1]) continue;
      p += `<circle cx="${X(x)}" cy="${Y(y)}" r="5" class="${cls || "f-dot"}"/>`;
      if (lab) { const left = pos === "l" || (pos !== "r" && X(x) > W - 90); p += T(X(x) + (left ? -8 : 8), Y(y) + (pos === "b" ? 16 : -7), lab, left ? "end" : "start", 12); }
    }
    return svg(W, H, `<defs><clipPath id="${id}"><rect x="${ml}" y="${m}" width="${W - m - ml}" height="${H - 2 * m}"/></clipPath></defs>${g}<g clip-path="url(#${id})">${c}</g>${p}`, o.lab || "repère");
  };

  // ---------- brique « hunt » (réponse tapée) ----------
  // o et mk gardés sur la fonction : actPrep (active.js) peut ne garder que 2 questions (22.11).
  const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });
  const hunt0 = (o) => (box, onWin) => {
    let x = null, step = 0;
    const draw = () => {
      const s = Math.min(step, o.wins.length - 1), fig = x === null ? (o.blank ? o.blank(s) : "") : o.show(x, s);
      box.innerHTML = fig + actAnswerHtml(o.label || "Ta réponse") + (o.note ? `<div class="small muted">${o.note}</div>` : "");
      const inp = box.querySelector(".act-in"); if (x !== null) inp.value = nb(x).replace("−", "-");
      const go = () => { const v = parseNum(inp.value); if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre (fraction acceptée, par exemple 3/2)."); return; }
        x = v; draw(); if (!check()) { const mm = typeof o.miss === "function" ? o.miss(x, s) : o.miss; $hint(box, mm || (box.querySelector("svg.fig") ? "Pas encore : regarde la figure, puis recalcule." : "Pas encore : relis les calculs affichés, puis recalcule.")); } };
      actAnswerBind(box, go);
    };
    const check = () => { if (step >= o.wins.length) return false; const mm = o.wins[step](x); if (mm) { onWin(step, mm); step++; x = null; draw(); return true; } return false; };
    draw();
  };
  const W = (target, msg, tol = 1e-9) => (x) => (Math.abs(x - target) <= tol ? msg : "");

  // ---------- brique « slide » (curseurs) ----------
  // o = { ctl(step) → [{ k, lab, min, max, step }], init(step) → état, fig(st, step) → SVG, out(st, step) → texte,
  //       goal[step](st) → message ou "", miss(st, step) → indice (facultatif), ask[step] : { q, ans, tol, ok, no }, fmt(k, v, step), note }
  const slide = (o) => (box, onWin) => {
    let step = 0, st = null, asking = false;
    const start = () => {
      st = Object.assign({}, o.init(step)); asking = false;
      const cs = o.ctl(step);
      box.innerHTML = `<div class="s2c-fig"></div>` + cs.map((c) => `<label class="dyn-ctl"><span class="small">${c.lab} : <b class="s2c-v" data-k="${c.k}"></b></span><input type="range" data-k="${c.k}" min="${c.min}" max="${c.max}" step="${c.step || 1}" value="${st[c.k]}" aria-label="${c.lab}"></label>`).join("") +
        `<div class="act-out s2c-out" aria-live="polite"></div><div class="s2c-ask"></div><div class="small muted">${o.note || "Fais glisser " + (cs.length > 1 ? "les curseurs" : "le curseur") + " : on vérifie quand tu lâches."}</div>`;
      box.querySelectorAll('input[type="range"]').forEach((inp) => {
        inp.oninput = () => { if (asking) { inp.value = st[inp.dataset.k]; return; } st[inp.dataset.k] = +inp.value; refresh(); };
        inp.onchange = () => { if (asking) return; st[inp.dataset.k] = +inp.value; refresh(); check(); };
      });
      refresh();
    };
    const refresh = () => {
      box.querySelector(".s2c-fig").innerHTML = o.fig(st, step);
      box.querySelectorAll(".s2c-v").forEach((b) => (b.textContent = o.fmt ? o.fmt(b.dataset.k, st[b.dataset.k], step) : nb(st[b.dataset.k])));
      box.querySelector(".s2c-out").innerHTML = o.out(st, step);
    };
    const win = (mm) => { onWin(step, mm); step++; if (step < o.goal.length) start(); else { asking = true; box.querySelector(".s2c-ask").innerHTML = ""; } };
    const check = () => {
      if (asking || step >= o.goal.length) return;
      const mm = o.goal[step](st);
      if (!mm) { const t = o.miss && o.miss(st, step); if (t) $hint(box, t); else { const el = box.querySelector(".act-hint"); if (el) el.textContent = ""; } return; }
      const A = o.ask && o.ask[step];
      if (!A) { win(mm); return; }
      asking = true; const el = box.querySelector(".act-hint"); if (el) el.textContent = "";
      const ab = box.querySelector(".s2c-ask");
      ab.innerHTML = `<div class="act-out" style="margin-top:6px"><b>✓ ${mm}</b></div><div class="small" style="margin:6px 0"><b>À toi, sans la figure :</b> ${A.q}</div>${actAnswerHtml("")}`;
      if (typeof typeset === "function" && /\\\(/.test(A.q)) typeset(ab);
      const inp = ab.querySelector("input"), go = () => { const v = parseNum(inp.value);
        if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre (fraction acceptée, par exemple 3/2)."); return; }
        if (Math.abs(v - A.ans) <= (A.tol || 1e-9)) win(A.ok); else $hint(box, A.no || "Pas encore : reprends le raisonnement de la figure."); };
      actAnswerBind(ab, go);
    };
    start();
  };

  // =====================================================================================================
  // 1. Équations cartésiennes
  // =====================================================================================================
  // cart : points dans un repère ; la réponse place le milieu proposé, ou reporte la longueur proposée sur [AB].
  const CART = [
    { A: [-1, 2], B: [7, 8], n: ["A", "B"], xr: [-2, 8], yr: [-1, 9] },
    { A: [-1, 2], B: [7, 8], n: ["A", "B"], xr: [-2, 8], yr: [-1, 9] },
    { A: [-3, -2], B: [9, 3], n: ["P", "Q"], xr: [-4, 10], yr: [-3, 4], H: 190 },
  ];
  const cartFig = (s, x) => {
    const D = CART[s], [A, B] = [D.A, D.B], o = { xr: D.xr, yr: D.yr, H: D.H, segs: [[A[0], A[1], B[0], B[1], "f-line", 2]], pts: [[A[0], A[1], D.n[0] + "(" + nb(A[0]) + " ; " + nb(A[1]) + ")", "f-dot", "b"], [B[0], B[1], D.n[1] + "(" + nb(B[0]) + " ; " + nb(B[1]) + ")", "f-dot", "l"]], lab: "segment dans un repère" };
    if (s >= 1) o.segs.push([A[0], A[1], B[0], A[1], "f-accent", 1.4, "5 4"], [B[0], A[1], B[0], B[1], "f-accent", 1.4, "5 4"]);
    let out = "";
    if (x !== null && s === 0) { o.pts.push([x, 5, "M ?", "f-fill2"]); out = plain("Milieu proposé (" + nb(x) + " ; 5) → " + (x === 3 ? '<b class="act-ok">juste au milieu</b>' : "pas au milieu : compare les deux moitiés")); }
    if (x !== null && s >= 1) { const L0 = Math.hypot(B[0] - A[0], B[1] - A[1]), t = x / L0, P = [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t];
      o.pts.push([P[0], P[1], "", "f-fill2"]); out = plain("Longueur " + nb(x) + " reportée depuis " + D.n[0] + " : " + (Math.abs(t - 1) < 1e-9 ? '<b class="act-ok">on arrive pile sur ' + D.n[1] + "</b>" : t < 1 ? "on s'arrête avant " + D.n[1] : "on dépasse " + D.n[1])); }
    return graph(o) + out;
  };

  // cercle : centre (a ; b) et rayon r au curseur.
  const sqT = (v, n) => (v === 0 ? n + "²" : "(" + n + (v > 0 ? " − " : " + ") + Math.abs(v) + ")²");
  const CERC = [{ a: 2, b: -1, r: 3 }, { a: -1, b: 2, r: 5 }, { a: 3, b: -2, r: 4 }];

  // polydiv : schéma de Horner (défi 2).
  const horner = (cs, a, x) => {
    const sums = [cs[0]]; for (let i = 1; i < cs.length; i++) sums.push(sums[i - 1] * a + cs[i]);
    const cw = 56, x0 = 48, rows = [24, 56, 92];
    let g = L(x0 - 6, 6, x0 - 6, 104, "f-line", 1.4) + L(x0 - 6, 74, x0 + cw * cs.length, 74, "f-line", 1.4) + T(x0 - 18, rows[1] + 4, nb(a), "middle", 14, "f-txt f-accent");
    const known = x === null ? 2 : x === sums[2] ? 4 : 2;
    cs.forEach((c, i) => {
      const cx = x0 + cw * i + cw / 2;
      g += T(cx, rows[0] + 4, nb(c), "middle", 14);
      if (i >= 1 && i <= known && i < cs.length) g += T(cx, rows[1] + 4, nb(sums[i - 1] * a), "middle", 13, "f-txt f-blue");
      if (i < known) g += T(cx, rows[2] + 4, nb(sums[i]), "middle", 14, "f-txt f-blue");
      else if (i === 2) g += T(cx, rows[2] + 4, x === null ? "?" : nb(x), "middle", 15, "f-txt f-accent");
      else if (i === 3 && known === 4) g += T(cx, rows[2] + 4, nb(sums[3]), "middle", 14, "f-txt f-blue");
    });
    if (known === 4) g += T(x0 + cw * 3.5, 120, "reste", "middle", 11);
    return svg(300, 126, g, "schéma de Horner");
  };

  // polyexpr : f(x) = a · produit des facteurs.
  const PEX = [
    { z: [-1, 1, 2], t: [0, 4], txt: "(x + 1)(x − 1)(x − 2)", a: 2 },
    { z: [-2, 1, 3], t: [0, -3], txt: "(x + 2)(x − 1)(x − 3)", a: -0.5 },
    { z: [1, 1, -2], t: [0, 1], txt: "(x − 1)²(x + 2)", a: 0.5 },
  ];
  const pexF = (s, a) => (x) => a * PEX[s].z.reduce((p, z) => p * (x - z), 1);

  Object.assign(ACTIVE, {
    cart: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Distance : \\(AB = \\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}\\) (Pythagore dans le repère). Milieu \\(M\\) de \\([AB]\\) : la moyenne des abscisses et la moyenne des ordonnées.", piege: "Pour la distance, on élève les écarts au carré avant d'additionner : \\(\\sqrt{8^2 + 6^2} = 10\\), pas \\(8 + 6\\)." },
      predict: { q: "A(1 ; 2) et B(7 ; 10). Le milieu du segment [AB] est…", choices: ["(4 ; 6)", "(3 ; 4)", "(8 ; 12)"], good: 0,
        why: "On fait la moyenne des abscisses, (1 + 7) ÷ 2 = 4, et celle des ordonnées, (2 + 10) ÷ 2 = 6. (3 ; 4), c'est la moitié du déplacement de A vers B ; (8 ; 12), la somme des coordonnées." },
      defis: ["A(−1 ; 2) et B(7 ; 8) : quelle est l'abscisse du milieu M de [AB] ?", "Même segment : on avance de 8 et on monte de 6 (pointillés). Quelle est la longueur AB ?", "Un drone vole en ligne droite de P(−3 ; −2) à Q(9 ; 3) (1 unité = 100 m). Combien d'unités parcourt-il ?"],
      play: hunt({ ask: true, label: "Ta réponse", blank: (s) => cartFig(s, null), show: (x, s) => cartFig(s, x),
        miss: (x, s) => ["Moyenne des deux abscisses : (−1 + 7) ÷ 2.", "Pythagore dans le triangle en pointillés : √(8² + 6²).", "Avance de 12, monte de 5 : √(12² + 5²)."][s],
        wins: [W(3, "(−1 + 7) ÷ 2 = 3 ; et (2 + 8) ÷ 2 = 5 : M(3 ; 5)."), W(10, "AB = √(8² + 6²) = √100 = 10 : c'est Pythagore dans le repère."), W(13, "√(12² + 5²) = √169 = 13 unités, soit 1,3 km.")] }),
    },
    cercle: {
      predict: { q: "Le cercle d'équation (x − 2)² + (y + 1)² = 9 a pour centre et pour rayon…", choices: ["(2 ; −1) et 3", "(−2 ; 1) et 3", "(2 ; −1) et 9"], good: 0,
        why: "(x − a)² + (y − b)² = r² : on lit a = 2 et b = −1 (le signe change dans la parenthèse) ; le second membre vaut r², donc r = 3." },
      defis: ["Règle les curseurs pour tracer le cercle (x − 2)² + (y + 1)² = 9.", "Trace le cercle de centre (−1 ; 2) qui passe par le point P(2 ; 6).", "Trace le cercle x² − 6x + y² + 4y = 3 (complète les carrés)."],
      play: slide({
        ctl: () => [{ k: "a", lab: "Centre : abscisse a", min: -5, max: 5 }, { k: "b", lab: "Centre : ordonnée b", min: -5, max: 5 }, { k: "r", lab: "Rayon r", min: 1, max: 6 }],
        init: (s) => [{ a: 0, b: 0, r: 2 }, { a: 2, b: -1, r: 3 }, { a: 0, b: 1, r: 2 }][s],
        fig: (st, s) => graph({ xr: [-7, 7], yr: [-7, 8], eq: true, circles: [[st.a, st.b, st.r, "f-blue"]], segs: [[st.a, st.b, st.a + st.r, st.b, "f-accent", 1.6, "4 3"]],
          pts: [[st.a, st.b, "", "f-dot"]].concat(s === 1 ? [[2, 6, "P(2 ; 6)", "f-fill2", "l"]] : []), lab: "cercle dans un repère" }),
        out: (st) => "Équation : <b>" + sqT(st.a, "x") + " + " + sqT(st.b, "y") + " = " + st.r * st.r + "</b><br><span class=\"small\">centre (" + nb(st.a) + " ; " + nb(st.b) + "), rayon " + st.r + "</span>",
        goal: CERC.map((C, s) => (st) => (st.a === C.a && st.b === C.b && st.r === C.r ? ["Centre (2 ; −1) et rayon 3 : le 9 du second membre est r².", "La distance du centre à P vaut √(3² + 4²) = √25 = 5 : c'est le rayon.", "(x − 3)² − 9 + (y + 2)² − 4 = 3, donc (x − 3)² + (y + 2)² = 16 : centre (3 ; −2), rayon 4."][s] : "")),
        miss: (st, s) => (s === 1 && st.a === -1 && st.b === 2 ? "Le centre est bon. Le rayon est la distance du centre à P : avance de 3, monte de 4." : s === 0 && st.a === 2 && st.b === -1 && st.r === 9 ? "" : s === 2 && st.a === 3 && st.b === -2 ? "Le centre est bon. Le second membre devient 3 + 9 + 4." : ""),
        ask: [null, { q: "rayon du cercle de centre (0 ; 0) qui passe par (−5 ; 12) ?", ans: 13, ok: "√(25 + 144) = √169 = 13.", no: "Distance de (0 ; 0) à (−5 ; 12) : √(5² + 12²)." }, null] }),
    },
    polydiv: {
      predict: { q: "17 divisé par 5 donne 3, reste 2 : 17 = 3 · 5 + 2. On divise P(x) = x² + x + 4 par (x − 1). Le reste vaut…", choices: ["6", "4", "0"], good: 0,
        why: "x² + x + 4 = (x − 1)(x + 2) + 6 : le reste est 6. C'est aussi P(1) = 1 + 1 + 4 = 6 : pour diviser par (x − a), le reste vaut P(a)." },
      defis: ["Quel est le reste de la division de P(x) = x³ − 2x + 7 par (x + 2) ?", "Schéma de Horner : P(x) = 2x³ − 3x² − 4x + 7 divisé par (x − 2). On abaisse 2 ; 2 · 2 = 4 et −3 + 4 = 1 ; puis 1 · 2 = 2. Quel nombre va sous −4 ?", "Pour quelle valeur de k le polynôme x³ − 3x² + kx + 10 est-il divisible par (x − 2) ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        blank: (s) => [plain("Dans le « Devine », diviser par (x − 1) donnait le reste P(1)."), horner([2, -3, -4, 7], 2, null), plain("Divisible par (x − 2) : la division tombe juste, le reste vaut 0.")][s],
        show: (x, s) => [plain(tu(x)), horner([2, -3, -4, 7], 2, x), plain("Avec k = " + nb(x) + " : P(2) = 8 − 12 + 2 · " + (x < 0 ? "(" + nb(x) + ")" : nb(x)) + " + 10 = <b>" + nb(6 + 2 * x) + "</b>" + (6 + 2 * x === 0 ? ' <b class="act-ok">reste nul</b>' : ""))][s],
        miss: (x, s) => ["Diviser par (x + 2), c'est diviser par (x − (−2)) : calcule P(−2).", "On ajoute −4 et le produit 2 qu'on vient d'écrire au-dessus.", "Il faut P(2) = 0."][s],
        wins: [W(3, "P(−2) = −8 + 4 + 7 = 3. Attention au signe : (x + 2) = (x − (−2))."), W(-2, "−4 + 2 = −2 ; puis −2 · 2 = −4 et 7 − 4 = 3 : quotient 2x² + x − 2, reste 3 (= P(2))."), W(-3, "P(2) = 8 − 12 + 2k + 10 = 6 + 2k = 0, donc k = −3.")] }),
    },
    polyfact: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { piege: "On ne teste que les diviseurs du terme constant : pour 6, ce sont \\(\\pm 1\\), \\(\\pm 2\\), \\(\\pm 3\\), \\(\\pm 6\\) (ni 4, ni 5)." },
      predict: { q: "P(x) = x³ − 2x² − 5x + 6. Lequel de ces nombres a une chance d'être une racine entière de P ?", choices: ["4", "3", "5"], good: 1,
        why: "Une racine entière divise le terme constant 6 : on ne teste que ±1, ±2, ±3, ±6. 4 et 5 ne divisent pas 6. Et en effet P(3) = 27 − 18 − 15 + 6 = 0." },
      defis: ["P(x) = x³ − 4x² + x + 6. Teste les diviseurs de 6 : quelle est la plus petite racine positive ?", "On divise par (x − 2) : le quotient est x² − 2x − 3. Quelle est la plus grande racine de P ?", "Résous x³ − 7x + 6 = 0 : quelle est la racine négative ?"],
      play: hunt({ ask: true, label: "Racine", show: (x, s) => plain(s === 2 ? "P(" + nb(x) + ") = " + nb(x ** 3 - 7 * x + 6) : s === 1 ? "x² − 2x − 3 en " + nb(x) + " : " + nb(x * x - 2 * x - 3) : "P(" + nb(x) + ") = " + nb(x ** 3 - 4 * x * x + x + 6)),
        miss: (x, s) => ["Calcule P(1), P(2), P(3)… jusqu'à trouver 0.", "Factorise x² − 2x − 3 : deux nombres de produit −3 et de somme −2.", "Racine évidente parmi les diviseurs de 6 (essaie 1), puis divise et factorise le quotient."][s],
        wins: [W(2, "P(1) = 4, mais P(2) = 8 − 16 + 2 + 6 = 0 : 2 est une racine évidente."), W(3, "x² − 2x − 3 = (x − 3)(x + 1) : P(x) = (x − 2)(x − 3)(x + 1), racines −1, 2 et 3."), W(-3, "P(1) = 0 ; quotient x² + x − 6 = (x − 2)(x + 3) : racines 1, 2 et −3.")] }),
    },
    polyexpr: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { exemple: ["Zéros \\(-1, 1, 2\\) et \\(f(0) = 4\\) : \\(a \\cdot 1 \\cdot (-1) \\cdot (-2) = 4\\), donc \\(a = 2\\)", "Zéro double en 1 : \\(f(x) = a(x - 1)^2(x + 2)\\), \\(f(0) = 2a = 1\\), donc \\(a = 0{,}5\\)"] },
      predict: { q: "Une fonction polynomiale de degré 3 s'annule en −1, en 1 et en 2. Son expression peut être…", choices: ["(x + 1)(x − 1)(x − 2)", "(x − 1)(x + 1)(x + 2)", "x³ − 2"], good: 0,
        why: "Chaque zéro z donne un facteur (x − z) : −1 donne (x + 1), 1 donne (x − 1) et 2 donne (x − 2). Il peut encore y avoir un nombre a devant : a(x + 1)(x − 1)(x − 2)." },
      defis: ["f(x) = a(x + 1)(x − 1)(x − 2). Règle a pour que la courbe passe par le point (0 ; 4).", "f(x) = a(x + 2)(x − 1)(x − 3). Règle a pour que la courbe passe par (0 ; −3).", "Zéro double en 1 : f(x) = a(x − 1)²(x + 2). Règle a pour que la courbe passe par (0 ; 1)."],
      play: slide({
        ctl: () => [{ k: "a", lab: "Coefficient a", min: -3, max: 3, step: 0.5 }],
        init: () => ({ a: 1 }),
        fig: (st, s) => graph({ xr: [-3, 4], yr: [-8, 8], gy: 2, fns: [{ f: pexF(s, st.a) }], pts: [[PEX[s].t[0], PEX[s].t[1], "(" + PEX[s].t.map(nb).join(" ; ") + ")", "f-dot", "r"]].concat([...new Set(PEX[s].z)].map((z) => [z, 0, "", "f-fill2"])), lab: "courbe d'une fonction de degré 3" }),
        out: (st, s) => "f(x) = " + nb(st.a) + " · " + PEX[s].txt + "<br>f(0) = <b>" + nb(pexF(s, st.a)(0)) + "</b> (on veut " + nb(PEX[s].t[1]) + ")",
        goal: PEX.map((P, s) => (st) => (st.a === P.a ? ["f(0) = a · 1 · (−1) · (−2) = 2a = 4, donc a = 2.", "f(0) = a · 2 · (−1) · (−3) = 6a = −3, donc a = −0,5 : la courbe descend à droite.", "f(0) = a · 1 · 2 = 2a = 1, donc a = 0,5. En 1, la courbe touche l'axe sans le traverser : zéro double."][s] : "")),
        miss: (st, s) => (pexF(s, st.a)(0) !== PEX[s].t[1] ? "Les zéros ne bougent pas : a étire la courbe. Calcule f(0) avec a, puis égale à " + nb(PEX[s].t[1]) + "." : ""),
        ask: [null, { q: "zéros −1, 2 et 4, et f(0) = −24. Que vaut a ?", ans: -3, ok: "f(0) = a · 1 · (−2) · (−4) = 8a = −24, donc a = −3.", no: "f(x) = a(x + 1)(x − 2)(x − 4) : calcule f(0) en fonction de a." }, null] }),
    },
  });

  // =====================================================================================================
  // 4. Fonctions rationnelles
  // =====================================================================================================
  // homog : f(x) = (ax + 1)/(x + d) ; asymptotes en pointillés (l'horizontale seulement à partir du défi 2).
  const homT = (a, d) => "(" + (a === 0 ? "1" : (a === 1 ? "" : a === -1 ? "−" : nb(a)) + "x + 1") + ") ÷ (x " + (d < 0 ? "− " + -d : "+ " + d) + ")";
  // homogrec : f et f⁻¹ symétriques par rapport à la droite y = x.
  const HR = [
    { f: (x) => 3 / (x - 2), xr: [-3, 8], yr: [-3, 8] },
    { f: (x) => (2 * x + 1) / (x - 3), xr: [-6, 10], yr: [-6, 10] },
    { f: (x) => (4 * x - 1) / (x + 2), xr: [-10, 8], yr: [-8, 10] },
  ];
  const hrFig = (s, x) => {
    const D = HR[s], o = { xr: D.xr, yr: D.yr, eq: true, gx: s ? 2 : 1, lx: s ? 4 : 2, fns: [{ f: (t) => t, cls: "f-line", w: 1.2, dash: true }, { f: D.f }], pts: [], lab: "fonction homographique et droite y = x" };
    let out = "";
    if (x !== null && s === 0) { o.pts.push([x, D.f(x), "(" + nb(x) + " ; " + nb(+D.f(x).toFixed(3)) + ")", "f-fill2"]); out = plain("f(" + nb(x) + ") = 3 ÷ (" + nb(x) + " − 2) = <b>" + (x === 2 ? "impossible" : nb(+D.f(x).toFixed(4))) + "</b> (on veut 6)"); }
    if (x !== null && s === 1) { o.fns.push({ f: (t) => (3 * t + 1) / (t - x), cls: "f-accent", w: 2 }); out = plain("En rouge, (3x + 1) ÷ (x − " + nb(x) + ") : " + (x === 2 ? '<b class="act-ok">symétrique de f par rapport à y = x</b>' : "pas le symétrique de f")); }
    if (x !== null && s === 2) { o.fns.push({ f: (t) => (2 * t + 1) / (4 - t), cls: "f-accent", w: 2 }); o.hl = [[x, "f-accent"]]; out = plain("En rouge, f⁻¹ ; ta droite y = " + nb(x) + (x === -2 ? ' <b class="act-ok">est bien son asymptote</b>' : " n'est pas son asymptote")); }
    return graph(o) + out;
  };

  Object.assign(ACTIVE, {
    fracetage: {
      predict: { q: "Que vaut \\(\\dfrac{\;\\frac{1}{2}\;}{\;\\frac{1}{4}\;}\\) ?", choices: ["2", "1/8", "1/2"], good: 0,
        why: "Diviser par 1/4, c'est multiplier par 4 : 1/2 · 4 = 2. Il y a bien deux quarts dans une moitié." },
      defis: ["Calcule \\(\\dfrac{1 + \\frac{1}{3}}{1 - \\frac{1}{3}}\\).", "Pour \\(x = 4\\), calcule \\(\\dfrac{1 + \\frac{2}{x}}{1 - \\frac{2}{x}}\\).", "\\(\\dfrac{\;\\frac{6}{x}\;}{\;\\frac{2}{x^2}\;} = k \\cdot x\\). Que vaut \\(k\\) ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["étage du haut : 1 + 1/3 = 4/3 ; étage du bas : 1 − 1/3 = 2/3", "on multiplie haut et bas par x : (x + 2) ÷ (x − 2)", "6/x · x²/2 (on multiplie par l'inverse du bas)"][s] + " ; " + tu(x)),
        wins: [W(2, "(4/3) ÷ (2/3) = 4/3 · 3/2 = 2. Ou : on multiplie haut et bas par 3, (3 + 1) ÷ (3 − 1) = 2."), W(3, "(1 + 1/2) ÷ (1 − 1/2) = 1,5 ÷ 0,5 = 3 ; et (x + 2) ÷ (x − 2) = 6 ÷ 2 = 3."), W(3, "6/x · x²/2 = 6x²/(2x) = 3x, donc k = 3.")] }),
    },
    eqrat: {
      predict: { q: "Pour résoudre 6 ÷ (x − 1) = 2, que vaut-il mieux dire de x = 1 ?", choices: ["il est interdit", "c'est la solution", "c'est une solution parmi d'autres"], good: 0,
        why: "x = 1 annule le dénominateur : 6 ÷ 0 n'existe pas. On le note d'abord, puis on résout : 6 = 2(x − 1), x = 4, qui est permis." },
      defis: ["Résous \\(\\dfrac{12}{x + 2} = 3\\).", "Résous \\(\\dfrac{x + 3}{x - 1} = \\dfrac{5}{2}\\) (fraction acceptée).", "Résous \\(\\dfrac{x^2}{x - 3} = \\dfrac{9}{x - 3}\\)."],
      play: hunt({ ask: true, label: "x =", show: (x, s) => plain([x === -2 ? "x = −2 est interdit !" : "12 ÷ (" + nb(x) + " + 2) = " + nb(+(12 / (x + 2)).toFixed(4)) + " (on veut 3)",
        x === 1 ? "x = 1 est interdit !" : "(" + nb(x) + " + 3) ÷ (" + nb(x) + " − 1) = " + nb(+((x + 3) / (x - 1)).toFixed(4)) + " (on veut 2,5)",
        x === 3 ? "x = 3 annule le dénominateur : 9 ÷ 0 n'existe pas, cette valeur est interdite !" : "x² = " + nb(x * x) + " (on veut 9)"][s]),
        miss: (x, s) => ["Multiplie les deux membres par (x + 2) : 12 = 3(x + 2).", "Produit en croix : 2(x + 3) = 5(x − 1).", x === 3 ? "3 est interdit : cherche l'autre solution de x² = 9." : "Multiplie par (x − 3) : x² = 9."][s],
        wins: [W(2, "12 = 3x + 6, donc x = 2 (permis : seul −2 est interdit)."), W(11 / 3, "2x + 6 = 5x − 5, donc 3x = 11 et x = 11/3."), W(-3, "x² = 9 donne 3 ou −3 ; 3 est interdit : la seule solution est −3.")] }),
    },
    probrat: {
      predict: { q: "Un robinet remplit une citerne en 3 h, un autre en 6 h. Ouverts ensemble, ils la remplissent en…", choices: ["2 h", "4 h 30", "9 h"], good: 0,
        why: "En 1 h, le premier remplit 1/3 de la citerne, le second 1/6 : ensemble 1/3 + 1/6 = 1/2. Il faut donc 2 h. Ensemble, on va plus vite que le plus rapide !" },
      defis: ["Anna repeint une clôture en 4 h, Ben en 12 h. Ensemble, en combien d'heures ?", "Deux imprimantes impriment ensemble un lot en 6 min ; la première, seule, en 10 min. Combien de minutes met la seconde, seule ?", "Un cycliste parcourt 60 km. S'il roulait 5 km/h plus vite, il mettrait 1 h de moins. Quelle est sa vitesse (km/h) ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        show: (x, s) => plain([x > 0 ? "En 1 h : 1/4 + 1/12 de la clôture ; en " + nb(x) + " h ensemble, ils en feraient " + nb(+(x / 3).toFixed(3)) + " fois la clôture" : tu(x),
          x > 0 ? "1/10 + 1/" + nb(x) + " = " + nb(+(1 / 10 + 1 / x).toFixed(4)) + " du lot par minute (il faut 1/6 ≈ 0,1667)" : tu(x),
          x > 0 ? "à " + nb(x) + " km/h : " + nb(+(60 / x).toFixed(3)) + " h ; à " + nb(x + 5) + " km/h : " + nb(+(60 / (x + 5)).toFixed(3)) + " h ; écart " + nb(+(60 / x - 60 / (x + 5)).toFixed(3)) + " h" : tu(x)][s]),
        miss: (x, s) => ["En 1 h : 1/4 + 1/12 = 1/t.", "1/10 + 1/t = 1/6, donc 1/t = 1/6 − 1/10.", "60/v − 60/(v + 5) = 1 ; essaie des vitesses et regarde l'écart."][s],
        wins: [W(3, "1/4 + 1/12 = 3/12 + 1/12 = 4/12 = 1/3 de la clôture par heure : 3 h ensemble."), W(15, "1/t = 1/6 − 1/10 = 5/30 − 3/30 = 2/30 = 1/15 : 15 min."), W(15, "60/v − 60/(v + 5) = 1 donne v² + 5v − 300 = 0, soit (v − 15)(v + 20) = 0 : 15 km/h (4 h, contre 3 h à 20 km/h).")] }),
    },
    homog: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Asymptote verticale : là où le dénominateur s'annule, \\(x = -\\frac{d}{c}\\). Asymptote horizontale : pour x très grand, seuls les termes en \\(x\\) comptent, \\(y = \\frac{a}{c}\\).", exemple: ["\\(f(x) = \\frac{2x + 1}{x - 3}\\) : asymptote verticale \\(x = 3\\), horizontale \\(y = 2\\)."] },
      predict: { q: "f(x) = (2x + 1) ÷ (x − 3). Pour quelle valeur de x la fonction n'existe-t-elle pas ?", choices: ["3", "−3", "−1/2"], good: 0,
        why: "x = 3 annule le dénominateur. Près de 3, la courbe file vers le haut ou le bas : elle longe une droite verticale sans la toucher, l'asymptote verticale x = 3." },
      defis: ["f(x) = (ax + 1) ÷ (x + d). Règle d pour placer l'asymptote verticale en x = 3.", "Quand x devient très grand, la courbe longe une droite horizontale : l'asymptote horizontale. Règle a pour qu'elle soit y = −2.", "Règle a et d pour que la courbe passe par (0 ; 0,5) et ait pour asymptote horizontale y = 3."],
      play: slide({
        ctl: () => [{ k: "a", lab: "a (devant x en haut)", min: -4, max: 4 }, { k: "d", lab: "d (en bas)", min: -4, max: 4 }],
        init: (s) => [{ a: 1, d: 2 }, { a: 1, d: -3 }, { a: -2, d: -3 }][s],
        fig: (st, s) => graph({ xr: [-7, 7], yr: [-7, 7], eq: true, fns: [{ f: (x) => (st.a * x + 1) / (x + st.d) }], vl: [[-st.d, "f-accent"]], hl: s ? [[st.a, "f-accent"]] : [],
          pts: s === 2 ? [[0, 0.5, "(0 ; 0,5)", "f-dot", "r"]] : [], lab: "hyperbole et ses asymptotes" }),
        out: (st, s) => "f(x) = " + homT(st.a, st.d) + "<br>asymptote verticale <b>x = " + nb(-st.d) + "</b>" + (s ? " ; asymptote horizontale <b>y = " + nb(st.a) + "</b>" : "") + (st.a * st.d === 1 ? '<br><span class="small">Cas particulier : le haut et le bas se simplifient, la courbe devient une droite.</span>' : st.d === 0 ? "" : s === 2 ? '<br><span class="small">f(0) = 1 ÷ ' + nb(st.d) + " = " + nb(+(1 / st.d).toFixed(3)) + "</span>" : ""),
        goal: [(st) => (st.d === -3 && st.a * st.d !== 1 ? "d = −3 : le dénominateur x − 3 s'annule en 3, d'où l'asymptote x = 3." : ""),
          (st) => (st.a === -2 && st.d === -3 ? "Pour x très grand, (−2x + 1) ÷ (x − 3) ≈ −2x ÷ x = −2 : le rapport des nombres devant x." : ""),
          (st) => (st.a === 3 && st.d === 2 ? "f(0) = 1 ÷ d = 0,5 donne d = 2, et le rapport 3 ÷ 1 donne l'asymptote y = 3." : "")],
        miss: (st, s) => (s === 2 && st.a === 3 ? "L'asymptote est bonne. Pour f(0) = 0,5, il faut 1 ÷ d = 0,5." : s === 2 && st.d === 2 ? "f(0) est bon. L'asymptote horizontale dépend de a." : ""),
        ask: [null, { q: "f(x) = \\(\\dfrac{6x - 1}{2x + 4}\\). Asymptote horizontale : y = ?", ans: 3, ok: "6x ÷ 2x = 3 : asymptote y = 3 (les nombres −1 et 4 ne comptent pas).", no: "Pour x très grand, seuls les termes en x comptent : 6x ÷ 2x." }, null] }),
    },
    homogrec: {
      predict: { q: "f(x) = 3 ÷ (x − 2). On sait que f(5) = 1. Que vaut f⁻¹(1) ?", choices: ["5", "1", "1/5"], good: 0,
        why: "La réciproque défait ce que fait f : f envoie 5 sur 1, donc f⁻¹ renvoie 1 sur 5. Sur le graphe, (5 ; 1) devient (1 ; 5) : symétrie par rapport à la droite y = x." },
      defis: ["f(x) = 3 ÷ (x − 2). Calcule f⁻¹(6), c'est-à-dire le x tel que f(x) = 6.", "f(x) = (2x + 1) ÷ (x − 3). En isolant x dans y = f(x), on trouve f⁻¹(x) = (3x + 1) ÷ (x − c). Que vaut c ?", "f(x) = (4x − 1) ÷ (x + 2). L'asymptote horizontale de f⁻¹ est y = … ?"],
      play: hunt({ ask: true, label: "Ta réponse", blank: (s) => hrFig(s, null), show: (x, s) => hrFig(s, x),
        miss: (x, s) => ["3 ÷ (x − 2) = 6 donne x − 2 = 3 ÷ 6.", "y(x − 3) = 2x + 1, donc xy − 2x = 3y + 1 : mets x en évidence.", "Ce qui est vertical pour f devient horizontal pour f⁻¹ (symétrie par rapport à y = x)."][s],
        wins: [W(2.5, "x − 2 = 0,5, donc f⁻¹(6) = 2,5 ; le point (2,5 ; 6) de f devient (6 ; 2,5) sur f⁻¹."), W(2, "x(y − 2) = 3y + 1, donc x = (3y + 1) ÷ (y − 2) ; on échange les lettres, donc c = 2."), W(-2, "f a pour asymptote verticale x = −2 ; par symétrie, f⁻¹ a pour asymptote horizontale y = −2.")] }),
    },
  });

  // =====================================================================================================
  // 5. Exponentielles
  // =====================================================================================================
  const EXPT = [[2, 9], [-2, 4], [3, 8]];
  // modexp : trois modèles (intérêts, bactéries, radioactivité) ; le curseur fait avancer le temps.
  const MOD = [
    { f: (t) => 1000 * 1.05 ** t, max: 20, lab: "Années", seuil: 1500, xr: [0, 20], pad: 34, yr: [0, 2800], gx: 1, lx: 4, gy: 250, ly: 1000, t0: 3, ok: 9,
      txt: (t, v) => "Après " + t + " an" + (t > 1 ? "s" : "") + " : 1'000 · " + pw("1,05", t) + " ≈ <b>" + mil(v) + " CHF</b>" },
    { f: (t) => 1000 * 2 ** (t / 3), max: 21, lab: "Heures", seuil: 50000, xr: [0, 21], pad: 46, yr: [0, 130000], gx: 1, lx: 3, gy: 10000, ly: 20000, t0: 6, ok: 17,
      txt: (t, v) => "Après " + t + " h : 1'000 · 2^(" + t + "/3) ≈ <b>" + mil(v, 0) + " bactéries</b>" },
    { f: (t) => 80 * 0.5 ** (t / 8), max: 40, lab: "Jours", seuil: 10, xr: [0, 40], pad: 22, yr: [0, 85], gx: 2, lx: 8, gy: 5, ly: 20, t0: 4, ok: 24,
      txt: (t, v) => "Après " + t + " jour" + (t > 1 ? "s" : "") + " : 80 · 0,5^(" + t + "/8) ≈ <b>" + mil(v) + " g</b>" },
  ];
  // compo : machines enchaînées x → [1re] → [2e].
  const mach = (y, inp, A, B, mid, out) => {
    const box = (x0, nm, fx) => `<rect x="${x0}" y="${y}" width="84" height="38" rx="8" class="f-fill2"/>` + T(x0 + 42, y + 15, nm, "middle", 13, "f-txt f-blue") + T(x0 + 42, y + 32, fx, "middle", 14);
    const ar = (x1, x2) => L(x1, y + 19, x2 - 6, y + 19, "f-line", 1.4) + `<polygon points="${x2},${y + 19} ${x2 - 7},${y + 15} ${x2 - 7},${y + 23}" class="f-head"/>`;
    return T(14, y + 24, inp, "middle", 14) + ar(26, 46) + box(46, A[0], A[1]) + ar(130, 150) + T(166, y + 24, mid, "middle", 13, mid === "?" ? "f-txt" : "f-txt f-blue") + ar(182, 202) + box(202, B[0], B[1]) + ar(286, 300) + T(312, y + 24, out, "middle", 13, "f-txt f-accent");
  };
  const COMP = [
    { inp: 3, A: ["g", "x²"], B: ["f", "2x + 1"], mid: 9, out: 19 },
    { inp: 3, A: ["f", "2x + 1"], B: ["g", "x²"], mid: 7, out: 49 },
  ];
  const compoFig = (s, x) => {
    if (s < 2) { const C = COMP[s], good = x === C.out; return svg(330, 50, mach(6, C.inp, C.A, C.B, good ? C.mid : "?", x === null ? "?" : nb(x)), "deux machines enchaînées") + (x === null ? "" : plain(good ? '<b class="act-ok">La sortie est juste.</b>' : "Sortie proposée " + nb(x) + " : refais passer " + C.inp + " dans la 1re machine, puis le résultat dans la 2e.")); }
    const good = x === -52;
    return svg(330, 104, T(4, 10, "f ∘ g : g d'abord", "start", 11) + mach(14, "−2", ["g", "x² + 1"], ["f", "3x − 2"], good ? "5" : "?", good ? "13" : "?") + T(4, 66, "g ∘ f : f d'abord", "start", 11) + mach(70, "−2", ["f", "3x − 2"], ["g", "x² + 1"], good ? "−8" : "?", good ? "65" : "?"), "deux enchaînements de machines") + (x === null ? "" : plain(tu(x)));
  };

  Object.assign(ACTIVE, {
    expo: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\(y = b^x\\) : quand x augmente de 1, on multiplie par \\(b\\). Si \\(b > 1\\), la courbe monte ; si \\(0 < b < 1\\), elle descend. Pour résoudre \\(b^{\\ldots} = b^{\\ldots}\\), on écrit les deux membres avec la même base et on égale les exposants.", exemple: ["\\(y = b^x\\) passe par \\((2 ; 9)\\) : \\(b^2 = 9\\), \\(b = 3\\)", "\\(4^x = 8\\) : \\(2^{2x} = 2^3\\), donc \\(x = \\frac{3}{2}\\)"], piege: "Écris d'abord les deux membres avec la même base : \\(4^x = (2^2)^x = 2^{2x}\\)." },
      predict: { q: "On plie une feuille de papier en deux, puis encore en deux… 10 fois de suite. Combien d'épaisseurs obtient-on ?", choices: ["20", "100", "1'024"], good: 2,
        why: "Chaque pliage multiplie le nombre d'épaisseurs par 2 : 2¹⁰ = 1'024. Multiplier par le même nombre à chaque étape, c'est une croissance exponentielle." },
      defis: ["Règle la base b pour que la courbe y = bˣ passe par le point (2 ; 9).", "Règle b pour que la courbe passe par (−2 ; 4). Que fait-elle quand x augmente ?", "Règle b pour que la courbe passe par (3 ; 8)."],
      play: slide({
        ctl: () => [{ k: "b", lab: "Base b", min: 0.25, max: 4, step: 0.25 }],
        init: () => ({ b: 1.5 }),
        fig: (st, s) => graph({ xr: [-3, 4], yr: [-1, 10], fns: [{ f: (x) => st.b ** x }], pts: [[EXPT[s][0], EXPT[s][1], "(" + EXPT[s].map(nb).join(" ; ") + ")", "f-dot", "r"], [EXPT[s][0], st.b ** EXPT[s][0], "", "f-fill2"]], lab: "courbe exponentielle" }),
        out: (st, s) => "y = " + nb(st.b) + "ˣ ; en x = " + nb(EXPT[s][0]) + " : " + pw(nb(st.b), EXPT[s][0]) + " = <b>" + nb(+(st.b ** EXPT[s][0]).toFixed(4)) + "</b> (on veut " + EXPT[s][1] + ")" + (st.b === 1 ? '<br><span class="small">Base 1 : 1ˣ = 1 pour tout x, la courbe est plate.</span>' : ""),
        goal: [(st) => (st.b === 3 ? "3² = 9 : la base 3 multiplie y par 3 chaque fois que x avance de 1." : ""),
          (st) => (st.b === 0.5 ? "0,5⁻² = 1 ÷ 0,5² = 1 ÷ 0,25 = 4. Base entre 0 et 1 : la courbe descend, c'est une décroissance." : ""),
          (st) => (st.b === 2 ? "2³ = 8. Toutes ces courbes passent par (0 ; 1), car b⁰ = 1." : "")],
        ask: [null, { q: "résous \\(2^x = \\dfrac{1}{8}\\).", ans: -3, ok: "1/8 = 1/2³ = 2⁻³, donc x = −3.", no: "Écris 1/8 comme une puissance de 2 (exposant négatif)." },
          { q: "résous \\(4^x = 8\\) (écris 4 et 8 comme puissances de 2).", ans: 1.5, ok: "4ˣ = 2²ˣ et 8 = 2³ : 2x = 3, donc x = 1,5.", no: "4ˣ = (2²)ˣ = 2²ˣ ; et 8 = 2³. Égale les exposants." }] }),
    },
    expfrac: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\(a^{\\frac{1}{n}} = \\sqrt[n]{a}\\) et \\(a^{\\frac{p}{n}} = \\left(\\sqrt[n]{a}\\right)^p\\) (pour \\(a > 0\\)) : la racine, puis la puissance. Les règles restent vraies : \\(a^r \\cdot a^s = a^{r + s}\\), \\(a^{-r} = \\frac{1}{a^r}\\).", exemple: ["\\(9^{\\frac{1}{2}} = \\sqrt{9} = 3\\)", "\\(8^{\\frac{2}{3}} = (\\sqrt[3]{8})^2 = 4\\)", "\\(16^{-\\frac{3}{4}} = \\frac{1}{(\\sqrt[4]{16})^3} = \\frac{1}{8}\\)"] },
      predict: { q: "Que vaut \\(9^{\\frac{1}{2}}\\) ?", choices: ["4,5", "3", "81"], good: 1,
        why: "9^(1/2) · 9^(1/2) = 9^(1/2 + 1/2) = 9¹ = 9 : c'est le nombre positif qui, multiplié par lui-même, donne 9, donc √9 = 3. L'exposant 1/2 ne divise pas par 2 !" },
      defis: ["Calcule \\(125^{\\frac{1}{3}}\\).", "Calcule \\(8^{\\frac{2}{3}}\\).", "Calcule \\(16^{-\\frac{3}{4}}\\) (fraction acceptée)."], garde: [1, 2], // la 1re reprend le « Devine »
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["125^(1/3) : le nombre dont le cube vaut 125", "8^(2/3) = (8^(1/3))² : racine cubique, puis carré", "16^(−3/4) = 1 ÷ 16^(3/4) ; 16^(1/4) = 2 (car 2⁴ = 16)"][s] + " ; " + tu(x)),
        wins: [W(5, "5³ = 125, donc 125^(1/3) = ∛125 = 5."), W(4, "∛8 = 2, puis 2² = 4."), W(1 / 8, "16^(1/4) = 2, 2³ = 8, et l'exposant négatif donne l'inverse : 1/8.")] }),
    },
    modexp: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\(N(t) = N_0 \\cdot a^t\\) : on multiplie par le même nombre à chaque période. Intérêts composés : \\(C_n = C_0 (1 + \\frac{t}{100})^n\\). Doublement tous les \\(T\\) : \\(N = N_0 \\cdot 2^{t/T}\\) ; demi-vie \\(T\\) : \\(N = N_0 \\cdot 0{,}5^{t/T}\\).", exemple: ["1'000 CHF à \\(10\\,\\%\\) pendant 2 ans : \\(1\\text{'}000 \\cdot 1{,}1^2 = 1\\text{'}210\\) CHF", "Doublement toutes les 3 h : en 12 h, \\(\\cdot\\,2^4 = 16\\)", "80 g, demi-vie 8 jours : après 16 jours, \\(80 \\cdot 0{,}5^2 = 20\\) g"] },
      predict: { q: "On place 1'000 CHF à 10 % d'intérêts composés. Après 2 ans, on a…", choices: ["1'200 CHF", "1'210 CHF", "1'100 CHF"], good: 1,
        why: "1re année : 1'000 · 1,1 = 1'100 CHF. 2e année, les intérêts portent aussi sur les 100 CHF déjà gagnés : 1'100 · 1,1 = 1'210 CHF. On multiplie par 1,1 chaque année : 1'000 · 1,1²." },
      defis: ["1'000 CHF placés à 5 % par an : fais avancer le temps. Après combien d'années le capital dépasse-t-il 1'500 CHF pour la première fois ?", "1'000 bactéries doublent toutes les 3 heures. Après combien d'heures (entières) dépassent-elles 50'000 pour la première fois ?", "80 g d'iode 131 : la masse est divisée par 2 tous les 8 jours (demi-vie). Après combien de jours en reste-t-il 10 g ?"],
      play: slide({
        ctl: (s) => [{ k: "t", lab: MOD[s].lab, min: 0, max: MOD[s].max }],
        init: (s) => ({ t: MOD[s].t0 }),
        fig: (st, s) => { const M = MOD[s]; return graph({ xr: M.xr, pad: M.pad, yr: M.yr, gx: M.gx, lx: M.lx, gy: M.gy, ly: M.ly, fy: (v) => mil(v, 0), fns: [{ f: M.f, from: 0 }], hl: [[M.seuil, "f-accent"]], segs: [[st.t, 0, st.t, M.f(st.t), "f-line", 1.2, "4 3"]], pts: [[st.t, M.f(st.t), "", "f-dot"]], lab: "croissance ou décroissance exponentielle" }); },
        out: (st, s) => MOD[s].txt(st.t, MOD[s].f(st.t)) + '<br><span class="small">ligne rouge : ' + mil(MOD[s].seuil, 0) + ["", " CHF", " bactéries", " g"][s + 1] + "</span>",
        goal: [(st) => (st.t === 9 ? "1,05⁸ ≈ 1,477 (1'477,46 CHF), mais 1,05⁹ ≈ 1,551 : 1'551,33 CHF après 9 ans." : ""),
          (st) => (st.t === 17 ? "Après 16 h : ≈ 40'317 ; après 17 h : ≈ 50'797. Le nombre double toutes les 3 h : 2^(t/3)." : ""),
          (st) => (st.t === 24 ? "80 → 40 → 20 → 10 : trois demi-vies, 3 · 8 = 24 jours." : "")],
        miss: (st, s) => { const M = MOD[s], v = M.f(st.t); return s === 2 ? (v > M.seuil ? "Il en reste encore trop : avance." : v < M.seuil ? "Trop tard : il en reste moins de 10 g, recule." : "") : v <= M.seuil ? "Pas encore au-dessus de la ligne rouge : avance." : st.t > M.ok ? "Ça dépasse, mais c'était déjà le cas plus tôt : recule." : ""; },
        ask: [null, { q: "300 bactéries qui doublent toutes les 4 h : combien après 12 h ?", ans: 2400, ok: "12 h = 3 doublements : 300 · 2³ = 2'400.", no: "Combien de doublements en 12 h ? Puis multiplie par 2 autant de fois." },
          { q: "même iode (80 g, demi-vie 8 jours) : combien de grammes après 16 jours ?", ans: 20, ok: "Deux demi-vies : 80 · 0,5² = 20 g.", no: "16 jours = deux demi-vies : on divise deux fois par 2." }] }),
    },
    compo: {
      predict: { q: "f(x) = x + 3 et g(x) = 2x. Pour calculer f(g(5)), on commence par…", choices: ["g, puis f", "f, puis g"], good: 0,
        why: "On calcule d'abord ce qui est à l'intérieur : g(5) = 10, puis f(10) = 13. On note f ∘ g (« f rond g ») : g agit en premier, même si on l'écrit en second." },
      defis: ["f(x) = 2x + 1 et g(x) = x². Calcule (f ∘ g)(3).", "Mêmes f et g : calcule (g ∘ f)(3).", "f(x) = 3x − 2 et g(x) = x² + 1. Calcule (f ∘ g)(−2) − (g ∘ f)(−2)."],
      play: hunt({ ask: true, label: "Ta réponse", blank: (s) => compoFig(s, null), show: (x, s) => compoFig(s, x),
        miss: (x, s) => ["(f ∘ g)(3) = f(g(3)) : g(3) = 9, puis f(9).", "(g ∘ f)(3) = g(f(3)) : f d'abord.", "Calcule séparément f(g(−2)) et g(f(−2)), puis la différence."][s],
        wins: [W(19, "g(3) = 9, puis f(9) = 2 · 9 + 1 = 19."), W(49, "f(3) = 7, puis g(7) = 49. Donc f ∘ g et g ∘ f ne donnent pas la même chose."), W(-52, "f(g(−2)) = f(5) = 13 et g(f(−2)) = g(−8) = 65 : 13 − 65 = −52.")] }),
    },
    decomp: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { exemple: ["\\(\\sqrt{3x + 1}\\) : \\(g(x) = 3x + 1\\), \\(f(x) = \\sqrt{x}\\)", "\\((2x - 5)^3\\) : \\(g(x) = 2x - 5\\), \\(f(x) = x^3\\)"] },
      predict: { q: "h(x) = √(3x + 1). Pour calculer h(5), quelle opération fait-on en dernier ?", choices: ["la racine", "fois 3", "plus 1"], good: 0,
        why: "3 · 5 + 1 = 16, puis √16 = 4 : la racine vient en dernier. C'est la fonction « extérieure » f(x) = √x ; l'« intérieure » est g(x) = 3x + 1, et h = f ∘ g." },
      defis: ["h(x) = (2x − 5)³ = f(g(x)) avec f(x) = x³. Que vaut g(4) ?", "h(x) = 1 ÷ (x² + 4) = f(g(x)) avec g(x) = x² + 4. Que vaut f(8) ?", "h(x) = √(x² + 9) = f(g(x)). Calcule l'intérieur g(4), puis h(4) = f(g(4)). Que vaut h(4) ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["l'intérieur de (2x − 5)³ est g(x) = 2x − 5", "l'extérieur f prend l'inverse du nombre reçu", "g(x) = x² + 9 (intérieur), f(x) = √x (extérieur)"][s] + " ; " + tu(x)),
        wins: [W(3, "g(x) = 2x − 5, donc g(4) = 3 (et h(4) = 3³ = 27)."), W(1 / 8, "f(x) = 1 ÷ x, donc f(8) = 1/8 = 0,125."), W(5, "g(4) = 16 + 9 = 25, puis f(25) = √25 = 5.")] }),
    },
  });

  // =====================================================================================================
  // 6. Composition et réciproque · 7. Logarithmes · Géométrie vectorielle
  // =====================================================================================================
  // bijection : on règle le début m de l'ensemble de départ [m ; R].
  const BIJ = [
    { f: (x) => (x - 3) ** 2 + 1, h: 3, R: 7, min: -1, max: 6, m0: 0, xr: [-2, 8], yr: [-1, 18], gy: 1, ly: 4, up: true },
    { f: (x) => (x + 2) ** 2 - 4, h: -2, R: 3, min: -6, max: 2, m0: -5, xr: [-7, 4], yr: [-5, 22], gy: 1, ly: 4, up: true },
    { f: (x) => -((x - 1) ** 2) + 6, h: 1, R: 4, min: -3, max: 3.5, m0: -2, xr: [-4, 5], yr: [-11, 7], gy: 1, ly: 4, up: false },
  ];
  const bijPair = (B, m) => { const u = Math.max(m, 2 * B.h - B.R); return [u, 2 * B.h - u]; };
  // recip : f et sa réciproque, symétriques par rapport à y = x.
  const RC = [
    { f: (x) => 2 * x + 1, xr: [-2, 12], yr: [-2, 12], nm: "f(x) = 2x + 1" },
    { f: (x) => 3 * x - 4, xr: [-5, 8], yr: [-5, 8], nm: "f(x) = 3x − 4" },
    { f: (x) => x ** 3 + 1, xr: [-2, 10], yr: [-2, 10], nm: "f(x) = x³ + 1" },
  ];
  const rcFig = (s, x) => {
    const D = RC[s], o = { xr: D.xr, yr: D.yr, eq: true, lx: 2, fns: [{ f: (t) => t, cls: "f-line", w: 1.2, dash: true }, { f: D.f }], pts: [], lab: "graphe de f et droite y = x" };
    let out = plain('<span class="small">en bleu : ' + D.nm + " ; en pointillés : la droite y = x</span>");
    if (x !== null && s === 0) { o.pts.push([x, D.f(x), "(" + nb(x) + " ; " + nb(D.f(x)) + ")", "f-fill2"], [D.f(x), x, "", "f-dot"]); out = plain("f(" + nb(x) + ") = <b>" + nb(D.f(x)) + "</b> (on veut 11)"); }
    if (x !== null && s === 1) { o.fns.push({ f: (t) => (t + x) / 3, cls: "f-accent", w: 2 }); out = plain("En rouge, (x + " + nb(x) + ") ÷ 3 : " + (x === 4 ? '<b class="act-ok">symétrique de f par rapport à y = x</b>' : "pas le symétrique de f")); }
    if (x !== null && s === 2) { o.pts.push([x, 2, "(" + nb(x) + " ; 2)", "f-dot", "b"], [2, x, "", "f-fill2"]); out = plain("Le symétrique de (" + nb(x) + " ; 2) est (2 ; " + nb(x) + ") ; f(2) = 9 : " + (x === 9 ? '<b class="act-ok">il est sur le graphe de f</b>' : "il n'est pas sur le graphe de f")); }
    return graph(o) + out;
  };
  const LOGT = [[32, 5], [0.125, -3], [Math.SQRT2, 0.5]];
  const VA = [-2, -1], VB = [3, 3];
  const vT = (x, y) => "(" + nb(x) + " ; " + nb(y) + ")";

  Object.assign(ACTIVE, {
    bijection: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { exemple: ["\\(x^2\\) n'est pas injective sur \\(\\mathbb{R}\\) : \\(3^2 = (-3)^2 = 9\\)", "\\((x - 3)^2 + 1\\) : bijection de \\([3 \\, ; +\\infty[\\) vers \\([1 \\, ; +\\infty[\\)"] },
      predict: { q: "f(x) = x². Combien de nombres ont pour image 9 ?", choices: ["deux", "un", "aucun"], good: 0,
        why: "3² = 9 et (−3)² = 9 : deux nombres différents ont la même image. La fonction carré n'est donc pas injective sur ℝ : une droite horizontale coupe sa courbe deux fois." },
      defis: ["f(x) = (x − 3)² + 1 sur [m ; 7]. Règle m pour que toute droite horizontale coupe la courbe au plus une fois, en gardant le plus de nombres possible.", "f(x) = (x + 2)² − 4 sur [m ; 3]. Même consigne.", "g(x) = −(x − 1)² + 6 sur [m ; 4] (parabole tournée vers le bas). Même consigne."],
      play: slide({
        ctl: (s) => [{ k: "m", lab: "Début m de l'ensemble de départ", min: BIJ[s].min, max: BIJ[s].max, step: 0.5 }],
        init: (s) => ({ m: BIJ[s].m0 }),
        fig: (st, s) => { const B = BIJ[s], o = { xr: B.xr, yr: B.yr, gy: B.gy, ly: B.ly, fns: [{ f: B.f, cls: "f-line", w: 1.2, dash: true }, { f: B.f, from: st.m, to: B.R }], pts: [[st.m, B.f(st.m), "", "f-fill2"], [B.R, B.f(B.R), "", "f-fill2"]], lab: "parabole restreinte à un intervalle" };
          if (st.m < B.h) { const [u, w] = bijPair(B, st.m); o.hl = [[B.f(u), "f-accent"]]; o.pts.push([u, B.f(u), "", "f-dot"], [w, B.f(w), "", "f-dot"]); }
          return graph(o); },
        out: (st, s) => { const B = BIJ[s], ys = [B.f(st.m), B.f(B.R)].concat(st.m <= B.h ? [B.f(B.h)] : []), lo = Math.min(...ys), hi = Math.max(...ys);
          let t = "Départ <b>[" + nb(st.m) + " ; " + B.R + "]</b> ; images de " + nb(lo) + " à " + nb(hi);
          if (st.m < B.h) { const [u, w] = bijPair(B, st.m); t += '<br><span style="color:var(--margin)">' + nb(u) + " et " + nb(w) + " ont la même image " + nb(B.f(u)) + "</span>"; }
          return t; },
        goal: BIJ.map((B, s) => (st) => (st.m === B.h ? ["m = 3, le sommet : une seule branche, chaque image a une seule préimage. f est une bijection de [3 ; 7] sur [1 ; 17].", "m = −2, l'abscisse du sommet : il ne reste que la branche qui monte.", "m = 1, le sommet : il ne reste que la branche qui descend, encore injective."][s] : "")),
        miss: (st, s) => (st.m > BIJ[s].h ? "Plus de double image, mais tu as enlevé des nombres pour rien : recule m jusqu'au sommet." : "La droite rouge coupe la courbe deux fois : deux nombres ont la même image."),
        ask: [null, { q: "f(x) = (x + 2)² − 4 est alors une bijection de [−2 ; 3] sur [k ; 21]. Que vaut k ?", ans: -4, ok: "k = f(−2) = −4 : l'image du sommet est la plus petite image.", no: "La plus petite image est celle du sommet : calcule f(−2)." },
          { q: "g est alors une bijection de [1 ; 4] sur [k ; 6]. Que vaut k ?", ans: -3, ok: "g(4) = −9 + 6 = −3 : la branche descend de 6 à −3.", no: "La branche descend : la plus petite image est g(4)." }] }),
    },
    recip: {
      predict: { q: "f(x) = 2x + 1 transforme 3 en 7. Que fait la réciproque f⁻¹ avec 7 ?", choices: ["elle le renvoie sur 3", "elle donne 15", "elle donne 1/7"], good: 0,
        why: "La réciproque défait ce que fait f : f⁻¹(7) = 3. (15 = f(7) ; 1/7 est l'inverse de 7, c'est autre chose.)" },
      defis: ["f(x) = 2x + 1. Calcule f⁻¹(11), c'est-à-dire le nombre x tel que f(x) = 11.", "f(x) = 3x − 4. On écrit y = 3x − 4, on isole x, puis on échange les lettres : f⁻¹(x) = (x + p) ÷ 3. Que vaut p ?", "f(x) = x³ + 1 passe par (2 ; 9). Le point du graphe de f⁻¹ d'ordonnée 2 a quelle abscisse ?"],
      play: hunt({ ask: true, label: "Ta réponse", blank: (s) => rcFig(s, null), show: (x, s) => rcFig(s, x),
        miss: (x, s) => ["Résous 2x + 1 = 11.", "y = 3x − 4 donne 3x = y + 4.", "La réciproque échange les coordonnées : (2 ; 9) devient (9 ; 2)."][s],
        wins: [W(5, "2x + 1 = 11 donne x = 5. Ainsi f⁻¹(11) = 5, et le point (5 ; 11) de f devient (11 ; 5) sur f⁻¹."), W(4, "x = (y + 4) ÷ 3 ; on échange les lettres, d'où f⁻¹(x) = (x + 4) ÷ 3. Vérification : f(2) = 2 et f⁻¹(2) = 2."), W(9, "(2 ; 9) sur f donne (9 ; 2) sur f⁻¹ : symétrie par rapport à la droite y = x.")] }),
    },
    log: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\(\\log_b x = y\\) signifie \\(b^y = x\\) : le logarithme est un exposant. Sur la courbe \\(y = 2^x\\), on lit \\(\\log_2\\) d'une hauteur sur l'axe des x. Un logarithme peut être négatif.", exemple: ["\\(\\log_2 8 = 3\\), car \\(2^3 = 8\\) ; \\(\\log_2 32 = 5\\)", "\\(\\log_2 \\frac{1}{8} = -3\\), car \\(2^{-3} = \\frac{1}{8}\\)", "\\(\\log_2 \\sqrt{2} = \\frac{1}{2}\\)"], piege: "\\(\\log_2 8 = 3\\), l'exposant, et non \\(8 \\div 2 = 4\\)." },
      predict: { q: "log₂ 8 répond à la question…", choices: ["2 à quelle puissance donne 8 ?", "combien vaut 8 ÷ 2 ?", "8 à quelle puissance donne 2 ?"], good: 0,
        why: "log₂ 8 est l'exposant qu'il faut donner à 2 pour obtenir 8 : 2³ = 8, donc log₂ 8 = 3." },
      defis: ["Fais glisser le point sur la courbe y = 2ˣ jusqu'à la hauteur 32. Tu lis alors log₂ 32 sur l'axe des x.", "Même courbe : trouve log₂(1/8), c'est-à-dire la hauteur 0,125.", "Et log₂ √2 (hauteur ≈ 1,41) ?"],
      play: slide({
        ctl: () => [{ k: "x", lab: "Exposant x", min: -4, max: 6, step: 0.5 }],
        init: () => ({ x: 2 }),
        fig: (st, s) => graph({ xr: [-4, 6], yr: [-2, 34], gy: 2, ly: 8, fns: [{ f: (x) => 2 ** x }], hl: [[LOGT[s][0], "f-accent"]], segs: [[st.x, 0, st.x, 2 ** st.x, "f-line", 1.2, "4 3"], [0, 2 ** st.x, st.x, 2 ** st.x, "f-line", 1.2, "4 3"]], pts: [[st.x, 2 ** st.x, "", "f-dot"]], lab: "courbe y = 2 puissance x" }),
        out: (st, s) => pw("2", st.x) + " = <b>" + mil(2 ** st.x, 4) + "</b> (on veut " + ["32", "0,125", "√2 ≈ 1,4142"][s] + ")<br>donc log₂(" + mil(2 ** st.x, 4) + ") = " + nb(st.x),
        goal: LOGT.map(([v, e], s) => (st) => (st.x === e ? ["2⁵ = 32, donc log₂ 32 = 5.", "2⁻³ = 1/2³ = 1/8 = 0,125, donc log₂(1/8) = −3 : un logarithme peut être négatif.", "2^0,5 = √2, donc log₂ √2 = 1/2."][s] : "")),
        miss: (st, s) => (2 ** st.x < LOGT[s][0] ? "Pas assez haut : augmente l'exposant." : "Trop haut : diminue l'exposant."),
        ask: [null, { q: "calcule \\(\\log_3 81\\).", ans: 4, ok: "3⁴ = 81, donc log₃ 81 = 4.", no: "3 à quelle puissance donne 81 ?" },
          { q: "calcule \\(\\log 10\\,000 - \\log 0{,}1\\) (log sans base écrite : base 10).", ans: 5, ok: "log 10'000 = 4 et log 0,1 = −1 : 4 − (−1) = 5.", no: "10'000 = 10⁴ et 0,1 = 10⁻¹." }] }),
    },
    logbase: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\(\\log_a b = \\frac{\\ln b}{\\ln a} = \\frac{\\log b}{\\log a}\\) (changement de base, pour la calculatrice).", piege: "\\(\\log_2 10 = \\log 10 \\div \\log 2\\), pas \\(\\log 10 - \\log 2\\) (qui vaut \\(\\log 5\\))." },
      predict: { q: "La calculatrice n'a pas de touche log₂. Pour calculer log₂ 10, on tape…", choices: ["log 10 ÷ log 2", "log 10 − log 2", "log(10 ÷ 2)"], good: 0,
        why: "Changement de base : log₂ 10 = log 10 ÷ log 2 ≈ 3,32. Vérification : 2^3,32 ≈ 10. (log 10 − log 2 = log 5, autre chose.)" },
      defis: ["Valeur exacte de \\(\\log_4 8\\) (écris 4 et 8 comme puissances de 2).", "Valeur exacte de \\(\\log_{27} 9\\) (fraction).", "5'000 bactéries triplent chaque heure. Après combien d'heures sont-elles 100'000 ? (au dixième)"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["4 = 2² et 8 = 2³ : log₄ 8 = ln 2³ ÷ ln 2²", "27 = 3³ et 9 = 3²", "5'000 · 3ᵗ = 100'000, donc 3ᵗ = 20 et t = ln 20 ÷ ln 3"][s] + " ; " + tu(x)),
        wins: [W(1.5, "ln 2³ ÷ ln 2² = 3 ln 2 ÷ (2 ln 2) = 3/2 : en effet 4^1,5 = 2³ = 8."), W(2 / 3, "ln 3² ÷ ln 3³ = 2/3 : en effet ∛27 = 3 et 3² = 9."), (x) => (Math.abs(x - 2.7) < 1e-9 || Math.abs(x - 2.73) < 1e-9 ? "3ᵗ = 20, t = ln 20 ÷ ln 3 ≈ 2,73 h, soit environ 2 h 44 min." : "")] }),
    },
    vecteurs: {
      predict: { q: "A(1 ; 2) et B(4 ; 6). Le vecteur AB a pour composantes…", choices: ["(3 ; 4)", "(5 ; 8)", "(−3 ; −4)"], good: 0,
        why: "Arrivée moins départ : 4 − 1 = 3 et 6 − 2 = 4. Le vecteur dit « avance de 3, monte de 4 ». (5 ; 8) est la somme des coordonnées ; (−3 ; −4) est le vecteur BA." },
      defis: ["Règle les composantes du vecteur \\(\\vec{u}\\) pour qu'il aille de A(−2 ; −1) à B(3 ; 3).", "Produit scalaire : \\(\\vec{u} \\cdot \\vec{v} = x x' + y y'\\). Règle \\(\\vec{u}\\) perpendiculaire à \\(\\vec{v} = (2 \\, ; 3)\\) (produit scalaire nul), de norme \\(\\sqrt{13}\\).", "\\(\\vec{a} = (1 \\, ; 3)\\) et \\(\\vec{b} = (4 \\, ; 1)\\). Règle \\(\\vec{u} = 2\\vec{a} - \\vec{b}\\)."],
      play: slide({
        ctl: () => [{ k: "x", lab: "1re composante (horizontale)", min: -6, max: 6 }, { k: "y", lab: "2e composante (verticale)", min: -6, max: 6 }],
        init: (s) => [{ x: 1, y: 2 }, { x: 2, y: 1 }, { x: 1, y: 1 }][s],
        fig: (st, s) => { const o = { xr: [-7, 7], yr: [-6, 7], eq: true, arrows: [], pts: [], lab: "vecteurs dans un repère" };
          if (s === 0) { o.arrows.push([VA[0], VA[1], VA[0] + st.x, VA[1] + st.y, "f-blue"]); o.pts.push([VA[0], VA[1], "A", "f-dot", "b"], [VB[0], VB[1], "B", "f-dot", "r"]); }
          if (s === 1) o.arrows.push([0, 0, 2, 3, "f-accent"], [0, 0, st.x, st.y, "f-blue"]);
          if (s === 2) o.arrows.push([0, 0, 1, 3, "f-accent"], [0, 0, 4, 1, "f-line"], [0, 0, st.x, st.y, "f-blue"]);
          return graph(o) + (s ? plain('<span class="small">' + (s === 1 ? "en rouge v = (2 ; 3)" : "en rouge a = (1 ; 3), en noir b = (4 ; 1)") + ", en bleu u</span>") : ""); },
        out: (st, s) => "u = <b>" + vT(st.x, st.y) + "</b>" + (s === 0 ? " ; extrémité " + vT(VA[0] + st.x, VA[1] + st.y) : "") + (s === 1 ? "<br>u · v = " + nb(st.x) + " · 2 + " + (st.y < 0 ? "(" + nb(st.y) + ")" : nb(st.y)) + " · 3 = <b>" + nb(2 * st.x + 3 * st.y) + "</b> ; norme √(" + nb(st.x) + "² + " + (st.y < 0 ? "(" + nb(st.y) + ")" : nb(st.y)) + "²) = √" + (st.x * st.x + st.y * st.y) : ""),
        goal: [(st) => (st.x === 5 && st.y === 4 ? "AB = (3 − (−2) ; 3 − (−1)) = (5 ; 4) : arrivée moins départ." : ""),
          (st) => (2 * st.x + 3 * st.y === 0 && st.x * st.x + st.y * st.y === 13 ? "u = " + vT(st.x, st.y) + " : 2 · " + (st.x < 0 ? "(" + nb(st.x) + ")" : nb(st.x)) + " + 3 · " + (st.y < 0 ? "(" + nb(st.y) + ")" : nb(st.y)) + " = 0 et √(9 + 4) = √13. On échange les composantes et on change un signe." : ""),
          (st) => (st.x === -2 && st.y === 5 ? "2a = (2 ; 6), puis 2a − b = (2 − 4 ; 6 − 1) = (−2 ; 5) : composante par composante." : "")],
        miss: (st, s) => (s === 1 && 2 * st.x + 3 * st.y === 0 ? "Perpendiculaire (produit scalaire nul), mais la norme n'est pas √13." : s === 1 && st.x * st.x + st.y * st.y === 13 ? "Bonne norme, mais le produit scalaire n'est pas nul." : ""),
        ask: [null, { q: "\\(\\vec{u} = (4 \\, ; -1)\\) et \\(\\vec{w} = (1 \\, ; k)\\) sont perpendiculaires. Que vaut k ?", ans: 4, ok: "4 · 1 + (−1) · k = 0, donc k = 4.", no: "Écris le produit scalaire 4 · 1 + (−1) · k et égale-le à 0." },
          { q: "norme du vecteur (−6 ; 8) ?", ans: 10, ok: "√(36 + 64) = √100 = 10.", no: "Norme : √(x² + y²)." }] }),
    },
  });
})();

