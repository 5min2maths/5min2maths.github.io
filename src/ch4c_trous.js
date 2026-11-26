// 25.11 (agent trous) · 4e du Collège de Genève (grade 15) : derniers savoir-faire calculables du référentiel matu.
//  - geoesp : géométrie dans l'espace (4.GV.04a–d, « sujet à choix » de MA1) : diagonales, volumes, perspective cavalière,
//    angles dans un solide, sections planes (nature et dimensions), troncs, angle entre deux faces. Chapitre M4C07.
//  - densite (MA2, niv R) : variables aléatoires continues, densité, lois uniforme et exponentielle (4.PS.03e), M4C04.
//  - approxnorm (MA2, niv R) : approximation de la loi binomiale par la loi normale, correction de continuité, table de
//    Φ donnée dans l'énoncé (4.PS.04d), M4C04.
// Standard : 3 niveaux, ≥ 3 formes par niveau, pas à pas, pièges, ctx, leçon, leçon active (« À toi »), 3 compétences,
// problème de niveau 4. Outils : TRX (src/trx.js). Paquet de chargement « 15 » (build.py : préfixe ch4c).
(function () {
  if (typeof NOTIONS === "undefined" || typeof GEN === "undefined" || typeof TRX === "undefined") return;
  const { pk, nz, r6, fT, fS, dT, rd, QN, QR, P, GR, GRad, TR, reg, W, toi, solid } = TRX;
  const deg = (v) => (Math.atan(v) * 180) / Math.PI;
  const cm = (v) => M(nb(v) + "\\text{ cm}");
  const RS = (k, m) => (k === 1 ? "" : nb(k)) + "\\sqrt{" + m + "}", RC = (k, m) => (k === 1 ? "" : k) + "√" + m;
  /* pavé ABCDEFGH (A en bas devant à gauche, E au-dessus de A) ; arêtes cachées : celles qui partent de D */
  const PAVE = (a, b, c) => ({ A: [0, 0, 0], B: [a, 0, 0], C: [a, b, 0], D: [0, b, 0], E: [0, 0, c], F: [a, 0, c], G: [a, b, c], H: [0, b, c] });
  const PE = [["A", "B"], ["B", "C"], ["C", "D", 1], ["D", "A", 1], ["E", "F"], ["F", "G"], ["G", "H"], ["H", "E"], ["A", "E"], ["B", "F"], ["C", "G"], ["D", "H", 1]];
  const paveFig = (a, b, c, o = {}) => solid(Object.assign({ pts: PAVE(a, b, c), edges: PE, lab: o.lab || "pavé droit ABCDEFGH" }, o));
  /* pyramide régulière SABCD à base carrée, centre O de la base */
  const pyrFig = (c, h, o = {}) => { const pts = { A: [0, 0, 0], B: [c, 0, 0], C: [c, c, 0], D: [0, c, 0], S: [c / 2, c / 2, h], O: [c / 2, c / 2, 0] };
    Object.assign(pts, o.more || {});
    return solid({ pts, edges: [["A", "B"], ["B", "C"], ["C", "D", 1], ["D", "A", 1], ["S", "A"], ["S", "B"], ["S", "C"], ["S", "D", 1]], accent: o.accent || [["S", "O", 1]], polys: o.polys, marks: o.marks, labels: o.labels || ["A", "B", "C", "D", "S", "O"], lab: o.lab || "pyramide régulière SABCD" }); };

  // ======================= geoesp : géométrie dans l'espace (4.GV.04a–d) =======================
  const QUAD = [[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11], [6, 6, 7, 11], [3, 4, 12, 13], [2, 10, 11, 15], [2, 5, 14, 15], [8, 9, 12, 17], [1, 12, 12, 17]];
  const TRI = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [4, 3, 5], [12, 5, 13], [12, 9, 15]];
  const GE = {
    1: [
      () => { const q0 = pk(QUAD), k = q0[3] <= 9 ? pk([1, 2]) : 1, [a, b, c, d] = q0.map((v) => v * k), ord = pk([[a, b, c], [b, c, a], [c, a, b]]), [x, y, z] = ord, ac2 = x * x + y * y;
        return QN("Un pavé droit " + M("ABCDEFGH") + " a pour dimensions " + M("AB = " + x) + " cm, " + M("BC = " + y) + " cm et " + M("AE = " + z) + " cm. Calcule la longueur de sa diagonale " + M("[AG]") + " (en cm).", d,
          "Dans la base, " + M("AC^2 = " + x + "^2 + " + y + "^2 = " + ac2) + ". Le triangle " + M("ACG") + " est rectangle en " + M("C") + " : " + M("AG^2 = " + ac2 + " + " + z + "^2 = " + d * d) + ", donc " + M("AG = " + d) + " cm.",
          { ctx: "diag-pave", fig: paveFig(x, y, z, { accent: [["A", "G", 1], ["A", "C", 1]] }),
            guide: [GR(M("AC^2") + " (diagonale de la base, au carré) ?", ac2, M(x + "^2 + " + y + "^2 = " + ac2) + "."), GR(M("AG^2") + " ?", d * d, M(ac2 + " + " + z * z + " = " + d * d) + "."), GR(M("AG") + " ?", d, M("\\sqrt{" + d * d + "} = " + d) + " cm.")],
            traps: [TR(x + y + z, "La diagonale n'est pas la somme des arêtes : deux fois Pythagore."), TR(Math.sqrt(ac2), "Ça, c'est la diagonale de la base [AC] ; continue dans le triangle ACG."), TR(d * d, "C'est AG² : prends la racine.")] }); },
      () => { const a = R.int(2, 12), v = a * Math.sqrt(3);
        return QN("Un cube a des arêtes de " + M(a) + " cm. Calcule la longueur de sa grande diagonale (valeur exacte, touche √).", v,
          "Diagonale d'une face : " + M(RS(a, 2)) + ". Puis " + M("d^2 = (" + RS(a, 2) + ")^2 + " + a + "^2 = " + 3 * a * a) + ", donc " + M("d = " + RS(a, 3)) + " cm (en général " + M("d = a\\sqrt{3}") + ").",
          { ctx: "diag-cube", radical: true, canon: RC(a, 3), fig: paveFig(a, a, a, { accent: [["A", "G", 1]], lab: "cube ABCDEFGH" }),
            guide: [GRad("Diagonale d'une face (valeur exacte) ?", a * Math.SQRT2, M(RS(a, 2)) + " cm."), GR(M("d^2") + " ?", 3 * a * a, M(2 * a * a + " + " + a * a + " = " + 3 * a * a) + "."), GRad(M("d") + " (valeur exacte) ?", v, M(RS(a, 3)) + " cm.")],
            traps: [TR(a * Math.SQRT2, "C'est la diagonale d'une face ; la grande diagonale traverse le cube."), TR(3 * a, "√(3a²) = a√3, pas 3a."), TR(3 * a * a, "C'est d² : prends la racine.")] }); },
      () => { const [m, h, ap] = pk(TRI), c = 2 * m, v = (c * c * h) / 3;
        return QN("Une pyramide régulière à base carrée a une base de côté " + M(c) + " cm. La hauteur de chaque face latérale (apothème, du sommet au milieu d'un côté de la base) mesure " + M(ap) + " cm. Calcule le volume de la pyramide (en cm³).", v,
          "Le triangle formé par le sommet " + M("S") + ", le centre " + M("O") + " de la base et le milieu d'un côté est rectangle en " + M("O") + " : " + M("h^2 = " + ap + "^2 - " + m + "^2 = " + h * h) + ", " + M("h = " + h) + ". " + M("V = \\frac{" + c + "^2 \\cdot " + h + "}{3} = " + nb(v)) + " cm³.",
          { ctx: "vol-pyr-apotheme", fig: pyrFig(c, h, { more: { M: [c / 2, 0, 0] }, accent: [["S", "O", 1], ["S", "M"], ["O", "M", 1]], labels: ["A", "B", "C", "D", "S", "O", "M"] }),
            guide: [GR("Hauteur " + M("h = SO") + " (Pythagore avec l'apothème et la demi-base) ?", h, M("\\sqrt{" + ap * ap + " - " + m * m + "} = " + h) + " cm."), GR("Aire de la base ?", c * c, M(c * c) + " cm²."), GR("Volume ?", v, M("\\frac{" + c * c + " \\cdot " + h + "}{3} = " + nb(v)) + " cm³.")],
            traps: [TR((c * c * ap) / 3, "L'apothème n'est pas la hauteur de la pyramide : calcule SO avec Pythagore."), TR(c * c * h, "Volume d'une pyramide : aire de la base × hauteur ÷ 3."), TR((c * c * h) / 2, "On divise par 3, pas par 2.")] }); },
      () => { const kk = pk([0.5, 0.6, 0.7]), L = kk === 0.5 ? pk([6, 8, 9, 10, 14]) : pk([5, 10, 15, 20]), m = r6(L * kk), real = R.rand() < 0.5;
        const intro = "On dessine un pavé en perspective cavalière : la face avant est en vraie grandeur, les arêtes fuyantes sont tracées à 45° et réduites par le coefficient " + M(dT(kk)) + ". ";
        return real
          ? QN(intro + "Sur le dessin, une arête fuyante mesure " + M(nb(m)) + " cm. Quelle est sa longueur réelle (en cm) ?", L, "Longueur dessinée = longueur réelle × " + String(kk).replace(".", ",") + ", donc " + M("\\text{réelle} = " + nb(m) + " \\div " + dT(kk) + " = " + L) + " cm.",
            { ctx: "perspective-reelle", fig: paveFig(4, 3, 2.5, { labels: [] }), guide: [GR("Longueur réelle = longueur dessinée ÷ coefficient ?", L, M(nb(m) + " \\div " + dT(kk) + " = " + L) + " cm.")],
              traps: [TR(r6(m * kk), "Le dessin réduit les fuyantes : pour revenir à la réalité, on divise par le coefficient."), TR(r6(m * Math.SQRT2), "L'angle de 45° ne change pas la longueur : seul le coefficient de réduction compte.")] })
          : QN(intro + "Une arête fuyante mesure " + M(L) + " cm en réalité. Quelle longueur a-t-elle sur le dessin (en cm) ?", m, "Longueur dessinée = " + M(L + " \\cdot " + dT(kk) + " = " + nb(m)) + " cm. Les arêtes de face, elles, gardent leur vraie longueur.",
            { ctx: "perspective-dessin", fig: paveFig(4, 3, 2.5, { labels: [] }), guide: [GR("Longueur dessinée = longueur réelle × coefficient ?", m, M(nb(m)) + " cm.")],
              traps: [TR(r6(L / kk), "On multiplie par le coefficient (le dessin est plus petit), on ne divise pas."), TR(r6(L * Math.SQRT1_2), "45° est l'angle de tracé ; le coefficient est " + String(kk).replace(".", ",") + ".")] }); },
    ],
    2: [
      () => { const [a, b, d0] = pk(TRI), c = pk([2, 3, 4, 5, 6, 8]), v = deg(c / d0);
        return QR("Un pavé droit " + M("ABCDEFGH") + " mesure " + M("AB = " + a) + " cm, " + M("BC = " + b) + " cm et " + M("AE = " + c) + " cm. Calcule l'angle entre la diagonale " + M("[AG]") + " et la base " + M("ABCD") + " (en degrés, au dixième).", v, 0.1,
          "La projection de " + M("[AG]") + " sur la base est " + M("[AC]") + ", avec " + M("AC = \\sqrt{" + a + "^2 + " + b + "^2} = " + d0) + ". Dans le triangle " + M("ACG") + " rectangle en " + M("C") + " : " + M("\\tan\\alpha = \\frac{CG}{AC} = \\frac{" + c + "}{" + d0 + "}") + ", " + M("\\alpha \\approx " + dT(rd(v, 0.1), 1) + "°") + ".",
          { ctx: "angle-diag-base", fig: paveFig(a, b, c, { accent: [["A", "G", 1], ["A", "C", 1]] }),
            guide: [GR(M("AC") + " (projection de la diagonale sur la base) ?", d0, M(d0) + " cm."), GR("Angle " + M("\\widehat{CAG}") + " (au dixième de degré) ?", v, M("\\arctan\\frac{" + c + "}{" + d0 + "} \\approx " + dT(rd(v, 0.1), 1) + "°") + ".", 0.1)],
            traps: [TR(deg(c / a), "L'angle avec la base se mesure avec la projection [AC], pas avec l'arête [AB]."), TR(90 - v, "C'est l'angle avec l'arête verticale ; l'angle avec la base est son complément."), TR(deg(c / Math.hypot(d0, c)), "Dans ACG, la tangente est CG ÷ AC (côté opposé ÷ côté adjacent).")] }); },
      () => { const c = pk([4, 6, 8, 10, 12]), h = pk([3, 4, 5, 6, 7, 9]), oa = (c * Math.SQRT2) / 2, v = deg(h / oa);
        return QR("Une pyramide régulière " + M("SABCD") + " a une base carrée de côté " + M(c) + " cm et une hauteur " + M("SO = " + h) + " cm. Calcule l'angle entre l'arête " + M("[SA]") + " et la base (en degrés, au dixième).", v, 0.1,
          M("O") + " est le centre du carré : " + M("OA = \\frac{" + c + "\\sqrt{2}}{2} \\approx " + dT(rd(oa, 0.01), 2)) + ". Dans " + M("SOA") + " rectangle en " + M("O") + " : " + M("\\tan\\alpha = \\frac{" + h + "}{OA}") + ", " + M("\\alpha \\approx " + dT(rd(v, 0.1), 1) + "°") + ".",
          { ctx: "angle-arete-base", fig: pyrFig(c, h, { accent: [["S", "O", 1], ["O", "A", 1]] }),
            guide: [GR(M("OA") + " (demi-diagonale de la base, au centième) ?", oa, M("\\frac{" + c + "\\sqrt{2}}{2} \\approx " + dT(rd(oa, 0.01), 2)) + " cm.", 0.01), GR("Angle " + M("\\widehat{SAO}") + " (au dixième) ?", v, M("\\approx " + dT(rd(v, 0.1), 1) + "°") + ".", 0.1)],
            traps: [TR(deg(h / (c / 2)), "Avec la demi-base, on obtient l'angle entre une face et la base ; pour l'arête, prends la demi-diagonale OA."), TR(90 - v, "C'est l'angle entre l'arête et la hauteur."), TR(deg(h / c), "La projection de [SA] sur la base est [OA], la demi-diagonale.")] }); },
      () => { const a = R.int(2, 12), s = a * Math.SQRT2, v = (Math.sqrt(3) / 2) * a * a;
        return QR("On coupe un cube " + M("ABCDEFGH") + " d'arête " + M(a) + " cm par le plan qui passe par les sommets " + M("B") + ", " + M("D") + " et " + M("E") + ". Calcule l'aire de la section (en cm², au centième).", v, 0.01,
          "Les côtés " + M("[BD]") + ", " + M("[DE]") + ", " + M("[EB]") + " sont des diagonales de faces : " + M(RS(a, 2)) + " cm chacune. La section est un triangle équilatéral : " + M("\\mathcal{A} = \\frac{\\sqrt{3}}{4} \\cdot (" + RS(a, 2) + ")^2 = \\frac{\\sqrt{3}}{2} \\cdot " + a * a + " \\approx " + dT(rd(v, 0.01), 2)) + " cm².",
          { ctx: "section-triangle", fig: paveFig(a, a, a, { polys: [["B", "D", "E"]], accent: [["B", "D", 1], ["D", "E", 1], ["E", "B"]], lab: "cube coupé par le plan BDE" }),
            guide: [GRad("Côté " + M("BD") + " de la section (valeur exacte) ?", s, M(RS(a, 2)) + " cm : c'est une diagonale de face."), GR("Aire du triangle équilatéral (au centième) ?", v, M("\\frac{\\sqrt{3}}{4} \\cdot " + 2 * a * a + " \\approx " + dT(rd(v, 0.01), 2)) + " cm².", 0.01)],
            traps: [TR((a * a) / 2, "Le triangle BDE n'est pas rectangle : ses trois côtés sont des diagonales de faces, il est équilatéral."), TR((Math.sqrt(3) / 4) * a * a, "Le côté de la section est a√2, pas a."), TR(a * a * Math.SQRT2, "C'est l'aire du rectangle diagonal ; ici la section est un triangle.")] }); },
      () => { const [a, b, d0] = pk(TRI), c = pk([3, 4, 5, 6, 7, 9, 10]), v = d0 * c;
        return QN("Un pavé droit " + M("ABCDEFGH") + " mesure " + M("AB = " + a) + " cm, " + M("BC = " + b) + " cm et " + M("AE = " + c) + " cm. On le coupe par le plan qui contient les arêtes " + M("[AE]") + " et " + M("[CG]") + ". Calcule l'aire de la section (en cm²).", v,
          "La section " + M("ACGE") + " est un rectangle de côtés " + M("AE = " + c) + " et " + M("AC = \\sqrt{" + a + "^2 + " + b + "^2} = " + d0) + " : " + M("\\mathcal{A} = " + d0 + " \\cdot " + c + " = " + v) + " cm².",
          { ctx: "section-diagonale", fig: paveFig(a, b, c, { polys: [["A", "C", "G", "E"]], accent: [["A", "C", 1], ["E", "G"]], lab: "pavé coupé par le plan ACGE" }),
            guide: [GR("Nature de la section : un rectangle. Longueur de " + M("[AC]") + " ?", d0, M(d0) + " cm."), GR("Aire du rectangle " + M("ACGE") + " ?", v, M(d0 + " \\cdot " + c + " = " + v) + " cm².")],
            traps: [TR(a * c, "Le rectangle a pour largeur la diagonale AC de la base, pas l'arête AB."), TR(a * b, "C'est l'aire de la base ; la section est verticale."), TR((d0 * c) / 2, "La section est un rectangle, pas un triangle.")] }); },
    ],
    3: [
      () => { const [h, t] = pk([[6, 2], [6, 4], [8, 2], [8, 6], [9, 3], [9, 6], [10, 5], [12, 4], [12, 8], [15, 5], [15, 10]]), c = pk([6, 9, 12, 15, 18]), kq = (h - t) / h, s = c * kq, v = s * s;
        return QN("Une pyramide régulière à base carrée a une base de côté " + M(c) + " cm et une hauteur de " + M(h) + " cm. On la coupe par un plan parallèle à la base, à " + M(t) + " cm au-dessus de la base. Calcule l'aire de la section (en cm²).", r6(v),
          "La section est un carré, réduction de la base de rapport " + M("k = \\frac{" + (h - t) + "}{" + h + "}" + (Number.isInteger(kq * 100) ? "" : "")) + " (distance au sommet ÷ hauteur). Côté " + M(nb(r6(s))) + " cm ; aire " + M(fT(r6(v))) + " cm² (" + M("= k^2 \\cdot " + c * c) + ").",
          { ctx: "section-parallele-pyr", fig: pyrFig(6, 6, { more: { A1: [3 * (1 - kq), 3 * (1 - kq), t * 6 / h], B1: [3 + 3 * kq, 3 * (1 - kq), t * 6 / h], C1: [3 + 3 * kq, 3 + 3 * kq, t * 6 / h], D1: [3 * (1 - kq), 3 + 3 * kq, t * 6 / h] }, polys: [["A1", "B1", "C1", "D1"]], labels: ["A", "B", "C", "D", "S", "O"], lab: "pyramide coupée parallèlement à sa base" }),
            guide: [GR("Rapport de réduction " + M("k") + " (distance du sommet à la section ÷ hauteur) ?", kq, M("\\frac{" + (h - t) + "}{" + h + "} = " + fT(kq)) + "."), GR("Côté de la section (en cm) ?", s, M(fT(kq) + " \\cdot " + c + " = " + nb(r6(s))) + " cm."), GR("Aire de la section ?", v, M(fT(r6(v))) + " cm².")],
            traps: [TR(c * c * kq, "Les aires sont multipliées par k², pas par k."), TR((c * t / h) ** 2, "Le rapport se mesure depuis le sommet : (" + h + " − " + t + ") ÷ " + h + "."), TR(c * c, "La section est plus petite que la base : c'est une réduction.")] }); },
      () => { const r = pk([3, 4, 5, 6, 8, 10]), h = pk([6, 8, 9, 12, 15]), kq = pk([0.5, 1 / 3, 2 / 3]), Vb = (Math.PI * r * r * h) / 3, v = Vb * (1 - kq ** 3);
        return QR("Un cône de révolution a un rayon de base de " + M(r) + " cm et une hauteur de " + M(h) + " cm. On le coupe par un plan parallèle à la base qui passe aux " + M(fT(kq)) + " de la hauteur en partant du sommet. Calcule le volume du tronc de cône restant sous le plan (en cm³, à l'unité).", v, 1,
          "Petit cône : réduction de rapport " + M("k = " + fT(kq)) + ", son volume est " + M("k^3 = " + fT(r6(kq ** 3))) + " fois celui du grand. " + M("V_{\\text{grand}} = \\frac{\\pi \\cdot " + r * r + " \\cdot " + h + "}{3} \\approx " + dT(rd(Vb, 0.1), 1)) + " ; tronc " + M("\\approx " + dT(rd(Vb, 0.1), 1) + " \\cdot \\left(1 - " + fT(r6(kq ** 3)) + "\\right) \\approx " + nb(Math.round(v))) + " cm³.",
          { ctx: "tronc-cone", fig: FIG.cone ? FIG.cone("r = " + r + " cm", "h = " + h + " cm") : undefined,
            guide: [GR("Volume du grand cône (au dixième) ?", Vb, M("\\approx " + dT(rd(Vb, 0.1), 1)) + " cm³.", 0.1), GR("Volume du petit cône (" + M("k^3") + " fois le grand, au dixième) ?", Vb * kq ** 3, M("\\approx " + dT(rd(Vb * kq ** 3, 0.1), 1)) + " cm³.", 0.1), GR("Volume du tronc (à l'unité) ?", v, M("\\approx " + nb(Math.round(v))) + " cm³.", 1)],
            traps: [TR(Vb * (1 - kq), "Les volumes sont multipliés par k³ : le petit cône vaut k³ fois le grand."), TR(Vb * kq ** 3, "C'est le volume du petit cône ; on demande le tronc, ce qui reste."), TR(Vb * (1 - kq * kq), "Pour un volume, le rapport est au cube.")] }); },
      () => { const a = 2 * R.int(1, 6), s = (a / 2) * Math.SQRT2, v = ((3 * Math.sqrt(3)) / 2) * s * s;
        return QR("On coupe un cube d'arête " + M(a) + " cm par le plan qui passe par les milieux de six de ses arêtes (plan médiateur d'une grande diagonale). La section est un hexagone régulier. Calcule son aire (en cm², au centième).", v, 0.01,
          "Chaque côté de l'hexagone joint les milieux de deux arêtes d'une même face : " + M("s = \\frac{" + a + "\\sqrt{2}}{2} = " + RS(a / 2, 2)) + ". Un hexagone régulier, c'est six triangles équilatéraux : " + M("\\mathcal{A} = 6 \\cdot \\frac{\\sqrt{3}}{4} s^2 = \\frac{3\\sqrt{3}}{2} \\cdot " + nb(r6(s * s)) + " \\approx " + dT(rd(v, 0.01), 2)) + " cm².",
          { ctx: "section-hexagone", fig: (() => { const h = a / 2, pts = Object.assign(PAVE(a, a, a), { I: [h, 0, 0], J: [a, 0, h], K: [a, h, a], L: [h, a, a], N: [0, a, h], Q: [0, h, 0] }); return solid({ pts, edges: PE, polys: [["I", "J", "K", "L", "N", "Q"]], labels: ["A", "B", "C", "D", "E", "F", "G", "H"], lab: "cube et section hexagonale" }); })(),
            guide: [GRad("Côté de l'hexagone (valeur exacte) ?", s, M(RS(a / 2, 2)) + " cm."), GR("Aire d'un des six triangles équilatéraux (au centième) ?", (Math.sqrt(3) / 4) * s * s, M("\\frac{\\sqrt{3}}{4} \\cdot " + nb(r6(s * s)) + " \\approx " + dT(rd((Math.sqrt(3) / 4) * s * s, 0.01), 2)) + " cm².", 0.01), GR("Aire de l'hexagone (au centième) ?", v, M("\\approx " + dT(rd(v, 0.01), 2)) + " cm².", 0.01)],
            traps: [TR(6 * s * s, "L'hexagone se découpe en six triangles équilatéraux, pas en six carrés."), TR(((3 * Math.sqrt(3)) / 2) * a * a, "Le côté de l'hexagone est la moitié d'une diagonale de face, pas l'arête du cube."), TR((Math.sqrt(3) / 4) * s * s, "C'est un seul des six triangles.")] }); },
      () => { const c = pk([4, 6, 8, 10, 12]), h = pk([3, 4, 5, 6, 8]), v = deg(h / (c / 2));
        return QR("Une pyramide régulière " + M("SABCD") + " a une base carrée de côté " + M(c) + " cm et une hauteur de " + M(h) + " cm. Calcule l'angle entre une face latérale et la base (en degrés, au dixième).", v, 0.1,
          "Soit " + M("M") + " le milieu de " + M("[AB]") + " : " + M("(SM)") + " et " + M("(OM)") + " sont perpendiculaires à " + M("(AB)") + ", l'angle cherché est " + M("\\widehat{SMO}") + ". " + M("OM = " + nb(c / 2)) + " ; " + M("\\tan\\beta = \\frac{" + h + "}{" + nb(c / 2) + "}") + ", " + M("\\beta \\approx " + dT(rd(v, 0.1), 1) + "°") + ".",
          { ctx: "angle-faces", fig: pyrFig(c, h, { more: { M: [c / 2, 0, 0] }, accent: [["S", "O", 1], ["S", "M"], ["O", "M", 1]], labels: ["A", "B", "C", "D", "S", "O", "M"] }),
            guide: [GR(M("OM") + " (centre de la base → milieu d'un côté) ?", c / 2, M(nb(c / 2)) + " cm."), GR("Angle " + M("\\widehat{SMO}") + " (au dixième) ?", v, M("\\arctan\\frac{" + h + "}{" + nb(c / 2) + "} \\approx " + dT(rd(v, 0.1), 1) + "°") + ".", 0.1)],
            traps: [TR(deg(h / ((c * Math.SQRT2) / 2)), "Avec la demi-diagonale OA, c'est l'angle d'une arête avec la base ; pour une face, prends OM, perpendiculaire à l'arête de base."), TR(90 - v, "C'est l'angle entre la face et la hauteur."), TR(deg(h / c), "OM vaut la moitié du côté.")] }); },
    ],
  };

  // ======================= densite : variables aléatoires continues (4.PS.03e, MA2) =======================
  const UNIF = [["Le temps d'attente d'un bus (en minutes) suit une loi uniforme sur", "attente"], ["L'heure d'arrivée d'un colis (en heures après 8 h) suit une loi uniforme sur", "colis"], ["La position (en m) d'une panne sur un câble suit une loi uniforme sur", "cable"]];
  const EXPO = [["La durée de vie (en années) d'un composant électronique", "composant"], ["Le temps d'attente (en minutes) avant l'appel suivant dans un centre d'appels", "appels"], ["La distance (en centaines de km) parcourue par un vélo de location avant une crevaison" /* 26.11 soir : une crevaison tous les 2 km en moyenne n'est pas vraisemblable */, "crevaison"]];
  const DE = {
    1: [
      () => { const c0 = pk(UNIF), a = R.int(0, 4), L = pk([4, 5, 6, 8, 10, 12]), b = a + L; let c, d; do { c = R.int(a, b - 1); d = R.int(c + 1, b); } while (d - c === L || d - c === L / 2); const v = (d - c) / L;
        return QN(c0[0] + " " + M("[" + a + " \\,;\\, " + b + "]") + ". Calcule " + M("P(" + c + " \\le X \\le " + d + ")") + " (fraction acceptée).", v,
          "Densité constante " + M("f(x) = \\frac{1}{" + L + "}") + " sur l'intervalle : la probabilité est l'aire du rectangle " + M("(" + d + " - " + c + ") \\cdot \\frac{1}{" + L + "} = " + fT(v)) + ".",
          { ctx: "uniforme-" + c0[1], guide: [GR("Valeur de la densité " + M("f(x)") + " sur " + M("[" + a + " \\,;\\, " + b + "]") + " ?", 1 / L, M("\\frac{1}{" + L + "}") + " (aire totale 1)."), GR(M("P(" + c + " \\le X \\le " + d + ")") + " ?", v, M(fT(v)) + ".")],
            traps: [TR(a ? (d - c) / b : 1 / L, a ? "On divise par la longueur de l'intervalle " + b + " − " + a + ", pas par " + b + "." : "C'est la densité ; multiplie par la longueur de l'intervalle."), TR(d / L, "La probabilité est proportionnelle à la longueur " + d + " − " + c + "."), TR(d - c, "Une probabilité est comprise entre 0 et 1 : divise par " + L + ".")] }); },
      () => { const b = pk([2, 3, 4, 5, 6, 10]), v = 2 / (b * b);
        return QN("Pour quelle valeur de " + M("k") + " la fonction " + M("f(x) = kx") + " sur " + M("[0 \\,;\\, " + b + "]") + " (et " + M("f(x) = 0") + " ailleurs) est-elle une densité de probabilité ? (fraction acceptée)", v,
          "L'aire sous la courbe doit valoir 1 : " + M("\\int_0^{" + b + "} kx\\,dx = k \\cdot \\frac{" + b + "^2}{2} = " + fT(b * b / 2) + "k = 1") + ", donc " + M("k = " + fT(v)) + ".",
          { ctx: "constante-lineaire", guide: [GR(M("\\int_0^{" + b + "} x\\,dx") + " ?", (b * b) / 2, M("\\frac{" + b * b + "}{2} = " + fT(b * b / 2)) + "."), GR(M("k") + " ?", v, M("k = " + fT(v)) + ".")],
            traps: [TR(1 / (b * b), "∫ x dx = x²/2 : n'oublie pas le facteur 1/2."), TR(1 / b, "Une densité linéaire n'est pas uniforme : écris que l'intégrale vaut 1."), TR((b * b) / 2, "C'est la valeur de l'intégrale ; k est son inverse.")] }); },
      () => { const b = pk([2, 3, 4, 5, 6]), v = 3 / b ** 3;
        return QN("Pour quelle valeur de " + M("k") + " la fonction " + M("f(x) = kx^2") + " sur " + M("[0 \\,;\\, " + b + "]") + " (et " + M("f(x) = 0") + " ailleurs) est-elle une densité de probabilité ? (fraction acceptée)", v,
          M("\\int_0^{" + b + "} kx^2\\,dx = k \\cdot \\frac{" + b + "^3}{3} = 1") + ", donc " + M("k = \\frac{3}{" + b ** 3 + "} = " + fT(v)) + ".",
          { ctx: "constante-carre", guide: [GR(M("\\int_0^{" + b + "} x^2\\,dx") + " ?", b ** 3 / 3, M("\\frac{" + b ** 3 + "}{3}") + "."), GR(M("k") + " ?", v, M(fT(v)) + ".")],
            traps: [TR(1 / b ** 3, "∫ x² dx = x³/3 : le 3 passe au numérateur de k."), TR(2 / (b * b), "C'est la constante pour kx ; ici la densité est kx²."), TR(b ** 3 / 3, "C'est l'intégrale ; k en est l'inverse.")] }); },
    ],
    2: [
      () => { const b = pk([4, 5, 6, 8, 10]); let c, d; do { c = R.int(0, b - 2); d = R.int(c + 1, b); } while (d === b && c === 0); const v = (d * d - c * c) / (b * b);
        return QN("La variable aléatoire " + M("X") + " a pour densité " + M("f(x) = \\frac{2x}{" + b * b + "}") + " sur " + M("[0 \\,;\\, " + b + "]") + " (0 ailleurs). Calcule " + M("P(" + c + " \\le X \\le " + d + ")") + " (fraction acceptée).", v,
          "Une primitive de " + M("f") + " est " + M("F(x) = \\frac{x^2}{" + b * b + "}") + " : " + M("P = F(" + d + ") - F(" + c + ") = \\frac{" + d * d + " - " + c * c + "}{" + b * b + "} = " + fT(v)) + ".",
          { ctx: "proba-lineaire", guide: [GR(M("F(" + d + ") = \\frac{" + d + "^2}{" + b * b + "}") + " ?", (d * d) / (b * b), M(fT((d * d) / (b * b))) + "."), GR(M("P(" + c + " \\le X \\le " + d + ")") + " ?", v, M(fT(v)) + ".")],
            traps: [TR((d - c) / b, "La densité n'est pas constante : intègre f entre " + c + " et " + d + "."), TR((d * d - c * c) / (2 * b * b), "Primitive de 2x : x² (pas x²/2)."), TR(((d - c) * (d - c)) / (b * b), "F(" + d + ") − F(" + c + ") = (" + d + "² − " + c + "²) ÷ " + b * b + ", pas (" + d + " − " + c + ")².")] }); },
      () => { const c0 = pk(EXPO), m = pk([2, 4, 5, 10, 20]), lam = 1 / m, t = pk([1, 2, 3]) * (m >= 10 ? m / 2 : 1), up = R.rand() < 0.5, e = Math.exp(-lam * t), v = up ? e : 1 - e;
        return QR(c0[0] + " suit une loi exponentielle de densité " + M("f(x) = \\lambda e^{-\\lambda x}") + " (" + M("x \\ge 0") + "), avec " + M("\\lambda = " + fT(lam)) + ". Calcule " + M(up ? "P(X > " + nb(t) + ")" : "P(X \\le " + nb(t) + ")") + " (au millième).", v, 0.001,
          M("P(X \\le t) = \\int_0^{t} \\lambda e^{-\\lambda x}dx = 1 - e^{-\\lambda t}") + ". Ici " + M("\\lambda t = " + fT(r6(lam * t))) + " : " + M((up ? "P(X > " + nb(t) + ") = e^{-" + fT(r6(lam * t)) + "}" : "1 - e^{-" + fT(r6(lam * t)) + "}") + " \\approx " + dT(rd(v, 0.001), 3)) + ".",
          { ctx: "exponentielle-" + c0[1], guide: [GR(M("\\lambda t") + " ?", lam * t, M(fT(r6(lam * t))) + "."), GR("Probabilité (au millième) ?", v, M("\\approx " + dT(rd(v, 0.001), 3)) + ".", 0.001)],
            traps: [TR(up ? 1 - e : e, up ? "C'est P(X ≤ " + nb(t) + ") ; on demande le contraire." : "C'est P(X > " + nb(t) + ") = e^(−λt) ; P(X ≤ t) = 1 − e^(−λt)."), TR(lam * t, "Une probabilité se calcule avec l'exponentielle : 1 − e^(−λt)."), TR(up ? Math.exp(-t / lam) : 1 - Math.exp(-t / lam), "λ = " + fS(lam) + " multiplie t : e^(−λt).")] }); },
      () => { const b = pk([3, 4, 5, 6, 9, 12]), v = (2 * b) / 3;
        return QN("La variable aléatoire " + M("X") + " a pour densité " + M("f(x) = \\frac{2x}{" + b * b + "}") + " sur " + M("[0 \\,;\\, " + b + "]") + " (0 ailleurs). Calcule son espérance " + M("E(X)") + " (fraction acceptée).", v,
          M("E(X) = \\int_0^{" + b + "} x f(x)\\,dx = \\frac{2}{" + b * b + "}\\int_0^{" + b + "} x^2\\,dx = \\frac{2}{" + b * b + "} \\cdot \\frac{" + b ** 3 + "}{3} = " + fT(v)) + ".",
          { ctx: "esperance-lineaire", guide: [GR(M("\\int_0^{" + b + "} x^2\\,dx") + " ?", b ** 3 / 3, M("\\frac{" + b ** 3 + "}{3}") + "."), GR(M("E(X)") + " ?", v, M(fT(v)) + ".")],
            traps: [TR(b / 2, "Ce serait l'espérance d'une loi uniforme ; ici les grandes valeurs sont plus probables."), TR((2 * b * b) / 3, "E(X) = ∫ x·f(x) dx : simplifie par " + b * b + "."), TR(b / 3, "∫ x · 2x/" + b * b + " dx = 2" + b + "/3.")] }); },
      () => { const b = pk([2, 4, 5, 6, 8, 10]), v = b / Math.SQRT2;
        return QR("La variable aléatoire " + M("X") + " a pour densité " + M("f(x) = \\frac{2x}{" + b * b + "}") + " sur " + M("[0 \\,;\\, " + b + "]") + ". Calcule sa médiane " + M("m") + ", telle que " + M("P(X \\le m) = \\frac{1}{2}") + " (au centième).", v, 0.01,
          M("P(X \\le m) = \\frac{m^2}{" + b * b + "} = \\frac{1}{2}") + ", donc " + M("m^2 = " + nb(b * b / 2)) + " et " + M("m = \\frac{" + b + "}{\\sqrt{2}} \\approx " + dT(rd(v, 0.01), 2)) + ".",
          { ctx: "mediane", guide: [GR(M("m^2") + " ?", (b * b) / 2, M(nb(b * b / 2)) + "."), GR(M("m") + " (au centième) ?", v, M("\\approx " + dT(rd(v, 0.01), 2)) + ".", 0.01)],
            traps: [TR(b / 2, "La médiane n'est pas le milieu de l'intervalle : la densité n'est pas constante."), TR((2 * b) / 3, "C'est l'espérance ; la médiane partage l'aire en deux moitiés."), TR((b * b) / 2, "C'est m² : prends la racine.")] }); },
    ],
    3: [
      () => { const a = R.int(0, 6), L = pk([2, 3, 4, 6, 12]), b = a + L, E = (a + b) / 2, E2 = (a * a + a * b + b * b) / 3, v = (L * L) / 12;
        return QN("La variable aléatoire " + M("X") + " suit une loi uniforme sur " + M("[" + a + " \\,;\\, " + b + "]") + ". Calcule sa variance " + M("V(X) = E(X^2) - E(X)^2") + " (fraction acceptée).", v,
          M("E(X) = " + fT(E)) + " ; " + M("E(X^2) = \\frac{1}{" + L + "}\\int_{" + a + "}^{" + b + "} x^2\\,dx = \\frac{" + b ** 3 + " - " + a ** 3 + "}{" + 3 * L + "} = " + fT(E2)) + " ; " + M("V(X) = " + fT(E2) + " - " + fT(E * E) + " = " + fT(v)) + " (en général " + M("\\frac{(b - a)^2}{12}") + ").",
          { ctx: "variance-uniforme", guide: [GR(M("E(X)") + " ?", E, M(fT(E)) + "."), GR(M("E(X^2)") + " ?", E2, M(fT(E2)) + "."), GR(M("V(X)") + " ?", v, M(fT(v)) + ".")],
            traps: [TR(E2, "C'est E(X²) ; retire encore E(X)²."), TR((L * L) / 4, "V = (b − a)² ÷ 12 pour une loi uniforme."), TR(L / 12, "La variance fait intervenir le carré de la longueur.")] }); },
      () => { const c0 = pk(EXPO), m = pk([2, 4, 5, 8, 10]), v = m * Math.LN2;
        return QR(c0[0] + " suit une loi exponentielle de moyenne " + M("E(X) = " + m) + ". Calcule sa médiane, la valeur " + M("t") + " telle que " + M("P(X \\le t) = \\frac{1}{2}") + " (au centième).", v, 0.01,
          "Pour une loi exponentielle, " + M("E(X) = \\frac{1}{\\lambda}") + ", donc " + M("\\lambda = \\frac{1}{" + m + "}") + ". " + M("1 - e^{-\\lambda t} = \\frac{1}{2} \\iff t = \\frac{\\ln 2}{\\lambda} = " + m + "\\ln 2 \\approx " + dT(rd(v, 0.01), 2)) + " : la moitié des cas s'arrêtent avant la moyenne.",
          { ctx: "exponentielle-mediane-" + c0[1], guide: [GR(M("\\lambda") + " ?", 1 / m, M(fT(1 / m)) + "."), GR("Médiane (au centième) ?", v, M(m + "\\ln 2 \\approx " + dT(rd(v, 0.01), 2)) + ".", 0.01)],
            traps: [TR(m, "La médiane d'une loi exponentielle est plus petite que la moyenne : t = ln 2 ÷ λ."), TR(m / 2, "Résous 1 − e^(−λt) = 1/2 avec ln."), TR(Math.LN2 / m, "λ = 1/" + m + " : t = ln 2 ÷ λ = " + m + " ln 2.")] }); },
      () => { const b = pk([2, 3, 4, 6]), [fr, num] = pk([[3, 7 / 27], [4, 5 / 32]]), x0 = b / fr, k = 6 / b ** 3;
        return QN("La variable aléatoire " + M("X") + " a pour densité " + M("f(x) = kx(" + b + " - x)") + " sur " + M("[0 \\,;\\, " + b + "]") + " (0 ailleurs). Calcule " + M("P(X \\le " + fT(x0) + ")") + " (fraction acceptée).", num,
          M("\\int_0^{" + b + "} x(" + b + " - x)\\,dx = \\frac{" + b ** 3 + "}{6}") + ", donc " + M("k = " + fT(k)) + ". Puis " + M("P = k\\left[\\frac{" + b + "x^2}{2} - \\frac{x^3}{3}\\right]_0^{" + fT(x0) + "} = " + fT(num)) + ".",
          { ctx: "densite-parabole", guide: [GR(M("k") + " ?", k, M(fT(k)) + "."), GR(M("P(X \\le " + fT(x0) + ")") + " ?", num, M(fT(num)) + ".")],
            traps: [TR(1 / fr, "La densité n'est pas constante : intègre f de 0 à " + fS(x0) + "."), TR(num * 2, "Vérifie k : l'aire totale doit valoir 1."), TR(1 - num, "C'est P(X > " + fS(x0) + ").")] }); },
      () => { const c0 = pk(EXPO), lam = pk([0.1, 0.2, 0.25, 0.5]), s = pk([2, 3, 4]), t = pk([1, 2, 4]), v = Math.exp(-lam * t);
        return QR(c0[0] + " suit une loi exponentielle de paramètre " + M("\\lambda = " + dT(lam)) + ". Sachant que " + M("X > " + s) + ", quelle est la probabilité que " + M("X > " + (s + t)) + " ? (au millième)", v, 0.001,
          M("P_{X > " + s + "}(X > " + (s + t) + ") = \\frac{P(X > " + (s + t) + ")}{P(X > " + s + ")} = \\frac{e^{-" + dT(r6(lam * (s + t))) + "}}{e^{-" + dT(r6(lam * s)) + "}} = e^{-" + dT(r6(lam * t)) + "} \\approx " + dT(rd(v, 0.001), 3)) + " : la loi exponentielle est « sans mémoire ».",
          { ctx: "sans-memoire-" + c0[1], guide: [GR(M("P(X > " + (s + t) + ")") + " (au millième) ?", Math.exp(-lam * (s + t)), M("e^{-" + dT(r6(lam * (s + t))) + "} \\approx " + dT(rd(Math.exp(-lam * (s + t)), 0.001), 3)) + ".", 0.001), GR("Probabilité conditionnelle (au millième) ?", v, M("e^{-" + dT(r6(lam * t)) + "} \\approx " + dT(rd(v, 0.001), 3)) + ".", 0.001)],
            traps: [TR(Math.exp(-lam * (s + t)), "C'est P(X > " + (s + t) + ") sans condition ; divise par P(X > " + s + ")."), TR(Math.exp(-lam * s), "Ce qui compte, c'est la durée supplémentaire " + t + ", pas " + s + "."), TR(1 - v, "On demande X > " + (s + t) + ", la survie.")] }); },
    ],
  };

  // ======================= approxnorm : loi binomiale → loi normale (4.PS.04d, MA2) =======================
  /* Φ(z) = P(Z ≤ z), Z centrée réduite (Abramowitz-Stegun 7.1.26, erreur < 2·10⁻⁷) */
  const Phi = (z) => { const x = Math.abs(z) / Math.SQRT2, t = 1 / (1 + 0.3275911 * x), y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return z >= 0 ? (1 + y) / 2 : (1 - y) / 2; };
  const ph4 = (z) => +Phi(z).toFixed(4);
  /* table de Φ (4 décimales) pour les valeurs z données, triées */
  const tab = (zs) => "On donne " + [...new Set(zs.map((z) => r6(z)))].sort((a, b) => a - b).map((z) => M("\\Phi(" + dT(z, 3) + ") \\approx " + dT(ph4(z), 4))).join(" ; ") + ", où " + M("\\Phi(z) = P(Z \\le z)") + ".";
  /* [n, p, σ, contexte] : σ = √(np(1 − p)) tel que 0,5/σ ait au plus deux décimales */
  const NP = [[100, 0.5, 5, "On lance " + 100 + " fois une pièce équilibrée ; " + M("X") + " est le nombre de « pile »."], [400, 0.5, 10, "On lance 400 fois une pièce équilibrée ; " + M("X") + " est le nombre de « pile »."],
    [625, 0.8, 10, "On sème 625 graines ; chacune germe avec la probabilité 0,8, indépendamment des autres ; " + M("X") + " est le nombre de graines qui germent."], [625, 0.2, 10, "625 élèves répondent au hasard à une même question à 5 choix ; " /* 26.11 soir : un QCM de 625 questions n'existe pas */ + M("X") + " est le nombre de bonnes réponses."],
    [1600, 0.5, 20, "Dans une ville, 50 % des habitants approuvent un projet ; on interroge 1'600 personnes au hasard ; " + M("X") + " compte celles qui l'approuvent."], [2500, 0.2, 20, "Un fabricant sait que 20 % de ses clients rappellent le service après-vente ; sur 2'500 clients, " + M("X") + " compte ceux qui rappellent."],
    [25, 0.5, 2.5, "On lance 25 fois une pièce équilibrée ; " + M("X") + " est le nombre de « face »."]];
  /* 26.11 (vraisemblance) : X compte des issues, k est entier ; avec n = 25 (μ = 12,5), k = μ + 1 donnait « P(X ≤ 13.5) » et une
     correction de continuité fausse (13,5 + 0,5). Les k partent de la partie entière de μ. */
  const NP2 = NP.filter((c) => c[2] <= 10); /* z = (k ± 0,5 − μ) ÷ σ à deux décimales au plus (table) */
  const AN = {
    1: [
      () => { const C = pk([[100, 0.8, "On sème 100 graines qui germent chacune avec la probabilité 0,8"], [400, 0.8, "On sème 400 graines qui germent chacune avec la probabilité 0,8"], [400, 0.1, "Une machine produit 400 pièces, chacune défectueuse avec la probabilité 0,1"],
          [900, 0.1, "Une machine produit 900 pièces, chacune défectueuse avec la probabilité 0,1"], [400, 0.9, "Une compagnie vend 400 billets ; chaque passager se présente avec la probabilité 0,9"], [48, 0.25, "Un QCM compte 48 questions à 4 choix, auxquelles on répond au hasard"], [100, 0.5, "On lance 100 fois une pièce équilibrée"]]), [n, p] = C, mu = n * p, V = n * p * (1 - p), s = Math.sqrt(V);
        return QN(C[2] + ". Le nombre " + M("X") + " de succès suit la loi " + M("B(" + n + " \\,;\\, " + dT(p) + ")") + ", qu'on approche par une loi normale " + M("N(\\mu \\,;\\, \\sigma)") + ". Donne " + M("\\sigma") + ".", s,
          M("\\mu = np = " + nb(mu)) + " ; " + M("\\sigma = \\sqrt{np(1 - p)} = \\sqrt{" + nb(mu) + " \\cdot " + dT(r6(1 - p)) + "} = \\sqrt{" + nb(r6(V)) + "} = " + nb(s)) + ".",
          { ctx: "parametres-sigma", guide: [GR(M("\\mu = np") + " ?", mu, M(nb(mu)) + "."), GR("Variance " + M("np(1 - p)") + " ?", V, M(nb(r6(V))) + "."), GR(M("\\sigma") + " ?", s, M(nb(s)) + ".")],
            traps: [TR(V, "C'est la variance ; l'écart-type en est la racine."), TR(Math.sqrt(mu), "σ = √(np(1 − p)) : n'oublie pas le facteur 1 − p."), TR(mu, "C'est la moyenne μ.")] }); },
      () => { const C = pk(NP), [n, p, s] = C, mu = n * p, [k, v, lab] = pk([[1, 84, "\\mu + \\sigma"], [2, 97.5, "\\mu + 2\\sigma"], [-1, 16, "\\mu - \\sigma"], [-2, 2.5, "\\mu - 2\\sigma"]]), b = mu + k * s;
        return QN(C[3] + " On approche " + M("X") + " par une variable " + M("Y") + " de loi normale de même moyenne et de même écart-type. D'après la règle 68-95-99,7, que vaut environ " + M("P(Y \\le " + nb(b) + ")") + " (en %) ?", v,
          M("\\mu = " + nb(mu)) + ", " + M("\\sigma = " + nb(s)) + " : " + M(nb(b) + " = " + lab) + ". " + (Math.abs(k) === 1 ? "68 % entre μ − σ et μ + σ, donc 34 % de chaque côté, et 50 % sous μ" : "95 % entre μ − 2σ et μ + 2σ, donc 47,5 % de chaque côté, et 50 % sous μ") + " : " + M(nb(v) + "\\,\\%") + ".",
          { ctx: "regle-68-95", guide: [GR("Combien d'écarts-types séparent " + M(nb(b)) + " de la moyenne " + M(nb(mu)) + " ? (signe compris)", k, M("\\frac{" + nb(b) + " - " + nb(mu) + "}{" + nb(s) + "} = " + k) + "."), GR(M("P(Y \\le " + nb(b) + ")") + " en % ?", v, M(nb(v) + "\\,\\%") + ".")],
            traps: [TR(Math.abs(k) === 1 ? 68 : 95, "C'est la part de l'intervalle centré ; ici on veut tout ce qui est sous " + nb(b) + "."), TR(Math.abs(k) === 1 ? 34 : 47.5, "Ajoute la moitié sous la moyenne (50 %)."), TR(100 - v, "Tu as pris l'autre côté.")] }); },
      () => { const C = pk(NP), [n, p, s] = C, mu = n * p, k = Math.floor(mu) + pk([1, 2, 3, 4]) * (s / 2.5), z = (k + 0.5 - mu) / s;
        return QN(C[3] + " On approche " + M("P(X \\le " + k + ")") + " par " + M("P(Y \\le " + k + "{,}5)") + ", où " + M("Y") + " suit la loi normale de moyenne " + M("\\mu = np") + " et d'écart-type " + M("\\sigma = \\sqrt{np(1 - p)}") + " (correction de continuité). Calcule la valeur centrée réduite " + M("z = \\frac{" + k + "{,}5 - \\mu}{\\sigma}") + ".", z,
          M("\\mu = " + nb(mu)) + ", " + M("\\sigma = " + nb(s)) + " : " + M("z = \\frac{" + nb(k + 0.5) + " - " + nb(mu) + "}{" + nb(s) + "} = " + nb(r6(z))) + ".",
          { ctx: "correction-z", guide: [GR(M("\\mu") + " ?", mu, M(nb(mu)) + "."), GR(M("\\sigma") + " ?", s, M(nb(s)) + "."), GR(M("z") + " ?", z, M(nb(r6(z))) + ".")],
            traps: [TR((k - mu) / s, "Avec la correction de continuité, on part de " + k + ",5, pas de " + k + "."), TR((k - 0.5 - mu) / s, "Pour X ≤ " + k + ", on ajoute 0,5 (on englobe le bâton de " + k + ")."), TR(k + 0.5 - mu, "Divise par σ = " + String(s).replace(".", ",") + ".")] }); },
    ],
    2: [
      () => { const C = pk(NP2), [n, p, s] = C, mu = n * p, k = Math.floor(mu) + R.int(1, 3) * (s === 2.5 ? 1 : s / 5) * pk([1, 2]), zc = (k + 0.5 - mu) / s, v = ph4(zc);
        return QR(C[3] + " On approche " + M("X") + " par une loi normale (avec correction de continuité). " + tab([zc, (k - mu) / s, (k - 0.5 - mu) / s]) + " Calcule une valeur approchée de " + M("P(X \\le " + k + ")") + " (au millième).", v, 0.001,
          M("\\mu = " + nb(mu)) + ", " + M("\\sigma = " + nb(s)) + ". " + M("P(X \\le " + k + ") \\approx P(Y \\le " + nb(k + 0.5) + ") = \\Phi\\left(\\frac{" + nb(k + 0.5) + " - " + nb(mu) + "}{" + nb(s) + "}\\right) = \\Phi(" + dT(zc, 3) + ") \\approx " + dT(v, 4)) + ".",
          { ctx: "proba-inf", guide: [GR(M("z") + " (avec la correction de continuité) ?", zc, M(dT(zc, 3)) + "."), GR(M("P(X \\le " + k + ")") + " (au millième) ?", v, M("\\Phi(" + dT(zc, 3) + ") \\approx " + dT(v, 4)) + ".", 0.001)],
            traps: [TR(ph4((k - mu) / s), "Correction de continuité : P(X ≤ " + k + ") ≈ P(Y ≤ " + k + ",5)."), TR(ph4((k - 0.5 - mu) / s), "Pour « ≤ " + k + " », on ajoute 0,5 : la valeur " + k + " est comprise."), TR(1 - v, "Φ donne la probabilité d'être en dessous de z.")] }); },
      () => { const C = pk(NP2), [n, p, s] = C, mu = n * p, k = Math.floor(mu) + R.int(1, 3) * (s === 2.5 ? 1 : s / 5) * pk([1, 2]), zc = (k - 0.5 - mu) / s, v = 1 - ph4(zc);
        return QR(C[3] + " On approche " + M("X") + " par une loi normale (avec correction de continuité). " + tab([zc, (k - mu) / s, (k + 0.5 - mu) / s]) + " Calcule une valeur approchée de " + M("P(X \\ge " + k + ")") + " (au millième).", r6(v), 0.001,
          M("P(X \\ge " + k + ") \\approx P(Y \\ge " + nb(k - 0.5) + ") = 1 - \\Phi(" + dT(zc, 3) + ") \\approx 1 - " + dT(ph4(zc), 4) + " = " + dT(r6(v), 4)) + ".",
          { ctx: "proba-sup", guide: [GR(M("z") + " pour la borne corrigée " + M(nb(k - 0.5)) + " ?", zc, M(dT(zc, 3)) + "."), GR(M("P(X \\ge " + k + ")") + " (au millième) ?", r6(v), M("1 - " + dT(ph4(zc), 4) + " = " + dT(r6(v), 4)) + ".", 0.001)],
            traps: [TR(ph4(zc), "Φ(z) est la probabilité d'être en dessous ; « au moins » : 1 − Φ(z)."), TR(1 - ph4((k + 0.5 - mu) / s), "Pour « ≥ " + k + " », la borne corrigée est " + k + " − 0,5."), TR(1 - ph4((k - mu) / s), "N'oublie pas la correction de continuité (" + k + " − 0,5).")] }); },
      () => { const C = pk(NP2), [n, p, s] = C, mu = n * p, k = Math.floor(mu) + R.int(1, 3) * (s === 2.5 ? 1 : s / 5) * pk([1, 2]), zc = (k - 0.5 - mu) / s, v = ph4(zc);
        return QR(C[3] + " On approche " + M("X") + " par une loi normale (avec correction de continuité). " + tab([zc, (k - mu) / s, (k + 0.5 - mu) / s]) + " Calcule une valeur approchée de " + M("P(X < " + k + ")") + " (au millième).", v, 0.001,
          "Inégalité stricte : " + M("P(X < " + k + ") = P(X \\le " + (k - 1) + ") \\approx P(Y \\le " + nb(k - 0.5) + ") = \\Phi(" + dT(zc, 3) + ") \\approx " + dT(v, 4)) + ".",
          { ctx: "proba-stricte", guide: [GR("Plus grande valeur entière de " + M("X") + " permise ?", k - 1, M(k - 1) + "."), GR(M("z") + " (borne " + M(nb(k - 0.5)) + ") ?", zc, M(dT(zc, 3)) + "."), GR("Probabilité (au millième) ?", v, M("\\approx " + dT(v, 4)) + ".", 0.001)],
            traps: [TR(ph4((k + 0.5 - mu) / s), "X < " + k + " exclut " + k + " : la borne corrigée est " + k + " − 0,5."), TR(ph4((k - mu) / s), "Applique la correction de continuité."), TR(1 - v, "On veut les valeurs inférieures à " + k + ".")] }); },
    ],
    3: [
      () => { const C = pk(NP2.filter((c) => Number.isInteger(c[0] * c[1]))) /* 26.11 : intervalle centré sur μ entier (et non « P(10.5 ≤ X ≤ 14.5) ») */, [n, p, s] = C, mu = n * p, d = R.int(1, 3) * (s === 2.5 ? 1 : s / 5) * pk([1, 2]), zc = (d + 0.5) / s, v = r6(2 * ph4(zc) - 1);
        return QR(C[3] + " On approche " + M("X") + " par une loi normale (avec correction de continuité). " + tab([zc, d / s, (d - 0.5) / s]) + " Calcule une valeur approchée de " + M("P(" + (mu - d) + " \\le X \\le " + (mu + d) + ")") + " (au millième).", v, 0.001,
          M("P \\approx P(" + nb(mu - d - 0.5) + " \\le Y \\le " + nb(mu + d + 0.5) + ") = \\Phi(" + dT(zc, 3) + ") - \\Phi(-" + dT(zc, 3) + ") = 2\\Phi(" + dT(zc, 3) + ") - 1 \\approx " + dT(v, 4)) + ".",
          { ctx: "proba-intervalle", guide: [GR(M("z") + " pour la borne " + M(nb(mu + d + 0.5)) + " ?", zc, M(dT(zc, 3)) + "."), GR("Probabilité (au millième) ?", v, M("2 \\cdot " + dT(ph4(zc), 4) + " - 1 = " + dT(v, 4)) + ".", 0.001)],
            traps: [TR(ph4(zc), "Φ(z) compte tout ce qui est sous " + nb(mu + d + 0.5) + " ; retire ce qui est sous " + nb(mu - d - 0.5) + "."), TR(r6(2 * ph4(d / s) - 1), "Correction de continuité : élargis l'intervalle de 0,5 de chaque côté."), TR(r6(ph4(zc) - 0.5), "Par symétrie, l'intervalle centré vaut 2Φ(z) − 1.")] }); },
      () => { const [n, p, s] = pk([[400, 0.9, 6], [100, 0.5, 5], [400, 0.5, 10]]) /* 26.11 (vraisemblance) : vol, 90 % de présence et ≈ 10 % de surréservation (et non 625 billets pour 505 places) */, mu = n * p, S = mu + pk([1, 2]) * (s === 5 ? 5 : s / 2) + (s === 5 ? 0 : pk([0, s / 2])), zc = (S + 0.5 - mu) / s, v = r6(1 - ph4(zc));
        const ctxT = p === 0.9 ? "Une compagnie vend " + nb(n) + " billets pour un vol de " + nb(S) + " places ; chaque passager se présente avec la probabilité 0,9, indépendamment des autres." : "Un atelier gratuit accepte " + nb(n) + " inscriptions pour " + nb(S) + " places, car en moyenne un inscrit sur deux ne vient pas : chaque inscrit vient avec la probabilité 0,5, indépendamment des autres." /* 26.11 (vraisemblance) : un hôtel ne prend pas presque deux fois plus de réservations que de chambres */;
        return QR(ctxT + " " + tab([zc, (S - mu) / s, (S - 0.5 - mu) / s]) + " Avec l'approximation normale (correction de continuité), calcule la probabilité qu'il y ait plus de personnes que de places (au millième).", v, 0.001,
          M("X \\sim B(" + n + " \\,;\\, " + dT(p) + ")") + ", " + M("\\mu = " + nb(mu)) + ", " + M("\\sigma = " + nb(s)) + ". Trop de monde : " + M("X \\ge " + (S + 1)) + ", soit " + M("P(Y \\ge " + nb(S + 0.5) + ") = 1 - \\Phi(" + dT(zc, 3) + ") \\approx " + dT(v, 4)) + ".",
          { ctx: "surreservation", guide: [GR(M("\\mu") + " ?", mu, M(nb(mu)) + "."), GR(M("\\sigma") + " ?", s, M(nb(s)) + "."), GR(M("z") + " pour la borne corrigée " + M(nb(S + 0.5)) + " ?", zc, M(dT(zc, 3)) + "."), GR("Probabilité (au millième) ?", v, M("\\approx " + dT(v, 4)) + ".", 0.001)],
            traps: [TR(ph4(zc), "C'est la probabilité que tout le monde ait une place ; on demande le contraire."), TR(r6(1 - ph4((S - 0.5 - mu) / s)), "Trop de monde, c'est au moins " + (S + 1) + " personnes : borne corrigée " + S + ",5."), TR(r6(1 - ph4((S - mu) / s)), "Applique la correction de continuité.")] }); },
      () => { const C = pk(NP), [n, p, s] = C, mu = n * p, b = mu + 1.96 * s - 0.5, k = Math.ceil(b - 1e-9);
        return QN(C[3] + " On approche " + M("X") + " par une loi normale (avec correction de continuité) ; on donne " + M("\\Phi(1{,}96) \\approx 0{,}975") + ". Quel est le plus petit entier " + M("k") + " tel que " + M("P(X \\le k) \\ge 0{,}975") + " ?", k,
          M("P(X \\le k) \\approx \\Phi\\left(\\frac{k + 0{,}5 - " + nb(mu) + "}{" + nb(s) + "}\\right) \\ge 0{,}975 \\iff k + 0{,}5 \\ge " + nb(mu) + " + 1{,}96 \\cdot " + nb(s) + " = " + nb(r6(mu + 1.96 * s))) + ", donc " + M("k \\ge " + nb(r6(b))) + " : " + M("k = " + k) + ".",
          { ctx: "seuil", guide: [GR(M("\\mu + 1{,}96\\sigma") + " ?", r6(mu + 1.96 * s), M(nb(r6(mu + 1.96 * s))) + "."), GR("Plus petit entier " + M("k") + " (" + M("k + 0{,}5") + " doit dépasser cette valeur) ?", k, M(k) + ".")],
            traps: [TR(Math.ceil(mu + 1.96 * s), "Correction de continuité : c'est k + 0,5 qui doit atteindre μ + 1,96σ."), TR(Math.floor(b), "On cherche le plus petit entier au-dessus de " + String(r6(b)).replace(".", ",") + "."), TR(Math.ceil(mu + 2 * s - 0.5) === k ? Math.ceil(mu + s) : Math.ceil(mu + 2 * s - 0.5), "Utilise z = 1,96, la valeur de la table.")] }); },
    ],
  };

  // ---------- problèmes (niveau 4) ----------
  const PROBS = {
    geoesp: [() => { const c = pk([4, 6]), h = pk([3, 4]), oa = (c * Math.SQRT2) / 2, sa = Math.hypot(h, oa);
      return P("Une tente a la forme d'une pyramide régulière à base carrée de côté " + c + " m et de hauteur " + h + " m.", [["a) Longueur d'une arête latérale (m, au centième)", sa, 0.01], ["b) Angle entre une face et le sol (°, au dixième)", deg(h / (c / 2)), 0.1], ["c) Volume (m³)", (c * c * h) / 3]],
        ["Arête : Pythagore avec la demi-diagonale de la base.", "Face : utilise le milieu d'un côté de la base."], "a) " + M("\\sqrt{" + h * h + " + " + nb(r6(oa * oa)) + "} \\approx " + dT(rd(sa, 0.01), 2)) + " m ; b) " + M("\\arctan\\frac{" + h + "}{" + c / 2 + "} \\approx " + dT(rd(deg(h / (c / 2)), 0.1), 1) + "°") + " ; c) " + M("\\frac{" + c * c + " \\cdot " + h + "}{3} = " + nb((c * c * h) / 3)) + " m³.", pyrFig(c, h)); }],
    densite: [() => { const b = pk([4, 10]), half = b / 2;
      return P("La durée (en minutes) d'un appel suit la densité " + M("f(x) = kx") + " sur " + M("[0 \\,;\\, " + b + "]") + " (0 ailleurs).", [["a) Valeur de k (fraction acceptée)", 2 / (b * b)], ["b) P(X ≤ " + half + ")", 0.25], ["c) Durée moyenne E(X) (min, fraction acceptée)", (2 * b) / 3]],
        ["Aire totale = 1.", "E(X) = ∫ x f(x) dx."], "a) " + M("k = \\frac{2}{" + b * b + "}") + " ; b) " + M("\\frac{" + half + "^2}{" + b * b + "} = \\frac{1}{4}") + " ; c) " + M("\\frac{2 \\cdot " + b + "}{3} = " + fT((2 * b) / 3)) + " min."); }],
    /* 26.11 soir (vraisemblance, décision de l'enseignant du 26.11 : présence 0,9, surréservation de quelques places) :
       avant, 625 billets pour 515 places avec une présence de 0,8 (110 billets de trop). */
    /* 26.11 (agent defis2) : un seul énoncé figé jusque-là ; 3 contextes, valeurs tirées (z exact à 3 décimales au plus, table de Φ
       donnée), présence 0,9 et surréservation de quelques places pour les vols (décision du 26.11). */
    approxnorm: [
      () => { const [n, mu, s, S] = pk([[100, 90, 3, 91], [100, 90, 3, 94], [100, 90, 3, 97], [400, 360, 6, 361], [400, 360, 6, 367], [400, 360, 6, 370]]), zc = (S + 0.5 - mu) / s, ph = ph4(zc), v = r6(1 - ph);
        return Object.assign(P("Une compagnie vend " + n + " billets pour un vol de " + S + " places ; chaque passager se présente avec la probabilité 0,9, indépendamment des autres. On donne " + M("\\Phi(" + dT(zc, 3) + ") \\approx " + dT(ph, 4)) + ".", [["a) Nombre moyen de passagers μ", mu], ["b) Écart-type σ", s], ["c) Probabilité de surréservation (au dix-millième, avec la table)", v, 0.0001]],
          ["σ = √(" + n + " · 0,9 · 0,1).", "Trop de passagers : X ≥ " + (S + 1) + ", borne corrigée " + S + ",5."], "a) " + M(n + " \\cdot 0{,}9 = " + mu) + " ; b) " + M("\\sqrt{" + n + " \\cdot 0{,}9 \\cdot 0{,}1} = \\sqrt{" + s * s + "} = " + s) + " ; c) " + M("P(Y \\ge " + nb(S + 0.5) + ") = 1 - \\Phi\\left(\\frac{" + nb(S + 0.5) + " - " + mu + "}{" + s + "}\\right) = 1 - \\Phi(" + dT(zc, 3) + ") \\approx " + dT(v, 4)) + "."), { ctx: "surreservation" }); },
      () => { const [n, mu, s, j] = pk([[100, 80, 4, 1], [100, 80, 4, 3], [100, 80, 4, 5], [100, 80, 4, 7], [625, 500, 10, 4], [625, 500, 10, 9], [625, 500, 10, 14], [625, 500, 10, 19]]), k = mu - j, zc = (mu - k + 0.5) / s, v = ph4(zc), qui = n === 100 ? "Un sachet contient 100 graines" : "Un maraîcher sème 625 graines";
        return Object.assign(P(qui + " ; chacune germe avec la probabilité 0,8, indépendamment des autres. On approche le nombre X de graines qui germent par une loi normale (avec correction de continuité). On donne " + M("\\Phi(" + dT(zc, 3) + ") \\approx " + dT(v, 4)) + ".", [["a) Moyenne μ", mu], ["b) Écart-type σ", s], ["c) Probabilité qu'au moins " + k + " graines germent (au dix-millième, avec la table)", v, 0.0001]],
          ["σ = √(np(1 − p)).", "Au moins " + k + " : X ≥ " + k + ", borne corrigée " + (k - 1) + ",5 ; par symétrie, P(Z ≥ −z) = Φ(z)."],
          "a) " + M(n + " \\cdot 0{,}8 = " + mu) + " ; b) " + M("\\sqrt{" + n + " \\cdot 0{,}8 \\cdot 0{,}2} = \\sqrt{" + s * s + "} = " + s) + " ; c) " + M("P(Y \\ge " + nb(k - 0.5) + ") = P\\left(Z \\ge -" + dT(zc, 3) + "\\right) = \\Phi(" + dT(zc, 3) + ") \\approx " + dT(v, 4)) + "."), { ctx: "germination" }); },
      () => { const [n, mu, s, d, cx] = pk([[100, 50, 5, 2, 0], [100, 50, 5, 4, 0], [100, 50, 5, 7, 0], [400, 200, 10, 9, 0], [400, 200, 10, 14, 0], [1600, 800, 20, 19, 1], [1600, 800, 20, 39, 1]]), zc = (d + 0.5) / s, ph = ph4(zc), v = r6(2 * ph - 1);
        const T = cx ? "Dans une ville, la moitié des habitants approuvent un projet. On interroge " + nb(n) + " personnes au hasard ; X compte celles qui l'approuvent." : "On lance " + n + " fois une pièce équilibrée ; X est le nombre de « pile ».";
        return Object.assign(P(T + " On approche X par une loi normale (avec correction de continuité). On donne " + M("\\Phi(" + dT(zc, 3) + ") \\approx " + dT(ph, 4)) + ".", [["a) Moyenne μ", mu], ["b) Écart-type σ", s], ["c) " + M("P(" + (mu - d) + " \\le X \\le " + (mu + d) + ")") + " (au dix-millième, avec la table)", v, 0.0001]],
          ["σ = √(n · 0,5 · 0,5).", "Correction de continuité : on élargit l'intervalle de 0,5 de chaque côté ; par symétrie, P = 2Φ(z) − 1."],
          "a) " + M(nb(n) + " \\cdot 0{,}5 = " + mu) + " ; b) " + M("\\sqrt{" + nb(n) + " \\cdot 0{,}25} = " + s) + " ; c) " + M("P(" + nb(mu - d - 0.5) + " \\le Y \\le " + nb(mu + d + 0.5) + ") = 2\\Phi(" + dT(zc, 3) + ") - 1 \\approx " + dT(v, 4)) + "."), { ctx: "intervalle-centre" }); },
    ],
  };

  // ---------- notions ----------
  reg([
    { id: "geoesp", theme: "es", label: "Géométrie dans l'espace : solides, sections", ex: "d = \\sqrt{a^2 + b^2 + c^2}", CH: [15], lv: GE, probs: PROBS.geoesp,
      hint: "Ramène chaque calcul à un triangle rectangle : diagonale de la base, puis diagonale du solide (Pythagore deux fois). Angle avec un plan : angle avec la projection sur ce plan. Section parallèle à la base d'une pyramide ou d'un cône : réduction de rapport k (longueurs × k, aires × k², volumes × k³).",
      lesson: ["Géométrie dans l'espace", "Trouver le bon triangle rectangle caché dans le solide.",
        "Diagonale d'un pavé \\(a \\times b \\times c\\) : \\(d = \\sqrt{a^2 + b^2 + c^2}\\) (cube : \\(a\\sqrt{3}\\)). L'angle entre une droite et un plan est l'angle entre la droite et sa projection sur le plan : on le calcule dans un triangle rectangle (tangente, sinus ou cosinus). L'angle entre deux plans se mesure avec deux droites perpendiculaires à leur droite commune (pour une face de pyramide : la hauteur de la face et le segment du centre au milieu du côté). Section plane : on cherche les points où le plan coupe les arêtes ; sa nature (triangle, rectangle, hexagone…) se lit sur les longueurs. Un plan parallèle à la base d'une pyramide ou d'un cône donne une réduction de la base, de rapport \\(k\\) = distance au sommet ÷ hauteur. En perspective cavalière, la face avant est en vraie grandeur et les fuyantes sont réduites.",
        ["Pavé \\(2 \\times 3 \\times 6\\) : \\(d = \\sqrt{4 + 9 + 36} = 7\\)", "Pyramide de base \\(6 \\times 6\\), hauteur 4 : angle face-base \\(\\arctan\\frac{4}{3} \\approx 53{,}1°\\)"],
        "L'angle avec la base se calcule avec la projection (diagonale de la base, demi-diagonale…), pas avec une arête quelconque."],
      comps: ["Diagonales, volumes, perspective cavalière", "Angles dans un solide ; sections d'un cube ou d'un pavé", "Sections parallèles, tronc de cône, section hexagonale, angle entre deux faces"],
      act: { retiens: { regle: "Diagonale d'un pavé : Pythagore deux fois, \\(d^2 = a^2 + b^2 + c^2\\). L'angle entre une droite et un plan se calcule avec sa projection sur le plan.", exemple: ["Pavé \\(2 \\times 3 \\times 6\\) : \\(d^2 = 4 + 9 + 36 = 49\\), \\(d = 7\\).", "Cube d'arête 4 : \\(d = 4\\sqrt{3} \\approx 6{,}93\\)."], piege: "La diagonale n'est pas la somme des arêtes, et l'angle avec la base se mesure avec la diagonale de la base, pas avec une arête." },
        predict: { q: "Dans un cube d'arête 1, la grande diagonale mesure…", choices: ["environ 1,73 (√3)", "3", "environ 1,41 (√2)"], good: 0, why: "Diagonale d'une face : √2 ; puis √(2 + 1) = √3 ≈ 1,73. √2 est la diagonale d'une face seulement." },
        defis: ["Un pavé mesure 2 cm × 3 cm × 6 cm. Tape la longueur de sa diagonale.", "Dans ce pavé, la diagonale de la base mesure √13 ≈ 3,61 cm. Tape l'angle (en degrés, à l'unité) entre la diagonale du pavé et la base."],
        play: toi(["d² = 2² + 3² + 6²", "tan α = 6 ÷ √13"], [W(7, "√(4 + 9 + 36) = √49 = 7 cm."), W(59, "arctan(6 ÷ 3,61) ≈ 59° : la diagonale monte raide, car la hauteur 6 est grande.")]) } },
    { id: "densite", niv: "R", theme: "no", label: "Variables aléatoires continues (densité)", ex: "P(a \\le X \\le b) = \\int_a^b f(x)\\,dx", CH: [15], lv: DE, probs: PROBS.densite,
      hint: "Une densité f est positive et son intégrale totale vaut 1 (ce qui fixe une constante k). P(a ≤ X ≤ b) = ∫ f de a à b (une aire) ; P(X = a) = 0. E(X) = ∫ x f(x) dx. Uniforme sur [a ; b] : f = 1/(b − a). Exponentielle : P(X ≤ t) = 1 − e^(−λt), E(X) = 1/λ.",
      lesson: ["Variables aléatoires continues", "Quand X peut prendre toutes les valeurs d'un intervalle, la probabilité devient une aire.",
        "Une densité \\(f\\) vérifie \\(f(x) \\ge 0\\) et \\(\\int_{-\\infty}^{+\\infty} f(x)\\,dx = 1\\). Alors \\(P(a \\le X \\le b) = \\int_a^b f(x)\\,dx\\) (et \\(P(X = a) = 0\\) : « \\(\\le\\) » ou « \\(<\\) », c'est pareil). Espérance \\(E(X) = \\int x f(x)\\,dx\\), variance \\(V(X) = E(X^2) - E(X)^2\\). Loi uniforme sur \\([a \\,;\\, b]\\) : \\(f = \\frac{1}{b - a}\\), \\(E = \\frac{a + b}{2}\\), \\(V = \\frac{(b - a)^2}{12}\\). Loi exponentielle de paramètre \\(\\lambda\\) : \\(f(x) = \\lambda e^{-\\lambda x}\\) (\\(x \\ge 0\\)), \\(P(X \\le t) = 1 - e^{-\\lambda t}\\), \\(E = \\frac{1}{\\lambda}\\) ; elle est « sans mémoire ».",
        ["\\(f(x) = kx\\) sur \\([0 \\,;\\, 4]\\) : \\(8k = 1\\), \\(k = \\frac{1}{8}\\).", "Exponentielle, \\(\\lambda = 0{,}5\\) : \\(P(X \\le 2) = 1 - e^{-1} \\approx 0{,}632\\)."],
        "La densité n'est pas une probabilité : \\(f(x)\\) peut dépasser 1 ; seule l'aire sous la courbe compte."],
      comps: ["Densité : trouver la constante ; loi uniforme", "Probabilités et espérance avec une densité ; loi exponentielle ; médiane", "Variance ; densité polynomiale ; médiane et absence de mémoire de la loi exponentielle"],
      act: { retiens: { regle: "Une densité a une aire totale de 1 ; une probabilité est l'aire sous la courbe entre deux bornes.", exemple: ["\\(f(x) = kx\\) sur \\([0 \\,;\\, 4]\\) : \\(\\int_0^4 kx\\,dx = 8k = 1\\), \\(k = \\frac{1}{8}\\).", "Uniforme sur \\([0 \\,;\\, 10]\\) : \\(P(2 \\le X \\le 5) = \\frac{3}{10}\\)."], piege: "\\(f(x)\\) n'est pas \\(P(X = x)\\) : pour une variable continue, \\(P(X = x) = 0\\)." },
        predict: { q: "Le temps d'attente d'un bus est uniforme entre 0 et 10 minutes. Probabilité d'attendre exactement 5 minutes (pile) ?", choices: ["0", "1/10", "1/2"], good: 0, why: "Une seule valeur n'a pas de largeur : l'aire au-dessus d'un point est nulle. On calcule des probabilités d'intervalles." },
        defis: ["\\(f(x) = kx\\) sur \\([0 \\,;\\, 4]\\). Tape \\(k\\) pour que l'aire totale vaille 1.", "Avec cette densité, tape \\(P(X \\le 2)\\)."],
        play: toi(["Aire du triangle sous kx entre 0 et 4 : 4 · 4k ÷ 2 = 8k", "Aire de 0 à 2 : 2 · 2k ÷ 2 avec k = 1/8"], [W(0.125, "8k = 1 donne k = 1/8.", 0.0005), W(0.25, "2 · (2/8) ÷ 2 = 1/4 : la moitié de l'intervalle ne porte qu'un quart de la probabilité.", 0.0005)]) } },
    { id: "approxnorm", niv: "R", theme: "no", label: "Approximation de la loi binomiale par la loi normale", ex: "B(n \\,;\\, p) \\approx N\\left(np \\,;\\, \\sqrt{np(1 - p)}\\right)", CH: [15], lv: AN, probs: PROBS.approxnorm,
      hint: "μ = np, σ = √(np(1 − p)). Correction de continuité : P(X ≤ k) ≈ P(Y ≤ k + 0,5) ; P(X ≥ k) ≈ P(Y ≥ k − 0,5) ; P(X < k) = P(X ≤ k − 1). Puis z = (borne − μ) ÷ σ et Φ(z) dans la table.",
      lesson: ["Approximation normale", "Pour n grand, l'histogramme d'une loi binomiale ressemble à une courbe en cloche.",
        "Si \\(X \\sim B(n \\,;\\, p)\\) avec \\(np\\) et \\(n(1 - p)\\) assez grands (plus de 5), on approche \\(X\\) par \\(Y \\sim N(\\mu \\,;\\, \\sigma)\\) avec \\(\\mu = np\\) et \\(\\sigma = \\sqrt{np(1 - p)}\\). Correction de continuité : chaque valeur entière \\(k\\) occupe l'intervalle \\([k - 0{,}5 \\,;\\, k + 0{,}5]\\), donc \\(P(X \\le k) \\approx P(Y \\le k + 0{,}5)\\) et \\(P(X \\ge k) \\approx P(Y \\ge k - 0{,}5)\\). On centre et on réduit : \\(z = \\frac{x - \\mu}{\\sigma}\\), puis \\(P(Y \\le x) = \\Phi(z)\\) (table ou calculatrice), \\(\\Phi(-z) = 1 - \\Phi(z)\\).",
        ["\\(B(100 \\,;\\, 0{,}5)\\) : \\(\\mu = 50\\), \\(\\sigma = 5\\) ; \\(P(X \\le 57) \\approx \\Phi(1{,}5) \\approx 0{,}933\\)", "\\(P(X \\ge 57) \\approx 1 - \\Phi(1{,}3) \\approx 0{,}097\\)"],
        "« Strictement moins de 57 », c'est « au plus 56 » : la borne corrigée est 56,5."],
      comps: ["Paramètres μ et σ ; règle 68-95-99,7 ; valeur centrée réduite avec correction de continuité", "P(X ≤ k), P(X ≥ k), P(X < k) avec la table de Φ", "Intervalle centré ; surréservation ; seuil à 97,5 %"],
      act: { retiens: { regle: "\\(X \\sim B(n \\,;\\, p)\\) s'approche par \\(N(np \\,;\\, \\sqrt{np(1 - p)})\\). Pour \\(P(X \\le k)\\), on prend \\(k + 0{,}5\\) (correction de continuité), puis \\(z = \\frac{k + 0{,}5 - \\mu}{\\sigma}\\).", exemple: ["\\(B(100 \\,;\\, 0{,}5)\\) : \\(\\mu = 50\\), \\(\\sigma = \\sqrt{25} = 5\\).", "\\(P(X \\le 57)\\) : \\(z = \\frac{57{,}5 - 50}{5} = 1{,}5\\)."], piege: "Sans le 0,5, on oublie la moitié du bâton de 57." },
        predict: { q: "On lance 100 fois une pièce. Le nombre de « pile » est le plus souvent…", choices: ["proche de 50, à quelques unités près (écart-type 5)", "exactement 50", "n'importe quel nombre entre 0 et 100"], good: 0, why: "μ = 50 et σ = √(100 · 0,5 · 0,5) = 5 : environ 95 % des séries donnent entre 40 et 60 « pile »." },
        defis: ["\\(X \\sim B(100 \\,;\\, 0{,}5)\\). Tape son écart-type \\(\\sigma\\).", "Avec la correction de continuité, tape la valeur \\(z\\) qui sert à calculer \\(P(X \\le 57)\\)."],
        play: toi(["σ = √(n · p · (1 − p)) = √(100 · 0,5 · 0,5)", "z = (57 + 0,5 − 50) ÷ 5"], [W(5, "√25 = 5."), W(1.5, "z = 7,5 ÷ 5 = 1,5 ; P(X ≤ 57) ≈ Φ(1,5) ≈ 0,933.")]) } },
  ]);
  if (typeof LESSON_FIGS !== "undefined") LESSON_FIGS.geoesp = () => paveFig(6, 3, 2, { accent: [["A", "G", 1], ["A", "C", 1]], lab: "pavé et sa diagonale" });
})();
