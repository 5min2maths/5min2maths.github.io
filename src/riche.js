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
  const u = (s) => ("\\ \\text{" + s.replace(/\^([23])/, "}^$1\\text{") + "}").replace(/\\text\{\}$/, "");
  const Q = (v, s) => M(N(v) + u(s));
  const two = (n) => (n < 10 ? "0" : "") + n;
  const hor = (m) => Math.floor(m / 60) + " h " + two(m % 60);
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  // Pas de points affichés (15.11) : le poids sert seulement à pondérer l'auto-correction en interne.
  const nopts = (s) => s.replace(/ ?\((?:\d+ pts?(?: \+ \d+ pts?)*)(?: par objet| avec la justification)?\)/g, "").replace(/\(\d+ pts?, /g, "(").replace(/Pas de points : on/g, "On");
  // Virgule décimale hors formule (16.11) : « 20{,}9 » écrit hors de \( \) s'affichait tel quel ; on la remet en texte.
  const pd = (t) => colonBreak(String(t).split(/(\\\(.*?\\\))/).map((seg, i) => (i % 2 ? seg : seg.replace(/\{,\}/g, ",").replace(/\\text\{'\}/g, "'"))).join(""));
  const X = (o) => Object.assign({ pts: Math.max(1, o.parts.reduce((s, p) => s + p.pts, 0)) }, o, { q: pd(o.q), sol: pd(nopts(o.sol)), parts: o.parts.map((p) => ({ label: pd(p.label), pts: p.pts })) });
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
  // ===================== 11e · 5. Calcul littéral (15.11) =====================
  const sgn = (v) => (v < 0 ? "- " + Math.abs(v) : "+ " + v);
  const EXL = [
    // Max a perdu les consignes (développer / réduire / factoriser)
    () => { const a = R.int(2, 6), b = R.int(2, 5), c = R.int(2, 4), g = pk([2, 3, 5]); let p, q; do { p = R.int(2, 5); q = pk([1, 3, 5, 7]); } while (q % g === 0 || [2, 3, 5, 7].some((d) => p % d === 0 && q % d === 0));
      return X({ id: "distrib", lv: 1, titre: "Les consignes perdues de Max",
        q: "Max a fait trois calculs, mais il n'a pas recopié les consignes." + ul([M(a + "y(" + b + "x - " + c + ") = " + a * b + "xy - " + a * c + "y"), M("x^2 + 3x - 4 + 2x^2 - x = 3x^2 + 2x - 4"), M(g * p + "x + " + g * q + " = " + g + "(" + p + "x + " + q + ")")]),
        parts: [{ label: "Pour chaque calcul, écris la consigne : développer, réduire ou factoriser.", pts: 3 }, { label: "Vérifie le premier calcul en remplaçant " + M("x") + " par 1 et " + M("y") + " par 2 des deux côtés.", pts: 1 }, { label: "Le troisième résultat est-il factorisé au maximum ? Explique.", pts: 1 }],
        sol: ul(["a) développer (distributivité) ; b) réduire (termes semblables) ; c) factoriser (mise en évidence de " + g + ").", "Gauche : " + M(a + " \\cdot 2 \\cdot (" + b + " - " + c + ") = " + 2 * a * (b - c)) + " ; droite : " + M(a * b + " \\cdot 2 - " + a * c + " \\cdot 2 = " + (2 * a * b - 2 * a * c)) + " : c'est égal.", "Oui : " + M(p) + " et " + M(q) + " n'ont pas de diviseur commun autre que 1, et il n'y a pas de lettre commune."]) }); },
    // Tour de magie (modéliser, prouver)
    () => { const k = R.int(3, 9), m = pk([2, 3, 4]);
      return X({ id: "litelab", lv: 2, titre: "Le tour de magie",
        q: "Programme : « Choisis un nombre. Ajoute " + k + ". Multiplie le résultat par " + m + ". Retire " + m * k + ". »",
        parts: [{ label: "Applique le programme à 5, puis à −2. Que remarques-tu ?", pts: 1 }, { label: "On appelle " + M("n") + " le nombre choisi. Écris le résultat sous forme d'une expression.", pts: 1 }, { label: "Prouve que le résultat est toujours " + (m === 2 ? "le double" : m === 3 ? "le triple" : "le quadruple") + " du nombre choisi.", pts: 2 }, { label: "Modifie la dernière étape pour retrouver toujours le nombre de départ.", pts: 1 }],
        sol: ul(["5 donne " + m * 5 + " ; −2 donne " + -2 * m + " : on obtient " + m + " fois le nombre choisi.", M(m + "(n + " + k + ") - " + m * k) + ".", M(m + "(n + " + k + ") - " + m * k + " = " + m + "n + " + m * k + " - " + m * k + " = " + m + "n") + ", quel que soit " + M("n") + " : c'est une preuve, pas seulement des exemples.", "Par exemple : « Retire " + m * k + ", puis divise par " + m + " » (ou « Divise par " + m + ", puis retire " + k + " »)."]) }); },
    // Aire d'une figure (expression, développer, valeur)
    () => { const a = R.int(2, 6), b = R.int(1, 5), x = R.int(3, 7);
      return X({ id: "distrib", lv: 2, titre: "L'aire du jardin",
        q: "Un jardin rectangulaire mesure " + M("(x + " + a + ")") + " m sur " + M("(x + " + b + ")") + " m. On y installe une terrasse carrée de côté " + M("x") + " m dans un coin. Le reste est du gazon.",
        fig: FIG.rectFig(10, 7, "x + " + a, "x + " + b),
        parts: [{ label: "Écris l'aire du gazon sous forme d'une différence.", pts: 1 }, { label: "Développe et réduis cette expression.", pts: 2 }, { label: "Calcule l'aire du gazon pour " + M("x = " + x) + ", avec les deux expressions.", pts: 1 }, { label: "Le gazon peut être découpé en deux rectangles. Retrouve l'expression réduite à partir de ce découpage.", pts: 1 }],
        sol: ul([M("(x + " + a + ")(x + " + b + ") - x^2") + ".", M("x^2 + " + (a + b) + "x + " + a * b + " - x^2 = " + (a + b) + "x + " + a * b) + ".", M((a + b) + " \\cdot " + x + " + " + a * b + " = " + ((a + b) * x + a * b)) + " m² ; et " + M((x + a) * (x + b) + " - " + x * x + " = " + ((x + a) * (x + b) - x * x)) + " m².", "Un rectangle " + M(a + " \\cdot (x + " + b + ")") + " et un rectangle " + M("x \\cdot " + b) + " : " + M(a + "x + " + a * b + " + " + b + "x = " + (a + b) + "x + " + a * b) + "."]) }); },
    // Nombres consécutifs (preuve et contre-exemple)
    () => { const k = pk([3, 5]);
      return X({ id: "litelab", lv: 2, titre: "Nombres consécutifs",
        q: "On s'intéresse à la somme de " + k + " nombres entiers consécutifs. Exemples : " + (k === 3 ? "4 + 5 + 6 = 15, 10 + 11 + 12 = 33." : "1 + 2 + 3 + 4 + 5 = 15, 6 + 7 + 8 + 9 + 10 = 40."),
        parts: [{ label: "Le plus petit nombre est " + M("n") + ". Écris les " + k + " nombres, puis leur somme réduite.", pts: 2 }, { label: "Prouve que cette somme est toujours un multiple de " + k + ".", pts: 1 }, { label: "Est-ce vrai pour la somme de 4 nombres consécutifs ? Justifie.", pts: 2 }],
        sol: ul([k === 3 ? M("n + (n + 1) + (n + 2) = 3n + 3") : M("n + (n + 1) + \\ldots + (n + 4) = 5n + 10"), (k === 3 ? M("3n + 3 = 3(n + 1)") : M("5n + 10 = 5(n + 2)")) + " : c'est " + k + " fois un nombre entier.", "Non : " + M("4n + 6") + " ; par exemple " + M("1 + 2 + 3 + 4 = 10") + ", qui n'est pas un multiple de 4 (un contre-exemple suffit)."]) }); },
    // Calcul mental avec les identités
    () => { const a = pk([101, 102, 201]), b = pk([99, 98]), c = pk([53, 56, 61]);
      return X({ id: "idrem", lv: 2, titre: "Calcul mental",
        q: "Sans calculatrice, on peut calculer vite avec les identités remarquables.",
        parts: [{ label: "Calcule " + M(a + "^2") + " en écrivant " + M(a + " = " + (a - (a % 100)) + " + " + (a % 100)) + ".", pts: 1 }, { label: "Calcule " + M(b + " \\cdot " + (200 - b)) + ".", pts: 1 }, { label: "Calcule " + M(c + "^2 - " + (100 - c) + "^2") + ".", pts: 1 }, { label: "Pour chaque calcul, quelle identité as-tu utilisée ?", pts: 1 }],
        sol: ul([M("(" + (a - (a % 100)) + " + " + (a % 100) + ")^2 = " + (a - (a % 100)) ** 2 + " + " + 2 * (a - (a % 100)) * (a % 100) + " + " + (a % 100) ** 2 + " = " + a * a) + ".", M("(100 - " + (100 - b) + ")(100 + " + (100 - b) + ") = 10\\text{'}000 - " + (100 - b) ** 2 + " = " + b * (200 - b)) + ".", M("(" + c + " - " + (100 - c) + ")(" + c + " + " + (100 - c) + ") = " + (2 * c - 100) + " \\cdot 100 = " + (c * c - (100 - c) ** 2)) + ".", M("(a + b)^2") + " ; " + M("(a - b)(a + b) = a^2 - b^2") + " ; " + M("a^2 - b^2 = (a - b)(a + b)") + "."]) }); },
    // Pythagore par les aires
    () => X({ id: "idrem", lv: 3, titre: "Pythagore par les aires",
        q: "Dans un grand carré de côté " + M("a + b") + ", on place quatre triangles rectangles identiques (cathètes " + M("a") + " et " + M("b") + ", hypoténuse " + M("c") + "). Au milieu, il reste un carré de côté " + M("c") + ".",
        parts: [{ label: "Écris l'aire du grand carré à l'aide de " + M("a") + " et " + M("b") + ", puis développe-la.", pts: 1 }, { label: "Écris aussi cette aire comme la somme des aires des quatre triangles et du petit carré.", pts: 2 }, { label: "Déduis-en que " + M("a^2 + b^2 = c^2") + ".", pts: 1 }],
        sol: ul([M("(a + b)^2 = a^2 + 2ab + b^2") + ".", M("4 \\cdot \\frac{ab}{2} + c^2 = 2ab + c^2") + ".", "Les deux expressions sont égales : " + M("a^2 + 2ab + b^2 = 2ab + c^2") + ", donc " + M("a^2 + b^2 = c^2") + " (on retire " + M("2ab") + " des deux côtés)."]) }),
    // Développer ou factoriser ? (choisir la bonne forme)
    () => { const v = pk([[2, 3, 1, 1], [3, 1, 1, 2], [2, 5, 1, 2]]), [p, q, r, s] = v, A = p * p - r * r, B = 2 * p * q - 2 * r * s, C = q * q - s * s, x0 = -(q + s) / (p + r);
      return X({ id: "factor", lv: 3, titre: "Développer ou factoriser ?",
        q: "On considère " + M("E = (" + p + "x + " + q + ")^2 - (" + (r > 1 ? r : "") + "x + " + s + ")^2") + ".",
        parts: [{ label: "Développe et réduis " + M("E") + ".", pts: 2 }, { label: "Factorise " + M("E") + " (différence de deux carrés).", pts: 2 }, { label: "Vérifie que les deux formes donnent la même valeur pour " + M("x = 1") + ".", pts: 1 }, { label: "Quelle forme est la plus pratique pour trouver une valeur de " + M("x") + " qui rend " + M("E") + " nul ? Explique.", pts: 1 }],
        sol: ul([M("E = " + A + "x^2 " + sgn(B) + "x " + sgn(C)) + ".", M("E = [(" + p + "x + " + q + ") - (" + (r > 1 ? r : "") + "x + " + s + ")][(" + p + "x + " + q + ") + (" + (r > 1 ? r : "") + "x + " + s + ")] = (" + (p - r) + "x " + sgn(q - s) + ")(" + (p + r) + "x " + sgn(q + s) + ")") + ".", "Les deux donnent " + M(A + B + C) + ".", "La forme factorisée : un produit est nul si un de ses facteurs est nul, par exemple " + M("x = " + (Number.isInteger(x0) ? x0 : "-\\frac{" + (q + s) + "}{" + (p + r) + "}")) + "."]) }); },
    // Deux programmes de calcul
    () => { const k = R.int(2, 6);
      return X({ id: "distrib", lv: 3, titre: "Deux programmes",
        q: "Programme A : « Ajoute " + k + " au nombre, élève au carré, retire " + k * k + ". » Programme B : « Multiplie le nombre par le nombre augmenté de " + 2 * k + ". »",
        parts: [{ label: "Teste les deux programmes avec 3 et avec −1.", pts: 1 }, { label: "Écris chaque programme sous forme d'une expression en " + M("x") + ".", pts: 1 }, { label: "Prouve que les deux programmes donnent toujours le même résultat.", pts: 2 }, { label: "Trouve un nombre négatif pour lequel le résultat est 0.", pts: 1 }],
        sol: ul(["3 : A et B donnent " + 3 * (3 + 2 * k) + " ; −1 : A et B donnent " + -1 * (-1 + 2 * k) + ".", "A : " + M("(x + " + k + ")^2 - " + k * k) + " ; B : " + M("x(x + " + 2 * k + ")") + ".", M("(x + " + k + ")^2 - " + k * k + " = x^2 + " + 2 * k + "x + " + k * k + " - " + k * k + " = x^2 + " + 2 * k + "x = x(x + " + 2 * k + ")") + ".", M("x = -" + 2 * k) + " : " + M("-" + 2 * k + " \\cdot 0 = 0") + "."]) }); },
  ];
  const RAISONL = [
    () => { const a = R.int(2, 7), b = R.int(2, 9), who = pk(["Sam", "Léa", "Noé"]);
      return X({ id: "parenth", lv: 1, titre: "Trouve l'erreur",
        q: who + " écrit : " + M("10 - (" + a + "x - " + b + ") = 10 - " + a + "x - " + b + " = " + (10 - b) + " - " + a + "x") + ".",
        parts: [{ label: "Explique l'erreur de " + who + ".", pts: 1 }, { label: "Corrige le calcul.", pts: 1 }, { label: "Vérifie ta correction en remplaçant " + M("x") + " par 2.", pts: 1 }],
        sol: ul(["Le « − » devant la parenthèse change le signe de <b>tous</b> les termes : " + M("-(-" + b + ") = +" + b) + ".", M("10 - " + a + "x + " + b + " = " + (10 + b) + " - " + a + "x") + ".", "Départ : " + M("10 - (" + 2 * a + " - " + b + ") = " + (10 - 2 * a + b)) + " ; correction : " + M((10 + b) + " - " + 2 * a + " = " + (10 + b - 2 * a)) + " ✓."]) }); },
    () => { const a = R.int(2, 9), who = pk(["Inès", "Yanis", "Lina"]);
      return X({ id: "idrem", lv: 2, titre: "Trouve l'erreur",
        q: who + " affirme : " + M("(x + " + a + ")^2 = x^2 + " + a * a) + ".",
        parts: [{ label: "Teste l'égalité avec " + M("x = 1") + ". Conclus.", pts: 1 }, { label: "Écris le bon développement et explique ce qui manque.", pts: 2 }],
        sol: ul(["Gauche : " + M((1 + a) + "^2 = " + (1 + a) ** 2) + " ; droite : " + M("1 + " + a * a + " = " + (1 + a * a)) + " : c'est faux.", M("(x + " + a + ")^2 = x^2 + " + 2 * a + "x + " + a * a) + " : il manque le double produit " + M(2 * a + "x") + " (" + M("(x + " + a + ")(x + " + a + ")") + " donne 4 produits)."]) }); },
    () => { const S = pk([
        [["« " + M("3x + 2x^2 = 5x^3") + " »", false, "On n'additionne pas des termes non semblables ; on ne peut pas réduire."], ["« " + M("(x - 3)(x + 3) = x^2 - 9") + " »", true, "Identité " + M("(a - b)(a + b) = a^2 - b^2") + "."], ["« Pour " + M("x = -3") + ", " + M("-x^2") + " vaut 9 »", false, M("-x^2 = -(-3)^2 = -9") + " : le carré se calcule avant le signe moins."]],
        [["« " + M("x^2 \\ge x") + " pour tout nombre " + M("x") + " »", false, "Contre-exemple : " + M("x = 0{,}5") + " donne " + M("0{,}25 < 0{,}5") + "."], ["« " + M("2(x + 3) = 2x + 6") + " »", true, "Distributivité : on multiplie les deux termes."], ["« " + M("(2x)^3 = 2x^3") + " »", false, M("(2x)^3 = 8x^3") + " : le coefficient aussi est au cube."]],
        [["« " + M("-(a - b) = b - a") + " »", true, M("-a + b = b - a") + "."], ["« " + M("x^2 + x^2 = x^4") + " »", false, M("x^2 + x^2 = 2x^2") + " ; c'est " + M("x^2 \\cdot x^2") + " qui vaut " + M("x^4") + "."], ["« La somme de deux nombres impairs est paire »", true, M("(2n + 1) + (2m + 1) = 2(n + m + 1)") + "."]],
      ]);
      return X({ id: "reduire", lv: 1, titre: "Vrai ou faux ? Justifie",
        q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie (calcul, contre-exemple ou propriété).",
        parts: S.map((s) => ({ label: s[0], pts: 1 })), sol: ul(S.map((s) => "<b>" + (s[1] ? "Vrai" : "Faux") + "</b>. " + s[2])) }); },
    () => { const k = R.int(2, 6);
      return X({ id: "factor", lv: 2, titre: "Deux méthodes",
        q: "Pour simplifier " + M("3x(x + " + k + ") - 2x(x + " + k + ")") + ", Noé développe tout, puis réduit. Léa met " + M("(x + " + k + ")") + " en évidence.",
        parts: [{ label: "Fais le calcul de Noé.", pts: 1 }, { label: "Fais le calcul de Léa.", pts: 1 }, { label: "Les deux résultats sont-ils égaux ? Quelle méthode préfères-tu, et pourquoi ?", pts: 1 }],
        sol: ul([M("3x^2 + " + 3 * k + "x - 2x^2 - " + 2 * k + "x = x^2 + " + k + "x") + ".", M("(x + " + k + ")(3x - 2x) = x(x + " + k + ")") + ".", "Oui : " + M("x(x + " + k + ") = x^2 + " + k + "x") + ". La méthode de Léa est plus courte : le facteur commun saute aux yeux."]) }); },
  ];
  // ===================== 1re Collège · Équations (16.11) =====================
  // Modèle : polycopié d'algèbre de 1re du Collège (problèmes du 1er et du 2e degré, formules de physique, vrai ou faux
  // justifié), au niveau d'un test de 1re ; modelé, jamais recopié.
  const sE = (v) => (v < 0 ? " - " + -v : " + " + v), tE = (v) => { if (Number.isInteger(v)) return String(v); for (let d = 2; d <= 60; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-9) return frac(Math.round(v * d), d); return N(v); };
  const xE = (r) => (r === 0 ? "x" : "x" + sE(-r));
  const SE = (vs) => M(vs.length ? "S = \\{" + vs.slice().sort((a, b) => a - b).map(tE).join(" \\,;\\, ") + "\\}" : "S = \\varnothing");
  const EXE = [
    // Les notes du semestre (moyenne pondérée ; possible ou non)
    () => { let notes, k, m, x, S; for (let t = 0; t < 200; t++) { notes = Array.from({ length: 4 }, () => pk([3.5, 4, 4.5, 5, 5.5])); k = pk([2, 3]); m = pk([4.5, 5]); S = notes.reduce((a, b) => a + b, 0); x = (m * (4 + k) - S) / k; if (x >= 3.5 && x <= 6 && Number.isInteger(x * 2)) break; x = null; }
      if (x === null) { notes = [4, 4.5, 5, 4]; k = 2; m = 4.5; S = 17.5; x = 5; }
      const m2 = m + 0.5, x2 = (m2 * (4 + k) - S) / k;
      return X({ id: "probeq", lv: 1, titre: "Les notes du semestre",
        q: "Au premier semestre, Lina a obtenu " + notes.map((v) => T(v)).join(", ") + ". L'examen final compte " + (k === 2 ? "double" : "triple") + " (comme " + k + " notes).",
        parts: [{ label: "Calcule sa moyenne actuelle.", pts: 1 }, { label: "Écris une équation, puis trouve la note qu'il lui faut à l'examen pour obtenir exactement " + T(m) + " de moyenne.", pts: 2 }, { label: "Peut-elle encore obtenir " + T(m2) + " de moyenne ? Explique.", pts: 1 }],
        sol: ul([M(N(S) + " : 4 = " + N(S / 4)) + ".", M("\\frac{" + N(S) + " + " + k + "x}{" + (4 + k) + "} = " + N(m)) + ", donc " + M(N(S) + " + " + k + "x = " + N(m * (4 + k))) + " et " + M("x = " + N(x)) + ".", x2 <= 6 ? "Oui : il lui faudrait " + M(N(x2)) + ", ce qui est possible (note maximale 6)." : "Non : il lui faudrait " + M(N(+x2.toFixed(2))) + ", plus que la note maximale 6."]) }); },
    // Deux forfaits (équation, interprétation, troisième formule)
    () => { const a = pk([12, 14, 15, 16]), b = pk([6, 7, 8]), x = R.int(8, 16), F = (a - b) * x, U = a * (x + R.int(6, 12)), n1 = x - R.int(3, 5), n2 = x + R.int(3, 6);
      return X({ id: "probeq", lv: 2, titre: "Deux forfaits de fitness",
        q: "Formule A : " + Q(a, "CHF") + " la séance. Formule B : un abonnement de " + Q(F, "CHF") + " par an, puis " + Q(b, "CHF") + " la séance. Formule C : " + Q(U, "CHF") + " par an, séances illimitées.",
        parts: [{ label: "Combien coûtent " + n1 + " séances avec A ? avec B ?", pts: 1 }, { label: "Écris une équation et trouve le nombre de séances pour lequel A et B coûtent autant.", pts: 2 }, { label: "Noé prévoit " + n2 + " séances. Quelle formule lui conseilles-tu entre A et B ? Justifie.", pts: 1 }, { label: "À partir de combien de séances C est-elle plus avantageuse que A ?", pts: 1 }],
        sol: ul(["A : " + M(n1 + " \\cdot " + a + " = " + n1 * a) + " CHF ; B : " + M(F + " + " + n1 + " \\cdot " + b + " = " + (F + n1 * b)) + " CHF.", M(a + "x = " + F + " + " + b + "x \\iff " + (a - b) + "x = " + F + " \\iff x = " + x) + " séances.", "B : " + M(F + n2 * b) + " CHF contre " + M(n2 * a) + " CHF avec A ; au-delà de " + x + " séances, B est moins chère.", M(a + "x = " + U + " \\iff x = " + N(U / a)) + " : à partir de " + (Math.floor(U / a) + 1) + " séances, C coûte moins que A."]) }); },
    // Le canal (formule du trapèze transformée)
    () => { const b = pk([2, 3, 4]), h = pk([1.5, 2, 2.5]), B = b + pk([2, 3, 4]), A = ((B + b) * h) / 2, A2 = A + pk([1, 2, 3]) * h;
      return X({ id: "formule", lv: 2, titre: "La coupe d'un canal",
        q: "La coupe d'un canal est un trapèze de petite base " + M("b") + ", de grande base " + M("B") + " et de hauteur " + M("h") + " : son aire est " + M("A = \\frac{(B + b) \\cdot h}{2}") + ".", fig: FIG.trapezoid("B", "b", "h"),
        parts: [{ label: "Exprime " + M("h") + " en fonction de " + M("A") + ", " + M("B") + " et " + M("b") + ".", pts: 1 }, { label: "Exprime " + M("B") + " en fonction des autres lettres.", pts: 2 }, { label: "Calcule " + M("B") + " pour " + M("b = " + b) + " m, " + M("h = " + N(h)) + " m et " + M("A = " + N(A)) + " m².", pts: 1 }, { label: "On veut une aire de " + Q(A2, "m²") + " sans changer " + M("b") + " ni " + M("h") + ". De combien faut-il élargir la grande base ?", pts: 1 }],
        sol: ul([M("h = \\frac{2A}{B + b}") + ".", M("B + b = \\frac{2A}{h}") + ", donc " + M("B = \\frac{2A}{h} - b") + ".", M("B = \\frac{2 \\cdot " + N(A) + "}{" + N(h) + "} - " + b + " = " + N(B)) + " m.", M("\\frac{2 \\cdot " + N(A2) + "}{" + N(h) + "} - " + b + " = " + N((2 * A2) / h - b)) + " m : il faut l'élargir de " + M(N((2 * A2) / h - b - B)) + " m."]) }); },
    // Équations sous la loupe (aucune, tous, x = 0)
    () => { const a = R.int(2, 6), b = R.int(2, 7), c = R.int(2, 9), d = R.int(1, 9);
      return X({ id: "eqspec", lv: 1, titre: "Équations sous la loupe",
        q: "Résous chaque équation et donne l'ensemble des solutions.",
        parts: [{ label: M(a + "(x - " + b + ") + " + a * b + " = " + a + "x"), pts: 1 }, { label: M(c + "x + " + d + " = " + c + "(x + 1)"), pts: 1 }, { label: M(c + 2 + "x + " + d + " = " + c + "x + " + d), pts: 1 }, { label: "Invente une équation du 1er degré qui n'a aucune solution, et explique pourquoi.", pts: 1 }],
        sol: ul([M(a + "x - " + a * b + " + " + a * b + " = " + a + "x") + " : " + M("0 = 0") + ", vrai ; tous les nombres sont solutions, " + M("S = \\mathbb{R}") + ".", M(c + "x + " + d + " = " + c + "x + " + c) + " : " + M(d + " = " + c) + (d === c ? ", vrai : " + M("S = \\mathbb{R}") : ", faux : " + M("S = \\varnothing")) + ".", M("2x = 0") + ", donc " + M("x = 0") + " : " + M("S = \\{0\\}") + " (une solution, ce n'est pas « aucune »).", "Par exemple " + M("x + 1 = x + 2") + " : les " + M("x") + " s'éliminent et il reste " + M("1 = 2") + ", faux."]) }); },
    // Le cadre (2e degré, solution à écarter)
    () => { const w = pk([20, 24, 30]), h = pk([15, 16, 18]), x = pk([2, 3, 4, 5]), A = (w + 2 * x) * (h + 2 * x), c = w * h - A, x2 = -(w + h) / 2 - x;
      return X({ id: "probeq2", lv: 2, titre: "Le cadre",
        q: "Une affiche de " + Q(w, "cm") + " sur " + Q(h, "cm") + " est entourée d'un cadre de largeur constante " + M("x") + " cm. L'ensemble occupe " + Q(A, "cm^2") + ".", fig: FIG.rectFig(10, 7, Math.max(w, h) + " + 2x", Math.min(w, h) + " + 2x"),
        parts: [{ label: "Exprime l'aire de l'ensemble en fonction de " + M("x") + ", sous forme développée.", pts: 1 }, { label: "Montre que " + M("x") + " vérifie " + M("4x^2 + " + 2 * (w + h) + "x " + sE(c).trim() + " = 0") + ".", pts: 1 }, { label: "Résous cette équation.", pts: 2 }, { label: "Quelle est la largeur du cadre ? Pourquoi écarte-t-on l'autre solution ?", pts: 1 }],
        sol: ul([M("(" + w + " + 2x)(" + h + " + 2x) = 4x^2 + " + 2 * (w + h) + "x + " + w * h) + ".", M("4x^2 + " + 2 * (w + h) + "x + " + w * h + " = " + A) + ", on soustrait " + A + ".", "On divise par 2 : " + M("2x^2 + " + (w + h) + "x " + sE(c / 2).trim() + " = 0") + " ; " + M("\\Delta = " + ((w + h) ** 2 - 8 * (c / 2))) + ", " + M("x = " + x) + " ou " + M("x = " + tE(x2)) + ".", x + " cm : une largeur ne peut pas être négative."]) }); },
    // Le jardin et ses allées (2e degré, solution trop grande)
    () => { const J = []; for (let Lg = 12; Lg <= 40; Lg++) for (let l = 8; l < Lg; l++) for (let x = 1; x <= l / 2; x++) if (2 * (Lg - x) * (l - x) === Lg * l) J.push([Lg, l, x]);
      const [Lg, l, x] = pk(J), x2 = Lg + l - x;
      return X({ id: "probeq2", lv: 3, titre: "Le jardin et ses allées",
        q: "Un jardin rectangulaire de " + Q(Lg, "m") + " sur " + Q(l, "m") + " est traversé par deux allées perpendiculaires de même largeur " + M("x") + " m, parallèles aux côtés. Le reste est du gazon.",
        parts: [{ label: "Explique pourquoi l'aire du gazon vaut " + M("(" + Lg + " - x)(" + l + " - x)") + " (tu peux « pousser » les allées contre les bords).", pts: 1 }, { label: "On veut autant d'allées que de gazon. Écris l'équation et ramène-la à la forme " + M("x^2 + bx + c = 0") + ".", pts: 2 }, { label: "Résous-la et donne la largeur des allées.", pts: 2 }],
        sol: ul(["En regroupant les allées contre deux bords, le gazon forme un rectangle de " + M("(" + Lg + " - x)") + " sur " + M("(" + l + " - x)") + ".", M("(" + Lg + " - x)(" + l + " - x) = \\frac{" + Lg * l + "}{2} = " + (Lg * l) / 2) + ", soit " + M("x^2 - " + (Lg + l) + "x + " + (Lg * l) / 2 + " = 0") + ".", M("x = " + x) + " ou " + M("x = " + x2) + " ; " + x2 + " m est plus large que le jardin : les allées mesurent " + x + " m."]) }); },
    // La chute (méthode directe, formule transformée)
    () => { const T = pk([3, 4, 5]), h0 = 5 * T * T, t1 = T - 1, h1 = h0 - 5 * t1 * t1;
      return X({ id: "eq2fact", lv: 2, titre: "La chute d'une bille",
        q: "On lâche une bille du haut d'une tour de " + Q(h0, "m") + ". Après " + M("t") + " secondes, elle se trouve à la hauteur " + M("h = " + h0 + " - 5t^2") + " (en m).",
        parts: [{ label: "À quelle hauteur est-elle après 1 s ? après 2 s ? A-t-elle parcouru deux fois plus de chemin pendant les 2 s ?", pts: 1 }, { label: "Quand est-elle à " + Q(h1, "m") + " ?", pts: 1 }, { label: "Quand touche-t-elle le sol ? Pourquoi garde-t-on une seule solution ?", pts: 2 }, { label: "Exprime " + M("t") + " en fonction de " + M("h") + ".", pts: 1 }],
        sol: ul([M(h0 - 5) + " m et " + M(h0 - 20) + " m : elle a parcouru 5 m, puis 20 m en tout, soit 4 fois plus (la chute s'accélère).", M("5t^2 = " + 5 * t1 * t1 + " \\iff t^2 = " + t1 * t1) + ", " + M("t = " + t1) + " s.", M("5t^2 = " + h0 + " \\iff t^2 = " + T * T) + ", " + M("t = " + T) + " s ; " + M("t = -" + T) + " est écarté : le temps est positif depuis le lâcher.", M("t = \\sqrt{\\frac{" + h0 + " - h}{5}}") + "."]) }); },
    // Une équation, trois méthodes (factorisation, Δ, somme et produit)
    () => { let p, q; do { p = R.int(1, 9) * pk([1, -1]); q = R.int(1, 9) * pk([1, -1]); } while (p === q || p === -q); const s = p + q, pr = p * q;
      return X({ id: "eq2disc", lv: 3, titre: "Une équation, trois méthodes",
        q: "On veut résoudre " + M(poly([1, -s, pr]) + " = 0") + ".",
        parts: [{ label: "Résous-la en factorisant (trouve deux nombres de somme " + M(-s) + " et de produit " + M(pr) + ").", pts: 2 }, { label: "Résous-la avec le discriminant.", pts: 2 }, { label: "Vérifie que la somme des solutions vaut " + M("-\\frac{b}{a}") + " et leur produit " + M("\\frac{c}{a}") + ".", pts: 1 }, { label: "Quelle méthode préfères-tu ici ? Laquelle marche toujours ?", pts: 1 }],
        sol: ul([M("(" + xE(p) + ")(" + xE(q) + ") = 0") + " : " + SE([p, q]) + ".", M("\\Delta = " + (s * s - 4 * pr) + " = " + Math.abs(p - q) + "^2") + ", " + M("x = \\frac{" + s + " \\pm " + Math.abs(p - q) + "}{2}") + " : mêmes solutions.", "Somme " + M(p + " + " + (q < 0 ? "(" + q + ")" : q) + " = " + s + " = -\\frac{" + -s + "}{1}") + " ; produit " + M(pr) + ".", "La factorisation est rapide quand on voit les deux nombres ; le discriminant marche toujours, même quand les solutions ne sont pas entières."]) }); },
    // Températures (formule, équation C = F)
    () => { const C1 = pk([15, 20, 25, 35]), F2 = pk([50, 59, 68, 86, 95]);
      return X({ id: "formule", lv: 2, titre: "Celsius et Fahrenheit",
        q: "Aux États-Unis, on mesure la température en degrés Fahrenheit : " + M("F = \\frac{9}{5}C + 32") + ", où " + M("C") + " est la température en degrés Celsius.",
        parts: [{ label: "Il fait " + C1 + " °C à Genève. Combien de degrés Fahrenheit ?", pts: 1 }, { label: "Exprime " + M("C") + " en fonction de " + M("F") + ".", pts: 2 }, { label: "Il fait " + F2 + " °F à New York. Fait-il plus chaud qu'à Genève ?", pts: 1 }, { label: "Existe-t-il une température qui s'écrit avec le même nombre dans les deux échelles ? Laquelle ?", pts: 2 }],
        sol: ul([M("\\frac{9}{5} \\cdot " + C1 + " + 32 = " + N((9 * C1) / 5 + 32)) + " °F.", M("F - 32 = \\frac{9}{5}C") + ", donc " + M("C = \\frac{5}{9}(F - 32)") + ".", M("\\frac{5}{9}(" + F2 + " - 32) = " + tE(((F2 - 32) * 5) / 9)) + " °C : " + (((F2 - 32) * 5) / 9 > C1 ? "oui, plus chaud" : ((F2 - 32) * 5) / 9 === C1 ? "la même température" : "non, plus froid") + ".", "Oui : " + M("x = \\frac{9}{5}x + 32 \\iff -\\frac{4}{5}x = 32 \\iff x = -40") + " : " + M("-40") + " °C = " + M("-40") + " °F."]) }); },
    // Degré 4 déguisé (bicarrée)
    () => { const p = R.int(1, 3), q = p + R.int(1, 3), a = p * p + q * q, b = p * p * q * q;
      return X({ id: "bicarre", lv: 3, titre: "Un degré 4 déguisé",
        q: "On veut résoudre " + M("x^4 - " + a + "x^2 + " + b + " = 0") + ".",
        parts: [{ label: "On pose " + M("X = x^2") + ". Écris l'équation en " + M("X") + ".", pts: 1 }, { label: "Résous-la.", pts: 1 }, { label: "Reviens à " + M("x") + " et donne toutes les solutions.", pts: 2 }, { label: "Combien de solutions aurait " + M("x^4 + " + a + "x^2 + " + b + " = 0") + " ? Explique sans calcul.", pts: 1 }],
        sol: ul([M("X^2 - " + a + "X + " + b + " = 0") + ".", M("(X - " + p * p + ")(X - " + q * q + ") = 0") + " : " + M("X = " + p * p) + " ou " + M("X = " + q * q) + ".", M("x^2 = " + p * p) + " ou " + M("x^2 = " + q * q) + " : " + SE([-q, -p, p, q]) + ".", "Aucune : pour tout " + M("x") + ", " + M("x^4 + " + a + "x^2 + " + b + " \\ge " + b + " > 0") + "."]) }); },
    // Racine et vérification (solution parasite)
    () => { let b, r, pp, a; for (let t = 0; t < 80; t++) { b = R.int(-2, 3); r = R.int(Math.max(1 - b, 0), 6); pp = 1 - 2 * b - r; a = b * b - r * pp; if (pp + b < 0 && r !== pp && pp + a >= 0) break; a = null; }
      if (a === null) { b = 1; r = 2; pp = -3; a = 7; }
      return X({ id: "eqirr", lv: 2, titre: "Racine et vérification",
        q: "On veut résoudre " + M("\\sqrt{x" + sE(a) + "} = x" + sE(b)) + ".",
        parts: [{ label: "Élève les deux membres au carré et ramène l'équation à la forme " + M("x^2 + px + q = 0") + ".", pts: 1 }, { label: "Résous cette équation du 2e degré.", pts: 1 }, { label: "Vérifie chaque valeur dans l'équation de départ. Conclus.", pts: 2 }, { label: "Explique pourquoi élever au carré peut faire apparaître une « fausse » solution.", pts: 1 }],
        sol: ul([M("x" + sE(a) + " = x^2 " + sE(2 * b).trim() + "x + " + b * b) + ", soit " + M(poly([1, 2 * b - 1, b * b - a]) + " = 0") + ".", M("x = " + r) + " ou " + M("x = " + pp) + ".", "Pour " + M(r) + " : " + M("\\sqrt{" + (r + a) + "} = " + Math.sqrt(r + a)) + " et " + M(r + b) + " ✓. Pour " + M(pp) + " : " + M("\\sqrt{" + (pp + a) + "} = " + Math.sqrt(pp + a)) + " mais " + M(pp + b) + " ✗. " + M("S = \\{" + r + "\\}") + ".", "Si " + M("A^2 = B^2") + ", on a " + M("A = B") + " <b>ou</b> " + M("A = -B") + " : le carré « oublie » le signe, donc il faut vérifier."]) }); },
  ];
  const RAISONE = [
    () => { const k = R.int(2, 9), w = pk(["Sam", "Léa", "Noé"]);
      return X({ id: "eq2fact", lv: 1, titre: "Trouve l'erreur",
        q: w + " résout " + M("x^2 = " + k + "x") + " : « je divise par " + M("x") + ", donc " + M("x = " + k) + " ».",
        parts: [{ label: "Vérifie que " + M("x = 0") + " est aussi solution.", pts: 1 }, { label: "Explique l'erreur de " + w + ".", pts: 1 }, { label: "Résous correctement.", pts: 1 }],
        sol: ul([M("0^2 = 0") + " et " + M(k + " \\cdot 0 = 0") + " : oui.", "Diviser par " + M("x") + " suppose " + M("x \\ne 0") + " : on perd la solution " + M("x = 0") + ". On ne divise jamais par l'inconnue.", M("x^2 - " + k + "x = x(x - " + k + ") = 0") + " : " + M("S = \\{0 \\,;\\, " + k + "\\}") + "."]) }); },
    () => { const [a, b] = pk([[2, 3], [3, 4], [4, 6], [2, 5], [3, 5]]), L2 = (a * b) / gcd(a, b), c = R.int(1, 6), w = pk(["Inès", "Yanis", "Mia"]), A = L2 / a, B = L2 / b, solx = (-L2 * c) / (A - B), wrongX = -c / (A - B);
      return X({ id: "eqfrac", lv: 2, titre: "Trouve l'erreur",
        q: w + " résout " + M("\\frac{x}{" + a + "} + " + c + " = \\frac{x}{" + b + "}") + " : « je multiplie par " + L2 + " : " + M(A + "x + " + c + " = " + B + "x") + ", donc " + M("x = " + tE(wrongX)) + " ».",
        parts: [{ label: "Vérifie la solution de " + w + ". Que constates-tu ?", pts: 1 }, { label: "Quelle est l'erreur ? Corrige et résous.", pts: 2 }],
        sol: ul([M("\\frac{" + tE(wrongX) + "}{" + a + "} + " + c + " = " + tE(wrongX / a + c)) + " et " + M("\\frac{" + tE(wrongX) + "}{" + b + "} = " + tE(wrongX / b)) + " : les deux membres diffèrent, la solution est fausse.", "Le terme " + c + " n'a pas été multiplié par " + L2 + " : on multiplie <b>chaque</b> terme. " + M(A + "x + " + L2 * c + " = " + B + "x") + ", donc " + M((A - B) + "x = " + -L2 * c) + " et " + M("x = " + tE(solx)) + "."]) }); },
    () => { const S = pk([
        [["« L'équation " + M("x^2 + 4 = 0") + " a deux solutions, 2 et −2. »", false, M("2^2 + 4 = 8 \\ne 0") + " ; " + M("x^2 = -4") + " n'a pas de solution."], ["« " + M("x^2 - 6x + 9 = 0") + " a au moins une solution. »", true, M("(x - 3)^2 = 0") + " : " + M("x = 3") + " (" + M("\\Delta = 0") + ")."], ["« " + M("(x - 3)(x + 5) = 0") + " et " + M("4(x - 3)(x + 5) = 0") + " ont les mêmes solutions. »", true, "Le facteur 4 ne s'annule jamais : 3 et −5 dans les deux cas."]],
        [["« Une équation du 2e degré a toujours deux solutions. »", false, "Contre-exemple : " + M("x^2 + 1 = 0") + " n'en a aucune ; " + M("x^2 = 0") + " n'en a qu'une."], ["« " + M("(x - 3)(x + 5) = 4") + " donne " + M("x = 7") + " ou " + M("x = -1") + ". »", false, "Le produit nul ne marche qu'avec 0 ; " + M("x = 7") + " donne " + M("4 \\cdot 12 = 48 \\ne 4") + "."], ["« Il existe une infinité d'équations de solutions 3 et −5. »", true, M("k(x - 3)(x + 5) = 0") + " pour tout " + M("k \\ne 0") + "."]],
        [["« Si " + M("\\Delta < 0") + ", l'équation n'a pas de solution réelle. »", true, M("\\sqrt{\\Delta}") + " n'existe pas."], ["« " + M("x^3 = 9x") + " a pour solutions 3 et −3. »", false, "Il manque " + M("x = 0") + " : " + M("x(x - 3)(x + 3) = 0") + "."], ["« " + M("\\sqrt{x} = -2") + " a pour solution " + M("x = 4") + ". »", false, M("\\sqrt{4} = 2 \\ne -2") + " : une racine n'est jamais négative, aucune solution."]],
      ]);
      return X({ id: "eq2disc", lv: 2, titre: "Vrai ou faux ? Justifie",
        q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie (calcul, contre-exemple ou propriété).",
        parts: S.map((s) => ({ label: s[0], pts: 1 })), sol: ul(S.map((s) => "<b>" + (s[1] ? "Vrai" : "Faux") + "</b>. " + s[2])) }); },
    () => { const w = pk(["Noé", "Lina", "Yanis"]), r = 2, p = -3;
      return X({ id: "eqirr", lv: 2, titre: "Deux solutions ?",
        q: w + " résout " + M("\\sqrt{x + 7} = x + 1") + " : « au carré, " + M("x + 7 = x^2 + 2x + 1") + ", soit " + M("x^2 + x - 6 = 0") + ", donc " + M("S = \\{-3 \\,;\\, 2\\}") + " ».",
        parts: [{ label: "Vérifie les deux valeurs dans l'équation de départ.", pts: 1 }, { label: "Corrige la conclusion de " + w + " et explique ce qui s'est passé.", pts: 2 }],
        sol: ul(["Pour 2 : " + M("\\sqrt{9} = 3 = 2 + 1") + " ✓. Pour −3 : " + M("\\sqrt{4} = 2") + " mais " + M("-3 + 1 = -2") + " ✗.", M("S = \\{2\\}") + ". En élevant au carré, on résout aussi " + M("\\sqrt{x + 7} = -(x + 1)") + " : −3 est une solution « parasite » de cette autre équation."]) }); },
    () => { let p, q; do { p = R.int(1, 7); q = -R.int(1, 7); } while (p === -q);
      return X({ id: "eq2", lv: 2, titre: "Construis une équation",
        q: "On cherche des équations dont on connaît les solutions.",
        parts: [{ label: "Écris une équation dont les solutions sont exactement " + p + " et " + q + ", puis développe-la.", pts: 1 }, { label: "Écris une autre équation, différente, qui a les mêmes solutions.", pts: 1 }, { label: "Écris une équation du 2e degré qui a " + p + " pour seule solution.", pts: 1 }, { label: "Écris une équation du 2e degré qui n'a aucune solution.", pts: 1 }],
        sol: ul([M("(" + xE(p) + ")(" + xE(q) + ") = 0") + ", soit " + M(poly([1, -(p + q), p * q]) + " = 0") + ".", "Par exemple " + M("2(" + xE(p) + ")(" + xE(q) + ") = 0") + " (n'importe quel facteur non nul).", M("(" + xE(p) + ")^2 = 0") + ".", M("x^2 + 1 = 0") + " (un carré plus 1 n'est jamais nul)."]) }); },
  ];
  RICH.eq1c = { ids: ["eq1", "eqfrac", "eqspec", "formule", "probeq", "eq2fact", "eq2", "eq2disc", "probeq2", "eq3", "bicarre", "eqirr"], label: "Équations", ex: EXE, raison: RAISONE, minutes: 45 };
  RICH.litt11 = { ids: ["litelab", "valnum", "reduire", "monomes", "parenth", "distrib", "idrem", "factor"], label: "Calcul littéral", ex: EXL, raison: RAISONL, minutes: 45, minA: 2 }; /* 25.11 : automatismes au niveau 2 (audit de niveau 11e) */
  RICH.prop11 = { ids: ["utemps", "ucomp", "vitesse", "gquot"], label: "Proportionnalité, grandeurs quotients et unités", ex: EX, raison: RAISON, minutes: 45, minA: 2 }; /* 25.11 : automatismes au niveau 2 (audit de niveau 11e) */
})();

// Chapitre du sujet de préparation : celui dont la banque couvre le plus de notions révisées (au moins la moitié).
// 23.11 : une banque peut être réservée à une filière (track: "mp" = maturité professionnelle, "col" = Collège) ;
// à couverture égale, la banque de la filière de l'élève passe devant (mêmes notions, niveaux très différents).
function richChapter(ids, profile) {
  if (profile === undefined) profile = typeof state !== "undefined" && state && state.profile;
  const tr = profile && profile.track === "mp" && profile.grade >= 12 ? "mp" : profile && profile.grade >= 12 ? "col" : null;
  let best = null, n = 0;
  for (const [k, c] of Object.entries(RICH)) {
    if ((c.track === "mp" && tr !== "mp") || (c.track === "col" && tr === "mp")) continue;
    const m = ids.filter((id) => c.ids.includes(id)).length + (c.track && c.track === tr ? 0.5 : 0);
    if (m > n) { best = k; n = m; }
  }
  return best && Math.floor(n) * 2 >= ids.length ? best : null;
}
