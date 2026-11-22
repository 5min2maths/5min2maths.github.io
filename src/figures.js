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
      if (v % step === 0) b += t(X(v), 94, v, v === 0 ? "f-accent f-txt f-tick" : "f-txt f-tick", "middle", 12);
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

  // Accolade horizontale de x1 à x2, pointe vers le haut (s = 1) ou vers le bas (s = -1).
  const brace = (x1, x2, y, s) => { const m = (x1 + x2) / 2, h = 8 * s;
    return '<path d="M' + x1 + "," + y + " q0," + -h + " 8," + -h + " L" + (m - 8) + "," + (y - h) + " q8,0 8," + -h + " q0," + h + " 8," + h + " L" + (x2 - 8) + "," + (y - h) + " q8,0 8," + h + '" class="f-line" fill="none" stroke-width="1.6"/>'; };
  // Fraction d'une quantité (14.11, retour testeur) : le tout n en accolade, b parts égales de n ÷ b, a parts prises en couleur.
  function fractionOf(a, b, n) {
    const x0 = 30, w = 280, y = 46, hh = 36, cw = w / b, part = n / b;
    let g = brace(x0, x0 + w, y - 6, 1) + t(x0 + w / 2, y - 26, String(n), "f-txt", "middle", 15);
    for (let k = 0; k < b; k++) {
      g += '<rect x="' + (x0 + k * cw) + '" y="' + y + '" width="' + cw + '" height="' + hh + '" class="' + (k < a ? "f-fill" : "f-soft") + '" stroke="var(--ink)" stroke-width="1.5"/>';
      g += t(x0 + k * cw + cw / 2, y + 23, fmt(part), k < a ? "f-on" : "f-txt", "middle", 14);
    }
    g += brace(x0, x0 + a * cw, y + hh + 6, -1) + t(x0 + (a * cw) / 2, y + hh + 38, a + "/" + b + " de " + n + " = " + fmt(part * a), "f-accent f-txt", "middle", 14);
    g += t(x0 + w, y + hh + 38, "1 part = " + n + " ÷ " + b + " = " + fmt(part), "f-txt", "end", 11);
    return svg(340, y + hh + 50, g, a + "/" + b + " de " + n);
  }
  // Priorités pas à pas (14.11, retour testeur) : rows = [[avant, surligné, après, étape]] ; dernière ligne = résultat.
  function prioSteps(rows, result) {
    let g = "";
    rows.forEach(([pre, hi, post, step], i) => {
      const y = 26 + i * 36;
      g += '<text x="24" y="' + y + '" class="f-txt" font-size="18">' + (i ? "= " : "") + pre + '<tspan class="f-accent f-txt">' + hi + "</tspan>" + post + "</text>";
      g += t(326, y, (i + 1) + ". " + step, "f-txt", "end", 12);
      g += L(196, y - 5, 230, y - 5, "f-line", 'stroke-dasharray="3 3"');
    });
    const y = 26 + rows.length * 36;
    g += '<text x="24" y="' + y + '" class="f-accent f-txt" font-size="18">= ' + result + "</text>";
    return svg(340, y + 14, g, "priorités des opérations, étape par étape");
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
    const A = [80, 130], B = [290, 130], C = [80, 30];
    let b = P([A, B, C], "f-shape") + '<rect x="80" y="118" width="12" height="12" class="f-line" fill="none"/>';
    b += t(185, 150, lab[0]) + t(72, 84, lab[1], "f-txt", "end") + t(196, 72, lab[2], "f-accent f-txt", "start");
    return svg(320, 160, b, "triangle rectangle");
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
    const s = Math.min(200 / w, 110 / h), W = w * s, H = h * s; // marge pour l'étiquette de gauche (ne pas la couper)
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
  // Cube en perspective cavalière (face avant carrée, fuyantes à 45°, réduction 0,5) ; arêtes cachées en pointillé.
  // withPyr : pyramide inscrite (base = face du dessous, sommet = centre de la face du dessus). Commentaire testeur du 21.11.
  function cube(la, withPyr) {
    const x = 70, y = 50, s = 110, dx = 39, dy = -39, D = 'stroke-dasharray="5 4"';
    const F = [[x, y + s], [x + s, y + s], [x + s, y], [x, y]], B = F.map((p) => [p[0] + dx, p[1] + dy]);
    let g = P([F[0], F[1], F[2], F[3]], "f-shape") + P([F[3], F[2], B[2], B[3]], "f-shape2") + P([F[1], B[1], B[2], F[2]], "f-shape2");
    g += L(B[0][0], B[0][1], F[0][0], F[0][1], "f-line", D) + L(B[0][0], B[0][1], B[1][0], B[1][1], "f-line", D) + L(B[0][0], B[0][1], B[3][0], B[3][1], "f-line", D);
    if (withPyr) {
      const S = [(F[3][0] + B[2][0]) / 2, (F[3][1] + B[2][1]) / 2], H = [(F[0][0] + B[1][0]) / 2, (F[0][1] + B[1][1]) / 2];
      g += '<polygon points="' + [F[0], F[1], S].map((p) => p.join(",")).join(" ") + '" fill="var(--margin)" fill-opacity="0.18"/>' + '<polygon points="' + [F[1], B[1], S].map((p) => p.join(",")).join(" ") + '" fill="var(--margin)" fill-opacity="0.28"/>';
      const E = 'style="stroke:var(--margin);stroke-width:2.2"', Eh = 'style="stroke:var(--margin);stroke-width:1.6" stroke-dasharray="5 4"';
      g += L(F[0][0], F[0][1], S[0], S[1], "f-line", E) + L(F[1][0], F[1][1], S[0], S[1], "f-line", E) + L(B[1][0], B[1][1], S[0], S[1], "f-line", E) + L(B[0][0], B[0][1], S[0], S[1], "f-line", Eh);
      g += L(S[0], S[1], H[0], H[1], "f-line", 'style="stroke:var(--ink-soft);stroke-width:1.2" stroke-dasharray="2 3"');
      g += '<circle cx="' + S[0] + '" cy="' + S[1] + '" r="3" fill="var(--margin)"/>';
    }
    return svg(300, 190, g + t(x + s / 2, y + s + 20, la) + t(x + s + dx / 2 + 8, y + s + dy / 2 + 8, la, "f-txt", "start") + t(x - 8, y + s / 2, la, "f-txt", "end"), withPyr ? "pyramide inscrite dans un cube" : "cube");
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
  // Véhicule dessiné selon le contexte (commentaire testeur du 16.11 : « mettre un vélo » quand c'est une cycliste).
  function vehicle(who) {
    const k = 'stroke="var(--ink)" stroke-width="2" fill="none" stroke-linecap="round"';
    if (who === "velo") return '<circle cx="26" cy="48" r="8" ' + k + '/><circle cx="52" cy="48" r="8" ' + k + '/><polyline points="26,48 35,36 47,36 52,48 39,48 35,36" ' + k + '/><line x1="47" y1="36" x2="45" y2="30" ' + k + '/><line x1="35" y1="36" x2="34" y2="32" ' + k + '/><circle cx="38" cy="22" r="4" class="f-fill"/><line x1="37" y1="26" x2="35" y2="34" ' + k + '/>';
    if (who === "moto") return '<circle cx="26" cy="49" r="7" class="f-dot"/><circle cx="54" cy="49" r="7" class="f-dot"/><path d="M26,49 L36,38 L50,38 L54,49 Z" class="f-fill"/><circle cx="42" cy="28" r="5" class="f-fill"/>';
    if (["tgv", "train", "tram"].includes(who)) return '<path d="M18,40 L66,40 Q78,40 80,54 L18,54 Z" class="f-fill"/><rect x="24" y="43" width="8" height="5" rx="1" class="f-soft"/><rect x="38" y="43" width="8" height="5" rx="1" class="f-soft"/><rect x="52" y="43" width="8" height="5" rx="1" class="f-soft"/><circle cx="28" cy="57" r="3" class="f-dot"/><circle cx="66" cy="57" r="3" class="f-dot"/>';
    if (who === "bateau" || who === "aviron") return '<path d="M18,46 L70,46 L62,56 L26,56 Z" class="f-fill"/>' + (who === "bateau" ? '<line x1="44" y1="46" x2="44" y2="24" ' + k + '/><path d="M46,26 L62,44 L46,44 Z" class="f-soft" stroke="var(--ink)" stroke-width="1"/>' : '<line x1="30" y1="40" x2="58" y2="62" ' + k + '/>');
    if (who === "course") return '<circle cx="38" cy="20" r="5" class="f-fill"/><polyline points="37,25 35,40 28,54" ' + k + '/><polyline points="35,40 44,47 42,56" ' + k + '/><polyline points="28,32 37,29 46,34" ' + k + '/>';
    return '<rect x="20" y="40" width="34" height="16" rx="4" class="f-fill"/><circle cx="28" cy="58" r="4" class="f-dot"/><circle cx="46" cy="58" r="4" class="f-dot"/>';
  }
  function road(ld, lt, who) {
    let b = '<rect x="16" y="56" width="300" height="26" rx="4" class="f-soft"/>' + L(24, 69, 308, 69, "f-on", 'stroke-dasharray="14 10" stroke-width="2"');
    if (who === "bateau" || who === "aviron") b = '<rect x="16" y="56" width="300" height="26" rx="4" class="f-soft"/>' + L(24, 69, 308, 69, "f-on", 'stroke-dasharray="3 9" stroke-width="2"');
    b += vehicle(who);
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
    return svg(340, 140, b + t(31, 124 - s, "1") + t(80 + S + 10, 130 - S / 2, "× " + String(k).replace(".", ",") + (kind ? " (" + kind + ")" : ""), "f-accent f-txt", "start"), "agrandissement");
  }
  // Repère avec une droite (fonctions affines).
  // Repère quadrillé à l'échelle (même unité en x et en y, 22.11 : quadrillage demandé, triangles non déformés) :
  // cadré sur les points et l'origine. a = null : pas de droite ; o.poly : polygone des points (ex. triangle ABC).
  function lineGraph(a, b, pts = [], o = {}) {
    const xs = pts.map((p) => p[0]).concat(0), ys = pts.map((p) => p[1]).concat(0);
    let x0 = Math.min(...xs) - 1, x1 = Math.max(...xs) + 2, y0 = Math.min(...ys) - 1, y1 = Math.max(...ys) + 2;
    if (x1 - x0 < 8) { const e = (8 - (x1 - x0)) / 2; x0 = Math.floor(x0 - e); x1 = Math.ceil(x1 + e); }
    if (y1 - y0 < 6) { const e = (6 - (y1 - y0)) / 2; y0 = Math.floor(y0 - e); y1 = Math.ceil(y1 + e); }
    const ratio = (y1 - y0) / (x1 - x0), big = Math.max(x1 - x0, y1 - y0) > 16;
    return FIG.plot(a === null ? [] : [{ f: (x) => a * x + b }], pts, { xr: [x0, x1], yr: [y0, y1], numbers: true, step: big ? 2 : 1, squash: ratio > 1.4 ? 1.4 / ratio : 1, polys: o.poly ? [pts.map((p) => [p[0], p[1]])] : [], label: o.label || "repère" });
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
      b += L(x, 44, x, 56, e === exp ? "f-accent" : "f-line") + (e % 2 === 0 ? t(x, 74, "10^" + e, e === exp ? "f-accent f-txt f-tick" : "f-txt f-tick", "middle", 10) : "");
    }
    return svg(340, 84, b + '<circle cx="' + (16 + (exp + 6) * 22) + '" cy="50" r="6" class="f-dot"/>', "ordres de grandeur");
  }
  // Carré d'aire n (racines).
  function areaSquare(label) {
    return svg(300, 150, '<rect x="95" y="15" width="110" height="110" class="f-fill2"/>' + t(150, 76, label, "f-txt", "middle", 15) + t(150, 145, "côté = ?", "f-accent f-txt", "middle", 13), "carré d'aire donnée");
  }
  // Expression en tuiles (calcul littéral) : rectangle découpé.
  // Rectangle à paver (commentaire testeur du 15.11 : figure illisible) : rectangle à l'échelle des vraies dimensions,
  // un carré en pointillé « ? » dans un coin (le carré cherché, sans donner sa taille).
  function tiles(a, b, la, lb) {
    const k = Math.min(220 / a, 120 / b), W = a * k, H = b * k, s = Math.min(W, H) / 3.2;
    let g = '<rect x="40" y="20" width="' + W.toFixed(1) + '" height="' + H.toFixed(1) + '" class="f-fill2" stroke="var(--ink)" stroke-width="1.5"/>';
    g += '<rect x="40" y="20" width="' + s.toFixed(1) + '" height="' + s.toFixed(1) + '" fill="none" stroke="var(--blue)" stroke-width="1.5" stroke-dasharray="4 3"/>';
    g += t(40 + s / 2, 25 + s / 2, "?", "f-accent f-txt");
    return svg(300, H + 50, g + t(40 + W / 2, H + 40, la) + t(32, 20 + H / 2, lb, "f-txt", "end"), "rectangle à paver avec des carrés");
  }

  // Parabole y = a(x - p)(x - q) ou a x² + b x + c, avec points marqués.
  function parabola(f, pts = [], line = null, ticks = true) {
    const W = 300, H = 190, X = (x) => 150 + x * 20, Y = (y) => 120 - y * 8;
    let g = L(10, Y(0), 290, Y(0)) + L(X(0), 6, X(0), 184);
    if (ticks) for (let x = -6; x <= 6; x++) g += L(X(x), Y(0) - 3, X(x), Y(0) + 3);
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
    // Angles marqués par un secteur (commentaire testeur du 21.11) : bleu au centre O, rouge au point C du cercle.
    const cx = 150, cy = 92, r = 74, pt = (deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy - r * Math.sin((deg * Math.PI) / 180)];
    const A = pt(210), B = pt(330), C = pt(95), O = [cx, cy];
    const wedge = (V, P1, P2, rr, style) => {
      const a1 = Math.atan2(P1[1] - V[1], P1[0] - V[0]), a2 = Math.atan2(P2[1] - V[1], P2[0] - V[0]);
      let d = a2 - a1; while (d <= -Math.PI) d += 2 * Math.PI; while (d > Math.PI) d -= 2 * Math.PI;
      const p1 = [V[0] + rr * Math.cos(a1), V[1] + rr * Math.sin(a1)], p2 = [V[0] + rr * Math.cos(a2), V[1] + rr * Math.sin(a2)], m = a1 + d / 2;
      return { g: '<path d="M' + V[0].toFixed(1) + "," + V[1].toFixed(1) + " L" + p1[0].toFixed(1) + "," + p1[1].toFixed(1) + " A" + rr + "," + rr + " 0 0," + (d > 0 ? 1 : 0) + " " + p2[0].toFixed(1) + "," + p2[1].toFixed(1) + ' Z" ' + style + "/>", m };
    };
    const wO = wedge(O, A, B, 20, 'fill="var(--blue)" fill-opacity="0.25" stroke="var(--blue)" stroke-width="2"');
    const wC = wedge(C, A, B, 26, 'fill="var(--margin)" fill-opacity="0.25" stroke="var(--margin)" stroke-width="2"');
    let g = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" class="f-shape"/>' + wO.g + wC.g;
    g += L(O[0], O[1], A[0], A[1], "f-line", 'style="stroke:var(--blue);stroke-width:2"') + L(O[0], O[1], B[0], B[1], "f-line", 'style="stroke:var(--blue);stroke-width:2"');
    g += L(A[0], A[1], C[0], C[1], "f-line", 'style="stroke-width:2"') + L(B[0], B[1], C[0], C[1], "f-line", 'style="stroke-width:2"');
    g += '<circle cx="' + cx + '" cy="' + cy + '" r="2.5" fill="var(--ink)"/>';
    g += t(A[0] - 10, A[1] + 12, "A") + t(B[0] + 10, B[1] + 12, "B") + t(C[0], C[1] - 8, "C") + t(cx - 12, cy - 4, "O");
    g += '<text x="' + (O[0] + 36 * Math.cos(wO.m)).toFixed(1) + '" y="' + (O[1] + 36 * Math.sin(wO.m) + 4).toFixed(1) + '" text-anchor="middle" font-size="13" font-weight="700" fill="var(--blue)">' + lCenter + "</text>";
    g += '<text x="' + (C[0] + 42 * Math.cos(wC.m)).toFixed(1) + '" y="' + (C[1] + 42 * Math.sin(wC.m) + 4).toFixed(1) + '" text-anchor="middle" font-size="13" font-weight="700" fill="var(--margin)">' + lInscribed + "</text>";
    return svg(300, 180, g, "angle au centre AOB (bleu) et angle inscrit ACB (rouge)");
  }

  // Cercle trigonométrique avec un angle (degrés).
  function unitCircle(deg, label) {
    const cx = 150, cy = 95, r = 75, a = (deg * Math.PI) / 180, px = cx + r * Math.cos(a), py = cy - r * Math.sin(a);
    let g = L(60, cy, 240, cy) + L(cx, 10, cx, 180) + '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" class="f-shape"/>';
    g += L(cx, cy, px, py, "f-accent", 'stroke-width="2.5"') + L(px, py, px, cy, "f-line", 'stroke-dasharray="4 4"') + L(px, py, cx, py, "f-line", 'stroke-dasharray="4 4"');
    const large = deg % 360 > 180 ? 1 : 0, ax = cx + 22 * Math.cos(a), ay = cy - 22 * Math.sin(a);
    g += '<path d="M' + (cx + 22) + "," + cy + " A22,22 0 " + large + ",0 " + ax.toFixed(1) + "," + ay.toFixed(1) + '" class="f-accent" fill="none" stroke-width="2"/>';
    g += '<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="5" class="f-dot"/>' + t(cx + 30, cy - 8, label || deg + "°", "f-accent f-txt", "start", 12) + t(cx + r + 8, cy + 14, "1", "f-txt", "start", 11);
    return svg(300, 190, g, "cercle trigonométrique");
  }
  // Triangle quelconque avec étiquettes [a, b, c, angle].
  function anyTriangle(lab) {
    const A = [30, 140], B = [290, 140], C = [110, 30];
    let g = P([A, B, C], "f-shape") + t(A[0] - 12, A[1] + 6, "A") + t(B[0] + 12, B[1] + 6, "B") + t(C[0], C[1] - 8, "C");
    g += t(160, 158, lab[2] || "", "f-txt") + t(215, 80, lab[0] || "", "f-txt", "start") + t(58, 80, lab[1] || "", "f-txt", "end");
    if (lab[3]) g += t(lab[4] === "C" ? C[0] + 6 : lab[4] === "B" ? B[0] - 40 : A[0] + 26, lab[4] === "C" ? C[1] + 30 : 132, lab[3], "f-accent f-txt", "start", 12);
    return svg(320, 168, g, "triangle quelconque");
  }
  // Diagramme en bâtons d'une petite série.
  function barChart(values) {
    const max = Math.max(...values), w = 280 / values.length;
    let g = L(20, 140, 300, 140);
    values.forEach((v, i) => { const hh = (v / max) * 110; g += '<rect x="' + (24 + i * w) + '" y="' + (140 - hh) + '" width="' + (w - 8) + '" height="' + hh + '" rx="3" class="' + (i % 2 ? "f-fill2" : "f-fill") + '"/>' + t(24 + i * w + (w - 8) / 2, 156, String(v).replace(".", ","), "f-txt", "middle", 11); });
    return svg(320, 164, g, "série statistique");
  }

  // Cylindre (13.11, retour testeur) : base arrière en pointillés, rayon sur la face du haut avec son étiquette
  // au-dessus du bord (sans chevauchement), hauteur en cote à droite.
  function cylinder(lr, lh) {
    const A = (sw, cls, extra = "") => '<path d="M80 140 A70 16 0 0 ' + sw + ' 220 140" class="' + cls + '" fill="none" ' + extra + "/>";
    let g = '<path d="M80 40 L80 140 A70 16 0 0 0 220 140 L220 40 Z" fill="var(--blue-soft)" stroke="none"/>';
    g += A(1, "f-line", 'stroke-dasharray="5 4"') + A(0, "f-line") + L(80, 40, 80, 140) + L(220, 40, 220, 140);
    g += '<ellipse cx="150" cy="40" rx="70" ry="16" class="f-shape2"/>' + '<circle cx="150" cy="40" r="2.5" fill="var(--ink)"/>' + L(150, 40, 220, 40, "f-accent", 'stroke-width="2.2"');
    g += L(240, 40, 240, 140) + L(235, 40, 245, 40) + L(235, 140, 245, 140);
    return svg(300, 166, g + t(185, 17, lr, "f-accent f-txt") + t(250, 95, lh, "f-txt", "start"), "cylindre");
  }

  function unitLine(axis, v, label) {
    const cx = 150, cy = 95, r = 75;
    let g = L(60, cy, 240, cy) + L(cx, 10, cx, 180) + '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" class="f-shape"/>';
    if (axis === "y") g += L(50, cy - v * r, 250, cy - v * r, "f-accent", 'stroke-width="2" stroke-dasharray="6 4"') + t(252, cy - v * r + 4, label, "f-accent f-txt", "start", 12);
    else g += L(cx + v * r, 8, cx + v * r, 182, "f-accent", 'stroke-width="2" stroke-dasharray="6 4"') + t(cx + v * r + 4, 18, label, "f-accent f-txt", "start", 12);
    return svg(320, 190, g + t(cx + r + 8, cy + 14, "1", "f-txt", "start", 11), "cercle trigonométrique");
  }

  return { unitLine, cylinder, unitCircle, anyTriangle, barChart, parabola, trigTriangle, circleAngles, numberLine, fractionBars, percentBar, balance, rightTriangle, thales, rectFig, triangleFig, trapezoid, disk, square, box, cube, pyramid, cone, road, items, scaling, lineGraph, blocks, fractionOf, prioSteps, sciScale, areaSquare, tiles, fmt };
})();
