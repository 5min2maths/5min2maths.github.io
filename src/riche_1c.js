// Chantier 1re Collège (19.11) : tests de préparation de qualité pour 7. Degré 2, 4. Fonctions, 8. De Thalès à
// Pythagore, 10. Trigonométrie (exercices en situation, plusieurs étapes, interprétation) + raisonnements.
// Même format que riche_11b.js / riche_11c.js.
(function () {
  const r6 = (v) => Math.round(v * 1e6) / 1e6;
  const N = (v) => { let [i, f] = String(r6(v)).split("."); if (i.replace("-", "").length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}"); return i + (f ? "{,}" + f : ""); };
  const u = (s) => ("\\ \\text{" + s.replace(/\^([23])/, "}^$1\\text{") + "}").replace(/\\text\{\}$/, "");
  const Q = (v, s) => M(N(v) + u(s));
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const g2 = (a, b) => (b ? g2(b, a % b) : Math.abs(a));
  const F = (n, d) => { const g = g2(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n) : (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
  const pd = (t) => colonBreak(String(t).split(/(\\\(.*?\\\))/).map((seg, i) => (i % 2 ? seg : seg.replace(/\{,\}/g, ",").replace(/\\text\{'\}/g, "'"))).join(""));
  const X = (o) => Object.assign({ pts: Math.max(1, o.parts.reduce((s, p) => s + p.pts, 0)) }, o, { q: pd(o.q), sol: pd(o.sol), parts: o.parts.map((p) => ({ label: pd(p.label), pts: p.pts })) });
  const ul = (rows) => "<ol type=\"a\" class=\"mock-parts\">" + rows.map((r) => "<li>" + r + "</li>").join("") + "</ol>";
  const who = () => pk(["Lina", "Noé", "Inès", "Yanis", "Mia", "Sam"]);
  const P1 = (n) => (n === 1 ? "" : "s");
  const D = Math.PI / 180;
  // ===================== 7. Degré 2 =====================
  const EX2 = [
    () => { const v = pk([15, 20, 25]), h0 = pk([1, 2]);
      return X({ id: "f2", lv: 1, titre: "Le lancer franc", q: "La hauteur (en m) d'un ballon est " + M("h(t) = -5t^2 + " + v + "t + " + h0) + ", où " + M("t") + " est le temps en secondes.",
        parts: [{ label: "À quel instant le ballon est-il au plus haut ?", pts: 1 }, { label: "Quelle est la hauteur maximale ?", pts: 1 }, { label: "Le ballon touche-t-il un plafond situé à " + Q(v * v / 20 + h0 - 1, "m") + " ? Justifie.", pts: 1 }],
        sol: ul([M("t = -\\frac{" + v + "}{2 \\cdot (-5)} = " + N(v / 10)) + " s.", M("h(" + N(v / 10) + ") = " + N(v * v / 20 + h0)) + " m.", "Oui : la hauteur maximale dépasse le plafond de 1 m."]) }); },
    () => { const p = pk([-3, -2, -1]), q = pk([2, 3, 4, 5]);
      return X({ id: "f2formes", lv: 2, titre: "Trois écritures d'une même parabole", q: "Soit " + M("f(x) = (x " + (p < 0 ? "+ " + -p : "- " + p) + ")(x - " + q + ")") + ".",
        parts: [{ label: "Donne les zéros et l'ordonnée à l'origine.", pts: 1 }, { label: "Écris la forme développée.", pts: 1 }, { label: "Écris la forme canonique et donne le sommet.", pts: 2 }],
        sol: ul([M(p) + " et " + M(q) + " ; " + M("f(0) = " + p * q) + ".", M("x^2 " + (-(p + q) < 0 ? "- " + (p + q) : "+ " + -(p + q)) + "x " + (p * q < 0 ? "- " + -p * q : "+ " + p * q)) + ".", "Sommet au milieu des zéros : " + M("x_S = " + N((p + q) / 2)) + ", " + M("f(x_S) = " + N(-(((q - p) / 2) ** 2))) + " ; " + M("f(x) = (x - " + N((p + q) / 2) + ")^2 - " + N(((q - p) / 2) ** 2)) + "."]) }); },
    () => { const L = pk([20, 24, 40]);
      return X({ id: "optim", lv: 2, titre: "L'enclos le long du mur", q: "Avec " + Q(L, "m") + " de grillage, on fabrique un enclos rectangulaire adossé à un mur (le mur remplace un côté). On note " + M("x") + " la largeur (côtés perpendiculaires au mur).",
        parts: [{ label: "Exprime la longueur, puis l'aire " + M("A(x)") + ".", pts: 2 }, { label: "Quelle largeur donne l'aire maximale ? Quelle est cette aire ?", pts: 2 }],
        sol: ul(["Longueur " + M(L + " - 2x") + " ; " + M("A(x) = x(" + L + " - 2x) = -2x^2 + " + L + "x") + ".", M("x = \\frac{" + L + "}{4} = " + N(L / 4)) + " m ; " + M("A = " + N(L * L / 8)) + " m²."]) }); },
    () => { const a = pk([1, 2]), p = pk([-1, 1, 2]), q = p + pk([3, 4]);
      return X({ id: "ineq2", lv: 3, titre: "Quand la fonction est-elle positive ?", q: "Soit " + M("f(x) = " + (a === 1 ? "" : a) + "x^2 " + (-(p + q) * a < 0 ? "- " + (p + q) * a : "+ " + -(p + q) * a) + "x " + (a * p * q < 0 ? "- " + -a * p * q : "+ " + a * p * q)) + " et " + M("g(x) = " + (a === 1 ? "" : a) + "x " + (a * p > 0 ? "- " + a * p : "+ " + -a * p)) + ".",
        parts: [{ label: "Résous " + M("f(x) = 0") + ".", pts: 1 }, { label: "Résous " + M("f(x) > 0") + " (tableau de signes ou parabole).", pts: 1 }, { label: "Résous " + M("f(x) \\le g(x)") + ".", pts: 2 }],
        sol: ul([M(p) + " et " + M(q) + ".", M("x < " + p) + " ou " + M("x > " + q) + ".", M("f(x) - g(x) = " + a + "(" + "x - " + p + ")(x - " + (q + 1) + ")").replace(/- -/g, "+ ") + " ≤ 0 : " + M("[" + p + " \\,;\\, " + (q + 1) + "]") + "."]) }); },
  ];
  const RAISON2 = [
    () => X({ id: "eq2", lv: 1, titre: "Trouve l'erreur", q: who() + " résout " + M("x^2 = 5x") + " en divisant par " + M("x") + " : « " + M("x = 5") + " ».", parts: [{ label: "Quelle solution a été perdue ? Pourquoi ?", pts: 1 }, { label: "Résous correctement.", pts: 1 }], sol: ul(["x = 0 : on ne peut pas diviser par x s'il peut être nul.", M("x(x - 5) = 0") + " : " + M("x = 0") + " ou " + M("x = 5") + "."]) }),
    () => X({ id: "eq2disc", lv: 2, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.", parts: [{ label: "« x² + 4 = 0 n'a pas de solution réelle. »", pts: 1 }, { label: "« Si a et c sont de signes contraires, ax² + bx + c = 0 a deux solutions. »", pts: 1 }], sol: ul(["<b>Vrai</b> : un carré n'est jamais égal à −4.", "<b>Vrai</b> : " + M("\\Delta = b^2 - 4ac > 0") + " car " + M("-4ac > 0") + "."]) }),
  ];
  // ===================== 4. Fonctions =====================
  const EXF = [
    () => { const F = pk([8, 10, 12]), p = pk([0.5, 0.8]);
      return X({ id: "modaff", lv: 1, titre: "La location de trottinette", q: "Une trottinette coûte " + Q(F, "CHF") + " de déblocage, puis " + Q(p, "CHF") + " par minute. Un vélo coûte " + Q(0, "CHF") + " de déblocage et " + Q(p + 0.5, "CHF") + " par minute.",
        parts: [{ label: "Écris les prix " + M("T(x)") + " et " + M("V(x)") + " pour " + M("x") + " minutes.", pts: 1 }, { label: "À partir de combien de minutes la trottinette est-elle moins chère ?", pts: 2 }],
        sol: ul([M("T(x) = " + F + " + " + N(p) + "x") + " ; " + M("V(x) = " + N(p + 0.5) + "x") + ".", M(F + " + " + N(p) + "x < " + N(p + 0.5) + "x \\iff x > " + 2 * F) + " : dès " + (2 * F + 1) + " minutes."]) }); },
    () => { const a = pk([2, 3]), b = pk([-1, 1, 4]);
      return X({ id: "transf", lv: 2, titre: "Déplacer une parabole", q: "On part de " + M("f(x) = x^2") + " et on construit " + M("g(x) = (x - " + a + ")^2 " + (b < 0 ? "- " + -b : "+ " + b)) + ".",
        parts: [{ label: "Décris les déplacements qui envoient le graphe de f sur celui de g.", pts: 1 }, { label: "Donne le sommet de g et l'image du point " + M("(1 \\,;\\, 1)") + " de f.", pts: 2 }],
        sol: ul([a + " vers la droite et " + Math.abs(b) + " vers le " + (b > 0 ? "haut" : "bas") + ".", "Sommet " + M("(" + a + " \\,;\\, " + b + ")") + " ; point " + M("(" + (1 + a) + " \\,;\\, " + (1 + b) + ")") + "."]) }); },
    () => { const r = pk([2, 3, 4]);
      return X({ id: "domaine", lv: 2, titre: "Où la fonction existe-t-elle ?", q: "Soit " + M("f(x) = \\frac{\\sqrt{x + " + r + "}}{x - 1}") + ".",
        parts: [{ label: "Quelle condition impose la racine ?", pts: 1 }, { label: "Quelle valeur est interdite par le dénominateur ?", pts: 1 }, { label: "Écris le domaine de définition et calcule " + M("f(" + (r * r - r) + ")") + ".", pts: 2 }],
        sol: ul([M("x \\ge -" + r) + ".", M("x \\ne 1") + ".", M("D = [-" + r + " \\,;\\, 1[ \\cup ]1 \\,;\\, +\\infty[") + " ; " + M("f(" + (r * r - r) + ") = \\frac{" + r + "}{" + (r * r - r - 1) + "}") + "."]) }); },
    () => { const k = pk([12, 18, 24]);
      return X({ id: "racinv", lv: 3, titre: "Partager un gâteau", q: "Un gâteau de " + Q(k, "parts") + " est partagé équitablement entre " + M("x") + " personnes : chacune reçoit " + M("f(x) = \\frac{" + k + "}{x}") + " parts.",
        parts: [{ label: "Calcule f(2), f(3) et f(6). Comment évolue f(x) quand x augmente ?", pts: 2 }, { label: "Combien de personnes pour que chacune ait 1,5 part ?", pts: 1 }, { label: "Pourquoi " + M("x = 0") + " est-il interdit ?", pts: 1 }],
        sol: ul([N(k / 2) + ", " + N(k / 3) + ", " + N(k / 6) + " : f diminue (fonction inverse).", M("\\frac{" + k + "}{x} = 1{,}5 \\iff x = " + N(k / 1.5)) + ".", "On ne peut pas diviser par 0 (et partager entre 0 personne n'a pas de sens)."]) }); },
  ];
  const RAISONF = [
    () => X({ id: "fimg", lv: 1, titre: "Image ou antécédent ?", q: who() + " lit sur un graphique : « f(2) = 5, donc l'image de 5 est 2 ».", parts: [{ label: "Corrige la phrase.", pts: 1 }, { label: "Combien d'antécédents un nombre peut-il avoir ? Et d'images ?", pts: 1 }], sol: ul(["L'image de 2 est 5 ; 2 est un antécédent de 5.", "Un nombre a au plus une image, mais peut avoir plusieurs antécédents."]) }),
    () => X({ id: "transf", lv: 2, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.", parts: [{ label: "« Le graphe de f(x − 3) est celui de f décalé de 3 vers la gauche. »", pts: 1 }, { label: "« Le graphe de −f(x) est le symétrique de celui de f par rapport à l'axe des x. »", pts: 1 }], sol: ul(["<b>Faux</b> : vers la DROITE.", "<b>Vrai</b> : les ordonnées changent de signe."]) }),
  ];
  // ===================== 8. De Thalès à Pythagore =====================
  const EXG = [
    () => { const [p, q] = pk([[9, 16], [4, 9], [3.6, 6.4]]), h = Math.sqrt(p * q);
      return X({ id: "euclide", lv: 1, titre: "Le pont suspendu", q: "Un câble vertical relie le sommet de l'angle droit d'un triangle rectangle à son hypoténuse ; il la découpe en " + Q(p, "m") + " et " + Q(q, "m") + ".",
        parts: [{ label: "Calcule la longueur du câble.", pts: 1 }, { label: "Calcule les deux autres côtés du triangle.", pts: 2 }],
        sol: ul([M("h = \\sqrt{" + N(p) + " \\cdot " + N(q) + "} = " + N(h)) + " m.", M("\\sqrt{" + N(p) + " \\cdot " + N(p + q) + "} = " + N(Math.sqrt(p * (p + q)))) + " m et " + M(N(Math.sqrt(q * (p + q)))) + " m."]) }); },
    () => { const k = pk([2, 3, 4]);
      return X({ id: "exactes", lv: 2, titre: "Le carré et son cercle", q: "Un carré a un côté de " + Q(2 * k, "cm") + ".",
        parts: [{ label: "Calcule la valeur exacte de sa diagonale.", pts: 1 }, { label: "Calcule le rayon et l'aire (valeur exacte) du cercle circonscrit.", pts: 2 }],
        sol: ul([M(2 * k + "\\sqrt{2}") + " cm.", "Rayon " + M(k + "\\sqrt{2}") + " ; aire " + M("\\pi (" + k + "\\sqrt{2})^2 = " + 2 * k * k + "\\pi") + " cm²."]) }); },
    () => { const [B, b, l, h] = pk([[14, 8, 5, 4], [20, 10, 13, 12]]);
      return X({ id: "geocomb", lv: 2, titre: "Le bac à fleurs", q: "La section d'un bac à fleurs est un trapèze isocèle : bases " + Q(B, "dm") + " et " + Q(b, "dm") + ", côtés obliques " + Q(l, "dm") + ". Le bac est long de " + Q(10, "dm") + ".",
        parts: [{ label: "Calcule la hauteur du trapèze.", pts: 2 }, { label: "Calcule le volume de terre (en L).", pts: 2 }],
        sol: ul([M("\\sqrt{" + l + "^2 - " + (B - b) / 2 + "^2} = " + h) + " dm.", "Aire " + M("\\frac{(" + B + " + " + b + ") \\cdot " + h + "}{2} = " + ((B + b) * h) / 2) + " dm² ; volume " + M(((B + b) * h) / 2 * 10) + " L."]) }); },
    () => { const m = pk([9, 12, 15]);
      return X({ id: "droitesrem", lv: 3, titre: "Le centre de gravité", q: "Une plaque triangulaire ABC est rectangle en C, avec " + M("AC = " + (m === 9 ? 6 : m === 12 ? 9 : 12)) + " cm et " + M("BC = " + (m === 9 ? 8 : m === 12 ? 12 : 16)) + " cm.",
        parts: [{ label: "Calcule AB et la médiane issue de C.", pts: 2 }, { label: "À quelle distance de C se trouve le centre de gravité ?", pts: 1 }],
        sol: ul(["AB = " + M(m === 9 ? 10 : m === 12 ? 15 : 20) + " cm ; médiane = AB/2 = " + M(N((m === 9 ? 10 : m === 12 ? 15 : 20) / 2)) + " cm (milieu de l'hypoténuse).", M("\\frac{2}{3}") + " de la médiane : " + M(N(((m === 9 ? 10 : m === 12 ? 15 : 20) / 2) * 2 / 3)) + " cm."]) }); },
  ];
  const RAISONG = [
    () => X({ id: "pythrec", lv: 1, titre: "Trouve l'erreur", q: who() + " affirme : « 4² + 5² = 41 et 6² = 36, donc le triangle 4-5-6 est presque rectangle, on peut appliquer Pythagore ».", parts: [{ label: "Pourquoi est-ce faux ?", pts: 1 }, { label: "Le triangle a-t-il un angle aigu ou obtus face au côté 6 ?", pts: 1 }], sol: ul(["Pythagore exige l'égalité exacte : 41 ≠ 36, le triangle n'est pas rectangle.", "36 < 41 : l'angle face au côté 6 est aigu."]) }),
    () => X({ id: "euclide", lv: 2, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.", parts: [{ label: "« Dans un triangle rectangle, h² = p · q. »", pts: 1 }, { label: "« La médiane issue de l'angle droit vaut la moitié de l'hypoténuse. »", pts: 1 }], sol: ul(["<b>Vrai</b> (théorème de la hauteur).", "<b>Vrai</b> : le milieu de l'hypoténuse est le centre du cercle circonscrit."]) }),
  ];
  // ===================== 10. Trigonométrie =====================
  const EXT = [
    () => { const a = pk([30, 35, 40]), d = pk([20, 30, 40]);
      return X({ id: "trigo", lv: 1, titre: "La hauteur de l'arbre", q: "À " + Q(d, "m") + " d'un arbre, on voit son sommet sous un angle de " + M(a + "°") + " (yeux à " + Q(1.6, "m") + ").",
        parts: [{ label: "Fais un croquis et nomme les côtés (opposé, adjacent).", pts: 1 }, { label: "Calcule la hauteur de l'arbre (au cm).", pts: 2 }],
        sol: ul(["La distance est adjacente à l'angle, la hauteur cherchée opposée.", M(d + " \\cdot \\tan " + a + "° + 1{,}6 \\approx " + N(Math.round((d * Math.tan(a * D) + 1.6) * 100) / 100)) + " m."]) }); },
    () => { const [L, h] = pk([[4, 3.7], [5, 4.6], [6, 5.5], [5, 4.2], [4, 3.5]]);
      return X({ id: "trigo", lv: 2, titre: "L'échelle de sécurité", q: "Une échelle de " + Q(L, "m") + " doit faire un angle entre 65° et 75° avec le sol. On l'appuie pour atteindre " + Q(h, "m") + " de haut.",
        parts: [{ label: "Calcule l'angle avec le sol (au dixième).", pts: 2 }, { label: "Est-ce sûr ? Justifie.", pts: 1 }],
        sol: ul([M("\\sin \\alpha = \\frac{" + N(h) + "}{" + L + "}") + ", " + M("\\alpha \\approx " + N(Math.round((Math.asin(h / L) / D) * 10) / 10) + "°") + ".", (Math.asin(h / L) / D >= 65 && Math.asin(h / L) / D <= 75 ? "Oui, l'angle est dans l'intervalle." : "Non, l'angle est hors de l'intervalle 65°–75°.")]) }); },
    () => { const p = pk([8, 10, 12]);
      return X({ id: "trigexact", lv: 2, titre: "La route de col", q: "Un panneau annonce une pente de " + M(p + "\\,\\%") + " sur " + Q(3, "km") + " (distance horizontale).",
        parts: [{ label: "Quel dénivelé (en m) ?", pts: 1 }, { label: "Quel angle avec l'horizontale (au dixième) ?", pts: 1 }, { label: "Une pente de 100 % correspond à quel angle ?", pts: 1 }],
        sol: ul([M("3000 \\cdot " + N(p / 100) + " = " + 30 * p) + " m.", M("\\tan^{-1}(" + N(p / 100) + ") \\approx " + N(Math.round((Math.atan(p / 100) / D) * 10) / 10) + "°") + ".", M("45°") + " (tan 45° = 1)."]) }); },
    () => { const [o, h] = pk([[3, 5], [5, 13], [8, 17]]);
      return X({ id: "trigrel", lv: 3, titre: "Sans calculatrice", q: "Un angle aigu " + M("\\alpha") + " vérifie " + M("\\sin \\alpha = \\frac{" + o + "}{" + h + "}") + ".",
        parts: [{ label: "Calcule " + M("\\cos \\alpha") + " (valeur exacte).", pts: 2 }, { label: "Calcule " + M("\\tan \\alpha") + ".", pts: 1 }],
        sol: ul([M("\\cos \\alpha = \\sqrt{1 - \\frac{" + o * o + "}{" + h * h + "}} = \\frac{" + Math.sqrt(h * h - o * o) + "}{" + h + "}") + ".", M("\\tan \\alpha = \\frac{" + o + "}{" + Math.sqrt(h * h - o * o) + "}") + "."]) }); },
  ];
  const RAISONT = [
    () => X({ id: "trigo", lv: 1, titre: "Trouve l'erreur", q: who() + " calcule le côté opposé à 40° avec une hypoténuse de 10 cm : « " + M("10 \\cdot \\cos 40° \\approx 7{,}66") + " cm ».", parts: [{ label: "Quelle est l'erreur ?", pts: 1 }, { label: "Calcule correctement.", pts: 1 }], sol: ul(["Le côté opposé va avec le sinus.", M("10 \\sin 40° \\approx 6{,}43") + " cm."]) }),
    () => X({ id: "trigexact", lv: 2, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.", parts: [{ label: "« sin 30° = cos 60°. »", pts: 1 }, { label: "« Une pente de 50 % correspond à un angle de 45°. »", pts: 1 }], sol: ul(["<b>Vrai</b> : les deux valent 1/2 (angles complémentaires).", "<b>Faux</b> : 45° donne 100 % ; 50 % donne environ 26,6°."]) }),
  ];

  RICH.deg2c = { ids: ["bicarre", "eq2", "eq2disc", "eq2fact", "eq3", "eqirr", "f2", "f2expr", "f2formes", "f2trois", "ineq2", "ineqfrac", "inter", "interpar", "optim", "probeq2", "trinfact"], label: "Degré 2", ex: EX2, raison: RAISON2, minutes: 45 };
  RICH.fct1c = { ids: ["absval", "domaine", "fimg", "lectgraph", "modaff", "morceaux", "racinv", "tabval", "transf"], label: "Fonctions", ex: EXF, raison: RAISONF, minutes: 45 };
  RICH.geo1c = { ids: ["droitesrem", "euclide", "exactes", "geocomb", "pyth", "pythfig", "pythrec", "simil", "thales"], label: "De Thalès à Pythagore", ex: EXG, raison: RAISONG, minutes: 45 };
  RICH.trig1c = { ids: ["trigexact", "trigo", "trigrel"], label: "Trigonométrie du triangle rectangle", ex: EXT, raison: RAISONT, minutes: 45 };
})();
