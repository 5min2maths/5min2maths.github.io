// Exercices riches par chapitre (15.11, chantier « test de préparation de qualité, pas du drill ») : le sujet de
// préparation (sujet.js) en tire ses exercices quand les notions révisées appartiennent à un chapitre qui a sa banque.
// Modèle : de vrais tests de 11e (questions de 2 à 4 points, justification demandée, calculatrice
// autorisée, grille par critère) et le dossier du chapitre — modelés, jamais recopiés.
// Un exercice = { id (notion principale), lv (1 à 3), titre, q (situation), fig?, parts: [{ label, pts }], sol }.
// Le corrigé donne pour chaque partie la réponse et ce qui rapporte les points.
const RICH = {};
(function () {
  const r6 = (v) => Math.round(v * 1e6) / 1e6;
  const N = (v) => { let [i, f] = String(r6(v)).split("."); if (i.replace("-", "").length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}"); return i + (f ? "{,}" + f : ""); };
  const T = (v) => M(N(v));
  const A = (v, k) => N(+(+v).toFixed(k)); // arrondi
  const u = (s) => ("\\ \\text{" + s.replace(/\^3/, "}^3\\text{") + "}").replace(/\\text\{\}$/, "");
  const Q = (v, s) => M(N(v) + u(s));
  const two = (n) => (n < 10 ? "0" : "") + n;
  const hor = (m) => Math.floor(m / 60) + " h " + two(m % 60);
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  // Pas de points affichés (15.11) : le poids sert seulement à pondérer l'auto-correction en interne.
  const nopts = (s) => s.replace(/ ?\((?:\d+ pts?(?: \+ \d+ pts?)*)(?: par objet| avec la justification)?\)/g, "").replace(/\(\d+ pts?, /g, "(").replace(/Pas de points : on/g, "On");
  const X = (o) => Object.assign({ pts: Math.max(1, o.parts.reduce((s, p) => s + p.pts, 0)) }, o, { sol: nopts(o.sol), parts: o.parts.map((p) => ({ label: p.label, pts: p.pts })) });
  const ul = (rows) => "<ol type=\"a\" class=\"mock-parts\">" + rows.map((r) => "<li>" + r + "</li>").join("") + "</ol>";

  // ===================== 11e · 4. Proportionnalité, grandeurs quotients et unités =====================
  const EX = [
    // Trajet du matin (vitesse, durées ; interprétation)
    () => { const dep = 7 * 60 + R.int(25, 35), marche = R.int(7, 11), dm = pk([550, 600, 650, 700, 750]), busDep = dep + marche + R.int(2, 4), busMin = pk([15, 16, 18, 20]), km = pk([6, 6.4, 7.2, 8]), vb = km / (busMin / 60), vm = dm / 1000 / (marche / 60), who = pk(["Lina", "Noé", "Inès", "Yanis"]);
      return X({ id: "vitesse", lv: 1, titre: "Le trajet du matin",
        q: who + " part de chez " + (["Lina", "Inès"].includes(who) ? "elle" : "lui") + " à " + hor(dep) + ". " + (["Lina", "Inès"].includes(who) ? "Elle" : "Il") + " marche " + Q(dm, "m") + " jusqu'à l'arrêt en " + marche + " min, puis prend le bus de " + hor(busDep) + ", qui " + (["Lina", "Inès"].includes(who) ? "la" : "le") + " dépose devant l'école à " + hor(busDep + busMin) + " après " + Q(km, "km") + ".",
        parts: [{ label: "Combien de temps dure le trajet en bus ? Écris-le aussi en heures (nombre décimal).", pts: 2 }, { label: "Calcule la vitesse moyenne du bus en km/h.", pts: 1 }, { label: "Calcule la vitesse de marche en km/h (au dixième).", pts: 2 }, { label: "Le bus a-t-il pu rouler à " + Math.round(vb + 15) + " km/h pendant tout le trajet ? Explique.", pts: 1 }],
        sol: ul(["" + busMin + " min ; " + M(busMin + " : 60 = " + N(r6(busMin / 60))) + " h (1 pt + 1 pt).", M("v = " + N(km) + " : " + N(r6(busMin / 60)) + " = " + A(vb, 2)) + " km/h (1 pt).", M(N(dm) + u("m") + " = " + N(dm / 1000) + u("km")) + " et " + M(marche + u("min") + " = \\frac{" + marche + "}{60}" + u("h")) + " (1 pt) ; " + M("v \\approx " + A(vm, 1)) + " km/h (1 pt).", "Non : à " + Math.round(vb + 15) + " km/h, il aurait mis " + M(N(km) + " : " + Math.round(vb + 15) + " \\approx " + A(km / (vb + 15) * 60, 0)) + " min, moins que " + busMin + " min. Il roule parfois plus vite, parfois moins vite (arrêts, feux) : " + A(vb, 1) + " km/h est une moyenne (1 pt)."]) }); },
    // Radar (conversions, vitesse ; décision)
    () => { const lim = pk([50, 80]), d = lim === 50 ? pk([20, 25]) : pk([30, 35]), t = pk([1.2, 1.25, 1.4, 1.5]), ms = d / t, kmh = ms * 3.6, ex = kmh > lim;
      return X({ id: "ucomp", lv: 2, titre: "Contrôle radar",
        q: "Sur une route limitée à " + Q(lim, "km/h") + ", un radar mesure qu'une voiture parcourt " + Q(d, "m") + " en " + Q(t, "s") + ". La voiture est rouge et transporte 3 personnes.",
        parts: [{ label: "Calcule sa vitesse en m/s (au centième).", pts: 1 }, { label: "Exprime cette vitesse en km/h (au dixième).", pts: 1 }, { label: "Le conducteur est-il en excès de vitesse ? Justifie.", pts: 1 }, { label: "Quelle distance parcourt-on en " + Q(1, "s") + " (temps de réaction) à " + Q(lim, "km/h") + " ? (au dixième de mètre)", pts: 2 }],
        sol: ul([M(N(d) + " : " + N(t) + " \\approx " + A(ms, 2)) + " m/s (1 pt).", M(A(ms, 2) + " \\cdot 3{,}6 \\approx " + A(kmh, 1)) + " km/h (1 pt).", (ex ? "Oui : " + A(kmh, 1) + " km/h > " + lim + " km/h" : "Non : " + A(kmh, 1) + " km/h ≤ " + lim + " km/h") + " (1 pt, la comparaison doit être faite dans la même unité). La couleur et le nombre de passagers ne servent à rien.", M(lim + u("km/h") + " = " + lim + " : 3{,}6 \\approx " + A(lim / 3.6, 1) + u("m/s")) + " (1 pt) : environ " + Q(+(lim / 3.6).toFixed(1), "m") + " parcourus avant même de freiner (1 pt)."]) }); },
    // Orage (estimation puis calcul)
    () => { const t = pk([6, 7, 9, 11, 12]), d = 340 * t;
      return X({ id: "vitesse", lv: 2, titre: "L'orage approche",
        q: "Pendant un orage, on compte " + t + " secondes entre l'éclair et le tonnerre. Le son se propage à environ " + Q(340, "m/s") + " ; la lumière, à " + M("300\\text{'}000" + u("km/s")) + ".",
        parts: [{ label: "<b>Sans calculatrice</b> : on dit souvent « 3 secondes par kilomètre ». Estime la distance de l'orage.", pts: 1 }, { label: "Calcule cette distance en km avec la vitesse du son.", pts: 1 }, { label: "Combien de temps la lumière met-elle pour parcourir cette distance ? Pourquoi peut-on la négliger ?", pts: 2 }, { label: "Dix minutes plus tard, on compte " + Math.round(t / 2) + " s. L'orage s'éloigne-t-il ou se rapproche-t-il ? Explique.", pts: 1 }],
        sol: ul(["Environ " + M(t + " : 3 = " + N(r6(t / 3)).replace(/(\{,\}\d)\d+/, "$1")) + " km (1 pt).", M("340 \\cdot " + t + " = " + N(d)) + " m ≈ " + Q(d / 1000, "km") + " (1 pt).", M("t = " + N(d / 1000) + " : 300\\text{'}000 \\approx " + A(d / 1000 / 300000 * 1e6, 1)) + " millionièmes de seconde (1 pt) : c'est négligeable devant " + t + " s (1 pt).", "Il se rapproche : le son met moins de temps, donc la distance est plus courte (1 pt)."]) }); },
    // Métaux (masse volumique, tableau, donnée inutile)
    () => { const M3 = [["aluminium", 2.7], ["fer", 7.9], ["cuivre", 8.9], ["argent", 10.5], ["plomb", 11.3]], pick = [0, 1, 2, 3, 4].sort(() => R.rand() - 0.5).slice(0, 3).sort((a, b) => a - b), objs = ["Objet A", "Objet B", "Objet C"], V = [R.int(8, 30), R.int(12, 40), R.int(5, 25)], ordre = [0, 1, 2].sort(() => R.rand() - 0.5);
      const rows = ordre.map((k, i) => ({ nom: objs[i], met: M3[pick[k]], V: V[i], m: r6(M3[pick[k]][1] * V[i]), prix: R.int(12, 90) }));
      const tab = "<table class=\"mtab\"><tr><th></th><th>masse (g)</th><th>volume (cm³)</th><th>prix (CHF)</th></tr>" + rows.map((r) => "<tr><td>" + r.nom + "</td><td>" + T(r.m) + "</td><td>" + T(r.V) + "</td><td>" + r.prix + "</td></tr>").join("") + "</table>";
      const ref = "Masses volumiques (g/cm³) : " + M3.map((m) => m[0] + " " + String(m[1]).replace(".", ",")).join(" ; ") + ".";
      const sorted = rows.slice().sort((a, b) => a.met[1] - b.met[1]);
      return X({ id: "gquot", lv: 1, titre: "Trois objets métalliques",
        q: "Un brocanteur a pesé et mesuré trois objets." + tab + "<p class=\"small\">" + ref + "</p>",
        parts: [{ label: "Calcule la masse volumique de chaque objet.", pts: 3 }, { label: "En quel métal chaque objet est-il fait ?", pts: 1 }, { label: "Range les objets du plus « lourd pour sa taille » au plus léger. Une colonne du tableau ne sert à rien : laquelle ?", pts: 1 }],
        sol: ul([rows.map((r) => r.nom + " : " + M(N(r.m) + " : " + r.V + " = " + N(r.met[1]))).join(" ; ") + " g/cm³ (1 pt par objet).", rows.map((r) => r.nom + " : " + r.met[0]).join(", ") + " (1 pt).", sorted.slice().reverse().map((r) => r.nom).join(" > ") + " (ordre des masses volumiques) ; le prix ne sert à rien (1 pt)."]) }); },
    // L'air de la classe (estimation, volume, masse, comparaison)
    () => { const L = R.int(8, 11), l = R.int(6, 8), h = pk([3, 3.2, 3.5]), V = r6(L * l * h), m = r6(1.2 * V), e = pk([50, 55, 60]);
      return X({ id: "gquot", lv: 2, titre: "Combien pèse l'air de la classe ?",
        q: "Une salle de classe mesure " + Q(L, "m") + " sur " + Q(l, "m") + " et " + Q(h, "m") + " de haut. À 20 °C, l'air a une masse volumique de " + M("1{,}2" + u("kg/m^3")) + ".",
        parts: [{ label: "<b>Avant de calculer</b> : à ton avis, l'air de la classe pèse-t-il plutôt 1 kg, 30 kg ou 300 kg ?", pts: 0 }, { label: "Calcule le volume de la salle.", pts: 1 }, { label: "Calcule la masse de l'air contenu dans la salle.", pts: 1 }, { label: "Combien d'élèves de " + e + " kg faudrait-il pour avoir la même masse ? (arrondi à l'unité)", pts: 1 }, { label: "Quelle masse d'air y a-t-il dans " + M("1" + u("dm^3")) + " ? Donne la réponse en grammes.", pts: 1 }],
        sol: ul(["Pas de points : on compare avec le résultat. La plupart des élèves sous-estiment !", M("V = " + L + " \\cdot " + l + " \\cdot " + N(h) + " = " + N(V)) + " m³ (1 pt).", M("m = 1{,}2 \\cdot " + N(V) + " = " + N(m)) + " kg (1 pt).", M(N(m) + " : " + e + " \\approx " + Math.round(m / e)) + " élèves (1 pt).", M("1" + u("m^3") + " = 1000" + u("dm^3")) + " : " + M("1{,}2" + u("kg") + " : 1000 = 1{,}2" + u("g")) + " (1 pt)."]) }); },
    // Bain ou douche (débit ; interprétation)
    () => { const B = pk([140, 150, 160, 180]), q = pk([8, 9, 10, 12]), mn = R.int(5, 8), V = q * (mn + 0.5), an = r6((B - V) * 365 / 1000);
      return X({ id: "gquot", lv: 2, titre: "Bain ou douche ?",
        q: "Une baignoire contient " + Q(B, "L") + " d'eau. Le pommeau de douche a un débit de " + Q(q, "L/min") + ".",
        parts: [{ label: "Combien de temps peut-on se doucher avec l'eau d'un bain ? (en min et s)", pts: 2 }, { label: "Une douche dure " + mn + " min 30 s. Quel volume d'eau utilise-t-elle ?", pts: 1 }, { label: "Une personne remplace un bain par jour par cette douche pendant un an. Combien de m³ économise-t-elle (au dixième) ?", pts: 2 }],
        sol: ul([M(B + " : " + q + " = " + N(r6(B / q))) + " min (1 pt), soit " + Math.floor(B / q) + " min " + Math.round((B / q - Math.floor(B / q)) * 60) + " s (1 pt).", M(mn + u("min") + "\\ 30" + u("s") + " = " + N(mn + 0.5) + u("min")) + " ; " + M(q + " \\cdot " + N(mn + 0.5) + " = " + N(V)) + " L (1 pt).", "Par jour : " + M(B + " - " + N(V) + " = " + N(B - V)) + " L (1 pt) ; par an : " + M(N(B - V) + " \\cdot 365 = " + N((B - V) * 365)) + " L ≈ " + Q(+an.toFixed(1), "m^3") + " (1 pt)."]) }); },
    // Record du marathon (durées h min s, vitesse, comparaison)
    () => { const c = pk([["Kelvin Kiptum", 2, 0, 35], ["Eliud Kipchoge", 2, 1, 9]]), t = 3600 * c[1] + 60 * c[2] + c[3], v = 42195 / t, vel = pk([18, 20, 22]);
      return X({ id: "vitesse", lv: 3, titre: "Le record du marathon",
        q: "Un marathon mesure " + M("42\\text{'}195" + u("m")) + ". " + c[0] + " l'a couru en " + c[1] + " h " + two(c[2]) + " min " + two(c[3]) + " s.",
        parts: [{ label: "Écris la durée de la course en secondes.", pts: 1 }, { label: "Calcule sa vitesse moyenne en m/s (au centième), puis en km/h (au dixième).", pts: 2 }, { label: "Un cycliste roule à " + Q(vel, "km/h") + ". Qui va le plus vite ? Justifie.", pts: 1 }, { label: "À cette vitesse, combien de temps le coureur met-il pour un 400 m ? (au dixième de seconde)", pts: 1 }],
        sol: ul([M(c[1] + " \\cdot 3600 + " + c[2] + " \\cdot 60 + " + c[3] + " = " + N(t)) + " s (1 pt).", M("42\\text{'}195 : " + N(t) + " \\approx " + A(v, 2)) + " m/s (1 pt) ; " + M(A(v, 2) + " \\cdot 3{,}6 \\approx " + A(v * 3.6, 1)) + " km/h (1 pt).", (v * 3.6 > vel ? "Le coureur" : "Le cycliste") + " : " + A(v * 3.6, 1) + " km/h contre " + vel + " km/h (1 pt, même unité).", M("400 : " + A(v, 2) + " \\approx " + A(400 / v, 1)) + " s (1 pt) — plus vite qu'un bon élève sur un seul tour !"]) }); },
    // Pièce de Bob le pirate (volume, masse volumique, décision)
    () => { const d = pk([20, 22, 24]), e = pk([1.5, 2]), V = Math.PI * (d / 20) ** 2 * (e / 10), vraie = R.rand() < 0.5, rho = vraie ? 19.3 : 8.7, m = +(rho * V).toFixed(1);
      return X({ id: "gquot", lv: 3, titre: "Le trésor de Bob le pirate",
        q: "Bob a trouvé des pièces dorées. Une pièce est un cylindre de diamètre " + Q(d, "mm") + " et d'épaisseur " + Q(e, "mm") + " ; elle pèse " + Q(m, "g") + ". L'or a une masse volumique de " + M("19{,}3" + u("g/cm^3")) + ", le laiton (un alliage doré bon marché) de " + M("8{,}7" + u("g/cm^3")) + ".",
        parts: [{ label: "Calcule le volume de la pièce en cm³ (au millième).", pts: 2 }, { label: "Calcule la masse volumique de la pièce (au dixième).", pts: 1 }, { label: "La pièce est-elle en or ? Justifie.", pts: 1 }, { label: "Quelle masse aurait une pièce identique en or massif ?", pts: 1 }],
        sol: ul(["En cm : " + M("r = " + N(d / 20)) + " cm, " + M("h = " + N(e / 10)) + " cm (1 pt) ; " + M("V = \\pi \\cdot " + N(d / 20) + "^2 \\cdot " + N(e / 10) + " \\approx " + A(V, 3)) + " cm³ (1 pt).", M("\\rho = " + N(m) + " : " + A(V, 3) + " \\approx " + A(m / V, 1)) + " g/cm³ (1 pt).", (vraie ? "Oui : environ 19,3 g/cm³, c'est la masse volumique de l'or" : "Non : environ 8,7 g/cm³, c'est du laiton") + " (1 pt).", M("19{,}3 \\cdot " + A(V, 3) + " \\approx " + A(19.3 * V, 1)) + " g (1 pt)."]) }); },
  ];
  const RAISON = [
    // Trouve l'erreur : moyenne des vitesses
    () => { const [v1, v2, d] = pk([[60, 40, 120], [90, 60, 180], [120, 80, 240]]), vm = 2 * d / (d / v1 + d / v2), who = pk(["Sam", "Léa", "Yanis"]);
      return X({ id: "vitesse", lv: 2, titre: "Trouve l'erreur",
        q: "Une voiture fait l'aller de " + Q(d, "km") + " à " + Q(v1, "km/h") + " et le retour à " + Q(v2, "km/h") + ". " + who + " écrit : « La vitesse moyenne est " + M("\\frac{" + v1 + " + " + v2 + "}{2} = " + (v1 + v2) / 2) + " km/h. »",
        parts: [{ label: "Explique l'erreur de " + who + ".", pts: 1 }, { label: "Calcule la vraie vitesse moyenne.", pts: 2 }],
        sol: ul(["On roule plus longtemps à " + v2 + " km/h qu'à " + v1 + " km/h : on ne fait pas la moyenne des vitesses, on divise la distance totale par la durée totale (1 pt).", "Durées " + M(N(d / v1)) + " h et " + M(N(d / v2)) + " h (1 pt) ; " + M("v = " + 2 * d + " : " + N(d / v1 + d / v2) + " = " + N(vm)) + " km/h (1 pt)."]) }); },
    // Trouve l'erreur : heures décimales
    () => { const h = 1, mn = pk([15, 45, 20, 40]), v = pk([60, 72, 48]), d = v * (h + mn / 60), wrong = d / (h + mn / 100), who = pk(["Inès", "Noé", "Lina"]);
      return X({ id: "vitesse", lv: 2, titre: "Trouve l'erreur",
        q: "Un car parcourt " + Q(d, "km") + " en " + h + " h " + mn + " min. " + who + " calcule : « " + h + " h " + mn + " min " + M("= " + h + "{,}" + mn + u("h")) + ", donc " + M("v = " + N(d) + " : " + h + "{,}" + mn + " \\approx " + A(wrong, 1)) + " km/h. »",
        parts: [{ label: "À quelle étape est l'erreur ? Explique-la.", pts: 1 }, { label: "Corrige le calcul.", pts: 2 }],
        sol: ul(["Première étape : " + mn + " min ne font pas 0," + mn + " h. Une heure vaut 60 min, pas 100 (1 pt).", M(mn + " : 60 = " + N(r6(mn / 60))) + ", donc " + M(N(r6(h + mn / 60)) + u("h")) + " (1 pt) ; " + M("v = " + N(d) + " : " + N(r6(h + mn / 60)) + " = " + v) + " km/h (1 pt)."]) }); },
    // Vrai ou faux, justifie
    () => { const S = pk([
        [["« " + M("36" + u("km/h") + " = 10" + u("m/s")) + " »", true, M("36 : 3{,}6 = 10") + "."], ["« " + M("2{,}5" + u("h")) + " = 2 h 50 min »", false, M("0{,}5 \\cdot 60 = 30") + " : 2,5 h = 2 h 30 min."], ["« 1 kg de plomb occupe plus de place que 1 kg de bois »", false, "Même masse ; le plomb a une masse volumique bien plus grande, donc un volume plus petit."]],
        [["« " + M("1" + u("g/cm^3") + " = 1\\text{'}000" + u("kg/m^3")) + " »", true, "Un m³ contient 1'000'000 cm³ : 1'000'000 g = 1'000 kg."], ["« Si on double la vitesse, la durée d'un trajet est divisée par deux »", true, M("t = \\frac{d}{v}") + " : la distance ne change pas, la durée et la vitesse sont inversement proportionnelles."], ["« 90 min = 1,5 h, donc 75 min = 1,25 h »", true, M("75 : 60 = 1{,}25") + "."]],
        [["« Une vitesse de 20 m/s est plus grande que 70 km/h »", true, M("20 \\cdot 3{,}6 = 72") + " km/h > 70 km/h."], ["« 3 h 20 min = 3,2 h »", false, M("20 : 60 \\approx 0{,}33") + " : 3 h 20 min ≈ 3,33 h."], ["« Un débit de 1 L/s, c'est 60 L/min »", true, "En une minute, il coule 60 fois plus qu'en une seconde."]],
      ]);
      return X({ id: "ucomp", lv: 1, titre: "Vrai ou faux ? Justifie",
        q: "Pour chaque affirmation, dis si elle est vraie ou fausse et justifie par un calcul ou une phrase.",
        parts: S.map((s) => ({ label: s[0], pts: 1 })),
        sol: ul(S.map((s) => "<b>" + (s[1] ? "Vrai" : "Faux") + "</b>. " + s[2] + " (1 pt avec la justification)")) }); },
    // Compare deux méthodes
    () => { const v = pk([54, 72, 90, 108]);
      return X({ id: "ucomp", lv: 1, titre: "Deux méthodes",
        q: "Pour convertir " + Q(v, "km/h") + " en m/s, Yanis écrit " + M(v + " : 3{,}6 = " + v / 3.6) + ". Léa écrit : « en 1 h, " + M(N(v * 1000) + u("m")) + " ; en 1 s, " + M(N(v * 1000) + " : 3600 = " + v / 3.6) + " m. »",
        parts: [{ label: "Explique pourquoi les deux méthodes donnent le même résultat.", pts: 2 }, { label: "Utilise la méthode de ton choix pour convertir " + Q(v / 3.6 + 5, "m/s") + " en km/h.", pts: 1 }],
        sol: ul(["Léa multiplie par 1000 puis divise par 3600 : c'est diviser par " + M("3600 : 1000 = 3{,}6") + " (1 pt), ce que fait Yanis en une étape (1 pt).", M(N(v / 3.6 + 5) + " \\cdot 3{,}6 = " + N(r6((v / 3.6 + 5) * 3.6))) + " km/h (1 pt)."]) }); },
  ];
  RICH.prop11 = { ids: ["utemps", "ucomp", "vitesse", "gquot"], label: "Proportionnalité, grandeurs quotients et unités", ex: EX, raison: RAISON, minutes: 45 };
})();

// Chapitre du sujet de préparation : celui dont la banque couvre le plus de notions révisées (au moins la moitié).
function richChapter(ids) {
  let best = null, n = 0;
  for (const [k, c] of Object.entries(RICH)) { const m = ids.filter((id) => c.ids.includes(id)).length; if (m > n) { best = k; n = m; } }
  return best && n * 2 >= ids.length ? best : null;
}
