// ===================== 25.11 : défis (niveau 4) propres à la 9e =====================
// Audit de niveau 9e–10e (tools/niveau_910.md, point 7) : pour 21 notions de 9e, le niveau 4 reprenait les formes du
// niveau 3 (« = N3 »). Ici, un vrai problème par notion, en 2 ou 3 étapes qui s'enchaînent, valeurs tirées au hasard,
// au programme de 9e (plan de cheminement genevois : pas de produit de relatifs, pas d'aires agrandies, pas de littéral).
// Proposés en 9e et en 10e (co: [9, 10] ; 25.11 : savoir refaire ce qui est d'avant tant que ce n'est pas trivial) ;
// ailleurs, Engine.make les écarte (horsCO). Chargé après variantes.js (PROBX).
(() => {
  if (typeof PROBX === "undefined") return;
  const ri = R.int, pk = R.pick;
  const r6 = (v) => Math.round(v * 1e6) / 1e6;
  const N = (v) => { const [i, f] = String(r6(v)).split("."); return (Math.abs(+i) >= 1000 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}") : i) + (f ? "{,}" + f : ""); };
  const X = (v) => M(N(v));
  const PX = (id, f) => { (PROBX[id] = PROBX[id] || []).push(() => Object.assign(f(), { co: [9, 10] })); };
  /* parts : [libellé, valeur, arrondi facultatif (0.1, 0.01…)] */
  const PB = (q, parts, hints, sol) => ({ q, hints, sol,
    parts: parts.map(([label, value, rd]) => ({ label, spec: Object.assign({ kind: "value", value: r6(value) }, rd ? { round: rd } : {}) })) });
  const gcd = (a, b) => (b ? gcd(b, a % b) : a), lcm = (a, b) => (a * b) / gcd(a, b);

  // ---------- Nombres ----------
  PX("decread", () => {
    let t, a, b, c; do { t = ri(3, 9); a = ri(1, 4); b = ri(1, 9); c = ri(1, 9); } while (t - a < 1 || b === c || t - a === b);
    const u = 2 * a, cen = t - a, n = 10 * t + u + a / 10 + cen / 100 + c / 1000;
    return PB("Je suis un nombre décimal. Mon chiffre des dizaines est " + X(t) + ". Mon chiffre des unités est le double de mon chiffre des dixièmes, qui vaut " + X(a) + ". Mon chiffre des centièmes est la différence entre mon chiffre des dizaines et mon chiffre des dixièmes. Mon chiffre des millièmes est " + X(c) + ", et je n'ai pas d'autre chiffre.",
      [["a) Qui suis-je ?", n], ["b) Combien de centièmes entiers y a-t-il en tout dans ce nombre ?", Math.floor(n * 100 + 1e-9)], ["c) Arrondis ce nombre au dixième.", Math.round(n * 10) / 10]],
      ["Place les chiffres un à un dans un tableau : dizaines, unités, virgule, dixièmes, centièmes, millièmes.", "« Combien de centièmes en tout » : tout ce qui est à gauche du chiffre des centièmes, ce chiffre compris (comme 3,47 = 347 centièmes)."],
      "a) Unités : " + M("2 \\cdot " + a + " = " + u) + " ; centièmes : " + M(t + " - " + a + " = " + cen) + ". Le nombre est " + X(n) + ". b) " + X(n) + " = " + X(Math.floor(n * 100 + 1e-9)) + " centièmes et " + X(c) + " millièmes. c) " + X(Math.round(n * 10) / 10) + " (le chiffre des centièmes est " + cen + ").");
  });
  PX("deccomp", () => {
    const b = pk([8, 9, 10, 11, 12]), off = [0.8, 0.08, 0.79, 0.801, 1.1, 0.708].sort(() => R.rand() - 0.5).slice(0, 5), v = off.map((o) => r6(b + o)), s = v.slice().sort((x, y) => x - y);
    const lo = r6(b + 0.75), hi = b + 1, cnt = v.filter((x) => x > lo && x < hi).length;
    return PB("Cinq élèves ont couru le 60 m. Leurs temps (en secondes) : " + v.map(X).join(" ; ") + ".",
      [["a) Le meilleur temps (le plus petit), en s", s[0]], ["b) Le temps de l'élève arrivé 3e, en s", s[2]], ["c) Combien de ces temps sont compris entre " + X(lo) + " s et " + X(hi) + " s ?", cnt]],
      ["Écris tous les temps avec le même nombre de décimales (complète par des zéros), puis compare chiffre par chiffre.", "Range-les du plus petit au plus grand avant de répondre."],
      "Avec trois décimales : " + v.map((x) => M(x.toFixed(3).replace(".", "{,}"))).join(", ") + ". Rangés : " + s.map(X).join(" < ") + ". a) " + X(s[0]) + " s. b) " + X(s[2]) + " s. c) " + cnt + ".");
  });
  PX("dec10", () => {
    const e = pk([8.4, 9.6, 10.2, 11.5, 12.8]), k = pk([20, 30, 50, 200]), H = r6((k * e) / 100);
    return PB("Un paquet de " + X(1000) + " feuilles de papier a une épaisseur de " + X(e) + " cm.",
      [["a) Épaisseur d'une feuille, en mm", r6((e * 10) / 1000)], ["b) Épaisseur d'une pile de 100 paquets, en m", r6(e)], ["c) Une pile de ces feuilles mesure " + X(H) + " m. Combien de feuilles contient-elle ?", k * 1000]],
      ["Convertis d'abord en mm : 1 cm = 10 mm. Puis divise par 1'000.", "c) Convertis la hauteur en cm, puis cherche combien de paquets cela fait."],
      "a) " + M(N(e) + " \\text{ cm} = " + N(e * 10) + " \\text{ mm}") + " et " + M(N(e * 10) + " \\div 1\\text{'}000 = " + N(r6((e * 10) / 1000))) + " mm. b) " + M("100 \\cdot " + N(e) + " = " + N(r6(100 * e))) + " cm = " + X(e) + " m. c) " + M(N(H) + " \\text{ m} = " + N(r6(H * 100)) + " \\text{ cm}") + ", soit " + M(N(r6(H * 100)) + " \\div " + N(e) + " = " + k) + " paquets, donc " + X(k * 1000) + " feuilles.");
  });
  PX("pow9", () => {
    const h1 = pk([2, 3]), h2 = pk([4, 5]), k = pk([7, 10, 11]);
    return PB("Une bactérie se divise en deux toutes les 20 minutes. Au départ, il y a une seule bactérie.",
      [["a) Combien y a-t-il de bactéries après " + h1 + " heures ?", 2 ** (3 * h1)], ["b) Après " + h2 + " heures, le nombre de bactéries s'écrit " + M("2^n") + ". Que vaut " + M("n") + " ?", 3 * h2], ["c) Au bout de combien de minutes y a-t-il " + X(2 ** k) + " bactéries ?", 20 * k]],
      ["En une heure, il y a 3 périodes de 20 minutes : le nombre est multiplié par 2 trois fois.", "c) Écris " + N(2 ** k) + " comme une puissance de 2 : combien de divisions a-t-il fallu ?"],
      "a) " + M("2^{" + 3 * h1 + "} = " + N(2 ** (3 * h1))) + ". b) " + M(h2 + " \\cdot 3 = " + 3 * h2) + " divisions : " + M("n = " + 3 * h2) + ". c) " + M(N(2 ** k) + " = 2^{" + k + "}") + " : " + k + " divisions de 20 minutes, soit " + 20 * k + " minutes.");
  });

  // ---------- Grandeurs et mesures ----------
  PX("ulong", () => {
    let L, c, n, r; do { L = pk([5, 8, 12, 15]); c = pk([35, 45, 65, 70, 85]); n = Math.floor((L * 100) / c); r = L * 100 - n * c; } while (r === 0 || r < 5);
    const m = pk([12, 15, 24, 40]), mk = r6((n * c * m) / 100 / 1000);
    return PB("Un rouleau de ficelle de " + X(L) + " m est coupé en morceaux de " + X(c) + " cm, autant que possible. La ficelle pèse " + X(m) + " g par mètre.",
      [["a) Combien de morceaux obtient-on ?", n], ["b) Longueur du reste, en cm", r], ["c) Masse de tous les morceaux réunis, en kg", mk]],
      ["Convertis la longueur du rouleau en cm avant de diviser.", "c) Longueur totale des morceaux en m, puis masse en g, puis en kg (1 kg = 1'000 g)."],
      "a) " + M(N(L) + " \\text{ m} = " + N(L * 100) + " \\text{ cm}") + " ; " + M(N(L * 100) + " \\div " + c) + " : " + n + " morceaux. b) " + M(N(L * 100) + " - " + n + " \\cdot " + c + " = " + r) + " cm. c) " + M(n + " \\cdot " + c + " = " + N(n * c) + " \\text{ cm} = " + N(r6((n * c) / 100)) + " \\text{ m}") + " ; " + M(N(r6((n * c) / 100)) + " \\cdot " + m + " = " + N(r6((n * c * m) / 100)) + " \\text{ g} = " + N(mk) + " \\text{ kg}") + ".");
  });
  PX("uaire", () => {
    const c = pk([25, 50]), a = pk([3, 3.5, 4, 4.5, 5]), b = pk([2.5, 3, 3.5]), A = r6(a * b), nC = ((a * 100) / c) * ((b * 100) / c);
    return PB("Le sol d'une pièce rectangulaire de " + X(a) + " m sur " + X(b) + " m est recouvert de carreaux carrés de " + X(c) + " cm de côté.",
      [["a) Aire du sol, en m²", A], ["b) Aire d'un carreau, en m²", r6((c / 100) ** 2)], ["c) Combien faut-il de carreaux ?", nC]],
      ["Un carreau de " + c + " cm de côté : " + c + " cm = " + N(c / 100) + " m.", "c) Combien de carreaux tiennent sur la longueur ? sur la largeur ?"],
      "a) " + M(N(a) + " \\cdot " + N(b) + " = " + N(A)) + " m². b) " + M(N(c / 100) + " \\cdot " + N(c / 100) + " = " + N(r6((c / 100) ** 2))) + " m². c) " + M(N(a * 100) + " \\div " + c + " = " + (a * 100) / c) + " carreaux sur la longueur, " + M(N(b * 100) + " \\div " + c + " = " + (b * 100) / c) + " sur la largeur : " + M((a * 100) / c + " \\cdot " + (b * 100) / c + " = " + nC) + " carreaux.");
  });
  PX("uvol", () => {
    const a = pk([50, 60, 80]), b = pk([25, 30, 40]), c = pk([30, 40, 50]), h = ri(2, Math.floor(c / 10) - 1) * 10 - pk([0, 5]), V = (a * b * c) / 1000, x = r6((a * b * h) / 1000), md = (a * b * (c - h)) / 100;
    return PB("Un aquarium a la forme d'un pavé de " + X(a) + " cm de long, " + X(b) + " cm de large et " + X(c) + " cm de haut. On y verse " + X(x) + " litres d'eau.",
      [["a) Contenance de l'aquarium, en litres", V], ["b) Hauteur de l'eau, en cm", h], ["c) Combien de décilitres manque-t-il pour le remplir ?", md]],
      ["1 litre = 1 dm³ = 1'000 cm³.", "b) Volume d'eau en cm³, divisé par l'aire du fond."],
      "a) " + M(a + " \\cdot " + b + " \\cdot " + c + " = " + N(a * b * c)) + " cm³ = " + X(V) + " L. b) " + M(N(x) + " \\text{ L} = " + N(a * b * h) + " \\text{ cm}^3") + " ; " + M(N(a * b * h) + " \\div (" + a + " \\cdot " + b + ") = " + h) + " cm. c) " + M(N(V) + " - " + N(x) + " = " + N(r6(V - x))) + " L = " + X(md) + " dl.");
  });

  // ---------- Géométrie ----------
  PX("angtype", () => {
    const h1 = pk([2, 4, 5, 7, 8]), m = pk([12, 25, 35, 40]), h2 = pk([2, 3, 4, 8, 9]);
    const a1 = Math.min(30 * h1, 360 - 30 * h1), raw = Math.abs(30 * h2 + 15 - 180), a3 = Math.min(raw, 360 - raw);
    return PB("Sur une horloge, on mesure le plus petit angle formé par les deux aiguilles.",
      [["a) Angle à " + h1 + " h pile (en degrés)", a1], ["b) De combien de degrés tourne la grande aiguille en " + m + " minutes ?", 6 * m], ["c) Angle à " + h2 + " h 30 (en degrés)", a3]],
      ["Le cadran fait 360° et compte 12 heures : 30° d'une heure à la suivante. La grande aiguille fait un tour (360°) en 60 minutes.", "c) À " + h2 + " h 30, la petite aiguille n'est pas sur le " + h2 + " : elle est à mi-chemin entre " + h2 + " et " + (h2 + 1) + "."],
      "a) " + M(h1 + " \\cdot 30° = " + 30 * h1 + "°") + (a1 !== 30 * h1 ? ", donc le plus petit angle vaut " + M("360° - " + 30 * h1 + "° = " + a1 + "°") : "") + ". b) " + M("360° \\div 60 = 6°") + " par minute : " + M(m + " \\cdot 6° = " + 6 * m + "°") + ". c) Petite aiguille à " + M(h2 + " \\cdot 30° + 15° = " + (30 * h2 + 15) + "°") + ", grande aiguille à 180° : écart " + M(raw + "°") + (a3 !== raw ? ", plus petit angle " + M(a3 + "°") : "") + ".");
  });
  PX("perim", () => {
    const l = ri(4, 15), d = ri(2, 9), L = l + d, P = 2 * (l + L);
    return PB("Un rectangle a un périmètre de " + X(P) + " cm. Sa longueur dépasse sa largeur de " + X(d) + " cm.",
      [["a) Longueur + largeur, en cm", L + l], ["b) Largeur, en cm", l], ["c) Longueur, en cm", L]],
      ["Le périmètre contient deux longueurs et deux largeurs : la moitié contient une longueur et une largeur.", "Si on enlève les " + d + " cm de trop à la longueur, il reste deux largeurs."],
      "a) " + M(P + " \\div 2 = " + (L + l)) + " cm. b) " + M("(" + (L + l) + " - " + d + ") \\div 2 = " + l) + " cm. c) " + M(l + " + " + d + " = " + L) + " cm. Vérification : " + M("2 \\cdot (" + L + " + " + l + ") = " + P) + ".");
  });
  PX("aire1", () => {
    const s = pk([6, 8, 9, 10, 12]), A = s * s, ws = []; for (let w = 2; w < s; w++) if (A % w === 0 && A / w !== s) ws.push(w);
    const w = pk(ws), L = A / w, dP = 2 * (L + w) - 4 * s;
    return PB("Un rectangle a la même aire qu'un carré de " + X(s) + " cm de côté. Sa largeur mesure " + X(w) + " cm.",
      [["a) Aire du carré, en cm²", A], ["b) Longueur du rectangle, en cm", L], ["c) De combien de cm le périmètre du rectangle dépasse-t-il celui du carré ?", dP]],
      ["Même aire : longueur · largeur = aire du carré.", "c) Calcule les deux périmètres, puis la différence."],
      "a) " + M(s + " \\cdot " + s + " = " + A) + " cm². b) " + M(A + " \\div " + w + " = " + L) + " cm. c) Rectangle : " + M("2 \\cdot (" + L + " + " + w + ") = " + 2 * (L + w)) + " cm ; carré : " + M("4 \\cdot " + s + " = " + 4 * s) + " cm ; différence " + X(dP) + " cm (même aire, périmètres différents).");
  });
  PX("aire2", () => {
    let b, h, c, A, h2; do { b = ri(6, 14); h = ri(4, 9); c = ri(h + 1, 13); A = b * h; h2 = A / c; } while (c === b || Math.abs(h2 * 10 - Math.round(h2 * 10)) > 1e-9);
    const d1 = pk([4, 6, 8, 10, 12].filter((x) => (2 * A) % x === 0 && 2 * A / x !== x)) || 2, d2 = (2 * A) / d1;
    return PB("Un parallélogramme " + M("ABCD") + " a une base " + M("[AB]") + " de " + X(b) + " cm et une hauteur relative à cette base de " + X(h) + " cm. Son côté " + M("[BC]") + " mesure " + X(c) + " cm.",
      [["a) Aire du parallélogramme, en cm²", A], ["b) Hauteur relative au côté " + M("[BC]") + ", en cm", h2, Number.isInteger(h2) ? 0 : 0.1], ["c) Un losange a la même aire, et une diagonale de " + X(d1) + " cm. Longueur de l'autre diagonale, en cm", d2]],
      ["L'aire ne dépend pas du côté choisi comme base : base · hauteur correspondante.", "Losange : aire = (diagonale · diagonale) ÷ 2."],
      "a) " + M(b + " \\cdot " + h + " = " + A) + " cm². b) " + M(A + " \\div " + c + " = " + N(h2)) + " cm. c) " + M("d \\cdot " + d1 + " \\div 2 = " + A) + ", donc " + M("d = " + 2 * A + " \\div " + d1 + " = " + N(d2)) + " cm.");
  });
  PX("aire3", () => {
    const a = ri(8, 20), b = ri(5, 12), l = pk([1, 2]), p = pk([12, 15, 18, 24]), G = (a + 2 * l) * (b + 2 * l), al = G - a * b;
    return PB("Un jardin rectangulaire de " + X(a) + " m sur " + X(b) + " m est entouré d'une allée de " + X(l) + " m de large. On couvre l'allée de gravier à " + X(p) + " CHF le m².",
      [["a) Aire du grand rectangle (jardin + allée), en m²", G], ["b) Aire de l'allée, en m²", al], ["c) Prix du gravier, en CHF", al * p]],
      ["Le grand rectangle dépasse le jardin de " + l + " m de chaque côté : " + 2 * l + " m de plus en longueur et en largeur.", "Aire de l'allée = grand rectangle − jardin."],
      "a) " + M("(" + a + " + " + 2 * l + ") \\cdot (" + b + " + " + 2 * l + ") = " + (a + 2 * l) + " \\cdot " + (b + 2 * l) + " = " + G) + " m². b) " + M(G + " - " + a + " \\cdot " + b + " = " + al) + " m². c) " + M(al + " \\cdot " + p + " = " + N(al * p)) + " CHF.");
  });
  PX("solides", () => {
    const n = pk([5, 6, 7, 8, 9]), pyr = R.rand() < 0.5, nm = { 5: "pentagone", 6: "hexagone", 7: "heptagone", 8: "octogone", 9: "ennéagone" }[n];
    const F = pyr ? n + 1 : n + 2, Ar = pyr ? 2 * n : 3 * n, S = pyr ? n + 1 : 2 * n;
    return PB("Un" + (pyr ? "e pyramide" : " prisme droit") + " a pour base un " + nm + " (" + n + " côtés).",
      [["a) Nombre de faces", F], ["b) Nombre d'arêtes", Ar], ["c) Nombre de sommets", S]],
      [pyr ? "Une pyramide : une base, et un triangle sur chaque côté de la base, qui se rejoignent au sommet." : "Un prisme : deux bases identiques, reliées par un rectangle sur chaque côté.", "Vérifie avec la relation d'Euler : faces + sommets − arêtes = 2."],
      pyr ? "a) " + M("1 + " + n + " = " + F) + " faces. b) " + n + " arêtes autour de la base et " + n + " vers le sommet : " + Ar + ". c) " + n + " sommets de la base et le sommet : " + S + ". Euler : " + M(F + " + " + S + " - " + Ar + " = 2") + "."
        : "a) " + M("2 + " + n + " = " + F) + " faces. b) " + n + " arêtes par base et " + n + " arêtes latérales : " + M("3 \\cdot " + n + " = " + Ar) + ". c) " + M("2 \\cdot " + n + " = " + S) + " sommets. Euler : " + M(F + " + " + S + " - " + Ar + " = 2") + ".");
  });
  PX("volpave", () => {
    const k = pk([2, 3, 4, 5]), a = k * ri(3, 6), b = k * ri(2, 4), c = k * ri(2, 3), V = a * b * c, S = a * b + 2 * a * c + 2 * b * c;
    return PB("Une boîte sans couvercle a la forme d'un pavé de " + X(a) + " cm sur " + X(b) + " cm, et " + X(c) + " cm de haut.",
      [["a) Volume de la boîte, en cm³", V], ["b) Aire de carton nécessaire (sans couvercle), en cm²", S], ["c) Combien de cubes de " + k + " cm d'arête peut-on y ranger ?", (a / k) * (b / k) * (c / k)]],
      ["Sans couvercle : le fond, et quatre faces latérales (deux paires identiques).", "c) Combien de cubes sur la longueur, sur la largeur, sur la hauteur ?"],
      "a) " + M(a + " \\cdot " + b + " \\cdot " + c + " = " + N(V)) + " cm³. b) " + M(a + " \\cdot " + b + " + 2 \\cdot " + a + " \\cdot " + c + " + 2 \\cdot " + b + " \\cdot " + c + " = " + N(S)) + " cm². c) " + M(a / k + " \\cdot " + b / k + " \\cdot " + c / k + " = " + (a / k) * (b / k) * (c / k)) + " cubes.");
  });

  // ---------- Fractions ----------
  PX("fracrep", () => {
    const POOL = [[3, 4], [5, 6], [2, 3], [5, 8], [7, 12], [3, 8], [5, 12], [1, 3], [7, 8], [1, 4]];
    let F; do { F = POOL.slice().sort(() => R.rand() - 0.5).slice(0, 3); } while (new Set(F.map(([p, q]) => p / q)).size < 3 || F.filter(([p, q]) => p / q > 0.5).length !== 2);
    const D = F.reduce((m, [, q]) => lcm(m, q), 1), big = F.slice().sort((x, y) => y[0] / y[1] - x[0] / x[1])[0], half = F.filter(([p, q]) => p / q > 0.5).length;
    const nm = ["Lina", "Noé", "Sara"];
    return PB("Trois amis partagent des tartes de même taille. " + F.map(([p, q], i) => nm[i] + " a mangé " + M("\\frac{" + p + "}{" + q + "}") + " de tarte").join(", ") + ".",
      [["a) Combien d'entre eux ont mangé plus d'une demi-tarte ?", half], ["b) Plus petit dénominateur commun des trois fractions", D], ["c) Écrite avec ce dénominateur, la plus grande part a pour numérateur…", (big[0] * D) / big[1]]],
      ["Plus d'une demie : le numérateur dépasse la moitié du dénominateur.", "Dénominateur commun : le plus petit nombre qui est un multiple des trois dénominateurs ; puis amplifie chaque fraction."],
      "a) " + half + ". b) " + D + ". Avec ce dénominateur : " + F.map(([p, q]) => M("\\frac{" + p + "}{" + q + "} = \\frac{" + (p * D) / q + "}{" + D + "}")).join(" ; ") + ". c) La plus grande part : " + M("\\frac{" + (big[0] * D) / big[1] + "}{" + D + "}") + ".");
  });
  PX("fracsimp", () => {
    const PQ = [[2, 3], [3, 4], [2, 5], [4, 7], [3, 8], [5, 9], [5, 6], [4, 9]], [p, q] = pk(PQ), k = pk([12, 14, 18, 21, 24]), cnt = Math.floor(50 / q) - Math.ceil(20 / q) + 1;
    return PB("On veut simplifier la fraction " + M("\\frac{" + k * p + "}{" + k * q + "}") + " au maximum.",
      [["a) Numérateur de la fraction irréductible", p], ["b) Dénominateur de la fraction irréductible", q], ["c) Combien de fractions égales à celle-ci ont un dénominateur compris entre 20 et 50 (bornes comprises) ?", cnt]],
      ["Simplifie en plusieurs fois si tu veux : par 2, par 3, par 7…", "c) Les fractions égales s'obtiennent en amplifiant : leurs dénominateurs sont les multiples de " + q + "."],
      "a) et b) " + M("\\frac{" + k * p + "}{" + k * q + "} = \\frac{" + p + "}{" + q + "}") + " (on divise par " + k + "). c) Multiples de " + q + " entre 20 et 50 : " + Array.from({ length: cnt }, (_, i) => (Math.ceil(20 / q) + i) * q).join(", ") + " : " + cnt + " fractions.");
  });
  PX("fractout", () => {
    let n, a, b, c, d, f, r, mu; do { [a, b] = pk([[2, 3], [3, 4], [2, 5], [3, 5], [1, 3], [1, 4]]); [c, d] = pk([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]]); n = pk([18, 20, 24, 28, 30]); /* 26.11 (vraisemblance) : pas de classe de 36 élèves */ f = (n * a) / b; r = n - f; mu = (r * c) / d; } while (!Number.isInteger(f) || !Number.isInteger(mu) || mu === 0 || r - mu === 0);
    return PB("Dans une classe de " + X(n) + " élèves, " + M("\\frac{" + a + "}{" + b + "}") + " font du football. Parmi les autres, " + M("\\frac{" + c + "}{" + d + "}") + " font de la musique.",
      [["a) Combien d'élèves font du football ?", f], ["b) Combien d'élèves font de la musique ?", mu], ["c) Combien d'élèves ne font ni l'un ni l'autre ?", r - mu]],
      ["Fraction d'une quantité : divise par le dénominateur, multiplie par le numérateur.", "b) Attention : la fraction porte sur « les autres », pas sur toute la classe."],
      "a) " + M(n + " \\div " + b + " \\cdot " + a + " = " + f) + ". Autres : " + M(n + " - " + f + " = " + r) + ". b) " + M(r + " \\div " + d + " \\cdot " + c + " = " + mu) + ". c) " + M(r + " - " + mu + " = " + (r - mu)) + ".");
  });

  // ---------- Proportionnalité ----------
  PX("proptab", () => {
    const u = pk([2.4, 3.5, 4.2, 5.6, 6.5]), m1 = pk([3, 4, 5]), m2 = pk([1.5, 2.5, 7]), m3 = pk([8, 12, 15]);
    return PB("Au marché, le prix des cerises est proportionnel à leur masse : " + X(m1) + " kg coûtent " + X(r6(u * m1)) + " CHF.",
      [["a) Prix d'un kilo, en CHF", u, 0.01], ["b) Prix de " + X(m2) + " kg, en CHF", r6(u * m2), 0.01], ["c) Combien de kg achète-t-on avec " + X(r6(u * m3)) + " CHF ?", m3]],
      ["Le coefficient de proportionnalité est le prix d'un kilo.", "c) Masse = prix ÷ prix d'un kilo."],
      "a) " + M(N(r6(u * m1)) + " \\div " + m1 + " = " + N(u)) + " CHF. b) " + M(N(m2) + " \\cdot " + N(u) + " = " + N(r6(u * m2))) + " CHF. c) " + M(N(r6(u * m3)) + " \\div " + N(u) + " = " + m3) + " kg.");
  });
  PX("prop", () => {
    let g, fa, oe, n2, n3; do { g = pk([4, 6]); fa = pk([180, 240, 300, 360]); oe = pk([2, 3, 4]); n2 = pk(g === 4 ? [6, 10, 14] : [9, 15, 4]); n3 = pk(g === 4 ? [12, 18, 22, 10] : [8, 10, 16, 9]); } while (!Number.isInteger((oe * n3) / g) || n2 === n3);
    return PB("Une recette pour " + g + " personnes demande " + X(fa) + " g de farine et " + X(oe) + " œufs.",
      [["a) Farine pour " + n2 + " personnes, en g", (fa * n2) / g], ["b) Avec " + X((fa * n3) / g) + " g de farine, pour combien de personnes cuisine-t-on ?", n3], ["c) Œufs nécessaires pour " + n3 + " personnes", (oe * n3) / g]],
      ["Passe par une personne : divise par " + g + ", puis multiplie.", "b) Combien de fois " + N(fa / g) + " g dans la quantité de farine ?"],
      "Pour une personne : " + M(N(fa) + " \\div " + g + " = " + N(fa / g)) + " g de farine et " + M(oe + " \\div " + g + " = " + N(oe / g)) + " œuf. a) " + M(n2 + " \\cdot " + N(fa / g) + " = " + N((fa * n2) / g)) + " g. b) " + M(N((fa * n3) / g) + " \\div " + N(fa / g) + " = " + n3) + " personnes. c) " + M(n3 + " \\cdot " + N(oe / g) + " = " + N(r6((oe * n3) / g))) + " œufs.");
  });
  PX("change", () => {
    const r = pk([0.94, 0.95, 0.96]), e1 = pk([150, 240, 320, 450]), c2 = pk([200, 300, 500]), z = pk([35, 45, 60]), r2 = r6(r - pk([0.02, 0.03]));
    return PB("Avant un voyage, 1 euro vaut " + X(r) + " CHF à la banque.",
      [["a) Combien coûtent " + X(e1) + " euros, en CHF ?", r6(e1 * r), 0.01], ["b) Combien d'euros obtient-on pour " + X(c2) + " CHF ? (arrondi au centime)", Math.round((c2 / r) * 100) / 100, 0.01], ["c) Au retour, il reste " + X(z) + " euros, que la banque rachète à " + X(r2) + " CHF l'euro. Combien de CHF reçoit-on ?", r6(z * r2), 0.01]],
      ["De l'euro vers le franc : multiplie par le taux.", "Du franc vers l'euro : divise par le taux."],
      "a) " + M(e1 + " \\cdot " + N(r) + " = " + N(r6(e1 * r))) + " CHF. b) " + M(c2 + " \\div " + N(r) + " \\approx " + N(Math.round((c2 / r) * 100) / 100)) + " €. c) " + M(z + " \\cdot " + N(r2) + " = " + N(r6(z * r2))) + " CHF.");
  });
  PX("agrand", () => {
    const [a, b] = pk([[10, 15], [9, 13], [12, 18], [10, 14]]), k = pk([1.5, 2.5, 3, 1.2]), k2 = pk([0.5, 0.4, 0.8]), A = r6(a * k);
    return PB("Une photo de " + X(a) + " cm sur " + X(b) + " cm est agrandie : sa largeur passe à " + X(A) + " cm.",
      [["a) Coefficient d'agrandissement", k], ["b) Nouvelle hauteur, en cm", r6(b * k)], ["c) On réduit ensuite cette nouvelle photo avec un coefficient de " + X(k2) + ". Largeur finale, en cm", r6(A * k2)]],
      ["Coefficient = nouvelle longueur ÷ ancienne longueur.", "Toutes les longueurs sont multipliées par le même coefficient."],
      "a) " + M(N(A) + " \\div " + a + " = " + N(k)) + ". b) " + M(b + " \\cdot " + N(k) + " = " + N(r6(b * k))) + " cm. c) " + M(N(A) + " \\cdot " + N(k2) + " = " + N(r6(A * k2))) + " cm.");
  });
})();
