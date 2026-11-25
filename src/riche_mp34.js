// MP 3e et MP 4e (24.11) : sujets de préparation riches des chapitres A à J (polycopiés CFPT MP3 et MP4).
// Exercices contextualisés en plusieurs étapes, modelés sur les problèmes des polycopiés (robinets, train, demi-vie,
// placements, silos, bouteilles semblables, drone, radar, grande roue, abonnements…) — jamais recopiés tels quels.
// Niveau MP : calculatrice autorisée, méthodes guidées, beaucoup plus simple que le Collège. Outils communs : RX
// (riche_mp2.js). Banques réservées à la MP (track: "mp").
// Exposants : « ^{\,1{,}5} » plutôt que « ^{1{,}5} » (le test des écritures triviales lit « ^{1 » comme un exposant 1).
(function () {
  if (typeof RX === "undefined" || typeof RICH === "undefined") return;
  const { r6, N, A, Q, pk, FR, sg, par, X, ul, VF, shuffle, D } = RX;
  const T = (v) => M(N(v));
  const tx = (v) => N(v).replace("{,}", ",").replace(/\\text\{'\}/g, "'");
  const FRp = (v) => FR(v).replace(/^(-?)\\frac\{(\d+)\}\{(\d+)\}$/, "$1$2/$3");
  const pt = (x, y, z) => "(" + FR(x) + " \\,;\\, " + FR(y) + (z === undefined ? "" : " \\,;\\, " + FR(z)) + ")";
  const vc = (x, y, z) => "\\begin{pmatrix} " + FR(x) + " \\\\ " + FR(y) + (z === undefined ? "" : " \\\\ " + FR(z)) + " \\end{pmatrix}";
  // Polynôme (coefficients du plus haut degré au terme constant) ; termes nuls omis.
  const poly = (c, x = "x") => { const n = c.length - 1; let s = ""; c.forEach((a, i) => { const e = n - i; if (Math.abs(a) < 1e-12) return; const mono = e === 0 ? N(Math.abs(a)) : (Math.abs(Math.abs(a) - 1) < 1e-12 ? "" : N(Math.abs(a))) + x + (e > 1 ? "^{" + e + "}" : ""); s += s ? (a < 0 ? " - " : " + ") + mono : (a < 0 ? "-" : "") + mono; }); return s || "0"; };
  const fac = (r, x = "x") => "(" + x + (r < 0 ? " + " + N(-r) : " - " + N(r)) + ")";
  // Notation scientifique m · 10^e : [mantisse arrondie, exposant].
  const sci = (v, k = 2) => { let e = Math.floor(Math.log10(v)), m = +(v / Math.pow(10, e)).toFixed(k); if (m >= 10) { m = +(m / 10).toFixed(k); e++; } return [m, e]; };
  const sciT = (v, k = 2) => { const [m, e] = sci(v, k); return N(m) + " \\cdot 10^{" + e + "}"; };
  const deg = (r) => (r * 180) / Math.PI;
  const de = (w) => (/^[aeéiouh]/.test(w) ? "d'" : "de ") + w; /* « d'heures », « de jours » */
  const tous = (w) => (/^(heures|minutes|semaines)/.test(w) ? "toutes les " : "tous les "); /* tous les 8 jours, toutes les 6 heures */
  const cap = (w) => w.charAt(0).toUpperCase() + w.slice(1);
  const mo = (v) => M((Number.isInteger(r6(v)) ? N(v) : r6(v).toFixed(2).replace(".", "{,}")) + "\\ \\text{CHF}"); /* prix : 3,60 CHF */
  const eqA = (v) => (Number.isInteger(r6(v)) ? "= " + N(v) : "\\approx " + A(v, 2)); /* « = 10 » ou « ≈ 7,07 » (24.11) */
  const lin1 = (x0, a, p) => (x0 ? x0 + (a < 0 ? " - " : " + ") : a < 0 ? "-" : "") + (Math.abs(a) === 1 ? "" : Math.abs(a)) + p; /* x0 + a·p */

  // ===================== MP 3e · A. Équations avancées =====================
  const EXA = [
    // Travail en commun (équation rationnelle)
    () => { const [a, b] = pk([[6, 12], [3, 6], [4, 12], [10, 15], [12, 24], [20, 30], [6, 3]]), c = (a * b) / (a + b), K = pk([
        { t: "Deux robinets", A: "Le robinet A", Al: "le robinet A", B: "le robinet B", seul: "seul", job: "remplit le bassin", job2: "remplir les trois quarts du bassin", un: "h", unl: "heure", inut: "Le bassin contient 12 m³ d'eau quand il est plein." },
        { t: "Deux imprimantes", A: "L'imprimante A", Al: "l'imprimante A", B: "l'imprimante B", seul: "seule", job: "imprime toutes les copies d'un examen", job2: "imprimer les trois quarts des copies", un: "min", unl: "minute", inut: "Chaque copie compte 4 pages." },
        { t: "Deux peintres", A: "Le peintre A", Al: "le peintre A", B: "le peintre B", seul: "seul", job: "peint la façade", job2: "peindre les trois quarts de la façade", un: "h", unl: "heure", inut: "La façade mesure 9 m de haut." }]);
      return X({ id: "eqratmp", lv: 1, titre: K.t,
        q: K.A + " " + K.job + " en " + Q(a, K.un) + ". Quand " + K.Al + " et " + K.B + " travaillent ensemble, le travail est fait en " + Q(c, K.un) + ". " + K.inut + " On cherche la durée " + M("t") + " (en " + K.un + ") dont " + K.B + " a besoin " + K.seul + ".",
        parts: [{ label: "Quelle fraction du travail est faite en une " + K.unl + " par " + K.Al + " ? Par les deux ensemble ?", pts: 1 }, { label: "Écris une équation d'inconnue " + M("t") + " (avec sa valeur interdite) et résous-la.", pts: 2 }, { label: "Combien de temps faut-il aux deux ensemble pour " + K.job2 + " ?", pts: 1 }],
        sol: ul([M("\\frac{1}{" + a + "}") + " du travail ; ensemble " + M("\\frac{1}{" + N(c) + "}") + ".", M("\\frac{1}{" + a + "} + \\frac{1}{t} = \\frac{1}{" + N(c) + "}") + " avec " + M("t \\neq 0") + " ; " + M("\\frac{1}{t} = \\frac{1}{" + N(c) + "} - \\frac{1}{" + a + "} = \\frac{1}{" + b + "}") + ", donc " + M("t = " + b) + " " + K.un + ".", M("\\frac{3}{4} \\cdot " + N(c) + " = " + N(0.75 * c)) + " " + K.un + ". La phrase « " + K.inut.replace(/\.$/, "") + " » ne sert à rien."]),
        chk: [[(a * c) / (a - c), String(b)], [0.75 * c, N(0.75 * c)]] }); },
    // Le trajet plus rapide (équation rationnelle → 2e degré)
    () => { const K = pk([{ veh: "Un train", f: 0, D: 300, v: 50, dv: 10, dt: 1 }, { veh: "Un train régional", f: 0, D: 240, v: 60, dv: 20, dt: 1 }, { veh: "Un car", f: 0, D: 200, v: 80, dv: 20, dt: 0.5 }, { veh: "Une cycliste", f: 1, D: 60, v: 15, dv: 5, dt: 1 }, { veh: "Un bus", f: 0, D: 200, v: 40, dv: 10, dt: 1 }]);
      const { D: Dk, v, dv, dt } = K, Kc = v * (v + dv), du = Dk / v, dtT = dt === 1 ? "une heure" : "une demi-heure", il = K.f ? "elle" : "il";
      return X({ id: "eqratmp", lv: 2, titre: "Le trajet plus rapide",
        q: K.veh + " parcourt " + Q(Dk, "km") + " à vitesse constante. " + (K.f ? "Si elle" : "S'il") + " roulait " + Q(dv, "km/h") + " plus vite, " + il + " arriverait " + dtT + " plus tôt. On note " + M("v") + " sa vitesse habituelle (en km/h).",
        parts: [{ label: "Exprime la durée du trajet habituel et celle du trajet plus rapide en fonction de " + M("v") + ".", pts: 1 }, { label: "Écris l'équation qui traduit l'énoncé. Quelles sont les valeurs interdites ?", pts: 1 }, { label: "Montre qu'elle revient à " + M("v^2 + " + dv + "v - " + N(Kc) + " = 0") + ", puis résous-la.", pts: 2 }, { label: "Quelle solution garder ? Quelle est la durée du trajet habituel ?", pts: 1 }],
        sol: ul([M("\\frac{" + Dk + "}{v}") + " et " + M("\\frac{" + Dk + "}{v + " + dv + "}") + " (en heures).", M("\\frac{" + Dk + "}{v} - \\frac{" + Dk + "}{v + " + dv + "} = " + N(dt)) + " ; valeurs interdites " + M("0") + " et " + M("-" + dv) + ".", "On multiplie par " + M("v(v + " + dv + ")") + " : " + M(Dk + "(v + " + dv + ") - " + Dk + "v = " + (dt === 1 ? "" : N(dt) + " \\cdot ") + "v(v + " + dv + ")") + ", donc " + M(N(Dk * dv) + " = " + (dt === 1 ? "" : N(dt)) + "v^2 + " + N(dt * dv) + "v") + (dt === 1 ? "" : " ; on divise par " + M(N(dt))) + ". D'où " + M("v^2 + " + dv + "v - " + N(Kc) + " = 0") + ". " + M("\\Delta = " + dv * dv + " + 4 \\cdot " + N(Kc) + " = " + N(dv * dv + 4 * Kc)) + ", " + M("\\sqrt{\\Delta} = " + (2 * v + dv)) + " : " + M("v = " + v) + " ou " + M("v = -" + (v + dv)) + ".", "Une vitesse est positive : " + M("v = " + v) + " km/h. Durée " + M("\\frac{" + Dk + "}{" + v + "} = " + N(du)) + " h (vérification : " + M("\\frac{" + Dk + "}{" + (v + dv) + "} = " + N(Dk / (v + dv))) + " h, soit " + tx(dt) + " h de moins)."]),
        chk: [[v, String(v)], [-(v + dv), String(-(v + dv))], [du, N(du)], [Dk / v - Dk / (v + dv), N(dt)]] }); },
    // Le nombre mystère (équation irrationnelle, solution parasite)
    () => { let r, b, s, a; do { r = pk([3, 4, 5]); b = pk([2, 3, 5, 6]); s = b + r; a = r * r - s; } while (a < 2 || b + 1 === r); const s2 = b + 1 - r, c0 = b * b - a;
      return X({ id: "eqirrmp", lv: 2, titre: "Le nombre mystère",
        q: "La racine carrée d'un nombre augmenté de " + a + " est égale à ce nombre diminué de " + b + ". Quel est ce nombre ?",
        parts: [{ label: "Traduis l'énoncé par une équation d'inconnue " + M("x") + ".", pts: 1 }, { label: "Quelles conditions " + M("x") + " doit-il vérifier ?", pts: 1 }, { label: "Élève au carré et résous l'équation obtenue.", pts: 2 }, { label: "Vérifie chaque solution et conclus.", pts: 1 }],
        sol: ul([M("\\sqrt{x + " + a + "} = x - " + b), "Sous la racine : " + M("x \\geq -" + a) + " ; une racine n'est jamais négative : " + M("x - " + b + " \\geq 0") + ", donc " + M("x \\geq " + b) + ".", M("x + " + a + " = x^2 - " + 2 * b + "x + " + b * b) + " ⟺ " + M(poly([1, -(2 * b + 1), c0]) + " = 0") + " : " + M("x = " + s) + " ou " + M("x = " + s2) + ".", "Pour " + M("x = " + s) + ", " + M("\\sqrt{" + (s + a) + "} = " + r) + " et " + M(s + " - " + b + " = " + r) + " ✓. " + M("x = " + s2) + " ne vérifie pas " + M("x \\geq " + b) + " (" + M("\\sqrt{" + (s2 + a) + "} = " + (r - 1)) + " mais " + M(s2 + " - " + b + " = " + (s2 - b)) + ") : solution parasite. Le nombre est " + M(s) + "."]),
        chk: [[s, String(s)], [s2, String(s2)], [Math.sqrt(s + a), String(r)]] }); },
    // Le pendule (racine carrée dans une formule)
    () => { const g = 9.81, L1 = pk([0.25, 0.5, 0.8, 1.2]), T2 = pk([1.5, 2.5, 3]), L3 = pk([16, 25, 36]), T1 = 2 * Math.PI * Math.sqrt(L1 / g), L2 = g * Math.pow(T2 / (2 * Math.PI), 2), T3 = 2 * Math.PI * Math.sqrt(L3 / g), obj = pk(["une horloge à balancier", "une balançoire", "un pendule de laboratoire"]);
      return X({ id: "eqirrmp", lv: 1, titre: "Le pendule",
        q: "La période d'un pendule (durée d'un aller-retour, en s) vaut " + M("T = 2\\pi\\sqrt{\\frac{L}{9{,}81}}") + ", où " + M("L") + " est sa longueur en mètres. La formule s'applique aussi bien à " + obj + " qu'à un fil lesté.",
        parts: [{ label: "Calcule la période d'un pendule de " + Q(L1, "m") + " (au centième).", pts: 1 }, { label: "Quelle longueur faut-il pour une période de " + Q(T2, "s") + " (au centième de m) ?", pts: 2 }, { label: "Période d'un grand pendule de " + Q(L3, "m") + " (au centième) ?", pts: 1 }, { label: "Par combien faut-il multiplier la longueur pour doubler la période ?", pts: 1 }],
        sol: ul([M("T = 2\\pi\\sqrt{\\frac{" + N(L1) + "}{9{,}81}} \\approx " + A(T1, 2)) + " s.", M(N(T2) + " = 2\\pi\\sqrt{\\frac{L}{9{,}81}}") + " ⟺ " + M("\\sqrt{\\frac{L}{9{,}81}} = \\frac{" + N(T2) + "}{2\\pi}") + " ⟺ " + M("L = 9{,}81 \\cdot \\left(\\frac{" + N(T2) + "}{2\\pi}\\right)^2 \\approx " + A(L2, 2)) + " m.", M("T \\approx " + A(T3, 2)) + " s.", "Par 4 : " + M("\\sqrt{4L} = 2\\sqrt{L}") + ", la période double."]),
        chk: [[T1, A(T1, 2), 0.01], [L2, A(L2, 2), 0.01], [T3, A(T3, 2), 0.01]] }); },
    // La diagonale (équation bicarrée)
    () => { const [obj, un, a, b, d] = pk([["Un terrain de sport rectangulaire", "m", 12, 16, 20], ["Une table rectangulaire", "dm", 6, 8, 10], ["Un panneau publicitaire rectangulaire", "m", 5, 12, 13], ["Un champ rectangulaire", "m", 15, 20, 25], ["Une porte de garage", "dm", 9, 12, 15], ["Une plaque de contreplaqué", "dm", 8, 15, 17]]), P = a * b;
      return X({ id: "eqbic", lv: 2, titre: "La diagonale",
        q: obj + " a une aire de " + Q(P, un + "^2") + " et une diagonale de " + Q(d, un) + ". On cherche ses dimensions ; on note " + M("x") + " sa largeur.",
        parts: [{ label: "Exprime la longueur à l'aide de " + M("x") + " et de l'aire.", pts: 1 }, { label: "Avec Pythagore, montre que " + M("x^4 - " + d * d + "x^2 + " + N(P * P) + " = 0") + ".", pts: 2 }, { label: "Résous cette équation en posant " + M("X = x^2") + ".", pts: 2 }, { label: "Donne les dimensions et le périmètre.", pts: 1 }],
        sol: ul(["Longueur " + M("\\frac{" + P + "}{x}") + ".", M("x^2 + \\left(\\frac{" + P + "}{x}\\right)^2 = " + d + "^2") + " ; on multiplie par " + M("x^2") + " : " + M("x^4 + " + N(P * P) + " = " + d * d + "x^2") + ", d'où l'équation.", M("X^2 - " + d * d + "X + " + N(P * P) + " = 0") + ", " + M("\\Delta = " + N(d ** 4) + " - " + N(4 * P * P) + " = " + N((b * b - a * a) ** 2)) + " : " + M("X = " + a * a) + " ou " + M("X = " + b * b) + ". Puis " + M("x^2 = " + a * a) + " ou " + M("x^2 = " + b * b) + " : " + M("x = \\pm " + a) + " ou " + M("x = \\pm " + b) + ".", "Une longueur est positive : " + Q(a, un) + " sur " + Q(b, un) + " (les deux solutions positives donnent le même rectangle). Périmètre " + Q(2 * (a + b), un) + "."]),
        chk: [[Math.sqrt(a * a), String(a)], [b, String(b)], [2 * (a + b), String(2 * (a + b))], [P / a, String(b)]] }); },
    // Tolérances (valeur absolue)
    () => { const K = pk([
        { t: "Le contrôle de qualité", c: pk([120, 150, 250]), e: pk([0.5, 0.8, 1.2]), txt: (c, e) => "Une machine découpe des tiges de longueur nominale " + Q(c, "mm") + ". Une tige est acceptée si sa longueur " + M("x") + " (en mm) diffère d'au plus " + Q(e, "mm") + " de la longueur nominale.", lim: "les longueurs limites acceptées", q3: (x) => "Une tige mesure " + Q(x, "mm") + ". Est-elle acceptée ?", oui: "acceptée", non: "refusée", all: "les longueurs acceptées" },
        { t: "Les stations-service", c: pk([47, 63, 85]), e: pk([12, 15, 18]), txt: (c, e) => "Sur une autoroute, une sortie se trouve à la borne kilométrique " + c + ". Deux stations-service sont à " + Q(e, "km") + " de cette sortie, une de chaque côté. On note " + M("x") + " la borne d'une station.", lim: "les bornes des deux stations", q3: (x) => "Une aire de repos est à la borne " + tx(x) + ". Est-elle plus près de la sortie que les stations ?", oui: "oui, plus près", non: "non, plus loin", all: "les bornes qui ne sont pas plus loin de la sortie que les stations" },
        { t: "Le thermostat", c: pk([19, 20, 21]), e: pk([1.5, 2]), txt: (c, e) => "Le chauffage d'une salle de classe est réglé sur " + c + " °C. Il réagit (marche ou arrêt) dès que la température " + M("x") + " (en °C) s'écarte de " + tx(e) + " °C de cette valeur.", lim: "les températures où le chauffage réagit", q3: (x) => "Le thermomètre indique " + tx(x) + " °C. Le chauffage a-t-il réagi ?", oui: "non, pas encore", non: "oui, il a réagi", all: "les températures où le chauffage ne réagit pas encore" }]);
      const { c, e } = K, dl = r6(pk([-1, 1]) * pk([0.4, 0.7, 1.5, 2.5]) * e), x0 = r6(c + dl), dd = Math.abs(dl);
      return X({ id: "eqabs", lv: 1, titre: K.t,
        q: K.txt(c, e),
        parts: [{ label: "Écris une équation avec une valeur absolue dont les solutions sont " + K.lim + ".", pts: 1 }, { label: "Résous-la.", pts: 1 }, { label: K.q3(x0), pts: 1 }, { label: "Écris l'inéquation qui décrit " + K.all + ", puis donne-les sous forme d'encadrement.", pts: 1 }],
        sol: ul([M("|x - " + c + "| = " + N(e)) + ".", M("x - " + c + " = " + N(e)) + " ou " + M("x - " + c + " = -" + N(e)) + ", donc " + M("x = " + N(c + e)) + " ou " + M("x = " + N(c - e)) + ".", M("|" + N(x0) + " - " + c + "| = " + N(dd)) + (dd < e ? " est plus petit que " : " est plus grand que ") + M(N(e)) + " : " + (dd < e ? K.oui : K.non) + ".", M("|x - " + c + "| \\leq " + N(e)) + " ⟺ " + M(N(c - e) + " \\leq x \\leq " + N(c + e)) + "."]),
        chk: [[c - e, N(c - e)], [c + e, N(c + e)], [dd, N(dd)]] }); },
    // À égale distance (|A| = |B|)
    () => { let a, b2, p, q; do { a = R.int(2, 15); b2 = a + 2 * R.int(2, 9) + pk([0, 1]); p = R.int(2, 9); q = R.int(1, 8); } while (p === q || p + q === (p - q) / 3);
      const m = (a + b2) / 2, x1 = p + q, x2 = (p - q) / 3, v2 = (p + 2 * q) / 3, who = pk(["La commune", "La société de transport", "L'association du quartier"]);
      return X({ id: "eqabs", lv: 3, titre: "À égale distance",
        q: "Le long d'une route droite, deux arrêts de bus sont aux bornes " + a + " et " + b2 + " (en km). " + who + " veut construire un abri à égale distance des deux arrêts, à la borne " + M("x") + ".",
        parts: [{ label: "Écris une équation avec deux valeurs absolues et résous-la.", pts: 2 }, { label: "Explique pourquoi l'un des deux cas n'a pas de solution.", pts: 1 }, { label: "Résous de même " + M("|2x - " + p + "| = |x + " + q + "|") + ".", pts: 2 }, { label: "Vérifie la solution non entière (ou la plus petite) de la question c.", pts: 1 }],
        sol: ul([M("|x - " + a + "| = |x - " + b2 + "|") + " ⟺ " + M("x - " + a + " = -(x - " + b2 + ")") + " ⟺ " + M("2x = " + (a + b2)) + " ⟺ " + M("x = " + N(m)) + " (le milieu).", "L'autre cas, " + M("x - " + a + " = x - " + b2) + ", donne " + M("-" + a + " = -" + b2) + " : impossible.", M("2x - " + p + " = x + " + q) + " donne " + M("x = " + x1) + " ; " + M("2x - " + p + " = -(x + " + q + ")") + " donne " + M("3x = " + (p - q)) + ", " + M("x = " + FR(x2)) + ".", "Pour " + M("x = " + FR(x2)) + ", " + M("|2x - " + p + "| = " + FR(Math.abs(2 * x2 - p))) + " et " + M("|x + " + q + "| = " + FR(Math.abs(x2 + q))) + " ✓."]),
        chk: [[m, N(m)], [x1, String(x1)], [x2, FRp(x2)], [Math.abs(2 * x2 - p), FRp(v2)]] }); },
  ];
  const RAISONA = [
    () => { let r, b, s, a; do { r = pk([3, 4, 5]); b = pk([2, 3, 4, 5]); s = b + r; a = r * r - s; } while (a < 2 || b + 1 === r); const s2 = b + 1 - r, w = RX.who();
      return X({ id: "eqirrmp", lv: 1, titre: "Trouve l'erreur",
        q: w + " résout " + M("\\sqrt{x + " + a + "} = x - " + b) + " : « J'élève au carré, " + M(poly([1, -(2 * b + 1), b * b - a]) + " = 0") + ", donc " + M("S = \\{" + s2 + " \\,;\\, " + s + "\\}") + ". »",
        parts: [{ label: "Quelle étape manque ?", pts: 1 }, { label: "Donne le bon ensemble des solutions.", pts: 1 }],
        sol: ul(["Les solutions n'ont pas été vérifiées : élever au carré peut ajouter des solutions parasites (il fallait " + M("x \\geq " + b) + ").", "Pour " + M("x = " + s2) + ", " + M("\\sqrt{" + (s2 + a) + "} = " + (r - 1)) + " mais " + M(s2 + " - " + b + " = " + (s2 - b)) + " ✗. " + M("S = \\{" + s + "\\}") + "."]),
        chk: [[s, String(s)]] }); },
    () => VF("eqabs", 1, [["« " + M("|x - 4| = -3") + " n'a pas de solution. »", true, "Une valeur absolue est une distance : elle n'est jamais négative."],
      ["« " + M("|x + 5|") + " est la distance entre " + M("x") + " et 5. »", false, M("|x + 5| = |x - (-5)|") + " : c'est la distance entre " + M("x") + " et " + M("-5") + "."],
      ["« " + M("x^4 - 5x^2 + 4 = 0") + " a quatre solutions. »", true, "Avec " + M("X = x^2") + ", " + M("X^2 - 5X + 4 = 0") + " donne " + M("X = 1") + " ou " + M("X = 4") + ", donc " + M("x = \\pm 1") + " ou " + M("x = \\pm 2") + "."],
      ["« " + M("x^4 + 5x^2 + 4 = 0") + " a quatre solutions. »", false, M("X = -1") + " ou " + M("X = -4") + " : un carré n'est jamais négatif, aucune solution."],
      ["« Élever au carré les deux membres d'une équation ne change pas ses solutions. »", false, "Contre-exemple : " + M("x = 3") + " a une solution, " + M("x^2 = 9") + " en a deux. D'où les solutions parasites."],
      ["« " + M("x = 2") + " peut être solution de " + M("\\frac{5}{x - 2} = 1 + \\frac{3}{x - 2}") + ". »", false, M("x = 2") + " annule les dénominateurs : c'est une valeur interdite."],
      ["« " + M("\\sqrt{x - 1} = -3") + " n'a pas de solution. »", true, "Une racine carrée n'est jamais négative."]]),
    () => { const c = R.int(2, 7), w = RX.who();
      return X({ id: "eqratmp", lv: 2, titre: "Trouve l'erreur",
        q: w + " résout " + M("\\frac{x^2}{x - " + c + "} = \\frac{" + c * c + "}{x - " + c + "}") + " : « Les dénominateurs sont égaux, donc " + M("x^2 = " + c * c) + " et " + M("S = \\{-" + c + " \\,;\\, " + c + "\\}") + ". »",
        parts: [{ label: "Quelle est l'erreur ?", pts: 1 }, { label: "Donne le bon ensemble des solutions.", pts: 1 }],
        sol: ul([M(c) + " est une valeur interdite : il annule le dénominateur.", M("S = \\{-" + c + "\\}") + " (vérification : " + M("\\frac{" + c * c + "}{" + -2 * c + "}") + " des deux côtés)."]),
        chk: [[-c, String(-c)]] }); },
    () => { const [m, n] = pk([[4, 9], [1, 16], [4, 25], [9, 16], [1, 9], [9, 25]]), w = RX.who();
      return X({ id: "eqbic", lv: 2, titre: "Trouve l'erreur",
        q: w + " résout " + M("x^4 - " + (m + n) + "x^2 + " + m * n + " = 0") + " : « Je pose " + M("X = x^2") + ", " + M("X^2 - " + (m + n) + "X + " + m * n + " = 0") + ", donc " + M("S = \\{" + m + " \\,;\\, " + n + "\\}") + ". »",
        parts: [{ label: "Quelle est l'erreur ?", pts: 1 }, { label: "Donne le bon ensemble des solutions.", pts: 1 }],
        sol: ul([M(m) + " et " + M(n) + " sont les valeurs de " + M("X") + " : il faut revenir à " + M("x") + " avec " + M("x^2 = X") + ".", M("x^2 = " + m) + " ou " + M("x^2 = " + n) + ", donc " + M("S = \\{-" + Math.sqrt(n) + " \\,;\\, -" + Math.sqrt(m) + " \\,;\\, " + Math.sqrt(m) + " \\,;\\, " + Math.sqrt(n) + "\\}") + "."]),
        chk: [[Math.sqrt(n), String(Math.sqrt(n))]] }); },
  ];

  // ===================== MP 3e · B–C. Puissances, exponentielles et logarithmes =====================
  const EXL = [
    // Le placement (intérêts composés)
    () => { const C0 = pk([2000, 5000, 8000, 12000]), t = pk([1.5, 2, 2.5, 3]), n = pk([5, 8, 10]), Y = pk([10, 12, 15]), q = 1 + t / 100, Cn = C0 * Math.pow(q, n), nd = Math.log(2) / Math.log(q), n2 = Math.ceil(nd), tY = (Math.pow(2, 1 / Y) - 1) * 100, obj = pk(["un compte épargne", "un 3e pilier", "un livret jeunesse"]);
      return X({ id: "croissexp", lv: 1, titre: "Le placement",
        q: "On place " + Q(C0, "CHF") + " sur " + obj + " à " + tx(t) + " % d'intérêts composés par an (les intérêts restent sur le compte).",
        parts: [{ label: "Écris le capital " + M("C(n)") + " après " + M("n") + " années, puis calcule-le après " + n + " ans (au centime).", pts: 2 }, { label: "Combien d'intérêts a-t-on gagnés en " + n + " ans ?", pts: 1 }, { label: "Après combien d'années entières le capital aura-t-il doublé ?", pts: 2 }, { label: "Quel taux annuel faudrait-il pour doubler le capital en " + Y + " ans (au centième de %) ?", pts: 1 }],
        sol: ul([M("C(n) = " + N(C0) + " \\cdot " + N(q) + "^n") + " ; " + M("C(" + n + ") \\approx " + A(Cn, 2)) + " CHF.", M(A(Cn, 2) + " - " + N(C0) + " \\approx " + A(Cn - C0, 2)) + " CHF.", M(N(q) + "^n = 2") + " ⟺ " + M("n = \\frac{\\log 2}{\\log " + N(q) + "} \\approx " + A(nd, 2)) + " : il faut " + M(n2) + " ans.", M("q^{" + Y + "} = 2") + " ⟺ " + M("q = 2^{\\frac{1}{" + Y + "}} \\approx " + A(1 + tY / 100, 5)) + " : taux " + M("\\approx " + A(tY, 2) + "\\,\\%") + "."]),
        chk: [[Cn, A(Cn, 2), 0.01], [Cn - C0, A(Cn - C0, 2), 0.01], [n2, String(n2)], [tY, A(tY, 2), 0.01]] }); },
    // La demi-vie (décroissance)
    () => { const [sub, Tm, un] = pk([["de l'iode 131 (traitement de la thyroïde)", 8, "jours"], ["du technétium 99m (imagerie médicale)", 6, "heures"], ["du césium 137 (déchets radioactifs)", 30, "années"]]), m0 = pk([50, 80, 120, 200]), t1 = Tm * pk([1.25, 2.5, 3.75]), p = pk([10, 5, 1]);
      const m1 = m0 * Math.pow(0.5, t1 / Tm), tp = (Tm * Math.log(p / 100)) / Math.log(0.5);
      return X({ id: "croissexp", lv: 2, titre: "La demi-vie",
        q: "La demi-vie " + sub + " est de " + Tm + " " + un + " : " + tous(un) + Tm + " " + un + ", la masse restante est divisée par 2. On dispose au départ de " + Q(m0, "mg") + ".",
        parts: [{ label: "Écris la masse " + M("m(t)") + " après " + M("t") + " " + un + ".", pts: 1 }, { label: "Quelle masse reste-t-il après " + tx(t1) + " " + un + " (au centième de mg) ?", pts: 1 }, { label: "Après combien " + de(un) + " ne reste-t-il que " + p + " % de la masse de départ (au dixième) ?", pts: 2 }, { label: "Quel pourcentage reste-t-il après trois demi-vies ?", pts: 1 }],
        sol: ul([M("m(t) = " + m0 + " \\cdot 0{,}5^{\\frac{t}{" + Tm + "}}"), M("m(" + N(t1) + ") = " + m0 + " \\cdot 0{,}5^{\\," + N(t1 / Tm) + "} \\approx " + A(m1, 2)) + " mg.", M("0{,}5^{\\frac{t}{" + Tm + "}} = " + N(p / 100)) + " ⟺ " + M("\\frac{t}{" + Tm + "} = \\frac{\\log " + N(p / 100) + "}{\\log 0{,}5}") + " ⟺ " + M("t \\approx " + A(tp, 1)) + " " + un + ".", M("0{,}5^3 = 0{,}125") + " : il reste 12,5 %."]),
        chk: [[m1, A(m1, 2), 0.01], [tp, A(tp, 1), 0.1], [12.5, "12,5"]] }); },
    // Deux villes (croissance, dépassement)
    () => { const PA = pk([45000, 60000, 80000]), a = pk([0.5, 1]), f = pk([0.6, 0.7, 0.75]), PB = PA * f, b = pk([2, 2.5, 3]), qa = 1 + a / 100, qb = 1 + b / 100;
      const A10 = PA * Math.pow(qa, 10), B10 = PB * Math.pow(qb, 10), ns = Math.log(PA / PB) / Math.log(qb / qa), n0 = Math.ceil(ns), dbl = Math.log(2) / Math.log(qb);
      return X({ id: "croissexp", lv: 3, titre: "Deux villes",
        q: "La ville A compte " + T(PA) + " habitants et sa population augmente de " + tx(a) + " % par an. La ville B, plus petite, compte " + T(PB) + " habitants et augmente de " + tx(b) + " % par an. On suppose que ces taux restent constants.",
        parts: [{ label: "Écris les populations " + M("A(n)") + " et " + M("B(n)") + " après " + M("n") + " années.", pts: 1 }, { label: "Calcule les deux populations dans 10 ans (à l'unité).", pts: 1 }, { label: "Dans combien d'années entières la ville B aura-t-elle dépassé la ville A ?", pts: 2 }, { label: "Combien d'années faut-il à la ville B pour doubler sa population (au dixième) ?", pts: 1 }],
        sol: ul([M("A(n) = " + N(PA) + " \\cdot " + N(qa) + "^n") + " ; " + M("B(n) = " + N(PB) + " \\cdot " + N(qb) + "^n") + ".", M("A(10) \\approx " + A(A10, 0)) + " ; " + M("B(10) \\approx " + A(B10, 0)) + ".", M(N(PB) + " \\cdot " + N(qb) + "^n = " + N(PA) + " \\cdot " + N(qa) + "^n") + " ⟺ " + M("\\left(\\frac{" + N(qb) + "}{" + N(qa) + "}\\right)^n = \\frac{" + N(PA) + "}{" + N(PB) + "}") + " ⟺ " + M("n = \\frac{\\log(" + N(PA) + " : " + N(PB) + ")}{\\log(" + N(qb) + " : " + N(qa) + ")} \\approx " + A(ns, 2)) + " : dans " + M(n0) + " ans.", M(N(qb) + "^n = 2") + " ⟺ " + M("n = \\frac{\\log 2}{\\log " + N(qb) + "} \\approx " + A(dbl, 1)) + " ans."]),
        chk: [[A10, A(A10, 0), 1], [B10, A(B10, 0), 1], [n0, String(n0)], [dbl, A(dbl, 1), 0.1]] }); },
    // Le pH (définition du logarithme)
    () => { const k = pk([2, 3, 5, 6]), mb = pk([2.5, 3.2, 4, 6.3]), eb = pk([3, 4, 5]), pHb = eb - Math.log10(mb), pc = pk([2.5, 7.4, 8.2]), Hc = Math.pow(10, -pc), [mc, ec] = sci(Hc, 2), dl = pk([2, 3]), ph1 = pk([3, 4]), ph2 = ph1 + dl;
      return X({ id: "logdef", lv: 1, titre: "Le pH",
        q: "Le pH d'une solution vaut " + M("\\text{pH} = -\\log c") + ", où " + M("c") + " est la concentration en ions hydrogène (en mol/L). Plus le pH est bas, plus la solution est acide.",
        parts: [{ label: "Quel est le pH d'une solution où " + M("c = 10^{-" + k + "}") + " ?", pts: 1 }, { label: "Quel est le pH d'une solution où " + M("c = " + N(mb) + " \\cdot 10^{-" + eb + "}") + " (au centième) ?", pts: 1 }, { label: "Le pH " + (pc === 7.4 ? "du sang" : "d'une solution") + " vaut " + tx(pc) + ". Quelle est la concentration " + M("c") + " ?", pts: 2 }, { label: "Une solution de pH " + ph1 + " est combien de fois plus concentrée en ions hydrogène qu'une solution de pH " + ph2 + " ?", pts: 1 }],
        sol: ul([M("-\\log 10^{-" + k + "} = " + k) + ".", M("-\\log(" + N(mb) + " \\cdot 10^{-" + eb + "}) \\approx " + A(pHb, 2)) + ".", M("-\\log c = " + N(pc)) + " ⟺ " + M("c = 10^{-" + N(pc) + "} \\approx " + N(mc) + " \\cdot 10^{" + ec + "}") + " mol/L.", M("\\frac{10^{-" + ph1 + "}}{10^{-" + ph2 + "}} = 10^{" + dl + "} = " + N(Math.pow(10, dl))) + " fois : un pH plus bas d'une unité, c'est une concentration 10 fois plus grande."]),
        chk: [[k, String(k)], [pHb, A(pHb, 2), 0.01], [Hc / Math.pow(10, ec), N(mc), 0.01], [Math.pow(10, dl), N(Math.pow(10, dl))]] }); },
    // Les décibels (propriétés des logarithmes)
    () => { const k = pk([6, 7, 8]), L1 = pk([70, 72, 76, 80]), L2 = L1 + 10 * Math.log10(2), ex = (85 - L1) / 10, nmax = Math.floor(Math.pow(10, ex) + 1e-9), K = pk([["Dans un atelier", "machines"], ["Sur un chantier", "marteaux-piqueurs"], ["Dans une salle de concert", "enceintes"]]);
      return X({ id: "logprop", lv: 2, titre: "Les décibels",
        q: "Le niveau sonore (en dB) vaut " + M("L = 10\\log\\frac{I}{I_0}") + ", où " + M("I") + " est l'intensité du son et " + M("I_0") + " l'intensité la plus faible qu'on entend. " + K[0] + ", " + (K[1] === "marteaux-piqueurs" ? "chacun" : "chacune") + " des " + K[1] + " produit " + L1 + " dB.",
        parts: [{ label: "Quel est le niveau d'un son d'intensité " + M("I = 10^{" + k + "} I_0") + " ?", pts: 1 }, { label: "Deux " + K[1] + " identiques fonctionnent ensemble : l'intensité double. Quel est le niveau (au dixième) ?", pts: 2 }, { label: "Combien de " + K[1] + " identiques faut-il pour atteindre " + (L1 + 10) + " dB ?", pts: 1 }, { label: "Le bruit devient dangereux au-delà de 85 dB. Combien de " + K[1] + " peuvent fonctionner ensemble, au maximum, sans dépasser 85 dB ?", pts: 2 }],
        sol: ul([M("10\\log 10^{" + k + "} = 10 \\cdot " + k + " = " + 10 * k) + " dB.", M("10\\log\\frac{2I}{I_0} = 10\\log 2 + 10\\log\\frac{I}{I_0} \\approx 3{,}0 + " + L1 + " = " + A(L2, 1)) + " dB : doubler l'intensité ajoute environ 3 dB, pas " + L1 + ".", "Il faut multiplier l'intensité par 10 (" + M("10\\log 10 = 10") + ") : 10 " + K[1] + ".", M(L1 + " + 10\\log n \\leq 85") + " ⟺ " + M("\\log n \\leq " + N(ex)) + " ⟺ " + M("n \\leq 10^{\\," + N(ex) + "} \\approx " + A(Math.pow(10, ex), 2)) + " : au maximum " + nmax + "."]),
        chk: [[10 * k, String(10 * k)], [L2, A(L2, 1), 0.1], [nmax, String(nmax)]] }); },
    // La croissance (équations exponentielles)
    () => { const N0 = pk([100, 200, 500]), Tt = pk([2, 3, 4, 5]), kk = pk([3, 4, 5]), j = pk([6, 7, 8]), m = pk([10, 50, 100]), K = pk([["une colonie compte", "bactéries", "heures"], ["une culture de levure compte", "cellules", "heures"], ["les algues d'un étang couvrent", "m²", "jours"]]);
      const tm = (Tt * Math.log(m)) / Math.log(2);
      return X({ id: "eqexp", lv: 2, titre: "La croissance",
        q: "Au départ, " + K[0] + " " + N0 + " " + K[1] + " ; cette quantité double " + tous(K[2]) + Tt + " " + K[2] + ".",
        parts: [{ label: "Écris la quantité " + M("N(t)") + " après " + M("t") + " " + K[2] + ".", pts: 1 }, { label: "Quelle est la quantité après " + kk * Tt + " " + K[2] + " ?", pts: 1 }, { label: "Après combien " + de(K[2]) + " atteint-on " + T(N0 * Math.pow(2, j)) + " " + K[1] + " ? (même base)", pts: 1 }, { label: "Après combien " + de(K[2]) + " atteint-on " + T(N0 * m) + " " + K[1] + " (au dixième) ?", pts: 2 }],
        sol: ul([M("N(t) = " + N0 + " \\cdot 2^{\\frac{t}{" + Tt + "}}"), M("N(" + kk * Tt + ") = " + N0 + " \\cdot 2^{" + kk + "} = " + N(N0 * Math.pow(2, kk))) + " " + K[1] + ".", M("2^{\\frac{t}{" + Tt + "}} = " + Math.pow(2, j) + " = 2^{" + j + "}") + " ⟺ " + M("\\frac{t}{" + Tt + "} = " + j) + " ⟺ " + M("t = " + j * Tt) + " " + K[2] + ".", M("2^{\\frac{t}{" + Tt + "}} = " + m) + " ⟺ " + M("\\frac{t}{" + Tt + "} = \\frac{\\log " + m + "}{\\log 2}") + " ⟺ " + M("t \\approx " + A(tm, 1)) + " " + K[2] + "."]),
        chk: [[N0 * Math.pow(2, kk), N(N0 * Math.pow(2, kk))], [j * Tt, String(j * Tt)], [tm, A(tm, 1), 0.1]] }); },
    // La légende de l'échiquier (logarithme, nombre de chiffres)
    () => { const c = pk([20, 25, 30]), m = pk([6, 9, 12]), nc = Math.ceil(m / Math.log10(2)) + 1, d64 = Math.floor(63 * Math.log10(2)) + 1;
      return X({ id: "logprop", lv: 3, titre: "La légende de l'échiquier",
        q: "Selon une légende, l'inventeur des échecs demanda 1 grain de riz sur la 1re case de l'échiquier, 2 sur la 2e, 4 sur la 3e, et ainsi de suite en doublant à chaque case (64 cases).",
        parts: [{ label: "Combien de grains y a-t-il sur la case " + M("n") + " ? Sur la case " + c + " ?", pts: 1 }, { label: "Sur quelle case dépasse-t-on pour la première fois " + M("10^{" + m + "}") + " grains ?", pts: 2 }, { label: "En utilisant " + M("\\log(2^{63}) = 63\\log 2") + ", trouve le nombre de chiffres du nombre de grains de la dernière case.", pts: 2 }],
        sol: ul([M("2^{n - 1}") + " ; case " + c + " : " + M("2^{" + (c - 1) + "} = " + N(Math.pow(2, c - 1))) + " grains.", M("2^{n - 1} > 10^{" + m + "}") + " ⟺ " + M("n - 1 > \\frac{" + m + "}{\\log 2} \\approx " + A(m / Math.log10(2), 2)) + " : la case " + M(nc) + ".", M("63\\log 2 \\approx " + A(63 * Math.log10(2), 2)) + " : " + M("2^{63} \\approx 10^{" + A(63 * Math.log10(2), 2) + "}") + ", entre " + M("10^{18}") + " et " + M("10^{19}") + " : " + d64 + " chiffres."]),
        chk: [[Math.pow(2, c - 1), N(Math.pow(2, c - 1))], [nc, String(nc)], [d64, String(d64)]] }); },
    // L'énergie des séismes (équation logarithmique)
    () => { const M1 = pk([4, 5, 6]), M2 = pk([5.5, 6.2, 7.1]), E1 = Math.pow(10, 4.8 + 1.5 * M1), [m2, e2] = sci(Math.pow(10, 4.8 + 1.5 * M2), 2), E2 = m2 * Math.pow(10, e2), M2c = (Math.log10(E2) - 4.8) / 1.5, r1 = Math.pow(10, 1.5), [m1, e1] = sci(E1, 2);
      return X({ id: "eqlog", lv: 3, titre: "L'énergie des séismes",
        q: "L'énergie " + M("E") + " (en joules) libérée par un séisme de magnitude " + M("M") + " vérifie " + M("\\log E = 4{,}8 + 1{,}5M") + ".",
        parts: [{ label: "Quelle énergie libère un séisme de magnitude " + M1 + " ?", pts: 1 }, { label: "Un séisme libère " + M(N(m2) + " \\cdot 10^{" + e2 + "}") + " J. Quelle est sa magnitude (au dixième) ?", pts: 2 }, { label: "Combien de fois plus d'énergie libère un séisme d'une magnitude plus élevée de 1 (à l'unité) ? Et de 2 ?", pts: 2 }],
        sol: ul([M("E = 10^{\\,4{,}8 + 1{,}5 \\cdot " + M1 + "} = 10^{" + N(4.8 + 1.5 * M1) + "} \\approx " + sciT(E1)) + " J.", M("\\log(" + N(m2) + " \\cdot 10^{" + e2 + "}) \\approx " + A(Math.log10(E2), 2)) + " ; " + M("M = \\frac{" + A(Math.log10(E2), 2) + " - 4{,}8}{1{,}5} \\approx " + A(M2c, 1)) + ".", M("\\frac{E_2}{E_1} = 10^{\\,1{,}5(M_2 - M_1)}") + " : " + M("10^{\\,1{,}5} \\approx " + A(r1, 0)) + " fois ; et " + M("10^3 = 1\\text{'}000") + " fois pour 2 de plus."]),
        chk: [[M2c, A(M2c, 1), 0.1], [r1, A(r1, 0), 1], [E1 / Math.pow(10, e1), N(m1), 0.01]] }); },
  ];
  const RAISONL = [
    () => VF("logprop", 1, [["« " + M("\\log(a + b) = \\log a + \\log b") + " »", false, "Contre-exemple : " + M("\\log(10 + 10) = \\log 20 \\approx 1{,}3") + ", mais " + M("\\log 10 + \\log 10 = 2") + "."],
      ["« " + M("\\log(100x) = 2 + \\log x") + " (pour " + M("x > 0") + "). »", true, M("\\log 100 + \\log x = 2 + \\log x") + "."],
      ["« " + M("\\log_2 8 = 4") + " »", false, M("2^3 = 8") + ", donc " + M("\\log_2 8 = 3") + "."],
      ["« " + M("2^x = -4") + " n'a pas de solution. »", true, "Une puissance de 2 est toujours positive."],
      ["« " + M("\\log\\frac{a}{b} = \\frac{\\log a}{\\log b}") + " »", false, M("\\log\\frac{a}{b} = \\log a - \\log b") + " ; contre-exemple : " + M("\\log\\frac{1\\text{'}000}{10} = 2") + ", mais " + M("\\frac{3}{1} = 3") + "."],
      ["« Une hausse de 10 % deux années de suite fait une hausse de 20 %. »", false, M("1{,}1^2 = 1{,}21") + " : +21 %."],
      ["« " + M("\\log 0") + " n'existe pas. »", true, "Aucune puissance de 10 ne vaut 0."]]),
    () => { const a = pk([2, 3, 4, 5]), r = a + pk([1, 2, 3, 5]), b = r * (r - a), s2 = a - r, w = RX.who();
      return X({ id: "eqlog", lv: 2, titre: "Trouve l'erreur",
        q: w + " résout " + M("\\log x + \\log(x - " + a + ") = \\log " + b) + " : « " + M("x(x - " + a + ") = " + b) + ", donc " + M(poly([1, -a, -b]) + " = 0") + " et " + M("S = \\{" + s2 + " \\,;\\, " + r + "\\}") + ". »",
        parts: [{ label: "Quelle est l'erreur ?", pts: 1 }, { label: "Donne le bon ensemble des solutions.", pts: 1 }],
        sol: ul(["Le domaine n'a pas été vérifié : il faut " + M("x > 0") + " et " + M("x - " + a + " > 0") + ", soit " + M("x > " + a) + ".", M(s2) + " est négatif (on ne peut pas calculer " + M("\\log(" + s2 + ")") + "), donc " + M("S = \\{" + r + "\\}") + "."]),
        chk: [[r, String(r)], [r * (r - a), String(b)]] }); },
    () => { const c = pk([3, 5, 7]), b = pk([2, 3]), k = b === 2 ? pk([3, 4, 5]) : pk([2, 3, 4]), v = c * Math.pow(b, k), w = RX.who(), wr = Math.log(v) / Math.log(c * b);
      return X({ id: "eqexp", lv: 1, titre: "Trouve l'erreur",
        q: w + " résout " + M(c + " \\cdot " + b + "^x = " + v) + " : « " + M(c + " \\cdot " + b + "^x = " + c * b + "^x") + ", donc " + M("x = \\frac{\\log " + v + "}{\\log " + c * b + "} \\approx " + A(wr, 2)) + ". »",
        parts: [{ label: "Quelle est l'erreur ?", pts: 1 }, { label: "Résous correctement l'équation.", pts: 1 }],
        sol: ul([M(c + " \\cdot " + b + "^x") + " n'est pas " + M("(" + c + " \\cdot " + b + ")^x") + " : l'exposant ne porte que sur " + M(b) + ".", "On divise par " + M(c) + " : " + M(b + "^x = " + Math.pow(b, k) + " = " + b + "^{" + k + "}") + ", donc " + M("x = " + k) + "."]),
        chk: [[k, String(k)]] }); },
  ];

  // ===================== MP 3e · D. Volumes et similitude =====================
  const EXV = [
    // Le silo (cylindre + cône)
    () => { const r = pk([1.5, 2, 2.5]), h = pk([6, 8, 10]), hc = pk([1.5, 2, 3]), Qd = pk([5, 8, 10]), Vc = Math.PI * r * r * h, Vk = (Math.PI * r * r * hc) / 3, Vt = Vc + Vk, tt = Vt / Qd;
      return X({ id: "volmp", lv: 1, titre: "Le silo",
        q: "Un silo à grains est formé d'un cylindre de " + Q(2 * r, "m") + " de diamètre et de " + Q(h, "m") + " de haut, posé sur un cône (la trémie) de " + Q(hc, "m") + " de haut et de même diamètre.",
        parts: [{ label: "Calcule le volume du cylindre (au centième de m³).", pts: 1 }, { label: "Calcule le volume du cône (au centième de m³).", pts: 1 }, { label: "Quel est le volume total du silo, en m³ puis en litres ?", pts: 1 }, { label: "Une vis sans fin le remplit à raison de " + Q(Qd, "m^3") + " par heure. Combien de temps faut-il pour le remplir (au dixième d'heure) ?", pts: 1 }],
        sol: ul(["Rayon " + Q(r, "m") + ", " + M("V = \\pi \\cdot " + N(r) + "^2 \\cdot " + h + " \\approx " + A(Vc, 2)) + " m³.", M("V = \\frac{\\pi \\cdot " + N(r) + "^2 \\cdot " + N(hc) + "}{3} \\approx " + A(Vk, 2)) + " m³.", M("V \\approx " + A(Vt, 2)) + " m³, soit environ " + M(A(Vt * 1000, 0)) + " L (" + M("1\\ \\text{m}^3 = 1\\text{'}000\\ \\text{L}") + ").", M(A(Vt, 2) + " : " + Qd + " \\approx " + A(tt, 1)) + " h."]),
        chk: [[Vc, A(Vc, 2), 0.01], [Vk, A(Vk, 2), 0.01], [Vt, A(Vt, 2), 0.01], [tt, A(tt, 1), 0.1]] }); },
    // La boîte de conserve (isoler une dimension)
    () => { const V = pk([330, 400, 500, 850]), d = pk([6, 7, 8, 10]), r = d / 2, h = V / (Math.PI * r * r), lab = 2 * Math.PI * r * h, h2 = h / 4, S1 = 2 * Math.PI * r * r + lab, S2 = 2 * Math.PI * 4 * r * r + 2 * Math.PI * 2 * r * h2;
      return X({ id: "volmp", lv: 2, titre: "La boîte de conserve",
        q: "Une boîte de conserve cylindrique doit contenir " + Q(V, "mL") + " (" + M("1\\ \\text{mL} = 1\\ \\text{cm}^3") + "). Son diamètre est de " + Q(d, "cm") + ".",
        parts: [{ label: "Calcule sa hauteur (au dixième de cm).", pts: 2 }, { label: "Quelle est l'aire de l'étiquette qui fait le tour de la boîte (au cm² près) ?", pts: 1 }, { label: "On double le diamètre en gardant le même volume. Par combien la hauteur est-elle divisée ? Quelle est la nouvelle hauteur ?", pts: 1 }, { label: "Laquelle des deux boîtes demande le moins de métal (aire totale, couvercles compris) ?", pts: 2 }],
        sol: ul([M(V + " = \\pi \\cdot " + N(r) + "^2 \\cdot h") + " ⟺ " + M("h = \\frac{" + V + "}{\\pi \\cdot " + N(r * r) + "} \\approx " + A(h, 1)) + " cm.", M("2\\pi \\cdot " + N(r) + " \\cdot " + A(h, 1) + " \\approx " + A(lab, 0)) + " cm² (avec la hauteur non arrondie).", "L'aire de la base est multipliée par " + M("2^2 = 4") + " : la hauteur est divisée par 4, " + M("h \\approx " + A(h2, 1)) + " cm.", "Première boîte, " + M("2\\pi r^2 + 2\\pi r h \\approx " + A(S1, 0)) + " cm² ; seconde, " + M("\\approx " + A(S2, 0)) + " cm². " + (S1 < S2 ? "La première boîte" : "La seconde boîte") + " demande le moins de métal."]),
        chk: [[h, A(h, 1), 0.1], [lab, A(lab, 0), 1], [h2, A(h2, 1), 0.1], [S1, A(S1, 0), 1], [S2, A(S2, 0), 1]] }); },
    // Le tipi ou le tas de sable (Pythagore, cône)
    () => { const [r, h, g] = pk([[1.5, 2, 2.5], [3, 4, 5], [2.4, 3.2, 4], [1.8, 2.4, 3], [2.1, 2.8, 3.5]]), V = (Math.PI * r * r * h) / 3, Ab = Math.PI * r * r, sand = R.rand() < 0.5;
      return X({ id: "volmp", lv: 2, titre: sand ? "Le tas de sable" : "Le tipi",
        q: sand ? "Sur un chantier, un tas de sable a la forme d'un cône. Son diamètre au sol mesure " + Q(2 * r, "m") + " et sa pente, du sommet au sol, " + Q(g, "m") + ". Un mètre cube de sable pèse " + Q(1.6, "t") + "." : "Un tipi a la forme d'un cône. Son diamètre au sol mesure " + Q(2 * r, "m") + " et ses perches, du sommet au sol, " + Q(g, "m") + ". On compte au moins " + Q(1.5, "m^3") + " d'air par personne.",
        parts: [{ label: "Calcule la hauteur du cône.", pts: 2 }, { label: "Calcule son volume (au dixième de m³).", pts: 1 }, { label: "Calcule l'aire " + (sand ? "occupée au sol" : "du sol du tipi") + " (au centième de m²).", pts: 1 }, { label: sand ? "Quelle est la masse du tas (au dixième de tonne) ?" : "Combien de personnes au maximum peuvent dormir dans le tipi ?", pts: 1 }],
        sol: ul(["Pythagore (hauteur, rayon, pente) : " + M("h = \\sqrt{" + N(g) + "^2 - " + N(r) + "^2} = " + N(h)) + " m.", M("V = \\frac{\\pi \\cdot " + N(r) + "^2 \\cdot " + N(h) + "}{3} \\approx " + A(V, 1)) + " m³.", M("\\pi \\cdot " + N(r) + "^2 \\approx " + A(Ab, 2)) + " m².", sand ? M(A(V, 1) + " \\cdot 1{,}6 \\approx " + A(V * 1.6, 1)) + " t (calcul avec le volume non arrondi)." : M(A(V, 1) + " : 1{,}5 \\approx " + A(V / 1.5, 2)) + ", donc au maximum " + Math.floor(V / 1.5) + " personnes."]),
        chk: [[Math.sqrt(g * g - r * r), N(h), 0.001], [V, A(V, 1), 0.1], [Ab, A(Ab, 2), 0.01], sand ? [V * 1.6, A(V * 1.6, 1), 0.1] : [Math.floor(V / 1.5), String(Math.floor(V / 1.5))]] }); },
    // La maquette (k, k², k³)
    () => { const n = pk([20, 25, 50]), Lr = pk([5, 6, 7.5]), wr = pk([4, 4.5]), hr = 2.5, Ar = Lr * wr, Vr = Ar * hr, Lm = (Lr * 100) / n, Am = (Ar * 10000) / (n * n), Vm = (Vr * 1e6) / (n * n * n), tap = pk([12, 24, 48]), tapR = (tap * n * n) / 10000;
      return X({ id: "similmp", lv: 1, titre: "La maquette",
        q: "Une architecte construit la maquette d'un salon à l'échelle " + M("1 : " + n) + ". Le salon réel mesure " + Q(Lr, "m") + " sur " + Q(wr, "m") + " et " + Q(hr, "m") + " de haut.",
        parts: [{ label: "Quelle est la longueur du salon sur la maquette (en cm) ?", pts: 1 }, { label: "Quelle est l'aire du sol de la maquette (en cm²) ?", pts: 1 }, { label: "Quel est le volume de la pièce sur la maquette (en cm³) ?", pts: 1 }, { label: "Sur la maquette, un tapis couvre " + Q(tap, "cm^2") + ". Quelle est l'aire du vrai tapis (en m²) ?", pts: 1 }],
        sol: ul(["Longueurs divisées par " + n + " : " + M(N(Lr * 100) + " : " + n + " = " + N(Lm)) + " cm.", "Aires divisées par " + M(n + "^2 = " + N(n * n)) + " : " + M(N(Ar) + "\\ \\text{m}^2 = " + N(Ar * 10000) + "\\ \\text{cm}^2") + ", et " + M(N(Ar * 10000) + " : " + N(n * n) + " = " + N(Am)) + " cm².", "Volumes divisés par " + M(n + "^3 = " + N(n ** 3)) + " : " + M(N(Vr) + "\\ \\text{m}^3 = " + N(Vr * 1e6) + "\\ \\text{cm}^3") + ", et " + M(N(Vr * 1e6) + " : " + N(n ** 3) + " = " + N(Vm)) + " cm³.", M(tap + " \\cdot " + N(n * n) + " = " + N(tap * n * n)) + " cm², soit " + M(N(tapR)) + " m²."]),
        chk: [[Lm, N(Lm)], [Am, N(Am)], [Vm, N(Vm)], [tapR, N(tapR)]] }); },
    // Les bouteilles semblables (prix au litre)
    () => { const h1 = pk([16, 20, 24]), k = pk([1.25, 1.5, 2]), h2 = h1 * k, V1 = pk([0.4, 0.5]), V2 = V1 * k ** 3, A1 = pk([60, 80, 90]), A2 = A1 * k * k, p1 = pk([2.4, 3, 3.6]), f = pk([0.8, 1.15]), p2 = r6(Math.round((p1 * k ** 3 * f) / 0.05) * 0.05), l1 = p1 / V1, l2 = p2 / V2, obj = pk(["jus de pomme", "sirop", "huile d'olive"]);
      return X({ id: "similmp", lv: 2, titre: "Les bouteilles semblables",
        q: "Deux bouteilles de " + obj + " ont exactement la même forme. La petite mesure " + Q(h1, "cm") + " de haut et contient " + Q(V1, "L") + " ; la grande mesure " + Q(h2, "cm") + ". L'étiquette de la petite a une aire de " + Q(A1, "cm^2") + ". La petite coûte " + mo(p1) + ", la grande " + mo(p2) + ".",
        parts: [{ label: "Quel est le rapport de similitude " + M("k") + " ?", pts: 1 }, { label: "Quelle est la contenance de la grande bouteille (au mL près) ?", pts: 1 }, { label: "Quelle est l'aire de l'étiquette de la grande bouteille ?", pts: 1 }, { label: "Quelle bouteille est la plus avantageuse ? Compare les prix au litre (au centime).", pts: 2 }],
        sol: ul([M("k = \\frac{" + N(h2) + "}{" + h1 + "} = " + N(k)), "Volumes × " + M("k^3 = " + N(k ** 3)) + " : " + M(N(V1) + " \\cdot " + N(k ** 3) + " \\approx " + A(V2, 3)) + " L.", "Aires × " + M("k^2 = " + N(k * k)) + " : " + M(A1 + " \\cdot " + N(k * k) + " = " + N(A2)) + " cm².", "Petite, " + M(N(p1) + " : " + N(V1) + " = " + A(l1, 2)) + " CHF/L ; grande, " + M(N(p2) + " : " + A(V2, 3) + " \\approx " + A(l2, 2)) + " CHF/L. " + (l2 < l1 ? "La grande" : "La petite") + " est la plus avantageuse."]),
        chk: [[k, N(k)], [V2, A(V2, 3), 0.001], [A2, N(A2)], [l1, A(l1, 2), 0.01], [l2, A(l2, 2), 0.01]] }); },
    // Le verre conique (k³ ; remonter à k)
    () => { const [H, kn, kd] = pk([[12, 2, 3], [12, 3, 4], [15, 2, 3], [15, 4, 5], [15, 3, 5], [10, 4, 5], [10, 3, 5]]), k = kn / kd, h = H * k, V = pk([200, 250, 300]), Vl = V * k ** 3, hh = H * Math.cbrt(0.5);
      return X({ id: "similmp", lv: 3, titre: "Le verre conique",
        q: "Un verre a la forme d'un cône (pointe en bas) de " + Q(H, "cm") + " de haut ; plein, il contient " + Q(V, "mL") + ". On le remplit jusqu'à " + Q(h, "cm") + " de hauteur.",
        parts: [{ label: "Le liquide forme un cône semblable au verre. Quel est le rapport de similitude " + M("k") + " ?", pts: 1 }, { label: "Quel volume de liquide contient le verre (au mL près) ?", pts: 1 }, { label: "Quel volume faut-il encore verser pour le remplir ?", pts: 1 }, { label: "Jusqu'à quelle hauteur faut-il le remplir pour qu'il soit à moitié plein (au dixième de cm) ?", pts: 2 }],
        sol: ul([M("k = \\frac{" + N(h) + "}{" + H + "} = \\frac{" + kn + "}{" + kd + "}"), "Volumes × " + M("k^3 = \\frac{" + kn ** 3 + "}{" + kd ** 3 + "}") + " : " + M(V + " \\cdot \\frac{" + kn ** 3 + "}{" + kd ** 3 + "} \\approx " + A(Vl, 0)) + " mL.", M(V + " - " + A(Vl, 0) + " \\approx " + A(V - Vl, 0)) + " mL : le verre est rempli aux " + M("\\frac{" + kn + "}{" + kd + "}") + " de sa hauteur, mais pas aux " + M("\\frac{" + kn + "}{" + kd + "}") + " de son volume.", M("k^3 = 0{,}5") + " ⟺ " + M("k = \\sqrt[3]{0{,}5} \\approx 0{,}794") + ", donc " + M("h \\approx 0{,}794 \\cdot " + H + " \\approx " + A(hh, 1)) + " cm."]),
        chk: [[Vl, A(Vl, 0), 1], [V - Vl, A(V - Vl, 0), 1], [hh, A(hh, 1), 0.1]] }); },
    // La copie de la statue (masse k³, vernis k²)
    () => { const H = pk([2, 2.5, 3]), Mm = pk([600, 800, 1200]), Pp = pk([2, 3]), k = pk([0.2, 0.25]), h = H * k, kk = pk([0.4, 0.6]), mq = r6(Mm * kk ** 3);
      return X({ id: "similmp", lv: 2, titre: "La copie de la statue",
        q: "Une statue en bronze de " + Q(H, "m") + " de haut pèse " + Q(Mm, "kg") + " ; il faut " + Q(Pp, "L") + " de vernis pour la recouvrir. Un artisan en fait une copie réduite, pleine et dans le même bronze, de " + Q(r6(h * 100), "cm") + " de haut.",
        parts: [{ label: "Quel est le rapport de réduction " + M("k") + " ?", pts: 1 }, { label: "Quelle est la masse de la copie ?", pts: 1 }, { label: "Combien de vernis (en mL) faut-il pour la copie ?", pts: 1 }, { label: "Une autre copie pleine pèse " + Q(mq, "kg") + ". Quelle est sa hauteur (en cm) ?", pts: 2 }],
        sol: ul([M("k = \\frac{" + N(h) + "}{" + N(H) + "} = " + N(k)), "La masse suit le volume, × " + M("k^3 = " + N(k ** 3)) + " : " + M(Mm + " \\cdot " + N(k ** 3) + " = " + N(Mm * k ** 3)) + " kg.", "Le vernis suit l'aire, × " + M("k^2 = " + N(k * k)) + " : " + M(N(Pp * 1000) + " \\cdot " + N(k * k) + " = " + N(Pp * 1000 * k * k)) + " mL.", M("k^3 = \\frac{" + N(mq) + "}{" + Mm + "} = " + N(kk ** 3)) + ", " + M("k = \\sqrt[3]{" + N(kk ** 3) + "} = " + N(kk)) + " : hauteur " + M(N(kk) + " \\cdot " + N(H * 100) + " = " + N(kk * H * 100)) + " cm."]),
        chk: [[k, N(k)], [Mm * k ** 3, N(Mm * k ** 3)], [Pp * 1000 * k * k, N(Pp * 1000 * k * k)], [kk * H * 100, N(kk * H * 100)]] }); },
  ];
  const RAISONV = [
    () => { const D1 = pk([30, 32, 36]), D2 = pk([20, 22, 24]), rat = (D1 / D2) ** 2, w = RX.who();
      return X({ id: "similmp", lv: 1, titre: "Une grande ou deux petites ?",
        q: "Une pizzeria propose, au même prix, une pizza de " + Q(D1, "cm") + " de diamètre ou deux pizzas de " + Q(D2, "cm") + ". " + w + " choisit les deux petites : « " + M("2 \\cdot " + D2 + " = " + 2 * D2) + " cm, c'est plus que " + D1 + " cm. »",
        parts: [{ label: "Pourquoi ce raisonnement est-il faux ?", pts: 1 }, { label: "Quelle offre donne le plus de pizza ? Justifie avec le rapport des aires.", pts: 2 }],
        sol: ul(["On mange une surface : les aires sont proportionnelles au carré des diamètres, pas aux diamètres.", "Rapport des aires " + M("\\left(\\frac{" + D1 + "}{" + D2 + "}\\right)^2 \\approx " + A(rat, 2)) + (rat > 2 ? " > 2 : la grande pizza vaut plus que deux petites." : " < 2 : les deux petites donnent plus de pizza (la conclusion est juste, mais pas la raison).")]),
        chk: [[rat, A(rat, 2), 0.01]] }); },
    () => VF("similmp", 1, [["« Si on double le rayon d'une boule, son volume double. »", false, "Volume × " + M("2^3 = 8") + "."],
      ["« Un cône a le tiers du volume du cylindre de même base et de même hauteur. »", true, M("V_{\\text{cône}} = \\frac{A_{\\text{base}} \\cdot h}{3}") + "."],
      ["« Sur une carte au " + M("1 : 25\\text{'}000") + ", 1 cm² représente 6,25 ha. »", true, M("25\\text{'}000^2\\ \\text{cm}^2 = 62\\text{'}500\\ \\text{m}^2 = 6{,}25\\ \\text{ha}") + "."],
      ["« Deux cylindres de même volume ont la même hauteur. »", false, "Contre-exemple : " + M("r = 2, h = 4") + " et " + M("r = 4, h = 1") + " donnent tous deux " + M("16\\pi") + "."],
      ["« Si les aires de deux figures semblables sont dans le rapport 9, les longueurs sont dans le rapport 3. »", true, M("k^2 = 9") + " donne " + M("k = 3") + "."],
      ["« Un verre conique rempli à mi-hauteur est à moitié plein. »", false, M("\\left(\\frac{1}{2}\\right)^3 = \\frac{1}{8}") + " : il n'est rempli qu'au huitième."]]),
    () => { const [r, h, g] = pk([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15]]), w = RX.who(), Vw = (Math.PI * r * r * g) / 3, V = (Math.PI * r * r * h) / 3;
      return X({ id: "volmp", lv: 2, titre: "Trouve l'erreur",
        q: "Un cône a un rayon de " + Q(r, "cm") + " et une génératrice (le côté, du sommet au bord de la base) de " + Q(g, "cm") + ". " + w + " calcule : « " + M("V = \\frac{\\pi \\cdot " + r + "^2 \\cdot " + g + "}{3} \\approx " + A(Vw, 2)) + " cm³ ».",
        parts: [{ label: "Quelle est l'erreur ?", pts: 1 }, { label: "Calcule le bon volume (au centième).", pts: 2 }],
        sol: ul(["La génératrice n'est pas la hauteur : la hauteur est perpendiculaire à la base.", "Pythagore : " + M("h = \\sqrt{" + g + "^2 - " + r + "^2} = " + h) + " cm ; " + M("V = \\frac{\\pi \\cdot " + r + "^2 \\cdot " + h + "}{3} \\approx " + A(V, 2)) + " cm³."]),
        chk: [[Math.sqrt(g * g - r * r), String(h)], [V, A(V, 2), 0.01]] }); },
  ];

  // ===================== MP 4e · E–G. Coordonnées, vecteurs, droites paramétriques =====================
  const EXG = [
    // La nature du triangle (distances, milieu)
    () => { const xa = R.int(-3, 3), ya = R.int(-3, 3), [p0, q0] = pk([[1, 2], [2, 1], [3, 1], [1, 3], [2, 3], [3, 2]]), p = p0 * pk([1, -1]), q = q0 * pk([1, -1]);
      const B = [xa + p, ya + q], C = [xa - q, ya + p], n2 = p * p + q * q, Mx = (B[0] + C[0]) / 2, My = (B[1] + C[1]) / 2, AM = Math.sqrt(2 * n2) / 2;
      return X({ id: "coordmp", lv: 1, titre: "La nature du triangle",
        q: "On donne " + M("A" + pt(xa, ya)) + ", " + M("B" + pt(B[0], B[1])) + " et " + M("C" + pt(C[0], C[1])) + ".",
        parts: [{ label: "Calcule les longueurs " + M("AB") + ", " + M("AC") + " et " + M("BC") + " (valeur exacte et au centième).", pts: 2 }, { label: "Montre que le triangle est isocèle et rectangle. En quel sommet ?", pts: 1 }, { label: "Calcule le milieu " + M("M") + " de " + M("[BC]") + " et la longueur " + M("AM") + " (au centième).", pts: 1 }, { label: "Calcule l'aire du triangle.", pts: 1 }],
        sol: ul([M("AB = \\sqrt{" + par(p) + "^2 + " + par(q) + "^2} = \\sqrt{" + n2 + "} \\approx " + A(Math.sqrt(n2), 2)) + " ; " + M("AC = \\sqrt{" + n2 + "}") + " ; " + M("BC = \\sqrt{" + 2 * n2 + "} \\approx " + A(Math.sqrt(2 * n2), 2)) + ".", M("AB = AC") + " : isocèle en " + M("A") + " ; " + M("AB^2 + AC^2 = " + n2 + " + " + n2 + " = " + 2 * n2 + " = BC^2") + " : rectangle en " + M("A") + " (réciproque de Pythagore).", M("M" + pt(Mx, My)) + " ; " + M("AM = \\sqrt{" + N((Mx - xa) ** 2 + (My - ya) ** 2) + "} \\approx " + A(AM, 2)) + " (la moitié de " + M("BC") + ").", M("\\frac{AB \\cdot AC}{2} = \\frac{" + n2 + "}{2} = " + N(n2 / 2)) + "."]),
        chk: [[(B[0] - xa) ** 2 + (B[1] - ya) ** 2, String(n2)], [(C[0] - B[0]) ** 2 + (C[1] - B[1]) ** 2, String(2 * n2)], [AM, A(AM, 2), 0.01], [n2 / 2, N(n2 / 2)]] }); },
    // L'antenne (équidistance)
    () => { let a1, a2, b1, b2, x; do { a1 = R.int(-6, 0); b1 = R.int(2, 8); a2 = R.int(1, 6); b2 = R.int(1, 6); x = (b1 * b1 + b2 * b2 - a1 * a1 - a2 * a2) / (2 * (b1 - a1)); } while (!Number.isInteger(2 * x) || x === 0 || a2 === b2);
      const PA = Math.hypot(x - a1, a2), who = pk(["Une compagnie de téléphone", "La commune", "Un fournisseur d'internet"]);
      return X({ id: "coordmp", lv: 2, titre: "L'antenne",
        q: "Dans un repère (unité : 1 km), une route rectiligne suit l'axe " + M("Ox") + ". Deux villages sont en " + M("A" + pt(a1, a2)) + " et " + M("B" + pt(b1, b2)) + ". " + who + " veut placer une antenne " + M("P(x \\,;\\, 0)") + " au bord de la route, à égale distance des deux villages.",
        parts: [{ label: "Exprime " + M("PA^2") + " et " + M("PB^2") + " en fonction de " + M("x") + ".", pts: 1 }, { label: "Résous " + M("PA^2 = PB^2") + " pour placer l'antenne.", pts: 2 }, { label: "À quelle distance des villages est-elle (au centième de km) ? Vérifie avec " + M("PB") + ".", pts: 1 }],
        sol: ul([M("PA^2 = " + (a1 ? "(x" + sg(-a1) + ")^2" : "x^2") + " + " + a2 * a2) + " ; " + M("PB^2 = (x" + sg(-b1) + ")^2 + " + b2 * b2) + ".", "En développant, " + M("x^2") + " disparaît : " + M(poly([1, -2 * a1, a1 * a1 + a2 * a2]) + " = " + poly([1, -2 * b1, b1 * b1 + b2 * b2])) + " ⟺ " + M(2 * (b1 - a1) + "x = " + N(b1 * b1 + b2 * b2 - a1 * a1 - a2 * a2)) + " ⟺ " + M("x = " + N(x)) + ", donc " + M("P" + pt(x, 0)) + ".", M("PA = \\sqrt{" + N((x - a1) ** 2 + a2 * a2) + "} \\approx " + A(PA, 2)) + " km ; " + M("PB = \\sqrt{" + N((x - b1) ** 2 + b2 * b2) + "}") + ", la même valeur ✓."]),
        chk: [[x, N(x)], [PA, A(PA, 2), 0.01], [Math.hypot(x - b1, b2), A(PA, 2), 0.01]] }); },
    // Le radar (coordonnées polaires)
    () => { const r1 = pk([8, 10, 12]), t1 = pk([20, 40, 50]), r2 = pk([6, 9]), t2 = pk([110, 130, 150]), P1 = [r1 * Math.cos(t1 * D), r1 * Math.sin(t1 * D)], P2 = [r2 * Math.cos(t2 * D), r2 * Math.sin(t2 * D)], dd = Math.hypot(P1[0] - P2[0], P1[1] - P2[1]);
      const [u, v] = pk([[-6, -8], [-8, -6], [-5, -12], [-9, -12]]), r3 = Math.hypot(u, v), t3 = 180 + deg(Math.atan(v / u));
      return X({ id: "coordmp", lv: 2, titre: "Le radar",
        q: "Le radar d'un port est à l'origine. Il repère un bateau à " + Q(r1, "km") + " dans la direction " + t1 + "° et un autre à " + Q(r2, "km") + " dans la direction " + t2 + "° (angles mesurés depuis l'axe " + M("Ox") + ", dans le sens inverse des aiguilles d'une montre).",
        parts: [{ label: "Calcule les coordonnées cartésiennes des deux bateaux (au centième).", pts: 2 }, { label: "Quelle distance sépare les deux bateaux (au centième de km) ?", pts: 1 }, { label: "Un troisième bateau est au point " + M(pt(u, v)) + ". Donne ses coordonnées polaires (angle au dixième de degré).", pts: 2 }],
        sol: ul([M("(" + r1 + "\\cos " + t1 + "° \\,;\\, " + r1 + "\\sin " + t1 + "°) \\approx (" + A(P1[0], 2) + " \\,;\\, " + A(P1[1], 2) + ")") + " et " + M("(" + A(P2[0], 2) + " \\,;\\, " + A(P2[1], 2) + ")") + ".", M("\\sqrt{(" + A(P1[0], 2) + " - (" + A(P2[0], 2) + "))^2 + (" + A(P1[1], 2) + " - " + A(P2[1], 2) + ")^2} \\approx " + A(dd, 2)) + " km.", M("r = \\sqrt{" + u * u + " + " + v * v + "} = " + r3) + " ; le point est dans le 3e quadrant, donc " + M("\\theta = 180° + \\arctan\\frac{" + v + "}{" + u + "} \\approx " + A(t3, 1) + "°") + " (et non " + A(t3 - 180, 1).replace("{,}", ",") + "°)."]),
        chk: [[dd, A(dd, 2), 0.02], [r3, String(r3)], [t3, A(t3, 1), 0.1]] }); },
    // Le parallélogramme (vecteurs)
    () => { let A0, B, C, Dp, ab, bc; do { A0 = [R.int(-4, 0), R.int(-3, 1)]; B = [A0[0] + R.int(3, 6), A0[1] + R.int(-1, 2)]; C = [B[0] + R.int(-1, 3), B[1] + R.int(2, 5)]; Dp = [A0[0] + C[0] - B[0], A0[1] + C[1] - B[1]]; ab = [B[0] - A0[0], B[1] - A0[1]]; bc = [C[0] - B[0], C[1] - B[1]]; } while (ab[0] * bc[0] + ab[1] * bc[1] === 0 || bc[0] === 0 || ab[1] === 0 || Dp[0] === 0 || Dp[1] === 0);
      const Ox = (A0[0] + C[0]) / 2, Oy = (A0[1] + C[1]) / 2, lab = Math.hypot(...ab), lbc = Math.hypot(...bc), per = 2 * (lab + lbc);
      return X({ id: "vectmp", lv: 1, titre: "Le parallélogramme",
        q: "On donne " + M("A" + pt(...A0)) + ", " + M("B" + pt(...B)) + " et " + M("C" + pt(...C)) + ".",
        parts: [{ label: "Calcule les composantes de " + M("\\overrightarrow{AB}") + " et de " + M("\\overrightarrow{BC}") + ".", pts: 1 }, { label: "Trouve le point " + M("D") + " tel que " + M("ABCD") + " soit un parallélogramme.", pts: 2 }, { label: "Calcule le centre du parallélogramme de deux façons (milieu de " + M("[AC]") + ", milieu de " + M("[BD]") + ").", pts: 1 }, { label: "Calcule son périmètre (au centième). Est-ce un rectangle ?", pts: 2 }],
        sol: ul([M("\\overrightarrow{AB} = " + vc(...ab)) + ", " + M("\\overrightarrow{BC} = " + vc(...bc)) + ".", M("\\overrightarrow{AD} = \\overrightarrow{BC}") + ", donc " + M("D = A + \\overrightarrow{BC} = " + pt(...Dp)) + ".", "Milieu de " + M("[AC]") + " : " + M(pt(Ox, Oy)) + " ; milieu de " + M("[BD]") + " : " + M(pt((B[0] + Dp[0]) / 2, (B[1] + Dp[1]) / 2)) + ", le même : les diagonales se coupent en leur milieu.", M("AB = \\sqrt{" + (ab[0] ** 2 + ab[1] ** 2) + "}") + ", " + M("BC = \\sqrt{" + (bc[0] ** 2 + bc[1] ** 2) + "}") + ", périmètre " + M("\\approx " + A(per, 2)) + ". " + M("\\overrightarrow{AB} \\cdot \\overrightarrow{BC} = " + (ab[0] * bc[0] + ab[1] * bc[1])) + " ≠ 0 : pas de rectangle."]),
        chk: [[Dp[0], String(Dp[0])], [Dp[1], String(Dp[1])], [per, A(per, 2), 0.01]] }); },
    // L'angle droit caché (produit scalaire)
    () => { let V, u, w; do { V = [R.int(-3, 3), R.int(-3, 3)]; const [p, q] = pk([[1, 2], [2, 1], [3, 1], [1, 3], [2, 3]]); u = [p * pk([1, -1]), q * pk([1, -1])]; const k = pk([1, 2]); w = [-u[1] * k, u[0] * k]; } while (V[0] === 0 && V[1] === 0);
      const pts0 = [V, [V[0] + u[0], V[1] + u[1]], [V[0] + w[0], V[1] + w[1]]], rot = R.int(0, 2), P = [pts0[rot % 3], pts0[(rot + 1) % 3], pts0[(rot + 2) % 3]], nm = ["A", "B", "C"], iR = (3 - rot) % 3, right = nm[iR];
      const dot3 = (i) => { const O = P[i], a = P[(i + 1) % 3], b = P[(i + 2) % 3]; return (a[0] - O[0]) * (b[0] - O[0]) + (a[1] - O[1]) * (b[1] - O[1]); };
      const ds = [0, 1, 2].map(dot3), area = Math.abs(u[0] * w[1] - u[1] * w[0]) / 2, j = (iR + 1) % 3, O = P[j], a = P[(j + 1) % 3], b = P[(j + 2) % 3], na = (a[0] - O[0]) ** 2 + (a[1] - O[1]) ** 2, nb2 = (b[0] - O[0]) ** 2 + (b[1] - O[1]) ** 2;
      const ang = deg(Math.acos(ds[j] / Math.sqrt(na * nb2)));
      const lab3 = ["\\overrightarrow{AB} \\cdot \\overrightarrow{AC}", "\\overrightarrow{BC} \\cdot \\overrightarrow{BA}", "\\overrightarrow{CA} \\cdot \\overrightarrow{CB}"];
      return X({ id: "scalmp", lv: 2, titre: "L'angle droit caché",
        q: "On donne " + M("A" + pt(...P[0])) + ", " + M("B" + pt(...P[1])) + " et " + M("C" + pt(...P[2])) + ".",
        parts: [{ label: "Calcule " + M(lab3[0]) + ", " + M(lab3[1]) + " et " + M(lab3[2]) + ".", pts: 2 }, { label: "Le triangle est-il rectangle ? En quel sommet ?", pts: 1 }, { label: "Calcule son aire.", pts: 1 }, { label: "Calcule l'angle en " + M(nm[j]) + " (au dixième de degré).", pts: 2 }],
        sol: ul([ds.map((v, i) => M(lab3[i] + " = " + v)).join(" ; ") + ".", "Le produit scalaire en " + M(right) + " est nul : les côtés issus de " + M(right) + " sont orthogonaux, le triangle est rectangle en " + M(right) + ".", "Aire = demi-produit des côtés de l'angle droit, " + M(N(area)) + ".", M("\\cos \\alpha = \\frac{" + ds[j] + "}{\\sqrt{" + na + "} \\cdot \\sqrt{" + nb2 + "}}") + ", " + M("\\alpha \\approx " + A(ang, 1) + "°") + "."]),
        chk: [[ds[j], String(ds[j])], [area, N(area)], [ang, A(ang, 1), 0.1]] }); },
    // Le travail d'une force (produit scalaire)
    () => { const Fx = pk([60, 80, 120]), Fy = pk([30, 45, 60, 90]), dx = pk([20, 25, 40]), dx2 = pk([12, 15]), dy2 = -pk([2, 3, 4]), W1 = Fx * dx, nF = Math.hypot(Fx, Fy), al = deg(Math.atan(Fy / Fx)), W2 = Fx * dx2 + Fy * dy2, K = pk(["Un enfant tire une luge", "Un ouvrier tire un chariot", "Un cheval tire une péniche le long d'un canal"]);
      return X({ id: "scalmp", lv: 2, titre: "Le travail d'une force",
        q: K + " avec une force " + M("\\vec{F} = " + vc(Fx, Fy)) + " (en N). Le déplacement est " + M("\\vec{d} = " + vc(dx, 0)) + " (en m). Le travail de la force (en joules) vaut " + M("W = \\vec{F} \\cdot \\vec{d}") + ".",
        parts: [{ label: "Calcule le travail " + M("W") + ".", pts: 1 }, { label: "Calcule " + M("\\|\\vec{F}\\|") + " et l'angle entre " + M("\\vec{F}") + " et " + M("\\vec{d}") + " (au dixième de degré).", pts: 2 }, { label: "Vérifie que " + M("W = \\|\\vec{F}\\| \\cdot \\|\\vec{d}\\| \\cdot \\cos\\alpha") + ".", pts: 1 }, { label: "Avec la même force, le déplacement devient " + M(vc(dx2, dy2)) + ". Calcule le nouveau travail.", pts: 1 }],
        sol: ul([M("W = " + Fx + " \\cdot " + dx + " + " + Fy + " \\cdot 0 = " + N(W1)) + " J.", M("\\|\\vec{F}\\| = \\sqrt{" + Fx + "^2 + " + Fy + "^2} \\approx " + A(nF, 2)) + " N ; " + M("\\cos\\alpha = \\frac{" + N(W1) + "}{" + A(nF, 2) + " \\cdot " + dx + "}") + ", " + M("\\alpha \\approx " + A(al, 1) + "°") + ".", M(A(nF, 2) + " \\cdot " + dx + " \\cdot \\cos " + A(al, 1) + "° \\approx " + N(W1)) + " ✓.", M(Fx + " \\cdot " + dx2 + " + " + Fy + " \\cdot " + par(dy2) + " = " + N(W2)) + " J."]),
        chk: [[W1, N(W1)], [nF, A(nF, 2), 0.01], [al, A(al, 1), 0.1], [W2, N(W2)]] }); },
    // Le drone (droite paramétrique dans l'espace)
    () => { const [v, nv] = pk([[[2, 2, 1], 3], [[1, 2, 2], 3], [[2, 1, 2], 3], [[2, 3, 6], 7], [[6, 2, 3], 7], [[4, 4, 2], 6]]), A0 = [R.nz(-5, 5), R.nz(-5, 5), pk([2, 5, 10])], t1 = pk([4, 5, 6]), tZ = pk([8, 10, 12]), Z = A0[2] + v[2] * tZ, tp = pk([3, 7]), on = R.rand() < 0.5;
      const Pq = [A0[0] + tp * v[0], A0[1] + tp * v[1] + (on ? 0 : pk([1, 2])), A0[2] + tp * v[2]], at = (t) => A0.map((c, i) => c + t * v[i]);
      return X({ id: "droiteparam", lv: 2, titre: "Le drone",
        q: "Un drone décolle d'une plateforme en " + M("A" + pt(...A0)) + " (en m) et vole en ligne droite : chaque seconde, il se déplace de " + M("\\vec{v} = " + vc(...v)) + ".",
        parts: [{ label: "Écris une représentation paramétrique de sa trajectoire (paramètre " + M("t") + " en secondes).", pts: 1 }, { label: "Où est le drone après " + t1 + " s ? Quelle distance a-t-il parcourue ?", pts: 2 }, { label: "Quand atteint-il l'altitude " + Q(Z, "m") + " ? Où est-il alors ?", pts: 1 }, { label: "Passe-t-il par le point " + M("P" + pt(...Pq)) + " ?", pts: 1 }],
        sol: ul([M("x = " + lin1(A0[0], v[0], "t")) + ", " + M("y = " + lin1(A0[1], v[1], "t")) + ", " + M("z = " + lin1(A0[2], v[2], "t")), M(pt(...at(t1))) + " ; " + M("\\|\\vec{v}\\| = \\sqrt{" + v.map((c) => c * c).join(" + ") + "} = " + nv) + " m par seconde, donc " + M(t1 + " \\cdot " + nv + " = " + t1 * nv) + " m.", M(lin1(A0[2], v[2], "t") + " = " + Z) + " ⟺ " + M("t = " + tZ) + " s ; point " + M(pt(...at(tZ))) + ".", "Avec " + M("x") + ", " + M("t = " + tp) + " ; avec " + M("y") + ", " + (on ? M("t = " + tp) + " aussi ; avec " + M("z") + ", " + M("t = " + tp) + ". Oui, pour " + M("t = " + tp) + " s." : M("t = " + FR((Pq[1] - A0[1]) / v[1])) + " ≠ " + tp + ". Non, " + M("P") + " n'est pas sur la trajectoire.")]),
        chk: [[t1 * nv, String(t1 * nv)], [(Z - A0[2]) / v[2], String(tZ)], [(Pq[0] - A0[0]) / v[0], String(tp)]] }); },
    // Deux routes maritimes (intersection de droites paramétriques)
    () => { let I, u, v; do { I = [R.int(-3, 6), R.int(-2, 6)]; u = [R.nz(-3, 3), R.nz(-3, 3)]; v = [R.nz(-3, 3), R.nz(-3, 3)]; } while (u[0] * v[1] - u[1] * v[0] === 0 || u[0] * v[0] + u[1] * v[1] === 0 || I[0] === 0 || I[1] === 0);
      const t0 = pk([2, 3, 4]), s0 = pk([2, 3, 5]), A0 = [I[0] - t0 * u[0], I[1] - t0 * u[1]], B0 = [I[0] - s0 * v[0], I[1] - s0 * v[1]], ca = Math.abs(u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v)), ang = deg(Math.acos(ca));
      const eq = (P, w, p) => M("x = " + lin1(P[0], w[0], p)) + ", " + M("y = " + lin1(P[1], w[1], p));
      return X({ id: "droiteparam", lv: 3, titre: "Deux routes maritimes",
        q: "Deux bateaux suivent des routes rectilignes (unités : km et heures). Le premier, " + eq(A0, u, "t") + ". Le second, " + eq(B0, v, "s") + ".",
        parts: [{ label: "Les routes sont-elles parallèles ? Justifie avec les vecteurs directeurs.", pts: 1 }, { label: "Calcule le point d'intersection des deux routes.", pts: 2 }, { label: "Les deux bateaux passent-ils au point d'intersection au même instant ?", pts: 1 }, { label: "Calcule l'angle aigu entre les deux routes (au dixième de degré).", pts: 1 }],
        sol: ul(["Vecteurs directeurs " + M(vc(...u)) + " et " + M(vc(...v)) + " : pas multiples l'un de l'autre (" + M(u[0] + " \\cdot " + par(v[1]) + " - " + par(u[1]) + " \\cdot " + par(v[0]) + " = " + (u[0] * v[1] - u[1] * v[0])) + " ≠ 0), donc pas parallèles.", "Deux paramètres différents : " + M(lin1(A0[0], u[0], "t") + " = " + lin1(B0[0], v[0], "s")) + " et " + M(lin1(A0[1], u[1], "t") + " = " + lin1(B0[1], v[1], "s")) + ". On trouve " + M("t = " + t0) + " et " + M("s = " + s0) + ", point " + M(pt(...I)) + ".", t0 === s0 ? "Oui, " + M("t = s = " + t0) + " : risque de collision !" : "Non : le premier y passe à " + M("t = " + t0) + " h, le second à " + M("s = " + s0) + " h.", M("\\cos\\alpha = \\frac{|" + (u[0] * v[0] + u[1] * v[1]) + "|}{\\sqrt{" + (u[0] ** 2 + u[1] ** 2) + "} \\cdot \\sqrt{" + (v[0] ** 2 + v[1] ** 2) + "}}") + ", " + M("\\alpha \\approx " + A(ang, 1) + "°") + "."]),
        chk: [[t0, String(t0)], [s0, String(s0)], [A0[0] + t0 * u[0], String(I[0])], [B0[1] + s0 * v[1], String(I[1])], [ang, A(ang, 1), 0.1]] }); },
    // Ajouts du 24.11 (agent mp4plus) : projection orthogonale, position relative de deux droites, produit vectoriel.
    // Le raccordement le plus court (projection orthogonale, distance point-droite)
    () => { let d, A0, lam, mu, H, P; do { d = pk([[3, 4], [4, 3], [1, 2], [2, 1], [4, -3], [3, -4], [1, 3]]); A0 = [R.int(-4, 2), R.int(-4, 2)]; lam = pk([1, 2, 3]); mu = pk([1, 2, -1, -2]); H = [A0[0] + lam * d[0], A0[1] + lam * d[1]]; P = [H[0] - mu * d[1], H[1] + mu * d[0]]; } while (H.includes(0) || P.includes(0));
      const n2 = d[0] ** 2 + d[1] ** 2, AP = [P[0] - A0[0], P[1] - A0[1]], HP = [P[0] - H[0], P[1] - H[1]], dist = Math.abs(mu) * Math.sqrt(n2), c = pk([65, 80, 95, 120]), cost = dist * c, dPA = Math.hypot(...AP);
      const K = pk([["Une maison", "la conduite d'eau", "raccorder la maison"], ["Un chalet", "la ligne électrique", "relier le chalet"], ["Une ferme", "le câble de fibre optique", "raccorder la ferme"]]);
      return X({ id: "projmp", lv: 2, titre: "Le raccordement le plus court",
        q: K[0] + " est en " + M("P" + pt(...P)) + ". " + cap(K[1]) + " suit la droite passant par " + M("A" + pt(...A0)) + " de vecteur directeur " + M("\\vec{d} = " + vc(...d)) + " (unités : m). On veut " + K[2] + " par le chemin le plus court.",
        parts: [{ label: "Calcule " + M("\\overrightarrow{AP}") + " et le paramètre " + M("t = \\frac{\\overrightarrow{AP} \\cdot \\vec{d}}{\\|\\vec{d}\\|^2}") + ".", pts: 2 }, { label: "Donne le pied " + M("H = A + t\\,\\vec{d}") + " de la perpendiculaire et vérifie que " + M("\\overrightarrow{HP} \\cdot \\vec{d} = 0") + ".", pts: 1 }, { label: "Calcule la longueur " + M("PH") + " du raccordement (au centième).", pts: 1 }, { label: "Le raccordement coûte " + Q(c, "CHF") + " par mètre. Combien coûte-t-il ? Combien coûterait un raccordement direct de " + M("P") + " à " + M("A") + " ?", pts: 2 }],
        sol: ul([M("\\overrightarrow{AP} = " + vc(...AP)) + " ; " + M("\\overrightarrow{AP} \\cdot \\vec{d} = " + (AP[0] * d[0] + AP[1] * d[1])) + ", " + M("\\|\\vec{d}\\|^2 = " + n2) + ", donc " + M("t = " + lam) + ".", M("H = " + pt(...H)) + " ; " + M("\\overrightarrow{HP} = " + vc(...HP)) + " et " + M(par(HP[0]) + " \\cdot " + par(d[0]) + " + " + par(HP[1]) + " \\cdot " + par(d[1]) + " = 0") + " ✓.", M("PH = \\sqrt{" + par(HP[0]) + "^2 + " + par(HP[1]) + "^2} = \\sqrt{" + mu * mu * n2 + "} " + eqA(dist)) + " m.", M(A(dist, 2) + " \\cdot " + c + " " + eqA(cost)) + " CHF ; en direct, " + M("PA = \\sqrt{" + (AP[0] ** 2 + AP[1] ** 2) + "} " + eqA(dPA)) + " m, soit environ " + M(A(dPA * c, 2)) + " CHF : plus cher, car " + M("[PA]") + " est oblique."]),
        chk: [[lam, String(lam)], [H[0], String(H[0])], [H[1], String(H[1])], [dist, A(dist, 2), 0.01], [cost, A(cost, 2), 0.01]] }); },
    // Deux tunnels (position relative de deux droites de l'espace : sécantes ou gauches)
    () => { let I, u, v, t0, s0, zB; do { I = [R.int(-3, 4), R.int(-3, 4), R.int(1, 6)]; u = [R.nz(-3, 3), R.nz(-3, 3), R.nz(-2, 2)]; v = [R.nz(-3, 3), R.nz(-3, 3), R.nz(-2, 2)]; t0 = pk([1, 2, 3]); s0 = pk([1, 2, -1]); zB = I[2] - s0 * v[2]; } while (u[0] * v[1] - u[1] * v[0] === 0 || zB === 0);
      const on = R.rand() < 0.5, gap = on ? 0 : pk([1, 2, -1, -2]), A0 = I.map((x, i) => x - t0 * u[i]), B0 = I.map((x, i) => x - s0 * v[i]); B0[2] += gap; const zG = I[2] + gap;
      const K = pk([["Deux tunnels en construction", "le premier tunnel", "le second tunnel", "km"], ["Deux faisceaux laser d'un spectacle", "le premier faisceau", "le second faisceau", "m"], ["Deux câbles tendus au-dessus d'une vallée", "le premier câble", "le second câble", "hm"]]);
      const eq = (P, w, p) => M("x = " + lin1(P[0], w[0], p)) + ", " + M("y = " + lin1(P[1], w[1], p)) + ", " + M("z = " + lin1(P[2], w[2], p));
      return X({ id: "posdroites", lv: 3, titre: K[0],
        q: K[0] + " sont modélisés par des droites (unités : " + K[3] + "). Pour " + K[1] + " : " + eq(A0, u, "t") + ". Pour " + K[2] + " : " + eq(B0, v, "s") + ".",
        parts: [{ label: "Les deux droites sont-elles parallèles ? Justifie avec les vecteurs directeurs.", pts: 1 }, { label: "Résous le système formé par les équations en " + M("x") + " et en " + M("y") + " (inconnues " + M("t") + " et " + M("s") + ").", pts: 2 }, { label: "Compare les cotes " + M("z") + " pour ces valeurs. Les droites sont-elles sécantes ou gauches ?", pts: 1 }, { label: on ? "Donne le point commun et vérifie-le avec les deux représentations." : "Quelle cote de départ faudrait-il au second (à la place de " + M(B0[2]) + ") pour que les droites se coupent ?", pts: 1 }],
        sol: ul(["Vecteurs directeurs " + M(vc(...u)) + " et " + M(vc(...v)) + " : pas colinéaires (" + M(par(u[0]) + " \\cdot " + par(v[1]) + " - " + par(u[1]) + " \\cdot " + par(v[0]) + " = " + (u[0] * v[1] - u[1] * v[0])) + " ≠ 0), donc pas parallèles.",
          M(lin1(A0[0], u[0], "t") + " = " + lin1(B0[0], v[0], "s")) + " et " + M(lin1(A0[1], u[1], "t") + " = " + lin1(B0[1], v[1], "s")) + " donnent " + M("t = " + t0) + " et " + M("s = " + s0) + ".",
          "Première droite : " + M("z = " + I[2]) + " pour " + M("t = " + t0) + " ; seconde : " + M("z = " + zG) + " pour " + M("s = " + s0) + ". " + (on ? "Les cotes sont égales : les droites sont sécantes." : "Les cotes diffèrent (écart " + M(Math.abs(gap)) + ") : aucun point commun, et pas parallèles. Les droites sont gauches."),
          on ? "Point commun " + M(pt(...I)) + " : on le retrouve avec " + M("t = " + t0) + " dans la première et avec " + M("s = " + s0) + " dans la seconde." : "Il faut " + M("c" + sg(s0 * v[2]) + " = " + I[2]) + ", donc " + M("c = " + zB) + " : la cote de départ serait " + M(zB) + " au lieu de " + M(B0[2]) + "."]),
        chk: [[t0, String(t0)], [s0, String(s0)], on ? [I[2], String(I[2])] : [zB, String(zB)]] }); },
    // La voile d'ombrage (produit vectoriel : vecteur normal, aire dans l'espace)
    () => { let A0, u, v, w; do { A0 = [R.int(0, 3), R.int(0, 3), pk([2, 3, 4])]; u = [R.int(2, 5), R.int(-1, 2), R.int(-1, 1)]; v = [R.int(-1, 2), R.int(2, 5), R.int(-1, 1)]; w = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]; } while (w.filter((x) => x).length < 2);
      const B = A0.map((x, i) => x + u[i]), C = A0.map((x, i) => x + v[i]), nw = Math.hypot(...w), ar = nw / 2, c = pk([18, 24, 32]), cost = ar * 1.15 * c, K = pk(["Une voile d'ombrage triangulaire est tendue", "Un auvent triangulaire est fixé", "Un panneau publicitaire triangulaire est accroché"]);
      return X({ id: "pvectmp", lv: 2, titre: "La voile d'ombrage",
        q: K + " entre les points " + M("A" + pt(...A0)) + ", " + M("B" + pt(...B)) + " et " + M("C" + pt(...C)) + " (en m).",
        parts: [{ label: "Calcule " + M("\\overrightarrow{AB}") + ", " + M("\\overrightarrow{AC}") + " et le produit vectoriel " + M("\\vec{n} = \\overrightarrow{AB} \\times \\overrightarrow{AC}") + ".", pts: 2 }, { label: "Vérifie que " + M("\\vec{n}") + " est orthogonal à " + M("\\overrightarrow{AB}") + " et à " + M("\\overrightarrow{AC}") + ".", pts: 1 }, { label: "Calcule l'aire de la toile (au centième).", pts: 1 }, { label: "La toile coûte " + Q(c, "CHF") + " le m², et il faut 15 % de toile en plus pour les ourlets. Combien coûte la toile ?", pts: 1 }],
        sol: ul([M("\\overrightarrow{AB} = " + vc(...u)) + ", " + M("\\overrightarrow{AC} = " + vc(...v)) + ", " + M("\\vec{n} = " + vc(...w)) + ".", M("\\vec{n} \\cdot \\overrightarrow{AB} = " + w.map((x, i) => par(x) + " \\cdot " + par(u[i])).join(" + ") + " = 0") + " et " + M("\\vec{n} \\cdot \\overrightarrow{AC} = 0") + " ✓.", "Aire du triangle : " + M("\\frac{1}{2}\\|\\vec{n}\\| = \\frac{1}{2}\\sqrt{" + w.map((x) => x * x).reduce((s, x) => s + x, 0) + "} " + eqA(ar)) + " m².", M(A(ar, 2) + " \\cdot 1{,}15 \\cdot " + c + " " + eqA(cost)) + " CHF."]),
        chk: [[ar, A(ar, 2), 0.01], [cost, A(cost, 2), 0.01]] }); },
  ];
  const RAISONG = [
    () => VF("vectmp", 1, [["« Le vecteur " + M("\\overrightarrow{AB}") + " a pour composantes " + M("A - B") + ". »", false, M("\\overrightarrow{AB} = B - A") + " (arrivée moins départ)."],
      ["« Si " + M("\\vec{u} \\cdot \\vec{v} = 0") + " (vecteurs non nuls), ils sont orthogonaux. »", true, M("\\cos\\alpha = 0") + ", donc " + M("\\alpha = 90°") + "."],
      ["« Le produit scalaire de deux vecteurs est un vecteur. »", false, "C'est un nombre : " + M("x_1x_2 + y_1y_2") + "."],
      ["« " + M(vc(2, -4)) + " et " + M(vc(-3, 6)) + " sont colinéaires. »", true, M(vc(-3, 6) + " = -1{,}5 \\cdot " + vc(2, -4)) + "."],
      ["« Le point " + M("(5 \\,;\\, 2)") + " est sur la droite " + M("x = 1 + 2t") + ", " + M("y = 4 - t") + ". »", true, M("t = 2") + " donne " + M("x = 5") + " et " + M("y = 2") + "."],
      ["« Si " + M("\\vec{u} \\cdot \\vec{v} \\lt 0") + ", l'angle entre " + M("\\vec{u}") + " et " + M("\\vec{v}") + " est obtus. »", true, M("\\cos\\alpha \\lt 0") + "."],
      ["« La norme de " + M(vc(3, 4)) + " vaut 7. »", false, M("\\sqrt{9 + 16} = 5") + "."]]),
    () => { let A0, B; do { A0 = [R.int(-5, 5), R.int(-5, 5)]; B = [R.int(-5, 5), R.int(-5, 5)]; } while (A0[0] === B[0] || A0[1] === B[1]); const w = RX.who(), ab = [B[0] - A0[0], B[1] - A0[1]], n = ab[0] ** 2 + ab[1] ** 2;
      return X({ id: "vectmp", lv: 1, titre: "Trouve l'erreur",
        q: "Avec " + M("A" + pt(...A0)) + " et " + M("B" + pt(...B)) + ", " + w + " écrit : « " + M("\\overrightarrow{AB} = " + vc(A0[0] - B[0], A0[1] - B[1])) + " ».",
        parts: [{ label: "Quelle est l'erreur ? Corrige " + M("\\overrightarrow{AB}") + " et vérifie que " + M("A + \\overrightarrow{AB} = B") + ".", pts: 1 }, { label: "Calcule " + M("\\|\\overrightarrow{AB}\\|") + " (au centième).", pts: 1 }],
        sol: ul(["C'est " + M("A - B") + " qui a été calculé : " + M("\\overrightarrow{AB} = B - A = " + vc(...ab)) + ", et " + M(pt(...A0) + " + " + vc(...ab) + " = " + pt(...B)) + " ✓.", M("\\sqrt{" + n + "} \\approx " + A(Math.sqrt(n), 2)) + ". La norme est la même pour " + M("\\overrightarrow{BA}") + "."]),
        chk: [[Math.sqrt(n), A(Math.sqrt(n), 2), 0.01]] }); },
    () => { const x0 = R.nz(-4, 4), y0 = R.nz(-4, 4), a = R.nz(-3, 3), b = R.nz(-3, 3), w = RX.who(), P = [x0 + 2 * a, y0 + 3 * b];
      return X({ id: "droiteparam", lv: 2, titre: "Trouve l'erreur",
        q: "La droite " + M("d") + " a pour équations " + M("x = " + lin1(x0, a, "t")) + ", " + M("y = " + lin1(y0, b, "t")) + ". " + w + " affirme : « Pour " + M("P" + pt(...P)) + ", l'abscisse donne " + M("t = 2") + ", donc " + M("P") + " est sur " + M("d") + ". »",
        parts: [{ label: "Qu'est-ce qui n'a pas été vérifié ?", pts: 1 }, { label: M("P") + " est-il sur " + M("d") + " ? Justifie.", pts: 1 }],
        sol: ul(["Le même " + M("t") + " doit convenir pour toutes les coordonnées.", "Avec " + M("y") + ", " + M(lin1(y0, b, "t") + " = " + P[1]) + " donne " + M("t = 3") + " ≠ 2 : " + M("P") + " n'est pas sur " + M("d") + "."]),
        chk: [[(P[0] - x0) / a, "2"], [(P[1] - y0) / b, "3"]] }); },
    // Ajouts du 24.11 (agent mp4plus)
    () => { const [a, b, c] = pk([[3, 4, 5], [4, 3, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10]]), v = [a * pk([1, -1]), b * pk([1, -1])], lam = pk([2, 3, -2, -1]), mu = pk([1, -1, 2]), u = [lam * v[0] - mu * v[1], lam * v[1] + mu * v[0]], w = RX.who(), uv = lam * c * c, p = [lam * v[0], lam * v[1]], r = [u[0] - p[0], u[1] - p[1]];
      return X({ id: "projmp", lv: 2, titre: "Trouve l'erreur",
        q: w + " calcule le vecteur projeté de " + M("\\vec{u} = " + vc(...u)) + " sur " + M("\\vec{v} = " + vc(...v)) + " et écrit : « " + M("\\vec{p} = \\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{v}\\|} \\, \\vec{v} = " + vc(lam * c * v[0], lam * c * v[1])) + " ».",
        parts: [{ label: "Calcule " + M("\\vec{u} \\cdot \\vec{v}") + " et " + M("\\|\\vec{v}\\|") + ".", pts: 1 }, { label: "Quelle est l'erreur ? Donne le bon vecteur projeté.", pts: 1 }, { label: "Vérifie que " + M("\\vec{u} - \\vec{p}") + " est orthogonal à " + M("\\vec{v}") + ".", pts: 1 }],
        sol: ul([M("\\vec{u} \\cdot \\vec{v} = " + uv) + ", " + M("\\|\\vec{v}\\| = " + c) + ".", "Pour le vecteur projeté, on divise par " + M("\\|\\vec{v}\\|^2 = " + c * c) + " (diviser par " + M("\\|\\vec{v}\\|") + " donne la longueur projetée, " + M(N(Math.abs(lam) * c)) + ") : " + M("\\vec{p} = \\frac{" + uv + "}{" + c * c + "} \\vec{v} = " + vc(...p)) + ". Son résultat est " + M(c) + " fois trop long.", M("\\vec{u} - \\vec{p} = " + vc(...r)) + " et " + M(par(r[0]) + " \\cdot " + par(v[0]) + " + " + par(r[1]) + " \\cdot " + par(v[1]) + " = 0") + " ✓."]),
        chk: [[uv, String(uv)], [p[0], String(p[0])], [p[1], String(p[1])]] }); },
    () => VF("posdroites", 2, [["« Deux droites de l'espace sans point commun sont parallèles. »", false, "Elles peuvent être gauches : ni parallèles, ni sécantes."],
      ["« Si les vecteurs directeurs sont colinéaires, les droites sont parallèles ou confondues. »", true, "Elles ont la même direction ; confondues si elles ont en plus un point commun."],
      ["« " + M(vc(1, 2, -1)) + " et " + M(vc(-2, -4, 2)) + " dirigent des droites parallèles (ou confondues). »", true, M(vc(-2, -4, 2) + " = -2 \\cdot " + vc(1, 2, -1)) + "."],
      ["« Dans le plan, deux droites non parallèles sont sécantes. »", true, "Dans le plan, il n'y a pas de droites gauches."],
      ["« Le vecteur projeté de " + M("\\vec{u}") + " sur " + M("\\vec{v}") + " est parallèle à " + M("\\vec{u}") + ". »", false, "Il est parallèle à " + M("\\vec{v}") + " : " + M("\\vec{p} = k\\,\\vec{v}") + "."],
      ["« " + M("\\vec{u} \\times \\vec{v} = \\vec{v} \\times \\vec{u}") + ". »", false, "Ils sont opposés : " + M("\\vec{v} \\times \\vec{u} = -\\vec{u} \\times \\vec{v}") + "."],
      ["« " + M("\\|\\vec{u} \\times \\vec{v}\\|") + " est l'aire du triangle construit sur " + M("\\vec{u}") + " et " + M("\\vec{v}") + ". »", false, "C'est l'aire du parallélogramme ; le triangle en est la moitié."],
      ["« Si " + M("\\vec{u} \\times \\vec{v} = \\vec{0}") + " (vecteurs non nuls), " + M("\\vec{u}") + " et " + M("\\vec{v}") + " sont colinéaires. »", true, "L'aire du parallélogramme est nulle : il est aplati, les vecteurs ont la même direction."]]),
  ];

  // ===================== MP 4e · H–J. Inéquations, fonctions, polynômes, sinusoïdales =====================
  const EXF = [
    // Deux abonnements (inéquation linéaire)
    () => { const K = pk([["Deux abonnements de téléphone", "minutes", "min", "par minute", "l'opérateur A", "l'opérateur B"], ["Deux locations de vélo électrique", "heures", "h", "de l'heure", "le loueur A", "le loueur B"], ["Deux parkings", "heures", "h", "de l'heure", "le parking A", "le parking B"]]);
      const fA = pk([10, 12, 15]), dF = pk([3, 5, 6]), rB = pk([0.15, 0.2, 0.5]), dr = pk([0.05, 0.1]), fB = fA + dF, rA = r6(rB + dr), ts = r6(dF / dr), bud = r6(fA + rA * pk([20, 30, 40]) + pk([0.5, 1.2])), tmax = Math.floor((bud - fA) / rA + 1e-9);
      return X({ id: "ineqmp", lv: 1, titre: K[0],
        q: cap(K[4]) + " : " + mo(fA) + " par mois, puis " + mo(rA) + " " + K[3] + ". " + cap(K[5]) + " : " + mo(fB) + " par mois, puis " + mo(rB) + " " + K[3] + ". On note " + M("t") + " le nombre " + de(K[1]) + " par mois.",
        parts: [{ label: "Écris les deux coûts mensuels " + M("A(t)") + " et " + M("B(t)") + ".", pts: 1 }, { label: "Résous l'inéquation " + M("A(t) \\lt B(t)") + ". Quand " + K[4] + " est-il le plus avantageux ?", pts: 2 }, { label: "Avec " + K[4] + ", combien " + de(K[1]) + " entières au maximum peut-on payer avec " + mo(bud) + " par mois ?", pts: 1 }],
        sol: ul([M("A(t) = " + fA + " + " + N(rA) + "t") + " ; " + M("B(t) = " + fB + " + " + N(rB) + "t") + ".", M(fA + " + " + N(rA) + "t \\lt " + fB + " + " + N(rB) + "t") + " ⟺ " + M(N(dr) + "t \\lt " + dF) + " ⟺ " + M("t \\lt " + N(ts)) + " : jusqu'à " + tx(ts) + " " + K[2] + " (au-delà, " + K[5] + " est plus avantageux).", M(fA + " + " + N(rA) + "t \\leq " + N(bud)) + " ⟺ " + M("t \\leq \\frac{" + N(bud - fA) + "}{" + N(rA) + "} \\approx " + A((bud - fA) / rA, 2)) + ", donc au maximum " + tmax + " " + K[2] + "."]),
        chk: [[dF / dr, N(ts)], [tmax, String(tmax)]] }); },
    // Le bénéfice (inéquation du 2e degré, tableau des signes)
    () => { const r1 = R.int(10, 20), r2 = r1 + pk([10, 14, 20, 24, 30]), c = pk([1, 2, 5]), m = (r1 + r2) / 2, Bm = c * (m - r1) * (r2 - m), obj = pk(["lampes", "sacs en cuir", "tabourets", "horloges"]);
      return X({ id: "ineqmp", lv: 2, titre: "Le bénéfice",
        q: "Un atelier fabrique et vend des " + obj + ". Pour " + M("q") + " pièces vendues par semaine, son bénéfice (en CHF) est " + M("B(q) = " + poly([-c, c * (r1 + r2), -c * r1 * r2], "q")) + ".",
        parts: [{ label: "Montre que " + M("B(q) = " + (c === 1 ? "-" : "-" + c) + "(q - " + r1 + ")(q - " + r2 + ")") + " et donne les zéros de " + M("B") + ".", pts: 1 }, { label: "Dresse le tableau des signes et résous " + M("B(q) > 0") + ".", pts: 2 }, { label: "Combien de quantités entières sont rentables ?", pts: 1 }, { label: "Quel est le bénéfice maximal ? Pour combien de pièces ?", pts: 1 }],
        sol: ul(["On développe " + M("(q - " + r1 + ")(q - " + r2 + ") = " + poly([1, -(r1 + r2), r1 * r2], "q")) + (c === 1 ? " et on change tous les signes." : " et on multiplie par " + M("-" + c) + ".") + " Zéros : " + M(r1) + " et " + M(r2) + ".", "Coefficient de " + M("q^2") + " négatif : " + M("B") + " est positif entre ses zéros, " + M("S = \\,]" + r1 + " \\,;\\, " + r2 + "[") + ".", "De " + (r1 + 1) + " à " + (r2 - 1) + " pièces : " + (r2 - r1 - 1) + " quantités.", "Au milieu des zéros, " + M("q = " + m) + " : " + M("B(" + m + ") = " + N(Bm)) + " CHF."]),
        chk: [[r2 - r1 - 1, String(r2 - r1 - 1)], [-c * m * m + c * (r1 + r2) * m - c * r1 * r2, N(Bm)]] }); },
    // La boîte sans couvercle (polynôme de degré 3, Horner)
    () => { const [a, x0] = pk([[12, 1], [12, 3], [12, 4], [18, 2], [18, 5], [24, 2], [24, 5], [24, 7]]), V0 = x0 * (a - 2 * x0) ** 2, sd = Math.sqrt(x0 * (2 * a - 3 * x0)), u1 = (a - x0 - sd) / 2, u2 = (a - x0 + sd) / 2, q1 = 4 * x0 - 4 * a, q0 = a * a - 4 * a * x0 + 4 * x0 * x0;
      const mat = pk(["une plaque de carton carrée", "une feuille de tôle carrée"]);
      return X({ id: "polymp", lv: 3, titre: "La boîte sans couvercle",
        q: "Dans " + mat + " de " + Q(a, "cm") + " de côté, on découpe aux quatre coins un carré de côté " + M("x") + " (en cm), puis on relève les bords pour former une boîte sans couvercle. On veut une boîte de " + Q(V0, "cm^3") + ".",
        parts: [{ label: "Montre que le volume vaut " + M("V(x) = x(" + a + " - 2x)^2") + ". Pour quelles valeurs de " + M("x") + " la boîte existe-t-elle ?", pts: 1 }, { label: "Vérifie que " + M("x = " + x0) + " convient.", pts: 1 }, { label: "Développe " + M("V(x) - " + V0) + " et divise-le par " + M("(x - " + x0 + ")") + " (schéma de Horner).", pts: 2 }, { label: "Trouve les autres solutions (au centième) et dis lesquelles conviennent.", pts: 2 }],
        sol: ul(["Base carrée de côté " + M(a + " - 2x") + ", hauteur " + M("x") + ". Il faut " + M("0 \\lt x \\lt " + N(a / 2)) + ".", M("V(" + x0 + ") = " + x0 + " \\cdot " + (a - 2 * x0) + "^2 = " + V0) + " ✓.", M(poly([4, -4 * a, a * a, -V0]) + " = (x - " + x0 + ")(" + poly([4, q1, q0]) + ")") + " (reste nul).", M(poly([4, q1, q0]) + " = 0") + " donne " + M("x \\approx " + A(u1, 2)) + " ou " + M("x \\approx " + A(u2, 2)) + ". Or " + M(A(u2, 2) + " > " + N(a / 2)) + " : impossible. Deux boîtes conviennent, avec " + M("x = " + x0) + " cm ou " + M("x \\approx " + A(u1, 2)) + " cm."]),
        chk: [[u1, A(u1, 2), 0.01], [u2, A(u2, 2), 0.01], [x0 * q0, N(V0)], [u1 * (a - 2 * u1) ** 2, N(V0), 0.5]] }); },
    // Le polynôme de degré 3 (zéro, division, signe)
    () => { let z; do { z = shuffle([-4, -3, -2, -1, 2, 3, 4, 5]).slice(0, 3); } while (z[0] + z[1] + z[2] === 0 || z[0] * z[1] + z[1] * z[2] + z[0] * z[2] === 0 || z[1] + z[2] === 0);
      const [r1, r2, r3] = z, c2 = -(r1 + r2 + r3), c1 = r1 * r2 + r1 * r3 + r2 * r3, c0 = -r1 * r2 * r3, Pv = (x) => ((x + c2) * x + c1) * x + c0, s = z.slice().sort((p, q) => p - q);
      let m; do { m = pk([-3, -2, 2, 3, 6]); } while (z.includes(m)); const qb = r1 + c2, qc = r1 * qb + c1;
      return X({ id: "polymp", lv: 2, titre: "Le polynôme de degré 3",
        q: "On donne " + M("P(x) = " + poly([1, c2, c1, c0])) + ".",
        parts: [{ label: "Vérifie que " + M(r1) + " est un zéro de " + M("P") + ".", pts: 1 }, { label: "Divise " + M("P(x)") + " par " + M(fac(r1)) + " et factorise complètement " + M("P(x)") + ".", pts: 2 }, { label: "Sans division, quel est le reste de la division de " + M("P(x)") + " par " + M(fac(m)) + " ?", pts: 1 }, { label: "Résous " + M("P(x) > 0") + " à l'aide d'un tableau des signes.", pts: 2 }],
        sol: ul([M("P(" + r1 + ") = 0") + " ✓.", "Quotient " + M(poly([1, qb, qc])) + " ; ses zéros sont " + M(r2) + " et " + M(r3) + ", donc " + M("P(x) = " + fac(r1) + fac(r2) + fac(r3)) + ".", "Théorème du reste : " + M("P(" + m + ") = " + N(Pv(m))) + ".", "Signes alternés de droite à gauche (coefficient de " + M("x^3") + " positif) : " + M("S = \\,]" + s[0] + " \\,;\\, " + s[1] + "[ \\,\\cup\\, ]" + s[2] + " \\,;\\, +\\infty[") + "."]),
        chk: [[r2 * r3, String(qc)], [Pv(m), N(Pv(m))]] }); },
    // La grande roue (fonction sinusoïdale)
    () => { const Dm = pk([40, 50, 60]), Rr = Dm / 2, H = Rr + pk([2, 3]), Tp = pk([8, 10, 12]), t1 = pk([1, 2, 3].filter((u) => u % (Tp / 4) !== 0)), h1 = Rr * Math.sin(((2 * Math.PI) / Tp) * (t1 - Tp / 4)) + H;
      return X({ id: "sinusmp", lv: 1, titre: "La grande roue",
        q: "Une grande roue a un diamètre de " + Q(Dm, "m") + " ; son centre est à " + Q(H, "m") + " du sol. Elle fait un tour en " + Q(Tp, "min") + ". On monte dans une nacelle au point le plus bas, à " + M("t = 0") + ". La hauteur de la nacelle est " + M("h(t) = " + Rr + "\\sin\\left(\\frac{\\pi}{" + Tp / 2 + "}\\left(t - " + N(Tp / 4) + "\\right)\\right) + " + H) + " (" + M("t") + " en min, " + M("h") + " en m).",
        parts: [{ label: "Donne l'amplitude, l'axe et la période. Vérifie que " + M("b = \\frac{2\\pi}{" + Tp + "}") + ".", pts: 2 }, { label: "Quelles sont la hauteur maximale et la hauteur minimale ?", pts: 1 }, { label: "À quelle hauteur est la nacelle après " + t1 + " min (au centième) ?", pts: 1 }, { label: "Combien de minutes par tour la nacelle est-elle à plus de " + Q(H + Rr / 2, "m") + " (au centième) ?", pts: 2 }],
        sol: ul(["Amplitude " + Rr + " m (le rayon), axe " + M("y = " + H) + " (le centre), période " + Tp + " min ; " + M("\\frac{2\\pi}{" + Tp + "} = \\frac{\\pi}{" + Tp / 2 + "}") + ".", "Max " + M(H + " + " + Rr + " = " + (H + Rr)) + " m ; min " + M(H + " - " + Rr + " = " + (H - Rr)) + " m.", M("h(" + t1 + ") \\approx " + A(h1, 2)) + " m.", "Il faut " + M("\\sin(\\ldots) > \\frac{1}{2}") + " : l'angle est entre 30° et 150°, soit le tiers d'un tour, " + M(Tp + " : 3 \\approx " + A(Tp / 3, 2)) + " min."]),
        chk: [[H + Rr, String(H + Rr)], [h1, A(h1, 2), 0.01], [Tp / 3, A(Tp / 3, 2), 0.01]] }); },
    // Les températures de l'année (trouver l'expression)
    () => { const Tx = pk([24, 26, 28]), Tn = pk([-2, 1, 2]), a = (Tx - Tn) / 2, d = (Tx + Tn) / 2, m1 = pk([2, 5, 9, 12]), T1 = a * Math.sin((Math.PI / 6) * (m1 - 4)) + d, ville = pk(["une ville du Plateau suisse", "une ville de plaine", "une petite ville au bord d'un lac"]);
      return X({ id: "sinusmp", lv: 2, titre: "Les températures de l'année",
        q: "Dans " + ville + ", la température moyenne d'un mois varie au fil de l'année comme une sinusoïde : " + Tx + " °C au maximum (mi-juillet, " + M("m = 7") + ") et " + tx(Tn) + " °C au minimum (mi-janvier, " + M("m = 1") + "). On cherche " + M("T(m) = a\\sin(b(m - c)) + d") + ", " + M("m") + " étant le numéro du mois.",
        parts: [{ label: "Calcule l'amplitude " + M("a") + " et l'axe " + M("d") + ".", pts: 1 }, { label: "La période est de 12 mois : calcule " + M("b") + ".", pts: 1 }, { label: "La courbe coupe l'axe en montant 3 mois avant le maximum : donne " + M("c") + " et l'expression de " + M("T") + ".", pts: 1 }, { label: "Quelle température moyenne le modèle prévoit-il au mois " + m1 + " (au dixième) ?", pts: 1 }],
        sol: ul([M("a = \\frac{" + Tx + " - " + par(Tn) + "}{2} = " + N(a)) + " ; " + M("d = \\frac{" + Tx + " + " + par(Tn) + "}{2} = " + N(d)) + ".", M("b = \\frac{2\\pi}{12} = \\frac{\\pi}{6}"), M("c = 7 - 3 = 4") + ", donc " + M("T(m) = " + N(a) + "\\sin\\left(\\frac{\\pi}{6}(m - 4)\\right) + " + N(d)) + ".", M("T(" + m1 + ") \\approx " + A(T1, 1)) + " °C."]),
        chk: [[a, N(a)], [d, N(d)], [T1, A(T1, 1), 0.1]] }); },
    // Le modèle exponentiel (a · b^x)
    () => { const grow = R.rand() < 0.5, a = grow ? pk([50, 80, 200]) : pk([40, 60, 80]), b = grow ? pk([1.5, 2, 3]) : pk([0.5, 0.7, 0.8]), y2 = a * b * b, x1 = pk([5, 6]), thr = grow ? a * pk([100, 1000]) : a * pk([0.1, 0.05]), xt = Math.log(thr / a) / Math.log(b);
      const K = grow ? ["Une population de bactéries", "jours", "dépasse-t-elle " + T(thr) + " bactéries"] : ["La quantité d'un médicament dans le sang (en mg)", "heures", "descend-elle au-dessous de " + T(thr) + " mg"];
      return X({ id: "explogfn", lv: 2, titre: grow ? "La population de bactéries" : "Le médicament",
        q: K[0] + " suit un modèle " + M("f(x) = a \\cdot b^x") + ", " + M("x") + " en " + K[1] + ". Au départ, " + M("f(0) = " + a) + " ; après 2 " + K[1] + ", " + M("f(2) = " + N(y2)) + ".",
        parts: [{ label: "Détermine " + M("a") + " et " + M("b") + " (avec " + M("b > 0") + ").", pts: 2 }, { label: "La fonction est-elle croissante ou décroissante ? Que signifie " + M("b") + " ?", pts: 1 }, { label: "Calcule " + M("f(" + x1 + ")") + " (au centième).", pts: 1 }, { label: "Quand la quantité " + K[2] + " (au dixième) ?", pts: 2 }],
        sol: ul([M("a = f(0) = " + a) + " ; " + M(a + " \\cdot b^2 = " + N(y2)) + " ⟺ " + M("b^2 = " + N(b * b)) + " ⟺ " + M("b = " + N(b)) + ".", (b > 1 ? "Croissante (" + M("b > 1") + ")" : "Décroissante (" + M("0 \\lt b \\lt 1") + ")") + " : chaque " + K[1].replace(/s$/, "") + ", la quantité est multipliée par " + tx(b) + ".", M("f(" + x1 + ") = " + a + " \\cdot " + N(b) + "^{" + x1 + "} \\approx " + A(a * b ** x1, 2)) + ".", M(N(b) + "^x = " + N(thr / a)) + " ⟺ " + M("x = \\frac{\\log " + N(thr / a) + "}{\\log " + N(b) + "} \\approx " + A(xt, 1)) + " " + K[1] + "."]),
        chk: [[Math.sqrt(y2 / a), N(b)], [a * b ** x1, A(a * b ** x1, 2), 0.01], [xt, A(xt, 1), 0.1]] }); },
    // TVA et bon de réduction (composition, réciproque)
    () => { const Rb = pk([10, 20, 25]), p = pk([80, 150, 240]), fg = 1.081 * p - Rb, gf = 1.081 * (p - Rb), p2 = pk([60, 120, 200]), P2 = r6(1.081 * p2 - Rb);
      return X({ id: "fctmp", lv: 2, titre: "TVA et bon de réduction",
        q: "Un magasin ajoute la TVA de 8,1 % au prix hors taxe : " + M("g(x) = 1{,}081x") + ". Un client a un bon de " + Q(Rb, "CHF") + " : " + M("f(x) = x - " + Rb) + ".",
        parts: [{ label: "Écris " + M("(f \\circ g)(x)") + " et " + M("(g \\circ f)(x)") + ". Que signifie chacune ?", pts: 2 }, { label: "Pour un article à " + Q(p, "CHF") + " hors taxe, calcule les deux prix. Lequel est le plus avantageux pour le client ? De combien ?", pts: 1 }, { label: "Détermine la réciproque de " + M("f \\circ g") + ". Un client a payé " + Q(P2, "CHF") + " (TVA puis bon) : quel était le prix hors taxe ?", pts: 2 }, { label: "Avec un rabais de 10 % (" + M("r(x) = 0{,}9x") + ") au lieu du bon, l'ordre compte-t-il ?", pts: 1 }],
        sol: ul([M("(f \\circ g)(x) = 1{,}081x - " + Rb) + " : TVA d'abord, puis bon ; " + M("(g \\circ f)(x) = 1{,}081(x - " + Rb + ") = 1{,}081x - " + N(1.081 * Rb)) + " : bon d'abord, puis TVA.", M("(f \\circ g)(" + p + ") = " + A(fg, 2)) + " CHF ; " + M("(g \\circ f)(" + p + ") = " + A(gf, 2)) + " CHF. Le bon avant la TVA est plus avantageux de " + M(A(fg - gf, 2)) + " CHF (la TVA ne porte pas sur le bon).", M("y = 1{,}081x - " + Rb) + " ⟺ " + M("x = \\frac{y + " + Rb + "}{1{,}081}") + " ; " + M("\\frac{" + N(P2) + " + " + Rb + "}{1{,}081} = " + p2) + " CHF.", "Non : " + M("1{,}081 \\cdot 0{,}9x = 0{,}9 \\cdot 1{,}081x") + ", les deux composées sont égales."]),
        chk: [[fg, A(fg, 2), 0.01], [gf, A(gf, 2), 0.01], [fg - gf, A(fg - gf, 2), 0.01], [(P2 + Rb) / 1.081, String(p2), 0.01]] }); },
    // Ajouts du 24.11 (agent mp4plus) : fonctions rationnelles.
    // Le mélange (fonction rationnelle : image, asymptote horizontale, équation)
    () => { const V0 = pk([20, 40, 60]), k = pk([100, 200, 300]), xs = pk([V0, 3 * V0, V0 / 4, 1.5 * V0]), T = (k * xs) / (xs + V0), x1 = pk([5, 10, 20].filter((x) => x !== xs)), c1 = (k * x1) / (x1 + V0);
      const K = pk([["Un aquarium d'eau de mer est préparé dans une cuve qui", "une eau très salée", "de sel"], ["Une cuve de fabrication de sirop", "un concentré sucré", "de sucre"], ["Le réservoir d'un pulvérisateur agricole", "un engrais liquide", "d'engrais"]]);
      return X({ id: "fratmp", lv: 2, titre: "Le mélange",
        q: K[0] + " contient " + Q(V0, "L") + " d'eau pure. On y verse " + M("x") + " litres d'" + K[1] + " à " + M(k + "\\ \\text{g/L}") + " " + K[2] + ". La concentration du mélange (en g/L) est " + M("c(x) = \\frac{" + k + "x}{x + " + V0 + "}") + ".",
        parts: [{ label: "Calcule " + M("c(" + x1 + ")") + " (au centième) et interprète.", pts: 1 }, { label: "Quelle est l'asymptote horizontale de " + M("c") + " ? Que signifie-t-elle pour le mélange ?", pts: 1 }, { label: "Combien de litres faut-il verser pour atteindre " + Q(T, "g/L") + " ?", pts: 2 }, { label: "Quelle est la valeur interdite de " + M("c") + " ? Pourquoi ne gêne-t-elle pas ici ?", pts: 1 }],
        sol: ul([M("c(" + x1 + ") = \\frac{" + k * x1 + "}{" + (x1 + V0) + "} " + eqA(c1)) + " g/L : avec " + Q(x1, "L") + " versés, chaque litre de mélange contient environ " + M(A(c1, 2)) + " g " + K[2] + ".", M("\\frac{" + k + "x}{x} = " + k) + " : asymptote " + M("y = " + k) + ". Plus on verse, plus le mélange ressemble au produit pur ; sa concentration s'approche de " + Q(k, "g/L") + " sans jamais l'atteindre.", M(k + "x = " + N(T) + "(x + " + V0 + ")") + " ⟺ " + M(N(k - T) + "x = " + N(T * V0)) + " ⟺ " + M("x = " + N(xs)) + " L.", M("x = -" + V0) + " (le dénominateur s'annule) ; ici " + M("x \\ge 0") + " (on ne peut pas verser une quantité négative), donc cette valeur n'est jamais atteinte."]),
        chk: [[c1, A(c1, 2), 0.01], [k, String(k)], [xs, N(xs)], [-V0, String(-V0)]] }); },
    // La lentille (fonction rationnelle d'un modèle physique)
    () => { const f = pk([8, 12, 20]), m = pk([2, 3, 1.5, 5]), T = m * f, dT = (m * f) / (m - 1), k1 = pk([3, 4, 5].filter((k) => k * f !== dT)), d1 = k1 * f, i1 = (f * d1) / (d1 - f), K = pk(["l'objectif d'un appareil photo", "la lentille d'un projecteur de diapositives", "la lentille d'une webcam"]);
      return X({ id: "fratmp", lv: 3, titre: "La lentille",
        q: "Pour " + K + " de distance focale " + Q(f, "cm") + ", un objet placé à la distance " + M("d") + " (en cm, " + M("d > " + f) + ") donne une image nette à la distance " + M("i(d) = \\frac{" + f + "d}{d - " + f + "}") + " (en cm) derrière la lentille.",
        parts: [{ label: "Calcule " + M("i(" + d1 + ")") + " (au centième).", pts: 1 }, { label: "Quelle est la valeur interdite de " + M("i") + " ? Que devient l'image quand l'objet s'approche de cette distance ?", pts: 1 }, { label: "Quelle est l'asymptote horizontale ? Interprète-la pour un objet très éloigné.", pts: 1 }, { label: "À quelle distance faut-il placer l'objet pour que l'image soit à " + Q(T, "cm") + " ?", pts: 2 }],
        sol: ul([M("i(" + d1 + ") = \\frac{" + f * d1 + "}{" + (d1 - f) + "} " + eqA(i1)) + " cm.", M("d = " + f) + " (le dénominateur s'annule). Quand " + M("d") + " s'approche de " + M(f) + ", " + M("i(d)") + " devient énorme : l'image part « à l'infini » (asymptote verticale " + M("d = " + f) + ").", M("\\frac{" + f + "d}{d} = " + f) + " : asymptote " + M("y = " + f) + ". Pour un objet très lointain, l'image se forme dans le plan focal, à " + Q(f, "cm") + " de la lentille.", M(f + "d = " + N(T) + "(d - " + f + ")") + " ⟺ " + M(N(T - f) + "d = " + N(T * f)) + " ⟺ " + M("d = " + N(dT)) + " cm (plus grand que " + M(f) + ", donc permis)."]),
        chk: [[i1, A(i1, 2), 0.01], [f, String(f)], [dT, N(dT)]] }); },
  ];
  const RAISONF = [
    () => VF("ineqmp", 1, [["« " + M("-3x > 12") + " équivaut à " + M("x > -4") + ". »", false, "On divise par " + M("-3") + " : le sens change, " + M("x \\lt -4") + "."],
      ["« " + M("(x - 2)^2 > 0") + " pour tout " + M("x") + ". »", false, "Pour " + M("x = 2") + ", " + M("(x - 2)^2 = 0") + "."],
      ["« Si " + M("P(3) = 0") + ", alors " + M("(x - 3)") + " divise " + M("P(x)") + ". »", true, "Le reste de la division par " + M("(x - 3)") + " vaut " + M("P(3) = 0") + "."],
      ["« La période de " + M("\\sin(2x)") + " est " + M("4\\pi") + ". »", false, M("2\\pi : 2 = \\pi") + "."],
      ["« " + M("f(x) = x^3") + " est impaire. »", true, M("(-x)^3 = -x^3") + "."],
      ["« Le graphe de " + M("f(x) + 3") + " est celui de " + M("f") + " décalé de 3 vers la droite. »", false, "Vers le haut ; vers la droite, c'est " + M("f(x - 3)") + "."],
      ["« " + M("\\log_2 x") + " n'est définie que pour " + M("x > 0") + ". »", true, "C'est la réciproque de " + M("2^x") + ", toujours positive."]]),
    () => { const a = pk([2, 3, 4, 5]), s = R.nz(-4, 4), b = R.nz(-6, 9), c = b - a * s, w = RX.who();
      return X({ id: "ineqmp", lv: 1, titre: "Trouve l'erreur",
        q: w + " résout " + M("-" + a + "x" + sg(b) + " \\geq " + N(c)) + " : « " + M("-" + a + "x \\geq " + N(c - b)) + ", donc " + M("x \\geq " + s) + ". »",
        parts: [{ label: "Teste sa réponse avec " + M("x = " + (s + 1)) + ". Que constates-tu ?", pts: 1 }, { label: "Quelle est l'erreur ? Donne la bonne solution.", pts: 1 }],
        sol: ul([M("-" + a + " \\cdot " + par(s + 1) + sg(b) + " = " + N(-a * (s + 1) + b)) + ", et " + M(N(-a * (s + 1) + b) + " \\lt " + N(c)) + " : " + M("x = " + (s + 1)) + " ne convient pas.", "En divisant par " + M("-" + a) + ", négatif, il faut retourner le sens : " + M("x \\leq " + s) + "."]),
        chk: [[(c - b) / -a, String(s)]] }); },
    () => { const a = pk([2, 3, 5]), b = pk([2, 3, 4]), d = pk([-1, 1, 4]), w = RX.who();
      return X({ id: "sinusmp", lv: 2, titre: "Trouve l'erreur",
        q: "Pour " + M("f(x) = " + a + "\\sin(" + b + "x)" + sg(d)) + ", " + w + " écrit : « période " + M("2\\pi \\cdot " + b + " = " + 2 * b + "\\pi") + ", maximum " + M(a) + ". »",
        parts: [{ label: "Corrige la période.", pts: 1 }, { label: "Corrige le maximum et donne le minimum.", pts: 1 }],
        sol: ul([M("\\frac{2\\pi}{" + b + "}" + (b === 2 ? " = \\pi" : "")) + " : avec " + M(b + "x") + ", la courbe va " + b + " fois plus vite.", "Maximum " + M(d + " + " + a + " = " + (d + a)) + " ; minimum " + M(d + " - " + a + " = " + (d - a)) + " (l'axe est " + M("y = " + d) + ")."]),
        chk: [[d + a, String(d + a)], [d - a, String(d - a)]] }); },
    // Ajout du 24.11 (agent mp4plus) : valeur interdite oubliée.
    () => { const p = pk([-5, -4, -3, -2, 2, 3, 4, 5, 6]), k = pk([2, 3, 4, 5]), w = RX.who(), num = k + "x" + sg(-k * p), dn = "x" + sg(-p);
      return X({ id: "fratmp", lv: 2, titre: "Trouve l'erreur",
        q: w + " résout " + M("\\frac{" + num + "}{" + dn + "} = " + k) + " : « Je multiplie par " + M("(" + dn + ")") + " : " + M(num + " = " + num) + ", c'est toujours vrai, donc tous les nombres réels sont solutions. »",
        parts: [{ label: "Remplace " + M("x") + " par " + M(p) + " dans l'équation de départ. Que se passe-t-il ?", pts: 1 }, { label: "Quelle est l'erreur ? Donne l'ensemble des solutions correct.", pts: 1 }],
        sol: ul(["Le dénominateur vaut " + M(p + sg(-p) + " = 0") + " : la fraction n'existe pas, " + M(p) + " est une valeur interdite.", "On ne peut multiplier par " + M("(" + dn + ")") + " que si " + M(dn + " \\neq 0") + " : il fallait exclure la valeur interdite. " + M("S = \\mathbb{R} \\setminus \\{" + p + "\\}") + " (pour " + M("x \\neq " + p) + ", la fraction se simplifie en " + M(k) + ")."]),
        chk: [[p, String(p)]] }); },
  ];

  RICH.eqmp3 = { ids: ["eqabs", "eqbic", "eqirrmp", "eqratmp"], track: "mp", label: "Équations avancées (MP)", ex: EXA, raison: RAISONA, minutes: 45 };
  RICH.logmp3 = { ids: ["puisrat", "logdef", "logprop", "eqexp", "eqlog", "croissexp"], track: "mp", label: "Exponentielles et logarithmes (MP)", ex: EXL, raison: RAISONL, minutes: 45 };
  RICH.volmp3 = { ids: ["volmp", "similmp"], track: "mp", label: "Volumes et similitude (MP)", ex: EXV, raison: RAISONV, minutes: 45 };
  RICH.vecmp4 = { ids: ["coordmp", "vectmp", "scalmp", "projmp", "pvectmp", "droiteparam", "posdroites"], track: "mp", label: "Géométrie vectorielle (MP)", ex: EXG, raison: RAISONG, minutes: 45 };
  RICH.fctmp4 = { ids: ["ineqmp", "fctmp", "polymp", "sinusmp", "explogfn", "fratmp"], track: "mp", label: "Inéquations et fonctions (MP)", ex: EXF, raison: RAISONF, minutes: 45 };
})();
