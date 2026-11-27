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
  /* 27.11 après-midi (corrigés réduits) : c(v − h) sans « 1( », « + 0 » ni « (x + 0) » */
  const cfac = (c, v, h) => (c === 1 ? "" : c === -1 ? "-" : fT(c)) + (h ? "(" + v + sg(-h) + ")" : v);
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
  const sqX = (a) => (a ? "(x" + sg(-a) + ")^2" : "x^2"); /* 27.11 : (x − a)², x² si a = 0 */
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
          M("PA^2 = PB^2") + " : " + M(sqX(A[0]) + " + " + A[1] ** 2 + " = " + sqX(B[0]) + " + " + B[1] ** 2) /* 27.11 : abscisse nulle sans « (x + 0)^2 » */ + ", les " + M("x^2") + " s'éliminent : " + M("x = " + fT(x)) + ".",
          { ctx: "equidistant", guide: [GN("Développe " + M("PA^2 = PB^2") + " : les termes en " + M("x^2") + " s'éliminent. Coefficient de " + M("x") + " dans " + M("PA^2 - PB^2") + " ?", 2 * (B[0] - A[0]), M("-2 \\cdot " + par(A[0]) + " + 2 \\cdot " + par(B[0]) + " = " + 2 * (B[0] - A[0])) + "."), GN(M("x") + " ?", x, M("x = " + fT(x)) + ".")],
            traps: [TR((A[0] + B[0]) / 2, "C'est l'abscisse du milieu de [AB] : il n'est pas sur l'axe des abscisses en général."), TR(-x, "Vérifie le signe en résolvant l'équation du 1er degré.")] }); },
      () => { const A = ptR(), p = pk([1, 2, -1, -2, 3]), q = nz(-5, 5), B = [A[0] + p, A[1] + q], c = R.int(-6, 6), t = c - A[1]; const s = -q * t / p; if (!Number.isInteger(s) || t === 0) return null; const k = A[0] + s, C = [k, c];
        return QN("Soit " + M(pt("A", ...A)) + ", " + M(pt("B", ...B)) + " et " + M("C(k \\,;\\, " + c + ")") + ". Pour quelle valeur de " + M("k") + " le triangle " + M("ABC") + " est-il rectangle en " + M("A") + " ?", k,
          "Rectangle en " + M("A") + " ⟺ " + M("\\vec{AB} \\cdot \\vec{AC} = 0") + " : " + M(cfac(p, "k", A[0]) + sg(q) + " \\cdot " + par(t) + " = 0") + ", donc " + M("k = " + k) + ".",
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
        "Pente " + M("m = \\frac{" + q + "}{" + p + "} = " + fT(m)) + " ; " + M("y = " + cfac(m, "x", x0) + (y0 ? sg(y0) : "") + " = " + P2([m, h])) + ".",
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
        M("f(x) = -" + facT(b) + "^2" + (top ? sg(top) : "")) + " ; " + M("f(x) = " + v + " \\iff " + facT(b) + "^2 = " + m * m) + ", et " /* 27.11 : b = 0 ou top = 0 sans « (x + 0) » ni « + 0 » */ + M("x \\ge " + b) + " donne " + M("x = " + (b + m)) + ".",
        { ctx: "sommet-restreint", guide: [GN("Ordonnée du sommet (maximum de " + M("f") + ") ?", top, M(top) + "."), GN(M(facT(b) + "^2") + " vaut ?", m * m, M(top + " - (" + v + ") = " + m * m) + "."), GN(M("f^{-1}(" + v + ")") + " ?", b + m, M(b + m) + ".")],
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
        M(k + "x = " + al + "° + k \\cdot 360°") + " ou " + M(k + "x = " + (180 - al) + "° + k \\cdot 360°") + ", donc " + M("x = " + fT(al / k) + "° + k \\cdot " + fT(360 / k) + "°") + " ou " + M("x = " + fT((180 - al) / k) + "° + k \\cdot " + fT(360 / k) + "°") + " : " + S.length + " solutions, " + S.map((x) => M(nb(x) + "°")).join(" ; ") + ".",
        { ctx: "sin-kx", guide: [GSet("Valeurs de " + M(k + "x") + " dans " + M("[0° \\,;\\, 360°[") + " ?", in360([al, 180 - al]), in360([al, 180 - al]).join(" ; ") + "."), GSet("Toutes les solutions en " + M("x") + " ?", S, S.join(" ; ") + ".")],
          traps: [TSt(in360([al, 180 - al]).map((v) => v / k), "La période est divisée par " + k + " : ajoute des multiples de " + fS(360 / k) + "°."), TSt(in360([al, 180 - al]), "Ce sont les valeurs de " + k + "x : divise par " + k + " (et ajoute les multiples de " + fS(360 / k) + "°).")] }); },
    () => { const b = pk([-60, -30, 30, 60, 90]), c = pk([-45, 0, 45, 120]), u = c - b, w = 180 - c - b; if (u % 2 || w % 4) return null;
      const S = in360([...[0, 1].map((j) => u / 2 + 180 * j), ...[0, 1, 2, 3].map((j) => w / 4 + 90 * j)]);
      return QSet("Résous " + M("\\sin(3x" + (b < 0 ? " - " + -b : " + " + b) + "°) = \\sin(x" + (c ? (c < 0 ? " - " + -c : " + " + c) + "°" : "") + ")") + " pour " + M("0° \\le x < 360°") + ". Sépare les solutions par « ; ».", S,
        M("\\sin A = \\sin B \\iff A = B + k \\cdot 360°") + " ou " + M("A = 180° - B + k \\cdot 360°") + " : " + M("2x = " + u + "° + k \\cdot 360°") + " ou " + M("4x = " + w + "° + k \\cdot 360°") + ", d'où " + S.map((x) => M(nb(x) + "°")).join(" ; ") + ".",
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
