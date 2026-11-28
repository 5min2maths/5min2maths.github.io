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
  // ===================== 10e · 9. Équations (28.11, nickel 10e) =====================
  // Modelé sur le MER 10e (ch. 7 10FAC : FA192 « À tester », FA196 « Équivalentes, mais comment ? », FA198–FA200 (dont
  // équations impossibles et indéterminées), FA201 « Cherche la bonne », FA205 « Le prix du billet », FA207 « Trouve la
  // bonne », FA208–FA209 angles et côtés, FA216 « Les moutons », FA218–FA219 têtes et pattes, billets) et l'étalon
  // E10-9-1 (niveau_910.md), modelé et jamais recopié. Au programme de 10e : 1er degré, parenthèses à SIMPLE
  // distributivité, fractions, mise en équation ; vérifier une solution (aussi avec x², comme FA192). Rien de 11e :
  // ni 2e degré à résoudre, ni double distributivité, ni formules à transformer. Avant le 28.11, le sujet de 10e tirait
  // la banque de 1re Collège (RICH.eq1c : 2e degré, bicarrées, racines).
  const EXE10 = [
    // Le prix du billet (MER FA205) : même somme au départ, équation à x des deux côtés, solution décimale
    () => { let a, b, p, r2; do { a = pk([2, 3, 4]); b = a + pk([2, 3]); p = pk([12.5, 14.5, 15.5, 17.5, 18.5, 21.5]); r2 = pk([6, 8, 9.5, 11, 12.5]); } while (r2 >= p);
      const r1 = r6(r2 + (b - a) * p), S = r6(a * p + r1), w1 = who(), w2 = who(w1.n), ev = pk(["billets pour le match de hockey", "places pour le concert", "billets pour le spectacle de cirque"]);
      return X({ id: "probeq", lv: 1, titre: "Le prix du billet",
        q: w1.n + " et " + w2.n + " ont la même somme d'argent. " + w1.n + " achète " + a + " " + ev + " et il lui reste " + chf(r1) + ". " + w2.n + " en achète " + b + ", au même prix, et il lui reste " + chf(r2) + ".",
        parts: [{ label: "On appelle " + M("x") + " le prix d'un billet, en CHF. Écris, en fonction de " + M("x") + ", la somme que chacun avait au départ.", pts: 2 },
          { label: "Écris une équation, puis résous-la.", pts: 2 }, { label: "Quelle somme chacun avait-il au départ ? Vérifie avec les deux achats.", pts: 1 },
          { label: w2.n + " peut-" + w2.il + " encore acheter un billet ? Explique.", pts: 1 }],
        sol: ul([w1.n + " : " + M(a + "x + " + N(r1)) + " ; " + w2.n + " : " + M(b + "x + " + N(r2)) + ".",
          M(a + "x + " + N(r1) + " = " + b + "x + " + N(r2)) + " ; on soustrait " + M(a + "x") + " et " + M(N(r2)) + " des deux membres : " + M(N(r6(r1 - r2)) + " = " + (b - a) + "x") + ", donc " + M("x = " + N(r6(r1 - r2)) + " : " + (b - a) + " = " + N(p)) + ". Un billet coûte " + chf(p) + ".",
          M(a + " \\cdot " + N(p) + " + " + N(r1) + " = " + N(S)) + " CHF et " + M(b + " \\cdot " + N(p) + " + " + N(r2) + " = " + N(S)) + " CHF ✓.",
          "Non : il lui reste " + chf(r2) + ", moins que le prix d'un billet (" + chf(p) + ")."]),
        chk: [[Math.abs(b * p + r2 - S) < 1e-9, "même somme"], [r2 < p, "reste"]], vals: [p, S, r1] }); },
    // Têtes et pattes, pièces, billets (MER FA218, FA219) : l'autre quantité = n − x, distributivité avec un « − »
    () => { const C = pk([
        { q: (n, T) => "Dans une ferme, on compte " + n + " têtes et " + T + " pattes : il n'y a que des poules et des lapins.", A: "poules", B: "lapins", a: 2, b: 4, n: [14, 30] },
        { q: (n, T) => "Une tirelire contient " + n + " pièces : des pièces de 2 CHF et des pièces de 5 CHF, pour un total de " + T + " CHF.", A: "pièces de 2 CHF", B: "pièces de 5 CHF", a: 2, b: 5, n: [18, 36] },
        { q: (n, T) => "Une caisse contient " + n + " billets de 10 CHF et de 50 CHF, pour un total de " + N(T) + " CHF.", A: "billets de 10 CHF", B: "billets de 50 CHF", a: 10, b: 50, n: [16, 40] }]);
      const n = R.int(C.n[0], C.n[1]), x = R.int(3, n - 3), T = C.a * x + C.b * (n - x), w = who(), D = C.b - C.a;
      return X({ id: "probeq", lv: 2, titre: pk(["Combien de chaque sorte ?", "Deux sortes"]),
        q: C.q(n, T),
        parts: [{ label: "On appelle " + M("x") + " le nombre de " + C.A + ". Écris le nombre de " + C.B + " en fonction de " + M("x") + ".", pts: 1 },
          { label: "Écris une équation qui traduit l'énoncé.", pts: 2 }, { label: "Résous-la. Combien y a-t-il de " + C.A + " et de " + C.B + " ? Vérifie.", pts: 2 },
          { label: w.n + " a écrit " + M(C.a + "x + " + C.b + " \\cdot " + n + " - x = " + N(T)) + ". Explique son erreur.", pts: 1 }],
        sol: ul([M(n + " - x") + ".", M(C.a + "x + " + C.b + "(" + n + " - x) = " + N(T)) + ".",
          M(C.a + "x + " + N(C.b * n) + " - " + C.b + "x = " + N(T)) + ", " + M("-" + D + "x = " + N(T) + " - " + N(C.b * n) + " = " + N(T - C.b * n)) + ", " + M("x = " + x) + " : " + x + " " + C.A + " et " + (n - x) + " " + C.B + ". Vérification : " + M(C.a + " \\cdot " + x + " + " + C.b + " \\cdot " + (n - x) + " = " + N(T)) + " ✓.",
          "Il manque les parenthèses : c'est le nombre de " + C.B + ", " + M(n + " - x") + ", qui est multiplié par " + C.b + " : " + M(C.b + "(" + n + " - x) = " + N(C.b * n) + " - " + C.b + "x") + ", et non " + M(N(C.b * n) + " - x") + "."]),
        chk: [[(T - C.b * n) / -D === x, "solution"], [n - x >= 3, "positif"]], vals: [x, n - x, T] }); },
    // Angles et côtés d'un triangle (MER FA208, FA209)
    () => { const k = pk([16, 20, 24, 28, 32, 36, 40]), x = (180 - k) / 4; let y, d; do { y = R.int(4, 9); d = R.int(1, 3); } while (y <= d + 1);
      const P = r6(2.5 * y + 1.5 * d), g = y + d, p = r6(g / 2);
      return X({ id: "probeq", lv: 2, titre: "Angles et côtés",
        q: "<b>Triangle ABC.</b> L'angle " + M("\\widehat{B}") + " mesure " + k + "° de plus que l'angle " + M("\\widehat{A}") + ", et l'angle " + M("\\widehat{C}") + " mesure le double de l'angle " + M("\\widehat{A}") + ".<br><b>Triangle DEF.</b> Son périmètre est de " + Q(P, "cm") + ". Le plus grand côté mesure " + Q(d, "cm") + " de plus que le côté moyen, et le plus petit côté mesure la moitié du plus grand.",
        parts: [{ label: "Triangle ABC : avec " + M("x") + " la mesure de " + M("\\widehat{A}") + ", écris les trois angles en fonction de " + M("x") + ", puis une équation.", pts: 2 },
          { label: "Calcule les trois angles. Le triangle ABC est-il rectangle ?", pts: 2 },
          { label: "Triangle DEF : choisis une inconnue (dis ce qu'elle représente) et écris une équation.", pts: 2 },
          { label: "Calcule les trois côtés de DEF et vérifie avec le périmètre.", pts: 2 }],
        sol: ul([M("\\widehat{A} = x") + ", " + M("\\widehat{B} = x + " + k) + ", " + M("\\widehat{C} = 2x") + " ; somme des angles : " + M("x + x + " + k + " + 2x = 180") + ".",
          M("4x + " + k + " = 180") + ", " + M("4x = " + (180 - k)) + ", " + M("x = " + x) + " : " + M("\\widehat{A} = " + x + "°") + ", " + M("\\widehat{B} = " + (x + k) + "°") + ", " + M("\\widehat{C} = " + 2 * x + "°") + ". Non, aucun angle ne mesure 90°.",
          "Avec " + M("y") + " le côté moyen (en cm) : grand côté " + M("y + " + d) + ", petit côté " + M("\\frac{y + " + d + "}{2}") + " ; " + M("y + (y + " + d + ") + \\frac{y + " + d + "}{2} = " + N(P)) + ".",
          "On multiplie chaque terme par 2 : " + M("2y + 2y + " + 2 * d + " + y + " + d + " = " + N(2 * P)) + ", " + M("5y = " + N(2 * P - 3 * d)) + ", " + M("y = " + y) + ". Côtés : " + Q(p, "cm") + ", " + Q(y, "cm") + " et " + Q(g, "cm") + " ; " + M(N(p) + " + " + y + " + " + g + " = " + N(P)) + " ✓."]),
        chk: [[x + x + k + 2 * x === 180 && Number.isInteger(x), "angles"], [p + y > g, "triangle"], [Math.abs(5 * y + 3 * d - 2 * P) < 1e-9, "périmètre"]], vals: [x, x + k, 2 * x, y, g, p] }); },
    // Résous et vérifie (E10-9-1, MER FA198, FA199) : « − » devant une parenthèse, décimaux, impossible, indéterminée
    () => { let a, b, c, d, g, A, s1, h; do { a = R.int(3, 6); b = R.int(1, 5); c = R.int(1, 4); d = R.int(1, 9); g = pk([-3, -2, 2, 3, 4]); A = a - c - g; s1 = pk([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7]); h = A * s1 - a * b + d; } while (Math.abs(A) < 2 || h === 0 || Math.abs(h) > 40);
      let p, q, t, s2, r; do { p = pk([1.2, 1.5, 2.5, 0.8]); t = R.int(2, 5); q = R.int(1, 7); s2 = pk([-6, -4, -3, -2, 2, 3, 4, 5, 6, 8]); r = r6(p * (s2 + q) - t * s2); } while (Math.abs(r) < 0.5 || Math.abs(r6(p - t)) < 0.15);
      const k = R.int(2, 5), m = R.int(1, 6), n = k * m + pk([-3, -2, 2, 3, 5]), e = R.int(2, 5), f = R.int(2, 6), w = who();
      return X({ id: "eq1", lv: 2, titre: "Résous et vérifie",
        q: "On considère les équations " + ul([M(a + "(x - " + b + ") - (" + lin(c, -d) + ") = " + lin(g, h)), M(N(p) + "(x + " + q + ") = " + N(r) + " + " + t + "x"), M(k + "(x + " + m + ") - x = " + lin(k - 1, n)), M(e + "(x - " + f + ") + 2x = x - " + e * f + " + " + (e + 1) + "x")]).replace(/<ol type="a" class="mock-parts">/, "<ol type=\"1\" class=\"mock-parts\">"),
        parts: [{ label: "Résous l'équation 1, puis vérifie ta solution.", pts: 2 }, { label: "Résous l'équation 2.", pts: 2 },
          { label: "Résous les équations 3 et 4. Que se passe-t-il ?", pts: 2 }, { label: "Pour l'équation 3, " + w.n + " écrit « " + M("x = 0") + " ». A-t-" + w.il + " raison ? Explique.", pts: 1 }],
        sol: ul([M(a + "x - " + a * b + " - " + cxT(c) + " + " + d + " = " + lin(g, h)) + " (le « − » change les deux signes), " + M(lin(A, 0) + " = " + N(h) + " + " + a * b + " - " + d + " = " + (A * s1)) + ", " + M("x = " + s1) + ". Vérification : " + M(a + " \\cdot " + sg(s1 - b) + " - " + sg(c * s1 - d) + " = " + (g * s1 + h)) + " et " + M(g + " \\cdot " + sg(s1) + " + " + sg(h) + " = " + (g * s1 + h)) + " ✓.",
          M(cxT(p) + " + " + N(r6(p * q)) + " = " + N(r) + " + " + t + "x") + ", " + M(N(r6(p - t)) + "x = " + N(r6(r - p * q))) + ", " + M("x = " + s2) + ".",
          "Équation 3 : " + M(k + "x + " + k * m + " - x = " + lin(k - 1, n)) + ", soit " + M(lin(k - 1, k * m) + " = " + lin(k - 1, n)) + " : les " + M("x") + " disparaissent et il reste " + M(k * m + " = " + n) + ", faux : <b>aucune solution</b>. Équation 4 : " + M(lin(e + 2, -e * f) + " = " + lin(e + 2, -e * f)) + " : il reste " + M("0 = 0") + ", vrai : <b>tous les nombres</b> sont solutions.",
          "Non : pour " + M("x = 0") + ", le membre de gauche vaut " + M(k * m) + " et celui de droite " + M(n) + ". « Aucune solution » n'est pas « la solution 0 »."]),
        chk: [[a * (s1 - b) - (c * s1 - d) === g * s1 + h, "vérif 1"], [Math.abs(p * (s2 + q) - (r + t * s2)) < 1e-9, "vérif 2"], [n !== k * m, "impossible"]], vals: [s1, s2, A] }); },
    // Les moutons (MER FA216) : fractions, multiplier CHAQUE terme
    () => { const [pa, pb, ta, tb, au] = pk([[3, 2, "le tiers", "la moitié", "au tiers"], [4, 3, "le quart", "le tiers", "au quart"], [6, 3, "le sixième", "le tiers", "au sixième"], [4, 2, "le quart", "la moitié", "au quart"]]), k = pk([6, 7, 8, 9, 12, 15]), L = lcm(pa, pb), D = L / pb - L / pa, x = (L * k) / D, w = who();
      const C = pk([["Un berger", "moutons", "son troupeau", "Ajoutez " + k + " moutons " + au + " de mon troupeau, et vous aurez " + tb + " de mon troupeau."], ["Une bibliothécaire", "livres", "son rayon de BD", "Si j'ajoute " + k + " livres " + au + " de mes BD, j'obtiens " + tb + " de mes BD."], ["Un collectionneur", "cartes", "sa collection", "Si j'ajoute " + k + " cartes " + au + " de ma collection, j'en ai " + tb + "."]]);
      const wrong = k / D;
      return X({ id: "eqfrac", lv: 3, titre: "Le tiers et la moitié",
        q: C[0] + " répond à qui lui demande combien de " + C[1] + " compte " + C[2] + " : « " + C[3] + " »",
        parts: [{ label: "On appelle " + M("x") + " le nombre total de " + C[1] + ". Écris une équation.", pts: 1 }, { label: "Résous-la.", pts: 2 },
          { label: "Vérifie ta réponse dans l'énoncé (pas seulement dans l'équation).", pts: 1 },
          { label: w.n + " a multiplié les deux membres par " + L + " et a écrit " + M((L / pa === 1 ? "" : L / pa) + "x + " + k + " = " + (L / pb) + "x") + ". Explique son erreur.", pts: 1 }],
        sol: ul([M("\\frac{x}{" + pa + "} + " + k + " = \\frac{x}{" + pb + "}") + ".",
          "On multiplie chaque terme par " + L + " : " + M((L / pa === 1 ? "" : L / pa) + "x + " + L * k + " = " + L / pb + "x") + ", " + M(L * k + " = " + (D === 1 ? "x" : D + "x")) + ", " + M("x = " + x) + ".",
          ta.charAt(0).toUpperCase() + ta.slice(1) + " de " + x + " : " + M(x / pa) + " ; " + M(x / pa + " + " + k + " = " + (x / pa + k)) + ", et " + tb + " de " + x + " vaut bien " + M(x / pb) + " ✓.",
          w.n + " n'a pas multiplié le nombre " + k + " par " + L + " : on multiplie <b>chaque terme</b> des deux membres. Avec son équation, il trouverait " + M("x = " + (Number.isInteger(wrong) ? wrong : frac(k, D))) + ", qui ne vérifie pas l'énoncé."]),
        chk: [[Number.isInteger(x) && x / pa + k === x / pb, "énoncé"], [wrong !== x, "erreur visible"]], vals: [x, x / pa, x / pb] }); },
    // Est-ce une solution ? (MER FA191, FA192) : tester, y compris avec x², et l'équation dont tous les nombres sont solutions
    () => { let r1, r2, c0; do { r1 = R.int(2, 7); r2 = R.int(2, 9); c0 = pk([-4, -3, 1, 4, 5, 6, 8]); } while (r1 === r2 || r2 === -c0 || c0 === r1 || c0 === r2 || r1 * r2 > 45);
      const S = r1 + r2, P = r1 * r2, L = sh([r1, r2, -r2, c0]), w = who();
      let t, kk, e, f; do { t = pk([-4, -3, -2, 2, 3, 5]); kk = R.int(3, 6); e = R.int(1, 9); f = kk * t - e - t; } while (f === 0 || Math.abs(f) === 1);
      const mm = R.int(2, 5), nn = R.int(2, 6), val = (v) => v * v + P, rv = (v) => S * v;
      return X({ id: "eqverif", lv: 1, titre: "Est-ce une solution ?",
        q: "On considère l'équation " + M("x^2 + " + P + " = " + S + "x") + " et les nombres " + L.map((v) => M(v)).join(" ; ") + ".",
        parts: [{ label: "Teste chacun des quatre nombres. Lesquels sont solutions de l'équation ?", pts: 2 },
          { label: w.n + " affirme : « " + M(-r2) + " est aussi solution, puisque " + M("(" + -r2 + ")^2 = " + r2 + "^2") + " ». Explique pourquoi c'est faux.", pts: 1 },
          { label: "Teste les nombres " + M("0") + ", " + M("4") + " et " + M("-2") + " dans l'équation " + M(mm + "(x - " + nn + ") = " + mm + "x - " + mm * nn) + ". Que remarques-tu ? Explique.", pts: 2 },
          { label: "Pour quelle valeur de " + M("k") + " le nombre " + M(t) + " est-il solution de l'équation " + M("kx - " + e + " = " + lin(1, f)) + " ?", pts: 1 }],
        sol: ul([L.map((v) => "Pour " + M(v) + " : " + M(val(v)) + " et " + M(rv(v)) + (val(v) === rv(v) ? " : solution" : " : non")).join(" ; ") + ". Les solutions sont " + M(Math.min(r1, r2)) + " et " + M(Math.max(r1, r2)) + ".",
          "Le membre de gauche est bien le même (" + M(val(r2)) + "), mais celui de droite change de signe : " + M(S + " \\cdot (" + -r2 + ") = " + -S * r2) + ". Il faut tester les <b>deux</b> membres.",
          "Pour les trois nombres, les deux membres sont égaux (" + M(mm * (0 - nn)) + ", " + M(mm * (4 - nn)) + ", " + M(mm * (-2 - nn)) + ") : en développant, " + M(mm + "(x - " + nn + ") = " + mm + "x - " + mm * nn) + " pour tout " + M("x") + ". Tous les nombres sont solutions.",
          "On remplace " + M("x") + " par " + M(t) + " : " + M(sg(t) + "k - " + e + " = " + sg(t) + " + " + sg(f) + " = " + (t + f)) + ", " + M(sg(t) + "k = " + (t + f + e)) + ", " + M("k = " + kk) + "."]),
        chk: [[val(r1) === rv(r1) && val(r2) === rv(r2) && val(-r2) !== rv(-r2) && val(c0) !== rv(c0), "solutions"], [kk * t - e === t + f, "k"]], vals: [r1, r2, kk] }); },
  ];
  const RAISONE10 = [
    // Cherche l'erreur (MER FA201) : changer de membre sans changer le signe, diviser un seul terme, oublier de distribuer
    () => { const a = R.int(2, 5), m = R.int(1, 4), s = R.int(2, 7), b = a * m, c = a * s + b;
      let p, q, u, v, s2; do { p = R.int(3, 8); u = R.int(1, p - 2); q = R.int(1, 9); s2 = pk([2, 3, 4, 5, 6]); v = (p - u) * s2 - q; } while (v <= 0 || v === q);
      const k = R.int(2, 5), mm = R.int(2, 6), s3 = pk([-3, -2, 2, 3, 4, 5, 7, 8]), nn = k * (s3 - mm), w = who();
      return X({ id: "eq1", lv: 1, titre: "Cherche l'erreur",
        q: w.n + " a résolu trois équations. Chaque résolution contient <b>une</b> erreur." + tab(["", "résolution"], [["A", M(a + "x + " + b + " = " + c) + " ; " + M("x + " + b + " = " + c / a) + " ; " + M("x = " + (c / a - b))], ["B", M(p + "x - " + q + " = " + u + "x + " + v) + " ; " + M(p + "x - " + u + "x = " + v + " - " + q) + " ; " + M(lin(p - u, 0) + " = " + (v - q)) + " ; " + M("x = " + (Number.isInteger((v - q) / (p - u)) ? (v - q) / (p - u) : frac(v - q, p - u)))], ["C", M(k + "(x - " + mm + ") = " + nn) + " ; " + M(k + "x - " + mm + " = " + nn) + " ; " + M(k + "x = " + (nn + mm))]]),
        parts: [{ label: "Pour chaque résolution, trouve la ligne fausse et explique l'erreur.", pts: 3 }, { label: "Corrige les trois résolutions.", pts: 3 }, { label: "Vérifie ta solution de B dans l'équation de départ.", pts: 1 }],
        sol: ul(["A : on a divisé seulement " + M(a + "x") + " par " + a + " ; il faut diviser <b>chaque terme</b> (ou soustraire " + b + " d'abord). B : " + M(q) + " change de membre sans changer de signe ; il faut ajouter " + q + " des deux côtés. C : le " + k + " ne multiplie pas le " + mm + " ; il faut distribuer.",
          "A : " + M(a + "x = " + (c - b)) + ", " + M("x = " + s) + ". B : " + M(lin(p - u, 0) + " = " + v + " + " + q + " = " + (v + q)) + ", " + M("x = " + s2) + ". C : " + M(k + "x - " + k * mm + " = " + nn) + ", " + M(k + "x = " + (nn + k * mm)) + ", " + M("x = " + s3) + ".",
          M(p + " \\cdot " + s2 + " - " + q + " = " + (p * s2 - q)) + " et " + M(u + " \\cdot " + s2 + " + " + v + " = " + (u * s2 + v)) + " ✓."]),
        chk: [[p * s2 - q === u * s2 + v, "B"], [a * s + b === c && c / a - b !== s, "A"], [k * (s3 - mm) === nn, "C"]], vals: [s, s2, s3] }); },
    // Vrai ou faux ?
    () => VF({ id: "eq1", titre: "Vrai ou faux ? Justifie" }, [
      () => { const a = R.int(2, 6), b = R.int(1, 5), c = b + R.int(1, 4); return ["L'équation " + M(a + "x + " + b + " = " + a + "x + " + c) + " n'a aucune solution.", true, "Pour tout " + M("x") + ", le membre de droite vaut " + (c - b) + " de plus : en soustrayant " + M(a + "x") + ", il reste " + M(b + " = " + c) + ", faux."]; },
      () => { const a = R.int(5, 9), b = R.int(2, 4); return ["L'équation " + M(a + "x = " + b + "x") + " n'a pas de solution.", false, M("x = 0") + " est solution : " + M(a + " \\cdot 0 = " + b + " \\cdot 0") + ". En effet " + M((a - b) + "x = 0") + " donne " + M("x = 0") + "."]; },
      () => { const a = pk([3, 4, 5]), b = R.int(2, 9); return ["Si " + M("\\frac{x}{" + a + "} = " + b) + ", alors " + M("x = \\frac{" + b + "}{" + a + "}") + ".", false, "On multiplie les deux membres par " + a + " : " + M("x = " + a * b) + "."]; },
      () => { const a = R.int(2, 6), b = R.int(2, 6); return ["Tous les nombres sont solutions de " + M(a + "(x + " + b + ") = " + a + "x + " + a * b) + ".", true, "En développant, les deux membres sont égaux pour tout " + M("x") + "."]; },
      () => ["Multiplier les deux membres d'une équation par 0 donne une équation équivalente.", false, "On obtient " + M("0 = 0") + ", vrai pour tout nombre : on a perdu l'information. On multiplie ou on divise seulement par un nombre <b>non nul</b>."],
      () => { const b = R.int(3, 9); return [M("-x = " + b) + " donne " + M("x = " + b) + ".", false, "On multiplie par " + M("-1") + " : " + M("x = -" + b) + "."]; },
      () => { const b = pk([4, 9, 16, 25]); return ["L'équation " + M("x^2 = " + b) + " a une seule solution, " + M(Math.sqrt(b)) + ".", false, M("(-" + Math.sqrt(b) + ")^2 = " + b) + " aussi : il y a deux solutions, " + M(Math.sqrt(b)) + " et " + M(-Math.sqrt(b)) + "."]; },
    ]),
    // Équivalentes, mais comment ? (MER FA196) : justifier chaque passage
    () => { let k, m, n, p, x0, A, c0; do { k = R.int(2, 5); m = R.int(2, 3); n = R.int(1, 6); p = R.int(1, 7); x0 = pk([-5, -4, -3, -2, 2, 3, 4, 5, 6]); A = k * m - p; c0 = A * x0 - k * n; } while (A < 2 || c0 === 0 || c0 + k * n === 0 || p === k * m);
      const lines = [M(k + "(" + m + "x - " + n + ") = " + lin(p, c0)), M(k * m + "x - " + k * n + " = " + lin(p, c0)), M(lin(A, -k * n) + " = " + N(c0)), M(lin(A, 0) + " = " + N(c0 + k * n)), M("x = " + x0)];
      return X({ id: "eq1", lv: 2, titre: "Équivalentes, mais comment ?",
        q: "Voici une suite d'équations équivalentes :" + tab(["ligne", "équation"], lines.map((l, i) => [String(i + 1), l])),
        parts: [{ label: "Explique comment on passe de chaque ligne à la suivante.", pts: 3 }, { label: "Vérifie la solution dans l'équation de la ligne 1.", pts: 1 }, { label: "Pourquoi dit-on que ces cinq équations sont « équivalentes » ?", pts: 1 }],
        sol: ul(["1 → 2 : on développe (le " + k + " multiplie les deux termes). 2 → 3 : on soustrait " + M(p + "x") + " des deux membres. 3 → 4 : on ajoute " + k * n + " aux deux membres. 4 → 5 : on divise les deux membres par " + A + ".",
          M(k + " \\cdot (" + m + " \\cdot " + sg(x0) + " - " + n + ") = " + k * (m * x0 - n)) + " et " + M(p + " \\cdot " + sg(x0) + " + " + sg(c0) + " = " + (p * x0 + c0)) + " ✓.",
          "Elles ont les mêmes solutions (ici " + M("x = " + x0) + ") : chaque passage est une opération faite des deux côtés, qu'on peut défaire."]),
        chk: [[k * (m * x0 - n) === p * x0 + c0, "solution"]], vals: [x0, A] }); },
    // Trouve la bonne traduction (MER FA207)
    () => { const K = pk([24, 30, 36, 42, 48]), E = [["La somme d'un nombre et de sa moitié vaut " + K + ".", "x + \\frac{x}{2} = " + K, (2 * K) / 3], ["Le double d'un nombre, diminué de " + K + ", est égal à ce nombre.", "2x - " + K + " = x", K], ["Le double de la différence entre un nombre et " + K + " est égal à ce nombre.", "2(x - " + K + ") = x", 2 * K], ["La différence entre un nombre et sa moitié vaut " + K + ".", "x - \\frac{x}{2} = " + K, 2 * K]];
      const eqs = sh(E.map((e, i) => [e[1], i]).concat([["\\frac{x}{2} - " + K + " = x", -1]])), lab = (i) => String.fromCharCode(97 + eqs.findIndex((e) => e[1] === i));
      return X({ id: "probeq", lv: 1, titre: "Trouve la bonne traduction",
        q: "Phrases : " + E.map((e, i) => "(" + (i + 1) + ") " + e[0]).join(" ") + "<br>Équations : " + eqs.map((e, j) => String.fromCharCode(97 + j) + ") " + M(e[0])).join(" ; ") + ".",
        parts: [{ label: "Associe chaque phrase à son équation (une équation est en trop).", pts: 2 }, { label: "Résous les équations des phrases 1 et 2.", pts: 2 }, { label: "Les phrases 3 et 4 ont-elles la même solution ? Leurs équations sont-elles équivalentes ?", pts: 1 }],
        sol: ul(["(1) → " + lab(0) + ", (2) → " + lab(1) + ", (3) → " + lab(2) + ", (4) → " + lab(3) + ".", "(1) " + M("\\frac{3x}{2} = " + K) + ", " + M("x = " + (2 * K) / 3) + ". (2) " + M("x = " + K) + ".", "(3) " + M("2x - " + 2 * K + " = x") + ", " + M("x = " + 2 * K) + " ; (4) " + M("\\frac{x}{2} = " + K) + ", " + M("x = " + 2 * K) + ". Même solution : les deux équations sont équivalentes, même si elles ne se ressemblent pas."]),
        chk: [[(2 * K) % 3 === 0, "entier"]], vals: [(2 * K) / 3, K, 2 * K] }); },
    // Construis une équation
    () => { const t = pk([-7, -5, -4, -3, 3, 4, 6, 8, 9]), a = R.int(1, 5), w = who();
      return X({ id: "eq1", lv: 2, titre: "Construis une équation",
        q: "Il ne s'agit plus de résoudre, mais d'inventer des équations.",
        parts: [{ label: "Écris une équation avec des " + M("x") + " dans les deux membres et une parenthèse, dont la solution est " + M(t) + ". Vérifie-la.", pts: 2 }, { label: "Écris une équation qui n'a aucune solution.", pts: 1 }, { label: "Écris une équation dont tous les nombres sont solutions.", pts: 1 },
          { label: w.n + " affirme : « Une équation du 1er degré a toujours exactement une solution. » Qu'en penses-tu ?", pts: 1 }],
        sol: ul(["Par exemple " + M("2(x + " + a + ") = " + lin(1, 2 * a + t)) + " : pour " + M("x = " + t) + ", " + M("2 \\cdot " + sg(t + a) + " = " + 2 * (t + a)) + " et " + M(sg(t) + " + " + sg(2 * a + t) + " = " + 2 * (t + a)) + " ✓ (autres réponses possibles).", "Par exemple " + M("x + 1 = x + 2") + " : on obtient " + M("1 = 2") + ", faux.", "Par exemple " + M("3(x + 1) = 3x + 3") + " : on obtient " + M("0 = 0") + ", vrai.", "Faux : les parties b) et c) donnent des contre-exemples (aucune solution, tous les nombres)."]),
        chk: [[2 * (t + a) === t + 2 * a + t, "exemple"]], vals: [t, 2 * (t + a)].filter((v) => Math.abs(v) > 1) }); },
  ];
  /* grades : banque réservée à la 10e (richChapter, src/riche.js) : les ids eq1, eqfrac, probeq sont aussi ceux de RICH.eq1c (1re Collège, 11e). */
  RICH.eq10 = { ids: ["eqverif", "eq1", "eqfrac", "probeq"], label: "Équations (10e)", ex: EXE10, raison: RAISONE10, minutes: 45, grades: [10] };

})();

// ======================= 28.11 : nickel 10e, chapitre 8 Pythagore (archive/contenu_nickel10_ch8_28-11.md) =======================
// Test de préparation de 10e (« Je prépare une évaluation » → Théorème de Pythagore). Modèles : MER 10e, ch. 11 GMA (GM62
// échelle sous la fenêtre, GM63 armoire, GM64 casier de consigne et skis, GM68 trapèze rectangle, GM69 losange, GM70
// hauteur issue de l'angle droit, QSJ : repérer l'hypoténuse), modelés et non recopiés ; plan de cheminement 10e :
// plan (LC/LS) et espace (LS), PAS de réciproque, valeur exacte √n ou valeur arrondie. Avant le 28.11, la 10e recevait
// RICH.pyth11 (réciproque, racines simplifiées a√b, cônes : 11e). Bloc séparé (fin de fichier).
(function () {
  const { r6, N, Nk, A, Q, pk, sh, X, ul, who, VF } = RICHU;
  const rd = (v, s) => Math.round(v / s) * s;
  const Ad = (v, k) => Nk(v, k); /* valeur arrondie à k décimales (TeX) */
  const EXPY10 = [
    // L'échelle sous la fenêtre (MER GM62) : hypoténuse, cathète, question inverse
    () => { const h = pk([5, 5.5, 6, 6.5]), d = pk([1.5, 2, 2.5]), L = Math.sqrt(h * h + d * d), L2 = pk([5, 6, 7].filter((v) => v < L && v > h - 1.2)), h2 = r6(Math.min(h - pk([0.5, 0.8, 1]), rd(L2 * 0.92, 0.1))), d2 = Math.sqrt(L2 * L2 - h2 * h2), q4 = L2 / 4, h4 = Math.sqrt(L2 * L2 - q4 * q4);
      return X({ id: "pyth", lv: 1, titre: "L'échelle sous la fenêtre",
        q: "Une fenêtre se trouve à " + Q(h, "m") + " au-dessus du sol. On appuie une échelle contre le mur vertical : son sommet doit arriver juste sous la fenêtre.",
        parts: [{ label: "Le pied de l'échelle est à " + Q(d, "m") + " du mur. Quelle doit être la longueur de l'échelle (au centième) ?", pts: 2 },
          { label: "On n'a qu'une échelle de " + Q(L2, "m") + ". On veut atteindre " + Q(h2, "m") + " de haut. À quelle distance du mur faut-il placer le pied (au centième) ?", pts: 2 },
          { label: "Par sécurité, le pied doit être à environ un quart de la longueur de l'échelle. Avec l'échelle de " + Q(L2, "m") + " placée ainsi, quelle hauteur atteint-on (au centième) ? Est-ce assez pour la fenêtre ?", pts: 2 },
          { label: "Fais un croquis de la situation de la question a) et colorie l'hypoténuse.", pts: 1 }],
        sol: ul([M("L^2 = " + N(h) + "^2 + " + N(d) + "^2 = " + N(h * h + d * d)) + ", " + M("L = \\sqrt{" + N(h * h + d * d) + "} \\approx " + Ad(L, 2)) + " m.",
          "L'échelle est l'hypoténuse : on soustrait. " + M("x^2 = " + N(L2) + "^2 - " + N(h2) + "^2 = " + N(L2 * L2 - h2 * h2)) + ", " + M("x \\approx " + Ad(d2, 2)) + " m.",
          "Pied à " + M(N(L2) + " : 4 = " + N(q4)) + " m : " + M("\\sqrt{" + N(L2) + "^2 - " + N(q4) + "^2} \\approx " + Ad(h4, 2)) + " m. " + (h4 >= h ? "C'est assez : " + M(Ad(h4, 2) + " \\geq " + N(h)) + "." : "Ce n'est pas assez : " + M(Ad(h4, 2) + " < " + N(h)) + " m."),
          "Triangle rectangle formé par le mur (" + N(h) + " m), le sol (" + N(d) + " m) et l'échelle : l'échelle, en face de l'angle droit, est l'hypoténuse."]),
        chk: [[L2 < L && L2 > h2, "échelle possible"], [d2 > 0.3, "pied"]], vals: [L, d2, h4] }); },
    // Le losange (MER GM69) : demi-diagonales, périmètre, aire ; inverse
    () => { const [a, b, c] = pk([[6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20]]), s = pk([7.5, 6, 6.5]), dd = Math.sqrt(s * s - (s * 0.6) ** 2), w = who();
      return X({ id: "pythfig", lv: 1, titre: "Le losange",
        q: "Un carreau de vitrail a la forme d'un losange dont les diagonales mesurent " + Q(2 * a, "cm") + " et " + Q(2 * b, "cm") + ".",
        parts: [{ label: "Calcule la longueur d'un côté du losange.", pts: 2 }, { label: "Calcule son périmètre et son aire.", pts: 2 },
          { label: w.n + " écrit : « le côté vaut " + M("\\sqrt{" + 2 * a + "^2 + " + 2 * b + "^2}") + " ». Explique son erreur.", pts: 1 },
          { label: "Un autre losange a des côtés de " + Q(s, "cm") + " et une diagonale de " + Q(r6(2 * s * 0.6), "cm") + ". Calcule l'autre diagonale.", pts: 2 }],
        sol: ul(["Les diagonales se coupent en leur milieu à angle droit : " + M("c = \\sqrt{" + a + "^2 + " + b + "^2} = \\sqrt{" + c * c + "} = " + c) + " cm.",
          "Périmètre " + M("4 \\cdot " + c + " = " + 4 * c) + " cm ; aire " + M("\\frac{" + 2 * a + " \\cdot " + 2 * b + "}{2} = " + 2 * a * b) + " cm².",
          w.n + " a pris les diagonales entières : les cathètes du triangle rectangle sont les <b>demi</b>-diagonales, " + M(a) + " et " + M(b) + " cm.",
          "Demi-diagonale connue " + M(N(s * 0.6)) + " cm : " + M("\\sqrt{" + N(s) + "^2 - " + N(s * 0.6) + "^2} = \\sqrt{" + N(s * s - (s * 0.6) ** 2) + "} = " + N(dd)) + " cm, donc l'autre diagonale vaut " + M(N(2 * dd)) + " cm."]),
        chk: [[Math.abs(dd - s * 0.8) < 1e-9, "3-4-5"]], vals: [c, 4 * c, 2 * a * b, 2 * dd] }); },
    // La parcelle en trapèze rectangle (MER GM68) : hauteur, aire, clôture, coût ; figure (info spatiale, sans la hauteur)
    () => { const [p, h, s] = pk([[9, 12, 15], [12, 16, 20], [15, 20, 25], [10, 24, 26], [18, 24, 30]]), b = pk([20, 25, 30, 35]), B = b + p, Ar = ((B + b) * h) / 2, P = B + b + h + s, px = pk([4.5, 6, 7.5]);
      const fig = GEO().pt("A", 0, 0, false).pt("B", B, 0, false).pt("C", b, h, false).pt("E", 0, h, false).poly(["A", "B", "C", "E"]).right("A", "B", "E").right("E", "A", "C").side("A", "B", B + " m").side("E", "C", b + " m").side("B", "C", s + " m").svg("parcelle en trapèze rectangle");
      return X({ id: "pythfig", lv: 2, titre: "La parcelle",
        q: "Une parcelle a la forme d'un trapèze rectangle (deux angles droits) : ses côtés parallèles mesurent " + Q(B, "m") + " et " + Q(b, "m") + ", et le côté oblique " + Q(s, "m") + "." + fig,
        parts: [{ label: "Calcule la largeur de la parcelle (la distance entre les deux côtés parallèles).", pts: 2 }, { label: "Calcule son aire.", pts: 1 },
          { label: "On pose une clôture tout autour. Quelle longueur faut-il ?", pts: 1 }, { label: "Le gazon coûte " + M(Nk(px, 2) + "\\ \\text{CHF}") + " le m². Combien coûte le gazon pour toute la parcelle ?", pts: 1 }],
        sol: ul(["On abaisse la hauteur depuis l'extrémité du petit côté : triangle rectangle de cathètes " + M(B + " - " + b + " = " + p) + " m et " + M("h") + ", d'hypoténuse " + M(s) + " m. " + M("h = \\sqrt{" + s + "^2 - " + p + "^2} = \\sqrt{" + h * h + "} = " + h) + " m.",
          M("\\frac{(" + B + " + " + b + ") \\cdot " + h + "}{2} = " + N(Ar)) + " m².", M(B + " + " + b + " + " + h + " + " + s + " = " + P) + " m (le côté perpendiculaire mesure la largeur, " + h + " m).", M(N(Ar) + " \\cdot " + Nk(px, 2) + " = " + Nk(Ar * px, 2)) + " CHF."]),
        chk: [[p * p + h * h === s * s, "triplet"]], vals: [h, Ar, P, Ar * px] }); },
    // La hauteur sur l'hypoténuse (MER GM70) : cathète, aire de deux façons
    () => { const [a, b, c] = pk([[6, 8, 10], [9, 12, 15], [5, 12, 13], [8, 15, 17], [12, 16, 20]]), h = (a * b) / c, [L, l] = pk([[15, 8], [24, 7], [12, 5], [21, 20]]), dg = Math.sqrt(L * L + l * l), x = (L * l) / dg;
      return X({ id: "pyth", lv: 2, titre: "La hauteur sur l'hypoténuse",
        q: "Le triangle " + M("ABC") + " est rectangle en " + M("C") + ", avec " + M("AC = " + a) + " cm et " + M("AB = " + c) + " cm.",
        parts: [{ label: "Quel côté est l'hypoténuse ? Calcule " + M("BC") + ".", pts: 2 }, { label: "Calcule l'aire du triangle.", pts: 1 },
          { label: "Calcule la hauteur issue de " + M("C") + " (perpendiculaire à " + M("[AB]") + ") en écrivant l'aire d'une autre façon.", pts: 2 },
          { label: "Un rectangle mesure " + Q(L, "cm") + " sur " + Q(l, "cm") + ". Quelle est la distance d'un sommet à la diagonale qui ne passe pas par ce sommet (au centième) ?", pts: 2 }],
        sol: ul([M("[AB]") + ", en face de l'angle droit. " + M("BC = \\sqrt{" + c + "^2 - " + a + "^2} = \\sqrt{" + b * b + "} = " + b) + " cm.",
          M("\\frac{" + a + " \\cdot " + b + "}{2} = " + (a * b) / 2) + " cm² (les cathètes sont perpendiculaires : l'une est la hauteur de l'autre).",
          M("\\frac{" + c + " \\cdot h}{2} = " + (a * b) / 2) + ", donc " + M("h = \\frac{" + a * b + "}{" + c + "} = " + N(h)) + " cm.",
          "Diagonale " + M("\\sqrt{" + L + "^2 + " + l + "^2} = " + N(dg)) + " cm ; le demi-rectangle est un triangle rectangle d'aire " + M("\\frac{" + L + " \\cdot " + l + "}{2} = " + (L * l) / 2) + " cm², donc " + M("x = \\frac{" + L * l + "}{" + N(dg) + "} \\approx " + Ad(x, 2)) + " cm."]),
        chk: [[Number.isInteger(dg), "diagonale entière"]], vals: [b, (a * b) / 2, h, x] }); },
    // Le casier de consigne (MER GM64, espace : LS) ; figure du pavé (dimensions seulement)
    () => { const [w, H, p] = pk([[80, 150, 60], [60, 120, 45], [50, 160, 40], [70, 140, 55]]), df0 = Math.sqrt(w * w + H * H + p * p), S = Math.round(df0) + pk([-7, -4, 4, 7]), df = Math.sqrt(w * w + H * H), D = Math.sqrt(w * w + H * H + p * p), b = Math.sqrt(w * w + p * p), ok = S < D;
      return X({ id: "pythfig", lv: 3, titre: "Le casier de consigne",
        q: "Dans une gare, les casiers de consigne sont des pavés de " + Q(w, "cm") + " de large, " + Q(H, "cm") + " de haut et " + Q(p, "cm") + " de profondeur." + FIG.box(w + " cm", p + " cm", H + " cm"),
        parts: [{ label: "Calcule la diagonale de la face avant (largeur × hauteur), au dixième.", pts: 1 }, { label: "Calcule la grande diagonale du casier (d'un coin du bas au coin opposé du haut), au dixième.", pts: 2 },
          { label: "Peut-on y ranger une paire de skis de " + Q(S, "cm") + " ? Justifie.", pts: 1 }, { label: "Quelle est la plus longue canne qu'on peut poser à plat sur le fond du casier (au dixième) ?", pts: 1 }],
        sol: ul([M("\\sqrt{" + w + "^2 + " + H + "^2} = \\sqrt{" + (w * w + H * H) + "} \\approx " + Ad(df, 1)) + " cm.",
          "Triangle rectangle (diagonale de la face avant, profondeur) : " + M("\\sqrt{" + (w * w + H * H) + " + " + p + "^2} = \\sqrt{" + (w * w + H * H + p * p) + "} \\approx " + Ad(D, 1)) + " cm.",
          ok ? "Oui : " + M(S + " < " + Ad(D, 1)) + ", en les plaçant selon la grande diagonale." : "Non : " + M(S + " > " + Ad(D, 1)) + " ; même en diagonale, les skis sont trop longs.",
          "Diagonale du fond : " + M("\\sqrt{" + w + "^2 + " + p + "^2} = \\sqrt{" + (w * w + p * p) + "} \\approx " + Ad(b, 1)) + " cm."]),
        chk: [[Math.abs(S - D) > 3, "écart net"]], vals: [df, D, b] }); },
    // La pyramide (espace : LS) : demi-diagonale, hauteur, apothème
    () => { const [c, s, h] = pk([[8, 9, 7], [12, 11, 7], [16, 12, 4], [12, 9, 3]]), ap = Math.sqrt(s * s - (c / 2) ** 2);
      return X({ id: "pythfig", lv: 3, titre: "La pyramide",
        q: "Une pyramide régulière a une base carrée de " + Q(c, "cm") + " de côté ; ses quatre arêtes latérales mesurent " + Q(s, "cm") + ". Son sommet est à la verticale du centre de la base." + FIG.pyramid(c + " cm", "h"),
        parts: [{ label: "Calcule la diagonale de la base (valeur exacte et valeur au dixième).", pts: 1 }, { label: "Calcule la hauteur de la pyramide.", pts: 2 },
          { label: "Calcule l'apothème (hauteur d'une face triangulaire), au dixième.", pts: 2 }, { label: "Pourquoi utilise-t-on la demi-diagonale pour la hauteur, mais le demi-côté pour l'apothème ?", pts: 1 }],
        sol: ul([M("d = \\sqrt{" + c + "^2 + " + c + "^2} = \\sqrt{" + 2 * c * c + "} \\approx " + Ad(Math.sqrt(2 * c * c), 1)) + " cm.",
          "Triangle rectangle (hauteur, demi-diagonale, arête) : " + M("\\left(\\frac{d}{2}\\right)^2 = \\frac{" + 2 * c * c + "}{4} = " + c * c / 2) + ", " + M("h = \\sqrt{" + s + "^2 - " + c * c / 2 + "} = \\sqrt{" + h * h + "} = " + h) + " cm.",
          "Triangle rectangle (apothème, demi-côté, arête) : " + M("\\sqrt{" + s + "^2 - " + c / 2 + "^2} = \\sqrt{" + (s * s - c * c / 4) + "} \\approx " + Ad(ap, 1)) + " cm.",
          "Sous l'arête, le pied de la hauteur est le centre, au bout d'une demi-diagonale ; l'apothème tombe au milieu d'un côté de la base, à un demi-côté du coin."]),
        chk: [[s * s - c * c / 2 === h * h, "hauteur entière"]], vals: [h, ap] }); },
  ];
  const RAISONPY10 = [
    // Trouve l'erreur : additionner les côtés, oublier la racine, prendre l'hypoténuse pour une cathète
    () => { const [a, b, c] = pk([[6, 8, 10], [9, 12, 15], [5, 12, 13], [8, 15, 17]]), w = who(), w2 = who(w.n);
      return X({ id: "pyth", lv: 1, titre: "Trouve l'erreur",
        q: "Dans un triangle rectangle, les cathètes mesurent " + Q(a, "cm") + " et " + Q(b, "cm") + ". " + w.n + " répond « l'hypoténuse mesure " + M(a + b) + " cm », " + w2.n + " répond « elle mesure " + M(c * c) + " cm ». Puis, pour un triangle d'hypoténuse " + Q(c, "cm") + " et de cathète " + Q(a, "cm") + ", ils calculent l'autre cathète : " + M("\\sqrt{" + c + "^2 + " + a + "^2} \\approx " + Ad(Math.sqrt(c * c + a * a), 2)) + " cm.",
        parts: [{ label: "Explique l'erreur de " + w.n + ", puis celle de " + w2.n + ".", pts: 2 }, { label: "Quelle est l'erreur dans le calcul de l'autre cathète ? Comment pouvait-on voir, sans calculer, que le résultat est faux ?", pts: 2 }, { label: "Donne les bonnes réponses.", pts: 1 }],
        sol: ul([w.n + " a additionné les côtés : on additionne leurs <b>carrés</b>. " + w2.n + " a trouvé " + M("c^2 = " + c * c) + " mais a oublié la racine carrée.",
          "On a additionné les carrés alors qu'on cherche une cathète : il faut soustraire. Une cathète est toujours plus courte que l'hypoténuse : " + M(Ad(Math.sqrt(c * c + a * a), 2) + " > " + c) + ", c'est impossible.",
          "Hypoténuse " + M("\\sqrt{" + a * a + " + " + b * b + "} = " + c) + " cm ; autre cathète " + M("\\sqrt{" + c * c + " - " + a * a + "} = " + b) + " cm."]),
        vals: [a + b, c * c, c, b] }); },
    // Vrai ou faux ? Justifie (hypothèse « rectangle », carrés et racines, ordre des côtés)
    () => VF({ id: "pyth", titre: "Vrai ou faux ? Justifie" }, [
      () => ["Dans n'importe quel triangle, le carré du plus grand côté est égal à la somme des carrés des deux autres.", false, "Seulement dans un triangle <b>rectangle</b>. Contre-exemple : le triangle équilatéral de côté 2 : " + M("2^2 = 4") + " mais " + M("2^2 + 2^2 = 8") + "."],
      () => { const [a, b] = pk([[9, 16], [36, 64], [25, 144]]); return [M("\\sqrt{" + a + " + " + b + "} = \\sqrt{" + a + "} + \\sqrt{" + b + "}"), false, M("\\sqrt{" + (a + b) + "} = " + N(Math.sqrt(a + b))) + " mais " + M("\\sqrt{" + a + "} + \\sqrt{" + b + "} = " + (Math.sqrt(a) + Math.sqrt(b))) + " : la racine d'une somme n'est pas la somme des racines."]; },
      () => ["Dans un triangle rectangle, une cathète peut être plus longue que l'hypoténuse.", false, "Non : " + M("c^2 = a^2 + b^2 > a^2") + ", donc " + M("c > a") + " ; l'hypoténuse est toujours le plus long côté."],
      () => { const s = pk([5, 10, 20]); return ["La diagonale d'un carré de côté " + s + " cm mesure " + 2 * s + " cm.", false, M("\\sqrt{" + s + "^2 + " + s + "^2} = \\sqrt{" + 2 * s * s + "} \\approx " + Nk(Math.sqrt(2 * s * s), 1)) + " cm, moins que " + 2 * s + " cm (le chemin par deux côtés est plus long)."]; },
      () => ["Si on double les deux cathètes d'un triangle rectangle, l'hypoténuse double aussi.", true, "Exemple : cathètes 3 et 4 → hypoténuse 5 ; cathètes 6 et 8 → " + M("\\sqrt{36 + 64} = 10") + ". En général " + M("(2a)^2 + (2b)^2 = 4(a^2 + b^2) = (2c)^2") + "."],
      () => ["L'hypoténuse d'un triangle rectangle de cathètes 5 cm et 7 cm mesure entre 8 cm et 9 cm.", true, M("5^2 + 7^2 = 74") + ", et " + M("64 < 74 < 81") + " : " + M("8 < \\sqrt{74} < 9") + "."],
    ]),
    // Estimation et ordre de grandeur : encadrer avant de calculer
    () => { const [a, b] = pk([[4, 7], [5, 9], [3, 8], [6, 7]]), n = a * a + b * b, lo = Math.floor(Math.sqrt(n)), w = who();
      return X({ id: "pyth", lv: 2, titre: "Estime avant de calculer",
        q: "Un triangle rectangle a des cathètes de " + Q(a, "cm") + " et " + Q(b, "cm") + ".",
        parts: [{ label: "Sans calculatrice, entre quels nombres entiers consécutifs se trouve l'hypoténuse ? Explique.", pts: 2 },
          { label: "Explique pourquoi l'hypoténuse est forcément plus longue que " + Q(b, "cm") + " et plus courte que " + Q(a + b, "cm") + ".", pts: 2 },
          { label: w.n + " trouve " + M(N(rd(Math.sqrt(n) * 1.4, 0.1))) + " cm. Sans refaire le calcul, comment sais-tu que c'est faux ? Donne la valeur exacte et la valeur au dixième.", pts: 1 }],
        sol: ul([M(a + "^2 + " + b + "^2 = " + n) + " ; " + M(lo * lo + " < " + n + " < " + (lo + 1) ** 2) + ", donc l'hypoténuse est entre " + lo + " et " + (lo + 1) + " cm.",
          "L'hypoténuse est le plus long côté (" + M("c^2 = " + b + "^2 + " + a + "^2 > " + b + "^2") + ") ; et le chemin direct est plus court que le chemin par les deux cathètes (" + M(n + " < (" + a + " + " + b + ")^2 = " + (a + b) ** 2) + ").",
          M(N(rd(Math.sqrt(n) * 1.4, 0.1))) + " n'est pas entre " + lo + " et " + (lo + 1) + ". Valeur exacte " + M("\\sqrt{" + n + "}") + ", soit " + M("\\approx " + Nk(Math.sqrt(n), 1)) + " cm."]),
        chk: [[!Number.isInteger(Math.sqrt(n)), "non entier"], [rd(Math.sqrt(n) * 1.4, 0.1) > lo + 1, "réponse fausse hors encadrement"]], vals: [n, lo, lo + 1] }); },
    // Où est l'hypoténuse ? Écrire la relation (QSJ MER 10e : repérer le triangle rectangle et son hypoténuse)
    () => { const [P, Qn, Rn] = sh(["P", "Q", "R"]), [a, b, c] = pk([[20, 21, 29], [9, 40, 41], [12, 35, 37], [7, 24, 25]]);
      return X({ id: "pyth", lv: 2, titre: "Où est l'hypoténuse ?",
        q: "Le triangle " + M(P + Qn + Rn) + " est rectangle en " + M(Qn) + ". On connaît " + M(P + Qn + " = " + a) + " cm et " + M(P + Rn + " = " + c) + " cm.",
        parts: [{ label: "Quel côté est l'hypoténuse ? Écris l'égalité de Pythagore pour ce triangle.", pts: 2 }, { label: "Calcule " + M(Qn + Rn) + ".", pts: 2 }, { label: "Calcule le périmètre et l'aire du triangle.", pts: 1 }],
        sol: ul(["L'hypoténuse est le côté opposé à l'angle droit en " + M(Qn) + " : " + M("[" + P + Rn + "]") + ". " + M(P + Rn + "^2 = " + P + Qn + "^2 + " + Qn + Rn + "^2") + ".",
          M(Qn + Rn + "^2 = " + c + "^2 - " + a + "^2 = " + (c * c - a * a)) + ", donc " + M(Qn + Rn + " = " + b) + " cm.",
          "Périmètre " + M(a + " + " + b + " + " + c + " = " + (a + b + c)) + " cm ; aire " + M("\\frac{" + a + " \\cdot " + b + "}{2} = " + (a * b) / 2) + " cm²."]),
        vals: [b, a + b + c, (a * b) / 2] }); },
  ];
  /* grades : banque réservée à la 10e (richChapter, src/riche.js) ; ids aussi présents dans RICH.pyth11 (11e). */
  RICH.pyth10 = { ids: ["pyth", "pythfig"], label: "Théorème de Pythagore (10e)", ex: EXPY10, raison: RAISONPY10, minutes: 45, grades: [10] };
})();
