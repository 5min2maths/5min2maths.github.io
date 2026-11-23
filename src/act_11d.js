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
  const square = (n, cls) => { const u = 14, x0 = Math.round(160 - (n * u) / 2); let g = "";
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) g += `<rect x="${x0 + i * u}" y="${5 + j * u}" width="${u}" height="${u}" class="${cls}" stroke="var(--ink)" stroke-width="0.4"/>`;
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
      for (let i = 0; i < x; i++) for (let j = 0; j < x; j++) g += `<rect x="${x0 + i * u}" y="${y0 + j * u}" width="${u}" height="${u}" class="f-fill" opacity="0.5" stroke="var(--ink)" stroke-width="0.5"/>`;
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
      predict: { q: "Laquelle de ces égalités est vraie ?", choices: ["√9 · √16 = √(9 · 16)", "√9 + √16 = √(9 + 16)", "les deux"], good: 0,
        why: "√9 · √16 = 3 · 4 = 12, et √144 = 12 aussi. Mais √9 + √16 = 7, alors que √25 = 5. La racine d'un produit est le produit des racines ; pour une somme, ça ne marche pas." },
      defis: ["Le rectangle a pour côtés √2 et √8. Calcule son aire √2 · √8.", "Un carré a une aire de 72. Son côté s'écrit a√2 : trouve a.", "√12 + √27 = a√3 : trouve a.", "Même règle du produit pour les racines cubiques : calcule ∛2 · ∛4."],
      play: hunt({ ask: true, label: "Ta réponse",
        blank: (s) => [rect28(null), sq72(null), seg3(null), plain("∛2 · ∛4 = ∛(2 · 4)")][s],
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
