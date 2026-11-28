// Chantier 9e–10e (23.11) : sujets de préparation de qualité pour les chapitres de 10e du CO qui n'avaient que du
// drill (1. Relatifs et décimaux, 2. Aires et périmètres, 3. Écriture fractionnaire, 4. 3D, 10. Proportionnalité,
// 12. Figures planes, 13. Transformations ; 14. Diagrammes : banque commune RICH.diagr de riche_9.js).
// Même format et mêmes contrôles (chk, vals) que riche_9.js, dont il reprend les outils (RICHU). Modelé sur le MER 10e.
(function () {
  const { r6, N, Nk, A, T, u, Q, chf, pk, sh, g2, lcm, fr, fadd, fsub, fmul, fdiv, fv, ft, X, ul, who, tab, VF, hm, dur, fmt, svg, tx, ln, pg, grid } = RICHU;
  const sg = (v) => (v < 0 ? "(" + N(v) + ")" : N(v));
  const PI = Math.PI;

  // ===================== 10e · 1. Nombres relatifs et révision des décimaux =====================
  const EXR = [
    () => { const T0 = pk([6, 9, 12]), a1 = pk([1100, 1600, 2100]), [mt, S] = pk([["le Cervin", 4478], ["la Dent Blanche", 4357], ["le Grand Combin", 4314], ["la Pointe Dufour", 4634]]), t1 = r6(T0 - (0.6 * (a1 - 400)) / 100), tS = r6(T0 - (0.6 * (S - 400)) / 100), z = 400 + (T0 / 0.6) * 100;
      return X({ id: "rel", lv: 1, titre: "Il fait plus froid en altitude",
        q: "À Genève (altitude 400 m), il fait " + Q(T0, "°C") + ". En montagne, la température baisse d'environ " + Q(0.6, "°C") + " chaque fois qu'on monte de 100 m. Le téléphérique le plus proche a coûté " + pk([12, 25, 40]) + " millions de francs.",
        parts: [{ label: "Quelle température fait-il à " + N(a1) + " m d'altitude ?", pts: 2 }, { label: "Quelle température fait-il au sommet " + (mt.startsWith("le ") ? "du " + mt.slice(3) : "de " + mt) + " (" + N(S) + " m) ? Arrondis au dixième.", pts: 2 }, { label: "À quelle altitude fait-il 0 °C ?", pts: 1 }, { label: "Quel est l'écart de température entre Genève et le sommet ?", pts: 1 }],
        sol: ul(["On monte de " + N(a1 - 400) + " m : " + M(T0 + " - " + N((a1 - 400) / 100) + " \\cdot 0{,}6 = " + N(t1)) + " °C.", M(T0 + " - " + N((S - 400) / 100) + " \\cdot 0{,}6 \\approx " + A(tS, 1)) + " °C.", "Il faut perdre " + T0 + " °C : " + M(T0 + " : 0{,}6 = " + N(T0 / 0.6)) + " fois 100 m, donc " + M("400 + " + N(z - 400) + " = " + N(z)) + " m. Le prix du téléphérique ne sert à rien.", M(T0 + " - (" + A(tS, 1) + ") = " + A(T0 - tS, 1)) + " °C."]),
        chk: [[tS < 0 && t1 !== 0, "signes"], [Math.abs(T0 - (0.6 * (z - 400)) / 100) < 1e-9, "0 °C"]], vals: [t1, tS, z, T0 - tS] }); },
    () => { let P; do P = [0, 1, 2].map(() => { const j = R.int(3, 15), f = R.int(2, 20 - j - 1); return [j, f, 20 - j - f]; }); while (!P.some((p) => 3 * p[0] - 2 * p[1] - p[2] < -1) || new Set(P.map((p) => 3 * p[0] - 2 * p[1] - p[2])).size < 3 || P.some((p) => Math.abs(3 * p[0] - 2 * p[1] - p[2]) < 2));
      const sc = P.map((p) => 3 * p[0] - 2 * p[1] - p[2]), nm = sh(["Aya", "Ben", "Chloé", "Dario", "Eva"]).slice(0, 3), win = sc.indexOf(Math.max(...sc)), j4 = pk([4, 6, 8]);
      return X({ id: "prio", lv: 2, titre: "Le quiz",
        q: "Un quiz compte 20 questions. Une réponse juste rapporte 3 points, une réponse fausse en enlève 2, une question sans réponse en enlève 1." + tab(["joueur", "justes", "fausses", "sans réponse"], P.map((p, i) => [nm[i], ...p])),
        parts: [{ label: "Pour chaque joueur, écris le calcul de son score avec des nombres relatifs, puis effectue-le.", pts: 3 }, { label: "Qui gagne ? Quel est l'écart entre le premier et le dernier ?", pts: 1 }, { label: "Combien de réponses fausses annulent " + j4 + " réponses justes ?", pts: 1 }],
        sol: ul([P.map((p, i) => nm[i] + " : " + M(p[0] + " \\cdot 3 + " + p[1] + " \\cdot (-2) + " + p[2] + " \\cdot (-1) = " + sc[i])).join(" ; ") + ".", nm[win] + " gagne ; écart " + M(Math.max(...sc) + " - " + sg(Math.min(...sc)) + " = " + (Math.max(...sc) - Math.min(...sc))) + " points.", M(j4 + " \\cdot 3 = " + 3 * j4) + " points ; " + M(3 * j4 + " : 2 = " + 1.5 * j4) + " réponses fausses."]),
        chk: [[P.every((p) => p[0] + p[1] + p[2] === 20 && p[2] >= 1), "20 questions"]], vals: [...sc, 1.5 * j4] }); },
    () => { const c = pk([5.8, 6.4, 7.2]), d = pk([235, 418, 362, 286]), p = pk([1.89, 1.95, 2.04]), est = Math.round(c) * Math.round(d / 100) * Math.round(p), L = r6((c * d) / 100), cost = Math.round(L * p * 100) / 100, ck = Math.round((cost / d) * 1000) / 10;
      return X({ id: "decmul", lv: 2, titre: "Le plein d'essence",
        q: "Une voiture consomme " + Q(c, "L") + " d'essence aux 100 km. Pour partir en vacances, la famille fait un trajet de " + Q(d, "km") + ". L'essence coûte " + chf(p) + " le litre.",
        parts: [{ label: "<b>Sans calculatrice</b> : estime le coût de l'essence pour ce trajet (arrondis chaque nombre).", pts: 1 }, { label: "Calcule la quantité d'essence utilisée.", pts: 1 }, { label: "Calcule le coût exact, au centime.", pts: 1 }, { label: "Combien coûte un kilomètre, en centimes (au dixième) ?", pts: 1 }],
        sol: ul([M(Math.round(c) + " \\cdot " + Math.round(d / 100) + " \\cdot " + Math.round(p) + " = " + est) + " : environ " + est + " CHF.", M(N(c) + " \\cdot " + N(d / 100) + " = " + N(L)) + " L.", M(N(L) + " \\cdot " + N(p) + " \\approx " + Nk(cost, 2)) + " CHF (proche de l'estimation).", M(Nk(cost, 2) + " : " + d + " \\approx " + N(ck / 100)) + " CHF, soit environ " + N(ck) + " centimes."]),
        chk: [[Math.abs(est - cost) < 0.4 * cost, "estimation"]], vals: [L, cost, ck] }); },
    () => { let a, b, U; do { a = pk([2, 3, -2, -3, 4]); b = pk([3, 5, -3, -5]); U = [a]; for (let k = 0; k < 4; k++) U.push(-2 * U[k] + b); } while (U.some((v) => Math.abs(v) < 2));
      let z; do z = R.int(-9, 9); while (Math.abs(z) < 2); const y = -2 * z + b;
      return X({ id: "rel", lv: 3, titre: "La machine à nombres",
        q: "Une machine multiplie le nombre qu'on lui donne par " + M("-2") + ", puis ajoute " + M(N(b)) + ". On lui donne " + M(N(a)) + ", puis on redonne chaque résultat à la machine.",
        parts: [{ label: "Calcule les quatre résultats suivants.", pts: 2 }, { label: "Quel nombre faut-il donner à la machine pour obtenir " + M(N(y)) + " ?", pts: 2 }, { label: "La machine peut-elle donner un nombre pair ? Explique.", pts: 1 }],
        sol: ul([U.slice(1).map((v, k) => M(sg(U[k]) + " \\cdot (-2) + " + sg(b) + " = " + N(v))).join(" ; ") + ".", "On défait les opérations dans l'ordre inverse : " + M(N(y) + " - " + sg(b) + " = " + N(y - b)) + ", puis " + M(N(y - b) + " : (-2) = " + N(z)) + ".", "Non : " + M("(-2) \\cdot x") + " est toujours pair, et on ajoute " + N(b) + ", qui est impair : le résultat est toujours impair."]),
        chk: [[(y - b) / -2 === z, "inverse"], [U.every((v) => Math.abs(v) % 2 === 1) || U.slice(1).every((v) => Math.abs(v) % 2 === 1), "impairs"]], vals: [...U.slice(1), z] }); },
  ];
  const RAISONR = [
    () => { const pool = [
      () => { const a = pk([3, 4, 5]); return [M("-" + a + "^2 = " + a * a), false, M("-" + a + "^2 = -(" + a + " \\cdot " + a + ") = -" + a * a) + " (seul " + a + " est au carré) ; c'est " + M("(-" + a + ")^2 = " + a * a) + "."]; },
      () => { const a = pk([2, 3]), b = pk([4, 5]), c = pk([2, 3]); return [M("(-" + a + ") \\cdot (-" + b + ") \\cdot (-" + c + ") = " + a * b * c), false, "Trois facteurs négatifs : le produit est négatif, " + M("-" + a * b * c) + "."]; },
      () => { const a = pk([5, 7]), b = pk([3, 4]); return [M("-" + a + " - " + b + " = -" + (a - b)), false, "On descend encore : " + M("-" + a + " - " + b + " = -" + (a + b)) + "."]; },
      () => { const a = pk([12, 18, 24]), b = pk([3, 6]); return [M("(-" + a + ") : (-" + b + ") = " + a / b), true, "Deux nombres de même signe : quotient positif."]; },
      () => { const a = pk([2, 3]), b = pk([4, 5]); return [M("(-" + a + ")^3 = -" + a ** 3), true, M("(-" + a + ") \\cdot (-" + a + ") \\cdot (-" + a + ")") + " : trois facteurs négatifs."]; },
      () => { const a = pk([4, 6, 8]), b = pk([2, 3]); return [M(a + " - " + b + " \\cdot (-3) = " + (a - b) * -3), false, "La multiplication d'abord : " + M(a + " - (" + -3 * b + ") = " + (a + 3 * b)) + "."]; },
    ];
      const L = sh(pool).slice(0, 4).map((f) => f()), w = who();
      return X({ id: "rel", lv: 2, titre: "Contrôle les calculs",
        q: w.n + " a fait ces calculs." + tab(["", "calcul"], L.map((x, i) => [String.fromCharCode(65 + i), x[0]])),
        parts: [{ label: "Lesquels sont faux ?", pts: 2 }, { label: "Corrige-les en expliquant la règle utilisée.", pts: 2 }],
        sol: ul([L.some((x) => !x[1]) ? L.map((x, i) => (x[1] ? "" : String.fromCharCode(65 + i))).filter(Boolean).join(", ") + "." : "Aucun.", L.map((x, i) => String.fromCharCode(65 + i) + " : " + (x[1] ? "juste. " : "faux. ") + x[2]).join(" ") ]),
        chk: [[L.length === 4, "4"]], vals: [] }); },
    () => VF({ id: "rel" }, [
      () => ["Le produit de cinq nombres négatifs est négatif.", true, "Les signes « − » se compensent deux à deux ; il en reste un."],
      () => ["Le carré d'un nombre n'est jamais négatif.", true, "Un nombre multiplié par lui-même : deux facteurs de même signe."],
      () => { const a = R.int(3, 9), b = R.int(2, 6); return ["Le résultat de " + M("a - b") + " est toujours plus petit que " + M("a") + ".", false, "Si " + M("b") + " est négatif : " + M(a + " - (-" + b + ") = " + (a + b)) + " > " + a + "."]; },
      () => ["Le quotient de deux nombres négatifs est négatif.", false, M("(-12) : (-4) = 3") + " : même signe, quotient positif."],
      () => ["L'opposé de " + M("-x") + " est toujours positif.", false, "L'opposé de " + M("-x") + " est " + M("x") + ", qui peut être négatif (si " + M("x = -3") + ")."],
    ]),
  ];
  RICH.rel10 = { ids: ["ordgr", "decadd", "decmul", "decdiv", "prio", "reladd", "rel"], label: "Relatifs et décimaux (10e)", ex: EXR, raison: RAISONR, minutes: 45 };

  // ===================== 10e · 2. Aires et périmètres (disque, décomposition, dimension manquante) =====================
  const EXA = [
    () => { let D1, D2, P1, P2, q1, q2; do { D1 = pk([26, 30, 32]); D2 = pk([36, 40, 45]); P1 = pk([14, 15, 16]); P2 = pk([22, 24, 26, 28]); q1 = (P1 / (PI * (D1 / 2) ** 2)) * 100; q2 = (P2 / (PI * (D2 / 2) ** 2)) * 100; } while (Math.abs(q1 - q2) < 0.08);
      const A1 = PI * (D1 / 2) ** 2, A2 = PI * (D2 / 2) ** 2, best = q1 < q2 ? 1 : 2;
      return X({ id: "disque", lv: 1, titre: "Quelle pizza choisir ?",
        q: "Une pizzeria propose une pizza de " + Q(D1, "cm") + " de diamètre à " + chf(P1) + " et une pizza de " + Q(D2, "cm") + " de diamètre à " + chf(P2) + ". Elles ont la même épaisseur et sont livrées en " + pk([20, 30]) + " minutes.",
        parts: [{ label: "Calcule l'aire de chaque pizza (au cm²).", pts: 2 }, { label: "Calcule le prix de 100 cm² pour chaque pizza (au centime).", pts: 2 }, { label: "Quelle pizza est la plus avantageuse ?", pts: 1 }, { label: "Quelle est la longueur du bord de la grande pizza (au cm) ?", pts: 1 }],
        sol: ul([M("\\pi \\cdot " + N(D1 / 2) + "^2 \\approx " + Math.round(A1)) + " cm² et " + M("\\pi \\cdot " + N(D2 / 2) + "^2 \\approx " + Math.round(A2)) + " cm² (rayon = diamètre : 2).", M(P1 + " : " + Math.round(A1) + " \\cdot 100 \\approx " + A(q1, 2)) + " CHF et " + M(P2 + " : " + Math.round(A2) + " \\cdot 100 \\approx " + A(q2, 2)) + " CHF.", "La " + (best === 1 ? "petite" : "grande") + " : 100 cm² y coûtent moins cher. La durée de livraison ne sert à rien.", M("\\pi \\cdot " + D2 + " \\approx " + Math.round(PI * D2)) + " cm."]),
        chk: [[Math.abs(q1 - q2) >= 0.08, "écart"]], vals: [A1, A2, q1, q2, PI * D2] }); },
    () => { const L = pk([80, 85, 90]), r = pk([30, 32, 36]), Pm = 2 * L + 2 * PI * r, Ar = 2 * r * L + PI * r * r, laps = Math.ceil(2000 / Pm);
      const fig = svg(320, 130, "<path d=\"M90 15 L230 15 A50 50 0 0 1 230 115 L90 115 A50 50 0 0 1 90 15 Z\" class=\"f-shape\"/>" + ln(90, 15, 90, 115, "f-line", "stroke-dasharray=\"4 4\"") + ln(230, 15, 230, 115, "f-line", "stroke-dasharray=\"4 4\"") + tx(160, 70, L + " m") + ln(230, 65, 280, 65, "f-accent") + tx(255, 60, r + " m", "f-accent f-txt"), "piste");
      return X({ id: "aire3", lv: 2, titre: "Le stade",
        q: "Le terrain d'un stade est formé d'un rectangle de " + Q(L, "m") + " de long et de deux demi-disques de rayon " + Q(r, "m") + ". La piste qui l'entoure a 8 couloirs.", fig,
        parts: [{ label: "Calcule la longueur du bord du terrain (un tour, au mètre).", pts: 2 }, { label: "Combien de tours complets faut-il faire pour courir au moins 2 km ?", pts: 1 }, { label: "Calcule l'aire du terrain (au m²).", pts: 2 }],
        sol: ul(["Deux longueurs droites et un cercle complet (deux demi-cercles) : " + M("2 \\cdot " + L + " + 2 \\cdot \\pi \\cdot " + r + " \\approx " + Math.round(Pm)) + " m. Le nombre de couloirs ne sert à rien.", M("2000 : " + Math.round(Pm) + " \\approx " + A(2000 / Pm, 2)) + " : " + laps + " tours.", "Rectangle " + M(L + " \\cdot " + 2 * r + " = " + 2 * r * L) + " m² et disque " + M("\\pi \\cdot " + r + "^2 \\approx " + Math.round(PI * r * r)) + " m² : environ " + Math.round(Ar) + " m²."]),
        chk: [[laps * Pm >= 2000 && (laps - 1) * Pm < 2000, "tours"]], vals: [Pm, laps, Ar] }); },
    () => { const b = pk([4, 5, 6]), h = pk([6.5, 7, 8.4]), At = r6((b * h) / 2), B = pk([12, 14, 16]), b2 = pk([7, 8, 9]), h2 = pk([5, 6, 4.5]), Atr = r6(((B + b2) * h2) / 2), [L, Ar] = pk([[12.5, 200], [15, 180], [16, 240], [12.5, 150], [16, 200]]), l = r6(Ar / L);
      return X({ id: "grandmanq", lv: 2, titre: "Retrouver la dimension qui manque",
        q: "Dans chaque situation, on connaît l'aire et on cherche une longueur.",
        parts: [{ label: "La voile triangulaire d'un dériveur a une aire de " + Q(At, "m^2") + " et une base de " + Q(b, "m") + ". Quelle est sa hauteur ?", pts: 2 }, { label: "Une plate-bande en forme de trapèze a une aire de " + Q(Atr, "m^2") + " ; ses bases mesurent " + Q(B, "m") + " et " + Q(b2, "m") + ". Quelle est sa hauteur ?", pts: 2 }, { label: "Un terrain rectangulaire de " + Q(Ar, "m^2") + " a une longueur de " + Q(L, "m") + ". Quelle est sa largeur ? Et son périmètre ?", pts: 2 }],
        sol: ul([M("A = \\frac{b \\cdot h}{2}") + ", donc " + M("h = \\frac{2A}{b} = \\frac{2 \\cdot " + N(At) + "}{" + b + "} = " + N(h)) + " m.", M("A = \\frac{(B + b) \\cdot h}{2}") + ", donc " + M("h = \\frac{2 \\cdot " + N(Atr) + "}{" + B + " + " + b2 + "} = " + N(h2)) + " m.", M("l = " + Ar + " : " + N(L) + " = " + N(l)) + " m ; " + M("P = 2 \\cdot (" + N(L) + " + " + N(l) + ") = " + N(r6(2 * (L + l)))) + " m."]),
        chk: [[Math.abs((2 * At) / b - h) < 1e-9 && Math.abs((2 * Atr) / (B + b2) - h2) < 1e-9, "inverses"], [Math.abs(l * 100 - Math.round(l * 100)) < 1e-6, "largeur au cm"]], vals: [h, h2, l, 2 * (L + l)] }); },
    () => { const r = pk([4, 5, 6]), Lc = pk([40, 50, 60]), A1 = PI * r * r, rc = Lc / (2 * PI), Ac = PI * rc * rc;
      const fig = svg(320, 170, "<path d=\"M160 85 L160 25 A60 60 0 1 0 220 85 Z\" class=\"f-fill2\"/>" + "<rect x=\"160\" y=\"25\" width=\"110\" height=\"60\" class=\"f-shape2\"/>" + tx(215, 60, "grange") + "<circle cx=\"160\" cy=\"85\" r=\"3.5\" class=\"f-dot\"/>" + ln(160, 85, 118, 127, "f-accent") + tx(128, 98, r + " m", "f-accent f-txt", "end"), "chien attaché");
      return X({ id: "disque", lv: 3, titre: "Le chien attaché",
        q: "Un chien est attaché par une laisse de " + Q(r, "m") + ".", fig,
        parts: [{ label: "Il est attaché à un piquet au milieu d'un pré. Quelle aire peut-il atteindre (au m²) ?", pts: 1 }, { label: "Il est attaché au pied d'un long mur droit. Quelle aire peut-il atteindre ?", pts: 1 }, { label: "Il est attaché à l'angle extérieur d'une grange (voir figure ; les côtés de la grange sont plus longs que la laisse). Quelle aire peut-il atteindre ?", pts: 2 }, { label: "Avec " + Q(Lc, "m") + " de grillage, on fait un enclos circulaire. Quel est son rayon (au cm) ? Son aire (au m²) ?", pts: 2 }],
        sol: ul(["Un disque : " + M("\\pi \\cdot " + r + "^2 \\approx " + A(A1, 1)) + " m², soit environ " + Math.round(A1) + " m².", "Un demi-disque : " + M("\\frac{\\pi \\cdot " + r + "^2}{2} \\approx " + Math.round(A1 / 2)) + " m².", "Trois quarts de disque (la grange occupe un quart) : " + M("\\frac{3}{4} \\cdot \\pi \\cdot " + r + "^2 \\approx " + Math.round((3 * A1) / 4)) + " m².", M("2 \\pi r = " + Lc) + ", donc " + M("r = " + Lc + " : (2\\pi) \\approx " + A(rc, 2)) + " m ; aire " + M("\\approx " + Math.round(Ac)) + " m²."]),
        chk: [[Math.abs(2 * PI * rc - Lc) < 1e-9, "rayon"]], vals: [A1, A1 / 2, (3 * A1) / 4, rc, Ac] }); },
  ];
  const RAISONA = [
    () => VF({ id: "disque" }, [
      () => { const r = pk([2, 3, 5]); return ["Si on double le rayon d'un disque, son aire double.", false, "Elle est multipliée par 4 : " + M("\\pi \\cdot " + 2 * r + "^2 = 4 \\cdot \\pi \\cdot " + r + "^2") + "."]; },
      () => ["Si on double le rayon d'un cercle, sa longueur double.", true, M("2\\pi \\cdot (2r) = 2 \\cdot (2\\pi r)") + "."],
      () => { const r = pk([3, 4, 5]); return ["Le périmètre d'un demi-disque de rayon " + r + " cm est " + M("\\pi \\cdot " + r) + " cm.", false, "Il faut ajouter le diamètre : " + M("\\pi \\cdot " + r + " + " + 2 * r + " \\approx " + A(PI * r + 2 * r, 2)) + " cm."]; },
      () => ["Un carré de côté 2 cm a une aire plus grande que le disque de rayon 1 cm qu'il contient.", true, "4 cm² contre " + M("\\pi \\approx 3{,}14") + " cm²."],
      () => ["La longueur d'un cercle est un peu plus de 3 fois son diamètre.", true, M("L = \\pi \\cdot d") + " et " + M("\\pi \\approx 3{,}14") + "."],
    ]),
    () => { const d = pk([10, 12, 14, 20]), w = who(), wr = PI * d * d, rt = PI * (d / 2) ** 2;
      return X({ id: "disque", lv: 2, titre: "Trouve l'erreur",
        q: "Une table ronde a un diamètre de " + Q(d, "dm") + ". " + w.n + " calcule son aire : " + M("\\pi \\cdot " + d + "^2 \\approx " + A(wr, 1)) + " dm².",
        parts: [{ label: "Quelle est son erreur ? Comment pouvait-" + w.il + " voir que le résultat est trop grand ?", pts: 2 }, { label: "Calcule l'aire correcte.", pts: 1 }],
        sol: ul([w.Il + " a utilisé le diamètre au lieu du rayon. Contrôle : la table tient dans un carré de " + d + " dm de côté, d'aire " + d * d + " dm² ; son aire ne peut pas dépasser " + d * d + " dm².", M("r = " + d / 2) + " dm et " + M("\\pi \\cdot " + d / 2 + "^2 \\approx " + A(rt, 1)) + " dm² (4 fois moins)."]),
        chk: [[Math.abs(wr / rt - 4) < 1e-9, "facteur 4"]], vals: [rt] }); },
  ];
  RICH.aire10 = { ids: ["aire3", "disque", "grandmanq"], label: "Aires et périmètres (10e)", ex: EXA, raison: RAISONA, minutes: 45 };

  // ===================== 10e · 3. Écriture fractionnaire =====================
  const EXF = [
    () => { const [f1, f2] = pk([[[3, 5], [2, 3]], [[3, 4], [2, 5]], [[2, 3], [3, 8]], [[5, 6], [3, 5]], [[4, 7], [3, 4]]]), base = f1[1] * f2[1], k = Math.ceil(240 / base) + R.int(0, 2), Nn = base * k;
      const ff = fmul(f1, f2), nf = (Nn * ff[0]) / ff[1], fn = fmul(f1, fsub([1, 1], f2)), nn = (Nn * fn[0]) / fn[1];
      return X({ id: "fracmul", lv: 1, titre: "Le sport au collège",
        q: "Un collège compte " + N(Nn) + " élèves. " + M(ft(f1)) + " des élèves pratiquent un sport en club, et parmi eux, " + M(ft(f2)) + " jouent au football. Les autres sportifs font de la natation.",
        parts: [{ label: "Quelle fraction des élèves du collège joue au football ?", pts: 2 }, { label: "Combien d'élèves cela représente-t-il ?", pts: 1 }, { label: "Quelle fraction des élèves du collège fait de la natation ? Combien d'élèves ?", pts: 2 }],
        sol: ul([M(ft(f2) + " \\text{ de } " + ft(f1) + " = " + ft(f2) + " \\cdot " + ft(f1) + " = " + ft(ff)) + ".", M(ft(ff) + " \\cdot " + N(Nn) + " = " + N(nf)) + " élèves.", M(ft(fsub([1, 1], f2)) + " \\cdot " + ft(f1) + " = " + ft(fn)) + ", soit " + M(ft(fn) + " \\cdot " + N(Nn) + " = " + N(nn)) + " élèves."]),
        chk: [[Number.isInteger(nf) && Number.isInteger(nn), "entiers"], [Math.abs(nf + nn - (Nn * f1[0]) / f1[1]) < 1e-9, "somme"]], vals: [fv(ff), nf, fv(fn), nn] }); },
    () => { const [F3, Ar0] = pk([[[[1, 4], [1, 3], [1, 8]], 24], [[[2, 5], [1, 4], [1, 10]], 20], [[[1, 6], [3, 8], [1, 4]], 24], [[[2, 9], [1, 3], [1, 12]], 36], [[[3, 10], [1, 4], [1, 6]], 60]]), k = Math.ceil(300 / Ar0) + R.int(0, 6), Ar = Ar0 * k, S = F3.reduce((s, f) => fadd(s, f), [0, 1]), po = fsub([1, 1], S), D = F3.reduce((m, f) => lcm(m, f[1]), 1);
      const parts = ["potager", "fleurs", "gazon"], ar = F3.map((f) => (Ar * f[0]) / f[1]), ap = (Ar * po[0]) / po[1];
      return X({ id: "fracadd", lv: 2, titre: "Le jardin partagé",
        q: "Un jardin partagé de " + Q(Ar, "m^2") + " est divisé ainsi : " + parts.map((p, i) => M(ft(F3[i])) + (p === "fleurs" ? " pour les " : " pour le ") + p).join(", ") + " ; le reste est une mare.",
        parts: [{ label: "Quel dénominateur commun (le plus petit) peut-on utiliser ? Justifie (PPMC).", pts: 1 }, { label: "Quelle fraction du jardin occupe la mare ?", pts: 2 }, { label: "Calcule l'aire de chaque partie.", pts: 2 }, { label: "Les fleurs et le gazon ensemble occupent-ils plus que le potager et la mare ensemble ?", pts: 1 }],
        sol: ul([M("\\text{PPMC}(" + F3.map((f) => f[1]).join(" ; ") + ") = " + D) + ".", M("1 - \\left(" + F3.map((f) => "\\frac{" + f[0] * (D / f[1]) + "}{" + D + "}").join(" + ") + "\\right) = " + ft(po)) + ".", parts.map((p, i) => p + " " + N(ar[i])).join(" m², ") + " m², mare " + N(ap) + " m² (total " + N(Ar) + " m²).", M(N(ar[1] + ar[2]) + (ar[1] + ar[2] > ar[0] + ap ? " > " : " < ") + N(ar[0] + ap)) + " : " + (ar[1] + ar[2] > ar[0] + ap ? "oui." : "non.")]),
        chk: [[ar.every(Number.isInteger) && Number.isInteger(ap) && ar.reduce((a, b) => a + b, 0) + ap === Ar, "aires"], [ar[1] + ar[2] !== ar[0] + ap, "comparaison"]], vals: [D, fv(po), ...ar, ap] }); },
    () => { const items = sh([["veste", pk([120, 150, 90])], ["baskets", pk([80, 110, 140])], ["sac", pk([60, 45, 75])], ["montre", pk([200, 160, 180])]]), pc = sh([10, 15, 20, 25, 30, 40]).slice(0, 4), so = items.map((x, i) => r6(x[1] * (1 - pc[i] / 100))), eco = r6(items.reduce((s, x, i) => s + x[1] - so[i], 0));
      const rows = items.map((x, i) => [x[0], i === 3 ? "?" : chf(x[1]), i === 2 ? "?" : pc[i] + " %", i < 2 ? "?" : chf(so[i])]);
      return X({ id: "pct", lv: 2, titre: "Les soldes",
        q: "Un magasin affiche ses soldes. Complète le tableau." + tab(["article", "prix initial", "rabais", "prix soldé"], rows),
        parts: [{ label: "Calcule le prix soldé de la " + items[0][0] + " et des " + items[1][0] + ".", pts: 2 }, { label: "Calcule le rabais (en %) sur le " + items[2][0] + ".", pts: 1 }, { label: "Retrouve le prix initial de la " + items[3][0] + ".", pts: 2 }, { label: "Combien économise-t-on en achetant les quatre articles ?", pts: 1 }],
        sol: ul([M(items[0][1] + " \\cdot " + N(1 - pc[0] / 100) + " = " + N(so[0])) + " CHF ; " + M(items[1][1] + " \\cdot " + N(1 - pc[1] / 100) + " = " + N(so[1])) + " CHF.", "Rabais : " + M(items[2][1] + " - " + N(so[2]) + " = " + N(r6(items[2][1] - so[2]))) + " CHF ; " + M(N(r6(items[2][1] - so[2])) + " : " + items[2][1] + " = " + N(pc[2] / 100) + " = " + pc[2] + "\\,\\%") + ".", "Le prix soldé vaut " + M(N(1 - pc[3] / 100)) + " du prix initial : " + M(N(so[3]) + " : " + N(1 - pc[3] / 100) + " = " + items[3][1]) + " CHF (et non " + N(so[3]) + " + " + pc[3] + " %).", "Économie : " + M(N(eco)) + " CHF."]),
        chk: [[Math.abs(so[3] / (1 - pc[3] / 100) - items[3][1]) < 1e-9, "inverse"]], vals: [...so, pc[2], items[3][1], eco] }); },
    () => { let v, g, q; do { v = pk([[3, 2], [9, 4], [5, 2], [7, 4], [4, 3]]); g = pk([[1, 5], [3, 10], [1, 4], [3, 8], [2, 5], [1, 6]]); q = fdiv(v, g); } while (q[1] === 1 || fv(q) < 3 || fv(q) > 12);
      const n = Math.floor(fv(q)), rem = fsub(v, fmul([n, 1], g)), part = fsub(q, [n, 1]), nb = Math.ceil((25 * fv(g)) / fv(v) - 1e-9), w = who();
      return X({ id: "fracops", lv: 3, titre: "Le sirop",
        q: "Pour la fête de la classe, " + w.n + " prépare des bouteilles de " + M(ft(v)) + " L de sirop dilué. Un verre contient " + M(ft(g)) + " L.",
        parts: [{ label: "Combien de verres peut-on remplir avec une bouteille ? Écris le calcul avec des fractions.", pts: 2 }, { label: "Combien de verres <b>pleins</b> ? Quelle quantité reste-t-il dans la bouteille (fraction de litre) ?", pts: 2 }, { label: "Combien de bouteilles faut-il pour servir 25 verres ?", pts: 1 }],
        sol: ul([M(ft(v) + " : " + ft(g) + " = " + ft(v) + " \\cdot \\frac{" + g[1] + "}{" + g[0] + "} = " + ft(q)) + " " + M("\\approx " + A(fv(q), 2)) + " verres.", n + " verres pleins ; il reste " + M(ft(v) + " - " + n + " \\cdot " + ft(g) + " = " + ft(rem)) + " L (soit " + M(ft(part)) + " de verre).", M("25 \\cdot " + ft(g) + " = " + ft(fmul([25, 1], g))) + " L ; " + M(ft(fmul([25, 1], g)) + " : " + ft(v) + " \\approx " + A((25 * fv(g)) / fv(v), 2)) + " : " + nb + " bouteilles."]),
        chk: [[Math.abs(fv(rem) - fv(part) * fv(g)) < 1e-9 && fv(rem) > 0, "reste"], [nb * fv(v) >= 25 * fv(g), "bouteilles"]], vals: [fv(q), n, fv(rem), nb] }); },
  ];
  const RAISONF = [
    () => { const [a, b] = pk([[2, 3], [3, 4], [5, 6], [3, 5]]), [c, d] = pk([[4, 5], [2, 7], [3, 8]]), w = who(), wr = fr(a * c, b * d), rt = fdiv([a, b], [c, d]);
      return X({ id: "fracmul", lv: 2, titre: "Trouve l'erreur",
        q: w.n + " écrit : " + M("\\frac{" + a + "}{" + b + "} : \\frac{" + c + "}{" + d + "} = \\frac{" + a * c + "}{" + b * d + "}") + ".",
        parts: [{ label: "Quelle est son erreur ?", pts: 1 }, { label: "Calcule correctement et simplifie.", pts: 1 }, { label: "Contrôle : le résultat doit-il être plus grand ou plus petit que " + M("\\frac{" + a + "}{" + b + "}") + " ? Pourquoi ?", pts: 1 }],
        sol: ul([w.Il + " a multiplié au lieu de diviser. Diviser par une fraction, c'est multiplier par son inverse.", M("\\frac{" + a + "}{" + b + "} \\cdot \\frac{" + d + "}{" + c + "} = \\frac{" + a * d + "}{" + b * c + "} = " + ft(rt)) + ".", "Plus grand : on divise par un nombre plus petit que 1 (dans " + M("\\frac{" + a + "}{" + b + "}") + ", il y a plus d'une fois " + M("\\frac{" + c + "}{" + d + "}") + ")."]),
        chk: [[fv(rt) > a / b && fv(wr) !== fv(rt), "contrôle"]], vals: [fv(rt)] }); },
    () => VF({ id: "pct" }, [
      () => { const p = pk([100, 200, 80]); return ["Une hausse de 10 % suivie d'une baisse de 10 % ramène au prix de départ.", false, p + " → " + N(p * 1.1) + " → " + N(r6(p * 1.1 * 0.9)) + " : on obtient 99 % du prix de départ."]; },
      () => { const [a, b] = pk([[25, 80], [20, 50], [40, 75]]); return [a + " % de " + b + " est égal à " + b + " % de " + a + ".", true, M("\\frac{" + a + "}{100} \\cdot " + b + " = \\frac{" + b + "}{100} \\cdot " + a + " = " + N((a * b) / 100)) + "."]; },
      () => ["Diviser par " + M("\\frac{1}{2}") + " revient à multiplier par 2.", true, "L'inverse de " + M("\\frac{1}{2}") + " est 2."],
      () => [M("\\frac{3}{4}") + " de " + M("\\frac{2}{3}") + " vaut " + M("\\frac{1}{2}") + ".", true, M("\\frac{3}{4} \\cdot \\frac{2}{3} = \\frac{6}{12} = \\frac{1}{2}") + "."],
      () => [M("\\frac{1}{2} + \\frac{1}{3} = \\frac{2}{5}") + ".", false, M("\\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}") + "."],
      () => { const n = pk([84, 90, 126]); return ["Le PGDC de deux nombres divise toujours leur PPMC.", true, "Ex. : " + M("\\text{PGDC}(12 ; " + n + ") = " + g2(12, n)) + " et " + M("\\text{PPMC} = " + lcm(12, n) + " = " + g2(12, n) + " \\cdot " + lcm(12, n) / g2(12, n)) + "."]; },
    ]),
  ];
  RICH.frac10 = { ids: ["premiers", "arith", "fracrep", "fracsimp", "fracconv", "fracper", "fractout", "fracadd", "fracmul", "fracops", "pct"], label: "Écriture fractionnaire (10e)", ex: EXF, raison: RAISONF, minutes: 45 };

  // ===================== 10e · 4. 3D : espace, grandeurs et mesures =====================
  const EXS = [
    () => { const r = pk([3.5, 4, 3.8]), h = pk([11, 12, 10.5]), V = PI * r * r * h, Al = 2 * PI * r * h, nb = Math.ceil(2000 / V - 1e-9);
      return X({ id: "vol", lv: 1, titre: "La boîte de conserve",
        q: "Une boîte de conserve est un cylindre de " + Q(r, "cm") + " de rayon et " + Q(h, "cm") + " de haut. Elle coûte " + chf(pk([2.4, 3.1, 1.95])) + ".", fig: FIG.cylinder(fmt(r) + " cm", fmt(h) + " cm"),
        parts: [{ label: "Calcule son volume en cm³ (au cm³).", pts: 1 }, { label: "Combien de centilitres contient-elle ?", pts: 1 }, { label: "Calcule l'aire de l'étiquette qui fait tout le tour (aire latérale).", pts: 2 }, { label: "Combien de boîtes faut-il pour avoir au moins 2 L de soupe ?", pts: 1 }],
        sol: ul([M("V = \\pi \\cdot " + N(r) + "^2 \\cdot " + N(h) + " \\approx " + Math.round(V)) + " cm³. Le prix ne sert à rien.", M(Math.round(V) + u("cm^3") + " = " + Math.round(V) + u("mL") + " \\approx " + A(V / 10, 1) + u("cL")) + ".", "L'étiquette déroulée est un rectangle de " + M("2\\pi \\cdot " + N(r)) + " cm sur " + N(h) + " cm : " + M("\\approx " + A(Al, 1)) + " cm².", M("2000 : " + Math.round(V) + " \\approx " + A(2000 / V, 2)) + " : " + nb + " boîtes."]),
        chk: [[nb * V >= 2000, "boîtes"]], vals: [V, V / 10, Al, nb] }); },
    () => { const b = pk([1.6, 1.8, 2]), ht = pk([1.2, 1.5]), L = pk([2.2, 2.4]), s = Math.round(Math.sqrt((b / 2) ** 2 + ht * ht) * 100) / 100, V = r6(((b * ht) / 2) * L), toile = r6(b * ht + 2 * s * L), sol = r6(b * L);
      const fig = svg(300, 160, pg([[40, 140], [140, 140], [90, 40]], "f-shape") + pg([[140, 140], [250, 110], [200, 10], [90, 40]], "f-shape2") + ln(90, 40, 90, 140, "f-accent", "stroke-dasharray=\"5 4\"") + tx(90, 156, fmt(b) + " m") + tx(84, 95, fmt(ht) + " m", "f-accent f-txt", "end") + tx(205, 138, fmt(L) + " m") + tx(160, 70, fmt(s) + " m", "f-txt", "middle", 12), "tente");
      return X({ id: "airelat", lv: 2, titre: "La tente",
        q: "Une tente a la forme d'un prisme droit couché. Sa face avant est un triangle isocèle de base " + Q(b, "m") + " et de hauteur " + Q(ht, "m") + " ; chaque pan du toit mesure " + Q(s, "m") + " de large ; la tente a " + Q(L, "m") + " de long.", fig,
        parts: [{ label: "Calcule le volume d'air dans la tente.", pts: 2 }, { label: "Calcule l'aire de toile (deux triangles et deux pans, sans le sol).", pts: 2 }, { label: "Le tapis de sol est un rectangle. Quelle est son aire ?", pts: 1 }],
        sol: ul(["Base du prisme : " + M("\\frac{" + N(b) + " \\cdot " + N(ht) + "}{2} = " + N((b * ht) / 2)) + " m² ; " + M("V = " + N((b * ht) / 2) + " \\cdot " + N(L) + " = " + N(V)) + " m³.", "Triangles : " + M("2 \\cdot " + N((b * ht) / 2) + " = " + N(b * ht)) + " m² ; pans : " + M("2 \\cdot " + N(s) + " \\cdot " + N(L) + " = " + N(r6(2 * s * L))) + " m² ; total " + Q(toile, "m^2") + ".", M(N(b) + " \\cdot " + N(L) + " = " + N(sol)) + " m²."]),
        chk: [[s > ht && s > b / 2, "pan"]], vals: [V, toile, sol] }); },
    () => { const w = pk([8, 10, 12]), L1 = pk([10, 12, 15]), h1 = pk([0.8, 1, 1.2]), L2 = pk([10, 13, 15]), h2 = pk([1.8, 2, 2.2]), q = pk([300, 400, 500]), V = r6(w * (L1 * h1 + L2 * h2)), Lt = V * 1000, min = Lt / q;
      const s = 220 / (L1 + L2), y0 = 25, fig = svg(320, 120, pg([[30, y0], [30 + (L1 + L2) * s, y0], [30 + (L1 + L2) * s, y0 + h2 * 35], [30 + L1 * s, y0 + h2 * 35], [30 + L1 * s, y0 + h1 * 35], [30, y0 + h1 * 35]]) + tx(30 + (L1 * s) / 2, y0 - 6, L1 + " m") + tx(30 + L1 * s + (L2 * s) / 2, y0 - 6, L2 + " m") + tx(26, y0 + (h1 * 35) / 2 + 4, fmt(h1) + " m", "f-txt", "end") + tx(34 + (L1 + L2) * s, y0 + (h2 * 35) / 2 + 4, fmt(h2) + " m", "f-txt", "start"), "piscine vue de côté");
      return X({ id: "voldecomp", lv: 2, titre: "La piscine à deux profondeurs",
        q: "Voici une piscine vue de côté : une partie peu profonde et une partie profonde. Elle mesure " + Q(w, "m") + " de large.", fig,
        parts: [{ label: "Calcule le volume de la piscine en m³ (décompose-la en deux pavés).", pts: 2 }, { label: "Combien de litres d'eau faut-il pour la remplir ?", pts: 1 }, { label: "Une pompe débite " + q + " L par minute. Combien de temps faut-il pour la remplir (en h et min) ?", pts: 2 }],
        sol: ul([M(L1 + " \\cdot " + w + " \\cdot " + N(h1) + " + " + L2 + " \\cdot " + w + " \\cdot " + N(h2) + " = " + N(r6(L1 * w * h1)) + " + " + N(r6(L2 * w * h2)) + " = " + N(V)) + " m³.", M(N(V) + u("m^3") + " = " + N(Lt) + u("L")) + " (1 m³ = 1000 L).", M(N(Lt) + " : " + q + " = " + N(min)) + " min, soit environ " + dur(Math.round(min)) + "."]),
        chk: [[Math.abs(V - w * L1 * h1 - w * L2 * h2) < 1e-9, "volume"]], vals: [V, Lt, min] }); },
    () => { const C = pk([3000, 5000, 8000]), d = pk([1.6, 2, 2.4]), Ab = PI * (d / 2) ** 2, h = C / 1000 / Ab, x = Math.round(h * pk([0.4, 0.6, 0.75]) * 10) / 10, Vx = Ab * x * 1000, gl = (C * 10) / 2.5;
      return X({ id: "vol", lv: 3, titre: "La citerne",
        q: "Une citerne d'eau de pluie est un cylindre de " + Q(d, "m") + " de diamètre. Elle peut contenir " + Q(C, "L") + ".",
        parts: [{ label: "Calcule l'aire de la base de la citerne (au centième de m²).", pts: 1 }, { label: "Calcule sa hauteur (au cm).", pts: 2 }, { label: "L'eau atteint " + Q(x, "m") + " de haut. Combien de litres contient-elle (au litre) ?", pts: 1 }, { label: "Combien de verres de " + Q(2.5, "dL") + " pourrait-on remplir avec la citerne pleine ?", pts: 1 }],
        sol: ul([M("\\pi \\cdot " + N(d / 2) + "^2 \\approx " + A(Ab, 2)) + " m².", M(C + u("L") + " = " + N(C / 1000) + u("m^3")) + " ; " + M("h = V : A_{\\text{base}} = " + N(C / 1000) + " : " + A(Ab, 4) + " \\approx " + A(h, 2)) + " m.", M(A(Ab, 4) + " \\cdot " + N(x) + " \\approx " + A(Ab * x, 4)) + " m³, soit environ " + N(Math.round(Vx)) + " L.", M(N(C) + u("L") + " = " + N(C * 10) + u("dL")) + " ; " + M(N(C * 10) + " : 2{,}5 = " + N(gl)) + " verres."]),
        chk: [[Math.abs(Ab * h * 1000 - C) < 1e-6, "hauteur"], [x < h, "niveau"]], vals: [Ab, h, Vx, gl] }); },
  ];
  const RAISONS = [
    () => { const pool = [
      () => { const a = pk([2, 3, 0.5]); return [N(a) + " m³ = " + N(a * 100) + " L", false, N(a) + " m³ = " + N(a * 1000) + " L (1 m³ = 1000 dm³ = 1000 L)"]; },
      () => { const a = pk([4, 7, 12]); return [a + " dm³ = " + a + " L", true, "1 L = 1 dm³"]; },
      () => { const a = pk([250, 330, 750]); return [a + " cm³ = " + N(a / 100) + " L", false, a + " cm³ = " + N(a / 1000) + " L (1 L = 1000 cm³)"]; },
      () => { const a = pk([1.5, 2.4, 3]); return [N(a) + " m³ = " + N(a * 1000) + " dm³", true, "1 m³ = 10 dm · 10 dm · 10 dm = 1000 dm³"]; },
      () => { const a = pk([3.5, 2.2]); return [N(a) + " dL = " + N(a * 100) + " cm³", true, "1 dL = 0,1 L = 100 cm³"]; },
      () => { const a = pk([2, 5]); return [a + " m³ = " + a * 100 + " dm³", false, a + " m³ = " + a * 1000 + " dm³ (trois dimensions : 10 · 10 · 10)"]; },
    ];
      const L = sh(pool).slice(0, 4).map((f) => f()), w = who();
      return X({ id: "uvol", lv: 2, titre: "Trouve les erreurs",
        q: w.n + " a fait ces conversions." + tab(["", "conversion"], L.map((x, i) => [String.fromCharCode(65 + i), x[0]])),
        parts: [{ label: "Lesquelles sont fausses ?", pts: 2 }, { label: "Corrige-les en expliquant.", pts: 2 }],
        sol: ul([L.some((x) => !x[1]) ? L.map((x, i) => (x[1] ? "" : String.fromCharCode(65 + i))).filter(Boolean).join(", ") + "." : "Aucune.", L.map((x, i) => String.fromCharCode(65 + i) + " : " + (x[1] ? "juste, " : "faux, ") + x[2]).join(" ; ") + "."]),
        chk: [[L.length === 4, "4"]], vals: [] }); },
    () => VF({ id: "solides" }, [
      () => { const n = pk([5, 6, 8]); return ["Un prisme dont la base a " + n + " côtés a " + (n + 2) + " faces.", true, n + " faces latérales + 2 bases."]; },
      () => ["Si on double le rayon d'un cylindre, son volume double.", false, "Il est multiplié par 4 (le rayon est au carré dans " + M("\\pi r^2 h") + ")."],
      () => ["Si on double la hauteur d'un cylindre, son volume double.", true, M("\\pi r^2 \\cdot (2h) = 2 \\cdot \\pi r^2 h") + "."],
      () => ["Un cylindre est un prisme.", false, "Sa base est un disque, pas un polygone (mais on calcule son volume de la même façon : aire de la base · hauteur)."],
      () => ["Deux solides de même volume ont la même aire totale.", false, "Un cube de 2 cm (24 cm²) et un pavé 1 × 1 × 8 (34 cm²) ont tous deux 8 cm³."],
    ]),
  ];
  RICH.sol10 = { ids: ["uvol", "solides", "vol", "airelat", "voldecomp"], label: "Solides et volumes (10e)", ex: EXS, raison: RAISONS, minutes: 45 };

  // ===================== 10e · 10. Proportionnalité (échelles, pourcentages, pentes) =====================
  const sc = (n) => "1\\,:\\," + N(n);
  const EXP = [
    () => { const E = pk([25000, 50000]), dm = pk([8.4, 6.2, 11.6]), real = r6((dm * E) / 100000), rk = pk([3.5, 4.5, 2.8]), mc = r6((rk * 100000) / E), [c2, k2] = pk([[4, 1], [2, 1], [3, 1.5]]), E2 = (k2 * 100000) / c2, t = Math.round((real / 4) * 60);
      return X({ id: "echelle", lv: 1, titre: "La carte de randonnée",
        q: "Sur une carte à l'échelle " + M(sc(E)) + ", on prépare une randonnée. On marche à environ " + Q(4, "km/h") + ".",
        parts: [{ label: "Que signifie cette échelle ?", pts: 1 }, { label: "Sur la carte, le chemin jusqu'au lac mesure " + Q(dm, "cm") + ". Quelle est la distance réelle en km ? Combien de temps faut-il pour la parcourir ?", pts: 2 }, { label: "Le refuge est à " + Q(rk, "km") + " à vol d'oiseau. À quelle distance est-il sur la carte ?", pts: 1 }, { label: "Sur une autre carte, " + Q(c2, "cm") + " représentent " + Q(k2, "km") + ". Quelle est son échelle ?", pts: 1 }],
        sol: ul(["1 cm sur la carte représente " + N(E) + " cm = " + N(E / 100000) + " km en réalité.", M(N(dm) + " \\cdot " + N(E) + " = " + N(dm * E)) + " cm = " + Q(real, "km") + " ; " + M(N(real) + " : 4 = " + N(real / 4)) + " h, environ " + dur(t) + ".", M(N(rk * 100000) + " : " + N(E) + " = " + N(mc)) + " cm.", M(N(k2) + u("km") + " = " + N(k2 * 100000) + u("cm")) + " ; " + M(N(k2 * 100000) + " : " + c2 + " = " + N(E2)) + " : échelle " + M(sc(E2)) + "."]),
        chk: [[Math.abs((mc * E) / 100000 - rk) < 1e-9, "inverse"]], vals: [real, mc, E2, t] }); },
    () => { const P = pk([240, 380, 520]), tva = 8.1, ttc = Math.round(P * 1.081 * 100) / 100, s = pk([15, 20, 30]), sold = r6(P * (1 - s / 100)), Qn = pk([150, 200, 250]), orig = Qn / 1.25, dbl = r6(P * 1.2 * 0.8);
      return X({ id: "pctvar", lv: 2, titre: "Prix et pourcentages",
        q: "Un vélo coûte " + chf(P) + " hors taxes. La TVA est de " + M("8{,}1\\,\\%") + ".",
        parts: [{ label: "Quel est son prix TVA comprise ? Par quel nombre multiplie-t-on ?", pts: 2 }, { label: "En solde, le prix hors taxes baisse de " + s + " %. Quel est le nouveau prix hors taxes ?", pts: 1 }, { label: "Après une hausse de 25 %, un casque coûte " + Qn + " CHF. Quel était son prix avant la hausse ?", pts: 2 }, { label: "Le prix hors taxes du vélo augmente de 20 %, puis baisse de 20 %. Revient-il à " + P + " CHF ? Calcule.", pts: 1 }],
        sol: ul([M(P + " \\cdot 1{,}081 \\approx " + Nk(ttc, 2)) + " CHF (100 % + 8,1 % = 108,1 %).", M(P + " \\cdot " + N(1 - s / 100) + " = " + N(sold)) + " CHF.", M(Qn + " : 1{,}25 = " + N(orig)) + " CHF (et non " + Qn + " − 25 %, car les 25 % portaient sur l'ancien prix).", M(P + " \\cdot 1{,}2 \\cdot 0{,}8 = " + P + " \\cdot 0{,}96 = " + N(dbl)) + " CHF : non, il a baissé de 4 %."]),
        chk: [[Math.abs(orig * 1.25 - Qn) < 1e-9, "inverse"], [dbl < P, "baisse"]], vals: [ttc, sold, orig, dbl] }); },
    () => { const p = pk([8, 10, 12, 15]), hz = pk([600, 800, 1200]), up = (p * hz) / 100, rp = 6, cm = pk([36, 45, 54]), lr = cm / rp; let A, B, pa, pb; do { A = [pk([84, 96, 105]), pk([1200, 1400, 1500])]; B = [pk([60, 72, 64]), pk([750, 800, 900])]; pa = (A[0] / A[1]) * 100; pb = (B[0] / B[1]) * 100; } while (Math.abs(pa - pb) < 0.5);
      return X({ id: "pente", lv: 2, titre: "Routes et rampes",
        q: "Une pente de " + M("p\\,\\%") + " signifie qu'on monte de " + M("p") + " m pour 100 m parcourus à l'horizontale.",
        parts: [{ label: "Un panneau indique une pente de " + p + " %. De combien de mètres monte-t-on sur " + hz + " m à l'horizontale ?", pts: 1 }, { label: "Une rampe pour fauteuil roulant ne doit pas dépasser 6 %. Quelle longueur horizontale faut-il pour monter une marche de " + cm + " cm ?", pts: 2 }, { label: "La route A monte de " + A[0] + " m sur " + N(A[1]) + " m à l'horizontale ; la route B monte de " + B[0] + " m sur " + B[1] + " m. Laquelle est la plus raide ?", pts: 2 }],
        sol: ul([M(p + "\\,\\% \\cdot " + hz + " = " + N(up)) + " m.", "6 cm pour 100 cm : " + M(cm + " : 6 \\cdot 100 = " + N((cm / 6) * 100)) + " cm = " + Q((cm / 6), "m") + ".", "A : " + M(A[0] + " : " + N(A[1]) + " = " + N(r6(A[0] / A[1]))) + " = " + N(r6(pa)) + " % ; B : " + M(B[0] + " : " + B[1] + " = " + N(r6(B[0] / B[1]))) + " = " + N(r6(pb)) + " %. La route " + (pa > pb ? "A" : "B") + " est la plus raide."]),
        chk: [[Math.abs(pa - pb) > 0.1, "comparaison"], [lr > 0, "rampe"]], vals: [up, cm / 6, pa, pb] }); },
    () => { const E = pk([50, 100]), a = pk([9, 8, 7.5]), b = pk([7, 6, 5.5]), ra = r6((a * E) / 100), rb = r6((b * E) / 100), Ar = r6(ra * rb), Ap = r6(a * b), k2 = E * E, A2 = pk([20, 24, 18]), ap2 = (A2 * 10000) / k2;
      return X({ id: "echelle", lv: 3, titre: "Le plan de l'appartement",
        q: "Sur un plan à l'échelle " + M(sc(E)) + ", une chambre est un rectangle de " + Q(a, "cm") + " sur " + Q(b, "cm") + ".",
        parts: [{ label: "Quelles sont les dimensions réelles de la chambre, en m ?", pts: 2 }, { label: "Calcule l'aire de la chambre sur le plan (en cm²) et en réalité (en m², puis en cm²).", pts: 2 }, { label: "Par combien les aires sont-elles multipliées ? Compare avec l'échelle.", pts: 1 }, { label: "Le salon mesure " + A2 + " m² en réalité. Quelle aire occupe-t-il sur le plan ?", pts: 1 }],
        sol: ul([M(N(a) + " \\cdot " + E + " = " + N(a * E)) + " cm = " + N(ra) + " m et " + M(N(b) + " \\cdot " + E + " = " + N(b * E)) + " cm = " + N(rb) + " m.", "Plan : " + M(N(a) + " \\cdot " + N(b) + " = " + N(Ap)) + " cm² ; réalité : " + M(N(ra) + " \\cdot " + N(rb) + " = " + N(Ar)) + " m² = " + N(Ar * 10000) + " cm².", M(N(Ar * 10000) + " : " + N(Ap) + " = " + N(k2) + " = " + E + "^2") + " : les longueurs sont multipliées par " + E + ", les aires par " + M(E + "^2") + ".", M(A2 + u("m^2") + " = " + N(A2 * 10000) + u("cm^2")) + " ; " + M(N(A2 * 10000) + " : " + N(k2) + " = " + N(ap2)) + " cm²."]),
        chk: [[Math.abs((Ar * 10000) / Ap - k2) < 1e-6, "rapport des aires"]], vals: [ra, rb, Ap, Ar, k2, ap2] }); },
  ];
  const RAISONP = [
    () => { const p = pk([8, 10, 12]), w = who();
      return X({ id: "pente", lv: 2, titre: "Trouve l'erreur",
        q: w.n + " lit un panneau « " + p + " % » et dit : « sur 1 km à l'horizontale, la route monte de " + p + " m ».",
        parts: [{ label: "Quelle est son erreur ?", pts: 1 }, { label: "De combien la route monte-t-elle vraiment sur 1 km à l'horizontale ?", pts: 1 }, { label: "Quelle serait la pente d'une route qui monte de 1 m pour 1 m à l'horizontale ? Est-elle verticale ?", pts: 1 }],
        sol: ul([p + " % veut dire " + p + " m pour <b>100</b> m, pas pour 1000 m.", M(p + "\\,\\% \\cdot 1000 = " + p * 10) + " m.", "100 % ; elle n'est pas verticale : elle fait un angle de 45° avec l'horizontale."]),
        chk: [[p * 10 !== p, "x10"]], vals: [p * 10] }); },
    () => VF({ id: "pctvar" }, [
      () => { const P = pk([50, 80, 120]); return ["Une hausse de 20 % suivie d'une baisse de 20 % ramène au prix de départ.", false, P + " → " + N(P * 1.2) + " → " + N(r6(P * 0.96)) + " : on perd 4 %."]; },
      () => ["Une baisse de 50 % suivie d'une hausse de 100 % ramène au prix de départ.", true, M("0{,}5 \\cdot 2 = 1") + "."],
      () => ["Sur une carte au " + M(sc(25000)) + ", 4 cm représentent 1 km.", true, M("4 \\cdot 25\\text{'}000 = 100\\text{'}000") + " cm = 1 km."],
      () => ["Une pente de 100 % est verticale.", false, "100 % : on monte de 100 m pour 100 m à l'horizontale, soit un angle de 45°."],
      () => { const p = pk([15, 25, 40]); return ["Augmenter de " + p + " %, c'est multiplier par " + N(1 + p / 100) + ".", true, "100 % + " + p + " % = " + (100 + p) + " % = " + N(1 + p / 100) + "."]; },
    ]),
  ];
  RICH.prop10 = { ids: ["prop", "echelle", "pctvar", "pente"], label: "Proportionnalité (10e)", ex: EXP, raison: RAISONP, minutes: 45 };

  // ===================== 10e · 12. Figures planes (polygones réguliers) =====================
  const NAME = { 5: "pentagone", 6: "hexagone", 8: "octogone", 9: "ennéagone", 10: "décagone", 12: "dodécagone", 15: "pentadécagone", 18: "polygone à 18 côtés" };
  const polyFig = (n, lab) => { const cx = 150, cy = 85, r = 70, P = []; for (let k = 0; k < n; k++) { const a = -PI / 2 + (2 * PI * k) / n; P.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
    return svg(300, 175, pg(P, "f-shape") + ln(cx, cy, P[0][0], P[0][1], "f-accent", "stroke-dasharray=\"4 3\"") + ln(cx, cy, P[1][0], P[1][1], "f-accent", "stroke-dasharray=\"4 3\"") + "<circle cx=\"" + cx + "\" cy=\"" + cy + "\" r=\"3\" class=\"f-dot\"/>" + tx((P[0][0] + P[1][0]) / 2 + 8, (P[0][1] + P[1][1]) / 2 - 4, lab, "f-txt", "start"), NAME[n] || "polygone"); };
  const EXPO = [
    () => { const n = pk([5, 8, 10, 12]), c = pk([4, 4.5, 6, 2.5]), ac = 360 / n, ai = 180 - ac;
      return X({ id: "polyreg", lv: 1, titre: "Le " + NAME[n] + " régulier",
        q: "Un " + NAME[n] + " régulier a " + n + " côtés de " + Q(c, "cm") + ". Son centre est relié à deux sommets voisins.", fig: polyFig(n, fmt(c) + " cm"),
        parts: [{ label: "Calcule l'angle au centre.", pts: 1 }, { label: "Calcule un angle intérieur du " + NAME[n] + ". Explique.", pts: 2 }, { label: "Calcule son périmètre.", pts: 1 }, { label: "Calcule la somme de ses angles intérieurs de deux façons.", pts: 1 }],
        sol: ul([M("360° : " + n + " = " + N(ac) + "°") + ".", "Le triangle centre-côté est isocèle ; ses angles à la base valent " + M("(180° - " + N(ac) + "°) : 2 = " + N(ai / 2) + "°") + " ; l'angle intérieur en vaut deux : " + M(N(ai) + "°") + ".", M(n + " \\cdot " + N(c) + " = " + N(r6(n * c))) + " cm.", M(n + " \\cdot " + N(ai) + "° = " + N(n * ai) + "°") + ", et aussi " + M("(" + n + " - 2) \\cdot 180° = " + (n - 2) * 180 + "°") + "."]),
        chk: [[Math.abs(n * ai - (n - 2) * 180) < 1e-9, "somme"]], vals: [ac, ai, n * c, n * ai] }); },
    () => { const [ac, n1] = pk([[40, 9], [30, 12], [24, 15], [36, 10], [20, 18]]), [ai, n2] = pk([[140, 9], [150, 12], [144, 10], [156, 15], [160, 18]].filter((x) => x[1] !== n1)), [P, c, n3] = pk([[42, 3.5, 12], [63, 7, 9], [37.5, 2.5, 15], [72, 9, 8]]);
      return X({ id: "polyreg", lv: 2, titre: "Retrouve le polygone",
        q: "Dans chaque cas, on cherche le nombre de côtés d'un polygone régulier.",
        parts: [{ label: "Son angle au centre mesure " + M(ac + "°") + ".", pts: 1 }, { label: "Son angle intérieur mesure " + M(ai + "°") + ".", pts: 2 }, { label: "Son périmètre vaut " + Q(P, "cm") + " et un côté mesure " + Q(c, "cm") + ".", pts: 1 }, { label: "Un polygone régulier peut-il avoir un angle au centre de " + M("25°") + " ? Explique.", pts: 1 }],
        sol: ul([M("360 : " + ac + " = " + n1) + " côtés.", "Angle au centre : " + M("180° - " + ai + "° = " + (180 - ai) + "°") + ", puis " + M("360 : " + (180 - ai) + " = " + n2) + " côtés.", M(N(P) + " : " + N(c) + " = " + n3) + " côtés.", "Non : " + M("360 : 25 = 14{,}4") + " n'est pas un nombre entier de côtés."]),
        chk: [[360 / ac === n1 && 360 / (180 - ai) === n2 && Math.abs(P / c - n3) < 1e-9, "inverses"]], vals: [n1, n2, n3] }); },
    () => { const n = pk([6, 8, 10]), c = pk([2.4, 3, 3.6]), ap = Math.round((c / (2 * Math.tan(PI / n))) * 100) / 100, Ar = r6((n * c * ap) / 2), px = pk([85, 110, 95]);
      return X({ id: "polyreg", lv: 2, titre: "Le kiosque",
        q: "Le sol d'un kiosque à musique est un " + NAME[n] + " régulier de côté " + Q(c, "m") + ". La distance du centre au milieu d'un côté (l'apothème) mesure " + Q(ap, "m") + ".", fig: polyFig(n, fmt(c) + " m"),
        parts: [{ label: "En combien de triangles isocèles identiques peut-on découper le sol depuis le centre ? Quelle est l'aire d'un triangle ?", pts: 2 }, { label: "Calcule l'aire du sol.", pts: 1 }, { label: "Le revêtement coûte " + chf(px) + " le m². Quel est le prix (au franc) ?", pts: 1 }, { label: "On pose une guirlande tout autour. Quelle longueur faut-il ?", pts: 1 }],
        sol: ul([n + " triangles de base " + N(c) + " m et de hauteur " + N(ap) + " m : " + M("\\frac{" + N(c) + " \\cdot " + N(ap) + "}{2} = " + N(r6((c * ap) / 2))) + " m².", M(n + " \\cdot " + N(r6((c * ap) / 2)) + " = " + N(Ar)) + " m².", M(N(Ar) + " \\cdot " + px + " \\approx " + N(Math.round(Ar * px))) + " CHF.", M(n + " \\cdot " + N(c) + " = " + N(r6(n * c))) + " m."]),
        chk: [[ap > c / 2, "apothème"]], vals: [(c * ap) / 2, Ar, Ar * px, n * c] }); },
    () => { const L = sh([5, 7, 8, 9, 10, 12]).slice(0, 3).sort((a, b) => a - b), ai = (n) => 180 - 360 / n, tiles = (n) => Number.isInteger(360 / ai(n));
      return X({ id: "polyreg", lv: 3, titre: "Paver le sol",
        q: "Un carreleur veut couvrir un sol avec des carreaux en forme de polygones réguliers, sans trou ni chevauchement. Autour de chaque sommet, les angles des carreaux doivent faire exactement 360°.",
        parts: [{ label: "Calcule l'angle intérieur d'un triangle équilatéral, d'un carré et d'un hexagone régulier. Ces polygones peuvent-ils paver le sol seuls ? Explique.", pts: 2 }, { label: "Même question pour des polygones réguliers à " + L.join(", ") + " côtés.", pts: 2 }, { label: "Montre qu'on peut paver avec deux octogones réguliers et un carré autour de chaque sommet.", pts: 1 }, { label: "Deux pentagones réguliers et un troisième polygone régulier se rencontrent en un sommet. Combien de côtés a ce troisième polygone ?", pts: 1 }],
        sol: ul(["60°, 90°, 120° : " + M("6 \\cdot 60° = 4 \\cdot 90° = 3 \\cdot 120° = 360°") + " : oui pour les trois.", L.map((n) => n + " côtés : " + A(ai(n), 2) + "° ; " + M("360 : " + A(ai(n), 2) + (tiles(n) ? " = " + 360 / ai(n) : " \\approx " + A(360 / ai(n), 2))) + (tiles(n) ? " : oui" : " : non, ce n'est pas un nombre entier")).join(" ; ") + ".", M("2 \\cdot 135° + 90° = 360°") + ".", M("360° - 2 \\cdot 108° = 144°") + " ; " + M("180° - 144° = 36°") + " au centre, donc " + M("360 : 36 = 10") + " côtés : un décagone."]),
        chk: [[L.every((n) => !tiles(n)), "aucun ne pave seul"], [2 * ai(5) + ai(10) === 360, "décagone"]], vals: L.map(ai) }); },
  ];
  const RAISONPO = [
    () => VF({ id: "polyreg" }, [
      () => ["Un polygone dont tous les côtés ont la même longueur est régulier.", false, "Un losange (non carré) a quatre côtés égaux mais des angles différents."],
      () => ["Un carré est un polygone régulier.", true, "Côtés égaux et angles égaux (90°)."],
      () => ["Plus un polygone régulier a de côtés, plus ses angles intérieurs sont grands.", true, "L'angle au centre " + M("360° : n") + " diminue, donc " + M("180° - \\frac{360°}{n}") + " augmente."],
      () => ["Un polygone régulier peut avoir un angle intérieur de 100°.", false, "Il faudrait un angle au centre de 80° et " + M("360 : 80 = 4{,}5") + " côtés : impossible."],
      () => ["Tous les sommets d'un polygone régulier sont sur un même cercle.", true, "Ils sont tous à la même distance du centre."],
    ]),
    () => { const n = pk([5, 8, 9, 10, 12]), w = who();
      return X({ id: "polyreg", lv: 2, titre: "Trouve l'erreur",
        q: w.n + " affirme : « l'angle intérieur d'un " + NAME[n] + " régulier vaut " + M("360° : " + n + " = " + N(360 / n) + "°") + " ».",
        parts: [{ label: "Quel angle " + w.n + " a-t-" + w.il + " calculé ?", pts: 1 }, { label: "Calcule l'angle intérieur. Contrôle avec la somme des angles.", pts: 2 }],
        sol: ul(["L'angle au centre.", M("180° - " + N(360 / n) + "° = " + N(180 - 360 / n) + "°") + " ; contrôle : " + M(n + " \\cdot " + N(180 - 360 / n) + "° = " + N(n * (180 - 360 / n)) + "° = (" + n + " - 2) \\cdot 180°") + "."]),
        chk: [[Math.abs(n * (180 - 360 / n) - (n - 2) * 180) < 1e-9, "somme"]], vals: [180 - 360 / n] }); },
  ];
  RICH.poly10 = { ids: ["polyreg"], label: "Figures planes (10e)", ex: EXPO, raison: RAISONPO, minutes: 45 };

  // ===================== 10e · 13. Transformations du plan (agrandissements, rotations) =====================
  const pt = (L, x, y) => M(L + "(" + N(x) + " \\,;\\, " + N(y) + ")");
  const nz = (a, b) => { let v; do v = R.int(a, b); while (Math.abs(v) < 2); return v; };
  const EXT = [
    () => { const n = pk([12, 16, 18, 20, 24]), a = 360 / n, k = R.int(3, n / 2 - 1), Tm = pk([12, 16, 20]), m = R.int(n / 2 + 1, n - 2);
      return X({ id: "rotation", lv: 1, titre: "La grande roue",
        q: "Une grande roue porte " + n + " cabines régulièrement espacées, numérotées de 1 à " + n + " dans le sens de rotation. Elle fait un tour complet en " + Tm + " minutes. Un billet coûte " + pk([8, 10, 12]) + " CHF.",
        parts: [{ label: "Quel est l'angle de la rotation qui amène chaque cabine à la place de la suivante ?", pts: 1 }, { label: "La roue tourne de " + M(N(k * a) + "°") + ". À la place de quelle cabine se trouve maintenant la cabine 1 ?", pts: 1 }, { label: "La cabine 1 est en bas. Combien de temps lui faut-il pour arriver tout en haut ? Pour faire un quart de tour ?", pts: 2 }, { label: "De quel angle la roue a-t-elle tourné quand la cabine 1 est à la place de la cabine " + m + " ?", pts: 1 }],
        sol: ul([M("360° : " + n + " = " + N(a) + "°") + ".", M(N(k * a) + " : " + N(a) + " = " + k) + " places : la cabine 1 est à la place de la cabine " + (1 + k) + ".", "Un demi-tour : " + M(Tm + " : 2 = " + Tm / 2) + " min ; un quart de tour : " + M(Tm + " : 4 = " + N(Tm / 4)) + " min. Le prix du billet ne sert à rien.", M((m - 1) + " \\cdot " + N(a) + "° = " + N((m - 1) * a) + "°") + "."]),
        chk: [[k * a < 360 && (m - 1) * a < 360, "angles"]], vals: [a, k * a, 1 + k, Tm / 2, Tm / 4, (m - 1) * a] }); },
    () => { const [Lr, k1, k2] = pk([[450, 18, 50], [450, 25, 90], [360, 24, 45], [360, 18, 90], [432, 18, 48]]), lm = Lr / k1, wm = pk([9, 10, 10.5]), wr = r6((wm * k1) / 100), l2 = Lr / k2;
      return X({ id: "agrand", lv: 2, titre: "La maquette",
        q: "Une voiture réelle mesure " + Q(Lr / 100, "m") + " de long. Un collectionneur en a une maquette à l'échelle " + M("1\\,:\\," + k1) + ".",
        parts: [{ label: "Quelle est la longueur de la maquette, en cm ?", pts: 1 }, { label: "La maquette a " + Q(wm, "cm") + " de large. Quelle est la largeur réelle de la voiture ?", pts: 1 }, { label: "Combien de fois plus de peinture faut-il pour la vraie voiture que pour la maquette ?", pts: 2 }, { label: "Une autre maquette de la même voiture mesure " + Q(l2, "cm") + ". Quelle est son échelle ?", pts: 1 }],
        sol: ul([M(Lr + " : " + k1 + " = " + N(lm)) + " cm.", M(N(wm) + " \\cdot " + k1 + " = " + N(wm * k1)) + " cm = " + Q(wr, "m") + ".", "Les longueurs sont multipliées par " + k1 + ", les aires par " + M(k1 + "^2 = " + k1 * k1) + " : " + k1 * k1 + " fois plus.", M(Lr + " : " + N(l2) + " = " + k2) + " : échelle " + M("1\\,:\\," + k2) + "."]),
        chk: [[Number.isInteger(lm * 2) && Math.abs(Lr / l2 - k2) < 1e-9, "échelles"]], vals: [lm, wr, k1 * k1, k2] }); },
    () => { let P; do P = [[nz(1, 5), nz(1, 4)], [nz(2, 5), nz(-3, 3)], [nz(-3, 3), nz(2, 5)]]; while (new Set(P.map((p) => p.join())).size < 3);
      const r90 = ([x, y]) => [-y, x], r180 = ([x, y]) => [-x, -y], I = P.map(r90), J = P.map(r180);
      return X({ id: "rotation", lv: 2, titre: "Quart de tour dans le repère",
        q: "Le triangle " + M("ABC") + " a pour sommets " + pt("A", ...P[0]) + ", " + pt("B", ...P[1]) + ", " + pt("C", ...P[2]) + ". On le fait tourner autour de l'origine " + M("O") + ".", fig: grid(-6, 6, -6, 6, [[...P[0], "A"], [...P[1], "B"], [...P[2], "C"]], [[P]]),
        parts: [{ label: "Construis l'image de " + M("A") + " par la rotation de centre " + M("O") + " de 90° dans le sens inverse des aiguilles d'une montre, et donne ses coordonnées.", pts: 1 }, { label: "Donne les coordonnées des images de " + M("B") + " et " + M("C") + ". Quelle règle observes-tu ?", pts: 2 }, { label: "Donne les coordonnées des images de " + M("A") + ", " + M("B") + ", " + M("C") + " par la rotation de 180°. À quelle autre transformation correspond-elle ?", pts: 2 }],
        sol: ul([pt("A'", ...I[0]) + ".", pt("B'", ...I[1]) + ", " + pt("C'", ...I[2]) + " : " + M("(x \\,;\\, y) \\to (-y \\,;\\, x)") + ".", pt("A''", ...J[0]) + ", " + pt("B''", ...J[1]) + ", " + pt("C''", ...J[2]) + " : c'est la symétrie de centre " + M("O") + " " + M("(x \\,;\\, y) \\to (-x \\,;\\, -y)") + "."]),
        chk: [[P.every((p, i) => r90(r90(p)).join() === J[i].join()), "deux quarts de tour"]], vals: [] }); },
    () => { const P = pk([24, 30, 36]), Ar = pk([32, 40, 45]), k = pk([1.5, 2.5, 3]), kr = pk([0.4, 0.6, 0.8]), m = pk([[6.25, 2.5], [2.25, 1.5], [9, 3], [1.44, 1.2]]);
      return X({ id: "agrand", lv: 3, titre: "Le logo",
        q: "Un logo a un périmètre de " + Q(P, "cm") + " et une aire de " + Q(Ar, "cm^2") + ".",
        parts: [{ label: "On l'agrandit avec le rapport " + N(k) + ". Calcule le nouveau périmètre et la nouvelle aire.", pts: 2 }, { label: "On le réduit avec le rapport " + N(kr) + ". Calcule le nouveau périmètre et la nouvelle aire.", pts: 2 }, { label: "Sur une affiche, l'aire du logo est multipliée par " + N(m[0]) + ". Par combien ses longueurs ont-elles été multipliées ?", pts: 1 }],
        sol: ul(["Périmètre " + M(P + " \\cdot " + N(k) + " = " + N(P * k)) + " cm ; aire " + M(Ar + " \\cdot " + N(k) + "^2 = " + Ar + " \\cdot " + N(k * k) + " = " + N(r6(Ar * k * k))) + " cm².", "Périmètre " + M(P + " \\cdot " + N(kr) + " = " + N(r6(P * kr))) + " cm ; aire " + M(Ar + " \\cdot " + N(r6(kr * kr)) + " = " + N(r6(Ar * kr * kr))) + " cm² (une réduction : rapport plus petit que 1).", "Par " + M(N(m[1])) + ", car " + M(N(m[1]) + "^2 = " + N(m[0])) + "."]),
        chk: [[Math.abs(m[1] * m[1] - m[0]) < 1e-9, "racine"]], vals: [P * k, Ar * k * k, P * kr, Ar * kr * kr, m[1]] }); },
  ];
  const RAISONT = [
    () => VF({ id: "agrand" }, [
      () => ["Une rotation de 180° est une symétrie centrale.", true, "Chaque point va de l'autre côté du centre, à la même distance."],
      () => { const k = pk([3, 4]); return ["Un agrandissement de rapport " + k + " multiplie l'aire par " + k + ".", false, "Il la multiplie par " + M(k + "^2 = " + k * k) + "."]; },
      () => ["Une rotation conserve les longueurs et les angles.", true, "La figure tourne sans se déformer."],
      () => ["Un agrandissement conserve les angles.", true, "La forme reste la même, seules les longueurs changent."],
      () => ["Une réduction a un rapport plus grand que 1.", false, "Son rapport est entre 0 et 1 (ex. 0,5)."],
      () => ["Quatre quarts de tour de suite ramènent la figure à sa place.", true, M("4 \\cdot 90° = 360°") + "."],
    ]),
    () => { const a = nz(2, 6), b = nz(2, 6), w = who();
      return X({ id: "rotation", lv: 2, titre: "Trouve l'erreur",
        q: w.n + " fait tourner " + pt("A", a, b) + " d'un quart de tour (90°) autour de " + M("O") + ", dans le sens inverse des aiguilles d'une montre, et obtient " + pt("A'", b, -a) + ".",
        parts: [{ label: "Dans quel sens " + w.n + " a-t-" + w.il + " tourné ?", pts: 1 }, { label: "Donne la bonne image.", pts: 1 }],
        sol: ul(["Dans le sens des aiguilles d'une montre : " + M("(x \\,;\\, y) \\to (y \\,;\\, -x)") + ".", pt("A'", -b, a) + " (règle " + M("(x \\,;\\, y) \\to (-y \\,;\\, x)") + ")."]),
        chk: [[!(b === -b && -a === a), "différent"]], vals: [-b, a] }); },
  ];
  RICH.transf10 = { ids: ["agrand", "rotation"], label: "Transformations du plan (10e)", ex: EXT, raison: RAISONT, minutes: 45 };
  // ===================== 10e · 7. Calcul littéral (28.11, nickel 10e) =====================
  // Modelé sur le MER 10e (FA150 « Droit au but » : programmes de calcul à prouver ; FA162 « Faire le mur » ; FA172 ;
  // FA174 « Sont-elles équivalentes ? » ; FA177 « Des petits carreaux » ; QSJ p. 107), au programme de 10e du plan de
  // cheminement : conventions, expressions équivalentes (contre-exemple), substitution avec relatifs, élaboration,
  // réduire, × de monômes, SIMPLE distributivité (pas de double distributivité, d'identités ni de factorisation : 11e).
  // Avant le 28.11, le sujet de 10e tirait la banque de 11e (RICH.litt11 : jardin (x + a)(x + b), identités, factoriser).
  const cxT = (a, v = "x") => (a === 1 ? v : a === -1 ? "-" + v : N(a) + v); /* coefficient devant une lettre (TeX) */
  const lin = (a, b, v = "x") => cxT(a, v) + (b < 0 ? " - " + N(-b) : b > 0 ? " + " + N(b) : ""); /* ax + b (TeX) */
  const linP = (a, b, v = "x") => lin(a, b, v).replace(/\{,\}/g, ",").replace(/-/g, "−"); /* texte simple (figures) */
  const rect = (x, y, w, h, cls) => pg([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], cls);
  const EXL10 = [
    // Le mur de briques (MER FA162) : réduire, valeur, question inverse
    () => { let B, Nw, T2; do { B = [0, 1, 2].map(() => [pk([2, 3, 4, 5, -2, -3]), pk([-7, -5, -4, -2, 3, 5, 6, 8])]); Nw = [pk([2, 3, 4, -1, 5]), pk([-6, -3, 2, 4, 7])]; } while (B[0][0] + 2 * B[1][0] + B[2][0] === 0 || B[0][1] + 2 * B[1][1] + B[2][1] === 0 || (Nw[0] === B[1][0] && Nw[1] === B[1][1]));
      const M1 = [B[0][0] + B[1][0], B[0][1] + B[1][1]], M2 = [B[1][0] + B[2][0], B[1][1] + B[2][1]], T = [M1[0] + M2[0], M1[1] + M2[1]], x0 = pk([-2, -3, -4]), vT = T[0] * x0 + T[1];
      T2 = [B[0][0] + 2 * Nw[0] + B[2][0], B[0][1] + 2 * Nw[1] + B[2][1]];
      const W = 300, H = 112, b = (i, j, s, cls) => rect(10 + j * 93 + i * 46.5, 10 + (2 - i) * 32, 93, 32, cls) + tx(10 + j * 93 + i * 46.5 + 46.5, 10 + (2 - i) * 32 + 21, s, "f-txt", "middle", 13);
      const fig = svg(W, H, b(0, 0, linP(...B[0]), "f-shape2") + b(0, 1, linP(...B[1]), "f-shape2") + b(0, 2, linP(...B[2]), "f-shape2") + b(1, 0, "?", "f-soft") + b(1, 1, "?", "f-soft") + b(2, 0, "?", "f-soft"), "mur de six briques : trois en bas, deux au milieu, une au sommet");
      return X({ id: "reduire", lv: 1, titre: "Le mur de briques",
        q: "Dans ce mur, chaque brique contient la <b>somme</b> des deux briques sur lesquelles elle repose. Écris chaque résultat sous forme réduite." + fig,
        parts: [{ label: "Écris les deux briques du milieu.", pts: 2 }, { label: "Écris la brique du sommet.", pts: 1 }, { label: "Calcule la brique du sommet pour " + M("x = " + x0) + ". Vérifie en remplaçant " + M("x") + " par " + M(x0) + " dans les trois briques du bas.", pts: 2 },
          { label: "On change seulement la brique du milieu, en bas. Le sommet devient " + M(lin(...T2)) + ". Quelle expression a-t-on mise dans cette brique ?", pts: 2 }],
        sol: ul([M("(" + lin(...B[0]) + ") + (" + lin(...B[1]) + ") = " + lin(...M1)) + " et " + M("(" + lin(...B[1]) + ") + (" + lin(...B[2]) + ") = " + lin(...M2)) + ".",
          M("(" + lin(...M1) + ") + (" + lin(...M2) + ") = " + lin(...T)) + " (la brique du milieu, en bas, compte deux fois).",
          M(N(T[0]) + " \\cdot (" + x0 + ")" + (T[1] < 0 ? " - " + -T[1] : " + " + T[1]) + " = " + vT) + ". En bas, pour " + M("x = " + x0) + " : " + B.map((v) => M(N(v[0] * x0 + v[1]))).join(", ") + ", et " + M(N(B[0][0] * x0 + B[0][1]) + " + 2 \\cdot (" + N(B[1][0] * x0 + B[1][1]) + ") + (" + N(B[2][0] * x0 + B[2][1]) + ") = " + vT) + " ✓.",
          "Sommet = brique de gauche + 2 · brique du milieu + brique de droite. Donc 2 · brique du milieu " + M("= (" + lin(...T2) + ") - (" + lin(...B[0]) + ") - (" + lin(...B[2]) + ") = " + lin(2 * Nw[0], 2 * Nw[1])) + ", et la brique vaut " + M(lin(...Nw)) + "."]),
        chk: [[vT === B[0][0] * x0 + B[0][1] + 2 * (B[1][0] * x0 + B[1][1]) + B[2][0] * x0 + B[2][1], "deux calculs"], [T2[0] - B[0][0] - B[2][0] === 2 * Nw[0] && T2[1] - B[0][1] - B[2][1] === 2 * Nw[1], "inverse"]],
        vals: [T[0], T[1], vT].filter((v) => Math.abs(v) > 1) }); },
    // Les carreaux du bord (MER FA177) : élaborer, expressions équivalentes, question inverse
    () => { const n = pk([5, 6]), big = pk([20, 25, 40]), n0 = pk([12, 15, 18]), C0 = 4 * n0 - 4, no = pk([50, 70, 90]);
      const s = 22, fig = svg(n * s + 20, n * s + 20, Array.from({ length: n * n }, (_, k) => { const i = k % n, j = Math.floor(k / n), edge = i === 0 || j === 0 || i === n - 1 || j === n - 1; return rect(10 + i * s, 10 + j * s, s, s, edge ? "f-fill2" : "f-soft"); }).join(""), "carré de " + n + " sur " + n + " carreaux, les carreaux du bord colorés");
      return X({ id: "litelab", lv: 2, titre: "Les carreaux du bord",
        q: "On pave un carré de " + M("n") + " carreaux sur " + M("n") + " carreaux, et on colore les carreaux du bord (ici " + M("n = " + n) + ")." + fig,
        parts: [{ label: "Combien de carreaux sont colorés pour " + M("n = " + n) + " ? Et pour " + M("n = 10") + " ?", pts: 2 },
          { label: "Pour le nombre de carreaux colorés, Léa propose " + M("4n - 4") + ", Noé " + M("4(n - 1)") + ", Sam " + M("2n + 2(n - 2)") + " et Yanis " + M("4n") + ". Lesquelles de ces expressions sont justes ? Justifie en réduisant, et donne un contre-exemple pour celle qui est fausse.", pts: 3 },
          { label: "Combien de carreaux sont colorés pour un carré de " + M(big) + " sur " + M(big) + " ?", pts: 1 },
          { label: "Un carré a " + M(C0) + " carreaux colorés. Combien de carreaux a-t-il de côté ? Peut-on en avoir exactement " + M(no) + " ? Explique.", pts: 2 }],
        sol: ul([M("n = " + n) + " : " + M(4 * n - 4) + " carreaux ; " + M("n = 10") + " : 36 carreaux (les 4 coins ne se comptent qu'une fois).",
          "Léa, Noé et Sam ont raison : " + M("4(n - 1) = 4n - 4") + " et " + M("2n + 2(n - 2) = 2n + 2n - 4 = 4n - 4") + " (deux côtés entiers, plus deux côtés sans leurs coins). Yanis a tort : il compte les coins deux fois ; contre-exemple " + M("n = " + n) + " : " + M(4 * n) + " au lieu de " + M(4 * n - 4) + ".",
          M("4 \\cdot " + big + " - 4 = " + (4 * big - 4)) + " carreaux.",
          M("4n - 4 = " + C0) + " : " + M("4n = " + (C0 + 4)) + ", " + M("n = " + n0) + " carreaux de côté. " + M(no + 4 + " : 4 = " + N((no + 4) / 4)) + " n'est pas un nombre entier : impossible d'avoir exactement " + no + " carreaux colorés."]),
        chk: [[(no + 4) % 4 !== 0, "impossible"], [4 * n0 - 4 === C0, "inverse"]], vals: [4 * n - 4, 36, 4 * big - 4, n0] }); },
    // Droit au but (MER FA150) : programme de calcul à prouver
    () => { let m, a, t; do { m = pk([3, 4, 5]); a = R.int(2, 9); t = pk([4, -3, 7]); } while (Math.abs(t + a) < 2);
      return X({ id: "distrib", lv: 2, titre: "Le programme de calcul",
        q: "Programme : « Choisis un nombre. Ajoute " + a + ". Multiplie le résultat par " + m + ". Retranche le nombre choisi. Retranche " + m * a + ". Divise par " + (m - 1) + ". »",
        parts: [{ label: "Applique le programme à " + M(t) + ", puis à " + M("2{,}5") + ". Que constates-tu ?", pts: 2 },
          { label: "On appelle " + M("x") + " le nombre choisi. Écris le résultat de chaque étape à l'aide de " + M("x") + ".", pts: 2 },
          { label: "Prouve que ta constatation est vraie pour tous les nombres (développe, puis réduis).", pts: 2 },
          { label: "Change la dernière étape pour que le programme donne toujours le double du nombre choisi.", pts: 1 }],
        sol: ul([M(t) + " → " + M(N(t + a)) + " → " + M(N(m * (t + a))) + " → " + M(N(m * (t + a) - t)) + " → " + M(N(m * (t + a) - t - m * a)) + " → " + M(N(t)) + " ; " + M("2{,}5") + " donne " + M("2{,}5") + " : on retrouve le nombre choisi.",
          M("x \\to x + " + a + " \\to " + m + "(x + " + a + ") \\to " + m + "(x + " + a + ") - x \\to " + m + "(x + " + a + ") - x - " + m * a + " \\to \\frac{" + m + "(x + " + a + ") - x - " + m * a + "}{" + (m - 1) + "}") + ".",
          M(m + "(x + " + a + ") - x - " + m * a + " = " + m + "x + " + m * a + " - x - " + m * a + " = " + (m - 1) + "x") + ", et " + M((m - 1) + "x : " + (m - 1) + " = x") + " : c'est vrai pour tout " + M("x") + " (une preuve, pas seulement des exemples).",
          "Par exemple « Divise par " + (m - 1) + ", puis multiplie par 2 »" + (m === 3 ? " (ou simplement : « Ne divise pas » : " + M("2x") + ")" : "") + "."]),
        chk: [[m * (t + a) - t - m * a === (m - 1) * t, "preuve"]], vals: [t + a, m * (t + a), m * a, m - 1] }); },
    // Deux tarifs de taxi : substitution avec décimaux, différence réduite, égalité
    () => { let d, k0, k2; do { d = pk([0.2, 0.25, 0.4, 0.5]); k0 = pk([4, 5, 6, 8, 10]); k2 = pk([15, 20, 25]); } while (Math.abs(Math.abs(d * (k2 - k0)) - 1) < 1e-9);
      const q = pk([2.6, 2.8, 3]), a0 = pk([3.5, 4, 5, 6.5]), p = r6(q + d), b0 = r6(a0 + d * k0), k1 = pk([2, 3]);
      const A1 = r6(a0 + p * k1), B1 = r6(b0 + q * k1), D = (k) => r6(a0 - b0 + d * k);
      return X({ id: "valnum", lv: 2, titre: "Deux taxis",
        q: "Dans une ville, deux compagnies de taxis calculent le prix d'une course de " + M("k") + " km avec les formules " + M("A = " + N(a0) + " + " + N(p) + "k") + " et " + M("B = " + N(b0) + " + " + N(q) + "k") + " (en CHF).",
        parts: [{ label: "Calcule le prix d'une course de " + Q(k1, "km") + " avec chaque compagnie.", pts: 2 },
          { label: "Écris la différence " + M("A - B") + " sous forme réduite.", pts: 2 },
          { label: "Pour quelle distance les deux prix sont-ils égaux ?", pts: 1 },
          { label: "Inès affirme : « Pour une course de " + k2 + " km, la compagnie A est la moins chère. » A-t-elle raison ? Justifie avec " + M("A - B") + ".", pts: 1 }],
        sol: ul(["A : " + M(N(a0) + " + " + N(p) + " \\cdot " + k1 + " = " + Nk(A1, 2)) + " CHF ; B : " + M(N(b0) + " + " + N(q) + " \\cdot " + k1 + " = " + Nk(B1, 2)) + " CHF.",
          M("A - B = " + N(a0) + " + " + N(p) + "k - " + N(b0) + " - " + N(q) + "k = " + N(d) + "k - " + N(r6(b0 - a0))) + " (attention : le « − » porte sur les deux termes de B).",
          M(N(d) + "k - " + N(r6(b0 - a0)) + " = 0") + " pour " + M("k = " + N(r6(b0 - a0)) + " : " + N(d) + " = " + k0) + " km.",
          "Pour " + M("k = " + k2) + " : " + M("A - B = " + N(d) + " \\cdot " + k2 + " - " + N(r6(b0 - a0)) + " = " + N(D(k2))) + " CHF > 0 : A est plus chère. Inès a tort (A n'est moins chère que pour les courses de moins de " + k0 + " km)."]),
        chk: [[Math.abs(D(k0)) < 1e-9, "égalité"], [D(k2) > 0 && D(k1) < 0, "signes"], [k2 > k0 && k1 < k0, "ordre"]], vals: [A1, B1, d, k0, D(k2)] }); },
    // La boîte sans couvercle : monômes (volume, aire de carton, agrandissement)
    () => { const [a, b, c] = sh(pk([[2, 3, 4], [2, 3, 5], [3, 4, 5], [2, 4, 5]])), V = a * b * c, S = a * b + 2 * a * c + 2 * b * c, x1 = pk([1.5, 2.5, 0.5]), w = who();
      return X({ id: "monomes", lv: 3, titre: "La boîte sans couvercle",
        q: "Une boîte en carton, sans couvercle, a la forme d'un pavé droit. Son fond mesure " + M(a + "x") + " cm sur " + M(b + "x") + " cm et sa hauteur est de " + M(c + "x") + " cm.",
        parts: [{ label: "Écris son volume sous la forme d'un monôme.", pts: 1 },
          { label: "Écris l'aire de carton utilisée (le fond et les quatre côtés) sous la forme d'un monôme.", pts: 2 },
          { label: w.n + " écrit : « l'aire de carton vaut " + M(a * b * c + "x^3") + " ». Explique son erreur.", pts: 1 },
          { label: "Calcule le volume et l'aire de carton pour " + M("x = " + N(x1)) + ". Si " + M("x") + " double, par combien le volume est-il multiplié ? Et l'aire ?", pts: 2 }],
        sol: ul([M(a + "x \\cdot " + b + "x \\cdot " + c + "x = " + V + "x^3") + " cm³.",
          "Fond " + M(a + "x \\cdot " + b + "x = " + a * b + "x^2") + ", deux côtés " + M("2 \\cdot " + a + "x \\cdot " + c + "x = " + 2 * a * c + "x^2") + ", deux côtés " + M("2 \\cdot " + b + "x \\cdot " + c + "x = " + 2 * b * c + "x^2") + " : en tout " + M(S + "x^2") + " cm² (monômes semblables : on additionne les coefficients).",
          w.n + " a multiplié les trois dimensions : c'est le volume. Une aire s'exprime en cm², avec " + M("x^2") + " : on additionne les aires des faces.",
          "Volume : " + M(V + " \\cdot " + N(x1) + "^3 = " + V + " \\cdot " + N(r6(x1 ** 3)) + " = " + N(r6(V * x1 ** 3))) + " cm³ ; aire : " + M(S + " \\cdot " + N(r6(x1 * x1)) + " = " + N(r6(S * x1 * x1))) + " cm². Si " + M("x") + " double : " + M("(2x)^3 = 8x^3") + ", volume × 8 ; " + M("(2x)^2 = 4x^2") + ", aire × 4."]),
        chk: [[S !== V, "aire ≠ volume"]], vals: [V, S, r6(V * x1 ** 3), r6(S * x1 * x1), 8] }); },
  ];
  const RAISONL10 = [
    // Trouve l'erreur : signe devant une parenthèse
    () => { const a = R.int(2, 6), b = R.int(2, 7), c = R.int(2, 9), d = R.int(5, 9), e = R.int(2, d - 2), f = R.int(2, 9), w = who();
      return X({ id: "distrib", lv: 1, titre: "Trouve l'erreur",
        q: w.n + " a développé et réduit deux expressions : " + ul([M("-" + a + "(" + b + "x - " + c + ") = -" + a * b + "x - " + a * c), M(d + "x - (" + e + "x - " + f + ") = " + (d - e) + "x - " + f)]).replace(/<ol type="a" class="mock-parts">/, "<ol class=\"mock-parts\">"),
        parts: [{ label: "Explique l'erreur de " + w.n + " dans chaque calcul.", pts: 2 }, { label: "Corrige les deux calculs.", pts: 2 }, { label: "Vérifie ta correction du premier calcul en remplaçant " + M("x") + " par 2 des deux côtés.", pts: 1 }],
        sol: ul(["Premier : " + M("-" + a + " \\cdot (-" + c + ") = +" + a * c) + " (moins par moins donne plus). Second : le « − » devant la parenthèse change le signe de <b>tous</b> les termes : " + M("-(-" + f + ") = +" + f) + ".",
          M("-" + a + "(" + b + "x - " + c + ") = -" + a * b + "x + " + a * c) + " ; " + M(d + "x - " + e + "x + " + f + " = " + (d - e) + "x + " + f) + ".",
          "Gauche : " + M("-" + a + " \\cdot (" + 2 * b + " - " + c + ") = " + -a * (2 * b - c)) + " ; droite : " + M("-" + 2 * a * b + " + " + a * c + " = " + (-2 * a * b + a * c)) + " ✓."]),
        chk: [[-a * (2 * b - c) === -2 * a * b + a * c, "vérification"], [d - e >= 2, "réduit"]], vals: [a * c, d - e, f].filter((v) => v > 1) }); },
    // Vrai ou faux ? (conventions, monômes, équivalence, contre-exemple)
    () => VF({ id: "litconv", titre: "Vrai ou faux ? Justifie" }, [
      () => { const v = pk([2, 3, 4]), k = pk([3, 5]); return ["Pour " + M("x = -" + v) + ", " + M(k + "x^2") + " vaut " + M(N(k * k * v * v)) + ".", false, M(k + " \\cdot (-" + v + ")^2 = " + k + " \\cdot " + v * v + " = " + k * v * v) + " : le carré ne porte que sur " + M("x") + " ; " + M(N(k * k * v * v)) + " serait " + M("(" + k + "x)^2") + "."]; },
      () => ["« " + M("a \\cdot a = 2a") + " »", false, M("a \\cdot a = a^2") + " ; contre-exemple " + M("a = 3") + " : 9 et 6."],
      () => { const p = pk([2, 3, 4]), q = pk([5, 6, 7]); return [M(p + "x + " + q + "x^2 = " + (p + q) + "x^3"), false, "Les termes " + M(p + "x") + " et " + M(q + "x^2") + " ne sont pas semblables : on ne peut pas les additionner. Contre-exemple " + M("x = 2") + " : " + M(p + " \\cdot 2 + " + q + " \\cdot 4 = " + (2 * p + 4 * q)) + ", mais " + M((p + q) + " \\cdot 8 = " + 8 * (p + q)) + "."]; },
      () => [M("-x^2") + " est négatif ou nul pour tous les nombres " + M("x") + ".", true, M("x^2 \\ge 0") + ", donc " + M("-x^2 = -(x^2) \\le 0") + " ; par exemple " + M("x = -3") + " : " + M("-9") + "."],
      () => { const k = pk([2, 3]); return [M("(" + k + "x)^3 = " + k + "x^3"), false, M("(" + k + "x)^3 = " + k + "x \\cdot " + k + "x \\cdot " + k + "x = " + k ** 3 + "x^3") + " : le coefficient aussi est au cube."]; },
      () => { let p, q, r, s; do { p = R.int(2, 6); q = R.int(2, 6); r = R.int(2, 5); s = R.int(1, 6); } while (p === r); return [M(p + "(x - " + q + ") - " + r + "(x + " + s + ") = " + lin(p - r, -(p * q + r * s))), true, M(p + "x - " + p * q + " - " + r + "x - " + r * s + " = " + lin(p - r, -(p * q + r * s))) + " : les deux côtés ont la même forme réduite."]; },
      () => ["« " + M("(a + b)^2 = a^2 + b^2") + " pour tous les nombres " + M("a") + " et " + M("b") + " »", false, "Contre-exemple " + M("a = 2") + ", " + M("b = 3") + " : " + M("(2 + 3)^2 = 25") + " mais " + M("2^2 + 3^2 = 13") + ". Un seul contre-exemple suffit."],
    ]),
    // Sont-elles équivalentes ? (MER FA174, E10-7-3)
    () => { let p, q, r, s; do { p = R.int(3, 6); q = R.int(2, 5); r = R.int(2, 7); s = R.int(2, 6); } while (p === r || Math.abs(p - r) === 1);
      const A = p - r, B = -p * q - r * s, ok1 = lin(A, B), wrong1 = lin(A, -p * q + r * s), wrong2 = lin(A, -q - s), ok2 = p + "x - " + p * q + " - " + r + "x - " + r * s, L = sh([[ok1, true], [wrong1, false], [wrong2, false], [ok2, true]]).map((l, i) => [String(i + 1)].concat(l)), xv = 1;
      const bad = L.find((l) => !l[2]), vBad = bad[1] === wrong1 ? A * xv - p * q + r * s : A * xv - q - s, vE = A * xv + B;
      return X({ id: "litconv", lv: 2, titre: "Sont-elles équivalentes ?",
        q: "On considère " + M("E = " + p + "(x - " + q + ") - " + r + "(x + " + s + ")") + " et quatre expressions : " + L.map((l) => "(" + l[0] + ") " + M(l[1])).join(" ; ") + ".",
        parts: [{ label: "Développe et réduis " + M("E") + ".", pts: 2 }, { label: "Lesquelles des quatre expressions sont égales à " + M("E") + " pour toutes les valeurs de " + M("x") + " ?", pts: 1 }, { label: "Pour l'expression (" + bad[0] + "), montre par un contre-exemple qu'elle n'est pas équivalente à " + M("E") + ".", pts: 1 }],
        sol: ul([M("E = " + p + "x - " + p * q + " - " + r + "x - " + r * s + " = " + ok1) + ".", "(" + L.filter((l) => l[2]).map((l) => l[0]).sort().join(") et (") + ") : la forme réduite et la forme développée non réduite.", "Pour " + M("x = 1") + " : " + M("E = " + vE) + ", mais l'expression (" + bad[0] + ") vaut " + M(vBad) + " (une valeur suffit)."]),
        chk: [[vBad !== vE, "contre-exemple"], [wrong1 !== ok1 && wrong2 !== ok1, "distinctes"]], vals: [A, B].filter((v) => Math.abs(v) > 1) }); },
    // Deux méthodes (substituer ou réduire d'abord) : une expression qui ne dépend pas de x
    () => { let a, b, c, d, K; do { a = R.int(2, 5); b = R.int(2, 5); c = R.int(1, 9); d = R.int(1, 9); K = -a * c + b * d; } while (a === b || Math.abs(K) < 2);
      const xs = pk(["17{,}3", "-2{,}75", "125"]);
      return X({ id: "valnum", lv: 2, titre: "Deux méthodes",
        q: "On veut calculer " + M("E = " + a + "(" + b + "x - " + c + ") - " + b + "(" + a + "x - " + d + ")") + " pour " + M("x = " + xs) + ". Léa remplace tout de suite " + M("x") + " par " + M(xs) + ". Noé développe et réduit d'abord.",
        parts: [{ label: "Fais le calcul de Noé : développe et réduis " + M("E") + ".", pts: 2 }, { label: "Que vaut " + M("E") + " pour " + M("x = " + xs) + " ? Et pour " + M("x = -40") + " ?", pts: 1 }, { label: "Quelle méthode est la plus rapide ici ? Explique pourquoi la valeur ne dépend pas de " + M("x") + ".", pts: 1 }],
        sol: ul([M(a * b + "x - " + a * c + " - " + a * b + "x + " + b * d + " = " + K) + ".", M("E = " + K) + " dans les deux cas.", "La méthode de Noé : les termes en " + M("x") + " s'annulent (" + M(a * b + "x - " + a * b + "x = 0") + "), il reste le nombre " + M(K) + " pour toute valeur de " + M("x") + "."]),
        chk: [[a * (b * 3 - c) - b * (a * 3 - d) === K, "constante"]], vals: [a * b, K] }); },
    // Trouve l'erreur : monômes
    () => { const p = R.int(2, 6), q = R.int(3, 7), m = R.int(2, 4), n = R.int(3, 5), k = R.int(2, 4), w = who();
      return X({ id: "monomes", lv: 1, titre: "Trouve l'erreur",
        q: w.n + " a écrit : " + M(p + "x \\cdot " + q + "x = " + p * q + "x") + " ; " + M("x^{" + m + "} \\cdot x^{" + n + "} = x^{" + m * n + "}") + " ; " + M("(-" + k + "x)^2 = -" + k * k + "x^2") + ".",
        parts: [{ label: "Explique chaque erreur.", pts: 2 }, { label: "Écris les trois bons résultats.", pts: 2 }],
        sol: ul([M("x \\cdot x = x^2") + ", pas " + M("x") + " ; on additionne les exposants (" + m + " + " + n + "), on ne les multiplie pas ; " + M("(-" + k + "x)^2 = (-" + k + "x) \\cdot (-" + k + "x)") + " : moins par moins donne plus.", M(p * q + "x^2") + " ; " + M("x^{" + (m + n) + "}") + " ; " + M(k * k + "x^2") + "."]),
        chk: [[m + n !== m * n, "exposants"]], vals: [p * q, m + n, k * k] }); },
  ];
  /* grades : banque réservée à la 10e (richChapter, src/riche.js) — les ids sont aussi ceux de la 11e (RICH.litt11). */
  RICH.litt10 = { ids: ["litelab", "valnum", "reduire", "monomes", "distrib", "litconv"], label: "Calcul littéral (10e)", ex: EXL10, raison: RAISONL10, minutes: 45, grades: [10] };
})();
