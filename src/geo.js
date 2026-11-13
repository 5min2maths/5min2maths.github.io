// Figures de géométrie (13.11) : petit constructeur en coordonnées mathématiques (y vers le haut), mise à
// l'échelle automatique. Étiquettes de côtés placées vers l'extérieur de la figure ; « ? » en couleur d'accent.
// Une figure illustre ou aide à démarrer : elle ne donne jamais la réponse (contrôle dans tests/test.html).
function GEO() {
  const pts = [], back = [], ops = [];
  const P = (p) => (Array.isArray(p) ? p : g.p[p]);
  const g = {
    p: {},
    pt(name, x, y, show = true) { g.p[name] = [x, y]; pts.push([x, y]); if (show) ops.push((T) => T.name(name, [x, y])); return g; },
    add(...ps) { ps.forEach((p) => pts.push(P(p))); return g; },
    poly(names, cls = "f-shape") { const ps = names.map(P); ps.forEach((p) => pts.push(p)); back.push((T) => '<polygon points="' + ps.map((p) => T.X(p) + "," + T.Y(p)).join(" ") + '" class="' + cls + '"/>'); return g; },
    seg(a, b, o = {}) { const A = P(a), B = P(b); ops.push((T) => '<line x1="' + T.X(A) + '" y1="' + T.Y(A) + '" x2="' + T.X(B) + '" y2="' + T.Y(B) + '" class="' + (o.cls || "f-line") + '"' + (o.dash ? ' stroke-dasharray="5 4"' : "") + (o.w ? ' stroke-width="' + o.w + '"' : "") + "/>"); return g; },
    side(a, b, label, o = {}) { if (o.draw) g.seg(a, b, o); const A = P(a), B = P(b); ops.push((T) => T.lab([(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], label, A, B, o.inside)); return g; },
    right(v, a, b) { const V = P(v), A = P(a), B = P(b); ops.push((T) => { const u = T.dir(V, A, 10), w = T.dir(V, B, 10), x = T.X(V), y = T.Y(V); return '<path d="M' + (x + u[0]) + "," + (y + u[1]) + " L" + (x + u[0] + w[0]) + "," + (y + u[1] + w[1]) + " L" + (x + w[0]) + "," + (y + w[1]) + '" class="f-line" fill="none"/>'; }); return g; },
    angle(v, a, b, label, o = {}) {
      const V = P(v), A = P(a), B = P(b);
      ops.push((T) => {
        const r = o.r || 20, u = T.dir(V, A, r), w = T.dir(V, B, r), x = T.X(V), y = T.Y(V);
        const cross = u[0] * w[1] - u[1] * w[0], m = T.dir(V, A, 1), n = T.dir(V, B, 1), bis = [m[0] + n[0], m[1] + n[1]], bl = Math.hypot(...bis) || 1;
        const ang = Math.acos(Math.max(-1, Math.min(1, m[0] * n[0] + m[1] * n[1]))), off = r + 14 + (ang < 0.45 ? 22 : 0);
        const lx = x + (bis[0] / bl) * off, ly = y + (bis[1] / bl) * off + 4;
        return '<path d="M' + (x + u[0]) + "," + (y + u[1]) + " A" + r + "," + r + " 0 0 " + (cross > 0 ? 1 : 0) + " " + (x + w[0]) + "," + (y + w[1]) + '" class="' + (/\?/.test(label) ? "f-accent" : "f-line") + '" fill="none"/>' + (label ? T.txt(lx, ly, label) : "");
      });
      return g;
    },
    circle(c, r, cls = "f-shape") { const C = P(c); pts.push([C[0] - r, C[1] - r], [C[0] + r, C[1] + r]); back.push((T) => '<circle cx="' + T.X(C) + '" cy="' + T.Y(C) + '" r="' + r * T.s + '" class="' + cls + '"/>'); return g; },
    dot(p) { const A = P(p); ops.push((T) => '<circle cx="' + T.X(A) + '" cy="' + T.Y(A) + '" r="3" class="f-dot"/>'); return g; },
    text(p, s, dx = 0, dy = 0) { const A = P(p); ops.push((T) => T.txt(T.X(A) + dx, T.Y(A) + dy, s)); return g; },
    svg(label = "figure", W = 300, Hmax = 190) {
      const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), m = 24, mx = 44;
      const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
      const s = Math.min((W - 2 * mx) / Math.max(x1 - x0, 1e-6), (Hmax - 2 * m) / Math.max(y1 - y0, 1e-6));
      const H = Math.round((y1 - y0) * s + 2 * m), ox = (W - (x1 - x0) * s) / 2;
      const cx = xs.reduce((a, b) => a + b, 0) / xs.length, cy = ys.reduce((a, b) => a + b, 0) / ys.length;
      const T = {
        s,
        X: (p) => +(ox + (p[0] - x0) * s).toFixed(1),
        Y: (p) => +(H - m - (p[1] - y0) * s).toFixed(1),
        dir(V, A, len) { const dx = (A[0] - V[0]) * s, dy = -(A[1] - V[1]) * s, l = Math.hypot(dx, dy) || 1; return [(dx / l) * len, (dy / l) * len]; },
        txt: (x, y, str, anchor = "middle") => '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" class="' + (/\?/.test(str) ? "f-accent f-txt" : "f-txt") + '" text-anchor="' + anchor + '" font-size="13">' + str + "</text>",
        name: (nm, p) => { const dx = p[0] - cx, dy = p[1] - cy, l = Math.hypot(dx, dy) || 1; return T.txt(T.X(p) + (dx / l) * 13, T.Y(p) - (dy / l) * 13 + 4, nm); },
        lab(mid, str, A, B, inside) {
          if (!str) return "";
          let nx = -(B[1] - A[1]), ny = B[0] - A[0];
          const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
          if ((mid[0] - cx) * nx + (mid[1] - cy) * ny < 0 !== !!inside) { nx = -nx; ny = -ny; }
          // côté presque vertical : texte aligné à gauche ou à droite du côté, pour ne pas le chevaucher
          if (Math.abs(nx) > 0.75) return T.txt(T.X(mid) + nx * 8, T.Y(mid) - ny * 8 + 4, str, nx > 0 ? "start" : "end");
          return T.txt(T.X(mid) + nx * 14, T.Y(mid) - ny * 14 + 4, str);
        },
      };
      return '<svg class="fig" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg">' + back.concat(ops).map((f) => f(T)).join("") + "</svg>";
    },
  };
  return g;
}

// ---------- Figures types ----------
const GF = {
  // Triangle rectangle en C ; la = côté [BC], lb = côté [AC], lc = hypoténuse ; angle optionnel en A.
  rightTri(a, b, { la = "", lb = "", lc = "", angA = "", names = true } = {}) {
    const g = GEO().pt("C", 0, 0, names).pt("B", 0, a, names).pt("A", b, 0, names).poly(["A", "B", "C"]).right("C", "A", "B");
    g.side("B", "C", la).side("A", "C", lb).side("A", "B", lc);
    if (angA) g.angle("A", "B", "C", angA, { r: 24 });
    return g.svg("triangle rectangle");
  },
  // Hauteur issue de l'angle droit : p = projection de [BC] (côté de B), q = projection de [AC] (côté de A).
  altitude(p, q, { lp = "p", lq = "q", lh = "h", la = "", lb = "", lc = "" } = {}) {
    const h = Math.sqrt(p * q), g = GEO().pt("B", 0, 0).pt("A", p + q, 0).pt("C", p, h).pt("H", p, 0).poly(["A", "B", "C"]);
    g.seg("C", "H", { cls: "f-accent", dash: true }).right("H", "A", "C").right("C", "A", "B");
    g.side("B", "H", lp).side("H", "A", lq).side("C", "H", lh, { inside: false }).side("B", "C", la).side("A", "C", lb);
    if (lc) g.add([p / 2 + q / 2, -h * 0.3]).text([(p + q) / 2, 0], lc, 0, 30);
    return g.svg("hauteur sur l'hypoténuse");
  },
  // Triangle isocèle de base b et de côtés s, hauteur en pointillé.
  isoH(b, s, { lb = "", ls = "", lh = "" } = {}) {
    const h = Math.sqrt(Math.max(s * s - (b * b) / 4, 0.01));
    const g = GEO().pt("A", 0, 0).pt("B", b, 0).pt("C", b / 2, h).pt("H", b / 2, 0, false).poly(["A", "B", "C"]);
    g.seg("C", "H", { cls: "f-accent", dash: true }).right("H", "B", "C").side("A", "B", lb).side("B", "C", ls).side("C", "H", lh, { inside: true });
    return g.svg("triangle isocèle et sa hauteur");
  },
  // Parallélogramme de base b, hauteur h, décalage k ; ls = côté oblique.
  para(b, h, { lb = "", lh = "", ls = "", k = h * 0.6, noH = false } = {}) {
    const g = GEO().pt("A", 0, 0, false).pt("B", b, 0, false).pt("C", b + k, h, false).pt("D", k, h, false).pt("K", k, 0, false).poly(["A", "B", "C", "D"]);
    if (!noH) g.seg("D", "K", { cls: "f-accent", dash: true }).right("K", "B", "D").side("D", "K", lh, { inside: true });
    g.side("A", "B", lb).side("B", "C", ls);
    return g.svg("parallélogramme");
  },
  losange(D, d, { lD = "", ld = "" } = {}) {
    const g = GEO().pt("A", 0, 0, false).pt("B", D / 2, -d / 2, false).pt("C", D, 0, false).pt("E", D / 2, d / 2, false).poly(["A", "B", "C", "E"]);
    g.seg("A", "C", { dash: true }).seg("B", "E", { dash: true }).right([D / 2, 0], "C", "E");
    g.text([D / 4, 0], lD, 0, -6).text([D / 2, d / 4], ld, 22, 4);
    return g.svg("losange");
  },
  rect(w, h, { lw = "", lh = "", diag = "" } = {}) {
    const g = GEO().pt("A", 0, 0, false).pt("B", w, 0, false).pt("C", w, h, false).pt("D", 0, h, false).poly(["A", "B", "C", "D"]).side("A", "B", lw).side("B", "C", lh);
    if (diag) g.seg("A", "C", { dash: true }).seg("B", "D", { dash: true }).text([w / 2, h / 2], diag, 0, -8);
    return g.svg("rectangle");
  },
  // Rectangle a × b privé d'un coin c × e.
  notch(a, b, c, e, { la = "", lb = "", lc = "", le = "" } = {}) {
    const g = GEO().pt("A", 0, 0, false).pt("B", a, 0, false).pt("C", a, b - e, false).pt("D", a - c, b - e, false).pt("E", a - c, b, false).pt("F", 0, b, false).poly(["A", "B", "C", "D", "E", "F"]);
    g.side("A", "B", la).side("F", "A", lb).side("D", "C", lc, { inside: true }).side("E", "D", le, { inside: true });
    return g.svg("rectangle découpé");
  },
  // Rectangle a × b, avec à droite un rectangle c × e posé sur la même base.
  lshape(a, b, c, e, labs = {}) {
    const g = GEO().pt("A", 0, 0, false).pt("B", a + c, 0, false).pt("C", a + c, e, false).pt("D", a, e, false).pt("E", a, b, false).pt("F", 0, b, false).poly(["A", "B", "C", "D", "E", "F"]);
    g.seg([a, 0], [a, Math.min(b, e)], { dash: true }).side([0, 0], [a, 0], labs.a || "").side("F", "A", labs.b || "").side([a, 0], "B", labs.c || "").side("B", "C", labs.e || "");
    return g.svg("figure composée");
  },
  house(a, b, h, labs = {}) {
    const g = GEO().pt("A", 0, 0, false).pt("B", a, 0, false).pt("C", a, b, false).pt("S", a / 2, b + h, false).pt("D", 0, b, false).poly(["A", "B", "C", "S", "D"]);
    g.seg("D", "C", { dash: true }).seg("S", [a / 2, b], { cls: "f-accent", dash: true }).side("A", "B", labs.a || "").side("B", "C", labs.b || "").side("S", [a / 2, b], labs.h || "", { inside: true });
    return g.svg("façade");
  },
  frame(a, b, w, labs = {}) {
    const g = GEO().pt("A", 0, 0, false).pt("B", a, 0, false).pt("C", a, b, false).pt("D", 0, b, false).poly(["A", "B", "C", "D"]).poly([[w, w], [a - w, w], [a - w, b - w], [w, b - w]], "f-soft");
    g.side("A", "B", labs.a || "").side("B", "C", labs.b || "").text([w / 2, b / 2], labs.w || "", 14, 0);
    return g.svg("cadre");
  },
  // Triangle quelconque : côtés a et b issus de C formant l'angle gamma.
  sas(a, b, gamma, { la = "", lb = "", lg = "", lc = "", names = ["A", "B", "C"] } = {}) {
    const t = (gamma * Math.PI) / 180, g = GEO().pt(names[2], 0, 0).pt(names[1], a, 0).pt(names[0], b * Math.cos(t), b * Math.sin(t)).poly([names[0], names[1], names[2]]);
    g.side(names[2], names[1], la).side(names[2], names[0], lb).side(names[0], names[1], lc).angle(names[2], names[1], names[0], lg);
    return g.svg("triangle");
  },
  // Angle plat partagé (a = angle de gauche) ou angles autour d'un point.
  straight(a, la, lb) {
    const t = (a * Math.PI) / 180;
    const u = [4 * Math.cos(t), 4 * Math.sin(t)];
    return GEO().pt("O", 0, 0, false).add([-4, 0], [4, 0], [0, 3.2]).seg([-4, 0], [4, 0]).seg("O", u).angle("O", [4, 0], u, la, { r: 22 }).angle("O", u, [-4, 0], lb, { r: 28 }).svg("angle plat");
  },
  around(a, b, la, lb, lc) {
    const r = 3.5, d = (x) => [r * Math.cos((x * Math.PI) / 180), r * Math.sin((x * Math.PI) / 180)], u = d(0), v = d(a), w = d(a + b);
    return GEO().pt("O", 0, 0, false).add([-r, -r], [r, r]).seg("O", u).seg("O", v).seg("O", w).angle("O", u, v, la, { r: 22 }).angle("O", v, w, lb, { r: 26 }).angle("O", w, u, lc, { r: 30 }).dot("O").svg("angles autour d'un point");
  },
  // Cercle de diamètre [AB] et point C du cercle (angle en degrés depuis A), angles et côtés optionnels.
  diam(cAng, { lA = "", lB = "", lAC = "", lBC = "", lAB = "", center = false } = {}) {
    const t = (cAng * Math.PI) / 180, g = GEO().pt("A", -1, 0).pt("B", 1, 0).pt("C", Math.cos(t), Math.sin(t)).circle([0, 0], 1, "f-soft").poly(["A", "B", "C"]);
    g.right("C", "A", "B").side("A", "C", lAC).side("B", "C", lBC).side("A", "B", lAB, { inside: true });
    if (lA) g.angle("A", "B", "C", lA, { r: 24 });
    if (lB) g.angle("B", "C", "A", lB, { r: 24 });
    if (center) g.pt("O", 0, 0).dot("O");
    return g.svg("cercle de Thalès");
  },
  // Tangente issue d'un point P extérieur : rayon r, distance OP = d.
  tangent(r, d, { lr = "", ld = "", lt = "" } = {}) {
    const ang = Math.acos(r / d), T = [r * Math.cos(ang), r * Math.sin(ang)];
    const g = GEO().pt("O", 0, 0).pt("P", d, 0).pt("T", T[0], T[1]).circle([0, 0], r, "f-soft").poly(["O", "P", "T"]).right("T", "O", "P").dot("O");
    g.side("O", "T", lr).side("O", "P", ld).side("P", "T", lt);
    return g.svg("tangente au cercle");
  },
  // Configuration de Thalès (triangles emboîtés) : D sur [AB], E sur [AC], (DE) ∥ (BC). k = AD/AB (pour le dessin).
  thales(k, labs = {}) {
    const A = [0, 0], B = [6, -4], C = [7.5, 1.5], D = [B[0] * k, B[1] * k], E = [C[0] * k, C[1] * k];
    const g = GEO().pt("A", ...A).pt("B", ...B).pt("C", ...C).pt("D", ...D).pt("E", ...E).poly(["A", "B", "C"]).seg("D", "E", { cls: "f-accent", w: 2 });
    for (const [k2, a, b] of [["AD", "A", "D"], ["DB", "D", "B"], ["AE", "A", "E"], ["EC", "E", "C"], ["DE", "D", "E"], ["BC", "B", "C"]]) if (labs[k2]) g.side(a, b, labs[k2]);
    if (labs.AB) g.side([B[0] * 0.55, B[1] * 0.55], [B[0] * 0.95, B[1] * 0.95], "", { inside: false }).text([B[0] * 0.78 + 0.6, B[1] * 0.78 - 0.9], labs.AB);
    if (labs.AC) g.text([C[0] * 0.78 - 0.4, C[1] * 0.78 + 0.9], labs.AC);
    return g.svg("configuration de Thalès");
  },
  // Ombres : bâton de hauteur h et ombre s ; arbre d'ombre S.
  shadows(h, s, S, labs = {}) {
    const r = h / s, b1 = 2.2, b2 = 6; // schéma : mêmes proportions, tailles lisibles
    const g = GEO().poly([[0, 0], [b1, 0], [0, b1 * r]], "f-fill2").poly([[b1 + 1.5, 0], [b1 + 1.5 + b2, 0], [b1 + 1.5, b2 * r]]);
    g.side([0, 0], [b1, 0], labs.s || "").side([0, 0], [0, b1 * r], labs.h || "").side([b1 + 1.5, 0], [b1 + 1.5 + b2, 0], labs.S || "").side([b1 + 1.5, 0], [b1 + 1.5, b2 * r], labs.H || "");
    return g.svg("ombres");
  },
  // Pente : angle et déplacement horizontal.
  slope(angDeg, labs = {}) {
    const t = Math.min(angDeg, 35) * Math.PI / 180, L = 6, g = GEO().pt("A", 0, 0, false).pt("B", L, 0, false).pt("C", L, L * Math.tan(t), false).poly(["A", "B", "C"]).right("B", "A", "C");
    g.angle("A", "B", "C", labs.a || "", { r: 30 }).side("A", "B", labs.h || "").side("B", "C", labs.v || "");
    return g.svg("pente");
  },
  // Profils de solides composés (vue de face) : cylindre + cône, cube + pyramide, cylindre + demi-boule.
  profile(kind, w, h1, h2, labs = {}) {
    const g = GEO().pt("A", 0, 0, false).pt("B", w, 0, false).pt("C", w, h1, false).pt("D", 0, h1, false);
    if (kind === "dome") {
      const n = 24, arc = []; for (let i = 0; i <= n; i++) { const a = (Math.PI * i) / n; arc.push([w / 2 + (w / 2) * Math.cos(a), h1 + (w / 2) * Math.sin(a)]); }
      g.poly(["A", "B", ...arc]).seg("D", "C", { dash: true });
    } else g.pt("S", w / 2, h1 + h2, false).poly(["A", "B", "C", "S", "D"]).seg("D", "C", { dash: true }).seg("S", [w / 2, h1], { cls: "f-accent", dash: true });
    if (kind === "cone" || kind === "dome") g.seg([w / 2, 0], "B", { cls: "f-accent" }).text([w * 0.75, 0], labs.r || "", 0, 16);
    else g.side("A", "B", labs.a || "");
    g.side("B", "C", labs.h1 || "");
    if (kind !== "dome") g.side("S", [w / 2, h1], labs.h2 || "", { inside: true });
    return g.svg("solide composé");
  },
  // Cadran d'horloge : aiguille de midi et aiguille sur le nombre k.
  clock(k) {
    const g = GEO().circle([0, 0], 1, "f-soft").pt("O", 0, 0, false);
    for (let i = 1; i <= 12; i++) { const a = Math.PI / 2 - (i * Math.PI) / 6; g.text([0.82 * Math.cos(a), 0.82 * Math.sin(a)], String(i), 0, 4); }
    const a = Math.PI / 2 - (k * Math.PI) / 6;
    return g.seg("O", [0, 0.68], { w: 2.5 }).seg("O", [0.68 * Math.cos(a), 0.68 * Math.sin(a)], { cls: "f-accent", w: 2.5 }).dot("O").svg("horloge");
  },
  // Deux trajets depuis un port P, angle entre eux.
  boats(a, b, ang, labs = {}) {
    const t = (ang * Math.PI) / 180, g = GEO().pt("P", 0, 0).pt("A", a, 0).pt("B", b * Math.cos(t), b * Math.sin(t)).seg("P", "A", { w: 2 }).seg("P", "B", { w: 2 }).seg("A", "B", { cls: "f-accent", dash: true });
    g.side("P", "A", labs.a || "").side("P", "B", labs.b || "").side("A", "B", labs.d || "").angle("P", "A", "B", labs.g || "");
    return g.svg("trajets");
  },
  // Cercle trigonométrique : angle alpha et angle associé.
  assoc(alpha, beta, la = "α", lb = "") {
    const r = 1, d = (x) => [Math.cos((x * Math.PI) / 180), Math.sin((x * Math.PI) / 180)];
    const g = GEO().add([-1.2, -1.2], [1.2, 1.2]).circle([0, 0], r, "f-soft").seg([-1.2, 0], [1.2, 0]).seg([0, -1.2], [0, 1.2]).pt("O", 0, 0, false);
    g.seg("O", d(alpha), { w: 2 }).dot(d(alpha)).angle("O", [1, 0], d(alpha), la, { r: 18 });
    if (beta !== undefined) g.seg("O", d(beta), { cls: "f-accent", w: 2 }).dot(d(beta)).text(d(beta), lb, d(beta)[0] < 0 ? -16 : 16, d(beta)[1] < 0 ? 16 : -8);
    return g.svg("cercle trigonométrique");
  },
};
