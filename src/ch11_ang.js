// Chantier 11e · 7. Angles (18.11, lot suivant du plan de cheminement) : une seule source pour angles (types d'angles,
// opposés par le sommet, correspondants, alternes-internes, angle inscrit et angle au centre) et cercthales (cercle de
// Thalès, tangente). Même standard que ch11_gm.js : au moins 3 formes par niveau, pas à pas, erreurs typiques, ctx,
// figures ; défis en plusieurs étapes. Pas de leçon active nouvelle (règle du 18.11 : stabiliser la manipulation d'abord).
(function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const keep = (value, traps) => { const seen = new Set(); return (traps || []).filter((t) => t && isFinite(t.v) && Math.abs(t.v - value) > 1e-9 && !seen.has(t.v) && seen.add(t.v)); };
  const Qv = (q, value, sol, o = {}) => { const x = { q, spec: Object.assign({ kind: "value", value }, o.round ? { round: o.round } : {}), sol, guide: o.guide, traps: keep(value, o.traps), ctx: o.ctx }; if (o.fig) x.fig = o.fig; return x; };
  const TR = TRAP;
  const P = (q, parts, hints, sol, fig) => ({ fig, q, parts: parts.map(([label, value, round]) => ({ label, spec: Object.assign({ kind: "value", value }, round ? { round } : {}) })), hints, sol });
  const deg = (v) => M(v + "°");
  const TRIP = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25]];

  // Deux droites parallèles (d₁ en bas, d₂ en haut) coupées par une sécante d'angle a avec la direction des parallèles.
  // Régions autour d'une intersection (sens trigonométrique depuis la droite) : 1 = droite→sécante haut (a),
  // 2 = sécante haut→gauche (180 − a), 3 = gauche→sécante bas (a), 4 = sécante bas→droite (180 − a).
  // marks : [[point (0 = sur d₁, 1 = sur d₂), région, étiquette], …]. one = true : une seule droite (angles en un point).
  const par = (a, marks, one) => {
    const t = (a * Math.PI) / 180, d = [Math.cos(t), Math.sin(t)], h = 3.2, /* 25.11 : 2,4 → 3,2, étiquettes des deux angles entre les parallèles moins serrées (robot : « 68° » à 17 px du « ? ») */ I = [[0, 0], [h / Math.tan(t), h]];
    const g = GEO().add([-4, -1.8], [5.2, h + 1.8]);
    g.seg([-4, 0], [5.2, 0]); if (!one) g.seg([-4, h], [5.2, h]);
    g.seg([I[0][0] - 2 * d[0], I[0][1] - 2 * d[1]], [I[one ? 0 : 1][0] + 2 * d[0], I[one ? 0 : 1][1] + 2 * d[1]]);
    if (!one) g.text([-3.6, 0], "d₁", 0, -6).text([-3.6, h], "d₂", 0, -6);
    marks.forEach(([k, r, lab]) => { const V = I[k], R0 = [V[0] + 2, V[1]], U = [V[0] + d[0], V[1] + d[1]], L0 = [V[0] - 2, V[1]], D0 = [V[0] - d[0], V[1] - d[1]];
      const [A, B] = [[R0, U], [U, L0], [L0, D0], [D0, R0]][r - 1]; g.angle(V, A, B, lab, { r: 18 + 4 * k }); });
    return g.svg(one ? "deux droites sécantes" : "droites parallèles coupées par une sécante");
  };
  const rv = (a, r) => (r % 2 ? a : 180 - a); // mesure de la région r

  // ===================== angles =====================
  /* 26.11 (revue p6, n° 13 : étiquette « (1x + 29)° ») : coefficient 1 omis */
  const cq = (k) => (k === 1 ? "" : k);
  const ANG = {
    1: [
      () => { const a = R.int(12, 78), sup = R.rand() < 0.5;
        return Qv("Quel est le " + (sup ? "supplément" : "complément") + " d'un angle de " + deg(a) + " ? (en degrés)", sup ? 180 - a : 90 - a, (sup ? "Deux angles supplémentaires font 180° : " + M("180° - " + a + "° = " + (180 - a) + "°") : "Deux angles complémentaires font 90° : " + M("90° - " + a + "° = " + (90 - a) + "°")) + ".",
          { ctx: sup ? "supplement" : "complement", fig: sup ? par(a, [[0, 1, a + "°"], [0, 2, "?"]], true) : GF.complement(a, a + "°", "?"), guide: [GS("Deux angles " + (sup ? "supplémentaires" : "complémentaires") + " ont une somme de combien de degrés ?", sup ? 180 : 90, sup ? "180°." : "90°."), GS("Que reste-t-il en enlevant " + deg(a) + " ?", sup ? 180 - a : 90 - a, deg(sup ? 180 - a : 90 - a) + ".")],
            traps: [TR(sup ? 90 - a : 180 - a, sup ? "Supplémentaires : la somme fait 180° (90°, c'est pour complémentaires)." : "Complémentaires : la somme fait 90° (180°, c'est pour supplémentaires).")] }); },
      () => { const a = R.int(25, 75), opp = R.rand() < 0.5;
        return Qv("Deux droites se coupent. Un des angles mesure " + deg(a) + ". Combien mesure l'angle marqué « ? » (en degrés) ?", opp ? a : 180 - a,
          opp ? "Les deux angles sont opposés par le sommet : ils sont égaux, " + deg(a) + "." : "Les deux angles sont adjacents et forment un angle plat : " + M("180° - " + a + "° = " + (180 - a) + "°") + ".",
          { ctx: opp ? "oppose" : "adjacent", fig: par(a, [[0, 1, a + "°"], [0, opp ? 3 : 2, "?"]], true), guide: [GS(opp ? "Les deux angles sont opposés par le sommet : ont-ils la même mesure ? Tape la mesure de « ? »." : "Les deux angles sont côte à côte sur une droite : quelle est leur somme ?", opp ? a : 180, opp ? "Oui : " + deg(a) + "." : "180° (angle plat)."), ...(opp ? [] : [GS("Mesure de « ? » ?", 180 - a, deg(180 - a) + ".")])],
            traps: [TR(opp ? 180 - a : a, opp ? "Ces deux angles sont opposés par le sommet (en face l'un de l'autre) : ils sont égaux." : "Ces angles sont adjacents sur une droite : ils sont supplémentaires (somme 180°).")] }); },
      () => { const a = R.int(30, 70), r = pk([1, 2, 3, 4]);
        return Qv("Les droites " + M("d_1") + " et " + M("d_2") + " sont parallèles. Un angle mesure " + deg(rv(a, r)) + ". Combien mesure l'angle marqué « ? » ?", rv(a, r), "Les deux angles sont correspondants (même position aux deux intersections) : avec des parallèles, ils sont égaux, " + deg(rv(a, r)) + ".",
          { ctx: "correspondants", fig: par(a, [[0, r, rv(a, r) + "°"], [1, r, "?"]]), guide: [GS("Les deux angles occupent la même position aux deux intersections : ce sont des angles correspondants. Avec des parallèles, ils sont égaux. Mesure de « ? » ?", rv(a, r), deg(rv(a, r)) + ".")],
            traps: [TR(180 - rv(a, r), "Correspondants : même position, même mesure (pas supplémentaires).")] }); },
      /* 25.11 (audit de niveau 11e) : « trois angles autour d'un point » (tour complet, 9e) remplacé par les angles
         internes du même côté (supplémentaires) et alternes-externes (égaux), au programme de 11e (plan de cheminement, 7. Angles). */
      () => { const a = R.int(32, 72), co = R.rand() < 0.55, [r1, r2] = co ? pk([[1, 4], [2, 3]]) : pk([[3, 1], [4, 2]]), g = rv(a, r1), v = rv(a, r2);
        return Qv("Les droites " + M("d_1") + " et " + M("d_2") + " sont parallèles. Un angle mesure " + deg(g) + ". Combien mesure l'angle marqué « ? » ?", v,
          co ? "Les deux angles sont entre les parallèles, du même côté de la sécante (angles internes du même côté) : ils sont supplémentaires, " + M("180° - " + g + "° = " + v + "°") + "."
            : "Les deux angles sont à l'extérieur des parallèles, de part et d'autre de la sécante (alternes-externes) : ils sont égaux, " + deg(v) + ".",
          { ctx: co ? "co-internes" : "alternes-externes", fig: par(a, [[0, r1, g + "°"], [1, r2, "?"]]),
            guide: co ? [GS("Les deux angles sont entre les parallèles, du même côté de la sécante. Quelle est leur somme ?", 180, "180° : ils sont supplémentaires."), GS("Mesure de « ? » ?", v, deg(v) + ".")]
              : [GS("Les deux angles sont à l'extérieur des parallèles, de part et d'autre de la sécante : alternes-externes, donc égaux. Mesure de « ? » ?", v, deg(v) + ".")],
            traps: [TR(co ? g : 180 - g, co ? "Internes du même côté : les angles ne sont pas égaux, ils sont supplémentaires (somme 180°)." : "Alternes-externes : les angles sont égaux (pas supplémentaires).")] }); },
    ],
    2: [
      () => { const a = R.int(30, 70), [r1, r2] = pk([[1, 3], [2, 4]]);
        return Qv("Les droites " + M("d_1") + " et " + M("d_2") + " sont parallèles. Un angle mesure " + deg(rv(a, r1)) + ". Combien mesure l'angle marqué « ? » ?", rv(a, r2), "Les deux angles sont alternes-internes (entre les parallèles, de part et d'autre de la sécante) : ils sont égaux, " + deg(rv(a, r2)) + ".",
          { ctx: "alternes", fig: par(a, [[0, r1, rv(a, r1) + "°"], [1, r2, "?"]]),
            guide: [GS("Les deux angles sont entre les parallèles, de part et d'autre de la sécante : alternes-internes. Mesure de « ? » ?", rv(a, r2), deg(rv(a, r2)) + ".")],
            traps: [TR(180 - rv(a, r2), "Alternes-internes : les angles sont égaux (pas supplémentaires).")] }); },
      () => { const a = R.int(30, 70);
        return Qv("Les droites " + M("d_1") + " et " + M("d_2") + " sont parallèles. Un angle mesure " + deg(a) + ". Combien mesure l'angle marqué « ? » ?", 180 - a, "L'angle correspondant à " + deg(a) + " sur " + M("d_2") + " mesure aussi " + deg(a) + " ; « ? » lui est adjacent sur la droite : " + M("180° - " + a + "° = " + (180 - a) + "°") + ".",
          { ctx: "deux-etapes", fig: par(a, [[0, 1, a + "°"], [1, 2, "?"]]), guide: [GS("Sur " + M("d_2") + ", l'angle correspondant à " + deg(a) + " (même position) mesure ?", a, deg(a) + "."), GS("« ? » est adjacent à cet angle sur une droite : mesure ?", 180 - a, deg(180 - a) + ".")],
            traps: [TR(a, "« ? » n'est pas à la même position que l'angle donné : il lui est supplémentaire.")] }); },
      () => { const ins = R.int(18, 80), dir = R.rand() < 0.5;
        return dir ? Qv("Dans un cercle de centre " + M("O") + ", l'angle inscrit " + M("\\widehat{ACB}") + " mesure " + deg(ins) + ". Combien mesure l'angle au centre " + M("\\widehat{AOB}") + " qui intercepte le même arc ?", 2 * ins, "L'angle au centre vaut le double de l'angle inscrit : " + M("2 \\cdot " + ins + "° = " + 2 * ins + "°") + ".",
            { ctx: "centre", fig: FIG.circleAngles("?", ins + "°"), guide: [GS("Angle au centre = 2 × angle inscrit. Calcule-le.", 2 * ins, deg(2 * ins) + ".")], traps: [TR(ins / 2, "C'est l'inverse : l'angle au CENTRE est le double de l'angle inscrit."), TR(ins, "Ils interceptent le même arc, mais l'angle au centre vaut le double.")] })
          : Qv("Dans un cercle de centre " + M("O") + ", l'angle au centre " + M("\\widehat{AOB}") + " mesure " + deg(2 * ins) + ". Combien mesure l'angle inscrit " + M("\\widehat{ACB}") + " qui intercepte le même arc ?", ins, "L'angle inscrit vaut la moitié de l'angle au centre : " + M(2 * ins + "° : 2 = " + ins + "°") + ".",
            { ctx: "inscrit", fig: FIG.circleAngles(2 * ins + "°", "?"), guide: [GS("Angle inscrit = angle au centre ÷ 2. Calcule-le.", ins, deg(ins) + ".")], traps: [TR(4 * ins, "L'angle inscrit est la MOITIÉ de l'angle au centre.")] }); },
      () => { const ins = R.int(20, 75);
        return Qv("Sur un cercle, les angles inscrits " + M("\\widehat{AMB}") + " et " + M("\\widehat{ANB}") + " interceptent le même arc " + M("AB") + " (M et N du même côté de la corde). " + M("\\widehat{AMB} = " + ins + "°") + ". Combien mesure " + M("\\widehat{ANB}") + " ?", ins, "Deux angles inscrits qui interceptent le même arc sont égaux : " + deg(ins) + ".",
          { ctx: "meme-arc", guide: [GS("Chacun vaut la moitié du même angle au centre " + M("\\widehat{AOB}") + ". Combien mesure " + M("\\widehat{AOB}") + " ?", 2 * ins, deg(2 * ins) + "."), GS("Donc " + M("\\widehat{ANB}") + " = ?", ins, deg(ins) + ".")],
            traps: [TR(2 * ins, "C'est l'angle au centre ; les angles inscrits valent sa moitié."), TR(180 - ins, "M et N sont du même côté : les angles sont égaux (pas supplémentaires).")] }); },
    ],
    3: [
      () => { let x, p, q, s, t; do { p = R.int(3, 6); q = R.int(1, 4); x = R.int(8, 25); s = R.int(-20, 30); t = p * x + s - q * x; } while (p - q < 2 || p * x + s <= 10 || p * x + s >= 170 || t <= 0);
        return Qv("Avec deux parallèles coupées par une sécante, deux angles alternes-internes mesurent " + M("(" + p + "x" + (s < 0 ? " - " + -s : " + " + s) + ")°") + " et " + M("(" + cq(q) + "x + " + t + ")°") + ". Que vaut " + M("x") + " ?", x,
          "Alternes-internes donc égaux : " + M(p + "x" + (s < 0 ? " - " + -s : " + " + s) + " = " + cq(q) + "x + " + t) + ", " + M((p - q) + "x = " + (t - s)) + ", " + M("x = " + x) + ".",
          { ctx: "equation", fig: p * x + s <= 90 ? par(p * x + s, [[0, 1, "(" + p + "x" + (s < 0 ? " − " + -s : " + " + s) + ")°"], [1, 3, "(" + cq(q) + "x + " + t + ")°"]]) : par(180 - p * x - s, [[0, 2, "(" + p + "x" + (s < 0 ? " − " + -s : " + " + s) + ")°"], [1, 4, "(" + cq(q) + "x + " + t + ")°"]]), guide: [GS("Les deux angles sont égaux : " + M(p + "x" + (s < 0 ? " - " + -s : " + " + s) + " = " + cq(q) + "x + " + t) + ". Après regroupement, " + M((p - q) + "x = ?"), t - s, M((p - q) + "x = " + (t - s)) + "."), GS(M("x") + " = ?", x, M("x = " + x) + ".")],
            traps: [TR((180 - s - t) / (p + q), "Alternes-internes : les angles sont égaux (on n'écrit pas une somme de 180°).")] }); },
      () => { let x, p, s, q, t; do { p = R.int(2, 4); q = R.int(1, 3); x = R.int(10, 30); s = R.int(-10, 30); t = 180 - p * x - s - q * x; } while (t < -30 || t > 60 || p * x + s <= 10 || q * x + t <= 10);
        return Qv("Deux angles adjacents forment un angle plat. Ils mesurent " + M("(" + p + "x" + (s < 0 ? " - " + -s : " + " + s) + ")°") + " et " + M("(" + cq(q) + "x" + (t < 0 ? " - " + -t : " + " + t) + ")°") + ". Que vaut " + M("x") + " ?", x,
          "Supplémentaires : " + M("(" + p + "x" + (s < 0 ? " - " + -s : " + " + s) + ") + (" + cq(q) + "x" + (t < 0 ? " - " + -t : " + " + t) + ") = 180") + ", " + M((p + q) + "x = " + (180 - s - t)) + ", " + M("x = " + x) + ".",
          { ctx: "plat", fig: p * x + s <= 90 ? par(p * x + s, [[0, 1, "(" + p + "x" + (s < 0 ? " − " + -s : " + " + s) + ")°"], [0, 2, "(" + cq(q) + "x" + (t < 0 ? " − " + -t : " + " + t) + ")°"]], true) : par(180 - p * x - s, [[0, 2, "(" + p + "x" + (s < 0 ? " − " + -s : " + " + s) + ")°"], [0, 1, "(" + cq(q) + "x" + (t < 0 ? " − " + -t : " + " + t) + ")°"]], true), guide: [GS("La somme fait 180° : " + M((p + q) + "x + " + (s + t) + " = 180") + ". " + M((p + q) + "x = ?"), 180 - s - t, M((p + q) + "x = " + (180 - s - t)) + "."), GS(M("x") + " = ?", x, M("x = " + x) + ".")],
            traps: [TR((90 - s - t) / (p + q), "Un angle plat fait 180° (90°, c'est un angle droit).")] }); },
      () => { const c = 2 * R.int(20, 70);
        return Qv("Dans un cercle de centre " + M("O") + ", l'angle au centre " + M("\\widehat{AOB}") + " mesure " + deg(c) + ". Combien mesure l'angle " + M("\\widehat{OAB}") + " du triangle " + M("AOB") + " ?", (180 - c) / 2,
          M("OA = OB") + " (rayons) : le triangle est isocèle, ses angles à la base sont égaux. " + M("\\widehat{OAB} = (180° - " + c + "°) : 2 = " + (180 - c) / 2 + "°") + ".",
          { ctx: "isocele", fig: GF.centralTri(c, c + "°", "?"), guide: [GS("Somme des angles du triangle " + M("AOB") + " ?", 180, "180°."), GS("Il reste pour les deux angles à la base : ?", 180 - c, deg(180 - c) + "."), GS("Le triangle est isocèle (" + M("OA = OB") + ") : chacun mesure ?", (180 - c) / 2, deg((180 - c) / 2) + ".")],
            traps: [TR(180 - c, "Il reste " + (180 - c) + "° pour DEUX angles égaux : divise par 2."), TR(c / 2, "Ce n'est pas un angle inscrit : utilise la somme des angles du triangle isocèle AOB.")] }); },
    ],
  };
  // Lot 26.11 (référentiel du Collège 1.GE.01a : opposés par le sommet, correspondants, alternes-internes ; repris en 1re) :
  // une forme de niveau 3 qui enchaîne deux propriétés (correspondants, puis opposés par le sommet) sur une équation.
  ANG[3].push(() => { let x, p, q, s, t, a; do { p = R.int(3, 6); q = R.int(1, p - 2); x = R.int(8, 22); s = R.int(-15, 20); a = p * x + s; t = a - q * x; } while (p - q < 2 || a < 35 || a > 75 || t <= 0 || s === 0);
    const r = pk([1, 3]), r2 = r === 1 ? 3 : 1, E1 = "(" + p + "x" + (s < 0 ? " - " + -s : " + " + s) + ")°", E2 = "(" + cq(q) + "x + " + t + ")°";
    return Qv("Les droites " + M("d_1") + " et " + M("d_2") + " sont parallèles. Les deux angles marqués mesurent " + M(E1) + " et " + M(E2) + ". Que vaut " + M("x") + " ?", x,
      "Sur " + M("d_2") + ", l'angle correspondant à " + M(E1) + " (même position) lui est égal ; l'angle marqué sur " + M("d_2") + " lui est opposé par le sommet, donc égal aussi. " + M(p + "x" + (s < 0 ? " - " + -s : " + " + s) + " = " + cq(q) + "x + " + t) + ", " + M((p - q) + "x = " + (t - s)) + ", " + M("x = " + x) + " (les deux angles mesurent " + deg(a) + ").",
      { ctx: "chaine-proprietes", fig: par(a, [[0, r, E1], [1, r2, E2]]),
        guide: [GS("Correspondants, puis opposés par le sommet : les deux angles sont égaux. " + M(p + "x" + (s < 0 ? " - " + -s : " + " + s) + " = " + cq(q) + "x + " + t) + " : " + M((p - q) + "x") + " = ?", t - s, M((p - q) + "x = " + (t - s)) + "."), GS(M("x") + " = ?", x, M("x = " + x) + ".")],
        traps: [TR((180 - s - t) / (p + q), "Les deux angles sont égaux (correspondants, puis opposés par le sommet) : on n'écrit pas une somme de 180°."), TR((t + s) / (p - q), "En regroupant, " + M(s) + " passe de l'autre côté avec un signe moins.")] }); });

  // ===================== cercthales =====================
  const CT = {
    1: [
      () => { const a = R.int(20, 70);
        return Qv(M("[AB]") + " est un diamètre d'un cercle et " + M("C") + " un point du cercle. " + M("\\widehat{CAB} = " + a + "°") + ". Combien mesure " + M("\\widehat{CBA}") + " ?", 90 - a, "Le triangle est rectangle en " + M("C") + " (cercle de Thalès) : " + M("180° - 90° - " + a + "° = " + (90 - a) + "°") + ".",
          { ctx: "angle", fig: GF.diam(2 * a, { lA: a + "°", lB: "?" }), guide: [GS("Un triangle inscrit dans un demi-cercle est rectangle. Combien mesure l'angle en " + M("C") + " ?", 90, "90°."), GS(M("\\widehat{CBA}") + " = 180° − 90° − " + a + "° = ?", 90 - a, deg(90 - a) + ".")],
            traps: [TR(180 - a, "Il y a trois angles : l'angle droit en C compte aussi."), TR(a, "Les deux angles aigus ne sont pas égaux : ils sont complémentaires.")] }); },
      () => { const [r, t, d] = pk(TRIP);
        return Qv("D'un point " + M("P") + " à " + M(d) + " cm du centre " + M("O") + " d'un cercle de rayon " + M(r) + " cm, on trace une tangente qui touche le cercle en " + M("T") + ". Calcule " + M("PT") + " (en cm).", t, "La tangente est perpendiculaire au rayon : " + M("PT^2 = " + d + "^2 - " + r + "^2 = " + t * t) + ", " + M("PT = " + t) + " cm.",
          { ctx: "tangente", fig: GF.tangent(r, d, { lr: r + "", ld: d + "", lt: "?" }), guide: [GS("Le triangle " + M("OTP") + " est rectangle en " + M("T") + ". " + M(d + "^2 - " + r + "^2") + " = ?", t * t, M(t * t) + "."), GS(M("PT") + " = ?", t, M(t) + " cm.")],
            traps: [TR(Math.sqrt(d * d + r * r), "OP est l'hypoténuse (en face de l'angle droit en T) : on soustrait."), TR(d - r, "Pythagore : on soustrait les carrés.")] }); },
      () => { const [a, b, c] = pk(TRIP);
        return Qv(M("[AB]") + " est un diamètre de " + M(c) + " cm d'un cercle, et " + M("C") + " un point du cercle tel que " + M("AC = " + a) + " cm. Calcule " + M("BC") + " (en cm).", b, "Triangle rectangle en " + M("C") + " : " + M("BC^2 = " + c + "^2 - " + a + "^2 = " + b * b) + ", " + M("BC = " + b) + " cm.",
          { ctx: "cote", fig: GF.diam(70, { lAC: a + "", lBC: "?", lAB: c + "" }), guide: [GS("Le triangle est rectangle en " + M("C") + ", d'hypoténuse le diamètre. " + M(c + "^2 - " + a + "^2") + " = ?", b * b, M(b * b) + "."), GS(M("BC") + " = ?", b, M(b) + " cm.")],
            traps: [TR(Math.sqrt(c * c + a * a), "Le diamètre est l'hypoténuse : on soustrait.")] }); },
    ],
    2: [
      () => { const a = R.int(20, 70);
        return Qv("La droite " + M("(PT)") + " est tangente en " + M("T") + " à un cercle de centre " + M("O") + ". " + M("\\widehat{OPT} = " + a + "°") + ". Combien mesure " + M("\\widehat{POT}") + " ?", 90 - a, "La tangente est perpendiculaire au rayon : " + M("\\widehat{OTP} = 90°") + ", donc " + M("\\widehat{POT} = 90° - " + a + "° = " + (90 - a) + "°") + ".",
          { ctx: "tangente-angle", fig: GF.tangent(1, 1 / Math.sin(a * Math.PI / 180), { lP: a + "°", lO: "?" }), guide: [GS("Angle entre la tangente et le rayon " + M("[OT]") + " ?", 90, "90°."), GS(M("\\widehat{POT}") + " = ?", 90 - a, deg(90 - a) + ".")], traps: [TR(180 - a, "Le triangle OTP a un angle droit en T : il reste 90° − " + a + "°.")] }); },
      () => { const [r, t, d] = pk(TRIP);
        return Qv("Une tangente issue d'un point " + M("P") + " touche un cercle de centre " + M("O") + " en " + M("T") + ". " + M("OP = " + d) + " cm et " + M("PT = " + t) + " cm. Quel est le rayon du cercle (en cm) ?", r, M("r^2 = " + d + "^2 - " + t + "^2 = " + r * r) + ", " + M("r = " + r) + " cm.",
          { ctx: "rayon", fig: GF.tangent(r, d, { lr: "r", ld: d + "", lt: t + "" }), guide: [GS("Triangle rectangle en " + M("T") + " : " + M(d + "^2 - " + t + "^2") + " = ?", r * r, M(r * r) + "."), GS("Rayon ?", r, M(r) + " cm.")], traps: [TR(d - t, "On soustrait les carrés, puis racine.")] }); },
      () => { const [a, b, c] = pk(TRIP);
        return Qv("Un triangle " + M("ABC") + " est rectangle en " + M("C") + ", avec " + M("AC = " + a) + " cm et " + M("BC = " + b) + " cm. Quel est le rayon de son cercle circonscrit (en cm) ?", c / 2, "Le cercle circonscrit a pour diamètre l'hypoténuse (Thalès) : " + M("AB = " + c) + " cm, rayon " + M(String(c / 2).replace(".", "{,}")) + " cm.",
          { ctx: "circonscrit", fig: GF.diam(2 * Math.atan2(b, a) * 180 / Math.PI, { lAC: a + " cm", lBC: b + " cm" }), guide: [GS("Hypoténuse " + M("AB") + " ?", c, M(c) + " cm."), GS("L'hypoténuse est un diamètre du cercle circonscrit. Rayon ?", c / 2, M(String(c / 2).replace(".", "{,}")) + " cm.")], traps: [TR(c, "C'est le diamètre ; le rayon en est la moitié.")] }); },
    ],
    3: [
      () => { const [r, t, d] = pk(TRIP);
        return Qv("D'un point " + M("P") + " à " + M(d) + " cm du centre " + M("O") + " d'un cercle de rayon " + M(r) + " cm, on trace les deux tangentes, qui touchent le cercle en " + M("T") + " et " + M("T'") + ". Quel est le périmètre du quadrilatère " + M("OTPT'") + " (en cm) ?", 2 * r + 2 * t, "Chaque tangente mesure " + M("\\sqrt{" + d + "^2 - " + r + "^2} = " + t) + " cm ; périmètre " + M("2 \\cdot " + r + " + 2 \\cdot " + t + " = " + (2 * r + 2 * t)) + " cm.",
          { ctx: "deux-tangentes", fig: GF.tangent(r, d, { lr: r + " cm", ld: d + " cm", both: true }), guide: [GS("Longueur d'une tangente " + M("PT") + " ?", t, M(t) + " cm."), GS("Le périmètre fait deux rayons et deux tangentes : ?", 2 * r + 2 * t, M(2 * r + 2 * t) + " cm.")], traps: [TR(2 * r + 2 * d, "Les côtés du quadrilatère sont OT, TP, PT', T'O (pas OP)."), TR(r + t, "Il y a deux rayons et deux tangentes.")] }); },
      () => { const [a, b, c] = pk(TRIP);
        return Qv(M("[AB]") + " est un diamètre de " + M(c) + " cm et " + M("C") + " un point du cercle tel que " + M("AC = " + a) + " cm. Calcule l'aire du triangle " + M("ABC") + " (en cm²).", (a * b) / 2, "Rectangle en " + M("C") + " : " + M("BC = \\sqrt{" + c * c + " - " + a * a + "} = " + b) + " ; aire " + M("\\frac{" + a + " \\cdot " + b + "}{2} = " + String((a * b) / 2).replace(".", "{,}")) + " cm².",
          { ctx: "aire", fig: GF.diam(2 * Math.atan2(b, a) * 180 / Math.PI, { lAB: c + " cm", lAC: a + " cm" }), guide: [GS(M("BC") + " (Pythagore) ?", b, M(b) + " cm."), GS("Aire (les cathètes sont base et hauteur) ?", (a * b) / 2, M(String((a * b) / 2).replace(".", "{,}")) + " cm².")], traps: [TR((a * c) / 2, "La base et la hauteur sont les deux cathètes AC et BC (pas le diamètre)."), TR(a * b, "Aire d'un triangle : on divise par 2.")] }); },
      () => { const a = R.int(20, 70);
        return Qv(M("[AB]") + " est un diamètre d'un cercle de centre " + M("O") + ", et " + M("C") + " un point du cercle. " + M("\\widehat{ACO} = " + a + "°") + ". Combien mesure " + M("\\widehat{BCO}") + " ?", 90 - a, "L'angle " + M("\\widehat{ACB}") + " est droit (Thalès) et vaut " + M("\\widehat{ACO} + \\widehat{BCO}") + " : " + M("90° - " + a + "° = " + (90 - a) + "°") + ".",
          { ctx: "decoupe", fig: GF.diam(2 * a, { lACO: a + "°", lBCO: "?" }), guide: [GS("Combien mesure " + M("\\widehat{ACB}") + " ?", 90, "90° (C sur le cercle de diamètre [AB])."), GS(M("\\widehat{BCO}") + " = ?", 90 - a, deg(90 - a) + ".")], traps: [TR(a, "Les deux parties de l'angle droit ne sont pas forcément égales."), TR(180 - a, "L'angle en C est droit : 90° − " + a + "°.")] }); },
    ],
  };

  const PROBS = {
    angles: [
      () => P("Deux parallèles " + M("d_1") + " et " + M("d_2") + " sont coupées par une sécante. À l'intersection avec " + M("d_1") + ", un angle mesure 62°.", [["a) Son angle opposé par le sommet", 62], ["b) Son angle adjacent sur d₁", 118], ["c) L'angle correspondant sur d₂", 62], ["d) L'angle alterne-interne de l'angle adjacent (b)", 118]],
          ["Opposés : égaux ; adjacents sur une droite : 180°.", "Correspondants et alternes-internes : égaux avec des parallèles."], "a) 62° ; b) 118° ; c) 62° ; d) 118°."),
      () => P("Dans un cercle de centre O, l'angle inscrit " + M("\\widehat{ACB}") + " mesure 35°.", [["a) Angle au centre AOB", 70], ["b) Angle OAB du triangle isocèle AOB", 55], ["c) Un autre angle inscrit AMB du même côté", 35]], ["Angle au centre = 2 × inscrit.", "Triangle isocèle : (180 − 70) ÷ 2."], "a) 70° ; b) 55° ; c) 35°."),
    ],
    cercthales: [
      () => P("Un triangle ABC est rectangle en C, avec AC = 6 cm et BC = 8 cm.", [["a) AB (cm)", 10], ["b) Rayon du cercle circonscrit (cm)", 5], ["c) Distance du milieu de [AB] au point C (cm)", 5]], ["Le cercle circonscrit a pour diamètre l'hypoténuse.", "C est sur ce cercle."], "a) 10 ; b) 5 ; c) 5 (C est sur le cercle de centre le milieu de [AB])."),
      () => P("D'un point P à 13 cm du centre O d'un cercle de rayon 5 cm, on trace les deux tangentes PT et PT'.", [["a) PT (cm)", 12], ["b) Aire du triangle OTP (cm²)", 30], ["c) Aire du quadrilatère OTPT' (cm²)", 60]], ["Rectangle en T : PT² = 13² − 5².", "Aire = cathètes ÷ 2."], "a) 12 ; b) 30 ; c) 60."),
    ],
  };

  const ALL = { angles: ANG, cercthales: CT };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => pickForm(lv[Math.min(Math.max(d, 1), 3)]);
    if (typeof VAR !== "undefined") VAR[id] = {};
    if (typeof PROB !== "undefined") delete PROB[id];
    PROB_EXTRA[id] = PROBS[id];
  }
  Object.assign(HINTS_EXTRA, {
    angles: "Opposés par le sommet : égaux. Adjacents sur une droite : 180°. Avec des parallèles, correspondants et alternes-internes : égaux. Angle au centre = 2 × angle inscrit.",
    cercthales: "Un triangle inscrit dans un demi-cercle est rectangle (le diamètre est l'hypoténuse). La tangente est perpendiculaire au rayon au point de contact.",
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    angles: ["Complément, opposés par le sommet, correspondants", "Parallèles, angle inscrit et angle au centre", "Équations d'angles, propriétés enchaînées, triangle isocèle dans le cercle"],
    cercthales: ["Cercle de Thalès, tangente et Pythagore", "Angles et rayons, cercle circonscrit", "Deux tangentes, aires, angle droit découpé"],
  });
})();
