// Figures SVG générées avec les valeurs de chaque question (aucune image externe).
// Couleurs par classes CSS (.f-line, .f-fill, .f-accent, .f-soft, .f-txt) pour suivre le thème clair / sombre.

const FIG = (() => {
  const svg = (w, h, body, label) =>
    '<svg class="fig" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + (label || "figure") + '" xmlns="http://www.w3.org/2000/svg">' + body + "</svg>";
  const t = (x, y, s, cls = "f-txt", anchor = "middle", size = 14) =>
    '<text x="' + x + '" y="' + y + '" class="' + cls + '" text-anchor="' + anchor + '" font-size="' + size + '">' + s + "</text>";
  const L = (x1, y1, x2, y2, cls = "f-line", extra = "") => '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="' + cls + '" ' + extra + "/>";
  const P = (pts, cls = "f-line") => '<polygon points="' + pts.map((p) => p.join(",")).join(" ") + '" class="' + cls + '"/>';
  const fmt = (v) => String(+(+v).toFixed(3)).replace(".", ",");

  // Droite graduée avec flèches de saut (nombres relatifs).
  function numberLine(start, jumps) {
    const vals = [start];
    jumps.forEach((j) => vals.push(vals[vals.length - 1] + j));
    let lo = Math.min(...vals, 0) - 1, hi = Math.max(...vals, 0) + 1;
    if (hi - lo > 30) { lo = Math.min(...vals) - 1; hi = Math.max(...vals) + 1; }
    const W = 340, X = (v) => 16 + ((v - lo) / (hi - lo)) * (W - 32);
    let b = L(8, 70, W - 8, 70, "f-line", 'marker-end="url(#arr)"');
    const step = hi - lo > 20 ? 5 : hi - lo > 10 ? 2 : 1;
    for (let v = Math.ceil(lo); v <= hi; v++) {
      b += L(X(v), 64, X(v), 76, v === 0 ? "f-accent" : "f-line");
      if (v % step === 0) b += t(X(v), 94, v, v === 0 ? "f-accent f-txt" : "f-txt", "middle", 12);
    }
    vals.slice(0, -1).forEach((v, i) => {
      const a = X(v), c = X(vals[i + 1]), mid = (a + c) / 2, up = 62 - 14 * (i % 2);
      b += '<path d="M' + a + ",62 Q" + mid + "," + (up - 28) + " " + c + ',62" class="f-jump" marker-end="url(#arr2)"/>';
      b += t(mid, up - 22, (jumps[i] > 0 ? "+" : "") + jumps[i], "f-accent f-txt", "middle", 12);
    });
    b += '<circle cx="' + X(start) + '" cy="70" r="5" class="f-dot"/>';
    return svg(W, 104, defs() + b, "droite graduée");
  }
  const defs = () => '<defs><marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="f-head"/></marker><marker id="arr2" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="f-headacc"/></marker></defs>';

  // Barres de fractions : chaque fraction est une barre découpée en parts égales.
  function fractionBars(list) {
    const W = 340, H = 30 + list.length * 40;
    let b = "";
    list.forEach(([n, d], i) => {
      const y = 14 + i * 40, w = 250, cw = w / d;
      for (let k = 0; k < d; k++) b += '<rect x="' + (16 + k * cw) + '" y="' + y + '" width="' + cw + '" height="26" class="' + (k < n ? "f-fill" : "f-soft") + '"/>';
      b += t(16 + w + 36, y + 19, n + "/" + d, "f-txt", "middle", 15);
    });
    return svg(W, H, b, "barres de fractions");
  }

  // Jauge de pourcentage.
  function percentBar(p, total, unit = "") {
    const W = 340, w = 300 * p / 100;
    let b = '<rect x="16" y="24" width="300" height="28" rx="6" class="f-soft"/>' + '<rect x="16" y="24" width="' + w + '" height="28" rx="6" class="f-fill"/>';
    b += t(16 + w / 2, 43, p + " %", "f-on", "middle", 13) + t(316, 16, fmt(total) + unit, "f-txt", "end", 12) + t(16, 16, "0", "f-txt", "start", 12);
    return svg(W, 62, b, "pourcentage");
  }

  // Balance : équation a·x + b = c.
  function balance(left, right) {
    let b = L(170, 30, 170, 108) + P([[150, 108], [190, 108], [170, 92]], "f-soft") + L(50, 40, 290, 40, "f-line", 'stroke-width="3"');
    b += L(70, 40, 70, 58) + L(270, 40, 270, 58);
    b += '<rect x="20" y="58" width="100" height="30" rx="6" class="f-fill"/>' + t(70, 78, left, "f-on", "middle", 13);
    b += '<rect x="220" y="58" width="100" height="30" rx="6" class="f-soft"/>' + t(270, 78, right, "f-txt", "middle", 13);
    return svg(340, 116, b, "balance");
  }

  // Triangle rectangle coté (Pythagore) ; labels : [cathète horizontale, cathète verticale, hypoténuse].
  function rightTriangle(lab) {
    const A = [40, 130], B = [260, 130], C = [40, 30];
    let b = P([A, B, C], "f-shape") + '<rect x="40" y="118" width="12" height="12" class="f-line" fill="none"/>';
    b += t(150, 150, lab[0]) + t(24, 84, lab[1], "f-txt", "end") + t(162, 72, lab[2], "f-accent f-txt", "start");
    return svg(300, 160, b, "triangle rectangle");
  }

  // Configuration de Thalès.
  function thales(lab) {
    const A = [150, 20], B = [40, 150], C = [290, 150], k = 0.45;
    const D = [A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k], E = [A[0] + (C[0] - A[0]) * k, A[1] + (C[1] - A[1]) * k];
    let b = P([A, B, C], "f-shape") + L(D[0], D[1], E[0], E[1], "f-accent", 'stroke-width="2.5"');
    b += t(A[0], A[1] - 6, "A") + t(B[0] - 10, B[1] + 4, "B") + t(C[0] + 10, C[1] + 4, "C") + t(D[0] - 10, D[1], "D") + t(E[0] + 10, E[1], "E");
    (lab || []).forEach(([x, y, s]) => (b += t(x, y, s, "f-accent f-txt", "middle", 12)));
    return svg(330, 170, b, "configuration de Thalès");
  }

  function rectFig(w, h, lw, lh) {
    const s = Math.min(240 / w, 110 / h), W = w * s, H = h * s;
    return svg(300, H + 40, '<rect x="' + (150 - W / 2) + '" y="12" width="' + W + '" height="' + H + '" class="f-shape"/>' + t(150, H + 32, lw) + t(150 - W / 2 - 8, 12 + H / 2, lh, "f-txt", "end"), "rectangle");
  }
  function triangleFig(lb, lh) {
    let b = P([[40, 130], [260, 130], [180, 30]], "f-shape") + L(180, 30, 180, 130, "f-accent", 'stroke-dasharray="5 4"');
    return svg(300, 152, b + t(150, 148, lb) + t(190, 86, lh, "f-accent f-txt", "start"), "triangle");
  }
  function trapezoid(lB, lb, lh) {
    let b = P([[30, 130], [270, 130], [210, 40], [90, 40]], "f-shape") + L(90, 40, 90, 130, "f-accent", 'stroke-dasharray="5 4"');
    return svg(300, 152, b + t(150, 148, lB) + t(150, 32, lb) + t(82, 90, lh, "f-accent f-txt", "end"), "trapèze");
  }
  function disk(lr) {
    return svg(300, 150, '<circle cx="150" cy="75" r="62" class="f-shape"/>' + L(150, 75, 212, 75, "f-accent", 'stroke-width="2"') + '<circle cx="150" cy="75" r="3" class="f-dot"/>' + t(181, 68, lr, "f-accent f-txt"), "disque");
  }
  function square(ls) {
    return svg(300, 160, '<rect x="80" y="14" width="130" height="130" class="f-shape"/>' + L(80, 144, 210, 14, "f-accent", 'stroke-dasharray="6 4"') + t(145, 158, ls) + t(158, 74, "?", "f-accent f-txt", "start", 16), "carré");
  }
  // Pavé droit en perspective cavalière.
  function box(la, lb, lc) {
    const x = 60, y = 60, w = 150, h = 80, dx = 50, dy = -36;
    let b = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" class="f-shape"/>';
    b += P([[x, y], [x + dx, y + dy], [x + w + dx, y + dy], [x + w, y]], "f-shape2") + P([[x + w, y], [x + w + dx, y + dy], [x + w + dx, y + h + dy], [x + w, y + h]], "f-shape2");
    return svg(300, 170, b + t(x + w / 2, y + h + 18, la) + t(x + w + dx / 2 + 14, y + h + dy / 2 + 6, lb, "f-txt", "start") + t(x - 8, y + h / 2, lc, "f-txt", "end"), "pavé");
  }
  function pyramid(lc, lh) {
    const b = P([[60, 140], [200, 140], [250, 110], [110, 110]], "f-shape2") + P([[60, 140], [200, 140], [150, 20]], "f-shape") + P([[200, 140], [250, 110], [150, 20]], "f-shape2") + L(155, 125, 150, 20, "f-accent", 'stroke-dasharray="5 4"');
    return svg(300, 162, b + t(130, 158, lc) + t(160, 80, lh, "f-accent f-txt", "start"), "pyramide");
  }
  function cone(lr, lh) {
    const b = '<ellipse cx="150" cy="130" rx="80" ry="18" class="f-shape2"/>' + P([[70, 130], [230, 130], [150, 20]], "f-shape") + L(150, 130, 150, 20, "f-accent", 'stroke-dasharray="5 4"') + L(150, 130, 230, 130, "f-accent");
    return svg(300, 160, b + t(190, 124, lr, "f-accent f-txt") + t(158, 80, lh, "f-accent f-txt", "start"), "cône");
  }
  // Route et chronomètre (vitesse).
  function road(ld, lt) {
    let b = '<rect x="16" y="56" width="300" height="26" rx="4" class="f-soft"/>' + L(24, 69, 308, 69, "f-on", 'stroke-dasharray="14 10" stroke-width="2"');
    b += '<rect x="20" y="40" width="34" height="16" rx="4" class="f-fill"/><circle cx="28" cy="58" r="4" class="f-dot"/><circle cx="46" cy="58" r="4" class="f-dot"/>';
    b += L(312, 30, 312, 56, "f-line") + P([[312, 30], [330, 36], [312, 42]], "f-fill");
    return svg(340, 104, b + t(166, 100, ld) + t(166, 28, lt, "f-accent f-txt"), "trajet");
  }
  // Rangée d'objets (proportionnalité).
  function items(n, label, maxShow = 12) {
    let b = "";
    const k = Math.min(n, maxShow);
    for (let i = 0; i < k; i++) b += '<rect x="' + (16 + i * 26) + '" y="20" width="20" height="28" rx="3" class="' + (i % 2 ? "f-fill" : "f-fill2") + '"/>';
    if (n > maxShow) b += t(16 + k * 26 + 14, 40, "…");
    return svg(340, 74, b + t(16, 68, label, "f-txt", "start", 12), "objets");
  }
  // Agrandissement : petite et grande figure.
  function scaling(k, kind) {
    const s = 30, S = 30 * Math.min(k, 4);
    let b = '<rect x="16" y="' + (130 - s) + '" width="' + s + '" height="' + s + '" class="f-shape"/>' + '<rect x="' + (80) + '" y="' + (130 - S) + '" width="' + S + '" height="' + S + '" class="f-fill2"/>';
    return svg(340, 140, b + t(31, 124 - s, "1") + t(80 + S + 10, 130 - S / 2, "× " + k + (kind ? " (" + kind + ")" : ""), "f-accent f-txt", "start"), "agrandissement");
  }
  // Repère avec une droite (fonctions affines).
  function lineGraph(a, b, pts = []) {
    const W = 300, H = 180, X = (x) => 150 + x * 18, Y = (y) => 90 - y * 6;
    let g = L(10, 90, 290, 90) + L(150, 8, 150, 172);
    for (let x = -7; x <= 7; x++) g += L(X(x), 87, X(x), 93);
    const x1 = -7.5, x2 = 7.5;
    g += '<clipPath id="cl"><rect x="10" y="8" width="280" height="164"/></clipPath>';
    g += '<line x1="' + X(x1) + '" y1="' + Y(a * x1 + b) + '" x2="' + X(x2) + '" y2="' + Y(a * x2 + b) + '" class="f-accent" stroke-width="2.5" clip-path="url(#cl)"/>';
    pts.forEach(([x, y, s]) => (g += '<circle cx="' + X(x) + '" cy="' + Y(y) + '" r="4.5" class="f-dot"/>' + t(X(x) + 8, Y(y) - 8, s, "f-txt", "start", 12)));
    return svg(W, H, g, "droite");
  }
  // Puissances : blocs (base^exposant).
  function blocks(label) {
    let b = "";
    for (let i = 0; i < 3; i++) for (let j = 0; j <= i; j++) b += '<rect x="' + (30 + i * 70 + j * 10) + '" y="' + (80 - j * 18) + '" width="44" height="16" rx="2" class="' + (j % 2 ? "f-fill2" : "f-fill") + '"/>';
    return svg(300, 110, b + t(150, 108, label, "f-txt", "middle", 12), "puissances");
  }
  // Échelle de puissances de 10.
  function sciScale(exp) {
    let b = L(16, 50, 324, 50);
    for (let e = -6; e <= 8; e++) {
      const x = 16 + (e + 6) * 22;
      b += L(x, 44, x, 56, e === exp ? "f-accent" : "f-line") + (e % 2 === 0 ? t(x, 74, "10^" + e, e === exp ? "f-accent f-txt" : "f-txt", "middle", 10) : "");
    }
    return svg(340, 84, b + '<circle cx="' + (16 + (exp + 6) * 22) + '" cy="50" r="6" class="f-dot"/>', "ordres de grandeur");
  }
  // Carré d'aire n (racines).
  function areaSquare(label) {
    return svg(300, 150, '<rect x="95" y="15" width="110" height="110" class="f-fill2"/>' + t(150, 76, label, "f-txt", "middle", 15) + t(150, 145, "côté = ?", "f-accent f-txt", "middle", 13), "carré d'aire donnée");
  }
  // Expression en tuiles (calcul littéral) : rectangle découpé.
  function tiles(a, b, la, lb) {
    let g = '<rect x="40" y="20" width="' + a + '" height="' + b + '" class="f-fill2"/>';
    return svg(300, b + 50, g + t(40 + a / 2, b + 40, la) + t(32, 20 + b / 2, lb, "f-txt", "end"), "aire d'un rectangle");
  }

  // Parabole y = a(x - p)(x - q) ou a x² + b x + c, avec points marqués.
  function parabola(f, pts = [], line = null) {
    const W = 300, H = 190, X = (x) => 150 + x * 20, Y = (y) => 120 - y * 8;
    let g = L(10, Y(0), 290, Y(0)) + L(X(0), 6, X(0), 184);
    for (let x = -6; x <= 6; x++) g += L(X(x), Y(0) - 3, X(x), Y(0) + 3);
    let d = "";
    for (let x = -7; x <= 7.01; x += 0.1) { const y = f(x); if (Y(y) > -40 && Y(y) < H + 40) d += (d ? " L" : "M") + X(x).toFixed(1) + "," + Y(y).toFixed(1); else if (d && !d.endsWith("B")) d += " B"; }
    d = d.replace(/ B M/g, " M").replace(/ B/g, "");
    g += '<clipPath id="cp"><rect x="6" y="6" width="288" height="178"/></clipPath><path d="' + d + '" class="f-accent" fill="none" stroke-width="2.5" clip-path="url(#cp)"/>';
    if (line) g += '<line x1="' + X(-7) + '" y1="' + Y(line(-7)) + '" x2="' + X(7) + '" y2="' + Y(line(7)) + '" class="f-line" stroke-width="2" clip-path="url(#cp)"/>';
    pts.forEach(([x, y, s]) => (g += '<circle cx="' + X(x) + '" cy="' + Y(y) + '" r="4.5" class="f-dot"/>' + t(X(x) + 8, Y(y) - 8, s, "f-txt", "start", 12)));
    return svg(W, H, g, "parabole");
  }
  // Triangle rectangle avec angle marqué en A (trigonométrie).
  function trigTriangle(lab, angle) {
    const A = [40, 130], B = [260, 130], C = [260, 40];
    let b = P([A, B, C], "f-shape") + '<rect x="248" y="118" width="12" height="12" class="f-line" fill="none"/>';
    b += '<path d="M80,130 A40,40 0 0,0 77,115" class="f-accent" fill="none" stroke-width="2"/>' + t(92, 124, angle, "f-accent f-txt", "start", 13);
    b += t(150, 150, lab[0]) + t(272, 88, lab[1], "f-txt", "start") + t(138, 74, lab[2], "f-txt", "end");
    return svg(320, 160, b, "triangle rectangle et angle");
  }
  // Cercle, angle au centre et angle inscrit.
  function circleAngles(lCenter, lInscribed) {
    const cx = 150, cy = 90, r = 70, pt = (deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy - r * Math.sin((deg * Math.PI) / 180)];
    const A = pt(210), B = pt(330), C = pt(95);
    let g = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" class="f-shape"/>' + P([A, [cx, cy], B], "f-fill2") + L(A[0], A[1], C[0], C[1]) + L(B[0], B[1], C[0], C[1]);
    g += t(A[0] - 10, A[1] + 12, "A") + t(B[0] + 10, B[1] + 12, "B") + t(C[0], C[1] - 8, "C") + t(cx, cy - 8, "O");
    g += t(cx, cy + 34, lCenter, "f-accent f-txt", "middle", 12) + t(C[0] + 4, C[1] + 34, lInscribed, "f-accent f-txt", "start", 12);
    return svg(300, 180, g, "angles au centre et inscrit");
  }

  return { parabola, trigTriangle, circleAngles, numberLine, fractionBars, percentBar, balance, rightTriangle, thales, rectFig, triangleFig, trapezoid, disk, square, box, pyramid, cone, road, items, scaling, lineGraph, blocks, sciScale, areaSquare, tiles, fmt };
})();
