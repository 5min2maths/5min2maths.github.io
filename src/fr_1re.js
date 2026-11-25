// 25.11 · France, notions créées pour la couverture du programme (tools/france_couverture.md, branche agent/frcouv).
// Ce fichier définit aussi les outils communs des notions françaises du 25.11 (FRX : fr_3e.js, fr_tle.js les utilisent).
// 1re spécialité (programme 2026) : expderiv (exponentielle : dérivée de e^(ax+b), produits, variations, AN.12–14),
// trigrad (cercle trigonométrique en radians, valeurs remarquables, angles associés, AN.15–16), droitenorm (équation
// cartésienne et vecteur normal, projeté orthogonal, GE.04–05). Notions sans CH ni MP : invisibles pour un élève suisse.
// Standard de l'app : 3 niveaux, ≥ 3 formes par niveau, pas à pas (guide), erreurs typiques (traps), contexte (ctx), leçon,
// 3 compétences, défi de niveau 4 quand il a du sens. Usages français : virgule, espace fine des milliers, ×, €, radians.
const FRX = (function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const nz = (a, b) => R.nz(a, b);
  const rnd = (v, k = 10) => +(+v).toFixed(k);
  const g2 = (a, b) => (b ? g2(b, a % b) : Math.abs(a));
  // Nombre en TeX à la française (virgule, espace fine des milliers) ; NP : entre parenthèses s'il est négatif.
  const N = (v) => { v = rnd(v); const s = String(Math.abs(v)).split("."); let i = s[0]; if (i.length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\,"); return (v < 0 ? "-" : "") + i + (s[1] ? "{,}" + s[1] : ""); };
  const NP = (v) => (v < 0 ? "(" + N(v) + ")" : N(v));
  const den = (v) => { for (let d = 1; d <= 400; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-9) return d; return 0; };
  // Fraction irréductible : TeX (F) et texte saisissable (FS) ; décimal si le dénominateur est une puissance de 10 courte.
  const F = (v) => { const d = den(v); if (d === 1 || !d) return N(v); if ([2, 4, 5, 10, 20, 25, 50, 100].includes(d) && String(rnd(v)).length < 6) return N(v); const n = Math.round(v * d); return (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
  const FS = (v) => { const d = den(v); if (d === 1 || !d) return String(rnd(v)).replace(".", ","); return Math.round(v * d) + "/" + d; };
  const sg = (v) => (v < 0 ? " - " + N(-v) : " + " + N(v));
  const X = " \\times ";
  const co = (a, v = "x") => (a === 1 ? v : a === -1 ? "-" + v : N(a) + v); // coefficient devant une lettre
  const lin = (a, b, v = "x") => (a ? co(a, v) + (b ? sg(b) : "") : N(b)); // ax + b
  const linE = (a, b, v = "x") => (a === 1 ? v : a === -1 ? "-" + v : a + "*" + v) + (b < 0 ? "-" + -b : b ? "+" + b : "");
  const keepT = (spec, traps) => (traps || []).filter((tr) => {
    if (!tr) return false;
    if (tr.e) { try { return !Expr.equivalent(Expr.parse(tr.e), Expr.parse(spec.expr)); } catch (e) { return false; } }
    if (tr.spec && tr.spec.kind === "pair") return tr.spec.values.every(isFinite) && tr.spec.values.some((x, i) => Math.abs(x - spec.values[i]) > 1e-9);
    if (tr.spec) { try { return checkAnswer(spec, SolSet.show(tr.spec.ivs, false)).status !== "correct"; } catch (e) { return false; } }
    if (tr.s) return tr.s.every(isFinite) && !(tr.s.length === spec.values.length && tr.s.every((x) => spec.values.some((y) => Math.abs(x - y) < 1e-9)));
    return isFinite(tr.v) && Math.abs(tr.v - spec.value) > Math.max(1e-9, spec.round ? spec.round : 0);
  });
  // Constructeurs : la réponse type (canon) est toujours posée (tests : checkAnswer(spec, canon) = juste).
  const mk = (q, spec, sol, o) => { const x = { q, spec, sol, guide: o.guide, ctx: o.ctx, traps: keepT(spec, o.traps) }; for (const k of ["fig", "canon", "shownOk", "calcul"]) if (o[k] !== undefined) x[k] = o[k]; return x; };
  const QN = (q, value, sol, o) => mk(q, { kind: "value", value }, sol, Object.assign({ canon: FS(value) }, o));
  const QR = (q, value, round, sol, o) => mk(q, { kind: "value", value, round }, sol, Object.assign({ canon: String(rnd(Math.round(value / round) * round, 6)).replace(".", ",") }, o));
  const QX = (q, expr, sol, o) => mk(q, { kind: "expr", expr }, sol, Object.assign({ canon: expr }, o));
  const QS = (q, ivs, sol, o) => mk(q, solsetSpec(ivs), sol, Object.assign({ canon: SolSet.show(ivs, false) }, o));
  const QSet = (q, vals, sol, o) => mk(q, { kind: "set", values: [...new Set(vals)] }, sol, Object.assign({ canon: [...new Set(vals)].map(FS).join(" ; ") }, o));
  const QP = (q, vals, sol, o) => mk(q, { kind: "pair", values: vals }, sol, Object.assign({ canon: vals.map(FS).join(" ; ") }, o));
  const GR = (ask, value, sol, round) => ({ ask, spec: Object.assign({ kind: "value", value }, round ? { round } : {}), sol });
  const GX = (ask, expr, sol) => ({ ask, spec: { kind: "expr", expr }, sol });
  const GSet = (ask, vals, sol) => ({ ask, spec: { kind: "set", values: [...new Set(vals)] }, sol });
  const GP = (ask, vals, sol) => ({ ask, spec: { kind: "pair", values: vals }, sol });
  const TR = TRAP, TX = (e, m) => ({ e, m }), TS = (ivs, m) => ({ spec: solsetSpec(ivs), m });
  // Problème en plusieurs étapes (niveau 4).
  const P = (q, parts, hints, sol) => ({ q, parts: parts.map(([label, value]) => ({ label, spec: { kind: "value", value } })), hints, sol });
  // Enregistrement d'une notion française (CH et MP null) : générateur, indice, leçon, compétences, défis.
  const reg = (defs) => {
    for (const d of defs) {
      if (!NOTIONS.some((n) => n.id === d.id)) NOTIONS.push(Object.assign({ id: d.id, theme: d.theme, label: d.label, ex: d.ex, CH: null, MP: null, FR: d.FR }, d.againFR ? { againFR: d.againFR } : {}));
      GEN[d.id] = (lv) => pickForm(d.g[Math.min(Math.max(lv, 1), 3)]);
      if (typeof VAR !== "undefined") VAR[d.id] = {};
      HINTS_EXTRA[d.id] = d.hint;
      LESSONS_EXTRA[d.id] = d.lesson;
      if (typeof COMPS !== "undefined") COMPS[d.id] = d.comps;
      if (d.probs && typeof PROB_EXTRA !== "undefined") PROB_EXTRA[d.id] = d.probs;
    }
  };
  return { pk, nz, rnd, g2, N, NP, den, F, FS, sg, X, co, lin, linE, mk, QN, QR, QX, QS, QSet, QP, GR, GX, GSet, GP, TR, TX, TS, P, reg };
})();

(function () {
  const { pk, nz, rnd, N, NP, F, FS, sg, X, co, lin, QN, QR, QX, QSet, QP, GR, GX, GP, TR, TX, P, reg } = FRX;

  // ======================= expderiv : exponentielle et dérivation (1re.AN.12–14) =======================
  const ED = {
    1: [
      () => { const a = pk([2, 3, 4, 5, -2, -3, -4, 0.5, -0.5]), k = pk([1, 2, 3, -2, 5]);
        return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = " + (k === 1 ? "" : k === -1 ? "-" : N(k)) + "e^{" + co(a) + "}") + ". Tape « exp(…) » ou « e^(…) ».", (k * a) + "*exp(" + a + "*x)",
          M("(e^{ax})' = a\\,e^{ax}") + " : " + M("f'(x) = " + N(k) + X + NP(a) + "\\,e^{" + co(a) + "} = " + N(k * a) + "e^{" + co(a) + "}") + ".",
          { ctx: "eax", guide: [GR("Dérivée de " + M("e^{" + co(a) + "}") + " : par quel nombre multiplie-t-on " + M("e^{" + co(a) + "}") + " ?", a, M(N(a)) + "."), GX(M("f'(x)") + " ?", (k * a) + "*exp(" + a + "*x)", M(N(k * a) + "e^{" + co(a) + "}") + ".")],
            traps: [TX(k + "*exp(" + a + "*x)", "La dérivée de e^(ax) n'est pas e^(ax) : on multiplie par a."), TX((k * a) + "*exp(" + (a - 1) + "*x)", "L'exposant ne baisse pas : ce n'est pas une puissance de x."), TX((k * a) + "*x*exp(" + a + "*x)", "Pas de x devant : (e^(ax))' = a e^(ax).")] }); },
      () => { const k = nz(-5, 6), b = nz(-6, 6), c = nz(-9, 9); if (Math.abs(k) === 1 && R.rand() < 0.5) return null;
        const e = k + "*exp(x)" + (2 * b < 0 ? "-" + -2 * b : "+" + 2 * b) + "*x";
        return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = " + co(k, "e^{x}") + sg(b) + "x^2" + sg(c)) + ".", e,
          M("(e^x)' = e^x") + ", " + M("(x^2)' = 2x") + ", la constante disparaît : " + M("f'(x) = " + co(k, "e^{x}") + sg(2 * b) + "x") + ".",
          { ctx: "somme", guide: [GX("Dérivée de " + M(co(k, "e^{x}")) + " ?", k + "*exp(x)", M(co(k, "e^{x}")) + "."), GX(M("f'(x)") + " ?", e, M(co(k, "e^{x}") + sg(2 * b) + "x") + ".")],
            traps: [TX(k + "*exp(x)+" + 2 * b + "*x+" + c, "La dérivée d'une constante est 0."), TX(k + "*x*exp(x)+" + 2 * b + "*x", "(e^x)' = e^x, pas x e^x."), TX(k + "*exp(x)+" + b + "*x", "(x²)' = 2x : le coefficient double.")] }); },
      () => { const c = nz(-4, 5), a = pk([2, 3, -2, -3, 4, 0.5]), b = nz(-6, 6), v = c * a + b;
        return QN("Soit " + M("f(x) = " + co(c, "e^{" + co(a) + "}") + sg(b) + "x") + ". Calcule " + M("f'(0)") + ".", v,
          M("f'(x) = " + N(c * a) + "e^{" + co(a) + "}" + sg(b)) + " et " + M("e^0 = 1") + " : " + M("f'(0) = " + N(c * a) + sg(b) + " = " + N(v)) + ".",
          { ctx: "valeur-0", guide: [GX(M("f'(x)") + " ?", (c * a) + "*exp(" + a + "*x)+" + b, M(N(c * a) + "e^{" + co(a) + "}" + sg(b)) + "."), GR(M("f'(0)") + " ?", v, M(N(v)) + ".")],
            traps: [TR(c + b, "On multiplie aussi par " + N(a).replace("{,}", ",") + " (dérivée de e^(ax))."), TR(c, "C'est f(0), pas f'(0) : dérive d'abord."), TR(c * a, "Le terme " + b + "x a pour dérivée " + b + ".")] }); },
    ],
    2: [
      () => { const a = nz(-3, 4), b = nz(-6, 6), e = "(" + FRX.linE(a, a + b) + ")*exp(x)";
        return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = (" + lin(a, b) + ")e^{x}") + ", sous la forme " + M("(\\dots)e^{x}") + ".", e,
          "Produit " + M("uv") + " avec " + M("u = " + lin(a, b)) + ", " + M("v = e^x") + " : " + M("f'(x) = " + N(a) + "e^x + (" + lin(a, b) + ")e^x = (" + lin(a, a + b) + ")e^{x}") + ".",
          { ctx: "produit", guide: [GR(M("u'(x)") + " (u = " + M(lin(a, b)) + ") ?", a, M(N(a)) + "."), GX(M("f'(x) = u'v + uv'") + " ?", e, M("(" + lin(a, a + b) + ")e^{x}") + ".")],
            traps: [TX(a + "*exp(x)", "(uv)' = u'v + uv' : il manque le terme uv'."), TX("(" + FRX.linE(a, b) + ")*exp(x)", "C'est f(x), pas f'(x) : la dérivée de " + lin(a, b).replace(/\\/g, "") + " s'ajoute."), TX(a + "*x*exp(x)", "(uv)' n'est pas u'v'.")] }); },
      () => { const c = nz(-4, 5), m = c - 1;
        return QN("Soit " + M("f(x) = (x" + sg(-c) + ")e^{x}") + " sur " + M("\\mathbb{R}") + ". En quelle abscisse " + M("f") + " atteint-elle son minimum ?", m,
          M("f'(x) = e^x + (x" + sg(-c) + ")e^x = (x" + sg(1 - c) + ")e^x") + ". Comme " + M("e^x > 0") + ", " + M("f'") + " a le signe de " + M("x" + sg(1 - c)) + " : négative puis positive, " + M("f") + " est minimale en " + M("x = " + N(m)) + ".",
          { ctx: "minimum", guide: [GX(M("f'(x)") + " ? (sous la forme (…)e^x)", "(x" + (1 - c >= 0 ? "+" : "") + (1 - c) + ")*exp(x)", M("(x" + sg(1 - c) + ")e^x") + "."), GR("Pour quel " + M("x") + " a-t-on " + M("f'(x) = 0") + " ?", m, M("x = " + N(m)) + " (" + M("e^x") + " ne s'annule jamais).")],
            traps: [TR(c, "En " + c + ", f s'annule ; le minimum est là où f' s'annule."), TR(c + 1, "f'(x) = (x − " + (c - 1) + ")eˣ : attention au signe."), TR(0, "e^x ne s'annule pas, mais f'(x) = (x − " + (c - 1) + ")eˣ s'annule.")] }); },
      () => { const a = pk([2, 3, -2, -3, 4, -4]), b = nz(-5, 5), e = a + "*x+" + (1 + b);
        return QX("Donne l'équation réduite de la tangente à la courbe de " + M("f(x) = e^{" + co(a) + "}" + sg(b)) + " au point d'abscisse " + M("0") + ". Réponds « y = … ».", e,
          M("f(0) = 1" + sg(b) + " = " + N(1 + b)) + ", " + M("f'(x) = " + N(a) + "e^{" + co(a) + "}") + ", " + M("f'(0) = " + N(a)) + " : " + M("y = " + N(a) + "x" + sg(1 + b)) + ".",
          { ctx: "tangente-0", guide: [GR(M("f(0)") + " ?", 1 + b, M("e^0" + sg(b) + " = " + N(1 + b)) + "."), GR(M("f'(0)") + " ?", a, M(N(a)) + "."), GX("Équation " + M("y = f'(0)\\,x + f(0)") + " ?", e, M("y = " + lin(a, 1 + b)) + ".")],
            traps: [TX(a + "*x+" + b, "e⁰ = 1 : f(0) = 1 + " + b + "."), TX("x+" + (1 + b), "f'(0) = " + a + " (dérivée de e^(ax) en 0)."), TX(a + "*x", "La tangente passe par (0 ; f(0)).")] }); },
    ],
    3: [
      () => { const c = pk([["La concentration d'un médicament dans le sang", "mg/L", "heures", "medicament"], ["La température d'un café posé sur une table, au-dessus de celle de la pièce,", "°C", "minutes", "cafe"], ["La masse d'un échantillon radioactif", "g", "années", "radioactif"]]);
        const C0 = pk([20, 40, 50, 80, 120]), k = pk([0.1, 0.2, 0.25, 0.5]), v = -k * C0;
        return QN(c[0] + " vaut " + M("C(t) = " + N(C0) + "\\,e^{-" + N(k) + "t}") + " (en " + c[1] + ", " + M("t") + " en " + c[2] + "). Calcule " + M("C'(0)") + ", la vitesse de variation à l'instant initial.", v,
          M("C'(t) = " + N(C0) + X + "(-" + N(k) + ")\\,e^{-" + N(k) + "t}") + ", donc " + M("C'(0) = " + N(v)) + " : la grandeur diminue d'environ " + M(N(-v)) + " " + c[1] + " par unité de temps au départ.",
          { ctx: "decroissance-" + c[3], guide: [GX(M("C'(t)") + " ?", v + "*exp(-" + k + "*t)", M(N(v) + "\\,e^{-" + N(k) + "t}") + "."), GR(M("C'(0)") + " ?", v, M(N(v)) + ".")],
            traps: [TR(C0, "C'est C(0), pas C'(0)."), TR(-v, "La grandeur diminue : C'(0) est négative."), TR(-k, "On multiplie par " + C0 + " aussi.")] }); },
      () => { const r1 = nz(-4, 3); let r2 = nz(-4, 4); if (r2 === r1) r2 = r1 + 2; const b = -(r1 + r2) - 2, c = r1 * r2 - b;
        const poly = "x^2" + (b ? sg(b) + "x" : "") + (c ? sg(c) : "");
        return QSet("Soit " + M("f(x) = (" + poly + ")e^{x}") + ". En quelles abscisses la tangente à la courbe de " + M("f") + " est-elle horizontale ? Sépare les valeurs par « ; ».", [r1, r2],
          M("f'(x) = (2x" + sg(b) + ")e^x + (" + poly + ")e^x = (x^2" + sg(b + 2) + "x" + sg(b + c) + ")e^x") + ". Comme " + M("e^x > 0") + ", on résout " + M("x^2" + sg(b + 2) + "x" + sg(b + c) + " = 0") + " : " + M("x = " + N(Math.min(r1, r2))) + " ou " + M("x = " + N(Math.max(r1, r2))) + ".",
          { ctx: "extremums-trinome", guide: [GX(M("f'(x)") + " ? (forme (…)e^x)", "(x^2+" + (b + 2) + "*x+" + (b + c) + ")*exp(x)", M("(x^2" + sg(b + 2) + "x" + sg(b + c) + ")e^x") + "."), GSetLoc("Racines du trinôme ?", [r1, r2])],
            traps: [{ s: (() => { const d = b * b - 4 * c; return d >= 0 ? [(-b - Math.sqrt(d)) / 2, (-b + Math.sqrt(d)) / 2] : [NaN]; })(), m: "Ce sont les racines de f (ou du premier facteur) : il faut celles de f'." }, { s: [r1], m: "Il y a deux abscisses." }] }); },
      () => { const a = pk([2, 3, 4, 5, 6]), k = pk([1, 2, 3, 4]), vmax = a * k * Math.exp(-1);
        return pk([0, 1]) ? QN("Soit " + M("f(x) = " + N(a) + "x\\,e^{-x/" + k + "}") + " pour " + M("x \\geqslant 0") + (k === 1 ? "" : " (avec " + M("e^{-x/" + k + "}") + ")") + ". En quelle abscisse " + M("f") + " atteint-elle son maximum ?", k,
          M("f'(x) = " + N(a) + "e^{-x/" + k + "} - \\frac{" + N(a) + "}{" + k + "}x\\,e^{-x/" + k + "} = " + N(a) + "e^{-x/" + k + "}\\left(1 - \\frac{x}{" + k + "}\\right)") + " : positive avant " + M(k) + ", négative après. Maximum en " + M("x = " + k) + ".",
          { ctx: "maximum-x", guide: [GX(M("f'(x)") + " ?", a + "*exp(-x/" + k + ")*(1-x/" + k + ")", M(N(a) + "e^{-x/" + k + "}\\left(1 - \\frac{x}{" + k + "}\\right)") + "."), GR(M("f'(x) = 0") + " pour " + M("x") + " = ?", k, M(k) + ".")],
            traps: [TR(0, "En 0, f vaut 0 : c'est le minimum sur [0 ; +∞[."), TR(1 / k, "Résous 1 − x/" + k + " = 0."), TR(a, "Le coefficient " + a + " ne change pas l'abscisse du maximum.")] })
          : QR("Soit " + M("f(x) = " + N(a) + "x\\,e^{-x/" + k + "}") + " pour " + M("x \\geqslant 0") + ". Son maximum est atteint en " + M("x = " + k) + ". Quelle est sa valeur maximale (au centième) ?", vmax, 0.01,
          M("f(" + k + ") = " + N(a * k) + "\\,e^{-1} = \\frac{" + N(a * k) + "}{e} \\approx " + N(rnd(vmax, 2))) + ".",
          { ctx: "maximum-valeur", guide: [GR(M("f(" + k + ")") + " (au centième) ?", vmax, M("\\frac{" + N(a * k) + "}{e} \\approx " + N(rnd(vmax, 2))) + ".", 0.01)],
            traps: [TR(rnd(a * k, 2), "e^(−" + k + "/" + k + ") = e^(−1) ≈ 0,37, pas 1."), TR(rnd(a * k * Math.exp(1), 2), "L'exposant est négatif : on divise par e.")] }); },
    ],
  };
  // set dans un guide (GSet de FRX)
  function GSetLoc(ask, vals) { return FRX.GSet(ask, vals, M(vals.map(N).join(" \\,;\\, ")) + "."); }

  // ======================= trigrad : cercle trigonométrique en radians (1re.AN.15–16) =======================
  // Angles remarquables : k·π/6 et k·π/4 ; valeurs exactes en TeX et en saisie.
  const R3 = Math.sqrt(3) / 2, R2 = Math.SQRT2 / 2;
  const ex2 = (v) => { const t = [[0, "0", "0"], [0.5, "\\frac{1}{2}", "1/2"], [R2, "\\frac{\\sqrt{2}}{2}", "√2/2"], [R3, "\\frac{\\sqrt{3}}{2}", "√3/2"], [1, "1", "1"]].find((e) => Math.abs(Math.abs(v) - e[0]) < 1e-9);
    return v < -1e-12 ? ["-" + t[1], "-" + t[2]] : [t[1], t[2]]; };
  // angle k·π/d (TeX, saisie)
  const ang = (k, d) => { const g = FRX.g2(k, d) || 1; k /= g; d /= g; if (k === 0) return ["0", "0"]; const s = k < 0 ? "-" : "", a = Math.abs(k);
    return d === 1 ? [s + (a === 1 ? "" : a) + "\\pi", s + (a === 1 ? "" : a) + "π"] : [s + "\\frac{" + (a === 1 ? "" : a) + "\\pi}{" + d + "}", s + (a === 1 ? "" : a) + "π/" + d]; };
  const ANG = [[1, 6], [1, 4], [1, 3], [2, 3], [3, 4], [5, 6], [7, 6], [5, 4], [4, 3], [5, 3], [7, 4], [11, 6], [-1, 6], [-1, 4], [-1, 3], [-2, 3], [-3, 4], [-5, 6]];
  // mesure principale (dans ]−π ; π]) de k·π/d
  const princ = (k, d) => { let m = ((k % (2 * d)) + 2 * d) % (2 * d); if (m > d) m -= 2 * d; return m; };
  const TG = {
    1: [
      () => { const [k, d] = pk(ANG), fn = pk(["cos", "sin"]), t = (k * Math.PI) / d, v = rnd(fn === "cos" ? Math.cos(t) : Math.sin(t)), [vt, vs] = ex2(v), [at] = ang(k, d);
        const sv = Math.sign(rnd(fn === "cos" ? Math.cos(t) : Math.sin(t), 9));
        return mk2("Sans calculatrice, donne la valeur exacte de " + M("\\" + fn + "\\left(" + at + "\\right)") + ".", v, vs,
          "Sur le cercle trigonométrique, le point associé à " + M(at) + " a pour " + (fn === "cos" ? "abscisse" : "ordonnée") + " " + M(vt) + " (le quadrant donne le signe).",
          { ctx: "valeur-" + fn, guide: [GR(fn === "cos" ? "Le point est-il à droite (tape 1) ou à gauche (tape −1) de l'axe vertical (0 s'il est dessus) ?" : "Le point est-il en haut (tape 1) ou en bas (tape −1) de l'axe horizontal (0 s'il est dessus) ?", sv, sv > 0 ? "Signe positif." : sv < 0 ? "Signe négatif." : "Valeur nulle."), GR("Valeur exacte ?", v, M(vt) + ".")],
            traps: [TR(-v, "Le signe dépend du quadrant : regarde où se trouve le point."), TR(rnd(fn === "cos" ? Math.sin(t) : Math.cos(t)), "Cosinus = abscisse, sinus = ordonnée.")] }); },
      () => { const pairs = [[30, 1, 6], [45, 1, 4], [60, 1, 3], [120, 2, 3], [135, 3, 4], [150, 5, 6], [210, 7, 6], [240, 4, 3], [270, 3, 2], [300, 5, 3], [330, 11, 6], [72, 2, 5], [36, 1, 5], [20, 1, 9]];
        const [deg, k, d] = pk(pairs), [at, as] = ang(k, d), toRad = R.rand() < 0.5;
        return toRad ? mk2("Convertis " + M(deg + "°") + " en radians (valeur exacte, avec " + M("\\pi") + ").", (k * Math.PI) / d, as,
          M("180° = \\pi") + " rad, donc " + M(deg + "° = " + deg + X + "\\frac{\\pi}{180} = " + at) + ".",
          { ctx: "deg-rad", guide: [GR("Par quel nombre multiplie-t-on " + M("\\pi") + " ? (fraction : " + M(deg) + " sur 180)", deg / 180, M("\\frac{" + deg + "}{180} = " + F(deg / 180)) + "."), GR("Mesure en radians ?", (k * Math.PI) / d, M(at) + ".")],
            traps: [TR((deg * Math.PI) / 360, "180° = π (pas 360°)."), TR((180 * Math.PI) / deg / 1, "On multiplie par π/180, on ne divise pas.")] })
          : QN("Convertis " + M(at) + " rad en degrés.", deg, M("\\pi") + " rad " + M("= 180°") + ", donc " + M(at + " = " + (k === 1 ? "" : k + X) + "\\frac{180°}{" + d + "} = " + deg + "°") + ".",
          { ctx: "rad-deg", guide: [GR("Combien de degrés vaut " + M("\\frac{\\pi}{" + d + "}") + " ?", 180 / d, M("\\frac{180°}{" + d + "} = " + N(180 / d) + "°") + "."), GR("Et " + M(at) + " ?", deg, M(deg + "°") + ".")],
            traps: [TR(360 * k / d, "π rad = 180°, pas 360°."), TR(180 / d, "Multiplie par " + k + ".")] }); },
      () => { const [k, d] = pk(ANG.filter(([a, b]) => b !== 1)), m = princ(k, d), [at, as] = ang(m, d), t = (m * Math.PI) / d, [ct] = ex2(rnd(Math.cos(t))), [st] = ex2(rnd(Math.sin(t)));
        return mk2("Le point " + M("M") + " du cercle trigonométrique a pour coordonnées " + M("\\left(" + ct + " \\,;\\, " + st + "\\right)") + ". Quelle est la mesure de l'angle " + M("x") + " associé à " + M("M") + " dans " + M("]-\\pi \\,;\\, \\pi]") + " ?", t, as,
          M("\\cos x = " + ct) + " et " + M("\\sin x = " + st) + " : " + (Math.sin(t) >= 0 ? "le point est en haut" : "le point est en bas, l'angle est négatif") + " ; " + M("x = " + at) + ".",
          { ctx: "point", guide: [GR("Le point est-il en haut (1) ou en bas (−1) ?", Math.sin(t) > 0 ? 1 : -1, Math.sin(t) > 0 ? "En haut : sinus positif, x entre 0 et π." : "En bas : sinus négatif, x entre −π et 0."), GR("Mesure de " + M("x") + " ?", t, M(at) + ".")],
            traps: [TR(-t, "Regarde le signe du sinus : il donne le demi-cercle (haut ou bas)."), TR(Math.PI - t, "Regarde le signe du cosinus : il donne le côté (droite ou gauche).")] }); },
    ],
    2: [
      () => { const d = pk([3, 4, 6]), base = pk([1, 2, 3, 4, 5].filter((b) => FRX.g2(b, d) === 1)), tours = pk([1, 2, 3, -1, -2]), k = base + 2 * d * tours, kk = R.rand() < 0.5 ? k : -k, m = princ(kk, d), [at] = ang(kk, d), [mt, ms] = ang(m, d);
        if (Math.abs(kk) <= d) return null;
        return mk2("Donne la mesure principale de l'angle " + M(at) + " (la mesure qui est dans " + M("]-\\pi \\,;\\, \\pi]") + ").", (m * Math.PI) / d, ms,
          "On retire (ou on ajoute) des tours complets " + M("2\\pi = \\frac{" + 2 * d + "\\pi}{" + d + "}") + " : " + M(at + " = " + mt + (kk - m > 0 ? " + " : " - ") + Math.abs((kk - m) / (2 * d)) + X + "2\\pi") + ". Mesure principale : " + M(mt) + ".",
          { ctx: "mesure-principale", guide: [GR("Combien de tours complets " + M("2\\pi") + " faut-il retirer (négatif s'il faut en ajouter) ?", (kk - m) / (2 * d), M(N((kk - m) / (2 * d))) + "."), GR("Mesure principale ?", (m * Math.PI) / d, M(mt) + ".")],
            traps: [TR(((m + 2 * d) * Math.PI) / d, "Une mesure principale est dans ]−π ; π] : retire encore un tour."), TR((((kk % d) + d) % d * Math.PI) / d, "Un tour vaut 2π, pas π.")] }); },
      () => { const c = pk([0.2, 0.3, 0.4, 0.6, 0.7, 0.8]), fn = pk(["cos", "sin"]), forms = fn === "cos" ? [["\\pi - x", -c], ["\\pi + x", -c], ["-x", c], ["x + 2\\pi", c]] : [["\\pi - x", c], ["\\pi + x", -c], ["-x", -c], ["x - 2\\pi", c]];
        const [f, v] = pk(forms);
        return QN("On sait que " + M("\\" + fn + " x = " + N(c)) + ". Que vaut " + M("\\" + fn + "(" + f + ")") + " ?", v,
          "Sur le cercle trigonométrique, le point associé à " + M(f) + " est le symétrique de celui de " + M("x") + " " + ({ "\\pi - x": "par rapport à l'axe des ordonnées", "\\pi + x": "par rapport à l'origine", "-x": "par rapport à l'axe des abscisses", "x + 2\\pi": "(même point : un tour de plus)", "x - 2\\pi": "(même point : un tour de moins)" })[f] + " : " + M("\\" + fn + "(" + f + ") = " + N(v)) + ".",
          { ctx: "associe-" + fn, guide: [GR("Même valeur (1) ou valeur opposée (−1) ?", Math.sign(v / c), v === c ? "Même valeur." : "Valeur opposée."), GR(M("\\" + fn + "(" + f + ")") + " ?", v, M(N(v)) + ".")],
            traps: [TR(-v, "Dessine les deux points : quelle symétrie passe de x à " + f.replace(/\\pi/g, "π") + " ?"), TR(rnd(Math.sqrt(1 - c * c)), "On reste sur la même fonction (" + fn + ") : pas besoin de sin² + cos² = 1.")] }); },
      () => { const [c, s] = pk([[0.6, 0.8], [0.8, 0.6], [0.28, 0.96], [0.96, 0.28], [5 / 13, 12 / 13], [12 / 13, 5 / 13]]), q = pk([[1, "\\left[0 \\,;\\, \\frac{\\pi}{2}\\right]", 1, 1], [2, "\\left[\\frac{\\pi}{2} \\,;\\, \\pi\\right]", -1, 1], [3, "\\left[-\\pi \\,;\\, -\\frac{\\pi}{2}\\right]", -1, -1], [4, "\\left[-\\frac{\\pi}{2} \\,;\\, 0\\right]", 1, -1]]);
        const askSin = R.rand() < 0.5, giv = askSin ? q[2] * c : q[3] * s, v = askSin ? q[3] * s : q[2] * c;
        return QN("On sait que " + M((askSin ? "\\cos" : "\\sin") + " x = " + F(giv)) + " et que " + M("x \\in " + q[1]) + ". Calcule " + M((askSin ? "\\sin" : "\\cos") + " x") + " (valeur exacte).", v,
          M("\\cos^2 x + \\sin^2 x = 1") + ", donc " + M((askSin ? "\\sin^2" : "\\cos^2") + " x = 1 - " + F(giv * giv) + " = " + F(v * v)) + ". Sur cet intervalle, " + M((askSin ? "\\sin" : "\\cos") + " x") + " est " + (v > 0 ? "positif" : "négatif") + " : " + M(F(v)) + ".",
          { ctx: "pythagore-" + (askSin ? "sin" : "cos"), guide: [GR(M((askSin ? "\\sin^2" : "\\cos^2") + " x") + " ?", v * v, M(F(v * v)) + "."), GR("Signe sur l'intervalle : 1 ou −1 ?", Math.sign(v), v > 0 ? "Positif." : "Négatif."), GR("Valeur ?", v, M(F(v)) + ".")],
            traps: [TR(-v, "L'intervalle donne le signe : regarde le quadrant."), TR(rnd(1 - Math.abs(giv)), "sin² + cos² = 1 : ce sont les carrés qui s'ajoutent."), TR(v * v, "Il faut encore prendre la racine.")] }); },
    ],
    3: [
      () => { const [k1, d1] = pk(ANG), [k2, d2] = pk(ANG), t1 = (k1 * Math.PI) / d1, t2 = (k2 * Math.PI) / d2, v = rnd(Math.cos(t1) + Math.sin(t2), 9), [a1] = ang(k1, d1), [a2] = ang(k2, d2), [c1] = ex2(rnd(Math.cos(t1))), [s2] = ex2(rnd(Math.sin(t2)));
        if (Math.abs(v) < 1e-9 || Math.abs(Math.abs(v) - 1) < 1e-9) return null;
        const vs = exS(v); if (!vs) return null;
        return mk2("Calcule la valeur exacte de " + M("\\cos\\left(" + a1 + "\\right) + \\sin\\left(" + a2 + "\\right)") + ".", v, vs,
          M("\\cos\\left(" + a1 + "\\right) = " + c1) + " et " + M("\\sin\\left(" + a2 + "\\right) = " + s2) + " : la somme vaut " + M(exT(v)) + ".",
          { ctx: "somme", guide: [GR(M("\\cos\\left(" + a1 + "\\right)") + " ?", rnd(Math.cos(t1)), M(c1) + "."), GR(M("\\sin\\left(" + a2 + "\\right)") + " ?", rnd(Math.sin(t2)), M(s2) + "."), GR("Somme ?", v, M(exT(v)) + ".")],
            traps: [TR(rnd(-Math.cos(t1) + Math.sin(t2), 9), "Vérifie le signe du cosinus (côté gauche ou droit)."), TR(rnd(Math.cos(t1) - Math.sin(t2), 9), "Vérifie le signe du sinus (haut ou bas).")] }); },
      () => { const fn = pk(["cos", "sin"]), [vt, vs, vv] = pk([["\\frac{1}{2}", "1/2", 0.5], ["-\\frac{1}{2}", "-1/2", -0.5], ["\\frac{\\sqrt{2}}{2}", "√2/2", R2], ["-\\frac{\\sqrt{2}}{2}", "-√2/2", -R2], ["\\frac{\\sqrt{3}}{2}", "√3/2", R3], ["-\\frac{\\sqrt{3}}{2}", "-√3/2", -R3]]);
        const a = fn === "cos" ? Math.acos(vv) : Math.asin(vv), sols = fn === "cos" ? [a, -a] : [a, a >= 0 ? Math.PI - a : -Math.PI - a];
        const txt = (t) => { for (const d of [6, 4, 3, 2, 1]) { const k = Math.round((t * d) / Math.PI); if (Math.abs((k * Math.PI) / d - t) < 1e-9) return ang(k, d); } return ["?", "?"]; };
        return QSet("Par lecture du cercle trigonométrique, donne les réels " + M("x") + " de " + M("]-\\pi \\,;\\, \\pi]") + " tels que " + M("\\" + fn + " x = " + vt) + ". Sépare-les par « ; » (avec π).", sols,
          (fn === "cos" ? "On cherche les points d'abscisse " : "On cherche les points d'ordonnée ") + M(vt) + " : il y en a deux, " + (fn === "cos" ? "symétriques par rapport à l'axe des abscisses" : "symétriques par rapport à l'axe des ordonnées") + ". " + M("x = " + txt(sols[0])[0]) + " ou " + M("x = " + txt(sols[1])[0]) + ".",
          { ctx: "lecture-" + fn, canon: sols.map((t) => txt(t)[1]).join(" ; "), guide: [GR("Une solution (dans " + M("[0 \\,;\\, \\pi]") + (fn === "sin" ? " ou " + M("[-\\pi \\,;\\, 0]") : "") + ") ?", sols[0], M(txt(sols[0])[0]) + "."), GSetLoc2("Les deux solutions ?", sols, sols.map((t) => txt(t)[0]).join(" \\,;\\, "))],
            traps: [{ s: [sols[0]], m: "Il y a deux points du cercle avec cette " + (fn === "cos" ? "abscisse" : "ordonnée") + "." }, { s: fn === "cos" ? [Math.asin(vv), Math.PI - Math.asin(vv)] : [Math.acos(vv), -Math.acos(vv)], m: (fn === "cos" ? "Cosinus = abscisse" : "Sinus = ordonnée") + " : tu as lu l'autre coordonnée." }] }); },
      () => { const s = pk([0.6, 0.8, 0.28, 0.96]), c = rnd(Math.sqrt(1 - s * s)), form = pk([["\\cos(\\pi - x)", c, "cos(π − x) = −cos x"], ["\\sin(\\pi + x) + \\cos(-x)", rnd(-s - c), "sin(π + x) = −sin x et cos(−x) = cos x"], ["\\cos(x + \\pi) - \\sin(\\pi - x)", rnd(c - s), "cos(x + π) = −cos x et sin(π − x) = sin x"]]);
        return QN("On sait que " + M("\\sin x = " + N(s)) + " et que " + M("x \\in \\left[\\frac{\\pi}{2} \\,;\\, \\pi\\right]") + ". Calcule " + M(form[0]) + ".", form[1],
          "Sur cet intervalle, " + M("\\cos x < 0") + " : " + M("\\cos x = -\\sqrt{1 - " + N(s * s) + "} = " + N(-c)) + ". Puis " + form[2] + " : " + M(form[0] + " = " + N(form[1])) + ".",
          { ctx: "associe-quadrant", guide: [GR(M("\\cos x") + " ?", -c, M(N(-c)) + " (négatif : x entre π/2 et π)."), GR(M(form[0]) + " ?", form[1], M(N(form[1])) + ".")],
            traps: [TR(form[0] === "\\cos(\\pi - x)" ? -c : rnd(-s + c), "Sur [π/2 ; π], le cosinus est négatif : cos x = " + N(-c).replace("{,}", ",") + "."), TR(-form[1], "Vérifie les signes des angles associés.")] }); },
    ],
  };
  // valeurs exactes de sommes du type a + b√k (TeX et saisie), pour la forme « somme »
  function exS(v) { for (const [r, t] of [[0, ""], [R2, "√2/2"], [R3, "√3/2"]]) for (const a of [-1.5, -1, -0.5, 0, 0.5, 1, 1.5]) for (const sgn of [1, -1]) if (r && Math.abs(a + sgn * r - v) < 1e-9) return (a ? FS(a) : "") + (sgn > 0 ? (a ? " + " : "") : " - ") + t; return null; }
  function exT(v) { for (const [r, t] of [[R2, "\\frac{\\sqrt{2}}{2}"], [R3, "\\frac{\\sqrt{3}}{2}"]]) for (const a of [-1.5, -1, -0.5, 0, 0.5, 1, 1.5]) for (const sgn of [1, -1]) if (Math.abs(a + sgn * r - v) < 1e-9) return (a ? F(a) : "") + (sgn > 0 ? (a ? " + " : "") : " - ") + t; return N(v); }
  function GSetLoc2(ask, vals, tex) { return FRX.GSet(ask, vals, M(tex) + "."); }
  // question à valeur exacte avec réponse type écrite (√, π)
  function mk2(q, value, canon, sol, o) { return FRX.mk(q, { kind: "value", value }, sol, Object.assign({ canon }, o)); }

  // ======================= droitenorm : vecteur normal, équation cartésienne, projeté orthogonal (1re.GE.04–05) =======================
  const pt = (x, y) => M("(" + N(x) + " \\,;\\, " + N(y) + ")");
  const vc = (a, b) => M("\\begin{pmatrix} " + N(a) + " \\\\ " + N(b) + " \\end{pmatrix}");
  const vcm = (a) => M("\\begin{pmatrix} " + N(a) + " \\\\ m \\end{pmatrix}");
  const cartT = (a, b, c) => { let s = a === 1 ? "x" : a === -1 ? "-x" : N(a) + "x"; s += b ? (b < 0 ? " - " : " + ") + (Math.abs(b) === 1 ? "" : N(Math.abs(b))) + "y" : ""; s += c ? sg(c) : ""; return s + " = 0"; };
  const DN = {
    1: [
      () => { const a = nz(-5, 5), b = nz(-5, 5), x0 = nz(-6, 6), y0 = nz(-6, 6), c = -(a * x0 + b * y0); if (!c) return null;
        return QN("La droite " + M("d") + " passe par " + M("A") + pt(x0, y0) + " et admet " + M("\\vec{n}") + vc(a, b) + " pour vecteur normal. Son équation s'écrit " + M(cartT(a, b, 0).replace(" = 0", "") + " + c = 0") + ". Que vaut " + M("c") + " ?", c,
          "Un vecteur normal " + M("\\vec{n}(a \\,;\\, b)") + " donne l'équation " + M("ax + by + c = 0") + ". " + M("A") + " est sur " + M("d") + " : " + M(N(a) + X + NP(x0) + sg(b) + X + NP(y0) + " + c = 0") + ", donc " + M("c = " + N(c)) + ".",
          { ctx: "normal-c", guide: [GR("Remplace " + M("x") + " et " + M("y") + " par les coordonnées de " + M("A") + " : que vaut " + M(N(a) + X + NP(x0) + sg(b) + X + NP(y0)) + " ?", a * x0 + b * y0, M(N(a * x0 + b * y0)) + "."), GR(M("c") + " ?", c, M(N(c)) + ".")],
            traps: [TR(-c, "a·x_A + b·y_A + c = 0 : c est l'opposé de a·x_A + b·y_A."), TR(-(a * y0 + b * x0), "x avec l'abscisse de A, y avec l'ordonnée.")] }); },
      () => { const a = nz(-6, 6), b = nz(-6, 6), c = nz(-9, 9), k = pk([2, 3, -2, -1, -3]), m = k * b;
        return QN("Le vecteur " + M("\\vec{u}") + vcm(k * a) + " est normal à la droite " + M("d : " + cartT(a, b, c)) + ". Que vaut " + M("m") + " ?", m,
          "Un vecteur normal à " + M("d") + " est " + M("\\vec{n}") + vc(a, b) + ". " + M("\\vec{u}") + " est normal à " + M("d") + " s'il est colinéaire à " + M("\\vec{n}") + " : " + M(N(k * a) + " = " + N(k) + X + NP(a)) + ", donc " + M("m = " + N(k) + X + NP(b) + " = " + N(m)) + ".",
          { ctx: "normal-m", guide: [GP("Coordonnées d'un vecteur normal lu dans l'équation ? Réponds « a ; b ».", [a, b], vc(a, b) + "."), GR("Par quel nombre multiplie-t-on " + M("\\vec{n}") + " pour obtenir " + M("\\vec{u}") + " ?", k, M(N(k)) + "."), GR(M("m") + " ?", m, M(N(m)) + ".")],
            traps: [TR(b, "Multiplie aussi la seconde coordonnée par " + k + "."), TR(-m, "Les deux coordonnées sont multipliées par le même nombre " + k + " : attention au signe."), TR(a, "Un vecteur normal est (a ; b) : (" + a + " ; " + b + "), multiplié par " + k + ".")] }); },
      () => { const a = nz(-6, 6), b = nz(-6, 6), c = nz(-9, 9), k = pk([1, 2, -1, 3]), v = k * a;
        return QN("La droite " + M("d : " + cartT(a, b, c)) + " admet un vecteur directeur " + M("\\vec{u}") + vcm(-k * b) + ". Que vaut " + M("m") + " ?", v,
          "Pour " + M("ax + by + c = 0") + ", " + M("\\vec{u}(-b \\,;\\, a)") + " est directeur (il est orthogonal à " + M("\\vec{n}(a \\,;\\, b)") + "). Ici " + M("(-b \\,;\\, a) = ") + vc(-b, a) + " ; on le multiplie par " + M(k) + " : " + M("m = " + N(v)) + ".",
          { ctx: "directeur", guide: [GP("Un vecteur directeur " + M("(-b \\,;\\, a)") + " ? Réponds « x ; y ».", [-b, a], vc(-b, a) + "."), GR(M("m") + " ?", v, M(N(v)) + ".")],
            traps: [TR(k * b, "(a ; b) est normal ; un directeur est (−b ; a)."), TR(-k * a, "Directeur : (−b ; a), sans changer le signe de a.")] }); },
    ],
    2: [
      () => { const xA = nz(-5, 5), yA = nz(-5, 5), xB = xA + nz(-5, 5), yB = yA + nz(-5, 5), xC = nz(-6, 6), yC = nz(-6, 6), a = xB - xA, b = yB - yA, c = -(a * xC + b * yC); if (!c || !a || !b) return null;
        return QN("Soit " + M("A") + pt(xA, yA) + ", " + M("B") + pt(xB, yB) + " et " + M("C") + pt(xC, yC) + ". La droite perpendiculaire à " + M("(AB)") + " passant par " + M("C") + " a une équation de la forme " + M(cartT(a, b, 0).replace(" = 0", "") + " + c = 0") + ". Que vaut " + M("c") + " ?", c,
          M("\\overrightarrow{AB}") + vc(a, b) + " est normal à la droite cherchée. Elle passe par " + M("C") + " : " + M(N(a) + X + NP(xC) + sg(b) + X + NP(yC) + " + c = 0") + ", " + M("c = " + N(c)) + ".",
          { ctx: "perpendiculaire", guide: [GP("Coordonnées de " + M("\\overrightarrow{AB}") + " ?", [a, b], vc(a, b) + "."), GR(M("c") + " ?", c, M(N(c)) + ".")],
            traps: [TR(-(a * xA + b * yA), "La droite passe par C, pas par A."), TR(-c, "c = −(a·x_C + b·y_C)."), TR(-(-b * xC + a * yC), "AB est normal (pas directeur) à la perpendiculaire.")] }); },
      () => { const xA = nz(-6, 6), yA = nz(-6, 6), a = 2 * nz(-3, 3), b = 2 * nz(-3, 3), xB = xA + a, yB = yA + b, mx = (xA + xB) / 2, my = (yA + yB) / 2, c = -(a * mx + b * my); if (!c) return null;
        return QN("Soit " + M("A") + pt(xA, yA) + " et " + M("B") + pt(xB, yB) + ". La médiatrice de " + M("[AB]") + " a une équation de la forme " + M(cartT(a, b, 0).replace(" = 0", "") + " + c = 0") + ". Que vaut " + M("c") + " ?", c,
          "La médiatrice passe par le milieu " + M("I") + pt(mx, my) + " et " + M("\\overrightarrow{AB}") + vc(a, b) + " lui est normal : " + M(N(a) + X + NP(mx) + sg(b) + X + NP(my) + " + c = 0") + ", " + M("c = " + N(c)) + ".",
          { ctx: "mediatrice", guide: [GP("Milieu " + M("I") + " de " + M("[AB]") + " ?", [mx, my], pt(mx, my) + "."), GR(M("c") + " ?", c, M(N(c)) + ".")],
            traps: [TR(-(a * xA + b * yA), "La médiatrice passe par le milieu de [AB], pas par A."), TR(-c, "c = −(a·x_I + b·y_I).")] }); },
      () => { const xO = nz(-4, 4), yO = nz(-4, 4), [dx, dy] = pk([[3, 4], [4, 3], [-3, 4], [-4, -3], [3, -4], [6, 8], [-8, 6], [-4, 3]]), xA = xO + dx, yA = yO + dy, c = -(dx * xA + dy * yA);
        if (!c) return null;
        return QN("Le cercle de centre " + M("\\Omega") + pt(xO, yO) + " passe par " + M("A") + pt(xA, yA) + ". La tangente au cercle en " + M("A") + " a une équation de la forme " + M(cartT(dx, dy, 0).replace(" = 0", "") + " + c = 0") + ". Que vaut " + M("c") + " ?", c,
          "La tangente en " + M("A") + " est perpendiculaire au rayon " + M("[\\Omega A]") + " : " + M("\\overrightarrow{\\Omega A}") + vc(dx, dy) + " est normal. Elle passe par " + M("A") + " : " + M("c = -(" + N(dx) + X + NP(xA) + sg(dy) + X + NP(yA) + ") = " + N(c)) + ".",
          { ctx: "tangente-cercle", guide: [GP("Coordonnées de " + M("\\overrightarrow{\\Omega A}") + " ?", [dx, dy], vc(dx, dy) + "."), GR(M("c") + " ?", c, M(N(c)) + ".")],
            traps: [TR(-(dx * xO + dy * yO), "La tangente passe par A, pas par le centre."), TR(-c, "c = −(a·x_A + b·y_A).")] }); },
    ],
    3: [
      () => { const a = nz(-3, 3), b = nz(-3, 3), xH = nz(-5, 5), yH = nz(-5, 5), c = -(a * xH + b * yH), t = nz(-2, 2), xP = xH + t * a, yP = yH + t * b;
        return QP("Détermine les coordonnées du projeté orthogonal " + M("H") + " du point " + M("P") + pt(xP, yP) + " sur la droite " + M("d : " + cartT(a, b, c)) + ". Réponds « x ; y ».", [xH, yH],
          M("H") + " est sur la droite passant par " + M("P") + " et dirigée par " + M("\\vec{n}") + vc(a, b) + " : " + M("H(" + N(xP) + " + " + N(a) + "t \\,;\\, " + N(yP) + " + " + N(b) + "t)") + ". On remplace dans l'équation de " + M("d") + " : " + M("t = " + N(-t)) + ", d'où " + M("H") + pt(xH, yH) + ".",
          { ctx: "projete", guide: [GP("Vecteur normal à " + M("d") + " ?", [a, b], vc(a, b) + "."), GR("Valeur du paramètre " + M("t") + " pour laquelle " + M("P + t\\vec{n}") + " est sur " + M("d") + " ?", -t, M("t = " + N(-t)) + "."), GP(M("H") + " ?", [xH, yH], pt(xH, yH) + ".")],
            traps: [{ spec: { kind: "pair", values: [xP + t * a, yP + t * b] }, m: "Le signe de t : H = P + t·n avec t = " + (-t) + "." }, { spec: { kind: "pair", values: [xP, yP] }, m: "P n'est pas sur d : il faut le projeter." }] }); },
      () => { const xA = nz(-5, 5), yA = nz(-5, 5), xB = xA + nz(-6, 6), yB = yA + nz(-6, 6), xC = nz(-6, 6), yC = nz(-6, 6), a = xB - xA, b = yB - yA, c = -(a * xC + b * yC); if (!c || !a || !b) return null;
        return QN("Dans le triangle " + M("ABC") + " avec " + M("A") + pt(xA, yA) + ", " + M("B") + pt(xB, yB) + " et " + M("C") + pt(xC, yC) + ", la hauteur issue de " + M("C") + " a une équation de la forme " + M(cartT(a, b, 0).replace(" = 0", "") + " + c = 0") + ". Que vaut " + M("c") + " ?", c,
          "La hauteur issue de " + M("C") + " est perpendiculaire à " + M("(AB)") + " : " + M("\\overrightarrow{AB}") + vc(a, b) + " est normal. Elle passe par " + M("C") + " : " + M("c = " + N(c)) + ".",
          { ctx: "hauteur", guide: [GP(M("\\overrightarrow{AB}") + " ?", [a, b], vc(a, b) + "."), GR(M("c") + " ?", c, M(N(c)) + ".")],
            traps: [TR(-(a * xA + b * yA), "La hauteur issue de C passe par C."), TR(-((xC - xA) * xC + (yC - yA) * yC), "Le vecteur normal est AB (le côté opposé à C).")] }); },
      () => { const ux = nz(-3, 3), uy = nz(-3, 3), xA = nz(-5, 5), yA = nz(-5, 5), s = nz(-2, 3), xH = xA + s * ux, yH = yA + s * uy, t = nz(-2, 2), xP = xH - t * uy, yP = yH + t * ux;
        return QP("La droite " + M("d") + " passe par " + M("A") + pt(xA, yA) + " et a pour vecteur directeur " + M("\\vec{u}") + vc(ux, uy) + ". Détermine le projeté orthogonal " + M("H") + " de " + M("P") + pt(xP, yP) + " sur " + M("d") + ". Réponds « x ; y ».", [xH, yH],
          M("H = A + s\\vec{u}") + " avec " + M("\\overrightarrow{PH} \\cdot \\vec{u} = 0") + ". Or " + M("\\overrightarrow{AP} \\cdot \\vec{u} = " + N((xP - xA) * ux + (yP - yA) * uy)) + " et " + M("\\lVert \\vec{u} \\rVert^2 = " + N(ux * ux + uy * uy)) + ", donc " + M("s = " + N(s)) + " et " + M("H") + pt(xH, yH) + ".",
          { ctx: "projete-directeur", guide: [GR(M("\\overrightarrow{AP} \\cdot \\vec{u}") + " ?", (xP - xA) * ux + (yP - yA) * uy, M(N((xP - xA) * ux + (yP - yA) * uy)) + "."), GR(M("s = \\frac{\\overrightarrow{AP} \\cdot \\vec{u}}{\\lVert \\vec{u} \\rVert^2}") + " ?", s, M(N(s)) + "."), GP(M("H") + " ?", [xH, yH], pt(xH, yH) + ".")],
            traps: [{ spec: { kind: "pair", values: [xA + s * ux * (ux * ux + uy * uy), yA + s * uy * (ux * ux + uy * uy)] }, m: "On divise par ‖u‖² : s = AP·u / ‖u‖²." }, { spec: { kind: "pair", values: [xP, yP] }, m: "P n'est pas sur d." }] }); },
    ],
  };

  reg([
    { id: "expderiv", theme: "fa", label: "Exponentielle : dérivée, tangente, variations", ex: "(e^{ax})' = a\\,e^{ax}", FR: [11, 5], g: ED,
      hint: "(e^x)' = e^x et (e^(ax + b))' = a e^(ax + b). Produit : (uv)' = u'v + uv'. Comme e^x > 0, f'(x) = (…)e^x a le signe de la parenthèse.",
      comps: ["Dériver e^(ax), une somme avec e^x", "Produit (ax + b)e^x, tangente en 0, minimum", "Modèles e^(−kt), extremums, maximum de x e^(−x/k)"],
      lesson: ["Dériver avec l'exponentielle", "La fonction exponentielle est égale à sa dérivée : \\((e^x)' = e^x\\).",
        "Pour tout réel \\(a\\) : \\((e^{ax + b})' = a\\,e^{ax + b}\\). Avec un produit : \\((u\\,e^x)' = u'e^x + u\\,e^x = (u' + u)\\,e^x\\). Comme \\(e^x > 0\\), le signe de \\(f'(x) = (\\dots)\\,e^x\\) est celui de la parenthèse : on en déduit les variations. Pour \\(k > 0\\), \\(t \\mapsto e^{kt}\\) est croissante (croissance exponentielle) et \\(t \\mapsto e^{-kt}\\) décroissante (décroissance exponentielle).",
        ["\\((5e^{-2x})' = -10\\,e^{-2x}\\).", "\\(f(x) = (x - 3)e^x\\) : \\(f'(x) = (x - 2)e^x\\), minimum en \\(x = 2\\).", "Tangente en 0 à \\(e^{3x}\\) : \\(y = 3x + 1\\)."],
        "\\((e^{3x})'\\) n'est pas \\(e^{3x}\\), ni \\(3x\\,e^{3x - 1}\\) : on multiplie par 3, l'exposant ne change pas."],
      probs: [() => P("Un médicament injecté a une concentration C(t) = 12t e^(−0,5t) (mg/L, t en heures).", [["a) C'(t) = (12 − 6t)e^(−0,5t) s'annule pour t =", 2], ["b) Concentration maximale (au centième)", 8.83], ["c) C(4) (au centième)", 6.5]], ["(uv)' = u'v + uv' ; e^(−0,5t) > 0.", "Le maximum est en t = 2 : C(2) = 24 e^(−1)."], "a) " + M("C'(t) = 12e^{-0{,}5t} - 6t\\,e^{-0{,}5t} = (12 - 6t)e^{-0{,}5t}") + " s'annule en " + M("t = 2") + " (positive avant, négative après) ; b) " + M("C(2) = 24e^{-1} \\approx 8{,}83") + " mg/L ; c) " + M("C(4) = 48e^{-2} \\approx 6{,}50") + " mg/L.")] },
    { id: "trigrad", theme: "es", label: "Cercle trigonométrique en radians", ex: "\\cos\\left(\\frac{2\\pi}{3}\\right) = -\\frac{1}{2}", FR: [11, 5], g: TG,
      hint: "π rad = 180°. Cosinus = abscisse, sinus = ordonnée du point du cercle. Angles associés : −x (symétrie par rapport à l'axe des abscisses), π − x (axe des ordonnées), π + x (origine).",
      comps: ["Valeurs remarquables, conversions, angle d'un point", "Mesure principale, angles associés, cos² + sin² = 1", "Sommes exactes, lecture de cos x = a, quadrant donné"],
      lesson: ["Le cercle trigonométrique", "On enroule la droite des réels sur le cercle de centre \\(O\\) et de rayon 1 : à chaque réel \\(x\\) correspond un point \\(M\\) du cercle.",
        "Un tour complet mesure \\(2\\pi\\) : \\(\\pi\\) rad \\(= 180°\\). Le point \\(M\\) associé à \\(x\\) a pour coordonnées \\((\\cos x \\,;\\, \\sin x)\\), et \\(\\cos^2 x + \\sin^2 x = 1\\). \\(x\\) et \\(x + 2k\\pi\\) donnent le même point ; la mesure principale est celle de \\(]-\\pi \\,;\\, \\pi]\\). Angles associés : \\(\\cos(-x) = \\cos x\\), \\(\\sin(-x) = -\\sin x\\), \\(\\cos(\\pi - x) = -\\cos x\\), \\(\\sin(\\pi - x) = \\sin x\\), \\(\\cos(\\pi + x) = -\\cos x\\), \\(\\sin(\\pi + x) = -\\sin x\\).",
        ["\\(\\cos\\frac{\\pi}{3} = \\frac{1}{2}\\), \\(\\sin\\frac{\\pi}{4} = \\frac{\\sqrt{2}}{2}\\), \\(\\cos\\frac{5\\pi}{6} = -\\frac{\\sqrt{3}}{2}\\).", "\\(\\frac{17\\pi}{6} = \\frac{5\\pi}{6} + 2\\pi\\) : mesure principale \\(\\frac{5\\pi}{6}\\)."],
        "Le cosinus se lit sur l'axe horizontal, le sinus sur l'axe vertical ; et le quadrant donne le signe."],
      probs: [() => P("On sait que cos x = 0,6 et que x est dans [−π/2 ; 0].", [["a) sin² x", 0.64], ["b) sin x", -0.8], ["c) cos(π − x) + sin(−x)", 0.2]], ["cos² x + sin² x = 1.", "Sur [−π/2 ; 0], le sinus est négatif."], "a) " + M("1 - 0{,}36 = 0{,}64") + " ; b) " + M("-0{,}8") + " ; c) " + M("-0{,}6 + 0{,}8 = 0{,}2") + ".")] },
    { id: "droitenorm", theme: "es", label: "Vecteur normal, équation cartésienne, projeté orthogonal", ex: "\\vec{n}(a \\,;\\, b) \\perp d : ax + by + c = 0", FR: [11, 8], g: DN,
      hint: "La droite ax + by + c = 0 a pour vecteur normal (a ; b) et pour vecteur directeur (−b ; a). On trouve c avec un point de la droite. Projeté orthogonal de P : H = P + t·n, sur la droite.",
      comps: ["Vecteur normal, vecteur directeur, calculer c", "Perpendiculaire, médiatrice, tangente à un cercle", "Projeté orthogonal, hauteur d'un triangle"],
      lesson: ["Vecteur normal à une droite", "Un vecteur normal à une droite est un vecteur non nul orthogonal à ses vecteurs directeurs.",
        "La droite de vecteur normal \\(\\vec{n}(a \\,;\\, b)\\) a une équation \\(ax + by + c = 0\\) ; \\(c\\) se calcule avec un point de la droite. Réciproquement, \\(ax + by + c = 0\\) a pour vecteur normal \\((a \\,;\\, b)\\) et pour vecteur directeur \\((-b \\,;\\, a)\\). Le projeté orthogonal \\(H\\) d'un point \\(P\\) sur \\(d\\) est le point de \\(d\\) tel que \\(\\overrightarrow{PH}\\) soit normal à \\(d\\).",
        ["Normal \\((2 \\,;\\, -3)\\), passant par \\(A(1 \\,;\\, 4)\\) : \\(2x - 3y + 10 = 0\\).", "Médiatrice de \\([AB]\\) : normale \\(\\overrightarrow{AB}\\), passe par le milieu."],
        "\\((a \\,;\\, b)\\) est normal, \\((-b \\,;\\, a)\\) est directeur : ne les confonds pas."] },
  ]);
})();
