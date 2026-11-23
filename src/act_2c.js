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
    // o.pad : marge à gauche (px) pour les graduations quand l'axe des x commence à 0 (grands nombres).
    const W = 320, m = 6, ml = m + (o.pad || 0), xr = o.xr, yr = o.yr, ux = (W - m - ml) / (xr[1] - xr[0]);
    const H = o.H || (o.eq ? Math.round((yr[1] - yr[0]) * ux + 2 * m) : 230), uy = (H - 2 * m) / (yr[1] - yr[0]);
    const X = (v) => +(ml + (v - xr[0]) * ux).toFixed(1), Y = (v) => +(H - m - (v - yr[0]) * uy).toFixed(1), id = "c2c" + ++UID;
    const gx = o.gx || 1, gy = o.gy || 1, lx = o.lx || gx * 2, ly = o.ly || gy * 2, fy = o.fy || nb;
    let g = "", c = "";
    for (let v = Math.ceil(xr[0] / gx) * gx; v <= xr[1] + 1e-9; v += gx) g += L(X(v), Y(yr[0]), X(v), Y(yr[1]), "f-grid", 0.7);
    for (let v = Math.ceil(yr[0] / gy) * gy; v <= yr[1] + 1e-9; v += gy) g += L(X(xr[0]), Y(v), X(xr[1]), Y(v), "f-grid", 0.7);
    const y0 = Math.min(Math.max(0, yr[0]), yr[1]), x0 = Math.min(Math.max(0, xr[0]), xr[1]);
    g += L(X(xr[0]), Y(y0), X(xr[1]), Y(y0), "f-line", 1.2) + L(X(x0), Y(yr[0]), X(x0), Y(yr[1]), "f-line", 1.2);
    for (let v = Math.ceil(xr[0] / lx) * lx; v <= xr[1] + 1e-9; v += lx) if (Math.abs(v) > 1e-9 && v < xr[1] - 1e-9) g += T(X(v), Math.min(Y(y0) + 13, H - 2), nb(+v.toFixed(6)), "middle", 10);
    for (let v = Math.ceil(yr[0] / ly) * ly; v <= yr[1] + 1e-9; v += ly) if (Math.abs(v) > 1e-9 && v < yr[1] - 1e-9) g += T(Math.max(X(x0) - 4, o.pad ? ml - 3 : 24), Y(v) + 3.5, fy(+v.toFixed(6)), "end", 10);
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

  // =====================================================================================================
  // 4. Fonctions rationnelles
  // =====================================================================================================
  // homog : f(x) = (ax + 1)/(x + d) ; asymptotes en pointillés (l'horizontale seulement à partir du défi 2).
  const homT = (a, d) => "(" + (a === 0 ? "1" : (a === 1 ? "" : a === -1 ? "−" : nb(a)) + "x + 1") + ") ÷ (x " + (d < 0 ? "− " + -d : "+ " + d) + ")";
  // homogrec : f et f⁻¹ symétriques par rapport à la droite y = x.
  const HR = [
    { f: (x) => 3 / (x - 2), xr: [-3, 8], yr: [-3, 8] },
    { f: (x) => (2 * x + 1) / (x - 3), xr: [-6, 10], yr: [-6, 10] },
    { f: (x) => (4 * x - 1) / (x + 2), xr: [-10, 8], yr: [-8, 10] },
  ];
  const hrFig = (s, x) => {
    const D = HR[s], o = { xr: D.xr, yr: D.yr, eq: true, gx: s ? 2 : 1, lx: s ? 4 : 2, fns: [{ f: (t) => t, cls: "f-line", w: 1.2, dash: true }, { f: D.f }], pts: [], lab: "fonction homographique et droite y = x" };
    let out = "";
    if (x !== null && s === 0) { o.pts.push([x, D.f(x), "(" + nb(x) + " ; " + nb(+D.f(x).toFixed(3)) + ")", "f-fill2"]); out = plain("f(" + nb(x) + ") = 3 ÷ (" + nb(x) + " − 2) = <b>" + (x === 2 ? "impossible" : nb(+D.f(x).toFixed(4))) + "</b> (on veut 6)"); }
    if (x !== null && s === 1) { o.fns.push({ f: (t) => (3 * t + 1) / (t - x), cls: "f-accent", w: 2 }); out = plain("En rouge, (3x + 1) ÷ (x − " + nb(x) + ") : " + (x === 2 ? '<b class="act-ok">symétrique de f par rapport à y = x</b>' : "pas le symétrique de f")); }
    if (x !== null && s === 2) { o.fns.push({ f: (t) => (2 * t + 1) / (4 - t), cls: "f-accent", w: 2 }); o.hl = [[x, "f-accent"]]; out = plain("En rouge, f⁻¹ ; ta droite y = " + nb(x) + (x === -2 ? ' <b class="act-ok">est bien son asymptote</b>' : " n'est pas son asymptote")); }
    return graph(o) + out;
  };

  Object.assign(ACTIVE, {
    fracetage: {
      predict: { q: "Que vaut \\(\\dfrac{\;\\frac{1}{2}\;}{\;\\frac{1}{4}\;}\\) ?", choices: ["2", "1/8", "1/2"], good: 0,
        why: "Diviser par 1/4, c'est multiplier par 4 : 1/2 · 4 = 2. Il y a bien deux quarts dans une moitié." },
      defis: ["Calcule \\(\\dfrac{1 + \\frac{1}{3}}{1 - \\frac{1}{3}}\\).", "Pour \\(x = 4\\), calcule \\(\\dfrac{1 + \\frac{2}{x}}{1 - \\frac{2}{x}}\\).", "\\(\\dfrac{\;\\frac{6}{x}\;}{\;\\frac{2}{x^2}\;} = k \\cdot x\\). Que vaut \\(k\\) ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["étage du haut : 1 + 1/3 = 4/3 ; étage du bas : 1 − 1/3 = 2/3", "on multiplie haut et bas par x : (x + 2) ÷ (x − 2)", "6/x · x²/2 (on multiplie par l'inverse du bas)"][s] + " ; " + tu(x)),
        wins: [W(2, "(4/3) ÷ (2/3) = 4/3 · 3/2 = 2. Ou : on multiplie haut et bas par 3, (3 + 1) ÷ (3 − 1) = 2."), W(3, "(1 + 1/2) ÷ (1 − 1/2) = 1,5 ÷ 0,5 = 3 ; et (x + 2) ÷ (x − 2) = 6 ÷ 2 = 3."), W(3, "6/x · x²/2 = 6x²/(2x) = 3x, donc k = 3.")] }),
    },
    eqrat: {
      predict: { q: "Pour résoudre 6 ÷ (x − 1) = 2, que vaut-il mieux dire de x = 1 ?", choices: ["il est interdit", "c'est la solution", "c'est une solution parmi d'autres"], good: 0,
        why: "x = 1 annule le dénominateur : 6 ÷ 0 n'existe pas. On le note d'abord, puis on résout : 6 = 2(x − 1), x = 4, qui est permis." },
      defis: ["Résous \\(\\dfrac{12}{x + 2} = 3\\).", "Résous \\(\\dfrac{x + 3}{x - 1} = \\dfrac{5}{2}\\) (fraction acceptée).", "Résous \\(\\dfrac{x^2}{x - 3} = \\dfrac{9}{x - 3}\\)."],
      play: hunt({ ask: true, label: "x =", show: (x, s) => plain([x === -2 ? "x = −2 est interdit !" : "12 ÷ (" + nb(x) + " + 2) = " + nb(+(12 / (x + 2)).toFixed(4)) + " (on veut 3)",
        x === 1 ? "x = 1 est interdit !" : "(" + nb(x) + " + 3) ÷ (" + nb(x) + " − 1) = " + nb(+((x + 3) / (x - 1)).toFixed(4)) + " (on veut 2,5)",
        x === 3 ? "x = 3 annule le dénominateur : 9 ÷ 0 n'existe pas, cette valeur est interdite !" : "x² = " + nb(x * x) + " (on veut 9)"][s]),
        miss: (x, s) => ["Multiplie les deux membres par (x + 2) : 12 = 3(x + 2).", "Produit en croix : 2(x + 3) = 5(x − 1).", x === 3 ? "3 est interdit : cherche l'autre solution de x² = 9." : "Multiplie par (x − 3) : x² = 9."][s],
        wins: [W(2, "12 = 3x + 6, donc x = 2 (permis : seul −2 est interdit)."), W(11 / 3, "2x + 6 = 5x − 5, donc 3x = 11 et x = 11/3."), W(-3, "x² = 9 donne 3 ou −3 ; 3 est interdit : la seule solution est −3.")] }),
    },
    probrat: {
      predict: { q: "Un robinet remplit une citerne en 3 h, un autre en 6 h. Ouverts ensemble, ils la remplissent en…", choices: ["2 h", "4 h 30", "9 h"], good: 0,
        why: "En 1 h, le premier remplit 1/3 de la citerne, le second 1/6 : ensemble 1/3 + 1/6 = 1/2. Il faut donc 2 h. Ensemble, on va plus vite que le plus rapide !" },
      defis: ["Anna repeint une clôture en 4 h, Ben en 12 h. Ensemble, en combien d'heures ?", "Deux imprimantes impriment ensemble un lot en 6 min ; la première, seule, en 10 min. Combien de minutes met la seconde, seule ?", "Un cycliste parcourt 60 km. S'il roulait 5 km/h plus vite, il mettrait 1 h de moins. Quelle est sa vitesse (km/h) ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        show: (x, s) => plain([x > 0 ? "En 1 h : 1/4 + 1/12 de la clôture ; en " + nb(x) + " h ensemble, ils en feraient " + nb(+(x / 3).toFixed(3)) + " fois la clôture" : tu(x),
          x > 0 ? "1/10 + 1/" + nb(x) + " = " + nb(+(1 / 10 + 1 / x).toFixed(4)) + " du lot par minute (il faut 1/6 ≈ 0,1667)" : tu(x),
          x > 0 ? "à " + nb(x) + " km/h : " + nb(+(60 / x).toFixed(3)) + " h ; à " + nb(x + 5) + " km/h : " + nb(+(60 / (x + 5)).toFixed(3)) + " h ; écart " + nb(+(60 / x - 60 / (x + 5)).toFixed(3)) + " h" : tu(x)][s]),
        miss: (x, s) => ["En 1 h : 1/4 + 1/12 = 1/t.", "1/10 + 1/t = 1/6, donc 1/t = 1/6 − 1/10.", "60/v − 60/(v + 5) = 1 ; essaie des vitesses et regarde l'écart."][s],
        wins: [W(3, "1/4 + 1/12 = 3/12 + 1/12 = 4/12 = 1/3 de la clôture par heure : 3 h ensemble."), W(15, "1/t = 1/6 − 1/10 = 5/30 − 3/30 = 2/30 = 1/15 : 15 min."), W(15, "60/v − 60/(v + 5) = 1 donne v² + 5v − 300 = 0, soit (v − 15)(v + 20) = 0 : 15 km/h (4 h, contre 3 h à 20 km/h).")] }),
    },
    homog: {
      predict: { q: "f(x) = (2x + 1) ÷ (x − 3). Pour quelle valeur de x la fonction n'existe-t-elle pas ?", choices: ["3", "−3", "−1/2"], good: 0,
        why: "x = 3 annule le dénominateur. Près de 3, la courbe file vers le haut ou le bas : elle longe une droite verticale sans la toucher, l'asymptote verticale x = 3." },
      defis: ["f(x) = (ax + 1) ÷ (x + d). Règle d pour placer l'asymptote verticale en x = 3.", "Quand x devient très grand, la courbe longe une droite horizontale : l'asymptote horizontale. Règle a pour qu'elle soit y = −2.", "Règle a et d pour que la courbe passe par (0 ; 0,5) et ait pour asymptote horizontale y = 3."],
      play: slide({
        ctl: () => [{ k: "a", lab: "a (devant x en haut)", min: -4, max: 4 }, { k: "d", lab: "d (en bas)", min: -4, max: 4 }],
        init: (s) => [{ a: 1, d: 2 }, { a: 1, d: -3 }, { a: -2, d: -3 }][s],
        fig: (st, s) => graph({ xr: [-7, 7], yr: [-7, 7], eq: true, fns: [{ f: (x) => (st.a * x + 1) / (x + st.d) }], vl: [[-st.d, "f-accent"]], hl: s ? [[st.a, "f-accent"]] : [],
          pts: s === 2 ? [[0, 0.5, "(0 ; 0,5)", "f-dot", "r"]] : [], lab: "hyperbole et ses asymptotes" }),
        out: (st, s) => "f(x) = " + homT(st.a, st.d) + "<br>asymptote verticale <b>x = " + nb(-st.d) + "</b>" + (s ? " ; asymptote horizontale <b>y = " + nb(st.a) + "</b>" : "") + (st.a * st.d === 1 ? '<br><span class="small">Cas particulier : le haut et le bas se simplifient, la courbe devient une droite.</span>' : st.d === 0 ? "" : s === 2 ? '<br><span class="small">f(0) = 1 ÷ ' + nb(st.d) + " = " + nb(+(1 / st.d).toFixed(3)) + "</span>" : ""),
        goal: [(st) => (st.d === -3 && st.a * st.d !== 1 ? "d = −3 : le dénominateur x − 3 s'annule en 3, d'où l'asymptote x = 3." : ""),
          (st) => (st.a === -2 && st.d === -3 ? "Pour x très grand, (−2x + 1) ÷ (x − 3) ≈ −2x ÷ x = −2 : le rapport des nombres devant x." : ""),
          (st) => (st.a === 3 && st.d === 2 ? "f(0) = 1 ÷ d = 0,5 donne d = 2, et le rapport 3 ÷ 1 donne l'asymptote y = 3." : "")],
        miss: (st, s) => (s === 2 && st.a === 3 ? "L'asymptote est bonne. Pour f(0) = 0,5, il faut 1 ÷ d = 0,5." : s === 2 && st.d === 2 ? "f(0) est bon. L'asymptote horizontale dépend de a." : ""),
        ask: [null, { q: "f(x) = \\(\\dfrac{6x - 1}{2x + 4}\\). Asymptote horizontale : y = ?", ans: 3, ok: "6x ÷ 2x = 3 : asymptote y = 3 (les nombres −1 et 4 ne comptent pas).", no: "Pour x très grand, seuls les termes en x comptent : 6x ÷ 2x." }, null] }),
    },
    homogrec: {
      predict: { q: "f(x) = 3 ÷ (x − 2). On sait que f(5) = 1. Que vaut f⁻¹(1) ?", choices: ["5", "1", "1/5"], good: 0,
        why: "La réciproque défait ce que fait f : f envoie 5 sur 1, donc f⁻¹ renvoie 1 sur 5. Sur le graphe, (5 ; 1) devient (1 ; 5) : symétrie par rapport à la droite y = x." },
      defis: ["f(x) = 3 ÷ (x − 2). Calcule f⁻¹(6), c'est-à-dire le x tel que f(x) = 6.", "f(x) = (2x + 1) ÷ (x − 3). En isolant x dans y = f(x), on trouve f⁻¹(x) = (3x + 1) ÷ (x − c). Que vaut c ?", "f(x) = (4x − 1) ÷ (x + 2). L'asymptote horizontale de f⁻¹ est y = … ?"],
      play: hunt({ ask: true, label: "Ta réponse", blank: (s) => hrFig(s, null), show: (x, s) => hrFig(s, x),
        miss: (x, s) => ["3 ÷ (x − 2) = 6 donne x − 2 = 3 ÷ 6.", "y(x − 3) = 2x + 1, donc xy − 2x = 3y + 1 : mets x en évidence.", "Ce qui est vertical pour f devient horizontal pour f⁻¹ (symétrie par rapport à y = x)."][s],
        wins: [W(2.5, "x − 2 = 0,5, donc f⁻¹(6) = 2,5 ; le point (2,5 ; 6) de f devient (6 ; 2,5) sur f⁻¹."), W(2, "x(y − 2) = 3y + 1, donc x = (3y + 1) ÷ (y − 2) ; on échange les lettres, donc c = 2."), W(-2, "f a pour asymptote verticale x = −2 ; par symétrie, f⁻¹ a pour asymptote horizontale y = −2.")] }),
    },
  });

  // =====================================================================================================
  // 5. Exponentielles
  // =====================================================================================================
  const EXPT = [[2, 9], [-2, 4], [3, 8]];
  // modexp : trois modèles (intérêts, bactéries, radioactivité) ; le curseur fait avancer le temps.
  const MOD = [
    { f: (t) => 1000 * 1.05 ** t, max: 20, lab: "Années", seuil: 1500, xr: [0, 20], pad: 34, yr: [0, 2800], gx: 1, lx: 4, gy: 250, ly: 1000, t0: 3, ok: 9,
      txt: (t, v) => "Après " + t + " an" + (t > 1 ? "s" : "") + " : 1'000 · " + pw("1,05", t) + " ≈ <b>" + mil(v) + " CHF</b>" },
    { f: (t) => 1000 * 2 ** (t / 3), max: 21, lab: "Heures", seuil: 50000, xr: [0, 21], pad: 46, yr: [0, 130000], gx: 1, lx: 3, gy: 10000, ly: 20000, t0: 6, ok: 17,
      txt: (t, v) => "Après " + t + " h : 1'000 · 2^(" + t + "/3) ≈ <b>" + mil(v, 0) + " bactéries</b>" },
    { f: (t) => 80 * 0.5 ** (t / 8), max: 40, lab: "Jours", seuil: 10, xr: [0, 40], pad: 22, yr: [0, 85], gx: 2, lx: 8, gy: 5, ly: 20, t0: 4, ok: 24,
      txt: (t, v) => "Après " + t + " jour" + (t > 1 ? "s" : "") + " : 80 · 0,5^(" + t + "/8) ≈ <b>" + mil(v) + " g</b>" },
  ];
  // compo : machines enchaînées x → [1re] → [2e].
  const mach = (y, inp, A, B, mid, out) => {
    const box = (x0, nm, fx) => `<rect x="${x0}" y="${y}" width="84" height="38" rx="8" class="f-fill2"/>` + T(x0 + 42, y + 15, nm, "middle", 13, "f-txt f-blue") + T(x0 + 42, y + 32, fx, "middle", 14);
    const ar = (x1, x2) => L(x1, y + 19, x2 - 6, y + 19, "f-line", 1.4) + `<polygon points="${x2},${y + 19} ${x2 - 7},${y + 15} ${x2 - 7},${y + 23}" class="f-head"/>`;
    return T(14, y + 24, inp, "middle", 14) + ar(26, 46) + box(46, A[0], A[1]) + ar(130, 150) + T(166, y + 24, mid, "middle", 13, mid === "?" ? "f-txt" : "f-txt f-blue") + ar(182, 202) + box(202, B[0], B[1]) + ar(286, 300) + T(312, y + 24, out, "middle", 13, "f-txt f-accent");
  };
  const COMP = [
    { inp: 3, A: ["g", "x²"], B: ["f", "2x + 1"], mid: 9, out: 19 },
    { inp: 3, A: ["f", "2x + 1"], B: ["g", "x²"], mid: 7, out: 49 },
  ];
  const compoFig = (s, x) => {
    if (s < 2) { const C = COMP[s], good = x === C.out; return svg(330, 50, mach(6, C.inp, C.A, C.B, good ? C.mid : "?", x === null ? "?" : nb(x)), "deux machines enchaînées") + (x === null ? "" : plain(good ? '<b class="act-ok">La sortie est juste.</b>' : "Sortie proposée " + nb(x) + " : refais passer " + C.inp + " dans la 1re machine, puis le résultat dans la 2e.")); }
    const good = x === -52;
    return svg(330, 104, T(4, 10, "f ∘ g : g d'abord", "start", 11) + mach(14, "−2", ["g", "x² + 1"], ["f", "3x − 2"], good ? "5" : "?", good ? "13" : "?") + T(4, 66, "g ∘ f : f d'abord", "start", 11) + mach(70, "−2", ["f", "3x − 2"], ["g", "x² + 1"], good ? "−8" : "?", good ? "65" : "?"), "deux enchaînements de machines") + (x === null ? "" : plain(tu(x)));
  };

  Object.assign(ACTIVE, {
    expo: {
      predict: { q: "On plie une feuille de papier en deux, puis encore en deux… 10 fois de suite. Combien d'épaisseurs obtient-on ?", choices: ["20", "100", "1'024"], good: 2,
        why: "Chaque pliage multiplie le nombre d'épaisseurs par 2 : 2¹⁰ = 1'024. Multiplier par le même nombre à chaque étape, c'est une croissance exponentielle." },
      defis: ["Règle la base b pour que la courbe y = bˣ passe par le point (2 ; 9).", "Règle b pour que la courbe passe par (−2 ; 4). Que fait-elle quand x augmente ?", "Règle b pour que la courbe passe par (3 ; 8)."],
      play: slide({
        ctl: () => [{ k: "b", lab: "Base b", min: 0.25, max: 4, step: 0.25 }],
        init: () => ({ b: 1.5 }),
        fig: (st, s) => graph({ xr: [-3, 4], yr: [-1, 10], fns: [{ f: (x) => st.b ** x }], pts: [[EXPT[s][0], EXPT[s][1], "(" + EXPT[s].map(nb).join(" ; ") + ")", "f-dot", "r"], [EXPT[s][0], st.b ** EXPT[s][0], "", "f-fill2"]], lab: "courbe exponentielle" }),
        out: (st, s) => "y = " + nb(st.b) + "ˣ ; en x = " + nb(EXPT[s][0]) + " : " + pw(nb(st.b), EXPT[s][0]) + " = <b>" + nb(+(st.b ** EXPT[s][0]).toFixed(4)) + "</b> (on veut " + EXPT[s][1] + ")" + (st.b === 1 ? '<br><span class="small">Base 1 : 1ˣ = 1 pour tout x, la courbe est plate.</span>' : ""),
        goal: [(st) => (st.b === 3 ? "3² = 9 : la base 3 multiplie y par 3 chaque fois que x avance de 1." : ""),
          (st) => (st.b === 0.5 ? "0,5⁻² = 1 ÷ 0,5² = 1 ÷ 0,25 = 4. Base entre 0 et 1 : la courbe descend, c'est une décroissance." : ""),
          (st) => (st.b === 2 ? "2³ = 8. Toutes ces courbes passent par (0 ; 1), car b⁰ = 1." : "")],
        ask: [null, { q: "résous \\(2^x = \\dfrac{1}{8}\\).", ans: -3, ok: "1/8 = 1/2³ = 2⁻³, donc x = −3.", no: "Écris 1/8 comme une puissance de 2 (exposant négatif)." },
          { q: "résous \\(4^x = 8\\) (écris 4 et 8 comme puissances de 2).", ans: 1.5, ok: "4ˣ = 2²ˣ et 8 = 2³ : 2x = 3, donc x = 1,5.", no: "4ˣ = (2²)ˣ = 2²ˣ ; et 8 = 2³. Égale les exposants." }] }),
    },
    expfrac: {
      predict: { q: "Que vaut \\(9^{\\frac{1}{2}}\\) ?", choices: ["4,5", "3", "81"], good: 1,
        why: "9^(1/2) · 9^(1/2) = 9^(1/2 + 1/2) = 9¹ = 9 : c'est le nombre positif qui, multiplié par lui-même, donne 9, donc √9 = 3. L'exposant 1/2 ne divise pas par 2 !" },
      defis: ["Calcule \\(125^{\\frac{1}{3}}\\).", "Calcule \\(8^{\\frac{2}{3}}\\).", "Calcule \\(16^{-\\frac{3}{4}}\\) (fraction acceptée)."], garde: [1, 2], // la 1re reprend le « Devine »
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["125^(1/3) : le nombre dont le cube vaut 125", "8^(2/3) = (8^(1/3))² : racine cubique, puis carré", "16^(−3/4) = 1 ÷ 16^(3/4) ; 16^(1/4) = 2 (car 2⁴ = 16)"][s] + " ; " + tu(x)),
        wins: [W(5, "5³ = 125, donc 125^(1/3) = ∛125 = 5."), W(4, "∛8 = 2, puis 2² = 4."), W(1 / 8, "16^(1/4) = 2, 2³ = 8, et l'exposant négatif donne l'inverse : 1/8.")] }),
    },
    modexp: {
      predict: { q: "On place 1'000 CHF à 10 % d'intérêts composés. Après 2 ans, on a…", choices: ["1'200 CHF", "1'210 CHF", "1'100 CHF"], good: 1,
        why: "1re année : 1'000 · 1,1 = 1'100 CHF. 2e année, les intérêts portent aussi sur les 100 CHF déjà gagnés : 1'100 · 1,1 = 1'210 CHF. On multiplie par 1,1 chaque année : 1'000 · 1,1²." },
      defis: ["1'000 CHF placés à 5 % par an : fais avancer le temps. Après combien d'années le capital dépasse-t-il 1'500 CHF pour la première fois ?", "1'000 bactéries doublent toutes les 3 heures. Après combien d'heures (entières) dépassent-elles 50'000 pour la première fois ?", "80 g d'iode 131 : la masse est divisée par 2 tous les 8 jours (demi-vie). Après combien de jours en reste-t-il 10 g ?"],
      play: slide({
        ctl: (s) => [{ k: "t", lab: MOD[s].lab, min: 0, max: MOD[s].max }],
        init: (s) => ({ t: MOD[s].t0 }),
        fig: (st, s) => { const M = MOD[s]; return graph({ xr: M.xr, pad: M.pad, yr: M.yr, gx: M.gx, lx: M.lx, gy: M.gy, ly: M.ly, fy: (v) => mil(v, 0), fns: [{ f: M.f, from: 0 }], hl: [[M.seuil, "f-accent"]], segs: [[st.t, 0, st.t, M.f(st.t), "f-line", 1.2, "4 3"]], pts: [[st.t, M.f(st.t), "", "f-dot"]], lab: "croissance ou décroissance exponentielle" }); },
        out: (st, s) => MOD[s].txt(st.t, MOD[s].f(st.t)) + '<br><span class="small">ligne rouge : ' + mil(MOD[s].seuil, 0) + ["", " CHF", " bactéries", " g"][s + 1] + "</span>",
        goal: [(st) => (st.t === 9 ? "1,05⁸ ≈ 1,477 (1'477,46 CHF), mais 1,05⁹ ≈ 1,551 : 1'551,33 CHF après 9 ans." : ""),
          (st) => (st.t === 17 ? "Après 16 h : ≈ 40'317 ; après 17 h : ≈ 50'797. Le nombre double toutes les 3 h : 2^(t/3)." : ""),
          (st) => (st.t === 24 ? "80 → 40 → 20 → 10 : trois demi-vies, 3 · 8 = 24 jours." : "")],
        miss: (st, s) => { const M = MOD[s], v = M.f(st.t); return s === 2 ? (v > M.seuil ? "Il en reste encore trop : avance." : v < M.seuil ? "Trop tard : il en reste moins de 10 g, recule." : "") : v <= M.seuil ? "Pas encore au-dessus de la ligne rouge : avance." : st.t > M.ok ? "Ça dépasse, mais c'était déjà le cas plus tôt : recule." : ""; },
        ask: [null, { q: "300 bactéries qui doublent toutes les 4 h : combien après 12 h ?", ans: 2400, ok: "12 h = 3 doublements : 300 · 2³ = 2'400.", no: "Combien de doublements en 12 h ? Puis multiplie par 2 autant de fois." },
          { q: "même iode (80 g, demi-vie 8 jours) : combien de grammes après 16 jours ?", ans: 20, ok: "Deux demi-vies : 80 · 0,5² = 20 g.", no: "16 jours = deux demi-vies : on divise deux fois par 2." }] }),
    },
    compo: {
      predict: { q: "f(x) = x + 3 et g(x) = 2x. Pour calculer f(g(5)), on commence par…", choices: ["g, puis f", "f, puis g"], good: 0,
        why: "On calcule d'abord ce qui est à l'intérieur : g(5) = 10, puis f(10) = 13. On note f ∘ g (« f rond g ») : g agit en premier, même si on l'écrit en second." },
      defis: ["f(x) = 2x + 1 et g(x) = x². Calcule (f ∘ g)(3).", "Mêmes f et g : calcule (g ∘ f)(3).", "f(x) = 3x − 2 et g(x) = x² + 1. Calcule (f ∘ g)(−2) − (g ∘ f)(−2)."],
      play: hunt({ ask: true, label: "Ta réponse", blank: (s) => compoFig(s, null), show: (x, s) => compoFig(s, x),
        miss: (x, s) => ["(f ∘ g)(3) = f(g(3)) : g(3) = 9, puis f(9).", "(g ∘ f)(3) = g(f(3)) : f d'abord.", "Calcule séparément f(g(−2)) et g(f(−2)), puis la différence."][s],
        wins: [W(19, "g(3) = 9, puis f(9) = 2 · 9 + 1 = 19."), W(49, "f(3) = 7, puis g(7) = 49. Donc f ∘ g et g ∘ f ne donnent pas la même chose."), W(-52, "f(g(−2)) = f(5) = 13 et g(f(−2)) = g(−8) = 65 : 13 − 65 = −52.")] }),
    },
    decomp: {
      predict: { q: "h(x) = √(3x + 1). Pour calculer h(5), quelle opération fait-on en dernier ?", choices: ["la racine", "fois 3", "plus 1"], good: 0,
        why: "3 · 5 + 1 = 16, puis √16 = 4 : la racine vient en dernier. C'est la fonction « extérieure » f(x) = √x ; l'« intérieure » est g(x) = 3x + 1, et h = f ∘ g." },
      defis: ["h(x) = (2x − 5)³ = f(g(x)) avec f(x) = x³. Que vaut g(4) ?", "h(x) = 1 ÷ (x² + 4) = f(g(x)) avec g(x) = x² + 4. Que vaut f(8) ?", "h(x) = √(x² + 9) = f(g(x)). Calcule l'intérieur g(4), puis h(4) = f(g(4)). Que vaut h(4) ?"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["l'intérieur de (2x − 5)³ est g(x) = 2x − 5", "l'extérieur f prend l'inverse du nombre reçu", "g(x) = x² + 9 (intérieur), f(x) = √x (extérieur)"][s] + " ; " + tu(x)),
        wins: [W(3, "g(x) = 2x − 5, donc g(4) = 3 (et h(4) = 3³ = 27)."), W(1 / 8, "f(x) = 1 ÷ x, donc f(8) = 1/8 = 0,125."), W(5, "g(4) = 16 + 9 = 25, puis f(25) = √25 = 5.")] }),
    },
  });

  // =====================================================================================================
  // 6. Composition et réciproque · 7. Logarithmes · Géométrie vectorielle
  // =====================================================================================================
  // bijection : on règle le début m de l'ensemble de départ [m ; R].
  const BIJ = [
    { f: (x) => (x - 3) ** 2 + 1, h: 3, R: 7, min: -1, max: 6, m0: 0, xr: [-2, 8], yr: [-1, 18], gy: 1, ly: 4, up: true },
    { f: (x) => (x + 2) ** 2 - 4, h: -2, R: 3, min: -6, max: 2, m0: -5, xr: [-7, 4], yr: [-5, 22], gy: 1, ly: 4, up: true },
    { f: (x) => -((x - 1) ** 2) + 6, h: 1, R: 4, min: -3, max: 3.5, m0: -2, xr: [-4, 5], yr: [-11, 7], gy: 1, ly: 4, up: false },
  ];
  const bijPair = (B, m) => { const u = Math.max(m, 2 * B.h - B.R); return [u, 2 * B.h - u]; };
  // recip : f et sa réciproque, symétriques par rapport à y = x.
  const RC = [
    { f: (x) => 2 * x + 1, xr: [-2, 12], yr: [-2, 12], nm: "f(x) = 2x + 1" },
    { f: (x) => 3 * x - 4, xr: [-5, 8], yr: [-5, 8], nm: "f(x) = 3x − 4" },
    { f: (x) => x ** 3 + 1, xr: [-2, 10], yr: [-2, 10], nm: "f(x) = x³ + 1" },
  ];
  const rcFig = (s, x) => {
    const D = RC[s], o = { xr: D.xr, yr: D.yr, eq: true, lx: 2, fns: [{ f: (t) => t, cls: "f-line", w: 1.2, dash: true }, { f: D.f }], pts: [], lab: "graphe de f et droite y = x" };
    let out = plain('<span class="small">en bleu : ' + D.nm + " ; en pointillés : la droite y = x</span>");
    if (x !== null && s === 0) { o.pts.push([x, D.f(x), "(" + nb(x) + " ; " + nb(D.f(x)) + ")", "f-fill2"], [D.f(x), x, "", "f-dot"]); out = plain("f(" + nb(x) + ") = <b>" + nb(D.f(x)) + "</b> (on veut 11)"); }
    if (x !== null && s === 1) { o.fns.push({ f: (t) => (t + x) / 3, cls: "f-accent", w: 2 }); out = plain("En rouge, (x + " + nb(x) + ") ÷ 3 : " + (x === 4 ? '<b class="act-ok">symétrique de f par rapport à y = x</b>' : "pas le symétrique de f")); }
    if (x !== null && s === 2) { o.pts.push([x, 2, "(" + nb(x) + " ; 2)", "f-dot", "b"], [2, x, "", "f-fill2"]); out = plain("Le symétrique de (" + nb(x) + " ; 2) est (2 ; " + nb(x) + ") ; f(2) = 9 : " + (x === 9 ? '<b class="act-ok">il est sur le graphe de f</b>' : "il n'est pas sur le graphe de f")); }
    return graph(o) + out;
  };
  const LOGT = [[32, 5], [0.125, -3], [Math.SQRT2, 0.5]];
  const VA = [-2, -1], VB = [3, 3];
  const vT = (x, y) => "(" + nb(x) + " ; " + nb(y) + ")";

  Object.assign(ACTIVE, {
    bijection: {
      predict: { q: "f(x) = x². Combien de nombres ont pour image 9 ?", choices: ["deux", "un", "aucun"], good: 0,
        why: "3² = 9 et (−3)² = 9 : deux nombres différents ont la même image. La fonction carré n'est donc pas injective sur ℝ : une droite horizontale coupe sa courbe deux fois." },
      defis: ["f(x) = (x − 3)² + 1 sur [m ; 7]. Règle m pour que toute droite horizontale coupe la courbe au plus une fois, en gardant le plus de nombres possible.", "f(x) = (x + 2)² − 4 sur [m ; 3]. Même consigne.", "g(x) = −(x − 1)² + 6 sur [m ; 4] (parabole tournée vers le bas). Même consigne."],
      play: slide({
        ctl: (s) => [{ k: "m", lab: "Début m de l'ensemble de départ", min: BIJ[s].min, max: BIJ[s].max, step: 0.5 }],
        init: (s) => ({ m: BIJ[s].m0 }),
        fig: (st, s) => { const B = BIJ[s], o = { xr: B.xr, yr: B.yr, gy: B.gy, ly: B.ly, fns: [{ f: B.f, cls: "f-line", w: 1.2, dash: true }, { f: B.f, from: st.m, to: B.R }], pts: [[st.m, B.f(st.m), "", "f-fill2"], [B.R, B.f(B.R), "", "f-fill2"]], lab: "parabole restreinte à un intervalle" };
          if (st.m < B.h) { const [u, w] = bijPair(B, st.m); o.hl = [[B.f(u), "f-accent"]]; o.pts.push([u, B.f(u), "", "f-dot"], [w, B.f(w), "", "f-dot"]); }
          return graph(o); },
        out: (st, s) => { const B = BIJ[s], ys = [B.f(st.m), B.f(B.R)].concat(st.m <= B.h ? [B.f(B.h)] : []), lo = Math.min(...ys), hi = Math.max(...ys);
          let t = "Départ <b>[" + nb(st.m) + " ; " + B.R + "]</b> ; images de " + nb(lo) + " à " + nb(hi);
          if (st.m < B.h) { const [u, w] = bijPair(B, st.m); t += '<br><span style="color:var(--margin)">' + nb(u) + " et " + nb(w) + " ont la même image " + nb(B.f(u)) + "</span>"; }
          return t; },
        goal: BIJ.map((B, s) => (st) => (st.m === B.h ? ["m = 3, le sommet : une seule branche, chaque image a une seule préimage. f est une bijection de [3 ; 7] sur [1 ; 17].", "m = −2, l'abscisse du sommet : il ne reste que la branche qui monte.", "m = 1, le sommet : il ne reste que la branche qui descend, encore injective."][s] : "")),
        miss: (st, s) => (st.m > BIJ[s].h ? "Plus de double image, mais tu as enlevé des nombres pour rien : recule m jusqu'au sommet." : "La droite rouge coupe la courbe deux fois : deux nombres ont la même image."),
        ask: [null, { q: "f(x) = (x + 2)² − 4 est alors une bijection de [−2 ; 3] sur [k ; 21]. Que vaut k ?", ans: -4, ok: "k = f(−2) = −4 : l'image du sommet est la plus petite image.", no: "La plus petite image est celle du sommet : calcule f(−2)." },
          { q: "g est alors une bijection de [1 ; 4] sur [k ; 6]. Que vaut k ?", ans: -3, ok: "g(4) = −9 + 6 = −3 : la branche descend de 6 à −3.", no: "La branche descend : la plus petite image est g(4)." }] }),
    },
    recip: {
      predict: { q: "f(x) = 2x + 1 transforme 3 en 7. Que fait la réciproque f⁻¹ avec 7 ?", choices: ["elle le renvoie sur 3", "elle donne 15", "elle donne 1/7"], good: 0,
        why: "La réciproque défait ce que fait f : f⁻¹(7) = 3. (15 = f(7) ; 1/7 est l'inverse de 7, c'est autre chose.)" },
      defis: ["f(x) = 2x + 1. Calcule f⁻¹(11), c'est-à-dire le nombre x tel que f(x) = 11.", "f(x) = 3x − 4. On écrit y = 3x − 4, on isole x, puis on échange les lettres : f⁻¹(x) = (x + p) ÷ 3. Que vaut p ?", "f(x) = x³ + 1 passe par (2 ; 9). Le point du graphe de f⁻¹ d'ordonnée 2 a quelle abscisse ?"],
      play: hunt({ ask: true, label: "Ta réponse", blank: (s) => rcFig(s, null), show: (x, s) => rcFig(s, x),
        miss: (x, s) => ["Résous 2x + 1 = 11.", "y = 3x − 4 donne 3x = y + 4.", "La réciproque échange les coordonnées : (2 ; 9) devient (9 ; 2)."][s],
        wins: [W(5, "2x + 1 = 11 donne x = 5. Ainsi f⁻¹(11) = 5, et le point (5 ; 11) de f devient (11 ; 5) sur f⁻¹."), W(4, "x = (y + 4) ÷ 3 ; on échange les lettres, d'où f⁻¹(x) = (x + 4) ÷ 3. Vérification : f(2) = 2 et f⁻¹(2) = 2."), W(9, "(2 ; 9) sur f donne (9 ; 2) sur f⁻¹ : symétrie par rapport à la droite y = x.")] }),
    },
    log: {
      predict: { q: "log₂ 8 répond à la question…", choices: ["2 à quelle puissance donne 8 ?", "combien vaut 8 ÷ 2 ?", "8 à quelle puissance donne 2 ?"], good: 0,
        why: "log₂ 8 est l'exposant qu'il faut donner à 2 pour obtenir 8 : 2³ = 8, donc log₂ 8 = 3." },
      defis: ["Fais glisser le point sur la courbe y = 2ˣ jusqu'à la hauteur 32. Tu lis alors log₂ 32 sur l'axe des x.", "Même courbe : trouve log₂(1/8), c'est-à-dire la hauteur 0,125.", "Et log₂ √2 (hauteur ≈ 1,41) ?"],
      play: slide({
        ctl: () => [{ k: "x", lab: "Exposant x", min: -4, max: 6, step: 0.5 }],
        init: () => ({ x: 2 }),
        fig: (st, s) => graph({ xr: [-4, 6], yr: [-2, 34], gy: 2, ly: 8, fns: [{ f: (x) => 2 ** x }], hl: [[LOGT[s][0], "f-accent"]], segs: [[st.x, 0, st.x, 2 ** st.x, "f-line", 1.2, "4 3"], [0, 2 ** st.x, st.x, 2 ** st.x, "f-line", 1.2, "4 3"]], pts: [[st.x, 2 ** st.x, "", "f-dot"]], lab: "courbe y = 2 puissance x" }),
        out: (st, s) => pw("2", st.x) + " = <b>" + mil(2 ** st.x, 4) + "</b> (on veut " + ["32", "0,125", "√2 ≈ 1,4142"][s] + ")<br>donc log₂(" + mil(2 ** st.x, 4) + ") = " + nb(st.x),
        goal: LOGT.map(([v, e], s) => (st) => (st.x === e ? ["2⁵ = 32, donc log₂ 32 = 5.", "2⁻³ = 1/2³ = 1/8 = 0,125, donc log₂(1/8) = −3 : un logarithme peut être négatif.", "2^0,5 = √2, donc log₂ √2 = 1/2."][s] : "")),
        miss: (st, s) => (2 ** st.x < LOGT[s][0] ? "Pas assez haut : augmente l'exposant." : "Trop haut : diminue l'exposant."),
        ask: [null, { q: "calcule \\(\\log_3 81\\).", ans: 4, ok: "3⁴ = 81, donc log₃ 81 = 4.", no: "3 à quelle puissance donne 81 ?" },
          { q: "calcule \\(\\log 10\\,000 - \\log 0{,}1\\) (log sans base écrite : base 10).", ans: 5, ok: "log 10'000 = 4 et log 0,1 = −1 : 4 − (−1) = 5.", no: "10'000 = 10⁴ et 0,1 = 10⁻¹." }] }),
    },
    logbase: {
      predict: { q: "La calculatrice n'a pas de touche log₂. Pour calculer log₂ 10, on tape…", choices: ["log 10 ÷ log 2", "log 10 − log 2", "log(10 ÷ 2)"], good: 0,
        why: "Changement de base : log₂ 10 = log 10 ÷ log 2 ≈ 3,32. Vérification : 2^3,32 ≈ 10. (log 10 − log 2 = log 5, autre chose.)" },
      defis: ["Valeur exacte de \\(\\log_4 8\\) (écris 4 et 8 comme puissances de 2).", "Valeur exacte de \\(\\log_{27} 9\\) (fraction).", "5'000 bactéries triplent chaque heure. Après combien d'heures sont-elles 100'000 ? (au dixième)"],
      play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["4 = 2² et 8 = 2³ : log₄ 8 = ln 2³ ÷ ln 2²", "27 = 3³ et 9 = 3²", "5'000 · 3ᵗ = 100'000, donc 3ᵗ = 20 et t = ln 20 ÷ ln 3"][s] + " ; " + tu(x)),
        wins: [W(1.5, "ln 2³ ÷ ln 2² = 3 ln 2 ÷ (2 ln 2) = 3/2 : en effet 4^1,5 = 2³ = 8."), W(2 / 3, "ln 3² ÷ ln 3³ = 2/3 : en effet ∛27 = 3 et 3² = 9."), (x) => (Math.abs(x - 2.7) < 1e-9 || Math.abs(x - 2.73) < 1e-9 ? "3ᵗ = 20, t = ln 20 ÷ ln 3 ≈ 2,73 h, soit environ 2 h 44 min." : "")] }),
    },
    vecteurs: {
      predict: { q: "A(1 ; 2) et B(4 ; 6). Le vecteur AB a pour composantes…", choices: ["(3 ; 4)", "(5 ; 8)", "(−3 ; −4)"], good: 0,
        why: "Arrivée moins départ : 4 − 1 = 3 et 6 − 2 = 4. Le vecteur dit « avance de 3, monte de 4 ». (5 ; 8) est la somme des coordonnées ; (−3 ; −4) est le vecteur BA." },
      defis: ["Règle les composantes du vecteur \\(\\vec{u}\\) pour qu'il aille de A(−2 ; −1) à B(3 ; 3).", "Produit scalaire : \\(\\vec{u} \\cdot \\vec{v} = x x' + y y'\\). Règle \\(\\vec{u}\\) perpendiculaire à \\(\\vec{v} = (2 \\, ; 3)\\) (produit scalaire nul), de norme \\(\\sqrt{13}\\).", "\\(\\vec{a} = (1 \\, ; 3)\\) et \\(\\vec{b} = (4 \\, ; 1)\\). Règle \\(\\vec{u} = 2\\vec{a} - \\vec{b}\\)."],
      play: slide({
        ctl: () => [{ k: "x", lab: "1re composante (horizontale)", min: -6, max: 6 }, { k: "y", lab: "2e composante (verticale)", min: -6, max: 6 }],
        init: (s) => [{ x: 1, y: 2 }, { x: 2, y: 1 }, { x: 1, y: 1 }][s],
        fig: (st, s) => { const o = { xr: [-7, 7], yr: [-6, 7], eq: true, arrows: [], pts: [], lab: "vecteurs dans un repère" };
          if (s === 0) { o.arrows.push([VA[0], VA[1], VA[0] + st.x, VA[1] + st.y, "f-blue"]); o.pts.push([VA[0], VA[1], "A", "f-dot", "b"], [VB[0], VB[1], "B", "f-dot", "r"]); }
          if (s === 1) o.arrows.push([0, 0, 2, 3, "f-accent"], [0, 0, st.x, st.y, "f-blue"]);
          if (s === 2) o.arrows.push([0, 0, 1, 3, "f-accent"], [0, 0, 4, 1, "f-line"], [0, 0, st.x, st.y, "f-blue"]);
          return graph(o) + (s ? plain('<span class="small">' + (s === 1 ? "en rouge v = (2 ; 3)" : "en rouge a = (1 ; 3), en noir b = (4 ; 1)") + ", en bleu u</span>") : ""); },
        out: (st, s) => "u = <b>" + vT(st.x, st.y) + "</b>" + (s === 0 ? " ; extrémité " + vT(VA[0] + st.x, VA[1] + st.y) : "") + (s === 1 ? "<br>u · v = " + nb(st.x) + " · 2 + " + (st.y < 0 ? "(" + nb(st.y) + ")" : nb(st.y)) + " · 3 = <b>" + nb(2 * st.x + 3 * st.y) + "</b> ; norme √(" + nb(st.x) + "² + " + (st.y < 0 ? "(" + nb(st.y) + ")" : nb(st.y)) + "²) = √" + (st.x * st.x + st.y * st.y) : ""),
        goal: [(st) => (st.x === 5 && st.y === 4 ? "AB = (3 − (−2) ; 3 − (−1)) = (5 ; 4) : arrivée moins départ." : ""),
          (st) => (2 * st.x + 3 * st.y === 0 && st.x * st.x + st.y * st.y === 13 ? "u = " + vT(st.x, st.y) + " : 2 · " + (st.x < 0 ? "(" + nb(st.x) + ")" : nb(st.x)) + " + 3 · " + (st.y < 0 ? "(" + nb(st.y) + ")" : nb(st.y)) + " = 0 et √(9 + 4) = √13. On échange les composantes et on change un signe." : ""),
          (st) => (st.x === -2 && st.y === 5 ? "2a = (2 ; 6), puis 2a − b = (2 − 4 ; 6 − 1) = (−2 ; 5) : composante par composante." : "")],
        miss: (st, s) => (s === 1 && 2 * st.x + 3 * st.y === 0 ? "Perpendiculaire (produit scalaire nul), mais la norme n'est pas √13." : s === 1 && st.x * st.x + st.y * st.y === 13 ? "Bonne norme, mais le produit scalaire n'est pas nul." : ""),
        ask: [null, { q: "\\(\\vec{u} = (4 \\, ; -1)\\) et \\(\\vec{w} = (1 \\, ; k)\\) sont perpendiculaires. Que vaut k ?", ans: 4, ok: "4 · 1 + (−1) · k = 0, donc k = 4.", no: "Écris le produit scalaire 4 · 1 + (−1) · k et égale-le à 0." },
          { q: "norme du vecteur (−6 ; 8) ?", ans: 10, ok: "√(36 + 64) = √100 = 10.", no: "Norme : √(x² + y²)." }] }),
    },
  });
})();
