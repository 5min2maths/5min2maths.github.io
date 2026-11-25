// Leçons actives de la 3e et de la 4e Collège, 2e série (25.11, agent act34) : les 13 notions qui n'en avaient pas.
// 3e (src/ch3c_geo.js, géométrie vectorielle de l'espace) : vect3d, colin, droite3d, plans, posrel, pscal3d, distances,
// sphere ; vraies manipulations (curseurs) sur une figure en perspective (projection orthogonale : la sphère reste un
// cercle). 4e (src/ch4c_ana.js) : intparties, intsubst (« Essaie sur la figure » : l'aire se compare à la réponse
// tapée), etudelnexp, eqdiff, statdesc (curseurs). ineqpoly (2e) est dans act_2c.js (paquet 13).
// Même moteur que act_col34.js (briques graph, hunt et slide recopiées : fichier autonome). Chaque leçon a son propre
// « Retiens » (règle du 15.11 : seulement ce que les défis ont présenté). Paquet de chargement « 14 » (build.py).
(function () {
  // ---------- outils ----------
  const nb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");
  const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;
  const T = (x, y, s, a = "middle", sz = 12, cls = "f-txt") => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${a}" font-size="${sz}">${s}</text>`;
  const L = (x1, y1, x2, y2, cls = "f-line", w = 1.6, dash) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
  const plain = (html) => `<div class="act-out">${html}</div>`;
  const parseNum = (s) => Number(String(s).replace(/,/g, ".").replace(/−/g, "-").replace(/\s|'/g, "").replace(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/, (m, u, w) => String(u / w)));
  /* triplet (a ; b ; c) */
  const tri = (p) => "(" + p.map(nb).join(" ; ") + ")";
  /* racine : entier si carré parfait, sinon √n ≈ … */
  /* « = 3 » si carré parfait, sinon « ≈ 4,69 » (après √n) */
  const rq = (n) => { const r = Math.sqrt(n); return Math.abs(r - Math.round(r)) < 1e-9 ? " = " + nb(Math.round(r)) : " ≈ " + nb(+r.toFixed(2)); };
  const rt = (n) => { const r = Math.sqrt(n); return Math.abs(r - Math.round(r)) < 1e-9 ? nb(Math.round(r)) : "√" + nb(n) + " ≈ " + nb(+r.toFixed(2)); };
  /* signe devant un nombre dans une somme : « + 3 », « − 2 » */
  const sg = (v) => (v < 0 ? " − " + nb(-v) : " + " + nb(v));
  const par = (v) => (v < 0 ? "(" + nb(v) + ")" : nb(v));
  const add = (a, b) => a.map((v, i) => v + b[i]), mul = (k, a) => a.map((v) => k * v), dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

  // Repère 2D (copie de act_col34.js) : o = { xr, yr, H, gx, gy, lx, ly, fns, vl, hl, segs, pts, polys, fy, fx, pad, lab }
  let UID = 0;
  const graph = (o) => {
    const W = 320, m = 6, ml = m + (o.pad || 0), xr = o.xr, yr = o.yr, ux = (W - m - ml) / (xr[1] - xr[0]);
    const H = o.H || 230, uy = (H - 2 * m) / (yr[1] - yr[0]);
    const X = (v) => +(ml + (v - xr[0]) * ux).toFixed(1), Y = (v) => +(H - m - (v - yr[0]) * uy).toFixed(1), id = "c34b" + ++UID;
    const gx = o.gx || 1, gy = o.gy || 1, lx = o.lx || gx * 2, ly = o.ly || gy * 2, fy = o.fy || nb, fx = o.fx || nb;
    let g = "", c = "";
    for (let v = Math.ceil(xr[0] / gx) * gx; v <= xr[1] + 1e-9; v += gx) g += L(X(v), Y(yr[0]), X(v), Y(yr[1]), "f-grid", 0.7);
    for (let v = Math.ceil(yr[0] / gy) * gy; v <= yr[1] + 1e-9; v += gy) g += L(X(xr[0]), Y(v), X(xr[1]), Y(v), "f-grid", 0.7);
    const y0 = Math.min(Math.max(0, yr[0]), yr[1]), x0 = Math.min(Math.max(0, xr[0]), xr[1]);
    g += L(X(xr[0]), Y(y0), X(xr[1]), Y(y0), "f-line", 1.2) + L(X(x0), Y(yr[0]), X(x0), Y(yr[1]), "f-line", 1.2);
    let tk = "";
    for (let v = Math.ceil(xr[0] / lx) * lx; v <= xr[1] + 1e-9; v += lx) if (Math.abs(v) > 1e-9 && v < xr[1] - 1e-9) tk += T(X(v), Math.min(Y(y0) + 13, H - 2), fx(+v.toFixed(6)), "middle", 10, "f-txt f-tick");
    for (let v = Math.ceil(yr[0] / ly) * ly; v <= yr[1] + 1e-9; v += ly) if (Math.abs(v) > 1e-9 && v < yr[1] - 1e-9) tk += T(Math.max(X(x0) - 4, o.pad ? ml - 3 : 24), Y(v) + 3.5, fy(+v.toFixed(6)), "end", 10, "f-txt f-tick");
    for (const [P, cls, op] of o.polys || []) c += `<polygon points="${P.map(([x, y]) => X(x) + "," + Y(Math.max(yr[0], Math.min(yr[1], y)))).join(" ")}" class="${cls || "f-fill2"}" style="stroke:none;opacity:${op || 0.7}"/>`;
    const span = yr[1] - yr[0];
    for (const F of o.fns || []) {
      const a = Math.max(xr[0], F.from ?? -Infinity), b = Math.min(xr[1], F.to ?? Infinity), N = 300; let d = "", prev = null;
      for (let i = 0; i <= N; i++) { const x = a + ((b - a) * i) / N, y = F.f(x);
        if (!isFinite(y) || y < yr[0] - span || y > yr[1] + span || (prev !== null && Math.abs(y - prev) > span)) { prev = null; continue; }
        d += (prev === null ? "M" : "L") + X(x) + "," + Y(y) + " "; prev = y; }
      if (d) c += `<path d="${d}" class="${F.cls || "f-blue"}" fill="none" stroke-width="${F.w || 2.4}"${F.dash ? ' stroke-dasharray="5 4"' : ""}/>`;
    }
    for (const [x, cls] of o.vl || []) c += L(X(x), Y(yr[0]), X(x), Y(yr[1]), cls || "f-accent", 1.6, "6 4");
    for (const [y, cls] of o.hl || []) c += L(X(xr[0]), Y(y), X(xr[1]), Y(y), cls || "f-accent", 1.6, "6 4");
    for (const [x1, y1, x2, y2, cls, w, dash] of o.segs || []) c += L(X(x1), Y(y1), X(x2), Y(y2), cls || "f-line", w || 1.6, dash);
    let p = "";
    for (const [x, y, lab, cls, pos] of o.pts || []) {
      if (x < xr[0] || x > xr[1] || y < yr[0] || y > yr[1]) continue;
      p += `<circle cx="${X(x)}" cy="${Y(y)}" r="5" class="${cls || "f-dot"}"/>`;
      if (lab) { const left = pos === "l" || (pos !== "r" && X(x) > W - 90); p += T(X(x) + (left ? -8 : 8), Y(y) + (pos === "b" ? 16 : -7), lab, left ? "end" : "start", 12); }
    }
    for (const [x, y, t, a] of o.txt || []) p += T(X(x), Y(y), t, a || "middle", 11);
    return svg(W, H, `<defs><clipPath id="${id}"><rect x="${ml}" y="${m}" width="${W - m - ml}" height="${H - 2 * m}"/></clipPath></defs>${g}<g clip-path="url(#${id})">${c}</g>${tk}${p}`, o.lab || "repère");
  };

  // ---------- brique « hunt » (réponse tapée ; avec une figure : « Essaie sur la figure ») ----------
  const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });
  const hunt0 = (o) => (box, onWin) => {
    let x = null, step = 0;
    const draw = () => {
      const s = Math.min(step, o.wins.length - 1), fig = x === null ? (o.blank ? o.blank(s) : "") : o.show(x, s);
      box.innerHTML = fig + actAnswerHtml(o.label || "Ta réponse") + (o.note ? `<div class="small muted">${o.note}</div>` : "");
      const inp = box.querySelector(".act-in"); if (x !== null) inp.value = nb(x).replace("−", "-");
      const go = () => { const v = parseNum(inp.value); if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre (fraction acceptée, par exemple 3/2)."); return; }
        x = v; draw(); if (!check()) { const mm = typeof o.miss === "function" ? o.miss(x, s) : o.miss; $hint(box, mm || "Pas encore : regarde la figure, puis recalcule."); } };
      actAnswerBind(box, go);
    };
    const check = () => { if (step >= o.wins.length) return false; const mm = o.wins[step](x); if (mm) { onWin(step, mm); step++; x = null; draw(); return true; } return false; };
    draw();
  };
  const W = (target, msg, tol = 1e-9) => (x) => (Math.abs(x - target) <= tol ? msg : "");

  // ---------- brique « slide » (curseurs ; copie de act_col34.js) ----------
  // o = { ctl(step) → [{ k, lab, min, max, step }], init(step) → état, fig(st, step), out(st, step), goal[step](st) → message ou "",
  //       miss(st, step) → indice, ask[step] : { q, ans, tol, ok, no }, fmt(k, v, step), note }
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

  // ---------- figure de l'espace ----------
  // Projection orthogonale (azimut 30°, élévation 20°) : x vers l'avant à gauche, y vers la droite, z vers le haut ;
  // une sphère reste un cercle. scene(box) cadre la boîte [[x0, x1], [y0, y1], [z0, z1]] (fixe pendant le geste, pour
  // que la figure ne saute pas) dans 320 px de large ; les méthodes ajoutent des éléments en coordonnées de l'espace.
  const CA = Math.cos(Math.PI / 6), SA = Math.sin(Math.PI / 6), CB = Math.cos(Math.PI / 9), SB = Math.sin(Math.PI / 9);
  const raw = (q) => [q[1] * CA - q[0] * SA, -(q[2] * CB - (q[0] * CA + q[1] * SA) * SB)];
  const scene = (box, opt = {}) => {
    const W = 320, m = 16; let a = Infinity, b = -Infinity, c = Infinity, d = -Infinity;
    for (const x of box[0]) for (const y of box[1]) for (const z of box[2]) { const [u, v] = raw([x, y, z]); a = Math.min(a, u); b = Math.max(b, u); c = Math.min(c, v); d = Math.max(d, v); }
    const s = Math.min(opt.s || 60, (W - 2 * m) / (b - a), ((opt.H || 290) - 2 * m) / (d - c)), H = Math.round((d - c) * s + 2 * m), ox = (W - (b - a) * s) / 2 - a * s, oy = m - c * s;
    const p = (q) => { const [u, v] = raw(q); return [+(ox + u * s).toFixed(1), +(oy + v * s).toFixed(1)]; };
    let back = "", g = "", top = "";
    const S = {
      p, s,
      line(A, B, cls = "f-line", w = 1.6, dash) { const u = p(A), v = p(B); g += L(u[0], u[1], v[0], v[1], cls, w, dash); return S; },
      path(Ps, cls = "f-line", w = 1.6, dash, close) { g += `<path d="${Ps.map((q, i) => (i ? "L" : "M") + p(q).join(",")).join(" ")}${close ? " Z" : ""}" class="${cls}" fill="none" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`; return S; },
      poly(Ps, cls = "f-soft", op = 0.5) { back += `<polygon points="${Ps.map((q) => p(q).join(",")).join(" ")}" class="${cls}" style="stroke:none;opacity:${op}"/>`; return S; },
      arrow(A, B, cls = "f-blue", w = 2.6) {
        const u = p(A), v = p(B), dx = v[0] - u[0], dy = v[1] - u[1], n = Math.hypot(dx, dy); if (n < 1) return S;
        const ex = dx / n, ey = dy / n, k = Math.min(11, n * 0.45), e = [v[0] - ex * k, v[1] - ey * k];
        g += L(u[0], u[1], e[0].toFixed(1), e[1].toFixed(1), cls, w) + `<polygon points="${v[0]},${v[1]} ${(e[0] - ey * 5).toFixed(1)},${(e[1] + ex * 5).toFixed(1)} ${(e[0] + ey * 5).toFixed(1)},${(e[1] - ex * 5).toFixed(1)}" class="${cls === "f-accent" ? "f-headacc" : "f-head"}" style="${cls === "f-blue" ? "fill:var(--blue)" : ""}"/>`;
        return S; },
      dot(A, lab, cls = "f-dot", pos = "r", r = 4.5) {
        const u = p(A); top += `<circle cx="${u[0]}" cy="${u[1]}" r="${r}" class="${cls}"/>`;
        if (lab) top += T(u[0] + (pos === "l" ? -8 : 8), u[1] + (pos === "b" ? 16 : -7), lab, pos === "l" ? "end" : "start", 12);
        return S; },
      text(A, t, a = "middle", sz = 11) { const u = p(A); top += T(u[0], u[1], t, a, sz); return S; },
      raw(svgPart) { g += svgPart; return S; },
      /* traits de rappel d'un point : jusqu'au plan xOy, puis vers les axes x et y */
      guides(A) { const [x, y, z] = A; if (z) S.line([x, y, 0], A, "f-line", 1, "3 3"); if (x || y) S.line([x, 0, 0], [x, y, 0], "f-line", 1, "3 3").line([0, y, 0], [x, y, 0], "f-line", 1, "3 3"); return S; },
      svg(lab) { return svg(W, H, back + g + top, lab); },
    };
    if (opt.axes !== false) {
      const N = ["x", "y", "z"];
      for (let i = 0; i < 3; i++) {
        const lo = Math.min(0, box[i][0]), hi = Math.max(0, box[i][1]), A = [0, 0, 0], B = [0, 0, 0]; A[i] = lo; B[i] = hi;
        S.line(A, B, "f-line", 1.1); const E = [0, 0, 0]; E[i] = hi; const u = p(E); top += T(u[0] + (i === 0 ? -6 : i === 1 ? 8 : 0), u[1] + (i === 2 ? -4 : i === 0 ? 12 : 4), N[i], "middle", 12);
        if (opt.ticks !== false) for (let k = Math.ceil(lo); k <= hi - 0.5; k++) { if (!k) continue; const Q = [0, 0, 0]; Q[i] = k; const q = p(Q);
          back += `<circle cx="${q[0]}" cy="${q[1]}" r="1.6" class="f-dot" style="opacity:0.55"/>`;
          if (opt.ticks === "all" || k === 1) top += T(q[0] + (i === 2 ? -6 : 0), q[1] + (i === 2 ? 3 : 12), nb(k), i === 2 ? "end" : "middle", 9, "f-txt f-tick"); }
      }
    }
    return S;
  };
  /* morceau de droite A + t·u gardé dans la boîte (t dans [t0 ; t1]) */
  const clip = (A, u, box, t0 = -50, t1 = 50) => {
    for (let i = 0; i < 3; i++) {
      if (Math.abs(u[i]) < 1e-12) { if (A[i] < box[i][0] || A[i] > box[i][1]) return null; continue; }
      const a = (box[i][0] - A[i]) / u[i], b = (box[i][1] - A[i]) / u[i]; t0 = Math.max(t0, Math.min(a, b)); t1 = Math.min(t1, Math.max(a, b));
    }
    return t0 < t1 ? [add(A, mul(t0, u)), add(A, mul(t1, u))] : null;
  };
  const inBox = (P, box) => P.every((v, i) => v >= box[i][0] - 1e-9 && v <= box[i][1] + 1e-9);

  // =====================================================================================================
  // 3e Collège · Géométrie vectorielle de l'espace (ch3c_geo.js)
  // =====================================================================================================
  const BV = [[0, 4], [-1, 5], [-2, 3]], A1 = [1, 2, 0];
  const BC = [[0, 5], [-1, 3], [-1, 4]], CA1 = [1, 0, 2], CB1 = [3, 1, 1];
  const BW = [[-2, 2], [-4, 4], [-3, 4]], U1 = [1, 0, 1], V1 = [0, 2, 1], W1 = [2, -2, 1];
  const BD = [[-1, 6], [-3, 1], [-1, 5]], DA = [1, 0, 4], DU = [2, -1, -2], DB = [-1, -3, 2], DV = [2, 1, 0];
  const BP = [[0, 8], [0, 4], [0, 4]], BP2 = [[0, 4.5], [0, 4.5], [0, 4.5]];
  const BR = [[-1, 5], [-1, 5], [-1, 5]];
  const BS1 = [[0, 2.2], [0, 2.2], [-3, 3]], BS2 = [[0, 1.5], [0, 1.5], [-3, 3]];
  const BDP = [[-2, 4], [-3, 3], [-2, 3]], H0 = [1, 0, 0], E1 = [1, 0, -1], E2 = [1, -2, 0], PD = [3, 1, 2];
  const BDL = [[-1, 5], [-1, 4], [0, 2]], LA = [1, 0, 0], LU = [1, 1, 0], LP = [5, 0, 1];
  const BSP = [[-5.5, 5.5], [-5.5, 5.5], [-6, 6]];
  /* trace d'un plan ax + by + cz = d (a, b, c, d > 0) : triangle de ses points sur les axes */
  const traces = (S, a, b, c, d, cls = "f-fill2") => { const P = [[d / a, 0, 0], [0, d / b, 0], [0, 0, d / c]]; S.poly(P, cls, 0.45).path(P, "f-line", 1.4, null, true); return P; };
  /* arc de l'angle entre deux vecteurs issus de O */
  const arc = (S, u, v, r) => { const nu = Math.hypot(...u), nv = Math.hypot(...v), a = mul(1 / nu, u), b = mul(1 / nv, v), al = Math.acos(Math.max(-1, Math.min(1, dot(a, b)))); if (al < 1e-6) return;
    const P = []; for (let i = 0; i <= 24; i++) { const t = (al * i) / 24, w = add(mul(Math.sin(al - t) / Math.sin(al), a), mul(Math.sin(t) / Math.sin(al), b)); P.push(mul(r, w)); }
    if (Math.abs(al - Math.PI) < 1e-6) return; S.path(P, "f-accent", 1.6); };
  const ang = (u, v) => (Math.acos(Math.max(-1, Math.min(1, dot(u, v) / (Math.hypot(...u) * Math.hypot(...v))))) * 180) / Math.PI;

  Object.assign(ACTIVE, {
    vect3d: {
      retiens: { regle: "Dans un repère de l'espace, \\(\\overrightarrow{AB} = B - A\\) : on soustrait les coordonnées de \\(A\\) à celles de \\(B\\), une par une. La norme de \\(\\vec{u} = (a \\,;\\, b \\,;\\, c)\\) vaut \\(\\|\\vec{u}\\| = \\sqrt{a^2 + b^2 + c^2}\\) (Pythagore deux fois) : c'est la distance \\(AB\\). Le milieu de \\([AB]\\) est la moyenne des coordonnées de \\(A\\) et de \\(B\\).",
        exemple: ["\\(A(1 \\,;\\, 2 \\,;\\, 0)\\), \\(B(3 \\,;\\, -1 \\,;\\, 2)\\) : \\(\\overrightarrow{AB} = (2 \\,;\\, -3 \\,;\\, 2)\\).", "\\(\\|(1 \\,;\\, 2 \\,;\\, 2)\\| = \\sqrt{1 + 4 + 4} = 3\\).", "Milieu de \\(A(1 \\,;\\, 2 \\,;\\, -1)\\) et \\(B(3 \\,;\\, 0 \\,;\\, 4)\\) : \\(\\left(2 \\,;\\, 1 \\,;\\, \\frac{3}{2}\\right)\\)."],
        piege: "\\(\\overrightarrow{AB} = B - A\\), pas \\(A - B\\) (ce serait \\(\\overrightarrow{BA}\\)) : arrivée moins départ." },
      predict: { q: "A(1 ; 2 ; −1) et B(3 ; 0 ; 4). Les composantes du vecteur AB sont…", choices: ["(2 ; −2 ; 5)", "(4 ; 2 ; 3)", "(−2 ; 2 ; −5)"], good: 0,
        why: "On soustrait les coordonnées de A à celles de B : (3 − 1 ; 0 − 2 ; 4 − (−1)) = (2 ; −2 ; 5). (4 ; 2 ; 3) est la somme, (−2 ; 2 ; −5) le vecteur BA." },
      defis: ["A(1 ; 2 ; 0) est fixé. Déplace B pour que \\(\\overrightarrow{AB} = (2 \\,;\\, -3 \\,;\\, 2)\\).", "Déplace B pour que la distance AB vaille exactement 3, avec les trois composantes de \\(\\overrightarrow{AB}\\) non nulles."],
      play: slide({
        ctl: () => [{ k: "x", lab: "x de B", min: 0, max: 4 }, { k: "y", lab: "y de B", min: -1, max: 5 }, { k: "z", lab: "z de B", min: -2, max: 3 }],
        init: (s) => (s ? { x: 3, y: -1, z: 2 } : { x: 4, y: 4, z: 3 }),
        fig: (st) => { const B = [st.x, st.y, st.z], u = [B[0] - 1, B[1] - 2, B[2]], S = scene(BV);
          S.guides(B).path([A1, add(A1, [u[0], 0, 0]), add(A1, [u[0], u[1], 0]), B], "f-blue", 1.6, "5 4");
          if (u.some((v) => v)) S.arrow(A1, B, "f-accent");
          return S.dot(A1, "A", "f-dot", "l").dot(B, "B(" + B.map(nb).join(" ; ") + ")", "f-fill2", "r").svg("vecteur AB dans l'espace"); },
        out: (st) => { const u = [st.x - 1, st.y - 2, st.z], n2 = dot(u, u);
          return "Vecteur AB = B − A = (" + nb(st.x) + " − 1 ; " + nb(st.y) + " − 2 ; " + nb(st.z) + " − 0) = <b>" + tri(u) + "</b><br>AB = √(" + u.map((v) => par(v) + "²").join(" + ") + ") = √" + nb(n2) + "<b>" + rq(n2) + "</b>" + '<br><span class="small">en bleu : on avance selon x, puis selon y, puis selon z (Pythagore deux fois)</span>'; },
        goal: [(st) => (st.x === 3 && st.y === -1 && st.z === 2 ? "B = A + (2 ; −3 ; 2) = (3 ; −1 ; 2) : on ajoute les composantes à A, ou B − A = (2 ; −3 ; 2)." : ""),
          (st) => { const u = [st.x - 1, st.y - 2, st.z]; return dot(u, u) === 9 && u.every((v) => v) ? "AB = " + tri(u) + " : √(" + u.map((v) => v * v).join(" + ") + ") = √9 = 3. Pythagore deux fois : d'abord dans le plan horizontal, puis avec la hauteur." : ""; }],
        miss: (st, s) => { const u = [st.x - 1, st.y - 2, st.z];
          if (s === 0) { const k = [0, 1, 2].find((i) => u[i] !== [2, -3, 2][i]); return "Composante en " + "xyz"[k] + " : " + nb(u[k]) + " au lieu de " + nb([2, -3, 2][k]) + "."; }
          return dot(u, u) === 9 ? "AB = 3, mais une composante est nulle. Cherche trois carrés non nuls dont la somme fait 9." : "AB² = " + nb(dot(u, u)) + " : il faut AB² = 9."; },
        ask: [null, { q: "A(1 ; 2 ; −1) et B(3 ; 0 ; 4). Tape la cote (troisième coordonnée) du milieu de [AB].", ans: 1.5, ok: "(−1 + 4) ÷ 2 = 3/2 : le milieu est (2 ; 1 ; 3/2), la moyenne des coordonnées.", no: "Milieu : moyenne des deux cotes, (−1 + 4) ÷ 2." }] }),
    },

    colin: {
      retiens: { regle: "\\(\\vec{u}\\) et \\(\\vec{v}\\) sont colinéaires s'il existe \\(k\\) tel que \\(\\vec{v} = k\\,\\vec{u}\\) : les trois rapports de composantes sont égaux. \\(A\\), \\(B\\), \\(C\\) sont alignés si \\(\\overrightarrow{AC} = t\\,\\overrightarrow{AB}\\). Trois vecteurs sont coplanaires si l'un est combinaison des deux autres : \\(\\vec{w} = \\alpha\\vec{u} + \\beta\\vec{v}\\) ; deux composantes donnent \\(\\alpha\\) et \\(\\beta\\), la troisième vérifie.",
        exemple: ["\\((2 \\,;\\, -1 \\,;\\, 3)\\) et \\((6 \\,;\\, -3 \\,;\\, 8)\\) ne sont pas colinéaires : \\(\\frac{8}{3} \\neq 3\\).", "\\(A(1 \\,;\\, 0 \\,;\\, 2)\\), \\(B(3 \\,;\\, 1 \\,;\\, 1)\\), \\(C(5 \\,;\\, 2 \\,;\\, 0)\\) : \\(\\overrightarrow{AC} = 2\\,\\overrightarrow{AB}\\), alignés.", "\\((2 \\,;\\, -2 \\,;\\, 1) = 2(1 \\,;\\, 0 \\,;\\, 1) - (0 \\,;\\, 2 \\,;\\, 1)\\) : coplanaires."],
        piege: "Deux équations suffisent à trouver \\(\\alpha\\) et \\(\\beta\\) (ou \\(k\\)) ; il faut toujours vérifier la troisième." },
      predict: { q: "Les vecteurs (2 ; −1 ; 3) et (6 ; −3 ; 8) sont-ils colinéaires ?", choices: ["Oui", "Non"], good: 1,
        why: "6 = 3 · 2 et −3 = 3 · (−1), mais 8 ≠ 3 · 3 = 9. Les trois rapports doivent être égaux : ils ne le sont pas." },
      defis: ["A(1 ; 0 ; 2) et B(3 ; 1 ; 1) sont fixés. Le point C a pour abscisse 5 : règle ses deux autres coordonnées pour que A, B et C soient alignés.", "\\(\\vec{u} = (1 \\,;\\, 0 \\,;\\, 1)\\) et \\(\\vec{v} = (0 \\,;\\, 2 \\,;\\, 1)\\). Règle \\(\\alpha\\) et \\(\\beta\\) pour que \\(\\alpha\\vec{u} + \\beta\\vec{v}\\) arrive sur \\(\\vec{w} = (2 \\,;\\, -2 \\,;\\, 1)\\)."],
      play: slide({
        ctl: (s) => (s ? [{ k: "a", lab: "α", min: -2, max: 2 }, { k: "b", lab: "β", min: -2, max: 2 }] : [{ k: "y", lab: "y de C", min: -1, max: 3 }, { k: "z", lab: "z de C", min: -1, max: 4 }]),
        init: (s) => (s ? { a: 1, b: 1 } : { y: 0, z: 3 }),
        fig: (st, s) => {
          if (!s) { const C = [5, st.y, st.z], S = scene(BC), seg = clip(CA1, [2, 1, -1], BC, -1, 2.5);
            if (seg) S.line(seg[0], seg[1], "f-line", 1.2, "6 4");
            return S.guides(C).arrow(CA1, CB1, "f-blue").arrow(CA1, C, "f-accent", 2).dot(CA1, "A", "f-dot", "l").dot(CB1, "B", "f-dot", "r").dot(C, "C", "f-fill2", "r").svg("points A, B et C dans l'espace"); }
          const S = scene(BW), R = add(mul(st.a, U1), mul(st.b, V1)), k = 2.2;
          S.poly([add(mul(-k, U1), mul(-k, V1)), add(mul(k, U1), mul(-k, V1)), add(mul(k, U1), mul(k, V1)), add(mul(-k, U1), mul(k, V1))], "f-soft", 0.45);
          S.arrow([0, 0, 0], U1, "f-blue").arrow([0, 0, 0], V1, "f-blue").path([[0, 0, 0], mul(st.a, U1), R], "f-line", 1.4, "5 4");
          if (R.some((v) => v)) S.arrow([0, 0, 0], R, "f-accent", 2.2);
          return S.dot(W1, "w", "f-fill2", "r").text(add(U1, [0, 0, 0.3]), "u").text(add(V1, [0, 0.2, 0.3]), "v").svg("vecteurs u, v, et la combinaison αu + βv dans le plan qu'ils engendrent"); },
        out: (st, s) => {
          if (s) { const R = add(mul(st.a, U1), mul(st.b, V1)); return "αu + βv = " + nb(st.a) + " · (1 ; 0 ; 1) " + sg(st.b).trim() + " · (0 ; 2 ; 1) = <b>" + tri(R) + "</b><br>" + '<span class="small">le plan clair contient toutes les combinaisons de u et de v</span>'; }
          const AC = [4, st.y, st.z - 2], r = [4 / 2, AC[1] / 1, AC[2] / -1];
          return "Vecteur AB = (2 ; 1 ; −1), vecteur AC = " + tri(AC) + "<br>Rapports : 4 ÷ 2 = <b>2</b> ; " + nb(AC[1]) + " ÷ 1 = <b>" + nb(r[1]) + "</b> ; " + nb(AC[2]) + " ÷ (−1) = <b>" + nb(r[2]) + "</b>"; },
        goal: [(st) => (st.y === 2 && st.z === 0 ? "C(5 ; 2 ; 0) : vecteur AC = (4 ; 2 ; −2) = 2 · (2 ; 1 ; −1). Les trois rapports valent 2 : AC = 2·AB, les points sont alignés." : ""),
          (st) => (st.a === 2 && st.b === -1 ? "2 · (1 ; 0 ; 1) − (0 ; 2 ; 1) = (2 ; −2 ; 1), donc w est une combinaison de u et v, les trois vecteurs sont coplanaires." : "")],
        miss: (st, s) => (s ? "Composante x : α · 1 = 2 donne α ; composante y : 2β = −2 donne β. Puis vérifie z." : "Les trois rapports doivent être égaux : le premier vaut 2."),
        ask: [null, { q: "Avec les mêmes \\(\\vec{u} = (1 \\,;\\, 0 \\,;\\, 1)\\) et \\(\\vec{v} = (0 \\,;\\, 2 \\,;\\, 1)\\), le vecteur \\((3 \\,;\\, 4 \\,;\\, z)\\) est coplanaire avec eux. Tape z.", ans: 5, ok: "x : α = 3 ; y : 2β = 4, β = 2 ; donc z = α + β = 5.", no: "Trouve α avec la composante x, β avec la composante y, puis calcule la composante z de αu + βv." }] }),
    },

    droite3d: {
      retiens: { regle: "La droite passant par \\(A\\) et de vecteur directeur \\(\\vec{u}\\) a pour équations paramétriques \\(x = x_A + t\\,u_x\\), \\(y = y_A + t\\,u_y\\), \\(z = z_A + t\\,u_z\\) : chaque valeur de \\(t\\) donne un point. Un point est sur la droite si les trois équations donnent le même \\(t\\). La droite perce le plan \\(xOy\\) là où \\(z = 0\\). Deux droites sont sécantes s'il existe \\(t\\) et \\(s\\) qui donnent le même point.",
        exemple: ["\\(x = 1 + 2t\\), \\(y = -t\\), \\(z = 4 - 2t\\) : \\(z = 0\\) pour \\(t = 2\\), point \\((5 \\,;\\, -2 \\,;\\, 0)\\).", "\\(P(7 \\,;\\, -3 \\,;\\, -2)\\) : \\(t = 3\\) dans les trois équations, \\(P\\) est sur la droite.", "Les deux droites se coupent en \\((3 \\,;\\, -1 \\,;\\, 2)\\), pour \\(t = 1\\) et \\(s = 2\\)."],
        piege: "Les coefficients de \\(t\\) forment le vecteur directeur ; les termes constants, le point de départ. Une seule équation vérifiée ne suffit pas." },
      predict: { q: "Droite : x = 1 + 2t, y = −t, z = 2 + 3t. Pour t = 1, on obtient le point…", choices: ["(3 ; −1 ; 5)", "(2 ; −1 ; 3)", "(1 ; 0 ; 2)"], good: 0,
        why: "On remplace t par 1 : x = 1 + 2 = 3, y = −1, z = 2 + 3 = 5. (1 ; 0 ; 2) est le point de départ (t = 0), (2 ; −1 ; 3) le vecteur directeur." },
      defis: ["Droite d₁ : x = 1 + 2t, y = −t, z = 4 − 2t. Fais glisser t pour amener le point M dans le plan xOy (z = 0).", "Droite d₂ : x = −1 + 2s, y = −3 + s, z = 2. Règle t et s pour que M (sur d₁) et N (sur d₂) soient au même endroit."],
      play: slide({
        ctl: (s) => (s ? [{ k: "t", lab: "t (point M sur d₁)", min: -0.5, max: 2.5, step: 0.5 }, { k: "s", lab: "s (point N sur d₂)", min: 0, max: 3, step: 0.5 }] : [{ k: "t", lab: "t", min: -0.5, max: 2.5, step: 0.5 }]),
        init: (s) => (s ? { t: 0, s: 0 } : { t: 0 }),
        fig: (st, s) => { const S = scene(BD), M = add(DA, mul(st.t, DU)), s1 = clip(DA, DU, BD);
          if (!s) S.poly([[-1, -3, 0], [6, -3, 0], [6, 1, 0], [-1, 1, 0]], "f-soft", 0.4);
          if (s1) S.line(s1[0], s1[1], "f-blue", 2);
          if (s) { const s2 = clip(DB, DV, BD), N = add(DB, mul(st.s, DV)); if (s2) S.line(s2[0], s2[1], "f-line", 2); S.dot(N, "N", "f-fill2", "b"); S.text(add(DB, [0, -0.4, 0.4]), "d₂"); }
          else S.guides(M);
          return S.dot(DA, "A", "f-dot", "l").dot(M, "M", "f-dot", "r").text(add(DA, mul(-0.8, DU)), "d₁").svg("droite d₁" + (s ? " et droite d₂" : " et plan xOy")); },
        out: (st, s) => { const M = add(DA, mul(st.t, DU));
          if (!s) return "M = (1 + 2t ; −t ; 4 − 2t) = <b>" + tri(M) + "</b>" + (M[2] === 0 ? " : dans le plan xOy" : " : cote " + nb(M[2]));
          const N = add(DB, mul(st.s, DV)), d = Math.hypot(M[0] - N[0], M[1] - N[1], M[2] - N[2]);
          return "M = " + tri(M) + " sur d₁<br>N = " + tri(N) + " sur d₂<br>Distance MN ≈ <b>" + nb(+d.toFixed(2)) + "</b>"; },
        goal: [(st) => (st.t === 2 ? "z = 4 − 2t = 0 pour t = 2 : M(5 ; −2 ; 0). La droite perce le plan xOy en ce point." : ""),
          (st) => (st.t === 1 && st.s === 2 ? "t = 1 et s = 2 donnent le même point (3 ; −1 ; 2) : les droites d₁ et d₂ sont sécantes." : "")],
        miss: (st, s) => (s ? (st.t === 1 ? "M est déjà sur d₂ (z = 2) : déplace N jusqu'à lui." : "Sur d₂, z vaut toujours 2 : cherche d'abord t pour que M ait aussi z = 2.") : "On veut z = 4 − 2t = 0."),
        ask: [{ q: "La droite x = 3 − t, y = 2t, z = 6 + 3t perce le plan xOy en un point. Tape son abscisse x.", ans: 5, ok: "z = 6 + 3t = 0 pour t = −2, d'où x = 3 − (−2) = 5 : le point (5 ; −4 ; 0).", no: "Cherche d'abord t avec z = 0, puis calcule x." },
          { q: "Le point P(7 ; −3 ; −2) est-il sur d₁ ? Tape la valeur de t que donne l'équation en x, puis vérifie les deux autres.", ans: 3, ok: "1 + 2t = 7 donne t = 3 ; y = −3 ✓ ; z = 4 − 6 = −2 ✓. Les trois équations donnent le même t : P est sur d₁.", no: "x = 1 + 2t = 7 : résous en t." }] }),
    },

    plans: {
      retiens: { regle: "Un plan a une équation cartésienne \\(ax + by + cz = d\\) (ou \\(ax + by + cz + d = 0\\)) ; le vecteur \\(\\vec{n} = (a \\,;\\, b \\,;\\, c)\\) est orthogonal au plan (vecteur normal). Les plans parallèles ont les mêmes \\(a\\), \\(b\\), \\(c\\) : seul \\(d\\) change. Un point est dans le plan si ses coordonnées vérifient l'équation. Traces sur les axes : on annule deux coordonnées.",
        exemple: ["\\(x + 2y + 2z = d\\) passe par \\(P(2 \\,;\\, 1 \\,;\\, 1)\\) si \\(d = 2 + 2 + 2 = 6\\).", "Plan par \\((4 \\,;\\, 0 \\,;\\, 0)\\), \\((0 \\,;\\, 2 \\,;\\, 0)\\), \\((0 \\,;\\, 0 \\,;\\, 4)\\) : \\(x + 2y + z = 4\\).", "\\(2x - y + 3z - 6 = 0\\) coupe l'axe \\(Oz\\) en \\((0 \\,;\\, 0 \\,;\\, 2)\\)."],
        piege: "Pour un plan parallèle, on garde \\(a\\), \\(b\\), \\(c\\) et on recalcule \\(d\\) avec le nouveau point." },
      predict: { q: "Le plan 2x − y + 3z − 6 = 0 coupe l'axe Oz en…", choices: ["(0 ; 0 ; 2)", "(0 ; 0 ; 6)", "(0 ; 0 ; 3)"], good: 0,
        why: "Sur l'axe Oz, x = 0 et y = 0 : il reste 3z − 6 = 0, donc z = 2." },
      defis: ["Le plan π : x + 2y + 2z = d glisse parallèlement à lui-même quand d change. Règle d pour qu'il passe par P(2 ; 1 ; 1).", "Règle a, b et c pour que le plan ax + by + cz = 4 passe par les trois points (4 ; 0 ; 0), (0 ; 2 ; 0) et (0 ; 0 ; 4)."],
      play: slide({
        ctl: (s) => (s ? [{ k: "a", lab: "a", min: 1, max: 4 }, { k: "b", lab: "b", min: 1, max: 4 }, { k: "c", lab: "c", min: 1, max: 4 }] : [{ k: "d", lab: "d", min: 1, max: 8 }]),
        init: (s) => (s ? { a: 2, b: 1, c: 2 } : { d: 2 }),
        fig: (st, s) => {
          if (!s) { const S = scene(BP), P = [2, 1, 1], Q = traces(S, 1, 2, 2, st.d), G = mul(1 / 3, add(add(Q[0], Q[1]), Q[2]));
            S.arrow(G, add(G, mul(0.6, [1, 2, 2])), "f-accent", 2).text(add(G, [0.6, 1.5, 1.5]), "n");
            return S.guides(P).dot(P, "P", st.d === 6 ? "f-dot" : "f-fill2", "r").svg("plan x + 2y + 2z = d et point P"); }
          const S = scene(BP2); traces(S, st.a, st.b, st.c, 4);
          return S.dot([4, 0, 0], "", "f-fill2", "l", 5).dot([0, 2, 0], "", "f-fill2", "b", 5).dot([0, 0, 4], "", "f-fill2", "l", 5).svg("plan ax + by + cz = 4 et trois points visés"); },
        out: (st, s) => {
          if (!s) { const v = 6 - st.d; return "Traces : (" + nb(st.d) + " ; 0 ; 0), (0 ; " + nb(st.d / 2) + " ; 0), (0 ; 0 ; " + nb(st.d / 2) + ")<br>Vecteur normal n = (1 ; 2 ; 2), le même pour toute valeur de d<br>P est <b>" + (v === 0 ? "dans le plan" : v > 0 ? "au-delà du plan (du côté où pointe n)" : "en deçà du plan") + "</b>"; }
          return "Traces sur les axes : (" + nb(+(4 / st.a).toFixed(2)) + " ; 0 ; 0), (0 ; " + nb(+(4 / st.b).toFixed(2)) + " ; 0), (0 ; 0 ; " + nb(+(4 / st.c).toFixed(2)) + ")<br>" + '<span class="small">sur l\'axe Ox, y = z = 0 : ax = 4, donc x = 4 ÷ a</span>'; },
        goal: [(st) => (st.d === 6 ? "En P : 2 + 2 · 1 + 2 · 1 = 6, donc d = 6. Le plan glisse sans tourner : n = (1 ; 2 ; 2) ne change pas." : ""),
          (st) => (st.a === 1 && st.b === 2 && st.c === 1 ? "x + 2y + z = 4 : (4 ; 0 ; 0) donne 4 = 4, (0 ; 2 ; 0) donne 4, (0 ; 0 ; 4) donne 4. Vecteur normal (1 ; 2 ; 1)." : "")],
        miss: (st, s) => (s ? "Chaque trace se règle seule : sur Ox, a · 4 = 4 ; sur Oy, b · 2 = 4 ; sur Oz, c · 4 = 4." : "Remplace x, y, z par les coordonnées de P dans x + 2y + 2z."),
        ask: [{ q: "Plan parallèle à 2x − y + 3z − 6 = 0 passant par A(1 ; 1 ; 1) : il s'écrit 2x − y + 3z + d = 0. Tape d.", ans: -4, ok: "2 − 1 + 3 + d = 0, donc d = −4 : 2x − y + 3z − 4 = 0. Mêmes a, b, c ; seul d change.", no: "Remplace x, y, z par 1 dans 2x − y + 3z + d = 0." },
          { q: "Le plan 3x + 2y + 6z = 12 coupe l'axe Oy en (0 ; y ; 0). Tape y.", ans: 6, ok: "x = z = 0 : 2y = 12, y = 6.", no: "Sur l'axe Oy, x = 0 et z = 0." }] }),
    },

    posrel: {
      retiens: { regle: "Droite \\(A + t\\vec{u}\\) et plan de vecteur normal \\(\\vec{n}\\) : on remplace \\(x\\), \\(y\\), \\(z\\) de la droite dans l'équation du plan et on résout en \\(t\\). Si \\(\\vec{n} \\cdot \\vec{u} \\neq 0\\), la droite perce le plan en un seul point. Si \\(\\vec{n} \\cdot \\vec{u} = 0\\), elle est parallèle au plan : contenue dedans si \\(A\\) est dans le plan, sinon aucun point commun. Deux plans non parallèles se coupent selon une droite.",
        exemple: ["\\(A(1 \\,;\\, 0 \\,;\\, 0) + t(1 \\,;\\, -2 \\,;\\, 1)\\) et \\(x + y + z = 4\\) : \\(\\vec{n} \\cdot \\vec{u} = 0\\), aucun point commun.", "\\(x = 1 + t\\), \\(y = 2t\\), \\(z = 3 - t\\) et \\(x + y + z - 7 = 0\\) : \\(4 + 2t = 7\\), \\(t = \\frac{3}{2}\\)."],
        piege: "Droite parallèle au plan : \\(\\vec{u}\\) est orthogonal à \\(\\vec{n}\\) (\\(\\vec{n} \\cdot \\vec{u} = 0\\)), pas colinéaire à \\(\\vec{n}\\)." },
      predict: { q: "Deux plans distincts de l'espace, non parallèles, se coupent…", choices: ["selon une droite", "en un seul point", "jamais"], good: 0,
        why: "Deux plans qui se coupent ont toute une droite en commun (pense au sol et à un mur). Il faut trois plans pour se couper, en général, en un seul point." },
      defis: ["Plan π : x + y + z = 4. La droite d part de A(1 ; 0 ; 0) avec la direction \\(\\vec{u} = (1 \\,;\\, m \\,;\\, 1)\\). Règle m pour que d ne perce pas π.", "Règle m pour que d perce π au point d'abscisse x = 2."],
      play: slide({
        ctl: () => [{ k: "m", lab: "m", min: -4, max: 3 }],
        init: (s) => ({ m: s ? -2 : 0 }),
        fig: (st) => { const S = scene(BR), u = [1, st.m, 1], A = [1, 0, 0]; traces(S, 1, 1, 1, 4);
          const seg = clip(A, u, BR, -1, 6); if (seg) S.line(seg[0], seg[1], "f-blue", 2.2);
          S.arrow(A, add(A, u), "f-accent", 2).dot(A, "A", "f-dot", "l");
          if (st.m !== -2) { const t = 3 / (2 + st.m), I = add(A, mul(t, u)); if (inBox(I, BR)) S.dot(I, "I", "f-fill2", "r", 5.5); }
          return S.svg("plan x + y + z = 4 et droite d"); },
        out: (st) => { const nu = 2 + st.m;
          return "n = (1 ; 1 ; 1), u = (1 ; " + nb(st.m) + " ; 1) : n · u = 1 + " + par(st.m) + " + 1 = <b>" + nb(nu) + "</b><br>" + (nu === 0 ? "On remplace : (1 + t) + " + nb(st.m) + "t + t = 4 donne 1 = 4, impossible : <b>aucun point commun</b>." : "On remplace : (1 + t) + " + par(st.m) + "t + t = 4 donne " + nb(nu) + "t = 3, t = " + nb(+(3 / nu).toFixed(3)) + " : point I" + tri(add([1, 0, 0], mul(3 / nu, [1, st.m, 1])).map((v) => +v.toFixed(2)))); },
        goal: [(st) => (st.m === -2 ? "m = −2, donc n · u = 0 ; u est orthogonal à n, donc d est parallèle à π. Et A n'est pas dans π (1 + 0 + 0 ≠ 4) : aucun point commun." : ""),
          (st) => (st.m === 1 ? "m = 1 : 3t = 3, t = 1, donc I(2 ; 1 ; 1) ; on vérifie 2 + 1 + 1 = 4." : "")],
        miss: (st, s) => (s ? "x = 1 + t = 2 demande t = 1 : il faut alors (2 + m) · 1 = 3." : "La droite perce le plan tant que n · u ≠ 0."),
        ask: [{ q: "Même plan x + y + z = 4 et droite x = 2 + t, y = −1 + 2t, z = 3 − 3t. Tape \\(\\vec{n} \\cdot \\vec{u}\\).", ans: 0, ok: "n · u = 1 + 2 − 3 = 0 : parallèle. Et A(2 ; −1 ; 3) vérifie 2 − 1 + 3 = 4 : cette droite est contenue dans π.", no: "u = (1 ; 2 ; −3) et n = (1 ; 1 ; 1) : additionne les produits des composantes." },
          { q: "La droite x = 1 + t, y = 2t, z = 3 − t perce le plan x + y + z − 7 = 0. Pour quelle valeur de t ?", ans: 1.5, ok: "(1 + t) + 2t + (3 − t) − 7 = 0 donne 2t − 3 = 0, t = 3/2 : le point (5/2 ; 3 ; 3/2).", no: "Remplace x, y, z par leurs expressions en t dans l'équation du plan." }] }),
    },

    pscal3d: {
      retiens: { regle: "\\(\\vec{u} \\cdot \\vec{v} = u_x v_x + u_y v_y + u_z v_z = \\|\\vec{u}\\| \\, \\|\\vec{v}\\| \\cos\\alpha\\). Donc \\(\\cos\\alpha = \\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{u}\\| \\, \\|\\vec{v}\\|}\\), et \\(\\vec{u} \\perp \\vec{v} \\iff \\vec{u} \\cdot \\vec{v} = 0\\).",
        exemple: ["\\((1 \\,;\\, 2 \\,;\\, 2) \\cdot (2 \\,;\\, 1 \\,;\\, -2) = 2 + 2 - 4 = 0\\) : orthogonaux.", "\\((1 \\,;\\, 0 \\,;\\, 1)\\) et \\((0 \\,;\\, 1 \\,;\\, 1)\\) : \\(\\cos\\alpha = \\frac{1}{\\sqrt{2} \\cdot \\sqrt{2}} = \\frac{1}{2}\\), \\(\\alpha = 60°\\).", "\\((2 \\,;\\, 1 \\,;\\, -2)\\) et \\((1 \\,;\\, 1 \\,;\\, 0)\\) : \\(\\cos\\alpha = \\frac{3}{3\\sqrt{2}}\\), \\(\\alpha = 45°\\)."],
        piege: "Le produit scalaire est un nombre, pas un vecteur. Négatif : l'angle est obtus." },
      predict: { q: "Que vaut le produit scalaire (1 ; 2 ; 2) · (2 ; 0 ; −1) ?", choices: ["0", "(2 ; 0 ; −2)", "3"], good: 0,
        why: "On multiplie composante par composante et on additionne : 1 · 2 + 2 · 0 + 2 · (−1) = 0. Un produit scalaire nul : les vecteurs sont orthogonaux." },
      defis: ["\\(\\vec{u} = (1 \\,;\\, 2 \\,;\\, 2)\\) et \\(\\vec{v} = (2 \\,;\\, 1 \\,;\\, z)\\). Règle z pour que \\(\\vec{u}\\) et \\(\\vec{v}\\) soient orthogonaux.", "\\(\\vec{u} = (1 \\,;\\, 0 \\,;\\, 1)\\) et \\(\\vec{v} = (0 \\,;\\, 1 \\,;\\, k)\\). Règle k pour que l'angle entre \\(\\vec{u}\\) et \\(\\vec{v}\\) vaille 60°."],
      play: slide({
        ctl: (s) => [s ? { k: "k", lab: "k", min: -3, max: 3 } : { k: "z", lab: "z", min: -3, max: 3 }],
        init: (s) => (s ? { k: 3 } : { z: 2 }),
        fig: (st, s) => { const u = s ? [1, 0, 1] : [1, 2, 2], v = s ? [0, 1, st.k] : [2, 1, st.z], S = scene(s ? BS2 : BS1, { s: 34, ticks: false });
          arc(S, u, v, s ? 0.55 : 0.9);
          return S.arrow([0, 0, 0], u, "f-blue").arrow([0, 0, 0], v, "f-accent").text(add(u, [0, 0.15, 0.25]), "u").text(add(v, [0, 0.2, 0.25]), "v").svg("vecteurs u et v issus de O et leur angle"); },
        out: (st, s) => { const u = s ? [1, 0, 1] : [1, 2, 2], v = s ? [0, 1, st.k] : [2, 1, st.z], p = dot(u, v), a = ang(u, v);
          return "u · v = " + u.map((x, i) => nb(x) + " · " + par(v[i])).join(" + ") + " = <b>" + nb(p) + "</b><br>‖u‖ = " + rt(dot(u, u)) + ", ‖v‖ = " + rt(dot(v, v)) + "<br>cos α = " + nb(+(p / Math.sqrt(dot(u, u) * dot(v, v))).toFixed(3)) + ", α ≈ <b>" + nb(+a.toFixed(1)) + "°</b>" + (p < 0 ? " (obtus : produit scalaire négatif)" : p === 0 ? " (droit)" : ""); },
        goal: [(st) => (st.z === -2 ? "2 + 2 + 2z = 0 pour z = −2, donc u · v = 0 et l'angle est droit." : ""),
          (st) => (st.k === 1 ? "k = 1, donc u · v = 1, ‖u‖ = ‖v‖ = √2, cos α = 1 ÷ 2, donc α = 60°." : "")],
        miss: (st, s) => (s ? (st.k === -1 ? "120° : cos α = −1/2, le produit scalaire est négatif. Cherche cos α = +1/2." : "On veut cos α = 1/2.") : "Orthogonaux : u · v = 0."),
        ask: [{ q: "\\(\\vec{a} = (3 \\,;\\, -1 \\,;\\, 2)\\) et \\(\\vec{b} = (1 \\,;\\, k \\,;\\, -2)\\) sont orthogonaux. Tape k.", ans: -1, ok: "3 − k − 4 = 0, donc k = −1.", no: "Écris a · b = 0 et résous en k." },
          { q: "Angle (en degrés) entre \\((2 \\,;\\, 1 \\,;\\, -2)\\) et \\((1 \\,;\\, 1 \\,;\\, 0)\\) ?", ans: 45, tol: 0.5, ok: "Produit scalaire 3, normes 3 et √2 : cos α = 3 ÷ (3√2) = 1/√2, α = 45°.", no: "cos α = (u · v) ÷ (‖u‖ ‖v‖), puis la touche arccos." }] }),
    },

    distances: {
      retiens: { regle: "La plus courte distance d'un point à un plan ou à une droite se mesure perpendiculairement. Distance de \\(P\\) au plan \\(ax + by + cz + d = 0\\) : \\(\\frac{|ax_P + by_P + cz_P + d|}{\\sqrt{a^2 + b^2 + c^2}}\\). Distance de \\(P\\) à la droite \\(A + t\\vec{u}\\) : le pied \\(H\\) correspond à \\(t = \\frac{\\overrightarrow{AP} \\cdot \\vec{u}}{\\|\\vec{u}\\|^2}\\), puis on calcule \\(PH\\).",
        exemple: ["\\(P(3 \\,;\\, 1 \\,;\\, 2)\\) et \\(2x + y + 2z - 2 = 0\\) : \\(\\frac{|6 + 1 + 4 - 2|}{3} = 3\\).", "\\(Q(1 \\,;\\, 1 \\,;\\, 1)\\), même plan : \\(\\frac{|2 + 1 + 2 - 2|}{3} = 1\\).", "\\(A(1 \\,;\\, 0 \\,;\\, 0) + t(1 \\,;\\, 1 \\,;\\, 0)\\), \\(P(5 \\,;\\, 0 \\,;\\, 1)\\) : \\(t = \\frac{4}{2} = 2\\), \\(H(3 \\,;\\, 2 \\,;\\, 0)\\), \\(PH = 3\\)."],
        piege: "N'oublie ni la valeur absolue ni la racine de \\(a^2 + b^2 + c^2\\)." },
      predict: { q: "Distance de P(1 ; 1 ; 1) au plan 2x + y + 2z − 2 = 0 : on calcule |2 + 1 + 2 − 2| = 3, puis on divise par…", choices: ["3 = √(2² + 1² + 2²)", "9 = 2² + 1² + 2²", "5 = 2 + 1 + 2"], good: 0,
        why: "On divise par la norme du vecteur normal (2 ; 1 ; 2), √(4 + 1 + 4) = 3 : la distance vaut 3 ÷ 3 = 1." },
      defis: ["Le point H se promène dans le plan π : 2x + y + 2z − 2 = 0. Règle-le pour que la distance PH, avec P(3 ; 1 ; 2), soit la plus courte possible.", "H se promène maintenant sur la droite d : (1 ; 0 ; 0) + t·(1 ; 1 ; 0). Règle t pour que la distance PH, avec P(5 ; 0 ; 1), soit la plus courte possible."],
      play: slide({
        ctl: (s) => (s ? [{ k: "t", lab: "t", min: -1, max: 4, step: 0.5 }] : [{ k: "s", lab: "H : direction 1", min: -1.5, max: 1.5, step: 0.5 }, { k: "t", lab: "H : direction 2", min: -1.5, max: 1.5, step: 0.5 }]),
        init: (s) => (s ? { t: 0 } : { s: 1, t: -1 }),
        fig: (st, s) => {
          if (!s) { const S = scene(BDP, { ticks: false }), H = add(H0, add(mul(st.s, E1), mul(st.t, E2))), k = 1.6, ok = st.s === 0 && st.t === 0;
            S.poly([[-k, -k], [k, -k], [k, k], [-k, k]].map(([a, b]) => add(H0, add(mul(a, E1), mul(b, E2)))), "f-fill2", 0.4);
            return S.line(PD, H, ok ? "f-accent" : "f-line", 2.2).dot(PD, "P", "f-dot", "r").dot(H, "H", "f-fill2", "b").svg("plan π, point P et point H du plan"); }
          const S = scene(BDL, { ticks: false }), H = add(LA, mul(st.t, LU)), seg = clip(LA, LU, BDL);
          if (seg) S.line(seg[0], seg[1], "f-blue", 2);
          return S.line(LP, H, st.t === 2 ? "f-accent" : "f-line", 2.2).dot(LA, "A", "f-dot", "l").dot(LP, "P", "f-dot", "r").dot(H, "H", "f-fill2", "b").svg("droite d, point P et point H de la droite"); },
        out: (st, s) => {
          const H = s ? add(LA, mul(st.t, LU)) : add(H0, add(mul(st.s, E1), mul(st.t, E2))), P = s ? LP : PD, v = P.map((x, i) => x - H[i]);
          return "H" + tri(H) + " ; vecteur HP = " + tri(v) + "<br>PH = √" + nb(dot(v, v)) + "<b>" + rq(dot(v, v)) + "</b>"; },
        goal: [(st) => (st.s === 0 && st.t === 0 ? "PH = 3, le plus court. Alors HP = (2 ; 1 ; 2) : c'est le vecteur normal du plan, PH est perpendiculaire à π. Formule : |6 + 1 + 4 − 2| ÷ √(4 + 1 + 4) = 9 ÷ 3 = 3." : ""),
          (st) => (st.t === 2 ? "t = 2 : H(3 ; 2 ; 0), HP = (2 ; −2 ; 1) et HP · u = 2 − 2 + 0 = 0, perpendiculaire à d. PH = 3. Calcul direct : t = (AP · u) ÷ ‖u‖² = 4 ÷ 2 = 2." : "")],
        miss: (st, s) => (s ? "Le plus court : HP perpendiculaire à la direction (1 ; 1 ; 0) de d." : "Cherche la position où PH est le plus petit possible."),
        ask: [{ q: "Avec la formule : distance de Q(1 ; 1 ; 1) au même plan 2x + y + 2z − 2 = 0 ?", ans: 1, ok: "|2 + 1 + 2 − 2| ÷ √(4 + 1 + 4) = 3 ÷ 3 = 1.", no: "|ax + by + cz + d| ÷ √(a² + b² + c²), avec les coordonnées de Q." },
          { q: "Droite (0 ; 0 ; 0) + t·(1 ; 2 ; 2) et point P(5 ; 5 ; 6) : tape la valeur de t du pied H.", ans: 3, ok: "AP · u = 5 + 10 + 12 = 27 et ‖u‖² = 9, donc t = 3, H(3 ; 6 ; 6), PH = √5.", no: "t = (AP · u) ÷ ‖u‖²." }] }),
    },

    sphere: {
      retiens: { regle: "La sphère de centre \\(C(a \\,;\\, b \\,;\\, c)\\) et de rayon \\(r\\) a pour équation \\((x - a)^2 + (y - b)^2 + (z - c)^2 = r^2\\). Un plan à distance \\(\\delta < r\\) du centre la coupe selon un cercle de rayon \\(\\sqrt{r^2 - \\delta^2}\\) ; si \\(\\delta = r\\), il est tangent (un seul point commun). Le plan tangent en \\(T\\) a pour vecteur normal \\(\\overrightarrow{CT}\\).",
        exemple: ["\\((x - 1)^2 + y^2 + (z + 2)^2 = 9\\) : centre \\((1 \\,;\\, 0 \\,;\\, -2)\\), rayon 3.", "Rayon 5, plan à distance 3 du centre : cercle de rayon \\(\\sqrt{25 - 9} = 4\\).", "\\(C(1 \\,;\\, 2 \\,;\\, 0)\\), \\(T(3 \\,;\\, 3 \\,;\\, 2)\\) : plan tangent \\(2x + y + 2z - 13 = 0\\)."],
        piege: "Dans \\((z + 2)^2\\), la coordonnée du centre est \\(-2\\)." },
      predict: { q: "La sphère (x − 1)² + y² + (z + 2)² = 9 a pour centre…", choices: ["(1 ; 0 ; −2)", "(−1 ; 0 ; 2)", "(1 ; 0 ; 2)"], good: 0,
        why: "(z + 2)² = (z − (−2))² : la cote du centre est −2. Centre (1 ; 0 ; −2), rayon √9 = 3." },
      defis: ["Sphère de centre O(0 ; 0 ; 0) et de rayon 5. Règle la hauteur h du plan z = h pour que la section soit un cercle de rayon 4.", "Règle h pour que le plan z = h soit tangent à la sphère."],
      play: slide({
        ctl: () => [{ k: "h", lab: "Hauteur h du plan", min: -6, max: 6 }],
        init: () => ({ h: 0 }),
        fig: (st) => { const S = scene(BSP, { ticks: false }), r = 5, h = st.h, k = 5.5, c = S.p([0, 0, 0]);
          S.raw(`<circle cx="${c[0]}" cy="${c[1]}" r="${(r * S.s).toFixed(1)}" class="f-blue" fill="none" stroke-width="2"/>`);
          const ring = (z, rho) => { const P = []; for (let i = 0; i <= 48; i++) { const a = (i * Math.PI) / 24; P.push([rho * Math.cos(a), rho * Math.sin(a), z]); } return P; };
          S.path(ring(0, r), "f-line", 1, "4 4");
          S.poly([[-k, -k, h], [k, -k, h], [k, k, h], [-k, k, h]], "f-fill2", 0.35);
          if (Math.abs(h) < r) S.path(ring(h, Math.sqrt(r * r - h * h)), "f-accent", 2.4);
          if (Math.abs(h) === r) S.dot([0, 0, h], "", "f-dot", "r", 5);
          return S.dot([0, 0, 0], "O", "f-dot", "l", 3).line([0, 0, 0], [0, 0, h], "f-line", 1.2, "3 3").svg("sphère de rayon 5 et plan horizontal z = h"); },
        out: (st) => { const h = Math.abs(st.h);
          return "Distance du centre au plan : δ = |h| = " + nb(h) + "<br>" + (h < 5 ? "Section : cercle de rayon √(5² − " + nb(h) + "²) = √" + nb(25 - h * h) + "<b>" + rq(25 - h * h) + "</b>" : h === 5 ? "<b>Un seul point commun</b> : le plan est tangent." : "δ > 5 : <b>aucun point commun</b>."); },
        goal: [(st) => (Math.abs(st.h) === 3 ? "δ = 3 : √(25 − 9) = √16 = 4. Pythagore : rayon de la sphère² = δ² + rayon du cercle²." : ""),
          (st) => (Math.abs(st.h) === 5 ? "δ = r = 5 : le plan touche la sphère en un seul point (0 ; 0 ; " + nb(st.h) + "). Il est perpendiculaire au rayon qui y aboutit." : "")],
        miss: (st, s) => (s ? "Tangent : la distance au centre égale le rayon." : "On veut √(25 − h²) = 4."),
        ask: [{ q: "Sphère de rayon 13, plan à distance 5 du centre : rayon du cercle de section ?", ans: 12, ok: "√(13² − 5²) = √(169 − 25) = √144 = 12.", no: "√(r² − δ²)." },
          { q: "Sphère de centre C(1 ; 2 ; 0) passant par T(3 ; 3 ; 2). Le plan tangent en T a pour vecteur normal \\(\\overrightarrow{CT} = (2 \\,;\\, 1 \\,;\\, 2)\\) : il s'écrit 2x + y + 2z + d = 0. Tape d.", ans: -13, ok: "T est dans le plan : 6 + 3 + 4 + d = 0, donc d = −13.", no: "Remplace x, y, z par les coordonnées de T." }] }),
    },
  });

  // =====================================================================================================
  // 4e Collège · Intégration, ln et exp, équations différentielles, statistique (ch4c_ana.js)
  // =====================================================================================================
  /* surface sous f entre a et b (aire signée, au-dessus en bleu clair, au-dessous en rouge) */
  const shade = (f, a, b) => { const up = [[a, 0]], dn = [[a, 0]]; for (let i = 0; i <= 80; i++) { const x = a + ((b - a) * i) / 80, y = f(x); up.push([x, Math.max(0, y)]); dn.push([x, Math.min(0, y)]); } up.push([b, 0]); dn.push([b, 0]); return [[up, "f-fill2"], [dn, "f-soft"]]; };
  /* aire comparée à la réponse tapée : rectangle de même aire (hauteur v ÷ (b − a)) */
  const areaFig = (D, v) => {
    const o = { xr: D.xr, yr: D.yr, gx: D.gx, lx: D.lx, gy: D.gy, ly: D.ly, H: D.H || 200, fx: D.fx, fns: [{ f: D.f, from: D.dom }], polys: shade(D.f, D.a, D.b), vl: [[D.a, "f-line"], [D.b, "f-line"]], lab: D.lab };
    let t = '<span class="small">' + D.txt + "</span>";
    if (v !== null) { const hgt = v / (D.b - D.a), ok = Math.abs(v - D.v) <= (D.tol || 1e-9); o.segs = [[D.a, hgt, D.b, hgt, ok ? "f-accent" : "f-line", 2.2, "6 4"], [D.a, 0, D.a, hgt, ok ? "f-accent" : "f-line", 1.4, "3 3"], [D.b, 0, D.b, hgt, ok ? "f-accent" : "f-line", 1.4, "3 3"]];
      t = "Rectangle de même aire que ta réponse (" + nb(v) + ") : " + (ok ? '<b class="act-ok">il compense exactement la surface colorée</b>' : v > D.v ? "trop haut" : "trop bas"); }
    return graph(o) + plain(t);
  };
  const IP = [
    { f: (x) => x * Math.exp(x), a: 0, b: 1, v: 1, xr: [-0.2, 1.3], yr: [-0.4, 3], gx: 0.25, lx: 0.5, gy: 0.5, ly: 1, txt: "f(x) = x·eˣ entre 0 et 1 : la surface colorée vaut l'intégrale", lab: "aire sous x·eˣ entre 0 et 1" },
    { f: (x) => x * Math.cos(x), a: 0, b: Math.PI, v: -2, xr: [-0.3, 3.5], yr: [-3.4, 1], gx: 0.5, lx: 1, gy: 0.5, ly: 1, txt: "f(x) = x·cos x entre 0 et π : la partie sous l'axe compte négativement", lab: "aire signée sous x·cos x entre 0 et π" },
    { f: (x) => Math.log(x), a: 1, b: Math.E, v: 1, dom: 0.05, xr: [0, 3.2], yr: [-0.6, 1.4], gx: 0.5, lx: 1, gy: 0.25, ly: 0.5, txt: "f(x) = ln x entre 1 et e", lab: "aire sous ln x entre 1 et e" },
  ];
  /* substitution : la même aire, lue en x (haut) et en u (bas) */
  const IS = [
    { x: { f: (x) => 2 * x * (x * x + 1) ** 2, a: 0, b: 1, v: 7 / 3, xr: [-0.2, 1.3], yr: [-1, 17], gx: 0.25, lx: 0.5, gy: 2, ly: 4, H: 150, txt: "en x : 2x(x² + 1)² de 0 à 1", lab: "aire sous 2x(x² + 1)² entre 0 et 1" },
      u: { f: (u) => u * u, a: 1, b: 2, v: 7 / 3, xr: [-0.2, 2.6], yr: [-0.5, 5], gx: 0.5, lx: 1, gy: 1, ly: 2, H: 130, txt: "en u : u² de 1 à 2 (même aire)", lab: "aire sous u² entre 1 et 2" } },
    { x: { f: (x) => Math.sin(x) ** 2 * Math.cos(x), a: 0, b: Math.PI / 2, v: 1 / 3, xr: [-0.2, 1.8], yr: [-0.1, 0.5], gx: 0.25, lx: 0.5, gy: 0.1, ly: 0.2, H: 150, txt: "en x : sin²x · cos x de 0 à π/2", lab: "aire sous sin²x cos x entre 0 et π/2" },
      u: { f: (u) => u * u, a: 0, b: 1, v: 1 / 3, xr: [-0.2, 1.4], yr: [-0.1, 1.2], gx: 0.25, lx: 0.5, gy: 0.25, ly: 0.5, H: 130, txt: "en u : u² de 0 à 1 (même aire)", lab: "aire sous u² entre 0 et 1" } },
    { x: { f: (x) => x * (x * x + 1) ** 3, a: 0, b: 1, v: 15 / 8, xr: [-0.2, 1.3], yr: [-1, 9], gx: 0.25, lx: 0.5, gy: 1, ly: 2, H: 150, txt: "en x : x(x² + 1)³ de 0 à 1", lab: "aire sous x(x² + 1)³ entre 0 et 1" },
      u: { f: (u) => (u ** 3) / 2, a: 1, b: 2, v: 15 / 8, xr: [-0.2, 2.6], yr: [-0.5, 4.5], gx: 0.5, lx: 1, gy: 1, ly: 2, H: 130, txt: "en u : u³ ÷ 2 de 1 à 2 (même aire)", lab: "aire sous u³ sur 2 entre 1 et 2" } },
  ];
  const isFig = (s, v) => areaFig(IS[s].x, v) + areaFig(IS[s].u, v === null ? null : v);
  /* histogrammes (statdesc) */
  const bars = (B, w, cls = "f-fill2") => B.map(([c, n]) => [[[c - w / 2, 0], [c + w / 2, 0], [c + w / 2, n], [c - w / 2, n]], cls, 0.75]);

  Object.assign(ACTIVE, {
    intparties: {
      retiens: { regle: "\\(\\int_a^b u(x)v'(x)\\,dx = \\left[u(x)v(x)\\right]_a^b - \\int_a^b u'(x)v(x)\\,dx\\). On choisit pour \\(u\\) le facteur qui devient plus simple en dérivant (\\(x\\), \\(\\ln x\\)) et pour \\(v'\\) celui dont on connaît une primitive (\\(e^x\\), \\(\\cos x\\), \\(1\\)).",
        exemple: ["\\(\\int_0^1 x e^x\\,dx = \\left[xe^x\\right]_0^1 - \\int_0^1 e^x\\,dx = e - (e - 1) = 1\\)", "\\(\\int_0^{\\pi} x\\cos x\\,dx = \\left[x\\sin x\\right]_0^{\\pi} - \\int_0^{\\pi} \\sin x\\,dx = 0 - 2 = -2\\)", "\\(\\int_1^e \\ln x\\,dx = \\left[x\\ln x\\right]_1^e - \\int_1^e 1\\,dx = e - (e - 1) = 1\\) (\\(u = \\ln x\\), \\(v' = 1\\))"],
        piege: "C'est « \\([uv]\\) MOINS \\(\\int u'v\\) » ; on ne primitive jamais les deux facteurs séparément." },
      predict: { q: "Pour ∫ x·eˣ dx, on pose u = x et v' = eˣ (donc u' = 1 et v = eˣ). Pourquoi pas l'inverse ?", choices: ["Avec u = x, il reste ∫ 1·eˣ dx, facile", "C'est pareil", "On ne sait pas primitiver x"], good: 0,
        why: "Avec u = x, la dérivée u' = 1 fait disparaître le x : il reste ∫ eˣ dx. À l'inverse (u = eˣ, v' = x), il resterait ∫ eˣ · x²/2 dx, plus compliqué." },
      defis: ["Calcule \\(\\int_0^1 x e^x\\,dx\\) par parties.", "Calcule \\(\\int_0^{\\pi} x\\cos x\\,dx\\).", "Calcule \\(\\int_1^e \\ln x\\,dx\\) (pose \\(u = \\ln x\\), \\(v' = 1\\))."],
      play: hunt({ ask: true, label: "Valeur de l'intégrale", blank: (s) => areaFig(IP[s], null), show: (x, s) => areaFig(IP[s], x),
        miss: (x, s) => ["u = x, v' = eˣ : [x·eˣ] de 0 à 1 vaut e ; retranche ∫ eˣ dx de 0 à 1 = e − 1.", "u = x, v' = cos x : [x·sin x] de 0 à π vaut 0 ; retranche ∫ sin x dx de 0 à π = 2.", "u = ln x, v = x : [x·ln x] de 1 à e vaut e ; retranche ∫ 1 dx de 1 à e = e − 1."][s],
        wins: [W(1, "[x·eˣ] de 0 à 1 = e − 0 = e ; ∫ eˣ dx = e − 1 ; résultat e − (e − 1) = 1."), W(-2, "[x·sin x] de 0 à π = 0 ; ∫ sin x dx = [−cos x] = 2 ; résultat 0 − 2 = −2 : la partie sous l'axe l'emporte."), W(1, "[x·ln x] de 1 à e = e ; ∫ 1 dx = e − 1 ; résultat 1. Une primitive de ln x : x·ln x − x.")] }),
    },

    intsubst: {
      retiens: { regle: "Si l'intégrande contient \\(g(x)\\) et (à un facteur près) \\(g'(x)\\), on pose \\(u = g(x)\\), \\(du = g'(x)\\,dx\\) : \\(\\int_a^b f(g(x))g'(x)\\,dx = \\int_{g(a)}^{g(b)} f(u)\\,du\\). Les bornes changent avec la variable.",
        exemple: ["\\(\\int_0^1 2x(x^2 + 1)^2\\,dx = \\int_1^2 u^2\\,du = \\frac{7}{3}\\)", "\\(\\int_0^{\\frac{\\pi}{2}} \\sin^2 x\\cos x\\,dx = \\int_0^1 u^2\\,du = \\frac{1}{3}\\)", "\\(\\int_0^1 x(x^2 + 1)^3\\,dx = \\frac{1}{2}\\int_1^2 u^3\\,du = \\frac{15}{8}\\) (\\(x\\,dx = \\frac{du}{2}\\))"],
        piege: "On change les bornes, et on n'oublie pas le facteur de \\(dx\\) (\\(x\\,dx = \\frac{du}{2}\\))." },
      predict: { q: "Dans ∫ de 0 à 2 de 2x(x² + 1)² dx, on pose u = x² + 1. Quand x va de 0 à 2, u va de…", choices: ["1 à 5", "0 à 2", "0 à 4"], good: 0,
        why: "On calcule u aux bornes : u(0) = 0² + 1 = 1 et u(2) = 2² + 1 = 5. Les bornes changent avec la variable." },
      defis: ["Calcule \\(\\int_0^1 2x(x^2 + 1)^2\\,dx\\) avec \\(u = x^2 + 1\\) (fraction acceptée).", "Calcule \\(\\int_0^{\\frac{\\pi}{2}} \\sin^2 x\\cos x\\,dx\\) avec \\(u = \\sin x\\).", "Calcule \\(\\int_0^1 x(x^2 + 1)^3\\,dx\\) avec \\(u = x^2 + 1\\)."],
      play: hunt({ ask: true, label: "Valeur de l'intégrale", blank: (s) => isFig(s, null), show: (x, s) => isFig(s, x),
        miss: (x, s) => ["du = 2x dx ; u va de 1 à 2 : ∫ u² du = [u³/3] de 1 à 2.", "du = cos x dx ; u = sin x va de 0 à 1 : ∫ u² du.", "du = 2x dx, donc x dx = du/2 ; u va de 1 à 2 : ½ ∫ u³ du."][s],
        wins: [W(7 / 3, "du = 2x dx, u de 1 à 2 : ∫ u² du = (8 − 1) ÷ 3 = 7/3. Les deux surfaces ont la même aire."), W(1 / 3, "du = cos x dx, u = sin x de 0 à 1 : ∫ u² du = 1/3."), W(15 / 8, "x dx = du/2 : ½ ∫ u³ du de 1 à 2 = ½ · (16 − 1) ÷ 4 = 15/8. Sans le ½, on trouverait le double.")] }),
    },

    etudelnexp: {
      retiens: { regle: "\\((e^u)' = u'e^u\\) et \\((uv)' = u'v + uv'\\). Comme \\(e^x > 0\\), dans \\(f'(x) = (x - 1)e^x\\) le signe de \\(f'\\) est celui de \\(x - 1\\) : on en tire les variations et les extremums. Croissances comparées : \\(\\frac{x^n}{e^x} \\to 0\\) quand \\(x \\to +\\infty\\) (l'exponentielle l'emporte sur toute puissance).",
        exemple: ["\\(f(x) = (x - 2)e^x\\) : \\(f'(x) = (x - 1)e^x\\), minimum \\(f(1) = -e\\).", "\\(g(x) = x^2e^{-x}\\) : \\(g'(x) = x(2 - x)e^{-x}\\), maximum \\(g(2) = \\frac{4}{e^2}\\), et \\(g(x) \\to 0\\) en \\(+\\infty\\)."],
        piege: "\\(e^x\\) ne s'annule jamais : il ne donne aucun zéro de \\(f'\\) et ne change pas son signe." },
      predict: { q: "Quand x devient très grand, x³ ÷ eˣ…", choices: ["tend vers 0", "tend vers +∞", "tend vers 1"], good: 0,
        why: "L'exponentielle croît plus vite que toute puissance : pour x = 20, x³ = 8'000 mais e²⁰ ≈ 485 millions. Le quotient tend vers 0." },
      defis: ["f(x) = (x − 2)·eˣ. Déplace le point jusqu'au minimum (tangente horizontale).", "g(x) = x²·e⁻ˣ. Déplace le point jusqu'au maximum local."],
      play: slide({
        ctl: (s) => [s ? { k: "x", lab: "x", min: -0.5, max: 8, step: 0.5 } : { k: "x", lab: "x", min: -3, max: 2.5, step: 0.5 }],
        init: (s) => ({ x: s ? 4 : 2.5 }),
        fig: (st, s) => { const f = s ? (t) => t * t * Math.exp(-t) : (t) => (t - 2) * Math.exp(t), d = s ? (t) => t * (2 - t) * Math.exp(-t) : (t) => (t - 1) * Math.exp(t), x = st.x, m = d(x), w = s ? 0.9 : 0.5;
          return graph({ xr: s ? [-0.7, 8.3] : [-3.3, 2.8], yr: s ? [-0.15, 0.75] : [-3.2, 6.6], gx: s ? 1 : 0.5, lx: s ? 2 : 1, gy: s ? 0.1 : 1, ly: s ? 0.2 : 2, H: 210, fns: [{ f }], segs: [[x - w, f(x) - w * m, x + w, f(x) + w * m, Math.abs(m) < 1e-12 ? "f-accent" : "f-line", 2.6]], pts: [[x, f(x), "", "f-dot"]], lab: "courbe et tangente au point choisi" }); },
        out: (st, s) => { const x = st.x, m = s ? x * (2 - x) * Math.exp(-x) : (x - 1) * Math.exp(x), sgn = Math.abs(m) < 1e-12 ? 0 : Math.sign(m);
          return (s ? "g'(x) = 2x·e⁻ˣ − x²·e⁻ˣ = x(2 − x)·e⁻ˣ" : "f'(x) = 1·eˣ + (x − 2)·eˣ = (x − 1)·eˣ") + "<br>En x = " + nb(x) + " : " + (s ? "x(2 − x) = " + nb(x * (2 - x)) : "x − 1 = " + nb(x - 1)) + " et " + (s ? "e⁻ˣ" : "eˣ") + " > 0, donc la dérivée est <b>" + (sgn > 0 ? "positive : la courbe monte" : sgn < 0 ? "négative : la courbe descend" : "nulle : tangente horizontale") + "</b>"; },
        goal: [(st) => (st.x === 1 ? "f'(x) = (x − 1)·eˣ passe de − à + en 1 (eˣ > 0 ne change pas le signe) : minimum f(1) = −e ≈ −2,72." : ""),
          (st) => (st.x === 2 ? "g' = x(2 − x)·e⁻ˣ passe de + à − en 2 : maximum local g(2) = 4e⁻² ≈ 0,54. Plus loin, g descend vers 0." : "")],
        miss: (st, s) => (s && st.x === 0 ? "Tangente horizontale, mais g' passe de − à + : c'est un minimum (g(0) = 0). Cherche le maximum." : s ? "Le signe de g' est celui de x(2 − x)." : "Le signe de f' est celui de x − 1."),
        ask: [{ q: "h(x) = (x + 3)·eˣ. Tape l'abscisse de son minimum.", ans: -4, ok: "h'(x) = eˣ + (x + 3)·eˣ = (x + 4)·eˣ, nulle en x = −4, où elle passe de − à +.", no: "Dérive le produit, mets eˣ en évidence, puis cherche le zéro de l'autre facteur." },
          { q: "Vers quel nombre tend g(x) = x²·e⁻ˣ = x² ÷ eˣ quand x → +∞ ?", ans: 0, ok: "L'exponentielle l'emporte sur toute puissance : x² ÷ eˣ → 0. La courbe se rapproche de l'axe des x.", no: "Compare la croissance de x² et de eˣ (essaie x = 20)." }] }),
    },

    eqdiff: {
      retiens: { regle: "\\(y' = ky\\) a pour solutions \\(y = Ce^{kx}\\), et la condition initiale donne \\(C = y(0)\\). \\(y' = ay + b\\) : la solution constante (équilibre) est \\(y = -\\frac{b}{a}\\) (on pose \\(y' = 0\\)), et \\(y = Ce^{ax} - \\frac{b}{a}\\) ; si \\(a < 0\\), \\(y\\) tend vers l'équilibre.",
        exemple: ["\\(y' = ky\\), \\(y(0) = 3\\), \\(y(2) = 3e\\) : \\(e^{2k} = e\\), \\(k = \\frac{1}{2}\\).", "\\(T' = -0{,}5T + 10\\) : équilibre \\(T = 20\\) °C.", "\\(y' = -2y + 6\\), \\(y(0) = 1\\) : \\(y = 3 - 2e^{-2x}\\)."],
        piege: "Dans \\(y' = ay + b\\), \\(C = y(0) + \\frac{b}{a}\\), pas \\(y(0)\\) : on fixe \\(C\\) avec la condition initiale, sur la solution complète." },
      predict: { q: "Laquelle de ces fonctions vérifie y' = 2y ?", choices: ["y = e²ˣ", "y = x²", "y = 2eˣ"], good: 0,
        why: "(e²ˣ)' = 2e²ˣ = 2y. Pour y = x², y' = 2x ≠ 2x² ; pour y = 2eˣ, y' = 2eˣ = y, pas 2y." },
      defis: ["y' = ky avec y(0) = 3. Règle k pour que la solution y = 3e^{kx} passe par le point P(2 ; 3e) ≈ (2 ; 8,15).", "Refroidissement d'un café : T' = −0,5·T + b, avec T(0) = 90 °C. Règle b pour que la température se stabilise à 20 °C."],
      play: slide({
        ctl: (s) => [s ? { k: "b", lab: "b", min: 0, max: 20 } : { k: "k", lab: "k", min: -1, max: 1.5, step: 0.1 }],
        init: (s) => (s ? { b: 4 } : { k: 1 }),
        fig: (st, s) => {
          if (!s) { const k = st.k; return graph({ xr: [-0.5, 3.2], yr: [-0.5, 13], gx: 0.5, lx: 1, gy: 1, ly: 2, H: 210, fns: [{ f: (x) => 3 * Math.exp(k * x) }], pts: [[0, 3, "(0 ; 3)", "f-dot", "r"], [2, 3 * Math.E, "P", Math.abs(k - 0.5) < 1e-9 ? "f-dot" : "f-fill2", "r"]], lab: "solution de y' = ky passant par (0 ; 3)" }); }
          const e = 2 * st.b; return graph({ xr: [-0.3, 10], yr: [-4, 100], gx: 1, lx: 2, gy: 10, ly: 20, H: 210, pad: 14, fns: [{ f: (x) => e + (90 - e) * Math.exp(-0.5 * x) }], hl: [[e, "f-accent"]], pts: [[0, 90, "T(0) = 90", "f-dot", "r"]], lab: "température du café au cours du temps" }); },
        out: (st, s) => {
          if (!s) return "y = 3·e^(" + nb(st.k) + "x) : y(2) = 3·e^(" + nb(2 * st.k) + ") ≈ <b>" + nb(+(3 * Math.exp(2 * st.k)).toFixed(2)) + "</b> (on veut 3e ≈ 8,15)";
          return "Équilibre : T' = 0 ⇔ −0,5·T + " + nb(st.b) + " = 0 ⇔ T = <b>" + nb(2 * st.b) + " °C</b> (pointillé)<br>" + '<span class="small">T = ' + nb(2 * st.b) + " + " + nb(90 - 2 * st.b) + "·e^(−0,5t) : l'écart à l'équilibre diminue de moitié… puis encore</span>"; },
        goal: [(st) => (Math.abs(st.k - 0.5) < 1e-9 ? "k = 1/2, donc y(2) = 3·e^(2 · 0,5) = 3e. On a résolu 3e^(2k) = 3e, donc 2k = 1." : ""),
          (st) => (st.b === 10 ? "b = 10 : l'équilibre −b/a = 10 ÷ 0,5 = 20 °C. Comme a = −0,5 < 0, la température tend vers 20 °C." : "")],
        miss: (st, s) => (s ? "La température se stabilise là où T' = 0." : "Courbe trop " + (st.k > 0.5 ? "raide" : "plate") + " : on veut y(2) = 3e."),
        ask: [{ q: "y' = ky, y(0) = 5 et y(1) = 15. Tape k (au centième).", ans: Math.log(3), tol: 0.006, ok: "5e^k = 15, e^k = 3, k = ln 3 ≈ 1,10.", no: "y = 5e^(kx) ; écris y(1) = 15 et isole e^k." },
          { q: "\\(y' = -2y + 6\\), \\(y(0) = 1\\). La solution s'écrit \\(y = 3 + Ce^{-2x}\\). Tape C.", ans: -2, ok: "y(0) = 3 + C = 1, donc C = −2 (et non 1), d'où y = 3 − 2e^(−2x).", no: "Remplace x par 0 : y(0) = 3 + C." }] }),
    },

    statdesc: {
      retiens: { regle: "Série en classes : on remplace chaque classe par son centre, puis moyenne pondérée \\(\\bar x = \\frac{1}{N}\\sum n_i x_i\\). Écart-type (formule de König) : \\(\\sigma = \\sqrt{\\overline{x^2} - \\bar x^2}\\), où \\(\\overline{x^2}\\) est la moyenne des carrés. Si \\(y = ax + b\\) : \\(\\bar y = a\\bar x + b\\) et \\(\\sigma_y = |a|\\,\\sigma_x\\).",
        exemple: ["Classes \\([10 \\,;\\, 20[\\), \\([20 \\,;\\, 30[\\), \\([30 \\,;\\, 40[\\) d'effectifs 4, 6, 4 : \\(\\bar x = \\frac{15 \\cdot 4 + 25 \\cdot 6 + 35 \\cdot 4}{14} = 25\\).", "\\(\\bar x = 30\\), \\(\\overline{x^2} = 925\\) : \\(\\sigma = \\sqrt{925 - 900} = 5\\).", "\\(\\bar x = 20\\), \\(\\sigma = 5\\), \\(y = 3x + 40\\) : \\(\\bar y = 100\\), \\(\\sigma_y = 15\\)."],
        piege: "Ajouter \\(b\\) à toutes les valeurs déplace la moyenne mais ne change pas l'écart-type." },
      predict: { q: "Classes [10 ; 20[ (effectif 4) et [20 ; 30[ (effectif 6). Pour calculer la moyenne, on remplace chaque classe par…", choices: ["son centre (15 et 25)", "sa borne inférieure (10 et 20)", "son effectif"], good: 0,
        why: "Le centre représente au mieux les valeurs de la classe : x̄ = (15 · 4 + 25 · 6) ÷ 10 = 21." },
      defis: ["Classes [10 ; 20[, [20 ; 30[, [30 ; 40[ d'effectifs 4, 6 et n. Règle n pour que la moyenne vaille 25.", "Une série a x̄ = 20 et σ = 5. On transforme chaque valeur par y = ax + b. Règle a et b pour obtenir ȳ = 100 et σ_y = 15."],
      play: slide({
        ctl: (s) => (s ? [{ k: "a", lab: "a", min: 0.5, max: 4, step: 0.5 }, { k: "b", lab: "b", min: -20, max: 60, step: 10 }] : [{ k: "n", lab: "Effectif n de [30 ; 40[", min: 0, max: 12 }]),
        init: (s) => (s ? { a: 1, b: 0 } : { n: 1 }),
        fig: (st, s) => {
          if (!s) { const n = st.n, N = 10 + n, m = (60 + 150 + 35 * n) / N; return graph({ xr: [5, 45], yr: [-0.5, 13], gx: 5, lx: 10, gy: 1, ly: 2, H: 190, polys: bars([[15, 4], [25, 6], [35, n]], 10), vl: [[m, "f-accent"]], txt: [[m, 12.2, "x̄"]], lab: "histogramme des trois classes et moyenne" }); }
          const y1 = 15 * st.a + st.b, y2 = 25 * st.a + st.b, m = 20 * st.a + st.b, sd = 5 * st.a;
          return graph({ xr: [-20, 180], yr: [-0.5, 7], gx: 10, lx: 40, gy: 1, ly: 2, H: 170, polys: bars([[15, 5], [25, 5]], 3, "f-soft").concat(bars([[y1, 5], [y2, 5]], 3 * st.a)), vl: [[m, "f-accent"]], segs: [[m - sd, 6, m + sd, 6, "f-accent", 2]], txt: [[m, 6.4, "ȳ ± σ"]], lab: "série de départ (clair) et série transformée" }); },
        out: (st, s) => {
          if (s) return "ȳ = a·x̄ + b = " + nb(st.a) + " · 20 " + sg(st.b).trim() + " = <b>" + nb(20 * st.a + st.b) + "</b><br>σ_y = |a|·σ = " + nb(st.a) + " · 5 = <b>" + nb(5 * st.a) + "</b>";
          const n = st.n, N = 10 + n, m = (60 + 150 + 35 * n) / N, q = (225 * 4 + 625 * 6 + 1225 * n) / N, sd = Math.sqrt(q - m * m);
          return "x̄ = (15 · 4 + 25 · 6 + 35 · " + n + ") ÷ " + N + " = <b>" + nb(+m.toFixed(2)) + "</b><br>moyenne des carrés = (15² · 4 + 25² · 6 + 35² · " + n + ") ÷ " + N + " ≈ " + nb(+q.toFixed(2)) + "<br>σ = √(moyenne des carrés − x̄²) ≈ <b>" + nb(+sd.toFixed(2)) + "</b>"; },
        goal: [(st) => (st.n === 4 ? "n = 4 : (60 + 150 + 140) ÷ 14 = 350 ÷ 14 = 25. Avec 4 valeurs de chaque côté, la série est symétrique autour de 25." : ""),
          (st) => (st.a === 3 && st.b === 40 ? "a = 3 étire la série (σ × 3 = 15), b = 40 la décale sans changer la dispersion : 3 · 20 + 40 = 100." : "")],
        miss: (st, s) => (s ? (st.a === 3 ? "Bon écart-type : b décale toutes les valeurs sans changer la dispersion. Règle b pour la moyenne." : "σ_y = |a| · 5 : seul a change la dispersion.") : "On veut (210 + 35n) ÷ (10 + n) = 25."),
        ask: [{ q: "Une série a pour moyenne x̄ = 30 et pour moyenne des carrés 925. Tape son écart-type σ.", ans: 5, ok: "σ = √(925 − 30²) = √25 = 5.", no: "σ = √(moyenne des carrés − x̄²)." },
          { q: "Températures : x̄ = 20 °C, σ = 5 °C. En degrés Fahrenheit (y = 1,8x + 32), tape σ_y.", ans: 9, ok: "σ_y = 1,8 · 5 = 9 °F ; le + 32 ne change pas l'écart-type.", no: "σ_y = |a| · σ : le terme b n'intervient pas." }] }),
    },
  });
})();
