// Chantier 3e et 4e Collège (24.11) : leçons actives (devine / manipule ou essaie sur la figure / retiens) pour les
// notions de src/ch3c_ana.js (3e, dérivation : tauxvar, nbderive, derivref, derivregles, derivprodquot, derivcomp,
// tangente, variations, optimderiv) et de src/ch4c_ana.js (4e : primitives, integrale, aireint, volrev, lnexp,
// croissance, matrices, translin, condbayes, varalea, binomiale, normale). Programme : tools/programme_3e_4e_college.md.
// Même moteur que act_2c.js (briques hunt et slide recopiées : fichier autonome), avec en plus des surfaces colorées
// (o.polys, aires sous une courbe) et un format des graduations x (o.fx). Le « Retiens » vient de LESSONS[id]
// (leçons de ch3c_ana.js et ch4c_ana.js) : les défis présentent les règles qu'il affiche.
// Paquet de chargement « 14 » (build.py) : chargé dès la 3e, donc aussi en 4e.
(function () {
  // ---------- outils ----------
  const nb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");
  // Nombre arrondi à d décimales, milliers séparés par ' (1'551,33).
  const mil = (v, d = 2) => { const s = (+(+v).toFixed(d)).toString().split("."), i = s[0].replace("-", ""), neg = s[0][0] === "-";
    return (neg ? "−" : "") + i.replace(/\B(?=(\d{3})+(?!\d))/g, "'") + (s[1] ? "," + s[1] : ""); };
  const SUP = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
  const sup = (n) => String(n).split("").map((c) => SUP[c] || c).join("");
  const pw = (b, x) => (Number.isInteger(x) ? b + sup(x) : b + "^" + nb(x));
  const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;
  const T = (x, y, s, a = "middle", sz = 12, cls = "f-txt") => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${a}" font-size="${sz}">${s}</text>`;
  const L = (x1, y1, x2, y2, cls = "f-line", w = 1.6, dash) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
  const plain = (html) => `<div class="act-out">${html}</div>`;
  const tu = (x) => "tu proposes <b>" + nb(x) + "</b>";
  const parseNum = (s) => Number(String(s).replace(/,/g, ".").replace(/−/g, "-").replace(/\s|'/g, "").replace(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/, (m, u, w) => String(u / w)));
  // Facteur (x − z) écrit proprement : (x + 2), (x − 3).
  const fac = (z) => (z < 0 ? "(x + " + -z + ")" : "(x − " + z + ")");

  // Repère : o = { xr, yr, eq (même unité sur les deux axes), H, gx, gy, lx, ly, fns: [{ f, cls, w, dash, from, to }],
  //   vl: [[x, cls]], hl: [[y, cls]], segs: [[x1, y1, x2, y2, cls, w, dash]], circles: [[cx, cy, r, cls]],
  //   arrows: [[x1, y1, x2, y2, cls]], pts: [[x, y, étiquette, cls, position]], fy, fx (format des graduations y, x), polys, lab }
  let UID = 0;
  const graph = (o) => {
    // o.pad : marge à gauche (px) pour les graduations quand l'axe des x commence à 0 (grands nombres).
    const W = 320, m = 6, ml = m + (o.pad || 0), xr = o.xr, yr = o.yr, ux = (W - m - ml) / (xr[1] - xr[0]);
    const H = o.H || (o.eq ? Math.round((yr[1] - yr[0]) * ux + 2 * m) : 230), uy = (H - 2 * m) / (yr[1] - yr[0]);
    const X = (v) => +(ml + (v - xr[0]) * ux).toFixed(1), Y = (v) => +(H - m - (v - yr[0]) * uy).toFixed(1), id = "c34" + ++UID;
    const gx = o.gx || 1, gy = o.gy || 1, lx = o.lx || gx * 2, ly = o.ly || gy * 2, fy = o.fy || nb, fx = o.fx || nb;
    let g = "", c = "";
    for (let v = Math.ceil(xr[0] / gx) * gx; v <= xr[1] + 1e-9; v += gx) g += L(X(v), Y(yr[0]), X(v), Y(yr[1]), "f-grid", 0.7);
    for (let v = Math.ceil(yr[0] / gy) * gy; v <= yr[1] + 1e-9; v += gy) g += L(X(xr[0]), Y(v), X(xr[1]), Y(v), "f-grid", 0.7);
    const y0 = Math.min(Math.max(0, yr[0]), yr[1]), x0 = Math.min(Math.max(0, xr[0]), xr[1]);
    g += L(X(xr[0]), Y(y0), X(xr[1]), Y(y0), "f-line", 1.2) + L(X(x0), Y(yr[0]), X(x0), Y(yr[1]), "f-line", 1.2);
    for (let v = Math.ceil(xr[0] / lx) * lx; v <= xr[1] + 1e-9; v += lx) if (Math.abs(v) > 1e-9 && v < xr[1] - 1e-9) g += T(X(v), Math.min(Y(y0) + 13, H - 2), fx(+v.toFixed(6)), "middle", 10);
    for (let v = Math.ceil(yr[0] / ly) * ly; v <= yr[1] + 1e-9; v += ly) if (Math.abs(v) > 1e-9 && v < yr[1] - 1e-9) g += T(Math.max(X(x0) - 4, o.pad ? ml - 3 : 24), Y(v) + 3.5, fy(+v.toFixed(6)), "end", 10);
    /* polys : surfaces colorées [[points [x, y]…], classe] (aires sous une courbe), dessinées sous les courbes */
    for (const [P, cls] of o.polys || []) c += `<polygon points="${P.map(([x, y]) => X(x) + "," + Y(Math.max(yr[0], Math.min(yr[1], y)))).join(" ")}" class="${cls || "f-fill2"}" style="stroke:none;opacity:0.7"/>`;
    const span = yr[1] - yr[0];
    for (const F of o.fns || []) {
      const a = Math.max(xr[0], F.from ?? -Infinity), b = Math.min(xr[1], F.to ?? Infinity), N = 360; let d = "", prev = null;
      for (let i = 0; i <= N; i++) { const x = a + ((b - a) * i) / N, y = F.f(x);
        if (!isFinite(y) || y < yr[0] - span || y > yr[1] + span || (prev !== null && Math.abs(y - prev) > span)) { prev = null; continue; }
        d += (prev === null ? "M" : "L") + X(x) + "," + Y(y) + " "; prev = y; }
      if (d) c += `<path d="${d}" class="${F.cls || "f-blue"}" fill="none" stroke-width="${F.w || 2.4}"${F.dash ? ' stroke-dasharray="5 4"' : ""}/>`;
    }
    for (const [x, cls] of o.vl || []) c += L(X(x), Y(yr[0]), X(x), Y(yr[1]), cls || "f-accent", 1.6, "6 4");
    for (const [y, cls] of o.hl || []) c += L(X(xr[0]), Y(y), X(xr[1]), Y(y), cls || "f-accent", 1.6, "6 4");
    for (const [x1, y1, x2, y2, cls, w, dash] of o.segs || []) c += L(X(x1), Y(y1), X(x2), Y(y2), cls || "f-line", w || 1.6, dash);
    for (const [cx, cy, r, cls] of o.circles || []) c += `<ellipse cx="${X(cx)}" cy="${Y(cy)}" rx="${(r * ux).toFixed(1)}" ry="${(r * uy).toFixed(1)}" class="${cls || "f-blue"}" fill="none" stroke-width="2.4"/>`;
    for (const [x1, y1, x2, y2, cls] of o.arrows || []) {
      const p = [X(x1), Y(y1)], q = [X(x2), Y(y2)], dx = q[0] - p[0], dy = q[1] - p[1], n = Math.hypot(dx, dy);
      if (n < 1) continue; const ex = dx / n, ey = dy / n, k = Math.min(11, n * 0.45), b = [q[0] - ex * k, q[1] - ey * k];
      c += L(p[0], p[1], b[0].toFixed(1), b[1].toFixed(1), cls || "f-blue", 2.6) + `<polygon points="${q[0]},${q[1]} ${(b[0] - ey * 5).toFixed(1)},${(b[1] + ex * 5).toFixed(1)} ${(b[0] + ey * 5).toFixed(1)},${(b[1] - ex * 5).toFixed(1)}" class="${cls === "f-accent" ? "f-headacc" : "f-head"}" style="${cls === "f-blue" || !cls ? "fill:var(--blue)" : ""}"/>`;
    }
    let p = "";
    for (const [x, y, lab, cls, pos] of o.pts || []) {
      if (x < xr[0] || x > xr[1] || y < yr[0] || y > yr[1]) continue;
      p += `<circle cx="${X(x)}" cy="${Y(y)}" r="5" class="${cls || "f-dot"}"/>`;
      if (lab) { const left = pos === "l" || (pos !== "r" && X(x) > W - 90); p += T(X(x) + (left ? -8 : 8), Y(y) + (pos === "b" ? 16 : -7), lab, left ? "end" : "start", 12); }
    }
    return svg(W, H, `<defs><clipPath id="${id}"><rect x="${ml}" y="${m}" width="${W - m - ml}" height="${H - 2 * m}"/></clipPath></defs>${g}<g clip-path="url(#${id})">${c}</g>${p}`, o.lab || "repère");
  };

  // ---------- brique « hunt » (réponse tapée) ----------
  // o et mk gardés sur la fonction : actPrep (active.js) peut ne garder que 2 questions (22.11).
  const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });
  const hunt0 = (o) => (box, onWin) => {
    let x = null, step = 0;
    const draw = () => {
      const s = Math.min(step, o.wins.length - 1), fig = x === null ? (o.blank ? o.blank(s) : "") : o.show(x, s);
      box.innerHTML = fig + actAnswerHtml(o.label || "Ta réponse") + (o.note ? `<div class="small muted">${o.note}</div>` : "");
      const inp = box.querySelector(".act-in"); if (x !== null) inp.value = nb(x).replace("−", "-");
      const go = () => { const v = parseNum(inp.value); if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre (fraction acceptée, par exemple 3/2)."); return; }
        x = v; draw(); if (!check()) { const mm = typeof o.miss === "function" ? o.miss(x, s) : o.miss; $hint(box, mm || (box.querySelector("svg.fig") ? "Pas encore : regarde la figure, puis recalcule." : "Pas encore : relis les calculs affichés, puis recalcule.")); } };
      actAnswerBind(box, go);
    };
    const check = () => { if (step >= o.wins.length) return false; const mm = o.wins[step](x); if (mm) { onWin(step, mm); step++; x = null; draw(); return true; } return false; };
    draw();
  };
  const W = (target, msg, tol = 1e-9) => (x) => (Math.abs(x - target) <= tol ? msg : "");

  // ---------- brique « slide » (curseurs) ----------
  // o = { ctl(step) → [{ k, lab, min, max, step }], init(step) → état, fig(st, step) → SVG, out(st, step) → texte,
  //       goal[step](st) → message ou "", miss(st, step) → indice (facultatif), ask[step] : { q, ans, tol, ok, no }, fmt(k, v, step), note }
  const slide = (o) => (box, onWin) => {
    let step = 0, st = null, asking = false;
    const start = () => {
      st = Object.assign({}, o.init(step)); asking = false;
      const cs = o.ctl(step);
      box.innerHTML = `<div class="s2c-fig"></div>` + cs.map((c) => `<label class="dyn-ctl"><span class="small">${c.lab} : <b class="s2c-v" data-k="${c.k}"></b></span><input type="range" data-k="${c.k}" min="${c.min}" max="${c.max}" step="${c.step || 1}" value="${st[c.k]}" aria-label="${c.lab}"></label>`).join("") +
        `<div class="act-out s2c-out" aria-live="polite"></div><div class="s2c-ask"></div><div class="small muted">${o.note || "Fais glisser " + (cs.length > 1 ? "les curseurs" : "le curseur") + " : on vérifie quand tu lâches."}</div>`;
      box.querySelectorAll('input[type="range"]').forEach((inp) => {
        inp.oninput = () => { if (asking) { inp.value = st[inp.dataset.k]; return; } st[inp.dataset.k] = +inp.value; refresh(); };
        inp.onchange = () => { if (asking) return; st[inp.dataset.k] = +inp.value; refresh(); check(); };
      });
      refresh();
    };
    const refresh = () => {
      box.querySelector(".s2c-fig").innerHTML = o.fig(st, step);
      box.querySelectorAll(".s2c-v").forEach((b) => (b.textContent = o.fmt ? o.fmt(b.dataset.k, st[b.dataset.k], step) : nb(st[b.dataset.k])));
      box.querySelector(".s2c-out").innerHTML = o.out(st, step);
    };
    const win = (mm) => { onWin(step, mm); step++; if (step < o.goal.length) start(); else { asking = true; box.querySelector(".s2c-ask").innerHTML = ""; } };
    const check = () => {
      if (asking || step >= o.goal.length) return;
      const mm = o.goal[step](st);
      if (!mm) { const t = o.miss && o.miss(st, step); if (t) $hint(box, t); else { const el = box.querySelector(".act-hint"); if (el) el.textContent = ""; } return; }
      const A = o.ask && o.ask[step];
      if (!A) { win(mm); return; }
      asking = true; const el = box.querySelector(".act-hint"); if (el) el.textContent = "";
      const ab = box.querySelector(".s2c-ask");
      ab.innerHTML = `<div class="act-out" style="margin-top:6px"><b>✓ ${mm}</b></div><div class="small" style="margin:6px 0"><b>À toi, sans la figure :</b> ${A.q}</div>${actAnswerHtml("")}`;
      if (typeof typeset === "function" && /\\\(/.test(A.q)) typeset(ab);
      const inp = ab.querySelector("input"), go = () => { const v = parseNum(inp.value);
        if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre (fraction acceptée, par exemple 3/2)."); return; }
        if (Math.abs(v - A.ans) <= (A.tol || 1e-9)) win(A.ok); else $hint(box, A.no || "Pas encore : reprends le raisonnement de la figure."); };
      actAnswerBind(ab, go);
    };
    start();
  };


  // ---------- outils propres à ce fichier ----------
  // Fraction lisible (dénominateur ≤ 12), sinon décimal.
  const fr = (v) => { for (let d = 1; d <= 12; d++) { const n = Math.round(v * d); if (Math.abs(n / d - v) < 1e-9) return d === 1 ? nb(n) : (n < 0 ? "−" : "") + Math.abs(n) + "/" + d; } return nb(v); };
  // Figure « tangente » : courbe de D.f, point (D.a ; f(D.a)) et droite de pente m (proposée) par ce point.
  // D = { f, a, m (pente juste), tol, xr, yr, gx, gy, lx, ly, lab (étiquette du point), txt (légende) }.
  const tanFig = (D, m) => {
    const fa = D.f(D.a), ok = m !== null && Math.abs(m - D.m) <= (D.tol || 1e-9);
    const o = { xr: D.xr, yr: D.yr, gx: D.gx, gy: D.gy, lx: D.lx, ly: D.ly, fns: [{ f: D.f }], pts: [[D.a, fa, D.lab || "", "f-dot", D.pos]], lab: "courbe et droite passant par un de ses points" };
    if (m !== null) o.fns.push({ f: (x) => m * (x - D.a) + fa, cls: ok ? "f-accent" : "f-line", w: 1.8 });
    const t = m === null ? '<span class="small">' + D.txt + "</span>" : "Droite de pente <b>" + nb(m) + "</b> : " + (ok ? '<b class="act-ok">elle frôle la courbe, c\'est la tangente</b>' : "ce n'est pas la tangente (pente " + (m > D.m ? "trop forte" : "trop faible") + ")");
    return graph(o) + plain(t);
  };
  // Surface entre f (haut) et g (bas) de a à b, pour o.polys.
  const shade = (f, g, a, b) => { const P = []; for (let i = 0; i <= 60; i++) { const x = a + ((b - a) * i) / 60; P.push([x, f(x)]); } for (let i = 60; i >= 0; i--) { const x = a + ((b - a) * i) / 60; P.push([x, g(x)]); } return P; };
  const z0 = () => 0;

  // =====================================================================================================
  // 3e Collège · Dérivation (ch3c_ana.js)
  // =====================================================================================================
  // nbderive (étape 2) : f(x) = 0,5x² − 1, droite par A(2 ; 1) ; elle recoupe la courbe en x = 2m − 2.
  const fq = (x) => 0.5 * x * x - 1;
  const DREF = [
    { f: (x) => x ** 3, a: 2, m: 12, xr: [-1, 3.2], yr: [-4, 28], gy: 2, ly: 8, lab: "(2 ; 8)", txt: "f(x) = x³ et son point d'abscisse 2" },
    { f: (x) => 1 / x, a: 2, m: -0.25, xr: [0, 5], yr: [-0.5, 4], lab: "(2 ; 0,5)", txt: "f(x) = 1/x et son point d'abscisse 2" },
    { f: (x) => Math.sqrt(x), a: 4, m: 0.25, xr: [0, 9], yr: [-0.5, 3.5], lab: "(4 ; 2)", txt: "f(x) = √x et son point d'abscisse 4" },
    { f: Math.sin, a: Math.PI / 3, m: 0.5, xr: [-0.5, 3.5], yr: [-1.5, 1.5], gx: 0.5, gy: 0.5, lx: 1, ly: 1, lab: "(π/3 ; √3/2)", txt: "f(x) = sin x et son point d'abscisse π/3 ≈ 1,05" },
  ];
  const DREG = [
    { f: (x) => 2 * x ** 3 - 5 * x * x + 4 * x - 7, a: 2, m: 8, xr: [-0.5, 3], yr: [-12, 6], gx: 0.5, lx: 1, gy: 2, ly: 4, lab: "(2 ; −3)", txt: "f(x) = 2x³ − 5x² + 4x − 7 et son point d'abscisse 2" },
    { f: (x) => (x + 1) * (x - 3), a: 4, m: 6, xr: [-2, 5.5], yr: [-5, 12], lab: "(4 ; 5)", txt: "f(x) = (x + 1)(x − 3) et son point d'abscisse 4" },
  ];
  const fh = (x) => x * x - 6 * x + 1;
  const regFig = (s, x) => {
    if (s < 2) return tanFig(DREG[s], x);
    const o = { xr: [-1, 7], yr: [-9, 8], fns: [{ f: fh }], pts: [], lab: "parabole et tangente au point choisi" };
    if (x === null) return graph(o) + plain('<span class="small">f(x) = x² − 6x + 1 : tape une abscisse, on trace la tangente en ce point</span>');
    const m = 2 * x - 6; o.fns.push({ f: (t) => m * (t - x) + fh(x), cls: m === 0 ? "f-accent" : "f-line", w: 1.8 }); o.pts.push([x, fh(x), "", "f-dot"]);
    return graph(o) + plain("Tangente en x = " + nb(x) + " : pente f'(" + nb(x) + ") = <b>" + nb(m) + "</b>" + (m === 0 ? ' : <b class="act-ok">horizontale</b>' : ""));
  };
  const DPQ = [
    { f: (x) => x * x * (3 * x + 1), a: 1, m: 11, xr: [-1.5, 2], yr: [-2, 12], gx: 0.5, lx: 1, gy: 1, ly: 2, lab: "(1 ; 4)", txt: "f(x) = x²(3x + 1) et son point d'abscisse 1" },
    { f: (x) => (2 * x + 1) / (x - 1), a: 3, m: -0.75, xr: [0, 7], yr: [-2, 10], lab: "(3 ; 3,5)", txt: "f(x) = (2x + 1) ÷ (x − 1) et son point d'abscisse 3" },
    { f: (x) => 1 / (x * x + 1), a: 1, m: -0.5, xr: [-3, 3], yr: [-0.25, 1.25], gx: 0.5, lx: 1, gy: 0.25, ly: 0.5, lab: "(1 ; 0,5)", txt: "f(x) = 1 ÷ (x² + 1) et son point d'abscisse 1" },
  ];
  // derivcomp : chaîne x → intérieur u → extérieur f, avec les valeurs.
  const DCH = [
    ["x = 4", "u = 2x − 5 = 3", "f = u³ = 27"],
    ["x = 2", "u = 2x + 5 = 9", "f = √u = 3"],
    ["x = π/4", "u = 2x = π/2", "f = cos u = 0"],
    ["x = 1", "u = x² + 1 = 2", "f = u³ = 8"],
  ];
  const chain = (s) => {
    const B = DCH[s], xs = [4, 108, 216], w = [84, 100, 100];
    let g = T(xs[1] + 50, 14, "intérieur", "middle", 11) + T(xs[2] + 50, 14, "extérieur", "middle", 11);
    B.forEach((t, i) => { g += `<rect x="${xs[i]}" y="22" width="${w[i]}" height="34" rx="8" class="${i ? "f-fill2" : "f-soft"}"/>` + T(xs[i] + w[i] / 2, 44, t, "middle", 12); });
    g += L(xs[0] + w[0] + 2, 39, xs[1] - 4, 39, "f-line", 1.6) + L(xs[1] + w[1] + 2, 39, xs[2] - 4, 39, "f-line", 1.6);
    return svg(320, 62, g, "chaîne de calcul : x, puis l'intérieur u, puis l'extérieur f");
  };
  // optimderiv : enclos le long d'une rivière (étape 1), boîte (étape 2).
  const enclos = (x) => {
    const k = 7, Lg = 40 - 2 * x, x0 = 160 - (Lg * k) / 2;
    let g = `<rect x="0" y="4" width="320" height="14" class="f-fill2"/>` + T(160, 15, "rivière", "middle", 10);
    g += `<rect x="${x0}" y="18" width="${Lg * k}" height="${x * k}" class="f-soft"/>` + `<path d="M${x0},18 V${18 + x * k} H${x0 + Lg * k} V18" class="f-line" fill="none" stroke-width="2.4"/>`;
    g += T(160, 18 + x * k + 14, nb(Lg) + " m", "middle", 11) + T(x0 - 4, 18 + (x * k) / 2 + 4, nb(x) + " m", "end", 11);
    return svg(320, 18 + 19 * k + 20, g, "enclos rectangulaire le long d'une rivière");
  };

  Object.assign(ACTIVE, {
    tauxvar: {
      predict: { q: "À 8 h, il fait 4 °C ; à 14 h, il fait 19 °C. En moyenne, la température a monté de…", choices: ["2,5 °C par heure", "15 °C par heure", "3,2 °C par heure"], good: 0,
        why: "Elle a monté de 19 − 4 = 15 °C en 14 − 8 = 6 heures : 15 ÷ 6 = 2,5 °C par heure. C'est un taux de variation moyen." },
      defis: ["f(x) = x². Le point A est fixé en x = 1. Déplace B pour que le taux de variation moyen de f entre 1 et b vaille 5.", "Même fonction : règle b pour que le taux de variation moyen vaille −1."],
      play: slide({
        ctl: () => [{ k: "b", lab: "Abscisse b du point B", min: -3, max: 5, step: 0.5 }],
        init: (s) => ({ b: s ? 3 : 2.5 }),
        fig: (st) => { const b = st.b, o = { xr: [-3.5, 5.5], yr: [-2, 26], gy: 2, ly: 4, fns: [{ f: (x) => x * x }], pts: [[1, 1, "A", "f-dot", "b"], [b, b * b, "B", "f-dot", b < 1 ? "l" : "r"]], lab: "parabole et sécante AB" };
          if (b !== 1) { o.fns.push({ f: (x) => (b + 1) * (x - 1) + 1, cls: "f-accent", w: 1.8 }); o.segs = [[1, 1, b, 1, "f-line", 1.2, "4 3"], [b, 1, b, b * b, "f-line", 1.2, "4 3"]]; }
          return graph(o); },
        out: (st) => (st.b === 1 ? "B est sur A : pas de sécante, on ne peut pas diviser par b − 1 = 0." : "Taux = (f(" + nb(st.b) + ") − f(1)) ÷ (" + nb(st.b) + " − 1) = " + nb(st.b * st.b - 1) + " ÷ " + nb(st.b - 1) + " = <b>" + nb(st.b + 1) + "</b><br><span class=\"small\">c'est la pente de la sécante AB (en rouge)</span>"),
        goal: [(st) => (st.b === 4 ? "Entre 1 et 4 : (16 − 1) ÷ (4 − 1) = 15 ÷ 3 = 5. La sécante AB monte de 5 par unité." : ""),
          (st) => (st.b === -2 ? "Entre 1 et −2 : (4 − 1) ÷ (−2 − 1) = 3 ÷ (−3) = −1. Taux négatif : la sécante descend. On garde le même ordre en haut et en bas." : "")],
        miss: (st, s) => (st.b === 1 ? "" : st.b + 1 < [5, -1][s] ? "Pente trop faible : déplace B vers la droite." : "Pente trop forte : déplace B vers la gauche."),
        ask: [null, { q: "Une voiture a parcouru s(t) = 2t² mètres après t secondes. Quelle est sa vitesse moyenne (en m/s) entre t = 1 s et t = 4 s ?", ans: 10, ok: "(s(4) − s(1)) ÷ (4 − 1) = (32 − 2) ÷ 3 = 10 m/s : une vitesse moyenne est un taux de variation moyen.", no: "Calcule s(4) et s(1), puis divise la différence par la durée 4 − 1." }] }),
    },
    nbderive: {
      predict: { q: "f(x) = x². Entre 3 et 3,1, le taux de variation moyen vaut 6,1 ; entre 3 et 3,01, il vaut 6,01. De quel nombre s'approche-t-il ?", choices: ["6", "9", "0"], good: 0,
        why: "Entre 3 et 3 + h, il vaut 6 + h : quand h devient minuscule, il s'approche de 6. C'est le nombre dérivé f'(3). (9 = f(3) est une hauteur, pas une pente.)" },
      defis: ["f(x) = x², A d'abscisse 3. Rapproche B de A : rends l'écart h le plus petit possible (sans 0).", "f(x) = 0,5x² − 1. Fais pivoter la droite autour de A(2 ; 1) jusqu'à ce qu'elle ne touche plus la courbe qu'en A."],
      play: slide({
        ctl: (s) => [s ? { k: "m", lab: "Pente de la droite", min: -2, max: 6, step: 0.5 } : { k: "h", lab: "Écart h entre A et B", min: -2, max: 2, step: 0.25 }],
        init: (s) => (s ? { m: 0 } : { h: 2 }),
        fig: (st, s) => {
          if (!s) { const h = st.h, o = { xr: [-0.5, 5.5], yr: [-1, 27], gy: 2, ly: 4, fns: [{ f: (x) => x * x }], pts: [[3, 9, "A", "f-dot", "l"], [3 + h, (3 + h) ** 2, h ? "B" : "", "f-dot", "r"]], lab: "parabole, sécante AB" };
            if (h) o.fns.push({ f: (x) => (6 + h) * (x - 3) + 9, cls: "f-accent", w: 1.8 });
            return graph(o); }
          const m = st.m, o = { xr: [-3, 6], yr: [-3, 10], fns: [{ f: fq }, { f: (x) => m * (x - 2) + 1, cls: m === 2 ? "f-accent" : "f-line", w: 1.8 }], pts: [[2, 1, "A", "f-dot", "r"]], lab: "parabole et droite pivotant autour de A" };
          if (m !== 2) o.pts.push([2 * m - 2, fq(2 * m - 2), "", "f-fill2"]);
          return graph(o); },
        out: (st, s) => (!s ? (st.h === 0 ? "h = 0 : B est sur A, le quotient n'a plus de sens (0 ÷ 0). On s'approche sans y aller." : "(f(3 + h) − f(3)) ÷ h = (6h + h²) ÷ h = 6 + h = <b>" + nb(6 + st.h) + "</b>")
          : st.m === 2 ? 'Pente 2 : <b class="act-ok">la droite ne touche la courbe qu\'en A</b>' : "Pente " + nb(st.m) + " : la droite recoupe la courbe en x = " + nb(2 * st.m - 2)),
        goal: [(st) => (Math.abs(st.h) === 0.25 ? "Avec h = " + nb(st.h) + ", le taux vaut " + nb(6 + st.h) + " : plus h est petit, plus on s'approche de 6. Cette limite est le nombre dérivé f'(3)." : ""),
          (st) => (st.m === 2 ? "La tangente en A a une pente de 2 : f'(2) = 2. Le nombre dérivé est la pente de la tangente." : "")],
        miss: (st, s) => (s ? "La droite coupe encore la courbe en un 2e point (point clair) : continue à pivoter." : "Rapproche B de A : rends h le plus petit possible, sans 0."),
        ask: [{ q: "Que vaut alors f'(3) pour f(x) = x² ?", ans: 6, ok: "6 + h tend vers 6 quand h tend vers 0 : f'(3) = 6, la pente de la tangente en 3.", no: "Le taux vaut 6 + h : que devient-il quand h devient très petit ?" },
          { q: "Une pierre tombe : elle a parcouru s(t) = 5t² mètres après t secondes. Sa vitesse instantanée (en m/s) à t = 2 s ?", ans: 20, ok: "(s(2 + h) − s(2)) ÷ h = (20h + 5h²) ÷ h = 20 + 5h, qui tend vers 20, donc s'(2) = 20 m/s.", no: "Calcule (s(2 + h) − s(2)) ÷ h, simplifie par h, puis fais tendre h vers 0." }] }),
    },
    derivref: {
      /* 24.11 : (cos x)' = −sin x en défi court */
      plus: [{ d: "\\(f(x) = \\cos x\\) (x en radians). Tape \\(f'\\left(\\frac{\\pi}{2}\\right)\\).", ans: -1, ok: "(cos x)' = −sin x, donc f'(π/2) = −sin(π/2) = −1 : la courbe du cosinus descend en π/2.", no: "La dérivée de cos x est −sin x : attention au signe −." }],
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\((x^n)' = n x^{n - 1}\\), aussi pour un exposant négatif ou fractionnaire. Ainsi \\(\\left(\\frac{1}{x}\\right)' = (x^{-1})' = -\\frac{1}{x^2}\\) et \\((\\sqrt{x})' = \\left(x^{\\frac{1}{2}}\\right)' = \\frac{1}{2\\sqrt{x}}\\). En radians : \\((\\sin x)' = \\cos x\\) et \\((\\cos x)' = -\\sin x\\). \\(f'(a)\\) est la pente de la tangente au point d'abscisse \\(a\\).", exemple: ["\\((x^3)' = 3x^2\\), donc la pente en 2 vaut \\(3 \\cdot 4 = 12\\).", "\\(\\left(\\frac{1}{x}\\right)' = -\\frac{1}{x^2}\\), donc \\(f'(2) = -\\frac{1}{4}\\).", "\\((\\sin x)' = \\cos x\\), donc \\(f'\\left(\\frac{\\pi}{3}\\right) = \\frac{1}{2}\\).", "\\((\\cos x)' = -\\sin x\\), donc \\(f'\\left(\\frac{\\pi}{2}\\right) = -1\\)."], piege: "Racines et inverses : écris d'abord une puissance de \\(x\\) (\\(\\sqrt{x} = x^{\\frac{1}{2}}\\), \\(\\frac{1}{x} = x^{-1}\\)), puis applique la règle." },
      predict: { q: "La dérivée de x² est 2x. Quelle est celle de x³ ?", choices: ["3x²", "2x³", "3x³"], good: 0,
        why: "On descend l'exposant devant et on le diminue de 1 : (x³)' = 3x². Règle générale : (xⁿ)' = n·xⁿ⁻¹. Une constante a pour dérivée 0." },
      defis: ["f(x) = x³. Tape la pente de la tangente au point d'abscisse 2, c'est-à-dire f'(2).", "f(x) = 1/x = x⁻¹. Tape f'(2).", "f(x) = √x = x^(1/2). Tape f'(4).", "f(x) = sin x (x en radians). Tape f'(π/3)."],
      play: hunt({ ask: true, label: "Pente de la tangente", blank: (s) => tanFig(DREF[s], null), show: (x, s) => tanFig(DREF[s], x),
        miss: (x, s) => ["(xⁿ)' = n·xⁿ⁻¹ : ici n = 3, puis remplace x par 2.", "Applique (xⁿ)' = n·xⁿ⁻¹ avec n = −1 : f'(x) = −x⁻² = −1/x².", "x^(1/2) se dérive en (1/2)·x^(−1/2) = 1/(2√x).", "La dérivée de sin x est cos x : calcule cos(π/3)."][s],
        wins: [W(12, "f'(x) = 3x², donc f'(2) = 3 · 4 = 12."), W(-0.25, "(x⁻¹)' = −x⁻² = −1/x², donc f'(2) = −1/4 : la courbe descend."), W(0.25, "(√x)' = 1/(2√x), donc f'(4) = 1/(2 · 2) = 1/4."), W(0.5, "(sin x)' = cos x, donc f'(π/3) = cos(π/3) = 1/2. De même, (cos x)' = −sin x.")] }),
    },
    derivregles: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\((u + v)' = u' + v'\\) et \\((k u)' = k u'\\). Pour un polynôme, chaque terme \\(a x^n\\) devient \\(n a x^{n - 1}\\) et la constante disparaît. Un produit peut d'abord être développé. La tangente est horizontale là où \\(f'(x) = 0\\)." },
      predict: { q: "Quelle est la dérivée de x³ + x² ?", choices: ["3x² + 2x", "6x", "3x² · 2x"], good: 0,
        why: "On dérive terme par terme : (x³)' + (x²)' = 3x² + 2x. La dérivée d'une somme est la somme des dérivées." },
      defis: ["f(x) = 2x³ − 5x² + 4x − 7. Tape la pente de la tangente en x = 2, c'est-à-dire f'(2).", "f(x) = (x + 1)(x − 3). Développe, puis tape f'(4).", "f(x) = x² − 6x + 1. En quelle abscisse la tangente est-elle horizontale ?"],
      play: hunt({ ask: true, label: "Ta réponse", blank: (s) => regFig(s, null), show: (x, s) => regFig(s, x),
        miss: (x, s) => ["Chaque terme a·xⁿ devient n·a·xⁿ⁻¹, la constante disparaît : f'(x) = 6x² − 10x + 4.", "Développe d'abord : x² − 2x − 3.", "Tangente horizontale : f'(x) = 0, avec f'(x) = 2x − 6."][s],
        wins: [W(8, "f'(x) = 6x² − 10x + 4 (le −7 disparaît), donc f'(2) = 24 − 20 + 4 = 8."), W(6, "(x + 1)(x − 3) = x² − 2x − 3, donc f'(x) = 2x − 2 et f'(4) = 6. (Le produit des dérivées, 1 · 1 = 1, serait faux.)"), W(3, "f'(x) = 2x − 6 = 0 pour x = 3 : la tangente est horizontale au sommet (3 ; −8).")] }),
    },
    derivprodquot: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\((uv)' = u'v + uv'\\). \\(\\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2}\\) (là où \\(v \\neq 0\\)) ; cas particulier \\(\\left(\\frac{1}{v}\\right)' = -\\frac{v'}{v^2}\\)." },
      predict: { q: "Vrai ou faux : la dérivée de x · x est (x)' · (x)' = 1 · 1 = 1.", choices: ["Vrai", "Faux"], good: 1,
        why: "Faux : x · x = x², dont la dérivée est 2x. La dérivée d'un produit n'est pas le produit des dérivées : (uv)' = u'v + uv' = 1 · x + x · 1 = 2x." },
      defis: ["f(x) = x²(3x + 1). Avec (uv)' = u'v + uv', tape f'(1).", "f(x) = (2x + 1) ÷ (x − 1). Avec (u/v)' = (u'v − uv') ÷ v², tape f'(3).", "f(x) = 1 ÷ (x² + 1). Avec (1/v)' = −v' ÷ v², tape f'(1)."],
      play: hunt({ ask: true, label: "Pente de la tangente", blank: (s) => tanFig(DPQ[s], null), show: (x, s) => tanFig(DPQ[s], x),
        miss: (x, s) => ["u = x², u' = 2x ; v = 3x + 1, v' = 3 : calcule u'v + uv' en x = 1.", "u'v − uv' = 2(x − 1) − (2x + 1) · 1 : le second produit se soustrait en entier.", "v = x² + 1 : v(1) = 2 et v'(1) = 2."][s],
        wins: [W(11, "f'(x) = 2x(3x + 1) + x² · 3 = 9x² + 2x, donc f'(1) = 11."), W(-0.75, "f'(x) = (2(x − 1) − (2x + 1)) ÷ (x − 1)² = −3 ÷ (x − 1)², donc f'(3) = −3/4."), W(-0.5, "f'(x) = −2x ÷ (x² + 1)², donc f'(1) = −2/4 = −1/2.")] }),
    },
    derivcomp: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\((f(u(x)))' = f'(u(x)) \\cdot u'(x)\\) : on dérive l'extérieur en gardant l'intérieur, puis on multiplie par la dérivée de l'intérieur. Cas fréquents : \\((u^n)' = n u^{n - 1} u'\\), \\((\\sqrt{u})' = \\frac{u'}{2\\sqrt{u}}\\), \\((\\cos u)' = -u' \\sin u\\).", exemple: ["\\(\\left((x^2 + 1)^3\\right)' = 3(x^2 + 1)^2 \\cdot 2x = 6x(x^2 + 1)^2\\)", "\\((\\cos(2x))' = -2\\sin(2x)\\)", "\\(\\left(\\sqrt{2x + 5}\\right)' = \\frac{2}{2\\sqrt{2x + 5}} = \\frac{1}{\\sqrt{2x + 5}}\\)"] },
      predict: { q: "Pour dériver (3x + 1)⁵, on écrit 5(3x + 1)⁴, puis…", choices: ["on multiplie par 3", "c'est fini", "on ajoute 3"], good: 0,
        why: "On dérive l'extérieur (la puissance 5) en gardant l'intérieur, puis on multiplie par la dérivée de l'intérieur, 3 : 15(3x + 1)⁴." },
      defis: ["f(x) = (2x − 5)³. Tape f'(4).", "f(x) = √(2x + 5). Tape f'(2).", "f(x) = cos(2x). Tape f'(π/4).", "f(x) = (x² + 1)³. Tape f'(1)."],
      play: hunt({ ask: true, label: "Ta réponse", blank: (s) => chain(s), show: (x, s) => chain(s) + plain(tu(x)),
        miss: (x, s) => ["(u³)' = 3u² · u' : n'oublie pas le facteur u' = 2.", "(√u)' = u' ÷ (2√u), avec u = 9 et u' = 2.", "(cos u)' = −u' · sin u, avec u = π/2 et u' = 2.", "3u² · u', avec u = 2 et u' = 2x = 2."][s],
        wins: [W(54, "Extérieur dérivé : 3u² = 3 · 3² = 27 ; intérieur : u' = 2. f'(4) = 27 · 2 = 54."), W(1 / 3, "(√u)' = u' ÷ (2√u) = 2 ÷ (2 · 3) = 1/3."), W(-2, "(cos u)' = −u' · sin u = −2 · sin(π/2) = −2."), W(24, "f'(x) = 3(x² + 1)² · 2x, donc f'(1) = 3 · 4 · 2 = 24.")] }),
    },
    tangente: {
      predict: { q: "f(3) = 9 et f'(3) = 6. La tangente au point d'abscisse 3 a pour pente…", choices: ["6", "9", "3"], good: 0,
        why: "La pente de la tangente est le nombre dérivé f'(3) = 6 ; elle passe par le point (3 ; 9)." },
      defis: ["Règle m et p pour que la droite y = mx + p soit la tangente à f(x) = x² au point d'abscisse 3.", "Même parabole : déplace le point de contact a pour que la tangente passe par P(0 ; −4)."],
      play: slide({
        ctl: (s) => (s ? [{ k: "a", lab: "Abscisse a du point de contact", min: -3, max: 3, step: 0.5 }] : [{ k: "m", lab: "Pente m", min: 0, max: 8 }, { k: "p", lab: "Ordonnée à l'origine p", min: -12, max: 0 }]),
        init: (s) => (s ? { a: 1 } : { m: 2, p: 0 }),
        fig: (st, s) => {
          const o = { xr: [-3.5, 5], yr: [-12, 20], gy: 2, ly: 4, fns: [{ f: (x) => x * x }], pts: [], lab: "parabole y = x² et une droite" };
          if (!s) { o.fns.push({ f: (x) => st.m * x + st.p, cls: st.m === 6 && st.p === -9 ? "f-accent" : "f-line", w: 1.8 }); o.pts.push([3, 9, "(3 ; 9)", "f-dot", "l"]); }
          else { const a = st.a; o.fns.push({ f: (x) => 2 * a * x - a * a, cls: a * a === 4 ? "f-accent" : "f-line", w: 1.8 }); o.pts.push([a, a * a, "", "f-dot"], [0, -4, "P", "f-fill2", "r"]); }
          return graph(o); },
        out: (st, s) => { if (s) { const a = st.a; return "Tangente en a = " + nb(a) + " : pente 2a = " + nb(2 * a) + ", y = " + nb(2 * a) + "x − " + nb(a * a) + "<br><span class=\"small\">ordonnée à l'origine : −a² = " + nb(-a * a) + "</span>"; }
          return "y = " + (st.m ? nb(st.m) + "x" : "") + (st.p < 0 ? " − " + nb(-st.p) : st.m ? "" : "0") + " ; en x = 3 : " + nb(3 * st.m + st.p) + (3 * st.m + st.p === 9 ? " (passe par le point)" : " (on veut 9)"); },
        goal: [(st) => (st.m === 6 && st.p === -9 ? "y = 6x − 9 : pente f'(3) = 6, et 6 · 3 − 9 = 9. C'est y = f'(3)(x − 3) + f(3) développé." : ""),
          (st) => (st.a * st.a === 4 ? "Avec a = " + nb(st.a) + ", la tangente y = " + nb(2 * st.a) + "x − 4 passe par (0 ; −4). Il y a deux tangentes par P : en a = 2 et en a = −2." : "")],
        miss: (st, s) => (s ? "L'ordonnée à l'origine de la tangente est −a² : on veut −4." : st.m === 6 ? "Bonne pente f'(3) = 6. Règle p pour que la droite passe par (3 ; 9) : 6 · 3 + p = 9." : 3 * st.m + st.p === 9 ? "La droite passe par (3 ; 9), mais sa pente n'est pas f'(3) : f'(x) = 2x." : ""),
        ask: [{ q: "La tangente à f(x) = √x en 100 a pour pente f'(100) = 1/20. Donne une valeur approchée de √104 avec cette tangente.", ans: 10.2, tol: 1e-6, ok: "√104 ≈ f(100) + f'(100) · 4 = 10 + 4/20 = 10,2 (la calculatrice donne 10,198…) : c'est l'approximation affine.", no: "f(100) = 10 : avance de 4 le long de la tangente, de pente 1/20." }, null] }),
    },
    variations: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Sur un intervalle, si \\(f' > 0\\), \\(f\\) est croissante ; si \\(f' < 0\\), décroissante. Méthode : calculer \\(f'(x)\\), trouver ses zéros, regarder le signe de \\(f'\\) de part et d'autre. Si \\(f'\\) passe de + à − en \\(a\\), \\(f(a)\\) est un maximum local ; de − à +, un minimum local." },
      predict: { q: "Sur un intervalle, f'(x) > 0. Alors f est…", choices: ["croissante", "positive", "décroissante"], good: 0,
        why: "Le signe de la dérivée donne le sens de variation : f' > 0, la courbe monte. (Une fonction peut être négative et croissante.)" },
      defis: ["f(x) = x³ − 3x. Déplace le point jusqu'au maximum local : tangente horizontale, et f' passe de + à −.", "f(x) = x³. Place le point là où f'(x) = 0. Est-ce un extremum ?"],
      play: slide({
        ctl: () => [{ k: "x", lab: "Abscisse du point", min: -2.5, max: 2.5, step: 0.25 }],
        init: (s) => (s ? { x: 1.5 } : { x: 2 }),
        fig: (st, s) => { const f = s ? (t) => t ** 3 : (t) => t ** 3 - 3 * t, d = s ? 3 * st.x * st.x : 3 * st.x * st.x - 3, x = st.x;
          return graph({ xr: [-2.6, 2.6], yr: s ? [-16, 16] : [-9, 9], gx: 0.5, lx: 1, gy: s ? 4 : 2, ly: s ? 8 : 4, fns: [{ f }], segs: [[x - 0.6, f(x) - 0.6 * d, x + 0.6, f(x) + 0.6 * d, d > 0 ? "f-blue" : d < 0 ? "f-accent" : "f-line", 3]], pts: [[x, f(x), "", "f-dot"]], lab: "courbe et tangente au point choisi" }); },
        out: (st, s) => { const d = s ? 3 * st.x * st.x : 3 * st.x * st.x - 3; return "f'(" + nb(st.x) + ") = <b>" + nb(d) + "</b>" + (d > 0 ? " > 0 : f monte" : d < 0 ? " < 0 : f descend" : " : tangente horizontale"); },
        goal: [(st) => (st.x === -1 ? "En −1, f' passe de + à − : f(−1) = −1 + 3 = 2 est un maximum local. f'(x) = 3(x − 1)(x + 1)." : ""),
          (st) => (st.x === 0 ? "f'(0) = 0, mais f'(x) = 3x² est positive des deux côtés : pas de changement de signe, donc pas d'extremum en 0." : "")],
        miss: (st, s) => (!s && st.x === 1 ? "Tangente horizontale, mais f' passe de − à + : c'est un minimum. Cherche le maximum." : ""),
        ask: [{ q: "Pour f(x) = x³ − 3x, quelle est la valeur du minimum local ?", ans: -2, ok: "f' passe de − à + en x = 1 : minimum local f(1) = 1 − 3 = −2. L'extremum est la valeur f(1), pas l'abscisse 1.", no: "Le minimum local est en x = 1 : calcule f(1)." },
          { q: "g(x) = x³ − 3x² − 9x + 2. Quelle est la valeur du minimum local de g ?", ans: -25, ok: "g'(x) = 3x² − 6x − 9 = 3(x + 1)(x − 3) passe de − à + en 3, d'où le minimum g(3) = 27 − 27 − 27 + 2 = −25.", no: "g'(x) = 3(x + 1)(x − 3) : le minimum est en x = 3, calcule g(3)." }] }),
    },
    optimderiv: {
      predict: { q: "Avec 40 m de clôture le long d'une rivière (trois côtés à clôturer), quel enclos a la plus grande aire ?", choices: ["10 m × 20 m", "13 m × 14 m", "5 m × 30 m"], good: 0,
        why: "Les trois utilisent 40 m (2 · 10 + 20, 2 · 13 + 14, 2 · 5 + 30). Aires : 200 m², 182 m², 150 m². A(x) = x(40 − 2x) est maximale pour x = 10." },
      defis: ["Enclos le long d'une rivière : 40 m de clôture pour les trois autres côtés. Règle la largeur x pour que l'aire soit maximale.", "Boîte sans couvercle : dans une feuille de 30 cm × 30 cm, on découpe un carré de côté x à chaque coin. Règle x pour que le volume soit maximal."],
      play: slide({
        ctl: (s) => [s ? { k: "x", lab: "Côté x des carrés découpés (cm)", min: 0.5, max: 14.5, step: 0.5 } : { k: "x", lab: "Largeur x (m)", min: 1, max: 19 }],
        init: (s) => ({ x: s ? 2 : 4 }),
        fig: (st, s) => { const x = st.x;
          if (!s) return enclos(x);
          return graph({ xr: [0, 15], yr: [0, 2200], pad: 26, gy: 200, ly: 1000, lx: 5, fns: [{ f: (t) => t * (30 - 2 * t) ** 2 }], segs: [[x, 0, x, x * (30 - 2 * x) ** 2, "f-line", 1.2, "4 3"]], pts: [[x, x * (30 - 2 * x) ** 2, "", "f-dot"]], fy: (v) => mil(v, 0), lab: "volume de la boîte selon x" }); },
        out: (st, s) => (s ? "V(x) = x(30 − 2x)² = " + nb(st.x) + " · " + nb(30 - 2 * st.x) + "² = <b>" + mil(st.x * (30 - 2 * st.x) ** 2, 1) + " cm³</b>" : "A(x) = x(40 − 2x) = " + st.x + " · " + (40 - 2 * st.x) + " = <b>" + st.x * (40 - 2 * st.x) + " m²</b>"),
        goal: [(st) => (st.x === 10 ? "x = 10 m : A'(x) = 40 − 4x = 0 pour x = 10. Aire maximale 10 · 20 = 200 m²." : ""),
          (st) => (st.x === 5 ? "x = 5 cm : V'(x) = (30 − 2x)(30 − 6x) = 0 pour x = 5 (x = 15 ne donne pas de boîte). Volume maximal 5 · 20² = 2'000 cm³." : "")],
        miss: (st, s) => (s ? (st.x < 5 ? "Le volume augmente encore : avance." : "Le volume diminue : recule.") : st.x < 10 ? "L'aire augmente encore : élargis." : "L'aire diminue : rétrécis."),
        ask: [{ q: "Même enclos, mais avec 60 m de clôture : quelle largeur x (en m) donne l'aire maximale ?", ans: 15, ok: "A(x) = x(60 − 2x), A'(x) = 60 − 4x = 0 pour x = 15 m (aire 15 · 30 = 450 m²).", no: "Écris A(x) = x(60 − 2x), dérive, puis résous A'(x) = 0." },
          { q: "Même boîte dans une feuille de 24 cm × 24 cm : quel x (en cm) donne le volume maximal ?", ans: 4, ok: "V'(x) = (24 − 2x)(24 − 6x) s'annule en 4 et en 12 ; seul x = 4 donne une boîte. Volume 4 · 16² = 1'024 cm³.", no: "V(x) = x(24 − 2x)², et V'(x) = (24 − 2x)(24 − 6x)." }] }),
    },
  });

  // =====================================================================================================
  // 4e Collège · Intégration, ln et exp (ch4c_ana.js)
  // =====================================================================================================
  const E = Math.E;
  // lnexp : quatre figures (équation, deux tangentes, lecture de ln).
  const LNT = [
    null,
    { f: (x) => x * Math.log(x), a: E * E, m: 3, xr: [0, 10], yr: [-2, 24], gy: 2, ly: 4, lab: "(e² ; 2e²)", txt: "f(x) = x · ln x et son point d'abscisse e² ≈ 7,39" },
    { f: (x) => Math.exp(x * x), a: 1, m: 2 * E, tol: 0.006, xr: [-1.6, 1.8], yr: [-1, 12], gx: 0.5, lx: 1, lab: "(1 ; e)", txt: "f(x) = e^(x²) et son point d'abscisse 1" },
  ];
  const lnFig = (s, x) => {
    if (s === 0) { const g = (t) => Math.exp(2 * t - 1), o = { xr: [-1, 2.5], yr: [-1, 12], gx: 0.5, lx: 1, fns: [{ f: g }], hl: [[5, "f-accent"]], pts: [], lab: "courbe y = e^(2x − 1) et droite y = 5" };
      if (x !== null) o.pts.push([x, g(x), "", "f-dot"]);
      return graph(o) + plain(x === null ? '<span class="small">en bleu y = e^(2x − 1), en rouge la hauteur 5</span>' : "e^(2 · " + nb(x) + " − 1) ≈ <b>" + nb(+g(x).toFixed(3)) + "</b> (on veut 5)"); }
    if (s < 3) return tanFig(LNT[s], x);
    const o = { xr: [0, 60], yr: [-1, 5], gx: 10, lx: 20, fns: [{ f: Math.log }], pts: [[E ** 4, Math.log(E ** 4), "", "f-fill2"]], lab: "courbe y = ln x" };
    if (x !== null) o.pts.push([E ** 4, x, "", "f-dot"]);
    return graph(o) + plain(x === null ? '<span class="small">courbe y = ln x ; le point clair est en x = e⁴ ≈ 54,6</span>' : "Tu proposes ln(e⁴) = <b>" + nb(x) + "</b> : " + (x === 4 ? '<b class="act-ok">le point est sur la courbe</b>' : "le point n'est pas sur la courbe"));
  };

  Object.assign(ACTIVE, {
    primitives: {
      /* 24.11 : sin → −cos et 1/x² → −1/x en défis courts */
      plus: [{ d: "\\(f(x) = \\sin x\\) a pour primitives \\(F(x) = -\\cos x + C\\). Que vaut \\(C\\) si \\(F(0) = 3\\) ?", ans: 4, ok: "(−cos x)' = sin x. F(0) = −cos 0 + C = −1 + C = 3, donc C = 4.", no: "cos 0 = 1 : F(0) = −1 + C." },
        { d: "\\(f(x) = \\frac{1}{x^2}\\) a pour primitives \\(F(x) = -\\frac{1}{x} + C\\). Que vaut \\(C\\) si \\(F(1) = 2\\) ?", ans: 3, ok: "(−1/x)' = 1/x². F(1) = −1 + C = 2, donc C = 3.", no: "F(1) = −1/1 + C." }],
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\(F\\) est une primitive de \\(f\\) si \\(F'(x) = f(x)\\). On primitive terme à terme : \\(x^n \\to \\frac{x^{n + 1}}{n + 1}\\), \\(\\cos x \\to \\sin x\\), \\(\\sin x \\to -\\cos x\\), \\(\\frac{1}{x^2} \\to -\\frac{1}{x}\\). Toutes les primitives diffèrent d'une constante \\(C\\) ; une condition (\\(F(a) = b\\)) la fixe." },
      predict: { q: "Quelle fonction a pour dérivée 2x ?", choices: ["x²", "2", "2x²"], good: 0,
        why: "(x²)' = 2x : x² est une primitive de 2x. Mais x² + 3 aussi ! Toutes les primitives diffèrent d'une constante." },
      defis: ["f(x) = 6x² − 4x + 1 a pour primitives F(x) = 2x³ − 2x² + x + C. Règle C pour que F(1) = 5.", "f(x) = cos x a pour primitives F(x) = sin x + C. Règle C pour que F(π/2) = −1."],
      play: slide({
        ctl: (s) => [s ? { k: "C", lab: "Constante C", min: -4, max: 4, step: 0.5 } : { k: "C", lab: "Constante C", min: -6, max: 6 }],
        init: (s) => ({ C: s ? 1 : 0 }),
        fig: (st, s) => { const F = s ? (x) => Math.sin(x) : (x) => 2 * x ** 3 - 2 * x * x + x, P = s ? [Math.PI / 2, -1] : [1, 5], o = s ? { xr: [-1, 6.5], yr: [-5, 5] } : { xr: [-1.5, 2.2], yr: [-8, 10], gx: 0.5, lx: 1, gy: 2, ly: 4 };
          o.fns = [-2, 2].map((d) => ({ f: (x) => F(x) + st.C + d, cls: "f-line", w: 1, dash: true })).concat([{ f: (x) => F(x) + st.C }]);
          o.pts = [[P[0], P[1], s ? "(π/2 ; −1)" : "(1 ; 5)", "f-fill2", "r"]]; o.lab = "primitives de f, décalées verticalement";
          return graph(o) + plain('<span class="small">en bleu F avec ta constante C ; en pointillés : d\'autres primitives (C ± 2)</span>'); },
        out: (st, s) => (s ? "F(π/2) = sin(π/2) + C = 1 + " + par(st.C) + " = <b>" + nb(1 + st.C) + "</b> (on veut −1)" : "F(1) = 2 − 2 + 1 + C = 1 + " + par(st.C) + " = <b>" + nb(1 + st.C) + "</b> (on veut 5)"),
        goal: [(st) => (st.C === 4 ? "F(x) = 2x³ − 2x² + x + 4 : F(1) = 1 + 4 = 5. Toutes les primitives ne diffèrent que de C ; la condition F(1) = 5 la fixe." : ""),
          (st) => (st.C === -2 ? "F(x) = sin x − 2 : F(π/2) = 1 − 2 = −1. Une primitive de cos x est sin x ; une primitive de sin x est −cos x." : "")],
        miss: (st, s) => (1 + st.C < (s ? -1 : 5) ? "La courbe passe sous le point : augmente C." : "La courbe passe au-dessus du point : diminue C."),
        ask: [{ q: "f(x) = 3x² − 4x. Sa primitive F vérifie F(0) = 5. Calcule F(3).", ans: 14, ok: "F(x) = x³ − 2x² + 5, donc F(3) = 27 − 18 + 5 = 14. Vérification : F'(x) = 3x² − 4x.", no: "Une primitive de 3x² est x³, de −4x c'est −2x² ; puis F(0) = C = 5." },
          { q: "Une primitive de (2x + 1)³ s'écrit (2x + 1)⁴ ÷ k. Que vaut k ?", ans: 8, ok: "La dérivée de (2x + 1)⁴ est 4 · 2 · (2x + 1)³ = 8(2x + 1)³ : il faut diviser par k = 8 (par 4 et par 2).", no: "Dérive (2x + 1)⁴ : 4(2x + 1)³ · 2. Par quoi faut-il diviser pour retrouver (2x + 1)³ ?" }] }),
    },
    integrale: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Théorème fondamental : \\(\\int_a^b f(x)\\,dx = F(b) - F(a)\\) où \\(F\\) est une primitive de \\(f\\). Si \\(f \\geq 0\\), c'est l'aire sous la courbe ; les parties sous l'axe comptent négativement. Valeur moyenne : \\(\\frac{1}{b - a}\\int_a^b f(x)\\,dx\\). Relation de Chasles : \\(\\int_a^b f + \\int_b^c f = \\int_a^c f\\) ; échanger les bornes change le signe ; \\(\\int_a^b k f = k\\int_a^b f\\).", exemple: ["\\(\\int_1^3 2x\\,dx = 3^2 - 1^2 = 8\\).", "\\(\\int_0^2 f = 3\\) et \\(\\int_2^5 f = 4\\) : \\(\\int_0^5 f = 7\\), \\(\\int_5^0 f = -7\\), \\(\\int_0^5 3f = 21\\)."] },
      /* 24.11 : Chasles, bornes échangées et linéarité, en défis courts */
      plus: [{ d: "\\(\\int_0^2 f(x)\\,dx = 3\\) et \\(\\int_2^5 f(x)\\,dx = 4\\). Que vaut \\(\\int_0^5 f(x)\\,dx\\) ?", ans: 7, ok: "Relation de Chasles : on met bout à bout [0 ; 2] et [2 ; 5] : 3 + 4 = 7.", no: "L'intervalle [0 ; 5] est fait de [0 ; 2] et de [2 ; 5]." },
        { d: "Même \\(f\\) : que vaut \\(\\int_5^0 f(x)\\,dx\\) ?", ans: -7, ok: "Échanger les bornes change le signe : F(0) − F(5) = −(F(5) − F(0)) = −7.", no: "Les bornes sont dans l'autre ordre : F(0) − F(5)." },
        { d: "Même \\(f\\) : que vaut \\(\\int_0^5 3f(x)\\,dx\\) ?", ans: 21, ok: "Le facteur 3 sort de l'intégrale : 3 · 7 = 21 (linéarité).", no: "Une constante sort de l'intégrale." }],
      predict: { q: "Une primitive de 2x est x². Quelle est l'aire sous la droite y = 2x entre x = 1 et x = 3 ?", choices: ["8", "4", "9"], good: 0,
        why: "x² vaut 9 en 3 et 1 en 1 : 9 − 1 = 8 (borne du haut moins borne du bas). C'est le théorème fondamental : ∫ f = F(b) − F(a)." },
      defis: ["Règle la borne b pour que \\(\\int_1^b 2x\\,dx = 8\\).", "Règle b pour que \\(\\int_0^b (x - 2)\\,dx = 0\\)."],
      play: slide({
        ctl: () => [{ k: "b", lab: "Borne b", min: 0.5, max: 5.5, step: 0.5 }],
        init: () => ({ b: 2 }),
        fig: (st, s) => { const b = st.b;
          if (!s) return graph({ xr: [-0.5, 6], yr: [-1, 12], gy: 1, ly: 2, fns: [{ f: (x) => 2 * x }], polys: b > 1 ? [[shade((x) => 2 * x, z0, 1, b), "f-fill2"]] : [], vl: [[1, "f-line"]], lab: "aire sous y = 2x entre 1 et b" });
          const f = (x) => x - 2, P = [[shade(f, z0, 0, Math.min(b, 2)), "f-soft"]];
          if (b > 2) P.push([shade(f, z0, 2, b), "f-fill2"]);
          return graph({ xr: [-0.5, 6], yr: [-3, 4], fns: [{ f }], polys: P, lab: "y = x − 2 : partie sous l'axe (grise) et au-dessus (bleue)" }); },
        out: (st, s) => (s ? "∫₀ᵇ (x − 2) dx = [x²/2 − 2x] = " + nb(st.b * st.b / 2) + " − " + nb(2 * st.b) + " = <b>" + nb(st.b * st.b / 2 - 2 * st.b) + "</b><br><span class=\"small\">la partie sous l'axe compte négativement</span>"
          : st.b < 1 ? "b < 1 : ∫₁ᵇ = −∫ᵇ₁, on obtient " + nb(st.b * st.b - 1) : "∫₁ᵇ 2x dx = [x²]₁ᵇ = " + nb(st.b * st.b) + " − 1 = <b>" + nb(st.b * st.b - 1) + "</b>"),
        goal: [(st) => (st.b === 3 ? "∫₁³ 2x dx = 3² − 1² = 8 : c'est l'aire du trapèze coloré, calculée avec la primitive x²." : ""),
          (st) => (st.b === 4 ? "∫₀⁴ (x − 2) dx = 8 − 8 = 0 : la partie au-dessus de l'axe compense exactement celle du dessous." : "")],
        miss: (st, s) => ((s ? st.b * st.b / 2 - 2 * st.b < 0 : st.b * st.b - 1 < 8) ? "Pas assez : augmente b." : "Trop : diminue b."),
        ask: [{ q: "Calcule \\(\\int_1^4 3x^2\\,dx\\).", ans: 63, ok: "Une primitive de 3x² est x³ : 4³ − 1³ = 64 − 1 = 63.", no: "Primitive de 3x² : x³. Puis F(4) − F(1)." },
          { q: "Valeur moyenne de f(x) = x² sur [0 ; 3] ?", ans: 3, ok: "(1 ÷ 3) · ∫₀³ x² dx = (1 ÷ 3) · 9 = 3.", no: "Valeur moyenne : l'intégrale ∫₀³ x² dx = 9, divisée par la longueur de l'intervalle." }] }),
    },
    aireint: {
      predict: { q: "L'intégrale de x³ entre −1 et 1 vaut 0. L'aire entre la courbe y = x³ et l'axe des x, de −1 à 1, vaut-elle aussi 0 ?", choices: ["Non", "Oui"], good: 0,
        why: "Non : dans l'intégrale, la partie sous l'axe compte négativement et compense l'autre. Pour une aire, on prend chaque morceau en valeur absolue : 1/4 + 1/4 = 1/2." },
      defis: ["Règle la pente m de la droite y = mx pour que l'aire entre la droite et la parabole y = x² vaille 4/3.", "f(x) = x² − 2x. Règle b pour que \\(\\int_0^b f(x)\\,dx = 0\\)."],
      play: slide({
        ctl: (s) => [s ? { k: "b", lab: "Borne b", min: 0.5, max: 4, step: 0.5 } : { k: "m", lab: "Pente m", min: 0.5, max: 4, step: 0.5 }],
        init: (s) => (s ? { b: 2 } : { m: 1 }),
        fig: (st, s) => {
          if (!s) { const m = st.m; return graph({ xr: [-0.5, 4.5], yr: [-1, 17], gy: 1, ly: 4, fns: [{ f: (x) => x * x }, { f: (x) => m * x, cls: "f-accent", w: 2 }], polys: [[shade((x) => m * x, (x) => x * x, 0, m), "f-fill2"]], lab: "aire entre une droite et la parabole" }); }
          const f = (x) => x * x - 2 * x, b = st.b, P = [[shade(f, z0, 0, Math.min(b, 2)), "f-soft"]];
          if (b > 2) P.push([shade(f, z0, 2, b), "f-fill2"]);
          return graph({ xr: [-0.5, 4.5], yr: [-2, 6], fns: [{ f }], polys: P, lab: "y = x² − 2x : partie sous l'axe (grise) et au-dessus (bleue)" }); },
        out: (st, s) => (s ? "∫₀ᵇ (x² − 2x) dx = b³/3 − b² = <b>" + fr(st.b ** 3 / 3 - st.b * st.b) + "</b>" : "Intersections x = 0 et x = " + nb(st.m) + " ; aire = ∫₀ᵐ (mx − x²) dx = m³ ÷ 6 = <b>" + fr(st.m ** 3 / 6) + "</b>"),
        goal: [(st) => (st.m === 2 ? "m = 2 : intersections 0 et 2, aire ∫₀² (2x − x²) dx = 4 − 8/3 = 4/3. On intègre « haut moins bas » entre les intersections." : ""),
          (st) => (st.b === 3 ? "∫₀³ (x² − 2x) dx = 9 − 9 = 0 : la partie sous l'axe (−4/3) compense celle du dessus (+4/3). L'intégrale est nulle, mais pas l'aire !" : "")],
        miss: (st, s) => (s ? (st.b ** 3 / 3 - st.b * st.b < 0 ? "Encore négatif : augmente b." : "Trop : diminue b.") : st.m ** 3 / 6 < 4 / 3 ? "Aire trop petite : augmente m." : "Aire trop grande : diminue m."),
        ask: [{ q: "Aire du domaine compris entre y = 4 − x² et y = x + 2 ?", ans: 4.5, ok: "4 − x² = x + 2 donne x = −2 ou x = 1 ; ∫₋₂¹ (−x² − x + 2) dx = 7/6 + 10/3 = 9/2.", no: "Résous 4 − x² = x + 2, puis intègre (4 − x²) − (x + 2) entre les deux solutions." },
          { q: "Quelle est alors l'aire totale entre la courbe y = x² − 2x et l'axe des x, sur [0 ; 3] ?", ans: 8 / 3, ok: "On coupe au zéro x = 2 : |−4/3| + 4/3 = 8/3.", no: "Coupe en x = 2 (zéro de f) et additionne les valeurs absolues des deux intégrales." }] }),
    },
    volrev: {
      predict: { q: "On fait tourner la courbe de f autour de l'axe des x. Une tranche très fine du solide est…", choices: ["un disque de rayon f(x)", "un rectangle de hauteur f(x)", "un cercle de diamètre x"], good: 0,
        why: "Chaque tranche d'épaisseur dx est un disque d'aire π · f(x)² : en les empilant, V = π ∫ f(x)² dx." },
      defis: ["Le segment y = (r ÷ 3) · x, pour x de 0 à 3, tourne autour de l'axe des x : c'est un cône de hauteur 3. Règle r pour que son volume soit 4π.", "Le demi-cercle y = √(r² − x²) tourne autour de l'axe des x : c'est une boule. Règle r pour que son volume soit 36π."],
      play: slide({
        ctl: (s) => [{ k: "r", lab: "Rayon r", min: s ? 1 : 0.5, max: s ? 5 : 4, step: 0.5 }],
        init: (s) => ({ r: s ? 2 : 1 }),
        fig: (st, s) => { const r = st.r;
          if (!s) { const f = (x) => (r / 3) * x; return graph({ xr: [-0.5, 4], yr: [-4.5, 4.5], eq: true, fns: [{ f, from: 0, to: 3 }, { f: (x) => -f(x), from: 0, to: 3, cls: "f-line", w: 1.4, dash: true }], polys: [[shade(f, (x) => -f(x), 0, 3), "f-fill2"]], segs: [[3, -r, 3, r, "f-line", 1.4, "4 3"]], lab: "profil du cône" }); }
          const f = (x) => Math.sqrt(Math.max(0, r * r - x * x));
          return graph({ xr: [-5.5, 5.5], yr: [-5.5, 5.5], eq: true, H: 220, fns: [{ f, from: -r, to: r }, { f: (x) => -f(x), from: -r, to: r, cls: "f-line", w: 1.4, dash: true }], polys: [[shade(f, (x) => -f(x), -r, r), "f-fill2"]], lab: "profil de la boule" }); },
        out: (st, s) => (s ? "V = π ∫₋ᵣʳ (r² − x²) dx = (4/3)π r³ = <b>" + nb(+((4 / 3) * st.r ** 3).toFixed(2)) + " π</b>" : "V = π ∫₀³ (r x ÷ 3)² dx = π · r² ÷ 9 · 9 = <b>" + nb(st.r * st.r) + " π</b>"),
        goal: [(st) => (st.r === 2 ? "r = 2 : V = π ∫₀³ (2x/3)² dx = π · (4/9) · 9 = 4π, comme la formule du cône (1/3)π r² h = (1/3)π · 4 · 3." : ""),
          (st) => (st.r === 3 ? "r = 3 : (4/3)π · 27 = 36π. La formule de la boule vient de π ∫ (r² − x²) dx." : "")],
        miss: (st, s) => ((s ? (4 / 3) * st.r ** 3 < 36 : st.r * st.r < 4) ? "Volume trop petit : augmente r." : "Volume trop grand : diminue r."),
        ask: [{ q: "Le graphe de f(x) = √x tourne autour de l'axe des x, de x = 0 à x = 4. Volume divisé par π ?", ans: 8, ok: "V = π ∫₀⁴ (√x)² dx = π ∫₀⁴ x dx = π · 8 : on intègre f(x)², ici x.", no: "On intègre f(x)² = x, pas √x : calcule ∫₀⁴ x dx." },
          { q: "Un tube : le domaine entre R(x) = 2 et r(x) = 1, de x = 0 à x = 5, tourne autour de l'axe des x. Volume divisé par π ?", ans: 15, ok: "Solide creux : π ∫₀⁵ (2² − 1²) dx = π · 3 · 5 = 15π.", no: "Solide creux : π ∫ (R² − r²) dx, ici (4 − 1) sur une longueur 5." }] }),
    },
    lnexp: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "\\(e^x\\) et \\(\\ln\\) sont réciproques : \\(e^x = a \\iff x = \\ln a\\) (\\(a > 0\\)). \\(\\ln(ab) = \\ln a + \\ln b\\), \\(\\ln\\frac{a}{b} = \\ln a - \\ln b\\), \\(\\ln(a^n) = n\\ln a\\) et \\(\\ln 1 = 0\\). Dérivées : \\((e^x)' = e^x\\), \\((e^{u})' = u'e^{u}\\), \\((\\ln x)' = \\frac{1}{x}\\). Une primitive de \\(\\frac{1}{x}\\) est \\(\\ln x\\).", exemple: ["\\(e^{2x - 1} = 5 \\iff 2x - 1 = \\ln 5 \\iff x = \\frac{\\ln 5 + 1}{2}\\)", "\\((x\\ln x)' = \\ln x + 1\\)", "\\(\\int_1^{e^4} \\frac{dx}{x} = \\ln(e^4) - \\ln 1 = 4\\)", "\\(\\ln a = 2\\) et \\(\\ln b = 5\\) : \\(\\ln(ab) = 7\\) et \\(\\ln\\frac{b}{a} = 3\\)"] },
      /* 24.11 : ln(ab) et ln(a/b), essentiels à la notion, en défis courts */
      plus: [{ d: "On sait que \\(\\ln a = 2\\) et \\(\\ln b = 5\\). Que vaut \\(\\ln(ab)\\) ?", ans: 7, ok: "ln(ab) = ln a + ln b = 2 + 5 = 7 : le logarithme transforme un produit en somme.", no: "Le logarithme d'un produit est la somme des logarithmes." },
        { d: "Mêmes \\(a\\) et \\(b\\) : que vaut \\(\\ln\\left(\\frac{b}{a}\\right)\\) ?", ans: 3, ok: "ln(b/a) = ln b − ln a = 5 − 2 = 3 : un quotient devient une différence.", no: "Le logarithme d'un quotient est la différence des logarithmes." }],
      predict: { q: "La dérivée de eˣ est…", choices: ["eˣ", "x · eˣ⁻¹", "e"], good: 0,
        why: "eˣ est sa propre dérivée : en chaque point, la pente de la courbe égale sa hauteur. Ce n'est pas une puissance de x." },
      defis: ["Résous e^(2x − 1) = 5 (au centième).", "f(x) = x · ln x. Tape la pente de la tangente en x = e².", "f(x) = e^(x²). Tape f'(1) (au centième).", "Calcule l'intégrale de 1/x entre 1 et e⁴."],
      play: hunt({ ask: true, label: "Ta réponse", blank: (s) => lnFig(s, null), show: (x, s) => lnFig(s, x),
        miss: (x, s) => ["ln et exp sont réciproques : e^(2x − 1) = 5 ⟺ 2x − 1 = ln 5.", "Produit : (x · ln x)' = 1 · ln x + x · (1/x). Et ln(e²) = 2.", "(e^u)' = u' · e^u avec u = x².", "Une primitive de 1/x est ln x : ln(e⁴) − ln 1. Rappel : ln(aⁿ) = n · ln a."][s],
        wins: [W((Math.log(5) + 1) / 2, "2x − 1 = ln 5, donc x = (ln 5 + 1) ÷ 2 ≈ 1,30.", 0.006), W(3, "(x · ln x)' = ln x + 1 ; en x = e² : 2 + 1 = 3."), W(2 * E, "f'(x) = 2x · e^(x²), donc f'(1) = 2e ≈ 5,44.", 0.006), W(4, "∫₁^(e⁴) dx/x = ln(e⁴) − ln 1 = 4 − 0 = 4.")] }),
    },
    croissance: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Modèle \\(N(t) = N_0 e^{kt}\\) : croissance si \\(k > 0\\), décroissance si \\(k < 0\\). Pour trouver \\(t\\) : isoler \\(e^{kt}\\), puis appliquer \\(\\ln\\). Demi-vie \\(T\\) : \\(k = \\frac{\\ln 2}{T}\\) ; après 3 demi-vies, il reste \\(\\frac{1}{8}\\)." },
      predict: { q: "Une quantité double toutes les 3 heures. Après 9 heures, elle a été multipliée par…", choices: ["8", "3", "6"], good: 0,
        why: "9 heures = 3 doublements : × 2 × 2 × 2 = × 8. Une croissance exponentielle multiplie, elle n'additionne pas." },
      defis: ["Des bactéries suivent N(t) = 400 · e^(0,25t) (t en heures). Règle t pour que la population ait doublé.", "Un isotope a une demi-vie de 5 ans : Q(t) = 800 · e^(−kt) grammes, avec k = ln 2 ÷ 5. Règle t pour qu'il n'en reste que 100 g."],
      play: slide({
        ctl: (s) => [s ? { k: "t", lab: "Temps t (années)", min: 0, max: 25 } : { k: "t", lab: "Temps t (heures)", min: 0, max: 6, step: 0.1 }],
        init: (s) => ({ t: s ? 4 : 1 }),
        fig: (st, s) => { const t = st.t, f = s ? (x) => 800 * Math.exp((-Math.LN2 / 5) * x) : (x) => 400 * Math.exp(0.25 * x);
          return graph(s ? { xr: [0, 26], yr: [0, 900], pad: 22, gx: 1, lx: 5, gy: 100, ly: 200, fns: [{ f }], hl: [[100, "f-accent"]], pts: [[t, f(t), "", "f-dot"]], lab: "décroissance exponentielle" }
            : { xr: [0, 6.2], yr: [0, 1900], pad: 26, gx: 0.5, lx: 1, gy: 200, ly: 400, fns: [{ f }], hl: [[800, "f-accent"]], pts: [[t, f(t), "", "f-dot"]], lab: "croissance exponentielle", fy: (v) => mil(v, 0) }); },
        out: (st, s) => (s ? "Q(" + nb(st.t) + ") = 800 · e^(−k · " + nb(st.t) + ") ≈ <b>" + mil(800 * Math.exp((-Math.LN2 / 5) * st.t), 1) + " g</b> (on veut 100)" : "N(" + nb(st.t) + ") = 400 · e^(0,25 · " + nb(st.t) + ") ≈ <b>" + mil(400 * Math.exp(0.25 * st.t), 0) + "</b> (on veut 800)"),
        goal: [(st) => (Math.abs(st.t - 2.8) < 1e-9 ? "e^(0,25t) = 2 ⟺ t = ln 2 ÷ 0,25 ≈ 2,77 h. Le temps de doublement ne dépend pas de N₀." : ""),
          (st) => (st.t === 15 ? "15 ans = 3 demi-vies : 800 → 400 → 200 → 100 g, il reste 1/8. Calcul : e^(−kt) = 1/8 ⟺ t = ln 8 ÷ k = 15." : "")],
        miss: (st, s) => (s ? (800 * Math.exp((-Math.LN2 / 5) * st.t) > 100 ? "Il en reste trop : avance le temps." : "Il en reste moins de 100 g : recule.") : 400 * Math.exp(0.25 * st.t) < 800 ? "Pas encore doublé : avance t." : "Plus que le double : recule t."),
        ask: [{ q: "N(t) = 500 · e^(0,2t). Au bout de combien de temps atteint-on 2'000 ? (au dixième)", ans: Math.log(4) / 0.2, tol: 0.06, ok: "e^(0,2t) = 4, donc t = ln 4 ÷ 0,2 ≈ 6,9.", no: "Isole l'exponentielle : e^(0,2t) = 2'000 ÷ 500 = 4, puis applique ln." },
          { q: "Une population augmente de 5 % par an. Son taux continu k = ln(1,05) vaut environ… (au millième)", ans: Math.log(1.05), tol: 0.0006, ok: "k = ln(1,05) ≈ 0,049, un peu moins que 0,05 : N₀ · e^(kt) = N₀ · 1,05ᵗ.", no: "Une croissance de p % par an correspond à k = ln(1 + p/100)." }] }),
    },
  });

  // =====================================================================================================
  // 4e Collège · Algèbre linéaire
  // =====================================================================================================
  // Matrice 2 × 2 dessinée : x, y = coin haut gauche ; M = [[a, b], [c, d]] (texte) ; hl = { r, c } ligne ou colonne mise en évidence.
  const mat = (x, y, Mx, hl = {}) => {
    const w = 66, h = 46;
    let g = `<path d="M${x + 6},${y} h-6 v${h} h6 M${x + w - 6},${y} h6 v${h} h-6" class="f-line" fill="none" stroke-width="1.6"/>`;
    if (hl.r !== undefined) g += `<rect x="${x + 3}" y="${y + 3 + hl.r * 21}" width="${w - 6}" height="19" rx="5" class="f-fill2"/>`;
    if (hl.c !== undefined) g += `<rect x="${x + 4 + hl.c * 29}" y="${y + 2}" width="${29}" height="${h - 4}" rx="5" class="f-fill2"/>`;
    Mx.forEach((row, i) => row.forEach((v, j) => { g += T(x + 18 + j * 30, y + 18 + i * 21, v, "middle", 13); }));
    return g;
  };
  const matFig = (s, x) => {
    const q = x === null ? "?" : nb(x);
    let g = "";
    if (s === 0) g = T(4, 40, "A ·", "start", 13) + mat(28, 14, [["3", "2"], ["4", "5"]], { r: 0 }) + T(108, 40, "B ·", "start", 13) + mat(132, 14, [["1", "4"], ["2", "−1"]], { c: 1 }) + T(208, 40, "=", "middle", 14) + mat(222, 14, [["…", q], ["…", "…"]]);
    if (s === 1) g = T(4, 40, "det", "start", 13) + mat(36, 14, [["3", "2"], ["4", "5"]]) + L(46, 22, 92, 52, "f-blue", 1.6) + L(92, 22, 46, 52, "f-accent", 1.6) + T(116, 40, "= " + q, "start", 14);
    if (s === 2) g = T(4, 40, "A⁻¹ = (1/7) ·", "start", 13) + mat(100, 14, [["5", "−2"], ["−4", "3"]]) + T(180, 40, "→ en haut à droite : " + q, "start", 12);
    if (s === 3) g = T(4, 22, "D", "start", 13) + mat(18, 6, [["3", "2"], ["4", "5"]]) + T(104, 22, "Dx", "start", 13) + mat(126, 6, [["12", "2"], ["23", "5"]], { c: 0 }) + T(4, 76, "x = Dx ÷ D = " + q, "start", 13);
    return svg(320, s === 3 ? 86 : 70, g, "calcul matriciel");
  };
  // translin : figures dans un repère (image d'un point, du carré unité, d'un triangle).
  const tlFig = (s, x) => {
    const o = { xr: [-7, 7], yr: [-7, 7], eq: true, H: 250, polys: [], pts: [], arrows: [], lab: "transformation linéaire du plan" };
    let t = "";
    if (s === 0) { o.arrows.push([0, 0, 4, 2, "f-line"]); o.pts.push([4, 2, "P", "f-dot", "r"]); if (x !== null) { o.pts.push([x, 4, "P' ?", "f-fill2", "r"]); o.arrows.push([0, 0, x, 4, "f-blue"]); } t = x === null ? "rotation de 90° autour de O" : x === -2 ? '<b class="act-ok">OP\' est bien OP tourné d\'un quart de tour</b>' : "OP' n'est pas OP tourné d'un quart de tour"; }
    if (s === 1) { o.polys.push([[[0, 0], [1, 0], [1, 1], [0, 1]], "f-soft"], [[[0, 0], [2, 1], [3, 4], [1, 3]], "f-fill2"]); o.xr = [-1, 5]; o.yr = [-1, 5]; t = "carré unité (gris) et son image (bleu) : (1 ; 0) ↦ (2 ; 1), (0 ; 1) ↦ (1 ; 3)" + (x === null ? "" : " ; aire proposée " + nb(x)); }
    if (s === 2) { o.pts.push([1, 2, "P", "f-dot", "r"], [1, -2, "f(P)", "f-dot", "r"]); if (x !== null) o.pts.push([3, x, "g(f(P)) ?", "f-fill2", "r"]); t = "f : symétrie d'axe Ox ; g : homothétie de rapport 3"; }
    if (s === 3) { o.xr = [-1, 13]; o.yr = [-5, 9]; o.H = 250; o.polys.push([[[0, 0], [2, 0], [0, 4]], "f-soft"], [[[0, 0], [2, 4], [12, -4]], "f-fill2"]); t = "triangle d'aire 4 (gris) et son image (bleu)" + (x === null ? "" : " ; aire proposée " + nb(x)); }
    return graph(o) + plain('<span class="small">' + t + "</span>");
  };

  Object.assign(ACTIVE, {
    matrices: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Produit \\(AB\\) : chaque coefficient est « ligne de \\(A\\) × colonne de \\(B\\) » ; en général \\(AB \\neq BA\\). Déterminant \\(\\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc\\). Si \\(\\det A \\neq 0\\), \\(A\\) est inversible et \\(A^{-1} = \\frac{1}{\\det A}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}\\). Système \\(A\\binom{x}{y} = \\binom{e}{f}\\) : \\(x = \\frac{D_x}{D}\\), \\(y = \\frac{D_y}{D}\\) (Cramer), où \\(D = \\det A\\) et \\(D_x\\) remplace la colonne des x par le second membre. \\(\\det(AB) = \\det A \\cdot \\det B\\) et, pour une matrice 2 × 2, \\(\\det(kA) = k^2 \\det A\\).", exemple: ["\\(\\det\\begin{pmatrix} 3 & 2 \\\\ 4 & 5 \\end{pmatrix} = 15 - 8 = 7\\), inverse \\(\\frac{1}{7}\\begin{pmatrix} 5 & -2 \\\\ -4 & 3 \\end{pmatrix}\\)", "\\(\\det A = 3\\), \\(\\det B = -4\\) : \\(\\det(AB) = -12\\) ; \\(\\det A = 5\\) : \\(\\det(3A) = 9 \\cdot 5 = 45\\)"], piege: "\\(\\det(3A) \\neq 3\\det A\\) : chacune des deux lignes est multipliée par 3, donc le déterminant par \\(3^2 = 9\\)." },
      /* 24.11 : det(AB) et det(kA) en défis courts */
      plus: [{ d: "\\(A\\) et \\(B\\) sont des matrices 2 × 2 avec \\(\\det A = 3\\) et \\(\\det B = -4\\). Que vaut \\(\\det(AB)\\) ?", ans: -12, ok: "Le déterminant d'un produit est le produit des déterminants : det(AB) = 3 · (−4) = −12.", no: "det(AB) = det A · det B." },
        { d: "\\(A\\) est une matrice 2 × 2 avec \\(\\det A = 5\\). Que vaut \\(\\det(3A)\\) ?", ans: 45, ok: "3A multiplie les deux lignes par 3 : det(3A) = 3 · 3 · det A = 9 · 5 = 45, et non 15.", no: "Dans 3A, chaque coefficient est multiplié par 3 : calcule 3a · 3d − 3b · 3c." }],
      predict: { q: "Pour multiplier deux matrices, on…", choices: ["combine une ligne de la première avec une colonne de la seconde", "multiplie les coefficients placés au même endroit"], good: 0,
        why: "Chaque coefficient du produit AB vient d'une ligne de A et d'une colonne de B : on multiplie terme à terme et on additionne. Ce n'est pas coefficient par coefficient." },
      defis: ["\\(A = \\begin{pmatrix} 3 & 2 \\\\ 4 & 5 \\end{pmatrix}\\) et \\(B = \\begin{pmatrix} 1 & 4 \\\\ 2 & -1 \\end{pmatrix}\\). Calcule le coefficient de AB en ligne 1, colonne 2.", "Calcule le déterminant de \\(A = \\begin{pmatrix} 3 & 2 \\\\ 4 & 5 \\end{pmatrix}\\).", "Que vaut le coefficient en haut à droite de l'inverse \\(A^{-1}\\) ?", "Résous \\(3x + 2y = 12\\) et \\(4x + 5y = 23\\) avec Cramer : que vaut x ?"],
      play: hunt({ ask: true, label: "Ta réponse", blank: (s) => matFig(s, null), show: (x, s) => matFig(s, x),
        miss: (x, s) => ["Ligne 1 de A : (3 ; 2). Colonne 2 de B : (4 ; −1). Multiplie terme à terme et additionne.", "det = ad − bc : diagonale bleue moins diagonale rouge.", "A⁻¹ = (1 / det A) · (d −b ; −c a), et det A = 7.", "D = det A = 7 ; Dx remplace la colonne des x par (12 ; 23)."][s],
        wins: [W(10, "3 · 4 + 2 · (−1) = 10. (BA donnerait 1 · 2 + 4 · 5 = 22 à cette place : AB ≠ BA.)"), W(7, "det A = 3 · 5 − 2 · 4 = 15 − 8 = 7 ≠ 0 : A est inversible."), W(-2 / 7, "A⁻¹ = (1/7) · (5 −2 ; −4 3) : en haut à droite, −2/7. On échange a et d, on change le signe de b et c, on divise par det A."), W(2, "Dx = 12 · 5 − 2 · 23 = 14, donc x = 14 ÷ 7 = 2 ; de même y = (3 · 23 − 12 · 4) ÷ 7 = 3.")] }),
    },
    translin: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "L'image de \\(P(x ; y)\\) par l'application de matrice \\(A\\) est \\(A\\binom{x}{y}\\). Les colonnes de \\(A\\) sont les images de \\((1 ; 0)\\) et \\((0 ; 1)\\). Rotation de 90° autour de O \\(\\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}\\), symétrie d'axe Ox \\(\\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}\\), homothétie de centre O et de rapport k \\(\\begin{pmatrix} k & 0 \\\\ 0 & k \\end{pmatrix}\\). Les aires sont multipliées par \\(|\\det A|\\). Appliquer \\(f\\) (matrice A) puis \\(g\\) (matrice B) : matrice \\(BA\\)." },
      predict: { q: "La matrice (2 0 ; 0 2) agit sur tous les points du plan. Elle…", choices: ["agrandit tout du double depuis O", "fait tourner de 90°", "ne change rien"], good: 0,
        why: "(x ; y) ↦ (2x ; 2y) : c'est l'homothétie de centre O et de rapport 2. Les aires sont multipliées par det = 4." },
      defis: ["Rotation de 90° autour de O, de matrice \\(\\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}\\). Abscisse de l'image de P(4 ; 2) ?", "Matrice \\(A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 3 \\end{pmatrix}\\). Aire de l'image du carré unité ?", "f = symétrie d'axe Ox, g = homothétie de centre O et de rapport 3. Ordonnée de l'image de P(1 ; 2) par g ∘ f (d'abord f) ?", "Matrice \\(\\begin{pmatrix} 1 & 3 \\\\ 2 & -1 \\end{pmatrix}\\). Un triangle d'aire 4 a pour image un triangle d'aire… ?"],
      play: hunt({ ask: true, label: "Ta réponse", blank: (s) => tlFig(s, null), show: (x, s) => tlFig(s, x),
        miss: (x, s) => ["Matrice × coordonnées : (0 · 4 − 1 · 2 ; 1 · 4 + 0 · 2).", "Les aires sont multipliées par |det A|.", "f(P) = (1 ; −2), puis g multiplie les coordonnées par 3.", "Facteur des aires : |det| = |1 · (−1) − 3 · 2|."][s],
        wins: [W(-2, "(x ; y) ↦ (−y ; x), donc (4 ; 2) ↦ (−2 ; 4). Les colonnes de la matrice sont les images de (1 ; 0) et (0 ; 1)."), W(5, "Le carré unité (aire 1) devient un parallélogramme d'aire |det A| = |2 · 3 − 1 · 1| = 5."), W(-6, "f : (1 ; 2) ↦ (1 ; −2), puis g : ↦ (3 ; −6). Matrice de g ∘ f : B · A = (3 0 ; 0 −3), dans cet ordre."), W(28, "det = 1 · (−1) − 3 · 2 = −7 : les aires sont multipliées par |−7| = 7, donc 4 · 7 = 28.")] }),
    },
  });

  // =====================================================================================================
  // 4e Collège · Probabilités
  // =====================================================================================================
  // Arbre du dépistage : p = proportion de malades.
  const tree = (p) => {
    const t = (x, y, s, a = "start") => T(x, y, s, a, 11);
    let g = L(14, 80, 112, 36) + L(14, 80, 112, 124) + L(140, 36, 232, 16) + L(140, 36, 232, 56) + L(140, 124, 232, 104) + L(140, 124, 232, 144);
    g += t(118, 40, "M") + t(118, 128, "non M") + t(238, 20, "+") + t(238, 60, "−") + t(238, 108, "+") + t(238, 148, "−");
    g += t(40, 50, nb(p)) + t(40, 118, nb(+(1 - p).toFixed(4))) + t(170, 20, "0,99") + t(170, 58, "0,01") + t(170, 108, "0,05") + t(170, 146, "0,95");
    g += t(256, 20, "→ " + nb(+(0.99 * p).toFixed(5)), "start") + t(256, 108, "→ " + nb(+(0.05 * (1 - p)).toFixed(5)), "start");
    return svg(320, 156, g, "arbre : malade ou non, puis test positif ou négatif");
  };
  // Diagramme en barres : B = [[valeur, probabilité, classe]] ; v = trait vertical (espérance).
  const bars = (B, xr, yr, extra = {}) => graph(Object.assign({ xr, yr, gy: 0.1, ly: 0.2, segs: B.map(([x, p, cls]) => [x, 0, x, p, cls || "f-blue", 12]), lab: "diagramme en barres d'une loi de probabilité" }, extra));
  const C5 = [1, 5, 10, 10, 5, 1], b5 = (k) => C5[k] * 0.3 ** k * 0.7 ** (5 - k);
  // Loi normale (μ = 170, σ = 8) : valeurs de la règle 68-95-99,7 aux bornes μ + kσ.
  const PHI = { "-3": 0.15, "-2": 2.5, "-1": 16, 0: 50, 1: 84, 2: 97.5, 3: 99.85 };
  /* densité de la loi normale centrée réduite (abscisse z = (x − μ) ÷ σ) */
  const dens = (z) => Math.exp(-(z * z) / 2) / Math.sqrt(2 * Math.PI);

  Object.assign(ACTIVE, {
    condbayes: {
      predict: { q: "Un test repère 99 % des malades, mais il est aussi positif chez 5 % des personnes saines. La maladie touche 1 personne sur 100. Ton test est positif : la probabilité d'être malade est environ…", choices: ["17 %", "99 %", "50 %"], good: 0,
        why: "Sur 10'000 personnes : 100 malades, dont 99 positifs ; 9'900 saines, dont 495 positives. 99 ÷ (99 + 495) ≈ 17 %. Il ne faut pas confondre P_M(+) = 99 % et P_+(M)." },
      defis: ["Même test. Règle la proportion p de malades (en %) : quelle est la plus petite valeur pour laquelle un test positif signifie « malade » plus d'une fois sur deux ?", "P(A) = 0,4 et P(A ∩ B) = 0,12. Règle P(B) pour que A et B soient indépendants."],
      play: slide({
        ctl: (s) => [s ? { k: "b", lab: "P(B)", min: 0.1, max: 0.9, step: 0.05 } : { k: "p", lab: "Proportion de malades (%)", min: 1, max: 20 }],
        init: (s) => (s ? { b: 0.5 } : { p: 1 }),
        fig: (st, s) => { if (!s) return tree(st.p / 100);
          const W = 300, H = 140, a = 0.4 * W, hb = st.b * H;
          let g = `<rect x="10" y="4" width="${W}" height="${H}" class="f-soft"/><rect x="10" y="${4 + H - hb}" width="${W}" height="${hb}" class="f-fill2" style="opacity:0.6"/><rect x="10" y="4" width="${a}" height="${H}" fill="none" stroke="var(--accent)" stroke-width="2.4"/>`;
          g += T(10 + a / 2, 18, "A (0,4)", "middle", 11) + T(10 + W - 6, 4 + H - hb + 14, "B", "end", 11);
          return svg(320, 150, g, "univers : A à gauche, B en bas"); },
        out: (st, s) => { if (s) return "P(A) · P(B) = 0,4 · " + nb(st.b) + " = <b>" + nb(+(0.4 * st.b).toFixed(4)) + "</b> ; P(A ∩ B) = 0,12";
          const p = st.p / 100, a = 0.99 * p, b = 0.05 * (1 - p); return "P(+) = " + nb(+a.toFixed(5)) + " + " + nb(+b.toFixed(5)) + " = " + nb(+(a + b).toFixed(5)) + "<br>P(M sachant +) = " + nb(+a.toFixed(5)) + " ÷ " + nb(+(a + b).toFixed(5)) + " ≈ <b>" + nb(+((100 * a) / (a + b)).toFixed(1)) + " %</b>"; },
        goal: [(st) => (st.p === 5 ? "p = 5 % : P(M sachant +) = 0,0495 ÷ (0,0495 + 0,0475) ≈ 51 %. Avec 4 %, on n'a que 45 % : quand la maladie est rare, beaucoup de tests positifs sont de faux positifs." : ""),
          (st) => (Math.abs(st.b - 0.3) < 1e-9 ? "P(B) = 0,3 : P(A) · P(B) = 0,4 · 0,3 = 0,12 = P(A ∩ B), donc A et B sont indépendants. Et P_A(B) = 0,12 ÷ 0,4 = 0,3 = P(B) : savoir A ne change rien." : "")],
        miss: (st, s) => { if (s) return 0.4 * st.b < 0.12 ? "P(A) · P(B) est trop petit : augmente P(B)." : "P(A) · P(B) est trop grand : diminue P(B).";
          const p = st.p / 100, q = (0.99 * p) / (0.99 * p + 0.05 * (1 - p)); return q < 0.5 ? "Moins de 50 % : augmente la proportion de malades." : "Plus de 50 %, mais ce n'est pas la plus petite proportion : recule."; },
        ask: [{ q: "Avec 1 % de malades, quelle est la probabilité (en %, à l'unité) d'être malade quand le test est positif ?", ans: 100 * 0.0099 / 0.0594, tol: 0.5, ok: "Bayes : P(M) · P_M(+) ÷ P(+) = 0,0099 ÷ (0,0099 + 0,0495) ≈ 0,167, soit 17 %.", no: "P(M ∩ +) = 0,01 · 0,99 ; P(+) = 0,01 · 0,99 + 0,99 · 0,05 ; divise le premier par le second." },
          { q: "Autre cas : P(A) = 0,4 et P(A ∩ B) = 0,1. Que vaut P_A(B) ?", ans: 0.25, ok: "P_A(B) = P(A ∩ B) ÷ P(A) = 0,1 ÷ 0,4 = 0,25.", no: "Définition : P_A(B) = P(A ∩ B) ÷ P(A)." }] }),
    },
    varalea: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Loi de \\(X\\) : valeurs \\(x_i\\) et probabilités \\(p_i\\) (somme 1). Espérance (moyenne à long terme) \\(E(X) = \\sum x_i p_i\\) ; un jeu est équitable si l'espérance du gain est nulle. Variance \\(V(X) = E(X^2) - E(X)^2\\), écart-type \\(\\sigma(X) = \\sqrt{V(X)}\\). Changement d'échelle : \\(E(aX + b) = aE(X) + b\\) et \\(V(aX + b) = a^2V(X)\\).", exemple: ["Deux piles → 6 CHF, un pile → 2 CHF : \\(E = 6 \\cdot 0{,}25 + 2 \\cdot 0{,}5 = 2{,}5\\) ; prix d'entrée équitable 2,50 CHF.", "\\(E(X) = 4\\) : \\(E(3X + 2) = 14\\) ; \\(V(X) = 5\\) : \\(V(3X + 2) = 9 \\cdot 5 = 45\\).", "\\(V(X) = 6{,}25\\) : \\(\\sigma(X) = 2{,}5\\)."], piege: "Le « + b » décale les valeurs sans les disperser : il change l'espérance, pas la variance." },
      /* 24.11 : écart-type, E(aX + b) et V(aX + b) en défis courts */
      plus: [{ d: "\\(E(X) = 4\\). Que vaut \\(E(3X + 2)\\) ?", ans: 14, ok: "E(aX + b) = a · E(X) + b = 3 · 4 + 2 = 14 : chaque valeur est multipliée par 3 puis augmentée de 2, la moyenne aussi.", no: "Multiplie l'espérance par 3, puis ajoute 2." },
        { d: "\\(V(X) = 5\\). Que vaut \\(V(3X + 2)\\) ?", ans: 45, ok: "V(aX + b) = a² · V(X) = 9 · 5 = 45 : le facteur compte au carré, le + 2 ne disperse pas.", no: "La variance est un carré d'écarts : le facteur 3 compte au carré, et le + 2 ne change rien." },
        { d: "\\(V(X) = 6{,}25\\). Que vaut l'écart-type \\(\\sigma(X)\\) ?", ans: 2.5, ok: "σ(X) = √V(X) = √6,25 = 2,5 : l'écart-type est dans l'unité des valeurs.", no: "L'écart-type est la racine carrée de la variance." }],
      predict: { q: "On lance un dé : sur un 6, tu gagnes 12 CHF, sinon rien. En moyenne, une partie rapporte…", choices: ["2 CHF", "6 CHF", "12 CHF"], good: 0,
        why: "12 · 1/6 + 0 · 5/6 = 2 CHF : l'espérance pondère chaque gain par sa probabilité." },
      defis: ["On paie un prix d'entrée, puis on lance deux pièces : deux piles → on reçoit 6 CHF, un seul pile → 2 CHF, aucun → rien. Règle le prix pour que le jeu soit équitable (espérance du gain net nulle).", "X prend les valeurs 1, 2 et 3 avec les probabilités 0,2 ; 0,45 et p. Règle p pour que ce soit une loi de probabilité."],
      play: slide({
        ctl: (s) => [s ? { k: "p", lab: "p = P(X = 3)", min: 0.05, max: 0.6, step: 0.05 } : { k: "c", lab: "Prix d'entrée (CHF)", min: 0, max: 5, step: 0.5 }],
        init: (s) => (s ? { p: 0.15 } : { c: 1 }),
        fig: (st, s) => { if (s) return bars([[1, 0.2], [2, 0.45], [3, st.p, "f-accent"]], [0, 4], [0, 0.7]);
          const c = st.c, e = 2.5 - c; return bars([[6 - c, 0.25], [2 - c, 0.5], [-c, 0.25]], [-6, 7], [0, 0.6], { vl: [[e, "f-accent"]] }) + plain('<span class="small">barres : gain net G ; trait rouge : E(G)</span>'); },
        out: (st, s) => { if (s) { const S = 0.65 + st.p; return "Somme des probabilités : 0,2 + 0,45 + " + nb(st.p) + " = <b>" + nb(+S.toFixed(4)) + "</b>"; }
          return "G = " + nb(6 - st.c) + ", " + nb(2 - st.c) + " ou " + nb(-st.c) + " avec les probabilités 1/4, 1/2, 1/4<br>E(G) = 2,5 − " + nb(st.c) + " = <b>" + nb(2.5 - st.c) + " CHF</b>"; },
        goal: [(st) => (st.c === 2.5 ? "Prix 2,5 CHF : E(G) = 3,5 · 1/4 + (−0,5) · 1/2 + (−2,5) · 1/4 = 0. Jeu équitable : en moyenne, on ne gagne ni ne perd." : ""),
          (st) => (Math.abs(st.p - 0.35) < 1e-9 ? "0,2 + 0,45 + 0,35 = 1. Alors E(X) = 1 · 0,2 + 2 · 0,45 + 3 · 0,35 = 2,15." : "")],
        miss: (st, s) => (s ? (0.65 + st.p < 1 ? "La somme n'atteint pas 1 : augmente p." : "La somme dépasse 1 : diminue p.") : 2.5 - st.c > 0 ? "E(G) > 0 : le joueur gagne en moyenne, augmente le prix." : "E(G) < 0 : le joueur perd en moyenne, baisse le prix."),
        ask: [{ q: "Une loterie : gains 10, 0 et −2 CHF avec les probabilités 0,1 ; 0,5 et 0,4. Espérance du gain (CHF) ?", ans: 0.2, ok: "E = 10 · 0,1 + 0 · 0,5 + (−2) · 0,4 = 1 − 0,8 = 0,2 CHF.", no: "Multiplie chaque gain par sa probabilité, puis additionne." },
          { q: "Avec cette loi, calcule V(X) = E(X²) − E(X)² (au centième).", ans: 0.5275, tol: 0.006, ok: "E(X²) = 0,2 + 1,8 + 3,15 = 5,15 ; V = 5,15 − 2,15² = 0,5275 ≈ 0,53 ; écart-type σ ≈ 0,73.", no: "E(X²) = 1² · 0,2 + 2² · 0,45 + 3² · 0,35 ; puis retire E(X)² = 2,15²." }] }),
    },
    binomiale: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Schéma de Bernoulli : \\(n\\) épreuves identiques et indépendantes, chacune un succès avec la probabilité \\(p\\). \\(X\\) = nombre de succès suit \\(B(n \\,;\\, p)\\) : \\(P(X = k) = \\binom{n}{k} p^k (1 - p)^{n - k}\\), où \\(\\binom{n}{k}\\) compte les chemins de l'arbre avec \\(k\\) succès. \\(E(X) = np\\)." },
      predict: { q: "On lance 3 fois une pièce. Combien de chemins de l'arbre donnent exactement 2 piles ?", choices: ["3", "2", "6"], good: 0,
        why: "PPF, PFP et FPP : 3 chemins, c'est le coefficient binomial (3 ; 2). Chacun a la probabilité 0,5³, donc P(X = 2) = 3 · 0,125 = 3/8." },
      defis: ["X suit la loi binomiale B(5 ; 0,3) : 5 épreuves, succès avec la probabilité 0,3. Sélectionne la valeur de k la plus probable.", "On lance un dé n fois. Règle n pour que P(au moins un 6) dépasse 50 %, avec n le plus petit possible."],
      play: slide({
        ctl: (s) => [s ? { k: "n", lab: "Nombre de lancers n", min: 1, max: 10 } : { k: "k", lab: "Nombre de succès k", min: 0, max: 5 }],
        init: (s) => (s ? { n: 1 } : { k: 4 }),
        fig: (st, s) => (s ? bars(Array.from({ length: 10 }, (_, i) => [i + 1, 1 - (5 / 6) ** (i + 1), i + 1 === st.n ? "f-accent" : "f-blue"]), [0, 11], [0, 1], { hl: [[0.5, "f-line"]], gy: 0.1, ly: 0.5 })
          : bars(C5.map((_, k) => [k, b5(k), k === st.k ? "f-accent" : "f-blue"]), [-0.8, 5.8], [0, 0.45])),
        out: (st, s) => (s ? "P(au moins un 6) = 1 − (5/6)^" + st.n + " ≈ <b>" + nb(+(1 - (5 / 6) ** st.n).toFixed(3)) + "</b>"
          : "P(X = " + st.k + ") = " + C5[st.k] + " · 0,3^" + st.k + " · 0,7^" + (5 - st.k) + " ≈ <b>" + nb(+b5(st.k).toFixed(3)) + "</b>"),
        goal: [(st) => (st.k === 1 ? "k = 1 : P(X = 1) = 5 · 0,3 · 0,7⁴ ≈ 0,360, la plus haute barre (k = 2 donne 0,309)." : ""),
          (st) => (st.n === 4 ? "n = 4 : 1 − (5/6)⁴ ≈ 0,518. Avec 3 lancers : 1 − (5/6)³ ≈ 0,421. « Au moins un » = 1 − « aucun »." : "")],
        miss: (st, s) => (s ? (1 - (5 / 6) ** st.n < 0.5 ? "Pas encore 50 % : augmente n." : "Plus de 50 %, mais il y a plus petit.") : "Ce n'est pas la plus haute barre."),
        ask: [{ q: "Toujours B(5 ; 0,3) : calcule P(X = 2) (au millième).", ans: b5(2), tol: 0.0006, ok: "10 chemins avec 2 succès : 10 · 0,3² · 0,7³ = 10 · 0,09 · 0,343 ≈ 0,309.", no: "N'oublie pas le coefficient : 10 chemins avec 2 succès, chacun de probabilité 0,3² · 0,7³." },
          { q: "12 passagers, chacun présent avec la probabilité 0,8, indépendamment. Espérance du nombre de présents ?", ans: 9.6, ok: "E(X) = n · p = 12 · 0,8 = 9,6 ; variance n · p · (1 − p) = 1,92.", no: "Pour une loi binomiale, E(X) = n · p." }] }),
    },
    normale: {
      /* Retiens limité à ce que présentent les défis (24.11, règle du 15.11) */
      retiens: { regle: "Si \\(X\\) suit une loi normale de moyenne \\(\\mu\\) et d'écart-type \\(\\sigma\\) : \\(P(\\mu - \\sigma \\le X \\le \\mu + \\sigma) \\approx 68\\,\\%\\), \\(P(\\mu - 2\\sigma \\le X \\le \\mu + 2\\sigma) \\approx 95\\,\\%\\), \\(P(\\mu - 3\\sigma \\le X \\le \\mu + 3\\sigma) \\approx 99{,}7\\,\\%\\). Par symétrie, chaque moitié d'intervalle vaut la moitié (34 %, 47,5 %, 49,85 %) et chaque « queue » la moitié du reste (16 %, 2,5 %, 0,15 %)." },
      predict: { q: "Tailles d'adultes : moyenne 170 cm, écart-type 8 cm, loi normale. Quelle proportion mesure entre 162 et 178 cm ?", choices: ["environ 68 %", "environ 50 %", "environ 95 %"], good: 0,
        why: "162 et 178 sont à un écart-type de la moyenne : environ 68 % des personnes (règle 68-95-99,7)." },
      defis: ["Même modèle (μ = 170 cm, σ = 8 cm). Règle l'intervalle [a ; b] centré sur la moyenne qui contient environ 95 % des personnes.", "Règle maintenant un intervalle [a ; b] qui contient environ 81,5 % des personnes."],
      play: slide({
        ctl: () => [{ k: "a", lab: "Borne a (cm)", min: 146, max: 194, step: 8 }, { k: "b", lab: "Borne b (cm)", min: 146, max: 194, step: 8 }],
        init: (s) => (s ? { a: 146, b: 194 } : { a: 162, b: 178 }),
        fig: (st) => { const za = (st.a - 170) / 8, zb = (st.b - 170) / 8;
          return graph({ xr: [-3.75, 3.75], yr: [-0.03, 0.43], gx: 1, lx: 1, gy: 0.1, ly: 1, fy: () => "", fx: (v) => nb(170 + 8 * v), fns: [{ f: dens }], polys: za < zb ? [[shade(dens, z0, za, zb), "f-fill2"]] : [], vl: [[0, "f-line"]], lab: "courbe en cloche, μ = 170, σ = 8" }) + plain('<span class="small">graduations : μ − 3σ = 146, …, μ + 3σ = 194</span>'); },
        out: (st) => (st.a >= st.b ? "Choisis a plus petit que b." : "P(" + st.a + " ≤ X ≤ " + st.b + ") ≈ <b>" + nb(PHI[(st.b - 170) / 8] - PHI[(st.a - 170) / 8]) + " %</b><br><span class=\"small\">a = μ " + ((st.a - 170) / 8 < 0 ? "− " + -(st.a - 170) / 8 : "+ " + (st.a - 170) / 8) + "σ ; b = μ " + ((st.b - 170) / 8 < 0 ? "− " + -(st.b - 170) / 8 : "+ " + (st.b - 170) / 8) + "σ</span>"),
        goal: [(st) => (st.a === 154 && st.b === 186 ? "[154 ; 186] = [μ − 2σ ; μ + 2σ] : environ 95 % des personnes." : ""),
          (st) => (st.a < st.b && PHI[(st.b - 170) / 8] - PHI[(st.a - 170) / 8] === 81.5 ? "[" + st.a + " ; " + st.b + "] : on coupe à la moyenne, " + (st.a === 162 ? "34 % + 47,5 %" : "47,5 % + 34 %") + " = 81,5 %." : "")],
        miss: (st, s) => (st.a >= st.b ? "" : s ? "On peut couper à la moyenne : 34 % d'un côté (1σ), 47,5 % de l'autre (2σ)." : (st.a + st.b) / 2 !== 170 ? "L'intervalle doit être centré sur 170." : "Centré, mais pas la bonne largeur : 95 % correspond à 2 écarts-types."),
        ask: [{ q: "Quel pourcentage de personnes mesure moins de 154 cm ?", ans: 2.5, ok: "Hors de [154 ; 186], il reste 5 %, partagé également : 2,5 % de chaque côté.", no: "Ce qui reste hors de l'intervalle à 95 % se partage en deux queues égales." },
          { q: "Sur 400 personnes, combien mesurent plus de 186 cm (environ) ?", ans: 10, ok: "P(X > 186) = 2,5 %, et 400 · 0,025 = 10 personnes.", no: "186 = μ + 2σ : au-dessus, il reste 2,5 %." }] }),
    },
  });
})();
