// Chantier 11e · 4. Proportionnalité, grandeurs quotients et unités (15.11, décision de l'utilisateur :
// « la rétention passe par la qualité » ; détail et liste de contrôle locale).
// Ce module remplace les versions éparpillées de utemps, ucomp, vitesse, gquot (generators.js, gen2.js, gen3.js,
// variantes.js) : une seule source par notion. Chaque forme a son pas à pas (guide), ses erreurs typiques (traps)
// et un contexte (ctx, anti-répétition). Contextes et valeurs calés sur un dossier d'exercices de 11e :
// modelés, jamais recopiés. Niveau 4 (défi) = problèmes en plusieurs étapes.
(function () {
  const r6 = (v) => Math.round(v * 1e6) / 1e6;
  // Nombre en TeX : virgule décimale, ' pour les milliers (1'200).
  const N = (v) => {
    let [i, f] = String(r6(v)).split(".");
    const neg = i.startsWith("-"); if (neg) i = i.slice(1);
    if (i.length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}");
    return (neg ? "-" : "") + i + (f ? "{,}" + f : "");
  };
  const T = (v) => M(N(v));
  const u = (s) => ("\\ \\text{" + s.replace(/\^3/, "}^3\\text{").replace(/\^2/, "}^2\\text{") + "}").replace(/\\text\{\}$/, "");
  const Q = (v, s) => M(N(v) + u(s)); // valeur + unité
  const two = (n) => (n < 10 ? "0" : "") + n;
  const hmT = (min) => (min < 60 ? min + " min" : Math.floor(min / 60) + " h " + two(min % 60) + " min");
  const hmsT = (s) => Math.floor(s / 3600) + " h " + two(Math.floor((s % 3600) / 60)) + " min " + two(s % 60) + " s";
  const horaire = (min) => Math.floor(min / 60) % 24 + " h " + two(min % 60);
  const Qv = (q, value, sol, o) => {
    const x = QV(q, value, sol, o.round ? { round: o.round, fig: o.fig } : { fig: o.fig });
    if (o.guide) x.guide = o.guide; if (o.traps) x.traps = o.traps; if (o.ctx) x.ctx = o.ctx;
    return x;
  };
  /* 26.11 (recalcul) : étape guidée à valeur non décimale (1 h 20 min = 1,333… h) : valeur exacte, 1,33 ou 4/3 acceptés (r6 refusait 1,33) */
  const GSd = (ask, v, sol) => GS(ask, v, sol, Math.abs(v * 1e4 - Math.round(v * 1e4)) < 1e-6 ? undefined : 10 ** (Math.floor(Math.log10(Math.abs(v))) - 2)); /* 3 chiffres significatifs */
  const pickBy = (arr) => arr[Math.floor(R.rand() * arr.length)];

  // ===================== utemps : durées (9e, reprise en 11e : durées décimales, h min s) =====================
  const UTEMPS = {
    1: [
      () => { const h = R.int(2, 5), m = R.int(7, 53), c = pickBy([["Un film dure", "film"], ["Une randonnée a duré", "rando"], ["Le trajet en car dure", "car"], ["Une partie de jeu vidéo a duré", "jeu"]]);
        return Qv(c[0] + " " + M(h + u("h") + "\\ " + m + u("min")) + ". Combien de minutes cela fait-il ?", 60 * h + m,
          M(h + u("h") + " = " + h + " \\cdot 60 = " + 60 * h + u("min")) + ". Puis " + M(60 * h + " + " + m + " = " + (60 * h + m)) + " min.",
          { ctx: c[1], guide: [GS("Combien de minutes dans " + M(h + u("h")) + " ?", 60 * h, M(h + " \\cdot 60 = " + 60 * h) + " min."), GS("Ajoute les " + M(m) + " minutes : total ?", 60 * h + m, M(60 * h + " + " + m + " = " + (60 * h + m)) + " min.")],
            traps: [TRAP(100 * h + m, "Une heure ne vaut pas 100 minutes, mais 60."), TRAP(60 * h, "Tu as oublié d'ajouter les " + m + " minutes.")] }); },
      () => { const m = R.int(3, 19), s = R.int(7, 53), c = pickBy([["Un morceau de musique dure", "musique"], ["Le record de l'élève au 3000 m est de", "course"], ["La vidéo dure", "video"]]);
        return Qv(c[0] + " " + M(m + u("min") + "\\ " + s + u("s")) + ". Combien de secondes cela fait-il ?", 60 * m + s,
          M(m + " \\cdot 60 + " + s + " = " + (60 * m + s)) + " s.",
          { ctx: c[1], guide: [GS("Combien de secondes dans " + M(m + u("min")) + " ?", 60 * m, M(m + " \\cdot 60 = " + 60 * m) + " s."), GS("Ajoute les " + M(s) + " secondes : total ?", 60 * m + s, M(60 * m + " + " + s + " = " + (60 * m + s)) + " s.")],
            traps: [TRAP(100 * m + s, "Une minute vaut 60 secondes, pas 100.")] }); },
      () => { const a = 60 * R.int(1, 2) + R.int(12, 48), b = R.int(35, 55), c = pickBy([["Une recette demande " + hmT(a) + " de cuisson puis " + b + " min de repos.", "cuisine"], ["Un match dure " + hmT(a) + ", puis il y a " + b + " min de prolongations et de tirs au but.", "match"], ["Le trajet en train dure " + hmT(a) + ", puis il faut " + b + " min de bus.", "train"]]);
        if ((a % 60) + b < 60) return UTEMPS[1][2]();
        return Qv(c[0] + " Quelle est la durée totale, en minutes ?", a + b, hmT(a) + " = " + a + " min. Total : " + M(a + " + " + b + " = " + (a + b)) + " min, soit " + hmT(a + b) + ".",
          { ctx: c[1], guide: [GS("Écris " + hmT(a) + " en minutes.", a, M(Math.floor(a / 60) + " \\cdot 60 + " + (a % 60) + " = " + a) + " min."), GS("Ajoute les " + M(b) + " min : total ?", a + b, M(a + " + " + b + " = " + (a + b)) + " min.")],
            traps: [TRAP(Math.floor(a / 60) * 100 + (a % 60) + b, "Une heure vaut 60 minutes : écris d'abord " + hmT(a) + " en minutes.")] }); },
    ],
    2: [
      () => { const k = pickBy([3, 7, 9, 11, 13, 17, 19, 21, 23, 27, 29, 33, 37, 39, 43, 47]), h = R.int(1, 4), v = r6(h + k / 20), min = Math.round(v * 60);
        return Qv("Convertis " + Q(v, "h") + " en minutes.", min, M(N(v) + " \\cdot 60 = " + min) + " min, soit " + hmT(min) + ".",
          { ctx: "conv", guide: [GS("Combien de minutes dans " + M(h + u("h")) + " ?", 60 * h, M(h + " \\cdot 60 = " + 60 * h) + " min."), GS("Et dans " + Q(r6(k / 20), "h") + " ?", 3 * k, M(N(r6(k / 20)) + " \\cdot 60 = " + 3 * k) + " min."), GS("Total en minutes ?", min, M(60 * h + " + " + 3 * k + " = " + min) + " min.")],
            traps: [TRAP(60 * h + Math.round(100 * (v - h)), "Attention : " + N(v).replace("{,}", ",") + " h n'est pas " + h + " h " + Math.round(100 * (v - h)) + " min. La partie décimale est une fraction d'heure : on la multiplie par 60.")] }); },
      () => { const m = 3 * R.int(2, 19), h = R.int(1, 5), v = r6(h + m / 60), c = pickBy([["Le trajet dure", "trajet"], ["Une séance de natation dure", "natation"], ["Le concert a duré", "concert"]]);
        return Qv(c[0] + " " + M(h + u("h") + "\\ " + m + u("min")) + ". Écris cette durée en heures (nombre décimal).", v, M(m + u("min") + " = \\frac{" + m + "}{60}" + u("h") + " = " + N(r6(m / 60)) + u("h")) + ", donc " + Q(v, "h") + ".",
          { ctx: c[1], guide: [GSd("Une minute, c'est un soixantième d'heure. Combien d'heures font " + M(m + u("min")) + " ? (divise par 60)", m / 60, M(m + " : 60 = " + N(r6(m / 60))) + " h."), GS("Ajoute les " + M(h) + " heures : durée en heures ?", v, M(h + " + " + N(r6(m / 60)) + " = " + N(v)) + " h.")],
            traps: [TRAP(r6(h + m / 100), "Ce n'est pas " + h + "," + two(m) + " h : " + m + " min, c'est " + m + "/60 d'heure.")] }); },
      () => { const s = 6 * R.int(1, 9), m = R.int(2, 14), v = r6(m + s / 60);
        return Qv("Écris " + M(m + u("min") + "\\ " + s + u("s")) + " en minutes (nombre décimal).", v, M(s + u("s") + " = \\frac{" + s + "}{60}" + u("min") + " = " + N(r6(s / 60)) + u("min")) + ", donc " + Q(v, "min") + ".",
          { ctx: "conv-s", guide: [GSd("Combien de minutes font " + M(s + u("s")) + " ? (divise par 60)", s / 60, M(s + " : 60 = " + N(r6(s / 60))) + " min."), GS("Durée totale en minutes ?", v, M(m + " + " + N(r6(s / 60)) + " = " + N(v)) + " min.")],
            traps: [TRAP(r6(m + s / 100), "Une minute vaut 60 secondes : " + s + " s, c'est " + s + "/60 de minute.")] }); },
      () => { const k = pickBy([1, 2, 3, 4, 6, 7, 8, 9]), h = R.int(0, 2), v = r6(h + k / 10), min = Math.round(v * 60), c = pickBy([["Selon l'appli, Lina a couru", "appli"], ["Le GPS annonce un trajet de", "gps"], ["La batterie du téléphone tient encore", "batterie"]]);
        if (min < 20) return UTEMPS[2][3]();
        return Qv(c[0] + " " + Q(v, "h") + ". Combien de minutes cela fait-il ?", min, M(N(v) + " \\cdot 60 = " + min) + " min, soit " + hmT(min) + ".",
          { ctx: c[1], guide: [GS("Une heure = 60 min. Calcule " + M(N(v) + " \\cdot 60") + ".", min, M(N(v) + " \\cdot 60 = " + min) + " min.")],
            traps: [TRAP(60 * h + k, "La partie décimale est une fraction d'heure : " + N(r6(k / 10)).replace("{,}", ",") + " h = " + 6 * k + " min, pas " + k + " min."), TRAP(60 * h + 10 * k, "0,1 h = 6 min (un dixième de 60), pas 10 min.")] }); },
    ],
    3: [
      () => { const h = R.int(1, 3), m = R.int(4, 58), s = R.int(4, 58), t = 3600 * h + 60 * m + s, c = pickBy([["Un concert est enregistré pendant", "concert"], ["Un marathonien termine en", "marathon"], ["Le film le plus long de la soirée dure", "film"]]);
        return Qv(c[0] + " " + M(h + u("h") + "\\ " + m + u("min") + "\\ " + s + u("s")) + ". Combien de secondes cela fait-il ?", t,
          M(h + " \\cdot 3600 + " + m + " \\cdot 60 + " + s + " = " + N(t)) + " s.",
          { ctx: c[1], guide: [GS("Une heure = 3600 s. Combien de secondes dans " + M(h + u("h")) + " ?", 3600 * h, M(h + " \\cdot 3600 = " + N(3600 * h)) + " s."), GS("Combien dans " + M(m + u("min")) + " ?", 60 * m, M(m + " \\cdot 60 = " + 60 * m) + " s."), GS("Total en secondes ?", t, M(N(3600 * h) + " + " + 60 * m + " + " + s + " = " + N(t)) + " s.")],
            traps: [TRAP(60 * h + 60 * m + s, "Une heure vaut 3600 s (60 · 60), pas 60 s."), TRAP(3600 * h + 100 * m + s, "Une minute vaut 60 s.")] }); },
      () => { const h = R.int(1, 7), m = R.int(3, 57), s = R.int(5, 55), t = 3600 * h + 60 * m + s;
        return Qv("Écris " + M(N(t) + u("s")) + " en heures, minutes et secondes. Combien de <b>minutes</b> restent après les heures entières ?", m,
          M(N(t) + " : 3600") + " : " + h + " h entières (" + M(N(3600 * h)) + " s). Reste " + M(N(t - 3600 * h) + " s") + " ; " + M(N(t - 3600 * h) + " : 60") + " : " + m + " min et " + s + " s. Donc " + hmsT(t) + ".",
          { ctx: "hms", guide: [GS("Combien d'heures entières dans " + M(N(t) + u("s")) + " ? (une heure = 3600 s)", h, M(h + " \\cdot 3600 = " + N(3600 * h)) + " ≤ " + M(N(t)) + " < " + M(N(3600 * (h + 1))) + "."), GS("Combien de secondes restent après ces heures ?", t - 3600 * h, M(N(t) + " - " + N(3600 * h) + " = " + N(t - 3600 * h)) + " s."), GS("Combien de minutes entières dans ce reste ?", m, M(N(t - 3600 * h) + " = " + m + " \\cdot 60 + " + s) + " : " + m + " min et " + s + " s.")],
            traps: [TRAP(Math.floor(t / 60), "Ça, c'est le nombre total de minutes. Il faut d'abord retirer les heures entières.")] }); },
      () => { /* 26.11 (vraisemblance) : un épisode de série ou un cours de piano de 3 h 55 n'existe pas : heures propres au contexte */ const m = pickBy([5, 10, 25, 35, 40, 50, 55, 20]), c = pickBy([["Un épisode de série dure", "serie", [1]], ["Le film a duré", "film", [1, 2]], ["Le trajet Genève–Berne en voiture dure", "geneve", [1, 2]], ["La randonnée a duré", "rando", [2, 3, 4]]]), h = pickBy(c[2]), v = h + m / 60;
        return Qv(c[0] + " " + M(h + u("h") + "\\ " + two(m) + u("min")) + ". Écris cette durée en heures, arrondie au centième.", v,
          M(m + " : 60 \\approx " + N(+(m / 60).toFixed(4))) + " h, donc environ " + Q(+v.toFixed(2), "h") + ".",
          { round: 0.01, ctx: c[1], guide: [GS("Calcule " + M(m + " : 60") + " (au centième).", m / 60, M(m + " : 60 \\approx " + N(+(m / 60).toFixed(2))) + ".", 0.01), GS("Durée en heures, au centième ?", v, M(h + " + " + N(+(m / 60).toFixed(2)) + " \\approx " + N(+v.toFixed(2))) + " h.", 0.01)],
            traps: [TRAP(h + m / 100, "Ce n'est pas " + h + "," + two(m) + " h : il faut diviser " + m + " min par 60.")] }); },
      () => { const s = 60 * R.int(7, 13) + R.int(1, 3) * 15, h0 = R.int(6, 9), m0 = R.int(36, 58), dep = 60 * h0 + m0, dur = R.int(140, 330), arr = dep + dur, c = pickBy([["Un train", "train"], ["Un car scolaire", "car"], ["Un vol pour Lisbonne", "avion"]]);
        return Qv(c[0] + " part à " + horaire(dep) + " et arrive à " + horaire(arr) + ". Combien de minutes dure le voyage ?", dur,
          "De " + horaire(dep) + " à " + (h0 + 1) + " h 00 : " + (60 - m0) + " min. De " + (h0 + 1) + " h 00 à " + horaire(arr) + " : " + hmT(arr - 60 * (h0 + 1)) + ". Total : " + hmT(dur) + " = " + dur + " min.",
          { ctx: c[1], guide: [GS("Combien de minutes de " + horaire(dep) + " à " + (h0 + 1) + " h 00 ?", 60 - m0, M("60 - " + m0 + " = " + (60 - m0)) + " min."), GS("Combien de minutes de " + (h0 + 1) + " h 00 à " + horaire(arr) + " ?", arr - 60 * (h0 + 1), hmT(arr - 60 * (h0 + 1)) + " = " + (arr - 60 * (h0 + 1)) + " min."), GS("Durée totale en minutes ?", dur, M((60 - m0) + " + " + (arr - 60 * (h0 + 1)) + " = " + dur) + " min.")],
            traps: [TRAP((Math.floor(arr / 60) - h0) * 100 + (arr % 60) - m0, "On ne soustrait pas les horaires comme des nombres décimaux : une heure vaut 60 min. Complète d'abord jusqu'à l'heure pleine.")] }); },
    ],
  };

  // ===================== ucomp : unités composées =====================
  const UCOMP = {
    1: [
      () => { const c = pickBy([["Un guépard court à", 30, "guepard"], ["Un tram roule à", 15, "tram"], ["Une skieuse descend à", 25, "ski"], ["Un TGV roule à", 80, "tgv"], ["Une cycliste roule à", 7.5, "velo"], ["Un cheval galope à", 12.5, "cheval"]]), ms = c[1], kmh = r6(ms * 3.6);
        return Qv(c[0] + " " + Q(kmh, "km/h") + ". Quelle est sa vitesse en m/s ?", ms,
          "En une heure : " + Q(kmh * 1000, "m") + ". En une seconde, 3600 fois moins : " + M(N(kmh * 1000) + " : 3600 = " + N(ms)) + " m/s. (Raccourci : " + M(N(kmh) + " : 3{,}6") + ".)",
          { ctx: c[2], guide: [GS("Combien de mètres parcourt-il en une heure ?", kmh * 1000, Q(kmh, "km") + " = " + Q(kmh * 1000, "m") + "."), GS("Une heure = 3600 s. Combien de mètres en une seconde ?", ms, M(N(kmh * 1000) + " : 3600 = " + N(ms)) + " m/s.")],
            traps: [TRAP(r6(kmh * 3.6), "Une vitesse en m/s est plus petite qu'en km/h : on divise par 3,6, on ne multiplie pas."), TRAP(r6(kmh * 1000 / 60), "Ça, ce sont des mètres par minute. Une heure vaut 3600 secondes.")] }); },
      () => { const c = pickBy([["Un sprinteur court à", 10, "sprint"], ["Une hirondelle vole à", 15, "oiseau"], ["Le vent souffle à", 18, "vent"], ["Un nageur olympique nage à", 2, "nage"], ["Un drone vole à", 14, "drone"], ["Une trottinette roule à", 6, "trott"]]), ms = c[1], kmh = r6(ms * 3.6);
        return Qv(c[0] + " " + Q(ms, "m/s") + ". Quelle est sa vitesse en km/h ?", kmh,
          "En une heure (3600 s) : " + M(ms + " \\cdot 3600 = " + N(ms * 3600)) + " m = " + Q(kmh, "km") + ". Donc " + Q(kmh, "km/h") + ".",
          { ctx: c[2], guide: [GS("Une heure = 3600 s. Combien de mètres en une heure ?", ms * 3600, M(ms + " \\cdot 3600 = " + N(ms * 3600)) + " m."), GS("Écris cette distance en km : c'est la vitesse en km/h.", kmh, M(N(ms * 3600) + " : 1000 = " + N(kmh)) + " km/h.")],
            traps: [TRAP(r6(ms / 3.6), "Une vitesse en km/h est plus grande qu'en m/s : on multiplie par 3,6."), TRAP(ms * 60 / 1000, "Une heure vaut 3600 secondes, pas 60.")] }); },
      () => { const c = pickBy([["Un nageur avance à", 75, "nage"], ["Une marcheuse avance à", 90, "marche"], ["Un escalator monte à", 30, "escalator"], ["Un coureur de fond court à", 250, "course"]]), mm = c[1], kmh = r6(mm * 60 / 1000);
        return Qv(c[0] + " " + Q(mm, "m/min") + ". Quelle est sa vitesse en km/h ?", kmh,
          "En une heure (60 min) : " + M(mm + " \\cdot 60 = " + N(mm * 60)) + " m, soit " + Q(kmh, "km") + ". Donc " + Q(kmh, "km/h") + ".",
          { ctx: c[2], guide: [GS("Combien de mètres en une heure (60 min) ?", mm * 60, M(mm + " \\cdot 60 = " + N(mm * 60)) + " m."), GS("En km, c'est la vitesse en km/h :", kmh, M(N(mm * 60) + " : 1000 = " + N(kmh)) + " km/h.")],
            traps: [TRAP(r6(mm * 3.6), "3,6 sert pour les m/s. Ici ce sont des mètres par minute : une heure = 60 min."), TRAP(mm * 60, "C'est en mètres par heure : il faut encore passer en km.")] }); },
    ],
    2: [
      () => { const c = pickBy([["une fourmi", 3.2, "fourmi"], ["une coccinelle", 5, "coccinelle"], ["une tortue", 7.5, "tortue"], ["un paresseux", 4.5, "paresseux"]]), cms = c[1], kmh = cms * 3600 / 100000;
        return Qv("On observe " + c[0] + " qui avance à " + Q(cms, "cm/s") + ". Quelle est sa vitesse en km/h (au centième) ?", kmh,
          "En une heure : " + M(N(cms) + " \\cdot 3600 = " + N(cms * 3600)) + " cm. " + M("1\\ \\text{km} = 100\\text{'}000" + u("cm")) + ", donc " + M(N(cms * 3600) + " : 100\\text{'}000 \\approx " + N(+kmh.toFixed(2))) + " km/h.",
          { round: 0.01, ctx: c[2], guide: [GS("Combien de centimètres en une heure (3600 s) ?", cms * 3600, M(N(cms) + " \\cdot 3600 = " + N(cms * 3600)) + " cm."), GS("Un kilomètre = 100'000 cm. Vitesse en km/h (au centième) ?", kmh, M(N(cms * 3600) + " : 100\\text{'}000 \\approx " + N(+kmh.toFixed(2))) + " km/h.", 0.01)],
            traps: [TRAP(cms * 3.6, "3,6 transforme des m/s en km/h. Ici ce sont des cm/s : passe d'abord en m/s."), TRAP(cms * 3600 / 1000, "1 km = 100'000 cm (et non 1000 cm).")] }); },
      () => { const c = pickBy([["L'aluminium", 2.7, "alu"], ["Le fer", 7.9, "fer"], ["Le cuivre", 8.9, "cuivre"], ["L'argent", 10.5, "argent"], ["Le plomb", 11.3, "plomb"], ["L'or", 19.3, "or"], ["Le verre", 2.5, "verre"]]), g = c[1];
        return Qv(c[0] + " a une masse volumique de " + Q(g, "g/cm^3") + ". Exprime-la en " + M("\\text{kg/m}^3") + ".", r6(g * 1000),
          "Un mètre cube contient " + M("1\\text{'}000\\text{'}000" + u("cm^3")) + " : il pèse " + M(N(g) + " \\cdot 1\\text{'}000\\text{'}000 = " + N(g * 1e6)) + " g = " + Q(g * 1000, "kg") + ". Donc " + Q(g * 1000, "kg/m^3") + ".",
          { ctx: c[2], guide: [GS("Combien de " + M("\\text{cm}^3") + " dans " + M("1" + u("m^3")) + " ? (100 cm de côté)", 1e6, M("100 \\cdot 100 \\cdot 100 = 1\\text{'}000\\text{'}000") + "."), GS("Masse de " + M("1" + u("m^3")) + " en grammes ?", g * 1e6, M(N(g) + " \\cdot 1\\text{'}000\\text{'}000 = " + N(g * 1e6)) + " g."), GSd("En kg : c'est la masse volumique en " + M("\\text{kg/m}^3") + ".", g * 1000, M(N(g * 1e6) + " : 1000 = " + N(g * 1000)) + " kg.")],
            traps: [TRAP(r6(g * 1e6), "Ça, ce sont des grammes par m³ : il faut encore passer en kg."), TRAP(r6(g / 1000), "Un m³ est bien plus grand qu'un cm³ : le nombre doit augmenter.")] }); },
      () => { const c = pickBy([["Un robinet", 12, "robinet"], ["Une pompe d'arrosage", 25, "pompe"], ["Une fontaine", 40, "fontaine"], ["Une lance d'incendie", 350, "pompier"]]), q = c[1], m3h = r6(q * 60 / 1000);
        return Qv(c[0] + " a un débit de " + Q(q, "L/min") + ". Exprime ce débit en " + M("\\text{m}^3\\text{/h}") + ".", m3h,
          "En une heure : " + M(q + " \\cdot 60 = " + N(q * 60)) + " L. " + M("1" + u("m^3") + " = 1000" + u("L")) + ", donc " + M(N(q * 60) + " : 1000 = " + N(m3h)) + " m³/h.",
          { ctx: c[2], guide: [GS("Combien de litres en une heure ?", q * 60, M(q + " \\cdot 60 = " + N(q * 60)) + " L."), GS("Un mètre cube = 1000 L. Débit en m³/h ?", m3h, M(N(q * 60) + " : 1000 = " + N(m3h)) + " m³/h.")],
            traps: [TRAP(q * 60, "C'est en litres par heure : il faut encore passer en m³."), TRAP(r6(q / 1000 / 60), "En une heure il coule 60 fois plus qu'en une minute : on multiplie par 60.")] }); },
      () => { const c = pickBy([["L'eau de mer", 1025, "mer"], ["Le béton", 2400, "beton"], ["La glace", 920, "glace"], ["Le granit", 2700, "granit"], ["Le bois de chêne", 750, "chene"]]), k = c[1];
        return Qv(c[0] + " a une masse volumique de " + Q(k, "kg/m^3") + ". Exprime-la en " + M("\\text{g/cm}^3") + ".", r6(k / 1000),
          M("1" + u("m^3")) + " pèse " + Q(k * 1000, "g") + " et contient " + M("1\\text{'}000\\text{'}000" + u("cm^3")) + ". Un cm³ pèse donc " + M(N(k * 1000) + " : 1\\text{'}000\\text{'}000 = " + N(k / 1000)) + " g.",
          { ctx: c[2], guide: [GS("Masse de " + M("1" + u("m^3")) + " en grammes ?", k * 1000, Q(k, "kg") + " = " + Q(k * 1000, "g") + "."), GSd("Un m³ = 1'000'000 cm³. Masse d'un cm³ (en g) ?", k / 1000, M(N(k * 1000) + " : 1\\text{'}000\\text{'}000 = " + N(k / 1000)) + " g.")],
            traps: [TRAP(k * 1000, "Un cm³ est bien plus petit qu'un m³ : le nombre doit diminuer."), TRAP(r6(k / 1e6), "Passe aussi les kg en g (× 1000).")] }); },
    ],
    3: [
      () => { const a = pickBy([[14, 56, "Un chamois", "un lièvre", "montagne"], [25, 85, "Un faucon en piqué", "un pigeon", "oiseaux"], [11, 36, "Un cycliste", "un scooter", "route"], [9, 30, "Une coureuse", "un trottinettiste", "parc"]]), ms = a[0], kmh = a[1], d = r6(Math.abs(ms * 3.6 - kmh));
        if (d === 0) return UCOMP[3][0]();
        const fast = ms * 3.6 > kmh ? a[2] : a[3];
        return Qv(a[2] + " va à " + Q(ms, "m/s") + " et " + a[3] + " à " + Q(kmh, "km/h") + ". Quelle est la différence entre leurs vitesses, en km/h ?", d,
          M(ms + u("m/s") + " = " + ms + " \\cdot 3{,}6 = " + N(ms * 3.6) + u("km/h")) + ". Différence : " + M(N(Math.max(ms * 3.6, kmh)) + " - " + N(Math.min(ms * 3.6, kmh)) + " = " + N(d)) + " km/h (le plus rapide : " + fast.toLowerCase() + ").",
          { ctx: a[4], guide: [GSd("Pour comparer, il faut la même unité. Convertis " + Q(ms, "m/s") + " en km/h.", ms * 3.6, M(ms + " \\cdot 3{,}6 = " + N(ms * 3.6)) + " km/h."), GS("Différence des vitesses en km/h ?", d, M(N(Math.max(ms * 3.6, kmh)) + " - " + N(Math.min(ms * 3.6, kmh)) + " = " + N(d)) + " km/h.")],
            traps: [TRAP(Math.abs(kmh - ms), "On ne compare pas des m/s et des km/h directement : convertis d'abord."), TRAP(r6(Math.abs(ms / 3.6 - kmh)), "Des m/s vers des km/h, on multiplie par 3,6.")] }); },
      () => { const c = pickBy([[1.2, "Une pompe vide une cave à raison de", "cave"], [0.9, "Un arroseur automatique débite", "jardin"], [4.8, "Une station de lavage consomme", "lavage"], [2.4, "Une petite cascade débite", "cascade"]]), q = c[0], lmin = r6(q * 1000 / 60);
        return Qv(c[1] + " " + Q(q, "m^3/h") + ". Exprime ce débit en L/min.", lmin,
          Q(q, "m^3") + " = " + Q(q * 1000, "L") + " en une heure. En une minute : " + M(N(q * 1000) + " : 60 = " + N(lmin)) + " L/min.",
          { ctx: c[2], guide: [GS("Combien de litres en une heure ?", q * 1000, M(N(q) + " \\cdot 1000 = " + N(q * 1000)) + " L."), GS("Une heure = 60 min. Litres par minute ?", lmin, M(N(q * 1000) + " : 60 = " + N(lmin)) + " L/min.")],
            traps: [TRAP(q * 1000, "C'est le débit en L/h : divise encore par 60."), TRAP(r6(q * 1000 / 3600), "On veut des litres par minute (et non par seconde) : une heure = 60 min.")] }); },
      () => { const c = pickBy([[20400, "Le son parcourt environ", "dans l'air", "son-air"], [88800, "Le son parcourt environ", "dans l'eau", "son-eau"], [1800, "Une balle de tennis de table parcourt", "lors d'un smash", "pingpong"], [840, "Un colibri parcourt", "en vol", "colibri"]]), mm = c[0], ms = r6(mm / 60);
        return Qv(c[1] + " " + Q(mm, "m") + " par minute " + c[2] + ". Quelle est sa vitesse en m/s ?", ms,
          "Une minute = 60 s : " + M(N(mm) + " : 60 = " + N(ms)) + " m/s.",
          { ctx: c[3], guide: [GS("En une seconde, on parcourt 60 fois moins qu'en une minute. Vitesse en m/s ?", ms, M(N(mm) + " : 60 = " + N(ms)) + " m/s.")],
            traps: [TRAP(r6(mm / 3.6), "3,6 sert à passer des km/h aux m/s. Ici, ce sont des mètres par minute."), TRAP(r6(mm / 3600), "Une minute vaut 60 s, pas 3600 s.")] }); },
    ],
  };

  // ===================== vitesse : v, d, t et vitesse moyenne =====================
  const VIT = {
    1: [
      () => { const c = pickBy([["Un faucon pèlerin en chasse parcourt", "m", "s", 50, 3, "faucon", "m/s"], ["Une cycliste parcourt", "km", "h", 18, 3, "velo", "km/h"], ["Un TGV parcourt", "km", "h", 280, 2, "tgv", "km/h"], ["Une coureuse parcourt", "m", "s", 6, 45, "course", "m/s"], ["Un bateau parcourt", "km", "h", 24, 4, "bateau", "km/h"]]);
        const v = c[3] + R.int(-2, 2) * (c[3] >= 50 ? 5 : 1), t = c[4] + R.int(0, 2), d = v * t;
        return Qv(c[0] + " " + Q(d, c[1]) + " en " + Q(t, c[2]) + ". Quelle est sa vitesse moyenne (en " + c[6] + ") ?", v,
          M("v = \\frac{d}{t} = \\frac{" + N(d) + "}{" + t + "} = " + N(v)) + " " + c[6] + ".",
          { ctx: c[5], 
            guide: [GS("La vitesse est la distance parcourue en une unité de temps : " + M("v = \\frac{d}{t}") + ". Calcule " + M(N(d) + " : " + t) + ".", v, M(N(d) + " : " + t + " = " + N(v)) + " " + c[6] + ".")],
            traps: [TRAP(d * t, "On ne multiplie pas : la vitesse, c'est la distance divisée par la durée."), TRAP(r6(t / d), "C'est l'inverse : distance divisée par durée.")] }); },
      () => { const c = pickBy([["Pendant un orage, on entend le tonnerre", "s", "après avoir vu l'éclair. Le son va à 340 m/s. À quelle distance (en m) la foudre est-elle tombée ?", 340, [3, 4, 5, 6, 7, 9], "m", "orage"], ["Un train roule à 120 km/h pendant", "h", ". Quelle distance parcourt-il (en km) ?", 120, [1.5, 2.5, 3.5, 0.75], "km", "train"], ["Une hirondelle vole à 15 m/s pendant", "s", ". Quelle distance parcourt-elle (en m) ?", 15, [12, 25, 40, 75], "m", "oiseau"]]);
        const t = pickBy(c[4]), v = c[3], d = r6(v * t);
        return Qv(c[0] + " " + Q(t, c[1]) + (/^[.,]/.test(c[2]) ? "" : " ") + c[2] /* 28.11 : pas d'espace avant le point */, d, M("d = v \\cdot t = " + v + " \\cdot " + N(t) + " = " + N(d)) + " " + c[5] + ".",
          { ctx: c[6], guide: [GS("En une " + (c[1] === "h" ? "heure" : "seconde") + ", on parcourt " + v + " " + c[5] + ". Et en " + Q(t, c[1]) + " ? (" + M("d = v \\cdot t") + ")", d, M(v + " \\cdot " + N(t) + " = " + N(d)) + " " + c[5] + ".")],
            traps: [TRAP(r6(v / t), "La distance augmente avec la durée : on multiplie la vitesse par la durée.")] }); },
      () => { const c = pickBy([[80, [260, 340, 180, 300], "Une voiture roule à 80 km/h. Combien d'heures lui faut-il pour parcourir", "voiture"], [12, [30, 54, 42], "Un randonneur à vélo roule à 12 km/h. Combien d'heures lui faut-il pour parcourir", "rando"], [900, [3150, 2250, 4950], "Un avion de ligne vole à 900 km/h. Combien d'heures dure un vol de", "avion"]]);
        const v = c[0], d = pickBy(c[1]), t = r6(d / v);
        return Qv(c[2] + " " + Q(d, "km") + " ?", t, M("t = \\frac{d}{v} = \\frac{" + N(d) + "}{" + v + "} = " + N(t)) + " h" + (Number.isInteger(t) ? "" : ", soit " + hmT(Math.round(t * 60))) + ".",
          { ctx: c[3], guide: [GS("Chaque heure, on parcourt " + v + " km. Combien de fois " + v + " km dans " + N(d) + " km ? (" + M("t = \\frac{d}{v}") + ")", t, M(N(d) + " : " + v + " = " + N(t)) + " h.")],
            traps: [TRAP(d * v, "On ne multiplie pas : la durée, c'est la distance divisée par la vitesse."), TRAP(r6(v / d), "C'est l'inverse : distance divisée par vitesse.")] }); },
    ],
    2: [
      () => { const c = pickBy([[24, 105, "Une cycliste parcourt", "velo"], [16, 75, "Une équipe d'aviron parcourt", "aviron"], [64, 45, "Un car parcourt", "car"], [48, 135, "Un train régional parcourt", "train"]]);
        const v = c[0], min = c[1], d = r6(v * min / 60);
        return Qv(c[2] + " " + Q(d, "km") + " en " + hmT(min) + ". Quelle est sa vitesse moyenne en km/h ?", v,
          hmT(min) + " = " + Q(r6(min / 60), "h") + ". " + M("v = \\frac{" + N(d) + "}{" + N(r6(min / 60)) + "} = " + v) + " km/h.",
          { ctx: c[3], guide: [GSd("Écris " + hmT(min) + " en heures (nombre décimal).", min / 60, M((min % 60) + " : 60 = " + N(r6((min % 60) / 60))) + ", donc " + Q(r6(min / 60), "h") + "."), GS("Vitesse en km/h ?", v, M(N(d) + " : " + N(r6(min / 60)) + " = " + v) + " km/h.")],
            traps: [TRAP(r6(d / (Math.floor(min / 60) + (min % 60) / 100)), "Attention : " + hmT(min) + " n'est pas " + Math.floor(min / 60) + "," + two(min % 60) + " h. Divise les minutes par 60.")] }); },
      () => { const v = pickBy([72, 90, 84, 96, 66]), min = pickBy([25, 35, 40, 50, 55]), d = r6(v * min / 60), c = pickBy([["Une voiture roule à", "voiture"], ["Un train roule à", "train"], ["Un bus express roule à", "bus"]]);
        return Qv(c[0] + " " + Q(v, "km/h") + ". Combien de minutes lui faut-il pour parcourir " + Q(d, "km") + " ?", min,
          M("t = \\frac{" + N(d) + "}{" + v + "} = " + N(r6(d / v))) + " h, soit " + M(N(r6(d / v)) + " \\cdot 60 = " + min) + " min. (Ou : " + v + " km/h = " + N(r6(v / 60)).replace("{,}", ",") + " km par minute.)",
          { ctx: c[1], guide: [GSd("Combien de km parcourt-on en une minute ? (" + M(v + " : 60") + ")", v / 60, M(v + " : 60 = " + N(r6(v / 60))) + " km par minute."), GS("Combien de minutes pour " + Q(d, "km") + " ?", min, M(N(d) + " : " + N(r6(v / 60)) + " = " + min) + " min.")],
            traps: [TRAP(r6(d / v), "Ça, c'est la durée en heures. La question demande des minutes."), TRAP(r6(d / v * 100), "Une heure vaut 60 minutes, pas 100.")] }); },
      () => { const v = pickBy([85, 75, 95, 65]), min = pickBy([144, 108, 132, 156]), d = r6(v * min / 60), c = pickBy([["Un camion roule à", "camion"], ["Un bateau à moteur file à", "bateau"], ["Un car de touristes roule à", "car"]]);
        return Qv(c[0] + " " + Q(v, "km/h") + " pendant " + hmT(min) + ". Quelle distance parcourt-il (en km) ?", d,
          hmT(min) + " = " + Q(r6(min / 60), "h") + ". " + M("d = " + v + " \\cdot " + N(r6(min / 60)) + " = " + N(d)) + " km.",
          { ctx: c[1], guide: [GSd("Écris " + hmT(min) + " en heures (nombre décimal).", min / 60, M((min % 60) + " : 60 = " + N(r6((min % 60) / 60))) + ", donc " + Q(r6(min / 60), "h") + "."), GS("Distance : " + M("d = v \\cdot t") + " ?", d, M(v + " \\cdot " + N(r6(min / 60)) + " = " + N(d)) + " km.")],
            traps: [TRAP(r6(v * (Math.floor(min / 60) + (min % 60) / 100)), "Attention : " + hmT(min) + " n'est pas " + Math.floor(min / 60) + "," + two(min % 60) + " h.")] }); },
      () => { const c = pickBy([[1.5, "Un escargot avance à", "mm/s", "escargot"], [3, "Une chenille avance à", "mm/s", "chenille"] /* 26.11 (vraisemblance) : un escargot fait environ 1 mm/s (et non 4) */, [5, "Un glacier de montagne avance de", "cm/jour", "glacier"]]);
        if (c[2] === "cm/jour") { const j = pickBy([30, 365, 120]), d = r6(c[0] * j / 100); return Qv(c[1] + " " + Q(c[0], "cm") + " par jour. De combien de mètres avance-t-il en " + j + " jours ?", d, M(c[0] + " \\cdot " + j + " = " + c[0] * j) + " cm = " + Q(d, "m") + ".", { ctx: c[3], guide: [GS("Combien de cm en " + j + " jours ?", c[0] * j, M(c[0] + " \\cdot " + j + " = " + c[0] * j) + " cm."), GS("En mètres ?", d, M(c[0] * j + " : 100 = " + N(d)) + " m.")], traps: [TRAP(c[0] * j, "C'est en centimètres : 1 m = 100 cm.")] }); }
        const d = r6(c[0] * 3600 / 1000);
        return Qv(c[1] + " " + Q(c[0], c[2]) + ". Quelle distance parcourt-il en une heure (en m) ?", d, "Une heure = 3600 s : " + M(N(c[0]) + " \\cdot 3600 = " + N(c[0] * 3600)) + " mm = " + Q(d, "m") + ".",
          { ctx: c[3], guide: [GS("Combien de mm en une heure (3600 s) ?", c[0] * 3600, M(N(c[0]) + " \\cdot 3600 = " + N(c[0] * 3600)) + " mm."), GS("En mètres (1 m = 1000 mm) ?", d, M(N(c[0] * 3600) + " : 1000 = " + N(d)) + " m.")], traps: [TRAP(c[0] * 60 / 1000, "Une heure vaut 3600 secondes, pas 60."), TRAP(c[0] * 3600, "C'est en millimètres : 1 m = 1000 mm.")] }); },
    ],
    3: [
      () => { const [v1, v2, dd] = pickBy([[40, 60, 120], [60, 120, 120], [30, 60, 60], [60, 90, 180], [40, 120, 120], [60, 40, 240], [90, 60, 180], [80, 120, 240]]), tt = dd / v1 + dd / v2, vm = (2 * dd) / tt, c = pickBy([["Une voiture fait un aller", "voiture"], ["Un motard fait un aller", "moto"], ["Une cycliste fait un aller", "velo"]]);
        const V1 = c[1] === "velo" ? v1 / 4 : v1, V2 = c[1] === "velo" ? v2 / 4 : v2, D = c[1] === "velo" ? dd / 4 : dd;
        return Qv(c[0] + " de " + Q(D, "km") + " à " + Q(V1, "km/h") + " et le retour à " + Q(V2, "km/h") + ". Quelle est sa vitesse moyenne sur l'aller-retour (en km/h) ?", (2 * D) / (D / V1 + D / V2),
          "Durées : " + M(N(D) + " : " + N(V1) + " = " + N(r6(D / V1))) + " h et " + M(N(D) + " : " + N(V2) + " = " + N(r6(D / V2))) + " h. Total " + M(N(r6(D / V1 + D / V2))) + " h pour " + M(N(2 * D)) + " km : " + M("v = " + N(r6(vm * D / dd))) + " km/h (et non la moyenne des deux vitesses).",
          { ctx: c[1], 
            guide: [GSd("Durée de l'aller (en h) ?", D / V1, M(N(D) + " : " + N(V1) + " = " + N(r6(D / V1))) + " h."), GSd("Durée du retour (en h) ?", D / V2, M(N(D) + " : " + N(V2) + " = " + N(r6(D / V2))) + " h."), GS("Vitesse moyenne = distance totale ÷ durée totale. Combien ?", (2 * D) / (D / V1 + D / V2), M(N(2 * D) + " : " + N(r6(D / V1 + D / V2)) + " = " + N(r6(vm * D / dd))) + " km/h.")],
            traps: [TRAP((V1 + V2) / 2, "On ne fait jamais la moyenne des vitesses : on roule plus longtemps à la vitesse la plus lente. Divise la distance totale par la durée totale.")] }); },
      () => { const [m1, v1, m2, v2] = pickBy([[30, 60, 90, 100], [20, 90, 40, 60], [45, 80, 15, 120], [40, 45, 80, 90], [30, 50, 90, 110]]), d1 = v1 * m1 / 60, d2 = v2 * m2 / 60, vm = (d1 + d2) / ((m1 + m2) / 60), c = pickBy([["Un car roule", "car"], ["Une voiture roule", "voiture"], ["Un train régional roule", "train"]]);
        if (vm === (v1 + v2) / 2) return VIT[3][1]();
        return Qv(c[0] + " " + m1 + " min à " + Q(v1, "km/h") + ", puis " + (m2 >= 60 ? hmT(m2) : m2 + " min") + " à " + Q(v2, "km/h") + ". Quelle est sa vitesse moyenne sur tout le trajet (en km/h) ?", vm,
          "Distances : " + M(v1 + " \\cdot " + N(r6(m1 / 60)) + " = " + N(d1)) + " km et " + M(v2 + " \\cdot " + N(r6(m2 / 60)) + " = " + N(d2)) + " km. Total " + M(N(d1 + d2)) + " km en " + M(N(r6((m1 + m2) / 60))) + " h : " + M("v = " + N(r6(vm))) + " km/h.",
          { ctx: c[1], guide: [GS("Distance de la première partie (km) ?", d1, M(v1 + " \\cdot " + N(r6(m1 / 60)) + " = " + N(d1)) + " km."), GS("Distance de la deuxième partie (km) ?", d2, M(v2 + " \\cdot " + N(r6(m2 / 60)) + " = " + N(d2)) + " km."), GS("Distance totale : durée totale (en h). Vitesse moyenne ?", vm, M(N(d1 + d2) + " : " + N(r6((m1 + m2) / 60)) + " = " + N(r6(vm))) + " km/h.")],
            traps: [TRAP((v1 + v2) / 2, "On ne fait pas la moyenne des deux vitesses : les deux parties ne durent pas aussi longtemps.")] }); },
      () => { const c = pickBy([[100, 9.58, "Usain Bolt détient le record du 100 m", "bolt"], [400, 43.03, "Wayde van Niekerk détient le record du 400 m", "400m"], [200, 21.34, "Florence Griffith-Joyner détient le record du 200 m", "flojo"], [1500, 206, "Hicham El Guerrouj détient le record du 1500 m", "1500m"]]), d = c[0], t = c[1], kmh = d / t * 3.6;
        return Qv(c[2] + " en " + (t > 60 ? Math.floor(t / 60) + " min " + two(t % 60) + " s" : Q(t, "s")) + ". Quelle a été sa vitesse moyenne en km/h (au dixième) ?", kmh,
          M("v = \\frac{" + N(d) + "}{" + N(t) + "} \\approx " + N(+(d / t).toFixed(3))) + " m/s, puis " + M("\\cdot 3{,}6") + " : environ " + Q(+kmh.toFixed(1), "km/h") + ".",
          { round: 0.1, ctx: c[3], guide: [...(t > 60 ? [GS("Durée en secondes ?", t, Math.floor(t / 60) + " min " + (t % 60) + " s = " + M(N(t)) + " s.")] : []), GS("Vitesse en m/s (au millième) ?", d / t, M(N(d) + " : " + N(t) + " \\approx " + N(+(d / t).toFixed(3))) + " m/s.", 0.001), GS("En km/h (au dixième) ?", kmh, M(N(+(d / t).toFixed(3)) + " \\cdot 3{,}6 \\approx " + N(+kmh.toFixed(1))) + " km/h.", 0.1)],
            traps: [TRAP(d / t, "Ça, c'est la vitesse en m/s. On la demande en km/h (× 3,6)."), TRAP(d / t / 3.6, "Des m/s vers les km/h, on multiplie par 3,6.")] }); },
      () => { const t = pickBy([4, 6, 7, 9, 12]), v = 340, d = v * t, c = pickBy([["Pendant un orage, Noé compte", "orage"], ["En montagne, une randonneuse compte", "montagne"]]);
        return Qv(c[0] + " " + t + " secondes entre l'éclair et le tonnerre. Le son va à " + Q(v, "m/s") + " et la lumière arrive presque instantanément. À quelle distance (en km) la foudre est-elle tombée ?", d / 1000,
          M("d = 340 \\cdot " + t + " = " + N(d)) + " m = " + Q(d / 1000, "km") + ". (Raccourci : environ 3 secondes par kilomètre.)",
          { ctx: c[1], guide: [GS("Distance parcourue par le son, en mètres ?", d, M("340 \\cdot " + t + " = " + N(d)) + " m."), GS("En km ?", d / 1000, M(N(d) + " : 1000 = " + N(d / 1000)) + " km.")],
            traps: [TRAP(d, "C'est la distance en mètres : la question demande des km."), TRAP(r6(t / 3), "Le raccourci « 3 s par km » donne une estimation ; ici on calcule avec 340 m/s.")] }); },
    ],
  };

  // ===================== gquot : masse volumique et débit =====================
  const MET = [["d'aluminium", 2.7, "alu"], ["de fer", 7.9, "fer"], ["de cuivre", 8.9, "cuivre"], ["d'argent", 10.5, "argent"], ["de plomb", 11.3, "plomb"], ["d'or", 19.3, "or"], ["de verre", 2.5, "verre"]];
  const GQ = {
    1: [
      () => { const m = pickBy(MET), V = R.int(12, 80), mass = r6(m[1] * V);
        return Qv("Un cube " + m[0] + " a un volume de " + Q(V, "cm^3") + " et une masse de " + Q(mass, "g") + ". Calcule sa masse volumique (en " + M("\\text{g/cm}^3") + ").", m[1],
          M("\\rho = \\frac{m}{V} = \\frac{" + N(mass) + "}{" + V + "} = " + N(m[1])) + " g/cm³ : chaque cm³ pèse " + N(m[1]).replace("{,}", ",") + " g.",
          { ctx: m[2], guide: [GS("La masse volumique est la masse d'un cm³ : " + M("\\rho = \\frac{m}{V}") + ". Calcule " + M(N(mass) + " : " + V) + ".", m[1], M(N(mass) + " : " + V + " = " + N(m[1])) + " g/cm³.")],
            traps: [TRAP(r6(V / mass), "C'est l'inverse : masse divisée par volume."), TRAP(r6(mass * V), "On divise la masse par le volume.")] }); },
      () => { const c = pickBy([["L'huile d'olive", 0.92, "L", "kg", "Quelle est la masse de", "huile"], ["Le lait", 1.03, "L", "kg", "Quelle est la masse de", "lait"], ["L'essence", 0.75, "L", "kg", "Quelle est la masse de", "essence"], ["Le miel", 1.4, "L", "kg", "Quelle est la masse de", "miel"]]), V = pickBy([5, 12, 20, 25, 8]), mass = r6(c[1] * V);
        return Qv(c[0] + " a une masse volumique de " + M(N(c[1]) + u("kg/L")) + ". " + c[4] + " " + Q(V, "L") + " (en kg) ?", mass, M("m = \\rho \\cdot V = " + N(c[1]) + " \\cdot " + V + " = " + N(mass)) + " kg.",
          { ctx: c[5], guide: [GS("Un litre pèse " + N(c[1]).replace("{,}", ",") + " kg. Et " + V + " litres ? (" + M("m = \\rho \\cdot V") + ")", mass, M(N(c[1]) + " \\cdot " + V + " = " + N(mass)) + " kg.")],
            traps: [TRAP(r6(V / c[1]), "On cherche une masse : masse = masse volumique × volume.")] }); },
      () => { const m = pickBy(MET), V = R.int(6, 60), mass = r6(m[1] * V), obj = pickBy(["Une statuette", "Un presse-papier", "Une médaille", "Une pièce de collection"]);
        return Qv(obj + " " + m[0] + " (" + M(N(m[1]) + u("g/cm^3")) + ") a une masse de " + Q(mass, "g") + ". Quel est son volume (en " + M("\\text{cm}^3") + ") ?", V, M("V = \\frac{m}{\\rho} = \\frac{" + N(mass) + "}{" + N(m[1]) + "} = " + V) + " cm³.",
          { ctx: m[2] + "-obj", guide: [GS("Chaque cm³ pèse " + N(m[1]).replace("{,}", ",") + " g. Combien de cm³ pour " + N(mass).replace("{,}", ",").replace("\\text{'}", "'") + " g ? (" + M("V = \\frac{m}{\\rho}") + ")", V, M(N(mass) + " : " + N(m[1]) + " = " + V) + " cm³.")],
            traps: [TRAP(r6(mass * m[1]), "On cherche un volume : volume = masse ÷ masse volumique."), TRAP(r6(m[1] / mass), "C'est l'inverse : masse divisée par masse volumique.")] }); },
    ],
    2: [
      () => { const L = R.int(7, 12), l = R.int(5, 8), h = pickBy([2.5, 3, 3.5, 4]), V = r6(L * l * h), mass = r6(1.2 * V), c = pickBy([["une salle de classe", "classe"], ["une chambre", "chambre"], ["un local de musique", "musique"]]);
        return Qv("À 20 °C, l'air a une masse volumique de " + M("1{,}2" + u("kg/m^3")) + ". Quelle est la masse de l'air contenu dans " + c[0] + " de " + Q(L, "m") + " sur " + Q(l, "m") + " et " + Q(h, "m") + " de haut (en kg) ?", mass,
          M("V = " + L + " \\cdot " + l + " \\cdot " + N(h) + " = " + N(V)) + " m³ ; " + M("m = 1{,}2 \\cdot " + N(V) + " = " + N(mass)) + " kg. Plus qu'on ne le pense !",
          { ctx: c[1], fig: FIG.box(L + " m", l + " m", N(h).replace("{,}", ",") + " m"), guide: [GS("Volume de la pièce (en m³) ?", V, M(L + " \\cdot " + l + " \\cdot " + N(h) + " = " + N(V)) + " m³."), GS("Masse de l'air : " + M("m = \\rho \\cdot V") + " ?", mass, M("1{,}2 \\cdot " + N(V) + " = " + N(mass)) + " kg.")],
            traps: [TRAP(r6(V / 1.2), "On cherche une masse : masse = masse volumique × volume."), TRAP(r6(1.2 * (L + l + h)), "Le volume d'un pavé est le produit des trois dimensions.")] }); },
      () => { const m = pickBy(MET), V = R.int(2, 9), mass = r6(m[1] * V), obj = pickBy(["Une bague", "Un pendentif", "Une pièce", "Un bouton"]);
        return Qv(obj + " " + m[0] + " a une masse de " + Q(mass, "g") + ". La masse volumique de ce métal est " + Q(m[1] * 1000, "kg/m^3") + ". Quel est son volume (en " + M("\\text{cm}^3") + ") ?", V,
          Q(m[1] * 1000, "kg/m^3") + " = " + M(N(m[1]) + u("g/cm^3")) + ". " + M("V = \\frac{" + N(mass) + "}{" + N(m[1]) + "} = " + V) + " cm³.",
          { ctx: m[2] + "-bijou", guide: [GS("Convertis la masse volumique en " + M("\\text{g/cm}^3") + " (divise par 1000).", m[1], M(N(m[1] * 1000) + u("kg/m^3") + " = " + N(m[1]) + u("g/cm^3")) + "."), GS("Volume : " + M("V = \\frac{m}{\\rho}") + " ?", V, M(N(mass) + " : " + N(m[1]) + " = " + V) + " cm³.")],
            traps: [TRAP(r6(mass / (m[1] * 1000)), "Les unités ne vont pas ensemble : convertis d'abord la masse volumique en g/cm³."), TRAP(r6(mass * m[1]), "Volume = masse ÷ masse volumique.")] }); },
      () => { const c = pickBy([[4.3, 8.2, "tonnes de bois de sapin occupent", "sapin"], [6.5, 5.2, "tonnes de sable sec occupent", "sable"], [3.6, 4.8, "tonnes de neige tassée occupent", "neige"], [9.2, 3.4, "tonnes de pierres occupent", "pierre"]]), rho = c[0] * 1000 / c[1];
        return Qv(M(N(c[0])) + " " + c[2] + " " + Q(c[1], "m^3") + ". Quelle est leur masse volumique en " + M("\\text{kg/m}^3") + " (à l'unité) ?", rho,
          Q(c[0], "t") + " = " + Q(c[0] * 1000, "kg") + ". " + M("\\rho = \\frac{" + N(c[0] * 1000) + "}{" + N(c[1]) + "} \\approx " + N(Math.round(rho))) + " kg/m³.",
          { round: 1, ctx: c[3], guide: [GS("Convertis la masse en kg.", c[0] * 1000, Q(c[0], "t") + " = " + Q(c[0] * 1000, "kg") + "."), GS("Masse volumique (à l'unité) ?", rho, M(N(c[0] * 1000) + " : " + N(c[1]) + " \\approx " + N(Math.round(rho))) + " kg/m³.", 1)],
            traps: [TRAP(c[0] / c[1], "C'est en tonnes par m³ : on la demande en kg/m³ (1 t = 1000 kg)."), TRAP(c[1] / c[0] * 1000, "Masse divisée par volume, pas l'inverse.")] }); },
    ],
    3: [
      () => { const c = pickBy([[2.4, 15, "Une piscine gonflable de", "remplie avec un tuyau qui débite", "piscine"], [1.8, 12, "Une cuve de récupération d'eau de pluie de", "remplie par une pompe qui débite", "cuve"], [0.9, 18, "Un aquarium de", "rempli avec un robinet qui débite", "aquarium"]]), V = c[0], q = c[1], t = V * 1000 / q;
        return Qv(c[2] + " " + Q(V, "m^3") + " est " + c[3] + " " + Q(q, "L/min") + ". Combien de minutes faut-il pour la remplir ?", t,
          Q(V, "m^3") + " = " + Q(V * 1000, "L") + ". " + M("t = \\frac{" + N(V * 1000) + "}{" + q + "} = " + N(t)) + " min" + (t >= 60 ? ", soit " + hmT(t) : "") + ".",
          { ctx: c[4], guide: [GS("Convertis le volume en litres.", V * 1000, Q(V, "m^3") + " = " + Q(V * 1000, "L") + "."), GS("Il coule " + q + " L chaque minute. Combien de minutes ? (" + M("t = \\frac{V}{\\text{débit}}") + ")", t, M(N(V * 1000) + " : " + q + " = " + N(t)) + " min.")],
            traps: [TRAP(V / q, "Convertis d'abord les m³ en litres (1 m³ = 1000 L)."), TRAP(V * 1000 * q, "Durée = volume ÷ débit.")] }); },
      () => { const c = pickBy([[10, 25, "Une fontaine remplit un seau de", "fontaine"], [6, 15, "Un robinet remplit un arrosoir de", "arrosoir"], [1.5, 9, "Un distributeur remplit une bouteille de", "bouteille"]]), V = c[0], s = c[1], q = V / s * 60;
        return Qv(c[2] + " " + Q(V, "L") + " en " + Q(s, "s") + ". Quel est son débit en L/min ?", q,
          "En une seconde : " + M(N(V) + " : " + s + " = " + N(r6(V / s))) + " L. En une minute : " + M(N(r6(V / s)) + " \\cdot 60 = " + N(q)) + " L/min.",
          { ctx: c[3], guide: [GS("Combien de litres en une seconde ?", V / s, M(N(V) + " : " + s + " = " + N(r6(V / s))) + " L/s."), GS("Et en une minute ?", q, M(N(r6(V / s)) + " \\cdot 60 = " + N(q)) + " L/min.")],
            traps: [TRAP(V / s, "Ça, c'est le débit en litres par seconde : il en coule 60 fois plus en une minute."), TRAP(s / V, "Débit = volume ÷ durée.")] }); },
      () => { const q = pickBy([8, 9, 12, 15]), m = R.int(4, 9), s = 30, t = m + s / 60, V = q * t, c = pickBy([["Une douche", "douche"], ["Un tuyau d'arrosage", "jardin"], ["Le robinet de la cuisine", "cuisine"]]);
        return Qv(c[0] + " a un débit de " + Q(q, "L/min") + ". Combien de litres coulent en " + M(m + u("min") + "\\ " + s + u("s")) + " ?", V,
          M(m + u("min") + "\\ 30" + u("s") + " = " + N(t) + u("min")) + ". " + M("V = " + q + " \\cdot " + N(t) + " = " + N(V)) + " L.",
          { ctx: c[1], guide: [GS("Écris la durée en minutes (nombre décimal).", t, M("30" + u("s") + " = 0{,}5" + u("min")) + ", donc " + Q(t, "min") + "."), GS("Volume : débit × durée ?", V, M(q + " \\cdot " + N(t) + " = " + N(V)) + " L.")],
            traps: [TRAP(q * (m + 0.3), "30 s, c'est une demi-minute : 0,5 min (pas 0,3)."), TRAP(q * m, "N'oublie pas les 30 secondes.")] }); },
    ],
  };

  // ===================== Trouve l'erreur et estimation (15.11, cases 11 et 13 du chantier) =====================
  // « Trouve l'erreur » : un camarade a fait une faute typique ; l'élève la repère et donne le bon résultat.
  const who = () => pickBy(["Sam", "Lina", "Noé", "Inès", "Yanis", "Léa"]);
  UTEMPS[2].push(() => { const h = R.int(1, 4), k = pickBy([2, 3, 4, 5]), v = r6(h + k / 10), min = Math.round(v * 60), w = who();
    return Qv(w + " écrit : « " + Q(v, "h") + " = " + h + " h " + 10 * k + " min ». Trouve son erreur, puis donne la bonne durée <b>en minutes</b>.", min,
      "Erreur : la partie décimale est une fraction d'heure, pas des minutes. " + M("0{,}" + k + " \\cdot 60 = " + 6 * k) + " min, donc " + h + " h " + two(6 * k) + " min = " + M(min) + " min.",
      { ctx: "erreur", guide: [GS("Combien de minutes font " + M("0{,}" + k + u("h")) + " ? (multiplie par 60)", 6 * k, M("0{,}" + k + " \\cdot 60 = " + 6 * k) + " min, et non " + 10 * k + " min."), GS("Durée totale en minutes ?", min, M(60 * h + " + " + 6 * k + " = " + min) + " min.")],
        traps: [TRAP(60 * h + 10 * k, "C'est le résultat de " + w + " : " + N(v).replace("{,}", ",") + " h n'est pas " + h + " h " + 10 * k + " min.")] }); });
  UCOMP[2].push(() => { const ms = pickBy([15, 20, 25, 12.5]), kmh = r6(ms * 3.6), w = who();
    return Qv(w + " convertit " + Q(kmh, "km/h") + " en m/s : « " + M(N(kmh) + " \\cdot 3{,}6 = " + N(r6(kmh * 3.6))) + " m/s ». Trouve l'erreur, puis donne la bonne vitesse en m/s.", ms,
      "Erreur : une vitesse en m/s est plus petite qu'en km/h ; il fallait diviser. " + M(N(kmh) + " : 3{,}6 = " + N(ms)) + " m/s.",
      { ctx: "erreur", guide: [GS("Des km/h vers les m/s, le nombre doit diminuer : on divise par 3,6. Résultat ?", ms, M(N(kmh) + " : 3{,}6 = " + N(ms)) + " m/s.")],
        traps: [TRAP(r6(kmh * 3.6), "C'est le résultat de " + w + " : " + N(r6(kmh * 3.6)).replace("{,}", ",") + " m/s, ce serait plus de " + Math.round(kmh * 13) + " km/h !")] }); });
  VIT[3].push(() => { const mn = pickBy([15, 45, 20, 40]), v = pickBy([60, 72, 48]), d = r6(v * (1 + mn / 60)), wrong = d / (1 + mn / 100), w = who();
    return Qv("Un car parcourt " + Q(d, "km") + " en 1 h " + mn + " min. " + w + " écrit : « 1 h " + mn + " min " + M("= 1{,}" + mn + u("h")) + ", donc " + M("v = " + N(d) + " : 1{,}" + mn + " \\approx " + N(+wrong.toFixed(1))) + " km/h ». Trouve l'erreur, puis donne la bonne vitesse (en km/h).", v,
      "Erreur : " + mn + " min ne font pas 0," + mn + " h. " + M(mn + " : 60 = " + N(r6(mn / 60))) + ", donc " + M(N(r6(1 + mn / 60)) + u("h")) + " et " + M("v = " + N(d) + " : " + N(r6(1 + mn / 60)) + " = " + v) + " km/h.",
      { ctx: "erreur", guide: [GSd("Écris 1 h " + mn + " min en heures décimales.", 1 + mn / 60, M(mn + " : 60 = " + N(r6(mn / 60))) + ", donc " + M(N(r6(1 + mn / 60))) + " h."), GS("Bonne vitesse ?", v, M(N(d) + " : " + N(r6(1 + mn / 60)) + " = " + v) + " km/h.")],
        traps: [TRAP(wrong, "C'est le résultat de " + w + " : une heure vaut 60 min, pas 100.")] }); });
  GQ[2].push(() => { const m = pickBy(MET.slice(0, 5)), V = R.int(12, 40), mass = r6(m[1] * V), w = who();
    return Qv("Un bloc " + m[0] + " de " + Q(V, "cm^3") + " pèse " + Q(mass, "g") + ". " + w + " calcule sa masse volumique : « " + M("\\rho = " + V + " : " + N(mass) + " \\approx " + N(+(V / mass).toFixed(3))) + " g/cm³ ». Trouve l'erreur, puis donne la bonne masse volumique.", m[1],
      "Erreur : " + w + " a divisé le volume par la masse. " + M("\\rho = \\frac{m}{V} = " + N(mass) + " : " + V + " = " + N(m[1])) + " g/cm³.",
      { ctx: "erreur", guide: [GS("La masse volumique, c'est la masse d'un cm³ : " + M("\\rho = \\frac{m}{V}") + ". Calcule-la.", m[1], M(N(mass) + " : " + V + " = " + N(m[1])) + " g/cm³.")],
        traps: [TRAP(V / mass, "C'est le résultat de " + w + " : il faut la masse divisée par le volume.")] }); });
  // Estimation : ordre de grandeur sans calculatrice, réponse acceptée dans une fourchette (round).
  VIT[2].push(() => { const c = pickBy([[300, 2, "Un TGV", "tgv"], [240, 3, "Un car", "car"], [180, 2, "Une voiture", "voiture"], [450, 5, "Un camion", "camion"]]), d = c[0] - R.int(2, 6), mn = 60 * c[1] - R.int(2, 4), v = d / (mn / 60);
    return Qv("<b>Sans calculatrice</b> : " + c[2] + " parcourt " + Q(d, "km") + " en " + hmT(mn) + ". Donne un ordre de grandeur de sa vitesse moyenne (à 10 km/h près).", v,
      "Environ " + c[0] + " km en environ " + c[1] + " h : " + M(c[0] + " : " + c[1] + " = " + c[0] / c[1]) + " km/h. (Valeur exacte : " + M("\\approx " + N(+v.toFixed(1))) + " km/h.)",
      { round: 10, ctx: "estim-" + c[3], guide: [GS("Arrondis : la distance fait environ " + c[0] + " km et la durée environ " + c[1] + " h. Combien font " + M(c[0] + " : " + c[1]) + " ?", c[0] / c[1], M(c[0] + " : " + c[1] + " = " + c[0] / c[1]) + " km/h environ.", 10), GS("Ton ordre de grandeur de la vitesse moyenne (à 10 km/h près) ?", v, "Environ " + M(c[0] / c[1]) + " km/h (valeur exacte " + M("\\approx " + N(+v.toFixed(1))) + ").", 10)],
        traps: [TRAP(d * mn / 60, "On divise la distance par la durée, on ne multiplie pas.")] }); });
  GQ[2].push(() => { const L = r6(10 + pickBy([-0.1, 0.1])), l = r6(6 + pickBy([-0.1, 0.1])), h = 3, V = L * l * h, m = 1.2 * V;
    return Qv("<b>Sans calculatrice</b> : une salle mesure " + Q(L, "m") + " sur " + Q(l, "m") + " et " + Q(h, "m") + " de haut ; l'air pèse " + M("1{,}2" + u("kg/m^3")) + ". Estime la masse de l'air de la salle (à 20 kg près).", m,
      "Environ " + M("10 \\cdot 6 \\cdot 3 = 180") + " m³, et " + M("180 \\cdot 1{,}2 = 216") + " kg. (Valeur exacte : " + M("\\approx " + N(+m.toFixed(1))) + " kg.)",
      { round: 20, ctx: "estim-air", guide: [GS("Arrondis les dimensions à 10 m, 6 m et 3 m : volume environ ?", 180, M("10 \\cdot 6 \\cdot 3 = 180") + " m³.", 20), GS("Masse de l'air environ ? (" + M("180 \\cdot 1{,}2") + ")", m, M("180 \\cdot 1{,}2 = 216") + " kg environ.", 20)],
        traps: [TRAP(V / 1.2, "La masse, c'est la masse volumique fois le volume.")] }); });

  // ===================== Problèmes en plusieurs étapes (défi, niveau 4) =====================
  const P = (fig, q, parts, hints, sol) => ({ fig, q, parts: parts.map(([label, value, round]) => ({ label, spec: Object.assign({ kind: "value", value }, round ? { round } : {}) })), hints, sol });
  const PROBS = {
    utemps: [
      () => { const h = R.int(9, 12), m = R.int(5, 55), t = 60 * h + m;
        return P(null, "Un avion relie Genève à une ville lointaine en " + M(h + u("h") + "\\ " + m + u("min")) + ".",
          [["a) Durée du vol en minutes", t], ["b) Durée du vol en secondes", 60 * t], ["c) Durée du vol en heures (au centième)", t / 60, 0.01]],
          ["1 h = 60 min, 1 min = 60 s.", "Pour les heures décimales, divise les minutes par 60."],
          "a) " + M(h + " \\cdot 60 + " + m + " = " + t) + " min. b) " + M(t + " \\cdot 60 = " + N(60 * t)) + " s. c) " + M(t + " : 60 \\approx " + N(+(t / 60).toFixed(2))) + " h."); },
      () => { const dep = 60 * R.int(20, 22) + R.int(31, 58), dur = R.int(380, 560), arr = dep + dur;
        return P(null, "Un train de nuit part à " + horaire(dep) + " et arrive le lendemain à " + horaire(arr) + ".",
          [["a) Minutes jusqu'à minuit", 24 * 60 - dep], ["b) Durée du voyage en minutes", dur], ["c) Durée du voyage en heures (au centième)", dur / 60, 0.01]],
          ["Compte d'abord jusqu'à minuit (24 h 00), puis de minuit à l'arrivée.", "Heures décimales : minutes ÷ 60."],
          "a) " + M(24 * 60 - dep) + " min. b) " + M((24 * 60 - dep) + " + " + (arr - 24 * 60) + " = " + dur) + " min. c) " + M(dur + " : 60 \\approx " + N(+(dur / 60).toFixed(2))) + " h."); },
      () => { const t = 3600 * R.int(1, 4) + 60 * R.int(10, 50) + R.int(5, 55), h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s = t % 60;
        return P(null, "À l'arrivée d'une course de relais, l'ordinateur de chronométrage donne le temps total de l'équipe en secondes : " + M(N(t)) + " s. Écris-le en heures, minutes et secondes." /* 26.11 (revue p3, n° 14) : un chronomètre affiche h:min:s */,
          [["a) Nombre d'heures entières", h], ["b) Minutes restantes", m], ["c) Secondes restantes", s]],
          ["Une heure = 3600 s : combien de fois 3600 dans le total ?", "Le reste, divise-le par 60."],
          M(N(t) + " = " + h + " \\cdot 3600 + " + m + " \\cdot 60 + " + s) + " : " + hmsT(t) + "."); },
    ],
    ucomp: [
      () => P(null, "La lumière va à environ " + M("300\\text{'}000" + u("km/s")) + " et le son à environ " + M("18\\text{'}000" + u("m/min")) + ".",
          [["a) Vitesse du son en m/s", 300], ["b) Vitesse de la lumière en m/s", 3e8], ["c) Combien de fois la lumière est-elle plus rapide que le son ?", 1e6]],
          ["Son : une minute = 60 s. Lumière : 1 km = 1000 m.", "Pour comparer, divise les deux vitesses dans la même unité."],
          "a) " + M("18\\text{'}000 : 60 = 300") + " m/s. b) " + M("300\\text{'}000 \\cdot 1000 = 300\\text{'}000\\text{'}000") + " m/s. c) " + M("300\\text{'}000\\text{'}000 : 300 = 1\\text{'}000\\text{'}000") + " fois."),
      () => { const g = pickBy([30, 28, 31]), a = pickBy([80, 90, 72]), t = 10;
        return P(null, "Un guépard court à " + Q(g, "m/s") + " et une antilope à " + Q(a, "km/h") + ". Le guépard la poursuit pendant " + t + " s.",
          [["a) Vitesse de l'antilope en m/s (au centième)", a / 3.6, 0.01], ["b) Distance parcourue par le guépard en 10 s (m)", g * t], ["c) Mètres gagnés par le guépard en 10 s (au mètre)", (g - a / 3.6) * t, 1]],
          ["km/h → m/s : divise par 3,6.", "Distance gagnée = (vitesse du guépard − vitesse de l'antilope) × durée."],
          "a) " + M(a + " : 3{,}6 \\approx " + N(+(a / 3.6).toFixed(2))) + " m/s. b) " + M(g + " \\cdot 10 = " + g * t) + " m. c) " + M("(" + g + " - " + N(+(a / 3.6).toFixed(2)) + ") \\cdot 10 \\approx " + Math.round((g - a / 3.6) * t)) + " m."); },
      () => { const q = pickBy([1.5, 1.8, 2.1]), V = pickBy([45, 63, 72]);
        return P(null, "Une pompe vide une piscine de " + Q(V, "m^3") + " avec un débit de " + Q(q, "m^3/h") + ".",
          [["a) Débit en L/min", q * 1000 / 60], ["b) Durée de la vidange en heures", V / q], ["c) Durée de la vidange en jours (au dixième)", V / q / 24, 0.1]],
          ["1 m³ = 1000 L, 1 h = 60 min.", "Durée = volume ÷ débit."],
          "a) " + M(N(q * 1000) + " : 60 = " + N(q * 1000 / 60)) + " L/min. b) " + M(V + " : " + N(q) + " = " + N(V / q)) + " h. c) " + M(N(V / q) + " : 24 \\approx " + N(+(V / q / 24).toFixed(1))) + " jours."); },
    ],
    vitesse: [
      () => { const d = 10 * R.int(6, 18), v1 = pickBy([60, 80, 90, 100, 120]), v2 = pickBy([40, 50, 60, 75].filter((v) => v !== v1)), t1 = d / v1, t2 = d / v2, vm = (2 * d) / (t1 + t2);
        return P(undefined, "Une voiture fait l'aller de " + M(d) + " km à " + M(v1) + " km/h et le retour à " + M(v2) + " km/h.",
          [["a) Durée de l'aller (min)", t1 * 60, 0.01], ["b) Durée du retour (min)", t2 * 60, 0.01], ["c) Vitesse moyenne sur l'aller-retour (km/h, au centième)", vm, 0.01]],
          ["La vitesse moyenne n'est pas la moyenne des vitesses : c'est la distance totale divisée par la durée totale.", "t = d / v pour chaque trajet ; v moyenne = " + 2 * d + " km / (durée aller + durée retour)."],
          "a) " + M(N(+(t1 * 60).toFixed(2))) + " min. b) " + M(N(+(t2 * 60).toFixed(2))) + " min. c) " + M("\\frac{" + 2 * d + "}{" + N(+(t1 + t2).toFixed(4)) + "} \\approx " + N(+vm.toFixed(2))) + " km/h (et non " + String((v1 + v2) / 2).replace(".", ",") + ")."); },
      () => { const dep = 60 * R.int(6, 9) + pickBy([12, 18, 24, 36, 42, 48]), dur = pickBy([135, 150, 165, 105]), v = pickBy([84, 92, 76, 88]), d = v * dur / 60, arr = dep + dur;
        return P(null, "Un train part à " + horaire(dep) + " et arrive à " + horaire(arr) + " après avoir parcouru " + Q(d, "km") + ".",
          [["a) Durée du trajet en minutes", dur], ["b) Durée en heures (nombre décimal)", dur / 60], ["c) Vitesse moyenne en km/h", v], ["d) Vitesse moyenne en m/s (au dixième)", v / 3.6, 0.1]],
          ["Complète jusqu'à l'heure pleine, puis ajoute.", "v = d ÷ t avec t en heures ; puis km/h → m/s : divise par 3,6."],
          "a) " + hmT(dur) + " = " + dur + " min. b) " + M(dur + " : 60 = " + N(dur / 60)) + " h. c) " + M(N(d) + " : " + N(dur / 60) + " = " + v) + " km/h. d) " + M(v + " : 3{,}6 \\approx " + N(+(v / 3.6).toFixed(1))) + " m/s."); },
      () => { const t1 = pickBy([1.3, 1.2, 1.4]), mn = 8, s = pickBy([20, 10, 30]), T = 60 * mn + s;
        return P(null, "La lumière va à environ " + M("300\\text{'}000" + u("km/s")) + ".",
          [["a) Elle met " + N(t1).replace("{,}", ",") + " s d'un satellite à la Terre : distance (km)", 300000 * t1], ["b) Elle met " + mn + " min " + s + " s pour venir du Soleil : durée en secondes", T], ["c) Distance Terre–Soleil (km)", 300000 * T]],
          ["d = v · t, avec t en secondes.", "8 min = 480 s."],
          "a) " + M("300\\text{'}000 \\cdot " + N(t1) + " = " + N(300000 * t1)) + " km. b) " + M(mn + " \\cdot 60 + " + s + " = " + T) + " s. c) " + M("300\\text{'}000 \\cdot " + T + " = " + N(300000 * T)) + " km (environ 150 millions de km)."); },
      () => { const v = 100 / 9.58, d = 42195, t = d / v;
        return P(null, "Usain Bolt a couru le 100 m en " + M("9{,}58" + u("s")) + ". Un marathon mesure " + M("42\\text{'}195" + u("m")) + ".",
          [["a) Vitesse de Bolt en m/s (au centième)", v, 0.01], ["b) Durée d'un marathon à cette vitesse, en secondes (à l'unité)", t, 1], ["c) Combien de minutes entières (après l'heure) ?", Math.floor((t - 3600) / 60)]],
          ["v = d ÷ t.", "t = d ÷ v ; puis 1 h = 3600 s, le reste en minutes."],
          "a) " + M("100 : 9{,}58 \\approx 10{,}44") + " m/s. b) " + M("42\\text{'}195 : 10{,}438 \\approx " + N(Math.round(t))) + " s. c) " + hmsT(Math.round(t)) + " (le vrai record est d'environ 2 h)."); },
    ],
    gquot: [
      () => { const d = pickBy([22, 24, 20]), e = pickBy([1.3, 1.5, 2]), V = Math.PI * (d / 20) ** 2 * (e / 10), m = V * 19.3;
        return P(null, "Bob le pirate a trouvé des pièces qui ont l'air d'être en or. Une pièce a un diamètre de " + Q(d, "mm") + " et une épaisseur de " + Q(e, "mm") + ". L'or a une masse volumique de " + M("19{,}3" + u("g/cm^3")) + ".",
          [["a) Rayon de la pièce en cm", d / 20], ["b) Volume de la pièce en cm³ (au centième)", V, 0.01], ["c) Masse qu'elle doit avoir si elle est en or (g, au dixième)", m, 0.1]],
          ["Passe tout en cm : 10 mm = 1 cm. La pièce est un cylindre : V = π r² h.", "m = ρ · V."],
          "a) " + M(N(d / 20)) + " cm. b) " + M("\\pi \\cdot " + N(d / 20) + "^2 \\cdot " + N(e / 10) + " \\approx " + N(+V.toFixed(2))) + " cm³. c) " + M("19{,}3 \\cdot " + N(+V.toFixed(2)) + " \\approx " + N(+m.toFixed(1))) + " g. Si elle pèse moins, ce n'est pas de l'or massif."); },
      () => { const m = pickBy(MET.slice(0, 6)), L = pickBy([20, 25, 30]), l = pickBy([4, 5, 6]), h = pickBy([2, 3]), V = L * l * h, mass = r6(m[1] * V);
        return P(FIG.box(L + " cm", l + " cm", h + " cm"), "Une barre métallique (pavé droit) mesure " + Q(L, "cm") + " sur " + Q(l, "cm") + " sur " + Q(h, "cm") + " et a une masse de " + Q(mass / 1000, "kg") + ".",
          [["a) Volume en cm³", V], ["b) Masse en g", mass], ["c) Masse volumique en g/cm³", m[1]]],
          ["Volume d'un pavé : L · l · h.", "ρ = m ÷ V, avec m en g et V en cm³. Compare : alu 2,7 ; fer 7,9 ; cuivre 8,9 ; argent 10,5 ; plomb 11,3 ; or 19,3."],
          "a) " + M(L + " \\cdot " + l + " \\cdot " + h + " = " + V) + " cm³. b) " + Q(mass, "g") + ". c) " + M(N(mass) + " : " + V + " = " + N(m[1])) + " g/cm³ : c'est une barre " + m[0] + "."); },
      () => { const L = pickBy([60, 80, 100]), l = pickBy([30, 40]), h = pickBy([35, 40, 50]), q = pickBy([6, 8, 12]), V = L * l * h / 1000, vide = pickBy([18, 23, 27, 35]);
        return P(FIG.box(L + " cm", l + " cm", h + " cm"), "Un aquarium (pavé droit) mesure " + Q(L, "cm") + " sur " + Q(l, "cm") + " et " + Q(h, "cm") + " de haut. On le remplit avec un robinet qui débite " + Q(q, "L/min") + ".",
          [["a) Volume de l'aquarium en litres", V], ["b) Durée du remplissage en minutes", V / q], ["c) L'aquarium vide pèse " + vide + " kg. Masse totale une fois plein (kg) ? (1 L d'eau pèse 1 kg)", V + vide]],
          ["1 L = 1 dm³ = 1000 cm³.", "Durée = volume ÷ débit."],
          "a) " + M(L + " \\cdot " + l + " \\cdot " + h + " = " + N(L * l * h)) + " cm³ = " + Q(V, "L") + ". b) " + M(N(V) + " : " + q + " = " + N(V / q)) + " min. c) " + M(N(V) + " + " + vide + " = " + N(V + vide)) + " kg."); },
    ],
  };

  // ===================== Enregistrement =====================
  const ALL = { utemps: UTEMPS, ucomp: UCOMP, vitesse: VIT, gquot: GQ };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => pickBy(lv[Math.min(Math.max(d, 1), 3)])();
    if (typeof VAR !== "undefined") VAR[id] = {}; // les formes sont toutes ici
    if (typeof PROB !== "undefined") delete PROB[id];
    PROB_EXTRA[id] = PROBS[id];
  }
  // Libellé : la vitesse a sa propre notion ; gquot = masse volumique et débit (11FA1.03–05).
  { const n = NOTIONS.find((x) => x.id === "gquot"); if (n) Object.assign(n, { label: "Masse volumique et débit", ex: "\\rho = \\frac{m}{V}, \\; \\text{débit} = \\frac{V}{t}" }); }
  Object.assign(HINTS_EXTRA, {
    utemps: "Le temps se compte par 60 : 1 h = 60 min, 1 min = 60 s. 1,5 h = 1 h 30 min, pas 1 h 50.",
    ucomp: "Convertis chaque unité séparément : combien de mètres en une heure ? puis en une seconde ? (km/h → m/s : divise par 3,6.)",
    vitesse: "v = d ÷ t, d = v · t, t = d ÷ v. Écris la durée en heures décimales (1 h 45 min = 1,75 h).",
    gquot: "Masse volumique : ρ = m ÷ V (masse d'un cm³ ou d'un m³). Débit : volume ÷ durée. Vérifie que les unités vont ensemble.",
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    utemps: ["Convertir des durées (h, min, s)", "Passer des heures décimales aux minutes", "Calculer une durée, écrire en h min s"],
    ucomp: ["Convertir une vitesse (km/h, m/s)", "Convertir une masse volumique ou un débit", "Comparer des grandeurs dans des unités différentes"],
    vitesse: ["Calculer une vitesse, une distance ou une durée", "Calculer avec des durées en h et min", "Calculer une vitesse moyenne"],
    gquot: ["Utiliser la masse volumique", "Masse volumique avec conversions", "Utiliser un débit"],
  });
})();
