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
// ===================== 28.11 : grands problèmes de 11e (problème de la semaine) =====================
// Décision de l'enseignant (28.11) : le problème de la semaine est tiré parmi les grands problèmes (au moins 4 parties, en
// situation, Engine.probKind). Inventaire du 28.11 (tools/archive/contenu_probleme_28-11.md) : la 11e (classe testeuse)
// n'en avait que sur 5 notions (thales, thalesrec, pythrec, idrem, sysprob). Ajouts sur 4 chapitres de l'année
// (volumes, masse volumique et débit, probabilités, formules), réservés à la 11e (co: [11]) ; indices marqués par partie
// (le coup de pouce des élèves faibles, Engine.weeklyAid, en est tiré).
(() => {
  if (typeof PROBX === "undefined") return;
  const ri = R.int, pk = R.pick, r6 = (v) => Math.round(v * 1e6) / 1e6;
  const N = (v) => { const s = String(r6(v)), neg = s[0] === "-", [i, f] = (neg ? s.slice(1) : s).split("."); return (neg ? "-" : "") + (+i >= 1000 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}") : i) + (f ? "{,}" + f : ""); };
  const T = (v) => { const s = String(r6(v)), [i, f] = s.split("."); return (Math.abs(+i) >= 1000 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, "'") : i) + (f ? "," + f : ""); };
  const CH = (v) => Number.isInteger(r6(v)) ? N(v) : N(Math.trunc(r6(v))) + "{,}" + Math.abs(r6(v)).toFixed(2).split(".")[1], CHT = (v) => CH(v).replace("{,}", ",").replace(/\\text\{'\}/g, "'");
  const X = (v) => M(N(v)), r1 = (v) => Math.round(+(v * 10).toPrecision(12)) / 10;
  const C11 = { co: [11] };
  const PX = (id, ctx, f) => { (PROBX[id] = PROBX[id] || []).push(() => Object.assign(f(), C11, { ctx })); };
  const PB = (q, parts, hints, sol) => ({ q, hints, sol, parts: parts.map(([label, v, rd]) => ({ label, spec: Object.assign({ kind: "value", value: Math.abs(v - r6(v)) < 1e-9 ? r6(v) : v /* fractions (proba) : valeur exacte */ }, rd ? { round: rd } : {}) })) });
  const gcd = (a, b) => (b ? gcd(b, a % b) : a), fr = (a, b) => { const g = gcd(a, b); return "\\frac{" + a / g + "}{" + b / g + "}"; };

  /* volcone : silo à grains (cylindre surmonté d'un cône), puis masse du grain (masse volumique) */
  PX("volcone", "silo", () => {
    const r = pk([2, 2.5, 3, 3.5]), H = pk([6, 7, 8, 10]), h = pk([1.5, 2, 2.5]), rho = pk([0.75, 0.8]), grain = rho === 0.75 ? "blé" : "maïs";
    const Vcy = Math.PI * r * r * H, Vco = (Math.PI * r * r * h) / 3, Vt = Vcy + Vco, m = rho * Vt;
    return PB("Un silo à grains est formé d'un cylindre de " + X(r) + " m de rayon et " + X(H) + " m de hauteur, surmonté d'un toit en forme de cône de même rayon et de " + X(h) + " m de hauteur. On le remplit entièrement de " + grain + " ; " + M("1 \\text{ m}^3") + " de " + grain + " pèse " + X(rho) + " tonne.",
      [["a) Volume de la partie cylindrique (m³, au dixième)", Vcy, 0.1], ["b) Volume du cône (m³, au dixième)", Vco, 0.1], ["c) Volume total du silo (m³, au dixième)", Vt, 0.1], ["d) Masse de " + grain + " stockée (t, au dixième)", m, 0.1]],
      ["a) Cylindre : aire du disque de base × hauteur, π · r² · H.", "b) Cône : le tiers du cylindre de même base et même hauteur, π · r² · h ÷ 3.", "c) Additionne les deux volumes non arrondis.", "d) Chaque m³ pèse " + T(rho) + " t : multiplie le volume total par " + T(rho) + "."],
      "a) " + M("\\pi \\cdot " + N(r) + "^2 \\cdot " + N(H) + " \\approx " + N(r1(Vcy))) + " m³. b) " + M("\\frac{\\pi \\cdot " + N(r) + "^2 \\cdot " + N(h) + "}{3} \\approx " + N(r1(Vco))) + " m³. c) " + M("V \\approx " + N(r1(Vt))) + " m³. d) " + M(N(rho) + " \\cdot " + N(r1(Vt)) + " \\approx " + N(r1(m))) + " t.");
  });

  /* gquot : remplir et filtrer une piscine (volume, débit, conversions) */
  PX("gquot", "piscine", () => {
    const L = pk([8, 10, 12]), l = pk([4, 5, 6]), p = pk([1.2, 1.5]), D = pk([40, 50, 60]), Th = pk([4, 5, 6]);
    const V = L * l * p, t = (V * 1000) / D / 60, Q = V / Th, Qm = (Q * 1000) / 60;
    return PB("Une piscine en forme de pavé mesure " + X(L) + " m de long, " + X(l) + " m de large et " + X(p) + " m de profondeur. On la remplit au robinet, qui débite " + X(D) + " litres par minute. Ensuite, la pompe de filtration doit faire passer toute l'eau de la piscine en " + Th + " heures.",
      [["a) Volume d'eau de la piscine pleine (m³)", V], ["b) Durée du remplissage (h, au dixième)", t, 0.1], ["c) Débit de la pompe de filtration (m³/h, au dixième)", Q, 0.1], ["d) Ce même débit en litres par minute (L/min, à l'unité)", Qm, 1]],
      ["a) Volume d'un pavé : longueur · largeur · profondeur.", "b) 1 m³ = 1'000 L : convertis, divise par le débit pour obtenir des minutes, puis passe en heures (÷ 60).", "c) Débit = volume ÷ durée.", "d) 1 m³ = 1'000 L et 1 h = 60 min : multiplie par 1'000, puis divise par 60."],
      "a) " + M(N(L) + " \\cdot " + N(l) + " \\cdot " + N(p) + " = " + N(V)) + " m³. b) " + M(N(V * 1000) + " \\text{ L} \\div " + D + " = " + N(r6(V * 1000 / D)) + " \\text{ min}" + (r6(t) === r1(t) ? " = " : " \\approx ") + N(r1(t)) + " \\text{ h}") + ". c) " + M(N(V) + " \\div " + Th + " = " + N(r6(Q)) + (r6(Q) === r1(Q) ? "" : " \\approx " + N(r1(Q)))) + " m³/h. d) " + M(N(r6(Q)) + " \\cdot 1\\text{'}000 \\div 60" + (r6(Qm) === Math.round(Qm) ? " = " : " \\approx ") + Math.round(Qm)) + " L/min.");
  });

  /* proba : bonbons tirés sans remise, trois parfums */
  PX("proba", "bonbons", () => {
    let f, c, m; do { f = ri(3, 7); c = ri(2, 6); m = ri(2, 5); } while (f === c || c === m || f === m);
    const n = f + c + m, d = n * (n - 1), pff = (f * (f - 1)) / d, same = (f * (f - 1) + c * (c - 1) + m * (m - 1)) / d, noM = ((n - m) * (n - m - 1)) / d;
    const who = pk(["Léa", "Noé", "Inès", "Yanis"]);
    return PB("Une boîte contient " + M(f) + " bonbons à la fraise, " + M(c) + " au citron et " + M(m) + " à la menthe, tous emballés de la même façon. " + who + " en prend un au hasard, le mange, puis en prend un deuxième au hasard. (fractions acceptées)",
      [["a) Probabilité que le premier bonbon soit à la fraise", f / n], ["b) Probabilité que les deux bonbons soient à la fraise", pff], ["c) Probabilité que les deux bonbons aient le même parfum", same], ["d) Probabilité d'avoir au moins un bonbon à la menthe", 1 - noM]],
      ["a) Cas favorables sur cas possibles : il y a " + n + " bonbons en tout.", "b) Arbre à deux étages : après le premier bonbon, il en reste " + (n - 1) + ", et un de moins du parfum mangé ; multiplie les probabilités le long d'une branche.", "c) Même parfum : deux fraises OU deux citrons OU deux menthes, additionne les trois branches.", "d) Le contraire de « au moins une menthe » est « aucune menthe » : calcule-le, puis fais 1 moins ce résultat."],
      "a) " + M("\\frac{" + f + "}{" + n + "}" + (gcd(f, n) > 1 ? " = " + fr(f, n) : "")) + ". b) " + M("\\frac{" + f + "}{" + n + "} \\cdot \\frac{" + (f - 1) + "}{" + (n - 1) + "} = " + fr(f * (f - 1), d)) + ". c) " + M("\\frac{" + f * (f - 1) + " + " + c * (c - 1) + " + " + m * (m - 1) + "}{" + d + "} = " + fr(f * (f - 1) + c * (c - 1) + m * (m - 1), d)) + ". d) Aucune menthe : " + M("\\frac{" + (n - m) + "}{" + n + "} \\cdot \\frac{" + (n - m - 1) + "}{" + (n - 1) + "} = " + fr((n - m) * (n - m - 1), d)) + ", donc " + M("1 - " + fr((n - m) * (n - m - 1), d) + " = " + fr(d - (n - m) * (n - m - 1), d)) + ".");
  });

  /* formule : deux tarifs de taxi (utiliser, transformer une formule, comparer) */
  PX("formule", "taxi", () => {
    let a, b, a2, b2, d1, P2, de; do { a = pk([5, 6, 6.5, 7]); b = pk([2.5, 3, 3.2, 3.5]); a2 = a + pk([4, 5, 6, 8]); b2 = b - pk([0.5, 0.8, 1]); d1 = ri(6, 15); de = (a2 - a) / (b - b2); P2 = a + b * ri(9, 25); }
      while (!Number.isInteger(de * 2) || de < 3 || de > 30 || r6(b2) <= 0);
    const dP = (P2 - a) / b;
    return PB("Le taxi A calcule son prix avec la formule " + M("P = " + N(a) + " + " + N(b) + "d") + " (" + M("P") + " en CHF, " + M("d") + " en km). Le taxi B, plus cher au départ, applique " + M("P = " + N(a2) + " + " + N(r6(b2)) + "d") + ". Maëlle doit choisir son taxi pour rentrer chez elle.",
      [["a) Prix d'une course de " + d1 + " km avec le taxi A (CHF)", a + b * d1, 0.01], ["b) Distance parcourue avec le taxi A pour " + CHT(P2) + " CHF (km)", dP, 0.01], ["c) Distance pour laquelle les deux taxis coûtent le même prix (km)", de, 0.01], ["d) Prix de cette course, le même avec les deux taxis (CHF)", a + b * de, 0.01]],
      ["a) Remplace d par " + d1 + " dans la formule du taxi A.", "b) Transforme la formule pour isoler d : d = (P − " + T(a) + ") ÷ " + T(b) + ".", "c) Écris que les deux prix sont égaux : " + T(a) + " + " + T(b) + "d = " + T(a2) + " + " + T(r6(b2)) + "d, puis résous en d.", "d) Remplace d par la distance trouvée juste avant, dans l'une des deux formules."],
      "a) " + M("P = " + N(a) + " + " + N(b) + " \\cdot " + d1 + " = " + CH(a + b * d1)) + " CHF. b) " + M("d = \\frac{P - " + N(a) + "}{" + N(b) + "} = \\frac{" + CH(P2) + " - " + N(a) + "}{" + N(b) + "} = " + N(r6(dP))) + " km. c) " + M(N(a) + " + " + N(b) + "d = " + N(a2) + " + " + N(r6(b2)) + "d" + (r6(b - b2) === 1 ? "" : " \\iff " + N(r6(b - b2)) + "d = " + N(r6(a2 - a))) + " \\iff d = " + N(de)) + " km. d) " + M("P = " + N(a) + " + " + N(b) + " \\cdot " + N(de) + " = " + CH(a + b * de)) + " CHF.");
  });
})();
