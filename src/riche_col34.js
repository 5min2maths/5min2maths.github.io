// 3e et 4e Collège (24.11) : sujets de préparation riches des chapitres de 3e (dérivation) et de 4e (intégration,
// logarithme et exponentielle, algèbre linéaire, probabilités). Problèmes à plusieurs étapes modelés sur les épreuves
// de maturité gymnasiale (Collège de Genève, niveau normal MA1) : modéliser, dériver, optimiser, interpréter.
// Calculatrice autorisée, valeurs exactes quand elles sont simples. Outils communs : RX (riche_mp2.js).
// Banques réservées au Collège (track: "col"). Paquet de chargement « 14 » (build.py).
(function () {
  const { N, A, pk, FR, lin, sg, par, X, ul, who, VF } = RX;
  const FRp = (v) => FR(v).replace(/\\frac\{(\d+)\}\{(\d+)\}/, "$1/$2"); /* forme tapée d'une fraction */
  // Polynôme (coefficients du plus haut degré au terme constant).
  const poly = (c, x = "x") => { const n = c.length - 1; let s = ""; c.forEach((a, i) => { const e = n - i; if (Math.abs(a) < 1e-12) return; const mono = e === 0 ? FR(Math.abs(a)) : (Math.abs(Math.abs(a) - 1) < 1e-12 ? "" : FR(Math.abs(a))) + x + (e > 1 ? "^{" + e + "}" : ""); s += s ? (a < 0 ? " - " : " + ") + mono : (a < 0 ? "-" : "") + mono; }); return s || "0"; };
  const pv = (c, x) => c.reduce((s, a) => s * x + a, 0);
  const fac = (r, x = "x") => "(" + x + (r < 0 ? " + " + FR(-r) : " - " + FR(r)) + ")";
  const pt = (x, y) => "(" + FR(x) + " \\,;\\, " + FR(y) + ")";
  const mX = (m) => "\\begin{pmatrix} " + FR(m[0][0]) + " & " + FR(m[0][1]) + " \\\\ " + FR(m[1][0]) + " & " + FR(m[1][1]) + " \\end{pmatrix}";
  const mul = (P, Q) => [[P[0][0] * Q[0][0] + P[0][1] * Q[1][0], P[0][0] * Q[0][1] + P[0][1] * Q[1][1]], [P[1][0] * Q[0][0] + P[1][1] * Q[1][0], P[1][0] * Q[0][1] + P[1][1] * Q[1][1]]];
  const det = (P) => P[0][0] * P[1][1] - P[0][1] * P[1][0];
  const col = (a, b) => "\\begin{pmatrix} " + FR(a) + " \\\\ " + FR(b) + " \\end{pmatrix}";
  const nzm = (a, b) => [[R.nz(a, b), R.nz(a, b)], [R.nz(a, b), R.nz(a, b)]];
  const E = Math.E;
  const yT = (b) => (b < 0 ? " - " : " + ") + (Math.abs(b) === 1 ? "" : Math.abs(b)) + "y"; /* « + 3y », « - y » */

  // ===================== 3e · Dérivation =====================
  const EXD = [
    // Tangentes à une parabole
    () => { let a, b, c, x0, xk, m, y0, k;
      do { a = pk([2, 3]); b = R.nz(-8, 8); c = R.nz(-6, 6); x0 = pk([1, 2, 3]); xk = x0 + pk([-3, -2, 2]); m = 2 * a * x0 + b; y0 = a * x0 * x0 + b * x0 + c; k = 2 * a * xk + b; }
      while (Math.abs(m) <= 1 || y0 === 0 || c === a * x0 * x0 || xk === 0 || Math.abs(k) <= 1 || k === m);
      const p = c - a * x0 * x0, xh = -b / (2 * a), yh = c - (b * b) / (4 * a), h = pk([-3, 2, 5]);
      return X({ id: "tangente", lv: 1, titre: "Tangentes à une parabole",
        q: "Soit " + M("f(x) = " + poly([a, b, c])) + ".",
        parts: [{ label: "Calcule " + M("f'(x)") + ".", pts: 1 }, { label: "Donne l'équation de la tangente au point d'abscisse " + M(x0) + ".", pts: 2 }, { label: "En quel point la tangente est-elle horizontale ?", pts: 1 }, { label: "En quel point la tangente est-elle parallèle à la droite " + M("d : y = " + lin(k, h)) + " ?", pts: 1 }],
        sol: ul([M("f'(x) = " + lin(2 * a, b)) + ".", M("f(" + x0 + ") = " + y0) + " et " + M("f'(" + x0 + ") = " + m) + ", donc " + M("y = " + FR(m) + "(x - " + x0 + ")" + sg(y0)) + ", soit " + M("y = " + lin(m, p)) + ".", M("f'(x) = 0") + " pour " + M("x = " + FR(xh)) + " : point " + M(pt(xh, yh)) + " (le sommet).", "Même pente " + M(k) + " : " + M(lin(2 * a, b) + " = " + k) + " donne " + M("x = " + xk) + ", point " + M(pt(xk, a * xk * xk + b * xk + c)) + "."]),
        chk: [[m, N(m)], [p, N(p)], [xh, FRp(xh)], [xk, N(xk)]] }); },
    // Étude d'une fonction de degré 3
    () => { let al, be, r, P, Q, fA, fB;
      do { [al, be] = pk([[-1, 3], [-3, 1], [1, 5], [-5, -1], [-2, 4], [-4, 2], [2, 4], [-4, -2]]); r = R.nz(-8, 8); P = (-3 * (al + be)) / 2; Q = 3 * al * be; fA = pv([1, P, Q, r], al); fB = pv([1, P, Q, r], be); } while (fA === 0 || fB === 0);
      const cnt = fB > 0 || fA < 0 ? 1 : 3;
      return X({ id: "variations", lv: 2, titre: "Étude d'une fonction de degré 3",
        q: "Soit " + M("f(x) = " + poly([1, P, Q, r])) + ".",
        parts: [{ label: "Calcule " + M("f'(x)") + " et factorise-la.", pts: 1 }, { label: "Dresse le tableau de signes de " + M("f'") + " et le tableau de variations de " + M("f") + ".", pts: 2 }, { label: "Donne les extrema locaux de " + M("f") + " (abscisse et valeur).", pts: 1 }, { label: "Combien de solutions l'équation " + M("f(x) = 0") + " a-t-elle ? Justifie avec le tableau.", pts: 1 }],
        sol: ul([M("f'(x) = " + poly([3, 2 * P, Q]) + " = 3" + fac(al) + fac(be)) + ".", M("f'") + " est positive à l'extérieur des racines, négative entre elles : " + M("f") + " croît sur " + M("]-\\infty \\,;\\, " + al + "]") + ", décroît sur " + M("[" + al + " \\,;\\, " + be + "]") + ", croît sur " + M("[" + be + " \\,;\\, +\\infty[") + ".", "Maximum local " + M("f(" + al + ") = " + fA) + ", minimum local " + M("f(" + be + ") = " + fB) + ".", cnt === 3 ? "Le maximum local est positif et le minimum local négatif : la courbe traverse l'axe sur chacun des trois intervalles, donc 3 solutions." : (fB > 0 ? "Le minimum local est positif : la courbe ne coupe l'axe qu'avant " + M(al) : "Le maximum local est négatif : la courbe ne coupe l'axe qu'après " + M(be)) + ", donc 1 solution."]),
        chk: [[fA, N(fA)], [fB, N(fB)], [cnt, String(cnt)]] }); },
    // La boîte en carton
    () => { const [L, l, xs] = pk([[16, 10, 2], [24, 9, 2], [21, 16, 3], [45, 24, 5], [40, 25, 5]]), x2 = (L * l) / (12 * xs), Vm = xs * (L - 2 * xs) * (l - 2 * xs), V1 = (L - 2) * (l - 2);
      return X({ id: "optimderiv", lv: 2, titre: "La boîte en carton",
        q: "Dans une plaque de carton de " + M(L) + " cm sur " + M(l) + " cm, on découpe un carré de côté " + M("x") + " cm à chaque coin, puis on plie les bords pour obtenir une boîte sans couvercle.",
        parts: [{ label: "Exprime le volume " + M("V(x)") + " de la boîte ; pour quelles valeurs de " + M("x") + " a-t-il un sens ? Calcule " + M("V(1)") + ".", pts: 1 }, { label: "Calcule " + M("V'(x)") + ".", pts: 1 }, { label: "Pour quelle valeur de " + M("x") + " le volume est-il maximal ? Justifie.", pts: 2 }, { label: "Quel est ce volume maximal ?", pts: 1 }],
        sol: ul([M("V(x) = x(" + L + " - 2x)(" + l + " - 2x)") + " pour " + M("0 \\lt x \\lt " + FR(l / 2)) + " ; " + M("V(1) = " + N(V1)) + " cm³.", "En développant, " + M("V(x) = " + poly([4, -2 * (L + l), L * l, 0])) + ", donc " + M("V'(x) = " + poly([12, -4 * (L + l), L * l])) + ".", M("V'(x) = 0") + " pour " + M("x = " + xs) + " ou " + M("x = " + FR(x2)) + " ; la seconde est hors du domaine. " + M("V'") + " passe de + à − en " + M(xs) + " : maximum.", M("V(" + xs + ") = " + xs + " \\cdot " + (L - 2 * xs) + " \\cdot " + (l - 2 * xs) + " = " + N(Vm)) + " cm³."]),
        chk: [[V1, N(V1)], [xs, N(xs)], [x2, FRp(x2)], [Vm, N(Vm)]] }); },
    // Le coût moyen
    () => { const a = pk([2, 3, 5]), n = pk([10, 20, 30]), b = pk([40, 60, 80]), c = a * n * n, m = 2 * a * n + b;
      return X({ id: "derivprodquot", lv: 3, titre: "Le coût moyen",
        q: "Une entreprise fabrique " + M("q") + " objets par jour ; le coût total (en CHF) est " + M("C(q) = " + a + "q^2 + " + b + "q + " + N(c)) + ". Le coût moyen par objet est " + M("CM(q) = \\frac{C(q)}{q}") + " et le coût marginal est " + M("C'(q)") + ".",
        parts: [{ label: "Calcule le coût moyen pour " + M(n / 2) + " objets.", pts: 1 }, { label: "Calcule " + M("CM'(q)") + " avec la règle du quotient.", pts: 1 }, { label: "Quelle production minimise le coût moyen ? Quel est ce coût moyen minimal ?", pts: 2 }, { label: "Calcule le coût marginal pour cette production. Que constates-tu ?", pts: 1 }],
        sol: ul([M("CM(" + n / 2 + ") = \\frac{C(" + n / 2 + ")}{" + n / 2 + "} = " + N((a * n * n) / 4 + (b * n) / 2 + c) + " \\div " + n / 2 + " = " + N((a * n) / 2 + b + (2 * c) / n)) + " CHF.", M("CM'(q) = \\frac{C'(q) \\cdot q - C(q)}{q^2} = \\frac{(" + 2 * a + "q + " + b + ")q - (" + a + "q^2 + " + b + "q + " + N(c) + ")}{q^2} = \\frac{" + a + "q^2 - " + N(c) + "}{q^2}") + ".", M("CM'(q) = 0") + " pour " + M("q^2 = " + n * n) + ", " + M("q = " + n) + " (q > 0) ; " + M("CM'") + " passe de − à + : minimum " + M("CM(" + n + ") = " + a * n + " + " + b + " + " + a * n + " = " + m) + " CHF.", M("C'(q) = " + 2 * a + "q + " + b) + ", " + M("C'(" + n + ") = " + m) + " : au minimum du coût moyen, coût moyen et coût marginal sont égaux."]),
        chk: [[(a * n) / 2 + b + (2 * c) / n, N((a * n) / 2 + b + (2 * c) / n)], [n, N(n)], [m, N(m)]] }); },
    // Le point le plus proche
    () => { const p = pk([2.5, 6.5, 12.5]), xs = p - 0.5, d = Math.sqrt(p - 0.25);
      return X({ id: "derivcomp", lv: 3, titre: "Le point le plus proche",
        q: "On cherche le point " + M("M(x \\,;\\, \\sqrt{x})") + " de la courbe " + M("y = \\sqrt{x}") + " le plus proche du point " + M("P(" + N(p) + " \\,;\\, 0)") + ".",
        parts: [{ label: "Exprime la distance " + M("d(x) = PM") + " en fonction de " + M("x") + ".", pts: 1 }, { label: "Calcule " + M("d'(x)") + " (dérivée d'une composée).", pts: 2 }, { label: "Pour quelle valeur de " + M("x") + " la distance est-elle minimale ? Quelle est cette distance ?", pts: 1 }, { label: "Vérifie que " + M("(PM)") + " est alors perpendiculaire à la tangente à la courbe en " + M("M") + ".", pts: 1 }],
        sol: ul([M("d(x) = \\sqrt{(x - " + N(p) + ")^2 + x} = \\sqrt{" + poly([1, -(2 * p - 1), p * p]) + "}") + ".", M("d'(x) = \\frac{2x - " + N(2 * p - 1) + "}{2\\sqrt{" + poly([1, -(2 * p - 1), p * p]) + "}}") + " : on dérive la racine, puis on multiplie par la dérivée de l'intérieur.", M("d'(x) = 0") + " pour " + M("x = " + N(xs)) + " (le signe passe de − à +) ; " + M("d = \\sqrt{" + N(xs * xs - 2 * p * xs + p * p + xs) + "} = " + N(d)) + ".", "Pente de la tangente : " + M("\\frac{1}{2\\sqrt{" + N(xs) + "}}") + " ; pente de " + M("(PM)") + " : " + M("\\frac{\\sqrt{" + N(xs) + "}}{" + N(xs) + " - " + N(p) + "} = -2\\sqrt{" + N(xs) + "}") + ". Produit : " + M("-1") + ", donc perpendiculaires."]),
        chk: [[xs, N(xs)], [d, N(d)]] }); },
    // La balle lancée
    () => { const v0 = pk([15, 20, 25]), [t1, t2] = pk([[0.5, 1], [1, 1.5], [0.5, 2]]), h = (t) => 1.5 + v0 * t - 5 * t * t, av = v0 - 5 * (t1 + t2), vi = v0 - 10 * t1, T = v0 / 10, hm = h(T);
      return X({ id: "nbderive", lv: 1, titre: "La balle lancée",
        q: "Une balle est lancée vers le haut ; sa hauteur (en m) après " + M("t") + " secondes est " + M("h(t) = 1{,}5 + " + v0 + "t - 5t^2") + ".",
        parts: [{ label: "Calcule sa vitesse moyenne entre " + M("t = " + N(t1)) + " s et " + M("t = " + N(t2)) + " s.", pts: 1 }, { label: "Calcule sa vitesse instantanée à " + M("t = " + N(t1)) + " s avec la définition du nombre dérivé.", pts: 2 }, { label: "À quel instant la balle est-elle au plus haut ? À quelle hauteur ?", pts: 2 }],
        sol: ul([M("\\frac{h(" + N(t2) + ") - h(" + N(t1) + ")}{" + N(t2) + " - " + N(t1) + "} = \\frac{" + N(h(t2)) + " - " + N(h(t1)) + "}{" + N(t2 - t1) + "} = " + N(av)) + " m/s.", M("\\frac{h(" + N(t1) + " + k) - h(" + N(t1) + ")}{k} = " + N(vi) + " - 5k") + " (après simplification par " + M("k") + "), qui tend vers " + M(N(vi)) + " m/s quand " + M("k \\to 0") + ".", M("h'(t) = " + v0 + " - 10t = 0") + " pour " + M("t = " + N(T)) + " s ; " + M("h(" + N(T) + ") = " + N(hm)) + " m."]),
        chk: [[av, N(av)], [vi, N(vi)], [T, N(T)], [hm, N(hm)]] }); },
  ];
  const RAISOND = [
    () => { const k = pk([2, 3, 4, 5]), w = who();
      return X({ id: "derivprodquot", lv: 1, titre: "Trouve l'erreur",
        q: "Pour " + M("f(x) = x^2(x - " + k + ")") + ", " + w + " écrit : « " + M("f'(x) = 2x \\cdot 1 = 2x") + " ».",
        parts: [{ label: "Développe " + M("f(x)") + ", dérive, et compare.", pts: 1 }, { label: "Refais le calcul avec la règle du produit ; calcule " + M("f'(1)") + ".", pts: 1 }],
        sol: ul([M("f(x) = x^3 - " + k + "x^2") + ", donc " + M("f'(x) = 3x^2 - " + 2 * k + "x") + " : " + w + " a multiplié les dérivées, ce qui est faux.", M("(uv)' = u'v + uv' = 2x(x - " + k + ") + x^2 \\cdot 1 = 3x^2 - " + 2 * k + "x") + " ; " + M("f'(1) = " + (3 - 2 * k)) + "."]),
        chk: [[3 - 2 * k, N(3 - 2 * k)]] }); },
    () => { const a = pk([1, 2, 3]), c = pk([-3, 3, 5]), w = who(), p = c - a * a;
      return X({ id: "tangente", lv: 2, titre: "Trouve l'erreur",
        q: "Tangente à " + M("f(x) = x^2" + sg(c)) + " au point d'abscisse " + M(a) + ". " + w + " écrit : « " + M("f'(" + a + ") = " + 2 * a) + " et " + M("f(" + a + ") = " + (a * a + c)) + ", donc la tangente est " + M("y = " + lin(2 * a, a * a + c)) + " ».",
        parts: [{ label: "Cette droite passe-t-elle par le point de contact ? Où est l'erreur ?", pts: 1 }, { label: "Donne la bonne équation.", pts: 1 }],
        sol: ul(["En " + M("x = " + a) + ", la droite donne " + M(2 * a * a + a * a + c) + ", pas " + M(a * a + c) + " : " + w + " a oublié le " + M("(x - " + a + ")") + " de la formule.", M("y = " + 2 * a + "(x - " + a + ")" + sg(a * a + c) + " = " + lin(2 * a, p)) + "."]),
        chk: [[p, N(p)]] }); },
    () => VF("variations", 2, [["« Si " + M("f'(a) = 0") + ", alors " + M("f") + " a un extremum en " + M("a") + ". »", false, "Contre-exemple : " + M("f(x) = x^3") + " en 0, " + M("f'") + " ne change pas de signe."],
      ["« Si " + M("f'(x) > 0") + " sur un intervalle, " + M("f") + " y est croissante. »", true, "C'est le lien entre le signe de la dérivée et les variations."],
      ["« La dérivée de " + M("(2x + 1)^3") + " est " + M("3(2x + 1)^2") + ". »", false, "Il manque le facteur 2 (dérivée de l'intérieur) : " + M("6(2x + 1)^2") + "."],
      ["« " + M("\\left(\\frac{1}{x}\\right)' = \\frac{1}{x^2}") + ". »", false, M("\\left(x^{-1}\\right)' = -x^{-2} = -\\frac{1}{x^2}") + "."],
      ["« Le taux de variation moyen de " + M("f") + " entre " + M("a") + " et " + M("b") + " est la pente de la sécante. »", true, "C'est " + M("\\frac{f(b) - f(a)}{b - a}") + ", la pente de la droite qui relie les deux points."],
      ["« La tangente au point d'abscisse " + M("a") + " a pour équation " + M("y = f'(a)(x - a) + f(a)") + ". »", true, "Pente " + M("f'(a)") + ", elle passe par " + M("(a \\,;\\, f(a))") + "."],
      ["« La dérivée d'un produit est le produit des dérivées. »", false, M("(uv)' = u'v + uv'") + " ; contre-exemple : " + M("(x \\cdot x)' = 2x \\neq 1") + "."]]),
  ];

  // ===================== 4e · Intégration =====================
  const EXI = [
    // La distance de freinage
    () => { const [v0, a] = pk([[20, 4], [24, 6], [30, 5], [25, 5], [28, 4]]), T = v0 / a, dist = (v0 * v0) / (2 * a), d1 = v0 - a / 2;
      return X({ id: "primitives", lv: 1, titre: "La distance de freinage",
        q: "Une voiture roule à " + M(v0 + "\\ \\text{m/s}") + " ; elle freine, et sa vitesse vaut alors " + M("v(t) = " + v0 + " - " + a + "t") + " (en m/s, " + M("t") + " en secondes depuis le début du freinage).",
        parts: [{ label: "Trouve la distance " + M("d(t)") + " parcourue depuis le début du freinage (" + M("d(0) = 0") + ").", pts: 1 }, { label: "Quelle distance parcourt-elle pendant la première seconde ?", pts: 1 }, { label: "Au bout de combien de temps s'arrête-t-elle ? Quelle est sa distance de freinage ?", pts: 2 }, { label: "À quelle vitesse roulait-elle, en km/h ?", pts: 1 }],
        sol: ul([M("d") + " est la primitive de " + M("v") + " qui s'annule en 0 : " + M("d(t) = " + v0 + "t - " + FR(a / 2) + "t^2") + ".", M("d(1) = " + v0 + " - " + FR(a / 2) + " = " + N(d1)) + " m.", M("v(t) = 0") + " pour " + M("t = " + N(T)) + " s ; " + M("d(" + N(T) + ") = " + N(dist)) + " m.", M(v0 + " \\cdot 3{,}6 = " + N(v0 * 3.6)) + " km/h."]),
        chk: [[d1, N(d1)], [T, N(T)], [dist, N(dist)], [v0 * 3.6, N(v0 * 3.6)]] }); },
    // Aire entre une parabole et une droite
    () => { let r1, w, r2, m, p, B, C;
      do { r1 = pk([-3, -2, -1, 1, 2]); w = pk([2, 3, 4, 6]); r2 = r1 + w; m = pk([-2, -1, 1, 2, 3]); p = R.nz(-4, 4); B = r1 + r2 + m; C = p - r1 * r2; } while (r2 === 0 || r2 === 1 || B === 0 || C === 0);
      const ar = w ** 3 / 6, mid = (w * w) / 4;
      return X({ id: "aireint", lv: 2, titre: "Entre une parabole et une droite",
        q: "On donne " + M("f(x) = " + poly([-1, B, C])) + " et " + M("g(x) = " + lin(m, p)) + ".",
        parts: [{ label: "Calcule les abscisses des points d'intersection des deux courbes.", pts: 2 }, { label: "Entre ces abscisses, quelle courbe est au-dessus ? Justifie.", pts: 1 }, { label: "Calcule l'aire du domaine compris entre les deux courbes.", pts: 2 }],
        sol: ul([M("f(x) - g(x) = " + poly([-1, r1 + r2, -r1 * r2]) + " = -" + fac(r1) + fac(r2)) + " : intersections en " + M("x = " + r1) + " et " + M("x = " + r2) + ".", "Au milieu, " + M("f - g") + " vaut " + M(FR(mid) + " > 0") + " : la parabole est au-dessus.", M("\\int_{" + r1 + "}^{" + r2 + "} \\left(" + poly([-1, r1 + r2, -r1 * r2]) + "\\right) dx = " + FR(ar)) + "."]),
        chk: [[r1, N(r1)], [r2, N(r2)], [mid, FRp(mid)], [ar, FRp(ar)]] }); },
    // Le débit d'un ruisseau
    () => { const [k, T] = pk([[1, 6], [2, 6], [3, 4], [3, 8], [1, 12]]), r0 = pk([5, 8, 10, 12]), mx = (k * T * T) / 4 + r0, vol = (k * T ** 3) / 6 + r0 * T, moy = (k * T * T) / 6 + r0;
      return X({ id: "integrale", lv: 2, titre: "Le débit d'un ruisseau",
        q: "Pendant une averse de " + M(T) + " heures, le débit d'un ruisseau (en m³ par heure) vaut " + M("r(t) = " + poly([-k, k * T, r0], "t")) + ", pour " + M("0 \\le t \\le " + T) + ".",
        parts: [{ label: "Quel est le débit au début et à la fin de l'averse ?", pts: 1 }, { label: "Quand le débit est-il maximal ? Que vaut-il ?", pts: 1 }, { label: "Quel volume d'eau s'est écoulé pendant l'averse ?", pts: 2 }, { label: "Quel est le débit moyen ? Compare-le au débit maximal.", pts: 1 }],
        sol: ul([M("r(0) = r(" + T + ") = " + r0) + " m³/h.", M("r'(t) = " + lin(-2 * k, k * T).replace(/x/g, "t") + " = 0") + " pour " + M("t = " + N(T / 2)) + " h ; " + M("r(" + N(T / 2) + ") = " + N(mx)) + " m³/h.", M("\\int_0^{" + T + "} r(t)\\,dt = \\left[" + poly([-k / 3, (k * T) / 2, r0, 0], "t") + "\\right]_0^{" + T + "} = " + N(vol)) + " m³.", M(N(vol) + " \\div " + T + " = " + N(moy)) + " m³/h, nettement moins que le maximum " + M(N(mx)) + "."]),
        chk: [[T / 2, N(T / 2)], [mx, N(mx)], [vol, N(vol)], [moy, N(moy)]] }); },
    // Le vase
    () => { const a = pk([1, 2, 3]), h = pk([6, 8, 10, 12]), Vp = (a * h * h) / 2, rr = Math.sqrt(a * h), hh = h / Math.SQRT2;
      return X({ id: "volrev", lv: 3, titre: "Le vase",
        q: "Un vase est obtenu en faisant tourner la courbe " + M("y = \\sqrt{" + (a === 1 ? "" : a) + "x}") + " autour de l'axe des abscisses, pour " + M("x") + " de 0 à " + M(h) + " (en cm). L'axe des " + M("x") + " est l'axe du vase, posé verticalement sur sa pointe.",
        parts: [{ label: "Calcule le volume du vase (valeur exacte, puis au cm³ près).", pts: 2 }, { label: "Quel est le rayon de l'ouverture (au centième) ?", pts: 1 }, { label: "On remplit le vase à moitié (en volume). À quelle hauteur l'eau arrive-t-elle (au millimètre) ? Pourquoi pas à " + M(h / 2) + " cm ?", pts: 2 }],
        sol: ul([M("V = \\pi \\int_0^{" + h + "} " + (a === 1 ? "" : a) + "x\\,dx = \\pi \\cdot \\frac{" + (a === 1 ? "" : a + " \\cdot ") + h + "^2}{2} = " + N(Vp) + "\\pi \\approx " + A(Vp * Math.PI, 0)) + " cm³.", M("y(" + h + ") = \\sqrt{" + a * h + "} \\approx " + A(rr, 2)) + " cm.", "Jusqu'à la hauteur " + M("x") + " : " + M("\\pi \\frac{" + (a === 1 ? "" : a) + "x^2}{2} = \\frac{" + N(Vp) + "\\pi}{2}") + ", donc " + M("x^2 = " + (h * h) / 2) + ", " + M("x = \\frac{" + h + "}{\\sqrt{2}} \\approx " + A(hh, 1)) + " cm. Le vase s'évase vers le haut : la moitié du volume est dans la partie haute, plus large."]),
        chk: [[Vp * Math.PI, A(Vp * Math.PI, 0), 1], [rr, A(rr, 2), 0.01], [hh, A(hh, 1), 0.1]] }); },
    // La parabole d'Archimède
    () => { const n = pk([2, 3]), ar = (4 * n ** 3) / 3, tg = n === 2 ? 36 : FR(32 / 3), at = n === 2 ? 9 : 4;
      return X({ id: "aireint", lv: 3, titre: "La parabole d'Archimède",
        q: "Soit " + M("f(x) = " + n * n + " - x^2") + ", et plus généralement " + M("f_a(x) = a - x^2") + " avec " + M("a > 0") + ".",
        parts: [{ label: "Calcule les zéros de " + M("f") + " et l'aire du domaine compris entre sa courbe et l'axe des abscisses.", pts: 2 }, { label: "Vérifie que cette aire vaut les deux tiers de celle du rectangle qui entoure le domaine (Archimède).", pts: 1 }, { label: "Exprime l'aire " + M("S(a)") + " pour " + M("f_a") + " et trouve " + M("a") + " pour que l'aire vaille " + M(tg) + ".", pts: 2 }],
        sol: ul(["Zéros " + M("\\pm " + n) + " ; " + M("\\int_{-" + n + "}^{" + n + "} (" + n * n + " - x^2)\\,dx = \\left[" + n * n + "x - \\frac{x^3}{3}\\right]_{-" + n + "}^{" + n + "} = " + FR(ar)) + ".", "Rectangle " + M(2 * n + " \\times " + n * n) + ", aire " + M(2 * n ** 3) + " ; " + M("\\frac{2}{3} \\cdot " + 2 * n ** 3 + " = " + FR(ar)) + " ✓.", M("S(a) = \\frac{4}{3} a\\sqrt{a}") + " (zéros " + M("\\pm\\sqrt{a}") + ") ; " + M("\\frac{4}{3}a\\sqrt{a} = " + tg) + " donne " + M("a\\sqrt{a} = " + (at * Math.sqrt(at))) + ", " + M("a = " + at) + "."]),
        chk: [[n, N(n)], [ar, FRp(ar)], [at, N(at)]] }); },
  ];
  const RAISONI = [
    () => { let a, b; do { a = pk([1, 2, 3]); b = pk([2, 3, 4]); } while (a === b); const w = who(), I = (b * b - a * a) / 2, S = (a * a + b * b) / 2;
      return X({ id: "aireint", lv: 1, titre: "Trouve l'erreur",
        q: "Pour l'aire entre la droite " + M("y = x") + " et l'axe des abscisses, de " + M("x = -" + a) + " à " + M("x = " + b) + ", " + w + " calcule " + M("\\int_{-" + a + "}^{" + b + "} x\\,dx = " + FR(I)) + ".",
        parts: [{ label: "Pourquoi n'est-ce pas l'aire ? Fais un croquis.", pts: 1 }, { label: "Calcule l'aire correcte.", pts: 1 }],
        sol: ul(["Sur " + M("[-" + a + " \\,;\\, 0]") + " la droite est sous l'axe : ce morceau compte négativement dans l'intégrale.", M("\\left|\\int_{-" + a + "}^{0} x\\,dx\\right| + \\int_0^{" + b + "} x\\,dx = " + FR((a * a) / 2) + " + " + FR((b * b) / 2) + " = " + FR(S)) + "."]),
        chk: [[S, FRp(S)]] }); },
    () => VF("integrale", 2, [["« " + M("\\int_a^b f(x)\\,dx") + " est toujours l'aire sous la courbe. »", false, "Seulement si " + M("f \\ge 0") + " ; les parties sous l'axe comptent négativement."],
      ["« Deux primitives d'une même fonction diffèrent d'une constante. »", true, "Leur différence a une dérivée nulle."],
      ["« " + M("\\int_1^3 2x\\,dx = 8") + ". »", true, M("3^2 - 1^2 = 8") + "."],
      ["« Une primitive de " + M("\\cos x") + " est " + M("-\\sin x") + ". »", false, M("(\\sin x)' = \\cos x") + " : c'est " + M("\\sin x") + "."],
      ["« " + M("\\int_a^b f(x)\\,dx = -\\int_b^a f(x)\\,dx") + ". »", true, "Échanger les bornes change le signe."],
      ["« Le volume de révolution vaut " + M("\\pi\\int_a^b f(x)\\,dx") + ". »", false, "On intègre " + M("f(x)^2") + " : " + M("\\pi\\int_a^b f(x)^2\\,dx") + "."]]),
  ];

  // ===================== 4e · Logarithme et exponentielle =====================
  const EXL = [
    // Trois équations
    () => { const c = pk([5, 7, 10, 12]), a = pk([2, 3]), b = pk([1, 2, 4]), k = pk([1, 2, 3]), [p, q] = pk([[2, 3], [2, 5], [3, 4], [2, 4], [3, 5]]);
      const x1 = (Math.log(c) + b) / a, x2 = (Math.exp(k) + 1) / 2;
      return X({ id: "lnexp", lv: 1, titre: "Trois équations",
        q: "Résous les équations suivantes (valeur exacte, puis au millième).",
        parts: [{ label: M("e^{" + a + "x - " + b + "} = " + c), pts: 1 }, { label: M("\\ln(2x - 1) = " + k), pts: 1 }, { label: M("e^{2x} - " + (p + q) + "e^x + " + p * q + " = 0") + " (pose " + M("X = e^x") + ").", pts: 2 }],
        sol: ul([M(a + "x - " + b + " = \\ln " + c) + ", " + M("x = \\frac{\\ln " + c + " + " + b + "}{" + a + "} \\approx " + A(x1, 3)) + ".", M("2x - 1 = e" + (k > 1 ? "^{" + k + "}" : "")) + ", " + M("x = \\frac{e" + (k > 1 ? "^{" + k + "}" : "") + " + 1}{2} \\approx " + A(x2, 3)) + " (et " + M("2x - 1 > 0") + " ✓).", M("X^2 - " + (p + q) + "X + " + p * q + " = (X - " + p + ")(X - " + q + ") = 0") + " : " + M("e^x = " + p) + " ou " + M("e^x = " + q) + ", " + M("x = \\ln " + p + " \\approx " + A(Math.log(p), 3)) + " ou " + M("x = \\ln " + q + " \\approx " + A(Math.log(q), 3)) + "."]),
        chk: [[x1, A(x1, 3), 0.001], [x2, A(x2, 3), 0.001], [Math.log(p), A(Math.log(p), 3), 0.001], [Math.log(q), A(Math.log(q), 3), 0.001]] }); },
    // Une culture de bactéries
    () => { const N0 = pk([800, 2000, 5000]), r = pk([1.5, 1.2, 1.8]), t1 = pk([3, 4, 5]), F = pk([5, 10]), k = Math.log(r) / t1, Td = Math.LN2 / k, tF = Math.log(F) / k, N1 = N0 * r;
      return X({ id: "croissance", lv: 2, titre: "Une culture de bactéries",
        q: "Une culture compte " + M(N(N0)) + " bactéries ; " + M(t1) + " heures plus tard, elle en compte " + M(N(N1)) + ". On suppose une croissance exponentielle " + M("N(t) = N_0 e^{kt}") + " (" + M("t") + " en heures).",
        parts: [{ label: "Détermine " + M("k") + " (valeur exacte, puis au millième).", pts: 1 }, { label: "Calcule le temps de doublement (au dixième d'heure).", pts: 1 }, { label: "Au bout de combien de temps la culture compte-t-elle " + M(N(F * N0)) + " bactéries (au dixième) ?", pts: 2 }, { label: "Le temps de doublement dépend-il de " + M("N_0") + " ? Justifie.", pts: 1 }],
        sol: ul([M("e^{" + t1 + "k} = " + N(r)) + ", " + M("k = \\frac{\\ln " + N(r) + "}{" + t1 + "} \\approx " + A(k, 3)) + ".", M("e^{kT} = 2") + ", " + M("T = \\frac{\\ln 2}{k} \\approx " + A(Td, 1)) + " h.", M("e^{kt} = " + F) + ", " + M("t = \\frac{\\ln " + F + "}{k} \\approx " + A(tF, 1)) + " h.", "Non : " + M("N_0 e^{kT} = 2N_0") + " se simplifie par " + M("N_0") + "."]),
        chk: [[k, A(k, 3), 0.001], [Td, A(Td, 1), 0.1], [tF, A(tF, 1), 0.1]] }); },
    // Le café qui refroidit
    () => { const T0 = pk([80, 90, 95]), Ta = pk([18, 20, 22]), T10 = pk([50, 55, 60]), q = (T10 - Ta) / (T0 - Ta), k = -Math.log(q) / 10, T20 = Ta + (T0 - Ta) * q * q, t30 = Math.log((T0 - Ta) / 10) / k;
      return X({ id: "croissance", lv: 2, titre: "Le café qui refroidit",
        q: "Un café à " + M(T0 + "\\ °\\text{C}") + " refroidit dans une pièce à " + M(Ta + "\\ °\\text{C}") + ". Sa température suit " + M("T(t) = " + Ta + " + " + (T0 - Ta) + "e^{-kt}") + " (" + M("t") + " en minutes). Après 10 minutes, il est à " + M(T10 + "\\ °\\text{C}") + ".",
        parts: [{ label: "Détermine " + M("k") + " (au millième).", pts: 1 }, { label: "Quelle est sa température après 20 minutes (au dixième) ?", pts: 1 }, { label: "Quand atteint-il " + M(Ta + 10 + "\\ °\\text{C}") + " (au dixième de minute) ?", pts: 2 }, { label: "Que devient la température à long terme ?", pts: 1 }],
        sol: ul([M((T0 - Ta) + "e^{-10k} = " + (T10 - Ta)) + ", " + M("k = -\\frac{1}{10}\\ln\\frac{" + (T10 - Ta) + "}{" + (T0 - Ta) + "} \\approx " + A(k, 3)) + ".", M("T(20) = " + Ta + " + " + (T0 - Ta) + "\\left(\\frac{" + (T10 - Ta) + "}{" + (T0 - Ta) + "}\\right)^2 \\approx " + A(T20, 1)) + " °C.", M((T0 - Ta) + "e^{-kt} = 10") + ", " + M("t = \\frac{\\ln " + N((T0 - Ta) / 10) + "}{k} \\approx " + A(t30, 1)) + " min.", M("e^{-kt} \\to 0") + " : la température tend vers " + M(Ta) + " °C (celle de la pièce)."]),
        chk: [[k, A(k, 3), 0.001], [T20, A(T20, 1), 0.1], [t30, A(t30, 1), 0.1]] }); },
    // Le médicament
    () => { const k = pk([8, 10, 12]), a = pk([2, 3, 4]), Cm = (k * a) / E, C2 = (2 * k * a) / (E * E);
      return X({ id: "lnexp", lv: 3, titre: "Le médicament",
        q: "La concentration d'un médicament dans le sang (en mg/L), " + M("t") + " heures après la prise, vaut " + M("C(t) = " + k + "t\\,e^{-t/" + a + "}") + ".",
        parts: [{ label: "Calcule " + M("C'(t)") + " et factorise-la.", pts: 2 }, { label: "Quand la concentration est-elle maximale ? Que vaut-elle (au centième) ?", pts: 1 }, { label: "Calcule " + M("C(" + 2 * a + ")") + " (au centième) et décris l'évolution après le maximum.", pts: 1 }, { label: "Quelle est la pente de la tangente à l'origine ? Que signifie-t-elle ?", pts: 1 }],
        sol: ul([M("C'(t) = " + k + "e^{-t/" + a + "} + " + k + "t \\cdot \\left(-\\frac{1}{" + a + "}\\right)e^{-t/" + a + "} = " + k + "e^{-t/" + a + "}\\left(1 - \\frac{t}{" + a + "}\\right)") + ".", M("C'") + " passe de + à − en " + M("t = " + a) + " : maximum " + M("C(" + a + ") = \\frac{" + k * a + "}{e} \\approx " + A(Cm, 2)) + " mg/L.", M("C(" + 2 * a + ") = \\frac{" + 2 * k * a + "}{e^2} \\approx " + A(C2, 2)) + " mg/L : après le maximum, la concentration décroît et tend vers 0.", M("C'(0) = " + k) + " : au début, la concentration augmente d'environ " + M(k) + " mg/L par heure."]),
        chk: [[a, N(a)], [Cm, A(Cm, 2), 0.01], [C2, A(C2, 2), 0.01], [k, N(k)]] }); },
  ];
  const RAISONL = [
    () => { const [u, v] = pk([[2, 3], [2, 5], [3, 4], [4, 5]]), w = who();
      return X({ id: "lnexp", lv: 1, titre: "Trouve l'erreur",
        q: w + " écrit : « " + M("\\ln(" + u + " + " + v + ") = \\ln " + u + " + \\ln " + v) + " ».",
        parts: [{ label: "Calcule les deux membres (au millième). Conclusion ?", pts: 1 }, { label: "Quelle est la bonne propriété ? Simplifie " + M("\\ln " + u + " + \\ln " + v) + ".", pts: 1 }],
        sol: ul([M("\\ln " + (u + v) + " \\approx " + A(Math.log(u + v), 3)) + " mais " + M("\\ln " + u + " + \\ln " + v + " \\approx " + A(Math.log(u * v), 3)) + " : c'est faux.", M("\\ln a + \\ln b = \\ln(ab)") + " : " + M("\\ln " + u + " + \\ln " + v + " = \\ln " + u * v) + ". Le logarithme transforme les produits en sommes, pas les sommes."]),
        chk: [[Math.log(u + v), A(Math.log(u + v), 3), 0.001], [Math.log(u * v), A(Math.log(u * v), 3), 0.001]] }); },
    () => VF("lnexp", 2, [["« " + M("(e^{3x})' = 3e^{3x}") + ". »", true, M("(e^u)' = u'e^u") + " avec " + M("u = 3x") + "."],
      ["« " + M("\\ln(x^5) = 5\\ln x") + " pour " + M("x > 0") + ". »", true, M("\\ln(a^n) = n\\ln a") + "."],
      ["« L'équation " + M("e^x = -2") + " a une solution. »", false, M("e^x > 0") + " pour tout " + M("x") + "."],
      ["« " + M("(\\ln x)' = \\frac{1}{x}") + ". »", true, "C'est la définition de " + M("\\ln") + " comme primitive de " + M("\\frac{1}{x}") + "."],
      ["« Une croissance de 5 % par an correspond à " + M("N_0e^{0{,}05t}") + ". »", false, "Il faut " + M("k = \\ln 1{,}05 \\approx 0{,}0488") + "."],
      ["« La demi-vie d'une décroissance " + M("N_0e^{-kt}") + " vaut " + M("\\frac{\\ln 2}{k}") + ". »", true, M("e^{-kT} = \\frac{1}{2} \\iff T = \\frac{\\ln 2}{k}") + "."]]),
  ];

  // ===================== 4e · Algèbre linéaire =====================
  const D4 = [
    [[[0, -1], [1, 0]], "la rotation de 90° autour de O"], [[[0, 1], [-1, 0]], "la rotation de −90° autour de O"],
    [[[1, 0], [0, -1]], "la symétrie d'axe Ox"], [[[-1, 0], [0, 1]], "la symétrie d'axe Oy"],
    [[[0, 1], [1, 0]], "la symétrie d'axe y = x"], [[[0, -1], [-1, 0]], "la symétrie d'axe y = −x"],
    [[[-1, 0], [0, -1]], "la symétrie centrale de centre O (rotation de 180°)"], [[[1, 0], [0, 1]], "l'identité"],
  ];
  const nomD4 = (P) => D4.find(([Q]) => Q.every((r, i) => r.every((v, j) => v === P[i][j])))[1];
  const EXA = [
    // Calcul matriciel
    () => { let P, Q; do { P = nzm(-4, 5); Q = nzm(-3, 4); } while (!det(P) || !det(Q) || !mul(P, Q)[0][1]);
      const PQ = mul(P, Q), QP = mul(Q, P), eq = PQ.every((r, i) => r.every((v, j) => v === QP[i][j])), S = P.map((r, i) => r.map((v, j) => 2 * v - Q[i][j]));
      return X({ id: "matrices", lv: 1, titre: "Calcul matriciel",
        q: "On donne " + M("A = " + mX(P)) + " et " + M("B = " + mX(Q)) + ".",
        parts: [{ label: "Calcule " + M("2A - B") + ".", pts: 1 }, { label: "Calcule " + M("AB") + " et " + M("BA") + ". Commente.", pts: 2 }, { label: "Calcule " + M("\\det A") + ", " + M("\\det B") + " et " + M("\\det(AB)") + ". Que constates-tu ?", pts: 2 }],
        sol: ul([M("2A - B = " + mX(S)) + ".", M("AB = " + mX(PQ)) + ", " + M("BA = " + mX(QP)) + (eq ? " : ici égales, mais c'est un hasard." : " : " + M("AB \\neq BA") + ", le produit n'est pas commutatif."), M("\\det A = " + det(P)) + ", " + M("\\det B = " + det(Q)) + ", " + M("\\det(AB) = " + det(PQ) + " = " + par(det(P)) + " \\cdot " + par(det(Q))) + " : " + M("\\det(AB) = \\det A \\cdot \\det B") + "."]),
        chk: [[PQ[0][1], N(PQ[0][1])], [det(P), N(det(P))], [det(Q), N(det(Q))], [det(PQ), N(det(PQ))]] }); },
    // Système et inverse
    () => { let a, b, c, d, D, x0, y0, e, f; do { a = R.nz(-6, 6); b = R.nz(-6, 6); c = R.nz(-6, 6); d = pk([-3, -2, 2, 3]); D = a * d - b * c; x0 = R.nz(-5, 5); y0 = R.nz(-5, 5); e = a * x0 + b * y0; f = c * x0 + d * y0; } while (Math.abs(D) < 2 || !e || !f || x0 === y0);
      const mm = (b * c) / d;
      return X({ id: "matrices", lv: 2, titre: "Un système, deux méthodes",
        q: "On considère le système " + M("\\begin{cases} " + lin(a, 0) + yT(b) + " = " + e + " \\\\ " + lin(c, 0) + yT(d) + " = " + f + " \\end{cases}") + ", de matrice " + M("A = " + mX([[a, b], [c, d]])) + ".",
        parts: [{ label: "Calcule " + M("\\det A") + ". Le système a-t-il une solution unique ?", pts: 1 }, { label: "Résous-le avec la règle de Cramer.", pts: 2 }, { label: "Calcule " + M("A^{-1}") + " et vérifie la solution avec " + M("A^{-1}\\binom{" + e + "}{" + f + "}") + ".", pts: 1 }, { label: "On remplace le coefficient " + M(a) + " par " + M("m") + ". Pour quelle valeur de " + M("m") + " le système n'a-t-il plus une solution unique ?", pts: 1 }],
        sol: ul([M("\\det A = " + par(a) + " \\cdot " + par(d) + " - " + par(b) + " \\cdot " + par(c) + " = " + D) + " ≠ 0 : solution unique.", M("x = \\frac{" + e + " \\cdot " + par(d) + " - " + par(b) + " \\cdot " + par(f) + "}{" + D + "} = " + x0) + ", " + M("y = \\frac{" + par(a) + " \\cdot " + par(f) + " - " + par(e) + " \\cdot " + par(c) + "}{" + D + "} = " + y0) + ".", M("A^{-1} = \\frac{1}{" + D + "}" + mX([[d, -b], [-c, a]])) + " ; le produit donne bien " + M(col(x0, y0)) + ".", M("\\det = " + par(d) + "m - " + par(b) + " \\cdot " + par(c) + " = 0") + " pour " + M("m = " + FR(mm)) + "."]),
        chk: [[D, N(D)], [x0, N(x0)], [y0, N(y0)], [mm, FRp(mm)]] }); },
    // Un triangle transformé
    () => { let P, u1, u2; do { P = nzm(-3, 3); u1 = R.nz(-3, 3); u2 = R.nz(-3, 3); } while (Math.abs(det(P)) < 2 || P[0][0] * u1 + P[0][1] * u2 === 0 || P[1][0] * u1 + P[1][1] * u2 === 0);
      const p = pk([2, 3, 4]), q = pk([2, 3]), s1 = P[0][0] * u1 + P[0][1] * u2, s2 = P[1][0] * u1 + P[1][1] * u2, ar = (p * q) / 2, ai = Math.abs(det(P)) * ar;
      return X({ id: "translin", lv: 2, titre: "Un triangle transformé",
        q: "L'application linéaire " + M("f") + " a pour matrice " + M("A = " + mX(P)) + ". On considère le triangle " + M("O(0 \\,;\\, 0)") + ", " + M("P(" + p + " \\,;\\, 0)") + ", " + M("Q(0 \\,;\\, " + q + ")") + ".",
        parts: [{ label: "Calcule les images " + M("P'") + " et " + M("Q'") + " de " + M("P") + " et " + M("Q") + ".", pts: 1 }, { label: "Calcule l'aire du triangle " + M("OPQ") + " et celle de son image, sans dessin.", pts: 2 }, { label: "Quel point a pour image " + M("S(" + s1 + " \\,;\\, " + s2 + ")") + " ?", pts: 2 }],
        sol: ul([M("P' = " + pt(P[0][0] * p, P[1][0] * p)) + ", " + M("Q' = " + pt(P[0][1] * q, P[1][1] * q)) + " (colonnes de " + M("A") + " multipliées par " + M(p) + " et " + M(q) + ").", "Aire " + M("\\frac{" + p + " \\cdot " + q + "}{2} = " + FR(ar)) + " ; " + M("|\\det A| = " + Math.abs(det(P))) + ", donc aire de l'image " + M(FR(ai)) + ".", M("A^{-1}" + col(s1, s2) + " = " + col(u1, u2)) + " (ou résoudre le système) : c'est " + M(pt(u1, u2)) + "."]),
        chk: [[P[0][0] * p, N(P[0][0] * p)], [ai, FRp(ai)], [u1, N(u1)], [u2, N(u2)]] }); },
    // Composer deux transformations
    () => { let i, j, G; do { i = R.int(0, 5); j = R.int(0, 5); G = mul(D4[j][0], D4[i][0]); } while (i === j || nomD4(G) === "l'identité");
      const [Af, nf] = D4[i], [Bg, ng] = D4[j], F = mul(Af, Bg); let p1, p2; do { p1 = R.nz(-5, 5); p2 = R.nz(-5, 5); } while (Math.abs(p1) === Math.abs(p2));
      const im = [G[0][0] * p1 + G[0][1] * p2, G[1][0] * p1 + G[1][1] * p2];
      return X({ id: "translin", lv: 3, titre: "Composer deux transformations",
        q: M("f") + " est " + nf + " et " + M("g") + " est " + ng + ".",
        parts: [{ label: "Écris la matrice " + M("A") + " de " + M("f") + " et la matrice " + M("B") + " de " + M("g") + " (images de " + M("(1 \\,;\\, 0)") + " et " + M("(0 \\,;\\, 1)") + ").", pts: 1 }, { label: "Calcule la matrice de " + M("g \\circ f") + " (d'abord " + M("f") + "). Quelle transformation est-ce ?", pts: 2 }, { label: "Même question pour " + M("f \\circ g") + ". L'ordre compte-t-il ?", pts: 1 }, { label: "Calcule l'image de " + M("P(" + p1 + " \\,;\\, " + p2 + ")") + " par " + M("g \\circ f") + ".", pts: 1 }],
        sol: ul([M("A = " + mX(Af)) + ", " + M("B = " + mX(Bg)) + ".", M("BA = " + mX(G)) + " : " + nomD4(G) + ".", M("AB = " + mX(F)) + " : " + nomD4(F) + (nomD4(F) === nomD4(G) ? " ; ici l'ordre ne change rien." : " ; l'ordre compte."), M("BA" + col(p1, p2) + " = " + col(im[0], im[1])) + "."]),
        chk: [[im[0], N(im[0])], [im[1], N(im[1])]] }); },
    // La machine qui écrase le plan (24.11 : applications linéaires, noyau et image)
    () => { const b = pk([-3, -2, 2, 3]), m = pk([-2, 2, 3]), a = -b * m, k = pk([-3, -2, 2, 3]), Am = [[a, b], [k * a, k * b]], u = [R.nz(-3, 3), R.nz(-3, 3)];
      if (a * u[0] + b * u[1] === 0) u[0] += u[0] > 0 ? 1 : -1; /* u hors du noyau */
      const fu = [a * u[0] + b * u[1], k * (a * u[0] + b * u[1])];
      return X({ id: "appllin", lv: 2, titre: "La machine qui écrase le plan",
        q: "L'application linéaire " + M("f") + " a pour matrice " + M(mX(Am)) + ".",
        parts: [{ label: "Calcule " + M("\\det A") + ". Que peut-on en conclure ?", pts: 1 }, { label: "Le noyau est engendré par " + M("(1 \\,;\\, m)") + ". Trouve " + M("m") + ".", pts: 1 }, { label: "L'image est la droite " + M("y = px") + ". Trouve " + M("p") + ".", pts: 1 }, { label: "Calcule " + M("f" + pt(u[0], u[1])) + " et vérifie que ce point est sur la droite image.", pts: 1 }],
        sol: ul([M("\\det A = " + FR(a) + " \\cdot " + par(k * b) + " - " + par(b) + " \\cdot " + par(k * a) + " = 0") + " : " + M("f") + " n'est pas inversible ; elle écrase le plan sur une droite.", M(FR(a) + " + " + par(b) + "m = 0") + " : " + M("m = " + m) + ".", "Image engendrée par la première colonne " + M(pt(a, k * a)) + " : " + M("p = " + k) + ".", M("f" + pt(u[0], u[1]) + " = " + pt(fu[0], fu[1])) + " ; " + M(FR(fu[1]) + " = " + k + " \\cdot " + par(fu[0])) + " : il est bien sur " + M("y = " + k + "x") + "."]),
        chk: [[m, N(m)], [k, N(k)], [fu[0], N(fu[0])], [fu[1], N(fu[1])]] }); },
  ];
  const RAISONA = [
    () => { let P, Q; do { P = nzm(-3, 4); Q = nzm(-3, 4); } while (mul(P, Q)[0][0] === P[0][0] * Q[0][0] || !mul(P, Q)[0][0]); const w = who(), PQ = mul(P, Q);
      return X({ id: "matrices", lv: 1, titre: "Trouve l'erreur",
        q: "Pour " + M("A = " + mX(P)) + " et " + M("B = " + mX(Q)) + ", " + w + " écrit : « " + M("AB = " + mX(P.map((r, i) => r.map((v, k) => v * Q[i][k])))) + " ».",
        parts: [{ label: "Quelle est l'erreur ?", pts: 1 }, { label: "Calcule le bon produit.", pts: 1 }],
        sol: ul([w + " a multiplié les coefficients placés au même endroit ; le produit se fait « ligne × colonne ».", M("AB = " + mX(PQ)) + " ; par exemple en haut à gauche " + M(par(P[0][0]) + " \\cdot " + par(Q[0][0]) + " + " + par(P[0][1]) + " \\cdot " + par(Q[1][0]) + " = " + PQ[0][0]) + "."]),
        chk: [[PQ[0][0], N(PQ[0][0])]] }); },
    () => VF("translin", 2, [["« Les colonnes de la matrice d'une application linéaire sont les images de " + M("(1 \\,;\\, 0)") + " et " + M("(0 \\,;\\, 1)") + ". »", true, M("A\\binom{1}{0}") + " est la 1re colonne, " + M("A\\binom{0}{1}") + " la 2e."],
      ["« Une matrice de déterminant nul est inversible. »", false, "Il faut " + M("\\det A \\neq 0") + " ; sinon l'application écrase le plan sur une droite."],
      ["« Une rotation conserve les aires. »", true, M("\\det = \\cos^2\\theta + \\sin^2\\theta = 1") + "."],
      ["« Pour toutes matrices, " + M("AB = BA") + ". »", false, "Exemple : rotation de 90° et symétrie d'axe Ox ne commutent pas."],
      ["« Une homothétie de rapport 3 multiplie les aires par 9. »", true, M("\\det\\begin{pmatrix} 3 & 0 \\\\ 0 & 3 \\end{pmatrix} = 9") + "."],
      ["« " + M("\\det(2A) = 2\\det A") + " pour une matrice " + M("2 \\times 2") + ". »", false, M("\\det(2A) = 2^2 \\det A = 4\\det A") + "."]]),
  ];

  // ===================== 4e · Probabilités =====================
  const EXP = [
    // La loi normale en pratique
    () => { const [ctx, u, mu, s] = pk([["La durée de vie d'une ampoule", "h", 1200, 100], ["La masse des œufs d'un élevage", "g", 62, 4], ["Le temps de trajet de " + who() + " pour aller au Collège", "min", 35, 5], ["La taille des recrues d'une caserne", "cm", 176, 7]]), n = pk([200, 400, 500, 1000]);
      return X({ id: "normale", lv: 1, titre: "La règle 68-95-99,7",
        q: ctx + " suit une loi normale de moyenne " + M(N(mu) + "\\ \\text{" + u + "}") + " et d'écart-type " + M(s + "\\ \\text{" + u + "}") + ".",
        parts: [{ label: "Quel pourcentage se trouve entre " + M(N(mu - s)) + " et " + M(N(mu + s)) + " " + u + " ?", pts: 1 }, { label: "Quel pourcentage dépasse " + M(N(mu + 2 * s)) + " " + u + " ?", pts: 1 }, { label: "Quel pourcentage se trouve entre " + M(N(mu - s)) + " et " + M(N(mu + 2 * s)) + " " + u + " ?", pts: 2 }, { label: "Sur " + M(n) + " cas, combien en attend-on sous " + M(N(mu - s)) + " " + u + " ?", pts: 1 }],
        sol: ul(["À un écart-type de la moyenne : environ 68 %.", M(N(mu + 2 * s) + " = \\mu + 2\\sigma") + " : il reste " + M("\\frac{100 - 95}{2} = 2{,}5") + " %.", "On coupe à la moyenne : " + M("34 + 47{,}5 = 81{,}5") + " %.", "Sous " + M("\\mu - \\sigma") + " : " + M("\\frac{100 - 68}{2} = 16") + " %, soit " + M(n + " \\cdot 0{,}16 = " + N(0.16 * n)) + "."]),
        chk: [[68, "68"], [2.5, "2,5"], [81.5, "81,5"], [0.16 * n, N(0.16 * n)]] }); },
    // Deux machines
    () => { const a = pk([0.6, 0.7, 0.55]), dA = pk([0.02, 0.03]), dB = pk([0.05, 0.04, 0.06]), pD = a * dA + (1 - a) * dB, pAD = (a * dA) / pD, pBn = ((1 - a) * (1 - dB)) / (1 - pD);
      return X({ id: "condbayes", lv: 2, titre: "Deux machines",
        q: "Une usine fabrique des pièces avec deux machines : la machine A produit " + M(N(100 * a) + "\\,\\%") + " des pièces, dont " + M(N(100 * dA) + "\\,\\%") + " sont défectueuses ; la machine B produit les autres, dont " + M(N(100 * dB) + "\\,\\%") + " sont défectueuses. On prend une pièce au hasard.",
        parts: [{ label: "Dessine l'arbre de probabilités.", pts: 1 }, { label: "Quelle est la probabilité que la pièce soit défectueuse ?", pts: 1 }, { label: "La pièce est défectueuse. Quelle est la probabilité qu'elle vienne de A (au millième) ?", pts: 2 }, { label: "La pièce est en bon état. Quelle est la probabilité qu'elle vienne de B (au millième) ?", pts: 1 }],
        sol: ul(["Branches A (" + M(N(a)) + ") et B (" + M(N(1 - a)) + "), puis défectueuse ou non.", "Probabilités totales : " + M(N(a) + " \\cdot " + N(dA) + " + " + N(1 - a) + " \\cdot " + N(dB) + " = " + N(pD)) + ".", "Bayes : " + M("P_D(A) = \\frac{" + N(a * dA) + "}{" + N(pD) + "} \\approx " + A(pAD, 3)) + ".", M("P_{\\overline{D}}(B) = \\frac{" + N(1 - a) + " \\cdot " + N(1 - dB) + "}{1 - " + N(pD) + "} \\approx " + A(pBn, 3)) + "."]),
        chk: [[pD, N(pD)], [pAD, A(pAD, 3), 0.001], [pBn, A(pBn, 3), 0.001]] }); },
    // Le QCM au hasard
    () => { const n = pk([8, 10, 12]), k = pk([3, 4, 5]), p = 1 / k, P0 = (1 - p) ** n, P1 = n * p * (1 - p) ** (n - 1), P2 = 1 - P0 - P1, m = Math.ceil(Math.log(0.01) / Math.log(1 - p));
      return X({ id: "binomiale", lv: 2, titre: "Le QCM au hasard",
        q: "Un QCM a " + M(n) + " questions, chacune avec " + M(k) + " réponses dont une seule juste. " + who() + " répond au hasard à toutes. " + M("X") + " est le nombre de bonnes réponses.",
        parts: [{ label: "Quelle est la loi de " + M("X") + " ? Calcule " + M("E(X)") + ".", pts: 1 }, { label: "Calcule " + M("P(X = 0)") + " (au millième).", pts: 1 }, { label: "Calcule " + M("P(X \\ge 2)") + " (au millième).", pts: 2 }, { label: "Combien de questions faudrait-il au minimum pour que la probabilité d'avoir au moins une bonne réponse dépasse 99 % ?", pts: 1 }],
        sol: ul([M("X \\sim B(" + n + " \\,;\\, " + FR(p) + ")") + " ; " + M("E(X) = " + n + " \\cdot " + FR(p) + " = " + FR(n * p)) + ".", M("P(X = 0) = \\left(" + FR(1 - p) + "\\right)^{" + n + "} \\approx " + A(P0, 3)) + ".", M("P(X = 1) = " + n + " \\cdot " + FR(p) + " \\cdot \\left(" + FR(1 - p) + "\\right)^{" + (n - 1) + "} \\approx " + A(P1, 3)) + ", donc " + M("P(X \\ge 2) = 1 - P(X = 0) - P(X = 1) \\approx " + A(P2, 3)) + ".", M("1 - \\left(" + FR(1 - p) + "\\right)^m \\ge 0{,}99") + " ⟺ " + M("m \\ge \\frac{\\ln 0{,}01}{\\ln " + FR(1 - p) + "} \\approx " + A(Math.log(0.01) / Math.log(1 - p), 2)) + " : " + M(m) + " questions."]),
        chk: [[n * p, FRp(n * p)], [P0, A(P0, 3), 0.001], [P2, A(P2, 3), 0.001], [m, N(m)]] }); },
    // La roue de la fête
    () => { let mz, s, j, Ex, jf; do { mz = pk([2, 3, 4]); s = pk([1, 2]); j = pk([6, 8, 10]); Ex = -mz / 2 + s / 3 + j / 6; jf = 3 * mz - 2 * s; } while (Math.abs(Ex) < 1e-9 || jf <= s || jf === j);
      const V = (mz * mz) / 2 + (s * s) / 3 + (j * j) / 6 - Ex * Ex;
      return X({ id: "varalea", lv: 3, titre: "La roue de la fête",
        q: "Une roue a trois secteurs : rouge (180°), bleu (120°) et vert (60°). On mise " + M(mz) + " CHF : sur le rouge on perd la mise ; sur le bleu, on récupère la mise plus " + M(s) + " CHF ; sur le vert, la mise plus " + M(j) + " CHF. " + M("X") + " est le gain net (en CHF).",
        parts: [{ label: "Donne la loi de " + M("X") + ".", pts: 1 }, { label: "Calcule " + M("E(X)") + ". Le jeu est-il favorable au joueur ?", pts: 1 }, { label: "Calcule l'écart-type de " + M("X") + " (au centième).", pts: 1 }, { label: "Quel gain sur le vert rendrait le jeu équitable ? Et que gagne-t-on en moyenne sur 30 parties avec le gain actuel ?", pts: 2 }],
        sol: ul([M("X") + " vaut " + M("-" + mz) + ", " + M(s) + ", " + M(j) + " avec les probabilités " + M("\\frac{1}{2}") + ", " + M("\\frac{1}{3}") + ", " + M("\\frac{1}{6}") + " (angles ÷ 360°).", M("E(X) = -\\frac{" + mz + "}{2} + \\frac{" + s + "}{3} + \\frac{" + j + "}{6} = " + FR(Ex)) + (Ex > 0 ? " > 0 : favorable au joueur." : " < 0 : défavorable au joueur."), M("V = E(X^2) - E(X)^2 = " + FR((mz * mz) / 2 + (s * s) / 3 + (j * j) / 6) + " - \\left(" + FR(Ex) + "\\right)^2 \\approx " + A(V, 2)) + ", " + M("\\sigma \\approx " + A(Math.sqrt(V), 2)) + ".", M("-\\frac{" + mz + "}{2} + \\frac{" + s + "}{3} + \\frac{g}{6} = 0") + " donne " + M("g = " + jf) + " CHF ; sur 30 parties : " + M("30 \\cdot " + FR(Ex) + " = " + FR(30 * Ex)) + " CHF."]),
        chk: [[Ex, FRp(Ex)], [Math.sqrt(V), A(Math.sqrt(V), 2), 0.01], [jf, N(jf)], [30 * Ex, FRp(30 * Ex)]] }); },
    // Les temps de trajet (24.11 : statistiques ouvertes en 4e)
    () => { let xs, m, sd, k; do { xs = Array.from({ length: 10 }, () => R.int(12, 45)); m = xs.reduce((a, b) => a + b, 0) / 10; sd = Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / 10); k = xs.filter((x) => x >= m - sd && x <= m + sd).length; } while (sd < 4 || new Set(xs).size < 8);
      return X({ id: "statdesc", lv: 2, titre: "Les temps de trajet",
        q: who() + " note ses temps de trajet (en minutes) pendant deux semaines d'école : " + xs.join(" ; ") + ".",
        parts: [{ label: "Calcule la moyenne " + M("\\bar x") + ".", pts: 1 }, { label: "Calcule l'écart-type " + M("\\sigma") + " (au centième).", pts: 2 }, { label: "Combien de trajets sont dans l'intervalle " + M("[\\bar x - \\sigma \\,;\\, \\bar x + \\sigma]") + " ? Quel pourcentage cela représente-t-il ?", pts: 1 }],
        sol: ul([M("\\bar x = \\frac{" + xs.reduce((a, b) => a + b, 0) + "}{10} = " + N(m)) + " min.", M("\\sigma = \\sqrt{\\frac{1}{10}\\sum (x_i - \\bar x)^2} \\approx " + A(sd, 2)) + " min (racine de la moyenne des carrés des écarts).", "Intervalle " + M("[" + A(m - sd, 2) + " \\,;\\, " + A(m + sd, 2) + "]") + " : " + M(k) + " trajets, soit " + M(10 * k + "\\,\\%") + " (pour une loi normale, on en attendrait environ 68 %)."]),
        chk: [[m, N(m)], [sd, A(sd, 2), 0.01], [k, N(k)]] }); },
    // Deux classes, deux boîtes (quartiles)
    () => { const mk11 = () => Array.from({ length: 11 }, () => R.int(20, 60)).sort((a, b) => a - b); let s1, s2; do { s1 = mk11(); s2 = mk11(); } while (s1[8] - s1[2] === s2[8] - s2[2] || s1[5] === s2[5]);
      const iq1 = s1[8] - s1[2], iq2 = s2[8] - s2[2];
      return X({ id: "statdesc", lv: 2, titre: "Deux classes, deux boîtes",
        q: "Points obtenus à un même test (sur 60) dans deux classes de 11 élèves, séries triées. Classe A : " + s1.join(" ; ") + ". Classe B : " + s2.join(" ; ") + ".",
        parts: [{ label: "Donne la médiane, " + M("Q_1") + " et " + M("Q_3") + " de la classe A.", pts: 1 }, { label: "Calcule l'écart interquartile de chaque classe.", pts: 1 }, { label: "Dessine les deux boîtes à moustaches sur un même axe. Quelle classe est la plus homogène ?", pts: 2 }],
        sol: ul(["Classe A : médiane " + M(s1[5]) + " (6e valeur), " + M("Q_1 = " + s1[2]) + ", " + M("Q_3 = " + s1[8]) + " (médianes des 5 premières et des 5 dernières valeurs).", "A : " + M(s1[8] + " - " + s1[2] + " = " + iq1) + " ; B : " + M("Q_1 = " + s2[2]) + ", " + M("Q_3 = " + s2[8]) + ", " + M(s2[8] + " - " + s2[2] + " = " + iq2) + ".", "Boîtes : min, " + M("Q_1") + ", médiane, " + M("Q_3") + ", max. La classe " + (iq1 < iq2 ? "A" : "B") + " a le plus petit écart interquartile : la moitié centrale de ses notes est plus resserrée."]),
        chk: [[s1[5], N(s1[5])], [s1[2], N(s1[2])], [s1[8], N(s1[8])], [iq1, N(iq1)], [iq2, N(iq2)]] }); },
  ];
  const RAISONP = [
    () => { let a, b, c, r; do { a = pk([0.4, 0.5, 0.6]); b = pk([0.2, 0.3]); c = pk([0.25, 0.3, 0.4]); r = (a * b) / c; } while (r > 1 || Math.abs(r - b) < 1e-9); const w = who();
      return X({ id: "condbayes", lv: 2, titre: "Trouve l'erreur",
        q: "Dans un collège, " + M(N(100 * a) + "\\,\\%") + " des élèves font du sport (S) ; parmi les sportifs, " + M(N(100 * b) + "\\,\\%") + " jouent d'un instrument (I) ; en tout, " + M(N(100 * c) + "\\,\\%") + " des élèves jouent d'un instrument. " + w + " affirme : « parmi les musiciens, " + M(N(100 * b) + "\\,\\%") + " font du sport ».",
        parts: [{ label: "Quelle confusion fait " + w + " ?", pts: 1 }, { label: "Calcule la bonne probabilité " + M("P_I(S)") + " (au millième).", pts: 1 }],
        sol: ul(["On connaît " + M("P_S(I) = " + N(b)) + " ; " + w + " le prend pour " + M("P_I(S)") + ", ce n'est pas la même chose.", "Bayes : " + M("P_I(S) = \\frac{P(S) \\cdot P_S(I)}{P(I)} = \\frac{" + N(a) + " \\cdot " + N(b) + "}{" + N(c) + "} \\approx " + A(r, 3)) + "."]),
        chk: [[r, A(r, 3), 0.001]] }); },
    () => VF("binomiale", 2, [["« Si " + M("X \\sim B(10 \\,;\\, 0{,}3)") + ", alors " + M("E(X) = 3") + ". »", true, M("E(X) = np = 10 \\cdot 0{,}3") + "."],
      ["« " + M("P(X = 2) = 0{,}3^2 \\cdot 0{,}7^8") + " pour " + M("X \\sim B(10 \\,;\\, 0{,}3)") + ". »", false, "Il manque le coefficient " + M("\\binom{10}{2} = 45") + " (nombre de chemins)."],
      ["« " + M("P_A(B) = P_B(A)") + " pour tous événements. »", false, "Contre-exemple : un test fiable donne beaucoup de faux positifs quand la maladie est rare."],
      ["« Deux événements indépendants vérifient " + M("P(A \\cap B) = P(A) \\cdot P(B)") + ". »", true, "C'est la définition de l'indépendance."],
      ["« Pour une loi normale, environ 95 % des valeurs sont à moins de deux écarts-types de la moyenne. »", true, "Règle 68-95-99,7."],
      ["« Un jeu d'espérance de gain nulle est équitable. »", true, "En moyenne, on ne gagne ni ne perd."]]),
  ];

  RICH.deriv3c = { ids: ["tauxvar", "nbderive", "derivref", "derivregles", "derivprodquot", "derivcomp", "tangente", "variations", "optimderiv"], track: "col", label: "Dérivation", ex: EXD, raison: RAISOND, minutes: 45 };
  RICH.int4c = { ids: ["primitives", "integrale", "aireint", "volrev"], track: "col", label: "Intégration", ex: EXI, raison: RAISONI, minutes: 45 };
  RICH.exp4c = { ids: ["lnexp", "croissance"], track: "col", label: "Logarithme et exponentielle", ex: EXL, raison: RAISONL, minutes: 45 };
  RICH.alg4c = { ids: ["matrices", "translin", "appllin"], track: "col", label: "Algèbre linéaire", ex: EXA, raison: RAISONA, minutes: 45 };
  RICH.proba4c = { ids: ["condbayes", "varalea", "binomiale", "statdesc", "normale"], track: "col", label: "Probabilités", ex: EXP, raison: RAISONP, minutes: 45 };
})();
