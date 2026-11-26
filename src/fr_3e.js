// 25.11 · France, collège et 2nde : notions créées pour la couverture du programme (tools/france_couverture.md).
// 4e (attendus 2019) : cos4e (cosinus seul dans le triangle rectangle), thales4e (Thalès, triangles emboîtés).
// 3e : linfn (fonction linéaire, 3e-2019 PF.01, PF.09, PF.12), autodnb (automatismes de la partie 1 du DNB, sans
// calculatrice), vecgeo (translations et vecteurs, programme 2026 de 3e : en fin d'année, repris en 2nde).
// 2nde : tabvar (tableaux de variations : extremums, sens de variation, nombre de solutions, 2nde.AN.08–09).
// Outils communs : FRX (src/fr_1re.js). Notions sans CH ni MP : invisibles pour un élève suisse.
(function () {
  const { pk, nz, rnd, g2, den, N, NP, F, FS, sg, X, co, lin, linE, QN, QR, QX, QS, QSet, QP, GR, GX, GP, TR, TX, TS, P, reg } = FRX;
  const deg = (r) => (r * 180) / Math.PI, rad = (d) => (d * Math.PI) / 180;
  const cm = (v) => M(N(v) + "\\ \\text{cm}"), m_ = (v) => M(N(v) + "\\ \\text{m}");
  const EUR = (v) => M(N(v) + "\\ \\text{€}");

  // ======================= linfn : fonction linéaire (3e) =======================
  const LF = {
    1: [
      () => { const a = pk([1.5, 2.5, 3, 4, -2, -3, 0.4, 0.6, 1.2]), x = pk([2, 4, 5, 6, 8, 10]), y = rnd(a * x);
        return QN("La fonction linéaire " + M("f") + " vérifie " + M("f(" + x + ") = " + N(y)) + ". Quel est son coefficient " + M("a") + " (" + M("f(x) = ax") + ") ?", a,
          M("f(x) = ax") + " et " + M("f(" + x + ") = " + N(y)) + " : " + M(x + "a = " + N(y)) + ", donc " + M("a = \\frac{" + N(y) + "}{" + x + "} = " + N(a)) + ".",
          { ctx: "coef", guide: [GX("Écris " + M("f(" + x + ")") + " avec la lettre " + M("a") + ".", x + "*a", M(x + "a") + "."), GR(M("a") + " ?", a, M(N(a)) + ".")],
            traps: [TR(rnd(y * x), "On divise l'image par " + x + ", on ne multiplie pas."), TR(rnd(x / y, 6), "a = f(x) ÷ x : l'image au numérateur."), TR(rnd(y - x), "Une fonction linéaire multiplie : a = f(x) ÷ x.")] }); },
      () => { const a = pk([1.2, 0.8, 1.5, 2.5, -1.5, 0.25, 0.75, -0.4]), x = pk([12, 20, 24, 30, 35, 40, -8, -16]), v = rnd(a * x);
        return QN("Soit la fonction linéaire " + M("f : x \\mapsto " + N(a) + "x") + ". Calcule l'image de " + M(N(x)) + ".", v,
          M("f(" + N(x) + ") = " + N(a) + X + NP(x) + " = " + N(v)) + ".",
          { ctx: "image", guide: [GR(M("f(" + N(x) + ") = " + N(a) + X + NP(x)) + " = ?", v, M(N(v)) + ".")],
            traps: [TR(rnd(x / a, 6), "L'image : on multiplie par " + N(a).replace("{,}", ",") + "."), TR(rnd(a + x), "f(x) = ax est un produit.")] }); },
      () => { const a = pk([0.8, 1.25, 1.5, 2.5, 0.6, 4, -3, 0.75]), x = pk([12, 20, 24, 30, 40, 48, 60]), y = rnd(a * x);
        return QN("Soit la fonction linéaire " + M("f(x) = " + N(a) + "x") + ". Quel est l'antécédent de " + M(N(y)) + " par " + M("f") + " ?", x,
          "On résout " + M(N(a) + "x = " + N(y)) + " : " + M("x = \\frac{" + N(y) + "}{" + N(a) + "} = " + N(x)) + ".",
          { ctx: "antecedent", guide: [GX("Quelle équation faut-il résoudre ? Écris son membre de gauche.", a + "*x", M(N(a) + "x = " + N(y)) + "."), GR(M("x") + " ?", x, M(N(x)) + ".")],
            traps: [TR(rnd(a * y), "C'est l'image de " + N(y).replace("{,}", ",") + " : on cherche le nombre qui a pour image " + N(y).replace("{,}", ",") + "."), TR(rnd(a / y, 6), "x = " + N(y).replace("{,}", ",") + " ÷ " + N(a).replace("{,}", ",") + ".")] }); },
    ],
    2: [
      () => { const t = pk([5, 12, 15, 18, 20, 25, 30, 35, 40]), up = R.rand() < 0.5, k = rnd(up ? 1 + t / 100 : 1 - t / 100), x = pk([40, 60, 80, 120, 150, 250]), v = rnd(k * x);
        const c = pk([["Un prix", "€", "soldes"], ["Une facture d'électricité", "€", "facture"], ["La population d'un village", "habitants", "population"]]);
        return QN(c[0] + " " + (up ? "augmente" : "baisse") + " de " + M(t + "\\,\\%") + ". On note " + M("f(x)") + " la nouvelle valeur quand la valeur de départ est " + M("x") + " ; la fonction " + M("f") + " est linéaire. Quel est son coefficient ?", k,
          (up ? "Augmenter" : "Baisser") + " de " + M(t + "\\,\\%") + ", c'est multiplier par " + M("1 " + (up ? "+" : "-") + " \\frac{" + t + "}{100} = " + N(k)) + " : " + M("f(x) = " + N(k) + "x") + ". Par exemple " + M("f(" + x + ") = " + N(v)) + ".",
          { ctx: "pourcentage-" + c[2], guide: [GR(M(t + "\\,\\%") + " en écriture décimale ?", t / 100, M(N(t / 100)) + "."), GR("Coefficient ?", k, M(N(k)) + ".")],
            traps: [TR(rnd(t / 100), "C'est la variation seule : on garde aussi la valeur de départ (1 " + (up ? "+" : "−") + " …)."), TR(rnd(up ? 1 - t / 100 : 1 + t / 100), up ? "Une hausse : 1 + t/100." : "Une baisse : 1 − t/100."), TR(t, "Le coefficient est un nombre décimal, pas un pourcentage.")] }); },
      () => { const a = nz(-4, 4) * pk([1, 0.5, 1.5]), xA = pk([2, 4, 6, -2, -4]), yA = rnd(a * xA), x = pk([5, 7, 9, 10, -3, -5]), v = rnd(a * x); if (!a || x === xA) return null;
        return QN("La droite qui représente la fonction linéaire " + M("f") + " passe par le point " + M("A(" + N(xA) + " \\,;\\, " + N(yA) + ")") + ". Calcule " + M("f(" + N(x) + ")") + ".", v,
          "La droite passe par l'origine et par " + M("A") + " : " + M("a = \\frac{" + N(yA) + "}{" + N(xA) + "} = " + N(a)) + ", puis " + M("f(" + N(x) + ") = " + N(a) + X + NP(x) + " = " + N(v)) + ".",
          { ctx: "point", guide: [GR("Coefficient " + M("a") + " ?", a, M(N(a)) + "."), GR(M("f(" + N(x) + ")") + " ?", v, M(N(v)) + ".")],
            traps: [TR(rnd((xA / yA) * x, 6), "a = ordonnée ÷ abscisse de A."), TR(rnd(yA + x - xA), "Une fonction linéaire est proportionnelle : on multiplie, on n'ajoute pas.")] }); },
      () => { const c = pk([["Le prix du fromage à la coupe est proportionnel à sa masse", "kg", "€", "fromage"], ["La distance parcourue par un TGV à vitesse constante est proportionnelle à la durée", "h", "km", "tgv"], ["La masse d'un câble est proportionnelle à sa longueur", "m", "kg", "cable"]]);
        const a = pk({ fromage: [18, 24, 32], tgv: [240, 280, 320], cable: [2.5, 4.5, 12] }[c[3]]) /* 26.11 (vraisemblance) : un TGV à 32 km/h, du fromage à 2,50 €/kg : coefficient propre au contexte */, x1 = pk([0.5, 1.5, 2.5, 0.75]), x2 = pk([1.25, 3.5, 4, 0.4]), y1 = rnd(a * x1), v = rnd(a * x2); if (x1 === x2) return null;
        return QN(c[0] + " : " + M(N(x1) + "\\ \\text{" + c[1] + "}") + " correspondent à " + M(N(y1) + "\\ \\text{" + c[2] + "}") + ". Avec la fonction linéaire " + M("f(x) = ax") + ", calcule ce qui correspond à " + M(N(x2) + "\\ \\text{" + c[1] + "}") + ".", v,
          M("a = \\frac{" + N(y1) + "}{" + N(x1) + "} = " + N(a)) + " (en " + c[2] + " par " + c[1] + ") et " + M("f(" + N(x2) + ") = " + N(a) + X + N(x2) + " = " + N(v)) + " " + c[2] + ".",
          { ctx: "contexte-" + c[3], guide: [GR("Coefficient " + M("a") + " ?", a, M(N(a)) + "."), GR(M("f(" + N(x2) + ")") + " ?", v, M(N(v)) + ".")],
            traps: [TR(rnd(y1 * x2), "On passe d'abord par 1 " + c[1] + " : a = " + N(y1).replace("{,}", ",") + " ÷ " + N(x1).replace("{,}", ",") + "."), TR(rnd(y1 + x2 - x1), "C'est proportionnel : on multiplie par a.")] }); },
    ],
    3: [
      () => { const a = nz(-5, 6) * pk([1, 1.5]), p = R.int(2, 5), q = R.int(3, 7), r = R.int(6, 11), s = rnd(a * (p + q)); if (!a || p === q) return null;
        return QN("Pour une fonction linéaire " + M("f") + ", on sait que " + M("f(" + p + ") + f(" + q + ") = " + N(s)) + ". Calcule " + M("f(" + r + ")") + ".", rnd(a * r),
          M("f(" + p + ") + f(" + q + ") = " + p + "a + " + q + "a = " + (p + q) + "a = " + N(s)) + " : " + M("a = " + N(a)) + ". Donc " + M("f(" + r + ") = " + N(rnd(a * r))) + ". (Ou : " + M("f(" + p + ") + f(" + q + ") = f(" + (p + q) + ")") + ", propriété de linéarité.)",
          { ctx: "somme-images", guide: [GR(M("f(" + p + ") + f(" + q + ")") + " = combien de fois " + M("a") + " ?", p + q, M(p + q) + "."), GR(M("a") + " ?", a, M(N(a)) + "."), GR(M("f(" + r + ")") + " ?", rnd(a * r), M(N(rnd(a * r))) + ".")],
            traps: [TR(rnd((s / 2 / p) * r, 6), "f(" + p + ") et f(" + q + ") ne sont pas égales : écris-les avec a."), TR(rnd(s / (p + q)), "C'est a ; il reste à calculer f(" + r + ").")] }); },
      () => { const t1 = pk([10, 20, 25, 30, 50]), t2 = pk([10, 20, 25, 40]), up1 = R.rand() < 0.6, up2 = R.rand() < 0.4, k = rnd((1 + (up1 ? 1 : -1) * t1 / 100) * (1 + (up2 ? 1 : -1) * t2 / 100));
        if (Math.abs(k - 1) < 1e-9) return null;
        return QN("Un article " + (up1 ? "augmente" : "baisse") + " de " + M(t1 + "\\,\\%") + ", puis " + (up2 ? "augmente" : "baisse") + " de " + M(t2 + "\\,\\%") + ". Le prix final est " + M("f(x) = kx") + " où " + M("x") + " est le prix de départ. Que vaut " + M("k") + " ?", k,
          "On compose deux fonctions linéaires : " + M("k = " + N(rnd(1 + (up1 ? 1 : -1) * t1 / 100)) + X + N(rnd(1 + (up2 ? 1 : -1) * t2 / 100)) + " = " + N(k)) + " (évolution globale de " + M(N(rnd((k - 1) * 100)) + "\\,\\%") + ").",
          { ctx: "composition", guide: [GR("Premier coefficient ?", rnd(1 + (up1 ? 1 : -1) * t1 / 100), M(N(rnd(1 + (up1 ? 1 : -1) * t1 / 100))) + "."), GR("Second coefficient ?", rnd(1 + (up2 ? 1 : -1) * t2 / 100), M(N(rnd(1 + (up2 ? 1 : -1) * t2 / 100))) + "."), GR(M("k") + " ?", k, M(N(k)) + ".")],
            traps: [TR(rnd(1 + ((up1 ? 1 : -1) * t1 + (up2 ? 1 : -1) * t2) / 100), "Les pourcentages ne s'ajoutent pas : on multiplie les coefficients."), TR(rnd(((up1 ? 1 : -1) * t1 / 100) * ((up2 ? 1 : -1) * t2 / 100)), "On multiplie les coefficients 1 ± t/100, pas les taux.")] }); },
      () => { const a = pk([1.5, 2, 2.5, 3, 0.5]), b = pk([2, 3, 4]) * pk([1, -1]), c = pk([4, 6, 8, 10, 12, -6]), x = rnd(c / (a - b), 6); if (a === b || !Number.isInteger(x * 2)) return null;
        return QN("Soit la fonction linéaire " + M("f(x) = " + N(a) + "x") + " et la fonction affine " + M("g(x) = " + lin(b, c)) + ". Pour quelle valeur de " + M("x") + " a-t-on " + M("f(x) = g(x)") + " ?", x,
          M(N(a) + "x = " + lin(b, c)) + " : " + M(N(rnd(a - b)) + "x = " + N(c)) + ", " + M("x = " + N(x)) + ". Les deux droites se coupent au point d'abscisse " + M(N(x)) + ".",
          { ctx: "intersection", guide: [GX("Après avoir regroupé les " + M("x") + " à gauche : " + M("(\\dots)x = " + N(c)) + ". Que vaut le coefficient ?", String(rnd(a - b)), M(N(rnd(a - b))) + "."), GR(M("x") + " ?", x, M(N(x)) + ".")],
            traps: [TR(rnd(c / (a + b), 6), "En passant " + N(b).replace("{,}", ",") + "x à gauche, on change son signe."), TR(rnd(-c / (a - b), 6), "Attention au signe de " + c + ".")] }); },
    ],
  };

  // ======================= cos4e : cosinus dans le triangle rectangle (4e, attendus 2019) =======================
  const CS = {
    1: [
      () => { const h = pk([5, 6, 7, 8, 9, 10, 12, 15]), a = R.int(20, 70), v = h * Math.cos(rad(a));
        return QR("Le triangle " + M("ABC") + " est rectangle en " + M("B") + ", avec " + M("AC = " + h) + " cm et " + M("\\widehat{BAC} = " + a + "°") + ". Calcule " + M("AB") + " (au dixième de cm).", v, 0.1,
          M("[AB]") + " est le côté adjacent à " + M("\\widehat{A}") + " et " + M("[AC]") + " l'hypoténuse : " + M("\\cos \\widehat{A} = \\frac{AB}{AC}") + ", donc " + M("AB = " + h + X + "\\cos " + a + "° \\approx " + N(rnd(v, 1))) + " cm.",
          { ctx: "adjacent", guide: [GR("Valeur approchée de " + M("\\cos " + a + "°") + " (au millième) ?", Math.cos(rad(a)), M("\\approx " + N(rnd(Math.cos(rad(a)), 3))) + ".", 0.001), GR(M("AB") + " ?", v, M("\\approx " + N(rnd(v, 1))) + " cm.", 0.1)],
            traps: [TR(rnd(h / Math.cos(rad(a)), 1), "AB = AC × cos A : on multiplie (AC est l'hypoténuse)."), TR(rnd(h * Math.sin(rad(a)), 1), "Le cosinus utilise le côté adjacent, pas l'opposé.")] }); },
      () => { const adj = pk([4, 5, 6, 7, 8, 9, 12]), a = R.int(25, 65), v = adj / Math.cos(rad(a));
        return QR("Le triangle " + M("EFG") + " est rectangle en " + M("F") + ", avec " + M("EF = " + adj) + " cm et " + M("\\widehat{FEG} = " + a + "°") + ". Calcule l'hypoténuse " + M("EG") + " (au dixième de cm).", v, 0.1,
          M("\\cos \\widehat{E} = \\frac{EF}{EG}") + ", donc " + M("EG = \\frac{EF}{\\cos " + a + "°} = \\frac{" + adj + "}{\\cos " + a + "°} \\approx " + N(rnd(v, 1))) + " cm.",
          { ctx: "hypotenuse", guide: [GX("Écris " + M("\\cos \\widehat{E}") + " comme un quotient de longueurs : numérateur ? (tape EF ou EG)", "EF", M("\\frac{EF}{EG}") + " : adjacent sur hypoténuse."), GR(M("EG") + " ?", v, M("\\approx " + N(rnd(v, 1))) + " cm.", 0.1)],
            traps: [TR(rnd(adj * Math.cos(rad(a)), 1), "L'hypoténuse est le plus grand côté : on divise par cos A."), TR(rnd(adj / Math.sin(rad(a)), 1), "Cosinus, pas sinus.")] }); },
      () => { const [p, q] = pk([[3, 5], [4, 5], [5, 13], [12, 13], [8, 17], [15, 17], [7, 25], [6, 10]]), v = p / q;
        return QN("Le triangle " + M("RST") + " est rectangle en " + M("S") + ", avec " + M("RS = " + p) + " cm et " + M("RT = " + q) + " cm. Donne la valeur exacte de " + M("\\cos \\widehat{SRT}") + " (fraction ou décimal).", v,
          M("[RS]") + " est adjacent à l'angle " + M("\\widehat{R}") + " et " + M("[RT]") + " est l'hypoténuse : " + M("\\cos \\widehat{R} = \\frac{RS}{RT} = \\frac{" + p + "}{" + q + "}" + (FS(v).includes("/") && FS(v) !== p + "/" + q ? " = " + F(v) : "")) + ".",
          { ctx: "rapport", guide: [GR("Longueur de l'hypoténuse ?", q, M("RT = " + q) + " (en face de l'angle droit)."), GR(M("\\cos \\widehat{SRT}") + " ?", v, M(F(v)) + ".")],
            traps: [TR(q / p, "Cosinus = adjacent ÷ hypoténuse : il est inférieur à 1."), TR(rnd(Math.sqrt(q * q - p * p) / q), "C'est le côté adjacent RS qui compte, pas ST.")] }); },
    ],
    2: [
      () => { const [adj, h] = pk([[4, 7], [5, 8], [6, 9], [3, 8], [7, 10], [9, 12], [5, 11]]), v = deg(Math.acos(adj / h));
        return QR("Le triangle " + M("KLM") + " est rectangle en " + M("L") + ", avec " + M("KL = " + adj) + " cm et " + M("KM = " + h) + " cm. Calcule " + M("\\widehat{LKM}") + " (au degré près).", v, 1,
          M("\\cos \\widehat{K} = \\frac{KL}{KM} = \\frac{" + adj + "}{" + h + "}") + " ; à la calculatrice, " + M("\\widehat{K} = \\arccos\\left(\\frac{" + adj + "}{" + h + "}\\right) \\approx " + Math.round(v) + "°") + ".",
          { ctx: "angle", guide: [GR(M("\\cos \\widehat{K}") + " (au millième) ?", adj / h, M("\\frac{" + adj + "}{" + h + "} \\approx " + N(rnd(adj / h, 3))) + ".", 0.001), GR("Angle (touche arccos ou cos⁻¹) ?", v, M("\\approx " + Math.round(v) + "°") + ".", 1)],
            traps: [TR(Math.round(deg(Math.asin(adj / h))), "C'est l'arcsinus : avec l'adjacent et l'hypoténuse, on utilise arccos."), TR(Math.round(90 - v), "C'est l'autre angle aigu.")] }); },
      () => { const L = pk([3, 4, 4.5, 5, 6]), a = R.int(60, 80), v = L * Math.cos(rad(a));
        return QR("Une échelle de " + m_(L) + " est appuyée contre un mur vertical. Elle fait un angle de " + M(a + "°") + " avec le sol horizontal. À quelle distance du mur se trouve son pied (au centimètre près, en m) ?", v, 0.01,
          "Le mur, le sol et l'échelle forment un triangle rectangle ; l'échelle est l'hypoténuse et la distance au mur est adjacente à l'angle au sol : " + M("d = " + N(L) + X + "\\cos " + a + "° \\approx " + N(rnd(v, 2))) + " m.",
          { ctx: "echelle", guide: [GR("Longueur de l'hypoténuse (en m) ?", L, m_(L) + " : l'échelle."), GR("Distance (au cm) ?", v, M("\\approx " + N(rnd(v, 2))) + " m.", 0.01)],
            traps: [TR(rnd(L * Math.sin(rad(a)), 2), "C'est la hauteur atteinte sur le mur : la distance au mur est adjacente à l'angle au sol."), TR(rnd(L / Math.cos(rad(a)), 2), "L'échelle est l'hypoténuse : on multiplie par cos.")] }); },
      () => { const c = pk([["Un toboggan aquatique", "toboggan"], ["Une rampe d'accès pour fauteuil roulant", "rampe"], ["Un tapis roulant de gare", "tapis"]]), d = pk([6, 8, 10, 12, 15]), a = pk([5, 8, 10, 12, 15, 20]), v = d / Math.cos(rad(a));
        return QR(c[0] + " couvre une distance horizontale de " + m_(d) + " et fait un angle de " + M(a + "°") + " avec l'horizontale. Quelle est sa longueur (au centimètre près, en m) ?", v, 0.01,
          "La longueur est l'hypoténuse, la distance horizontale le côté adjacent : " + M("L = \\frac{" + d + "}{\\cos " + a + "°} \\approx " + N(rnd(v, 2))) + " m.",
          { ctx: c[1], guide: [GR(M("\\cos " + a + "°") + " (au millième) ?", Math.cos(rad(a)), M("\\approx " + N(rnd(Math.cos(rad(a)), 3))) + ".", 0.001), GR("Longueur (au cm) ?", v, M("\\approx " + N(rnd(v, 2))) + " m.", 0.01)],
            traps: [TR(rnd(d * Math.cos(rad(a)), 2), "La longueur est plus grande que la distance horizontale : on divise par cos."), TR(d, "La pente allonge la longueur.")] }); },
    ],
    3: [
      () => { const h = pk([10, 12, 13, 15, 17, 20]), a = R.int(30, 60), adj = h * Math.cos(rad(a)), opp = Math.sqrt(h * h - adj * adj);
        return QR("Le triangle " + M("ABC") + " est rectangle en " + M("C") + ", avec " + M("AB = " + h) + " cm et " + M("\\widehat{BAC} = " + a + "°") + ". Calcule " + M("AC") + " avec le cosinus, puis " + M("BC") + " avec le théorème de Pythagore. Donne " + M("BC") + " au dixième de cm.", opp, 0.1,
          M("AC = " + h + X + "\\cos " + a + "° \\approx " + N(rnd(adj, 2))) + " cm ; " + M("BC = \\sqrt{AB^2 - AC^2} \\approx " + N(rnd(opp, 1))) + " cm.",
          { ctx: "deux-etapes", guide: [GR(M("AC") + " (au centième) ?", adj, M("\\approx " + N(rnd(adj, 2))) + " cm.", 0.01), GR(M("BC") + " (au dixième) ?", opp, M("\\approx " + N(rnd(opp, 1))) + " cm.", 0.1)],
            traps: [TR(rnd(adj, 1), "C'est AC ; on demande BC (Pythagore ensuite)."), TR(rnd(Math.sqrt(h * h + adj * adj), 1), "AB est l'hypoténuse : BC² = AB² − AC².")] }); },
      () => { const b = pk([6, 8, 10, 12]), s = pk([5, 6, 7, 8, 9, 10]).valueOf(), side = Math.max(s, b / 2 + 1), v = deg(Math.acos(b / 2 / side));
        return QR("Le triangle " + M("ABC") + " est isocèle en " + M("A") + ", avec " + M("AB = AC = " + side) + " cm et " + M("BC = " + b) + " cm. Calcule l'angle " + M("\\widehat{ABC}") + " au degré près (trace la hauteur issue de " + M("A") + ").", v, 1,
          "La hauteur issue de " + M("A") + " coupe " + M("[BC]") + " en son milieu " + M("H") + " : " + M("BH = " + N(b / 2)) + ". Dans le triangle " + M("ABH") + " rectangle en " + M("H") + " : " + M("\\cos \\widehat{B} = \\frac{BH}{AB} = \\frac{" + N(b / 2) + "}{" + side + "}") + ", " + M("\\widehat{B} \\approx " + Math.round(v) + "°") + ".",
          { ctx: "isocele", guide: [GR(M("BH") + " ?", b / 2, M(N(b / 2)) + " cm (milieu de [BC])."), GR(M("\\widehat{ABC}") + " ?", v, M("\\approx " + Math.round(v) + "°") + ".", 1)],
            traps: [TR(Math.round(deg(Math.acos(Math.min(1, b / side)))), "La hauteur partage [BC] en deux : BH = " + b / 2 + "."), TR(Math.round(180 - 2 * v), "C'est l'angle au sommet A.")] }); },
      () => { const h = pk([8, 10, 12, 15]), a = R.int(25, 65), v = h * Math.cos(rad(a)), w = h * Math.sin(rad(a)), nm = pk(["Lina", "Yanis", "Inès", "Noé"]);
        return QR("Dans le triangle " + M("PQR") + " rectangle en " + M("Q") + ", " + M("PR = " + h) + " cm et " + M("\\widehat{QPR} = " + a + "°") + ". " + nm + " écrit : « " + M("\\cos \\widehat{P} = \\frac{QR}{PR}") + ", donc " + M("QR = " + h + X + "\\cos " + a + "°") + " ». Trouve l'erreur, puis calcule " + M("PQ") + " au dixième de cm.", v, 0.1,
          "Le côté adjacent à " + M("\\widehat{P}") + " est " + M("[PQ]") + ", pas " + M("[QR]") + " (opposé) : " + M("\\cos \\widehat{P} = \\frac{PQ}{PR}") + ", " + M("PQ = " + h + X + "\\cos " + a + "° \\approx " + N(rnd(v, 1))) + " cm.",
          { ctx: "erreur", guide: [GX("Quel côté est adjacent à l'angle " + M("\\widehat{P}") + " ? (tape PQ ou QR)", "PQ", M("[PQ]") + " : il touche P et n'est pas l'hypoténuse."), GR(M("PQ") + " ?", v, M("\\approx " + N(rnd(v, 1))) + " cm.", 0.1)],
            traps: [TR(rnd(w, 1), "C'est QR (le côté opposé)."), TR(rnd(h / Math.cos(rad(a)), 1), "PQ = PR × cos P.")] }); },
    ],
  };

  // ======================= thales4e : Thalès dans des triangles emboîtés (4e, attendus 2019) =======================
  /* 26.11 (revue élèves, thales-3-q7c) : AB, AC, BC tirés séparément pouvaient former un triangle impossible ; tirage refait
     jusqu'à l'inégalité triangulaire stricte. */
  const tri = () => { for (;;) { const k = pk([[1, 2], [1, 3], [2, 3], [3, 4], [2, 5], [3, 5], [1, 4]]), q = k[0] / k[1], u = pk([1, 1.5, 2, 2.5, 3]), t = { q, k, AB: rnd(k[1] * u * pk([2, 3, 4])), AC: rnd(k[1] * u * pk([2, 3, 5])), BC: rnd(k[1] * pk([2, 3, 4, 5])) };
    if (t.BC < t.AB + t.AC && t.AB < t.AC + t.BC && t.AC < t.AB + t.BC) return t; } };
  const cfg = "Dans le triangle " + M("ABC") + ", " + M("M \\in [AB]") + ", " + M("N \\in [AC]") + " et " + M("(MN) \\parallel (BC)") + ". ";
  const TH = {
    1: [
      () => { const t = tri(), AM = rnd(t.q * t.AB), v = rnd(t.q * t.BC);
        return QN(cfg + "On sait que " + M("AM = " + N(AM)) + " cm, " + M("AB = " + N(t.AB)) + " cm et " + M("BC = " + N(t.BC)) + " cm. Calcule " + M("MN") + ".", v,
          "D'après le théorème de Thalès, " + M("\\frac{AM}{AB} = \\frac{AN}{AC} = \\frac{MN}{BC}") + ". Donc " + M("MN = BC" + X + "\\frac{AM}{AB} = " + N(t.BC) + X + "\\frac{" + N(AM) + "}{" + N(t.AB) + "} = " + N(v)) + " cm.",
          { ctx: "MN", guide: [GR("Rapport " + M("\\frac{AM}{AB}") + " ?", t.q, M(F(t.q)) + "."), GR(M("MN") + " ?", v, M(N(v)) + " cm.")],
            traps: [TR(rnd(t.BC / t.q), "Le petit triangle est une réduction : MN < BC."), TR(rnd(t.BC * (1 - t.q)), "Le rapport est AM/AB, pas MB/AB.")] }); },
      () => { const t = tri(), AM = rnd(t.q * t.AB), v = rnd(t.q * t.AC);
        return QN(cfg + "On sait que " + M("AM = " + N(AM)) + " cm, " + M("AB = " + N(t.AB)) + " cm et " + M("AC = " + N(t.AC)) + " cm. Calcule " + M("AN") + ".", v,
          M("\\frac{AN}{AC} = \\frac{AM}{AB}") + " (Thalès), donc " + M("AN = " + N(t.AC) + X + "\\frac{" + N(AM) + "}{" + N(t.AB) + "} = " + N(v)) + " cm.",
          { ctx: "AN", guide: [GR(M("\\frac{AM}{AB}") + " ?", t.q, M(F(t.q)) + "."), GR(M("AN") + " ?", v, M(N(v)) + " cm.")],
            traps: [TR(rnd(t.AC / t.q), "AN est plus petit que AC."), TR(rnd(t.AC - v), "C'est NC = AC − AN : on demande AN.")] }); },
      () => { const t = tri(), AM = rnd(t.q * t.AB);
        return QN(cfg + "On sait que " + M("AM = " + N(AM)) + " cm et " + M("AB = " + N(t.AB)) + " cm. Par quel nombre faut-il multiplier les longueurs du triangle " + M("ABC") + " pour obtenir celles du triangle " + M("AMN") + " (fraction acceptée) ?", t.q,
          "Le triangle " + M("AMN") + " est une réduction de " + M("ABC") + " de rapport " + M("\\frac{AM}{AB} = \\frac{" + N(AM) + "}{" + N(t.AB) + "} = " + F(t.q)) + ".",
          { ctx: "rapport", guide: [GR(M("\\frac{AM}{AB}") + " ?", t.q, M(F(t.q)) + ".")],
            traps: [TR(rnd(1 / t.q, 6), "On passe du grand au petit triangle : le rapport est inférieur à 1."), TR(rnd(1 - t.q, 6), "Le rapport est AM/AB.")] }); },
    ],
    2: [
      () => { const t = tri(), AM = rnd(t.q * t.AB), MB = rnd(t.AB - AM), v = rnd(t.q * t.BC);
        return QN(cfg + "On sait que " + M("AM = " + N(AM)) + " cm, " + M("MB = " + N(MB)) + " cm et " + M("BC = " + N(t.BC)) + " cm. Calcule " + M("MN") + ".", v,
          M("AB = AM + MB = " + N(t.AB)) + " cm ; " + M("MN = BC" + X + "\\frac{AM}{AB} = " + N(t.BC) + X + "\\frac{" + N(AM) + "}{" + N(t.AB) + "} = " + N(v)) + " cm.",
          { ctx: "MB", guide: [GR(M("AB") + " ?", t.AB, M(N(t.AB)) + " cm."), GR(M("MN") + " ?", v, M(N(v)) + " cm.")],
            traps: [TR(rnd(t.BC * AM / MB), "Le rapport de Thalès est AM/AB, pas AM/MB."), TR(rnd(t.BC * MB / t.AB), "C'est MB/AB : prends AM/AB.")] }); },
      () => { const t = tri(), AM = rnd(t.q * t.AB), AN = rnd(t.q * t.AC), v = rnd(t.AC - AN);
        return QN(cfg + "On sait que " + M("AM = " + N(AM)) + " cm, " + M("AB = " + N(t.AB)) + " cm et " + M("AN = " + N(AN)) + " cm. Calcule " + M("NC") + ".", v,
          M("\\frac{AN}{AC} = \\frac{AM}{AB}") + " donne " + M("AC = AN" + X + "\\frac{AB}{AM} = " + N(t.AC)) + " cm, puis " + M("NC = AC - AN = " + N(v)) + " cm.",
          { ctx: "NC", guide: [GR(M("AC") + " ?", t.AC, M(N(t.AC)) + " cm."), GR(M("NC") + " ?", v, M(N(v)) + " cm.")],
            traps: [TR(t.AC, "C'est AC ; on demande NC = AC − AN."), TR(rnd(AN * t.q), "AC = AN × AB / AM (le grand côté est au dénominateur du rapport).")] }); },
      () => { const c = pk([["Sur la charpente d'un toit, une entretoise horizontale", "entretoise", "charpente"], ["Sur une échelle double, une barre de sécurité horizontale", "barre", "echelle-double"], ["Dans un chevalet de peintre, une traverse", "traverse", "chevalet"]]);
        const base = pk([1.2, 1.5, 1.8, 2, 2.4]), L = pk([2, 2.5, 3]), d = pk([0.5, 0.8, 1, 1.2]), v = rnd((base * d) / L, 4); if (d >= L) return null;
        return QR(c[0] + " relie deux montants de " + m_(L) + " de long, à " + m_(d) + " du sommet, parallèlement au sol. Les pieds des montants sont écartés de " + m_(base) + ". Quelle est la longueur de " + (/^[aeioué]/.test(c[1]) ? "l'" : "la ") + c[1] + " (au centimètre près, en m) ?", v, 0.01,
          "Triangles emboîtés au sommet, côtés parallèles : " + M("\\frac{\\ell}{" + N(base) + "} = \\frac{" + N(d) + "}{" + N(L) + "}") + ", donc " + M("\\ell = " + N(base) + X + "\\frac{" + N(d) + "}{" + N(L) + "} \\approx " + N(rnd(v, 2))) + " m.",
          { ctx: c[2], guide: [GR("Rapport de réduction " + M("\\frac{" + N(d) + "}{" + N(L) + "}") + " ?", d / L, M(F(d / L)) + "."), GR("Longueur (au cm) ?", v, M("\\approx " + N(rnd(v, 2))) + " m.", 0.01)],
            traps: [TR(rnd(base * (L - d) / L, 2), "La distance au sommet est " + N(d).replace("{,}", ",") + " m : le rapport est " + N(d).replace("{,}", ",") + "/" + N(L).replace("{,}", ",") + "."), TR(rnd(base * L / d, 2), "La traverse est plus courte que l'écart au sol.")] }); },
    ],
    3: [
      () => { const t = tri(), AM = rnd(t.q * t.AB), AN = rnd(t.q * t.AC), MN = rnd(t.q * t.BC), v = rnd(MN + (t.AC - AN) + t.BC + (t.AB - AM));
        return QN(cfg + "On sait que " + M("AM = " + N(AM)) + ", " + M("AB = " + N(t.AB)) + ", " + M("AN = " + N(AN)) + " et " + M("MN = " + N(MN)) + " (en cm). Calcule le périmètre du trapèze " + M("MNCB") + ".", v,
          "Rapport " + M("\\frac{AM}{AB} = " + F(t.q)) + " : " + M("BC = \\frac{MN}{" + F(t.q) + "} = " + N(t.BC)) + ", " + M("AC = " + N(t.AC)) + ". Périmètre " + M("= MN + NC + CB + BM = " + N(MN) + " + " + N(rnd(t.AC - AN)) + " + " + N(t.BC) + " + " + N(rnd(t.AB - AM)) + " = " + N(v)) + " cm.",
          { ctx: "perimetre", guide: [GR(M("BC") + " ?", t.BC, M(N(t.BC)) + " cm."), GR(M("NC") + " ?", rnd(t.AC - AN), M(N(rnd(t.AC - AN))) + " cm."), GR("Périmètre ?", v, M(N(v)) + " cm.")],
            traps: [TR(rnd(t.AB + t.AC + t.BC), "C'est le périmètre de ABC ; le trapèze est MNCB."), TR(rnd(MN + t.AC + t.BC + t.AB), "NC = AC − AN et BM = AB − AM.")] }); },
      () => { const k = pk([2, 3, 4]), x = pk([2, 3, 4, 5, 6]), MB = rnd(x * (k - 1)), AN = pk([3, 4, 5, 6]), NC = rnd(AN * (k - 1));
        return QN(cfg + "On sait que " + M("AM = x") + ", " + M("MB = " + N(MB)) + ", " + M("AN = " + N(AN)) + " et " + M("NC = " + N(NC)) + " (en cm). Que vaut " + M("x") + " ?", x,
          M("\\frac{AM}{AB} = \\frac{AN}{AC}") + " : " + M("\\frac{x}{x + " + N(MB) + "} = \\frac{" + N(AN) + "}{" + N(AN + NC) + "}") + ". Produit en croix : " + M(N(AN + NC) + "x = " + N(AN) + "x + " + N(AN * MB)) + ", " + M("x = " + N(x)) + ".",
          { ctx: "equation", guide: [GR("Rapport " + M("\\frac{AN}{AC}") + " ?", AN / (AN + NC), M("\\frac{" + AN + "}{" + (AN + NC) + "} = " + F(AN / (AN + NC))) + "."), GR(M("x") + " ?", x, M(N(x)) + ".")],
            traps: [TR(rnd(MB * AN / (AN + NC)), "AB = x + " + MB + " : x est aussi dans AB."), TR(rnd(MB * (AN + NC) / AN), "Écris AM/AB = AN/AC avec AM = x et AB = x + " + MB + ".")] }); },
      () => { const t = tri(), AM = rnd(t.q * t.AB), MB = rnd(t.AB - AM), v = rnd(t.q * t.BC), wrong = rnd((AM / MB) * t.BC), nm = pk(["Lina", "Sam", "Inès", "Noé"]);
        if (Math.abs(wrong - v) < 1e-9) return null;
        return QN(cfg + "On sait que " + M("AM = " + N(AM)) + ", " + M("MB = " + N(MB)) + " et " + M("BC = " + N(t.BC)) + " (en cm). " + nm + " écrit : « " + M("\\frac{AM}{MB} = \\frac{MN}{BC}") + ", donc " + M("MN = " + N(wrong)) + " ». Trouve l'erreur, puis calcule " + M("MN") + ".", v,
          "Les rapports de Thalès comparent le petit triangle " + M("AMN") + " au grand " + M("ABC") + " : " + M("\\frac{AM}{AB}") + ", pas " + M("\\frac{AM}{MB}") + ". " + M("MN = " + N(t.BC) + X + "\\frac{" + N(AM) + "}{" + N(t.AB) + "} = " + N(v)) + " cm.",
          { ctx: "erreur", guide: [GR(M("AB") + " ?", t.AB, M(N(t.AB)) + " cm."), GR(M("MN") + " ?", v, M(N(v)) + " cm.")],
            traps: [TR(wrong, "C'est l'erreur de " + nm + " : le rapport est AM/AB.")] }); },
    ],
  };

  // ======================= autodnb : automatismes de la partie 1 du DNB (3e, sans calculatrice) =======================
  const SC = "Sans calculatrice : ";
  const fr = (n, d) => { const g = g2(n, d) || 1; n /= g; d /= g; return d === 1 ? N(n) : (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
  const AD = {
    1: [
      () => { const [a, b] = pk([[2, 3], [3, 4], [1, 6], [5, 6], [3, 8], [2, 5]]), [c, d] = pk([[5, 6], [1, 4], [2, 9], [3, 10], [1, 12]]), [e, f] = pk([[3, 5], [2, 3], [4, 3], [6, 5], [3, 2]]), v = a / b + (c / d) * (e / f);
        { const dv = FRX.den(v); if (!dv || dv > 60) return null; }
        return QN(SC + "calcule " + M(fr(a, b) + " + " + fr(c, d) + X + fr(e, f)) + ". Donne le résultat sous forme de fraction irréductible.", v,
          "La multiplication d'abord : " + M(fr(c, d) + X + fr(e, f) + " = " + F((c * e) / (d * f))) + ", puis " + M(fr(a, b) + " + " + F((c * e) / (d * f)) + " = " + F(v)) + ".",
          { ctx: "fractions", guide: [GR("Produit " + M(fr(c, d) + X + fr(e, f)) + " ?", (c * e) / (d * f), M(F((c * e) / (d * f))) + "."), GR("Résultat ?", v, M(F(v)) + ".")],
            traps: [TR((a / b + c / d) * (e / f), "La multiplication est prioritaire sur l'addition."), TR((a + c) / (b + d) * (e / f) + 0, "On n'additionne pas les dénominateurs.")] }); },
      () => { const a = pk([2, 3, 4, 5, 6, 8]), b = pk([2, 3, 4, 5, 1.5, 2.5]), p = R.int(3, 7), q = -R.int(1, 5), v = rnd(a * b * 10 ** (p + q));
        return QN(SC + "donne l'écriture décimale de " + M(N(a) + " \\times 10^{" + p + "} \\times " + N(b) + " \\times 10^{" + q + "}") + ".", v,
          M(N(a) + X + N(b) + " = " + N(rnd(a * b))) + " et " + M("10^{" + p + "} \\times 10^{" + q + "} = 10^{" + (p + q) + "}") + " : " + M(N(rnd(a * b)) + " \\times 10^{" + (p + q) + "} = " + N(v)) + ".",
          { ctx: "puissances", guide: [GR(M("10^{" + p + "} \\times 10^{" + q + "} = 10^{n}") + " : " + M("n") + " ?", p + q, M(p + q) + " (on ajoute les exposants)."), GR("Écriture décimale ?", v, M(N(v)) + ".")],
            traps: [TR(rnd(a * b * 10 ** (p * q)), "10ᵖ × 10^q = 10^(p+q) : on ajoute les exposants."), TR(rnd((a + b) * 10 ** (p + q)), "On multiplie " + a + " par " + N(b).replace("{,}", ",") + ".")] }); },
      () => { const x = pk([40, 60, 80, 120, 150, 200, 250]), t = pk([5, 10, 15, 20, 25, 30]), up = R.rand() < 0.6, v = rnd(x * (1 + (up ? 1 : -1) * t / 100)), c = pk(["Un vélo", "Un forfait de téléphone", "Un billet de concert", "Une paire de chaussures"]);
        return QN(SC + c.toLowerCase() + " coûte " + EUR(x) + ". Son prix " + (up ? "augmente" : "baisse") + " de " + M(t + "\\,\\%") + ". Quel est son nouveau prix (en €) ?", v,
          M(t + "\\,\\%") + " de " + M(x) + " : " + M(N(rnd((x * t) / 100))) + ". Nouveau prix : " + M(x + (up ? " + " : " - ") + N(rnd((x * t) / 100)) + " = " + N(v)) + " € (ou " + M(x + X + N(rnd(1 + (up ? 1 : -1) * t / 100)) + ")") + ".",
          { ctx: "evolution", guide: [GR(M(t + "\\,\\%") + " de " + M(x) + " ?", rnd((x * t) / 100), M(N(rnd((x * t) / 100))) + "."), GR("Nouveau prix ?", v, EUR(v) + ".")],
            traps: [TR(rnd((x * t) / 100), "C'est la " + (up ? "hausse" : "baisse") + " : il reste à l'" + (up ? "ajouter" : "enlever") + "."), TR(x + (up ? t : -t), "Un pourcentage s'applique au prix : " + t + " % de " + x + ".")] }); },
      () => { const [a, b, c] = pk([[6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20], [7, 24, 25]]), hyp = R.rand() < 0.6;
        return QN(SC + "le triangle " + M("ABC") + " est rectangle en " + M("A") + ", " + (hyp ? M("AB = " + a) + " cm et " + M("AC = " + b) + " cm. Calcule " + M("BC") : M("AB = " + a) + " cm et " + M("BC = " + c) + " cm. Calcule " + M("AC")) + " (en cm).", hyp ? c : b,
          "Pythagore : " + (hyp ? M("BC^2 = " + a + "^2 + " + b + "^2 = " + (a * a + b * b)) + ", " + M("BC = " + c) : M("AC^2 = " + c + "^2 - " + a + "^2 = " + (c * c - a * a)) + ", " + M("AC = " + b)) + " cm.",
          { ctx: "pythagore", guide: [GR((hyp ? M("BC^2") : M("AC^2")) + " ?", hyp ? c * c : b * b, M(hyp ? c * c : b * b) + "."), GR("Longueur ?", hyp ? c : b, M(hyp ? c : b) + " cm.")],
            traps: [TR(hyp ? a + b : c - a, "Pythagore porte sur les carrés des longueurs."), TR(hyp ? Math.round(Math.sqrt(Math.abs(b * b - a * a)) * 100) / 100 : Math.round(Math.sqrt(c * c + a * a) * 100) / 100, "L'hypoténuse est le côté opposé à l'angle droit : " + (hyp ? "BC." : "BC est connu."))] }); },
    ],
    2: [
      () => { const a = pk([2, 3, 5]), b = nz(-7, 7), e = (a * a) + "*x^2" + (b < 0 ? "-" : "+") + Math.abs(2 * a * b) + "*x+" + b * b;
        return QX(SC + "développe et réduis " + M("(" + lin(a, b) + ")^2") + ".", e, M("(" + lin(a, b) + ")^2 = " + N(a * a) + "x^2" + sg(2 * a * b) + "x + " + N(b * b)) + " (identité " + M(b > 0 ? "(u + v)^2 = u^2 + 2uv + v^2" : "(u - v)^2 = u^2 - 2uv + v^2") + ").",
          { ctx: "developper", guide: [GR("Coefficient de " + M("x^2") + " ?", a * a, M(N(a * a)) + "."), GR("Coefficient de " + M("x") + " (double produit) ?", 2 * a * b, M(N(2 * a * b)) + "."), GX("Résultat ?", e, M(N(a * a) + "x^2" + sg(2 * a * b) + "x + " + N(b * b)) + ".")],
            traps: [TX((a * a) + "*x^2+" + b * b, "N'oublie pas le double produit 2uv."), TX(a + "*x^2+" + (2 * a * b) + "*x+" + b * b, "(" + a + "x)² = " + a * a + "x²."), TX((a * a) + "*x^2+" + (a * b) + "*x+" + b * b, "Le double produit vaut 2 × " + a + "x × " + b + ".")] }); },
      () => { const m = pk([50, 100, 200, 30, 70]), d = pk([1, 2, 3]), v = 4 * m * d;
        return QN(SC + "calcule " + M((m + d) + "^2 - " + (m - d) + "^2") + ".", v,
          M("a^2 - b^2 = (a - b)(a + b)") + " : " + M("(" + (m + d) + " - " + (m - d) + ")(" + (m + d) + " + " + (m - d) + ") = " + 2 * d + X + 2 * m + " = " + N(v)) + ".",
          { ctx: "identite", guide: [GR(M((m + d) + " - " + (m - d)) + " ?", 2 * d, M(2 * d) + "."), GR(M((m + d) + " + " + (m - d)) + " ?", 2 * m, M(2 * m) + "."), GR("Résultat ?", v, M(N(v)) + ".")],
            traps: [TR((2 * d) ** 2, "a² − b² n'est pas (a − b)²."), TR(2 * d, "a² − b² = (a − b)(a + b) : il manque le facteur a + b.")] }); },
      () => { const r = R.int(2, 7), b = R.int(2, 7), g = R.int(1, 6), n = r + b + g, which = pk([["ne soit pas bleue", r + g], ["soit rouge ou verte", r + g], ["ne soit pas rouge", b + g]]), v = which[1] / n;
        return QN(SC + "un sac contient " + r + " boules rouges, " + b + " bleues et " + g + " vertes, indiscernables au toucher. On tire une boule au hasard. Quelle est la probabilité qu'elle " + which[0] + " ? (fraction irréductible)", v,
          "Il y a " + M(n) + " boules en tout, dont " + M(which[1]) + " favorables : " + M("P = \\frac{" + which[1] + "}{" + n + "}" + (FS(v) !== which[1] + "/" + n ? " = " + F(v) : "")) + ".",
          { ctx: "proba", guide: [GR("Nombre total de boules ?", n, M(n) + "."), GR("Probabilité ?", v, M(F(v)) + ".")],
            traps: [TR(1 - v, "C'est la probabilité de l'évènement contraire."), TR(which[1] / (n - which[1]), "On divise par le nombre total de boules.")] }); },
      () => { const a = pk([3, 4, 5, 6]), b = pk([2, 3, 4]), c = pk([1, 2]), x = nz(-5, 8), d = a * (x - b) - c * x; if (a === c) return null;
        return QN(SC + "résous l'équation " + M(N(a) + "(x - " + b + ") = " + (c === 1 ? "" : c) + "x" + sg(d)) + ".", x,
          M(N(a) + "x - " + a * b + " = " + (c === 1 ? "" : c) + "x" + sg(d)) + ", " + M(N(a - c) + "x = " + N(d + a * b)) + ", " + M("x = " + N(x)) + ".",
          { ctx: "equation", guide: [GX("Développe le membre de gauche.", a + "*x-" + a * b, M(N(a) + "x - " + a * b) + "."), GR(M("x") + " ?", x, M(N(x)) + ".")],
            traps: [TR((d + b) / (a - c), "Le " + a + " multiplie aussi le " + b + "."), TR((d + a * b) / (a + c), "En passant " + c + "x à gauche, on le soustrait.")] }); },
    ],
    3: [
      () => { const [a, b] = pk([[2, 3], [3, 4], [3, 2], [4, 5], [5, 3]]), [c, d] = pk([[9, 4], [16, 9], [4, 9], [25, 16], [9, 25]]), [e, f] = pk([[1, 2], [1, 3], [5, 6], [3, 4]]), v = (a * a) / (b * b) * (c / d) - e / f;
        { const dv = FRX.den(v); if (!dv || dv > 40 || Math.abs(v) < 1e-9) return null; }
        return QN(SC + "calcule " + M("\\left(" + fr(a, b) + "\\right)^2" + X + fr(c, d) + " - " + fr(e, f)) + ". Donne le résultat sous forme de fraction irréductible.", v,
          M("\\left(" + fr(a, b) + "\\right)^2 = " + fr(a * a, b * b)) + ", " + M(fr(a * a, b * b) + X + fr(c, d) + " = " + F((a * a * c) / (b * b * d))) + ", puis " + M(F((a * a * c) / (b * b * d)) + " - " + fr(e, f) + " = " + F(v)) + ".",
          { ctx: "fractions-puissances", guide: [GR(M("\\left(" + fr(a, b) + "\\right)^2") + " ?", (a * a) / (b * b), M(fr(a * a, b * b)) + "."), GR("Produit ?", (a * a * c) / (b * b * d), M(F((a * a * c) / (b * b * d))) + "."), GR("Résultat ?", v, M(F(v)) + ".")],
            traps: [TR((2 * a) / b * (c / d) - e / f, "Le carré n'est pas le double : (a/b)² = a²/b²."), TR((a * a) / (b * b) * (c / d - e / f), "Puissance, puis multiplication, puis soustraction.")] }); },
      () => { const t1 = pk([10, 20, 25, 50]), t2 = pk([10, 20, 30, 40]), d1 = pk([1, -1]), d2 = pk([1, 1, -1]), k = (1 + (d1 * t1) / 100) * (1 + (d2 * t2) / 100), v = rnd((k - 1) * 100, 6);
        if (Math.abs(v) < 1e-9 || !Number.isInteger(v * 2)) return null;
        return QN(SC + "un prix " + (d1 > 0 ? "augmente" : "baisse") + " de " + M(t1 + "\\,\\%") + " puis " + (d2 > 0 ? "augmente" : "baisse") + " de " + M(t2 + "\\,\\%") + ". Quel est le taux d'évolution global, en % ? (négatif pour une baisse)", v,
          "Coefficients : " + M(N(rnd(1 + (d1 * t1) / 100)) + X + N(rnd(1 + (d2 * t2) / 100)) + " = " + N(rnd(k))) + ", soit une évolution de " + M(N(v) + "\\,\\%") + ".",
          { ctx: "evolutions", guide: [GR("Coefficient global ?", rnd(k), M(N(rnd(k))) + "."), GR("Taux global (%) ?", v, M(N(v)) + ".")],
            traps: [TR(d1 * t1 + d2 * t2, "Les pourcentages ne s'ajoutent pas : on multiplie les coefficients."), TR(rnd(k), "Le coefficient " + N(rnd(k)).replace("{,}", ",") + " correspond à " + N(v).replace("{,}", ",") + " %.")] }); },
      () => { const [dist, mins] = pk([[45, 36], [30, 24], [12, 15], [60, 45], [90, 72], [25, 20], [18, 12]]), v = dist / (mins / 60), c = pk(["Un cycliste", "Un bus", "Une coureuse de trail", "Un TER"]);
        return QN(SC + c.toLowerCase() + " parcourt " + M(dist + "\\ \\text{km}") + " en " + M(mins + "\\ \\text{min}") + ". Quelle est sa vitesse moyenne en km/h ?", v,
          M(mins + "\\ \\text{min} = \\frac{" + mins + "}{60}\\ \\text{h} = " + N(mins / 60) + "\\ \\text{h}") + " ; " + M("v = \\frac{" + dist + "}{" + N(mins / 60) + "} = " + N(v)) + " km/h.",
          { ctx: "vitesse", guide: [GR("Durée en heures ?", mins / 60, M(N(mins / 60)) + " h."), GR("Vitesse (km/h) ?", v, M(N(v)) + " km/h.")],
            traps: [TR(rnd(dist / mins, 6), "La durée doit être en heures."), TR(rnd(dist / (mins / 100), 6), "1 h = 60 min, pas 100 min.")] }); },
      () => { const a = pk([1, 2, -1, 3]), b = nz(-5, 5), x = pk([-2, -3, -4, -5, 3, 4]), v = a * x * x + b * x; if (!v) return null;
        return QN(SC + "soit " + M("f(x) = " + (a === 1 ? "" : a === -1 ? "-" : a) + "x^2" + sg(b) + "x") + ". Calcule l'image de " + M(N(x)) + " par " + M("f") + ".", v,
          M("f(" + N(x) + ") = " + (a === 1 ? "" : a === -1 ? "-" : a + X) + NP(x) + "^2" + sg(b) + X + NP(x) + " = " + (a === 1 ? "" : a === -1 ? "-" : a + X) + x * x + sg(b * x) + " = " + N(v)) + ".",
          { ctx: "image", guide: [GR(M(NP(x) + "^2") + " ?", x * x, M(x * x) + " (un carré est positif)."), GR(M("f(" + N(x) + ")") + " ?", v, M(N(v)) + ".")],
            traps: [TR(-a * x * x + b * x, NP(x).replace(/[()]/g, "") + "² = " + x * x + " : le carré d'un négatif est positif."), TR(a * 2 * x + b * x, "x² n'est pas 2x.")] }); },
    ],
  };

  // ======================= vecgeo : translations et vecteurs (programme 2026 de 3e) =======================
  const PT = (x, y) => M("(" + N(x) + " \\,;\\, " + N(y) + ")");
  const VG = {
    1: [
      () => { const A = [nz(-5, 5), nz(-5, 5)], B = [nz(-6, 6), nz(-6, 6)], C = [nz(-5, 5), nz(-5, 5)], D = [C[0] + B[0] - A[0], C[1] + B[1] - A[1]]; if (B[0] === A[0] && B[1] === A[1]) return null;
        return QP("Dans un repère, " + M("A") + PT(...A) + ", " + M("B") + PT(...B) + " et " + M("C") + PT(...C) + ". La translation qui transforme " + M("A") + " en " + M("B") + " transforme " + M("C") + " en " + M("D") + ". Donne les coordonnées de " + M("D") + ". Réponds « x ; y ».", D,
          "Pour aller de " + M("A") + " à " + M("B") + ", on se déplace de " + M(N(B[0] - A[0])) + " en abscisse et de " + M(N(B[1] - A[1])) + " en ordonnée. On fait le même déplacement depuis " + M("C") + " : " + M("D") + PT(...D) + ". " + M("ABDC") + " est un parallélogramme.",
          { ctx: "translation", guide: [GP("Déplacement de " + M("A") + " à " + M("B") + " (abscisse ; ordonnée) ?", [B[0] - A[0], B[1] - A[1]], PT(B[0] - A[0], B[1] - A[1]) + "."), GP(M("D") + " ?", D, PT(...D) + ".")],
            traps: [{ spec: { kind: "pair", values: [C[0] - B[0] + A[0], C[1] - B[1] + A[1]] }, m: "Le déplacement va de A vers B (pas de B vers A)." }, { spec: { kind: "pair", values: [B[0] - A[0], B[1] - A[1]] }, m: "C'est le déplacement : ajoute-le aux coordonnées de C." }] }); },
      () => { const A = [nz(-5, 5), nz(-5, 5)], B = [nz(-5, 5), nz(-5, 5)], C = [nz(-5, 5), nz(-5, 5)], D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]]; if ((A[0] - B[0]) * (C[1] - B[1]) === (A[1] - B[1]) * (C[0] - B[0])) return null;
        return QP("Dans un repère, " + M("A") + PT(...A) + ", " + M("B") + PT(...B) + " et " + M("C") + PT(...C) + ". Donne les coordonnées du point " + M("D") + " tel que " + M("ABCD") + " soit un parallélogramme (sommets dans cet ordre). Réponds « x ; y ».", D,
          M("ABCD") + " est un parallélogramme si " + M("\\overrightarrow{AD} = \\overrightarrow{BC}") + " : le déplacement de " + M("B") + " à " + M("C") + " est " + PT(C[0] - B[0], C[1] - B[1]) + ", qu'on applique à " + M("A") + " : " + M("D") + PT(...D) + ".",
          { ctx: "parallelogramme", guide: [GP("Coordonnées de " + M("\\overrightarrow{BC}") + " (déplacement de B à C) ?", [C[0] - B[0], C[1] - B[1]], PT(C[0] - B[0], C[1] - B[1]) + "."), GP(M("D") + " ?", D, PT(...D) + ".")],
            traps: [{ spec: { kind: "pair", values: [B[0] + C[0] - A[0], B[1] + C[1] - A[1]] }, m: "L'ordre des sommets compte : ABCD, donc AD = BC." }, { spec: { kind: "pair", values: [A[0] + B[0] - C[0], A[1] + B[1] - C[1]] }, m: "ABCD : D est en face de B, AD = BC." }] }); },
      () => { const A = [nz(-5, 5), nz(-5, 5)], u = [nz(-5, 5), nz(-5, 5)], B = [A[0] + u[0], A[1] + u[1]];
        return QP("Le vecteur " + M("\\overrightarrow{AB}") + " a pour coordonnées " + PT(...u) + " et " + M("A") + PT(...A) + ". Donne les coordonnées de " + M("B") + ". Réponds « x ; y ».", B,
          M("x_B = x_A + " + NP(u[0]) + " = " + N(B[0])) + " et " + M("y_B = y_A + " + NP(u[1]) + " = " + N(B[1])) + ".",
          { ctx: "extremite", guide: [GR(M("x_B") + " ?", B[0], M(N(B[0])) + "."), GR(M("y_B") + " ?", B[1], M(N(B[1])) + "."), GP(M("B") + " ?", B, PT(...B) + ".")],
            traps: [{ spec: { kind: "pair", values: [A[0] - u[0], A[1] - u[1]] }, m: "AB va de A vers B : on ajoute ses coordonnées à celles de A." }, { spec: { kind: "pair", values: u }, m: "Ce sont les coordonnées du vecteur, pas du point B." }] }); },
    ],
    2: [
      () => { const A = [nz(-4, 4), nz(-4, 4)], B = [nz(-4, 4), nz(-4, 4)], C = [nz(-4, 4), nz(-4, 4)], D = [nz(-4, 4), nz(-4, 4)], s = [B[0] - A[0] + D[0] - C[0], B[1] - A[1] + D[1] - C[1]];
        return QP("Dans un repère, " + M("A") + PT(...A) + ", " + M("B") + PT(...B) + ", " + M("C") + PT(...C) + " et " + M("D") + PT(...D) + ". Donne les coordonnées du vecteur " + M("\\overrightarrow{AB} + \\overrightarrow{CD}") + ". Réponds « x ; y ».", s,
          M("\\overrightarrow{AB}") + PT(B[0] - A[0], B[1] - A[1]) + " et " + M("\\overrightarrow{CD}") + PT(D[0] - C[0], D[1] - C[1]) + " : la somme a pour coordonnées " + PT(...s) + ".",
          { ctx: "somme", guide: [GP(M("\\overrightarrow{AB}") + " ?", [B[0] - A[0], B[1] - A[1]], PT(B[0] - A[0], B[1] - A[1]) + "."), GP(M("\\overrightarrow{CD}") + " ?", [D[0] - C[0], D[1] - C[1]], PT(D[0] - C[0], D[1] - C[1]) + "."), GP("Somme ?", s, PT(...s) + ".")],
            traps: [{ spec: { kind: "pair", values: [A[0] - B[0] + C[0] - D[0], A[1] - B[1] + C[1] - D[1]] }, m: "Coordonnées de AB : arrivée moins départ (x_B − x_A)." }, { spec: { kind: "pair", values: [D[0] - A[0], D[1] - A[1]] }, m: "Chasles ne s'applique que si l'arrivée du premier est le départ du second : ici, calcule les deux vecteurs." }] }); },
      () => { const A = [nz(-5, 5), nz(-5, 5)], I = [nz(-4, 4), nz(-4, 4)], B = [2 * I[0] - A[0], 2 * I[1] - A[1]];
        return QP(M("I") + PT(...I) + " est le milieu du segment " + M("[AB]") + ", avec " + M("A") + PT(...A) + ". Donne les coordonnées de " + M("B") + ". Réponds « x ; y ».", B,
          M("I") + " milieu de " + M("[AB]") + " : " + M("\\overrightarrow{AI} = \\overrightarrow{IB}") + ". " + M("\\overrightarrow{AI}") + PT(I[0] - A[0], I[1] - A[1]) + ", qu'on applique à " + M("I") + " : " + M("B") + PT(...B) + ".",
          { ctx: "milieu", guide: [GP(M("\\overrightarrow{AI}") + " ?", [I[0] - A[0], I[1] - A[1]], PT(I[0] - A[0], I[1] - A[1]) + "."), GP(M("B") + " ?", B, PT(...B) + ".")],
            traps: [{ spec: { kind: "pair", values: [(A[0] + I[0]) / 2, (A[1] + I[1]) / 2] }, m: "I est le milieu de [AB] : B est au-delà de I, à la même distance que A." }, { spec: { kind: "pair", values: [I[0] - A[0], I[1] - A[1]] }, m: "C'est le vecteur AI : ajoute-le à I." }] }); },
      () => { const M0 = [nz(-5, 5), nz(-5, 5)], u = [nz(-4, 4), nz(-4, 4)], v = [nz(-4, 4), nz(-4, 4)], P = [M0[0] + u[0] + v[0], M0[1] + u[1] + v[1]];
        return QP("On applique au point " + M("M") + PT(...M0) + " la translation de vecteur " + M("\\vec{u}") + PT(...u) + ", puis celle de vecteur " + M("\\vec{v}") + PT(...v) + ". Où arrive le point ? Réponds « x ; y ».", P,
          "Enchaîner deux translations revient à faire la translation de vecteur " + M("\\vec{u} + \\vec{v}") + PT(u[0] + v[0], u[1] + v[1]) + " : " + PT(...P) + ".",
          { ctx: "enchainement", guide: [GP("Après la première translation ?", [M0[0] + u[0], M0[1] + u[1]], PT(M0[0] + u[0], M0[1] + u[1]) + "."), GP("Point d'arrivée ?", P, PT(...P) + ".")],
            traps: [{ spec: { kind: "pair", values: [M0[0] + u[0], M0[1] + u[1]] }, m: "Il reste la seconde translation." }, { spec: { kind: "pair", values: [u[0] + v[0], u[1] + v[1]] }, m: "C'est le vecteur u + v ; on l'applique au point M." }] }); },
    ],
    3: [
      () => { const A = [nz(-4, 4), nz(-4, 4)], B = [nz(-4, 4), nz(-4, 4)], C = [nz(-4, 4), nz(-4, 4)], m = nz(-5, 6), Dy = C[1] + B[1] - A[1], D = [C[0] + B[0] - A[0], Dy], k = R.rand() < 0.5;
        if (A[0] === B[0] && A[1] === B[1]) return null;
        const Dx = D[0] - m;
        return QN("Dans un repère, " + M("A") + PT(...A) + ", " + M("B") + PT(...B) + ", " + M("C") + PT(...C) + " et " + M("D(m" + sg(Dx) + " \\,;\\, " + N(Dy) + ")") + ". Pour quelle valeur de " + M("m") + " a-t-on " + M("\\overrightarrow{AB} = \\overrightarrow{CD}") + " ?", m,
          M("\\overrightarrow{AB}") + PT(B[0] - A[0], B[1] - A[1]) + " ; " + M("\\overrightarrow{CD}(m" + sg(Dx - C[0]) + " \\,;\\, " + N(Dy - C[1]) + ")") + ". Les ordonnées sont égales ; les abscisses : " + M("m" + sg(Dx - C[0]) + " = " + N(B[0] - A[0])) + ", " + M("m = " + N(m)) + ".",
          { ctx: "parametre", guide: [GR("Abscisse de " + M("\\overrightarrow{AB}") + " ?", B[0] - A[0], M(N(B[0] - A[0])) + "."), GR(M("m") + " ?", m, M(N(m)) + ".")],
            traps: [TR(D[0], "On cherche m, pas l'abscisse de D."), TR(m + 2 * Dx, "x_D = m + " + Dx + " : isole m.")] }); },
      () => { const A = [nz(-4, 4), nz(-4, 4)], B = [nz(-4, 4), nz(-4, 4)], C = [nz(-4, 4), nz(-4, 4)], D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]], O = [(A[0] + C[0]) / 2, (A[1] + C[1]) / 2];
        if ((A[0] - B[0]) * (C[1] - B[1]) === (A[1] - B[1]) * (C[0] - B[0])) return null;
        return QP(M("ABCD") + " est un parallélogramme avec " + M("A") + PT(...A) + ", " + M("B") + PT(...B) + " et " + M("C") + PT(...C) + ". Donne les coordonnées de son centre " + M("O") + " (fractions ou décimaux acceptés). Réponds « x ; y ».", O,
          "Les diagonales d'un parallélogramme se coupent en leur milieu : " + M("O") + " est le milieu de " + M("[AC]") + ", " + PT(...O) + ". (Inutile de calculer " + M("D") + PT(...D) + ".)",
          { ctx: "centre", guide: [GP("Milieu de " + M("[AC]") + " ?", O, PT(...O) + ".")],
            traps: [{ spec: { kind: "pair", values: [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2] }, m: "Le centre est le milieu d'une diagonale ([AC] ou [BD]), pas d'un côté." }, { spec: { kind: "pair", values: D }, m: "C'est le quatrième sommet D, pas le centre." }] }); },
      () => { const A = [nz(-4, 4), nz(-4, 4)], B = [nz(-4, 4), nz(-4, 4)], C = [nz(-4, 4), nz(-4, 4)], E = [B[0] + C[0] - A[0], B[1] + C[1] - A[1]];
        return QP("Dans un repère, " + M("A") + PT(...A) + ", " + M("B") + PT(...B) + " et " + M("C") + PT(...C) + ". Le point " + M("E") + " vérifie " + M("\\overrightarrow{AE} = \\overrightarrow{AB} + \\overrightarrow{AC}") + ". Donne ses coordonnées. Réponds « x ; y ».", E,
          M("\\overrightarrow{AB}") + PT(B[0] - A[0], B[1] - A[1]) + " et " + M("\\overrightarrow{AC}") + PT(C[0] - A[0], C[1] - A[1]) + " : " + M("\\overrightarrow{AE}") + PT(B[0] + C[0] - 2 * A[0], B[1] + C[1] - 2 * A[1]) + ", donc " + M("E") + PT(...E) + " (" + M("ABEC") + " est un parallélogramme).",
          { ctx: "regle-parallelogramme", guide: [GP(M("\\overrightarrow{AB} + \\overrightarrow{AC}") + " ?", [B[0] + C[0] - 2 * A[0], B[1] + C[1] - 2 * A[1]], PT(B[0] + C[0] - 2 * A[0], B[1] + C[1] - 2 * A[1]) + "."), GP(M("E") + " ?", E, PT(...E) + ".")],
            traps: [{ spec: { kind: "pair", values: [B[0] + C[0] - 2 * A[0], B[1] + C[1] - 2 * A[1]] }, m: "C'est le vecteur AE ; ajoute-le aux coordonnées de A." }, { spec: { kind: "pair", values: [B[0] + C[0], B[1] + C[1]] }, m: "On ajoute des vecteurs, pas des points." }] }); },
    ],
  };

  // ======================= tabvar : tableau de variations (2nde.AN.08–09) =======================
  // xs : abscisses (bornes et extremums), ys : valeurs ; les flèches alternent.
  const tvTex = (xs, ys) => M("\\begin{array}{c|" + "c".repeat(2 * xs.length - 1) + "} x & " + xs.map(N).join(" & & ") + " \\\\ \\hline f(x) & " + ys.map((y, i) => N(y) + (i < ys.length - 1 ? " & " + (ys[i + 1] > y ? "\\nearrow" : "\\searrow") : "")).join(" & ") + " \\end{array}");
  const mkTab = (n, up0) => { const xs = [R.int(-6, -3)]; for (let i = 1; i < n; i++) xs.push(xs[i - 1] + R.int(2, 4)); const up = up0 === undefined ? R.rand() < 0.5 : up0, ys = [];
    for (let i = 0; i < n; i++) ys.push(i === 0 ? nz(-5, 5) : ys[i - 1] + ((i % 2 === 1) === up ? 1 : -1) * R.int(2, 6)); return { xs, ys }; };
  const INTRO = "Voici le tableau de variations d'une fonction " + M("f") + " : ";
  const TV = {
    1: [
      () => { const { xs, ys } = mkTab(4), mx = Math.max(...ys), wantMax = R.rand() < 0.5, v = wantMax ? mx : Math.min(...ys);
        return QN(INTRO + tvTex(xs, ys) + " Quel est le " + (wantMax ? "maximum" : "minimum") + " de " + M("f") + " sur " + M("[" + N(xs[0]) + " \\,;\\, " + N(xs[3]) + "]") + " ?", v,
          "On compare les valeurs aux sommets des flèches et aux bornes : " + M(ys.map(N).join(" ; ")) + ". Le " + (wantMax ? "maximum" : "minimum") + " vaut " + M(N(v)) + ", atteint en " + M("x = " + N(xs[ys.indexOf(v)])) + ".",
          { ctx: wantMax ? "maximum" : "minimum", shownOk: true, guide: [GR("Le " + (wantMax ? "maximum" : "minimum") + " ?", v, M(N(v)) + ".")],
            traps: [TR(xs[ys.indexOf(v)], "C'est l'abscisse où il est atteint ; on demande la valeur de f."), TR(wantMax ? Math.max(ys[1], ys[2]) === v ? Math.max(ys[0], ys[3]) : Math.max(ys[1], ys[2]) : Math.min(ys[1], ys[2]) === v ? Math.min(ys[0], ys[3]) : Math.min(ys[1], ys[2]), "Compare aussi les valeurs aux bornes de l'intervalle.")] }); },
      () => { const dec = R.rand() < 0.5, { xs, ys } = mkTab(4, dec), i = 1, iv = [[xs[i], true, xs[i + 1], true]];
        return QS(INTRO + tvTex(xs, ys) + " Sur quel intervalle " + M("f") + " est-elle " + (dec ? "décroissante" : "croissante") + " ?", iv,
          "La flèche " + (dec ? "descend" : "monte") + " entre " + M(N(xs[i])) + " et " + M(N(xs[i + 1])) + " : " + M("f") + " est " + (dec ? "décroissante" : "croissante") + " sur " + M("[" + N(xs[i]) + " \\,;\\, " + N(xs[i + 1]) + "]") + ".",
          { ctx: dec ? "decroissante" : "croissante", guide: [{ ask: "Intervalle ?", spec: solsetSpec(iv), sol: M("[" + N(xs[i]) + " \\,;\\, " + N(xs[i + 1]) + "]") + "." }],
            traps: [TS([[Math.min(ys[i], ys[i + 1]), true, Math.max(ys[i], ys[i + 1]), true]], "L'intervalle porte sur x (première ligne), pas sur les valeurs de f."), TS([[xs[0], true, xs[1], true]], "Regarde le sens de chaque flèche.")] }); },
      () => { const { xs, ys } = mkTab(3), up = ys[1] > ys[0], a = xs[0] + 0.5, b = xs[1] - 0.5, big = up ? b : a;
        return QN(INTRO + tvTex(xs, ys) + " Sans connaître " + M("f(" + N(a) + ")") + " ni " + M("f(" + N(b) + ")") + ", lequel de ces deux nombres est le plus grand ? Réponds " + M(N(a)) + " si c'est " + M("f(" + N(a) + ")") + ", " + M(N(b)) + " si c'est " + M("f(" + N(b) + ")") + ".", big,
          M(N(a)) + " et " + M(N(b)) + " sont dans " + M("[" + N(xs[0]) + " \\,;\\, " + N(xs[1]) + "]") + ", où " + M("f") + " est " + (up ? "croissante : elle conserve l'ordre" : "décroissante : elle inverse l'ordre") + ". Donc " + M("f(" + N(big) + ")") + " est le plus grand.",
          { ctx: "comparer", shownOk: true, guide: [GR("Sur cet intervalle, " + M("f") + " est-elle croissante (1) ou décroissante (−1) ?", up ? 1 : -1, up ? "Croissante." : "Décroissante."), GR("Le plus grand est " + M("f(\\dots)") + " : tape le nombre entre parenthèses.", big, M("f(" + N(big) + ")") + ".")],
            traps: [TR(up ? a : b, up ? "f croissante conserve l'ordre : le plus grand x donne la plus grande image." : "f décroissante inverse l'ordre.")] }); },
    ],
    2: [
      () => { const { xs, ys } = mkTab(4), lo = Math.min(...ys), hi = Math.max(...ys); let k = R.int(lo + 1, hi - 1); if (ys.includes(k)) k += 0.5;
        let n = 0; for (let i = 0; i < 3; i++) if ((ys[i] - k) * (ys[i + 1] - k) < 0) n++;
        return QN(INTRO + tvTex(xs, ys) + " Combien de solutions l'équation " + M("f(x) = " + N(k)) + " a-t-elle sur " + M("[" + N(xs[0]) + " \\,;\\, " + N(xs[3]) + "]") + " ?", n,
          "Sur chaque intervalle où " + M("f") + " est monotone, la valeur " + M(N(k)) + " est atteinte au plus une fois, et elle l'est si elle est entre les valeurs aux extrémités. Ici : " + n + " intervalle" + (n > 1 ? "s" : "") + " sur 3.",
          { ctx: "nb-solutions", guide: [GR("Sur combien des trois intervalles " + M(N(k)) + " est-il compris entre les deux valeurs aux extrémités ?", n, M(n) + ".")],
            traps: [TR(n === 1 ? 2 : 1, "Regarde chaque flèche : " + N(k).replace("{,}", ",") + " est-il entre la valeur de départ et la valeur d'arrivée ?"), TR(3, "Toutes les flèches ne passent pas par " + N(k).replace("{,}", ",") + ".")] }); },
      () => { const { xs, ys } = mkTab(4), j = R.int(1, 2), sub = ys.slice(j), wantMax = R.rand() < 0.5, v = wantMax ? Math.max(...sub) : Math.min(...sub);
        if (v === (wantMax ? Math.max(...ys) : Math.min(...ys))) return null;
        return QN(INTRO + tvTex(xs, ys) + " Quel est le " + (wantMax ? "maximum" : "minimum") + " de " + M("f") + " sur l'intervalle " + M("[" + N(xs[j]) + " \\,;\\, " + N(xs[3]) + "]") + " ?", v,
          "On ne regarde que la partie du tableau entre " + M(N(xs[j])) + " et " + M(N(xs[3])) + " : valeurs " + M(sub.map(N).join(" ; ")) + ". " + (wantMax ? "Maximum" : "Minimum") + " : " + M(N(v)) + ".",
          { ctx: "extremum-partiel", shownOk: true, guide: [GR("Valeurs de " + M("f") + " utiles (bornes et sommets) : la plus " + (wantMax ? "grande" : "petite") + " ?", v, M(N(v)) + ".")],
            traps: [TR(wantMax ? Math.max(...ys) : Math.min(...ys), "Sur [" + xs[j] + " ; " + xs[3] + "] seulement : ignore le début du tableau.")] }); },
      () => { const { xs, ys } = mkTab(4); if (ys.includes(0)) return null;
        let n = 0; for (let i = 0; i < 3; i++) if (ys[i] * ys[i + 1] < 0) n++; if (!n) return null;
        return QN(INTRO + tvTex(xs, ys) + " Combien de fois la courbe de " + M("f") + " coupe-t-elle l'axe des abscisses ?", n,
          "La courbe coupe l'axe des abscisses quand " + M("f(x) = 0") + ", c'est-à-dire sur chaque flèche qui passe d'une valeur négative à une valeur positive (ou l'inverse) : " + n + " fois.",
          { ctx: "zeros", guide: [GR("Combien de flèches changent de signe ?", n, M(n) + ".")],
            traps: [TR(n + 1, "Une flèche qui reste du même signe ne coupe pas l'axe."), TR(3, "Regarde le signe des valeurs aux deux bouts de chaque flèche.")] }); },
    ],
    3: [
      () => { const a = nz(-3, 3), b = nz(-6, 6), lo = a - R.int(1, 4), hi = a + R.int(1, 4), s = pk([1, -1]), vals = [lo, a, hi].map((x) => s * (x - a) ** 2 + b), v = s > 0 ? b : Math.max(...vals.filter((_, i) => i !== 1));
        const askMin = s > 0;
        return QN("Soit " + M("f(x) = " + (s < 0 ? "-" : "") + "(x" + sg(-a) + ")^2" + sg(b)) + " sur " + M("[" + N(lo) + " \\,;\\, " + N(hi) + "]") + ". Dresse son tableau de variations. Quel est son " + (askMin ? "minimum" : "maximum") + " sur cet intervalle ?", s > 0 ? b : b,
          "Forme canonique : " + M("f") + " est " + (s > 0 ? "décroissante puis croissante" : "croissante puis décroissante") + ", avec un " + (s > 0 ? "minimum" : "maximum") + " en " + M("x = " + N(a)) + " : " + M("f(" + N(a) + ") = " + N(b)) + ". Tableau : " + tvTex([lo, a, hi], vals) + ".",
          { ctx: "canonique", guide: [GR("En quelle abscisse la flèche change-t-elle de sens ?", a, M("x = " + N(a)) + "."), GR((askMin ? "Minimum" : "Maximum") + " ?", b, M(N(b)) + ".")],
            traps: [TR(a, "C'est l'abscisse ; on demande la valeur."), TR(-b, "f(" + a + ") = " + b + " : (x − " + a + ")² s'annule.")] }); },
      () => { const { xs, ys } = mkTab(4), iv = [[Math.min(...ys), true, Math.max(...ys), true]];
        return QS(INTRO + tvTex(xs, ys) + " Quand " + M("x") + " parcourt " + M("[" + N(xs[0]) + " \\,;\\, " + N(xs[3]) + "]") + ", dans quel intervalle " + M("f(x)") + " prend-elle ses valeurs ? Donne le plus petit intervalle possible.", iv,
          M("f") + " est continue sur l'intervalle (pas de saut) : elle prend toutes les valeurs entre son minimum " + M(N(iv[0][0])) + " et son maximum " + M(N(iv[0][2])) + ", donc " + M("f(x) \\in [" + N(iv[0][0]) + " \\,;\\, " + N(iv[0][2]) + "]") + ".",
          { ctx: "image-intervalle", guide: [GR("Minimum ?", iv[0][0], M(N(iv[0][0])) + "."), GR("Maximum ?", iv[0][2], M(N(iv[0][2])) + "."), { ask: "Intervalle des valeurs ?", spec: solsetSpec(iv), sol: M("[" + N(iv[0][0]) + " \\,;\\, " + N(iv[0][2]) + "]") + "." }],
            traps: [TS([[Math.min(ys[0], ys[3]), true, Math.max(ys[0], ys[3]), true]], "Les valeurs aux bornes ne suffisent pas : regarde aussi les sommets des flèches."), TS([[xs[0], true, xs[3], true]], "C'est l'intervalle des x ; on demande les valeurs de f.")] }); },
      () => { const { xs, ys } = mkTab(4); let k = R.rand() < 0.5 ? ys[1] + (ys[2] > ys[1] ? 1 : -1) * 0.5 : (ys[2] + ys[3]) / 2, n = 0; for (let i = 1; i < 3; i++) if ((ys[i] - k) * (ys[i + 1] - k) < 0) n++;
        return QN(INTRO + tvTex(xs, ys) + " Combien de solutions l'équation " + M("f(x) = " + N(k)) + " a-t-elle sur " + M("[" + N(xs[1]) + " \\,;\\, " + N(xs[3]) + "]") + " ?", n,
          "On ne regarde que les flèches entre " + M(N(xs[1])) + " et " + M(N(xs[3])) + " : " + M(N(k)) + " est atteint une fois sur chaque flèche qui l'encadre, soit " + n + " solution" + (n > 1 ? "s" : "") + ".",
          { ctx: "nb-solutions-partiel", guide: [GR("Nombre de flèches (entre " + M(N(xs[1])) + " et " + M(N(xs[3])) + ") qui encadrent " + M(N(k)) + " ?", n, M(n) + ".")],
            traps: [TR(n + ((ys[0] - k) * (ys[1] - k) < 0 ? 1 : 0), "Seulement sur [" + xs[1] + " ; " + xs[3] + "] : la première flèche ne compte pas."), TR(n + 1, "Compte les flèches qui encadrent " + N(k).replace("{,}", ",") + ".")] }); },
    ],
  };

  /* 26.11 soir (agent defisfr) : défis autodnb et tabvar tirés au hasard (avant : un seul énoncé figé), 4 contextes
     (tag ctx), corrigé calculé ; recalcul indépendant : tests/recalc_oracles_fr.js. */
  const PR = (ctx, q, parts, hints, sol) => ({ ctx, q, hints, sol, parts: parts.map(([label, value, round]) => ({ label, spec: Object.assign({ kind: "value", value: rnd(value) }, round ? { round } : {}) })) });
  const T = (v) => N(v).replace(/\\,/g, " ").replace("{,}", ",").replace(/^-/, "−"); /* nombre, texte simple */
  const ADP = [() => {
    const cx = pk(["calcul", "puissances", "mesures", "equation"]), parts = [], sol = [];
    if (cx === "calcul") {
      let a, b, c, d, e, f, v; do { b = pk([3, 4, 5, 6]); a = R.int(1, b - 1); c = R.int(1, 5); d = pk([2, 3, 4, 5]); e = R.int(1, 5); f = pk([2, 3, 4, 5, 6]); v = a / b - (c * e) / (d * f); } while (g2(a, b) !== 1 || g2(c, d) !== 1 || g2(e, f) !== 1 || c === d || e === f || Math.abs(v) < 1e-9 || den(v) > 36);
      const P0 = pk([20, 40, 60, 80, 120]), t = pk([5, 10, 15, 20, 25, 30]), obj = pk(["Un pull", "Une place de concert", "Un abonnement de téléphone", "Un sac à dos"]), m = pk([20, 30, 40, 50, 60, 100]), k = R.int(1, 4);
      parts.push(["a) " + a + "/" + b + " − " + c + "/" + d + " × " + e + "/" + f + " (fraction irréductible ou décimal)", v], ["b) " + obj + " à " + P0 + " € augmente de " + t + " %. Nouveau prix (€)", (P0 * (100 + t)) / 100], ["c) " + (m + k) + "² − " + (m - k) + "²", 4 * m * k]);
      sol.push("a) La multiplication d'abord : " + M("\\frac{" + a + "}{" + b + "} - \\frac{" + c * e + "}{" + d * f + "} = " + F(v)), "b) " + M(P0 + " \\times " + N(rnd(1 + t / 100)) + " = " + N(rnd((P0 * (100 + t)) / 100))) + " €", "c) " + M("(" + (m + k) + " - " + (m - k) + ")(" + (m + k) + " + " + (m - k) + ") = " + 2 * k + " \\times " + 2 * m + " = " + 4 * m * k));
    } else if (cx === "puissances") {
      let p, q, r; do { p = R.int(-4, 9); q = R.int(-6, 6); r = R.int(-4, 8); } while (!p || !q || !r || p + q - r === 0);
      const [cont, o1, o2, o3, un] = pk([["Un sac contient", "billes rouges", "billes vertes", "billes jaunes", "une"], ["Une urne contient", "boules bleues", "boules blanches", "boules noires", "une"], ["Une boîte contient", "crayons rouges", "crayons verts", "crayons bleus", "un"]]), ep = (v) => (v < 0 ? "(" + T(v) + ")" : T(v)), x = R.int(2, 7), y = R.int(2, 7), z = R.int(2, 6), tt = pk([5, 15, 25, 30, 75]), NN = 20 * R.int(2, 12);
      parts.push(["a) 10^" + ep(p) + " × 10^" + ep(q) + " ÷ 10^" + ep(r) + " s'écrit 10ⁿ : valeur de n", p + q - r], ["b) " + cont + " " + x + " " + o1 + ", " + y + " " + o2 + " et " + z + " " + o3 + ". On en tire " + un + " au hasard. P(" + o2.split(" ")[0].replace(/s$/, "") + " " + o2.split(" ")[1].replace(/s$/, "") + ") (fraction acceptée)", y / (x + y + z)], ["c) " + tt + " % de " + NN, (tt * NN) / 100]);
      sol.push("a) " + M("10^{" + p + " + " + NP(q) + " - " + NP(r) + "} = 10^{" + (p + q - r) + "}"), "b) " + M("\\frac{" + y + "}{" + (x + y + z) + "}" + (g2(y, x + y + z) > 1 ? " = " + F(y / (x + y + z)) : "")), "c) " + M(NN + " \\times " + N(tt / 100) + " = " + N((tt * NN) / 100)));
    } else if (cx === "mesures") {
      const [a0, b0, c0] = pk([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20]]), [tr, vs] = pk([["Un TGV", [240, 270, 300, 320]], ["Un TER", [90, 120, 150]], ["Un Intercités", [120, 150, 180]]]), v = pk(vs), mn = pk([15, 20, 30, 40, 45]), dk = (v * mn) / 60, r = R.int(3, 12);
      parts.push(["a) Un triangle est rectangle ; les côtés de l'angle droit mesurent " + a0 + " cm et " + b0 + " cm. Hypoténuse (cm)", c0], ["b) " + tr + " parcourt " + T(dk) + " km en " + mn + " min. Vitesse moyenne (km/h)", v], ["c) Un disque a pour rayon " + r + " cm ; son aire s'écrit k × π cm². Valeur de k", r * r]);
      sol.push("a) " + M("\\sqrt{" + a0 + "^2 + " + b0 + "^2} = \\sqrt{" + c0 * c0 + "} = " + c0), "b) en 1 h = 60 min : " + M(N(dk) + " \\div " + mn + " \\times 60 = " + v) + " km/h", "c) " + M("\\pi \\times " + r + "^2 = " + r * r + "\\pi"));
    } else {
      let a, b, c, d, xs; do { a = R.int(2, 9); c = R.int(-5, 9); xs = R.int(-6, 8); b = R.int(-12, 12); d = (a - c) * xs + b; } while (a === c || !c || !b || !xs || Math.abs(d) > 30);
      let t1, t2; do { t1 = pk([10, 20, 25, 30, 50]); t2 = pk([10, 20, 25, 30, 40]); } while ((100 + t1) * (100 - t2) === 10000);
      const g = ((100 + t1) * (100 - t2) - 10000) / 100, ka = pk([2, 3, -2, 5]), kb = R.int(-9, 9), x0 = -R.int(2, 5), im = ka * x0 * x0 + kb;
      const lin2 = (p, q) => (p === 1 ? "" : p === -1 ? "−" : T(p)) + "x" + (q ? (q < 0 ? " − " + T(-q) : " + " + T(q)) : "");
      parts.push(["a) Solution de " + lin2(a, b) + " = " + lin2(c, d), xs], ["b) Un prix augmente de " + t1 + " %, puis baisse de " + t2 + " %. Taux d'évolution global (en %, négatif pour une baisse)", g], ["c) Image de " + T(x0) + " par la fonction f(x) = " + (ka === 1 ? "" : T(ka)) + "x²" + (kb ? (kb < 0 ? " − " + T(-kb) : " + " + T(kb)) : ""), im]);
      sol.push("a) " + M(N(a - c) + "x = " + N(d - b)) + ", " + M("x = " + xs), "b) " + M(N(rnd(1 + t1 / 100)) + " \\times " + N(rnd(1 - t2 / 100)) + " = " + N(rnd(1 + g / 100))) + " : " + M(N(g) + "\\,\\%"), "c) " + M(N(ka) + " \\times " + NP(x0) + "^2" + sg(kb) + " = " + N(ka) + " \\times " + x0 * x0 + sg(kb) + " = " + N(im)) + " (le carré d'un négatif est positif)");
    }
    return PR(cx, "Partie 1 du brevet (automatismes), sans calculatrice.", parts, ["Priorités : puissances, puis × et ÷, puis + et −.", cx === "calcul" ? "a² − b² = (a − b)(a + b)." : cx === "puissances" ? "10ᵖ × 10^q = 10^(p + q) et 10ᵖ ÷ 10^q = 10^(p − q)." : cx === "mesures" ? "Pythagore : hypoténuse² = somme des carrés des deux autres côtés." : "Deux évolutions successives : on multiplie les coefficients."], sol.join(" ; ") + ".");
  }];
  /* tableau de variations décrit en texte : points (x ; f(x)) successifs, sens alterné */
  const nbSol = (ys, k) => { let n = 0; for (let i = 0; i + 1 < ys.length; i++) if ((k - ys[i]) * (k - ys[i + 1]) < 0) n++; return n; };
  const pickK = (ys, want) => { const lo = Math.min(...ys) - 3, hi = Math.max(...ys) + 3; const ks = []; for (let k = lo; k <= hi; k++) if (!ys.includes(k) && (want === undefined || nbSol(ys, k) === want)) ks.push(k); return ks.length ? pk(ks) : null; };
  const TVP = [() => {
    const cx = pk(["fonction", "temperature", "altitude", "benefice"]);
    if (cx === "fonction") {
      let xs, ys, k1, k2; do { const x0 = R.int(-6, -1), x1 = x0 + R.int(2, 6), x2 = x1 + R.int(2, 6), dn = R.rand() < 0.5, y1 = R.int(-8, 8); xs = [x0, x1, x2]; ys = dn ? [y1 + R.int(2, 9), y1, y1 + R.int(2, 9)] : [y1 - R.int(2, 9), y1, y1 - R.int(2, 9)]; k1 = pickK(ys, 2); k2 = pickK(ys, 1); } while (k1 === null || k2 === null || ys[0] === ys[2]);
      const dn = ys[1] < ys[0], ext = dn ? Math.min(...ys) : Math.max(...ys), [p, q] = pk([[k1, k2], [k2, k1]]);
      return PR(cx, "Tableau de variations de f sur [" + T(xs[0]) + " ; " + T(xs[2]) + "] : f(" + T(xs[0]) + ") = " + T(ys[0]) + ", f(" + T(xs[1]) + ") = " + T(ys[1]) + ", f(" + T(xs[2]) + ") = " + T(ys[2]) + " ; f est " + (dn ? "décroissante" : "croissante") + " sur [" + T(xs[0]) + " ; " + T(xs[1]) + "], puis " + (dn ? "croissante" : "décroissante") + " sur [" + T(xs[1]) + " ; " + T(xs[2]) + "].",
        [["a) " + (dn ? "Minimum" : "Maximum") + " de f sur [" + T(xs[0]) + " ; " + T(xs[2]) + "]", ext], ["b) Nombre de solutions de f(x) = " + T(p), nbSol(ys, p)], ["c) Nombre de solutions de f(x) = " + T(q), nbSol(ys, q)]],
        ["Une flèche va de " + T(ys[0]) + " à " + T(ys[1]) + ", l'autre de " + T(ys[1]) + " à " + T(ys[2]) + ".", "Sur une flèche, f prend une fois chaque valeur comprise entre ses deux extrémités."],
        "a) " + M(N(ext)) + " en " + M("x = " + N(xs[1])) + " ; b) " + M(N(p)) + (nbSol(ys, p) === 2 ? " est sur les deux flèches : 2 solutions" : " n'est que sur une flèche : 1 solution") + " ; c) " + M(N(q)) + (nbSol(ys, q) === 2 ? " est sur les deux flèches : 2 solutions" : " n'est que sur une flèche : 1 solution") + ".");
    }
    if (cx === "temperature") {
      let ys, h1, h2, k; do { const y0 = R.int(-3, 4), y1 = y0 - R.int(2, 6), y2 = y1 + R.int(5, 12), y3 = y2 - R.int(2, 7); ys = [y0, y1, y2, y3]; h1 = R.int(5, 8); h2 = R.int(13, 16); k = pickK(ys.slice(0, 4)); } while (k === null || nbSol(ys, k) === 0 || ys[3] === ys[1] || ys[0] === ys[2]);
      const mn = Math.min(...ys), mx = Math.max(...ys), ville = pk(["Strasbourg", "Besançon", "Clermont-Ferrand", "Mouthe", "Nancy", "Lille", "Metz"]);
      return PR(cx, "Un jour d'hiver à " + ville + ", la température (en °C) varie ainsi : de 0 h à " + h1 + " h, elle baisse de " + T(ys[0]) + " °C à " + T(ys[1]) + " °C ; de " + h1 + " h à " + h2 + " h, elle monte jusqu'à " + T(ys[2]) + " °C ; de " + h2 + " h à 24 h, elle baisse jusqu'à " + T(ys[3]) + " °C.",
        [["a) Température minimale de la journée (°C)", mn], ["b) Nombre d'instants de la journée où la température vaut " + T(k) + " °C", nbSol(ys, k)], ["c) Écart entre la température maximale et la température minimale (°C)", mx - mn]],
        ["Fais le tableau de variations : trois flèches.", "Une valeur est atteinte une fois sur chaque flèche qui la « traverse »."],
        "Tableau : " + M(N(ys[0]) + " \\searrow " + N(ys[1]) + " \\nearrow " + N(ys[2]) + " \\searrow " + N(ys[3])) + ". a) " + M(N(mn)) + " °C ; b) " + M(N(k)) + " °C est atteinte sur " + nbSol(ys, k) + " flèche" + (nbSol(ys, k) > 1 ? "s" : "") + " : " + nbSol(ys, k) + " instant" + (nbSol(ys, k) > 1 ? "s" : "") + " ; c) " + M(N(mx) + " - " + NP(mn) + " = " + N(mx - mn)) + " °C.");
    }
    if (cx === "altitude") {
      let ys, ds, k; do { ys = [10 * R.int(40, 90), 10 * R.int(150, 260), 10 * R.int(50, 120), 10 * R.int(120, 210)]; const d1 = R.int(20, 60), d2 = d1 + R.int(15, 35), d3 = d2 + R.int(10, 25); ds = [0, d1, d2, d3]; k = 100 * R.int(Math.ceil(Math.min(...ys) / 100), Math.floor(Math.max(...ys) / 100)); } while (ys[2] >= ys[0] + 200 || ys[3] <= ys[2] + 300 || ys.includes(k) || nbSol(ys, k) < 1);
      const mass = pk(["des Alpes", "des Pyrénées", "du Massif central"]), dp = ys[1] - ys[0] + ys[3] - ys[2];
      return PR(cx, "Profil d'une étape de montagne du Tour de France " + mass + " : départ à " + T(ys[0]) + " m d'altitude ; la route monte jusqu'à un col à " + T(ys[1]) + " m (km " + ds[1] + "), descend jusqu'à la vallée à " + T(ys[2]) + " m (km " + ds[2] + "), puis monte jusqu'à l'arrivée à " + T(ys[3]) + " m (km " + ds[3] + ").",
        [["a) Altitude maximale de l'étape (m)", Math.max(...ys)], ["b) Nombre de fois où les coureurs passent à " + T(k) + " m d'altitude", nbSol(ys, k)], ["c) Dénivelé positif total : somme des montées (m)", dp]],
        ["Tableau de variations de l'altitude en fonction de la distance : trois flèches.", "Dénivelé positif : on n'additionne que les montées."],
        "Tableau : " + M(N(ys[0]) + " \\nearrow " + N(ys[1]) + " \\searrow " + N(ys[2]) + " \\nearrow " + N(ys[3])) + ". a) " + M(N(Math.max(...ys))) + " m ; b) " + M(N(k)) + " m est atteinte sur " + nbSol(ys, k) + " flèche" + (nbSol(ys, k) > 1 ? "s" : "") + " ; c) " + M("(" + N(ys[1]) + " - " + N(ys[0]) + ") + (" + N(ys[3]) + " - " + N(ys[2]) + ") = " + N(dp)) + " m.");
  }
    let ys, X, x1, k; do { X = pk([40, 50, 60, 80, 100]); x1 = Math.round(X * (0.35 + R.rand() * 0.3)); ys = [-100 * R.int(2, 8), 100 * R.int(4, 25), 100 * R.int(-6, 6)]; k = 100 * R.int(1, Math.floor(ys[1] / 100) - 1); } while (!ys[2] || ys[2] >= ys[1] || ys.includes(k) || ys.includes(0));
    const [prod, reg2] = pk([["crêpières", "de Bretagne"], ["planches de surf", "des Landes"], ["paires de skis", "du Jura"], ["lampes de bureau", "de Normandie"], ["bicyclettes en bois", "de la Drôme"]]);
    return PR(cx, "Une petite entreprise " + reg2 + " fabrique chaque mois entre 0 et " + X + " " + prod + ". Son bénéfice B(x) (en €) pour x objets est croissant sur [0 ; " + x1 + "] et décroissant sur [" + x1 + " ; " + X + "], avec B(0) = " + T(ys[0]) + ", B(" + x1 + ") = " + T(ys[1]) + " et B(" + X + ") = " + T(ys[2]) + ".",
      [["a) Bénéfice maximal (€)", ys[1]], ["b) Nombre de quantités x pour lesquelles le bénéfice est nul", nbSol(ys, 0)], ["c) Nombre de quantités x pour lesquelles le bénéfice vaut " + T(k) + " €", nbSol(ys, k)]],
      ["Une flèche monte de " + T(ys[0]) + " à " + T(ys[1]) + ", l'autre descend jusqu'à " + T(ys[2]) + ".", "Pour b), regarde si 0 est entre les extrémités de chaque flèche."],
      "Tableau : " + M(N(ys[0]) + " \\nearrow " + N(ys[1]) + " \\searrow " + N(ys[2])) + ". a) " + M(N(ys[1])) + " € pour " + x1 + " objets ; b) 0 est atteint sur " + nbSol(ys, 0) + " flèche" + (nbSol(ys, 0) > 1 ? "s" : "") + " : " + nbSol(ys, 0) + " ; c) " + M(N(k)) + " € : " + nbSol(ys, k) + ".");
  }];

  reg([
    { id: "linfn", theme: "fa", label: "Fonctions linéaires", ex: "f(x) = ax", FR: [9, 6], againFR: [10], g: LF,
      hint: "Une fonction linéaire s'écrit f(x) = ax : elle traduit une situation de proportionnalité (a = coefficient). a = f(x) ÷ x. Augmenter de t % : f(x) = (1 + t/100)x.",
      comps: ["Coefficient, image, antécédent", "Pourcentages, droite par l'origine, proportionnalité", "Linéarité, évolutions successives, linéaire et affine"],
      lesson: ["Fonctions linéaires", "Une fonction linéaire est une fonction de la forme \\(f(x) = ax\\) : elle modélise une situation de proportionnalité.",
        "Le coefficient \\(a\\) est le coefficient de proportionnalité : \\(a = \\frac{f(x)}{x}\\) pour \\(x \\neq 0\\). La représentation graphique est une droite qui passe par l'origine. Appliquer un pourcentage d'évolution de \\(t\\,\\%\\) est une fonction linéaire de coefficient \\(1 + \\frac{t}{100}\\) (hausse) ou \\(1 - \\frac{t}{100}\\) (baisse). Linéarité : \\(f(u + v) = f(u) + f(v)\\) et \\(f(ku) = kf(u)\\).",
        ["\\(f(5) = 12\\) : \\(a = \\frac{12}{5} = 2{,}4\\), donc \\(f(x) = 2{,}4x\\).", "Une baisse de \\(15\\,\\%\\) : \\(f(x) = 0{,}85x\\)."],
        "\\(f(x) = 2x + 3\\) n'est pas linéaire (affine) : sa droite ne passe pas par l'origine."] },
    { id: "cos4e", theme: "es", label: "Cosinus d'un angle aigu", ex: "\\cos \\widehat{A} = \\frac{\\text{adjacent}}{\\text{hypoténuse}}", FR: [8, 0], againFR: [9], g: CS,
      hint: "Dans un triangle rectangle, cos(angle aigu) = côté adjacent ÷ hypoténuse. Côté adjacent = hypoténuse × cos ; hypoténuse = adjacent ÷ cos ; angle : touche arccos (cos⁻¹).",
      comps: ["Calculer un côté adjacent ou l'hypoténuse, écrire un cosinus", "Calculer un angle, problèmes (échelle, rampe)", "Deux étapes avec Pythagore, triangle isocèle, repérer une erreur"],
      lesson: ["Le cosinus", "Dans un triangle rectangle, le cosinus d'un angle aigu ne dépend que de l'angle.",
        "\\(\\cos \\widehat{A} = \\frac{\\text{côté adjacent à } \\widehat{A}}{\\text{hypoténuse}}\\). L'hypoténuse est en face de l'angle droit ; le côté adjacent est l'autre côté de l'angle. Le cosinus est compris entre 0 et 1. On calcule un côté avec la calculatrice en degrés ; un angle avec la touche \\(\\arccos\\) (ou \\(\\cos^{-1}\\)).",
        ["Hypoténuse 10 cm, angle \\(60°\\) : côté adjacent \\(= 10 \\times \\cos 60° = 5\\) cm.", "Adjacent 4 cm, hypoténuse 8 cm : \\(\\cos \\widehat{A} = 0{,}5\\), \\(\\widehat{A} = 60°\\)."],
        "Le cosinus utilise le côté adjacent, pas le côté opposé ; et l'hypoténuse est toujours au dénominateur."] },
    { id: "thales4e", theme: "gm", label: "Thalès dans des triangles emboîtés", ex: "\\frac{AM}{AB} = \\frac{AN}{AC} = \\frac{MN}{BC}", FR: [8, 7], againFR: [9], g: TH,
      hint: "M sur [AB], N sur [AC], (MN) parallèle à (BC) : AM/AB = AN/AC = MN/BC. Le petit triangle AMN est une réduction de ABC. Attention : AB = AM + MB.",
      comps: ["Écrire les rapports, calculer MN ou AN", "Avec MB ou NC, problèmes concrets", "Périmètre, équation, repérer une erreur"],
      lesson: ["Le théorème de Thalès (triangles emboîtés)", "Une parallèle à un côté d'un triangle découpe un petit triangle, réduction du grand.",
        "Si \\(M \\in [AB]\\), \\(N \\in [AC]\\) et \\((MN) \\parallel (BC)\\), alors \\(\\frac{AM}{AB} = \\frac{AN}{AC} = \\frac{MN}{BC}\\). On écrit les trois rapports (petit triangle en haut, grand triangle en bas), puis on garde les deux qui contiennent une seule inconnue et on fait un produit en croix.",
        ["\\(AM = 3\\), \\(AB = 9\\), \\(BC = 12\\) : \\(MN = 12 \\times \\frac{3}{9} = 4\\).", "\\(AM = 4\\) et \\(MB = 6\\) : \\(AB = 10\\), rapport \\(\\frac{4}{10}\\)."],
        "Les rapports comparent le petit triangle au grand : \\(\\frac{AM}{AB}\\), jamais \\(\\frac{AM}{MB}\\)."] },
    { id: "autodnb", theme: "no", label: "Automatismes du brevet (partie 1)", ex: "\\frac{2}{3} + \\frac{5}{6} \\times \\frac{3}{5}", FR: [9, 0], g: AD,
      hint: "Sans calculatrice : priorités (puissances, puis × et ÷, puis + et −), fractions irréductibles, 10ᵖ × 10^q = 10^(p+q), t % de x = x × t/100, a² − b² = (a − b)(a + b).",
      comps: ["Fractions, puissances de 10, pourcentages, Pythagore", "Identités remarquables, probabilités, équations", "Calculs enchaînés, évolutions successives, vitesse, image"],
      lesson: ["Automatismes du brevet", "La première partie du brevet (environ 20 minutes, sans calculatrice) teste des automatismes : il faut les reconnaître et calculer vite et juste.",
        "Priorités : parenthèses, puissances, × et ÷, puis + et −. Fractions : même dénominateur pour additionner ; on multiplie numérateurs et dénominateurs entre eux ; résultat irréductible. \\(10^p \\times 10^q = 10^{p + q}\\). Évolution de \\(t\\,\\%\\) : on multiplie par \\(1 \\pm \\frac{t}{100}\\) ; deux évolutions : on multiplie les coefficients. \\((a + b)^2 = a^2 + 2ab + b^2\\), \\(a^2 - b^2 = (a - b)(a + b)\\).",
        ["\\(\\frac{2}{3} + \\frac{1}{6} \\times \\frac{3}{5} = \\frac{2}{3} + \\frac{1}{10} = \\frac{23}{30}\\).", "\\(102^2 - 98^2 = 4 \\times 200 = 800\\).", "\\(+20\\,\\%\\) puis \\(+10\\,\\%\\) : \\(1{,}2 \\times 1{,}1 = 1{,}32\\), soit \\(+32\\,\\%\\)."],
        "Deux évolutions successives ne s'additionnent pas : \\(+20\\,\\%\\) puis \\(-20\\,\\%\\) donne \\(-4\\,\\%\\)."],
      probs: ADP },
    { id: "vecgeo", theme: "es", label: "Translations et vecteurs", ex: "\\overrightarrow{AB} = \\overrightarrow{DC} \\iff ABCD \\text{ parallélogramme}", FR: [9, 9], againFR: [10], g: VG,
      hint: "La translation qui transforme A en B déplace chaque point du même déplacement : le vecteur AB. AB = DC ⇔ ABCD est un parallélogramme. Coordonnées de AB : (x_B − x_A ; y_B − y_A).",
      comps: ["Image par une translation, parallélogramme", "Somme de vecteurs, milieu, enchaîner deux translations", "Vecteurs égaux avec un paramètre, centre, règle du parallélogramme"],
      lesson: ["Translations et vecteurs", "La translation qui transforme \\(A\\) en \\(B\\) fait glisser toute la figure dans la même direction, le même sens, de la même longueur : c'est le vecteur \\(\\overrightarrow{AB}\\).",
        "\\(\\overrightarrow{AB} = \\overrightarrow{DC}\\) signifie que \\(ABCD\\) est un parallélogramme (éventuellement aplati). Enchaîner les translations de vecteurs \\(\\vec{u}\\) et \\(\\vec{v}\\) revient à faire la translation de vecteur \\(\\vec{u} + \\vec{v}\\) ; relation de Chasles : \\(\\overrightarrow{AB} + \\overrightarrow{BC} = \\overrightarrow{AC}\\). Dans un repère, \\(\\overrightarrow{AB}\\) a pour coordonnées \\((x_B - x_A \\,;\\, y_B - y_A)\\).",
        ["\\(A(1 \\,;\\, 2)\\), \\(B(4 \\,;\\, 3)\\) : la translation de vecteur \\(\\overrightarrow{AB}\\) envoie \\(C(0 \\,;\\, 5)\\) en \\((3 \\,;\\, 6)\\)."],
        "Pour \\(ABCD\\), c'est \\(\\overrightarrow{AB} = \\overrightarrow{DC}\\) (et non \\(\\overrightarrow{CD}\\)) : l'ordre des lettres compte."] },
    { id: "tabvar", theme: "fa", label: "Tableaux de variations", ex: "\\nearrow \\ \\searrow", FR: [10, 12], g: TV,
      hint: "Une flèche qui monte : f croissante ; qui descend : f décroissante. Les extremums se lisent aux sommets des flèches et aux bornes. Sur une flèche, f prend une fois chaque valeur comprise entre ses deux extrémités.",
      comps: ["Lire extremums et sens de variation, comparer deux images", "Nombre de solutions de f(x) = k, extremum sur une partie, zéros", "Forme canonique, intervalle des valeurs, solutions sur une partie"],
      lesson: ["Tableau de variations", "Un tableau de variations résume le sens de variation d'une fonction : une flèche par intervalle où elle est monotone.",
        "\\(f\\) croissante sur \\(I\\) : si \\(a < b\\) dans \\(I\\), alors \\(f(a) \\leqslant f(b)\\) (l'ordre est conservé) ; décroissante : l'ordre est inversé. Le maximum (minimum) sur un intervalle se lit parmi les valeurs aux sommets des flèches et aux bornes. Sur une flèche, chaque valeur comprise entre les deux extrémités est atteinte exactement une fois (si la fonction est strictement monotone et continue).",
        ["Tableau \\(-3 \\nearrow 5 \\searrow -1\\) : maximum 5 ; l'équation \\(f(x) = 2\\) a deux solutions."],
        "La première ligne contient les \\(x\\), la seconde les valeurs de \\(f\\) : un intervalle de variation se lit sur les \\(x\\)."],
      probs: TVP },
  ]);
})();
