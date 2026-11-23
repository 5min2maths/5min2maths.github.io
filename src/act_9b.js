// Chantier 9e, chapitres 7 à 12 (23.11) : leçons actives (devine / défis / retiens) pour les 11 notions qui n'en
// avaient pas : solides, volpave (7. 3D), fracrep, fracsimp, fracper (8. Écriture fractionnaire), proptab, prop, change,
// agrand (9. Proportionnalité), symetries (11. Transformations), diagr (12. Diagrammes). Calibré sur les MER 9e
// (CIIP 2024 : NO178–NO196, FA14–FA34, ES99–ES107, ES122–ES145, GM55–GM60). Même moteur que act_ch11c.js (outils
// recopiés : chaque fichier reste autonome). Vraies manipulations (règle du 22.11) : placer une fraction sur la droite
// (curseur), découper / regrouper des parts, toucher l'image d'un point sur un quadrillage ; ailleurs, mode réponse
// (l'élève calcule et tape) avec une figure qui réagit.
(function () {
  // ---------- outils ----------
  const nb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;
  const T = (x, y, s, a = "middle", sz = 12, cls = "f-txt") => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${a}" font-size="${sz}">${s}</text>`;
  // Épaisseur en style (la règle CSS .f-line l'emporterait sur l'attribut) ; cls "grid" : trait fin et clair du quadrillage.
  const L = (x1, y1, x2, y2, cls = "f-line", w = 1.6, dash) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls === "grid" ? "f-line" : cls}" style="stroke-width:${w}${cls === "grid" ? ";stroke:var(--line)" : ""}"${dash ? ' stroke-dasharray="4 3"' : ""}/>`;
  const plain = (html) => `<div class="act-out">${html}</div>`;
  // Chercheur en mode réponse (o.ask) : l'élève calcule et tape ; la figure se met à jour après « Vérifier ».
  // o.miss peut être une fonction (x, s) → message ciblé sur l'erreur probable.
  // o et mk gardés sur la fonction : actPrep (active.js) peut ne garder que 2 questions (22.11).
  const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });
  const hunt0 = (o) => (box, onWin) => {
    let x = null, step = 0;
    const draw = () => {
      const s = Math.min(step, o.wins.length - 1), fig = x === null ? (o.blank ? o.blank(s) : "") : o.show(x, s);
      box.innerHTML = fig + actAnswerHtml(o.label || "Ta réponse") + (o.note ? `<div class="small muted">${o.note}</div>` : "");
      const inp = box.querySelector(".act-in"); if (x !== null) inp.value = nb(x).replace("−", "-");
      const go = () => { const v = Number(String(inp.value).replace(/,/g, ".").replace("−", "-").replace(/[\s']/g, "").replace(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/, (m, u, w) => String(u / w)));
        if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre."); return; }
        x = v; const s0 = step; draw();
        if (!check()) { const m = typeof o.miss === "function" ? o.miss(x, s0) : o.miss; $hint(box, m || (box.querySelector("svg.fig") ? "Pas encore : regarde la figure, puis recalcule." : "Pas encore : relis le coup de pouce, puis recalcule.")); } };
      actAnswerBind(box, go);
    };
    const check = () => { if (step >= o.wins.length) return false; const m = o.wins[step](x); if (m) { onWin(step, m); step++; x = null; draw(); return true; } return false; };
    draw();
  };
  const W = (target, msg) => (x) => (Math.abs(x - target) < 1e-6 ? msg : "");
  const tdS = "padding:4px 10px;border:1px solid var(--line);text-align:center";
  // Tableau à deux lignes ; une case « ? » (ou la valeur proposée, en couleur).
  const table = (h1, h2, r1, r2) => `<div class="act-out" style="overflow-x:auto"><table style="margin:auto;border-collapse:collapse"><tr><th style="${tdS}">${h1}</th>${r1.map((c) => `<td style="${tdS}">${c}</td>`).join("")}</tr><tr><th style="${tdS}">${h2}</th>${r2.map((c) => `<td style="${tdS}">${c}</td>`).join("")}</tr></table></div>`;
  const q = (x) => (x === null || x === undefined ? '<b style="color:var(--margin)">?</b>' : `<b style="color:var(--margin)">${nb(x)}</b>`);

  // ---------- figures ----------
  // Prisme droit à base de n côtés, en perspective (arêtes cachées en pointillé).
  const prism = (n, lab) => {
    const cx = 160, rx = 78, ry = 22, yb = 140, yt = 52, off = n % 2 ? 0 : Math.PI / n;
    const P = [...Array(n).keys()].map((k) => { const a = Math.PI / 2 + (2 * Math.PI * k) / n + off; return [cx + rx * Math.cos(a), ry * Math.sin(a)]; });
    const xs = P.map((p) => p[0]), xmin = Math.min(...xs), xmax = Math.max(...xs);
    const back = (p) => p[1] < -0.5 && p[0] > xmin + 0.5 && p[0] < xmax - 0.5;
    let g = `<polygon points="${P.map((p) => p[0] + "," + (yt + p[1])).join(" ")}" class="f-fill2"/>`;
    for (let k = 0; k < n; k++) {
      const p = P[k], r = P[(k + 1) % n], hid = (p[1] + r[1]) / 2 < -0.5;
      g += L(p[0], yb + p[1], r[0], yb + r[1], "f-line", 1.6, hid);
      g += L(p[0], yt + p[1], p[0], yb + p[1], "f-line", 1.6, back(p));
    }
    for (const p of P) g += `<circle cx="${p[0]}" cy="${yt + p[1]}" r="2.6" class="f-dot"/><circle cx="${p[0]}" cy="${yb + p[1]}" r="2.6" class="f-dot"/>`;
    return svg(320, 172, g + (lab ? T(160, 18, lab, "middle", 12) : ""), "prisme droit à base de " + n + " côtés");
  };
  // Pavé a × b × c en perspective cavalière ; grid : cubes-unités dessinés.
  const cuboid = (a, b, c, grid, labs) => {
    const u = Math.min(26, 230 / (a + b * 0.5), 120 / (c + b * 0.5)), dx = u * 0.5, dy = u * 0.5, x0 = 44, y0 = 20 + c * u + b * dy;
    const pt = (i, j, k) => [x0 + i * u + j * dx, y0 - k * u - j * dy]; // i : longueur, j : profondeur, k : hauteur
    const poly = (ps, cls) => `<polygon points="${ps.map((p) => p.join(",")).join(" ")}" class="${cls}" stroke="var(--ink)" stroke-width="1.4"/>`;
    let g = poly([pt(0, 0, 0), pt(a, 0, 0), pt(a, 0, c), pt(0, 0, c)], "f-fill2") + poly([pt(0, 0, c), pt(a, 0, c), pt(a, b, c), pt(0, b, c)], "f-soft") + poly([pt(a, 0, 0), pt(a, b, 0), pt(a, b, c), pt(a, 0, c)], "f-shape");
    const seg = (p, r) => L(p[0], p[1], r[0], r[1], "f-line", 0.7);
    if (grid) {
      for (let i = 1; i < a; i++) g += seg(pt(i, 0, 0), pt(i, 0, c)) + seg(pt(i, 0, c), pt(i, b, c));
      for (let k = 1; k < c; k++) g += seg(pt(0, 0, k), pt(a, 0, k)) + seg(pt(a, 0, k), pt(a, b, k));
      for (let j = 1; j < b; j++) g += seg(pt(0, j, c), pt(a, j, c)) + seg(pt(a, j, 0), pt(a, j, c));
    }
    if (labs) { const [la, lb, lc] = labs, A = pt(a / 2, 0, 0), B = pt(a, b / 2, 0), C = pt(0, 0, c / 2);
      g += T(A[0], A[1] + 16, la) + T(B[0] + 8, B[1] + 8, lb, "start") + T(C[0] - 6, C[1] + 4, lc, "end"); }
    return svg(320, y0 + 26, g, "pavé droit " + a + " sur " + b + " sur " + c);
  };
  // Patron d'un cube (croix), arête étiquetée.
  const cubeNet = (lab) => { const s = 42, x0 = 76, y0 = 6; let g = "";
    for (const [i, j] of [[0, 1], [1, 0], [1, 1], [1, 2], [1, 3], [2, 1]]) g += `<rect x="${x0 + j * s}" y="${y0 + i * s}" width="${s}" height="${s}" class="f-fill2" stroke="var(--ink)" stroke-width="1.4"/>`;
    g += T(x0 + 1.5 * s, y0 + s * 3 + 16, lab) ;
    return svg(320, y0 + 3 * s + 24, g, "patron d'un cube"); };
  // Droite des règles de trois : trois lignes « quantité → valeur », flèches de passage à gauche et à droite.
  const flow = (rows, opsL, opsR, hi = -1) => { let g = ""; const Y = [26, 76, 126];
    rows.forEach(([l, r], i) => { if (!l) return; g += `<rect x="52" y="${Y[i] - 16}" width="92" height="26" rx="5" class="f-soft"/><rect x="176" y="${Y[i] - 16}" width="92" height="26" rx="5" class="f-soft"/>` + T(98, Y[i] + 2, l, "middle", 13) + T(222, Y[i] + 2, r, "middle", 13, i === hi || r.includes("?") ? "f-txt f-accent" : "f-txt") + T(160, Y[i] + 2, "→", "middle", 13); });
    for (let i = 0; i < 2; i++) { if (opsL[i]) g += `<path d="M50,${Y[i] + 2} Q28,${(Y[i] + Y[i + 1]) / 2} 50,${Y[i + 1] - 6}" class="f-blue" fill="none" stroke-width="1.6"/>` + T(22, (Y[i] + Y[i + 1]) / 2 + 4, opsL[i], "middle", 12, "f-txt f-blue");
      if (opsR[i]) g += `<path d="M270,${Y[i] + 2} Q292,${(Y[i] + Y[i + 1]) / 2} 270,${Y[i + 1] - 6}" class="f-blue" fill="none" stroke-width="1.6"/>` + T(300, (Y[i] + Y[i + 1]) / 2 + 4, opsR[i], "middle", 12, "f-txt f-blue"); }
    return svg(320, rows[2][0] ? 146 : 96, g, "passage par l'unité"); };
  // Double droite graduée de change : EUR en haut, CHF en bas, repère 100 EUR ↔ 95 CHF ; la valeur cherchée en couleur.
  const change2 = (eur, chf, hi) => { const M = Math.max(eur || 0, chf || 0, 100) * 1.1, X = (v) => 46 + (v * 256) / M;
    let g = L(42, 44, 308, 44) + L(42, 104, 308, 104) + T(4, 48, "EUR", "start", 11, "f-txt f-blue") + T(4, 108, "CHF", "start", 11, "f-txt f-blue");
    g += L(X(0), 38, X(0), 50) + L(X(0), 98, X(0), 110) + T(X(0), 32, "0", "middle", 11) + T(X(0), 124, "0", "middle", 11);
    g += L(X(100), 44, X(95), 104, "f-line", 1, true) + `<circle cx="${X(100)}" cy="44" r="3.5" class="f-line"/><circle cx="${X(95)}" cy="104" r="3.5" class="f-line"/>` + T(X(100), 32, "100", "middle", 11) + T(X(95), 124, "95", "middle", 11);
    if (eur !== null && chf !== null) g += L(X(eur), 44, X(chf), 104, "f-accent", 1.6, true);
    if (eur !== null) g += `<circle cx="${X(eur)}" cy="44" r="5" class="f-dot"/>` + T(X(eur), 22, nb(eur), "middle", 13, hi === "e" ? "f-txt f-accent" : "f-txt");
    if (chf !== null) g += `<circle cx="${X(chf)}" cy="104" r="5" class="f-dot"/>` + T(X(chf), 140, nb(chf), "middle", 13, hi === "c" ? "f-txt f-accent" : "f-txt");
    else if (eur !== null) g += T(X(eur * 0.95), 140, "?", "middle", 14, "f-txt f-accent");
    if (eur === null && chf !== null) g += T(X(chf / 0.95), 22, "?", "middle", 14, "f-txt f-accent");
    return svg(320, 146, g, "double droite graduée euros et francs"); };
  const chg = (e, c, hi) => { const ok = (v) => v !== null && isFinite(v) && v > 0 && v < 2000; return change2(ok(e) ? e : null, ok(c) ? c : null, hi); };
  // Rectangle de départ et son image (u px par cm).
  const rects = (w1, h1, w2, h2, labs, u) => { const x1 = 52, x2 = x1 + w1 * u + 56;
    let g = `<rect x="${x1}" y="${150 - h1 * u}" width="${w1 * u}" height="${h1 * u}" class="f-fill2" stroke="var(--ink)" stroke-width="1.4"/>` + T(x1 + (w1 * u) / 2, 166, labs[0]) + T(x1 - 4, 154 - (h1 * u) / 2, labs[1], "end");
    if (h2 > 0 && w2 * u < 200 && h2 * u < 146) g += `<rect x="${x2}" y="${150 - h2 * u}" width="${w2 * u}" height="${h2 * u}" class="f-shape"/>` + T(x2 - 4, 154 - (h2 * u) / 2, labs[3], "end", 12, "f-txt f-accent");
    else g += L(x2, 150, x2 + Math.min(w2 * u, 312 - x2), 150, "f-accent", 3) + (labs[3] ? T(x2 + 6, 120, labs[3], "start", 14, "f-txt f-accent") : "");
    g += T(x2 + Math.min(w2 * u, 312 - x2) / 2, 166, labs[2]);
    return svg(320, 172, g, "rectangle et son agrandissement"); };
  // Triangle de côtés 12 (base), 8 et 10, et son image au facteur k.
  const tri = (k, labs) => { const pts = (s, x0) => { const a = 12 * s, b = 10 * s, c = 8 * s, xa = (a * a + c * c - b * b) / (2 * a), ya = Math.sqrt(Math.max(0, c * c - xa * xa)); return [[x0, 100], [x0 + a, 100], [x0 + xa, 100 - ya]]; };
    const draw = (P, cls, lb) => `<polygon points="${P.map((p) => p.join(",")).join(" ")}" class="${cls}"/>` + T((P[0][0] + P[1][0]) / 2, 116, lb[0]) + T((P[0][0] + P[2][0]) / 2 - 6, (P[0][1] + P[2][1]) / 2, lb[1], "end", 12, /\?/.test(lb[1]) ? "f-txt f-accent" : "f-txt") + T((P[1][0] + P[2][0]) / 2 + 6, (P[1][1] + P[2][1]) / 2, lb[2], "start");
    let g = draw(pts(8.5, 20), "f-fill2", ["12 cm", "8 cm", "10 cm"]);
    if (k > 0 && k < 1.15) g += draw(pts(8.5 * k, 190), "f-shape", labs);
    else g += L(190, 100, 190 + 9 * 8.5, 100, "f-accent", 3) + T(190 + 4.5 * 8.5, 116, "9 cm") + T(190 + 3 * 8.5, 76, "?", "middle", 14, "f-txt f-accent");
    return svg(320, 124, g, "triangle et sa réduction"); };
  // Diagramme en colonnes.
  const bars = (xs, ys, yl, xl, hi) => { const M = Math.max(...ys), H = 110, bw = Math.min(46, 220 / xs.length), x0 = 60; let g = L(x0, 130, 310, 130) + L(x0, 130, x0, 10);
    for (let v = 0; v <= M; v += M > 12 ? 5 : 1) g += L(x0 - 4, 130 - (v * H) / M, x0, 130 - (v * H) / M, "f-line", 1) + T(x0 - 7, 134 - (v * H) / M, v, "end", 10);
    xs.forEach((x, i) => { const xc = x0 + 20 + i * (bw + 14); g += `<rect x="${xc}" y="${130 - (ys[i] * H) / M}" width="${bw}" height="${(ys[i] * H) / M}" class="${hi === i ? "f-fill" : "f-fill2"}"/>` + T(xc + bw / 2, 146, x, "middle", 11); });
    return svg(320, 176, g + T(x0, 6 + 2, yl, "start", 10, "f-txt f-blue") + T(310, 166, xl, "end", 10, "f-txt f-blue"), "diagramme en colonnes"); };
  // Diagramme circulaire : un secteur de a degrés.
  const pie = (a, lab) => { const r = 62, cx = 160, cy = 76; let g = `<circle cx="${cx}" cy="${cy}" r="${r}" class="f-soft" stroke="var(--ink)" stroke-width="1.4"/>`;
    if (a > 0 && a < 360) { const t = ((a - 90) * Math.PI) / 180, x = cx + r * Math.cos(t), y = cy + r * Math.sin(t); g += `<path d="M${cx},${cy} L${cx},${cy - r} A${r},${r} 0 ${a > 180 ? 1 : 0} 1 ${x.toFixed(1)},${y.toFixed(1)} Z" class="f-fill"/>`; }
    return svg(320, 156, g + T(cx, 152, lab, "middle", 12), "diagramme circulaire"); };

  Object.assign(ACTIVE, {
    // ---------- 7. 3D ----------
    solides: {
      predict: { q: "Une tente a la forme d'un prisme couché, à base triangulaire. Combien de faces a ce solide ?", choices: ["3", "5", "6"], good: 1,
        why: "3 faces rectangulaires (les deux pans du toit et le sol), plus les 2 bases triangulaires (l'avant et l'arrière) : 5 faces. On oublie souvent les bases." },
      defis: ["Ce prisme droit a une base à 5 côtés (un pentagone). Combien a-t-il de sommets ?", "Ce prisme droit a une base à 6 côtés (un hexagone). Combien a-t-il d'arêtes ?", "Un prisme droit a 30 arêtes. Combien de côtés a sa base ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        blank: (s) => (s < 2 ? prism(s ? 6 : 5) : plain("Un prisme droit, des arêtes de trois sortes : celles de la base du bas, celles de la base du haut, et les arêtes verticales.")),
        show: (x, s) => (s < 2 ? prism(s ? 6 : 5) + plain("tu proposes <b>" + nb(x) + "</b>") : (Number.isInteger(x) && x >= 3 && x <= 12 ? prism(x, "base à " + x + " côtés : " + 3 * x + " arêtes") : "") + plain("base à " + nb(x) + " côtés → " + nb(x) + " + " + nb(x) + " + " + nb(x) + " = <b>" + nb(3 * x) + "</b> arêtes (il en faut 30)")),
        miss: (x, s) => (s === 0 && x === 5 ? "5, c'est la base du haut : compte aussi les sommets du bas." : s === 1 && x === 12 ? "Tu as compté les deux bases : il manque les arêtes verticales." : s === 2 && x === 15 ? "Avec 15 côtés, la base du haut aurait déjà 15 arêtes, celle du bas 15 aussi…" : ""),
        wins: [W(10, "5 sommets en haut, 5 en bas : 10 sommets (2 · 5)."), W(18, "6 arêtes en haut, 6 en bas, 6 verticales : 18 arêtes (3 · 6)."), W(10, "30 = 3 · 10 : la base a 10 côtés (10 en haut, 10 en bas, 10 verticales).")] }),
    },
    volpave: {
      predict: { q: "Combien de petits cubes de 1 cm d'arête faut-il pour construire un cube de 2 cm d'arête ?", choices: ["4", "6", "8"], good: 2,
        why: "Deux étages de 2 · 2 = 4 cubes : 2 · 2 · 2 = 8. Le cube a 6 faces, mais il est fait de 8 petits cubes." },
      defis: ["Combien de cubes-unités forment ce pavé ?", "Un pavé mesure 8 cm × 5 cm × 3 cm. Quel est son volume (en cm³) ?", "Un cube a des arêtes de 5 cm. Quelle est l'aire totale de ses 6 faces (en cm²) ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        blank: (s) => [cuboid(4, 3, 2, true), cuboid(8, 5, 3, false, ["8 cm", "5 cm", "3 cm"]), cubeNet("chaque arête : 5 cm")][s],
        show: (x, s) => [cuboid(4, 3, 2, true) + plain("un étage : 4 · 3 cubes ; il y a 2 étages · tu proposes <b>" + nb(x) + "</b>"), cuboid(8, 5, 3, true, ["8 cm", "5 cm", "3 cm"]) + plain("tu proposes <b>" + nb(x) + " cm³</b>"), cubeNet("chaque arête : 5 cm") + plain("6 faces carrées · tu proposes <b>" + nb(x) + " cm²</b>")][s],
        miss: (x, s) => (s === 1 && x === 16 ? "8 + 5 + 3 : on n'additionne pas, on compte des cubes : longueur · largeur · hauteur." : s === 2 && x === 125 ? "125 cm³, c'est le volume. Ici on veut l'aire : la surface des 6 faces." : s === 2 && x === 25 ? "25 cm², c'est une seule face. Combien de faces ?" : ""),
        wins: [W(24, "4 · 3 = 12 cubes par étage, 2 étages : 24 cubes, donc 24 cm³ si les cubes ont 1 cm d'arête."), W(120, "8 · 5 · 3 = 120 cm³ : 40 cubes par étage, 3 étages."), W(150, "Une face : 5 · 5 = 25 cm² ; 6 faces : 150 cm². Une aire se mesure en cm², un volume en cm³.")] }),
    },

    // ---------- 8. Écriture fractionnaire ----------
    fracrep: {
      predict: { q: "Quelle fraction est la plus grande : 1/3 ou 1/4 ?", choices: ["1/3", "1/4", "elles sont égales"], good: 0,
        why: "Partager en 3 donne de plus grosses parts que partager en 4 : 1/3 > 1/4, même si 4 est plus grand que 3." },
      defis: ["Place \\(\\frac{7}{4}\\) sur la droite graduée.", "La droite est maintenant graduée en sixièmes. Place \\(\\frac{2}{3}\\).", "En douzièmes, place la plus grande des deux fractions \\(\\frac{3}{4}\\) et \\(\\frac{5}{6}\\)."],
      play(box, onWin) {
        const D = [4, 6, 12];
        let step = 0, k = 1;
        const draw = () => {
          const d = D[Math.min(step, 2)], X = (v) => 20 + (v * 280) / 2;
          let g = L(14, 50, 306, 50);
          for (let i = 0; i <= 2 * d; i++) { const big = i % d === 0; g += L(X(i / d), big ? 40 : 45, X(i / d), big ? 60 : 55, "f-line", big ? 1.8 : 1); if (big) g += T(X(i / d), 78, i / d, "middle", 13); }
          g += `<circle cx="${X(k / d)}" cy="50" r="7" class="f-dot"/>` + T(X(k / d), 26, k + "/" + d, "middle", 13, "f-txt f-accent");
          const ent = k % d === 0 ? " = " + k / d : "", enc = k % d ? " · entre " + Math.floor(k / d) + " et " + (Math.floor(k / d) + 1) : "";
          box.innerHTML = svg(320, 88, g, "droite graduée de 0 à 2 en " + d + "es") + `<label class="dyn-ctl"><input type="range" min="0" max="${2 * d}" step="1" value="${k}" aria-label="déplacer le point"><span class="small muted">Fais glisser le point sur la droite.</span></label>
            <div class="act-out">Le point est sur <b>${k}/${d}</b>${ent}${enc}</div>`;
          const inp = box.querySelector("input");
          inp.oninput = () => { k = +inp.value; draw(); box.querySelector("input").focus(); check(); };
        };
        const check = () => {
          if (step === 0 && k === 7) { onWin(0, "7/4 = 4/4 + 3/4 = 1 + 3/4 : entre 1 et 2."); step = 1; k = 1; draw(); }
          else if (step === 1 && k === 4) { onWin(1, "2/3 = 4/6 : on a coupé chaque tiers en 2. Même point, autre écriture."); step = 2; k = 1; draw(); }
          else if (step === 2 && k === 10) { onWin(2, "5/6 = 10/12 et 3/4 = 9/12 : avec le même dénominateur, on compare les numérateurs. 5/6 > 3/4."); step = 3; }
          else if (step === 2 && k === 9) $hint(box, "9/12 = 3/4. Et 5/6, c'est combien de douzièmes ?");
          else if (step === 0 && k === 4) $hint(box, "4/4, c'est 1. Il faut 7 quarts.");
        };
        draw();
      },
    },
    fracsimp: {
      predict: { q: "Compare 2/3 et 4/6.", choices: ["2/3 est plus grand", "elles sont égales", "4/6 est plus grand"], good: 1,
        fig: svg(320, 64, (() => { let g = ""; for (const [a, b, y] of [[2, 3, 6], [4, 6, 36]]) for (let i = 0; i < b; i++) g += `<rect x="${20 + (i * 280) / b}" y="${y}" width="${280 / b}" height="22" class="${i < a ? "f-fill" : "f-soft"}" style="stroke:var(--ink);stroke-width:1.2"/>`; return g; })(), "barres 2 sur 3 et 4 sur 6"),
        why: "Si on coupe chaque tiers en 2, on obtient des sixièmes : 2 tiers = 4 sixièmes. Même quantité, autre écriture." },
      defis: ["Découpe les parts pour écrire \\(\\frac{3}{4}\\) avec le dénominateur 12.", "Regroupe les parts pour rendre \\(\\frac{12}{18}\\) irréductible.", "Passe de \\(\\frac{6}{8}\\) à \\(\\frac{9}{12}\\)."],
      play(box, onWin) {
        const S = [[3, 4], [12, 18], [6, 8]];
        let step = 0, a = 3, b = 4, hist = ["3/4"];
        const reset = () => { [a, b] = S[Math.min(step, 2)]; hist = [a + "/" + b]; };
        const draw = (msg) => {
          let g = "";
          for (let i = 0; i < b; i++) g += `<rect x="${20 + (i * 280) / b}" y="8" width="${280 / b}" height="34" class="${i < a ? "f-fill" : "f-soft"}" style="stroke:var(--ink);stroke-width:${b > 24 ? 0.6 : 1.2}"/>`;
          box.innerHTML = svg(320, 50, g, a + " parts coloriées sur " + b) + `<div class="act-out" style="text-align:center"><b>${hist.join(" = ")}</b></div>
            <div class="small muted">Découpe chaque part en</div><div class="seg">${[2, 3, 4, 5].map((k) => `<button type="button" data-cut="${k}"${b * k > 48 ? " disabled" : ""}>${k}</button>`).join("")}</div>
            <div class="small muted">Regroupe les parts par</div><div class="seg">${[2, 3, 5].map((k) => `<button type="button" data-grp="${k}">${k}</button>`).join("")}</div>
            <button type="button" class="btn-ghost small" data-reset>Recommencer</button>`;
          box.querySelectorAll("[data-cut]").forEach((el) => (el.onclick = () => { const k = +el.dataset.cut; a *= k; b *= k; hist.push(a + "/" + b); draw(); check(); }));
          box.querySelectorAll("[data-grp]").forEach((el) => (el.onclick = () => { const k = +el.dataset.grp;
            if (a % k || b % k) { draw(); $hint(box, "Impossible : il faut pouvoir regrouper les " + a + " parts coloriées ET les " + b + " parts en paquets de " + k + "."); return; }
            a /= k; b /= k; hist.push(a + "/" + b); draw(); check(); }));
          box.querySelector("[data-reset]").onclick = () => { reset(); draw(); };
          if (msg) $hint(box, msg);
        };
        const check = () => {
          if (step === 0) { if (a === 9 && b === 12) { onWin(0, "3/4 = 9/12 : on a multiplié le numérateur ET le dénominateur par 3 (amplifier)."); step = 1; reset(); draw(); } else if (12 % b) draw(b + " ne divise pas 12 : en découpant encore, tu n'arriveras jamais à 12 parts. Recommence."); }
          else if (step === 1) { if (gcd(a, b) === 1) { onWin(1, "12/18 = 2/3 : on a divisé par 2 puis par 3, donc par 6 (le PGDC de 12 et 18). On ne peut plus simplifier."); step = 2; reset(); draw(); } else if (b < 18) draw(a + "/" + b + " est simplifiée, mais on peut encore regrouper."); }
          else if (step === 2 && a === 9 && b === 12) { onWin(2, "6/8 = 3/4 = 9/12 : on simplifie par 2, puis on amplifie par 3. Les trois fractions sont égales."); step = 3; }
        };
        draw();
      },
    },
    fracper: {
      garde: [0, 2],
      predict: { q: "Combien vaut 1 ÷ 3 ?", choices: ["0,3", "0,33", "0,333… (des 3 sans fin)"], good: 2,
        why: "En posant 1 ÷ 3, le reste 1 revient à chaque étape : le chiffre 3 se répète sans fin. 0,33 = 33/100 est un peu plus petit que 1/3." },
      defis: ["Calcule 8 ÷ 3. Quel chiffre se répète sans fin après la virgule ?", "Calcule 5 ÷ 11. Quel groupe de deux chiffres se répète ? (écris-le comme un nombre)", "On sait que \\(0{,}111\\ldots = \\frac{1}{9}\\). Écris \\(1{,}222\\ldots\\) comme une fraction de dénominateur 9 : quel est son numérateur ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        show: (x, s) => plain(["8 ÷ 3 = 2, reste 2. On ajoute un 0 : 20 ÷ 3 = ? reste ? Le même reste revient-il ?", "5 ÷ 11 = 0, reste 5. 50 ÷ 11 = 4, reste 6. Puis 60 ÷ 11 = ? reste ? … jusqu'à retrouver le reste 5.", "1,222… = 1 + 0,222… ; et 0,222… = 2 · 0,111… = 2/9. Combien de neuvièmes dans 1 ?"][s]),
        // Mode « À toi » (2 questions, garde) : s est l'indice dans garde, d'où [0, 2][s].
        miss: (x, s) => ([0, 2][s] === 2 && x === 12 ? "1,222… n'est pas 12/9 : 12/9 = 1,333…" : [0, 2][s] === 2 && x === 2 ? "2/9 = 0,222… : il manque l'unité, 1 = 9/9." : ""),
        wins: [W(6, "8 ÷ 3 = 2,666… : le reste 2 revient sans cesse, le 6 se répète."), W(45, "5 ÷ 11 = 0,454545… : les restes 5 et 6 alternent, la période est 45."), W(11, "1,222… = 9/9 + 2/9 = 11/9.")] }),
    },

    // ---------- 9. Proportionnalité ----------
    proptab: {
      predict: { q: "Un taxi coûte 6 CHF au départ, puis 2 CHF par km. Le prix est-il proportionnel au nombre de km ?", choices: ["Oui", "Non"], good: 1,
        why: "1 km coûte 6 + 2 = 8 CHF ; 2 km coûtent 6 + 4 = 10 CHF, pas le double (16 CHF). Il n'y a pas un nombre fixe par lequel multiplier : ce n'est pas proportionnel." },
      defis: ["Le tableau est proportionnel. Par quel nombre multiplie-t-on la 1re ligne pour obtenir la 2e ?", "Une piste mesure 0,4 km : complète le tableau.", "Sans chercher le coefficient : 6 cahiers coûtent 15 CHF et 4 cahiers 10 CHF. Combien coûtent 10 cahiers ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        blank: (s) => [table("Masse (kg)", "Prix (CHF)", [4, 6, 10], [14, 21, 35]) + plain("4 · " + q() + " = 14"), table("Tours", "Distance (km)", [1, 5, 8], ["0,4", 2, q()]), table("Cahiers", "Prix (CHF)", [6, 4, 10], [15, 10, q()])][s],
        show: (x, s) => [table("Masse (kg)", "Prix (CHF)", [4, 6, 10], [14, 21, 35]) + plain("4 · " + q(x) + " = " + nb(4 * x) + " ; 6 · " + q(x) + " = " + nb(6 * x)), table("Tours", "Distance (km)", [1, 5, 8], ["0,4", 2, q(x)]) + plain("1 tour → 0,4 km"), table("Cahiers", "Prix (CHF)", [6, 4, 10], [15, 10, q(x)]) + plain("Regarde la 1re ligne : 6 + 4 = 10.")][s],
        miss: (x, s) => (s === 0 && x === 10 ? "14 − 4 = 10 est une différence. On cherche un facteur : 14 ÷ 4." : s === 1 && x === 5 ? "On n'ajoute pas 3 : on multiplie par 0,4." : ""),
        wins: [W(3.5, "14 ÷ 4 = 3,5 ; vérifie : 6 · 3,5 = 21 et 10 · 3,5 = 35. Le coefficient est 3,5."), W(3.2, "8 · 0,4 = 3,2 km (et 5 · 0,4 = 2 km)."), W(25, "6 + 4 = 10 cahiers, donc 15 + 10 = 25 CHF : dans un tableau proportionnel, on peut additionner des colonnes.")] }),
    },
    prop: {
      predict: { q: "4 croissants coûtent 6 CHF. Combien coûtent 6 croissants ?", choices: ["8 CHF", "9 CHF", "12 CHF"], good: 1,
        why: "1 croissant coûte 6 ÷ 4 = 1,50 CHF, donc 6 croissants : 6 · 1,50 = 9 CHF. Deux croissants de plus ne coûtent pas 2 CHF de plus." },
      defis: ["5 m de tissu coûtent 42 CHF. Combien coûte 1 m ?", "Combien coûtent 8 m de ce tissu ?", "Une voiture consomme 6,3 L d'essence pour 90 km. Combien pour 250 km ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        blank: (s) => [flow([["5 m", "42 CHF"], ["1 m", "? CHF"], ["", ""]], ["÷ 5", ""], ["÷ 5", ""]), flow([["5 m", "42 CHF"], ["1 m", "8,4 CHF"], ["8 m", "? CHF"]], ["÷ 5", "· 8"], ["÷ 5", "· 8"]), flow([["90 km", "6,3 L"], ["10 km", "…"], ["250 km", "? L"]], ["÷ 9", "· 25"], ["÷ 9", "· 25"])][s],
        show: (x, s) => [flow([["5 m", "42 CHF"], ["1 m", nb(x) + " CHF"], ["", ""]], ["÷ 5", ""], ["÷ 5", ""], 1) + plain("vérifie : 5 · " + nb(x) + " = " + nb(5 * x) + " (il faut 42)"), flow([["5 m", "42 CHF"], ["1 m", "8,4 CHF"], ["8 m", nb(x) + " CHF"]], ["÷ 5", "· 8"], ["÷ 5", "· 8"], 2), flow([["90 km", "6,3 L"], ["10 km", "…"], ["250 km", nb(x) + " L"]], ["÷ 9", "· 25"], ["÷ 9", "· 25"], 2) + plain("pour 10 km : 6,3 ÷ 9 = ?")][s],
        miss: (x, s) => (s === 1 && x === 45 ? "On n'ajoute pas 3 m → 3 CHF : 8 m, c'est 8 fois 1 m." : s === 2 && Math.abs(x - 166.3) < 1e-6 ? "On n'ajoute pas 160 : on passe par 10 km, puis on multiplie." : ""),
        wins: [W(8.4, "42 ÷ 5 = 8,40 CHF le mètre : on passe par l'unité."), W(67.2, "8 · 8,40 = 67,20 CHF."), W(17.5, "6,3 ÷ 9 = 0,7 L pour 10 km, puis 0,7 · 25 = 17,5 L. On peut passer par 10 km au lieu de 1 km.")] }),
    },
    change: {
      predict: { q: "Ce jour-là, 1 EUR vaut 0,95 CHF. Tu changes 100 EUR. Tu reçois…", choices: ["plus de 100 CHF", "moins de 100 CHF", "exactement 100 CHF"], good: 1,
        why: "Chaque euro vaut 0,95 CHF, un peu moins qu'un franc : 100 EUR = 100 · 0,95 = 95 CHF." },
      defis: ["Avec 1 EUR = 0,95 CHF : combien de francs reçois-tu pour 60 EUR ?", "Combien d'euros reçois-tu pour 76 CHF ?", "Un vélo coûte 420 EUR en France et 410 CHF en Suisse. Combien coûte le vélo français en francs ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        blank: (s) => [chg(60, null), chg(null, 76), chg(420, null)][s],
        show: (x, s) => [chg(60, x, "c") + plain("60 EUR → " + nb(x) + " CHF"), chg(x, 76, "e") + plain(nb(x) + " EUR → 76 CHF ; vérifie : " + nb(x) + " · 0,95 = " + nb(x * 0.95)), chg(420, x, "c") + plain("420 EUR → " + nb(x) + " CHF")][s],
        miss: (x, s) => (s === 0 && Math.abs(x - 60 / 0.95) < 0.01 ? "Tu as divisé : des euros vers les francs, on multiplie par 0,95." : s === 1 && Math.abs(x - 72.2) < 1e-6 ? "Tu as multiplié : des francs vers les euros, on divise par 0,95." : s === 2 && Math.abs(x - 420 / 0.95) < 0.01 ? "Des euros vers les francs : on multiplie par 0,95." : ""),
        wins: [W(57, "60 · 0,95 = 57 CHF : moins de francs que d'euros, car l'euro vaut moins d'un franc."), W(80, "76 ÷ 0,95 = 80 EUR ; vérifie : 80 · 0,95 = 76."), W(399, "420 · 0,95 = 399 CHF : 11 CHF de moins qu'en Suisse (410 CHF).")] }),
    },
    agrand: {
      predict: { q: "On agrandit un rectangle de 4 cm sur 2 cm. Sa longueur passe de 4 cm à 6 cm. Sa largeur devient…", choices: ["4 cm", "3 cm", "2,5 cm"], good: 1,
        why: "La longueur est multipliée par 6 ÷ 4 = 1,5 ; la largeur aussi : 2 · 1,5 = 3 cm. Ajouter 2 cm partout (largeur 4 cm) déformerait le rectangle." },
      defis: ["Une photo de 10 cm sur 15 cm est agrandie : le côté de 10 cm devient 25 cm. Quel est le facteur d'agrandissement ?", "Avec ce facteur, que devient le côté de 15 cm ?", "Un triangle de côtés 12 cm, 10 cm et 8 cm est réduit : le côté de 12 cm devient 9 cm. Que devient le côté de 8 cm ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        blank: (s) => [rects(10, 15, 25, 0, ["10 cm", "15 cm", "25 cm", ""], 3.8), rects(10, 15, 25, 0, ["10 cm", "15 cm", "25 cm", "?"], 3.8), tri(0, [])][s],
        show: (x, s) => [rects(10, 15, 10 * x, 15 * x, ["10 cm", "15 cm", nb(10 * x) + " cm", ""], 3.8) + plain("10 · " + nb(x) + " = " + nb(10 * x) + " cm (il faut 25 cm)"), rects(10, 15, 25, x, ["10 cm", "15 cm", "25 cm", nb(x) + " cm"], 3.8) + plain("la photo est-elle déformée ?"), tri(x / 8, ["9 cm", nb(x) + " cm", ""]) + plain("12 cm → 9 cm : facteur 9 ÷ 12 = ?")][s],
        miss: (x, s) => (s === 0 && x === 15 ? "25 − 10 = 15 est une différence : un agrandissement multiplie." : s === 1 && x === 30 ? "On n'ajoute pas 15 cm : on multiplie par le facteur." : s === 2 && x === 5 ? "On n'enlève pas 3 cm : on multiplie par le facteur 9 ÷ 12." : ""),
        wins: [W(2.5, "25 ÷ 10 = 2,5 : plus grand que 1, c'est un agrandissement."), W(37.5, "15 · 2,5 = 37,5 cm : la photo garde sa forme."), W(6, "Facteur 9 ÷ 12 = 0,75 (plus petit que 1 : réduction) ; 8 · 0,75 = 6 cm.")] }),
    },

    // ---------- 11. Transformations ----------
    symetries: {
      predict: { q: "Par la symétrie d'axe Oy (l'axe vertical), le point A(4 ; 1) a pour image…", choices: ["(−4 ; 1)", "(4 ; −1)", "(−4 ; −1)"], good: 0,
        why: "L'axe vertical joue le rôle d'un miroir : le point passe de l'autre côté, à la même distance (4 carreaux) et à la même hauteur (1). Seule l'abscisse change de signe." },
      defis: ["Touche l'image de B(−2 ; 3) par la symétrie d'axe Ox (l'axe horizontal).", "Touche l'image de C(3 ; 2) par la symétrie de centre O.", "Touche l'image de D(−1 ; −2) par la translation « 4 à droite, 3 en haut »."],
      play(box, onWin) {
        const Pts = [[-2, 3, "B"], [3, 2, "C"], [-1, -2, "D"]], Img = [[-2, -3], [-3, -2], [3, 1]];
        const Hint = ["Le miroir est l'axe horizontal : même abscisse, et la même distance à l'axe, de l'autre côté.", "O est le milieu du segment entre le point et son image : même distance à O, à l'opposé.", "Compte 4 carreaux vers la droite, puis 3 vers le haut."];
        let step = 0, tap = null; const done = [];
        const draw = () => {
          const s = Math.min(step, 2), u = 25, X = (v) => 160 + v * u, Y = (v) => 150 - v * u;
          let g = "";
          for (let v = -5; v <= 5; v++) g += L(X(v), Y(-5), X(v), Y(5), "grid", 1) + L(X(-5), Y(v), X(5), Y(v), "grid", 1);
          g += L(X(-5.6), Y(0), X(5.6), Y(0), s === 0 && step < 3 ? "f-accent" : "f-line", s === 0 && step < 3 ? 2.6 : 1.4) + L(X(0), Y(5.6), X(0), Y(-5.6), "f-line", 1.4) + T(X(5.6), Y(0) - 6, "x", "end", 11) + T(X(0) + 6, Y(5.6) + 4, "y", "start", 11) + T(X(0) - 5, Y(0) + 14, "O", "end", 11);
          if (s === 1 && step < 3) g += `<circle cx="${X(0)}" cy="${Y(0)}" r="5" class="f-dot"/>`;
          if (s === 2 && step < 3) { const [a, b] = Pts[2]; g += `<path d="M${X(a)},${Y(b)} L${X(a + 4)},${Y(b)} L${X(a + 4)},${Y(b + 3)}" class="f-blue" fill="none" stroke-width="1.4" stroke-dasharray="4 3"/>`; }
          for (const [P, Q] of done) g += L(X(P[0]), Y(P[1]), X(Q[0]), Y(Q[1]), "f-line", 1, true) + `<circle cx="${X(P[0])}" cy="${Y(P[1])}" r="4" class="f-fill2"/><circle cx="${X(Q[0])}" cy="${Y(Q[1])}" r="4" class="f-fill2"/>` + T(X(Q[0]) + 6, Y(Q[1]) - 6, P[2] + "'", "start", 11);
          if (step < 3) { const [a, b, n] = Pts[s]; g += `<circle cx="${X(a)}" cy="${Y(b)}" r="6" class="f-fill"/>` + T(X(a) + 8, Y(b) - 8, n + "(" + String(a).replace("-", "−") + " ; " + String(b).replace("-", "−") + ")", "start", 12, "f-txt f-blue"); }
          if (tap) g += `<circle cx="${X(tap[0])}" cy="${Y(tap[1])}" r="6" class="f-dot"/>`;
          for (let a = -5; a <= 5; a++) for (let b = -5; b <= 5; b++) g += `<circle class="act-pt" data-x="${a}" data-y="${b}" cx="${X(a)}" cy="${Y(b)}" r="11" fill="transparent" style="cursor:pointer"/>`;
          box.innerHTML = svg(320, 300, g, "quadrillage, repère de −5 à 5") + `<div class="act-out">${tap ? "Tu as touché (" + String(tap[0]).replace("-", "−") + " ; " + String(tap[1]).replace("-", "−") + ")" : "Touche un nœud du quadrillage."}</div>`;
          box.querySelectorAll(".act-pt").forEach((el) => (el.onclick = () => { tap = [+el.dataset.x, +el.dataset.y]; check(); }));
        };
        const check = () => {
          if (step > 2) return;
          const [a, b] = Img[step];
          if (tap[0] === a && tap[1] === b) {
            const P = Pts[step]; done.push([P, Img[step]]); tap = null;
            const m = ["B(−2 ; 3) → B'(−2 ; −3) : l'abscisse reste, l'ordonnée change de signe.", "C(3 ; 2) → C'(−3 ; −2) : les deux coordonnées changent de signe.", "D(−1 ; −2) → D'(3 ; 1) : on ajoute 4 à l'abscisse et 3 à l'ordonnée."][step];
            step++; draw(); onWin(step - 1, m);
          } else { draw(); $hint(box, Hint[step]); }
        };
        draw();
      },
    },

    // ---------- 12. Diagrammes ----------
    diagr: {
      predict: { q: "Trois notes : 6 ; 6 ; 3. Quelle est la moyenne ?", choices: ["4,5", "5", "6"], good: 1,
        why: "(6 + 6 + 3) ÷ 3 = 15 ÷ 3 = 5. Le 6 compte deux fois : ce n'est pas (6 + 3) ÷ 2 = 4,5." },
      defis: ["Points marqués par une joueuse de basket en 4 matchs : calcule sa moyenne par match.", "Notes d'un test : 3 élèves ont 4, 5 élèves ont 5 et 2 élèves ont 6. Quelle est la moyenne de la classe ?", "Sur 24 élèves, 9 viennent à vélo. Quel angle (en degrés) mesure le secteur « vélo » du diagramme circulaire ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        blank: (s) => [bars(["match 1", "match 2", "match 3", "match 4"], [12, 18, 9, 21], "points", ""), bars(["4", "5", "6"], [3, 5, 2], "élèves", "note"), pie(0, "24 élèves : secteur « vélo » ?")][s],
        show: (x, s) => [bars(["match 1", "match 2", "match 3", "match 4"], [12, 18, 9, 21], "points", "") + plain("tu proposes <b>" + nb(x) + "</b> · total des points ÷ nombre de matchs"), bars(["4", "5", "6"], [3, 5, 2], "élèves", "note") + plain("tu proposes <b>" + nb(x) + "</b> · somme de toutes les notes ÷ nombre d'élèves"), pie(x, "secteur de " + nb(x) + "° · le cercle entier : 360°")][s],
        miss: (x, s) => (s === 1 && x === 5 ? "(4 + 5 + 6) ÷ 3 = 5 oublie les effectifs : 3 notes de 4, 5 notes de 5, 2 notes de 6." : s === 1 && Math.abs(x - 49 / 3) < 0.01 ? "On divise par le nombre d'élèves (10), pas par le nombre de notes différentes (3)." : s === 2 && x === 9 ? "9 élèves sur 24 : quelle part des 360° ?" : ""),
        wins: [W(15, "12 + 18 + 9 + 21 = 60 points ; 60 ÷ 4 = 15 points par match."), W(4.9, "3 · 4 + 5 · 5 + 2 · 6 = 49 ; 49 ÷ 10 élèves = 4,9."), W(135, "9/24 de 360° : 360 ÷ 24 = 15° par élève, 9 · 15 = 135°.")] }),
    },
  });
})();
