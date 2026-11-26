// 25.11 (soir) · France : derniers manques du programme (tools/france_couverture.md, branche agent/frfin). Notions créées
// (3 niveaux, ≥ 3 formes par niveau, pas à pas, pièges, contextes, leçon, compétences, défi de niveau 4 ; leçons actives
// dans src/fr_act.js) : 6e symax (symétrie axiale), mediatrice, echelle6 (échelles : la notion suisse echelle mélange
// aires et volumes × k², × k³, de 4e), proba6 (premiers pas en probabilités : proba est de 5e, avec deux dés et des
// tirages sans remise) ; 5e empil (empilements de cubes, vues) ; 2nde compdiff (comparer par différence ou quotient,
// AU.01, NC.10) ; 1re posrelc (position relative de deux courbes, AN.09) ; Tle intmaj (majorer, encadrer une intégrale,
// AN.24), suiteint (suites d'intégrales, AN.26). Rattachement : progcalc passe de la 4e à la 5e (src/fr_college.js,
// formes de 4e écartées par HORS_FR, src/fr_couv.js). Notes sur 20 pour un profil français : FR_NOTES (lu par
// Engine.finalize) remplace les questions à notes suisses (1 à 6). Notions sans CH ni MP : invisibles pour un élève suisse.
(function () {
  const { pk, nz, rnd, g2, N, NP, F, FS, sg, X, co, mk, QN, QR, QX, QS, GR, GX, TR, TX, TS, P, reg } = FRX;
  const D = (v) => String(rnd(v, 6)).replace(".", ","); /* décimal en texte simple */
  const QD = (q, value, sol, o) => mk(q, { kind: "value", value: rnd(value, 9) }, sol, Object.assign({ canon: D(value) }, o));
  const QF = (q, value, sol, o) => mk(q, { kind: "value", value: rnd(value, 12) }, sol, Object.assign({ canon: FS(value) }, o));
  const GD = (ask, value, sol, round) => GR(ask, rnd(value, 9), sol, round);
  const TD = (v, m) => TR(rnd(v, 9), m);
  const dec1 = (a, b) => R.int(Math.round(a * 10), Math.round(b * 10)) / 10;
  const who = () => pk(["Léa", "Hugo", "Chloé", "Nathan", "Manon", "Louis", "Camille", "Jules", "Inès", "Gabriel", "Zoé", "Adam"]);
  const cm = (v) => M(N(v) + "\\text{ cm}");
  const deg = (v) => M(N(v) + "°");
  // ---------- petites figures SVG (classes du thème, lisibles à 360 px) ----------
  const sv = (w, h, g, lab) => '<svg class="fig" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + lab + '" xmlns="http://www.w3.org/2000/svg">' + g + "</svg>";
  const tx = (x, y, s, a = "middle", sz = 13, cls = "f-txt") => '<text x="' + (+x).toFixed(1) + '" y="' + (+y).toFixed(1) + '" class="' + cls + '" text-anchor="' + a + '" font-size="' + sz + '">' + String(s).replace(/\./g, ",") + "</text>";
  const ln = (x1, y1, x2, y2, cls = "f-line", ex = "") => '<line x1="' + (+x1).toFixed(1) + '" y1="' + (+y1).toFixed(1) + '" x2="' + (+x2).toFixed(1) + '" y2="' + (+y2).toFixed(1) + '" class="' + cls + '"' + ex + "/>";
  const dot = (x, y) => '<circle cx="' + (+x).toFixed(1) + '" cy="' + (+y).toFixed(1) + '" r="4" class="f-dot"/>';
  const pg = (pts, cls = "f-shape", ex = "") => '<polygon points="' + pts.map((p) => (+p[0]).toFixed(1) + "," + (+p[1]).toFixed(1)).join(" ") + '" class="' + cls + '"' + ex + "/>";
  const AX = ' stroke-width="2.4" stroke-dasharray="7 4"';
  /* quadrillage : o = { cols, rows, s, v (axe vertical x = v), h (axe horizontal y = h), cells [[i, j]], pts [[x, y, nom]], polys [[[x, y]…]] } */
  const grille = (o) => {
    const s = o.s || 24, W = o.cols * s + 24, H = o.rows * s + 24, gx = (x) => 12 + x * s, gy = (y) => 12 + (o.rows - y) * s;
    let g = "";
    for (const [i, j] of o.cells || []) g += '<rect x="' + gx(i) + '" y="' + gy(j + 1) + '" width="' + s + '" height="' + s + '" class="f-fill2"/>';
    for (let i = 0; i <= o.cols; i++) g += ln(gx(i), gy(0), gx(i), gy(o.rows), "f-grid", ' stroke-width="0.9"');
    for (let j = 0; j <= o.rows; j++) g += ln(gx(0), gy(j), gx(o.cols), gy(j), "f-grid", ' stroke-width="0.9"');
    for (const Q of o.polys || []) g += pg(Q.map(([x, y]) => [gx(x), gy(y)]), "f-shape", ' style="fill-opacity:.6"');
    if (o.v !== undefined) g += ln(gx(o.v), gy(0) + 8, gx(o.v), gy(o.rows) - 8, "f-accent", AX) + tx(gx(o.v) + 5, gy(o.rows) + 2, "(d)", "start", 13, "f-accent f-txt");
    if (o.h !== undefined) g += ln(gx(0) - 8, gy(o.h), gx(o.cols) + 8, gy(o.h), "f-accent", AX) + tx(gx(o.cols) - 4, gy(o.h) - 6, "(d)", "end", 13, "f-accent f-txt");
    for (const [x, y, nm] of o.pts || []) g += dot(gx(x), gy(y)) + tx(gx(x) + 7, gy(y) - 7, nm, "start", 14);
    return sv(W, H, g, o.lab || "quadrillage");
  };
  /* droite graduée de a à b, axes perpendiculaires (d) en vs, points [[x, nom]] */
  const graduee = (a, b, vs, pts, lab) => {
    const W = 320, x = (v) => 16 + ((v - a) / (b - a)) * (W - 32), y0 = 70;
    let g = ln(8, y0, W - 8, y0, "f-line", ' stroke-width="1.6"');
    for (let v = a; v <= b + 1e-9; v++) g += ln(x(v), y0 - 6, x(v), y0 + 6) + tx(x(v), y0 + 22, v, "middle", 11, "f-txt f-tick");
    vs.forEach(([v, nm], i) => (g += ln(x(v), 14, x(v), 120, "f-accent", AX) + tx(x(v) + 4, 24 + 12 * i, nm, "start", 12, "f-accent f-txt")));
    for (const [v, nm] of pts) g += dot(x(v), y0) + tx(x(v), y0 - 10, nm, "middle", 14);
    return sv(W, 130, g, lab);
  };

  // ======================= symax : symétrie axiale (6e.EG.19–20) =======================
  const FIGS = [ /* [nom, axes par des milieux de côtés, axes par des sommets, total, piège, message] */
    ["un rectangle (qui n'est pas un carré)", 2, 0, "Les diagonales d'un rectangle ne sont pas des axes de symétrie : plie-le selon une diagonale, les deux moitiés ne se superposent pas.", 4, "rectangle"],
    ["un carré", 2, 2, "Le carré a les axes du rectangle ET ceux du losange (ses deux diagonales).", 2, "carre"],
    ["un losange (qui n'est pas un carré)", 0, 2, "Les axes d'un losange sont ses diagonales, pas les droites qui joignent les milieux des côtés.", 4, "losange"],
    ["un triangle équilatéral", 0, 3, "Chaque axe passe par un sommet et par le milieu du côté opposé : il y en a un par sommet.", 1, "equilateral"],
    ["un hexagone régulier", 3, 3, "Trois axes passent par deux sommets opposés, trois autres par les milieux de deux côtés opposés.", 3, "hexagone"],
    ["un octogone régulier", 4, 4, "Quatre axes passent par deux sommets opposés, quatre autres par les milieux de deux côtés opposés.", 4, "octogone"],
    ["un pentagone régulier", 0, 5, "Avec un nombre impair de côtés, chaque axe passe par un sommet et par le milieu du côté opposé : un par sommet.", 10, "pentagone"],
  ];
  const regFig = (n, lab) => { const c = [160, 92], r = 72, a0 = n === 4 ? Math.PI / 4 : -Math.PI / 2; return sv(320, 184, pg(Array.from({ length: n }, (_, k) => [c[0] + r * Math.cos(a0 + (2 * Math.PI * k) / n), c[1] + r * Math.sin(a0 + (2 * Math.PI * k) / n)])), lab); };
  const shapeFig = (nm) => nm === "rectangle" ? sv(320, 150, pg([[50, 25], [270, 25], [270, 125], [50, 125]]), "rectangle") : nm === "losange" ? sv(320, 170, pg([[160, 10], [270, 85], [160, 160], [50, 85]]), "losange")
    : regFig({ carre: 4, equilateral: 3, hexagone: 6, octogone: 8, pentagone: 5 }[nm], nm);
  const SA = {
    1: [
      () => { const [nm, m, s, msg, trap, id] = pk(FIGS), t = m + s;
        const sm = m ? M(m) + " passant par les milieux de deux côtés opposés" : "", ss = s ? M(s) + " passant par " + (id === "equilateral" || id === "pentagone" ? "un sommet et le milieu du côté opposé" : "deux sommets opposés") : "";
        return QN("Combien d'axes de symétrie a " + nm + " ?", t, "Un axe de symétrie partage la figure en deux moitiés qui se superposent par pliage. " + [sm, ss].filter(Boolean).join(" et ") + " : " + M(t) + " axes.",
          { ctx: "axes-" + id, fig: shapeFig(id), guide: [GR("Combien d'axes passent par les milieux de deux côtés (opposés) ?", m, m ? M(m) + "." : "Aucun."), GR("Combien d'axes passent par un ou deux sommets ?", s, s ? M(s) + "." : "Aucun."), GR("Nombre total d'axes ?", t, M(t) + ".")],
            traps: [TR(trap, msg), TR(t === 2 ? 1 : 2, "Plie la figure en pensée : compte tous les plis où les deux moitiés se superposent.")] }); },
      () => { const s = [dec1(2.5, 6.5), dec1(2.5, 6.5), dec1(2.5, 6.5)]; if (s[0] + s[1] <= s[2] || s[0] + s[2] <= s[1] || s[1] + s[2] <= s[0] || new Set(s).size < 3) return null; const p = rnd(s[0] + s[1] + s[2], 6);
        return QD("Le triangle " + M("A'B'C'") + " est le symétrique du triangle " + M("ABC") + " par rapport à une droite " + M("(d)") + ". On sait que " + M("AB = " + N(s[0])) + " cm, " + M("BC = " + N(s[1])) + " cm et " + M("AC = " + N(s[2])) + " cm. Quel est le périmètre du triangle " + M("A'B'C'") + " (en cm) ?", p,
          "La symétrie axiale conserve les longueurs : " + M("A'B' = " + N(s[0])) + ", " + M("B'C' = " + N(s[1])) + ", " + M("A'C' = " + N(s[2])) + ". Périmètre : " + M(N(s[0]) + " + " + N(s[1]) + " + " + N(s[2]) + " = " + N(p)) + " cm.",
          { ctx: "conserve-longueur", guide: [GD("Combien mesure " + M("A'B'") + " (en cm) ?", s[0], M(N(s[0])) + " cm : même longueur que " + M("AB") + "."), GD("Périmètre de " + M("A'B'C'") + " (en cm) ?", p, M(N(p)) + " cm.")],
            traps: [TD(2 * p, "On ne double pas : le triangle symétrique a les mêmes longueurs, donc le même périmètre."), TD(s[0] + s[1], "Le périmètre est la somme des trois côtés.")] }); },
      () => { const a = R.int(35, 80), b = R.int(30, 75), c = 180 - a - b; if (c < 25 || a === b || b === c || a === c) return null;
        return QN("Le triangle " + M("A'B'C'") + " est le symétrique du triangle " + M("ABC") + " par rapport à une droite " + M("(d)") + ". Dans " + M("ABC") + ", " + M("\\widehat{A} = " + a + "°") + " et " + M("\\widehat{B} = " + b + "°") + ". Quelle est la mesure de l'angle " + M("\\widehat{C'}") + " (en degrés) ?", c,
          "Somme des angles d'un triangle : " + M("\\widehat{C} = 180° - " + a + "° - " + b + "° = " + c + "°") + ". La symétrie axiale conserve les angles : " + M("\\widehat{C'} = " + c + "°") + ".",
          { ctx: "conserve-angle", guide: [GR("Mesure de " + M("\\widehat{C}") + " dans " + M("ABC") + " ?", c, M("180 - " + a + " - " + b + " = " + c) + "."), GR(M("\\widehat{C'}") + " ?", c, M(c + "°") + " : la symétrie conserve les angles.")],
            traps: [TR(a + b, "On cherche le troisième angle : 180° moins les deux autres."), TR(180 - c, "La symétrie conserve les angles : Ĉ' = Ĉ.")] }); },
      () => { const vert = R.rand() < 0.5, k = R.int(2, 5), c = R.int(6, 8), r = R.int(1, 5);
        const o = vert ? { cols: 14, rows: 6, v: c, pts: [[c - k, r, "A"]] } : { cols: 12, rows: 9, h: 5, pts: [[R.int(2, 9), 5 + (k > 3 ? -k : k), "A"]] };
        return QN("Sur le quadrillage, " + M("A'") + " est le symétrique de " + M("A") + " par rapport à la droite " + M("(d)") + ". Combien de carreaux séparent " + M("A") + " et " + M("A'") + " ?", 2 * k,
          M("A") + " est à " + M(k) + " carreaux de " + M("(d)") + " ; " + M("A'") + " est à " + M(k) + " carreaux de l'autre côté, sur la perpendiculaire à " + M("(d)") + " : " + M(k + " + " + k + " = " + 2 * k) + " carreaux.",
          { ctx: vert ? "quadrillage-vertical" : "quadrillage-horizontal", fig: grille(Object.assign(o, { lab: "point A et axe (d) sur un quadrillage" })),
            guide: [GR("À combien de carreaux de " + M("(d)") + " est le point " + M("A") + " ?", k, M(k) + " carreaux."), GR("Distance " + M("AA'") + " en carreaux ?", 2 * k, M(2 * k) + " : " + M("(d)") + " passe au milieu de " + M("[AA']") + ".")],
            traps: [TR(k, "C'est la distance de A à l'axe ; A' est aussi loin de l'autre côté.")] }); },
    ],
    2: [
      () => { const c = R.int(30, 70) / 10, a = rnd(c - dec1(0.6, 2.8), 6), b = rnd(2 * c - a, 6); if (a < 0.3) return null;
        return QD("Sur une droite graduée, le point " + M("A") + " a pour abscisse " + M(N(a)) + ". La droite " + M("(d)") + ", perpendiculaire à la droite graduée, la coupe au point d'abscisse " + M(N(c)) + ". Quelle est l'abscisse du symétrique " + M("A'") + " de " + M("A") + " par rapport à " + M("(d)") + " ?", b,
          M("A") + " est à " + M(N(c) + " - " + N(a) + " = " + N(rnd(c - a, 6))) + " de " + M("(d)") + " ; " + M("A'") + " est à la même distance de l'autre côté : " + M(N(c) + " + " + N(rnd(c - a, 6)) + " = " + N(b)) + ".",
          { ctx: "droite-graduee", fig: graduee(0, 10, [[c, "(d)"]], [[a, "A"]], "droite graduée, point A et axe (d)"), guide: [GD("Distance de " + M("A") + " à " + M("(d)") + " ?", c - a, M(N(rnd(c - a, 6)))), GD("Abscisse de " + M("A'") + " ?", b, M(N(b)) + ".")],
            traps: [TD(c - a, "C'est la distance de A à (d) ; on demande l'abscisse de A'."), TD(c + a, "A' est à la même distance de (d) que A : ajoute à " + D(c) + " la distance " + D(c - a) + ".")] }); },
      () => { const ax = dec1(2, 5), s = [dec1(1.5, 4.5), dec1(1.5, 4.5), dec1(1.5, 4.5)], p = rnd(2 * (s[0] + s[1] + s[2]), 6);
        return QD("Une figure est symétrique par rapport à la droite " + M("(d)") + ". On n'en a dessiné que la moitié : un polygone dont un côté de " + cm(ax) + " est posé sur " + M("(d)") + " et dont les trois autres côtés mesurent " + cm(s[0]) + ", " + cm(s[1]) + " et " + cm(s[2]) + ". Quel est le périmètre de la figure entière (en cm) ?", p,
          "Le côté posé sur l'axe est à l'intérieur de la figure entière : il ne compte pas. Les trois autres côtés et leurs symétriques forment le contour : " + M("2 \\times (" + N(s[0]) + " + " + N(s[1]) + " + " + N(s[2]) + ") = " + N(p)) + " cm.",
          { ctx: "moitie-perimetre", fig: sv(320, 160, pg([[160, 20], [70, 40], [50, 120], [160, 140]], "f-shape") + pg([[160, 20], [250, 40], [270, 120], [160, 140]], "f-soft", ' style="stroke-dasharray:5 4"') + ln(160, 8, 160, 152, "f-accent", AX) + tx(166, 18, "(d)", "start", 13, "f-accent f-txt"), "moitié de figure et son symétrique"),
            guide: [GD("Contour d'une moitié, sans le côté posé sur l'axe (en cm) ?", s[0] + s[1] + s[2], M(N(rnd(s[0] + s[1] + s[2], 6))) + " cm."), GD("Périmètre de la figure entière (en cm) ?", p, M(N(p)) + " cm.")],
            traps: [TD(2 * (s[0] + s[1] + s[2] + ax), "Le côté posé sur l'axe se retrouve à l'intérieur de la figure : il ne fait pas partie du contour."), TD(s[0] + s[1] + s[2] + ax, "C'est le périmètre de la moitié ; la figure entière a deux fois les trois côtés extérieurs.")] }); },
      () => { const b = R.int(28, 76); if (b === 60 || b === 45) return null; const a = 180 - 2 * b;
        return QN("La droite " + M("(d)") + " est un axe de symétrie du triangle " + M("ABC") + " : elle passe par " + M("A") + " et par le milieu de " + M("[BC]") + ". On sait que " + M("\\widehat{B} = " + b + "°") + ". Quelle est la mesure de " + M("\\widehat{A}") + " (en degrés) ?", a,
          "Le symétrique de " + M("B") + " est " + M("C") + " : " + M("\\widehat{C} = \\widehat{B} = " + b + "°") + " (le triangle est isocèle en " + M("A") + "). Donc " + M("\\widehat{A} = 180° - 2 \\times " + b + "° = " + a + "°") + ".",
          { ctx: "isocele-axe", fig: sv(320, 170, pg([[160, 18], [60, 150], [260, 150]]) + ln(160, 8, 160, 162, "f-accent", AX) + tx(166, 20, "(d)", "start", 13, "f-accent f-txt") + tx(160, 12, "A", "end", 14) + tx(52, 160, "B", "end", 14) + tx(268, 160, "C", "start", 14), "triangle ABC et son axe (d)"),
            guide: [GR("Mesure de " + M("\\widehat{C}") + " ?", b, M(b + "°") + " : la symétrie conserve les angles."), GR("Mesure de " + M("\\widehat{A}") + " ?", a, M("180 - " + 2 * b + " = " + a) + ".")],
            traps: [TR(180 - b, "Il y a deux angles de " + b + "° (en B et en C) à retirer de 180°."), TR(90 - b, "La somme des trois angles vaut 180°.")] }); },
    ],
    3: [
      () => { const a = dec1(0.5, 3), c1 = dec1(a + 0.8, a + 2.5), c2 = rnd(c1 + dec1(0.6, 2.2), 6), a1 = rnd(2 * c1 - a, 6), a2 = rnd(2 * c2 - a1, 6); if (a1 < c2 + 0.2 && a1 > c2 - 0.2) return null; if (a2 < 0 || a2 > 14) return null;
        return QD("Sur une droite graduée, " + M("A") + " a pour abscisse " + M(N(a)) + ". Deux droites " + M("(d_1)") + " et " + M("(d_2)") + ", perpendiculaires à la droite graduée, la coupent aux points d'abscisses " + M(N(c1)) + " et " + M(N(c2)) + ". " + M("A'") + " est le symétrique de " + M("A") + " par rapport à " + M("(d_1)") + ", puis " + M("A''") + " celui de " + M("A'") + " par rapport à " + M("(d_2)") + ". Quelle est l'abscisse de " + M("A''") + " ?", a2,
          M("A'") + " : " + M(N(c1) + " + (" + N(c1) + " - " + N(a) + ") = " + N(a1)) + ". " + M("A''") + " : " + M(N(c2) + " " + (a1 > c2 ? "-" : "+") + " " + N(Math.abs(rnd(a1 - c2, 6))) + " = " + N(a2)) + " (même distance à " + M("(d_2)") + ", de l'autre côté).",
          { ctx: "deux-axes", fig: graduee(0, 14, [[c1, "(d₁)"], [c2, "(d₂)"]], [[a, "A"]], "droite graduée, point A et deux axes"), guide: [GD("Abscisse de " + M("A'") + " ?", a1, M(N(a1)) + "."), GD("Distance de " + M("A'") + " à " + M("(d_2)") + " ?", Math.abs(a1 - c2), M(N(Math.abs(rnd(a1 - c2, 6))))), GD("Abscisse de " + M("A''") + " ?", a2, M(N(a2)) + ".")],
            traps: [TD(a1, "C'est A' ; il reste la symétrie par rapport à (d₂)."), TD(2 * c2 - a, "On applique la deuxième symétrie à A', pas à A.")] }); },
      () => { const cols = 8, rows = 5, v = 4, all = []; for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) all.push([i, j]);
        const key = (c) => c[0] + "," + c[1], mir = (c) => [2 * v - 1 - c[0], c[1]], S = new Set();
        for (const c of all) if (c[0] < v && R.rand() < 0.4) { S.add(key(c)); if (R.rand() < 0.55) S.add(key(mir(c))); }
        for (const c of all) if (c[0] >= v && R.rand() < 0.12) S.add(key(c));
        const cells = [...S].map((k) => k.split(",").map(Number)), miss = cells.filter((c) => !S.has(key(mir(c)))).length;
        if (miss < 2 || miss > 7 || cells.length < 6) return null;
        return QN("On veut que la figure coloriée soit symétrique par rapport à la droite " + M("(d)") + ". Combien de carreaux faut-il colorier en plus, au minimum (on n'efface rien) ?", miss,
          "Pour chaque carreau colorié, son symétrique par rapport à " + M("(d)") + " (même rangée, même distance à l'axe de l'autre côté) doit l'être aussi. " + M(miss) + " carreaux coloriés n'ont pas encore leur symétrique.",
          { ctx: "completer-cases", fig: grille({ cols, rows, v, cells, s: 30, lab: "carreaux coloriés et axe (d)" }), guide: [GR("Carreaux coloriés à gauche de " + M("(d)") + " dont le symétrique est blanc ?", cells.filter((c) => c[0] < v && !S.has(key(mir(c)))).length, "Compte rangée par rangée."), GR("Et à droite de " + M("(d)") + " ?", cells.filter((c) => c[0] >= v && !S.has(key(mir(c)))).length, "Même chose de l'autre côté."), GR("Carreaux à colorier en tout ?", miss, M(miss) + ".")],
            traps: [TR(cells.length, "C'est le nombre de carreaux déjà coloriés ; compte seulement ceux dont le symétrique manque."), TR(cells.filter((c) => c[0] < v && !S.has(key(mir(c)))).length, "Regarde aussi les carreaux coloriés à droite de l'axe.")] }); },
      () => { const L = dec1(2.5, 7), l = dec1(1.5, 4); if (L <= l + 0.4) return null; const p = rnd(2 * (2 * L + l), 6);
        return QD("Le rectangle " + M("ABCD") + " a pour longueur " + M("AB = " + N(L)) + " cm et pour largeur " + M("BC = " + N(l)) + " cm. On trace son symétrique par rapport à la droite " + M("(BC)") + ". Le rectangle et son symétrique forment un grand rectangle. Quel est le périmètre de ce grand rectangle (en cm) ?", p,
          "La symétrie conserve les longueurs ; le symétrique est collé le long de " + M("[BC]") + ". Le grand rectangle mesure " + M("2 \\times " + N(L) + " = " + N(rnd(2 * L, 6))) + " cm sur " + M(N(l)) + " cm : périmètre " + M("2 \\times (" + N(rnd(2 * L, 6)) + " + " + N(l) + ") = " + N(p)) + " cm.",
          { ctx: "recoller-rectangle", fig: sv(320, 120, pg([[20, 20], [160, 20], [160, 100], [20, 100]]) + pg([[160, 20], [300, 20], [300, 100], [160, 100]], "f-soft", ' style="stroke-dasharray:5 4"') + tx(14, 16, "A", "end", 13) + tx(160, 14, "B", "middle", 13) + tx(160, 116, "C", "middle", 13) + tx(14, 114, "D", "end", 13), "rectangle ABCD et son symétrique par rapport à (BC)"),
            guide: [GD("Longueur du grand rectangle (en cm) ?", 2 * L, M(N(rnd(2 * L, 6))) + " cm."), GD("Périmètre (en cm) ?", p, M(N(p)) + " cm.")],
            traps: [TD(4 * (L + l), "Le côté [BC], commun aux deux rectangles, n'est plus sur le contour."), TD(2 * (L + l), "C'est le périmètre du petit rectangle.")] }); },
    ],
  };

  // ======================= mediatrice : médiatrice d'un segment (6e.EG.06–08, 17) =======================
  const medFig = (lab, o = {}) => sv(320, 170, ln(50, 130, 270, 130, "f-line", ' stroke-width="2"') + dot(50, 130) + dot(270, 130) + tx(44, 148, "A", "end", 14) + tx(276, 148, "B", "start", 14) + ln(160, 10, 160, 165, "f-accent", AX) + tx(166, 22, "(d)", "start", 13, "f-accent f-txt")
    + '<path d="M160,120 L170,120 L170,130" class="f-line" fill="none"/>' + ln(102, 125, 108, 135) + ln(212, 125, 218, 135) + (o.M ? dot(160, 44) + ln(50, 130, 160, 44, "f-line") + ln(270, 130, 160, 44, "f-line") + tx(168, 44, "M", "start", 14) : "") + (o.I ? tx(166, 146, "I", "start", 14) : ""), lab);
  const MD = {
    1: [
      () => { const ab = dec1(3.2, 9.8); if (Math.round(ab * 10) % 2) return null;
        return QD("La médiatrice du segment " + M("[AB]") + " coupe " + M("[AB]") + " au point " + M("I") + ". On sait que " + M("AB = " + N(ab)) + " cm. Combien mesure " + M("AI") + " (en cm) ?", ab / 2,
          "La médiatrice d'un segment est la droite perpendiculaire à ce segment qui passe par son milieu. " + M("I") + " est le milieu de " + M("[AB]") + " : " + M("AI = " + N(ab) + " \\div 2 = " + N(rnd(ab / 2, 6))) + " cm.",
          { ctx: "milieu", fig: medFig("segment AB et sa médiatrice", { I: 1 }), guide: [GD("Par quel nombre divise-t-on " + M("AB") + " pour obtenir " + M("AI") + " ?", 2, M("I") + " est le milieu : on divise par 2."), GD(M("AI") + " (en cm) ?", ab / 2, M(N(rnd(ab / 2, 6))) + " cm.")],
            traps: [TD(2 * ab, "I est le milieu de [AB] : AI est la moitié de AB."), TD(ab - 1, "AI = AB ÷ 2.")] }); },
      () => { const ma = dec1(3, 8.5), ab = dec1(2.5, 7.5); if (2 * ma <= ab) return null; const p = rnd(2 * ma + ab, 6);
        return QD("Le point " + M("M") + " est sur la médiatrice du segment " + M("[AB]") + ". On sait que " + M("MA = " + N(ma)) + " cm et " + M("AB = " + N(ab)) + " cm. Quel est le périmètre du triangle " + M("MAB") + " (en cm) ?", p,
          "Un point de la médiatrice de " + M("[AB]") + " est à la même distance de " + M("A") + " et de " + M("B") + " : " + M("MB = MA = " + N(ma)) + " cm. Périmètre : " + M(N(ma) + " + " + N(ma) + " + " + N(ab) + " = " + N(p)) + " cm.",
          { ctx: "perimetre", fig: medFig("M sur la médiatrice de [AB]", { M: 1 }), guide: [GD(M("MB") + " (en cm) ?", ma, M(N(ma)) + " cm : " + M("M") + " est équidistant de " + M("A") + " et " + M("B") + "."), GD("Périmètre de " + M("MAB") + " (en cm) ?", p, M(N(p)) + " cm.")],
            traps: [TD(ma + ab, "Il manque le côté [MB], de même longueur que [MA]."), TD(2 * ma + ab / 2, "Le côté [AB] compte en entier dans le périmètre.")] }); },
      () => { const s = dec1(6, 17); const h = rnd(s / 2, 6); if (Math.round(s * 10) % 2) return null;
        return QD(who() + " place un point " + M("M") + " sur la médiatrice du segment " + M("[AB]") + " et mesure : " + M("MA + MB = " + N(s)) + " cm. Combien mesure " + M("MB") + " (en cm) ?", h,
          M("M") + " est sur la médiatrice de " + M("[AB]") + " : " + M("MA = MB") + ". Les deux longueurs sont égales et ont pour somme " + M(N(s)) + " : " + M("MB = " + N(s) + " \\div 2 = " + N(h)) + " cm.",
          { ctx: "somme", guide: [GD("Que vaut " + M("MA - MB") + " ?", 0, "0 : " + M("MA = MB") + "."), GD(M("MB") + " (en cm) ?", h, M(N(h)) + " cm.")],
            traps: [TD(s, "C'est la somme des deux longueurs ; elles sont égales."), TD(2 * s, "MA et MB sont égales : chacune vaut la moitié de la somme.")] }); },
    ],
    2: [
      () => { const a = dec1(0.5, 4), b = rnd(a + 2 * dec1(1, 3), 6), m = rnd((a + b) / 2, 6);
        return QD("Sur une droite graduée, " + M("A") + " a pour abscisse " + M(N(a)) + " et " + M("B") + " a pour abscisse " + M(N(b)) + ". La médiatrice de " + M("[AB]") + " coupe la droite graduée en un point. Quelle est son abscisse ?", m,
          "La médiatrice passe par le milieu de " + M("[AB]") + ". " + M("AB = " + N(b) + " - " + N(a) + " = " + N(rnd(b - a, 6))) + ", la moitié vaut " + M(N(rnd((b - a) / 2, 6))) + " : " + M(N(a) + " + " + N(rnd((b - a) / 2, 6)) + " = " + N(m)) + ".",
          { ctx: "droite-graduee", fig: graduee(0, 10, [], [[a, "A"], [b, "B"]], "points A et B sur une droite graduée"), guide: [GD("Longueur " + M("AB") + " ?", b - a, M(N(rnd(b - a, 6)))), GD("Moitié de " + M("AB") + " ?", (b - a) / 2, M(N(rnd((b - a) / 2, 6)))), GD("Abscisse du milieu ?", m, M(N(m)) + ".")],
            traps: [TD((b - a) / 2, "C'est la demi-longueur ; ajoute-la à l'abscisse de A."), TD(a + b, "Le milieu est à mi-chemin : (a + b) ÷ 2.")] }); },
      () => { const t = R.int(32, 74); if (t === 60 || t === 45) return null; const m = 180 - 2 * t;
        return QN("Le point " + M("M") + " est sur la médiatrice du segment " + M("[AB]") + " (et pas sur " + M("[AB]") + "). L'angle " + M("\\widehat{MAB}") + " mesure " + deg(t) + ". Quelle est la mesure de l'angle " + M("\\widehat{AMB}") + " (en degrés) ?", m,
          M("MA = MB") + " : le triangle " + M("MAB") + " est isocèle en " + M("M") + ", donc " + M("\\widehat{MBA} = \\widehat{MAB} = " + t + "°") + ". Somme des angles : " + M("\\widehat{AMB} = 180° - 2 \\times " + t + "° = " + m + "°") + ".",
          { ctx: "isocele-angle", fig: medFig("triangle MAB isocèle", { M: 1 }), guide: [GR(M("\\widehat{MBA}") + " ?", t, M(t + "°") + " (triangle isocèle)."), GR(M("\\widehat{AMB}") + " ?", m, M("180 - " + 2 * t + " = " + m) + ".")],
            traps: [TR(180 - t, "Les angles en A et en B sont égaux : retire " + t + "° deux fois."), TR(90 - t, "La somme des angles d'un triangle vaut 180°.")] }); },
      () => { const r = dec1(2.2, 6.4), s = rnd(2 * r, 6), ask = pk(["somme", "diametre"]);
        const v = ask === "somme" ? s : s;
        return QD("Les médiatrices des côtés du triangle " + M("ABC") + " se coupent au point " + M("O") + ", et " + M("OA = " + N(r)) + " cm. " + (ask === "somme" ? "Combien vaut " + M("OB + OC") + " (en cm) ?" : "Quel est le diamètre du cercle circonscrit au triangle " + M("ABC") + " (en cm) ?"), v,
          M("O") + " est sur la médiatrice de " + M("[AB]") + " : " + M("OB = OA") + " ; sur celle de " + M("[AC]") + " : " + M("OC = OA") + ". " + (ask === "somme" ? M("OB + OC = 2 \\times " + N(r) + " = " + N(s)) + " cm." : "Le cercle de centre " + M("O") + " passe par " + M("A") + ", " + M("B") + ", " + M("C") + " : rayon " + M(N(r)) + " cm, diamètre " + M(N(s)) + " cm."),
          { ctx: "circonscrit-" + ask, guide: [GD(M("OB") + " (en cm) ?", r, M(N(r)) + " cm."), GD(ask === "somme" ? M("OB + OC") + " ?" : "Diamètre (en cm) ?", v, M(N(v)) + " cm.")],
            traps: [TD(r, ask === "somme" ? "OB et OC valent chacun " + D(r) + " cm : additionne-les." : "C'est le rayon ; le diamètre est le double."), TD(3 * r, "On ne compte pas OA.")] }); },
    ],
    3: [
      () => { const ab = dec1(3, 8), ma = dec1(ab / 2 + 1, 9.5), p = rnd(2 * ma + ab, 6);
        return QD("Le point " + M("M") + " est sur la médiatrice du segment " + M("[AB]") + ". Le triangle " + M("MAB") + " a un périmètre de " + M(N(p)) + " cm et " + M("AB = " + N(ab)) + " cm. Combien mesure " + M("MA") + " (en cm) ?", ma,
          M("MA = MB") + " : " + M("2 \\times MA + " + N(ab) + " = " + N(p)) + ", donc " + M("2 \\times MA = " + N(rnd(p - ab, 6))) + " et " + M("MA = " + N(ma)) + " cm.",
          { ctx: "perimetre-inverse", fig: medFig("M sur la médiatrice de [AB]", { M: 1 }), guide: [GD(M("MA + MB") + " (en cm) ?", p - ab, M(N(p) + " - " + N(ab) + " = " + N(rnd(p - ab, 6)))), GD(M("MA") + " (en cm) ?", ma, M(N(ma)) + " cm.")],
            traps: [TD(p - ab, "C'est MA + MB ; les deux longueurs sont égales."), TD((p - ab) / 3, "Le périmètre a deux côtés égaux (MA et MB) et le côté AB.")] }); },
      () => { const m = dec1(3, 7.5), n = dec1(2, 6); if (Math.abs(m - n) < 0.4) return null; const p = rnd(2 * (m + n), 6);
        return QD("Les points " + M("M") + " et " + M("N") + " sont sur la médiatrice du segment " + M("[AB]") + ", de part et d'autre de " + M("(AB)") + ". On sait que " + M("MA = " + N(m)) + " cm et " + M("NB = " + N(n)) + " cm. Quel est le périmètre du quadrilatère " + M("AMBN") + " (en cm) ?", p,
          M("MB = MA = " + N(m)) + " et " + M("NA = NB = " + N(n)) + " (équidistance). Périmètre : " + M(N(m) + " + " + N(m) + " + " + N(n) + " + " + N(n) + " = " + N(p)) + " cm. " + M("AMBN") + " est un cerf-volant.",
          { ctx: "cerf-volant", fig: sv(320, 200, pg([[60, 100], [160, 20], [260, 100], [160, 170]]) + ln(160, 8, 160, 190, "f-accent", AX) + tx(52, 104, "A", "end", 14) + tx(268, 104, "B", "start", 14) + tx(166, 20, "M", "start", 14) + tx(166, 184, "N", "start", 14), "quadrilatère AMBN"),
            guide: [GD(M("MB") + " (en cm) ?", m, M(N(m)) + " cm."), GD(M("NA") + " (en cm) ?", n, M(N(n)) + " cm."), GD("Périmètre (en cm) ?", p, M(N(p)) + " cm.")],
            traps: [TD(m + n, "Il y a quatre côtés : MA, MB, NB et NA."), TD(4 * m, "NA et NB ne mesurent pas MA : N est un autre point de la médiatrice.")] }); },
      () => { const a = dec1(0.5, 3.5), h = dec1(1.2, 3.4), m = rnd(a + h, 6), b = rnd(a + 2 * h, 6);
        return QD("Sur une droite graduée, " + M("A") + " a pour abscisse " + M(N(a)) + ". La médiatrice du segment " + M("[AB]") + " coupe la droite graduée au point d'abscisse " + M(N(m)) + ". Quelle est l'abscisse de " + M("B") + " ?", b,
          "La médiatrice passe par le milieu de " + M("[AB]") + " : " + M("B") + " est aussi loin du milieu que " + M("A") + ", de l'autre côté. " + M(N(m) + " - " + N(a) + " = " + N(h)) + ", donc " + M("B") + " a pour abscisse " + M(N(m) + " + " + N(h) + " = " + N(b)) + ".",
          { ctx: "graduee-inverse", fig: graduee(0, 10, [[m, "(d)"]], [[a, "A"]], "point A et médiatrice (d) sur une droite graduée"), guide: [GD("Distance de " + M("A") + " au milieu ?", h, M(N(h))), GD("Abscisse de " + M("B") + " ?", b, M(N(b)) + ".")],
            traps: [TD(m + a, "B est à la même distance du milieu que A : ajoute " + D(h) + " à " + D(m) + "."), TD(h, "C'est la demi-longueur de [AB].")] }); },
    ],
  };

  // ======================= echelle6 : échelles, plans et cartes (6e.PF.05) =======================
  const EC = {
    1: [
      () => { const e = pk([50, 200, 250, 500]), c = dec1(1.5, 9.5), r = rnd((c * e) / 100, 6); if (r !== Math.round(r * 100) / 100) return null; const o = pk([["un mur", "mur"], ["une pièce", "piece"], ["un couloir", "couloir"], ["une terrasse", "terrasse"]]);
        return QD("Sur un plan à l'échelle " + M("\\frac{1}{" + e + "}") + ", " + o[0] + " mesure " + cm(c) + ". Quelle est sa longueur réelle, en mètres ?", r,
          "Échelle " + M("\\frac{1}{" + e + "}") + " : 1 cm sur le plan représente " + M(e) + " cm en réalité. " + M(N(c) + " \\times " + e + " = " + N(rnd(c * e, 6))) + " cm, soit " + M(N(r)) + " m.",
          { ctx: "plan-" + o[1], guide: [GD("Longueur réelle en cm ?", c * e, M(N(rnd(c * e, 6))) + " cm."), GD("En mètres ?", r, M(N(r)) + " m (on divise par 100).")],
            traps: [TD(c * e, "C'est la longueur en cm ; 1 m = 100 cm."), TD((c * e) / 1000, "1 m = 100 cm : divise par 100, pas par 1 000.")] }); },
      () => { const k = pk([2, 3, 4, 5, 10]), c = dec1(2.5, 9.5), r = rnd(c * k, 6), o = pk([["deux villes", "villes", "l'une de l'autre"], ["deux villages", "villages", "l'un de l'autre"], ["deux refuges", "refuges", "l'un de l'autre"], ["deux phares", "phares", "l'un de l'autre"]]);
        return QD("Sur une carte, " + M("1") + " cm représente " + M(k) + " km. " + o[0][0].toUpperCase() + o[0].slice(1) + " sont à " + cm(c) + " " + o[2] + " sur la carte. Quelle est la distance réelle (en km) ?", r,
          "C'est une situation de proportionnalité : " + M(N(c) + " \\times " + k + " = " + N(r)) + " km.",
          { ctx: "carte-" + o[1], guide: [GD("Combien de km pour 1 cm ?", k, M(k) + " km."), GD("Distance réelle (en km) ?", r, M(N(c) + " \\times " + k + " = " + N(r)) + " km.")],
            traps: [TD(c / k, "Chaque centimètre représente " + k + " km : on multiplie."), TD(c + k, "On multiplie par " + k + ", on n'ajoute pas.")] }); },
      () => { const k = pk([20, 24, 25, 30, 40, 50]), c = R.int(12, 95), r = rnd((c * k) / 100, 6), o = pk([["d'un bateau", "bateau"], ["d'un avion", "avion"], ["d'une locomotive", "train"], ["d'un camion", "camion"]]);
        return QD("Une maquette " + o[0] + " est " + M(k) + " fois plus petite que l'objet réel. La maquette mesure " + cm(c) + " de long. Quelle est la longueur réelle, en mètres ?", r,
          "Longueur réelle : " + M(c + " \\times " + k + " = " + N(c * k)) + " cm, soit " + M(N(r)) + " m. L'échelle de la maquette est " + M("\\frac{1}{" + k + "}") + ".",
          { ctx: "maquette-" + o[1], guide: [GD("Longueur réelle en cm ?", c * k, M(N(c * k)) + " cm."), GD("En mètres ?", r, M(N(r)) + " m.")],
            traps: [TD(c * k, "C'est en cm : divise par 100 pour avoir des mètres."), TD(c / k, "L'objet réel est plus grand : on multiplie par " + k + ".")] }); },
    ],
    2: [
      () => { const e = pk([50, 100, 200, 250]), r = pk([1.2, 1.6, 2, 2.4, 3, 3.5, 4, 4.5, 5]), c = rnd((r * 100) / e, 6); if (c !== Math.round(c * 10) / 10 || c < 0.5) return null; const o = pk([["une table", "table"], ["un lit", "lit"], ["un canapé", "canape"], ["une armoire", "armoire"]]);
        return QD("On dessine le plan d'un appartement à l'échelle " + M("\\frac{1}{" + e + "}") + ". Quelle longueur (en cm) faut-il tracer sur le plan pour " + o[0] + " de " + M(N(r)) + " m ?", c,
          M(N(r) + " \\text{ m} = " + N(rnd(r * 100, 6)) + " \\text{ cm}") + " ; sur le plan, tout est divisé par " + M(e) + " : " + M(N(rnd(r * 100, 6)) + " \\div " + e + " = " + N(c)) + " cm.",
          { ctx: "reel-plan-" + o[1], guide: [GD("Longueur réelle en cm ?", r * 100, M(N(rnd(r * 100, 6))) + " cm."), GD("Sur le plan (en cm) ?", c, M(N(c)) + " cm.")],
            traps: [TD((r * 100) * e, "Sur le plan, c'est plus petit : on divise par " + e + "."), TD(r / e, "Convertis d'abord les mètres en centimètres.")] }); },
      () => { const e = pk([10000, 20000, 25000, 50000]), c = dec1(2, 12), km = rnd((c * e) / 100000, 6); if (km !== Math.round(km * 100) / 100) return null;
        return QD("Sur une carte de randonnée à l'échelle " + M("\\frac{1}{" + N(e) + "}") + ", un sentier mesure " + cm(c) + ". Quelle est sa longueur réelle, en km ?", km,
          M(N(c) + " \\times " + N(e) + " = " + N(rnd(c * e, 6))) + " cm. Or " + M("1\\text{ km} = 100\\,000\\text{ cm}") + " : " + M(N(km)) + " km.",
          { ctx: "carte-km", guide: [GD("Longueur réelle en cm ?", c * e, M(N(rnd(c * e, 6))) + " cm."), GD("En mètres ?", (c * e) / 100, M(N(rnd((c * e) / 100, 6))) + " m."), GD("En km ?", km, M(N(km)) + " km.")],
            traps: [TD((c * e) / 1000, "1 km = 100 000 cm (1 000 m de 100 cm)."), TD((c * e) / 100, "Ce sont des mètres ; 1 km = 1 000 m.")] }); },
      () => { const e = pk([50, 100, 200, 250, 500]), c = pk([2, 3, 4, 5, 6, 8]), r = rnd((c * e) / 100, 6), o = pk([["un mur", "mur"], ["une allée", "allee"], ["un bassin", "bassin"]]);
        return QN("Sur un plan, " + o[0] + " de " + M(N(r)) + " m est " + (o[0].startsWith("une") ? "représentée" : "représenté") /* 26.11 soir : « une allée … est représenté » */ + " par un segment de " + cm(c) + ". L'échelle du plan est " + M("\\frac{1}{n}") + ". Que vaut " + M("n") + " ?", e,
          M(N(r) + " \\text{ m} = " + N(rnd(r * 100, 6)) + " \\text{ cm}") + " ; " + M(N(rnd(r * 100, 6)) + " \\div " + c + " = " + e) + " : 1 cm sur le plan représente " + M(e) + " cm en réalité.",
          { ctx: "trouver-echelle-" + o[1], guide: [GD("Longueur réelle en cm ?", r * 100, M(N(rnd(r * 100, 6))) + " cm."), GR("Combien de cm réels pour 1 cm du plan ?", e, M(e) + ".")],
            traps: [TR(rnd(r / c, 9), "Mets les deux longueurs dans la même unité (cm) avant de diviser."), TR(rnd((c * 100) / r, 9), "On divise la longueur réelle par la longueur sur le plan.")] }); },
    ],
    3: [
      () => { const e = pk([50, 100, 200, 250]), Lp = dec1(2, 9), lp = dec1(1.5, 6); if (lp >= Lp) return null; const Lr = rnd((Lp * e) / 100, 6), lr = rnd((lp * e) / 100, 6); if (Lr !== Math.round(Lr * 100) / 100 || lr !== Math.round(lr * 100) / 100) return null;
        return QD("Sur un plan, une chambre mesure " + cm(Lp) + " sur " + cm(lp) + ". En réalité, sa longueur est de " + M(N(Lr)) + " m. Quelle est sa largeur réelle (en m) ?", lr,
          "Échelle : " + M(N(Lr) + " \\text{ m} = " + N(rnd(Lr * 100, 6)) + " \\text{ cm}") + " et " + M(N(rnd(Lr * 100, 6)) + " \\div " + N(Lp) + " = " + e) + " : " + M("\\frac{1}{" + e + "}") + ". Largeur : " + M(N(lp) + " \\times " + e + " = " + N(rnd(lp * e, 6))) + " cm, soit " + M(N(lr)) + " m.",
          { ctx: "deux-longueurs", guide: [GR("Échelle " + M("\\frac{1}{n}") + " : " + M("n") + " = ?", e, M(e) + "."), GD("Largeur réelle en cm ?", lp * e, M(N(rnd(lp * e, 6))) + " cm."), GD("En m ?", lr, M(N(lr)) + " m.")],
            traps: [TD(lp * e, "Ce sont des cm : divise par 100."), TD(Lr - (Lp - lp), "Les longueurs sont proportionnelles : on ne retire pas la même différence.")] }); },
      () => { const [e1, e2] = pk([[25000, 50000], [50000, 25000], [20000, 50000], [10000, 25000], [25000, 100000], [50000, 100000]]), c = pk([4, 6, 8, 10, 12, 3, 5]), v = rnd((c * e1) / e2, 6); if (v !== Math.round(v * 10) / 10) return null;
        return QD("Sur une carte au " + M("\\frac{1}{" + N(e1) + "}") + ", deux sommets sont à " + cm(c) + " l'un de l'autre. À quelle distance (en cm) sont-ils sur une carte au " + M("\\frac{1}{" + N(e2) + "}") + " ?", v,
          "Distance réelle : " + M(c + " \\times " + N(e1) + " = " + N(c * e1)) + " cm. Sur l'autre carte : " + M(N(c * e1) + " \\div " + N(e2) + " = " + N(v)) + " cm.",
          { ctx: "deux-cartes", guide: [GD("Distance réelle en cm ?", c * e1, M(N(c * e1)) + " cm."), GD("Sur la seconde carte (en cm) ?", v, M(N(v)) + " cm.")],
            traps: [TD((c * e2) / e1, "Plus n est grand, plus la carte est réduite : la distance y est " + (e2 > e1 ? "plus petite." : "plus grande.")), TD(c * e1, "C'est la distance réelle en cm.")] }); },
      () => { const e = pk([100, 200, 250, 500]), a = dec1(2, 8), b = dec1(1.5, 6); if (b >= a) return null; const p = rnd((2 * (a + b) * e) / 100, 6); if (p !== Math.round(p * 10) / 10) return null; const o = pk([["un jardin", "jardin"], ["un terrain de sport", "terrain"], ["une cour", "cour"]]);
        return QD("Sur un plan à l'échelle " + M("\\frac{1}{" + e + "}") + ", " + o[0] + " rectangulaire mesure " + cm(a) + " sur " + cm(b) + ". Quel est le périmètre réel, en mètres ?", p,
          "Dimensions réelles : " + M(N(rnd((a * e) / 100, 6))) + " m et " + M(N(rnd((b * e) / 100, 6))) + " m. Périmètre : " + M("2 \\times (" + N(rnd((a * e) / 100, 6)) + " + " + N(rnd((b * e) / 100, 6)) + ") = " + N(p)) + " m.",
          { ctx: "perimetre-" + o[1], guide: [GD("Longueur réelle (en m) ?", (a * e) / 100, M(N(rnd((a * e) / 100, 6))) + " m."), GD("Largeur réelle (en m) ?", (b * e) / 100, M(N(rnd((b * e) / 100, 6))) + " m."), GD("Périmètre (en m) ?", p, M(N(p)) + " m.")],
            traps: [TD(2 * (a + b), "C'est le périmètre sur le plan, en cm : il faut les longueurs réelles."), TD((a + b) * e / 100, "Le périmètre compte chaque côté deux fois.")] }); },
    ],
  };

  // ======================= proba6 : premiers pas en probabilités (6e.DP.05–07) =======================
  const wheel = (cols) => { const n = cols.length, c = [160, 95], r = 80; let g = "";
    cols.forEach((cl, k) => { const a0 = (2 * Math.PI * k) / n - Math.PI / 2, a1 = (2 * Math.PI * (k + 1)) / n - Math.PI / 2;
      g += '<path d="M' + c[0] + "," + c[1] + " L" + (c[0] + r * Math.cos(a0)).toFixed(1) + "," + (c[1] + r * Math.sin(a0)).toFixed(1) + " A" + r + "," + r + " 0 0 1 " + (c[0] + r * Math.cos(a1)).toFixed(1) + "," + (c[1] + r * Math.sin(a1)).toFixed(1) + ' Z" class="' + (cl ? "f-fill2" : "f-soft") + '" style="stroke:var(--ink)"/>'; });
    return sv(320, 190, g + '<path d="M160,6 L152,0 L168,0 Z" class="f-head"/>', "roue partagée en " + n + " secteurs égaux"); };
  const PR = {
    1: [
      () => { const E = pk([["un nombre pair", [2, 4, 6]], ["un nombre supérieur ou égal à 5", [5, 6]], ["un multiple de 3", [3, 6]], ["un nombre inférieur à 3", [1, 2]], ["un diviseur de 6", [1, 2, 3, 6]], ["un nombre premier", [2, 3, 5]], ["un nombre différent de 6", [1, 2, 3, 4, 5]]]), f = E[1].length;
        return QF("On lance un dé équilibré à six faces, numérotées de 1 à 6. Quelle est la probabilité d'obtenir " + E[0] + " ? (fraction acceptée)", f / 6,
          "Les 6 issues ont la même probabilité. Issues favorables : " + E[1].join(", ") + ", soit " + M(f) + ". " + M("P = \\frac{" + f + "}{6}" + (g2(f, 6) > 1 ? " = " + F(f / 6) : "")) + ".",
          { ctx: "de", guide: [GR("Combien d'issues possibles ?", 6, M(6) + "."), GR("Combien d'issues favorables ?", f, E[1].join(", ") + "."), GR("Probabilité ?", f / 6, M(F(f / 6)) + ".")],
            traps: [TR(f, "C'est le nombre d'issues favorables ; divise par le nombre d'issues possibles."), TR(f / 10, "Il y a 6 issues possibles, pas 10.")] }); },
      () => { const c = { rouges: R.int(2, 7), bleues: R.int(2, 7), vertes: R.int(1, 5) }, col = pk(["rouges", "bleues", "vertes"]), n = c.rouges + c.bleues + c.vertes, f = c[col];
        return QF("Un sac contient " + M(c.rouges) + " billes rouges, " + M(c.bleues) + " bleues et " + M(c.vertes) + (c.vertes > 1 ? " vertes" : " verte") + ", indiscernables au toucher. On tire une bille au hasard. Quelle est la probabilité qu'elle soit " + col.slice(0, -1) + " ? (fraction acceptée)", f / n,
          "Chaque bille a la même chance d'être tirée : " + M(n) + " issues, dont " + M(f) + " favorables. " + M("P = \\frac{" + f + "}{" + n + "}" + (g2(f, n) > 1 ? " = " + F(f / n) : "")) + ".",
          { ctx: "sac", fig: FIG.urn(c), guide: [GR("Nombre de billes en tout ?", n, M(n) + "."), GR("Probabilité ?", f / n, M(F(f / n)) + ".")],
            traps: [TR(f / (n - f), "On divise par le nombre total de billes, pas par le nombre des autres."), TR(1 / 3, "Il y a 3 couleurs, mais pas le même nombre de billes de chaque couleur.")] }); },
      () => { const n = pk([6, 8, 10, 12]), k = R.int(2, n - 2), cols = Array.from({ length: n }, (_, i) => i < k); for (let i = n - 1; i > 0; i--) { const j = Math.floor(R.rand() * (i + 1)); [cols[i], cols[j]] = [cols[j], cols[i]]; }
        return QF("La roue de loterie est partagée en " + M(n) + " secteurs de même taille ; on gagne si la flèche s'arrête sur un secteur colorié. Quelle est la probabilité de gagner ? (fraction acceptée)", k / n,
          "Secteurs de même taille : les " + M(n) + " issues sont équiprobables. " + M(k) + " secteurs coloriés : " + M("P = \\frac{" + k + "}{" + n + "}" + (g2(k, n) > 1 ? " = " + F(k / n) : "")) + ".",
          { ctx: "roue", fig: wheel(cols), guide: [GR("Combien de secteurs coloriés ?", k, M(k) + "."), GR("Probabilité de gagner ?", k / n, M(F(k / n)) + ".")],
            traps: [TR(k / (n - k), "On divise par le nombre total de secteurs (" + n + ")."), TR((n - k) / n, "C'est la probabilité de perdre.")] }); },
    ],
    2: [
      () => { const [w, l] = pk([["MATHEMATIQUES", "A"], ["PROBABILITE", "B"], ["ANANAS", "A"], ["PARALLELE", "L"], ["ARITHMETIQUE", "I"], ["SYMETRIQUE", "E"]]), cnt = [...w].filter((c) => c === l).length, voy = pk([0, 1]);
        const v = voy ? [...w].filter((c) => "AEIOUY".includes(c)).length : cnt;
        return QF("On écrit chaque lettre du mot " + w + " sur un carton (" + M(w.length) + " cartons), et on tire un carton au hasard. Quelle est la probabilité d'obtenir " + (voy ? "une voyelle (A, E, I, O, U, Y)" : "la lettre " + l) + " ? (fraction acceptée)", v / w.length,
          M(w.length) + " cartons, tous avec la même chance d'être tirés. " + (voy ? "Voyelles" : "Lettres " + l) + " : " + M(v) + ". " + M("P = \\frac{" + v + "}{" + w.length + "}" + (g2(v, w.length) > 1 ? " = " + F(v / w.length) : "")) + ".",
          { ctx: "lettres-" + (voy ? "voyelle" : "lettre"), guide: [GR("Nombre de cartons ?", w.length, M(w.length) + "."), GR("Cartons favorables ?", v, M(v) + "."), GR("Probabilité ?", v / w.length, M(F(v / w.length)) + ".")],
            traps: [TR(1 / w.length, "Il y a plusieurs cartons favorables : compte-les tous."), TR(voy ? 6 / 26 : 1 / 26, "On tire parmi les lettres du mot, pas dans l'alphabet.")] }); },
      () => { const n = pk([100, 200, 250, 400, 500]), k = R.int(Math.round(n / 8), Math.round(n / 4)), f = rnd(k / n, 6), o = pk([["un dé", "le 6", "de", "du 6"], ["une roue de loterie", "le secteur rouge", "roue", "du secteur rouge"], ["une punaise", "« pointe en l'air »", "punaise", "de « pointe en l'air »"]]);
        if (f !== Math.round(f * 1000) / 1000) return null;
        return QD("On a lancé " + o[0] + " " + M(n) + " fois et noté les résultats : " + o[1] + " est sorti " + M(k) + " fois. Quelle est la fréquence d'apparition " + o[3] + " (en écriture décimale) ?", f,
          "Fréquence " + M("= \\frac{" + k + "}{" + n + "} = " + N(f)) + ". Quand on répète l'expérience un grand nombre de fois, la fréquence se rapproche de la probabilité" + (o[2] === "de" ? " (ici " + M("\\frac{1}{6} \\approx 0{,}17") + ")" : "") + ".",
          { ctx: "frequence-" + o[2], guide: [GR("Effectif de " + o[1] + " ?", k, M(k) + "."), GD("Fréquence " + M("\\frac{" + k + "}{" + n + "}") + " en décimal ?", f, M(N(f)) + ".")],
            traps: [TD(n / k, "Fréquence = effectif ÷ nombre total de lancers."), TD(k, "C'est l'effectif ; divise par " + n + ".")] }); },
      () => { const n = pk([20, 25, 40, 50]), p = pk([0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.6]), k = rnd(n * p, 6); if (!Number.isInteger(k) || k < 2) return null; const o = pk([["boules", "rouges", "une urne", "une", "une boule rouge"], ["jetons", "gagnants", "une boîte", "un", "un jeton gagnant"], ["cartes", "gagnantes", "une pochette", "une", "une carte gagnante"] /* 26.11 soir : un paquet de cartes à jouer est rouge pour moitié (P = 0,3 invraisemblable) */]);
        return QN(o[2][0].toUpperCase() + o[2].slice(1) + " contient " + M(n) + " " + o[0] + ". On en tire " + o[3] + " au hasard ; la probabilité d'obtenir " + o[4] + " vaut " + M(N(p)) + ". Combien y a-t-il de " + o[0] + " " + o[1] + " ?", k,
          M("P = \\frac{\\text{nombre de " + o[0] + " " + o[1] + "}}{" + n + "} = " + N(p)) + ", donc il y en a " + M(N(p) + " \\times " + n + " = " + k) + ".",
          { ctx: "retrouver-effectif", guide: [GD("Calcule " + M(N(p) + " \\times " + n) + ".", k, M(k) + ".")],
            traps: [TD(n / p, "On multiplie le nombre total par la probabilité."), TD(p * 100, "La probabilité n'est pas un nombre d'objets : multiplie-la par " + n + ".")] }); },
    ],
    3: [
      () => { const r = R.int(2, 6), b = r + R.int(2, 6), t = pk([[1, 2], [1, 3], [2, 3]]); let add = null;
        for (let k = 1; k <= 30; k++) if ((r + k) * t[1] === (r + b + k) * t[0]) { add = k; break; }
        if (!add) return null;
        return QN("Une urne contient " + M(r) + " boules rouges et " + M(b) + " boules bleues. Combien de boules rouges faut-il ajouter pour que la probabilité de tirer une rouge soit égale à " + M("\\frac{" + t[0] + "}{" + t[1] + "}") + " ?", add,
          "Avec " + M(add) + " rouges de plus : " + M(r + add) + " rouges sur " + M(r + b + add) + " boules, et " + M("\\frac{" + (r + add) + "}{" + (r + b + add) + "} = \\frac{" + t[0] + "}{" + t[1] + "}") + ".",
          { ctx: "ajouter-" + t.join("-"), fig: FIG.urn({ rouges: r, bleues: b }), guide: [GR("Probabilité de tirer une rouge maintenant ?", r / (r + b), M(F(r / (r + b))) + "."), GR("Nombre de rouges à ajouter ?", add, "On essaie : " + M(r + add) + " rouges sur " + M(r + b + add) + " boules.")],
            traps: [TR(b, "Teste ta réponse : avec ce nombre de rouges en plus, calcule la nouvelle probabilité."), TR(add + 1, "Vérifie : la probabilité dépasse alors " + t[0] + "/" + t[1] + ".")] }); },
      () => { const n = pk([120, 300, 360, 600, 900]), E = pk([["un 6", 1], ["un nombre pair", 3], ["un nombre supérieur ou égal à 5", 2], ["un multiple de 3", 2]]), v = (n * E[1]) / 6;
        return QN("On lance " + M(n) + " fois un dé équilibré à six faces. Environ combien de fois peut-on s'attendre à obtenir " + E[0] + " ?", v,
          M("P = \\frac{" + E[1] + "}{6}") + ". Sur un grand nombre de lancers, la fréquence est proche de la probabilité : environ " + M("\\frac{" + E[1] + "}{6} \\times " + n + " = " + v) + " fois.",
          { ctx: "attendu", guide: [GR("Probabilité d'obtenir " + E[0] + " ?", E[1] / 6, M(F(E[1] / 6)) + "."), GR("Nombre de fois attendu ?", v, M(v) + ".")],
            traps: [TR(n / 6, E[1] > 1 ? "Il y a " + E[1] + " issues favorables sur 6." : "Calcule la probabilité, puis multiplie par " + n + "."), TR(n - v, "C'est le nombre de fois où l'on n'obtient pas " + E[0] + ".")] }); },
      () => { let a, b, c, d; do { b = R.int(5, 12); d = R.int(5, 12); a = R.int(2, b - 2); c = R.int(2, d - 2); } while (b === d || a * d === b * c || Math.abs(a / b - c / d) > 0.15 || g2(a, b) > 1 || g2(c, d) > 1);
        const best = Math.max(a / b, c / d);
        return QF("Sac A : " + M(a) + " billes gagnantes sur " + M(b) + ". Sac B : " + M(c) + " billes gagnantes sur " + M(d) + ". On tire une bille au hasard dans le sac de son choix. Quelle est la plus grande des deux probabilités de gagner ? (fraction)", best,
          M("P_A = \\frac{" + a + "}{" + b + "}") + " et " + M("P_B = \\frac{" + c + "}{" + d + "}") + ". Même dénominateur " + M(b * d) + " : " + M("\\frac{" + a * d + "}{" + b * d + "}") + " et " + M("\\frac{" + c * b + "}{" + b * d + "}") + ". Le sac " + (a / b > c / d ? "A" : "B") + " est le meilleur : " + M(F(best)) + ".",
          { ctx: "comparer-sacs", guide: [GR(M("P_A") + " ?", a / b, M(F(a / b)) + "."), GR(M("P_B") + " ?", c / d, M(F(c / d)) + "."), GR("La plus grande ?", best, M(F(best)) + ".")],
            traps: [TR(a / b > c / d ? c / d : a / b, "Compare les fractions en les mettant au même dénominateur."), TR(a > c ? c / d : a / b, "Le sac qui a le plus de billes gagnantes n'est pas forcément le meilleur : il faut comparer aux nombres totaux.")] }); },
    ],
  };

  // ======================= empil : empilements de cubes, vues (5e.EG.05–06) =======================
  /* h[i][j] : hauteur de la colonne i (gauche → droite), j (avant → arrière) ; perspective cavalière (fuyante 45°, 0,5) */
  const cubesFig = (h, lab) => {
    const nx = h.length, ny = h[0].length, s = 30, k = 0.42 * s, P = (x, y, z) => [x * s + y * k, -z * s - y * k];
    let mnx = Infinity, mxx = -Infinity, mny = Infinity, mxy = -Infinity; const H = Math.max(1, ...h.flat());
    for (const x of [0, nx]) for (const y of [0, ny]) for (const z of [0, H]) { const [u, v] = P(x, y, z); mnx = Math.min(mnx, u); mxx = Math.max(mxx, u); mny = Math.min(mny, v); mxy = Math.max(mxy, v); }
    const ox = (320 - (mxx - mnx)) / 2 - mnx, oy = 10 - mny, Q = (x, y, z) => { const [u, v] = P(x, y, z); return [ox + u, oy + v]; };
    let g = "";
    for (let y = ny - 1; y >= 0; y--) for (let x = 0; x < nx; x++) for (let z = 0; z < h[x][y]; z++) {
      g += pg([Q(x, y, z), Q(x + 1, y, z), Q(x + 1, y, z + 1), Q(x, y, z + 1)], "f-shape", ' stroke-width="1.3"');
      g += pg([Q(x, y, z + 1), Q(x + 1, y, z + 1), Q(x + 1, y + 1, z + 1), Q(x, y + 1, z + 1)], "f-shape2", ' stroke-width="1.3"');
      g += pg([Q(x + 1, y, z), Q(x + 1, y + 1, z), Q(x + 1, y + 1, z + 1), Q(x + 1, y, z + 1)], "f-shape", ' style="fill:var(--blue);fill-opacity:.5" stroke-width="1.3"');
    }
    return sv(320, Math.round(mxy - mny + 20), g, lab || "empilement de cubes");
  };
  /* vues : grille de carrés (cases occupées), éventuellement avec des nombres */
  const vueFig = (views) => { const s = 22; let g = "", x0 = 8; const Hm = Math.max(...views.map((v) => v.rows));
    for (const v of views) { for (const [i, j, t] of v.cells) { g += '<rect x="' + (x0 + i * s) + '" y="' + (20 + (Hm - 1 - j) * s) + '" width="' + s + '" height="' + s + '" class="f-shape2"/>'; if (t !== undefined) g += tx(x0 + i * s + s / 2, 20 + (Hm - 1 - j) * s + 16, t, "middle", 13); }
      g += tx(x0 + (v.cols * s) / 2, 14, v.nom, "middle", 12); x0 += v.cols * s + 26; }
    return sv(Math.max(200, x0), 28 + Hm * s, g, "vues de l'empilement"); };
  const heights = (nx, ny, hmax, holes) => { const h = Array.from({ length: nx }, () => Array(ny).fill(0));
    for (let x = 0; x < nx; x++) { let prev = 0; for (let y = 0; y < ny; y++) { const z = holes && y === 0 && R.rand() < 0.25 ? 0 : R.int(Math.max(1, prev), hmax); h[x][y] = z; prev = Math.max(prev, z); } }
    return h; }; /* plus haut (ou égal) vers l'arrière : rien n'est caché */
  const sumH = (h) => h.flat().reduce((a, b) => a + b, 0), faceV = (h) => h.map((c) => Math.max(...c)), sideV = (h) => h[0].map((_, y) => Math.max(...h.map((c) => c[y])));
  const top = (h) => h.flat().filter((z) => z > 0).length;
  const NOTE = " (aucun cube n'est caché : il n'y a pas de trou, chaque cube repose sur la table ou sur un autre cube)";
  const EM = {
    1: [
      () => { const h = heights(pk([2, 3]), 2, 3), n = sumH(h); if (n < 6) return null;
        return QN("Combien de cubes compte cet empilement" + NOTE + " ?", n, "On compte colonne par colonne (hauteur de chaque pile) : " + M(h.flat().filter((z) => z).join(" + ") + " = " + n) + ".",
          { ctx: "compter", fig: cubesFig(h), guide: [GR("Combien de cubes dans les piles de devant ?", h.reduce((a, c) => a + c[0], 0), "Hauteurs : " + h.map((c) => c[0]).join(", ") + "."), GR("Nombre total de cubes ?", n, M(n) + ".")],
            traps: [TR(top(h), "Ce sont les piles vues de dessus ; une pile peut avoir plusieurs cubes."), TR(n - h.reduce((a, c) => a + c[0], 0), "N'oublie pas les piles de devant.")] }); },
      () => { const nx = pk([3, 4]), ny = pk([2, 3]), c = []; let n = 0; for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) { const z = R.int(0, 4); if (z) { c.push([i, j, z]); n += z; } } if (c.length < 4 || n < 8) return null;
        return QN("Voici la vue de dessus d'un empilement de cubes : dans chaque case, on a écrit le nombre de cubes empilés. Combien de cubes compte l'empilement ?", n, "On additionne les nombres de la vue de dessus : " + M(c.map((t) => t[2]).join(" + ") + " = " + n) + ".",
          { ctx: "dessus-nombres", fig: vueFig([{ nom: "vue de dessus", cols: nx, rows: ny, cells: c }]), guide: [GR("Combien de piles (cases occupées) ?", c.length, M(c.length) + "."), GR("Nombre de cubes ?", n, M(n) + ".")],
            traps: [TR(c.length, "C'est le nombre de piles ; chaque nombre dit combien de cubes il y a dans la pile.")] }); },
      () => { const h = heights(3, pk([2, 3]), 3, true), t = top(h); if (t < 4) return null;
        return QN("Combien de carrés voit-on sur la vue de dessus de cet empilement" + NOTE + " ?", t, "Vu de dessus, chaque pile donne un seul carré, quelle que soit sa hauteur : " + M(t) + " piles, donc " + M(t) + " carrés.",
          { ctx: "vue-dessus", fig: cubesFig(h), guide: [GR("Combien de piles dans la rangée de devant ?", h.filter((c) => c[0] > 0).length, "Compte les piles de devant."), GR("Carrés de la vue de dessus ?", t, M(t) + ".")],
            traps: [TR(sumH(h), "Vu de dessus, on ne voit que le haut de chaque pile : un carré par pile."), TR(t - h.filter((c) => c[0] > 0).length, "Compte aussi les piles de devant.")] }); },
      () => { const h = heights(3, 2, 3), f = faceV(h), v = f.reduce((a, b) => a + b, 0); if (v === sumH(h)) return null;
        return QN("Combien de carrés voit-on sur la vue de face de cet empilement" + NOTE + " ? (on regarde de devant, sans perspective)", v,
          "De face, on voit dans chaque colonne la pile la plus haute : " + M(f.join(" + ") + " = " + v) + " carrés.",
          { ctx: "vue-face", fig: cubesFig(h), guide: [GR("Hauteur de la pile la plus haute de la colonne de gauche ?", f[0], M(f[0]) + "."), GR("Carrés de la vue de face ?", v, M(v) + ".")],
            traps: [TR(sumH(h), "Les cubes de derrière sont cachés par ceux de devant (ou dépassent au-dessus) : un carré par niveau visible."), TR(h.reduce((a, c) => a + c[0], 0), "Les piles de derrière, plus hautes, dépassent au-dessus de celles de devant.")] }); },
    ],
    2: [
      () => { const h = heights(3, 2, 3), n = sumH(h), H = Math.max(...h.flat()), v = 6 * H - n; if (v < 3) return null;
        return QN("Combien de cubes faut-il ajouter, au minimum, pour compléter cet empilement en un pavé droit de " + M(3) + " cubes de long, " + M(2) + " de profondeur et " + M(H) + " de haut" + NOTE + " ?", v,
          "Le pavé contient " + M("3 \\times 2 \\times " + H + " = " + 6 * H) + " cubes ; l'empilement en a " + M(n) + " : il en manque " + M(6 * H - n) + ".",
          { ctx: "completer-pave", fig: cubesFig(h), guide: [GR("Cubes du pavé ?", 6 * H, M(6 * H) + "."), GR("Cubes de l'empilement ?", n, M(n) + "."), GR("Cubes à ajouter ?", v, M(v) + ".")],
            traps: [TR(6 * H, "C'est le nombre de cubes du pavé ; retire ceux qui sont déjà là."), TR(n, "C'est l'empilement ; on demande ce qui manque.")] }); },
      () => { const h = heights(pk([2, 3]), 3, 3), s = sideV(h), v = s.reduce((a, b) => a + b, 0); if (v === sumH(h)) return null;
        return QN("Combien de carrés voit-on sur la vue de droite de cet empilement" + NOTE + " ? (on regarde depuis la droite, sans perspective)", v,
          "Depuis la droite, chaque rangée (de l'avant vers l'arrière) montre sa pile la plus haute : " + M(s.join(" + ") + " = " + v) + " carrés.",
          { ctx: "vue-droite", fig: cubesFig(h), guide: [GR("Hauteur maximale dans la rangée de devant ?", s[0], M(s[0]) + "."), GR("Carrés de la vue de droite ?", v, M(v) + ".")],
            traps: [TR(sumH(h), "Les piles alignées se cachent : un carré par niveau visible dans chaque rangée."), TR(faceV(h).reduce((a, b) => a + b, 0), "Ça, c'est la vue de face.")] }); },
      () => { const h = heights(3, 3, 4), n = sumH(h); if (n < 12) return null;
        return QN("Combien de cubes compte cet empilement" + NOTE + " ?", n, "Colonne par colonne : " + M(h.flat().filter((z) => z).join(" + ") + " = " + n) + ".",
          { ctx: "compter-grand", fig: cubesFig(h), guide: [GR("Cubes de la rangée de devant ?", h.reduce((a, c) => a + c[0], 0), "Hauteurs " + h.map((c) => c[0]).join(", ") + "."), GR("Cubes de la rangée du milieu ?", h.reduce((a, c) => a + c[1], 0), "Hauteurs " + h.map((c) => c[1]).join(", ") + "."), GR("Nombre total ?", n, M(n) + ".")],
            traps: [TR(top(h) + Math.max(...h.flat()) - 1, "Compte les cubes de chaque pile, y compris ceux du bas, cachés derrière."), TR(sumH(h.map((c) => c.slice(1))), "N'oublie pas la rangée de devant.")] }); },
    ],
    3: [
      () => { let h, n, mx; for (let t = 0; t < 30; t++) { h = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => R.int(0, 3))); n = sumH(h); const f = faceV(h), s = sideV(h); mx = h.reduce((a, c, x) => a + c.reduce((b, z, y) => b + (z ? Math.min(f[x], s[y]) : 0), 0), 0); if (mx > n && top(h) >= 5 && f.every((z) => z) && s.every((z) => z)) break; mx = null; }
        if (!mx) return null; const f = faceV(h), s = sideV(h), cells = []; h.forEach((c, x) => c.forEach((z, y) => { if (z) cells.push([x, y]); }));
        return QN("Un empilement de cubes (sans trou) a les trois vues ci-dessous. Quel est le plus grand nombre de cubes qu'il peut contenir ?", mx,
          "Sur chaque case de la vue de dessus, la pile ne peut pas dépasser la hauteur de sa colonne (vue de face) ni celle de sa rangée (vue de droite) : on prend la plus petite des deux et on additionne : " + M(mx) + " cubes.",
          { ctx: "trois-vues", fig: vueFig([{ nom: "dessus", cols: 3, rows: 3, cells }, { nom: "face", cols: 3, rows: Math.max(...f), cells: f.flatMap((z, x) => Array.from({ length: z }, (_, k) => [x, k])) }, { nom: "droite", cols: 3, rows: Math.max(...s), cells: s.flatMap((z, y) => Array.from({ length: z }, (_, k) => [y, k])) }].map((v) => Object.assign(v, { rows: 3 }))),
            guide: [GR("Combien de piles (vue de dessus) ?", cells.length, M(cells.length) + "."), GR("Nombre maximal de cubes ?", mx, M(mx) + ".")],
            traps: [TR(cells.length, "C'est le nombre de piles ; certaines peuvent être hautes."), TR(9 * 3, "Les piles sont limitées par la vue de face ET par la vue de droite, et seulement sur les cases de la vue de dessus.")] }); },
      () => { const w = pk([1, 2, 3]), n0 = pk([3, 4]), n = R.int(6, 10), v = (w * n * (n + 1)) / 2, hh = Array.from({ length: n0 }, (_, i) => Array(w).fill(n0 - i)).reverse();
        return QN("On construit un escalier en cubes, de " + M(w) + " cube" + (w > 1 ? "s" : "") + " de large : la 1re marche a 1 cube de haut, la 2e en a 2, et ainsi de suite (la figure montre un escalier de " + M(n0) + " marches). Combien de cubes faut-il pour un escalier de " + M(n) + " marches ?", v,
          "La marche numéro " + M("k") + " compte " + M(w + " \\times k") + " cube" + (w > 1 ? "s" : "") + " : " + M((w > 1 ? w + " \\times " : "") + "(1 + 2 + \\dots + " + n + ") = " + (w > 1 ? w + " \\times " : "") + (n * (n + 1)) / 2 + (w > 1 ? " = " + v : "")) + ".",
          { ctx: "escalier", fig: cubesFig(hh.map((c) => c.slice()), "escalier de cubes"), guide: [GR("Somme " + M("1 + 2 + \\dots + " + n) + " ?", (n * (n + 1)) / 2, M((n * (n + 1)) / 2) + "."), GR("Nombre de cubes ?", v, M(v) + ".")],
            traps: [TR(w * n * n, "Toutes les marches n'ont pas " + n + " cubes de haut : la 1re en a 1, la 2e 2…"), TR(w * n, "Chaque marche a plusieurs cubes : additionne les hauteurs.")] }); },
      () => { const h = heights(3, 3, 3), n = sumH(h), v = 27 - n; if (v < 4 || n < 8) return null;
        return QN("Combien de cubes faut-il ajouter, au minimum, pour transformer cet empilement en un grand cube de " + M(3) + " cubes d'arête" + NOTE + " ?", v,
          "Le grand cube contient " + M("3 \\times 3 \\times 3 = 27") + " petits cubes. L'empilement en a " + M(h.flat().filter((z) => z).join(" + ") + " = " + n) + " : il en manque " + M(v) + ".",
          { ctx: "completer-cube", fig: cubesFig(h), guide: [GR("Petits cubes du grand cube ?", 27, M("3^3 = 27") + "."), GR("Cubes de l'empilement ?", n, M(n) + "."), GR("Cubes à ajouter ?", v, M(v) + ".")],
            traps: [TR(9 - top(h) > 1 ? 9 - top(h) : v + 9, "Il faut compléter chaque pile jusqu'à 3 cubes de haut, pas seulement les cases vides."), TR(n, "C'est l'empilement ; on demande ce qui manque pour arriver à 27.")] }); },
    ],
  };

  // ======================= compdiff : comparer par différence ou quotient (2nde.AU.01, NC.10) =======================
  const CD = {
    1: [
      () => { let a, b, c, d, k; for (let t = 0; t < 60; t++) { b = R.int(5, 12); d = R.int(b + 1, 16); a = R.int(2, b - 1); c = Math.round((a * d) / b); k = a * d - c * b; if (k && Math.abs(k) <= 3 && g2(a, b) === 1 && g2(c, d) === 1 && c > 1) break; k = 0; } if (!k) return null;
        const v = k / (b * d);
        return QF("Pour comparer " + M("A = \\frac{" + a + "}{" + b + "}") + " et " + M("B = \\frac{" + c + "}{" + d + "}") + ", on calcule " + M("A - B") + ". Donne " + M("A - B") + " sous forme de fraction.", v,
          M("A - B = \\frac{" + a * d + "}{" + b * d + "} - \\frac{" + c * b + "}{" + b * d + "} = " + F(v)) + ". " + (v > 0 ? M("A - B > 0") + ", donc " + M("A > B") : M("A - B < 0") + ", donc " + M("A < B")) + ".",
          { ctx: "diff-fractions", guide: [GR("Dénominateur commun (produit des dénominateurs) ?", b * d, M(b + " \\times " + d + " = " + b * d) + "."), GR("Numérateur de " + M("A - B") + " ?", k, M(a * d + " - " + c * b + " = " + k) + "."), GR(M("A - B") + " ?", v, M(F(v)) + ".")],
            traps: [TR((a - c) / (b - d), "On ne soustrait pas numérateurs et dénominateurs : mets au même dénominateur."), TR(-v, "C'est B − A : attention à l'ordre.")] }); },
      () => { const [p, q, u, e1, e2] = pk([[2, 4, 2, 5, 9], [2, 4, 2, 6, 10], [2, 8, 3, 3, 7], [3, 9, 2, 4, 6], [3, 9, 2, 3, 7], [5, 25, 2, 3, 5], [2, 8, 3, 4, 10], [3, 27, 3, 2, 8]]), ex = u * e1 - e2, v = p ** ex; if (!ex) return null;
        return QF("Pour comparer les nombres positifs " + M("A = " + q + "^{" + e1 + "}") + " et " + M("B = " + p + "^{" + e2 + "}") + ", on calcule " + M("\\frac{A}{B}") + ". Que vaut ce quotient ? (fraction ou entier)", v,
          M(q + " = " + p + "^{" + u + "}") + ", donc " + M("A = " + p + "^{" + u * e1 + "}") + " et " + M("\\frac{A}{B} = " + p + "^{" + u * e1 + " - " + e2 + "} = " + p + "^{" + ex + "} = " + F(v)) + ". " + (v > 1 ? "Quotient > 1 : " + M("A > B") : "Quotient < 1 : " + M("A < B")) + ".",
          { ctx: "quotient-puissances", guide: [GR(M(q) + " s'écrit " + M(p + "^k") + " : " + M("k") + " = ?", u, M(q + " = " + p + "^{" + u + "}") + "."), GR("Exposant de " + M(p) + " dans " + M("\\frac{A}{B}") + " ?", ex, M(u * e1 + " - " + e2 + " = " + ex) + "."), GR(M("\\frac{A}{B}") + " ?", v, M(F(v)) + ".")],
            traps: [TR(p ** (e1 - e2), "Écris d'abord " + q + " comme une puissance de " + p + "."), TR(1 / v, "C'est B ÷ A.")] }); },
      () => { const a = nz(-6, 7), c = R.int(-20, 30), k = a * a - c; if (Math.abs(k) < 2 || Math.abs(a) < 2 || !c) return null;
        return QN("Pour tout réel " + M("x") + ", on compare " + M("A = (x" + sg(a) + ")^2") + " et " + M("B = x^2" + sg(2 * a) + "x" + sg(c)) + " en calculant " + M("A - B") + ". Que vaut " + M("A - B") + " ?", k,
          M("A = x^2" + sg(2 * a) + "x" + sg(a * a)) + ", donc " + M("A - B = " + a * a + " - " + NP(c) + " = " + k) + " : " + (k > 0 ? M("A > B") : M("A < B")) + " pour tout " + M("x") + ".",
          { ctx: "diff-identite", guide: [GR("Terme constant de " + M("A") + " développé ?", a * a, M(NP(a) + "^2 = " + a * a) + "."), GR(M("A - B") + " ?", k, M(k) + ".")],
            traps: [TR(a - c, "Développe (x " + (a > 0 ? "+ " : "− ") + Math.abs(a) + ")² : le terme constant est " + a * a + "."), TR(-k, "C'est B − A.")] }); },
    ],
    2: [
      () => { const r = pk([1.2, 1.25, 1.5, 0.8, 0.75, 1.15, 0.85, 1.4, 0.6]), o = pk([["Une ville A compte", "habitants, une ville B en compte", "habitants", 2000, "villes"], ["Une entreprise A a vendu", "téléphones, une entreprise B en a vendu", "téléphones", 500, "ventes"], ["Un site A a reçu", "visites, un site B en a reçu", "visites", 1000, "visites"]]), B = o[3] * R.int(12, 60), A = rnd(B * r, 6); if (!Number.isInteger(A)) return null;
        return QD(o[0] + " " + M(N(A)) + " " + o[1] + " " + M(N(B)) + ". Pour comparer, on calcule le quotient " + M("\\frac{A}{B}") + " (écriture décimale).", r,
          M("\\frac{" + N(A) + "}{" + N(B) + "} = " + N(r)) + " : " + (r > 1 ? "A a " + M(N(rnd((r - 1) * 100, 6)) + "\\,\\%") + " de plus que B" : "A a " + M(N(rnd((1 - r) * 100, 6)) + "\\,\\%") + " de moins que B") + ".",
          { ctx: "quotient-" + o[4], guide: [GD(M("\\frac{A}{B}") + " ?", r, M(N(r)) + ".")],
            traps: [TD(1 / r, "C'est B ÷ A : on demande A ÷ B."), TD(A - B, "C'est la différence ; on demande le quotient.")] }); },
      () => { const a = R.int(3, 8);
        return QN("Pour tout réel " + M("x") + ", on compare " + M("A = x^2 + " + a * a) + " et " + M("B = " + 2 * a + "x") + ". On obtient " + M("A - B = (x - k)^2") + ". Que vaut " + M("k") + " ? (" + M("A - B") + " est un carré : " + M("A \\geqslant B") + ", avec égalité pour " + M("x = k") + ".)", a,
          M("A - B = x^2 - " + 2 * a + "x + " + a * a + " = (x - " + a + ")^2 \\geqslant 0") + " : " + M("k = " + a) + ". " + M("A \\geqslant B") + " pour tout " + M("x") + ", et " + M("A = B") + " seulement pour " + M("x = " + a) + ".",
          { ctx: "diff-carre", guide: [GX("Écris " + M("A - B") + " (développé).", "x^2-" + 2 * a + "*x+" + a * a, M("x^2 - " + 2 * a + "x + " + a * a) + "."), GR(M("k") + " ?", a, M("(x - " + a + ")^2 = x^2 - " + 2 * a + "x + " + a * a) + ".")],
            traps: [TR(a * a, "Dans (x − k)², le terme constant est k² = " + a * a + " : k = " + a + "."), TR(2 * a, "Le double produit vaut 2k = " + 2 * a + " : k = " + a + ".")] }); },
      () => { const [a, b] = pk([[2, 8], [3, 12], [2, 18], [5, 20], [3, 27], [8, 18], [6, 24]]), v = 2 * Math.sqrt(a * b);
        return QN("On compare les nombres positifs " + M("A = \\sqrt{" + a + "} + \\sqrt{" + b + "}") + " et " + M("B = \\sqrt{" + (a + b) + "}") + " par leurs carrés. Que vaut " + M("A^2 - B^2") + " ?", v,
          M("A^2 = " + a + " + 2\\sqrt{" + a * b + "} + " + b + " = " + (a + b) + " + " + v) + " et " + M("B^2 = " + (a + b)) + " : " + M("A^2 - B^2 = " + v + " > 0") + ". " + M("A") + " et " + M("B") + " sont positifs, donc " + M("A > B") + ".",
          { ctx: "racines-carres", guide: [GR(M("\\sqrt{" + a + "} \\times \\sqrt{" + b + "}") + " ?", Math.sqrt(a * b), M("\\sqrt{" + a * b + "} = " + Math.sqrt(a * b)) + "."), GR(M("A^2 - B^2") + " ?", v, M("2 \\times " + Math.sqrt(a * b) + " = " + v) + ".")],
            traps: [TR(Math.sqrt(a * b), "(√a + √b)² = a + 2√a√b + b : il y a un double produit."), TR(a + b, "On n'a pas (√a + √b)² = a + b.")] }); },
    ],
    3: [
      () => { const [t1, t2] = pk([[30, 20], [20, 30], [25, 25], [50, 40], [40, 25], [10, 20], [60, 50], [15, 10]]), q = rnd((1 + t1 / 100) * (1 - t2 / 100), 6); if (q === 1) return null; const o = pk(["Un prix", "Le loyer d'un local", "Le nombre d'abonnés d'un club"]);
        return QD(o + " augmente de " + M(t1 + "\\,\\%") + ", puis baisse de " + M(t2 + "\\,\\%") + ". On compare la valeur finale " + M("V_f") + " à la valeur de départ " + M("V_0") + " par le quotient " + M("\\frac{V_f}{V_0}") + ". Que vaut-il ?", q,
          M("\\frac{V_f}{V_0} = " + N(1 + t1 / 100) + " \\times " + N(1 - t2 / 100) + " = " + N(q)) + (q > 1 ? " > 1 : la valeur a augmenté de " : " < 1 : la valeur a baissé de ") + M(N(rnd(Math.abs(q - 1) * 100, 6)) + "\\,\\%") + ".",
          { ctx: "evolutions", guide: [GD("Coefficient de la hausse ?", 1 + t1 / 100, M(N(1 + t1 / 100))), GD("Coefficient de la baisse ?", 1 - t2 / 100, M(N(1 - t2 / 100))), GD(M("\\frac{V_f}{V_0}") + " ?", q, M(N(q)) + ".")],
            traps: [TD(1 + (t1 - t2) / 100, "Les pourcentages ne s'ajoutent pas : on multiplie les coefficients."), TD(q * 100, "Le quotient est un nombre sans unité, proche de 1.")] }); },
      () => { const [p, r] = pk([[1, 2], [2, 1], [1, 3], [3, 1], [2, 2], [2, 3], [3, 2], [3, 3]]), q = p + r, k = p * r;
        return QN("Pour tout entier " + M("n \\geqslant 1") + ", on compare " + M("A = \\frac{n + " + p + "}{n}") + " et " + M("B = \\frac{n + " + q + "}{n + " + r + "}") + ". On obtient " + M("A - B = \\frac{k}{n(n + " + r + ")}") + ". Que vaut " + M("k") + " ?", k,
          "Même dénominateur " + M("n(n + " + r + ")") + " : numérateur " + M("(n + " + p + ")(n + " + r + ") - n(n + " + q + ") = n^2 + " + q + "n + " + k + " - n^2 - " + q + "n = " + k) + ". " + M("A - B > 0") + " : " + M("A > B") + " pour tout " + M("n") + ".",
          { ctx: "diff-fractions-n", guide: [GX("Développe " + M("(n + " + p + ")(n + " + r + ")") + ".", "n^2+" + q + "*n+" + k, M("n^2 + " + q + "n + " + k) + "."), GR(M("k") + " ?", k, M(k) + ".")],
            traps: [TR(p - q + r === 0 ? q : p + r, "Développe (n + " + p + ")(n + " + r + ") : le terme constant est " + p + " × " + r + "."), TR(-k, "On calcule A − B, pas B − A.")] }); },
      () => { const [a, b, q, k, ka, kb] = pk([[2, 3, "\\frac{32}{27}", 20, 5, 3], [2, 3, "\\frac{8}{9}", 10, 3, 2], [5, 2, "\\frac{125}{128}", 10, 3, 7], [3, 2, "\\frac{9}{8}", 20, 2, 3], [7, 2, "\\frac{49}{64}", 15, 2, 6]]), v = a ** ka / b ** kb;
        return QF("On compare " + M("A = " + a + "^{" + ka * k + "}") + " et " + M("B = " + b + "^{" + kb * k + "}") + " : " + M("\\frac{A}{B} = q^{" + k + "}") + ". Quelle est la fraction " + M("q") + " ? (puis compare-la à 1)", v,
          M("A = (" + a + "^{" + ka + "})^{" + k + "}") + " et " + M("B = (" + b + "^{" + kb + "})^{" + k + "}") + ", donc " + M("\\frac{A}{B} = \\left(\\frac{" + a ** ka + "}{" + b ** kb + "}\\right)^{" + k + "}") + ". " + M("q = " + q) + (v > 1 ? " > 1, donc " + M("A > B") : " < 1, donc " + M("A < B")) + ".",
          { ctx: "grandes-puissances", guide: [GR(M(a + "^{" + ka + "}") + " ?", a ** ka, M(a ** ka) + "."), GR(M(b + "^{" + kb + "}") + " ?", b ** kb, M(b ** kb) + "."), GR(M("q") + " ?", v, M(q) + ".")],
            traps: [TR(1 / v, "C'est B ÷ A."), TR(rnd(a / b, 9), "Regroupe les exposants : " + a + "^" + ka * k + " = (" + a + "^" + ka + ")^" + k + ".")] }); },
    ],
  };

  // ======================= posrelc : position relative de deux courbes (1re.AN.09) =======================
  const plot2 = (f, g, xr, yr, lab) => FIG.plot([{ f }, { f: g, cls: "f-blue" }], [], { xr, yr, numbers: true, label: lab });
  const lr = (a, b) => (a === 1 ? "x" : a === -1 ? "-x" : N(a) + "x") + (b ? sg(b) : "");
  const PC = {
    1: [
      () => { const a = R.int(-4, 4), b = R.int(-6, 6), c = a + nz(-4, 4), d = R.int(-8, 8), m = a - c, r = (d - b) / m; if (!Number.isInteger(r * 2) || !r) return null;
        const ivs = m > 0 ? [[r, false, Infinity, false]] : [[-Infinity, false, r, false]];
        return QS("Soit " + M("f(x) = x^2" + (a ? sg(a) + "x" : "") + (b ? sg(b) : "")) + " et " + M("g(x) = x^2" + (c ? sg(c) + "x" : "") + (d ? sg(d) : "")) + ". Sur quel intervalle la courbe de " + M("f") + " est-elle strictement au-dessus de celle de " + M("g") + " ?", ivs,
          M("f(x) - g(x) = " + lr(m, b - d)) + ". " + M("f(x) - g(x) > 0 \\iff x " + (m > 0 ? ">" : "<") + " " + F(r)) + " (on divise par " + M(N(m)) + (m < 0 ? ", négatif : le sens change" : "") + ").",
          { ctx: "affine-diff", guide: [GX(M("f(x) - g(x)") + " ?", (m === 1 ? "" : m === -1 ? "-" : m + "*") + "x" + (b - d < 0 ? "-" + (d - b) : b - d ? "+" + (b - d) : ""), M(lr(m, b - d)) + "."), GR("Valeur qui annule " + M("f(x) - g(x)") + " ?", r, M(F(r)) + "."), { ask: "Intervalle ?", spec: solsetSpec(ivs), sol: M(m > 0 ? "]" + F(r) + " \\,;\\, +\\infty[" : "]-\\infty \\,;\\, " + F(r) + "[") + "." }],
            traps: [TS(m > 0 ? [[-Infinity, false, r, false]] : [[r, false, Infinity, false]], m < 0 ? "En divisant par un nombre négatif, le sens de l'inégalité change." : "C'est là où C_f est au-dessous.")] }); },
      () => { const a = R.int(-3, 3), b = R.int(-6, 6), m = nz(-4, 4), r = nz(-5, 5), c = a - m, d = b + m * r;
        return QN("Les courbes de " + M("f(x) = 2x^2" + (a ? sg(a) + "x" : "") + (b ? sg(b) : "")) + " et " + M("g(x) = 2x^2" + (c ? sg(c) + "x" : "") + (d ? sg(d) : "")) + " se coupent en un seul point. Quelle est son abscisse ?", r,
          M("f(x) = g(x) \\iff f(x) - g(x) = 0 \\iff " + lr(m, b - d) + " = 0 \\iff x = " + r) + ".",
          { ctx: "intersection", guide: [GR("Coefficient de " + M("x") + " dans " + M("f(x) - g(x)") + " ?", m, M(a + " - " + NP(c) + " = " + m) + "."), GR("Abscisse ?", r, M("x = " + r) + ".")],
            traps: [TR(-r, "Résous " + m + "x " + (b - d < 0 ? "− " + (d - b) : "+ " + (b - d)) + " = 0 avec soin (signe)."), TR(b - d, "Il faut diviser par le coefficient de x.")] }); },
      () => { const a = pk([3, 4, 5, 6, -3, -4]);
        return QN("Soit " + M("f(x) = x^2 + " + a * a) + " et " + M("g(x) = " + 2 * a + "x") + ". On a " + M("f(x) - g(x) = (x " + (a > 0 ? "-" : "+") + " " + Math.abs(a) + ")^2 \\geqslant 0") + " : la courbe de " + M("f") + " est au-dessus de celle de " + M("g") + ". En quelle abscisse se touchent-elles ?", a,
          M("f(x) - g(x) = (x " + (a > 0 ? "-" : "+") + " " + Math.abs(a) + ")^2") + " s'annule seulement en " + M("x = " + a) + " : les courbes se touchent en ce point (la droite est tangente à la parabole) ; partout ailleurs, " + M("C_f") + " est strictement au-dessus.",
          { ctx: "contact", fig: plot2((x) => x * x + a * a, (x) => 2 * a * x, a > 0 ? [-2, a + 3] : [a - 3, 2], [-2, a * a * 2 + 4], "parabole et droite tangente"), guide: [GR("Valeur qui annule " + M("(x " + (a > 0 ? "-" : "+") + " " + Math.abs(a) + ")^2") + " ?", a, M(a) + ".")],
            traps: [TR(-a, "(x − k)² s'annule pour x = k : attention au signe."), TR(a * a, "C'est la valeur de f(x) − g(x) en 0, pas une abscisse de contact.")] }); },
    ],
    2: [
      () => { const [r1, r2] = pk([[-1, 3], [-2, 1], [1, 4], [-3, 2], [0.5, 3], [-1, 2], [2, 5]]), s = r1 + r2, p = r1 * r2;
        return QS("Sur quel intervalle la parabole " + M("y = x^2") + " est-elle strictement au-dessous de la droite " + M("y = " + lr(s, -p)) + " ?", [[r1, false, r2, false]],
          M("x^2 - (" + lr(s, -p) + ") = x^2" + (s ? sg(-s) + "x" : "") + (p ? sg(p) : "") + " = (x" + sg(-r1) + ")(x" + sg(-r2) + ")") + " : négatif entre les racines " + M(F(r1)) + " et " + M(F(r2)) + ". La parabole est au-dessous de la droite sur " + M("]" + F(r1) + " \\,;\\, " + F(r2) + "[") + ".",
          { ctx: "parabole-droite", fig: plot2((x) => x * x, (x) => s * x - p, [Math.min(r1, 0) - 2, Math.max(r2, 0) + 2], [-3, Math.max(r1 * r1, r2 * r2) + 3], "parabole et droite"), guide: [GSet2("Racines de " + M("x^2" + (s ? sg(-s) + "x" : "") + (p ? sg(p) : "")) + " ?", [r1, r2]), { ask: "Intervalle ?", spec: solsetSpec([[r1, false, r2, false]]), sol: M("]" + F(r1) + " \\,;\\, " + F(r2) + "[") + "." }],
            traps: [TS([[-Infinity, false, r1, false], [r2, false, Infinity, false]], "C'est là où la parabole est au-dessus : un trinôme (a > 0) est négatif entre ses racines.")] }); },
      () => { const [r1, r2] = pk([[-2, 3], [-1, 4], [1, 3], [-4, -1], [-3, 2], [2, 6]]), s = r1 + r2, p = r1 * r2, b = R.int(-3, 3), c = R.int(-4, 4);
        const ivs = [[-Infinity, false, r1, false], [r2, false, Infinity, false]];
        return QS("Soit " + M("f(x) = 2x^2" + (b - s ? sg(b - s) + "x" : "") + (c + p ? sg(c + p) : "")) + " et " + M("g(x) = x^2" + (b ? sg(b) + "x" : "") + (c ? sg(c) : "")) + ". Sur quel ensemble la courbe de " + M("f") + " est-elle strictement au-dessus de celle de " + M("g") + " ?", ivs,
          M("f(x) - g(x) = x^2" + (s ? sg(-s) + "x" : "") + (p ? sg(p) : "") + " = (x" + sg(-r1) + ")(x" + sg(-r2) + ")") + ", positif à l'extérieur des racines : " + M("]-\\infty \\,;\\, " + r1 + "[ \\cup ]" + r2 + " \\,;\\, +\\infty[") + ".",
          { ctx: "deux-paraboles", guide: [GX(M("f(x) - g(x)") + " ?", "x^2" + (s ? (-s > 0 ? "+" : "") + -s + "*x" : "") + (p ? (p > 0 ? "+" : "") + p : ""), M("x^2" + (s ? sg(-s) + "x" : "") + (p ? sg(p) : "")) + "."), GSet2("Racines ?", [r1, r2]), { ask: "Ensemble ?", spec: solsetSpec(ivs), sol: M("]-\\infty \\,;\\, " + r1 + "[ \\cup ]" + r2 + " \\,;\\, +\\infty[") + "." }],
            traps: [TS([[r1, false, r2, false]], "Entre les racines, f − g est négatif : C_f y est au-dessous.")] }); },
      () => { const k = pk([2, 3, 4, 1.5, 2.5]), m = rnd(k - k * Math.log(k), 9);
        return QR("On étudie la position de la courbe de " + M("x \\mapsto e^x") + " par rapport à la droite " + M("y = " + N(k) + "x") + " avec " + M("h(x) = e^x - " + N(k) + "x") + ". Quel est le minimum de " + M("h") + " sur " + M("\\mathbb{R}") + " ? (au centième)", m, 0.01,
          M("h'(x) = e^x - " + N(k)) + ", nulle en " + M("x = \\ln " + N(k)) + " (négative avant, positive après) : minimum " + M("h(\\ln " + N(k) + ") = " + N(k) + " - " + N(k) + "\\ln " + N(k) + " \\approx " + N(rnd(m, 2))) + ". " + (m > 0 ? "Il est positif : la courbe est toujours au-dessus de la droite." : "Il est négatif : la courbe passe au-dessous de la droite autour de " + M("\\ln " + N(k)) + "."),
          { ctx: "exp-droite", guide: [GR("Abscisse du minimum (" + M("h'(x) = 0") + ", au centième) ?", Math.log(k), M("\\ln " + N(k) + " \\approx " + N(rnd(Math.log(k), 2))) + ".", 0.01), GR("Minimum (au centième) ?", m, M("\\approx " + N(rnd(m, 2))) + ".", 0.01)],
            traps: [TR(rnd(1 - k * Math.log(k), 9), "h(ln k) = e^(ln k) − k ln k = k − k ln k : e^(ln k) vaut k, pas 1."), TR(rnd(Math.log(k), 9), "C'est l'abscisse du minimum ; on demande sa valeur.")] }); },
    ],
    3: [
      () => { const a = pk([2, 3, -2, -3]);
        return QN("La tangente à la courbe de " + M("f(x) = x^3") + " au point d'abscisse " + M(a) + " a pour équation " + M("y = " + 3 * a * a + "x" + sg(-2 * a ** 3)) + ". En quelle autre abscisse la tangente recoupe-t-elle la courbe ? (On étudie " + M("d(x) = x^3 - " + 3 * a * a + "x" + sg(2 * a ** 3)) + ", dont " + M(a) + " est racine double.)", -2 * a,
          M("(x" + sg(-a) + ")^2(x" + sg(2 * a) + ") = 0 \\iff x = " + a + " \\text{ ou } x = " + -2 * a) + ". En " + M(a) + ", c'est le point de contact ; l'autre point commun est en " + M(-2 * a) + ". Le signe de " + M("x" + sg(2 * a)) + " donne la position : courbe au-dessus de la tangente pour " + M("x > " + -2 * a) + ".",
          { ctx: "tangente-recoupe", fig: plot2((x) => x ** 3, (x) => 3 * a * a * x - 2 * a ** 3, [-Math.abs(2 * a) - 1, Math.abs(2 * a) + 1], [-30, 30], "cubique et tangente"), guide: [GX("Factorise " + M("d(x)") + " sous la forme " + M("(x" + sg(-a) + ")^2(x + c)") + " : écris " + M("d(x)") + " factorisé.", "(x" + (a > 0 ? "-" : "+") + Math.abs(a) + ")^2*(x" + (2 * a > 0 ? "+" : "-") + Math.abs(2 * a) + ")", M("(x" + sg(-a) + ")^2(x" + sg(2 * a) + ")") + " (le terme constant donne " + M("a^2 c = " + 2 * a ** 3) + ")."), GR("Autre abscisse ?", -2 * a, M(-2 * a) + ".")],
            traps: [TR(a, "C'est le point de contact ; on cherche l'autre point commun."), TR(2 * a, "x " + (2 * a > 0 ? "+ " : "− ") + Math.abs(2 * a) + " = 0 donne x = " + -2 * a + ".")] }); },
      () => { const p = nz(-4, 4), q = R.int(p * p + 2, p * p + 12), mx = q - p * p;
        return QS("Pour quelles valeurs du réel " + M("m") + " la droite " + M("y = m") + " est-elle strictement au-dessous de la parabole " + M("y = x^2" + sg(-2 * p) + "x" + sg(q)) + " pour tout réel " + M("x") + " ?", [[-Infinity, false, mx, false]],
          M("x^2" + sg(-2 * p) + "x" + sg(q) + " = (x" + sg(-p) + ")^2 + " + mx) + " : la parabole a pour minimum " + M(mx) + " (en " + M("x = " + p) + "). La droite est au-dessous partout si " + M("m < " + mx) + ".",
          { ctx: "parametre-m", guide: [GR("Abscisse du sommet ?", p, M("\\frac{" + 2 * p + "}{2} = " + p) + "."), GR("Minimum de la parabole ?", mx, M(mx) + "."), { ask: "Valeurs de " + M("m") + " ?", spec: solsetSpec([[-Infinity, false, mx, false]]), sol: M("m < " + mx) + "." }],
            traps: [TS([[-Infinity, false, mx, true]], "Pour m = " + mx + ", la droite touche la parabole : « strictement au-dessous » exclut ce cas."), TS([[-Infinity, false, q, false]], "Le minimum de la parabole n'est pas " + q + " (valeur en 0) : cherche le sommet.")] }); },
      () => { const r = R.int(2, 4), c = R.int(-3, 3), d = R.int(-5, 5), ivs = [[-r, false, 0, false], [r, false, Infinity, false]];
        return QS("Soit " + M("f(x) = x^3" + (c ? sg(c) + "x^2" : "") + (d ? sg(d) : "")) + " et " + M("g(x) = " + (c ? co(c, "x^2") + " + " : "") + r * r + "x" + (d ? sg(d) : "")) + ". Sur quel ensemble la courbe de " + M("f") + " est-elle strictement au-dessus de celle de " + M("g") + " ?", ivs,
          M("f(x) - g(x) = x^3 - " + r * r + "x = x(x - " + r + ")(x + " + r + ")") + ". Tableau de signes : positif sur " + M("]-" + r + " \\,;\\, 0[ \\cup ]" + r + " \\,;\\, +\\infty[") + ".",
          { ctx: "cubique-signe", guide: [GX(M("f(x) - g(x)") + " ?", "x^3-" + r * r + "*x", M("x^3 - " + r * r + "x") + "."), GSet2("Valeurs qui l'annulent ?", [-r, 0, r]), { ask: "Ensemble ?", spec: solsetSpec(ivs), sol: M("]-" + r + " \\,;\\, 0[ \\cup ]" + r + " \\,;\\, +\\infty[") + "." }],
            traps: [TS([[r, false, Infinity, false]], "x³ − " + r * r + "x = x(x² − " + r * r + ") : trois racines, fais un tableau de signes."), TS([[-Infinity, false, -r, false], [0, false, r, false]], "C'est là où C_f est au-dessous.")] }); },
    ],
  };
  function GSet2(ask, vals) { return { ask, spec: { kind: "set", values: [...new Set(vals)] }, sol: vals.map((v) => M(F(v))).join(" ; ") + "." }; }

  // ======================= intmaj : majorer, encadrer une intégrale (Tle.AN.24) =======================
  const IM = {
    1: [
      () => { const a = R.int(-2, 3), b = a + R.int(2, 5), m = R.int(1, 4), Mx = m + R.int(2, 5), up = R.rand() < 0.5, v = (up ? Mx : m) * (b - a);
        return QN("Une fonction " + M("f") + " continue vérifie " + M(m + " \\leqslant f(x) \\leqslant " + Mx) + " pour tout " + M("x \\in [" + a + " \\,;\\, " + b + "]") + ". Quel " + (up ? "majorant" : "minorant") + " de " + M("\\int_{" + a + "}^{" + b + "} f(x)\\,dx") + " obtient-on en intégrant cet encadrement ?", v,
          "Par positivité de l'intégrale (croissance) : " + M(m + "(" + b + " - " + NP(a) + ") \\leqslant \\int_{" + a + "}^{" + b + "} f(x)\\,dx \\leqslant " + Mx + "(" + b + " - " + NP(a) + ")") + ", soit " + M((m * (b - a)) + " \\leqslant I \\leqslant " + Mx * (b - a)) + ".",
          { ctx: "encadrement-" + (up ? "max" : "min"), guide: [GR("Longueur de l'intervalle ?", b - a, M(b + " - " + NP(a) + " = " + (b - a)) + "."), GR((up ? "Majorant" : "Minorant") + " ?", v, M(v) + ".")],
            traps: [TR(up ? Mx : m, "On intègre la constante sur l'intervalle : on multiplie par sa longueur " + (b - a) + "."), TR((up ? m : Mx) * (b - a), up ? "C'est le minorant." : "C'est le majorant.")] }); },
      () => { const [fx, f, a, b, fa, fb, nm] = pk([["\\sqrt{x^2 + 9}", (x) => Math.sqrt(x * x + 9), 0, 4, 3, 5, "rac9"], ["\\sqrt{x^2 + 16}", (x) => Math.sqrt(x * x + 16), 0, 3, 4, 5, "rac16"], ["\\sqrt{x^2 + 36}", (x) => Math.sqrt(x * x + 36), 0, 8, 6, 10, "rac36"], ["\\frac{12}{x + 2}", (x) => 12 / (x + 2), 1, 4, 4, 2, "inverse"], ["\\sqrt{x^2 + 25}", (x) => Math.sqrt(x * x + 25), 0, 12, 5, 13, "rac25"]]), up = R.rand() < 0.5, mn = Math.min(fa, fb), mx = Math.max(fa, fb), v = (up ? mx : mn) * (b - a);
        return QN("La fonction " + M("f(x) = " + fx) + " est " + (fa < fb ? "croissante" : "décroissante") + " sur " + M("[" + a + " \\,;\\, " + b + "]") + ", avec " + M("f(" + a + ") = " + fa) + " et " + M("f(" + b + ") = " + fb) + ". Quel " + (up ? "majorant" : "minorant") + " de " + M("\\int_{" + a + "}^{" + b + "} f(x)\\,dx") + " en déduit-on ?", v,
          "Sur l'intervalle, " + M(mn + " \\leqslant f(x) \\leqslant " + mx) + " ; en intégrant : " + M(mn * (b - a) + " \\leqslant \\int_{" + a + "}^{" + b + "} f(x)\\,dx \\leqslant " + mx * (b - a)) + ".",
          { ctx: "monotone-" + nm, guide: [GR("Valeur " + (up ? "maximale" : "minimale") + " de " + M("f") + " sur l'intervalle ?", up ? mx : mn, M(up ? mx : mn) + "."), GR((up ? "Majorant" : "Minorant") + " ?", v, M(v) + ".")],
            traps: [TR((up ? mn : mx) * (b - a), up ? "Pour majorer, on prend la plus grande valeur de f." : "Pour minorer, on prend la plus petite valeur de f."), TR(up ? mx : mn, "Multiplie par la longueur de l'intervalle (" + (b - a) + ").")] }); },
      () => { const a = R.int(0, 4), b = a + R.int(2, 6), mu = dec1(1.5, 8.5), v = rnd(mu * (b - a), 6);
        return QD("La valeur moyenne d'une fonction continue " + M("f") + " sur " + M("[" + a + " \\,;\\, " + b + "]") + " vaut " + M(N(mu)) + ". Que vaut " + M("\\int_{" + a + "}^{" + b + "} f(x)\\,dx") + " ?", v,
          "Valeur moyenne " + M("\\mu = \\frac{1}{b - a}\\int_a^b f(x)\\,dx") + ", donc " + M("\\int_{" + a + "}^{" + b + "} f(x)\\,dx = " + (b - a) + " \\times " + N(mu) + " = " + N(v)) + ".",
          { ctx: "valeur-moyenne", guide: [GR("Longueur " + M("b - a") + " ?", b - a, M(b - a) + "."), GD("Intégrale ?", v, M(N(v)) + ".")],
            traps: [TD(mu / (b - a), "μ = I ÷ (b − a), donc I = μ × (b − a)."), TD(mu * b, "On multiplie par la longueur b − a, pas par b.")] }); },
    ],
    2: [
      () => { const b = pk([1, 2, 3]), v = rnd(1 - Math.exp(-b), 9);
        return QR("Sur " + M("[0 \\,;\\, " + b + "]") + ", " + M("0 \\leqslant \\sin x \\leqslant 1") + ". Majore " + M("I = \\int_0^{" + b + "} e^{-x}\\sin x\\,dx") + " par l'intégrale de " + M("e^{-x}") + " : quel majorant obtient-on ? (au centième)", v, 0.01,
          M("e^{-x} > 0") + " et " + M("\\sin x \\leqslant 1") + " : " + M("e^{-x}\\sin x \\leqslant e^{-x}") + ". Donc " + M("I \\leqslant \\int_0^{" + b + "} e^{-x}\\,dx = \\left[-e^{-x}\\right]_0^{" + b + "} = 1 - e^{-" + b + "} \\approx " + N(rnd(v, 2))) + ".",
          { ctx: "majorer-exp-sin", guide: [GX("Une primitive de " + M("e^{-x}") + " ?", "-exp(-x)", M("-e^{-x}") + "."), GR("Majorant (au centième) ?", v, M("1 - e^{-" + b + "} \\approx " + N(rnd(v, 2))) + ".", 0.01)],
            traps: [TR(b, "On intègre e^(−x), pas 1 : ∫ e^(−x) dx = 1 − e^(−" + b + ")."), TR(rnd(Math.exp(-b) - 1, 9), "[−e^(−x)] de 0 à " + b + " = −e^(−" + b + ") + 1.")] }); },
      () => { const a = R.int(0, 3), b = a + R.int(1, 4), up = R.rand() < 0.5, v = up ? (b - a) / (1 + a) : (b - a) / (1 + b);
        return QF("La fonction " + M("f(x) = \\frac{1}{1 + x}") + " est décroissante sur " + M("[" + a + " \\,;\\, " + b + "]") + ". En déduis un " + (up ? "majorant" : "minorant") + " de " + M("\\int_{" + a + "}^{" + b + "} \\frac{dx}{1 + x}") + " (fraction).", v,
          M("f(" + b + ") \\leqslant f(x) \\leqslant f(" + a + ")") + ", soit " + M(F(1 / (1 + b)) + " \\leqslant f(x) \\leqslant " + F(1 / (1 + a))) + ". En intégrant sur un intervalle de longueur " + M(b - a) + " : " + M(F((b - a) / (1 + b)) + " \\leqslant I \\leqslant " + F((b - a) / (1 + a))) + ".",
          { ctx: "decroissante-" + (up ? "max" : "min"), guide: [GR("Valeur " + (up ? "maximale" : "minimale") + " de " + M("f") + " ?", up ? 1 / (1 + a) : 1 / (1 + b), M(F(up ? 1 / (1 + a) : 1 / (1 + b))) + " (en " + (up ? a : b) + ")."), GR((up ? "Majorant" : "Minorant") + " ?", v, M(F(v)) + ".")],
            traps: [TR(up ? (b - a) / (1 + b) : (b - a) / (1 + a), "f est décroissante : son maximum est en " + a + ", son minimum en " + b + "."), TR(up ? 1 / (1 + a) : 1 / (1 + b), "Multiplie par la longueur de l'intervalle.")] }); },
      () => { const [fx, gx, v, sens, nm, why] = pk([["e^{x^2}", "e^{x}", Math.E - 1, "majorant", "ex2", "x^2 \\leqslant x"], ["e^{x^3}", "e^{x}", Math.E - 1, "majorant", "ex3", "x^3 \\leqslant x"], ["\\frac{1}{1 + x^2}", "\\frac{1}{1 + x}", Math.log(2), "minorant", "inv", "1 + x^2 \\leqslant 1 + x"], ["\\sqrt{x}", "x", 0.5, "minorant", "rac", "x \\leqslant \\sqrt{x}"]]);
        return QR("Sur " + M("[0 \\,;\\, 1]") + ", on a " + M(why) + ". En comparant " + M(fx) + " et " + M(gx) + ", quel " + sens + " de " + M("\\int_0^{\\,1} " + fx + "\\,dx") + " obtient-on ? (au centième)", rnd(v, 9), 0.01,
          "Sur " + M("[0 \\,;\\, 1]") + " : " + M(why) + ", donc " + M(fx + (sens === "majorant" ? " \\leqslant " : " \\geqslant ") + gx) + ". Par croissance de l'intégrale : " + M("\\int_0^{\\,1} " + fx + "\\,dx" + (sens === "majorant" ? " \\leqslant " : " \\geqslant ") + "\\int_0^{\\,1} " + gx + "\\,dx \\approx " + N(rnd(v, 2))) + ".",
          { ctx: "comparer-" + nm, guide: [GR(M("\\int_0^{\\,1} " + gx + "\\,dx") + " (au centième) ?", rnd(v, 9), M("\\approx " + N(rnd(v, 2))) + ".", 0.01)],
            traps: [TR(1, "On intègre " + gx.replace(/\\/g, "") + " sur [0 ; 1], pas la constante 1."), TR(rnd(Math.E, 9), "∫₀¹ eˣ dx = e − 1.")] }); },
    ],
    3: [
      () => { const n = pk([2, 3, 4]), up = R.rand() < 0.5; let s = 0; for (let k = up ? 0 : 1; k < (up ? n : n + 1); k++) s += 1 / (n + k);
        return QF("On encadre " + M("\\int_1^2 \\frac{dx}{x}") + " par la méthode des rectangles avec " + M(n) + " rectangles de même largeur. " + M("x \\mapsto \\frac{1}{x}") + " est décroissante : les rectangles de hauteur la valeur " + (up ? "à gauche" : "à droite") + " donnent un " + (up ? "majorant" : "minorant") + ". Lequel ? (fraction)", s,
          "Largeur " + M("\\frac{1}{" + n + "}") + ". Hauteurs : " + Array.from({ length: n }, (_, k) => M(F(1 / (1 + (k + (up ? 0 : 1)) / n)))).join(", ") + ". Somme des aires : " + M(F(s) + " \\approx " + N(rnd(s, 3))) + " (et " + M("\\ln 2 \\approx 0{,}693") + ").",
          { ctx: "rectangles-" + (up ? "gauche" : "droite"), guide: [GR("Largeur d'un rectangle ?", 1 / n, M("\\frac{1}{" + n + "}") + "."), GR("Hauteur du premier rectangle ?", 1 / (1 + (up ? 0 : 1) / n), M(F(1 / (1 + (up ? 0 : 1) / n))) + "."), GR((up ? "Majorant" : "Minorant") + " ?", s, M(F(s)) + ".")],
            traps: [TR(rnd(Math.log(2), 9), "C'est la valeur exacte ln 2 ; on demande la somme des rectangles."), TR(rnd(s * n, 9), "Chaque aire = largeur × hauteur : multiplie par 1/" + n + ".")] }); },
      () => { const n = R.int(4, 12), up = R.rand() < 0.5, v = up ? 1 / (n + 1) : 1 / (2 * (n + 1));
        return QF("Soit " + M("I_n = \\int_0^{\\,1} \\frac{x^{" + "n}}{1 + x}\\,dx") + ". Pour " + M("x \\in [0 \\,;\\, 1]") + ", " + M("\\frac{x^n}{2} \\leqslant \\frac{x^n}{1 + x} \\leqslant x^n") + ". Donne le " + (up ? "majorant" : "minorant") + " de " + M("I_{" + n + "}") + " obtenu en intégrant (fraction).", v,
          M("\\int_0^{\\,1} x^n\\,dx = \\frac{1}{n + 1}") + " : " + M("\\frac{1}{2(n + 1)} \\leqslant I_n \\leqslant \\frac{1}{n + 1}") + ". Pour " + M("n = " + n) + " : " + M(F(1 / (2 * (n + 1))) + " \\leqslant I_{" + n + "} \\leqslant " + F(1 / (n + 1))) + ". Donc " + M("I_n \\to 0") + ".",
          { ctx: "majorant-xn-" + (up ? "max" : "min"), guide: [GR(M("\\int_0^{\\,1} x^{" + n + "}\\,dx") + " ?", 1 / (n + 1), M("\\frac{1}{" + (n + 1) + "}") + "."), GR((up ? "Majorant" : "Minorant") + " ?", v, M(F(v)) + ".")],
            traps: [TR(up ? 1 / n : 1 / (n + 1), up ? "Une primitive de xⁿ est x^(n+1)/(n + 1)." : "Le minorant vient de xⁿ/2 : on divise encore par 2."), TR(up ? 1 / (2 * (n + 1)) : 1 / (2 * n), up ? "C'est le minorant." : "∫₀¹ xⁿ dx = 1/(n + 1).")] }); },
      () => { const [s, n] = pk([[0.01, 99], [0.02, 49], [0.04, 24], [0.05, 19], [0.005, 199], [0.025, 39]]);
        return QN("On sait que " + M("0 \\leqslant I_n \\leqslant \\frac{1}{n + 1}") + " pour tout entier " + M("n") + ". À partir de quel entier " + M("n") + " l'encadrement garantit-il " + M("I_n \\leqslant " + N(s)) + " ?", n,
          M("\\frac{1}{n + 1} \\leqslant " + N(s) + " \\iff n + 1 \\geqslant " + N(rnd(1 / s, 6)) + " \\iff n \\geqslant " + n) + ". La suite " + M("(I_n)") + " tend vers 0 (théorème des gendarmes).",
          { ctx: "seuil", guide: [GR(M("\\frac{1}{" + N(s) + "}") + " ?", rnd(1 / s, 9), M(N(rnd(1 / s, 6))) + "."), GR(M("n") + " ?", n, M(n) + ".")],
            traps: [TR(n + 1, "1/(n + 1) ≤ " + D(s) + " ⇔ n + 1 ≥ " + (n + 1) + ", donc n ≥ " + n + "."), TR(n - 1, "Pour n = " + (n - 1) + ", 1/(n + 1) = 1/" + n + " > " + D(s) + ".")] }); },
    ],
  };

  // ======================= suiteint : suites d'intégrales (Tle.AN.26) =======================
  const SI = {
    1: [
      () => { const b = pk([2, 3]), n = pk([2, 3, 4]), v = b ** (n + 1) / (n + 1);
        return QF("Pour tout entier " + M("n \\geqslant 0") + ", on pose " + M("I_n = \\int_0^{" + b + "} x^n\\,dx") + ". Calcule " + M("I_{" + n + "}") + ".", v,
          "Une primitive de " + M("x^n") + " est " + M("\\frac{x^{n+1}}{n + 1}") + " : " + M("I_{" + n + "} = \\left[\\frac{x^{" + (n + 1) + "}}{" + (n + 1) + "}\\right]_0^{" + b + "} = \\frac{" + b ** (n + 1) + "}{" + (n + 1) + "}" + (Number.isInteger(v) ? " = " + v : "")) + ".",
          { ctx: "puissance", guide: [GR(M(b + "^{" + (n + 1) + "}") + " ?", b ** (n + 1), M(b ** (n + 1)) + "."), GR(M("I_{" + n + "}") + " ?", v, M(F(v)) + ".")],
            traps: [TR(b ** n / n, "Une primitive de xⁿ est x^(n+1)/(n + 1)."), TR(b ** (n + 1), "N'oublie pas de diviser par n + 1.")] }); },
      () => { const n = R.int(2, 7), v = 1 / ((n + 1) * (n + 2));
        return QF("On pose " + M("I_n = \\int_0^{\\,1} x^n\\,dx") + ". Calcule " + M("I_{" + n + "} - I_{" + (n + 1) + "}") + " (fraction). Son signe donne le sens de variation de la suite.", v,
          M("I_n = \\frac{1}{n + 1}") + " : " + M("I_{" + n + "} - I_{" + (n + 1) + "} = \\frac{1}{" + (n + 1) + "} - \\frac{1}{" + (n + 2) + "} = " + F(v) + " > 0") + " : la suite est décroissante (sur " + M("[0 \\,;\\, 1]") + ", " + M("x^{n+1} \\leqslant x^n") + ").",
          { ctx: "difference", guide: [GR(M("I_{" + n + "}") + " ?", 1 / (n + 1), M("\\frac{1}{" + (n + 1) + "}") + "."), GR(M("I_{" + (n + 1) + "}") + " ?", 1 / (n + 2), M("\\frac{1}{" + (n + 2) + "}") + "."), GR("Différence ?", v, M(F(v)) + ".")],
            traps: [TR(-v, "C'est I_(n+1) − I_n."), TR(1 / (n + 1), "C'est I_" + n + " seul.")] }); },
      () => { const n = pk([2, 3, 4, 5]), v = rnd((1 - Math.exp(-n)) / n, 9);
        return QR("Pour tout entier " + M("n \\geqslant 1") + ", " + M("J_n = \\int_0^{\\,1} e^{-nx}\\,dx") + ". Calcule " + M("J_{" + n + "}") + " (au centième).", v, 0.01,
          "Une primitive de " + M("e^{-nx}") + " est " + M("-\\frac{1}{n}e^{-nx}") + " : " + M("J_{" + n + "} = \\frac{1 - e^{-" + n + "}}{" + n + "} \\approx " + N(rnd(v, 2))) + ".",
          { ctx: "exponentielle", guide: [GX("Une primitive de " + M("e^{-" + n + "x}") + " ?", "-exp(-" + n + "*x)/" + n, M("-\\frac{1}{" + n + "}e^{-" + n + "x}") + "."), GR(M("J_{" + n + "}") + " (au centième) ?", v, M("\\approx " + N(rnd(v, 2))) + ".", 0.01)],
            traps: [TR(rnd(1 - Math.exp(-n), 9), "La primitive de e^(−nx) a un facteur 1/n."), TR(rnd(Math.exp(-n), 9), "J_n = [−e^(−nx)/n] de 0 à 1 = (1 − e^(−n))/n.")] }); },
    ],
    2: [
      () => { const n = pk([2, 3]), I = [Math.E - 1]; for (let k = 0; k < 3; k++) I.push(Math.E - (k + 1) * I[k]); const v = rnd(I[n], 9);
        return QR("Soit " + M("I_n = \\int_0^{\\,1} x^n e^x\\,dx") + ". Une intégration par parties donne " + M("I_{n+1} = e - (n + 1)I_n") + ", et " + M("I_0 = e - 1") + ". Calcule " + M("I_{" + n + "}") + " (au centième).", v, 0.01,
          M("I_1 = e - (e - 1) = 1") + (n >= 2 ? ", " + M("I_2 = e - 2 \\times 1 = e - 2 \\approx 0{,}72") : "") + (n >= 3 ? ", " + M("I_3 = e - 3(e - 2) = 6 - 2e \\approx 0{,}56") : "") + ".",
          { ctx: "ipp-recurrence", guide: [GR(M("I_1") + " ?", 1, M("e - (e - 1) = 1") + "."), GR(M("I_" + n) + " (au centième) ?", v, M("\\approx " + N(rnd(v, 2))) + ".", 0.01)],
            traps: [TR(rnd(Math.E - I[n - 1], 9), "La relation est I_(n+1) = e − (n + 1) I_n : le coefficient change à chaque étape."), TR(rnd(I[n - 1], 9), "C'est I_" + (n - 1) + ".")] }); },
      () => { const n = pk([1, 2, 3]), I = [Math.log(2)]; for (let k = 0; k < 3; k++) I.push(1 / (k + 1) - I[k]); const v = rnd(I[n], 9);
        return QR("Soit " + M("I_n = \\int_0^{\\,1} \\frac{x^n}{1 + x}\\,dx") + ". On a " + M("I_n + I_{n+1} = \\int_0^{\\,1} x^n\\,dx = \\frac{1}{n + 1}") + " et " + M("I_0 = \\ln 2") + ". Calcule " + M("I_{" + n + "}") + " (au centième).", v, 0.01,
          M("I_1 = 1 - \\ln 2 \\approx 0{,}31") + (n >= 2 ? ", " + M("I_2 = \\frac{1}{2} - I_1 = \\ln 2 - \\frac{1}{2} \\approx 0{,}19") : "") + (n >= 3 ? ", " + M("I_3 = \\frac{1}{3} - I_2 = \\frac{5}{6} - \\ln 2 \\approx 0{,}14") : "") + ".",
          { ctx: "somme-consecutifs", guide: [GR(M("I_1") + " (au centième) ?", rnd(I[1], 9), M("1 - \\ln 2 \\approx 0{,}31") + ".", 0.01), GR(M("I_" + n) + " (au centième) ?", v, M("\\approx " + N(rnd(v, 2))) + ".", 0.01)].slice(n === 1 ? 1 : 0),
            traps: [TR(rnd(1 / (n + 1), 9), "C'est I_n + I_(n+1) ; il faut retrancher le terme précédent."), TR(rnd(1 / n + I[n - 1], 9), "I_n = 1/n − I_(n−1) : on soustrait.")] }); },
      () => { const n = R.int(2, 6), v = 1 / ((n + 1) * (n + 2));
        return QF("Pour tout entier " + M("n \\geqslant 0") + ", " + M("I_n = \\int_0^{\\,1} x^n(1 - x)\\,dx") + ". Calcule " + M("I_{" + n + "}") + " (fraction).", v,
          M("I_n = \\int_0^{\\,1} (x^n - x^{n+1})\\,dx = \\frac{1}{n + 1} - \\frac{1}{n + 2} = \\frac{1}{(n + 1)(n + 2)}") + " : " + M("I_{" + n + "} = " + F(v)) + ". La suite est décroissante et tend vers 0.",
          { ctx: "beta", guide: [GR(M("\\int_0^{\\,1} x^{" + n + "}\\,dx") + " ?", 1 / (n + 1), M("\\frac{1}{" + (n + 1) + "}") + "."), GR(M("\\int_0^{\\,1} x^{" + (n + 1) + "}\\,dx") + " ?", 1 / (n + 2), M("\\frac{1}{" + (n + 2) + "}") + "."), GR(M("I_{" + n + "}") + " ?", v, M(F(v)) + ".")],
            traps: [TR(1 / (n + 1), "Développe x^n(1 − x) = xⁿ − x^(n+1) et intègre les deux termes."), TR(1 / ((n + 1) * n), "∫₀¹ x^(n+1) dx = 1/(n + 2).")] }); },
    ],
    3: [
      () => { const [txt, v, nm, why] = pk([["x^n e^x", Math.E, "ex", "I_{n+1} = e - (n + 1)I_n"], ["x^n e^{-x}", 1 / Math.E, "emx", "I_{n+1} = (n + 1)I_n - e^{-1}"], ["\\frac{x^n}{1 + x}", 0.5, "inv", "I_n + I_{n+1} = \\frac{1}{n + 1}"]]);
        return QR("Soit " + M("I_n = \\int_0^{\\,1} " + txt + "\\,dx") + ". On sait que " + M(why) + ", que " + M("(I_n)") + " est décroissante et tend vers 0. Vers quelle limite tend " + M("n I_n") + " ? (au centième)", rnd(v, 9), 0.01,
          nm === "ex" ? M("(n + 1)I_n = e - I_{n+1} \\to e") + ", et " + M("nI_n = (n + 1)I_n - I_n \\to e \\approx 2{,}72") + "." : nm === "emx" ? M("(n + 1)I_n = I_{n+1} + e^{-1} \\to e^{-1}") + ", donc " + M("nI_n \\to e^{-1} \\approx 0{,}37") + "." : "La suite décroît : " + M("2I_{n+1} \\leqslant I_n + I_{n+1} = \\frac{1}{n + 1} \\leqslant 2I_n") + ", d'où " + M("\\frac{n}{2(n + 1)} \\leqslant nI_n \\leqslant \\frac{n}{2n}") + " (au rang suivant) : " + M("nI_n \\to \\frac{1}{2}") + ".",
          { ctx: "limite-nIn-" + nm, guide: [GR("Limite (au centième) ?", rnd(v, 9), M("\\approx " + N(rnd(v, 2))) + ".", 0.01)],
            traps: [TR(1, "Utilise la relation : isole (n + 1) I_n, puis passe à la limite (I_n → 0)."), TR(rnd(2 * v, 9), "Reprends la relation : seul un terme tend vers 0.")] }); },
      () => { const n = pk([3, 4, 5]), I = [Math.PI / 2, 1]; for (let k = 2; k <= 5; k++) I.push(((k - 1) / k) * I[k - 2]); const v = rnd(I[n], 9), ex = n === 3 ? "\\frac{2}{3}" : n === 5 ? "\\frac{8}{15}" : "\\frac{3\\pi}{16}";
        return QR("Soit " + M("W_n = \\int_0^{\\frac{\\pi}{2}} \\sin^n x\\,dx") + " (intégrales de Wallis). Par parties, " + M("W_{n+2} = \\frac{n + 1}{n + 2}W_n") + ", avec " + M("W_0 = \\frac{\\pi}{2}") + " et " + M("W_1 = 1") + ". Calcule " + M("W_{" + n + "}") + " (au centième).", v, 0.01,
          (n % 2 ? M("W_3 = \\frac{2}{3}W_1 = \\frac{2}{3}") + (n === 5 ? ", " + M("W_5 = \\frac{4}{5}W_3 = \\frac{8}{15}") : "") : M("W_2 = \\frac{1}{2}W_0 = \\frac{\\pi}{4}") + ", " + M("W_4 = \\frac{3}{4}W_2 = \\frac{3\\pi}{16}")) + " : " + M("W_{" + n + "} = " + ex + " \\approx " + N(rnd(v, 2))) + ".",
          { ctx: "wallis", guide: [GR(M("W_{" + (n - 2) + "}") + " (au centième) ?", rnd(I[n - 2], 9), M("\\approx " + N(rnd(I[n - 2], 2))) + ".", 0.01), GR(M("W_{" + n + "}") + " (au centième) ?", v, M(ex + " \\approx " + N(rnd(v, 2))) + ".", 0.01)],
            traps: [TR(rnd(((n - 1) / n) * I[n - 1], 9), "La relation relie W_(n+2) à W_n (deux rangs plus bas)."), TR(rnd((n / (n + 1)) * I[n - 2], 9), "W_(n+2) = (n + 1)/(n + 2) × W_n : pour W_" + n + ", le coefficient est " + (n - 1) + "/" + n + ".")] }); },
      () => { const s = pk([0.1, 0.05, 0.04, 0.02, 0.2, 0.125]), n = Math.round(1 / s);
        return QN("Pour tout entier " + M("n \\geqslant 1") + ", " + M("J_n = \\int_0^{\\,1} e^{-nx}\\,dx = \\frac{1 - e^{-n}}{n}") + ". La suite est décroissante. Quel est le plus petit entier " + M("n") + " tel que " + M("J_n < " + N(s)) + " ?", n,
          M("J_n < \\frac{1}{n}") + " ; pour " + M("n = " + n) + " : " + M("J_{" + n + "} = " + N(s) + "(1 - e^{-" + n + "}) < " + N(s)) + ". Pour " + M("n = " + (n - 1)) + " : " + M("J_{" + (n - 1) + "} \\approx " + N(rnd((1 - Math.exp(-(n - 1))) / (n - 1), 4)) + " > " + N(s)) + ". Donc " + M("n = " + n) + ".",
          { ctx: "seuil-exp", guide: [GR(M("J_{" + (n - 1) + "}") + " (au millième) ?", rnd((1 - Math.exp(-(n - 1))) / (n - 1), 9), M("\\approx " + N(rnd((1 - Math.exp(-(n - 1))) / (n - 1), 3))) + " : encore trop grand.", 0.001), GR(M("n") + " ?", n, M(n) + ".")],
            traps: [TR(n - 1, "J_" + (n - 1) + " ≈ " + D(rnd((1 - Math.exp(-(n - 1))) / (n - 1), 3)) + " n'est pas encore sous " + D(s) + "."), TR(n + 1, "J_" + n + " est déjà sous " + D(s) + ".")] }); },
    ],
  };

  // ---------- défis (niveau 4) ----------
  /* 26.11 (agent defis2, rapport de vraisemblance du soir) : chaque défi avait un seul énoncé, toujours le même. Désormais
     3 contextes par notion (ctx), valeurs tirées au hasard, corrigé calculé. PX : P avec contexte et tolérance par partie. */
  const PX = (ctx, q, parts, hints, sol, fig) => Object.assign({ ctx, q, sol, hints, parts: parts.map(([label, value, round]) => ({ label, spec: Object.assign({ kind: "value", value: round ? value : rnd(value, 12) }, round ? { round } : {}) })) }, fig ? { fig } : {});
  const ang = (c1, c2, o) => Math.round((Math.acos((c1 * c1 + c2 * c2 - o * o) / (2 * c1 * c2)) * 180) / Math.PI); /* angle opposé au côté o (degrés entiers) */
  const pw = (a, b, c) => { let s = a === 1 ? "x^2" : a === -1 ? "-x^2" : a + "x^2"; if (b) s += (b < 0 ? " - " : " + ") + (Math.abs(b) === 1 ? "" : Math.abs(b)) + "x"; if (c) s += (c < 0 ? " - " : " + ") + Math.abs(c); return s; };
  const lw = (m, p) => (m === 1 ? "x" : m === -1 ? "-x" : m + "x") + (p ? (p < 0 ? " - " : " + ") + Math.abs(p) : "");
  const fr = (n, d) => { const g = g2(n, d); return "\\frac{" + n / g + "}{" + d / g + "}"; };
  const em = (v) => (Number.isInteger(v) ? N(v) : N(v) + (String(rnd(v, 6)).split(".")[1].length === 1 ? "0" : "")); /* montant : 2 décimales */
  const smooth = (n) => { while (n % 2 === 0) n /= 2; while (n % 5 === 0) n /= 5; return n === 1; }; /* n/d décimal fini */
  const PROBS = {
    symax: [
      () => { let a = 5, b = 6, c = 7; for (let k = 0; k < 60; k++) { const x = R.int(4, 9), y = R.int(4, 9), z = R.int(5, 10); if (x === y || x + y <= z + 1 || x + z <= y + 1 || y + z <= x + 1) continue; if ((x * x + z * z - y * y) / (2 * x * z) < 0.2 || (y * y + z * z - x * x) / (2 * y * z) < 0.2) continue; [a, b, c] = [x, y, z]; break; }
        const A = ang(a, b, c), B = ang(a, c, b), C = 180 - A - B, aB = R.rand() < 0.5;
        return PX("triangle-axe", "Le triangle ABC a pour côtés " + M("AB = " + a) + " cm, " + M("BC = " + c) + " cm, " + M("AC = " + b) + " cm et pour angles " + M("\\widehat{A} = " + A + "°") + ", " + M("\\widehat{B} = " + B + "°") + ". On trace son symétrique A'B'C' par rapport à la droite (BC).",
          [[aB ? "a) Longueur A'B' (cm)" : "a) Longueur A'C' (cm)", aB ? a : b], ["b) Mesure de l'angle " + M("\\widehat{C'}") + " (degrés)", C], ["c) Périmètre du quadrilatère ABA'C (cm)", 2 * a + 2 * b]],
          ["La symétrie conserve les longueurs et les angles ; B et C sont sur l'axe : B' = B, C' = C.", "Le quadrilatère ABA'C a pour côtés AB, BA', A'C et CA."],
          "a) " + M(aB ? "A'B' = AB = " + a : "A'C' = AC = " + b) + " cm ; b) " + M("\\widehat{C} = 180° - " + A + "° - " + B + "° = " + C + "°") + ", conservé par la symétrie ; c) " + M(a + " + " + a + " + " + b + " + " + b + " = " + (2 * a + 2 * b)) + " cm ([BC] est à l'intérieur)."); },
      () => { const d = R.int(6, 15), b = R.int(2, d - 3);
        return PX("jardin-allee", "Dans un jardin à la française, l'allée centrale est un axe de symétrie : chaque élément d'un côté a son symétrique de l'autre côté. Une statue S est à " + M(d) + " m de l'axe ; un banc B est à " + M(b) + " m de l'axe, du même côté, sur la même perpendiculaire à l'allée. On note S' et B' leurs symétriques.",
          [["a) Distance SS' (m)", 2 * d], ["b) Distance S'B' (m)", d - b], ["c) Distance SB' (m)", d + b]],
          ["Un point et son symétrique sont à la même distance de l'axe, de part et d'autre.", "S' et B' sont du même côté de l'allée, sur la même perpendiculaire."],
          "a) " + M(d + " + " + d + " = " + 2 * d) + " m ; b) la symétrie conserve les longueurs : " + M("S'B' = SB = " + d + " - " + b + " = " + (d - b)) + " m ; c) S et B' sont de part et d'autre de l'axe : " + M(d + " + " + b + " = " + (d + b)) + " m."); },
      () => { const L = R.int(4, 9), l = dec1(2, Math.min(L - 0.5, 6));
        return PX("rectangle-double", "Le rectangle ABCD a pour longueur " + M("AB = " + L) + " cm et pour largeur " + M("BC = " + N(l)) + " cm. On trace son symétrique par rapport à la droite (BC) : avec le rectangle de départ, il forme un grand rectangle.",
          [["a) Longueur AA' (cm)", 2 * L], ["b) Périmètre du grand rectangle (cm)", 4 * L + 2 * l], ["c) Aire du grand rectangle (cm²)", 2 * L * l]],
          ["A' est le symétrique de A : B est le milieu de [AA'].", "Le grand rectangle mesure " + 2 * L + " cm sur " + D(l) + " cm."],
          "a) " + M("AA' = 2 \\times " + L + " = " + 2 * L) + " cm ; b) " + M("2 \\times (" + 2 * L + " + " + N(l) + ") = " + N(4 * L + 2 * l)) + " cm ; c) " + M(2 * L + " \\times " + N(l) + " = " + N(2 * L * l)) + " cm²."); },
    ],
    mediatrice: [
      () => { const ab = R.int(6, 14), r = R.int(Math.floor(ab / 2) + 2, ab + 2), bc = R.int(Math.max(4, ab - 4), Math.min(2 * r - 2, ab + 6));
        return PX("puits", "Trois maisons A, B et C forment un triangle. On veut creuser un puits P à égale distance des trois maisons. On mesure " + M("AB = " + ab) + " m, " + M("BC = " + bc) + " m et la distance " + M("PA = " + r) + " m.",
          [["a) Distance PB (m)", r], ["b) Périmètre du triangle PAB (m)", 2 * r + ab], ["c) Périmètre du triangle PBC (m)", 2 * r + bc]],
          ["P est sur la médiatrice de [AB] et sur celle de [BC] : c'est le centre du cercle qui passe par A, B et C.", "Équidistant des trois : PA = PB = PC."],
          "a) " + M("PB = PA = " + r) + " m ; b) " + M(r + " + " + r + " + " + ab + " = " + (2 * r + ab)) + " m ; c) " + M("PB = PC = " + r) + " : " + M(r + " + " + r + " + " + bc + " = " + (2 * r + bc)) + " m."); },
      () => { const ab = R.int(4, 12), x = dec1(ab / 2 + 1, ab + 3);
        return PX("salle-villages", "Deux villages A et B sont distants de " + M(ab) + " km. Ils construisent une salle de sport commune M, à la même distance des deux villages, à " + M(N(x)) + " km de A. On note I le milieu de [AB].",
          [["a) Distance MB (km)", x], ["b) Distance AI (km)", ab / 2], ["c) Longueur du trajet A → M → B (km)", 2 * x]],
          ["M est à égale distance de A et de B : il est sur la médiatrice de [AB].", "La médiatrice passe par le milieu I de [AB]."],
          "a) " + M("MB = MA = " + N(x)) + " km ; b) " + M("AI = " + ab + " \\div 2 = " + N(ab / 2)) + " km ; c) " + M(N(x) + " + " + N(x) + " = " + N(2 * x)) + " km."); },
      () => { const t = R.int(30, 60), c = R.int(Math.floor(t / 2) + 5, t), d = R.int(c + 15, c + 40), w = who();
        return PX("cerf-volant", w + " fabrique un cerf-volant ACBD. La baguette transversale [AB] mesure " + M(t) + " cm ; les points C et D sont sur la médiatrice de [AB], de part et d'autre. " + M("CA = " + c) + " cm et " + M("DA = " + d) + " cm.",
          [["a) Longueur CB (cm)", c], ["b) Longueur DB (cm)", d], ["c) Longueur de ficelle pour faire le tour ACBD (cm)", 2 * c + 2 * d]],
          ["Un point de la médiatrice de [AB] est à égale distance de A et de B.", "Le tour : AC + CB + BD + DA."],
          "a) " + M("CB = CA = " + c) + " cm ; b) " + M("DB = DA = " + d) + " cm ; c) " + M(c + " + " + c + " + " + d + " + " + d + " = " + (2 * c + 2 * d)) + " cm."); },
    ],
    echelle6: [
      () => { const [s, T, v] = pk([[25000, R.int(3, 8), 4], [50000, R.int(5, 12), 4], [25000, R.int(4, 9), 5]]), tot = (T * 100000) / s;
        let a, b, c; for (let k = 0; k < 40; k++) { a = dec1(tot / 5, tot / 2); b = dec1(tot / 6, tot / 2.5); c = rnd(tot - a - b, 6); if (c >= tot / 6) break; }
        if (!(c >= tot / 6)) { a = rnd(tot / 2, 1); b = rnd(tot / 4, 1); c = rnd(tot - a - b, 6); }
        const mn = (60 * T) / v;
        return PX("carte-rando", "Sur une carte au " + M("1/" + N(s)) + ", " + who() + " trace son parcours de randonnée : " + M(N(a)) + " cm, puis " + M(N(b)) + " cm, puis " + M(N(c)) + " cm.",
          [["a) Longueur du parcours sur la carte (cm)", tot], ["b) Longueur réelle (km)", T], ["c) Durée à " + v + " km/h (minutes)", mn]],
          ["Additionne, puis multiplie par " + N(s).replace("\\,", " ") + " (cm), et convertis : 1 km = 100 000 cm.", "À " + v + " km/h, 1 km prend " + 60 / v + " minutes."],
          "a) " + M(N(a) + " + " + N(b) + " + " + N(c) + " = " + N(tot)) + " cm ; b) " + M(N(tot) + " \\times " + N(s) + " = " + N(tot * s)) + " cm = " + M(N(T)) + " km ; c) " + M(N(T) + " \\times " + 60 / v + " = " + N(mn)) + " minutes."); },
      () => { const s = pk([50, 100]), room = pk(["le salon", "la chambre", "la cuisine", "la salle de jeux"]), Lr = pk(s === 50 ? [3.5, 4, 4.5, 5, 5.5, 6] : [4, 5, 6, 7, 8]), lr = pk([2.5, 3, 3.5, 4].filter((x) => x < Lr)), Lp = (Lr * 100) / s, lp = (lr * 100) / s;
        return PX("plan-maison", "Sur le plan d'un appartement au " + M("1/" + s) + ", " + room + " est un rectangle de " + M(N(Lp)) + " cm sur " + M(N(lp)) + " cm.",
          [["a) Longueur réelle (m)", Lr], ["b) Largeur réelle (m)", lr], ["c) Aire réelle de la pièce (m²)", Lr * lr]],
          ["1 cm sur le plan représente " + s + " cm, soit " + D(s / 100) + " m, en réalité.", "Aire d'un rectangle : longueur × largeur, avec les mesures réelles."],
          "a) " + M(N(Lp) + " \\times " + s + " = " + N(Lr * 100)) + " cm = " + M(N(Lr)) + " m ; b) " + M(N(lp) + " \\times " + s + " = " + N(lr * 100)) + " cm = " + M(N(lr)) + " m ; c) " + M(N(Lr) + " \\times " + N(lr) + " = " + N(Lr * lr)) + " m²."); },
      () => { const [obj, s, Lr, h, pr] = pk([["d'un paquebot", 400, 4 * R.int(50, 80), ["la cheminée", "de la cheminée"], [5, 6, 7, 8]], ["d'un voilier", 100, R.int(14, 25), ["le mât", "du mât"], [12, 14, 15, 16]], ["d'un avion de ligne", 200, 2 * R.int(15, 35), ["la dérive", "de la dérive"], [4, 5, 6]], ["d'un pont", 500, 5 * R.int(40, 90), ["une pile", "d'une pile"], [4, 6, 8]]]), Lm = (Lr * 100) / s, hm = pk(pr), hr = (hm * s) / 100, s2 = s / 2;
        return PX("maquette", "On construit la maquette " + obj + " au " + M("1/" + s) + ". En réalité, il mesure " + M(N(Lr)) + " m de long. Sur la maquette, " + h[0] + " mesure " + M(N(hm)) + " cm.",
          [["a) Longueur de la maquette (cm)", Lm], ["b) Hauteur réelle " + h[1] + " (m)", hr], ["c) Longueur d'une maquette deux fois plus grande, au 1/" + s2 + " (cm)", 2 * Lm]],
          ["Réel → maquette : divise par " + s + " (en cm : " + N(Lr) + " m = " + N(Lr * 100).replace("\\,", " ") + " cm).", "Maquette → réel : multiplie par " + s + ", puis convertis en m."],
          "a) " + M(N(Lr * 100) + " \\div " + s + " = " + N(Lm)) + " cm ; b) " + M(N(hm) + " \\times " + s + " = " + N(hr * 100)) + " cm = " + M(N(hr)) + " m ; c) au " + M("1/" + s2) + " : " + M(N(Lr * 100) + " \\div " + s2 + " = " + N(2 * Lm)) + " cm."); },
    ],
    proba6: [
      () => { let r, b, v, T, t, x; for (let k = 0; k < 200; k++) { t = pk([0.25, 0.2, 0.5, 0.4]); r = R.int(2, 8); const Tp = r / t; if (!Number.isInteger(Tp) || Tp <= r + 1) continue; x = R.int(2, 6); T = Tp + x; if (!smooth(T)) continue; v = R.int(x + 1, T - r - 1); b = T - r - v; if (b >= 1 && v > x) break; T = 0; }
        if (!T) { r = 4; b = 6; v = 10; T = 20; t = 0.25; x = 4; }
        const C = pk([{ o: "billes", s: "un sac", a: "rouges", A: "une bille rouge", b: "bleues", c: "vertes", Cn: "une bille verte", pa: "bille rouge" }, { o: "jetons", s: "une boîte", a: "jaunes", A: "un jeton jaune", b: "noirs", c: "blancs", Cn: "un jeton blanc", pa: "jeton jaune" }, { o: "bonbons", s: "un sachet", a: "à la fraise", A: "un bonbon à la fraise", b: "au citron", c: "à la menthe", Cn: "un bonbon à la menthe", pa: "bonbon à la fraise" }]);
        return PX("sac-" + C.o, (C.s[0].toUpperCase() + C.s.slice(1)) + " contient " + r + " " + C.o + " " + C.a + ", " + b + " " + C.o + " " + C.b + " et " + v + " " + C.o + " " + C.c + ". On en tire un au hasard.",
          [["a) Probabilité de tirer " + C.A + " (décimal ou fraction)", r / T], ["b) Probabilité de ne pas tirer " + C.Cn + " (décimal ou fraction)", (r + b) / T], ["c) Nombre de " + C.o + " " + C.c + " à retirer pour que la probabilité de tirer " + C.A + " soit " + D(t), x]],
          ["Il y a " + T + " " + C.o + ". P = issues favorables ÷ issues possibles.", "c) Les " + r + " " + C.o + " " + C.a + " doivent représenter " + D(t) + " du total : " + r / t + " " + C.o + " en tout."],
          "a) " + M(fr(r, T) + " = " + N(r / T)) + " ; b) " + M(fr(r + b, T) + " = " + N((r + b) / T)) + " ; c) il faut " + M(N(r) + " \\div " + N(t) + " = " + r / t) + " " + C.o + " en tout : on en retire " + M(T + " - " + r / t + " = " + x) + "."); },
      () => { const n = pk([8, 10, 20]), r = R.int(1, Math.floor(n / 4)), j = R.int(1, Math.floor(n / 4)), bl = n - r - j, x = R.int(1, Math.min(bl - 1, Math.floor(n / 4))), t = (r + x) / n;
        return PX("roue", "Une roue de loterie est partagée en " + n + " secteurs égaux : " + r + " rouge" + (r > 1 ? "s" : "") + ", " + j + " jaune" + (j > 1 ? "s" : "") + " et les autres bleus. On fait tourner la roue.",
          [["a) Probabilité de tomber sur le rouge (décimal ou fraction)", r / n], ["b) Probabilité de ne pas tomber sur le bleu (décimal ou fraction)", (r + j) / n], ["c) Combien de secteurs bleus faut-il repeindre en rouge pour que P(rouge) = " + D(t) + " ?", x]],
          ["Il y a " + bl + " secteurs bleus.", "c) P(rouge) = " + D(t) + " correspond à " + D(t) + " × " + n + " secteurs rouges."],
          "a) " + M(fr(r, n) + " = " + N(r / n)) + " ; b) " + (r + j) + " secteurs ne sont pas bleus : " + M(fr(r + j, n) + " = " + N((r + j) / n)) + " ; c) il faut " + M(N(t) + " \\times " + n + " = " + (r + x)) + " secteurs rouges : on en repeint " + M((r + x) + " - " + r + " = " + x) + "."); },
      () => { const n = pk([20, 25, 40, 50]), m = pk([2, 4, 5, 10].filter((u) => u !== n)), k = R.int(Math.floor(n / 2), n - 3), nm = Math.floor(n / m);
        return PX("cartes-numeros", "Une boîte contient " + n + " cartes numérotées de 1 à " + n + ". On tire une carte au hasard.",
          [["a) Probabilité d'obtenir un multiple de " + m + " (décimal ou fraction)", nm / n], ["b) Probabilité d'obtenir un nombre supérieur ou égal à " + k + " (décimal ou fraction)", (n - k + 1) / n], ["c) On retire toutes les cartes multiples de " + m + ". Combien de cartes reste-t-il ?", n - nm]],
          ["Compte les multiples de " + m + " entre 1 et " + n + " : " + m + ", " + 2 * m + ", " + 3 * m + "…", "De " + k + " à " + n + ", il y a " + n + " − " + k + " + 1 nombres."],
          "a) " + nm + " multiples de " + m + " : " + M(fr(nm, n) + " = " + N(nm / n)) + " ; b) " + (n - k + 1) + " cartes de " + k + " à " + n + " : " + M(fr(n - k + 1, n) + " = " + N((n - k + 1) / n)) + " ; c) " + M(n + " - " + nm + " = " + (n - nm)) + " cartes."); },
    ],
    empil: [
      () => { const n1 = pk([3, 4]), n2 = R.int(5, 7), sq = (n) => (n * (n + 1) * (2 * n + 1)) / 6, ls = (n) => Array.from({ length: n }, (_, i) => (i + 1) * (i + 1)).join(" + ");
        return PX("pyramide-cubes", "On construit une pyramide de cubes à étages carrés : l'étage du haut a 1 cube, celui du dessous 2 × 2 cubes, puis 3 × 3, et ainsi de suite.",
          [["a) Cubes d'une pyramide de " + n1 + " étages", sq(n1)], ["b) Cubes d'une pyramide de " + n2 + " étages", sq(n2)], ["c) Carrés de la vue de dessus (" + n2 + " étages)", n2 * n2]],
          ["Additionne les carrés 1² + 2² + 3² + …", "Vue de dessus : les étages du haut sont posés sur celui du bas, on ne voit que la surface de l'étage du bas."],
          "a) " + M(ls(n1) + " = " + sq(n1)) + " ; b) " + M(ls(n2) + " = " + sq(n2)) + " ; c) la vue de dessus a la taille de l'étage du bas : " + M(n2 + " \\times " + n2 + " = " + n2 * n2) + " carrés."); },
      () => { const n = R.int(4, 8), p = R.int(2, 4), tr = (n * (n + 1)) / 2;
        return PX("escalier-cubes", "On construit un escalier de " + n + " marches avec des cubes : la 1re marche est haute de 1 cube, la 2e de 2 cubes, et ainsi de suite ; l'escalier a " + p + " cubes de largeur.",
          [["a) Carrés de la vue de côté (le profil de l'escalier)", tr], ["b) Nombre de cubes de l'escalier", p * tr], ["c) Carrés de la vue de dessus", n * p]],
          ["Vue de côté : 1 + 2 + 3 + … + " + n + " carrés.", "Chaque carré du profil correspond à une rangée de " + p + " cubes."],
          "a) " + M(Array.from({ length: n }, (_, i) => i + 1).join(" + ") + " = " + tr) + " ; b) " + M(tr + " \\times " + p + " = " + p * tr) + " cubes ; c) vue de dessus : " + n + " marches de " + p + " carrés, " + M(n + " \\times " + p + " = " + n * p) + "."); },
      () => { const c = R.int(4, 7), h = R.int(3, 8), e = 4 * (c - 1);
        return PX("tour-creuse", "Une tour creuse est faite de cubes : chaque étage est le contour d'un carré de " + c + " cubes de côté (vide au milieu), et la tour a " + h + " étages.",
          [["a) Cubes d'un étage", e], ["b) Cubes de la tour", e * h], ["c) Cubes à ajouter pour la remplir entièrement", (c - 2) * (c - 2) * h]],
          ["Un étage : 4 côtés de " + c + " cubes, mais les 4 coins sont comptés deux fois.", "Le vide au milieu est un carré de " + (c - 2) + " cubes de côté, sur " + h + " étages."],
          "a) " + M("4 \\times " + c + " - 4 = " + e) + " ; b) " + M(e + " \\times " + h + " = " + e * h) + " ; c) " + M((c - 2) + " \\times " + (c - 2) + " \\times " + h + " = " + (c - 2) * (c - 2) * h) + " cubes."); },
    ],
    compdiff: [
      () => { const prod = pk(["café", "fromage", "chocolat", "thé"]); let pa = 24, pb = 25; for (let k = 0; k < 60; k++) { const b = pk([16, 20, 25, 40, 50]), a = rnd(b * pk([0.8, 0.85, 0.88, 0.9, 0.92, 0.95, 0.96, 1.04, 1.05, 1.08, 1.1, 1.12, 1.2, 1.25]), 6); if (Number.isInteger(a) && a !== b) { pa = a; pb = b; break; } }
        const mA = pk([250, 400, 500, 750, 200]), mB = pk([250, 400, 500, 1000, 200].filter((u) => u !== mA)), prA = rnd((pa * mA) / 1000, 2), prB = rnd((pb * mB) / 1000, 2), q = rnd(pa / pb, 4), eu = (v) => M(em(v)) + " €";
        return PX("prix-kg-" + prod, "Au rayon " + prod + ", on compare deux paquets : A coûte " + eu(prA) + " pour " + M(mA) + " g, B coûte " + eu(prB) + " pour " + M(mB) + " g.",
          [["a) Prix de A au kg (€)", pa], ["b) Prix de B au kg (€)", pb], ["c) Quotient prix de A ÷ prix de B, au kg", q]],
          ["Prix au kg = prix ÷ masse en kg.", "c) Un quotient inférieur à 1 : A est moins cher au kilo ; supérieur à 1 : plus cher."],
          "a) " + M(em(prA) + " \\div " + N(mA / 1000) + " = " + N(pa)) + " € ; b) " + M(em(prB) + " \\div " + N(mB / 1000) + " = " + N(pb)) + " € ; c) " + M("\\frac{" + N(pa) + "}{" + N(pb) + "} = " + N(q) + (q < 1 ? " < 1" : " > 1")) + " : A est " + N(Math.abs(rnd((1 - q) * 100, 2))).replace("{,}", ",") + " % " + (q < 1 ? "moins" : "plus") + " cher au kilo."); },
      () => { const p1 = 100 * R.int(80, 400), k1 = pk([1.04, 1.05, 1.06, 1.08]), q1 = 100 * R.int(10, 40), k2 = pk([1.15, 1.2, 1.25, 1.3]), p2 = Math.round(p1 * k1), q2 = Math.round(q1 * k2);
        return PX("population", "En dix ans, la ville A est passée de " + M(N(p1)) + " à " + M(N(p2)) + " habitants, et le village B de " + M(N(q1)) + " à " + M(N(q2)) + " habitants.",
          [["a) Augmentation de A (habitants)", p2 - p1], ["b) Augmentation de B (habitants)", q2 - q1], ["c) Quotient nouvelle population ÷ ancienne pour B", k2]],
          ["Comparer par différence : nouvelle − ancienne.", "Comparer par quotient : nouvelle ÷ ancienne ; c'est le coefficient multiplicateur."],
          "a) " + M(N(p2) + " - " + N(p1) + " = " + N(p2 - p1)) + " ; b) " + M(N(q2) + " - " + N(q1) + " = " + N(q2 - q1)) + " ; c) " + M(N(q2) + " \\div " + N(q1) + " = " + N(k2)) + " (+ " + Math.round((k2 - 1) * 100) + " %, contre + " + Math.round((k1 - 1) * 100) + " % pour A) : A gagne plus d'habitants, mais B grandit plus vite."); },
      () => { const cA = pk([5.5, 6, 6.4, 7, 7.5, 8]), cB = pk([4, 4.5, 5, 5.2, 5.6].filter((u) => u < cA - 0.3)), dA = pk([250, 400, 500, 600, 800]), dB = pk([250, 400, 500, 600, 800].filter((u) => u !== dA)), lA = rnd((cA * dA) / 100, 2), lB = rnd((cB * dB) / 100, 2);
        return PX("consommation", "La voiture A a consommé " + M(N(lA)) + " L d'essence pour " + M(dA) + " km, la voiture B " + M(N(lB)) + " L pour " + M(dB) + " km.",
          [["a) Consommation de A aux 100 km (L)", cA], ["b) Consommation de B aux 100 km (L)", cB], ["c) Différence des consommations aux 100 km, A − B (L)", rnd(cA - cB, 6)]],
          ["Aux 100 km : litres ÷ km × 100.", "On ne compare les litres consommés qu'à distance égale."],
          "a) " + M(N(lA) + " \\div " + dA + " \\times 100 = " + N(cA)) + " L ; b) " + M(N(lB) + " \\div " + dB + " \\times 100 = " + N(cB)) + " L ; c) " + M(N(cA) + " - " + N(cB) + " = " + N(rnd(cA - cB, 6))) + " L : B consomme moins."); },
    ],
    posrelc: [
      () => { const r1 = R.int(-3, 3), w = pk([2, 4, 6]), r2 = r1 + w, m = pk([-3, -2, -1, 1, 2, 3]), p = R.int(-4, 4), b = m - (r1 + r2), c = r1 * r2 + p, mn = -((w / 2) ** 2);
        return PX("parabole-droite", "Soit " + M("f(x) = " + pw(1, b, c)) + " et " + M("g(x) = " + lw(m, p)) + ". On étudie " + M("d(x) = f(x) - g(x)") + " pour comparer les courbes de f et g.",
          [["a) Plus petite abscisse d'un point commun", r1], ["b) Plus grande abscisse d'un point commun", r2], ["c) Valeur minimale de d(x)", mn]],
          ["d(x) = " + pw(1, -(r1 + r2), r1 * r2).replace(/\^2/, "²").replace(/-/g, "−") + " : cherche ses racines.", "Le minimum d'un trinôme est atteint au milieu des racines, ici en x = " + String((r1 + r2) / 2).replace("-", "−") + "."],
          "a) et b) " + M("d(x) = " + pw(1, -(r1 + r2), r1 * r2) + " = (x " + (r1 < 0 ? "+ " + -r1 : "- " + r1) + ")(x " + (r2 < 0 ? "+ " + -r2 : "- " + r2) + ")").replace("(x - 0)", "x") + " s'annule en " + M(r1) + " et " + M(r2) + " ; la courbe de f est au-dessous de celle de g entre ces deux valeurs ; c) " + M("d(" + (r1 + r2) / 2 + ") = " + mn) + "."); },
      () => { const r1 = R.int(-3, 2), w = pk([2, 4]), r2 = r1 + w, u = R.int(-3, 3), v = R.int(-2, 5), s = r1 + r2, P0 = r1 * r2, b = u - 2 * s, c = v + 2 * P0, mn = -2 * (w / 2) ** 2;
        return PX("deux-paraboles", "Soit " + M("f(x) = " + pw(1, b, c)) + " et " + M("g(x) = " + pw(-1, u, v)) + ". On étudie la position relative des deux paraboles.",
          [["a) Plus petite abscisse d'un point d'intersection", r1], ["b) Plus grande abscisse d'un point d'intersection", r2], ["c) Valeur minimale de f(x) − g(x)", mn]],
          ["f(x) − g(x) = " + pw(2, -2 * s, 2 * P0).replace(/\^2/, "²").replace(/-/g, "−") + " = 2(" + pw(1, -s, P0).replace(/\^2/, "²").replace(/-/g, "−") + ").", "Le minimum est atteint en x = " + String(s / 2).replace("-", "−") + ", au milieu des racines."],
          "a) et b) " + M("f(x) - g(x) = " + pw(2, -2 * s, 2 * P0) + " = 2(x " + (r1 < 0 ? "+ " + -r1 : "- " + r1) + ")(x " + (r2 < 0 ? "+ " + -r2 : "- " + r2) + ")").replace("(x - 0)", "x") + " : intersections en " + M(r1) + " et " + M(r2) + " ; c) en " + M("x = " + s / 2) + " : " + M("2 \\times (" + -w / 2 + ") \\times " + w / 2 + " = " + mn) + "."); },
      () => { const r1 = R.int(1, 4), w = pk([2, 4, 6]), r2 = r1 + w, m = R.int(r1 + r2 + 1, r1 + r2 + 6), al = m - r1 - r2, bmax = (w / 2) ** 2;
        return PX("benefice", "Une entreprise fabrique x centaines d'objets (" + M("0 \\leqslant x \\leqslant 12") + "). Le coût de production est " + M("C(x) = " + pw(1, al, r1 * r2)) + " et la recette " + M("R(x) = " + m + "x") + ", en milliers d'euros.",
          [["a) Plus petite production (en centaines) pour laquelle R(x) = C(x)", r1], ["b) Plus grande production (en centaines) pour laquelle R(x) = C(x)", r2], ["c) Bénéfice maximal R(x) − C(x) (en milliers d'euros)", bmax]],
          ["R(x) − C(x) = " + pw(-1, r1 + r2, -r1 * r2).replace(/\^2/, "²").replace(/-/g, "−") + " : la courbe de R est au-dessus de celle de C entre ses racines.", "Le maximum est atteint au milieu des racines."],
          "a) et b) " + M("R(x) - C(x) = " + pw(-1, r1 + r2, -r1 * r2) + " = -(x - " + r1 + ")(x - " + r2 + ")") + " : " + M("R = C") + " pour " + M("x = " + r1) + " et " + M("x = " + r2) + " ; bénéfice entre les deux ; c) en " + M("x = " + (r1 + r2) / 2) + " : " + M("-(" + (r1 + r2) / 2 + " - " + r1 + ")(" + (r1 + r2) / 2 + " - " + r2 + ") = " + bmax) + (bmax === 1 ? " millier" : " milliers") + " d'euros."); },
    ],
    intmaj: [
      () => { const [f, a, b, fa, fb] = pk([["\\sqrt{1 + x^3}", 0, 2, 1, 3], ["\\sqrt{9 + x^2}", 0, 4, 3, 5], ["\\sqrt{16 + x^2}", 0, 3, 4, 5], ["\\sqrt{36 + x^2}", 0, 8, 6, 10], ["\\sqrt{64 + x^2}", 0, 6, 8, 10]]), L = b - a;
        return PX("croissante-amplitude", "Soit " + M("I = \\int_{" + a + "}^{" + b + "} " + f + "\\,dx") + ". La fonction " + M("x \\mapsto " + f) + " est croissante sur " + M("[" + a + " \\,;\\, " + b + "]") + ".",
          [["a) Valeur de la fonction en " + a, fa], ["b) Valeur de la fonction en " + b, fb], ["c) Amplitude de l'encadrement obtenu (majorant − minorant)", L * (fb - fa)]],
          ["Croissante : f(" + a + ") ≤ f(x) ≤ f(" + b + ").", "Intègre l'encadrement sur un intervalle de longueur " + L + "."],
          "a) " + M(fa) + " ; b) " + M(fb) + " ; c) " + M(L * fa + " \\leqslant I \\leqslant " + L * fb) + ", amplitude " + M(L * fb + " - " + L * fa + " = " + L * (fb - fa)) + "."); },
      () => { const [f, a, b, fa, fb] = pk([["\\frac{1}{1 + x^2}", 0, 1, 1, 0.5], ["\\frac{1}{1 + x^2}", 0, 2, 1, 0.2], ["\\frac{1}{1 + x^2}", 0, 3, 1, 0.1], ["\\frac{6}{1 + x}", 1, 5, 3, 1], ["\\frac{12}{x + 2}", 0, 4, 6, 2], ["\\frac{10}{x^2 + 1}", 1, 3, 5, 1], ["\\frac{8}{x^2 + 4}", 0, 2, 2, 1]]), L = b - a, lo = rnd(L * fb, 9), hi = rnd(L * fa, 9);
        return PX("decroissante-centre", "Soit " + M("J = \\int_{" + a + "}^{" + b + "} " + f + "\\,dx") + ". La fonction " + M("x \\mapsto " + f) + " est décroissante sur " + M("[" + a + " \\,;\\, " + b + "]") + ".",
          [["a) Minorant de J obtenu", lo], ["b) Majorant de J obtenu", hi], ["c) Centre de l'encadrement (valeur approchée de J)", rnd((lo + hi) / 2, 9)]],
          ["Décroissante : f(" + b + ") ≤ f(x) ≤ f(" + a + ") sur l'intervalle.", "Multiplie par la longueur de l'intervalle, " + L + "."],
          "Sur " + M("[" + a + " \\,;\\, " + b + "]") + " : " + M(N(fb) + " \\leqslant " + f + " \\leqslant " + N(fa)) + ", donc a) " + M(L + " \\times " + N(fb) + " = " + N(lo)) + " ; b) " + M(L + " \\times " + N(fa) + " = " + N(hi)) + " ; c) " + M("\\frac{" + N(lo) + " + " + N(hi) + "}{2} = " + N(rnd((lo + hi) / 2, 9))) + "."); },
      () => { const c = R.int(1, 3), k = pk([2, 3, 4]), T = k * k;
        return PX("debit-source", "Le débit d'une source (en L/min) vaut " + M("d(t) = " + c + " + \\sqrt{t}") + ", où t est le temps en minutes. Le volume écoulé entre 0 et " + T + " minutes est " + M("V = \\int_0^{" + T + "} d(t)\\,dt") + ".",
          [["a) Débit au départ (L/min)", c], ["b) Débit au bout de " + T + " minutes (L/min)", c + k], ["c) Majorant de V obtenu avec le débit maximal (L)", T * (c + k)]],
          ["d est croissante sur [0 ; " + T + "] : d(0) ≤ d(t) ≤ d(" + T + ").", "Intègre sur " + T + " minutes."],
          "a) " + M("d(0) = " + c) + " ; b) " + M("d(" + T + ") = " + c + " + " + k + " = " + (c + k)) + " ; c) " + M(T + " \\times " + c + " \\leqslant V \\leqslant " + T + " \\times " + (c + k) + " = " + T * (c + k)) + " L."); },
    ],
    suiteint: [
      () => { const k = R.int(0, 3), I = (n) => 1 / (n + 1) - 2 / (n + 2) + 1 / (n + 3), Is = (n) => fr(2, (n + 1) * (n + 2) * (n + 3)), wr = (n) => M("I_{" + n + "} = \\frac{1}{" + (n + 1) + "} - \\frac{2}{" + (n + 2) + "} + \\frac{1}{" + (n + 3) + "} = " + Is(n));
        return PX("x-n-1-x-carre", "Soit " + M("I_n = \\int_0^{\\,1} x^n(1 - x)^2\\,dx") + " (n ≥ 0).",
          [["a) " + M("I_{" + k + "}") + " (fraction)", I(k)], ["b) " + M("I_{" + (k + 1) + "}") + " (fraction)", I(k + 1)], ["c) " + M("I_{" + (k + 2) + "}") + " (fraction)", I(k + 2)]],
          ["Développe xⁿ(1 − x)² = xⁿ − 2xⁿ⁺¹ + xⁿ⁺².", "Iₙ = 1/(n + 1) − 2/(n + 2) + 1/(n + 3)."],
          "a) " + wr(k) + " ; b) " + wr(k + 1) + " ; c) " + wr(k + 2) + " : la suite décroît vers 0."); },
      () => { const k = R.int(1, 4), s = pk([50, 100, 200, 500]), I = (n) => 1 / ((n + 1) * (n + 2)); let n0 = 0; while ((n0 + 1) * (n0 + 2) <= s) n0++;
        return PX("x-n-1-x-seuil", "Soit " + M("I_n = \\int_0^{\\,1} x^n(1 - x)\\,dx") + " (n ≥ 0).",
          [["a) " + M("I_{" + k + "}") + " (fraction)", I(k)], ["b) " + M("I_{" + (k + 1) + "}") + " (fraction)", I(k + 1)], ["c) Plus petit entier n tel que " + M("I_n < \\frac{1}{" + s + "}"), n0]],
          ["Iₙ = 1/(n + 1) − 1/(n + 2) = 1/((n + 1)(n + 2)).", "c) Il faut (n + 1)(n + 2) > " + s + "."],
          "a) " + M("I_{" + k + "} = \\frac{1}{" + (k + 1) * (k + 2) + "}") + " ; b) " + M("I_{" + (k + 1) + "} = \\frac{1}{" + (k + 2) * (k + 3) + "}") + " ; c) " + M("(n + 1)(n + 2) > " + s) + " : pour " + M("n = " + (n0 - 1)) + ", " + M(n0 * (n0 + 1) + " \\leqslant " + s) + " ; pour " + M("n = " + n0) + ", " + M((n0 + 1) * (n0 + 2) + " > " + s) + ". Donc " + M("n = " + n0) + "."); },
      () => { const a = R.int(1, 3), k = R.int(1, 4), I = (n) => a / (n + 1) + 1 / (n + 2), Is = (n) => fr(a * (n + 2) + n + 1, (n + 1) * (n + 2)), ex = a === 1 ? "1 + x" : a + " + x";
        return PX("x-n-a-plus-x", "Soit " + M("I_n = \\int_0^{\\,1} x^n(" + ex + ")\\,dx") + " (n ≥ 0).",
          [["a) " + M("I_{" + k + "}") + " (fraction)", I(k)], ["b) " + M("I_{" + (k + 1) + "}") + " (fraction)", I(k + 1)], ["c) Limite de " + M("n I_n") + " quand n tend vers l'infini", a + 1]],
          ["Iₙ = " + a + "/(n + 1) + 1/(n + 2).", "c) n × " + a + "/(n + 1) tend vers " + a + ", et n/(n + 2) vers 1."],
          "a) " + M("I_{" + k + "} = \\frac{" + a + "}{" + (k + 1) + "} + \\frac{1}{" + (k + 2) + "} = " + Is(k)) + " ; b) " + M("I_{" + (k + 1) + "} = \\frac{" + a + "}{" + (k + 2) + "} + \\frac{1}{" + (k + 3) + "} = " + Is(k + 1)) + " ; c) " + M("nI_n = \\frac{" + a + "n}{n + 1} + \\frac{n}{n + 2} \\to " + a + " + 1 = " + (a + 1)) + "."); },
    ],
  };

  reg([
    { id: "symax", theme: "es", label: "Symétrie axiale", ex: "A \\to A' : (d) \\text{ médiatrice de } [AA']", FR: [6], againFR: [7], g: SA, probs: PROBS.symax,
      hint: "Le symétrique de A par rapport à (d) est sur la perpendiculaire à (d) passant par A, à la même distance de (d), de l'autre côté. La symétrie conserve longueurs, angles, aires. Un axe de symétrie d'une figure la partage en deux moitiés superposables par pliage.",
      comps: ["Axes d'une figure, conservation des longueurs et des angles", "Symétrique sur une droite graduée, moitié de figure, triangle isocèle", "Deux symétries, compléter une figure, recoller"],
      lesson: ["Symétrie axiale", "Deux figures symétriques par rapport à une droite \\((d)\\) se superposent quand on plie le long de \\((d)\\).",
        "Le symétrique \\(A'\\) du point \\(A\\) par rapport à \\((d)\\) : \\((d)\\) est perpendiculaire à \\([AA']\\) et passe par son milieu (c'est la médiatrice de \\([AA']\\)). Un point de \\((d)\\) est son propre symétrique. La symétrie axiale conserve les longueurs, les angles, les périmètres et les aires. Une droite est un axe de symétrie d'une figure si la figure est sa propre symétrique.",
        ["Un rectangle a 2 axes de symétrie, un carré 4, un triangle équilatéral 3.", "\\(A\\) d'abscisse 2,4 et \\((d)\\) en 5 : \\(A'\\) a pour abscisse \\(5 + 2{,}6 = 7{,}6\\)."],
        "Les diagonales d'un rectangle (non carré) ne sont pas des axes de symétrie."] },
    { id: "mediatrice", theme: "es", label: "Médiatrice d'un segment", ex: "M \\in (d) \\iff MA = MB", FR: [6], againFR: [7], g: MD, probs: PROBS.mediatrice,
      hint: "La médiatrice de [AB] est la droite perpendiculaire à [AB] en son milieu. Un point est sur la médiatrice de [AB] si et seulement s'il est à la même distance de A et de B. Les trois médiatrices d'un triangle se coupent au centre du cercle circonscrit.",
      comps: ["Milieu, équidistance, périmètre", "Abscisse du milieu, triangle isocèle, cercle circonscrit", "Retrouver une longueur ou un point, cerf-volant"],
      lesson: ["Médiatrice d'un segment", "La médiatrice d'un segment est l'ensemble des points situés à égale distance de ses deux extrémités.",
        "La médiatrice de \\([AB]\\) est la droite perpendiculaire à \\([AB]\\) qui passe par son milieu \\(I\\). Propriété : \\(M\\) est sur la médiatrice de \\([AB]\\) si et seulement si \\(MA = MB\\) (le triangle \\(MAB\\) est alors isocèle en \\(M\\)). Les médiatrices des trois côtés d'un triangle se coupent en un point \\(O\\), centre du cercle qui passe par les trois sommets (cercle circonscrit).",
        ["\\(M\\) sur la médiatrice de \\([AB]\\), \\(MA = 4\\) cm, \\(AB = 3\\) cm : périmètre de \\(MAB\\) = \\(4 + 4 + 3 = 11\\) cm.", "\\(A\\) en 2, \\(B\\) en 8 sur une droite graduée : la médiatrice passe par 5."],
        "Pour qu'un point soit sur la médiatrice, il ne suffit pas qu'il soit « au milieu » : il doit être à égale distance de \\(A\\) et de \\(B\\)."] },
    { id: "echelle6", theme: "fa", label: "Échelles : plans, cartes, maquettes", ex: "\\frac{1}{200} : 3 \\text{ cm} \\to 6 \\text{ m}", FR: [6], againFR: [7], g: EC, probs: PROBS.echelle6,
      hint: "Échelle 1/n : 1 cm sur le plan représente n cm en réalité. Réel = plan × n ; plan = réel ÷ n. Mets les deux longueurs dans la même unité. 1 m = 100 cm, 1 km = 100 000 cm.",
      comps: ["Du plan à la réalité, carte, maquette", "De la réalité au plan, km, trouver l'échelle", "Deux longueurs, deux cartes, périmètre réel"],
      lesson: ["Échelles", "Sur un plan ou une carte, les longueurs sont proportionnelles aux longueurs réelles.",
        "Une échelle \\(\\frac{1}{n}\\) signifie que 1 cm sur le plan représente \\(n\\) cm en réalité. Longueur réelle = longueur sur le plan × \\(n\\) ; longueur sur le plan = longueur réelle ÷ \\(n\\). On exprime les deux longueurs dans la même unité (souvent le cm), puis on convertit : 1 m = 100 cm, 1 km = 100 000 cm. L'échelle se retrouve en divisant la longueur réelle par la longueur sur le plan (même unité).",
        ["Échelle \\(\\frac{1}{200}\\) : 3 cm sur le plan donnent \\(600\\) cm, soit 6 m.", "Carte au \\(\\frac{1}{25\\,000}\\) : 4 cm représentent \\(100\\,000\\) cm, soit 1 km."],
        "Convertis avant de diviser : un mur de 6 m représenté par 3 cm donne \\(600 \\div 3 = 200\\), pas \\(6 \\div 3 = 2\\)."] },
    { id: "proba6", theme: "no", label: "Probabilités : premiers pas", ex: "P = \\frac{\\text{issues favorables}}{\\text{issues possibles}}", FR: [6], againFR: [7], g: PR, probs: PROBS.proba6,
      hint: "Si toutes les issues ont la même chance (dé équilibré, tirage au hasard), P = nombre d'issues favorables ÷ nombre d'issues possibles. Une probabilité est comprise entre 0 (impossible) et 1 (certain). En répétant une expérience un grand nombre de fois, la fréquence se rapproche de la probabilité.",
      comps: ["Dé, sac, roue : issues équiprobables", "Lettres d'un mot, fréquence, retrouver un effectif", "Modifier une urne, nombre attendu, comparer deux probabilités"],
      lesson: ["Probabilités", "Une probabilité mesure la chance qu'un évènement se produise, par un nombre entre 0 et 1.",
        "Expérience aléatoire : on connaît les issues possibles, mais pas celle qui sortira. Si les issues ont toutes la même chance (on dit équiprobables) : \\(P = \\frac{\\text{nombre d'issues favorables}}{\\text{nombre d'issues possibles}}\\). Un évènement impossible a la probabilité 0, un évènement certain la probabilité 1. Quand on répète l'expérience un grand nombre de fois, la fréquence d'un résultat (effectif ÷ nombre d'essais) se rapproche de sa probabilité.",
        ["Dé équilibré : \\(P(\\text{pair}) = \\frac{3}{6} = \\frac{1}{2}\\).", "Sac de 3 rouges et 5 bleues : \\(P(\\text{rouge}) = \\frac{3}{8}\\)."],
        "On divise par le nombre total d'issues, pas par le nombre d'issues défavorables."] },
    { id: "empil", theme: "es", label: "Empilements de cubes, vues", ex: "\\text{vue de dessus, de face, de droite}", FR: [7], againFR: [8], g: EM, probs: PROBS.empil,
      hint: "Compte pile par pile (sans oublier les cubes du bas, cachés). Vue de dessus : un carré par pile. Vue de face : dans chaque colonne, la hauteur de la pile la plus haute. Vue de droite : même chose dans chaque rangée.",
      comps: ["Compter les cubes, vue de dessus, vue de face", "Compléter en pavé, vue de droite, grands empilements", "Trois vues, escaliers, compléter en cube"],
      lesson: ["Empilements de cubes", "Un empilement de cubes se décrit par sa vue en perspective ou par ses vues de dessus, de face et de côté.",
        "Pour compter les cubes, on compte pile par pile (les cubes du bas sont cachés mais présents). Vue de dessus : un carré par pile, quelle que soit sa hauteur (on peut y écrire la hauteur de chaque pile). Vue de face : dans chaque colonne, autant de carrés que la pile la plus haute. Vue de droite : de même pour chaque rangée. Pour compléter en pavé droit : nombre de cubes du pavé (longueur × largeur × hauteur) moins ceux déjà présents.",
        ["Vue de dessus avec les hauteurs 3, 1, 2, 2 : \\(3 + 1 + 2 + 2 = 8\\) cubes.", "Pavé \\(3 \\times 2 \\times 3 = 18\\) cubes ; avec 11 cubes déjà posés, il en manque 7."],
        "Sur une vue de face, les piles de derrière ne s'ajoutent pas à celles de devant : on garde la plus haute."] },
    { id: "compdiff", theme: "no", label: "Comparer par différence ou par quotient", ex: "A - B > 0 \\iff A > B", FR: [10, 1], againFR: [11], g: CD, probs: PROBS.compdiff,
      hint: "A > B ⇔ A − B > 0 : on calcule la différence et on étudie son signe. Si A et B sont strictement positifs : A > B ⇔ A/B > 1. Pour des nombres positifs, on peut aussi comparer leurs carrés.",
      comps: ["Différence de fractions, quotient de puissances, identité", "Quotient de grandeurs, différence carrée, comparer des carrés", "Évolutions successives, fractions en n, très grandes puissances"],
      lesson: ["Comparer deux nombres", "Pour comparer deux nombres, on étudie le signe de leur différence, ou on compare leur quotient à 1.",
        "\\(A > B \\iff A - B > 0\\). On réduit \\(A - B\\) au même dénominateur, on factorise ou on reconnaît un carré pour lire son signe. Si \\(A > 0\\) et \\(B > 0\\) : \\(A > B \\iff \\frac{A}{B} > 1\\) (utile pour des puissances ou des grandeurs). Pour des nombres positifs, \\(A > B \\iff A^2 > B^2\\).",
        ["\\(\\frac{7}{9} - \\frac{10}{13} = \\frac{91 - 90}{117} = \\frac{1}{117} > 0\\), donc \\(\\frac{7}{9} > \\frac{10}{13}\\).", "\\(x^2 + 9 - 6x = (x - 3)^2 \\geqslant 0\\), donc \\(x^2 + 9 \\geqslant 6x\\) pour tout \\(x\\)."],
        "Le quotient se compare à 1 seulement pour des nombres strictement positifs."] },
    { id: "posrelc", theme: "fa", label: "Position relative de deux courbes", ex: "f(x) - g(x) > 0 \\iff C_f \\text{ au-dessus}", FR: [11, 4], g: PC, probs: PROBS.posrelc,
      hint: "On étudie le signe de d(x) = f(x) − g(x) : là où d(x) > 0, C_f est au-dessus de C_g ; là où d(x) = 0, les courbes se coupent. Factorise d(x), fais un tableau de signes, ou étudie ses variations (minimum positif ⇒ toujours au-dessus).",
      comps: ["Différence affine, intersection, contact", "Parabole et droite, deux paraboles, exponentielle et droite", "Tangente qui recoupe, paramètre, tableau de signes"],
      lesson: ["Position relative de deux courbes", "Comparer deux fonctions, c'est étudier le signe de leur différence.",
        "On pose \\(d(x) = f(x) - g(x)\\). Si \\(d(x) > 0\\) sur un intervalle, la courbe \\(C_f\\) est au-dessus de \\(C_g\\) ; si \\(d(x) < 0\\), au-dessous ; les solutions de \\(d(x) = 0\\) sont les abscisses des points communs. On étudie le signe de \\(d\\) en factorisant (tableau de signes), ou par ses variations : si le minimum de \\(d\\) est positif, \\(C_f\\) est toujours au-dessus.",
        ["\\(f(x) = x^2\\), \\(g(x) = x + 2\\) : \\(d(x) = (x - 2)(x + 1)\\) ; \\(C_f\\) est au-dessous de la droite sur \\(]-1 \\,;\\, 2[\\).", "\\(e^x - (x + 1)\\) a pour minimum 0 (en 0) : la courbe de exp est au-dessus de sa tangente en 0."],
        "On compare les ordonnées \\(f(x)\\) et \\(g(x)\\) pour un même \\(x\\), pas les formules."] },
    { id: "intmaj", theme: "fa", label: "Majorer, encadrer une intégrale", ex: "m \\leqslant f \\leqslant M \\Rightarrow m(b - a) \\leqslant \\int_a^b f \\leqslant M(b - a)", FR: [12, 6], g: IM, probs: PROBS.intmaj,
      hint: "Croissance de l'intégrale (a ≤ b) : si f ≤ g sur [a ; b], alors ∫ f ≤ ∫ g. En particulier, m ≤ f ≤ M donne m(b − a) ≤ ∫ f ≤ M(b − a). Valeur moyenne : μ = (1/(b − a)) ∫ f. Méthode des rectangles : pour f monotone, les rectangles encadrent l'intégrale.",
      comps: ["Encadrement constant, fonction monotone, valeur moyenne", "Majorer par une fonction plus simple, comparer deux fonctions", "Rectangles, majorant d'une suite d'intégrales, seuil"],
      lesson: ["Majorer, encadrer une intégrale", "On encadre une intégrale qu'on ne sait pas calculer en encadrant la fonction.",
        "Pour \\(a \\leqslant b\\) : si \\(f(x) \\leqslant g(x)\\) sur \\([a \\,;\\, b]\\), alors \\(\\int_a^b f(x)\\,dx \\leqslant \\int_a^b g(x)\\,dx\\) (croissance de l'intégrale). En particulier, si \\(m \\leqslant f(x) \\leqslant M\\), alors \\(m(b - a) \\leqslant \\int_a^b f(x)\\,dx \\leqslant M(b - a)\\). La valeur moyenne de \\(f\\) sur \\([a \\,;\\, b]\\) est \\(\\mu = \\frac{1}{b - a}\\int_a^b f(x)\\,dx\\). Pour une fonction monotone, les rectangles « à gauche » et « à droite » encadrent l'intégrale.",
        ["Sur \\([0 \\,;\\, 1]\\), \\(e^{x^2} \\leqslant e^x\\), donc \\(\\int_0^{\\,1} e^{x^2}\\,dx \\leqslant e - 1\\).", "\\(0 \\leqslant \\frac{x^n}{1 + x} \\leqslant x^n\\) donne \\(0 \\leqslant I_n \\leqslant \\frac{1}{n + 1}\\), donc \\(I_n \\to 0\\)."],
        "On multiplie la borne par la longueur de l'intervalle : \\(\\int_1^4 5\\,dx = 15\\), pas 5."] },
    { id: "suiteint", theme: "fa", label: "Suites d'intégrales", ex: "I_n = \\int_0^{\\,1} x^n e^x\\,dx", FR: [12, 6], g: SI, probs: PROBS.suiteint,
      hint: "Calcule les premiers termes. Monotonie : signe de I_(n+1) − I_n = ∫ (différence des fonctions). Relation de récurrence : intégration par parties ou somme de deux termes consécutifs. Limite : encadrement puis théorème des gendarmes.",
      comps: ["Premiers termes, différence de deux termes, exponentielle", "Récurrence par parties, somme de deux termes, développer", "Limite de nIₙ, Wallis, seuil"],
      lesson: ["Suites d'intégrales", "Une intégrale qui dépend d'un entier \\(n\\) définit une suite \\((I_n)\\).",
        "Premiers termes : on calcule \\(I_0\\), \\(I_1\\). Sens de variation : \\(I_{n+1} - I_n = \\int_a^b (f_{n+1} - f_n)\\) a le signe de la fonction intégrée (par exemple \\(x^{n+1} \\leqslant x^n\\) sur \\([0 \\,;\\, 1]\\)). Relation de récurrence : par une intégration par parties (\\(I_{n+1} = e - (n + 1)I_n\\) pour \\(\\int_0^{\\,1} x^n e^x\\,dx\\)) ou en additionnant deux termes. Limite : on encadre \\(I_n\\) (par exemple \\(0 \\leqslant I_n \\leqslant \\frac{1}{n + 1}\\)) et on conclut avec le théorème des gendarmes.",
        ["\\(I_n = \\int_0^{\\,1} x^n\\,dx = \\frac{1}{n + 1}\\) : décroissante, de limite 0.", "\\(I_n = \\int_0^{\\,1} x^n e^x\\,dx\\) : \\(I_0 = e - 1\\), \\(I_1 = 1\\), \\(I_2 = e - 2\\)."],
        "Dans la relation de récurrence, le coefficient dépend de \\(n\\) : il change à chaque étape."] },
  ]);

  // ---------- progcalc (programmes de calcul) en 5e : formes de niveau 3 au programme de 5e (distributivité simple) ----------
  // Les formes de 4e (carré, produit (x + a)(x − a), nombre négatif multiplié) sont écartées en 5e par HORS_FR (fr_couv.js) ;
  // notion propre à la France (CH null) : les formes ajoutées ici ne touchent aucun profil suisse.
  if (typeof VARX !== "undefined") {
    const progT = (steps) => "<b>Programme</b><br>• Choisir un nombre.<br>" + steps.map((t) => "• " + t).join("<br>");
    VARX.progcalc = VARX.progcalc || {};
    VARX.progcalc[3] = (VARX.progcalc[3] || []).concat([
      () => { const a = R.int(2, 9), b = R.int(2, 6), v = a * b;
        return QN(progT(["Ajouter " + a + ".", "Multiplier le résultat par " + b + ".", "Soustraire " + b + " fois le nombre de départ."]) + "<br>Prouve que le résultat est toujours le même, quel que soit le nombre choisi : quel est ce résultat ?", v,
          "Avec " + M("x") + " au départ : " + M(b + "(x + " + a + ") - " + b + "x = " + b + "x + " + v + " - " + b + "x = " + v) + ". Le résultat vaut toujours " + M(v) + ".",
          { ctx: "prouver-constant", guide: [GX("Résultat en fonction de " + M("x") + ", avant de réduire ?", b + "*(x+" + a + ")-" + b + "*x", M(b + "(x + " + a + ") - " + b + "x") + "."), GR("Résultat réduit ?", v, M(v) + ".")],
            traps: [TR(a, "Développe " + b + "(x + " + a + ") : " + b + " × " + a + " = " + v + "."), TR(v + b, "On soustrait " + b + "x : les x disparaissent.")] }); },
      () => { const k = R.int(2, 9), b = R.int(2, 7), c = k * b;
        return QN(progT(["Ajouter un nombre " + M("k") + ".", "Multiplier le résultat par " + b + "."]) + "<br>En partant de " + M("x") + ", on obtient " + M(b + "x + " + c) + ". Que vaut " + M("k") + " ?", k,
          M(b + "(x + k) = " + b + "x + " + b + "k") + " ; il faut " + M(b + "k = " + c) + ", donc " + M("k = " + k) + ".",
          { ctx: "retrouver-etape", guide: [GR("Que vaut " + M(b + "k") + " ?", c, M(c) + " (terme constant de " + M(b + "x + " + c) + ")."), GR(M("k") + " ?", k, M(c + " \\div " + b + " = " + k) + ".")],
            traps: [TR(c, "C'est " + b + "k ; divise par " + b + "."), TR(c - b, "On multiplie après avoir ajouté k : " + b + "(x + k) = " + b + "x + " + b + "k.")] }); },
    ]);
  }

  // ---------- progression du collège (FR_PROGRESSION : ORDRE.FR_COL est recalculé par fr_couv.js) ----------
  if (typeof FR_PROGRESSION !== "undefined") {
    const ins = (g, id, ref) => { const L = FR_PROGRESSION[g]; if (L.includes(id)) return; const i = L.indexOf(ref); L.splice(i < 0 ? L.length : i + 1, 0, id); };
    ins(6, "symax", "angtype"); ins(6, "mediatrice", "symax"); ins(6, "echelle6", "proptab"); ins(6, "proba6", "pct");
    ins(7, "empil", "vol");
  }

  // ======================= Notes sur 20 pour un profil français (Engine.finalize) =======================
  // Les questions de statistiques des chapitres suisses emploient des notes de 1 à 6 (« notes d'un test : 4 ; 4,5 ; 5… »).
  // Pour un profil FR, Engine.finalize appelle FR_NOTES(id, q) : une question à notes suisses est remplacée par une question
  // de même notion, même niveau, même graine (reproductible), avec des notes sur 20. Rien ne change pour un profil suisse.
  const sum = (a) => a.reduce((x, y) => x + y, 0);
  const tabN = (vals, effs) => M("\\begin{array}{c|" + "c".repeat(vals.length) + "} \\text{note} & " + vals.map(N).join(" & ") + " \\\\ \\hline \\text{effectif} & " + effs.join(" & ") + " \\end{array}");
  const NT = {
    pond: () => { const vals = pk([[8, 10, 12, 14, 16], [9, 11, 13, 15, 17], [6, 8, 10, 12, 14, 16]]), effs = vals.map(() => R.int(1, 6)), n = sum(effs), s = sum(vals.map((v, i) => v * effs[i])), m = rnd(s / n, 9); if (Math.abs(m * 100 - Math.round(m * 100)) > 1e-6) return null;
      return QD("Notes d'un contrôle (sur 20) : " + tabN(vals, effs) + ". Calcule la moyenne de la classe (au centième).", m, "Moyenne pondérée : " + M("\\frac{" + vals.map((v, i) => v + " \\times " + effs[i]).join(" + ") + "}{" + n + "} = \\frac{" + s + "}{" + n + "} = " + N(m)) + " sur 20.",
        { ctx: "ponderee-20", guide: [GR("Somme des notes × effectifs ?", s, M(s) + "."), GR("Effectif total ?", n, M(n) + "."), GD("Moyenne ?", m, M(N(m)) + ".")], traps: [TD(sum(vals) / vals.length, "Chaque note compte autant de fois que son effectif (moyenne pondérée)."), TD(s / vals.length, "On divise par l'effectif total, pas par le nombre de notes différentes.")] }); },
    manque: () => { const n = pk([3, 4, 5]), xs = Array.from({ length: n }, () => R.int(7, 18)), t = pk([12, 13, 14, 15]), x = t * (n + 1) - sum(xs); if (x < 4 || x > 20 || xs.includes(x)) return null; const w = who();
      return QN(w + " a eu " + xs.map((v) => M(v)).join(", ") + " sur 20 à ses premiers contrôles. Quelle note lui faut-il au prochain contrôle (même coefficient) pour avoir exactement " + M(t) + " de moyenne ?", x,
        "Avec " + M(n + 1) + " notes de moyenne " + M(t) + ", la somme doit valoir " + M((n + 1) + " \\times " + t + " = " + t * (n + 1)) + " ; on a déjà " + M(sum(xs)) + " : il faut " + M(t * (n + 1) + " - " + sum(xs) + " = " + x) + ".",
        { ctx: "note-manquante-20", guide: [GR("Somme nécessaire ?", t * (n + 1), M(t * (n + 1)) + "."), GR("Somme actuelle ?", sum(xs), M(sum(xs)) + "."), GR("Note nécessaire ?", x, M(x) + ".")], traps: [TR(t, "Il faut compenser les notes précédentes."), TR(t * n - sum(xs) > 0 ? t * n - sum(xs) : x + 3, "Il y aura " + (n + 1) + " notes en tout.")] }); },
    mode: () => { const vals = pk([[8, 10, 12, 14, 16], [9, 11, 13, 15, 17], [10, 11, 12, 13, 14]]), effs = vals.map(() => R.int(1, 8)), mx = Math.max(...effs); if (effs.filter((e) => e === mx).length > 1) return null; const md = vals[effs.indexOf(mx)];
      return Object.assign(QN("Notes d'un contrôle (sur 20) : " + tabN(vals, effs) + ". Quel est le mode de cette série ?", md, "Le mode est la valeur la plus fréquente : " + M(md) + " (effectif " + mx + ").",
        { ctx: "mode-20", guide: [GR("Plus grand effectif ?", mx, M(mx) + "."), GR("Note correspondante (le mode) ?", md, M(md) + ".")], traps: [TR(mx, "Le mode est la NOTE la plus fréquente, pas son effectif."), TR(Math.max(...vals), "Le mode n'est pas la plus grande note.")] }), { shownOk: true }); },
    cumul: () => { const vals = [8, 10, 12, 14, 16], effs = vals.map(() => R.int(2, 9)), k = R.int(2, 3), c = sum(effs.slice(0, k));
      return QN("Notes d'un contrôle (sur 20) : " + tabN(vals, effs) + ". Combien d'élèves ont une note inférieure ou égale à " + M(vals[k - 1]) + " (effectif cumulé) ?", c, M(effs.slice(0, k).join(" + ") + " = " + c) + ".",
        { ctx: "cumul-20", guide: [GR("Combien de notes du tableau sont inférieures ou égales à " + M(vals[k - 1]) + " ?", k, vals.slice(0, k).join(", ") + "."), GR("Effectif cumulé ?", c, M(c) + ".")], traps: [TR(effs[k - 1], "On additionne les effectifs de toutes les notes jusqu'à " + vals[k - 1] + "."), TR(c + effs[k], "« Inférieure ou égale à " + vals[k - 1] + " » : la note " + vals[k] + " n'est pas comprise.")] }); },
    equation: () => { const n = R.int(3, 5); let xs, t, x; for (let k = 0; k < 40; k++) { xs = Array.from({ length: n }, () => R.int(8, 17)); t = pk([12, 13, 14]); x = t * (n + 2) - sum(xs); if (x % 2 === 0 && x / 2 >= 6 && x / 2 <= 20) break; x = null; } if (!x) return null; const v = x / 2;
      return QN("Un élève a obtenu " + xs.map((u) => M(u)).join(", ") + " sur 20. Le prochain devoir compte double. Quelle note doit-il y obtenir pour avoir exactement " + M(t) + " de moyenne ?", v,
        "Le devoir compte comme deux notes : " + M("\\frac{" + sum(xs) + " + 2x}{" + (n + 2) + "} = " + t) + ", donc " + M(sum(xs) + " + 2x = " + t * (n + 2)) + " et " + M("x = " + v) + ".",
        { ctx: "coefficient-20", guide: [GR("Somme visée (" + (n + 2) + " notes) ?", t * (n + 2), M(t * (n + 2)) + "."), GR(M("2x") + " ?", x, M(x) + "."), GR(M("x") + " ?", v, M(v) + ".")], traps: [TR(x, "C'est 2x : divise par 2."), TR(t * (n + 1) - sum(xs), "Le devoir compte double : " + (n + 2) + " notes en tout.")] }); },
  };
  const NDEF = () => P("Les notes de Yanis (sur 20) : 11 ; 14 ; 9 ; 15 ; 12. Le prochain devoir compte double.", [["a) Moyenne actuelle", 12.2], ["b) Médiane actuelle", 12], ["c) Note à obtenir au devoir double pour finir avec 13 de moyenne", 15]], ["Un devoir qui compte double compte comme deux notes : 7 notes en tout.", "Somme visée : 7 × 13 = 91 ; 61 + 2x = 91."], "a) " + M("\\frac{61}{5} = 12{,}2") + " ; b) série triée 9, 11, 12, 14, 15 : médiane " + M("12") + " ; c) " + M("61 + 2x = 91") + ", " + M("x = 15") + ".");
  const NMAP = { statfreq: ["mode", "cumul"], stats: ["pond", "manque", "mode"], diagr: ["pond", "pond"], probeq: ["manque", "equation"], eq1: ["manque"], ineq: ["manque"] };
  window.FR_NOTES = function (id, q) {
    if (!q || !NMAP[id]) return null;
    const t = String(q.q || "") + " " + (q.parts || []).map((x) => x.label || "").join(" ");
    if (!/\b[Nn]otes?\b/.test(t) || /sur 20|[Oo]n note|la note en parts/.test(t)) return null;
    R.seed((q.seed || 1) * 7919 + 4243);
    let r = null;
    if (q.d === 4 || q.parts) { const p = NDEF(); r = { ...p, spec: { kind: "multi" }, hint: p.hints[0] }; }
    else for (let k = 0; k < 30 && !r; k++) r = NT[pk(NMAP[id])]();
    if (!r) return null;
    const cb = typeof colonBreak === "function" ? colonBreak : (x) => x;
    r.q = cb(r.q); r.sol = cb(r.sol); if (r.guide) r.guide = r.guide.map((g) => ({ ...g, ask: cb(g.ask), sol: cb(g.sol) }));
    return Object.assign(r, { id, d: q.d, seed: q.seed, code: q.code, hint: r.hint || q.hint });
  };
})();
