// Manipulation directe (18.11, demande de l'utilisateur : « stabiliser la manipulation avant de développer toutes les
// notions »). Brique réutilisable : on GLISSE des poignées sur la figure (doigt, souris ou flèches du clavier),
// aimantées à une grille ; la figure répond pendant le geste ; l'objectif du défi n'est vérifié qu'AU LÂCHER (on ne
// « gagne » pas en balayant). Chaque défi a deux temps : manipuler, puis une question « à toi » tapée (sans la figure).
// Quatre leçons pilotes : pyth, affine, fracconv, sysineq (remplacent les versions précédentes de ces leçons).
// Pas de TeX dans ce qui est redessiné.
(function () {
  const nb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const frS = (v) => { for (let d = 1; d <= 40; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-9) { const n = Math.round(v * d); return d === 1 ? String(n).replace("-", "−") : (n < 0 ? "−" : "") + Math.abs(n) + "/" + d; } return nb(v); };
  const near = (a, b) => Math.abs(a - b) < 1e-9;
  const esc = (s) => String(s).replace(/</g, "&lt;");

  // ---------- la brique ----------
  // o : { W, H, init(step) → état, draw(st, step) → SVG (couche dynamique), handles(st, step) → [{ x, y, label }] en pixels,
  //       move(st, k, px, py, step) (px, py : point SVG), nudge(st, k, dx, dy, step) (flèches), tap(st, k, step) (facultatif),
  //       out(st, step) → texte sous la figure, goal[step](st) → message ou "", ask[step] : { q, ans, ok, no } (facultatif) }
  const manip = (o) => (box, onWin) => {
    let step = 0, st = o.init(0), asking = false;
    box.innerHTML = `<svg class="fig manip" viewBox="0 0 ${o.W} ${o.H}" style="touch-action:none;user-select:none" role="application" aria-label="figure à manipuler"><g class="dyn"></g><g class="hdl"></g></svg>
      <div class="act-out manip-out" aria-live="polite"></div><div class="manip-ask"></div><div class="small muted manip-note">${o.note || "Glisse les points (ou utilise les flèches du clavier). On vérifie quand tu lâches."}</div>`;
    const svg = box.querySelector("svg"), dyn = svg.querySelector(".dyn"), hdl = svg.querySelector(".hdl"), out = box.querySelector(".manip-out"), askBox = box.querySelector(".manip-ask");
    const toSvg = (e) => { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; const m = svg.getScreenCTM(); return m ? p.matrixTransform(m.inverse()) : { x: 0, y: 0 }; };
    const drawHandles = () => {
      hdl.innerHTML = o.handles(st, step).map((h, k) => `<g class="manip-h" data-k="${k}" tabindex="0" role="slider" aria-label="${esc(h.label || "point")}" style="cursor:grab;outline:none">
        <circle cx="${h.x}" cy="${h.y}" r="18" fill="transparent"/>${h.glyph ? `<text x="${h.x}" y="${h.y + 11}" text-anchor="middle" font-size="34" font-weight="700" fill="${h.color || "var(--blue)"}" class="manip-glyph">${esc(h.text)}</text>` : `<circle cx="${h.x}" cy="${h.y}" r="${h.r || 8}" class="manip-dot" fill="${h.color || "var(--blue)"}" stroke="var(--paper)" stroke-width="2.5"/>${h.text ? `<text x="${h.x}" y="${h.y - 14}" text-anchor="middle" class="f-txt" font-size="12" font-weight="700">${esc(h.text)}</text>` : ""}`}</g>`).join("");
      hdl.querySelectorAll(".manip-h").forEach((g) => {
        const k = +g.dataset.k; let down = null, moved = false;
        g.addEventListener("pointerdown", (e) => { if (asking) return; down = { x: e.clientX, y: e.clientY }; moved = false; g.setPointerCapture(e.pointerId); e.preventDefault(); });
        g.addEventListener("pointermove", (e) => { if (!down) return; if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 4) moved = true; if (!moved) return; const p = toSvg(e); o.move(st, k, p.x, p.y, step); refresh(); });
        g.addEventListener("pointerup", () => { if (!down) return; down = null; if (!moved && o.tap) { o.tap(st, k, step); refresh(); } check(); });
        g.addEventListener("pointercancel", () => { down = null; });
        g.addEventListener("keydown", (e) => { if (asking) return; const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key];
          if (d) { o.nudge(st, k, d[0], d[1], step); refresh(); check(); e.preventDefault(); } else if ((e.key === " " || e.key === "Enter") && o.tap) { o.tap(st, k, step); refresh(); check(); e.preventDefault(); } });
      });
    };
    const refresh = () => { dyn.innerHTML = o.draw(st, step); out.innerHTML = o.out(st, step);
      // poignées : on déplace sans recréer (la capture du pointeur est conservée pendant le geste)
      const hs = o.handles(st, step); hdl.querySelectorAll(".manip-h").forEach((g, k) => { const h = hs[k]; if (!h) return; g.querySelectorAll("circle").forEach((c) => { c.setAttribute("cx", h.x); c.setAttribute("cy", h.y); if (h.color && c.classList.contains("manip-dot")) c.setAttribute("fill", h.color); }); const t = g.querySelector("text"); if (t) { t.setAttribute("x", h.x); t.setAttribute("y", h.glyph ? h.y + 11 : h.y - 14); if (h.text) t.textContent = h.text; } }); };
    const win = (m) => { onWin(step, m); step++; asking = false; askBox.innerHTML = ""; if (step < o.goal.length) { st = o.init(step); drawHandles(); refresh(); } };
    const check = () => {
      if (asking || step >= o.goal.length) return;
      const m = o.goal[step](st); refresh(); if (!m) return;
      const A = o.ask && o.ask[step];
      if (!A) { win(m); return; }
      asking = true;
      askBox.innerHTML = `<div class="act-out" style="margin-top:6px"><b>✓ ${esc(m)}</b></div><div class="small" style="margin:6px 0"><b>À toi, sans la figure :</b> ${A.q}</div>
        ${actAnswerHtml("")}`;
      const inp = askBox.querySelector("input"), go = () => { const v = Number(String(inp.value).replace(/,/g, ".").replace("−", "-").replace(/\s/g, "").replace(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/, (s, u, w) => String(u / w)));
        if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre."); return; }
        if (near(v, A.ans)) win(A.ok); else $hint(box, A.no || "Pas encore : reprends le raisonnement de la figure."); };
      actAnswerBind(askBox, go);
    };
    drawHandles(); refresh();
    // Point d'entrée pour les tests automatiques (tests/act_manip.html)
    box.__manip = { get st() { return st; }, get step() { return step; }, set(fn) { fn(st, step); refresh(); check(); } };
  };

  // ---------- repère commun ----------
  const grid = (X, Y, x0, x1, y0, y1, axes = true) => { let g = ""; for (let x = x0; x <= x1; x++) g += `<line x1="${X(x)}" y1="${Y(y0)}" x2="${X(x)}" y2="${Y(y1)}" stroke="var(--line)" stroke-width=".6"/>`; for (let y = y0; y <= y1; y++) g += `<line x1="${X(x0)}" y1="${Y(y)}" x2="${X(x1)}" y2="${Y(y)}" stroke="var(--line)" stroke-width=".6"/>`;
    if (axes) g += `<line x1="${X(x0)}" y1="${Y(0)}" x2="${X(x1)}" y2="${Y(0)}" stroke="var(--ink)" stroke-width="1.2"/><line x1="${X(0)}" y1="${Y(y0)}" x2="${X(0)}" y2="${Y(y1)}" stroke="var(--ink)" stroke-width="1.2"/>`; return g; };
  const snap = (v, s, lo, hi) => Math.max(lo, Math.min(hi, Math.round(v / s) * s));

  // ===================== Pythagore : on déplace le sommet C =====================
  {
    const U = 24, OX = 90, OY = 165, X = (x) => OX + x * U, Y = (y) => OY - y * U, A = [0, 0], B = [5, 0];
    const sq = (P, Q, outward) => { const dx = Q[0] - P[0], dy = Q[1] - P[1], n = outward ? [dy, -dx] : [-dy, dx]; const R = [Q[0] + n[0], Q[1] + n[1]], S = [P[0] + n[0], P[1] + n[1]]; return [P, Q, R, S].map((p) => X(p[0]) + "," + Y(p[1])).join(" "); };
    const d2 = (P, Q) => (P[0] - Q[0]) ** 2 + (P[1] - Q[1]) ** 2;
    let lastC = null;
    const right = (C) => near((A[0] - C[0]) * (B[0] - C[0]) + (A[1] - C[1]) * (B[1] - C[1]), 0);
    ACTIVE.pyth = {
      predict: { q: "Un triangle rectangle a des cathètes de 6 cm et 8 cm. Son hypoténuse mesure…", choices: ["14 cm", "10 cm", "48 cm"], good: 1, why: "6² + 8² = 36 + 64 = 100, et √100 = 10. Ce sont les carrés qui s'additionnent, pas les côtés : tu vas le voir avec les aires des carrés." },
      defis: ["Déplace le sommet C pour que l'angle en C soit droit. Compare l'aire du grand carré à celle des deux autres.", "Trouve une autre position de C où l'angle en C est droit.", "Place C pour que l'angle en C soit plus grand qu'un angle droit (obtus). Que devient l'égalité ?"],
      play: manip({ W: 320, H: 300,
        note: "Glisse le point C. On vérifie quand tu le lâches.",
        init: (s) => ({ C: s === 2 ? [2.5, 3.5] : [3, 3] }),
        handles: (st) => [{ x: X(st.C[0]), y: Y(st.C[1]), label: "sommet C", text: "C" }],
        move: (st, k, px, py) => { st.C = [snap((px - OX) / U, 0.5, -1, 6), snap((OY - py) / U, 0.5, 0.5, 3.5)]; },
        nudge: (st, k, dx, dy) => { st.C = [snap(st.C[0] + dx * 0.5, 0.5, -1, 6), snap(st.C[1] + dy * 0.5, 0.5, 0.5, 3.5)]; },
        draw: (st) => { const C = st.C, a = d2(B, C), b = d2(A, C), c = d2(A, B), ok = right(C);
          return `<polygon points="${sq(A, B, true)}" fill="var(--blue-soft)" stroke="var(--blue)"/><polygon points="${sq(C, A, true)}" fill="var(--ok-soft)" stroke="var(--ok)"/><polygon points="${sq(B, C, true)}" fill="var(--warn-soft)" stroke="var(--warn)"/>
            <polygon points="${[A, B, C].map((p) => X(p[0]) + "," + Y(p[1])).join(" ")}" fill="var(--paper)" stroke="var(--ink)" stroke-width="2"/>
            ${ok ? (() => { const u = [(A[0] - C[0]), (A[1] - C[1])], v = [(B[0] - C[0]), (B[1] - C[1])], nu = Math.hypot(...u), nv = Math.hypot(...v), s = 0.45, p1 = [C[0] + u[0] / nu * s, C[1] + u[1] / nu * s], p2 = [C[0] + u[0] / nu * s + v[0] / nv * s, C[1] + u[1] / nu * s + v[1] / nv * s], p3 = [C[0] + v[0] / nv * s, C[1] + v[1] / nv * s]; return `<polyline points="${[p1, p2, p3].map((p) => X(p[0]) + "," + Y(p[1])).join(" ")}" fill="none" stroke="var(--ink)" stroke-width="1.5"/>`; })() : ""}
            <text x="${X(A[0]) - 10}" y="${Y(A[1]) + 4}" class="f-txt" text-anchor="end">A</text><text x="${X(B[0]) + 10}" y="${Y(B[1]) + 4}" class="f-txt">B</text>
            <text x="${X(2.5)}" y="${Y(-2.5)}" text-anchor="middle" class="f-txt" font-weight="700">${nb(c)}</text>
            <text x="${X((A[0] + C[0]) / 2 - (C[1]) / 2)}" y="${Y((A[1] + C[1]) / 2 + C[0] / 2)}" text-anchor="middle" class="f-txt" font-weight="700">${nb(b)}</text>
            <text x="${X((B[0] + C[0]) / 2 + (C[1]) / 2)}" y="${Y((B[1] + C[1]) / 2 + (B[0] - C[0]) / 2)}" text-anchor="middle" class="f-txt" font-weight="700">${nb(a)}</text>`; },
        out: (st) => { const a = d2(B, st.C), b = d2(A, st.C), c = d2(A, B), s = a + b;
          return `Aires des petits carrés : ${nb(b)} + ${nb(a)} = <b>${nb(s)}</b> ; grand carré : <b>${nb(c)}</b> → ${near(s, c) ? '<b class="act-ok">égalité</b>' : s > c ? "la somme dépasse" : "la somme est plus petite"}`; },
        goal: [
          (st) => (right(st.C) && (lastC = st.C.slice()) ? `Angle droit : ${nb(d2(A, st.C))} + ${nb(d2(B, st.C))} = ${nb(d2(A, B))}. La somme des aires des petits carrés égale celle du grand.` : ""),
          (st) => (right(st.C) && !(lastC && near(st.C[0], lastC[0]) && near(st.C[1], lastC[1])) ? "Une autre position, la même égalité : c'est toujours vrai quand l'angle est droit (théorème de Pythagore)." : ""),
          (st) => ((A[0] - st.C[0]) * (B[0] - st.C[0]) + (A[1] - st.C[1]) * (B[1] - st.C[1]) < -1e-9 ? "Angle obtus : la somme des deux petits carrés est plus PETITE que le grand. L'égalité n'est vraie que pour un angle droit." : ""),
        ],
        ask: [
          { q: "Un triangle rectangle a des cathètes de 6 et 8. Quelle est l'aire du carré construit sur l'hypoténuse ?", ans: 100, ok: "6² + 8² = 36 + 64 = 100 : l'hypoténuse mesure √100 = 10.", no: "Additionne les aires des carrés construits sur les cathètes : 6² + 8²." },
          { q: "Cathètes 5 et 12 : combien mesure l'hypoténuse ?", ans: 13, ok: "25 + 144 = 169 = 13².", no: "Carrés : 25 + 144 = 169 ; puis la racine." },
          { q: "Un triangle a des côtés 5, 7 et 9. Est-il rectangle ? Tape 1 pour oui, 0 pour non.", ans: 0, ok: "25 + 49 = 74, différent de 81 : pas d'égalité, donc pas rectangle (réciproque de Pythagore).", no: "Compare 5² + 7² et 9²." },
        ] }),
    };
  }

  // ===================== Fonctions affines : on déplace deux points =====================
  {
    const U = 22, OX = 160, OY = 120, X = (x) => OX + x * U, Y = (y) => OY - y * U;
    const slope = (st) => (st.Q[0] === st.P[0] ? NaN : (st.Q[1] - st.P[1]) / (st.Q[0] - st.P[0]));
    const mv = (st, k, x, y) => { const p = [snap(x, 1, -6, 6), snap(y, 1, -5, 5)]; const o = k ? st.P : st.Q; if (p[0] === o[0]) return; if (k) st.Q = p; else st.P = p; };
    ACTIVE.affine = {
      predict: { q: "Une droite passe par (0 ; 1) et (2 ; 5). Sa pente vaut…", choices: ["2", "4", "5"], good: 0, why: "En avançant de 2, on monte de 4 : la pente est 4 ÷ 2 = 2. La pente dit de combien on monte quand on avance de 1." },
      defis: ["Place les deux points pour obtenir une droite de pente 2.", "Obtiens une droite qui descend, de pente −1/2.", "Obtiens exactement la droite f(x) = −x + 3."],
      play: manip({ W: 320, H: 240,
        note: "Glisse les deux points. Le triangle de pente montre de combien on avance et de combien on monte.",
        init: () => ({ P: [-2, -1], Q: [1, 0] }),
        handles: (st) => [{ x: X(st.P[0]), y: Y(st.P[1]), label: "point P", text: "P" }, { x: X(st.Q[0]), y: Y(st.Q[1]), label: "point Q", text: "Q" }],
        move: (st, k, px, py) => mv(st, k, (px - OX) / U, (OY - py) / U),
        nudge: (st, k, dx, dy) => { const p = k ? st.Q : st.P; mv(st, k, p[0] + dx, p[1] + dy); },
        draw: (st) => { const a = slope(st), b = st.P[1] - a * st.P[0], f = (x) => a * x + b;
          return grid(X, Y, -6, 6, -5, 5) + `<line x1="${X(-7)}" y1="${Y(f(-7))}" x2="${X(7)}" y2="${Y(f(7))}" stroke="var(--margin)" stroke-width="2.6"/>
            <polyline points="${X(st.P[0])},${Y(st.P[1])} ${X(st.Q[0])},${Y(st.P[1])} ${X(st.Q[0])},${Y(st.Q[1])}" fill="none" stroke="var(--blue)" stroke-width="2" stroke-dasharray="5 3"/>
            <text x="${(X(st.P[0]) + X(st.Q[0])) / 2}" y="${Y(st.P[1]) + (st.Q[1] >= st.P[1] ? 15 : -6)}" text-anchor="middle" class="f-txt" font-size="12" fill="var(--blue)">avance ${nb(st.Q[0] - st.P[0])}</text>
            <text x="${X(st.Q[0]) + 6}" y="${(Y(st.P[1]) + Y(st.Q[1])) / 2 + 4}" class="f-txt" font-size="12" fill="var(--blue)">monte ${nb(st.Q[1] - st.P[1])}</text>`; },
        out: (st) => { const a = slope(st), b = st.P[1] - a * st.P[0]; return `pente = ${nb(st.Q[1] - st.P[1])} ÷ ${nb(st.Q[0] - st.P[0])} = <b>${frS(a)}</b> ; f(x) = <b>${frS(a)}x ${b < 0 ? "− " + frS(-b) : "+ " + frS(b)}</b>`; },
        goal: [
          (st) => (near(slope(st), 2) ? "Pente 2 : à chaque pas vers la droite, la droite monte de 2." : ""),
          (st) => (near(slope(st), -0.5) ? "Pente −1/2 : en avançant de 2, on descend de 1." : ""),
          (st) => (near(slope(st), -1) && near(st.P[1] + st.P[0], 3) ? "Pente −1 et ordonnée à l'origine 3 : c'est f(x) = −x + 3." : ""),
        ],
        ask: [
          { q: "Une droite de pente 2 passe par (0 ; 1). Que vaut f(3) ?", ans: 7, ok: "f(x) = 2x + 1, donc f(3) = 7.", no: "Pars de 1 et monte de 2 à chaque pas : trois pas." },
          { q: "Pente de la droite qui passe par (−2 ; 4) et (2 ; 2) ?", ans: -0.5, ok: "(2 − 4) ÷ (2 − (−2)) = −2 ÷ 4 = −1/2.", no: "Différence des y divisée par la différence des x, dans le même ordre." },
          { q: "Quel est le zéro de f(x) = −x + 3 ?", ans: 3, ok: "−x + 3 = 0 donne x = 3 : la droite coupe l'axe horizontal en 3.", no: "Résous −x + 3 = 0." },
        ] }),
    };
  }

  // ===================== Fractions, décimaux, pourcentages sur la droite graduée =====================
  {
    const X0 = 30, X1 = 290, X = (v) => X0 + v * (X1 - X0), LY = 150, S = 0.025;
    const SETS = [[["1/2", 0.5], ["1/4", 0.25], ["3/4", 0.75]], [["0,6", 0.6], ["35 %", 0.35], ["4/5", 0.8]], [["3/8", 0.375], ["0,45", 0.45], ["1/5", 0.2]]];
    const lane = (k) => LY - 30 - k * 34;
    ACTIVE.fracconv = {
      predict: { q: "Lequel est le plus grand : 3/8, 0,4 ou 35 % ?", choices: ["3/8", "0,4", "35 %"], good: 1, why: "3/8 = 0,375 et 35 % = 0,35 : en écriture décimale, 0,4 est le plus grand. Pour comparer, on écrit tout de la même manière." },
      defis: ["Place 1/2, 1/4 et 3/4 sur la droite.", "Place 0,6, 35 % et 4/5.", "Place 3/8, 0,45 et 1/5."],
      play: manip({ W: 320, H: 190,
        note: "Glisse chaque étiquette à sa place sur la droite (graduée en dixièmes). Elle devient verte quand elle est bien placée, au lâcher.",
        init: (s) => ({ v: SETS[s].map(() => 0), placed: SETS[s].map(() => false) }),
        handles: (st, s) => SETS[s].map(([lab], k) => ({ x: X(st.v[k]), y: lane(k), label: "étiquette " + lab, text: lab, color: st.placed[k] ? (near(st.v[k], SETS[s][k][1]) ? "var(--ok)" : "var(--bad)") : "var(--blue)" })),
        move: (st, k, px) => { st.v[k] = snap((px - X0) / (X1 - X0), S, 0, 1); st.placed[k] = false; },
        nudge: (st, k, dx) => { st.v[k] = snap(st.v[k] + dx * S, S, 0, 1); st.placed[k] = false; },
        draw: (st, s) => { let g = `<line x1="${X0}" y1="${LY}" x2="${X1}" y2="${LY}" stroke="var(--ink)" stroke-width="1.6"/>`;
          for (let i = 0; i <= 10; i++) g += `<line x1="${X(i / 10)}" y1="${LY - (i % 5 ? 5 : 9)}" x2="${X(i / 10)}" y2="${LY + (i % 5 ? 5 : 9)}" stroke="var(--ink)"/>`;
          g += `<text x="${X(0)}" y="${LY + 24}" text-anchor="middle" class="f-txt">0</text><text x="${X(1)}" y="${LY + 24}" text-anchor="middle" class="f-txt">1</text><text x="${X(0.5)}" y="${LY + 24}" text-anchor="middle" class="f-txt" font-size="11">0,5</text>`;
          st.v.forEach((v, k) => (g += `<line x1="${X(v)}" y1="${lane(k)}" x2="${X(v)}" y2="${LY}" stroke="var(--line)" stroke-dasharray="3 3"/>`));
          return g; },
        out: (st, s) => { const n = st.placed.filter((p, k) => p && near(st.v[k], SETS[s][k][1])).length; return `${n} étiquette${n > 1 ? "s" : ""} bien placée${n > 1 ? "s" : ""} sur ${SETS[s].length}`; },
        goal: [0, 1, 2].map((s) => (st) => { st.placed = st.placed.map(() => true); return SETS[s].every(([, val], k) => near(st.v[k], val)) ? ["1/4 = 0,25 et 3/4 = 0,75 : entre deux graduations des dixièmes.", "35 % = 0,35 ; 0,6 ; 4/5 = 0,8.", "1/5 = 0,2 ; 3/8 = 0,375 ; 0,45."][s] : ""; }),
        ask: [
          { q: "Écris 3/4 en pourcentage (donne le nombre).", ans: 75, ok: "3/4 = 0,75 = 75 %.", no: "3 ÷ 4 = 0,75, puis × 100." },
          { q: "Écris 35 % sous forme de fraction irréductible, puis tape son dénominateur.", ans: 20, ok: "35 % = 35/100 = 7/20.", no: "35/100, simplifié par 5." },
          { q: "Quel est le plus grand : 3/8, 0,4 ou 35 % ? Tape sa valeur décimale.", ans: 0.4, ok: "3/8 = 0,375 ; 35 % = 0,35 ; le plus grand est 0,4.", no: "Écris les trois en écriture décimale." },
        ] }),
    };
  }

  // ===================== Systèmes d'inéquations : on pose les crochets =====================
  {
    const X = (v) => 160 + v * 21, LY = 100, SYS = [
      { txt: "x > −1 et x ≤ 4", L: -1, Lc: false, R: 4, Rc: true, rays: true },
      { txt: "2x − 1 > 3 et x + 4 ≤ 9", L: 2, Lc: false, R: 5, Rc: true, rays: false },
      { txt: "−2x > 4 et x ≥ −5", L: -5, Lc: true, R: -2, Rc: false, rays: false }];
    ACTIVE.sysineq = {
      predict: { q: "x > 2 et x ≤ 5. Le nombre 5 est-il solution ?", choices: ["Oui", "Non"], good: 0, why: "5 > 2 et 5 ≤ 5 : les deux conditions sont vraies. Le crochet est fermé en 5 : S = ]2 ; 5]." },
      defis: ["Système x > −1 et x ≤ 4 : place les deux crochets de l'ensemble des solutions.", "Système 2x − 1 > 3 et x + 4 ≤ 9 : résous chaque ligne, puis pose les crochets.", "Système −2x > 4 et x ≥ −5 : attention au sens de la première ligne."],
      play: manip({ W: 320, H: 150,
        note: "Glisse les deux crochets. Touche un crochet (sans le déplacer) pour l'ouvrir ou le fermer : [ inclut la borne, ] l'exclut.",
        init: () => ({ L: -6, Lc: true, R: 6, Rc: true }),
        handles: (st) => [{ x: X(st.L), y: LY, label: "borne de gauche", text: st.Lc ? "[" : "]", glyph: true }, { x: X(st.R), y: LY, label: "borne de droite", text: st.Rc ? "]" : "[", glyph: true }],
        move: (st, k, px) => { const v = snap((px - 160) / 21, 1, -7, 7); if (k) st.R = Math.max(v, st.L); else st.L = Math.min(v, st.R); },
        nudge: (st, k, dx) => { if (k) st.R = Math.max(Math.min(st.R + dx, 7), st.L); else st.L = Math.min(Math.max(st.L + dx, -7), st.R); },
        tap: (st, k) => { if (k) st.Rc = !st.Rc; else st.Lc = !st.Lc; },
        draw: (st, s) => { const S0 = SYS[s]; let g = `<text x="160" y="22" text-anchor="middle" class="f-txt" font-weight="700">${S0.txt}</text><line x1="${X(-7)}" y1="${LY}" x2="${X(7)}" y2="${LY}" stroke="var(--ink)" stroke-width="1.5"/>`;
          for (let k = -7; k <= 7; k++) g += `<line x1="${X(k)}" y1="${LY - 5}" x2="${X(k)}" y2="${LY + 5}" stroke="var(--ink)"/>` + (k % 1 === 0 ? `<text x="${X(k)}" y="${LY + 22}" text-anchor="middle" class="f-txt" font-size="10">${String(k).replace("-", "−")}</text>` : "");
          if (S0.rays) g += `<line x1="${X(S0.L)}" y1="${LY - 30}" x2="${X(7)}" y2="${LY - 30}" stroke="var(--ok)" stroke-width="4" opacity=".6"/><text x="${X(7)}" y="${LY - 36}" text-anchor="end" class="f-txt" font-size="11">x > −1</text><line x1="${X(-7)}" y1="${LY - 44}" x2="${X(S0.R)}" y2="${LY - 44}" stroke="var(--warn)" stroke-width="4" opacity=".6"/><text x="${X(-7)}" y="${LY - 50}" class="f-txt" font-size="11">x ≤ 4</text>`;
          g += `<line x1="${X(st.L)}" y1="${LY}" x2="${X(st.R)}" y2="${LY}" stroke="var(--blue)" stroke-width="6" opacity=".55"/>`;
          return g; },
        out: (st) => `Tu proposes S = <b>${st.Lc ? "[" : "]"}${String(st.L).replace("-", "−")} ; ${String(st.R).replace("-", "−")}${st.Rc ? "]" : "["}</b>`,
        goal: [0, 1, 2].map((s) => (st) => { const S0 = SYS[s]; return st.L === S0.L && st.R === S0.R && st.Lc === S0.Lc && st.Rc === S0.Rc ? ["La partie commune des deux conditions : ]−1 ; 4] (−1 exclu, 4 inclus).", "2x > 4 donne x > 2 ; x ≤ 5 : S = ]2 ; 5].", "−2x > 4 donne x < −2 (sens retourné) ; avec x ≥ −5 : S = [−5 ; −2[."][s] : ""; }),
        ask: [
          null,
          { q: "Combien de nombres entiers vérifient 2x − 1 > 3 et x + 4 ≤ 9 ?", ans: 3, ok: "3, 4 et 5 (2 est exclu).", no: "Compte les entiers de ]2 ; 5]." },
          { q: "Combien de nombres entiers vérifient −2x > 4 et x ≥ −5 ?", ans: 3, ok: "−5, −4 et −3 (−2 est exclu).", no: "Compte les entiers de [−5 ; −2[." },
        ] }),
    };
  }
})();
