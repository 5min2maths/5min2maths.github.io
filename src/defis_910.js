// ===================== 25.11 : défis (niveau 4) de 9e et 10e, suite =====================
// Sonde de couverture du 25.11 : 10 notions de 9e et 13 de 10e n'avaient aucun défi (le niveau 4 retombait sur le
// niveau 3). Même principe que src/defis_9.js : 2–3 étapes qui s'enchaînent, valeurs tirées au hasard, programme de la
// classe (plan de cheminement genevois), proposés à la classe et à la suivante (co ; 25.11 : savoir refaire ce qui est d'avant tant que ce n'est pas trivial). Chargé après variantes.js (PROBX).
(() => {
  if (typeof PROBX === "undefined") return;
  const ri = R.int, pk = R.pick;
  const r6 = (v) => Math.round(v * 1e6) / 1e6;
  const N = (v) => { const s = String(r6(v)), neg = s[0] === "-", [i, f] = (neg ? s.slice(1) : s).split("."); return (neg ? "-" : "") + (+i >= 1000 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}") : i) + (f ? "{,}" + f : ""); };
  const X = (v) => M(N(v));
  const PX = (id, co, f) => { (PROBX[id] = PROBX[id] || []).push(() => Object.assign(f(), { co })); };
  const sp = (v, rd) => (Array.isArray(v) ? { kind: "pair", values: v } : Object.assign({ kind: "value", value: rd ? v : +(+v).toPrecision(15) }, rd ? { round: rd } : {})); /* 26.11 (recalcul) : valeur exacte dans la réponse attendue (r6 donnait 0,666667 pour 2/3 : la fraction tapée était refusée) ; r6 reste pour l'affichage */
  const PB = (q, parts, hints, sol) => ({ q, hints, sol, parts: parts.map(([label, v, rd]) => ({ label, spec: sp(v, rd) })) });
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const pt = (x, y) => M("(" + N(x) + "\\,;\\," + N(y) + ")");
  const PAIRL = " (réponds « x ; y »)";

  // ======================= 9e et 10e =======================
  // 26.11 (vraisemblance, décision de l'enseignant) : un seul contexte par énoncé. Le défi « bus et croissants » est
  // séparé en deux défis : les bus (multiple commun), les corbeilles (diviseur commun).
  PX("arith", [9, 10, 11], () => {
    let a, b, m; do { a = pk([6, 8, 9, 10, 12, 15]); b = pk([8, 10, 12, 15, 18, 20]); m = (a * b) / gcd(a, b); } while (a >= b || gcd(a, b) === 1 || m > 120 || m === b);
    return PB("Deux bus partent ensemble du terminus à 7 h. Le premier repasse au terminus toutes les " + a + " minutes, le second toutes les " + b + " minutes.",
      [["a) Après combien de minutes les deux bus repartent-ils de nouveau ensemble ?", m], ["b) Combien de tours le premier bus a-t-il faits pendant ce temps ?", m / a], ["c) Et le second ?", m / b]],
      ["« Ensemble de nouveau » : un multiple commun aux deux durées, le plus petit (PPMC).", "Nombre de tours : la durée divisée par la durée d'un tour."],
      "a) PPMC(" + a + " ; " + b + ") = " + m + " minutes. b) " + M(m + " \\div " + a + " = " + m / a) + " tours. c) " + M(m + " \\div " + b + " = " + m / b) + " tours.");
  });
  PX("arith", [9, 10, 11], () => {
    let a, b, g; do { g = pk([4, 6, 8, 12]); a = g * ri(3, 9); b = g * ri(3, 9); } while (gcd(a / g, b / g) !== 1 || a === b || a > 80 || b > 80);
    return PB("Pour une fête, on veut répartir " + a + " croissants et " + b + " pains au chocolat dans des corbeilles identiques (même contenu dans chaque corbeille), avec le plus grand nombre de corbeilles possible.",
      [["a) Combien de corbeilles peut-on faire ?", g], ["b) Combien de croissants dans chaque corbeille ?", a / g], ["c) Combien de pains au chocolat dans chaque corbeille ?", b / g]],
      ["« Le plus grand nombre de corbeilles identiques » : un diviseur commun, le plus grand (PGDC).", "Chaque corbeille reçoit la même part : divise par le nombre de corbeilles."],
      "a) PGDC(" + a + " ; " + b + ") = " + g + " corbeilles. b) " + M(a + " \\div " + g + " = " + a / g) + " croissants. c) " + M(b + " \\div " + g + " = " + b / g) + " pains au chocolat.");
  });
  PX("diagr", [9, 10, 11], () => {
    let n, notes, k, tgt; do { n = pk([5, 6]); notes = Array.from({ length: n - 1 }, () => pk([3.5, 4, 4.5, 5, 5.5, 6])); tgt = pk([4.5, 5, 5.5]); k = r6(tgt * n - notes.reduce((s, x) => s + x, 0)); } while (k < 3 || k > 6 || Math.abs(k * 2 - Math.round(k * 2)) > 1e-9);
    const S = r6(notes.reduce((s, x) => s + x, 0)), m0 = r6(S / (n - 1));
    return PB("Léa a obtenu ces notes en maths : " + notes.map(X).join(" ; ") + ". Il reste un test avant la fin du semestre.",
      [["a) Moyenne actuelle (au centième)", m0, 0.01], ["b) Somme de ses notes actuelles", S], ["c) Quelle note doit-elle obtenir au dernier test pour avoir exactement " + N(tgt).replace("{,}", ",") + " de moyenne ?", k]],
      ["Moyenne = somme des notes ÷ nombre de notes.", "c) Avec " + n + " notes et une moyenne de " + N(tgt).replace("{,}", ",") + ", quelle doit être la somme des " + n + " notes ?"],
      "a) " + M(N(S) + " \\div " + (n - 1) + " \\approx " + N(Math.round(m0 * 100) / 100)) + ". b) " + X(S) + ". c) Somme nécessaire : " + M(n + " \\cdot " + N(tgt) + " = " + N(r6(n * tgt))) + " ; note : " + M(N(r6(n * tgt)) + " - " + N(S) + " = " + N(k)) + ".");
  });
  PX("premiers", [9, 10, 11], () => {
    const P = [[2, 3], [2, 5], [3, 5], [2, 7], [3, 7]], [p, q] = pk(P), a = pk([2, 3, 4]), b = a % 2 ? ri(1, 2) : 1, n = p ** a * q ** b, nd = (a + 1) * (b + 1), sq = (a % 2 ? p : 1) * (b % 2 ? q : 1);
    return PB("On considère le nombre " + X(n) + ".",
      [["a) Combien de facteurs premiers (comptés avec répétition) dans sa décomposition ?", a + b], ["b) Combien de diviseurs a-t-il en tout ?", nd], ["c) Par quel plus petit entier faut-il le multiplier pour obtenir un carré parfait ?", sq]],
      ["Décompose en divisant par 2, puis 3, puis 5, puis 7… tant que c'est possible.", "Un carré parfait : chaque facteur premier y apparaît un nombre pair de fois."],
      M(N(n) + " = " + p + "^{" + a + "} \\cdot " + q + (b > 1 ? "^{" + b + "}" : "")) + ". a) " + (a + b) + " facteurs. b) Un diviseur prend " + p + " de 0 à " + a + " fois et " + q + " de 0 à " + b + " fois : " + M((a + 1) + " \\cdot " + (b + 1) + " = " + nd) + ". c) Il faut rendre les exposants pairs : multiplier par " + sq + ".");
  });
  PX("fracper", [9, 10, 11], () => {
    const a = ri(1, 9), bc = pk([12, 27, 36, 45, 63, 81]), v = a / 10 + bc / 990;
    let num = a * 99 + bc, den = 990; const g = gcd(num, den); num /= g; den /= g;
    const s = "0{,}" + a + String(bc).padStart(2, "0") + String(bc).padStart(2, "0") + "\\ldots";
    return PB("On veut écrire " + M(s) + " (le groupe « " + String(bc).padStart(2, "0") + " » se répète) sous forme de fraction irréductible.",
      [["a) Combien vaut " + M("1000 \\cdot x - 10 \\cdot x") + " si " + M("x = " + s) + " ?", r6(990 * v)], ["b) Numérateur de la fraction irréductible", num], ["c) Dénominateur de la fraction irréductible", den]],
      ["Multiplie x par 10 pour amener la période juste après la virgule, puis par 1000 pour décaler d'une période : les parties décimales sont les mêmes.", "Soustrais, puis simplifie la fraction obtenue."],
      M("1000x = " + a + String(bc).padStart(2, "0") + "{,}" + String(bc).padStart(2, "0") + "\\ldots") + " et " + M("10x = " + a + "{,}" + String(bc).padStart(2, "0") + "\\ldots") + " ; " + M("990x = " + (a * 99 + bc)) + ", donc " + M("x = \\frac{" + (a * 99 + bc) + "}{990} = \\frac{" + num + "}{" + den + "}") + ".");
  });

  // ======================= 9e =======================
  PX("decarr", [9, 10], () => {
    const p = pk([12.4, 18.6, 23.7, 7.85, 9.45]), n = pk([3, 4, 6, 7]), t = r6(p * n);
    return PB("Au supermarché, Tom achète " + n + " articles à " + X(p) + " CHF pièce. Il arrondit chaque prix à l'unité pour calculer de tête.",
      [["a) Prix total exact, en CHF", t, 0.01], ["b) Total estimé avec les prix arrondis à l'unité", n * Math.round(p)], ["c) Différence entre l'estimation et le prix exact (en CHF, valeur positive)", r6(Math.abs(n * Math.round(p) - t)), 0.01]],
      ["Arrondir à l'unité : regarde le chiffre des dixièmes.", "c) Chaque arrondi fait une petite erreur ; elle est multipliée par " + n + "."],
      "a) " + M(n + " \\cdot " + N(p) + " = " + N(t)) + " CHF. b) " + N(p) + " ≈ " + Math.round(p) + " ; " + M(n + " \\cdot " + Math.round(p) + " = " + n * Math.round(p)) + " CHF. c) " + M("|" + n * Math.round(p) + " - " + N(t) + "| = " + N(r6(Math.abs(n * Math.round(p) - t)))) + " CHF.");
  });
  PX("decprob", [9, 10], () => {
    const l = pk([0.75, 0.5, 0.4]) /* 26.11 : et non 1,5 L de jus par personne */, pl = pk([1.8, 2.4, 3.6]), n = pk([12, 18, 24]), pu = pk([2.9, 3.45, 4.2]);
    const L = r6(l * n), bott = Math.ceil(r6(L / pl) - 1e-9), cost = r6(bott * pu), bil = [20, 50, 100].find((b) => b > cost);
    return PB("Pour un pique-nique de " + n + " personnes, on prévoit " + X(l) + " L de jus par personne. Le jus est vendu en bouteilles de " + X(pl) + " L à " + X(pu) + " CHF la bouteille. On paie avec un billet de " + bil + " CHF.",
      [["a) Quantité de jus nécessaire, en L", L], ["b) Nombre de bouteilles à acheter", bott], ["c) Monnaie rendue, en CHF", r6(bil - cost), 0.01]],
      ["b) On ne peut acheter qu'un nombre entier de bouteilles : arrondis vers le haut.", "c) Prix total des bouteilles, puis soustrais du billet."],
      "a) " + M(n + " \\cdot " + N(l) + " = " + N(L)) + " L. b) " + M(N(L) + " \\div " + N(pl) + " \\approx " + N(Math.round((L / pl) * 100) / 100)) + " : il faut " + bott + " bouteilles. c) " + M(bott + " \\cdot " + N(pu) + " = " + N(cost)) + " CHF ; " + M(bil + " - " + N(cost) + " = " + N(r6(bil - cost))) + " CHF.");
  });
  PX("multdiv", [9, 10], () => {
    let a, b; do { a = pk([4, 6, 8, 9, 12]); b = pk([6, 10, 15, 14, 21]); } while (a === b || gcd(a, b) === 1 || gcd(a, b) === Math.min(a, b));
    const L = (a * b) / gcd(a, b), lo = ri(1, 3) * 50, hi = lo + pk([200, 300]), cA = Math.floor(hi / a) - Math.floor((lo - 1) / a), cL = Math.floor(hi / L) - Math.floor((lo - 1) / L);
    return PB("On considère les nombres entiers de " + lo + " à " + hi + " (bornes comprises).",
      [["a) Combien sont des multiples de " + a + " ?", cA], ["b) Quel est le plus petit nombre non nul multiple à la fois de " + a + " et de " + b + " ?", L], ["c) Combien de nombres de la liste sont multiples à la fois de " + a + " et de " + b + " ?", cL]],
      ["Compte les multiples de " + a + " jusqu'à " + hi + ", puis enlève ceux qui sont avant " + lo + ".", "Multiple de " + a + " et de " + b + " : multiple de leur plus petit multiple commun (pas forcément " + a * b + ")."],
      "a) Jusqu'à " + hi + " : " + Math.floor(hi / a) + " multiples ; avant " + lo + " : " + Math.floor((lo - 1) / a) + " ; donc " + cA + ". b) " + L + " (et non " + a * b + "). c) Multiples de " + L + " : " + Math.floor(hi / L) + " − " + Math.floor((lo - 1) / L) + " = " + cL + ".");
  });
  PX("relrep", [9, 10], () => {
    let a, b, c; do { a = -ri(4, 12); b = ri(3, 11); c = -ri(2, 9); } while (a === c || Math.abs(a + b) < 3);
    const m = r6((a + b) / 2), d = b - a, e = b - c;
    return PB("Sur une droite graduée, le point " + M("A") + " a pour abscisse " + X(a) + ", le point " + M("B") + " a pour abscisse " + X(b) + " et le point " + M("C") + " a pour abscisse " + X(c) + ".",
      [["a) Distance entre " + M("A") + " et " + M("B"), d], ["b) Abscisse du milieu de " + M("[AB]"), m], ["c) De combien d'unités faut-il déplacer " + M("C") + " vers la droite pour qu'il soit à la même distance de " + M("B") + " que " + M("A") + " l'est de " + M("B") + ", de l'autre côté de " + M("B") + " ?", b + d - c]],
      ["Distance entre deux points : la plus grande abscisse moins la plus petite.", "c) Le point cherché est à " + d + " unités à droite de B."],
      "a) " + M(b + " - (" + a + ") = " + d) + ". b) " + M("(" + a + " + " + b + ") \\div 2 = " + N(m)) + ". c) Point cherché : " + M(b + " + " + d + " = " + (b + d)) + " ; déplacement : " + M((b + d) + " - (" + c + ") = " + (b + d - c)) + " unités.");
  });
  PX("quadri", [9, 10], () => {
    const al = pk([32, 38, 44, 52, 58, 64]), b = (180 - 2 * al) / 2, kind = R.rand() < 0.5;
    return kind ? PB("Dans un losange " + M("ABCD") + ", l'angle " + M("\\widehat{BAC}") + " (entre le côté et la diagonale) mesure " + al + "°. Les diagonales se coupent en " + M("O") + ".",
      [["a) Angle " + M("\\widehat{BAD}") + " (en degrés)", 2 * al], ["b) Angle " + M("\\widehat{AOB}") + " (en degrés)", 90], ["c) Angle " + M("\\widehat{ABC}") + " (en degrés)", 180 - 2 * al]],
      ["Dans un losange, les diagonales sont les bissectrices des angles et elles sont perpendiculaires.", "Deux angles consécutifs d'un losange sont supplémentaires (somme 180°)."],
      "a) La diagonale [AC] est bissectrice : " + M("2 \\cdot " + al + "° = " + 2 * al + "°") + ". b) Diagonales perpendiculaires : 90°. c) " + M("180° - " + 2 * al + "° = " + (180 - 2 * al) + "°") + ".")
      : PB("Dans un rectangle " + M("ABCD") + ", les diagonales se coupent en " + M("O") + " et l'angle " + M("\\widehat{OAB}") + " mesure " + al + "°.",
      [["a) Angle " + M("\\widehat{OBA}") + " (en degrés)", al], ["b) Angle " + M("\\widehat{AOB}") + " (en degrés)", 180 - 2 * al], ["c) Angle " + M("\\widehat{BOC}") + " (en degrés)", 2 * al]],
      ["Dans un rectangle, les diagonales ont la même longueur et se coupent en leur milieu : OA = OB.", "Les angles AOB et BOC sont adjacents et forment un angle plat."],
      "a) OA = OB : le triangle AOB est isocèle, donc " + al + "°. b) " + M("180° - 2 \\cdot " + al + "° = " + (180 - 2 * al) + "°") + ". c) " + M("180° - " + (180 - 2 * al) + "° = " + 2 * al + "°") + ".");
  });
  PX("symetries", [9, 10], () => {
    let ax, ay, cx, cy, tx, ty; do { ax = ri(-5, 5); ay = ri(-5, 5); cx = ri(-3, 3); cy = ri(-3, 3); tx = ri(-4, 4); ty = ri(-4, 4); } while ((ax === cx && ay === cy) || !tx || !ty || !ax || !ay);
    const bx = 2 * cx - ax, by = 2 * cy - ay;
    return PB("Dans un repère, " + M("A") + pt(ax, ay) + " et " + M("C") + pt(cx, cy) + ". " + M("B") + " est l'image de " + M("A") + " par la symétrie de centre " + M("C") + ", puis " + M("D") + " est l'image de " + M("B") + " par la translation qui envoie " + M("O(0\\,;\\,0)") + " sur " + M("T") + pt(tx, ty) + ".",
      [["a) Coordonnées de " + M("B") + PAIRL, [bx, by]], ["b) Coordonnées de " + M("D") + PAIRL, [bx + tx, by + ty]], ["c) Coordonnées de l'image de " + M("A") + " par la symétrie d'axe des ordonnées" + PAIRL, [-ax, ay]]],
      ["C est le milieu de [AB] : pour passer de A à C, et de C à B, on fait le même déplacement.", "Translation : on ajoute " + tx + " à l'abscisse et " + ty + " à l'ordonnée."],
      "a) De A à C : " + M("(" + (cx - ax) + "\\,;\\," + (cy - ay) + ")") + " ; on recommence depuis C : " + M("B") + pt(bx, by) + ". b) " + M("D") + pt(bx + tx, by + ty) + ". c) L'abscisse change de signe : " + pt(-ax, ay) + ".");
  });

  // ======================= 10e =======================
  PX("rac", [10, 11], () => {
    const s = pk([7, 9, 11, 12, 13, 15]), V = s ** 3, k = pk([4, 9, 16, 25]);
    return PB("Un cube a un volume de " + X(V) + " cm³. Un carré a une aire égale à l'aire totale du cube.",
      [["a) Arête du cube, en cm", s], ["b) Aire totale du cube, en cm²", 6 * s * s], ["c) Côté d'un carré dont l'aire est " + k + " fois celle d'une face du cube, en cm", Math.sqrt(k) * s]],
      ["L'arête est la racine cubique du volume : quel nombre multiplié trois fois par lui-même donne " + N(V) + " ?", "c) Aire du carré = " + k + " · " + s * s + " ; son côté est la racine carrée de cette aire."],
      "a) " + M(s + "^3 = " + N(V)) + ", donc " + s + " cm. b) " + M("6 \\cdot " + s + "^2 = " + N(6 * s * s)) + " cm². c) " + M("\\sqrt{" + k + " \\cdot " + s * s + "} = \\sqrt{" + N(k * s * s) + "} = " + Math.sqrt(k) * s) + " cm.");
  });
  PX("disque", [10, 11], () => {
    const r = pk([3, 4, 5, 6, 8]), a = pk([60, 72, 120, 135, 150, 240]), L = (a / 360) * 2 * Math.PI * r, A = (a / 360) * Math.PI * r * r;
    return PB("Une part de pizza est un secteur de disque de rayon " + r + " cm et d'angle " + a + "°.",
      [["a) Longueur de l'arc de croûte, en cm (au centième)", L, 0.01], ["b) Périmètre total de la part, en cm (au centième)", L + 2 * r, 0.01], ["c) Aire de la part, en cm² (au centième)", A, 0.01]],
      ["La part représente " + a + "/360 du disque entier.", "Le périmètre de la part : l'arc et deux rayons."],
      "Fraction du disque : " + M("\\frac{" + a + "}{360}") + ". a) " + M("\\frac{" + a + "}{360} \\cdot 2\\pi \\cdot " + r + " \\approx " + N(Math.round(L * 100) / 100)) + " cm. b) " + M(N(Math.round(L * 100) / 100) + " + 2 \\cdot " + r + " \\approx " + N(Math.round((L + 2 * r) * 100) / 100)) + " cm. c) " + M("\\frac{" + a + "}{360} \\cdot \\pi \\cdot " + r + "^2 \\approx " + N(Math.round(A * 100) / 100)) + " cm².");
  });
  PX("polyreg", [10, 11], () => {
    const n = pk([5, 6, 8, 9, 10, 12, 15]), S = (n - 2) * 180, ai = S / n, ae = 360 / n;
    return PB("Un polygone régulier a des angles intérieurs dont la somme vaut " + X(S) + "°.",
      [["a) Nombre de côtés", n], ["b) Mesure d'un angle intérieur (en degrés)", ai], ["c) Mesure de l'angle au centre (en degrés)", ae]],
      ["Somme des angles intérieurs d'un polygone à n côtés : (n − 2) · 180°.", "L'angle au centre partage le tour complet (360°) en n parts égales."],
      "a) " + M("(n - 2) \\cdot 180 = " + N(S)) + ", donc " + M("n - 2 = " + (n - 2)) + " et " + M("n = " + n) + ". b) " + M(N(S) + " \\div " + n + " = " + N(ai) + "°") + ". c) " + M("360° \\div " + n + " = " + N(ae) + "°") + " (et " + M(N(ai) + "° + " + N(ae) + "° = 180°") + ").");
  });
  PX("grandmanq", [10, 11], () => {
    const b1 = pk([6, 8, 10]), b2 = pk([12, 14, 16]), h = pk([5, 6, 7, 9]), A = ((b1 + b2) * h) / 2, w = pk([3, 4, 5, 6, 8].filter((x) => A % x === 0 && A / x !== x)) || 2;
    return PB("Un trapèze a des bases de " + b1 + " cm et " + b2 + " cm. Son aire vaut " + X(A) + " cm². Un rectangle de largeur " + w + " cm a la même aire.",
      [["a) Hauteur du trapèze, en cm", h], ["b) Longueur du rectangle, en cm", A / w], ["c) Côté d'un triangle rectangle isocèle de même aire (côtés de l'angle droit), en cm (au centième)", Math.sqrt(2 * A), 0.01]],
      ["Aire du trapèze = (grande base + petite base) · hauteur ÷ 2 : isole la hauteur.", "c) Triangle rectangle isocèle de côté c : aire = c · c ÷ 2."],
      "a) " + M("h = 2 \\cdot " + N(A) + " \\div (" + b1 + " + " + b2 + ") = " + h) + " cm. b) " + M(N(A) + " \\div " + w + " = " + N(A / w)) + " cm. c) " + M("c^2 = 2 \\cdot " + N(A) + " = " + N(2 * A)) + ", " + M("c = \\sqrt{" + N(2 * A) + "} \\approx " + N(Math.round(Math.sqrt(2 * A) * 100) / 100)) + " cm.");
  });
  PX("airelat", [10, 11], () => {
    const d = pk([6, 8, 10, 12]), h = pk([9, 11, 14, 15]), r = d / 2, AL = 2 * Math.PI * r * h, AT = AL + 2 * Math.PI * r * r, p = pk([2.5, 3.2, 4]);
    return PB("Une boîte de conserve cylindrique a un diamètre de " + d + " cm et une hauteur de " + h + " cm. L'étiquette recouvre toute la surface latérale.",
      [["a) Aire de l'étiquette, en cm² (au centième)", AL, 0.01], ["b) Aire totale de métal (avec les deux disques), en cm² (au centième)", AT, 0.01], ["c) L'étiquette est un rectangle : sa longueur, en cm (au centième)", Math.PI * d, 0.01]],
      ["Déroulée, la surface latérale est un rectangle : sa longueur est le périmètre du disque, sa largeur la hauteur.", "Aire d'un disque : π · r² ; attention, r = " + r + " cm."],
      "c) Longueur : " + M("\\pi \\cdot " + d + " \\approx " + N(Math.round(Math.PI * d * 100) / 100)) + " cm. a) " + M("\\pi \\cdot " + d + " \\cdot " + h + " \\approx " + N(Math.round(AL * 100) / 100)) + " cm². b) " + M(N(Math.round(AL * 100) / 100) + " + 2 \\cdot \\pi \\cdot " + r + "^2 \\approx " + N(Math.round(AT * 100) / 100)) + " cm².");
  });
  PX("voldecomp", [10, 11], () => {
    const L = pk([8, 10, 12]), l = pk([4, 5, 6]), h1 = pk([1.2, 1.5, 1.8]), h2 = pk([2.2, 2.5, 3]), V = r6(L * l * h1 + (L / 2) * l * (h2 - h1)), t = pk([20, 25, 40]);
    return PB("Une piscine a la forme d'un pavé de " + L + " m sur " + l + " m. Sur la moitié de sa longueur, la profondeur est de " + X(h1) + " m ; sur l'autre moitié, elle est de " + X(h2) + " m (deux pavés accolés).",
      [["a) Volume d'eau quand elle est pleine, en m³", V], ["b) Ce volume en litres", V * 1000], ["c) On la remplit avec un débit de " + t + " m³ par heure : durée en heures (au dixième)", V / t, 0.1]],
      ["Découpe en deux pavés : chacun mesure " + L / 2 + " m sur " + l + " m.", "1 m³ = 1'000 L."],
      "a) " + M(N(L / 2) + " \\cdot " + l + " \\cdot " + N(h1) + " + " + N(L / 2) + " \\cdot " + l + " \\cdot " + N(h2) + " = " + N(r6((L / 2) * l * h1)) + " + " + N(r6((L / 2) * l * h2)) + " = " + N(r6((L / 2) * l * (h1 + h2)))) + " m³. b) " + X(r6((L / 2) * l * (h1 + h2) * 1000)) + " L. c) " + M(N(r6((L / 2) * l * (h1 + h2))) + " \\div " + t + " \\approx " + N(Math.round(((L / 2) * l * (h1 + h2) / t) * 10) / 10)) + " h.");
  });
  PX("eqverif", [10, 11], () => {
    let a, b; do { a = ri(2, 9); b = ri(2, 9); } while (a === b);
    const s = a + b, p = a * b, cands = [a, b, s, -a, p > 30 ? b + 1 : p].sort(() => R.rand() - 0.5), ok = cands.filter((x) => x * x + p === s * x);
    const c = ri(2, 5);
    return PB("On considère l'équation " + M("x^2 + " + p + " = " + s + "x") + " et les nombres " + cands.map(X).join(" ; ") + ".",
      [["a) Combien de ces nombres sont solutions ?", ok.length], ["b) La somme des solutions trouvées", ok.reduce((t, x) => t + x, 0)], ["c) Pour quelle valeur de " + M("k") + " le nombre " + c + " est-il solution de " + M("x^2 + k = " + s + "x") + " ?", s * c - c * c]],
      ["Remplace x par chaque nombre, calcule les deux membres séparément, et compare.", "c) Remplace x par " + c + " : il reste une équation en k."],
      cands.map((x) => M("x = " + x) + " : " + M(N(x * x + p) + (x * x + p === s * x ? " = " : " \\neq ") + N(s * x))).join(" ; ") + ". a) " + ok.length + ". b) " + ok.reduce((t, x) => t + x, 0) + ". c) " + M(c + "^2 + k = " + s + " \\cdot " + c) + ", donc " + M("k = " + s * c + " - " + c * c + " = " + (s * c - c * c)) + ".");
  });
  PX("pente", [10, 11], () => {
    const p = pk([8, 12, 15, 18, 24]), d = pk([250, 400, 600, 750]), dh = r6((p / 100) * d), t = pk([10, 12, 15]);
    return PB("Une route de montagne a une pente constante de " + p + " %. Elle franchit une distance horizontale de " + X(d) + " m. Un panneau prévient : « dénivelé de " + t + " % sur la descente suivante ».",
      [["a) Dénivelé de cette route, en m", dh], ["b) Distance horizontale pour monter de 100 m avec cette pente, en m (au dixième)", 10000 / p, 0.1], ["c) Sur la descente à " + t + " %, quelle distance horizontale pour descendre de " + X(dh) + " m ?", r6((dh * 100) / t), 0.1]],
      ["Pente en % = dénivelé ÷ distance horizontale · 100.", "b) et c) Isole la distance horizontale : dénivelé ÷ pente · 100."],
      "a) " + M(N(p / 100) + " \\cdot " + N(d) + " = " + N(dh)) + " m. b) " + M("100 \\div " + N(p / 100) + " \\approx " + N(Math.round((10000 / p) * 10) / 10)) + " m. c) " + M(N(dh) + " \\div " + N(t / 100) + " = " + N(r6((dh * 100) / t))) + " m.");
  });
  PX("rotation", [10, 11], () => {
    let x, y, cx, cy; do { x = ri(-5, 5); y = ri(-5, 5); cx = ri(-2, 2); cy = ri(-2, 2); } while (!x || !y || (x === cx && y === cy) || Math.abs(x) === Math.abs(y));
    const r90 = [-y, x], r180 = [-x, -y], u = x - cx, v = y - cy, rc = [cx - v, cy + u];
    return PB("Dans un repère, on considère le point " + M("A") + pt(x, y) + ". Les rotations tournent dans le sens inverse des aiguilles d'une montre.",
      [["a) Image de " + M("A") + " par la rotation de centre " + M("O(0\\,;\\,0)") + " et d'angle 90°" + PAIRL, r90], ["b) Image de " + M("A") + " par la rotation de centre " + M("O") + " et d'angle 180°" + PAIRL, r180], ["c) Image de " + M("A") + " par la rotation de centre " + M("C") + pt(cx, cy) + " et d'angle 90°" + PAIRL, rc]],
      ["Rotation de 90° autour de l'origine : (x ; y) devient (−y ; x). Fais un dessin pour vérifier.", "c) Travaille avec le déplacement de C vers A, fais-le tourner de 90°, puis repars de C."],
      "a) " + pt(r90[0], r90[1]) + ". b) " + pt(r180[0], r180[1]) + " (symétrie de centre O). c) De C à A : " + M("(" + u + "\\,;\\," + v + ")") + " ; tourné de 90° : " + M("(" + -v + "\\,;\\," + u + ")") + " ; image : " + pt(rc[0], rc[1]) + ".");
  });
})();
