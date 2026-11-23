// Chantier 2e Collège (23.11) : leçons actives (devine / manipule ou calcule / retiens) pour cart, cercle, polydiv,
// polyfact, polyexpr, fracetage, eqrat, probrat, homog, homogrec, expo, expfrac, modexp, compo, decomp, bijection,
// recip, log, logbase, vecteurs. Même moteur que act_1c.js et act_mp2.js (outils recopiés : fichier autonome).
// Deux briques :
// - hunt (réponse tapée, o.ask) : avec o.blank → « Essaie sur la figure » (tous les défis), sans → « À toi » (2 questions) ;
// - slide (vraie manipulation) : un ou plusieurs curseurs qui déforment une courbe ou déplacent une figure ; l'objectif
//   n'est vérifié qu'AU LÂCHER (événement change), pour qu'on ne gagne pas en balayant ; une question « à toi » tapée,
//   sans la figure, peut suivre le geste (o.ask[étape]).
// Pas de TeX dans ce qui est redessiné (figures, messages) ; TeX seulement dans les consignes (rendues par setGoal).
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
  //   arrows: [[x1, y1, x2, y2, cls]], pts: [[x, y, étiquette, cls, position]], fy (format des graduations y), lab }
  let UID = 0;
  const graph = (o) => {
    const W = 320, m = 6, xr = o.xr, yr = o.yr, ux = (W - 2 * m) / (xr[1] - xr[0]);
    const H = o.H || (o.eq ? Math.round((yr[1] - yr[0]) * ux + 2 * m) : 230), uy = (H - 2 * m) / (yr[1] - yr[0]);
    const X = (v) => +(m + (v - xr[0]) * ux).toFixed(1), Y = (v) => +(H - m - (v - yr[0]) * uy).toFixed(1), id = "c2c" + ++UID;
    const gx = o.gx || 1, gy = o.gy || 1, lx = o.lx || gx * 2, ly = o.ly || gy * 2, fy = o.fy || nb;
    let g = "", c = "";
    for (let v = Math.ceil(xr[0] / gx) * gx; v <= xr[1] + 1e-9; v += gx) g += L(X(v), Y(yr[0]), X(v), Y(yr[1]), "f-grid", 0.7);
    for (let v = Math.ceil(yr[0] / gy) * gy; v <= yr[1] + 1e-9; v += gy) g += L(X(xr[0]), Y(v), X(xr[1]), Y(v), "f-grid", 0.7);
    const y0 = Math.min(Math.max(0, yr[0]), yr[1]), x0 = Math.min(Math.max(0, xr[0]), xr[1]);
    g += L(X(xr[0]), Y(y0), X(xr[1]), Y(y0), "f-line", 1.2) + L(X(x0), Y(yr[0]), X(x0), Y(yr[1]), "f-line", 1.2);
    for (let v = Math.ceil(xr[0] / lx) * lx; v <= xr[1] + 1e-9; v += lx) if (Math.abs(v) > 1e-9 && v < xr[1] - 1e-9) g += T(X(v), Math.min(Y(y0) + 13, H - 2), nb(+v.toFixed(6)), "middle", 10);
    for (let v = Math.ceil(yr[0] / ly) * ly; v <= yr[1] + 1e-9; v += ly) if (Math.abs(v) > 1e-9 && v < yr[1] - 1e-9) g += T(Math.max(X(x0) - 4, 24), Y(v) + 3.5, fy(+v.toFixed(6)), "end", 10);
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
    return svg(W, H, `<defs><clipPath id="${id}"><rect x="${m}" y="${m}" width="${W - 2 * m}" height="${H - 2 * m}"/></clipPath></defs>${g}<g clip-path="url(#${id})">${c}</g>${p}`, o.lab || "repère");
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

  // =====================================================================================================
  // 1. Équations cartésiennes
  // =====================================================================================================
  // cart : points dans un repère ; la réponse place le milieu proposé, ou reporte la longueur proposée sur [AB].
  const CART = [
    { A: [-1, 2], B: [7, 8], n: ["A", "B"], xr: [-2, 8], yr: [-1, 9] },
    { A: [-1, 2], B: [7, 8], n: ["A", "B"], xr: [-2, 8], yr: [-1, 9] },
    { A: [-3, -2], B: [9, 3], n: ["P", "Q"], xr: [-4, 10], yr: [-3, 4], H: 190 },
  ];
  const cartFig = (s, x) => {
    const D = CART[s], [A, B] = [D.A, D.B], o = { xr: D.xr, yr: D.yr, H: D.H, segs: [[A[0], A[1], B[0], B[1], "f-line", 2]], pts: [[A[0], A[1], D.n[0] + "(" + nb(A[0]) + " ; " + nb(A[1]) + ")", "f-dot", "b"], [B[0], B[1], D.n[1] + "(" + nb(B[0]) + " ; " + nb(B[1]) + ")", "f-dot", "l"]], lab: "segment dans un repère" };
    if (s >= 1) o.segs.push([A[0], A[1], B[0], A[1], "f-accent", 1.4, "5 4"], [B[0], A[1], B[0], B[1], "f-accent", 1.4, "5 4"]);
    let out = "";
    if (x !== null && s === 0) { o.pts.push([x, 5, "M ?", "f-fill2"]); out = plain("Milieu proposé (" + nb(x) + " ; 5) → " + (x === 3 ? '<b class="act-ok">juste au milieu</b>' : "pas au milieu : compare les deux moitiés")); }
    if (x !== null && s >= 1) { const L0 = Math.hypot(B[0] - A[0], B[1] - A[1]), t = x / L0, P = [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t];
      o.pts.push([P[0], P[1], "", "f-fill2"]); out = plain("Longueur " + nb(x) + " reportée depuis " + D.n[0] + " : " + (Math.abs(t - 1) < 1e-9 ? '<b class="act-ok">on arrive pile sur ' + D.n[1] + "</b>" : t < 1 ? "on s'arrête avant " + D.n[1] : "on dépasse " + D.n[1])); }
    return graph(o) + out;
  };

  // cercle : centre (a ; b) et rayon r au curseur.
  const sqT = (v, n) => (v === 0 ? n + "²" : "(" + n + (v > 0 ? " − " : " + ") + Math.abs(v) + ")²");
  const CERC = [{ a: 2, b: -1, r: 3 }, { a: -1, b: 2, r: 5 }, { a: 3, b: -2, r: 4 }];

  // polydiv : schéma de Horner (défi 2).
  const horner = (cs, a, x) => {
    const sums = [cs[0]]; for (let i = 1; i < cs.length; i++) sums.push(sums[i - 1] * a + cs[i]);
    const cw = 56, x0 = 48, rows = [24, 56, 92];
    let g = L(x0 - 6, 6, x0 - 6, 104, "f-line", 1.4) + L(x0 - 6, 74, x0 + cw * cs.length, 74, "f-line", 1.4) + T(x0 - 18, rows[1] + 4, nb(a), "middle", 14, "f-txt f-accent");
    const known = x === null ? 2 : x === sums[2] ? 4 : 2;
    cs.forEach((c, i) => {
      const cx = x0 + cw * i + cw / 2;
      g += T(cx, rows[0] + 4, nb(c), "middle", 14);
      if (i >= 1 && i <= known && i < cs.length) g += T(cx, rows[1] + 4, nb(sums[i - 1] * a), "middle", 13, "f-txt f-blue");
      if (i < known) g += T(cx, rows[2] + 4, nb(sums[i]), "middle", 14, "f-txt f-blue");
      else if (i === 2) g += T(cx, rows[2] + 4, x === null ? "?" : nb(x), "middle", 15, "f-txt f-accent");
      else if (i === 3 && known === 4) g += T(cx, rows[2] + 4, nb(sums[3]), "middle", 14, "f-txt f-blue");
    });
    if (known === 4) g += T(x0 + cw * 3.5, 120, "reste", "middle", 11);
    return svg(300, 126, g, "schéma de Horner");
  };

  // polyexpr : f(x) = a · produit des facteurs.
  const PEX = [
    { z: [-1, 1, 2], t: [0, 4], txt: "(x + 1)(x − 1)(x − 2)", a: 2 },
    { z: [-2, 1, 3], t: [0, -3], txt: "(x + 2)(x − 1)(x − 3)", a: -0.5 },
    { z: [1, 1, -2], t: [0, 1], txt: "(x − 1)²(x + 2)", a: 0.5 },
  ];
  const pexF = (s, a) => (x) => a * PEX[s].z.reduce((p, z) => p * (x - z), 1);

  Object.assign(ACTIVE, {
    cart: {
      predict: { q: "A(1 ; 2) et B(7 ; 10). Le milieu du segment [AB] est…", choices: ["(4 ; 6)", "(3 ; 4)", "(8 ; 12)"], good: 0,
        why: "On fait la moyenne des abscisses, (1 + 7) ÷ 2 = 4, et celle des ordonnées, (2 + 10) ÷ 2 = 6. (3 ; 4), c'est la moitié du déplacement de A vers B ; (8 ; 12), la somme des coordonnées." },
      defis: ["A(−1 ; 2) et B(7 ; 8) : quelle est l'abscisse du milieu M de [AB] ?", "Même segment : on avance de 8 et on monte de 6 (pointillés). Quelle est la longueur AB ?", "Un drone vole en ligne droite de P(−3 ; −2) à Q(9 ; 3) (1 unité = 100 m). Combien d'unités parcourt-il ?"],
      play: hunt({ ask: true, label: "Ta réponse", blank: (s) => cartFig(s, null), show: (x, s) => cartFig(s, x),
        miss: (x, s) => ["Moyenne des deux abscisses : (−1 + 7) ÷ 2.", "Pythagore dans le triangle en pointillés : √(8² + 6²).", "Avance de 12, monte de 5 : √(12² + 5²)."][s],
        wins: [W(3, "(−1 + 7) ÷ 2 = 3 ; et (2 + 8) ÷ 2 = 5 : M(3 ; 5)."), W(10, "AB = √(8² + 6²) = √100 = 10 : c'est Pythagore dans le repère."), W(13, "√(12² + 5²) = √169 = 13 unités, soit 1,3 km.")] }),
    },
    cercle: {
      predict: { q: "Le cercle d'équation (x − 2)² + (y + 1)² = 9 a pour centre et pour rayon…", choices: ["(2 ; −1) et 3", "(−2 ; 1) et 3", "(2 ; −1) et 9"], good: 0,
        why: "(x − a)² + (y − b)² = r² : on lit a = 2 et b = −1 (le signe change dans la parenthèse) ; le second membre vaut r², donc r = 3." },
      defis: ["Règle les curseurs pour tracer le cercle (x − 2)² + (y + 1)² = 9.", "Trace le cercle de centre (−1 ; 2) qui passe par le point P(2 ; 6).", "Trace le cercle x² − 6x + y² + 4y = 3 (complète les carrés)."],
      play: slide({
        ctl: () => [{ k: "a", lab: "Centre : abscisse a", min: -5, max: 5 }, { k: "b", lab: "Centre : ordonnée b", min: -5, max: 5 }, { k: "r", lab: "Rayon r", min: 1, max: 6 }],
        init: (s) => [{ a: 0, b: 0, r: 2 }, { a: 2, b: -1, r: 3 }, { a: 0, b: 1, r: 2 }][s],
        fig: (st, s) => graph({ xr: [-7, 7], yr: [-7, 8], eq: true, circles: [[st.a, st.b, st.r, "f-blue"]], segs: [[st.a, st.b, st.a + st.r, st.b, "f-accent", 1.6, "4 3"]],
          pts: [[st.a, st.b, "", "f-dot"]].concat(s === 1 ? [[2, 6, "P(2 ; 6)", "f-fill2", "l"]] : []), lab: "cercle dans un repère" }),
        out: (st) => "Équation : <b>" + sqT(st.a, "x") + " + " + sqT(st.b, "y") + " = " + st.r * st.r + "</b><br><span class=\"small\">centre (" + nb(st.a) + " ; " + nb(st.b) + "), rayon " + st.r + "</span>",
        goal: CERC.map((C, s) => (st) => (st.a === C.a && st.b === C.b && st.r === C.r ? ["Centre (2 ; −1) et rayon 3 : le 9 du second membre est r².", "La distance du centre à P vaut √(3² + 4²) = √25 = 5 : c'est le rayon.", "(x − 3)² − 9 + (y + 2)² − 4 = 3, donc (x − 3)² + (y + 2)² = 16 : centre (3 ; −2), rayon 4."][s] : "")),
        miss: (st, s) => (s === 1 && st.a === -1 && st.b === 2 ? "Le centre est bon. Le rayon est la distance du centre à P : avance de 3, monte de 4." : s === 0 && st.a === 2 && st.b === -1 && st.r === 9 ? "" : s === 2 && st.a === 3 && st.b === -2 ? "Le centre est bon. Le second membre devient 3 + 9 + 4." : ""),
        ask: [null, { q: "rayon du cercle de centre (0 ; 0) qui passe par (−5 ; 12) ?", ans: 13, ok: "√(25 + 144) = √169 = 13.", no: "Distance de (0 ; 0) à (−5 ; 12) : √(5² + 12²)." }, null] }),
    },
    polydiv: {
      predict: { q: "17 divisé par 5 donne 3, reste 2 : 17 = 3 · 5 + 2. On divise P(x) = x² + x + 4 par (x − 1). Le reste vaut…", choices: ["6", "4", "0"], good: 0,
        why: "x² + x + 4 = (x − 1)(x + 2) + 6 : le reste est 6. C'est aussi P(1) = 1 + 1 + 4 = 6 : pour diviser par (x − a), le reste vaut P(a)." },
      defis: ["Quel est le reste de la division de P(x) = x³ − 2x + 7 par (x + 2) ?", "Schéma de Horner : P(x) = 2x³ − 3x² − 4x + 7 divisé par (x − 2). On abaisse 2 ; 2 · 2 = 4 et −3 + 4 = 1 ; puis 1 · 2 = 2. Quel nombre va sous −4 ?", "Pour quelle valeur de k le polynôme x³ − 3x² + kx + 10 est-il divisible par (x − 2) ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        blank: (s) => [plain("Dans le « Devine », diviser par (x − 1) donnait le reste P(1)."), horner([2, -3, -4, 7], 2, null), plain("Divisible par (x − 2) : la division tombe juste, le reste vaut 0.")][s],
        show: (x, s) => [plain(tu(x)), horner([2, -3, -4, 7], 2, x), plain("Avec k = " + nb(x) + " : P(2) = 8 − 12 + 2 · " + (x < 0 ? "(" + nb(x) + ")" : nb(x)) + " + 10 = <b>" + nb(6 + 2 * x) + "</b>" + (6 + 2 * x === 0 ? ' <b class="act-ok">reste nul</b>' : ""))][s],
        miss: (x, s) => ["Diviser par (x + 2), c'est diviser par (x − (−2)) : calcule P(−2).", "On ajoute −4 et le produit 2 qu'on vient d'écrire au-dessus.", "Il faut P(2) = 0."][s],
        wins: [W(3, "P(−2) = −8 + 4 + 7 = 3. Attention au signe : (x + 2) = (x − (−2))."), W(-2, "−4 + 2 = −2 ; puis −2 · 2 = −4 et 7 − 4 = 3 : quotient 2x² + x − 2, reste 3 (= P(2))."), W(-3, "P(2) = 8 − 12 + 2k + 10 = 6 + 2k = 0, donc k = −3.")] }),
    },
    polyfact: {
      predict: { q: "P(x) = x³ − 2x² − 5x + 6. Lequel de ces nombres a une chance d'être une racine entière de P ?", choices: ["4", "3", "5"], good: 1,
        why: "Une racine entière divise le terme constant 6 : on ne teste que ±1, ±2, ±3, ±6. 4 et 5 ne divisent pas 6. Et en effet P(3) = 27 − 18 − 15 + 6 = 0." },
      defis: ["P(x) = x³ − 4x² + x + 6. Teste les diviseurs de 6 : quelle est la plus petite racine positive ?", "On divise par (x − 2) : le quotient est x² − 2x − 3. Quelle est la plus grande racine de P ?", "Résous x³ − 7x + 6 = 0 : quelle est la racine négative ?"],
      play: hunt({ ask: true, label: "Racine", show: (x, s) => plain(s === 2 ? "P(" + nb(x) + ") = " + nb(x ** 3 - 7 * x + 6) : s === 1 ? "x² − 2x − 3 en " + nb(x) + " : " + nb(x * x - 2 * x - 3) : "P(" + nb(x) + ") = " + nb(x ** 3 - 4 * x * x + x + 6)),
        miss: (x, s) => ["Calcule P(1), P(2), P(3)… jusqu'à trouver 0.", "Factorise x² − 2x − 3 : deux nombres de produit −3 et de somme −2.", "Racine évidente parmi les diviseurs de 6 (essaie 1), puis divise et factorise le quotient."][s],
        wins: [W(2, "P(1) = 4, mais P(2) = 8 − 16 + 2 + 6 = 0 : 2 est une racine évidente."), W(3, "x² − 2x − 3 = (x − 3)(x + 1) : P(x) = (x − 2)(x − 3)(x + 1), racines −1, 2 et 3."), W(-3, "P(1) = 0 ; quotient x² + x − 6 = (x − 2)(x + 3) : racines 1, 2 et −3.")] }),
    },
    polyexpr: {
      predict: { q: "Une fonction polynomiale de degré 3 s'annule en −1, en 1 et en 2. Son expression peut être…", choices: ["(x + 1)(x − 1)(x − 2)", "(x − 1)(x + 1)(x + 2)", "x³ − 2"], good: 0,
        why: "Chaque zéro z donne un facteur (x − z) : −1 donne (x + 1), 1 donne (x − 1) et 2 donne (x − 2). Il peut encore y avoir un nombre a devant : a(x + 1)(x − 1)(x − 2)." },
      defis: ["f(x) = a(x + 1)(x − 1)(x − 2). Règle a pour que la courbe passe par le point (0 ; 4).", "f(x) = a(x + 2)(x − 1)(x − 3). Règle a pour que la courbe passe par (0 ; −3).", "Zéro double en 1 : f(x) = a(x − 1)²(x + 2). Règle a pour que la courbe passe par (0 ; 1)."],
      play: slide({
        ctl: () => [{ k: "a", lab: "Coefficient a", min: -3, max: 3, step: 0.5 }],
        init: () => ({ a: 1 }),
        fig: (st, s) => graph({ xr: [-3, 4], yr: [-8, 8], gy: 2, fns: [{ f: pexF(s, st.a) }], pts: [[PEX[s].t[0], PEX[s].t[1], "(" + PEX[s].t.map(nb).join(" ; ") + ")", "f-dot", "r"]].concat([...new Set(PEX[s].z)].map((z) => [z, 0, "", "f-fill2"])), lab: "courbe d'une fonction de degré 3" }),
        out: (st, s) => "f(x) = " + nb(st.a) + " · " + PEX[s].txt + "<br>f(0) = <b>" + nb(pexF(s, st.a)(0)) + "</b> (on veut " + nb(PEX[s].t[1]) + ")",
        goal: PEX.map((P, s) => (st) => (st.a === P.a ? ["f(0) = a · 1 · (−1) · (−2) = 2a = 4, donc a = 2.", "f(0) = a · 2 · (−1) · (−3) = 6a = −3, donc a = −0,5 : la courbe descend à droite.", "f(0) = a · 1 · 2 = 2a = 1, donc a = 0,5. En 1, la courbe touche l'axe sans le traverser : zéro double."][s] : "")),
        miss: (st, s) => (pexF(s, st.a)(0) !== PEX[s].t[1] ? "Les zéros ne bougent pas : a étire la courbe. Calcule f(0) avec a, puis égale à " + nb(PEX[s].t[1]) + "." : ""),
        ask: [null, { q: "zéros −1, 2 et 4, et f(0) = −24. Que vaut a ?", ans: -3, ok: "f(0) = a · 1 · (−2) · (−4) = 8a = −24, donc a = −3.", no: "f(x) = a(x + 1)(x − 2)(x − 4) : calcule f(0) en fonction de a." }, null] }),
    },
  });
})();
