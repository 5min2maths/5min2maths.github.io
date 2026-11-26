// 25.11 (agent trous) · CO 11e, chapitre 3 « 3D : espace, grandeurs et mesures » : repérer un point dans un repère de
// l'espace (11ES1.05, « si le temps »). Notion repere3d : coordonnées des sommets d'un pavé posé à l'origine, milieux et
// centres, puis distances (Pythagore dans l'espace, comme la diagonale d'un pavé). Réponses « x ; y ; z ».
// Outils : TRX (src/trx.js). Paquet de chargement « 11 » (build.py : préfixe ch11).
(function () {
  if (typeof NOTIONS === "undefined" || typeof GEN === "undefined" || typeof TRX === "undefined") return;
  const { pk, r6, fT, fS, QN, QP, GR, GP, TR, TP, P, reg, W, toi, solid } = TRX;
  const T3 = (p) => "(" + p.map(fT).join(" \\,;\\, ") + ")", S3 = (p) => p.map(fS).join(" ; ");
  /* pavé posé à l'origine : x vers l'avant (fuyante), y vers la droite, z vers le haut ; sommets O, A…G */
  const SOM = (a, b, c) => ({ O: [0, 0, 0], A: [a, 0, 0], B: [a, b, 0], C: [0, b, 0], D: [0, 0, c], E: [a, 0, c], F: [a, b, c], G: [0, b, c] });
  const fig = (a, b, c, o = {}) => {
    const S = SOM(a, b, c), tr = (p) => [p[1], -p[0], p[2]], pts = {};
    for (const [k, v] of Object.entries(S)) pts[k] = tr(v);
    pts.x = tr([a + 2, 0, 0]); pts.y = tr([0, b + 2, 0]); pts.z = tr([0, 0, c + 1.6]);
    for (const [k, v] of Object.entries(o.more || {})) pts[k] = tr(v);
    const edges = [["O", "x"], ["O", "y"], ["O", "z"], ["A", "B"], ["B", "C"], ["D", "E"], ["E", "F"], ["F", "G"], ["G", "D"], ["A", "E"], ["B", "F"], ["C", "G"]];
    const marks = o.noDims ? [] : [["O", "A", String(a), -10, 4], ["O", "C", String(b), 0, 14], ["O", "D", String(c), -10, 0]];
    return solid({ pts, edges, accent: o.accent || [], marks, dots: o.dots || [], labels: (o.labels || ["O", "A", "B", "C", "D", "E", "F", "G"]).concat(["x", "y", "z"]), lab: "pavé dans un repère de l'espace" });
  };
  const dims = () => { const a = R.int(2, 6), b = R.int(2, 7), c = R.int(2, 5); return a === b && b === c ? [a, b + 1, c] : [a, b, c]; };
  const RP = {
    1: [
      () => { const [a, b, c] = dims(), S = SOM(a, b, c), n = pk(["B", "E", "F", "G", "F"]), p = S[n];
        return QP("Un pavé droit est posé dans un repère de l'espace : le sommet " + M("O") + " est l'origine et ses arêtes issues de " + M("O") + " suivent les axes (longueurs sur la figure). Donne les coordonnées du sommet " + M(n) + " (réponds « x ; y ; z »).", p,
          "Pour aller de " + M("O") + " à " + M(n) + ", on avance de " + M(p[0]) + " selon " + M("x") + " (vers l'avant), de " + M(p[1]) + " selon " + M("y") + " (vers la droite) et de " + M(p[2]) + " selon " + M("z") + " (vers le haut) : " + M(n + T3(p)) + ".",
          { ctx: "sommet", fig: fig(a, b, c, { dots: [n] }),
            guide: [GR("Coordonnée " + M("x") + " (vers l'avant) ?", p[0], M(p[0]) + "."), GR("Coordonnée " + M("y") + " (vers la droite) ?", p[1], M(p[1]) + "."), GR("Coordonnée " + M("z") + " (vers le haut) ?", p[2], M(p[2]) + "."), GP("Coordonnées de " + M(n) + " ?", p, M(T3(p)) + ".")],
            traps: [TP([p[1], p[0], p[2]], "L'ordre compte : d'abord x (l'axe vers l'avant), puis y, puis z."), TP([p[2], p[1], p[0]], "z est la hauteur : c'est la dernière coordonnée."), TP([a, b, c], "Ce sont les dimensions du pavé ; regarde de combien on avance sur chaque axe pour atteindre " + n + ".")] }); },
      () => { const [a, b, c] = dims(), v = a * b * c;
        return QN("Un pavé droit a un sommet à l'origine " + M("O(0 \\,;\\, 0 \\,;\\, 0)") + ", ses arêtes issues de " + M("O") + " sur les axes, et le sommet opposé en " + M("F" + T3([a, b, c])) + " (unité : le cm). Calcule son volume (en cm³).", v,
          "Les coordonnées de " + M("F") + " donnent les trois dimensions : " + M(a + " \\cdot " + b + " \\cdot " + c + " = " + v) + " cm³.", /* 26.11 (revue des élèves testeurs, n° 4) : « · » en romand, « × » en France (frTimes) */
          { ctx: "volume", fig: fig(a, b, c, { noDims: true, dots: ["F"] }),
            guide: [GR("Longueur de l'arête sur l'axe " + M("x") + " ?", a, M(a) + " cm."), GR("Volume ?", v, M(v) + " cm³.")],
            traps: [TR(a + b + c, "Le volume est le produit des trois dimensions, pas leur somme."), TR(a * b, "C'est l'aire de la base ; multiplie encore par la hauteur " + c + "."), TR(2 * (a * b + b * c + a * c), "C'est l'aire totale ; on demande le volume.")] }); },
      () => { const [a, b, c] = dims(), t = R.int(1, b - 1), p = [a, t, c];
        return QP("Un pavé droit est posé dans un repère de l'espace (sommet " + M("O") + " à l'origine, longueurs sur la figure). Le point " + M("P") + " est sur l'arête " + M("[EF]") + ", à " + M(t) + " unité" + (t > 1 ? "s" : "") + " de " + M("E") + ". Donne ses coordonnées (« x ; y ; z »).", p,
          M("E" + T3([a, 0, c])) + " ; de " + M("E") + " vers " + M("F") + ", seule la coordonnée " + M("y") + " change : " + M("P" + T3(p)) + ".",
          { ctx: "point-arete", fig: fig(a, b, c, { more: { P: p }, dots: ["P"], labels: ["O", "A", "B", "C", "D", "E", "F", "G", "P"] }),
            guide: [GP("Coordonnées de " + M("E") + " ?", [a, 0, c], M(T3([a, 0, c])) + "."), GR("Coordonnée " + M("y") + " de " + M("P") + " ?", t, M(t) + "."), GP("Coordonnées de " + M("P") + " ?", p, M(T3(p)) + ".")],
            traps: [TP([t, a, c], "L'arête [EF] est parallèle à l'axe des y : c'est y qui vaut " + t + "."), TP([a, b - t, c], "P est à " + t + " de E (pas de F)."), TP([a, t, 0], "L'arête [EF] est en haut : z = " + c + ".")] }); },
    ],
    2: [
      () => { const [a, b, c] = dims(), S = SOM(a, b, c), [u, w] = pk([["E", "F"], ["B", "F"], ["A", "E"], ["F", "G"], ["C", "G"]]), p = S[u].map((v, i) => (v + S[w][i]) / 2);
        return QP("Un pavé droit est posé dans un repère de l'espace (sommet " + M("O") + " à l'origine, longueurs sur la figure). Donne les coordonnées du milieu " + M("M") + " de l'arête " + M("[" + u + w + "]") + " (« x ; y ; z », fractions ou décimaux acceptés).", p,
          M(u + T3(S[u])) + " et " + M(w + T3(S[w])) + " ; le milieu a pour coordonnées les moyennes : " + M("M" + T3(p)) + ".",
          { ctx: "milieu-arete", fig: fig(a, b, c, { accent: [[u, w]] }),
            guide: [GP("Coordonnées de " + M(u) + " ?", S[u], M(T3(S[u])) + "."), GP("Coordonnées de " + M(w) + " ?", S[w], M(T3(S[w])) + "."), GP("Milieu " + M("M") + " ?", p, M(T3(p)) + ".")],
            traps: [TP(S[u].map((v, i) => v + S[w][i]), "Le milieu : on fait la moyenne, donc on divise la somme par 2."), TP(S[u].map((v, i) => (S[w][i] - v) / 2), "Moyenne des coordonnées : (x₁ + x₂) ÷ 2."), TP(S[w], "C'est l'extrémité " + w + ", pas le milieu.")] }); },
      () => { let [a, b, c] = dims(); if (a % 2 && b % 2 && c % 2) a++; const p = [a / 2, b / 2, c / 2];
        return QP("Un pavé droit est posé dans un repère de l'espace (sommet " + M("O") + " à l'origine, longueurs sur la figure). Donne les coordonnées de son centre " + M("K") + ", le milieu de la diagonale " + M("[OF]") + " (« x ; y ; z »).", p,
          M("O(0 \\,;\\, 0 \\,;\\, 0)") + " et " + M("F" + T3([a, b, c])) + " : " + M("K" + T3(p)) + ", la moitié de chaque dimension.",
          { ctx: "centre", fig: fig(a, b, c, { accent: [["O", "F", 1]] }),
            guide: [GP("Coordonnées de " + M("F") + " ?", [a, b, c], M(T3([a, b, c])) + "."), GP("Centre " + M("K") + " ?", p, M(T3(p)) + ".")],
            traps: [TP([a, b, c], "C'est le sommet F ; le centre est au milieu de [OF]."), TP([a / 2, b / 2, c], "Ça, c'est le centre de la face du dessus."), TP([b / 2, a / 2, c / 2], "L'ordre : x (vers l'avant), y, z.")] }); },
      () => { const [a, b, c] = dims(), up = R.rand() < 0.6, p = up ? [a / 2, b / 2, c] : [a, b / 2, c / 2], fc = up ? "du dessus " + M("DEFG") : "avant " + M("ABFE");
        return QP("Un pavé droit est posé dans un repère de l'espace (sommet " + M("O") + " à l'origine, longueurs sur la figure). Donne les coordonnées du centre de la face " + fc + " (« x ; y ; z »).", p,
          "Le centre d'une face est le milieu d'une de ses diagonales" + (up ? " ([DF])" : " ([AF])") + " : " + M(T3(p)) + ". Une coordonnée reste celle de la face (" + (up ? M("z = " + c) : M("x = " + a)) + ").",
          { ctx: "centre-face", fig: fig(a, b, c, { accent: up ? [["D", "F"], ["E", "G"]] : [["A", "F"], ["B", "E"]] }),
            guide: [GR(up ? "La face du dessus est à quelle hauteur " + M("z") + " ?" : "La face avant est à quelle abscisse " + M("x") + " ?", up ? c : a, M(up ? c : a) + "."), GP("Centre de la face ?", p, M(T3(p)) + ".")],
            traps: [TP([a / 2, b / 2, c / 2], "C'est le centre du pavé ; le centre de la face reste sur la face."), TP(up ? [a / 2, b / 2, 0] : [0, b / 2, c / 2], up ? "La face du dessus est à la hauteur z = " + c + ", pas 0." : "La face avant est en x = " + a + "."), TP(up ? [a, b, c] : [a, b, c], "C'est le sommet F.")] }); },
    ],
    3: [
      () => { const Q = pk([[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11], [3, 4, 12, 13]]), ord = pk([[0, 1, 2], [1, 2, 0], [2, 0, 1]]), [a, b, c] = ord.map((i) => Q[i]), d = Q[3];
        return QN("Un pavé droit est posé à l'origine d'un repère de l'espace ; son sommet opposé à " + M("O") + " est " + M("F" + T3([a, b, c])) + ". Calcule la distance " + M("OF") + ".", d,
          "Diagonale de la base : " + M("OB^2 = " + a + "^2 + " + b + "^2 = " + (a * a + b * b)) + ". Puis, dans le triangle " + M("OBF") + " rectangle en " + M("B") + " : " + M("OF^2 = " + (a * a + b * b) + " + " + c + "^2 = " + d * d) + ", " + M("OF = " + d) + ".",
          { ctx: "diagonale", fig: fig(a, b, c, { noDims: true, accent: [["O", "F", 1], ["O", "B", 1]] }),
            guide: [GR(M("OB^2") + " (diagonale de la base, au carré) ?", a * a + b * b, M(a * a + b * b) + "."), GR(M("OF^2") + " ?", d * d, M(d * d) + "."), GR(M("OF") + " ?", d, M(d) + ".")],
            traps: [TR(a + b + c, "On n'additionne pas les coordonnées : Pythagore, deux fois."), TR(d * d, "C'est OF² : prends la racine."), TR(Math.sqrt(a * a + b * b), "C'est la diagonale de la base [OB] ; il reste à monter de " + c + ".")] }); },
      () => { const [u, w, d] = pk([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [4, 3, 5], [12, 5, 13]]), c = R.int(2, 5), A = [u, 0, c], B = [0, w, c];
        return QN("Dans un repère de l'espace, calcule la distance entre les points " + M("E" + T3(A)) + " et " + M("G" + T3(B)) + ".", d,
          "Les deux points ont la même cote " + M("z = " + c) + " : ils sont dans un même plan horizontal. Écarts : " + M(u) + " selon " + M("x") + ", " + M(w) + " selon " + M("y") + " ; " + M("EG = \\sqrt{" + u + "^2 + " + w + "^2} = " + d) + ".",
          { ctx: "diag-face", fig: fig(u, w, c, { noDims: true, accent: [["E", "G"]] }),
            guide: [GR("Écart selon " + M("x") + " ?", u, M(u) + "."), GR("Écart selon " + M("y") + " ?", w, M(w) + "."), GR(M("EG") + " ?", d, M("\\sqrt{" + u * u + " + " + w * w + "} = " + d) + ".")],
            traps: [TR(u + w, "Pythagore : on additionne les carrés, puis on prend la racine."), TR(Math.sqrt(u * u + w * w + c * c), "Les deux points ont la même cote " + c + " : l'écart selon z est nul."), TR(d * d, "C'est EG² : prends la racine.")] }); },
      () => { let [a, b, c] = dims(); if (a % 2) a++; if (b % 2) b++; const h = R.int(2, 5), p = [a / 2, b / 2, c + h];
        return QP("Sur un pavé droit posé à l'origine d'un repère de l'espace (longueurs sur la figure), on pose une pyramide dont la base est la face du dessus " + M("DEFG") + " et dont le sommet " + M("S") + " est à " + M(h) + " unités au-dessus du centre de cette face. Donne les coordonnées de " + M("S") + " (« x ; y ; z »).", p,
          "Centre de la face du dessus : " + M(T3([a / 2, b / 2, c])) + ". On monte de " + M(h) + " : " + M("S" + T3(p)) + ".",
          { ctx: "pyramide-sommet", fig: fig(a, b, c, { more: { S: p }, accent: [["S", "D"], ["S", "E"], ["S", "F"], ["S", "G"]], labels: ["O", "A", "B", "C", "D", "E", "F", "G", "S"] }),
            guide: [GP("Centre de la face du dessus ?", [a / 2, b / 2, c], M(T3([a / 2, b / 2, c])) + "."), GP("Sommet " + M("S") + " ?", p, M(T3(p)) + ".")],
            traps: [TP([a / 2, b / 2, h], "S est " + h + " unités au-dessus de la face du dessus, qui est déjà à la hauteur " + c + "."), TP([a, b, c + h], "Le sommet est au-dessus du centre de la face, pas au-dessus de F."), TP([b / 2, a / 2, c + h], "L'ordre : x (vers l'avant), y, z.")] }); },
    ],
  };
  const PROBS = {
    repere3d: [() => { const [a, b, c, d] = pk([[2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9]]);
      return P("Une boîte en forme de pavé droit est posée à l'origine d'un repère de l'espace ; le sommet opposé à O est " + M("F" + T3([a, b, c])) + " (en dm).", [["a) Volume de la boîte (dm³)", a * b * c], ["b) Cote (coordonnée z) du centre de la boîte", c / 2], ["c) Longueur de la diagonale OF (dm)", d]],
        ["Les coordonnées de F sont les dimensions.", "Diagonale : Pythagore deux fois."], "a) " + M(a + " \\cdot " + b + " \\cdot " + c + " = " + a * b * c) + " ; b) " + M(fT(c / 2)) + " ; c) " + M("\\sqrt{" + a * a + " + " + b * b + " + " + c * c + "} = " + d) + "."); }],
  };
  reg([
    { id: "repere3d", theme: "es", label: "Repérer un point dans l'espace", ex: "F(4 \\,;\\, 3 \\,;\\, 2)", CH: [11], lv: RP, probs: PROBS.repere3d,
      hint: "Un point de l'espace a trois coordonnées (x ; y ; z) : x vers l'avant, y vers la droite, z vers la hauteur. Pavé posé à l'origine : les coordonnées du sommet opposé sont ses trois dimensions. Milieu : moyenne des coordonnées. Distance : Pythagore deux fois.",
      lesson: ["Repère de l'espace", "Trois nombres pour situer un point : avant, droite, haut.",
        "Dans un repère de l'espace, trois axes perpendiculaires partent de l'origine \\(O\\) : l'axe des \\(x\\) (dessiné en fuyante, vers l'avant), l'axe des \\(y\\) (vers la droite) et l'axe des \\(z\\) (vers le haut). Le point \\(P(x \\,;\\, y \\,;\\, z)\\) s'atteint en avançant de \\(x\\), puis de \\(y\\), puis en montant de \\(z\\). Pour un pavé posé à l'origine avec ses arêtes sur les axes, le sommet opposé a pour coordonnées les trois dimensions. Le milieu de deux points a pour coordonnées les moyennes. La distance se calcule avec Pythagore, comme la diagonale d'un pavé.",
        ["Pavé \\(4 \\times 3 \\times 2\\) : sommet opposé \\(F(4 \\,;\\, 3 \\,;\\, 2)\\), centre \\((2 \\,;\\, 1{,}5 \\,;\\, 1)\\).", "\\(OF = \\sqrt{2^2 + 3^2 + 6^2} = 7\\) pour \\(F(2 \\,;\\, 3 \\,;\\, 6)\\)."],
        "L'ordre des coordonnées compte : \\((4 \\,;\\, 3 \\,;\\, 2)\\) et \\((3 \\,;\\, 4 \\,;\\, 2)\\) sont deux points différents."],
      comps: ["Lire les coordonnées d'un point de l'espace", "Calculer les coordonnées d'un milieu ou d'un centre", "Calculer une distance dans l'espace"],
      act: { retiens: { regle: "Un point de l'espace a trois coordonnées \\((x \\,;\\, y \\,;\\, z)\\) ; \\(z\\) est la hauteur. Distance à l'origine : \\(\\sqrt{x^2 + y^2 + z^2}\\).", exemple: ["Pavé posé à l'origine, de dimensions 4, 3 et 2 : le sommet opposé est \\(F(4 \\,;\\, 3 \\,;\\, 2)\\).", "\\(F(2 \\,;\\, 3 \\,;\\, 6)\\) : \\(OF = \\sqrt{4 + 9 + 36} = 7\\)."], piege: "La distance n'est pas la somme des coordonnées." },
        predict: { q: "Combien de nombres faut-il pour situer un point dans une pièce (sol et hauteur) ?", choices: ["3", "2", "4"], good: 0, why: "Deux pour se placer sur le sol (avant, droite) et un pour la hauteur : (x ; y ; z)." },
        defis: ["Un pavé de dimensions 4 (selon x), 3 (selon y) et 2 (selon z) est posé à l'origine. Tape la hauteur z de son sommet opposé F.", "Pour \\(F(2 \\,;\\, 3 \\,;\\, 6)\\), tape la distance \\(OF\\)."],
        play: toi(["z est la dimension verticale", "OF² = 2² + 3² + 6²"], [W(2, "F(4 ; 3 ; 2) : z = 2, la hauteur du pavé."), W(7, "√(4 + 9 + 36) = √49 = 7.")]) } },
  ]);
})();
