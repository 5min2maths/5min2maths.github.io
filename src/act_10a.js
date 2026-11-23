// Chantier 10e · chapitres 1 à 7 (23.11) : leçons actives (devine / essaie sur la figure / retiens) pour les notions
// de 10e qui n'en avaient pas et qui ne sont pas aussi en 9e : disque, grandmanq (2. Aires et périmètres),
// airelat, voldecomp (4. 3D). Calibrées sur les MER 10e (GM14–GM28 cercles et disques, GM8 hauteur d'un trapèze,
// GM89–GM97 boîtes, cylindres, contenances). Même moteur que act_ch11c.js (outils recopiés : fichier autonome).
// Pas de vraie manipulation ici : mode réponse (o.ask), une figure qui réagit après « Vérifier ».
// Avec π : on demande le nombre devant π (valeur exacte), comme volmanq ; « 12π » tapé est aussi accepté.
// L'étape « Retiens » vient de LESSONS[id] (lessons2.js pour disque, gen3.js pour les trois autres).
(function () {
  // ---------- outils ----------
  // Nombre à la suisse : virgule décimale, ' pour les milliers, vrai signe moins.
  const nb = (v) => { const s = String(+(+v).toFixed(4)); const [i, d] = s.replace("-", "").split("."); return (v < 0 ? "−" : "") + i.replace(/\B(?=(\d{3})+(?!\d))/g, "'") + (d ? "," + d : ""); };
  const ok = (good, low) => (good ? '<b class="act-ok">✓ juste</b>' : low ? "trop petit" : "trop grand");
  const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;
  const T = (x, y, s, a = "middle", sz = 12, cls = "f-txt") => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${a}" font-size="${sz}">${s}</text>`;
  const L = (x1, y1, x2, y2, cls = "f-line", w = 1.6, dash) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
  const plain = (html) => `<div class="act-out">${html}</div>`;
  const Q = (x) => (x === null || x === undefined ? "?" : nb(x)); // inconnue : « ? » tant que rien n'est tapé
  const QC = (x) => (x === null || x === undefined ? "f-txt f-accent" : "f-txt");
  // Mode réponse (o.ask) : l'élève calcule et tape ; la figure se met à jour après « Vérifier ».
  // o et mk gardés sur la fonction : actPrep (active.js) peut ne garder que 2 questions.
  const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });
  const hunt0 = (o) => (box, onWin) => {
    let x = null, step = 0;
    const draw = () => {
      const s = Math.min(step, o.wins.length - 1), fig = x === null ? (o.blank ? o.blank(s) : "") : o.show(x, s);
      const lab = typeof o.label === "function" ? o.label(s) : o.label || "Ta réponse";
      box.innerHTML = fig + actAnswerHtml(lab) + (o.note ? `<div class="small muted">${o.note}</div>` : "");
      const inp = box.querySelector(".act-in");
      const go = () => {
        const raw = String(inp.value).replace(/π|pi/gi, "").replace(/['’\s]/g, "").replace(/,/g, ".").replace("−", "-");
        const v = Number(raw.replace(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/, (m, u, w) => String(u / w)));
        if (raw === "" || !isFinite(v)) { $hint(box, "Tape un nombre."); return; }
        x = v; draw(); if (!check()) $hint(box, o.miss || "Pas encore : regarde la figure, puis recalcule.");
      };
      actAnswerBind(box, go);
    };
    const check = () => { if (step >= o.wins.length) return false; const m = o.wins[step](x); if (m) { onWin(step, m); step++; x = null; draw(); return true; } return false; };
    draw();
  };
  const W = (target, msg) => (x) => (Math.abs(x - target) < 1e-9 ? msg : "");
  // Pavé en perspective cavalière : (x, y) = coin avant gauche en bas, w × h de face, (dx, dy) = fuite de la profondeur.
  const box3 = (x, y, w, h, dx, dy, cls = "f-fill2") => `<polygon points="${x},${y - h} ${x + w},${y - h} ${x + w + dx},${y - h + dy} ${x + dx},${y - h + dy}" class="f-soft" stroke="var(--ink)" stroke-width="1.2"/>`
    + `<polygon points="${x + w},${y} ${x + w + dx},${y + dy} ${x + w + dx},${y - h + dy} ${x + w},${y - h}" class="f-soft" stroke="var(--ink)" stroke-width="1.2"/>`
    + `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" class="${cls}" stroke="var(--ink)" stroke-width="1.2"/>`;
  // Point d'un cercle (angle en degrés, sens trigonométrique, y vers le bas en SVG).
  const P = (cx, cy, r, a) => [+(cx + r * Math.cos((a * Math.PI) / 180)).toFixed(1), +(cy - r * Math.sin((a * Math.PI) / 180)).toFixed(1)];

  // ---------- figures ----------
  // Roue qui roule : un tour complet = la longueur du cercle (π · diamètre).
  const roue = () => { const r = 26, cx = 40, cy = 56, u = Math.PI * 2 * r; let g = L(10, cy + r, 315, cy + r);
    g += `<circle cx="${cx}" cy="${cy}" r="${r}" class="f-soft" stroke="var(--ink)" stroke-width="2"/>` + L(cx - r, cy, cx + r, cy, "f-accent", 2) + T(cx, cy - 6, "70 cm", "middle", 11);
    g += `<circle cx="${cx + u}" cy="${cy}" r="${r}" class="f-soft" stroke="var(--ink)" stroke-width="1.2" stroke-dasharray="4 3"/>`;
    g += `<path d="M${cx},${cy + r + 12} H${cx + u}" class="f-accent" stroke-width="2" fill="none"/>` + L(cx, cy + r + 7, cx, cy + r + 17, "f-accent", 2) + L(cx + u, cy + r + 7, cx + u, cy + r + 17, "f-accent", 2) + T(cx + u / 2, cy + r + 28, "1 tour = ?", "middle", 12, "f-txt f-accent");
    return svg(320, 118, g, "roue de 70 cm de diamètre qui fait un tour"); };
  // Défis du disque : 0 cercle de rayon 6 cm, 1 pizza de 30 cm de diamètre, 2 secteur de 120° et de rayon 9 m.
  const disc = (s) => { const cx = 160, cy = 78, R = 62; let g = "";
    if (s === 0) g = `<circle cx="${cx}" cy="${cy}" r="${R}" class="f-soft" stroke="var(--ink)" stroke-width="2.4"/>` + L(cx, cy, cx + R, cy, "f-accent", 2) + T(cx + R / 2, cy - 6, "6 cm") + `<circle cx="${cx}" cy="${cy}" r="3" class="f-dot"/>`;
    else if (s === 1) g = `<circle cx="${cx}" cy="${cy}" r="${R}" class="f-fill2" stroke="var(--ink)" stroke-width="1.6"/>` + L(cx - R, cy, cx + R, cy, "f-accent", 2) + T(cx, cy - 6, "30 cm") + `<circle cx="${cx}" cy="${cy}" r="3" class="f-dot"/>`;
    else { const cy2 = 120, R2 = 92, [ax, ay] = P(cx, cy2, R2, 30), [bx, by] = P(cx, cy2, R2, 150), [lx, ly] = P(cx, cy2, R2 / 2, 30);
      g = `<path d="M${cx - R2},${cy2} A${R2} ${R2} 0 0 1 ${cx + R2},${cy2}" class="f-line" fill="none" stroke-dasharray="4 3" stroke-width="1"/>`
        + `<path d="M${cx},${cy2} L${ax},${ay} A${R2} ${R2} 0 0 0 ${bx},${by} Z" class="f-fill2" stroke="var(--ink)" stroke-width="1.6"/>`
        + `<path d="M${P(cx, cy2, 18, 30)} A18 18 0 0 0 ${P(cx, cy2, 18, 150)}" class="f-accent" fill="none" stroke-width="1.6"/>` + T(cx, cy2 - 24, "120°", "middle", 11)
        + T(lx + 8, ly + 12, "9 m", "start") + `<circle cx="${cx}" cy="${cy2}" r="3" class="f-dot"/>` + T(cx, cy2 + 15, "arroseur", "middle", 10); }
    return svg(320, s === 2 ? 142 : 156, g, ["cercle de rayon 6 cm", "pizza de 30 cm de diamètre", "secteur de 120° et de rayon 9 m"][s]); };
  // Triangle (aire 24, base 8) du « Devine ».
  const triDev = () => svg(320, 130, `<polygon points="60,110 260,110 110,20" class="f-fill2" stroke="var(--ink)" stroke-width="1.6"/>` + L(110, 20, 110, 110, "f-accent", 2, "5 4") + `<rect x="110" y="100" width="10" height="10" fill="none" class="f-line" stroke-width="1"/>`
    + T(160, 126, "8 cm") + T(116, 72, "h = ?", "start", 12, "f-txt f-accent") + T(178, 102, "aire 24 cm²", "middle", 11), "triangle d'aire 24 cm² et de base 8 cm");
  // Défis : 0 potager rectangulaire 7 m × ?, 1 voile triangulaire de base 5 m, 2 trapèze de bases 11 et 7 cm.
  const dimFig = (s, x) => { let g;
    if (s === 0) g = `<rect x="40" y="30" width="240" height="84" class="f-fill2" stroke="var(--ink)" stroke-width="1.6"/>` + T(160, 22, "longueur = " + Q(x) + " m", "middle", 12, QC(x)) + T(32, 76, "7 m", "end") + T(160, 78, "aire 84 m²");
    else if (s === 1) g = `<polygon points="120,10 120,130 220,130" class="f-fill2" stroke="var(--ink)" stroke-width="1.6"/>` + L(120, 10, 120, 130, "f-accent", 2) + T(112, 74, "h = " + Q(x) + " m", "end", 12, QC(x)) + T(170, 146, "base 5 m") + T(150, 112, "15 m²", "start", 11);
    else g = `<polygon points="40,120 280,120 230,30 70,30" class="f-fill2" stroke="var(--ink)" stroke-width="1.6"/>` + L(100, 30, 100, 120, "f-accent", 2, "5 4") + T(160, 22, "b = 7 cm") + T(160, 138, "B = 11 cm") + T(108, 80, "h = " + Q(x) + " cm", "start", 12, QC(x)) + T(200, 104, "aire 45 cm²", "middle", 11);
    return svg(320, 150, g, ["potager rectangulaire", "voile triangulaire", "trapèze"][s]); };
  // Pièce de 5 m × 4 m, haute de 3 m (murs à peindre).
  const piece = () => svg(320, 140, box3(70, 125, 150, 90, 70, -40, "f-fill2") + T(145, 138, "5 m") + T(270, 118, "4 m", "start") + T(62, 84, "3 m", "end") + T(145, 84, "4 murs à peindre", "middle", 11), "pièce de 5 m sur 4 m, haute de 3 m");
  // Défis : 0 boîte prisme (triangle équilatéral de 4 cm, longueur 20 cm) et ses 3 rectangles dépliés ;
  // 1 cylindre r = 4, h = 11 et son étiquette déroulée ; 2 le même avec le fond et le couvercle.
  const latFig = (s) => { let g = "";
    if (s === 0) { const A = [14, 104], B = [50, 104], C = [32, 73], d = [64, -40], m = (p) => [p[0] + d[0], p[1] + d[1]];
      g += `<polygon points="${m(A)} ${m(B)} ${m(C)}" class="f-line" fill="none" stroke-width="1" stroke-dasharray="3 3"/>` + L(...A, ...m(A), "f-line", 1, "3 3")
        + `<polygon points="${C} ${m(C)} ${m(B)} ${B}" class="f-fill2" stroke="var(--ink)" stroke-width="1.2"/><polygon points="${A} ${B} ${C}" class="f-soft" stroke="var(--ink)" stroke-width="1.2"/>` + L(...C, ...m(C), "f-line", 1.2)
        + T(32, 120, "4 cm", "middle", 10) + T(88, 92, "20 cm", "start", 10);
      for (let k = 0; k < 3; k++) g += `<rect x="${140 + k * 46}" y="12" width="46" height="110" class="f-fill2" stroke="var(--ink)" stroke-width="1.2"/>` + T(163 + k * 46, 136, "4 cm", "middle", 10);
      g += T(284, 70, "20 cm", "start", 10) + T(110, 128, "déplié →", "middle", 11); return svg(320, 142, g, "boîte en prisme et ses trois faces latérales dépliées"); }
    const y0 = s === 2 ? 44 : 28;
    g += `<path d="M36,${y0} V${y0 + 80} A26 7 0 0 0 88,${y0 + 80} V${y0}" class="f-fill2" stroke="var(--ink)" stroke-width="1.2"/><ellipse cx="62" cy="${y0}" rx="26" ry="7" class="f-soft" stroke="var(--ink)" stroke-width="1.2"/>` + L(62, y0, 88, y0, "f-accent", 1.6) + T(75, y0 - 10, "4 cm", "middle", 10) + T(30, y0 + 44, "11 cm", "end", 10);
    g += `<rect x="112" y="${y0}" width="196" height="80" class="f-fill2" stroke="var(--ink)" stroke-width="1.4"/>` + T(210, y0 + 44, "étiquette déroulée", "middle", 11) + T(116, y0 + 44, "11 cm", "start", 10) + T(210, y0 + 96, "longueur = périmètre du disque", "middle", 10);
    if (s === 2) g += `<circle cx="210" cy="22" r="17" class="f-soft" stroke="var(--ink)" stroke-width="1.2"/><circle cx="210" cy="164" r="17" class="f-soft" stroke="var(--ink)" stroke-width="1.2"/>` + T(234, 26, "fond", "start", 10) + T(234, 168, "couvercle", "start", 10);
    return svg(320, s === 2 ? 186 : 132, g, s === 2 ? "cylindre déplié avec ses deux disques" : "cylindre et son étiquette déroulée"); };
  // Aquarium 50 × 30 × 40 cm.
  const aquarium = () => svg(320, 140, box3(80, 128, 140, 100, 56, -24, "f-soft") + `<rect x="80" y="44" width="140" height="84" class="f-fill2" fill-opacity=".7"/>` + `<rect x="80" y="28" width="140" height="100" fill="none" stroke="var(--ink)" stroke-width="1.4"/>`
    + T(150, 140, "50 cm", "middle", 11) + T(256, 114, "30 cm", "start", 11) + T(72, 82, "40 cm", "end", 11), "aquarium de 50 cm sur 30 cm sur 40 cm");
  // Défis : 0 podium (3 pavés de base 5 dm × 4 dm, hauts de 3, 5 et 2 dm), 1 maison + toit, 2 piscine.
  const volFig = (s) => { let g = "";
    if (s === 0) { const k = 14, y = 128, dx = 40, dy = -20; g += box3(40, y, 5 * k, 3 * k, dx, dy) + box3(40 + 5 * k, y, 5 * k, 5 * k, dx, dy, "f-fill") + box3(40 + 10 * k, y, 5 * k, 2 * k, dx, dy);
      g += T(40 + 2.5 * k, y - 1.5 * k + 4, "3 dm", "middle", 10) + T(40 + 7.5 * k, y - 2.5 * k + 4, "5 dm", "middle", 10, "f-on") + T(40 + 12.5 * k, y - k + 4, "2 dm", "middle", 10) + T(40 + 7.5 * k, y + 14, "5 dm chacun", "middle", 10) + T(40 + 15 * k + dx / 2 + 6, y + dy / 2, "4 dm", "start", 10);
      return svg(320, 146, g, "podium de trois pavés"); }
    if (s === 1) { const x = 50, y = 130, w = 120, h = 54, t = 36, dx = 110, dy = -38;
      g += `<polygon points="${x + w / 2},${y - h - t} ${x + w / 2 + dx},${y - h - t + dy} ${x + w + dx},${y - h + dy} ${x + w},${y - h}" class="f-soft" stroke="var(--ink)" stroke-width="1.2"/>`
        + `<polygon points="${x + w},${y} ${x + w + dx},${y + dy} ${x + w + dx},${y - h + dy} ${x + w},${y - h}" class="f-soft" stroke="var(--ink)" stroke-width="1.2"/>`
        + `<polygon points="${x},${y} ${x + w},${y} ${x + w},${y - h} ${x + w / 2},${y - h - t} ${x},${y - h}" class="f-fill2" stroke="var(--ink)" stroke-width="1.2"/>` + L(x, y - h, x + w, y - h, "f-line", 1, "4 3") + L(x + w / 2, y - h, x + w / 2, y - h - t, "f-accent", 1.6, "4 3");
      g += T(x + w / 2, y + 14, "6 m", "middle", 11) + T(x - 6, y - h / 2 + 4, "3 m", "end", 11) + T(x + w / 2 + 5, y - h - t / 2 + 6, "2 m", "start", 11) + T(x + w + dx / 2 + 8, y + dy / 2 + 8, "10 m", "start", 11);
      return svg(320, 150, g, "maison : pavé surmonté d'un toit en prisme"); }
    g += box3(40, 110, 200, 50, 50, -30, "f-soft") + `<rect x="40" y="76" width="200" height="34" class="f-fill2"/>` + `<rect x="40" y="60" width="200" height="50" fill="none" stroke="var(--ink)" stroke-width="1.4"/>`
      + T(140, 124, "8 m", "middle", 11) + T(270, 96, "4 m", "start", 11) + T(34, 97, "1,5 m", "end", 11) + T(140, 96, "eau", "middle", 11);
    return svg(320, 132, g, "piscine de 8 m sur 4 m remplie sur 1,5 m"); };

  Object.assign(ACTIVE, {
    disque: {
      predict: { q: "Une roue de vélo a un diamètre de 70 cm. Quand elle fait un tour complet, le vélo avance d'environ…", fig: roue(), choices: ["70 cm", "2,2 m", "1,4 m"], good: 1,
        why: "Le vélo avance de la longueur du cercle : un peu plus de 3 fois le diamètre. Ce nombre, c'est π ≈ 3,14 : π · 70 ≈ 220 cm, soit 2,2 m." },
      defis: ["Un cercle a un rayon de 6 cm. Son périmètre vaut … π cm. Tape le nombre devant π.", "L'aire d'un disque vaut π · r². Une pizza a 30 cm de diamètre : son aire vaut … π cm².", "Un arroseur tourne de 120° et arrose jusqu'à 9 m. Aire arrosée : … π m² ?"],
      play: hunt({ ask: true, label: "Nombre devant π",
        blank: (s) => disc(s),
        show: (x, s) => disc(s) + plain(["Longueur du cercle : π · diamètre = π · (2 · 6)", "Rayon : 30 ÷ 2 = 15 cm ; aire : π · 15²", "120° sur 360° : c'est " + "1/3 du disque ; disque entier : π · 9² = 81π"][s] + "<br>tu proposes <b>" + nb(x) + "π</b> → " + ok(Math.abs(x - [12, 225, 27][s]) < 1e-9, x < [12, 225, 27][s])),
        miss: "Pas encore : relis le calcul sous la figure.",
        wins: [W(12, "Périmètre : π · 12 = 2 · π · 6 = 12π cm ≈ 37,7 cm."), W(225, "r = 15 cm : π · 15² = 225π cm² ≈ 706,9 cm². Avec le diamètre (π · 30²), on aurait 4 fois trop !"), W(27, "120/360 = 1/3 : 81π ÷ 3 = 27π m² ≈ 84,8 m².")] }),
    },
    grandmanq: {
      predict: { q: "Un triangle a une aire de 24 cm² et une base de 8 cm. Sa hauteur mesure…", fig: triDev(), choices: ["3 cm", "6 cm", "16 cm"], good: 1,
        why: "Aire = base · hauteur ÷ 2, donc 8 · h ÷ 2 = 24. On défait le calcul : 8 · h = 48, puis h = 48 ÷ 8 = 6 cm. 24 ÷ 8 = 3 oublie le ÷ 2." },
      defis: ["Un potager rectangulaire de 84 m² est large de 7 m. Quelle est sa longueur (en m) ?", "Une voile triangulaire a une aire de 15 m² et une base de 5 m. Sa hauteur (en m) ?", "Aire d'un trapèze : (B + b) · h ÷ 2. Aire 45 cm², bases 11 cm et 7 cm. Hauteur (en cm) ?"],
      play: hunt({ ask: true, label: "Longueur cherchée",
        blank: (s) => dimFig(s, null),
        show: (x, s) => dimFig(s, x) + plain(["7 · " + nb(x) + " = <b>" + nb(7 * x) + " m²</b> (cible 84) → " + ok(7 * x === 84, 7 * x < 84),
          "5 · " + nb(x) + " ÷ 2 = <b>" + nb((5 * x) / 2) + " m²</b> (cible 15) → " + ok(5 * x === 30, 5 * x < 30),
          "(11 + 7) · " + nb(x) + " ÷ 2 = 9 · " + nb(x) + " = <b>" + nb(9 * x) + " cm²</b> (cible 45) → " + ok(9 * x === 45, 9 * x < 45)][s]),
        wins: [W(12, "7 · ℓ = 84, donc ℓ = 84 ÷ 7 = 12 m."), W(6, "5 · h ÷ 2 = 15 : on double d'abord (5 · h = 30), puis h = 30 ÷ 5 = 6 m."), W(5, "(11 + 7) ÷ 2 = 9 : 9 · h = 45, donc h = 5 cm.")] }),
    },
    airelat: {
      predict: { q: "On repeint les 4 murs d'une pièce de 5 m sur 4 m, haute de 3 m (ni le sol ni le plafond). Surface à peindre ?", fig: piece(), choices: ["60 m²", "54 m²", "27 m²"], good: 1,
        why: "On « déplie » les 4 murs : un long rectangle de 5 + 4 + 5 + 4 = 18 m sur 3 m, soit 54 m². 60, c'est 5 · 4 · 3 : le volume (en m³) ; 27 oublie deux murs." },
      defis: ["Une boîte de chocolats est un prisme : base en triangle équilatéral de 4 cm, longueur 20 cm. Aire latérale (en cm²) ?", "Boîte de conserve : rayon 4 cm, hauteur 11 cm. Aire de l'étiquette : … π cm² ?", "Même boîte, avec le fond et le couvercle : aire totale … π cm² ?"],
      play: hunt({ ask: true, label: (s) => (s ? "Nombre devant π" : "Aire latérale (cm²)"),
        blank: (s) => latFig(s),
        show: (x, s) => { const t = [240, 88, 120][s]; return latFig(s) + plain(["3 rectangles de 4 cm sur 20 cm : périmètre de la base · longueur = (4 + 4 + 4) · 20", "Périmètre du disque : 2 · π · 4 = 8π ; aire de l'étiquette : 8π · 11", "Étiquette 88π, plus 2 disques de π · 4² chacun"][s] + "<br>tu proposes <b>" + nb(x) + (s ? "π" : "") + "</b> → " + ok(Math.abs(x - t) < 1e-9, x < t)); },
        miss: "Pas encore : relis le calcul sous la figure.",
        wins: [W(240, "12 · 20 = 240 cm² : aire latérale = périmètre de la base · hauteur du prisme."), W(88, "2 · π · 4 · 11 = 88π cm² ≈ 276,5 cm²."), W(120, "88π + 2 · 16π = 120π cm² ≈ 377 cm². Aire totale = aire latérale + 2 bases.")] }),
    },
    voldecomp: {
      predict: { q: "Un aquarium mesure 50 cm × 30 cm × 40 cm. Plein, il contient…", fig: aquarium(), choices: ["60 L", "600 L", "6 L"], good: 0,
        why: "En dm : 5 · 3 · 4 = 60 dm³, et 1 dm³ = 1 L, donc 60 L. En cm : 60'000 cm³ ÷ 1000 = 60 L (1 L = 1000 cm³)." },
      defis: ["Un podium est fait de 3 pavés de base 5 dm × 4 dm, hauts de 3, 5 et 2 dm. Volume total (en dm³) ?", "Maison : pavé de 10 m × 6 m × 3 m, toit en prisme (triangle de base 6 m, haut de 2 m). Volume (en m³) ?", "Une piscine de 8 m × 4 m est remplie sur 1,5 m. Combien de litres d'eau ?"],
      play: hunt({ ask: true, label: (s) => ["Volume (dm³)", "Volume (m³)", "Contenance (L)"][s],
        blank: (s) => volFig(s),
        show: (x, s) => { const t = [200, 240, 48000][s]; return volFig(s) + plain(["Chaque marche : 5 · 4 · hauteur ; on additionne les 3 pavés", "Pavé 10 · 6 · 3 ; toit : aire du triangle (6 · 2 ÷ 2) · 10", "8 · 4 · 1,5 = 48 m³ ; 1 m³ = 1000 L"][s] + "<br>tu proposes <b>" + nb(x) + ["", "", " L"][s] + "</b> → " + ok(Math.abs(x - t) < 1e-9, x < t)); },
        miss: "Pas encore : relis le calcul sous la figure.",
        wins: [W(200, "20 · 3 + 20 · 5 + 20 · 2 = 60 + 100 + 40 = 200 dm³ (= 20 · 10, même base)."), W(240, "180 m³ + 60 m³ = 240 m³. Le toit n'est pas un pavé : on divise par 2."), W(48000, "48 m³ = 48'000 L.")] }),
    },
  });
})();
