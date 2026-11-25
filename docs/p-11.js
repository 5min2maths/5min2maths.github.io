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
          { ctx: c[1], guide: [GS("Une minute, c'est un soixantième d'heure. Combien d'heures font " + M(m + u("min")) + " ? (divise par 60)", r6(m / 60), M(m + " : 60 = " + N(r6(m / 60))) + " h."), GS("Ajoute les " + M(h) + " heures : durée en heures ?", v, M(h + " + " + N(r6(m / 60)) + " = " + N(v)) + " h.")],
            traps: [TRAP(r6(h + m / 100), "Ce n'est pas " + h + "," + two(m) + " h : " + m + " min, c'est " + m + "/60 d'heure.")] }); },
      () => { const s = 6 * R.int(1, 9), m = R.int(2, 14), v = r6(m + s / 60);
        return Qv("Écris " + M(m + u("min") + "\\ " + s + u("s")) + " en minutes (nombre décimal).", v, M(s + u("s") + " = \\frac{" + s + "}{60}" + u("min") + " = " + N(r6(s / 60)) + u("min")) + ", donc " + Q(v, "min") + ".",
          { ctx: "conv-s", guide: [GS("Combien de minutes font " + M(s + u("s")) + " ? (divise par 60)", r6(s / 60), M(s + " : 60 = " + N(r6(s / 60))) + " min."), GS("Durée totale en minutes ?", v, M(m + " + " + N(r6(s / 60)) + " = " + N(v)) + " min.")],
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
      () => { const m = pickBy([5, 10, 25, 35, 40, 50, 55, 20]), h = R.int(1, 4), v = h + m / 60, c = pickBy([["Un épisode de série dure", "serie"], ["Le cours de piano a duré", "piano"], ["Le trajet Genève–Berne dure", "geneve"]]);
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
          { ctx: c[2], guide: [GS("Combien de " + M("\\text{cm}^3") + " dans " + M("1" + u("m^3")) + " ? (100 cm de côté)", 1e6, M("100 \\cdot 100 \\cdot 100 = 1\\text{'}000\\text{'}000") + "."), GS("Masse de " + M("1" + u("m^3")) + " en grammes ?", g * 1e6, M(N(g) + " \\cdot 1\\text{'}000\\text{'}000 = " + N(g * 1e6)) + " g."), GS("En kg : c'est la masse volumique en " + M("\\text{kg/m}^3") + ".", r6(g * 1000), M(N(g * 1e6) + " : 1000 = " + N(g * 1000)) + " kg.")],
            traps: [TRAP(r6(g * 1e6), "Ça, ce sont des grammes par m³ : il faut encore passer en kg."), TRAP(r6(g / 1000), "Un m³ est bien plus grand qu'un cm³ : le nombre doit augmenter.")] }); },
      () => { const c = pickBy([["Un robinet", 12, "robinet"], ["Une pompe d'arrosage", 25, "pompe"], ["Une fontaine", 40, "fontaine"], ["Une lance d'incendie", 350, "pompier"]]), q = c[1], m3h = r6(q * 60 / 1000);
        return Qv(c[0] + " a un débit de " + Q(q, "L/min") + ". Exprime ce débit en " + M("\\text{m}^3\\text{/h}") + ".", m3h,
          "En une heure : " + M(q + " \\cdot 60 = " + N(q * 60)) + " L. " + M("1" + u("m^3") + " = 1000" + u("L")) + ", donc " + M(N(q * 60) + " : 1000 = " + N(m3h)) + " m³/h.",
          { ctx: c[2], guide: [GS("Combien de litres en une heure ?", q * 60, M(q + " \\cdot 60 = " + N(q * 60)) + " L."), GS("Un mètre cube = 1000 L. Débit en m³/h ?", m3h, M(N(q * 60) + " : 1000 = " + N(m3h)) + " m³/h.")],
            traps: [TRAP(q * 60, "C'est en litres par heure : il faut encore passer en m³."), TRAP(r6(q / 1000 / 60), "En une heure il coule 60 fois plus qu'en une minute : on multiplie par 60.")] }); },
      () => { const c = pickBy([["L'eau de mer", 1025, "mer"], ["Le béton", 2400, "beton"], ["La glace", 920, "glace"], ["Le granit", 2700, "granit"], ["Le bois de chêne", 750, "chene"]]), k = c[1];
        return Qv(c[0] + " a une masse volumique de " + Q(k, "kg/m^3") + ". Exprime-la en " + M("\\text{g/cm}^3") + ".", r6(k / 1000),
          M("1" + u("m^3")) + " pèse " + Q(k * 1000, "g") + " et contient " + M("1\\text{'}000\\text{'}000" + u("cm^3")) + ". Un cm³ pèse donc " + M(N(k * 1000) + " : 1\\text{'}000\\text{'}000 = " + N(k / 1000)) + " g.",
          { ctx: c[2], guide: [GS("Masse de " + M("1" + u("m^3")) + " en grammes ?", k * 1000, Q(k, "kg") + " = " + Q(k * 1000, "g") + "."), GS("Un m³ = 1'000'000 cm³. Masse d'un cm³ (en g) ?", r6(k / 1000), M(N(k * 1000) + " : 1\\text{'}000\\text{'}000 = " + N(k / 1000)) + " g.")],
            traps: [TRAP(k * 1000, "Un cm³ est bien plus petit qu'un m³ : le nombre doit diminuer."), TRAP(r6(k / 1e6), "Passe aussi les kg en g (× 1000).")] }); },
    ],
    3: [
      () => { const a = pickBy([[14, 56, "Un chamois", "un lièvre", "montagne"], [25, 85, "Un faucon en piqué", "un pigeon", "oiseaux"], [11, 36, "Un cycliste", "un scooter", "route"], [9, 30, "Une coureuse", "un trottinettiste", "parc"]]), ms = a[0], kmh = a[1], d = r6(Math.abs(ms * 3.6 - kmh));
        if (d === 0) return UCOMP[3][0]();
        const fast = ms * 3.6 > kmh ? a[2] : a[3];
        return Qv(a[2] + " va à " + Q(ms, "m/s") + " et " + a[3] + " à " + Q(kmh, "km/h") + ". Quelle est la différence entre leurs vitesses, en km/h ?", d,
          M(ms + u("m/s") + " = " + ms + " \\cdot 3{,}6 = " + N(ms * 3.6) + u("km/h")) + ". Différence : " + M(N(Math.max(ms * 3.6, kmh)) + " - " + N(Math.min(ms * 3.6, kmh)) + " = " + N(d)) + " km/h (le plus rapide : " + fast.toLowerCase() + ").",
          { ctx: a[4], guide: [GS("Pour comparer, il faut la même unité. Convertis " + Q(ms, "m/s") + " en km/h.", r6(ms * 3.6), M(ms + " \\cdot 3{,}6 = " + N(ms * 3.6)) + " km/h."), GS("Différence des vitesses en km/h ?", d, M(N(Math.max(ms * 3.6, kmh)) + " - " + N(Math.min(ms * 3.6, kmh)) + " = " + N(d)) + " km/h.")],
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
          { ctx: c[5], fig: c[1] === "km" ? FIG.road(N(d).replace("\\text{'}", "'") + " km", t + " h", c[5]) : undefined,
            guide: [GS("La vitesse est la distance parcourue en une unité de temps : " + M("v = \\frac{d}{t}") + ". Calcule " + M(N(d) + " : " + t) + ".", v, M(N(d) + " : " + t + " = " + N(v)) + " " + c[6] + ".")],
            traps: [TRAP(d * t, "On ne multiplie pas : la vitesse, c'est la distance divisée par la durée."), TRAP(r6(t / d), "C'est l'inverse : distance divisée par durée.")] }); },
      () => { const c = pickBy([["Pendant un orage, on entend le tonnerre", "s", "après avoir vu l'éclair. Le son va à 340 m/s. À quelle distance (en m) la foudre est-elle tombée ?", 340, [3, 4, 5, 6, 7, 9], "m", "orage"], ["Un train roule à 120 km/h pendant", "h", ". Quelle distance parcourt-il (en km) ?", 120, [1.5, 2.5, 3.5, 0.75], "km", "train"], ["Une hirondelle vole à 15 m/s pendant", "s", ". Quelle distance parcourt-elle (en m) ?", 15, [12, 25, 40, 75], "m", "oiseau"]]);
        const t = pickBy(c[4]), v = c[3], d = r6(v * t);
        return Qv(c[0] + " " + Q(t, c[1]) + " " + c[2], d, M("d = v \\cdot t = " + v + " \\cdot " + N(t) + " = " + N(d)) + " " + c[5] + ".",
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
          { ctx: c[3], guide: [GS("Écris " + hmT(min) + " en heures (nombre décimal).", r6(min / 60), M((min % 60) + " : 60 = " + N(r6((min % 60) / 60))) + ", donc " + Q(r6(min / 60), "h") + "."), GS("Vitesse en km/h ?", v, M(N(d) + " : " + N(r6(min / 60)) + " = " + v) + " km/h.")],
            traps: [TRAP(r6(d / (Math.floor(min / 60) + (min % 60) / 100)), "Attention : " + hmT(min) + " n'est pas " + Math.floor(min / 60) + "," + two(min % 60) + " h. Divise les minutes par 60.")] }); },
      () => { const v = pickBy([72, 90, 84, 96, 66]), min = pickBy([25, 35, 40, 50, 55]), d = r6(v * min / 60), c = pickBy([["Une voiture roule à", "voiture"], ["Un train roule à", "train"], ["Un bus express roule à", "bus"]]);
        return Qv(c[0] + " " + Q(v, "km/h") + ". Combien de minutes lui faut-il pour parcourir " + Q(d, "km") + " ?", min,
          M("t = \\frac{" + N(d) + "}{" + v + "} = " + N(r6(d / v))) + " h, soit " + M(N(r6(d / v)) + " \\cdot 60 = " + min) + " min. (Ou : " + v + " km/h = " + N(r6(v / 60)).replace("{,}", ",") + " km par minute.)",
          { ctx: c[1], guide: [GS("Combien de km parcourt-on en une minute ? (" + M(v + " : 60") + ")", r6(v / 60), M(v + " : 60 = " + N(r6(v / 60))) + " km par minute."), GS("Combien de minutes pour " + Q(d, "km") + " ?", min, M(N(d) + " : " + N(r6(v / 60)) + " = " + min) + " min.")],
            traps: [TRAP(r6(d / v), "Ça, c'est la durée en heures. La question demande des minutes."), TRAP(r6(d / v * 100), "Une heure vaut 60 minutes, pas 100.")] }); },
      () => { const v = pickBy([85, 75, 95, 65]), min = pickBy([144, 108, 132, 156]), d = r6(v * min / 60), c = pickBy([["Un camion roule à", "camion"], ["Un bateau à moteur file à", "bateau"], ["Un car de touristes roule à", "car"]]);
        return Qv(c[0] + " " + Q(v, "km/h") + " pendant " + hmT(min) + ". Quelle distance parcourt-il (en km) ?", d,
          hmT(min) + " = " + Q(r6(min / 60), "h") + ". " + M("d = " + v + " \\cdot " + N(r6(min / 60)) + " = " + N(d)) + " km.",
          { ctx: c[1], guide: [GS("Écris " + hmT(min) + " en heures (nombre décimal).", r6(min / 60), M((min % 60) + " : 60 = " + N(r6((min % 60) / 60))) + ", donc " + Q(r6(min / 60), "h") + "."), GS("Distance : " + M("d = v \\cdot t") + " ?", d, M(v + " \\cdot " + N(r6(min / 60)) + " = " + N(d)) + " km.")],
            traps: [TRAP(r6(v * (Math.floor(min / 60) + (min % 60) / 100)), "Attention : " + hmT(min) + " n'est pas " + Math.floor(min / 60) + "," + two(min % 60) + " h.")] }); },
      () => { const c = pickBy([[4, "Un escargot avance à", "mm/s", "escargot"], [8, "Une chenille avance à", "mm/s", "chenille"], [5, "Un glacier de montagne avance de", "cm/jour", "glacier"]]);
        if (c[2] === "cm/jour") { const j = pickBy([30, 365, 120]), d = r6(c[0] * j / 100); return Qv(c[1] + " " + Q(c[0], "cm") + " par jour. De combien de mètres avance-t-il en " + j + " jours ?", d, M(c[0] + " \\cdot " + j + " = " + c[0] * j) + " cm = " + Q(d, "m") + ".", { ctx: c[3], guide: [GS("Combien de cm en " + j + " jours ?", c[0] * j, M(c[0] + " \\cdot " + j + " = " + c[0] * j) + " cm."), GS("En mètres ?", d, M(c[0] * j + " : 100 = " + N(d)) + " m.")], traps: [TRAP(c[0] * j, "C'est en centimètres : 1 m = 100 cm.")] }); }
        const d = r6(c[0] * 3600 / 1000);
        return Qv(c[1] + " " + Q(c[0], c[2]) + ". Quelle distance parcourt-il en une heure (en m) ?", d, "Une heure = 3600 s : " + M(c[0] + " \\cdot 3600 = " + N(c[0] * 3600)) + " mm = " + Q(d, "m") + ".",
          { ctx: c[3], guide: [GS("Combien de mm en une heure (3600 s) ?", c[0] * 3600, M(c[0] + " \\cdot 3600 = " + N(c[0] * 3600)) + " mm."), GS("En mètres (1 m = 1000 mm) ?", d, M(N(c[0] * 3600) + " : 1000 = " + N(d)) + " m.")], traps: [TRAP(c[0] * 60 / 1000, "Une heure vaut 3600 secondes, pas 60."), TRAP(c[0] * 3600, "C'est en millimètres : 1 m = 1000 mm.")] }); },
    ],
    3: [
      () => { const [v1, v2, dd] = pickBy([[40, 60, 120], [60, 120, 120], [30, 60, 60], [60, 90, 180], [40, 120, 120], [60, 40, 240], [90, 60, 180], [80, 120, 240]]), tt = dd / v1 + dd / v2, vm = (2 * dd) / tt, c = pickBy([["Une voiture fait un aller", "voiture"], ["Un motard fait un aller", "moto"], ["Une cycliste fait un aller", "velo"]]);
        const V1 = c[1] === "velo" ? v1 / 4 : v1, V2 = c[1] === "velo" ? v2 / 4 : v2, D = c[1] === "velo" ? dd / 4 : dd;
        return Qv(c[0] + " de " + Q(D, "km") + " à " + Q(V1, "km/h") + " et le retour à " + Q(V2, "km/h") + ". Quelle est sa vitesse moyenne sur l'aller-retour (en km/h) ?", (2 * D) / (D / V1 + D / V2),
          "Durées : " + M(N(D) + " : " + N(V1) + " = " + N(r6(D / V1))) + " h et " + M(N(D) + " : " + N(V2) + " = " + N(r6(D / V2))) + " h. Total " + M(N(r6(D / V1 + D / V2))) + " h pour " + M(N(2 * D)) + " km : " + M("v = " + N(r6(vm * D / dd))) + " km/h (et non la moyenne des deux vitesses).",
          { ctx: c[1], fig: FIG.road(N(D) + " km", "aller-retour", c[1]),
            guide: [GS("Durée de l'aller (en h) ?", r6(D / V1), M(N(D) + " : " + N(V1) + " = " + N(r6(D / V1))) + " h."), GS("Durée du retour (en h) ?", r6(D / V2), M(N(D) + " : " + N(V2) + " = " + N(r6(D / V2))) + " h."), GS("Vitesse moyenne = distance totale ÷ durée totale. Combien ?", (2 * D) / (D / V1 + D / V2), M(N(2 * D) + " : " + N(r6(D / V1 + D / V2)) + " = " + N(r6(vm * D / dd))) + " km/h.")],
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
          { ctx: m[2], fig: FIG.cube(""), guide: [GS("La masse volumique est la masse d'un cm³ : " + M("\\rho = \\frac{m}{V}") + ". Calcule " + M(N(mass) + " : " + V) + ".", m[1], M(N(mass) + " : " + V + " = " + N(m[1])) + " g/cm³.")],
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
      { ctx: "erreur", guide: [GS("Écris 1 h " + mn + " min en heures décimales.", r6(1 + mn / 60), M(mn + " : 60 = " + N(r6(mn / 60))) + ", donc " + M(N(r6(1 + mn / 60))) + " h."), GS("Bonne vitesse ?", v, M(N(d) + " : " + N(r6(1 + mn / 60)) + " = " + v) + " km/h.")],
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
        return P(null, "Le chronomètre d'une course de relais affiche " + M(N(t)) + " secondes.",
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
        return P(FIG.road(d + " km", v1 + " km/h → " + v2 + " km/h"), "Une voiture fait l'aller de " + M(d) + " km à " + M(v1) + " km/h et le retour à " + M(v2) + " km/h.",
          [["a) Durée de l'aller (min)", t1 * 60, 0.01], ["b) Durée du retour (min)", t2 * 60, 0.01], ["c) Vitesse moyenne sur l'aller-retour (km/h, au centième)", vm, 0.01]],
          ["La vitesse moyenne n'est pas la moyenne des vitesses : c'est la distance totale divisée par la durée totale.", "t = d / v pour chaque trajet ; v moyenne = " + 2 * d + " km / (durée aller + durée retour)."],
          "a) " + M(N(+(t1 * 60).toFixed(2))) + " min. b) " + M(N(+(t2 * 60).toFixed(2))) + " min. c) " + M("\\frac{" + 2 * d + "}{" + N(+(t1 + t2).toFixed(4)) + "} \\approx " + N(+vm.toFixed(2))) + " km/h (et non " + (v1 + v2) / 2 + ")."); },
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

// Chantier 11e · 5. Calcul littéral (15.11) : une seule source pour litelab, valnum, reduire, monomes, parenth,
// distrib (calcul littéral 1) et idrem, factor (calcul littéral 2). Même standard que ch11_prop.js : au moins
// 3 formes par niveau, pas à pas (guide) sur toutes les questions, erreurs typiques (traps : { e: expression }
// ou { v: valeur }), étiquette ctx ; défi = problèmes en plusieurs étapes. Réponses littérales contrôlées par
// équivalence et par la forme demandée (reduced : réduit ; product + minFactors : factorisé au maximum).
(function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; };
  const gcd2 = (a, b) => (b ? gcd2(b, a % b) : Math.abs(a));
  // ---------- polynômes : liste de termes [coef, { lettre: exposant }] ----------
  const key = (v) => Object.keys(v).filter((k) => v[k]).sort().map((k) => k + v[k]).join("");
  const deg = (v) => Object.values(v).reduce((s, p) => s + p, 0);
  const norm = (L) => { const m = new Map(); for (const [c, v] of L) { const k = key(v); const o = m.get(k); m.set(k, o ? [o[0] + c, o[1]] : [c, { ...v }]); }
    return [...m.values()].filter(([c]) => Math.abs(c) > 1e-12).sort((a, b) => deg(b[1]) - deg(a[1]) || key(a[1]).localeCompare(key(b[1]))); };
  const mulP = (A, B) => norm(A.flatMap(([c, v]) => B.map(([d, w]) => { const u = { ...v }; for (const k in w) u[k] = (u[k] || 0) + w[k]; return [c * d, u]; })));
  const addP = (...Ls) => norm(Ls.flat());
  const neg = (L) => L.map(([c, v]) => [-c, v]);
  const sc = (k, L) => L.map(([c, v]) => [k * c, v]);
  const lit = (v, tex) => Object.keys(v).filter((k) => v[k]).sort().map((k) => k + (v[k] > 1 ? (tex ? "^{" + v[k] + "}" : "^" + v[k]) : "")).join(tex ? "" : "*");
  const cTex = (c) => (Number.isInteger(c) ? String(Math.abs(c)) : dec(Math.abs(c)));
  const tex = (L) => !L.length ? "0" : L.map(([c, v], i) => { const l = lit(v, true), s = c < 0 ? (i ? " - " : "-") : i ? " + " : "";
    return s + (l ? (Math.abs(c) === 1 ? "" : cTex(c)) + l : cTex(c)); }).join("");
  const plain = (L) => !L.length ? "0" : L.map(([c, v]) => { const l = lit(v, false); return (c < 0 ? "-" : "+") + (l ? Math.abs(c) + "*" + l : Math.abs(c)); }).join("").replace(/^\+/, "");
  const X1 = (c, v = { x: 1 }) => [[c, v]];
  const lin = (a, b, x = "x") => norm([[a, { [x]: 1 }], [b, {}]]); // ax + b
  const raw = (terms) => terms.map(([c, s], i) => (c < 0 ? (i ? " - " : "-") : i ? " + " : "") + (s ? (Math.abs(c) === 1 ? "" : Math.abs(c)) + s : Math.abs(c))).join(""); // écriture non réduite
  const par = (t) => "(" + t + ")";
  const sg = (n) => (n < 0 ? "-" : "+");
  // ---------- constructeurs de questions ----------
  const Qx = (q, L, sol, o = {}) => { const e = typeof L === "string" ? L : plain(L);
    const x = { q, spec: Object.assign({ kind: "expr", expr: e }, o.form ? { form: o.form } : {}, o.minFactors ? { minFactors: o.minFactors } : {}), sol };
    if (o.guide) x.guide = o.guide; if (o.ctx) x.ctx = o.ctx; if (o.fig) x.fig = o.fig;
    // Un piège qui coïncide avec la bonne réponse (cas particuliers des nombres tirés) est retiré.
    let target = null; try { target = Expr.parse(e); } catch (er) {}
    x.traps = (o.traps || []).filter((tr) => { try { return !target || !Expr.equivalent(Expr.parse(tr.e), target); } catch (er) { return false; } });
    return x; };
  const Qn = (q, value, sol, o = {}) => { const x = QV(q, value, sol, o.fig ? { fig: o.fig } : {}); if (o.guide) x.guide = o.guide; x.traps = o.traps || []; if (o.ctx) x.ctx = o.ctx; return x; };
  const GX = (ask, L, sol, form) => ({ ask, spec: Object.assign({ kind: "expr", expr: typeof L === "string" ? L : plain(L) }, form ? { form } : {}), sol });
  const TX = (L, m) => ({ e: typeof L === "string" ? L : plain(L), m });
  const red = { form: "reduced" };
  const MULT = ["", "", "le double", "le triple", "le quadruple", "le quintuple"];

  // ===================== litelab : écrire une expression littérale =====================
  const LIT = {
    1: [
      () => { const m = R.int(2, 5), k = R.int(2, 9), up = R.rand() < 0.5, L = lin(m, up ? k : -k);
        return Qx("Écris l'expression littérale : « " + MULT[m] + " de " + M("x") + ", " + (up ? "augmenté" : "diminué") + " de " + k + " ».", L, M(tex(L)) + " : on prend d'abord " + MULT[m] + " de " + M("x") + " (" + M(m + "x") + "), puis on " + (up ? "ajoute" : "retire") + " " + k + ".",
          { ctx: "phrase", guide: [GX("Écris d'abord « " + MULT[m] + " de " + M("x") + " ».", X1(m), M(m + "x") + "."), GX("Puis " + (up ? "ajoute" : "retire") + " " + k + " :", L, M(tex(L)) + ".")],
            traps: [TX(m + "*(x" + (up ? "+" : "-") + k + ")", "Avec des parenthèses, on " + (up ? "ajouterait" : "retirerait") + " " + k + " avant de multiplier. Ici, on multiplie d'abord " + M("x") + ", puis on " + (up ? "ajoute" : "retire") + ".")] }); },
      () => { const m = R.int(2, 5), k = R.int(2, 9), y = pk(["x", "y", "a"]), e = m + "*(" + y + "+" + k + ")";
        return Qx("Écris l'expression littérale : « " + MULT[m] + " de la somme de " + M(y) + " et de " + k + " ».", e, M(m + "(" + y + " + " + k + ")") + " : la somme est calculée d'abord, donc entre parenthèses.",
          { ctx: "phrase-somme", guide: [GX("Écris d'abord « la somme de " + M(y) + " et de " + k + " ».", y + "+" + k, M(y + " + " + k) + "."), GX("Prends " + MULT[m] + " de cette somme (avec des parenthèses) :", e, M(m + "(" + y + " + " + k + ")") + ".")],
            traps: [TX(m + "*" + y + "+" + k, "Sans parenthèses, seul " + M(y) + " est multiplié. Ici, c'est toute la somme qu'on multiplie : " + M(m + "(" + y + " + " + k + ")") + ".")] }); },
      () => { const c = pk([["le produit de x et du carré de y", "x*y^2", "x y^2", "(x*y)^2", "Ici seul y est au carré : x · y²."], ["le carré du produit de x et de y", "(x*y)^2", "(x y)^2", "x*y^2", "C'est tout le produit qui est au carré : (xy)²."], ["la somme des carrés de a et de b", "a^2+b^2", "a^2 + b^2", "(a+b)^2", "On élève chaque nombre au carré, puis on additionne."], ["le carré de la somme de a et de b", "(a+b)^2", "(a + b)^2", "a^2+b^2", "On additionne d'abord, puis on élève la somme au carré."]]);
        return Qx("Écris l'expression littérale : « " + c[0].replace(/ (x|y|a|b)( |$)/g, " \\($1\\)$2") + " ».", c[1], M(c[2]) + ". " + c[4],
          { ctx: "carre", guide: [GX("Le début de la phrase donne l'opération faite en dernier. Écris l'expression.", c[1], M(c[2]) + ". " + c[4])], traps: [TX(c[3], c[4])] }); },
    ],
    2: [
      () => { const c = pk([["le nombre entier qui suit n", "n+1", "n + 1", "n*1"], ["le nombre pair qui suit 2n", "2*n+2", "2n + 2", "2*n+1"], ["la somme de trois nombres entiers consécutifs, le plus petit étant n", "3*n+3", "n + (n + 1) + (n + 2) = 3n + 3", "3*n"], ["le nombre impair qui suit 2n + 1", "2*n+3", "2n + 3", "2*n+2"], ["le produit d'un nombre entier n et de son successeur", "n*(n+1)", "n(n + 1)", "n+n+1"]]);
        return Qx("Avec " + M("n") + " un nombre entier, écris " + c[0].replace(/ (n|2n|2n \+ 1)( |$)/g, " \\($1\\)$2") + ".", c[1], M(c[2]) + ".",
          { ctx: "entiers", guide: [GX("Écris l'expression (essaie avec n = 5 pour vérifier).", c[1], M(c[2]) + ".")], traps: [TX(c[3], "Essaie avec n = 5 : ton expression ne donne pas le bon nombre.")] }); },
      () => { const k = R.int(2, 9), w = pk(["x", "a"]), P = norm([[4, { [w]: 1 }], [2 * k, {}]]);
        return Qx("Un rectangle a une largeur " + M(w) + " et une longueur " + M(w + " + " + k) + ". Écris son périmètre sous forme réduite.", P, M("2 \\cdot " + w + " + 2(" + w + " + " + k + ") = " + tex(P)) + ".",
          { ...red, ctx: "perim", fig: FIG.rectFig(9, 5, w + " + " + k, w), guide: [GX("Additionne les quatre côtés : " + M(w + " + " + w + " + (" + w + " + " + k + ") + (" + w + " + " + k + ")") + ". Réduis.", P, M(tex(P)) + ".", "reduced")],
            traps: [TX(w + "*(" + w + "+" + k + ")", "Ça, c'est l'aire. Le périmètre est la longueur du tour : on additionne les côtés."), TX("2*" + w + "+" + k, "Ça, c'est un demi-périmètre (une largeur et une longueur).")] }); },
      () => { const k = R.int(2, 9), e = "x*(x+" + k + ")";
        return Qx("Un rectangle a une largeur " + M("x") + " et une longueur " + M("x + " + k) + ". Écris son aire.", e, M("A = x(x + " + k + ") = x^2 + " + k + "x") + ".",
          { ctx: "aire", fig: FIG.rectFig(9, 5, "x + " + k, "x"), guide: [GX("Aire = longueur · largeur. Écris-la.", e, M("x(x + " + k + ")") + " (ou, développé, " + M("x^2 + " + k + "x") + ").")],
            traps: [TX("4*x+" + 2 * k, "Ça, c'est le périmètre. L'aire est le produit longueur · largeur."), TX("x*x+" + k, "Il faut des parenthèses : c'est toute la longueur " + M("x + " + k) + " qu'on multiplie par " + M("x") + ".")] }); },
    ],
    3: [
      () => { const a = R.int(2, 9), m = R.int(2, 5), drop = R.rand() < 0.5;
        const L = drop ? X1(m, { n: 1 }) : X1(1, { n: 1 });
        return Qx("Tour de magie : choisis un nombre " + M("n") + ". Ajoute " + a + ". Multiplie le résultat par " + m + ". " + (drop ? "Retire " + m * a + "." : "Retire " + m * a + ", puis divise par " + m + ".") + " Écris le résultat sous la forme la plus simple.", L,
          M(m + "(n + " + a + ") - " + m * a + " = " + m + "n + " + m * a + " - " + m * a + " = " + m + "n") + (drop ? "" : " ; divisé par " + m + " : " + M("n")) + ". On retrouve toujours le même résultat, quel que soit " + M("n") + ".",
          { ...red, ctx: "magie", guide: [GX("Écris le résultat après « multiplie par " + m + " ».", m + "*(n+" + a + ")", M(m + "(n + " + a + ")") + "."), GX("Développe et retire " + m * a + " : il reste ?", X1(m, { n: 1 }), M(m + "n + " + m * a + " - " + m * a + " = " + m + "n") + ".", "reduced"), ...(drop ? [] : [GX("Divise par " + m + " :", "n", M("n") + " : on retrouve le nombre de départ !", "reduced")])],
            traps: [TX(m + "*n+" + a + "-" + m * a, "On multiplie toute la somme " + M("n + " + a) + " par " + m + " : " + M(m + "(n + " + a + ")") + ".")] }); },
      () => { const k = R.int(2, 6), c = pk([["carré de côté x", "x^2", "x^2"], ["rectangle de " + M("2x") + " sur " + M("x"), "2*x^2", "2x^2"]]), e = c[1] + "-" + k * k;
        return Qx("Dans un " + (c[0].startsWith("carré") ? "carré de côté " + M("x") : c[0]) + ", on découpe un carré de côté " + k + " dans un coin. Écris l'aire de la figure restante.", e, M(c[2] + " - " + k + "^2 = " + c[2] + " - " + k * k) + ".",
          { ctx: "decoupe", guide: [GX("Aire de la grande figure ?", c[1], M(c[2]) + "."), GX("Retire l'aire du petit carré (" + k + " · " + k + ") :", e, M(c[2] + " - " + k * k) + ".")],
            traps: [TX(c[0].startsWith("carré") ? "(x-" + k + ")^2" : "2*(x-" + k + ")^2", "On n'enlève pas " + k + " au côté : on retire l'aire du petit carré, " + k * k + "."), TX(c[1] + "-" + k, "On retire une aire : celle du petit carré, " + k + "² = " + k * k + ".")] }); },
      () => { const c = pk([["Léa a \\(x\\) ans. Son père a 3 fois son âge plus 4 ans. Écris la somme de leurs âges sous forme réduite.", [[4, { x: 1 }], [4, {}]], "x + (3x + 4) = 4x + 4", "3*x+4", "C'est l'âge du père seulement : ajoute celui de Léa.", "age"],
          ["Un cahier coûte \\(a\\) CHF et un stylo \\(b\\) CHF. Écris le prix de 5 cahiers et de 3 stylos, moins un bon de 2 CHF.", "5*a+3*b-2", "5a + 3b - 2", "5*a+3*b", "N'oublie pas le bon de 2 CHF.", "prix"],
          ["Un taxi demande 6 CHF de prise en charge et 3 CHF par km. Écris le prix d'une course de \\(k\\) km, puis celui de deux courses identiques, sous forme réduite.", [[6, { k: 1 }], [12, {}]], "2(6 + 3k) = 12 + 6k", "6+3*k", "C'est le prix d'une seule course : on en veut deux.", "taxi"]]);
        return Qx(c[0], c[1], M(c[2]) + ".", { ...red, ctx: c[5], guide: [GX("Écris l'expression, puis réduis-la.", c[1], M(c[2]) + ".", "reduced")], traps: [TX(c[3], c[4])] }); },
    ],
  };

  // ===================== valnum : substituer =====================
  const VAL = {
    1: [
      () => { const a = R.int(2, 5), b = nz(-6, 6), x = -R.int(2, 4), v = a * x * x + b * x;
        return Qn("Calcule " + M(a + "x^2 " + (b < 0 ? "- " : "+ ") + Math.abs(b) + "x") + " pour " + M("x = " + x) + ".", v, M(a + " \\cdot (" + x + ")^2 " + (b < 0 ? "- " : "+ ") + Math.abs(b) + " \\cdot (" + x + ") = " + a * x * x + (b * x < 0 ? " - " : " + ") + Math.abs(b * x) + " = " + v) + ".",
          { ctx: "poly", guide: [GS("Calcule d'abord " + M("(" + x + ")^2") + ".", x * x, M("(" + x + ")^2 = " + x * x) + " : un carré est positif."), GS("Puis " + M(a + "x^2 = " + a + " \\cdot " + x * x) + " :", a * x * x, M(a * x * x) + "."), GS("Et " + M((b < 0 ? "-" : "") + Math.abs(b) + "x") + " pour " + M("x = " + x) + ", puis le total :", v, M(a * x * x + (b * x < 0 ? " - " : " + ") + Math.abs(b * x) + " = " + v) + ".")],
            traps: [{ v: -a * x * x + b * x, m: "Attention : " + M("(" + x + ")^2 = " + x * x) + ", positif. On met la valeur négative entre parenthèses avant d'élever au carré." }, { v: (a * x) ** 2 + b * x, m: "Seul " + M("x") + " est au carré, pas " + M(a + "x") + "." }] }); },
      () => { const a = R.int(3, 12), b = R.int(2, 5), x = -R.int(2, 6), v = a - b * x;
        return Qn("Calcule " + M(a + " - " + b + "x") + " pour " + M("x = " + x) + ".", v, M(a + " - " + b + " \\cdot (" + x + ") = " + a + " + " + -b * x + " = " + v) + ".",
          { ctx: "lin", guide: [GS("Calcule " + M(b + " \\cdot (" + x + ")") + ".", b * x, M(b * x) + "."), GS("Puis " + M(a + " - (" + b * x + ")") + " :", v, "Moins un nombre négatif, c'est plus : " + M(v) + ".")],
            traps: [{ v: a + b * x, m: "Soustraire " + M(b * x) + ", c'est ajouter " + M(-b * x) + "." }] }); },
      () => { const L = R.int(5, 15) + pk([0, 0.5]), l = R.int(2, 9), c = pk([["P = 2(L + l)", 2 * (L + l), "2(" + dec(L) + " + " + l + ") = " + dec(2 * (L + l)), 2 * L + l, "Les parenthèses d'abord : on additionne L et l, puis on multiplie la somme par 2.", "perim"], ["A = L \\cdot l", L * l, dec(L) + " \\cdot " + l + " = " + dec(L * l), L + l, "L'aire est un produit, pas une somme.", "aire"]]);
        return Qn("Utilise la formule " + M(c[0]) + " pour un rectangle de longueur " + M("L = " + dec(L)) + " cm et de largeur " + M("l = " + l) + " cm (résultat en " + (c[5] === "aire" ? "cm²" : "cm") + ").", c[1], M(c[2]) + ".",
          { ctx: c[5], guide: [GS("Remplace " + M("L") + " et " + M("l") + " par leurs valeurs et calcule.", c[1], M(c[2]) + ".")], traps: [{ v: c[3], m: c[4] }] }); },
    ],
    2: [
      () => { const a = -R.int(1, 4), b = R.int(2, 5), c = R.int(2, 4), v = a * a - c * a * b + b;
        return Qn("Calcule " + M("a^2 - " + c + "ab + b") + " pour " + M("a = " + a) + " et " + M("b = " + b) + ".", v, M("(" + a + ")^2 - " + c + " \\cdot (" + a + ") \\cdot " + b + " + " + b + " = " + a * a + " + " + -c * a * b + " + " + b + " = " + v) + ".",
          { ctx: "deux", guide: [GS("Calcule " + M("(" + a + ")^2") + ".", a * a, M(a * a) + "."), GS("Calcule " + M(c + " \\cdot (" + a + ") \\cdot " + b) + ".", c * a * b, M(c * a * b) + "."), GS("Total : " + M(a * a + " - (" + c * a * b + ") + " + b) + " ?", v, M(v) + ".")],
            traps: [{ v: -a * a - c * a * b + b, m: M("(" + a + ")^2 = " + a * a) + " (positif)." }, { v: a * a + c * a * b + b, m: "Attention au signe : " + M("-" + c + " \\cdot (" + a + ") \\cdot " + b + " = " + -c * a * b) + "." }] }); },
      () => { const x = pk([0.5, 1.5, 2.5]), a = R.int(2, 4), b = R.int(3, 7), v = +(x * x - a * x + b).toFixed(4);
        return Qn("Calcule " + M("x^2 - " + a + "x + " + b) + " pour " + M("x = " + dec(x)) + ".", v, M(dec(x) + "^2 - " + a + " \\cdot " + dec(x) + " + " + b + " = " + dec(x * x) + " - " + dec(a * x) + " + " + b + " = " + dec(v)) + ".",
          { ctx: "dec", guide: [GS("Calcule " + M(dec(x) + "^2") + ".", x * x, M(dec(x) + " \\cdot " + dec(x) + " = " + dec(x * x)) + "."), GS("Total ?", v, M(dec(v)) + ".")],
            traps: [{ v: +(2 * x - a * x + b).toFixed(4), m: M(dec(x) + "^2") + " veut dire " + M(dec(x) + " \\cdot " + dec(x)) + ", pas " + M("2 \\cdot " + dec(x)) + "." }] }); },
      () => { const B = R.int(6, 14), b = R.int(2, B - 2), h = R.int(3, 8), v = ((B + b) * h) / 2;
        return Qn("L'aire d'un trapèze est " + M("A = \\frac{(B + b) \\cdot h}{2}") + ". Calcule-la pour " + M("B = " + B) + " cm, " + M("b = " + b) + " cm et " + M("h = " + h) + " cm (en cm²).", v, M("\\frac{(" + B + " + " + b + ") \\cdot " + h + "}{2} = \\frac{" + (B + b) * h + "}{2} = " + dec(v)) + " cm².",
          { ctx: "trapeze", guide: [GS("Calcule d'abord la parenthèse " + M("B + b") + ".", B + b, M(B + b) + "."), GS("Puis " + M("\\frac{" + (B + b) + " \\cdot " + h + "}{2}") + " :", v, M(dec(v)) + " cm².")],
            traps: [{ v: B + (b * h) / 2, m: "La parenthèse se calcule d'abord : " + M("B + b") + ", puis on multiplie par " + M("h") + "." }] }); },
    ],
    3: [
      () => { const x = pk([[-2, 3], [2, 3], [-1, 2], [-3, 2]]), a = pk([6, 12]), b = R.int(2, 5), c = R.int(1, 5), xv = x[0] / x[1], v = a * xv * xv - b * xv + c;
        return Qn("Calcule " + M(a + "x^2 - " + b + "x + " + c) + " pour " + M("x = " + frac(x[0], x[1])) + " (résultat exact).", v, M(a + " \\cdot " + frac(x[0] * x[0], x[1] * x[1]) + " - " + b + " \\cdot (" + frac(x[0], x[1]) + ") + " + c + " = " + frac(a * x[0] * x[0], x[1] * x[1]) + (b * x[0] < 0 ? " + " : " - ") + frac(Math.abs(b * x[0]), x[1]) + " + " + c + " = " + frac(Math.round(v * 36), 36)) + ".",
          { ctx: "frac", guide: [GS("Calcule " + M("x^2 = (" + frac(x[0], x[1]) + ")^2") + ".", xv * xv, M(frac(x[0] * x[0], x[1] * x[1])) + "."), GS("Calcule " + M(a + "x^2") + ".", a * xv * xv, M(frac(a * x[0] * x[0], x[1] * x[1])) + "."), GS("Résultat exact ?", v, M(frac(Math.round(v * 36), 36)) + ".")],
            traps: [{ v: -a * xv * xv - b * xv + c, m: "Le carré d'un nombre négatif est positif." }] }); },
      () => { const a = R.int(2, 6), b = -R.int(2, 6), v = (a - b) ** 2;
        return Qn("Calcule " + M("(a - b)^2") + " pour " + M("a = " + a) + " et " + M("b = " + b) + ".", v, M("(" + a + " - (" + b + "))^2 = " + (a - b) + "^2 = " + v) + ".",
          { ctx: "carre", guide: [GS("Calcule d'abord " + M("a - b = " + a + " - (" + b + ")") + ".", a - b, M(a - b) + "."), GS("Élève au carré :", v, M((a - b) + "^2 = " + v) + ".")],
            traps: [{ v: a * a - b * b, m: M("(a - b)^2") + " n'est pas " + M("a^2 - b^2") + " : on calcule la parenthèse, puis on élève au carré." }, { v: (a + b) ** 2, m: "Moins un nombre négatif, c'est plus : " + M(a + " - (" + b + ") = " + (a - b)) + "." }] }); },
      () => { const x = -R.int(2, 4), k = R.int(2, 5), v = x ** 3 - k * x;
        return Qn("Calcule " + M("x^3 - " + k + "x") + " pour " + M("x = " + x) + ".", v, M("(" + x + ")^3 - " + k + " \\cdot (" + x + ") = " + x ** 3 + " + " + -k * x + " = " + v) + ".",
          { ctx: "cube", guide: [GS("Calcule " + M("(" + x + ")^3") + " (trois facteurs négatifs).", x ** 3, M("(" + x + ") \\cdot (" + x + ") \\cdot (" + x + ") = " + x ** 3) + " : un cube garde le signe."), GS("Résultat ?", v, M(x ** 3 + " + " + -k * x + " = " + v) + ".")],
            traps: [{ v: -(x ** 3) - k * x, m: "Le cube d'un nombre négatif est négatif (trois signes « − »)." }] }); },
    ],
  };

  // ===================== reduire : réduire, ordonner =====================
  const RED = {
    1: [
      () => { const v = pk(["x", "y", "a"]); let a, b, c, d; do { a = nz(-9, 9); c = nz(-9, 9); b = nz(-9, 9); d = nz(-9, 9); } while (a + c === 0 || b + d === 0 || a + c === 1);
        const L = norm([[a + c, { [v]: 1 }], [b + d, {}]]);
        return Qx("Réduis : " + M(raw([[a, v], [b, ""], [c, v], [d, ""]])) + ".", L, "Termes en " + M(v) + " : " + M(a + (c < 0 ? " - " : " + ") + Math.abs(c) + " = " + (a + c)) + ". Nombres : " + M(b + (d < 0 ? " - " : " + ") + Math.abs(d) + " = " + (b + d)) + ". Donc " + M(tex(L)) + ".",
          { ...red, ctx: "lin", guide: [GX("Regroupe les termes en " + M(v) + " :", X1(a + c, { [v]: 1 }), M((a + c) + v) + ".", "reduced"), GX("Ajoute les nombres seuls :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX((a + b + c + d) + "*" + v, "On n'additionne pas des " + M(v) + " et des nombres seuls : ce ne sont pas des termes semblables.")] }); },
      () => { let a, b, c, d; do { a = nz(-8, 8); b = nz(-8, 8); c = nz(-8, 8); d = nz(-8, 8); } while (a + c === 0 || b + d === 0);
        const L = norm([[a + c, { a: 1 }], [b + d, { b: 1 }]]);
        return Qx("Réduis : " + M(raw([[a, "a"], [b, "b"], [c, "a"], [d, "b"]])) + ".", L, "Les " + M("a") + " ensemble, les " + M("b") + " ensemble : " + M(tex(L)) + ".",
          { ...red, ctx: "ab", guide: [GX("Regroupe les termes en " + M("a") + " :", X1(a + c, { a: 1 }), M((a + c) + "a") + ".", "reduced"), GX("Puis ceux en " + M("b") + " ; écris le tout :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX((a + b + c + d) + "*a*b", "On ne mélange pas les " + M("a") + " et les " + M("b") + " : ce ne sont pas des termes semblables.")] }); },
      () => { let a, b, c, k; do { a = nz(-6, 6); b = nz(-6, 6); c = nz(-6, 6); k = nz(-9, 9); } while (a + b + c === 0);
        const L = norm([[a + b + c, { x: 1 }], [k, {}]]);
        return Qx("Réduis : " + M(raw([[a, "x"], [k, ""], [b, "x"], [c, "x"]])) + ".", L, M((a + b + c) + "x") + " et le nombre " + M(k) + " : " + M(tex(L)) + ".",
          { ...red, ctx: "trois", guide: [GX("Combien de " + M("x") + " en tout ?", X1(a + b + c), M(a + " + " + par(b) + " + " + par(c) + " = " + (a + b + c)) + ".", "reduced"), GX("Écris le résultat réduit :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX((a + b + c + k) + "*x", "Le nombre " + M(k) + " reste seul : il n'y a pas de " + M("x") + " avec lui.")] }); },
    ],
    2: [
      () => { let a, b, c, d, e; do { a = nz(-5, 5); b = nz(-7, 7); c = nz(-9, 9); d = nz(-5, 5); e = nz(-7, 7); } while (a + d === 0 || b + e === 0);
        const L = norm([[a + d, { x: 2 }], [b + e, { x: 1 }], [c, {}]]);
        return Qx("Réduis et ordonne : " + M(raw([[a, "x^2"], [b, "x"], [c, ""], [d, "x^2"], [e, "x"]])) + ".", L, "Les " + M("x^2") + " : " + M((a + d) + "x^2") + " ; les " + M("x") + " : " + M((b + e) + "x") + ". Donc " + M(tex(L)) + ".",
          { ...red, ctx: "x2", guide: [GX("Regroupe les termes en " + M("x^2") + " :", X1(a + d, { x: 2 }), M((a + d) + "x^2") + " (l'exposant ne change pas).", "reduced"), GX("Écris le tout, du plus grand exposant au plus petit :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX((a + d) + "*x^4+" + (b + e) + "*x+" + c, "On n'additionne pas les exposants : " + M("x^2 + x^2 = 2x^2") + ", pas " + M("x^4") + "."), TX((a + d + b + e) + "*x^3+" + c, "Des " + M("x^2") + " et des " + M("x") + " ne sont pas semblables.")] }); },
      () => { let a, b, c, d; do { a = nz(-6, 6); b = nz(-6, 6); c = nz(-6, 6); d = nz(-6, 6); } while (a + c === 0 || b + d === 0);
        const L = norm([[a + c, { x: 1, y: 1 }], [b + d, { x: 1 }]]);
        return Qx("Réduis : " + M(raw([[a, "xy"], [b, "x"], [c, "xy"], [d, "x"]])) + ".", L, "Les " + M("xy") + " ensemble, les " + M("x") + " ensemble : " + M(tex(L)) + ".",
          { ...red, ctx: "xy", guide: [GX("Regroupe les termes en " + M("xy") + " :", X1(a + c, { x: 1, y: 1 }), M((a + c) + "xy") + ".", "reduced"), GX("Écris le résultat :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX((a + b + c + d) + "*x*y", M("xy") + " et " + M("x") + " ne sont pas semblables : la partie littérale doit être exactement la même.")] }); },
      () => { let a, b, c, d, e; do { a = nz(-5, 5); b = nz(-5, 5); c = nz(-5, 5); d = nz(-5, 5); e = nz(-9, 9); } while (a + c === 0 || b + d === 0 || a + c + b + d === 0);
        const L = norm([[a + c, { x: 2 }], [b + d, { x: 1 }], [e, {}]]);
        return Qx("Réduis et ordonne : " + M(raw([[b, "x"], [e, ""], [a, "x^2"], [d, "x"], [c, "x^2"]])) + ".", L, M(tex(L)) + " : les termes semblables ont la même lettre avec le même exposant.",
          { ...red, ctx: "desordre", guide: [GX("Les termes en " + M("x^2") + " :", X1(a + c, { x: 2 }), M((a + c) + "x^2") + ".", "reduced"), GX("Les termes en " + M("x") + " :", X1(b + d), M((b + d) + "x") + ".", "reduced"), GX("Résultat ordonné :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX((a + c + b + d) + "*x^2+" + e, "Des " + M("x") + " et des " + M("x^2") + " ne s'additionnent pas.")] }); },
    ],
    3: [
      () => { const [p, q] = pk([[2, 3], [3, 4], [2, 5], [4, 6], [3, 5]]), a = R.int(1, 3), b = R.int(1, 3), sgn = pk([1, -1]), n = a * q + sgn * b * p, d = p * q, g = gcd2(n, d), e = "(" + n / g + ")*x/" + d / g;
        if (n === 0 || gcd2(a, p) !== 1 || gcd2(b, q) !== 1) return RED[3][0]();
        return Qx("Réduis : " + M("\\frac{" + (a > 1 ? a : "") + "x}{" + p + "} " + (sgn > 0 ? "+" : "-") + " \\frac{" + (b > 1 ? b : "") + "x}{" + q + "}") + ".", e,
          "Dénominateur commun " + M(d) + " : " + M("\\frac{" + a * q + "x}{" + d + "} " + (sgn > 0 ? "+" : "-") + " \\frac{" + b * p + "x}{" + d + "} = " + (d / g === 1 ? n / g + "x" : "\\frac{" + n / g + "x}{" + d / g + "}")) + ".",
          { ...red, ctx: "fractions", guide: [GS("Quel est le dénominateur commun le plus petit ?", d / gcd2(p, q) === d ? d : d, M(d) + " (multiple de " + p + " et de " + q + ")."), GX("Additionne les numérateurs sur ce dénominateur et simplifie :", e, M("\\frac{" + n / g + "x}{" + d / g + "}") + ".", "reduced")],
            traps: [TX("(" + (a + sgn * b) + ")*x/" + (p + q), "On n'additionne pas les dénominateurs : on met d'abord les fractions au même dénominateur.")] }); },
      () => { let a, b, c, d, e; do { a = nz(-4, 4); b = nz(-4, 4); c = nz(-4, 4); d = nz(-4, 4); e = nz(-4, 4); } while (a + c + e === 0 || b + d === 0);
        const L = norm([[a + c + e, { a: 2, b: 1 }], [b + d, { a: 1, b: 2 }]]);
        return Qx("Réduis : " + M(raw([[a, "a^2b"], [b, "ab^2"], [c, "a^2b"], [d, "ab^2"], [e, "a^2b"]])) + ".", L, M("a^2b") + " et " + M("ab^2") + " ne sont pas semblables (exposants différents) : " + M(tex(L)) + ".",
          { ...red, ctx: "a2b", guide: [GX("Regroupe les termes en " + M("a^2b") + " :", X1(a + c + e, { a: 2, b: 1 }), M((a + c + e) + "a^2b") + ".", "reduced"), GX("Puis ceux en " + M("ab^2") + " ; écris le tout :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX((a + b + c + d + e) + "*a^2*b", M("a^2b") + " et " + M("ab^2") + " ne sont pas semblables : les exposants ne sont pas les mêmes.")] }); },
      () => { const a = R.int(2, 6), b = R.int(2, 6), c = R.int(2, 6), w = pk(["Max", "Lina", "Noé"]), L = norm([[b, { x: 2 }], [a + c, { x: 1 }]]);
        return Qx(w + " écrit : « " + M(a + "x + " + b + "x^2 = " + (a + b) + "x^3") + " ». Trouve l'erreur, puis réduis correctement " + M(a + "x + " + b + "x^2 + " + c + "x") + ".", L,
          "Erreur : " + M("x") + " et " + M("x^2") + " ne sont pas semblables ; on ne peut pas les additionner. " + M(a + "x + " + c + "x = " + (a + c) + "x") + ", donc " + M(tex(L)) + ".",
          { ...red, ctx: "erreur", guide: [GX("Quels termes sont semblables ? Additionne-les :", X1(a + c), M(a + "x + " + c + "x = " + (a + c) + "x") + ".", "reduced"), GX("Écris le résultat réduit et ordonné :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX((a + b + c) + "*x^3", "C'est l'erreur de " + w + " : " + M("x") + " et " + M("x^2") + " ne s'additionnent pas.")] }); },
      /* 25.11 (audit de niveau 11e, tools/niveau_11.md) : fractions à numérateur binôme, comme le dossier de calcul
         littéral de la 11LS (Ex. 17 : (x + 5)/3 − (x − 1)/2) ; le niveau 3 n'avait que x/4 + x/6. */
      () => { let p, q, a1, b1, a2, b2, op, L, cx, c0;
        do { [p, q] = pk([[2, 3], [3, 4], [2, 5], [4, 6], [3, 5], [6, 4], [5, 10], [3, 6]]); a1 = pk([1, 1, 2, 3]); a2 = pk([1, 1, 2, 3]); b1 = nz(-7, 7); b2 = nz(-7, 7); op = pk([1, -1]);
          L = (p * q) / gcd2(p, q); cx = (L / p) * a1 + op * (L / q) * a2; c0 = (L / p) * b1 + op * (L / q) * b2; }
        while (cx === 0 || c0 === 0 || gcd2(gcd2(cx, c0), L) !== 1);
        const num = (a, b) => (a === 1 ? "" : a) + "x" + (b < 0 ? " - " + -b : " + " + b), N = norm([[cx, { x: 1 }], [c0, {}]]), e = "(" + plain(N) + ")/" + L;
        const k1 = L / p, k2 = L / q, mul = (k, a, b) => (k === 1 ? "(" + num(a, b) + ")" : k + "(" + num(a, b) + ")");
        const wrong = norm([[cx, { x: 1 }], [k1 * b1 + k2 * b2, {}]]);
        return Qx("Réduis et écris en une seule fraction : " + M("\\frac{" + num(a1, b1) + "}{" + p + "} " + (op > 0 ? "+" : "-") + " \\frac{" + num(a2, b2) + "}{" + q + "}") + ".", e,
          "Dénominateur commun " + M(L) + " : " + M("\\frac{" + mul(k1, a1, b1) + (op > 0 ? " + " : " - ") + mul(k2, a2, b2) + "}{" + L + "} = \\frac{" + tex(N) + "}{" + L + "}") + (op < 0 ? " (le « − » s'applique à tout le second numérateur)." : "."),
          { form: "onefrac", ctx: "fractions-binomes",
            guide: [GS("Quel est le plus petit dénominateur commun ?", L, M(L) + "."), GX("Numérateur, une fois les parenthèses enlevées et réduit :", N, M(tex(N)) + ".", "reduced"), GX("Résultat en une seule fraction :", e, M("\\frac{" + tex(N) + "}{" + L + "}") + ".", "onefrac")],
            traps: [...(op < 0 ? [TX("(" + plain(wrong) + ")/" + L, "Le « − » devant la seconde fraction change le signe de TOUT son numérateur : " + M("-" + mul(k2, a2, b2)) + ".")] : []),
              TX("(" + plain(norm([[a1 + op * a2, { x: 1 }], [b1 + op * b2, {}]])) + ")/" + (p + q), "On n'additionne pas les dénominateurs : on met d'abord les fractions au même dénominateur.")] }); },
    ],
  };

  // ===================== monomes : multiplier des monômes =====================
  const MON = {
    1: [
      () => { const a = R.int(2, 9), b = R.int(2, 9), v = pk(["x", "a", "y"]), L = X1(a * b, { [v]: 2 });
        return Qx("Calcule : " + M(a + v + " \\cdot " + b + v) + ".", L, M(a + " \\cdot " + b + " = " + a * b) + " et " + M(v + " \\cdot " + v + " = " + v + "^2") + " : " + M(tex(L)) + ".",
          { ...red, ctx: "simple", guide: [GS("Multiplie les coefficients :", a * b, M(a + " \\cdot " + b + " = " + a * b) + "."), GX("Multiplie les parties littérales (" + M(v + " \\cdot " + v) + ") et écris le résultat :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX((a * b) + "*" + v, M(v + " \\cdot " + v + " = " + v + "^2") + ", pas " + M(v) + "."), TX((a + b) + "*" + v + "^2", "On multiplie les coefficients, on ne les additionne pas.")] }); },
      () => { const a = R.int(2, 7), b = R.int(3, 7), m = R.int(2, 4), n = R.int(2, 5), L = X1(a * b, { x: m + n });
        return Qx("Calcule : " + M(a + "x^{" + m + "} \\cdot " + b + "x^{" + n + "}") + ".", L, M(a * b) + " et " + M("x^{" + m + " + " + n + "} = x^{" + (m + n) + "}") + " : " + M(tex(L)) + ".",
          { ...red, ctx: "exposants", guide: [GS("Multiplie les coefficients :", a * b, M(a * b) + "."), GS("Exposant de " + M("x") + " : on additionne les exposants. Lequel ?", m + n, M(m + " + " + n + " = " + (m + n)) + "."), GX("Écris le monôme :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(a * b + "*x^" + m * n, "On additionne les exposants (" + M("x^{" + m + "} \\cdot x^{" + n + "} = x^{" + (m + n) + "}") + "), on ne les multiplie pas."), TX((a + b) + "*x^" + (m + n), "On multiplie les coefficients : " + M(a + " \\cdot " + b + " = " + a * b) + ".")] }); },
      () => { const a = -R.int(2, 7), b = R.int(2, 7), L = X1(a * b, { y: 3 });
        return Qx("Calcule : " + M("(" + a + "y) \\cdot (" + b + "y^2)") + ".", L, "Signe : " + M("- \\cdot + = -") + ". " + M(Math.abs(a) * b) + " et " + M("y^3") + " : " + M(tex(L)) + ".",
          { ...red, ctx: "signe", guide: [GS("Coefficient (avec son signe) :", a * b, M(a + " \\cdot " + b + " = " + a * b) + "."), GX("Écris le monôme :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(-a * b + "*y^3", "Attention au signe : un négatif fois un positif donne un négatif.")] }); },
    ],
    2: [
      () => { const a = -R.int(2, 5), b = R.int(2, 5), m = R.int(2, 3), n = R.int(2, 4), L = X1(a * b, { a: m + 1, b: n + 1 });
        return Qx("Calcule : " + M("(" + a + "a^{" + m + "}b) \\cdot (" + b + "ab^{" + n + "})") + ".", L, M(a * b) + " ; " + M("a^{" + m + "} \\cdot a = a^{" + (m + 1) + "}") + " ; " + M("b \\cdot b^{" + n + "} = b^{" + (n + 1) + "}") + " : " + M(tex(L)) + ".",
          { ...red, ctx: "deuxlettres", guide: [GS("Coefficient :", a * b, M(a * b) + "."), GS("Exposant de " + M("a") + " (" + M("a^{" + m + "} \\cdot a^1") + ") :", m + 1, M(m + 1) + "."), GX("Écris le monôme complet :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(a * b + "*a^" + m + "*b^" + n, "Une lettre écrite sans exposant a l'exposant 1 : " + M("a^{" + m + "} \\cdot a = a^{" + (m + 1) + "}") + ".")] }); },
      () => { const a = R.int(2, 4), b = R.int(2, 4), c = -R.int(2, 3), L = X1(a * b * c, { x: 3, y: 4 });
        return Qx("Calcule : " + M("(" + a + "x^2y) \\cdot (" + b + "xy^2) \\cdot (" + c + "y)") + ".", L, M(a + " \\cdot " + b + " \\cdot (" + c + ") = " + a * b * c) + " ; " + M("x^{2+1} = x^3") + " ; " + M("y^{1+2+1} = y^4") + " : " + M(tex(L)) + ".",
          { ...red, ctx: "trois", guide: [GS("Coefficient :", a * b * c, M(a * b * c) + "."), GS("Exposant de " + M("y") + " ?", 4, M("1 + 2 + 1 = 4") + "."), GX("Écris le monôme :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(a * b * c + "*x^2*y^2", "Additionne les exposants de chaque lettre (une lettre seule = exposant 1).")] }); },
      () => { const k = pk([2, 3, 4, 5, -2, -3]), m = R.int(2, 4), L = X1(k * k, { x: 2 * m });
        return Qx("Calcule : " + M("(" + k + "x^{" + m + "})^2") + ".", L, M("(" + k + ")^2 = " + k * k) + " et " + M("(x^{" + m + "})^2 = x^{" + 2 * m + "}") + " : " + M(tex(L)) + ".",
          { ...red, ctx: "carre", guide: [GS("Coefficient : " + M("(" + k + ")^2") + " ?", k * k, M(k * k) + "."), GS("Exposant : " + M("x^{" + m + "} \\cdot x^{" + m + "}") + " ?", 2 * m, M(m + " + " + m + " = " + 2 * m) + "."), GX("Écris le monôme :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(k + "*x^" + 2 * m, "Le coefficient aussi est au carré : " + M("(" + k + ")^2 = " + k * k) + "."), TX(k * k + "*x^" + (m + 2), "On double l'exposant : " + M("(x^{" + m + "})^2 = x^{" + 2 * m + "}") + ".")] }); },
    ],
    3: [
      () => { const a = R.int(2, 6), b = R.int(2, 6), m = R.int(1, 3), n = R.int(1, 3), L = X1(b, { x: n });
        return Qx("Trouve le monôme " + M("M") + " : " + M("M \\cdot " + a + "x^{" + m + "} = " + a * b + "x^{" + (m + n) + "}") + ".", L, "Coefficient : " + M(a * b + " : " + a + " = " + b) + ". Exposant : " + M((m + n) + " - " + m + " = " + n) + ". " + M("M = " + tex(L)) + ".",
          { ...red, ctx: "manquant", guide: [GS("Coefficient de " + M("M") + " (" + M(a + " \\cdot ? = " + a * b) + ") :", b, M(b) + "."), GS("Exposant de " + M("x") + " (" + M(m + " + ? = " + (m + n)) + ") :", n, M(n) + "."), GX("Écris " + M("M") + " :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(a * b - a + "*x^" + n, "On cherche le facteur manquant : on divise les coefficients, on ne soustrait pas."), TX(b + "*x^" + (m + n), "L'exposant de " + M("M") + " est ce qui manque : " + M((m + n) + " - " + m + " = " + n) + "."), TX(a * b + "*x^" + n, "Le coefficient de " + M("M") + " fois " + a + " doit donner " + a * b + ".")] }); },
      () => { const k = R.int(2, 9), m = R.int(2, 4), L = X1(k, { x: m });
        return Qx("Trouve le monôme " + M("M") + ", de coefficient positif, tel que " + M("M^2 = " + k * k + "x^{" + 2 * m + "}") + ".", L, M("(" + k + "x^{" + m + "})^2 = " + k * k + "x^{" + 2 * m + "}") + ", donc " + M("M = " + tex(L)) + ".",
          { ...red, ctx: "racine", guide: [GS("Quel nombre positif au carré donne " + k * k + " ?", k, M(k) + "."), GS("Quel exposant, doublé, donne " + 2 * m + " ?", m, M(m) + "."), GX("Écris " + M("M") + " :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(k + "*x^" + (2 * m - 2), "Au carré, l'exposant est multiplié par 2 : il faut " + M(m) + ", la moitié de " + 2 * m + "."), TX(k + "*x^" + 2 * m, "Au carré, l'exposant double : celui de " + M("M") + " est la moitié de " + 2 * m + "."), TX(k * k + "*x^" + m, "Le coefficient de " + M("M") + " est le nombre dont le carré vaut " + k * k + ".")] }); },
      () => { const a = R.int(2, 6), b = R.int(2, 8), m = R.int(1, 2), n = R.int(1, 3), L = X1(b, { x: n });
        return Qx("Simplifie : " + M("\\frac{" + a * b + "x^{" + (m + n) + "}}{" + a + "x^{" + m + "}}") + ".", L, M(a * b + " : " + a + " = " + b) + " et " + M("x^{" + (m + n) + " - " + m + "} = x^{" + n + "}") + " : " + M(tex(L)) + ".",
          { ...red, ctx: "quotient", guide: [GS("Divise les coefficients :", b, M(b) + "."), GS("Exposant de " + M("x") + " (on soustrait) :", n, M((m + n) + " - " + m + " = " + n) + "."), GX("Écris le résultat :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(a * b - a + "*x^" + n, "On divise les coefficients, on ne les soustrait pas."), TX(b + "*x^" + (m + n), "Pour diviser, on soustrait les exposants : " + M((m + n) + " - " + m + " = " + n) + "."), TX(a * b + "*x^" + n, "Divise aussi les coefficients : " + M(a * b + " \\div " + a + " = " + b) + ".")] }); },
    ],
  };

  // ===================== parenth : supprimer des parenthèses =====================
  const PAR = {
    1: [
      () => { const a = R.int(2, 9), b = R.int(2, 6), L = norm([[1 + b, { x: 1 }], [-a, {}]]);
        return Qx("Supprime les parenthèses et réduis : " + M("x - (" + a + " - " + b + "x)") + ".", L, "Le « − » devant la parenthèse change le signe de chaque terme : " + M("x - " + a + " + " + b + "x = " + tex(L)) + ".",
          { ...red, ctx: "moins", guide: [GX("Enlève la parenthèse en changeant les signes à l'intérieur (sans réduire) :", "x-" + a + "+" + b + "*x", M("x - " + a + " + " + b + "x") + "."), GX("Réduis :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX("x-" + a + "-" + b + "*x", "Le « − » devant la parenthèse change le signe de <b>tous</b> les termes : " + M("-(-" + b + "x) = +" + b + "x") + ".")] }); },
      () => { const a = R.int(2, 9), b = R.int(2, 6), c = R.int(2, 9), L = norm([[-b, { x: 1 }], [a - c, {}]]);
        if (a === c) return PAR[1][1]();
        return Qx("Supprime les parenthèses et réduis : " + M(a + " - (" + b + "x + " + c + ")") + ".", L, M(a + " - " + b + "x - " + c + " = " + tex(L)) + ".",
          { ...red, ctx: "moins2", guide: [GX("Enlève la parenthèse (le « − » change les signes) :", a + "-" + b + "*x-" + c, M(a + " - " + b + "x - " + c) + "."), GX("Réduis :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(a + "-" + b + "*x+" + c, "Tous les termes changent de signe : " + M("-(+" + c + ") = -" + c) + ".")] }); },
      () => { const a = R.int(2, 9), b = R.int(2, 9), c = R.int(2, 9), d = R.int(2, 9); if (a === c || b === d) return PAR[1][2]();
        const L = norm([[a - c, { x: 1 }], [-b + d, {}]]);
        return Qx("Supprime les parenthèses et réduis : " + M("(" + a + "x - " + b + ") - (" + c + "x - " + d + ")") + ".", L, M(a + "x - " + b + " - " + c + "x + " + d + " = " + tex(L)) + ".",
          { ...red, ctx: "deux", guide: [GX("Enlève les parenthèses :", a + "*x-" + b + "-" + c + "*x+" + d, M(a + "x - " + b + " - " + c + "x + " + d) + "."), GX("Réduis :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(norm([[a - c, { x: 1 }], [-b - d, {}]]), "Le deuxième terme de la parenthèse change aussi de signe : " + M("-(-" + d + ") = +" + d) + ".")] }); },
    ],
    2: [
      () => { const [a, b, c, d, e, f] = [R.int(2, 7), R.int(2, 7), R.int(2, 7), R.int(2, 7), R.int(2, 7), R.int(2, 7)], L = norm([[a + c - e, { a: 1 }], [-b - d + f, { b: 1 }]]);
        if (!L.length || L.length < 2) return PAR[2][0]();
        return Qx("Réduis : " + M("(" + a + "a - " + b + "b) + (" + c + "a - " + d + "b) - (" + e + "a - " + f + "b)") + ".", L, M(a + "a - " + b + "b + " + c + "a - " + d + "b - " + e + "a + " + f + "b = " + tex(L)) + ".",
          { ...red, ctx: "trois", guide: [GX("Enlève les parenthèses (attention à la dernière) :", a + "*a-" + b + "*b+" + c + "*a-" + d + "*b-" + e + "*a+" + f + "*b", M(a + "a - " + b + "b + " + c + "a - " + d + "b - " + e + "a + " + f + "b") + "."), GX("Réduis :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(norm([[a + c - e, { a: 1 }], [-b - d - f, { b: 1 }]]), "La dernière parenthèse est précédée d'un « − » : " + M("-(-" + f + "b) = +" + f + "b") + ".")] }); },
      () => { const a = R.int(2, 6), b = R.int(2, 9), c = R.int(2, 9), d = R.int(2, 6), L = norm([[-a + 1 + d, { x: 1 }], [b - c, {}]]);
        if (b === c || -a + 1 + d === 0) return PAR[2][1]();
        return Qx("Réduis : " + M("-(" + a + "x - " + b + ") - (" + c + " - x) + " + d + "x") + ".", L, M("-" + a + "x + " + b + " - " + c + " + x + " + d + "x = " + tex(L)) + ".",
          { ...red, ctx: "opposes", guide: [GX("Enlève les parenthèses :", "-" + a + "*x+" + b + "-" + c + "+x+" + d + "*x", M("-" + a + "x + " + b + " - " + c + " + x + " + d + "x") + "."), GX("Réduis :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(norm([[-a - 1 + d, { x: 1 }], [b - c, {}]]), M("-(" + c + " - x) = -" + c + " + x") + " : le « − x » devient « + x ».")] }); },
      () => { const a = R.int(2, 6), b = R.int(2, 6), c = R.int(2, 6), L = norm([[-a, { x: 1 }], [-b, { y: 1 }], [c, {}]]);
        return Qx("Écris l'opposé de " + M(a + "x + " + b + "y - " + c) + " sans parenthèses.", L, M("-(" + a + "x + " + b + "y - " + c + ") = " + tex(L)) + " : chaque terme change de signe.",
          { ...red, ctx: "oppose", guide: [GX("Change le signe de chaque terme :", L, M(tex(L)) + ".", "reduced")], traps: [TX("-" + a + "*x+" + b + "*y-" + c, "Tous les termes changent de signe, pas seulement le premier.")] }); },
    ],
    3: [
      () => { const a = R.int(3, 7), b = R.int(2, 5), c = R.int(2, 5), L = norm([[a - b - 1, { a: 1 }], [2, { b: 1 }]]);
        if (a - b - 1 === 0) return PAR[3][0]();
        return Qx("Réduis : " + M(a + "a - [" + b + "a - b + (a - b)]") + ".", L, "D'abord la parenthèse dans le crochet : " + M(b + "a - b + a - b = " + (b + 1) + "a - 2b") + ". Puis " + M(a + "a - (" + (b + 1) + "a - 2b) = " + tex(L)) + ".",
          { ...red, ctx: "crochets", guide: [GX("Réduis l'intérieur du crochet :", (b + 1) + "*a-2*b", M((b + 1) + "a - 2b") + ".", "reduced"), GX("Enlève le crochet (précédé d'un « − ») et réduis :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(norm([[a - b - 1, { a: 1 }], [-2, { b: 1 }]]), "Le crochet est précédé d'un « − » : " + M("-(-2b) = +2b") + ".")] }); },
      () => { const k = R.int(2, 9), L = norm([[1, { x: 1 }], [-k, {}]]);
        return Qx("Simplifie : " + M("x - (x - (x - " + k + "))") + ".", L, "De l'intérieur vers l'extérieur : " + M("x - (x - x + " + k + ") = x - " + k) + ".",
          { ...red, ctx: "emboite", guide: [GX("Simplifie la parenthèse intérieure " + M("x - (x - " + k + ")") + " :", String(k), M("x - x + " + k + " = " + k) + "."), GX("Puis " + M("x - " + k) + " :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX("x+" + k, "Compte les « − » : la parenthèse intérieure donne " + M(k) + ", puis " + M("x - " + k) + ".")] }); },
      () => { const a = R.int(2, 5), b = R.int(2, 9), c = R.int(2, 5), d = R.int(2, 9), w = pk(["Sam", "Inès", "Yanis"]), L = norm([[a - c, { x: 1 }], [-b + d, {}]]);
        if (a === c || b === d) return PAR[3][2]();
        return Qx(w + " écrit : « " + M("(" + a + "x - " + b + ") - (" + c + "x - " + d + ") = " + a + "x - " + b + " - " + c + "x - " + d) + " ». Trouve l'erreur, puis donne le résultat réduit correct.", L,
          "Erreur : le « − » devant la parenthèse change aussi le signe de " + M("-" + d) + ". " + M(a + "x - " + b + " - " + c + "x + " + d + " = " + tex(L)) + ".",
          { ...red, ctx: "erreur", guide: [GX("Réécris sans parenthèses, correctement :", a + "*x-" + b + "-" + c + "*x+" + d, M(a + "x - " + b + " - " + c + "x + " + d) + "."), GX("Réduis :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(norm([[a - c, { x: 1 }], [-b - d, {}]]), "C'est le résultat de " + w + " : " + M("-(-" + d + ") = +" + d) + ".")] }); },
    ],
  };

  // ===================== distrib : développer =====================
  const DIS = {
    1: [
      () => { const k = R.int(2, 9), a = R.int(2, 7), b = nz(-9, 9), L = sc(k, lin(a, b));
        return Qx("Développe : " + M(k + "(" + tex(lin(a, b)) + ")") + ".", L, "On multiplie chaque terme par " + k + " : " + M(k + " \\cdot " + a + "x " + sg(b) + " " + k + " \\cdot " + Math.abs(b) + " = " + tex(L)) + ".",
          { ...red, ctx: "simple", fig: FIG.rectFig(10, 4, a + "x " + sg(b) + " " + Math.abs(b), String(k)), guide: [GX("Multiplie " + k + " par " + M(a + "x") + " :", X1(k * a), M(k * a + "x") + ".", "reduced"), GX("Multiplie " + k + " par " + M(b) + ", puis écris le tout :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(norm([[k * a, { x: 1 }], [b, {}]]), "Il faut multiplier les deux termes par " + k + ", aussi " + M(b) + ".")] }); },
      () => { const k = -R.int(2, 9), a = R.int(2, 7), b = -R.int(2, 9), L = sc(k, lin(a, b));
        return Qx("Développe : " + M(k + "(" + tex(lin(a, b)) + ")") + ".", L, M(k + " \\cdot " + a + "x = " + k * a + "x") + " et " + M(k + " \\cdot (" + b + ") = " + k * b) + " : " + M(tex(L)) + ".",
          { ...red, ctx: "negatif", guide: [GX("Multiplie " + M(k) + " par " + M(a + "x") + " :", X1(k * a), M(k * a + "x") + ".", "reduced"), GX("Multiplie " + M(k) + " par " + M(b) + " (moins fois moins…), écris le tout :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(norm([[k * a, { x: 1 }], [-k * b, {}]]), "Signe : " + M("(" + k + ") \\cdot (" + b + ") = +" + k * b) + " (moins fois moins donne plus).")] }); },
      () => { const a = R.int(2, 6), b = nz(-9, 9), v = pk(["x", "a"]), L = mulP(X1(1, { [v]: 1 }), lin(a, b, v));
        return Qx("Développe : " + M(v + "(" + tex(lin(a, b, v)) + ")") + ".", L, M(v + " \\cdot " + a + v + " = " + a + v + "^2") + " et " + M(v + " \\cdot " + b + " = " + b + v) + " : " + M(tex(L)) + ".",
          { ...red, ctx: "lettre", guide: [GX("Multiplie " + M(v) + " par " + M(a + v) + " :", X1(a, { [v]: 2 }), M(a + v + "^2") + ".", "reduced"), GX("Puis " + M(v) + " par " + M(b) + " ; écris le tout :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(norm([[a, { [v]: 1 }], [b, { [v]: 1 }]]), M(v + " \\cdot " + a + v + " = " + a + v + "^2") + " (deux " + M(v) + " multipliés).")] }); },
    ],
    2: [
      () => { const a = nz(-7, 7), b = nz(-7, 7); if (a + b === 0) return DIS[2][0](); const L = mulP(lin(1, a), lin(1, b));
        return Qx("Développe et réduis : " + M("(" + tex(lin(1, a)) + ")(" + tex(lin(1, b)) + ")") + ".", L, "Chaque terme de la première parenthèse multiplie chaque terme de la deuxième : " + M("x^2 " + sg(b) + " " + Math.abs(b) + "x " + sg(a) + " " + Math.abs(a) + "x " + sg(a * b) + " " + Math.abs(a * b) + " = " + tex(L)) + ".",
          { ...red, ctx: "double", guide: [GX("Développe sans réduire (4 produits) :", L, M("x^2 " + sg(b) + " " + Math.abs(b) + "x " + sg(a) + " " + Math.abs(a) + "x " + sg(a * b) + " " + Math.abs(a * b)) + "."), GX("Réduis les termes en " + M("x") + " :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(norm([[1, { x: 2 }], [a * b, {}]]), "Il manque les produits « croisés » : " + M("x \\cdot (" + b + ")") + " et " + M(a + " \\cdot x") + "."), TX(norm([[1, { x: 2 }], [a + b, { x: 1 }], [a + b, {}]]), "Le terme constant est un produit : " + M(a + " \\cdot (" + b + ") = " + a * b) + ".")] }); },
      () => { const a = R.int(2, 5), b = nz(-6, 6), c = R.int(2, 5), d = nz(-6, 6); const L = mulP(lin(a, b), lin(c, d)); if (L.length < 3) return DIS[2][1]();
        return Qx("Développe et réduis : " + M("(" + tex(lin(a, b)) + ")(" + tex(lin(c, d)) + ")") + ".", L, M(a * c + "x^2 " + sg(a * d) + " " + Math.abs(a * d) + "x " + sg(b * c) + " " + Math.abs(b * c) + "x " + sg(b * d) + " " + Math.abs(b * d) + " = " + tex(L)) + ".",
          { ...red, ctx: "double2", fig: FIG.rectFig(10, 6, tex(lin(c, d)).replace(/\\/g, ""), tex(lin(a, b)).replace(/\\/g, "")), guide: [GX("Premier terme × premier terme :", X1(a * c, { x: 2 }), M(a * c + "x^2") + ".", "reduced"), GX("Les deux produits croisés, réduits :", X1(a * d + b * c), M(a * d + b * c + "x") + ".", "reduced"), GX("Le tout, réduit :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(norm([[a * c, { x: 2 }], [b * d, {}]]), "Il manque les produits croisés (" + M(a + "x \\cdot (" + d + ")") + " et " + M(b + " \\cdot " + c + "x") + ").")] }); },
      () => { const k = R.int(2, 4), a = R.int(2, 5), b = nz(-5, 5), c = nz(-6, 6), P2 = norm([[a, { x: 2 }], [b, { x: 1 }], [c, {}]]), L = mulP(X1(k), P2);
        return Qx("Développe : " + M(k + "x(" + tex(P2) + ")") + ".", L, "Chaque terme multiplié par " + M(k + "x") + " : " + M(tex(L)) + ".",
          { ...red, ctx: "trinome", guide: [GX(M(k + "x \\cdot " + a + "x^2") + " = ?", X1(k * a, { x: 3 }), M(k * a + "x^3") + ".", "reduced"), GX("Écris le développement complet :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(norm([[k * a, { x: 3 }], [b, { x: 1 }], [c, {}]]), "Les trois termes sont multipliés par " + M(k + "x") + ".")] }); },
    ],
    3: [
      () => { const [a, b, c, d] = [nz(-5, 5), nz(-5, 5), nz(-5, 5), nz(-5, 5)], L = addP(mulP(lin(1, a), lin(1, b)), neg(mulP(lin(1, c), lin(1, d)))); if (L.length < 2) return DIS[3][0]();
        return Qx("Développe et réduis : " + M("(" + tex(lin(1, a)) + ")(" + tex(lin(1, b)) + ") - (" + tex(lin(1, c)) + ")(" + tex(lin(1, d)) + ")") + ".", L, "Premier produit : " + M(tex(mulP(lin(1, a), lin(1, b))))+ ". Deuxième : " + M(tex(mulP(lin(1, c), lin(1, d)))) + ", à soustraire en entier (parenthèses !). Résultat : " + M(tex(L)) + ".",
          { ...red, ctx: "difference", guide: [GX("Développe le premier produit :", mulP(lin(1, a), lin(1, b)), M(tex(mulP(lin(1, a), lin(1, b)))) + ".", "reduced"), GX("Développe le deuxième :", mulP(lin(1, c), lin(1, d)), M(tex(mulP(lin(1, c), lin(1, d)))) + ".", "reduced"), GX("Soustrais le deuxième en entier et réduis :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(addP(mulP(lin(1, a), lin(1, b)), neg(mulP(lin(1, c), lin(1, d))).map(([c0, v], i) => i === 0 ? [c0, v] : [-c0, v])), "Le « − » s'applique à tout le deuxième produit : mets-le entre parenthèses avant de changer les signes.")] }); },
      () => { const a = R.int(2, 4), k = R.int(2, 5), m = R.int(2, 6), L = addP(mulP(X1(1), lin(a, -1)), neg(sc(k, norm([[1, { x: 2 }], [m, {}]]))));
        return Qx("Développe et réduis : " + M("x(" + a + "x - 1) - " + k + "(x^2 + " + m + ")") + ".", L, M(a + "x^2 - x - " + k + "x^2 - " + k * m + " = " + tex(L)) + ".",
          { ...red, ctx: "deuxdev", guide: [GX("Développe " + M("x(" + a + "x - 1)") + " :", mulP(X1(1), lin(a, -1)), M(a + "x^2 - x") + ".", "reduced"), GX("Développe " + M("-" + k + "(x^2 + " + m + ")") + " :", neg(sc(k, norm([[1, { x: 2 }], [m, {}]]))), M("-" + k + "x^2 - " + k * m) + ".", "reduced"), GX("Réduis le tout :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(addP(mulP(X1(1), lin(a, -1)), neg(X1(k, { x: 2 })), [[m, {}]]), "Le " + M("-" + k) + " multiplie aussi " + M(m) + " : " + M("-" + k + " \\cdot " + m + " = -" + k * m) + ".")] }); },
      () => { const a = R.int(1, 3), b = nz(-4, 4), c = R.int(1, 3), d = nz(-4, 4), e = nz(-5, 5), P2 = norm([[c, { x: 2 }], [d, { x: 1 }], [e, {}]]), L = mulP(lin(a, b), P2);
        return Qx("Développe et réduis : " + M("(" + tex(lin(a, b)) + ")(" + tex(P2) + ")") + ".", L, "6 produits, puis on réduit : " + M(tex(L)) + ".",
          { ...red, ctx: "degre3", guide: [GX("Multiplie " + M(tex(lin(a, b).slice(0, 1))) + " par chaque terme de la deuxième parenthèse :", mulP(lin(a, 0), P2), M(tex(mulP(lin(a, 0), P2))) + ".", "reduced"), GX("Puis " + M(b) + " par chaque terme ; additionne et réduis :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(norm([[a * c, { x: 3 }], [b * e, {}]]), "Chaque terme de la première parenthèse multiplie chaque terme de la deuxième : 6 produits.")] }); },
    ],
  };

  // ===================== idrem : identités remarquables =====================
  const IDR = {
    1: [
      () => { const a = R.int(2, 9), L = mulP(lin(1, a), lin(1, a));
        return Qx("Développe : " + M("(x + " + a + ")^2") + ".", L, M("(a + b)^2 = a^2 + 2ab + b^2") + " : " + M("x^2 + 2 \\cdot x \\cdot " + a + " + " + a + "^2 = " + tex(L)) + ".",
          { ...red, ctx: "plus", guide: [GX("Carré du premier terme :", X1(1, { x: 2 }), M("x^2") + ".", "reduced"), GX("Double produit " + M("2 \\cdot x \\cdot " + a) + " :", X1(2 * a), M(2 * a + "x") + ".", "reduced"), GX("Écris le tout :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX("x^2+" + a * a, "Il manque le double produit " + M("2 \\cdot x \\cdot " + a + " = " + 2 * a + "x") + " : " + M("(x + " + a + ")^2 = (x + " + a + ")(x + " + a + ")") + "."), TX("x^2+" + a + "*x+" + a * a, "Le terme du milieu est le <b>double</b> produit : " + M(2 * a + "x") + ".")] }); },
      () => { const a = R.int(2, 9), L = mulP(lin(1, -a), lin(1, -a));
        return Qx("Développe : " + M("(x - " + a + ")^2") + ".", L, M("(a - b)^2 = a^2 - 2ab + b^2") + " : " + M(tex(L)) + ".",
          { ...red, ctx: "moins", guide: [GX("Double produit (avec son signe) :", X1(-2 * a), M("-" + 2 * a + "x") + ".", "reduced"), GX("Écris le tout :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX("x^2-" + a * a, "Il manque le double produit, et " + M("(-" + a + ")^2 = +" + a * a) + "."), TX("x^2-" + 2 * a + "*x-" + a * a, "Le dernier terme est un carré : " + M("(-" + a + ")^2 = +" + a * a) + ".")] }); },
      () => { const a = R.int(2, 9), L = norm([[1, { x: 2 }], [-a * a, {}]]);
        return Qx("Développe : " + M("(x + " + a + ")(x - " + a + ")") + ".", L, M("(a + b)(a - b) = a^2 - b^2") + " : " + M(tex(L)) + " (les produits croisés s'annulent).",
          { ...red, ctx: "diff", guide: [GX("Développe et réduis (les termes en " + M("x") + " s'annulent) :", L, M("x^2 - " + a + "x + " + a + "x - " + a * a + " = " + tex(L)) + ".", "reduced")],
            traps: [TX("x^2+" + a * a, M(a + " \\cdot (-" + a + ") = -" + a * a) + " : le résultat est une différence de carrés.")] }); },
    ],
    2: [
      () => { const b = R.int(2, 5), a = R.int(1, 7), L = mulP(lin(b, a), lin(b, a));
        return Qx("Développe : " + M("(" + b + "x + " + a + ")^2") + ".", L, M("(" + b + "x)^2 + 2 \\cdot " + b + "x \\cdot " + a + " + " + a + "^2 = " + tex(L)) + ".",
          { ...red, ctx: "coef", guide: [GX("Carré du premier terme " + M("(" + b + "x)^2") + " :", X1(b * b, { x: 2 }), M(b * b + "x^2") + " (le coefficient aussi est au carré).", "reduced"), GX("Double produit :", X1(2 * a * b), M(2 * a * b + "x") + ".", "reduced"), GX("Le tout :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(norm([[b, { x: 2 }], [2 * a * b, { x: 1 }], [a * a, {}]]), M("(" + b + "x)^2 = " + b * b + "x^2") + " : le coefficient est aussi au carré."), TX(norm([[b * b, { x: 2 }], [a * a, {}]]), "Il manque le double produit.")] }); },
      () => { const a = R.int(1, 4), b = R.int(2, 5), L = mulP(norm([[a, { a: 1 }], [-b, { b: 1 }]]), norm([[a, { a: 1 }], [-b, { b: 1 }]]));
        return Qx("Développe : " + M("(" + (a > 1 ? a : "") + "a - " + b + "b)^2") + ".", L, M(tex(L)) + ".",
          { ...red, ctx: "deuxlettres", guide: [GX("Double produit " + M("2 \\cdot " + (a > 1 ? a : "") + "a \\cdot " + b + "b") + " (avec le signe) :", X1(-2 * a * b, { a: 1, b: 1 }), M("-" + 2 * a * b + "ab") + ".", "reduced"), GX("Le tout :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(norm([[a * a, { a: 2 }], [-b * b, { b: 2 }]]), "Ce n'est pas une différence de carrés : " + M("(a - b)^2 = a^2 - 2ab + b^2") + ".")] }); },
      () => { const b = R.int(2, 6), a = R.int(1, 9), L = norm([[b * b, { x: 2 }], [-a * a, {}]]);
        return Qx("Développe : " + M("(" + b + "x - " + a + ")(" + b + "x + " + a + ")") + ".", L, M("(" + b + "x)^2 - " + a + "^2 = " + tex(L)) + ".",
          { ...red, ctx: "diff2", guide: [GX(M("(" + b + "x)^2") + " = ?", X1(b * b, { x: 2 }), M(b * b + "x^2") + ".", "reduced"), GX("Le résultat :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(norm([[b, { x: 2 }], [-a * a, {}]]), M("(" + b + "x)^2 = " + b * b + "x^2") + ".")] }); },
    ],
    3: [
      () => { const a = R.int(2, 7), b = R.int(2, 7), L = addP(mulP(lin(1, a), lin(1, a)), neg(mulP(lin(1, -b), lin(1, -b))));
        return Qx("Développe et réduis : " + M("(x + " + a + ")^2 - (x - " + b + ")^2") + ".", L, M("x^2 + " + 2 * a + "x + " + a * a + " - (x^2 - " + 2 * b + "x + " + b * b + ") = " + tex(L)) + ".",
          { ...red, ctx: "diffcarres", guide: [GX("Développe " + M("(x - " + b + ")^2") + " :", mulP(lin(1, -b), lin(1, -b)), M(tex(mulP(lin(1, -b), lin(1, -b)))) + ".", "reduced"), GX("Soustrais-le en entier et réduis :", L, M(tex(L)) + ".", "reduced")],
            traps: [TX(addP(mulP(lin(1, a), lin(1, a)), [[-1, { x: 2 }], [-2 * b, { x: 1 }], [b * b, {}]]), "Le « − » change tous les signes de " + M("(x - " + b + ")^2") + " développé.")] }); },
      () => { const a = R.int(2, 9), c = pk([1, 2, 3]);
        return Qn("Complète : " + M("(x + \\ldots)^2 = x^2 + " + 2 * a + "x + \\ldots") + ". Quel nombre manque dans la parenthèse ?", a, "Le double produit " + M("2 \\cdot x \\cdot ? = " + 2 * a + "x") + " donne " + M(a) + " ; le dernier terme est " + M(a + "^2 = " + a * a) + ".",
          { ctx: "completer", guide: [GS("Double produit : " + M("2 \\cdot ? = " + 2 * a) + ". Le nombre ?", a, M(a) + ".")], traps: [{ v: 2 * a, m: "Le terme du milieu est le <b>double</b> produit : divise " + 2 * a + " par 2." }, { v: a * a, m: "C'est le dernier terme (" + M(a + "^2") + "), pas le nombre de la parenthèse." }] }); },
      () => { const n = pk([31, 41, 51, 61, 71, 99, 101, 49, 59]), v = n * n, r = Math.round(n / 10) * 10, d = n - r;
        return Qn("Calcule mentalement " + M(n + "^2") + " avec une identité remarquable.", v, M("(" + r + (d < 0 ? " - " : " + ") + Math.abs(d) + ")^2 = " + r * r + (d < 0 ? " - " : " + ") + 2 * r * Math.abs(d) + " + " + d * d + " = " + v) + ".",
          { ctx: "mental", guide: [GS("Écris " + n + " comme " + r + (d < 0 ? " − " : " + ") + Math.abs(d) + ". Calcule " + M(r + "^2") + ".", r * r, M(r * r) + "."), GS("Double produit " + M("2 \\cdot " + r + " \\cdot " + Math.abs(d)) + " :", 2 * r * Math.abs(d), M(2 * r * Math.abs(d)) + "."), GS("Résultat :", v, M(r * r + (d < 0 ? " - " : " + ") + 2 * r * Math.abs(d) + " + " + d * d + " = " + v) + ".")],
            traps: [{ v: r * r + d * d, m: "Il manque le double produit " + M("2 \\cdot " + r + " \\cdot " + Math.abs(d)) + "." }] }); },
      /* 25.11 (audit de niveau 11e, tools/niveau_11.md) : 3e identité avec des racines, comme le dossier de la 11LS
         (Ex. 20 : (5√3 − 4√2)(5√3 + 4√2)) et l'EVACOM (racines et calcul littéral). */
      () => { let a, b, m, n, v; do { a = R.int(2, 6); b = R.int(2, 5); [m, n] = pk([[3, 2], [2, 3], [5, 2], [5, 3], [7, 2], [7, 3], [6, 5], [3, 5], [2, 7]]); v = a * a * m - b * b * n; } while (Math.abs(v) < 2);
        const A = a + "\\sqrt{" + m + "}", B = b + "\\sqrt{" + n + "}";
        return Qn("Calcule avec une identité remarquable : " + M("(" + A + " - " + B + ")(" + A + " + " + B + ")") + ".", v,
          M("(" + A + ")^2 - (" + B + ")^2 = " + a * a + " \\cdot " + m + " - " + b * b + " \\cdot " + n + " = " + a * a * m + " - " + b * b * n + " = " + v) + ".",
          { ctx: "racines", guide: [GS("C'est " + M("(u - v)(u + v) = u^2 - v^2") + ". Calcule " + M("(" + A + ")^2") + " :", a * a * m, M(a + "^2 \\cdot " + m + " = " + a * a * m) + "."), GS("Calcule " + M("(" + B + ")^2") + " :", b * b * n, M(b + "^2 \\cdot " + n + " = " + b * b * n) + "."), GS("Résultat :", v, M(a * a * m + " - " + b * b * n + " = " + v) + ".")],
            traps: [{ v: a * a * m + b * b * n, m: "C'est une <b>différence</b> de carrés : " + M("u^2 - v^2") + "." }, { v: a * m - b * n, m: M("(" + A + ")^2 = " + a + "^2 \\cdot (\\sqrt{" + m + "})^2") + " : le " + a + " est aussi élevé au carré." }].filter((t) => t.v !== v) }); },
    ],
  };

  // ===================== factor : factoriser =====================
  const prod = { form: "product" };
  const FAC = {
    1: [
      () => { const g = R.int(2, 7), a = R.int(2, 7), b = R.int(1, 9) * pk([1, -1]); if (gcd2(a, Math.abs(b)) !== 1) return FAC[1][0]();
        const e = g + "*(" + a + "*x" + (b < 0 ? "" : "+") + b + ")";
        return Qx("Factorise (mise en évidence) : " + M(g * a + "x " + sg(b) + " " + Math.abs(g * b)) + ".", e, "Le plus grand facteur commun est " + M(g) + " : " + M(g + "(" + a + "x " + sg(b) + " " + Math.abs(b) + ")") + ".",
          { ...prod, ctx: "nombre", guide: [GS("Plus grand facteur commun de " + M(g * a) + " et " + M(Math.abs(g * b)) + " ?", g, M(g) + "."), GX("Écris " + M(g + "(\\ldots)") + " :", e, M(g + "(" + a + "x " + sg(b) + " " + Math.abs(b) + ")") + ". Vérifie en développant.", "product")],
            traps: [TX(g + "*(" + a + "*x" + (b < 0 ? "" : "+") + g * b + ")", "Divise <b>chaque</b> terme par " + M(g) + " : " + M(Math.abs(g * b) + " \\div " + g + " = " + Math.abs(b)) + "."), TX(g + "*(" + g * a + "*x" + (b < 0 ? "" : "+") + b + ")", "Divise <b>chaque</b> terme par " + M(g) + " : " + M(g * a + "x \\div " + g + " = " + a + "x") + ".")] }); },
      () => { const a = R.int(2, 6), b = nz(-9, 9), g = gcd2(a, Math.abs(b)), e = g + "*x*(" + a / g + "*x" + (b < 0 ? "" : "+") + b / g + ")";
        return Qx("Factorise au maximum : " + M(tex(norm([[a, { x: 2 }], [b, { x: 1 }]]))) + ".", e, "Facteur commun " + M((g > 1 ? g : "") + "x") + " : " + M((g > 1 ? g : "") + "x(" + tex(lin(a / g, b / g)) + ")") + ".",
          { ...prod, ctx: "lettre", guide: [GX("Quel est le facteur commun (nombre et lettre) ?", (g > 1 ? g + "*" : "") + "x", M((g > 1 ? g : "") + "x") + "."), GX("Écris la factorisation :", e, M((g > 1 ? g : "") + "x(" + tex(lin(a / g, b / g)) + ")") + ".", "product")],
            traps: [TX((g > 1 ? g + "*" : "") + "x*(" + a / g + "*x^2" + (b < 0 ? "" : "+") + b / g + ")", "Mettre " + M("x") + " en évidence retire un " + M("x") + " de chaque terme : " + M("x^2") + " devient " + M("x") + "."), TX((g > 1 ? g + "*" : "") + "x*(" + a / g + "*x" + (b < 0 ? "" : "+") + b / g + "*x)", "Le " + M("x") + " mis en évidence ne reste plus dans le deuxième terme.")] }); },
      () => { const a = R.int(2, 5), c = nz(-4, 4), b = nz(-6, 6), e = "(" + a + "*x" + (b < 0 ? "" : "+") + b + ")*(" + c + "*x-1)";
        if (Math.abs(c) === 1) return FAC[1][2]();
        return Qx("Factorise : " + M(c + "x(" + tex(lin(a, b)) + ") - (" + tex(lin(a, b)) + ")") + ".", e, "Le facteur commun est la parenthèse " + M("(" + tex(lin(a, b)) + ")") + " : " + M("(" + tex(lin(a, b)) + ")(" + c + "x - 1)") + ".",
          { ...prod, ctx: "parenthese", guide: [GX("Quel est le facteur commun ?", "(" + a + "*x" + (b < 0 ? "" : "+") + b + ")", "La parenthèse " + M("(" + tex(lin(a, b)) + ")") + "."), GX("Que reste-t-il de chaque terme ? Écris le produit :", e, M("(" + tex(lin(a, b)) + ")(" + c + "x - 1)") + " : il reste " + M(c + "x") + " et " + M("-1") + ".", "product")],
            traps: [TX("(" + a + "*x" + (b < 0 ? "" : "+") + b + ")*" + c + "*x", "Le deuxième terme est " + M("-1 \\cdot (" + tex(lin(a, b)) + ")") + " : il reste " + M("-1") + ", pas rien.")] }); },
    ],
    2: [
      () => { const a = R.int(2, 12), e = "(x-" + a + ")*(x+" + a + ")";
        return Qx("Factorise : " + M("x^2 - " + a * a) + ".", e, M("a^2 - b^2 = (a - b)(a + b)") + " : " + M("(x - " + a + ")(x + " + a + ")") + ".",
          { ...prod, ctx: "diffcarres", guide: [GS(M(a * a) + " est le carré de quel nombre ?", a, M(a + "^2 = " + a * a) + "."), GX("Applique " + M("a^2 - b^2 = (a - b)(a + b)") + " :", e, M("(x - " + a + ")(x + " + a + ")") + ".", "product")],
            traps: [TX("(x-" + a + ")^2", M("(x - " + a + ")^2 = x^2 - " + 2 * a + "x + " + a * a) + " : ce n'est pas la même chose.")] }); },
      () => { const a = R.int(2, 9), s = pk([1, -1]), e = "(x" + (s > 0 ? "+" : "-") + a + ")^2";
        return Qx("Factorise : " + M("x^2 " + sg(s) + " " + 2 * a + "x + " + a * a) + ".", e, "C'est un carré parfait : " + M("x^2 " + sg(s) + " 2 \\cdot x \\cdot " + a + " + " + a + "^2 = (x " + sg(s) + " " + a + ")^2") + ".",
          { ...prod, ctx: "carre", guide: [GS(M(a * a) + " est le carré de :", a, M(a) + "."), GX("Vérifie le double produit (" + M(2 * a + "x") + ") et écris le carré :", e, M("(x " + sg(s) + " " + a + ")^2") + ".", "product")],
            traps: [TX("(x-" + a + ")*(x+" + a + ")", "Ça, c'est " + M("x^2 - " + a * a) + ". Ici il y a un double produit : c'est un carré.")] }); },
      () => { const b = R.int(2, 6), a = R.int(1, 9), e = "(" + b + "*x-" + a + ")*(" + b + "*x+" + a + ")";
        if (gcd2(a, b) !== 1) return FAC[2][2]();
        return Qx("Factorise : " + M(b * b + "x^2 - " + a * a) + ".", e, M("(" + b + "x)^2 - " + a + "^2 = (" + b + "x - " + a + ")(" + b + "x + " + a + ")") + ".",
          { ...prod, ctx: "diffcarres2", guide: [GX(M(b * b + "x^2") + " est le carré de :", b + "*x", M(b + "x") + "."), GX("Écris la factorisation :", e, M("(" + b + "x - " + a + ")(" + b + "x + " + a + ")") + ".", "product")],
            traps: [TX("(" + b * b + "*x-" + a + ")*(x+" + a + ")", M(b * b + "x^2 = (" + b + "x)^2") + " : les deux facteurs commencent par " + M(b + "x") + ".")] }); },
    ],
    3: [
      () => { let a, b; do { a = nz(-7, 7); b = nz(-7, 7); } while (a === b || a + b === 0 || a === -b);
        const e = "(x" + (a < 0 ? "" : "+") + a + ")*(x" + (b < 0 ? "" : "+") + b + ")";
        return Qx("Factorise : " + M(tex(norm([[1, { x: 2 }], [a + b, { x: 1 }], [a * b, {}]]))) + ".", e, "On cherche deux nombres de produit " + M(a * b) + " et de somme " + M(a + b) + " : " + M(a) + " et " + M(b) + ". Donc " + M("(" + tex(lin(1, a)) + ")(" + tex(lin(1, b)) + ")") + ".",
          { ...prod, ctx: "trinome", guide: [GS("Deux nombres de produit " + M(a * b) + " et de somme " + M(a + b) + " : donne le plus petit.", Math.min(a, b), M(a) + " et " + M(b) + " : " + M(a + " \\cdot " + par(b) + " = " + a * b) + ", " + M(a + " + " + par(b) + " = " + (a + b)) + "."), GX("Écris la factorisation :", e, M("(" + tex(lin(1, a)) + ")(" + tex(lin(1, b)) + ")") + ".", "product")],
            traps: [TX("(x" + (-a < 0 ? "" : "+") + -a + ")*(x" + (-b < 0 ? "" : "+") + -b + ")", "Vérifie les signes en développant : la somme doit être " + M(a + b) + ".")] }); },
      () => { const k = R.int(2, 5), a = R.int(2, 7), e = k + "*(x-" + a + ")*(x+" + a + ")";
        return Qx("Factorise au maximum : " + M(k + "x^2 - " + k * a * a) + ".", e, "Mise en évidence de " + M(k) + " : " + M(k + "(x^2 - " + a * a + ")") + ", puis différence de carrés : " + M(k + "(x - " + a + ")(x + " + a + ")") + ".",
          { ...prod, minFactors: 2, ctx: "maximal", guide: [GX("Mets " + M(k) + " en évidence :", k + "*(x^2-" + a * a + ")", M(k + "(x^2 - " + a * a + ")") + ".", "product"), GX("Factorise encore la parenthèse :", e, M(k + "(x - " + a + ")(x + " + a + ")") + ".", "product")],
            traps: [TX(k + "*(x-" + a + ")^2", M("(x - " + a + ")^2 = x^2 - " + 2 * a + "x + " + a * a) + " : ce n'est pas " + M("x^2 - " + a * a) + "."), TX("(x-" + a + ")*(x+" + a + ")", "Il manque le facteur " + M(k) + " mis en évidence au début.")] }); },
      () => { const a = R.int(2, 7), k = pk([1, 2, 3]), e = (k > 1 ? k + "*" : "") + "x*(x-" + a + ")*(x+" + a + ")";
        return Qx("Factorise au maximum : " + M((k > 1 ? k : "") + "x^3 - " + k * a * a + "x") + ".", e, "Facteur commun " + M((k > 1 ? k : "") + "x") + " : " + M((k > 1 ? k : "") + "x(x^2 - " + a * a + ") = " + (k > 1 ? k : "") + "x(x - " + a + ")(x + " + a + ")") + ".",
          { ...prod, minFactors: 2, ctx: "cube", guide: [GX("Mets le facteur commun en évidence :", (k > 1 ? k + "*" : "") + "x*(x^2-" + a * a + ")", M((k > 1 ? k : "") + "x(x^2 - " + a * a + ")") + ".", "product"), GX("Factorise la parenthèse :", e, M((k > 1 ? k : "") + "x(x - " + a + ")(x + " + a + ")") + ".", "product")],
            traps: [TX((k > 1 ? k + "*" : "") + "x*(x-" + a + ")^2", M("x^2 - " + a * a) + " est une différence de carrés : " + M("(x - " + a + ")(x + " + a + ")") + ", pas un carré."), TX((k > 1 ? k + "*" : "") + "(x-" + a + ")*(x+" + a + ")", "Il manque le facteur " + M("x") + " mis en évidence.")] }); },
    ],
  };

  // ===================== Défis : problèmes en plusieurs étapes (réponses numériques) =====================
  const Pb = (q, parts, hints, sol, fig) => ({ fig, q, parts: parts.map(([label, value]) => ({ label, spec: { kind: "value", value } })), hints, sol });
  const PROBS = {
    litelab: [() => { const k = R.int(2, 6), x = R.int(3, 8), P = 4 * k + 2 * k; const per = 4 * R.int(k + 2, 12) + 2 * k, xs = (per - 2 * k) / 4;
      return Pb("Un rectangle a une largeur " + M("x") + " cm et une longueur " + M("x + " + k) + " cm.", [["a) Périmètre pour x = " + x + " (cm)", 4 * x + 2 * k], ["b) Aire pour x = " + x + " (cm²)", x * (x + k)], ["c) Valeur de x pour un périmètre de " + per + " cm", xs]],
        ["Périmètre : 4x + " + 2 * k + " ; aire : x(x + " + k + ").", "c) Résous 4x + " + 2 * k + " = " + per + "."], "a) " + M("4 \\cdot " + x + " + " + 2 * k + " = " + (4 * x + 2 * k)) + " cm. b) " + M(x + " \\cdot " + (x + k) + " = " + x * (x + k)) + " cm². c) Périmètre " + M("2x + 2(x + " + k + ") = 4x + " + 2 * k) + ", donc " + M("4x + " + 2 * k + " = " + per) + " ; on enlève " + M(2 * k) + " des deux côtés : " + M("4x = " + (per - 2 * k)) + " ; on divise par 4 : " + M("x = " + xs) + "."); /* 24.11 : étapes détaillées (retour testeur) */ }],
    valnum: [() => { const v1 = pk([40, 50, 60]), v2 = 2 * v1;
      return Pb("La distance de freinage d'une voiture (en m) est environ " + M("d = \\frac{v^2}{200}") + ", avec " + M("v") + " en km/h.", [["a) d pour v = " + v1 + " km/h (m)", v1 * v1 / 200], ["b) d pour v = " + v2 + " km/h (m)", v2 * v2 / 200], ["c) Si la vitesse double, la distance est multipliée par…", 4]],
        ["Remplace v par sa valeur, calcule le carré, divise par 200.", "Compare les deux distances."], "a) " + M("\\frac{" + v1 * v1 + "}{200} = " + dec(v1 * v1 / 200)) + " m. b) " + M(dec(v2 * v2 / 200)) + " m. c) 4 : la distance dépend du carré de la vitesse."); }],
    reduire: [() => { const x = R.int(4, 8), P = 6 * x - 1, xs = R.int(5, 9);
      return Pb("Un triangle a des côtés de longueurs " + M("x") + ", " + M("2x + 1") + " et " + M("3x - 2") + " (en cm).", [["a) Coefficient de x dans le périmètre réduit", 6], ["b) Périmètre pour x = " + x + " (cm)", P], ["c) Valeur de x pour un périmètre de " + (6 * xs - 1) + " cm", xs]],
        ["Additionne les trois côtés et réduis : 6x − 1.", "c) Résous 6x − 1 = " + (6 * xs - 1) + "."], "a) " + M("x + 2x + 1 + 3x - 2 = 6x - 1") + " : 6. b) " + M("6 \\cdot " + x + " - 1 = " + P) + " cm. c) " + M("6x = " + 6 * xs) + ", " + M("x = " + xs) + "."); }],
    monomes: [() => { const x = R.int(2, 4);
      return Pb("Un cube a des arêtes de longueur " + M("3x") + " cm.", [["a) Coefficient du volume écrit sous forme de monôme", 27], ["b) Volume pour x = " + x + " (cm³)", 27 * x ** 3], ["c) Coefficient de l'aire totale (6 faces)", 54]],
        ["Volume : (3x)³ = 27x³.", "Une face : (3x)² = 9x² ; six faces : 54x²."], "a) " + M("(3x)^3 = 27x^3") + ". b) " + M("27 \\cdot " + x + "^3 = " + 27 * x ** 3) + " cm³. c) " + M("6 \\cdot 9x^2 = 54x^2") + "."); }],
    parenth: [() => { const a = R.int(4, 7), b = R.int(2, 9), c = R.int(2, 9), x = R.int(3, 8), k = a - 2 - 1, cst = b - c;
      if (cst === 0) return PROBS.parenth[0]();
      return Pb("On considère " + M("E = " + a + "x - (2x - " + b + ") - (x + " + c + ")") + ".", [["a) Coefficient de x dans E réduite", k], ["b) Terme constant de E réduite", cst], ["c) Valeur de E pour x = " + x, k * x + cst]],
        ["Chaque « − » devant une parenthèse change les signes à l'intérieur.", "E = " + k + "x " + (cst < 0 ? "− " + -cst : "+ " + cst) + "."], "a) " + M(a + "x - 2x + " + b + " - x - " + c + " = " + tex(lin(k, cst))) + " : " + k + ". b) " + cst + ". c) " + M(k + " \\cdot " + x + (cst < 0 ? " - " + -cst : " + " + cst) + " = " + (k * x + cst)) + "."); }],
    distrib: [() => { const a = R.int(2, 6), b = R.int(1, 5), x = R.int(2, 6);
      return Pb("Dans un rectangle de " + M("(x + " + a + ")") + " sur " + M("(x + " + b + ")") + ", on retire un carré de côté " + M("x") + ".", [["a) Coefficient de x dans l'aire restante", a + b], ["b) Terme constant", a * b], ["c) Aire restante pour x = " + x, (a + b) * x + a * b]],
        ["Aire du rectangle : (x + " + a + ")(x + " + b + ") ; retire x².", "Il reste " + (a + b) + "x + " + a * b + "."], "a) " + M("x^2 + " + (a + b) + "x + " + a * b + " - x^2") + " : " + (a + b) + ". b) " + a * b + ". c) " + M((a + b) + " \\cdot " + x + " + " + a * b + " = " + ((a + b) * x + a * b)) + "."); }],
    idrem: [() => { const n = R.int(10, 40), m = R.int(20, 60);
      return Pb("On remarque que " + M("(n + 1)^2 - n^2 = 2n + 1") + ".", [["a) Calcule (n + 1)² − n² pour n = " + n, 2 * n + 1], ["b) Calcule mentalement 101² − 100²", 201], ["c) Pour quel n a-t-on (n + 1)² − n² = " + (2 * m + 1) + " ?", m]],
        ["Développe (n + 1)² = n² + 2n + 1.", "c) Résous 2n + 1 = " + (2 * m + 1) + "."], "a) " + M("2 \\cdot " + n + " + 1 = " + (2 * n + 1)) + ". b) " + M("2 \\cdot 100 + 1 = 201") + ". c) " + M("n = " + m) + "."); }],
    factor: [() => { const a = pk([53, 54, 56, 61]), b = 100 - a, c = pk([98, 97, 102, 103]), d = 200 - c;
      return Pb("Calcul mental avec les identités (sans calculatrice).", [["a) " + a + "² − " + b + "²", a * a - b * b], ["b) " + c + " · " + d, c * d], ["c) 29²", 841]],
        ["a² − b² = (a − b)(a + b).", c + " · " + d + " = (100 " + (c > 100 ? "+ " : "− ") + Math.abs(c - 100) + ")(100 " + (c > 100 ? "− " : "+ ") + Math.abs(c - 100) + ")."], "a) " + M("(" + a + " - " + b + ")(" + a + " + " + b + ") = " + (a - b) + " \\cdot 100 = " + (a * a - b * b)) + ". b) " + M("100^2 - " + (c - 100) ** 2 + " = " + c * d) + ". c) " + M("(30 - 1)^2 = 900 - 60 + 1 = 841") + "."); }],
  };

  // « Trouve l'erreur » (24.11, chantier I, suite) : exposants d'un produit, signe devant la parenthèse, carré d'une somme.
  const camarade = () => pk(["Sam", "Lina", "Noé", "Inès", "Yanis", "Léa"]);
  MON[2].push(() => { let m, n; do { m = R.int(2, 5); n = R.int(2, 5); } while (m * n === m + n); const a = R.int(2, 6), b = R.int(2, 6), w = camarade();
    const L = X1(a * b, { x: m + n });
    return Qx(w + " écrit : « " + M(a + "x^{" + m + "} \\cdot " + b + "x^{" + n + "} = " + a * b + "x^{" + m * n + "}") + " ». Trouve l'erreur, puis donne le bon produit.", L,
      "Erreur : " + M("x^{" + m + "} \\cdot x^{" + n + "}") + " compte " + m + " + " + n + " facteurs " + M("x") + " : on <b>additionne</b> les exposants. " + M(a + " \\cdot " + b + " = " + a * b) + ", donc " + M(tex(L)) + ".",
      { ...red, ctx: "erreur", guide: [GS("Coefficient : " + M(a + " \\cdot " + b) + " = ?", a * b, M(a * b) + "."), GS("Exposant de " + M("x") + " : " + M(m + " + " + n) + " = ?", m + n, M(m + n) + "."), GX("Le bon produit :", L, M(tex(L)) + ".", "reduced")],
        traps: [TX(X1(a * b, { x: m * n }), "C'est le résultat de " + w + " : on multiplie les exposants seulement pour une puissance de puissance.")] }); });
  DIS[2].push(() => { const k = R.int(2, 7), a = R.int(2, 6), b = R.int(2, 9), L = lin(-k * a, k * b), F = lin(-k * a, -k * b), w = camarade();
    return Qx(w + " écrit : « " + M("-" + k + "(" + a + "x - " + b + ") = " + tex(F)) + " ». Trouve l'erreur, puis développe correctement.", L,
      "Erreur : le facteur " + M("-" + k) + " multiplie aussi " + M("-" + b) + ", et moins par moins donne plus : " + M("(-" + k + ") \\cdot (-" + b + ") = +" + k * b) + ". Donc " + M(tex(L)) + ".",
      { ...red, ctx: "erreur", guide: [GX("Premier terme : " + M("(-" + k + ") \\cdot " + a + "x") + " = ?", X1(-k * a), M(-k * a + "x") + ".", "reduced"), GS("Deuxième terme : " + M("(-" + k + ") \\cdot (-" + b + ")") + " = ?", k * b, M("+" + k * b) + "."), GX("Le bon développement :", L, M(tex(L)) + ".", "reduced")],
        traps: [TX(F, "C'est le résultat de " + w + " : attention au signe du deuxième produit.")] }); });
  IDR[2].push(() => { const b = pk([1, 1, 2, 3]), a = R.int(2, 9), s = pk([1, -1]), w = camarade(), bx = (b === 1 ? "" : b) + "x";
    const L = norm([[b * b, { x: 2 }], [2 * s * a * b, { x: 1 }], [a * a, {}]]), F = norm([[b * b, { x: 2 }], [a * a, {}]]);
    return Qx(w + " écrit : « " + M("(" + bx + (s > 0 ? " + " : " - ") + a + ")^2 = " + tex(F)) + " ». Trouve l'erreur, puis développe correctement.", L,
      "Erreur : un carré, c'est un produit : " + M("(" + bx + (s > 0 ? " + " : " - ") + a + ")(" + bx + (s > 0 ? " + " : " - ") + a + ")") + ". Il manque le double produit " + M((s > 0 ? "" : "-") + "2 \\cdot " + bx + " \\cdot " + a + " = " + 2 * s * a * b + "x") + ". Donc " + M(tex(L)) + ".",
      { ...red, ctx: "erreur", guide: [GS("Double produit : " + M("2 \\cdot " + bx + " \\cdot " + (s > 0 ? a : "(-" + a + ")")) + " ; coefficient de " + M("x") + " ?", 2 * s * a * b, M(2 * s * a * b + "x") + "."), GX("Le bon développement :", L, M(tex(L)) + ".", "reduced")],
        traps: [TX(F, "C'est le résultat de " + w + " : " + M("(a + b)^2 \\neq a^2 + b^2") + ", il manque le double produit.")] }); });

  // ===================== Enregistrement =====================
  const ALL = { litelab: LIT, valnum: VAL, reduire: RED, monomes: MON, parenth: PAR, distrib: DIS, idrem: IDR, factor: FAC };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => pk(lv[Math.min(Math.max(d, 1), 3)])();
    if (typeof VAR !== "undefined") VAR[id] = {};
    if (typeof PROB !== "undefined") delete PROB[id];
    PROB_EXTRA[id] = PROBS[id];
  }
  Object.assign(HINTS_EXTRA, {
    litelab: "Le début de la phrase donne l'opération faite en dernier : « le double de la somme… » → 2(… + …) ; « la somme du double… » → 2… + ….",
    valnum: "Remplace la lettre par sa valeur entre parenthèses, puis respecte les priorités : puissances, puis · et ÷, puis + et −.",
    reduire: "On additionne seulement les termes semblables : même lettre, même exposant. x et x² ne s'additionnent pas.",
    monomes: "Multiplie les coefficients ; pour chaque lettre, additionne les exposants (x = x¹).",
    parenth: "Un « − » devant une parenthèse change le signe de chaque terme à l'intérieur.",
    distrib: "Chaque terme de la première parenthèse multiplie chaque terme de la deuxième, puis on réduit.",
    idrem: "(a + b)² = a² + 2ab + b² ; (a − b)² = a² − 2ab + b² ; (a + b)(a − b) = a² − b².",
    factor: "Cherche d'abord un facteur commun, puis une identité remarquable ; vérifie en développant.",
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    litelab: ["Traduire une phrase en expression", "Écrire une expression (nombres, figure)", "Modéliser et simplifier une situation"],
    valnum: ["Calculer une expression pour une valeur", "Substituer plusieurs valeurs", "Substituer des fractions ou des puissances"],
    reduire: ["Réduire une expression du 1er degré", "Réduire et ordonner un polynôme", "Réduire avec fractions ou plusieurs lettres"],
    monomes: ["Multiplier des monômes", "Multiplier des monômes à plusieurs lettres", "Trouver un monôme manquant"],
    parenth: ["Supprimer une parenthèse précédée de −", "Supprimer plusieurs parenthèses", "Parenthèses et crochets"],
    distrib: ["Développer avec la simple distributivité", "Développer avec la double distributivité", "Développer et réduire une expression"],
    idrem: ["Développer (a ± b)² et (a + b)(a − b)", "Identités avec coefficients", "Utiliser les identités (calcul, différence)"],
    factor: ["Factoriser par mise en évidence", "Factoriser avec une identité remarquable", "Factoriser au maximum, trinôme"],
  });
})();

// Chantier 11e · 1. Nombres et opérations (17.11, demande de l'utilisateur : suivre le plan de cheminement de 11e,
// en comblant d'abord le début d'année). Une seule source pour prio, fracadd, fracmul, fracconv, puiss, sci, scicalc.
// Même standard que ch11_prop.js / ch11_litt.js : au moins 3 formes par niveau, pas à pas (guide) sur toutes les
// questions, erreurs typiques (traps), étiquette ctx ; défi = problèmes en plusieurs étapes. Formes et contextes
// modelés sur un dossier d'exercices de 11e (fractions irréductibles, puissances, notation scientifique en contexte :
// lumière, fourmis et baleine, pile de billets, globules rouges), jamais recopiés.
(function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; };
  const gcd2 = (a, b) => (b ? gcd2(b, a % b) : Math.abs(a));
  const lcm = (a, b) => (a * b) / gcd2(a, b);
  // ---------- rationnels exacts [n, d] ----------
  const rq = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd2(n, d) || 1; return [n / g, d / g]; };
  const qa = (x, y) => rq(x[0] * y[1] + y[0] * x[1], x[1] * y[1]);
  const qs = (x, y) => qa(x, [-y[0], y[1]]);
  const qm = (x, y) => rq(x[0] * y[0], x[1] * y[1]);
  const qd = (x, y) => rq(x[0] * y[1], x[1] * y[0]);
  const qv = (x) => x[0] / x[1];
  const qT = (x) => frac(x[0], x[1]); // TeX simplifié
  const fT = (n, d) => (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; // TeX tel quel
  const fP = (n, d) => (n < 0 ? "\\left(-\\frac{" + -n + "}{" + d + "}\\right)" : "\\frac{" + n + "}{" + d + "}"); // entre parenthèses si négatif
  const sg = (n) => (n < 0 ? " - " : " + ");
  // ---------- nombres ----------
  const r12 = (v) => +(+v).toPrecision(12);
  const N = (v) => { // virgule décimale, ' pour les milliers, jamais d'écriture 1e-7
    v = r12(v); let s = Math.abs(v) < 1e-6 && v !== 0 ? Math.abs(v).toFixed(15).replace(/0+$/, "") : String(Math.abs(v));
    let [i, f] = s.split(".");
    if (i.length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}");
    return (v < 0 ? "-" : "") + i + (f ? "{,}" + f : "");
  };
  const T = (v) => M(N(v));
  const S = (m, e) => N(m) + " \\cdot 10^{" + e + "}"; // notation scientifique en TeX
  const sv = (m, e) => r12(m * 10 ** e);
  const norm = (v) => { const e = Math.floor(Math.log10(Math.abs(v)) + 1e-9); return [r12(v / 10 ** e), e]; };
  const u = (s) => "\\ \\text{" + s + "}";
  // ---------- constructeurs ----------
  const keep = (value, traps) => { const seen = new Set(); return (traps || []).filter((t) => { if (!t || !isFinite(t.v) || Math.abs(t.v - value) <= 1e-9 * Math.max(1, Math.abs(value))) return false; const k = r12(t.v); if (seen.has(k)) return false; seen.add(k); return true; }); };
  const Qv = (q, value, sol, o = {}) => {
    const spec = Object.assign({ kind: "value", value }, o.plain ? { plain: true } : {}, o.sci ? { sci: true } : {}, o.final ? { final: true } : {}, o.round ? { round: o.round } : {});
    const x = { q, spec, sol, guide: o.guide, traps: keep(value, o.traps), ctx: o.ctx };
    if (o.fig) x.fig = o.fig;
    if (o.sci) { const [m, e] = norm(value); x.canon = String(m).replace(".", ",") + "*10^" + e; } // réponse type (affichage, tests)
    return x;
  };
  const GSci = (ask, value, sol) => ({ ask, spec: { kind: "value", value, sci: true }, sol });
  const TR = TRAP;
  const P = (q, parts, hints, sol) => ({ q, parts: parts.map(([label, value, round]) => ({ label, spec: Object.assign({ kind: "value", value }, round ? { round } : {}) })), hints, sol });
  const irr = (d, hi = 12) => { let a; do a = R.int(1, hi); while (gcd2(a, d) !== 1 || a === d); return a; }; // numérateur premier avec d
  const ne1 = (a, b) => { let v; do v = R.int(a, b); while (v === 0 || v === 1); return v; };
  const FI = "Calcule et donne le résultat sous forme de fraction irréductible : ";

  // ===================== prio : priorités des opérations =====================
  const PRIO = {
    1: [
      () => { const a = R.int(2, 9), b = R.int(2, 9), c = R.int(2, 9);
        return Qv("Calcule : " + M(a + " + " + b + " \\cdot " + c), a + b * c, M(a + " + " + b * c + " = " + (a + b * c)) + " : la multiplication passe avant l'addition.",
          { ctx: "pm", guide: [GS("D'abord la multiplication : " + M(b + " \\cdot " + c) + " = ?", b * c, M(b + " \\cdot " + c + " = " + b * c) + "."), GS("Puis l'addition : " + M(a + " + " + b * c) + " = ?", a + b * c, M(a + " + " + b * c + " = " + (a + b * c)) + ".")],
            traps: [TR((a + b) * c, "Tu as calculé de gauche à droite. La multiplication passe avant l'addition.")] }); },
      () => { let a = R.int(3, 9), b = R.int(3, 9), c = R.int(2, 9), d = R.int(2, 6); if (a * b <= c * d) [a, b, c, d] = [c + 2, d + 1, a - 1, b - 1];
        const v = a * b - c * d;
        return Qv("Calcule : " + M(a + " \\cdot " + b + " - " + c + " \\cdot " + d), v, M(a * b + " - " + c * d + " = " + v) + " : les deux produits d'abord.",
          { ctx: "2prod", guide: [GS("Premier produit : " + M(a + " \\cdot " + b) + " = ?", a * b, M(a * b) + "."), GS("Deuxième produit : " + M(c + " \\cdot " + d) + " = ?", c * d, M(c * d) + "."), GS("Soustraction : " + M(a * b + " - " + c * d) + " = ?", v, M(a * b + " - " + c * d + " = " + v) + ".")],
            traps: [TR((a * b - c) * d, "Après " + M(a * b) + ", tu as fait la soustraction avant le deuxième produit. Les deux multiplications passent avant.")] }); },
      () => { const a = R.int(15, 40), c = R.int(2, 6), k = R.int(2, 9), b = c * k;
        return Qv("Calcule : " + M(a + " - " + b + " : " + c), a - k, M(a + " - " + k + " = " + (a - k)) + " : la division passe avant la soustraction.",
          { ctx: "div", guide: [GS("D'abord la division : " + M(b + " : " + c) + " = ?", k, M(b + " : " + c + " = " + k) + "."), GS("Puis " + M(a + " - " + k) + " = ?", a - k, M(a - k) + ".")],
            traps: [TR((a - b) / c, "Tu as soustrait avant de diviser. La division passe avant la soustraction.")] }); },
      () => { const a = R.int(2, 9), b = R.int(3, 8), c = R.int(2, 9), x = pk([
          ["Léa achète " + b + " cahiers à " + c + " CHF et une gomme à " + a + " CHF.", "achat"],
          ["Au cinéma, une famille paie " + b + " billets à " + c + " CHF et un grand pop-corn à " + a + " CHF.", "cine"],
          ["Un taxi facture " + a + " CHF de prise en charge, puis " + c + " CHF par kilomètre. La course fait " + b + " km.", "taxi"]]);
        return Qv(x[0] + " Écris le calcul en une seule ligne, puis calcule le prix total (en CHF).", a + b * c, "Calcul : " + M(a + " + " + b + " \\cdot " + c + " = " + a + " + " + b * c + " = " + (a + b * c)) + " CHF.",
          { ctx: x[1], guide: [GS("Prix des " + b + " éléments au même prix : " + M(b + " \\cdot " + c) + " = ?", b * c, M(b * c) + " CHF."), GS("Ajoute les " + a + " CHF : total ?", a + b * c, M(b * c + " + " + a + " = " + (a + b * c)) + " CHF.")],
            traps: [TR(a + b + c, "On ne peut pas additionner un nombre d'objets et un prix : multiplie d'abord " + b + " par " + c + "."), TR((a + b) * c, "Seuls les " + b + " éléments coûtent " + c + " CHF chacun : " + M(a + " + " + b + " \\cdot " + c) + ".")] }); },
    ],
    2: [
      () => { const a = R.int(20, 45), b = R.int(2, 6), c = R.int(6, 9), e = R.int(1, 4), v = a - b * (c - e);
        return Qv("Calcule : " + M(a + " - " + b + " \\cdot (" + c + " - " + e + ")"), v, M(a + " - " + b + " \\cdot " + (c - e) + " = " + a + " - " + b * (c - e) + " = " + v) + ".",
          { ctx: "paren", guide: [GS("D'abord la parenthèse : " + M(c + " - " + e) + " = ?", c - e, M(c - e) + "."), GS("Puis la multiplication : " + M(b + " \\cdot " + (c - e)) + " = ?", b * (c - e), M(b * (c - e)) + "."), GS("Enfin " + M(a + " - " + b * (c - e)) + " = ?", v, M(v) + ".")],
            traps: [TR((a - b) * (c - e), "Tu as fait la soustraction avant la multiplication."), TR(a - b * c - e, "La parenthèse se calcule d'abord : " + M(b + " \\cdot (" + c + " - " + e + ")") + ", pas " + M(b + " \\cdot " + c + " - " + e) + ".")] }); },
      () => { const k = R.int(2, 6), m = R.int(2, 9), s = k * m, a = R.int(1, s - 1), b = s - a, c = R.int(k + 2, k + 9), e = c - k;
        return Qv("Calcule : " + M("\\frac{" + a + " + " + b + "}{" + c + " - " + e + "}"), m, M("\\frac{" + s + "}{" + k + "} = " + m) + " : la barre de fraction agit comme des parenthèses.",
          { ctx: "barre", guide: [GS("Le numérateur : " + M(a + " + " + b) + " = ?", s, M(s) + "."), GS("Le dénominateur : " + M(c + " - " + e) + " = ?", k, M(k) + "."), GS("Le quotient : " + M(s + " : " + k) + " = ?", m, M(m) + ".")],
            traps: [TR(a + b / c - e, "La barre de fraction groupe tout le haut et tout le bas : calcule-les d'abord, puis divise.")] }); },
      () => { const a = R.int(2, 5), c = R.int(6, 12), d = R.int(1, 5), b = R.int(c - d + 2, c - d + 9), v = a * (b - (c - d));
        return Qv("Calcule : " + M(a + " \\cdot [" + b + " - (" + c + " - " + d + ")]"), v, M(a + " \\cdot [" + b + " - " + (c - d) + "] = " + a + " \\cdot " + (b - c + d) + " = " + v) + ".",
          { ctx: "crochet", guide: [GS("La parenthèse intérieure : " + M(c + " - " + d) + " = ?", c - d, M(c - d) + "."), GS("Le crochet : " + M(b + " - " + (c - d)) + " = ?", b - c + d, M(b - c + d) + "."), GS("Le produit : " + M(a + " \\cdot " + (b - c + d)) + " = ?", v, M(v) + ".")],
            traps: [TR(a * (b - c - d), "Le « − » devant la parenthèse change le signe de " + M(d) + " : " + M(b + " - (" + c + " - " + d + ") = " + b + " - " + c + " + " + d) + "."), TR(a * b - (c - d), "Le crochet entier est multiplié par " + M(a) + ".")] }); },
      () => { const a = R.int(2, 9), b = R.int(2, 6), c = R.int(2, 9), d = R.int(1, 9), v = -a + b * c + d;
        return Qv("Calcule : " + M("(-" + a + ") - " + b + " \\cdot (-" + c + ") + " + d), v, M("(-" + a + ") - (-" + b * c + ") + " + d + " = -" + a + " + " + b * c + " + " + d + " = " + v) + ".",
          { ctx: "rel", guide: [GS("Le produit : " + M(b + " \\cdot (-" + c + ")") + " = ?", -b * c, M(-b * c) + "."), GS(M("(-" + a + ") - (-" + b * c + ")") + " = ? (soustraire un négatif, c'est ajouter)", b * c - a, M("-" + a + " + " + b * c + " = " + (b * c - a)) + "."), GS("Ajoute " + M(d) + " : résultat ?", v, M(v) + ".")],
            traps: [TR(-a - b * c + d, "Soustraire " + M("(-" + b * c + ")") + ", c'est ajouter " + M(b * c) + "."), TR((-a - b) * -c + d, "La multiplication passe avant la soustraction.")] }); },
    ],
    3: [
      () => { const k = R.int(2, 4), b = R.int(1, 6), c = b + k, a = R.int(2 * k * k + 1, 2 * k * k + 20), v = a - 2 * k * k;
        return Qv("Calcule : " + M(a + " - 2 \\cdot (" + b + " - " + c + ")^2"), v, M(a + " - 2 \\cdot (-" + k + ")^2 = " + a + " - 2 \\cdot " + k * k + " = " + a + " - " + 2 * k * k + " = " + v) + ".",
          { ctx: "carre", guide: [GS("La parenthèse : " + M(b + " - " + c) + " = ?", -k, M(-k) + "."), GS("Son carré : " + M("(-" + k + ")^2") + " = ?", k * k, M(k * k) + " (un carré est positif)."), GS("Puis " + M(a + " - 2 \\cdot " + k * k) + " = ?", v, M(a + " - " + 2 * k * k + " = " + v) + ".")],
            traps: [TR(a - 4 * k * k, "Le carré porte seulement sur la parenthèse, pas sur le 2 : " + M("2 \\cdot " + k * k) + "."), TR((a - 2) * k * k, "La multiplication passe avant la soustraction."), TR(a + 2 * k * k, "On retire " + M("2 \\cdot " + k * k) + " : le carré est positif, mais le signe « − » devant reste.")] }); },
      () => { const a = R.int(2, 6), k = R.int(2, 3), b = R.int(1, 7), c = b + k, v = -(a * a) - k ** 3;
        return Qv("Calcule : " + M("-" + a + "^2 + (" + b + " - " + c + ")^3"), v, M("-" + a * a + " + (-" + k + ")^3 = -" + a * a + " + (-" + k ** 3 + ") = " + v) + ".",
          { ctx: "puiss", guide: [GS(M("-" + a + "^2") + " = ? (le carré ne porte que sur " + M(a) + ")", -(a * a), M(-(a * a)) + "."), GS(M("(" + b + " - " + c + ")^3 = (-" + k + ")^3") + " = ?", -(k ** 3), M(-(k ** 3)) + " (exposant impair : négatif)."), GS("Somme : " + M("-" + a * a + " + (-" + k ** 3 + ")") + " = ?", v, M(v) + ".")],
            traps: [TR(a * a - k ** 3, M("-" + a + "^2") + " vaut " + M(-(a * a)) + " : le carré ne porte que sur " + M(a) + ", pas sur le signe."), TR(-(a * a) + k ** 3, "Le cube d'un nombre négatif est négatif.")] }); },
      () => { let a, m, k, b, d, e, c; do { a = R.int(2, 6); k = pk([-5, -4, -3, -2, 2, 3, 4, 5]); m = nz(-6, 6); b = k * m - a * a; d = R.int(2, 5); e = R.int(2, 5); c = k + d * e; } while (b < 1 || b > 40 || Math.abs(m) === 1 || c < 2);
        return Qv("Calcule : " + M("\\frac{(-" + a + ")^2 + " + b + "}{" + c + " - " + d + " \\cdot " + e + "}"), m, M("\\frac{" + a * a + " + " + b + "}{" + c + " - " + d * e + "} = \\frac{" + (a * a + b) + "}{" + k + "} = " + m) + ".",
          { ctx: "frac", guide: [GS("Numérateur : " + M("(-" + a + ")^2 + " + b) + " = ?", a * a + b, M(a * a + " + " + b + " = " + (a * a + b)) + "."), GS("Dénominateur : " + M(c + " - " + d + " \\cdot " + e) + " = ?", k, M(c + " - " + d * e + " = " + k) + "."), GS("Le quotient : " + M(par(a * a + b) + " : " + par(k)) + " = ?", m, M(m) + ".")],
            traps: [TR((b - a * a) / k, M("(-" + a + ")^2") + " est positif : " + M(a * a) + "."), TR((a * a + b) / ((c - d) * e), "Au dénominateur, la multiplication passe avant la soustraction.")] }); },
      () => { const d = R.int(2, 4), e = R.int(2, 5), c = R.int(1, 9), inner = c - d * e, b = R.int(1, 8), mid = b - inner, f = R.int(2, 4), a = Math.max(2, R.int(mid * f - 15, mid * f + 15)), v = a - mid * f;
        return Qv("Calcule : " + M(a + " - [" + b + " - (" + c + " - " + d + " \\cdot " + e + ")] \\cdot " + f), v, M(a + " - [" + b + " - (" + inner + ")] \\cdot " + f + " = " + a + " - " + mid + " \\cdot " + f + " = " + v) + ".",
          { ctx: "crochet3", guide: [GS("Parenthèse : " + M(c + " - " + d + " \\cdot " + e) + " = ?", inner, M(c + " - " + d * e + " = " + inner) + "."), GS("Crochet : " + M(b + " - " + par(inner)) + " = ?", mid, M(mid) + "."), GS("Produit : " + M(par(mid) + " \\cdot " + f) + " = ?", mid * f, M(mid * f) + "."), GS("Enfin " + M(a + " - " + par(mid * f)) + " = ?", v, M(v) + ".")],
            traps: [TR((a - mid) * f, "La multiplication par " + M(f) + " passe avant la soustraction."), TR(a - (b - c - d * e) * f, "Le « − » devant la parenthèse change le signe de chaque terme.")] }); },
    ],
  };

  // ===================== fracadd : additionner et soustraire des fractions =====================
  const cop = (lo, d) => { let a; do a = R.int(lo, d - 1); while (gcd2(a, d) !== 1); return a; }; // numérateur premier avec d, 1 ≤ a < d
  const PAIRS = [[4, 6], [6, 8], [6, 9], [10, 15], [8, 12], [9, 12], [12, 18], [4, 10], [6, 10], [8, 10], [12, 16], [15, 20]];
  const TRIPLES = [[2, 3, 4], [3, 4, 6], [2, 5, 10], [4, 6, 12], [3, 5, 15], [2, 3, 8], [4, 5, 10], [3, 4, 12]];
  const addGuide = (fs, res) => { // fs : liste de [n, d] signés ; pas à pas : dénominateur commun, numérateurs, résultat
    const L = fs.reduce((l, f) => lcm(l, f[1]), 1), nums = fs.map(([n, d]) => n * (L / d)), sum = nums.reduce((s, x) => s + x, 0);
    return [GS("Plus petit dénominateur commun de " + fs.map((f) => M(f[1])).join(", ").replace(/, ([^,]*)$/, " et $1") + " ?", L, M(L) + "."),
      ...fs.length === 2 ? [GS("Numérateur de " + M(fT(...fs[0])) + " avec le dénominateur " + M(L) + " ?", nums[0], M(fT(...fs[0]) + " = " + fT(nums[0], L)) + ".")] : [],
      GS("Additionne les numérateurs (avec leurs signes) : " + M(nums.map((x, i) => (i ? sg(x) : x < 0 ? "-" : "") + Math.abs(x)).join("")) + " = ?", sum, M(sum) + ", donc " + M(fT(sum, L)) + "."),
      GS("Simplifie si possible : résultat ?", qv(res), M(fT(sum, L) + (gcd2(sum, L) > 1 ? " = " + qT(res) : "")) + ".")]; };
  const FADD = {
    1: [
      () => { const b = R.int(5, 15); let a, c; do { a = R.int(1, b - 1); c = R.int(1, b - 1); } while (a === c || a + c === b);
        const res = rq(a + c, b);
        return Qv(FI + M(fT(a, b) + " + " + fT(c, b)), qv(res), M(fT(a + c, b) + (gcd2(a + c, b) > 1 ? " = " + qT(res) : "")) + " : même dénominateur, on additionne les numérateurs.",
          { ctx: "meme", guide: [GS("Les dénominateurs sont égaux. Somme des numérateurs : " + M(a + " + " + c) + " = ?", a + c, M(fT(a + c, b)) + "."), GS("Simplifie si possible : résultat ?", qv(res), M(qT(res)) + ".")],
            traps: [TR((a + c) / (2 * b), "On garde le dénominateur " + M(b) + " : on n'additionne que les numérateurs.")] }); },
      () => { const b = pk([2, 3, 4, 5]), k = pk([2, 3, 4]), B = b * k, a = cop(1, b), c = cop(1, B), minus = R.rand() < 0.5;
        const res = minus ? qs([a, b], [c, B]) : qa([a, b], [c, B]);
        return Qv(FI + M(fT(a, b) + (minus ? " - " : " + ") + fT(c, B)), qv(res), M(fT(a * k, B) + (minus ? " - " : " + ") + fT(c, B) + " = " + fT(res[0] * (B / res[1]), B) + (res[1] !== B ? " = " + qT(res) : "")) + ".",
          { ctx: "multiple", guide: [GS(M(B) + " est un multiple de " + M(b) + ". Écris " + M(fT(a, b)) + " avec le dénominateur " + M(B) + " : numérateur ?", a * k, M(fT(a, b) + " = " + fT(a * k, B)) + "."), GS((minus ? "Soustrais" : "Additionne") + " les numérateurs, puis simplifie : résultat ?", qv(res), M(qT(res)) + ".")],
            traps: [TR(minus ? (a - c) / (b - B) : (a + c) / (b + B), "On n'opère jamais sur les dénominateurs : on les rend égaux, puis on " + (minus ? "soustrait" : "additionne") + " les numérateurs."), TR(minus ? (a - c) / B : (a + c) / B, "Le dénominateur commun est bon, mais il faut aussi multiplier le numérateur de " + M(fT(a, b)) + " par " + M(k) + ".")] }); },
      () => { const n = R.int(1, 4), b = R.int(3, 9), a = cop(1, b), minus = R.rand() < 0.6, res = minus ? rq(n * b - a, b) : rq(n * b + a, b);
        return Qv(FI + M(n + (minus ? " - " : " + ") + fT(a, b)), qv(res), M(fT(n * b, b) + (minus ? " - " : " + ") + fT(a, b) + " = " + qT(res)) + ".",
          { ctx: "entier", guide: [GS("Écris " + M(n) + " comme une fraction de dénominateur " + M(b) + " : numérateur ?", n * b, M(n + " = " + fT(n * b, b)) + "."), GS("Résultat ?", qv(res), M(qT(res)) + ".")],
            traps: [TR(minus ? (n - a) / b : (n + a) / b, M(n) + " vaut " + M(fT(n * b, b)) + " : écris-le d'abord sur " + M(b) + ".")] }); },
      () => { let b, e, a, c; do { [b, e] = pk([[2, 3], [3, 4], [4, 6], [3, 8], [5, 10], [4, 5], [6, 8], [2, 5]]); if (R.rand() < 0.5) [b, e] = [e, b]; a = cop(1, b); c = cop(1, e); } while (a / b + c / e >= 1);
        const res = qa([a, b], [c, e]), x = pk([
          ["Pour une fête, Lina prépare les " + M(fT(a, b)) + " des sandwichs et Tom les " + M(fT(c, e)) + ". Quelle fraction des sandwichs ont-ils préparée ensemble ?", "fete"],
          ["Un réservoir est rempli aux " + M(fT(a, b)) + ". On ajoute " + M(fT(c, e)) + " du réservoir. À quelle fraction est-il rempli ?", "reservoir"],
          ["Noé fait " + M(fT(a, b)) + " de son trajet à vélo et " + M(fT(c, e)) + " en bus. Quelle fraction du trajet a-t-il faite ?", "trajet"]]);
        return Qv(x[0] + " (fraction irréductible)", qv(res), M(fT(a, b) + " + " + fT(c, e) + " = " + qT(res)) + ".", { ctx: x[1], guide: addGuide([[a, b], [c, e]], res),
          traps: [TR((a + c) / (b + e), "On n'additionne pas les dénominateurs : mets d'abord les deux fractions sur le même dénominateur.")] }); },
    ],
    2: [
      () => { const [b, e] = pk(PAIRS), a = cop(1, b), c = cop(1, e), minus = R.rand() < 0.4, res = minus ? qs([a, b], [c, e]) : qa([a, b], [c, e]), L = lcm(b, e);
        return Qv(FI + M(fT(a, b) + (minus ? " - " : " + ") + fT(c, e)), qv(res), "Dénominateur commun " + M(L) + " (et non " + M(b * e) + ") : " + M(fT(a * L / b, L) + (minus ? " - " : " + ") + fT(c * L / e, L) + " = " + qT(res)) + ".",
          { ctx: "ppcm", guide: addGuide([[a, b], [minus ? -c : c, e]], res),
            traps: [TR(minus ? (a - c) / (b - e) : (a + c) / (b + e), "On n'opère pas sur les dénominateurs : il faut un dénominateur commun."), TR(minus ? (a - c) / L : (a + c) / L, "Le dénominateur commun est bon, mais les numérateurs doivent être multipliés par le même nombre que leur dénominateur.")] }); },
      () => { let b, e, a, c; do { [b, e] = pk(PAIRS); if (R.rand() < 0.5) [b, e] = [e, b]; a = cop(1, b); c = cop(1, e); } while (a / b >= c / e);
        const res = qs([a, b], [c, e]);
        return Qv(FI + M(fT(a, b) + " - " + fT(c, e)), qv(res), M(fT(a * lcm(b, e) / b, lcm(b, e)) + " - " + fT(c * lcm(b, e) / e, lcm(b, e)) + " = " + qT(res)) + " (résultat négatif : " + M(fT(c, e)) + " est plus grand).",
          { ctx: "negatif", guide: addGuide([[a, b], [-c, e]], res),
            traps: [TR(-qv(res), "Attention au signe : " + M(fT(c, e)) + " est plus grand que " + M(fT(a, b)) + ", le résultat est négatif."), TR((a - c) / (b - e), "On n'opère pas sur les dénominateurs.")] }); },
      () => { const [b, e, h] = pk(TRIPLES), a = cop(1, b), c = cop(1, e), g = cop(1, h), res = qs(qa([a, b], [c, e]), [g, h]);
        return Qv(FI + M(fT(a, b) + " + " + fT(c, e) + " - " + fT(g, h)), qv(res), "Dénominateur commun " + M(lcm(lcm(b, e), h)) + " : " + M(qT(res)) + ".",
          { ctx: "trois", guide: addGuide([[a, b], [c, e], [-g, h]], res),
            traps: [TR((a + c - g) / (b + e + h), "On n'additionne pas les dénominateurs : il faut un dénominateur commun aux trois fractions.")] }); },
      () => { let b, e, a, c; do { [b, e] = pk([[3, 4], [4, 6], [3, 5], [5, 10], [6, 8], [4, 5], [3, 8], [2, 5], [6, 9]]); a = cop(1, b); c = cop(1, e); } while (a / b + c / e >= 0.95);
        const used = qa([a, b], [c, e]), res = qs([1, 1], used), x = pk([
          ["Sur un trajet, Mia fait " + M(fT(a, b)) + " à vélo, " + M(fT(c, e)) + " en bus et le reste à pied. Quelle fraction du trajet fait-elle à pied ?", "pied"],
          ["Une famille consacre " + M(fT(a, b)) + " de son budget au loyer et " + M(fT(c, e)) + " à la nourriture. Quelle fraction du budget reste-t-il ?", "budget"],
          ["Dans un jardin, " + M(fT(a, b)) + " de la surface est un potager et " + M(fT(c, e)) + " une pelouse. Le reste est une terrasse. Quelle fraction occupe la terrasse ?", "jardin"]]);
        return Qv(x[0] + " (fraction irréductible)", qv(res), M("1 - \\left(" + fT(a, b) + " + " + fT(c, e) + "\\right) = 1 - " + qT(used) + " = " + qT(res)) + ".",
          { ctx: x[1], guide: [GS("Fraction déjà utilisée : " + M(fT(a, b) + " + " + fT(c, e)) + " = ?", qv(used), M(qT(used)) + "."), GS("Le tout vaut 1 : reste " + M("1 - " + qT(used)) + " = ?", qv(res), M(qT(res)) + ".")],
            traps: [TR(qv(used), "C'est la partie déjà utilisée ; on demande ce qui reste : " + M("1 - " + qT(used)) + "."), TR(1 - (a + c) / (b + e), "On n'additionne pas les dénominateurs.")] }); },
    ],
    3: [
      () => { const [b, e, h] = pk(TRIPLES), a = irr(b), c = irr(e), g = irr(h), A = -a, res = qs(qa([A, b], [c, e]), [g, h]);
        return Qv(FI + M(fT(A, b) + " + " + fT(c, e) + " - " + fT(g, h)), qv(res), "Dénominateur commun " + M(lcm(lcm(b, e), h)) + " : " + M(qT(res)) + ".",
          { ctx: "rel3", guide: addGuide([[A, b], [c, e], [-g, h]], res),
            traps: [TR(qv(qs(qa([a, b], [c, e]), [g, h])), "La première fraction est négative : son numérateur compte avec le signe « − »."), TR(-qv(res), "Vérifie le signe du résultat.")] }); },
      () => { const [b, e, h] = pk(TRIPLES), a = cop(1, b), c = cop(1, e), g = cop(1, h), inner = qs([c, e], [g, h]), res = qs([a, b], inner);
        if (inner[0] === 0) return null;
        return Qv(FI + M(fT(a, b) + " - \\left(" + fT(c, e) + " - " + fT(g, h) + "\\right)"), qv(res), M(fT(a, b) + " - " + fP(...inner) + " = " + qT(res)) + ". Le « − » devant la parenthèse change le signe de " + M(fT(g, h)) + ".",
          { ctx: "parmoins", guide: [GS("D'abord la parenthèse : " + M(fT(c, e) + " - " + fT(g, h)) + " = ?", qv(inner), M(qT(inner)) + "."), GS("Puis " + M(fT(a, b) + " - " + fP(...inner)) + " = ?", qv(res), M(qT(res)) + ".")],
            traps: [TR(qv(qs(qs([a, b], [c, e]), [g, h])), "Le « − » devant la parenthèse change le signe de chaque terme : " + M("-\\left(" + fT(c, e) + " - " + fT(g, h) + "\\right) = -" + fT(c, e) + " + " + fT(g, h)) + ".")] }); },
      () => { let b, e, a, c; do { [b, e] = pk(PAIRS); if (R.rand() < 0.5) [b, e] = [e, b]; a = cop(1, b); c = cop(1, e); } while (a / b >= c / e);
        const res = qs([c, e], [a, b]);
        return Qv("Quelle fraction faut-il ajouter à " + M(fT(a, b)) + " pour obtenir " + M(fT(c, e)) + " ? (fraction irréductible)", qv(res), M(fT(c, e) + " - " + fT(a, b) + " = " + qT(res)) + ". Vérification : " + M(fT(a, b) + " + " + qT(res) + " = " + fT(c, e)) + ".",
          { ctx: "manquant", guide: [GS("On cherche " + M("x") + " tel que " + M(fT(a, b) + " + x = " + fT(c, e)) + ". Donc " + M("x = " + fT(c, e) + " - " + fT(a, b)) + ". Dénominateur commun ?", lcm(b, e), M(lcm(b, e)) + "."), GS("Calcule " + M(fT(c, e) + " - " + fT(a, b)) + " : résultat ?", qv(res), M(qT(res)) + ".")],
            traps: [TR(a / b + c / e, "Tu as additionné les deux fractions. On cherche l'écart entre elles : " + M(fT(c, e) + " - " + fT(a, b)) + "."), TR(-qv(res), "Dans l'ordre : on part de " + M(fT(a, b)) + " pour arriver à " + M(fT(c, e)) + " (plus grand), on ajoute donc une quantité positive.")] }); },
    ],
  };

  // ===================== fracmul : multiplier et diviser des fractions =====================
  const FMUL = {
    1: [
      () => { let a, b, c, e; do { b = R.int(3, 12); e = R.int(3, 12); a = cop(1, b); c = cop(1, e); } while (gcd2(a * c, b * e) === 1 || a * c === b * e);
        const res = rq(a * c, b * e);
        return Qv(FI + M(fT(a, b) + " \\cdot " + fT(c, e)), qv(res), M("\\frac{" + a + " \\cdot " + c + "}{" + b + " \\cdot " + e + "} = " + fT(a * c, b * e) + " = " + qT(res)) + " (on peut aussi simplifier avant de multiplier).",
          { ctx: "produit", guide: [GS("Numérateur : " + M(a + " \\cdot " + c) + " = ?", a * c, M(a * c) + "."), GS("Dénominateur : " + M(b + " \\cdot " + e) + " = ?", b * e, M(b * e) + "."), GS("Simplifie " + M(fT(a * c, b * e)) + " : résultat ?", qv(res), M(qT(res)) + ".")],
            traps: [TR((a * e) / (b * c), "Ça, c'est la division. Pour multiplier : numérateur fois numérateur, dénominateur fois dénominateur."), TR((a + c) / (b + e), "On multiplie les numérateurs entre eux et les dénominateurs entre eux, on n'additionne pas.")] }); },
      () => { let n, b, a; do { n = R.int(2, 12); b = R.int(3, 12); a = cop(1, b); } while (gcd2(n, b) === 1 || (n * a) % b === 0);
        const res = rq(n * a, b);
        return Qv(FI + M(n + " \\cdot " + fT(a, b)), qv(res), M(fT(n * a, b) + " = " + qT(res)) + " : seul le numérateur est multiplié par " + M(n) + ".",
          { ctx: "entierx", guide: [GS(M(n + " \\cdot " + fT(a, b) + " = \\frac{" + n + " \\cdot " + a + "}{" + b + "}") + ". Numérateur ?", n * a, M(n * a) + "."), GS("Simplifie " + M(fT(n * a, b)) + " : résultat ?", qv(res), M(qT(res)) + ".")],
            traps: [TR(a / b, "Tu as multiplié aussi le dénominateur par " + M(n) + " : seul le numérateur l'est (" + M(n + " = " + fT(n, 1)) + ")."), TR(a / (n * b), "Multiplier par " + M(n) + " agrandit : c'est le numérateur qu'on multiplie.")] }); },
      () => { const b = pk([3, 4, 5, 6, 8, 10]), a = cop(2, b), m = R.int(3, 25), x = pk([
          ["Les " + M(fT(a, b)) + " des " + M(b * m) + " élèves d'une école mangent à la cantine. Combien d'élèves mangent à la cantine ?", "cantine", ""],
          ["Un randonneur a parcouru les " + M(fT(a, b)) + " d'un sentier de " + M(b * m) + " km. Combien de kilomètres a-t-il parcourus ?", "sentier", " km"],
          ["Sara dépense les " + M(fT(a, b)) + " de ses " + M(b * m * 10) + " CHF d'économies pour un vélo. Combien coûte le vélo (CHF) ?", "velo", " CHF"]]);
        const N0 = x[1] === "velo" ? b * m * 10 : b * m, part = N0 / b;
        return Qv(x[0], a * part, M(fT(a, b) + " \\cdot " + N(N0) + " = " + N(N0) + " : " + b + " \\cdot " + a + " = " + N(a * part)) + x[2] + ".",
          { ctx: x[1], guide: [GS("Un " + ({ 3: "tiers", 4: "quart", 5: "cinquième", 6: "sixième", 8: "huitième", 10: "dixième" })[b] + " : " + M(N(N0) + " : " + b) + " = ?", part, M(N(part)) + "."), GS("Les " + M(fT(a, b)) + " : " + M(a + " \\cdot " + N(part)) + " = ?", a * part, M(N(a * part)) + x[2] + ".")],
            traps: [TR(part, "Ça, c'est " + M(fT(1, b)) + " seulement : il faut encore multiplier par " + M(a) + "."), TR((N0 * b) / a, "Prendre les " + M(fT(a, b)) + " de " + M(N(N0)) + ", c'est " + M(N(N0) + " : " + b + " \\cdot " + a) + ".")] }); },
    ],
    2: [
      () => { let a, b, c, e; do { b = R.int(2, 10); e = R.int(2, 10); a = irr(b); c = irr(e); } while (a * e === b * c || a * c === b * e);
        const res = rq(a * e, b * c);
        return Qv(FI + M(fT(a, b) + " : " + fT(c, e)), qv(res), "Diviser, c'est multiplier par l'inverse : " + M(fT(a, b) + " \\cdot " + fT(e, c) + " = " + qT(res)) + ".",
          { ctx: "division", guide: [GS("L'inverse de " + M(fT(c, e)) + " est " + M(fT(e, c)) + ". Sa valeur ? (tape la fraction)", e / c, M(fT(e, c)) + "."), GS("Calcule " + M(fT(a, b) + " \\cdot " + fT(e, c)) + " : résultat ?", qv(res), M(fT(a * e, b * c) + (gcd2(a * e, b * c) > 1 ? " = " + qT(res) : "")) + ".")],
            traps: [TR((a * c) / (b * e), "Tu as multiplié sans inverser la deuxième fraction."), TR((b * c) / (a * e), "On inverse la deuxième fraction (le diviseur), pas la première.")] }); },
      () => { let a, b, n; do { b = R.int(2, 9); a = R.int(2, 15); n = R.int(2, 9); } while (gcd2(a, b) !== 1 || gcd2(a, n) === 1);
        const res = rq(a, b * n);
        return Qv(FI + M(fT(a, b) + " : " + n), qv(res), M(fT(a, b) + " \\cdot " + fT(1, n) + " = " + fT(a, b * n) + " = " + qT(res)) + ".",
          { ctx: "parentier", guide: [GS("Diviser par " + M(n) + ", c'est multiplier par son inverse. L'inverse de " + M(n) + " ?", 1 / n, M(fT(1, n)) + "."), GS("Calcule " + M(fT(a, b) + " \\cdot " + fT(1, n)) + " : résultat ?", qv(res), M(qT(res)) + ".")],
            traps: [TR((a * n) / b, "Tu as multiplié par " + M(n) + " au lieu de diviser."), TR(a / n / b * n * n, "Diviser par " + M(n) + " : le dénominateur est multiplié par " + M(n) + ".")] }); },
      () => { let a, b, c, e; do { b = R.int(2, 9); e = R.int(2, 9); a = irr(b); c = irr(e); } while (a * c === b * e || a * e === b * c);
        const div = R.rand() < 0.5, sA = -1, sC = pk([1, -1]), res = div ? qd([sA * a, b], [sC * c, e]) : qm([sA * a, b], [sC * c, e]);
        return Qv(FI + M(fP(sA * a, b) + (div ? " : " : " \\cdot ") + fP(sC * c, e)), qv(res), "Signe : " + (sC < 0 ? "deux négatifs donnent un positif" : "un seul négatif, le résultat est négatif") + ". " + M(qT(res)) + ".",
          { ctx: "signes", guide: [GS("Le signe du résultat : tape " + M("1") + " s'il est positif, " + M("-1") + " s'il est négatif.", sC < 0 ? 1 : -1, sC < 0 ? "Positif (− par − donne +)." : "Négatif (− par + donne −)."), GS("Le résultat ?", qv(res), M(qT(res)) + ".")],
            traps: [TR(-qv(res), "Vérifie le signe : " + (sC < 0 ? "deux facteurs négatifs donnent un résultat positif." : "un seul facteur négatif donne un résultat négatif.")), TR(div ? qv(qm([sA * a, b], [sC * c, e])) : qv(qd([sA * a, b], [sC * c, e])), div ? "Pour diviser, il faut inverser la deuxième fraction." : "Pour multiplier, on n'inverse rien.")] }); },
      () => { const [a, b] = pk([[3, 4], [1, 4], [2, 5], [3, 2], [1, 3], [3, 5], [5, 4]]), k = R.int(2, 8), N0 = a * k, x = pk([
          ["Avec " + M(N0) + " litres de jus, combien de bouteilles de " + M(fT(a, b) + u("L")) + " peut-on remplir ?", "bouteilles"],
          ["On coupe un ruban de " + M(N0) + " m en morceaux de " + M(fT(a, b) + u("m")) + ". Combien de morceaux obtient-on ?", "ruban"],
          ["Une recette demande " + M(fT(a, b)) + " de kilo de farine. Combien de recettes peut-on faire avec " + M(N0) + " kg ?", "recette"]]);
        return Qv(x[0], k * b, M(N0 + " : " + fT(a, b) + " = " + N0 + " \\cdot " + fT(b, a) + " = " + k * b) + ".",
          { ctx: x[1], guide: [GS("On cherche combien de fois " + M(fT(a, b)) + " entre dans " + M(N0) + " : c'est une division. L'inverse de " + M(fT(a, b)) + " ?", b / a, M(fT(b, a)) + "."), GS("Calcule " + M(N0 + " \\cdot " + fT(b, a)) + " = ?", k * b, M(k * b) + ".")],
            traps: [TR((N0 * a) / b, "Tu as multiplié par " + M(fT(a, b)) + " : on cherche combien de fois la portion entre dans le total, c'est une division.")] }); },
    ],
    3: [
      () => { /* 24.11 (commentaire fracmul-3-3an) : la division doit se simplifier et le résultat rester lisible (ex. 65/126 refusé). */
        let b, e, a, c, g, h, inner, res, ok = false;
        for (let t = 0; t < 300 && !ok; t++) {
          [b, e] = pk([[4, 3], [6, 4], [2, 5], [3, 5], [6, 9], [4, 6]]); a = cop(1, b); c = cop(1, e); g = R.int(2, 7); h = irr(g, 9); inner = qs([a, b], [c, e]);
          if (inner[0] === 0 || h === 1) continue;
          res = qd(inner, [g, h]);
          ok = (gcd2(inner[0], g) > 1 || gcd2(h, inner[1]) > 1) && res[1] <= 12 && Math.abs(res[0]) <= 20 && Math.abs(res[0]) !== res[1];
        }
        if (!ok) return null;
        return Qv(FI + M("\\left(" + fT(a, b) + " - " + fT(c, e) + "\\right) : " + fT(g, h)), qv(res), M(qT(inner) + " \\cdot " + fT(h, g) + " = " + qT(res)) + ".",
          { ctx: "parendiv", guide: [GS("La parenthèse : " + M(fT(a, b) + " - " + fT(c, e)) + " = ?", qv(inner), M(qT(inner)) + "."), GS("L'inverse de " + M(fT(g, h)) + " ?", h / g, M(fT(h, g)) + "."), GS("Le produit : résultat ?", qv(res), M(qT(res)) + ".")],
            traps: [TR(qv(qm(inner, [g, h])), "Diviser par " + M(fT(g, h)) + ", c'est multiplier par son inverse " + M(fT(h, g)) + ".")] }); },
      () => { /* 24.11 (commentaire de l'enseignant sur fracmul-3-3an, « valeurs pas très bien choisies » : 4/5 + 5/4 · 5/6 = 221/120) :
           le produit se simplifie en croix, son dénominateur reste petit et s'accorde avec celui de a/b (dénominateur commun ≤ 12),
           le résultat est une fraction lisible. */
        let b, a, c, e, g, h, prod, res, ok = false;
        for (let t = 0; t < 400 && !ok; t++) {
          b = R.int(2, 6); a = cop(1, b); e = R.int(2, 9); c = R.int(1, 8); h = R.int(2, 9); g = R.int(2, 9);
          if (gcd2(c, e) > 1 || gcd2(g, h) > 1 || c === e || g === h || c * g === e * h) continue;
          if (gcd2(c, h) === 1 && gcd2(g, e) === 1) continue;
          prod = qm([c, e], [g, h]); res = qa([a, b], prod);
          ok = prod[1] > 1 && prod[1] <= 8 && lcm(b, prod[1]) <= 12 && res[1] > 1 && res[0] <= 30;
        }
        if (!ok) return null;
        return Qv(FI + M(fT(a, b) + " + " + fT(c, e) + " \\cdot " + fT(g, h)), qv(res), "La multiplication d'abord : " + M(fT(a, b) + " + " + qT(prod) + " = " + qT(res)) + ".",
          { ctx: "priofrac", guide: [GS("D'abord le produit : " + M(fT(c, e) + " \\cdot " + fT(g, h)) + " = ?", qv(prod), M(qT(prod)) + "."), GS("Puis " + M(fT(a, b) + " + " + qT(prod)) + " = ?", qv(res), M(qT(res)) + ".")],
            traps: [TR(qv(qm(qa([a, b], [c, e]), [g, h])), "La multiplication passe avant l'addition, avec des fractions aussi.")] }); },
      () => { /* 24.11 : la division se simplifie et le résultat reste lisible (ex. 49/30 refusé). */
        let n, b, a, e, c, top, res, ok = false;
        for (let t = 0; t < 300 && !ok; t++) {
          n = R.int(1, 3); b = R.int(2, 6); a = cop(1, b); e = R.int(3, 7); c = cop(2, e); /* c ≥ 2 : pas de « : 1/2 » ni d'inverse « 6/1 » */ top = rq(n * b + a, b); res = qd(top, [c, e]);
          ok = (gcd2(top[0], c) > 1 || gcd2(e, b) > 1) && res[1] <= 10 && res[0] <= 30;
        }
        if (!ok) return null;
        return Qv(FI + M("\\frac{" + n + " + " + fT(a, b) + "}{" + fT(c, e) + "}"), qv(res), M("\\frac{" + qT(top) + "}{" + fT(c, e) + "} = " + qT(top) + " \\cdot " + fT(e, c) + " = " + qT(res)) + ".",
          { ctx: "etagee", guide: [GS("Le numérateur : " + M(n + " + " + fT(a, b)) + " = ?", qv(top), M(qT(top)) + "."), GS("Puis on divise par " + M(fT(c, e)) + " (on multiplie par " + M(fT(e, c)) + ") : résultat ?", qv(res), M(qT(res)) + ".")],
            traps: [TR(qv(qm(top, [c, e])), "La grande barre est une division : on multiplie par l'inverse " + M(fT(e, c)) + "."), TR(qv(qd([n + a, b], [c, e])), M(n) + " vaut " + M(fT(n * b, b)) + " : écris-le sur " + M(b) + " avant d'additionner.")] }); },
      () => { const [a, b] = pk([[2, 5], [3, 4], [2, 3], [3, 5], [5, 8]]), [c, e] = pk([[3, 4], [1, 3], [2, 5], [1, 4], [3, 8], [2, 3]]), m = pk([200, 400, 600, 1200, 2400, 3000]), N0 = b * e * m, got = N0 / b * a, spent = got / e * c;
        if (!Number.isInteger(spent)) return null;
        return Qv("Ana reçoit les " + M(fT(a, b)) + " d'un héritage de " + M(N(N0)) + " CHF. Elle en dépense les " + M(fT(c, e)) + ". Combien lui reste-t-il (CHF) ?", got - spent,
          "Elle reçoit " + M(fT(a, b) + " \\cdot " + N(N0) + " = " + N(got)) + " CHF, dépense " + M(fT(c, e) + " \\cdot " + N(got) + " = " + N(spent)) + " CHF ; il reste " + M(N(got - spent)) + " CHF.",
          { ctx: "heritage", guide: [GS("Part reçue : " + M(fT(a, b) + " \\cdot " + N(N0)) + " = ?", got, M(N(got)) + " CHF."), GS("Dépense : les " + M(fT(c, e)) + " de " + M(N(got)) + " = ?", spent, M(N(spent)) + " CHF."), GS("Reste ?", got - spent, M(N(got) + " - " + N(spent) + " = " + N(got - spent)) + " CHF.")],
            traps: [TR(spent, "C'est ce qu'elle dépense ; on demande ce qui reste."), TR(N0 * (a / b - c / e), "Les " + M(fT(c, e)) + " portent sur sa part, pas sur tout l'héritage.")] }); },
    ],
  };

  // ===================== fracconv : fraction, nombre décimal, pourcentage, nombres périodiques =====================
  const per = (s) => "0{,}\\overline{" + s + "}";
  const FCONV = {
    1: [
      () => { const [a, b] = pk([[3, 4], [1, 8], [3, 8], [7, 8], [9, 20], [13, 25], [3, 40], [17, 50], [7, 20], [11, 25], [5, 16]]);
        return Qv("Écris " + M(fT(a, b)) + " en nombre décimal.", a / b, M(a + " : " + b + " = " + N(a / b)) + ".",
          { plain: true, ctx: "f2d", guide: 100 % b === 0 ? [GS("Écris la fraction sur 100 : " + M(fT(a, b) + " = \\frac{?}{100}") + ". Numérateur ?", a * 100 / b, M(fT(a * 100 / b, 100)) + "."), GS("Écriture décimale ?", a / b, M(N(a / b)) + ".")]
            : [GS("Divise " + M(a) + " par " + M(b) + " (pose la division). Le chiffre des dixièmes ?", Math.floor(a / b * 10) % 10, "Premier chiffre après la virgule."), GS("Écriture décimale complète ?", a / b, M(N(a / b)) + ".")],
            traps: [TR(+(a + "." + b), "La barre de fraction n'est pas une virgule : " + M(fT(a, b)) + " veut dire " + M(a + " : " + b) + "."), TR(b / a, "C'est le numérateur qu'on divise par le dénominateur : " + M(a + " : " + b) + ".")] }); },
      () => { const v = pk([0.35, 0.24, 0.125, 0.4, 0.08, 0.45, 0.6, 0.375, 0.65, 1.25, 0.15, 0.025, 2.4]), s = String(v).split(".")[1].length, p = 10 ** s, n = Math.round(v * p), res = rq(n, p);
        return Qv("Écris " + T(v) + " sous forme de fraction irréductible.", v, M(N(v) + " = " + fT(n, p) + " = " + qT(res)) + ".",
          { ctx: "d2f", guide: [GS(M(N(v) + " = \\frac{?}{" + p + "}") + " (" + s + " chiffre" + (s > 1 ? "s" : "") + " après la virgule). Numérateur ?", n, M(fT(n, p)) + "."), GS("Simplifie par " + M(gcd2(n, p)) + " : fraction irréductible ?", v, M(qT(res)) + ".")],
            traps: [TR(n / 10 ** (s + 1), "Le nombre de zéros du dénominateur est le nombre de chiffres après la virgule : ici " + M(p) + ".")] }); },
      () => { const p = pk([7, 45, 120, 2.5, 3, 0.5, 150, 85, 12.5, 4]);
        return Qv("Écris " + M(N(p) + "\\,\\%") + " en nombre décimal.", p / 100, M(N(p) + "\\,\\% = \\frac{" + N(p) + "}{100} = " + N(p / 100)) + ".",
          { plain: true, ctx: "p2d", guide: [GS("Pour cent veut dire « sur 100 » : " + M(N(p) + "\\,\\% = \\frac{?}{100}") + ". Numérateur ?", p, M("\\frac{" + N(p) + "}{100}") + "."), GS("Divise par 100 : écriture décimale ?", p / 100, M(N(p) + " : 100 = " + N(p / 100)) + ".")],
            traps: [TR(p / 10, "Pour cent : on divise par 100, pas par 10."), TR(p, "Il faut diviser par 100.")] }); },
      () => { const [n, k] = pk([[20, 7], [25, 9], [40, 14], [50, 17], [20, 13], [25, 16], [40, 26], [50, 33], [80, 28]]), x = pk([
          ["Dans une classe de " + n + " élèves, " + k + " font partie d'un club de sport.", "Quel pourcentage des élèves fait partie d'un club ?", "sport"],
          ["À un test de " + n + " questions, Liam répond juste à " + k + " questions.", "Quel est son pourcentage de réponses justes ?", "test"],
          ["Un sac contient " + n + " billes, dont " + k + " rouges.", "Quel pourcentage des billes est rouge ?", "billes"]]);
        return Qv(x[0] + " " + x[1] + " (donne seulement le nombre)", k / n * 100, M(fT(k, n) + " = " + N(k / n) + " = " + N(k / n * 100) + "\\,\\%") + ".",
          { plain: true, ctx: x[2], guide: [GS("La fraction " + M(fT(k, n)) + " en nombre décimal ?", k / n, M(N(k / n)) + "."), GS("En pourcentage (multiplie par 100) ?", k / n * 100, M(N(k / n * 100) + "\\,\\%") + ".")],
            traps: [TR(k / n, "C'est l'écriture décimale ; pour un pourcentage, multiplie par 100."), TR(k, "Le nombre " + k + " n'est un pourcentage que si le total vaut 100.")] }); },
    ],
    2: [
      () => { const [a, b] = pk([[1, 8], [3, 8], [5, 8], [7, 40], [9, 40], [3, 16], [13, 40], [7, 8], [11, 20], [3, 125], [21, 25]]);
        return Qv("Écris " + M(fT(a, b)) + " en pourcentage (donne seulement le nombre).", a / b * 100, M(fT(a, b) + " = " + N(a / b) + " = " + N(a / b * 100) + "\\,\\%") + ".",
          { plain: true, ctx: "f2p", guide: [GS("Écriture décimale de " + M(fT(a, b)) + " ?", a / b, M(N(a / b)) + "."), GS("En pourcentage (multiplie par 100) ?", a / b * 100, M(N(a / b * 100) + "\\,\\%") + ".")],
            traps: [TR(a / b, "C'est l'écriture décimale ; multiplie par 100 pour le pourcentage.")] }); },
      () => { const a = pk([1, 2, 4, 5, 7, 8, 3, 6]), res = rq(a, 9);
        return Qv("Écris " + M(per(a)) + " (soit " + M("0{,}" + String(a).repeat(4) + "\\ldots") + ") sous forme de fraction irréductible.", a / 9, "Avec " + M("x = " + per(a)) + " : " + M("10x - x = " + a) + ", donc " + M("9x = " + a) + " et " + M("x = " + fT(a, 9) + (res[1] !== 9 ? " = " + qT(res) : "")) + ".",
          { ctx: "per1", guide: [GS("Pose " + M("x = 0{,}" + String(a).repeat(3) + "\\ldots") + ". Alors " + M("10x = " + a + "{,}" + String(a).repeat(3) + "\\ldots") + ". Combien vaut " + M("10x - x") + " ?", a, M("10x - x = " + a) + " : les décimales s'annulent."), GS("Donc " + M("9x = " + a) + ". Que vaut " + M("x") + " (fraction irréductible) ?", a / 9, M("x = " + qT(res)) + ".")],
            traps: [TR(a / 10, M(fT(a, 10) + " = 0{," + "}" + a) + " s'arrête après un chiffre ; " + M(per(a)) + " continue : c'est " + M(fT(a, 9)) + ".")] }); },
      () => { let f, d, p; do { f = pk([[3, 8], [2, 5], [5, 8], [3, 4], [7, 20], [9, 25], [1, 3], [2, 3]]); d = pk([0.38, 0.4, 0.62, 0.72, 0.36, 0.35, 0.3, 0.65]); p = pk([37, 41, 60, 74, 33, 66, 39]); } while (new Set([f[0] / f[1], d, p / 100]).size < 3 || [f[0] / f[1], d, p / 100].sort((x, y) => y - x)[0] - [f[0] / f[1], d, p / 100].sort((x, y) => y - x)[1] < 0.004);
        const vals = [f[0] / f[1], d, p / 100], best = Math.max(...vals), second = vals.sort((x, y) => y - x)[1];
        return Qv("Quel est le plus grand de ces nombres : " + M(fT(f[0], f[1])) + ", " + T(d) + " ou " + M(p + "\\,\\%") + " ? Donne sa valeur en nombre décimal" + (f[1] === 3 ? " (arrondie au millième s'il le faut)" : "") + ".", r12(best),
          M(fT(f[0], f[1]) + (f[1] === 3 ? " \\approx " + N(+(f[0] / f[1]).toFixed(3)) : " = " + N(f[0] / f[1]))) + ", " + M(p + "\\,\\% = " + N(p / 100)) + " : le plus grand vaut " + M(N(+best.toFixed(3))) + ".",
          { plain: true, ctx: "compare", round: f[1] === 3 && best === f[0] / f[1] ? 0.001 : undefined, guide: [GS("Écris " + M(fT(f[0], f[1])) + " en décimal" + (f[1] === 3 ? " (au millième)" : "") + ".", f[0] / f[1], M(N(+(f[0] / f[1]).toFixed(3))) + ".", f[1] === 3 ? 0.001 : undefined), GS("Écris " + M(p + "\\,\\%") + " en décimal.", p / 100, M(N(p / 100)) + "."), GS("Le plus grand des trois ?", r12(best), M(N(+best.toFixed(3))) + ".", f[1] === 3 && best === f[0] / f[1] ? 0.001 : undefined)],
            traps: [TR(r12(second), "Compare les trois écritures décimales : il y a plus grand.")] }); },
      () => { const p = pk([35, 12, 24, 36, 45, 64, 85, 4, 15, 125, 8, 140]), res = rq(p, 100), g = gcd2(p, 100);
        return Qv("Écris " + M(p + "\\,\\%") + " sous forme de fraction irréductible.", p / 100, M(p + "\\,\\% = " + fT(p, 100) + " = " + qT(res)) + " (simplifiée par " + M(g) + ").",
          { ctx: "p2f", guide: [GS(M(p + "\\,\\% = " + fT(p, 100)) + ". Par quel nombre (le plus grand possible) peut-on simplifier ?", g, "PGDC de " + M(p) + " et " + M(100) + " : " + M(g) + "."), GS("Fraction irréductible ?", p / 100, M(qT(res)) + ".")],
            traps: [TR(100 / p, "La fraction est " + M(fT(p, 100)) + " : " + M(p) + " au numérateur."), TR(p / 10, "Pour cent : sur 100.")] }); },
    ],
    3: [
      () => { const ab = pk([12, 27, 36, 45, 18, 54, 81, 15, 24, 63, 9, 72]), s = ab < 10 ? "0" + ab : String(ab), res = rq(ab, 99);
        return Qv("Écris " + M(per(s)) + " sous forme de fraction irréductible.", ab / 99, "Avec " + M("x = " + per(s)) + " : " + M("100x - x = " + ab) + ", donc " + M("x = " + fT(ab, 99) + " = " + qT(res)) + ".",
          { ctx: "per2", guide: [GS("La période a 2 chiffres : on multiplie par 100. Avec " + M("x = 0{,}" + s + s + "\\ldots") + ", combien vaut " + M("100x - x") + " ?", ab, M("100x - x = " + ab) + "."), GS("Donc " + M("99x = " + ab) + ". Que vaut " + M("x") + " (fraction irréductible) ?", ab / 99, M(qT(res)) + ".")],
            traps: [TR(ab / 100, M(fT(ab, 100)) + " s'arrête ; " + M(per(s)) + " se répète : on divise par 99."), TR(ab / 9, "La période a deux chiffres : multiplie par 100 (et non 10), d'où 99.")] }); },
      () => { const [a, b] = pk([[1, 6], [8, 3], [4, 6], [2, 3], [1, 3], [5, 8], [3, 8], [7, 2], [5, 4]]), top = 10 * a + b - a, res = rq(top, 90);
        return Qv("Écris " + M("0{," + "}" + a + "\\overline{" + b + "}") + " (soit " + M("0{,}" + a + String(b).repeat(4) + "\\ldots") + ") sous forme de fraction irréductible.", top / 90,
          "Avec " + M("x = 0{,}" + a + "\\overline{" + b + "}") + " : " + M("100x - 10x = " + (10 * a + b) + " - " + a + " = " + top) + ", donc " + M("90x = " + top) + " et " + M("x = " + qT(res)) + ".",
          { ctx: "permixte", guide: [GS(M("10x = " + a + "{,}" + String(b).repeat(3) + "\\ldots") + " et " + M("100x = " + (10 * a + b) + "{,}" + String(b).repeat(3) + "\\ldots") + ". Combien vaut " + M("100x - 10x") + " ?", top, M((10 * a + b) + " - " + a + " = " + top) + "."), GS("Donc " + M("90x = " + top) + ". Que vaut " + M("x") + " (fraction irréductible) ?", top / 90, M(qT(res)) + ".")],
            traps: [TR((10 * a + b) / 99, "La période ne commence pas tout de suite : le chiffre " + M(a) + " ne se répète pas."), TR((10 * a + b) / 90, "Il faut retirer la partie qui ne se répète pas : " + M((10 * a + b) + " - " + a) + ".")] }); },
      () => { const p = pk([20, 25, 40, 50, 60, 75, 30, 80]), b = pk([3, 4, 5, 7, 8, 9]), a = cop(1, b), res = qm([p, 100], [a, b]);
        return Qv("Calcule " + M(p + "\\,\\%") + " de " + M(fT(a, b)) + " (fraction irréductible).", qv(res), M(fT(p, 100) + " \\cdot " + fT(a, b) + " = " + qT(rq(p, 100)) + " \\cdot " + fT(a, b) + " = " + qT(res)) + ".",
          { ctx: "pdefrac", guide: [GS(M(p + "\\,\\%") + " en fraction irréductible ?", p / 100, M(fT(p, 100) + " = " + qT(rq(p, 100))) + "."), GS("« De » veut dire « fois » : " + M(qT(rq(p, 100)) + " \\cdot " + fT(a, b)) + " = ?", qv(res), M(qT(res)) + ".")],
            traps: [TR(p * a / b, "Il faut d'abord écrire " + M(p + "\\,\\%") + " comme " + M(fT(p, 100)) + "."), TR(a / b - p / 100, "« " + p + " % de » est une multiplication.")] }); },
      () => { const [a, b] = pk([[1, 5], [1, 4], [1, 10], [1, 2], [2, 5], [3, 10]]), p = pk([10, 20, 25, 50, 30]), k1 = 1 - a / b, k2 = 1 - p / 100, tot = r12(100 * (1 - k1 * k2));
        return Qv("Un prix baisse d'abord de " + M(fT(a, b)) + ", puis le nouveau prix baisse de " + M(p + "\\,\\%") + ". De quel pourcentage le prix a-t-il baissé en tout ? (donne seulement le nombre)", tot,
          "Il reste " + M(N(r12(k1)) + " \\cdot " + N(k2) + " = " + N(r12(k1 * k2))) + " du prix, soit une baisse de " + M(N(tot) + "\\,\\%") + " (et non " + M(N(r12(100 * a / b + p)) + "\\,\\%") + ").",
          { plain: true, ctx: "soldes", guide: [GS("Après la première baisse, quelle part du prix reste-t-il ? (décimal)", r12(k1), M("1 - " + fT(a, b) + " = " + N(r12(k1)))), GS("Après la deuxième, quelle part reste-t-il ? (" + M(N(r12(k1)) + " \\cdot " + N(k2)) + ")", r12(k1 * k2), M(N(r12(k1 * k2))) + "."), GS("Baisse totale en % ?", tot, M("1 - " + N(r12(k1 * k2)) + " = " + N(r12(1 - k1 * k2))) + ", soit " + M(N(tot) + "\\,\\%") + ".")],
            traps: [TR(r12(100 * a / b + p), "Les baisses ne s'additionnent pas : la deuxième porte sur le prix déjà baissé.")] }); },
    ],
  };

  // ===================== puiss : puissances (exposants entiers relatifs) =====================
  const B = () => pk([2, 3, 5, 7, 10, 4, 6]);
  const box = "\\square";
  const PUISS = {
    1: [
      () => { const a = B(), m = R.int(2, 6), n = R.int(2, 6);
        return Qv("Complète : " + M(a + "^{" + m + "} \\cdot " + a + "^{" + n + "} = " + a + "^{" + box + "}") + ". Quel est l'exposant ?", m + n, "Même base : on additionne les exposants. " + M(a + "^{" + m + "+" + n + "} = " + a + "^{" + (m + n) + "}") + ".",
          { final: true, ctx: "prod", guide: [GS(M(a + "^{" + m + "}") + " contient " + M(m) + " facteurs " + M(a) + ", et " + M(a + "^{" + n + "}") + " en contient " + M(n) + ". Combien de facteurs " + M(a) + " en tout ?", m + n, M(m + " + " + n + " = " + (m + n)) + "."), GS("Donc l'exposant ?", m + n, M(a + "^{" + (m + n) + "}") + ".")],
            traps: [TR(m * n, "On ne multiplie pas les exposants : " + M(a + "^{" + m + "} \\cdot " + a + "^{" + n + "}") + " compte " + M(m + " + " + n) + " facteurs.")] }); },
      () => { const a = B(), m = R.int(2, 5), n = R.int(2, 4);
        return Qv("Complète : " + M("(" + a + "^{" + m + "})^{" + n + "} = " + a + "^{" + box + "}") + ". Quel est l'exposant ?", m * n, "Puissance d'une puissance : on multiplie les exposants. " + M(a + "^{" + m + " \\cdot " + n + "} = " + a + "^{" + m * n + "}") + ".",
          { final: true, ctx: "pp", guide: [GS(M("(" + a + "^{" + m + "})^{" + n + "}") + " = " + M(n) + " fois le facteur " + M(a + "^{" + m + "}") + ". Combien de facteurs " + M(a) + " en tout ? (" + M(n + " \\cdot " + m) + ")", m * n, M(m * n) + "."), GS("Donc l'exposant ?", m * n, M(a + "^{" + m * n + "}") + ".")],
            traps: [TR(m + n, "Ici, on n'additionne pas : " + M(n) + " fois " + M(m) + " facteurs, c'est " + M(m + " \\cdot " + n) + ".")] }); },
      () => { const a = R.int(2, 5), n = pk([2, 3, 4]), kind = R.int(0, 1), v = kind ? (-a) ** n : -(a ** n);
        return Qv("Calcule : " + M(kind ? "(-" + a + ")^{" + n + "}" : "-" + a + "^{" + n + "}"), v, kind ? M("(-" + a + ")^{" + n + "} = " + v) + " : exposant " + (n % 2 ? "impair, résultat négatif" : "pair, résultat positif") + "." : M("-" + a + "^{" + n + "} = -(" + a + "^{" + n + "}) = " + v) + " : la puissance ne porte que sur " + M(a) + ".",
          { final: true, ctx: "signe", guide: [GS("D'abord " + M(a + "^{" + n + "}") + " = ?", a ** n, M(a ** n) + "."), GS(kind ? "Le signe : " + M(n) + " facteurs négatifs. Résultat ?" : "Le « − » devant n'est pas dans la puissance. Résultat ?", v, M(v) + ".")],
            traps: [TR(-v, kind ? "Un nombre pair de facteurs négatifs donne un résultat positif, un nombre impair un résultat négatif." : "Sans parenthèses, la puissance ne porte que sur " + M(a) + " : le signe « − » reste devant."), TR(kind ? -a * n : -(a * n), M(a + "^{" + n + "}") + " n'est pas " + M(a + " \\cdot " + n) + " : c'est " + M(a) + " multiplié " + M(n) + " fois par lui-même.")] }); },
      () => { const a = B(), n = R.int(2, 5), m = n + R.int(2, 6);
        return Qv("Complète : " + M("\\frac{" + a + "^{" + m + "}}{" + a + "^{" + n + "}} = " + a + "^{" + box + "}") + ". Quel est l'exposant ?", m - n, "Quotient de même base : on soustrait les exposants. " + M(a + "^{" + m + " - " + n + "} = " + a + "^{" + (m - n) + "}") + ".",
          { final: true, ctx: "quot", guide: [GS("On simplifie " + M(n) + " facteurs " + M(a) + " en haut et en bas. Combien en reste-t-il en haut ? (" + M(m + " - " + n) + ")", m - n, M(m - n) + "."), GS("Donc l'exposant ?", m - n, M(a + "^{" + (m - n) + "}") + ".")],
            traps: [TR(m / n, "Pour un quotient, on soustrait les exposants (on ne les divise pas)."), TR(m + n, "Pour un quotient, on soustrait les exposants.")] }); },
    ],
    2: [
      () => { const a = B(), m = R.int(2, 5), n = m + R.int(2, 5);
        return Qv("Complète : " + M("\\frac{" + a + "^{" + m + "}}{" + a + "^{" + n + "}} = " + a + "^{" + box + "}") + ". Quel est l'exposant ?", m - n, M(a + "^{" + m + " - " + n + "} = " + a + "^{" + (m - n) + "}") + " : il reste plus de facteurs en bas, l'exposant est négatif.",
          { final: true, ctx: "quotneg", guide: [GS("On soustrait les exposants : " + M(m + " - " + n) + " = ?", m - n, M(m - n) + "."), GS("Donc l'exposant ?", m - n, M(a + "^{" + (m - n) + "} = \\frac{1}{" + a + "^{" + (n - m) + "}}") + ".")],
            traps: [TR(n - m, "Il y a plus de facteurs au dénominateur : l'exposant est négatif (" + M(m + " - " + n) + ")."), TR(m + n, "Pour un quotient, on soustrait les exposants.")] }); },
      () => { const a = R.int(2, 5), n = pk([1, 2, 3]), v = 1 / a ** n;
        return Qv("Calcule " + M(a + "^{-" + n + "}") + " (fraction).", v, M(a + "^{-" + n + "} = \\frac{1}{" + a + "^{" + n + "}} = " + fT(1, a ** n)) + ".",
          { final: true, ctx: "negexp", guide: [GS("Un exposant négatif donne l'inverse : " + M(a + "^{-" + n + "} = \\frac{1}{" + a + "^{" + n + "}}") + ". Combien vaut " + M(a + "^{" + n + "}") + " ?", a ** n, M(a ** n) + "."), GS("Donc " + M(a + "^{-" + n + "}") + " = ?", v, M(fT(1, a ** n)) + ".")],
            traps: [TR(-(a ** n), "Un exposant négatif ne rend pas le nombre négatif : il donne l'inverse, " + M(fT(1, a ** n)) + "."), TR(-a * n, M(a + "^{-" + n + "}") + " n'est pas " + M(a + " \\cdot (-" + n + ")") + ".")] }); },
      () => { const [a, b] = pk([[2, 5], [4, 25], [5, 20], [2, 50]]), n = R.int(2, 4), v = (a * b) ** n;
        return Qv("Calcule astucieusement : " + M(a + "^{" + n + "} \\cdot " + b + "^{" + n + "}"), v, "Même exposant : " + M("(" + a + " \\cdot " + b + ")^{" + n + "} = " + a * b + "^{" + n + "} = " + N(v)) + ".",
          { final: true, ctx: "astuce", guide: [GS("Même exposant : on regroupe les bases. " + M(a + " \\cdot " + b) + " = ?", a * b, M(a * b) + "."), GS(M(a * b + "^{" + n + "}") + " = ?", v, M(N(v)) + ".")],
            traps: [TR((a * b) ** (2 * n), "On n'additionne les exposants que si la base est la même ; ici les bases diffèrent mais les exposants sont égaux."), TR(a * b * n, M(a * b + "^{" + n + "}") + " n'est pas " + M(a * b + " \\cdot " + n) + ".")] }); },
      () => { const m = nz(-6, 7), n = nz(-6, 6), p = nz(-5, 5), e = m + n - p; if (e === 0 || e === 1) return null;
        return Qv("Complète : " + M("\\frac{10^{" + m + "} \\cdot 10^{" + n + "}}{10^{" + p + "}} = 10^{" + box + "}") + ". Quel est l'exposant ?", e, M("10^{" + m + " + (" + n + ") - (" + p + ")} = 10^{" + e + "}") + ".",
          { final: true, ctx: "dix", guide: [GS("Numérateur : " + M("10^{" + m + "} \\cdot 10^{" + n + "} = 10^{" + box + "}") + ". Exposant ?", m + n, M(m + " + (" + n + ") = " + (m + n)) + "."), GS("Divise par " + M("10^{" + p + "}") + " : exposant final ?", e, M((m + n) + " - (" + p + ") = " + e) + ".")],
            traps: [TR(m + n + p, "On divise par " + M("10^{" + p + "}") + " : on soustrait son exposant."), TR(m - n - p, "Attention aux signes : " + M(m + " + (" + n + ")") + ", puis on soustrait " + M(par(p)) + ".")] }); },
    ],
    3: [
      () => { const a = pk([2, 3, 5, 7]), m = nz(-3, 4), n = R.int(2, 3), p = nz(-5, 5), q = nz(-5, 5), e = m * n + p - q; if (e === 0 || e === 1 || m === 1) return null;
        return Qv("Complète : " + M("\\frac{(" + a + "^{" + m + "})^{" + n + "} \\cdot " + a + "^{" + p + "}}{" + a + "^{" + q + "}} = " + a + "^{" + box + "}") + ". Quel est l'exposant ?", e,
          M(a + "^{" + m * n + "} \\cdot " + a + "^{" + p + "} : " + a + "^{" + q + "} = " + a + "^{" + (m * n) + " + (" + p + ") - (" + q + ")} = " + a + "^{" + e + "}") + ".",
          { final: true, ctx: "mix", guide: [GS(M("(" + a + "^{" + m + "})^{" + n + "} = " + a + "^{" + box + "}") + " : exposant ?", m * n, M(m + " \\cdot " + n + " = " + m * n) + "."), GS("Fois " + M(a + "^{" + p + "}") + " : exposant ?", m * n + p, M(m * n + " + (" + p + ") = " + (m * n + p)) + "."), GS("Divisé par " + M(a + "^{" + q + "}") + " : exposant final ?", e, M((m * n + p) + " - (" + q + ") = " + e) + ".")],
            traps: [TR(m + n + p - q, "Puissance d'une puissance : on multiplie les exposants (" + M(m + " \\cdot " + n) + ")."), TR(m * n + p + q, "On divise : on soustrait l'exposant du dénominateur.")] }); },
      () => { const [a, n, b, k] = pk([[2, 1, 4, 1], [2, 2, 3, 1], [3, 1, 6, 1], [2, 1, 3, 2], [5, 1, 2, 2], [4, 1, 2, 3], [3, 2, 2, 1], [10, 1, 5, 1]]), res = qa([1, a ** n], [1, b ** k]);
        return Qv(FI + M(a + "^{-" + n + "} + " + b + "^{-" + k + "}"), qv(res), M(fT(1, a ** n) + " + " + fT(1, b ** k) + " = " + qT(res)) + ".",
          { final: true, ctx: "sommeneg", guide: [GS(M(a + "^{-" + n + "}") + " = ? (fraction)", 1 / a ** n, M(fT(1, a ** n)) + "."), GS(M(b + "^{-" + k + "}") + " = ? (fraction)", 1 / b ** k, M(fT(1, b ** k)) + "."), GS("Somme ?", qv(res), M(qT(res)) + ".")],
            traps: [TR(-(a ** n) - b ** k, "Un exposant négatif donne l'inverse, pas un nombre négatif."), TR(1 / (a ** n + b ** k), "On n'additionne pas les dénominateurs : mets les fractions au même dénominateur.")] }); },
      () => { const [a, b] = pk([[2, 3], [2, 5], [3, 5]]), n = R.int(3, 5), p = R.int(1, n - 1), q = R.int(1, n), v = a ** (n - p) * b ** (n - q); if (n - p === 1 && n - q <= 1) return null;
        return Qv("Calcule sans calculatrice : " + M("\\frac{" + a * b + "^{" + n + "}}{" + a + "^{" + p + "} \\cdot " + b + "^{" + q + "}}").replace(/\^\{1\}/g, ""), v,
          M(a * b + "^{" + n + "} = " + a + "^{" + n + "} \\cdot " + b + "^{" + n + "}") + ", donc " + M(a + "^{" + (n - p) + "} \\cdot " + b + "^{" + (n - q) + "} = " + v).replace(/\^\{1\}/g, "").replace(/ \\cdot [235]\^\{0\}/, "") + ".",
          { final: true, ctx: "decomp", guide: [GS(M(a * b + "^{" + n + "} = " + a + "^{" + n + "} \\cdot " + b + "^{" + n + "}") + ". Il reste " + M(a + "^{" + box + "}") + " : exposant ?", n - p, M(n + " - " + p + " = " + (n - p)) + "."), GS("Et " + M(b + "^{" + box + "}") + " : exposant ?", n - q, M(n + " - " + q + " = " + (n - q)) + "."), GS("Valeur ?", v, M(v) + ".")],
            traps: [TR(a * b, "Simplifie facteur par facteur : décompose " + M(a * b + "^{" + n + "}") + " en " + M(a + "^{" + n + "} \\cdot " + b + "^{" + n + "}") + "."), TR((a * b) ** (n - p - q), "Les bases " + M(a) + " et " + M(b) + " se traitent séparément.")] }); },
      () => { let a, b; do { a = R.int(2, 5); b = R.int(2, 7); } while (gcd2(a, b) !== 1 || a === b); const n = pk([2, 3]), v = b ** n / a ** n;
        return Qv("Calcule " + M("\\left(" + fT(a, b) + "\\right)^{-" + n + "}") + " (fraction).", v, "Exposant négatif : on inverse. " + M("\\left(" + fT(b, a) + "\\right)^{" + n + "} = " + fT(b ** n, a ** n)) + ".",
          { final: true, ctx: "fracneg", guide: [GS("On inverse la fraction : " + M("\\left(" + fT(a, b) + "\\right)^{-" + n + "} = \\left(" + fT(b, a) + "\\right)^{" + n + "}") + ". Numérateur " + M(b + "^{" + n + "}") + " = ?", b ** n, M(b ** n) + "."), GS("Résultat ?", v, M(fT(b ** n, a ** n)) + ".")],
            traps: [TR(a ** n / b ** n, "L'exposant négatif inverse la fraction."), TR(-(a ** n) / b ** n, "Un exposant négatif ne change pas le signe : il inverse.")] }); },
    ],
  };

  // ===================== sci : notation scientifique =====================
  const mant = () => pk([1.2, 1.5, 2.4, 3.6, 4.2, 4.5, 5.8, 6.3, 7.25, 8.1, 9.4, 2.05, 3.08, 1.75, 6.02]);
  const sciGuide = (v, m, e, what) => [
    GS("Le nombre entre 1 et 10 (on garde les chiffres significatifs" + (what ? ", " + what : "") + ") ?", m, M(N(m)) + "."),
    GS("De combien de rangs faut-il déplacer la virgule pour passer de " + M(N(m)) + " à " + M(N(v)) + " ? L'exposant (" + (e < 0 ? "négatif : le nombre est plus petit que 1" : "positif : le nombre est plus grand que 10") + ") ?", e, M("10^{" + e + "}") + "."),
    GSci("Écris le résultat en notation scientifique (par exemple " + M("4{,}5 \\cdot 10^{-3}") + ").", v, M(S(m, e)) + ".")];
  const SCI = {
    1: [
      () => { const m = mant(), e = R.int(4, 9), v = sv(m, e);
        return Qv("Écris " + T(v) + " en notation scientifique.", v, M(N(v) + " = " + S(m, e)) + ".", { sci: true, ctx: "grand", guide: sciGuide(v, m, e),
          traps: [TR(sv(m, e + 1), "Compte les rangs : de " + M(N(m)) + " à " + M(N(v)) + ", la virgule se déplace de " + M(e) + " rangs."), TR(sv(m, e - 1), "Compte les rangs : il en faut " + M(e) + "."), TR(sv(m, -e), "Le nombre est plus grand que 10 : l'exposant est positif.")] }); },
      () => { const m = mant(), e = -R.int(2, 7), v = sv(m, e);
        return Qv("Écris " + T(v) + " en notation scientifique.", v, M(N(v) + " = " + S(m, e)) + ".", { sci: true, ctx: "petit", guide: sciGuide(v, m, e),
          traps: [TR(sv(m, -e), "Le nombre est plus petit que 1 : l'exposant est négatif."), TR(sv(m, e + 1), "Compte les rangs : de " + M(N(m)) + " à " + M(N(v)) + ", la virgule se déplace de " + M(-e) + " rangs."), TR(sv(m, e - 1), "Compte les rangs : il en faut " + M(-e) + ".")] }); },
      () => { const m = mant(), e = pk([-4, -3, -2, 3, 4, 5]), v = sv(m, e);
        return Qv("Écris " + M(S(m, e)) + " en nombre décimal.", v, M(S(m, e) + " = " + N(v)) + " (virgule déplacée de " + Math.abs(e) + " rangs vers la " + (e > 0 ? "droite" : "gauche") + ").",
          { plain: true, ctx: "versdec", guide: [GS("L'exposant est " + M(e) + " : la virgule se déplace de " + M(Math.abs(e)) + " rangs vers la " + (e > 0 ? "droite (le nombre grandit)" : "gauche (le nombre devient plus petit que 1)") + ". Dans quel sens ? Tape " + M("1") + " pour la droite, " + M("-1") + " pour la gauche.", e > 0 ? 1 : -1, e > 0 ? "Vers la droite." : "Vers la gauche."), GS("Écriture décimale ?", v, M(N(v)) + ".")],
            traps: [TR(sv(m, -e), "Exposant " + (e > 0 ? "positif : le nombre est grand" : "négatif : le nombre est plus petit que 1") + "."), TR(sv(m, e > 0 ? e - 1 : e + 1), "Compte bien : " + Math.abs(e) + " rangs.")] }); },
      () => { const x = pk([
          ["La distance moyenne de la Terre au Soleil est d'environ 150 millions de km.", 1.5, 8, "km", "dist"],
          ["Un cheveu a une épaisseur d'environ " + M("0{,}00007") + " m.", 7, -5, "m", "cheveu"],
          ["Un virus de la grippe mesure environ " + M("0{,}0000001") + " m.", 1, -7, "m", "virus"],
          ["La Terre compte environ 8,1 milliards d'habitants.", 8.1, 9, "", "pop"],
          ["Une bactérie mesure environ " + M("0{,}000002") + " m.", 2, -6, "m", "bacterie"],
          ["La masse de la Lune est d'environ 73 milliards de milliards de tonnes, soit " + M("73\\text{'}000\\text{'}000\\text{'}000\\text{'}000\\text{'}000\\text{'}000") + " t.", 7.3, 19, "t", "lune"],
          ["Le cœur humain bat environ 3 milliards de fois au cours d'une vie.", 3, 9, "", "coeur"]]);
        const v = sv(x[1], x[2]);
        return Qv(x[0] + " Écris ce nombre en notation scientifique" + (x[3] ? " (en " + x[3] + ")" : "") + ".", v, M(S(x[1], x[2])) + (x[3] ? " " + x[3] : "") + ".",
          { sci: true, ctx: x[4], guide: x[0].includes("\\(") ? sciGuide(v, x[1], x[2]) : [GS("Écris d'abord ce nombre en chiffres" + (x[3] ? " (en " + x[3] + ")" : "") + ".", v, M(N(v)) + "."), ...sciGuide(v, x[1], x[2]).slice(1)],
            traps: [TR(sv(x[1], -x[2]), "Vérifie le signe de l'exposant : " + (x[2] > 0 ? "nombre plus grand que 10, exposant positif." : "nombre plus petit que 1, exposant négatif.")), TR(sv(x[1], x[2] + (x[2] > 0 ? 1 : -1)), "Compte les rangs un par un.")] }); },
    ],
    2: [
      () => { const m = mant(), sh = pk([1, 2, -1, -2, -3]), e = nz(-6, 8), shown = r12(m * 10 ** sh), e0 = e - sh, v = sv(m, e);
        if (e0 === 0 || e0 === 1) return null;
        return Qv("Écris en notation scientifique : " + M(N(shown) + " \\cdot 10^{" + e0 + "}"), v, M(N(shown) + " = " + S(m, sh)) + ", donc " + M(S(m, sh) + " \\cdot 10^{" + e0 + "} = " + S(m, e)) + ".",
          { sci: true, ctx: "renorm", guide: [GS("Écris " + M(N(shown)) + " en notation scientifique : " + M(N(m) + " \\cdot 10^{" + box + "}") + ". Exposant ?", sh, M(N(shown) + " = " + S(m, sh)) + "."), GS("Additionne les exposants : " + M(sh + " + (" + e0 + ")") + " = ?", e, M(e) + "."), GSci("Résultat en notation scientifique ?", v, M(S(m, e)) + ".")],
            traps: [TR(sv(m, e0 - sh), "Si le premier nombre devient " + (sh > 0 ? "plus petit" : "plus grand") + ", l'exposant doit " + (sh > 0 ? "augmenter" : "diminuer") + " d'autant : on additionne " + M(par(sh)) + "."), TR(sv(m, e0), "Le premier facteur a changé : il faut corriger l'exposant.")] }); },
      () => { let m1, e1, m2, e2; do { m1 = mant(); m2 = mant(); e1 = nz(-6, 9); e2 = e1 + pk([-1, 1, 0]); } while (sv(m1, e1) === sv(m2, e2));
        const a = sv(m1, e1), b = sv(m2, e2), big = Math.max(a, b), small = Math.min(a, b);
        return Qv("Quel est le plus grand nombre : " + M(S(m1, e1)) + " ou " + M(S(m2, e2)) + " ? Recopie-le.", big, "On compare d'abord les exposants" + (e1 === e2 ? " (égaux), puis les nombres devant" : "") + " : le plus grand est " + M(S(...norm(big))) + ".",
          { sci: true, ctx: "comparer", guide: [GS("Le plus grand exposant ?", Math.max(e1, e2), e1 === e2 ? "Les exposants sont égaux : on compare les nombres devant." : "Le plus grand exposant l'emporte, quel que soit le nombre devant."), GSci("Le plus grand nombre ?", big, M(S(...norm(big))) + ".")],
            traps: [TR(small, e1 === e2 ? "Même exposant : compare les nombres devant." : "C'est l'exposant qui compte d'abord : " + M("10^{" + Math.max(e1, e2) + "}") + " est " + (10 ** Math.abs(e1 - e2)) + " fois plus grand que " + M("10^{" + Math.min(e1, e2) + "}") + ".")] }); },
      () => { const x = pk([
          [R.int(15, 95) / 10, 5, "km", "m", 3, "dist-km"],
          [pk([450, 520, 680, 380, 700]), 0, "nm", "m", -9, "nm"],
          [pk([7, 12, 25, 80, 3.5]), 0, "µm", "m", -6, "um"],
          [pk([1.5, 3.2, 6.4, 2.8]), 6, "km", "m", 3, "km6"],
          [pk([2.5, 4, 7.5, 1.2, 35]), 0, "mg", "kg", -6, "mg"]]);
        const val = x[1] ? sv(x[0], x[1]) : x[0], v = r12(val * 10 ** x[4]), [mm, ee] = norm(v);
        return Qv("Convertis " + M((x[1] ? S(x[0], x[1]) : N(x[0])) + u(x[2])) + " en " + x[3] + ". Écris le résultat en notation scientifique.", v,
          M("1" + u(x[2]) + " = 10^{" + x[4] + "}" + u(x[3])) + " ; " + M((x[1] ? S(x[0], x[1]) : N(x[0])) + " \\cdot 10^{" + x[4] + "} = " + S(mm, ee)) + " " + x[3] + ".",
          { sci: true, ctx: x[5], guide: [GS("Combien de " + x[3] + " dans 1 " + x[2] + " ? Donne l'exposant de 10.", x[4], M("1" + u(x[2]) + " = 10^{" + x[4] + "}" + u(x[3])) + "."), GSci("Multiplie et écris en notation scientifique.", v, M(S(mm, ee)) + ".")],
            traps: [TR(r12(val * 10 ** -x[4]), "Tu as converti dans le mauvais sens : " + x[2] + " → " + x[3] + (x[4] > 0 ? ", le nombre grandit." : ", le nombre devient plus petit."))] }); },
    ],
    3: [
      () => { const x = pk([[2.5, "km²", "m²", 6, "km2"], [35, "mm²", "m²", -6, "mm2"], [4.2, "cm³", "m³", -6, "cm3"], [1.8, "km³", "m³", 9, "km3"], [450, "cm²", "m²", -4, "cm2"], [6, "dm³", "m³", -3, "dm3"]]), v = r12(x[0] * 10 ** x[3]), [mm, ee] = norm(v);
        return Qv("Convertis " + M(N(x[0])) + " " + x[1] + " en " + x[2] + ". Écris le résultat en notation scientifique.", v, M("1" + u(x[1].replace(/[²³]/, "")) + " = 10^{" + x[3] / (x[1].includes("³") ? 3 : 2) + "}" + u(x[2].replace(/[²³]/, ""))) + ", donc 1 " + x[1] + " " + M("= 10^{" + x[3] + "}") + " " + x[2] + " ; " + M(N(x[0]) + " \\cdot 10^{" + x[3] + "} = " + S(mm, ee)) + " " + x[2] + ".",
          { sci: true, ctx: x[4], guide: [GS("Combien de " + x[2] + " dans 1 " + x[1] + " ? Donne l'exposant de 10 (pense " + (x[1].includes("³") ? "au cube" : "au carré") + ").", x[3], M("10^{" + x[3] + "}") + " : l'exposant de la conversion des longueurs, " + (x[1].includes("³") ? "multiplié par 3." : "multiplié par 2.")), GSci("Multiplie et écris en notation scientifique.", v, M(S(mm, ee)) + ".")],
            traps: [TR(r12(x[0] * 10 ** (x[3] / (x[1].includes("³") ? 3 : 2))), "Pour des " + (x[1].includes("³") ? "volumes, l'exposant est triplé" : "aires, l'exposant est doublé") + " : 1 " + x[1] + " = " + M("10^{" + x[3] + "}") + " " + x[2] + ".")] }); },
      () => { const m1 = pk([3, 4, 5, 6, 2]), e1 = R.int(3, 6), m2 = pk([2, 1.5, 5, 4]), e2 = e1 - R.int(0, 2), v = sv(m1, e1) + sv(m2, e2), [mm, ee] = norm(v);
        return Qv("Calcule et donne le résultat en notation scientifique : " + M(S(m1, e1) + " + " + S(m2, e2)), v, "Pour additionner, on écrit les deux nombres avec la même puissance de 10 (ou en décimal) : " + M(N(sv(m1, e1)) + " + " + N(sv(m2, e2)) + " = " + N(v) + " = " + S(mm, ee)) + ".",
          { sci: true, ctx: "somme", guide: [GS("Écris " + M(S(m1, e1)) + " en nombre décimal.", sv(m1, e1), M(N(sv(m1, e1))) + "."), GS("Et " + M(S(m2, e2)) + " ?", sv(m2, e2), M(N(sv(m2, e2))) + "."), GSci("Additionne et écris en notation scientifique.", v, M(N(v) + " = " + S(mm, ee)) + ".")],
            traps: [TR(sv(m1 + m2, e1 + e2), "Pour une somme, on n'additionne pas les exposants : il faut la même puissance de 10."), TR(sv(m1 + m2, e1), "Les puissances de 10 sont différentes : on ne peut pas additionner directement les nombres devant.")] }); },
      () => { const m = pk([6, 4.5, 3, 2.4, 8, 7.2]), e = ne1(-4, 9), sh = R.int(1, 3);
        if (e - sh === 0 || e - sh === 1) return null;
        const shownM = r12(m / 10 ** sh), v = sv(m, e - sh);
        return Qv("Écris en notation scientifique : " + M(N(shownM) + " \\cdot 10^{" + e + "}"), v, M(N(shownM) + " = " + S(m, -sh)) + ", donc " + M(S(m, -sh) + " \\cdot 10^{" + e + "} = " + S(m, e - sh)) + ".",
          { sci: true, ctx: "renorm-petit", guide: [GS(M(N(shownM) + " = " + N(m) + " \\cdot 10^{" + box + "}") + " : exposant ?", -sh, M(-sh) + "."), GS("Additionne les exposants : " + M("-" + sh + " + " + e) + " = ?", e - sh, M(e - sh) + "."), GSci("Résultat ?", v, M(S(m, e - sh)) + ".")],
            traps: [TR(sv(m, e + sh), "Le premier facteur grandit (" + M(N(shownM) + " \\to " + N(m)) + ") : l'exposant doit diminuer."), TR(sv(m, e), "Le premier facteur a changé : corrige l'exposant.")] }); },
    ],
  };

  // ===================== scicalc : calculer en notation scientifique =====================
  const SC = (a, m, b, n, op) => { const v = op === "*" ? sv(a * b, m + n) : sv(a / b, m - n); return [v, ...norm(v)]; };
  const scGuide = (a, m, b, n, op, v, mm, ee) => [
    GS("Les nombres devant : " + M(N(a) + (op === "*" ? " \\cdot " : " : ") + N(b)) + " = ?", r12(op === "*" ? a * b : a / b), M(N(r12(op === "*" ? a * b : a / b))) + "."),
    GS("Les puissances de 10 : exposant de " + M("10^{" + m + "}" + (op === "*" ? " \\cdot " : " : ") + "10^{" + n + "}") + " ?", op === "*" ? m + n : m - n, M(op === "*" ? m + " + (" + n + ") = " + (m + n) : m + " - (" + n + ") = " + (m - n)) + "."),
    GSci("Écris le résultat en notation scientifique (le nombre devant entre 1 et 10).", v, M(S(mm, ee)) + ".")];
  const SCALC = {
    1: [
      () => { const [a, b] = pk([[2, 3], [2, 4], [1.5, 2], [2.5, 2], [1.2, 3], [3, 3], [1.5, 4], [2, 4.5], [1.1, 5]]), m = R.int(2, 6), n = R.int(2, 6), [v, mm, ee] = SC(a, m, b, n, "*");
        return Qv("Calcule et donne le résultat en notation scientifique : " + M("(" + S(a, m) + ") \\cdot (" + S(b, n) + ")"), v, M(N(a) + " \\cdot " + N(b) + " = " + N(r12(a * b))) + " et " + M("10^{" + m + "} \\cdot 10^{" + n + "} = 10^{" + (m + n) + "}") + " : " + M(S(mm, ee)) + ".",
          { sci: true, ctx: "prod", guide: scGuide(a, m, b, n, "*", v, mm, ee), traps: [TR(sv(a * b, m * n), "On additionne les exposants (on ne les multiplie pas)."), TR(sv(a + b, m + n), "Les nombres devant se multiplient.")] }); },
      () => { const [a, b] = pk([[8, 2], [9, 3], [6, 4], [7.5, 2.5], [8.4, 2], [9.6, 3], [6, 1.5], [4.8, 1.6]]), m = R.int(5, 9), n = R.int(2, 4), [v, mm, ee] = SC(a, m, b, n, "/");
        return Qv("Calcule et donne le résultat en notation scientifique : " + M("(" + S(a, m) + ") : (" + S(b, n) + ")"), v, M(N(a) + " : " + N(b) + " = " + N(r12(a / b))) + " et " + M("10^{" + m + " - " + n + "} = 10^{" + (m - n) + "}") + " : " + M(S(mm, ee)) + ".",
          { sci: true, ctx: "quot", guide: scGuide(a, m, b, n, "/", v, mm, ee), traps: [TR(sv(a / b, m + n), "Pour une division, on soustrait les exposants."), TR(sv(a / b, m / n), "On soustrait les exposants, on ne les divise pas.")] }); },
      () => { const [a, b] = pk([[4, 5], [5, 6], [2.5, 8], [6, 7], [8, 5], [4, 7.5], [3, 9], [5, 5]]), m = R.int(2, 5), n = R.int(2, 5), [v, mm, ee] = SC(a, m, b, n, "*");
        return Qv("Calcule et donne le résultat en notation scientifique : " + M("(" + S(a, m) + ") \\cdot (" + S(b, n) + ")"), v, M(N(a) + " \\cdot " + N(b) + " = " + N(r12(a * b))) + " : plus grand que 10, on le réécrit " + M(S(mm, 1)) + ", donc " + M(S(mm, ee)) + ".",
          { sci: true, ctx: "prod-renorm", guide: scGuide(a, m, b, n, "*", v, mm, ee), traps: [TR(sv(mm, m + n), "Le produit " + M(N(r12(a * b))) + " vaut " + M(S(mm, 1)) + " : l'exposant augmente de 1.")] }); },
      () => { const x = pk([
          ["Un ordinateur effectue " + M(S(3, 9)) + " opérations par seconde. Combien d'opérations effectue-t-il en " + M(S(2, 3)) + " secondes ?", 3, 9, 2, 3, "ordi"],
          ["Un pays compte " + M(S(8, 6)) + " habitants. Chacun produit environ " + M(S(4, 2)) + " kg de déchets par an. Combien de kilos de déchets par an au total ?", 8, 6, 4, 2, "dechets"],
          ["Une colonie compte " + M(S(1.5, 4)) + " abeilles. Chacune visite environ " + M(S(2, 3)) + " fleurs par jour. Combien de fleurs sont visitées par jour ?", 1.5, 4, 2, 3, "abeilles"],
          ["Un câble de fibre optique transporte " + M(S(2.5, 9)) + " bits par seconde. Combien de bits en " + M(S(3, 2)) + " secondes ?", 2.5, 9, 3, 2, "fibre"]]);
        const [v, mm, ee] = SC(x[1], x[2], x[3], x[4], "*");
        return Qv(x[0] + " Réponds en notation scientifique.", v, M("(" + S(x[1], x[2]) + ") \\cdot (" + S(x[3], x[4]) + ") = " + S(mm, ee)) + ".",
          { sci: true, ctx: x[5], guide: scGuide(x[1], x[2], x[3], x[4], "*", v, mm, ee), traps: [TR(sv(x[1] * x[3], x[2] * x[4]), "On additionne les exposants (on ne les multiplie pas)."), TR(sv(x[1] + x[3], x[2] + x[4]), "Les nombres devant se multiplient.")] }); },
    ],
    2: [
      () => { const [a, b] = pk([[2, 3], [1.5, 4], [2.5, 3], [3, 3], [1.2, 4], [4, 2], [6, 5], [8, 2.5]]), m = ne1(-8, 5), n = nz(-6, -2), [v, mm, ee] = SC(a, m, b, n, "*");
        return Qv("Calcule et donne le résultat en notation scientifique : " + M("(" + S(a, m) + ") \\cdot (" + S(b, n) + ")"), v, M(N(r12(a * b)) + " \\cdot 10^{" + m + " + (" + n + ")} = " + S(mm, ee)) + ".",
          { sci: true, ctx: "prodneg", guide: scGuide(a, m, b, n, "*", v, mm, ee), traps: [TR(sv(r12(a * b), m - n), "Attention aux signes : " + M(m + " + (" + n + ") = " + (m + n)) + "."), TR(sv(a * b, m * n), "On additionne les exposants.")] }); },
      () => { const [a, b] = pk([[2, 5], [1.2, 4], [3, 6], [1.5, 2.5], [2.4, 8], [1, 4], [3.6, 9]]), m = R.int(2, 6), n = ne1(-4, 3), [v, mm, ee] = SC(a, m, b, n, "/");
        return Qv("Calcule et donne le résultat en notation scientifique : " + M("(" + S(a, m) + ") : (" + S(b, n) + ")"), v, M(N(a) + " : " + N(b) + " = " + N(r12(a / b))) + " (plus petit que 1, on le réécrit " + M(S(mm, -1)) + ") et " + M("10^{" + m + " - (" + n + ")} = 10^{" + (m - n) + "}") + " : " + M(S(mm, ee)) + ".",
          { sci: true, ctx: "quot-renorm", guide: scGuide(a, m, b, n, "/", v, mm, ee), traps: [TR(sv(mm, m - n), M(N(r12(a / b))) + " est plus petit que 1 : " + M(N(r12(a / b)) + " = " + S(mm, -1)) + ", l'exposant baisse de 1."), TR(sv(a / b, m + n), "Pour une division, on soustrait les exposants.")] }); },
      () => { const a = pk([2, 3, 4, 1.5, 5, 1.2, 6]), m = ne1(-5, 6), k = 2, v = sv(a * a, 2 * m), [mm, ee] = norm(v);
        return Qv("Calcule et donne le résultat en notation scientifique : " + M("(" + S(a, m) + ")^{2}"), v, M(N(a) + "^2 = " + N(r12(a * a))) + " et " + M("(10^{" + m + "})^2 = 10^{" + 2 * m + "}") + " : " + M(S(mm, ee)) + ".",
          { sci: true, ctx: "carre", guide: [GS(M(N(a) + "^2") + " = ?", r12(a * a), M(N(r12(a * a))) + "."), GS("Exposant de " + M("(10^{" + m + "})^2") + " ?", 2 * m, M(2 * m) + "."), GSci("Résultat en notation scientifique ?", v, M(S(mm, ee)) + ".")],
            traps: [TR(sv(a * a, m + k), "Puissance d'une puissance : on multiplie l'exposant par 2."), TR(sv(2 * a, 2 * m), "Le nombre devant est aussi élevé au carré.")] }); },
      () => { const x = pk([
          ["Une feuille de papier a une épaisseur de " + M(S(1, -4)) + " m. Quelle est l'épaisseur d'une rame de " + M(S(5, 2)) + " feuilles (en m) ?", 1, -4, 5, 2, "feuille"],
          ["Un globule rouge mesure environ " + M(S(7, -6)) + " m de diamètre. On en aligne " + M(S(2.5, 13)) + " (le nombre de globules rouges d'un adulte). Quelle longueur obtient-on (en m) ?", 7, -6, 2.5, 13, "globules"],
          ["Une goutte d'eau contient environ " + M(S(1.7, 21)) + " molécules. Combien de molécules y a-t-il dans " + M(S(2, 4)) + " gouttes ?", 1.7, 21, 2, 4, "gouttes"],
          ["Un grain de sable a une masse d'environ " + M(S(6, -5)) + " kg. Quelle est la masse de " + M(S(4, 8)) + " grains (en kg) ?", 6, -5, 4, 8, "sable"]]);
        const [v, mm, ee] = SC(x[1], x[2], x[3], x[4], "*");
        return Qv(x[0] + " Réponds en notation scientifique.", v, M("(" + S(x[1], x[2]) + ") \\cdot (" + S(x[3], x[4]) + ") = " + S(mm, ee)) + ".",
          { sci: true, ctx: x[5], guide: scGuide(x[1], x[2], x[3], x[4], "*", v, mm, ee), traps: [TR(sv(x[1] * x[3], x[2] * x[4]), "On additionne les exposants."), TR(sv(x[1] / x[3], x[2] - x[4]), "Il faut multiplier : la quantité totale, c'est la valeur d'un élément fois le nombre d'éléments.")] }); },
    ],
    3: [
      () => { const x = pk([["la Terre au Soleil", 1.5, 8], ["la Terre à la Lune", 3.84, 5], ["la Terre à Mars (au plus près)", 5.4, 7], ["Jupiter au Soleil", 7.8, 8], ["la Terre à Vénus (au plus près)", 3.9, 7]]), [v, mm, ee] = SC(x[1], x[2], 3, 5, "/");
        return Qv("La lumière parcourt " + M(S(3, 5)) + " km par seconde. La distance de " + x[0] + " vaut environ " + M(S(x[1], x[2])) + " km. Combien de secondes la lumière met-elle pour la parcourir ? (notation scientifique)", v,
          "Durée = distance : vitesse = " + M("(" + S(x[1], x[2]) + ") : (" + S(3, 5) + ") = " + S(mm, ee)) + " s" + (ee >= 2 ? " (environ " + N(Math.round(v / 60)) + " min)" : "") + ".",
          { sci: true, ctx: "lumiere", guide: [GS("Durée = distance : vitesse. Les nombres devant : " + M(N(x[1]) + " : 3") + " = ?", r12(x[1] / 3), M(N(r12(x[1] / 3))) + "."), GS("Les puissances : exposant de " + M("10^{" + x[2] + "} : 10^{5}") + " ?", x[2] - 5, M(x[2] - 5) + "."), GSci("La durée en secondes, en notation scientifique ?", v, M(S(mm, ee)) + " s.")],
            traps: [TR(sv(x[1] * 3, x[2] + 5), "Durée = distance divisée par la vitesse, pas multipliée."), TR(sv(r12(x[1] / 3), x[2] - 5), "Le nombre devant doit être entre 1 et 10 : réécris " + M(N(r12(x[1] / 3))) + ".")] }); },
      () => { const x = pk([["une baleine bleue", 1.5, 5, "une fourmi", 3, -6, "fourmi"], ["un éléphant", 6, 3, "une abeille", 1.2, -4, "abeille"], ["la Terre", 6, 24, "la Lune", 7.5, 22, "terrelune"], ["un camion", 4, 4, "un grain de riz", 2.5, -5, "riz"]]), [v, mm, ee] = SC(x[1], x[2], x[4], x[5], "/");
        return Qv("La masse de " + x[0] + " est d'environ " + M(S(x[1], x[2])) + " kg, celle de " + x[3] + " d'environ " + M(S(x[4], x[5])) + " kg. Combien de fois " + x[0] + " est-elle plus lourde ? (notation scientifique)".replace(/est-elle plus lourde/, x[0].startsWith("un ") ? "est-il plus lourd" : "est-elle plus lourde"), v,
          M("(" + S(x[1], x[2]) + ") : (" + S(x[4], x[5]) + ") = " + S(mm, ee)) + ".",
          { sci: true, ctx: x[6], guide: scGuide(x[1], x[2], x[4], x[5], "/", v, mm, ee), traps: [TR(sv(x[4] / x[1], x[5] - x[2]), "On divise la grande masse par la petite."), TR(sv(r12(x[1] / x[4]), x[2] + x[5]), "Pour une division, on soustrait les exposants : " + M(x[2] + " - (" + x[5] + ")") + ".")] }); },
      () => { const x = pk([[1000, 1, 9, "un milliard"], [200, 5, 8, "500 millions"], [100, 2, 8, "200 millions"], [50, 1, 7, "10 millions"]]), billets = sv(x[1], x[2]) / x[0], ep = 1e-4, v = r12(billets * ep), [mm, ee] = norm(v), [bm, be] = norm(billets);
        return Qv("Un billet de " + x[0] + " CHF a une épaisseur d'environ " + M(S(1, -4)) + " m. Quelle serait la hauteur d'une pile de " + x[3] + " de francs en billets de " + x[0] + " CHF (en m, notation scientifique) ?", v,
          "Nombre de billets : " + M("(" + S(x[1], x[2]) + ") : " + N(x[0]) + " = " + S(bm, be)) + " ; hauteur : " + M("(" + S(bm, be) + ") \\cdot 10^{-4} = " + S(mm, ee)) + " m.",
          { sci: true, ctx: "billets", guide: [GSci("Combien de billets ? (notation scientifique)", billets, M(S(bm, be)) + "."), GSci("Hauteur de la pile en m ?", v, M(S(mm, ee)) + " m.")],
            traps: [TR(r12(sv(x[1], x[2]) * ep), "Il faut d'abord le nombre de billets : divise la somme par " + x[0] + " CHF."), TR(sv(bm, be + 4), "L'épaisseur vaut " + M("10^{-4}") + " m : on ajoute −4 à l'exposant.")] }); },
      () => { const [a, b, c] = pk([[6, 4, 3], [8, 3, 4], [2, 9, 6], [5, 6, 2], [4, 4.5, 3], [9, 2, 6]]), m = ne1(-4, 6), n = ne1(-5, 5), p = ne1(-6, 4), v = sv(a * b / c, m + n - p), [mm, ee] = norm(v);
        return Qv("Calcule et donne le résultat en notation scientifique : " + M("\\frac{(" + S(a, m) + ") \\cdot (" + S(b, n) + ")}{" + S(c, p) + "}"), v, M("\\frac{" + N(a * b) + "}{" + c + "} = " + N(r12(a * b / c))) + " et " + M("10^{" + m + " + (" + n + ") - (" + p + ")} = 10^{" + (m + n - p) + "}") + " : " + M(S(mm, ee)) + ".",
          { sci: true, ctx: "frac", guide: [GS("Les nombres : " + M("\\frac{" + a + " \\cdot " + N(b) + "}{" + c + "}") + " = ?", r12(a * b / c), M(N(r12(a * b / c))) + "."), GS("L'exposant : " + M(m + " + (" + n + ") - (" + p + ")") + " = ?", m + n - p, M(m + n - p) + "."), GSci("Résultat en notation scientifique ?", v, M(S(mm, ee)) + ".")],
            traps: [TR(sv(a * b / c, m + n + p), "On divise par " + M("10^{" + p + "}") + " : on soustrait son exposant."), TR(sv(a * b * c, m + n - p), "On divise par " + M(c) + " : le nombre du dénominateur divise.")] }); },
    ],
  };

  // ===================== Défis (niveau 4) : problèmes en plusieurs étapes =====================
  const PROBS = {
    prio: [
      () => { const n = R.int(3, 6), p = pk([12, 15, 18]), r = R.int(2, 4), s = pk([4, 5, 6]);
        return P("Une classe va au musée. Le bus coûte " + M(n * 40) + " CHF pour tout le groupe. L'entrée coûte " + M(p) + " CHF par élève, avec une réduction de " + M(r) + " CHF par élève. Il y a " + M(s * 4) + " élèves.",
          [["a) Prix d'entrée par élève après réduction (CHF)", p - r], ["b) Prix total des entrées (CHF)", (p - r) * s * 4], ["c) Coût total de la sortie (CHF)", n * 40 + (p - r) * s * 4]],
          ["Écris le calcul en une ligne avec des parenthèses : " + n * 40 + " + " + s * 4 + " · (" + p + " − " + r + ").", "La parenthèse d'abord, puis la multiplication, puis l'addition."],
          "c) " + M(n * 40 + " + " + s * 4 + " \\cdot (" + p + " - " + r + ") = " + n * 40 + " + " + (p - r) * s * 4 + " = " + (n * 40 + (p - r) * s * 4)) + " CHF."); },
      () => { const a = R.int(2, 5), b = R.int(6, 9), c = R.int(2, 4);
        return P("Place des parenthèses dans " + M(a + " + " + b + " \\cdot " + c + " - 1") + " pour obtenir différents résultats. Calcule :",
          [["a) " + a + " + " + b + " · " + c + " − 1 (sans parenthèses)", a + b * c - 1], ["b) (" + a + " + " + b + ") · " + c + " − 1", (a + b) * c - 1], ["c) " + a + " + " + b + " · (" + c + " − 1)", a + b * (c - 1)], ["d) (" + a + " + " + b + ") · (" + c + " − 1)", (a + b) * (c - 1)]],
          ["Sans parenthèses : la multiplication d'abord.", "Les parenthèses changent l'ordre des calculs."], "a) " + (a + b * c - 1) + " ; b) " + ((a + b) * c - 1) + " ; c) " + (a + b * (c - 1)) + " ; d) " + (a + b) * (c - 1) + "."); },
    ],
    fracadd: [
      () => { const [a, b, c, e] = pk([[1, 3, 1, 4], [2, 5, 1, 3], [1, 4, 1, 6], [3, 8, 1, 4]]), rest = qs([1, 1], qa([a, b], [c, e])), tot = pk([120, 240, 360]) ;
        return P("Lors d'une élection de délégué, " + M(fT(a, b)) + " des élèves votent pour Ana, " + M(fT(c, e)) + " pour Ben, et le reste pour Chloé. L'école compte " + tot + " élèves.",
          [["a) Fraction des voix pour Chloé (tape la fraction)", qv(rest)], ["b) Nombre de voix pour Ana", tot * a / b], ["c) Nombre de voix pour Chloé", tot * qv(rest)]],
          ["a) 1 − (" + a + "/" + b + " + " + c + "/" + e + ").", "b) et c) : fraction × nombre d'élèves."], "a) " + M(qT(rest)) + " ; b) " + M(tot * a / b) + " ; c) " + M(r12(tot * qv(rest))) + "."); },
      () => P("Un sirop se dilue ainsi : " + M(fT(1, 6)) + " de sirop, " + M(fT(2, 3)) + " d'eau plate et le reste d'eau gazeuse.",
          [["a) Fraction d'eau gazeuse (tape la fraction)", 1 / 6], ["b) Pour 1,2 L de boisson, volume de sirop (L)", 0.2], ["c) Volume d'eau plate (L)", 0.8]],
          ["a) 1 − 1/6 − 2/3, au dénominateur 6.", "b) 1/6 de 1,2 L."], "a) " + M("1 - \\frac{1}{6} - \\frac{4}{6} = \\frac{1}{6}") + " ; b) " + M("0{,}2") + " L ; c) " + M("0{,}8") + " L."),
    ],
    fracmul: [
      () => { const N0 = pk([360, 480, 600, 720]);
        return P("Une ville de " + N0 + " hectares : les " + M(fT(2, 5)) + " sont des forêts ; les " + M(fT(3, 4)) + " des forêts sont des feuillus.",
          [["a) Surface de forêt (ha)", N0 * 2 / 5], ["b) Fraction de la ville couverte de feuillus (tape la fraction)", 3 / 10], ["c) Surface de feuillus (ha)", N0 * 3 / 10]],
          ["b) Les 3/4 des 2/5, c'est 3/4 · 2/5.", "c) Cette fraction de " + N0 + " ha."], "a) " + M(N0 * 2 / 5) + " ha ; b) " + M("\\frac{3}{4} \\cdot \\frac{2}{5} = \\frac{3}{10}") + " ; c) " + M(N0 * 3 / 10) + " ha."); },
      () => { const L0 = pk([12, 15, 18]);
        return P("Un ruban de " + L0 + " m. On en coupe les " + M(fT(1, 3)) + ", puis on coupe le reste en morceaux de " + M(fT(2, 5)) + " m.",
          [["a) Longueur coupée d'abord (m)", L0 / 3], ["b) Longueur restante (m)", L0 * 2 / 3], ["c) Nombre de morceaux de 2/5 m", L0 * 2 / 3 * 5 / 2]],
          ["b) " + L0 + " − " + L0 / 3 + ".", "c) Divise par 2/5 : multiplie par 5/2."], "c) " + M(L0 * 2 / 3 + " : \\frac{2}{5} = " + L0 * 2 / 3 + " \\cdot \\frac{5}{2} = " + L0 * 2 / 3 * 5 / 2) + " morceaux."); },
    ],
    fracconv: [
      () => P("Trois magasins proposent le même article à 80 CHF : le premier fait " + M(fT(1, 4)) + " de rabais, le deuxième " + M("22\\,\\%") + ", le troisième " + M("0{,}3") + " du prix en moins après une hausse de 10 %.",
          [["a) Prix au premier magasin (CHF)", 60], ["b) Prix au deuxième (CHF)", 62.4], ["c) Prix au troisième (CHF)", 61.6]],
          ["a) 80 · (1 − 1/4).", "c) 80 · 1,1 · 0,7."], "a) " + M("60") + " ; b) " + M("80 \\cdot 0{,}78 = 62{,}4") + " ; c) " + M("80 \\cdot 1{,}1 \\cdot 0{,}7 = 61{,}6") + " : le premier est le moins cher."),
      () => P("Nombres périodiques.", [["a) 0,777… en fraction (tape la fraction)", 7 / 9], ["b) 0,1818… en fraction", 2 / 11], ["c) 0,999… = ?", 1]],
          ["a) 10x − x = 7.", "c) 10x − x = 9, donc 9x = 9."], "a) " + M("\\frac{7}{9}") + " ; b) " + M("\\frac{18}{99} = \\frac{2}{11}") + " ; c) " + M("x = 1") + " : " + M("0{,}\\overline{9} = 1") + "."),
    ],
    puiss: [
      () => P("Une feuille pliée en deux double d'épaisseur à chaque pliage. Elle mesure " + M("0{,}1") + " mm d'épaisseur.",
          [["a) Nombre de couches après 5 pliages", 32], ["b) Épaisseur après 10 pliages (mm, arrondi à l'unité)", 102.4, 1], ["c) Combien de pliages pour dépasser 1 m (1000 mm) ?", 14]],
          ["Après n pliages : 2ⁿ couches.", "c) 2ⁿ · 0,1 > 1000, donc 2ⁿ > 10'000."], "a) " + M("2^5 = 32") + " ; b) " + M("2^{10} \\cdot 0{,}1 = 102{,}4") + " mm ; c) " + M("2^{13} = 8192 < 10\\text{'}000 < 2^{14}") + " : 14 pliages."),
      () => P("Calcule sans calculatrice, en utilisant les propriétés des puissances.", [["a) 2⁵ · 2⁻³", 4], ["b) (3²)³ ÷ 3⁵", 3], ["c) 5⁻² · 10²", 4], ["d) 2¹⁰ ÷ 4⁴", 4]],
          ["Même base : additionne ou soustrais les exposants.", "d) 4⁴ = (2²)⁴ = 2⁸."], "a) " + M("2^2 = 4") + " ; b) " + M("3^6 : 3^5 = 3") + " ; c) " + M("\\frac{100}{25} = 4") + " ; d) " + M("2^{10} : 2^8 = 4") + "."),
    ],
    sci: [
      () => P("Un atome d'hydrogène a un diamètre d'environ " + M("1{,}06 \\cdot 10^{-10}") + " m.",
          [["a) Ce diamètre en nm (1 nm = 10⁻⁹ m)", 0.106], ["b) Combien d'atomes alignés pour faire 1 mm ? (arrondi au million)", 1e-3 / 1.06e-10, 1e6]],
          ["a) Divise par 10⁻⁹.", "b) 10⁻³ ÷ (1,06 · 10⁻¹⁰)."], "a) " + M("0{,}106") + " nm ; b) " + M("\\frac{10^{-3}}{1{,}06 \\cdot 10^{-10}} \\approx 9{,}4 \\cdot 10^6") + " atomes."),
      () => P("La Terre a un rayon d'environ " + M("6{,}4 \\cdot 10^3") + " km.", [["a) Rayon en m (nombre entier)", 6400000], ["b) Circonférence de l'équateur en km (2πr, arrondie au millier)", 2 * Math.PI * 6400, 1000]],
          ["1 km = 10³ m.", "b) 2 · π · 6400."], "a) " + M("6{,}4 \\cdot 10^6 = 6\\text{'}400\\text{'}000") + " m ; b) " + M("2\\pi \\cdot 6400 \\approx 40\\text{'}000") + " km."),
    ],
    scicalc: [
      () => P("Une année-lumière est la distance parcourue par la lumière en un an. La lumière va à " + M("3 \\cdot 10^5") + " km/s, et une année compte environ " + M("3{,}15 \\cdot 10^7") + " s.",
          [["a) Une année-lumière en km (notation scientifique)", 9.45e12], ["b) L'étoile Proxima est à 4,2 années-lumière : distance en km (notation scientifique, deux décimales)", 3.969e13, 1e11]],
          ["a) Vitesse × durée.", "b) 4,2 × le résultat a)."], "a) " + M("9{,}45 \\cdot 10^{12}") + " km ; b) " + M("\\approx 3{,}97 \\cdot 10^{13}") + " km."),
      () => P("Le corps humain contient environ " + M("5") + " L de sang, et chaque mm³ de sang contient environ " + M("5 \\cdot 10^6") + " globules rouges.",
          [["a) Nombre de mm³ dans 1 L (tape la puissance de 10, ex. 10^6)", 1e6], ["b) Nombre de globules rouges dans 5 L (notation scientifique)", 2.5e13]],
          ["1 L = 1 dm³ = 10⁶ mm³.", "b) 5 · 10⁶ · 5 · 10⁶."], "a) " + M("10^6") + " ; b) " + M("5 \\cdot 10^6 \\cdot 5 \\cdot 10^6 = 2{,}5 \\cdot 10^{13}") + "."),
    ],
  };

  // ===================== Enregistrement =====================
  // « Trouve l'erreur » (24.11, chantier I) : on multiplie les exposants au lieu de les additionner.
  PUISS[2].push(() => { const a = R.pick([2, 3, 5, 10]), m = R.int(2, 5), n = R.int(3, 6), w = R.pick(["Sam", "Lina", "Noé", "Inès", "Yanis", "Léa"]);
    return Qv(w + " écrit : « " + M(a + "^{" + m + "} \\cdot " + a + "^{" + n + "} = " + a + "^{" + m * n + "}") + " ». Trouve l'erreur, puis donne le bon exposant.", m + n,
      "Erreur : " + M(a + "^{" + m + "}") + " compte " + m + " facteurs " + a + " et " + M(a + "^{" + n + "}") + " en compte " + n + " : en tout " + M(m + " + " + n + " = " + (m + n)) + " facteurs, donc " + M(a + "^{" + (m + n) + "}") + ". On multiplie les exposants pour une puissance de puissance, " + M("(" + a + "^{" + m + "})^{" + n + "}") + ".",
      { ctx: "erreur", guide: [GS("Combien de facteurs " + a + " dans " + M(a + "^{" + m + "}") + " ?", m, M(m) + "."), GS("Et dans " + M(a + "^{" + n + "}") + " ?", n, M(n) + "."), GS("En tout (le bon exposant) ?", m + n, M(m + n) + ".")],
        traps: [TRAP(m * n, "C'est l'exposant de " + w + " : on additionne les exposants quand on multiplie deux puissances de même base.")] }); });
  // « Trouve l'erreur » (24.11, chantier I, suite) : priorités, fractions (addition, division), notation scientifique.
  const camarade = () => pk(["Sam", "Lina", "Noé", "Inès", "Yanis", "Léa"]);
  // prio : la soustraction faite avant la multiplication par la parenthèse.
  PRIO[2].push(() => { const b = R.int(2, 5), c = R.int(2, 6), d = R.int(2, 7), v = R.int(3, 15), a = b * (c + d) + v, faux = (a - b) * (c + d), w = camarade();
    if ([a, b, c, d, c + d, a - b, faux].includes(v)) return null;
    return Qv(w + " écrit : « " + M(a + " - " + b + " \\cdot (" + c + " + " + d + ") = " + (a - b) + " \\cdot " + (c + d) + " = " + faux) + " ». Trouve l'erreur, puis calcule correctement.", v,
      "Erreur : " + w + " a soustrait avant de multiplier. Parenthèses d'abord, puis la multiplication, enfin la soustraction : " + M(a + " - " + b + " \\cdot " + (c + d) + " = " + a + " - " + b * (c + d) + " = " + v) + ".",
      { ctx: "erreur", guide: [GS("Parenthèses d'abord : " + M(c + " + " + d) + " = ?", c + d, M(c + d) + "."), GS("Puis la multiplication : " + M(b + " \\cdot " + (c + d)) + " = ?", b * (c + d), M(b * (c + d)) + "."), GS("Enfin " + M(a + " - " + b * (c + d)) + " = ?", v, M(v) + ".")],
        traps: [TR(faux, "C'est le calcul de " + w + " : la multiplication passe avant la soustraction.")] }); });
  // fracadd : numérateurs et dénominateurs additionnés entre eux.
  FADD[2].push(() => { const [b, e] = pk(PAIRS), a = cop(1, b), c = cop(1, e), res = qa([a, b], [c, e]), w = camarade(), f = rq(a + c, b + e), L = lcm(b, e);
    return Qv(w + " écrit : « " + M(fT(a, b) + " + " + fT(c, e) + " = " + fT(a + c, b + e)) + " ». Trouve l'erreur, puis donne le bon résultat (fraction irréductible).", qv(res),
      "Erreur : on n'additionne pas les dénominateurs (sinon " + M(fT(1, 2) + " + " + fT(1, 2)) + " ferait " + M(fT(2, 4)) + ", une demie !). Même dénominateur d'abord : " + M(fT(a * L / b, L) + " + " + fT(c * L / e, L) + " = " + qT(res)) + ".",
      { ctx: "erreur", guide: [GS("Plus petit dénominateur commun de " + M(b) + " et " + M(e) + " ?", L, M(L) + "."), GS("Numérateur de la somme : " + M(a + " \\cdot " + L / b + " + " + c + " \\cdot " + L / e) + " = ?", (a * L) / b + (c * L) / e, M((a * L) / b + (c * L) / e) + ", sur " + M(L) + "."), GS("Résultat (fraction irréductible) ?", qv(res), M(fT((a * L) / b + (c * L) / e, L) + (gcd2((a * L) / b + (c * L) / e, L) > 1 ? " = " + qT(res) : "")) + ".")], traps: [TR(qv(f), "C'est le résultat de " + w + " : on met les fractions au même dénominateur, puis on additionne les numérateurs seulement.")] }); });
  // fracmul : division sans passer par l'inverse.
  FMUL[2].push(() => { let a, b, c, e; do { b = R.int(2, 9); e = R.int(2, 9); a = irr(b, 9); c = irr(e, 9); } while (a * e === b * c || c === e || a * c === b * e);
    const res = rq(a * e, b * c), f = rq(a * c, b * e), w = camarade();
    return Qv(w + " écrit : « " + M(fT(a, b) + " : " + fT(c, e) + " = " + fT(a, b) + " \\cdot " + fT(c, e) + " = " + qT(f)) + " ». Trouve l'erreur, puis donne le bon quotient (fraction irréductible).", qv(res),
      "Erreur : diviser par " + M(fT(c, e)) + ", c'est multiplier par son <b>inverse</b> " + M(fT(e, c)) + " : " + M(fT(a, b) + " \\cdot " + fT(e, c) + " = " + qT(res)) + ".",
      { ctx: "erreur", guide: [GS("L'inverse de " + M(fT(c, e)) + " ? (tape la fraction)", e / c, M(fT(e, c)) + "."), GS("Calcule " + M(fT(a, b) + " \\cdot " + fT(e, c)) + " (fraction irréductible) :", qv(res), M(qT(res)) + ".")],
        traps: [TR(qv(f), "C'est le résultat de " + w + " : il a multiplié par " + M(fT(c, e)) + " au lieu de son inverse.")] }); });
  // scicalc : quotient de puissances de 10, exposant négatif mal soustrait.
  SCALC[2].push(() => { const [a, b] = pk([[8, 2], [6, 3], [9, 3], [8, 4], [7.5, 2.5], [6, 2], [9, 2], [4.8, 1.6]]), m = R.int(3, 8), n = -R.int(2, 6), k = r12(a / b), w = camarade();
    if (m + n === 0 || m + n === 1) return null;
    const v = sv(k, m - n), f = sv(k, m + n);
    return Qv(w + " écrit : « " + M("\\frac{" + S(a, m) + "}{" + S(b, n) + "} = " + S(k, m + n)) + " ». Trouve l'erreur, puis donne le bon résultat en notation scientifique.", v,
      "Erreur : pour un quotient, on <b>soustrait</b> les exposants : " + M(m + " - (" + n + ") = " + (m - n)) + ". " + M(N(a) + " : " + N(b) + " = " + N(k)) + ", donc " + M(S(k, m - n)) + ".",
      { sci: true, ctx: "erreur", guide: [GS("Nombres devant : " + M(N(a) + " : " + N(b)) + " = ?", k, M(N(k)) + "."), GS("Exposant : " + M(m + " - (" + n + ")") + " = ?", m - n, M(m - n) + " (soustraire un négatif, c'est ajouter)."), GSci("Résultat en notation scientifique ?", v, M(S(k, m - n)) + ".")],
        traps: [TR(f, "C'est le résultat de " + w + " : " + M("10^{" + m + "} : 10^{" + n + "} = 10^{" + m + " - (" + n + ")}") + ".")] }); });
  const ALL = { prio: PRIO, fracadd: FADD, fracmul: FMUL, fracconv: FCONV, puiss: PUISS, sci: SCI, scicalc: SCALC };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => pickForm(lv[Math.min(Math.max(d, 1), 3)]);
    if (typeof VAR !== "undefined") VAR[id] = {};
    if (typeof PROB !== "undefined") delete PROB[id];
    PROB_EXTRA[id] = PROBS[id];
  }
  Object.assign(HINTS_EXTRA, {
    prio: "Ordre des calculs : parenthèses (et barres de fraction), puis puissances, puis · et ÷, enfin + et −, de gauche à droite.",
    fracadd: "Même dénominateur d'abord (le plus petit possible), puis on additionne les numérateurs ; on simplifie à la fin.",
    fracmul: "Numérateurs entre eux, dénominateurs entre eux ; diviser, c'est multiplier par l'inverse. Simplifie avant de multiplier.",
    fracconv: "Fraction → décimal : divise. Décimal → fraction : sur 10, 100, 1000…, puis simplifie. Pour cent = sur 100. Période de 1 chiffre : sur 9 ; de 2 chiffres : sur 99.",
    puiss: "Même base : on additionne les exposants (produit), on les soustrait (quotient), on les multiplie (puissance d'une puissance). Exposant négatif : inverse.",
    sci: "a · 10ⁿ avec 1 ≤ a < 10 ; n compte les rangs dont on déplace la virgule (n < 0 pour un nombre plus petit que 1).",
    scicalc: "On calcule séparément les nombres devant et les puissances de 10, puis on remet le nombre devant entre 1 et 10.",
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    prio: ["Respecter les priorités (· avant +)", "Parenthèses, crochets, barre de fraction", "Puissances et nombres relatifs"],
    fracadd: ["Additionner des fractions simples", "Dénominateur commun, plusieurs fractions", "Fractions relatives et parenthèses"],
    fracmul: ["Multiplier des fractions, fraction d'un nombre", "Diviser des fractions", "Calculs mêlés et problèmes"],
    fracconv: ["Fraction, décimal, pourcentage", "Pourcentages et nombres périodiques", "Périodes longues, pourcentages successifs"],
    puiss: ["Produit, quotient, puissance d'une puissance", "Exposants négatifs", "Calculer avec plusieurs propriétés"],
    sci: ["Écrire en notation scientifique", "Comparer, convertir des unités", "Aires, volumes, sommes"],
    scicalc: ["Multiplier et diviser", "Exposants négatifs, carrés, contextes", "Problèmes en plusieurs étapes"],
  });
})();

// Chantier 11e · 2. Pythagore et 3. 3D (17.11, plan de cheminement de 11e, début d'année) : une seule source pour
// pyth, pythfig, pythrec (Pythagore) et vol, volcone, airepyr, volcomp, volmanq (volumes et aires).
// Même standard que ch11_prop.js / ch11_no.js : au moins 3 formes par niveau, pas à pas sur toutes les questions,
// erreurs typiques, ctx ; défis en plusieurs étapes. Formes modelées sur des dossiers de 11e (valeurs exactes a√b,
// distance dans un repère, carré inscrit dans un cercle, pyramide du Louvre, pyramide inscrite dans un cube, gélule,
// variations de volume, isoler une dimension), jamais recopiées. Réponses exactes : a√b (racine simplifiée) ou kπ.
(function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const r12 = (v) => +(+v).toPrecision(12);
  const N = (v) => { v = r12(v); let [i, f] = String(Math.abs(v)).split("."); if (i.length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}"); return (v < 0 ? "-" : "") + i + (f ? "{,}" + f : ""); };
  const T = (v) => M(N(v));
  const rd = (v, s) => Math.round(v / s) * s;
  const cm = (v, un = "cm") => M(N(v) + "\\ \\text{" + un + "}");
  // ---------- racines : n = k²·m ----------
  const simp = (n) => { let k = 1, m = n; for (let p = 2; p * p <= m; p++) while (m % (p * p) === 0) { m /= p * p; k *= p; } return [k, m]; };
  const rT = (k, m) => (m === 1 ? String(k) : (k === 1 ? "" : k) + "\\sqrt{" + m + "}");
  const rC = (k, m) => (m === 1 ? String(k) : (k === 1 ? "" : k) + "√" + m);
  const piT = (k) => (k === 1 ? "" : N(k)) + "\\pi";
  // ---------- constructeurs ----------
  const keep = (value, traps, round) => { const seen = new Set(); return (traps || []).filter((t) => { if (!t || !isFinite(t.v) || Math.abs(t.v - value) <= Math.max(round || 0, 1e-9 * Math.max(1, Math.abs(value)))) return false; const k = r12(t.v); if (seen.has(k)) return false; seen.add(k); return true; }); };
  const Qv = (q, value, sol, o = {}) => {
    const spec = Object.assign({ kind: "value", value }, o.round ? { round: o.round } : {}, o.radical ? { radical: true } : {});
    const x = { q, spec, sol, guide: o.guide, traps: keep(value, o.traps, o.round), ctx: o.ctx };
    if (o.fig) x.fig = o.fig; if (o.canon) x.canon = o.canon;
    return x;
  };
  const GSR = (ask, value, sol) => ({ ask, spec: { kind: "value", value, radical: true }, sol });
  const TR = TRAP;
  const P = (q, parts, hints, sol, fig) => ({ fig, q, parts: parts.map(([label, value, round]) => ({ label, spec: Object.assign({ kind: "value", value }, round ? { round } : {}) })), hints, sol });
  const TRIP = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [20, 21, 29], [12, 16, 20], [9, 40, 41], [15, 20, 25]];
  const trip = (maxC = 41) => pk(TRIP.filter((t) => t[2] <= maxC));
  const EXA = " (valeur exacte : écris par exemple " + M("3\\sqrt{5}") + ")";
  const PIX = " (valeur exacte avec " + M("\\pi") + ", par exemple " + M("12\\pi") + ")";
  // Figures
  const RT = (a, b, la, lb, lc, names) => GF.rightTri(a, b, { la, lb, lc, ...(names ? { names } : {}) });

  // ===================== pyth : théorème de Pythagore =====================
  const radHyp = () => { let a, b, n; do { a = R.int(1, 9); b = R.int(2, 9); n = a * a + b * b; } while (a >= b || Number.isInteger(Math.sqrt(n)) || simp(n)[0] === 1 && R.rand() < 0.5); return [a, b, n]; };
  const radCat = () => { let c, a, n; do { c = R.int(4, 12); a = R.int(1, c - 1); n = c * c - a * a; } while (Number.isInteger(Math.sqrt(n)) || simp(n)[0] === 1 && R.rand() < 0.5); return [c, a, n]; };
  const PYTH = {
    1: [
      () => { const [a, b, c] = trip(), k = pk([1, 1, 2, 0.5]), [A, B, C] = [a * k, b * k, c * k];
        return Qv("Le triangle " + M("ABC") + " est rectangle en " + M("C") + ", avec " + M("BC = " + N(A)) + " cm et " + M("AC = " + N(B)) + " cm. Calcule " + M("AB") + " (en cm).", C, M("AB^2 = " + N(A) + "^2 + " + N(B) + "^2 = " + N(A * A) + " + " + N(B * B) + " = " + N(C * C)) + ", donc " + M("AB = " + N(C)) + " cm.",
          { ctx: "hyp", fig: RT(A, B, N(A) + " cm", N(B) + " cm", "?"), guide: [GS(M(N(A) + "^2") + " = ?", A * A, M(N(A * A)) + "."), GS(M(N(B) + "^2") + " = ?", B * B, M(N(B * B)) + "."), GS(M("AB^2") + " est la somme : " + M("AB^2") + " = ?", C * C, M(N(C * C)) + "."), GS("Racine carrée : " + M("AB") + " = ?", C, M("\\sqrt{" + N(C * C) + "} = " + N(C)) + ".")],
            traps: [TR(A + B, "On n'additionne pas les côtés : on additionne leurs carrés, puis on prend la racine."), TR(C * C, "C'est " + M("AB^2") + " : il manque la racine carrée.")] }); },
      () => { const [a, b, c] = trip(), k = pk([1, 1, 2]), [A, B, C] = [a * k, b * k, c * k];
        return Qv("Le triangle " + M("ABC") + " est rectangle en " + M("C") + ", avec " + M("AB = " + C) + " cm et " + M("BC = " + A) + " cm. Calcule " + M("AC") + " (en cm).", B, M("AC^2 = " + C + "^2 - " + A + "^2 = " + C * C + " - " + A * A + " = " + B * B) + ", donc " + M("AC = " + B) + " cm.",
          { ctx: "cath", fig: RT(A, B, A + " cm", "?", C + " cm"), guide: [GS("L'hypoténuse est " + M("AB") + " (en face de l'angle droit). " + M(C + "^2") + " = ?", C * C, M(C * C) + "."), GS(M(A + "^2") + " = ?", A * A, M(A * A) + "."), GS("Pour une cathète, on soustrait : " + M("AC^2") + " = ?", B * B, M(C * C + " - " + A * A + " = " + B * B) + "."), GS(M("AC") + " = ?", B, M("\\sqrt{" + B * B + "} = " + B) + ".")],
            traps: [TR(Math.sqrt(C * C + A * A), "Ici on cherche une cathète : on soustrait, " + M("AC^2 = AB^2 - BC^2") + "."), TR(B * B, "C'est " + M("AC^2") + " : prends la racine."), TR(C - A, "On ne soustrait pas les longueurs, mais leurs carrés.")] }); },
      () => { const [a, b, c] = pk([[3, 4, 5], [6, 8, 10], [1.2, 1.6, 2], [1.5, 2, 2.5], [1.8, 2.4, 3], [2.4, 3.2, 4], [0.9, 1.2, 1.5], [2.1, 2.8, 3.5]]), x = pk([
          ["Une échelle de " + cm(c, "m") + " est appuyée contre un mur vertical. Son pied est à " + cm(a, "m") + " du mur. À quelle hauteur l'échelle touche-t-elle le mur (en m) ?", "echelle"],
          ["Un cerf-volant est retenu par une ficelle tendue de " + cm(c * 10, "m") + ". Il se trouve exactement au-dessus d'un arbre situé à " + cm(a * 10, "m") + " de l'enfant. À quelle hauteur vole-t-il (en m, sans compter la taille de l'enfant) ?", "cerfvolant"],
          ["Un mât vertical est tenu par un câble de " + cm(c, "m") + " fixé au sol à " + cm(a, "m") + " du pied du mât. À quelle hauteur le câble est-il attaché (en m) ?", "mat"]]);
        const f = x[1] === "cerfvolant" ? 10 : 1, C = c * f, A = a * f, B = r12(b * f);
        return Qv(x[0], B, "Triangle rectangle d'hypoténuse " + T(C) + " : " + M("h^2 = " + N(C) + "^2 - " + N(A) + "^2 = " + N(r12(C * C - A * A))) + ", donc " + M("h = " + N(B)) + " m.",
          { ctx: x[1], guide: [GS("L'hypoténuse est " + (x[1] === "echelle" ? "l'échelle" : x[1] === "mat" ? "le câble" : "la ficelle") + " : " + M(N(C) + "^2") + " = ?", r12(C * C), M(N(r12(C * C))) + "."), GS(M("h^2 = " + N(r12(C * C)) + " - " + N(r12(A * A))) + " = ?", r12(C * C - A * A), M(N(r12(C * C - A * A))) + "."), GS(M("h") + " = ?", B, M(N(B)) + " m.")],
            traps: [TR(Math.sqrt(C * C + A * A), "La longueur la plus grande est l'hypoténuse : on cherche une cathète, on soustrait."), TR(C - A, "On soustrait les carrés, pas les longueurs.")] }); },
    ],
    2: [
      () => { const [a, b, n] = radHyp(), [k, m] = simp(n);
        return Qv("Le triangle " + M("DEF") + " est rectangle en " + M("F") + ", avec " + M("DF = " + a) + " cm et " + M("EF = " + b) + " cm. Calcule " + M("DE") + EXA + ".", k * Math.sqrt(m), M("DE^2 = " + a * a + " + " + b * b + " = " + n) + ", donc " + M("DE = \\sqrt{" + n + "}" + (k > 1 ? " = " + rT(k, m) : "")) + " cm.",
          { radical: true, canon: rC(k, m), ctx: "hyp-exact", fig: RT(b, a, b + " cm", a + " cm", "?", ["F", "E", "D"]), guide: [GS(M("DE^2 = " + a + "^2 + " + b + "^2") + " = ?", n, M(n) + "."), ...(k > 1 ? [GS("Le plus grand carré qui divise " + M(n) + " ?", k * k, M(n + " = " + k * k + " \\cdot " + m) + ".")] : []), GSR(M("DE = \\sqrt{" + n + "}") + (k > 1 ? " : simplifie" : "") + ".", k * Math.sqrt(m), M(rT(k, m)) + " cm.")],
            traps: [TR(a + b, "On additionne les carrés, pas les côtés."), TR(n, "C'est " + M("DE^2") + " : prends la racine.")] }); },
      () => { const [c, a, n] = radCat(), [k, m] = simp(n);
        return Qv("Le triangle " + M("RST") + " est rectangle en " + M("S") + ", avec " + M("RT = " + c) + " cm et " + M("RS = " + a) + " cm. Calcule " + M("ST") + EXA + ".", k * Math.sqrt(m), M("ST^2 = " + c * c + " - " + a * a + " = " + n) + ", donc " + M("ST = " + (k > 1 ? "\\sqrt{" + n + "} = " : "") + rT(k, m)) + " cm.",
          { radical: true, canon: rC(k, m), ctx: "cath-exact", guide: [GS("L'hypoténuse est " + M("RT") + ". " + M("ST^2 = " + c + "^2 - " + a + "^2") + " = ?", n, M(n) + "."), GSR(M("ST = \\sqrt{" + n + "}") + (k > 1 ? " : simplifie" : "") + ".", k * Math.sqrt(m), M(rT(k, m)) + " cm.")],
            traps: [TR(Math.sqrt(c * c + a * a), M("RT") + " est l'hypoténuse : on soustrait."), TR(n, "C'est " + M("ST^2") + ".")] }); },
      () => { const a = pk([30, 40, 45, 60, 80, 50]), b = pk([25, 35, 55, 70, 90, 65]), d = Math.sqrt(a * a + b * b), g = a + b - d, x = pk([["Pour traverser un parc rectangulaire de " + a + " m sur " + b + " m, Léo coupe en diagonale au lieu de longer deux côtés.", "parc"], ["Un terrain de football improvisé mesure " + a + " m sur " + b + " m. Zoé va d'un coin au coin opposé en diagonale plutôt que par les bords.", "terrain"]]);
        return Qv(x[0] + " Combien de mètres économise-t-il" + (x[1] === "terrain" ? " (elle)" : "") + " ? (arrondi au dixième)", g, "Diagonale : " + M("\\sqrt{" + a + "^2 + " + b + "^2} \\approx " + N(rd(d, 0.01))) + " m ; économie : " + M(a + b + " - " + N(rd(d, 0.01)) + " \\approx " + N(rd(g, 0.1))) + " m.",
          { round: 0.1, ctx: x[1], guide: [GS("Longueur du chemin par les bords ?", a + b, M(a + " + " + b + " = " + (a + b)) + " m."), GS("Longueur de la diagonale (au centième) ?", d, M("\\sqrt{" + (a * a + b * b) + "} \\approx " + N(rd(d, 0.01))) + " m.", 0.01), GS("Économie (au dixième) ?", g, M(N(rd(g, 0.1))) + " m.", 0.1)],
            traps: [TR(d, "C'est la longueur de la diagonale ; on demande la différence avec le chemin par les bords."), TR(a + b, "C'est le chemin par les bords.")] }); },
      () => { let x1, y1, x2, y2, n; do { x1 = R.int(-5, 5); y1 = R.int(-5, 5); x2 = R.int(-5, 6); y2 = R.int(-5, 6); n = (x2 - x1) ** 2 + (y2 - y1) ** 2; } while (x1 === x2 || y1 === y2 || Number.isInteger(Math.sqrt(n)) && R.rand() < 0.6);
        const [k, m] = simp(n), dx = Math.abs(x2 - x1), dy = Math.abs(y2 - y1);
        return Qv("Dans un repère orthonormé (unité : 1 cm), " + M("A(" + x1 + " \\,;\\, " + y1 + ")") + " et " + M("B(" + x2 + " \\,;\\, " + y2 + ")") + ". Calcule la distance " + M("AB") + EXA + ".", k * Math.sqrt(m), "Écart horizontal " + M(dx) + ", écart vertical " + M(dy) + " : " + M("AB^2 = " + dx + "^2 + " + dy + "^2 = " + n) + ", donc " + M("AB = " + rT(k, m)) + " cm.",
          { radical: true, canon: rC(k, m), ctx: "repere", guide: [GS("Écart horizontal entre " + M("A") + " et " + M("B") + " (différence des abscisses, positive) ?", dx, M("|" + x2 + " - " + (x1 < 0 ? "(" + x1 + ")" : x1) + "| = " + dx) + "."), GS("Écart vertical ?", dy, M(dy) + "."), GS(M("AB^2 = " + dx + "^2 + " + dy + "^2") + " = ?", n, M(n) + "."), GSR(M("AB") + " = ?", k * Math.sqrt(m), M(rT(k, m)) + ".")],
            traps: [TR(dx + dy, "On additionne les carrés des écarts, puis on prend la racine."), TR(Math.sqrt((x2 + x1) ** 2 + (y2 + y1) ** 2), "Les écarts sont des différences de coordonnées, pas des sommes.")] }); },
    ],
    3: [
      () => { const c = pk([4, 6, 8, 10, 12, 14]), k = c / 2;
        return Qv("Un triangle rectangle isocèle a une hypoténuse de " + M(c) + " cm. Calcule la longueur de ses cathètes" + EXA + ".", k * Math.SQRT2, "Cathètes égales : " + M("2x^2 = " + c * c) + ", " + M("x^2 = " + c * c / 2) + ", donc " + M("x = \\sqrt{" + c * c / 2 + "} = " + rT(...simp(c * c / 2))) + " cm.",
          { radical: true, canon: rC(...simp(c * c / 2)), ctx: "isorect", guide: [GS("Les deux cathètes valent " + M("x") + " : " + M("x^2 + x^2 = " + c + "^2") + ". Combien vaut " + M("x^2") + " ?", c * c / 2, M("2x^2 = " + c * c) + ", donc " + M("x^2 = " + c * c / 2) + "."), GSR(M("x") + " = ? (simplifie la racine)", k * Math.SQRT2, M(rT(...simp(c * c / 2))) + " cm.")],
            traps: [TR(c / 2, "Les cathètes ne valent pas la moitié de l'hypoténuse : " + M("x^2 + x^2 = " + c + "^2") + "."), TR(c * c / 2, "C'est " + M("x^2") + ".")] }); },
      () => { const r = pk([3, 4, 5, 6, 7, 2.5]), A = 2 * r * r;
        return Qv("Un carré " + M("ABCD") + " est inscrit dans un cercle de rayon " + cm(r) + ". Calcule l'aire du carré (en cm²).", A, "La diagonale du carré est un diamètre : " + M(N(2 * r)) + " cm. Côté " + M("c") + " : " + M("c^2 + c^2 = " + N(2 * r) + "^2") + ", donc l'aire " + M("c^2 = " + N(4 * r * r) + " : 2 = " + N(A)) + " cm².",
          { ctx: "carrecercle", guide: [GS("La diagonale du carré est un diamètre du cercle. Sa longueur ?", 2 * r, M(N(2 * r)) + " cm."), GS("Pythagore dans un demi-carré : " + M("c^2 + c^2 = " + N(2 * r) + "^2") + ". Combien vaut " + M("2c^2") + " ?", 4 * r * r, M(N(4 * r * r)) + "."), GS("L'aire du carré est " + M("c^2") + " : combien ?", A, M(N(A)) + " cm².")],
            traps: [TR(4 * r * r, "C'est " + M("2c^2") + " ; l'aire vaut " + M("c^2") + ", la moitié."), TR(r * r, "Le côté du carré n'est pas le rayon : c'est la diagonale qui vaut " + M("2r") + "."), TR(Math.PI * r * r, "On demande l'aire du carré, pas celle du disque.")] }); },
      () => { const h = pk([0.8, 1.2, 0.9, 1.5, 0.6]), d = pk([6, 8, 10, 12, 9]), L = Math.sqrt(h * h + d * d), x = pk([["Une rampe d'accès pour fauteuils roulants monte de " + cm(h, "m") + " sur une distance horizontale de " + cm(d, "m") + ".", "rampe"], ["Un toboggan droit descend de " + cm(h * 2, "m") + " sur une distance horizontale de " + cm(d / 2, "m") + ".", "toboggan"]]);
        const H = x[1] === "toboggan" ? h * 2 : h, D = x[1] === "toboggan" ? d / 2 : d, LL = Math.sqrt(H * H + D * D);
        return Qv(x[0] + " Quelle est la longueur de la pente (en m, arrondie au centième) ?", LL, M("\\sqrt{" + N(D) + "^2 + " + N(H) + "^2} = \\sqrt{" + N(r12(D * D + H * H)) + "} \\approx " + N(rd(LL, 0.01))) + " m.",
          { round: 0.01, ctx: x[1], guide: [GS("La pente est l'hypoténuse. " + M(N(D) + "^2 + " + N(H) + "^2") + " = ?", r12(D * D + H * H), M(N(r12(D * D + H * H))) + "."), GS("Racine carrée, arrondie au centième ?", LL, M(N(rd(LL, 0.01))) + " m.", 0.01)],
            traps: [TR(D + H, "On additionne les carrés, puis on prend la racine."), TR(Math.sqrt(Math.abs(D * D - H * H)), "La pente est l'hypoténuse : on additionne les carrés.")] }); },
      () => { const [a, b, c] = trip(30), k = pk([1, 2, 3]);
        return Qv("Un triangle rectangle a des cathètes de " + M(a * k) + " cm et " + M(b * k) + " cm. Calcule son périmètre (en cm).", (a + b + c) * k, "Hypoténuse : " + M("\\sqrt{" + a * k + "^2 + " + b * k + "^2} = " + c * k) + " ; périmètre : " + M(a * k + " + " + b * k + " + " + c * k + " = " + (a + b + c) * k) + " cm.",
          { ctx: "perimetre", fig: RT(b * k, a * k, b * k + " cm", a * k + " cm", "", false), guide: [GS("Il manque l'hypoténuse : " + M(a * k + "^2 + " + b * k + "^2") + " = ?", (c * k) ** 2, M((c * k) ** 2) + "."), GS("Hypoténuse ?", c * k, M(c * k) + " cm."), GS("Périmètre ?", (a + b + c) * k, M((a + b + c) * k) + " cm.")],
            traps: [TR((a + b) * k, "Le périmètre compte les trois côtés : calcule d'abord l'hypoténuse."), TR(a * b * k * k / 2, "C'est l'aire ; on demande le périmètre.")] }); },
    ],
  };

  // ===================== pythfig : Pythagore dans une figure, dans l'espace =====================
  const QUAD = [[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11], [6, 6, 7, 11], [3, 4, 12, 13], [2, 10, 11, 15], [2, 4, 4, 6], [4, 6, 12, 14], [3, 6, 6, 9], [4, 8, 8, 12]];
  const PFIG = {
    1: [
      () => { const [a, b, c] = trip(), k = pk([1, 2]), x = pk([["Un rectangle mesure " + M(b * k) + " cm sur " + M(a * k) + " cm. Calcule la longueur de sa diagonale (en cm).", "rect"], ["Un écran rectangulaire mesure " + M(b * k) + " cm de large et " + M(a * k) + " cm de haut. Calcule sa diagonale (en cm).", "ecran"], ["Un portail rectangulaire de " + M(b * k) + " dm sur " + M(a * k) + " dm est renforcé par une barre en diagonale. Quelle est la longueur de la barre (en dm) ?", "portail"]]);
        return Qv(x[0], c * k, "La diagonale coupe le rectangle en deux triangles rectangles : " + M("d^2 = " + b * k + "^2 + " + a * k + "^2 = " + (c * k) ** 2) + ", " + M("d = " + c * k) + ".",
          { ctx: x[1], fig: GF.rect(b, a, { lw: b * k + "", lh: a * k + "", diag: "?" }), guide: [GS("Le triangle rectangle : les deux côtés du rectangle et la diagonale. " + M(b * k + "^2 + " + a * k + "^2") + " = ?", (c * k) ** 2, M((c * k) ** 2) + "."), GS("Diagonale ?", c * k, M(c * k) + ".")],
            traps: [TR((a + b) * k, "On additionne les carrés des côtés, puis on prend la racine.")] }); },
      () => { const s = R.int(2, 12);
        return Qv("Calcule la diagonale d'un carré de côté " + M(s) + " cm" + EXA + ".", s * Math.SQRT2, M("d^2 = " + s + "^2 + " + s + "^2 = " + 2 * s * s) + ", donc " + M("d = \\sqrt{" + 2 * s * s + "} = " + rT(s, 2)) + " cm.",
          { radical: true, canon: rC(s, 2), ctx: "carre", fig: FIG.square(s + " cm"), guide: [GS(M(s + "^2 + " + s + "^2") + " = ?", 2 * s * s, M(2 * s * s) + "."), GSR("Diagonale : " + M("\\sqrt{" + 2 * s * s + "}") + " simplifiée ?", s * Math.SQRT2, M(rT(s, 2)) + " cm.")],
            traps: [TR(2 * s, "La diagonale n'est pas le double du côté : " + M("d^2 = c^2 + c^2") + "."), TR(2 * s * s, "C'est " + M("d^2") + ".")] }); },
      () => { const [a, h, c] = trip(29);
        return Qv("Un triangle isocèle a deux côtés de " + M(c) + " cm et une base de " + M(2 * a) + " cm. Calcule la hauteur relative à la base (en cm).", h, "La hauteur coupe la base en deux segments de " + M(a) + " cm : " + M("h^2 = " + c + "^2 - " + a + "^2 = " + h * h) + ", donc " + M("h = " + h) + " cm.",
          { ctx: "isocele", fig: GF.isoH(2 * a, c, { lb: 2 * a + " cm", ls: c + " cm", lh: "h" }), guide: [GS("La hauteur coupe la base en son milieu. Demi-base ?", a, M(2 * a + " : 2 = " + a) + " cm."), GS(M("h^2 = " + c + "^2 - " + a + "^2") + " = ?", h * h, M(h * h) + "."), GS(M("h") + " = ?", h, M(h) + " cm.")],
            traps: [TR(c > 2 * a ? Math.sqrt(c * c - 4 * a * a) : NaN, "La hauteur coupe la base en deux : on utilise la demi-base " + M(a) + "."), TR(Math.sqrt(c * c + a * a), "Le côté " + M(c) + " est l'hypoténuse : on soustrait.")] }); },
    ],
    2: [
      () => { const [a, b, c, d] = pk(QUAD);
        return Qv("Un pavé droit mesure " + M(a) + " cm × " + M(b) + " cm × " + M(c) + " cm. Calcule la longueur de sa grande diagonale (d'un sommet au sommet opposé, en cm).", d, "Diagonale de la base : " + M(a + "^2 + " + b + "^2 = " + (a * a + b * b)) + " ; puis " + M("d^2 = " + (a * a + b * b) + " + " + c + "^2 = " + d * d) + ", donc " + M("d = " + d) + " cm.",
          { ctx: "pave", fig: FIG.box(a + " cm", b + " cm", c + " cm"), guide: [GS("Diagonale de la base, au carré : " + M(a + "^2 + " + b + "^2") + " = ?", a * a + b * b, M(a * a + b * b) + "."), GS("Avec la hauteur : " + M("d^2 = " + (a * a + b * b) + " + " + c + "^2") + " = ?", d * d, M(d * d) + "."), GS(M("d") + " = ?", d, M(d) + " cm.")],
            traps: [TR(Math.sqrt(a * a + b * b), "C'est la diagonale de la base ; la grande diagonale monte aussi de " + M(c) + " cm."), TR(a + b + c, "On additionne les carrés : " + M("d^2 = a^2 + b^2 + c^2") + ".")] }); },
      () => { const a = R.int(2, 9);
        return Qv("Calcule la longueur de la grande diagonale d'un cube d'arête " + M(a) + " cm" + EXA + ".", a * Math.sqrt(3), M("d^2 = " + a + "^2 + " + a + "^2 + " + a + "^2 = " + 3 * a * a) + ", donc " + M("d = " + rT(a, 3)) + " cm.",
          { radical: true, canon: rC(a, 3), ctx: "cube", fig: FIG.cube(a + " cm"), guide: [GS("Diagonale d'une face, au carré : " + M(a + "^2 + " + a + "^2") + " = ?", 2 * a * a, M(2 * a * a) + "."), GS("Grande diagonale au carré : " + M(2 * a * a + " + " + a + "^2") + " = ?", 3 * a * a, M(3 * a * a) + "."), GSR(M("d") + " = ? (simplifiée)", a * Math.sqrt(3), M(rT(a, 3)) + " cm.")],
            traps: [TR(a * Math.SQRT2, "C'est la diagonale d'une face ; la grande diagonale traverse le cube."), TR(3 * a, "On additionne les carrés : " + M("d^2 = 3a^2") + ".")] }); },
      () => { const c = 2 * R.int(1, 7);
        return Qv("Calcule la hauteur d'un triangle équilatéral de côté " + M(c) + " cm" + EXA + ".", (c / 2) * Math.sqrt(3), "La hauteur coupe le côté en deux : " + M("h^2 = " + c + "^2 - " + c / 2 + "^2 = " + 3 * c * c / 4) + ", donc " + M("h = " + rT(c / 2, 3)) + " cm.",
          { radical: true, canon: rC(c / 2, 3), ctx: "equi", fig: GF.isoH(c, c, { lb: c + " cm", ls: c + " cm", lh: "h" }), guide: [GS("Demi-côté ?", c / 2, M(c / 2) + " cm."), GS(M("h^2 = " + c + "^2 - " + c / 2 + "^2") + " = ?", 3 * c * c / 4, M(3 * c * c / 4) + "."), GSR(M("h") + " = ? (simplifiée)", (c / 2) * Math.sqrt(3), M(rT(c / 2, 3)) + " cm.")],
            traps: [TR(Math.sqrt(c * c + c * c / 4), "Le côté est l'hypoténuse : on soustrait."), TR(c, "La hauteur est plus courte que le côté.")] }); },
      () => { let a, b, n; do { a = R.int(2, 9); b = R.int(2, 9); n = a * a + b * b; } while (a === b || Number.isInteger(Math.sqrt(n)));
        const [k, m] = simp(n);
        return Qv("Calcule la diagonale d'un rectangle de " + M(a) + " cm sur " + M(b) + " cm" + EXA + ".", k * Math.sqrt(m), M("d^2 = " + a + "^2 + " + b + "^2 = " + n) + ", donc " + M("d = " + (k > 1 ? "\\sqrt{" + n + "} = " : "") + rT(k, m)) + " cm.",
          { radical: true, canon: rC(k, m), ctx: "rect-exact", fig: GF.rect(a, b, { lw: a + " cm", lh: b + " cm", diag: "d" }), guide: [GS(M(a + "^2 + " + b + "^2") + " = ?", n, M(n) + "."), GSR(M("d") + " = ? (simplifiée)", k * Math.sqrt(m), M(rT(k, m)) + " cm.")],
            traps: [TR(a + b, "On additionne les carrés, puis on prend la racine."), TR(n, "C'est " + M("d^2") + ".")] }); },
    ],
    3: [
      () => { const [c, s, h] = pk([[8, 6, 2], [8, 9, 7], [12, 11, 7], [12, 9, 3], [16, 12, 4], [16, 18, 14], [12, 19, 17]]);
        return Qv("Une pyramide régulière à base carrée a un côté de base de " + M(c) + " cm et des arêtes latérales de " + M(s) + " cm. Calcule sa hauteur (en cm).", h,
          "Demi-diagonale de la base : " + M("\\frac{d}{2}") + " avec " + M("\\left(\\frac{d}{2}\\right)^2 = \\frac{" + c + "^2 + " + c + "^2}{4} = " + c * c / 2) + ". Puis " + M("h^2 = " + s + "^2 - " + c * c / 2 + " = " + h * h) + ", donc " + M("h = " + h) + " cm.",
          { ctx: "pyrhaut", fig: FIG.pyramid(c + " cm", "h"), guide: [GS("Diagonale de la base, au carré : " + M(c + "^2 + " + c + "^2") + " = ?", 2 * c * c, M(2 * c * c) + "."), GS("Le sommet est au-dessus du centre : la demi-diagonale au carré vaut le quart. Combien ?", c * c / 2, M(2 * c * c + " : 4 = " + c * c / 2) + "."), GS("Triangle rectangle (hauteur, demi-diagonale, arête) : " + M("h^2 = " + s + "^2 - " + c * c / 2) + " = ?", h * h, M(h * h) + "."), GS(M("h") + " = ?", h, M(h) + " cm.")],
            traps: [TR(Math.sqrt(s * s - c * c / 4), "Sous l'arête latérale, il y a la demi-diagonale de la base, pas le demi-côté."), TR(Math.sqrt(s * s - 2 * c * c), "Il faut la demi-diagonale, pas la diagonale entière.")] }); },
      () => { const [r, h, g] = pk([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [7, 24, 25]]), ask = R.int(0, 1);
        return ask ? Qv("Un cône a un rayon de " + M(r) + " cm et une hauteur de " + M(h) + " cm. Calcule sa génératrice (longueur de la pointe au bord de la base, en cm).", g, M("g^2 = " + r + "^2 + " + h + "^2 = " + g * g) + ", donc " + M("g = " + g) + " cm.",
            { ctx: "conegen", fig: FIG.cone("r = " + r, "h = " + h), guide: [GS("Triangle rectangle (rayon, hauteur, génératrice) : " + M(r + "^2 + " + h + "^2") + " = ?", g * g, M(g * g) + "."), GS(M("g") + " = ?", g, M(g) + " cm.")], traps: [TR(r + h, "On additionne les carrés.")] })
          : Qv("Un cône a une génératrice de " + M(g) + " cm et un rayon de " + M(r) + " cm. Calcule sa hauteur (en cm).", h, M("h^2 = " + g + "^2 - " + r + "^2 = " + h * h) + ", donc " + M("h = " + h) + " cm.",
            { ctx: "conehaut", fig: FIG.cone("r = " + r, "h"), guide: [GS("La génératrice est l'hypoténuse. " + M(g + "^2 - " + r + "^2") + " = ?", h * h, M(h * h) + "."), GS(M("h") + " = ?", h, M(h) + " cm.")], traps: [TR(Math.sqrt(g * g + r * r), "La génératrice est l'hypoténuse : on soustrait."), TR(g - r, "On soustrait les carrés.")] }); },
      () => { let a, b, c, n; do { a = R.int(1, 6); b = R.int(2, 7); c = R.int(2, 8); n = a * a + b * b + c * c; } while (Number.isInteger(Math.sqrt(n)) || simp(n)[0] === 1 && R.rand() < 0.4);
        const [k, m] = simp(n);
        return Qv("Un pavé droit " + M("ABCDEFGH") + " a pour dimensions " + M(a) + " cm, " + M(b) + " cm et " + M(c) + " cm. Calcule la longueur de la diagonale " + M("[AG]") + EXA + ".", k * Math.sqrt(m), M("AG^2 = " + a + "^2 + " + b + "^2 + " + c + "^2 = " + n) + ", donc " + M("AG = " + rT(k, m)) + " cm.",
          { radical: true, canon: rC(k, m), ctx: "pave-exact", fig: FIG.box(a + " cm", b + " cm", c + " cm"), guide: [GS("Diagonale de la base au carré : " + M(a + "^2 + " + b + "^2") + " = ?", a * a + b * b, M(a * a + b * b) + "."), GS(M("AG^2") + " = ?", n, M(n) + "."), GSR(M("AG") + " = ? (simplifiée)", k * Math.sqrt(m), M(rT(k, m)) + " cm.")],
            traps: [TR(a + b + c, "On additionne les carrés des trois dimensions."), TR(Math.sqrt(a * a + b * b), "C'est la diagonale de la base seulement.")] }); },
      () => { const c = 35.4, h = 21.6, a = Math.sqrt(h * h + (c / 2) ** 2);
        return Qv("La pyramide du Louvre, à Paris, est une pyramide régulière à base carrée de côté " + cm(c, "m") + " et de hauteur " + cm(h, "m") + ". Calcule son apothème (hauteur d'une face triangulaire, en m, arrondie au centième).", a,
          M("a^2 = " + N(h) + "^2 + " + N(c / 2) + "^2 = " + N(r12(h * h + c * c / 4))) + ", donc " + M("a \\approx " + N(rd(a, 0.01))) + " m.",
          { round: 0.01, ctx: "louvre", fig: FIG.pyramid(N(c).replace("{,}", ",") + " m", "h"), guide: [GS("L'apothème, la hauteur et le demi-côté forment un triangle rectangle. Demi-côté ?", c / 2, M(N(c / 2)) + " m."), GS(M(N(h) + "^2 + " + N(c / 2) + "^2") + " = ?", r12(h * h + c * c / 4), M(N(r12(h * h + c * c / 4))) + "."), GS("Apothème (au centième) ?", a, M(N(rd(a, 0.01))) + " m.", 0.01)],
            traps: [TR(Math.sqrt(h * h + c * c), "Sous l'apothème, il y a le demi-côté, pas le côté entier."), TR(Math.sqrt(h * h + c * c / 2), "Sous l'apothème, il y a le demi-côté (pas la demi-diagonale, qui sert pour l'arête).")] }); },
    ],
  };

  // ===================== pythrec : réciproque de Pythagore =====================
  const shuf = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(R.rand() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const PREC = {
    1: [
      () => { const [a, b, c] = trip(), s = shuf([a, b, c]);
        return Qv("Un triangle a pour côtés " + M(s[0]) + " cm, " + M(s[1]) + " cm et " + M(s[2]) + " cm. Pour savoir s'il est rectangle, calcule la somme des carrés des deux plus petits côtés.", a * a + b * b, "Plus petits côtés " + M(a) + " et " + M(b) + " : " + M(a * a + " + " + b * b + " = " + (a * a + b * b)) + ". C'est égal à " + M(c + "^2") + " : le triangle est rectangle (réciproque de Pythagore).",
          { ctx: "somme", guide: [GS(M(a + "^2") + " = ?", a * a, M(a * a) + "."), GS(M(b + "^2") + " = ?", b * b, M(b * b) + "."), GS("Somme ?", a * a + b * b, M(a * a + b * b) + ", égale à " + M(c + "^2") + ".")],
            traps: [TR(a * a + c * c, "Le plus grand côté est " + M(c) + " : on additionne les carrés des deux autres."), TR(a + b, "On additionne les carrés.")] }); },
      () => { const ts = [0, 1, 2, 3].map(() => { const t = trip(); return R.rand() < 0.5 ? t : [t[0], t[1], t[2] + pk([-1, 1])]; }), ok = ts.filter((t) => t[0] ** 2 + t[1] ** 2 === t[2] ** 2).length;
        return Qv("Combien de ces triangles sont rectangles ? Côtés (en cm) : " + ts.map((t) => M("(" + t.join(" \\,;\\, ") + ")")).join(", "), ok, ts.map((t) => M(t[0] ** 2 + " + " + t[1] ** 2 + (t[0] ** 2 + t[1] ** 2 === t[2] ** 2 ? " = " : " \\neq ") + t[2] ** 2)).join(" ; ") + " : " + ok + " rectangle" + (ok > 1 ? "s" : "") + ".",
          { ctx: "compter", guide: [...ts.slice(0, 2).map((t, i) => GS("Triangle " + (i + 1) + " : " + M(t[0] + "^2 + " + t[1] + "^2") + " = ? (à comparer avec " + M(t[2] + "^2 = " + t[2] ** 2) + ")", t[0] ** 2 + t[1] ** 2, M(t[0] ** 2 + t[1] ** 2) + (t[0] ** 2 + t[1] ** 2 === t[2] ** 2 ? " : rectangle." : " : pas rectangle."))), GS("Fais de même pour les deux autres. Nombre de triangles rectangles ?", ok, ok + ".")],
            traps: [TR(4, "Un triangle n'est rectangle que si l'égalité est exacte."), TR(ok + 1, "Vérifie chaque égalité exactement : un écart d'une unité suffit à rendre le triangle non rectangle.")] }); },
      () => { const [a, b, c] = trip(25), x = c + pk([1, 2, -1]);
        return Qv("Un triangle a pour côtés " + M(a) + " cm, " + M(b) + " cm et " + M(x) + " cm. Calcule " + M(x + "^2 - (" + a + "^2 + " + b + "^2)") + ". (Si le résultat n'est pas 0, le triangle n'est pas rectangle.)", x * x - a * a - b * b, M(x * x + " - " + (a * a + b * b) + " = " + (x * x - a * a - b * b)) + " : ce n'est pas 0, le triangle n'est pas rectangle.",
          { ctx: "ecart", guide: [GS(M(x + "^2") + " = ?", x * x, M(x * x) + "."), GS(M(a + "^2 + " + b + "^2") + " = ?", a * a + b * b, M(a * a + b * b) + "."), GS("Différence ?", x * x - a * a - b * b, M(x * x - a * a - b * b) + ".")],
            traps: [TR(x - a - b, "On compare les carrés, pas les longueurs."), TR(a * a + b * b - x * x, "Dans l'ordre : " + M(x + "^2") + " moins la somme.")] }); },
    ],
    2: [
      () => { const [a, b, c] = pk([[1.5, 2, 2.5], [0.9, 1.2, 1.5], [2.4, 3.2, 4], [1.2, 1.6, 2], [3.6, 4.8, 6], [0.6, 0.8, 1], [2.7, 3.6, 4.5]]);
        return Qv("Un triangle a pour côtés " + cm(a, "m") + ", " + cm(b, "m") + " et " + cm(c, "m") + ". Calcule la somme des carrés des deux plus petits côtés.", r12(a * a + b * b), M(N(r12(a * a)) + " + " + N(r12(b * b)) + " = " + N(r12(a * a + b * b))) + ", égal à " + M(N(c) + "^2") + " : le triangle est rectangle.",
          { ctx: "decimaux", guide: [GS(M(N(a) + "^2") + " = ?", r12(a * a), M(N(r12(a * a))) + "."), GS(M(N(b) + "^2") + " = ?", r12(b * b), M(N(r12(b * b))) + "."), GS("Somme ?", r12(a * a + b * b), M(N(r12(a * a + b * b))) + ".")],
            traps: [TR(a + b, "On additionne les carrés."), TR(r12(a * 2 + b * 2), "Le carré d'un nombre n'est pas son double : " + M(N(a) + "^2 = " + N(a) + " \\cdot " + N(a)) + ".")] }); },
      () => { const [p, q, r] = trip(15), x0 = R.int(-4, 2), y0 = R.int(-4, 2);
        const A = [x0, y0], B = [x0 + p, y0], C = [x0 + p, y0 + q], ab2 = p * p, bc2 = q * q, ac2 = p * p + q * q;
        return Qv("Dans un repère, " + M("A(" + A[0] + " \\,;\\, " + A[1] + ")") + ", " + M("B(" + B[0] + " \\,;\\, " + B[1] + ")") + " et " + M("C(" + C[0] + " \\,;\\, " + C[1] + ")") + ". Calcule " + M("AC^2") + ".", ac2, "Écarts " + M(p) + " et " + M(q) + " : " + M("AC^2 = " + p + "^2 + " + q + "^2 = " + ac2) + ". Et " + M("AB^2 + BC^2 = " + ab2 + " + " + bc2 + " = " + ac2) + " : le triangle est rectangle en " + M("B") + ".",
          { ctx: "repere", guide: [GS("Écart horizontal entre " + M("A") + " et " + M("C") + " ?", p, M(p) + "."), GS("Écart vertical ?", q, M(q) + "."), GS(M("AC^2") + " = ?", ac2, M(ac2) + ".")],
            traps: [TR(p + q, "On additionne les carrés des écarts."), TR(Math.sqrt(ac2), "On demande " + M("AC^2") + ", pas " + M("AC") + ".")] }); },
      () => { const [a, b, c] = trip(30), k = pk([1, 2, 3]);
        return Qv("On veut qu'un triangle de côtés " + M(a * k) + " cm, " + M(b * k) + " cm et " + M("x") + " cm soit rectangle, " + M("x") + " étant le plus grand côté. Quelle doit être la valeur de " + M("x") + " (en cm) ?", c * k, M("x^2 = " + a * k + "^2 + " + b * k + "^2 = " + (c * k) ** 2) + ", donc " + M("x = " + c * k) + " cm.",
          { ctx: "trouverx", guide: [GS(M("x^2 = " + a * k + "^2 + " + b * k + "^2") + " = ?", (c * k) ** 2, M((c * k) ** 2) + "."), GS(M("x") + " = ?", c * k, M(c * k) + " cm.")],
            traps: [TR((a + b) * k, "On additionne les carrés, puis on prend la racine.")] }); },
    ],
    3: [
      () => { const [a, b, c] = pk([[30, 40, 50], [60, 80, 100], [45, 60, 75], [90, 120, 150]]);
        return Qv("Pour vérifier qu'un angle est droit, un menuisier marque " + M(a) + " cm sur un côté et " + M(b) + " cm sur l'autre, à partir du coin. Quelle distance doit-il mesurer entre les deux marques pour que l'angle soit droit (en cm) ?", c, M("\\sqrt{" + a + "^2 + " + b + "^2} = \\sqrt{" + c * c + "} = " + c) + " cm : si la mesure vaut " + M(c) + " cm, l'angle est droit (réciproque).",
          { ctx: "menuisier", guide: [GS(M(a + "^2 + " + b + "^2") + " = ?", c * c, M(c * c) + "."), GS("Distance ?", c, M(c) + " cm.")], traps: [TR(a + b, "On additionne les carrés.")] }); },
      () => { const [n1, n2, n3] = pk([[5, 20, 25], [2, 7, 9], [3, 13, 16], [8, 17, 25], [6, 10, 16], [5, 11, 16]]);
        return Qv("Un triangle a pour côtés " + M("\\sqrt{" + n1 + "}") + " cm, " + M("\\sqrt{" + n2 + "}") + " cm et " + M(Math.sqrt(n3) % 1 ? "\\sqrt{" + n3 + "}" : Math.sqrt(n3)) + " cm. Calcule la somme des carrés des deux plus petits côtés.", n1 + n2, M("(\\sqrt{" + n1 + "})^2 + (\\sqrt{" + n2 + "})^2 = " + n1 + " + " + n2 + " = " + (n1 + n2)) + ", égal au carré du plus grand côté : rectangle.",
          { ctx: "racines", guide: [GS(M("(\\sqrt{" + n1 + "})^2") + " = ?", n1, "Le carré d'une racine redonne le nombre : " + M(n1) + "."), GS("Somme des deux carrés ?", n1 + n2, M(n1 + n2) + ".")],
            traps: [TR(Math.sqrt(n1) + Math.sqrt(n2), "On additionne les carrés : " + M("(\\sqrt{" + n1 + "})^2 = " + n1) + "."), TR(2 * n1 + 2 * n2, "Le carré de " + M("\\sqrt{" + n1 + "}") + " est " + M(n1) + ", pas " + M(2 * n1) + ".")] }); },
      () => { const L = pk([120, 150, 200, 90]), l = pk([50, 80, 60, 40]), d = Math.sqrt(L * L + l * l), dm = rd(d, 1) + pk([2, 3, -2, -3]);
        return Qv("Un cadre rectangulaire doit mesurer " + M(L) + " cm sur " + M(l) + " cm. Le menuisier mesure une diagonale de " + M(dm) + " cm. Quelle devrait être la diagonale d'un cadre bien d'équerre (en cm, au dixième) ?", d, M("\\sqrt{" + L + "^2 + " + l + "^2} \\approx " + N(rd(d, 0.1))) + " cm : avec " + M(dm) + " cm, les angles ne sont pas droits.",
          { round: 0.1, ctx: "cadre", guide: [GS(M(L + "^2 + " + l + "^2") + " = ?", L * L + l * l, M(L * L + l * l) + "."), GS("Diagonale au dixième ?", d, M(N(rd(d, 0.1))) + " cm.", 0.1)], traps: [TR(dm, "C'est la mesure du menuisier ; on demande la diagonale théorique."), TR(L + l, "On additionne les carrés.")] }); },
    ],
  };

  // ===================== vol : pavé, prisme, cylindre (volumes, aires totales, contenances) =====================
  const VOL = {
    1: [
      () => { const a = R.int(3, 12), b = R.int(2, 9), c = R.int(2, 8);
        return Qv("Calcule le volume d'un pavé droit de " + M(a) + " cm × " + M(b) + " cm × " + M(c) + " cm (en cm³).", a * b * c, M(a + " \\cdot " + b + " \\cdot " + c + " = " + a * b * c) + " cm³.",
          { ctx: "pave", fig: FIG.box(a + " cm", b + " cm", c + " cm"), guide: [GS("Aire de la base : " + M(a + " \\cdot " + b) + " = ?", a * b, M(a * b) + " cm²."), GS("Volume = aire de la base × hauteur : ?", a * b * c, M(a * b * c) + " cm³.")],
            traps: [TR(a + b + c, "Le volume se calcule en multipliant les trois dimensions."), TR(2 * (a * b + b * c + a * c), "C'est l'aire totale ; le volume est " + M("a \\cdot b \\cdot c") + ".")] }); },
      () => { const b = R.int(3, 12), h = 2 * R.int(1, 5), L = R.int(4, 15), Ab = b * h / 2;
        return Qv("Un prisme droit a pour base un triangle de base " + M(b) + " cm et de hauteur " + M(h) + " cm. La longueur du prisme est " + M(L) + " cm. Calcule son volume (en cm³).", Ab * L, "Aire de la base : " + M("\\frac{" + b + " \\cdot " + h + "}{2} = " + Ab) + " cm² ; volume : " + M(Ab + " \\cdot " + L + " = " + Ab * L) + " cm³.",
          { ctx: "prisme", fig: FIG.prism(b + " cm", h + " cm", L + " cm"), guide: [GS("Aire du triangle de base : " + M("\\frac{" + b + " \\cdot " + h + "}{2}") + " = ?", Ab, M(Ab) + " cm²."), GS("Volume = aire de la base × longueur : ?", Ab * L, M(Ab * L) + " cm³.")],
            traps: [TR(b * h * L, "La base est un triangle : son aire est " + M("\\frac{b \\cdot h}{2}") + "."), TR(Ab * L / 3, "Un prisme n'est pas une pyramide : pas de division par 3.")] }); },
      () => { const r = R.int(2, 8), h = R.int(2, 12);
        return Qv("Calcule le volume d'un cylindre de rayon " + M(r) + " cm et de hauteur " + M(h) + " cm" + PIX + ".", r * r * h * Math.PI, M("\\pi \\cdot " + r + "^2 \\cdot " + h + " = " + piT(r * r * h)) + " cm³ " + M("\\approx " + N(rd(r * r * h * Math.PI, 0.01))) + " cm³.",
          { canon: r * r * h + "π", ctx: "cylindre", fig: FIG.cylinder("r = " + r, "h = " + h), guide: [GS("Aire de la base " + M("\\pi r^2") + " : le nombre devant " + M("\\pi") + " (" + M(r + "^2") + ") ?", r * r, M(piT(r * r)) + " cm²."), GS("Volume en " + M("\\pi") + " : tape-le (par exemple " + M("12\\pi") + ").", r * r * h * Math.PI, M(piT(r * r * h)) + " cm³.")],
            traps: [TR(2 * r * h * Math.PI, M("2\\pi r h") + " est l'aire latérale ; le volume est " + M("\\pi r^2 h") + "."), TR(4 * r * r * h * Math.PI, "Tu as pris le diamètre comme rayon.")] }); },
    ],
    2: [
      () => { let B, b, hh; do { B = R.int(6, 14); b = R.int(3, B - 2); hh = R.int(2, 8); } while ((B + b) * hh % 2); const L = R.int(5, 20), Ab = (B + b) * hh / 2;
        return Qv("Un prisme droit a pour base un trapèze de bases " + M(B) + " cm et " + M(b) + " cm, et de hauteur " + M(hh) + " cm. La profondeur du prisme est " + M(L) + " cm. Calcule son volume (en cm³).", Ab * L, "Base : " + M("\\frac{(" + B + " + " + b + ") \\cdot " + hh + "}{2} = " + Ab) + " cm² ; volume : " + M(Ab + " \\cdot " + L + " = " + Ab * L) + " cm³.",
          { ctx: "trapeze", guide: [GS("Aire du trapèze : " + M("\\frac{(" + B + " + " + b + ") \\cdot " + hh + "}{2}") + " = ?", Ab, M(Ab) + " cm²."), GS("Volume ?", Ab * L, M(Ab * L) + " cm³.")],
            traps: [TR(B * b * hh * L, "L'aire du trapèze est " + M("\\frac{(B + b) \\cdot h}{2}") + "."), TR((B + b) * hh * L, "N'oublie pas de diviser par 2 dans l'aire du trapèze.")] }); },
      () => { const a = pk([40, 50, 60, 80, 100]), b = pk([25, 30, 40, 50]), c = pk([30, 35, 40, 45]), V = a * b * c, x = pk([["Un aquarium a la forme d'un pavé de " + a + " cm × " + b + " cm × " + c + " cm. Combien de litres d'eau contient-il quand il est plein ?", "aquarium"], ["Un bac à fleurs mesure " + a + " cm × " + b + " cm × " + c + " cm. Combien de litres de terre faut-il pour le remplir ?", "bac"]]);
        return Qv(x[0], V / 1000, M(a + " \\cdot " + b + " \\cdot " + c + " = " + N(V)) + " cm³ ; " + M("1\\ \\text{L} = 1\\ \\text{dm}^3 = 1000\\ \\text{cm}^3") + ", donc " + M(N(V / 1000)) + " L.",
          { ctx: x[1], fig: FIG.box(a + " cm", b + " cm", c + " cm"), guide: [GS("Volume en cm³ ?", V, M(N(V)) + " cm³."), GS("En litres (1 L = 1000 cm³) ?", V / 1000, M(N(V / 1000)) + " L.")],
            traps: [TR(V / 100, "1 L = 1 dm³ = 1000 cm³ : on divise par 1000."), TR(V, "C'est le volume en cm³ ; convertis en litres.")] }); },
      () => { const [r, h] = pk([[3.3, 11.5], [3, 12], [4, 15], [2.5, 10], [5, 18]]), V = Math.PI * r * r * h, x = pk([["Une canette cylindrique", "canette"], ["Un verre cylindrique", "verre"], ["Une boîte de conserve", "conserve"]]);
        return Qv(x[0] + " a un rayon intérieur de " + cm(r) + " et une hauteur de " + cm(h) + ". Quelle est sa contenance, en cL (arrondie à l'unité) ?", V / 10, M("\\pi \\cdot " + N(r) + "^2 \\cdot " + N(h) + " \\approx " + N(rd(V, 0.1))) + " cm³ ; " + M("1\\ \\text{cL} = 10\\ \\text{cm}^3") + ", donc environ " + M(N(rd(V / 10, 1))) + " cL.",
          { round: 1, ctx: x[1], fig: FIG.cylinder("r = " + N(r).replace("{,}", ","), "h = " + N(h).replace("{,}", ",")), guide: [GS("Volume en cm³ (à l'unité) ?", V, M(N(rd(V, 1))) + " cm³.", 1), GS("En cL (1 cL = 10 cm³), à l'unité ?", V / 10, M(N(rd(V / 10, 1))) + " cL.", 1)],
            traps: [TR(V, "C'est le volume en cm³ : 1 cL = 10 cm³."), TR(V / 1000, "Ça, ce sont des litres ; on demande des centilitres.")] }); },
    ],
    3: [
      () => { const r = R.int(2, 7), h = R.int(3, 12), k = 2 * r * r + 2 * r * h;
        return Qv("Calcule l'aire totale d'un cylindre de rayon " + M(r) + " cm et de hauteur " + M(h) + " cm" + PIX + ".", k * Math.PI, "Deux disques : " + M("2\\pi \\cdot " + r + "^2 = " + piT(2 * r * r)) + " ; surface latérale (un rectangle) : " + M("2\\pi \\cdot " + r + " \\cdot " + h + " = " + piT(2 * r * h)) + " ; total " + M(piT(k)) + " cm².",
          { canon: k + "π", ctx: "airecyl", fig: FIG.cylinder("r = " + r, "h = " + h), guide: [GS("Les deux disques : " + M("2 \\cdot \\pi \\cdot " + r + "^2") + " ; nombre devant " + M("\\pi") + " ?", 2 * r * r, M(piT(2 * r * r)) + "."), GS("Surface latérale déroulée : un rectangle de " + M("2\\pi r") + " sur " + M("h") + ". Nombre devant " + M("\\pi") + " ?", 2 * r * h, M(piT(2 * r * h)) + "."), GS("Aire totale (avec " + M("\\pi") + ") ?", k * Math.PI, M(piT(k)) + " cm².")],
            traps: [TR(2 * r * h * Math.PI, "C'est la surface latérale seule : ajoute les deux disques."), TR((r * r + 2 * r * h) * Math.PI, "Il y a deux disques (le haut et le bas)."), TR(r * r * h * Math.PI, "C'est le volume.")] }); },
      () => { const [a, b, c] = trip(17), L = R.int(4, 15), Ab = a * b / 2, At = 2 * Ab + (a + b + c) * L;
        return Qv("Un prisme droit a pour base un triangle rectangle de cathètes " + M(a) + " cm et " + M(b) + " cm. Sa longueur est " + M(L) + " cm. Calcule son aire totale (en cm²).", At, "Hypoténuse : " + M(c) + " cm (Pythagore). Deux bases : " + M("2 \\cdot " + Ab + " = " + 2 * Ab) + " ; trois rectangles : " + M("(" + a + " + " + b + " + " + c + ") \\cdot " + L + " = " + (a + b + c) * L) + " ; total " + M(At) + " cm².",
          { ctx: "aireprisme", fig: FIG.prism(a + " cm", b + " cm", L + " cm", { right: true }), guide: [GS("Hypoténuse du triangle (Pythagore) ?", c, M(c) + " cm."), GS("Aire des deux triangles ?", 2 * Ab, M(2 * Ab) + " cm²."), GS("Aire des trois rectangles (périmètre × longueur) ?", (a + b + c) * L, M((a + b + c) * L) + " cm²."), GS("Aire totale ?", At, M(At) + " cm².")],
            traps: [TR(Ab * L, "C'est le volume ; on demande l'aire totale."), TR(Ab + (a + b + c) * L, "Il y a deux bases triangulaires."), TR(2 * Ab + (a + b) * L, "N'oublie pas la face rectangulaire sur l'hypoténuse.")] }); },
      () => { const R0 = R.int(3, 8), r = R.int(1, R0 - 1), h = R.int(5, 20), k = (R0 * R0 - r * r) * h;
        return Qv("Un tuyau a la forme d'un cylindre creux : rayon extérieur " + M(R0) + " cm, rayon intérieur " + M(r) + " cm, longueur " + M(h) + " cm. Calcule le volume de matière" + PIX + ".", k * Math.PI, M("\\pi \\cdot " + R0 + "^2 \\cdot " + h + " - \\pi \\cdot " + r + "^2 \\cdot " + h + " = " + piT(R0 * R0 * h) + " - " + piT(r * r * h) + " = " + piT(k)) + " cm³.",
          { canon: k + "π", ctx: "tuyau", guide: [GS("Volume du grand cylindre (nombre devant " + M("\\pi") + ") ?", R0 * R0 * h, M(piT(R0 * R0 * h)) + "."), GS("Volume du trou ?", r * r * h, M(piT(r * r * h)) + "."), GS("Volume de matière (avec " + M("\\pi") + ") ?", k * Math.PI, M(piT(k)) + " cm³.")],
            traps: [TR((R0 - r) ** 2 * h * Math.PI, "On ne soustrait pas les rayons : on soustrait les volumes (" + M("R^2 - r^2") + ")."), TR(R0 * R0 * h * Math.PI, "Il faut retirer le volume du trou.")] }); },
    ],
  };

  // ===================== volcone : pyramide, cône, boule =====================
  const VCONE = {
    1: [
      () => { const c = R.int(2, 12), h = 3 * R.int(1, 5), V = c * c * h / 3;
        return Qv("Calcule le volume d'une pyramide à base carrée de côté " + M(c) + " cm et de hauteur " + M(h) + " cm (en cm³).", V, M("\\frac{1}{3} \\cdot " + c + "^2 \\cdot " + h + " = \\frac{" + c * c * h + "}{3} = " + V) + " cm³.",
          { ctx: "pyr", fig: FIG.pyramid(c + " cm", "h = " + h), guide: [GS("Aire de la base ?", c * c, M(c * c) + " cm²."), GS("Aire de la base × hauteur ?", c * c * h, M(c * c * h) + "."), GS("Divisé par 3 : volume ?", V, M(V) + " cm³.")],
            traps: [TR(c * c * h, "Pour une pyramide, on divise par 3."), TR(c * h / 3, "La base est un carré : son aire est " + M(c + "^2") + ".")] }); },
      () => { const r = R.int(2, 9), h = 3 * R.int(1, 5), k = r * r * h / 3;
        return Qv("Calcule le volume d'un cône de rayon " + M(r) + " cm et de hauteur " + M(h) + " cm" + PIX + ".", k * Math.PI, M("\\frac{1}{3} \\cdot \\pi \\cdot " + r + "^2 \\cdot " + h + " = " + piT(k)) + " cm³.",
          { canon: k + "π", ctx: "cone", fig: FIG.cone("r = " + r, "h = " + h), guide: [GS("Nombre devant " + M("\\pi") + " pour l'aire de la base ?", r * r, M(piT(r * r)) + "."), GS("Volume (avec " + M("\\pi") + ") : " + M("\\frac{1}{3} \\cdot " + piT(r * r) + " \\cdot " + h) + " ?", k * Math.PI, M(piT(k)) + " cm³.")],
            traps: [TR(r * r * h * Math.PI, "Un cône : on divise par 3 (comme une pyramide)."), TR(4 * k * Math.PI, "Tu as pris le diamètre comme rayon.")] }); },
      () => { const r = 3 * R.int(1, 3), k = 4 * r ** 3 / 3;
        return Qv("Calcule le volume d'une boule de rayon " + M(r) + " cm" + PIX + ".", k * Math.PI, M("\\frac{4}{3} \\cdot \\pi \\cdot " + r + "^3 = \\frac{4 \\cdot " + r ** 3 + "}{3}\\pi = " + piT(k)) + " cm³.",
          { canon: k + "π", ctx: "boule", fig: FIG.sphere("r = " + r), guide: [GS(M(r + "^3") + " = ?", r ** 3, M(r ** 3) + "."), GS(M("\\frac{4}{3} \\cdot " + r ** 3) + " = ?", k, M(k) + "."), GS("Volume (avec " + M("\\pi") + ") ?", k * Math.PI, M(piT(k)) + " cm³.")],
            traps: [TR(4 * r * r * Math.PI, M("4\\pi r^2") + " est l'aire de la sphère ; le volume est " + M("\\frac{4}{3}\\pi r^3") + "."), TR(4 * r ** 3 * Math.PI, "N'oublie pas de diviser par 3.")] }); },
    ],
    2: [
      () => { const a = R.int(3, 12), b = R.int(2, 10), h = 3 * R.int(1, 5); if (a === b) return null; const V = a * b * h / 3;
        return Qv("Une pyramide a pour base un rectangle de " + M(a) + " cm sur " + M(b) + " cm, et une hauteur de " + M(h) + " cm. Calcule son volume (en cm³).", V, M("\\frac{1}{3} \\cdot " + a + " \\cdot " + b + " \\cdot " + h + " = " + V) + " cm³.",
          { ctx: "pyrrect", guide: [GS("Aire de la base ?", a * b, M(a * b) + " cm²."), GS("Volume ?", V, M(V) + " cm³.")], traps: [TR(a * b * h, "On divise par 3 pour une pyramide.")] }); },
      () => { const d = 2 * R.int(2, 7), h = 3 * R.int(1, 4), r = d / 2, k = r * r * h / 3;
        return Qv("Un cornet de glace a la forme d'un cône de diamètre " + M(d) + " cm et de hauteur " + M(h) + " cm. Calcule son volume" + PIX + ".", k * Math.PI, "Rayon : " + M(r) + " cm. " + M("\\frac{1}{3}\\pi \\cdot " + r + "^2 \\cdot " + h + " = " + piT(k)) + " cm³.",
          { canon: k + "π", ctx: "cornet", fig: FIG.cone("d = " + d, "h = " + h), guide: [GS("Le rayon ?", r, M(d + " : 2 = " + r) + " cm."), GS("Volume (avec " + M("\\pi") + ") ?", k * Math.PI, M(piT(k)) + " cm³.")],
            traps: [TR(d * d * h / 3 * Math.PI, "On a donné le diamètre : le rayon en est la moitié.")] }); },
      () => { const a = 3 * R.int(1, 4), V = a ** 3 / 3;
        return Qv("Une pyramide est inscrite dans un cube d'arête " + M(a) + " cm : sa base est une face du cube et son sommet est le centre de la face opposée. Calcule le volume de la pyramide (en cm³).", V, "Base " + M(a * a) + " cm², hauteur " + M(a) + " cm : " + M("\\frac{1}{3} \\cdot " + a * a + " \\cdot " + a + " = " + V) + " cm³, soit le tiers du cube.",
          { ctx: "pyrcube", fig: FIG.cube(a + " cm", true), guide: [GS("La hauteur de la pyramide ?", a, "L'arête du cube : " + M(a) + " cm."), GS("Volume ?", V, M(V) + " cm³.")],
            traps: [TR(a ** 3, "C'est le volume du cube ; la pyramide en vaut le tiers."), TR(a ** 3 / 6, "La hauteur est l'arête entière : le sommet est sur la face opposée.")] }); },
      () => { const r = 3 * R.int(1, 3), k = 2 * r ** 3 / 3;
        return Qv("Un bol a la forme d'une demi-boule de rayon intérieur " + M(r) + " cm. Calcule son volume" + PIX + ".", k * Math.PI, "Demi-boule : " + M("\\frac{1}{2} \\cdot \\frac{4}{3}\\pi \\cdot " + r + "^3 = " + piT(k)) + " cm³.",
          { canon: k + "π", ctx: "demiboule", guide: [GS("Volume de la boule entière (nombre devant " + M("\\pi") + ") ?", 4 * r ** 3 / 3, M(piT(4 * r ** 3 / 3)) + "."), GS("La moitié (avec " + M("\\pi") + ") ?", k * Math.PI, M(piT(k)) + " cm³.")],
            traps: [TR(2 * k * Math.PI, "C'est la boule entière ; le bol en est la moitié.")] }); },
    ],
    3: [
      () => { const [r, h, g] = pk([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17]]), k = r * r * h / 3;
        if (!Number.isInteger(k)) return null;
        return Qv("Un cône a un rayon de " + M(r) + " cm et une génératrice de " + M(g) + " cm. Calcule son volume" + PIX + ".", k * Math.PI, "Hauteur : " + M("\\sqrt{" + g + "^2 - " + r + "^2} = " + h) + " cm. Volume : " + M("\\frac{1}{3}\\pi \\cdot " + r + "^2 \\cdot " + h + " = " + piT(k)) + " cm³.",
          { canon: k + "π", ctx: "conegen", fig: FIG.cone("r = " + r, "h"), guide: [GS("Il faut la hauteur (Pythagore) : " + M(g + "^2 - " + r + "^2") + " = ?", h * h, M(h * h) + "."), GS("Hauteur ?", h, M(h) + " cm."), GS("Volume (avec " + M("\\pi") + ") ?", k * Math.PI, M(piT(k)) + " cm³.")],
            traps: [TR(r * r * g / 3 * Math.PI, "La génératrice n'est pas la hauteur : calcule " + M("h") + " avec Pythagore.")] }); },
      () => { const r = R.int(2, 9), k = 4 * r * r;
        return Qv("Calcule l'aire d'une sphère de rayon " + M(r) + " cm" + PIX + ".", k * Math.PI, M("4\\pi \\cdot " + r + "^2 = " + piT(k)) + " cm².",
          { canon: k + "π", ctx: "sphere", fig: FIG.sphere("r = " + r), guide: [GS(M(r + "^2") + " = ?", r * r, M(r * r) + "."), GS("Aire (avec " + M("\\pi") + ") : " + M("4\\pi r^2") + " ?", k * Math.PI, M(piT(k)) + " cm².")],
            traps: [TR(4 * r ** 3 / 3 * Math.PI, "C'est le volume de la boule ; l'aire est " + M("4\\pi r^2") + "."), TR(r * r * Math.PI, "C'est l'aire d'un disque ; la sphère vaut 4 disques.")] }); },
      () => { const x = pk([["le rayon d'une boule", 2, 3, "boule"], ["le rayon d'une boule", 3, 3, "boule3"], ["le rayon de la base d'un cône (même hauteur)", 2, 2, "conr"], ["la hauteur d'un cône (même base)", 3, 1, "coneh"], ["l'arête d'un cube", 2, 3, "cube"], ["le rayon d'un cylindre (même hauteur)", 3, 2, "cyl"], ["toutes les dimensions d'une pyramide", 2, 3, "pyr"]]), f = x[1] ** x[2];
        return Qv("On multiplie " + x[0] + " par " + M(x[1]) + ". Par combien son volume est-il multiplié ?", f, "Le volume dépend de cette longueur " + (x[2] === 1 ? "au premier degré" : x[2] === 2 ? "au carré" : "au cube") + " : " + M(x[1] + (x[2] > 1 ? "^" + x[2] : "") + " = " + f) + ".",
          { ctx: x[3], guide: [GS("Dans la formule, cette longueur apparaît avec quel exposant ? (" + (x[3].startsWith("boule") || x[3] === "cube" || x[3] === "pyr" ? M("r^3") + ", " + M("a^3") + "…" : M("r^2") + " ou " + M("h") + ")") + ")", x[2], "Exposant " + M(x[2]) + "."), GS("Facteur : " + M(x[1] + (x[2] > 1 ? "^" + x[2] : "")) + " = ?", f, M(f) + ".")],
            traps: [TR(x[1], "Le volume ne suit pas la longueur : la longueur est " + (x[2] === 2 ? "au carré" : "au cube") + " dans la formule."), TR(x[1] * x[2], "C'est une puissance : " + M(x[1] + "^" + x[2]) + ", pas " + M(x[1] + " \\cdot " + x[2]) + ".")] }); },
    ],
  };

  // ===================== airepyr : aire d'une pyramide, apothème =====================
  const APYR = {
    1: [
      () => { const c = R.int(4, 12), a = R.int(5, 15); if (a === c) return null;
        return Qv("Une pyramide régulière à base carrée a un côté de base de " + M(c) + " cm et un apothème de " + M(a) + " cm. Calcule son aire latérale (en cm²).", 2 * c * a, "Quatre triangles : " + M("4 \\cdot \\frac{" + c + " \\cdot " + a + "}{2} = " + 2 * c * a) + " cm².",
          { ctx: "lat", guide: [GS("Aire d'une face triangulaire : " + M("\\frac{" + c + " \\cdot " + a + "}{2}") + " = ?", c * a / 2, M(c * a / 2) + " cm²."), GS("Quatre faces ?", 2 * c * a, M(2 * c * a) + " cm².")],
            traps: [TR(c * a / 2, "C'est une seule face ; il y en a quatre."), TR(4 * c * a, "L'aire d'un triangle se divise par 2.")] }); },
      () => { const c = R.int(4, 12), a = R.int(5, 15); if (a === c) return null;
        return Qv("Une pyramide régulière à base carrée a un côté de base de " + M(c) + " cm et un apothème de " + M(a) + " cm. Calcule son aire totale (en cm²).", c * c + 2 * c * a, "Base : " + M(c * c) + " cm² ; faces : " + M(2 * c * a) + " cm² ; total " + M(c * c + 2 * c * a) + " cm².",
          { ctx: "tot", guide: [GS("Aire de la base ?", c * c, M(c * c) + " cm²."), GS("Aire latérale (4 triangles) ?", 2 * c * a, M(2 * c * a) + " cm²."), GS("Aire totale ?", c * c + 2 * c * a, M(c * c + 2 * c * a) + " cm².")],
            traps: [TR(2 * c * a, "C'est l'aire latérale : ajoute la base."), TR(c * c + c * a / 2, "Il y a quatre faces triangulaires.")] }); },
      () => { const c = R.int(4, 16), a = R.int(5, 15), x = pk([["une tente en forme de pyramide", "tente"], ["le toit d'une tour, en forme de pyramide", "toit"]]); if (a === c) return null;
        return Qv("On veut recouvrir de toile les quatre faces " + (x[0].startsWith("le ") ? "du " + x[0].slice(3) : "d'" + x[0]) + " (base carrée de " + M(c) + " dm, apothème " + M(a) + " dm). Quelle surface de toile faut-il (en dm²) ?", 2 * c * a, M("4 \\cdot \\frac{" + c + " \\cdot " + a + "}{2} = " + 2 * c * a) + " dm² (sans le sol).",
          { ctx: x[1], guide: [GS("Une face ?", c * a / 2, M(c * a / 2) + " dm²."), GS("Quatre faces ?", 2 * c * a, M(2 * c * a) + " dm².")], traps: [TR(c * c + 2 * c * a, "Le sol n'est pas recouvert de toile.")] }); },
    ],
    2: [
      () => { const [c2, h, a] = pk([[3, 4, 5], [5, 12, 13], [8, 6, 10], [6, 8, 10], [9, 12, 15], [12, 5, 13], [4, 3, 5], [8, 15, 17]]), c = 2 * c2;
        return Qv("Une pyramide régulière à base carrée a un côté de base de " + M(c) + " cm et une hauteur de " + M(h) + " cm. Calcule son apothème (en cm).", a, "Triangle rectangle (hauteur, demi-côté, apothème) : " + M("a^2 = " + h + "^2 + " + c2 + "^2 = " + a * a) + ", " + M("a = " + a) + " cm.",
          { ctx: "apo", fig: FIG.pyramid(c + " cm", "h = " + h), guide: [GS("Demi-côté de la base ?", c2, M(c2) + " cm."), GS(M(h + "^2 + " + c2 + "^2") + " = ?", a * a, M(a * a) + "."), GS("Apothème ?", a, M(a) + " cm.")],
            traps: [TR(Math.sqrt(h * h + c * c), "Sous l'apothème, il y a le demi-côté."), TR(h + c2, "On additionne les carrés.")] }); },
      () => { const [c2, h, a] = pk([[3, 4, 5], [5, 12, 13], [8, 6, 10], [6, 8, 10], [9, 12, 15], [4, 3, 5]]), c = 2 * c2;
        return Qv("Une pyramide régulière à base carrée a un côté de base de " + M(c) + " cm et une hauteur de " + M(h) + " cm. Calcule son aire latérale (en cm²).", 2 * c * a, "Apothème : " + M("\\sqrt{" + h + "^2 + " + c2 + "^2} = " + a) + " cm ; aire latérale : " + M("4 \\cdot \\frac{" + c + " \\cdot " + a + "}{2} = " + 2 * c * a) + " cm².",
          { ctx: "lath", guide: [GS("Apothème (Pythagore avec le demi-côté) ?", a, M(a) + " cm."), GS("Aire latérale ?", 2 * c * a, M(2 * c * a) + " cm².")],
            traps: [TR(2 * c * h, "Les faces ont pour hauteur l'apothème, pas la hauteur de la pyramide.")] }); },
      () => { const [c2, a, s] = pk([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15], [4, 3, 5]]), c = 2 * c2;
        return Qv("Une pyramide régulière à base carrée a des arêtes latérales de " + M(s) + " cm et un côté de base de " + M(c) + " cm. Calcule son aire totale (en cm²).", c * c + 2 * c * a, "Apothème (dans une face) : " + M("\\sqrt{" + s + "^2 - " + c2 + "^2} = " + a) + " cm ; total : " + M(c * c + " + " + 2 * c * a + " = " + (c * c + 2 * c * a)) + " cm².",
          { ctx: "arete", guide: [GS("Dans une face, l'apothème coupe la base en deux : " + M(s + "^2 - " + c2 + "^2") + " = ?", a * a, M(a * a) + "."), GS("Apothème ?", a, M(a) + " cm."), GS("Aire totale ?", c * c + 2 * c * a, M(c * c + 2 * c * a) + " cm².")],
            traps: [TR(c * c + 2 * c * s, "L'arête n'est pas l'apothème : calcule l'apothème avec Pythagore."), TR(2 * c * a, "N'oublie pas la base.")] }); },
    ],
    3: [
      () => { const c = 35.4, h = 21.6, a = Math.sqrt(h * h + (c / 2) ** 2), A = 2 * c * a;
        return Qv("La pyramide du Louvre a une base carrée de côté " + cm(c, "m") + " et une hauteur de " + cm(h, "m") + ". Ses quatre faces sont en verre. Calcule la surface de verre (en m², arrondie à l'unité).", A, "Apothème : " + M("\\sqrt{" + N(h) + "^2 + " + N(c / 2) + "^2} \\approx " + N(rd(a, 0.01))) + " m ; surface : " + M("2 \\cdot " + N(c) + " \\cdot " + N(rd(a, 0.01)) + " \\approx " + N(rd(A, 1))) + " m².",
          { round: 1, ctx: "louvre", guide: [GS("Apothème (au centième) ?", a, M(N(rd(a, 0.01))) + " m.", 0.01), GS("Surface des quatre faces (à l'unité) ?", A, M(N(rd(A, 1))) + " m².", 1)],
            traps: [TR(c * c + A, "Le sol n'est pas en verre."), TR(2 * c * h, "La hauteur des faces est l'apothème.")] }); },
      // Aire du cône retirée (22.11) : hors programme 11e. Toit de tour : hauteur donnée, apothème à calculer, puis coût.
      () => { const [c2, h, a] = pk([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 6, 10], [9, 12, 15], [8, 15, 17]]), c = 2 * c2, p = pk([35, 40, 45, 60]), A = 2 * c * a;
        return Qv("Le toit d'une tour est une pyramide régulière à base carrée de " + M(c) + " m de côté et de " + M(h) + " m de haut. On couvre ses quatre pans d'ardoises à " + M(p) + " CHF le m². Combien coûtent les ardoises (en CHF) ?", A * p, "Apothème : " + M("\\sqrt{" + h + "^2 + " + c2 + "^2} = " + a) + " m ; pans : " + M("4 \\cdot \\frac{" + c + " \\cdot " + a + "}{2} = " + A) + " m² ; prix : " + M(A + " \\cdot " + p + " = " + N(A * p)) + " CHF.",
          { ctx: "ardoises", guide: [GS("Apothème (Pythagore avec le demi-côté) ?", a, M(a) + " m."), GS("Aire des quatre pans (m²) ?", A, M(A) + " m²."), GS("Prix (CHF) ?", A * p, M(N(A * p)) + " CHF.")],
            traps: [TR(2 * c * h * p, "Les pans ont pour hauteur l'apothème, pas la hauteur du toit."), TR((c * c + A) * p, "Le plancher n'est pas couvert d'ardoises.")] }); },
      () => { const c = 2 * R.int(2, 8), a = R.int(c / 2 + 1, c + 8), A = c * c + 2 * c * a, cost = pk([12, 15, 18, 25]);
        return Qv("Un artisan fabrique une boîte en forme de pyramide régulière (base carrée de " + M(c) + " cm, apothème " + M(a) + " cm), entièrement fermée. Le carton coûte " + M(cost) + " CHF le m². Quel est le prix du carton pour une boîte (en CHF, au centime) ?", A / 10000 * cost, "Aire : " + M(c * c + " + " + 2 * c * a + " = " + A) + " cm² " + M("= " + N(A / 10000)) + " m² ; prix : " + M(N(A / 10000) + " \\cdot " + cost + " \\approx " + N(rd(A / 10000 * cost, 0.01))) + " CHF.",
          { round: 0.01, ctx: "boite", guide: [GS("Aire totale en cm² ?", A, M(A) + " cm²."), GS("En m² (1 m² = 10'000 cm²) ?", A / 10000, M(N(A / 10000)) + " m²."), GS("Prix (au centime) ?", A / 10000 * cost, M(N(rd(A / 10000 * cost, 0.01))) + " CHF.", 0.01)],
            traps: [TR(A / 100 * cost, "1 m² = 10'000 cm² (et non 100)."), TR(A * cost, "Convertis d'abord les cm² en m².")] }); },
    ],
  };

  // ===================== volcomp : solides composés =====================
  const VCOMP = {
    1: [
      () => { const a = R.int(3, 9), h = 3 * R.int(1, 4), V = a ** 3 + a * a * h / 3;
        return Qv("Un solide est formé d'un cube d'arête " + M(a) + " cm, surmonté d'une pyramide de même base et de hauteur " + M(h) + " cm. Calcule son volume (en cm³).", V, "Cube : " + M(a ** 3) + " ; pyramide : " + M("\\frac{1}{3} \\cdot " + a * a + " \\cdot " + h + " = " + a * a * h / 3) + " ; total " + M(V) + " cm³.",
          { ctx: "cubepyr", fig: GF.profile("pyr", a, a, h, { a: a + " cm", h1: a + " cm", h2: h + " cm" }), guide: [GS("Volume du cube ?", a ** 3, M(a ** 3) + " cm³."), GS("Volume de la pyramide ?", a * a * h / 3, M(a * a * h / 3) + " cm³."), GS("Total ?", V, M(V) + " cm³.")],
            traps: [TR(a ** 3 + a * a * h, "La pyramide vaut le tiers du prisme de même base."), TR(a ** 3 * h, "On additionne les deux volumes.")] }); },
      () => { const r = R.int(2, 6), h = R.int(3, 9), k3 = 3 * R.int(1, 3), K = r * r * h + r * r * k3 / 3;
        return Qv("Un solide est formé d'un cylindre de rayon " + M(r) + " cm et de hauteur " + M(h) + " cm, surmonté d'un cône de même base et de hauteur " + M(k3) + " cm. Calcule son volume" + PIX + ".", K * Math.PI, "Cylindre : " + M(piT(r * r * h)) + " ; cône : " + M(piT(r * r * k3 / 3)) + " ; total " + M(piT(K)) + " cm³.",
          { canon: K + "π", ctx: "cylcone", fig: GF.profile("cone", 2 * r, h, k3, { r: "r = " + r, h1: h + " cm", h2: k3 + " cm" }), guide: [GS("Cylindre : nombre devant " + M("\\pi") + " ?", r * r * h, M(piT(r * r * h)) + "."), GS("Cône : nombre devant " + M("\\pi") + " ?", r * r * k3 / 3, M(piT(r * r * k3 / 3)) + "."), GS("Total (avec " + M("\\pi") + ") ?", K * Math.PI, M(piT(K)) + " cm³.")],
            traps: [TR((r * r * h + r * r * k3) * Math.PI, "Le cône vaut le tiers d'un cylindre.")] }); },
      () => { const L = R.int(6, 15), l = R.int(4, 10), h = R.int(3, 8), t = 2 * R.int(1, 3), V = L * l * h + l * t / 2 * L;
        return Qv("Une maison est formée d'un pavé de " + M(L) + " m × " + M(l) + " m × " + M(h) + " m, surmonté d'un toit en prisme dont la base est un triangle de base " + M(l) + " m et de hauteur " + M(t) + " m (sur toute la longueur " + M(L) + " m). Calcule le volume total (en m³).", V, "Pavé : " + M(L * l * h) + " ; toit : " + M("\\frac{" + l + " \\cdot " + t + "}{2} \\cdot " + L + " = " + l * t / 2 * L) + " ; total " + M(V) + " m³.",
          { ctx: "maison", fig: GF.house(l, h, t, { a: l + " m", b: h + " m", h: t + " m" }), guide: [GS("Volume du pavé ?", L * l * h, M(L * l * h) + " m³."), GS("Aire du triangle du toit ?", l * t / 2, M(l * t / 2) + " m²."), GS("Volume du toit ?", l * t / 2 * L, M(l * t / 2 * L) + " m³."), GS("Total ?", V, M(V) + " m³.")],
            traps: [TR(L * l * h + l * t * L, "Le toit a une base triangulaire : son aire se divise par 2."), TR(L * l * h + l * t / 2 * L / 3, "Le toit est un prisme, pas une pyramide.")] }); },
    ],
    2: [
      () => { const r = 3 * R.int(1, 3), h = R.int(4, 12), K = r * r * h + 2 * r ** 3 / 3;
        return Qv("Un silo est formé d'un cylindre de rayon " + M(r) + " m et de hauteur " + M(h) + " m, surmonté d'une demi-boule de même rayon. Calcule son volume" + PIX + ".", K * Math.PI, "Cylindre : " + M(piT(r * r * h)) + " ; demi-boule : " + M("\\frac{2}{3}\\pi \\cdot " + r + "^3 = " + piT(2 * r ** 3 / 3)) + " ; total " + M(piT(K)) + " m³.",
          { canon: K + "π", ctx: "silo", fig: GF.profile("dome", 2 * r, h, 0, { r: "r = " + r, h1: h + " m" }), guide: [GS("Cylindre : nombre devant " + M("\\pi") + " ?", r * r * h, M(piT(r * r * h)) + "."), GS("Demi-boule : nombre devant " + M("\\pi") + " ?", 2 * r ** 3 / 3, M(piT(2 * r ** 3 / 3)) + "."), GS("Total (avec " + M("\\pi") + ") ?", K * Math.PI, M(piT(K)) + " m³.")],
            traps: [TR((r * r * h + 4 * r ** 3 / 3) * Math.PI, "C'est une demi-boule : la moitié de " + M("\\frac{4}{3}\\pi r^3") + ".")] }); },
      () => { const r = 3, L = pk([8, 10, 12, 14]), K = 4 * r ** 3 / 3 + r * r * (L - 2 * r);
        return Qv("Une gélule a la forme d'un cylindre terminé par deux demi-boules. Son diamètre est " + M(2 * r) + " mm et sa longueur totale " + M(L) + " mm. Calcule son volume" + PIX + ".", K * Math.PI, "Les deux demi-boules forment une boule : " + M(piT(4 * r ** 3 / 3)) + ". Partie cylindrique : longueur " + M(L - 2 * r) + " mm, " + M(piT(r * r * (L - 2 * r))) + ". Total " + M(piT(K)) + " mm³.",
          { canon: K + "π", ctx: "gelule", guide: [GS("Longueur de la partie cylindrique (on retire deux rayons) ?", L - 2 * r, M(L + " - 2 \\cdot " + r + " = " + (L - 2 * r)) + " mm."), GS("Les deux demi-boules : nombre devant " + M("\\pi") + " ?", 4 * r ** 3 / 3, M(piT(4 * r ** 3 / 3)) + "."), GS("Cylindre : nombre devant " + M("\\pi") + " ?", r * r * (L - 2 * r), M(piT(r * r * (L - 2 * r))) + "."), GS("Total (avec " + M("\\pi") + ") ?", K * Math.PI, M(piT(K)) + " mm³.")],
            traps: [TR((4 * r ** 3 / 3 + r * r * L) * Math.PI, "La partie cylindrique est plus courte : on retire les deux demi-boules (2 rayons)."), TR((r * r * L) * Math.PI, "Ajoute les deux demi-boules.")] }); },
      () => { const a = pk([6, 8, 10, 12]), r = pk([1, 2, 3].filter((x) => 2 * x < a)), V = a ** 3 - Math.PI * r * r * a;
        return Qv("On perce un trou cylindrique de rayon " + M(r) + " cm de part en part dans un cube d'arête " + M(a) + " cm (perpendiculairement à une face). Calcule le volume restant (en cm³, arrondi à l'unité).", V, M(a + "^3 - \\pi \\cdot " + r + "^2 \\cdot " + a + " \\approx " + a ** 3 + " - " + N(rd(Math.PI * r * r * a, 0.01)) + " \\approx " + N(rd(V, 1))) + " cm³.",
          { round: 1, ctx: "cubetrou", guide: [GS("Volume du cube ?", a ** 3, M(a ** 3) + " cm³."), GS("Volume du trou (au centième) ?", Math.PI * r * r * a, M("\\pi \\cdot " + r * r + " \\cdot " + a + " \\approx " + N(rd(Math.PI * r * r * a, 0.01))) + " cm³.", 0.01), GS("Volume restant (à l'unité) ?", V, M(N(rd(V, 1))) + " cm³.", 1)],
            traps: [TR(a ** 3 - Math.PI * 4 * r * r * a, "Le rayon est " + M(r) + " : l'aire du disque est " + M("\\pi \\cdot " + r * r) + "."), TR(a ** 3, "Il faut retirer le volume du trou.")] }); },
    ],
    3: [
      () => { const r = 3 * R.int(1, 2), h = 3 * R.int(2, 4), K = r * r * h / 3 + 2 * r ** 3 / 3;
        return Qv("Une glace : un cône de rayon " + M(r) + " cm et de hauteur " + M(h) + " cm, rempli et surmonté d'une demi-boule de glace de même rayon. Calcule le volume total de glace" + PIX + ".", K * Math.PI, "Cône : " + M(piT(r * r * h / 3)) + " ; demi-boule : " + M(piT(2 * r ** 3 / 3)) + " ; total " + M(piT(K)) + " cm³.",
          { canon: K + "π", ctx: "glace", guide: [GS("Cône : nombre devant " + M("\\pi") + " ?", r * r * h / 3, M(piT(r * r * h / 3)) + "."), GS("Demi-boule : nombre devant " + M("\\pi") + " ?", 2 * r ** 3 / 3, M(piT(2 * r ** 3 / 3)) + "."), GS("Total (avec " + M("\\pi") + ") ?", K * Math.PI, M(piT(K)) + " cm³.")],
            traps: [TR((r * r * h + 2 * r ** 3 / 3) * Math.PI, "Le cône vaut le tiers du cylindre."), TR((r * r * h / 3 + 4 * r ** 3 / 3) * Math.PI, "C'est une demi-boule.")] }); },
      () => { const a = 3 * R.int(1, 4), V = 2 * a ** 3 / 3;
        return Qv("On découpe dans un cube d'arête " + M(a) + " cm la plus grande pyramide possible (base = une face, sommet = centre de la face opposée). Quel volume de matière enlève-t-on (en cm³) ?", V, "Cube " + M(a ** 3) + ", pyramide " + M(a ** 3 / 3) + " : on enlève " + M(a ** 3 + " - " + a ** 3 / 3 + " = " + V) + " cm³, les deux tiers.",
          { ctx: "decoupe", fig: FIG.cube(a + " cm", true), guide: [GS("Volume du cube ?", a ** 3, M(a ** 3) + " cm³."), GS("Volume de la pyramide ?", a ** 3 / 3, M(a ** 3 / 3) + " cm³."), GS("Volume enlevé ?", V, M(V) + " cm³.")],
            traps: [TR(a ** 3 / 3, "C'est le volume de la pyramide qui reste ; on demande ce qu'on enlève.")] }); },
      () => { const [hb, s, b2] = pk([[4, 5, 3], [12, 13, 5], [8, 10, 6], [6, 10, 8]]), L = R.int(3, 8), b = 2 * b2, V = b * hb / 2 * L;
        return Qv("Une tente a la forme d'un prisme droit couché. Sa face avant est un triangle isocèle de base " + M(b) + " dm et de côtés " + M(s) + " dm ; la tente est longue de " + M(L) + " dm. Calcule son volume (en dm³).", V, "Hauteur du triangle : " + M("\\sqrt{" + s + "^2 - " + b2 + "^2} = " + hb) + " dm ; aire " + M("\\frac{" + b + " \\cdot " + hb + "}{2} = " + b * hb / 2) + " dm² ; volume " + M(V) + " dm³.",
          { ctx: "tente", fig: GF.isoH(b, s, { lb: b + " dm", ls: s + " dm", lh: "h" }), guide: [GS("Hauteur du triangle (Pythagore avec la demi-base) ?", hb, M(hb) + " dm."), GS("Aire du triangle ?", b * hb / 2, M(b * hb / 2) + " dm²."), GS("Volume ?", V, M(V) + " dm³.")],
            traps: [TR(b * s / 2 * L, "Le côté oblique n'est pas la hauteur du triangle : calcule-la avec Pythagore."), TR(b * hb * L, "L'aire du triangle se divise par 2.")] }); },
    ],
  };

  // ===================== volmanq : retrouver une dimension =====================
  const VMAN = {
    1: [
      () => { const a = R.int(3, 12), b = R.int(2, 8), h = R.int(2, 12); if (h === a || h === b || a === b) return null;
        return Qv("Un pavé droit a un volume de " + M(a * b * h) + " cm³ et une base de " + M(a) + " cm sur " + M(b) + " cm. Quelle est sa hauteur (en cm) ?", h, M(a * b + " \\cdot h = " + a * b * h) + ", donc " + M("h = " + a * b * h + " : " + a * b + " = " + h) + " cm.",
          { ctx: "pave", guide: [GS("Aire de la base ?", a * b, M(a * b) + " cm²."), GS(M("h") + " = volume divisé par l'aire de la base : ?", h, M(h) + " cm.")], traps: [TR(a * b * h / a, "Divise par l'aire de la base entière, " + M(a + " \\cdot " + b) + ".")] }); },
      () => { const r = R.int(2, 7), h = R.int(2, 12); if (h === r) return null;
        return Qv("Un cylindre de rayon " + M(r) + " cm a un volume de " + M(piT(r * r * h)) + " cm³. Quelle est sa hauteur (en cm) ?", h, M("\\pi \\cdot " + r + "^2 \\cdot h = " + piT(r * r * h)) + ", donc " + M("h = " + r * r * h + " : " + r * r + " = " + h) + " cm.",
          { ctx: "cyl", guide: [GS("Aire de la base : nombre devant " + M("\\pi") + " ?", r * r, M(piT(r * r)) + "."), GS(M("h") + " = ?", h, M(r * r * h + " : " + r * r + " = " + h) + " cm.")], traps: [TR(r * h, "L'aire de la base est " + M("\\pi r^2") + " : divise par " + M(r * r) + ".")] }); },
      () => { const b = R.int(3, 10), hh = 2 * R.int(1, 5), L = R.int(4, 15), Ab = b * hh / 2; if (L === b) return null;
        return Qv("Un prisme droit a pour base un triangle de base " + M(b) + " cm et de hauteur " + M(hh) + " cm. Son volume est " + M(Ab * L) + " cm³. Quelle est sa longueur (en cm) ?", L, "Aire de la base : " + M(Ab) + " cm² ; " + M("L = " + Ab * L + " : " + Ab + " = " + L) + " cm.",
          { ctx: "prisme", guide: [GS("Aire du triangle de base ?", Ab, M(Ab) + " cm²."), GS("Longueur ?", L, M(L) + " cm.")], traps: [TR(Ab * L / (b * hh), "L'aire du triangle se divise par 2 : " + M(Ab) + " cm².")] }); },
    ],
    2: [
      () => { const r = R.int(2, 6), h = 3 * R.int(1, 4); if (r === h) return null;
        return Qv("Un cône de hauteur " + M(h) + " cm a un volume de " + M(piT(r * r * h / 3)) + " cm³. Quel est le rayon de sa base (en cm) ?", r, M("\\frac{1}{3}\\pi r^2 \\cdot " + h + " = " + piT(r * r * h / 3)) + ", donc " + M("r^2 = " + r * r) + " et " + M("r = " + r) + " cm.",
          { ctx: "cone", guide: [GS(M("\\frac{1}{3} \\cdot r^2 \\cdot " + h + " = " + r * r * h / 3) + " : combien vaut " + M("r^2") + " ?", r * r, M(r * r * h / 3 + " \\cdot 3 : " + h + " = " + r * r) + "."), GS(M("r") + " = ?", r, M(r) + " cm.")], traps: [TR(r * r, "C'est " + M("r^2") + " : prends la racine."), TR(Math.sqrt(r * r / 3), "N'oublie pas de multiplier par 3 (le cône vaut le tiers du cylindre).")] }); },
      () => { const c = R.int(3, 10), h = R.int(2, 15), V = c * c * h; if (V % 3 || h === c) return null;
        return Qv("Une pyramide à base carrée de côté " + M(c) + " cm a un volume de " + M(V / 3) + " cm³. Quelle est sa hauteur (en cm) ?", h, M("\\frac{1}{3} \\cdot " + c * c + " \\cdot h = " + V / 3) + ", donc " + M("h = " + V / 3 + " \\cdot 3 : " + c * c + " = " + h) + " cm.",
          { ctx: "pyr", guide: [GS("Aire de la base ?", c * c, M(c * c) + " cm²."), GS("Volume × 3 ?", V, M(V) + "."), GS("Hauteur ?", h, M(V + " : " + c * c + " = " + h) + " cm.")], traps: [TR(V / 3 / (c * c), "Une pyramide : " + M("h = \\frac{3V}{A_{\\text{base}}}") + ", n'oublie pas le facteur 3.")] }); },
      () => { const r = pk([3, 6, 9]), k = 4 * r ** 3 / 3;
        return Qv("Une boule a un volume de " + M(piT(k)) + " cm³. Quel est son rayon (en cm) ?", r, M("\\frac{4}{3}\\pi r^3 = " + piT(k)) + ", donc " + M("r^3 = " + k + " \\cdot \\frac{3}{4} = " + r ** 3) + " et " + M("r = " + r) + " cm.",
          { ctx: "boule", guide: [GS("Combien vaut " + M("r^3") + " ? (" + M(k + " \\cdot 3 : 4") + ")", r ** 3, M(r ** 3) + "."), GS(M("r") + " = ? (racine cubique)", r, M(r + "^3 = " + r ** 3) + ", donc " + M("r = " + r) + " cm.")], traps: [TR(r ** 3, "C'est " + M("r^3") + " : cherche le nombre dont le cube vaut " + M(r ** 3) + "."), TR(Math.sqrt(r ** 3), "C'est un cube : racine cubique, pas carrée.")] }); },
    ],
    3: [
      () => { const a = pk([8, 10, 12, 15]), b = pk([4, 5, 6]), V = pk([96, 120, 150, 180, 240]), h = V / (a * b); if (h > 3 || h < 0.5) return null;
        return Qv("Une piscine rectangulaire de " + M(a) + " m sur " + M(b) + " m doit contenir " + M(N(V)) + " m³ d'eau. Quelle doit être la profondeur de l'eau (en m, au centième) ?", h, M("h = " + V + " : (" + a + " \\cdot " + b + ") = " + V + " : " + a * b + " \\approx " + N(rd(h, 0.01))) + " m.",
          { round: 0.01, ctx: "piscine", guide: [GS("Aire du fond ?", a * b, M(a * b) + " m²."), GS("Profondeur (au centième) ?", h, M(N(rd(h, 0.01))) + " m.", 0.01)], traps: [TR(V / a, "Divise par l'aire du fond, " + M(a + " \\cdot " + b) + ".")] }); },
      () => { const r = pk([3, 4, 5, 6, 3.5]), L = pk([0.5, 1, 1.5, 0.75, 2]), V = L * 1000, h = V / (Math.PI * r * r);
        return Qv("Une boîte cylindrique de rayon " + cm(r) + " doit contenir " + M(N(L)) + " L. Quelle doit être sa hauteur (en cm, au dixième) ?", h, M(N(L) + "\\ \\text{L} = " + N(V)) + " cm³ ; " + M("h = \\frac{" + N(V) + "}{\\pi \\cdot " + N(r) + "^2} \\approx " + N(rd(h, 0.1))) + " cm.",
          { round: 0.1, ctx: "boite", guide: [GS("Volume en cm³ (1 L = 1000 cm³) ?", V, M(N(V)) + " cm³."), GS("Aire de la base (au centième) ?", Math.PI * r * r, M("\\pi \\cdot " + N(r) + "^2 \\approx " + N(rd(Math.PI * r * r, 0.01))) + " cm².", 0.01), GS("Hauteur (au dixième) ?", h, M(N(rd(h, 0.1))) + " cm.", 0.1)],
            traps: [TR(L / (Math.PI * r * r), "Convertis d'abord les litres en cm³ (1 L = 1000 cm³)."), TR(V / (Math.PI * 2 * r), "L'aire de la base est " + M("\\pi r^2") + ".")] }); },
      () => { const d = 2 * R.int(2, 6), r = d / 2, h = 3 * R.int(1, 5), k = r * r * h / 3; if (!Number.isInteger(k)) return null;
        return Qv("Un entonnoir en forme de cône a un diamètre de " + M(d) + " cm et contient " + M(piT(k)) + " cm³. Quelle est sa profondeur (hauteur, en cm) ?", h, "Rayon " + M(r) + " : " + M("\\frac{1}{3}\\pi \\cdot " + r * r + " \\cdot h = " + piT(k)) + ", donc " + M("h = " + k + " \\cdot 3 : " + r * r + " = " + h) + " cm.",
          { ctx: "entonnoir", guide: [GS("Le rayon ?", r, M(r) + " cm."), GS(M("r^2 \\cdot h") + " vaut " + M(k + " \\cdot 3") + ". Combien ?", 3 * k, M(3 * k) + "."), GS("Hauteur ?", h, M(3 * k + " : " + r * r + " = " + h) + " cm.")],
            traps: [TR(3 * k / (d * d), "On a donné le diamètre : le rayon en est la moitié."), TR(k / (r * r), "N'oublie pas le facteur 3 du cône.")] }); },
    ],
  };

  // ===================== Défis (niveau 4) =====================
  const PROBS = {
    pyth: [
      () => P("Un écran de télévision 16:9 a une diagonale de 55 pouces (1 pouce = 2,54 cm). Sa largeur vaut " + M("16k") + " et sa hauteur " + M("9k") + ".",
          [["a) Diagonale en cm (au dixième)", 139.7, 0.1], ["b) k (au centième), sachant que (16k)² + (9k)² = diagonale²", 139.7 / Math.sqrt(337), 0.01], ["c) Largeur de l'écran en cm (à l'unité)", 16 * 139.7 / Math.sqrt(337), 1]],
          ["a) 55 · 2,54.", "b) 337k² = diagonale², donc k = diagonale ÷ √337."], "a) " + M("139{,}7") + " cm ; b) " + M("k \\approx 7{,}61") + " ; c) " + M("\\approx 122") + " cm."),
      () => P("Deux bateaux partent du même port : l'un vers le nord à 12 km/h, l'autre vers l'est à 16 km/h.",
          [["a) Distance parcourue vers le nord en 2 h (km)", 24], ["b) Distance vers l'est en 2 h (km)", 32], ["c) Distance entre les deux bateaux après 2 h (km)", 40]],
          ["Nord et est forment un angle droit.", "c) √(24² + 32²)."], "c) " + M("\\sqrt{24^2 + 32^2} = 40") + " km."),
    ],
    pythfig: [
      () => P("Une boîte en forme de pavé mesure 30 cm × 40 cm × 120 cm.", [["a) Diagonale du fond 30 × 40 (cm)", 50], ["b) Grande diagonale de la boîte (cm)", 130], ["c) Un bâton de 1,25 m entre-t-il ? Tape 1 pour oui, 0 pour non.", 1]],
          ["b) Avec la hauteur : √(50² + 120²).", "c) Compare 125 cm et la grande diagonale."], "a) 50 cm ; b) " + M("\\sqrt{2500 + 14\\text{'}400} = 130") + " cm ; c) oui, 125 < 130."),
      () => P("Un carré est inscrit dans un cercle de rayon 5 cm.", [["a) Diagonale du carré (cm)", 10], ["b) Aire du carré (cm²)", 50], ["c) Aire entre le cercle et le carré (cm², au centième)", 25 * Math.PI - 50, 0.01]],
          ["La diagonale est un diamètre.", "b) c² + c² = 10²."], "a) 10 ; b) " + M("c^2 = 50") + " ; c) " + M("25\\pi - 50 \\approx 28{,}54") + " cm²."),
    ],
    pythrec: [
      () => P("Un triangle a pour sommets A(1 ; 1), B(5 ; 3) et C(3 ; 7).", [["a) AB²", 20], ["b) BC²", 20], ["c) AC²", 40]],
          ["Écarts de coordonnées au carré, additionnés.", "Compare AC² et AB² + BC²."], "a) " + M("4^2 + 2^2 = 20") + " ; b) " + M("2^2 + 4^2 = 20") + " ; c) " + M("2^2 + 6^2 = 40 = 20 + 20") + " : rectangle (et isocèle) en " + M("B") + "."),
      () => P("Les côtés d'un triangle mesurent n² − 1, 2n et n² + 1 (n entier, n ≥ 2).", [["a) Pour n = 4 : le plus grand côté", 17], ["b) (n² − 1)² + (2n)² pour n = 4", 289], ["c) (n² + 1)² pour n = 4", 289]],
          ["Remplace n par 4.", "Ces triangles sont toujours rectangles : vérifie en développant."], "a) 17 ; b) " + M("15^2 + 8^2 = 289") + " ; c) " + M("17^2 = 289") + " : rectangle."),
    ],
    vol: [
      () => P("Une piscine de 25 m × 10 m a une profondeur de 1,2 m d'un côté et 2 m de l'autre (fond en pente régulière).", [["a) Aire de la face latérale (trapèze) en m²", 40], ["b) Volume de la piscine (m³)", 400], ["c) Nombre de litres", 400000]],
          ["La piscine est un prisme dont la base est un trapèze : (1,2 + 2) · 25 ÷ 2.", "1 m³ = 1000 L."], "a) " + M("\\frac{(1{,}2 + 2) \\cdot 25}{2} = 40") + " m² ; b) " + M("40 \\cdot 10 = 400") + " m³ ; c) " + M("400\\text{'}000") + " L."),
      () => P("Une canette de 33 cL a un rayon de 3,3 cm.", [["a) Volume en cm³", 330], ["b) Aire de la base (cm², au centième)", Math.PI * 3.3 * 3.3, 0.01], ["c) Hauteur minimale pour contenir les 33 cL (cm, au dixième supérieur)", Math.ceil(330 / (Math.PI * 3.3 * 3.3) * 10) / 10, 0.01]],
          ["1 cL = 10 cm³.", "c) Volume ÷ aire de la base, puis arrondir AU-DESSUS : une hauteur plus petite ne contiendrait pas tout."], "a) 330 ; b) " + M("\\approx 34{,}21") + " ; c) " + M("330 \\div 34{,}21 \\approx 9{,}646") + ", donc " + M("9{,}7") + " cm (avec " + M("9{,}6") + " cm, la canette ne contiendrait que " + M("\\approx 328") + " cm³)."), /* 25.11 soir (revue d'un testeur) : hauteur minimale = arrondi supérieur */
    ],
    volcone: [
      () => P("Une boule de rayon 3 cm est posée dans un cylindre de même rayon et de hauteur 6 cm.", [["a) Volume du cylindre (cm³, au centième)", 54 * Math.PI, 0.01], ["b) Volume de la boule (cm³, au centième)", 36 * Math.PI, 0.01], ["c) Quelle fraction du cylindre la boule occupe-t-elle ? (fraction)", 2 / 3]],
          ["Cylindre 54π, boule 36π.", "c) 36π ÷ 54π."], "c) " + M("\\frac{36\\pi}{54\\pi} = \\frac{2}{3}") + " : le résultat d'Archimède."),
      () => P("Un cône et un cylindre ont la même base (rayon 4 cm) et le même volume. Le cylindre mesure 5 cm de haut.", [["a) Volume du cylindre (cm³, au centième)", 80 * Math.PI, 0.01], ["b) Hauteur du cône (cm)", 15]],
          ["Le cône vaut le tiers d'un cylindre de même base et même hauteur.", "b) Il doit être 3 fois plus haut."], "b) " + M("3 \\cdot 5 = 15") + " cm."),
    ],
    airepyr: [
      () => P("Une pyramide régulière à base carrée a une base de 10 m de côté et une hauteur de 12 m.", [["a) Apothème (m)", 13], ["b) Aire latérale (m²)", 260], ["c) Volume (m³)", 400]],
          ["a) √(12² + 5²).", "c) Base × hauteur ÷ 3."], "a) 13 ; b) " + M("2 \\cdot 10 \\cdot 13 = 260") + " ; c) " + M("\\frac{100 \\cdot 12}{3} = 400") + "."),
      () => P("Patron d'une pyramide régulière : un carré de 16 cm de côté et quatre triangles isocèles d'apothème 10 cm.", [["a) Aire du patron (cm²)", 576], ["b) Hauteur de la pyramide montée (cm)", 6], ["c) Volume (cm³)", 512]],
          ["a) Carré + 4 triangles.", "b) √(10² − 8²) ; c) Base × hauteur ÷ 3."], "a) " + M("256 + 4 \\cdot \\frac{16 \\cdot 10}{2} = 576") + " ; b) " + M("\\sqrt{100 - 64} = 6") + " ; c) " + M("\\frac{256 \\cdot 6}{3} = 512") + "."),
    ],
    volcomp: [
      () => P("Un réservoir : cylindre de rayon 1 m et de hauteur 3 m, avec un fond en cône de même rayon et de hauteur 0,6 m.", [["a) Volume du cylindre (m³, au centième)", 3 * Math.PI, 0.01], ["b) Volume du cône (m³, au centième)", 0.2 * Math.PI, 0.01], ["c) Contenance totale en litres (à l'unité)", 3200 * Math.PI, 1]],
          ["Cône : ⅓ · π · r² · h.", "1 m³ = 1000 L."], "c) " + M("3{,}2\\pi \\approx 10{,}053") + " m³, soit environ " + M("10\\text{'}053") + " L."),
      () => P("Une bougie : un cube de 6 cm d'arête surmonté d'une pyramide de 6 cm de hauteur.", [["a) Volume du cube (cm³)", 216], ["b) Volume de la pyramide (cm³)", 72], ["c) Masse de cire si 1 cm³ pèse 0,9 g (g)", 259.2]],
          ["Pyramide : 36 · 6 ÷ 3.", "Masse = volume · 0,9."], "c) " + M("288 \\cdot 0{,}9 = 259{,}2") + " g."),
    ],
    volmanq: [
      () => P("Un verre conique de 6 cm de rayon doit contenir 20 cL.", [["a) 20 cL en cm³", 200], ["b) Hauteur du verre (cm, au dixième)", 600 / (36 * Math.PI), 0.1]],
          ["1 cL = 10 cm³.", "h = 3V ÷ (π r²)."], "b) " + M("h = \\frac{600}{36\\pi} \\approx 5{,}3") + " cm."),
      () => P("On fond une boule de métal de rayon 3 cm pour fabriquer un cylindre de rayon 2 cm.", [["a) Volume de la boule (cm³, au centième)", 36 * Math.PI, 0.01], ["b) Hauteur du cylindre (cm)", 9]],
          ["Même volume : π · 2² · h = 36π.", "h = 36 ÷ 4."], "b) " + M("h = 36 : 4 = 9") + " cm."),
    ],
  };

  // ===================== Enregistrement =====================
  // « Trouve l'erreur » (24.11, chantier I) : cathète calculée avec une somme de carrés au lieu d'une différence.
  PYTH[2].push(() => { const [p, q, r] = R.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]]), k = R.pick([1, 2]), a = p * k, b = q * k, c = r * k, w = R.pick(["Sam", "Lina", "Noé", "Inès", "Yanis", "Léa"]);
    return Qv("Un triangle est rectangle ; son hypoténuse mesure " + M(c) + " cm et une cathète " + M(a) + " cm. " + w + " écrit : « " + M("b = \\sqrt{" + c + "^2 + " + a + "^2}") + " ». Trouve l'erreur, puis calcule l'autre cathète " + M("b") + " (en cm).", b,
      "Erreur : l'hypoténuse est le plus grand côté ; " + M("c^2 = a^2 + b^2") + " donne " + M("b^2 = c^2 - a^2 = " + c * c + " - " + a * a + " = " + b * b) + ", donc " + M("b = " + b) + " cm.",
      { ctx: "erreur", guide: [GS(M("b^2 = c^2 - a^2") + " : " + M(c * c + " - " + a * a) + " = ?", b * b, M(b * b) + "."), GS(M("b = \\sqrt{" + b * b + "}") + " = ?", b, M(b) + " cm.")],
        traps: [TRAP(+Math.sqrt(c * c + a * a).toFixed(2), "C'est le calcul de " + w + " : une cathète est plus courte que l'hypoténuse, on soustrait les carrés.")] }); });
  // « Trouve l'erreur » (24.11, chantier I, suite) : volume du cône sans le tiers.
  VCONE[2].push(() => { const r = R.int(2, 8), h = R.int(4, 15), v = (Math.PI * r * r * h) / 3, faux = Math.PI * r * r * h, base = Math.PI * r * r, w = pk(["Sam", "Lina", "Noé", "Inès", "Yanis", "Léa"]);
    return Qv("Un cône a un rayon de " + cm(r) + " et une hauteur de " + cm(h) + ". " + w + " calcule son volume : « " + M("V = \\pi \\cdot " + r + "^2 \\cdot " + h + " \\approx " + N(Math.round(faux))) + " cm³ ». Trouve l'erreur, puis donne le bon volume (au cm³ près).", v,
      "Erreur : " + w + " a calculé le volume du <b>cylindre</b> de même base et même hauteur. Un cône (comme une pyramide) en contient le tiers : " + M("V = \\frac{\\pi \\cdot " + r + "^2 \\cdot " + h + "}{3} \\approx " + N(Math.round(v))) + " cm³.",
      { round: 1, ctx: "erreur", guide: [GS("Aire de la base " + M("\\pi \\cdot " + r + "^2") + " ≈ ? (au dixième, en cm²)", base, M("\\approx " + N(Math.round(base * 10) / 10)) + " cm².", 0.1), GS("Volume : aire de la base · hauteur, divisé par 3 ≈ ? (au cm³ près)", v, M("\\approx " + N(Math.round(v))) + " cm³.", 1)],
        traps: [TR(faux, "C'est le résultat de " + w + " : c'est le volume du cylindre ; celui du cône est 3 fois plus petit."), TR((2 * Math.PI * r * h) / 3, "La base est un disque : son aire est " + M("\\pi r^2") + ".")] }); });
  const ALL = { pyth: PYTH, pythfig: PFIG, pythrec: PREC, vol: VOL, volcone: VCONE, airepyr: APYR, volcomp: VCOMP, volmanq: VMAN };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => pickForm(lv[Math.min(Math.max(d, 1), 3)]);
    if (typeof VAR !== "undefined") VAR[id] = {};
    if (typeof PROB !== "undefined") delete PROB[id];
    PROB_EXTRA[id] = PROBS[id];
  }
  Object.assign(HINTS_EXTRA, {
    pyth: "Repère l'hypoténuse (en face de l'angle droit). Hypoténuse² = somme des carrés des cathètes ; pour une cathète, on soustrait.",
    pythfig: "Cherche le triangle rectangle caché : diagonale d'un rectangle, hauteur d'un triangle isocèle (demi-base), diagonale d'un pavé (a² + b² + c²), hauteur d'une pyramide.",
    pythrec: "Compare le carré du plus grand côté avec la somme des carrés des deux autres : égalité → rectangle ; sinon, pas rectangle.",
    vol: "Prisme et cylindre : V = aire de la base × hauteur. 1 L = 1 dm³ = 1000 cm³, 1 cL = 10 cm³.",
    volcone: "Pyramide et cône : V = ⅓ · aire de la base · hauteur. Boule : V = ⁴⁄₃ π r³ ; sphère : A = 4 π r².",
    airepyr: "Aire latérale d'une pyramide régulière : 4 triangles de base c et de hauteur l'apothème (Pythagore avec le demi-côté).",
    volcomp: "Découpe le solide en solides simples, calcule chaque volume (garde π), puis additionne ou soustrais.",
    volmanq: "Écris la formule du volume, remplace ce que tu connais, puis isole la dimension cherchée.",
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    pyth: ["Calculer un côté d'un triangle rectangle", "Valeur exacte, distance dans un repère", "Problèmes en plusieurs étapes"],
    pythfig: ["Diagonale, hauteur d'un triangle isocèle", "Diagonales d'un pavé, d'un cube, triangle équilatéral", "Pyramides et cônes (hauteur, apothème, génératrice)"],
    pythrec: ["Tester si un triangle est rectangle", "Décimaux, repère, côté manquant", "Équerre, racines, contrôle d'un cadre"],
    vol: ["Volume d'un pavé, d'un prisme, d'un cylindre", "Prisme à base trapèze, contenances", "Aires totales, cylindre creux"],
    volcone: ["Volume d'une pyramide, d'un cône, d'une boule", "Diamètre, demi-boule, pyramide dans un cube", "Génératrice, aire de la sphère, variations"],
    airepyr: ["Aire latérale et totale d'une pyramide", "Apothème avec Pythagore", "Problèmes : Louvre, toit, coût"],
    volcomp: ["Solides composés simples", "Silo, gélule, cube percé", "Glace, découpe, tente"],
    volmanq: ["Retrouver une hauteur, une longueur", "Rayon d'un cône, d'une boule ; hauteur d'une pyramide", "Problèmes avec conversions"],
  });
})();

// Chantier 11e · 7. Angles (18.11, lot suivant du plan de cheminement) : une seule source pour angles (types d'angles,
// opposés par le sommet, correspondants, alternes-internes, angle inscrit et angle au centre) et cercthales (cercle de
// Thalès, tangente). Même standard que ch11_gm.js : au moins 3 formes par niveau, pas à pas, erreurs typiques, ctx,
// figures ; défis en plusieurs étapes. Pas de leçon active nouvelle (règle du 18.11 : stabiliser la manipulation d'abord).
(function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const keep = (value, traps) => { const seen = new Set(); return (traps || []).filter((t) => t && isFinite(t.v) && Math.abs(t.v - value) > 1e-9 && !seen.has(t.v) && seen.add(t.v)); };
  const Qv = (q, value, sol, o = {}) => { const x = { q, spec: Object.assign({ kind: "value", value }, o.round ? { round: o.round } : {}), sol, guide: o.guide, traps: keep(value, o.traps), ctx: o.ctx }; if (o.fig) x.fig = o.fig; return x; };
  const TR = TRAP;
  const P = (q, parts, hints, sol, fig) => ({ fig, q, parts: parts.map(([label, value, round]) => ({ label, spec: Object.assign({ kind: "value", value }, round ? { round } : {}) })), hints, sol });
  const deg = (v) => M(v + "°");
  const TRIP = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25]];

  // Deux droites parallèles (d₁ en bas, d₂ en haut) coupées par une sécante d'angle a avec la direction des parallèles.
  // Régions autour d'une intersection (sens trigonométrique depuis la droite) : 1 = droite→sécante haut (a),
  // 2 = sécante haut→gauche (180 − a), 3 = gauche→sécante bas (a), 4 = sécante bas→droite (180 − a).
  // marks : [[point (0 = sur d₁, 1 = sur d₂), région, étiquette], …]. one = true : une seule droite (angles en un point).
  const par = (a, marks, one) => {
    const t = (a * Math.PI) / 180, d = [Math.cos(t), Math.sin(t)], h = 3.2, /* 25.11 : 2,4 → 3,2, étiquettes des deux angles entre les parallèles moins serrées (robot : « 68° » à 17 px du « ? ») */ I = [[0, 0], [h / Math.tan(t), h]];
    const g = GEO().add([-4, -1.8], [5.2, h + 1.8]);
    g.seg([-4, 0], [5.2, 0]); if (!one) g.seg([-4, h], [5.2, h]);
    g.seg([I[0][0] - 2 * d[0], I[0][1] - 2 * d[1]], [I[one ? 0 : 1][0] + 2 * d[0], I[one ? 0 : 1][1] + 2 * d[1]]);
    if (!one) g.text([-3.6, 0], "d₁", 0, -6).text([-3.6, h], "d₂", 0, -6);
    marks.forEach(([k, r, lab]) => { const V = I[k], R0 = [V[0] + 2, V[1]], U = [V[0] + d[0], V[1] + d[1]], L0 = [V[0] - 2, V[1]], D0 = [V[0] - d[0], V[1] - d[1]];
      const [A, B] = [[R0, U], [U, L0], [L0, D0], [D0, R0]][r - 1]; g.angle(V, A, B, lab, { r: 18 + 4 * k }); });
    return g.svg(one ? "deux droites sécantes" : "droites parallèles coupées par une sécante");
  };
  const rv = (a, r) => (r % 2 ? a : 180 - a); // mesure de la région r

  // ===================== angles =====================
  const ANG = {
    1: [
      () => { const a = R.int(12, 78), sup = R.rand() < 0.5;
        return Qv("Quel est le " + (sup ? "supplément" : "complément") + " d'un angle de " + deg(a) + " ? (en degrés)", sup ? 180 - a : 90 - a, (sup ? "Deux angles supplémentaires font 180° : " + M("180° - " + a + "° = " + (180 - a) + "°") : "Deux angles complémentaires font 90° : " + M("90° - " + a + "° = " + (90 - a) + "°")) + ".",
          { ctx: sup ? "supplement" : "complement", guide: [GS("Deux angles " + (sup ? "supplémentaires" : "complémentaires") + " ont une somme de combien de degrés ?", sup ? 180 : 90, sup ? "180°." : "90°."), GS("Que reste-t-il en enlevant " + deg(a) + " ?", sup ? 180 - a : 90 - a, deg(sup ? 180 - a : 90 - a) + ".")],
            traps: [TR(sup ? 90 - a : 180 - a, sup ? "Supplémentaires : la somme fait 180° (90°, c'est pour complémentaires)." : "Complémentaires : la somme fait 90° (180°, c'est pour supplémentaires).")] }); },
      () => { const a = R.int(25, 75), opp = R.rand() < 0.5;
        return Qv("Deux droites se coupent. Un des angles mesure " + deg(a) + ". Combien mesure l'angle marqué « ? » (en degrés) ?", opp ? a : 180 - a,
          opp ? "Les deux angles sont opposés par le sommet : ils sont égaux, " + deg(a) + "." : "Les deux angles sont adjacents et forment un angle plat : " + M("180° - " + a + "° = " + (180 - a) + "°") + ".",
          { ctx: opp ? "oppose" : "adjacent", fig: par(a, [[0, 1, a + "°"], [0, opp ? 3 : 2, "?"]], true), guide: [GS(opp ? "Les deux angles sont opposés par le sommet : ont-ils la même mesure ? Tape la mesure de « ? »." : "Les deux angles sont côte à côte sur une droite : quelle est leur somme ?", opp ? a : 180, opp ? "Oui : " + deg(a) + "." : "180° (angle plat)."), ...(opp ? [] : [GS("Mesure de « ? » ?", 180 - a, deg(180 - a) + ".")])],
            traps: [TR(opp ? 180 - a : a, opp ? "Ces deux angles sont opposés par le sommet (en face l'un de l'autre) : ils sont égaux." : "Ces angles sont adjacents sur une droite : ils sont supplémentaires (somme 180°).")] }); },
      () => { const a = R.int(30, 70), r = pk([1, 2, 3, 4]);
        return Qv("Les droites " + M("d_1") + " et " + M("d_2") + " sont parallèles. Un angle mesure " + deg(rv(a, r)) + ". Combien mesure l'angle marqué « ? » ?", rv(a, r), "Les deux angles sont correspondants (même position aux deux intersections) : avec des parallèles, ils sont égaux, " + deg(rv(a, r)) + ".",
          { ctx: "correspondants", fig: par(a, [[0, r, rv(a, r) + "°"], [1, r, "?"]]), guide: [GS("Les deux angles occupent la même position aux deux intersections : ce sont des angles correspondants. Avec des parallèles, ils sont égaux. Mesure de « ? » ?", rv(a, r), deg(rv(a, r)) + ".")],
            traps: [TR(180 - rv(a, r), "Correspondants : même position, même mesure (pas supplémentaires).")] }); },
      /* 25.11 (audit de niveau 11e) : « trois angles autour d'un point » (tour complet, 9e) remplacé par les angles
         internes du même côté (supplémentaires) et alternes-externes (égaux), au programme de 11e (plan de cheminement, 7. Angles). */
      () => { const a = R.int(32, 72), co = R.rand() < 0.55, [r1, r2] = co ? pk([[1, 4], [2, 3]]) : pk([[3, 1], [4, 2]]), g = rv(a, r1), v = rv(a, r2);
        return Qv("Les droites " + M("d_1") + " et " + M("d_2") + " sont parallèles. Un angle mesure " + deg(g) + ". Combien mesure l'angle marqué « ? » ?", v,
          co ? "Les deux angles sont entre les parallèles, du même côté de la sécante (angles internes du même côté) : ils sont supplémentaires, " + M("180° - " + g + "° = " + v + "°") + "."
            : "Les deux angles sont à l'extérieur des parallèles, de part et d'autre de la sécante (alternes-externes) : ils sont égaux, " + deg(v) + ".",
          { ctx: co ? "co-internes" : "alternes-externes", fig: par(a, [[0, r1, g + "°"], [1, r2, "?"]]),
            guide: co ? [GS("Les deux angles sont entre les parallèles, du même côté de la sécante. Quelle est leur somme ?", 180, "180° : ils sont supplémentaires."), GS("Mesure de « ? » ?", v, deg(v) + ".")]
              : [GS("Les deux angles sont à l'extérieur des parallèles, de part et d'autre de la sécante : alternes-externes, donc égaux. Mesure de « ? » ?", v, deg(v) + ".")],
            traps: [TR(co ? g : 180 - g, co ? "Internes du même côté : les angles ne sont pas égaux, ils sont supplémentaires (somme 180°)." : "Alternes-externes : les angles sont égaux (pas supplémentaires).")] }); },
    ],
    2: [
      () => { const a = R.int(30, 70), [r1, r2] = pk([[1, 3], [2, 4]]);
        return Qv("Les droites " + M("d_1") + " et " + M("d_2") + " sont parallèles. Un angle mesure " + deg(rv(a, r1)) + ". Combien mesure l'angle marqué « ? » ?", rv(a, r2), "Les deux angles sont alternes-internes (entre les parallèles, de part et d'autre de la sécante) : ils sont égaux, " + deg(rv(a, r2)) + ".",
          { ctx: "alternes", fig: par(a, [[0, r1, rv(a, r1) + "°"], [1, r2, "?"]]),
            guide: [GS("Les deux angles sont entre les parallèles, de part et d'autre de la sécante : alternes-internes. Mesure de « ? » ?", rv(a, r2), deg(rv(a, r2)) + ".")],
            traps: [TR(180 - rv(a, r2), "Alternes-internes : les angles sont égaux (pas supplémentaires).")] }); },
      () => { const a = R.int(30, 70);
        return Qv("Les droites " + M("d_1") + " et " + M("d_2") + " sont parallèles. Un angle mesure " + deg(a) + ". Combien mesure l'angle marqué « ? » ?", 180 - a, "L'angle correspondant à " + deg(a) + " sur " + M("d_2") + " mesure aussi " + deg(a) + " ; « ? » lui est adjacent sur la droite : " + M("180° - " + a + "° = " + (180 - a) + "°") + ".",
          { ctx: "deux-etapes", fig: par(a, [[0, 1, a + "°"], [1, 2, "?"]]), guide: [GS("Sur " + M("d_2") + ", l'angle correspondant à " + deg(a) + " (même position) mesure ?", a, deg(a) + "."), GS("« ? » est adjacent à cet angle sur une droite : mesure ?", 180 - a, deg(180 - a) + ".")],
            traps: [TR(a, "« ? » n'est pas à la même position que l'angle donné : il lui est supplémentaire.")] }); },
      () => { const ins = R.int(18, 80), dir = R.rand() < 0.5;
        return dir ? Qv("Dans un cercle de centre " + M("O") + ", l'angle inscrit " + M("\\widehat{ACB}") + " mesure " + deg(ins) + ". Combien mesure l'angle au centre " + M("\\widehat{AOB}") + " qui intercepte le même arc ?", 2 * ins, "L'angle au centre vaut le double de l'angle inscrit : " + M("2 \\cdot " + ins + "° = " + 2 * ins + "°") + ".",
            { ctx: "centre", fig: FIG.circleAngles("?", ins + "°"), guide: [GS("Angle au centre = 2 × angle inscrit. Calcule-le.", 2 * ins, deg(2 * ins) + ".")], traps: [TR(ins / 2, "C'est l'inverse : l'angle au CENTRE est le double de l'angle inscrit."), TR(ins, "Ils interceptent le même arc, mais l'angle au centre vaut le double.")] })
          : Qv("Dans un cercle de centre " + M("O") + ", l'angle au centre " + M("\\widehat{AOB}") + " mesure " + deg(2 * ins) + ". Combien mesure l'angle inscrit " + M("\\widehat{ACB}") + " qui intercepte le même arc ?", ins, "L'angle inscrit vaut la moitié de l'angle au centre : " + M(2 * ins + "° : 2 = " + ins + "°") + ".",
            { ctx: "inscrit", fig: FIG.circleAngles(2 * ins + "°", "?"), guide: [GS("Angle inscrit = angle au centre ÷ 2. Calcule-le.", ins, deg(ins) + ".")], traps: [TR(4 * ins, "L'angle inscrit est la MOITIÉ de l'angle au centre.")] }); },
      () => { const ins = R.int(20, 75);
        return Qv("Sur un cercle, les angles inscrits " + M("\\widehat{AMB}") + " et " + M("\\widehat{ANB}") + " interceptent le même arc " + M("AB") + " (M et N du même côté de la corde). " + M("\\widehat{AMB} = " + ins + "°") + ". Combien mesure " + M("\\widehat{ANB}") + " ?", ins, "Deux angles inscrits qui interceptent le même arc sont égaux : " + deg(ins) + ".",
          { ctx: "meme-arc", guide: [GS("Chacun vaut la moitié du même angle au centre " + M("\\widehat{AOB}") + ". Combien mesure " + M("\\widehat{AOB}") + " ?", 2 * ins, deg(2 * ins) + "."), GS("Donc " + M("\\widehat{ANB}") + " = ?", ins, deg(ins) + ".")],
            traps: [TR(2 * ins, "C'est l'angle au centre ; les angles inscrits valent sa moitié."), TR(180 - ins, "M et N sont du même côté : les angles sont égaux (pas supplémentaires).")] }); },
    ],
    3: [
      () => { let x, p, q, s, t; do { p = R.int(3, 6); q = R.int(1, 4); x = R.int(8, 25); s = R.int(-20, 30); t = p * x + s - q * x; } while (p - q < 2 || p * x + s <= 10 || p * x + s >= 170 || t <= 0);
        return Qv("Avec deux parallèles coupées par une sécante, deux angles alternes-internes mesurent " + M("(" + p + "x" + (s < 0 ? " - " + -s : " + " + s) + ")°") + " et " + M("(" + q + "x + " + t + ")°") + ". Que vaut " + M("x") + " ?", x,
          "Alternes-internes donc égaux : " + M(p + "x" + (s < 0 ? " - " + -s : " + " + s) + " = " + q + "x + " + t) + ", " + M((p - q) + "x = " + (t - s)) + ", " + M("x = " + x) + ".",
          { ctx: "equation", guide: [GS("Les deux angles sont égaux : " + M(p + "x" + (s < 0 ? " - " + -s : " + " + s) + " = " + q + "x + " + t) + ". Après regroupement, " + M((p - q) + "x = ?"), t - s, M((p - q) + "x = " + (t - s)) + "."), GS(M("x") + " = ?", x, M("x = " + x) + ".")],
            traps: [TR((180 - s - t) / (p + q), "Alternes-internes : les angles sont égaux (on n'écrit pas une somme de 180°).")] }); },
      () => { let x, p, s, q, t; do { p = R.int(2, 4); q = R.int(1, 3); x = R.int(10, 30); s = R.int(-10, 30); t = 180 - p * x - s - q * x; } while (t < -30 || t > 60 || p * x + s <= 10 || q * x + t <= 10);
        return Qv("Deux angles adjacents forment un angle plat. Ils mesurent " + M("(" + p + "x" + (s < 0 ? " - " + -s : " + " + s) + ")°") + " et " + M("(" + q + "x" + (t < 0 ? " - " + -t : " + " + t) + ")°") + ". Que vaut " + M("x") + " ?", x,
          "Supplémentaires : " + M("(" + p + "x" + (s < 0 ? " - " + -s : " + " + s) + ") + (" + q + "x" + (t < 0 ? " - " + -t : " + " + t) + ") = 180") + ", " + M((p + q) + "x = " + (180 - s - t)) + ", " + M("x = " + x) + ".",
          { ctx: "plat", guide: [GS("La somme fait 180° : " + M((p + q) + "x + " + (s + t) + " = 180") + ". " + M((p + q) + "x = ?"), 180 - s - t, M((p + q) + "x = " + (180 - s - t)) + "."), GS(M("x") + " = ?", x, M("x = " + x) + ".")],
            traps: [TR((90 - s - t) / (p + q), "Un angle plat fait 180° (90°, c'est un angle droit).")] }); },
      () => { const c = 2 * R.int(20, 70);
        return Qv("Dans un cercle de centre " + M("O") + ", l'angle au centre " + M("\\widehat{AOB}") + " mesure " + deg(c) + ". Combien mesure l'angle " + M("\\widehat{OAB}") + " du triangle " + M("AOB") + " ?", (180 - c) / 2,
          M("OA = OB") + " (rayons) : le triangle est isocèle, ses angles à la base sont égaux. " + M("\\widehat{OAB} = (180° - " + c + "°) : 2 = " + (180 - c) / 2 + "°") + ".",
          { ctx: "isocele", guide: [GS("Somme des angles du triangle " + M("AOB") + " ?", 180, "180°."), GS("Il reste pour les deux angles à la base : ?", 180 - c, deg(180 - c) + "."), GS("Le triangle est isocèle (" + M("OA = OB") + ") : chacun mesure ?", (180 - c) / 2, deg((180 - c) / 2) + ".")],
            traps: [TR(180 - c, "Il reste " + (180 - c) + "° pour DEUX angles égaux : divise par 2."), TR(c / 2, "Ce n'est pas un angle inscrit : utilise la somme des angles du triangle isocèle AOB.")] }); },
    ],
  };

  // ===================== cercthales =====================
  const CT = {
    1: [
      () => { const a = R.int(20, 70);
        return Qv(M("[AB]") + " est un diamètre d'un cercle et " + M("C") + " un point du cercle. " + M("\\widehat{CAB} = " + a + "°") + ". Combien mesure " + M("\\widehat{CBA}") + " ?", 90 - a, "Le triangle est rectangle en " + M("C") + " (cercle de Thalès) : " + M("180° - 90° - " + a + "° = " + (90 - a) + "°") + ".",
          { ctx: "angle", fig: GF.diam(2 * a, { lA: a + "°", lB: "?" }), guide: [GS("Un triangle inscrit dans un demi-cercle est rectangle. Combien mesure l'angle en " + M("C") + " ?", 90, "90°."), GS(M("\\widehat{CBA}") + " = 180° − 90° − " + a + "° = ?", 90 - a, deg(90 - a) + ".")],
            traps: [TR(180 - a, "Il y a trois angles : l'angle droit en C compte aussi."), TR(a, "Les deux angles aigus ne sont pas égaux : ils sont complémentaires.")] }); },
      () => { const [r, t, d] = pk(TRIP);
        return Qv("D'un point " + M("P") + " à " + M(d) + " cm du centre " + M("O") + " d'un cercle de rayon " + M(r) + " cm, on trace une tangente qui touche le cercle en " + M("T") + ". Calcule " + M("PT") + " (en cm).", t, "La tangente est perpendiculaire au rayon : " + M("PT^2 = " + d + "^2 - " + r + "^2 = " + t * t) + ", " + M("PT = " + t) + " cm.",
          { ctx: "tangente", fig: GF.tangent(r, d, { lr: r + "", ld: d + "", lt: "?" }), guide: [GS("Le triangle " + M("OTP") + " est rectangle en " + M("T") + ". " + M(d + "^2 - " + r + "^2") + " = ?", t * t, M(t * t) + "."), GS(M("PT") + " = ?", t, M(t) + " cm.")],
            traps: [TR(Math.sqrt(d * d + r * r), "OP est l'hypoténuse (en face de l'angle droit en T) : on soustrait."), TR(d - r, "Pythagore : on soustrait les carrés.")] }); },
      () => { const [a, b, c] = pk(TRIP);
        return Qv(M("[AB]") + " est un diamètre de " + M(c) + " cm d'un cercle, et " + M("C") + " un point du cercle tel que " + M("AC = " + a) + " cm. Calcule " + M("BC") + " (en cm).", b, "Triangle rectangle en " + M("C") + " : " + M("BC^2 = " + c + "^2 - " + a + "^2 = " + b * b) + ", " + M("BC = " + b) + " cm.",
          { ctx: "cote", fig: GF.diam(70, { lAC: a + "", lBC: "?", lAB: c + "" }), guide: [GS("Le triangle est rectangle en " + M("C") + ", d'hypoténuse le diamètre. " + M(c + "^2 - " + a + "^2") + " = ?", b * b, M(b * b) + "."), GS(M("BC") + " = ?", b, M(b) + " cm.")],
            traps: [TR(Math.sqrt(c * c + a * a), "Le diamètre est l'hypoténuse : on soustrait.")] }); },
    ],
    2: [
      () => { const a = R.int(20, 70);
        return Qv("La droite " + M("(PT)") + " est tangente en " + M("T") + " à un cercle de centre " + M("O") + ". " + M("\\widehat{OPT} = " + a + "°") + ". Combien mesure " + M("\\widehat{POT}") + " ?", 90 - a, "La tangente est perpendiculaire au rayon : " + M("\\widehat{OTP} = 90°") + ", donc " + M("\\widehat{POT} = 90° - " + a + "° = " + (90 - a) + "°") + ".",
          { ctx: "tangente-angle", guide: [GS("Angle entre la tangente et le rayon " + M("[OT]") + " ?", 90, "90°."), GS(M("\\widehat{POT}") + " = ?", 90 - a, deg(90 - a) + ".")], traps: [TR(180 - a, "Le triangle OTP a un angle droit en T : il reste 90° − " + a + "°.")] }); },
      () => { const [r, t, d] = pk(TRIP);
        return Qv("Une tangente issue d'un point " + M("P") + " touche un cercle de centre " + M("O") + " en " + M("T") + ". " + M("OP = " + d) + " cm et " + M("PT = " + t) + " cm. Quel est le rayon du cercle (en cm) ?", r, M("r^2 = " + d + "^2 - " + t + "^2 = " + r * r) + ", " + M("r = " + r) + " cm.",
          { ctx: "rayon", fig: GF.tangent(r, d, { lr: "r", ld: d + "", lt: t + "" }), guide: [GS("Triangle rectangle en " + M("T") + " : " + M(d + "^2 - " + t + "^2") + " = ?", r * r, M(r * r) + "."), GS("Rayon ?", r, M(r) + " cm.")], traps: [TR(d - t, "On soustrait les carrés, puis racine.")] }); },
      () => { const [a, b, c] = pk(TRIP);
        return Qv("Un triangle " + M("ABC") + " est rectangle en " + M("C") + ", avec " + M("AC = " + a) + " cm et " + M("BC = " + b) + " cm. Quel est le rayon de son cercle circonscrit (en cm) ?", c / 2, "Le cercle circonscrit a pour diamètre l'hypoténuse (Thalès) : " + M("AB = " + c) + " cm, rayon " + M(String(c / 2).replace(".", "{,}")) + " cm.",
          { ctx: "circonscrit", guide: [GS("Hypoténuse " + M("AB") + " ?", c, M(c) + " cm."), GS("L'hypoténuse est un diamètre du cercle circonscrit. Rayon ?", c / 2, M(String(c / 2).replace(".", "{,}")) + " cm.")], traps: [TR(c, "C'est le diamètre ; le rayon en est la moitié.")] }); },
    ],
    3: [
      () => { const [r, t, d] = pk(TRIP);
        return Qv("D'un point " + M("P") + " à " + M(d) + " cm du centre " + M("O") + " d'un cercle de rayon " + M(r) + " cm, on trace les deux tangentes, qui touchent le cercle en " + M("T") + " et " + M("T'") + ". Quel est le périmètre du quadrilatère " + M("OTPT'") + " (en cm) ?", 2 * r + 2 * t, "Chaque tangente mesure " + M("\\sqrt{" + d + "^2 - " + r + "^2} = " + t) + " cm ; périmètre " + M("2 \\cdot " + r + " + 2 \\cdot " + t + " = " + (2 * r + 2 * t)) + " cm.",
          { ctx: "deux-tangentes", guide: [GS("Longueur d'une tangente " + M("PT") + " ?", t, M(t) + " cm."), GS("Le périmètre fait deux rayons et deux tangentes : ?", 2 * r + 2 * t, M(2 * r + 2 * t) + " cm.")], traps: [TR(2 * r + 2 * d, "Les côtés du quadrilatère sont OT, TP, PT', T'O (pas OP)."), TR(r + t, "Il y a deux rayons et deux tangentes.")] }); },
      () => { const [a, b, c] = pk(TRIP);
        return Qv(M("[AB]") + " est un diamètre de " + M(c) + " cm et " + M("C") + " un point du cercle tel que " + M("AC = " + a) + " cm. Calcule l'aire du triangle " + M("ABC") + " (en cm²).", (a * b) / 2, "Rectangle en " + M("C") + " : " + M("BC = \\sqrt{" + c * c + " - " + a * a + "} = " + b) + " ; aire " + M("\\frac{" + a + " \\cdot " + b + "}{2} = " + String((a * b) / 2).replace(".", "{,}")) + " cm².",
          { ctx: "aire", guide: [GS(M("BC") + " (Pythagore) ?", b, M(b) + " cm."), GS("Aire (les cathètes sont base et hauteur) ?", (a * b) / 2, M(String((a * b) / 2).replace(".", "{,}")) + " cm².")], traps: [TR((a * c) / 2, "La base et la hauteur sont les deux cathètes AC et BC (pas le diamètre)."), TR(a * b, "Aire d'un triangle : on divise par 2.")] }); },
      () => { const a = R.int(20, 70);
        return Qv(M("[AB]") + " est un diamètre d'un cercle de centre " + M("O") + ", et " + M("C") + " un point du cercle. " + M("\\widehat{ACO} = " + a + "°") + ". Combien mesure " + M("\\widehat{BCO}") + " ?", 90 - a, "L'angle " + M("\\widehat{ACB}") + " est droit (Thalès) et vaut " + M("\\widehat{ACO} + \\widehat{BCO}") + " : " + M("90° - " + a + "° = " + (90 - a) + "°") + ".",
          { ctx: "decoupe", guide: [GS("Combien mesure " + M("\\widehat{ACB}") + " ?", 90, "90° (C sur le cercle de diamètre [AB])."), GS(M("\\widehat{BCO}") + " = ?", 90 - a, deg(90 - a) + ".")], traps: [TR(a, "Les deux parties de l'angle droit ne sont pas forcément égales."), TR(180 - a, "L'angle en C est droit : 90° − " + a + "°.")] }); },
    ],
  };

  const PROBS = {
    angles: [
      () => P("Deux parallèles " + M("d_1") + " et " + M("d_2") + " sont coupées par une sécante. À l'intersection avec " + M("d_1") + ", un angle mesure 62°.", [["a) Son angle opposé par le sommet", 62], ["b) Son angle adjacent sur d₁", 118], ["c) L'angle correspondant sur d₂", 62], ["d) L'angle alterne-interne de l'angle adjacent (b)", 118]],
          ["Opposés : égaux ; adjacents sur une droite : 180°.", "Correspondants et alternes-internes : égaux avec des parallèles."], "a) 62° ; b) 118° ; c) 62° ; d) 118°."),
      () => P("Dans un cercle de centre O, l'angle inscrit " + M("\\widehat{ACB}") + " mesure 35°.", [["a) Angle au centre AOB", 70], ["b) Angle OAB du triangle isocèle AOB", 55], ["c) Un autre angle inscrit AMB du même côté", 35]], ["Angle au centre = 2 × inscrit.", "Triangle isocèle : (180 − 70) ÷ 2."], "a) 70° ; b) 55° ; c) 35°."),
    ],
    cercthales: [
      () => P("Un triangle ABC est rectangle en C, avec AC = 6 cm et BC = 8 cm.", [["a) AB (cm)", 10], ["b) Rayon du cercle circonscrit (cm)", 5], ["c) Distance du milieu de [AB] au point C (cm)", 5]], ["Le cercle circonscrit a pour diamètre l'hypoténuse.", "C est sur ce cercle."], "a) 10 ; b) 5 ; c) 5 (C est sur le cercle de centre le milieu de [AB])."),
      () => P("D'un point P à 13 cm du centre O d'un cercle de rayon 5 cm, on trace les deux tangentes PT et PT'.", [["a) PT (cm)", 12], ["b) Aire du triangle OTP (cm²)", 30], ["c) Aire du quadrilatère OTPT' (cm²)", 60]], ["Rectangle en T : PT² = 13² − 5².", "Aire = cathètes ÷ 2."], "a) 12 ; b) 30 ; c) 60."),
    ],
  };

  const ALL = { angles: ANG, cercthales: CT };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => pickForm(lv[Math.min(Math.max(d, 1), 3)]);
    if (typeof VAR !== "undefined") VAR[id] = {};
    if (typeof PROB !== "undefined") delete PROB[id];
    PROB_EXTRA[id] = PROBS[id];
  }
  Object.assign(HINTS_EXTRA, {
    angles: "Opposés par le sommet : égaux. Adjacents sur une droite : 180°. Avec des parallèles, correspondants et alternes-internes : égaux. Angle au centre = 2 × angle inscrit.",
    cercthales: "Un triangle inscrit dans un demi-cercle est rectangle (le diamètre est l'hypoténuse). La tangente est perpendiculaire au rayon au point de contact.",
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    angles: ["Complément, supplément, angles en un point", "Parallèles, angle inscrit et angle au centre", "Équations d'angles, triangle isocèle dans le cercle"],
    cercthales: ["Cercle de Thalès, tangente et Pythagore", "Angles et rayons, cercle circonscrit", "Deux tangentes, aires, angle droit découpé"],
  });
})();

// Chantier 11e · 8. Thalès (18.11, lot suivant du plan de cheminement) : une seule source pour thales, thalesrec, simil.
// Même standard que ch11_gm.js : au moins 3 formes par niveau, pas à pas, erreurs typiques, ctx, figures ; défis.
// Pas de leçon active nouvelle (règle du 18.11 : stabiliser la manipulation d'abord).
(function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const r6 = (v) => +(+v).toFixed(6);
  const N = (v) => String(r6(v)).replace(".", "{,}");
  const T = (v) => M(N(v));
  const keep = (value, traps) => { const seen = new Set(); return (traps || []).filter((t) => t && isFinite(t.v) && Math.abs(t.v - value) > 1e-9 && !seen.has(r6(t.v)) && seen.add(r6(t.v))); };
  const Qv = (q, value, sol, o = {}) => { const x = { q, spec: Object.assign({ kind: "value", value }, o.round ? { round: o.round } : {}), sol, guide: o.guide, traps: keep(value, o.traps), ctx: o.ctx }; if (o.fig) x.fig = o.fig; return x; };
  const TR = TRAP;
  const P = (q, parts, hints, sol, fig) => ({ fig, q, parts: parts.map(([label, value, round]) => ({ label, spec: Object.assign({ kind: "value", value }, round ? { round } : {}) })), hints, sol });
  const cfg = M("D \\in [AB]") + ", " + M("E \\in [AC]") + " et " + M("(DE) \\parallel (BC)");
  const L = (v) => N(v).replace("{,}", ",");

  // ===================== thales =====================
  const TH = {
    1: [
      () => { const k = pk([2, 3, 4]), ad = R.int(2, 6), de = R.int(2, 7), ab = ad * k, bc = de * k;
        return Qv("Dans un triangle " + M("ABC") + ", " + cfg + ". On sait que " + M("AD = " + ad) + ", " + M("AB = " + ab) + " et " + M("BC = " + bc) + " (en cm). Calcule " + M("DE") + ".", de,
          M("\\frac{AD}{AB} = \\frac{DE}{BC}") + ", donc " + M("DE = " + bc + " \\cdot \\frac{" + ad + "}{" + ab + "} = " + de) + " cm.",
          { ctx: "DE", fig: GF.thales(1 / k, { AD: ad + "", DE: "?", BC: bc + ""}), guide: [GS("Rapport d'agrandissement du petit triangle " + M("ADE") + " au grand " + M("ABC") + " : " + M("AB : AD") + " = ?", k, M(ab + " : " + ad + " = " + k) + "."), GS(M("DE = BC : " + k) + " = ?", de, M(bc + " : " + k + " = " + de) + " cm.")],
            traps: [TR(bc * k, "Le petit côté DE est plus court que BC : on divise par " + k + "."), TR(bc - (ab - ad), "Thalès conserve les rapports, pas les différences.")] }); },
      () => { const k = pk([2, 3, 4, 5]), ad = R.int(2, 6), ae = R.int(2, 7), ab = ad * k, ac = ae * k; if (ad === ae) return null;
        return Qv("Dans un triangle " + M("ABC") + ", " + cfg + ". " + M("AD = " + ad) + ", " + M("AB = " + ab) + " et " + M("AC = " + ac) + " (en cm). Calcule " + M("AE") + ".", ae,
          M("\\frac{AE}{AC} = \\frac{AD}{AB}") + ", donc " + M("AE = " + ac + " \\cdot \\frac{" + ad + "}{" + ab + "} = " + ae) + " cm.",
          { ctx: "AE", fig: GF.thales(1 / k, { AD: ad + "", AE: "?"}), guide: [GS("Rapport " + M("\\frac{AD}{AB}") + " (fraction ou décimal) ?", ad / ab, M("\\frac{" + ad + "}{" + ab + "} = \\frac{1}{" + k + "}") + "."), GS(M("AE = AC \\cdot \\frac{1}{" + k + "}") + " = ?", ae, M(ae) + " cm.")],
            traps: [TR(ac * k, "AE est une partie de AC : il est plus court."), TR(ac - (ab - ad), "Les longueurs ne diminuent pas de la même quantité, mais dans le même rapport.")] }); },
      () => { const b = pk([1, 1.2, 1.5, 2]), o = pk([1.5, 2, 2.5]), m = R.int(4, 12), O = m * o, H = r6(b * m), x = pk([["un arbre", "arbre"], ["un immeuble", "immeuble"], ["un mât", "mat"]]);
        return Qv("Un bâton vertical de " + T(b) + " m a une ombre de " + T(o) + " m. Au même moment, l'ombre d'" + x[0] + " mesure " + T(O) + " m. Quelle est la hauteur d'" + x[0] + " (en m) ?", H,
          "Les rayons du soleil sont parallèles : " + M("\\frac{H}{" + N(b) + "} = \\frac{" + N(O) + "}{" + N(o) + "} = " + m) + ", donc " + M("H = " + N(H)) + " m.",
          { ctx: x[1], fig: GF.shadows(b, o, O, { h: L(b) + " m", s: L(o) + " m", S: L(O) + " m", H: "?" }), guide: [GS("Combien de fois l'ombre de l'objet est-elle plus longue que celle du bâton ?", m, M(N(O) + " : " + N(o) + " = " + m) + "."), GS("Hauteur ?", H, M(m + " \\cdot " + N(b) + " = " + N(H)) + " m.")],
            traps: [TR(r6(O * o / b), "Le rapport se calcule sur les ombres (" + L(O) + " ÷ " + L(o) + "), puis s'applique au bâton."), TR(r6(b + O - o), "Thalès conserve les rapports, pas les différences.")] }); },
    ],
    2: [
      () => { const k = pk([2, 3, 4]), ad = R.int(2, 6), db = ad * (k - 1), ae = R.int(2, 8), ac = ae * k; if (ad === ae) return null;
        return Qv("Dans un triangle " + M("ABC") + ", " + cfg + ". " + M("AD = " + ad) + ", " + M("DB = " + db) + " et " + M("AE = " + ae) + " (en cm). Calcule " + M("AC") + ".", ac,
          M("AB = " + ad + " + " + db + " = " + ad * k) + " ; " + M("\\frac{AC}{AE} = \\frac{AB}{AD} = " + k) + ", donc " + M("AC = " + ac) + " cm.",
          { ctx: "DB", fig: GF.thales(1 / k, { AD: ad + "", DB: db + "", AE: ae + ""}), guide: [GS("D'abord " + M("AB = AD + DB") + " = ?", ad * k, M(ad * k) + " cm."), GS("Rapport " + M("AB : AD") + " ?", k, M(k) + "."), GS(M("AC = AE \\cdot " + k) + " = ?", ac, M(ac) + " cm.")],
            traps: [TR(ae * (k - 1), "Ça, c'est EC ; on demande AC = AE + EC.")] }); },
      () => { const k = pk([1.5, 2.5]), ad = 2 * R.int(1, 5), de = 2 * R.int(1, 6), ab = r6(ad * k), bc = r6(de * k);
        return Qv("Dans un triangle " + M("ABC") + ", " + cfg + ". " + M("AD = " + ad) + ", " + M("AB = " + N(ab)) + " et " + M("DE = " + de) + " (en cm). Calcule " + M("BC") + ".", bc,
          M("\\frac{BC}{DE} = \\frac{AB}{AD} = \\frac{" + N(ab) + "}{" + ad + "} = " + N(k)) + ", donc " + M("BC = " + de + " \\cdot " + N(k) + " = " + N(bc)) + " cm.",
          { ctx: "decimal", fig: GF.thales(1 / k, { AD: ad + "", DE: de + "", BC: "?" }), guide: [GS("Rapport " + M("AB : AD") + " ?", k, M(N(ab) + " : " + ad + " = " + N(k)) + "."), GS(M("BC") + " = ?", bc, M(N(bc)) + " cm.")],
            traps: [TR(r6(de / k), "BC est le grand côté : on multiplie par le rapport."), TR(r6(de + ab - ad), "Rapports, pas différences.")] }); },
      () => { const k = pk([2, 3]), ad = R.int(2, 5), ae = R.int(2, 6), de = R.int(2, 6); if (ad === ae) return null;
        return Qv("Les droites " + M("(BD)") + " et " + M("(CE)") + " se coupent en " + M("A") + " (configuration « papillon »), avec " + M("(DE) \\parallel (BC)") + ". " + M("AD = " + ad) + ", " + M("AB = " + ad * k) + " et " + M("DE = " + de) + ". Calcule " + M("BC") + ".", de * k,
          "Même propriété que dans le triangle : " + M("\\frac{BC}{DE} = \\frac{AB}{AD} = " + k) + ", donc " + M("BC = " + de * k) + ".",
          { ctx: "papillon", guide: [GS("Rapport " + M("AB : AD") + " ?", k, M(k) + "."), GS(M("BC") + " = ?", de * k, M(de * k) + ".")], traps: [TR(de / k, "AB est plus long que AD : BC est plus long que DE.")] }); },
    ],
    3: [
      () => { const k = pk([2, 3]), ad = R.int(2, 5), ae = R.int(2, 6), de = R.int(2, 6), ab = ad * k, ac = ae * k, bc = de * k; if (ad === ae || ae === de) return null;
        const per = (ab - ad) + bc + (ac - ae) + de;
        return Qv("Dans un triangle " + M("ABC") + ", " + cfg + ". " + M("AD = " + ad) + ", " + M("AB = " + ab) + ", " + M("AE = " + ae) + " et " + M("DE = " + de) + " (en cm). Calcule le périmètre du trapèze " + M("DECB") + ".", per,
          M("BC = " + de + " \\cdot " + k + " = " + bc) + ", " + M("AC = " + ac) + " ; " + M("DB = " + (ab - ad)) + ", " + M("EC = " + (ac - ae)) + " ; périmètre " + M((ab - ad) + " + " + bc + " + " + (ac - ae) + " + " + de + " = " + per) + " cm.",
          { ctx: "trapeze", fig: GF.thales(1 / k, { AD: ad + "", AE: ae + "", DE: de + ""}), guide: [GS("Rapport " + M("AB : AD") + " ?", k, M(k) + "."), GS(M("BC") + " = ?", bc, M(bc) + " cm."), GS(M("EC = AC - AE") + " = ?", ac - ae, M(ac - ae) + " cm."), GS("Périmètre " + M("DB + BC + CE + ED") + " ?", per, M(per) + " cm.")],
            traps: [TR(ab + bc + ac, "C'est le périmètre du grand triangle ; le trapèze a pour côtés DB, BC, CE et ED."), TR(per - de, "N'oublie pas le côté DE.")] }); },
      () => { const x = pk([["Pour mesurer la largeur d'une rivière, on plante des piquets", "riviere"], ["Pour estimer la largeur d'un étang, on construit une figure au sol", "etang"]]), ad = pk([4, 5, 6]), db = pk([10, 12, 15, 20]), de = pk([3, 4, 5]), bc = r6(de * (ad + db) / ad);
        return Qv(x[0] + " : " + M("A") + ", " + M("D") + ", " + M("B") + " alignés, " + M("(DE) \\parallel (BC)") + ", avec " + M("AD = " + ad) + " m, " + M("DB = " + db) + " m (la largeur cherchée est " + M("BC") + ") et " + M("DE = " + de) + " m. Calcule " + M("BC") + " (au dixième).", bc,
          M("AB = " + (ad + db)) + " ; " + M("BC = " + de + " \\cdot \\frac{" + (ad + db) + "}{" + ad + "} \\approx " + N(Math.round(bc * 10) / 10)) + " m.",
          { ctx: x[1], round: 0.1, fig: GF.thales(ad / (ad + db), { AD: ad + " m", DB: db + " m", DE: de + " m", BC: "?" }), guide: [GS(M("AB") + " = ?", ad + db, M(ad + db) + " m."), GS(M("BC = DE \\cdot \\frac{AB}{AD}") + " (au dixième) ?", bc, M(N(Math.round(bc * 10) / 10)) + " m.")], traps: [TR(r6(de * db / ad), "Le rapport est AB / AD (AB = AD + DB), pas DB / AD.")] }); },
      () => { const ad = R.int(2, 9), k = pk([2, 3, 4]), db = ad * (k - 1), ae = R.int(2, 9), ec = ae * (k - 1); if (ad === ae) return null;
        return Qv("Dans un triangle " + M("ABC") + ", " + cfg + ". " + M("AD = x") + ", " + M("DB = " + db) + ", " + M("AE = " + ae) + " et " + M("EC = " + ec) + ". Que vaut " + M("x") + " ?", ad,
          M("\\frac{AD}{DB} = \\frac{AE}{EC}") + " : " + M("\\frac{x}{" + db + "} = \\frac{" + ae + "}{" + ec + "}") + ", donc " + M("x = " + db + " \\cdot \\frac{" + ae + "}{" + ec + "} = " + ad) + ".",
          { ctx: "equation", fig: GF.thales(1 / k, { AD: "x", DB: db + "", AE: ae + "", EC: ec + "" }), guide: [GS("Rapport " + M("\\frac{AE}{EC}") + " (fraction ou décimal) ?", ae / ec, M("\\frac{" + ae + "}{" + ec + "}") + "."), GS(M("x = " + db + " \\cdot \\frac{AE}{EC}") + " = ?", ad, M("x = " + ad) + ".")], traps: [TR(r6(db * ec / ae), "Même ordre dans les deux rapports : AD/DB = AE/EC.")] }); },
    ],
  };

  // ===================== thalesrec =====================
  const REC = {
    1: [
      () => { const k = pk([2, 3, 4, 1.5, 2.5]), ad = 2 * R.int(1, 5), ae = 2 * R.int(1, 5), ab = r6(ad * k); if (ad === ae) return null;
        return Qv(M("A") + ", " + M("D") + ", " + M("B") + " et " + M("A") + ", " + M("E") + ", " + M("C") + " sont alignés dans cet ordre. " + M("AD = " + ad) + ", " + M("AB = " + N(ab)) + " et " + M("AE = " + ae) + ". Quelle longueur " + M("AC") + " faut-il pour que " + M("(DE) \\parallel (BC)") + " ?", r6(ae * k),
          "Il faut " + M("\\frac{AE}{AC} = \\frac{AD}{AB}") + ", donc " + M("AC = " + ae + " \\cdot \\frac{" + N(ab) + "}{" + ad + "} = " + N(ae * k)) + " (réciproque de Thalès).",
          { ctx: "AC", guide: [GS("Rapport " + M("AB : AD") + " ?", k, M(N(k)) + "."), GS(M("AC = AE \\cdot") + " ce rapport = ?", r6(ae * k), M(N(ae * k)) + ".")], traps: [TR(r6(ae / k), "AC est plus long que AE : on multiplie.")] }); },
      () => { const cs = [0, 1, 2, 3].map(() => { const k = pk([2, 3, 1.5, 2.5]), a = 2 * R.int(1, 5), b = 2 * R.int(1, 5), ok = R.rand() < 0.5; return [a, r6(a * k), b, r6(b * k) + (ok ? 0 : pk([-1, 1])), ok]; }), n = cs.filter((c) => c[4]).length;
        return Qv("Dans chaque cas, " + M("D \\in [AB]") + " et " + M("E \\in [AC]") + ". Combien de cas donnent " + M("(DE) \\parallel (BC)") + " ? " + cs.map((c, i) => "(" + (i + 1) + ") " + M("AD = " + c[0] + ", AB = " + N(c[1]) + ", AE = " + c[2] + ", AC = " + N(c[3]))).join(" ; "), n,
          cs.map((c, i) => "(" + (i + 1) + ") " + M("\\frac{" + c[0] + "}{" + N(c[1]) + "}" + (c[4] ? " = " : " \\neq ") + "\\frac{" + c[2] + "}{" + N(c[3]) + "}")).join(" ; ") + " : " + n + " cas.",
          { ctx: "compter", guide: [GS("Cas (1) : " + M("\\frac{AD}{AB}") + " en décimal ?", r6(cs[0][0] / cs[0][1]), M(N(Math.round(cs[0][0] / cs[0][1] * 1e4) / 1e4)) + ".", 0.001), GS("Compare avec " + M("\\frac{AE}{AC}") + " dans chaque cas. Nombre de cas parallèles ?", n, n + ".")],
            traps: [TR(4, "Un écart, même petit, entre les rapports suffit : les droites ne sont pas parallèles."), TR(n === 0 ? 1 : n - 1, "Vérifie chaque égalité de rapports.")] }); },
      () => { const k = pk([2, 3, 4]), ad = R.int(2, 6), ae = R.int(2, 6), ac = ae * k; if (ad === ae) return null;
        return Qv(M("D \\in [AB]") + ", " + M("E \\in [AC]") + ", " + M("AD = " + ad) + ", " + M("AE = " + ae) + " et " + M("AC = " + ac) + ". Quelle longueur " + M("AB") + " faut-il pour que " + M("(DE) \\parallel (BC)") + " ?", ad * k,
          M("\\frac{AB}{AD} = \\frac{AC}{AE} = " + k) + " : " + M("AB = " + ad * k) + ".", { ctx: "AB", guide: [GS("Rapport " + M("AC : AE") + " ?", k, M(k) + "."), GS(M("AB") + " = ?", ad * k, M(ad * k) + ".")], traps: [TR(ad + ac - ae, "Rapports égaux, pas différences égales.")] }); },
      () => { const [ad, ab, ae, ac, ok] = pk([[1.2, 3, 1.6, 4, 1], [0.9, 3, 1.2, 4, 1], [1.5, 4, 2, 5, 0], [0.8, 2, 1.4, 3.5, 1], [1.1, 2.5, 1.5, 3, 0]]), x = pk([["Sur la charpente d'un toit, ", "toit"], ["Sur une étagère vue de profil, ", "etagere"]]);
        return Qv(x[0] + "on mesure " + M("AD = " + N(ad)) + " m et " + M("AB = " + N(ab)) + " m sur un montant, " + M("AE = " + N(ae)) + " m et " + M("AC = " + N(ac)) + " m sur l'autre. Calcule le rapport " + M("\\frac{AD}{AB}") + " en nombre décimal : si " + M("\\frac{AE}{AC}") + " a la même valeur, la traverse " + M("(DE)") + " est parallèle à " + M("(BC)") + ".", r6(ad / ab),
          M("\\frac{" + N(ad) + "}{" + N(ab) + "} = " + N(ad / ab)) + " et " + M("\\frac{" + N(ae) + "}{" + N(ac) + "} = " + N(ae / ac)) + (ok ? " : égaux, la traverse est parallèle (réciproque de Thalès)." : " : différents, la traverse n'est pas parallèle."),
          { ctx: x[1], guide: [GS(M("\\frac{AE}{AC}") + " (décimal) ?", r6(ae / ac), M(N(ae / ac)) + "."), GS(M("\\frac{AD}{AB}") + " (décimal) ?", r6(ad / ab), M(N(ad / ab)) + (ok ? " : même valeur, la traverse est parallèle." : " : valeur différente, la traverse n'est pas parallèle."))], traps: [TR(r6(ab / ad), "On divise AD par AB (le petit par le grand)."), TR(r6(ad / ae), "Le rapport compare deux longueurs du MÊME côté : AD et AB.")] }); },
    ],
    2: [
      () => { const [ad, ab, ae] = pk([[2.4, 6, 3], [1.8, 4.5, 2], [3.2, 8, 2.5], [1.5, 6, 2.2]]), ac = r6(ae * ab / ad);
        return Qv(M("D \\in [AB]") + ", " + M("E \\in [AC]") + ", " + M("AD = " + N(ad)) + ", " + M("AB = " + N(ab)) + " et " + M("AE = " + N(ae)) + " (en cm). Quelle doit être " + M("AC") + " pour que " + M("(DE) \\parallel (BC)") + " ?", ac,
          M("\\frac{AD}{AB} = \\frac{" + N(ad) + "}{" + N(ab) + "} = " + N(ad / ab)) + " ; " + M("AC = " + N(ae) + " : " + N(ad / ab) + " = " + N(ac)) + " cm.",
          { ctx: "decimaux", guide: [GS("Rapport " + M("\\frac{AD}{AB}") + " en décimal ?", r6(ad / ab), M(N(ad / ab)) + "."), GS(M("AC = AE :") + " ce rapport = ?", ac, M(N(ac)) + " cm.")], traps: [TR(r6(ae * ad / ab), "AC est plus long que AE : on divise par le rapport (plus petit que 1).")] }); },
      () => { const [a, b, c, d] = pk([[3, 7, 4, 10], [4, 9, 5, 12], [2, 5, 3, 9], [5, 12, 3, 8], [4, 11, 3, 9]]) /* 24.11 : écart 2 à 4, jamais ±1 (robot) */;
        return Qv(M("D \\in [AB]") + " et " + M("E \\in [AC]") + " avec " + M("AD = " + a) + ", " + M("AB = " + b) + ", " + M("AE = " + c) + ", " + M("AC = " + d) + ". Calcule " + M("AD \\cdot AC - AE \\cdot AB") + ". (Si ce n'est pas 0, les droites " + M("(DE)") + " et " + M("(BC)") + " ne sont pas parallèles.)", a * d - c * b,
          M(a + " \\cdot " + d + " - " + c + " \\cdot " + b + " = " + (a * d - c * b)) + " ≠ 0 : les rapports sont différents, " + M("(DE)") + " et " + M("(BC)") + " ne sont pas parallèles (contraposée de Thalès).",
          { ctx: "contraposee", guide: [GS(M("AD \\cdot AC") + " = ?", a * d, M(a * d) + "."), GS(M("AE \\cdot AB") + " = ?", c * b, M(c * b) + "."), GS("Différence ?", a * d - c * b, M(a * d - c * b) + ".")], traps: [TR(c * b - a * d, "Dans l'ordre demandé : AD · AC − AE · AB.")] }); },
      () => { const k = pk([2, 3]), ad = R.int(2, 6), ae = R.int(2, 6); if (ad === ae) return null;
        return Qv("Configuration « papillon » : " + M("(BD)") + " et " + M("(CE)") + " se coupent en " + M("A") + ", avec " + M("AD = " + ad) + ", " + M("AB = " + ad * k) + " et " + M("AE = " + ae) + ". Quelle longueur " + M("AC") + " faut-il pour que " + M("(DE) \\parallel (BC)") + " ?", ae * k,
          M("\\frac{AC}{AE} = \\frac{AB}{AD} = " + k) + " : " + M("AC = " + ae * k) + ".", { ctx: "papillon", guide: [GS("Rapport ?", k, M(k) + "."), GS(M("AC") + " = ?", ae * k, M(ae * k) + ".")], traps: [TR(ae / k, "AB est plus long que AD, donc AC plus long que AE.")] }); },
    ],
    3: [
      () => { const k = pk([2, 3, 4]), ad = R.int(2, 5), ae = R.int(2, 6), bc = 2 * R.int(3, 9); if (ad === ae) return null;
        return Qv(M("D \\in [AB]") + ", " + M("E \\in [AC]") + ", " + M("AD = " + ad) + ", " + M("AB = " + ad * k) + ", " + M("AE = " + ae) + ", " + M("AC = " + ae * k) + " et " + M("BC = " + bc) + ". Montre que " + M("(DE) \\parallel (BC)") + ", puis calcule " + M("DE") + ".", r6(bc / k),
          M("\\frac{AD}{AB} = \\frac{AE}{AC} = \\frac{1}{" + k + "}") + " : parallèles (réciproque). Puis " + M("DE = " + bc + " : " + k + " = " + N(bc / k)) + ".",
          { ctx: "prouver-calculer", fig: GF.thales(1 / k, { AD: ad + "", AE: ae + "", BC: bc + "", DE: "?" }), guide: [GS(M("\\frac{AD}{AB}") + " = ? (fraction)", 1 / k, M("\\frac{1}{" + k + "}") + "."), GS(M("\\frac{AE}{AC}") + " = ? (même valeur : parallèles)", 1 / k, M("\\frac{1}{" + k + "}") + "."), GS(M("DE") + " = ?", r6(bc / k), M(N(bc / k)) + ".")], traps: [TR(bc * k, "DE est le petit côté : on divise.")] }); },
      () => { const ad = R.int(2, 6), db = R.int(3, 9), ae = R.int(2, 6); if (ad === ae) return null; const ec = r6(ae * db / ad);
        return Qv(M("D \\in [AB]") + ", " + M("E \\in [AC]") + ", " + M("AD = " + ad) + ", " + M("DB = " + db) + ", " + M("AE = " + ae) + ". Quelle longueur " + M("EC") + " faut-il pour que " + M("(DE) \\parallel (BC)") + " ? (fraction ou décimal)", ec,
          M("\\frac{EC}{AE} = \\frac{DB}{AD}") + " : " + M("EC = " + ae + " \\cdot \\frac{" + db + "}{" + ad + "} = " + N(ec)) + ".", { ctx: "EC", fig: GF.thales(ad / (ad + db), { AD: ad + "", DB: db + "", AE: ae + "", EC: "?" }), guide: [GS("Rapport " + M("\\frac{DB}{AD}") + " ?", db / ad, M("\\frac{" + db + "}{" + ad + "}") + "."), GS(M("EC") + " = ?", ec, M(N(ec)) + ".")], traps: [TR(r6(ae * ad / db), "Même ordre : DB/AD = EC/AE.")] }); },
      () => { const cs = [0, 1, 2, 3].map(() => { const k = pk([1.25, 1.5, 2.5, 0.8].filter((x) => x > 1)), a = R.int(2, 9), b = R.int(2, 9), ok = R.rand() < 0.5; return [a, r6(a * k), b, r6(b * k + (ok ? 0 : pk([-0.1, 0.1, 0.2]))), ok]; }), n = cs.filter((c) => c[4]).length;
        return Qv("Combien de ces configurations donnent " + M("(DE) \\parallel (BC)") + " ? " + cs.map((c, i) => "(" + (i + 1) + ") " + M("AD = " + c[0] + ", AB = " + N(c[1]) + ", AE = " + c[2] + ", AC = " + N(c[3]))).join(" ; "), n,
          cs.map((c, i) => "(" + (i + 1) + ") " + M(c[0] + " \\cdot " + N(c[3]) + (c[4] ? " = " : " \\neq ") + c[2] + " \\cdot " + N(c[1]))).join(" ; ") + " (produits en croix) : " + n + ".",
          { ctx: "compter-decimaux", fig: GF.thales(0.45, { AD: "AD", AE: "AE" }), guide: [GS("Astuce : compare les produits en croix " + M("AD \\cdot AC") + " et " + M("AE \\cdot AB") + ". Cas (1) : " + M("AD \\cdot AC") + " = ?", r6(cs[0][0] * cs[0][3]), M(N(cs[0][0] * cs[0][3])) + "."), GS("Nombre de cas parallèles ?", n, n + ".")], traps: [TR(4, "Un petit écart suffit : pas parallèles."), TR(n === 0 ? 1 : n - 1, "Vérifie chaque cas.")] }); },
      () => { const k = pk([1.5, 2.5, 2, 3]), ad = R.int(2, 6), ae = R.int(2, 6), de = R.int(2, 7); if (ad === ae) return null; const ab = r6(ad * k), ac = r6(ae * k), bc = r6(de * k);
        return Qv("Configuration « papillon » : " + M("(BD)") + " et " + M("(CE)") + " se coupent en " + M("A") + ". " + M("AD = " + ad) + ", " + M("AB = " + N(ab)) + ", " + M("AE = " + ae) + ", " + M("AC = " + N(ac)) + " et " + M("DE = " + de) + ". Vérifie que " + M("(DE) \\parallel (BC)") + ", puis calcule " + M("BC") + ".", bc,
          M("\\frac{AB}{AD} = \\frac{AC}{AE} = " + N(k)) + " : parallèles (réciproque). " + M("BC = " + de + " \\cdot " + N(k) + " = " + N(bc)) + ".",
          { ctx: "papillon-BC", guide: [GS(M("\\frac{AB}{AD}") + " (décimal) ?", k, M(N(k)) + "."), GS(M("\\frac{AC}{AE}") + " (même valeur : parallèles) ?", k, M(N(k)) + "."), GS(M("BC") + " = ?", bc, M(N(bc)) + ".")], traps: [TR(r6(de / k), "BC est du côté des grandes longueurs (AB, AC) : on multiplie."), TR(r6(de + ab - ad), "Thalès conserve les rapports, pas les différences.")] }); }
    ],
  };

  // ===================== simil =====================
  const SIM = {
    1: [
      () => { const k = pk([1.5, 2, 2.5, 3]), a = R.int(2, 8), b = R.int(3, 9), c = R.int(3, 9);
        return Qv("Deux triangles sont semblables. Les côtés du petit mesurent " + M(a) + ", " + M(b) + " et " + M(c) + " cm. Le côté du grand qui correspond à " + M(a) + " cm mesure " + T(a * k) + " cm. Combien mesure le côté du grand qui correspond à " + M(b) + " cm ?", r6(b * k),
          "Rapport " + M(N(a * k) + " : " + a + " = " + N(k)) + " ; " + M(b + " \\cdot " + N(k) + " = " + N(b * k)) + " cm.",
          { ctx: "cote", fig: FIG.simTri([a, b, c].map((v) => v + ""), [L(a * k), "?", ""]), guide: [GS("Rapport d'agrandissement ?", k, M(N(k)) + "."), GS("Côté cherché ?", r6(b * k), M(N(b * k)) + " cm.")], traps: [TR(b + a * k - a, "On multiplie par le rapport, on n'ajoute pas la différence.")] }); },
      () => { const a = R.int(2, 9), k = pk([2, 3, 1.5, 2.5, 4]);
        return Qv("Un triangle est agrandi : un côté de " + M(a) + " cm devient " + T(a * k) + " cm. Quel est le rapport d'agrandissement ?", k, M(N(a * k) + " : " + a + " = " + N(k)) + ".",
          { ctx: "rapport", guide: [GS("Le rapport, c'est nouvelle longueur ÷ ancienne : " + M(N(a * k) + " : " + a) + " = ?", k, M(N(k)) + ".")], traps: [TR(r6(1 / k), "Grande ÷ petite pour un agrandissement."), TR(r6(a * k - a), "C'est l'augmentation de longueur, pas le rapport.")] }); },
      () => { const e = pk([25000, 50000, 10000, 20000]), c = pk([3, 4, 6, 8, 2.5]), m = r6(c * e / 100);
        return Qv("Sur une carte à l'échelle " + M("1\\,:\\," + String(e).replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}")) + ", deux villages sont à " + T(c) + " cm. Quelle est la distance réelle, en m ?", m,
          M(N(c) + " \\cdot " + e + " = " + N(c * e)) + " cm, soit " + M(N(m)) + " m.", { ctx: "carte", guide: [GS("Distance réelle en cm ?", r6(c * e), M(N(c * e)) + " cm."), GS("En m (÷ 100) ?", m, M(N(m)) + " m.")], traps: [TR(r6(c * e), "Convertis les cm en m."), TR(r6(c * e / 100000), "Ça, ce sont des km ; on demande des m.")] }); },
    ],
    2: [
      () => { const k = pk([1.5, 2, 2.5, 3, 4]), A = R.int(3, 20);
        return Qv("On agrandit une figure de rapport " + T(k) + ". Son aire était de " + M(A) + " cm². Quelle est la nouvelle aire (en cm²) ?", r6(A * k * k), "Les aires sont multipliées par " + M(N(k) + "^2 = " + N(k * k)) + " : " + M(A + " \\cdot " + N(k * k) + " = " + N(A * k * k)) + " cm².",
          { ctx: "aire", fig: FIG.scaling(k, ""), guide: [GS("Les aires sont multipliées par " + M("k^2") + ". " + M(N(k) + "^2") + " = ?", r6(k * k), M(N(k * k)) + "."), GS("Nouvelle aire ?", r6(A * k * k), M(N(A * k * k)) + " cm².")], traps: [TR(r6(A * k), "Les aires ne sont pas multipliées par k, mais par k²."), TR(r6(A * k * k * k), "k³, c'est pour les volumes.")] }); },
      () => { const k = pk([2, 3, 4, 5]), A = R.int(2, 12);
        return Qv("Deux figures semblables ont pour aires " + M(A) + " cm² et " + M(A * k * k) + " cm². Quel est le rapport d'agrandissement des longueurs ?", k, "Rapport des aires " + M(A * k * k + " : " + A + " = " + k * k) + " = " + M("k^2") + ", donc " + M("k = " + k) + ".",
          { ctx: "kdepuisaire", guide: [GS("Rapport des aires ?", k * k, M(k * k) + "."), GS("Les longueurs : racine carrée. " + M("k") + " = ?", k, M("\\sqrt{" + k * k + "} = " + k) + ".")], traps: [TR(k * k, "C'est le rapport des aires ; celui des longueurs est sa racine carrée.")] }); },
      () => { const k = pk([1.5, 2, 2.5, 3]), p = R.int(12, 40);
        return Qv("Un polygone de périmètre " + M(p) + " cm est agrandi de rapport " + T(k) + ". Quel est le nouveau périmètre (en cm) ?", r6(p * k), "Les longueurs (et donc le périmètre) sont multipliées par " + M(N(k)) + " : " + M(N(p * k)) + " cm.",
          { ctx: "perimetre", guide: [GS("Le périmètre est une longueur : multiplié par " + M("k") + " ou " + M("k^2") + " ? Tape le facteur.", k, M(N(k)) + "."), GS("Nouveau périmètre ?", r6(p * k), M(N(p * k)) + " cm.")], traps: [TR(r6(p * k * k), "k², c'est pour les aires ; le périmètre est une longueur.")] }); },
    ],
    3: [
      () => { const e = pk([10, 20, 50]), V = R.int(2, 12);
        return Qv("Une maquette est à l'échelle " + M("1\\,:\\," + e) + ". Son volume est de " + M(V) + " cm³. Quel est le volume réel, en litres ?", (V * e ** 3) / 1000, "Les volumes sont multipliés par " + M(e + "^3 = " + N(e ** 3)) + " : " + M(V + " \\cdot " + N(e ** 3) + " = " + N(V * e ** 3)) + " cm³ " + M("= " + N((V * e ** 3) / 1000)) + " L.",
          { ctx: "maquette", guide: [GS("Facteur des volumes " + M(e + "^3") + " ?", e ** 3, M(N(e ** 3)) + "."), GS("Volume réel en cm³ ?", V * e ** 3, M(N(V * e ** 3)) + " cm³."), GS("En litres (÷ 1000) ?", (V * e ** 3) / 1000, M(N((V * e ** 3) / 1000)) + " L.")], traps: [TR((V * e * e) / 1000, "Les volumes sont multipliés par k³."), TR(V * e ** 3, "Convertis en litres (1 L = 1000 cm³).")] }); },
      () => { const k = pk([2, 3, 4]), A = R.int(2, 12), p = A + R.int(5, 9);
        return Qv("Deux figures semblables ont pour aires " + M(A) + " cm² et " + M(A * k * k) + " cm². Le périmètre de la petite est " + M(p) + " cm. Quel est le périmètre de la grande (en cm) ?", p * k,
          M("k^2 = " + k * k) + ", donc " + M("k = " + k) + " ; périmètre " + M(p + " \\cdot " + k + " = " + p * k) + " cm.", { ctx: "aire-perimetre", guide: [GS("Rapport des aires ?", k * k, M(k * k) + "."), GS(M("k") + " ?", k, M(k) + "."), GS("Périmètre de la grande ?", p * k, M(p * k) + " cm.")], traps: [TR(p * k * k, "Le périmètre est une longueur : × k, pas × k².")] }); },
      () => { const oa = R.int(2, 6), k = pk([2, 2.5, 3, 1.5]), ab = R.int(3, 8);
        return Qv("L'homothétie de centre " + M("O") + " et de rapport " + T(k) + " envoie " + M("A") + " sur " + M("A'") + " et " + M("B") + " sur " + M("B'") + ". " + M("OA = " + oa) + " cm et " + M("AB = " + ab) + " cm. Calcule " + M("AA'") + " (en cm).", r6(oa * (k - 1)),
          M("OA' = " + N(k) + " \\cdot " + oa + " = " + N(oa * k)) + ", donc " + M("AA' = OA' - OA = " + N(oa * (k - 1))) + " cm (" + M("A") + " et " + M("A'") + " sont du même côté de " + M("O") + ").",
          { ctx: "homothetie", guide: [GS(M("OA'") + " = ?", r6(oa * k), M(N(oa * k)) + " cm."), GS(M("AA' = OA' - OA") + " = ?", r6(oa * (k - 1)), M(N(oa * (k - 1))) + " cm.")], traps: [TR(r6(oa * k), "C'est OA' ; on demande la distance AA'."), TR(r6(ab * k), "AB n'intervient pas ici.")] }); },
    ],
  };

  const PROBS = {
    thales: [
      () => P("Un panneau de 2 m de haut a une ombre de 1,5 m. Au même moment, l'ombre d'une tour mesure 45 m.", [["a) Rapport entre les ombres", 30], ["b) Hauteur de la tour (m)", 60], ["c) Longueur de l'ombre d'un arbre de 9 m (m)", 6.75]], ["Les rayons du soleil sont parallèles.", "Hauteur ÷ ombre est le même pour tous : 2 ÷ 1,5."], "a) 30 ; b) 60 m ; c) " + M("9 \\cdot \\frac{1{,}5}{2} = 6{,}75") + " m."),
      () => P("Dans un triangle ABC, D ∈ [AB], E ∈ [AC], (DE) ∥ (BC) ; AD = 4, DB = 6, AE = 5, DE = 3.", [["a) AB", 10], ["b) AC", 12.5], ["c) BC", 7.5], ["d) Périmètre du trapèze DECB", 24]], ["AB = AD + DB ; rapport AB/AD.", "Trapèze : DB + BC + CE + ED."], "a) 10 ; b) 12,5 ; c) 7,5 ; d) " + M("6 + 7{,}5 + 7{,}5 + 3 = 24") + "."),
    ],
    thalesrec: [
      () => P("D ∈ [AB], E ∈ [AC] avec AD = 3, AB = 7,5, AE = 4, AC = 10.", [["a) AD/AB (décimal)", 0.4], ["b) AE/AC (décimal)", 0.4], ["c) Si BC = 12, que vaut DE ?", 4.8]], ["Rapports égaux : parallèles.", "DE = BC · 0,4."], "a) et b) 0,4, donc (DE) ∥ (BC) ; c) " + M("4{,}8") + "."),
      () => P("Pour vérifier qu'une étagère est parallèle au sol, on mesure : AD = 30 cm, AB = 75 cm sur un montant, AE = 32 cm, AC = 80 cm sur l'autre.", [["a) AD · AC", 2400], ["b) AE · AB", 2400], ["c) Différence (0 si parallèle)", 0]], ["Produits en croix.", "Égaux : réciproque de Thalès."], "Produits égaux (2400) : l'étagère est parallèle."),
    ],
    simil: [
      () => P("Une photo de 10 cm × 15 cm est agrandie en 25 cm de large.", [["a) Rapport d'agrandissement", 2.5], ["b) Nouvelle longueur (cm)", 37.5], ["c) Par combien l'aire est-elle multipliée ?", 6.25]], ["25 ÷ 10.", "Aire : k²."], "a) 2,5 ; b) 37,5 cm ; c) 6,25."),
      () => P("Une maquette de voiture est à l'échelle " + M("1\\,:\\,20") + ".", [["a) Longueur réelle si la maquette mesure 22 cm (m)", 4.4], ["b) Une vitre de 30 cm² sur la maquette : aire réelle (m²)", 1.2], ["c) Un réservoir de 6 cm³ sur la maquette : volume réel (L)", 48]], ["Longueurs × 20, aires × 400, volumes × 8000.", "1 m² = 10'000 cm² ; 1 L = 1000 cm³."], "a) 4,4 m ; b) 12'000 cm² = 1,2 m² ; c) 48'000 cm³ = 48 L."),
    ],
  };

  // « Trouve l'erreur » (24.11, chantier I) : rapport AD/DB au lieu de AD/AB.
  TH[2].push(() => { const k = R.pick([2, 3]), ad = R.int(2, 5), ab = ad * k, db = ab - ad, de = R.int(2, 6), bc = de * k, w = R.pick(["Sam", "Lina", "Noé", "Inès", "Yanis", "Léa"]), faux = r6((de * db) / ad);
    return Qv("Dans un triangle " + M("ABC") + ", " + cfg + ", avec " + M("AD = " + ad) + ", " + M("DB = " + db) + " et " + M("DE = " + de) + " (en cm). " + w + " écrit : « " + M("\\frac{AD}{DB} = \\frac{DE}{BC}") + ", donc " + M("BC = " + de + " \\cdot \\frac{" + db + "}{" + ad + "}") + " ». Trouve l'erreur, puis calcule " + M("BC") + ".", bc,
      "Erreur : Thalès compare le petit triangle " + M("ADE") + " au grand " + M("ABC") + " : " + M("\\frac{AD}{AB} = \\frac{DE}{BC}") + ", avec " + M("AB = AD + DB = " + ab) + ". Donc " + M("BC = " + de + " \\cdot \\frac{" + ab + "}{" + ad + "} = " + bc) + " cm.",
      { ctx: "erreur", fig: GF.thales(1 / k, { AD: ad + "", DB: db + "", DE: de + "", BC: "?" }), guide: [GS("Le grand triangle a pour côté " + M("AB = AD + DB") + " = ?", ab, M(ab) + " cm."), GS("Rapport d'agrandissement " + M("AB : AD") + " ?", k, M(k) + "."), GS(M("BC = DE \\cdot " + k) + " = ?", bc, M(bc) + " cm.")],
        traps: [TRAP(faux, "C'est le calcul de " + w + " : " + M("DB") + " n'est pas un côté du grand triangle, c'est " + M("AB") + " qu'il faut.")] }); });
  // « Trouve l'erreur » (24.11, chantier I, suite) : aire multipliée par k au lieu de k².
  SIM[2].push(() => { const k = pk([2, 3, 1.5, 2.5, 4]), A = 2 * R.int(3, 15), v = r6(A * k * k), faux = r6(A * k), w = R.pick(["Sam", "Lina", "Noé", "Inès", "Yanis", "Léa"]), c = pk([["Un logo", "logo"], ["Une photo", "photo"], ["Le dessin d'un jardin", "jardin"], ["Un panneau", "panneau"]]);
    return Qv(c[0] + " a une aire de " + M(A) + " cm². On l'agrandit : toutes les longueurs sont multipliées par " + M(N(k)) + ". " + w + " écrit : « nouvelle aire : " + M(A + " \\cdot " + N(k) + " = " + N(faux)) + " cm² ». Trouve l'erreur, puis donne la nouvelle aire (en cm²).", v,
      "Erreur : une aire est un produit de deux longueurs, et chacune est multipliée par " + M(N(k)) + " : l'aire est multipliée par " + M(N(k) + "^2 = " + N(k * k)) + ". " + M(A + " \\cdot " + N(k * k) + " = " + N(v)) + " cm².",
      { ctx: "erreur", guide: [GS("Par combien l'aire est-elle multipliée ? (" + M("k^2") + ")", k * k, M(N(k) + "^2 = " + N(k * k)) + "."), GS("Nouvelle aire ?", v, M(A + " \\cdot " + N(k * k) + " = " + N(v)) + " cm².")],
        traps: [TR(faux, "C'est le résultat de " + w + " : longueurs × " + N(k).replace("{,}", ",") + ", mais aires × " + N(k * k).replace("{,}", ",") + ".")] }); });
  const ALL = { thales: TH, thalesrec: REC, simil: SIM };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => pickForm(lv[Math.min(Math.max(d, 1), 3)]);
    if (typeof VAR !== "undefined") VAR[id] = {};
    if (typeof PROB !== "undefined") delete PROB[id];
    PROB_EXTRA[id] = PROBS[id];
  }
  Object.assign(HINTS_EXTRA, {
    thales: "Avec (DE) ∥ (BC) : AD/AB = AE/AC = DE/BC. Repère le petit et le grand triangle, puis applique le même rapport.",
    thalesrec: "Compare AD/AB et AE/AC (ou les produits en croix) : égaux → parallèles ; différents → pas parallèles.",
    simil: "Agrandissement de rapport k : longueurs × k, aires × k², volumes × k³.",
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    thales: ["Calculer une longueur, ombres", "Avec DB donné, décimaux, papillon", "Trapèze, rivière, équation"],
    thalesrec: ["Longueur pour avoir des parallèles", "Décimaux, contraposée, papillon", "Prouver puis calculer, produits en croix"],
    simil: ["Côté, rapport, échelle", "Aires et périmètres", "Volumes, homothétie"],
  });
})();

// Chantier 11e · 12. Probabilités (lot 1 du plan pas à pas, 19.11) : une seule source pour denombr et proba.
// Même standard que ch11_thales.js : au moins 3 formes par niveau, pas à pas (GS), erreurs typiques (traps), ctx, figures ; défis.
(function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const r6 = (v) => +(+v).toFixed(6);
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  // Fraction simplifiée en LaTeX ; « \frac{6}{36} = \frac{1}{6} » si simplifiable.
  const F = (a, b) => { const g = gcd(a, b), p = a / g, q = b / g; return q === 1 ? String(p) : "\\frac{" + p + "}{" + q + "}"; };
  const FS = (a, b) => (gcd(a, b) > 1 ? "\\frac{" + a + "}{" + b + "} = " + F(a, b) : F(a, b));
  const keep = (value, traps) => { const seen = new Set(); return (traps || []).filter((t) => t && isFinite(t.v) && Math.abs(t.v - value) > 1e-9 && !seen.has(r6(t.v)) && seen.add(r6(t.v))); };
  const Qv = (q, value, sol, o = {}) => { const x = { q, spec: { kind: "value", value }, sol, guide: o.guide, traps: keep(value, o.traps), ctx: o.ctx }; if (o.fig) x.fig = o.fig; return x; };
  const TR = TRAP;
  const P = (q, parts, hints, sol, fig) => ({ fig, q, parts: parts.map(([label, value]) => ({ label, spec: { kind: "value", value } })), hints, sol });
  const FA = " (fraction acceptée)";

  // Arbre de choix (a branches puis b branches) : montre la structure, jamais le total.
  const tree = (a, b, la, lb) => {
    const W = 300, H = 30 + Math.min(a * b, 12) * 13, sa = Math.min(a, 4), sb = Math.min(b, 3);
    let g = '<circle cx="20" cy="' + H / 2 + '" r="4" class="f-dot"/>', y = 0;
    const tot = sa * sb, step = (H - 20) / tot;
    for (let i = 0; i < sa; i++) {
      const yi = 10 + step * (i * sb + (sb - 1) / 2) + step / 2;
      g += '<line x1="20" y1="' + H / 2 + '" x2="120" y2="' + yi + '" class="f-line"/><circle cx="120" cy="' + yi + '" r="3" class="f-dot"/>';
      for (let j = 0; j < sb; j++) { y = 10 + step * (i * sb + j) + step / 2; g += '<line x1="120" y1="' + yi + '" x2="220" y2="' + y + '" class="f-line"/><circle cx="220" cy="' + y + '" r="3" class="f-dot"/>'; }
    }
    const txt = (x, yy, s) => '<text x="' + x + '" y="' + yy + '" class="f-txt" text-anchor="middle" font-size="11">' + s + "</text>";
    g += txt(120, H - 2, la + (a > sa ? " (…)" : "")) + txt(222, H - 2, lb + (b > sb ? " (…)" : ""));
    return '<svg viewBox="0 0 ' + W + " " + (H + 6) + '" role="img" aria-label="arbre de choix" class="fig">' + g + "</svg>";
  };

  // ===================== denombr =====================
  const DN = {
    1: [ // principe multiplicatif
      () => { const x = pk([["Un restaurant propose", "entrées", "plats", "desserts", "menus différents (entrée, plat, dessert)", "menu"], ["Pour t'habiller, tu as", "pantalons", "t-shirts", "paires de baskets", "tenues différentes (un de chaque)", "tenue"], ["Une pizzeria propose", "pâtes", "sauces", "garnitures", "pizzas différentes (une pâte, une sauce, une garniture)", "pizza"]]),
          a = R.int(2, 5), b = R.int(3, 6), c = R.int(2, 4), n = a * b * c;
        return Qv(x[0] + " " + M(a) + " " + x[1] + ", " + M(b) + " " + x[2] + " et " + M(c) + " " + x[3] + ". Combien de " + x[4] + " peut-on composer ?", n,
          "Arbre : " + M(a + " \\cdot " + b + " \\cdot " + c + " = " + n) + ".",
          { ctx: x[5], fig: tree(a, b, x[1], x[2]), guide: [GS("Nombre de choix pour les deux premiers éléments (" + x[1] + " et " + x[2] + ") ?", a * b, M(a + " \\cdot " + b + " = " + a * b) + "."), GS("Avec les " + x[3] + " ?", n, M(a * b + " \\cdot " + c + " = " + n) + ".")],
            traps: [TR(a + b + c, "On ne les additionne pas : chaque choix se combine avec tous les autres (arbre), on multiplie."), TR(a * b, "N'oublie pas le 3e choix (" + x[3] + ").")] }); },
      () => { const n = pk([4, 5, 6, 10]), k = pk([3, 4]), v = n ** k, x = pk([["Un cadenas a " + M(k) + " molettes portant chacune les chiffres de " + M(1) + " à " + M(n), "cadenas"], ["Un code secret est formé de " + M(k) + " symboles, chacun choisi parmi " + M(n) + " (on peut répéter)", "code"]]);
        if (n === 10 && k === 4) return null;
        return Qv(x[0] + ". Combien de codes différents existe-t-il ?", v, M(Array(k).fill(n).join(" \\cdot ") + " = " + n + "^" + k + " = " + v) + " codes.",
          { ctx: x[1], guide: [GS("Nombre de choix pour chaque position ?", n, M(n) + " (on peut répéter)."), GS("Nombre de codes : " + M(n + "^" + k) + " = ?", v, M(v) + ".")],
            traps: [TR(n * k, "On ne multiplie pas par le nombre de molettes : chaque molette multiplie les possibilités par " + n + "."), TR(k ** n, "C'est " + n + "^" + k + " : " + k + " positions, " + n + " choix chacune.")] }); },
      () => { const a = R.int(2, 4), b = R.int(3, 5), x = pk([["Pour aller de A à B, il y a " + M(a) + " chemins ; de B à C, il y a " + M(b) + " chemins. Combien de trajets différents de A à C passant par B ?", "chemins", "A → B", "B → C", "trajet"], ["Une glace : on choisit un cornet parmi " + M(a) + " et un parfum parmi " + M(b) + ". Combien de glaces différentes ?", "glaces", "cornet", "parfum", "glace"]]);
        return Qv(x[0], a * b, M(a + " \\cdot " + b + " = " + a * b) + " " + x[1] + ".",
          { ctx: x[4], fig: tree(a, b, x[2], x[3]), guide: [GS("Compte les branches au bout de l'arbre : " + M(a + " \\cdot " + b) + " = ?", a * b, M(a * b) + ".")], traps: [TR(a + b, "Chaque choix de la 1re étape se combine avec chaque choix de la 2e : on multiplie.")] }); },
    ],
    2: [ // sans répétition
      () => { const n = R.int(6, 12), v = n * (n - 1) * (n - 2);
        return Qv(M(n) + " coureurs participent à une course. Combien de podiums différents (or, argent, bronze) sont possibles ?", v, M(n + " \\cdot " + (n - 1) + " \\cdot " + (n - 2) + " = " + v) + " (un coureur ne peut pas avoir deux médailles).",
          { ctx: "podium", guide: [GS("Choix pour l'or ?", n, M(n) + "."), GS("Pour l'argent (l'or est déjà pris) ?", n - 1, M(n - 1) + "."), GS("Podiums : " + M(n + " \\cdot " + (n - 1) + " \\cdot " + (n - 2)) + " = ?", v, M(v) + ".")],
            traps: [TR(n ** 3, "Sans répétition : un coureur déjà médaillé ne peut plus l'être, le nombre de choix diminue."), TR(3 * n, "On multiplie les choix à chaque étape.")] }); },
      () => { const n = R.int(18, 26), v = n * (n - 1);
        return Qv("Une classe de " + M(n) + " élèves élit un délégué et un suppléant (deux personnes différentes). Combien de choix sont possibles ?", v, M(n + " \\cdot " + (n - 1) + " = " + v) + ".",
          { ctx: "election", guide: [GS("Choix du délégué ?", n, M(n) + "."), GS("Choix du suppléant ?", n - 1, M(n - 1) + "."), GS("Total ?", v, M(v) + ".")],
            traps: [TR(n * n, "Le suppléant est une autre personne : il reste " + (n - 1) + " choix."), TR(v / 2, "Délégué et suppléant sont des rôles différents : l'ordre compte, on ne divise pas par 2.")] }); },
      () => { const k = R.int(4, 6), f = [1, 1, 2, 6, 24, 120, 720][k], x = pk([["livres différents sur une étagère", "livres"], ["amis dans une file d'attente", "file"], ["coureurs d'un relais (ordre de passage)", "relais"]]);
        return Qv("De combien de façons peut-on ranger " + M(k) + " " + x[0] + " ?", f, M(Array.from({ length: k }, (_, i) => k - i).join(" \\cdot ") + " = " + f) + ".",
          { ctx: x[1], guide: [GS("Choix pour la 1re place ?", k, M(k) + "."), GS("Pour la 2e place ?", k - 1, M(k - 1) + "."), GS("Total " + M(Array.from({ length: k }, (_, i) => k - i).join(" \\cdot ")) + " = ?", f, M(f) + ".")],
            traps: [TR(k * k, "À chaque place, il reste une possibilité de moins."), TR(k ** k, "Un même objet ne peut pas occuper deux places.")] }); },
      () => { const n = pk([5, 6, 7, 8, 9]), v = n * (n - 1) * (n - 2);
        return Qv("Un code de " + M(3) + " chiffres utilise les chiffres de " + M(1) + " à " + M(n) + ", tous différents. Combien de codes sont possibles ?", v, M(n + " \\cdot " + (n - 1) + " \\cdot " + (n - 2) + " = " + v) + ".",
          { ctx: "code-diff", guide: [GS("Choix du 1er chiffre ?", n, M(n) + "."), GS("Du 2e (différent du 1er) ?", n - 1, M(n - 1) + "."), GS("Total ?", v, M(v) + ".")],
            traps: [TR(n ** 3, "Les chiffres sont tous différents : le nombre de choix diminue."), TR(v / 6, "Ici, l'ordre compte (123 et 321 sont deux codes différents).")] }); },
    ],
    3: [ // paires, diagonales, complément
      () => { const n = R.int(6, 15), v = (n * (n - 1)) / 2;
        return Qv(M(n) + " personnes se serrent toutes la main une fois. Combien de poignées de main y a-t-il ?", v, "Chacun serre " + M(n - 1) + " mains ; chaque poignée est comptée deux fois : " + M("\\frac{" + n + " \\cdot " + (n - 1) + "}{2} = " + v) + ".",
          { ctx: "poignees", guide: [GS("Combien de mains serre chaque personne ?", n - 1, M(n - 1) + "."), GS(M(n + " \\cdot " + (n - 1)) + " compte chaque poignée deux fois. Total ?", v, M(v) + ".")],
            traps: [TR(n * (n - 1), "Une poignée entre A et B est la même que entre B et A : divise par 2."), TR(n * n, "On ne se serre pas la main à soi-même.")] }); },
      () => { const n = R.int(6, 12), v = (n * (n - 3)) / 2;
        return Qv("Combien de diagonales a un polygone convexe à " + M(n) + " côtés ?", v, "De chaque sommet partent " + M(n - 3) + " diagonales ; chacune est comptée deux fois : " + M("\\frac{" + n + " \\cdot " + (n - 3) + "}{2} = " + v) + ".",
          { ctx: "diagonales", guide: [GS("Depuis un sommet, combien de diagonales (pas vers lui-même ni ses 2 voisins) ?", n - 3, M(n - 3) + "."), GS("Total (chaque diagonale comptée deux fois) ?", v, M(v) + ".")],
            traps: [TR(n * (n - 3), "Chaque diagonale a deux extrémités : elle est comptée deux fois."), TR((n * (n - 1)) / 2, "Les côtés ne sont pas des diagonales.")] }); },
      () => { const n = R.int(5, 12), ar = R.rand() < 0.5, v = ar ? n * (n - 1) : (n * (n - 1)) / 2;
        return Qv("Un tournoi réunit " + M(n) + " équipes. Chaque équipe rencontre chacune des autres " + (ar ? "deux fois (match aller et match retour)" : "une seule fois") + ". Combien de matchs faut-il organiser ?", v,
          M("\\frac{" + n + " \\cdot " + (n - 1) + "}{2} = " + (n * (n - 1)) / 2) + " paires d'équipes" + (ar ? ", deux matchs chacune : " + M(v) : "") + ".",
          { ctx: ar ? "tournoi-ar" : "tournoi", guide: [GS("Nombre de paires d'équipes ?", (n * (n - 1)) / 2, M("\\frac{" + n + " \\cdot " + (n - 1) + "}{2} = " + (n * (n - 1)) / 2) + "."), GS("Nombre de matchs ?", v, M(v) + ".")],
            traps: [TR(ar ? (n * (n - 1)) / 2 : n * (n - 1), ar ? "Chaque paire joue deux fois." : "Le match A contre B est le même que B contre A."), TR(n * n, "Une équipe ne joue pas contre elle-même.")] }); },
      () => { const n = pk([5, 6, 8, 10]), all = n ** 3, diff = n * (n - 1) * (n - 2), v = all - diff;
        return Qv("Codes de " + M(3) + " chiffres choisis parmi " + M(n) + " (répétition permise). Combien de codes contiennent au moins deux chiffres identiques ?", v,
          "Tous : " + M(n + "^3 = " + all) + " ; tous différents : " + M(n + " \\cdot " + (n - 1) + " \\cdot " + (n - 2) + " = " + diff) + " ; au moins une répétition : " + M(all + " - " + diff + " = " + v) + ".",
          { ctx: "complement", guide: [GS("Nombre total de codes ?", all, M(n + "^3 = " + all) + "."), GS("Codes aux chiffres tous différents ?", diff, M(diff) + "."), GS("Au moins une répétition (le reste) ?", v, M(v) + ".")],
            traps: [TR(diff, "Ça, ce sont les codes sans répétition ; on demande le reste."), TR(all, "Il faut retirer les codes aux chiffres tous différents.")] }); },
    ],
  };

  // ===================== proba =====================
  const PB = {
    1: [
      () => { const c = { rouges: R.int(2, 6), bleues: R.int(2, 6), vertes: R.int(1, 4) }, n = c.rouges + c.bleues + c.vertes, col = pk(["rouges", "bleues", "vertes"]), f = c[col];
        return Qv("Une urne contient " + M(c.rouges) + " boules rouges, " + M(c.bleues) + " bleues et " + M(c.vertes) + " vertes. On tire une boule au hasard. Quelle est la probabilité qu'elle soit " + col.slice(0, -1) + " ?" + FA, f / n,
          "Cas favorables sur cas possibles : " + M(FS(f, n)) + ".",
          { ctx: "urne", fig: FIG.urn(c), guide: [GS("Nombre de boules en tout (cas possibles) ?", n, M(n) + "."), GS("Probabilité" + FA + " ?", f / n, M(FS(f, n)) + ".")],
            traps: [TR(f / (n - f), "On divise par le nombre TOTAL de boules, pas par les autres."), TR(1 / 3, "Les couleurs n'ont pas la même chance : il y a plus de boules de certaines couleurs.")] }); },
      () => { const fc = pk([6, 8, 12, 20]), ev = pk([["un nombre pair", (k) => k % 2 === 0, "pair"], ["un multiple de 3", (k) => k % 3 === 0, "mult3"], ["un nombre premier", (k) => [2, 3, 5, 7, 11, 13, 17, 19].includes(k), "premier"], ["un nombre supérieur à 4", (k) => k > 4, "sup4"]]);
        const fav = Array.from({ length: fc }, (_, i) => i + 1).filter(ev[1]), f = fav.length;
        if (f * 2 === fc && ev[2] === "pair" && fc === 6) return null;
        return Qv("On lance un dé équilibré à " + M(fc) + " faces numérotées de " + M(1) + " à " + M(fc) + ". Quelle est la probabilité d'obtenir " + ev[0] + " ?" + FA, f / fc,
          "Cas favorables : " + fav.join(", ") + " (" + f + ") sur " + fc + " : " + M(FS(f, fc)) + ".",
          { ctx: "de-" + ev[2], guide: [GS("Combien de faces conviennent ?", f, fav.join(", ") + " : " + M(f) + "."), GS("Probabilité" + FA + " ?", f / fc, M(FS(f, fc)) + ".")],
            traps: [TR(f / 6, "Ce dé a " + fc + " faces, pas 6."), TR(1 / fc, "Plusieurs faces conviennent : compte-les toutes.")] }); },
      () => { const w = pk(["MATHEMATIQUES", "PROBABILITE", "GENEVE", "STATISTIQUE", "ALGEBRE", "GEOMETRIE"]), voy = [...w].filter((c) => "AEIOUY".includes(c)).length, n = w.length;
        return Qv("On écrit chaque lettre du mot " + w + " sur un carton, et on tire un carton au hasard. Quelle est la probabilité de tirer une voyelle ?" + FA, voy / n,
          M(voy) + " voyelles sur " + M(n) + " lettres : " + M(FS(voy, n)) + ".",
          { ctx: "mot", guide: [GS("Nombre de cartons ?", n, M(n) + "."), GS("Nombre de voyelles (avec les répétitions) ?", voy, M(voy) + "."), GS("Probabilité" + FA + " ?", voy / n, M(FS(voy, n)) + ".")],
            traps: [TR(6 / 26, "On tire parmi les lettres du mot, pas parmi l'alphabet."), TR(voy / (n - voy), "Favorables sur TOUS les cas possibles.")] }); },
      () => { const n = pk([20, 25, 40, 50, 100, 200]), g = R.int(2, Math.floor(n / 4)), x = pk([["Une tombola compte " + M(n) + " billets, dont " + M(g) + " gagnants. Tu achètes un billet. Quelle est la probabilité de ne PAS gagner ?", "tombola"], ["Dans un lot de " + M(n) + " ampoules, " + M(g) + " sont défectueuses. On en prend une au hasard. Quelle est la probabilité qu'elle fonctionne ?", "ampoules"]]);
        return Qv(x[0] + FA, (n - g) / n, "Événement contraire : " + M("1 - " + F(g, n) + " = " + F(n - g, n)) + ".",
          { ctx: x[1], guide: [GS("Probabilité de l'événement contraire" + FA + " ?", g / n, M(FS(g, n)) + "."), GS("Donc la probabilité cherchée " + M("1 - p") + " ?", (n - g) / n, M(F(n - g, n)) + ".")],
            traps: [TR(g / n, "Ça, c'est la probabilité de l'événement contraire ; on demande l'autre."), TR(1 - 1 / g, "Utilise 1 − (cas contraires ÷ total).")] }); },
    ],
    2: [
      () => { const s = pk([3, 4, 5, 6, 8, 9, 10, 11]), c = 6 - Math.abs(7 - s);
        return Qv("On lance deux dés équilibrés et on additionne les points. Quelle est la probabilité d'obtenir " + M(s) + " ?" + FA, c / 36,
          "Tableau 6 × 6 : " + M(c) + " cases donnent " + M(s) + " sur 36 : " + M(FS(c, 36)) + ".",
          { ctx: "somme", guide: [GS("Nombre d'issues (tableau 6 × 6) ?", 36, M(36) + "."), GS("Nombre de couples de somme " + s + " ?", c, M(c) + "."), GS("Probabilité" + FA + " ?", c / 36, M(FS(c, 36)) + ".")],
            traps: [TR(1 / 11, "Les sommes 2 à 12 n'ont pas toutes la même chance (7 se fait de 6 façons, 2 d'une seule)."), TR(Math.ceil(c / 2) / 36, "(1 ; 2) et (2 ; 1) sont deux issues différentes.")] }); },
      () => { const [p, c] = pk([[6, 4], [12, 4], [4, 3], [8, 2], [24, 2], [18, 2], [10, 2]]);
        return Qv("On lance deux dés équilibrés et on multiplie les points. Quelle est la probabilité que le produit vaille " + M(p) + " ?" + FA, c / 36,
          M(c) + " cases sur 36 donnent " + M(p) + " : " + M(FS(c, 36)) + ".",
          { ctx: "produit", guide: [GS("Nombre de couples (dé 1 ; dé 2) de produit " + p + " ?", c, M(c) + "."), GS("Probabilité" + FA + " ?", c / 36, M(FS(c, 36)) + ".")],
            traps: [TR(Math.ceil(c / 2) / 36, "Compte (a ; b) et (b ; a) séparément."), TR(c / 12, "Il y a 36 issues, pas 12.")] }); },
      () => { const k = pk([3, 4]), m = R.int(1, k - 1), C = [1, k, (k * (k - 1)) / 2, k === 3 ? 1 : 4, 1][m], tot = 2 ** k;
        return Qv("On lance " + M(k) + " pièces équilibrées. Quelle est la probabilité d'obtenir exactement " + M(m) + " fois pile ?" + FA, C / tot,
          M(tot) + " issues (arbre) ; " + M(C) + " contiennent exactement " + m + " pile : " + M(FS(C, tot)) + ".",
          { ctx: "pieces", guide: [GS("Nombre d'issues (" + M("2^" + k) + ") ?", tot, M(tot) + "."), GS("Combien d'issues ont exactement " + m + " pile ?", C, M(C) + "."), GS("Probabilité" + FA + " ?", C / tot, M(FS(C, tot)) + ".")],
            traps: [TR(1 / (k + 1), "Les nombres de piles (0 à " + k + ") ne sont pas équiprobables."), TR(1 / tot, "Plusieurs issues conviennent (la position des piles varie).")] }); },
      () => { const r = R.int(2, 5), b = R.int(2, 6), n = r + b;
        return Qv("Une urne contient " + M(r) + " boules rouges et " + M(b) + " bleues. On tire une boule, on la remet, puis on en tire une deuxième. Quelle est la probabilité d'obtenir deux rouges ?" + FA, (r * r) / (n * n),
          "Avec remise : " + M("\\frac{" + r + "}{" + n + "} \\cdot \\frac{" + r + "}{" + n + "} = " + FS(r * r, n * n)) + ".",
          { ctx: "remise", fig: FIG.urn({ rouges: r, bleues: b }), guide: [GS("Probabilité d'une rouge au 1er tirage" + FA + " ?", r / n, M(FS(r, n)) + "."), GS("Deux rouges (on multiplie sur l'arbre)" + FA + " ?", (r * r) / (n * n), M(FS(r * r, n * n)) + ".")],
            traps: [TR((2 * r) / n, "Sur un arbre, on multiplie les probabilités le long d'un chemin."), TR((r * (r - 1)) / (n * (n - 1)), "La boule est remise : le 2e tirage se fait avec la même urne.")] }); },
    ],
    3: [
      () => { const r = R.int(3, 6), b = R.int(2, 5), n = r + b;
        return Qv("Une urne contient " + M(r) + " boules rouges et " + M(b) + " vertes. On tire deux boules sans remise. Quelle est la probabilité d'obtenir deux boules rouges ?" + FA, (r * (r - 1)) / (n * (n - 1)),
          M("\\frac{" + r + "}{" + n + "} \\cdot \\frac{" + (r - 1) + "}{" + (n - 1) + "} = " + FS(r * (r - 1), n * (n - 1))) + ".",
          { ctx: "sans-remise-rr", fig: FIG.urn({ rouges: r, vertes: b }), guide: [GS("1re rouge" + FA + " ?", r / n, M(FS(r, n)) + "."), GS("2e rouge sachant la 1re rouge (il reste " + (n - 1) + " boules)" + FA + " ?", (r - 1) / (n - 1), M(FS(r - 1, n - 1)) + "."), GS("Deux rouges" + FA + " ?", (r * (r - 1)) / (n * (n - 1)), M(FS(r * (r - 1), n * (n - 1))) + ".")],
            traps: [TR((r * r) / (n * n), "Sans remise : au 2e tirage, il reste une rouge et une boule de moins."), TR((r / n) + ((r - 1) / (n - 1)), "Le long d'un chemin de l'arbre, on multiplie.")] }); },
      () => { const r = R.int(2, 6), b = R.int(2, 5), n = r + b, v = (2 * r * b) / (n * (n - 1));
        return Qv("Une urne contient " + M(r) + " boules rouges et " + M(b) + " vertes. On tire deux boules sans remise. Quelle est la probabilité d'obtenir une boule de chaque couleur ?" + FA, v,
          "Rouge puis verte ou verte puis rouge : " + M("2 \\cdot \\frac{" + r + " \\cdot " + b + "}{" + n + " \\cdot " + (n - 1) + "} = " + FS(2 * r * b, n * (n - 1))) + ".",
          { ctx: "sans-remise-rv", fig: FIG.urn({ rouges: r, vertes: b }), guide: [GS("Rouge puis verte" + FA + " ?", (r * b) / (n * (n - 1)), M("\\frac{" + r + "}{" + n + "} \\cdot \\frac{" + b + "}{" + (n - 1) + "} = " + FS(r * b, n * (n - 1))) + "."), GS("Verte puis rouge : même valeur. Total" + FA + " ?", v, M(FS(2 * r * b, n * (n - 1))) + ".")],
            traps: [TR((r * b) / (n * (n - 1)), "Il y a deux chemins : rouge-verte ET verte-rouge."), TR((2 * r * b) / (n * n), "Sans remise : le 2e tirage se fait parmi " + (n - 1) + " boules.")] }); },
      () => { const r = R.int(3, 6), b = R.int(2, 5), n = r + b, num = r * (r - 1) + b * (b - 1), den = n * (n - 1);
        if (r === b) return null;
        return Qv("Une urne contient " + M(r) + " boules rouges et " + M(b) + " bleues. On tire deux boules sans remise. Quelle est la probabilité d'obtenir deux boules de la même couleur ?" + FA, num / den,
          "Deux rouges ou deux bleues : " + M("\\frac{" + r * (r - 1) + " + " + b * (b - 1) + "}{" + den + "} = " + FS(num, den)) + ".",
          { ctx: "meme-couleur", fig: FIG.urn({ rouges: r, bleues: b }), guide: [GS("Deux rouges" + FA + " ?", (r * (r - 1)) / den, M(FS(r * (r - 1), den)) + "."), GS("Deux bleues" + FA + " ?", (b * (b - 1)) / den, M(FS(b * (b - 1), den)) + "."), GS("Total" + FA + " ?", num / den, M(FS(num, den)) + ".")],
            traps: [TR((r * (r - 1)) / den, "N'oublie pas le cas « deux bleues »."), TR((r * r + b * b) / (n * n), "Sans remise : le dénominateur est " + n + " · " + (n - 1) + ".")] }); },
      () => { const x = pk([["On lance deux dés équilibrés. Quelle est la probabilité d'obtenir au moins un 6 ?", 25, 36, "aucun 6 : " + M("\\frac{5}{6} \\cdot \\frac{5}{6} = \\frac{25}{36}"), "de2"], ["On lance trois pièces équilibrées. Quelle est la probabilité d'obtenir au moins une fois pile ?", 1, 8, "aucun pile : " + M("\\left(\\frac{1}{2}\\right)^3 = \\frac{1}{8}"), "pieces3"], ["On lance trois dés équilibrés. Quelle est la probabilité d'obtenir au moins un 6 ?", 125, 216, "aucun 6 : " + M("\\left(\\frac{5}{6}\\right)^3 = \\frac{125}{216}"), "de3"]]);
        const v = 1 - x[1] / x[2];
        return Qv(x[0] + FA, v, "Contraire de « au moins un » = « aucun » ; " + x[3] + ", donc " + M("1 - " + F(x[1], x[2]) + " = " + F(x[2] - x[1], x[2])) + ".",
          { ctx: "au-moins-" + x[4], guide: [GS("Probabilité de l'événement contraire (« aucun »)" + FA + " ?", x[1] / x[2], x[3] + "."), GS("Au moins un : " + M("1 - p") + FA + " ?", v, M(F(x[2] - x[1], x[2])) + ".")],
            traps: [TR(x[1] / x[2], "Ça, c'est « aucun » ; on demande le contraire."), TR(x[4] === "de2" ? 2 / 6 : x[4] === "de3" ? 3 / 6 : 1 / 2, "On n'additionne pas les probabilités de chaque lancer : passe par le contraire.")] }); },
    ],
  };

  const PROBS = {
    denombr: [
      () => P("Un digicode a 4 touches (A, B, C, D) ; le code a 3 lettres.", [["a) Nombre de codes (répétition permise)", 64], ["b) Nombre de codes aux lettres toutes différentes", 24], ["c) Nombre de codes avec au moins une lettre répétée", 40]], ["Chaque position : 4 choix.", "Sans répétition : 4 · 3 · 2 ; puis le reste."], "a) " + M("4^3 = 64") + " ; b) " + M("4 \\cdot 3 \\cdot 2 = 24") + " ; c) " + M("64 - 24 = 40") + "."),
      () => P("Un club de 10 membres organise son assemblée.", [["a) Nombre de façons d'élire un président et un secrétaire", 90], ["b) Nombre de poignées de main si chacun salue tout le monde", 45], ["c) Nombre de matchs d'un tournoi aller-retour entre les membres", 90]], ["Rôles différents : l'ordre compte.", "Poignées : chaque paire une fois, on divise par 2."], "a) " + M("10 \\cdot 9 = 90") + " ; b) " + M("\\frac{10 \\cdot 9}{2} = 45") + " ; c) " + M("45 \\cdot 2 = 90") + "."),
    ],
    proba: [
      () => P("Une urne contient 5 boules rouges et 3 vertes. On tire deux boules sans remise." + FA, [["a) P(deux rouges)", 20 / 56], ["b) P(deux vertes)", 6 / 56], ["c) P(une de chaque couleur)", 30 / 56]], ["Arbre : 5/8 puis 4/7 pour deux rouges.", "c) = 1 − a) − b)."], "a) " + M("\\frac{5}{8} \\cdot \\frac{4}{7} = \\frac{5}{14}") + " ; b) " + M("\\frac{3}{8} \\cdot \\frac{2}{7} = \\frac{3}{28}") + " ; c) " + M("1 - \\frac{5}{14} - \\frac{3}{28} = \\frac{15}{28}") + "."),
      () => P("On lance deux dés équilibrés et on additionne les points." + FA, [["a) P(somme = 7)", 6 / 36], ["b) P(somme ≥ 10)", 6 / 36], ["c) P(somme ≠ 7)", 30 / 36]], ["Tableau 6 × 6 : 36 issues.", "c) contraire de a)."], "a) " + M("\\frac{6}{36} = \\frac{1}{6}") + " ; b) 10 : 3, 11 : 2, 12 : 1, soit " + M("\\frac{6}{36} = \\frac{1}{6}") + " ; c) " + M("1 - \\frac{1}{6} = \\frac{5}{6}") + "."),
    ],
  };

  // « Trouve l'erreur » (24.11, chantier I) : issue comptée deux fois dans « A ou B ».
  PB[2].push(() => { const s = R.pick([4, 5]), w = R.pick(["Sam", "Lina", "Noé", "Inès", "Yanis", "Léa"]), A = [2, 4, 6], Bv = [1, 2, 3, 4, 5, 6].filter((x) => x >= s), U = [...new Set([...A, ...Bv])].sort((x, y) => x - y);
    return Qv("On lance un dé équilibré à 6 faces. " + w + " calcule la probabilité d'obtenir un nombre pair <b>ou</b> au moins " + s + " : « " + M("\\frac{3}{6} + \\frac{" + Bv.length + "}{6} = \\frac{" + (3 + Bv.length) + "}{6}") + " ». Trouve l'erreur, puis donne la bonne probabilité (fraction).", U.length / 6,
      "Erreur : " + A.filter((x) => x >= s).join(" et ") + (A.filter((x) => x >= s).length > 1 ? " sont" : " est") + " à la fois pair" + (A.filter((x) => x >= s).length > 1 ? "s" : "") + " et au moins " + s + " : " + w + " les a comptés deux fois. Issues favorables : " + U.join(", ") + ", soit " + M("\\frac{" + U.length + "}{6} = " + frac(U.length, 6)) + ".",
      { ctx: "erreur", guide: [GS("Liste les issues paires ou au moins " + s + ", sans répéter : combien y en a-t-il ?", U.length, U.join(", ") + "."), GS("Probabilité ?", U.length / 6, M(frac(U.length, 6)) + ".")],
        traps: [TRAP((3 + Bv.length) / 6, "C'est le calcul de " + w + " : les issues communes aux deux événements sont comptées deux fois.")] }); });
  const ALL = { denombr: DN, proba: PB };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => pickForm(lv[Math.min(Math.max(d, 1), 3)]);
    if (typeof VAR !== "undefined") VAR[id] = {};
    if (typeof PROB !== "undefined") delete PROB[id];
    PROB_EXTRA[id] = PROBS[id];
  }
  Object.assign(HINTS_EXTRA, {
    denombr: "Fais un arbre : on multiplie le nombre de choix à chaque étape. Sans répétition, le nombre de choix diminue ; pour des paires (poignées de main), on divise par 2.",
    proba: "P = cas favorables ÷ cas possibles. Sur un arbre, on multiplie le long d'un chemin et on additionne les chemins. « Au moins un » : passe par le contraire.",
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    denombr: ["Dénombrer avec un arbre, codes", "Dénombrer sans répétition", "Paires, diagonales, complément"],
    proba: ["Probabilité simple, contraire", "Deux dés, pièces, avec remise", "Sans remise, au moins un"],
  });
})();

// Chantier 11e · 1. Nombres et opérations, fin (19.11, « on se concentre sur la 11e ») : rel, fracops, rac, les trois
// dernières notions de 11e encore sur les anciens générateurs ; carres et pctvar (révisions de 10e) ajoutés le 20.11. Même standard que ch11_no.js : au moins 3 formes par
// niveau, pas à pas, erreurs typiques, étiquette ctx ; défis en plusieurs étapes.
(function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; };
  const gcd2 = (a, b) => (b ? gcd2(b, a % b) : Math.abs(a));
  const r6 = (v) => +(+v).toFixed(6);
  const par = (v) => (v < 0 ? "(" + v + ")" : String(v));
  const N = (v) => String(r6(v)).replace(".", "{,}");
  // rationnels exacts [n, d]
  const rq = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd2(n, d) || 1; return [n / g, d / g]; };
  const qa = (x, y) => rq(x[0] * y[1] + y[0] * x[1], x[1] * y[1]);
  const qs = (x, y) => qa(x, [-y[0], y[1]]);
  const qm = (x, y) => rq(x[0] * y[0], x[1] * y[1]);
  const qd = (x, y) => rq(x[0] * y[1], x[1] * y[0]);
  const qv = (x) => x[0] / x[1];
  const qT = (x) => frac(x[0], x[1]);
  const fT = (n, d) => (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}";
  const fP = (n, d) => (n < 0 ? "\\left(-\\frac{" + -n + "}{" + d + "}\\right)" : "\\frac{" + n + "}{" + d + "}");
  const irr = () => { let n, d; do { d = R.int(2, 9); n = R.int(1, 2 * d); } while (gcd2(n, d) !== 1 || n === d); return [n, d]; };
  // 22.11 (« valeurs un peu hautes ») : fractions étagées et carrés avec de petits dénominateurs (2 à 6).
  const irrS = () => { let n, d; do { d = R.int(2, 6); n = R.int(1, d + 2); } while (gcd2(n, d) !== 1 || n === d); return [n, d]; };
  const keep = (value, traps) => { const seen = new Set(); return (traps || []).filter((t) => t && isFinite(t.v) && Math.abs(t.v - value) > 1e-9 && !seen.has(r6(t.v)) && seen.add(r6(t.v))); };
  const Qv = (q, value, sol, o = {}) => { const x = { q, spec: Object.assign({ kind: "value", value }, o.radical ? { radical: true } : {}), sol, guide: o.guide, traps: keep(value, o.traps), ctx: o.ctx }; if (o.fig) x.fig = o.fig; if (o.canon) x.canon = o.canon; return x; };
  const TR = TRAP;
  const P = (q, parts, hints, sol) => ({ q, parts: parts.map(([label, value]) => ({ label, spec: { kind: "value", value } })), hints, sol });
  const FA = " (fraction acceptée)";

  // ===================== rel =====================
  const RE = {
    1: [
      () => { let a, b; do { a = nz(-12, 12); b = nz(-12, 12); } while (a > 0 && b > 0); const A = Math.abs(a), B = Math.abs(b), same = a * b > 0; // au moins un négatif (21.11)
        return Qv("Calcule : " + M(par(a) + " + " + par(b)), a + b, M(par(a) + " + " + par(b) + " = " + (a + b)) + ".",
          { ctx: "addition", fig: FIG.numberLine(a, [], { span: [a + b] }), guide: [same ? GS("Même signe : on additionne les distances à zéro. " + M(A + " + " + B) + " = ?", A + B, M(A + B) + ".") : GS("Signes contraires : la plus grande distance moins la plus petite. " + M(Math.max(A, B) + " - " + Math.min(A, B)) + " = ?", Math.abs(A - B), M(Math.abs(A - B)) + "."), GS("Résultat (avec son signe) ?", a + b, M(a + b) + ".")],
            traps: [TR(-(a + b), "Signe du résultat : celui du nombre le plus loin de zéro."), TR(A + B === Math.abs(a + b) ? a - b : (a < 0 ? -1 : 1) * (A + B), "Signes contraires : on soustrait les distances.")] }); },
      () => { const a = nz(-12, 12), b = -R.int(2, 12);
        return Qv("Calcule : " + M(par(a) + " - " + par(b)), a - b, "Soustraire un nombre négatif, c'est ajouter son opposé : " + M(par(a) + " + " + -b + " = " + (a - b)) + ".",
          { ctx: "moins-negatif", guide: [GS("On remplace " + M("- " + par(b)) + " par " + M("+ " + -b) + ". " + M(par(a) + " + " + -b) + " = ?", a - b, M(a - b) + ".")], traps: [TR(a + b, "« − (" + b + ") » devient « + " + -b + " »."), TR(-(a - b), "Vérifie le signe du résultat.")] }); },
      () => { let a, b; do { a = nz(-9, 9); b = nz(-9, 9); } while ((a > 0 && b > 0) || Math.abs(a) === 1 || Math.abs(b) === 1); const div = R.rand() < 0.5, p = a * b; // au moins un négatif, pas de facteur ±1 (21.11)
        return div ? Qv("Calcule : " + M(par(p) + " : " + par(b)), a, "Signe : " + (p * b > 0 ? "même signe → +" : "signes contraires → −") + " ; " + M(Math.abs(p) + " : " + Math.abs(b) + " = " + Math.abs(a)) + " : " + M(a) + ".", { ctx: "division", guide: [GS("Le résultat est-il positif (1) ou négatif (−1) ?", Math.sign(a), p * b > 0 ? "Même signe : positif." : "Signes contraires : négatif."), GS("Résultat ?", a, M(a) + ".")], traps: [TR(-a, "Règle des signes : même signe → +, signes contraires → −.")] })
          : Qv("Calcule : " + M(par(a) + " \\cdot " + par(b)), p, "Signe : " + (a * b > 0 ? "même signe → +" : "signes contraires → −") + " ; " + M(Math.abs(a) + " \\cdot " + Math.abs(b) + " = " + Math.abs(p)) + " : " + M(p) + ".", { ctx: "produit", guide: [GS("Le résultat est-il positif (1) ou négatif (−1) ?", Math.sign(p), a * b > 0 ? "Même signe : positif." : "Signes contraires : négatif."), GS("Résultat ?", p, M(p) + ".")], traps: [TR(-p, "Règle des signes : même signe → +, signes contraires → −."), TR(a + b, "C'est un produit.")] }); },
      () => { const t0 = -R.int(2, 15), d = R.int(5, 20), up = R.rand() < 0.5, x = pk([["Le matin, il fait " + M(t0) + " °C. La température " + (up ? "monte" : "baisse") + " de " + M(d) + " °C. Quelle température fait-il ensuite (en °C) ?", "temperature"], ["Un plongeur est à " + M(t0) + " m (sous la surface). Il " + (up ? "remonte" : "descend") + " de " + M(d) + " m. À quelle altitude est-il ensuite (en m) ?", "plongeur"]]), v = up ? t0 + d : t0 - d;
        return Qv(x[0], v, M(t0 + (up ? " + " : " - ") + d + " = " + v) + ".",
          { ctx: x[1], guide: [GS("Calcul " + M(par(t0) + (up ? " + " : " - ") + d) + " = ?", v, M(v) + ".")], traps: [TR(up ? -(Math.abs(t0) + d) : Math.abs(t0) - d, up ? "Monter, c'est ajouter : " + t0 + " + " + d + "." : "Descendre, c'est soustraire : on s'éloigne encore de zéro."), TR(-v, "Vérifie le signe.")] }); },
    ],
    2: [
      () => { const a = nz(-9, 9), b = R.int(2, 6), c = nz(-6, 6);
        return Qv("Calcule : " + M(par(a) + " - " + b + " \\cdot " + par(c)), a - b * c, M(par(a) + " - " + par(b * c) + " = " + (a - b * c)) + ".",
          { ctx: "priorite", guide: [GS("D'abord le produit " + M(b + " \\cdot " + par(c)) + " ?", b * c, M(b * c) + "."), GS("Puis " + M(par(a) + " - " + par(b * c)) + " ?", a - b * c, M(a - b * c) + ".")], traps: [TR((a - b) * c, "La multiplication passe avant la soustraction."), TR(a + b * c, "Soustraire " + par(b * c) + " : attention au signe.")] }); },
      () => { let ns, ops; do { ns = [nz(-9, 9), nz(-12, 12), nz(-9, 9), nz(-12, 12)]; ops = [pk(["+", "-"]), pk(["+", "-"]), pk(["+", "-"])]; } while (ns.filter((n) => n < 0).length < 2 || !ops.some((o, i) => o === "-" && ns[i + 1] < 0)); const v = ns.reduce((s, n, i) => (i ? (ops[i - 1] === "+" ? s + n : s - n) : n), 0);
        const txt = ns.map((n, i) => (i ? " " + ops[i - 1] + " " : "") + (i ? par(n) : n)).join(""), simp = ns.map((n, i) => (i ? (ops[i - 1] === "+" ? n : -n) : n));
        return Qv("Calcule : " + M(txt), v, "On écrit tout en additions : " + M(simp.map((n, i) => (i ? (n < 0 ? " - " + -n : " + " + n) : n)).join("")) + " = " + M(v) + ".",
          { ctx: "suite", guide: [GS("Somme des termes positifs (après avoir transformé les « − (−) ») ?", simp.filter((n) => n > 0).reduce((s, n) => s + n, 0), "Termes positifs : " + simp.filter((n) => n > 0).join(", ") + "."), GS("Somme des termes négatifs ?", simp.filter((n) => n < 0).reduce((s, n) => s + n, 0), "Termes négatifs : " + simp.filter((n) => n < 0).join(", ") + "."), GS("Résultat ?", v, M(v) + ".")], traps: [TR(ns.reduce((s, n, i) => (i ? (ops[i - 1] === "+" ? s + n : s + n) : n), 0), "« − (−a) » devient « + a » : le signe compte."), TR(-v, "Vérifie le signe final.")] }); },
      () => { const a = pk([2, 3, 4, 5]), n = pk([2, 3, 4]), neg = R.rand() < 0.5, v = neg ? -(a ** n) : (-a) ** n;
        return Qv("Calcule : " + M(neg ? "-" + a + "^" + n : "(-" + a + ")^" + n), v, neg ? "L'exposant porte seulement sur " + M(a) + " : " + M("-(" + a + "^" + n + ") = " + v) + "." : "Le négatif est multiplié " + n + " fois : " + (n % 2 ? "nombre impair de facteurs négatifs, résultat négatif" : "nombre pair de facteurs, résultat positif") + " : " + M(v) + ".",
          { ctx: neg ? "puiss-sans-par" : "puiss-par", guide: [GS(M(a + "^" + n) + " = ?", a ** n, M(a ** n) + "."), GS("Avec le signe ?", v, M(v) + ".")], traps: [TR(-v, neg ? "Sans parenthèses, −" + a + "^" + n + " = −(" + a + "^" + n + ")." : "(−" + a + ")^" + n + " : signe + si l'exposant est pair, − s'il est impair."), TR(-a * n, "Une puissance n'est pas un produit par l'exposant.")] }); },
      () => { const lo = -R.int(3, 15), hi = R.int(2, 20), x = pk([["La température la plus basse de la journée est " + M(lo) + " °C et la plus haute " + M(hi) + " °C. Quel est l'écart de température (en °C) ?", "ecart-temp"], ["Le point le plus bas d'un lac est à " + M(lo * 10) + " m et le sommet voisin à " + M(hi * 100) + " m d'altitude. Quel est le dénivelé (en m) ?", "denivele"]]), v = x[1] === "denivele" ? hi * 100 - lo * 10 : hi - lo;
        return Qv(x[0], v, "Écart = plus grand − plus petit : " + M((x[1] === "denivele" ? hi * 100 : hi) + " - " + par(x[1] === "denivele" ? lo * 10 : lo) + " = " + v) + ".",
          { ctx: x[1], guide: [GS("Écart " + M((x[1] === "denivele" ? hi * 100 : hi) + " - " + par(x[1] === "denivele" ? lo * 10 : lo)) + " ?", v, M(v) + ".")], traps: [TR(x[1] === "denivele" ? hi * 100 + lo * 10 : hi + lo, "Soustraire un négatif, c'est ajouter : l'écart est plus grand que " + (x[1] === "denivele" ? hi * 100 : hi) + ".")] }); },
    ],
    3: [
      // 21.11 (niveau 2 relevé pour la 11e) : puissances et priorités mêlées.
      () => { const a = pk([2, 3]), n = pk([2, 3]), b = nz(-5, 5), c = -R.int(2, 6), k = pk([3, 5]), t1 = (-a) ** n, t2 = b * c, t3 = (-1) ** k, v = t1 - t2 + t3;
        return Qv("Calcule : " + M("(-" + a + ")^" + n + " - " + par(b) + " \\cdot " + par(c) + " + (-1)^" + k), v,
          M("(-" + a + ")^" + n + " = " + t1) + ", " + M(par(b) + " \\cdot " + par(c) + " = " + t2) + ", " + M("(-1)^" + k + " = " + t3) + " ; " + M(t1 + " - " + par(t2) + " + " + par(t3) + " = " + v) + ".",
          { ctx: "puiss-prio", guide: [GS(M("(-" + a + ")^" + n) + " = ?", t1, M(t1) + (n % 2 ? " (exposant impair : négatif)." : " (exposant pair : positif).")), GS(M(par(b) + " \\cdot " + par(c)) + " = ?", t2, M(t2) + "."), GS("Résultat ?", v, M(v) + ".")],
            traps: [TR(-(a ** n) - t2 + t3, "(−" + a + ")^" + n + " : les parenthèses comptent."), TR(t1 + t2 + t3, "Soustraire " + par(t2) + " : attention au signe."), TR(t1 - t2 - t3, "(−1)^" + k + " = −1 (exposant impair).")] }); },
      // Crochets : −[a − (b − c) · d] + e
      () => { const a = nz(-6, 6), b = R.int(1, 6), c = R.int(7, 12), d = pk([2, 3, -2]), e = nz(-9, 9), in1 = b - c, in2 = a - in1 * d, v = -in2 + e;
        return Qv("Calcule : " + M("-[" + a + " - (" + b + " - " + c + ") \\cdot " + par(d) + "] + " + par(e)), v,
          M(b + " - " + c + " = " + in1) + " ; " + M(a + " - " + par(in1) + " \\cdot " + par(d) + " = " + a + " - " + par(in1 * d) + " = " + in2) + " ; " + M("-" + par(in2) + " + " + par(e) + " = " + v) + ".",
          { ctx: "crochets", guide: [GS("D'abord la parenthèse " + M(b + " - " + c) + " ?", in1, M(in1) + "."), GS("Puis le crochet " + M("[" + a + " - " + par(in1) + " \\cdot " + par(d) + "]") + " ?", in2, M(in2) + "."), GS("Résultat ?", v, M("-" + par(in2) + " + " + par(e) + " = " + v) + ".")],
            traps: [TR(in2 + e, "Le signe − devant le crochet change le signe de tout le crochet."), TR(-((a - in1) * d) + e, "La multiplication passe avant la soustraction dans le crochet.")] }); },
      () => { const a = nz(-6, 6), b = nz(-6, 6), c = nz(-6, 6), d = nz(-6, 6), e = pk([2, -2, 3, -3, 4]); const t = (a - b) * (c - d); if (t % e || a === b || c === d) return null; /* 24.11 : jamais de dénominateur ±1 (retour testeur), pas de parenthèse nulle */ const v = t / e;
        return Qv("Calcule : " + M("\\frac{(" + a + " - " + par(b) + ") \\cdot (" + c + " - " + par(d) + ")}{" + e + "}"), v, M("(" + (a - b) + ") \\cdot (" + (c - d) + ") = " + t) + ", puis " + M(t + " : " + par(e) + " = " + v) + ".",
          { ctx: "fraction-rel", guide: [GS(M(a + " - " + par(b)) + " ?", a - b, M(a - b) + "."), GS(M(c + " - " + par(d)) + " ?", c - d, M(c - d) + "."), GS("Résultat ?", v, M(v) + ".")], traps: [TR(-v, "Compte les facteurs négatifs pour le signe."), TR(((a + b) * (c + d)) / e, "Soustraire un négatif, c'est ajouter.")] }); },
      () => { const x = -R.int(1, 4), a = pk([2, 3, -1]), b = nz(-5, 5), c = nz(-6, 6), v = a * x * x + b * x + c;
        return Qv("Calcule la valeur de " + M((a === 1 ? "" : a === -1 ? "-" : a) + "x^2" + (b < 0 ? " - " + -b : " + " + b) + "x" + (c < 0 ? " - " + -c : " + " + c)) + " pour " + M("x = " + x) + ".", v, M(a + " \\cdot " + par(x) + "^2" + (b < 0 ? " - " + -b : " + " + b) + " \\cdot " + par(x) + (c < 0 ? " - " + -c : " + " + c) + " = " + a * x * x + (b * x < 0 ? " - " + -b * x : " + " + b * x) + (c < 0 ? " - " + -c : " + " + c) + " = " + v) + ".",
          { ctx: "valeur-x", guide: [GS(M(par(x) + "^2") + " ?", x * x, M(x * x) + " (positif)."), GS(M(b + " \\cdot " + par(x)) + " ?", b * x, M(b * x) + "."), GS("Résultat ?", v, M(v) + ".")], traps: [TR(-a * x * x + b * x + c, "(" + x + ")² = " + x * x + " est positif."), TR(a * x * x - b * x + c, "Attention au signe de " + b + " · (" + x + ").")] }); },
      () => { const ts = Array.from({ length: pk([4, 5]) }, () => R.int(-8, 6)), s = ts.reduce((a, b) => a + b, 0); if (s % ts.length || Math.abs(s / ts.length) <= 1) return null; const v = s / ts.length; /* 25.11 (robot) : moyenne 0 ou ±1 écartée */
        return Qv("Températures relevées à midi pendant " + M(ts.length) + " jours : " + ts.map((t) => M(t)).join(" ; ") + " (en °C). Quelle est la température moyenne ?", v, "Somme " + M(s) + ", divisée par " + M(ts.length) + " : " + M(v) + " °C.",
          { ctx: "moyenne", guide: [GS("Somme des températures ?", s, M(s) + "."), GS("Moyenne ?", v, M(s + " : " + ts.length + " = " + v) + ".")], traps: [TR(ts.reduce((a, b) => a + Math.abs(b), 0) / ts.length, "Les températures négatives se soustraient."), TR(-v, "Vérifie le signe de la somme.")] }); },
      () => { const a = R.int(2, 6), b = R.int(2, 5), c = R.int(2, 4), sgn = [pk([1, -1]), pk([1, -1]), pk([1, -1])], A = sgn[0] * a * b * c, v = (A / (sgn[1] * b)) * (sgn[2] * c);
        return Qv("Calcule : " + M(par(A) + " : " + par(sgn[1] * b) + " \\cdot " + par(sgn[2] * c)), v, "Division et multiplication ont la même priorité : on les effectue dans l'ordre, de gauche à droite. " + M(par(A) + " : " + par(sgn[1] * b) + " = " + A / (sgn[1] * b)) + ", puis " + M(par(A / (sgn[1] * b)) + " \\cdot " + par(sgn[2] * c) + " = " + v) + ".",
          { ctx: "gauche-droite", guide: [GS("· et : ont la même priorité : on commence par la gauche. La division d'abord ?", A / (sgn[1] * b), M(A / (sgn[1] * b)) + "."), GS("Puis la multiplication ?", v, M(v) + ".")], traps: [TR(A / (sgn[1] * b * sgn[2] * c), "Multiplications et divisions : de gauche à droite."), TR(-v, "Compte les signes négatifs.")] }); },
    ],
  };

  // ===================== fracops =====================
  const FO = {
    1: [
      () => { let b, e; do { b = R.int(2, 6); e = R.int(2, 8); } while (b === e); const a = R.int(1, b - 1), c = R.int(1, 2 * e), n = a * e - c * b, d = b * e; if (n >= 0 || gcd2(a, b) !== 1 || gcd2(c, e) !== 1) return null;
        return Qv("Calcule et simplifie : " + M(fT(a, b) + " - " + fT(c, e)) + FA, n / d, M("\\frac{" + a * e + "}{" + d + "} - \\frac{" + c * b + "}{" + d + "} = " + frac(n, d)) + " : le résultat est négatif.",
          { ctx: "diff-negative", guide: [GS("Dénominateur commun " + M(b + " \\cdot " + e) + " ?", d, M(d) + "."), GS("Numérateur " + M(a * e + " - " + c * b) + " ?", n, M(n) + "."), GS("Résultat simplifié" + FA + " ?", n / d, M(frac(n, d)) + ".")], traps: [TR(-n / d, "Le résultat est négatif : la 2e fraction est plus grande."), TR((a - c) / (b - e || 1), "On ne soustrait pas les dénominateurs.")] }); },
      () => { const [a, b] = irr(), [c, e] = irr(), x = rq(-a * c, b * e);
        return Qv("Calcule et simplifie : " + M(fP(-a, b) + " \\cdot " + fT(c, e)) + FA, qv(x), "Signe − ; " + M("\\frac{" + a + " \\cdot " + c + "}{" + b + " \\cdot " + e + "} = " + qT([a * c, b * e])) + " : " + M(qT(x)) + ".",
          { ctx: "produit", guide: [GS("Signe : positif (1) ou négatif (−1) ?", -1, "Négatif fois positif : négatif."), GS("Résultat" + FA + " ?", qv(x), M(qT(x)) + ".")], traps: [TR(-qv(x), "Négatif fois positif : le résultat est négatif."), TR(-(a * e) / (b * c), "Pour multiplier, on ne prend pas l'inverse.")] }); },
      () => { const [a, b] = irr(), [c, e] = irr(), x = qd([-a, b], [c, e]);
        return Qv("Calcule et simplifie : " + M(fP(-a, b) + " : " + fT(c, e)) + FA, qv(x), "Diviser, c'est multiplier par l'inverse : " + M(fP(-a, b) + " \\cdot \\frac{" + e + "}{" + c + "} = " + qT(x)) + ".",
          { ctx: "quotient", guide: [GS("Inverse de " + M(fT(c, e)) + FA + " ?", e / c, M("\\frac{" + e + "}{" + c + "}") + "."), GS("Résultat" + FA + " ?", qv(x), M(qT(x)) + ".")], traps: [TR(-(a * c) / (b * e), "Diviser, c'est multiplier par l'INVERSE."), TR(-qv(x), "Négatif divisé par positif : négatif.")] }); },
    ],
    2: [
      () => { const [a, b] = irr(), [c, e] = irr(), [f, g] = irr(), sgn = pk([1, -1]), x = qa([a, b], qm([sgn * c, e], [f, g]));
        return Qv("Calcule et simplifie : " + M(fT(a, b) + (sgn < 0 ? " - " : " + ") + fT(c, e) + " \\cdot " + fT(f, g)) + FA, qv(x), "Le produit d'abord : " + M(fT(c, e) + " \\cdot " + fT(f, g) + " = " + qT(qm([c, e], [f, g]))) + ", puis " + M(qT(x)) + ".",
          { ctx: "priorite", guide: [GS("Produit " + M(fT(c, e) + " \\cdot " + fT(f, g)) + FA + " ?", qv(qm([c, e], [f, g])), M(qT(qm([c, e], [f, g]))) + "."), GS("Résultat" + FA + " ?", qv(x), M(qT(x)) + ".")], traps: [TR(qv(qm(qa([a, b], [sgn * c, e]), [f, g])), "La multiplication passe avant l'addition.")] }); },
      () => { const [a, b] = irr(), [c, e] = irr(), [f, g] = irr(), x = qs([a, b], qs([c, e], [f, g]));
        return Qv("Calcule et simplifie : " + M(fT(a, b) + " - \\left(" + fT(c, e) + " - " + fT(f, g) + "\\right)") + FA, qv(x), "Parenthèse : " + M(qT(qs([c, e], [f, g]))) + " ; puis " + M(fT(a, b) + " - " + (qv(qs([c, e], [f, g])) < 0 ? "\\left(" + qT(qs([c, e], [f, g])) + "\\right)" : qT(qs([c, e], [f, g]))) + " = " + qT(x)) + ".",
          { ctx: "parenthese", guide: [GS("Parenthèse" + FA + " ?", qv(qs([c, e], [f, g])), M(qT(qs([c, e], [f, g]))) + "."), GS("Résultat" + FA + " ?", qv(x), M(qT(x)) + ".")], traps: [TR(qv(qs(qs([a, b], [c, e]), [f, g])), "Le « − » devant la parenthèse change le signe de " + fT(f, g).replace(/\\frac\{(\d+)\}\{(\d+)\}/, "$1/$2") + ".")] }); },
      () => { const [a, b] = irr(), [c, d] = irr(), k = pk([2, 3, -2, 4]), x = qd(qs([a, b], [c, d]), [k, 1]);
        return Qv("Calcule et simplifie : " + M("\\left(" + fT(a, b) + " - " + fT(c, d) + "\\right) : " + par(k)) + FA, qv(x), "Parenthèse : " + M(qT(qs([a, b], [c, d]))) + ", divisée par " + M(par(k)) + " : " + M(qT(x)) + ".",
          { ctx: "div-entier", guide: [GS("Parenthèse" + FA + " ?", qv(qs([a, b], [c, d])), M(qT(qs([a, b], [c, d]))) + "."), GS("Divisée par " + M(par(k)) + FA + " ?", qv(x), M(qT(x)) + ".")], traps: [TR(qv(qm(qs([a, b], [c, d]), [k, 1])), "Diviser par " + k + ", c'est multiplier par 1/" + k + "."), TR(-qv(x), "Attention au signe.")] }); },
    ],
    3: [
      () => { const [a, b] = irrS(), [c, d] = irrS(), [e, f] = irrS(), [g, h] = irrS(), num = qs([a, b], [c, d]), den = qa([e, f], [g, h]); if (num[0] === 0) return null; const x = qd(num, den); if (Math.abs(x[0]) > 60 || Math.abs(x[1]) > 60) return null;
        return Qv("Calcule et simplifie : " + M("\\dfrac{" + fT(a, b) + " - " + fT(c, d) + "}{" + fT(e, f) + " + " + fT(g, h) + "}") + FA, qv(x), "Numérateur " + M(qT(num)) + ", dénominateur " + M(qT(den)) + " ; quotient " + M(qT(x)) + ".",
          { ctx: "fraction-etagee", guide: [GS("Numérateur" + FA + " ?", qv(num), M(qT(num)) + "."), GS("Dénominateur" + FA + " ?", qv(den), M(qT(den)) + "."), GS("Quotient" + FA + " ?", qv(x), M(qT(x)) + ".")], traps: [TR(qv(qm(num, den)), "Une fraction de fractions est un quotient : multiplie par l'inverse du dénominateur.")] }); },
      () => { const [a, b] = irrS(), [c, d] = irrS(), x = qs(qm([-a, b], [-a, b]), [c, d]);
        return Qv("Calcule et simplifie : " + M("\\left(" + fT(-a, b) + "\\right)^2 - " + fT(c, d)) + FA, qv(x), M("\\left(" + fT(-a, b) + "\\right)^2 = " + fT(a * a, b * b)) + " (positif) ; puis " + M(qT(x)) + ".",
          { ctx: "carre", guide: [GS("Carré" + FA + " ?", (a * a) / (b * b), M(fT(a * a, b * b)) + "."), GS("Résultat" + FA + " ?", qv(x), M(qT(x)) + ".")], traps: [TR(qv(qs([-a * a, b * b], [c, d])), "Le carré d'un nombre négatif est positif."), TR(qv(qs([2 * a, b], [c, d])), "Au carré, on multiplie le nombre par lui-même (pas par 2).")] }); },
      () => { const [p1, q1] = pk([[1, 3], [1, 4], [2, 5], [1, 5]]), [p2, q2] = pk([[1, 2], [1, 3], [3, 4], [2, 3]]), rest = qm(qs([1, 1], [p1, q1]), qs([1, 1], [p2, q2])), V = pk([60, 120, 240, 300]), v = qv(rest) * V; if (!Number.isInteger(v)) return null;
        return Qv("Un réservoir contient " + M(V) + " L. On utilise " + M(fT(p1, q1)) + " du contenu, puis " + M(fT(p2, q2)) + " de ce qui reste. Combien de litres reste-t-il ?", v, "Il reste " + M("\\left(1 - " + fT(p1, q1) + "\\right) \\cdot \\left(1 - " + fT(p2, q2) + "\\right) = " + qT(rest)) + " du contenu, soit " + M(v) + " L.",
          { ctx: "reservoir", guide: [GS("Fraction restante après le 1er prélèvement" + FA + " ?", 1 - p1 / q1, M(qT(qs([1, 1], [p1, q1]))) + "."), GS("Fraction finale" + FA + " ?", qv(rest), M(qT(rest)) + "."), GS("Litres restants ?", v, M(v) + " L.")], traps: [TR(V * (1 - p1 / q1 - p2 / q2), "« De ce qui reste » : la 2e fraction porte sur le reste, pas sur le tout."), TR(V * qv(qm([p1, q1], [p2, q2])), "On demande ce qui RESTE.")] }); },
    ],
  };

  // ===================== rac =====================
  const CUB = (k) => (k < 0 ? "(" + k + ")" : k) + "^3"; // 22.11 : racines cubiques en 11e (MER 11e, Nombres réels › Racines, NO89–NO97)
  const RA0 = { // 22.11 : réservoir ; réparti ci-dessous entre rac (9e-10e) et racprop (11e)
    1: [
      () => { const k = R.int(2, 20);
        return Qv("Calcule " + M("\\sqrt{" + k * k + "}") + ".", k, M("\\sqrt{" + k * k + "} = " + k) + " car " + M(k + "^2 = " + k * k) + ".",
          { ctx: "carre-parfait", fig: FIG.areaSquare("aire " + k * k), guide: [GS("Essaie " + M(k - 1) + " : " + M((k - 1) + "^2") + " = ?", (k - 1) ** 2, M((k - 1) ** 2) + " : un peu moins que " + M(k * k) + "."), GS("Donc " + M("\\sqrt{" + k * k + "}") + " = ?", k, M(k) + ".")], traps: [TR((k * k) / 2, "La racine n'est pas la moitié."), TR(k * k, "Il faut le nombre qui, au carré, donne " + k * k + ".")] }); },
      () => { const [k, kind] = pk([[pk([3, 4, 5, 6, 7, 8, 9]) / 10, "dec"], [pk([1, 2, 3]) / 10, "dec"], [0, "frac"]]); if (kind === "frac") { const n = R.int(1, 6), d = n + R.int(1, 6); return Qv("Calcule " + M("\\sqrt{\\frac{" + n * n + "}{" + d * d + "}}") + FA + ".", n / d, M("\\frac{\\sqrt{" + n * n + "}}{\\sqrt{" + d * d + "}} = \\frac{" + n + "}{" + d + "}") + ".", { ctx: "racine-fraction", guide: [GS(M("\\sqrt{" + n * n + "}") + " ?", n, M(n) + "."), GS(M("\\sqrt{" + d * d + "}") + " ?", d, M(d) + "."), GS("Résultat" + FA + " ?", n / d, M("\\frac{" + n + "}{" + d + "}") + ".")], traps: [TR((n * n) / (d * d) / 2, "On prend la racine du numérateur et du dénominateur."), TR(n * n / d, "Racine du dénominateur aussi.")] }); }
        const sq = r6(k * k);
        return Qv("Calcule " + M("\\sqrt{" + N(sq) + "}") + ".", k, M(N(k) + "^2 = " + N(sq)) + ", donc " + M("\\sqrt{" + N(sq) + "} = " + N(k)) + ".",
          { ctx: "racine-decimal", guide: [GS(M(N(sq)) + " = " + M(N(sq * 100)) + " : 100. Racine de " + M(N(sq * 100)) + " ?", r6(k * 10), M(N(k * 10)) + "."), GS("Divisée par 10 (racine de 100) ?", k, M(N(k)) + ".")], traps: [TR(r6(Math.sqrt(sq * 10)), "Attention à la virgule : vérifie en élevant au carré."), TR(r6(k / 10), "Vérifie : " + N(k / 10) + "² = " + N(k * k / 100) + ".")] }); },
      () => { const s = R.int(4, 15), x = pk([["Un jardin carré a une aire de " + M(s * s) + " m². Quelle est la longueur de son côté (en m) ?", "jardin"], ["Un carrelage carré a une aire de " + M(s * s) + " cm². Combien mesure son côté (en cm) ?", "carrelage"], ["Un terrain carré a une aire de " + M(s * s * 100) + " m². Quelle est la longueur de son côté (en m) ?", "terrain"]]), v = x[1] === "terrain" ? s * 10 : s;
        return Qv(x[0], v, "Côté " + M("= \\sqrt{" + (x[1] === "terrain" ? s * s * 100 : s * s) + "} = " + v) + ".",
          { ctx: x[1], fig: FIG.areaSquare("aire " + (x[1] === "terrain" ? s * s * 100 : s * s)), guide: [GS("Côté = racine de l'aire : ?", v, M(v) + ".")], traps: [TR((x[1] === "terrain" ? s * s * 100 : s * s) / 4, "Diviser par 4 donne le côté à partir du PÉRIMÈTRE, pas de l'aire."), TR((x[1] === "terrain" ? s * s * 100 : s * s) / 2, "La racine n'est pas la moitié.")] }); },
      () => { const k = pk([2, 3, 4, 5, 6, 7, 8, 9, 10]) * (R.rand() < 0.35 ? -1 : 1), v = k ** 3;
        return Qv("Calcule " + M("\\sqrt[3]{" + TH(v) + "}") + ".", k, M(CUB(k) + " = " + TH(v)) + ", donc " + M("\\sqrt[3]{" + TH(v) + "} = " + k) + (k < 0 ? " : la racine cubique d'un nombre négatif est négative." : "."),
          { ctx: k < 0 ? "racine-cubique-neg" : "racine-cubique", guide: [GS("Quel nombre, multiplié trois fois par lui-même, donne " + M(TH(v)) + " ? Essaie " + M(Math.abs(k)) + " : " + M(Math.abs(k) + "^3") + " = ?", Math.abs(k) ** 3, M(TH(Math.abs(k) ** 3)) + "."), GS("Donc la racine cubique (attention au signe) ?", k, M(k) + ".")],
            traps: [TR(r6(v / 3), "La racine cubique n'est pas le tiers : on cherche le nombre dont le cube vaut " + TH(v) + "."), TR(-k, "Le cube garde le signe : " + M(CUB(k) + " = " + TH(v)) + ".")] }); },
      () => { const k = pk([3, 4, 5, 6, 8, 10, 12, 15, 20]), V = k ** 3, x = pk([["Une boîte cubique a un volume de " + M(TH(V) + "\\text{ cm}^3") + ". Combien mesure son arête (en cm) ?", "boite"], ["Un dé géant a un volume de " + M(TH(V) + "\\text{ cm}^3") + ". Quelle est la longueur de son arête (en cm) ?", "de"], ["Un aquarium cubique contient " + M(TH(V / 1000)) + " L quand il est plein (" + M("1\\text{ L} = 1\\,000\\text{ cm}^3") + "). Quelle est son arête intérieure (en cm) ?", "aquarium"]]);
        if (x[1] === "aquarium" && V % 1000) return RA0[1][0]();
        return Qv(x[0], k, "Arête " + M("= \\sqrt[3]{" + TH(V) + "} = " + k) + " cm, car " + M(k + "^3 = " + TH(V)) + ".",
          { ctx: "arete-" + x[1], guide: [GS("Volume en cm³ ?", V, M(TH(V)) + " cm³."), GS("Arête = racine cubique du volume :", k, M(k) + " cm.")], traps: [TR(r6(V / 3), "Le volume n'est pas trois fois l'arête : on prend la racine cubique."), TR(r6(Math.sqrt(V)), "Racine cubique, pas racine carrée : le volume est un cube.")] }); },
    ],
    2: [
      () => { const n = pk([20, 40, 70, 100, 150, 300, 500, 888, 1400, 2000, 3000]) * (R.rand() < 0.3 ? -1 : 1), lo = Math.floor(Math.cbrt(n)), lo2 = Number.isInteger(Math.cbrt(n)) ? null : lo;
        if (lo2 === null) return RA0[2][0]();
        return Qv("Sans calculatrice, " + M("\\sqrt[3]{" + TH(n) + "}") + " est compris entre deux entiers consécutifs. Donne le plus petit.", lo, M(CUB(lo) + " = " + TH(lo ** 3) + " < " + TH(n) + " < " + TH((lo + 1) ** 3) + " = " + CUB(lo + 1)) + ", donc " + M(lo + " < \\sqrt[3]{" + TH(n) + "} < " + (lo + 1)) + ".",
          { ctx: n < 0 ? "encadrer-cubique-neg" : "encadrer-cubique", guide: [GS("Le cube de " + M(lo + 1) + " ?", (lo + 1) ** 3, M(TH((lo + 1) ** 3)) + "."), GS("Le cube de " + M(lo) + " ?", lo ** 3, M(TH(lo ** 3)) + "."), GS("Plus petit entier ?", lo, M(lo) + ".")],
            traps: [TR(lo + 1, "C'est le plus grand des deux entiers."), TR(Math.floor(Math.sqrt(Math.abs(n))), "Racine cubique, pas racine carrée.")] }); },
      () => { const [c, m] = pk([[2, 3], [2, 5], [3, 2], [3, 4], [4, 2], [5, 2], [6, 5], [2, 7], [3, 5]]), n = c ** 3 * m;
        return Qv("On écrit " + M("\\sqrt[3]{" + TH(n) + "} = a\\sqrt[3]{" + m + "}") + ". Que vaut " + M("a") + " ?", c, M("\\sqrt[3]{" + TH(n) + "} = \\sqrt[3]{" + c ** 3 + " \\cdot " + m + "} = " + c + "\\sqrt[3]{" + m + "}") + ".",
          { ctx: "extraire-cubique", guide: [GS(M(TH(n) + " \\div " + m) + " ?", c ** 3, M(c ** 3) + ", un cube parfait."), GS("Racine cubique de " + M(c ** 3) + " ?", c, M(c) + ".")], traps: [TR(c ** 3, "On sort la racine cubique de " + c ** 3 + ", pas le nombre lui-même."), TR(n / m / 2, "C'est un cube, pas un carré : cherche le nombre dont le cube vaut " + c ** 3 + ".")] }); },
      () => { const k = R.int(2, 7), m = pk([2, 3, 5, 6, 7]);
        return Qv("Écris " + M("\\sqrt{" + k * k * m + "}") + " sous la forme " + M("a\\sqrt{b}") + " (touche √).", k * Math.sqrt(m), M("\\sqrt{" + k * k + " \\cdot " + m + "} = " + k + "\\sqrt{" + m + "}") + ".",
          { ctx: "simplifier", radical: true, canon: k + "√" + m, guide: [GS("Plus grand carré parfait qui divise " + M(k * k * m) + " ?", k * k, M(k * k * m + " = " + k * k + " \\cdot " + m) + "."), GSR("Résultat ?", k * Math.sqrt(m), M(k + "\\sqrt{" + m + "}") + ".")], traps: [TR(k * k * Math.sqrt(m), "On sort la racine du carré : √" + k * k + " = " + k + "."), TR(m * Math.sqrt(k * k), "Le facteur qui sort est la racine du carré parfait.")] }); },
      () => { const [a, b, r] = pk([[2, 8, 4], [3, 12, 6], [2, 18, 6], [3, 27, 9], [5, 20, 10], [2, 32, 8], [6, 24, 12], [3, 48, 12]]), sw = R.rand() < 0.5;
        return Qv("Calcule " + M("\\sqrt{" + (sw ? b : a) + "} \\cdot \\sqrt{" + (sw ? a : b) + "}") + ".", r, M("\\sqrt{" + a + " \\cdot " + b + "} = \\sqrt{" + a * b + "} = " + r) + ".",
          { ctx: "produit-entier", guide: [GS("Produit sous la racine " + M(a + " \\cdot " + b) + " ?", a * b, M(a * b) + "."), GS("Racine ?", r, M(r) + ".")], traps: [TR(r6(Math.sqrt(a) + Math.sqrt(b)), "√a · √b = √(a · b), pas √a + √b."), TR(a * b, "N'oublie pas la racine.")] }); },
      () => { const [n, d, r] = pk([[72, 2, 6], [75, 3, 5], [98, 2, 7], [48, 3, 4], [80, 5, 4], [128, 2, 8], [63, 7, 3], [50, 2, 5]]);
        return Qv("Calcule " + M("\\frac{\\sqrt{" + n + "}}{\\sqrt{" + d + "}}") + ".", r, M("\\sqrt{\\frac{" + n + "}{" + d + "}} = \\sqrt{" + n / d + "} = " + r) + ".",
          { ctx: "quotient", guide: [GS(M(n + " : " + d) + " ?", n / d, M(n / d) + "."), GS("Racine ?", r, M(r) + ".")], traps: [TR(n / d, "N'oublie pas la racine."), TR(r6(Math.sqrt(n) - Math.sqrt(d)), "√a : √b = √(a : b).")] }); },
    ],
    3: [
      () => { const m = pk([2, 3, 5]), a = R.int(2, 4), b = R.int(2, 5);
        return Qv("Simplifie : " + M("\\sqrt{" + a * a * m + "} + \\sqrt{" + b * b * m + "}") + " (forme " + M("a\\sqrt{b}") + ").", (a + b) * Math.sqrt(m), M(a + "\\sqrt{" + m + "} + " + b + "\\sqrt{" + m + "} = " + (a + b) + "\\sqrt{" + m + "}") + ".",
          { ctx: "somme", radical: true, canon: (a + b) + "√" + m, guide: [GSR("Première racine simplifiée ?", a * Math.sqrt(m), M(a + "\\sqrt{" + m + "}") + "."), GSR("Seconde ?", b * Math.sqrt(m), M(b + "\\sqrt{" + m + "}") + "."), GSR("Somme ?", (a + b) * Math.sqrt(m), M((a + b) + "\\sqrt{" + m + "}") + ".")], traps: [TR(r6(Math.sqrt(a * a * m + b * b * m)), "√x + √y n'est pas √(x + y) : simplifie chaque racine d'abord.")] }); },
      () => { const k = R.int(2, 6), m = pk([2, 3, 5, 7]), v = k * k * m;
        return Qv("Calcule " + M("\\left(" + k + "\\sqrt{" + m + "}\\right)^2") + ".", v, M(k + "^2 \\cdot \\left(\\sqrt{" + m + "}\\right)^2 = " + k * k + " \\cdot " + m + " = " + v) + ".",
          { ctx: "carre-radical", guide: [GS(M(k + "^2") + " ?", k * k, M(k * k) + "."), GS(M("\\left(\\sqrt{" + m + "}\\right)^2") + " ?", m, M(m) + "."), GS("Produit ?", v, M(v) + ".")], traps: [TR(k * m, "Le " + k + " est aussi élevé au carré."), TR(2 * k * m, "Au carré, on multiplie par lui-même.")] }); },
      () => { const c = R.int(2, 12), x = pk([["la diagonale d'un carré de côté " + M(c) + " cm", 2, "diag-carre"], ["la diagonale d'un rectangle de " + M(c) + " cm sur " + M(c) + " cm", 2, "diag-carre"], ["la hauteur d'un triangle équilatéral de côté " + M(2 * c) + " cm", 3, "hauteur"]]), v = c * Math.sqrt(x[1]);
        return Qv("Calcule la valeur exacte de " + x[0] + " (forme " + M("a\\sqrt{b}") + ").", v, x[2] === "hauteur" ? M("h^2 = " + (2 * c) + "^2 - " + c + "^2 = " + 3 * c * c) + ", donc " + M("h = " + c + "\\sqrt{3}") + " cm." : M("d^2 = " + c + "^2 + " + c + "^2 = " + 2 * c * c) + ", donc " + M("d = " + c + "\\sqrt{2}") + " cm.",
          { ctx: x[2], radical: true, canon: c + "√" + x[1], guide: [GS("Pythagore : carré de la longueur cherchée ?", x[1] * c * c, M(x[1] * c * c) + "."), GSR("Valeur exacte ?", v, M(c + "\\sqrt{" + x[1] + "}") + ".")], traps: [TR(x[1] * c, "On prend la racine de " + x[1] * c * c + " : " + c + "√" + x[1] + "."), TR(r6(c * x[1] / 2), "Utilise Pythagore.")] }); },
      () => { const [a, b, r] = pk([[4, 16, 4], [2, 32, 4], [9, 3, 3], [25, 5, 5], [3, 72, 6], [2, 4, 2], [4, 54, 6], [5, 200, 10]]), sw = R.rand() < 0.5;
        return Qv("Calcule " + M("\\sqrt[3]{" + (sw ? b : a) + "} \\cdot \\sqrt[3]{" + (sw ? a : b) + "}") + ".", r, M("\\sqrt[3]{" + a + " \\cdot " + b + "} = \\sqrt[3]{" + a * b + "} = " + r) + ".",
          { ctx: "produit-cubique", guide: [GS("Produit sous la racine " + M(a + " \\cdot " + b) + " ?", a * b, M(a * b) + "."), GS("Racine cubique ?", r, M(r) + " car " + M(r + "^3 = " + a * b) + ".")], traps: [TR(r6(Math.cbrt(a) + Math.cbrt(b)), "On multiplie les racines, on n'additionne pas."), TR(a * b, "N'oublie pas la racine cubique du produit.")] }); },
      () => { const s2 = R.int(3, 12), c = R.int(2, 6) * (R.rand() < 0.6 ? -1 : 1), v = s2 + c;
        if (v === 0 || v === 1) return RA0[3][RA0[3].length - 1]();
        return Qv("Calcule " + M("\\sqrt{" + s2 * s2 + "} + \\sqrt[3]{" + TH(c ** 3) + "}") + ".", v, M(s2 + (c < 0 ? " - " + -c : " + " + c) + " = " + v) + ", car " + M(CUB(c) + " = " + TH(c ** 3)) + ".",
          { ctx: "carree-cubique", guide: [GS(M("\\sqrt{" + s2 * s2 + "}") + " ?", s2, M(s2) + "."), GS(M("\\sqrt[3]{" + TH(c ** 3) + "}") + " ?", c, M(c) + "."), GS("Somme ?", v, M(v) + ".")], traps: [TR(s2 - c, "La racine cubique d'un négatif est négative : " + M("\\sqrt[3]{" + TH(c ** 3) + "} = " + c) + ".")] }); },
    ],
  };


  // 22.11 (programme, remarque de l'enseignant) : en 9e-10e, racines CARRÉES (calcul, décimaux, encadrement, côté d'un
  // carré) et calcul simple de racines cubiques (cubes parfaits positifs, arête d'un cube) ; AUCUNE propriété.
  // Les propriétés (√(a·b), √(a÷b), extraire, additionner) et les racines cubiques négatives, extractions et
  // encadrements de racines cubiques sont en 11e : notion racprop.
  const cubeSimple = () => { const k = pk([2, 3, 4, 5, 6, 10]), v = k ** 3;
    return Qv("Calcule " + M("\\sqrt[3]{" + TH(v) + "}") + ".", k, M(k + "^3 = " + TH(v)) + ", donc " + M("\\sqrt[3]{" + TH(v) + "} = " + k) + ".",
      { ctx: "racine-cubique", guide: [GS("Le cube de " + M(k) + " (" + M(k + " \\cdot " + k + " \\cdot " + k) + ") ?", v, M(TH(v)) + "."), GS("Donc la racine cubique ?", k, M(k) + ".")],
        traps: [TR(r6(v / 3), "La racine cubique n'est pas le tiers : on cherche le nombre dont le cube vaut " + TH(v) + "."), TR(r6(Math.sqrt(v)), "Racine cubique, pas racine carrée.")] }); };
  const RA = {
    1: [RA0[1][0], RA0[1][1], RA0[1][2], cubeSimple],
    2: [
      () => { const n = R.int(20, 300), f = Math.floor(Math.sqrt(n)); if (f * f === n) return RA[2][0]();
        return Qv("Sans calculatrice, " + M("\\sqrt{" + n + "}") + " est compris entre deux entiers consécutifs. Donne le plus petit.", f, M(f + "^2 = " + f * f + " < " + n + " < " + (f + 1) ** 2 + " = " + (f + 1) + "^2") + ", donc " + M(f + " < \\sqrt{" + n + "} < " + (f + 1)) + ".",
          { ctx: "encadrer", guide: [GS("Plus grand entier dont le carré est inférieur à " + M(n) + " ?", f, M(f + "^2 = " + f * f) + "."), GS("Donc le plus petit des deux entiers ?", f, M(f) + ".")], traps: [TR(f + 1, "C'est le plus grand des deux entiers."), TR(Math.round(n / 2), "La racine n'est pas la moitié.")] }); },
      () => { const s2 = R.int(6, 25), A = s2 * s2, x = pk([["Une salle carrée a une aire de " + M(A) + " m². Quel est son périmètre (en m) ?", "salle"], ["Un tapis carré mesure " + M(A) + " dm². Quelle longueur de galon faut-il pour en faire le tour (en dm) ?", "tapis"], ["Un champ carré a une aire de " + M(A) + " a (" + M("1\\text{ a} = 100\\text{ m}^2") + "). Quel est son périmètre (en m) ?", "champ"]]);
        const side = x[1] === "champ" ? s2 * 10 : s2, per = 4 * side;
        return Qv(x[0], per, "Côté " + M("= \\sqrt{" + (x[1] === "champ" ? A * 100 : A) + "} = " + side) + " ; périmètre " + M("4 \\cdot " + side + " = " + per) + ".",
          { ctx: "perimetre-" + x[1], guide: [GS("Côté (racine de l'aire) ?", side, M(side) + "."), GS("Périmètre ?", per, M(per) + ".")], traps: [TR(A / 4, "Le côté se trouve avec la racine carrée, pas en divisant l'aire par 4."), TR(side, "C'est le côté ; on demande le tour complet.")] }); },
      RA0[1][4],
    ],
    3: [
      () => { const [a, b] = pk([[2, 8], [3, 12], [4, 9], [2, 18], [5, 20], [3, 27], [4, 25], [8, 18]]), c = Math.sqrt(a * b), x = pk([["un rectangle de " + M(a) + " m sur " + M(b) + " m", "rectangle"], ["une terrasse rectangulaire de " + M(a) + " m sur " + M(b) + " m", "terrasse"]]);
        return Qv("Un carré a la même aire que " + x[0] + ". Quel est le côté du carré (en m) ?", c, "Aire " + M(a + " \\cdot " + b + " = " + a * b) + " m² ; côté " + M("\\sqrt{" + a * b + "} = " + c) + " m.",
          { ctx: "meme-aire-" + x[1], guide: [GS("Aire du rectangle ?", a * b, M(a * b) + " m²."), GS("Côté du carré (racine de l'aire) ?", c, M(c) + " m.")], traps: [TR((a + b) / 2, "La moyenne des côtés ne donne pas la même aire."), TR(a * b, "C'est l'aire ; le côté est sa racine.")] }); },
      () => { const [p1, p2, q] = pk([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17]]);
        return Qv("Deux carrés ont des côtés de " + M(p1) + " cm et " + M(p2) + " cm. Quel est le côté d'un carré dont l'aire est la somme de leurs aires (en cm) ?", q, "Aires " + M(p1 * p1 + " + " + p2 * p2 + " = " + q * q) + " cm² ; côté " + M("\\sqrt{" + q * q + "} = " + q) + " cm.",
          { ctx: "deux-carres", guide: [GS("Somme des aires ?", q * q, M(q * q) + " cm²."), GS("Côté (racine) ?", q, M(q) + " cm.")], traps: [TR(p1 + p2, "On additionne les aires, pas les côtés.")] }); },
      () => { const k = pk([3, 4, 5, 6, 10]), V = k ** 3, A = 6 * k * k;
        return Qv("Un cube a un volume de " + M(TH(V) + "\\text{ cm}^3") + ". Quelle est l'aire totale de ses six faces (en cm²) ?", A, "Arête " + M("\\sqrt[3]{" + TH(V) + "} = " + k) + " cm ; une face " + M(k + "^2 = " + k * k) + " cm² ; six faces " + M(TH(A)) + " cm².",
          { ctx: "cube-aire", guide: [GS("Arête (racine cubique du volume) ?", k, M(k) + " cm."), GS("Aire d'une face ?", k * k, M(k * k) + " cm²."), GS("Aire totale ?", A, M(TH(A)) + " cm².")], traps: [TR(k * k, "C'est une seule face : le cube en a six.")] }); },
    ],
  };
  // 11e : propriétés des racines (carrées et cubiques), MER 11e Nombres réels › Racines (NO89–NO97)
  const RP = {
    1: [RA0[1][3], RA0[2][3], RA0[3][1]],
    2: [RA0[2][2], RA0[2][4], RA0[2][1], RA0[2][0]],
    3: [RA0[3][0], RA0[3][2], RA0[3][3], RA0[3][4]],
  };
  /* 25.11 (audit de niveau 11e, tools/niveau_11.md ; étalon : test 1.2 « Calcul numérique et racines » de la 11LS) : le
     niveau 3 s'arrêtait à √(a²m) + √(b²m) avec a, b ≤ 5, loin du test (√968, ∛−72000, −6√28 − 7√175 + 3√700,
     √300 · √112, quotients). Formes ajoutées au niveau du test ; les anciennes restent. */
  const SQF = [2, 3, 5, 6, 7, 10, 11];
  const twoP = () => { const p = pk([2, 3, 5, 7]); let q; do q = pk([2, 3, 5, 7, 11]); while (q === p); return [p, q]; };
  const rT = (k, m) => (k === 1 ? "" : k === -1 ? "-" : k) + "\\sqrt{" + m + "}"; /* k√m en TeX */
  RP[2].push(() => { let k, m; do { k = R.int(8, 22); m = pk(SQF); } while (k * k * m > 3000);
    const n = k * k * m;
    return Qv("Écris " + M("\\sqrt{" + TH(n) + "}") + " sous la forme " + M("a\\sqrt{b}") + ", avec " + M("b") + " le plus petit possible (touche √).", k * Math.sqrt(m), M("\\sqrt{" + TH(n) + "} = \\sqrt{" + k * k + " \\cdot " + m + "} = " + k + "\\sqrt{" + m + "}") + ".",
      { ctx: "extraire-grand", radical: true, canon: k + "√" + m,
        guide: [GS("Plus grand carré parfait qui divise " + M(TH(n)) + " ?", k * k, M(TH(n) + " = " + k * k + " \\cdot " + m) + "."), GS("Racine de ce carré parfait ?", k, M("\\sqrt{" + k * k + "} = " + k) + "."), GSR("Résultat ?", k * Math.sqrt(m), M(k + "\\sqrt{" + m + "}") + ".")],
        traps: [TR(k * k * Math.sqrt(m), "On sort la racine du carré parfait : " + M("\\sqrt{" + k * k + "} = " + k) + ", pas " + k * k + "."), TR(m * k, "Le facteur qui sort est la racine du carré parfait ; " + m + " reste sous la racine.")] }); });
  RP[2].push(() => { let c, m; do { c = pk([2, 3, 4, 5, 6, 10, 20]); m = pk([2, 3, 4, 5, 6, 7, 9]); } while (c ** 3 * m > 100000);
    const s = R.rand() < 0.5 ? -1 : 1, n = s * c ** 3 * m, a = s * c;
    return Qv("On écrit " + M("\\sqrt[3]{" + TH(n) + "} = a\\sqrt[3]{" + m + "}") + ". Que vaut " + M("a") + " ?", a,
      M("\\sqrt[3]{" + TH(n) + "} = \\sqrt[3]{" + (s < 0 ? "(" + TH(-(c ** 3)) + ")" : TH(c ** 3)) + " \\cdot " + m + "} = " + a + "\\sqrt[3]{" + m + "}") + (s < 0 ? " : la racine cubique d'un nombre négatif est négative." : "."),
      { ctx: s < 0 ? "extraire-cubique-neg" : "extraire-cubique-grand",
        guide: [GS("Plus grand cube parfait qui divise " + M(TH(c ** 3 * m)) + " ?", c ** 3, M(TH(c ** 3 * m) + " = " + TH(c ** 3) + " \\cdot " + m) + "."), GS("Racine cubique de ce cube, avec le signe ?", a, M(a) + ".")],
        traps: [TR(-a, s < 0 ? "La racine cubique d'un nombre négatif est négative." : "Le nombre est positif : sa racine cubique aussi."), TR(s * c * c, "On cherche un cube parfait (" + c + " · " + c + " · " + c + "), pas un carré.")] }); });
  RP[3].push(() => { const m = pk([2, 3, 5, 6, 7]); let ks, cs, tot;
    do { ks = [R.int(2, 10), R.int(2, 10), R.int(2, 10)]; cs = [0, 1, 2].map(() => pk([2, 3, 4, 5, 6, 7]) * (R.rand() < 0.5 ? -1 : 1)); tot = cs[0] * ks[0] + cs[1] * ks[1] + cs[2] * ks[2]; }
    while (new Set(ks).size < 3 || ks.some((k) => k * k * m > 1000) || Math.abs(tot) < 2);
    const term = (i) => (i ? (cs[i] < 0 ? " - " : " + ") : cs[i] < 0 ? "-" : "") + Math.abs(cs[i]) + "\\sqrt{" + ks[i] * ks[i] * m + "}";
    const simp = (i) => (i ? (cs[i] * ks[i] < 0 ? " - " : " + ") : cs[i] * ks[i] < 0 ? "-" : "") + Math.abs(cs[i] * ks[i]) + "\\sqrt{" + m + "}";
    const E = term(0) + term(1) + term(2);
    return Qv("Écris " + M(E) + " sous la forme " + M("a\\sqrt{b}") + ", avec " + M("b") + " le plus petit possible.", tot * Math.sqrt(m),
      M(E + " = " + simp(0) + simp(1) + simp(2) + " = " + rT(tot, m)) + " : on simplifie chaque racine, puis on additionne les racines semblables.",
      { ctx: "somme-coef", radical: true, canon: tot + "√" + m,
        guide: [GSR("Simplifie le premier terme " + M(term(0)) + " :", cs[0] * ks[0] * Math.sqrt(m), M(rT(cs[0] * ks[0], m)) + "."),
          GS("Les trois termes sont des multiples de " + M("\\sqrt{" + m + "}") + ". Somme des nombres devant " + M("\\sqrt{" + m + "}") + " ?", tot, M(cs[0] * ks[0] + (cs[1] * ks[1] < 0 ? " - " : " + ") + Math.abs(cs[1] * ks[1]) + (cs[2] * ks[2] < 0 ? " - " : " + ") + Math.abs(cs[2] * ks[2]) + " = " + tot) + "."),
          GSR("Résultat ?", tot * Math.sqrt(m), M(rT(tot, m)) + ".")],
        traps: [TR((cs[0] + ks[0] + cs[1] + ks[1] + cs[2] + ks[2]) * Math.sqrt(m), "Le nombre qui sort de la racine se MULTIPLIE par le coefficient : " + M(Math.abs(cs[0]) + "\\sqrt{" + ks[0] * ks[0] * m + "} = " + Math.abs(cs[0]) + " \\cdot " + ks[0] + "\\sqrt{" + m + "}") + "."),
          TR((Math.abs(cs[0] * ks[0]) + Math.abs(cs[1] * ks[1]) + Math.abs(cs[2] * ks[2])) * Math.sqrt(m), "Attention aux signes « − » devant les termes.")] }); });
  RP[3].push(() => { const [p, q] = twoP(), a = R.int(2, 6), b = R.int(2, 6), c = pk([1, 2, 3]), A = a * a * p, B = b * b * q, k = c * a * b;
    return Qv("Calcule " + M(rT(c, A) + " \\cdot \\sqrt{" + B + "}") + " et écris le résultat sous la forme " + M("a\\sqrt{b}") + ", avec " + M("b") + " le plus petit possible.", k * Math.sqrt(p * q),
      M("\\sqrt{" + A + "} = " + a + "\\sqrt{" + p + "}") + " et " + M("\\sqrt{" + B + "} = " + b + "\\sqrt{" + q + "}") + " ; " + M((c > 1 ? c + " \\cdot " : "") + a + " \\cdot " + b + " \\cdot \\sqrt{" + p + " \\cdot " + q + "} = " + k + "\\sqrt{" + p * q + "}") + ".",
      { ctx: "produit-radicaux", radical: true, canon: k + "√" + p * q,
        guide: [GSR("Simplifie " + M("\\sqrt{" + A + "}") + " :", a * Math.sqrt(p), M(a + "\\sqrt{" + p + "}") + "."), GSR("Simplifie " + M("\\sqrt{" + B + "}") + " :", b * Math.sqrt(q), M(b + "\\sqrt{" + q + "}") + "."),
          GSR("Multiplie les nombres devant, et les racines entre elles :", k * Math.sqrt(p * q), M(k + "\\sqrt{" + p * q + "}") + ".")],
        traps: [TR(k * p * q, M("\\sqrt{" + p + "} \\cdot \\sqrt{" + q + "} = \\sqrt{" + p * q + "}") + " : la racine reste."), TR(k * (Math.sqrt(p) + Math.sqrt(q)), "On multiplie les racines, on ne les additionne pas.")] }); });
  RP[3].push(() => { let p, q, a, N0; do { [p, q] = twoP(); a = R.int(2, 5); N0 = a * a * p * q; } while (N0 > 1500);
    const [c, d] = pk([[1, 1], [2, 1], [6, 2], [4, 2], [6, 3], [9, 3], [10, 5]]), f = c / d;
    return Qv("Écris " + M("\\frac{" + rT(c, N0) + "}{" + rT(d, p) + "}") + " sous la forme " + M("a\\sqrt{b}") + ", avec " + M("b") + " le plus petit possible.", f * a * Math.sqrt(q),
      M("\\frac{" + rT(c, N0) + "}{" + rT(d, p) + "} = " + (f !== 1 ? f + " \\cdot " : "") + "\\sqrt{\\frac{" + N0 + "}{" + p + "}} = " + (f !== 1 ? f + " \\cdot " : "") + "\\sqrt{" + a * a * q + "} = " + f * a + "\\sqrt{" + q + "}") + ".",
      { ctx: "quotient-radicaux", radical: true, canon: f * a + "√" + q,
        guide: [...(f !== 1 ? [GS("Quotient des nombres devant les racines " + M(c + " \\div " + d) + " ?", f, M(f) + ".")] : []), GS("Quotient sous la racine " + M(N0 + " \\div " + p) + " ?", a * a * q, M(a * a * q) + "."),
          GSR("Simplifie et termine :", f * a * Math.sqrt(q), M(f * a + "\\sqrt{" + q + "}") + ".")],
        traps: [TR(f * a * q, "La racine de " + q + " reste : " + M("\\sqrt{" + a * a * q + "} = " + a + "\\sqrt{" + q + "}") + "."), TR(f * a * a * Math.sqrt(q), "On sort la racine de " + a * a + ", soit " + a + ".")] }); });

  // ===================== carres : carrés parfaits, cubes, racines exactes (20.11, révision de 10e en 11e) =====================
  const TH = (v) => { let [i, f] = String(r6(v)).split("."); if (i.replace("-", "").length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}"); return i + (f ? "{,}" + f : ""); };
  const TRIP = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25], [12, 16, 20]];
  const CA = {
    1: [
      () => { const k = R.int(6, 15);
        return Qv("Calcule : " + M("\\sqrt{" + k * k + "}"), k, M(k + "^2 = " + k * k) + ", donc " + M("\\sqrt{" + k * k + "} = " + k) + ".",
          { ctx: "racine", guide: [GS("Quel est le carré de " + M(k - 1) + " ?", (k - 1) ** 2, M((k - 1) ** 2) + " : trop petit."), GS("Et le carré de " + M(k) + " ?", k * k, M(k * k) + " : c'est le nombre sous la racine."), GS(M("\\sqrt{" + k * k + "}") + " = ?", k, M(k) + ".")],
            traps: [TR((k * k) / 2, "La racine carrée n'est pas la moitié : on cherche le nombre qui, multiplié par lui-même, donne " + k * k + "."), TR(k + 1, M((k + 1) + "^2 = " + (k + 1) ** 2) + ", trop grand.")] }); },
      () => { const k = R.int(11, 19);
        return Qv("Calcule de tête : " + M(k + "^2"), k * k, M(k + "^2 = " + k + " \\cdot " + k + " = " + k + " \\cdot 10 + " + k + " \\cdot " + (k - 10) + " = " + 10 * k + " + " + k * (k - 10) + " = " + k * k) + ".",
          { ctx: "carre", guide: [GS(M(k + " \\cdot 10") + " = ?", 10 * k, M(10 * k) + "."), GS(M(k + " \\cdot " + (k - 10)) + " = ?", k * (k - 10), M(k * (k - 10)) + "."), GS(M(k + "^2") + " = ?", k * k, M(10 * k + " + " + k * (k - 10) + " = " + k * k) + ".")],
            traps: [TR(2 * k, M(k + "^2") + ", c'est " + k + " · " + k + ", pas " + k + " · 2."), TR(100 + (k - 10) ** 2, "(10 + " + (k - 10) + ")² n'est pas 10² + " + (k - 10) + "² : il manque le double produit.")] }); },
      () => { const k = pk([2, 3, 4, 5, 6, 10]);
        return Qv("Calcule : " + M("\\sqrt[3]{" + TH(k ** 3) + "}"), k, M(k + "^3 = " + k + " \\cdot " + k + " \\cdot " + k + " = " + TH(k ** 3)) + ", donc " + M("\\sqrt[3]{" + TH(k ** 3) + "} = " + k) + ".",
          { ctx: "cube", guide: [GS("Quel est le cube de " + M(k) + " (" + M(k + " \\cdot " + k + " \\cdot " + k) + ") ?", k ** 3, M(TH(k ** 3)) + "."), GS(M("\\sqrt[3]{" + TH(k ** 3) + "}") + " = ?", k, M(k) + ".")],
            traps: [TR(k ** 3 / 3, "La racine cubique n'est pas le tiers : on cherche le nombre dont le cube vaut " + k ** 3 + "."), TR(Math.sqrt(k ** 3), "Racine cubique, pas racine carrée.")] }); },
      () => { const k = R.int(5, 15), c = pk([["Un carré a une aire de " + M(k * k + "\\text{ cm}^2") + ". Quelle est la longueur de son côté (en cm) ?", "aire"], ["Un potager carré mesure " + M(k * k + "\\text{ m}^2") + ". Quelle longueur de clôture faut-il pour un seul de ses côtés (en m) ?", "potager"], ["On veut ranger " + M(k * k) + " chaises en un carré parfait (autant de rangées que de chaises par rangée). Combien de chaises par rangée ?", "chaises"]]);
        return Qv(c[0], k, "Côté " + M("= \\sqrt{" + k * k + "} = " + k) + " (car " + M(k + "^2 = " + k * k) + ").",
          { ctx: c[1], guide: [GS("Le côté au carré donne " + M(k * k) + " : côté " + M("= \\sqrt{" + k * k + "}") + " = ?", k, M(k) + ".")],
            traps: [TR((k * k) / 4, "On ne divise pas par 4 (ça, c'est pour le périmètre)."), TR((k * k) / 2, "La racine n'est pas la moitié.")] }); },
    ],
    2: [
      () => { const a = pk([4, 9, 16, 25, 36, 49]), b = pk([4, 9, 25, 64, 81, 100].filter((x) => x !== a)), v = Math.sqrt(a * b);
        return Qv("Calcule : " + M("\\sqrt{" + a + " \\cdot " + b + "}"), v, M("\\sqrt{" + a + " \\cdot " + b + "} = \\sqrt{" + a + "} \\cdot \\sqrt{" + b + "} = " + Math.sqrt(a) + " \\cdot " + Math.sqrt(b) + " = " + v) + ".",
          { ctx: "produit", guide: [GS(M("\\sqrt{" + a + "}") + " = ?", Math.sqrt(a), M(Math.sqrt(a)) + "."), GS(M("\\sqrt{" + b + "}") + " = ?", Math.sqrt(b), M(Math.sqrt(b)) + "."), GS("Produit ?", v, M(Math.sqrt(a) + " \\cdot " + Math.sqrt(b) + " = " + v) + ".")],
            traps: [TR(Math.sqrt(a) + Math.sqrt(b), "√(a · b) = √a · √b : on multiplie, on n'additionne pas."), TR(a * b, "N'oublie pas la racine.")] }); },
      () => { const k = pk([2, 3, 4, 5, 6, 7, 8, 9, 11, 12]), big = k > 9, n = big ? k * k / 100 : k * k / 100, v = k / 10;
        return Qv("Calcule : " + M("\\sqrt{" + N(n) + "}"), v, M(N(n) + " = \\frac{" + k * k + "}{100}") + ", donc " + M("\\sqrt{" + N(n) + "} = \\frac{" + k + "}{10} = " + N(v)) + ".",
          { ctx: "decimal", guide: [GS("Écris " + M(N(n)) + " en centièmes : " + M(N(n) + " = \\frac{?}{100}") + ". Numérateur ?", k * k, M(k * k) + "."), GS(M("\\sqrt{" + k * k + "}") + " = ?", k, M(k) + "."), GS(M("\\sqrt{" + N(n) + "} = \\frac{" + k + "}{\\sqrt{100}}") + " = ?", v, M(N(v)) + ".")],
            traps: [TR(k / 100, M("\\sqrt{100} = 10") + ", pas 100 : " + M("\\sqrt{" + N(n) + "} = " + N(v)) + "."), TR(n / 2, "La racine n'est pas la moitié.")] }); },
      () => { const [a, b, c] = pk(TRIP);
        return Qv("Calcule : " + M("\\sqrt{" + a + "^2 + " + b + "^2}"), c, M("\\sqrt{" + a * a + " + " + b * b + "} = \\sqrt{" + c * c + "} = " + c) + ".",
          { ctx: "somme-carres", guide: [GS(M(a + "^2 + " + b + "^2") + " = ?", c * c, M(a * a + " + " + b * b + " = " + c * c) + "."), GS(M("\\sqrt{" + c * c + "}") + " = ?", c, M(c) + ".")],
            traps: [TR(a + b, "√(a² + b²) ≠ a + b : on calcule d'abord la somme sous la racine."), TR(c * c, "N'oublie pas la racine.")] }); },
      () => { const [p, q] = pk([[1, 4], [4, 9], [9, 16], [1, 9], [16, 25], [4, 25], [9, 49], [25, 36]]), v = Math.sqrt(p) / Math.sqrt(q);
        return Qv("Calcule : " + M("\\sqrt{\\frac{" + p + "}{" + q + "}}") + FA + ".", v, M("\\frac{\\sqrt{" + p + "}}{\\sqrt{" + q + "}} = \\frac{" + Math.sqrt(p) + "}{" + Math.sqrt(q) + "}") + ".",
          { ctx: "fraction", canon: Math.sqrt(p) + "/" + Math.sqrt(q), guide: [GS("Racine du numérateur ?", Math.sqrt(p), M(Math.sqrt(p)) + "."), GS("Racine du dénominateur ?", Math.sqrt(q), M(Math.sqrt(q)) + "."), GS(M("\\sqrt{\\frac{" + p + "}{" + q + "}}") + " = ?", v, M("\\frac{" + Math.sqrt(p) + "}{" + Math.sqrt(q) + "}") + ".")],
            traps: [TR(p / q / 2, "La racine n'est pas la moitié."), TR(p / Math.sqrt(q), "Il faut prendre la racine du numérateur aussi.")] }); },
    ],
    3: [
      () => { const k = pk([2, 3, 4, 5]), neg = R.rand() < 0.5, dec = !neg, v = neg ? -k : k / 10, n = neg ? -(k ** 3) : (k ** 3) / 1000;
        return Qv("Calcule : " + M("\\sqrt[3]{" + N(n) + "}"), v, neg ? M("(" + -k + ")^3 = " + -(k ** 3)) + " : la racine cubique d'un nombre négatif existe, " + M("\\sqrt[3]{" + n + "} = " + -k) + "." : M(N(n) + " = \\frac{" + k ** 3 + "}{1000}") + " et " + M("\\sqrt[3]{1000} = 10") + " : " + M("\\sqrt[3]{" + N(n) + "} = " + N(v)) + ".",
          { ctx: neg ? "cube-negatif" : "cube-decimal", guide: neg ? [GS("Cube de " + M(k) + " ?", k ** 3, M(k ** 3) + "."), GS("Un cube garde le signe : " + M("(" + -k + ")^3") + " = ?", -(k ** 3), M(-(k ** 3)) + "."), GS(M("\\sqrt[3]{" + n + "}") + " = ?", v, M(v) + ".")] : [GS(M(N(n)) + " en millièmes : numérateur ?", k ** 3, M(N(n) + " = \\frac{" + k ** 3 + "}{1000}") + "."), GS(M("\\sqrt[3]{" + k ** 3 + "}") + " = ?", k, M(k) + "."), GS(M("\\sqrt[3]{" + N(n) + "}") + " = ?", v, M(N(v)) + " (car " + M("\\sqrt[3]{1000} = 10") + ").")],
            traps: neg ? [TR(k, "Le cube d'un négatif est négatif : la racine cubique de " + n + " est négative.")] : [TR(k / 100, M("\\sqrt[3]{1000} = 10") + ", donc on divise par 10."), TR(k / 1000, "La racine cubique de 1000 est 10, pas 1000.")] }); },
      () => { const n = R.int(30, 400), f = Math.floor(Math.sqrt(n)); if (f * f === n) return null; const v = (f + 1) ** 2;
        return Qv("Quel est le plus petit carré parfait strictement supérieur à " + M(n) + " ?", v, M(f + "^2 = " + f * f + " < " + n + " < " + (f + 1) + "^2 = " + v) + " : c'est " + M(v) + ".",
          { ctx: "encadrer", guide: [GS("Plus grand entier dont le carré est inférieur à " + M(n) + " ?", f, M(f + "^2 = " + f * f) + "."), GS("Carré suivant, " + M((f + 1) + "^2") + " = ?", v, M(v) + ".")],
            traps: [TR(f * f, M(f * f) + " est plus petit que " + n + "."), TR(f + 1, "On demande le carré parfait, pas sa racine.")] }); },
      () => { const k = pk([2, 3, 4, 5, 6, 10]), V = k ** 3, A = 6 * k * k, c = pk([["Un dé cubique a un volume de " + M(TH(V) + "\\text{ cm}^3") + ". Quelle est l'aire totale de ses six faces (en cm²) ?", "de"], ["Une boîte cubique contient exactement " + M(TH(V) + "\\text{ cm}^3") + ". Combien de cm² de carton faut-il pour ses six faces ?", "boite"], ["Un bloc de glace cubique a un volume de " + M(TH(V) + "\\text{ dm}^3") + ". Quelle est l'aire de ses six faces (en dm²) ?", "glace"]]);
        return Qv(c[0], A, "Arête " + M("= \\sqrt[3]{" + TH(V) + "} = " + k) + " ; une face : " + M(k + "^2 = " + k * k) + " ; six faces : " + M("6 \\cdot " + k * k + " = " + A) + ".",
          { ctx: "cube-" + c[1], guide: [GS("Arête " + M("= \\sqrt[3]{" + TH(V) + "}") + " = ?", k, M(k) + "."), GS("Aire d'une face ?", k * k, M(k + "^2 = " + k * k) + "."), GS("Aire des six faces ?", A, M("6 \\cdot " + k * k + " = " + A) + ".")],
            traps: [TR(k * k, "C'est l'aire d'une seule face ; un cube en a six."), TR(V / 6, "On passe par l'arête : racine cubique du volume.")] }); },
      () => { const [a, b, v] = pk([[2, 8, 4], [3, 12, 6], [2, 18, 6], [5, 20, 10], [3, 27, 9], [2, 32, 8], [6, 24, 12]]);
        return Qv("Calcule : " + M("\\sqrt{" + a + "} \\cdot \\sqrt{" + b + "}"), v, M("\\sqrt{" + a + "} \\cdot \\sqrt{" + b + "} = \\sqrt{" + a + " \\cdot " + b + "} = \\sqrt{" + a * b + "} = " + v) + ".",
          { ctx: "produit-racines", guide: [GS("On regroupe sous une seule racine : " + M(a + " \\cdot " + b) + " = ?", a * b, M(a * b) + "."), GS(M("\\sqrt{" + a * b + "}") + " = ?", v, M(v) + ".")],
            traps: [TR(Math.sqrt(a + b), "√a · √b = √(a · b), pas √(a + b)."), TR(a * b, "N'oublie pas la racine.")] }); },
    ],
  };
  // 22.11 : en 10e, ni propriété (√a · √b, √(p ÷ q)) ni racine cubique négative ou décimale : formes retirées.
  CA[2] = [CA[2][1], CA[2][2], () => { const k = R.int(11, 30), v = k * k;
    return Qv("Quel nombre positif a pour carré " + M(TH(v)) + " ?", k, M(k + "^2 = " + TH(v)) + ", donc " + M("\\sqrt{" + TH(v) + "} = " + k) + ".",
      { ctx: "carre-3chiffres", guide: [GS("Le carré de " + M(Math.floor(k / 10) * 10) + " ?", (Math.floor(k / 10) * 10) ** 2, M((Math.floor(k / 10) * 10) ** 2) + " : on est proche."), GS("Le nombre ?", k, M(k) + ".")], traps: [TR(v / 2, "On cherche le nombre qui, multiplié par lui-même, donne " + TH(v) + ".")] }); }];
  CA[3] = [CA[3][1], CA[3][2], () => { const [a, b, c] = pk(TRIP), A = c * c;
    return Qv("Calcule " + M("\\sqrt{" + a + "^2 + " + b + "^2}") + ".", c, M(a + "^2 + " + b + "^2 = " + a * a + " + " + b * b + " = " + A) + ", et " + M("\\sqrt{" + A + "} = " + c) + ".",
      { ctx: "racine-somme", guide: [GS("Somme sous la racine ?", A, M(A) + "."), GS("Racine ?", c, M(c) + ".")], traps: [TR(a + b, "La racine d'une somme n'est pas la somme des racines.")] }); }];

  // ===================== pctvar : augmentation et diminution en pourcentage (20.11) =====================
  const PV = {
    1: [
      () => { const t = pk([5, 10, 15, 20, 25, 30, 50]), p = 20 * R.int(2, 15), inc = (p * t) / 100, v = p + inc, c = pk([["Un article coûte", "son prix augmente"], ["Un abonnement de fitness coûte", "son prix augmente"], ["Une place de concert coûte", "le prix augmente"]]);
        return Qv(c[0] + " " + M(p) + " CHF ; " + c[1] + " de " + M(t + "\\,\\%") + ". Nouveau prix (en CHF) ?", v, "Augmentation : " + M("\\frac{" + t + "}{100} \\cdot " + p + " = " + N(inc)) + " CHF ; nouveau prix " + M(p + " + " + N(inc) + " = " + N(v)) + " CHF.",
          { ctx: "hausse", guide: [GS("Montant de l'augmentation : " + M(t + "\\,\\%") + " de " + M(p) + " = ?", inc, M(N(inc)) + " CHF."), GS("Nouveau prix ?", v, M(p + " + " + N(inc) + " = " + N(v)) + " CHF.")],
            traps: [TR(inc, "C'est l'augmentation ; il faut l'ajouter au prix de départ."), TR(p + t, "On ajoute " + t + " %, pas " + t + " CHF.")] }); },
      () => { const t = pk([10, 15, 20, 25, 30, 40]), p = 20 * R.int(2, 15), red = (p * t) / 100, v = p - red, c = pk([["Un jean à", "est soldé"], ["Un vélo à", "bénéficie d'une réduction"], ["Une console à", "est en promotion"]]);
        return Qv(c[0] + " " + M(p) + " CHF " + c[1] + " de " + M(t + "\\,\\%") + ". Combien le paie-t-on (en CHF) ?", v, "Réduction : " + M("\\frac{" + t + "}{100} \\cdot " + p + " = " + N(red)) + " CHF ; prix " + M(p + " - " + N(red) + " = " + N(v)) + " CHF.",
          { ctx: "baisse", guide: [GS("Montant de la réduction ?", red, M(N(red)) + " CHF."), GS("Prix payé ?", v, M(p + " - " + N(red) + " = " + N(v)) + " CHF.")],
            traps: [TR(red, "C'est la réduction ; il faut la retirer du prix."), TR(p - t, "On retire " + t + " %, pas " + t + " CHF.")] }); },
      () => { const t = pk([3, 5, 8, 12, 15, 20, 25, 40, 60]), up = R.rand() < 0.5, v = 1 + (up ? t : -t) / 100;
        return Qv((up ? "Augmenter" : "Diminuer") + " une quantité de " + M(t + "\\,\\%") + " revient à la multiplier par quel nombre ?", v, M("100\\,\\% " + (up ? "+ " : "- ") + t + "\\,\\% = " + (100 + (up ? t : -t)) + "\\,\\%") + ", soit " + M(N(v)) + ".",
          { ctx: "coefficient", guide: [GS("On garde 100 % de la quantité, " + (up ? "plus" : "moins") + " " + M(t + "\\,\\%") + " : combien de % au total ?", 100 + (up ? t : -t), M(100 + (up ? t : -t) + "\\,\\%") + "."), GS("En nombre décimal (÷ 100) ?", v, M(N(v)) + ".")],
            traps: [TR(t / 100, "Multiplier par " + N(t / 100) + " donnerait seulement le montant de la variation."), TR(1 + (up ? -t : t) / 100, up ? "Augmenter : le coefficient est plus grand que 1." : "Diminuer : le coefficient est plus petit que 1.")] }); },
    ],
    2: [
      () => { const a = 20 * R.int(2, 15), t = pk([-40, -25, -20, -10, 10, 15, 20, 25, 50, 75]), b = (a * (100 + t)) / 100, c = pk(["Le prix d'un article passe", "Le nombre d'abonnés d'une chaîne passe", "La fréquentation d'une piscine passe"]);
        return Qv(c + " de " + M(a) + " à " + M(N(b)) + ". Quel est le pourcentage de variation ? (Réponds par un nombre, négatif pour une baisse.)", t, "Variation : " + M(N(b) + " - " + a + " = " + N(b - a)) + " ; " + M("\\frac{" + N(b - a) + "}{" + a + "} = " + N(t / 100)) + ", soit " + M(t + "\\,\\%") + ".",
          { ctx: "taux", guide: [GS("Variation (arrivée − départ) ?", b - a, M(N(b - a)) + "."), GS("On divise par la valeur de départ " + M(a) + " : ?", t / 100, M(N(t / 100)) + "."), GS("En pour cent ?", t, M(t + "\\,\\%") + ".")],
            traps: [TR(r6(((b - a) / b) * 100), "Le pourcentage se calcule sur la valeur de DÉPART, pas d'arrivée."), TR(-t, "Attention au signe : " + (t > 0 ? "c'est une hausse." : "c'est une baisse."))] }); },
      () => { const t = pk([10, 20, 25, 50, 60, 5]), p = 20 * R.int(2, 12), np = r6(p * (1 + t / 100));
        return Qv("Après une augmentation de " + M(t + "\\,\\%") + ", un article coûte " + M(N(np)) + " CHF. Quel était son prix avant (en CHF) ?", p, "Le prix a été multiplié par " + M(N(1 + t / 100)) + " ; on divise : " + M(N(np) + " \\div " + N(1 + t / 100) + " = " + p) + " CHF.",
          { ctx: "avant-hausse", guide: [GS("Par quel nombre le prix de départ a-t-il été multiplié ?", 1 + t / 100, M(N(1 + t / 100)) + "."), GS("Prix de départ " + M("= " + N(np) + " \\div " + N(1 + t / 100)) + " = ?", p, M(p) + " CHF.")],
            traps: [TR(r6(np * (1 - t / 100)), "On ne retire pas " + t + " % du nouveau prix : la hausse portait sur l'ancien."), TR(r6(np - t), "Ce sont des pourcents, pas des francs.")] }); },
      () => { const c = pk([["Un loyer mensuel de", "augmente de", 1, [1200, 1500, 1800, 2000, 2400]], ["Un salaire mensuel de", "augmente de", 1, [4000, 4500, 5000, 6000]], ["La facture d'électricité annuelle de", "baisse de", -1, [800, 900, 1200, 1500]]]), p = pk(c[3]), t = pk([2, 3, 4, 5, 8]), v = r6(p * (1 + (c[2] * t) / 100));
        return Qv(c[0] + " " + M(TH(p)) + " CHF " + c[1] + " " + M(t + "\\,\\%") + ". Nouveau montant (en CHF) ?", v, M(TH(p) + " \\cdot " + N(1 + (c[2] * t) / 100) + " = " + TH(v)) + " CHF.",
          { ctx: "quotidien", guide: [GS("Coefficient multiplicateur ?", 1 + (c[2] * t) / 100, M(N(1 + (c[2] * t) / 100)) + "."), GS("Nouveau montant ?", v, M(TH(p) + " \\cdot " + N(1 + (c[2] * t) / 100) + " = " + TH(v)) + " CHF.")],
            traps: [TR(r6((p * t) / 100), "C'est seulement la variation."), TR(r6(p * (1 - (c[2] * t) / 100)), c[2] > 0 ? "Le montant augmente." : "Le montant baisse.")] }); },
    ],
    3: [
      () => { const a = pk([10, 20, 25, 50]), b = pk([10, 20, 25, 40, 50]), v = r6(((1 + a / 100) * (1 - b / 100) - 1) * 100); if (v === 0 || a === b && R.rand() < 0.3) return null;
        return Qv("Un prix augmente de " + M(a + "\\,\\%") + ", puis baisse de " + M(b + "\\,\\%") + ". Quelle est la variation globale en pour cent ? (Négatif pour une baisse.)", v, "Coefficients " + M(N(1 + a / 100)) + " puis " + M(N(1 - b / 100)) + " ; " + M(N(1 + a / 100) + " \\cdot " + N(1 - b / 100) + " = " + N(r6((1 + a / 100) * (1 - b / 100)))) + ", soit " + M((v > 0 ? "+" : "") + N(v) + "\\,\\%") + ".",
          { ctx: "successives", guide: [GS("Coefficient de la hausse ?", 1 + a / 100, M(N(1 + a / 100)) + "."), GS("Coefficient de la baisse ?", 1 - b / 100, M(N(1 - b / 100)) + "."), GS("Coefficient global (produit) ?", r6((1 + a / 100) * (1 - b / 100)), M(N(r6((1 + a / 100) * (1 - b / 100)))) + "."), GS("Variation en % ?", v, M(N(v) + "\\,\\%") + ".")],
            traps: [TR(a - b, "Les pourcentages ne s'additionnent pas : la baisse porte sur le prix déjà augmenté."), TR(-v, "Attention au signe.")] }); },
      () => { const t = pk([10, 20, 25, 40]), x = 20 * R.int(3, 20), y = r6(x * (1 - t / 100));
        return Qv("Après une baisse de " + M(t + "\\,\\%") + ", un prix vaut " + M(N(y)) + " CHF. Quel était le prix de départ (en CHF) ?", x, M(N(y) + " \\div " + N(1 - t / 100) + " = " + x) + " CHF (on divise, on n'ajoute pas " + t + " %).",
          { ctx: "avant-baisse", guide: [GS("Coefficient de la baisse ?", 1 - t / 100, M(N(1 - t / 100)) + "."), GS("Prix de départ " + M("= " + N(y) + " \\div " + N(1 - t / 100)) + " = ?", x, M(x) + " CHF.")],
            traps: [TR(r6(y * (1 + t / 100)), "Ajouter " + t + " % au prix soldé ne redonne pas le prix de départ."), TR(r6(y + t), "Ce sont des pourcents, pas des francs.")] }); },
      () => { const ht = 10 * R.int(3, 60), ttc = r6(ht * 1.081), ask = pk(["ht", "tva"]), C = (v) => (Number.isInteger(v) ? String(v) : v.toFixed(2).replace(".", "{,}"));
        return Qv("En Suisse, la TVA normale est de " + M("8{,}1\\,\\%") + ". Un appareil coûte " + M(C(ttc)) + " CHF TVA comprise. " + (ask === "ht" ? "Quel est son prix hors taxe (en CHF) ?" : "Quel est le montant de la TVA (en CHF) ?"), ask === "ht" ? ht : r6(ttc - ht), "Prix hors taxe " + M("= " + C(ttc) + " \\div 1{,}081 = " + ht) + " CHF" + (ask === "tva" ? " ; TVA " + M("= " + C(ttc) + " - " + ht + " = " + C(r6(ttc - ht))) + " CHF" : "") + ".",
          { ctx: "tva-" + ask, guide: [GS("Coefficient de la TVA ?", 1.081, M("1 + 0{,}081 = 1{,}081") + "."), GS("Prix hors taxe ?", ht, M(C(ttc) + " \\div 1{,}081 = " + ht) + " CHF.")].concat(ask === "tva" ? [GS("Montant de la TVA ?", r6(ttc - ht), M(C(ttc) + " - " + ht + " = " + C(r6(ttc - ht))) + " CHF.")] : []),
            traps: [TR(r6(ttc * (1 - 0.081)), "Retirer 8,1 % du prix TTC ne donne pas le prix HT : la TVA est calculée sur le prix HT."), TR(r6(ttc * 0.081), "La TVA se calcule sur le prix hors taxe, pas sur le prix TTC.")] }); },
    ],
  };

  const PROBS = {
    carres: [() => P("Un carrelage carré est formé de 196 dalles carrées identiques de 30 cm de côté.", [["a) Nombre de dalles sur un côté", 14], ["b) Côté du carrelage (m)", 4.2], ["c) Aire du carrelage (m²)", 17.64]], ["√196.", "14 · 0,3 m."], "a) " + M("\\sqrt{196} = 14") + " ; b) " + M("14 \\cdot 0{,}3 = 4{,}2") + " m ; c) " + M("4{,}2^2 = 17{,}64") + " m².")],
    pctvar: [() => P("Un vélo coûte 800 CHF. Il augmente de 10 %, puis il est soldé à −20 %.", [["a) Prix après la hausse (CHF)", 880], ["b) Prix soldé (CHF)", 704], ["c) Variation globale (%, négatif pour une baisse)", -12]], ["800 · 1,1.", "880 · 0,8."], "a) 880 ; b) 704 ; c) " + M("1{,}1 \\cdot 0{,}8 = 0{,}88") + " : " + M("-12\\,\\%") + " (et non −10 %).")],
    rel: [() => P("À Genève, la température passe de −6 °C à 7 h à +9 °C à 14 h, puis baisse de 11 °C jusqu'à minuit.", [["a) Hausse entre 7 h et 14 h (°C)", 15], ["b) Température à minuit (°C)", -2], ["c) Moyenne des trois relevés (°C)", 1 / 3]], ["9 − (−6).", "9 − 11."], "a) " + M("9 - (-6) = 15") + " ; b) " + M("9 - 11 = -2") + " ; c) " + M("\\frac{-6 + 9 - 2}{3} = \\frac{1}{3}") + ".")],
    fracops: [() => P("Calcule A = 1/2 − 3/4 · 2/3 et B = (1/2 − 3/4) · 2/3 (fractions acceptées).", [["a) A", 0], ["b) B", -1 / 6], ["c) A − B", 1 / 6]], ["A : le produit d'abord.", "B : la parenthèse d'abord."], "a) " + M("\\frac{1}{2} - \\frac{1}{2} = 0") + " ; b) " + M("-\\frac{1}{4} \\cdot \\frac{2}{3} = -\\frac{1}{6}") + " ; c) " + M("\\frac{1}{6}") + ".")],
    racprop: [() => P("Un carré a une aire de 50 cm².", [["a) Son côté vaut a√2 : a ?", 5], ["b) Sa diagonale (cm)", 10], ["c) Aire du carré construit sur la diagonale (cm²)", 100]], ["√50 = √(25 · 2).", "Diagonale = côté · √2."], "a) " + M("5\\sqrt{2}") + " ; b) " + M("5\\sqrt{2} \\cdot \\sqrt{2} = 10") + " ; c) " + M("100") + ".")],
  };

  // « Trouve l'erreur » (24.11, chantier I, suite) : racine d'une somme, pourcentages successifs.
  const camarade = () => pk(["Sam", "Lina", "Noé", "Inès", "Yanis", "Léa"]);
  RA[2].push(() => { let [a, b, c] = pk([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20], [7, 24, 25]]); if (R.rand() < 0.5) [a, b] = [b, a]; const w = camarade();
    return Qv(w + " écrit : « " + M("\\sqrt{" + a * a + " + " + b * b + "} = \\sqrt{" + a * a + "} + \\sqrt{" + b * b + "} = " + a + " + " + b + " = " + (a + b)) + " ». Trouve l'erreur, puis calcule correctement " + M("\\sqrt{" + a * a + " + " + b * b + "}") + ".", c,
      "Erreur : la racine d'une somme n'est pas la somme des racines. On calcule d'abord sous la racine : " + M("\\sqrt{" + a * a + " + " + b * b + "} = \\sqrt{" + c * c + "} = " + c) + ". (Contrôle : " + M(c + "^2 = " + c * c) + ", alors que " + M((a + b) + "^2 = " + (a + b) * (a + b)) + ".)",
      { ctx: "erreur", guide: [GS("D'abord sous la racine : " + M(a * a + " + " + b * b) + " = ?", c * c, M(c * c) + "."), GS(M("\\sqrt{" + c * c + "}") + " = ?", c, M(c) + ", car " + M(c + "^2 = " + c * c) + ".")],
        traps: [TR(a + b, "C'est le résultat de " + w + " : " + M("\\sqrt{a + b} \\neq \\sqrt{a} + \\sqrt{b}") + ".")] }); });
  PV[2].push(() => { const t = pk([10, 20, 30, 40, 50]), p = pk([80, 120, 160, 200, 240, 400, 480]), p1 = r6(p * (1 + t / 100)), red = r6(p1 * t / 100), v = r6(p1 - red), w = camarade(), c = pk([["Le prix d'un vélo", "velo"], ["Le prix d'une trottinette", "trottinette"], ["Le prix d'un abonnement", "abonnement"]]);
    return Qv(c[0] + " de " + M(p) + " CHF augmente de " + M(t + "\\,\\%") + ", puis baisse de " + M(t + "\\,\\%") + ". " + w + " affirme : « +" + t + " % puis −" + t + " %, ça s'annule : on revient à " + M(p) + " CHF ». Trouve l'erreur, puis donne le prix final (en CHF).", v,
      "Erreur : la baisse se calcule sur le <b>nouveau</b> prix, plus grand. Hausse : " + M(p + " \\cdot " + N(1 + t / 100) + " = " + N(p1)) + " CHF ; baisse : " + M(N(p1) + " \\cdot " + N(1 - t / 100) + " = " + N(v)) + " CHF, moins que le prix de départ.",
      { ctx: "erreur", guide: [GS("Prix après la hausse de " + M(t + "\\,\\%") + " ?", p1, M(p + " \\cdot " + N(1 + t / 100) + " = " + N(p1)) + " CHF."), GS("Montant de la baisse : " + M(t + "\\,\\%") + " de " + M(N(p1)) + " ?", red, M(N(red)) + " CHF (plus que la hausse de " + M(N(r6(p * t / 100))) + " CHF)."), GS("Prix final ?", v, M(N(p1) + " - " + N(red) + " = " + N(v)) + " CHF.")],
        traps: [TR(p, "C'est l'affirmation de " + w + " : les deux " + t + " % ne portent pas sur le même prix."), TR(p1, "C'est le prix après la hausse ; il reste la baisse.")] }); });
  const ALL = { rel: RE, fracops: FO, rac: RA, racprop: RP, carres: CA, pctvar: PV };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => pickForm(lv[Math.min(Math.max(d, 1), 3)]);
    if (typeof VAR !== "undefined") VAR[id] = {};
    if (typeof PROB !== "undefined") delete PROB[id];
    PROB_EXTRA[id] = PROBS[id];
  }
  Object.assign(HINTS_EXTRA, {
    rel: "Addition : même signe → on additionne les distances ; signes contraires → on soustrait. Soustraire, c'est ajouter l'opposé. Produit : même signe → +.",
    fracops: "Signe d'abord, puis priorités : × et : avant + et −. Diviser, c'est multiplier par l'inverse. Simplifie à la fin (ou avant de multiplier).",
    rac: "La racine carrée de a est le nombre positif dont le carré vaut a : √49 = 7. Pour l'encadrer, cherche les carrés parfaits voisins : 7² = 49 < 55 < 64 = 8². La racine cubique de a est le nombre dont le cube vaut a : ∛125 = 5.",
    racprop: "√(a · b) = √a · √b et √(a ÷ b) = √a ÷ √b ; sors les carrés parfaits : √72 = √(36 · 2) = 6√2. On additionne seulement des racines semblables : 2√3 + 5√3 = 7√3. Mais √(a + b) ≠ √a + √b. Racine cubique : ∛(−8) = −2, ∛1080 = ∛(216 · 5) = 6∛5.",
    carres: "Carrés à connaître de 1 à 20 ; la racine carrée « défait » le carré, la racine cubique « défait » le cube. Attention : √(a + b) n'est pas √a + √b.",
    pctvar: "+t % : multiplier par 1 + t/100 ; −t % : par 1 − t/100. Pour revenir au départ, on divise. Variations successives : on multiplie les coefficients.",
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    rel: ["Additionner, soustraire, multiplier", "Priorités, puissances, écarts", "Expressions, moyennes, enchaînements"],
    fracops: ["Différence négative, produit, quotient", "Priorités, parenthèses", "Fractions étagées, carrés, problèmes"],
    rac: ["Carrés parfaits, décimaux, côté d'un carré, cubes parfaits", "Encadrer, périmètre à partir de l'aire, arête d'un cube", "Même aire, somme d'aires, aire d'un cube"],
    racprop: ["Racine cubique (aussi négative), produits, carré d'une racine", "Extraire (aussi de grands nombres), quotients, racine cubique (aussi négative), encadrer", "Sommes de racines (avec coefficients), produits et quotients de radicaux, longueurs exactes, √ + ∛"],
    carres: ["Racines, carrés, cubes, côté d'un carré", "Décimaux, sommes de carrés, carrés à 3 chiffres", "Encadrer, aire d'un cube, racine d'une somme"],
    pctvar: ["Hausse, réduction, coefficient", "Taux de variation, prix avant hausse, quotidien", "Variations successives, prix avant baisse, TVA"],
  });
})();

// Chantier 11e · 10. Fonctions (18.11, lot suivant du plan de cheminement) : repere (se repérer dans le plan) et tabval
// (tableau de valeurs). Même standard que les autres modules 11e : au moins 3 formes par niveau, pas à pas, erreurs
// typiques, ctx ; défis. (affine est déjà traité dans ch1c_sys.js.)
(function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; };
  const nz2 = (a, b) => { let v; do v = R.int(a, b); while (Math.abs(v) < 2); return v; }; // ni 0 ni ±1 (questions triviales)
  const keep = (value, traps) => { const seen = new Set(); return (traps || []).filter((t) => t && isFinite(t.v) && Math.abs(t.v - value) > 1e-9 && !seen.has(t.v) && seen.add(t.v)); };
  const Qv = (q, value, sol, o = {}) => { const x = { q, spec: { kind: "value", value }, sol, guide: o.guide, traps: keep(value, o.traps), ctx: o.ctx }; if (o.fig) x.fig = o.fig; return x; };
  const TR = TRAP;
  const P = (q, parts, hints, sol) => ({ q, parts: parts.map(([label, value]) => ({ label, spec: { kind: "value", value } })), hints, sol });
  const pt = (n, x, y) => M(n + "(" + x + " \\,;\\, " + y + ")");
  const pr = (v) => (v < 0 ? "(" + v + ")" : String(v));
  const lin = (a, b) => (a === 1 ? "" : a === -1 ? "-" : a) + "x" + (b ? (b < 0 ? " - " + -b : " + " + b) : "");
  const table = (xs, ys) => M("\\begin{array}{c|" + xs.map(() => "c").join("|") + "} x & " + xs.join(" & ") + " \\\\ \\hline f(x) & " + ys.join(" & ") + " \\end{array}");

  // ===================== repere =====================
  const REP = {
    1: [
      () => { const x = nz2(-5, 5), y = nz2(-4, 4), ask = R.int(0, 1);
        return Qv("Lis sur le graphique " + (ask ? "l'ordonnée" : "l'abscisse") + " du point " + M("A") + ".", ask ? y : x, M("A") + " a pour coordonnées " + pt("A", x, y) + " : " + (ask ? "ordonnée (lue sur l'axe vertical) " + y : "abscisse (lue sur l'axe horizontal) " + x) + ".",
          { ctx: ask ? "ordonnee" : "abscisse", fig: FIG.plot([], [[x, y, "A"]], { numbers: true }), guide: [GS((ask ? "L'ordonnée se lit sur l'axe vertical" : "L'abscisse se lit sur l'axe horizontal") + " : descends ou va horizontalement jusqu'à l'axe. Valeur ?", ask ? y : x, M(ask ? y : x) + ".")],
            traps: [TR(ask ? x : y, ask ? "Ça, c'est l'abscisse (axe horizontal). L'ordonnée se lit sur l'axe vertical." : "Ça, c'est l'ordonnée. L'abscisse se lit sur l'axe horizontal (on la donne en premier)."), TR(ask ? -y : -x, "Attention au signe : le point est " + (ask ? (y < 0 ? "sous" : "au-dessus de") + " l'axe horizontal." : (x < 0 ? "à gauche" : "à droite") + " de l'axe vertical."))] }); },
      () => { const x = nz2(-7, 7), y = nz2(-7, 7), axe = R.int(0, 1);
        return Qv("À quelle distance le point " + pt("P", x, y) + " est-il de l'axe " + (axe ? "des ordonnées (vertical)" : "des abscisses (horizontal)") + " ?", Math.abs(axe ? x : y), "La distance à l'axe " + (axe ? "vertical est la valeur absolue de l'abscisse" : "horizontal est la valeur absolue de l'ordonnée") + " : " + Math.abs(axe ? x : y) + ".",
          { ctx: axe ? "dist-y" : "dist-x", guide: [GS("Quelle coordonnée mesure l'écart à l'axe " + (axe ? "vertical : l'abscisse" : "horizontal : l'ordonnée") + ". Sa valeur ?", axe ? x : y, M(axe ? x : y) + "."), GS("Une distance est positive : ?", Math.abs(axe ? x : y), M(Math.abs(axe ? x : y)) + ".")],
            traps: [TR(Math.abs(axe ? y : x), "On s'éloigne de l'axe " + (axe ? "vertical en se déplaçant horizontalement : c'est l'abscisse qui compte." : "horizontal en se déplaçant verticalement : c'est l'ordonnée qui compte.")), TR(axe ? x : y, "Une distance est toujours positive.")] }); },
      () => { const x = nz2(-6, 6), y = nz2(-6, 6), s = pk(["o", "x", "y"]), img = s === "o" ? [-x, -y] : s === "x" ? [x, -y] : [-x, y], ask = R.int(0, 1);
        return Qv("Quel est " + (ask ? "l'ordonnée" : "l'abscisse") + " du symétrique de " + pt("A", x, y) + (s === "o" ? " par rapport à l'origine" : s === "x" ? " par rapport à l'axe des abscisses" : " par rapport à l'axe des ordonnées") + " ?", img[ask],
          "Symétrique " + (s === "o" ? "par rapport à l'origine : les deux coordonnées changent de signe" : s === "x" ? "par rapport à l'axe horizontal : seule l'ordonnée change de signe" : "par rapport à l'axe vertical : seule l'abscisse change de signe") + " : " + pt("A'", img[0], img[1]) + ".",
          { ctx: "sym-" + s, guide: [GS("Abscisse du symétrique ?", img[0], M(img[0]) + "."), GS("Ordonnée du symétrique ?", img[1], M(img[1]) + ". On demande " + (ask ? "l'ordonnée" : "l'abscisse") + " : " + M(img[ask]) + "."), GS("Réponse ?", img[ask], M(img[ask]) + ".")],
            traps: [TR(ask ? y : x, "Pour cette symétrie, " + (ask ? "l'ordonnée" : "l'abscisse") + " change " + (img[ask] === (ask ? y : x) ? "pas" : "de signe") + "."), TR(-img[ask], "Revois quelle coordonnée change de signe.")] }); },
    ],
    2: [
      () => { const x1 = R.int(-5, -1), y1 = R.int(-4, -1), w = R.int(3, 6), h = R.int(2, 5), s = R.int(1, 3), D = [x1 + s, y1 + h];
        return Qv("Trois sommets d'un parallélogramme " + M("ABCD") + " sont " + pt("A", x1, y1) + ", " + pt("B", x1 + w, y1) + " et " + pt("C", x1 + w + s, y1 + h) + ". Quelle est l'abscisse du sommet " + M("D") + " ?", D[0],
          "Pour aller de " + M("B") + " à " + M("C") + ", on avance de " + M(s) + " et on monte de " + M(h) + " ; de même de " + M("A") + " à " + M("D") + " : " + pt("D", D[0], D[1]) + ".",
          { ctx: "parallelogramme", fig: FIG.plot([], [[x1, y1, "A"], [x1 + w, y1, "B"], [x1 + w + s, y1 + h, "C"]], { numbers: true }), guide: [GS("De " + M("B") + " à " + M("C") + ", de combien avance-t-on horizontalement ?", s, M(s) + "."), GS("On fait le même déplacement depuis " + M("A") + " : abscisse de " + M("D") + " ?", D[0], M(x1 + " + " + s + " = " + D[0]) + ".")],
            traps: [TR(x1, "C'est l'abscisse de A ; dans un parallélogramme, D est décalé comme C l'est par rapport à B."), TR(x1 + w + s - w - s - s, "Le déplacement de B à C se reporte de A à D (même sens).")] }); },
      () => { let a, b, c, d; do { a = R.int(-6, 6); b = R.int(-6, 6); c = R.int(-6, 6); d = R.int(-6, 6); } while ((a + c) % 2 || (b + d) % 2 || (a === c && b === d) || Math.abs((a + c) / 2) < 2 || Math.abs((b + d) / 2) < 2); const ask = R.int(0, 1), m = [(a + c) / 2, (b + d) / 2];
        return Qv("Quelle est " + (ask ? "l'ordonnée" : "l'abscisse") + " du milieu " + M("M") + " du segment " + M("[AB]") + ", avec " + pt("A", a, b) + " et " + pt("B", c, d) + " ?", m[ask], "On fait la moyenne des coordonnées : " + pt("M", m[0], m[1]) + ".",
          { ctx: "milieu", guide: [GS("Somme des " + (ask ? "ordonnées" : "abscisses") + " ?", ask ? b + d : a + c, M(ask ? b + d : a + c) + "."), GS("Divisée par 2 ?", m[ask], M(m[ask]) + ".")], traps: [TR(ask ? b + d : a + c, "Il faut diviser la somme par 2."), TR(ask ? (d - b) / 2 : (c - a) / 2, "Le milieu, c'est la moyenne (somme ÷ 2), pas la demi-différence.")] }); },
      () => { const y = nz(-5, 5), x1 = R.int(-6, -1), x2 = x1 + R.int(2, 9);
        return Qv("Quelle est la longueur du segment d'extrémités " + pt("A", x1, y) + " et " + pt("B", x2, y) + " (unité : 1 carreau) ?", x2 - x1, "Même ordonnée : segment horizontal, longueur " + M(x2 + " - " + pr(x1) + " = " + (x2 - x1)) + ".",
          { ctx: "longueur", guide: [GS("Les deux points ont la même ordonnée : on soustrait les abscisses. " + M(x2 + " - " + pr(x1)) + " = ?", x2 - x1, M(x2 - x1) + ".")].concat([GS("Longueur ?", x2 - x1, M(x2 - x1) + ".")]), traps: [TR(x2 + x1, "On soustrait les abscisses (attention au signe de " + x1 + ")."), TR(Math.abs(x2) - Math.abs(x1), "Soustraire " + pr(x1) + ", c'est ajouter " + -x1 + ".")] }); },
    ],
    3: [
      () => { const x1 = R.int(-5, 0), y1 = R.int(-5, 0), w = R.int(3, 8), h = R.int(2, 6);
        return Qv("Calcule l'aire du rectangle de sommets " + pt("A", x1, y1) + ", " + pt("B", x1 + w, y1) + ", " + pt("C", x1 + w, y1 + h) + ", " + pt("D", x1, y1 + h) + " (en carreaux).", w * h, "Largeur " + M((x1 + w) + " - " + pr(x1) + " = " + w) + ", hauteur " + M((y1 + h) + " - " + pr(y1) + " = " + h) + ", aire " + M(w * h) + ".",
          { ctx: "aire", guide: [GS("Largeur " + M("AB") + " ?", w, M(w) + "."), GS("Hauteur " + M("BC") + " ?", h, M(h) + "."), GS("Aire ?", w * h, M(w * h) + ".")], traps: [TR(2 * (w + h), "Ça, c'est le périmètre."), TR((x1 + w) * (y1 + h), "Calcule les longueurs des côtés (différences des coordonnées), pas le produit des coordonnées de C.")] }); },
      () => { const a = nz(-3, 3), b = R.int(-4, 4), x = nz(-4, 4), y = a * x + b;
        return Qv("Le point " + pt("P", x, "y") + " est sur la droite d'équation " + M("y = " + lin(a, b)) + ". Que vaut " + M("y") + " ?", y, M("y = " + pr(a) + " \\cdot " + pr(x) + (b < 0 ? " - " + -b : " + " + b) + " = " + y) + ".",
          { ctx: "sur-droite", guide: [GS(M(pr(a) + " \\cdot " + pr(x)) + " = ?", a * x, M(a * x) + "."), GS(M("y") + " = ?", y, M(y) + ".")], traps: [TR(a + x + b, "On multiplie a par x."), TR(a * x - b, "Attention au signe de " + b + ".")] }); },
      () => { const x1 = R.int(-4, 1), y1 = R.int(-3, 2), x2 = x1 + R.int(2, 6), y3 = y1 + R.int(2, 6), xc = R.int(x1, x2);
        return Qv("Calcule l'aire du triangle de sommets " + pt("A", x1, y1) + ", " + pt("B", x2, y1) + " et " + pt("C", xc, y3) + " (en carreaux).", ((x2 - x1) * (y3 - y1)) / 2, "Base " + M("AB = " + (x2 - x1)) + " (horizontale), hauteur " + M((y3 - y1)) + " (écart vertical de C) : aire " + M("\\frac{" + (x2 - x1) + " \\cdot " + (y3 - y1) + "}{2} = " + String(((x2 - x1) * (y3 - y1)) / 2).replace(".", "{,}")) + ".",
          { ctx: "triangle", guide: [GS("Base " + M("AB") + " ?", x2 - x1, M(x2 - x1) + "."), GS("Hauteur (écart vertical entre C et [AB]) ?", y3 - y1, M(y3 - y1) + "."), GS("Aire ?", ((x2 - x1) * (y3 - y1)) / 2, M(String(((x2 - x1) * (y3 - y1)) / 2).replace(".", "{,}")) + ".")], traps: [TR((x2 - x1) * (y3 - y1), "Aire d'un triangle : base × hauteur ÷ 2.")] }); },
    ],
  };

  // ===================== tabval =====================
  const TAB = {
    1: [
      () => { const a = nz(-4, 5), b = nz(-8, 8), x = nz(-5, 5), v = a * x + b;
        return Qv("Soit " + M("f(x) = " + lin(a, b)) + ". Calcule " + M("f(" + x + ")") + " pour compléter le tableau de valeurs.", v, M("f(" + x + ") = " + pr(a) + " \\cdot " + pr(x) + (b < 0 ? " - " + -b : " + " + b) + " = " + v) + ".",
          { ctx: "affine", guide: [GS(M(pr(a) + " \\cdot " + pr(x)) + " = ?", a * x, M(a * x) + "."), GS(M("f(" + x + ")") + " = ?", v, M(v) + ".")], traps: [TR(a + x + b, "On remplace x par " + x + " et on multiplie."), TR(-a * x + b, "Attention aux signes du produit.")] }); },
      () => { const c = R.int(1, 9), x = -R.int(2, 6), v = x * x - c;
        return Qv("Soit " + M("f(x) = x^2 - " + c) + ". Calcule " + M("f(" + x + ")") + ".", v, M("f(" + x + ") = (" + x + ")^2 - " + c + " = " + x * x + " - " + c + " = " + v) + ".",
          { ctx: "carre", guide: [GS(M("(" + x + ")^2") + " = ? (un carré est positif)", x * x, M(x * x) + "."), GS(M("f(" + x + ")") + " = ?", v, M(v) + ".")], traps: [TR(-x * x - c, "(" + x + ")² est positif : " + x * x + "."), TR(2 * x - c, "x² n'est pas 2x.")] }); },
      () => { const a = nz(-3, 4), b = R.int(-5, 5), xs = [-2, -1, 0, 1, 2], k = R.int(0, 4), ys = xs.map((x, i) => (i === k ? "?" : a * x + b));
        return Qv("Ce tableau est celui d'une fonction affine. Complète la case « ? ». " + table(xs, ys), a * xs[k] + b, "Les valeurs augmentent de " + M(a) + " à chaque pas : la case vaut " + M(a * xs[k] + b) + ".",
          { ctx: "tableau", guide: [GS("De combien augmente " + M("f(x)") + " quand " + M("x") + " augmente de 1 ? (lis deux cases voisines connues)", a, M(a) + "."), GS("Valeur de la case « ? » ?", a * xs[k] + b, M(a * xs[k] + b) + ".")], traps: [TR(a * xs[k] + b + a, "Compte bien les pas entre la case connue et la case cherchée."), TR(a * xs[k] + b - a, "Compte bien les pas entre la case connue et la case cherchée.")] }); },
    ],
    2: [
      () => { const a = nz2(-4, 5), b = nz(-8, 8), x = nz2(-6, 7), v = a * x + b;
        return Qv("Soit " + M("f(x) = " + lin(a, b)) + ". Quel nombre a pour image " + M(v) + " ? (on cherche son antécédent)", x, M(lin(a, b) + " = " + v) + ", " + M(a + "x = " + (v - b)) + ", " + M("x = " + x) + ".",
          { ctx: "antecedent", guide: [GS("Résous " + M(lin(a, b) + " = " + v) + " : " + M(a + "x") + " = ?", v - b, M(a + "x = " + (v - b)) + "."), GS(M("x") + " = ?", x, M("x = " + x) + ".")], traps: [TR(a * v + b, "On cherche le x dont l'image vaut " + v + " (antécédent), pas l'image de " + v + "."), TR((v + b) / a, "Pour isoler ax, on soustrait " + b + ".")] }); },
      () => { const a = pk([2, 3, -2]), b = pk([-3, -1, 1, 4]), x = nz(-3, 3), v = a * x * x + b * x;
        return Qv("Soit " + M("f(x) = " + a + "x^2" + (b < 0 ? " - " + (b === -1 ? "" : -b) : " + " + (b === 1 ? "" : b)) + "x") + ". Calcule " + M("f(" + x + ")") + ".", v, M("f(" + x + ") = " + a + " \\cdot " + pr(x) + "^2 " + (b < 0 ? "-" : "+") + " " + Math.abs(b) + " \\cdot " + pr(x) + " = " + a * x * x + (b * x < 0 ? " - " + -b * x : " + " + b * x) + " = " + v) + ".",
          { ctx: "second-degre", guide: [GS(M(a + " \\cdot " + pr(x) + "^2") + " = ?", a * x * x, M(a * x * x) + "."), GS(M(b + " \\cdot " + pr(x)) + " = ?", b * x, M(b * x) + "."), GS(M("f(" + x + ")") + " = ?", v, M(v) + ".")], traps: [TR((a * x) ** 2 + b * x, "Le carré porte sur x seulement : a · x², pas (a · x)²."), TR(-a * x * x + b * x, "x² est positif.")] }); },
      () => { const pc = pk([5, 6, 8]), p = pk([2, 3, 2.5]), xs = [0, 5, 10, 20], k = R.int(1, 3), ys = xs.map((x, i) => (i === k ? "?" : String(+(pc + p * x).toFixed(2)).replace(".", "{,}")));
        return Qv("Une location coûte " + pc + " CHF plus " + String(p).replace(".", ",") + " CHF par heure. Complète le tableau (heures → prix en CHF). " + M("\\begin{array}{c|c|c|c|c} \\text{h} & " + xs.join(" & ") + " \\\\ \\hline \\text{CHF} & " + ys.join(" & ") + " \\end{array}"), pc + p * xs[k],
          M(pc + " + " + String(p).replace(".", "{,}") + " \\cdot " + xs[k] + " = " + String(pc + p * xs[k]).replace(".", "{,}")) + " CHF.",
          { ctx: "location", guide: [GS("Partie variable pour " + xs[k] + " h ?", p * xs[k], M(String(p * xs[k]).replace(".", "{,}")) + " CHF."), GS("Prix total ?", pc + p * xs[k], M(String(pc + p * xs[k]).replace(".", "{,}")) + " CHF.")], traps: [TR(p * xs[k], "N'oublie pas les " + pc + " CHF de base."), TR((pc + p) * xs[k], "La partie fixe ne se paie qu'une fois.")] }); },
    ],
    3: [
      () => { const a = R.pick([-4, -3, -2, 2, 3, 4]), b = R.int(-6, 6), xs = [-2, 1, 3, 6], ys = xs.map((x) => a * x + b); // 24.11 : pente ≠ ±1 (robot)
        return Qv("Ce tableau est celui d'une fonction affine " + M("f(x) = ax + b") + ". " + table(xs, ys) + " Que vaut la pente " + M("a") + " ?", a, "Entre " + M("x = 1") + " et " + M("x = 3") + " : " + M("a = \\frac{" + ys[2] + " - " + pr(ys[1]) + "}{3 - 1} = " + a) + ".",
          { ctx: "pente", guide: [GS("Écart des images entre " + M("x = 1") + " et " + M("x = 3") + " ?", ys[2] - ys[1], M(ys[2] - ys[1]) + "."), GS("Divisé par l'écart des " + M("x") + " (2) : " + M("a") + " = ?", a, M(a) + ".")], traps: [TR(ys[2] - ys[1], "Divise par l'écart des x (ici 2) : les colonnes ne sont pas espacées de 1."), TR(ys[1], "C'est une image, pas la pente.")] }); },
      () => { const a = nz(-4, 4), b = nz(-6, 6), xs = [-2, 1, 3], ys = xs.map((x) => a * x + b);
        return Qv("Ce tableau est celui d'une fonction affine " + M("f(x) = ax + b") + ". " + table(xs, ys) + " Que vaut " + M("b = f(0)") + " ?", b, "Pente " + M("\\frac{" + ys[2] + " - " + pr(ys[1]) + "}{2} = " + a) + " ; " + M("b = f(1) - a = " + ys[1] + " - " + pr(a) + " = " + b) + ".",
          { ctx: "ordonnee", guide: [GS("Pente " + M("a") + " ?", a, M(a) + "."), GS(M("f(0) = f(1) - a") + " = ?", b, M(b) + ".")], traps: [TR(ys[1] + a, "De x = 1 à x = 0, on recule d'un pas : on retire a."), TR(ys[0], "C'est f(−2), pas f(0).")] }); },
      () => { const r = R.int(1, 4), s = R.int(1, 4), x = -R.int(1, 5), v = (x - r) * (x + s);
        return Qv("Soit " + M("f(x) = (x - " + r + ")(x + " + s + ")") + ". Calcule " + M("f(" + x + ")") + ".", v, M("f(" + x + ") = (" + x + " - " + r + ")(" + x + " + " + s + ") = " + pr(x - r) + " \\cdot " + pr(x + s) + " = " + v) + ".",
          { ctx: "produit", guide: [GS("Premier facteur " + M(x + " - " + r) + " ?", x - r, M(x - r) + "."), GS("Deuxième facteur " + M(x + " + " + s) + " ?", x + s, M(x + s) + "."), GS("Produit ?", v, M(v) + ".")], traps: [TR(-v, "Attention au signe du produit (règle des signes)."), TR((x - r) + (x + s), "C'est un produit, pas une somme.")] }); },
    ],
  };

  const PROBS = {
    repere: [
      () => P("Un parallélogramme ABCD a pour sommets A(1 ; 1), B(6 ; 1) et C(8 ; 4).", [["a) Abscisse de D", 3], ["b) Ordonnée de D", 4], ["c) Aire (en carreaux)", 15]], ["Le vecteur AB se reporte de D à C : D = C − (B − A).", "Aire = base × hauteur."], "a) b) D(3 ; 4) ; c) " + M("5 \\cdot 3 = 15") + "."),
      () => P("Le point M(2 ; 3) est le milieu de [AB], avec A(−1 ; 5).", [["a) Abscisse de B", 5], ["b) Ordonnée de B", 1]], ["Le milieu est la moyenne : (−1 + x_B) ÷ 2 = 2.", "Idem pour les ordonnées."], "B(5 ; 1)."),
    ],
    tabval: [
      () => P("Une bougie de 20 cm diminue de 1,5 cm par heure. On note h(t) sa hauteur après t heures.", [["a) h(2)", 17], ["b) h(6)", 11], ["c) Après combien d'heures mesure-t-elle 8 cm ?", 8]], ["h(t) = 20 − 1,5 t.", "c) Résous 20 − 1,5 t = 8."], "a) 17 ; b) 11 ; c) 8 h."),
      () => P("Soit f(x) = x² − 4x.", [["a) f(−1)", 5], ["b) f(2)", -4], ["c) f(5)", 5], ["d) Un autre nombre que 5 qui a pour image 5", -1]], ["Remplace x et calcule.", "d) Regarde a)."], "a) 5 ; b) −4 ; c) 5 ; d) −1."),
    ],
  };

  // « Trouve l'erreur » (24.11, chantier I) : pente calculée « horizontal sur vertical ».
  TAB[2].push(() => { const a = R.pick([2, 3, -2, -3, 4]), x1 = R.int(-3, 1), dx = R.int(1, 3), y1 = R.int(-4, 4), x2 = x1 + dx, y2 = y1 + a * dx, w = R.pick(["Sam", "Lina", "Noé", "Inès", "Yanis", "Léa"]);
    return Qv("Une droite passe par " + M("A(" + x1 + " ; " + y1 + ")") + " et " + M("B(" + x2 + " ; " + y2 + ")") + ". " + w + " calcule sa pente : « " + M("\\frac{" + x2 + " - " + par(x1) + "}{" + y2 + " - " + par(y1) + "} = " + frac(dx, a * dx)) + " ». Trouve l'erreur, puis donne la bonne pente.", a,
      "Erreur : la pente, c'est la variation <b>verticale</b> divisée par la variation <b>horizontale</b> : " + M("\\frac{" + y2 + " - " + par(y1) + "}{" + x2 + " - " + par(x1) + "} = \\frac{" + a * dx + "}{" + dx + "} = " + a) + ".",
      { ctx: "erreur", guide: [GS("Variation verticale " + M("y_B - y_A") + " ?", a * dx, M(a * dx) + "."), GS("Variation horizontale " + M("x_B - x_A") + " ?", dx, M(dx) + "."), GS("Pente = vertical : horizontal ?", a, M(a) + ".")],
        traps: [TRAP(1 / a, "C'est le calcul de " + w + " : le quotient est à l'envers.")] }); });
  // ===================== Chantier X (24.11) : lecture sur figure =====================
  // L'élève LIT sur le repère (coordonnées, image, antécédent) ; les coordonnées ne sont jamais écrites sur la figure.
  // Points sur des valeurs entières (demi-unités signalées dans l'énoncé) ; FIG.plot agrandit son cadre pour les points.
  const PAIRQ = " Réponds « x ; y ».";
  const Qp = (q, vals, sol, o = {}) => { const same = (V) => V.length === vals.length && V.every((v, i) => Math.abs(v - vals[i]) < 1e-9), seen = new Set();
    const traps = (o.traps || []).filter((t) => t && t.spec && t.spec.values.every(isFinite) && !same(t.spec.values) && !seen.has(t.spec.values.join(";")) && seen.add(t.spec.values.join(";")));
    const x = { q, spec: { kind: "pair", values: vals }, sol, guide: o.guide, traps, ctx: o.ctx, canon: vals.join(" ; ") }; if (o.fig) x.fig = o.fig; return x; };
  const GPr = (ask, vals, sol) => ({ ask, spec: { kind: "pair", values: vals }, sol });
  const TPr = (vals, m) => ({ spec: { kind: "pair", values: vals }, m });
  const dT = (v) => String(v).replace(".", "{,}");
  const NOMS = ["A", "B", "C", "D", "E", "M", "P", "R"];
  // Points distincts aux coordonnées entières (ni sur les axes si noAxis).
  const lattice = (n, lo, hi, noAxis = true) => { const L = []; let g = 0; while (L.length < n && g++ < 500) { const x = R.int(lo, hi), y = R.int(lo, hi); if (noAxis && (!x || !y)) continue; if (L.some((p) => (p[0] === x && p[1] === y) || (p[0] === y && p[1] === x))) continue; L.push([x, y]); } return L; };
  const repFig = (pts, o = {}) => FIG.plot([], pts, Object.assign({ numbers: true, xr: [-5, 5], yr: [-5, 5] }, o));
  REP[1].push(
    () => { const P3 = lattice(3, -5, 5), k = R.int(0, 2), nm = pk([["A", "B", "C"], ["D", "E", "F"], ["P", "Q", "R"]]), [x, y] = P3[k]; if (Math.abs(x) === Math.abs(y) || Math.abs(x) < 2 && Math.abs(y) < 2) return null;
      return Qp("Lis sur le graphique les coordonnées du point " + M(nm[k]) + "." + PAIRQ, [x, y], M(nm[k]) + " est " + (x < 0 ? "à gauche" : "à droite") + " de l'axe vertical (abscisse " + M(x) + ") et " + (y < 0 ? "sous" : "au-dessus de") + " l'axe horizontal (ordonnée " + M(y) + ") : " + pt(nm[k], x, y) + ".",
        { ctx: "lire-coord", fig: repFig(P3.map((p, i) => [p[0], p[1], nm[i]])), guide: [GS("Abscisse de " + M(nm[k]) + " : descends (ou monte) jusqu'à l'axe horizontal. Valeur ?", x, M(x) + "."), GS("Ordonnée : va horizontalement jusqu'à l'axe vertical. Valeur ?", y, M(y) + "."), GPr("Coordonnées « x ; y » ?", [x, y], pt(nm[k], x, y) + ".")],
          traps: [TPr([y, x], "Un point s'écrit (abscisse ; ordonnée) : l'axe horizontal d'abord."), TPr([x, -y], "Le point est " + (y < 0 ? "sous" : "au-dessus de") + " l'axe horizontal : vérifie le signe de l'ordonnée."), TPr([-x, y], "Le point est " + (x < 0 ? "à gauche" : "à droite") + " de l'axe vertical : vérifie le signe de l'abscisse.")] }); },
    () => { const k = nz2(-5, 5), y = nz2(-5, 5); if (Math.abs(y) === Math.abs(k)) return null; let yd; do yd = nz2(-5, 5); while (Math.abs(yd) === Math.abs(k) || yd === y);
      const extra = lattice(1, -5, 5).filter((p) => p[0] !== k && p[1] !== k && p[0] !== yd), pts = [[k, y], [yd, k]].concat(extra).sort(() => R.rand() - 0.5).map((p, i) => [p[0], p[1], NOMS[i]]);
      const T = pts.find((p) => p[0] === k && p[1] === y);
      return Qv("Sur le graphique, un seul point a pour abscisse " + M(k) + ". Quelle est son ordonnée ?", y, "Le point d'abscisse " + M(k) + " est " + pt(T[2], k, y) + " : son ordonnée est " + M(y) + ".",
        { ctx: "abscisse-donnee", fig: repFig(pts), guide: [GS("L'abscisse se lit sur l'axe horizontal : repère " + M(k) + " sur cet axe et monte (ou descends) jusqu'au point. Puis lis la hauteur du point sur l'axe vertical : ?", y, M(y) + " (point " + M(T[2]) + ").")],
          traps: [TR(yd, "Tu as pris le point dont l'ORDONNÉE vaut " + k + ". On cherche celui dont l'abscisse (axe horizontal) vaut " + k + "."), TR(-y, "Attention au signe : le point est " + (y < 0 ? "sous" : "au-dessus de") + " l'axe horizontal."), TR(k, "On donne l'abscisse " + k + " ; on demande l'ordonnée du point.")] }); },
  );
  REP[2].push(
    () => { const hor = R.rand() < 0.5, c = nz2(-4, 4), a = -R.int(1, 5), b = R.int(1, 5), A = hor ? [a, c] : [c, a], B = hor ? [b, c] : [c, b];
      return Qv("Lis les coordonnées de " + M("A") + " et de " + M("B") + " sur le graphique, puis calcule la longueur " + M("AB") + " (unité : 1 carreau).", b - a, pt("A", A[0], A[1]) + " et " + pt("B", B[0], B[1]) + " : même " + (hor ? "ordonnée" : "abscisse") + ", segment " + (hor ? "horizontal" : "vertical") + ". " + M("AB = " + b + " - " + pr(a) + " = " + (b - a)) + ".",
        { ctx: "longueur-lue", fig: repFig([[A[0], A[1], "A"], [B[0], B[1], "B"]], { segs: [[A[0], A[1], B[0], B[1], "f-accent"]] }), guide: [GS((hor ? "Abscisse" : "Ordonnée") + " de " + M("A") + " ?", a, M(a) + "."), GS((hor ? "Abscisse" : "Ordonnée") + " de " + M("B") + " ?", b, M(b) + "."), GS("Longueur " + M(b + " - " + pr(a)) + " = ?", b - a, M(b - a) + " carreaux (compte-les pour vérifier).")],
          traps: [TR(b + a, "Soustrais les " + (hor ? "abscisses" : "ordonnées") + " : " + b + " − (" + a + ") = " + b + " + " + -a + "."), TR(Math.abs(c), "Ça, c'est la distance à l'axe ; on cherche la longueur du segment.")] }); },
    () => { let a, b, c, d; do { a = R.int(-5, 5); b = R.int(-5, 5); c = R.int(-5, 5); d = R.int(-5, 5); } while (!a || !b || !c || !d || (a + c) % 2 || (b + d) % 2 || Math.abs(a - c) < 2 || Math.abs(b - d) < 2 || Math.abs((a + c) / 2) < 2 && Math.abs((b + d) / 2) < 2); const ask = R.int(0, 1), m = [(a + c) / 2, (b + d) / 2]; if (Math.abs(m[ask]) < 2) return null;
      return Qv("Lis les coordonnées de " + M("A") + " et " + M("B") + " sur le graphique. Quelle est " + (ask ? "l'ordonnée" : "l'abscisse") + " du milieu " + M("M") + " de " + M("[AB]") + " ?", m[ask], pt("A", a, b) + ", " + pt("B", c, d) + " : moyenne des " + (ask ? "ordonnées" : "abscisses") + ", " + M("\\frac{" + (ask ? b : a) + " + " + pr(ask ? d : c) + "}{2} = " + m[ask]) + ".",
        { ctx: "milieu-lu", fig: repFig([[a, b, "A"], [c, d, "B"]], { segs: [[a, b, c, d]] }), guide: [GS((ask ? "Ordonnée" : "Abscisse") + " de " + M("A") + " ?", ask ? b : a, M(ask ? b : a) + "."), GS((ask ? "Ordonnée" : "Abscisse") + " de " + M("B") + " ?", ask ? d : c, M(ask ? d : c) + "."), GS("Moyenne des deux ?", m[ask], M(m[ask]) + ".")],
          traps: [TR(m[1 - ask], "Ça, c'est " + (ask ? "l'abscisse" : "l'ordonnée") + " du milieu."), TR(ask ? b + d : a + c, "Divise la somme par 2."), TR(ask ? (d - b) / 2 : (c - a) / 2, "Le milieu, c'est la moyenne (somme ÷ 2), pas la demi-différence.")] }); },
    () => { const ask = R.int(0, 1), hx = R.int(-4, 3) + 0.5, iy = nz2(-4, 4), P = ask ? [iy, hx] : [hx, iy], v = P[ask];
      return Qv("Le point " + M("P") + " est à mi-chemin entre deux lignes du quadrillage. Lis son " + (ask ? "ordonnée" : "abscisse") + " (nombre décimal).", v, M("P") + " est entre les graduations " + M(dT(Math.floor(v))) + " et " + M(dT(Math.ceil(v))) + " de l'axe " + (ask ? "vertical" : "horizontal") + ", au milieu : " + M(dT(v)) + ".",
        { ctx: "demi-unite", fig: repFig([[P[0], P[1], "P"]]), guide: [GS("Entre quelles graduations de l'axe " + (ask ? "vertical" : "horizontal") + " est " + M("P") + " ? La plus petite ?", Math.floor(v), M(Math.floor(v)) + " (et " + M(Math.ceil(v)) + ")."), GS("Le milieu des deux ?", v, M(dT(v)) + ".")],
          traps: [TR(Math.floor(v), "Le point est au milieu entre deux lignes : ajoute 0,5."), TR(Math.ceil(v), "Le point est au milieu entre deux lignes, pas sur la ligne."), TR(P[1 - ask], "Ça, c'est " + (ask ? "l'abscisse" : "l'ordonnée") + " (l'autre axe).")] }); },
  );
  REP[3].push(
    () => { const x1 = R.int(-5, -1), x2 = x1 + R.int(3, 7), y1 = R.int(-4, -1), xc = R.int(-4, 4), yc = y1 + R.int(3, 7), A = ((x2 - x1) * (yc - y1)) / 2;
      return Qv("Lis les coordonnées des sommets du triangle " + M("ABC") + " sur le graphique, puis calcule son aire (en carreaux).", A, pt("A", x1, y1) + ", " + pt("B", x2, y1) + ", " + pt("C", xc, yc) + ". Base " + M("AB = " + (x2 - x1)) + " (horizontale), hauteur " + M(yc + " - " + pr(y1) + " = " + (yc - y1)) + " : aire " + M("\\frac{" + (x2 - x1) + " \\cdot " + (yc - y1) + "}{2} = " + dT(A)) + ".",
        { ctx: "aire-lue", fig: repFig([[x1, y1, "A"], [x2, y1, "B"], [xc, yc, "C"]], { polys: [[[x1, y1], [x2, y1], [xc, yc]]] }), guide: [GS("Base " + M("AB") + " (écart des abscisses de A et B) ?", x2 - x1, M(x2 + " - " + pr(x1) + " = " + (x2 - x1)) + "."), GS("Hauteur : écart vertical entre " + M("C") + " et la droite " + M("(AB)") + " ?", yc - y1, M(yc + " - " + pr(y1) + " = " + (yc - y1)) + "."), GS("Aire ?", A, M(dT(A)) + " carreaux.")],
          traps: [TR((x2 - x1) * (yc - y1), "Aire d'un triangle : base × hauteur ÷ 2."), TR(((x2 - x1) * yc) / 2, "La hauteur se mesure depuis la base AB (ordonnée " + y1 + "), pas depuis l'axe horizontal.")] }); },
    () => { const P2 = lattice(2, -4, 4), [A, B] = P2, S = [2 * B[0] - A[0], 2 * B[1] - A[1]]; if (Math.abs(S[0]) > 9 || Math.abs(S[1]) > 9 || (A[0] === B[0] || A[1] === B[1])) return null;
      return Qp("Le point " + M("A'") + " est le symétrique de " + M("A") + " par rapport au point " + M("B") + " (" + M("B") + " est le milieu de " + M("[AA']") + "). Lis les coordonnées de " + M("A") + " et " + M("B") + ", puis donne celles de " + M("A'") + "." + PAIRQ, S,
        "De " + M("A") + " à " + M("B") + " : " + M((B[0] - A[0] < 0 ? "" : "+") + (B[0] - A[0])) + " horizontalement, " + M((B[1] - A[1] < 0 ? "" : "+") + (B[1] - A[1])) + " verticalement ; on refait le même déplacement depuis " + M("B") + " : " + pt("A'", S[0], S[1]) + ".",
        { ctx: "sym-centre", fig: repFig([[A[0], A[1], "A"], [B[0], B[1], "B"]]), guide: [GS("Déplacement horizontal de " + M("A") + " à " + M("B") + " (négatif vers la gauche) ?", B[0] - A[0], M(B[0] + " - " + pr(A[0]) + " = " + (B[0] - A[0])) + "."), GS("Déplacement vertical ?", B[1] - A[1], M(B[1] + " - " + pr(A[1]) + " = " + (B[1] - A[1])) + "."), GPr("On refait ce déplacement depuis " + M("B") + " : coordonnées de " + M("A'") + " ?", S, pt("A'", S[0], S[1]) + ".")],
          traps: [TPr([-A[0], -A[1]], "Ça, c'est le symétrique par rapport à l'origine ; ici le centre est B."), TPr([B[0] - A[0], B[1] - A[1]], "Ça, c'est le déplacement de A à B ; ajoute-le aux coordonnées de B."), TPr([S[1], S[0]], "x d'abord, puis y.")] }); },
  );

  const tabFig = (fns, pts = [], o = {}) => FIG.plot(fns, pts, Object.assign({ numbers: true, xr: [-6, 6], yr: [-6, 6] }, o));
  TAB[1].push(
    () => { const a = pk([2, -2, 3, -3, 1, -1]), b = R.int(-3, 3), xs = [-3, -2, -1, 1, 2, 3].filter((x) => Math.abs(a * x + b) <= 6 && Math.abs(a * x + b) >= 2 && Math.abs(a * x + b) !== Math.abs(x)); if (!xs.length) return null; const k = pk(xs), v = a * k + b;
      return Qv("La droite représente la fonction " + M("f") + ". Lis sur le graphique la valeur qui manque dans le tableau : " + table([k], ["?"]), v, "On part de " + M("x = " + k) + " sur l'axe horizontal, on va verticalement jusqu'à la droite, puis horizontalement jusqu'à l'axe vertical : " + M("f(" + k + ") = " + v) + ".",
        { ctx: "lire-image", fig: tabFig([{ f: (x) => a * x + b }]), guide: [GS("Repère " + M("x = " + k) + " sur l'axe horizontal, va jusqu'à la droite. À quelle hauteur est le point de la droite ?", v, M(v) + ".")],
          traps: [TR(k, "f(" + k + ") est une hauteur (axe vertical), pas l'abscisse " + k + "."), TR(-v, "Le point de la droite est " + (v < 0 ? "sous" : "au-dessus de") + " l'axe horizontal."), TR(b, "Ça, c'est f(0), là où la droite coupe l'axe vertical.")] }); },
    () => { const a = pk([2, -2, 3, -3]), b = R.int(-3, 3), xs = [-3, -2, 2, 3].filter((x) => Math.abs(a * x + b) <= 6 && Math.abs(a * x + b) >= 2 && Math.abs(a * x + b) !== Math.abs(x)); if (!xs.length) return null; const k = pk(xs), v = a * k + b;
      return Qv("La droite représente la fonction " + M("f") + ". Pour quelle valeur de " + M("x") + " a-t-on " + M("f(x) = " + v) + " ? Lis-la sur le graphique.", k, "On part de " + M(v) + " sur l'axe vertical, on va horizontalement jusqu'à la droite, puis verticalement jusqu'à l'axe horizontal : " + M("x = " + k) + ".",
        { ctx: "lire-antecedent", fig: tabFig([{ f: (x) => a * x + b }]), guide: [GS("Repère " + M(v) + " sur l'axe VERTICAL, va horizontalement jusqu'à la droite. Abscisse du point atteint ?", k, M(k) + ".")],
          traps: [TR(a * v + b, "Ça, c'est f(" + v + ") (image). On cherche le x dont l'image vaut " + v + " : pars de l'axe vertical."), TR(-k, "Le point est " + (k < 0 ? "à gauche" : "à droite") + " de l'axe vertical."), TR(v, "On cherche une abscisse, pas la valeur " + v + " donnée.")] }); },
  );
  TAB[2].push(
    () => { const s = pk([1, -1]), h = R.int(-2, 2), c = s > 0 ? R.int(-6, -2) : R.int(2, 6), f = (x) => s * (x - h) ** 2 + c, xs = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].filter((x) => x !== h && Math.abs(f(x)) <= 6 && Math.abs(f(x)) >= 2); if (xs.length < 3) return null;
      const side = R.rand() < 0.5 ? xs.filter((x) => x > h) : xs.filter((x) => x < h); if (side.length < 3) return null; /* un seul côté du sommet : trois valeurs distinctes */
      const pick3 = side.sort(() => R.rand() - 0.5).slice(0, 3).sort((u, w) => u - w), k = R.int(0, 2), v = f(pick3[k]); if (pick3.some((x) => Math.abs(x) === Math.abs(v))) return null;
      return Qv("La courbe représente la fonction " + M("f") + ". Complète le tableau en lisant le graphique : " + table(pick3, pick3.map((x, i) => (i === k ? "?" : f(x)))), v, "Au-dessus (ou au-dessous) de " + M("x = " + pick3[k]) + ", le point de la courbe est à la hauteur " + M(v) + " : " + M("f(" + pick3[k] + ") = " + v) + ".",
        { ctx: "tableau-lu", fig: tabFig([{ f }], [], { yr: [-6, 6] }), guide: [GS("Vérifie une case connue : " + M("f(" + pick3[(k + 1) % 3] + ")") + " lu sur la courbe ?", f(pick3[(k + 1) % 3]), M(f(pick3[(k + 1) % 3])) + " : c'est bien la valeur du tableau."), GS("Même méthode pour " + M("x = " + pick3[k]) + " : hauteur du point de la courbe ?", v, M(v) + ".")],
          traps: [TR(pick3[k], "f(" + pick3[k] + ") se lit sur l'axe vertical."), TR(-v, "Le point est " + (v < 0 ? "sous" : "au-dessus de") + " l'axe horizontal.")] }); },
    () => { const s = pk([1, -1, 0.5, -0.5]), h = R.int(-3, 2), d = pk([1, 2, 3]), c = s > 0 ? R.int(-6, -2) : R.int(2, 6), f = (x) => s * (x - h) ** 2 + c, x2 = h + d, x1 = h - d, k = f(x2), big = R.rand() < 0.5, ans = big ? x2 : x1;
      if (!Number.isInteger(k) || Math.abs(k) < 2 || Math.abs(k) > 6 || Math.abs(ans) < 2 || x1 < -6 || x2 > 6 || Math.abs(ans) === Math.abs(k)) return null;
      return Qv("La courbe représente la fonction " + M("f") + ". L'équation " + M("f(x) = " + k) + " a deux solutions. Lis-les sur le graphique et donne la plus " + (big ? "grande" : "petite") + ".", ans, "La droite horizontale " + M("y = " + k) + " coupe la courbe en " + M("x = " + x1) + " et " + M("x = " + x2) + " : la plus " + (big ? "grande" : "petite") + " est " + M(ans) + ".",
        { ctx: "deux-antecedents", fig: tabFig([{ f }], [], { hlines: [k] }), guide: [GS("Repère " + M(k) + " sur l'axe vertical (droite en pointillé). Abscisse du point d'intersection de gauche ?", x1, M(x1) + "."), GS("Et de droite ?", x2, M(x2) + "."), GS("La plus " + (big ? "grande" : "petite") + " ?", ans, M(ans) + ".")],
          traps: [TR(big ? x1 : x2, "On demande la plus " + (big ? "grande" : "petite") + " des deux solutions."), TR(f(k), "Ça, c'est f(" + k + "). On cherche les x dont l'image vaut " + k + "."), TR(h, "Ça, c'est l'abscisse du sommet.")] }); },
  );
  TAB[3].push(
    () => { const a = pk([2, -2, 3, -3, 0.5, -0.5]), b = nz2(-3, 3), X = pk([8, 10, 12, -8, -10]), v = a * X + b; if (Math.abs(v) < 2) return null;
      return Qv("La droite représente une fonction affine " + M("f") + ". Lis deux valeurs sur le graphique, puis calcule " + M("f(" + X + ")") + " (hors du graphique).", v, "On lit " + M("f(0) = " + b) + " et " + M("f(2) = " + (2 * a + b)) + " : pente " + M("a = \\frac{" + (2 * a + b) + " - " + pr(b) + "}{2} = " + dT(a)) + ". Donc " + M("f(x) = " + dT(a) + "x" + (b < 0 ? " - " + -b : " + " + b)) + " et " + M("f(" + X + ") = " + dT(v)) + ".",
        { ctx: "prolonger", fig: tabFig([{ f: (x) => a * x + b }], [[0, b, ""], [2, 2 * a + b, ""]]), guide: [GS("Lis " + M("f(0)") + " (où la droite coupe l'axe vertical) :", b, M(b) + "."), GS("Lis " + M("f(2)") + " :", 2 * a + b, M(2 * a + b) + "."), GS("Pente (variation de f quand x augmente de 1) ?", a, M(dT(a)) + "."), GS(M("f(" + X + ") = a \\cdot " + pr(X) + " + b") + " = ?", v, M(dT(v)) + ".")],
          traps: [TR(a * X, "N'oublie pas l'ordonnée à l'origine " + b + "."), TR(b * X + a, "La pente multiplie x ; f(0) est le terme constant."), TR(-v, "Vérifie le signe de la pente : la droite " + (a > 0 ? "monte" : "descend") + ".")] }); },
    () => { const a = pk([2, -2, 3, -3]), b = nz2(-3, 3), x = pk([5, 6, 7, -5, -6, -7]), V = a * x + b;
      return Qv("La droite représente une fonction affine " + M("f") + ". Lis sa pente et son ordonnée à l'origine, puis trouve le nombre " + M("x") + " tel que " + M("f(x) = " + V) + " (hors du graphique).", x, "On lit " + M("b = " + b) + " et " + M("a = " + a) + " : " + M(lin(a, b) + " = " + V) + ", " + M(a + "x = " + (V - b)) + ", " + M("x = " + x) + ".",
        { ctx: "antecedent-hors", fig: tabFig([{ f: (t) => a * t + b }], [[0, b, ""], [1, a + b, ""]]), guide: [GS("Ordonnée à l'origine " + M("b") + " (lue sur l'axe vertical) ?", b, M(b) + "."), GS("Pente : de combien la droite monte-t-elle (négatif si elle descend) quand on avance de 1 ?", a, M(a) + "."), GS("Résous " + M(lin(a, b) + " = " + V) + " : " + M("x") + " = ?", x, M("x = " + x) + ".")],
          traps: [TR(a * V + b, "Ça, c'est f(" + V + ") ; on cherche le x dont l'image vaut " + V + "."), TR((V + b) / a, "Pour isoler ax, on soustrait b = " + b + "."), TR(-x, "Vérifie le signe de la pente.")] }); },
  );
  const ALL = { repere: REP, tabval: TAB };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => pickForm(lv[Math.min(Math.max(d, 1), 3)]);
    if (typeof VAR !== "undefined") VAR[id] = {};
    if (typeof PROB !== "undefined") delete PROB[id];
    PROB_EXTRA[id] = PROBS[id];
  }
  Object.assign(HINTS_EXTRA, {
    repere: "Un point s'écrit (abscisse ; ordonnée) : l'abscisse se lit sur l'axe horizontal, l'ordonnée sur l'axe vertical. Milieu : moyenne des coordonnées.",
    tabval: "Pour compléter un tableau, remplace x par la valeur de la colonne et calcule. Pour un antécédent, cherche la colonne où f(x) vaut le nombre donné.",
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    repere: ["Lire des coordonnées, distance aux axes, symétries", "Sommet d'un rectangle, milieu, longueur", "Aires, point sur une droite"],
    tabval: ["Calculer une image, compléter un tableau", "Antécédent, 2e degré, situation", "Pente et ordonnée à l'origine depuis un tableau"],
  });
})();

// 25.11 (agent trous) · CO 11e, chapitre 3 « 3D : espace, grandeurs et mesures » : repérer un point dans un repère de
// l'espace (11ES1.05, « si le temps »). Notion repere3d : coordonnées des sommets d'un pavé posé à l'origine, milieux et
// centres, puis distances (Pythagore dans l'espace, comme la diagonale d'un pavé). Réponses « x ; y ; z ».
// Outils : TRX (src/trx.js). Paquet de chargement « 11 » (build.py : préfixe ch11).
(function () {
  if (typeof NOTIONS === "undefined" || typeof GEN === "undefined" || typeof TRX === "undefined") return;
  const { pk, r6, fT, fS, QN, QP, GR, GP, TR, TP, P, reg, W, toi, solid } = TRX;
  const T3 = (p) => "(" + p.map(fT).join(" \\,;\\, ") + ")", S3 = (p) => p.map(fS).join(" ; ");
  /* pavé posé à l'origine : x vers l'avant (fuyante), y vers la droite, z vers le haut ; sommets O, A…G */
  const SOM = (a, b, c) => ({ O: [0, 0, 0], A: [a, 0, 0], B: [a, b, 0], C: [0, b, 0], D: [0, 0, c], E: [a, 0, c], F: [a, b, c], G: [0, b, c] });
  const fig = (a, b, c, o = {}) => {
    const S = SOM(a, b, c), tr = (p) => [p[1], -p[0], p[2]], pts = {};
    for (const [k, v] of Object.entries(S)) pts[k] = tr(v);
    pts.x = tr([a + 2, 0, 0]); pts.y = tr([0, b + 2, 0]); pts.z = tr([0, 0, c + 1.6]);
    for (const [k, v] of Object.entries(o.more || {})) pts[k] = tr(v);
    const edges = [["O", "x"], ["O", "y"], ["O", "z"], ["A", "B"], ["B", "C"], ["D", "E"], ["E", "F"], ["F", "G"], ["G", "D"], ["A", "E"], ["B", "F"], ["C", "G"]];
    const marks = o.noDims ? [] : [["O", "A", String(a), -10, 4], ["O", "C", String(b), 0, 14], ["O", "D", String(c), -10, 0]];
    return solid({ pts, edges, accent: o.accent || [], marks, dots: o.dots || [], labels: (o.labels || ["O", "A", "B", "C", "D", "E", "F", "G"]).concat(["x", "y", "z"]), lab: "pavé dans un repère de l'espace" });
  };
  const dims = () => { const a = R.int(2, 6), b = R.int(2, 7), c = R.int(2, 5); return a === b && b === c ? [a, b + 1, c] : [a, b, c]; };
  const RP = {
    1: [
      () => { const [a, b, c] = dims(), S = SOM(a, b, c), n = pk(["B", "E", "F", "G", "F"]), p = S[n];
        return QP("Un pavé droit est posé dans un repère de l'espace : le sommet " + M("O") + " est l'origine et ses arêtes issues de " + M("O") + " suivent les axes (longueurs sur la figure). Donne les coordonnées du sommet " + M(n) + " (réponds « x ; y ; z »).", p,
          "Pour aller de " + M("O") + " à " + M(n) + ", on avance de " + M(p[0]) + " selon " + M("x") + " (vers l'avant), de " + M(p[1]) + " selon " + M("y") + " (vers la droite) et de " + M(p[2]) + " selon " + M("z") + " (vers le haut) : " + M(n + T3(p)) + ".",
          { ctx: "sommet", fig: fig(a, b, c, { dots: [n] }),
            guide: [GR("Coordonnée " + M("x") + " (vers l'avant) ?", p[0], M(p[0]) + "."), GR("Coordonnée " + M("y") + " (vers la droite) ?", p[1], M(p[1]) + "."), GR("Coordonnée " + M("z") + " (vers le haut) ?", p[2], M(p[2]) + "."), GP("Coordonnées de " + M(n) + " ?", p, M(T3(p)) + ".")],
            traps: [TP([p[1], p[0], p[2]], "L'ordre compte : d'abord x (l'axe vers l'avant), puis y, puis z."), TP([p[2], p[1], p[0]], "z est la hauteur : c'est la dernière coordonnée."), TP([a, b, c], "Ce sont les dimensions du pavé ; regarde de combien on avance sur chaque axe pour atteindre " + n + ".")] }); },
      () => { const [a, b, c] = dims(), v = a * b * c;
        return QN("Un pavé droit a un sommet à l'origine " + M("O(0 \\,;\\, 0 \\,;\\, 0)") + ", ses arêtes issues de " + M("O") + " sur les axes, et le sommet opposé en " + M("F" + T3([a, b, c])) + " (unité : le cm). Calcule son volume (en cm³).", v,
          "Les coordonnées de " + M("F") + " donnent les trois dimensions : " + M(a + " \\times " + b + " \\times " + c + " = " + v) + " cm³.",
          { ctx: "volume", fig: fig(a, b, c, { noDims: true, dots: ["F"] }),
            guide: [GR("Longueur de l'arête sur l'axe " + M("x") + " ?", a, M(a) + " cm."), GR("Volume ?", v, M(v) + " cm³.")],
            traps: [TR(a + b + c, "Le volume est le produit des trois dimensions, pas leur somme."), TR(a * b, "C'est l'aire de la base ; multiplie encore par la hauteur " + c + "."), TR(2 * (a * b + b * c + a * c), "C'est l'aire totale ; on demande le volume.")] }); },
      () => { const [a, b, c] = dims(), t = R.int(1, b - 1), p = [a, t, c];
        return QP("Un pavé droit est posé dans un repère de l'espace (sommet " + M("O") + " à l'origine, longueurs sur la figure). Le point " + M("P") + " est sur l'arête " + M("[EF]") + ", à " + M(t) + " unité" + (t > 1 ? "s" : "") + " de " + M("E") + ". Donne ses coordonnées (« x ; y ; z »).", p,
          M("E" + T3([a, 0, c])) + " ; de " + M("E") + " vers " + M("F") + ", seule la coordonnée " + M("y") + " change : " + M("P" + T3(p)) + ".",
          { ctx: "point-arete", fig: fig(a, b, c, { more: { P: p }, dots: ["P"], labels: ["O", "A", "B", "C", "D", "E", "F", "G", "P"] }),
            guide: [GP("Coordonnées de " + M("E") + " ?", [a, 0, c], M(T3([a, 0, c])) + "."), GR("Coordonnée " + M("y") + " de " + M("P") + " ?", t, M(t) + "."), GP("Coordonnées de " + M("P") + " ?", p, M(T3(p)) + ".")],
            traps: [TP([t, a, c], "L'arête [EF] est parallèle à l'axe des y : c'est y qui vaut " + t + "."), TP([a, b - t, c], "P est à " + t + " de E (pas de F)."), TP([a, t, 0], "L'arête [EF] est en haut : z = " + c + ".")] }); },
    ],
    2: [
      () => { const [a, b, c] = dims(), S = SOM(a, b, c), [u, w] = pk([["E", "F"], ["B", "F"], ["A", "E"], ["F", "G"], ["C", "G"]]), p = S[u].map((v, i) => (v + S[w][i]) / 2);
        return QP("Un pavé droit est posé dans un repère de l'espace (sommet " + M("O") + " à l'origine, longueurs sur la figure). Donne les coordonnées du milieu " + M("M") + " de l'arête " + M("[" + u + w + "]") + " (« x ; y ; z », fractions ou décimaux acceptés).", p,
          M(u + T3(S[u])) + " et " + M(w + T3(S[w])) + " ; le milieu a pour coordonnées les moyennes : " + M("M" + T3(p)) + ".",
          { ctx: "milieu-arete", fig: fig(a, b, c, { accent: [[u, w]] }),
            guide: [GP("Coordonnées de " + M(u) + " ?", S[u], M(T3(S[u])) + "."), GP("Coordonnées de " + M(w) + " ?", S[w], M(T3(S[w])) + "."), GP("Milieu " + M("M") + " ?", p, M(T3(p)) + ".")],
            traps: [TP(S[u].map((v, i) => v + S[w][i]), "Le milieu : on fait la moyenne, donc on divise la somme par 2."), TP(S[u].map((v, i) => (S[w][i] - v) / 2), "Moyenne des coordonnées : (x₁ + x₂) ÷ 2."), TP(S[w], "C'est l'extrémité " + w + ", pas le milieu.")] }); },
      () => { let [a, b, c] = dims(); if (a % 2 && b % 2 && c % 2) a++; const p = [a / 2, b / 2, c / 2];
        return QP("Un pavé droit est posé dans un repère de l'espace (sommet " + M("O") + " à l'origine, longueurs sur la figure). Donne les coordonnées de son centre " + M("K") + ", le milieu de la diagonale " + M("[OF]") + " (« x ; y ; z »).", p,
          M("O(0 \\,;\\, 0 \\,;\\, 0)") + " et " + M("F" + T3([a, b, c])) + " : " + M("K" + T3(p)) + ", la moitié de chaque dimension.",
          { ctx: "centre", fig: fig(a, b, c, { accent: [["O", "F", 1]] }),
            guide: [GP("Coordonnées de " + M("F") + " ?", [a, b, c], M(T3([a, b, c])) + "."), GP("Centre " + M("K") + " ?", p, M(T3(p)) + ".")],
            traps: [TP([a, b, c], "C'est le sommet F ; le centre est au milieu de [OF]."), TP([a / 2, b / 2, c], "Ça, c'est le centre de la face du dessus."), TP([b / 2, a / 2, c / 2], "L'ordre : x (vers l'avant), y, z.")] }); },
      () => { const [a, b, c] = dims(), up = R.rand() < 0.6, p = up ? [a / 2, b / 2, c] : [a, b / 2, c / 2], fc = up ? "du dessus " + M("DEFG") : "avant " + M("ABFE");
        return QP("Un pavé droit est posé dans un repère de l'espace (sommet " + M("O") + " à l'origine, longueurs sur la figure). Donne les coordonnées du centre de la face " + fc + " (« x ; y ; z »).", p,
          "Le centre d'une face est le milieu d'une de ses diagonales" + (up ? " ([DF])" : " ([AF])") + " : " + M(T3(p)) + ". Une coordonnée reste celle de la face (" + (up ? M("z = " + c) : M("x = " + a)) + ").",
          { ctx: "centre-face", fig: fig(a, b, c, { accent: up ? [["D", "F"], ["E", "G"]] : [["A", "F"], ["B", "E"]] }),
            guide: [GR(up ? "La face du dessus est à quelle hauteur " + M("z") + " ?" : "La face avant est à quelle abscisse " + M("x") + " ?", up ? c : a, M(up ? c : a) + "."), GP("Centre de la face ?", p, M(T3(p)) + ".")],
            traps: [TP([a / 2, b / 2, c / 2], "C'est le centre du pavé ; le centre de la face reste sur la face."), TP(up ? [a / 2, b / 2, 0] : [0, b / 2, c / 2], up ? "La face du dessus est à la hauteur z = " + c + ", pas 0." : "La face avant est en x = " + a + "."), TP(up ? [a, b, c] : [a, b, c], "C'est le sommet F.")] }); },
    ],
    3: [
      () => { const Q = pk([[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11], [3, 4, 12, 13]]), ord = pk([[0, 1, 2], [1, 2, 0], [2, 0, 1]]), [a, b, c] = ord.map((i) => Q[i]), d = Q[3];
        return QN("Un pavé droit est posé à l'origine d'un repère de l'espace ; son sommet opposé à " + M("O") + " est " + M("F" + T3([a, b, c])) + ". Calcule la distance " + M("OF") + ".", d,
          "Diagonale de la base : " + M("OB^2 = " + a + "^2 + " + b + "^2 = " + (a * a + b * b)) + ". Puis, dans le triangle " + M("OBF") + " rectangle en " + M("B") + " : " + M("OF^2 = " + (a * a + b * b) + " + " + c + "^2 = " + d * d) + ", " + M("OF = " + d) + ".",
          { ctx: "diagonale", fig: fig(a, b, c, { noDims: true, accent: [["O", "F", 1], ["O", "B", 1]] }),
            guide: [GR(M("OB^2") + " (diagonale de la base, au carré) ?", a * a + b * b, M(a * a + b * b) + "."), GR(M("OF^2") + " ?", d * d, M(d * d) + "."), GR(M("OF") + " ?", d, M(d) + ".")],
            traps: [TR(a + b + c, "On n'additionne pas les coordonnées : Pythagore, deux fois."), TR(d * d, "C'est OF² : prends la racine."), TR(Math.sqrt(a * a + b * b), "C'est la diagonale de la base [OB] ; il reste à monter de " + c + ".")] }); },
      () => { const [u, w, d] = pk([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [4, 3, 5], [12, 5, 13]]), c = R.int(2, 5), A = [u, 0, c], B = [0, w, c];
        return QN("Dans un repère de l'espace, calcule la distance entre les points " + M("E" + T3(A)) + " et " + M("G" + T3(B)) + ".", d,
          "Les deux points ont la même cote " + M("z = " + c) + " : ils sont dans un même plan horizontal. Écarts : " + M(u) + " selon " + M("x") + ", " + M(w) + " selon " + M("y") + " ; " + M("EG = \\sqrt{" + u + "^2 + " + w + "^2} = " + d) + ".",
          { ctx: "diag-face", fig: fig(u, w, c, { noDims: true, accent: [["E", "G"]] }),
            guide: [GR("Écart selon " + M("x") + " ?", u, M(u) + "."), GR("Écart selon " + M("y") + " ?", w, M(w) + "."), GR(M("EG") + " ?", d, M("\\sqrt{" + u * u + " + " + w * w + "} = " + d) + ".")],
            traps: [TR(u + w, "Pythagore : on additionne les carrés, puis on prend la racine."), TR(Math.sqrt(u * u + w * w + c * c), "Les deux points ont la même cote " + c + " : l'écart selon z est nul."), TR(d * d, "C'est EG² : prends la racine.")] }); },
      () => { let [a, b, c] = dims(); if (a % 2) a++; if (b % 2) b++; const h = R.int(2, 5), p = [a / 2, b / 2, c + h];
        return QP("Sur un pavé droit posé à l'origine d'un repère de l'espace (longueurs sur la figure), on pose une pyramide dont la base est la face du dessus " + M("DEFG") + " et dont le sommet " + M("S") + " est à " + M(h) + " unités au-dessus du centre de cette face. Donne les coordonnées de " + M("S") + " (« x ; y ; z »).", p,
          "Centre de la face du dessus : " + M(T3([a / 2, b / 2, c])) + ". On monte de " + M(h) + " : " + M("S" + T3(p)) + ".",
          { ctx: "pyramide-sommet", fig: fig(a, b, c, { more: { S: p }, accent: [["S", "D"], ["S", "E"], ["S", "F"], ["S", "G"]], labels: ["O", "A", "B", "C", "D", "E", "F", "G", "S"] }),
            guide: [GP("Centre de la face du dessus ?", [a / 2, b / 2, c], M(T3([a / 2, b / 2, c])) + "."), GP("Sommet " + M("S") + " ?", p, M(T3(p)) + ".")],
            traps: [TP([a / 2, b / 2, h], "S est " + h + " unités au-dessus de la face du dessus, qui est déjà à la hauteur " + c + "."), TP([a, b, c + h], "Le sommet est au-dessus du centre de la face, pas au-dessus de F."), TP([b / 2, a / 2, c + h], "L'ordre : x (vers l'avant), y, z.")] }); },
    ],
  };
  const PROBS = {
    repere3d: [() => { const [a, b, c, d] = pk([[2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9]]);
      return P("Une boîte en forme de pavé droit est posée à l'origine d'un repère de l'espace ; le sommet opposé à O est " + M("F" + T3([a, b, c])) + " (en dm).", [["a) Volume de la boîte (dm³)", a * b * c], ["b) Cote (coordonnée z) du centre de la boîte", c / 2], ["c) Longueur de la diagonale OF (dm)", d]],
        ["Les coordonnées de F sont les dimensions.", "Diagonale : Pythagore deux fois."], "a) " + M(a + " \\cdot " + b + " \\cdot " + c + " = " + a * b * c) + " ; b) " + M(fT(c / 2)) + " ; c) " + M("\\sqrt{" + a * a + " + " + b * b + " + " + c * c + "} = " + d) + "."); }],
  };
  reg([
    { id: "repere3d", theme: "es", label: "Repérer un point dans l'espace", ex: "F(4 \\,;\\, 3 \\,;\\, 2)", CH: [11], lv: RP, probs: PROBS.repere3d,
      hint: "Un point de l'espace a trois coordonnées (x ; y ; z) : x vers l'avant, y vers la droite, z vers la hauteur. Pavé posé à l'origine : les coordonnées du sommet opposé sont ses trois dimensions. Milieu : moyenne des coordonnées. Distance : Pythagore deux fois.",
      lesson: ["Repère de l'espace", "Trois nombres pour situer un point : avant, droite, haut.",
        "Dans un repère de l'espace, trois axes perpendiculaires partent de l'origine \\(O\\) : l'axe des \\(x\\) (dessiné en fuyante, vers l'avant), l'axe des \\(y\\) (vers la droite) et l'axe des \\(z\\) (vers le haut). Le point \\(P(x \\,;\\, y \\,;\\, z)\\) s'atteint en avançant de \\(x\\), puis de \\(y\\), puis en montant de \\(z\\). Pour un pavé posé à l'origine avec ses arêtes sur les axes, le sommet opposé a pour coordonnées les trois dimensions. Le milieu de deux points a pour coordonnées les moyennes. La distance se calcule avec Pythagore, comme la diagonale d'un pavé.",
        ["Pavé \\(4 \\times 3 \\times 2\\) : sommet opposé \\(F(4 \\,;\\, 3 \\,;\\, 2)\\), centre \\((2 \\,;\\, 1{,}5 \\,;\\, 1)\\).", "\\(OF = \\sqrt{2^2 + 3^2 + 6^2} = 7\\) pour \\(F(2 \\,;\\, 3 \\,;\\, 6)\\)."],
        "L'ordre des coordonnées compte : \\((4 \\,;\\, 3 \\,;\\, 2)\\) et \\((3 \\,;\\, 4 \\,;\\, 2)\\) sont deux points différents."],
      comps: ["Lire les coordonnées d'un point de l'espace", "Calculer les coordonnées d'un milieu ou d'un centre", "Calculer une distance dans l'espace"],
      act: { retiens: { regle: "Un point de l'espace a trois coordonnées \\((x \\,;\\, y \\,;\\, z)\\) ; \\(z\\) est la hauteur. Distance à l'origine : \\(\\sqrt{x^2 + y^2 + z^2}\\).", exemple: ["Pavé posé à l'origine, de dimensions 4, 3 et 2 : le sommet opposé est \\(F(4 \\,;\\, 3 \\,;\\, 2)\\).", "\\(F(2 \\,;\\, 3 \\,;\\, 6)\\) : \\(OF = \\sqrt{4 + 9 + 36} = 7\\)."], piege: "La distance n'est pas la somme des coordonnées." },
        predict: { q: "Combien de nombres faut-il pour situer un point dans une pièce (sol et hauteur) ?", choices: ["3", "2", "4"], good: 0, why: "Deux pour se placer sur le sol (avant, droite) et un pour la hauteur : (x ; y ; z)." },
        defis: ["Un pavé de dimensions 4 (selon x), 3 (selon y) et 2 (selon z) est posé à l'origine. Tape la hauteur z de son sommet opposé F.", "Pour \\(F(2 \\,;\\, 3 \\,;\\, 6)\\), tape la distance \\(OF\\)."],
        play: toi(["z est la dimension verticale", "OF² = 2² + 3² + 6²"], [W(2, "F(4 ; 3 ; 2) : z = 2, la hauteur du pavé."), W(7, "√(4 + 9 + 36) = √49 = 7.")]) } },
  ]);
})();

// Chantier 11e · 1. Nombres et opérations, 2. Pythagore, 3. 3D (17.11) : exercices riches et raisonnements du test de
// préparation, au niveau d'un vrai test de 11e (contexte, plusieurs étapes, interprétation), pas du drill.
// Même format que riche.js (RICH.<chapitre> = { ids, label, ex, raison, minutes }). Chargé après riche.js.
(function () {
  const r6 = (v) => Math.round(v * 1e6) / 1e6;
  const N = (v) => { let [i, f] = String(r6(v)).split("."); if (i.replace("-", "").length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}"); return i + (f ? "{,}" + f : ""); };
  const T = (v) => M(N(v));
  const A = (v, k) => N(+(+v).toFixed(k));
  const u = (s) => ("\\ \\text{" + s.replace(/\^([23])/, "}^$1\\text{") + "}").replace(/\\text\{\}$/, "");
  const Q = (v, s) => M(N(v) + u(s));
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const g2 = (a, b) => (b ? g2(b, a % b) : Math.abs(a));
  const F = (n, d) => { const g = g2(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n) : (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
  const pd = (t) => colonBreak(String(t).split(/(\\\(.*?\\\))/).map((seg, i) => (i % 2 ? seg : seg.replace(/\{,\}/g, ",").replace(/\\text\{'\}/g, "'"))).join(""));
  const X = (o) => Object.assign({ pts: Math.max(1, o.parts.reduce((s, p) => s + p.pts, 0)) }, o, { q: pd(o.q), sol: pd(o.sol), parts: o.parts.map((p) => ({ label: pd(p.label), pts: p.pts })) });
  const ul = (rows) => "<ol type=\"a\" class=\"mock-parts\">" + rows.map((r) => "<li>" + r + "</li>").join("") + "</ol>";
  const who = () => pk(["Lina", "Noé", "Inès", "Yanis", "Mia", "Sam"]);

  // ===================== 11e · 1. Nombres et opérations =====================
  const EXN = [
    // Le budget de la course d'école (fractions)
    () => { const [a, b, c, e] = pk([[2, 5, 1, 4], [1, 3, 1, 4], [3, 8, 1, 6], [2, 5, 1, 3]]), tot = pk([2400, 3600, 4800]), used = a / b + c / e, rn = (1 - used);
      const L = (b * e) / g2(b, e), num = L - (a * L) / b - (c * L) / e;
      return X({ id: "fracadd", lv: 1, titre: "Le budget de la course d'école",
        q: "Pour la course d'école, la classe dispose de " + Q(tot, "CHF") + ". Le transport coûte les " + M(F(a, b)) + " du budget, l'hébergement les " + M(F(c, e)) + ", et le reste sert aux activités.",
        parts: [{ label: "Quelle fraction du budget reste-t-il pour les activités ? (fraction irréductible)", pts: 2 }, { label: "Combien de francs cela représente-t-il ?", pts: 1 }, { label: "Une activité coûte " + Q(Math.round(tot * rn * 0.6), "CHF") + ". Quelle fraction du budget total est-ce ? Le reste suffit-il ?", pts: 1 }],
        sol: ul([M("1 - \\frac{" + a + "}{" + b + "} - \\frac{" + c + "}{" + e + "} = \\frac{" + num + "}{" + L + "}" + (g2(num, L) > 1 ? " = " + F(num, L) : "")) + ".", M(F(num, L) + " \\cdot " + N(tot) + " = " + N(tot * rn)) + " CHF.", M(F(Math.round(tot * rn * 0.6), tot)) + " du budget ; oui, c'est moins que les " + M(N(tot * rn)) + " CHF disponibles."]) }); },
    // La recette (multiplier des fractions)
    () => { const [n0, n1] = pk([[4, 6], [6, 9], [4, 10], [6, 8]]), [lait, beurre] = pk([[[3, 4], [1, 5]], [[2, 3], [1, 4]], [[1, 2], [3, 10]]]);
      const kL = [lait[0] * n1, lait[1] * n0], kB = [beurre[0] * n1, beurre[1] * n0];
      return X({ id: "fracmul", lv: 1, titre: "La recette de crêpes",
        q: "Une recette pour " + n0 + " personnes demande " + M(F(...lait)) + " L de lait et " + M(F(...beurre)) + " kg de beurre. " + who() + " cuisine pour " + n1 + " personnes.",
        parts: [{ label: "Par quelle fraction faut-il multiplier les quantités ?", pts: 1 }, { label: "Quelle quantité de lait faut-il (fraction irréductible, en L) ?", pts: 1 }, { label: "Il reste les " + M(F(2, 3)) + " d'une plaquette de beurre de " + M(F(1, 4)) + " kg. Cela suffit-il ?", pts: 2 }],
        sol: ul([M(F(n1, n0)) + ".", M(F(...lait) + " \\cdot " + F(n1, n0) + " = " + F(...kL)) + " L.", "Il reste " + M(F(2, 3) + " \\cdot " + F(1, 4) + " = " + F(1, 6)) + " kg ; il faut " + M(F(...kB)) + " kg : " + (kB[0] / kB[1] <= 1 / 6 ? "oui, cela suffit." : "non, cela ne suffit pas (" + M(F(...kB) + " > " + F(1, 6)) + ").")]) }); },
    // Soldes successifs (pourcentages)
    () => { const P = pk([80, 120, 150, 200]), p1 = pk([20, 30, 25]), p2 = pk([10, 15, 20]), f = (1 - p1 / 100) * (1 - p2 / 100), fin = P * f;
      return X({ id: "fracconv", lv: 2, titre: "Soldes successifs",
        q: "Un manteau coûte " + Q(P, "CHF") + ". En janvier, son prix baisse de " + p1 + " %. En février, le nouveau prix baisse encore de " + p2 + " %. Une affiche annonce : « −" + (p1 + p2) + " % au total ! »",
        parts: [{ label: "Calcule le prix en janvier, puis en février.", pts: 2 }, { label: "De quel pourcentage le prix a-t-il baissé en tout ?", pts: 1 }, { label: "L'affiche a-t-elle raison ? Explique.", pts: 1 }],
        sol: ul([M(N(P) + " \\cdot " + N(1 - p1 / 100) + " = " + N(P * (1 - p1 / 100))) + " CHF, puis " + M(N(P * (1 - p1 / 100)) + " \\cdot " + N(1 - p2 / 100) + " = " + N(fin)) + " CHF.", M("1 - " + N(r6(f)) + " = " + N(r6(1 - f))) + ", soit " + M(N(r6(100 * (1 - f))) + "\\,\\%") + ".", "Non : la deuxième baisse porte sur le prix déjà baissé, elle « rapporte » moins. La baisse totale (" + N(r6(100 * (1 - f))).replace("{,}", ",") + " %) est plus petite que " + (p1 + p2) + " %."]) }); },
    // Nombres périodiques
    () => { const a = pk([4, 5, 7, 2]), bc = pk([36, 18, 27, 45]);
      return X({ id: "fracconv", lv: 2, titre: "Nombres périodiques",
        q: "On note " + M("x = 0{,}\\overline{" + a + "}") + " (soit " + M("0{,}" + String(a).repeat(4) + "\\ldots") + ") et " + M("y = 0{,}\\overline{" + bc + "}") + ".",
        parts: [{ label: "Calcule " + M("10x - x") + " et déduis-en " + M("x") + " sous forme de fraction.", pts: 2 }, { label: "Même méthode pour " + M("y") + " (choisis bien la puissance de 10).", pts: 2 }, { label: "Calcule " + M("x + y") + " en fraction irréductible.", pts: 1 }],
        sol: ul([M("10x - x = " + a) + ", donc " + M("9x = " + a) + " et " + M("x = " + F(a, 9)) + ".", "Période de 2 chiffres : " + M("100y - y = " + bc) + ", " + M("y = \\frac{" + bc + "}{99} = " + F(bc, 99)) + ".", M(F(a, 9) + " + " + F(bc, 99) + " = \\frac{" + (11 * a + bc) + "}{99}" + (g2(11 * a + bc, 99) > 1 ? " = " + F(11 * a + bc, 99) : "")) + "."]) }); },
    // Les bactéries (puissances de 2)
    () => { const t = pk([30, 60]), n0 = pk([4, 8]);
      return X({ id: "puiss", lv: 1, titre: "Les bactéries",
        q: "Une population de bactéries double toutes les " + t + " minutes. Au départ, il y a " + n0 + " bactérie" + (n0 > 1 ? "s" : "") + ".",
        parts: [{ label: "Combien y en a-t-il après 4 doublements ? Écris-le avec une puissance de 2.", pts: 1 }, { label: "Combien y en a-t-il après " + (10 * t) / 60 + " h ?", pts: 1 }, { label: "Après combien de doublements dépasse-t-on un million ?", pts: 2 }, { label: "Que représente " + M(n0 + " \\cdot 2^{-1}") + " dans cette situation ?", pts: 1 }],
        sol: ul([M(n0 + " \\cdot 2^4 = " + n0 * 16) + ".", (10 * t) / 60 + " h = 10 doublements : " + M(n0 + " \\cdot 2^{10} = " + N(n0 * 1024)) + ".", M(n0 + " \\cdot 2^{" + Math.ceil(Math.log2(1e6 / n0)) + "} = " + N(n0 * 2 ** Math.ceil(Math.log2(1e6 / n0)))) + " : " + Math.ceil(Math.log2(1e6 / n0)) + " doublements (" + M(n0 + " \\cdot 2^{" + (Math.ceil(Math.log2(1e6 / n0)) - 1) + "}") + " est encore trop petit).", "Le nombre de bactéries " + t + " minutes <b>avant</b> le départ : " + M(N(n0 / 2)) + "."]) }); },
    // Distances dans l'Univers (notation scientifique)
    () => { const [star, al] = pk([["Proxima du Centaure", 4.2], ["Sirius", 8.6], ["Véga", 25]]);
      return X({ id: "scicalc", lv: 2, titre: "Distances dans l'Univers",
        q: "La lumière parcourt " + M("3 \\cdot 10^5") + " km par seconde. Une année compte environ " + M("3{,}15 \\cdot 10^7") + " s. L'étoile " + star + " est à " + T(al) + " années-lumière.",
        parts: [{ label: "Calcule la distance parcourue par la lumière en un an (une année-lumière), en km, en notation scientifique.", pts: 2 }, { label: "Calcule la distance de " + star + " en km.", pts: 1 }, { label: "Une sonde voyage à " + M("6 \\cdot 10^4") + " km/h. Combien d'années lui faudrait-il ? (ordre de grandeur)", pts: 2 }],
        sol: ul([M("3 \\cdot 10^5 \\cdot 3{,}15 \\cdot 10^7 = 9{,}45 \\cdot 10^{12}") + " km.", M(N(al) + " \\cdot 9{,}45 \\cdot 10^{12} \\approx " + A((al * 9.45) / (al * 9.45 >= 10 ? 10 : 1), 2) + " \\cdot 10^{" + (al * 9.45 >= 10 ? 13 : 12) + "}") + " km.", "Durée : " + M(A(al * 9.45, 2) + " \\cdot 10^{12} : (6 \\cdot 10^4) \\approx " + A((al * 9.45) / 6, 2) + " \\cdot 10^8") + " h, soit environ " + M(N(Math.round((al * 9.45e12) / 6e4 / 24 / 365 / 1000) * 1000)) + " ans."]) }); },
    // Fourmis et humains (notation scientifique)
    () => X({ id: "scicalc", lv: 2, titre: "Fourmis contre humains",
        q: "On estime qu'il y a environ " + M("2 \\cdot 10^{16}") + " fourmis sur Terre, d'une masse moyenne de " + M("3 \\cdot 10^{-6}") + " kg. Il y a environ " + M("8 \\cdot 10^9") + " humains, d'une masse moyenne de " + M("60") + " kg.",
        parts: [{ label: "Calcule la masse totale des fourmis (en kg, notation scientifique).", pts: 1 }, { label: "Calcule la masse totale des humains.", pts: 1 }, { label: "Qui pèse le plus en tout, et combien de fois plus ? (au dixième)", pts: 2 }],
        sol: ul([M("2 \\cdot 10^{16} \\cdot 3 \\cdot 10^{-6} = 6 \\cdot 10^{10}") + " kg.", M("8 \\cdot 10^9 \\cdot 60 = 480 \\cdot 10^9 = 4{,}8 \\cdot 10^{11}") + " kg.", "Les humains : " + M("4{,}8 \\cdot 10^{11} : (6 \\cdot 10^{10}) = 8") + " fois plus."]) }),
    // Calcul en chaîne (priorités, fractions, puissances)
    () => { const k = pk([2, 3]);
      return X({ id: "prio", lv: 3, titre: "Calculs en chaîne",
        q: "Calcule sans calculatrice, en détaillant chaque étape.",
        parts: [{ label: M("A = 5 - 2 \\cdot (3 - " + (k + 4) + ")^2"), pts: 1 }, { label: M("B = \\frac{2}{3} + \\frac{1}{4} \\cdot \\frac{8}{9}"), pts: 1 }, { label: M("C = \\frac{(-2)^3 + 4^2}{10^{-1} \\cdot 20}"), pts: 2 }, { label: "Place des parenthèses dans " + M("2 + 3 \\cdot 4 - 1") + " pour obtenir 15.", pts: 1 }],
        sol: ul([M("5 - 2 \\cdot (-" + (k + 1) + ")^2 = 5 - 2 \\cdot " + (k + 1) ** 2 + " = " + (5 - 2 * (k + 1) ** 2)) + ".", M("\\frac{2}{3} + \\frac{2}{9} = \\frac{6}{9} + \\frac{2}{9} = \\frac{8}{9}") + " (la multiplication d'abord).", M("\\frac{-8 + 16}{0{,}1 \\cdot 20} = \\frac{8}{2} = 4") + ".", M("(2 + 3) \\cdot (4 - 1) = 15") + "."]) }); },
    // Calcul astucieux (puissances)
    () => X({ id: "puiss", lv: 3, titre: "Calcul astucieux",
        q: "Calcule astucieusement, sans calculatrice, en utilisant les propriétés des puissances.",
        parts: [{ label: M("2^{10} \\cdot 5^{8}"), pts: 1 }, { label: M("\\frac{6^5}{2^4 \\cdot 3^3}"), pts: 1 }, { label: M("0{,}25^{5} \\cdot 4^{6}"), pts: 1 }, { label: "Range dans l'ordre croissant : " + M("2^{30}") + ", " + M("3^{20}") + ", " + M("10^{9}") + " (indice : " + M("2^{10} \\approx 10^3") + ").", pts: 2 }],
        sol: ul([M("2^2 \\cdot (2 \\cdot 5)^8 = 4 \\cdot 10^8") + ".", M("2^{5-4} \\cdot 3^{5-3} = 2 \\cdot 9 = 18") + ".", M("(0{,}25 \\cdot 4)^5 \\cdot 4 = 1 \\cdot 4 = 4") + ".", M("2^{30} = (2^{10})^3 \\approx 1{,}07 \\cdot 10^9") + ", " + M("3^{20} = (3^{10})^2 \\approx 3{,}5 \\cdot 10^9") + " : " + M("10^9 < 2^{30} < 3^{20}") + "."]) }),
  ];
  const RAISONN = [
    () => { const [a, b, c, d] = pk([[2, 3, 1, 4], [1, 2, 1, 3], [3, 5, 1, 2]]), w = who();
      return X({ id: "fracadd", lv: 1, titre: "Trouve l'erreur",
        q: w + " écrit : " + M("\\frac{" + a + "}{" + b + "} + \\frac{" + c + "}{" + d + "} = \\frac{" + (a + c) + "}{" + (b + d) + "}") + ".",
        parts: [{ label: "Sans calculer la bonne réponse, explique pourquoi c'est forcément faux (compare avec " + M("\\frac{" + a + "}{" + b + "}") + ").", pts: 1 }, { label: "Calcule correctement.", pts: 1 }],
        sol: ul([M("\\frac{" + (a + c) + "}{" + (b + d) + "} \\approx " + A((a + c) / (b + d), 2)) + " est plus petit que " + M("\\frac{" + a + "}{" + b + "} \\approx " + A(a / b, 2)) + " : en ajoutant un nombre positif, on ne peut pas obtenir moins.", M("\\frac{" + a * d + "}{" + b * d + "} + \\frac{" + c * b + "}{" + b * d + "} = " + F(a * d + c * b, b * d)) + "."]) }); },
    () => { const S = [["« " + M("(-2)^4 = -16") + " »", false, M("(-2)^4 = 16") + " : quatre facteurs négatifs, résultat positif."], ["« " + M("2^3 \\cdot 2^4 = 2^{12}") + " »", false, "On additionne les exposants : " + M("2^7") + "."], ["« " + M("10^{-2} = 0{,}01") + " »", true, M("10^{-2} = \\frac{1}{100}") + "."], ["« " + M("5^0 = 0") + " »", false, M("5^0 = 1") + " (" + M("5^1 : 5") + ")."]];
      return X({ id: "puiss", lv: 1, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.",
        parts: S.map((s) => ({ label: s[0], pts: 1 })), sol: ul(S.map((s) => "<b>" + (s[1] ? "Vrai" : "Faux") + "</b>. " + s[2])) }); },
    () => { const w = who();
      return X({ id: "scicalc", lv: 2, titre: "Trouve l'erreur",
        q: w + " calcule " + M("(3 \\cdot 10^4) \\cdot (4 \\cdot 10^{-7})") + " et écrit : « " + M("= 12 \\cdot 10^{-28}") + ", c'est en notation scientifique ».",
        parts: [{ label: "Trouve les deux erreurs de " + w + ".", pts: 2 }, { label: "Donne le bon résultat en notation scientifique.", pts: 1 }],
        sol: ul(["Les exposants s'<b>additionnent</b> (" + M("4 + (-7) = -3") + "), ils ne se multiplient pas ; et 12 n'est pas entre 1 et 10.", M("12 \\cdot 10^{-3} = 1{,}2 \\cdot 10^{-2}") + "."]) }); },
    () => { const p = pk([10, 20, 50]);
      return X({ id: "fracconv", lv: 2, titre: "Retour au prix de départ ?",
        q: "Un prix augmente de " + p + " %, puis le nouveau prix baisse de " + p + " %. " + who() + " affirme : « on revient au prix de départ ».",
        parts: [{ label: "Teste avec un prix de 100 CHF.", pts: 1 }, { label: "L'affirmation est-elle vraie ? Explique avec les coefficients multiplicateurs.", pts: 2 }],
        sol: ul([M("100 \\cdot " + N(1 + p / 100) + " = " + (100 + p)) + ", puis " + M((100 + p) + " \\cdot " + N(1 - p / 100) + " = " + N((100 + p) * (1 - p / 100))) + " CHF.", "Faux : " + M(N(1 + p / 100) + " \\cdot " + N(1 - p / 100) + " = " + N((1 + p / 100) * (1 - p / 100))) + ", le prix baisse de " + M(N((p * p) / 100) + "\\,\\%") + " au total. La baisse porte sur un prix plus grand."]) }); },
  ];

  // ===================== 11e · 2. Pythagore =====================
  const EXP = [
    () => { const [a, h, c] = pk([[6, 8, 10], [9, 12, 15], [7, 24, 25], [5, 12, 13]]), d2 = a + pk([1, 2]);
      return X({ id: "pyth", lv: 1, titre: "L'échelle des pompiers",
        q: "Une échelle de " + Q(c, "m") + " est appuyée contre une façade verticale. Son pied est à " + Q(a, "m") + " du mur.",
        parts: [{ label: "Fais un croquis et calcule la hauteur atteinte par le haut de l'échelle.", pts: 2 }, { label: "On recule le pied de l'échelle jusqu'à " + Q(d2, "m") + " du mur. De combien le haut descend-il ? (au cm)", pts: 2 }],
        sol: ul([M("h = \\sqrt{" + c + "^2 - " + a + "^2} = \\sqrt{" + h * h + "} = " + h) + " m.", "Nouvelle hauteur " + M("\\sqrt{" + c * c + " - " + d2 * d2 + "} \\approx " + A(Math.sqrt(c * c - d2 * d2), 2)) + " m : il descend d'environ " + M(A(h - Math.sqrt(c * c - d2 * d2), 2)) + " m."]) }); },
    () => { const a = pk([60, 80, 90]), b = pk([45, 60, 120]), d = Math.sqrt(a * a + b * b), v = pk([1.2, 1.5]);
      return X({ id: "pyth", lv: 1, titre: "Le raccourci",
        q: "Pour traverser un parc rectangulaire de " + Q(a, "m") + " sur " + Q(b, "m") + ", " + who() + " coupe en diagonale au lieu de longer deux côtés. On marche à " + Q(v, "m/s") + ".",
        parts: [{ label: "Calcule la longueur de la diagonale (au dixième).", pts: 2 }, { label: "Combien de mètres économise-t-on ?", pts: 1 }, { label: "Combien de secondes gagne-t-on ?", pts: 1 }],
        sol: ul([M("\\sqrt{" + a + "^2 + " + b + "^2} \\approx " + A(d, 1)) + " m.", M((a + b) + " - " + A(d, 1) + " \\approx " + A(a + b - d, 1)) + " m.", M(A(a + b - d, 1) + " : " + N(v) + " \\approx " + A((a + b - d) / v, 0)) + " s."]) }); },
    () => { const x0 = R.int(-3, 1), y0 = R.int(-3, 1), [p, q] = pk([[4, 2], [3, 1], [2, 4], [6, 3]]);
      const A0 = [x0, y0], B0 = [x0 + p, y0 + q], C0 = [x0 + p - q, y0 + q + p];
      const ab = p * p + q * q, bc = q * q + p * p, ac = (p - q) ** 2 + (q + p) ** 2;
      return X({ id: "pythrec", lv: 2, titre: "Un triangle dans un repère",
        q: "Dans un repère orthonormé (unité : 1 cm), on place " + M("A(" + A0.join(" \\,;\\, ") + ")") + ", " + M("B(" + B0.join(" \\,;\\, ") + ")") + " et " + M("C(" + C0.join(" \\,;\\, ") + ")") + ".",
        parts: [{ label: "Calcule " + M("AB^2") + ", " + M("BC^2") + " et " + M("AC^2") + ".", pts: 2 }, { label: "Le triangle " + M("ABC") + " est-il rectangle ? Justifie.", pts: 1 }, { label: "Calcule son aire.", pts: 1 }],
        sol: ul([M("AB^2 = " + p + "^2 + " + q + "^2 = " + ab) + ", " + M("BC^2 = " + q + "^2 + " + p + "^2 = " + bc) + ", " + M("AC^2 = " + Math.abs(p - q) + "^2 + " + (p + q) + "^2 = " + ac) + ".", M(ab + " + " + bc + " = " + (ab + bc) + " = AC^2") + " : rectangle en " + M("B") + " (réciproque de Pythagore), et isocèle.", M("\\frac{AB \\cdot BC}{2} = \\frac{" + ab + "}{2} = " + N(ab / 2)) + " cm² (car " + M("AB = BC") + ")."]) }); },
    () => { const [a, b, c, d] = pk([[30, 40, 120, 130], [20, 40, 40, 60], [10, 20, 20, 30], [40, 40, 70, 90]]), stick = pk([d - 5, d + 5]);
      return X({ id: "pythfig", lv: 2, titre: "Le bâton dans la boîte",
        q: "Une boîte en forme de pavé droit mesure " + a + " cm × " + b + " cm × " + c + " cm. On veut y ranger un bâton rigide de " + stick + " cm.",
        parts: [{ label: "Calcule la diagonale du fond " + a + " × " + b + ".", pts: 1 }, { label: "Calcule la grande diagonale de la boîte.", pts: 2 }, { label: "Le bâton entre-t-il dans la boîte ? Justifie.", pts: 1 }],
        sol: ul([M("\\sqrt{" + a + "^2 + " + b + "^2} \\approx " + A(Math.hypot(a, b), 2)) + " cm.", M("\\sqrt{" + a + "^2 + " + b + "^2 + " + c + "^2} = \\sqrt{" + d * d + "} = " + d) + " cm.", stick <= d ? "Oui : " + stick + " cm ≤ " + d + " cm, en le plaçant le long de la grande diagonale." : "Non : " + stick + " cm > " + d + " cm, la plus grande longueur possible dans la boîte."]) }); },
    () => { const r = pk([4, 5, 6]);
      return X({ id: "pythfig", lv: 3, titre: "Le carré dans le cercle",
        q: "Un carré " + M("ABCD") + " est inscrit dans un cercle de centre " + M("O") + " et de rayon " + Q(r, "cm") + ".",
        parts: [{ label: "Que représente la diagonale " + M("[AC]") + " pour le cercle ? Quelle est sa longueur ?", pts: 1 }, { label: "Calcule la valeur exacte du côté du carré.", pts: 2 }, { label: "Calcule l'aire du carré, puis le pourcentage du disque qu'il occupe (au %).", pts: 2 }],
        sol: ul(["Un diamètre : " + M(2 * r) + " cm.", M("c^2 + c^2 = " + 4 * r * r) + ", " + M("c^2 = " + 2 * r * r) + ", " + M("c = \\sqrt{" + 2 * r * r + "} = " + r + "\\sqrt{2}") + " cm.", "Aire " + M(2 * r * r) + " cm² ; disque " + M(r * r + "\\pi") + " ; " + M("\\frac{" + 2 * r * r + "}{" + r * r + "\\pi} = \\frac{2}{\\pi} \\approx 64\\,\\%") + "."]) }); },
    () => { const p = pk([32, 43, 55, 65]);
      return X({ id: "pyth", lv: 3, titre: "L'écran 16:9",
        q: "La taille d'un écran est la longueur de sa diagonale, en pouces (1 pouce = " + Q(2.54, "cm") + "). Un écran 16:9 a une largeur " + M("16k") + " et une hauteur " + M("9k") + ". On considère un écran de " + p + " pouces.",
        parts: [{ label: "Diagonale en cm (au dixième).", pts: 1 }, { label: "Montre que " + M("(16k)^2 + (9k)^2 = 337k^2") + " et calcule " + M("k") + " (au centième).", pts: 2 }, { label: "Calcule la largeur et la hauteur de l'écran (au cm).", pts: 2 }],
        sol: ul([M(p + " \\cdot 2{,}54 = " + A(p * 2.54, 1)) + " cm.", M("256k^2 + 81k^2 = 337k^2") + " ; " + M("k = \\frac{" + A(p * 2.54, 1) + "}{\\sqrt{337}} \\approx " + A((p * 2.54) / Math.sqrt(337), 2)) + ".", "Largeur " + M("\\approx " + A((16 * p * 2.54) / Math.sqrt(337), 0)) + " cm, hauteur " + M("\\approx " + A((9 * p * 2.54) / Math.sqrt(337), 0)) + " cm."]) }); },
  ];
  const RAISONP = [
    () => { const [a, b, c] = pk([[5, 12, 13], [6, 8, 10], [9, 12, 15]]), w = who();
      return X({ id: "pyth", lv: 1, titre: "Trouve l'erreur",
        q: "Dans un triangle rectangle de cathètes " + a + " cm et " + b + " cm, " + w + " écrit : « l'hypoténuse mesure " + (a + b) + " cm ».",
        parts: [{ label: "Explique pourquoi c'est impossible (pense aux côtés d'un triangle).", pts: 1 }, { label: "Calcule l'hypoténuse correctement.", pts: 1 }],
        sol: ul(["Dans un triangle, un côté est toujours plus court que la somme des deux autres (inégalité triangulaire) : " + (a + b) + " cm donnerait un triangle « aplati ».", M("\\sqrt{" + a + "^2 + " + b + "^2} = \\sqrt{" + c * c + "} = " + c) + " cm."]) }); },
    () => { const S = [["« Le triangle de côtés 5, 7 et 9 est rectangle. »", false, M("25 + 49 = 74 \\ne 81") + "."], ["« Le triangle de côtés 1,5 ; 2 et 2,5 est rectangle. »", true, M("2{,}25 + 4 = 6{,}25 = 2{,}5^2") + "."], ["« Dans un triangle rectangle, l'hypoténuse est le plus grand côté. »", true, M("c^2 = a^2 + b^2 > a^2") + ", donc " + M("c > a") + " (et de même " + M("c > b") + ")."], ["« Un triangle de côtés 3, 4 et 6 est rectangle, car 3 + 4 > 6. »", false, "Il faut comparer les carrés : " + M("9 + 16 = 25 \\ne 36") + "."]];
      return X({ id: "pythrec", lv: 1, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.", parts: S.map((s) => ({ label: s[0], pts: 1 })), sol: ul(S.map((s) => "<b>" + (s[1] ? "Vrai" : "Faux") + "</b>. " + s[2])) }); },
    () => { const [a, b, c] = pk([[60, 80, 100], [30, 40, 50], [90, 120, 150]]);
      return X({ id: "pythrec", lv: 2, titre: "L'équerre du maçon",
        q: "Pour tracer un angle droit sans équerre, un maçon marque " + a + " cm sur un mur et " + b + " cm sur l'autre, à partir du coin. Il mesure ensuite la distance entre les deux marques.",
        parts: [{ label: "Quelle distance doit-il trouver si l'angle est droit ? Justifie.", pts: 1 }, { label: "Il mesure " + (c + 3) + " cm. L'angle est-il droit ? Plus grand ou plus petit qu'un angle droit ?", pts: 2 }],
        sol: ul([M(c) + " cm, car " + M(a + "^2 + " + b + "^2 = " + c * c + " = " + c + "^2") + " (réciproque de Pythagore).", "Non : " + M((c + 3) + "^2 = " + (c + 3) ** 2 + " \\ne " + c * c) + ". La distance est trop grande : les murs sont plus écartés, l'angle est plus grand qu'un angle droit."]) }); },
    () => { const w = who();
      return X({ id: "pythfig", lv: 2, titre: "Trouve l'erreur",
        q: "Pour la hauteur d'un triangle isocèle de côtés 13 cm, 13 cm et de base 10 cm, " + w + " écrit : « " + M("h^2 = 13^2 - 10^2 = 69") + ", donc " + M("h \\approx 8{,}3") + " cm ».",
        parts: [{ label: "Quelle est l'erreur ? Fais un croquis.", pts: 1 }, { label: "Calcule la hauteur correctement.", pts: 1 }],
        sol: ul(["La hauteur coupe la base en son milieu : le triangle rectangle a pour côté la <b>demi</b>-base, 5 cm.", M("h = \\sqrt{13^2 - 5^2} = \\sqrt{144} = 12") + " cm."]) }); },
  ];

  // ===================== 11e · 3. 3D (volumes et aires) =====================
  const EX3 = [
    () => { const a = pk([60, 80, 100]), b = pk([30, 40]), c = pk([40, 50]), L = pk([30, 40, 60]);
      return X({ id: "vol", lv: 1, titre: "L'aquarium",
        q: "Un aquarium en forme de pavé mesure " + a + " cm de long, " + b + " cm de large et " + c + " cm de haut.",
        parts: [{ label: "Calcule son volume en cm³, puis sa contenance en litres.", pts: 2 }, { label: "On y verse " + L + " L d'eau. À quelle hauteur monte l'eau (au mm) ?", pts: 2 }],
        sol: ul([M(a + " \\cdot " + b + " \\cdot " + c + " = " + N(a * b * c)) + " cm³ = " + M(N((a * b * c) / 1000)) + " L.", M(L + "\\ \\text{L} = " + N(L * 1000)) + " cm³ ; " + M("h = " + N(L * 1000) + " : " + a * b + " \\approx " + A((L * 1000) / (a * b), 1)) + " cm."]) }); },
    () => { const r = pk([3.3, 3.2, 3]), V = 33;
      return X({ id: "vol", lv: 2, titre: "La canette",
        q: "Une canette cylindrique contient 33 cL. Son rayon intérieur est " + Q(r, "cm") + ".",
        parts: [{ label: "Exprime 33 cL en cm³.", pts: 1 }, { label: "Calcule la hauteur minimale de la canette (au mm supérieur : elle doit contenir les 33 cL).", pts: 2 }, { label: "Calcule l'aire totale de métal (disques et paroi), en cm², pour cette hauteur.", pts: 2 }],
        sol: (() => { /* 25.11 soir (revue d'un testeur) : hauteur MINIMALE = arrondi au mm supérieur, sinon la canette ne contient pas tout */
          const hx = 330 / (Math.PI * r * r), hm = Math.ceil(hx * 10 - 1e-9) / 10;
          return ul(["330 cm³.", M("h = \\frac{330}{\\pi \\cdot " + N(r) + "^2} \\approx " + A(hx, 3)) + " cm, donc au mm supérieur " + M(A(hm, 1)) + " cm (une hauteur plus petite ne contiendrait pas les 33 cL).", M("2\\pi \\cdot " + N(r) + "^2 + 2\\pi \\cdot " + N(r) + " \\cdot " + A(hm, 1) + " \\approx " + A(2 * Math.PI * r * r + 2 * Math.PI * r * hm, 1)) + " cm²."]); })() }); },
    () => X({ id: "airepyr", lv: 2, titre: "La pyramide du Louvre",
        q: "La pyramide du Louvre est une pyramide régulière à base carrée de côté " + Q(35.4, "m") + " et de hauteur " + Q(21.6, "m") + ". Ses quatre faces sont en verre.",
        parts: [{ label: "Calcule son volume (au m³).", pts: 1 }, { label: "Calcule son apothème (au cm).", pts: 2 }, { label: "Calcule la surface de verre (au m²).", pts: 2 }],
        sol: ul([M("\\frac{35{,}4^2 \\cdot 21{,}6}{3} \\approx 9\\text{'}023") + " m³.", M("\\sqrt{21{,}6^2 + 17{,}7^2} \\approx 27{,}93") + " m.", M("4 \\cdot \\frac{35{,}4 \\cdot 27{,}93}{2} \\approx 1\\text{'}977") + " m²."]) }),
    () => { const r = pk([2, 3]), h = pk([6, 8, 10]), rho = 0.8;
      return X({ id: "volcomp", lv: 2, titre: "Le silo à grains",
        q: "Un silo est formé d'un cylindre de rayon " + Q(r, "m") + " et de hauteur " + Q(h, "m") + ", surmonté d'une demi-boule de même rayon. Un mètre cube de blé pèse environ " + M("0{,}8") + " tonne.",
        parts: [{ label: "Calcule le volume exact du silo (avec " + M("\\pi") + ").", pts: 2 }, { label: "Donne une valeur arrondie au m³.", pts: 1 }, { label: "Quelle masse de blé contient-il quand il est plein ? (à la tonne)", pts: 1 }],
        sol: ul(["Cylindre " + M(r * r * h + "\\pi") + ", demi-boule " + M("\\frac{2}{3}\\pi \\cdot " + r + "^3 = " + F(2 * r ** 3, 3) + "\\pi") + " ; total " + M(F(3 * r * r * h + 2 * r ** 3, 3) + "\\pi") + " m³.", M("\\approx " + A(((3 * r * r * h + 2 * r ** 3) / 3) * Math.PI, 0)) + " m³.", M("\\approx " + A((((3 * r * r * h + 2 * r ** 3) / 3) * Math.PI * rho), 0)) + " t."]) }); },
    () => { const r = 3, L = pk([14, 16, 18]);
      return X({ id: "volcomp", lv: 3, titre: "La gélule",
        q: "Une gélule a la forme d'un cylindre terminé par deux demi-boules. Son diamètre est " + Q(2 * r, "mm") + " et sa longueur totale " + Q(L, "mm") + ".",
        parts: [{ label: "Quelle est la longueur de la partie cylindrique ?", pts: 1 }, { label: "Calcule le volume exact de la gélule (en mm³, avec " + M("\\pi") + ").", pts: 2 }, { label: "Combien de gélules peut-on remplir avec 1 cm³ de poudre ? (1 cm³ = 1000 mm³)", pts: 1 }],
        sol: ul([M(L + " - 2 \\cdot " + r + " = " + (L - 2 * r)) + " mm.", "Boule " + M("36\\pi") + " + cylindre " + M(9 * (L - 2 * r) + "\\pi") + " = " + M((36 + 9 * (L - 2 * r)) + "\\pi \\approx " + A((36 + 9 * (L - 2 * r)) * Math.PI, 1)) + " mm³.", M("1000 : " + A((36 + 9 * (L - 2 * r)) * Math.PI, 1) + " \\approx " + A(1000 / ((36 + 9 * (L - 2 * r)) * Math.PI), 1)) + " : " + Math.floor(1000 / ((36 + 9 * (L - 2 * r)) * Math.PI)) + " gélules complètes."]) }); },
    () => { const r = pk([3, 4]), h = pk([9, 12]);
      return X({ id: "volcone", lv: 1, titre: "Le cornet de glace",
        q: "Un cornet a la forme d'un cône de rayon " + Q(r, "cm") + " et de hauteur " + Q(h, "cm") + ". On le remplit de glace, puis on pose dessus une demi-boule de glace de même rayon.",
        parts: [{ label: "Calcule le volume du cône (valeur exacte).", pts: 1 }, { label: "Calcule le volume de la demi-boule (valeur exacte).", pts: 1 }, { label: "Quel volume de glace en tout ? Quelle part (en %) est dans le cône ?", pts: 2 }],
        sol: ul([M("\\frac{1}{3}\\pi \\cdot " + r + "^2 \\cdot " + h + " = " + (r * r * h) / 3 + "\\pi") + " cm³.", M("\\frac{2}{3}\\pi \\cdot " + r + "^3 = " + F(2 * r ** 3, 3) + "\\pi") + " cm³.", M(F(r * r * h + 2 * r ** 3, 3) + "\\pi \\approx " + A(((r * r * h + 2 * r ** 3) / 3) * Math.PI, 1)) + " cm³ ; dans le cône : " + M("\\approx " + A((100 * r * r * h) / (r * r * h + 2 * r ** 3), 0) + "\\,\\%") + "."]) }); },
    () => X({ id: "volcone", lv: 3, titre: "Variations",
        q: "On s'intéresse à l'effet d'un agrandissement sur les volumes.",
        parts: [{ label: "Une boule a un rayon de 3 cm. Calcule son volume (exact). Même question pour un rayon de 6 cm.", pts: 1 }, { label: "Par combien le volume est-il multiplié quand le rayon double ? Explique avec la formule.", pts: 1 }, { label: "Un cône a une hauteur de 6 cm et un rayon de 2 cm. Que devient son volume si on double le rayon seulement ? la hauteur seulement ?", pts: 2 }],
        sol: ul([M("36\\pi") + " et " + M("288\\pi") + " cm³.", "Par " + M("2^3 = 8") + " : " + M("\\frac{4}{3}\\pi (2r)^3 = 8 \\cdot \\frac{4}{3}\\pi r^3") + ".", "Rayon doublé : volume × 4 (" + M("r^2") + ") ; hauteur doublée : volume × 2."]) }),
    () => { const r = pk([4, 5, 6]), V = pk([20, 25, 30]);
      return X({ id: "volmanq", lv: 2, titre: "Le verre conique",
        q: "On veut fabriquer un verre en forme de cône de rayon " + Q(r, "cm") + " qui contienne exactement " + V + " cL.",
        parts: [{ label: "Exprime le volume en cm³.", pts: 1 }, { label: "Calcule la profondeur (hauteur) du verre, au mm.", pts: 2 }, { label: "On remplit le verre jusqu'à mi-hauteur : le liquide forme un cône deux fois plus petit. Quelle fraction du verre est remplie ?", pts: 1 }],
        sol: ul([M(V * 10) + " cm³.", M("h = \\frac{3 \\cdot " + V * 10 + "}{\\pi \\cdot " + r + "^2} \\approx " + A((3 * V * 10) / (Math.PI * r * r), 1)) + " cm.", "Toutes les longueurs divisées par 2, le volume par " + M("2^3 = 8") + " : " + M("\\frac{1}{8}") + " du verre seulement !"]) }); },
  ];
  const RAISON3 = [
    () => { const r = pk([3, 6]), h = pk([4, 5]), w = who();
      return X({ id: "volcone", lv: 1, titre: "Trouve l'erreur",
        q: w + " calcule le volume d'un cône de rayon " + r + " cm et de hauteur " + h + " cm : « " + M("V = \\pi \\cdot " + r + "^2 \\cdot " + h + " = " + r * r * h + "\\pi") + " cm³ ».",
        parts: [{ label: "Quelle est l'erreur ?", pts: 1 }, { label: "Calcule le bon volume.", pts: 1 }],
        sol: ul(["C'est le volume du cylindre ; le cône en vaut le tiers.", M("\\frac{" + r * r * h + "\\pi}{3} = " + (r * r * h) / 3 + "\\pi") + " cm³."]) }); },
    () => { const S = [["« Si on double le rayon d'une boule, son volume double. »", false, "Il est multiplié par " + M("2^3 = 8") + "."], ["« Une pyramide vaut le tiers du prisme de même base et même hauteur. »", true, M("V = \\frac{1}{3} A_{\\text{base}} \\cdot h") + "."], ["« 1 L = 100 cm³. »", false, M("1\\ \\text{L} = 1\\ \\text{dm}^3 = 1000\\ \\text{cm}^3") + "."], ["« L'aire d'une sphère de rayon " + M("r") + " vaut " + M("4\\pi r^2") + ". »", true, "C'est la formule (4 fois l'aire d'un grand disque)."]];
      return X({ id: "volcone", lv: 1, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.", parts: S.map((s) => ({ label: s[0], pts: 1 })), sol: ul(S.map((s) => "<b>" + (s[1] ? "Vrai" : "Faux") + "</b>. " + s[2])) }); },
    () => { const d = pk([8, 10, 12]), h = pk([5, 7]), w = who();
      return X({ id: "vol", lv: 2, titre: "Trouve l'erreur",
        q: "Un cylindre a un diamètre de " + d + " cm et une hauteur de " + h + " cm. " + w + " écrit : « " + M("V = \\pi \\cdot " + d + "^2 \\cdot " + h + " = " + d * d * h + "\\pi") + " cm³ ».",
        parts: [{ label: "Quelle est l'erreur ? Par combien le résultat de " + w + " est-il trop grand ?", pts: 2 }, { label: "Calcule le bon volume.", pts: 1 }],
        sol: ul(["Il a pris le diamètre au lieu du rayon : le rayon est doublé, donc le volume est 4 fois trop grand.", M("\\pi \\cdot " + d / 2 + "^2 \\cdot " + h + " = " + (d * d * h) / 4 + "\\pi") + " cm³."]) }); },
    () => X({ id: "airepyr", lv: 2, titre: "Hauteur ou apothème ?",
        q: "Une pyramide régulière à base carrée a un côté de base de 12 cm et une hauteur de 8 cm. " + who() + " calcule son aire latérale : « " + M("4 \\cdot \\frac{12 \\cdot 8}{2} = 192") + " cm² ».",
        parts: [{ label: "Quelle longueur aurait-il fallu utiliser à la place de 8 cm ? Pourquoi ?", pts: 1 }, { label: "Calcule-la, puis calcule l'aire latérale correcte.", pts: 2 }],
        sol: ul(["L'apothème : c'est la hauteur des faces triangulaires, pas celle de la pyramide.", M("a = \\sqrt{8^2 + 6^2} = 10") + " cm ; aire latérale " + M("4 \\cdot \\frac{12 \\cdot 10}{2} = 240") + " cm²."]) }),
  ];

  RICH.no11 = { ids: ["prio", "fracadd", "fracmul", "fracconv", "puiss", "sci", "scicalc"], label: "Nombres et opérations", ex: EXN, raison: RAISONN, minutes: 45, minA: 2 }; /* 25.11 : automatismes au niveau 2 (audit de niveau 11e) */
  RICH.pyth11 = { ids: ["pyth", "pythfig", "pythrec"], label: "Théorème de Pythagore", ex: EXP, raison: RAISONP, minutes: 45, minA: 2 }; /* 25.11 : automatismes au niveau 2 (audit de niveau 11e) */
  RICH.gm3d11 = { ids: ["vol", "volcone", "airepyr", "volcomp", "volmanq"], label: "Volumes et aires (3D)", ex: EX3, raison: RAISON3, minutes: 45, minA: 2 }; /* 25.11 : automatismes au niveau 2 (audit de niveau 11e) */
})();

// Chantier 11e (19.11) : exercices riches et raisonnements du test de préparation pour 7. Angles, 8. Thalès,
// 10. Fonctions, 11. Transformations (homothéties), 12. Probabilités — au niveau d'un vrai test de 11e (contexte,
// plusieurs étapes, interprétation), pas du drill. Même format que riche_11b.js. Chargé après riche.js.
(function () {
  const r6 = (v) => Math.round(v * 1e6) / 1e6;
  const N = (v) => { let [i, f] = String(r6(v)).split("."); if (i.replace("-", "").length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}"); return i + (f ? "{,}" + f : ""); };
  const u = (s) => ("\\ \\text{" + s.replace(/\^([23])/, "}^$1\\text{") + "}").replace(/\\text\{\}$/, "");
  const Q = (v, s) => M(N(v) + u(s));
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const g2 = (a, b) => (b ? g2(b, a % b) : Math.abs(a));
  const F = (n, d) => { const g = g2(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n) : (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
  const pd = (t) => colonBreak(String(t).split(/(\\\(.*?\\\))/).map((seg, i) => (i % 2 ? seg : seg.replace(/\{,\}/g, ",").replace(/\\text\{'\}/g, "'"))).join(""));
  const X = (o) => Object.assign({ pts: Math.max(1, o.parts.reduce((s, p) => s + p.pts, 0)) }, o, { q: pd(o.q), sol: pd(o.sol), parts: o.parts.map((p) => ({ label: pd(p.label), pts: p.pts })) });
  const ul = (rows) => "<ol type=\"a\" class=\"mock-parts\">" + rows.map((r) => "<li>" + r + "</li>").join("") + "</ol>";
  const who = () => pk(["Lina", "Noé", "Inès", "Yanis", "Mia", "Sam"]);
  const P1 = (n) => (n === 1 ? "" : "s");

  // ===================== 7. Angles =====================
  const EXA = [
    () => { const a = pk([35, 42, 48, 55, 62]);
      return X({ id: "angles", lv: 1, titre: "Le passage piéton",
        q: "Deux bords de route parallèles sont coupés par un passage piéton en biais. Le passage fait un angle de " + M(a + "°") + " avec le premier bord.",
        parts: [{ label: "Quel angle fait-il avec le second bord, du côté opposé (alterne-interne) ? Justifie.", pts: 1 }, { label: "Quel angle fait-il avec le second bord, du même côté (entre les deux bords) ?", pts: 1 }],
        sol: ul([M(a + "°") + " : avec des droites parallèles, les angles alternes-internes sont égaux.", M("180° - " + a + "° = " + (180 - a) + "°") + " : angles co-intérieurs supplémentaires."]) }); },
    () => { const a = pk([38, 46, 52, 64]), b = pk([71, 77, 83]);
      return X({ id: "angles", lv: 1, titre: "Le cerf-volant",
        q: "Les deux baguettes d'un cerf-volant forment, avec la toile, un triangle dont deux angles mesurent " + M(a + "°") + " et " + M(b + "°") + ".",
        parts: [{ label: "Calcule le troisième angle.", pts: 1 }, { label: "Le triangle est-il rectangle ? isocèle ? Justifie.", pts: 1 }],
        sol: ul([M("180° - " + a + "° - " + b + "° = " + (180 - a - b) + "°") + ".", (180 - a - b === 90 ? "Il est rectangle. " : "Il n'est pas rectangle (aucun angle de 90°). ") + ([a, b, 180 - a - b].some((x, i, t) => t.indexOf(x) !== i) ? "Il est isocèle (deux angles égaux)." : "Il n'est pas isocèle (trois angles différents).")]) }); },
    () => { const [d, c] = pk([[10, 6], [13, 5], [17, 8], [25, 7]]), b = Math.sqrt(d * d - c * c);
      return X({ id: "cercthales", lv: 2, titre: "La table ronde",
        q: "Une table ronde a un diamètre " + M("[AB]") + " de " + Q(d, "dm") + ". " + who() + " tend une ficelle de " + M("A") + " à un point " + M("C") + " du bord (" + Q(c, "dm") + "), puis de " + M("C") + " à " + M("B") + ".",
        parts: [{ label: "Que vaut l'angle " + M("\\widehat{ACB}") + " ? Quelle propriété utilises-tu ?", pts: 1 }, { label: "Calcule la longueur " + M("CB") + ".", pts: 2 }, { label: "Calcule la longueur totale de ficelle.", pts: 1 }],
        sol: ul([M("90°") + " : un triangle inscrit dans un demi-cercle est rectangle (cercle de Thalès).", "Pythagore : " + M("CB = \\sqrt{" + d + "^2 - " + c + "^2} = " + b) + " dm.", M(c + " + " + b + " = " + (c + b)) + " dm."]) }); },
    () => { const r = pk([3, 4, 5, 6]), d = pk([5, 5, 10, 10]) * (r === 3 || r === 6 ? 1 : 1), t = r === 3 ? [3, 5, 4] : r === 4 ? [4, 5, 3] : r === 5 ? [5, 13, 12] : [6, 10, 8];
      return X({ id: "cercthales", lv: 2, titre: "La tangente au rond-point",
        q: "Un rond-point circulaire a un rayon de " + Q(t[0], "dam") + ". Une route droite touche le rond-point en un seul point " + M("T") + " (elle est tangente). Une voiture sur cette route est en " + M("V") + ", à " + Q(t[1], "dam") + " du centre " + M("O") + ".",
        parts: [{ label: "Quel angle font la route et le rayon " + M("[OT]") + " ?", pts: 1 }, { label: "Calcule la distance " + M("VT") + " entre la voiture et le point de contact.", pts: 2 }],
        sol: ul([M("90°") + " : la tangente est perpendiculaire au rayon au point de contact.", M("VT = \\sqrt{" + t[1] + "^2 - " + t[0] + "^2} = " + t[2]) + " dam (Pythagore dans " + M("OTV") + ", rectangle en " + M("T") + ")."]) }); },
    () => { const a = pk([24, 32, 36, 42]);
      return X({ id: "cercthales", lv: 3, titre: "Angles au centre et inscrits",
        q: "Sur un cercle de centre " + M("O") + ", les points " + M("A") + ", " + M("B") + " et " + M("C") + " sont tels que l'angle inscrit " + M("\\widehat{ACB}") + " mesure " + M(a + "°") + ".",
        parts: [{ label: "Calcule l'angle au centre " + M("\\widehat{AOB}") + ".", pts: 1 }, { label: "Le triangle " + M("AOB") + " est isocèle : pourquoi ? Calcule " + M("\\widehat{OAB}") + ".", pts: 2 }, { label: "Un point " + M("D") + " du cercle est du même côté que " + M("C") + ". Que vaut " + M("\\widehat{ADB}") + " ?", pts: 1 }],
        sol: ul([M("2 \\cdot " + a + "° = " + 2 * a + "°") + ".", M("OA = OB") + " (rayons) ; " + M("\\frac{180° - " + 2 * a + "°}{2} = " + (90 - a) + "°") + ".", M(a + "°") + " : deux angles inscrits qui interceptent le même arc sont égaux."]) }); },
  ];
  const RAISONA = [
    () => X({ id: "angles", lv: 1, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.",
      parts: [{ label: "« Un triangle peut avoir deux angles obtus. »", pts: 1 }, { label: "« Si deux angles alternes-internes sont égaux, les droites sont parallèles. »", pts: 1 }, { label: "« Un triangle inscrit dans un cercle est toujours rectangle. »", pts: 1 }],
      sol: ul(["<b>Faux</b> : deux angles de plus de 90° dépassent déjà 180°.", "<b>Vrai</b> : c'est la réciproque de la propriété des alternes-internes.", "<b>Faux</b> : seulement si l'un de ses côtés est un diamètre (cercle de Thalès)."]) }),
    () => { const a = pk([40, 50, 70]), w = who();
      return X({ id: "cercthales", lv: 2, titre: "Trouve l'erreur", q: "Dans un cercle, un angle au centre mesure " + M(a + "°") + ". " + w + " affirme : « l'angle inscrit qui intercepte le même arc mesure " + M(2 * a + "°") + " ».",
        parts: [{ label: "Où est l'erreur ?", pts: 1 }, { label: "Donne la bonne mesure.", pts: 1 }],
        sol: ul([w + " a doublé au lieu de diviser : c'est l'angle au centre qui vaut le double de l'angle inscrit.", M(a + "° : 2 = " + a / 2 + "°") + "."]) }); },
  ];

  // ===================== 8. Thalès =====================
  const EXT = [
    () => { const b = pk([1.5, 2]), o = pk([1.2, 2.5, 3]), k = pk([8, 10, 12]);
      return X({ id: "thales", lv: 1, titre: "La hauteur du clocher",
        q: "À la même heure, un bâton vertical de " + Q(b, "m") + " a une ombre de " + Q(o, "m") + ", et l'ombre du clocher mesure " + Q(o * k, "m") + ".",
        parts: [{ label: "Fais un schéma : quelles droites sont parallèles ?", pts: 1 }, { label: "Calcule la hauteur du clocher.", pts: 2 }],
        sol: ul(["Les rayons du soleil sont parallèles (et le bâton et le clocher sont verticaux).", "Rapport " + M(N(o * k) + " : " + N(o) + " = " + k) + " ; hauteur " + M(N(b) + " \\cdot " + k + " = " + N(b * k)) + " m."]) }); },
    () => { const [ad, db, ae, de] = pk([[3, 6, 4, 5], [2, 4, 3, 2.5], [4, 6, 6, 3], [5, 10, 4, 6]]), k = (ad + db) / ad;
      return X({ id: "thales", lv: 1, titre: "Le chevalet du peintre",
        q: "Sur un chevalet en forme de triangle " + M("ABC") + ", une traverse " + M("[DE]") + " est parallèle au sol " + M("[BC]") + ", avec " + M("D \\in [AB]") + " et " + M("E \\in [AC]") + ". On mesure " + M("AD = " + N(ad)) + " dm, " + M("DB = " + N(db)) + " dm, " + M("AE = " + N(ae)) + " dm et " + M("DE = " + N(de)) + " dm.",
        parts: [{ label: "Calcule " + M("AB") + ", puis le rapport " + M("\\frac{AB}{AD}") + ".", pts: 1 }, { label: "Calcule l'écartement au sol " + M("BC") + ".", pts: 1 }, { label: "Calcule la longueur " + M("AC") + ".", pts: 1 }],
        sol: ul([M("AB = " + N(ad + db)) + " dm ; rapport " + M(N(k)) + ".", M("BC = " + N(de) + " \\cdot " + N(k) + " = " + N(de * k)) + " dm.", M("AC = " + N(ae) + " \\cdot " + N(k) + " = " + N(ae * k)) + " dm."]) }); },
    () => { const [ad, ab, ae, ac] = pk([[3, 7.5, 4, 10], [2.4, 6, 3, 7.5], [4, 10, 5, 12], [3, 8, 4.5, 12]]), ok = Math.abs(ad / ab - ae / ac) < 1e-9;
      return X({ id: "thalesrec", lv: 2, titre: "L'étagère est-elle horizontale ?",
        q: "Un menuisier vérifie une étagère " + M("[DE]") + " fixée entre deux montants " + M("[AB]") + " et " + M("[AC]") + " qui se rejoignent en " + M("A") + ". Le sol " + M("[BC]") + " est horizontal. Il mesure " + M("AD = " + N(ad)) + " dm, " + M("AB = " + N(ab)) + " dm, " + M("AE = " + N(ae)) + " dm et " + M("AC = " + N(ac)) + " dm.",
        parts: [{ label: "Calcule " + M("\\frac{AD}{AB}") + " et " + M("\\frac{AE}{AC}") + " (en décimal).", pts: 2 }, { label: "L'étagère est-elle parallèle au sol ? Quelle propriété utilises-tu ?", pts: 1 }],
        sol: ul([M("\\frac{" + N(ad) + "}{" + N(ab) + "} = " + N(ad / ab)) + " et " + M("\\frac{" + N(ae) + "}{" + N(ac) + "} = " + N(r6(ae / ac))) + ".", ok ? "Oui : les rapports sont égaux (réciproque du théorème de Thalès)." : "Non : les rapports sont différents (si elle était parallèle, ils seraient égaux, d'après le théorème de Thalès)."]) }); },
    () => { const [ae, ec, de] = pk([[12, 30, 9], [15, 45, 10], [20, 60, 14]]), bc = de * (ae + ec) / ae;
      return X({ id: "thales", lv: 2, titre: "La largeur de la rivière",
        q: "Pour mesurer la largeur " + M("BC") + " d'une rivière, on plante des piquets : " + M("A") + ", " + M("E") + ", " + M("C") + " alignés et " + M("A") + ", " + M("D") + ", " + M("B") + " alignés, avec " + M("(DE) \\parallel (BC)") + ". On mesure " + M("AE = " + ae) + " m, " + M("EC = " + ec) + " m et " + M("DE = " + de) + " m.",
        parts: [{ label: "Calcule " + M("AC") + ".", pts: 1 }, { label: "Calcule la largeur " + M("BC") + " (au dixième).", pts: 2 }],
        sol: ul([M("AC = " + ae + " + " + ec + " = " + (ae + ec)) + " m.", M("BC = " + de + " \\cdot \\frac{" + (ae + ec) + "}{" + ae + "} = " + N(r6(bc))) + " m."]) }); },
    () => { const k = pk([2, 3]), ao = pk([2, 3, 4]), ab = pk([3, 4, 5]);
      return X({ id: "thalesrec", lv: 3, titre: "Le papillon",
        q: "Les droites " + M("(AC)") + " et " + M("(BD)") + " se coupent en " + M("O") + ". On a " + M("OA = " + ao) + " cm, " + M("OC = " + ao * k) + " cm, " + M("OB = " + (ao + 1)) + " cm, " + M("OD = " + (ao + 1) * k) + " cm et " + M("AB = " + ab) + " cm.",
        parts: [{ label: "Montre que " + M("(AB) \\parallel (CD)") + ".", pts: 2 }, { label: "Calcule " + M("CD") + ".", pts: 1 }, { label: "Par combien l'aire du triangle " + M("OAB") + " est-elle multipliée pour obtenir celle de " + M("OCD") + " ?", pts: 1 }],
        sol: ul([M("\\frac{OC}{OA} = \\frac{OD}{OB} = " + k) + " et les points sont alignés dans le même ordre : réciproque de Thalès.", M("CD = " + ab + " \\cdot " + k + " = " + ab * k) + " cm.", "Par " + M(k + "^2 = " + k * k) + " (agrandissement de rapport " + k + ")."]) }); },
  ];
  const RAISONT = [
    () => { const w = who();
      return X({ id: "thales", lv: 1, titre: "Trouve l'erreur", q: "Avec " + M("(DE) \\parallel (BC)") + ", " + M("AD = 4") + ", " + M("DB = 6") + " et " + M("DE = 3") + ", " + w + " écrit : « " + M("\\frac{AD}{DB} = \\frac{DE}{BC}") + ", donc " + M("BC = 4{,}5") + " ».",
        parts: [{ label: "Quelle est l'erreur ?", pts: 1 }, { label: "Calcule " + M("BC") + " correctement.", pts: 1 }],
        sol: ul(["Le rapport doit comparer les côtés des deux triangles " + M("ADE") + " et " + M("ABC") + " : " + M("\\frac{AD}{AB}") + ", pas " + M("\\frac{AD}{DB}") + ".", M("AB = 10") + ", " + M("BC = 3 \\cdot \\frac{10}{4} = 7{,}5") + "."]) }); },
    () => X({ id: "thalesrec", lv: 2, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.",
      parts: [{ label: "« Si AD = 2, AB = 5, AE = 3 et AC = 7, alors (DE) ∥ (BC). »", pts: 1 }, { label: "« Thalès permet de calculer des longueurs ; sa réciproque sert à prouver un parallélisme. »", pts: 1 }],
      sol: ul(["<b>Faux</b> : " + M("\\frac{2}{5} = 0{,}4") + " et " + M("\\frac{3}{7} \\approx 0{,}43") + " ; rapports différents.", "<b>Vrai</b>."]) }),
  ];

  // ===================== 10. Fonctions =====================
  const EXF = [
    () => { const F0 = pk([3, 4, 5]), p = pk([2, 2.5, 3]), xs = [2, 5, 10];
      return X({ id: "tabval", lv: 1, titre: "Le parking",
        q: "Un parking coûte " + Q(F0, "CHF") + " à l'entrée, puis " + Q(p, "CHF") + " par heure. On note " + M("f(x)") + " le prix pour " + M("x") + " heures.",
        parts: [{ label: "Complète le tableau de valeurs pour " + M("x = 2") + ", " + M("5") + " et " + M("10") + ".", pts: 2 }, { label: "Écris l'expression de " + M("f(x)") + ".", pts: 1 }, { label: "Avec " + Q(F0 + p * 8, "CHF") + ", combien d'heures peut-on rester ?", pts: 1 }],
        sol: ul([xs.map((x) => M("f(" + x + ") = " + N(F0 + p * x))).join(" ; ") + " (CHF).", M("f(x) = " + F0 + " + " + N(p) + "x") + ".", M(N(F0 + p * 8) + " - " + F0 + " = " + N(p * 8)) + " ; " + M(N(p * 8) + " : " + N(p) + " = 8") + " heures."]) }); },
    () => { const [a, b] = pk([[-1, 3], [2, -1], [1, -2], [-2, 4]]);
      return X({ id: "repere", lv: 1, titre: "Le plan de la ville",
        q: "Sur le plan d'une ville (repère, unité 100 m), l'école est en " + M("E(" + a + " ; " + b + ")") + ", la gare en " + M("G(" + (a + 6) + " ; " + b + ")") + " et la piscine en " + M("P(" + (a + 6) + " ; " + (b - 8) + ")") + ".",
        parts: [{ label: "Dans quel quadrant est l'école ?", pts: 1 }, { label: "Donne les coordonnées du milieu de " + M("[EG]") + ".", pts: 1 }, { label: "Calcule la distance réelle entre l'école et la piscine (Pythagore).", pts: 2 }],
        sol: ul([(a < 0 ? (b > 0 ? "En haut à gauche." : "En bas à gauche.") : b > 0 ? "En haut à droite." : "En bas à droite.") + "", M("(" + (a + 3) + " ; " + b + ")") + ".", M("EG = 6") + ", " + M("GP = 8") + " (angle droit en " + M("G") + ") : " + M("EP = \\sqrt{36 + 64} = 10") + ", soit 1000 m."]) }); },
    () => { const [x1, y1, x2, y2] = pk([[0, 1, 2, 5], [1, -1, 3, 3], [0, 4, 2, 0], [-1, 2, 1, 6]]), a = (y2 - y1) / (x2 - x1), b = y1 - a * x1;
      return X({ id: "affine", lv: 2, titre: "La droite par deux points",
        q: "Une fonction affine " + M("f") + " vérifie " + M("f(" + x1 + ") = " + y1) + " et " + M("f(" + x2 + ") = " + y2) + ".",
        parts: [{ label: "Calcule la pente " + M("a") + ".", pts: 1 }, { label: "Calcule l'ordonnée à l'origine " + M("b") + " et écris " + M("f(x)") + ".", pts: 1 }, { label: "Calcule " + M("f(10)") + " et le nombre dont l'image est " + M(N(a * 4 + b)) + ".", pts: 2 }],
        sol: ul([M("a = \\frac{" + y2 + " - " + (y1 < 0 ? "(" + y1 + ")" : y1) + "}{" + x2 + " - " + (x1 < 0 ? "(" + x1 + ")" : x1) + "} = " + N(a)) + ".", M("b = " + N(b)) + " ; " + M("f(x) = " + N(a) + "x " + (b < 0 ? "- " + N(-b) : "+ " + N(b))) + ".", M("f(10) = " + N(10 * a + b)) + " ; le nombre est " + M("4") + "."]) }); },
    () => { const t0 = pk([18, 20, 22]), d = pk([3, 4, 5]);
      return X({ id: "affine", lv: 2, titre: "La température en altitude",
        q: "Au bord du lac (altitude " + Q(400, "m") + "), il fait " + M(t0 + "\\,°\\text{C}") + ". La température baisse de " + M(d / 5 * 5 === d ? d : d) + " °C chaque fois qu'on monte de " + Q(500, "m") + ".",
        parts: [{ label: "Quelle température fait-il à " + Q(1900, "m") + " ?", pts: 1 }, { label: "Écris la température " + M("T(h)") + " en fonction du nombre " + M("h") + " de tranches de 500 m au-dessus du lac.", pts: 1 }, { label: "À partir de quelle altitude gèle-t-il (" + M("T < 0") + ") ? Arrondis à la tranche de 500 m.", pts: 2 }],
        sol: ul(["3 tranches : " + M(t0 + " - 3 \\cdot " + d + " = " + (t0 - 3 * d)) + " °C.", M("T(h) = " + t0 + " - " + d + "h") + ".", M(t0 + " - " + d + "h < 0 \\iff h > " + N(r6(t0 / d))) + " : " + Math.floor(t0 / d + 1) + " tranches, soit vers " + Q(400 + 500 * Math.floor(t0 / d + 1), "m") + "."]) }); },
    () => { const pA = pk([12, 15]), F = pk([60, 90]), pB = pA - pk([3, 5]), n = F / (pA - pB);
      return X({ id: "affine", lv: 3, titre: "Deux tarifs de fitness",
        q: "Tarif A : " + Q(pA, "CHF") + " par séance. Tarif B : abonnement de " + Q(F, "CHF") + " plus " + Q(pB, "CHF") + " par séance.",
        parts: [{ label: "Écris le prix " + M("A(x)") + " et " + M("B(x)") + " pour " + M("x") + " séances.", pts: 1 }, { label: "Pour combien de séances les deux tarifs coûtent-ils le même prix ?", pts: 2 }, { label: "Représente les deux droites et explique quel tarif choisir selon le nombre de séances.", pts: 1 }],
        sol: ul([M("A(x) = " + pA + "x") + " ; " + M("B(x) = " + F + " + " + pB + "x") + ".", M(pA + "x = " + F + " + " + pB + "x \\iff " + (pA - pB) + "x = " + F + " \\iff x = " + N(n)) + ".", "Moins de " + N(n) + " séances : A ; plus : B (la droite de B est en dessous)."]) }); },
  ];
  const RAISONF = [
    () => X({ id: "tabval", lv: 1, titre: "Trouve l'erreur", q: "Pour " + M("f(x) = x^2 - 3x") + ", " + who() + " calcule " + M("f(-2) = -4 + 6 = 2") + ".",
      parts: [{ label: "Où est l'erreur ?", pts: 1 }, { label: "Calcule " + M("f(-2)") + " correctement.", pts: 1 }],
      sol: ul([M("(-2)^2 = 4") + ", pas " + M("-4") + " : il faut des parenthèses.", M("4 + 6 = 10") + "."]) }),
    () => X({ id: "affine", lv: 2, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.",
      parts: [{ label: "« f(x) = 3x est une fonction linéaire : son graphe passe par l'origine. »", pts: 1 }, { label: "« Le tableau x : 1, 2, 3 ; f(x) : 4, 6, 9 est celui d'une fonction affine. »", pts: 1 }],
      sol: ul(["<b>Vrai</b> : " + M("f(0) = 0") + ".", "<b>Faux</b> : les accroissements (2, puis 3) ne sont pas constants."]) }),
  ];

  // ===================== 11. Transformations (homothéties, similitudes) =====================
  const EXS = [
    () => { const e = pk([20, 25, 50]), l = pk([12, 16, 18]);
      return X({ id: "simil", lv: 1, titre: "La maquette",
        q: "Une maquette de bateau est à l'échelle " + M("1\\,:\\," + e) + ". Elle mesure " + Q(l, "cm") + " de long.",
        parts: [{ label: "Quelle est la longueur réelle du bateau (en m) ?", pts: 1 }, { label: "La voile de la maquette a une aire de " + Q(30, "cm^2") + ". Quelle est l'aire réelle (en m²) ?", pts: 2 }],
        sol: ul([M(l + " \\cdot " + e + " = " + l * e) + " cm, soit " + M(N(l * e / 100)) + " m.", "Aires × " + M(e + "^2 = " + e * e) + " : " + M("30 \\cdot " + e * e + " = " + N(30 * e * e)) + " cm² = " + M(N(30 * e * e / 10000)) + " m²."]) }); },
    () => { const k = pk([1.5, 2, 2.5]), a = pk([4, 6, 8]), b = pk([3, 5]);
      return X({ id: "simil", lv: 1, titre: "Agrandir une photo",
        q: "Une photo de " + Q(a, "cm") + " sur " + Q(b, "cm") + " est agrandie dans le rapport " + M(N(k)) + ".",
        parts: [{ label: "Calcule les nouvelles dimensions.", pts: 1 }, { label: "Par combien son périmètre est-il multiplié ? Et son aire ?", pts: 2 }],
        sol: ul([M(N(a * k)) + " cm sur " + M(N(b * k)) + " cm.", "Périmètre × " + M(N(k)) + " ; aire × " + M(N(k) + "^2 = " + N(k * k)) + "."]) }); },
    () => { const k = pk([2, 3]), V = pk([250, 330, 500]);
      return X({ id: "simil", lv: 2, titre: "Le grand modèle de bouteille",
        q: "Une publicité montre une bouteille géante, agrandissement de rapport " + M(k) + " d'une bouteille de " + Q(V, "mL") + ".",
        parts: [{ label: "Par combien les longueurs sont-elles multipliées ? Les volumes ?", pts: 1 }, { label: "Quel serait le volume de la bouteille géante (en L) ?", pts: 2 }, { label: who() + " pense que la géante contient " + k + " fois plus. Explique son erreur.", pts: 1 }],
        sol: ul(["Longueurs × " + M(k) + " ; volumes × " + M(k + "^3 = " + k ** 3) + ".", M(V + " \\cdot " + k ** 3 + " = " + V * k ** 3) + " mL = " + M(N(V * k ** 3 / 1000)) + " L.", "Les trois dimensions sont multipliées par " + k + " : le volume l'est par " + k ** 3 + "."]) }); },
    () => { const oa = pk([2, 3, 4]), k = pk([2, 3]), ab = pk([3, 5]);
      return X({ id: "simil", lv: 2, titre: "L'homothétie",
        q: "L'homothétie de centre " + M("O") + " et de rapport " + M(k) + " transforme " + M("A") + " en " + M("A'") + " et " + M("B") + " en " + M("B'") + ". On a " + M("OA = " + oa) + " cm et " + M("AB = " + ab) + " cm.",
        parts: [{ label: "Calcule " + M("OA'") + " et " + M("AA'") + ".", pts: 2 }, { label: "Calcule " + M("A'B'") + ". Que peut-on dire des droites " + M("(AB)") + " et " + M("(A'B')") + " ?", pts: 2 }],
        sol: ul([M("OA' = " + k * oa) + " cm ; " + M("AA' = " + (k - 1) * oa) + " cm.", M("A'B' = " + k * ab) + " cm ; elles sont parallèles (une homothétie conserve les directions)."]) }); },
    () => { const k = pk([3, 4]), A = pk([6, 8]);
      return X({ id: "simil", lv: 3, titre: "Retrouver le rapport",
        q: "Deux triangles semblables ont des aires de " + Q(A, "cm^2") + " et " + Q(A * k * k, "cm^2") + ". Le petit a un périmètre de " + Q(12, "cm") + ".",
        parts: [{ label: "Quel est le rapport des aires ? Déduis-en le rapport des longueurs.", pts: 2 }, { label: "Calcule le périmètre du grand triangle.", pts: 1 }],
        sol: ul(["Aires × " + M(k * k) + ", donc longueurs × " + M("\\sqrt{" + k * k + "} = " + k) + ".", M("12 \\cdot " + k + " = " + 12 * k) + " cm."]) }); },
  ];
  const RAISONS = [
    () => X({ id: "simil", lv: 1, titre: "Trouve l'erreur", q: who() + " double le côté d'un carré de 5 cm et dit : « l'aire double aussi, elle passe de 25 à 50 cm² ».",
      parts: [{ label: "Où est l'erreur ?", pts: 1 }, { label: "Donne la nouvelle aire.", pts: 1 }],
      sol: ul(["Longueurs × 2, donc aire × 2² = 4.", M("10^2 = 100") + " cm²."]) }),
    () => X({ id: "simil", lv: 2, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.",
      parts: [{ label: "« Une homothétie de rapport 0,5 réduit les longueurs de moitié. »", pts: 1 }, { label: "« Deux rectangles sont toujours semblables. »", pts: 1 }],
      sol: ul(["<b>Vrai</b>.", "<b>Faux</b> : 2 × 1 et 3 × 1 n'ont pas les mêmes proportions."]) }),
  ];

  // ===================== 12. Probabilités =====================
  const EXP = [
    () => { const r = pk([3, 4, 5]), b = pk([2, 3]), v = pk([1, 2]), n = r + b + v;
      return X({ id: "proba", lv: 1, titre: "Le sac de bonbons",
        q: "Un sac contient " + r + " bonbons à la fraise, " + b + " à la menthe et " + v + " au citron. " + who() + " en prend un au hasard.",
        parts: [{ label: "Quelle est la probabilité qu'il soit à la fraise ?", pts: 1 }, { label: "Quelle est la probabilité qu'il ne soit pas à la menthe ?", pts: 1 }, { label: "Combien de bonbons à la menthe faut-il ajouter pour que la menthe ait autant de chances que la fraise ?", pts: 1 }],
        sol: ul([M(F(r, n)) + ".", M("1 - " + F(b, n) + " = " + F(n - b, n)) + ".", M(r - b) + " bonbon" + P1(r - b) + " (pour en avoir " + r + " de chaque)."]) }); },
    () => { const [e, p, d] = pk([[3, 4, 2], [2, 5, 3], [4, 3, 2]]);
      return X({ id: "denombr", lv: 1, titre: "Le menu de la cantine",
        q: "La cantine propose " + e + " entrées, " + p + " plats et " + d + " desserts. Un menu comprend une entrée, un plat et un dessert.",
        parts: [{ label: "Combien de menus différents existe-t-il ? (arbre)", pts: 2 }, { label: "Un élève choisit au hasard. Probabilité qu'il ait un menu donné ?", pts: 1 }],
        sol: ul([M(e + " \\cdot " + p + " \\cdot " + d + " = " + e * p * d) + " menus.", M(F(1, e * p * d))]) }); },
    () => { const s = pk([5, 6, 8, 9]), c = 6 - Math.abs(7 - s);
      return X({ id: "proba", lv: 2, titre: "Le jeu de dés",
        q: "On lance deux dés équilibrés et on additionne les points. On gagne si la somme vaut " + s + " ou 7.",
        parts: [{ label: "Construis le tableau des 36 sommes.", pts: 1 }, { label: "Quelle est la probabilité d'obtenir " + s + " ? D'obtenir 7 ?", pts: 2 }, { label: "Quelle est la probabilité de gagner ?", pts: 1 }],
        sol: ul(["Tableau 6 × 6 (sommes de 2 à 12).", M(F(c, 36)) + " et " + M(F(6, 36)) + ".", M(F(c + 6, 36)) + " (événements incompatibles : on additionne)."]) }); },
    () => { const n = pk([6, 7, 8]);
      return X({ id: "denombr", lv: 2, titre: "Le tournoi de ping-pong",
        q: n + " amis organisent un tournoi : chacun joue une fois contre chacun des autres.",
        parts: [{ label: "Combien de matchs chaque joueur joue-t-il ?", pts: 1 }, { label: "Combien de matchs y a-t-il en tout ? Explique pourquoi on divise par 2.", pts: 2 }, { label: "Ils veulent aussi un podium (or, argent, bronze). Combien de podiums possibles ?", pts: 1 }],
        sol: ul([M(n - 1) + ".", M("\\frac{" + n + " \\cdot " + (n - 1) + "}{2} = " + n * (n - 1) / 2) + " : le match A–B est le même que B–A.", M(n + " \\cdot " + (n - 1) + " \\cdot " + (n - 2) + " = " + n * (n - 1) * (n - 2)) + "."]) }); },
    () => { const r = pk([4, 5, 6]), v = pk([2, 3]), n = r + v;
      return X({ id: "proba", lv: 3, titre: "Deux tirages sans remise",
        q: "Une urne contient " + r + " boules rouges et " + v + " vertes. On tire une boule, on ne la remet pas, puis on en tire une deuxième.",
        parts: [{ label: "Dessine l'arbre avec les probabilités sur chaque branche.", pts: 1 }, { label: "Probabilité de tirer deux boules rouges ?", pts: 1 }, { label: "Probabilité de tirer deux boules de couleurs différentes ?", pts: 2 }],
        sol: ul(["1er tirage : " + M(F(r, n)) + " / " + M(F(v, n)) + " ; 2e tirage avec " + (n - 1) + " boules.", M(F(r, n) + " \\cdot " + F(r - 1, n - 1) + " = " + F(r * (r - 1), n * (n - 1))) + ".", M("2 \\cdot " + F(r, n) + " \\cdot " + F(v, n - 1) + " = " + F(2 * r * v, n * (n - 1))) + "."]) }); },
  ];
  const RAISONP2 = [
    () => X({ id: "proba", lv: 1, titre: "Trouve l'erreur", q: who() + " dit : « Avec deux dés, la somme peut valoir 2, 3, …, 12 : 11 résultats, donc la probabilité d'avoir 7 est " + M("\\frac{1}{11}") + " ».",
      parts: [{ label: "Où est l'erreur ?", pts: 1 }, { label: "Donne la bonne probabilité.", pts: 1 }],
      sol: ul(["Les 11 sommes ne sont pas équiprobables : il faut compter les 36 couples.", M("\\frac{6}{36} = \\frac{1}{6}") + "."]) }),
    () => X({ id: "denombr", lv: 2, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.",
      parts: [{ label: "« Avec 3 chiffres différents parmi 1 à 5, on forme 5 · 4 · 3 = 60 codes. »", pts: 1 }, { label: "« Une probabilité peut valoir 1,2. »", pts: 1 }],
      sol: ul(["<b>Vrai</b> : le nombre de choix diminue à chaque position.", "<b>Faux</b> : une probabilité est toujours entre 0 et 1."]) }),
  ];

  // ===================== Révisions de 10e : 6. Puissances et racines, 10. Proportionnalité =====================
  const EXC = [
    () => { const s = pk([12, 15, 18, 25]);
      return X({ id: "carres", lv: 1, titre: "Le carrelage",
        q: "Une terrasse carrée a une aire de " + Q(s * s, "m^2") + ". On la borde d'une bande de fleurs sur tout son tour.",
        parts: [{ label: "Calcule la longueur du côté de la terrasse.", pts: 1 }, { label: "Calcule la longueur de la bande de fleurs (périmètre).", pts: 1 }, { label: "Une deuxième terrasse a une aire de " + Q(2 * s * s, "m^2") + ". Son côté est-il le double ? Calcule-le au cm près.", pts: 2 }],
        sol: ul([M("\\sqrt{" + s * s + "} = " + s) + " m.", M("4 \\cdot " + s + " = " + 4 * s) + " m.", "Non : " + M("\\sqrt{" + 2 * s * s + "} = " + s + "\\sqrt{2} \\approx " + N(Math.round(s * Math.SQRT2 * 100) / 100)) + " m (côté × √2, aire × 2)."]) }); },
    () => { const k = pk([7, 8, 9, 11]);
      return X({ id: "carres", lv: 2, titre: "Encadrer sans calculatrice",
        q: "Sans calculatrice, on veut situer " + M("\\sqrt{" + (k * k + k) + "}") + ".",
        parts: [{ label: "Entre quels carrés parfaits consécutifs se trouve " + M(k * k + k) + " ?", pts: 1 }, { label: "Encadre " + M("\\sqrt{" + (k * k + k) + "}") + " entre deux entiers consécutifs.", pts: 1 }, { label: "Est-il plus proche de " + k + " ou de " + (k + 1) + " ? Justifie avec " + M(N(k + 0.5) + "^2") + ".", pts: 2 }],
        sol: ul([M(k * k + " < " + (k * k + k) + " < " + (k + 1) * (k + 1)) + ".", M(k + " < \\sqrt{" + (k * k + k) + "} < " + (k + 1)) + ".", M(N(k + 0.5) + "^2 = " + N((k + 0.5) ** 2)) + " > " + M(k * k + k) + " : il est plus proche de " + k + "."]) }); },
    () => { const e = pk([3, 4, 5]);
      return X({ id: "puiss", lv: 2, titre: "La feuille pliée",
        q: "On plie une feuille en deux, puis encore en deux, et ainsi de suite. Une feuille mesure " + Q(0.1, "mm") + " d'épaisseur.",
        parts: [{ label: "Combien de couches y a-t-il après " + e + " pliages ? Écris-le comme une puissance.", pts: 1 }, { label: "Quelle est alors l'épaisseur (en mm) ?", pts: 1 }, { label: "Après combien de pliages dépasse-t-on 1 cm ?", pts: 2 }],
        sol: ul([M("2^" + e + " = " + 2 ** e) + " couches.", M(2 ** e + " \\cdot 0{,}1 = " + N(2 ** e * 0.1)) + " mm.", "Il faut " + M("2^n \\cdot 0{,}1 > 10") + ", soit " + M("2^n > 100") + " : " + M("2^7 = 128") + ", donc 7 pliages."]) }); },
    () => X({ id: "rac", lv: 3, titre: "Valeurs exactes",
      q: "Un carré a un côté de " + Q(6, "cm") + ".",
      parts: [{ label: "Calcule la valeur exacte de sa diagonale, sous la forme " + M("a\\sqrt{b}") + ".", pts: 2 }, { label: "Un carré a une aire de " + Q(72, "cm^2") + ". Écris son côté sous la forme " + M("a\\sqrt{b}") + ".", pts: 1 }, { label: "Compare les deux résultats. Que remarques-tu ?", pts: 1 }],
      sol: ul([M("\\sqrt{36 + 36} = \\sqrt{72} = 6\\sqrt{2}") + " cm.", M("\\sqrt{72} = \\sqrt{36 \\cdot 2} = 6\\sqrt{2}") + " cm.", "Égaux : le carré construit sur la diagonale a une aire double (72 = 2 · 36)."]) }),
    // 20.11 (commentaires testeurs : « questions identiques », « manque les racines cubiques et des calculs plus complexes ») :
    // banque élargie de 4 à 8 exercices, dont racines cubiques et calculs enchaînés.
    () => { const k = pk([4, 5, 6, 7, 8]);
      return X({ id: "carres", lv: 2, titre: "L'aquarium cubique",
        q: "Un aquarium cubique a une contenance de " + Q(k ** 3, "dm^3") + ".",
        parts: [{ label: "Calcule la longueur d'une arête (en dm).", pts: 1 }, { label: "Calcule l'aire d'une face, puis l'aire totale des vitres si l'aquarium n'a pas de couvercle (en dm²).", pts: 2 }, { label: "Combien de litres contient-il ? Et combien de litres contiendrait un aquarium d'arête double ?", pts: 1 }],
        sol: ul([M("\\sqrt[3]{" + k ** 3 + "} = " + k) + " dm.", "Une face : " + M(k + "^2 = " + k * k) + " dm² ; sans couvercle, 5 faces : " + M("5 \\cdot " + k * k + " = " + 5 * k * k) + " dm².", M(N(k ** 3)) + " L (1 dm³ = 1 L) ; arête double : volume × 8, soit " + M(N(8 * k ** 3)) + " L."]) }); },
    () => { const [a, b, c] = pk([[3, 4, 5], [6, 8, 10], [5, 12, 13]]), m = pk([2, 3, 4]), n = pk([2, 3]), v1 = c * m, v2 = -(n ** 3) + Math.sqrt(49), e = pk([2, 3]);
      return X({ id: "rac", lv: 3, titre: "Calculs enchaînés",
        q: "Calcule sans calculatrice, en détaillant les étapes.",
        parts: [{ label: M("\\sqrt{" + a + "^2 + " + b + "^2} \\cdot \\sqrt[3]{" + m ** 3 + "}"), pts: 1 }, { label: M("\\sqrt[3]{-" + n ** 3 + "} + \\sqrt{0{,}49} \\cdot 10"), pts: 1 }, { label: M("(-2)^" + (e * 2 + 1) + " + \\sqrt{" + (e * 6) ** 2 + "} \\div " + e), pts: 1 }, { label: M("\\left(\\sqrt{5}\\right)^2 + \\sqrt[3]{" + 1000 + "} - 2^4"), pts: 1 }],
        sol: ul([M("\\sqrt{" + c * c + "} \\cdot " + m + " = " + c + " \\cdot " + m + " = " + v1) + ".", M("-" + n + " + 0{,}7 \\cdot 10 = -" + n + " + 7 = " + (7 - n)) + ".", M((-(2 ** (e * 2 + 1))) + " + " + e * 6 + " \\div " + e + " = " + (-(2 ** (e * 2 + 1))) + " + 6 = " + (-(2 ** (e * 2 + 1)) + 6)) + " (division avant addition).", M("5 + 10 - 16 = -1") + "."]) }); },
    () => { const L = pk([2, 3, 4, 5]), c = 10 * L;
      return X({ id: "carres", lv: 3, titre: "Le cube de sucres",
        q: "Avec des morceaux de sucre cubiques de " + Q(1, "cm") + " d'arête, on construit un grand cube plein.",
        parts: [{ label: "Le grand cube contient " + M(N(c ** 3)) + " morceaux. Combien de morceaux y a-t-il sur une arête ?", pts: 1 }, { label: "Combien de morceaux sont visibles sur une seule face ?", pts: 1 }, { label: "On ajoute une couche pour obtenir un cube d'arête " + (c + 1) + ". Combien de morceaux faut-il ajouter ?", pts: 2 }],
        sol: ul([M("\\sqrt[3]{" + N(c ** 3) + "} = " + c) + " (car " + M(c + "^3 = " + N(c ** 3)) + ").", M(c + "^2 = " + N(c * c)) + ".", M((c + 1) + "^3 - " + c + "^3 = " + N((c + 1) ** 3) + " - " + N(c ** 3) + " = " + N((c + 1) ** 3 - c ** 3)) + "."]) }); },
    () => { const e = pk([3, 4, 5, 6]), x = pk([2, 3, 4]);
      return X({ id: "puiss", lv: 3, titre: "Puissances et racines mêlées",
        q: "Simplifie, puis calcule.",
        parts: [{ label: M("\\frac{" + x + "^{" + (e + 2) + "}}{" + x + "^{" + e + "}}"), pts: 1 }, { label: M("\\sqrt{" + x + "^{" + 2 * e + "}}") + " (écris-le comme une puissance de " + x + ")", pts: 1 }, { label: M("\\sqrt[3]{" + x + "^6} + \\sqrt{" + x + "^4}"), pts: 1 }, { label: M("10^3 \\cdot \\sqrt{0{,}01}"), pts: 1 }],
        sol: ul([M(x + "^2 = " + x * x) + ".", M(x + "^{" + e + "} = " + N(x ** e)) + " (car " + M("(" + x + "^{" + e + "})^2 = " + x + "^{" + 2 * e + "}") + ").", M(x + "^2 + " + x + "^2 = " + 2 * x * x) + ".", M("1000 \\cdot 0{,}1 = 100") + "."]) }); },
  ];
  const RAISONC = [
    () => X({ id: "carres", lv: 1, titre: "Trouve l'erreur", q: who() + " écrit : « " + M("\\sqrt{16 + 9} = \\sqrt{16} + \\sqrt{9} = 7") + " ».",
      parts: [{ label: "Où est l'erreur ?", pts: 1 }, { label: "Calcule correctement.", pts: 1 }],
      sol: ul(["La racine d'une somme n'est pas la somme des racines.", M("\\sqrt{25} = 5") + "."]) }),
    () => X({ id: "puiss", lv: 2, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.",
      parts: [{ label: "« " + M("(-3)^2 = -9") + " »", pts: 1 }, { label: "« " + M("2^3 \\cdot 2^4 = 2^7") + " »", pts: 1 }, { label: "« " + M("0{,}2^2 = 0{,}4") + " »", pts: 1 }],
      sol: ul(["<b>Faux</b> : " + M("(-3) \\cdot (-3) = 9") + ".", "<b>Vrai</b> : on additionne les exposants.", "<b>Faux</b> : " + M("0{,}2 \\cdot 0{,}2 = 0{,}04") + "."]) }),
    () => X({ id: "carres", lv: 2, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.",
      parts: [{ label: "« " + M("\\sqrt[3]{-8} = -2") + " »", pts: 1 }, { label: "« " + M("\\sqrt[3]{8 + 27} = \\sqrt[3]{8} + \\sqrt[3]{27} = 5") + " »", pts: 1 }, { label: "« Le cube d'un nombre est toujours plus grand que ce nombre. »", pts: 1 }],
      sol: ul(["<b>Vrai</b> : " + M("(-2)^3 = -8") + ".", "<b>Faux</b> : " + M("\\sqrt[3]{35}") + " n'est pas entier (" + M("3^3 = 27 < 35 < 64 = 4^3") + ") ; la racine d'une somme n'est pas la somme des racines.", "<b>Faux</b> : " + M("0{,}5^3 = 0{,}125 < 0{,}5") + " (et pour les négatifs, " + M("(-2)^3 = -8 < -2") + ")."]) }),
  ];
  const EXV = [
    () => { const P0 = pk([60, 80, 120]), p = pk([15, 20, 25]);
      return X({ id: "pctvar", lv: 1, titre: "Les soldes",
        q: "Un sweat coûte " + Q(P0, "CHF") + ". Pendant les soldes, son prix baisse de " + p + " %.",
        parts: [{ label: "Calcule le montant de la réduction.", pts: 1 }, { label: "Calcule le prix soldé, puis le coefficient multiplicateur utilisé.", pts: 2 }],
        sol: ul([M(N(P0) + " \\cdot " + N(p / 100) + " = " + N(P0 * p / 100)) + " CHF.", M(N(P0 * (1 - p / 100))) + " CHF ; coefficient " + M(N(1 - p / 100)) + "."]) }); },
    () => { const a = pk([40, 50, 80]), b = a * pk([1.2, 1.25, 1.5]);
      return X({ id: "pctvar", lv: 2, titre: "L'abonnement augmente",
        q: "L'abonnement de bus passe de " + Q(a, "CHF") + " à " + Q(b, "CHF") + " par mois.",
        parts: [{ label: "Calcule le coefficient multiplicateur.", pts: 1 }, { label: "De quel pourcentage a-t-il augmenté ?", pts: 1 }, { label: "L'an prochain, il baisse du même pourcentage. Revient-il à " + Q(a, "CHF") + " ? Calcule.", pts: 2 }],
        sol: ul([M(N(b) + " : " + a + " = " + N(b / a)) + ".", M(N(r6((b / a - 1) * 100))) + " %.", "Non : " + M(N(b) + " \\cdot " + N(r6(2 - b / a)) + " = " + N(r6(b * (2 - b / a)))) + " CHF : la baisse porte sur un montant plus grand."]) }); },
    () => { const r = pk([3, 4, 5]), P0 = pk([200, 400, 500]);
      return X({ id: "pctvar", lv: 2, titre: "Retrouver le prix de départ",
        q: "Après une hausse de " + (r * 5) + " %, un vélo coûte " + Q(P0 * (1 + r * 5 / 100), "CHF") + ".",
        parts: [{ label: "Quel coefficient correspond à une hausse de " + r * 5 + " % ?", pts: 1 }, { label: "Calcule le prix avant la hausse.", pts: 2 }, { label: who() + " a calculé " + M(N(P0 * (1 + r * 5 / 100)) + " \\cdot " + N(1 - r * 5 / 100)) + ". Pourquoi est-ce faux ?", pts: 1 }],
        sol: ul([M(N(1 + r * 5 / 100)) + ".", M(N(P0 * (1 + r * 5 / 100)) + " : " + N(1 + r * 5 / 100) + " = " + P0) + " CHF.", "Le pourcentage portait sur le prix de départ : il faut diviser par le coefficient, pas enlever " + r * 5 + " % du nouveau prix."]) }); },
    () => { const t = pk([2, 3]), p = pk([4, 5, 10]);
      return X({ id: "pctvar", lv: 3, titre: "Hausses successives",
        q: "Une population augmente de " + p + " % par an pendant " + t + " ans. Elle compte " + Q(10000, "habitants") + " au départ.",
        parts: [{ label: "Quel est le coefficient multiplicateur sur " + t + " ans ?", pts: 2 }, { label: "Combien d'habitants y a-t-il à la fin (à l'unité) ?", pts: 1 }, { label: "Le pourcentage total d'augmentation vaut-il " + p * t + " % ? Explique.", pts: 1 }],
        sol: ul([M(N(1 + p / 100) + "^" + t + " = " + N(r6((1 + p / 100) ** t))) + ".", M(N(Math.round(10000 * (1 + p / 100) ** t))) + " habitants.", "Non : " + M(N(r6(((1 + p / 100) ** t - 1) * 100))) + " %, un peu plus, car chaque hausse porte sur une population déjà augmentée."]) }); },
  ];
  const RAISONV = [
    () => X({ id: "pctvar", lv: 1, titre: "Trouve l'erreur", q: who() + " dit : « une hausse de 50 % puis une baisse de 50 %, ça revient au prix de départ ».",
      parts: [{ label: "Teste avec un prix de 100 CHF.", pts: 1 }, { label: "Quel est le coefficient global ?", pts: 1 }],
      sol: ul(["100 → 150 → 75 CHF.", M("1{,}5 \\cdot 0{,}5 = 0{,}75") + " : baisse de 25 %."]) }),
    () => X({ id: "pctvar", lv: 2, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.",
      parts: [{ label: "« Baisser de 20 %, c'est multiplier par 0,8. »", pts: 1 }, { label: "« Augmenter de 100 %, c'est doubler. »", pts: 1 }],
      sol: ul(["<b>Vrai</b> : 1 − 0,2 = 0,8.", "<b>Vrai</b> : coefficient 2."]) }),
  ];

  RICH.pr10 = { ids: ["carres", "puiss", "rac"], label: "Puissances et racines (révision de 10e)", ex: EXC, raison: RAISONC, minutes: 45 };
  RICH.pct10 = { ids: ["pctvar"], label: "Pourcentages (révision de 10e)", ex: EXV, raison: RAISONV, minutes: 45 };
  RICH.ang11 = { ids: ["angles", "cercthales"], label: "Angles", ex: EXA, raison: RAISONA, minutes: 45 };
  RICH.thal11 = { ids: ["thales", "thalesrec"], label: "Théorème de Thalès", ex: EXT, raison: RAISONT, minutes: 45 };
  RICH.fct11 = { ids: ["repere", "tabval", "affine"], label: "Fonctions", ex: EXF, raison: RAISONF, minutes: 45, minA: 2 }; /* 25.11 : automatismes au niveau 2 (audit de niveau 11e) */
  RICH.simil11 = { ids: ["simil"], label: "Homothéties et similitudes", ex: EXS, raison: RAISONS, minutes: 45 };
  RICH.proba11 = { ids: ["denombr", "proba"], label: "Probabilités", ex: EXP, raison: RAISONP2, minutes: 45 };
})();

// ===================== Parcours EVACOM 11e (chantier L, 24.11) =====================
// Sujets blancs complets au format de l'EVACOM de 11e (épreuve cantonale de fin mai ; analyse et sources : tools/evacom.md).
// 95 min : partie 1 (50 min, sans calculatrice) puis partie 2 (45 min, calculatrice). 14 questions modelées sur les
// épreuves 2017, 2022, 2023 et le champ 2026-27 (proportionnalité, 2e degré, Thalès en plus) : formes écrites à neuf,
// valeurs et contextes tirés, jamais recopiés. Pas de barème (décision de l'enseignant) : on compte les questions.
// Chaque emplacement (SLOTS) a plusieurs formes ; un sujet évite les formes du sujet précédent.
// Une forme rend { id, also?, d, titre, q, parts: [énoncé de chaque sous-question], sol: [corrigé de chaque sous-question], fig? }.
// Ici dans le paquet 11 (riche_11c.js) : le parcours n'est proposé qu'aux élèves de 11e.
const EVACOM = (function () {
  const r6 = (v) => Math.round(v * 1e6) / 1e6;
  const N = (v) => { const s = r6(v) < 0 ? "-" : ""; let [i, f] = String(Math.abs(r6(v))).split("."); if (i.length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}"); return s + i + (f ? "{,}" + f : ""); };
  const A = (v, k) => N(+(+v).toFixed(k));
  const un = (s) => "\\ \\text{" + s.replace(/\^([23])/, "}^$1\\text{") + "}";
  const Q = (v, s) => M(N(v) + un(s).replace(/\\text\{\}$/, ""));
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const mix = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R.rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const who = () => pk(["Léa", "Noé", "Lina", "Sam", "Yanis", "Inès", "Maël", "Zoé"]);
  // Rationnels [n, d] irréductibles.
  const qr = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; return [n / g, d / g]; };
  const qa = (a, b) => qr(a[0] * b[1] + b[0] * a[1], a[1] * b[1]), qs = (a, b) => qa(a, [-b[0], b[1]]);
  const qm = (a, b) => qr(a[0] * b[0], a[1] * b[1]), qd = (a, b) => qr(a[0] * b[1], a[1] * b[0]);
  const qt = (a) => frac(a[0], a[1]);
  const qp = (a) => (a[0] < 0 ? "\\left(" + qt(a) + "\\right)" : qt(a));
  const rf = (neg) => { for (;;) { const d = pk([2, 3, 4, 5, 6, 8, 9, 10]), n = R.int(1, 2 * d - 1); if (gcd(n, d) === 1) return qr(neg && R.rand() < 0.4 ? -n : n, d); } };
  const nice = (x) => x[1] <= 24 && Math.abs(x[0]) <= 60 && !(x[1] === 1 && Math.abs(x[0]) <= 1);
  // Polynômes en x, coefficients croissants [a0, a1, a2…].
  const pm = (a, b) => { const r = Array(a.length + b.length - 1).fill(0); a.forEach((x, i) => b.forEach((y, j) => (r[i + j] += x * y))); return r; };
  const pa = (a, b, s = 1) => { const r = []; for (let i = 0; i < Math.max(a.length, b.length); i++) r.push((a[i] || 0) + s * (b[i] || 0)); return r; };
  const P = (a, v = "x") => poly(a.slice().reverse(), v);
  const L = (a, b, v = "x") => P([b, a], v); /* ax + b */
  const S = (vals) => "S = \\{" + vals.map((x) => (Array.isArray(x) ? qt(x) : N(x))).join(" ; ") + "\\}";
  const opts = (list) => "<div class=\"evc-opts\">" + list.map((o) => "<span class=\"evc-opt\">☐ " + o + "</span>").join("") + "</div>";
  const qcm = (good, bad) => { const all = [good].concat(bad.filter((b, i) => b !== good && bad.indexOf(b) === i)).slice(0, 4), r = mix(all); r.good = good; return r; };
  const sg = (n) => (n < 0 ? "- " + -n : "+ " + n);

  // ---------- Partie 1 · sans calculatrice ----------
  // 1. Fractions : trois calculs, fraction irréductible ou entier.
  const FR = {
    a: () => { const p1 = rf(), p2 = rf(true), p3 = rf(), pr = qm(p2, p3), r = qs(p1, pr); if (!nice(r) || pr[1] > 30 || p2[1] * p3[1] === pr[1]) return null;
      return { e: qt(p1) + " - " + qp(p2) + " \\cdot " + qt(p3), s: qt(p1) + " - " + qp(pr) + " = " + qt(r), w: "la multiplication d'abord" }; },
    b: () => { const p1 = rf(), p2 = rf(true), p3 = rf(), sm = qa(p1, p2), r = qd(sm, p3); if (!nice(r) || sm[0] === 0) return null;
      return { e: "\\left(" + qt(p1) + " + " + qp(p2) + "\\right) : " + qt(p3), s: qt(sm) + " \\cdot " + qt(qr(p3[1], p3[0])) + " = " + qt(r), w: "la parenthèse d'abord ; diviser, c'est multiplier par l'inverse" }; },
    c: () => { const k = R.int(2, 5), m = R.int(2, 3), r0 = R.int(2, 4), t = qr(m ** 3, r0 * r0), r = qs([k * k, 1], t); if (!nice(r)) return null;
      return { e: "(-" + k + ")^2 - " + m + "^3 \\cdot \\left(\\frac{1}{" + r0 + "}\\right)^2", s: k * k + " - " + m ** 3 + " \\cdot \\frac{1}{" + r0 * r0 + "} = " + k * k + " - " + qt(t) + " = " + qt(r), w: "les puissances d'abord ; " + M("(-" + k + ")^2 = " + k * k) };
    },
    d: () => { const a = R.int(2, 6), b = R.int(2, 4), c = R.int(2, 3), r = -a * a + a * a + b * c ** 3; return { e: "-" + a + "^2 + (-" + a + ")^2 - " + b + " \\cdot (-" + c + ")^3", s: "-" + a * a + " + " + a * a + " - " + b + " \\cdot (-" + c ** 3 + ") = " + r, w: M("-" + a + "^2 = -" + a * a) + " mais " + M("(-" + a + ")^2 = " + a * a) }; },
    e: () => { const p1 = rf(), p2 = rf(), p3 = rf(true), dv = qd(p1, [-p2[0], p2[1]]), r = qa(dv, p3); if (!nice(r)) return null;
      return { e: qt(p1) + " : \\left(-" + qt(p2) + "\\right) + " + qp(p3), s: qt(p1) + " \\cdot \\left(-" + qt(qr(p2[1], p2[0])) + "\\right) + " + qp(p3) + " = " + qt(dv) + " + " + qp(p3) + " = " + qt(r), w: "la division d'abord" }; },
    f: () => { const p1 = rf(), p2 = rf(), d0 = qs([1, 1], p1), sq = qm(d0, d0), r = qd(sq, p2); if (!nice(r) || d0[0] === 0) return null;
      return { e: "\\left(1 - " + qt(p1) + "\\right)^2 : " + qt(p2), s: qp(d0) + "^2 : " + qt(p2) + " = " + qt(sq) + " \\cdot " + qt(qr(p2[1], p2[0])) + " = " + qt(r), w: "la parenthèse, puis le carré" }; },
  };
  const make = (f) => { for (let t = 0; t < 300; t++) { const x = f(); if (x) return x; } return null; };
  const fracQ = (keys) => { const xs = keys.map((k) => make(FR[k])); return { id: "fracops", also: ["fracmul"], d: 2, titre: "Fractions",
    q: "Calcule et donne la réponse sous la forme d'une fraction irréductible ou d'un nombre entier.",
    parts: xs.map((x) => M(x.e)), sol: xs.map((x) => M(x.e + " = " + x.s) + " (" + x.w + ").") }; };

  // 2. Racines.
  const RB = [2, 3, 5, 6, 7, 10, 11];
  const racA = () => { const a = R.int(2, 7), b = pk(RB), c = R.int(2, 4), dd = pk([2, 3, 4, 5]), p = R.int(1, 4), q = R.int(2, 5), b2 = pk([2, 3, 5]);
    return { id: "racprop", also: ["rac"], d: 2, titre: "Racines",
      q: "Écris sous la forme " + M("a\\sqrt{b}") + " ou " + M("a\\sqrt[3]{b}") + ", avec " + M("a") + " le plus grand nombre entier possible.",
      parts: [M("\\sqrt{" + a * a * b + "}"), M("\\sqrt[3]{" + c ** 3 * dd + "}"), M("\\sqrt{" + p * p * b2 + "} + \\sqrt{" + q * q * b2 + "}")],
      sol: [M("\\sqrt{" + a * a * b + "} = \\sqrt{" + a * a + " \\cdot " + b + "} = " + a + "\\sqrt{" + b + "}"), M("\\sqrt[3]{" + c ** 3 * dd + "} = \\sqrt[3]{" + c ** 3 + " \\cdot " + dd + "} = " + c + "\\sqrt[3]{" + dd + "}"),
        M((p === 1 ? "" : p) + "\\sqrt{" + b2 + "} + " + q + "\\sqrt{" + b2 + "} = " + (p + q) + "\\sqrt{" + b2 + "}") + (p === 1 ? " (" + M("\\sqrt{" + b2 + "}") + " ne se simplifie pas)" : "") + "."] }; };
  const racB = () => { let n; do n = R.int(20, 150); while (Number.isInteger(Math.sqrt(n))); let m; do m = R.int(10, 200); while (Math.round(Math.cbrt(m)) ** 3 === m); const s = Math.floor(Math.sqrt(n)), c = Math.floor(Math.cbrt(m) + 1e-9);
    const u = pk([[2, 6], [3, 6], [2, 10], [3, 15], [6, 8], [2, 14], [5, 10]]), pr = u[0] * u[1]; let a = 1, b = pr; for (let k = Math.floor(Math.sqrt(pr)); k >= 2; k--) if (pr % (k * k) === 0) { a = k; b = pr / (k * k); break; }
    return { id: "rac", also: ["racprop"], d: 2, titre: "Racines",
      parts: ["Encadre " + M("\\sqrt{" + n + "}") + " entre deux nombres entiers consécutifs. Justifie.", "Encadre " + M("\\sqrt[3]{" + m + "}") + " entre deux nombres entiers consécutifs. Justifie.", "Calcule " + M("\\sqrt{" + u[0] + "} \\cdot \\sqrt{" + u[1] + "}") + " et écris le résultat sous la forme " + M("a\\sqrt{b}") + "."],
      q: "", sol: [M(s * s + " < " + n + " < " + (s + 1) ** 2) + ", donc " + M(s + " < \\sqrt{" + n + "} < " + (s + 1)) + ".", M(c ** 3 + " < " + m + " < " + (c + 1) ** 3) + ", donc " + M(c + " < \\sqrt[3]{" + m + "} < " + (c + 1)) + ".", M("\\sqrt{" + u[0] + " \\cdot " + u[1] + "} = \\sqrt{" + pr + "} = \\sqrt{" + a * a + " \\cdot " + b + "} = " + a + "\\sqrt{" + b + "}") + "."] }; };
  const racC = () => { for (let t = 0; t < 400; t++) {
      const k = R.int(2, 4), dv = k + R.int(1, 9) / 10, nS = R.int(k * k + 1, (k + 1) ** 2 - 1), nC = R.int(k ** 3 + 1, (k + 1) ** 3 - 1), qd0 = pk([3, 6, 7, 8, 9]), pn = R.int(k * qd0 + 1, (k + 1) * qd0 - 1);
      if (gcd(pn, qd0) !== 1) continue;
      const items = [{ t: N(dv), v: dv }, { t: "\\sqrt{" + nS + "}", v: Math.sqrt(nS), j: "s", n: nS }, { t: "\\frac{" + pn + "}{" + qd0 + "}", v: pn / qd0 }, { t: "\\sqrt[3]{" + nC + "}", v: Math.cbrt(nC), j: "c", n: nC }];
      const vs = items.map((x) => x.v).sort((a, b) => a - b); if (vs.some((v, i) => i && v - vs[i - 1] < 0.04)) continue;
      const just = (x) => { if (!x.j) return x.t === N(x.v) ? M(x.t) + " est déjà un nombre décimal" : M(x.t + " \\approx " + A(x.v, 2)); /* 24.11 : plus de « 2,4 ≈ 2,4 » */ const lo = Math.floor(x.v * 10) / 10, e = x.j === "s" ? 2 : 3;
        return M(N(lo) + "^" + e + " = " + N(r6(lo ** e)) + " < " + x.n + " < " + N(r6((lo + 0.1) ** e)) + " = " + N(r6(lo + 0.1)) + "^" + e) + " : " + M(x.t) + " est entre " + M(N(lo)) + " et " + M(N(r6(lo + 0.1)));
      };
      const ord = items.slice().sort((a, b) => a.v - b.v);
      return { id: "rac", also: ["racprop", "fracconv"], d: 3, titre: "Comparer des nombres",
        q: "Range ces nombres dans l'ordre croissant, sans calculatrice. Justifie.", parts: [M(mix(items).map((x) => x.t).join(" \\; ; \\; "))],
        sol: [items.map(just).join(" ; ") + ".<br>" + M(ord.map((x) => x.t).join(" < "))] }; } return null; };

  // 3. « Mets une croix devant la proposition correcte. »
  const QC = [
    () => { const v = pk(["x", "a", "y"]), k = R.int(2, 9); return { s: M("(" + v + " + " + k + ")^2") + " est égal à :", o: qcm(M(v + "^2 + " + 2 * k + v + " + " + k * k), [M(v + "^2 + " + k * k), M(v + "^2 + " + k + v + " + " + k * k), M("2" + v + " + " + 2 * k)]), w: "identité " + M("(a + b)^2 = a^2 + 2ab + b^2") }; },
    () => { const k = R.int(2, 9); return { s: M("(x - " + k + ")(x + " + k + ")") + " est égal à :", o: qcm(M("x^2 - " + k * k), [M("x^2 + " + k * k), M("x^2 - " + 2 * k + "x + " + k * k), M("x^2 - " + 2 * k + "x - " + k * k)]), w: "identité " + M("(a - b)(a + b) = a^2 - b^2") }; },
    () => { const a = R.int(1, 9), b = R.int(1, 9), n = R.int(3, 5), v = "0{,}" + "0".repeat(n - 1) + a + b; return { s: "La notation scientifique de " + M(v) + " est :", o: qcm(M(a + "{,}" + b + " \\cdot 10^{-" + n + "}"), [M(a + "{,}" + b + " \\cdot 10^{" + n + "}"), M(a + "{,}" + b + " \\cdot 10^{-" + (n + 1) + "}"), M(a + "" + b + " \\cdot 10^{-" + n + "}")]), w: "un seul chiffre non nul avant la virgule ; la virgule recule de " + n + " rangs" }; },
    () => { const F = { "d'un cône": "\\frac{\\pi r^2 h}{3}", "d'une boule": "\\frac{4}{3}\\pi r^3", "d'un cylindre": "\\pi r^2 h", "d'une pyramide": "\\frac{A_{\\text{base}} \\cdot h}{3}" }, k = pk(Object.keys(F)), W = ["\\pi r^2 h", "\\frac{\\pi r^2 h}{3}", "\\frac{4}{3}\\pi r^3", "2\\pi r h", "4\\pi r^2", "A_{\\text{base}} \\cdot h", "\\frac{A_{\\text{base}} \\cdot h}{3}"].filter((x) => x !== F[k]);
      const bad = k === "d'une pyramide" ? ["A_{\\text{base}} \\cdot h", "\\frac{\\pi r^2 h}{3}", "\\frac{A_{\\text{base}} \\cdot h}{2}"] : mix(W.filter((x) => !/A_/.test(x))).slice(0, 3);
      return { s: "Le volume " + k + " vaut :", o: qcm(M(F[k]), bad.map(M)), w: "formule à savoir (pas d'aide-mémoire)" }; },
    () => { const t = pk([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]]); return { s: M("\\sqrt{" + t[0] ** 2 + " + " + t[1] ** 2 + "}") + " est égal à :", o: qcm(M(t[2]), [M(t[0] + t[1]), M(t[2] * t[2]), M("\\sqrt{" + (t[0] + t[1]) + "}")]), w: M("\\sqrt{" + t[2] * t[2] + "} = " + t[2]) + " : on calcule d'abord sous la racine" }; },
    () => { const a = R.int(2, 5); let m, n; do { m = R.int(2, 5); n = R.int(2, 4); } while (m * n === m + n); return { s: M(a + "^" + m + " \\cdot " + a + "^" + n) + " est égal à :", o: qcm(M(a + "^{" + (m + n) + "}"), [M(a + "^{" + m * n + "}"), M(a * a + "^{" + (m + n) + "}"), M(a * a + "^{" + m * n + "}")]), w: "on additionne les exposants" }; },
    () => { const a = R.int(2, 4), n = R.int(2, 3), p = a ** n; return { s: M(a + "^{-" + n + "}") + " est égal à :", o: qcm(M("\\frac{1}{" + p + "}"), [M("-" + p), M("-\\frac{1}{" + p + "}"), M(p)]), w: M(a + "^{-" + n + "} = \\frac{1}{" + a + "^" + n + "}") }; },
    () => { let a, b, c, d; do { b = pk([3, 4, 5, 6]); d = pk([2, 3, 4, 5, 7]); a = R.int(1, b - 1); c = R.int(1, d - 1); } while (b === d || gcd(a, b) > 1 || gcd(c, d) > 1); const s = qa([a, b], [c, d]);
      return { s: M("\\frac{" + a + "}{" + b + "} + \\frac{" + c + "}{" + d + "}") + " est égal à :", o: qcm(M(qt(s)), [M("\\frac{" + (a + c) + "}{" + (b + d) + "}"), M(qt(qr(a * c, b * d))), M("\\frac{" + (a + c) + "}{" + b * d + "}")]), w: "même dénominateur avant d'additionner" }; },
  ];
  const qcmQ = (pool, titre, id, also) => { const L0 = mix(pool.map((f, i) => i)).slice(0, 4).map((i) => pool[i]()); return { id, also, d: 2, titre,
    q: "Pour chaque énoncé, mets une croix devant la proposition correcte.", parts: L0.map((x) => x.s + opts(x.o)), sol: L0.map((x) => "<b>" + x.o.good + "</b> (" + x.w + ").") }; };

  // 4. Développer et réduire.
  const DV = [
    () => { const a = R.int(2, 4), b = R.int(1, 7), c = R.int(2, 4), d = R.int(1, 6), t1 = pm([-b, a], [-b, a]), t2 = pm([0, c], [-d, 1]); return { e: "(" + L(a, -b) + ")^2 - " + c + "x(" + L(1, -d) + ")", t: [t1, t2], r: pa(t1, t2, -1) }; },
    () => { const a = R.int(1, 8), b = R.int(1, 8), c = R.int(2, 6), t1 = pm([a, 1], [-b, 1]), t2 = pm([-c, 1], [c, 1]); return { e: "(" + L(1, a) + ")(" + L(1, -b) + ") - (" + L(1, -c) + ")(" + L(1, c) + ")", t: [t1, t2], r: pa(t1, t2, -1) }; },
    () => { const a = R.int(2, 4), b = R.int(1, 5), c = R.int(1, 3), d = R.int(1, 6), e = R.int(1, 5), t1 = pm([b, a], [-d, c]), t2 = pm([-e, 1], [-e, 1]); return { e: "(" + L(a, b) + ")(" + L(c, -d) + ") - (" + L(1, -e) + ")^2", t: [t1, t2], r: pa(t1, t2, -1) }; },
    () => { const k = R.int(2, 3), a = R.int(1, 5), b = R.int(2, 7), t1b = pm(pm([k], [a, 1]), [a, 1]), t2 = pm([-b, 1], [b, 1]); return { e: k + "(" + L(1, a) + ")^2 - (" + L(1, -b) + ")(" + L(1, b) + ")", t: [t1b, t2], r: pa(t1b, t2, -1) }; },
  ];
  const devQ = () => { const ks = mix([0, 1, 2, 3]).slice(0, 2), xs = ks.map((k) => { for (;;) { const x = DV[k](); if (x.r.some((c, i) => i > 0 && c)) return x; } });
    return { id: "idrem", also: ["distrib", "reduire"], d: 2, titre: "Développer et réduire", q: "Développe et réduis.", parts: xs.map((x) => M(x.e)),
      sol: xs.map((x) => M(x.e + " = " + P(x.t[0]) + " - \\left(" + P(x.t[1]) + "\\right) = " + P(x.r)) + ".") }; };

  // 5. Factoriser au maximum.
  const FC = [
    () => { let a, b; do { a = R.int(1, 5); b = R.int(1, 7); } while (gcd(a, b) > 1 || a === b); const k = R.int(2, 6); return { e: P([0, -k * b, k * a]), f: k + "x(" + L(a, -b) + ")", w: "mise en évidence de " + M(k + "x") }; },
    () => { let a, b; do { a = R.int(1, 5); b = R.int(2, 9); } while (gcd(a, b) > 1); return { e: P([-b * b, 0, a * a]), f: "(" + L(a, -b) + ")(" + L(a, b) + ")", w: M("a^2 - b^2 = (a - b)(a + b)") }; },
    () => { let a, b; do { a = R.int(1, 4); b = R.int(1, 7); } while (gcd(a, b) > 1); const sg = R.sign(); return { e: P([b * b, 2 * a * b * sg, a * a]), f: "(" + L(a, sg * b) + ")^2", w: "carré parfait " + M("a^2 " + (sg > 0 ? "+" : "-") + " 2ab + b^2") }; },
    () => { let r1, r2; do { r1 = R.nz(-9, 9); r2 = R.nz(-9, 9); } while (r1 === r2 || r1 === -r2); return { e: P([r1 * r2, -(r1 + r2), 1]), f: "(" + L(1, -r1) + ")(" + L(1, -r2) + ")", w: "deux nombres de produit " + M(r1 * r2) + " et de somme " + M(-(r1 + r2)) }; },
    () => { const a = R.int(1, 6), b = R.int(1, 8), c = R.nz(1, 8); if (b - c === 0 || b - c === -a) return null; return { e: "(" + L(1, -a) + ")(" + L(1, b) + ") - " + c + "(" + L(1, -a) + ")", f: "(" + L(1, -a) + ")(" + L(1, b - c) + ")", w: "mise en évidence de " + M("(" + L(1, -a) + ")") }; },
    () => { const k = R.int(2, 5), m = R.int(2, 6); return { e: P([0, -k * m * m, 0, k]), f: k + "x(" + L(1, -m) + ")(" + L(1, m) + ")", w: "mise en évidence de " + M(k + "x") + ", puis " + M("a^2 - b^2") }; },
  ];
  const factQ = () => { const ks = mix([0, 1, 2, 3, 4, 5]).slice(0, 4); if (!ks.includes(1) && !ks.includes(2)) ks[0] = pk([1, 2]); const xs = ks.map((k) => make(FC[k]));
    return { id: "factor", also: ["idrem"], d: 2, titre: "Factoriser", q: "Factorise au maximum.", parts: xs.map((x) => M(x.e)), sol: xs.map((x) => M(x.e + " = " + x.f) + " (" + x.w + ").") }; };

  // 6. Équations sans calculatrice.
  const solQ = () => { const t = -R.int(1, 4), a = R.int(1, 3), b = R.int(-6, 6), c = R.int(-9, 9), d = R.nz(-5, 5), lhs = a * t * t + b * t + c, yes = R.rand() < 0.5, e = lhs - d * t + (yes ? 0 : R.nz(-3, 3)), rhs = d * t + e;
    const eq = P([c, b, a]) + " = " + P([e, d]);
    return { id: "eqverif", also: ["valnum", "eq1"], d: 2, titre: "Est-ce une solution ?", q: "Est-ce que " + M("(" + t + ")") + " est une solution de l'équation " + M(eq) + " ? Justifie (une réponse sans justification ne vaut rien).", parts: [],
      sol: ["Membre de gauche : " + M((a === 1 ? "" : a + " \\cdot ") + "(" + t + ")^2 " + (b ? (b < 0 ? "- " + -b : "+ " + b) + " \\cdot (" + t + ") " : "") + (c ? (c < 0 ? "- " + -c : "+ " + c) : "") + " = " + lhs) + " ; membre de droite : " + M(d + " \\cdot (" + t + ")" + (e ? (e < 0 ? " - " + -e : " + " + e) : "") + " = " + rhs) + ". " + (yes ? "<b>Oui</b>, les deux membres sont égaux : " + M(t) + " est solution." : "<b>Non</b> : " + M(lhs + " \\neq " + rhs) + ", " + M(t) + " n'est pas solution.")] }; };
  const eq2Q = () => { const k = R.nz(-9, 9), a = R.int(2, 7), b = R.int(1, 9), g = gcd(a, b), aa = a / g, bb = b / g, p = R.nz(-6, 6), c1 = R.int(2, 5); let c2; do c2 = R.nz(-7, 7); while (c2 === -p * c1);
    return { id: "eq2fact", also: ["eq2", "factor"], d: 2, titre: "Équations du 2e degré", q: "Résous par factorisation.", parts: [M(P([0, -k, 1]) + " = 0"), M(P([-bb * bb, 0, aa * aa]) + " = 0"), M("(" + L(1, -p) + ")(" + L(c1, c2) + ") = 0")],
      sol: [M("x(" + L(1, -k) + ") = 0") + " : " + M("x = 0") + " ou " + M("x = " + k) + " ; " + M(S([0, k].sort((u, v) => u - v))) + ".", M("(" + L(aa, -bb) + ")(" + L(aa, bb) + ") = 0") + " ; " + M(S([qr(-bb, aa), qr(bb, aa)])) + ".", "Un produit est nul si un facteur est nul : " + M("x = " + p) + " ou " + M(c1 + "x = " + -c2) + " ; " + M(S([[p, 1], qr(-c2, c1)].sort((u, v) => u[0] / u[1] - v[0] / v[1]))) + "."] }; };
  const showQ = () => { let p, q; do { p = R.nz(-6, 7); q = R.nz(-6, 7); } while (p === q || p + q === 0); const eq = P([p * q, -(p + q), 1]) + " = 0";
    const chk = (v) => M(par(v) + "^2 " + sg(-(p + q)) + " \\cdot " + par(v) + " " + sg(p * q) + " = " + v * v + " " + sg(-(p + q) * v) + " " + sg(p * q) + " = 0");
    return { id: "eq2", also: ["valnum"], d: 2, titre: "Vérifier des solutions", q: "Montre que " + M(p) + " et " + M(q) + " sont des solutions de l'équation " + M(eq) + ".", parts: [], sol: ["Pour " + M("x = " + p) + " : " + chk(p) + ". Pour " + M("x = " + q) + " : " + chk(q) + ". (Autre méthode : " + M(P([p * q, -(p + q), 1]) + " = (" + L(1, -p) + ")(" + L(1, -q) + ")") + ".)"] }; };
  const FOR = [["A = \\pi r^2", "r", "r = \\sqrt{\\frac{A}{\\pi}}"], ["P = 2(L + l)", "l", "l = \\frac{P}{2} - L"], ["d = v \\cdot t", "v", "v = \\frac{d}{t}"], ["V = \\frac{A_b \\cdot h}{3}", "h", "h = \\frac{3V}{A_b}"], ["\\rho = \\frac{m}{V}", "V", "V = \\frac{m}{\\rho}"], ["A = \\frac{b \\cdot h}{2}", "b", "b = \\frac{2A}{h}"], ["V = \\pi r^2 h", "h", "h = \\frac{V}{\\pi r^2}"], ["Q = \\frac{V}{t}", "t", "t = \\frac{V}{Q}"], ["c^2 = a^2 + b^2", "a", "a = \\sqrt{c^2 - b^2}"]];
  const formQ = () => { const L0 = mix(FOR).slice(0, 3); return { id: "formule", d: 2, titre: "Transformer une formule", q: "Isole la lettre demandée (toutes les grandeurs sont positives).", parts: L0.map((f) => M(f[1]) + " dans " + M(f[0])), sol: L0.map((f) => M(f[2]) + ".") }; };

  // 7. Espace et calcul littéral sans calculatrice.
  const SOL = [["Polyèdre à 5 faces : 3 rectangles et 2 triangles.", "prisme droit à base triangulaire"], ["Polyèdre à 6 faces rectangulaires.", "parallélépipède rectangle (pavé droit)"], ["Polyèdre à 6 faces : 1 pentagone et 5 triangles qui ont un sommet commun.", "pyramide à base pentagonale"], ["Polyèdre à 4 faces, toutes triangulaires.", "pyramide à base triangulaire (tétraèdre)"], ["Polyèdre à 8 faces : 2 hexagones et 6 rectangles.", "prisme droit à base hexagonale"], ["Développement : deux disques et un rectangle.", "cylindre"], ["Développement : un disque et un secteur de disque.", "cône"], ["Solide dont tous les points de la surface sont à la même distance du centre.", "sphère (boule)"], ["Polyèdre à 5 faces : 1 carré et 4 triangles isocèles identiques.", "pyramide à base carrée"], ["Polyèdre à 7 faces : 2 pentagones et 5 rectangles.", "prisme droit à base pentagonale"]];
  const solidQ = () => { const L0 = mix(SOL).slice(0, 4); return { id: "solides", d: 2, titre: "Nommer des solides", q: "Nomme le plus précisément possible chaque solide (pour un prisme ou une pyramide, précise la base).", parts: L0.map((x) => x[0]), sol: L0.map((x) => x[1] + ".") }; };
  const conePyrQ = () => { for (;;) { const r = pk([2, 3, 4, 5, 6]), h = R.int(2, 9), c = pk([2, 3, 4, 6]), V = r * r * h, H = (3 * V) / (c * c); if (!Number.isInteger(H) || H > 60 || c === r) continue;
      return { id: "volmanq", also: ["volcone"], d: 3, titre: "Même volume", q: "Un cône a un rayon de " + Q(r, "cm") + " et une hauteur de " + Q(h, "cm") + ". Une pyramide à base carrée de " + Q(c, "cm") + " de côté a le même volume. Calcule la hauteur de la pyramide. Utilise " + M("\\pi \\approx 3") + ".", parts: [],
        sol: ["Volume du cône : " + M("V = \\frac{\\pi r^2 h}{3} \\approx \\frac{3 \\cdot " + r * r + " \\cdot " + h + "}{3} = " + V) + " cm³. Pyramide : " + M("\\frac{" + c * c + " \\cdot H}{3} = " + V) + ", donc " + M("H = \\frac{3 \\cdot " + V + "}{" + c * c + "} = " + H) + " cm."] }; } };
  const aireLitQ = () => { const f = R.int(0, 2), a = R.int(2, 4), b = R.int(1, 6);
    if (f === 0) return { id: "litelab", also: ["reduire"], d: 2, titre: "Expression d'une aire", q: "Un rectangle a pour longueur " + M(L(a, b)) + " et pour largeur " + M("x") + " (en cm). On y découpe un carré de côté " + M("x") + ". Donne l'expression réduite de l'aire restante, en fonction de " + M("x") + ".", parts: [], sol: [M("x(" + L(a, b) + ") - x^2 = " + P([0, b, a]) + " - x^2 = " + P([0, b, a - 1])) + " (cm²)."] };
    if (f === 1) return { id: "litelab", also: ["idrem"], d: 2, titre: "Expression d'une aire", q: "Un carré a pour côté " + M(L(1, a)) + " (en m). On y découpe un rectangle de " + M("x") + " sur " + M(b) + ". Donne l'expression réduite de l'aire restante, en fonction de " + M("x") + ".", parts: [], sol: [M("(" + L(1, a) + ")^2 - " + b + "x = " + P([a * a, 2 * a, 1]) + " - " + b + "x = " + P([a * a, 2 * a - b, 1])) + " (m²)."] };
    return { id: "litelab", also: ["reduire"], d: 2, titre: "Expression d'un périmètre et d'une aire", q: "Un rectangle a pour longueur " + M(L(a, b)) + " et pour largeur " + M(L(1, -1)) + " (en cm, avec " + M("x > 1") + ").", parts: ["Donne l'expression réduite de son périmètre.", "Donne l'expression réduite de son aire."], sol: [M("2(" + L(a, b) + " + " + L(1, -1) + ") = 2(" + L(a + 1, b - 1) + ") = " + L(2 * (a + 1), 2 * (b - 1))) + " (cm).", M("(" + L(a, b) + ")(" + L(1, -1) + ") = " + P(pm([b, a], [-1, 1]))) + " (cm²)."] }; };
  const preuveQ = () => { const f = R.int(0, 2), k = R.int(2, 6);
    if (f === 0) return { id: "idrem", also: ["litelab"], d: 3, titre: "Prouver avec le calcul littéral", q: "Montre que, pour tout nombre entier " + M("n") + ", " + M("(n + " + k + ")^2 - (n - " + k + ")^2") + " est un multiple de " + M(4 * k) + ".", parts: [], sol: [M("n^2 + " + 2 * k + "n + " + k * k + " - (n^2 - " + 2 * k + "n + " + k * k + ") = " + 4 * k + "n") + " : c'est " + M(4 * k) + " fois un entier."] };
    if (f === 1) return { id: "litelab", also: ["reduire"], d: 3, titre: "Prouver avec le calcul littéral", q: "Montre que la somme de " + (k % 2 ? 3 : 5) + " nombres entiers consécutifs est toujours un multiple de " + (k % 2 ? 3 : 5) + ".", parts: [], sol: [k % 2 ? "Avec " + M("n") + ", " + M("n + 1") + ", " + M("n + 2") + " : " + M("n + (n + 1) + (n + 2) = 3n + 3 = 3(n + 1)") + ", un multiple de 3." : "Avec " + M("n") + " à " + M("n + 4") + " : " + M("5n + 10 = 5(n + 2)") + ", un multiple de 5."] };
    return { id: "idrem", also: ["litelab"], d: 3, titre: "Prouver avec le calcul littéral", q: "Montre que la différence des carrés de deux nombres entiers consécutifs est toujours un nombre impair.", parts: [], sol: [M("(n + 1)^2 - n^2 = n^2 + 2n + 1 - n^2 = 2n + 1") + " : un nombre pair plus 1, donc impair."] }; };

  // ---------- Partie 2 · calculatrice ----------
  const pythQcm = () => { const lt = mix(["R", "K", "E", "T", "M", "S", "U"]).slice(0, 3), [P1, Rr, P3] = lt, a = R.int(8, 30) / 10, b = R.int(15, 45) / 10, c2 = r6(a * a + b * b);
    return { id: "pyth", also: ["pythrec"], d: 2, titre: "Pythagore", q: "Pour chaque énoncé, mets une croix devant la proposition correcte.",
      parts: ["Dans un triangle rectangle, le carré de l'hypoténuse est égal :" + opts(mix(["au carré de la somme des deux autres côtés", "à la somme des carrés des deux autres côtés", "au produit des deux autres côtés", "à la somme des deux autres côtés"])),
        "Si le triangle " + M(P1 + Rr + P3) + " est rectangle en " + M(Rr) + ", alors :" + opts(mix([M(P1 + P3 + "^2 = " + P1 + Rr + "^2 + " + Rr + P3 + "^2"), M(P1 + Rr + "^2 = " + P1 + P3 + "^2 + " + Rr + P3 + "^2"), M(Rr + P3 + "^2 = " + P1 + P3 + "^2 + " + P1 + Rr + "^2"), M(P1 + P3 + "^2 = " + P1 + Rr + "^2 - " + Rr + P3 + "^2")])),
        "Dans le triangle " + M("XYZ") + ", " + M("XY = " + N(a)) + " m, " + M("YZ = " + N(b)) + " m et " + M("XZ = \\sqrt{" + N(c2) + "}") + " m. Alors :" + opts(mix(["les segments " + M("[XY]") + " et " + M("[YZ]") + " sont perpendiculaires", "les segments " + M("[XZ]") + " et " + M("[YZ]") + " sont perpendiculaires", "le triangle n'est pas rectangle", "le triangle est rectangle en " + M("Z")]))],
      sol: ["<b>À la somme des carrés des deux autres côtés.</b>", "<b>" + M(P1 + P3 + "^2 = " + P1 + Rr + "^2 + " + Rr + P3 + "^2") + "</b> : l'hypoténuse " + M("[" + P1 + P3 + "]") + " est en face de l'angle droit.", "<b>" + M("[XY]") + " et " + M("[YZ]") + " sont perpendiculaires</b> : " + M(N(a) + "^2 + " + N(b) + "^2 = " + N(c2) + " = XZ^2") + ", donc (réciproque de Pythagore) le triangle est rectangle en " + M("Y") + "."] }; };
  const TRI = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];
  const echelleQ = () => { const Lh = pk([4, 4.5, 5, 6, 7]), d = R.int(10, 18) / 10, h = Math.sqrt(Lh * Lh - d * d), right = R.rand() < 0.5, t = pk(TRI), m = pk([1, 2, 3]) / (t[2] > 20 ? 2 : 1), s = [t[0] * m, t[1] * m, right ? t[2] * m : t[2] * m + pk([-1, 1])];
    return { id: "pyth", also: ["pythrec"], d: 3, titre: "Échelle et triangle", q: "",
      parts: ["Une échelle de " + Q(Lh, "m") + " est appuyée contre un mur vertical ; son pied est à " + Q(d, "m") + " du mur. À quelle hauteur touche-t-elle le mur ? (au centimètre près)", "Un triangle a des côtés de " + M(N(s[0])) + " cm, " + M(N(s[1])) + " cm et " + M(N(s[2])) + " cm. Est-il rectangle ? Justifie."],
      sol: [M("h = \\sqrt{" + N(Lh) + "^2 - " + N(d) + "^2} = \\sqrt{" + N(r6(Lh * Lh - d * d)) + "} \\approx " + A(h, 2)) + " m.", M(N(s[0]) + "^2 + " + N(s[1]) + "^2 = " + N(r6(s[0] ** 2 + s[1] ** 2))) + " et " + M(N(s[2]) + "^2 = " + N(r6(s[2] ** 2))) + (right ? " : égalité, donc le triangle est rectangle (réciproque de Pythagore)." : " : pas d'égalité, donc le triangle n'est pas rectangle (contraposée de Pythagore).")] }; };
  const paveQ = () => { const a = R.int(30, 80), b = R.int(20, 50), c = R.int(20, 60), d1 = Math.sqrt(a * a + b * b), d2 = Math.sqrt(a * a + b * b + c * c), tige = Math.round(d2 + pk([-6, -4, 3, 5]));
    return { id: "pythfig", also: ["pyth"], d: 3, titre: "Pythagore dans l'espace", q: "Une boîte en forme de pavé droit mesure " + Q(a, "cm") + " sur " + Q(b, "cm") + " et " + Q(c, "cm") + " de haut.", fig: FIG.box(a + " cm", b + " cm", c + " cm"),
      parts: ["Calcule la longueur de la diagonale du fond (au millimètre près).", "Calcule la longueur de la diagonale de la boîte (au millimètre près). Garde la valeur exacte pour ce calcul.", "Peut-on y ranger une tige rigide de " + Q(tige, "cm") + " ? Justifie."],
      sol: [M("d = \\sqrt{" + a + "^2 + " + b + "^2} = \\sqrt{" + (a * a + b * b) + "} \\approx " + A(d1, 1)) + " cm.", M("D = \\sqrt{" + (a * a + b * b) + " + " + c + "^2} = \\sqrt{" + (a * a + b * b + c * c) + "} \\approx " + A(d2, 1)) + " cm (sans arrondir " + M("d") + " avant).", (tige <= d2 ? "Oui" : "Non") + " : la plus grande longueur possible est la diagonale, " + M(A(d2, 1)) + " cm, " + (tige <= d2 ? "plus" : "moins") + " que " + tige + " cm."] }; };
  const terrainQ = () => { const t = pk(TRI.slice(0, 4)), m = pk([5, 6, 8, 10, 12]) / (t[2] > 20 ? 2 : 1), a = t[0] * m, b = t[1] * m, c = t[2] * m, mes = R.rand() < 0.5 ? c : c + pk([-0.6, 0.4]), l = R.int(40, 90), w = R.int(20, 60), dg = Math.sqrt(l * l + w * w);
    return { id: "pythrec", also: ["pyth"], d: 3, titre: "Sur le terrain",
      q: "", parts: ["Un maçon vérifie le coin d'une dalle : il mesure " + Q(a, "m") + " sur un bord, " + Q(b, "m") + " sur l'autre, et " + Q(mes, "m") + " entre les deux marques. Le coin est-il droit ? Justifie.", "Un terrain rectangulaire mesure " + Q(l, "m") + " sur " + Q(w, "m") + ". Combien de mètres gagne-t-on en le traversant en diagonale plutôt qu'en longeant deux côtés ? (au décimètre)"],
      sol: [M(N(a) + "^2 + " + N(b) + "^2 = " + N(r6(a * a + b * b))) + " et " + M(N(mes) + "^2 = " + N(r6(mes * mes))) + (mes === c ? " : égalité, le coin est droit (réciproque de Pythagore)." : " : pas d'égalité, le coin n'est pas droit (contraposée)."), "Diagonale : " + M("\\sqrt{" + l + "^2 + " + w + "^2} = \\sqrt{" + (l * l + w * w) + "} \\approx " + A(dg, 1)) + " m ; gain : " + M(l + w + " - " + A(dg, 1) + " \\approx " + A(l + w - dg, 1)) + " m."] }; };

  // 9. Mise en équation.
  const PB = [
    () => { const d = R.int(2, 9), n1 = R.int(3, 5), n2 = n1 + R.int(1, 3); let p, r; for (;;) { p = R.int(d + 3, n2 * d + 25); r = n2 * (p - d) - n1 * p; if (r > 0 && r < p) break; } const nm = who(), obj = pk(["mangas", "bandes dessinées", "places de cinéma", "livres de poche"]);
      return { x: "le prix d'un des " + obj + " (en CHF)", t: nm + " veut acheter des " + obj + " qui ont tous le même prix. Avec son argent, " + nm + " peut en acheter exactement " + n1 + " et il lui reste " + r + " CHF. Si chacun coûtait " + d + " CHF de moins, il pourrait en acheter exactement " + n2 + ". Quel est le prix d'un des " + obj + " ?", eq: n1 + "x + " + r + " = " + n2 + "(x - " + d + ")", v: p }; },
    () => { const f = R.int(8, 14), dif = R.int(22, 32), k = pk([2, 3]); const yrs = (k * f - f - dif) / (1 - k); if (!Number.isInteger(yrs) || yrs <= 0 || yrs > 30) return null;
      return { x: "l'âge actuel de la fille (en années)", t: "Une mère a " + dif + " ans de plus que sa fille. Dans " + yrs + " ans, elle aura " + (k === 2 ? "le double" : "le triple") + " de l'âge de sa fille. Quel âge a la fille aujourd'hui ?", eq: "x + " + dif + " + " + yrs + " = " + k + "(x + " + yrs + ")", v: f }; },
    () => { const l = R.int(4, 15), k = R.int(2, 4), m = R.int(1, 5), Lg = k * l - m, Pr = 2 * (l + Lg); if (Lg <= l) return null;
      return { x: "la largeur du rectangle (en m)", t: "La longueur d'un rectangle mesure " + m + " m de moins que " + (k === 2 ? "le double" : k === 3 ? "le triple" : "le quadruple") + " de sa largeur. Son périmètre vaut " + Pr + " m. Quelles sont ses dimensions ?", eq: "2(x + " + k + "x - " + m + ") = " + Pr, v: l }; },
    () => { const n = R.int(12, 80), k = pk([3, 4, 5]), s = k * n + (k * (k - 1)) / 2;
      return { x: "le plus petit des " + k + " nombres", t: "La somme de " + k + " nombres entiers consécutifs vaut " + s + ". Quels sont ces nombres ?", eq: Array.from({ length: k }, (_, i) => (i ? "(x + " + i + ")" : "x")).join(" + ") + " = " + s, v: n }; },
  ];
  const poserQ = () => { const k = R.int(0, PB.length - 1), x = make(PB[k]); return { id: "probeq", d: 3, titre: "Mettre en équation", q: "Identifie l'inconnue, puis pose l'équation qui permet de résoudre le problème (<b>sans la résoudre</b>).<br>« " + x.t + " »", parts: ["L'inconnue " + M("x") + " représente :", "L'équation est :"], sol: [M("x") + " : " + x.x + ".", M(x.eq) + ". (Pour vérifier : la solution est " + M(x.v) + ".)"] }; };
  const billetsQ = () => { for (;;) { const N0 = pk([120, 150, 180, 200, 240, 300]), pa0 = pk([14, 15, 16, 18, 20]), pe = pa0 - pk([4, 5, 6, 8]), e = R.int(30, N0 - 30), T = pa0 * (N0 - e) + pe * e; if (e % 5) continue;
      return { id: "probeq", also: ["eq1"], d: 3, titre: "Mettre en équation et résoudre", q: "Un " + pk(["cinéma", "musée", "zoo", "théâtre"]) + " a vendu " + N0 + " billets : " + M(pa0) + " CHF pour un adulte, " + M(pe) + " CHF pour un enfant. La recette est de " + M(N(T)) + " CHF.", parts: ["Identifie l'inconnue et pose l'équation.", "Résous-la : combien d'enfants y avait-il ?"],
        sol: [M("e") + " = nombre d'enfants ; adultes : " + M(N0 + " - e") + " ; " + M(pa0 + "(" + N0 + " - e) + " + pe + "e = " + N(T)) + ".", M(N(pa0 * N0) + " - " + (pa0 - pe) + "e = " + N(T)) + ", " + M((pa0 - pe) + "e = " + N(pa0 * N0 - T)) + ", " + M("e = " + e) + " : " + e + " enfants (et " + (N0 - e) + " adultes)."] }; } };
  const deg2Q = () => { if (R.rand() < 0.6) { const w = R.int(3, 12), k = R.int(2, 7), Ar = w * (w + k);
      return { id: "probeq2", also: ["eq2fact"], d: 3, titre: "Problème du 2e degré", q: "Un jardin rectangulaire a une longueur de " + Q(k, "m") + " de plus que sa largeur et une aire de " + Q(Ar, "m^2") + ".", parts: ["Pose l'équation (inconnue : la largeur " + M("x") + ").", "Résous-la par factorisation et donne les dimensions du jardin."],
        sol: [M("x(x + " + k + ") = " + Ar) + ", soit " + M(P([-Ar, k, 1]) + " = 0") + ".", M("(" + L(1, w + k) + ")(" + L(1, -w) + ") = 0") + " : " + M("x = " + w) + " ou " + M("x = " + -(w + k)) + " (impossible, une longueur est positive). Le jardin mesure " + w + " m sur " + (w + k) + " m."] }; }
    const k = R.int(3, 12); return { id: "probeq2", also: ["eq2"], d: 3, titre: "Problème du 2e degré", q: "Le carré d'un nombre est égal à " + k + " fois ce nombre.", parts: ["Pose l'équation.", "Résous-la par factorisation : quels nombres conviennent ?"], sol: [M("x^2 = " + k + "x") + ", soit " + M("x^2 - " + k + "x = 0") + ".", M("x(x - " + k + ") = 0") + " : " + M(S([0, k])) + ". Les deux nombres conviennent (ne pas diviser par " + M("x") + " : on perdrait 0)."] }; };

  // 10. Résoudre une équation.
  const resQ = () => { for (;;) { const b = pk([2, 3, 4, 5, 6]), e = pk([2, 3, 4, 5, 6]), x0 = R.int(-5, 9), a = R.int(-6, 8), c = R.int(1, 4), d = R.int(-7, 7); if (b === e) continue;
      const f = qs(qr(x0 + a, b), qr(c * x0 - d, e)); if (f[1] !== 1) continue; const Lc = (b * e) / gcd(b, e), ca = Lc / b, ce = Lc / e; if (ca - ce * c === 0) continue;
      const k = R.int(2, 5), u = R.int(2, 5), v = R.int(1, 7), none = R.rand() < 0.5, w = none ? pk([-1, 1]) * R.int(1, 9) : -k * v; if (none && w === -k * v) continue;
      return { id: "eqfrac", also: ["eq1"], d: 3, titre: "Résoudre des équations", q: "Résous les équations suivantes.", parts: [M("\\frac{" + L(1, a) + "}{" + b + "} - \\frac{" + L(c, -d) + "}{" + e + "} = " + f[0]), M(k + "(" + L(u, -v) + ") = " + P([w, k * u]))],
        sol: [M("\\cdot " + Lc) + " : " + M(ca + "(" + L(1, a) + ") - " + ce + "(" + L(c, -d) + ") = " + Lc * f[0]) + ", " + M(P([ca * a + ce * d, ca - ce * c]) + " = " + Lc * f[0]) + ", " + M(S([x0])) + ".", M(P([-k * v, k * u]) + " = " + P([w, k * u]) + "\\ \\Rightarrow\\ " + -k * v + " = " + w) + (none ? " : égalité fausse, " + M("S = \\emptyset") + " (aucune solution)." : " : toujours vrai, tous les nombres sont solutions.")] }; } };
  const res2Q = () => { for (;;) { const a = pk([2, 3, 4]), c = pk([3, 5, 6]), e = pk([4, 6, 12]), b = R.int(1, 6), d = R.int(1, 8); if (a === c || c === e || a === e) continue;
      const Lc = [a, c, e].reduce((m, x) => (m * x) / gcd(m, x)), co = Lc / a + Lc / c - Lc / e, cst = (Lc / e) * d + (Lc / c) * b; if (!co) continue; const sol = qr(cst, co); if (sol[1] === 1 && Math.abs(sol[0]) < 2) continue;
      const p = R.int(2, 5), q = R.int(2, 4), r = R.int(1, 6), s = R.int(2, 4), t = R.int(1, 5), x1 = R.int(-4, 6); if (p * q - s === 0) continue; const u = p * q * x1 - p * r - s * x1 - s * t;
      return { id: "eqfrac", also: ["eq1"], d: 3, titre: "Résoudre des équations", q: "Résous les équations suivantes.", parts: [M("\\frac{x}{" + a + "} + \\frac{" + L(1, -b) + "}{" + c + "} = \\frac{" + L(1, d) + "}{" + e + "}"), M(p + "(" + L(q, -r) + ") - " + s + "(" + L(1, t) + ") = " + u)],
        sol: [M("\\cdot " + Lc) + " : " + M((Lc / a) + "x + " + Lc / c + "(" + L(1, -b) + ") = " + Lc / e + "(" + L(1, d) + ")") + ", " + M(co + "x = " + cst) + ", " + M(S([sol])) + ".", M(P([-p * r, p * q]) + " - " + (s === 1 ? "" : s) + "x - " + s * t + " = " + u) + ", " + M(P([-p * r - s * t, p * q - s]) + " = " + u) + ", " + M(S([x1])) + "."] }; } };

  // 11. Solides avec calculatrice.
  const bagueQ = () => { const D = pk([18, 20, 22]), dd = D - pk([2, 4]), h = pk([3, 4, 5]), pr = pk([0.5, 0.4, 0.8]), R1 = D / 2, R2 = dd / 2, Ab = 2 * Math.PI * (R1 * R1 - R2 * R2), Ae = 2 * Math.PI * R1 * h, Ai = 2 * Math.PI * R2 * h, At = Ab + Ae + Ai, cost = Math.ceil(At * pr);
    return { id: "airelat", also: ["volcomp"], d: 3, titre: "La bague", q: "Une bague est un cylindre creux : diamètre extérieur " + Q(D, "mm") + ", diamètre intérieur " + Q(dd, "mm") + ", hauteur " + Q(h, "mm") + ". On la recouvre d'or sur toutes ses faces ; recouvrir " + M("1" + un("mm^2")) + " coûte " + M(N(pr)) + " CHF.", parts: ["Fais un croquis et calcule l'aire totale à recouvrir (valeur exacte avec " + M("\\pi") + ", puis au centième).", "Combien coûte la dorure ? (au franc supérieur)"],
      sol: ["Deux couronnes : " + M("2\\pi(" + N(R1) + "^2 - " + N(R2) + "^2) = " + N(r6(2 * (R1 * R1 - R2 * R2))) + "\\pi") + " ; face extérieure : " + M("2\\pi \\cdot " + N(R1) + " \\cdot " + h + " = " + N(2 * R1 * h) + "\\pi") + " ; face intérieure : " + M("2\\pi \\cdot " + N(R2) + " \\cdot " + h + " = " + N(2 * R2 * h) + "\\pi") + ". Total : " + M(N(r6(At / Math.PI)) + "\\pi \\approx " + A(At, 2)) + " mm².", M(N(r6(At / Math.PI)) + "\\pi \\cdot " + N(pr) + " \\approx " + A(At * pr, 2)) + " : " + cost + " CHF (au franc supérieur ; calcul fait avec la valeur exacte)."] }; };
  const crayonQ = () => { const r = pk([0.35, 0.4, 0.45]), Lc = R.int(12, 17), hc = pk([1.5, 2, 2.5]), V = Math.PI * r * r * Lc + (Math.PI * r * r * hc) / 3;
    return { id: "volcomp", also: ["volcone", "vol"], d: 3, titre: "Le crayon", q: "Un crayon est formé d'un cylindre de rayon " + Q(r, "cm") + " et de longueur " + Q(Lc, "cm") + ", terminé par un cône de même rayon et de hauteur " + Q(hc, "cm") + ".", parts: ["Fais un croquis à main levée avec les mesures.", "Calcule le volume du crayon (au centième)."],
      sol: ["Un cylindre couché, prolongé par un cône (pointe), mesures reportées.", M("V = \\pi \\cdot " + N(r) + "^2 \\cdot " + Lc + " + \\frac{\\pi \\cdot " + N(r) + "^2 \\cdot " + N(hc) + "}{3} \\approx " + A(V, 2)) + " cm³ (calcul en une fois, sans arrondi intermédiaire)."] }; };
  const cornetQ = () => { const r = R.int(2, 4), h = R.int(8, 12), kc = (r * r * h) / 3, kb = (2 * r ** 3) / 3, k = kc + kb, Ad = 2 * r * r;
    return { id: "volcone", also: ["volcomp"], d: 3, titre: "Le cornet de glace", q: "Un cornet de glace est un cône de rayon " + Q(r, "cm") + " et de hauteur " + Q(h, "cm") + ", surmonté d'une demi-boule de glace de même rayon.", parts: ["Calcule le volume total : valeur exacte (avec " + M("\\pi") + "), puis au centième.", "Calcule l'aire de la surface de la demi-boule (sans le disque), au centième."],
      sol: ["Cône : " + M("\\frac{\\pi \\cdot " + r * r + " \\cdot " + h + "}{3} = " + qt(qr(3 * kc, 3)) + "\\pi") + " ; demi-boule : " + M("\\frac{1}{2} \\cdot \\frac{4}{3}\\pi \\cdot " + r ** 3 + " = " + qt(qr(3 * kb, 3)) + "\\pi") + ". Total : " + M(qt(qr(Math.round(3 * k), 3)) + "\\pi \\approx " + A(k * Math.PI, 2)) + " cm³.", M("\\frac{4\\pi r^2}{2} = 2\\pi \\cdot " + r * r + " = " + Ad + "\\pi \\approx " + A(Ad * Math.PI, 2)) + " cm²."] }; };
  const pyrQ = () => { const t = pk([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]]), m = pk([1, 2]), hb = t[0] * m, h = t[1] * m, ap = t[2] * m, c = 2 * hb;
    return { id: "airepyr", also: ["pythfig", "volcone"], d: 3, titre: "La pyramide", q: "Une pyramide régulière a une base carrée de " + Q(c, "m") + " de côté ; la hauteur de chaque face triangulaire (apothème) mesure " + Q(ap, "m") + ".", fig: FIG.pyramid(c + " m", "h = ?"), parts: ["Calcule la hauteur de la pyramide.", "Calcule son volume.", "Calcule l'aire latérale (les 4 faces triangulaires)."],
      sol: ["Triangle rectangle (hauteur, demi-côté, apothème) : " + M("h = \\sqrt{" + ap + "^2 - " + hb + "^2} = \\sqrt{" + h * h + "} = " + h) + " m.", M("V = \\frac{" + c + "^2 \\cdot " + h + "}{3} = " + N((c * c * h) / 3)) + " m³.", M("4 \\cdot \\frac{" + c + " \\cdot " + ap + "}{2} = " + String(2 * c * ap).replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}")) + " m²."] } /* 24.11 : séparateur des milliers */; };
  const manqQ = () => { if (R.rand() < 0.5) { const r = pk([3.5, 4, 4.5, 5, 6]), Vl = pk([0.33, 0.5, 0.75, 1, 1.5]), hh = (Vl * 1000) / (Math.PI * r * r);
      return { id: "volmanq", also: ["uvol", "vol"], d: 3, titre: "Grandeur manquante", q: "Une boîte cylindrique a un rayon intérieur de " + Q(r, "cm") + " et contient exactement " + Q(Vl, "L") + ".", fig: FIG.cylinder("r = " + N(r).replace("{,}", ",") + " cm", "h = ?"), parts: ["Convertis le volume en cm³.", "Calcule la hauteur de la boîte (au millimètre près)."],
        sol: [M(N(Vl) + un("L") + " = " + N(Vl) + un("dm^3") + " = " + N(Vl * 1000) + un("cm^3")) + ".", M("h = \\frac{V}{\\pi r^2} = \\frac{" + N(Vl * 1000) + "}{\\pi \\cdot " + N(r) + "^2} \\approx " + A(hh, 1)) + " cm."] }; }
    const V = pk([500, 1000, 2000, 4000, 5000]), rr = Math.cbrt((3 * V) / (4 * Math.PI));
    return { id: "volmanq", also: ["volcone"], d: 3, titre: "Grandeur manquante", q: "Une boule a un volume de " + Q(V, "cm^3") + ".", parts: ["Calcule son rayon (au millimètre près).", "Calcule l'aire de sa sphère (au cm² près), avec la valeur non arrondie du rayon."],
      sol: [M("\\frac{4}{3}\\pi r^3 = " + N(V)) + " donne " + M("r = \\sqrt[3]{\\frac{3 \\cdot " + N(V) + "}{4\\pi}} \\approx " + A(rr, 1)) + " cm.", M("4\\pi r^2 \\approx " + A(4 * Math.PI * rr * rr, 0)) + " cm² (avec r en mémoire ; avec " + M(A(rr, 1)) + " on trouverait " + A(4 * Math.PI * (+rr.toFixed(1)) ** 2, 0) + " : arrondi intermédiaire sanctionné)."] }; };

  // 12. Grandeurs quotients.
  const citerneQ = () => { let V, q; do { V = pk([4000, 5000, 6000, 7500, 9000]); q = pk([20, 25, 30, 40, 50]); } while (V % q); const rho = pk([0.84, 0.85, 0.86]), d = R.int(90, 180), tm = pk([75, 90, 105, 120]), t = V / q;
    return { id: "gquot", also: ["vitesse", "utemps"], d: 3, titre: "La livraison de mazout", q: "", parts: ["Une citerne de " + Q(V, "L") + " se remplit avec un débit de " + Q(q, "L/min") + ". Combien de temps faut-il ? (en h et min)", "Le mazout a une masse volumique de " + Q(rho, "kg/L") + ". Quelle est la masse du mazout dans la citerne pleine ?", "Le camion a parcouru " + Q(d, "km") + " en " + Math.floor(tm / 60) + " h " + String(tm % 60).padStart(2, "0") + " min. Quelle est sa vitesse moyenne ? (au dixième)"],
      sol: [M(N(V) + " : " + q + " = " + N(t)) + " min = " + Math.floor(t / 60) + " h " + Math.round(t % 60) + " min.", M(N(V) + " \\cdot " + N(rho) + " = " + N(r6(V * rho))) + " kg.", M(Math.floor(tm / 60) + "\\text{ h }" + (tm % 60) + "\\text{ min} = " + N(tm / 60) + "\\text{ h}") + " ; " + M("v = " + d + " : " + N(tm / 60) + " \\approx " + A(d / (tm / 60), 1)) + " km/h."] }; };
  const tgvQ = () => { let v, d; do { v = pk([240, 280, 300, 320]); d = pk([420, 450, 560, 600, 640, 700, 800]); } while ((d * 60) % v); const g = pk([2, 3, 4]), t = d / v;
    return { id: "vitesse", also: ["ucomp", "gquot"], d: 3, titre: "Vitesses et débits", q: "", parts: ["Un TGV roule à " + Q(v, "km/h") + " de moyenne. Combien de temps lui faut-il pour " + Q(d, "km") + " ? (en h et min)", "Exprime sa vitesse en m/s (au centième).", "Un robinet qui fuit perd " + g + " gouttes par seconde ; 20 gouttes font " + M("1" + un("mL")) + ". Combien de litres perd-il en un jour ? (au centième)"],
      sol: [M("t = " + d + " : " + v + " = " + N(r6(t))) + " h = " + Math.floor(t) + " h " + Math.round((t - Math.floor(t)) * 60) + " min.", M(v + " : 3{,}6 \\approx " + A(v / 3.6, 2)) + " m/s.", "En un jour : " + M(g + " \\cdot 86\\text{'}400 = " + N(g * 86400)) + " gouttes ; " + M(N(g * 86400) + " : 20 = " + N(g * 4320)) + " mL " + M("\\approx " + A(g * 4.32, 2)) + " L."] }; };
  const MET = [["aluminium", 2.7], ["fer", 7.9], ["cuivre", 8.9], ["argent", 10.5], ["plomb", 11.3], ["or", 19.3]];
  const lingotQ = () => { const mt = pk(MET), a = R.int(4, 10), b = R.int(2, 5), c = R.int(1, 3), V = a * b * c, m = r6(+(mt[1] * V).toFixed(1)), Vq = pk([60, 80, 120, 150]), q = pk([4, 5, 6, 8]);
    return { id: "gquot", also: ["vol", "ucomp"], d: 3, titre: "Masse volumique et débit", q: "", parts: ["Un lingot en forme de pavé mesure " + Q(a, "cm") + " sur " + Q(b, "cm") + " sur " + Q(c, "cm") + " et pèse " + Q(m, "g") + ". Calcule sa masse volumique et trouve le métal (" + MET.map((x) => x[0] + " " + String(x[1]).replace(".", ",")).join(", ") + " g/cm³).", "Exprime cette masse volumique en kg/m³.", "Un aquarium de " + Q(Vq, "L") + " est rempli par un tuyau de débit " + Q(q, "L/min") + ". Combien de temps faut-il ? (en min et s)"],
      sol: [M("V = " + a + " \\cdot " + b + " \\cdot " + c + " = " + V) + " cm³ ; " + M("\\rho = " + N(m) + " : " + V + " = " + N(r6(m / V))) + " g/cm³ : " + mt[0] + ".", M("1" + un("g/cm^3") + " = 1000" + un("kg/m^3")) + " : " + M(N(r6(m / V * 1000))) + " kg/m³.", M(Vq + " : " + q + " = " + N(r6(Vq / q))) + " min = " + Math.floor(Vq / q) + " min " + Math.round((Vq / q - Math.floor(Vq / q)) * 60) + " s."] }; };

  // 13. Thalès.
  const etangQ = () => { for (;;) { const ad = R.int(6, 15), db = R.int(10, 30), de = R.int(5, 14), ab = ad + db, bc = r6((de * ab) / ad), ac = R.int(20, 45), ae = r6((ac * ad) / ab); if (Math.abs(bc * 10 - Math.round(bc * 10)) > 1e-9 || Math.abs(ae * 100 - Math.round(ae * 100)) > 1e-9) continue;
      return { id: "thales", d: 3, titre: "La largeur de l'étang", q: "Pour mesurer la largeur " + M("BC") + " d'un étang, on plante des piquets : " + M("D \\in [AB]") + ", " + M("E \\in [AC]") + " et " + M("(DE) \\parallel (BC)") + ". On mesure " + M("AD = " + ad) + " m, " + M("DB = " + db) + " m, " + M("DE = " + N(de)) + " m et " + M("AC = " + ac) + " m.", fig: FIG.thales([[110, 52, ad + " m"], [80, 124, db + " m"], [150, 70, de + " m"]]), parts: ["Calcule " + M("BC") + ".", "Calcule " + M("AE") + "."],
        sol: [M("AB = " + ad + " + " + db + " = " + ab) + " ; Thalès : " + M("\\frac{BC}{DE} = \\frac{AB}{AD}") + ", donc " + M("BC = " + de + " \\cdot \\frac{" + ab + "}{" + ad + "} = " + N(bc)) + " m.", M("\\frac{AE}{AC} = \\frac{AD}{AB}") + ", donc " + M("AE = " + ac + " \\cdot \\frac{" + ad + "}{" + ab + "} = " + N(ae)) + " m."] }; } };
  const ombreQ = () => { const b = pk([1, 1.2, 1.5, 2]), s = R.int(8, 25) / 10, S0 = R.int(60, 200) / 10, H = (b * S0) / s, p = pk([1.6, 1.7, 1.8]), sp = (p * s) / b;
    return { id: "thales", d: 3, titre: "L'arbre et son ombre", q: "Au même moment (rayons du soleil parallèles), un bâton vertical de " + Q(b, "m") + " a une ombre de " + Q(s, "m") + ", et un arbre a une ombre de " + Q(S0, "m") + ".", parts: ["Fais un croquis (configuration de Thalès) et calcule la hauteur de l'arbre (au centimètre près).", "Quelle est, au même moment, la longueur de l'ombre d'une personne de " + Q(p, "m") + " ? (au centimètre)"],
      sol: [M("\\frac{H}{" + N(b) + "} = \\frac{" + N(S0) + "}{" + N(s) + "}") + ", donc " + M("H = " + N(b) + " \\cdot \\frac{" + N(S0) + "}{" + N(s) + "} \\approx " + A(H, 2)) + " m.", M(N(p) + " \\cdot \\frac{" + N(s) + "}{" + N(b) + "} \\approx " + A(sp, 2)) + " m."] }; };
  const papillonQ = () => { for (;;) { const ca = R.int(3, 9), k = pk([1.5, 2, 2.5, 3]), ce = r6(ca * k), ab = R.int(4, 12), de = r6(ab * k), cb = R.int(3, 10), cd = r6(cb * k); if (ce === ca) continue;
      return { id: "thales", d: 3, titre: "Configuration papillon", q: "Les droites " + M("(AE)") + " et " + M("(BD)") + " se coupent en " + M("C") + ", et " + M("(AB) \\parallel (DE)") + ". On sait que " + M("CA = " + ca) + " cm, " + M("CE = " + N(ce)) + " cm, " + M("AB = " + ab) + " cm et " + M("CB = " + cb) + " cm.", parts: ["Calcule " + M("DE") + ".", "Calcule " + M("CD") + "."],
        sol: [M("\\frac{DE}{AB} = \\frac{CE}{CA} = \\frac{" + N(ce) + "}{" + ca + "}") + ", donc " + M("DE = " + ab + " \\cdot \\frac{" + N(ce) + "}{" + ca + "} = " + N(de)) + " cm.", M("CD = " + cb + " \\cdot \\frac{" + N(ce) + "}{" + ca + "} = " + N(cd)) + " cm."] }; } };

  // 14. Proportionnalité.
  const maquetteQ = () => { const k = pk([20, 25, 40, 50]), H = R.int(3, 12), v = pk([0.8, 1.2, 1.5, 2.4]), Vr = r6((v * k ** 3) / 1000);
    return { id: "agrand", also: ["echelle"], d: 3, titre: "La maquette", q: "La maquette d'un monument est à l'échelle " + M("1\\,:\\," + k) + ".", parts: ["Le monument mesure " + Q(H, "m") + " de haut. Quelle est la hauteur de la maquette, en cm ?", "La maquette a un volume de " + Q(v, "dm^3") + ". Quel est le volume du monument, en m³ ?"],
      sol: [M(H + un("m") + " = " + H * 100 + un("cm")) + " ; " + M(H * 100 + " : " + k + " = " + N(r6((H * 100) / k))) + " cm.", "Les volumes sont multipliés par " + M(k + "^3 = " + N(k ** 3)) + " : " + M(N(v) + " \\cdot " + N(k ** 3) + " = " + N(r6(v * k ** 3))) + " dm³ " + M("= " + N(Vr)) + " m³."] }; };
  const agrandQ = () => { const c = R.int(2, 6), k = pk([1.5, 2.5, 3, 0.5]), V = pk([240, 360, 480]), kr = pk([0.5, 2, 3]);
    return { id: "agrand", d: 3, titre: "Agrandir, réduire", q: "", parts: ["Un carré de " + Q(c * c, "cm^2") + " est " + (k < 1 ? "réduit" : "agrandi") + " avec le rapport " + M(N(k)) + ". Calcule le côté et l'aire du nouveau carré.", "Une boîte de " + Q(V, "cm^3") + " est " + (kr < 1 ? "réduite" : "agrandie") + " avec le rapport " + M(N(kr)) + ". Calcule le volume de la nouvelle boîte."],
      sol: ["Côté : " + M(c + " \\cdot " + N(k) + " = " + N(c * k)) + " cm ; aire : " + M(c * c + " \\cdot " + N(k) + "^2 = " + N(r6(c * c * k * k))) + " cm² (les aires sont multipliées par " + M("k^2") + ").", M(V + " \\cdot " + N(kr) + "^3 = " + N(r6(V * kr ** 3))) + " cm³ (les volumes sont multipliés par " + M("k^3") + ")."] }; };
  const deviseQ = () => { const t = pk([0.93, 0.94, 0.96, 0.97]), e = R.int(40, 250), m1 = pk([2.5, 3, 3.5]), p1 = r6(+(m1 * pk([4.2, 5.6, 6.8])).toFixed(2)), m2 = pk([1.2, 4.5, 5.2, 7]);
    return { id: "prop", also: ["change"], d: 3, titre: "Proportionnalité", q: "", parts: ["Le jour du départ, " + M("1" + un("EUR") + " = " + N(t) + un("CHF")) + ". Combien coûte en CHF un article à " + Q(e, "EUR") + " ? (au centime)", "Avec " + Q(100, "CHF") + ", combien d'euros obtient-on ? (au centime)", Q(m1, "kg") + " de cerises coûtent " + Q(p1, "CHF") + ". Combien coûtent " + Q(m2, "kg") + " ? (au centime)"],
      sol: [M(e + " \\cdot " + N(t) + " = " + N(r6(e * t))) + " CHF.", M("100 : " + N(t) + " \\approx " + A(100 / t, 2)) + " EUR.", "Prix au kilo : " + M(N(p1) + " : " + N(m1) + " = " + N(r6(p1 / m1))) + " CHF ; " + M(N(r6(p1 / m1)) + " \\cdot " + N(m2) + " \\approx " + A((p1 / m1) * m2, 2)) + " CHF."] }; };
  const calcQ = () => { const a = R.int(21, 59) / 10, b = R.int(11, 29), c = R.int(11, 19) / 10, d = R.int(1, 5), v = (a * a - Math.sqrt(b)) / (c ** 3 + d), x = R.int(11, 95) / 10, m = R.int(3, 8), y = R.int(11, 95) / 10, n = R.int(2, 6), z = R.int(2, 9), w = (x * 10 ** m * y * 10 ** -n) / z, ex0 = Math.floor(Math.log10(w)), m0 = +(w / 10 ** ex0).toFixed(2), ex = m0 >= 10 ? ex0 + 1 : ex0, mt = m0 >= 10 ? +(m0 / 10).toFixed(2) : m0;
    return { id: "scicalc", also: ["prio"], d: 3, titre: "À la calculatrice", q: "", parts: ["Calcule et arrondis au centième : " + M("\\frac{" + N(a) + "^2 - \\sqrt{" + b + "}}{" + N(c) + "^3 + " + d + "}"), "Calcule et donne le résultat en notation scientifique (mantisse au centième) : " + M("\\frac{" + N(x) + " \\cdot 10^{" + m + "} \\cdot " + N(y) + " \\cdot 10^{-" + n + "}}{" + z + "}")],
      sol: ["Parenthèses autour du numérateur et du dénominateur : " + M("(" + N(a) + "^2 - \\sqrt{" + b + "}) : (" + N(c) + "^3 + " + d + ") \\approx " + A(v, 2)) + ".", M("\\approx " + N(mt) + " \\cdot 10^{" + ex + "}") + "."] }; };

  // Emplacements du sujet : 7 en partie 1 (sans calculatrice), 7 en partie 2.
  const SLOTS = [
    { p: 1, forms: [() => fracQ(["a", "b", "c"]), () => fracQ(["e", "f", "d"]), () => fracQ(["b", "e", "c"]), () => fracQ(["a", "f", "d"])] },
    { p: 1, forms: [racA, racB, racC] },
    { p: 1, forms: [() => qcmQ(QC, "Mets une croix", "puiss", ["sci", "idrem", "volcone"])] },
    { p: 1, forms: [devQ] },
    { p: 1, forms: [factQ] },
    { p: 1, forms: [solQ, eq2Q, showQ, formQ] },
    { p: 1, forms: [solidQ, conePyrQ, aireLitQ, preuveQ] },
    { p: 2, forms: [pythQcm, echelleQ, paveQ, terrainQ] },
    { p: 2, forms: [poserQ, billetsQ, deg2Q] },
    { p: 2, forms: [resQ, res2Q] },
    { p: 2, forms: [bagueQ, crayonQ, cornetQ, pyrQ, manqQ] },
    { p: 2, forms: [citerneQ, tgvQ, lingotQ] },
    { p: 2, forms: [etangQ, ombreQ, papillonQ] },
    { p: 2, forms: [maquetteQ, agrandQ, deviseQ, calcQ] },
  ];
  const seed = () => Math.floor(Math.random() * 46655) + 1;
  // Nouveau sujet : une forme par emplacement, différente de celle du sujet précédent quand c'est possible.
  function plan(prev) {
    return SLOTS.map((s, i) => { let f = Math.floor(Math.random() * s.forms.length); if (prev && s.forms.length > 1 && prev[i] && prev[i].f === f) f = (f + 1 + Math.floor(Math.random() * (s.forms.length - 1))) % s.forms.length; return { s: i, f, seed: seed() }; });
  }
  function build(it) { R.seed(it.seed); const q = SLOTS[it.s].forms[it.f](); return Object.assign({ p: SLOTS[it.s].p, slot: it.s }, q); }
  return { SLOTS, plan, build, QC };
})();
// Écrans du parcours EVACOM. Entrée : case « Évaluation » (22.11 ; plus dans Progrès depuis le 25.11) (pas de case sur l'accueil : règle des 6 cases).
// state.evacom = { items: [{ s, f, seed }], date, done: { date, marks, n, juste, partie, faux } | null, runs: [{ date, n, juste, partie, faux }] }.
let evcBack = "test";
function evacomOk() { return !!(typeof state !== "undefined" && state && state.profile && state.profile.system === "CH" && +state.profile.grade === 11); }
function evacomNew() {
  const E = state.evacom || {};
  state.evacom = { items: EVACOM.plan(E.items), date: day(), done: null, runs: (E.runs || []).slice(-20) };
  save();
}
function evacomQs() { return state.evacom.items.map((it) => EVACOM.build(it)); }
// 24.11 : en attente de relecture par l'enseignant (corrigés d'un contenu d'examen) : visible sur le site publié seulement
// en mode auteur (…/#auteur) ; partout ailleurs (pages de test, copie locale) comme prévu. Passer à true après relecture.
const EVACOM_OUVERT = false;
function evacomCard() {
  if (!evacomOk()) return "";
  if (!EVACOM_OUVERT && location.protocol === "https:" && !(typeof isAuthor === "function" && isAuthor())) return "";
  const E = state.evacom, last = E && E.runs && E.runs.length ? E.runs[E.runs.length - 1] : null, open = E && E.items && !E.done;
  return `<div class="card flat stack evc-card"><div class="eyebrow">🎓 Évaluation bilan de 11e · fin d'année</div><h3>Sujet blanc d'évaluation bilan</h3>
    <p class="small muted">95 minutes au format de l'épreuve cantonale : partie 1 sans calculatrice, partie 2 avec. Un nouveau sujet à chaque fois, un corrigé détaillé, puis ce qu'il te reste à retravailler.</p>
    <button class="btn-sec" id="evacom">📝 ${open ? "Reprendre mon sujet blanc" : "Faire un sujet blanc"}</button>
    ${last ? `<p class="small muted">Dernier sujet blanc : ${last.juste} question${last.juste > 1 ? "s" : ""} juste${last.juste > 1 ? "s" : ""} sur ${last.n}${E.done ? ` · <button type="button" class="btn-ghost small" id="evcbilan">voir le bilan</button>` : ""}</p>` : ""}</div>`;
}
function screenEvacom(fresh) {
  if (!evacomOk()) return screenHome();
  if (typeof homeTab !== "undefined" && (homeTab === "test" || homeTab === "prog")) evcBack = homeTab;
  if (fresh || !state.evacom || !state.evacom.items || state.evacom.done) evacomNew();
  const qs = evacomQs();
  const qHtml = (x, k) => `<div class="mock-q"><b>Question ${k + 1} · ${x.titre}</b>${x.q ? `<div>${x.q}</div>` : ""}${x.fig ? `<div class="figwrap">${x.fig}</div>` : ""}
    ${x.parts && x.parts.length ? `<ol type="a" class="mock-parts">${x.parts.map((p) => `<li>${p}<div class="mock-space"></div></li>`).join("")}</ol>` : '<div class="mock-space"></div>'}</div>`;
  const part = (p) => qs.map((x, k) => (x.p === p ? qHtml(x, k) : "")).join("");
  h(`<div class="mock-head">${brand}<div class="eyebrow">Sujet blanc · évaluation bilan de 11e · 95 minutes</div><h2>Évaluation bilan blanche</h2>
  <p class="small muted">Partie 1 : 50 min, sans calculatrice · Partie 2 : 45 min, calculatrice autorisée</p></div>
  <div class="card flat"><ul class="small evc-rules"><li>Fais-le sur une feuille, en temps réel, sans regarder tes cours : à l'épreuve, <b>pas d'aide-mémoire</b>, les formules doivent être sues. Matériel : une règle graduée.</li>
    <li>Les raisonnements et les calculs doivent figurer sur la feuille ; les fausses égalités et les erreurs d'écriture sont sanctionnées.</li>
    <li>Partie 2 : utilise la touche π de ta calculatrice et garde les valeurs exactes jusqu'au bout (pas d'arrondi intermédiaire).</li>
    <li><b>Ce n'est pas une évaluation</b> : pas de note, personne d'autre que toi ne voit le résultat. Sujet préparé pour la section LS.</li></ul></div>
  <section class="mock-part"><h3>Partie 1 · 50 minutes · sans calculatrice</h3>${part(1)}<p class="small muted evc-end">Fin de la partie 1 : range ta feuille, prends ta calculatrice.</p></section>
  <section class="mock-part"><h3>Partie 2 · 45 minutes · calculatrice autorisée</h3>${part(2)}<p class="small muted evc-end">Fin de l'épreuve.</p></section>
  <div class="stack no-print">
    <button class="btn-primary btn-big" id="corr">J'ai fini : voir le corrigé</button>
    <div class="row"><button class="btn-primary" id="print">🖨 Imprimer / PDF</button><button class="btn-ghost" id="again">Un autre sujet</button><button class="btn-ghost" id="back">Retour</button></div>
  </div>`);
  document.getElementById("corr").onclick = screenEvacomCorr;
  document.getElementById("print").onclick = () => window.print();
  document.getElementById("again").onclick = () => screenEvacom(true);
  document.getElementById("back").onclick = () => { homeTab = evcBack; screenHome(); };
}
function screenEvacomCorr() {
  const qs = evacomQs(), marks = qs.map(() => null);
  h(`${brand}<div class="eyebrow">Évaluation bilan blanche · corrigé</div><h2>Corrige-toi</h2>
  <p class="small muted">Compare avec ta feuille, question par question. <b>À moitié</b> : la démarche est juste mais il y a une erreur de calcul, ou il manque une justification, une unité, l'arrondi demandé.</p>
  <div class="mock-list">${qs.map((x, i) => `${i === 0 || qs[i - 1].p !== x.p ? `<h3>${x.p === 1 ? "Partie 1 · sans calculatrice" : "Partie 2 · calculatrice"}</h3>` : ""}<div class="mock-q card flat"><b>Question ${i + 1} · ${x.titre}</b>
    ${x.q ? `<div class="small">${x.q}</div>` : ""}
    <div class="rule"><b>Corrigé</b>${x.parts && x.parts.length ? `<ol type="a" class="mock-parts">${x.sol.map((s) => `<li>${s}</li>`).join("")}</ol>` : " · " + x.sol.join(" ")}</div>
    <div class="seg mock-mark" data-i="${i}"><button type="button" data-v="1">✓ Juste</button><button type="button" data-v="0.5">½ À moitié</button><button type="button" data-v="0">✗ Faux</button></div></div>`).join("")}</div>
  <p class="small muted" id="merr"></p>
  <button class="btn-primary btn-big" id="valid">Valider ma correction</button>
  <button class="btn-ghost" id="back">Revenir au sujet</button>`);
  app.querySelectorAll(".mock-mark").forEach((g) => g.querySelectorAll("button").forEach((b) => (b.onclick = () => {
    marks[+g.dataset.i] = +b.dataset.v; g.querySelectorAll("button").forEach((y) => y.setAttribute("aria-pressed", y === b));
  })));
  document.getElementById("back").onclick = () => screenEvacom();
  document.getElementById("valid").onclick = () => {
    const miss = marks.findIndex((m) => m === null);
    if (miss >= 0) { document.getElementById("merr").textContent = "Il te reste " + marks.filter((m) => m === null).length + " question(s) à cocher."; app.querySelectorAll(".mock-mark")[miss].scrollIntoView({ behavior: "smooth", block: "center" }); return; }
    qs.forEach((x, i) => { Engine.recordComp(state, x.id, x.d || 2, marks[i]); (x.also || []).forEach((a) => Engine.recordComp(state, a, Math.min(x.d || 2, 2), marks[i])); });
    const cnt = { juste: marks.filter((m) => m === 1).length, partie: marks.filter((m) => m === 0.5).length, faux: marks.filter((m) => m === 0).length };
    state.evacom.done = Object.assign({ date: day(), marks, n: marks.length }, cnt);
    state.evacom.runs = (state.evacom.runs || []).concat([Object.assign({ date: day(), n: marks.length }, cnt)]).slice(-20);
    Badges.check(state); save();
    screenEvacomResult();
  };
}
// Bilan : questions justes par partie, notions acquises, notions à retravailler (rappel de cours, révision ciblée).
function screenEvacomResult() {
  const E = state.evacom; if (!E || !E.done) return screenEvacom();
  const qs = evacomQs(), mk = E.done.marks, n = mk.length, by = {};
  qs.forEach((x, i) => { (by[x.id] = by[x.id] || []).push(mk[i]); });
  const ids = Object.keys(by).filter((id) => NOTIONS.find((m) => m.id === id));
  const ok = ids.filter((id) => by[id].every((m) => m === 1)), weak = ids.filter((id) => by[id].some((m) => m < 1)).sort((a, b) => Math.min(...by[a]) - Math.min(...by[b]));
  const pp = (p) => { const L0 = qs.map((x, i) => (x.p === p ? mk[i] : null)).filter((m) => m !== null); return `<b>${L0.filter((m) => m === 1).length}</b> sur ${L0.length}`; };
  h(`${brand}<div class="eyebrow">Évaluation bilan blanche · résultats</div><h2>Où tu en es</h2>
  <div class="card stack"><p><b>${E.done.juste}</b> question${E.done.juste > 1 ? "s" : ""} juste${E.done.juste > 1 ? "s" : ""} sur ${n}${E.done.partie ? ` · <b>${E.done.partie}</b> à moitié` : ""}${E.done.faux ? ` · <b>${E.done.faux}</b> à revoir` : ""}</p>
    <p class="small">Partie 1 (sans calculatrice) : ${pp(1)} · Partie 2 (calculatrice) : ${pp(2)}</p>
    <p class="small muted">Ce n'est pas une note : c'est pour savoir quoi travailler d'ici l'évaluation bilan.</p></div>
  ${weak.length ? `<div class="card flat stack"><h3>À retravailler</h3><ul class="evc-weak">${weak.map((id) => `<li><span>${esc(nLabel(id))}</span>${typeof LESSONS !== "undefined" && LESSONS[id] ? `<button type="button" class="btn-ghost small evc-les" data-id="${id}">📖 Rappel</button>` : ""}</li>`).join("")}</ul>
    <button class="btn-primary" id="rev">Réviser ces notions maintenant</button></div>` : '<div class="card flat"><p>Tout est juste : bravo ! Refais un sujet blanc dans quelques jours pour le garder.</p></div>'}
  ${ok.length ? `<div class="card flat"><h3>✓ Acquis</h3><ul>${ok.map((id) => `<li>${esc(nLabel(id))}</li>`).join("")}</ul></div>` : ""}
  <div class="card flat"><p class="small muted">À l'épreuve, l'écriture mathématique (pas de fausse égalité) et l'absence d'arrondi intermédiaire comptent aussi : relis-toi avec ces deux points en tête.</p></div>
  <div class="row"><button class="btn-primary" id="again">Un autre sujet blanc</button><button class="btn-ghost" id="home">Retour</button></div>`);
  if (E.done.juste >= 0.8 * n && typeof burst === "function") burst();
  app.querySelectorAll(".evc-les").forEach((b) => (b.onclick = () => screenLesson(b.dataset.id, screenEvacomResult, true)));
  if (document.getElementById("rev")) document.getElementById("rev").onclick = () => {
    const plan = weak.filter((id) => typeof GEN === "undefined" || GEN[id]).slice(0, 6).flatMap((id) => [id + "|2", id + "|3"]);
    if (!plan.length) return;
    session = { plan, i: 0, score: 0, answered: 0, start: Date.now(), elo0: state.elo.r, ids: new Set(), prep: true };
    nextQuestion();
  };
  document.getElementById("again").onclick = () => screenEvacom(true);
  document.getElementById("home").onclick = () => { homeTab = evcBack; screenHome(); };
}

// Chantier 11e · 4. Proportionnalité (15.11) : leçons actives (devine / manipule / retiens) et rappels de cours
// réécrits pour utemps, ucomp, vitesse, gquot. Chargé après active.js et lessons2.js.
// Rappels : une idée par phrase, exemples rédigés comme de petits corrigés, le piège le plus fréquent.
(function () {
  const R2 = {
    utemps: ["Durées : on compte par 60", "Une heure n'a pas 100 minutes : le temps se compte par 60.",
      "\\(1\\ \\text{h} = 60\\ \\text{min}\\) et \\(1\\ \\text{min} = 60\\ \\text{s}\\), donc \\(1\\ \\text{h} = 3600\\ \\text{s}\\). Pour passer des minutes aux heures décimales, on divise par 60. Pour passer des heures décimales aux minutes, on multiplie la partie décimale par 60. Pour une durée entre deux horaires, on complète jusqu'à l'heure pleine, puis on ajoute.",
      ["\\(45\\ \\text{min} = \\frac{45}{60}\\ \\text{h} = 0{,}75\\ \\text{h}\\).", "\\(2{,}4\\ \\text{h} = 2\\ \\text{h} + 0{,}4 \\cdot 60\\ \\text{min} = 2\\ \\text{h}\\ 24\\ \\text{min}\\).", "\\(7\\text{'}274\\ \\text{s}\\) : 2 h (7'200 s), reste 74 s = 1 min 14 s. Donc 2 h 01 min 14 s."],
      "\\(1\\ \\text{h}\\ 30\\ \\text{min}\\) s'écrit \\(1{,}5\\ \\text{h}\\), pas \\(1{,}3\\ \\text{h}\\) ; et \\(1{,}5\\ \\text{h}\\) n'est pas 1 h 50 min."],
    ucomp: ["Unités composées", "Une vitesse en km/h dit combien de kilomètres on parcourt en une heure : on convertit chaque unité séparément.",
      "En une heure (3600 s), on parcourt 3600 fois la distance d'une seconde. Comme 1 km = 1000 m, \\(1\\ \\text{m/s} = 3{,}6\\ \\text{km/h}\\). Des m/s vers les km/h, on multiplie par 3,6. Des km/h vers les m/s, on divise par 3,6. Pour les masses volumiques : \\(1\\ \\text{g/cm}^3 = 1000\\ \\text{kg/m}^3\\), car un m³ contient un million de cm³.",
      ["\\(108\\ \\text{km/h}\\) : en 1 h, 108'000 m ; en 1 s, \\(108\\text{'}000 : 3600 = 30\\ \\text{m/s}\\).", "\\(12\\ \\text{m/s} = 12 \\cdot 3{,}6 = 43{,}2\\ \\text{km/h}\\).", "Débit \\(12\\ \\text{L/min}\\) : en une heure, \\(720\\ \\text{L} = 0{,}72\\ \\text{m}^3\\), donc \\(0{,}72\\ \\text{m}^3\\text{/h}\\)."],
      "Vérifie le sens : le même mouvement s'écrit avec un plus grand nombre en km/h qu'en m/s."],
    vitesse: ["Vitesse, distance, durée", "La vitesse moyenne, c'est la distance parcourue en une unité de temps.",
      "\\(v = \\frac{d}{t}\\), donc \\(d = v \\cdot t\\) et \\(t = \\frac{d}{v}\\). Les unités doivent aller ensemble : des km et des heures donnent des km/h. Une durée en heures et minutes s'écrit d'abord en heures décimales. Sur un trajet en plusieurs parties, la vitesse moyenne est la distance totale divisée par la durée totale.",
      ["42 km en 1 h 45 min : \\(1{,}75\\ \\text{h}\\), donc \\(v = 42 : 1{,}75 = 24\\ \\text{km/h}\\).", "À 72 km/h pendant 25 min : \\(72 : 60 = 1{,}2\\) km par minute, donc \\(d = 1{,}2 \\cdot 25 = 30\\ \\text{km}\\).", "Aller 120 km à 60 km/h (2 h), retour à 40 km/h (3 h) : \\(v = 240 : 5 = 48\\ \\text{km/h}\\)."],
      "On ne fait jamais la moyenne de deux vitesses : on roule plus longtemps à la vitesse la plus lente."],
    gquot: ["Masse volumique et débit", "La masse volumique dit combien pèse une unité de volume d'une matière. Le débit dit quel volume coule par unité de temps.",
      "Masse volumique : \\(\\rho = \\frac{m}{V}\\), donc \\(m = \\rho \\cdot V\\) et \\(V = \\frac{m}{\\rho}\\). Débit : \\(\\text{débit} = \\frac{V}{t}\\), donc \\(V = \\text{débit} \\cdot t\\) et \\(t = \\frac{V}{\\text{débit}}\\). Avant de calculer, on met les unités d'accord (g et cm³, kg et m³, L et min).",
      ["Or : \\(19{,}3\\ \\text{g/cm}^3\\). Un lingot de \\(50\\ \\text{cm}^3\\) pèse \\(19{,}3 \\cdot 50 = 965\\ \\text{g}\\).", "Air : \\(1{,}2\\ \\text{kg/m}^3\\). Une salle de \\(200\\ \\text{m}^3\\) contient \\(240\\ \\text{kg}\\) d'air.", "Piscine de \\(2{,}4\\ \\text{m}^3 = 2\\text{'}400\\ \\text{L}\\) à \\(15\\ \\text{L/min}\\) : \\(2\\text{'}400 : 15 = 160\\ \\text{min}\\)."],
      "Un kilo de plomb et un kilo de plumes ont la même masse : c'est leur volume qui change."],
  };
  for (const [id, v] of Object.entries(R2)) LESSONS[id] = L_(...v);

  const dec = (v, k = 2) => String(+(+v).toFixed(k)).replace(".", ",");
  const two = (n) => (n < 10 ? "0" : "") + n;
  const svgW = 320;

  Object.assign(ACTIVE, {
    // ---- Durées : la barre d'une heure ----
    utemps: {
      predict: { q: "Un film dure 1,5 h. Combien de temps est-ce ?", choices: ["1 h 50 min", "1 h 30 min", "1 h 05 min"], good: 1,
        why: "0,5 h, c'est une demi-heure : la moitié de 60 min, donc 30 min. Une heure n'a pas 100 minutes." },
      defis: ["Règle la barre sur 0,75 h.", "Combien de minutes font 0,2 h ? Règle la barre.", "Trouve la durée qui s'écrit 0,35 h."],
      play(box, onWin) {
        let m = 30, step = 0;
        const draw = () => {
          const x0 = 26, w = 268, xm = x0 + (w * m) / 60;
          let g = '<rect x="' + x0 + '" y="20" width="' + w + '" height="34" rx="6" class="f-soft" stroke="var(--ink)" stroke-width="1.2"/>';
          g += '<rect x="' + x0 + '" y="20" width="' + (xm - x0).toFixed(1) + '" height="34" rx="6" class="f-fill"/>';
          for (let k = 0; k <= 60; k += 5) { const x = x0 + (w * k) / 60; g += '<line x1="' + x + '" y1="' + (k % 15 ? 48 : 40) + '" x2="' + x + '" y2="54" class="f-line"/>'; if (k % 15 === 0) g += '<text x="' + x + '" y="72" class="f-txt" text-anchor="middle" font-size="11">' + k + " min</text>"; }
          g += '<text x="' + (x0 + w / 2) + '" y="13" class="f-txt" text-anchor="middle" font-size="12">1 heure = 60 minutes</text>';
          g += '<rect class="act-hit" x="' + x0 + '" y="14" width="' + w + '" height="46" fill="transparent" style="cursor:pointer"/>';
          box.innerHTML = `<svg class="fig" viewBox="0 0 ${svgW} 80" role="img" aria-label="barre d'une heure, ${m} minutes">${g}</svg>
            ${actStepper("Minutes", m, "m")}
            <div class="act-out"><b>${m} min</b> = ${m} ÷ 60 h = <b>${dec(m / 60, 4)} h</b></div>
            <div class="small muted">Touche la barre, puis ajuste avec − et +.</div>`;
          actBindStepper(box, "m", () => m, (v) => { m = v; draw(); check(); }, 0, 60);
          const hit = box.querySelector(".act-hit");
          hit.onclick = (e) => { const r = hit.getBoundingClientRect(); m = Math.max(0, Math.min(60, Math.round(((e.clientX - r.left) / r.width) * 60))); draw(); check(); };
        };
        const check = () => {
          if (step === 0 && m === 45) { onWin(0, "45 min = 45 ÷ 60 = 0,75 h : trois quarts d'heure."); step = 1; }
          else if (step === 1 && m === 12) { onWin(1, "0,2 h = 0,2 · 60 = 12 min (un cinquième d'heure)."); step = 2; }
          else if (step === 2 && m === 21) { onWin(2, "0,35 h = 0,35 · 60 = 21 min. Pour passer des heures aux minutes, on multiplie par 60."); step = 3; }
        };
        draw();
      },
    },

    // ---- Unités composées : le convertisseur à la main ----
    ucomp: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "En une heure (3600 s), on parcourt 3600 fois la distance d'une seconde. Comme 1 km = 1000 m, \\(1\\ \\text{m/s} = 3{,}6\\ \\text{km/h}\\). Des m/s vers les km/h, on multiplie par 3,6. Des km/h vers les m/s, on divise par 3,6.", exemple: ["\\(30\\ \\text{m/s}\\) : en 1 h, 108'000 m, soit \\(108\\ \\text{km/h}\\).", "\\(90\\ \\text{km/h} = 90 : 3{,}6 = 25\\ \\text{m/s}\\)."] },
      predict: { q: "Un guépard court à 30 m/s. Va-t-il plus vite qu'une voiture à 100 km/h ?", choices: ["Oui", "Non"], good: 0,
        why: "En une heure (3600 s), il parcourrait 30 · 3600 = 108'000 m = 108 km : 30 m/s = 108 km/h, plus que 100 km/h." },
      defis: ["Trouve la vitesse en m/s qui fait exactement 36 km/h.", "Une voiture roule à 90 km/h : combien de m/s ?", "Quelle est la plus petite vitesse en m/s (nombre entier) qui dépasse 100 km/h ?"],
      play(box, onWin) {
        let v = 5, step = 0;
        const draw = () => {
          const kmh = +(v * 3.6).toFixed(1), x0 = 20, w = 280, cap = 150;
          let g = '<text x="' + x0 + '" y="16" class="f-txt" font-size="12">en 1 seconde : ' + v + " m</text>";
          g += '<rect x="' + x0 + '" y="22" width="' + ((w * v) / 50).toFixed(1) + '" height="14" rx="4" class="f-fill"/>';
          g += '<text x="' + x0 + '" y="58" class="f-txt" font-size="12">en 1 heure : ' + (v * 3600).toLocaleString("fr-CH").replace(/\s/g, "'") + " m = " + String(kmh).replace(".", ",") + " km</text>";
          g += '<rect x="' + x0 + '" y="64" width="' + Math.min(w, (w * kmh) / cap).toFixed(1) + '" height="14" rx="4" class="f-fill" opacity="0.55"/>';
          g += '<line x1="' + (x0 + (w * 100) / cap) + '" y1="60" x2="' + (x0 + (w * 100) / cap) + '" y2="84" class="f-line" stroke-dasharray="3 3"/><text x="' + (x0 + (w * 100) / cap) + '" y="96" class="f-txt" text-anchor="middle" font-size="10">100 km/h</text>';
          box.innerHTML = `<svg class="fig" viewBox="0 0 ${svgW} 100" role="img" aria-label="${v} mètres par seconde">${g}</svg>
            ${actStepper("Vitesse (m/s)", v, "v")}
            <div class="act-out"><b>${v} m/s</b> = ${v} · 3600 m par heure = <b>${String(kmh).replace(".", ",")} km/h</b></div>`;
          actBindStepper(box, "v", () => v, (x) => { v = x; draw(); check(); }, 1, 45);
        };
        const check = () => {
          if (step === 0 && v === 10) { onWin(0, "10 m/s : 36'000 m en une heure, soit 36 km/h. C'est le « × 3,6 »."); step = 1; }
          else if (step === 1 && v === 25) { onWin(1, "90 km/h = 90 ÷ 3,6 = 25 m/s. Des km/h vers les m/s, on divise par 3,6."); step = 2; }
          else if (step === 2 && v === 28) { onWin(2, "27 m/s = 97,2 km/h, mais 28 m/s = 100,8 km/h : c'est 28 m/s."); step = 3; }
          else if (step === 2 && v > 28) $hint(box, v + " m/s = " + String(+(v * 3.6).toFixed(1)).replace(".", ",") + " km/h dépasse bien 100 km/h… mais y a-t-il plus petit ?");
        };
        draw();
      },
    },

    // ---- Vitesse : la route ----
    vitesse: {
      predict: { q: "Une voiture fait l'aller à 60 km/h et le retour à 40 km/h (même route). Sa vitesse moyenne est…", choices: ["50 km/h", "moins de 50 km/h", "plus de 50 km/h"], good: 1,
        why: "Elle roule plus longtemps à 40 km/h qu'à 60 km/h : la moyenne penche vers 40. Avec 120 km : 2 h + 3 h, donc 240 km en 5 h = 48 km/h." },
      defis: ["Parcours exactement 150 km en 2 h 30 min.", "À 80 km/h, règle la durée pour parcourir 100 km.", "Trouve deux réglages différents qui font 90 km."],
      play(box, onWin) {
        let k = 6, t = 60, step = 0; const found = new Set();
        const v = () => 10 * k, d = () => (v() * t) / 60;
        const draw = () => {
          const x0 = 26, w = 266, D = d(), xc = x0 + Math.min(w, (w * D) / 200);
          let g = '<rect x="' + x0 + '" y="34" width="' + w + '" height="22" rx="4" class="f-soft"/><line x1="' + x0 + '" y1="45" x2="' + (x0 + w) + '" y2="45" class="f-on" stroke-dasharray="12 8" stroke-width="2"/>';
          for (let km = 0; km <= 200; km += 50) { const x = x0 + (w * km) / 200; g += '<line x1="' + x + '" y1="56" x2="' + x + '" y2="62" class="f-line"/><text x="' + x + '" y="76" class="f-txt" text-anchor="middle" font-size="10">' + km + " km</text>"; }
          g += '<rect x="' + (xc - 15).toFixed(1) + '" y="18" width="30" height="14" rx="4" class="f-fill"/><circle cx="' + (xc - 8).toFixed(1) + '" cy="33" r="3.5" class="f-dot"/><circle cx="' + (xc + 8).toFixed(1) + '" cy="33" r="3.5" class="f-dot"/>';
          const hm = Math.floor(t / 60) + " h " + two(t % 60) + " min";
          box.innerHTML = `<svg class="fig" viewBox="0 0 ${svgW} 82" role="img" aria-label="voiture après ${dec(D)} km">${g}</svg>
            ${actStepper("Vitesse (km/h)", v(), "v")}${actStepper("Durée (min)", t, "t")}
            <div class="act-out">Durée : ${hm} = <b>${dec(t / 60)} h</b><br>Distance : d = v · t = ${v()} · ${dec(t / 60)} = <b>${dec(D)} km</b></div>`;
          actBindStepper(box, "v", () => v(), (x) => { k = Math.round(x / 10); draw(); check(); }, 10, 130);
          box.querySelectorAll('[data-st="v"]').forEach((b) => (b.onclick = () => { k = Math.max(1, Math.min(13, k + +b.dataset.d)); draw(); check(); }));
          box.querySelectorAll('[data-st="t"]').forEach((b) => (b.onclick = () => { t = Math.max(15, Math.min(240, t + 15 * +b.dataset.d)); draw(); check(); }));
        };
        const check = () => {
          const D = d();
          if (step === 0 && t === 150 && D === 150) { onWin(0, "2 h 30 min = 2,5 h ; 150 ÷ 2,5 = 60 km/h."); step = 1; }
          else if (step === 0 && D === 150) $hint(box, "150 km, c'est bien, mais en 2 h 30 min exactement.");
          else if (step === 1 && v() === 80 && D === 100) { onWin(1, "t = 100 ÷ 80 = 1,25 h = 1 h 15 min = 75 min."); step = 2; }
          else if (step === 2 && D === 90) { found.add(v() + "|" + t); if (found.size >= 2) { onWin(2, "Plusieurs réglages donnent 90 km : si la vitesse double, la durée est divisée par deux (ex. 60 km/h en 1 h 30, 90 km/h en 1 h)."); step = 3; } else $hint(box, "Bien : " + v() + " km/h pendant " + t + " min. Trouves-en un autre."); }
        };
        draw();
      },
    },

    // ---- Masse volumique : fabrique un bloc ----
    gquot: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Masse volumique : \\(\\rho = \\frac{m}{V}\\), donc \\(m = \\rho \\cdot V\\) et \\(V = \\frac{m}{\\rho}\\). Avant de calculer, on met les unités d'accord (g et cm³).", exemple: ["Or : \\(19{,}3\\ \\text{g/cm}^3\\). 6 cm³ pèsent \\(19{,}3 \\cdot 6 = 115{,}8\\ \\text{g}\\).", "Glace : \\(0{,}92\\ \\text{g/cm}^3\\). Un glaçon de 46 g : \\(V = 46 : 0{,}92 = 50\\ \\text{cm}^3\\)."] },
      predict: { q: "Qu'est-ce qui pèse le plus : 1 kg de plomb ou 1 kg de plumes ?", choices: ["Le plomb", "Les plumes", "C'est pareil"], good: 2,
        why: "Les deux pèsent 1 kg ! Les plumes prennent beaucoup plus de place : leur masse volumique est bien plus petite." },
      defis: ["Fabrique un bloc d'or de plus de 100 g avec le moins de cm³ possible.", "Avec de l'aluminium, approche au mieux la masse d'un seul cm³ d'or (19,3 g).", "Un glaçon pèse 46 g : trouve son volume."],
      play(box, onWin) {
        const MAT = [["or", 19.3], ["fer", 7.9], ["aluminium", 2.7], ["glace", 0.92], ["bois", 0.6]];
        let mi = 0, V = 3, step = 0;
        const draw = () => {
          const [nom, rho] = MAT[mi], m = +(rho * V).toFixed(2), c = 10, cols = 12, sz = 22;
          let g = "";
          for (let i = 0; i < Math.min(V, 60); i++) { const r = Math.floor(i / cols), q = i % cols; g += '<rect x="' + (12 + q * (sz + 3)) + '" y="' + (6 + r * (sz + 3)) + '" width="' + sz + '" height="' + sz + '" rx="3" class="f-fill" opacity="' + Math.min(1, 0.25 + rho / 20).toFixed(2) + '"/>'; }
          const H = 12 + Math.ceil(Math.min(V, 60) / cols) * (sz + 3);
          box.innerHTML = `<div class="seg act-mat">${MAT.map((x, i) => `<button type="button" data-i="${i}" aria-pressed="${i === mi}">${x[0]}</button>`).join("")}</div>
            <div class="small muted">1 cm³ ${nom === "or" ? "d'" : "de "}${nom} pèse ${dec(rho)} g · chaque carré = 1 cm³</div>
            <svg class="fig" viewBox="0 0 ${svgW} ${H}" role="img" aria-label="${V} centimètres cubes">${g}</svg>
            ${actStepper("Volume (cm³)", V, "V")}
            <div class="act-out">m = ρ · V = ${dec(rho)} · ${V} = <b>${dec(m)} g</b></div>`;
          box.querySelectorAll(".act-mat button").forEach((b) => (b.onclick = () => { mi = +b.dataset.i; draw(); check(); }));
          actBindStepper(box, "V", () => V, (x) => { V = x; draw(); check(); }, 1, 60);
        };
        const check = () => {
          const [nom, rho] = MAT[mi], m = rho * V;
          if (step === 0 && nom === "or" && V === 6) { onWin(0, "5 cm³ d'or pèsent 96,5 g, 6 cm³ pèsent 115,8 g : il faut 6 cm³."); step = 1; }
          else if (step === 0 && nom === "or" && V > 6) $hint(box, "Plus de 100 g, oui… mais avec moins de cm³ ?");
          else if (step === 1 && nom === "aluminium" && V === 7) { onWin(1, "7 cm³ d'aluminium pèsent 18,9 g : il faut environ 7 fois plus d'aluminium que d'or pour la même masse."); step = 2; }
          else if (step === 2 && nom === "glace" && Math.abs(m - 46) < 1e-9) { onWin(2, "V = m ÷ ρ = 46 ÷ 0,92 = 50 cm³."); step = 3; }
        };
        draw();
      },
    },
  });
  // Case 10 : figure à manipuler dans le rappel de cours « vitesse » — à vitesse constante, la distance est
  // proportionnelle à la durée (droite passant par l'origine).
  DYN.vitesse = {
    min: 0, max: 3, step: 0.25, start: 1.5,
    label: (x) => "durée " + dec(x) + " h = " + Math.floor(x) + " h " + two(Math.round((x % 1) * 60)) + " min · distance " + dec(80 * x) + " km",
    render(x) {
      const W = 330, H = 176, gx = (t) => 40 + t * 90, gy = (d) => 150 - d * 0.5, D = 80 * x;
      let g = '<line x1="' + gx(0) + '" y1="' + gy(0) + '" x2="' + gx(3.2) + '" y2="' + gy(0) + '" class="f-line"/><line x1="' + gx(0) + '" y1="' + gy(0) + '" x2="' + gx(0) + '" y2="' + gy(260) + '" class="f-line"/>';
      for (let t = 1; t <= 3; t++) g += '<text x="' + gx(t) + '" y="' + (gy(0) + 14) + '" class="f-txt" text-anchor="middle" font-size="11">' + t + " h</text>";
      for (let d = 80; d <= 240; d += 80) g += '<line x1="' + gx(0) + '" y1="' + gy(d) + '" x2="' + gx(3) + '" y2="' + gy(d) + '" class="f-grid"/><text x="' + (gx(0) - 4) + '" y="' + (gy(d) + 4) + '" class="f-txt" text-anchor="end" font-size="11">' + d + "</text>";
      g += '<text x="' + (gx(0) + 4) + '" y="' + (gy(260) + 2) + '" class="f-txt" font-size="11">distance (km)</text>';
      g += '<line x1="' + gx(0) + '" y1="' + gy(0) + '" x2="' + gx(3) + '" y2="' + gy(240) + '" class="f-line" stroke-dasharray="4 3"/>';
      g += '<line x1="' + gx(x) + '" y1="' + gy(0) + '" x2="' + gx(x) + '" y2="' + gy(D) + '" class="f-accent" stroke-width="1.5"/><line x1="' + gx(0) + '" y1="' + gy(D) + '" x2="' + gx(x) + '" y2="' + gy(D) + '" class="f-accent" stroke-width="1" stroke-dasharray="2 2"/>';
      g += '<circle cx="' + gx(x) + '" cy="' + gy(D) + '" r="5" class="f-dot"/>';
      g += '<text x="' + Math.min(gx(x) + 8, 250) + '" y="' + (gy(D) - 8) + '" class="f-accent f-txt" font-size="13">' + dec(D) + " km</text>";
      return '<svg class="fig" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="distance parcourue à 80 km/h en fonction de la durée">' + g + "</svg>";
    },
  };
  if (typeof LESSON_FIGS !== "undefined") LESSON_FIGS.vitesse = () => '<p class="small muted">Une voiture roule à 80 km/h. Fais glisser la durée : chaque heure ajoute 80 km.</p>' + dynHtml("vitesse");
})();

// Chantier 11e · 5. Calcul littéral (15.11) : leçons actives (devine / manipule / retiens) et rappels de cours
// pour litelab, valnum, reduire, monomes, parenth, distrib, idrem, factor. Chargé après active.js et lessons2.js.
// Pas de TeX dans ce qui est redessiné (exposants en caractères ², ³…).
(function () {
  const R2 = {
    litelab: ["Écrire une expression littérale", "Une lettre remplace un nombre qu'on ne connaît pas, ou n'importe quel nombre.",
      "Le début de la phrase donne l'opération qu'on fait en dernier, donc la forme de l'expression. « Le triple de la somme de x et 5 » commence par « le triple de » : on fait d'abord la somme, puis on la triple, c'est \\(3(x + 5)\\). « La somme du triple de x et de 5 » commence par « la somme » : on triple d'abord x, puis on ajoute 5, c'est \\(3x + 5\\). Avec \\(n\\) entier : \\(2n\\) est pair, \\(2n + 1\\) est impair, \\(n\\) et \\(n + 1\\) sont consécutifs.",
      ["Le double de \\(x\\), diminué de 7 : \\(2x - 7\\).", "Le carré de la somme de \\(a\\) et \\(b\\) : \\((a + b)^2\\).", "Périmètre d'un rectangle \\(x\\) sur \\(x + 3\\) : \\(2x + 2(x + 3) = 4x + 6\\)."],
      "Sans parenthèses, la multiplication passe avant l'addition : \\(3x + 5\\) n'est pas \\(3(x + 5)\\)."],
    valnum: ["Calculer la valeur d'une expression", "Remplacer une lettre par un nombre, c'est substituer.",
      "On remplace chaque lettre par sa valeur, entre parenthèses si elle est négative. Puis on respecte les priorités : puissances, puis multiplications et divisions, puis additions et soustractions.",
      ["\\(3x^2 - 2x\\) pour \\(x = -2\\) : \\(3 \\cdot (-2)^2 - 2 \\cdot (-2) = 12 + 4 = 16\\).", "\\(a^2 - 3ab\\) pour \\(a = -1\\), \\(b = 2\\) : \\(1 + 6 = 7\\)."],
      "\\((-2)^2 = 4\\), mais \\(-2^2 = -4\\) : sans parenthèses, le carré ne porte que sur 2."],
    reduire: ["Réduire une expression", "Réduire, c'est regrouper les termes semblables.",
      "Deux termes sont semblables s'ils ont exactement la même partie littérale (mêmes lettres, mêmes exposants). On additionne leurs coefficients. On ordonne ensuite du plus grand exposant au plus petit.",
      ["\\(5x + 3 - 2x + 7 = 3x + 10\\).", "\\(3x^2 - 5x + 2x^2 + 7x = 5x^2 + 2x\\).", "\\(2xy + 3x - xy = xy + 3x\\)."],
      "\\(x\\) et \\(x^2\\) ne sont pas semblables : \\(3x + 2x^2\\) ne se réduit pas, et \\(x^2 + x^2 = 2x^2\\) (pas \\(x^4\\))."],
    monomes: ["Multiplier des monômes", "Un monôme est un produit d'un nombre (le coefficient) et de lettres.",
      "Pour multiplier des monômes, on multiplie les coefficients entre eux, puis les lettres entre elles : pour une même lettre, on additionne les exposants. Une lettre sans exposant a l'exposant 1. Pour une puissance, chaque facteur est élevé à cette puissance.",
      ["\\(3x \\cdot 4x = 12x^2\\).", "\\(2x^3 \\cdot 5x^2 = 10x^5\\).", "\\((-3x^2)^2 = 9x^4\\)."],
      "On additionne les exposants quand on multiplie : \\(x^2 \\cdot x^3 = x^5\\), pas \\(x^6\\)."],
    parenth: ["Supprimer des parenthèses", "Le signe devant une parenthèse décide de ce qui arrive aux termes à l'intérieur.",
      "Précédée de « + », une parenthèse disparaît sans rien changer. Précédée de « − », elle disparaît et chaque terme à l'intérieur change de signe. Avec des crochets, on commence par l'intérieur.",
      ["\\(x + (3 - 2x) = x + 3 - 2x = -x + 3\\).", "\\(x - (3 - 2x) = x - 3 + 2x = 3x - 3\\).", "\\(-(4x - 7 + y) = -4x + 7 - y\\)."],
      "Le « − » change le signe de <b>tous</b> les termes, pas seulement du premier."],
    distrib: ["Développer", "Développer, c'est transformer un produit en somme.",
      "Simple distributivité : \\(k(a + b) = ka + kb\\). Double distributivité : chaque terme de la première parenthèse multiplie chaque terme de la deuxième, \\((a + b)(c + d) = ac + ad + bc + bd\\). On réduit ensuite.",
      ["\\(3(2x - 5) = 6x - 15\\).", "\\((x + 2)(x - 5) = x^2 - 5x + 2x - 10 = x^2 - 3x - 10\\).", "\\(2x(4x^2 + x - 3) = 8x^3 + 2x^2 - 6x\\)."],
      "Dans \\((x + 2)(x - 5)\\), il y a 4 produits : n'oublie pas les produits « croisés »."],
    idrem: ["Identités remarquables", "Trois produits reviennent si souvent qu'on les connaît par cœur.",
      "\\((a + b)^2 = a^2 + 2ab + b^2\\). \\((a - b)^2 = a^2 - 2ab + b^2\\). \\((a + b)(a - b) = a^2 - b^2\\). Le terme du milieu, \\(2ab\\), s'appelle le double produit.",
      ["\\((x + 3)^2 = x^2 + 6x + 9\\).", "\\((2x - 5)^2 = 4x^2 - 20x + 25\\).", "\\((x + 4)(x - 4) = x^2 - 16\\)."],
      "\\((x + 3)^2\\) n'est pas \\(x^2 + 9\\) : il manque le double produit \\(6x\\)."],
    factor: ["Factoriser", "Factoriser, c'est transformer une somme en produit : le contraire de développer.",
      "Mise en évidence : on cherche le facteur commun (nombre, lettre ou parenthèse) et on l'écrit devant, \\(ka + kb = k(a + b)\\). Sinon, on reconnaît une identité : \\(a^2 - b^2 = (a - b)(a + b)\\), \\(a^2 + 2ab + b^2 = (a + b)^2\\). Factoriser au maximum : on continue tant qu'un facteur se factorise encore. On vérifie toujours en développant.",
      ["\\(6x + 9 = 3(2x + 3)\\).", "\\(x^2 - 25 = (x - 5)(x + 5)\\).", "\\(2x^2 - 8 = 2(x^2 - 4) = 2(x - 2)(x + 2)\\)."],
      "Dans \\(3x(2x + 1) - (2x + 1)\\), le deuxième terme vaut \\(-1 \\cdot (2x + 1)\\) : il reste \\(-1\\), donc \\((2x + 1)(3x - 1)\\)."],
  };
  for (const [id, v] of Object.entries(R2)) LESSONS[id] = L_(...v);

  const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹", sup = (n) => String(n).split("").map((d) => SUP[+d]).join("");
  const nb = (v) => String(+(+v).toFixed(3)).replace(".", ",").replace("-", "−");
  const term = (c, l, first) => { const s = c < 0 ? (first ? "−" : " − ") : first ? "" : " + "; const a = Math.abs(c); return s + (l ? (a === 1 ? "" : a) + l : a); };
  const poly = (ts) => { const f = ts.filter(([c]) => c !== 0); return f.length ? f.map(([c, l], i) => term(c, l, i === 0)).join("") : "0"; };

  Object.assign(ACTIVE, {
    // ---- Écrire une expression : deux machines ----
    litelab: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Le début de la phrase donne l'opération qu'on fait en dernier, donc la forme de l'expression. « Le triple de la somme de x et 5 » : on fait d'abord la somme, puis on la triple, c'est \\(3(x + 5)\\). « La somme du triple de x et de 5 » : on triple d'abord x, puis on ajoute 5, c'est \\(3x + 5\\).", exemple: ["Machine A « × 3, puis + 5 » : \\(3x + 5\\) ; 5 donne 20.", "Machine B « + 5, puis × 3 » : \\(3(x + 5) = 3x + 15\\) ; 5 donne 30.", "Toujours \\(B - A = 3x + 15 - (3x + 5) = 10\\)."] },
      predict: { q: "« Le triple de la somme de x et 5 » s'écrit…", choices: ["3x + 5", "3(x + 5)"], good: 1, why: "La phrase commence par « le triple de… » : c'est l'opération qu'on fait en dernier. On calcule d'abord la somme x + 5, puis on la triple. Il faut des parenthèses." },
      defis: ["Voici la machine A : « × 3, puis + 5 ». Trouve le nombre qui donne 20.", "Voici la machine B : « + 5, puis × 3 ». Trouve le nombre qui donne 30.", "Compare les deux machines : essaie trois nombres. Que vaut toujours B − A ?"],
      play(box, onWin) {
        let n = 2, step = 0; const seen = new Set();
        // Une machine à la fois (retour de l'utilisateur, 15.11) : A seule, puis B seule, puis les deux et l'écart.
        const draw = () => {
          const A = 3 * n + 5, B = 3 * (n + 5);
          const mA = `<div class="act-out"><b>Machine A</b> <span class="small muted">(× 3, puis + 5)</span><br>3 · ${nb(n)} + 5 = <b>${nb(A)}</b></div>`;
          const mB = `<div class="act-out"><b>Machine B</b> <span class="small muted">(+ 5, puis × 3)</span><br>(${nb(n)} + 5) · 3 = <b>${nb(B)}</b></div>`;
          const body = step === 0 ? mA + '<div class="small muted">La machine A s\'écrit 3n + 5.</div>'
            : step === 1 ? mB + '<div class="small muted">Nouvelle machine : on ajoute 5 <b>d\'abord</b>. Elle s\'écrit 3(n + 5).</div>'
            : mA + mB + `<div class="act-out">B − A = ${nb(B)} − ${nb(A)} = <b>${nb(B - A)}</b></div><div class="small muted">Essais : ${seen.size} sur 3</div>`;
          box.innerHTML = actStepper("Nombre choisi", n, "n") + body;
          actBindStepper(box, "n", () => n, (v) => { n = v; seen.add(v); draw(); check(); }, -10, 20);
        };
        const check = () => {
          if (step === 0 && 3 * n + 5 === 20) { onWin(0, "n = 5 : 3 · 5 + 5 = 20."); step = 1; seen.clear(); draw(); }
          else if (step === 1 && 3 * (n + 5) === 30) { onWin(1, "n = 5 : (5 + 5) · 3 = 30. Même nombre de départ que pour A, mais pas le même résultat : l'ordre des opérations compte."); step = 2; seen.clear(); draw(); }
          else if (step === 2 && seen.size >= 3) { onWin(2, "B − A vaut toujours 10 : 3(n + 5) − (3n + 5) = 3n + 15 − 3n − 5 = 10. Le calcul littéral le prouve pour tous les nombres."); step = 3; }
        };
        draw();
      },
    },
    // ---- Valeur numérique : curseur ----
    valnum: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { exemple: ["\\(2x^2 - 3x\\) pour \\(x = 3\\) : \\(2 \\cdot 9 - 9 = 9\\).", "Pour \\(x = -2\\) : \\(2 \\cdot (-2)^2 - 3 \\cdot (-2) = 8 + 6 = 14\\).", "Pour \\(x = 1{,}5\\) : \\(2 \\cdot 2{,}25 - 4{,}5 = 0\\)."] },
      predict: { q: "Combien vaut x² pour x = −3 ?", choices: ["−9", "9", "−6"], good: 1, why: "(−3)² = (−3) · (−3) = 9 : le carré d'un nombre négatif est positif." },
      defis: ["Trouve un nombre x qui donne 9 pour 2x² − 3x.", "Trouve un nombre négatif x qui donne 14.", "Trouve un nombre x non nul qui donne 0."],
      play(box, onWin) {
        let k = 2, step = 0; const x = () => k / 2;
        const draw = () => {
          const v = 2 * x() * x() - 3 * x();
          box.innerHTML = actStepper("x", nb(x()), "x") + `<div class="act-out">2 · (${nb(x())})² − 3 · (${nb(x())}) = 2 · ${nb(x() * x())} ${-3 * x() < 0 ? "−" : "+"} ${nb(Math.abs(3 * x()))} = <b>${nb(v)}</b></div>`;
          box.querySelectorAll('[data-st="x"]').forEach((b) => (b.onclick = () => { k = Math.max(-8, Math.min(8, k + +b.dataset.d)); draw(); check(); }));
          $hint(box, "Chaque clic change x de 0,5.");
        };
        const check = () => {
          const v = 2 * x() * x() - 3 * x();
          if (step === 0 && v === 9) { onWin(0, "x = " + nb(x()) + " : 2 · " + nb(x() * x()) + " − " + nb(3 * x()).replace("−", "(−") + (x() < 0 ? ")" : "") + " = 9."); step = 1; }
          else if (step === 1 && v === 14 && x() < 0) { onWin(1, "x = −2 : 2 · 4 + 6 = 14. Le carré de −2 est positif, et −3 · (−2) = +6."); step = 2; }
          else if (step === 2 && v === 0 && x() !== 0) { onWin(2, "x = 1,5 : 2 · 2,25 − 4,5 = 0."); step = 3; }
        };
        draw();
      },
    },
    // ---- Réduire : tuiles ----
    reduire: {
      predict: { q: "3x + 2x² se réduit en…", choices: ["5x³", "5x²", "on ne peut pas réduire"], good: 2, why: "x et x² ne sont pas semblables (comme des carrés et des barres de tailles différentes) : on ne peut pas les additionner." },
      defis: ["Compte les tuiles : écris 3x + 5 − x + 2 − 4 sous forme réduite.", "Même chose : 2x² + 3x − x² + x − 6.", "Et : −x² + 4x + 3x² − 7x + 1."],
      play(box, onWin) {
        const E = [[[3, "x"], [5, ""], [-1, "x"], [2, ""], [-4, ""]], [[2, "x²"], [3, "x"], [-1, "x²"], [1, "x"], [-6, ""]], [[-1, "x²"], [4, "x"], [3, "x²"], [-7, "x"], [1, ""]]];
        let step = 0, c2 = 0, c1 = 0, c0 = 0;
        const want = () => { const s = { "x²": 0, x: 0, "": 0 }; E[step].forEach(([c, l]) => (s[l] += c)); return s; };
        const draw = () => {
          if (step >= E.length) return;
          let g = "", x0 = 6;
          E[step].forEach(([c, l]) => { for (let i = 0; i < Math.abs(c); i++) { const w = l === "x²" ? 30 : l === "x" ? 30 : 12, h = l === "x²" ? 30 : 12, y = l === "x²" ? 8 : l === "x" ? 26 : 26; g += '<rect x="' + x0 + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="2" class="' + (c < 0 ? "f-soft" : "f-fill") + '" stroke="var(--ink)" stroke-width="1"' + (c < 0 ? ' stroke-dasharray="3 2"' : "") + "/>"; x0 += w + 3; } x0 += 8; });
          box.innerHTML = `<div class="act-out">${poly(E[step])}</div>
            <svg class="fig" viewBox="0 0 ${Math.max(320, x0)} 46" role="img" aria-label="tuiles">${g}</svg>
            <div class="small muted">Grand carré = x², barre = x, petit carré = 1 ; en pointillé : à retirer.</div>
            ${actStepper("x²", c2, "c2")}${actStepper("x", c1, "c1")}${actStepper("nombre", c0, "c0")}
            <div class="act-out">Ta réponse : <b>${poly([[c2, "x²"], [c1, "x"], [c0, ""]])}</b></div>`;
          actBindStepper(box, "c2", () => c2, (v) => { c2 = v; draw(); check(); }, -9, 9);
          actBindStepper(box, "c1", () => c1, (v) => { c1 = v; draw(); check(); }, -9, 9);
          actBindStepper(box, "c0", () => c0, (v) => { c0 = v; draw(); check(); }, -9, 9);
        };
        const check = () => {
          const w = want();
          if (c2 === w["x²"] && c1 === w.x && c0 === w[""]) {
            onWin(step, poly(E[step]) + " = " + poly([[c2, "x²"], [c1, "x"], [c0, ""]]) + " : on a regroupé les tuiles de même forme.");
            step++; c2 = c1 = c0 = 0; draw();
          }
        };
        draw();
      },
    },
    // ---- Monômes : empiler les facteurs x ----
    monomes: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Pour multiplier des puissances d'une même lettre, on additionne les exposants : \\(x^m \\cdot x^n = x^{m + n}\\), car on compte les facteurs \\(x\\).", exemple: ["\\(x^2 \\cdot x^3 = (x \\cdot x) \\cdot (x \\cdot x \\cdot x) = x^5\\).", "\\(x^3 \\cdot x^4 = x^7\\).", "\\(x^4 \\cdot x^4 = x^8\\)."] },
      predict: { q: "x² · x³ = ?", choices: ["x⁶", "x⁵", "2x⁵"], good: 1, why: "x² · x³ = (x · x) · (x · x · x) : cinq facteurs x, donc x⁵. On additionne les exposants." },
      defis: ["Obtiens x⁷ avec xᵐ · xⁿ, où m = 3.", "Obtiens x⁵ avec m = n + 1.", "Obtiens x⁸ avec m = n."],
      play(box, onWin) {
        let m = 2, n = 2, step = 0;
        const draw = () => {
          const xs = (k, cls) => Array.from({ length: k }, () => `<span class="act-prime ${cls}" style="min-width:30px;height:30px">x</span>`).join("");
          box.innerHTML = actStepper("m", m, "m") + actStepper("n", n, "n") + `<div class="act-lamps">${xs(m, "")}<b style="align-self:center">·</b>${xs(n, "")}</div>
            <div class="act-out">x${sup(m)} · x${sup(n)} = x${sup(m + n)} &nbsp;(${m} + ${n} = ${m + n} facteurs x)</div>`;
          actBindStepper(box, "m", () => m, (v) => { m = v; draw(); check(); }, 1, 8);
          actBindStepper(box, "n", () => n, (v) => { n = v; draw(); check(); }, 1, 8);
        };
        const check = () => {
          if (step === 0 && m === 3 && m + n === 7) { onWin(0, "x³ · x⁴ = x⁷ : 3 + 4 = 7."); step = 1; }
          else if (step === 1 && m === n + 1 && m + n === 5) { onWin(1, "x³ · x² = x⁵."); step = 2; }
          else if (step === 2 && m === n && m + n === 8) { onWin(2, "x⁴ · x⁴ = x⁸, c'est aussi (x⁴)²."); step = 3; }
        };
        draw();
      },
    },
    // ---- Parenthèses : retourner les signes ----
    parenth: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Précédée de « + », une parenthèse disparaît sans rien changer. Précédée de « − », elle disparaît et chaque terme à l'intérieur change de signe.", exemple: ["\\(7 - (2x - 5 + y) = 7 - 2x + 5 - y\\).", "\\(4x + (3 - x) = 4x + 3 - x = 3x + 3\\).", "\\(-(-a + 2b - 6) = a - 2b + 6\\)."] },
      predict: { q: "x − (3 − 2x) = ?", choices: ["x − 3 − 2x", "x − 3 + 2x"], good: 1, why: "Le « − » devant la parenthèse change le signe de chaque terme : −(3 − 2x) = −3 + 2x." },
      defis: ["Enlève la parenthèse de 7 − (2x − 5 + y) : touche les termes dont le signe change.", "Même chose avec 4x + (3 − x).", "Et avec −(−a + 2b − 6)."],
      play(box, onWin) {
        const E = [{ head: "7 − (", terms: [2, -5, 1], lit: ["x", "", "y"], minus: true }, { head: "4x + (", terms: [3, -1], lit: ["", "x"], minus: false }, { head: "−(", terms: [-1, 2, -6], lit: ["a", "b", ""], minus: true }];
        let step = 0, flip = [];
        const draw = () => {
          if (step >= E.length) return;
          const e = E[step]; if (flip.length !== e.terms.length) flip = e.terms.map(() => false);
          const shown = e.terms.map((c, i) => (flip[i] ? -c : c)), pre = e.head.replace(/[−+]\s*\($/, "").trim();
          box.innerHTML = `<div class="act-out">${e.head}${poly(e.terms.map((c, i) => [c, e.lit[i]]))})</div>
            <div class="small muted">Sans parenthèse : touche un terme pour changer son signe.</div>
            <div class="act-expr">${pre ? `<span class="act-op">${pre}</span>` : ""}${shown.map((c, i) => `<button type="button" class="act-num" data-i="${i}">${term(c, e.lit[i], i === 0 && !pre).trim()}</button>`).join("")}</div>
            <button type="button" class="btn-primary small" id="actok">C'est bon</button>`;
          box.querySelectorAll(".act-num").forEach((b) => (b.onclick = () => { flip[+b.dataset.i] = !flip[+b.dataset.i]; draw(); }));
          box.querySelector("#actok").onclick = check;
        };
        const check = () => {
          const e = E[step], ok = flip.every((f) => f === e.minus);
          if (ok) { onWin(step, e.minus ? "Précédée de « − », la parenthèse change le signe de <b>tous</b> les termes." : "Précédée de « + », rien ne change : on enlève simplement la parenthèse."); step++; flip = []; draw(); }
          else $hint(box, e.minus ? "Un « − » devant la parenthèse change le signe de chaque terme : vérifie-les tous." : "Un « + » devant la parenthèse ne change aucun signe.");
        };
        draw();
      },
    },
    // ---- Développer : le rectangle découpé ----
    distrib: {
      predict: { q: "3(2x + 5) = ?", choices: ["6x + 5", "6x + 15", "5x + 8"], good: 1, why: "Le 3 multiplie les deux termes : 3 · 2x = 6x et 3 · 5 = 15. Comme l'aire d'un rectangle coupé en deux." },
      defis: ["Règle le rectangle pour obtenir 6x + 15.", "Obtiens 12x + 8 avec une largeur de 4.", "Obtiens 10x + 10."],
      play(box, onWin) {
        let k = 2, a = 1, b = 3, step = 0;
        const draw = () => {
          const W1 = 40 + a * 30, W2 = 12 + b * 10, H = 20 + k * 12, x0 = 30;
          let g = '<rect x="' + x0 + '" y="10" width="' + W1 + '" height="' + H + '" class="f-fill" opacity="0.5" stroke="var(--ink)"/><rect x="' + (x0 + W1) + '" y="10" width="' + W2 + '" height="' + H + '" class="f-soft" stroke="var(--ink)"/>';
          g += '<text x="' + (x0 + W1 / 2) + '" y="' + (16 + H / 2) + '" class="f-txt" text-anchor="middle" font-size="13">' + k * a + 'x</text><text x="' + (x0 + W1 + W2 / 2) + '" y="' + (16 + H / 2) + '" class="f-txt" text-anchor="middle" font-size="13">' + k * b + "</text>";
          g += '<text x="' + (x0 + W1 / 2) + '" y="' + (H + 26) + '" class="f-txt" text-anchor="middle" font-size="12">' + (a === 1 ? "" : a) + 'x</text><text x="' + (x0 + W1 + W2 / 2) + '" y="' + (H + 26) + '" class="f-txt" text-anchor="middle" font-size="12">' + b + '</text><text x="' + (x0 - 8) + '" y="' + (14 + H / 2) + '" class="f-txt" text-anchor="end" font-size="12">' + k + "</text>";
          box.innerHTML = `<svg class="fig" viewBox="0 0 ${Math.max(320, x0 + W1 + W2 + 10)} ${H + 34}" role="img" aria-label="rectangle">${g}</svg>
            ${actStepper("largeur", k, "k")}${actStepper("coefficient de x", a, "a")}${actStepper("nombre", b, "b")}
            <div class="act-out">${k}(${a === 1 ? "" : a}x + ${b}) = <b>${k * a}x + ${k * b}</b></div>`;
          actBindStepper(box, "k", () => k, (v) => { k = v; draw(); check(); }, 1, 6);
          actBindStepper(box, "a", () => a, (v) => { a = v; draw(); check(); }, 1, 5);
          actBindStepper(box, "b", () => b, (v) => { b = v; draw(); check(); }, 1, 9);
        };
        const check = () => {
          if (step === 0 && k * a === 6 && k * b === 15) { onWin(0, k + "(" + (a === 1 ? "" : a) + "x + " + b + ") = 6x + 15 : chaque morceau du rectangle est un produit."); step = 1; }
          else if (step === 1 && k === 4 && k * a === 12 && k * b === 8) { onWin(1, "4(3x + 2) = 12x + 8."); step = 2; }
          else if (step === 2 && k * a === 10 && k * b === 10) { onWin(2, k + "(" + (a === 1 ? "" : a) + "x + " + b + ") = 10x + 10. Il y a plusieurs réponses : 5(2x + 2), 2(5x + 5)…"); step = 3; }
        };
        draw();
      },
    },
    // ---- Identités : le carré (x + a)² ----
    idrem: {
      predict: { q: "(x + 3)² = ?", choices: ["x² + 9", "x² + 6x + 9", "x² + 3x + 9"], good: 1, why: "(x + 3)² = (x + 3)(x + 3) : 4 morceaux, x², 3x, 3x et 9. Le terme du milieu est le double produit 6x." },
      defis: ["Règle a pour obtenir x² + 10x + 25.", "Trouve a pour que le double produit soit 14x.", "Trouve a pour que le dernier terme soit 36."],
      play(box, onWin) {
        let a = 2, step = 0;
        const draw = () => {
          const X = 90, A = 14 * a, o = 20;
          let g = '<rect x="' + o + '" y="' + o + '" width="' + X + '" height="' + X + '" class="f-fill" opacity="0.55" stroke="var(--ink)"/>';
          g += '<rect x="' + (o + X) + '" y="' + o + '" width="' + A + '" height="' + X + '" class="f-soft" stroke="var(--ink)"/><rect x="' + o + '" y="' + (o + X) + '" width="' + X + '" height="' + A + '" class="f-soft" stroke="var(--ink)"/>';
          g += '<rect x="' + (o + X) + '" y="' + (o + X) + '" width="' + A + '" height="' + A + '" class="f-fill" stroke="var(--ink)"/>';
          g += '<text x="' + (o + X / 2) + '" y="' + (o + X / 2 + 5) + '" class="f-txt" text-anchor="middle" font-size="14">x²</text>';
          g += '<text x="' + (o + X + A / 2) + '" y="' + (o + X / 2 + 5) + '" class="f-txt" text-anchor="middle" font-size="11">' + a + 'x</text><text x="' + (o + X / 2) + '" y="' + (o + X + A / 2 + 4) + '" class="f-txt" text-anchor="middle" font-size="11">' + a + "x</text>";
          g += '<text x="' + (o + X / 2) + '" y="14" class="f-txt" text-anchor="middle" font-size="12">x</text><text x="' + (o + X + A / 2) + '" y="14" class="f-txt" text-anchor="middle" font-size="12">' + a + "</text>";
          box.innerHTML = `<svg class="fig" viewBox="0 0 320 ${o + X + A + 10}" role="img" aria-label="carré de côté x + ${a}">${g}</svg>
            ${actStepper("a", a, "a")}<div class="act-out">(x + ${a})² = x² + ${a}x + ${a}x + ${a * a} = <b>x² + ${2 * a}x + ${a * a}</b></div>`;
          actBindStepper(box, "a", () => a, (v) => { a = v; draw(); check(); }, 1, 9);
        };
        const check = () => {
          if (step === 0 && a === 5) { onWin(0, "(x + 5)² = x² + 10x + 25 : deux rectangles de 5x."); step = 1; }
          else if (step === 1 && a === 7) { onWin(1, "2 · 7 = 14 : le double produit est 2 · x · 7."); step = 2; }
          else if (step === 2 && a === 6) { onWin(2, "6² = 36 : le dernier terme est le carré de a."); step = 3; }
        };
        draw();
      },
    },
    // ---- Factoriser : le rectangle à l'envers ----
    factor: {
      predict: { q: "Factoriser 6x + 9, c'est l'écrire…", choices: ["comme un produit", "comme une somme plus courte"], good: 0, why: "Factoriser = écrire un produit : 6x + 9 = 3(2x + 3). C'est l'inverse de développer." },
      defis: ["Factorise 6x + 9 : choisis la largeur du rectangle.", "Factorise 10x − 15.", "Factorise 12x + 18 au maximum."],
      play(box, onWin) {
        const E = [[6, 9], [10, -15], [12, 18]];
        let k = 2, step = 0;
        const draw = () => {
          if (step >= E.length) return;
          const [p, q] = E[step], okDiv = p % k === 0 && q % k === 0;
          // Le rectangle dessiné (commentaires testeurs des 15 et 16.11 : « on ne voit pas le rectangle ») : largeur k, longueur partagée en deux.
          const L1 = Math.abs(p) / k, L2 = Math.abs(q) / k, W = 300, sc = Math.min(22, 230 / (L1 * 2 + L2 + 0.001)), hk = Math.min(90, 14 * k), w1 = okDiv ? 2 * L1 * sc : 150, w2 = okDiv ? L2 * sc : 70, x0 = 40, y0 = 14;
          const svg = `<svg class="fig" viewBox="0 0 ${W} ${hk + 48}" role="img" aria-label="rectangle de largeur ${k}">
            <rect x="${x0}" y="${y0}" width="${w1}" height="${hk}" class="f-soft" stroke="var(--ink)" stroke-width="1.5"/>
            <rect x="${x0 + w1}" y="${y0}" width="${w2}" height="${hk}" class="f-soft" stroke="var(--ink)" stroke-width="1.5"${q < 0 ? ' stroke-dasharray="4 3"' : ""}/>
            <text x="${x0 + w1 / 2}" y="${y0 + hk / 2 + 5}" class="f-txt" text-anchor="middle" font-size="14">${okDiv ? p + "x" : "?"}</text>
            <text x="${x0 + w1 + w2 / 2}" y="${y0 + hk / 2 + 5}" class="f-txt" text-anchor="middle" font-size="14">${okDiv ? (q < 0 ? "−" + Math.abs(q) : q) : "?"}</text>
            <text x="${x0 - 8}" y="${y0 + hk / 2 + 5}" class="f-accent f-txt" text-anchor="end" font-size="15" font-weight="700">${k}</text>
            <text x="${x0 + w1 / 2}" y="${y0 + hk + 22}" class="f-txt" text-anchor="middle" font-size="13">${okDiv ? (L1 === 1 ? "" : L1) + "x" : "?"}</text>
            <text x="${x0 + w1 + w2 / 2}" y="${y0 + hk + 22}" class="f-txt" text-anchor="middle" font-size="13">${okDiv ? (q < 0 ? "−" : "") + L2 : "?"}</text></svg>`;
          box.innerHTML = `<div class="act-out">Aire : <b>${poly([[p, "x"], [q, ""]])}</b></div><div class="small muted">On range l'aire dans un rectangle de largeur ${k} : que mesure sa longueur ?${q < 0 ? " (partie en pointillé : aire à retirer)" : ""}</div>${svg}${actStepper("largeur (facteur)", k, "k")}
            <div class="act-out">${okDiv ? `${p}x ${q < 0 ? "−" : "+"} ${Math.abs(q)} = <b>${k}(${poly([[p / k, "x"], [q / k, ""]])})</b>` : `${k} ne divise pas ${p} et ${Math.abs(q)} : pas de rectangle entier.`}</div>
            <button type="button" class="btn-primary small" id="actok">C'est factorisé</button>`;
          actBindStepper(box, "k", () => k, (v) => { k = v; draw(); }, 1, 12);
          box.querySelector("#actok").onclick = check;
        };
        const g = (a, b) => (b ? g(b, a % b) : Math.abs(a));
        const check = () => {
          const [p, q] = E[step], G = g(p, q);
          if (p % k || q % k || k === 1) { $hint(box, "Choisis un facteur qui divise les deux nombres (et pas 1)."); return; }
          if (k !== G) { $hint(box, k + "(" + poly([[p / k, "x"], [q / k, ""]]) + ") est factorisé, mais pas au maximum : il reste un facteur commun dans la parenthèse."); return; }
          onWin(step, p + "x " + (q < 0 ? "−" : "+") + " " + Math.abs(q) + " = " + G + "(" + poly([[p / G, "x"], [q / G, ""]]) + ") : " + G + " est le plus grand facteur commun."); step++; k = 2; draw();
        };
        draw();
      },
    },
  });
})();

// Chantier 11e · 1. Nombres et opérations, 2. Pythagore, 3. 3D (17.11) : leçons actives (devine / manipule / retiens)
// et rappels de cours pour fracadd, fracmul, fracconv, puiss, sci, scicalc, pyth, pythfig, pythrec, vol, volcone,
// airepyr, volcomp, volmanq (prio a déjà la sienne). Chargé après active.js et lessons2.js. Pas de TeX dans ce qui est
// redessiné (exposants en caractères ⁰¹²³…).
(function () {
  const R2 = {
    fracadd: ["Additionner des fractions", "On n'additionne que des parts de même taille : il faut un dénominateur commun.",
      "On cherche le plus petit multiple commun des dénominateurs. On écrit chaque fraction avec ce dénominateur (en multipliant numérateur <b>et</b> dénominateur par le même nombre), on additionne les numérateurs, puis on simplifie. Un nombre entier s'écrit aussi comme une fraction : \\(2 = \\frac{6}{3}\\).",
      ["\\(\\frac{1}{4} + \\frac{1}{6} = \\frac{3}{12} + \\frac{2}{12} = \\frac{5}{12}\\).", "\\(\\frac{5}{6} - \\frac{3}{4} = \\frac{10}{12} - \\frac{9}{12} = \\frac{1}{12}\\).", "\\(2 - \\frac{3}{5} = \\frac{10}{5} - \\frac{3}{5} = \\frac{7}{5}\\)."],
      "On n'additionne jamais les dénominateurs : \\(\\frac{1}{4} + \\frac{1}{6}\\) n'est pas \\(\\frac{2}{10}\\)."],
    fracmul: ["Multiplier et diviser des fractions", "Prendre une fraction d'une fraction, c'est multiplier.",
      "On multiplie les numérateurs entre eux et les dénominateurs entre eux ; on simplifie avant si possible. Diviser par une fraction, c'est multiplier par son inverse : \\(\\frac{a}{b} : \\frac{c}{d} = \\frac{a}{b} \\cdot \\frac{d}{c}\\). Les fractions d’un nombre se calculent : \\(\\frac{3}{4}\\) de 28, c'est \\(28 : 4 \\cdot 3 = 21\\).",
      ["\\(\\frac{2}{3} \\cdot \\frac{3}{4} = \\frac{6}{12} = \\frac{1}{2}\\).", "\\(\\frac{4}{9} \\cdot \\frac{15}{8} = \\frac{1 \\cdot 5}{3 \\cdot 2} = \\frac{5}{6}\\) (simplifié avant).", "\\(\\frac{3}{4} : \\frac{3}{8} = \\frac{3}{4} \\cdot \\frac{8}{3} = 2\\) : il y a deux fois \\(\\frac{3}{8}\\) dans \\(\\frac{3}{4}\\)."],
      "Pour multiplier, pas de dénominateur commun ; pour diviser, on inverse la <b>deuxième</b> fraction."],
    fracconv: ["Fraction, décimal, pourcentage", "Un même nombre a plusieurs écritures.",
      "Fraction → décimal : on divise le numérateur par le dénominateur. Décimal → fraction : sur 10, 100, 1000…, puis on simplifie. Pourcentage : « pour cent », donc sur 100. Un nombre périodique s'écrit aussi en fraction : avec \\(x = 0{,}\\overline{3}\\), \\(10x - x = 3\\), donc \\(x = \\frac{3}{9} = \\frac{1}{3}\\).",
      ["\\(\\frac{3}{8} = 3 : 8 = 0{,}375 = 37{,}5\\,\\%\\).", "\\(0{,}35 = \\frac{35}{100} = \\frac{7}{20}\\).", "\\(0{,}\\overline{27} = \\frac{27}{99} = \\frac{3}{11}\\) (période de 2 chiffres : sur 99)."],
      "Deux baisses successives de 20 % ne font pas 40 % : la deuxième porte sur le prix déjà baissé (\\(0{,}8 \\cdot 0{,}8 = 0{,}64\\), soit 36 %)."],
    puiss: ["Puissances", "\\(a^n\\) est un raccourci pour \\(n\\) facteurs \\(a\\).",
      "Même base : \\(a^m \\cdot a^n = a^{m+n}\\), \\(\\frac{a^m}{a^n} = a^{m-n}\\), \\((a^m)^n = a^{m \\cdot n}\\). Exposant nul ou négatif : \\(a^0 = 1\\) et \\(a^{-n} = \\frac{1}{a^n}\\) (chaque marche vers le bas divise par \\(a\\)). Sans parenthèses, la puissance ne porte que sur le nombre : \\(-3^2 = -9\\), mais \\((-3)^2 = 9\\).",
      ["\\(2^3 \\cdot 2^4 = 2^7 = 128\\).", "\\(\\frac{5^2}{5^5} = 5^{-3} = \\frac{1}{125}\\).", "\\(2^5 \\cdot 5^5 = 10^5\\) : même exposant, on regroupe les bases."],
      "Un exposant négatif ne rend pas le nombre négatif : \\(2^{-3} = \\frac{1}{8}\\), pas \\(-8\\)."],
    sci: ["Notation scientifique", "Un nombre très grand ou très petit s'écrit \\(a \\cdot 10^n\\), avec \\(1 \\le a < 10\\).",
      "On place la virgule après le premier chiffre non nul : c'est \\(a\\). L'exposant \\(n\\) compte de combien de rangs on a déplacé la virgule : positif pour un nombre plus grand que 10, négatif pour un nombre plus petit que 1. Pour comparer, on regarde d'abord l'exposant.",
      ["\\(4\\text{'}500\\text{'}000 = 4{,}5 \\cdot 10^6\\).", "\\(0{,}00045 = 4{,}5 \\cdot 10^{-4}\\).", "\\(34 \\cdot 10^5 = 3{,}4 \\cdot 10^1 \\cdot 10^5 = 3{,}4 \\cdot 10^6\\)."],
      "\\(52 \\cdot 10^{-5}\\) n'est pas en notation scientifique : 52 n'est pas entre 1 et 10."],
    scicalc: ["Calculer en notation scientifique", "On traite séparément les nombres devant et les puissances de 10.",
      "Produit : on multiplie les nombres devant et on additionne les exposants. Quotient : on divise les nombres et on soustrait les exposants. À la fin, on remet le nombre devant entre 1 et 10, en corrigeant l'exposant.",
      ["\\((3 \\cdot 10^4) \\cdot (2 \\cdot 10^5) = 6 \\cdot 10^9\\).", "\\((5 \\cdot 10^6) \\cdot (4 \\cdot 10^2) = 20 \\cdot 10^8 = 2 \\cdot 10^9\\).", "\\(\\frac{4 \\cdot 10^3}{8 \\cdot 10^{-2}} = 0{,}5 \\cdot 10^5 = 5 \\cdot 10^4\\)."],
      "Si le nombre devant grandit (20 au lieu de 2), l'exposant diminue d'autant, et inversement."],
    pyth: ["Théorème de Pythagore", "Dans un triangle rectangle, le carré de l'hypoténuse vaut la somme des carrés des deux autres côtés.",
      "L'hypoténuse est le plus grand côté, en face de l'angle droit. Pour la trouver : on additionne les carrés des cathètes, puis on prend la racine. Pour trouver une cathète : on soustrait les carrés. La réponse exacte s'écrit souvent \\(a\\sqrt{b}\\).",
      ["Cathètes 6 et 8 : \\(c^2 = 36 + 64 = 100\\), \\(c = 10\\).", "Hypoténuse 13, cathète 5 : \\(b^2 = 169 - 25 = 144\\), \\(b = 12\\).", "Cathètes 2 et 4 : \\(c = \\sqrt{20} = 2\\sqrt{5}\\)."],
      "On additionne les carrés, pas les côtés : \\(6 + 8 = 14\\) n'est pas l'hypoténuse."],
    pythfig: ["Pythagore dans les figures", "Le triangle rectangle est souvent caché.",
      "Diagonale d'un rectangle : les deux côtés et la diagonale. Hauteur d'un triangle isocèle : elle coupe la base en son milieu. Grande diagonale d'un pavé : \\(d^2 = a^2 + b^2 + c^2\\). Pyramide : la hauteur, le demi-côté et l'apothème (ou la demi-diagonale et l'arête) forment un triangle rectangle.",
      ["Rectangle 9 × 12 : \\(d = \\sqrt{81 + 144} = 15\\).", "Isocèle 10, 10, base 12 : \\(h = \\sqrt{100 - 36} = 8\\).", "Pavé 2 × 3 × 6 : \\(d = \\sqrt{4 + 9 + 36} = 7\\)."],
      "Dans le triangle isocèle, on prend la <b>demi</b>-base."],
    pythrec: ["La réciproque de Pythagore", "Pythagore sert aussi à savoir si un triangle est rectangle.",
      "On calcule le carré du plus grand côté et la somme des carrés des deux autres. S'ils sont égaux, le triangle est rectangle (réciproque) ; sinon, il ne l'est pas. C'est le principe de l'équerre des maçons : 3, 4, 5 (ou 60, 80, 100 cm).",
      ["5, 12, 13 : \\(25 + 144 = 169 = 13^2\\), rectangle.", "5, 7, 9 : \\(25 + 49 = 74 \\neq 81\\), pas rectangle.", "1,5 ; 2 ; 2,5 : \\(2{,}25 + 4 = 6{,}25\\), rectangle."],
      "Une égalité « presque » vraie ne suffit pas : 74 et 81, ce n'est pas égal."],
    vol: ["Volumes des prismes et cylindres", "Volume = aire de la base × hauteur.",
      "On empile des couches identiques à la base. Pavé : \\(a \\cdot b \\cdot c\\). Prisme : aire du triangle (ou du trapèze) de base × longueur. Cylindre : \\(\\pi r^2 h\\). Contenances : \\(1\\ \\text{L} = 1\\ \\text{dm}^3 = 1000\\ \\text{cm}^3\\), \\(1\\ \\text{cL} = 10\\ \\text{cm}^3\\).",
      ["Pavé 4 × 3 × 3 : 12 cubes par couche, 3 couches, \\(36\\ \\text{cm}^3\\).", "Prisme de base triangulaire (base 6, hauteur 4), long de 10 : \\(12 \\cdot 10 = 120\\).", "Cylindre \\(r = 3\\), \\(h = 5\\) : \\(45\\pi \\approx 141{,}4\\)."],
      "\\(2\\pi r h\\) est l'aire latérale du cylindre, pas son volume."],
    volcone: ["Pyramide, cône, boule", "Une pyramide vaut le tiers du prisme de même base et même hauteur.",
      "Pyramide et cône : \\(V = \\frac{1}{3} \\cdot A_{\\text{base}} \\cdot h\\). Boule : \\(V = \\frac{4}{3}\\pi r^3\\). Sphère (la surface) : \\(A = 4\\pi r^2\\). Si toutes les longueurs sont multipliées par \\(k\\), le volume est multiplié par \\(k^3\\).",
      ["Pyramide base 6 × 6, hauteur 5 : \\(\\frac{36 \\cdot 5}{3} = 60\\).", "Cône \\(r = 3\\), \\(h = 4\\) : \\(12\\pi\\).", "Boule \\(r = 3\\) : \\(36\\pi\\)."],
      "Avec un diamètre, on prend d'abord la moitié pour avoir le rayon."],
    airepyr: ["Aire d'une pyramide", "Les faces latérales sont des triangles ; leur hauteur est l'apothème.",
      "Pyramide régulière à base carrée de côté \\(c\\) et d'apothème \\(a\\) : aire latérale \\(4 \\cdot \\frac{c \\cdot a}{2} = 2ca\\) ; aire totale \\(c^2 + 2ca\\). L'apothème se calcule avec Pythagore : \\(a^2 = h^2 + \\left(\\frac{c}{2}\\right)^2\\).",
      ["\\(c = 6\\), \\(h = 4\\) : \\(a = 5\\), aire latérale \\(60\\).", "\\(c = 10\\), \\(h = 12\\) : \\(a = 13\\), aire totale \\(100 + 260 = 360\\)."],
      "La hauteur des faces est l'apothème, pas la hauteur de la pyramide."],
    volcomp: ["Solides composés", "On découpe en solides simples.",
      "On repère les solides (cube, pyramide, cylindre, cône, demi-boule), on calcule chaque volume avec ses propres dimensions, puis on additionne (ou on soustrait un trou). On garde \\(\\pi\\) en facteur jusqu'au bout.",
      ["Cube de 3 cm d'arête + pyramide de hauteur 3 : \\(27 + 9 = 36\\).", "Silo : cylindre \\(r = 3\\), \\(h = 10\\) et demi-boule : \\(90\\pi + 18\\pi = 108\\pi\\).", "Cube de 10 cm d'arête percé d'un trou \\(r = 2\\) : \\(1000 - 40\\pi\\)."],
      "Dans une gélule, la partie cylindrique est plus courte que la gélule : on retire deux rayons."],
    volmanq: ["Retrouver une dimension", "Une formule de volume est une équation.",
      "On écrit la formule, on remplace ce qu'on connaît, puis on isole la dimension cherchée. Pour un cône ou une pyramide, n'oublie pas le facteur 3 ; pour un rayon, on termine par une racine (carrée ou cubique).",
      ["Cylindre \\(r = 3\\), \\(V = 36\\pi\\) : \\(9h = 36\\), \\(h = 4\\).", "Cône \\(r = 3\\), \\(V = 18\\pi\\) : \\(\\frac{9h}{3} = 18\\), \\(h = 6\\).", "Boule \\(V = 36\\pi\\) : \\(r^3 = 27\\), \\(r = 3\\)."],
      "Convertis d'abord : 1 L = 1000 cm³."],
  };
  for (const [id, v] of Object.entries(R2)) LESSONS[id] = L_(...v);

  // ---------- outils ----------
  const nb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const fr = (n, d) => { const g = gcd(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n).replace("-", "−") : String(n).replace("-", "−") + "/" + d; };
  const SUP = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
  const sup = (n) => String(n).split("").map((c) => SUP[c] || c).join("");
  const ok = (good, low) => (good ? '<b class="act-ok">✓ égalité</b>' : low ? "trop petit" : "trop grand");
  const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;
  // Chercheur : un curseur, l'affichage calculé en direct ; chaque défi vérifie la valeur.
  // Commentaire testeur du 17.11 : « les manipulations où on ne fait que toucher des curseurs n'apportent pas grand-chose ».
  // Mode réponse (o.ask) : l'élève calcule et tape sa réponse ; la figure se met à jour seulement après « Vérifier ».
  // Le curseur reste pour les vraies manipulations (colorier, descendre l'escalier) : o.ask absent.
  // o et mk gardés sur la fonction : actPrep (active.js) peut ne garder que 2 questions (22.11).
  const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });
  const hunt0 = (o) => (box, onWin) => {
    let x = o.ask ? null : o.start, step = 0;
    const draw = () => {
      const s = Math.min(step, o.wins.length - 1), fig = x === null ? (o.blank ? o.blank(s) : "") : o.show(x, s);
      const ctl = o.ask ? (actAnswerHtml(o.label || "Ta réponse"))
        : actStepper(o.label || "x", nb(x), "x");
      box.innerHTML = fig + ctl + (o.note ? `<div class="small muted">${o.note}</div>` : "");
      if (o.ask) {
        const inp = box.querySelector(".act-in"); if (x !== null) inp.value = nb(x).replace("−", "-"); const go = () => { const v = Number(String(inp.value).replace(/,/g, ".").replace("−", "-").replace(/\s/g, "").replace(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/, (s, u, w) => String(u / w))); if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre."); return; } x = v; draw(); if (!check()) $hint(box, o.miss || (box.querySelector("svg.fig") ? "Pas encore : regarde la figure, puis recalcule." : "Pas encore : relis les calculs affichés, puis recalcule.")); };
        actAnswerBind(box, go);
      } else box.querySelectorAll('[data-st="x"]').forEach((b) => (b.onclick = () => { x = Math.max(o.min, Math.min(o.max, +(x + +b.dataset.d * (o.step || 1)).toFixed(6))); draw(); check(); }));
    };
    const check = () => { if (step >= o.wins.length) return false; const m = o.wins[step](x); if (m) { onWin(step, m); step++; if (o.ask) x = null; draw(); return true; } return false; };
    draw();
  };
  // Pyramide à base carrée (commentaire 👎 du 21.11 : la leçon n'avait aucune figure) : hauteur, demi-côté et apothème en triangle rectangle.
  const pyrFig = (c, h, a) => {
    const A = [40, 190], B = [210, 190], C = [270, 140], D = [100, 140], O = [155, 165], S = [155, 40], Mx = [125, 190];
    const L = (p, q, cls, ex = "") => `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" class="${cls}" ${ex}/>`;
    const T = (x, y, t, ex = "") => `<text x="${x}" y="${y}" class="f-txt" font-size="13" ${ex}>${t}</text>`;
    let g = `<path d="M${A} L${B} L${C} L${D} Z" class="f-soft"/>`;
    g += L(A, D, "f-line", 'stroke-dasharray="4 3"') + L(D, C, "f-line", 'stroke-dasharray="4 3"') + L(S, D, "f-line", 'stroke-dasharray="4 3"');
    g += L(A, B, "f-line") + L(B, C, "f-line") + L(S, A, "f-line") + L(S, B, "f-line") + L(S, C, "f-line");
    g += L(S, O, "f-line", 'stroke-dasharray="5 3" style="stroke:var(--margin)" stroke-width="2"') + L(O, Mx, "f-line", 'style="stroke:var(--margin)" stroke-width="2"') + L(S, Mx, "f-line", 'style="stroke:var(--blue)" stroke-width="3"');
    g += `<path d="M${O[0]},${O[1] - 9} L${O[0] - 5},${O[1] - 6} L${O[0] - 5},${O[1] + 3}" fill="none" class="f-line" stroke-width="1"/>`;
    g += T(161, 128, "h = " + h, 'style="fill:var(--margin)"') + T(146, 186, c / 2, 'text-anchor="middle" font-size="12" style="fill:var(--margin)"') + T(133, 120, "a = " + (a == null ? "?" : a), 'text-anchor="end" style="fill:var(--blue)" font-weight="700"') + T(125, 210, "côté " + c + " cm", 'text-anchor="middle"');
    return svg(300, 220, g, "pyramide à base carrée : hauteur " + h + ", demi-côté " + c / 2 + ", apothème " + (a == null ? "inconnu" : a));
  };
  const W = (target, msg) => (x) => (Math.abs(x - target) < 1e-9 ? msg : "");
  // Barre de fraction : a/b de la longueur, avec graduations en 1/n
  const bar = (a, b, n, y, cls) => { const x0 = 20, w = 280; let g = `<rect x="${x0}" y="${y}" width="${w}" height="18" class="f-soft" stroke="var(--ink)" stroke-width="1"/><rect x="${x0}" y="${y}" width="${(w * a) / b}" height="18" class="${cls}"/>`;
    if (n && n <= 60) for (let k = 1; k < n; k++) g += `<line x1="${x0 + (w * k) / n}" y1="${y}" x2="${x0 + (w * k) / n}" y2="${y + 18}" class="f-line" stroke-width="0.6"/>`;
    return g; };

  Object.assign(ACTIVE, {
    fracadd: {
      predict: { q: "Combien font 1/4 + 1/6 ?", choices: ["2/10", "5/12", "2/24"], good: 1, why: "Un quart et un sixième ne sont pas des parts de même taille : on les découpe en douzièmes, 3/12 + 2/12 = 5/12. Additionner les dénominateurs donnerait 2/10 = 1/5, moins qu'un quart seul !" },
      defis: ["Trouve le plus petit dénominateur commun de 1/4 et 1/6.", "Même chose pour 2/3 et 3/5.", "Et pour 3/8 et 5/12."],
      play: hunt({ ask: true, label: "Dénominateur commun", start: 2, min: 2, max: 60,
        show: (x, s) => { const [a, b, c, d] = [[1, 4, 1, 6], [2, 3, 3, 5], [3, 8, 5, 12]][s], okb = x % b === 0, okd = x % d === 0;
          return svg(320, 70, bar(a, b, okb ? x : 0, 8, "f-fill") + bar(c, d, okd ? x : 0, 40, "f-fill2"), "deux barres de fraction") +
            `<div class="act-out">${a}/${b} ${okb ? "= <b>" + (a * x) / b + "/" + x + "</b>" : ": " + x + " n'est pas un multiple de " + b}<br>${c}/${d} ${okd ? "= <b>" + (c * x) / d + "/" + x + "</b>" : ": " + x + " n'est pas un multiple de " + d}${okb && okd ? "<br>Somme : " + ((a * x) / b + (c * x) / d) + "/" + x + " = <b>" + fr((a * x) / b + (c * x) / d, x) + "</b>" : ""}</div>`; },
        wins: [W(12, "12 : 3/12 + 2/12 = 5/12. 24 marcherait aussi, mais 12 est le plus petit."), W(15, "15 : 10/15 + 9/15 = 19/15."), W(24, "24 : 9/24 + 10/24 = 19/24. Inutile d'aller jusqu'à 8 · 12 = 96.")] }),
    },
    fracmul: {
      /* 24.11 : la division fait partie de la notion (« multiplier, diviser ») : deux défis courts */
      plus: [{ d: "Calcule \\(\\frac{3}{4} \\div \\frac{1}{8}\\) : combien de huitièmes dans trois quarts ?", ans: 6, ok: "Diviser par 1/8, c'est multiplier par 8 (son inverse) : 3/4 · 8 = 24/4 = 6. Il y a 6 huitièmes dans 3/4.", no: "3/4 = 6/8 : compte les huitièmes." },
        { d: "\\(\\frac{2}{3} \\div \\frac{4}{9} = \\frac{a}{2}\\). Tape \\(a\\).", ans: 3, ok: "On multiplie par l'inverse 9/4 : 2/3 · 9/4 = 18/12 = 3/2.", no: "Multiplie 2/3 par l'inverse de 4/9, puis simplifie." }],
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "On multiplie les numérateurs entre eux et les dénominateurs entre eux. Prendre une fraction d'une fraction, c'est multiplier : « de » veut dire « fois ». Diviser par une fraction, c'est multiplier par son inverse.", exemple: ["Les \\(\\frac{2}{3}\\) de \\(\\frac{3}{4}\\) : \\(\\frac{2}{3} \\cdot \\frac{3}{4} = \\frac{6}{12} = \\frac{1}{2}\\).", "La moitié de \\(\\frac{4}{5}\\) : \\(\\frac{1}{2} \\cdot \\frac{4}{5} = \\frac{4}{10} = \\frac{2}{5}\\).", "Les \\(\\frac{3}{4}\\) de \\(\\frac{2}{5}\\) : \\(\\frac{6}{20} = \\frac{3}{10}\\).", "\\(\\frac{3}{4} \\div \\frac{1}{8} = \\frac{3}{4} \\cdot \\frac{8}{1} = 6\\) ; \\(\\frac{2}{3} \\div \\frac{4}{9} = \\frac{2}{3} \\cdot \\frac{9}{4} = \\frac{3}{2}\\)."], piege: "Pour multiplier, pas de dénominateur commun : on multiplie en haut et en bas." },
      predict: { q: "Les 2/3 de 3/4 d'une tablette de chocolat, c'est…", choices: ["5/7 de la tablette", "1/2 de la tablette", "6/7 de la tablette"], good: 1, why: "On prend 2 tiers d'une part de 3 quarts : 2/3 · 3/4 = 6/12 = 1/2. « De » veut dire « fois »." },
      defis: ["Colorie les 2/3 de 3/4 du carré (règle les lignes).", "Colorie la moitié de 4/5.", "Colorie les 3/4 de 2/5."],
      play: hunt({ label: "Lignes coloriées", start: 0, min: 0, max: 4,
        show: (x, s) => { const [a, b, c, e] = [[3, 4, 2, 3], [4, 5, 1, 2], [2, 5, 3, 4]][s], r = Math.min(x, e), cw = 240 / b, rh = 120 / e; let g = "";
          for (let i = 0; i < b; i++) for (let j = 0; j < e; j++) g += `<rect x="${40 + i * cw}" y="${10 + j * rh}" width="${cw}" height="${rh}" class="${i < a && j < r ? "f-fill" : i < a ? "f-fill2" : "f-soft"}" stroke="var(--ink)" stroke-width="0.8"/>`;
          return svg(320, 140, g, "carré découpé") + `<div class="act-out">${r}/${e} de ${a}/${b} = ${r * a}/${e * b}${r ? " = <b>" + fr(r * a, e * b) + "</b>" : ""} du carré<br><span class="small muted">colonnes coloriées : ${a}/${b} ; cases doublement coloriées : ${r * a} sur ${e * b}</span></div>`; },
        wins: [W(2, "2/3 · 3/4 = 6/12 = 1/2 : numérateurs entre eux, dénominateurs entre eux."), W(1, "1/2 · 4/5 = 4/10 = 2/5."), W(3, "3/4 · 2/5 = 6/20 = 3/10.")] }),
    },
    fracconv: {
      predict: { q: "3/4 s'écrit en nombre décimal…", choices: ["0,34", "0,75", "3,4"], good: 1, why: "3/4, c'est 3 ÷ 4 = 0,75, soit 75 %. La barre de fraction n'est pas une virgule." },
      defis: ["Trouve le pourcentage égal à 3/4.", "Trouve le pourcentage égal à 1/5.", "Trouve le pourcentage qui s'écrit 7/20."],
      play: hunt({ ask: true, label: "Pourcentage", start: 50, min: 0, max: 100, step: 5,
        show: (x) => { let g = ""; for (let k = 0; k < 100; k++) g += `<rect x="${60 + (k % 10) * 20}" y="${4 + Math.floor(k / 10) * 13}" width="19" height="12" class="${k < x ? "f-fill" : "f-soft"}"/>`;
          return svg(320, 136, g, x + " cases sur 100") + `<div class="act-out">${x} % = ${x}/100 = <b>${fr(x, 100)}</b> = ${nb(x / 100)}</div>`; },
        wins: [W(75, "75 % = 75/100 = 3/4 = 0,75."), W(20, "20 % = 20/100 = 1/5 = 0,2."), W(35, "35 % = 35/100 = 7/20 = 0,35 (on simplifie par 5).")] }),
    },
    puiss: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Chaque fois que l'exposant baisse de 1, on divise par \\(a\\). Ainsi \\(a^0 = 1\\) et \\(a^{-n} = \\frac{1}{a^n}\\). Même base : \\(a^m \\cdot a^n = a^{m + n}\\), \\(a^m \\div a^n = a^{m - n}\\) et \\((a^m)^n = a^{m \\cdot n}\\).", exemple: ["\\(2^3 = 8\\), \\(2^2 = 4\\), \\(2^1 = 2\\), \\(2^0 = 1\\)", "\\(2^{-1} = \\frac{1}{2}\\), \\(2^{-3} = \\frac{1}{8}\\)", "\\(2^5 \\cdot 2^3 = 2^8\\), \\(7^9 \\div 7^4 = 7^5\\), \\((5^3)^4 = 5^{12}\\)"], piege: "\\(-3^2 = -9\\) : le carré ne porte que sur 3. Mais \\((-3)^2 = 9\\)." },
      /* 24.11 : règles de calcul et −3², essentielles à la notion, en défis courts */
      plus: [{ d: "\\(2^5 \\cdot 2^3 = 2^n\\). Tape \\(n\\).", ans: 8, ok: "5 facteurs 2, puis 3 autres : 8 facteurs. On garde la base et on additionne les exposants : 2⁸.", no: "Compte les facteurs 2 : 5, puis encore 3." },
        { d: "\\(7^9 \\div 7^4 = 7^n\\). Tape \\(n\\).", ans: 5, ok: "4 facteurs 7 se simplifient : il en reste 9 − 4 = 5. On soustrait les exposants : 7⁵.", no: "Diviser par 7⁴ enlève 4 facteurs 7." },
        { d: "\\((5^3)^4 = 5^n\\). Tape \\(n\\).", ans: 12, ok: "(5³)⁴ = 5³ · 5³ · 5³ · 5³ : 4 fois 3 facteurs, soit 5¹². On multiplie les exposants.", no: "C'est 5³ écrit 4 fois." },
        { d: "Calcule \\(-3^2\\).", ans: -9, ok: "Le carré ne porte que sur 3 : −3² = −(3 · 3) = −9. Avec des parenthèses, (−3)² = 9.", no: "Sans parenthèses, l'exposant ne s'applique pas au signe −." }],
      predict: { q: "Que vaut 2⁻³ ?", choices: ["−8", "1/8", "−6"], good: 1, why: "Chaque fois que l'exposant baisse de 1, on divise par 2 : 2³ = 8, 2² = 4, 2¹ = 2, 2⁰ = 1, 2⁻¹ = 1/2, 2⁻² = 1/4, 2⁻³ = 1/8." },
      defis: ["Descends l'escalier jusqu'à 2⁰. Que vaut-il ?", "Trouve l'exposant qui donne 1/2.", "Trouve l'exposant qui donne 1/8."],
      play: hunt({ label: "Exposant", start: 4, min: -4, max: 6,
        show: (x) => { let rows = ""; for (let n = 6; n >= -4; n--) { const v = n >= 0 ? String(2 ** n) : "1/" + 2 ** -n; rows += `<div style="padding-left:${(6 - n) * 10}px;${n === x ? "font-weight:700;color:var(--blue)" : "opacity:.55"}">2${sup(n)} = ${v}${n > -4 ? ' <span class="small muted">÷ 2 ↓</span>' : ""}</div>`; }
          return `<div class="act-out" style="text-align:left">${rows}</div>`; },
        wins: [W(0, "2⁰ = 1 : c'est 2¹ ÷ 2. Toute puissance d'exposant 0 vaut 1."), W(-1, "2⁻¹ = 1 ÷ 2 = 1/2 : un exposant négatif donne l'inverse."), W(-3, "2⁻³ = 1/2³ = 1/8 : positif, mais plus petit que 1.")] }),
    },
    sci: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "On place la virgule après le premier chiffre non nul : c'est \\(a\\), entre 1 et 10. L'exposant \\(n\\) compte de combien de rangs on a déplacé la virgule : positif pour un nombre plus grand que 10, négatif pour un nombre plus petit que 1.", exemple: ["\\(4\\text{'}500\\text{'}000 = 4{,}5 \\cdot 10^6\\).", "\\(450 = 4{,}5 \\cdot 10^2\\).", "\\(0{,}00052 = 5{,}2 \\cdot 10^{-4}\\)."] },
      predict: { q: "0,00052 en notation scientifique, c'est…", choices: ["5,2 · 10⁴", "5,2 · 10⁻⁴", "52 · 10⁻⁵"], good: 1, why: "La virgule recule de 4 rangs pour arriver à 5,2 : le nombre est plus petit que 1, l'exposant est négatif, −4. 52 · 10⁻⁵ est juste en valeur, mais 52 n'est pas entre 1 et 10." },
      defis: ["Écris 4'500'000 sous la forme 4,5 · 10ⁿ.", "Écris 0,00045 sous la forme 4,5 · 10ⁿ.", "Écris 450 sous la forme 4,5 · 10ⁿ."],
      play: hunt({ ask: true, label: "Exposant n", start: 0, min: -8, max: 9,
        show: (x, s) => { const t = [4500000, 0.00045, 450][s], v = 4.5 * 10 ** x, txt = (y) => (y >= 1 ? String(Math.round(y)).replace(/\B(?=(\d{3})+(?!\d))/g, "'") : y.toFixed(12).replace(/0+$/, "")).replace(".", ",");
          return `<div class="act-out">4,5 · 10${sup(x)} = <b>${txt(v)}</b><br>cible : ${txt(t)} → ${ok(Math.abs(v - t) < 1e-12 * t, v < t)}</div>`; },
        note: "Compte de combien de rangs la virgule se déplace.",
        wins: [W(6, "4'500'000 = 4,5 · 10⁶ : la virgule avance de 6 rangs."), W(-4, "0,00045 = 4,5 · 10⁻⁴ : plus petit que 1, exposant négatif."), W(2, "450 = 4,5 · 10² : deux rangs.")] }),
    },
    scicalc: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Produit : on multiplie les nombres devant et on additionne les exposants. À la fin, on remet le nombre devant entre 1 et 10, en corrigeant l'exposant.", exemple: ["\\((3 \\cdot 10^4) \\cdot (2 \\cdot 10^5) = 6 \\cdot 10^9\\).", "\\((5 \\cdot 10^6) \\cdot (4 \\cdot 10^2) = 20 \\cdot 10^8 = 2 \\cdot 10^9\\)."] },
      predict: { q: "(2 · 10³) · (4 · 10⁵) = ?", choices: ["8 · 10⁸", "8 · 10¹⁵", "6 · 10⁸"], good: 0, why: "On multiplie les nombres (2 · 4 = 8) et on additionne les exposants (3 + 5 = 8) : 10³ · 10⁵, c'est 3 + 5 facteurs 10." },
      defis: ["(3 · 10⁴) · (2 · 10⁵) = 6 · 10ⁿ : trouve n.", "(4 · 10³) ÷ (8 · 10⁻²) = 5 · 10ⁿ : trouve n.", "(5 · 10⁶) · (4 · 10²) = 2 · 10ⁿ : trouve n."],
      play: hunt({ ask: true, label: "n", start: 5, min: -4, max: 14,
        show: (x, s) => { const [lab, m, t] = [["(3 · 10⁴) · (2 · 10⁵)", 6, 6e9], ["(4 · 10³) ÷ (8 · 10⁻²)", 5, 5e4], ["(5 · 10⁶) · (4 · 10²)", 2, 2e9]][s], v = m * 10 ** x;
          return `<div class="act-out">${lab} = ${m} · 10${sup(x)} ? → ${ok(Math.abs(v - t) < 1e-6 * t, v < t)}</div>`; },
        note: "Calcule d'abord avec les nombres, puis avec les exposants ; remets le nombre devant entre 1 et 10.",
        wins: [W(9, "6 · 10⁹ : 3 · 2 = 6 et 4 + 5 = 9."), W(4, "4 ÷ 8 = 0,5 et 3 − (−2) = 5 : 0,5 · 10⁵ = 5 · 10⁴."), W(9, "5 · 4 = 20 et 6 + 2 = 8 : 20 · 10⁸ = 2 · 10⁹.")] }),
    },
    pyth: {
      predict: { q: "Un triangle rectangle a des cathètes de 6 cm et 8 cm. Son hypoténuse mesure…", choices: ["14 cm", "10 cm", "48 cm"], good: 1, why: "6² + 8² = 36 + 64 = 100, et √100 = 10. On additionne les carrés, pas les côtés." },
      defis: ["Cathètes 6 et 8 : calcule l'hypoténuse.", "Cathètes 5 et 12 : calcule l'hypoténuse.", "Hypoténuse 15 et cathète 9 : calcule l'autre cathète."],
      play: hunt({ ask: true, label: "Longueur", start: 7, min: 1, max: 20,
        show: (x, s) => { const [a, b, unk] = [[8, 6, "c"], [12, 5, "c"], [9, x, "b"]][s], k = 11, A = [40, 185], B = [40 + a * k, 185];
          const C = [40, 185 - Math.min(unk === "b" ? x : b, 16) * k], hyp = unk === "c" ? x : 15, real = Math.hypot(B[0] - C[0], B[1] - C[1]) / k, ang = Math.atan2(B[1] - C[1], B[0] - C[0]), tip = [C[0] + Math.cos(ang) * hyp * k, C[1] + Math.sin(ang) * hyp * k];
          const g = `<polyline points="${B.join(",")} ${A.join(",")} ${C.join(",")}" class="f-line" fill="none" stroke-width="2"/><rect x="40" y="173" width="12" height="12" class="f-line" fill="none"/><line x1="${C[0]}" y1="${C[1]}" x2="${tip[0].toFixed(1)}" y2="${tip[1].toFixed(1)}" class="f-accent" stroke-width="3"/>`;
          const lhs = unk === "c" ? a * a + b * b : 81 + x * x, rhs = hyp * hyp;
          return svg(320, 195, g, "triangle rectangle") + `<div class="act-out">${unk === "c" ? a + "² + " + b + "² = " + lhs + " ; " + x + "² = " + rhs : "9² + " + x + "² = " + lhs + " ; 15² = 225"} → ${ok(lhs === rhs, unk === "c" ? rhs < lhs : lhs < rhs)}</div>`; },
        note: "Le trait coloré doit fermer exactement le triangle.",
        wins: [W(10, "6² + 8² = 100 = 10² : l'hypoténuse mesure 10."), W(13, "5² + 12² = 169 = 13²."), W(12, "15² − 9² = 225 − 81 = 144 = 12² : pour une cathète, on soustrait.")] }),
    },
    pythfig: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Diagonale d'un rectangle : les deux côtés et la diagonale forment un triangle rectangle. Grande diagonale d'un pavé : \\(d^2 = a^2 + b^2 + c^2\\).", exemple: ["Rectangle 9 × 12 : \\(d = \\sqrt{81 + 144} = 15\\).", "Pavé 2 × 3 × 6 : \\(d = \\sqrt{4 + 9 + 36} = 7\\)."], piege: "La diagonale est l'hypoténuse : on additionne les carrés, puis on prend la racine." },
      predict: { q: "Un rectangle mesure 9 cm sur 12 cm. Sa diagonale mesure…", choices: ["21 cm", "15 cm", "108 cm"], good: 1, why: "La diagonale coupe le rectangle en deux triangles rectangles : √(81 + 144) = √225 = 15." },
      defis: ["Rectangle 9 × 12 : trouve la diagonale.", "Triangle isocèle de côtés 10, 10 et de base 12 : trouve la hauteur.", "Pavé 2 × 3 × 6 : trouve la grande diagonale."],
      play: hunt({ ask: true, label: "Longueur", start: 5, min: 1, max: 20,
        show: (x, s) => { const L = [["Triangle (9 ; 12 ; diagonale) : 9² + 12² = 225", 225, x * x, "diagonale² = " + x * x], ["Triangle (demi-base 6 ; hauteur ; côté 10) : 6² + h² = " + (36 + x * x), 100, 36 + x * x, "côté² = 100"], ["Pavé : 2² + 3² + 6² = 49", 49, x * x, "diagonale² = " + x * x]][s];
          return `<div class="act-out">${L[0]}<br>${L[3]} → ${ok(L[1] === L[2], L[2] < L[1])}</div>`; },
        wins: [W(15, "√225 = 15."), W(8, "La hauteur coupe la base en deux : 10² − 6² = 64, h = 8."), W(7, "4 + 9 + 36 = 49 = 7² : d = 7.")] }),
    },
    pythrec: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "On calcule le carré du plus grand côté et la somme des carrés des deux autres. S'ils sont égaux, le triangle est rectangle (réciproque) ; sinon, il ne l'est pas.", exemple: ["5, 7, 9 : \\(25 + 49 = 74 \\neq 81\\), pas rectangle.", "6, 8, 10 : \\(36 + 64 = 100 = 10^2\\), rectangle.", "20, 21, 29 : \\(400 + 441 = 841 = 29^2\\), rectangle."] },
      predict: { q: "Un triangle de côtés 5, 7 et 9 est-il rectangle ?", choices: ["Oui", "Non", "On ne peut pas savoir"], good: 1, why: "5² + 7² = 25 + 49 = 74, mais 9² = 81. Pas d'égalité : il n'est pas rectangle." },
      defis: ["Côtés 6, 8 et x (le plus grand) : trouve x pour que le triangle soit rectangle.", "Côtés 7, x et 25 (25 le plus grand) : trouve x.", "Côtés 20, 21 et x (le plus grand) : trouve x."],
      play: hunt({ ask: true, label: "x", start: 10, min: 1, max: 40,
        show: (x, s) => { const [l, r, txt] = [[100, x * x, "6² + 8² = 100 ; x² = " + x * x], [49 + x * x, 625, "7² + x² = " + (49 + x * x) + " ; 25² = 625"], [841, x * x, "20² + 21² = 841 ; x² = " + x * x]][s];
          return `<div class="act-out">${txt} → ${l === r ? '<b class="act-ok">égalité : rectangle</b>' : "pas d'égalité : pas rectangle"}</div>`; },
        wins: [W(10, "6, 8, 10 : rectangle (le double de 3, 4, 5)."), W(24, "7² + 24² = 625 = 25²."), W(29, "20² + 21² = 841 = 29².")] }),
    },
    vol: {
      predict: { q: "Combien de cubes de 1 cm³ faut-il pour remplir un pavé de 4 cm × 3 cm × 2 cm ?", choices: ["9", "24", "14"], good: 1, why: "Une couche de 4 · 3 = 12 cubes, et 2 couches : 24 cm³. Volume = aire de la base × hauteur." },
      defis: ["Base 4 × 3 : combien de couches pour 36 cm³ ?", "Base 5 × 2 : combien de couches pour 70 cm³ ?", "Prisme de base triangulaire d'aire 6 cm² : quelle longueur pour 48 cm³ ?"],
      play: hunt({ ask: true, label: "Couches (hauteur en cm)", start: 1, min: 1, max: 12,
        show: (x, s) => { const [base, lab, t] = [[12, "4 × 3", 36], [10, "5 × 2", 70], [6, "triangle de 6 cm²", 48]][s]; let g = "";
          for (let k = 0; k < x; k++) g += `<rect x="${60 + k * 3}" y="${118 - k * 9}" width="160" height="9" class="${k % 2 ? "f-fill2" : "f-fill"}" stroke="var(--ink)" stroke-width="0.6"/>`;
          return svg(320, 132, g, x + " couches") + `<div class="act-out">base ${lab} = ${base} cm² ; ${base} · ${x} = <b>${base * x} cm³</b> (cible ${t}) → ${ok(base * x === t, base * x < t)}</div>`; },
        wins: [W(3, "12 · 3 = 36 cm³."), W(7, "10 · 7 = 70 cm³."), W(8, "6 · 8 = 48 cm³ : même règle pour un prisme, aire de la base × longueur.")] }),
    },
    volcone: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Pyramide et cône : \\(V = \\frac{1}{3} \\cdot A_{\\text{base}} \\cdot h\\) : il en faut 3 pour remplir le prisme (ou le cylindre) de même base et de même hauteur. Deux fois moins haut : deux fois moins de volume. Boule de rayon \\(r\\) : \\(V = \\frac{4}{3}\\pi r^3\\).", exemple: ["Pyramide base 6 × 6, hauteur 5 : \\(\\frac{36 \\cdot 5}{3} = 60\\).", "Cône \\(r = 3\\), \\(h = 4\\) : \\(\\frac{9\\pi \\cdot 4}{3} = 12\\pi\\).", "Cônes deux fois moins hauts : 6 pour remplir le cylindre.", "Boule de rayon 3 : \\(V = \\frac{4}{3}\\pi \\cdot 27 = 36\\pi\\)."], piege: "N'oublie pas le facteur \\(\\frac{1}{3}\\) (et \\(\\frac{4}{3}\\) pour la boule)." },
      /* 24.11 : la boule fait partie de la notion (« Pyramide, cône, boule ») */
      plus: [{ d: "Une boule de rayon 3 cm a pour volume \\(V = \\frac{4}{3}\\pi r^3 = k\\pi\\ \\text{cm}^3\\). Tape \\(k\\).", ans: 36, ok: "r³ = 27, et 4/3 · 27 = 36 : V = 36π cm³, environ 113 cm³.", no: "Calcule d'abord r³ = 3 · 3 · 3, puis multiplie par 4/3." }],
      predict: { q: "Combien de pyramides (même base, même hauteur) faut-il pour remplir un prisme ?", choices: ["2", "3", "4"], good: 1, why: "Une pyramide vaut exactement le tiers du prisme de même base et même hauteur : V = ⅓ · base · hauteur." },
      defis: ["Combien de cônes (même base, même hauteur) pour remplir le cylindre ?", "Combien de pyramides (même base, même hauteur) pour remplir le pavé ?", "Des cônes de même base, mais deux fois moins hauts : combien pour le cylindre ?"],
      play: hunt({ ask: true, label: "Nombre de solides versés", start: 1, min: 1, max: 8,
        show: (x, s) => { const d = s === 2 ? 6 : 3, pyr = s === 1, H = 100, hc = s === 2 ? H / 2 : H, lvl = Math.min(x / d, 1) * H, over = x > d, y0 = 125;
          let g = `<text x="70" y="14" class="f-txt" text-anchor="middle" font-size="12">1 ${pyr ? "pyramide" : "cône"}</text>`;
          g += pyr ? `<polygon points="30,${y0} 110,${y0} 70,${y0 - hc}" class="f-fill"/><polygon points="30,${y0} 110,${y0} 125,${y0 - 12} 70,${y0 - hc}" class="f-shape2" fill-opacity=".35"/>` : `<ellipse cx="70" cy="${y0}" rx="40" ry="9" class="f-fill"/><polygon points="30,${y0} 110,${y0} 70,${y0 - hc}" class="f-fill"/>`;
          g += `<text x="225" y="14" class="f-txt" text-anchor="middle" font-size="12">${pyr ? "pavé" : "cylindre"} (même base, hauteur ${s === 2 ? "double" : "égale"})</text>`;
          g += pyr ? `<rect x="185" y="${y0 - H}" width="80" height="${H}" class="f-soft" stroke="var(--ink)"/><rect x="185" y="${(y0 - lvl).toFixed(1)}" width="80" height="${lvl.toFixed(1)}" class="f-fill" fill-opacity=".8"/>`
            : `<rect x="185" y="${y0 - H}" width="80" height="${H}" class="f-soft"/><rect x="185" y="${(y0 - lvl).toFixed(1)}" width="80" height="${lvl.toFixed(1)}" class="f-fill" fill-opacity=".8"/><ellipse cx="225" cy="${y0 - H}" rx="40" ry="8" class="f-shape2"/><path d="M185 ${y0 - H} V${y0} A40 8 0 0 0 265 ${y0} V${y0 - H}" class="f-line" fill="none"/>`;
          for (let k = 1; k < d; k++) g += `<line x1="180" y1="${y0 - (k * H) / d}" x2="270" y2="${y0 - (k * H) / d}" class="f-line" stroke-dasharray="3 3" stroke-width=".6"/>`;
          return svg(320, 140, g, "solide versé dans le récipient") + `<div class="act-out">${x} ${pyr ? "pyramide" : "cône"}${x > 1 ? "s" : ""} versé${x > 1 ? "s" : ""} : ${fr(Math.min(x, 99), d)} du ${pyr ? "pavé" : "cylindre"} → ${x === d ? '<b class="act-ok">plein exactement</b>' : over ? "ça déborde" : "pas encore plein"}</div>`; },
        blank: (s) => `<div class="small muted">${["Imagine qu'on remplit un cône d'eau et qu'on le verse dans le cylindre.", "Même expérience avec une pyramide et un pavé.", "Cette fois, les cônes sont deux fois moins hauts que le cylindre."][s]}</div>`,
        wins: [W(3, "3 cônes : un cône vaut le tiers du cylindre, V = ⅓ π r² h."), W(3, "3 pyramides : V = ⅓ · base · hauteur."), W(6, "Deux fois moins haut, deux fois moins de volume : chaque cône vaut 1/6 du cylindre.")] }),
    },
    airepyr: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Pyramide régulière à base carrée de côté \\(c\\) : la hauteur \\(h\\), le demi-côté \\(\\frac{c}{2}\\) et l'apothème \\(a\\) (la hauteur d'une face) forment un triangle rectangle : \\(a^2 = h^2 + \\left(\\frac{c}{2}\\right)^2\\). Aire latérale : 4 triangles de base \\(c\\) et de hauteur \\(a\\) ; aire totale : on ajoute la base \\(c^2\\).", exemple: ["\\(c = 6\\), \\(h = 4\\) : \\(a = \\sqrt{16 + 9} = 5\\).", "\\(c = 10\\), \\(h = 12\\) : \\(a = \\sqrt{144 + 25} = 13\\).", "\\(c = 6\\), \\(a = 5\\) : aire latérale \\(4 \\cdot \\frac{6 \\cdot 5}{2} = 60\\), aire totale \\(60 + 36 = 96\\)."] },
      /* 24.11 : aire latérale et aire totale (notion « Aire d'une pyramide, apothème ») */
      plus: [{ d: "Pyramide du « Devine » : base carrée de 6 cm, apothème 5 cm. Aire latérale (les 4 faces triangulaires), en cm² ?", ans: 60, ok: "Une face : 6 · 5 ÷ 2 = 15 cm². Quatre faces : 4 · 15 = 60 cm². L'apothème est la hauteur de chaque face.", no: "Chaque face est un triangle de base 6 et de hauteur 5 (l'apothème)." },
        { d: "Même pyramide : aire totale (avec la base), en cm² ?", ans: 96, ok: "Aire latérale 60 cm², plus la base 6 · 6 = 36 cm² : 96 cm².", no: "Ajoute l'aire de la base carrée à l'aire latérale." }],
      predict: { q: "Une pyramide à base carrée de 6 cm a une hauteur de 4 cm. Son apothème a (la hauteur d'une face triangulaire, en bleu) mesure…", fig: pyrFig(6, 4), choices: ["4 cm", "5 cm", "7 cm"], good: 1, why: "Hauteur, demi-côté et apothème forment un triangle rectangle : √(4² + 3²) = √25 = 5. L'apothème est plus long que la hauteur." },
      // Défis (22.11) : même tâche à chaque fois (trouver l'apothème), sans reprendre la pyramide du « Devine » ; l'aire latérale n'apparaît qu'une fois l'apothème juste.
      defis: ["Nouvelle pyramide : base 10 cm, hauteur 12 cm. Tape l'apothème.", "Base 16 cm, hauteur 6 cm. Tape l'apothème.", "Base 8 cm, hauteur 3 cm. Tape l'apothème."],
      play: hunt({ ask: true, label: "Apothème", start: 3, min: 1, max: 20,
        blank: (s) => { const [c, h] = [[10, 12], [16, 6], [8, 3]][s]; return pyrFig(c, h); },
        show: (x, s) => { const [c, h] = [[10, 12], [16, 6], [8, 3]][s], t = h * h + (c / 2) ** 2;
          return pyrFig(c, h, x) + `<div class="act-out">hauteur² + demi-côté² = ${h}² + ${c / 2}² = ${t} ; apothème² = ${x}² = ${x * x} → ${ok(t === x * x, x * x < t)}${t === x * x ? `<br>aire latérale : 4 · (${c} · ${x}) ÷ 2 = <b>${2 * c * x} cm²</b>` : ""}</div>`; },
        note: "Sous l'apothème, il y a le demi-côté de la base.",
        wins: [W(13, "√(144 + 25) = 13 ; aire latérale 2 · 10 · 13 = 260 cm²."), W(10, "√(36 + 64) = 10 ; aire latérale 2 · 16 · 10 = 320 cm²."), W(5, "√(9 + 16) = 5 ; aire latérale 2 · 8 · 5 = 80 cm².")] }),
    },
    volcomp: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "On repère les solides, on calcule chaque volume avec ses propres dimensions, puis on additionne. On garde \\(\\pi\\) en facteur jusqu'au bout.", exemple: ["Cube de 3 cm d'arête + pyramide de hauteur 3 : \\(27 + 9 = 36\\).", "Pour 39 en tout : pyramide de \\(39 - 27 = 12\\), donc \\(\\frac{9h}{3} = 12\\), \\(h = 4\\).", "Cylindre \\(r = 1\\), \\(h = 4\\) (\\(4\\pi\\)) + cône : \\(\\frac{\\pi h}{3} = 2\\pi\\), \\(h = 6\\)."], piege: "Le cône ou la pyramide n'a que le tiers du volume d'un cylindre ou d'un prisme de même base et de même hauteur." },
      predict: { q: "Un cube de 3 cm d'arête est surmonté d'une pyramide de même base, haute de 3 cm. Volume total du solide ?", choices: ["36 cm³", "54 cm³", "30 cm³"], good: 0, why: "Cube : 3 · 3 · 3 = 27. Pyramide : ⅓ · 9 · 3 = 9. Total : 36 cm³. On additionne les volumes des parties." },
      defis: ["On change la hauteur de la pyramide (même cube de 3 cm d'arête). Quelle hauteur donne 39 cm³ en tout ?", "Même cube : quelle hauteur de pyramide donne 45 cm³ en tout ?", "Cylindre (r = 1, h = 4) et cône de même base : quelle hauteur de cône pour 6π en tout ?"],
      play: hunt({ ask: true, label: "Hauteur du toit", start: 1, min: 1, max: 12,
        show: (x, s) => { if (s < 2) { const v = 27 + 3 * x, t = s ? 45 : 39; return `<div class="act-out">cube 27 + pyramide ⅓ · 9 · ${x} = 27 + ${3 * x} = <b>${v} cm³</b> (cible ${t}) → ${ok(v === t, v < t)}</div>`; }
          const v = 4 + x / 3; return `<div class="act-out">cylindre 4π + cône ⅓ · π · 1² · ${x} = <b>${nb(v)}π</b> (cible 6π) → ${ok(Math.abs(v - 6) < 1e-9, v < 6)}</div>`; },
        wins: [W(4, "27 + ⅓ · 9 · 4 = 27 + 12 = 39."), W(6, "27 + 18 = 45 : chaque cm de pyramide ajoute 3 cm³."), W(6, "4π + 2π = 6π : le cône de hauteur 6 vaut un cylindre de hauteur 2.")] }),
    },
    volmanq: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "On écrit la formule, on remplace ce qu'on connaît, puis on isole la dimension cherchée.", exemple: ["Cylindre \\(r = 3\\), \\(V = 36\\pi\\) : \\(9\\pi h = 36\\pi\\), \\(h = 4\\).", "Pavé de base 5 × 4, \\(V = 140\\) : \\(20h = 140\\), \\(h = 7\\)."], piege: "\\(\\pi \\cdot 3^2 \\cdot h = 36\\pi\\) : on divise par \\(9\\pi\\), pas par 3." },
      predict: { q: "Un cylindre de rayon 3 cm a un volume de 36π cm³. Sa hauteur mesure…", choices: ["4 cm", "12 cm", "6 cm"], good: 0, why: "π · 3² · h = 36π, donc 9h = 36 et h = 4. On remplace ce qu'on connaît, puis on isole h." },
      defis: ["Cylindre de rayon 3 et de volume 36π : calcule la hauteur.", "Cône de rayon 3 et de volume 18π : calcule la hauteur.", "Pavé de base 5 × 4 et de volume 140 cm³ : calcule la hauteur."],
      play: hunt({ ask: true, label: "Hauteur", start: 1, min: 1, max: 12,
        show: (x, s) => { const [lab, v, t] = [["π · 3² · " + x, 9 * x, 36], ["⅓ · π · 3² · " + x, 3 * x, 18], ["5 · 4 · " + x, 20 * x, 140]][s];
          return `<div class="act-out">${lab} = <b>${v}${s < 2 ? "π" : ""}</b> (cible ${t}${s < 2 ? "π" : ""}) → ${ok(v === t, v < t)}</div>`; },
        wins: [W(4, "9h = 36, h = 4."), W(6, "3h = 18, h = 6 : le facteur ⅓ du cône compte."), W(7, "20h = 140, h = 7.")] }),
    },
  });
})();

// Chantier 11e (19.11, « on se concentre sur la 11e ») : leçons actives (devine / manipule / retiens) pour les 14
// notions de 11e qui n'en avaient pas : rel, fracops, rac, angles, cercthales, thales, thalesrec, repere, tabval, simil,
// denombr, proba, et les révisions de 10e carres, pctvar. Même moteur que act_ch11b.js (outils recopiés : chaque fichier reste autonome). Réponses entières ;
// mode « réponse » (l'élève calcule et tape) sauf vraies manipulations (agrandir un carré, un rapport k).
(function () {
  // ---------- outils ----------
  const nb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const fr = (n, d) => { const g = gcd(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n).replace("-", "−") : String(n).replace("-", "−") + "/" + d; };
  const SUP = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
  const sup = (n) => String(n).split("").map((c) => SUP[c] || c).join("");
  const ok = (good, low) => (good ? '<b class="act-ok">✓ égalité</b>' : low ? "trop petit" : "trop grand");
  const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;
  // Chercheur : un curseur, l'affichage calculé en direct ; chaque défi vérifie la valeur.
  // Commentaire testeur du 17.11 : « les manipulations où on ne fait que toucher des curseurs n'apportent pas grand-chose ».
  // Mode réponse (o.ask) : l'élève calcule et tape sa réponse ; la figure se met à jour seulement après « Vérifier ».
  // Le curseur reste pour les vraies manipulations (colorier, descendre l'escalier) : o.ask absent.
  // o et mk gardés sur la fonction : actPrep (active.js) peut ne garder que 2 questions (22.11).
  const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });
  const hunt0 = (o) => (box, onWin) => {
    let x = o.ask ? null : o.start, step = 0;
    const draw = () => {
      const s = Math.min(step, o.wins.length - 1), fig = x === null ? (o.blank ? o.blank(s) : "") : o.show(x, s);
      const ctl = o.ask ? (actAnswerHtml(o.label || "Ta réponse"))
        : actStepper(o.label || "x", nb(x), "x");
      box.innerHTML = fig + ctl + (o.note ? `<div class="small muted">${o.note}</div>` : "");
      if (o.ask) {
        const inp = box.querySelector(".act-in"); if (x !== null) inp.value = nb(x).replace("−", "-"); const go = () => { const v = Number(String(inp.value).replace(/,/g, ".").replace("−", "-").replace(/\s/g, "").replace(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/, (s, u, w) => String(u / w))); if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre."); return; } x = v; draw(); if (!check()) $hint(box, o.miss || (box.querySelector("svg.fig") ? "Pas encore : regarde la figure, puis recalcule." : "Pas encore : relis les calculs affichés, puis recalcule.")); };
        actAnswerBind(box, go);
      } else box.querySelectorAll('[data-st="x"]').forEach((b) => (b.onclick = () => { x = Math.max(o.min, Math.min(o.max, +(x + +b.dataset.d * (o.step || 1)).toFixed(6))); draw(); check(); }));
    };
    const check = () => { if (step >= o.wins.length) return false; const m = o.wins[step](x); if (m) { onWin(step, m); step++; if (o.ask) x = null; draw(); return true; } return false; };
    draw();
  };
  const W = (target, msg) => (x) => (Math.abs(x - target) < 1e-9 ? msg : "");
  // Barre de fraction : a/b de la longueur, avec graduations en 1/n
  const bar = (a, b, n, y, cls) => { const x0 = 20, w = 280; let g = `<rect x="${x0}" y="${y}" width="${w}" height="18" class="f-soft" stroke="var(--ink)" stroke-width="1"/><rect x="${x0}" y="${y}" width="${(w * a) / b}" height="18" class="${cls}"/>`;
    if (n && n <= 60) for (let k = 1; k < n; k++) g += `<line x1="${x0 + (w * k) / n}" y1="${y}" x2="${x0 + (w * k) / n}" y2="${y + 18}" class="f-line" stroke-width="0.6"/>`;
    return g; };
  const T = (x, y, s, a = "middle", sz = 12, cls = "f-txt") => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${a}" font-size="${sz}">${s}</text>`;
  const L = (x1, y1, x2, y2, cls = "f-line", w = 1.6) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" stroke-width="${w}"/>`;
  // Droite graduée de −12 à 12, avec un départ et une arrivée.
  const line = (from, to) => { const X = (v) => 160 + v * 12; let g = L(10, 30, 310, 30); for (let v = -12; v <= 12; v++) g += L(X(v), 26, X(v), 34, "f-line", v % 5 ? 0.6 : 1.2) + (v % 5 ? "" : T(X(v), 50, String(v).replace("-", "−"), "middle", 10));
    if (from !== null) g += `<circle cx="${X(from)}" cy="30" r="5" class="f-dot"/>`; if (to !== null && Math.abs(to) <= 12) g += `<path d="M${X(from)},22 Q${(X(from) + X(to)) / 2},2 ${X(to)},22" class="f-accent" fill="none" stroke-width="2"/><circle cx="${X(to)}" cy="30" r="5" class="f-accent"/>`;
    return svg(320, 58, g, "droite graduée"); };
  // Configuration de Thalès schématique (étiquettes de longueurs).
  const thal = (k, labs) => { const A = [30, 120], B = [290, 140], C = [230, 20], D = [A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k], E = [A[0] + (C[0] - A[0]) * k, A[1] + (C[1] - A[1]) * k];
    let g = `<polygon points="${A} ${B} ${C}" class="f-shape"/>` + L(D[0], D[1], E[0], E[1], "f-accent", 2.4) + T(A[0] - 10, A[1] + 4, "A") + T(B[0] + 8, B[1] + 4, "B") + T(C[0] + 8, C[1], "C") + T(D[0], D[1] + 16, "D") + T(E[0] - 8, E[1] - 6, "E");
    const mid = (P, Q, dy) => [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2 + dy];
    for (const [k2, P, Q, dy] of [["AD", A, D, 16], ["DB", D, B, 16], ["AE", A, E, -8], ["EC", E, C, -8], ["DE", D, E, 0], ["BC", B, C, 0]]) if (labs[k2]) { const [x, y] = mid(P, Q, dy); g += T(x + (k2 === "DE" || k2 === "BC" ? 14 : 0), y, labs[k2], "middle", 12, /\?/.test(labs[k2]) ? "f-txt f-accent" : "f-txt"); }
    return svg(320, 160, g, "configuration de Thalès"); };
  const plain = (html) => `<div class="act-out">${html}</div>`;

  Object.assign(ACTIVE, {
    rel: {
      predict: { q: "Combien font (−5) − (−8) ?", choices: ["−13", "3", "−3"], good: 1, why: "Soustraire −8, c'est ajouter 8 : −5 + 8 = 3. Sur la droite, on part de −5 et on avance de 8." },
      defis: ["Calcule (−5) − (−8).", "Calcule −7 + 4.", "Calcule (−3) · (−4)."],
      play: hunt({ ask: true, label: "Résultat",
        blank: (s) => line([-5, -7, -3][s], null),
        show: (x, s) => line([-5, -7, -3][s], x) + plain(["−5 − (−8) = −5 + 8", "−7 + 4 : signes contraires, 7 − 4 = 3, signe de −7", "(−3) · (−4) : même signe → positif, 3 · 4"][s] + " → tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(3, "Soustraire un négatif, c'est ajouter son opposé : −5 + 8 = 3."), W(-3, "On recule de 7 puis on avance de 4 : on arrive à −3."), W(12, "Moins fois moins donne plus : (−3) · (−4) = 12.")] }),
    },
    fracops: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "On détermine le signe, puis on calcule. Un nombre pair de signes − donne un résultat positif, un nombre impair un résultat négatif. Multiplier : numérateurs entre eux, dénominateurs entre eux. Diviser : multiplier par l'inverse.", exemple: ["\\(\\left(-\\frac{3}{4}\\right) \\cdot 8 = -6\\)", "\\(\\left(-\\frac{6}{5}\\right) : \\left(-\\frac{3}{10}\\right) = \\frac{6}{5} \\cdot \\frac{10}{3} = 4\\)"], piege: "Trois facteurs négatifs donnent un résultat négatif : \\(\\left(-\\frac{2}{3}\\right) \\cdot \\left(-\\frac{3}{4}\\right) \\cdot \\left(-\\frac{1}{2}\\right) = -\\frac{1}{4}\\)." },
      predict: { q: "Quel est le signe de (−2/3) · (−3/4) · (−1/2) ?", choices: ["positif", "négatif"], good: 1, why: "Trois facteurs négatifs : un nombre impair de signes − donne un résultat négatif (ici −1/4)." },
      defis: ["Calcule (−3/4) · 8.", "Calcule 1/2 − 3/4 · 2/3.", "Calcule (−6/5) : (−3/10)."],
      play: hunt({ ask: true, label: "Résultat (entier)",
        show: (x, s) => plain(["(−3/4) · 8 = −(3 · 8)/4 = −24/4", "3/4 · 2/3 d'abord (priorité) = 6/12 = 1/2, puis 1/2 − 1/2", "(−6/5) · (−10/3) (on multiplie par l'inverse) = 60/15"][s] + "<br>tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(-6, "−24/4 = −6 : négatif fois positif donne négatif."), W(0, "La multiplication passe avant : 1/2 − 1/2 = 0."), W(4, "Diviser, c'est multiplier par l'inverse : (−6/5) · (−10/3) = 60/15 = 4, positif.")] }),
    },
    rac: {
      predict: { q: "Combien vaut √(9 + 16) ?", choices: ["7", "5", "25"], good: 1, why: "On calcule d'abord sous la racine : √25 = 5. Ce n'est pas √9 + √16 = 3 + 4 = 7 !" },
      defis: ["Agrandis le carré jusqu'à une aire de 49.", "Puis jusqu'à une aire de 81.", "Trouve le plus grand côté entier dont l'aire reste sous 50 (√50 est entre … et …)."],
      play: hunt({ label: "Côté", start: 1, min: 1, max: 10,
        show: (x, s) => { const u = 13; let g = ""; for (let i = 0; i < x; i++) for (let j = 0; j < x; j++) g += `<rect x="${30 + i * u}" y="${5 + j * u}" width="${u}" height="${u}" class="${x * x > 50 && s === 2 ? "f-fill2" : "f-fill"}" stroke="var(--ink)" stroke-width="0.4"/>`;
          return svg(320, 140, g, "carré de côté " + x) + plain("côté " + x + " → aire " + x + "² = <b>" + x * x + "</b>" + (s === 2 ? (x * x < 50 ? " (sous 50)" : " (dépasse 50)") : "")); },
        wins: [W(7, "Côté 7 : 7² = 49, donc √49 = 7."), W(9, "√81 = 9."), (x) => (x === 7 ? "7² = 49 < 50 < 64 = 8² : donc 7 < √50 < 8." : "")] }),
    },
    angles: {
      predict: { q: "Deux droites parallèles sont coupées par une sécante ; un angle mesure 70°. L'angle alterne-interne mesure…", choices: ["70°", "110°", "20°"], good: 0, why: "Avec des parallèles, les angles alternes-internes sont égaux : 70°. Les angles du même côté (co-intérieurs) sont supplémentaires : 70° + 110° = 180°." },
      defis: ["Angle alterne-interne de 70° : sa mesure ?", "Angle co-intérieur (même côté, entre les parallèles) de 70° : sa mesure ?", "Un triangle a des angles de 48° et 75° : le troisième ?"],
      play: hunt({ ask: true, label: "Mesure (en degrés)",
        blank: (s) => s < 2 ? svg(320, 120, L(20, 30, 300, 30) + L(20, 90, 300, 90) + L(110, 120, 210, 0, "f-accent", 2) + T(200, 26, "70°", "start"), "parallèles et sécante") : svg(320, 120, `<polygon points="40,100 280,100 150,15" class="f-shape"/>` + T(60, 95, "48°", "start") + T(262, 95, "75°", "end") + T(150, 40, "?", "middle", 13, "f-txt f-accent"), "triangle"),
        show: (x, s) => plain("tu proposes <b>" + nb(x) + "°</b>" + (s === 2 ? " ; somme : 48 + 75 + " + nb(x) + " = " + nb(123 + x) + "°" : "")),
        wins: [W(70, "Alternes-internes et parallèles : angles égaux."), W(110, "Co-intérieurs : 70° + 110° = 180°."), W(57, "La somme des angles d'un triangle vaut 180° : 180 − 48 − 75 = 57.")] }),
    },
    cercthales: {
      predict: { q: "Le triangle ABC est inscrit dans un cercle de diamètre [AB]. L'angle en C mesure…", choices: ["90°", "60°", "ça dépend de C"], good: 0, why: "C'est le cercle de Thalès : où que soit C sur le cercle, l'angle ACB est droit." },
      defis: ["L'angle en A mesure 35° : combien mesure l'angle en B ?", "Diamètre AB = 10, AC = 6 : calcule BC.", "Un angle au centre mesure 100° : l'angle inscrit qui intercepte le même arc ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        blank: () => svg(320, 150, `<circle cx="160" cy="80" r="62" class="f-soft" stroke="var(--ink)"/><polygon points="98,80 222,80 130,25" class="f-shape"/>` + T(90, 84, "A", "end") + T(230, 84, "B", "start") + T(126, 18, "C"), "cercle de Thalès"),
        show: (x, s) => plain(["90 + 35 + " + nb(x) + " = " + nb(125 + x) + "°", "6² + " + nb(x) + "² = " + nb(36 + x * x) + " (il faut 10² = 100)", "angle inscrit = moitié de l'angle au centre ; tu proposes " + nb(x) + "°"][s]),
        wins: [W(55, "Angle droit en C : 180 − 90 − 35 = 55°."), W(8, "Pythagore dans le triangle rectangle en C : 36 + 64 = 100."), W(50, "L'angle inscrit vaut la moitié de l'angle au centre : 50°.")] }),
    },
    thales: {
      predict: { q: "(DE) ∥ (BC), AD = 2, AB = 6, BC = 9. Combien mesure DE ?", choices: ["3", "5", "4,5"], good: 0, why: "Le grand triangle est 3 fois plus grand (6 ÷ 2 = 3) : DE = 9 ÷ 3 = 3. On compare des rapports, pas des différences." },
      defis: ["AD = 2, AB = 6, BC = 9 : calcule DE.", "Même figure, AC = 12 : calcule AE.", "Un bâton de 2 m a une ombre de 3 m ; l'ombre d'un arbre mesure 15 m. Hauteur de l'arbre ?"],
      play: hunt({ ask: true, label: "Longueur",
        blank: (s) => s < 2 ? thal(1 / 3, s === 0 ? { AD: "2", DB: "4", BC: "9", DE: "?" } : { AD: "2", DB: "4", AE: "?", EC: "AC = 12" }) : plain("bâton 2 m ↔ ombre 3 m ; arbre ? ↔ ombre 15 m"),
        show: (x, s) => (s < 2 ? thal(1 / 3, s === 0 ? { AD: "2", DB: "4", BC: "9", DE: nb(x) } : { AD: "2", DB: "4", AE: nb(x), EC: "AC = 12" }) : "") + plain(["DE/BC = " + nb(x) + "/9 ; AD/AB = 2/6", "AE/AC = " + nb(x) + "/12 ; AD/AB = 2/6", "hauteur/ombre : " + nb(x) + "/15 ; bâton : 2/3"][s]),
        wins: [W(3, "2/6 = 3/9 : DE = 3."), W(4, "AE = 12 ÷ 3 = 4."), W(10, "Ombre 5 fois plus longue (15 ÷ 3) : arbre 5 fois plus haut, 10 m.")] }),
    },
    thalesrec: {
      predict: { q: "AD = 3, AB = 9, AE = 4, AC = 12. Les droites (DE) et (BC) sont-elles parallèles ?", choices: ["Oui", "Non"], good: 0, why: "AD/AB = 3/9 = 1/3 et AE/AC = 4/12 = 1/3 : les rapports sont égaux, donc (DE) ∥ (BC) (réciproque de Thalès)." },
      defis: ["AD = 4, AB = 10, AE = 6 : quelle longueur AC rend (DE) ∥ (BC) ?", "AD = 5, AB = 15, AC = 21 : quelle longueur AE ?", "AD = 6, AC = 20, AE = 8 : quelle longueur AB ?"],
      play: hunt({ ask: true, label: "Longueur",
        blank: (s) => thal(0.4, [{ AD: "4", AE: "6", EC: "AC = ?" }, { AD: "5", DB: "AB = 15", AE: "?" }, { AD: "6", DB: "AB = ?", AE: "8" }][s]),
        show: (x, s) => plain(["AD/AB = 4/10 ; AE/AC = 6/" + nb(x), "AD/AB = 5/15 ; AE/AC = " + nb(x) + "/21", "produits en croix : AD · AC = 120 ; AE · AB = 8 · " + nb(x) + " = " + nb(8 * x)][s]),
        wins: [W(15, "4/10 = 6/15 = 0,4 : parallèles."), W(7, "5/15 = 7/21 = 1/3."), W(15, "6 · 20 = 8 · 15 = 120 : produits en croix égaux.")] }),
    },
    repere: {
      predict: { q: "Où se trouve le point (−3 ; 2) ?", choices: ["en haut à gauche", "en bas à droite", "en haut à droite"], good: 0, why: "La 1re coordonnée (abscisse) se lit horizontalement : −3, à gauche. La 2e (ordonnée) verticalement : 2, en haut." },
      defis: ["A(−4 ; 2) et B(6 ; 2) : abscisse du milieu de [AB] ?", "Distance entre C(1 ; 1) et D(1 ; −6) ?", "Symétrique de P(3 ; −5) par rapport à l'axe des abscisses : son ordonnée ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        blank: (s) => { const X = (v) => 160 + v * 20, Y = (v) => 80 - v * 10; let g = L(20, 80, 300, 80) + L(160, 5, 160, 155); const pts = [[[-4, 2, "A"], [6, 2, "B"]], [[1, 1, "C"], [1, -6, "D"]], [[3, -5, "P"]]][s]; for (const [a, b, n] of pts) g += `<circle cx="${X(a)}" cy="${Y(b)}" r="4" class="f-dot"/>` + (X(a) > 230 ? T(X(a) - 8, Y(b) - 6, (n + "(" + a + " ; " + b + ")").replace(/-/g, "−"), "end", 11) : T(X(a) + 8, Y(b) - 6, (n + "(" + a + " ; " + b + ")").replace(/-/g, "−"), "start", 11)); /* 24.11 : près du bord droit, étiquette à gauche (« B(6 ; 2 » coupé) */ return svg(320, 160, g, "repère"); },
        show: (x, s) => plain(["milieu : (−4 + 6) ÷ 2", "même abscisse : on compte de 1 à −6", "symétrie par rapport à l'axe horizontal : l'abscisse reste, l'ordonnée change de signe"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(1, "(−4 + 6) ÷ 2 = 1."), W(7, "1 − (−6) = 7."), W(5, "Le symétrique est (3 ; 5).")] }),
    },
    tabval: {
      predict: { q: "f(x) = 2x − 3. Combien vaut f(−1) ?", choices: ["−5", "−1", "5"], good: 0, why: "On remplace x par −1 : 2 · (−1) − 3 = −2 − 3 = −5." },
      defis: ["Complète : f(4) = ?", "Complète : f(0) = ?", "Pour quel x a-t-on f(x) = 7 ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        blank: (s) => tab([-1, 0, 1, 4], s),
        show: (x, s) => tab([-1, 0, 1, 4], s, x),
        wins: [W(5, "2 · 4 − 3 = 5."), W(-3, "2 · 0 − 3 = −3 : c'est l'ordonnée à l'origine."), W(5, "2x − 3 = 7 ⇔ 2x = 10 ⇔ x = 5 (on remonte le calcul).")] }),
    },
    simil: {
      predict: { q: "On double tous les côtés d'un carré. Son aire est multipliée par…", choices: ["2", "4", "8"], good: 1, why: "Longueurs × 2, donc aire × 2 · 2 = 4 : on voit 4 copies du petit carré dans le grand." },
      defis: ["Trouve le rapport k qui multiplie l'aire par 9.", "Puis l'aire par 16.", "Pour un cube, quel rapport multiplie le volume par 8 ?"],
      play: hunt({ label: "Rapport k", start: 1, min: 1, max: 5,
        show: (x, s) => { const u = 22; let g = ""; for (let i = 0; i < x; i++) for (let j = 0; j < x; j++) g += `<rect x="${40 + i * u}" y="${8 + j * u}" width="${u}" height="${u}" class="${i || j ? "f-fill2" : "f-fill"}" stroke="var(--ink)" stroke-width="0.6"/>`;
          return svg(320, 124, g, "agrandissement de rapport " + x) + plain("k = " + x + " → longueurs × " + x + ", aire × " + x + "² = <b>" + x * x + "</b>, volume × " + x + "³ = <b>" + x ** 3 + "</b>"); },
        wins: [W(3, "k = 3 : aire × 9 (k²)."), W(4, "k = 4 : aire × 16."), (x) => (x === 2 ? "k = 2 : volume × 2³ = 8 (k³)." : "")] }),
    },
    denombr: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Si on choisit d'abord parmi \\(a\\) possibilités, puis parmi \\(b\\), il y a \\(a \\cdot b\\) possibilités (c'est un arbre) : on multiplie, on n'additionne pas.", exemple: ["3 t-shirts et 4 pantalons : \\(3 \\cdot 4 = 12\\) tenues.", "6 personnes : \\(\\frac{6 \\cdot 5}{2} = 15\\) poignées de main."] },
      predict: { q: "3 t-shirts et 4 pantalons : combien de tenues différentes ?", choices: ["7", "12", "34"], good: 1, why: "Chaque t-shirt se combine avec chacun des 4 pantalons : 3 · 4 = 12 (arbre). On multiplie, on n'additionne pas." },
      defis: ["3 t-shirts, 4 pantalons : nombre de tenues ?", "5 coureurs : nombre de podiums (or, argent, bronze) ?", "6 personnes se serrent toutes la main : nombre de poignées ?"],
      play: hunt({ ask: true, label: "Nombre",
        show: (x, s) => plain(["arbre : 3 branches, puis 4 sur chacune", "or : 5 choix, argent : 4, bronze : 3", "chacun serre 5 mains ; chaque poignée est comptée deux fois"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(12, "3 · 4 = 12."), W(60, "5 · 4 · 3 = 60 : sans répétition."), W(15, "6 · 5 ÷ 2 = 15.")] }),
    },
    proba: {
      predict: { q: "On lance deux dés et on additionne. Quelle somme sort le plus souvent ?", choices: ["12", "7", "elles ont toutes la même chance"], good: 1, why: "7 s'obtient de 6 façons (1+6, 2+5, …, 6+1) sur 36, 12 d'une seule (6+6) : les sommes ne sont pas équiprobables." },
      defis: ["Combien d'issues pour deux dés ?", "De combien de façons obtient-on 7 ?", "Et 10 ?"],
      play: hunt({ ask: true, label: "Nombre",
        blank: (s) => grid(s === 1 ? 7 : s === 2 ? 10 : 0),
        show: (x, s) => grid(s === 1 ? 7 : s === 2 ? 10 : 0) + plain(s ? "cases coloriées : la somme vaut " + (s === 1 ? 7 : 10) + " ; tu proposes <b>" + nb(x) + "</b>" : "tableau 6 × 6 ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(36, "6 · 6 = 36 issues."), W(6, "6 façons sur 36 : P(7) = 6/36 = 1/6."), W(3, "4+6, 5+5, 6+4 : 3 façons, P(10) = 3/36 = 1/12.")] }),
    },
    carres: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Élever au carré, c'est multiplier un nombre par lui-même. Carrés à connaître : \\(11^2 = 121\\), \\(12^2 = 144\\), \\(13^2 = 169\\), \\(14^2 = 196\\), \\(15^2 = 225\\).", exemple: ["\\(\\sqrt{144} = 12\\)", "\\(0{,}3^2 = 0{,}09\\)", "\\(14^2 = 196 < 200 < 225 = 15^2\\)"] },
      predict: { q: "Combien vaut 0,3² ?", choices: ["0,9", "0,09", "0,6"], good: 1, why: "0,3 · 0,3 = 0,09 : deux chiffres après la virgule. Élever au carré, c'est multiplier par lui-même, pas par 2 ni par 3." },
      defis: ["Quel nombre positif a pour carré 144 ?", "Quel nombre positif a pour carré 121 ?", "Quel est le plus grand entier dont le carré est inférieur à 200 ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        show: (x, s) => plain(nb(x) + "² = <b>" + nb(x * x) + "</b>" + (s === 2 ? (x * x < 200 ? " (sous 200)" : " (dépasse 200)") : "")),
        wins: [W(12, "12² = 144 : √144 = 12."), W(11, "11² = 121 : √121 = 11."), W(14, "14² = 196 < 200 < 225 = 15².")] }),
    },
    pctvar: {
      predict: { q: "Un prix augmente de 10 %, puis baisse de 10 %. À la fin, il est…", choices: ["revenu au prix de départ", "plus bas qu'au départ", "plus haut qu'au départ"], good: 1, why: "100 → 110 (× 1,1) → 99 (× 0,9) : la baisse de 10 % porte sur 110, un montant plus grand. × 1,1 × 0,9 = × 0,99." },
      defis: ["Un article à 80 CHF augmente de 25 %. Nouveau prix ?", "Un article à 50 CHF baisse de 20 %. Nouveau prix ?", "Un prix passe de 40 à 50 CHF. Augmentation en % ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        show: (x, s) => plain(["80 · 1,25 (coefficient d'une hausse de 25 %)", "50 · 0,8 (coefficient d'une baisse de 20 %)", "hausse 10 CHF sur 40 CHF : 10/40"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
        wins: [W(100, "80 · 1,25 = 100 CHF."), W(40, "50 · 0,8 = 40 CHF."), W(25, "10/40 = 0,25 = 25 % : on divise par le prix de DÉPART.")] }),
    },
  });
  // Tableau de valeurs de f(x) = 2x − 3 ; la case du défi s est vide (« ? ») tant que la réponse n'est pas trouvée.
  function tab(xs, s, x) { const f = (t) => 2 * t - 3; const cells = s === 2 ? [[x ?? "?", 7]] : xs.map((t) => [t, (s === 0 && t === 4) || (s === 1 && t === 0) ? (x ?? "?") : f(t)]);
    return `<div class="act-out"><table style="margin:auto;border-collapse:collapse"><tr><th style="padding:4px 10px;border:1px solid var(--line)">x</th>${cells.map((c) => `<td style="padding:4px 10px;border:1px solid var(--line)">${nb(c[0]) === "NaN" ? c[0] : String(c[0]).replace("-", "−")}</td>`).join("")}</tr><tr><th style="padding:4px 10px;border:1px solid var(--line)">f(x) = 2x − 3</th>${cells.map((c) => `<td style="padding:4px 10px;border:1px solid var(--line)">${String(c[1]).replace("-", "−")}</td>`).join("")}</tr></table></div>`; }
  // Tableau 6 × 6 des sommes de deux dés ; cases de somme t coloriées.
  function grid(t) { const u = 22; let g = ""; for (let i = 1; i <= 6; i++) { g += T(70 + i * u, 14, i) + T(56, 28 + i * u - 6, i); for (let j = 1; j <= 6; j++) g += `<rect x="${59 + i * u}" y="${10 + j * u - 6}" width="${u}" height="${u}" class="${i + j === t ? "f-fill" : "f-soft"}" stroke="var(--ink)" stroke-width="0.4"/>` + T(70 + i * u, 26 + j * u - 6 + 1, i + j, "middle", 9); }
    return svg(320, 160, g, "tableau des sommes de deux dés"); }
})();

// Chantier 11e, suite (23.11). Racines selon le programme (remarque de l'enseignant, commit e71b7fa) :
// - rac (9e-10e) = racines carrées + calcul simple de racines cubiques, SANS propriété : la leçon active d'act_ch11c.js est
//   remplacée ici par carré → cube → carré (aire 49, volume 125, encadrer √50). Règle : LESSONS.rac (lessons.js), inchangée.
// - racprop (11e) = propriétés des racines carrées et cubiques : produit (rectangle √2 × √8), extraire un carré parfait
//   (carré d'aire 72 pavé de carrés d'aire 2), somme de racines semblables (segments), produit de racines cubiques.
//   Règle : LESSONS.racprop (lessons2.js). MER 11e, Nombres réels › Racines (NO89–NO97).
// Outils recopiés d'act_ch11c.js : le fichier reste autonome.
(function () {
  // ---------- outils ----------
  const nb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");
  const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;
  const plain = (html) => `<div class="act-out">${html}</div>`;
  const T = (x, y, s, a = "middle", sz = 12, cls = "f-txt") => `<text x="${+(+x).toFixed(1)}" y="${+(+y).toFixed(1)}" class="${cls}" text-anchor="${a}" font-size="${sz}">${s}</text>`;
  const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });
  const hunt0 = (o) => (box, onWin) => {
    let x = o.ask ? null : o.start, step = 0;
    const draw = () => {
      const s = Math.min(step, o.wins.length - 1), fig = x === null ? (o.blank ? o.blank(s) : "") : o.show(x, s);
      const ctl = o.ask ? actAnswerHtml(o.label || "Ta réponse") : actStepper(o.label || "x", nb(x), "x");
      box.innerHTML = fig + ctl + (o.note ? `<div class="small muted">${o.note}</div>` : "");
      if (o.ask) {
        const inp = box.querySelector(".act-in"); if (x !== null) inp.value = nb(x).replace("−", "-");
        const go = () => { const v = Number(String(inp.value).replace(/,/g, ".").replace("−", "-").replace(/\s/g, "")); if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre."); return; } x = v; draw(); if (!check()) $hint(box, o.miss || "Pas encore : regarde la figure, puis recalcule."); };
        actAnswerBind(box, go);
      } else box.querySelectorAll('[data-st="x"]').forEach((b) => (b.onclick = () => { x = Math.max(o.min, Math.min(o.max, +(x + +b.dataset.d * (o.step || 1)).toFixed(6))); draw(); check(); }));
    };
    const check = () => { if (step >= o.wins.length) return false; const m = o.wins[step](x); if (m) { onWin(step, m); step++; if (o.ask) x = null; draw(); return true; } return false; };
    draw();
  };
  const W = (target, msg) => (x) => (Math.abs(x - target) < 1e-9 ? msg : "");
  const R = (x, y, w, h, cls, sw = 0.8) => `<rect x="${+x.toFixed(1)}" y="${+y.toFixed(1)}" width="${+w.toFixed(1)}" height="${+h.toFixed(1)}" class="${cls}" stroke="var(--ink)" stroke-width="${sw}"/>`;

  // ---------- rac : carré, cube ----------
  // 24.11 (galerie : carré de départ minuscule, perdu en haut) : cadre du plus grand carré (côté 8) en pointillé, le carré
  // grandit depuis son coin inférieur gauche.
  const square = (n, cls) => { const u = 14, x0 = 104, yb = 117; let g = `<rect x="${x0}" y="${yb - 8 * u}" width="${8 * u}" height="${8 * u}" fill="none" stroke="var(--ink-soft)" stroke-dasharray="3 3"/>`;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) g += `<rect x="${x0 + i * u}" y="${yb - (j + 1) * u}" width="${u}" height="${u}" class="${cls}" stroke="var(--ink)" stroke-width="0.4"/>`;
    return svg(320, 122, g, "carré de côté " + n); };
  // Cube d'arête n en perspective cavalière, faces visibles quadrillées en cubes unités.
  const cube = (n, cls) => { const u = 11, dx = 5.5, dy = -4.4, x0 = Math.round(160 - (n * (u + dx)) / 2), y0 = Math.round(66 + (n * (u - dy)) / 2), a = n * u, top = y0 - a;
    const P = (pts) => pts.map((p) => p.map((v) => +v.toFixed(1)).join(",")).join(" ");
    const ln = (x1, y1, x2, y2) => `<line x1="${+x1.toFixed(1)}" y1="${+y1.toFixed(1)}" x2="${+x2.toFixed(1)}" y2="${+y2.toFixed(1)}" stroke="var(--ink)" stroke-width="0.4"/>`;
    let g = `<polygon points="${P([[x0, top], [x0 + a, top], [x0 + a + n * dx, top + n * dy], [x0 + n * dx, top + n * dy]])}" class="${cls}" opacity="0.55" stroke="var(--ink)" stroke-width="0.8"/>`
      + `<polygon points="${P([[x0 + a, y0], [x0 + a, top], [x0 + a + n * dx, top + n * dy], [x0 + a + n * dx, y0 + n * dy]])}" class="${cls}" opacity="0.75" stroke="var(--ink)" stroke-width="0.8"/>`
      + R(x0, top, a, a, cls);
    for (let i = 1; i < n; i++) g += ln(x0 + i * u, top, x0 + i * u, y0) + ln(x0, top + i * u, x0 + a, top + i * u) // face avant
      + ln(x0 + i * u, top, x0 + i * u + n * dx, top + n * dy) + ln(x0 + i * dx, top + i * dy, x0 + a + i * dx, top + i * dy) // dessus
      + ln(x0 + a + i * dx, y0 + i * dy, x0 + a + i * dx, top + i * dy) + ln(x0 + a, top + i * u, x0 + a + n * dx, top + i * u + n * dy); // côté
    return svg(320, 132, g, "cube d'arête " + n); };

  // ---------- racprop : figures ----------
  // Défi 1 : carré d'aire 2 (à gauche), carré d'aire 8 (au-dessus), rectangle √2 × √8 entre les deux.
  const rect28 = (x) => { const k = 34, a = k * Math.SQRT2, b = k * Math.sqrt(8), x0 = 100, y0 = 6 + b;
    return svg(320, 172, R(x0 - a, y0, a, a, "f-soft") + T(x0 - a / 2, y0 + a / 2 + 4, "aire 2", "middle", 11)
      + R(x0, y0 - b, b, b, "f-soft") + T(x0 + b / 2, y0 - b / 2 + 4, "aire 8", "middle", 11)
      + R(x0, y0, b, a, "f-fill2", 1.4) + T(x0 + b / 2, y0 + a / 2 + 4, x === null ? "aire ?" : "aire " + nb(x), "middle", 12, "f-txt f-accent")
      + T(x0 + b + 6, y0 + a / 2 + 4, "√2", "start") + T(x0 + b / 2, y0 + a + 15, "√8"), "rectangle de côtés √2 et √8"); };
  // Défi 2 : carré d'aire 72 (côté 120 = 6 côtés de carré d'aire 2) ; la réponse a le pave de a × a carrés d'aire 2.
  const sq72 = (x) => { const S = 120, u = S / 6, x0 = 90, y0 = 6; let g = R(x0, y0, S, S, "f-soft", 1.4);
    if (x !== null && Number.isInteger(x) && x >= 1 && x <= 7) {
      for (let i = 0; i < x; i++) for (let j = 0; j < x; j++) g += `<rect x="${x0 + i * u}" y="${y0 + j * u}" width="${u}" height="${u}" class="f-fill2" stroke-width="1"/>`;
      g += T(x0 + u / 2, y0 + u / 2 + 4, "2", "middle", 10); }
    return svg(320, 166, g + T(x0 + S / 2, y0 + S + 16, "aire 72") + T(x0 + S + 22, y0 + S / 2 + 4, "côté a√2", "start", 11), "carré d'aire 72"); };
  // Défi 3 : segments √12 et √27 bout à bout ; la réponse a trace a√3 en dessous, gradué en √3.
  const seg3 = (x) => { const k = 26, s3 = k * Math.sqrt(3), x0 = 20, l1 = k * Math.sqrt(12), l2 = k * Math.sqrt(27);
    const ln = (a, b, y1, y2, cls, w) => `<line x1="${+a.toFixed(1)}" y1="${y1}" x2="${+b.toFixed(1)}" y2="${y2}" class="${cls}" stroke-width="${w}"/>`;
    let g = ln(x0, x0 + l1, 30, 30, "f-line", 4) + ln(x0 + l1, x0 + l1 + l2, 30, 30, "f-accent", 4) + T(x0 + l1 / 2, 20, "√12") + T(x0 + l1 + l2 / 2, 20, "√27");
    if (x !== null && Number.isInteger(x) && x >= 1 && x <= 12) { const L = Math.min(x * s3, 290); g += ln(x0, x0 + L, 64, 64, "f-line", 4);
      for (let i = 0; i <= x && i * s3 <= 290; i++) g += ln(x0 + i * s3, x0 + i * s3, 57, 71, "f-line", 1.2);
      g += T(x0, 88, nb(x) + " fois √3", "start", 11); }
    return svg(320, 96, g, "segments de longueurs √12 et √27"); };

  Object.assign(ACTIVE, {
    rac: {
      predict: { q: "Combien vaut √(9 + 16) ?", choices: ["7", "5", "25"], good: 1, why: "On calcule d'abord sous la racine, √25 = 5. Ce n'est pas √9 + √16 = 3 + 4 = 7 !" },
      defis: ["Agrandis le carré jusqu'à une aire de 49.", "Maintenant c'est un cube : agrandis-le jusqu'à un volume de 125.", "Retour au carré : quel est le plus grand côté entier dont l'aire reste sous 50 ?"],
      play: hunt({ label: "Côté", start: 2, min: 1, max: 8,
        show: (x, s) => s === 1 ? cube(x, "f-fill") + plain("arête " + x + " → volume " + x + "³ = " + x + " · " + x + " · " + x + " = <b>" + x ** 3 + "</b>")
          : square(x, s === 2 && x * x > 50 ? "f-fill2" : "f-fill") + plain("côté " + x + " → aire " + x + "² = <b>" + x * x + "</b>" + (s === 2 ? (x * x < 50 ? " (sous 50)" : " (dépasse 50)") : "")),
        wins: [W(7, "Côté 7 : 7² = 49, donc √49 = 7. La racine carrée donne le côté du carré."),
          W(5, "Arête 5 : 5 · 5 · 5 = 125, donc ∛125 = 5. La racine cubique donne l'arête du cube."),
          W(7, "7² = 49 < 50 < 64 = 8² : donc √50 est entre 7 et 8.")] }),
    },
    racprop: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\(\\sqrt{a \\cdot b} = \\sqrt{a} \\cdot \\sqrt{b}\\) (\\(a, b\\) positifs). Pour simplifier, on sort le plus grand carré parfait : \\(\\sqrt{72} = \\sqrt{36 \\cdot 2} = 6\\sqrt{2}\\). On additionne seulement des racines semblables : \\(2\\sqrt{3} + 3\\sqrt{3} = 5\\sqrt{3}\\). La racine cubique suit la même règle pour le produit : \\(\\sqrt[3]{a} \\cdot \\sqrt[3]{b} = \\sqrt[3]{ab}\\).", exemple: ["\\(\\sqrt{2} \\cdot \\sqrt{8} = \\sqrt{16} = 4\\).", "\\(\\sqrt{12} + \\sqrt{27} = 2\\sqrt{3} + 3\\sqrt{3} = 5\\sqrt{3}\\).", "\\(\\sqrt[3]{2} \\cdot \\sqrt[3]{4} = \\sqrt[3]{8} = 2\\)."] },
      predict: { q: "Laquelle de ces égalités est vraie ?", choices: ["√9 · √16 = √(9 · 16)", "√9 + √16 = √(9 + 16)", "les deux"], good: 0,
        why: "√9 · √16 = 3 · 4 = 12, et √144 = 12 aussi. Mais √9 + √16 = 7, alors que √25 = 5. La racine d'un produit est le produit des racines ; pour une somme, ça ne marche pas." },
      defis: ["Le rectangle a pour côtés √2 et √8. Calcule son aire √2 · √8.", "Un carré a une aire de 72. Son côté s'écrit a√2 : trouve a.", "√12 + √27 = a√3 : trouve a.", "Même règle du produit pour les racines cubiques : calcule ∛2 · ∛4."],
      play: hunt({ ask: true, label: "Ta réponse",
        blank: (s) => [rect28(null), sq72(null), seg3(null), plain("∛2 · ∛4 = ?")][s],
        show: (x, s) => [rect28(x) + plain("tu proposes " + nb(x) + " ; " + nb(x) + "² = " + nb(x * x) + " (il faut 2 · 8 = 16)"),
          sq72(x) + plain(nb(x) + " × " + nb(x) + " carrés d'aire 2 = " + nb(2 * x * x) + " (il faut 72)"),
          seg3(x) + plain("√12 + √27 ≈ 8,66 ; " + nb(x) + "√3 ≈ " + nb(+(x * Math.sqrt(3)).toFixed(2))),
          plain("tu proposes " + nb(x) + " ; " + nb(x) + "³ = " + nb(x ** 3) + " (il faut 2 · 4 = 8)")][s],
        wins: [W(4, "√2 · √8 = √(2 · 8) = √16 = 4. Le produit de deux racines est la racine du produit."),
          W(6, "72 = 36 · 2, donc √72 = √36 · √2 = 6√2. On sort le plus grand carré parfait (36 carrés d'aire 2)."),
          W(5, "√12 = 2√3 et √27 = 3√3, donc la somme vaut 5√3. On n'additionne que des racines semblables."),
          W(2, "∛2 · ∛4 = ∛8 = 2, car 2³ = 8. La racine cubique suit la même règle pour le produit.")] }),
    },
  });
})();

