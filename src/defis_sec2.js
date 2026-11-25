// ===================== 25.11 : défis (niveau 4) du secondaire II encore manquants =====================
// Sonde de couverture du 25.11 : optim (1re Collège, MP 2e) n'avait aucun défi ; arith, fracper (1re Collège), arith,
// premiers, rac (MP 1re) n'avaient que les défis du Cycle, écartés au secondaire II. Classes : co (Collège, grade),
// mp (MP, grade), lus par horsCO (engine.js). Chargé après variantes.js (PROBX).
(() => {
  if (typeof PROBX === "undefined") return;
  const ri = R.int, pk = R.pick;
  const r6 = (v) => Math.round(v * 1e6) / 1e6;
  const N = (v) => { const s = String(r6(v)), neg = s[0] === "-", [i, f] = (neg ? s.slice(1) : s).split("."); return (neg ? "-" : "") + (+i >= 1000 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}") : i) + (f ? "{,}" + f : ""); };
  const X = (v) => M(N(v));
  const PX = (id, cl, f) => { (PROBX[id] = PROBX[id] || []).push(() => Object.assign(f(), cl)); };
  const PB = (q, parts, hints, sol) => ({ q, hints, sol, parts: parts.map(([label, v, rd]) => ({ label, spec: Object.assign({ kind: "value", value: r6(v) }, rd ? { round: rd } : {}) })) });
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);

  // ---------- optim : 1re–2e Collège, MP 2e–3e ----------
  const OPT = { co: [12, 13], mp: [13, 14] };
  PX("optim", OPT, () => { /* recette d'un spectacle : prix et fréquentation */
    let p0, n0, k, x; do { p0 = pk([20, 24, 30]); n0 = pk([300, 360, 420, 480, 540]); k = pk([5, 6, 8, 10, 12]); x = (n0 - k * p0) / (2 * k); } while (!(x >= 2 && Number.isInteger(x * 2)));
    const P = p0 + x, n = n0 - k * x, Rm = r6(P * n);
    return PB("Un théâtre vend " + X(n0) + " billets par soir au prix de " + p0 + " CHF. Une étude montre que chaque franc d'augmentation du prix fait perdre " + k + " spectateurs (et chaque franc de baisse en fait gagner autant). On note " + M("x") + " l'augmentation du prix en CHF.",
      [["a) Augmentation " + M("x") + " qui rend la recette maximale, en CHF", x], ["b) Prix du billet correspondant, en CHF", P], ["c) Recette maximale, en CHF", Rm]],
      ["Recette : " + M("R(x) = (" + p0 + " + x)(" + n0 + " - " + k + "x)") + ", une fonction du 2e degré.", "Le maximum est au sommet de la parabole, au milieu de ses deux zéros."],
      M("R(x) = (" + p0 + " + x)(" + n0 + " - " + k + "x)") + " s'annule en " + M("x = -" + p0) + " et " + M("x = " + N(n0 / k)) + ". Sommet au milieu : " + M("x = \\frac{-" + p0 + " + " + N(n0 / k) + "}{2} = " + N(x)) + ". b) " + M(p0 + " + " + N(x) + " = " + N(P)) + " CHF. c) " + M(N(P) + " \\cdot " + N(n) + " = " + N(Rm)) + " CHF (" + N(n) + " spectateurs).");
  });
  PX("optim", OPT, () => { /* ballon : hauteur h(t) = −5t² + vt + h0 */
    const v = pk([12, 14, 16, 18, 22, 24]), h0 = pk([2, 3, 5]), tm = v / 10, hm = r6(h0 + (v * v) / 20), tg = (v + Math.sqrt(v * v + 20 * h0)) / 10;
    return PB("Un ballon est lancé vers le haut. Sa hauteur (en m) après " + M("t") + " secondes est " + M("h(t) = -5t^2 + " + v + "t + " + h0) + ".",
      [["a) Après combien de secondes atteint-il sa hauteur maximale ?", tm], ["b) Hauteur maximale, en m", hm], ["c) Après combien de secondes touche-t-il le sol ? (au centième)", tg, 0.01]],
      ["Sommet d'une parabole " + M("at^2 + bt + c") + " : " + M("t = -\\frac{b}{2a}") + ".", "c) Résous " + M("h(t) = 0") + " et garde la solution positive."],
      "a) " + M("t = -\\frac{" + v + "}{2 \\cdot (-5)} = " + N(tm)) + " s. b) " + M("h(" + N(tm) + ") = " + N(hm)) + " m. c) " + M("\\Delta = " + v * v + " + 20 \\cdot " + h0 + " = " + (v * v + 20 * h0)) + " ; " + M("t = \\frac{" + v + " + \\sqrt{" + (v * v + 20 * h0) + "}}{10} \\approx " + N(Math.round(tg * 100) / 100)) + " s.");
  });
  PX("optim", OPT, () => { /* rectangle sous une droite */
    const a = pk([8, 10, 12, 14]), b = pk([6, 9, 12, 15]);
    return PB("Un rectangle a un sommet en " + M("O(0\\,;\\,0)") + ", deux côtés sur les axes, et le sommet opposé " + M("P(x\\,;\\,y)") + " sur la droite qui passe par " + M("(" + a + "\\,;\\,0)") + " et " + M("(0\\,;\\," + b + ")") + ".",
      [["a) Abscisse de " + M("P") + " pour que l'aire du rectangle soit maximale", a / 2], ["b) Ordonnée de " + M("P") + " correspondante", b / 2], ["c) Aire maximale", (a * b) / 4]],
      ["Équation de la droite : " + M("y = " + b + " - \\frac{" + b + "}{" + a + "}x") + ". L'aire vaut " + M("A(x) = x \\cdot y") + ".", "A(x) est une fonction du 2e degré : son maximum est au sommet, au milieu de ses zéros."],
      M("A(x) = x\\left(" + b + " - \\frac{" + b + "}{" + a + "}x\\right)") + " s'annule en 0 et en " + a + " : sommet en " + M("x = " + N(a / 2)) + ". b) " + M("y = " + b + " - \\frac{" + b + "}{" + a + "} \\cdot " + N(a / 2) + " = " + N(b / 2)) + ". c) " + M(N(a / 2) + " \\cdot " + N(b / 2) + " = " + N((a * b) / 4)) + " (le quart du triangle formé avec les axes, doublé).");
  });

  // ---------- arith : 1re Collège, MP 1re ----------
  PX("arith", { co: [12], mp: [12] }, () => {
    let g, m, n; do { g = ri(12, 48); m = ri(5, 17); n = ri(5, 17); } while (gcd(m, n) !== 1 || m === n);
    const a = g * Math.max(m, n), b = g * Math.min(m, n), L = (a * b) / g;
    /* 26.11 (vraisemblance, décision de l'enseignant) : un seul contexte (le carrelage) ; les boîtes empilées sont retirées. */
    return PB("On veut carreler sans découpe une salle rectangulaire de " + X(a) + " cm sur " + X(b) + " cm avec des carreaux carrés identiques, les plus grands possible. Les carreaux sont vendus par boîtes de 10.",
      [["a) Côté des carreaux, en cm (algorithme d'Euclide conseillé)", g], ["b) Nombre de carreaux", m * n], ["c) Nombre de boîtes à acheter, au minimum", Math.ceil((m * n) / 10)]],
      ["Euclide : PGDC(a ; b) = PGDC(b ; reste de a ÷ b), jusqu'au reste nul.", "c) Il faut au moins le nombre de carreaux : on arrondit à la boîte supérieure."],
      "a) PGDC(" + a + " ; " + b + ") = " + g + " cm. b) " + M((a / g) + " \\cdot " + (b / g) + " = " + m * n) + " carreaux. c) " + M(m * n + " \\div 10") + " arrondi à l'unité supérieure : " + Math.ceil((m * n) / 10) + " boîtes.");
  });
  // ---------- fracper : 1re Collège ----------
  PX("fracper", { co: [12] }, () => {
    let a, per; do { a = ri(1, 9); per = ri(101, 998); } while (per % 111 === 0);
    const num0 = a * 999 + per, den0 = 9990, g = gcd(num0, den0), P = String(per).padStart(3, "0");
    return PB("On considère " + M("x = 0{,}" + a + "\\overline{" + P + "}") + " (le groupe " + P + " se répète indéfiniment).",
      [["a) Que vaut " + M("10\\,000x - 10x") + " ?", num0], ["b) Numérateur de " + M("x") + " sous forme irréductible", num0 / g], ["c) Dénominateur", den0 / g]],
      ["Multiplie par 10 pour placer la période juste après la virgule, puis par 10'000 pour la décaler d'une période entière.", "Simplifie par le PGDC du numérateur et de 9'990."],
      M("10\\,000x = " + a + P + "{,}\\overline{" + P + "}") + ", " + M("10x = " + a + "{,}\\overline{" + P + "}") + " ; " + M("9\\,990x = " + N(num0)) + " ; " + M("x = \\frac{" + N(num0) + "}{9\\,990} = \\frac{" + N(num0 / g) + "}{" + N(den0 / g) + "}") + " (PGDC " + g + ").");
  });
  // ---------- premiers : MP 1re ----------
  PX("premiers", { mp: [12] }, () => {
    const a = ri(2, 5), b = ri(1, 4), c = ri(1, 2), n = 2 ** a * 3 ** b * 5 ** c, cube = 2 ** ((3 - (a % 3)) % 3) * 3 ** ((3 - (b % 3)) % 3) * 5 ** ((3 - (c % 3)) % 3);
    const m = 2 ** pk([1, 2]) * 3 ** pk([2, 3]) * 7, g = gcd(n, m);
    return PB("On considère " + M("n = " + N(n)) + " et " + M("m = " + N(m)) + ".",
      [["a) Nombre de diviseurs de " + M("n"), (a + 1) * (b + 1) * (c + 1)], ["b) Plus petit entier " + M("k") + " tel que " + M("n \\cdot k") + " soit un cube parfait", cube], ["c) PGDC(" + M("n") + " ; " + M("m") + ")", g]],
      ["Décompose n en facteurs premiers. Un diviseur choisit un exposant pour chaque facteur premier, de 0 au maximum.", "Un cube : chaque exposant est un multiple de 3. PGDC : facteurs communs, avec le plus petit exposant."],
      M("n = 2^{" + a + "} \\cdot 3^{" + b + "} \\cdot 5^{" + c + "}") + ". a) " + M("(" + (a + 1) + ")(" + (b + 1) + ")(" + (c + 1) + ") = " + (a + 1) * (b + 1) * (c + 1)) + ". b) Exposants à compléter jusqu'au multiple de 3 suivant : " + M("k = " + N(cube)) + ". c) " + M("m = " + m.toString()) + " ; PGDC " + M("= " + g) + ".");
  });
  // ---------- rac : MP 1re ----------
  PX("rac", { mp: [12] }, () => {
    let p, m, q, nn; do { p = pk([2, 3, 4, 5, 6]); m = pk([2, 3, 5, 6, 7]); q = pk([3, 5, 7, 11]); nn = pk([2, 3, 5]); } while (q === m || nn === m || q * q === m);
    const A = p * p * m, prod = 4 * m - nn, bb = pk([[7, 5], [11, 7], [13, 11], [10, 6], [8, 6]]);
    return PB("Calcul avec des racines carrées (sans calculatrice).",
      [["a) " + M("\\sqrt{" + A + "}") + " s'écrit " + M("a\\sqrt{" + m + "}") + " : que vaut " + M("a") + " ?", p], ["b) " + M("(2\\sqrt{" + m + "} + \\sqrt{" + nn + "})(2\\sqrt{" + m + "} - \\sqrt{" + nn + "})") + " = ?", prod], ["c) " + M("\\frac{1}{\\sqrt{" + bb[0] + "} - \\sqrt{" + bb[1] + "}} = \\frac{\\sqrt{" + bb[0] + "} + \\sqrt{" + bb[1] + "}}{d}") + " : que vaut " + M("d") + " ?", bb[0] - bb[1]]],
      ["a) Cherche le plus grand carré qui divise " + A + ".", "b) Identité (u + v)(u − v) = u² − v². c) Multiplie haut et bas par la quantité conjuguée."],
      "a) " + M("\\sqrt{" + A + "} = \\sqrt{" + p * p + " \\cdot " + m + "} = " + p + "\\sqrt{" + m + "}") + ". b) " + M("(2\\sqrt{" + m + "})^2 - (\\sqrt{" + nn + "})^2 = " + 4 * m + " - " + nn + " = " + prod) + ". c) " + M("(\\sqrt{" + bb[0] + "} - \\sqrt{" + bb[1] + "})(\\sqrt{" + bb[0] + "} + \\sqrt{" + bb[1] + "}) = " + bb[0] + " - " + bb[1] + " = " + (bb[0] - bb[1])) + ".");
  });
})();
