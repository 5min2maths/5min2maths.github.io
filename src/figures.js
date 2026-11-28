// Figures SVG générées avec les valeurs de chaque question (aucune image externe).
// Couleurs par classes CSS (.f-line, .f-fill, .f-accent, .f-soft, .f-txt) pour suivre le thème clair / sombre.

const FIG = (() => {
  const svg = (w, h, body, label) =>
    '<svg class="fig" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + (label || "figure") + '" xmlns="http://www.w3.org/2000/svg">' + body + "</svg>";
  const t = (x, y, s, cls = "f-txt", anchor = "middle", size = 14) =>
    '<text x="' + x + '" y="' + y + '" class="' + cls + '" text-anchor="' + anchor + '" font-size="' + size + '">' + String(s).replace(/\{,\}/g, ",") + "</text>"; // 24.11 : « {,} » (virgule TeX) affiché tel quel dans les figures (robot)
  const L = (x1, y1, x2, y2, cls = "f-line", extra = "") => '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="' + cls + '" ' + extra + "/>";
  const P = (pts, cls = "f-line") => '<polygon points="' + pts.map((p) => p.join(",")).join(" ") + '" class="' + cls + '"/>';
  const fmt = (v) => String(+(+v).toFixed(3)).replace(".", ",");
  // 24.11 (galerie) : figures fidèles à l'énoncé. Valeur numérique d'une étiquette (« 8 », « r = 8 », « 2,5 m », « AB = 40 m ») ;
  // null si inconnue (« ? », « h », « »). Sert à dessiner à l'échelle sans jamais rien afficher de plus que l'étiquette.
  const num = (s) => { const m = /(?:^|=)\s*(\d+(?:[.,]\d+)?)\s*(?:mm|cm|dm|m|km)?\s*$/.exec(String(s == null ? "" : s).replace(/\{,\}/g, ",").trim()); return m ? +m[1].replace(",", ".") : null; };
  const f1 = (v) => (+v).toFixed(1);
  // Note discrète quand les proportions ont dû être forcées pour rester lisibles.
  const noScale = (x, y) => t(x, y, "(pas à l'échelle)", "f-txt", "end", 10);

  // Droite graduée avec flèches de saut (nombres relatifs).
  // opt.pts : autres points marqués (ex. second point d'une distance) ; opt.span : valeurs que la droite doit contenir sans
  // les marquer (ex. résultat d'un calcul, jamais montré) — 24.11, galerie : droite trop courte, point hors de la droite.
  function numberLine(start, jumps, opt = {}) {
    const vals = [start];
    jumps.forEach((j) => vals.push(vals[vals.length - 1] + j));
    const pts = (opt.pts || []).filter(isFinite), all = [...vals, ...pts, ...(opt.span || []).filter(isFinite)];
    let lo = Math.min(...all, 0) - 1, hi = Math.max(...all, 0) + 1;
    if (hi - lo > 30) { lo = Math.min(...all) - 1; hi = Math.max(...all) + 1; }
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
    pts.forEach((v) => { b += '<circle cx="' + X(v) + '" cy="70" r="5" class="f-dot"/>'; });
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
    // 24.11 (galerie : « 10 % » débordait d'une barre trop courte) : étiquette à droite de la partie colorée si elle n'y tient pas.
    const lab = fmt(p) + " %", inside = w >= lab.length * 8 + 8;
    b += (inside ? t(16 + w / 2, 43, lab, "f-on", "middle", 13) : t(16 + w + 6, 43, lab, "f-txt", "start", 13)) + t(316, 16, fmt(total) + unit, "f-txt", "end", 12) + t(16, 16, "0", "f-txt", "start", 12);
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
    // 24.11 (galerie : l'étiquette de hauteur, à droite, coupait le côté oblique) : à gauche de la hauteur, où il y a la place.
    return svg(300, 152, b + t(150, 148, lb) + t(172, 92, lh, "f-accent f-txt", "end"), "triangle");
  }
  function trapezoid(lB, lb, lh) {
    let b = P([[30, 130], [270, 130], [210, 40], [90, 40]], "f-shape") + L(90, 40, 90, 130, "f-accent", 'stroke-dasharray="5 4"');
    return svg(300, 152, b + t(150, 148, lB) + t(150, 32, lb) + t(98, 94, lh, "f-accent f-txt", "start"), "trapèze"); // 24.11 : hauteur cotée à l'intérieur (à gauche, elle coupait le côté oblique)
  }
  // Disque : rayon marqué, ou diamètre entier quand l'étiquette est « d = … » (24.11 : diamètre annoncé, rayon dessiné).
  function disk(lr) {
    if (/^\s*d\b/.test(String(lr || ""))) return svg(300, 150, '<circle cx="150" cy="75" r="62" class="f-shape"/>' + L(88, 75, 212, 75, "f-accent", 'stroke-width="2"') + '<circle cx="150" cy="75" r="3" class="f-dot"/>' + t(150, 68, lr, "f-accent f-txt"), "disque et son diamètre");
    return svg(300, 150, '<circle cx="150" cy="75" r="62" class="f-shape"/>' + L(150, 75, 212, 75, "f-accent", 'stroke-width="2"') + '<circle cx="150" cy="75" r="3" class="f-dot"/>' + (String(lr).length * 7.5 > 56 ? t(219, 80, lr, "f-accent f-txt", "start") : t(181, 68, lr, "f-accent f-txt")), "disque"); // 24.11 : étiquette longue hors du disque (elle coupait le cercle)
  }
  // 28.11 : ld = étiquette de la diagonale quand elle est donnée (au-dessus de la diagonale, sans la chevaucher).
  function square(ls, ld) {
    return svg(300, 160, '<rect x="80" y="14" width="130" height="130" class="f-shape"/>' + L(80, 144, 210, 14, "f-accent", 'stroke-dasharray="6 4"') + t(145, 158, ls, /\?/.test(ls) ? "f-accent f-txt" : "f-txt") + (ld ? t(139, 73, ld, "f-accent f-txt", "end", 14) : t(158, 74, "?", "f-accent f-txt", "start", 16)), "carré");
  }
  // Pavé droit en perspective cavalière ; la = largeur (devant), lb = profondeur, lc = hauteur.
  // 24.11 (galerie) : à l'échelle des trois dimensions quand elles sont toutes données (un cube a l'air d'un cube,
  // l'arête de 1 cm est la plus courte) ; arête mini 22 px, avec « pas à l'échelle » si on a dû forcer. Sinon forme d'origine.
  function box(la, lb, lc) {
    const va = num(la), vb = num(lb), vc = num(lc);
    let w = 150, h = 80, dx = 50, dy = -36, forced = false;
    if (va && vb && vc) {
      const k = 0.5 * Math.SQRT1_2, u = Math.min(190 / (va + vb * k), 110 / (vc + vb * k)), mn = 22, cl = (v) => { if (v < mn) { forced = forced || v < mn * 0.7; return mn; } return v; };
      w = cl(va * u); h = cl(vc * u); const d = cl(vb * u * 0.5 * 1.414) / 1.414; dx = d; dy = -d;
    }
    const x = 60, y = 14 - dy;
    let b = '<rect x="' + x + '" y="' + f1(y) + '" width="' + f1(w) + '" height="' + f1(h) + '" class="f-shape"/>';
    b += P([[x, y], [x + dx, y + dy], [x + w + dx, y + dy], [x + w, y]].map((p) => p.map(f1)), "f-shape2") + P([[x + w, y], [x + w + dx, y + dy], [x + w + dx, y + h + dy], [x + w, y + h]].map((p) => p.map(f1)), "f-shape2");
    b += t(f1(x + w / 2), f1(y + h + 18), la) + t(f1(x + w + dx / 2 + 10), f1(y + h + dy / 2 + 6), lb, "f-txt", "start") + t(x - 8, f1(y + h / 2 + 4), lc, "f-txt", "end");
    return svg(300, Math.round(y + h + 28), b + (forced ? noScale(296, Math.round(y + h + 24)) : ""), "pavé");
  }
  // Cube en perspective cavalière (face avant carrée, fuyantes à 45°, réduction 0,5) ; arêtes cachées en pointillé.
  // withPyr : pyramide inscrite (base = face du dessous, sommet = centre de la face du dessus). Commentaire testeur du 21.11.
  function cube(la, withPyr) {
    const x = 70, y = 50, s = 110, dx = 39, dy = -39, D = 'stroke-dasharray="5 4"';
    const F = [[x, y + s], [x + s, y + s], [x + s, y], [x, y]], B = F.map((p) => [p[0] + dx, p[1] + dy]);
    let g = P([F[0], F[1], F[2], F[3]], "f-shape") + P([F[3], F[2], B[2], B[3]], "f-shape2") + P([F[1], B[1], B[2], F[2]], "f-shape2");
    g += L(B[0][0], B[0][1], F[0][0], F[0][1], "f-line", D) + L(B[0][0], B[0][1], B[1][0], B[1][1], "f-line", D) + L(B[0][0], B[0][1], B[3][0], B[3][1], "f-line", D);
    if (withPyr === true) {
      const S = [(F[3][0] + B[2][0]) / 2, (F[3][1] + B[2][1]) / 2], H = [(F[0][0] + B[1][0]) / 2, (F[0][1] + B[1][1]) / 2];
      g += '<polygon points="' + [F[0], F[1], S].map((p) => p.join(",")).join(" ") + '" fill="var(--margin)" fill-opacity="0.18"/>' + '<polygon points="' + [F[1], B[1], S].map((p) => p.join(",")).join(" ") + '" fill="var(--margin)" fill-opacity="0.28"/>';
      const E = 'style="stroke:var(--margin);stroke-width:2.2"', Eh = 'style="stroke:var(--margin);stroke-width:1.6" stroke-dasharray="5 4"';
      g += L(F[0][0], F[0][1], S[0], S[1], "f-line", E) + L(F[1][0], F[1][1], S[0], S[1], "f-line", E) + L(B[1][0], B[1][1], S[0], S[1], "f-line", E) + L(B[0][0], B[0][1], S[0], S[1], "f-line", Eh);
      g += L(S[0], S[1], H[0], H[1], "f-line", 'style="stroke:var(--ink-soft);stroke-width:1.2" stroke-dasharray="2 3"');
      g += '<circle cx="' + S[0] + '" cy="' + S[1] + '" r="3" fill="var(--margin)"/>';
    }
    /* 28.11 (commentaire de l'auteur sur racprop 4 : « un dessin aussi ici ») : withPyr === "diag" → diagonale d'une face (d)
       et diagonale du cube (D), sans valeur. */
    if (withPyr === "diag") {
      const A = 'style="stroke:var(--margin);stroke-width:2.2"';
      g += L(F[3][0], F[3][1], F[1][0], F[1][1], "f-line", A) + L(F[0][0], F[0][1], B[2][0], B[2][1], "f-line", 'style="stroke:var(--ok);stroke-width:2.4" stroke-dasharray="7 4"'); /* 28.11 (enseignant) : D d'une autre couleur que d, pointillés gardés */
      g += t(x + s * 0.72 + 6, y + s * 0.72 + 12, "d", "f-accent f-txt", "start") + t(F[0][0] + (B[2][0] - F[0][0]) * 0.75 + 8, F[0][1] + (B[2][1] - F[0][1]) * 0.75 + 4, "D", "f-txt", "start").replace("<text ", '<text style="fill:var(--ok);font-weight:700" ');
      return svg(300, 190, g + t(x + s / 2, y + s + 20, la) + t(x + s + dx / 2 + 8, y + s + dy / 2 + 8, la, "f-txt", "start"), "cube : diagonale d'une face d et diagonale du cube D");
    }
    return svg(300, 190, g + t(x + s / 2, y + s + 20, la) + t(x + s + dx / 2 + 8, y + s + dy / 2 + 8, la, "f-txt", "start") + t(x - 8, y + s / 2, la, "f-txt", "end"), withPyr ? "pyramide inscrite dans un cube" : "cube");
  }
  /* 28.11 (commentaire de l'auteur sur polyreg 2 : « il faudrait une figure ici ») : polygone à n côtés (pas forcément
     régulier) découpé en n − 2 triangles par les diagonales issues d'un sommet. */
  function polyTri(n) {
    const cx = 150, cy = 92, pts = Array.from({ length: n }, (_, i) => { const a = (2 * Math.PI * i) / n - Math.PI / 2, r = 74 * (1 + 0.1 * Math.sin(3 * i + 1)); return [+(cx + r * Math.cos(a)).toFixed(1), +(cy + r * Math.sin(a) * 0.95).toFixed(1)]; });
    let g = "";
    for (let i = 1; i < n - 1; i++) g += '<polygon points="' + [pts[0], pts[i], pts[i + 1]].map((p) => p.join(",")).join(" ") + '" fill="var(--margin)" fill-opacity="' + (i % 2 ? 0.08 : 0.25) + '" stroke="none"/>';
    g += P(pts, "f-shape");
    for (let i = 2; i < n - 1; i++) g += L(pts[0][0], pts[0][1], pts[i][0], pts[i][1], "f-line", 'style="stroke:var(--margin);stroke-width:1.6" stroke-dasharray="5 4"');
    g += '<circle cx="' + pts[0][0] + '" cy="' + pts[0][1] + '" r="3.5" fill="var(--margin)"/>';
    return svg(300, 185, g, "polygone à " + n + " côtés découpé en triangles depuis un sommet");
  }
  /* 28.11 (audit des figures) : o.apo = apothème (hauteur de la face avant, du sommet au milieu de l'arête de base),
     o.edge = arête latérale (avant droite) ; lh vide ou absent : pas de hauteur dessinée. */
  function pyramid(lc, lh, o = {}) {
    let b = P([[60, 140], [200, 140], [250, 110], [110, 110]], "f-shape2") + P([[60, 140], [200, 140], [150, 20]], "f-shape") + P([[200, 140], [250, 110], [150, 20]], "f-shape2");
    if (lh) b += L(155, 125, 150, 20, "f-accent", 'stroke-dasharray="5 4"');
    if (o.apo) b += L(150, 20, 130, 140, "f-line", 'style="stroke:var(--blue);stroke-width:2"') + '<path d="M121,140 L121,131.5 L129,131" class="f-line" fill="none"/>' + t(103, 124, o.apo, "f-blue f-txt", "middle", 13);
    if (o.edge) b += t(187, 104, o.edge, "f-txt", "start", 13);
    // 24.11 (galerie : « h = … » coupait l'arête de droite) : à gauche de la hauteur, dans le bas de la face avant.
    return svg(300, 162, b + t(130, 158, lc) + (lh ? (o.apo ? t(157, 134, lh, "f-accent f-txt", "start", 12) : t(147, 112, lh, "f-accent f-txt", "end")) : ""), o.apo ? "pyramide et apothème" : "pyramide");
  }
  // Cône (24.11, galerie) : proportions réelles rayon / hauteur quand elles sont connues (« r = 8 », « h = 3 » ; « g = … »
  // donne la hauteur par Pythagore ; « d = … » : diamètre dessiné en entier). Inconnue (« ? », « h ») : forme d'origine.
  function cone(lr, lh) {
    const isD = /^\s*d\b/.test(String(lr || "")), v = num(lr), r0 = v == null ? null : isD ? v / 2 : v;
    let hv = /^\s*g\b/.test(String(lh || "")) ? (num(lh) && r0 && num(lh) > r0 ? Math.sqrt(num(lh) ** 2 - r0 ** 2) : null) : num(lh);
    let R = 80, H = 110, forced = false;
    if (r0 && hv) { const u = Math.min(100 / r0, 120 / hv); R = r0 * u; H = hv * u; if (R < 30) { forced = R < 21; R = 30; } if (H < 40) { forced = forced || H < 28; H = 40; } }
    /* 28.11 (audit des figures) : étiquette de hauteur trop large pour l'intérieur du cône → cote à gauche ; le cône est
       réduit (mêmes proportions) pour que l'étiquette tienne à gauche de la cote. */
    const lw = String(lh || "").length * 7.5, wide = lw > R * 0.45 - 10;
    if (wide && H >= 75 && 128 - R - lw < 4) { const f = Math.max(0.45, (124 - lw) / R); R *= f; H = Math.max(75, H * f); }
    const by = 20 + H, ry = Math.max(8, R * 0.22);
    let b = '<ellipse cx="150" cy="' + f1(by) + '" rx="' + f1(R) + '" ry="' + f1(ry) + '" class="f-shape2"/>' + P([[150 - R, by], [150 + R, by], [150, 20]].map((p) => p.map(f1)), "f-shape") + L(150, f1(by), 150, 20, "f-accent", 'stroke-dasharray="5 4"') + L(f1(isD ? 150 - R : 150), f1(by), f1(150 + R), f1(by), "f-accent");
    const flat = H < 75, thin = R < 75; // cône aplati ou étroit : étiquettes hors des flancs
    b += isD || flat || thin ? t(f1(isD ? 150 : 150 + R / 2), f1(by + ry + 16), lr, "f-accent f-txt") : t(f1(150 + R / 2), f1(by - 6), lr, "f-accent f-txt");
    const cx = 150 - R - 14; // cône étroit : hauteur en cote à gauche
    const lhT = (thin || wide) && !flat ? L(f1(cx), 20, f1(cx), f1(by)) + L(f1(cx - 5), 20, f1(cx + 5), 20) + L(f1(cx - 5), f1(by), f1(cx + 5), f1(by)) + t(f1(cx - 8), f1(20 + H / 2 + 5), lh, "f-accent f-txt", "end") : t(156, f1(20 + H * (flat ? 0.72 : 0.45) + 4), lh, "f-accent f-txt", "start", flat ? 12 : 14);
    return svg(300, Math.round(by + ry + (isD || flat || thin ? 24 : 12)), b + lhT + (forced ? noScale(296, Math.round(by + ry + 8)) : ""), "cône");
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
  // kind : "" ou "rect" (forme, jamais affichée : « (rect) » apparaissait dans la figure, galerie 24.11), « 1:200 »
  // (échelle, affichée seule) ou « ? » (facteur demandé : la figure ne le donne pas, taille indicative).
  function scaling(k, kind) {
    const ask = kind === "?", s = 30, S = 30 * Math.min(ask ? (k > 1 ? 2.2 : 0.6) : k, 4);
    const lab = ask ? "× ?" : /^1\s*:/.test(kind || "") ? "échelle " + kind : "× " + String(k).replace(".", ",");
    let b = '<rect x="16" y="' + (130 - s) + '" width="' + s + '" height="' + s + '" class="f-shape"/>' + '<rect x="' + (80) + '" y="' + (130 - S) + '" width="' + S + '" height="' + S + '" class="f-fill2"/>';
    return svg(340, 140, b + t(31, 124 - s, "1") + t(80 + S + 10, 130 - S / 2, lab, "f-accent f-txt", "start"), "agrandissement");
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
  function tiles(a, b, la, lb) { // 24.11 : rectangle décalé à droite (le robot : l'étiquette de gauche « 56 cm » sortait du cadre)
    const k = Math.min(220 / a, 120 / b), W = a * k, H = b * k, s = Math.min(W, H) / 3.2;
    let g = '<rect x="64" y="20" width="' + W.toFixed(1) + '" height="' + H.toFixed(1) + '" class="f-fill2" stroke="var(--ink)" stroke-width="1.5"/>';
    g += '<rect x="64" y="20" width="' + s.toFixed(1) + '" height="' + s.toFixed(1) + '" fill="none" stroke="var(--blue)" stroke-width="1.5" stroke-dasharray="4 3"/>';
    g += t(64 + s / 2, 25 + s / 2, "?", "f-accent f-txt");
    return svg(300, H + 50, g + t(64 + W / 2, H + 40, la) + t(58, 24 + H / 2, lb, "f-txt", "end"), "rectangle à paver avec des carrés");
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
  // Triangle rectangle avec angle marqué en A (trigonométrie) ; labels : [adjacent (horizontal), opposé (vertical), hypoténuse].
  // 24.11 (galerie) : le triangle était toujours le même (≈ 22°) ; il est maintenant construit avec l'angle réel,
  // lu dans l'étiquette (« 55° ») ou, si l'angle est inconnu (« α ? »), déduit de deux côtés numériques.
  // deg (facultatif) impose l'angle. Bornes 12°–78° pour rester lisible.
  function trigTriangle(lab, angle, deg) {
    const num = (s) => { const m = /^\s*(\d+(?:[.,]\d+)?)\s*(?:mm|cm|dm|m|km)?\s*$/.exec(String(s || "")); return m ? +m[1].replace(",", ".") : null; };
    let th = deg;
    if (th == null) { const m = /^\s*(\d+(?:[.,]\d+)?)\s*°\s*$/.exec(String(angle || "")); if (m) th = +m[1].replace(",", "."); }
    if (th == null) {
      const [a, o, h] = (lab || []).map(num), R = 180 / Math.PI;
      if (a && o) th = Math.atan(o / a) * R; else if (a && h && a < h) th = Math.acos(a / h) * R; else if (o && h && o < h) th = Math.asin(o / h) * R;
    }
    th = th == null || !isFinite(th) ? 22.25 : Math.max(12, Math.min(78, th));
    const r = (th * Math.PI) / 180, tn = Math.tan(r), W = Math.min(220, 130 / tn), H = W * tn;
    const x0 = Math.round(160 - W / 2 - 10), A = [x0, H + 22], B = [x0 + W, H + 22], C = [x0 + W, 22], f1 = (v) => v.toFixed(1);
    const ra = Math.min(40, W * 0.45), ex = A[0] + ra * Math.cos(r), ey = A[1] - ra * Math.sin(r), lr = ra + 8, lx = A[0] + lr * Math.cos(r / 2), ly = A[1] - lr * Math.sin(r / 2);
    let b = P([A, B, C].map((p) => p.map(f1)), "f-shape") + '<rect x="' + f1(B[0] - 12) + '" y="' + f1(B[1] - 12) + '" width="12" height="12" class="f-line" fill="none"/>';
    b += '<path d="M' + f1(A[0] + ra) + "," + f1(A[1]) + " A" + ra + "," + ra + " 0 0,0 " + f1(ex) + "," + f1(ey) + '" class="f-accent" fill="none" stroke-width="2"/>' + (th > 55 ? t(f1(A[0] - 8), f1(A[1] - 2), angle, "f-accent f-txt", "end", 13) : t(f1(lx + 2), f1(ly + 5), angle, "f-accent f-txt", "start", 13)); // angle raide : étiquette à gauche du sommet
    b += t(f1(A[0] + W / 2), f1(A[1] + 20), lab[0]) + t(f1(B[0] + 12), f1(22 + H / 2 + 4), lab[1], "f-txt", "start") + t(f1(A[0] + W / 2 - 10), f1(22 + H / 2 - 6), lab[2], "f-txt", "end");
    return svg(320, Math.round(H + 52), b, "triangle rectangle et angle");
  }
  // Cercle, angle au centre et angle inscrit.
  function circleAngles(lCenter, lInscribed) {
    // Angles marqués par un secteur (commentaire testeur du 21.11) : bleu au centre O, rouge au point C du cercle.
    const cx = 150, cy = 92, r = 74, pt = (deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy - r * Math.sin((deg * Math.PI) / 180)];
    // 24.11 (galerie : angle au centre de 90° dessiné à 120°) : A et B placés pour que l'angle au centre soit le vrai
    // (lu dans l'une ou l'autre étiquette : « 90° » au centre, ou le double de l'angle inscrit), borné à 30°–170°.
    const deg = (s) => { const m = /^\s*(\d+(?:[.,]\d+)?)\s*°\s*$/.exec(String(s || "")); return m ? +m[1].replace(",", ".") : null; };
    let th = deg(lCenter) != null ? deg(lCenter) : deg(lInscribed) != null ? 2 * deg(lInscribed) : 120;
    th = Math.max(30, Math.min(170, th));
    const A = pt(270 - th / 2), B = pt(270 + th / 2), C = pt(95), O = [cx, cy];
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
  // Triangle ABC tracé avec ses vrais angles (24.11, galerie) : [AB] horizontal en bas, C au-dessus, cadré dans la boîte
  // [x0, x0 + W] × [y0, y0 + H]. Angles en degrés aux sommets A et B. Renvoie les trois sommets.
  function triPts(al, be, x0 = 30, y0 = 30, W = 260, H = 110) {
    const ra = (al * Math.PI) / 180, rb = (be * Math.PI) / 180, b = Math.sin(rb) / Math.sin(ra + rb);
    const C = [b * Math.cos(ra), b * Math.sin(ra)], xs = [0, 1, C[0]], lo = Math.min(...xs), wd = Math.max(...xs) - lo;
    const u = Math.min(W / wd, H / C[1]), ox = x0 + (W - wd * u) / 2 - lo * u, oy = y0 + C[1] * u;
    return [[ox, oy], [ox + u, oy], [ox + C[0] * u, oy - C[1] * u]];
  }
  // Angles d'un triangle à partir de ce qu'on connaît : côtés s = [a, b, c] (a opposé à A…) et angles g = [α, β, γ] (null si inconnus).
  // Renvoie [α, β] ou null.
  function solveTri(s, g) {
    s = s.slice(); g = g.slice();
    const R = 180 / Math.PI, D = Math.PI / 180;
    for (let it = 0; it < 4; it++) {
      const ka = g.filter((x) => x != null).length;
      if (ka === 2) { const i = g.indexOf(null); g[i] = 180 - g.reduce((a, x) => a + (x || 0), 0); }
      if (g.every((x) => x != null)) break;
      if (s.every((x) => x)) { for (let i = 0; i < 3; i++) { const [p, q] = [s[(i + 1) % 3], s[(i + 2) % 3]], c = (p * p + q * q - s[i] * s[i]) / (2 * p * q); if (Math.abs(c) > 1) return null; g[i] = Math.acos(c) * R; } break; }
      for (let i = 0; i < 3; i++) if (g[i] != null) {
        const j = (i + 1) % 3, k = (i + 2) % 3;
        if (!s[i] && s[j] && s[k]) s[i] = Math.sqrt(s[j] ** 2 + s[k] ** 2 - 2 * s[j] * s[k] * Math.cos(g[i] * D)); // angle entre deux côtés connus
        else if (s[i]) [j, k].forEach((m) => { if (g[m] == null && s[m] && g.filter((x) => x != null).length < 2) { const v = (s[m] * Math.sin(g[i] * D)) / s[i]; if (v <= 1) g[m] = Math.asin(v) * R; } });
      }
    }
    if (g[0] == null || g[1] == null) {
      const i = g.findIndex((x) => x != null); if (i < 0) return null;
      const rest = (180 - g[i]) / 2; g = g.map((x, m) => (m === i ? x : m === (i + 1) % 3 ? rest * 1.15 : rest * 0.85));
    }
    return g[0] > 0 && g[1] > 0 && g[0] + g[1] < 180 ? [g[0], g[1]] : null;
  }
  // Marque d'angle droit au sommet V entre les directions vers P et Q.
  function rightMark(V, P1, Q1, s = 11) {
    const u = (P) => { const d = Math.hypot(P[0] - V[0], P[1] - V[1]); return [(P[0] - V[0]) / d, (P[1] - V[1]) / d]; }, a = u(P1), b = u(Q1);
    return '<polyline points="' + [[V[0] + a[0] * s, V[1] + a[1] * s], [V[0] + (a[0] + b[0]) * s, V[1] + (a[1] + b[1]) * s], [V[0] + b[0] * s, V[1] + b[1] * s]].map((p) => p.map(f1).join(",")).join(" ") + '" class="f-line" fill="none"/>';
  }
  // Arc d'angle au sommet V entre les directions vers P et Q (le plus petit des deux arcs).
  function arcMark(V, P1, Q1, r = 16) {
    const a1 = Math.atan2(P1[1] - V[1], P1[0] - V[0]), a2 = Math.atan2(Q1[1] - V[1], Q1[0] - V[0]);
    let d = a2 - a1; while (d <= -Math.PI) d += 2 * Math.PI; while (d > Math.PI) d -= 2 * Math.PI;
    return '<path d="M' + f1(V[0] + r * Math.cos(a1)) + "," + f1(V[1] + r * Math.sin(a1)) + " A" + r + "," + r + " 0 0," + (d > 0 ? 1 : 0) + " " + f1(V[0] + r * Math.cos(a2)) + "," + f1(V[1] + r * Math.sin(a2)) + '" class="f-accent" fill="none" stroke-width="2"/>';
  }
  // Étiquette d'un côté [P, Q] placée à l'extérieur (loin du point G intérieur).
  function sideLab(P1, Q1, G, s, cls = "f-txt", size = 14, W = 300) {
    if (!s) return "";
    const M = [(P1[0] + Q1[0]) / 2, (P1[1] + Q1[1]) / 2]; let nx = Q1[1] - P1[1], ny = -(Q1[0] - P1[0]); const d = Math.hypot(nx, ny); nx /= d; ny /= d;
    if (nx * (M[0] - G[0]) + ny * (M[1] - G[1]) < 0) { nx = -nx; ny = -ny; }
    // 24.11 (robot : « a = 4 » sortait du cadre à droite) : largeur estimée, l'étiquette reste dans le cadre (≥ 300 px de large).
    let x = M[0] + nx * 12, an = nx > 0.35 ? "start" : nx < -0.35 ? "end" : "middle"; const w = String(s).length * size * 0.56;
    if (an === "start" && x + w > W - 4) { an = "end"; x = W - 4; } else if (an === "end" && x - w < 4) { an = "start"; x = 4; } else if (an === "middle") x = Math.min(Math.max(x, 4 + w / 2), W - 4 - w / 2);
    return t(f1(x), f1(M[1] + ny * 12 + (ny > 0.5 ? 6 : 4)), s, cls, an, size);
  }
  // Triangle quelconque avec étiquettes [a, b, c, angle(s), sommet de l'angle].
  // 24.11 (galerie : 90° dessiné aigu, 120° dessiné aigu, longueurs non respectées) : les angles et côtés donnés
  // (« a = 10 », « γ = 120° », « α = 40°, β = 60° ») fixent la forme ; angle droit marqué d'une équerre.
  function anyTriangle(lab) {
    const g = [null, null, null], nm = { "α": 0, "β": 1, "γ": 2 };
    String(lab[3] || "").replace(/([αβγ])\s*=\s*(\d+(?:[.,]\d+)?)\s*°/g, (_, l, v) => (g[nm[l]] = +v.replace(",", ".")));
    const sol = solveTri([0, 1, 2].map((i) => num(lab[i]) || null), g) || [54, 31.4];
    const [A, B, C] = triPts(sol[0], sol[1], 44, 30, 216, 108), /* 24.11 : marges pour les étiquettes de côté (robot : « a = 4 » hors cadre) */ G = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3], V = [A, B, C];
    let gg = P([A, B, C].map((p) => p.map(f1)), "f-shape") + t(f1(A[0] - 12), f1(A[1] + 6), "A") + t(f1(B[0] + 12), f1(B[1] + 6), "B") + t(f1(C[0]), f1(C[1] - 8), "C");
    const ang = [sol[0], sol[1], 180 - sol[0] - sol[1]];
    ang.forEach((a, i) => { if (Math.abs(a - 90) < 0.5 && g[i] != null) gg += rightMark(V[i], V[(i + 1) % 3], V[(i + 2) % 3]); });
    gg += sideLab(B, C, G, lab[0], "f-txt", 14, 320) + sideLab(A, C, G, lab[1], "f-txt", 14, 320) + sideLab(A, B, G, lab[2], "f-txt", 14, 320);
    if (lab[3]) {
      // Arc à l'angle nommé ; étiquette dans l'angle (A, B) ou vers le centre du triangle (C, souvent étroit).
      const i = lab[4] === "C" ? 2 : lab[4] === "B" ? 1 : 0, P1 = V[i];
      if (!(Math.abs(ang[i] - 90) < 0.5 && g[i] != null)) gg += arcMark(P1, V[(i + 1) % 3], V[(i + 2) % 3], 16);
      gg += i === 2 ? t(f1(G[0]), f1(G[1] + 8), lab[3], "f-accent f-txt", "middle", 12) : t(f1(i === 0 ? P1[0] + 24 : P1[0] - 24), f1(P1[1] - 7), lab[3], "f-accent f-txt", i === 0 ? "start" : "end", 12);
    }
    return svg(320, 168, gg, "triangle quelconque");
  }
  // Diagramme en bâtons d'une petite série.
  // labels (24.11, galerie : sous les barres, les effectifs au lieu des notes) : valeurs de la série sous les barres,
  // effectifs (hauteurs) écrits au-dessus des barres. Sans labels : la valeur sous chaque barre (série brute).
  function barChart(values, labels) {
    const max = Math.max(...values), w = 280 / values.length, top = labels ? 16 : 0;
    let g = L(20, 140, 300, 140);
    values.forEach((v, i) => { const hh = (v / max) * (110 - top), cx = 24 + i * w + (w - 8) / 2; g += '<rect x="' + (24 + i * w) + '" y="' + (140 - hh) + '" width="' + (w - 8) + '" height="' + hh + '" rx="3" class="' + (i % 2 ? "f-fill2" : "f-fill") + '"/>' + t(cx, 156, String(labels ? labels[i] : v).replace(".", ","), "f-txt", "middle", 11) + (labels ? t(cx, 136 - hh, String(v).replace(".", ","), "f-accent f-txt", "middle", 11) : ""); });
    return svg(320, 164, g, "série statistique");
  }

  // Cylindre (13.11, retour testeur) : base arrière en pointillés, rayon sur la face du haut avec son étiquette
  // au-dessus du bord (sans chevauchement), hauteur en cote à droite.
  // 24.11 (galerie : « cylindres tous identiques ») : proportions réelles rayon / hauteur quand les deux sont donnés.
  function cylinder(lr, lh) {
    const r0 = num(lr), h0 = num(lh), X0 = 135;
    let R = 70, H = 100, forced = false;
    if (r0 && h0) { const u = Math.min(80 / r0, 120 / h0); R = r0 * u; H = h0 * u; if (R < 26) { forced = R < 18; R = 26; } if (H < 30) { forced = forced || H < 20; H = 30; } }
    const ry = Math.max(7, R * 0.23), top = 22 + ry, bot = top + H, xl = X0 - R, xr = X0 + R;
    const A = (sw, cls, extra = "") => '<path d="M' + f1(xl) + " " + f1(bot) + " A" + f1(R) + " " + f1(ry) + " 0 0 " + sw + " " + f1(xr) + " " + f1(bot) + '" class="' + cls + '" fill="none" ' + extra + "/>";
    let g = '<path d="M' + f1(xl) + " " + f1(top) + " L" + f1(xl) + " " + f1(bot) + " A" + f1(R) + " " + f1(ry) + " 0 0 0 " + f1(xr) + " " + f1(bot) + " L" + f1(xr) + " " + f1(top) + ' Z" fill="var(--blue-soft)" stroke="none"/>';
    g += A(1, "f-line", 'stroke-dasharray="5 4"') + A(0, "f-line") + L(f1(xl), f1(top), f1(xl), f1(bot)) + L(f1(xr), f1(top), f1(xr), f1(bot));
    g += '<ellipse cx="' + X0 + '" cy="' + f1(top) + '" rx="' + f1(R) + '" ry="' + f1(ry) + '" class="f-shape2"/>' + '<circle cx="' + X0 + '" cy="' + f1(top) + '" r="2.5" fill="var(--ink)"/>' + L(X0, f1(top), f1(xr), f1(top), "f-accent", 'stroke-width="2.2"');
    const cx = xr + 20;
    g += L(f1(cx), f1(top), f1(cx), f1(bot)) + L(f1(cx - 5), f1(top), f1(cx + 5), f1(top)) + L(f1(cx - 5), f1(bot), f1(cx + 5), f1(bot));
    return svg(300, Math.round(bot + ry + 12), g + t(f1(X0 + R / 2), f1(top - ry - 5), lr, "f-accent f-txt") + t(f1(cx + 10), f1((top + bot) / 2 + 5), lh, "f-txt", "start") + (forced ? noScale(296, Math.round(bot + ry + 8)) : ""), "cylindre");
  }

  function unitLine(axis, v, label) {
    const cx = 150, cy = 95, r = 75;
    let g = L(60, cy, 240, cy) + L(cx, 10, cx, 180) + '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" class="f-shape"/>';
    if (axis === "y") g += L(50, cy - v * r, 250, cy - v * r, "f-accent", 'stroke-width="2" stroke-dasharray="6 4"') + t(252, cy - v * r + 4, label, "f-accent f-txt", "start", 12);
    else g += L(cx + v * r, 8, cx + v * r, 182, "f-accent", 'stroke-width="2" stroke-dasharray="6 4"') + t(cx + v * r + 4, 18, label, "f-accent f-txt", "start", 12);
    return svg(320, 190, g + t(cx + r + 8, cy + 14, "1", "f-txt", "start", 11), "cercle trigonométrique");
  }

  /* 28.11 (audit des figures, /contenu figures) : figures pour des questions qui n'en avaient pas. Toujours les seules
     données de l'énoncé ; jamais la réponse ni une valeur calculée. */
  // Hexagone régulier découpé en six triangles équilatéraux depuis le centre (un triangle teinté) ; ls = côté.
  function hexTri(ls) {
    const cx = 150, cy = 86, r = 72, pts = Array.from({ length: 6 }, (_, i) => [+(cx + r * Math.cos((Math.PI / 3) * i)).toFixed(1), +(cy - r * Math.sin((Math.PI / 3) * i)).toFixed(1)]);
    let g = P(pts, "f-shape") + '<polygon points="' + [[cx, cy], pts[4], pts[5]].map((p) => p.join(",")).join(" ") + '" fill="var(--margin)" fill-opacity="0.25" stroke="none"/>';
    pts.forEach((p) => (g += L(cx, cy, p[0], p[1], "f-line", 'stroke-dasharray="5 4"')));
    return svg(300, 182, g + '<circle cx="' + cx + '" cy="' + cy + '" r="3" class="f-dot"/>' + t(cx, f1(pts[4][1] + 20), ls), "hexagone régulier découpé en six triangles équilatéraux");
  }
  // Disque inscrit dans un carré : la partie hors du disque est teintée ; ls = côté du carré.
  function squareDisk(ls) {
    const x = 85, y = 12, s = 130;
    const g = '<rect x="' + x + '" y="' + y + '" width="' + s + '" height="' + s + '" style="fill:var(--margin);fill-opacity:0.25;stroke:var(--ink);stroke-width:1.6"/>' + '<circle cx="' + (x + s / 2) + '" cy="' + (y + s / 2) + '" r="' + s / 2 + '" class="f-shape"/>';
    return svg(300, 166, g + t(x + s / 2, y + s + 20, ls), "disque inscrit dans un carré");
  }
  // Gélule (vue de profil) : cylindre terminé par deux demi-boules ; d = diamètre, L = longueur totale (vd, vL : valeurs pour l'échelle).
  function capsule(ld, lL, vd, vL) {
    const u = Math.min(230 / vL, 90 / vd), r = (vd * u) / 2, w = vL * u, x0 = 150 - w / 2, x1 = 150 + w / 2, cy = r + 28;
    let g = '<path d="M' + f1(x0 + r) + "," + f1(cy - r) + " L" + f1(x1 - r) + "," + f1(cy - r) + " A" + f1(r) + "," + f1(r) + " 0 0 1 " + f1(x1 - r) + "," + f1(cy + r) + " L" + f1(x0 + r) + "," + f1(cy + r) + " A" + f1(r) + "," + f1(r) + " 0 0 1 " + f1(x0 + r) + "," + f1(cy - r) + ' Z" class="f-shape"/>';
    g += L(f1(x0 + r), f1(cy - r), f1(x0 + r), f1(cy + r), "f-line", 'stroke-dasharray="4 4"') + L(f1(x1 - r), f1(cy - r), f1(x1 - r), f1(cy + r), "f-line", 'stroke-dasharray="4 4"');
    g += L(150, f1(cy - r), 150, f1(cy + r), "f-accent", 'stroke-width="2"') + t(150, f1(cy - r - 7), ld, "f-accent f-txt", "middle", 13);
    const yb = cy + r + 16;
    g += L(f1(x0), yb, f1(x1), yb) + L(f1(x0), yb - 5, f1(x0), yb + 5) + L(f1(x1), yb - 5, f1(x1), yb + 5) + t(150, yb + 18, lL);
    return svg(300, Math.round(yb + 26), g, "gélule : cylindre et deux demi-boules");
  }
  // Cornet de glace : cône pointe en bas, surmonté d'une demi-boule de même rayon (vr, vh : valeurs pour l'échelle).
  function iceCone(lr, lh, vr, vh) {
    const u = Math.min(70 / vr, 150 / (vh + vr)), R = vr * u, H = vh * u, ry = Math.max(6, R * 0.22), by = 14 + R, cx = 168;
    let g = '<path d="M' + f1(cx - R) + "," + f1(by) + " A" + f1(R) + "," + f1(R) + " 0 0 1 " + f1(cx + R) + "," + f1(by) + ' Z" class="f-shape2"/>';
    g += P([[cx - R, by], [cx + R, by], [cx, by + H]].map((p) => p.map(f1)), "f-shape") + '<ellipse cx="' + cx + '" cy="' + f1(by) + '" rx="' + f1(R) + '" ry="' + f1(ry) + '" class="f-line"/>';
    g += L(cx, f1(by), f1(cx + R), f1(by), "f-accent", 'stroke-width="2"') + L(cx, f1(by), cx, f1(by + H), "f-accent", 'stroke-dasharray="5 4"');
    const xl = cx - R - 14; // hauteur du cône en cote à gauche, rayon à droite du bord (sans chevauchement)
    g += L(f1(xl), f1(by), f1(xl), f1(by + H)) + L(f1(xl - 5), f1(by), f1(xl + 5), f1(by)) + L(f1(xl - 5), f1(by + H), f1(xl + 5), f1(by + H)) + t(f1(xl - 7), f1(by + H / 2 + 5), lh, "f-accent f-txt", "end", 13);
    g += t(f1(cx + R + 6), f1(by + 4), lr, "f-accent f-txt", "start", 12);
    return svg(300, Math.round(by + H + 14), g, "cornet : cône et demi-boule");
  }
  // Cube percé d'un trou cylindrique de part en part (perpendiculaire à la face avant) ; k = rayon / arête (pour l'échelle).
  function cubeHole(la, lr, k) {
    const x = 70, y = 50, s = 110, dx = 39, dy = -39, D = 'stroke-dasharray="5 4"', rr = Math.max(8, Math.min(0.42, k) * s), cx = x + s / 2, cy = y + s / 2;
    const F = [[x, y + s], [x + s, y + s], [x + s, y], [x, y]], B = F.map((p) => [p[0] + dx, p[1] + dy]);
    let g = P(F, "f-shape") + P([F[3], F[2], B[2], B[3]], "f-shape2") + P([F[1], B[1], B[2], F[2]], "f-shape2");
    g += L(B[0][0], B[0][1], F[0][0], F[0][1], "f-line", D) + L(B[0][0], B[0][1], B[1][0], B[1][1], "f-line", D) + L(B[0][0], B[0][1], B[3][0], B[3][1], "f-line", D);
    g += '<circle cx="' + f1(cx + dx) + '" cy="' + f1(cy + dy) + '" r="' + f1(rr) + '" class="f-line" stroke-dasharray="4 4"/>' + '<circle cx="' + cx + '" cy="' + cy + '" r="' + f1(rr) + '" class="f-soft"/>';
    g += L(cx, cy, f1(cx + rr), cy, "f-accent", 'stroke-width="2"') + '<circle cx="' + cx + '" cy="' + cy + '" r="2.5" fill="var(--ink)"/>';
    return svg(300, 190, g + t(f1(cx + rr / 2), cy - 6, lr, "f-accent f-txt", "middle", 13) + t(x + s / 2, y + s + 20, la) + t(x + s + dx / 2 + 8, y + s + dy / 2 + 8, la, "f-txt", "start"), "cube percé d'un trou cylindrique");
  }
  // Demi-boule (bol) : bord en ellipse, rayon marqué.
  function halfBall(lr) {
    const cx = 150, cy = 42, R = 90, ry = 18;
    let g = '<path d="M' + (cx - R) + "," + cy + " A" + R + "," + R + " 0 0 0 " + (cx + R) + "," + cy + ' Z" class="f-shape"/>' + '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + R + '" ry="' + ry + '" class="f-shape2"/>';
    g += L(cx, cy, cx + R, cy, "f-accent", 'stroke-width="2"') + '<circle cx="' + cx + '" cy="' + cy + '" r="2.5" fill="var(--ink)"/>';
    return svg(300, cy + R + 12, g + t(cx + R / 2, cy - ry - 6, lr, "f-accent f-txt"), "demi-boule");
  }
  // Boule coupée par un plan (vue en coupe) : rayon R de la boule, distance d du centre au plan, rayon r de la section.
  // vR, vd : valeurs pour l'échelle (la position du plan suit l'énoncé) ; étiquettes vides = non affichées.
  function ballCut(vR, vd, labs = {}) {
    const cx = 150, cy = 92, R = 76, e = Math.max(0.12, Math.min(0.88, vd / vR)) * R, hy = cy - e, hw = Math.sqrt(R * R - e * e);
    let g = '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" class="f-shape"/>' + '<ellipse cx="' + cx + '" cy="' + f1(hy) + '" rx="' + f1(hw) + '" ry="' + f1(Math.max(5, hw * 0.18)) + '" class="f-shape2"/>';
    g += L(cx, cy, cx, f1(hy), "f-line", 'stroke-dasharray="5 4"') + L(cx, cy, f1(cx + hw), f1(hy), "f-line", 'style="stroke:var(--blue);stroke-width:2"') + L(cx, f1(hy), f1(cx + hw), f1(hy), "f-accent", 'stroke-width="2"');
    g += '<path d="M' + (cx + 8) + "," + f1(hy) + " L" + (cx + 8) + "," + f1(hy + 8) + " L" + cx + "," + f1(hy + 8) + '" class="f-line" fill="none"/>' + '<circle cx="' + cx + '" cy="' + cy + '" r="3" class="f-dot"/>' + t(cx - 8, cy + 14, "O", "f-txt", "end", 13);
    if (labs.d) g += t(cx - 6, f1((cy + hy) / 2 + 4), labs.d, "f-txt", "end", 13);
    if (labs.R) g += t(f1(cx + hw / 2 + 10), f1((cy + hy) / 2 + 12), labs.R, "f-blue f-txt", "start", 13);
    if (labs.r) g += t(f1(cx + hw / 2), f1(hy - 9), labs.r, "f-accent f-txt", "middle", 13);
    return svg(300, 180, g, "boule coupée par un plan");
  }

  return { num, triPts, solveTri, rightMark, arcMark, sideLab, unitLine, cylinder, unitCircle, anyTriangle, barChart, parabola, trigTriangle, circleAngles, numberLine, fractionBars, percentBar, balance, rightTriangle, thales, rectFig, triangleFig, trapezoid, disk, square, box, cube, polyTri, pyramid, cone, hexTri, squareDisk, capsule, iceCone, cubeHole, halfBall, ballCut, road, items, scaling, lineGraph, blocks, fractionOf, prioSteps, sciScale, areaSquare, tiles, fmt };
})();
