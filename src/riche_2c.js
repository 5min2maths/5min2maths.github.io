// 2e Collège (23.11) : sujets de préparation riches des chapitres de 2e (équations cartésiennes, polynômes, fonctions
// rationnelles, exponentielles, composition et réciproque, logarithmes, trigonométrie, vecteurs). Niveau Collège de
// Genève (DF), nettement au-dessus de la MP : paramètres, valeurs exactes, justification. Outils communs : RX
// (riche_mp2.js). Banques réservées au Collège (track: "col").
(function () {
  const { N, A, Q, pk, g2, FR, lin, cx, sg, par, X, ul, who, tab, VF, shuffle, D } = RX;
  const T = (v) => M(N(v));
  const FRp = (v) => FR(v).replace(/\\frac\{(\d+)\}\{(\d+)\}/, "$1/$2"); // forme tapée d'une fraction
  // Racine simplifiée : n = k²·m → [latex, forme tapée].
  const sq = (n) => { let k = 1; for (let d = 2; d * d <= n; d++) while (n % (d * d) === 0) { n /= d * d; k *= d; } return n === 1 ? [String(k), String(k)] : [(k === 1 ? "" : k) + "\\sqrt{" + n + "}", (k === 1 ? "" : k) + "√" + n]; };
  // Polynôme (coefficients du plus haut degré au terme constant), coefficients exacts.
  const poly = (c, x = "x") => { const n = c.length - 1; let s = ""; c.forEach((a, i) => { const e = n - i; if (Math.abs(a) < 1e-12) return; const mono = e === 0 ? FR(Math.abs(a)) : (Math.abs(Math.abs(a) - 1) < 1e-12 ? "" : FR(Math.abs(a))) + x + (e > 1 ? "^{" + e + "}" : ""); s += s ? (a < 0 ? " - " : " + ") + mono : (a < 0 ? "-" : "") + mono; }); return s || "0"; };
  const pv = (c, x) => c.reduce((s, a) => s * x + a, 0);
  const fac = (r, x = "x") => "(" + x + (r < 0 ? " + " + FR(-r) : " - " + FR(r)) + ")";
  const pt = (x, y) => "(" + FR(x) + " \\,;\\, " + FR(y) + ")";

  // ===================== 2e · 1. Équations cartésiennes =====================
  const EXC = [
    // Le triangle rectangle caché (distance, milieu, cercle circonscrit)
    () => { const xa = R.int(-4, 0), ya = R.int(-3, 1), [p0, q0] = pk([[2, 1], [1, 2], [3, 1], [1, 3], [2, 3], [3, 2]]), s1 = pk([1, -1]), p = p0 * s1, q = q0, k = pk([1, 2]);
      const C = [xa + p, ya + q], B = [C[0] - k * q, C[1] + k * p], O = [(xa + B[0]) / 2, (ya + B[1]) / 2], r2 = ((1 + k * k) * (p * p + q * q)) / 4, on = R.rand() < 0.5, Dp = [xa + B[0] - C[0] + (on ? 0 : 1), ya + B[1] - C[1]], dd = (Dp[0] - O[0]) ** 2 + (Dp[1] - O[1]) ** 2;
      const AC = sq(p * p + q * q), BC = sq(k * k * (p * p + q * q)), AB = sq((1 + k * k) * (p * p + q * q));
      return X({ id: "cart", lv: 1, titre: "Le triangle et son cercle",
        q: "On donne " + M("A" + pt(xa, ya)) + ", " + M("B" + pt(B[0], B[1])) + " et " + M("C" + pt(C[0], C[1])) + ".",
        parts: [{ label: "Calcule les longueurs exactes " + M("AB") + ", " + M("AC") + " et " + M("BC") + ".", pts: 2 }, { label: "Montre que le triangle " + M("ABC") + " est rectangle. En quel sommet ?", pts: 1 }, { label: "Donne le centre, le rayon et l'équation du cercle circonscrit au triangle.", pts: 2 }, { label: "Le point " + M("D" + pt(Dp[0], Dp[1])) + " est-il sur ce cercle ? Justifie.", pts: 1 }],
        sol: ul([M("AB = \\sqrt{" + (B[0] - xa) ** 2 + " + " + (B[1] - ya) ** 2 + "} = " + AB[0]) + ", " + M("AC = " + AC[0]) + ", " + M("BC = " + BC[0]) + ".", M("AC^2 + BC^2 = " + (p * p + q * q) + " + " + k * k * (p * p + q * q) + " = " + (1 + k * k) * (p * p + q * q) + " = AB^2") + " : rectangle en " + M("C") + " (réciproque de Pythagore).", "L'hypoténuse est un diamètre : centre " + M("\\Omega" + pt(O[0], O[1])) + " (milieu de " + M("[AB]") + "), rayon " + M("\\frac{AB}{2}") + ", " + M("r^2 = " + FR(r2)) + " : " + M("(x" + sg(-O[0]) + ")^2 + (y" + sg(-O[1]) + ")^2 = " + FR(r2)) + ".", M("(" + FR(Dp[0]) + sg(-O[0]) + ")^2 + (" + FR(Dp[1]) + sg(-O[1]) + ")^2 = " + FR(dd)) + (on ? " : oui, " + M("D") + " est sur le cercle (c'est le symétrique de " + M("C") + " par rapport à " + M("\\Omega") + ")." : " ≠ " + M(FR(r2)) + " : non.")]),
        chk: [[Math.hypot(B[0] - xa, B[1] - ya), AB[1]], [r2, FRp(r2)], [dd, FRp(dd)]] }); },
    // La route et la maison (perpendiculaire, intersection, distance point-droite)
    () => { const [p, q] = pk([[2, 1], [1, 2], [-1, 2], [-2, 1], [1, 3], [3, 1], [-3, 1], [-1, 3]]), m = p / q, F = [R.int(-3, 3), R.int(-2, 3)], k = pk([1, 2]) * pk([1, -1]);
      const R1 = [F[0] - q, F[1] - p], R2 = [F[0] + 2 * q, F[1] + 2 * p], H = [F[0] - k * p, F[1] + k * q], h = F[1] - m * F[0], mp = -1 / m, hp = H[1] - mp * H[0], dist = sq(k * k * (p * p + q * q)), cost = pk([80, 120, 150]);
      return X({ id: "droitesinter", lv: 2, titre: "La route et la maison",
        q: "Dans un repère (unité : 10 m), une route rectiligne passe par " + M("R_1" + pt(R1[0], R1[1])) + " et " + M("R_2" + pt(R2[0], R2[1])) + ". Une maison est en " + M("H" + pt(H[0], H[1])) + ". On veut la relier à la route par le chemin le plus court ; il coûte " + Q(cost, "CHF") + " par mètre.",
        parts: [{ label: "Donne l'équation de la route " + M("d") + ".", pts: 1 }, { label: "Donne l'équation de la droite " + M("p") + " perpendiculaire à " + M("d") + " passant par " + M("H") + ".", pts: 1 }, { label: "Calcule le point " + M("F") + " où le chemin rejoint la route.", pts: 2 }, { label: "Calcule la longueur du chemin (valeur exacte, puis en mètres au décimètre) et son coût.", pts: 2 }],
        sol: ul(["Pente " + M(FR(m)) + " ; " + M("d : y = " + lin(m, h)) + ".", "Pente " + M(FR(mp)) + " (produit des pentes −1) ; " + M("p : y = " + lin(mp, hp)) + ".", M(lin(m, h) + " = " + lin(mp, hp)) + " ⟺ " + M("x = " + F[0]) + " ; " + M("F" + pt(F[0], F[1])) + ".", M("HF = \\sqrt{" + (k * p) ** 2 + " + " + (k * q) ** 2 + "} = " + dist[0]) + " unités, soit " + M("\\approx " + A(10 * Math.hypot(k * p, k * q), 1)) + " m ; coût " + M("\\approx " + N(Math.round(10 * Math.hypot(k * p, k * q) * cost))) + " CHF."]),
        chk: [[(hp - h) / (m - mp), String(F[0])], [Math.hypot(H[0] - F[0], H[1] - F[1]), dist[1]], [10 * Math.hypot(k * p, k * q), A(10 * Math.hypot(k * p, k * q), 1), 0.1]] }); },
    // Cercle donné sous forme développée, corde
    () => { const a = pk([-3, -2, -1, 1, 2, 3]), b = pk([-2, -1, 1, 2, 4]), s = pk([1, 2]), r2 = 25 * s * s, F = a * a + b * b - r2, h = b - a + s, P1 = [a + 3 * s, b + 4 * s], P2 = [a - 4 * s, b - 3 * s], Pq = [a + pk([1, 2]) * s, b - pk([3, 6]) * s], dq = (Pq[0] - a) ** 2 + (Pq[1] - b) ** 2;
      return X({ id: "cercle", lv: 2, titre: "Un cercle déguisé",
        q: "On considère l'équation " + M("x^2 + y^2" + (a ? sg(-2 * a) + "x" : "") + sg(-2 * b) + "y" + sg(F) + " = 0") + " et la droite " + M("d : y = " + lin(1, h)) + ".",
        parts: [{ label: "Montre que c'est l'équation d'un cercle ; donne son centre et son rayon.", pts: 2 }, { label: "Le point " + M("P" + pt(Pq[0], Pq[1])) + " est-il à l'intérieur ou à l'extérieur du cercle ?", pts: 1 }, { label: "Calcule les points d'intersection du cercle et de " + M("d") + ".", pts: 2 }, { label: "Calcule la longueur de la corde obtenue.", pts: 1 }],
        sol: ul(["On complète les carrés : " + M("(x" + sg(-a) + ")^2 + (y" + sg(-b) + ")^2 = " + (a * a) + " + " + (b * b) + sg(-F) + " = " + r2) + " : centre " + M(pt(a, b)) + ", rayon " + M(5 * s) + ".", "Distance au centre au carré : " + M(dq) + (dq < r2 ? " \\lt " : " > ") + M(r2) + " : " + (dq < r2 ? "à l'intérieur." : "à l'extérieur."), "On remplace " + M("y") + " : " + M("(x" + sg(-a) + ")^2 + (x" + sg(h - b) + ")^2 = " + r2) + ", soit " + M("2x^2" + sg(-2 * a + 2 * (h - b)) + "x" + sg(a * a + (h - b) ** 2 - r2) + " = 0") + " ; " + M("x = " + P1[0]) + " ou " + M("x = " + P2[0]) + " : " + M(pt(P1[0], P1[1])) + " et " + M(pt(P2[0], P2[1])) + ".", M("\\sqrt{" + (7 * s) ** 2 + " + " + (7 * s) ** 2 + "} = " + 7 * s + "\\sqrt{2}") + "."]),
        chk: [[Math.sqrt(a * a + b * b - F), String(5 * s)], [P1[0] + h, String(P1[1])], [P2[0] + h, String(P2[1])], [Math.hypot(P1[0] - P2[0], P1[1] - P2[1]), 7 * s + "√2"]] }); },
    // Tangentes à un cercle
    () => { const a = pk([-2, -1, 1, 2, 3]), b = pk([-3, -1, 1, 2]), [u0, v0] = pk([[3, 4], [4, 3]]), u = u0 * pk([1, -1]), v = v0 * pk([1, -1]), T1 = [a + u, b + v], T2 = [a - u, b - v];
      const mt = -u / v, h1 = T1[1] - mt * T1[0], h2 = T2[1] - mt * T2[0];
      return X({ id: "cercletan", lv: 3, titre: "Deux tangentes parallèles",
        q: "Le cercle " + M("\\Gamma") + " a pour équation " + M("(x" + sg(-a) + ")^2 + (y" + sg(-b) + ")^2 = 25") + ". On considère le point " + M("T" + pt(T1[0], T1[1])) + ".",
        parts: [{ label: "Vérifie que " + M("T") + " est sur " + M("\\Gamma") + ".", pts: 1 }, { label: "Donne l'équation de la tangente " + M("t") + " à " + M("\\Gamma") + " en " + M("T") + ".", pts: 2 }, { label: "Une autre tangente est parallèle à " + M("t") + ". En quel point touche-t-elle le cercle ? Donne son équation.", pts: 2 }, { label: "Quelle est la distance entre ces deux tangentes ? Justifie sans calcul.", pts: 1 }],
        sol: ul([M("(" + T1[0] + sg(-a) + ")^2 + (" + T1[1] + sg(-b) + ")^2 = " + u * u + " + " + v * v + " = 25") + " ✓.", "La tangente est perpendiculaire au rayon " + M("\\Omega T") + ", de pente " + M(FR(v / u)) + " : pente " + M(FR(mt)) + ", " + M("t : y = " + lin(mt, h1)) + ".", "Au point diamétralement opposé " + M("T'" + pt(T2[0], T2[1])) + " (symétrique de " + M("T") + " par rapport au centre) : " + M("y = " + lin(mt, h2)) + ".", "Elle vaut le diamètre, 10 : les deux tangentes sont perpendiculaires au même diamètre " + M("[TT']") + "."]),
        chk: [[(T1[0] - a) ** 2 + (T1[1] - b) ** 2, "25"], [mt * T2[0] + h2, String(T2[1])], [Math.abs(h1 - h2) / Math.sqrt(1 + mt * mt), "10"]] }); },
  ];
  const RAISONC = [
    () => { const xa = R.int(-5, -1), ya = R.int(1, 6), xb = R.int(2, 8), yb = R.int(-4, 0), w = who();
      return X({ id: "cart", lv: 1, titre: "Trouve l'erreur",
        q: w + " calcule le milieu de " + M("[AB]") + " avec " + M("A" + pt(xa, ya)) + " et " + M("B" + pt(xb, yb)) + " : « " + M("M = \\left(\\frac{" + xb + " - " + par(xa) + "}{2} \\,;\\, \\frac{" + yb + " - " + ya + "}{2}\\right) = " + pt((xb - xa) / 2, (yb - ya) / 2)) + " ».",
        parts: [{ label: "Calcule " + M("AM") + " et " + M("MB") + " avec son point. Que constates-tu ?", pts: 1 }, { label: "Corrige.", pts: 1 }],
        sol: ul(["Les deux distances ne sont pas égales (son point n'est d'ailleurs pas sur le segment) : ce n'est pas le milieu.", "On fait la moyenne des coordonnées : " + M("M = \\left(\\frac{" + xa + " + " + xb + "}{2} \\,;\\, \\frac{" + ya + " + " + par(yb) + "}{2}\\right) = " + pt((xa + xb) / 2, (ya + yb) / 2)) + "."]),
        chk: [[(xa + xb) / 2, FRp((xa + xb) / 2)]] }); },
    () => VF("cercle", 2, [["« " + M("x^2 + y^2 + 4 = 0") + " est l'équation d'un cercle. »", false, "On aurait " + M("x^2 + y^2 = -4") + " : impossible, aucun point."],
      ["« Le cercle " + M("(x - 1)^2 + (y + 2)^2 = 9") + " passe par l'origine. »", false, M("1 + 4 = 5 \\neq 9") + "."],
      ["« Une tangente à un cercle est perpendiculaire au rayon au point de contact. »", true, "C'est la propriété de la tangente (distance minimale au centre)."],
      ["« Les droites " + M("2x - y + 1 = 0") + " et " + M("x + 2y = 5") + " sont perpendiculaires. »", true, "Pentes 2 et " + M("-\\frac{1}{2}") + " : produit −1."],
      ["« Une droite coupe toujours un cercle en deux points. »", false, "Elle peut être tangente (1 point) ou extérieure (aucun)."],
      ["« La médiatrice de " + M("[AB]") + " est l'ensemble des points équidistants de " + M("A") + " et " + M("B") + ". »", true, "C'est sa définition ; elle passe par le milieu, perpendiculairement à " + M("(AB)") + "."]]),
  ];

  // ===================== 2e · 3. Fonctions polynomiales =====================
  const EXP = [
    // Racine évidente, factorisation, inéquation
    () => { let r1, r2, r3; do { r1 = pk([1, -1, 2]); r2 = R.int(-4, 4); r3 = R.int(-4, 4); } while (new Set([r1, r2, r3]).size < 3 || r2 * r3 === 0 || r1 + r2 + r3 === 0 || r1 * r2 + r1 * r3 + r2 * r3 === 0);
      const c = [1, -(r1 + r2 + r3), r1 * r2 + r1 * r3 + r2 * r3, -r1 * r2 * r3], [q1, q2, q3] = [r1, r2, r3].sort((x, y) => x - y);
      return X({ id: "polyfact", lv: 2, titre: "Une racine évidente",
        q: "Soit " + M("P(x) = " + poly(c)) + ".",
        parts: [{ label: "Calcule " + M("P(" + r1 + ")") + ". Que peux-tu en déduire ?", pts: 1 }, { label: "Divise " + M("P(x)") + " par " + M(fac(r1).slice(1, -1)) + " (schéma de Horner ou division).", pts: 1 }, { label: "Factorise complètement " + M("P(x)") + ".", pts: 1 }, { label: "Résous " + M("P(x) \\ge 0") + " (tableau de signes).", pts: 2 }],
        sol: ul([M("P(" + r1 + ") = 0") + " : " + M(r1) + " est une racine, donc " + M(fac(r1)) + " divise " + M("P(x)") + ".", "Quotient " + M(poly([1, -(r2 + r3), r2 * r3])) + ", reste 0.", M("P(x) = " + fac(q1) + fac(q2) + fac(q3)) + ".", "Signe d'un polynôme de degré 3 de coefficient dominant positif : −, +, −, + : " + M("S = [" + q1 + " \\,;\\, " + q2 + "] \\cup [" + q3 + " \\,;\\, +\\infty[") + "."]),
        chk: [[r2 + r3, String(r2 + r3)], [pv(c, q1 - 0.5) < 0 ? 1 : 0, "1"]] }); },
    // La boîte sans couvercle (modéliser, racine connue, factoriser)
    () => { const [L, l, x0] = pk([[20, 12, 2], [24, 16, 2], [30, 20, 3], [16, 10, 1], [24, 14, 3], [30, 16, 2], [40, 24, 4]]), V0 = x0 * (L - 2 * x0) * (l - 2 * x0), b = -2 * (L + l) + 4 * x0, c = L * l + b * x0, Dl = b * b - 16 * c, r = [(-b - Math.sqrt(Dl)) / 8, (-b + Math.sqrt(Dl)) / 8], ok = r.filter((x) => x > 0 && x < l / 2), no = r.filter((x) => !(x > 0 && x < l / 2));
      return X({ id: "polyexpr", lv: 2, titre: "La boîte sans couvercle",
        q: "Dans une plaque de carton de " + Q(L, "cm") + " sur " + Q(l, "cm") + ", on découpe un carré de côté " + M("x") + " cm à chaque coin, puis on relève les bords pour former une boîte sans couvercle.",
        parts: [{ label: "Exprime le volume " + M("V(x)") + " sous forme factorisée puis développée.", pts: 2 }, { label: "Pour quelles valeurs de " + M("x") + " la boîte existe-t-elle ?", pts: 1 }, { label: "Calcule " + M("V(" + x0 + ")") + ".", pts: 1 }, { label: "Trouve toutes les autres valeurs de " + M("x") + " qui donnent le même volume (au centième).", pts: 2 }],
        sol: ul([M("V(x) = x(" + L + " - 2x)(" + l + " - 2x) = " + poly([4, -2 * (L + l), L * l, 0])) + ".", M("0 \\lt x \\lt " + l / 2) + " (la largeur " + M(l + " - 2x") + " doit rester positive).", M("V(" + x0 + ") = " + x0 + " \\cdot " + (L - 2 * x0) + " \\cdot " + (l - 2 * x0) + " = " + V0) + " cm³.", M(poly([4, -2 * (L + l), L * l, -V0]) + " = 0") + " a la racine " + M(x0) + " ; division par " + M("(x - " + x0 + ")") + " : " + M(poly([4, b, c]) + " = 0") + ", " + M("x = \\frac{" + -b + " \\pm \\sqrt{" + Dl + "}}{8}") + ", soit " + M("x \\approx " + A(r[0], 2)) + " ou " + M("x \\approx " + A(r[1], 2)) + ". Seule " + M(A(ok[0], 2)) + " convient (" + M(A(no[0], 2)) + " est hors du domaine)."]),
        chk: [[V0, String(V0)], [ok[0], A(ok[0], 2), 0.01], [ok[0] * (L - 2 * ok[0]) * (l - 2 * ok[0]), String(V0), 1e-6]] }); },
    // Retrouver un polynôme à partir de son graphe
    () => { let r, a, y0; do { r = shuffle([-3, -2, -1, 1, 2, 3]).slice(0, 3).sort((x, y) => x - y); a = pk([0.5, -0.5, 1, -1]); y0 = -a * r[0] * r[1] * r[2]; } while (Math.abs(y0) > 7 || Math.abs(y0) < 2 || Number.isInteger(y0) === false);
      const c = [a, -a * (r[0] + r[1] + r[2]), a * (r[0] * r[1] + r[0] * r[2] + r[1] * r[2]), y0], f = (x) => a * (x - r[0]) * (x - r[1]) * (x - r[2]);
      const neg = a > 0 ? "]-\\infty \\,;\\, " + r[0] + "[ \\cup \\,]" + r[1] + " \\,;\\, " + r[2] + "[" : "]" + r[0] + " \\,;\\, " + r[1] + "[ \\cup \\,]" + r[2] + " \\,;\\, +\\infty[";
      return X({ id: "polyexpr", lv: 3, titre: "Retrouver le polynôme",
        q: "Le graphe ci-dessous est celui d'un polynôme " + M("P") + " de degré 3. Ses zéros et son ordonnée à l'origine sont des nombres entiers.", fig: FIG.plot([{ f }], [[r[0], 0, ""], [r[1], 0, ""], [r[2], 0, ""], [0, y0, ""]], { numbers: true, xr: [-5, 5], yr: [-8, 8], step: 2, squash: 0.6 }),
        parts: [{ label: "Lis les zéros et écris " + M("P(x)") + " sous forme factorisée avec un coefficient " + M("a") + " inconnu.", pts: 1 }, { label: "Détermine " + M("a") + " à l'aide de l'ordonnée à l'origine.", pts: 2 }, { label: "Écris " + M("P(x)") + " sous forme développée.", pts: 1 }, { label: "Résous " + M("P(x) \\lt 0") + ".", pts: 1 }],
        sol: ul([M("P(x) = a" + fac(r[0]) + fac(r[1]) + fac(r[2])) + ".", M("P(0) = a \\cdot " + par(-r[0]) + " \\cdot " + par(-r[1]) + " \\cdot " + par(-r[2]) + " = " + y0) + " : " + M("a = " + FR(a)) + ".", M("P(x) = " + poly(c)) + ".", M("S = " + neg) + " (lu sur le graphe ou par le tableau de signes)."]),
        chk: [[y0 / (-r[0] * r[1] * r[2]), FRp(a)], [pv(c, 0), String(y0)], [pv(c, r[1]) === 0 ? 7 : 0, "7"]] }); },
    // Paramètre : divisibilité, reste
    () => { let a, r2, r3, k; do { a = pk([2, -2, 3, -1]); r2 = R.int(-4, 4); r3 = R.int(-4, 4); k = -(a + r2 + r3); } while (new Set([a, r2, r3]).size < 3 || r2 * r3 === 0 || k === 0 || a * r2 + a * r3 + r2 * r3 === 0);
      const b = a * r2 + a * r3 + r2 * r3, c = -a * r2 * r3, t = pk([1, -3, 4].filter((x) => ![a, r2, r3].includes(x)).concat([5])), cP = [1, k, b, c], rest = pv(cP, t);
      return X({ id: "polydiv", lv: 2, titre: "Trouver le paramètre",
        q: "Soit " + M("P(x) = x^3 + kx^2" + sg(b) + "x" + sg(c)) + ", où " + M("k") + " est un nombre réel.",
        parts: [{ label: "Détermine " + M("k") + " pour que " + M("P(x)") + " soit divisible par " + M(fac(a).slice(1, -1)) + ".", pts: 2 }, { label: "Avec cette valeur, factorise " + M("P(x)") + " complètement.", pts: 2 }, { label: "Sans effectuer la division, donne le reste de la division de " + M("P(x)") + " par " + M(fac(t).slice(1, -1)) + ".", pts: 1 }],
        sol: ul(["Il faut " + M("P(" + a + ") = 0") + " : " + M(a ** 3 + " + " + a * a + "k" + sg(b * a) + sg(c) + " = 0") + " ⟺ " + M("k = " + k) + ".", M("P(x) = " + poly(cP)) + " ; division par " + M(fac(a)) + " : " + M(poly([1, -(r2 + r3), r2 * r3])) + ", d'où " + M("P(x) = " + fac(a) + fac(Math.min(r2, r3)) + fac(Math.max(r2, r3))) + ".", "Le reste est " + M("P(" + t + ") = " + rest) + "."]),
        chk: [[-(a ** 3 + b * a + c) / (a * a), String(k)], [rest, String(rest)]] }); },
  ];
  const RAISONP = [
    () => { const k = pk([4, 9, 16, 25]), w = who();
      return X({ id: "ineq", lv: 1, titre: "Trouve l'erreur",
        q: w + " résout " + M("x^2 > " + k) + " : « " + M("x > " + Math.sqrt(k)) + " ».",
        parts: [{ label: "Teste " + M("x = " + -(Math.sqrt(k) + 1)) + ". Que constates-tu ?", pts: 1 }, { label: "Donne l'ensemble des solutions.", pts: 1 }],
        sol: ul([M("(" + -(Math.sqrt(k) + 1) + ")^2 = " + (Math.sqrt(k) + 1) ** 2 + " > " + k) + " : c'est une solution oubliée.", M("x^2 - " + k + " = (x - " + Math.sqrt(k) + ")(x + " + Math.sqrt(k) + ") > 0") + " : " + M("S = \\,]-\\infty \\,;\\, " + -Math.sqrt(k) + "[ \\cup \\,]" + Math.sqrt(k) + " \\,;\\, +\\infty[") + "."]),
        chk: [[Math.sqrt(k), String(Math.sqrt(k))]] }); },
    () => VF("polydiv", 2, [["« Un polynôme de degré 3 a toujours au moins un zéro réel. »", true, "Ses valeurs vont de " + M("-\\infty") + " à " + M("+\\infty") + " (ou l'inverse) : le graphe coupe l'axe des x."],
      ["« Si " + M("P(2) = 0") + ", alors " + M("(x + 2)") + " divise " + M("P(x)") + ". »", false, "C'est " + M("(x - 2)") + " qui divise " + M("P(x)") + "."],
      ["« Le reste de la division de " + M("P(x)") + " par " + M("(x - a)") + " est " + M("P(a)") + ". »", true, M("P(x) = (x - a)Q(x) + r") + " ; en " + M("x = a") + " : " + M("P(a) = r") + "."],
      ["« Le produit de deux polynômes de degré 2 est de degré 4. »", true, "Les degrés s'additionnent (les coefficients dominants ne s'annulent pas)."],
      ["« Un polynôme de degré 4 a toujours 4 zéros réels. »", false, M("x^4 + 1") + " n'en a aucun."],
      ["« " + M("x^3 - x") + " est négatif pour tout " + M("x \\lt 0") + ". »", false, "Pour " + M("x = -\\frac{1}{2}") + " : " + M("-\\frac{1}{8} + \\frac{1}{2} > 0") + "."]]),
  ];

  // ===================== 2e · 4. Fonctions rationnelles =====================
  const EXR = [
    // Le coût moyen (fonction homographique en situation)
    () => { const F = pk([400, 600, 900, 1200]), c = pk([3, 4, 5, 8]), d = pk([1, 2, 3]), x1 = pk([50, 100]), x2 = pk([200, 300]), xs = F / d, mq = c + pk([0.5, 1.5]), xq = F / (mq - c);
      return X({ id: "homog", lv: 1, titre: "Le coût moyen",
        q: "Un artisan fabrique des tasses. Ses frais fixes sont de " + Q(F, "CHF") + " par mois et chaque tasse lui coûte " + Q(c, "CHF") + " de matière. Le coût moyen d'une tasse, quand il en fabrique " + M("x") + ", est " + M("m(x) = \\frac{" + F + " + " + c + "x}{x}") + ".",
        parts: [{ label: "Calcule " + M("m(" + x1 + ")") + " et " + M("m(" + x2 + ")") + ". Interprète.", pts: 1 }, { label: "Quelle est l'asymptote horizontale du graphe de " + M("m") + " ? Que signifie-t-elle pour l'artisan ?", pts: 2 }, { label: "Combien de tasses doit-il fabriquer pour que le coût moyen soit au plus de " + Q(c + d, "CHF") + " ?", pts: 1 }, { label: "Exprime " + M("x") + " en fonction de " + M("m") + " (fonction réciproque), puis calcule " + M("x") + " pour un coût moyen de " + Q(mq, "CHF") + ".", pts: 2 }],
        sol: ul([M("m(" + x1 + ") = " + N(c + F / x1)) + " CHF, " + M("m(" + x2 + ") = " + N(c + F / x2)) + " CHF : plus il en fabrique, moins chaque tasse coûte.", M("m(x) = " + c + " + \\frac{" + F + "}{x}") + " : asymptote " + M("y = " + c) + ". Le coût moyen s'approche de " + c + " CHF (la matière) sans jamais l'atteindre.", M(c + " + \\frac{" + F + "}{x} \\le " + (c + d)) + " ⟺ " + M("x \\ge " + xs)) + " tasses.", M("m = " + c + " + \\frac{" + F + "}{x}") + " ⟺ " + M("x = \\frac{" + F + "}{m - " + c + "}") + " ; " + M("x = \\frac{" + F + "}{" + N(mq - c) + "} = " + N(xq)) + " tasses."]),
        chk: [[c + F / x1, N(c + F / x1)], [F / d, String(xs)], [F / (mq - c), N(xq)]] }); },
    // Le cycliste (équation rationnelle)
    () => { const [v, dv, dt, d] = pk([[20, 5, 1, 100], [15, 5, 1, 60], [24, 6, 1, 120], [30, 10, 0.5, 60], [40, 10, 0.5, 100]]), o = -v - dv;
      return X({ id: "probrat", lv: 2, titre: "Le cycliste",
        q: "Un cycliste parcourt " + Q(d, "km") + ". S'il roulait " + Q(dv, "km/h") + " plus vite, il mettrait " + (dt === 1 ? "1 heure" : "30 minutes") + " de moins. On note " + M("v") + " sa vitesse (km/h).",
        parts: [{ label: "Exprime la durée du trajet en fonction de " + M("v") + " dans les deux cas, puis écris une équation.", pts: 2 }, { label: "Quelles sont les valeurs interdites ?", pts: 1 }, { label: "Résous l'équation et conclus.", pts: 2 }],
        sol: ul(["Durées " + M("\\frac{" + d + "}{v}") + " et " + M("\\frac{" + d + "}{v + " + dv + "}") + " ; " + M("\\frac{" + d + "}{v} - \\frac{" + d + "}{v + " + dv + "} = " + N(dt)) + ".", M("v \\neq 0") + " et " + M("v \\neq -" + dv) + ".", "On multiplie par " + M("v(v + " + dv + ")") + " : " + M(d * dv + " = " + N(dt) + "v(v + " + dv + ")") + ", soit " + M(poly([dt, dt * dv, -d * dv], "v") + " = 0") + " ; " + M("v = " + v) + " ou " + M("v = " + o) + " (négative, rejetée). Il roule à " + v + " km/h et met " + M(N(d / v)) + " h."]),
        chk: [[d / v - d / (v + dv), N(dt)], [dt * o * o + dt * dv * o - d * dv, "0", 1e-6]] }); },
    // Équation rationnelle, fraction à étages, simplification
    () => { const a = pk([2, 3, 4, 5]);
      return X({ id: "eqrat", lv: 2, titre: "Une solution de trop",
        q: "Soit " + M("a = " + a) + ". On considère l'équation " + M("\\frac{x}{x - " + a + "} + \\frac{" + a + "}{x + " + a + "} = \\frac{" + 2 * a * a + "}{x^2 - " + a * a + "}") + ".",
        parts: [{ label: "Donne les valeurs interdites.", pts: 1 }, { label: "Résous l'équation.", pts: 2 }, { label: "Simplifie " + M("\\frac{1 + \\frac{" + a + "}{x}}{1 - \\frac{" + a * a + "}{x^2}}") + " en précisant les conditions.", pts: 2 }, { label: "Simplifie " + M("\\frac{x^2 - " + a * a + "}{x^2 + " + a + "x}") + ".", pts: 1 }],
        sol: ul([M("x \\neq " + a) + " et " + M("x \\neq -" + a) + " (" + M("x^2 - " + a * a + " = (x - " + a + ")(x + " + a + ")") + ").", "Dénominateur commun : " + M("x(x + " + a + ") + " + a + "(x - " + a + ") = " + 2 * a * a) + " ⟺ " + M("x^2 + " + 2 * a + "x - " + 3 * a * a + " = 0") + " ⟺ " + M("(x - " + a + ")(x + " + 3 * a + ") = 0") + ". " + M("x = " + a) + " est interdite : " + M("S = \\{-" + 3 * a + "\\}") + ".", "On multiplie haut et bas par " + M("x^2") + " : " + M("\\frac{x^2 + " + a + "x}{x^2 - " + a * a + "} = \\frac{x(x + " + a + ")}{(x - " + a + ")(x + " + a + ")} = \\frac{x}{x - " + a + "}") + ", pour " + M("x \\neq 0") + ", " + M("x \\neq \\pm " + a) + ".", M("\\frac{(x - " + a + ")(x + " + a + ")}{x(x + " + a + ")} = \\frac{x - " + a + "}{x}") + " pour " + M("x \\neq 0") + ", " + M("x \\neq -" + a) + "."]),
        chk: [[-3 * a, String(-3 * a)], [-3 * a / (-3 * a - a) + a / (-3 * a + a) - (2 * a * a) / (9 * a * a - a * a), "0", 1e-9]] }); },
    // Inéquation fractionnaire
    () => { let p, q; do { p = R.int(-4, 5); q = R.int(-3, 3); } while (p + q <= 0 || q === 0 || p === 0 || p + 2 * q === 0);
      const z = p + 2 * q;
      return X({ id: "ineqfrac", lv: 3, titre: "Une inéquation fractionnaire",
        q: "On veut résoudre " + M("\\frac{x" + sg(p) + "}{x" + sg(-q) + "} \\le 2") + ".",
        parts: [{ label: "Pourquoi ne peut-on pas simplement multiplier les deux membres par " + M("x" + sg(-q)) + " ?", pts: 1 }, { label: "Ramène l'inéquation à la forme " + M("\\frac{\\ldots}{\\ldots} \\le 0") + ".", pts: 1 }, { label: "Dresse le tableau de signes et donne l'ensemble des solutions.", pts: 2 }],
        sol: ul(["Son signe dépend de " + M("x") + " : s'il est négatif, le sens de l'inégalité change.", M("\\frac{x" + sg(p) + " - 2(x" + sg(-q) + ")}{x" + sg(-q) + "} = \\frac{" + lin(-1, z) + "}{x" + sg(-q) + "} \\le 0") + ".", "Le numérateur s'annule en " + M(z) + " (positif avant, négatif après), le dénominateur en " + M(q) + " (valeur interdite). " + M("S = \\,]-\\infty \\,;\\, " + q + "[ \\cup [" + z + " \\,;\\, +\\infty[") + "."]),
        chk: [[z, String(z)], [((z + 1 + p) / (z + 1 - q) <= 2 && (q - 0.5 + p) / (q - 0.5 - q) <= 2 && !((q + 0.5 + p) / (q + 0.5 - q) <= 2)) ? 1 : 0, "1"]] }); },
    // Fonction homographique et sa réciproque
    () => { let a, b, c, x1; do { a = pk([2, 3, -2]); c = pk([-3, -1, 2, 4]); b = R.int(-6, 6); x1 = R.int(-5, 5); } while (b === a * c || b === 0 || x1 === -c || (a * x1 + b) % (x1 + c) !== 0 || a * x1 + b === 0);
      const k = (a * x1 + b) / (x1 + c), f = (x) => (a * x + b) / (x + c);
      return X({ id: "homogrec", lv: 2, titre: "Fonction homographique",
        q: "Soit " + M("f(x) = \\frac{" + lin(a, b) + "}{x" + sg(c) + "}") + ".", fig: FIG.plot([{ f }], [], { numbers: true, xr: [-8, 8], yr: [-8, 8], step: 2, squash: 0.7, vlines: [-c] }),
        parts: [{ label: "Donne le domaine de " + M("f") + " et les équations des asymptotes.", pts: 2 }, { label: "Calcule le zéro de " + M("f") + " et son ordonnée à l'origine.", pts: 1 }, { label: "Détermine la fonction réciproque " + M("f^{-1}") + " et son domaine.", pts: 2 }, { label: "Pour quel " + M("x") + " a-t-on " + M("f(x) = " + k) + " ? Utilise " + M("f^{-1}") + ".", pts: 1 }],
        sol: ul([M("D = \\mathbb{R} \\setminus \\{" + -c + "\\}") + " ; asymptote verticale " + M("x = " + -c) + ", horizontale " + M("y = " + a) + " (quotient des coefficients de " + M("x") + ").", "Zéro " + M(FR(-b / a)) + " ; " + M("f(0) = " + FR(b / c)) + ".", M("y(x" + sg(c) + ") = " + lin(a, b)) + " ⟺ " + M("x(y" + sg(-a) + ") = " + lin(-c, b, "y")) + " : " + M("f^{-1}(x) = \\frac{" + lin(-c, b) + "}{x" + sg(-a) + "}") + ", domaine " + M("\\mathbb{R} \\setminus \\{" + a + "\\}") + ".", M("f^{-1}(" + k + ") = \\frac{" + (b - c * k) + "}{" + (k - a) + "} = " + x1) + "."]),
        chk: [[(b - c * k) / (k - a), String(x1)], [f((b - c * 7) / (7 - a)), "7", 1e-9]] }); },
  ];
  const RAISONR = [
    () => { const a = pk([2, 3, 4]), w = who();
      return X({ id: "eqrat", lv: 1, titre: "Trouve l'erreur",
        q: w + " résout " + M("\\frac{x^2}{x - " + a + "} = \\frac{" + a * a + "}{x - " + a + "}") + " : « " + M("x^2 = " + a * a) + ", donc " + M("S = \\{-" + a + " \\,;\\, " + a + "\\}") + " ».",
        parts: [{ label: "Quelle étape a été oubliée ?", pts: 1 }, { label: "Donne le bon ensemble des solutions.", pts: 1 }],
        sol: ul(["Les valeurs interdites : " + M("x \\neq " + a) + ".", M(a) + " est interdite : " + M("S = \\{-" + a + "\\}") + "."]),
        chk: [[-a, String(-a)]] }); },
    () => VF("fracrat", 2, [["« " + M("\\frac{x + 3}{x + 5} = \\frac{3}{5}") + " (on simplifie par " + M("x") + "). »", false, "On ne simplifie que des facteurs : pour " + M("x = 1") + ", " + M("\\frac{4}{6} \\neq \\frac{3}{5}") + "."],
      ["« " + M("\\frac{x^2 - 1}{x - 1} = x + 1") + " pour tout " + M("x") + ". »", false, "Seulement pour " + M("x \\neq 1") + " : en 1, la fraction n'est pas définie."],
      ["« La fonction " + M("f(x) = \\frac{2x + 1}{x - 3}") + " a pour asymptote horizontale " + M("y = 2") + ". »", true, M("f(x) = 2 + \\frac{7}{x - 3}") + " ; le second terme tend vers 0."],
      ["« Une fonction homographique est bijective de son domaine vers " + M("\\mathbb{R}") + ". »", false, "Elle n'atteint jamais la valeur de l'asymptote horizontale : vers " + M("\\mathbb{R}") + " privé de cette valeur."],
      ["« " + M("\\frac{1}{x} \\lt 1") + " équivaut à " + M("x > 1") + ". »", false, "Les nombres négatifs sont aussi solutions : " + M("S = \\,]-\\infty \\,;\\, 0[ \\cup \\,]1 \\,;\\, +\\infty[") + "."]]),
  ];

  RICH.cart2c = { ids: ["droites", "cart", "droitesinter", "cercle", "cercletan"], track: "col", label: "Équations cartésiennes", ex: EXC, raison: RAISONC, minutes: 45 };
  RICH.poly2c = { ids: ["ineq", "polydiv", "polyfact", "polyexpr"], track: "col", label: "Fonctions polynomiales", ex: EXP, raison: RAISONP, minutes: 45 };
  RICH.rat2c = { ids: ["ineqfrac", "valint", "fracrat", "fracetage", "eqrat", "probrat", "homog", "homogrec"], track: "col", label: "Fonctions rationnelles", ex: EXR, raison: RAISONR, minutes: 45 };
})();

// 2e Collège · 5. Exponentielles, 6. Composition et réciproque, 7. Logarithmes (23.11).
(function () {
  const { N, A, Q, pk, FR, lin, sg, par, X, ul, who, VF } = RX;
  const FRp = (v) => FR(v).replace(/\\frac\{(\d+)\}\{(\d+)\}/, "$1/$2");
  const lg = Math.log10;

  // ===================== 5. Exponentielles =====================
  const EXE = [
    // Le placement (intérêts composés, comparaison, doublement par essais)
    () => { const C0 = pk([2000, 5000, 8000, 10000]), t = pk([2, 2.5, 3, 4]), n = pk([5, 8, 10]), Cn = C0 * (1 + t / 100) ** n, Cs = C0 * (1 + (n * t) / 100), nd = Math.ceil(Math.log(2) / Math.log(1 + t / 100));
      return X({ id: "modexp", lv: 1, titre: "Le placement",
        q: "On place " + Q(C0, "CHF") + " à " + N(t).replace("{,}", ",") + " % d'intérêts composés par an (les intérêts s'ajoutent au capital chaque année).",
        parts: [{ label: "Exprime le capital " + M("C(n)") + " après " + M("n") + " années.", pts: 1 }, { label: "Calcule le capital après " + n + " ans (au centime).", pts: 1 }, { label: "Avec des intérêts simples (" + N(t).replace("{,}", ",") + " % du capital de départ chaque année), combien aurait-on après " + n + " ans ? Compare.", pts: 1 }, { label: "Par essais successifs, après combien d'années entières le capital aura-t-il doublé ?", pts: 2 }],
        sol: ul([M("C(n) = " + N(C0) + " \\cdot " + N(1 + t / 100) + "^n") + " (fonction exponentielle de base " + M(N(1 + t / 100)) + ").", M("C(" + n + ") \\approx " + A(Cn, 2)) + " CHF.", M(N(C0) + " + " + n + " \\cdot " + N((C0 * t) / 100) + " = " + N(Cs)) + " CHF : moins que les intérêts composés (les intérêts rapportent eux aussi des intérêts).", M("C(" + (nd - 1) + ") \\approx " + A(C0 * (1 + t / 100) ** (nd - 1), 2)) + " < " + N(2 * C0) + " et " + M("C(" + nd + ") \\approx " + A(C0 * (1 + t / 100) ** nd, 2)) + " ≥ " + N(2 * C0) + " : après " + nd + " ans."]),
        chk: [[Cn, A(Cn, 2), 0.01], [Cs, N(Cs)], [Math.log(2) / Math.log(1 + t / 100), String(nd), 1]] }); },
    // Le médicament (décroissance, modèle à partir de deux mesures)
    () => { const D0 = pk([400, 500, 800]), p = pk([20, 25, 30]), b = 1 - p / 100, t1 = 2, t2 = 4, q1 = D0 * b ** t1, q2 = D0 * b ** t2, h = pk([3, 5]), qh = D0 * b ** h;
      return X({ id: "modexp", lv: 2, titre: "Le médicament",
        q: "Après une injection, la quantité de médicament dans le sang diminue de façon exponentielle : " + M("Q(t) = Q_0 \\cdot b^t") + " (" + M("t") + " en heures). On mesure " + Q(q1, "mg") + " après " + t1 + " h et " + Q(q2, "mg") + " après " + t2 + " h.",
        parts: [{ label: "Calcule " + M("b") + " (indice : " + M("\\frac{Q(" + t2 + ")}{Q(" + t1 + ")}") + ").", pts: 2 }, { label: "Calcule la dose injectée " + M("Q_0") + ".", pts: 1 }, { label: "De quel pourcentage la quantité diminue-t-elle chaque heure ?", pts: 1 }, { label: "Quelle quantité reste-t-il après " + h + " h (au dixième de mg) ?", pts: 1 }],
        sol: ul([M("\\frac{Q_0 b^{" + t2 + "}}{Q_0 b^{" + t1 + "}} = b^2 = \\frac{" + N(q2) + "}{" + N(q1) + "} = " + N(b * b)) + ", d'où " + M("b = " + N(b)) + " (" + M("b > 0") + ").", M("Q_0 = \\frac{" + N(q1) + "}{" + N(b) + "^2} = " + N(D0)) + " mg.", M("1 - " + N(b) + " = " + N(p / 100)) + " : " + p + " % par heure.", M("Q(" + h + ") = " + D0 + " \\cdot " + N(b) + "^{" + h + "} \\approx " + A(qh, 1)) + " mg."]),
        chk: [[Math.sqrt(q2 / q1), N(b)], [q1 / (b * b), String(D0)], [qh, A(qh, 1), 0.1]] }); },
    // Exposants fractionnaires
    () => { const [base, e] = pk([[8, 3], [27, 3], [16, 4], [32, 5]]), r = Math.round(base ** (1 / e)), k = pk([2, 3]), m = pk([2, 3]), n = pk([2, 5]);
      return X({ id: "expfrac", lv: 2, titre: "Exposants fractionnaires",
        q: "Sans calculatrice.",
        parts: [{ label: "Calcule " + M(base + "^{\\frac{" + k + "}{" + e + "}}") + " et " + M(base + "^{-\\frac{1}{" + e + "}}") + ".", pts: 2 }, { label: "Écris " + M("\\sqrt[" + n + "]{x^{" + m + "}} \\cdot \\sqrt{x}") + " sous la forme " + M("x^r") + " (" + M("x > 0") + ").", pts: 1 }, { label: "Résous " + M(r + "^x = " + base + "\\sqrt{" + r + "}") + ".", pts: 2 }],
        sol: ul([M(base + "^{\\frac{" + k + "}{" + e + "}} = (\\sqrt[" + e + "]{" + base + "})^{" + k + "} = " + r + "^{" + k + "} = " + r ** k) + " ; " + M(base + "^{-\\frac{1}{" + e + "}} = \\frac{1}{" + r + "}") + ".", M("x^{\\frac{" + m + "}{" + n + "}} \\cdot x^{\\frac{1}{2}} = x^{" + FR(m / n + 0.5) + "}") + ".", M(base + "\\sqrt{" + r + "} = " + r + "^{" + e + "} \\cdot " + r + "^{\\frac{1}{2}} = " + r + "^{" + FR(e + 0.5) + "}") + " : " + M("x = " + FR(e + 0.5)) + "."]),
        chk: [[base ** (k / e), String(r ** k), 1e-9], [m / n + 0.5, FRp(m / n + 0.5)], [Math.log(base * Math.sqrt(r)) / Math.log(r), FRp(e + 0.5), 1e-9]] }); },
    // Lecture du graphe d'une exponentielle
    () => { const a = pk([1, 2, 3]), b = pk([2, 3, 0.5]), f = (x) => a * b ** x, x3 = b > 1 ? 3 : -3, y3 = f(x3);
      return X({ id: "expo", lv: 2, titre: "Lire une exponentielle",
        q: "Le graphe ci-dessous est celui de " + M("f(x) = a \\cdot b^x") + ". Il passe par deux points à coordonnées entières, en " + M("x = 0") + " et en " + M("x = 1") + ".", fig: FIG.plot([{ f }], [[0, a, ""], [1, f(1), ""]], { numbers: true, xr: [-4, 4], yr: [-1, 8], squash: 0.8 }),
        parts: [{ label: "Lis " + M("a") + " et " + M("b") + ". La fonction est-elle croissante ou décroissante ?", pts: 2 }, { label: "Quelle est l'asymptote du graphe ?", pts: 1 }, { label: "Résous " + M("f(x) = " + N(y3)) + " sans calculatrice.", pts: 1 }, { label: "Donne l'expression de la fonction dont le graphe est le symétrique de celui de " + M("f") + " par rapport à l'axe des ordonnées.", pts: 1 }],
        sol: ul([M("f(0) = a = " + a) + ", " + M("f(1) = ab = " + N(f(1))) + " : " + M("b = " + N(b)) + " ; " + (b > 1 ? "croissante (" + M("b > 1") + ")." : "décroissante (" + M("0 \\lt b \\lt 1") + ")."), "L'axe des abscisses " + M("y = 0") + " (du côté " + (b > 1 ? "gauche" : "droit") + ").", M(a + " \\cdot " + N(b) + "^x = " + N(y3)) + " ⟺ " + M(N(b) + "^x = " + N(y3 / a)) + " ⟺ " + M("x = " + x3) + ".", M("g(x) = f(-x) = " + a + " \\cdot " + N(1 / b) + "^x") + "."]),
        chk: [[f(x3), N(y3)], [1 / b, N(1 / b)]] }); },
  ];
  const RAISONE = [
    () => { const a = pk([2, 3, 5]), b = pk([3, 4, 7]), x = pk([2, 3]), w = who();
      return X({ id: "expo", lv: 1, titre: "Trouve l'erreur",
        q: w + " écrit : « " + M(a + " \\cdot " + b + "^x = " + a * b + "^x") + " ».",
        parts: [{ label: "Teste avec " + M("x = " + x) + ".", pts: 1 }, { label: "Explique l'erreur.", pts: 1 }],
        sol: ul([M(a + " \\cdot " + b + "^" + x + " = " + a * b ** x) + " mais " + M(a * b + "^" + x + " = " + (a * b) ** x) + ".", "L'exposant ne porte que sur " + b + ", pas sur le facteur " + a + "."]),
        chk: [[a * b ** x, String(a * b ** x)]] }); },
    () => VF("expo", 1, [["« " + M("f(x) = \\left(\\frac{1}{2}\\right)^x") + " est décroissante. »", true, "Base entre 0 et 1."],
      ["« " + M("2^x") + " peut être négatif. »", false, "Une exponentielle de base positive est toujours strictement positive."],
      ["« Deux hausses de 5 % font une hausse de 10 %. »", false, M("1{,}05^2 = 1{,}1025") + " : 10,25 %."],
      ["« " + M("8^{\\frac{1}{3}} = 2") + ". »", true, M("2^3 = 8") + "."],
      ["« " + M("a^0 = 1") + " pour tout " + M("a > 0") + ". »", true, M("a^0 = \\frac{a^n}{a^n} = 1") + "."],
      ["« Le graphe de " + M("3^x") + " coupe l'axe des abscisses. »", false, "Il s'en approche sans jamais l'atteindre (asymptote)."]]),
  ];

  // ===================== 6. Composition et réciproque =====================
  const EXF = [
    // Composer
    () => { const a = pk([2, 3, -2]), b = pk([-3, -1, 1, 4]), c = pk([-4, -1, 2, 5]), x1 = pk([-2, 2, 3]), gf = (x) => (a * x + b) ** 2 + c, fg = (x) => a * (x * x + c) + b, v = pk([1, 2, 3]), target = v * v + c, s1 = (v - b) / a, s2 = (-v - b) / a;
      return X({ id: "compo", lv: 1, titre: "Composer deux fonctions",
        q: "Soit " + M("f(x) = " + lin(a, b)) + " et " + M("g(x) = x^2" + sg(c)) + ".",
        parts: [{ label: "Calcule " + M("(g \\circ f)(" + x1 + ")") + " et " + M("(f \\circ g)(" + x1 + ")") + ".", pts: 1 }, { label: "Donne les expressions de " + M("(g \\circ f)(x)") + " et " + M("(f \\circ g)(x)") + ". La composition est-elle commutative ?", pts: 2 }, { label: "Résous " + M("(g \\circ f)(x) = " + target) + ".", pts: 2 }],
        sol: ul([M("f(" + x1 + ") = " + (a * x1 + b)) + ", " + M("g(" + (a * x1 + b) + ") = " + gf(x1)) + " ; " + M("g(" + x1 + ") = " + (x1 * x1 + c)) + ", " + M("f(" + (x1 * x1 + c) + ") = " + fg(x1)) + ".", M("(g \\circ f)(x) = (" + lin(a, b) + ")^2" + sg(c)) + " ; " + M("(f \\circ g)(x) = " + a + "(x^2" + sg(c) + ")" + sg(b) + " = " + a + "x^2" + sg(a * c + b)) + ". Non : les résultats diffèrent.", M("(" + lin(a, b) + ")^2 = " + v * v) + " ⟺ " + M(lin(a, b) + " = \\pm " + v) + " : " + M("x = " + FR(s1)) + " ou " + M("x = " + FR(s2)) + "."]),
        chk: [[gf(x1), String(gf(x1))], [fg(x1), String(fg(x1))], [gf(s1), String(target), 1e-9], [s2, FRp(s2)]] }); },
    // Décomposer et domaine
    () => { const a = pk([2, 3, 4]), b = pk([-8, -6, 6, 9]), c = pk([1, 2, 5]), x0 = -b / a, xv = pk([4, 5, 6]).find((x) => a * x + b >= 0) || 7, val = Math.sqrt(a * xv + b) - c;
      return X({ id: "decomp", lv: 2, titre: "Décomposer une fonction",
        q: "Soit " + M("h(x) = \\sqrt{" + lin(a, b) + "}" + sg(-c)) + ".",
        parts: [{ label: "Écris " + M("h") + " comme composée de deux fonctions " + M("f") + " et " + M("g") + " : " + M("h = g \\circ f") + ".", pts: 1 }, { label: "Détermine le domaine de " + M("h") + ".", pts: 1 }, { label: "Calcule " + M("h(" + xv + ")") + " (au centième).", pts: 1 }, { label: "Pour quel " + M("x") + " a-t-on " + M("h(x) = " + (2 * c)) + " ?", pts: 2 }],
        sol: ul(["Par exemple " + M("f(x) = " + lin(a, b)) + " puis " + M("g(x) = \\sqrt{x}" + sg(-c)) + " (on calcule d'abord " + M(lin(a, b)) + ").", M(lin(a, b) + " \\ge 0") + " ⟺ " + M("x \\ge " + FR(x0)) + " : " + M("D = [" + FR(x0) + " \\,;\\, +\\infty[") + ".", M("h(" + xv + ") = \\sqrt{" + (a * xv + b) + "}" + sg(-c) + " \\approx " + A(val, 2)) + ".", M("\\sqrt{" + lin(a, b) + "} = " + 3 * c) + " ⟺ " + M(lin(a, b) + " = " + 9 * c * c) + " ⟺ " + M("x = " + FR((9 * c * c - b) / a)) + " (dans le domaine)."]),
        chk: [[val, A(val, 2), 0.01], [(9 * c * c - b) / a, FRp((9 * c * c - b) / a)]] }); },
    // Le parking (fonction définie par morceaux)
    () => { const g = pk([0.5, 1]), p1 = pk([2, 3]), p2 = pk([1.5, 2]), f = (t) => (t <= g ? 0 : t <= 3 ? p1 * (t - g) : p1 * (3 - g) + p2 * (t - 3)), tq = pk([2, 2.5]), tr = pk([5, 6]), pay = f(tr);
      return X({ id: "morceaux", lv: 2, titre: "Le tarif du parking",
        q: "Un parking est gratuit pendant " + (g === 1 ? "la première heure" : "la première demi-heure") + ". Ensuite, il coûte " + Q(p1, "CHF") + " par heure jusqu'à 3 h de stationnement, puis " + Q(p2, "CHF") + " par heure au-delà (tarif proportionnel au temps).",
        parts: [{ label: "Écris le prix " + M("P(t)") + " (" + M("t") + " en heures) comme fonction définie par morceaux.", pts: 2 }, { label: "Calcule " + M("P(" + N(tq) + ")") + " et " + M("P(" + tr + ")") + ".", pts: 1 }, { label: "La fonction est-elle continue en " + M("t = 3") + " ? Justifie.", pts: 1 }, { label: "Un automobiliste a payé " + Q(pay, "CHF") + ". Combien de temps est-il resté ?", pts: 1 }],
        sol: ul([M("P(t) = 0") + " si " + M("0 \\le t \\le " + N(g)) + " ; " + M(p1 + "(t - " + N(g) + ")") + " si " + M(N(g) + " \\lt t \\le 3") + " ; " + M(N(p1 * (3 - g)) + " + " + N(p2) + "(t - 3)") + " si " + M("t > 3") + ".", M("P(" + N(tq) + ") = " + N(f(tq))) + " CHF ; " + M("P(" + tr + ") = " + N(pay)) + " CHF.", "Oui : les deux morceaux donnent " + M(N(p1 * (3 - g))) + " en " + M("t = 3") + ".", "Plus que " + N(p1 * (3 - g)) + " CHF, donc " + M("t > 3") + " : " + M(N(p1 * (3 - g)) + " + " + N(p2) + "(t - 3) = " + N(pay)) + ", " + M("t = " + tr) + " h."]),
        chk: [[f(tq), N(f(tq))], [3 + (pay - p1 * (3 - g)) / p2, String(tr)]] }); },
    // Tolérance de fabrication (valeur absolue)
    () => { const L = pk([40, 50, 80]), e = pk([0.2, 0.5]), m = pk([0.3, 0.6, 0.1]), vals = [L - 0.7, L + e, L - m, L + 0.05].map((v) => Math.round(v * 100) / 100);
      return X({ id: "absval", lv: 2, titre: "La pièce usinée",
        q: "Une pièce doit mesurer " + Q(L, "mm") + " avec une tolérance de " + Q(e, "mm") + " : sa longueur " + M("x") + " doit vérifier " + M("|x - " + L + "| \\le " + N(e)) + ".",
        parts: [{ label: "Écris cette condition sous forme d'intervalle.", pts: 1 }, { label: "Les pièces mesurant " + vals.map((v) => Q(v, "mm")).join(", ") + " sont-elles acceptées ?", pts: 2 }, { label: "Résous " + M("|2x - " + 2 * L + "| = " + N(3 * e)) + " et interprète.", pts: 2 }],
        sol: ul([M("-" + N(e) + " \\le x - " + L + " \\le " + N(e)) + " ⟺ " + M("x \\in [" + N(L - e) + " \\,;\\, " + N(L + e) + "]") + ".", vals.map((v) => N(v).replace("{,}", ",") + (Math.abs(v - L) <= e + 1e-9 ? " oui" : " non")).join(" ; ") + " (on compare l'écart " + M("|x - " + L + "|") + " à " + N(e).replace("{,}", ",") + ").", M("|2x - " + 2 * L + "| = 2|x - " + L + "| = " + N(3 * e)) + " ⟺ " + M("|x - " + L + "| = " + N(1.5 * e)) + " : " + M("x = " + N(L - 1.5 * e)) + " ou " + M("x = " + N(L + 1.5 * e)) + " ; deux pièces à " + N(1.5 * e).replace("{,}", ",") + " mm de la cote, refusées."]),
        chk: [[L + 1.5 * e, N(L + 1.5 * e)], [L - e, N(L - e)]] }); },
    // Réciproque d'une restriction
    () => { const a = pk([-2, 1, 2, 3]), b = pk([-4, -1, 3, 5]), y1 = b + pk([4, 9, 16]), x1 = a + Math.sqrt(y1 - b);
      return X({ id: "recip", lv: 3, titre: "Restreindre pour inverser",
        q: "Soit " + M("f(x) = (x" + sg(-a) + ")^2" + sg(b)) + ".",
        parts: [{ label: "Montre que " + M("f") + " n'est pas injective sur " + M("\\mathbb{R}") + " (donne deux nombres qui ont la même image).", pts: 1 }, { label: "Sur quel intervalle " + M("[a \\,;\\, +\\infty[") + " la fonction est-elle bijective vers " + M("[" + b + " \\,;\\, +\\infty[") + " ?", pts: 1 }, { label: "Détermine la réciproque de cette restriction.", pts: 2 }, { label: "Calcule " + M("f^{-1}(" + y1 + ")") + " et vérifie.", pts: 1 }],
        sol: ul([M("f(" + (a - 1) + ") = f(" + (a + 1) + ") = " + (1 + b)) + " (symétrie par rapport à " + M("x = " + a) + ").", "Sur " + M("[" + a + " \\,;\\, +\\infty[") + " (à droite du sommet " + M("(" + a + " \\,;\\, " + b + ")") + "), " + M("f") + " est strictement croissante.", M("y = (x" + sg(-a) + ")^2" + sg(b)) + " ⟺ " + M("x" + sg(-a) + " = \\sqrt{y" + sg(-b) + "}") + " (racine positive car " + M("x \\ge " + a) + ") : " + M("f^{-1}(x) = " + a + " + \\sqrt{x" + sg(-b) + "}") + ", pour " + M("x \\ge " + b) + ".", M("f^{-1}(" + y1 + ") = " + a + " + \\sqrt{" + (y1 - b) + "} = " + x1) + " ; " + M("f(" + x1 + ") = " + (x1 - a) ** 2 + sg(b) + " = " + y1) + " ✓."]),
        chk: [[x1, String(x1)], [(x1 - a) ** 2 + b, String(y1)]] }); },
  ];
  const RAISONF = [
    () => { const w = who(), x = pk([2, 3]);
      return X({ id: "compo", lv: 1, titre: "Trouve l'erreur",
        q: "Avec " + M("f(x) = x + 1") + " et " + M("g(x) = x^2") + ", " + w + " écrit : « " + M("(g \\circ f)(x) = g(x) \\cdot f(x) = x^3 + x^2") + " ».",
        parts: [{ label: "Calcule " + M("(g \\circ f)(" + x + ")") + " directement et avec la formule de " + w + ".", pts: 1 }, { label: "Donne la bonne expression.", pts: 1 }],
        sol: ul([M("g(f(" + x + ")) = g(" + (x + 1) + ") = " + (x + 1) ** 2) + ", mais " + M(x + "^3 + " + x + "^2 = " + (x ** 3 + x * x)) + ".", "Composer, c'est appliquer " + M("g") + " au résultat de " + M("f") + " : " + M("(g \\circ f)(x) = (x + 1)^2") + "."]),
        chk: [[(x + 1) ** 2, String((x + 1) ** 2)]] }); },
    () => VF("bijection", 2, [["« " + M("|a + b| = |a| + |b|") + " pour tous réels " + M("a, b") + ". »", false, M("|3 + (-3)| = 0 \\neq 6") + "."],
      ["« " + M("f(x) = x^2") + " est injective sur " + M("\\mathbb{R}") + ". »", false, M("f(-2) = f(2)") + "."],
      ["« " + M("(f \\circ f^{-1})(x) = x") + " pour tout " + M("x") + " du domaine de " + M("f^{-1}") + ". »", true, "C'est la définition de la réciproque."],
      ["« Le graphe de " + M("f^{-1}") + " est le symétrique de celui de " + M("f") + " par rapport à la droite " + M("y = x") + ". »", true, "On échange les coordonnées de chaque point."],
      ["« " + M("|-x| = x") + " pour tout réel " + M("x") + ". »", false, "Pour " + M("x = -3") + " : " + M("|3| = 3 \\neq -3") + "."],
      ["« Une fonction strictement croissante sur un intervalle y est injective. »", true, "Deux nombres différents ont des images différentes."]]),
  ];

  // ===================== 7. Logarithmes =====================
  const EXL = [
    // Doubler un placement
    () => { const t = pk([2, 3, 4, 5]), C0 = pk([3000, 5000]), S = pk([8000, 10000]), n2 = Math.log(2) / Math.log(1 + t / 100), nS = Math.log(S / C0) / Math.log(1 + t / 100);
      return X({ id: "log", lv: 1, titre: "Quand le capital double-t-il ?",
        q: "Un capital de " + Q(C0, "CHF") + " est placé à " + t + " % d'intérêts composés : " + M("C(n) = " + N(C0) + " \\cdot " + N(1 + t / 100) + "^n") + ".",
        parts: [{ label: "Écris l'équation qui donne le temps de doublement et résous-la avec les logarithmes (au centième).", pts: 2 }, { label: "Le temps de doublement dépend-il du capital de départ ? Justifie.", pts: 1 }, { label: "Après combien d'années entières le capital dépasse-t-il " + Q(S, "CHF") + " ?", pts: 2 }],
        sol: ul([M(N(C0) + " \\cdot " + N(1 + t / 100) + "^n = " + N(2 * C0)) + " ⟺ " + M(N(1 + t / 100) + "^n = 2") + " ⟺ " + M("n = \\frac{\\log 2}{\\log " + N(1 + t / 100) + "} \\approx " + A(n2, 2)) + " ans.", "Non : " + M("C_0") + " se simplifie, il reste " + M(N(1 + t / 100) + "^n = 2") + ".", M("n > \\frac{\\log(" + N(S) + " : " + N(C0) + ")}{\\log " + N(1 + t / 100) + "} \\approx " + A(nS, 2)) + " : après " + Math.ceil(nS) + " ans."]),
        chk: [[n2, A(n2, 2), 0.01], [Math.ceil(nS), String(Math.ceil(nS))]] }); },
    // Les décibels
    () => { const L1 = pk([60, 70, 80]), k = pk([2, 4, 10]), dL = pk([20, 30]), add = 10 * lg(k);
      return X({ id: "log", lv: 2, titre: "Les décibels",
        q: "Le niveau sonore (en dB) d'un son d'intensité " + M("I") + " est " + M("L = 10 \\log\\left(\\frac{I}{I_0}\\right)") + ", où " + M("I_0 = 10^{-12}") + " W/m² est le seuil d'audition. Une tondeuse produit " + Q(L1, "dB") + ".",
        parts: [{ label: "Calcule l'intensité " + M("I") + " de la tondeuse.", pts: 1 }, { label: "Quel est le niveau sonore de " + k + " tondeuses identiques ensemble (au dixième de dB) ?", pts: 2 }, { label: "Par combien l'intensité est-elle multipliée quand le niveau augmente de " + dL + " dB ?", pts: 1 }],
        sol: ul([M("\\log\\left(\\frac{I}{I_0}\\right) = " + L1 / 10) + " ⟺ " + M("I = 10^{" + L1 / 10 + "} \\cdot 10^{-12} = 10^{" + (L1 / 10 - 12) + "}") + " W/m².", M("10 \\log\\left(\\frac{" + k + "I}{I_0}\\right) = 10\\log " + k + " + " + L1 + " \\approx " + A(L1 + add, 1)) + " dB (et non " + k * L1 + " dB !).", M("10^{" + dL / 10 + "} = " + N(10 ** (dL / 10))) + " : l'intensité est multipliée par " + N(10 ** (dL / 10)).replace(/\\text\{'\}/g, "'") + "."]),
        chk: [[L1 + add, A(L1 + add, 1), 0.1], [10 ** (dL / 10), String(10 ** (dL / 10))]] }); },
    // Équation logarithmique, changement de base
    () => { const [x0, d, k] = pk([[4, 2, 3], [8, 4, 5], [4, 3, 2], [8, 6, 4], [16, 8, 7]]), c = pk([5, 7, 20, 40]), b = pk([2, 3]), sol = Math.log(c) / Math.log(b), m = pk([48, 80, 24]);
      return X({ id: "logbase", lv: 2, titre: "Équations et changement de base",
        q: "Résous ou calcule.",
        parts: [{ label: M("\\log_2(x) + \\log_2(x - " + d + ") = " + k) + " (attention au domaine).", pts: 2 }, { label: M(b + "^x = " + c) + " (au millième).", pts: 1 }, { label: "Calcule " + M("\\log_2(" + m + ")") + " avec le changement de base (au millième), puis vérifie qu'il est entre deux entiers que tu préciseras.", pts: 2 }],
        sol: ul(["Domaine " + M("x > " + d) + ". " + M("\\log_2(x(x - " + d + ")) = " + k) + " ⟺ " + M("x^2 - " + d + "x - " + 2 ** k + " = 0") + " ⟺ " + M("x = " + x0) + " ou " + M("x = " + (d - x0)) + " (hors du domaine) : " + M("S = \\{" + x0 + "\\}") + ".", M("x = \\frac{\\log " + c + "}{\\log " + b + "} \\approx " + A(sol, 3)) + ".", M("\\log_2(" + m + ") = \\frac{\\log " + m + "}{\\log 2} \\approx " + A(Math.log2(m), 3)) + " ; " + M("2^{" + Math.floor(Math.log2(m)) + "} = " + 2 ** Math.floor(Math.log2(m)) + " \\lt " + m + " \\lt " + 2 ** Math.ceil(Math.log2(m)) + " = 2^{" + Math.ceil(Math.log2(m)) + "}") + "."]),
        chk: [[x0, String(x0)], [x0 * (x0 - d), String(2 ** k)], [sol, A(sol, 3), 0.001], [Math.log2(m), A(Math.log2(m), 3), 0.001]] }); },
    // Le pH
    () => { const c1 = pk([2, 3, 5]), e1 = pk([3, 4, 5]), H = c1 * 10 ** -e1, ph = -lg(H), ph2 = pk([2.5, 3.5, 6.2]), H2 = 10 ** -ph2, f = pk([10, 100]);
      return X({ id: "log", lv: 2, titre: "Le pH d'une solution",
        q: "Le pH d'une solution est " + M("\\text{pH} = -\\log[\\text{H}^+]") + ", où " + M("[\\text{H}^+]") + " est la concentration en ions hydrogène (mol/L).",
        parts: [{ label: "Calcule le pH d'une solution où " + M("[\\text{H}^+] = " + c1 + " \\cdot 10^{-" + e1 + "}") + " (au centième).", pts: 1 }, { label: "Une boisson a un pH de " + N(ph2).replace("{,}", ",") + ". Calcule sa concentration (notation scientifique, 3 chiffres significatifs).", pts: 2 }, { label: "On dilue une solution " + f + " fois (la concentration est divisée par " + f + "). Comment varie le pH ? Justifie avec une propriété du logarithme.", pts: 1 }],
        sol: ul([M("-\\log(" + c1 + " \\cdot 10^{-" + e1 + "}) = " + e1 + " - \\log " + c1 + " \\approx " + A(ph, 2)) + ".", M("[\\text{H}^+] = 10^{-" + N(ph2) + "} \\approx " + A(H2 * 10 ** Math.ceil(ph2), 2) + " \\cdot 10^{-" + Math.ceil(ph2) + "}") + " mol/L.", M("-\\log\\left(\\frac{c}{" + f + "}\\right) = -\\log c + \\log " + f + " = \\text{pH} + " + lg(f)) + " : le pH augmente de " + lg(f) + "."]),
        chk: [[ph, A(ph, 2), 0.01], [H2 * 10 ** Math.ceil(ph2), A(H2 * 10 ** Math.ceil(ph2), 2), 0.01]] }); },
  ];
  const RAISONL = [
    () => { const a = pk([2, 5]), b = pk([3, 8]), w = who();
      return X({ id: "log", lv: 1, titre: "Trouve l'erreur",
        q: w + " écrit : « " + M("\\log(" + a + " + " + b + ") = \\log " + a + " + \\log " + b) + " ».",
        parts: [{ label: "Compare les deux membres avec la calculatrice (au millième).", pts: 1 }, { label: "Quelle propriété " + w + " a-t-" + (["Lina", "Inès", "Mia", "Elsa"].includes(w) ? "elle" : "il") + " déformée ?", pts: 1 }],
        sol: ul([M("\\log " + (a + b) + " \\approx " + A(lg(a + b), 3)) + " mais " + M("\\log " + a + " + \\log " + b + " = \\log " + a * b + " \\approx " + A(lg(a * b), 3)) + ".", "La propriété concerne le produit : " + M("\\log(ab) = \\log a + \\log b") + ". Il n'y a pas de règle pour " + M("\\log(a + b)") + "."]),
        chk: [[lg(a * b), A(lg(a * b), 3), 0.001]] }); },
    () => VF("logbase", 2, [["« " + M("\\log 100 = 2") + ". »", true, M("10^2 = 100") + "."],
      ["« " + M("\\log(-10) = -1") + ". »", false, "Le logarithme n'est défini que pour les nombres strictement positifs."],
      ["« " + M("\\log_2 8 = 3") + ". »", true, M("2^3 = 8") + "."],
      ["« " + M("\\frac{\\log a}{\\log b} = \\log(a - b)") + ". »", false, "C'est " + M("\\log_b a") + " (changement de base)."],
      ["« " + M("\\log(x^3) = 3\\log x") + " pour " + M("x > 0") + ". »", true, "Propriété de la puissance."],
      ["« La fonction " + M("\\log") + " est la réciproque de " + M("10^x") + ". »", true, M("10^{\\log x} = x") + " et " + M("\\log(10^x) = x") + "."]]),
  ];

  RICH.exp2c = { ids: ["expo", "expfrac", "modexp"], track: "col", label: "Exponentielles", ex: EXE, raison: RAISONE, minutes: 45 };
  RICH.compo2c = { ids: ["absval", "morceaux", "compo", "decomp", "bijection", "recip"], track: "col", label: "Composition et réciproque", ex: EXF, raison: RAISONF, minutes: 45 };
  RICH.log2c = { ids: ["log", "logbase"], track: "col", label: "Logarithmes", ex: EXL, raison: RAISONL, minutes: 45 };
})();

// 2e Collège · 8. Triangle quelconque, 9. Fonctions trigonométriques, Géométrie vectorielle (23.11).
(function () {
  const { N, A, Q, pk, FR, sg, par, X, ul, who, VF, D } = RX;
  const FRp = (v) => FR(v).replace(/\\frac\{(\d+)\}\{(\d+)\}/, "$1/$2");
  const pt = (x, y) => "(" + FR(x) + " \\,;\\, " + FR(y) + ")";
  const vec = (x, y) => "\\begin{pmatrix} " + FR(x) + " \\\\ " + FR(y) + " \\end{pmatrix}";
  const sq = (n) => { let k = 1; for (let d = 2; d * d <= n; d++) while (n % (d * d) === 0) { n /= d * d; k *= d; } return n === 1 ? [String(k), String(k)] : [(k === 1 ? "" : k) + "\\sqrt{" + n + "}", (k === 1 ? "" : k) + "√" + n]; };

  // ===================== 8. Trigonométrie du triangle quelconque =====================
  const EXT = [
    // Trois côtés connus
    () => { let a, b, c; do { a = R.int(5, 14); b = R.int(5, 14); c = R.int(5, 14); } while (a + b <= c + 2 || a + c <= b + 2 || b + c <= a + 2 || new Set([a, b, c]).size < 3);
      const M3 = Math.max(a, b, c), [p, q] = [a, b, c].filter((x) => x !== M3), gm = Math.acos((p * p + q * q - M3 * M3) / (2 * p * q)) / D, S = 0.5 * p * q * Math.sin(gm * D), s = (a + b + c) / 2, H = Math.sqrt(s * (s - a) * (s - b) * (s - c));
      return X({ id: "sinlaw", lv: 1, titre: "Un triangle de côtés connus",
        q: "Un triangle a des côtés de " + Q(a, "cm") + ", " + Q(b, "cm") + " et " + Q(c, "cm") + ".",
        parts: [{ label: "Calcule son plus grand angle (au centième de degré). Le triangle est-il obtusangle ?", pts: 2 }, { label: "Calcule son aire (au centième de cm²).", pts: 1 }, { label: "Vérifie l'aire avec la formule de Héron " + M("\\mathcal{A} = \\sqrt{s(s - a)(s - b)(s - c)}") + ", " + M("s") + " étant le demi-périmètre.", pts: 1 }],
        sol: ul(["Il est opposé au plus grand côté (" + M3 + ") : " + M("\\cos\\gamma = \\frac{" + p + "^2 + " + q + "^2 - " + M3 + "^2}{2 \\cdot " + p + " \\cdot " + q + "}") + ", " + M("\\gamma \\approx " + A(gm, 2) + "°") + (gm > 90 ? " : obtusangle." : " : le triangle est acutangle (plus grand angle aigu)."), M("\\mathcal{A} = \\frac{1}{2} \\cdot " + p + " \\cdot " + q + " \\cdot \\sin\\gamma \\approx " + A(S, 2)) + " cm².", M("s = " + N(s)) + " ; " + M("\\sqrt{" + N(s) + " \\cdot " + N(s - a) + " \\cdot " + N(s - b) + " \\cdot " + N(s - c) + "} \\approx " + A(H, 2)) + " ✓."]),
        chk: [[gm, A(gm, 2), 0.01], [S, A(S, 2), 0.01], [H, A(S, 2), 0.01]] }); },
    // La tour inaccessible
    () => { const al = R.int(20, 32), be = al + R.int(12, 25), d = pk([40, 50, 60, 80]), BS = (d * Math.sin(al * D)) / Math.sin((be - al) * D), h = BS * Math.sin(be * D), eye = 1.6;
      return X({ id: "sinlaw", lv: 2, titre: "La tour inaccessible",
        q: "Une tour se dresse au milieu d'un étang. D'un point " + M("A") + ", on voit son sommet sous un angle d'élévation de " + M(al + "°") + ". On avance de " + Q(d, "m") + " vers la tour jusqu'en " + M("B") + " : l'angle devient " + M(be + "°") + ". Les angles sont mesurés à " + Q(eye, "m") + " du sol.",
        parts: [{ label: "Calcule les angles du triangle " + M("ABS") + " (" + M("S") + " = sommet).", pts: 1 }, { label: "Calcule " + M("BS") + " (au centimètre).", pts: 2 }, { label: "Calcule la hauteur de la tour (au centimètre).", pts: 2 }],
        sol: ul([M("\\widehat{A} = " + al + "°") + ", " + M("\\widehat{ABS} = 180° - " + be + "° = " + (180 - be) + "°") + ", " + M("\\widehat{S} = " + be + "° - " + al + "° = " + (be - al) + "°") + ".", "Théorème du sinus : " + M("BS = \\frac{" + d + " \\cdot \\sin " + al + "°}{\\sin " + (be - al) + "°} \\approx " + A(BS, 2)) + " m.", M("BS \\cdot \\sin " + be + "° \\approx " + A(h, 2)) + " m au-dessus des yeux, soit " + M("\\approx " + A(h + eye, 2)) + " m."]),
        chk: [[BS, A(BS, 2), 0.01], [h + eye, A(h + eye, 2), 0.01]] }); },
    // Le cas ambigu
    () => { const al = R.int(28, 45), b = pk([10, 12, 15]), lo = b * Math.sin(al * D), a = Math.round((lo + (b - lo) * pk([0.4, 0.6])) * 10) / 10, b1 = Math.asin((b * Math.sin(al * D)) / a) / D, b2 = 180 - b1, g1 = 180 - al - b1, g2 = 180 - al - b2, c1 = (a * Math.sin(g1 * D)) / Math.sin(al * D), c2 = (a * Math.sin(g2 * D)) / Math.sin(al * D);
      return X({ id: "sinlaw", lv: 3, titre: "Deux triangles possibles",
        q: "Dans un triangle " + M("ABC") + ", on connaît " + M("\\alpha = " + al + "°") + ", " + M("b = AC = " + b) + " cm et " + M("a = BC = " + N(a)) + " cm.",
        parts: [{ label: "Calcule " + M("\\sin\\beta") + ". Pourquoi y a-t-il deux valeurs possibles de " + M("\\beta") + " ?", pts: 2 }, { label: "Calcule les deux valeurs de " + M("\\beta") + " et de " + M("\\gamma") + " (au centième de degré).", pts: 1 }, { label: "Calcule les deux longueurs possibles de " + M("c") + " (au centième).", pts: 2 }],
        sol: ul([M("\\sin\\beta = \\frac{" + b + " \\sin " + al + "°}{" + N(a) + "} \\approx " + A(Math.sin(b1 * D), 4)) + ". Deux angles ont ce sinus (" + M("\\beta") + " et " + M("180° - \\beta") + ") ; les deux conviennent car " + M("\\alpha + 180° - \\beta \\lt 180°") + " (le côté " + M("a") + " est plus court que " + M("b") + ").", M("\\beta_1 \\approx " + A(b1, 2) + "°, \\gamma_1 \\approx " + A(g1, 2) + "°") + " ; " + M("\\beta_2 \\approx " + A(b2, 2) + "°, \\gamma_2 \\approx " + A(g2, 2) + "°") + ".", M("c = \\frac{a \\sin\\gamma}{\\sin\\alpha}") + " : " + M("c_1 \\approx " + A(c1, 2)) + " cm, " + M("c_2 \\approx " + A(c2, 2)) + " cm."]),
        chk: [[b1, A(b1, 2), 0.01], [g2, A(g2, 2), 0.01], [c1, A(c1, 2), 0.01], [c2, A(c2, 2), 0.01]] }); },
    // Le parallélogramme
    () => { const a = pk([6, 8, 9, 12]), b = pk([4, 5, 7]), th = R.int(50, 75), d1 = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(th * D)), d2 = Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(th * D)), S = a * b * Math.sin(th * D), S2 = Math.round(a * b * 0.6), t2 = Math.asin(S2 / (a * b)) / D;
      return X({ id: "triaire", lv: 2, titre: "Le parallélogramme",
        q: "Un parallélogramme a des côtés de " + Q(a, "cm") + " et " + Q(b, "cm") + " ; ils forment un angle de " + M(th + "°") + ".",
        parts: [{ label: "Calcule les longueurs des deux diagonales (au centième).", pts: 2 }, { label: "Calcule son aire (au centième).", pts: 1 }, { label: "Quel angle faudrait-il entre les côtés pour une aire de " + Q(S2, "cm^2") + " ? (deux réponses)", pts: 2 }],
        sol: ul(["Petite diagonale : " + M("d_1^2 = " + a + "^2 + " + b + "^2 - 2 \\cdot " + a + " \\cdot " + b + " \\cos " + th + "°") + ", " + M("d_1 \\approx " + A(d1, 2)) + " cm ; l'autre angle vaut " + M((180 - th) + "°") + " : " + M("d_2 \\approx " + A(d2, 2)) + " cm.", "Deux triangles égaux : " + M("\\mathcal{A} = " + a + " \\cdot " + b + " \\cdot \\sin " + th + "° \\approx " + A(S, 2)) + " cm².", M("\\sin\\theta = \\frac{" + S2 + "}{" + a * b + "}") + " : " + M("\\theta \\approx " + A(t2, 2) + "°") + " ou " + M(A(180 - t2, 2) + "°") + " (même parallélogramme vu de l'autre angle)."]),
        chk: [[d1, A(d1, 2), 0.01], [d2, A(d2, 2), 0.01], [S, A(S, 2), 0.01], [t2, A(t2, 2), 0.01]] }); },
  ];
  const RAISONT = [
    () => { const w = who();
      return X({ id: "sinlaw", lv: 2, titre: "Trouve l'erreur",
        q: "Dans un triangle, " + M("\\alpha = 30°") + ", " + M("a = 6") + " et " + M("b = 10") + ". " + w + " calcule " + M("\\sin\\beta = \\frac{10 \\sin 30°}{6} = \\frac{5}{6}") + " et conclut : « " + M("\\beta \\approx 56{,}44°") + ", c'est la seule possibilité ».",
        parts: [{ label: "Montre que " + M("\\beta \\approx 123{,}56°") + " donne aussi un triangle.", pts: 1 }, { label: "Dans quel cas n'y a-t-il qu'une seule solution ?", pts: 1 }],
        sol: ul([M("30° + 123{,}56° = 153{,}56° \\lt 180°") + " : il reste " + M("\\gamma \\approx 26{,}44°") + ", un vrai triangle.", "Quand le côté opposé à l'angle connu est le plus long (" + M("a \\ge b") + ") : l'angle obtus est alors impossible."]),
        chk: [[180 - Math.asin(5 / 6) / D, "123,56", 0.01]] }); },
    () => VF("triaire", 1, [["« Dans tout triangle, " + M("\\frac{a}{\\sin\\alpha} = \\frac{b}{\\sin\\beta}") + ". »", true, "Théorème du sinus."],
      ["« L'aire d'un triangle vaut " + M("\\frac{1}{2}ab\\sin\\gamma") + ", où " + M("\\gamma") + " est l'angle entre " + M("a") + " et " + M("b") + ". »", true, "La hauteur relative à " + M("a") + " vaut " + M("b\\sin\\gamma") + "."],
      ["« Si " + M("\\cos\\gamma \\lt 0") + ", le triangle est obtusangle. »", true, M("\\gamma > 90°") + "."],
      ["« Deux côtés et un angle déterminent toujours un seul triangle. »", false, "Pas si l'angle n'est pas compris entre les côtés : cas ambigu."],
      ["« Un triangle de côtés 3, 4 et 8 existe. »", false, M("3 + 4 \\lt 8") + " : inégalité triangulaire violée."]]),
  ];

  // ===================== 9. Fonctions trigonométriques =====================
  // Graphe de A·sin(bx) + c sur [0 ; 2π], graduations en π/2 (SVG lisible à 360 px).
  const trigFig = (Am, b, c) => {
    const y0 = c - Am - 1, y1 = c + Am + 1, H = 30 + 24 * (y1 - y0), X0 = 36, W = 270, Xs = (x) => X0 + (x / (2 * Math.PI)) * W, Ys = (y) => 12 + ((y1 - y) / (y1 - y0)) * (H - 30);
    const ln = (a, bb, e, f, k, x = "") => '<line x1="' + a + '" y1="' + bb + '" x2="' + e + '" y2="' + f + '" class="' + k + '" ' + x + "/>", tx = (x, y, s, an = "middle") => '<text x="' + x + '" y="' + y + '" class="f-txt f-tick" text-anchor="' + an + '" font-size="11">' + s + "</text>";
    let g = "";
    for (let y = Math.ceil(y0); y <= y1; y++) g += ln(X0, Ys(y), X0 + W, Ys(y), "f-grid") + tx(X0 - 6, Ys(y) + 4, y < 0 ? "−" + -y : y, "end");
    ["", "π/2", "π", "3π/2", "2π"].forEach((s, i) => { const x = Xs((i * Math.PI) / 2); g += ln(x, Ys(y0), x, Ys(y1), "f-grid") + (s ? tx(x, Ys(y0) + 14, s) : ""); });
    g += ln(X0, Ys(Math.max(y0, Math.min(0, y1))), X0 + W + 6, Ys(Math.max(y0, Math.min(0, y1))), "f-line") + ln(X0, Ys(y0), X0, Ys(y1), "f-line");
    let d = ""; for (let i = 0; i <= 240; i++) { const x = (i / 240) * 2 * Math.PI; d += (i ? " L" : "M") + Xs(x).toFixed(1) + "," + Ys(Am * Math.sin(b * x) + c).toFixed(1); }
    return '<svg class="fig" viewBox="0 0 320 ' + (H + 6) + '" role="img" aria-label="graphe d\'une fonction sinusoïdale" xmlns="http://www.w3.org/2000/svg">' + g + '<path d="' + d + '" class="f-accent" fill="none" stroke-width="2.4"/></svg>';
  };
  const EXG = [
    // La grande roue (modèle, équation)
    () => { const H = pk([20, 25, 30]), Rr = pk([16, 18, 20]), T = pk([12, 15, 24]), h = (t) => H - Rr * Math.cos((2 * Math.PI * t) / T);
      return X({ id: "trigeq2", lv: 3, titre: "Un tour de grande roue",
        q: "La hauteur (en m) d'une cabine de grande roue est " + M("h(t) = " + H + " - " + Rr + "\\cos\\left(\\frac{2\\pi t}{" + T + "}\\right)") + ", " + M("t") + " en minutes.",
        parts: [{ label: "Donne la hauteur au départ, la hauteur maximale et la durée d'un tour.", pts: 2 }, { label: "Calcule la hauteur après " + T / 6 + " minutes (valeur exacte).", pts: 1 }, { label: "À quels instants du premier tour la cabine est-elle à " + Q(H + Rr / 2, "m") + " ?", pts: 2 }, { label: "Pendant combien de temps par tour est-elle au-dessus de " + Q(H + Rr / 2, "m") + " ?", pts: 1 }],
        sol: ul([M("h(0) = " + H + " - " + Rr + " = " + (H - Rr)) + " m ; maximum " + M(H + " + " + Rr + " = " + (H + Rr)) + " m (quand le cosinus vaut −1) ; période " + M("\\frac{2\\pi}{2\\pi / " + T + "} = " + T) + " min.", M("h(" + T / 6 + ") = " + H + " - " + Rr + "\\cos\\frac{\\pi}{3} = " + (H - Rr / 2)) + " m.", M("\\cos\\left(\\frac{2\\pi t}{" + T + "}\\right) = -\\frac{1}{2}") + " ⟺ " + M("\\frac{2\\pi t}{" + T + "} = \\frac{2\\pi}{3}") + " ou " + M("\\frac{4\\pi}{3}") + " : " + M("t = " + T / 3) + " min ou " + M("t = " + (2 * T) / 3) + " min.", "Entre " + T / 3 + " et " + (2 * T) / 3 + " min : " + T / 3 + " minutes."]),
        chk: [[h(T / 6), String(H - Rr / 2), 1e-9], [h(T / 3), N(H + Rr / 2), 1e-9], [h((2 * T) / 3), N(H + Rr / 2), 1e-9]] }); },
    // Relations et angles associés
    () => { const [p, q] = pk([[3, 5], [4, 5], [5, 13], [12, 13], [8, 17], [15, 17]]), r = Math.sqrt(q * q - p * p);
      return X({ id: "trigrel", lv: 2, titre: "Un angle du 2e quadrant",
        q: "On sait que " + M("\\sin\\alpha = \\frac{" + p + "}{" + q + "}") + " et que " + M("\\frac{\\pi}{2} \\lt \\alpha \\lt \\pi") + ".",
        parts: [{ label: "Calcule la valeur exacte de " + M("\\cos\\alpha") + ". Justifie son signe.", pts: 2 }, { label: "Calcule " + M("\\tan\\alpha") + ".", pts: 1 }, { label: "Déduis-en " + M("\\sin(\\pi - \\alpha)") + ", " + M("\\cos(\\pi + \\alpha)") + " et " + M("\\sin\\left(\\frac{\\pi}{2} - \\alpha\\right)") + ".", pts: 2 }],
        sol: ul([M("\\cos^2\\alpha = 1 - \\frac{" + p * p + "}{" + q * q + "} = \\frac{" + r * r + "}{" + q * q + "}") + " ; au 2e quadrant le cosinus est négatif : " + M("\\cos\\alpha = -\\frac{" + r + "}{" + q + "}") + ".", M("\\tan\\alpha = \\frac{\\sin\\alpha}{\\cos\\alpha} = -\\frac{" + p + "}{" + r + "}") + ".", M("\\sin(\\pi - \\alpha) = \\sin\\alpha = \\frac{" + p + "}{" + q + "}") + " ; " + M("\\cos(\\pi + \\alpha) = -\\cos\\alpha = \\frac{" + r + "}{" + q + "}") + " ; " + M("\\sin\\left(\\frac{\\pi}{2} - \\alpha\\right) = \\cos\\alpha = -\\frac{" + r + "}{" + q + "}") + "."]),
        chk: [[-Math.sqrt(1 - (p / q) ** 2), "-" + r + "/" + q, 1e-9], [Math.tan(Math.PI - Math.asin(p / q)), "-" + p + "/" + r, 1e-9]] }); },
    // Équation du second degré en sinus ou cosinus
    () => { const s = R.rand() < 0.5, eq = s ? "2\\sin^2 x - \\sin x - 1 = 0" : "2\\cos^2 x + \\cos x - 1 = 0", u = s ? "\\sin x" : "\\cos x", roots = s ? ["1", "-\\frac{1}{2}"] : ["\\frac{1}{2}", "-1"], sols = s ? ["\\frac{\\pi}{2}", "\\frac{7\\pi}{6}", "\\frac{11\\pi}{6}"] : ["\\frac{\\pi}{3}", "\\pi", "\\frac{5\\pi}{3}"], num = s ? [Math.PI / 2, (7 * Math.PI) / 6, (11 * Math.PI) / 6] : [Math.PI / 3, Math.PI, (5 * Math.PI) / 3], k = pk([2, 3]);
      return X({ id: "trigeq", lv: 2, titre: "Une équation qui se ramène au degré 2",
        q: "Résous dans " + M("[0 \\,;\\, 2\\pi[") + " sans calculatrice.",
        parts: [{ label: M(eq) + " (pose " + M("u = " + u) + ").", pts: 3 }, { label: M("\\cos(" + k + "x) = \\frac{1}{2}") + " : combien de solutions dans " + M("[0 \\,;\\, 2\\pi[") + " ? Donne-les.", pts: 2 }],
        sol: ul([M("2u^2 " + (s ? "- u" : "+ u") + " - 1 = 0") + " : " + M("u = " + roots[0]) + " ou " + M("u = " + roots[1]) + ". Solutions " + sols.map((x) => M(x)).join(", ") + ".", M(k + "x = \\pm\\frac{\\pi}{3} + 2n\\pi") + ", " + M("x = \\pm\\frac{\\pi}{" + 3 * k + "} + \\frac{2n\\pi}{" + k + "}") + " : " + 2 * k + " solutions, " + Array.from({ length: k }, (_, n) => [1 + 6 * n, 6 * (n + 1) - 1]).flat().map((m) => M("\\frac{" + m + "\\pi}{" + 3 * k + "}")).join(", ") + "."]),
        chk: [...num.map((x) => [s ? 2 * Math.sin(x) ** 2 - Math.sin(x) : 2 * Math.cos(x) ** 2 + Math.cos(x), "1", 1e-9]), [Math.cos(k * (Math.PI / (3 * k))), "1/2", 1e-9]] }); },
    // Lire le graphe d'une fonction sinusoïdale
    () => { const Am = pk([1, 2, 3]), b = pk([1, 2]), c = pk([-1, 1, 2]);
      return X({ id: "trigfn", lv: 2, titre: "Lire une sinusoïde",
        q: "Le graphe ci-dessous est celui de " + M("f(x) = A\\sin(bx) + c") + " sur " + M("[0 \\,;\\, 2\\pi]") + ", avec " + M("A > 0") + " et " + M("b > 0") + ".", fig: trigFig(Am, b, c),
        parts: [{ label: "Lis le maximum et le minimum de " + M("f") + ". Déduis-en " + M("A") + " et " + M("c") + ".", pts: 2 }, { label: "Lis la période et déduis-en " + M("b") + ".", pts: 1 }, { label: "Pour quels " + M("x") + " de " + M("[0 \\,;\\, 2\\pi]") + " la fonction atteint-elle son maximum ?", pts: 1 }],
        sol: ul(["Max " + M(c + Am) + ", min " + M(c - Am) + " : " + M("A = \\frac{" + (c + Am) + " - " + par(c - Am) + "}{2} = " + Am) + ", " + M("c = \\frac{" + (c + Am) + " + " + par(c - Am) + "}{2} = " + c) + ".", "Période " + M(b === 1 ? "2\\pi" : "\\pi") + " ; " + M("\\frac{2\\pi}{b} = " + (b === 1 ? "2\\pi" : "\\pi")) + " : " + M("b = " + b) + ".", M(b + "x = \\frac{\\pi}{2} + 2n\\pi") + " : " + (b === 1 ? M("x = \\frac{\\pi}{2}") : M("x = \\frac{\\pi}{4}") + " et " + M("x = \\frac{5\\pi}{4}")) + "."]),
        chk: [[Am * Math.sin(b * (Math.PI / (2 * b))) + c, String(Am + c)], [Am, String(Am)]] }); },
    // Cercle trigonométrique et longueur d'arc
    () => { const [n, d] = pk([[5, 6], [3, 4], [2, 3], [7, 6], [5, 4], [5, 3], [11, 6]]), deg = (180 * n) / d, r = pk([3, 5, 12]), s = r * (n / d) * Math.PI;
      const ex = { 30: ["\\frac{\\sqrt{3}}{2}", "\\frac{1}{2}"], 45: ["\\frac{\\sqrt{2}}{2}", "\\frac{\\sqrt{2}}{2}"], 60: ["\\frac{1}{2}", "\\frac{\\sqrt{3}}{2}"] }, ref = deg <= 90 ? deg : deg <= 180 ? 180 - deg : deg <= 270 ? deg - 180 : 360 - deg, cs = (deg > 90 && deg < 270 ? "-" : "") + ex[ref][0], sn = (deg > 180 ? "-" : "") + ex[ref][1];
      return X({ id: "trigcercle", lv: 1, titre: "Sur le cercle trigonométrique",
        q: "On considère l'angle " + M("\\theta = \\frac{" + n + "\\pi}{" + d + "}") + ".", fig: FIG.unitCircle(deg, ""),
        parts: [{ label: "Convertis " + M("\\theta") + " en degrés et donne son quadrant.", pts: 1 }, { label: "Donne les coordonnées exactes du point du cercle trigonométrique associé à " + M("\\theta") + ".", pts: 2 }, { label: "Sur un cercle de rayon " + Q(r, "cm") + ", quelle est la longueur de l'arc intercepté par cet angle au centre (au centième) ?", pts: 1 }],
        sol: ul([M("\\frac{" + n + " \\cdot 180°}{" + d + "} = " + deg + "°") + " ; " + (deg < 90 ? "1er" : deg < 180 ? "2e" : deg < 270 ? "3e" : "4e") + " quadrant.", "Angle de référence " + M(ref + "°") + " ; " + M("(\\cos\\theta \\,;\\, \\sin\\theta) = \\left(" + cs + " \\,;\\, " + sn + "\\right)") + ".", M("\\ell = r\\theta = " + r + " \\cdot \\frac{" + n + "\\pi}{" + d + "} \\approx " + A(s, 2)) + " cm."]),
        chk: [[deg, String(deg)], [s, A(s, 2), 0.01]] }); },
  ];
  const RAISONG = [
    () => { const w = who();
      return X({ id: "trigrel", lv: 1, titre: "Trouve l'erreur",
        q: w + " écrit : « " + M("\\sin(2x) = 2\\sin x") + " ».",
        parts: [{ label: "Teste avec " + M("x = \\frac{\\pi}{2}") + ".", pts: 1 }, { label: "Quelle est la bonne formule ?", pts: 1 }],
        sol: ul([M("\\sin\\pi = 0") + " mais " + M("2\\sin\\frac{\\pi}{2} = 2") + ".", M("\\sin(2x) = 2\\sin x\\cos x") + "."]),
        chk: [[2 * Math.sin(Math.PI / 2), "2"]] }); },
    () => VF("trigfn", 2, [["« " + M("\\sin^2 x + \\cos^2 x = 1") + " pour tout " + M("x") + ". »", true, "Pythagore dans le cercle trigonométrique."],
      ["« " + M("\\cos(\\pi - x) = \\cos x") + ". »", false, "Symétrie par rapport à l'axe vertical : " + M("\\cos(\\pi - x) = -\\cos x") + "."],
      ["« La période de " + M("\\sin(2x)") + " est " + M("\\pi") + ". »", true, M("\\frac{2\\pi}{2} = \\pi") + "."],
      ["« La tangente est définie pour tout réel. »", false, "Pas en " + M("\\frac{\\pi}{2} + k\\pi") + " (cosinus nul)."],
      ["« " + M("\\sin x = 2\\cos x") + " équivaut à " + M("\\tan x = 2") + ". »", true, "On divise par " + M("\\cos x") + ", qui n'est pas nul ici (sinon " + M("\\sin x") + " le serait aussi)."]]),
  ];

  // ===================== Géométrie vectorielle =====================
  const EXV = [
    // Le parallélogramme
    () => { const A0 = [R.int(-4, 0), R.int(-3, 1)], u = [pk([3, 4, 5]), pk([-1, 1, 2])], v = [pk([-2, -1, 1]), pk([3, 4])], B = [A0[0] + u[0], A0[1] + u[1]], Dd = [A0[0] + v[0], A0[1] + v[1]], C = [B[0] + v[0], B[1] + v[1]], ps = u[0] * v[0] + u[1] * v[1];
      return X({ id: "vecteurs", lv: 1, titre: "Compléter un parallélogramme",
        q: "On donne " + M("A" + pt(A0[0], A0[1])) + ", " + M("B" + pt(B[0], B[1])) + " et " + M("C" + pt(C[0], C[1])) + ".",
        parts: [{ label: "Calcule les composantes de " + M("\\vec{AB}") + " et " + M("\\vec{BC}") + ".", pts: 1 }, { label: "Détermine " + M("D") + " pour que " + M("ABCD") + " soit un parallélogramme.", pts: 2 }, { label: "Calcule le centre du parallélogramme.", pts: 1 }, { label: "Est-ce un rectangle ? Justifie avec un produit scalaire.", pts: 1 }],
        sol: ul([M("\\vec{AB} = " + vec(u[0], u[1])) + ", " + M("\\vec{BC} = " + vec(v[0], v[1])) + ".", M("\\vec{AD} = \\vec{BC}") + " : " + M("D = A + \\vec{BC} = " + pt(Dd[0], Dd[1])) + ".", "Milieu de " + M("[AC]") + " : " + M(pt((A0[0] + C[0]) / 2, (A0[1] + C[1]) / 2)) + ".", M("\\vec{AB} \\cdot \\vec{BC} = " + u[0] + " \\cdot " + par(v[0]) + " + " + par(u[1]) + " \\cdot " + v[1] + " = " + ps) + (ps === 0 ? " : oui, angle droit." : " ≠ 0 : non.")]),
        chk: [[Dd[0], String(Dd[0])], [Dd[1], String(Dd[1])], [(A0[0] + C[0]) / 2, FRp((A0[0] + C[0]) / 2)]] }); },
    // Angle d'un triangle par le produit scalaire
    () => { let A0, B, C, ps; do { A0 = [R.int(-3, 1), R.int(-3, 1)]; B = [A0[0] + R.int(2, 6), A0[1] + R.int(-2, 2)]; C = [A0[0] + R.int(-1, 3), A0[1] + R.int(3, 6)]; ps = (B[0] - A0[0]) * (C[0] - A0[0]) + (B[1] - A0[1]) * (C[1] - A0[1]); } while (ps === 0);
      const u = [B[0] - A0[0], B[1] - A0[1]], v = [C[0] - A0[0], C[1] - A0[1]], nu = u[0] ** 2 + u[1] ** 2, nv = v[0] ** 2 + v[1] ** 2, ang = Math.acos(ps / Math.sqrt(nu * nv)) / D;
      return X({ id: "vecteurs", lv: 2, titre: "L'angle en A",
        q: "On donne le triangle " + M("A" + pt(A0[0], A0[1])) + ", " + M("B" + pt(B[0], B[1])) + ", " + M("C" + pt(C[0], C[1])) + ".",
        parts: [{ label: "Calcule " + M("\\vec{AB}") + ", " + M("\\vec{AC}") + " et leurs normes (valeurs exactes).", pts: 2 }, { label: "Calcule le produit scalaire " + M("\\vec{AB} \\cdot \\vec{AC}") + ".", pts: 1 }, { label: "Calcule l'angle " + M("\\widehat{BAC}") + " (au centième de degré).", pts: 2 }],
        sol: ul([M("\\vec{AB} = " + vec(u[0], u[1])) + ", " + M("\\|\\vec{AB}\\| = " + sq(nu)[0]) + " ; " + M("\\vec{AC} = " + vec(v[0], v[1])) + ", " + M("\\|\\vec{AC}\\| = " + sq(nv)[0]) + ".", M(u[0] + " \\cdot " + par(v[0]) + " + " + par(u[1]) + " \\cdot " + par(v[1]) + " = " + ps) + ".", M("\\cos\\widehat{A} = \\frac{" + ps + "}{" + sq(nu)[0] + " \\cdot " + sq(nv)[0] + "}") + ", " + M("\\widehat{A} \\approx " + A(ang, 2) + "°") + "."]),
        chk: [[ps, String(ps)], [Math.sqrt(nu), sq(nu)[1]], [ang, A(ang, 2), 0.01]] }); },
    // Le bateau et le courant
    () => { const b = [0, pk([3, 4, 5])], c = [pk([1, 1.5, 2]), 0], w = 120 * pk([1, 2, 3]), res = [b[0] + c[0], b[1] + c[1]], sp = Math.hypot(res[0], res[1]), ang = Math.atan(c[0] / b[1]) / D, t = w / b[1], drift = c[0] * t;
      return X({ id: "vecteurs", lv: 2, titre: "Traverser la rivière",
        q: "Un bateau traverse une rivière de " + Q(w, "m") + " de large. Il vise la rive d'en face perpendiculairement, à " + Q(b[1], "m/s") + " (vecteur " + M(vec(b[0], b[1])) + "). Le courant le pousse à " + Q(c[0], "m/s") + " (vecteur " + M(vec(c[0], 0)) + ").",
        parts: [{ label: "Calcule le vecteur vitesse réelle et la vitesse réelle (au centième).", pts: 2 }, { label: "Quel angle fait la trajectoire avec la direction visée (au dixième de degré) ?", pts: 1 }, { label: "Combien de temps dure la traversée ? De combien est-il déporté ?", pts: 2 }],
        sol: ul([M("\\vec{v} = " + vec(res[0], res[1])) + ", " + M("\\|\\vec{v}\\| = \\sqrt{" + N(res[0] ** 2) + " + " + res[1] ** 2 + "} \\approx " + A(sp, 2)) + " m/s.", M("\\tan\\varphi = \\frac{" + N(c[0]) + "}{" + b[1] + "}") + ", " + M("\\varphi \\approx " + A(ang, 1) + "°") + ".", "Seule la composante perpendiculaire fait traverser : " + M(w + " : " + b[1] + " = " + N(t)) + " s ; déport " + M(N(c[0]) + " \\cdot " + N(t) + " = " + N(drift)) + " m."]),
        chk: [[sp, A(sp, 2), 0.01], [ang, A(ang, 1), 0.1], [drift, N(drift)]] }); },
    // Paramètre : colinéaires, perpendiculaires
    () => { const k = pk([2, 3, 4]), p = pk([2, 3, 5]), q = pk([1, 3, 4]), mp = (2 * 1) / (p + 1);
      return X({ id: "vecteurs", lv: 2, titre: "Choisir le paramètre",
        q: "Soit " + M("\\vec{u} = " + vec("m", 2).replace("\\frac{m}", "m")) + " et " + M("\\vec{v} = " + "\\begin{pmatrix} " + 2 * k * k + " \\\\ m \\end{pmatrix}") + ", où " + M("m") + " est un réel.",
        parts: [{ label: "Pour quelles valeurs de " + M("m") + " les vecteurs sont-ils colinéaires ?", pts: 2 }, { label: "Pour quelle valeur de " + M("m") + " le vecteur " + M("\\vec{u}") + " est-il perpendiculaire à " + M("\\vec{w} = " + vec(p, -q)) + " ?", pts: 1 }, { label: "Pour " + M("m = " + 2 * k) + ", calcule " + M("\\|\\vec{u} + \\vec{v}\\|") + " (valeur exacte).", pts: 2 }],
        sol: ul(["Déterminant nul : " + M("m \\cdot m - 2 \\cdot " + 2 * k * k + " = 0") + " ⟺ " + M("m^2 = " + 4 * k * k) + " ⟺ " + M("m = \\pm " + 2 * k) + ".", M(p + "m - 2 \\cdot " + q + " = 0") + " ⟺ " + M("m = " + FR((2 * q) / p)) + ".", M("\\vec{u} + \\vec{v} = " + vec(2 * k + 2 * k * k, 2 + 2 * k)) + " ; norme " + M("\\sqrt{" + ((2 * k + 2 * k * k) ** 2 + (2 + 2 * k) ** 2) + "} = " + sq((2 * k + 2 * k * k) ** 2 + (2 + 2 * k) ** 2)[0]) + "."]),
        chk: [[Math.sqrt(8 * k * k), String(2 * k)], [(2 * q) / p, FRp((2 * q) / p)], [Math.hypot(2 * k + 2 * k * k, 2 + 2 * k), sq((2 * k + 2 * k * k) ** 2 + (2 + 2 * k) ** 2)[1]]] }); },
    // Le travail d'une force
    () => { const F = [pk([30, 40, 60]), pk([10, 20, 30])], d = [pk([5, 8, 10]), 0], W = F[0] * d[0], nF = Math.hypot(F[0], F[1]), ang = Math.atan(F[1] / F[0]) / D, F2 = pk([50, 80]), a2 = pk([30, 45, 60]), W2 = F2 * d[0] * Math.cos(a2 * D);
      return X({ id: "vecteurs", lv: 3, titre: "Tirer une luge",
        q: "On tire une luge avec une force " + M("\\vec{F} = " + vec(F[0], F[1])) + " (en N) ; elle se déplace de " + M("\\vec{d} = " + vec(d[0], 0)) + " (en m). Le travail de la force est " + M("W = \\vec{F} \\cdot \\vec{d}") + " (en J).",
        parts: [{ label: "Calcule le travail " + M("W") + ".", pts: 1 }, { label: "Calcule l'intensité de la force et l'angle entre la corde et le sol (au dixième).", pts: 2 }, { label: "Avec une force de " + Q(F2, "N") + " inclinée à " + M(a2 + "°") + ", quel serait le travail sur le même déplacement (au joule) ? Pourquoi la composante verticale ne travaille-t-elle pas ?", pts: 2 }],
        sol: ul([M("W = " + F[0] + " \\cdot " + d[0] + " + " + F[1] + " \\cdot 0 = " + W) + " J.", M("\\|\\vec{F}\\| = \\sqrt{" + F[0] ** 2 + " + " + F[1] ** 2 + "} \\approx " + A(nF, 1)) + " N ; " + M("\\tan\\theta = \\frac{" + F[1] + "}{" + F[0] + "}") + ", " + M("\\theta \\approx " + A(ang, 1) + "°") + ".", M("W = " + F2 + " \\cdot " + d[0] + " \\cdot \\cos " + a2 + "° \\approx " + A(W2, 0)) + " J. La composante verticale est perpendiculaire au déplacement : produit scalaire nul."]),
        chk: [[W, String(W)], [nF, A(nF, 1), 0.1], [W2, A(W2, 0), 1]] }); },
  ];
  const RAISONV = [
    () => { const A0 = [R.int(-4, -1), R.int(1, 5)], B = [R.int(2, 6), R.int(-3, 0)], w = who();
      return X({ id: "vecteurs", lv: 1, titre: "Trouve l'erreur",
        q: "Avec " + M("A" + pt(A0[0], A0[1])) + " et " + M("B" + pt(B[0], B[1])) + ", " + w + " écrit : « " + M("\\vec{AB} = " + vec(A0[0] - B[0], A0[1] - B[1])) + " ».",
        parts: [{ label: "Quelle est l'erreur ?", pts: 1 }, { label: "Donne le bon vecteur et vérifie avec " + M("A + \\vec{AB} = B") + ".", pts: 1 }],
        sol: ul([w + " a calculé " + M("A - B") + " (c'est " + M("\\vec{BA}") + ").", M("\\vec{AB} = B - A = " + vec(B[0] - A0[0], B[1] - A0[1])) + " ; " + M(pt(A0[0], A0[1]) + " + " + vec(B[0] - A0[0], B[1] - A0[1]) + " = " + pt(B[0], B[1])) + " ✓."]),
        chk: [[B[0] - A0[0], String(B[0] - A0[0])]] }); },
    () => VF("vecteurs", 2, [["« " + M("\\|\\vec{u} + \\vec{v}\\| = \\|\\vec{u}\\| + \\|\\vec{v}\\|") + " pour tous vecteurs. »", false, "Contre-exemple : " + M(vec(1, 0)) + " et " + M(vec(0, 1)) + " : " + M("\\sqrt{2} \\neq 2") + "."],
      ["« Deux vecteurs non nuls de produit scalaire nul sont perpendiculaires. »", true, M("\\cos\\theta = 0") + ", " + M("\\theta = 90°") + "."],
      ["« Le produit scalaire de deux vecteurs est un vecteur. »", false, "C'est un nombre réel."],
      ["« " + M(vec(2, 3)) + " et " + M(vec(4, 6)) + " sont colinéaires. »", true, "Le second est le double du premier."],
      ["« " + M("\\vec{u} \\cdot \\vec{u} = \\|\\vec{u}\\|^2") + ". »", true, M("x^2 + y^2") + "."]]),
  ];

  RICH.tri2c = { ids: ["sinlaw", "triaire"], track: "col", label: "Trigonométrie du triangle quelconque", ex: EXT, raison: RAISONT, minutes: 45 };
  RICH.trigfn2c = { ids: ["trigrel", "trigcercle", "trigassoc", "trigeq", "trigfn", "trigeq2"], track: "col", label: "Fonctions trigonométriques", ex: EXG, raison: RAISONG, minutes: 45 };
  RICH.vec2c = { ids: ["vecteurs"], track: "col", label: "Géométrie vectorielle", ex: EXV, raison: RAISONV, minutes: 45 };
})();
