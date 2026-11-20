// Chantier 1re Collège (bêta-testeurs) · lot géométrie (19.11) : une seule source pour euclide, geocomb, droitesrem,
// exactes, angtri. Même standard : au moins 3 formes par niveau, pas à pas, erreurs typiques, ctx, figures ; défis.
(function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const r6 = (v) => +(+v).toFixed(6);
  const N = (v) => String(r6(v)).replace(".", "{,}");
  const keep = (value, traps) => { const seen = new Set(); return (traps || []).filter((t) => t && isFinite(t.v) && Math.abs(t.v - value) > 1e-9 && !seen.has(r6(t.v)) && seen.add(r6(t.v))); };
  const Qv = (q, value, sol, o = {}) => { const x = { q, spec: Object.assign({ kind: "value", value }, o.radical ? { radical: true } : {}, o.pi ? { pi: true } : {}), sol, guide: o.guide, traps: keep(value, o.traps), ctx: o.ctx }; if (o.fig) x.fig = o.fig; if (o.canon) x.canon = o.canon; return x; };
  const TR = TRAP;
  const P = (q, parts, hints, sol, fig) => ({ fig, q, parts: parts.map(([label, value]) => ({ label, spec: { kind: "value", value } })), hints, sol });
  const RS = (k, m) => M((k === 1 ? "" : k) + "\\sqrt{" + m + "}");
  const RC = (k, m) => (k === 1 ? "" : k) + "√" + m;
  const EXA = " (valeur exacte, touche √)";

  // ===================== euclide =====================
  const EU = {
    1: [
      () => { const [p, q] = pk([[1, 4], [2, 8], [4, 9], [3, 12], [1, 9], [4, 16], [9, 16]]), h = Math.sqrt(p * q);
        return Qv("Dans un triangle rectangle, la hauteur issue de l'angle droit découpe l'hypoténuse en segments de " + M(p) + " cm et " + M(q) + " cm. Calcule la hauteur (en cm).", h, "Théorème de la hauteur : " + M("h^2 = p \\cdot q = " + p * q) + ", donc " + M("h = " + h) + " cm.",
          { ctx: "hauteur", fig: GF.altitude(p, q, { lp: p + " cm", lq: q + " cm", lh: "h = ?" }), guide: [GS(M("h^2 = p \\cdot q") + " = ?", p * q, M(p * q) + "."), GS(M("h") + " = ?", h, M(h) + " cm.")], traps: [TR((p + q) / 2, "C'est h² = p · q (produit), pas la moyenne."), TR(p * q, "N'oublie pas la racine.")] }); },
      () => { const [p, c] = pk([[4, 9], [2, 8], [1, 9], [9, 16], [4, 25], [3, 12]]), a = Math.sqrt(p * c);
        return Qv("Un triangle est rectangle en " + M("C") + ", d'hypoténuse " + M("c = " + c) + " cm. La projection de la cathète " + M("a") + " sur l'hypoténuse mesure " + M(p) + " cm. Calcule " + M("a") + " (en cm).", a, "Théorème d'Euclide : " + M("a^2 = p \\cdot c = " + p * c) + ", " + M("a = " + a) + " cm.",
          { ctx: "cathete", fig: GF.altitude(p, c - p, { lp: p + " cm", lq: "", lh: "", lc: "c = " + c + " cm", la: "a = ?" }), guide: [GS(M("a^2 = p \\cdot c") + " = ?", p * c, M(p * c) + "."), GS(M("a") + " = ?", a, M(a) + " cm.")], traps: [TR(Math.sqrt(p * (c - p)), "Euclide : a² = p · c (hypoténuse entière), pas p · q."), TR(p * c, "N'oublie pas la racine.")] }); },
      () => { const [a, c] = pk([[6, 9], [6, 12], [10, 20], [12, 16], [15, 25], [8, 16]]), p = (a * a) / c;
        return Qv("Un triangle rectangle a une hypoténuse de " + M(c) + " cm et une cathète " + M("a = " + a) + " cm. Calcule la projection " + M("p") + " de " + M("a") + " sur l'hypoténuse (en cm).", p, M("a^2 = p \\cdot c") + " : " + M("p = \\frac{" + a * a + "}{" + c + "} = " + N(p)) + " cm.",
          { ctx: "projection", guide: [GS(M("a^2") + " = ?", a * a, M(a * a) + "."), GS(M("p = a^2 : c") + " = ?", p, M(N(p)) + " cm.")], traps: [TR(a * a * c, "On divise a² par c."), TR(c - a, "La projection n'est pas une différence de longueurs.")] }); },
    ],
    2: [
      () => { const [a, b, c] = pk([[6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17]]), h = (a * b) / c;
        return Qv("Un triangle rectangle a des cathètes de " + M(a) + " cm et " + M(b) + " cm. Calcule la hauteur relative à l'hypoténuse (en cm, valeur exacte).", h, M("c = " + c) + " ; aire " + M("\\frac{a \\cdot b}{2} = \\frac{c \\cdot h}{2}") + ", donc " + M("h = \\frac{" + a * b + "}{" + c + "} = " + N(h)) + " cm.",
          { ctx: "h-aire", fig: GF.altitude((a * a) / c, (b * b) / c, { lp: "", lq: "", lh: "h = ?", la: a + " cm", lb: b + " cm" }), guide: [GS("Hypoténuse " + M("c") + " ?", c, M(c) + " cm."), GS(M("h = \\frac{a \\cdot b}{c}") + " ?", h, M(N(h)) + " cm.")], traps: [TR((a + b) / 2, "Utilise l'aire : a · b = c · h."), TR(a * b, "Divise par l'hypoténuse.")] }); },
      () => { const [h, p] = pk([[6, 4], [6, 3], [12, 9], [8, 4], [10, 5], [12, 8]]), q = (h * h) / p;
        return Qv("Dans un triangle rectangle, la hauteur relative à l'hypoténuse mesure " + M(h) + " cm et l'un des segments de l'hypoténuse " + M(p) + " cm. Calcule l'autre segment (en cm).", q, M("h^2 = p \\cdot q") + " : " + M("q = \\frac{" + h * h + "}{" + p + "} = " + N(q)) + " cm.",
          { ctx: "segment", fig: GF.altitude(p, q, { lp: p + " cm", lq: "?", lh: "h = " + h + " cm" }), guide: [GS(M("h^2") + " ?", h * h, M(h * h) + "."), GS(M("q = h^2 : p") + " ?", q, M(N(q)) + " cm.")], traps: [TR(h - p, "Ce n'est pas une différence : h² = p · q."), TR(h * h * p, "On divise h² par p.")] }); },
      () => { const [a, p] = pk([[6, 4], [10, 5], [12, 8], [15, 9], [20, 16]]), c = (a * a) / p;
        return Qv("Dans un triangle rectangle, une cathète mesure " + M(a) + " cm et sa projection sur l'hypoténuse " + M(p) + " cm. Calcule l'hypoténuse (en cm).", c, M("a^2 = p \\cdot c") + " : " + M("c = \\frac{" + a * a + "}{" + p + "} = " + N(c)) + " cm.",
          { ctx: "hypotenuse", guide: [GS(M("a^2") + " ?", a * a, M(a * a) + "."), GS(M("c") + " ?", c, M(N(c)) + " cm.")], traps: [TR(Math.sqrt(a * a - p * p), "Ça, c'est la hauteur (Pythagore dans le petit triangle) ; on demande c."), TR(a + p, "Utilise a² = p · c.")] }); },
    ],
    3: [
      () => { const [p, q] = pk([[9, 16], [4, 9], [1, 4], [4, 16], [2, 8]]), h = Math.sqrt(p * q), A = ((p + q) * h) / 2;
        return Qv("La hauteur issue de l'angle droit d'un triangle rectangle découpe l'hypoténuse en " + M(p) + " cm et " + M(q) + " cm. Calcule l'aire du triangle (en cm²).", A, M("h = \\sqrt{" + p * q + "} = " + h) + " ; " + M("A = \\frac{" + (p + q) + " \\cdot " + h + "}{2} = " + N(A)) + " cm².",
          { ctx: "aire", guide: [GS(M("h") + " ?", h, M(h) + " cm."), GS("Hypoténuse " + M("p + q") + " ?", p + q, M(p + q) + " cm."), GS("Aire ?", A, M(N(A)) + " cm².")], traps: [TR((p + q) * h, "Aire d'un triangle : base · hauteur ÷ 2."), TR((p * q) / 2, "Calcule d'abord h.")] }); },
      () => { const [p, q, a, b] = pk([[9, 16, 15, 20], [3.6, 6.4, 6, 8], [1.8, 3.2, 3, 4], [25, 144, 65, 156]]), c = p + q, per = a + b + c;
        return Qv("Dans un triangle rectangle, la hauteur relative à l'hypoténuse découpe celle-ci en " + M(N(p)) + " cm et " + M(N(q)) + " cm. Calcule le périmètre du triangle (en cm).", per, M("c = " + N(c)) + " ; " + M("a = \\sqrt{" + N(p) + " \\cdot " + N(c) + "} = " + a) + " ; " + M("b = \\sqrt{" + N(q) + " \\cdot " + N(c) + "} = " + b) + " ; périmètre " + M(N(per)) + " cm.",
          { ctx: "perimetre", guide: [GS(M("c") + " ?", c, M(N(c)) + "."), GS(M("a = \\sqrt{p \\cdot c}") + " ?", a, M(a) + "."), GS(M("b") + " ?", b, M(b) + "."), GS("Périmètre ?", per, M(N(per)) + " cm.")], traps: [TR(a + b, "N'oublie pas l'hypoténuse."), TR(2 * c, "Calcule les deux cathètes avec Euclide.")] }); },
      () => { const [a, b, c] = pk([[6, 8, 10], [5, 12, 13], [9, 12, 15], [15, 20, 25]]), p = (a * a) / c, q = (b * b) / c, d = r6(q - p);
        return Qv("Un triangle rectangle a des cathètes de " + M(a) + " cm et " + M(b) + " cm. La hauteur issue de l'angle droit coupe l'hypoténuse en deux segments. De combien le plus long dépasse-t-il le plus court (en cm) ?", d, M("c = " + c) + " ; " + M("p = \\frac{" + a * a + "}{" + c + "} = " + N(p)) + ", " + M("q = \\frac{" + b * b + "}{" + c + "} = " + N(q)) + " ; écart " + M(N(d)) + " cm.",
          { ctx: "ecart", guide: [GS(M("p") + " ?", p, M(N(p)) + "."), GS(M("q") + " ?", q, M(N(q)) + "."), GS("Écart ?", d, M(N(d)) + " cm.")], traps: [TR(b - a, "Ce sont les projections qu'on compare, pas les cathètes.")] }); },
    ],
  };

  // ===================== geocomb =====================
  const GC = {
    1: [
      () => { const [a, b, c] = pk([[6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20]]), x = pk([["un écran rectangulaire de " + a + " × " + b + " pouces : quelle est sa diagonale (en pouces) ?", "ecran"], ["un portail rectangulaire de " + a + " dm sur " + b + " dm : quelle est la longueur de la barre posée en diagonale (en dm) ?", "portail"]]);
        return Qv("On considère " + x[0], c, M("\\sqrt{" + a + "^2 + " + b + "^2} = \\sqrt{" + c * c + "} = " + c) + ".", { ctx: x[1], guide: [GS(M(a + "^2 + " + b + "^2") + " ?", c * c, M(c * c) + "."), GS("Diagonale ?", c, M(c) + ".")], traps: [TR(a + b, "Pythagore : on additionne les CARRÉS."), TR(c * c, "N'oublie pas la racine.")] }); },
      () => { const [s, bb, h] = pk([[5, 6, 4], [10, 12, 8], [13, 10, 12], [17, 16, 15], [5, 8, 3]]);
        return Qv("Un triangle isocèle a deux côtés de " + M(s) + " cm et une base de " + M(bb) + " cm. Calcule sa hauteur relative à la base (en cm).", h, "La hauteur coupe la base en son milieu : " + M("h = \\sqrt{" + s + "^2 - " + bb / 2 + "^2} = " + h) + " cm.",
          { ctx: "isocele", guide: [GS("Demi-base ?", bb / 2, M(bb / 2) + " cm."), GS(M("h") + " ?", h, M(h) + " cm.")], traps: [TR(Math.sqrt(s * s - bb * bb), "La hauteur coupe la base en deux : utilise la demi-base."), TR(s - bb / 2, "Pythagore, pas une soustraction de longueurs.")] }); },
      () => { const k = pk([2, 3, 4, 5]);
        return Qv("Un triangle équilatéral a des côtés de " + M(2 * k) + " cm. Calcule sa hauteur" + EXA + ".", k * Math.sqrt(3), M("h = \\sqrt{" + 2 * k + "^2 - " + k + "^2} = \\sqrt{" + 3 * k * k + "} = " + k + "\\sqrt{3}") + " cm.",
          { ctx: "equilateral", radical: true, canon: RC(k, 3), guide: [GS(M("h^2") + " ?", 3 * k * k, M(3 * k * k) + "."), GSR("Valeur exacte ?", k * Math.sqrt(3), RS(k, 3) + " cm.")], traps: [TR(2 * k, "La hauteur est plus courte que le côté."), TR(k * Math.sqrt(2), "C'est √(4k² − k²) = k√3.")] }); },
    ],
    2: [
      () => { const [s, bb, h] = pk([[5, 6, 4], [10, 12, 8], [13, 10, 12], [17, 16, 15]]), A = (bb * h) / 2;
        return Qv("Un toit a la forme d'un triangle isocèle : côtés " + M(s) + " m, base " + M(bb) + " m. Calcule son aire (en m²).", A, "Hauteur " + M("\\sqrt{" + s * s + " - " + (bb / 2) ** 2 + "} = " + h) + " ; aire " + M("\\frac{" + bb + " \\cdot " + h + "}{2} = " + A) + " m².",
          { ctx: "toit", guide: [GS("Hauteur ?", h, M(h) + " m."), GS("Aire ?", A, M(A) + " m².")], traps: [TR(bb * h, "Aire d'un triangle : ÷ 2."), TR((bb * s) / 2, "Il faut la hauteur, pas le côté oblique.")] }); },
      () => { const [a, b, c, d] = pk([[2, 3, 6, 7], [1, 4, 8, 9], [2, 6, 9, 11], [4, 4, 7, 9], [3, 4, 12, 13]]);
        return Qv("Un carton a pour dimensions " + M(a) + " dm, " + M(b) + " dm et " + M(c) + " dm. Quelle est la longueur de la plus longue baguette qu'on peut y glisser (diagonale de l'espace, en dm) ?", d, M("\\sqrt{" + a + "^2 + " + b + "^2 + " + c + "^2} = \\sqrt{" + d * d + "} = " + d) + " dm.",
          { ctx: "carton", guide: [GS("Diagonale du fond au carré (" + M(a + "^2 + " + b + "^2") + ") ?", a * a + b * b, M(a * a + b * b) + "."), GS("Diagonale de l'espace ?", d, M(d) + " dm.")], traps: [TR(Math.sqrt(a * a + b * b), "Ça, c'est la diagonale du fond ; il faut aussi la hauteur."), TR(a + b + c, "Pythagore deux fois, pas une somme.")] }); },
      () => { const [d1, d2, s] = pk([[6, 8, 5], [10, 24, 13], [12, 16, 10], [16, 30, 17]]);
        return Qv("Un losange a des diagonales de " + M(d1) + " cm et " + M(d2) + " cm. Calcule la longueur de son côté (en cm).", s, "Les diagonales se coupent en leur milieu à angle droit : " + M("\\sqrt{" + d1 / 2 + "^2 + " + d2 / 2 + "^2} = " + s) + " cm.",
          { ctx: "losange", guide: [GS("Demi-diagonales : " + M(d1 / 2) + " et ?", d2 / 2, M(d2 / 2) + "."), GS("Côté ?", s, M(s) + " cm.")], traps: [TR(Math.sqrt(d1 * d1 + d2 * d2), "On utilise les DEMI-diagonales."), TR((d1 + d2) / 2, "Pythagore dans un des quatre triangles rectangles.")] }); },
    ],
    3: [
      () => { const [B, b, l, h] = pk([[14, 8, 5, 4], [20, 10, 13, 12], [16, 4, 10, 8], [22, 10, 10, 8]]), A = ((B + b) * h) / 2;
        return Qv("Un trapèze isocèle a des bases de " + M(B) + " cm et " + M(b) + " cm, et des côtés obliques de " + M(l) + " cm. Calcule son aire (en cm²).", A, "Débord de chaque côté " + M("\\frac{" + B + " - " + b + "}{2} = " + (B - b) / 2) + " ; hauteur " + M("\\sqrt{" + l + "^2 - " + (B - b) / 2 + "^2} = " + h) + " ; aire " + M("\\frac{(" + B + " + " + b + ") \\cdot " + h + "}{2} = " + A) + " cm².",
          { ctx: "trapeze", guide: [GS("Débord de chaque côté ?", (B - b) / 2, M((B - b) / 2) + " cm."), GS("Hauteur ?", h, M(h) + " cm."), GS("Aire ?", A, M(A) + " cm².")], traps: [TR((B + b) * h, "Aire d'un trapèze : (B + b) · h ÷ 2."), TR(((B + b) * l) / 2, "Il faut la hauteur, pas le côté oblique.")] }); },
      () => { const [r, h, g] = pk([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]]);
        return Qv("Un cornet de glace (cône) a un rayon de " + M(r) + " cm et une hauteur de " + M(h) + " cm. Calcule son aire latérale " + M("\\pi r g") + " (valeur exacte avec π, en cm²).", Math.PI * r * g, "Génératrice " + M("g = \\sqrt{" + r + "^2 + " + h + "^2} = " + g) + " ; aire " + M("\\pi \\cdot " + r + " \\cdot " + g + " = " + r * g + "\\pi") + " cm².",
          { ctx: "cone", guide: [GS("Génératrice " + M("g") + " ?", g, M(g) + " cm."), GS("Aire latérale (touche π) ?", Math.PI * r * g, M(r * g + "\\pi") + " cm².")], traps: [TR(Math.PI * r * h, "On utilise la génératrice g, pas la hauteur."), TR(Math.PI * r * r, "Ça, c'est l'aire de la base.")] }); },
      () => { const [a, b, c] = pk([[6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]]), h = (a * b) / c, A = (a * b) / 2;
        return Qv("Un terrain triangulaire est rectangle, de côtés " + M(a) + " m, " + M(b) + " m et " + M(c) + " m. On veut tirer un tuyau depuis le coin de l'angle droit jusqu'au côté le plus long, par le plus court chemin. Quelle est sa longueur (en m) ?", h, "Le plus court chemin est la hauteur : aire " + M(A) + " m², " + M("h = \\frac{2 \\cdot " + A + "}{" + c + "} = " + N(h)) + " m.",
          { ctx: "tuyau", guide: [GS("Aire du terrain ?", A, M(A) + " m²."), GS("Hauteur relative à l'hypoténuse ?", h, M(N(h)) + " m.")], traps: [TR(c / 2, "La médiane n'est pas le plus court chemin : il faut la perpendiculaire."), TR(Math.min(a, b), "Le plus court chemin vers [hypoténuse] est perpendiculaire à celle-ci.")] }); },
    ],
  };

  // ===================== droitesrem =====================
  const DR = {
    1: [
      () => { const m = 3 * R.int(2, 10);
        return Qv("Dans le triangle " + M("ABC") + ", la médiane " + M("[CM]") + " mesure " + M(m) + " cm. " + M("G") + " est le centre de gravité. Calcule " + M("CG") + " (en cm).", (2 * m) / 3, "Le centre de gravité est aux deux tiers de la médiane depuis le sommet : " + M("\\frac{2}{3} \\cdot " + m + " = " + (2 * m) / 3) + " cm.",
          { ctx: "CG", fig: FIG.triLines("medianes", { m: m + " cm" }), guide: [GS("Un tiers de la médiane ?", m / 3, M(m / 3) + " cm."), GS(M("CG") + " (deux tiers) ?", (2 * m) / 3, M((2 * m) / 3) + " cm.")], traps: [TR(m / 2, "G n'est pas au milieu : il est aux 2/3 depuis le sommet."), TR(m / 3, "Ça, c'est GM ; CG en vaut le double.")] }); },
      () => { const m = 3 * R.int(2, 10);
        return Qv("La médiane " + M("[AM]") + " d'un triangle mesure " + M(m) + " cm. Calcule la distance " + M("GM") + " entre le centre de gravité et le milieu " + M("M") + " (en cm).", m / 3, M("GM = \\frac{1}{3} \\cdot " + m + " = " + m / 3) + " cm.",
          { ctx: "GM", guide: [GS(M("GM") + " ?", m / 3, M(m / 3) + " cm.")], traps: [TR((2 * m) / 3, "Ça, c'est AG (côté sommet)."), TR(m / 2, "G partage la médiane en 2/3 et 1/3.")] }); },
      () => { const [a, b, c] = pk([[6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [3, 4, 5]]);
        return Qv("Un triangle rectangle a des cathètes de " + M(a) + " cm et " + M(b) + " cm. Quel est le rayon de son cercle circonscrit (en cm) ?", c / 2, "Le centre du cercle circonscrit est le milieu de l'hypoténuse : " + M("r = \\frac{" + c + "}{2} = " + N(c / 2)) + " cm.",
          { ctx: "circonscrit", fig: FIG.rightTriangle([a + " cm", b + " cm", ""]), guide: [GS("Hypoténuse ?", c, M(c) + " cm."), GS("Rayon ?", c / 2, M(N(c / 2)) + " cm.")], traps: [TR(c, "Le diamètre est l'hypoténuse : le rayon en est la moitié."), TR((a + b) / 2, "Calcule d'abord l'hypoténuse.")] }); },
    ],
    2: [
      () => { const A = 2 * R.int(15, 50);
        return Qv("Dans le triangle " + M("ABC") + ", " + M("\\widehat{A} = " + A + "°") + ". " + M("I") + " est le point d'intersection des bissectrices. Que mesure " + M("\\widehat{BIC}") + " (en degrés) ?", 90 + A / 2, M("\\widehat{B} + \\widehat{C} = " + (180 - A) + "°") + " ; leurs moitiés font " + M((180 - A) / 2 + "°") + " ; " + M("\\widehat{BIC} = 180° - " + (180 - A) / 2 + "° = " + (90 + A / 2) + "°") + ".",
          { ctx: "bissectrices", fig: FIG.triLines("bissectrices", { A: A + "°" }), guide: [GS(M("\\widehat{B} + \\widehat{C}") + " ?", 180 - A, M(180 - A) + "°."), GS("Leurs moitiés ?", (180 - A) / 2, M((180 - A) / 2) + "°."), GS(M("\\widehat{BIC}") + " ?", 90 + A / 2, M(90 + A / 2) + "°.")], traps: [TR(180 - A, "Les bissectrices coupent B et C en deux."), TR(A / 2, "Utilise la somme des angles du triangle BIC.")] }); },
      () => { const g = 2 * R.int(2, 12);
        return Qv("Dans un triangle, le centre de gravité " + M("G") + " est à " + M(g) + " cm du sommet " + M("B") + ". Quelle est la longueur de la médiane issue de " + M("B") + " (en cm) ?", (3 * g) / 2, M("BG = \\frac{2}{3} BM") + ", donc " + M("BM = \\frac{3}{2} \\cdot " + g + " = " + (3 * g) / 2) + " cm.",
          { ctx: "mediane", guide: [GS("Un tiers de la médiane (" + M("BG : 2") + ") ?", g / 2, M(g / 2) + " cm."), GS("Médiane ?", (3 * g) / 2, M((3 * g) / 2) + " cm.")], traps: [TR(3 * g, "BG vaut les 2/3 de la médiane, pas 1/3."), TR(2 * g, "G n'est pas au milieu de la médiane.")] }); },
      () => { const B = R.int(35, 80);
        return Qv("Dans le triangle " + M("ABC") + ", " + M("\\widehat{B} = " + B + "°") + ". On trace la hauteur issue de " + M("A") + ", qui coupe " + M("[BC]") + " en " + M("H") + ". Que mesure " + M("\\widehat{BAH}") + " (en degrés) ?", 90 - B, "Le triangle " + M("ABH") + " est rectangle en " + M("H") + " : " + M("180° - 90° - " + B + "° = " + (90 - B) + "°") + ".",
          { ctx: "hauteur", guide: [GS("Angle en " + M("H") + " ?", 90, "90° : la hauteur est perpendiculaire."), GS(M("\\widehat{BAH}") + " ?", 90 - B, M(90 - B) + "°.")], traps: [TR(180 - B, "Le triangle ABH a aussi un angle droit en H."), TR(B, "Ce n'est pas l'angle en B.")] }); },
    ],
    3: [
      () => { const m = R.int(2, 6), a = 3 * m;
        return Qv("Un triangle équilatéral a des côtés de " + M(a) + " cm. Calcule le rayon de son cercle circonscrit (distance du centre à un sommet)" + EXA + ".", m * Math.sqrt(3), "Hauteur " + M("h = \\frac{" + a + "\\sqrt{3}}{2}") + " ; le centre (centre de gravité) est aux 2/3 : " + M("r = \\frac{2}{3} h = \\frac{" + a + "\\sqrt{3}}{3} = " + (m === 1 ? "" : m) + "\\sqrt{3}") + " cm.",
          { ctx: "equilateral-R", radical: true, canon: RC(m, 3), guide: [GSR("Hauteur ?", (a * Math.sqrt(3)) / 2, M("\\frac{" + a + "\\sqrt{3}}{2}") + "."), GSR("Rayon (2/3 de la hauteur) ?", m * Math.sqrt(3), RS(m, 3) + " cm.")], traps: [TR(a / 2, "Le centre n'est pas au milieu d'un côté."), TR((a * Math.sqrt(3)) / 2, "Ça, c'est la hauteur entière.")] }); },
      () => { const [a, b, c] = pk([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]]), r = (a + b - c) / 2;
        return Qv("Un triangle rectangle a des côtés de " + M(a) + ", " + M(b) + " et " + M(c) + " cm. Le rayon de son cercle inscrit vaut " + M("r = \\frac{a + b - c}{2}") + ". Calcule-le (en cm).", r, M("\\frac{" + a + " + " + b + " - " + c + "}{2} = " + N(r)) + " cm.",
          { ctx: "inscrit", guide: [GS(M("a + b - c") + " ?", a + b - c, M(a + b - c) + "."), GS(M("r") + " ?", r, M(N(r)) + " cm.")], traps: [TR(c / 2, "Ça, c'est le rayon du cercle CIRCONSCRIT."), TR(a + b - c, "Divise par 2.")] }); },
      () => { const A = 2 * R.int(20, 45), B = 2 * R.int(15, 40); if (A + B >= 170) return null; const C = 180 - A - B;
        return Qv("Dans le triangle " + M("ABC") + ", " + M("\\widehat{A} = " + A + "°") + " et " + M("\\widehat{B} = " + B + "°") + ". " + M("I") + " est le centre du cercle inscrit. Que mesure " + M("\\widehat{AIB}") + " ?", 180 - A / 2 - B / 2, "Les bissectrices coupent A et B en deux : " + M("180° - " + A / 2 + "° - " + B / 2 + "° = " + (180 - A / 2 - B / 2) + "°") + " (ou " + M("90° + \\frac{" + C + "°}{2}") + ").",
          { ctx: "AIB", guide: [GS("Moitiés de A et de B : somme ?", A / 2 + B / 2, M(A / 2 + B / 2) + "°."), GS(M("\\widehat{AIB}") + " ?", 180 - A / 2 - B / 2, M(180 - A / 2 - B / 2) + "°.")], traps: [TR(C, "Ce n'est pas l'angle C."), TR(180 - A - B, "Les bissectrices partagent A et B en deux.")] }); },
    ],
  };

  // ===================== exactes =====================
  const EX = {
    1: [
      () => { const k = R.int(2, 9);
        return Qv("Calcule la diagonale d'un carré de côté " + M(k) + " cm" + EXA + ".", k * Math.SQRT2, M("d = \\sqrt{" + k + "^2 + " + k + "^2} = \\sqrt{" + 2 * k * k + "} = " + k + "\\sqrt{2}") + " cm.",
          { ctx: "diag-carre", radical: true, canon: RC(k, 2), guide: [GS(M("d^2") + " ?", 2 * k * k, M(2 * k * k) + "."), GSR("Valeur exacte ?", k * Math.SQRT2, RS(k, 2) + " cm.")], traps: [TR(2 * k, "La diagonale est plus courte que deux côtés."), TR(k * Math.sqrt(3), "Pour un carré : k√2.")] }); },
      () => { const k = R.int(2, 7);
        return Qv("Calcule la hauteur d'un triangle équilatéral de côté " + M(2 * k) + " cm" + EXA + ".", k * Math.sqrt(3), M("\\sqrt{" + 4 * k * k + " - " + k * k + "} = \\sqrt{" + 3 * k * k + "} = " + k + "\\sqrt{3}") + " cm.",
          { ctx: "h-equi", radical: true, canon: RC(k, 3), guide: [GS(M("h^2") + " ?", 3 * k * k, M(3 * k * k) + "."), GSR("Valeur exacte ?", k * Math.sqrt(3), RS(k, 3) + " cm.")], traps: [TR(k * Math.SQRT2, "Pour l'équilatéral : k√3."), TR(2 * k, "La hauteur est plus courte que le côté.")] }); },
      () => { const k = R.int(2, 9);
        return Qv("Un carré a une aire de " + M(2 * k * k) + " cm². Calcule son côté" + EXA + ".", k * Math.SQRT2, M("\\sqrt{" + 2 * k * k + "} = \\sqrt{" + k * k + " \\cdot 2} = " + k + "\\sqrt{2}") + " cm.",
          { ctx: "cote-aire", radical: true, canon: RC(k, 2), guide: [GS("Plus grand carré parfait qui divise " + M(2 * k * k) + " ?", k * k, M(k * k) + "."), GSR("Côté ?", k * Math.SQRT2, RS(k, 2) + " cm.")], traps: [TR(k * k, "Le côté est la racine de l'aire."), TR((2 * k * k) / 4, "Diviser par 4 donne le côté à partir du périmètre.")] }); },
    ],
    2: [
      () => { const k = R.int(1, 5);
        return Qv("Calcule l'aire d'un triangle équilatéral de côté " + M(2 * k) + " cm" + EXA + ".", k * k * Math.sqrt(3), "Hauteur " + RS(k, 3) + " ; aire " + M("\\frac{" + 2 * k + " \\cdot " + (k === 1 ? "" : k) + "\\sqrt{3}}{2} = " + (k * k === 1 ? "" : k * k) + "\\sqrt{3}") + " cm².",
          { ctx: "aire-equi", radical: true, canon: RC(k * k, 3), guide: [GSR("Hauteur ?", k * Math.sqrt(3), RS(k, 3) + "."), GSR("Aire ?", k * k * Math.sqrt(3), RS(k * k, 3) + " cm².")], traps: [TR(2 * k * k * Math.sqrt(3), "Aire d'un triangle : ÷ 2."), TR(k * k * Math.SQRT2, "C'est √3 pour l'équilatéral.")] }); },
      () => { const k = R.int(1, 6);
        return Qv("Un rectangle mesure " + M(k) + " cm sur " + M(2 * k) + " cm. Calcule sa diagonale" + EXA + ".", k * Math.sqrt(5), M("\\sqrt{" + k * k + " + " + 4 * k * k + "} = \\sqrt{" + 5 * k * k + "} = " + (k === 1 ? "" : k) + "\\sqrt{5}") + " cm.",
          { ctx: "diag-rect", radical: true, canon: RC(k, 5), guide: [GS(M("d^2") + " ?", 5 * k * k, M(5 * k * k) + "."), GSR("Valeur exacte ?", k * Math.sqrt(5), RS(k, 5) + " cm.")], traps: [TR(3 * k, "Pythagore, pas la somme des côtés."), TR(k * Math.sqrt(3), "k² + (2k)² = 5k².")] }); },
      () => { const k = R.int(2, 9);
        return Qv("La diagonale d'un carré mesure " + RS(k, 2) + " cm. Calcule son périmètre (en cm).", 4 * k, "Diagonale " + M("c\\sqrt{2}") + " : le côté vaut " + M(k) + " cm ; périmètre " + M(4 * k) + " cm.",
          { ctx: "perim-diag", guide: [GS("Côté ?", k, M(k) + " cm."), GS("Périmètre ?", 4 * k, M(4 * k) + " cm.")], traps: [TR(4 * k * Math.SQRT2, "Le côté vaut k (la diagonale vaut k√2)."), TR(k * k, "Périmètre : 4 côtés.")] }); },
    ],
    3: [
      () => { const k = R.int(2, 9);
        return Qv("Calcule la diagonale de l'espace d'un cube d'arête " + M(k) + " cm" + EXA + ".", k * Math.sqrt(3), "Diagonale d'une face " + RS(k, 2) + " ; puis " + M("\\sqrt{" + 2 * k * k + " + " + k * k + "} = " + k + "\\sqrt{3}") + " cm.",
          { ctx: "cube", radical: true, canon: RC(k, 3), guide: [GS("Carré de la diagonale d'une face ?", 2 * k * k, M(2 * k * k) + "."), GSR("Diagonale de l'espace ?", k * Math.sqrt(3), RS(k, 3) + " cm.")], traps: [TR(k * Math.SQRT2, "Ça, c'est la diagonale d'une face."), TR(3 * k, "Pythagore deux fois.")] }); },
      () => { const k = R.int(1, 4);
        return Qv("Un hexagone régulier a des côtés de " + M(2 * k) + " cm (six triangles équilatéraux). Calcule son aire" + EXA + ".", 6 * k * k * Math.sqrt(3), "Un triangle : " + RS(k * k, 3) + " cm² ; six triangles : " + RS(6 * k * k, 3) + " cm².",
          { ctx: "hexagone", radical: true, canon: RC(6 * k * k, 3), guide: [GSR("Aire d'un triangle équilatéral de côté " + M(2 * k) + " ?", k * k * Math.sqrt(3), RS(k * k, 3) + "."), GSR("Aire de l'hexagone ?", 6 * k * k * Math.sqrt(3), RS(6 * k * k, 3) + " cm².")], traps: [TR(k * k * Math.sqrt(3), "Il y a six triangles."), TR(3 * k * k * Math.sqrt(3), "Six triangles, pas trois.")] }); },
      () => { const k = R.int(2, 6);
        return Qv("Un disque est inscrit dans un carré de côté " + M(2 * k) + " cm. Calcule l'aire de la partie du carré hors du disque (valeur exacte, touche π, en cm²).", 4 * k * k - Math.PI * k * k, "Carré " + M(4 * k * k) + " cm², disque " + M("\\pi \\cdot " + k + "^2 = " + k * k + "\\pi") + " : " + M(4 * k * k + " - " + k * k + "\\pi") + " cm².",
          { ctx: "carre-disque", pi: true, guide: [GS("Aire du carré ?", 4 * k * k, M(4 * k * k) + "."), GS("Aire du disque (touche π) ?", Math.PI * k * k, M(k * k + "\\pi") + "."), ({ ask: "Différence ?", spec: { kind: "value", value: 4 * k * k - Math.PI * k * k, pi: true }, sol:  M(4 * k * k + " - " + k * k + "\\pi") + "." })], traps: [TR(4 * k * k - Math.PI * 4 * k * k, "Le rayon vaut la moitié du côté : " + k + "."), TR(Math.PI * k * k, "On demande la partie HORS du disque.")] }); },
    ],
  };

  // ===================== angtri =====================
  const AT = {
    1: [
      () => { const a = R.int(25, 80), b = R.int(25, 80);
        return Qv("Dans un triangle, deux angles mesurent " + M(a + "°") + " et " + M(b + "°") + ". Que mesure le troisième (en degrés) ?", 180 - a - b, "Somme des angles : " + M("180° - " + a + "° - " + b + "° = " + (180 - a - b) + "°") + ".",
          { ctx: "triangle", fig: FIG.triAngles([a + "°", b + "°", "?"]), guide: [GS("Somme des deux angles connus ?", a + b, M(a + b) + "°."), GS("Troisième angle ?", 180 - a - b, M(180 - a - b) + "°.")], traps: [TR(360 - a - b, "Dans un triangle, la somme vaut 180° (360° pour un quadrilatère)."), TR(a + b, "On soustrait de 180°.")] }); },
      () => { const s = 2 * R.int(10, 70);
        return Qv("Un triangle isocèle a un angle au sommet de " + M(s + "°") + ". Que mesure chacun des angles à la base (en degrés) ?", (180 - s) / 2, M("\\frac{180° - " + s + "°}{2} = " + (180 - s) / 2 + "°") + " : les angles à la base sont égaux.",
          { ctx: "isocele", guide: [GS("Somme des deux angles à la base ?", 180 - s, M(180 - s) + "°."), GS("Chacun ?", (180 - s) / 2, M((180 - s) / 2) + "°.")], traps: [TR(180 - s, "Les deux angles à la base se partagent ce total."), TR(s, "Les angles à la base sont égaux entre eux, pas à l'angle au sommet.")] }); },
      () => { const a = R.int(60, 120), b = R.int(60, 120), c = R.int(50, 110); if (a + b + c >= 340) return null;
        return Qv("Un quadrilatère a trois angles de " + M(a + "°") + ", " + M(b + "°") + " et " + M(c + "°") + ". Que mesure le quatrième (en degrés) ?", 360 - a - b - c, "Somme des angles d'un quadrilatère : " + M("360°") + " ; " + M("360 - " + a + " - " + b + " - " + c + " = " + (360 - a - b - c)) + "°.",
          { ctx: "quadrilatere", guide: [GS("Somme des trois angles ?", a + b + c, M(a + b + c) + "°."), GS("Quatrième ?", 360 - a - b - c, M(360 - a - b - c) + "°.")], traps: [TR(180 - (a + b + c) % 180, "Un quadrilatère se découpe en deux triangles : 360°."), TR(Math.abs(180 - a - b - c), "La somme vaut 360°, pas 180°.")] }); },
    ],
    2: [
      () => { const a = R.int(30, 75), b = R.int(30, 75);
        return Qv("Dans le triangle " + M("ABC") + ", " + M("\\widehat{A} = " + a + "°") + " et " + M("\\widehat{B} = " + b + "°") + ". On prolonge " + M("[BC]") + " au-delà de " + M("C") + ". Que mesure l'angle extérieur en " + M("C") + " (en degrés) ?", a + b, "Angle " + M("\\widehat{C} = " + (180 - a - b) + "°") + " ; extérieur " + M("180° - " + (180 - a - b) + "° = " + (a + b) + "°") + " (somme des deux autres angles).",
          { ctx: "exterieur", guide: [GS(M("\\widehat{C}") + " ?", 180 - a - b, M(180 - a - b) + "°."), GS("Angle extérieur ?", a + b, M(a + b) + "°.")], traps: [TR(180 - a - b, "Ça, c'est l'angle intérieur C."), TR(360 - a - b, "Angle extérieur = 180° − angle intérieur.")] }); },
      () => { const b = R.int(25, 85);
        return Qv("Un triangle isocèle a deux angles à la base de " + M(b + "°") + ". Que mesure l'angle au sommet (en degrés) ?", 180 - 2 * b, M("180° - 2 \\cdot " + b + "° = " + (180 - 2 * b) + "°") + ".",
          { ctx: "sommet", guide: [GS("Somme des angles à la base ?", 2 * b, M(2 * b) + "°."), GS("Angle au sommet ?", 180 - 2 * b, M(180 - 2 * b) + "°.")], traps: [TR(180 - b, "Il y a DEUX angles à la base de " + b + "°."), TR(b, "Les angles à la base sont égaux entre eux.")] }); },
      () => { const a = R.int(40, 140); if (a === 90) return null;
        return Qv("Dans un parallélogramme, un angle mesure " + M(a + "°") + ". Que mesure l'angle consécutif (voisin) (en degrés) ?", 180 - a, "Deux angles consécutifs d'un parallélogramme sont supplémentaires : " + M("180° - " + a + "° = " + (180 - a) + "°") + ".",
          { ctx: "parallelogramme", guide: [GS("Angle consécutif ?", 180 - a, M(180 - a) + "°.")], traps: [TR(a, "Ce sont les angles OPPOSÉS qui sont égaux."), TR(360 - a, "Consécutifs : supplémentaires (180°).")] }); },
    ],
    3: [
      () => { const n = pk([5, 6, 8, 9, 10, 12]), v = ((n - 2) * 180) / n;
        return Qv("Que mesure chaque angle d'un polygone régulier à " + M(n) + " côtés (en degrés) ?", v, "Somme des angles " + M("(" + n + " - 2) \\cdot 180° = " + (n - 2) * 180 + "°") + " ; chacun " + M((n - 2) * 180 + " : " + n + " = " + N(v) + "°") + ".",
          { ctx: "polygone", guide: [GS("Somme des angles (" + M("(n - 2) \\cdot 180") + ") ?", (n - 2) * 180, M((n - 2) * 180) + "°."), GS("Chaque angle ?", v, M(N(v)) + "°.")], traps: [TR(360 / n, "Ça, c'est l'angle au centre (ou extérieur), pas l'angle intérieur."), TR(180 - 360 / n === v ? (n * 180) / n : (n * 180) / n, "La somme vaut (n − 2) · 180°.")] }); },
      () => { const [p, q, r] = pk([[1, 2, 3], [2, 3, 4], [1, 3, 5], [2, 3, 5], [3, 4, 5]]), k = 180 / (p + q + r); if (!Number.isInteger(k)) return null;
        return Qv("Les angles d'un triangle sont proportionnels à " + M(p) + ", " + M(q) + " et " + M(r) + ". Que mesure le plus grand (en degrés) ?", r * k, M(p + " + " + q + " + " + r + " = " + (p + q + r)) + " parts ; une part " + M("180° : " + (p + q + r) + " = " + k + "°") + " ; le plus grand " + M(r + " \\cdot " + k + " = " + r * k + "°") + ".",
          { ctx: "proportion", guide: [GS("Une part (en degrés) ?", k, M(k) + "°."), GS("Plus grand angle ?", r * k, M(r * k) + "°.")], traps: [TR(r * 10, "Il faut d'abord trouver la valeur d'une part."), TR(k, "Ça, c'est une part ; le plus grand vaut " + r + " parts.")] }); },
      () => { const n = pk([9, 10, 12, 15, 18, 20]), v = ((n - 2) * 180) / n;
        return Qv("Chaque angle d'un polygone régulier mesure " + M(N(v) + "°") + ". Combien a-t-il de côtés ?", n, "Angle extérieur " + M("180° - " + N(v) + "° = " + N(180 - v) + "°") + " ; " + M("360 : " + N(180 - v) + " = " + n) + " côtés.",
          { ctx: "nb-cotes", guide: [GS("Angle extérieur (" + M("180° -") + " angle) ?", 180 - v, M(N(180 - v)) + "°."), GS("Nombre de côtés (" + M("360 :") + " angle extérieur) ?", n, M(n) + ".")], traps: [TR(Math.round(360 / v), "On divise 360° par l'angle EXTÉRIEUR."), TR(Math.round(180 / (180 - v)), "La somme des angles extérieurs vaut 360°.")] }); },
    ],
  };

  const PROBS = {
    euclide: [() => P("Triangle rectangle : la hauteur issue de l'angle droit coupe l'hypoténuse en 9 cm et 16 cm.", [["a) Hauteur (cm)", 12], ["b) Plus petite cathète (cm)", 15], ["c) Aire (cm²)", 150]], ["h² = 9 · 16.", "a² = 9 · 25."], "a) 12 ; b) " + M("\\sqrt{9 \\cdot 25} = 15") + " ; c) " + M("\\frac{25 \\cdot 12}{2} = 150") + ".")],
    geocomb: [() => P("Une tente a la forme d'un prisme : la façade est un triangle isocèle de côtés 2,5 m et de base 4 m ; la tente est longue de 3 m.", [["a) Hauteur de la façade (m)", 1.5], ["b) Aire de la façade (m²)", 3], ["c) Volume de la tente (m³)", 9]], ["Demi-base 2 m.", "Volume = aire de la façade · longueur."], "a) " + M("\\sqrt{6{,}25 - 4} = 1{,}5") + " ; b) 3 ; c) 9.")],
    droitesrem: [() => P("Triangle ABC rectangle en C, AC = 6 cm, BC = 8 cm.", [["a) Rayon du cercle circonscrit (cm)", 5], ["b) Longueur de la médiane issue de C (cm)", 5], ["c) Distance de C au centre de gravité (cm)", 10 / 3]], ["Hypoténuse 10.", "La médiane issue de l'angle droit vaut la moitié de l'hypoténuse."], "a) 5 ; b) 5 ; c) " + M("\\frac{2}{3} \\cdot 5 = \\frac{10}{3}") + ".")],
    exactes: [() => P("Un carré a un côté de 4 cm.", [["a) d² (carré de la diagonale)", 32], ["b) Aire du carré construit sur la diagonale (cm²)", 32], ["c) Rapport de cette aire à celle du carré", 2]], ["d = 4√2.", "(4√2)² = 32."], "a) 32 ; b) 32 ; c) 2.")],
    angtri: [() => P("Un pentagone régulier ABCDE.", [["a) Somme des angles (°)", 540], ["b) Chaque angle (°)", 108], ["c) Angle ABE du triangle isocèle ABE (°)", 36]], ["(5 − 2) · 180.", "ABE isocèle en A, angle en A = 108°."], "a) 540 ; b) 108 ; c) " + M("\\frac{180 - 108}{2} = 36") + ".")],
  };

  const ALL = { euclide: EU, geocomb: GC, droitesrem: DR, exactes: EX, angtri: AT };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => pickForm(lv[Math.min(Math.max(d, 1), 3)]);
    if (typeof VAR !== "undefined") VAR[id] = {};
    if (typeof PROB !== "undefined") delete PROB[id];
    PROB_EXTRA[id] = PROBS[id];
  }
  Object.assign(HINTS_EXTRA, {
    euclide: "Triangle rectangle, hauteur h sur l'hypoténuse c = p + q : h² = p · q ; a² = p · c ; b² = q · c ; et a · b = c · h.",
    geocomb: "Cherche le triangle rectangle caché (hauteur d'un isocèle, demi-diagonales, débord d'un trapèze), puis Pythagore.",
    droitesrem: "Centre de gravité : aux 2/3 de chaque médiane depuis le sommet. Triangle rectangle : le centre du cercle circonscrit est le milieu de l'hypoténuse.",
    exactes: "Carré de côté a : diagonale a√2. Équilatéral de côté a : hauteur a√3/2. Garde les racines, ne passe pas aux décimaux.",
    angtri: "Triangle : 180°. Quadrilatère : 360°. Polygone à n côtés : (n − 2) · 180°. Isocèle : angles à la base égaux.",
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    euclide: ["Hauteur, cathète, projection", "Hauteur par l'aire, segment, hypoténuse", "Aire, périmètre, écart"],
    geocomb: ["Diagonale, isocèle, équilatéral", "Toit, carton, losange", "Trapèze, cône, plus court chemin"],
    droitesrem: ["Centre de gravité, cercle circonscrit", "Bissectrices, médiane, hauteur", "Équilatéral, cercle inscrit, angle AIB"],
    exactes: ["Diagonale, hauteur, côté", "Aire de l'équilatéral, rectangle, périmètre", "Cube, hexagone, disque inscrit"],
    angtri: ["Triangle, isocèle, quadrilatère", "Angle extérieur, sommet, parallélogramme", "Polygones réguliers, angles proportionnels"],
  });
})();
