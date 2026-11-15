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
