// 25.11 · France, terminale spécialité (programme 2019 en 2026-2027) : notions créées pour la couverture du programme
// (tools/france_couverture.md). Les limites, la continuité, la convexité, ln et exp (dérivation, études), les primitives,
// les intégrales, les équations différentielles et l'espace viennent des notions de 3e–4e du Collège (rattachées dans
// src/fr_couv.js). Ici, ce qui manquait : lnfr (logarithme népérien : propriétés, équations, seuils, AN.13–14), trigfr
// (fonctions sinus et cosinus en radians, AN.15–18), tvi (théorème des valeurs intermédiaires, AN.11–12), sommeva
// (sommes de variables aléatoires, concentration, loi des grands nombres, SP.05–07), recurrence (raisonnement par
// récurrence : conjecturer, hérédité, rang initial, AN.01–02). Outils communs : FRX (src/fr_1re.js).
(function () {
  const { pk, nz, rnd, g2, N, NP, F, FS, sg, X, co, lin, linE, mk, QN, QR, QX, QS, QSet, QP, GR, GX, GP, TR, TX, TS, P, reg } = FRX;
  const QV = (q, value, canon, sol, o) => mk(q, { kind: "value", value }, sol, Object.assign({ canon }, o));

  // ======================= lnfr : logarithme népérien (Tle.AN.13–14) =======================
  const LN = {
    1: [
      () => { const [a, b, c] = pk([[6, 4, 3], [10, 3, 5], [2, 9, 6], [12, 5, 4], [15, 2, 6], [8, 9, 12], [14, 3, 7]]), k = (a * b) / c; if (!Number.isInteger(k) || k === 1) return null;
        return QN("Écris " + M("\\ln " + a + " + \\ln " + b + " - \\ln " + c) + " sous la forme " + M("\\ln k") + ". Que vaut " + M("k") + " ?", k,
          M("\\ln a + \\ln b = \\ln(ab)") + " et " + M("\\ln a - \\ln b = \\ln\\frac{a}{b}") + " : " + M("\\ln\\frac{" + a + X + b + "}{" + c + "} = \\ln " + k) + ".",
          { ctx: "proprietes", guide: [GR(M("\\ln " + a + " + \\ln " + b + " = \\ln(\\dots)") + " ?", a * b, M("\\ln " + a * b) + "."), GR(M("k") + " ?", k, M(k) + ".")],
            traps: [TR(a + b - c, "ln transforme les produits en sommes : ln a + ln b = ln(ab), pas ln(a + b)."), TR(a * b * c, "Une différence de logarithmes donne un quotient.")] }); },
      () => { const k = pk([2, 3, 5, 7, 10, 0.5]), a = pk([1, 2, 3, -1]), b = pk([0, 1, -1, 2]), v = (Math.log(k) - b) / a;
        const ex = (a === 1 ? "x" : a === -1 ? "-x" : a + "x") + (b ? (b > 0 ? " + " : " - ") + Math.abs(b) : "");
        const can = a === 1 && !b ? "ln(" + FS(k) + ")" : "(ln(" + FS(k) + ")" + (b ? (b > 0 ? "-" : "+") + Math.abs(b) : "") + ")/" + "(" + a + ")";
        return QV("Résous " + M("e^{" + ex + "} = " + N(k)) + ". Donne la valeur exacte (tape « ln(…) »).", v, can,
          M("e^{X} = " + N(k) + " \\iff X = \\ln " + N(k)) + " (car " + M(N(k) + " > 0") + ") : " + M(ex + " = \\ln " + N(k)) + ", " + M("x = " + (a === 1 && !b ? "\\ln " + N(k) : "\\frac{\\ln " + N(k) + (b ? sg(-b) : "") + "}{" + a + "}")) + ".",
          { ctx: "exp-egal", guide: [GR("Valeur de l'exposant " + M(ex) + " (avec ln) ?", Math.log(k), M("\\ln " + N(k)) + "."), GR(M("x") + " ?", v, M("x \\approx " + N(rnd(v, 3))) + ".")],
            traps: [TR(rnd(Math.exp(k), 9), "On applique ln (la réciproque de exp), pas exp."), TR(rnd(k / a, 9), "e^X = k donne X = ln k.")] }); },
      () => { const a = pk([2, 3, -1, 0.5, 4]), m = pk([1, 2, 3]), b = nz(-4, 4), v = (Math.exp(a) - b) / m;
        const ex = (m === 1 ? "x" : m + "x") + sg(b);
        return QV("Résous " + M("\\ln(" + ex + ") = " + N(a)) + ". Donne la valeur exacte (tape « exp(…) » ou « e^… »).", v, m === 1 ? "exp(" + a + ")" + (b ? (b > 0 ? "-" : "+") + Math.abs(b) : "") : "(exp(" + a + ")" + (b > 0 ? "-" : "+") + Math.abs(b) + ")/" + m,
          M("\\ln X = " + N(a) + " \\iff X = e^{" + N(a) + "}") + " : " + M(ex + " = e^{" + N(a) + "}") + ", " + M("x = " + (m === 1 ? "e^{" + N(a) + "}" + sg(-b) : "\\frac{e^{" + N(a) + "}" + sg(-b) + "}{" + m + "}")) + " (et " + M(ex + " > 0") + " : c'est bien le cas).",
          { ctx: "ln-egal", guide: [GR(M(ex) + " = ?", Math.exp(a), M("e^{" + N(a) + "}") + "."), GR(M("x") + " ?", v, M("\\approx " + N(rnd(v, 3))) + ".")],
            traps: [TR(rnd((Math.log(a > 0 ? a : 1) - b) / m, 9), "ln X = a donne X = e^a."), TR(rnd((a - b) / m, 9), "On applique exp aux deux membres.")] }); },
    ],
    2: [
      () => { const a = nz(-4, 5), b = pk([-7, -5, -3, 3, 5, 7, 2, -2]), v = (1 - b) / a; if (!a || Math.abs(a) === 1 && !(1 - b)) return null;
        return QN("Résous " + M("\\ln(" + lin(a, b) + ") = 0") + ".", v,
          M("\\ln X = 0 \\iff X = 1") + " : " + M(lin(a, b) + " = 1") + ", " + M("x = " + F(v)) + " (on vérifie " + M(lin(a, b) + " > 0") + ").",
          { ctx: "ln-affine", guide: [GR("Pour quel nombre " + M("X") + " a-t-on " + M("\\ln X = 0") + " ?", 1, M("X = 1") + "."), GR(M("x") + " ?", v, M(F(v)) + ".")],
            traps: [TR(-b / a, "ln X = 0 donne X = 1, pas X = 0."), TR((Math.E - b) / a, "ln X = 0 donne X = e⁰ = 1.")] }); },
      () => { const t = pk([3, 4, 5, 6, 8, 10]), c = pk([[2, "double"], [3, "triple"], [1.5, "augmente de moitié"]]), q = 1 + t / 100, n = Math.ceil(Math.log(c[0]) / Math.log(q) - 1e-12), ctx = pk([["Un capital", "placé à", "capital"], ["La population d'une ville", "qui augmente de", "population"], ["Le nombre d'abonnés d'une chaîne", "qui augmente de", "abonnes"]]);
        return QN(ctx[0] + " " + ctx[1] + " " + M(t + "\\,\\%") + " par an " + (c[1] === "augmente de moitié" ? "augmente de moitié" : c[1] === "double" ? "double" : "triple") + " au bout de combien d'années au minimum ? (On résout " + M(N(q) + "^n \\geqslant " + N(c[0])) + ".)", n,
          M(N(q) + "^n \\geqslant " + N(c[0]) + " \\iff n\\ln " + N(q) + " \\geqslant \\ln " + N(c[0]) + " \\iff n \\geqslant \\frac{\\ln " + N(c[0]) + "}{\\ln " + N(q) + "} \\approx " + N(rnd(Math.log(c[0]) / Math.log(q), 2))) + " (car " + M("\\ln " + N(q) + " > 0") + ") : " + M("n = " + n) + ".",
          { ctx: "seuil-" + ctx[2], guide: [GR(M("\\frac{\\ln " + N(c[0]) + "}{\\ln " + N(q) + "}") + " (au centième) ?", Math.log(c[0]) / Math.log(q), M("\\approx " + N(rnd(Math.log(c[0]) / Math.log(q), 2))) + ".", 0.01), GR("Plus petit entier " + M("n") + " ?", n, M(n) + ".")],
            traps: [TR(n - 1, "n doit être supérieur ou égal au quotient : on arrondit à l'entier supérieur."), TR(Math.round(100 * (c[0] - 1) / t), "Les hausses se composent (suite géométrique) : on ne divise pas simplement.")] }); },
      () => { const base = pk([2, 3, 5]), p = pk([3, 4, 5, -2, -3]), m = pk([1, 2, -1]), val = base ** p, k = p * m;
        const tx = p > 0 ? N(val) : "\\frac{1}{" + N(base ** -p) + "}";
        return QN("Écris " + M((m === 1 ? "" : m === -1 ? "-" : m) + "\\ln " + tx) + " sous la forme " + M("k\\ln " + base) + ". Que vaut " + M("k") + " ?", k,
          M(tx + " = " + base + "^{" + p + "}") + " et " + M("\\ln(a^n) = n\\ln a") + " : " + M((m === 1 ? "" : m === -1 ? "-" : m) + "\\ln " + tx + " = " + (m === 1 ? "" : m === -1 ? "-" : m + X) + NP(p) + "\\ln " + base + " = " + N(k) + "\\ln " + base) + ".",
          { ctx: "puissance", guide: [GR(M(tx) + " est " + M(base) + " à la puissance ?", p, M(p) + "."), GR(M("k") + " ?", k, M(k) + ".")],
            traps: [TR(-k, "ln(1/a) = −ln a : attention au signe."), TR(rnd(val / base * m), "ln(aⁿ) = n ln a : l'exposant passe devant.")] }); },
    ],
    3: [
      () => { const [a, b] = pk([[1, 2], [1, 3], [-1, 2], [2, 3], [-1, 1]]), s = a + b, p = a * b;
        return QSet("Résous " + M("(\\ln x)^2" + sg(-s) + "\\ln x" + sg(p) + " = 0") + " (on pose " + M("X = \\ln x") + "). Donne les valeurs exactes séparées par « ; ».", [Math.exp(a), Math.exp(b)],
          "Avec " + M("X = \\ln x") + " : " + M("X^2" + sg(-s) + "X" + sg(p) + " = 0") + ", " + M("X = " + a) + " ou " + M("X = " + b) + ". Donc " + M("x = e^{" + a + "}") + " ou " + M("x = e^{" + b + "}") + ".",
          { ctx: "changement-variable", canon: "exp(" + a + ") ; exp(" + b + ")", guide: [FRX.GSet("Solutions en " + M("X") + " ?", [a, b], M(a + " \\,;\\, " + b) + "."), FRX.GSet("Solutions en " + M("x") + " ?", [Math.exp(a), Math.exp(b)], M("e^{" + a + "} \\,;\\, e^{" + b + "}") + ".")],
            traps: [{ s: [a, b], m: "Ce sont les valeurs de X = ln x : il reste x = e^X." }, { s: [Math.exp(a)], m: "Il y a deux solutions." }] }); },
      () => { const r = pk([2, 3, 4, 5, 6]), k = r * r - 1;
        return QN("Résous " + M("\\ln(x - 1) + \\ln(x + 1) = \\ln " + k) + ".", r,
          "Il faut " + M("x > 1") + ". Alors " + M("\\ln((x - 1)(x + 1)) = \\ln " + k) + ", " + M("x^2 - 1 = " + k) + ", " + M("x^2 = " + r * r) + ", " + M("x = " + r) + " ou " + M("x = -" + r) + " ; seule " + M("x = " + r) + " vérifie " + M("x > 1") + ".",
          { ctx: "domaine-equation", guide: [GR("Équation sans ln : " + M("x^2 = \\dots") + " ?", r * r, M("x^2 = " + r * r) + "."), GR("Solution qui vérifie " + M("x > 1") + " ?", r, M(r) + ".")],
            traps: [TR(-r, "−" + r + " n'est pas dans le domaine (x − 1 > 0)."), TR((k + 1) / 2, "ln a + ln b = ln(ab), pas ln(a + b).")] }); },
      () => { const u0 = pk([500, 800, 1000, 2000]), q = pk([0.9, 0.8, 0.95, 0.85]), s = pk([100, 200, 50]), n = Math.ceil(Math.log(s / u0) / Math.log(q) + 1e-12), c = pk([["Une voiture perd", "de sa valeur chaque année ; elle vaut", "€", "voiture"], ["Un lac perd", "de ses poissons chaque année ; il en compte", "poissons", "lac"], ["Un médicament s'élimine :", "de la dose disparaît chaque heure ; il en reste", "mg", "medicament"]]);
        if (s >= u0) return null;
        return QN(c[0] + " " + M(N(rnd((1 - q) * 100)) + "\\,\\%") + " " + c[1] + " " + M(N(u0)) + " " + c[2] + " au départ. À partir de quel rang " + M("n") + " a-t-on " + M("u_n = " + N(u0) + X + N(q) + "^n < " + N(s)) + " ?", n,
          M(N(q) + "^n < " + F(s / u0) + " \\iff n\\ln " + N(q) + " < \\ln " + F(s / u0) + " \\iff n > \\frac{\\ln " + F(s / u0) + "}{\\ln " + N(q) + "} \\approx " + N(rnd(Math.log(s / u0) / Math.log(q), 2))) + " (on divise par " + M("\\ln " + N(q) + " < 0") + " : le sens change) : " + M("n = " + n) + ".",
          { ctx: "seuil-" + c[3], guide: [GR(M("\\frac{\\ln " + F(s / u0) + "}{\\ln " + N(q) + "}") + " (au centième) ?", Math.log(s / u0) / Math.log(q), M("\\approx " + N(rnd(Math.log(s / u0) / Math.log(q), 2))) + ".", 0.01), GR(M("n") + " ?", n, M(n) + ".")],
            traps: [TR(n - 1, "Au rang " + (n - 1) + ", on n'est pas encore sous " + s + "."), TR(Math.floor(Math.log(u0 / s) / Math.log(q)), "ln " + N(q).replace("{,}", ",") + " < 0 : en divisant, le sens de l'inégalité change.")] }); },
    ],
  };

  // ======================= trigfr : fonctions sinus et cosinus (Tle.AN.15–18) =======================
  const angT = (k, d) => { const g = g2(k, d) || 1; k /= g; d /= g; if (!k) return ["0", "0"]; const s = k < 0 ? "-" : "", a = Math.abs(k); return d === 1 ? [s + (a === 1 ? "" : a) + "\\pi", s + (a === 1 ? "" : a) + "π"] : [s + "\\frac{" + (a === 1 ? "" : a) + "\\pi}{" + d + "}", s + (a === 1 ? "" : a) + "π/" + d]; };
  const TF = {
    1: [
      () => { const a = nz(-5, 5), b = nz(-5, 5), e = a + "*cos(x)" + (b > 0 ? "+" : "-") + Math.abs(b) + "*sin(x)";
        return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = " + co(a, "\\sin x") + (b < 0 ? " + " : " - ") + co(Math.abs(b), "\\cos x")) + ". Tape « sin(x) » et « cos(x) ».", e,
          M("(\\sin x)' = \\cos x") + " et " + M("(\\cos x)' = -\\sin x") + " : " + M("f'(x) = " + co(a, "\\cos x") + (b > 0 ? " + " : " - ") + co(Math.abs(b), "\\sin x")) + ".",
          { ctx: "derivee", guide: [GX("Dérivée de " + M(co(a, "\\sin x")) + " ?", a + "*cos(x)", M(co(a, "\\cos x")) + "."), GX(M("f'(x)") + " ?", e, M(co(a, "\\cos x") + (b > 0 ? " + " : " - ") + co(Math.abs(b), "\\sin x")) + ".")],
            traps: [TX(a + "*cos(x)" + (b > 0 ? "-" : "+") + Math.abs(b) + "*sin(x)", "(cos x)' = −sin x : attention au signe."), TX(-a + "*cos(x)" + (b > 0 ? "+" : "-") + Math.abs(b) + "*sin(x)", "(sin x)' = cos x, sans signe moins.")] }); },
      () => { const [vt, vs, vv] = pk([["\\frac{1}{2}", "1/2", 0.5], ["-\\frac{1}{2}", "-1/2", -0.5], ["\\frac{\\sqrt{2}}{2}", "√2/2", Math.SQRT2 / 2], ["-\\frac{\\sqrt{3}}{2}", "-√3/2", -Math.sqrt(3) / 2], ["\\frac{\\sqrt{3}}{2}", "√3/2", Math.sqrt(3) / 2]]);
        const a = Math.asin(vv), s1 = ((a % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI), s2 = ((Math.PI - a) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI), txt = (t) => { const k = Math.round((t * 6) / Math.PI); if (Math.abs((k * Math.PI) / 6 - t) < 1e-9) return angT(k, 6); const k4 = Math.round((t * 4) / Math.PI); return angT(k4, 4); };
        return QSet("Résous " + M("\\sin x = " + vt) + " sur " + M("[0 \\,;\\, 2\\pi[") + ". Sépare les solutions par « ; » (avec π).", [s1, s2],
          "Deux points du cercle ont pour ordonnée " + M(vt) + ", symétriques par rapport à l'axe des ordonnées : " + M("x = " + txt(s1)[0]) + " et " + M("x = " + txt(s2)[0]) + " (" + M("\\pi - x") + ").",
          { ctx: "equation-sin", canon: [s1, s2].map((t) => txt(t)[1]).join(" ; "), guide: [GR("Une solution ?", Math.min(s1, s2), M(txt(Math.min(s1, s2))[0]) + "."), FRX.GSet("Les deux ?", [s1, s2], M(txt(s1)[0] + " \\,;\\, " + txt(s2)[0]) + ".")],
            traps: [{ s: [s1], m: "Deux points du cercle ont cette ordonnée." }, { s: [a, -a].map((t) => ((t % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)), m: "Pour le sinus, l'autre solution est π − x (pas −x)." }] }); },
      () => { const a = nz(-4, 4), b = nz(-5, 5), [k, d] = pk([[1, 6], [1, 4], [1, 3], [1, 2], [2, 3]]), t = (2 * k * Math.PI) / d, c = rnd(Math.cos(t), 9), v = rnd(a * c + b, 9);
        const ct = Math.abs(c) < 1e-9 ? "0" : Math.abs(Math.abs(c) - 0.5) < 1e-9 ? (c < 0 ? "-" : "") + "\\frac{1}{2}" : Math.abs(Math.abs(c) - 1) < 1e-9 ? (c < 0 ? "-1" : "1") : null; if (!ct) return null;
        return QN("Soit " + M("f(x) = " + co(a, "\\cos(2x)") + sg(b)) + ". Calcule " + M("f\\left(" + angT(k, d)[0] + "\\right)") + ".", v,
          M("2" + X + angT(k, d)[0] + " = " + angT(2 * k, d)[0]) + " et " + M("\\cos\\left(" + angT(2 * k, d)[0] + "\\right) = " + ct) + " : " + M("f = " + N(a) + X + "(" + ct + ")" + sg(b) + " = " + F(v)) + ".",
          { ctx: "valeur", guide: [GR(M("\\cos\\left(" + angT(2 * k, d)[0] + "\\right)") + " ?", c, M(ct) + "."), GR("Valeur de " + M("f") + " ?", v, M(F(v)) + ".")],
            traps: [TR(rnd(a * Math.cos((k * Math.PI) / d) + b, 9), "On calcule cos(2x) : double d'abord l'angle."), TR(rnd(2 * a * Math.cos((k * Math.PI) / d) + b, 9), "cos(2x) n'est pas 2 cos x.")] }); },
    ],
    2: [
      () => { const fn = pk(["sin", "cos"]), a = nz(-4, 5), b = nz(-3, 3), k = pk([1, 2, 3, -2]), arg = (a === 1 ? "x" : a === -1 ? "-x" : a + "x") + sg(b);
        const e = fn === "sin" ? (k * a) + "*cos(" + linE(a, b) + ")" : (-k * a) + "*sin(" + linE(a, b) + ")";
        return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = " + co(k, "\\" + fn + "(" + arg + ")")) + ".", e,
          M("(\\" + fn + "(ax + b))' = " + (fn === "sin" ? "a\\cos(ax + b)" : "-a\\sin(ax + b)")) + " : " + M("f'(x) = " + (fn === "sin" ? N(k * a) + "\\cos(" + arg + ")" : N(-k * a) + "\\sin(" + arg + ")")) + ".",
          { ctx: "derivee-compose-" + fn, guide: [GR("Par quel nombre multiplie-t-on (dérivée de " + M(arg) + ") ?", a, M(N(a)) + "."), GX(M("f'(x)") + " ?", e, M(fn === "sin" ? N(k * a) + "\\cos(" + arg + ")" : N(-k * a) + "\\sin(" + arg + ")") + ".")],
            traps: [TX(fn === "sin" ? k + "*cos(" + linE(a, b) + ")" : -k + "*sin(" + linE(a, b) + ")", "Composée : on multiplie aussi par la dérivée de " + arg.replace(/\\/g, "") + ", soit " + a + "."), TX(fn === "sin" ? (-k * a) + "*cos(" + linE(a, b) + ")" : (k * a) + "*sin(" + linE(a, b) + ")", fn === "sin" ? "(sin u)' = u' cos u, sans moins." : "(cos u)' = −u' sin u.")] }); },
      () => { const kk = pk([2, 3, 4, 5, 6]), fn = pk(["sin", "cos"]), a = pk([1, 2, 3, -2]), v = (2 * Math.PI) / kk;
        return QV("Quelle est la plus petite période positive de " + M("f(x) = " + co(a, "\\" + fn + "(" + kk + "x)")) + " ? (valeur exacte, avec π)", v, "2π/" + kk === "2π/2" ? "π" : (kk % 2 === 0 ? (kk === 2 ? "π" : "π/" + kk / 2) : "2π/" + kk),
          M("\\" + fn) + " est " + M("2\\pi") + "-périodique ; " + M("\\" + fn + "(" + kk + "(x + T)) = \\" + fn + "(" + kk + "x + " + kk + "T)") + " : il faut " + M(kk + "T = 2\\pi") + ", " + M("T = \\frac{2\\pi}{" + kk + "}" + (kk % 2 === 0 ? " = " + (kk === 2 ? "\\pi" : "\\frac{\\pi}{" + kk / 2 + "}") : "")) + ".",
          { ctx: "periode-" + fn, guide: [GR("Résous " + M(kk + "T = 2\\pi") + " : " + M("T") + " ?", v, M("\\frac{2\\pi}{" + kk + "}") + ".")],
            traps: [TR(2 * Math.PI * kk, "La période est 2π divisé par " + kk + "."), TR(2 * Math.PI, "Le " + kk + " devant x accélère les oscillations : la période diminue.")] }); },
      () => { const fn = pk(["cos", "sin"]), [vt, vv, kc, dc, ks, ds] = pk([["\\frac{1}{2}", 0.5, 1, 3, 1, 6], ["\\frac{\\sqrt{2}}{2}", Math.SQRT2 / 2, 1, 4, 1, 4], ["\\frac{\\sqrt{3}}{2}", Math.sqrt(3) / 2, 1, 6, 1, 3], ["0", 0, 1, 2, 0, 1]]), ge = R.rand() < 0.5, k = fn === "cos" ? kc : ks, d = fn === "cos" ? dc : ds;
        if (fn === "sin" && !k) return null;
        let ivs, can;
        if (fn === "cos") { const a = (k * Math.PI) / d; ivs = ge ? [[-a, true, a, true]] : [[-Math.PI, false, -a, false], [a, false, Math.PI, true]]; can = ge ? "[" + angT(-k, d)[1] + " ; " + angT(k, d)[1] + "]" : "]-π ; " + angT(-k, d)[1] + "[ ∪ ]" + angT(k, d)[1] + " ; π]"; }
        else { const a = (k * Math.PI) / d; ivs = ge ? [[a, true, Math.PI - a, true]] : [[-Math.PI, false, a, false], [Math.PI - a, false, Math.PI, true]]; can = ge ? "[" + angT(k, d)[1] + " ; " + angT(d - k, d)[1] + "]" : "]-π ; " + angT(k, d)[1] + "[ ∪ ]" + angT(d - k, d)[1] + " ; π]"; }
        return mk("Résous " + M("\\" + fn + " x " + (ge ? "\\geqslant" : "<") + " " + vt) + " sur " + M("]-\\pi \\,;\\, \\pi]") + ". Donne un intervalle ou une réunion d'intervalles (avec π).", solsetSpec(ivs),
          "On lit sur le cercle trigonométrique les points dont " + (fn === "cos" ? "l'abscisse" : "l'ordonnée") + " est " + (ge ? "supérieure ou égale à " : "strictement inférieure à ") + M(vt) + " : " + M("S = " + can.replace(/π/g, "\\pi ").replace(/∪/g, "\\cup")) + ".",
          { ctx: "inequation-" + fn, canon: can, guide: [GR("Valeur positive de " + M("x") + " (dans " + M("[0 \\,;\\, \\pi]") + ") où " + M("\\" + fn + " x = " + vt) + " ?", (k * Math.PI) / d, M(angT(k, d)[0]) + ".")],
            traps: [TS(fn === "cos" ? (ge ? [[-Math.PI, false, -(k * Math.PI) / d, true], [(k * Math.PI) / d, true, Math.PI, true]] : [[-(k * Math.PI) / d, false, (k * Math.PI) / d, false]]) : (ge ? [[-Math.PI, false, (k * Math.PI) / d, true]] : [[(k * Math.PI) / d, false, Math.PI - (k * Math.PI) / d, false]]), "Tu as pris le complémentaire : vérifie le sens de l'inégalité sur le cercle.")] }); },
    ],
    3: [
      () => { const [a, c, at, ae] = pk([[1, 2, "x", "1"], [Math.SQRT2, 2, "\\sqrt{2}x", "sqrt(2)"], [Math.sqrt(3), 2, "\\sqrt{3}x", "sqrt(3)"], [1, 1, "x", "1"], [2, 4, "2x", "2"]]); /* f(x) = a·x + c·cos x sur [0 ; π] : f'(x) = a − c·sin x */
        const s = a / c; const x1 = Math.asin(s), x2 = Math.PI - x1, txt = (t) => { for (const d of [6, 4, 3, 2]) { const k = Math.round((t * d) / Math.PI); if (Math.abs((k * Math.PI) / d - t) < 1e-9) return angT(k, d); } return ["?", "?"]; };
        const S = Math.abs(x1 - x2) < 1e-9 ? [x1] : [x1, x2];
        return mk("Soit " + M("f(x) = " + at + " + " + (c === 1 ? "" : c) + "\\cos x") + " sur " + M("[0 \\,;\\, \\pi]") + ". En quelles valeurs " + M("f'") + " s'annule-t-elle ? Sépare-les par « ; » (avec π).", { kind: "set", values: S },
          M("f'(x) = " + at.replace("x", "") + (at === "x" ? "1" : "") + " - " + (c === 1 ? "" : c) + "\\sin x") + " ; " + M("f'(x) = 0 \\iff \\sin x = " + (Math.abs(s - Math.SQRT2 / 2) < 1e-9 ? "\\frac{\\sqrt{2}}{2}" : Math.abs(s - Math.sqrt(3) / 2) < 1e-9 ? "\\frac{\\sqrt{3}}{2}" : F(s))) + " : " + S.map((t) => M("x = " + txt(t)[0])).join(" et ") + ". " + (S.length === 1 ? M("f'(x) \\geqslant 0") + " : " + M("f") + " est croissante (tangente horizontale en " + M("\\frac{\\pi}{2}") + ")." : M("f") + " est croissante, décroissante puis croissante."),
          { ctx: "etude", canon: S.map((t) => txt(t)[1]).join(" ; "), guide: [GX(M("f'(x)") + " ?", ae + "-" + c + "*sin(x)", M(at.replace("x", "") + (at === "x" ? "1" : "") + " - " + (c === 1 ? "" : c) + "\\sin x") + "."), GR(M("\\sin x") + " = ?", s, "Valeur exacte " + M("\\approx " + N(rnd(s, 3))) + ".")],
            traps: [{ s: [Math.acos(s), -Math.acos(s)].filter((t) => t >= 0), m: "(cos x)' = −sin x : on résout sin x = " + FS(s) + "." }, { s: [x1], m: "Sur [0 ; π], sin x = " + FS(s) + " a deux solutions : x et π − x." }] }); },
      () => { const [vt, vv] = pk([["\\frac{1}{2}", 0.5], ["-\\frac{1}{2}", -0.5], ["\\frac{\\sqrt{2}}{2}", Math.SQRT2 / 2], ["0", 0], ["1", 1]]), kk = pk([2, 3]), fn = pk(["cos", "sin"]);
        const n = Math.abs(vv) === 1 ? kk : 2 * kk;
        return QN("Combien de solutions l'équation " + M("\\" + fn + "(" + kk + "x) = " + vt) + " a-t-elle sur " + M("[0 \\,;\\, 2\\pi[") + " ?", n,
          "Quand " + M("x") + " parcourt " + M("[0 \\,;\\, 2\\pi[") + ", " + M(kk + "x") + " parcourt " + M("[0 \\,;\\, " + 2 * kk + "\\pi[") + ", soit " + kk + " tours du cercle. Sur un tour, " + M("\\" + fn + " X = " + vt) + " a " + (Math.abs(vv) === 1 ? "1 solution" : "2 solutions") + " : en tout " + n + ".",
          { ctx: "nb-solutions-" + fn, guide: [GR("Combien de tours de cercle parcourt " + M(kk + "x") + " ?", kk, M(kk) + "."), GR("Nombre de solutions ?", n, M(n) + ".")],
            traps: [TR(Math.abs(vv) === 1 ? 1 : 2, "Avec " + kk + "x, on fait " + kk + " tours : plus de solutions."), TR(2 * kk + (Math.abs(vv) === 1 ? 0 : 2), "Compte les solutions sur un tour, puis multiplie par " + kk + ".")] }); },
      () => { const k = pk([2, 3, 4, 5, -2, 0.5]), fn = pk(["sin", "tan"]), v = k;
        return QN("Calcule " + M("\\lim_{x \\to 0} \\frac{\\sin(" + (k === 1 ? "" : N(k)) + "x)}{x}") + " (on rappelle que " + M("\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1") + ", nombre dérivé de " + M("\\sin") + " en 0).", v,
          M("\\frac{\\sin(" + N(k) + "x)}{x} = " + N(k) + X + "\\frac{\\sin(" + N(k) + "x)}{" + N(k) + "x}") + " et " + M("\\frac{\\sin X}{X} \\to 1") + " quand " + M("X \\to 0") + " : la limite vaut " + M(N(k)) + ".",
          { ctx: "limite", guide: [GR("Par quel nombre faut-il multiplier et diviser ?", k, M(N(k)) + "."), GR("Limite ?", v, M(N(v)) + ".")],
            traps: [TR(1, "Le " + N(k).replace("{,}", ",") + " compte : sin(kx)/x ≈ kx/x = k."), TR(rnd(1 / k), "sin(kx) ≈ kx près de 0 : k au numérateur.")] }); },
    ],
  };

  // ======================= tvi : théorème des valeurs intermédiaires (Tle.AN.11–12) =======================
  const tab = (xs, ys) => M("\\begin{array}{c|" + "c".repeat(2 * xs.length - 1) + "} x & " + xs.join(" & & ") + " \\\\ \\hline f(x) & " + ys.map((y, i) => y + (i < ys.length - 1 ? " & " + (typeof ys[i + 1] === "string" ? (ys[i + 1].includes("+") ? "\\nearrow" : "\\searrow") : (typeof y === "string" ? (y.includes("+") ? "\\searrow" : "\\nearrow") : (ys[i + 1] > y ? "\\nearrow" : "\\searrow"))) : "")).join(" & ") + " \\end{array}");
  const TVI = {
    1: [
      () => { const c = pk([2, 3, 5, 7, 10, 20]), r = Math.cbrt(c), n = Math.floor(r); if (Math.abs(r - Math.round(r)) < 1e-9) return null;
        return QN("La fonction " + M("f(x) = x^3") + " est continue et strictement croissante sur " + M("\\mathbb{R}") + ". L'équation " + M("x^3 = " + c) + " a une unique solution " + M("\\alpha") + ". Quel est l'entier " + M("n") + " tel que " + M("n < \\alpha < n + 1") + " ?", n,
          M(n + "^3 = " + n ** 3 + " < " + c) + " et " + M((n + 1) + "^3 = " + (n + 1) ** 3 + " > " + c) + " : d'après le théorème des valeurs intermédiaires (fonction continue strictement croissante), " + M(n + " < \\alpha < " + (n + 1)) + ".",
          { ctx: "encadrement-cube", guide: [GR(M((n + 1) + "^3") + " ?", (n + 1) ** 3, M((n + 1) ** 3) + " (plus grand que " + c + ")."), GR(M("n") + " ?", n, M(n) + ".")],
            traps: [TR(n + 1, "(" + (n + 1) + ")³ = " + (n + 1) ** 3 + " dépasse déjà " + c + " : α est avant " + (n + 1) + "."), TR(Math.round(c / 3), "On cherche α tel que α³ = " + c + ", pas 3α.")] }); },
      () => { const a = R.int(-2, 1), b = a + R.int(2, 4), fa = -R.int(2, 9), fb = R.int(2, 9), inc = R.rand() < 0.5, ys = inc ? [fa, fb] : [fb, fa], n = fb - fa + 1;
        return QN(M("f") + " est continue et strictement " + (inc ? "croissante" : "décroissante") + " sur " + M("[" + a + " \\,;\\, " + b + "]") + ", avec " + M("f(" + a + ") = " + ys[0]) + " et " + M("f(" + b + ") = " + ys[1]) + ". Pour combien d'entiers " + M("k") + " l'équation " + M("f(x) = k") + " a-t-elle une solution dans " + M("[" + a + " \\,;\\, " + b + "]") + " ?", n,
          "D'après le théorème des valeurs intermédiaires, " + M("f") + " (continue) prend toutes les valeurs entre " + M(fa) + " et " + M(fb) + ", et seulement celles-là (monotone). Entiers de " + M(fa) + " à " + M(fb) + " : " + M(fb + " - (" + fa + ") + 1 = " + n) + ".",
          { ctx: "entiers-atteints", guide: [GR("Plus petit entier atteint ?", fa, M(fa) + "."), GR("Plus grand ?", fb, M(fb) + "."), GR("Combien d'entiers de " + M(fa) + " à " + M(fb) + " ?", n, M(n) + ".")],
            traps: [TR(n - 1, "Les deux bornes " + fa + " et " + fb + " comptent (atteintes en " + a + " et " + b + ")."), TR(fb - fa - 1, "f(" + a + ") et f(" + b + ") sont des valeurs atteintes.")] }); },
      () => { const [fx, f, lo, hi] = pk([["x^3 - 2x - 5", (x) => x ** 3 - 2 * x - 5, 2, 3], ["x^3 + x - 3", (x) => x ** 3 + x - 3, 1, 2], ["x^3 - 3x - 1", (x) => x ** 3 - 3 * x - 1, 1, 2], ["x^3 + 2x - 7", (x) => x ** 3 + 2 * x - 7, 1, 2]]), m = (lo + hi) / 2, fm = f(m), nl = fm < 0 ? m : lo;
        return QN("On cherche la solution " + M("\\alpha") + " de " + M(fx + " = 0") + " par dichotomie. On sait que " + M("f(" + lo + ") < 0") + " et " + M("f(" + hi + ") > 0") + ". On calcule " + M("f(" + N(m) + ")") + ". Quelle est la borne gauche du nouvel intervalle qui contient " + M("\\alpha") + " ?", nl,
          M("f(" + N(m) + ") = " + N(rnd(fm, 4))) + (fm < 0 ? " < 0 : la solution est entre " + M(N(m)) + " et " + M(hi) : " > 0 : la solution est entre " + M(lo) + " et " + M(N(m))) + ". Borne gauche : " + M(N(nl)) + ".",
          { ctx: "dichotomie", shownOk: true, guide: [GR(M("f(" + N(m) + ")") + " (au millième) ?", fm, M("\\approx " + N(rnd(fm, 3))) + ".", 0.001), GR("Borne gauche ?", nl, M(N(nl)) + ".")],
            traps: [TR(fm < 0 ? lo : m, "On garde la moitié où f change de signe."), TR(hi, "C'est la borne droite.")] }); },
    ],
    2: [
      () => { const c = pk([3, 5, 6, 10, 12, 15]), f = (x) => x ** 3 + x - c; let lo = 0; while (f(lo + 1) < 0) lo++; let x = lo; while (f(rnd(x + 0.1, 6)) < 0) x = rnd(x + 0.1, 6);
        if (Math.abs(f(x)) < 1e-9) return null;
        return QN("L'équation " + M("x^3 + x = " + c) + " a une unique solution " + M("\\alpha") + " (fonction continue strictement croissante). Donne la valeur approchée de " + M("\\alpha") + " par défaut au dixième (balayage avec la calculatrice).", x,
          "On tabule " + M("f(x) = x^3 + x - " + c) + " avec un pas de 0,1 : " + M("f(" + N(x) + ") \\approx " + N(rnd(f(x), 3)) + " < 0") + " et " + M("f(" + N(rnd(x + 0.1, 6)) + ") \\approx " + N(rnd(f(x + 0.1), 3)) + " > 0") + ", donc " + M(N(x) + " < \\alpha < " + N(rnd(x + 0.1, 6))) + ". Valeur par défaut : " + M(N(x)) + ".",
          { ctx: "balayage", guide: [GR("Entier " + M("n") + " tel que " + M("n < \\alpha < n + 1") + " ?", lo, M(lo) + "."), GR("Valeur par défaut au dixième ?", x, M(N(x)) + ".")],
            traps: [TR(rnd(x + 0.1, 6), "C'est la valeur par excès : par défaut = la borne inférieure."), TR(lo, "Au dixième : il faut une décimale.")] }); },
      () => { const k = pk([3, 4, 5, 6, 8, 10]), f = (x) => Math.exp(x) + x - k; let n = -1; while (f(n + 1) < 0) n++;
        return QN("La fonction " + M("f(x) = e^x + x") + " est continue et strictement croissante sur " + M("\\mathbb{R}") + ". L'équation " + M("e^x + x = " + k) + " a une unique solution " + M("\\alpha") + ". Quel est l'entier " + M("n") + " tel que " + M("n < \\alpha < n + 1") + " ?", n,
          M("f(" + n + ") = e^{" + n + "} + " + n + " \\approx " + N(rnd(f(n) + k, 2)) + " < " + k) + " et " + M("f(" + (n + 1) + ") \\approx " + N(rnd(f(n + 1) + k, 2)) + " > " + k) + " : " + M(n + " < \\alpha < " + (n + 1)) + ".",
          { ctx: "encadrement-exp", guide: [GR(M("e^{" + (n + 1) + "} + " + (n + 1)) + " (au centième) ?", f(n + 1) + k, M("\\approx " + N(rnd(f(n + 1) + k, 2))) + ".", 0.01), GR(M("n") + " ?", n, M(n) + ".")],
            traps: [TR(n + 1, "f(" + (n + 1) + ") dépasse déjà " + k + "."), TR(Math.round(Math.log(k)), "Le terme + x compte aussi.")] }); },
      () => { const k = R.int(-6, 6), a = -R.int(3, 8), b = R.int(3, 8);
        if (k === a || k === b) return null;
        let n = 0; const ys = ["-\\infty", b, a, "+\\infty"]; const vals = [-Infinity, Math.max(a, b), Math.min(a, b), Infinity];
        for (let i = 0; i < 3; i++) { const u = vals[i], w = vals[i + 1]; if ((k > Math.min(u, w) && k < Math.max(u, w))) n++; }
        return QN("Une fonction " + M("f") + " continue sur " + M("\\mathbb{R}") + " a pour tableau de variations " + tab(["-\\infty", -1, 2, "+\\infty"], ys) + ". Combien de solutions l'équation " + M("f(x) = " + k) + " a-t-elle ?", n,
          "Sur chaque intervalle où " + M("f") + " est strictement monotone, elle prend une seule fois chaque valeur comprise entre ses limites ou valeurs aux bornes. " + M(k) + " est atteint sur " + n + " des trois intervalles : " + n + " solution" + (n > 1 ? "s" : "") + ".",
          { ctx: "tableau-limites", guide: [GR("Sur combien des trois intervalles " + M(k) + " est-il atteint ?", n, M(n) + ".")],
            traps: [TR(n === 3 ? 1 : 3, "Regarde chaque flèche : " + k + " est-il entre ses deux extrémités ?"), TR(n === 1 ? 2 : 1, "Une flèche vers +∞ (ou −∞) atteint toutes les valeurs au-delà de son départ.")] }); },
    ],
    3: [
      () => { const [fx, l, f] = pk([["\\sqrt{2u_n + 3}", 3, (x) => Math.sqrt(2 * x + 3)], ["\\sqrt{u_n + 6}", 3, (x) => Math.sqrt(x + 6)], ["\\sqrt{3u_n + 4}", 4, (x) => Math.sqrt(3 * x + 4)]]);
        return QN("La suite " + M("(u_n)") + " est définie par " + M("u_0 = 1") + " et " + M("u_{n+1} = " + fx) + ". On admet qu'elle converge vers " + M("\\ell") + ". Comme la fonction est continue, " + M("\\ell") + " vérifie " + M("\\ell = f(\\ell)") + ". Que vaut " + M("\\ell") + " ?", l,
          "On résout " + M("\\ell = f(\\ell)") + " avec " + M("\\ell \\geqslant 0") + " : on élève au carré, on obtient une équation du second degré dont la racine positive est " + M(l) + ".",
          { ctx: "point-fixe", guide: [GR("Valeur de " + M("u_1") + " (au centième) ?", f(1), M("\\approx " + N(rnd(f(1), 2))) + ".", 0.01), GR(M("\\ell") + " ?", l, M(l) + ".")],
            traps: [TR(-1, "Une racine carrée est positive : la solution négative de l'équation est exclue."), TR(rnd(f(1), 2), "C'est u₁ : on cherche la limite.")] }); },
      () => { const k = R.int(-4, 4), n = Math.abs(k) < 2 ? 3 : Math.abs(k) === 2 ? 2 : 1;
        return QN("Combien de solutions l'équation " + M("x^3 - 3x = " + k) + " a-t-elle sur " + M("\\mathbb{R}") + " ? (Étudie les variations de " + M("f(x) = x^3 - 3x") + ".)", n,
          M("f'(x) = 3x^2 - 3") + " s'annule en " + M("-1") + " et " + M("1") + " ; " + M("f(-1) = 2") + " (maximum local), " + M("f(1) = -2") + " (minimum local), limites " + M("-\\infty") + " et " + M("+\\infty") + ". " + (n === 3 ? M(k) + " est entre −2 et 2 : une solution sur chaque intervalle, 3 en tout." : n === 2 ? M(k) + " est un extremum local : deux solutions (dont une double)." : M(k) + " est hors de [−2 ; 2] : une seule solution."),
          { ctx: "nb-cubique", guide: [GR("Maximum local " + M("f(-1)") + " ?", 2, M(2) + "."), GR("Minimum local " + M("f(1)") + " ?", -2, M(-2) + "."), GR("Nombre de solutions ?", n, M(n) + ".")],
            traps: [TR(n === 3 ? 1 : 3, "Compare " + k + " aux valeurs des extremums locaux 2 et −2."), TR(n === 1 ? 2 : 1, "Sur chaque intervalle de monotonie, au plus une solution.")] }); },
      () => { const c = pk([2, 3, 4]), f = (x) => Math.log(x) + x - c; let lo = 0.01, hi = 10; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (f(m) < 0) lo = m; else hi = m; } const r = lo;
        return QR("L'équation " + M("\\ln x + x = " + c) + " a une unique solution " + M("\\alpha") + " sur " + M("]0 \\,;\\, +\\infty[") + ". Donne une valeur approchée de " + M("\\alpha") + " à 0,01 près.", r, 0.01,
          M("f(x) = \\ln x + x - " + c) + " est continue et strictement croissante. Par balayage (ou dichotomie) : " + M("\\alpha \\approx " + N(rnd(r, 2))) + ".",
          { ctx: "ln-x", guide: [GR("Entier " + M("n") + " tel que " + M("n < \\alpha < n + 1") + " ?", Math.floor(r), M(Math.floor(r)) + "."), GR(M("\\alpha") + " à 0,01 près ?", r, M("\\approx " + N(rnd(r, 2))) + ".", 0.01)],
            traps: [TR(rnd(Math.exp(c), 2), "e^" + c + " résout ln x = " + c + " seulement ; il y a aussi + x."), TR(c, "Le ln compte : ln " + c + " + " + c + " ≠ " + c + ".")] }); },
    ],
  };

  // ======================= sommeva : sommes de variables aléatoires, concentration (Tle.SP.05–07) =======================
  const SV = {
    1: [
      () => { const e1 = pk([2, 3.5, 4, -1, 1.5]), e2 = pk([5, 2.5, -2, 6, 1]), a = pk([1, 2, 3]), b = pk([1, -1, 2]), v = rnd(a * e1 + b * e2);
        return QN("On sait que " + M("E(X) = " + N(e1)) + " et " + M("E(Y) = " + N(e2)) + ". Calcule " + M("E(" + (a === 1 ? "" : a) + "X " + (b < 0 ? "-" : "+") + " " + (Math.abs(b) === 1 ? "" : Math.abs(b)) + "Y)") + ".", v,
          "L'espérance est linéaire : " + M("E(aX + bY) = aE(X) + bE(Y) = " + a + X + NP(e1) + sg(b) + X + NP(e2) + " = " + N(v)) + " (sans hypothèse d'indépendance).",
          { ctx: "esperance-somme", guide: [GR(M("aE(X) + bE(Y)") + " ?", v, M(N(v)) + ".")],
            traps: [TR(rnd(e1 + e2), "Multiplie par les coefficients " + a + " et " + b + "."), TR(rnd(a * e1 - b * e2), "Attention au signe devant Y.")] }); },
      () => { const v1 = pk([2, 4, 1.5, 3, 6]), v2 = pk([1, 5, 2.5, 4]), a = pk([1, 2, 3, -1, -2]), v = rnd(a * a * v1 + v2);
        return QN(M("X") + " et " + M("Y") + " sont indépendantes, avec " + M("V(X) = " + N(v1)) + " et " + M("V(Y) = " + N(v2)) + ". Calcule " + M("V(" + (a === 1 ? "" : a === -1 ? "-" : a) + "X + Y)") + ".", v,
          "Indépendantes : " + M("V(aX + Y) = a^2V(X) + V(Y) = " + a * a + X + N(v1) + " + " + N(v2) + " = " + N(v)) + ".",
          { ctx: "variance-somme", guide: [GR(M("V(" + (a === 1 ? "" : a === -1 ? "-" : a) + "X) = a^2V(X)") + " ?", rnd(a * a * v1), M(N(rnd(a * a * v1)))  + "."), GR("Somme ?", v, M(N(v)) + ".")],
            traps: [TR(rnd(a * v1 + v2), "V(aX) = a²V(X) : le coefficient est au carré."), TR(rnd(a * a * v1 - v2), "Les variances s'ajoutent toujours (variables indépendantes).")] }); },
      () => { const mu = pk([10, 50, 3.5, 12, 0.4]), s2 = pk([4, 9, 16, 25, 36]), n = pk([4, 9, 16, 25, 100]), v = rnd(s2 / n);
        return QN("On répète " + M(n) + " fois, de façon indépendante, une expérience dont le résultat " + M("X") + " vérifie " + M("E(X) = " + N(mu)) + " et " + M("V(X) = " + s2) + ". Soit " + M("M_n") + " la moyenne des " + n + " résultats. Calcule " + M("V(M_n)") + ".", v,
          M("V(M_n) = \\frac{V(X)}{n} = \\frac{" + s2 + "}{" + n + "} = " + N(v)) + " (et " + M("E(M_n) = " + N(mu)) + ").",
          { ctx: "moyenne-echantillon", guide: [GR(M("V(X_1 + \\dots + X_n) = nV(X)") + " ?", n * s2, M(N(n * s2)) + "."), GR(M("V(M_n) = \\frac{1}{n^2}V(X_1 + \\dots + X_n)") + " ?", v, M(N(v)) + ".")],
            traps: [TR(s2, "La moyenne varie moins que X : on divise par n."), TR(rnd(s2 / Math.sqrt(n)), "V(M_n) = V(X)/n ; c'est l'écart type qui est divisé par √n.")] }); },
    ],
    2: [
      () => { const n = pk([20, 50, 100, 200]), p = pk([0.1, 0.2, 0.25, 0.4, 0.5]), what = pk(["E", "V"]), v = what === "E" ? rnd(n * p) : rnd(n * p * (1 - p)), c = pk([["On lance", "fois une pièce truquée qui tombe sur pile avec la probabilité", "piles", "piece"], ["Un serveur reçoit", "requêtes ; chacune échoue indépendamment avec la probabilité", "échecs", "serveur"], ["On interroge", "personnes ; chacune a voté avec la probabilité", "votants", "sondage"]]);
        return QN(c[0] + " " + M(n) + " " + c[1] + " " + M(N(p)) + ". On note " + M("S = X_1 + \\dots + X_n") + " le nombre " + (/^[aeéiou]/.test(c[2]) ? "d'" : "de ") + c[2] + " (" + M("X_i") + " de Bernoulli). Calcule " + M(what + "(S)") + ".", v,
          (what === "E" ? M("E(S) = nE(X_1) = np = " + n + X + N(p) + " = " + N(v)) : M("V(S) = nV(X_1) = np(1 - p) = " + n + X + N(p) + X + N(rnd(1 - p)) + " = " + N(v)) + " (les " + M("X_i") + " sont indépendantes)") + ".",
          { ctx: "bernoulli-" + c[3], guide: [GR((what === "E" ? M("E(X_1) = p") : M("V(X_1) = p(1 - p)")) + " ?", what === "E" ? p : rnd(p * (1 - p)), M(N(what === "E" ? p : rnd(p * (1 - p)))) + "."), GR(M(what + "(S)") + " ?", v, M(N(v)) + ".")],
            traps: [TR(what === "E" ? rnd(n * p * (1 - p)) : rnd(n * p), what === "E" ? "C'est la variance : E(S) = np." : "C'est l'espérance : V(S) = np(1 − p)."), TR(what === "E" ? p : rnd(p * (1 - p)), "On additionne n variables : on multiplie par n.")] }); },
      () => { const mu = pk([50, 100, 20, 200]), s2 = pk([4, 9, 16, 25, 36]), d = pk([4, 5, 6, 10]), v = rnd(s2 / (d * d)); if (v >= 1) return null;
        return QN("Une variable " + M("X") + " vérifie " + M("E(X) = " + mu) + " et " + M("V(X) = " + s2) + ". D'après l'inégalité de Bienaymé-Tchebychev, quel majorant obtient-on pour " + M("P(|X - " + mu + "| \\geqslant " + d + ")") + " ?", v,
          M("P(|X - E(X)| \\geqslant \\delta) \\leqslant \\frac{V(X)}{\\delta^2} = \\frac{" + s2 + "}{" + d * d + "} = " + N(v)) + ".",
          { ctx: "bienayme", guide: [GR(M("\\delta^2") + " ?", d * d, M(d * d) + "."), GR("Majorant ?", v, M(N(v)) + ".")],
            traps: [TR(rnd(s2 / d), "On divise par δ², pas par δ."), TR(rnd(Math.sqrt(s2) / d), "On utilise la variance V(X), pas l'écart type.")] }); },
      () => { const k = pk([2, 3, 4, 5]), wh = pk(["E", "V"]), v = wh === "E" ? rnd(3.5 * k) : rnd((35 / 12) * k, 9);
        return QN("On lance " + M(k) + " dés équilibrés à six faces et on note " + M("S") + " la somme des faces. Pour un dé, " + M("E(X) = 3{,}5") + " et " + M("V(X) = \\frac{35}{12}") + ". Calcule " + M(wh + "(S)") + (wh === "V" ? " (fraction acceptée)" : "") + ".", v,
          (wh === "E" ? M("E(S) = " + k + X + "3{,}5 = " + N(v)) : M("V(S) = " + k + X + "\\frac{35}{12} = " + F(v)) + " (dés indépendants)") + ".",
          { ctx: "des-" + wh, guide: [GR(M(wh + "(S) = " + k + X + wh + "(X)") + " ?", v, M(wh === "E" ? N(v) : F(v)) + ".")],
            traps: [TR(wh === "E" ? 3.5 : 35 / 12, "La somme de " + k + " dés : multiplie par " + k + "."), TR(wh === "E" ? rnd(3.5 * k * k) : rnd((35 / 12) * k * k, 9), "Pour une somme de variables indépendantes, on multiplie par " + k + ", pas par " + k * k + ".")] }); },
    ],
    3: [
      () => { const s2 = pk([1, 4, 9, 0.25]), d = pk([0.1, 0.2, 0.5, 0.05]), a = pk([0.05, 0.1, 0.01]), n = Math.ceil(s2 / (a * d * d) - 1e-9); if (n > 1e6 || n < 10) return null;
        return QN("Pour la moyenne " + M("M_n") + " de " + M("n") + " résultats indépendants de même loi (variance " + M(N(s2)) + "), l'inégalité de concentration donne " + M("P(|M_n - \\mu| \\geqslant " + N(d) + ") \\leqslant \\frac{" + N(s2) + "}{n" + X + N(d) + "^2}") + ". À partir de quelle valeur de " + M("n") + " ce majorant est-il inférieur ou égal à " + M(N(a)) + " ?", n,
          M("\\frac{" + N(s2) + "}{n" + X + N(rnd(d * d)) + "} \\leqslant " + N(a) + " \\iff n \\geqslant \\frac{" + N(s2) + "}{" + N(a) + X + N(rnd(d * d)) + "} = " + N(rnd(s2 / (a * d * d), 4))) + " : " + M("n = " + N(n)) + ".",
          { ctx: "concentration-n", guide: [GR(M("\\frac{" + N(s2) + "}{" + N(a) + X + N(rnd(d * d)) + "}") + " ?", s2 / (a * d * d), M(N(rnd(s2 / (a * d * d), 4))) + "."), GR(M("n") + " ?", n, M(N(n)) + ".")],
            traps: [TR(Math.ceil(s2 / (a * d)), "δ est au carré : " + N(d).replace("{,}", ",") + "² = " + N(rnd(d * d)).replace("{,}", ",") + "."), TR(n - 1, "Au rang " + (n - 1) + ", le majorant dépasse encore " + N(a).replace("{,}", ",") + " : on arrondit au-dessus.")] }); },
      () => { const g = pk([[[10, -2], [0.2, 0.8]], [[5, -1], [0.25, 0.75]], [[20, -3], [0.1, 0.9]], [[8, -2], [0.3, 0.7]]]), e = rnd(g[0][0] * g[1][0] + g[0][1] * g[1][1]), n = pk([10, 20, 50, 100]), v = rnd(n * e);
        return QN("À un jeu, on gagne " + M(g[0][0]) + " € avec la probabilité " + M(N(g[1][0])) + " et on perd " + M(-g[0][1]) + " € sinon. On joue " + M(n) + " parties indépendantes et on note " + M("G") + " le gain total. Calcule " + M("E(G)") + " (en €).", v,
          "Pour une partie : " + M("E(X) = " + g[0][0] + X + N(g[1][0]) + " + (" + g[0][1] + ")" + X + N(g[1][1]) + " = " + N(e)) + ". Par linéarité, " + M("E(G) = " + n + X + NP(e) + " = " + N(v)) + " €.",
          { ctx: "jeu-repete", guide: [GR("Espérance d'une partie ?", e, M(N(e)) + " €."), GR(M("E(G)") + " ?", v, M(N(v)) + " €.")],
            traps: [TR(rnd(n * g[0][0] * g[1][0]), "Les pertes comptent aussi dans l'espérance."), TR(e, "C'est le gain moyen d'une partie : il y en a " + n + ".")] }); },
      () => { const mu = pk([30, 60, 100]), s2 = pk([4, 9, 16]), d = pk([4, 5, 8, 10]), v = rnd(1 - s2 / (d * d)); if (v <= 0) return null;
        return QN("Une variable " + M("X") + " vérifie " + M("E(X) = " + mu) + " et " + M("V(X) = " + s2) + ". Donne un minorant de " + M("P(" + (mu - d) + " < X < " + (mu + d) + ")") + " obtenu avec l'inégalité de Bienaymé-Tchebychev.", v,
          M("P(" + (mu - d) + " < X < " + (mu + d) + ") = P(|X - " + mu + "| < " + d + ") = 1 - P(|X - " + mu + "| \\geqslant " + d + ") \\geqslant 1 - \\frac{" + s2 + "}{" + d * d + "} = " + N(v)) + ".",
          { ctx: "minoration", guide: [GR("Majorant de " + M("P(|X - " + mu + "| \\geqslant " + d + ")") + " ?", rnd(s2 / (d * d)), M(N(rnd(s2 / (d * d)))) + "."), GR("Minorant ?", v, M(N(v)) + ".")],
            traps: [TR(rnd(s2 / (d * d)), "C'est le majorant de l'évènement contraire : 1 − " + N(rnd(s2 / (d * d))).replace("{,}", ",") + "."), TR(rnd(1 - s2 / d), "δ² = " + d * d + ".")] }); },
    ],
  };

  // ======================= recurrence : raisonnement par récurrence (Tle.AN.01–02) =======================
  const RC = {
    1: [
      () => { const b = nz(-3, 4), c = nz(-5, 6); /* u_n = n² + bn + c : u_{n+1} − u_n = 2n + 1 + b */
        const U = (n) => n * n + b * n + c, e = "n^2" + (b ? (b > 0 ? "+" : "") + b + "*n" : "") + (c > 0 ? "+" : "") + c;
        return QX("On définit " + M("u_0 = " + c) + " et " + M("u_{n+1} = u_n + 2n" + sg(1 + b)) + ". Calcule " + M("u_1, u_2, u_3") + ", puis conjecture une expression de " + M("u_n") + " de la forme " + M("n^2 + bn + c") + " (à démontrer par récurrence).", e,
          M("u_1 = " + U(1) + ", u_2 = " + U(2) + ", u_3 = " + U(3)) + ". Conjecture " + M("u_n = n^2" + (b ? sg(b) + "n" : "") + sg(c)) + ". Hérédité : " + M("u_{n+1} = n^2" + (b ? sg(b) + "n" : "") + sg(c) + " + 2n" + sg(1 + b) + " = (n + 1)^2" + (b ? sg(b) + "(n + 1)" : "") + sg(c)) + ".",
          { ctx: "conjecture-formule", guide: [GR(M("u_1") + " ?", U(1), M(U(1)) + "."), GR(M("u_2") + " ?", U(2), M(U(2)) + "."), GX(M("u_n") + " ?", e, M("n^2" + (b ? sg(b) + "n" : "") + sg(c)) + ".")],
            traps: [TX("n^2+" + c, "Teste ta formule sur u₁ et u₂."), TX("2*n+" + (1 + b + c), "u_n grandit de plus en plus vite : ce n'est pas une suite arithmétique.")] }); },
      () => { const [a, b, q] = pk([[2, 1, 2], [3, -2, 3], [2, -3, 2], [3, 4, 3], [5, 1, 5]]), k = b * (1 - q) /* u_{n+1} = q u_n + k  avec u_n = a·q^n + b */, e = a * q + "*" + q + "^n" + (b > 0 ? "+" : "-") + Math.abs(b);
        return QX("Par récurrence, on veut montrer que " + M("u_n = " + a + X + q + "^n" + sg(b)) + " pour la suite " + M("u_{n+1} = " + q + "u_n" + sg(k)) + ". Hérédité : on suppose " + M("u_n = " + a + X + q + "^n" + sg(b)) + ". Exprime " + M("u_{n+1} = " + q + "u_n" + sg(k)) + " en fonction de " + M("n") + ".", e,
          M("u_{n+1} = " + q + "(" + a + X + q + "^n" + sg(b) + ")" + sg(k) + " = " + a + X + q + "^{n+1}" + sg(q * b + k) + " = " + a + X + q + "^{n+1}" + sg(b)) + " : la propriété est héréditaire.",
          { ctx: "heredite-geometrique", guide: [GX("Développe " + M(q + "(" + a + X + q + "^n" + sg(b) + ")") + ".", (a * q) + "*" + q + "^n+" + q * b, M(a * q + X + q + "^n" + sg(q * b)) + "."), GX(M("u_{n+1}") + " ?", e, M(a + X + q + "^{n+1}" + sg(b)) + ".")],
            traps: [TX(a + "*" + q + "^n+" + b, "C'est u_n ; on calcule u_{n+1} = " + q + " u_n" + (k ? " + (" + k + ")" : "") + "."), TX(a * q + "*" + q + "^n+" + q * b, "N'oublie pas d'ajouter " + k + ".")] }); },
      () => { const [S, t, e, d] = pk([["1 + 2 + \\dots + n = \\frac{n(n+1)}{2}", "1 + 2 + \\dots + n + (n + 1)", "n+1", "somme-entiers"], ["1 + 3 + 5 + \\dots + (2n - 1) = n^2", "1 + 3 + \\dots + (2n - 1) + (2n + 1)", "2*n+1", "somme-impairs"], ["1^2 + 2^2 + \\dots + n^2 = \\frac{n(n+1)(2n+1)}{6}", "1^2 + \\dots + n^2 + (n + 1)^2", "(n+1)^2", "somme-carres"]]);
        return QX("On démontre par récurrence que " + M(S) + ". À l'étape d'hérédité, on passe de la somme jusqu'au rang " + M("n") + " à celle jusqu'au rang " + M("n + 1") + " (" + M(t) + ") : quel terme ajoute-t-on ? (expression en " + M("n") + ")", e,
          "La somme au rang " + M("n + 1") + " est celle au rang " + M("n") + " plus le terme suivant : " + M(e.replace("*", "")) + ". On utilise ensuite l'hypothèse de récurrence pour la somme au rang " + M("n") + ".",
          { ctx: "heredite-" + d, guide: [GX("Terme ajouté ?", e, M(e.replace("*", "")) + ".")],
            traps: [TX(d === "somme-impairs" ? "2*n-1" : d === "somme-carres" ? "n^2" : "n", "C'est le dernier terme de la somme au rang n ; on ajoute le suivant."), TX(d === "somme-entiers" ? "(n+1)*(n+2)/2" : "(n+1)^2", "C'est la formule au rang n + 1, pas le terme ajouté.")] }); },
    ],
    2: [
      () => { const [fx, f, M0, nm] = pk([["\\sqrt{u_n + 6}", (x) => Math.sqrt(x + 6), 3, "racine6"], ["\\sqrt{2u_n + 8}", (x) => Math.sqrt(2 * x + 8), 4, "racine8"], ["\\frac{1}{2}u_n + 3", (x) => x / 2 + 3, 6, "affine"], ["\\sqrt{3u_n + 10}", (x) => Math.sqrt(3 * x + 10), 5, "racine10"]]);
        return QN("Soit " + M("u_0 = 0") + " et " + M("u_{n+1} = " + fx) + ". On montre par récurrence que " + M("0 \\leqslant u_n \\leqslant M") + " avec " + M("M") + " tel que " + M("f(M) = M") + " (la fonction est croissante). Que vaut " + M("M") + " ?", M0,
          "Hérédité : si " + M("0 \\leqslant u_n \\leqslant " + M0) + ", la fonction étant croissante, " + M("f(0) \\leqslant u_{n+1} \\leqslant f(" + M0 + ") = " + M0) + ". On a choisi " + M("M = " + M0) + " car " + M("f(" + M0 + ") = " + M0) + ".",
          { ctx: "majorant-" + nm, guide: [GR(M("f(" + M0 + ")") + " ?", f(M0), M(f(M0)) + "."), GR(M("M") + " ?", M0, M(M0) + ".")],
            traps: [TR(rnd(f(0), 3), "C'est u₁ = f(0) : on cherche M tel que f(M) = M."), TR(rnd(f(M0 + 1), 3), "Avec ce majorant, f(M) ≠ M : l'hérédité ne marche pas.")] }); },
      () => { const a = pk([4, 5, 7, 10, 3]), d = a - 1;
        return QN("On démontre par récurrence que " + M(a + "^n - 1") + " est divisible par " + M(d) + ". Hérédité : " + M(a + "^{n+1} - 1 = " + a + "(" + a + "^n - 1) + k") + ". Que vaut " + M("k") + " ?", d,
          M(a + X + a + "^n - 1 = " + a + "(" + a + "^n - 1) + " + a + " - 1") + ", donc " + M("k = " + d) + " ; comme " + M(a + "^n - 1") + " est divisible par " + M(d) + " (hypothèse) et " + M(d) + " aussi, la somme l'est.",
          { ctx: "divisibilite", guide: [GR("Développe " + M(a + "(" + a + "^n - 1)") + " : " + M(a + "^{n+1} - k'") + " avec " + M("k'") + " = ?", a, M(a) + "."), GR(M("k") + " ?", d, M(d) + ".")],
            traps: [TR(a, a + "^{n+1} − 1 = " + a + "(" + a + "ⁿ − 1) + " + a + " − 1."), TR(-1, "Développe " + a + "(" + a + "ⁿ − 1) = " + a + "^{n+1} − " + a + ".")] }); },
      () => { const [u0, q, r] = pk([[2, 2, -1], [1, 3, 2], [3, 2, 1], [0, 3, -2], [1, 2, -3]]), seq = [u0]; for (let i = 0; i < 6; i++) seq.push(q * seq[i] + r);
        const l = r / (1 - q), A = u0 - l; /* u_n = A q^n + l */ if (!Number.isInteger(l) || !Number.isInteger(A)) return null; const e = A + "*" + q + "^n" + (l >= 0 ? "+" : "") + l;
        return QX("Soit " + M("u_0 = " + u0) + " et " + M("u_{n+1} = " + q + "u_n" + sg(r)) + ". Calcule les premiers termes et conjecture " + M("u_n") + " sous la forme " + M("A" + X + q + "^n + B") + ".", e,
          M("u_1 = " + seq[1] + ", u_2 = " + seq[2] + ", u_3 = " + seq[3]) + ". La suite " + M("u_n" + sg(-l)) + " est géométrique de raison " + M(q) + " : " + M("u_n = " + A + X + q + "^n" + sg(l)) + " (à démontrer par récurrence).",
          { ctx: "conjecture-arithmetico", guide: [GR(M("u_3") + " ?", seq[3], M(seq[3]) + "."), GR(M("B") + " (le nombre fixe : " + M("B = " + q + "B" + sg(r)) + ") ?", l, M(l) + "."), GX(M("u_n") + " ?", e, M(A + X + q + "^n" + sg(l)) + ".")],
            traps: [TX(u0 + "*" + q + "^n", "Le terme " + r + " ajouté à chaque étape change la formule."), TX(u0 + "+" + r + "*n", "On multiplie par " + q + " à chaque étape : ce n'est pas arithmétique.")] }); },
    ],
    3: [
      () => { const [S, n0, nm] = pk([["2^n \\geqslant n^2", 4, "2n-n2"], ["2^n > n^3", 10, "2n-n3"], ["3^n > n^3", 4, "3n-n3"], ["2^n > 5n", 5, "2n-5n"], ["n! > 2^n", 4, "fact"]]);
        return QN("La propriété " + M("P(n) : " + S) + " est fausse pour certains petits entiers. À partir de quel entier " + M("n_0 \\geqslant 1") + " est-elle vraie pour tous les entiers " + M("n \\geqslant n_0") + " (initialisation en " + M("n_0") + ", puis hérédité) ?", n0,
          "On teste : " + M("P(" + (n0 - 1) + ")") + " est fausse et " + M("P(" + n0 + ")") + " est vraie ; l'hérédité se démontre pour " + M("n \\geqslant " + n0) + ". Donc " + M("n_0 = " + n0) + ".",
          { ctx: "rang-initial-" + nm, guide: [GR("Plus grand entier pour lequel " + M("P(n)") + " est fausse ?", n0 - 1, M(n0 - 1) + "."), GR(M("n_0") + " ?", n0, M(n0) + ".")],
            traps: [TR(n0 - 1, "P(" + (n0 - 1) + ") est encore fausse."), TR(1, "Vraie au rang 1 ne suffit pas : elle doit rester vraie ensuite.")] }); },
      () => { const [a, b, u0] = pk([[0.5, 4, 1], [0.5, 3, 10], [0.8, 2, 0], [0.25, 6, 2], [0.6, 4, 20]]), l = b / (1 - a), up = u0 < l;
        return QN("Soit " + M("u_0 = " + N(u0)) + " et " + M("u_{n+1} = " + N(a) + "u_n + " + b) + ". On montre par récurrence que la suite est " + (up ? "croissante et majorée" : "décroissante et minorée") + " par un nombre " + M("L") + " vérifiant " + M("L = " + N(a) + "L + " + b) + ". Que vaut " + M("L") + " ?", l,
          M("L = " + N(a) + "L + " + b + " \\iff " + N(rnd(1 - a)) + "L = " + b + " \\iff L = " + N(l)) + ". Hérédité : si " + (up ? M("u_n \\leqslant " + N(l)) + ", alors " + M("u_{n+1} \\leqslant " + N(a) + X + N(l) + " + " + b + " = " + N(l)) : M("u_n \\geqslant " + N(l)) + ", alors " + M("u_{n+1} \\geqslant " + N(l))) + ". La suite, monotone et bornée, converge vers " + M(N(l)) + ".",
          { ctx: "borne-" + (up ? "majorant" : "minorant"), guide: [GR(M("1 - " + N(a)) + " ?", rnd(1 - a), M(N(rnd(1 - a))) + "."), GR(M("L") + " ?", l, M(N(l)) + ".")],
            traps: [TR(rnd(b / (1 + a)), "L − " + N(a).replace("{,}", ",") + "L = (1 − " + N(a).replace("{,}", ",") + ")L."), TR(rnd(a * u0 + b), "C'est u₁.")] }); },
      () => { const [a, b, u0] = pk([[3, -4, 5], [2, 3, 1], [0.5, 2, 10], [4, -6, 3], [2, -5, 8]]), l = b / (1 - a), v0 = u0 - l; if (!Number.isInteger(l) || !v0) return null;
        return QN("Soit " + M("u_0 = " + N(u0)) + " et " + M("u_{n+1} = " + N(a) + "u_n" + sg(b)) + ". On pose " + M("v_n = u_n" + sg(-l)) + " : " + M("(v_n)") + " est géométrique de raison " + M(N(a)) + ". Que vaut " + M("v_{3}") + " ?", rnd(v0 * a ** 3),
          M("v_0 = u_0" + sg(-l) + " = " + N(v0)) + " et " + M("v_{n+1} = u_{n+1}" + sg(-l) + " = " + N(a) + "u_n" + sg(b - l) + " = " + N(a) + "v_n") + ". Donc " + M("v_3 = " + N(v0) + X + N(a) + "^3 = " + N(rnd(v0 * a ** 3))) + ".",
          { ctx: "suite-auxiliaire", guide: [GR(M("v_0") + " ?", v0, M(N(v0)) + "."), GR(M("v_3") + " ?", rnd(v0 * a ** 3), M(N(rnd(v0 * a ** 3))) + ".")],
            traps: [TR(rnd(u0 * a ** 3), "On part de v₀ = u₀ − " + l + ", pas de u₀."), TR(rnd(v0 * a ** 3 + l), "C'est u₃ ; on demande v₃.")] }); },
    ],
  };

  reg([
    { id: "lnfr", theme: "fa", label: "Logarithme népérien : propriétés, équations, seuils", ex: "\\ln(ab) = \\ln a + \\ln b", FR: [12, 3], g: LN,
      hint: "ln est la réciproque de exp : e^x = k ⇔ x = ln k (k > 0) ; ln x = a ⇔ x = e^a. ln(ab) = ln a + ln b, ln(a/b) = ln a − ln b, ln(aⁿ) = n ln a. Diviser par ln q < 0 (0 < q < 1) change le sens d'une inégalité.",
      comps: ["Propriétés algébriques, e^x = k, ln x = a", "ln(ax + b) = 0, seuils qⁿ ≥ k, ln(aⁿ)", "Changement de variable, domaine, seuil d'une suite décroissante"],
      lesson: ["Le logarithme népérien", "La fonction \\(\\ln\\) est la réciproque de \\(\\exp\\) : pour \\(x > 0\\), \\(y = \\ln x \\iff x = e^y\\).",
        "\\(\\ln 1 = 0\\), \\(\\ln e = 1\\). Pour \\(a, b > 0\\) : \\(\\ln(ab) = \\ln a + \\ln b\\), \\(\\ln\\frac{a}{b} = \\ln a - \\ln b\\), \\(\\ln(a^n) = n\\ln a\\). \\(\\ln\\) est strictement croissante sur \\(]0 \\,;\\, +\\infty[\\) : \\(\\ln a < \\ln b \\iff a < b\\). Seuil : \\(q^n \\geqslant k \\iff n\\ln q \\geqslant \\ln k\\) ; si \\(0 < q < 1\\), \\(\\ln q < 0\\) et le sens change en divisant.",
        ["\\(e^{2x} = 5 \\iff x = \\frac{\\ln 5}{2}\\).", "\\(1{,}05^n \\geqslant 2 \\iff n \\geqslant \\frac{\\ln 2}{\\ln 1{,}05} \\approx 14{,}2\\) : \\(n = 15\\)."],
        "\\(\\ln(a + b)\\) n'est pas \\(\\ln a + \\ln b\\) ; et on vérifie toujours le domaine (\\(\\ln\\) d'un nombre positif)."],
      probs: [() => P("Un capital de 2 000 € est placé à 4 % par an (intérêts composés).", [["a) Coefficient multiplicateur annuel", 1.04], ["b) n minimal pour que le capital dépasse 3 000 €", 11], ["c) n minimal pour qu'il double", 18]], ["2000 × 1,04ⁿ ≥ 3000 ⇔ n ≥ ln 1,5 / ln 1,04.", "ln 2 / ln 1,04 ≈ 17,7."], "a) " + M("1{,}04") + " ; b) " + M("\\frac{\\ln 1{,}5}{\\ln 1{,}04} \\approx 10{,}3") + ", donc " + M("n = 11") + " ; c) " + M("\\frac{\\ln 2}{\\ln 1{,}04} \\approx 17{,}7") + ", donc " + M("n = 18") + ".")] },
    { id: "trigfr", theme: "fa", label: "Fonctions sinus et cosinus", ex: "(\\sin x)' = \\cos x", FR: [12, 4], g: TF,
      hint: "x en radians. (sin x)' = cos x ; (cos x)' = −sin x ; (sin(ax + b))' = a cos(ax + b). sin et cos sont 2π-périodiques ; cos est paire, sin impaire. Sur ]−π ; π], cos x = a donne ± la même valeur ; sin x = a donne x et π − x.",
      comps: ["Dériver sin et cos, sin x = a, valeurs remarquables", "Composées sin(ax + b), période, inéquations sur le cercle", "Étude d'une fonction, nombre de solutions, limite de sin(kx)/x"],
      lesson: ["Fonctions sinus et cosinus", "Les fonctions \\(\\sin\\) et \\(\\cos\\) se lisent sur le cercle trigonométrique (\\(x\\) en radians).",
        "Elles sont définies et dérivables sur \\(\\mathbb{R}\\), \\(2\\pi\\)-périodiques ; \\(\\cos\\) est paire, \\(\\sin\\) impaire. \\((\\sin x)' = \\cos x\\), \\((\\cos x)' = -\\sin x\\), \\((\\sin(ax + b))' = a\\cos(ax + b)\\), \\((\\cos(ax + b))' = -a\\sin(ax + b)\\). \\(x \\mapsto \\sin(kx)\\) a pour période \\(\\frac{2\\pi}{k}\\). \\(\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1\\).",
        ["\\((3\\sin(2x))' = 6\\cos(2x)\\).", "\\(\\cos x \\geqslant \\frac{1}{2}\\) sur \\(]-\\pi \\,;\\, \\pi]\\) : \\(\\left[-\\frac{\\pi}{3} \\,;\\, \\frac{\\pi}{3}\\right]\\)."],
        "\\((\\cos x)' = -\\sin x\\) : le signe moins est souvent oublié."] },
    { id: "tvi", theme: "fa", label: "Continuité, théorème des valeurs intermédiaires", ex: "f(a) < k < f(b) \\Rightarrow \\exists c, \\ f(c) = k", FR: [12, 2], g: TVI,
      hint: "f continue sur [a ; b] : f prend toutes les valeurs entre f(a) et f(b). Si en plus f est strictement monotone, chaque valeur est prise une seule fois. Encadrer α : tabuler (balayage) ou couper l'intervalle en deux (dichotomie).",
      comps: ["Encadrement par des entiers, une solution unique, dichotomie", "Balayage au dixième, tableau avec limites", "Point fixe d'une suite, nombre de solutions, approximation à 0,01"],
      lesson: ["Théorème des valeurs intermédiaires", "Une fonction continue sur un intervalle ne « saute » pas : elle prend toutes les valeurs intermédiaires.",
        "Si \\(f\\) est continue sur \\([a \\,;\\, b]\\) et si \\(k\\) est compris entre \\(f(a)\\) et \\(f(b)\\), l'équation \\(f(x) = k\\) a au moins une solution dans \\([a \\,;\\, b]\\). Si de plus \\(f\\) est strictement monotone, la solution est unique. On l'encadre par balayage (valeurs de \\(f\\) avec un pas de 0,1, 0,01…) ou par dichotomie (on garde la moitié de l'intervalle où \\(f - k\\) change de signe). Si \\(u_{n+1} = f(u_n)\\) converge vers \\(\\ell\\) et \\(f\\) est continue, alors \\(f(\\ell) = \\ell\\).",
        ["\\(x^3 = 10\\) : \\(2^3 = 8 < 10 < 27 = 3^3\\), donc \\(2 < \\alpha < 3\\).", "\\(u_{n+1} = \\sqrt{u_n + 6}\\) : \\(\\ell = \\sqrt{\\ell + 6}\\) donne \\(\\ell = 3\\)."],
        "Sans la stricte monotonie, il peut y avoir plusieurs solutions ; sans la continuité, peut-être aucune."] },
    { id: "sommeva", theme: "no", label: "Sommes de variables aléatoires, concentration", ex: "V(X + Y) = V(X) + V(Y)", FR: [12, 7], g: SV,
      hint: "E(X + Y) = E(X) + E(Y) toujours ; V(X + Y) = V(X) + V(Y) si X et Y sont indépendantes ; V(aX) = a²V(X). Moyenne de n répétitions : E = μ, V = σ²/n. Bienaymé-Tchebychev : P(|X − μ| ≥ δ) ≤ V(X)/δ².",
      comps: ["Linéarité de l'espérance, variance d'une somme, moyenne d'un échantillon", "Somme de Bernoulli, Bienaymé-Tchebychev, somme de dés", "Taille d'échantillon, gain d'un jeu répété, minorer une probabilité"],
      lesson: ["Sommes de variables aléatoires", "On étudie une grandeur obtenue en ajoutant les résultats de plusieurs expériences.",
        "Linéarité : \\(E(aX + bY) = aE(X) + bE(Y)\\). Si \\(X\\) et \\(Y\\) sont indépendantes : \\(V(X + Y) = V(X) + V(Y)\\), et \\(V(aX) = a^2V(X)\\). Pour \\(n\\) répétitions indépendantes : \\(S_n = X_1 + \\dots + X_n\\) a \\(E(S_n) = n\\mu\\), \\(V(S_n) = n\\sigma^2\\) ; la moyenne \\(M_n = \\frac{S_n}{n}\\) a \\(E(M_n) = \\mu\\), \\(V(M_n) = \\frac{\\sigma^2}{n}\\). Bienaymé-Tchebychev : \\(P(|X - \\mu| \\geqslant \\delta) \\leqslant \\frac{V(X)}{\\delta^2}\\) ; inégalité de concentration : \\(P(|M_n - \\mu| \\geqslant \\delta) \\leqslant \\frac{\\sigma^2}{n\\delta^2}\\) (loi des grands nombres : \\(M_n\\) se concentre autour de \\(\\mu\\)).",
        ["Loi binomiale \\(\\mathcal{B}(n \\,;\\, p)\\) = somme de \\(n\\) Bernoulli : \\(E = np\\), \\(V = np(1 - p)\\).", "\\(V(X) = 4\\), \\(\\delta = 5\\) : \\(P(|X - \\mu| \\geqslant 5) \\leqslant 0{,}16\\)."],
        "Les variances s'ajoutent seulement pour des variables indépendantes ; et \\(V(2X) = 4V(X)\\), pas \\(2V(X)\\)."] },
    { id: "recurrence", theme: "fa", label: "Raisonnement par récurrence", ex: "P(0) \\text{ et } P(n) \\Rightarrow P(n + 1)", FR: [12, 0], g: RC,
      hint: "Initialisation : la propriété est vraie au premier rang. Hérédité : si elle est vraie au rang n, elle l'est au rang n + 1 (on utilise l'hypothèse). Conclusion : vraie pour tout n à partir du premier rang.",
      comps: ["Conjecturer une formule, calculer l'hérédité, terme ajouté", "Majorant, divisibilité, conjecture d'une suite arithmético-géométrique", "Rang initial, suite bornée, suite auxiliaire"],
      lesson: ["Raisonnement par récurrence", "Pour démontrer qu'une propriété \\(P(n)\\) est vraie pour tout entier \\(n \\geqslant n_0\\), on monte un escalier marche par marche.",
        "Initialisation : on vérifie \\(P(n_0)\\). Hérédité : on suppose \\(P(n)\\) vraie pour un entier \\(n \\geqslant n_0\\) (hypothèse de récurrence) et on démontre \\(P(n + 1)\\). Conclusion : \\(P(n)\\) est vraie pour tout \\(n \\geqslant n_0\\). On conjecture souvent la propriété en calculant les premiers termes.",
        ["\\(u_0 = 1\\), \\(u_{n+1} = u_n + 2n + 3\\) : \\(u_n = (n + 1)^2\\).", "\\(4^{n+1} - 1 = 4(4^n - 1) + 3\\) : divisible par 3 si \\(4^n - 1\\) l'est."],
        "L'hérédité seule ne suffit pas : sans initialisation, rien n'est démontré (\\(2^n > n^3\\) n'est vraie qu'à partir de 10)."] },
  ]);
})();
