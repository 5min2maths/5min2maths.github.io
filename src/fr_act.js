// Leçons actives des notions françaises du 25.11 au soir (src/fr_fin.js) : symax, mediatrice, echelle6, proba6 (6e), empil
// (5e), compdiff (2nde), posrelc (1re), intmaj, suiteint (Tle). Vraies manipulations (curseurs) : on vérifie au lâcher.
// Chaque leçon a son « Retiens » limité à ce que les défis présentent (règle du 15.11). Paquet « fr » (build.py), chargé
// après active.js ; brique « slide » recopiée de act_col34b.js (fichier autonome).
(function () {
  if (typeof ACTIVE === "undefined") return;
  const nb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");
  const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;
  const T = (x, y, s, a = "middle", sz = 12, cls = "f-txt") => `<text x="${(+x).toFixed(1)}" y="${(+y).toFixed(1)}" class="${cls}" text-anchor="${a}" font-size="${sz}">${s}</text>`;
  const L = (x1, y1, x2, y2, cls = "f-line", w = 1.6, dash) => `<line x1="${(+x1).toFixed(1)}" y1="${(+y1).toFixed(1)}" x2="${(+x2).toFixed(1)}" y2="${(+y2).toFixed(1)}" class="${cls}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
  const Pg = (pts, cls, ex = "") => `<polygon points="${pts.map((p) => p.map((v) => (+v).toFixed(1)).join(",")).join(" ")}" class="${cls}"${ex}/>`;
  const dot = (x, y, cls = "f-dot", r = 5) => `<circle cx="${(+x).toFixed(1)}" cy="${(+y).toFixed(1)}" r="${r}" class="${cls}"/>`;
  const plain = (h) => `<div class="act-out">${h}</div>`;

  // ---------- repère 2D : o = { xr, yr, H, gx, gy, lx, ly, fns [{ f, cls, from, to }], segs, pts, polys, lab } ----------
  let UID = 0;
  const graph = (o) => {
    const W = 320, m = 8, H = o.H || 220, [x0, x1] = o.xr, [y0, y1] = o.yr, X = (v) => m + ((v - x0) / (x1 - x0)) * (W - 2 * m), Y = (v) => H - m - ((v - y0) / (y1 - y0)) * (H - 2 * m), id = "fra" + ++UID;
    let g = "", c = "";
    for (let v = Math.ceil(x0 / o.gx) * o.gx; v <= x1 + 1e-9; v += o.gx) g += L(X(v), Y(y0), X(v), Y(y1), "f-grid", 0.7);
    for (let v = Math.ceil(y0 / o.gy) * o.gy; v <= y1 + 1e-9; v += o.gy) g += L(X(x0), Y(v), X(x1), Y(v), "f-grid", 0.7);
    const ya = Math.min(Math.max(0, y0), y1), xa = Math.min(Math.max(0, x0), x1);
    g += L(X(x0), Y(ya), X(x1), Y(ya), "f-line", 1.2) + L(X(xa), Y(y0), X(xa), Y(y1), "f-line", 1.2);
    for (let v = Math.ceil(x0 / o.lx) * o.lx; v <= x1 + 1e-9; v += o.lx) if (Math.abs(v) > 1e-9) g += T(X(v), Math.min(Y(ya) + 13, H - 2), nb(+v.toFixed(4)), "middle", 10, "f-txt f-tick");
    for (let v = Math.ceil(y0 / o.ly) * o.ly; v <= y1 + 1e-9; v += o.ly) if (Math.abs(v) > 1e-9) g += T(Math.max(X(xa) - 4, 22), Y(v) + 3.5, nb(+v.toFixed(4)), "end", 10, "f-txt f-tick");
    for (const [P, cls, op] of o.polys || []) c += `<polygon points="${P.map(([x, y]) => X(x).toFixed(1) + "," + Y(Math.max(y0, Math.min(y1, y))).toFixed(1)).join(" ")}" class="${cls || "f-fill2"}" style="stroke:none;opacity:${op || 0.6}"/>`;
    for (const F of o.fns || []) { let d = "", pen = false; const a = Math.max(x0, F.from ?? x0), b = Math.min(x1, F.to ?? x1);
      for (let i = 0; i <= 240; i++) { const x = a + ((b - a) * i) / 240, y = F.f(x); if (!isFinite(y) || y < y0 - 2 * (y1 - y0) || y > y1 + 2 * (y1 - y0)) { pen = false; continue; } d += (pen ? "L" : "M") + X(x).toFixed(1) + "," + Y(y).toFixed(1) + " "; pen = true; }
      c += `<path d="${d}" class="${F.cls || "f-blue"}" fill="none" stroke-width="2.4"/>`; }
    for (const [xa2, ya2, xb, yb, cls, w, dash] of o.segs || []) c += L(X(xa2), Y(ya2), X(xb), Y(yb), cls || "f-line", w || 2, dash);
    let p = ""; for (const [x, y, lab, cls] of o.pts || []) { p += dot(X(x), Y(y), cls || "f-dot", 4.5); if (lab) p += T(X(x) + 8, Y(y) - 7, lab, "start", 12); }
    return svg(W, H, `<defs><clipPath id="${id}"><rect x="${m}" y="${m}" width="${W - 2 * m}" height="${H - 2 * m}"/></clipPath></defs>${g}<g clip-path="url(#${id})">${c}</g>${p}`, o.lab || "repère");
  };

  // ---------- brique « slide » (curseurs ; copie de act_col34b.js, sans question tapée) ----------
  const slide = (o) => (box, onWin) => {
    let step = 0, st = null, done = false;
    const start = () => {
      st = Object.assign({}, o.init(step));
      const cs = o.ctl(step);
      box.innerHTML = `<div class="s2c-fig"></div>` + cs.map((c) => `<label class="dyn-ctl"><span class="small">${c.lab} : <b class="s2c-v" data-k="${c.k}"></b></span><input type="range" data-k="${c.k}" min="${c.min}" max="${c.max}" step="${c.step || 1}" value="${st[c.k]}" aria-label="${c.lab}"></label>`).join("") +
        `<div class="act-out s2c-out" aria-live="polite"></div><div class="small muted">${(typeof o.note === "function" ? o.note(step) : o.note) || "Fais glisser " + (cs.length > 1 ? "les curseurs" : "le curseur") + " : on vérifie quand tu lâches."}</div>`;
      box.querySelectorAll('input[type="range"]').forEach((inp) => {
        inp.oninput = () => { if (done) return; st[inp.dataset.k] = +inp.value; refresh(); };
        inp.onchange = () => { if (done) return; st[inp.dataset.k] = +inp.value; refresh(); check(); };
      });
      refresh();
    };
    const refresh = () => {
      box.querySelector(".s2c-fig").innerHTML = o.fig(st, step);
      box.querySelectorAll(".s2c-v").forEach((b) => (b.textContent = o.fmt ? o.fmt(b.dataset.k, st[b.dataset.k], step) : nb(st[b.dataset.k])));
      box.querySelector(".s2c-out").innerHTML = o.out(st, step);
    };
    const check = () => {
      if (done) return;
      const mm = o.goal[step](st);
      if (!mm) { const t = o.miss && o.miss(st, step); if (t) $hint(box, t); else { const el = box.querySelector(".act-hint"); if (el) el.textContent = ""; } return; }
      onWin(step, mm); step++;
      if (step < o.goal.length) start(); else done = true;
    };
    start();
  };
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;

  // ---------- figures ----------
  /* quadrillage cols × rows, axe vertical x = v ou horizontal y = h, points [x, y, nom, cls] */
  const grid = (o) => { const s = 22, W = o.cols * s + 24, H = o.rows * s + 24, gx = (x) => 12 + x * s, gy = (y) => 12 + (o.rows - y) * s; let g = "";
    for (let i = 0; i <= o.cols; i++) g += L(gx(i), gy(0), gx(i), gy(o.rows), "f-grid", 0.9);
    for (let j = 0; j <= o.rows; j++) g += L(gx(0), gy(j), gx(o.cols), gy(j), "f-grid", 0.9);
    if (o.v !== undefined) g += L(gx(o.v), gy(0) + 6, gx(o.v), gy(o.rows) - 6, "f-accent", 2.4, "7 4") + T(gx(o.v) + 5, gy(o.rows) + 3, "(d)", "start", 12, "f-accent f-txt");
    if (o.h !== undefined) g += L(gx(0) - 6, gy(o.h), gx(o.cols) + 6, gy(o.h), "f-accent", 2.4, "7 4") + T(gx(o.cols) - 3, gy(o.h) - 5, "(d)", "end", 12, "f-accent f-txt");
    for (const [a, b] of o.segs || []) g += L(gx(a[0]), gy(a[1]), gx(b[0]), gy(b[1]), "f-line", 1.2, "3 3");
    for (const [x, y, nm, cls] of o.pts) g += dot(gx(x), gy(y), cls) + T(gx(x) + 7, gy(y) - 7, nm, "start", 13);
    return svg(W, H, g, o.lab || "quadrillage"); };
  /* empilement (perspective cavalière) : h[x][y], x de gauche à droite, y de l'avant vers l'arrière */
  const cubes = (h) => { const nx = h.length, ny = h[0].length, s = 28, k = 0.42 * s, P = (x, y, z) => [x * s + y * k, -z * s - y * k], Hm = 4;
    const [a] = P(0, 0, 0), [b] = P(nx, ny, 0), top = P(0, ny, Hm)[1], ox = (320 - (b - a)) / 2 - a, oy = 10 - top, Q = (x, y, z) => { const [u, v] = P(x, y, z); return [ox + u, oy + v]; };
    let g = "";
    for (let y = ny - 1; y >= 0; y--) for (let x = 0; x < nx; x++) for (let z = 0; z < h[x][y]; z++) {
      g += Pg([Q(x, y, z), Q(x + 1, y, z), Q(x + 1, y, z + 1), Q(x, y, z + 1)], "f-shape", ' stroke-width="1.3"');
      g += Pg([Q(x, y, z + 1), Q(x + 1, y, z + 1), Q(x + 1, y + 1, z + 1), Q(x, y + 1, z + 1)], "f-shape2", ' stroke-width="1.3"');
      g += Pg([Q(x + 1, y, z), Q(x + 1, y + 1, z), Q(x + 1, y + 1, z + 1), Q(x + 1, y, z + 1)], "f-shape", ' style="fill:var(--blue);fill-opacity:.5" stroke-width="1.3"'); }
    return svg(320, Math.round(oy + 6), g, "empilement de cubes"); };
  const faceView = (f) => { const s = 20; let g = ""; f.forEach((z, x) => { for (let k = 0; k < z; k++) g += `<rect x="${110 + x * s}" y="${8 + (3 - k) * s}" width="${s}" height="${s}" class="f-shape2"/>`; }); return svg(320, 100, g + T(100, 70, "vue de face", "end", 11), "vue de face à obtenir"); };

  Object.assign(ACTIVE, {
    // =========================== 6e ===========================
    symax: {
      retiens: { regle: "Le symétrique \\(A'\\) de \\(A\\) par rapport à \\((d)\\) est sur la perpendiculaire à \\((d)\\) passant par \\(A\\), à la même distance de \\((d)\\), de l'autre côté : \\((d)\\) est la médiatrice de \\([AA']\\).",
        exemple: ["Axe vertical : \\(A\\) à 3 carreaux à gauche de \\((d)\\), \\(A'\\) à 3 carreaux à droite, sur la même ligne.", "Axe horizontal : \\(A\\) à 2 carreaux au-dessus, \\(A'\\) à 2 carreaux au-dessous, sur la même colonne."],
        piege: "On ne fait pas glisser le point le long de l'axe : \\(A'\\) reste sur la perpendiculaire à \\((d)\\)." },
      predict: { q: "A est à 3 carreaux à gauche d'un axe vertical (d). Où est son symétrique A' ?", choices: ["3 carreaux à droite de (d), même ligne", "6 carreaux à droite de (d)", "3 carreaux au-dessous de A"], good: 0,
        why: "On plie le long de (d) : A vient se poser à la même distance de l'axe, de l'autre côté, sur la même ligne." },
      defis: ["Place A', le symétrique de A par rapport à l'axe vertical (d).", "Même chose avec un axe horizontal."],
      play: slide({
        ctl: () => [{ k: "x", lab: "Colonne de A'", min: 0, max: 12 }, { k: "y", lab: "Ligne de A'", min: 0, max: 8 }],
        init: (s) => (s ? { x: 4, y: 4 } : { x: 6, y: 2 }),
        fig: (st, s) => grid(s ? { cols: 12, rows: 8, h: 3, pts: [[8, 6, "A"], [st.x, st.y, "A'", "f-fill"]], segs: [[[8, 6], [st.x, st.y]]], lab: "point A, axe horizontal et point A'" } : { cols: 12, rows: 8, v: 5, pts: [[2, 5, "A"], [st.x, st.y, "A'", "f-fill"]], segs: [[[2, 5], [st.x, st.y]]], lab: "point A, axe vertical et point A'" }),
        out: (st, s) => s ? "A est à <b>3</b> carreaux au-dessus de (d). A' est à " + nb(Math.abs(st.y - 3)) + " carreau(x) " + (st.y >= 3 ? "au-dessus" : "au-dessous") + (st.x === 8 ? ", sur la même colonne." : ", pas sur la même colonne que A.")
          : "A est à <b>3</b> carreaux à gauche de (d). A' est à " + nb(Math.abs(st.x - 5)) + " carreau(x) " + (st.x >= 5 ? "à droite" : "à gauche") + (st.y === 5 ? ", sur la même ligne." : ", pas sur la même ligne que A."),
        goal: [(st) => (st.x === 8 && st.y === 5 ? "A' est à 3 carreaux à droite de (d), sur la même ligne que A : (d) coupe [AA'] en son milieu, à angle droit." : ""),
          (st) => (st.x === 8 && st.y === 0 ? "A' est à 3 carreaux au-dessous de (d), sur la même colonne que A." : "")],
        miss: (st, s) => (s ? (st.x !== 8 ? "A' doit rester sur la colonne de A (perpendiculaire à l'axe)." : "Même distance à l'axe que A, de l'autre côté.") : (st.y !== 5 ? "A' doit rester sur la ligne de A (perpendiculaire à l'axe)." : "Même distance à l'axe que A, de l'autre côté.")),
      }),
    },

    mediatrice: {
      retiens: { regle: "Un point \\(M\\) est sur la médiatrice de \\([AB]\\) exactement quand \\(MA = MB\\). La médiatrice est la perpendiculaire à \\([AB]\\) en son milieu.",
        exemple: ["\\(A\\) en 2, \\(B\\) en 8 : les points à égale distance de \\(A\\) et de \\(B\\) sont sur la droite verticale qui passe par 5.", "\\(A\\) en 1, \\(B\\) en 7 : médiatrice en 4."],
        piege: "Le point doit être à égale distance des deux extrémités, à n'importe quelle hauteur : la médiatrice est une droite, pas un seul point." },
      predict: { q: "A est en 2 et B en 8 sur une droite graduée. Les points à égale distance de A et de B sont…", choices: ["sur la perpendiculaire en 5", "seulement le point 5", "sur la droite (AB)"], good: 0,
        why: "Tous les points de la perpendiculaire à [AB] en son milieu (5) sont à égale distance de A et de B : c'est la médiatrice." },
      defis: ["Déplace M (à 4 unités au-dessus de l'axe) pour que MA = MB.", "Même chose avec A en 1, B en 7 et M à 3 unités au-dessus."],
      play: slide({
        ctl: () => [{ k: "x", lab: "Abscisse de M", min: 0, max: 10, step: 0.5 }],
        init: (s) => ({ x: s ? 6 : 2 }),
        fig: (st, s) => { const A = s ? 1 : 2, B = s ? 7 : 8, h = s ? 3 : 4; return graph({ xr: [-0.5, 10.5], yr: [-1, 5], gx: 1, gy: 1, lx: 1, ly: 1, H: 200, segs: [[A, 0, B, 0, "f-line", 3], [A, 0, st.x, h, "f-blue", 2], [B, 0, st.x, h, "f-blue", 2]], pts: [[A, 0, "A"], [B, 0, "B"], [st.x, h, "M", "f-fill"]], lab: "segment AB et point M" }); },
        out: (st, s) => { const A = s ? 1 : 2, B = s ? 7 : 8, h = s ? 3 : 4, ma = Math.hypot(st.x - A, h), mb = Math.hypot(st.x - B, h); return "MA ≈ <b>" + nb(+ma.toFixed(2)) + "</b> · MB ≈ <b>" + nb(+mb.toFixed(2)) + "</b>" + (near(ma, mb) ? " : égales" : ""); },
        goal: [(st) => (st.x === 5 ? "MA = MB = √(3² + 4²) = 5 : M est sur la perpendiculaire à [AB] en son milieu (5), la médiatrice." : ""),
          (st) => (st.x === 4 ? "M est au-dessus du milieu 4 de [AB] : MA = MB. Quelle que soit la hauteur, la médiatrice passe par le milieu." : "")],
        miss: (st) => "Rapproche M du point de l'axe qui est à mi-chemin entre A et B.",
      }),
    },

    echelle6: {
      retiens: { regle: "Échelle \\(\\frac{1}{n}\\) : 1 cm sur le plan représente \\(n\\) cm en réalité. Longueur sur le plan = longueur réelle ÷ \\(n\\), dans la même unité.",
        exemple: ["Mur de 6 m = 600 cm, dessiné par 3 cm : \\(600 \\div 3 = 200\\), échelle \\(\\frac{1}{200}\\).", "Carte au \\(\\frac{1}{25\\,000}\\) : 2 km = 200 000 cm, sur la carte \\(200\\,000 \\div 25\\,000 = 8\\) cm."],
        piege: "Convertis avant de diviser : 6 m ÷ 3 cm ne donne pas l'échelle, 600 cm ÷ 3 cm oui." },
      predict: { q: "Sur un plan au 1/100, un mur de 4 m mesure…", choices: ["4 cm", "40 cm", "400 cm"], good: 0,
        why: "4 m = 400 cm ; au 1/100, on divise par 100 : 4 cm sur le plan." },
      defis: ["Choisis l'échelle pour qu'un mur de 6 m mesure 3 cm sur le plan.", "Carte au 1/25 000 : règle la longueur sur la carte pour représenter 2 km."],
      play: slide({
        ctl: (s) => [s ? { k: "c", lab: "Longueur sur la carte (cm)", min: 1, max: 12, step: 0.5 } : { k: "n", lab: "Échelle 1/n, n", min: 50, max: 500, step: 50 }],
        init: (s) => (s ? { c: 3 } : { n: 100 }),
        fig: (st, s) => { const cmv = s ? st.c : 600 / st.n, px = Math.min(300, cmv * 25); return svg(320, 70, L(10, 30, 10 + px, 30, "f-accent", 5) + L(10, 22, 10, 38) + L(10 + px, 22, 10 + px, 38) + T(10, 58, "0", "middle", 11) + T(10 + Math.min(px, 290), 58, nb(+cmv.toFixed(2)) + " cm", "middle", 11), "segment dessiné sur le plan"); },
        out: (st, s) => s ? nb(st.c) + " cm × 25 000 = " + nb(st.c * 25000) + " cm = <b>" + nb(st.c * 0.25) + " km</b> en réalité" : "6 m = 600 cm ; au 1/" + st.n + " : 600 ÷ " + st.n + " = <b>" + nb(+(600 / st.n).toFixed(2)) + " cm</b> sur le plan",
        goal: [(st) => (st.n === 200 ? "Au 1/200 : 600 cm ÷ 200 = 3 cm. On divise la longueur réelle par la longueur du plan, en cm : 600 ÷ 3 = 200." : ""), (st) => (st.c === 8 ? "8 cm × 25 000 = 200 000 cm = 2 km (1 km = 100 000 cm)." : "")],
        miss: (st, s) => (s ? "2 km = 200 000 cm ; divise par 25 000." : "Plus n est grand, plus le dessin est petit."),
      }),
    },

    proba6: {
      retiens: { regle: "Quand toutes les issues ont la même chance : \\(P = \\frac{\\text{issues favorables}}{\\text{issues possibles}}\\). Ajouter des boules rouges change les deux nombres.",
        exemple: ["2 rouges et 6 bleues : \\(P(\\text{rouge}) = \\frac{2}{8} = \\frac{1}{4}\\).", "9 rouges et 6 bleues : \\(P(\\text{rouge}) = \\frac{9}{15} = 0{,}6\\)."],
        piege: "On divise par le nombre total de boules, pas par le nombre de boules bleues." },
      predict: { q: "Un sac contient 2 boules rouges et 6 bleues. La probabilité de tirer une rouge est…", choices: ["1/4", "1/3", "2/6"], good: 0,
        why: "8 boules en tout, dont 2 rouges : 2/8 = 1/4. (2/6 compare les rouges aux bleues, pas au total.)" },
      defis: ["Le sac contient 6 boules bleues. Mets des rouges pour que P(rouge) = 1/4.", "Maintenant pour que P(rouge) = 0,6."],
      play: slide({
        ctl: () => [{ k: "r", lab: "Boules rouges", min: 0, max: 12 }],
        init: (s) => ({ r: s ? 3 : 0 }),
        fig: (st) => FIG.urn({ rouges: st.r, bleues: 6 }),
        out: (st) => "P(rouge) = " + st.r + "/" + (st.r + 6) + " ≈ <b>" + nb(+(st.r / (st.r + 6)).toFixed(3)) + "</b>",
        goal: [(st) => (st.r === 2 ? "2 rouges sur 8 boules : 2/8 = 1/4." : ""), (st) => (st.r === 9 ? "9 rouges sur 15 boules : 9/15 = 3/5 = 0,6." : "")],
        miss: (st, s) => (s ? "0,6 = 3/5 : il faut 3 rouges pour 2 bleues." : "1/4 : une boule sur quatre est rouge."),
      }),
    },

    // =========================== 5e ===========================
    empil: {
      retiens: { regle: "Vue de face : dans chaque colonne, autant de carrés que la pile la plus haute. Nombre de cubes : on additionne les hauteurs de toutes les piles.",
        exemple: ["Piles de derrière 3, 1, 2 devant des piles de 1 : vue de face 3, 1, 2.", "Avec 3 cubes devant et 9 derrière : 12 cubes, quelle que soit la façon de répartir les 9."],
        piege: "Sur la vue de face, les piles de devant et de derrière ne s'additionnent pas : on voit la plus haute." },
      predict: { q: "Une pile de 3 cubes est derrière une pile de 1 cube. Sur la vue de face, cette colonne montre…", choices: ["3 carrés", "4 carrés", "1 carré"], good: 0,
        why: "De face, on voit la pile la plus haute (3) ; la pile de devant cache le bas de celle de derrière." },
      defis: ["Règle les piles de derrière pour obtenir la vue de face dessinée (3, 1, 2).", "Obtiens un empilement de 12 cubes en tout."],
      play: slide({
        ctl: () => [{ k: "a", lab: "Pile de gauche (derrière)", min: 1, max: 4 }, { k: "b", lab: "Pile du milieu (derrière)", min: 1, max: 4 }, { k: "c", lab: "Pile de droite (derrière)", min: 1, max: 4 }],
        init: (s) => (s ? { a: 2, b: 2, c: 2 } : { a: 1, b: 2, c: 4 }),
        fig: (st, s) => cubes([[1, st.a], [1, st.b], [1, st.c]]) + (s ? "" : faceView([3, 1, 2])),
        out: (st) => "Vue de face : " + [st.a, st.b, st.c].join(", ") + " · nombre de cubes : 3 + " + st.a + " + " + st.b + " + " + st.c + " = <b>" + (3 + st.a + st.b + st.c) + "</b>",
        goal: [(st) => (st.a === 3 && st.b === 1 && st.c === 2 ? "Les piles de derrière (3, 1, 2) dépassent celles de devant (1) : la vue de face montre 3, 1 et 2 carrés." : ""),
          (st) => (st.a + st.b + st.c === 9 ? "3 cubes devant + " + (st.a + st.b + st.c) + " derrière = 12 cubes (on compte aussi les cubes cachés en bas)." : "")],
        miss: (st, s) => (s ? "Compte aussi les 3 cubes de la rangée de devant." : "Chaque colonne de la vue de face montre la pile la plus haute."),
        note: (s) => "Fais glisser les curseurs : on vérifie quand tu lâches.",
      }),
    },

    // =========================== 2nde ===========================
    compdiff: {
      retiens: { regle: "Pour comparer \\(A\\) et \\(B\\), on étudie le signe de \\(A - B\\). Si \\(A\\) et \\(B\\) sont positifs, on peut comparer \\(\\frac{A}{B}\\) à 1.",
        exemple: ["\\(A = x^2 + 9\\), \\(B = 6x\\) : \\(A - B = (x - 3)^2 \\geqslant 0\\), égal à 0 seulement pour \\(x = 3\\).", "\\(\\frac{2^{10}}{1\\,000} = 1{,}024 > 1\\) : \\(2^{10} > 1\\,000\\), alors que \\(2^9 = 512\\)."],
        piege: "Un quotient se compare à 1 (pas à 0), et seulement pour des nombres positifs." },
      predict: { q: "Pour tout x, comparer x² + 9 et 6x : laquelle est vraie ?", choices: ["x² + 9 ≥ 6x toujours", "x² + 9 < 6x pour x grand", "Ça dépend de x"], good: 0,
        why: "x² + 9 − 6x = (x − 3)², un carré : jamais négatif. Donc x² + 9 ≥ 6x pour tout x." },
      defis: ["A = x² + 9 et B = 6x. Trouve x qui rend A − B le plus petit possible.", "Trouve le plus petit entier n tel que 2ⁿ ÷ 1 000 > 1."],
      play: slide({
        ctl: (s) => [s ? { k: "n", lab: "n", min: 1, max: 14 } : { k: "x", lab: "x", min: -2, max: 8, step: 0.5 }],
        init: (s) => (s ? { n: 4 } : { x: 0 }),
        fig: (st, s) => s ? graph({ xr: [0, 15], yr: [0, 2.2], gx: 1, gy: 0.2, lx: 2, ly: 0.4, H: 170, segs: [[0, 1, 15, 1, "f-accent", 2, "6 4"], [st.n, 0, st.n, Math.min(2.2, 2 ** st.n / 1000), "f-blue", 6]], lab: "quotient 2 puissance n sur 1000" })
          : graph({ xr: [-2.5, 8.5], yr: [-5, 90], gx: 1, gy: 10, lx: 2, ly: 20, H: 200, fns: [{ f: (x) => x * x + 9, cls: "f-blue" }, { f: (x) => 6 * x, cls: "f-accent" }], segs: [[st.x, 6 * st.x, st.x, st.x * st.x + 9, "f-line", 3]], lab: "courbes de A et B" }),
        out: (st, s) => s ? "2^" + st.n + " = " + (2 ** st.n) + " ; quotient 2^" + st.n + " ÷ 1 000 = <b>" + nb(2 ** st.n / 1000) + "</b>" + (2 ** st.n > 1000 ? " > 1" : " < 1") : "A = " + nb(st.x * st.x + 9) + " · B = " + nb(6 * st.x) + " · A − B = <b>" + nb(st.x * st.x + 9 - 6 * st.x) + "</b>",
        goal: [(st) => (st.x === 3 ? "A − B = (x − 3)² vaut 0 en x = 3 et reste positif ailleurs : A ≥ B pour tout x." : ""), (st) => (st.n === 10 ? "2¹⁰ = 1 024 : le quotient 1,024 dépasse 1 (pour n = 9, 0,512 < 1)." : "")],
        miss: (st, s) => (s ? (2 ** st.n > 1000 ? "Le quotient dépasse 1, mais cherche le plus petit n." : "Le quotient est encore inférieur à 1.") : "Le segment mesure A − B : rends-le le plus court possible."),
      }),
    },

    // =========================== 1re ===========================
    posrelc: {
      retiens: { regle: "On étudie le signe de \\(d(x) = f(x) - g(x)\\) : \\(d(x) > 0\\), \\(C_f\\) au-dessus ; \\(d(x) = 0\\), point commun ; \\(d(x) < 0\\), au-dessous.",
        exemple: ["\\(f(x) = x^2\\), \\(g(x) = x + 2\\) : \\(d(x) = (x - 2)(x + 1)\\), points communs en \\(-1\\) et 2.", "Entre \\(-1\\) et 2, \\(d(x) < 0\\) : la parabole est sous la droite ; l'écart est le plus grand en \\(x = \\frac{1}{2}\\)."],
        piege: "On compare \\(f(x)\\) et \\(g(x)\\) pour un même \\(x\\) : c'est le signe de la différence qui compte." },
      predict: { q: "f(x) = x² et g(x) = x + 2. En x = 0, la parabole est…", choices: ["sous la droite", "sur la droite", "au-dessus de la droite"], good: 0,
        why: "f(0) = 0 et g(0) = 2 : d(0) = −2 < 0, la parabole est au-dessous." },
      defis: ["Déplace x jusqu'au point commun d'abscisse positive.", "Trouve x où la parabole est le plus loin sous la droite."],
      play: slide({
        ctl: () => [{ k: "x", lab: "x", min: -3, max: 4, step: 0.5 }],
        init: (s) => ({ x: s ? -2 : 0 }),
        fig: (st) => graph({ xr: [-3.3, 4.3], yr: [-2, 10], gx: 1, gy: 1, lx: 1, ly: 2, H: 220, fns: [{ f: (x) => x * x, cls: "f-blue" }, { f: (x) => x + 2, cls: "f-accent" }], segs: [[st.x, st.x * st.x, st.x, st.x + 2, "f-line", 3]], pts: [[st.x, st.x * st.x, "", "f-dot"]], lab: "parabole et droite" }),
        out: (st) => { const d = st.x * st.x - st.x - 2; return "f(x) = " + nb(st.x * st.x) + " · g(x) = " + nb(st.x + 2) + " · d(x) = f(x) − g(x) = <b>" + nb(d) + "</b> : " + (d > 0 ? "C_f au-dessus" : d < 0 ? "C_f au-dessous" : "point commun"); },
        goal: [(st) => (st.x === 2 ? "d(2) = 4 − 4 = 0 : point commun. d(x) = (x − 2)(x + 1) s'annule aussi en −1." : ""), (st) => (st.x === 0.5 ? "d(0,5) = −2,25 : c'est le minimum de d (sommet en x = 1/2), le plus grand écart sous la droite." : "")],
        miss: (st, s) => (s ? "Cherche le x où d(x) est le plus négatif." : "Le segment doit disparaître (d(x) = 0), avec x > 0."),
      }),
    },

    // =========================== Tle ===========================
    intmaj: {
      retiens: { regle: "Pour une fonction décroissante sur \\([a \\,;\\, b]\\), les rectangles de hauteur la valeur à droite sont sous la courbe, ceux de hauteur la valeur à gauche au-dessus : ils encadrent l'intégrale. Avec \\(n\\) rectangles, l'écart vaut \\(\\frac{(b - a)(f(a) - f(b))}{n}\\).",
        exemple: ["\\(\\int_1^2 \\frac{dx}{x}\\) avec 5 rectangles : écart \\(\\frac{1 \\times 0{,}5}{5} = 0{,}1\\).", "Avec 9 rectangles : écart \\(\\frac{0{,}5}{9} \\approx 0{,}056\\)."],
        piege: "Plus on prend de rectangles, plus l'encadrement est précis : l'écart est divisé par \\(n\\)." },
      predict: { q: "On encadre ∫₁² dx/x avec des rectangles. Si on double leur nombre, l'écart entre le minorant et le majorant…", choices: ["est divisé par 2", "ne change pas", "est divisé par 4"], good: 0,
        why: "Pour une fonction monotone, l'écart vaut (b − a)(f(a) − f(b)) ÷ n : il est divisé par 2 quand n double." },
      defis: ["Choisis le plus petit nombre de rectangles pour un écart au plus égal à 0,1.", "Et pour un écart inférieur à 0,06."],
      play: slide({
        ctl: () => [{ k: "n", lab: "Nombre de rectangles", min: 1, max: 12 }],
        init: (s) => ({ n: s ? 2 : 1 }),
        fig: (st) => { const n = st.n, h = 1 / n, polys = []; for (let k = 0; k < n; k++) { const a = 1 + k * h, b = a + h; polys.push([[[a, 0], [b, 0], [b, 1 / a], [a, 1 / a]], "f-soft", 0.8], [[[a, 0], [b, 0], [b, 1 / b], [a, 1 / b]], "f-fill2", 0.9]); }
          return graph({ xr: [0.8, 2.2], yr: [-0.1, 1.15], gx: 0.1, gy: 0.1, lx: 0.2, ly: 0.2, H: 210, polys, fns: [{ f: (x) => 1 / x, from: 0.85, cls: "f-blue" }], lab: "rectangles sous et sur la courbe de 1/x" }); },
        out: (st) => { const n = st.n; let lo = 0, up = 0; for (let k = 0; k < n; k++) { up += 1 / (n + k); lo += 1 / (n + k + 1); } return "minorant ≈ " + nb(+lo.toFixed(4)) + " · majorant ≈ " + nb(+up.toFixed(4)) + " · écart = 0,5 ÷ " + n + " ≈ <b>" + nb(+(0.5 / n).toFixed(4)) + "</b>"; },
        goal: [(st) => (st.n === 5 ? "Écart 0,5 ÷ 5 = 0,1 : 0,646 ≤ ln 2 ≤ 0,746." : ""), (st) => (st.n === 9 ? "Écart 0,5 ÷ 9 ≈ 0,056 < 0,06 (avec 8 : 0,0625, trop grand)." : "")],
        miss: (st, s) => (0.5 / st.n <= (s ? 0.06 : 0.1) ? "L'écart convient, mais cherche le plus petit nombre de rectangles." : "Écart encore trop grand : ajoute des rectangles."),
      }),
    },

    suiteint: {
      retiens: { regle: "\\(I_n = \\int_0^1 x^n\\,dx = \\frac{1}{n + 1}\\). Sur \\([0 \\,;\\, 1]\\), \\(x^{n+1} \\leqslant x^n\\) : la suite décroît, et tend vers 0.",
        exemple: ["\\(I_4 = \\frac{1}{5} = 0{,}2\\).", "\\(I_n < 0{,}1 \\iff n + 1 > 10 \\iff n \\geqslant 10\\)."],
        piege: "\\(I_9 = \\frac{1}{10} = 0{,}1\\) n'est pas strictement inférieur à 0,1." },
      predict: { q: "Sur [0 ; 1], quand n augmente, l'aire sous la courbe de xⁿ…", choices: ["diminue", "augmente", "reste la même"], good: 0,
        why: "Pour 0 ≤ x ≤ 1, x^(n+1) = x · xⁿ ≤ xⁿ : la courbe descend, l'aire diminue (elle vaut 1/(n + 1))." },
      defis: ["Trouve n pour que l'aire Iₙ vaille 0,2.", "Trouve le plus petit n tel que Iₙ < 0,1."],
      play: slide({
        ctl: () => [{ k: "n", lab: "n", min: 0, max: 14 }],
        init: (s) => ({ n: s ? 3 : 1 }),
        fig: (st) => { const n = st.n, P = [[0, 0]]; for (let i = 0; i <= 60; i++) P.push([i / 60, (i / 60) ** n]); P.push([1, 0]);
          return graph({ xr: [-0.1, 1.15], yr: [-0.1, 1.15], gx: 0.1, gy: 0.1, lx: 0.2, ly: 0.2, H: 230, polys: [[P, "f-fill2", 0.8]], fns: [{ f: (x) => x ** n, from: 0, to: 1, cls: "f-blue" }], lab: "aire sous x puissance n entre 0 et 1" }); },
        out: (st) => "Iₙ = 1/(n + 1) = 1/" + (st.n + 1) + " ≈ <b>" + nb(+(1 / (st.n + 1)).toFixed(4)) + "</b>",
        goal: [(st) => (st.n === 4 ? "I₄ = 1/5 = 0,2." : ""), (st) => (st.n === 10 ? "I₁₀ = 1/11 ≈ 0,091 < 0,1 ; I₉ = 0,1 exactement, pas strictement inférieur." : "")],
        miss: (st, s) => (s ? (1 / (st.n + 1) < 0.1 ? "C'est inférieur à 0,1, mais cherche le plus petit n." : "Iₙ est encore au moins égal à 0,1.") : "Iₙ = 1/(n + 1) : pour 0,2 = 1/5, que vaut n + 1 ?"),
      }),
    },
  });
})();
