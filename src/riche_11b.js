// Chantier 11e · 1. Nombres et opérations, 2. Pythagore, 3. 3D (17.11) : exercices riches et raisonnements du test de
// préparation, au niveau d'un vrai test de 11e (contexte, plusieurs étapes, interprétation), pas du drill.
// Même format que riche.js (RICH.<chapitre> = { ids, label, ex, raison, minutes }). Chargé après riche.js.
(function () {
  const r6 = (v) => Math.round(v * 1e6) / 1e6;
  const N = (v) => { let [i, f] = String(r6(v)).split("."); if (i.replace("-", "").length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}"); return i + (f ? "{,}" + f : ""); };
  const T = (v) => M(N(v));
  const A = (v, k) => N(+(+v).toFixed(k));
  const u = (s) => ("\\ \\text{" + s.replace(/\^([23])/, "}^$1\\text{") + "}").replace(/\\text\{\}$/, "");
  const Q = (v, s) => M(N(v) + u(s));
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const g2 = (a, b) => (b ? g2(b, a % b) : Math.abs(a));
  const F = (n, d) => { const g = g2(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n) : (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
  const pd = (t) => colonBreak(String(t).split(/(\\\(.*?\\\))/).map((seg, i) => (i % 2 ? seg : seg.replace(/\{,\}/g, ",").replace(/\\text\{'\}/g, "'"))).join(""));
  const X = (o) => Object.assign({ pts: Math.max(1, o.parts.reduce((s, p) => s + p.pts, 0)) }, o, { q: pd(o.q), sol: pd(o.sol), parts: o.parts.map((p) => ({ label: pd(p.label), pts: p.pts })) });
  const ul = (rows) => "<ol type=\"a\" class=\"mock-parts\">" + rows.map((r) => "<li>" + r + "</li>").join("") + "</ol>";
  const who = () => pk(["Lina", "Noé", "Inès", "Yanis", "Mia", "Sam"]);

  // ===================== 11e · 1. Nombres et opérations =====================
  const EXN = [
    // Le budget de la course d'école (fractions)
    () => { const [a, b, c, e] = pk([[2, 5, 1, 4], [1, 3, 1, 4], [3, 8, 1, 6], [2, 5, 1, 3]]), tot = pk([2400, 3600, 4800]), used = a / b + c / e, rn = (1 - used);
      const L = (b * e) / g2(b, e), num = L - (a * L) / b - (c * L) / e;
      return X({ id: "fracadd", lv: 1, titre: "Le budget de la course d'école",
        q: "Pour la course d'école, la classe dispose de " + Q(tot, "CHF") + ". Le transport coûte les " + M(F(a, b)) + " du budget, l'hébergement les " + M(F(c, e)) + ", et le reste sert aux activités.",
        parts: [{ label: "Quelle fraction du budget reste-t-il pour les activités ? (fraction irréductible)", pts: 2 }, { label: "Combien de francs cela représente-t-il ?", pts: 1 }, { label: "Une activité coûte " + Q(Math.round(tot * rn * 0.6), "CHF") + ". Quelle fraction du budget total est-ce ? Le reste suffit-il ?", pts: 1 }],
        sol: ul([M("1 - \\frac{" + a + "}{" + b + "} - \\frac{" + c + "}{" + e + "} = \\frac{" + num + "}{" + L + "}" + (g2(num, L) > 1 ? " = " + F(num, L) : "")) + ".", M(F(num, L) + " \\cdot " + N(tot) + " = " + N(tot * rn)) + " CHF.", M(F(Math.round(tot * rn * 0.6), tot)) + " du budget ; oui, c'est moins que les " + M(N(tot * rn)) + " CHF disponibles."]) }); },
    // La recette (multiplier des fractions)
    () => { const [n0, n1] = pk([[4, 6], [6, 9], [4, 10], [6, 8]]), [lait, beurre] = pk([[[3, 4], [1, 5]], [[2, 3], [1, 4]], [[1, 2], [3, 10]]]);
      const kL = [lait[0] * n1, lait[1] * n0], kB = [beurre[0] * n1, beurre[1] * n0];
      return X({ id: "fracmul", lv: 1, titre: "La recette de crêpes",
        q: "Une recette pour " + n0 + " personnes demande " + M(F(...lait)) + " L de lait et " + M(F(...beurre)) + " kg de beurre. " + who() + " cuisine pour " + n1 + " personnes.",
        parts: [{ label: "Par quelle fraction faut-il multiplier les quantités ?", pts: 1 }, { label: "Quelle quantité de lait faut-il (fraction irréductible, en L) ?", pts: 1 }, { label: "Il reste les " + M(F(2, 3)) + " d'une plaquette de beurre de " + M(F(1, 4)) + " kg. Cela suffit-il ?", pts: 2 }],
        sol: ul([M(F(n1, n0)) + ".", M(F(...lait) + " \\cdot " + F(n1, n0) + " = " + F(...kL)) + " L.", "Il reste " + M(F(2, 3) + " \\cdot " + F(1, 4) + " = " + F(1, 6)) + " kg ; il faut " + M(F(...kB)) + " kg : " + (kB[0] / kB[1] <= 1 / 6 ? "oui, cela suffit." : "non, cela ne suffit pas (" + M(F(...kB) + " > " + F(1, 6)) + ").")]) }); },
    // Soldes successifs (pourcentages)
    () => { const P = pk([80, 120, 150, 200]), p1 = pk([20, 30, 25]), p2 = pk([10, 15, 20]), f = (1 - p1 / 100) * (1 - p2 / 100), fin = P * f;
      return X({ id: "fracconv", lv: 2, titre: "Soldes successifs",
        q: "Un manteau coûte " + Q(P, "CHF") + ". En janvier, son prix baisse de " + p1 + " %. En février, le nouveau prix baisse encore de " + p2 + " %. Une affiche annonce : « −" + (p1 + p2) + " % au total ! »",
        parts: [{ label: "Calcule le prix en janvier, puis en février.", pts: 2 }, { label: "De quel pourcentage le prix a-t-il baissé en tout ?", pts: 1 }, { label: "L'affiche a-t-elle raison ? Explique.", pts: 1 }],
        sol: ul([M(N(P) + " \\cdot " + N(1 - p1 / 100) + " = " + N(P * (1 - p1 / 100))) + " CHF, puis " + M(N(P * (1 - p1 / 100)) + " \\cdot " + N(1 - p2 / 100) + " = " + N(fin)) + " CHF.", M("1 - " + N(r6(f)) + " = " + N(r6(1 - f))) + ", soit " + M(N(r6(100 * (1 - f))) + "\\,\\%") + ".", "Non : la deuxième baisse porte sur le prix déjà baissé, elle « rapporte » moins. La baisse totale (" + N(r6(100 * (1 - f))).replace("{,}", ",") + " %) est plus petite que " + (p1 + p2) + " %."]) }); },
    // Nombres périodiques
    () => { const a = pk([4, 5, 7, 2]), bc = pk([36, 18, 27, 45]);
      return X({ id: "fracconv", lv: 2, titre: "Nombres périodiques",
        q: "On note " + M("x = 0{,}\\overline{" + a + "}") + " (soit " + M("0{,}" + String(a).repeat(4) + "\\ldots") + ") et " + M("y = 0{,}\\overline{" + bc + "}") + ".",
        parts: [{ label: "Calcule " + M("10x - x") + " et déduis-en " + M("x") + " sous forme de fraction.", pts: 2 }, { label: "Même méthode pour " + M("y") + " (choisis bien la puissance de 10).", pts: 2 }, { label: "Calcule " + M("x + y") + " en fraction irréductible.", pts: 1 }],
        sol: ul([M("10x - x = " + a) + ", donc " + M("9x = " + a) + " et " + M("x = " + F(a, 9)) + ".", "Période de 2 chiffres : " + M("100y - y = " + bc) + ", " + M("y = \\frac{" + bc + "}{99} = " + F(bc, 99)) + ".", M(F(a, 9) + " + " + F(bc, 99) + " = \\frac{" + (11 * a + bc) + "}{99}" + (g2(11 * a + bc, 99) > 1 ? " = " + F(11 * a + bc, 99) : "")) + "."]) }); },
    // Les bactéries (puissances de 2)
    () => { const t = pk([30, 60]), n0 = pk([4, 8]);
      return X({ id: "puiss", lv: 1, titre: "Les bactéries",
        q: "Une population de bactéries double toutes les " + t + " minutes. Au départ, il y a " + n0 + " bactérie" + (n0 > 1 ? "s" : "") + ".",
        parts: [{ label: "Combien y en a-t-il après 4 doublements ? Écris-le avec une puissance de 2.", pts: 1 }, { label: "Combien y en a-t-il après " + (10 * t) / 60 + " h ?", pts: 1 }, { label: "Après combien de doublements dépasse-t-on un million ?", pts: 2 }, { label: "Que représente " + M(n0 + " \\cdot 2^{-1}") + " dans cette situation ?", pts: 1 }],
        sol: ul([M(n0 + " \\cdot 2^4 = " + n0 * 16) + ".", (10 * t) / 60 + " h = 10 doublements : " + M(n0 + " \\cdot 2^{10} = " + N(n0 * 1024)) + ".", M(n0 + " \\cdot 2^{" + Math.ceil(Math.log2(1e6 / n0)) + "} = " + N(n0 * 2 ** Math.ceil(Math.log2(1e6 / n0)))) + " : " + Math.ceil(Math.log2(1e6 / n0)) + " doublements (" + M(n0 + " \\cdot 2^{" + (Math.ceil(Math.log2(1e6 / n0)) - 1) + "}") + " est encore trop petit).", "Le nombre de bactéries " + t + " minutes <b>avant</b> le départ : " + M(N(n0 / 2)) + "."]) }); },
    // Distances dans l'Univers (notation scientifique)
    () => { const [star, al] = pk([["Proxima du Centaure", 4.2], ["Sirius", 8.6], ["Véga", 25]]);
      return X({ id: "scicalc", lv: 2, titre: "Distances dans l'Univers",
        q: "La lumière parcourt " + M("3 \\cdot 10^5") + " km par seconde. Une année compte environ " + M("3{,}15 \\cdot 10^7") + " s. L'étoile " + star + " est à " + T(al) + " années-lumière.",
        parts: [{ label: "Calcule la distance parcourue par la lumière en un an (une année-lumière), en km, en notation scientifique.", pts: 2 }, { label: "Calcule la distance de " + star + " en km.", pts: 1 }, { label: "Une sonde voyage à " + M("6 \\cdot 10^4") + " km/h. Combien d'années lui faudrait-il ? (ordre de grandeur)", pts: 2 }],
        sol: ul([M("3 \\cdot 10^5 \\cdot 3{,}15 \\cdot 10^7 = 9{,}45 \\cdot 10^{12}") + " km.", M(N(al) + " \\cdot 9{,}45 \\cdot 10^{12} \\approx " + A((al * 9.45) / (al * 9.45 >= 10 ? 10 : 1), 2) + " \\cdot 10^{" + (al * 9.45 >= 10 ? 13 : 12) + "}") + " km.", "Durée : " + M(A(al * 9.45, 2) + " \\cdot 10^{12} : (6 \\cdot 10^4) \\approx " + A((al * 9.45) / 6, 2) + " \\cdot 10^8") + " h, soit environ " + M(N(Math.round((al * 9.45e12) / 6e4 / 24 / 365 / 1000) * 1000)) + " ans."]) }); },
    // Fourmis et humains (notation scientifique)
    () => X({ id: "scicalc", lv: 2, titre: "Fourmis contre humains",
        q: "On estime qu'il y a environ " + M("2 \\cdot 10^{16}") + " fourmis sur Terre, d'une masse moyenne de " + M("3 \\cdot 10^{-6}") + " kg. Il y a environ " + M("8 \\cdot 10^9") + " humains, d'une masse moyenne de " + M("60") + " kg.",
        parts: [{ label: "Calcule la masse totale des fourmis (en kg, notation scientifique).", pts: 1 }, { label: "Calcule la masse totale des humains.", pts: 1 }, { label: "Qui pèse le plus en tout, et combien de fois plus ? (au dixième)", pts: 2 }],
        sol: ul([M("2 \\cdot 10^{16} \\cdot 3 \\cdot 10^{-6} = 6 \\cdot 10^{10}") + " kg.", M("8 \\cdot 10^9 \\cdot 60 = 480 \\cdot 10^9 = 4{,}8 \\cdot 10^{11}") + " kg.", "Les humains : " + M("4{,}8 \\cdot 10^{11} : (6 \\cdot 10^{10}) = 8") + " fois plus."]) }),
    // Calcul en chaîne (priorités, fractions, puissances)
    () => { const k = pk([2, 3]);
      return X({ id: "prio", lv: 3, titre: "Calculs en chaîne",
        q: "Calcule sans calculatrice, en détaillant chaque étape.",
        parts: [{ label: M("A = 5 - 2 \\cdot (3 - " + (k + 4) + ")^2"), pts: 1 }, { label: M("B = \\frac{2}{3} + \\frac{1}{4} \\cdot \\frac{8}{9}"), pts: 1 }, { label: M("C = \\frac{(-2)^3 + 4^2}{10^{-1} \\cdot 20}"), pts: 2 }, { label: "Place des parenthèses dans " + M("2 + 3 \\cdot 4 - 1") + " pour obtenir 15.", pts: 1 }],
        sol: ul([M("5 - 2 \\cdot (-" + (k + 1) + ")^2 = 5 - 2 \\cdot " + (k + 1) ** 2 + " = " + (5 - 2 * (k + 1) ** 2)) + ".", M("\\frac{2}{3} + \\frac{2}{9} = \\frac{6}{9} + \\frac{2}{9} = \\frac{8}{9}") + " (la multiplication d'abord).", M("\\frac{-8 + 16}{0{,}1 \\cdot 20} = \\frac{8}{2} = 4") + ".", M("(2 + 3) \\cdot (4 - 1) = 15") + "."]) }); },
    // Calcul astucieux (puissances)
    () => X({ id: "puiss", lv: 3, titre: "Calcul astucieux",
        q: "Calcule astucieusement, sans calculatrice, en utilisant les propriétés des puissances.",
        parts: [{ label: M("2^{10} \\cdot 5^{8}"), pts: 1 }, { label: M("\\frac{6^5}{2^4 \\cdot 3^3}"), pts: 1 }, { label: M("0{,}25^{5} \\cdot 4^{6}"), pts: 1 }, { label: "Range dans l'ordre croissant : " + M("2^{30}") + ", " + M("3^{20}") + ", " + M("10^{9}") + " (indice : " + M("2^{10} \\approx 10^3") + ").", pts: 2 }],
        sol: ul([M("2^2 \\cdot (2 \\cdot 5)^8 = 4 \\cdot 10^8") + ".", M("2^{5-4} \\cdot 3^{5-3} = 2 \\cdot 9 = 18") + ".", M("(0{,}25 \\cdot 4)^5 \\cdot 4 = 1 \\cdot 4 = 4") + ".", M("2^{30} = (2^{10})^3 \\approx 1{,}07 \\cdot 10^9") + ", " + M("3^{20} = (3^{10})^2 \\approx 3{,}5 \\cdot 10^9") + " : " + M("10^9 < 2^{30} < 3^{20}") + "."]) }),
  ];
  const RAISONN = [
    () => { const [a, b, c, d] = pk([[2, 3, 1, 4], [1, 2, 1, 3], [3, 5, 1, 2]]), w = who();
      return X({ id: "fracadd", lv: 1, titre: "Trouve l'erreur",
        q: w + " écrit : " + M("\\frac{" + a + "}{" + b + "} + \\frac{" + c + "}{" + d + "} = \\frac{" + (a + c) + "}{" + (b + d) + "}") + ".",
        parts: [{ label: "Sans calculer la bonne réponse, explique pourquoi c'est forcément faux (compare avec " + M("\\frac{" + a + "}{" + b + "}") + ").", pts: 1 }, { label: "Calcule correctement.", pts: 1 }],
        sol: ul([M("\\frac{" + (a + c) + "}{" + (b + d) + "} \\approx " + A((a + c) / (b + d), 2)) + " est plus petit que " + M("\\frac{" + a + "}{" + b + "} \\approx " + A(a / b, 2)) + " : en ajoutant un nombre positif, on ne peut pas obtenir moins.", M("\\frac{" + a * d + "}{" + b * d + "} + \\frac{" + c * b + "}{" + b * d + "} = " + F(a * d + c * b, b * d)) + "."]) }); },
    () => { const S = [["« " + M("(-2)^4 = -16") + " »", false, M("(-2)^4 = 16") + " : quatre facteurs négatifs, résultat positif."], ["« " + M("2^3 \\cdot 2^4 = 2^{12}") + " »", false, "On additionne les exposants : " + M("2^7") + "."], ["« " + M("10^{-2} = 0{,}01") + " »", true, M("10^{-2} = \\frac{1}{100}") + "."], ["« " + M("5^0 = 0") + " »", false, M("5^0 = 1") + " (" + M("5^1 : 5") + ")."]];
      return X({ id: "puiss", lv: 1, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.",
        parts: S.map((s) => ({ label: s[0], pts: 1 })), sol: ul(S.map((s) => "<b>" + (s[1] ? "Vrai" : "Faux") + "</b>. " + s[2])) }); },
    () => { const w = who();
      return X({ id: "scicalc", lv: 2, titre: "Trouve l'erreur",
        q: w + " calcule " + M("(3 \\cdot 10^4) \\cdot (4 \\cdot 10^{-7})") + " et écrit : « " + M("= 12 \\cdot 10^{-28}") + ", c'est en notation scientifique ».",
        parts: [{ label: "Trouve les deux erreurs de " + w + ".", pts: 2 }, { label: "Donne le bon résultat en notation scientifique.", pts: 1 }],
        sol: ul(["Les exposants s'<b>additionnent</b> (" + M("4 + (-7) = -3") + "), ils ne se multiplient pas ; et 12 n'est pas entre 1 et 10.", M("12 \\cdot 10^{-3} = 1{,}2 \\cdot 10^{-2}") + "."]) }); },
    () => { const p = pk([10, 20, 50]);
      return X({ id: "fracconv", lv: 2, titre: "Retour au prix de départ ?",
        q: "Un prix augmente de " + p + " %, puis le nouveau prix baisse de " + p + " %. " + who() + " affirme : « on revient au prix de départ ».",
        parts: [{ label: "Teste avec un prix de 100 CHF.", pts: 1 }, { label: "L'affirmation est-elle vraie ? Explique avec les coefficients multiplicateurs.", pts: 2 }],
        sol: ul([M("100 \\cdot " + N(1 + p / 100) + " = " + (100 + p)) + ", puis " + M((100 + p) + " \\cdot " + N(1 - p / 100) + " = " + N((100 + p) * (1 - p / 100))) + " CHF.", "Faux : " + M(N(1 + p / 100) + " \\cdot " + N(1 - p / 100) + " = " + N((1 + p / 100) * (1 - p / 100))) + ", le prix baisse de " + M(N((p * p) / 100) + "\\,\\%") + " au total. La baisse porte sur un prix plus grand."]) }); },
  ];

  // ===================== 11e · 2. Pythagore =====================
  const EXP = [
    () => { const [a, h, c] = pk([[6, 8, 10], [9, 12, 15], [7, 24, 25], [5, 12, 13]]), d2 = a + pk([1, 2]);
      return X({ id: "pyth", lv: 1, titre: "L'échelle des pompiers",
        q: "Une échelle de " + Q(c, "m") + " est appuyée contre une façade verticale. Son pied est à " + Q(a, "m") + " du mur.",
        parts: [{ label: "Fais un croquis et calcule la hauteur atteinte par le haut de l'échelle.", pts: 2 }, { label: "On recule le pied de l'échelle jusqu'à " + Q(d2, "m") + " du mur. De combien le haut descend-il ? (au cm)", pts: 2 }],
        sol: ul([M("h = \\sqrt{" + c + "^2 - " + a + "^2} = \\sqrt{" + h * h + "} = " + h) + " m.", "Nouvelle hauteur " + M("\\sqrt{" + c * c + " - " + d2 * d2 + "} \\approx " + A(Math.sqrt(c * c - d2 * d2), 2)) + " m : il descend d'environ " + M(A(h - Math.sqrt(c * c - d2 * d2), 2)) + " m."]) }); },
    () => { const a = pk([60, 80, 90]), b = pk([45, 60, 120]), d = Math.sqrt(a * a + b * b), v = pk([1.2, 1.5]);
      return X({ id: "pyth", lv: 1, titre: "Le raccourci",
        q: "Pour traverser un parc rectangulaire de " + Q(a, "m") + " sur " + Q(b, "m") + ", " + who() + " coupe en diagonale au lieu de longer deux côtés. On marche à " + Q(v, "m/s") + ".",
        parts: [{ label: "Calcule la longueur de la diagonale (au dixième).", pts: 2 }, { label: "Combien de mètres économise-t-on ?", pts: 1 }, { label: "Combien de secondes gagne-t-on ?", pts: 1 }],
        sol: ul([M("\\sqrt{" + a + "^2 + " + b + "^2} \\approx " + A(d, 1)) + " m.", M((a + b) + " - " + A(d, 1) + " \\approx " + A(a + b - d, 1)) + " m.", M(A(a + b - d, 1) + " : " + N(v) + " \\approx " + A((a + b - d) / v, 0)) + " s."]) }); },
    () => { const x0 = R.int(-3, 1), y0 = R.int(-3, 1), [p, q] = pk([[4, 2], [3, 1], [2, 4], [6, 3]]);
      const A0 = [x0, y0], B0 = [x0 + p, y0 + q], C0 = [x0 + p - q, y0 + q + p];
      const ab = p * p + q * q, bc = q * q + p * p, ac = (p - q) ** 2 + (q + p) ** 2;
      return X({ id: "pythrec", lv: 2, titre: "Un triangle dans un repère",
        q: "Dans un repère orthonormé (unité : 1 cm), on place " + M("A(" + A0.join(" \\,;\\, ") + ")") + ", " + M("B(" + B0.join(" \\,;\\, ") + ")") + " et " + M("C(" + C0.join(" \\,;\\, ") + ")") + ".",
        parts: [{ label: "Calcule " + M("AB^2") + ", " + M("BC^2") + " et " + M("AC^2") + ".", pts: 2 }, { label: "Le triangle " + M("ABC") + " est-il rectangle ? Justifie.", pts: 1 }, { label: "Calcule son aire.", pts: 1 }],
        sol: ul([M("AB^2 = " + p + "^2 + " + q + "^2 = " + ab) + ", " + M("BC^2 = " + q + "^2 + " + p + "^2 = " + bc) + ", " + M("AC^2 = " + Math.abs(p - q) + "^2 + " + (p + q) + "^2 = " + ac) + ".", M(ab + " + " + bc + " = " + (ab + bc) + " = AC^2") + " : rectangle en " + M("B") + " (réciproque de Pythagore), et isocèle.", M("\\frac{AB \\cdot BC}{2} = \\frac{" + ab + "}{2} = " + N(ab / 2)) + " cm² (car " + M("AB = BC") + ")."]) }); },
    () => { const [a, b, c, d] = pk([[30, 40, 120, 130], [20, 40, 40, 60], [10, 20, 20, 30], [40, 40, 70, 90]]), stick = pk([d - 5, d + 5]);
      return X({ id: "pythfig", lv: 2, titre: "Le bâton dans la boîte",
        q: "Une boîte en forme de pavé droit mesure " + a + " cm × " + b + " cm × " + c + " cm. On veut y ranger un bâton rigide de " + stick + " cm.",
        parts: [{ label: "Calcule la diagonale du fond " + a + " × " + b + ".", pts: 1 }, { label: "Calcule la grande diagonale de la boîte.", pts: 2 }, { label: "Le bâton entre-t-il dans la boîte ? Justifie.", pts: 1 }],
        sol: ul([M("\\sqrt{" + a + "^2 + " + b + "^2} \\approx " + A(Math.hypot(a, b), 2)) + " cm.", M("\\sqrt{" + a + "^2 + " + b + "^2 + " + c + "^2} = \\sqrt{" + d * d + "} = " + d) + " cm.", stick <= d ? "Oui : " + stick + " cm ≤ " + d + " cm, en le plaçant le long de la grande diagonale." : "Non : " + stick + " cm > " + d + " cm, la plus grande longueur possible dans la boîte."]) }); },
    () => { const r = pk([4, 5, 6]);
      return X({ id: "pythfig", lv: 3, titre: "Le carré dans le cercle",
        q: "Un carré " + M("ABCD") + " est inscrit dans un cercle de centre " + M("O") + " et de rayon " + Q(r, "cm") + ".",
        parts: [{ label: "Que représente la diagonale " + M("[AC]") + " pour le cercle ? Quelle est sa longueur ?", pts: 1 }, { label: "Calcule la valeur exacte du côté du carré.", pts: 2 }, { label: "Calcule l'aire du carré, puis le pourcentage du disque qu'il occupe (au %).", pts: 2 }],
        sol: ul(["Un diamètre : " + M(2 * r) + " cm.", M("c^2 + c^2 = " + 4 * r * r) + ", " + M("c^2 = " + 2 * r * r) + ", " + M("c = \\sqrt{" + 2 * r * r + "} = " + r + "\\sqrt{2}") + " cm.", "Aire " + M(2 * r * r) + " cm² ; disque " + M(r * r + "\\pi") + " ; " + M("\\frac{" + 2 * r * r + "}{" + r * r + "\\pi} = \\frac{2}{\\pi} \\approx 64\\,\\%") + "."]) }); },
    () => { const p = pk([32, 43, 55, 65]);
      return X({ id: "pyth", lv: 3, titre: "L'écran 16:9",
        q: "La taille d'un écran est la longueur de sa diagonale, en pouces (1 pouce = " + Q(2.54, "cm") + "). Un écran 16:9 a une largeur " + M("16k") + " et une hauteur " + M("9k") + ". On considère un écran de " + p + " pouces.",
        parts: [{ label: "Diagonale en cm (au dixième).", pts: 1 }, { label: "Montre que " + M("(16k)^2 + (9k)^2 = 337k^2") + " et calcule " + M("k") + " (au centième).", pts: 2 }, { label: "Calcule la largeur et la hauteur de l'écran (au cm).", pts: 2 }],
        sol: ul([M(p + " \\cdot 2{,}54 = " + A(p * 2.54, 1)) + " cm.", M("256k^2 + 81k^2 = 337k^2") + " ; " + M("k = \\frac{" + A(p * 2.54, 1) + "}{\\sqrt{337}} \\approx " + A((p * 2.54) / Math.sqrt(337), 2)) + ".", "Largeur " + M("\\approx " + A((16 * p * 2.54) / Math.sqrt(337), 0)) + " cm, hauteur " + M("\\approx " + A((9 * p * 2.54) / Math.sqrt(337), 0)) + " cm."]) }); },
  ];
  const RAISONP = [
    () => { const [a, b, c] = pk([[5, 12, 13], [6, 8, 10], [9, 12, 15]]), w = who();
      return X({ id: "pyth", lv: 1, titre: "Trouve l'erreur",
        q: "Dans un triangle rectangle de cathètes " + a + " cm et " + b + " cm, " + w + " écrit : « l'hypoténuse mesure " + (a + b) + " cm ».",
        parts: [{ label: "Explique pourquoi c'est impossible (pense aux côtés d'un triangle).", pts: 1 }, { label: "Calcule l'hypoténuse correctement.", pts: 1 }],
        sol: ul(["Dans un triangle, un côté est toujours plus court que la somme des deux autres (inégalité triangulaire) : " + (a + b) + " cm donnerait un triangle « aplati ».", M("\\sqrt{" + a + "^2 + " + b + "^2} = \\sqrt{" + c * c + "} = " + c) + " cm."]) }); },
    () => { const S = [["« Le triangle de côtés 5, 7 et 9 est rectangle. »", false, M("25 + 49 = 74 \\ne 81") + "."], ["« Le triangle de côtés 1,5 ; 2 et 2,5 est rectangle. »", true, M("2{,}25 + 4 = 6{,}25 = 2{,}5^2") + "."], ["« Dans un triangle rectangle, l'hypoténuse est le plus grand côté. »", true, M("c^2 = a^2 + b^2 > a^2") + ", donc " + M("c > a") + " (et de même " + M("c > b") + ")."], ["« Un triangle de côtés 3, 4 et 6 est rectangle, car 3 + 4 > 6. »", false, "Il faut comparer les carrés : " + M("9 + 16 = 25 \\ne 36") + "."]];
      return X({ id: "pythrec", lv: 1, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.", parts: S.map((s) => ({ label: s[0], pts: 1 })), sol: ul(S.map((s) => "<b>" + (s[1] ? "Vrai" : "Faux") + "</b>. " + s[2])) }); },
    () => { const [a, b, c] = pk([[60, 80, 100], [30, 40, 50], [90, 120, 150]]);
      return X({ id: "pythrec", lv: 2, titre: "L'équerre du maçon",
        q: "Pour tracer un angle droit sans équerre, un maçon marque " + a + " cm sur un mur et " + b + " cm sur l'autre, à partir du coin. Il mesure ensuite la distance entre les deux marques.",
        parts: [{ label: "Quelle distance doit-il trouver si l'angle est droit ? Justifie.", pts: 1 }, { label: "Il mesure " + (c + 3) + " cm. L'angle est-il droit ? Plus grand ou plus petit qu'un angle droit ?", pts: 2 }],
        sol: ul([M(c) + " cm, car " + M(a + "^2 + " + b + "^2 = " + c * c + " = " + c + "^2") + " (réciproque de Pythagore).", "Non : " + M((c + 3) + "^2 = " + (c + 3) ** 2 + " \\ne " + c * c) + ". La distance est trop grande : les murs sont plus écartés, l'angle est plus grand qu'un angle droit."]) }); },
    () => { const w = who();
      return X({ id: "pythfig", lv: 2, titre: "Trouve l'erreur",
        q: "Pour la hauteur d'un triangle isocèle de côtés 13 cm, 13 cm et de base 10 cm, " + w + " écrit : « " + M("h^2 = 13^2 - 10^2 = 69") + ", donc " + M("h \\approx 8{,}3") + " cm ».",
        parts: [{ label: "Quelle est l'erreur ? Fais un croquis.", pts: 1 }, { label: "Calcule la hauteur correctement.", pts: 1 }],
        sol: ul(["La hauteur coupe la base en son milieu : le triangle rectangle a pour côté la <b>demi</b>-base, 5 cm.", M("h = \\sqrt{13^2 - 5^2} = \\sqrt{144} = 12") + " cm."]) }); },
  ];

  // ===================== 11e · 3. 3D (volumes et aires) =====================
  const EX3 = [
    () => { const a = pk([60, 80, 100]), b = pk([30, 40]), c = pk([40, 50]), L = pk([30, 40, 60]);
      return X({ id: "vol", lv: 1, titre: "L'aquarium",
        q: "Un aquarium en forme de pavé mesure " + a + " cm de long, " + b + " cm de large et " + c + " cm de haut.",
        parts: [{ label: "Calcule son volume en cm³, puis sa contenance en litres.", pts: 2 }, { label: "On y verse " + L + " L d'eau. À quelle hauteur monte l'eau (au mm) ?", pts: 2 }],
        sol: ul([M(a + " \\cdot " + b + " \\cdot " + c + " = " + N(a * b * c)) + " cm³ = " + M(N((a * b * c) / 1000)) + " L.", M(L + "\\ \\text{L} = " + N(L * 1000)) + " cm³ ; " + M("h = " + N(L * 1000) + " : " + a * b + " \\approx " + A((L * 1000) / (a * b), 1)) + " cm."]) }); },
    () => { const r = pk([3.3, 3.2, 3]), V = 33;
      return X({ id: "vol", lv: 2, titre: "La canette",
        q: "Une canette cylindrique contient 33 cL. Son rayon intérieur est " + Q(r, "cm") + ".",
        parts: [{ label: "Exprime 33 cL en cm³.", pts: 1 }, { label: "Calcule la hauteur minimale de la canette (au mm).", pts: 2 }, { label: "Calcule l'aire totale de métal (disques et paroi), en cm², pour cette hauteur.", pts: 2 }],
        sol: ul(["330 cm³.", M("h = \\frac{330}{\\pi \\cdot " + N(r) + "^2} \\approx " + A(330 / (Math.PI * r * r), 1)) + " cm.", M("2\\pi \\cdot " + N(r) + "^2 + 2\\pi \\cdot " + N(r) + " \\cdot " + A(330 / (Math.PI * r * r), 1) + " \\approx " + A(2 * Math.PI * r * r + 2 * Math.PI * r * +(330 / (Math.PI * r * r)).toFixed(1), 1)) + " cm²."]) }); },
    () => X({ id: "airepyr", lv: 2, titre: "La pyramide du Louvre",
        q: "La pyramide du Louvre est une pyramide régulière à base carrée de côté " + Q(35.4, "m") + " et de hauteur " + Q(21.6, "m") + ". Ses quatre faces sont en verre.",
        parts: [{ label: "Calcule son volume (au m³).", pts: 1 }, { label: "Calcule son apothème (au cm).", pts: 2 }, { label: "Calcule la surface de verre (au m²).", pts: 2 }],
        sol: ul([M("\\frac{35{,}4^2 \\cdot 21{,}6}{3} \\approx 9\\text{'}023") + " m³.", M("\\sqrt{21{,}6^2 + 17{,}7^2} \\approx 27{,}93") + " m.", M("4 \\cdot \\frac{35{,}4 \\cdot 27{,}93}{2} \\approx 1\\text{'}977") + " m²."]) }),
    () => { const r = pk([2, 3]), h = pk([6, 8, 10]), rho = 0.8;
      return X({ id: "volcomp", lv: 2, titre: "Le silo à grains",
        q: "Un silo est formé d'un cylindre de rayon " + Q(r, "m") + " et de hauteur " + Q(h, "m") + ", surmonté d'une demi-boule de même rayon. Un mètre cube de blé pèse environ " + M("0{,}8") + " tonne.",
        parts: [{ label: "Calcule le volume exact du silo (avec " + M("\\pi") + ").", pts: 2 }, { label: "Donne une valeur arrondie au m³.", pts: 1 }, { label: "Quelle masse de blé contient-il quand il est plein ? (à la tonne)", pts: 1 }],
        sol: ul(["Cylindre " + M(r * r * h + "\\pi") + ", demi-boule " + M("\\frac{2}{3}\\pi \\cdot " + r + "^3 = " + F(2 * r ** 3, 3) + "\\pi") + " ; total " + M(F(3 * r * r * h + 2 * r ** 3, 3) + "\\pi") + " m³.", M("\\approx " + A(((3 * r * r * h + 2 * r ** 3) / 3) * Math.PI, 0)) + " m³.", M("\\approx " + A((((3 * r * r * h + 2 * r ** 3) / 3) * Math.PI * rho), 0)) + " t."]) }); },
    () => { const r = 3, L = pk([14, 16, 18]);
      return X({ id: "volcomp", lv: 3, titre: "La gélule",
        q: "Une gélule a la forme d'un cylindre terminé par deux demi-boules. Son diamètre est " + Q(2 * r, "mm") + " et sa longueur totale " + Q(L, "mm") + ".",
        parts: [{ label: "Quelle est la longueur de la partie cylindrique ?", pts: 1 }, { label: "Calcule le volume exact de la gélule (en mm³, avec " + M("\\pi") + ").", pts: 2 }, { label: "Combien de gélules peut-on remplir avec 1 cm³ de poudre ? (1 cm³ = 1000 mm³)", pts: 1 }],
        sol: ul([M(L + " - 2 \\cdot " + r + " = " + (L - 2 * r)) + " mm.", "Boule " + M("36\\pi") + " + cylindre " + M(9 * (L - 2 * r) + "\\pi") + " = " + M((36 + 9 * (L - 2 * r)) + "\\pi \\approx " + A((36 + 9 * (L - 2 * r)) * Math.PI, 1)) + " mm³.", M("1000 : " + A((36 + 9 * (L - 2 * r)) * Math.PI, 1) + " \\approx " + A(1000 / ((36 + 9 * (L - 2 * r)) * Math.PI), 1)) + " : " + Math.floor(1000 / ((36 + 9 * (L - 2 * r)) * Math.PI)) + " gélules complètes."]) }); },
    () => { const r = pk([3, 4]), h = pk([9, 12]);
      return X({ id: "volcone", lv: 1, titre: "Le cornet de glace",
        q: "Un cornet a la forme d'un cône de rayon " + Q(r, "cm") + " et de hauteur " + Q(h, "cm") + ". On le remplit de glace, puis on pose dessus une demi-boule de glace de même rayon.",
        parts: [{ label: "Calcule le volume du cône (valeur exacte).", pts: 1 }, { label: "Calcule le volume de la demi-boule (valeur exacte).", pts: 1 }, { label: "Quel volume de glace en tout ? Quelle part (en %) est dans le cône ?", pts: 2 }],
        sol: ul([M("\\frac{1}{3}\\pi \\cdot " + r + "^2 \\cdot " + h + " = " + (r * r * h) / 3 + "\\pi") + " cm³.", M("\\frac{2}{3}\\pi \\cdot " + r + "^3 = " + F(2 * r ** 3, 3) + "\\pi") + " cm³.", M(F(r * r * h + 2 * r ** 3, 3) + "\\pi \\approx " + A(((r * r * h + 2 * r ** 3) / 3) * Math.PI, 1)) + " cm³ ; dans le cône : " + M("\\approx " + A((100 * r * r * h) / (r * r * h + 2 * r ** 3), 0) + "\\,\\%") + "."]) }); },
    () => X({ id: "volcone", lv: 3, titre: "Variations",
        q: "On s'intéresse à l'effet d'un agrandissement sur les volumes.",
        parts: [{ label: "Une boule a un rayon de 3 cm. Calcule son volume (exact). Même question pour un rayon de 6 cm.", pts: 1 }, { label: "Par combien le volume est-il multiplié quand le rayon double ? Explique avec la formule.", pts: 1 }, { label: "Un cône a une hauteur de 6 cm et un rayon de 2 cm. Que devient son volume si on double le rayon seulement ? la hauteur seulement ?", pts: 2 }],
        sol: ul([M("36\\pi") + " et " + M("288\\pi") + " cm³.", "Par " + M("2^3 = 8") + " : " + M("\\frac{4}{3}\\pi (2r)^3 = 8 \\cdot \\frac{4}{3}\\pi r^3") + ".", "Rayon doublé : volume × 4 (" + M("r^2") + ") ; hauteur doublée : volume × 2."]) }),
    () => { const r = pk([4, 5, 6]), V = pk([20, 25, 30]);
      return X({ id: "volmanq", lv: 2, titre: "Le verre conique",
        q: "On veut fabriquer un verre en forme de cône de rayon " + Q(r, "cm") + " qui contienne exactement " + V + " cL.",
        parts: [{ label: "Exprime le volume en cm³.", pts: 1 }, { label: "Calcule la profondeur (hauteur) du verre, au mm.", pts: 2 }, { label: "On remplit le verre jusqu'à mi-hauteur : le liquide forme un cône deux fois plus petit. Quelle fraction du verre est remplie ?", pts: 1 }],
        sol: ul([M(V * 10) + " cm³.", M("h = \\frac{3 \\cdot " + V * 10 + "}{\\pi \\cdot " + r + "^2} \\approx " + A((3 * V * 10) / (Math.PI * r * r), 1)) + " cm.", "Toutes les longueurs divisées par 2, le volume par " + M("2^3 = 8") + " : " + M("\\frac{1}{8}") + " du verre seulement !"]) }); },
  ];
  const RAISON3 = [
    () => { const r = pk([3, 6]), h = pk([4, 5]), w = who();
      return X({ id: "volcone", lv: 1, titre: "Trouve l'erreur",
        q: w + " calcule le volume d'un cône de rayon " + r + " cm et de hauteur " + h + " cm : « " + M("V = \\pi \\cdot " + r + "^2 \\cdot " + h + " = " + r * r * h + "\\pi") + " cm³ ».",
        parts: [{ label: "Quelle est l'erreur ?", pts: 1 }, { label: "Calcule le bon volume.", pts: 1 }],
        sol: ul(["C'est le volume du cylindre ; le cône en vaut le tiers.", M("\\frac{" + r * r * h + "\\pi}{3} = " + (r * r * h) / 3 + "\\pi") + " cm³."]) }); },
    () => { const S = [["« Si on double le rayon d'une boule, son volume double. »", false, "Il est multiplié par " + M("2^3 = 8") + "."], ["« Une pyramide vaut le tiers du prisme de même base et même hauteur. »", true, M("V = \\frac{1}{3} A_{\\text{base}} \\cdot h") + "."], ["« 1 L = 100 cm³. »", false, M("1\\ \\text{L} = 1\\ \\text{dm}^3 = 1000\\ \\text{cm}^3") + "."], ["« L'aire d'une sphère de rayon " + M("r") + " vaut " + M("4\\pi r^2") + ". »", true, "C'est la formule (4 fois l'aire d'un grand disque)."]];
      return X({ id: "volcone", lv: 1, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.", parts: S.map((s) => ({ label: s[0], pts: 1 })), sol: ul(S.map((s) => "<b>" + (s[1] ? "Vrai" : "Faux") + "</b>. " + s[2])) }); },
    () => { const d = pk([8, 10, 12]), h = pk([5, 7]), w = who();
      return X({ id: "vol", lv: 2, titre: "Trouve l'erreur",
        q: "Un cylindre a un diamètre de " + d + " cm et une hauteur de " + h + " cm. " + w + " écrit : « " + M("V = \\pi \\cdot " + d + "^2 \\cdot " + h + " = " + d * d * h + "\\pi") + " cm³ ».",
        parts: [{ label: "Quelle est l'erreur ? Par combien le résultat de " + w + " est-il trop grand ?", pts: 2 }, { label: "Calcule le bon volume.", pts: 1 }],
        sol: ul(["Il a pris le diamètre au lieu du rayon : le rayon est doublé, donc le volume est 4 fois trop grand.", M("\\pi \\cdot " + d / 2 + "^2 \\cdot " + h + " = " + (d * d * h) / 4 + "\\pi") + " cm³."]) }); },
    () => X({ id: "airepyr", lv: 2, titre: "Hauteur ou apothème ?",
        q: "Une pyramide régulière à base carrée a un côté de base de 12 cm et une hauteur de 8 cm. " + who() + " calcule son aire latérale : « " + M("4 \\cdot \\frac{12 \\cdot 8}{2} = 192") + " cm² ».",
        parts: [{ label: "Quelle longueur aurait-il fallu utiliser à la place de 8 cm ? Pourquoi ?", pts: 1 }, { label: "Calcule-la, puis calcule l'aire latérale correcte.", pts: 2 }],
        sol: ul(["L'apothème : c'est la hauteur des faces triangulaires, pas celle de la pyramide.", M("a = \\sqrt{8^2 + 6^2} = 10") + " cm ; aire latérale " + M("4 \\cdot \\frac{12 \\cdot 10}{2} = 240") + " cm²."]) }),
  ];

  RICH.no11 = { ids: ["prio", "fracadd", "fracmul", "fracconv", "puiss", "sci", "scicalc"], label: "Nombres et opérations", ex: EXN, raison: RAISONN, minutes: 45, minA: 2 }; /* 25.11 : automatismes au niveau 2 (audit de niveau 11e) */
  RICH.pyth11 = { ids: ["pyth", "pythfig", "pythrec"], label: "Théorème de Pythagore", ex: EXP, raison: RAISONP, minutes: 45, minA: 2 }; /* 25.11 : automatismes au niveau 2 (audit de niveau 11e) */
  RICH.gm3d11 = { ids: ["vol", "volcone", "airepyr", "volcomp", "volmanq"], label: "Volumes et aires (3D)", ex: EX3, raison: RAISON3, minutes: 45, minA: 2 }; /* 25.11 : automatismes au niveau 2 (audit de niveau 11e) */
})();
