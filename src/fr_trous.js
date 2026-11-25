// 25.11 (agent trous) · France, collège : derniers attendus calculables du programme (tools/france_couverture.md).
//  6e (cycle 3, 2025) : cercle6 (distance à un point, cercle et disque comme ensembles de points, EG.01, EG.04, EG.05),
//  bissec6 (bissectrice d'un angle : calculs, EG.11–12 ; reconnaître une bissectrice en 5e, EG.20), filtre6 (filtrer
//  les données d'un tableau selon un critère, DP.04) ; 5e (cycle 4, 2026) : tabform5 (tableaux de valeurs et
//  graphiques sans la notation f(x), PF.11, 12, 14, 15), hauteurs5 (hauteurs d'un triangle : aire, propriétés, EG.29–31).
// Notions sans CH ni MP : invisibles pour un élève suisse. Outils : FRX (src/fr_1re.js) ; leçons actives : TRX.toi.
(function () {
  if (typeof FRX === "undefined" || typeof TRX === "undefined") return;
  const { pk, nz, rnd, N, F, FS, X, QN, QR, QSet, GR, GSet, TR, P, reg } = FRX;
  const { W, toi, actReg } = TRX;
  const D = (v) => String(rnd(v, 6)).replace(".", ",");
  const dec = (a, b) => R.int(Math.round(a * 10), Math.round(b * 10)) / 10;
  const cm = (v) => M(N(v) + "\\text{ cm}"), dg = (v) => M(N(v) + "°");
  const TSt = (s, m) => ({ s, m });
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R.rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // ======================= cercle6 : distance à un point, cercle et disque (6e.EG.01, 04, 05) =======================
  const CE = {
    1: [
      () => { const d = dec(3, 15), toR = R.rand() < 0.6;
        return toR ? QN("Le segment " + M("[AB]") + " est un diamètre du cercle de centre " + M("O") + ", et " + M("AB = ") + cm(d) + ". Quelle est la distance " + M("OA") + " (en cm) ?", rnd(d / 2, 6),
            "Le centre " + M("O") + " est le milieu du diamètre : " + M("OA = " + N(d) + " \\div 2 = " + N(rnd(d / 2, 6))) + " cm. C'est le rayon : tous les points du cercle sont à cette distance de " + M("O") + ".",
            { ctx: "diametre-rayon", guide: [GR("Rayon = diamètre ÷ 2 ?", rnd(d / 2, 6), M(N(rnd(d / 2, 6))) + " cm.")], traps: [TR(d, "C'est le diamètre ; O est au milieu de [AB]."), TR(rnd(d * 2, 6), "Le rayon est la moitié du diamètre, pas le double.")] })
          : QN("Tous les points d'un cercle de centre " + M("O") + " sont à " + cm(d) + " de " + M("O") + ". Quelle est la longueur d'un diamètre de ce cercle (en cm) ?", rnd(d * 2, 6),
            "Un diamètre passe par le centre : il mesure deux rayons, " + M("2 \\times " + N(d) + " = " + N(rnd(2 * d, 6))) + " cm.",
            { ctx: "diametre-rayon", guide: [GR("Diamètre = 2 × rayon ?", rnd(2 * d, 6), M(N(rnd(2 * d, 6))) + " cm.")], traps: [TR(rnd(d / 2, 6), "Le diamètre est le double du rayon."), TR(d, "C'est le rayon.")] }); },
      () => { const o = R.int(5, 14); let r; do r = R.int(2, o - 1); while (2 * r === o); const v = [o - r, o + r];
        return QSet("Sur une droite graduée, le point " + M("O") + " a pour abscisse " + M(o) + ". Quelles sont les abscisses des points de la droite situés à " + M(r) + " unités de " + M("O") + " ? (sépare par « ; »)", v,
          "Il y en a deux, un de chaque côté de " + M("O") + " : " + M(o + " - " + r + " = " + (o - r)) + " et " + M(o + " + " + r + " = " + (o + r)) + ". Ce sont les points où le cercle de centre " + M("O") + " et de rayon " + M(r) + " coupe la droite.",
          { ctx: "graduee-distance", guide: [GR("Abscisse du point à gauche de " + M("O") + " ?", o - r, M(o - r) + "."), GSet("Les deux abscisses ?", v, M((o - r) + " \\,;\\, " + (o + r)) + ".")],
            traps: [TSt([o + r], "Il y a aussi un point de l'autre côté de O."), TSt([r], "On compte la distance à partir de O, pas à partir de 0."), TSt([o - r], "Il y a aussi un point à droite de O.")] }); },
      () => { const r = R.int(3, 8); let ds, v; do { ds = Array.from({ length: 5 }, () => (R.rand() < 0.25 ? r : dec(1, 2 * r))); v = ds.filter((d) => d <= r).length; } while (v < 2 || v > 4 || !ds.includes(r));
        const nm = ["A", "B", "C", "D", "E"];
        return QN("Le disque de centre " + M("O") + " et de rayon " + cm(r) + " est formé de tous les points situés à " + cm(r) + " ou moins de " + M("O") + ". On donne " + ds.map((d, i) => M("O" + nm[i] + " = " + N(d)) + " cm").join(", ") + ". Combien de ces cinq points sont dans le disque ?", v,
          "On garde les points dont la distance à " + M("O") + " est inférieure ou égale à " + M(r) + " : " + nm.filter((_, i) => ds[i] <= r).join(", ") + (ds.includes(r) ? " (un point à exactement " + r + " cm est sur le cercle, donc dans le disque)" : "") + " : " + v + ".",
          { ctx: "disque-ensemble", guide: [GR("Combien de points sont à moins de " + cm(r) + " (strictement) ?", ds.filter((d) => d < r).length, M(ds.filter((d) => d < r).length) + "."), GR("Avec ceux qui sont sur le cercle ?", v, M(v) + ".")],
            traps: [TR(ds.filter((d) => d < r).length, "Les points à exactement " + r + " cm sont sur le cercle : ils font partie du disque."), TR(5 - v, "Ce sont les points hors du disque.")] }); },
    ],
    2: [
      () => { const L = dec(6, 15), r = dec(2, L - 1.5), v = rnd(L - r, 6);
        return QN("Le cercle de centre " + M("A") + " et de rayon " + cm(r) + " coupe le segment " + M("[AB]") + " au point " + M("M") + ", et " + M("AB = ") + cm(L) + ". Calcule " + M("MB") + " (en cm).", v,
          M("M") + " est sur le cercle, donc " + M("AM = " + N(r)) + " cm (le rayon). " + M("MB = AB - AM = " + N(L) + " - " + N(r) + " = " + N(v)) + " cm.",
          { ctx: "segment-cercle", guide: [GR(M("AM") + " ?", r, M(N(r)) + " cm, le rayon."), GR(M("MB") + " ?", v, M(N(v)) + " cm.")], traps: [TR(rnd(L + r, 6), "M est entre A et B : on soustrait."), TR(r, "C'est AM ; on demande MB.")] }); },
      () => { const r = dec(2.5, 9), c = dec(1.5, 2 * r - 0.5), v = rnd(2 * r + c, 6);
        return QN("Les points " + M("A") + " et " + M("B") + " sont sur le cercle de centre " + M("O") + " et de rayon " + cm(r) + ", avec " + M("AB = ") + cm(c) + ". Calcule le périmètre du triangle " + M("OAB") + " (en cm).", v,
          M("OA = OB = " + N(r)) + " cm (deux rayons) : le triangle est isocèle en " + M("O") + ". Périmètre : " + M(N(r) + " + " + N(r) + " + " + N(c) + " = " + N(v)) + " cm.",
          { ctx: "triangle-rayons", guide: [GR(M("OA + OB") + " ?", rnd(2 * r, 6), M(N(rnd(2 * r, 6))) + " cm."), GR("Périmètre ?", v, M(N(v)) + " cm.")], traps: [TR(rnd(r + c, 6), "OA et OB sont deux rayons : compte-les tous les deux."), TR(rnd(4 * r + c, 6), "Ce sont des rayons, pas des diamètres.")] }); },
      () => { const a = R.int(1, 6), T = a + R.int(2, 6), b = T + R.int(2, 6), r1 = T - a, r2 = b - T;
        return QN("Sur une droite graduée, " + M("A") + " a pour abscisse " + M(a) + " et " + M("B") + " a pour abscisse " + M(b) + ". Un trésor est caché sur la droite, à " + M(r1) + " unités de " + M("A") + " et à " + M(r2) + " unités de " + M("B") + ". Quelle est son abscisse ?", T,
          "À " + M(r1) + " de " + M("A") + " : " + M(a - r1) + " ou " + M(a + r1) + ". À " + M(r2) + " de " + M("B") + " : " + M(b - r2) + " ou " + M(b + r2) + ". Le seul point commun est " + M(T) + ".",
          { ctx: "tresor", guide: [GSet("Points à " + M(r1) + " unités de " + M("A") + " ?", [a - r1, a + r1], M((a - r1) + " \\,;\\, " + (a + r1)) + "."), GR("Lequel est aussi à " + M(r2) + " unités de " + M("B") + " ?", T, M(T) + ".")],
            traps: [TR(a - r1, "Ce point est bien à " + r1 + " de A, mais pas à " + r2 + " de B."), TR(b + r2, "Ce point est à " + r2 + " de B, mais pas à " + r1 + " de A."), TR(r1 + r2, "On cherche une abscisse : pars de A (ou de B).")] }); },
    ],
    3: [
      () => { const d = R.int(6, 12), r = R.int(Math.ceil(d / 2), d - 1), s = R.int(d - r + 1, d), quad = R.rand() < 0.5, v = quad ? 2 * (r + s) : d + r + s;
        return QN("Les cercles de centre " + M("A") + ", de rayon " + cm(r) + ", et de centre " + M("B") + ", de rayon " + cm(s) + ", se coupent en deux points " + M("M") + " et " + M("N") + ", avec " + M("AB = ") + cm(d) + ". Calcule le périmètre " + (quad ? "du quadrilatère " + M("AMBN") : "du triangle " + M("AMB")) + " (en cm).", v,
          M("M") + " est sur les deux cercles : " + M("AM = " + r) + " cm et " + M("BM = " + s) + " cm" + (quad ? " ; de même " + M("AN = " + r) + " cm et " + M("BN = " + s) + " cm. Périmètre : " + M("2 \\times " + r + " + 2 \\times " + s + " = " + v) : ". Périmètre : " + M(d + " + " + r + " + " + s + " = " + v)) + " cm.",
          { ctx: "deux-cercles", guide: [GR(M("AM") + " ?", r, M(r) + " cm (rayon du cercle de centre A)."), GR(M("BM") + " ?", s, M(s) + " cm."), GR("Périmètre ?", v, M(v) + " cm.")],
            traps: [TR(quad ? d + r + s : 2 * (r + s), quad ? "Le quadrilatère AMBN a quatre côtés : AM, MB, BN, NA ([AB] est une diagonale)." : "Le triangle AMB a pour côtés AB, AM et BM."), TR(quad ? 2 * d : r + s, "Utilise les rayons : M et N sont sur les deux cercles.")] }); },
      () => { const L = R.int(3, 12), two = R.rand() < 0.5, d = R.int(2 * L + 3, 2 * L + 15), L2 = R.int(2, L), v = two ? d - L - L2 : 2 * L;
        return two ? QN("Deux chèvres sont attachées à deux piquets distants de " + M(d) + " m, par des cordes de " + M(L) + " m et " + M(L2) + " m. Quelle est la plus petite distance possible entre les deux chèvres (en m) ?", v,
            "Chaque chèvre reste dans un disque. Au plus près, elles sont sur le segment qui joint les piquets, chacune au bout de sa corde : " + M(d + " - " + L + " - " + L2 + " = " + v) + " m.",
            { ctx: "chevres", guide: [GR("Longueurs des deux cordes ensemble ?", L + L2, M(L + L2) + " m."), GR("Distance minimale ?", v, M(v) + " m.")], traps: [TR(d - L, "Les deux chèvres s'approchent : retire les deux cordes."), TR(d + L + L2, "C'est la plus grande distance possible.")] })
          : QN("Une chèvre est attachée à un piquet par une corde de " + M(L) + " m : elle broute dans un disque. Quelle est la plus grande distance possible entre deux points où elle broute (en m) ?", v,
            "Les deux points les plus éloignés du disque sont aux extrémités d'un diamètre : " + M("2 \\times " + L + " = " + v) + " m.",
            { ctx: "chevre-diametre", guide: [GR("Rayon du disque ?", L, M(L) + " m."), GR("Plus grande distance (un diamètre) ?", v, M(v) + " m.")], traps: [TR(L, "C'est la distance au piquet ; deux points opposés sont à deux rayons l'un de l'autre."), TR(L * L, "On cherche une longueur, pas une aire.")] }); },
      () => { const r1 = R.int(2, 6), r2 = r1 + R.int(3, 8), large = R.rand() < 0.5, v = large ? r2 - r1 + 1 : r2 - r1 - 1;
        return QN("On considère les points situés " + (large ? "à au moins " + cm(r1) + " et au plus " + cm(r2) : "à plus de " + cm(r1) + " et à moins de " + cm(r2)) + " d'un point " + M("O") + " (une couronne). Sur une demi-droite graduée d'origine " + M("O") + " (en cm), combien de points d'abscisse entière sont dans cette couronne ?", v,
          (large ? "Les abscisses vont de " + M(r1) + " à " + M(r2) + ", bornes comprises" : "Les abscisses sont strictement entre " + M(r1) + " et " + M(r2)) + " : de " + M(large ? r1 : r1 + 1) + " à " + M(large ? r2 : r2 - 1) + ", soit " + M(v) + " points.",
          { ctx: "couronne", guide: [GR("Plus petite abscisse entière qui convient ?", large ? r1 : r1 + 1, M(large ? r1 : r1 + 1) + "."), GR("Nombre de points ?", v, M(v) + ".")], traps: [TR(r2 - r1, "Compte un par un : " + (large ? "les deux bornes sont comprises." : "les bornes sont exclues.")), TR(large ? r2 - r1 - 1 : r2 - r1 + 1, large ? "« Au moins » et « au plus » : les bornes sont comprises." : "« Plus de » et « moins de » : les bornes sont exclues.")] }); },
    ],
  };

  // ======================= bissec6 : bissectrice d'un angle (6e.EG.11–12, 5e.EG.20) =======================
  const AG = (n) => M("\\widehat{" + n + "}");
  const BI = {
    1: [
      () => { const a = 2 * R.int(16, 80), v = a / 2;
        return QN("L'angle " + AG("xOy") + " mesure " + dg(a) + ". La demi-droite " + M("[Oz)") + " est sa bissectrice. Combien mesure " + AG("xOz") + " (en degrés) ?", v,
          "La bissectrice partage l'angle en deux angles de même mesure : " + M(N(a) + " \\div 2 = " + N(v)) + "°.",
          { ctx: "moitie", guide: [GR(AG("xOz") + " ?", v, M(N(v)) + "°.")], traps: [TR(a, "C'est l'angle entier ; la bissectrice le coupe en deux."), TR(180 - a, "La bissectrice partage l'angle xOy lui-même en deux.")] }); },
      () => { const b = R.int(14, 85), v = 2 * b;
        return QN("La demi-droite " + M("[Oz)") + " est la bissectrice de l'angle " + AG("xOy") + ", et " + AG("zOy") + " mesure " + dg(b) + ". Combien mesure " + AG("xOy") + " (en degrés) ?", v,
          AG("xOz") + " et " + AG("zOy") + " sont égaux : " + M("2 \\times " + b + " = " + v) + "°.",
          { ctx: "double", guide: [GR(AG("xOz") + " ?", b, M(b) + "°."), GR(AG("xOy") + " ?", v, M(v) + "°.")], traps: [TR(b / 2, "zOy est déjà la moitié : on double."), TR(b, "C'est seulement la moitié de l'angle.")] }); },
      () => { const a = 2 * R.int(20, 75); let b; do b = R.int(10, a - 10); while (Math.abs(b - a / 2) < 2); const v = Math.abs(b - a / 2);
        return QN("La demi-droite " + M("[Ot)") + " partage l'angle " + AG("xOy") + " de " + dg(a) + " en " + AG("xOt") + " = " + dg(b) + " et " + AG("tOy") + " = " + dg(a - b) + ". De combien de degrés faut-il la tourner pour qu'elle devienne la bissectrice ?", v,
          "La bissectrice ferait " + M(N(a) + " \\div 2 = " + N(a / 2)) + "° avec " + M("[Ox)") + " ; " + M("[Ot)") + " en fait " + M(b) + " : il faut la tourner de " + M(N(v)) + "°.",
          { ctx: "ecart-bissectrice", guide: [GR("Angle entre " + M("[Ox)") + " et la bissectrice ?", a / 2, M(N(a / 2)) + "°."), GR("Écart ?", v, M(N(v)) + "°.")], traps: [TR(Math.abs(a - 2 * b), "C'est la différence entre les deux angles ; tourner [Ot) en change deux à la fois : prends la moitié."), TR(a / 2, "On demande de combien tourner, pas la mesure de la moitié.")] }); },
    ],
    2: [
      () => { const a = 2 * R.int(20, 80), v = 180 - a / 2;
        return QN("L'angle " + AG("xOy") + " mesure " + dg(a) + " ; " + M("[Oz)") + " est sa bissectrice et " + M("[Ot)") + " est la demi-droite opposée à " + M("[Ox)") + " (" + AG("xOt") + " est un angle plat). Combien mesure " + AG("zOt") + " (en degrés) ?", v,
          AG("xOz") + " = " + M(N(a) + " \\div 2 = " + N(a / 2)) + "° ; " + AG("xOt") + " = 180° : " + AG("zOt") + " = " + M("180 - " + N(a / 2) + " = " + N(v)) + "°.",
          { ctx: "angle-plat", guide: [GR(AG("xOz") + " ?", a / 2, M(N(a / 2)) + "°."), GR(AG("zOt") + " ?", v, M(N(v)) + "°.")], traps: [TR(180 - a, "C'est l'angle yOt ; on mesure à partir de la bissectrice [Oz)."), TR(a / 2, "C'est xOz ; zOt complète jusqu'à l'angle plat.")] }); },
      () => { let B, C; do { B = R.int(30, 90); C = R.int(25, 90); } while ((180 - B - C) % 2 || 180 - B - C < 20); const A = 180 - B - C, v = A / 2;
        return QN("Dans le triangle " + M("ABC") + ", " + AG("ABC") + " = " + dg(B) + " et " + AG("ACB") + " = " + dg(C) + ". La bissectrice de l'angle " + AG("BAC") + " coupe " + M("[BC]") + " en " + M("D") + ". Combien mesure " + AG("BAD") + " (en degrés) ?", v,
          "Somme des angles : " + AG("BAC") + " = " + M("180 - " + B + " - " + C + " = " + A) + "°. La bissectrice le coupe en deux : " + M(A + " \\div 2 = " + v) + "°.",
          { ctx: "triangle", guide: [GR(AG("BAC") + " ?", A, M(A) + "°."), GR(AG("BAD") + " ?", v, M(v) + "°.")], traps: [TR(A, "C'est l'angle entier BAC ; la bissectrice le partage en deux."), TR((B + C) / 2, "Calcule d'abord l'angle en A (somme des angles = 180°).")] }); },
      () => { const b = R.int(30, 80), v = 90 - b;
        return QN("Le triangle " + M("ABC") + " est isocèle en " + M("A") + " et ses angles à la base mesurent " + dg(b) + ". On trace la bissectrice de l'angle " + AG("BAC") + ". Quelle est la mesure de chacun des deux angles qu'elle forme en " + M("A") + " (en degrés) ?", v,
          AG("BAC") + " = " + M("180 - 2 \\times " + b + " = " + (180 - 2 * b)) + "° ; sa bissectrice donne deux angles de " + M(N(v)) + "°. (Dans un triangle isocèle, elle est aussi l'axe de symétrie.)",
          { ctx: "isocele", guide: [GR(AG("BAC") + " ?", 180 - 2 * b, M(180 - 2 * b) + "°."), GR("Chaque moitié ?", v, M(N(v)) + "°.")], traps: [TR(180 - 2 * b, "C'est l'angle entier en A ; la bissectrice le coupe en deux."), TR(b / 2, "C'est l'angle au sommet A qu'on partage, pas un angle de la base.")] }); },
    ],
    3: [
      () => { let a, b; do { a = 2 * R.int(15, 60); b = 2 * R.int(15, 60); } while (a + b >= 178 || (a + b) % 2); const v = (a + b) / 2;
        return QN("Les angles " + AG("xOy") + " = " + dg(a) + " et " + AG("yOt") + " = " + dg(b) + " sont côte à côte (adjacents). " + M("[Ou)") + " est la bissectrice de " + AG("xOy") + " et " + M("[Ov)") + " celle de " + AG("yOt") + ". Combien mesure " + AG("uOv") + " (en degrés) ?", v,
          AG("uOy") + " = " + M(N(a / 2)) + "° et " + AG("yOv") + " = " + M(N(b / 2)) + "° : " + AG("uOv") + " = " + M(N(a / 2) + " + " + N(b / 2) + " = " + N(v)) + "°, la moitié de " + AG("xOt") + ".",
          { ctx: "deux-bissectrices", guide: [GR(AG("uOy") + " ?", a / 2, M(N(a / 2)) + "°."), GR(AG("yOv") + " ?", b / 2, M(N(b / 2)) + "°."), GR(AG("uOv") + " ?", v, M(N(v)) + "°.")], traps: [TR(a + b, "Chaque bissectrice ne garde que la moitié de son angle."), TR(Math.abs(a - b) / 2, "Les deux moitiés sont de part et d'autre de [Oy) : on les additionne.")] }); },
      () => { const b = R.int(25, 80); let c; do c = R.int(5, b - 5); while (c === b - c); const v = 2 * b - c;
        return QN("Dans l'angle " + AG("xOy") + ", on trace la bissectrice " + M("[Oz)") + " ; " + AG("zOy") + " = " + dg(b) + ". Une demi-droite " + M("[Ot)") + " est entre " + M("[Ox)") + " et " + M("[Oz)") + ", avec " + AG("xOt") + " = " + dg(c) + ". Combien mesure " + AG("tOy") + " (en degrés) ?", v,
          AG("xOy") + " = " + M("2 \\times " + b + " = " + 2 * b) + "° ; " + AG("tOy") + " = " + M(2 * b + " - " + c + " = " + v) + "°.",
          { ctx: "trois-demi-droites", guide: [GR(AG("xOy") + " ?", 2 * b, M(2 * b) + "°."), GR(AG("tOy") + " ?", v, M(v) + "°.")], traps: [TR(b - c, "C'est l'angle tOz ; ajoute encore zOy."), TR(b + c, "[Ot) est entre [Ox) et [Oz) : tOy = xOy − xOt.")] }); },
      () => { const a = 4 * R.int(8, 40), v = (3 * a) / 4;
        return QN("L'angle " + AG("xOy") + " mesure " + dg(a) + ". On trace sa bissectrice " + M("[Oz)") + ", puis la bissectrice " + M("[Ow)") + " de l'angle " + AG("xOz") + ". Combien mesure " + AG("wOy") + " (en degrés) ?", v,
          AG("xOz") + " = " + M(N(a / 2)) + "°, " + AG("xOw") + " = " + M(N(a / 4)) + "° ; " + AG("wOy") + " = " + M(N(a) + " - " + N(a / 4) + " = " + N(v)) + "°.",
          { ctx: "bissectrice-de-bissectrice", guide: [GR(AG("xOz") + " ?", a / 2, M(N(a / 2)) + "°."), GR(AG("xOw") + " ?", a / 4, M(N(a / 4)) + "°."), GR(AG("wOy") + " ?", v, M(N(v)) + "°.")], traps: [TR(a / 4, "C'est xOw ; on demande wOy."), TR(a / 2, "[Ow) n'est pas la bissectrice de xOy, mais celle de xOz.")] }); },
    ],
  };

  // ======================= filtre6 : filtrer les données d'un tableau (6e.DP.04) =======================
  const SORTIES = ["Musée", "Zoo", "Cinéma", "Piscine", "Château", "Parc", "Ferme", "Théâtre", "Port", "Cirque", "Jardin", "Grotte"];
  const table = () => { const names = shuffle(SORTIES.slice()).slice(0, 6); return names.map((n) => ({ n, p: R.int(4, 30), d: pk([1, 1.5, 2, 2.5, 3, 3.5, 4]), k: R.int(5, 60), e: R.int(2, 5) })); };
  const tabT = (rows) => M("\\begin{array}{l|c|c|c|c} \\text{Sortie} & \\text{Prix (€)} & \\text{Durée (h)} & \\text{Dist. (km)} & \\text{Note} \\\\ \\hline " + rows.map((r) => "\\text{" + r.n + "} & " + r.p + " & " + N(r.d) + " & " + r.k + " & " + r.e).join(" \\\\ ") + " \\end{array}");
  const INTRO = "Une classe compare des sorties (note des élèves sur 5) :<br>";
  const ok2 = (c, n = 6) => c >= 2 && c <= n - 1;
  const FI = {
    1: [
      () => { let rows, s, v; do { rows = table(); s = pk([10, 12, 15, 20]); v = rows.filter((r) => r.p < s).length; } while (!ok2(v));
        return QN(INTRO + tabT(rows) + "<br>Combien de sorties coûtent moins de " + M(s) + " € ?", v, "On garde les prix inférieurs à " + M(s) + " : " + rows.filter((r) => r.p < s).map((r) => r.n + " (" + r.p + " €)").join(", ") + ", soit " + M(v) + ".",
          { shownOk: true, ctx: "un-critere", guide: [GR("Nombre de sorties à moins de " + M(s) + " € ?", v, M(v) + ".")], traps: [TR(6 - v, "Ce sont celles qui coûtent " + s + " € ou plus."), TR(rows.filter((r) => r.p <= s).length, "« Moins de " + s + " € » : une sortie à " + s + " € exactement ne compte pas.")] }); },
      () => { let rows, t, L, v; do { rows = table(); t = pk([2, 2.5, 3]); L = rows.filter((r) => r.d < t); v = L.length ? Math.min(...L.map((r) => r.p)) : 0; } while (L.length < 2 || L.length > 5 || v === Math.min(...rows.map((r) => r.p)));
        return QN(INTRO + tabT(rows) + "<br>Parmi les sorties qui durent moins de " + M(N(t)) + " h, quel est le prix de la moins chère (en €) ?", v,
          "Sorties de moins de " + M(N(t)) + " h : " + L.map((r) => r.n + " (" + r.p + " €)").join(", ") + ". La moins chère coûte " + M(v) + " €.",
          { shownOk: true, ctx: "min-sous-critere", guide: [GR("Combien de sorties durent moins de " + M(N(t)) + " h ?", L.length, M(L.length) + "."), GR("Prix de la moins chère parmi elles ?", v, M(v) + " €.")], traps: [TR(Math.min(...rows.map((r) => r.p)), "C'est la moins chère de toutes ; il faut d'abord garder celles de moins de " + D(t) + " h."), TR(Math.max(...L.map((r) => r.p)), "C'est la plus chère du groupe.")] }); },
      () => { let rows, s, t, v; do { rows = table(); s = pk([15, 20, 25]); t = pk([2, 2.5, 3]); v = rows.filter((r) => r.p <= s && r.d >= t).length; } while (!ok2(v, 5));
        return QN(INTRO + tabT(rows) + "<br>Combien de sorties coûtent au plus " + M(s) + " € <b>et</b> durent au moins " + M(N(t)) + " h ?", v,
          "Les deux conditions à la fois : " + rows.filter((r) => r.p <= s && r.d >= t).map((r) => r.n).join(", ") + ", soit " + M(v) + ".",
          { shownOk: true, ctx: "deux-criteres", guide: [GR("Combien coûtent au plus " + M(s) + " € ?", rows.filter((r) => r.p <= s).length, M(rows.filter((r) => r.p <= s).length) + "."), GR("Parmi elles, combien durent au moins " + M(N(t)) + " h ?", v, M(v) + ".")], traps: [TR(rows.filter((r) => r.p <= s || r.d >= t).length, "« Et » : il faut les deux conditions en même temps."), TR(rows.filter((r) => r.p <= s).length, "Il faut aussi vérifier la durée.")] }); },
    ],
    2: [
      () => { let rows, k, e, v; do { rows = table(); k = pk([15, 20, 25]); e = pk([4, 5]); v = rows.filter((r) => r.k < k || r.e >= e).length; } while (!ok2(v) || v === rows.filter((r) => r.k < k).length);
        return QN(INTRO + tabT(rows) + "<br>Combien de sorties sont à moins de " + M(k) + " km <b>ou</b> ont une note d'au moins " + M(e) + " ? (une sortie qui vérifie les deux compte une fois)", v,
          "« Ou » : au moins une des deux conditions. " + rows.filter((r) => r.k < k || r.e >= e).map((r) => r.n).join(", ") + " : " + M(v) + ".",
          { shownOk: true, ctx: "ou", guide: [GR("Combien sont à moins de " + M(k) + " km ?", rows.filter((r) => r.k < k).length, M(rows.filter((r) => r.k < k).length) + "."), GR("Total avec celles qui ont une note d'au moins " + M(e) + " (sans compter deux fois) ?", v, M(v) + ".")], traps: [TR(rows.filter((r) => r.k < k && r.e >= e).length, "« Ou » : une seule des deux conditions suffit."), TR(rows.filter((r) => r.k < k).length + rows.filter((r) => r.e >= e).length, "Une sortie qui vérifie les deux ne compte qu'une fois.")] }); },
      () => { let rows, k, L, best; do { rows = table(); k = pk([20, 25, 30]); L = rows.filter((r) => r.k <= k); best = L.length ? Math.max(...L.map((r) => r.e)) : 0; } while (L.length < 2 || L.filter((r) => r.e === best).length !== 1);
        const w = L.find((r) => r.e === best), v = w.p;
        return QN(INTRO + tabT(rows) + "<br>La classe choisit, parmi les sorties à " + M(k) + " km au plus, celle qui a la meilleure note. Combien coûte-t-elle (en €) ?", v,
          "À " + M(k) + " km au plus : " + L.map((r) => r.n + " (note " + r.e + ")").join(", ") + ". La meilleure note est " + M(best) + " : " + w.n + ", " + M(v) + " €.",
          { shownOk: true, ctx: "choix", guide: [GR("Meilleure note parmi les sorties à " + M(k) + " km au plus ?", best, M(best) + "."), GR("Prix de cette sortie ?", v, M(v) + " €.")], traps: [TR(Math.min(...L.map((r) => r.p)), "On choisit la meilleure note, pas le prix le plus bas."), TR(best, "On demande le prix de la sortie choisie.")] }); },
      () => { let rows, t, L, v; do { rows = table(); t = pk([2, 2.5, 3]); L = rows.filter((r) => r.d > t); v = L.reduce((s, r) => s + r.p, 0); } while (!ok2(L.length));
        return QN(INTRO + tabT(rows) + "<br>Combien coûtent en tout les sorties qui durent plus de " + M(N(t)) + " h (en €) ?", v,
          "Plus de " + M(N(t)) + " h : " + L.map((r) => r.n + " (" + r.p + " €)").join(", ") + ". Total : " + M(L.map((r) => r.p).join(" + ") + " = " + v) + " €.",
          { shownOk: true, ctx: "total", guide: [GR("Combien de sorties durent plus de " + M(N(t)) + " h ?", L.length, M(L.length) + "."), GR("Total des prix ?", v, M(v) + " €.")], traps: [TR(rows.filter((r) => r.d >= t).reduce((s, r) => s + r.p, 0), "« Plus de " + D(t) + " h » : une durée de " + D(t) + " h exactement ne compte pas."), TR(rows.reduce((s, r) => s + r.p, 0), "On n'additionne que les sorties qui vérifient le critère.")] }); },
    ],
    3: [
      () => { let rows, s, k, e, v; do { rows = table(); s = pk([15, 20, 25]); k = pk([20, 30, 40]); e = pk([3, 4]); v = rows.filter((r) => r.p <= s && r.k <= k && r.e >= e).length; } while (v < 2);
        return QN(INTRO + tabT(rows) + "<br>Combien de sorties coûtent au plus " + M(s) + " €, sont à " + M(k) + " km au plus <b>et</b> ont une note d'au moins " + M(e) + " ?", v,
          "On filtre trois fois : " + rows.filter((r) => r.p <= s && r.k <= k && r.e >= e).map((r) => r.n).join(", ") + " : " + M(v) + ".",
          { shownOk: true, ctx: "trois-criteres", guide: [GR("Après le premier critère (prix), combien en reste-t-il ?", rows.filter((r) => r.p <= s).length, M(rows.filter((r) => r.p <= s).length) + "."), GR("Après les deux premiers (prix, distance) ?", rows.filter((r) => r.p <= s && r.k <= k).length, M(rows.filter((r) => r.p <= s && r.k <= k).length) + "."), GR("Avec les trois ?", v, M(v) + ".")],
            traps: [TR(rows.filter((r) => r.p <= s && r.k <= k).length, "Il reste à vérifier la note."), TR(rows.filter((r) => r.p <= s || r.k <= k || r.e >= e).length, "Les trois conditions doivent être vraies en même temps.")] }); },
      () => { let rows, B, t, L, v; do { rows = table(); t = pk([2, 2.5]); B = pk([30, 40, 50]); L = rows.filter((r) => r.d >= t).map((r) => r.p).sort((a, b) => a - b); v = 0; let s = 0; for (const p of L) if (s + p <= B) { s += p; v++; } } while (v < 2 || v === L.length);
        return QN(INTRO + tabT(rows) + "<br>Avec un budget de " + M(B) + " €, combien de sorties différentes durant au moins " + M(N(t)) + " h peut-on faire au maximum ?", v,
          "Sorties d'au moins " + M(N(t)) + " h, de la moins chère à la plus chère : " + M(L.join(" ; ")) + " €. On en prend le plus possible en commençant par les moins chères : " + M(v) + " (" + M(L.slice(0, v).join(" + ") + " = " + L.slice(0, v).reduce((a, b) => a + b, 0)) + " € ; une de plus dépasserait " + M(B) + " €).",
          { shownOk: true, ctx: "budget", guide: [GR("Combien de sorties durent au moins " + M(N(t)) + " h ?", L.length, M(L.length) + "."), GR("Nombre maximal dans le budget ?", v, M(v) + ".")], traps: [TR(L.length, "Toutes ne tiennent pas dans le budget de " + B + " € : additionne les prix."), TR(v - 1, "Commence par les moins chères : une de plus rentre.")] }); },
      () => { let rows, k, L, v; do { rows = table(); k = pk([20, 30, 40]); L = rows.filter((r) => r.k < k); v = L.length ? Math.max(...L.map((r) => r.p)) - Math.min(...L.map((r) => r.p)) : 0; } while (L.length < 3 || v < 2);
        return QN(INTRO + tabT(rows) + "<br>Parmi les sorties à moins de " + M(k) + " km, quel est l'écart de prix entre la plus chère et la moins chère (en €) ?", v,
          "Moins de " + M(k) + " km : " + L.map((r) => r.n + " (" + r.p + " €)").join(", ") + ". Écart : " + M(Math.max(...L.map((r) => r.p)) + " - " + Math.min(...L.map((r) => r.p)) + " = " + v) + " €.",
          { shownOk: true, ctx: "ecart", guide: [GR("Prix le plus élevé parmi elles ?", Math.max(...L.map((r) => r.p)), M(Math.max(...L.map((r) => r.p))) + " €."), GR("Écart ?", v, M(v) + " €.")], traps: [TR(Math.max(...rows.map((r) => r.p)) - Math.min(...rows.map((r) => r.p)), "On ne garde que les sorties à moins de " + k + " km."), TR(Math.max(...L.map((r) => r.p)), "C'est le prix le plus élevé ; retire le plus bas.")] }); },
    ],
  };

  // ======================= tabform5 : tableaux de valeurs et graphiques (5e.PF.11, 12, 14, 15) =======================
  /* formules sans f(x) : [grandeur, formule TeX, calcul, variable, unité] */
  const FORM = [
    () => { const a = pk([2.5, 3, 4, 6]), b = R.int(2, 9); return ["le prix à payer (en €) pour " + M("n") + " places, frais de réservation compris", "\\text{prix} = " + N(a) + " \\times n + " + b, (n) => a * n + b, "n", "€", (n) => a * (n + b), "On multiplie d'abord, puis on ajoute " + b + "."]; },
    () => { const b = R.int(4, 9); return ["le périmètre (en cm) d'un rectangle de largeur " + M("x") + " cm", "\\text{périmètre} = 2 \\times (x + " + b + ")", (x) => 2 * (x + b), "x", "cm", (x) => 2 * x + b, "Les parenthèses d'abord : x + " + b + ", puis × 2."]; },
    () => { const t0 = R.int(15, 25), r = pk([2, 3, 4]); return ["la température (en °C) à l'intérieur d'un congélateur, " + M("t") + " heures après sa mise en marche" /* 26.11 (vraisemblance) : un liquide ne perd pas 4 °C par minute */, "\\text{température} = " + t0 + " - " + r + " \\times t", (t) => t0 - r * t, "t", "°C", (t) => (t0 - r) * t, "La multiplication " + r + " × t passe avant la soustraction."]; },
    () => { const c = R.int(1, 5); return ["l'aire (en cm²) d'une figure formée d'un carré de côté " + M("x") + " cm et d'un rectangle de " + c + " cm²", "\\text{aire} = x \\times x + " + c, (x) => x * x + c, "x", "cm²", (x) => 2 * x + c, "x × x, c'est x fois x (le carré), pas 2 fois x."]; },
  ];
  const TF = {
    1: [
      () => { const [g, f, h, x, , w, wm] = pk(FORM)(), xv = R.int(3, 12), v = rnd(h(xv), 6);
        return QN("La formule " + M(f) + " donne " + g + ". Calcule cette grandeur pour " + M(x + " = " + xv) + ".", v,
          "On remplace " + M(x) + " par " + M(xv) + " et on calcule en respectant les priorités : " + M(N(v)) + ".",
          { ctx: "formule-valeur", guide: [GR("Résultat pour " + M(x + " = " + xv) + " ?", v, M(N(v)) + ".")], traps: [TR(rnd(w(xv), 6), wm), TR(rnd(h(xv + 1), 6), "Remplace " + x + " par " + xv + " exactement.")] }); },
      () => { const [g, f, h, x, , w, wm] = pk(FORM)(), xs = [1, 2, 3, R.int(5, 10)], ys = xs.map((t) => rnd(h(t), 6)), k = R.int(0, 3), v = ys[k];
        return QN("La formule " + M(f) + " donne " + g + ". Complète le tableau de valeurs : quel nombre remplace « ? »<br>" + M("\\begin{array}{c|cccc} " + x + " & " + xs.join(" & ") + " \\\\ \\hline \\text{valeur} & " + ys.map((y, i) => (i === k ? "?" : N(y))).join(" & ") + " \\end{array}"), v,
          "Pour " + M(x + " = " + xs[k]) + ", la formule donne " + M(N(v)) + ".",
          { ctx: "tableau-formule", guide: [GR("Valeur pour " + M(x + " = " + xs[k]) + " ?", v, M(N(v)) + ".")], traps: [TR(rnd(w(xs[k]), 6), wm), TR(rnd(h(xs[k] + 1), 6), "Prends la valeur de " + x + " de la colonne du « ? ».")] }); },
      () => { const xs = [1, 2, 3, 4, 5, 6].map((t) => t * pk([1, 2])), mult = R.int(3, 9), add = R.int(0, 9), ys = xs.map((t) => mult * t + add), k = R.int(1, 5), y = ys[k], v = xs[k];
        return QN("Le tableau donne la masse (en g) d'un sac selon le nombre " + M("n") + " de billes qu'il contient :<br>" + M("\\begin{array}{c|cccccc} n & " + xs.join(" & ") + " \\\\ \\hline \\text{masse (g)} & " + ys.join(" & ") + " \\end{array}") + "<br>Combien de billes contient un sac de " + M(y) + " g ?", v,
          "On cherche " + M(y) + " dans la ligne des masses, puis on lit le nombre de billes au-dessus : " + M(v) + ".",
          { ctx: "lecture-inverse", guide: [GR("Nombre de billes au-dessus de " + M(y) + " g ?", v, M(v) + ".")], traps: [TR(y, "C'est la masse ; on lit le nombre de billes, dans la première ligne."), TR(xs[k - 1], "Regarde la colonne de " + y + " g exactement.")] }); },
    ],
    2: [
      () => { const [g, f, h, x, , w, wm] = pk(FORM.slice(1))(), xv = R.int(3, 9), v = rnd(h(xv), 6);
        return QN("La formule " + M(f) + " donne " + g + ". Calcule-la pour " + M(x + " = " + xv) + " (attention aux priorités).", v,
          "Parenthèses et multiplications d'abord : " + M("= " + N(v)) + ".",
          { ctx: "deux-etapes", guide: [GR("Résultat ?", v, M(N(v)) + ".")], traps: [TR(rnd(w(xv), 6), wm), TR(rnd(h(xv + 1), 6), "Remplace " + x + " par " + xv + " exactement.")] }); },
      () => { const a = R.int(2, 9), b = R.int(2, 15), xs = [1, 2, 3, 4], ys = xs.map((t) => a * t + b);
        return QN("Ce tableau a été fait avec la formule " + M("y = " + a + " \\times x + \\ldots") + " :<br>" + M("\\begin{array}{c|cccc} x & 1 & 2 & 3 & 4 \\\\ \\hline y & " + ys.join(" & ") + " \\end{array}") + "<br>Quel nombre manque dans la formule ?", b,
          "Pour " + M("x = 1") + " : " + M(a + " \\times 1 = " + a) + " et " + M("y = " + ys[0]) + " : il manque " + M(ys[0] + " - " + a + " = " + b) + ". Vérification avec " + M("x = 2") + " : " + M(a + " \\times 2 + " + b + " = " + ys[1]) + ".",
          { ctx: "retrouver-nombre", guide: [GR(M(a + " \\times 1") + " ?", a, M(a) + "."), GR("Nombre manquant ?", b, M(b) + ".")], traps: [TR(ys[0], "C'est y pour x = 1 ; retire " + a + " × 1."), TR(ys[1] - ys[0], "C'est l'écart entre deux valeurs (le " + a + " de la formule).")] }); },
      () => { const a = pk([0.5, 1, 2]), b = R.int(-2, 4), xs0 = [-4, -2, 0, 2, 4], k = pk([-3, -1, 1, 3, 5].filter((t) => a * t + b === Math.round(a * t + b) && Math.abs(a * t + b) <= 8)), v = a * k + b, f = (t) => a * t + b;
        if (k === undefined || v === 0) return null;
        return QN("Le graphique montre comment une grandeur " + M("y") + " dépend d'une grandeur " + M("x") + ". Lis la valeur de " + M("y") + " pour " + M("x = " + N(k)) + ".", v,
          "On part de " + M(N(k)) + " sur l'axe horizontal, on monte (ou on descend) jusqu'à la droite, puis on lit sur l'axe vertical : " + M(N(v)) + ".",
          { ctx: "graphique-lecture", fig: FIG.plot([{ f }], xs0.map((t) => [t, f(t), ""]).filter((p) => Math.abs(p[1]) <= 8), { numbers: true, xr: [-6, 6], yr: [-6, 8], maxH: 300, label: "graphique" }),
            guide: [GR("Valeur lue de " + M("y") + " ?", v, M(N(v)) + ".")], traps: [TR(k, "C'est la valeur de x ; on lit y sur l'axe vertical."), TR(rnd(v + a * 2, 6), "Pars bien de x = " + D(k) + ".")] }); },
    ],
    3: [
      () => { const pa = pk([2, 3, 4]), pb = pa + pk([1, 2, 3]), fix = (pb - pa) * R.int(3, 9), v = fix / (pb - pa);
        return QN("Une piscine propose deux tarifs : tarif A, " + M(fix) + " € d'abonnement puis " + M(pa) + " € par entrée ; tarif B, " + M(pb) + " € par entrée sans abonnement. Pour combien d'entrées les deux tarifs coûtent-ils la même somme ?", v,
          "Tarif A : " + M(fix + " + " + pa + " \\times n") + " ; tarif B : " + M(pb + " \\times n") + ". Chaque entrée coûte " + M(pb - pa) + " € de plus en B ; l'abonnement est rattrapé après " + M(fix + " \\div " + (pb - pa) + " = " + v) + " entrées (" + M(pb * v) + " € des deux côtés).",
          { ctx: "deux-tarifs", guide: [GR("Écart de prix par entrée ?", pb - pa, M(pb - pa) + " €."), GR("Nombre d'entrées ?", v, M(v) + ".")], traps: [TR(fix / pa, "L'abonnement se rattrape avec l'écart par entrée (" + (pb - pa) + " €)."), TR(fix / pb, "Compare les deux tarifs : divise par l'écart " + (pb - pa) + " €.")] }); },
      () => { const h = R.int(-2, 2), m = pk([1, 2, 3]), k = R.int(-3, 1), f = (t) => (t - h) ** 2 + k, y = m * m + k, v = [h - m, h + m];
        if (y === h + m || y === h - m) return null;
        return QSet("Le graphique montre comment une grandeur " + M("y") + " dépend de " + M("x") + ". Pour quelles valeurs de " + M("x") + " la grandeur " + M("y") + " vaut-elle " + M(y) + " ? (sépare par « ; »)", v,
          "On trace la droite horizontale à la hauteur " + M(y) + " : elle coupe la courbe en deux points, d'abscisses " + M(h - m) + " et " + M(h + m) + ".",
          { ctx: "graphique-valeurs", fig: FIG.plot([{ f }, { f: () => y, cls: "f-line", dash: true }], [], { numbers: true, xr: [-6, 6], yr: [Math.min(-2, k - 1), 9], maxH: 300, label: "courbe" }),
            guide: [GR("En combien de points la droite " + M("y = " + y) + " coupe-t-elle la courbe ?", 2, "En deux points."), GSet("Valeurs de " + M("x") + " ?", v, M((h - m) + " \\,;\\, " + (h + m)) + ".")],
            traps: [TSt([h + m], "Il y a un second point, de l'autre côté."), TSt([y], "On cherche des valeurs de x (axe horizontal).")] }); },
      () => { const a = pk([1.5, 2.5, 3, 4]), b = R.int(2, 12), x1 = R.int(2, 6), x2 = x1 + R.int(2, 6), v = rnd(a * (x2 - x1), 6);
        return QN("Avec la formule " + M("\\text{coût} = " + N(a) + " \\times n + " + b) + " (en €), de combien le coût augmente-t-il quand " + M("n") + " passe de " + M(x1) + " à " + M(x2) + " (en €) ?", v,
          "Coût pour " + M(x1) + " : " + M(N(rnd(a * x1 + b, 6))) + " € ; pour " + M(x2) + " : " + M(N(rnd(a * x2 + b, 6))) + " €. Augmentation : " + M(N(v)) + " € (" + M(N(a) + " \\times " + (x2 - x1)) + " : le " + M(b) + " ne change pas).",
          { ctx: "variation", guide: [GR("Coût pour " + M("n = " + x1) + " ?", rnd(a * x1 + b, 6), M(N(rnd(a * x1 + b, 6))) + " €."), GR("Coût pour " + M("n = " + x2) + " ?", rnd(a * x2 + b, 6), M(N(rnd(a * x2 + b, 6))) + " €."), GR("Augmentation ?", v, M(N(v)) + " €.")], traps: [TR(rnd(a * x2 + b, 6), "C'est le coût pour " + x2 + " ; on demande l'augmentation."), TR(rnd(v + b, 6), "Les " + b + " € fixes sont payés dans les deux cas : ils ne comptent pas dans l'augmentation.")] }); },
    ],
  };

  // ======================= hauteurs5 : hauteurs d'un triangle (5e.EG.29–31) =======================
  const HA = {
    1: [
      () => { const b = dec(3, 14), h = dec(2, 10), v = rnd((b * h) / 2, 6);
        return QN("Dans le triangle " + M("ABC") + ", " + M("BC = ") + cm(b) + " et la hauteur issue de " + M("A") + " mesure " + cm(h) + ". Calcule l'aire du triangle (en cm²).", v,
          M("\\mathcal{A} = \\text{base} \\times \\text{hauteur} \\div 2 = " + N(b) + " \\times " + N(h) + " \\div 2 = " + N(v)) + " cm².",
          { ctx: "aire", guide: [GR(M(N(b) + " \\times " + N(h)) + " ?", rnd(b * h, 6), M(N(rnd(b * h, 6)))), GR("Aire ?", v, M(N(v)) + " cm².")], traps: [TR(rnd(b * h, 6), "N'oublie pas de diviser par 2."), TR(rnd(b + h, 6), "L'aire est un produit, pas une somme.")] }); },
      () => { const b = R.int(4, 16), h = R.int(3, 12), A = (b * h) / 2;
        return QN("Un triangle a une aire de " + M(N(A)) + " cm². Le côté " + M("[BC]") + " mesure " + cm(b) + ". Quelle est la hauteur relative à ce côté (en cm) ?", h,
          M("\\text{base} \\times \\text{hauteur} = 2 \\times " + N(A) + " = " + b * h) + ", donc " + M("\\text{hauteur} = " + b * h + " \\div " + b + " = " + h) + " cm.",
          { ctx: "hauteur-depuis-aire", guide: [GR(M("2 \\times \\text{aire}") + " ?", b * h, M(b * h) + "."), GR("Hauteur ?", h, M(h) + " cm.")], traps: [TR(rnd(A / b, 6), "Aire = base × hauteur ÷ 2 : multiplie d'abord l'aire par 2."), TR(rnd(2 * A * b, 6), "On divise par la base.")] }); },
      () => { const a = R.int(3, 14), b = R.int(3, 14), v = (a * b) / 2;
        return QN("Le triangle " + M("ABC") + " est rectangle en " + M("A") + ", avec " + M("AB = ") + cm(a) + " et " + M("AC = ") + cm(b) + ". Calcule son aire (en cm²).", v,
          "Dans un triangle rectangle, chaque côté de l'angle droit est une hauteur relative à l'autre : " + M("\\mathcal{A} = " + a + " \\times " + b + " \\div 2 = " + N(v)) + " cm².",
          { ctx: "rectangle-hauteurs", guide: [GR("Hauteur relative à " + M("[AC]") + " ?", a, M("AB = " + a) + " cm."), GR("Aire ?", v, M(N(v)) + " cm².")], traps: [TR(a * b, "N'oublie pas de diviser par 2."), TR(rnd((a + b) / 2, 6), "Base × hauteur : on multiplie.")] }); },
    ],
    2: [
      () => { /* triangles réels [AB, hauteur issue de C, BC, hauteur issue de A] (côtés et aires entiers) */
        const [c, hc, a, v] = pk([[6, 4, 5, 4.8], [12, 8, 10, 9.6], [18, 12, 15, 14.4], [14, 24, 25, 13.44], [14, 12, 15, 11.2], [15, 5.6, 20, 4.2], [15, 5.6, 7, 12], [10, 16.8, 21, 8], [21, 8, 10, 16.8]]), A = rnd((c * hc) / 2, 6);
        return QN("Dans le triangle " + M("ABC") + ", " + M("AB = ") + cm(c) + " et la hauteur issue de " + M("C") + " mesure " + cm(hc) + ". De plus " + M("BC = ") + cm(a) + ". Quelle est la longueur de la hauteur issue de " + M("A") + " (en cm) ?", v,
          "L'aire se calcule avec n'importe quelle base et sa hauteur : " + M(N(c) + " \\times " + N(hc) + " \\div 2 = " + N(A)) + " cm². Avec la base " + M("[BC]") + " : " + M("\\text{hauteur} = 2 \\times " + N(A) + " \\div " + a + " = " + N(v)) + " cm.",
          { ctx: "deux-hauteurs", guide: [GR("Aire du triangle ?", A, M(N(A)) + " cm²."), GR("Hauteur issue de " + M("A") + " ?", v, M(N(v)) + " cm.")], traps: [TR(hc, "Chaque hauteur dépend de son côté : l'aire est la même, pas la hauteur."), TR(rnd(A / a, 6), "Aire = base × hauteur ÷ 2 : hauteur = 2 × aire ÷ base.")] }); },
      () => { const B = R.int(25, 80), v = 90 - B;
        return QN("Dans le triangle " + M("ABC") + ", " + AG("ABC") + " = " + dg(B) + ". La hauteur issue de " + M("A") + " coupe " + M("[BC]") + " en " + M("H") + ". Combien mesure " + AG("BAH") + " (en degrés) ?", v,
          "La hauteur est perpendiculaire à " + M("(BC)") + " : le triangle " + M("ABH") + " est rectangle en " + M("H") + ". " + AG("BAH") + " = " + M("180 - 90 - " + B + " = " + v) + "°.",
          { ctx: "angle-hauteur", guide: [GR("Angle " + AG("AHB") + " ?", 90, "90° : la hauteur est perpendiculaire au côté."), GR(AG("BAH") + " ?", v, M(v) + "°.")], traps: [TR(180 - B, "Le triangle ABH a aussi un angle droit en H."), TR(B, "Ce n'est pas l'angle en B.")] }); },
      () => { const b = R.int(3, 10), h = R.int(3, 9), out = R.int(1, 4), v = (b * h) / 2;
        return QN("Le triangle " + M("ABC") + " a un angle obtus en " + M("B") + ", et la hauteur issue de " + M("A") + " tombe sur le prolongement de " + M("[BC]") + ", en " + M("H") + ", à " + cm(out) + " de " + M("B") + ". On a " + M("BC = ") + cm(b) + " et " + M("AH = ") + cm(h) + ". Calcule l'aire du triangle " + M("ABC") + " (en cm²).", v,
          "La formule reste la même, avec la base " + M("[BC]") + " et la hauteur " + M("[AH]") + " (à l'extérieur du triangle) : " + M(b + " \\times " + h + " \\div 2 = " + N(v)) + " cm². La distance " + M("BH") + " ne sert pas.",
          { ctx: "obtus", guide: [GR("Base ?", b, M(b) + " cm."), GR("Aire ?", v, M(N(v)) + " cm².")], traps: [TR(((b + out) * h) / 2, "C'est l'aire du triangle AHC ; la base de ABC est [BC] seulement."), TR(b * h, "N'oublie pas de diviser par 2.")] }); },
    ],
    3: [
      () => { const [a, b, c] = pk([[6, 8, 10], [3, 4, 5], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20]]), v = (a * b) / c; /* 26.11 (recalcul) : valeur exacte (r6 refusait la fraction exacte) */ const gd = ((u, w) => { while (w) [u, w] = [w, u % w]; return u; })(a * b, c), vT = Math.abs(v * 1e4 - Math.round(v * 1e4)) < 1e-6 ? N(v) : "\\frac{" + (a * b) / gd + "}{" + c / gd + "} \\approx " + N(Math.round(v * 100) / 100);
        return QN("Le triangle " + M("ABC") + " est rectangle en " + M("A") + ", avec " + M("AB = ") + cm(a) + ", " + M("AC = ") + cm(b) + " et " + M("BC = ") + cm(c) + ". Calcule la hauteur issue de " + M("A") + " (en cm).", v,
          "Aire avec les côtés de l'angle droit : " + M(a + " \\times " + b + " \\div 2 = " + N((a * b) / 2)) + " cm². Avec la base " + M("[BC]") + " : " + M("\\text{hauteur} = 2 \\times " + N((a * b) / 2) + " \\div " + c + " = " + vT) + " cm.",
          { ctx: "hauteur-hypotenuse", guide: [GR("Aire ?", (a * b) / 2, M(N((a * b) / 2)) + " cm²."), GR("Hauteur issue de " + M("A") + " ?", v, M(vT) + " cm.")], traps: [TR(rnd((a + b) / 2, 6), "Calcule l'aire de deux façons."), TR(rnd((a * b) / 2 / c, 6), "Hauteur = 2 × aire ÷ base.")] }); },
      () => { const C = R.int(30, 80), B = R.int(30, 80); if (B + C >= 170) return null; const v = 90 - C;
        return QN("Le triangle " + M("ABC") + " a ses trois angles aigus : " + AG("ABC") + " = " + dg(B) + " et " + AG("ACB") + " = " + dg(C) + ". Ses trois hauteurs se coupent en un même point " + M("H") + " (l'orthocentre). La hauteur issue de " + M("B") + " coupe " + M("[AC]") + " en " + M("K") + ". Combien mesure " + AG("HBC") + " (en degrés) ?", v,
          M("H") + " est sur la hauteur " + M("[BK]") + ", perpendiculaire à " + M("(AC)") + ". Dans le triangle " + M("BKC") + " rectangle en " + M("K") + " : " + AG("KBC") + " = " + M("180 - 90 - " + C + " = " + v) + "°, et " + AG("HBC") + " = " + AG("KBC") + ".",
          { ctx: "orthocentre", guide: [GR("Angle " + AG("BKC") + " ?", 90, "90°."), GR(AG("HBC") + " ?", v, M(v) + "°.")], traps: [TR(90 - B, "La hauteur issue de B est perpendiculaire à (AC) : utilise l'angle en C."), TR(180 - B - C, "C'est l'angle en A.")] }); },
      () => { const m = R.int(3, 9), h = R.int(4, 12), v = (m * h) / 2;
        return QN("Le triangle " + M("ABC") + " est isocèle en " + M("A") + ", avec " + M("BC = ") + cm(2 * m) + " et la hauteur " + M("AH = ") + cm(h) + " (" + M("H") + " sur " + M("[BC]") + "). Dans un triangle isocèle, cette hauteur coupe la base en son milieu. Calcule l'aire du triangle " + M("ABH") + " (en cm²).", v,
          M("H") + " est le milieu de " + M("[BC]") + " : " + M("BH = " + m) + " cm. " + M("ABH") + " est rectangle en " + M("H") + " : " + M(m + " \\times " + h + " \\div 2 = " + N(v)) + " cm², la moitié de l'aire de " + M("ABC") + ".",
          { ctx: "isocele-moitie", guide: [GR(M("BH") + " ?", m, M(m) + " cm."), GR("Aire de " + M("ABH") + " ?", v, M(N(v)) + " cm².")], traps: [TR(m * h, "C'est l'aire de ABC tout entier ; ABH en est la moitié."), TR((m * h) / 4, "BH = " + m + " : l'aire de ABH vaut BH × AH ÷ 2.")] }); },
    ],
  };

  const PROBS = {
    cercle6: [() => { const r = R.int(3, 6), d = R.int(r + 2, 2 * r - 1);
      return P("Deux cercles de même rayon " + r + " cm ont pour centres A et B, avec AB = " + d + " cm. Ils se coupent en M et N.", [["a) Longueur AM (cm)", r], ["b) Périmètre du triangle AMB (cm)", d + 2 * r], ["c) Périmètre du quadrilatère AMBN (cm)", 4 * r]],
        ["M est sur les deux cercles.", "AMBN a quatre côtés, tous des rayons."], "a) " + r + " ; b) " + M(d + " + " + r + " + " + r + " = " + (d + 2 * r)) + " ; c) " + M("4 \\times " + r + " = " + 4 * r) + " (c'est un losange)."); }],
    bissec6: [() => { const a = 2 * R.int(20, 60), b = 2 * R.int(15, 40);
      return P("Les angles xOy = " + a + "° et yOt = " + b + "° sont adjacents. [Ou) est la bissectrice de xOy, [Ov) celle de yOt.", [["a) Angle uOy (°)", a / 2], ["b) Angle yOv (°)", b / 2], ["c) Angle uOv (°)", (a + b) / 2]],
        ["Chaque bissectrice partage son angle en deux.", "uOv = uOy + yOv."], "a) " + a / 2 + " ; b) " + b / 2 + " ; c) " + (a + b) / 2 + "."); }],
    filtre6: [() => { const rows = table(), s = 20, L = rows.filter((r) => r.p <= s);
      return P(INTRO + tabT(rows), [["a) Nombre de sorties à 20 € au plus", L.length], ["b) Meilleure note parmi elles", L.length ? Math.max(...L.map((r) => r.e)) : 0], ["c) Prix total de toutes les sorties (€)", rows.reduce((t, r) => t + r.p, 0)]],
        ["Filtre d'abord par le prix.", "Additionne tous les prix pour c)."], "a) " + L.length + " ; b) " + (L.length ? Math.max(...L.map((r) => r.e)) : 0) + " ; c) " + rows.reduce((t, r) => t + r.p, 0) + " €."); }],
    tabform5: [() => { const a = pk([3, 4]), b = pk([5, 8]);
      return P("Un club facture " + M("\\text{prix} = " + a + " \\times n + " + b) + " (en €) pour " + M("n") + " séances.", [["a) Prix pour 5 séances (€)", 5 * a + b], ["b) Prix pour 10 séances (€)", 10 * a + b], ["c) Nombre de séances pour un prix de " + (12 * a + b) + " €", 12]],
        ["Remplace n par 5, puis par 10.", "Retire " + b + ", puis divise par " + a + "."], "a) " + (5 * a + b) + " ; b) " + (10 * a + b) + " ; c) " + M("(" + (12 * a + b) + " - " + b + ") \\div " + a + " = 12") + "."); }],
    hauteurs5: [() => { const [a, b, c] = pk([[6, 8, 10], [9, 12, 15]]);
      return P("Le triangle ABC est rectangle en A, avec AB = " + a + " cm, AC = " + b + " cm et BC = " + c + " cm.", [["a) Aire (cm²)", (a * b) / 2], ["b) Hauteur issue de A (cm)", (a * b) / c], ["c) Hauteur issue de B (cm)", a]],
        ["Les côtés de l'angle droit sont des hauteurs.", "Hauteur issue de A : 2 × aire ÷ BC."], "a) " + M(N((a * b) / 2)) + " ; b) " + M(N((a * b) / c)) + " ; c) AB = " + a + " (la hauteur issue de B est [BA])."); }],
  };

  const DEFS = [
    { id: "cercle6", theme: "es", label: "Cercle, disque et distance à un point", ex: "M \\in \\mathcal{C} \\iff OM = r", FR: [6], againFR: [7], g: CE, probs: PROBS.cercle6,
      hint: "Le cercle de centre O et de rayon r est formé de tous les points situés à r de O ; le disque, de tous les points situés à r ou moins de O. Diamètre = 2 × rayon. Sur une droite graduée, deux points sont à une distance donnée d'un point O : un de chaque côté.",
      comps: ["Rayon et diamètre, points à une distance donnée, disque", "Segment, triangle isocèle, trésor sur une droite", "Deux cercles, chèvres, couronne"],
      lesson: ["Cercle et disque", "Un cercle, c'est tous les points à la même distance de son centre.",
        "Le cercle de centre \\(O\\) et de rayon \\(r\\) est l'ensemble des points \\(M\\) tels que \\(OM = r\\). Le disque de centre \\(O\\) et de rayon \\(r\\) est l'ensemble des points \\(M\\) tels que \\(OM \\leqslant r\\) (le cercle et son intérieur). Un diamètre passe par le centre : il mesure \\(2r\\). Pour trouver un point situé à une distance donnée de deux points \\(A\\) et \\(B\\), on cherche l'intersection de deux cercles.",
        ["Rayon 4 cm : un point à 3,5 cm de \\(O\\) est dans le disque, un point à 4 cm est sur le cercle.", "Sur une droite graduée, les points à 3 unités de 8 sont 5 et 11."],
        "Un point situé exactement à la distance \\(r\\) du centre est sur le cercle, donc aussi dans le disque."],
      act: { retiens: { regle: "Cercle de centre \\(O\\), rayon \\(r\\) : tous les points à \\(r\\) de \\(O\\). Disque : tous les points à \\(r\\) ou moins de \\(O\\).", exemple: ["Sur une droite graduée, les points à 3 unités de 8 sont 5 et 11.", "Diamètre d'un cercle de rayon 4,5 cm : 9 cm."], piege: "Il y a deux points à une distance donnée de \\(O\\) sur une droite : un de chaque côté." },
        predict: { q: "Sur une droite graduée, combien de points sont à 4 unités du point d'abscisse 6 ?", choices: ["2", "1", "une infinité"], good: 0, why: "Un à gauche (2) et un à droite (10). Dans le plan, il y en aurait une infinité : tout un cercle." },
        defis: ["Tape l'abscisse du point situé à 3 unités à gauche du point d'abscisse 8.", "Un cercle a un rayon de 4,5 cm. Tape la longueur de son diamètre (en cm)."],
        play: toi(["À gauche de 8, on retire 3", "Diamètre = 2 × rayon"], [W(5, "8 − 3 = 5 (et à droite : 8 + 3 = 11)."), W(9, "2 × 4,5 = 9 cm.")]) } },
    { id: "bissec6", theme: "es", label: "Bissectrice d'un angle", ex: "\\widehat{xOz} = \\widehat{zOy} = \\frac{\\widehat{xOy}}{2}", FR: [6], againFR: [7], g: BI, probs: PROBS.bissec6,
      hint: "La bissectrice d'un angle est la demi-droite qui le partage en deux angles de même mesure : chacun vaut la moitié de l'angle. Dans un triangle, la somme des angles vaut 180° ; un angle plat vaut 180°.",
      comps: ["Moitié, double, écart à la bissectrice", "Angle plat, triangle, triangle isocèle", "Deux bissectrices, trois demi-droites, bissectrice d'une bissectrice"],
      lesson: ["Bissectrice d'un angle", "La bissectrice coupe un angle en deux angles égaux.",
        "La bissectrice de l'angle \\(\\widehat{xOy}\\) est la demi-droite \\([Oz)\\), d'origine \\(O\\), telle que \\(\\widehat{xOz} = \\widehat{zOy}\\). Chacun de ces deux angles mesure la moitié de \\(\\widehat{xOy}\\). On la reconnaît sur une figure codée (deux angles marqués du même signe) ou en mesurant au rapporteur. C'est aussi l'axe de symétrie de l'angle.",
        ["\\(\\widehat{xOy} = 74°\\) : \\(\\widehat{xOz} = 37°\\).", "\\(\\widehat{zOy} = 28°\\) et \\([Oz)\\) bissectrice : \\(\\widehat{xOy} = 56°\\)."],
        "La bissectrice partage l'angle, pas le segment opposé dans un triangle : elle ne passe pas forcément par le milieu du côté."],
      act: { retiens: { regle: "\\([Oz)\\) est la bissectrice de \\(\\widehat{xOy}\\) si \\(\\widehat{xOz} = \\widehat{zOy}\\) : chacun vaut la moitié de \\(\\widehat{xOy}\\).", exemple: ["\\(\\widehat{xOy} = 74°\\) : \\(\\widehat{xOz} = 37°\\).", "Bissectrices de deux angles adjacents de 60° et 40° : elles font \\(30 + 20 = 50°\\)."], piege: "La moitié de l'angle, pas la moitié de 180°." },
        predict: { q: "La bissectrice d'un angle de 70° forme avec chaque côté un angle de…", choices: ["35°", "70°", "90°"], good: 0, why: "Elle partage l'angle en deux angles égaux : 70 ÷ 2 = 35°." },
        defis: ["L'angle xOy mesure 74°. Tape la mesure de l'angle entre [Ox) et la bissectrice.", "Deux angles adjacents de 60° et 40° : tape l'angle entre leurs bissectrices."],
        play: toi(["La moitié de 74°", "La moitié de 60° plus la moitié de 40°"], [W(37, "74 ÷ 2 = 37°."), W(50, "30° + 20° = 50°, la moitié de 100°.")]) } },
    { id: "filtre6", theme: "no", label: "Filtrer les données d'un tableau", ex: "\\text{prix} \\leqslant 20\\text{ € et durée} \\geqslant 2\\text{ h}", FR: [6], againFR: [7], g: FI, probs: PROBS.filtre6,
      hint: "Lis le critère mot à mot : « moins de 20 » exclut 20, « au plus 20 » l'inclut. « Et » : les deux conditions à la fois ; « ou » : au moins une. Filtre une colonne après l'autre, en barrant les lignes qui ne conviennent pas.",
      comps: ["Un critère, deux critères avec « et »", "Critère avec « ou », choix, total", "Trois critères, budget, écart"],
      lesson: ["Filtrer un tableau", "Pour faire un choix, on garde seulement les lignes qui vérifient le critère.",
        "On lit le critère colonne par colonne. « Moins de 20 € » : strictement inférieur à 20 ; « au plus 20 € » : 20 compris ; « au moins 2 h » : 2 h compris. Avec « et », une ligne doit vérifier toutes les conditions ; avec « ou », une seule suffit. On peut ensuite compter les lignes gardées, chercher la plus petite ou la plus grande valeur, ou additionner.",
        ["Prix 12, 25, 18, 30 € : trois sorties ne dépassent pas 25 € (« au plus 25 € »).", "Moins de 25 € : seulement deux (12 et 18)."],
        "« Moins de » exclut la valeur limite ; « au plus » l'inclut."],
      act: { retiens: { regle: "On garde les lignes qui vérifient le critère, puis on compte, on compare ou on additionne. « Et » : toutes les conditions ; « ou » : au moins une.", exemple: ["Prix 12, 25, 18, 30 € : « au plus 25 € » → 3 sorties.", "« Moins de 25 € » → 2 sorties."], piege: "« Moins de 25 » n'inclut pas 25." },
        predict: { q: "Prix : 12 €, 25 €, 18 €, 30 €. Combien de sorties coûtent moins de 25 € ?", choices: ["2", "3", "1"], good: 0, why: "12 et 18 seulement : 25 n'est pas « moins de 25 »." },
        defis: ["Prix : 12 €, 25 €, 18 €, 30 €. Tape le nombre de sorties qui coûtent au plus 25 €.", "Durées : 1 h, 3 h, 2 h, 4 h (dans le même ordre). Tape le prix de la moins chère des sorties d'au moins 3 h."],
        play: toi(["« Au plus 25 » : 25 compris", "Au moins 3 h : la 2e (25 €) et la 4e (30 €)"], [W(3, "12, 25 et 18 : trois sorties."), W(25, "Parmi 25 € et 30 €, la moins chère coûte 25 €.")]) } },
    { id: "tabform5", theme: "fa", label: "Tableaux de valeurs et graphiques", ex: "\\text{prix} = 3 \\times n + 5", FR: [7], againFR: [8], g: TF, probs: PROBS.tabform5,
      hint: "Pour compléter un tableau, on remplace la lettre par chaque valeur dans la formule, en respectant les priorités. Pour lire un graphique : on part de la valeur sur l'axe horizontal, on va jusqu'à la courbe, puis on lit sur l'axe vertical (ou l'inverse).",
      comps: ["Calculer avec une formule, compléter et lire un tableau", "Priorités, retrouver un nombre, lire un graphique", "Comparer deux tarifs, lire des valeurs sur une courbe, variation"],
      lesson: ["Tableaux de valeurs", "Une formule relie deux grandeurs : un tableau ou un graphique montre plusieurs valeurs d'un coup.",
        "Quand une grandeur dépend d'une autre (le prix dépend du nombre de places), une formule permet de la calculer : on remplace la lettre par un nombre. Un tableau de valeurs rassemble plusieurs résultats ; on peut le lire dans les deux sens. Un graphique représente ces valeurs par des points : la grandeur de départ sur l'axe horizontal, la grandeur calculée sur l'axe vertical.",
        ["\\(\\text{prix} = 3 \\times n + 5\\) : pour \\(n = 4\\), \\(3 \\times 4 + 5 = 17\\).", "Pour \\(n = 10\\) : \\(35\\)."],
        "Priorités : dans \\(3 \\times n + 5\\), on multiplie avant d'ajouter."],
      act: { retiens: { regle: "On remplace la lettre par la valeur, puis on calcule en respectant les priorités.", exemple: ["\\(\\text{prix} = 3 \\times n + 5\\), \\(n = 4\\) : \\(17\\).", "Prix de 29 € : \\((29 - 5) \\div 3 = 8\\) places."], piege: "\\(3 \\times 4 + 5 = 17\\), pas \\(3 \\times 9\\)." },
        predict: { q: "Avec prix = 4 × n + 3, combien coûtent 5 places ?", choices: ["23 €", "35 €", "20 €"], good: 0, why: "On multiplie d'abord : 4 × 5 = 20, puis on ajoute 3 : 23 €." },
        defis: ["prix = 3 × n + 5. Tape le prix pour n = 4.", "Pour quel nombre de places le prix vaut-il 29 € ?"],
        play: toi(["3 × 4, puis + 5", "29 − 5 = 24, puis ÷ 3"], [W(17, "3 × 4 + 5 = 17 €."), W(8, "(29 − 5) ÷ 3 = 8 places.")]) } },
    { id: "hauteurs5", theme: "es", label: "Hauteurs d'un triangle", ex: "\\mathcal{A} = \\frac{\\text{base} \\times \\text{hauteur}}{2}", FR: [7], againFR: [8], g: HA, probs: PROBS.hauteurs5,
      hint: "Une hauteur part d'un sommet et coupe perpendiculairement le côté opposé (ou son prolongement). Aire = base × hauteur ÷ 2, avec n'importe quel côté comme base et la hauteur qui lui correspond. Les trois hauteurs se coupent en un même point, l'orthocentre.",
      comps: ["Aire avec une hauteur, retrouver une hauteur, triangle rectangle", "Deux hauteurs, angle avec une hauteur, triangle obtus", "Hauteur relative à l'hypoténuse, orthocentre, triangle isocèle"],
      lesson: ["Hauteurs d'un triangle", "Une hauteur tombe perpendiculairement d'un sommet sur le côté opposé.",
        "La hauteur issue de \\(A\\) est la droite qui passe par \\(A\\) et qui est perpendiculaire à \\((BC)\\) ; on appelle aussi hauteur la longueur \\(AH\\), où \\(H\\) est son pied. L'aire du triangle vaut \\(\\text{base} \\times \\text{hauteur} \\div 2\\) pour chacun des trois côtés : la même aire, donc une hauteur plus courte pour un côté plus long. Dans un triangle rectangle, les deux côtés de l'angle droit sont des hauteurs. Dans un triangle obtus, deux hauteurs tombent à l'extérieur. Les trois hauteurs sont concourantes en l'orthocentre.",
        ["\\(BC = 8\\) cm, \\(AH = 5\\) cm : aire \\(8 \\times 5 \\div 2 = 20\\) cm².", "Aire 20 cm², \\(AB = 10\\) cm : hauteur issue de \\(C\\) : \\(2 \\times 20 \\div 10 = 4\\) cm."],
        "Chaque hauteur va avec son côté : on ne multiplie pas \\(AB\\) par la hauteur issue de \\(A\\)."],
      act: { retiens: { regle: "Aire = base × hauteur ÷ 2, pour n'importe quel côté et la hauteur qui lui correspond ; donc hauteur = 2 × aire ÷ base.", exemple: ["\\(BC = 8\\), \\(AH = 5\\) : aire 20.", "Même triangle, \\(AB = 10\\) : hauteur issue de \\(C\\) = \\(2 \\times 20 \\div 10 = 4\\)."], piege: "Une hauteur est perpendiculaire au côté : ce n'est pas un côté du triangle (sauf dans un triangle rectangle)." },
        predict: { q: "Un triangle a pour base 6 cm et pour hauteur 7 cm. Son aire est…", choices: ["21 cm²", "42 cm²", "13 cm²"], good: 0, why: "6 × 7 = 42 serait l'aire du rectangle ; le triangle en est la moitié : 21 cm²." },
        defis: ["BC = 8 cm et la hauteur issue de A mesure 5 cm. Tape l'aire (en cm²).", "Dans ce même triangle, AB = 10 cm. Tape la hauteur issue de C (en cm)."],
        play: toi(["8 × 5 ÷ 2", "2 × aire ÷ 10"], [W(20, "8 × 5 ÷ 2 = 20 cm²."), W(4, "2 × 20 ÷ 10 = 4 cm : la même aire avec une autre base.")]) } },
  ];
  reg(DEFS);
  /* leçons actives (FRX.reg ne les enregistre pas) */
  for (const d of DEFS) if (d.act) actReg({ [d.id]: d.act });
})();
