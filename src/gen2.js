// Générateurs recalibrés sur les référentiels (CO : PER / plan Budé ; Collège : programme CdG 2021 et
// épreuves communes SISM ; MP : PEE). Chargé après generators.js : complète et remplace des entrées de GEN.
// Niveaux : 1 = question de base du chapitre, 2 = question type d'épreuve, 3 = question exigeante (LS / MA2).

// ---------- Outils ----------
const sg = (v) => (v < 0 ? " - " + -v : " + " + v); // « + 3 » / « - 3 »
const xm = (r) => "x" + (r === 0 ? "" : sg(-r)); // x - r
const xmT = (r) => (r === 0 ? "x" : "(x" + sg(-r) + ")");
const rat = (v) => { // écriture saisissable d'un rationnel simple
  if (Number.isInteger(v)) return String(v);
  for (let d = 2; d <= 60; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-9) return Math.round(v * d) + "/" + d;
  return String(v);
};
const ratT = (v) => { // TeX
  if (Number.isInteger(v)) return String(v);
  for (let d = 2; d <= 60; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-9) return frac(Math.round(v * d), d);
  return dec(v);
};
const pmul = (a, b) => { const r = Array(a.length + b.length - 1).fill(0); a.forEach((x, i) => b.forEach((y, j) => (r[i + j] += x * y))); return r; };
const padd = (a, b) => { const n = Math.max(a.length, b.length), A = Array(n - a.length).fill(0).concat(a), B = Array(n - b.length).fill(0).concat(b); return A.map((x, i) => x + B[i]); };
const pscale = (a, k) => a.map((x) => x * k);
const peval = (a, x) => a.reduce((s, c) => s * x + c, 0);
const ptrim = (a) => { let i = 0; while (i < a.length - 1 && a[i] === 0) i++; return a.slice(i); };
const shuffle = (arr) => { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(R.rand() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };
const lin = (a, b, v = "x") => poly([a, b], v);
const cx = (c) => (c === 1 ? "" : c === -1 ? "-" : String(c)); // coefficient devant une lettre
const nb = (v) => { const [i, f] = String(+(+v).toFixed(6)).split("."); return (Math.abs(+i) >= 10000 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}") : i) + (f ? "{,}" + f : ""); }; // 10'000
// Ensemble des solutions d'une inéquation f(x) op 0 : zéros (inclus si op large), pôles (exclus).
function signSet(f, zeros, poles, op) {
  const crit = [...new Set(zeros.concat(poles))].sort((a, b) => a - b);
  const ok = (v) => (op === "<" ? v < 0 : op === "<=" ? v <= 0 : op === ">" ? v > 0 : v >= 0);
  const pts = [-Infinity, ...crit, Infinity];
  const pieces = []; // [a, aIncl, b, bIncl]
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    const mid = a === -Infinity ? (b === Infinity ? 0 : b - 1) : b === Infinity ? a + 1 : (a + b) / 2;
    if (ok(f(mid))) pieces.push([a, false, b, false]);
  }
  // bornes : zéro inclus si op large et pas un pôle
  const incl = (c) => (op === "<=" || op === ">=") && zeros.includes(c) && !poles.includes(c);
  for (const c of crit) if (incl(c)) pieces.push([c, true, c, true]);
  // fusion
  pieces.sort((p, q) => p[0] - q[0] || (p[2] - q[2]));
  const out = [];
  for (const p of pieces) {
    const last = out[out.length - 1];
    if (last && (last[2] > p[0] || (last[2] === p[0] && (last[3] || p[1])))) {
      if (p[2] > last[2] || (p[2] === last[2] && p[3])) { last[2] = p[2]; last[3] = p[3]; }
      if (p[0] === last[0] && p[1]) last[1] = true;
    } else out.push([...p]);
  }
  return out;
}
const OPT = { "<": "<", "<=": "\\le", ">": ">", ">=": "\\ge" };
const solsetSpec = (ivs) => ({ kind: "solset", ivs });

// ---------- Figures supplémentaires ----------
(() => {
  const svg = (w, h, body, label) => '<svg class="fig" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + (label || "figure") + '" xmlns="http://www.w3.org/2000/svg">' + body + "</svg>";
  const t = (x, y, s, cls = "f-txt", anchor = "middle", size = 13) => '<text x="' + x + '" y="' + y + '" class="' + cls + '" text-anchor="' + anchor + '" font-size="' + size + '">' + s + "</text>";
  const L = (x1, y1, x2, y2, cls = "f-line", extra = "") => '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="' + cls + '" ' + extra + "/>";
  const P = (pts, cls = "f-shape") => '<polygon points="' + pts.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ") + '" class="' + cls + '"/>';
  let uid = 0;
  // Repère quadrillé : fns = [{ f, cls, from, to }], pts = [[x, y, label]], numbers = graduations chiffrées.
  FIG.plot = function (fns, pts = [], o = {}) {
    const [x0, x1] = o.xr || [-6, 6], [y0, y1] = o.yr || [-5, 5], W = 300, H = Math.round(W * (y1 - y0) / (x1 - x0) * (o.squash || 1));
    const X = (x) => 10 + ((x - x0) / (x1 - x0)) * (W - 20), Y = (y) => H - 10 - ((y - y0) / (y1 - y0)) * (H - 20);
    let g = "";
    if (o.grid !== false) for (let x = Math.ceil(x0); x <= x1; x++) g += L(X(x), Y(y0), X(x), Y(y1), "f-grid");
    if (o.grid !== false) for (let y = Math.ceil(y0); y <= y1; y++) g += L(X(x0), Y(y), X(x1), Y(y), "f-grid");
    g += L(X(x0), Y(0), X(x1), Y(0)) + L(X(0), Y(y0), X(0), Y(y1));
    if (o.numbers) {
      for (let x = Math.ceil(x0); x <= x1; x++) if (x && x % (o.step || 1) === 0) g += t(X(x), Y(0) + 13, x, "f-txt f-tick", "middle", 10);
      for (let y = Math.ceil(y0); y <= y1; y++) if (y && y % (o.step || 1) === 0) g += t(X(0) - 4, Y(y) + 4, y, "f-txt f-tick", "end", 10);
    } else if (o.ticks !== false) {
      for (let x = Math.ceil(x0); x <= x1; x++) g += L(X(x), Y(0) - 3, X(x), Y(0) + 3);
      for (let y = Math.ceil(y0); y <= y1; y++) g += L(X(0) - 3, Y(y), X(0) + 3, Y(y));
    }
    const id = "pc" + ++uid;
    g += '<clipPath id="' + id + '"><rect x="10" y="10" width="' + (W - 20) + '" height="' + (H - 20) + '"/></clipPath>';
    fns.forEach((F, k) => {
      let d = "", pen = false;
      const a = F.from ?? x0, b = F.to ?? x1, st = (x1 - x0) / 400;
      for (let x = a; x <= b + 1e-9; x += st) {
        const y = F.f(x);
        if (!isFinite(y) || y > y1 + 8 || y < y0 - 8) { pen = false; continue; }
        d += (pen ? " L" : " M") + X(x).toFixed(1) + "," + Y(y).toFixed(1); pen = true;
      }
      g += '<path d="' + d + '" class="' + (F.cls || (k ? "f-line" : "f-accent")) + '" fill="none" stroke-width="2.4" clip-path="url(#' + id + ')"' + (F.dash ? ' stroke-dasharray="5 4"' : "") + "/>";
    });
    (o.vlines || []).forEach((x) => (g += L(X(x), Y(y0), X(x), Y(y1), "f-line", 'stroke-dasharray="4 4"')));
    (o.hlines || []).forEach((y) => (g += L(X(x0), Y(y), X(x1), Y(y), "f-line", 'stroke-dasharray="4 4"')));
    pts.forEach(([x, y, s]) => (g += '<circle cx="' + X(x) + '" cy="' + Y(y) + '" r="4" class="f-dot"/>' + (s ? t(X(x) + 7, Y(y) - 7, s, "f-txt", "start", 12) : "")));
    return svg(W, H, g, o.label || "graphique");
  };
  // Triangle avec étiquettes d'angles (aux sommets A, B, C) et de côtés.
  FIG.triAngles = function (angles, sides = ["", "", ""], names = ["A", "B", "C"]) {
    const A = [30, 150], B = [290, 150], C = [120, 30];
    let g = P([A, B, C]);
    g += t(A[0] - 10, A[1] + 14, names[0]) + t(B[0] + 10, B[1] + 14, names[1]) + t(C[0], C[1] - 8, names[2]);
    if (angles[0]) g += t(A[0] + 38, A[1] - 8, angles[0], "f-accent f-txt", "start");
    if (angles[1]) g += t(B[0] - 38, B[1] - 8, angles[1], "f-accent f-txt", "end");
    if (angles[2]) g += t(C[0], C[1] + 30, angles[2], "f-accent f-txt");
    if (sides[0]) g += t(160, 168, sides[0]);
    if (sides[1]) g += t(214, 86, sides[1], "f-txt", "start");
    if (sides[2]) g += t(66, 86, sides[2], "f-txt", "end");
    return svg(320, 176, g, "triangle");
  };
  // Quadrilatère avec angles.
  FIG.quadAngles = function (angles) {
    const pts = [[40, 150], [270, 160], [250, 40], [90, 30]];
    let g = P(pts);
    const off = [[30, -10, "start"], [-30, -10, "end"], [-26, 26, "end"], [20, 28, "start"]];
    angles.forEach((a, i) => { if (a) g += t(pts[i][0] + off[i][0], pts[i][1] + off[i][1], a, "f-accent f-txt", off[i][2]); });
    return svg(310, 180, g, "quadrilatère");
  };
  // Disque, secteur d'angle donné.
  FIG.sector = function (lr, deg, lang) {
    const cx = 150, cy = 95, r = 75, a = (deg * Math.PI) / 180, ex = cx + r * Math.cos(-a), ey = cy + r * Math.sin(-a);
    let g = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" class="f-shape"/>';
    g += '<path d="M' + cx + "," + cy + " L" + (cx + r) + "," + cy + " A" + r + "," + r + " 0 " + (deg > 180 ? 1 : 0) + ",0 " + ex.toFixed(1) + "," + ey.toFixed(1) + ' Z" class="f-fill2"/>';
    g += t(cx + r / 2, cy + 16, lr) + (lang ? t(cx + 18, cy - 8, lang, "f-accent f-txt", "start", 12) : "");
    return svg(300, 190, g, "secteur");
  };
  // Boule.
  FIG.sphere = function (lr) {
    let g = '<circle cx="150" cy="90" r="70" class="f-shape"/><ellipse cx="150" cy="90" rx="70" ry="18" class="f-line" fill="none" stroke-dasharray="4 4"/>';
    g += L(150, 90, 220, 90, "f-accent") + t(185, 84, lr, "f-accent f-txt");
    return svg(300, 180, g, "boule");
  };
  // Prisme droit à base triangulaire.
  FIG.prism = function (lb, lh, lH) {
    const A = [40, 150], B = [170, 150], C = [70, 90], d = [110, -50];
    const sh = (p) => [p[0] + d[0], p[1] + d[1]];
    let g = P([A, B, sh(B), sh(A)], "f-shape") + P([A, B, C], "f-fill2") + L(B[0], B[1], sh(B)[0], sh(B)[1]) + L(C[0], C[1], sh(C)[0], sh(C)[1], "f-line", 'stroke-dasharray="4 4"') + P([sh(A), sh(B), sh(C)], "f-shape");
    g += t(105, 168, lb) + t(62, 128, lh, "f-accent f-txt", "end") + t(250, 128, lH, "f-txt", "start");
    return svg(320, 180, g, "prisme");
  };
  // Polygone régulier à n côtés.
  FIG.regPoly = function (n, lab) {
    const cx = 150, cy = 90, r = 72, pts = Array.from({ length: n }, (_, i) => [cx + r * Math.cos((2 * Math.PI * i) / n - Math.PI / 2), cy + r * Math.sin((2 * Math.PI * i) / n - Math.PI / 2)]);
    let g = P(pts) + L(cx, cy, pts[0][0], pts[0][1], "f-line", 'stroke-dasharray="4 4"') + L(cx, cy, pts[1][0], pts[1][1], "f-line", 'stroke-dasharray="4 4"');
    g += '<circle cx="' + cx + '" cy="' + cy + '" r="3" class="f-dot"/>' + (lab ? t(cx + 10, cy - 4, lab, "f-accent f-txt", "start", 12) : "");
    return svg(300, 180, g, "polygone régulier");
  };
  // Deux triangles semblables (le petit et le grand), étiquettes de côtés.
  FIG.simTri = function (small, big) {
    const tri = (ox, k) => [[ox, 150], [ox + 90 * k, 150], [ox + 30 * k, 150 - 70 * k]];
    const a = tri(20, 0.8), b = tri(130, 1.6);
    let g = P(a) + P(b);
    const lab = (T, ls) => t((T[0][0] + T[1][0]) / 2, 166, ls[0]) + t((T[1][0] + T[2][0]) / 2 + 8, (T[1][1] + T[2][1]) / 2, ls[1], "f-txt", "start") + t((T[0][0] + T[2][0]) / 2 - 6, (T[0][1] + T[2][1]) / 2, ls[2], "f-txt", "end");
    return svg(320, 176, g + lab(a, small) + lab(b, big), "triangles semblables");
  };
  // Urne : boules colorées (sans indication du résultat).
  FIG.urn = function (counts) {
    const cls = ["f-accent", "f-dot", "f-fill2"], names = Object.keys(counts);
    let g = '<path d="M60,40 L60,150 Q60,170 80,170 L220,170 Q240,170 240,150 L240,40" class="f-line" fill="none" stroke-width="2"/>', k = 0;
    names.forEach((nm, ci) => { for (let i = 0; i < counts[nm]; i++, k++) g += '<circle cx="' + (80 + (k % 8) * 20) + '" cy="' + (155 - Math.floor(k / 8) * 20) + '" r="8" class="' + cls[ci % 3] + '"/>'; });
    g += names.map((nm, ci) => '<circle cx="' + (262) + '" cy="' + (60 + ci * 22) + '" r="6" class="' + cls[ci % 3] + '"/>' + t(272, 64 + ci * 22, nm, "f-txt", "start", 11)).join("");
    return svg(320, 180, g, "urne");
  };
  // Triangle avec ses droites remarquables (sans valeurs).
  FIG.triLines = function (kind, labs = {}) {
    const A = [30, 150], B = [290, 150], C = [120, 30], Mb = [(A[0] + C[0]) / 2, (A[1] + C[1]) / 2], Ma = [(B[0] + C[0]) / 2, (B[1] + C[1]) / 2], Mc = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
    let g = P([A, B, C]) + t(A[0] - 10, A[1] + 14, "A") + t(B[0] + 10, B[1] + 14, "B") + t(C[0], C[1] - 8, "C");
    if (kind === "medianes") {
      g += L(A[0], A[1], Ma[0], Ma[1], "f-line", 'stroke-dasharray="4 4"') + L(B[0], B[1], Mb[0], Mb[1], "f-line", 'stroke-dasharray="4 4"') + L(C[0], C[1], Mc[0], Mc[1], "f-line", 'stroke-dasharray="4 4"');
      const G = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
      g += '<circle cx="' + G[0] + '" cy="' + G[1] + '" r="4" class="f-dot"/>' + t(G[0] + 8, G[1] - 6, "G", "f-txt", "start") + t(Mc[0], Mc[1] + 16, "M");
      if (labs.m) g += t((C[0] + Mc[0]) / 2 - 8, (C[1] + Mc[1]) / 2, labs.m, "f-accent f-txt", "end", 12);
    } else {
      const a = 260, b = Math.hypot(C[0] - A[0], C[1] - A[1]), c = Math.hypot(B[0] - C[0], B[1] - C[1]);
      const I = [(c * A[0] + b * B[0] + a * C[0]) / (a + b + c), (c * A[1] + b * B[1] + a * C[1]) / (a + b + c)];
      g += L(B[0], B[1], I[0], I[1], "f-line", 'stroke-dasharray="4 4"') + L(C[0], C[1], I[0], I[1], "f-line", 'stroke-dasharray="4 4"') + L(A[0], A[1], I[0], I[1], "f-line", 'stroke-dasharray="4 4"');
      g += '<circle cx="' + I[0] + '" cy="' + I[1] + '" r="4" class="f-dot"/>' + t(I[0], I[1] + 18, "I");
      if (labs.A) g += t(A[0] + 40, A[1] - 8, labs.A, "f-accent f-txt", "start");
    }
    return svg(320, 176, g, "droites remarquables");
  };
})();

// ---------- Générateurs ----------
Object.assign(GEN, {
  // ===== CO 9e =====
  decim(d) {
    if (d === 1) {
      const n0 = R.int(1000, 99999); if (n0 % 10 === 0 || n0 % 100 < 10) return GEN.decim(1);
      const v = n0 / 1000, k = R.pick([1, 2]), r = Math.round(v * 10 ** k) / 10 ** k;
      return { q: "Arrondis " + M(dec(v)) + " au " + (k === 1 ? "dixième" : "centième") + ".", spec: { kind: "value", value: r }, sol: "On regarde le chiffre suivant : " + M(dec(v) + " \\approx " + dec(r)) + "." };
    }
    if (d === 2) {
      const a = R.int(11, 99) / 10, b = R.int(11, 49) / 10, op = R.pick(["\\cdot", ":"]);
      if (op === ":") { const q = R.int(11, 99) / 10; return { q: "Calcule sans calculatrice : " + M(dec(q * b) + " : " + dec(b)) + ".", spec: { kind: "value", value: q }, sol: M(dec(q * b) + " : " + dec(b) + " = " + dec(q)) + " (on peut multiplier les deux nombres par 10)." }; }
      return { q: "Calcule sans calculatrice : " + M(dec(a) + " \\cdot " + dec(b)) + ".", spec: { kind: "value", value: +(a * b).toFixed(4) }, sol: M(Math.round(a * 10) + " \\cdot " + Math.round(b * 10) + " = " + Math.round(a * 10) * Math.round(b * 10)) + ", puis 2 chiffres après la virgule : " + M(dec(+(a * b).toFixed(4))) + "." };
    }
    const n1 = R.int(2, 5), p1 = R.int(115, 395) / 100, n2 = R.int(2, 4), p2 = R.int(45, 180) / 100, tot = +(n1 * p1 + n2 * p2).toFixed(2), billet = tot < 20 ? 20 : 50;
    return { fig: FIG.items(n1 + n2, "articles"), q: "Tu achètes " + M(n1) + " cahiers à " + M(dec(p1)) + " CHF et " + M(n2) + " stylos à " + M(dec(p2)) + " CHF. Tu paies avec un billet de " + M(billet) + " CHF. Combien te rend-on (en CHF) ?", spec: { kind: "value", value: +(billet - tot).toFixed(2) }, sol: M(n1 + " \\cdot " + dec(p1) + " + " + n2 + " \\cdot " + dec(p2) + " = " + dec(tot)) + " ; " + M(billet + " - " + dec(tot) + " = " + dec(+(billet - tot).toFixed(2))) + " CHF." };
  },

  unites(d) {
    if (d === 1) {
      const c = R.pick([["km", "m", 1000], ["m", "cm", 100], ["kg", "g", 1000], ["m", "mm", 1000], ["t", "kg", 1000], ["cm", "mm", 10]]), v = R.int(12, 950) / 100, rev = R.rand() < 0.5;
      if (rev) return { q: "Convertis " + M(dec(v * c[2]) + "\\ \\text{" + c[1] + "}") + " en " + c[0] + ".", spec: { kind: "value", value: v }, sol: M(dec(v * c[2]) + " : " + c[2] + " = " + dec(v)) + " " + c[0] + "." };
      return { q: "Convertis " + M(dec(v) + "\\ \\text{" + c[0] + "}") + " en " + c[1] + ".", spec: { kind: "value", value: +(v * c[2]).toFixed(6) }, sol: M("1\\ \\text{" + c[0] + "} = " + c[2] + "\\ \\text{" + c[1] + "}") + " : " + M(dec(v) + " \\cdot " + c[2] + " = " + nb(v * c[2])) + "." };
    }
    if (d === 2) {
      const c = R.pick([["m^2", "cm^2", 10000], ["dm^2", "cm^2", 100], ["km^2", "m^2", 1000000], ["ha", "m^2", 10000], ["m^2", "dm^2", 100]]), v = R.int(2, 95) / 10;
      return { fig: FIG.areaSquare("1 " + c[0].replace("^2", "²")), q: "Convertis " + M(dec(v) + "\\ \\text{" + c[0].replace("^2", "") + "}" + (c[0].includes("^2") ? "^2" : "")) + " en " + M("\\text{" + c[1].replace("^2", "") + "}^2") + ".", spec: { kind: "value", value: +(v * c[2]).toFixed(6) }, sol: M("1\\ \\text{" + c[0].replace("^2", "") + "}" + (c[0].includes("^2") ? "^2" : "") + " = " + nb(c[2]) + "\\ \\text{" + c[1].replace("^2", "") + "}^2") + " : " + M(dec(v) + " \\cdot " + nb(c[2]) + " = " + nb(v * c[2])) + "." };
    }
    const c = R.pick([["m^3", "L", 1000], ["dm^3", "mL", 1000], ["cm^3", "L", 0.001], ["L", "cm^3", 1000], ["hL", "L", 100], ["m^3", "dm^3", 1000]]), v = c[2] < 1 ? 50 * R.int(3, 60) : R.int(2, 95) / 10;
    const U = (u) => (u.includes("^3") ? "\\text{" + u.replace("^3", "") + "}^3" : "\\text{" + u + "}");
    return { fig: FIG.box("", "", ""), q: "Convertis " + M(dec(v) + "\\ " + U(c[0])) + " en " + M(U(c[1])) + ".", spec: { kind: "value", value: +(v * c[2]).toFixed(6) }, sol: "Rappel : " + M("1\\ \\text{dm}^3 = 1\\ \\text{L}") + ". " + M(nb(v) + "\\ " + U(c[0]) + " = " + nb(v * c[2]) + "\\ " + U(c[1])) + "." };
  },

  angtri(d) {
    if (d === 1) {
      const a = R.int(25, 80), b = R.int(25, 150 - a);
      return { fig: FIG.triAngles([a + "°", b + "°", "?"]), q: "Dans un triangle, deux angles mesurent " + M(a + "°") + " et " + M(b + "°") + ". Que mesure le troisième (en degrés) ?", spec: { kind: "value", value: 180 - a - b }, sol: "La somme des angles d'un triangle vaut " + M("180°") + " : " + M("180 - " + a + " - " + b + " = " + (180 - a - b)) + "°." };
    }
    if (d === 2) {
      const s = 2 * R.int(10, 70), base = (180 - s) / 2;
      if (R.rand() < 0.5) return { fig: FIG.triAngles(["?", "?", s + "°"]), q: "Un triangle " + M("ABC") + " est isocèle en " + M("C") + " et " + M("\\widehat{C} = " + s + "°") + ". Que mesure " + M("\\widehat{A}") + " (en degrés) ?", spec: { kind: "value", value: base }, sol: "Les deux angles à la base sont égaux : " + M("\\frac{180 - " + s + "}{2} = " + base) + "°." };
      return { fig: FIG.triAngles([base + "°", "", "?"]), q: "Un triangle " + M("ABC") + " est isocèle en " + M("C") + " et " + M("\\widehat{A} = " + base + "°") + ". Que mesure l'angle au sommet " + M("\\widehat{C}") + " (en degrés) ?", spec: { kind: "value", value: s }, sol: M("\\widehat{B} = \\widehat{A} = " + base + "°") + " ; " + M("\\widehat{C} = 180 - 2 \\cdot " + base + " = " + s) + "°." };
    }
    const a = R.int(60, 120), b = R.int(50, 120), c = R.int(50, 120), x = 360 - a - b - c;
    if (x < 30 || x > 170) return GEN.angtri(3);
    return { fig: FIG.quadAngles([a + "°", b + "°", c + "°", "?"]), q: "Un quadrilatère a trois angles de " + M(a + "°") + ", " + M(b + "°") + " et " + M(c + "°") + ". Que mesure le quatrième (en degrés) ?", spec: { kind: "value", value: x }, sol: "Un quadrilatère se découpe en deux triangles : somme " + M("360°") + ". " + M("360 - " + a + " - " + b + " - " + c + " = " + x) + "°." };
  },

  arith(d) {
    const g = R.pick([2, 3, 4, 5, 6, 7, 8, 9, 12, 15]);
    let p, q; do { p = R.int(2, 9); q = R.int(2, 9); } while (p === q || gcd(p, q) !== 1);
    if (d === 1) return { q: "Détermine le PGDC de " + M(g * p) + " et " + M(g * q) + ".", spec: { kind: "value", value: g }, sol: M(g * p + " = " + g + " \\cdot " + p) + " et " + M(g * q + " = " + g + " \\cdot " + q) + " : PGDC " + M("= " + g) + ".", guide: pgdcGuide(g * p, g * q, g) };
    if (d === 2) return { q: "Détermine le PPMC de " + M(g * p) + " et " + M(g * q) + ".", spec: { kind: "value", value: g * p * q }, sol: "PPMC " + M("= \\frac{" + g * p + " \\cdot " + g * q + "}{\\text{PGDC}} = \\frac{" + g * p * g * q + "}{" + g + "} = " + g * p * q) + ".",
      guide: [GS("D'abord le PGDC de " + M(g * p) + " et " + M(g * q) + " : ?", g, M(g * p + " = " + g + " \\cdot " + p) + ", " + M(g * q + " = " + g + " \\cdot " + q) + " : PGDC " + M("= " + g) + "."), GS("Le produit des deux nombres : " + M(g * p + " \\cdot " + g * q) + " = ?", g * p * g * q, M(g * p + " \\cdot " + g * q + " = " + g * p * g * q) + "."), GS("PPMC = produit : PGDC. Combien ?", g * p * q, M(g * p * g * q + " : " + g + " = " + g * p * q) + ".")] };
    if (R.rand() < 0.5) {
      const a = R.pick([6, 8, 9, 10, 12, 15]), b = R.pick([4, 6, 10, 14, 16, 20]); if (a === b) return GEN.arith(3);
      const l = (a * b) / gcd(a, b);
      return { q: "Deux bus partent ensemble de la gare à 8 h. L'un repart toutes les " + M(a) + " minutes, l'autre toutes les " + M(b) + " minutes. Dans combien de minutes repartiront-ils de nouveau ensemble ?", spec: { kind: "value", value: l }, sol: "C'est le PPMC de " + M(a) + " et " + M(b) + " : " + M(l) + " minutes.",
        guide: [GS("Ils repartent ensemble après un nombre de minutes multiple de " + M(a) + " et de " + M(b) + " : le plus petit, c'est le PPMC. D'abord le PGDC de " + M(a) + " et " + M(b) + " : ?", gcd(a, b), "PGDC " + M("= " + gcd(a, b)) + "."), GS("PPMC " + M("= \\frac{" + a + " \\cdot " + b + "}{" + gcd(a, b) + "}") + " = ?", l, M("\\frac{" + a * b + "}{" + gcd(a, b) + "} = " + l) + " minutes.")] };
    }
    return { fig: FIG.tiles(p, q, g * p + " cm", g * q + " cm"), q: "On veut paver un rectangle de " + M(g * p) + " cm sur " + M(g * q) + " cm avec des carrés tous identiques, les plus grands possible. Quel est le côté d'un carré (en cm) ?", spec: { kind: "value", value: g }, sol: "Le côté divise les deux longueurs et doit être le plus grand : PGDC " + M("= " + g) + " cm.", guide: pgdcGuide(g * p, g * q, g) };
  },

  diagr(d) {
    if (d === 1) {
      const n = R.pick([4, 5, 6]), xs = Array.from({ length: n }, () => R.int(2, 20)), sum = xs.reduce((a, b) => a + b, 0);
      if ((sum * 2) % n) return GEN.diagr(1);
      return { fig: FIG.barChart(xs), q: "Calcule la moyenne de la série : " + M(xs.join(" ; ")) + ".", spec: { kind: "value", value: sum / n }, sol: M("\\frac{" + xs.join(" + ") + "}{" + n + "} = \\frac{" + sum + "}{" + n + "} = " + dec(sum / n)) + "." };
    }
    if (d === 2) {
      const tot = R.pick([20, 25, 40, 50, 80]), k = R.pick([2, 3, 4, 5, 6, 8, 10]), part = Math.round((tot * k) / 20);
      const ang = (part / tot) * 360;
      if (!Number.isInteger(ang)) return GEN.diagr(2);
      return { fig: FIG.sector("", ang, "?"), q: "Dans une classe de " + M(tot) + " élèves, " + M(part) + " viennent à vélo. Dans un diagramme circulaire, quel angle (en degrés) a le secteur « vélo » ?", spec: { kind: "value", value: ang }, sol: M("\\frac{" + part + "}{" + tot + "} \\cdot 360° = " + ang + "°") + "." };
    }
    const notes = [4, 4.5, 5, 5.5, 6], eff = notes.map(() => R.int(1, 6));
    const n = eff.reduce((a, b) => a + b, 0); if (n < 8) return GEN.diagr(3);
    const s = notes.reduce((a, v, i) => a + v * eff[i], 0), m = s / n;
    return { fig: FIG.barChart(eff), q: "Notes d'un test : " + notes.map((v, i) => M(dec(v)) + " (" + eff[i] + " élève" + (eff[i] > 1 ? "s" : "") + ")").join(", ") + ". Calcule la moyenne de la classe, au centième.", spec: { kind: "value", value: m, round: 0.01 }, sol: "Somme pondérée " + M(dec(s)) + " pour " + M(n) + " élèves : " + M(dec(s) + " : " + n + " \\approx " + dec(m.toFixed(2))) + "." };
  },

  aires(d) {
    if (d === 1) {
      const b = R.int(3, 15), h = 2 * R.int(2, 8);
      if (R.rand() < 0.5) return { fig: FIG.triangleFig(b + " cm", h + " cm"), q: "Calcule l'aire d'un triangle de base " + M(b) + " cm et de hauteur " + M(h) + " cm (en cm²).", spec: { kind: "value", value: (b * h) / 2 }, sol: M("\\frac{" + b + " \\cdot " + h + "}{2} = " + (b * h) / 2) + " cm²." };
      const L = R.int(4, 15), l = R.int(2, 9);
      return { fig: FIG.rectFig(L, l, L + " cm", l + " cm"), q: "Calcule le périmètre d'un rectangle de " + M(L) + " cm sur " + M(l) + " cm (en cm).", spec: { kind: "value", value: 2 * (L + l) }, sol: M("2 \\cdot (" + L + " + " + l + ") = " + 2 * (L + l)) + " cm." };
    }
    if (d === 2) {
      const B = R.int(6, 14), b = R.int(2, B - 2), h = 2 * R.int(2, 6);
      if (R.rand() < 0.5) return { fig: FIG.trapezoid(B + " cm", b + " cm", h + " cm"), q: "Calcule l'aire d'un trapèze de bases " + M(B) + " cm et " + M(b) + " cm, de hauteur " + M(h) + " cm (en cm²).", spec: { kind: "value", value: ((B + b) * h) / 2 }, sol: M("\\frac{(" + B + " + " + b + ") \\cdot " + h + "}{2} = " + ((B + b) * h) / 2) + " cm²." };
      const d1 = 2 * R.int(2, 8), d2 = R.int(3, 12);
      return { q: "Calcule l'aire d'un losange dont les diagonales mesurent " + M(d1) + " cm et " + M(d2) + " cm (en cm²).", spec: { kind: "value", value: (d1 * d2) / 2 }, sol: "Le losange se découpe en 4 triangles rectangles : " + M("\\frac{" + d1 + " \\cdot " + d2 + "}{2} = " + (d1 * d2) / 2) + " cm²." };
    }
    const A = 2 * R.int(6, 40), b = R.pick([4, 6, 8, 10, 12]);
    if (R.rand() < 0.5) return { fig: FIG.triangleFig(b + " cm", "h = ?"), q: "Un triangle a une aire de " + M(A) + " cm² et une base de " + M(b) + " cm. Calcule la hauteur correspondante (en cm).", spec: { kind: "value", value: (2 * A) / b }, sol: M("h = \\frac{2A}{b} = \\frac{" + 2 * A + "}{" + b + "} = " + ratT((2 * A) / b)) + " cm." };
    const L = R.int(6, 14), l = R.int(4, 9), c = R.int(2, Math.min(l, 5) - 1 || 2);
    if (c >= l || c >= L) return GEN.aires(3);
    return { fig: FIG.rectFig(L, l, L + " cm", l + " cm"), q: "Dans un rectangle de " + M(L) + " cm sur " + M(l) + " cm, on découpe un carré de côté " + M(c) + " cm dans un coin. Quelle est l'aire de la figure restante (en cm²) ?", spec: { kind: "value", value: L * l - c * c }, sol: M(L + " \\cdot " + l + " - " + c + "^2 = " + (L * l - c * c)) + " cm²." };
  },

  vitesse(d) {
    if (d === 1) {
      const v = 10 * R.int(3, 12), t = R.int(2, 5);
      return { fig: FIG.road(v * t + " km", t + " h"), q: "Une voiture parcourt " + M(v * t) + " km en " + M(t) + " h. Quelle est sa vitesse moyenne (en km/h) ?", spec: { kind: "value", value: v }, sol: M("v = \\frac{" + v * t + "}{" + t + "} = " + v) + " km/h." };
    }
    if (d === 2) {
      const v = R.pick([48, 72, 80, 90, 120]), mins = R.pick([15, 20, 30, 40, 45]), dist = (v * mins) / 60;
      return { fig: FIG.road(FIG.fmt(dist) + " km", v + " km/h"), q: "À " + M(v) + " km/h, combien de minutes faut-il pour parcourir " + M(dec(dist)) + " km ?", spec: { kind: "value", value: mins }, sol: M("t = \\frac{" + dec(dist) + "}{" + v + "}\\ \\text{h} = " + mins) + " min." };
    }
    const [v1, v2, dd] = R.pick([[40, 60, 120], [60, 120, 120], [30, 60, 60], [60, 90, 180], [40, 120, 120], [60, 40, 240], [90, 60, 180]]);
    const tt = dd / v1 + dd / v2, vm = (2 * dd) / tt;
    return { fig: FIG.road(dd + " km", "aller-retour"), q: "Une voiture fait un aller de " + M(dd) + " km à " + M(v1) + " km/h et le retour à " + M(v2) + " km/h. Quelle est sa vitesse moyenne sur l'ensemble du trajet (en km/h) ?", spec: { kind: "value", value: vm }, sol: "Durée totale " + M(dec(dd / v1) + " + " + dec(dd / v2) + " = " + dec(tt)) + " h pour " + M(2 * dd) + " km : " + M("v = \\frac{" + 2 * dd + "}{" + dec(tt) + "} = " + ratT(vm)) + " km/h (et non la moyenne des deux vitesses)." };
  },

  // ===== CO 10e =====
  disque(d) {
    const r = R.int(2, 12);
    if (d === 1) return { fig: FIG.disk("r = " + r + " cm"), q: "Calcule le périmètre d'un cercle de rayon " + M(r) + " cm (valeur exacte avec π, ou au centième).", spec: { kind: "value", value: 2 * Math.PI * r, round: 0.01, exactOk: true }, sol: M("P = 2\\pi r = " + 2 * r + "\\pi \\approx " + dec((2 * Math.PI * r).toFixed(2))) + " cm." };
    if (d === 2) {
      if (R.rand() < 0.5) return { fig: FIG.disk("r = " + r + " cm"), q: "Calcule l'aire d'un disque de rayon " + M(r) + " cm (valeur exacte avec π, ou au centième).", spec: { kind: "value", value: Math.PI * r * r, round: 0.01, exactOk: true }, sol: M("A = \\pi r^2 = " + r * r + "\\pi \\approx " + dec((Math.PI * r * r).toFixed(2))) + " cm²." };
      const D = 2 * r; return { fig: FIG.disk("d = " + D + " cm"), q: "Un disque a un diamètre de " + M(D) + " cm. Calcule son aire (valeur exacte avec π, ou au centième).", spec: { kind: "value", value: Math.PI * r * r, round: 0.01, exactOk: true }, sol: "Rayon " + M(r) + " cm ; " + M("A = \\pi \\cdot " + r + "^2 = " + r * r + "\\pi \\approx " + dec((Math.PI * r * r).toFixed(2))) + " cm²." };
    }
    const a = R.pick([30, 45, 60, 72, 90, 120, 135, 150, 240]);
    if (R.rand() < 0.5) return { fig: FIG.sector("r = " + r, a, a + "°"), q: "Calcule l'aire d'un secteur circulaire de rayon " + M(r) + " cm et d'angle " + M(a + "°") + " (au centième, en cm²).", spec: { kind: "value", value: (Math.PI * r * r * a) / 360, round: 0.01, exactOk: true }, sol: M("A = \\pi r^2 \\cdot \\frac{" + a + "}{360} = " + ratT((r * r * a) / 360) + "\\pi \\approx " + dec(((Math.PI * r * r * a) / 360).toFixed(2))) + " cm²." };
    return { fig: FIG.sector("r = " + r, a, a + "°"), q: "Calcule la longueur de l'arc d'un secteur de rayon " + M(r) + " cm et d'angle " + M(a + "°") + " (au centième, en cm).", spec: { kind: "value", value: (2 * Math.PI * r * a) / 360, round: 0.01, exactOk: true }, sol: M("\\ell = 2\\pi r \\cdot \\frac{" + a + "}{360} = " + ratT((2 * r * a) / 360) + "\\pi \\approx " + dec(((2 * Math.PI * r * a) / 360).toFixed(2))) + " cm." };
  },

  vol(d) {
    if (d === 1) {
      const a = R.int(2, 12), b = R.int(2, 9), c = R.int(2, 9);
      if (R.rand() < 0.3) return { fig: FIG.box(a + " cm", a + " cm", a + " cm"), q: "Calcule le volume d'un cube d'arête " + M(a) + " cm (en cm³).", spec: { kind: "value", value: a ** 3 }, sol: M("V = " + a + "^3 = " + a ** 3) + " cm³." };
      return { fig: FIG.box(a + " cm", b + " cm", c + " cm"), q: "Calcule le volume d'un pavé droit de " + M(a) + " cm × " + M(b) + " cm × " + M(c) + " cm (en cm³).", spec: { kind: "value", value: a * b * c }, sol: M(a + " \\cdot " + b + " \\cdot " + c + " = " + a * b * c) + " cm³." };
    }
    if (d === 2) {
      const b = 2 * R.int(2, 7), h = R.int(3, 9), H = R.int(4, 15);
      return { fig: FIG.prism(b + " cm", h + " cm", H + " cm"), q: "Un prisme droit a pour base un triangle de base " + M(b) + " cm et de hauteur " + M(h) + " cm. Sa hauteur (longueur du prisme) est " + M(H) + " cm. Calcule son volume (en cm³).", spec: { kind: "value", value: (b * h * H) / 2 }, sol: "Aire de la base " + M("\\frac{" + b + " \\cdot " + h + "}{2} = " + (b * h) / 2) + " cm² ; " + M("V = " + (b * h) / 2 + " \\cdot " + H + " = " + (b * h * H) / 2) + " cm³." };
    }
    const r = R.int(2, 9), h = R.int(3, 20);
    if (R.rand() < 0.5) return { fig: FIG.cylinder("r = " + r, "h = " + h), q: "Calcule le volume d'un cylindre de rayon " + M(r) + " cm et de hauteur " + M(h) + " cm (valeur exacte avec π, ou au centième).", spec: { kind: "value", value: Math.PI * r * r * h, round: 0.01, exactOk: true }, sol: M("V = \\pi r^2 h = " + r * r * h + "\\pi \\approx " + dec((Math.PI * r * r * h).toFixed(2))) + " cm³." };
    const L = R.int(2, 9);
    return { fig: FIG.cylinder("r = " + r + " cm", "h = ?"), q: "Un cylindre de rayon " + M(r) + " cm contient " + M(dec(L)) + " L. Quelle est sa hauteur, en cm, au dixième ?", spec: { kind: "value", value: (L * 1000) / (Math.PI * r * r), round: 0.1 }, sol: M(dec(L) + "\\ \\text{L} = " + L * 1000 + "\\ \\text{cm}^3") + " ; " + M("h = \\frac{" + L * 1000 + "}{\\pi \\cdot " + r * r + "} \\approx " + dec(((L * 1000) / (Math.PI * r * r)).toFixed(1))) + " cm." };
  },

  polyreg(d) {
    const n = R.pick([5, 6, 8, 9, 10, 12]);
    if (d === 1) return { fig: FIG.regPoly(n, "?"), q: "Quelle est la mesure de l'angle au centre d'un polygone régulier à " + M(n) + " côtés (en degrés) ?", spec: { kind: "value", value: 360 / n }, sol: M("\\frac{360°}{" + n + "} = " + dec(360 / n) + "°") + "." };
    if (d === 2) return { fig: FIG.regPoly(n, ""), q: "Quelle est la mesure d'un angle intérieur d'un polygone régulier à " + M(n) + " côtés (en degrés) ?", spec: { kind: "value", value: ((n - 2) * 180) / n }, sol: "Somme des angles : " + M("(" + n + " - 2) \\cdot 180° = " + (n - 2) * 180 + "°") + " ; un angle : " + M(dec(((n - 2) * 180) / n) + "°") + "." };
    const m = R.pick([5, 6, 8, 9, 10, 12, 15, 18, 20]), a = ((m - 2) * 180) / m;
    return { q: "Un angle intérieur d'un polygone régulier mesure " + M(dec(a) + "°") + ". Combien le polygone a-t-il de côtés ?", spec: { kind: "value", value: m }, sol: "L'angle au centre vaut " + M("180° - " + dec(a) + "° = " + dec(180 - a) + "°") + " ; " + M("n = \\frac{360}{" + dec(180 - a) + "} = " + m) + "." };
  },

  // ===== CO 11e =====
  volcone(d) {
    if (d === 1) {
      const c = R.int(2, 9), h = 3 * R.int(1, 5);
      return { fig: FIG.pyramid(c + " cm", "h = " + h), q: "Calcule le volume d'une pyramide à base carrée de côté " + M(c) + " cm et de hauteur " + M(h) + " cm (en cm³).", spec: { kind: "value", value: (c * c * h) / 3 }, sol: M("V = \\frac{1}{3} \\cdot " + c + "^2 \\cdot " + h + " = " + (c * c * h) / 3) + " cm³." };
    }
    if (d === 2) {
      const r = R.int(1, 8), h = 3 * R.int(1, 5);
      if (R.rand() < 0.5) return { fig: FIG.cone("r = " + r, "h = " + h), q: "Calcule le volume d'un cône de rayon " + M(r) + " cm et de hauteur " + M(h) + " cm (valeur exacte avec π, ou au centième).", spec: { kind: "value", value: (Math.PI * r * r * h) / 3, round: 0.01, exactOk: true }, sol: M("V = \\frac{1}{3}\\pi r^2 h = " + (r * r * h) / 3 + "\\pi \\approx " + dec(((Math.PI * r * r * h) / 3).toFixed(2))) + " cm³." };
      return { fig: FIG.sphere("r = " + r), q: "Calcule le volume d'une boule de rayon " + M(r) + " cm (valeur exacte avec π, ou au centième).", spec: { kind: "value", value: (4 / 3) * Math.PI * r ** 3, round: 0.01, exactOk: true }, sol: M("V = \\frac{4}{3}\\pi r^3 = " + ratT((4 * r ** 3) / 3) + "\\pi \\approx " + dec(((4 / 3) * Math.PI * r ** 3).toFixed(2))) + " cm³." };
    }
    if (R.rand() < 0.5) {
      const r = R.int(3, 9), g = r + R.int(2, 6), h = Math.sqrt(g * g - r * r);
      return { fig: FIG.cone("r = " + r, "g = " + g), q: "Un cône a un rayon de " + M(r) + " cm et une génératrice de " + M(g) + " cm. Calcule son volume, au centième (en cm³).", spec: { kind: "value", value: (Math.PI * r * r * h) / 3, round: 0.01 }, sol: "Hauteur par Pythagore : " + M("h = \\sqrt{" + g + "^2 - " + r + "^2} = \\sqrt{" + (g * g - r * r) + "}") + " ; " + M("V = \\frac{1}{3}\\pi \\cdot " + r * r + " \\cdot h \\approx " + dec(((Math.PI * r * r * h) / 3).toFixed(2))) + " cm³." };
    }
    const r = R.int(2, 6), h = R.int(4, 12), hc = 3 * R.int(1, 3);
    const v = Math.PI * r * r * h + (Math.PI * r * r * hc) / 3;
    return { fig: FIG.cylinder("r = " + r, "h = " + h), q: "Une fusée est formée d'un cylindre (rayon " + M(r) + " cm, hauteur " + M(h) + " cm) surmonté d'un cône de même rayon et de hauteur " + M(hc) + " cm. Calcule son volume total, au centième (en cm³).", spec: { kind: "value", value: v, round: 0.01, exactOk: true }, sol: M(r * r * h + "\\pi + " + (r * r * hc) / 3 + "\\pi = " + (r * r * h + (r * r * hc) / 3) + "\\pi \\approx " + dec(v.toFixed(2))) + " cm³." };
  },

  gquot(d) {
    if (d === 1) {
      if (R.rand() < 0.5) { const v = 18 * R.int(1, 7); return { q: "Convertis " + M(v) + " km/h en m/s.", spec: { kind: "value", value: v / 3.6 }, sol: M("1\\ \\text{m/s} = 3{,}6\\ \\text{km/h}") + " : " + M(v + " : 3{,}6 = " + dec(v / 3.6)) + " m/s." }; }
      const v = 5 * R.int(1, 8); return { q: "Convertis " + M(v) + " m/s en km/h.", spec: { kind: "value", value: v * 3.6 }, sol: M(v + " \\cdot 3{,}6 = " + dec(v * 3.6)) + " km/h." };
    }
    if (d === 2) {
      const m = R.pick([[2.7, "d'aluminium", "de l'aluminium"], [7.9, "de fer", "du fer"], [11.3, "de plomb", "du plomb"], [0.9, "de glace", "de la glace"], [19.3, "d'or", "de l'or"]]), V = R.int(5, 80);
      if (R.rand() < 0.5) return { fig: FIG.box("", "", ""), q: "Un bloc " + m[1] + " a un volume de " + M(V) + " cm³ et une masse de " + M(dec(+(m[0] * V).toFixed(2))) + " g. Calcule sa masse volumique (en g/cm³).", spec: { kind: "value", value: m[0] }, sol: M("\\rho = \\frac{m}{V} = \\frac{" + dec(+(m[0] * V).toFixed(2)) + "}{" + V + "} = " + dec(m[0])) + " g/cm³." };
      return { fig: FIG.box("", "", ""), q: "La masse volumique " + m[2] + " est " + M(dec(m[0])) + " g/cm³. Quelle est la masse d'un bloc de " + M(V) + " cm³ (en g) ?", spec: { kind: "value", value: +(m[0] * V).toFixed(4) }, sol: M("m = \\rho \\cdot V = " + dec(m[0]) + " \\cdot " + V + " = " + dec(+(m[0] * V).toFixed(4))) + " g." };
    }
    const q = R.pick([5, 8, 10, 12, 15, 20, 25]), V = R.int(2, 9) * 60;
    return { q: "Un robinet a un débit de " + M(q) + " L/min. Combien de minutes faut-il pour remplir une cuve de " + M(dec(V / 1000)) + " m³ ?", spec: { kind: "value", value: V / q }, sol: M(dec(V / 1000) + "\\ \\text{m}^3 = " + V + "\\ \\text{L}") + " ; " + M("t = \\frac{" + V + "}{" + q + "} = " + dec(V / q)) + " min." };
  },

  formule(d) {
    const F = d === 1
      ? R.pick([
          { f: "v = \\frac{d}{t}", ask: "d", ans: "v*t", sol: "On multiplie par " + M("t") + " : " + M("d = v \\cdot t") },
          { f: "P = 4c", ask: "c", ans: "P/4", sol: M("c = \\frac{P}{4}") },
          { f: "U = R \\cdot I", ask: "I", ans: "U/R", sol: M("I = \\frac{U}{R}") },
          { f: "y = 3x + b", ask: "b", ans: "y - 3x", sol: M("b = y - 3x") },
          { f: "F = m \\cdot a", ask: "a", ans: "F/m", sol: "On divise par " + M("m") + " : " + M("a = \\frac{F}{m}") },
          { f: "p = \\frac{F}{S}", ask: "F", ans: "p*S", sol: "On multiplie par " + M("S") + " : " + M("F = p \\cdot S") },
          { f: "E = m \\cdot g \\cdot h", ask: "h", ans: "E/(m*g)", sol: "On divise par " + M("m \\cdot g") + " : " + M("h = \\frac{E}{m g}") },
          { f: "P = a + b + c", ask: "c", ans: "P - a - b", sol: M("c = P - a - b") },
        ])
      : d === 2
      ? R.pick([
          { f: "A = \\frac{b \\cdot h}{2}", ask: "h", ans: "2A/b", sol: "On multiplie par 2 puis on divise par " + M("b") + " : " + M("h = \\frac{2A}{b}") },
          { f: "P = 2(x + y)", ask: "y", ans: "P/2 - x", sol: M("\\frac{P}{2} = x + y") + " donc " + M("y = \\frac{P}{2} - x") },
          { f: "v = \\frac{d}{t}", ask: "t", ans: "d/v", sol: M("t = \\frac{d}{v}") },
          { f: "y = mx + h", ask: "m", ans: "(y - h)/x", sol: M("mx = y - h") + " donc " + M("m = \\frac{y - h}{x}") },
          { f: "C = 2\\pi r", ask: "r", ans: "C/(2*pi)", sol: "On divise par " + M("2\\pi") + " : " + M("r = \\frac{C}{2\\pi}") },
          { f: "M = \\frac{a + b}{2}", ask: "b", ans: "2M - a", sol: M("2M = a + b") + " donc " + M("b = 2M - a") },
          { f: "y = \\frac{k}{x}", ask: "x", ans: "k/y", sol: M("xy = k") + " donc " + M("x = \\frac{k}{y}") },
          { f: "V = a \\cdot b \\cdot c", ask: "c", ans: "V/(a*b)", sol: M("c = \\frac{V}{a b}") },
        ])
      : R.pick([
          { f: "V = \\frac{1}{3}\\pi r^2 h", ask: "h", ans: "3V/(pi*r^2)", sol: M("h = \\frac{3V}{\\pi r^2}") },
          { f: "A = \\pi r^2", ask: "r", ans: "sqrt(A/pi)", sol: M("r^2 = \\frac{A}{\\pi}") + " donc " + M("r = \\sqrt{\\frac{A}{\\pi}}") + " (un rayon est positif)" },
          { f: "A = \\frac{(c + b) \\cdot h}{2}", ask: "b", ans: "2A/h - c", sol: M("c + b = \\frac{2A}{h}") + " donc " + M("b = \\frac{2A}{h} - c") },
          { f: "c^2 = a^2 + b^2", ask: "a", ans: "sqrt(c^2 - b^2)", sol: M("a = \\sqrt{c^2 - b^2}") + " (une longueur est positive)" },
          { f: "E = \\frac{1}{2} m v^2", ask: "v", ans: "sqrt(2E/m)", sol: M("v^2 = \\frac{2E}{m}") + " donc " + M("v = \\sqrt{\\frac{2E}{m}}") + " (une vitesse est positive)" },
          { f: "V = \\pi r^2 h", ask: "r", ans: "sqrt(V/(pi*h))", sol: M("r^2 = \\frac{V}{\\pi h}") + " donc " + M("r = \\sqrt{\\frac{V}{\\pi h}}") },
          { f: "A = \\frac{d \\cdot D}{2}", ask: "D", ans: "2A/d", sol: M("D = \\frac{2A}{d}") },
        ]);
    return { q: "Dans la formule " + M(F.f) + ", exprime " + M(F.ask) + " en fonction des autres lettres. (Écris par exemple « " + F.ask + " = … » ou seulement l'expression ; pour π, utilise la touche π, pour une racine la touche √.)", spec: { kind: "expr", expr: F.ans, pos: true }, canon: F.ans, sol: F.sol + "." };
  },

  simil(d) {
    const k = R.pick([1.5, 2, 2.5, 3, 4]);
    if (d === 1) {
      const a = R.int(2, 8), b = R.int(3, 9), c = R.int(3, 9);
      return { fig: FIG.simTri([a, b, c].map((v) => v + ""), [dec(a * k), "?", ""]), q: "Deux triangles sont semblables. Les côtés du petit mesurent " + M(a) + ", " + M(b) + " et " + M(c) + " cm. Le côté du grand qui correspond à " + M(a) + " cm mesure " + M(dec(a * k)) + " cm. Combien mesure le côté du grand qui correspond à " + M(b) + " cm ?", spec: { kind: "value", value: b * k }, sol: "Rapport " + M("k = \\frac{" + dec(a * k) + "}{" + a + "} = " + dec(k)) + " ; " + M(b + " \\cdot " + dec(k) + " = " + dec(b * k)) + " cm." };
    }
    if (d === 2) {
      const A = R.int(3, 20);
      return { fig: FIG.scaling(k, ""), q: "On agrandit une figure de rapport " + M(dec(k)) + ". Son aire était de " + M(A) + " cm². Quelle est la nouvelle aire (en cm²) ?", spec: { kind: "value", value: A * k * k }, sol: "Les aires sont multipliées par " + M("k^2 = " + dec(k * k)) + " : " + M(dec(A * k * k)) + " cm²." };
    }
    const kk = R.pick([2, 3, 4, 5]), A1 = R.int(2, 12);
    if (R.rand() < 0.5) return { q: "Deux figures semblables ont pour aires " + M(A1) + " cm² et " + M(A1 * kk * kk) + " cm². Le périmètre de la petite vaut " + M(A1 + 7) + " cm. Quel est le périmètre de la grande (en cm) ?", spec: { kind: "value", value: (A1 + 7) * kk }, sol: M("k^2 = \\frac{" + A1 * kk * kk + "}{" + A1 + "} = " + kk * kk) + " donc " + M("k = " + kk)+ " ; les longueurs sont multipliées par " + M(kk) + " : " + M((A1 + 7) * kk) + " cm." };
    return { fig: FIG.box("", "", ""), q: "Une maquette est à l'échelle " + M("1 : " + kk * 10) + ". Le volume de la maquette est de " + M(A1) + " cm³. Quel est le volume réel, en litres ?", spec: { kind: "value", value: (A1 * (kk * 10) ** 3) / 1000 }, sol: "Les volumes sont multipliés par " + M("k^3 = " + (kk * 10) ** 3) + " : " + M(A1 * (kk * 10) ** 3 + "\\ \\text{cm}^3 = " + dec((A1 * (kk * 10) ** 3) / 1000) + "\\ \\text{L}") + "." };
  },

  proba(d) {
    if (d === 1) {
      const c = { rouges: R.int(2, 6), bleues: R.int(2, 6), vertes: R.int(1, 4) }, n = c.rouges + c.bleues + c.vertes, col = R.pick(["rouges", "bleues", "vertes"]);
      return { fig: FIG.urn(c), q: "Une urne contient " + M(c.rouges) + " boules rouges, " + M(c.bleues) + " bleues et " + M(c.vertes) + " vertes. On tire une boule au hasard. Quelle est la probabilité qu'elle soit " + col.slice(0, -1) + " ? (fraction acceptée)", spec: { kind: "value", value: c[col] / n }, sol: "Cas favorables sur cas possibles : " + M("\\frac{" + c[col] + "}{" + n + "}" + (gcd(c[col], n) > 1 ? " = " + frac(c[col], n) : "")) + "." };
    }
    if (d === 2) {
      const s = R.int(3, 11), cnt = 6 - Math.abs(7 - s);
      return { q: "On lance deux dés équilibrés et on additionne les points. Quelle est la probabilité d'obtenir " + M(s) + " ? (fraction acceptée)", spec: { kind: "value", value: cnt / 36 }, sol: "Tableau 6 × 6 : " + M(cnt) + " cases donnent " + M(s) + " sur 36, soit " + M(frac(cnt, 36)) + "." };
    }
    const r = R.int(3, 6), b = R.int(2, 5), n = r + b;
    return { fig: FIG.urn({ rouges: r, bleues: b }), q: "Une urne contient " + M(r) + " boules rouges et " + M(b) + " bleues. On tire deux boules sans remise. Quelle est la probabilité d'obtenir deux boules de la même couleur ? (fraction acceptée)", spec: { kind: "value", value: (r * (r - 1) + b * (b - 1)) / (n * (n - 1)) }, sol: "Arbre : " + M("\\frac{" + r + "}{" + n + "} \\cdot \\frac{" + (r - 1) + "}{" + (n - 1) + "} + \\frac{" + b + "}{" + n + "} \\cdot \\frac{" + (b - 1) + "}{" + (n - 1) + "} = " + frac(r * (r - 1) + b * (b - 1), n * (n - 1))) + "." };
  },

  probeq(d) {
    if (d === 1) {
      const n = R.int(5, 40), s = 3 * n + 3;
      return { q: "La somme de trois nombres entiers consécutifs vaut " + M(s) + ". Quel est le plus petit ?", spec: { kind: "value", value: n }, sol: M("n + (n + 1) + (n + 2) = " + s + " \\iff 3n + 3 = " + s + " \\iff n = " + n) + "." };
    }
    if (d === 2) {
      if (R.rand() < 0.5) {
        const k = 3 * R.int(4, 40), n = (5 * k) / 3;
        return { q: "Une personne possède une somme en pièces de 2 francs. Elle l'échange contre des pièces de 5 francs et a alors " + M(k) + " pièces de moins. Quelle somme possède-t-elle (en francs) ?", spec: { kind: "value", value: 2 * n }, sol: M("n") + " pièces de 2 : " + M("2n = 5(n - " + k + ") \\iff 3n = " + 5 * k + " \\iff n = " + n) + " ; somme " + M(2 * n) + " francs." };
      }
      const a = R.int(8, 16), age = R.int(30, 45), y = R.int(3, 12); // dans y ans, le parent aura le double de l'âge de l'enfant
      const e = age + y - 2 * y; if (e <= 0 || (age + y) % 2) return GEN.probeq(2);
      const enf = (age + y) / 2 - y; if (enf < 1 || enf >= age) return GEN.probeq(2);
      return { q: "Un parent a " + M(age) + " ans et son enfant " + M("x") + " ans. Dans " + M(y) + " ans, le parent aura le double de l'âge de l'enfant. Quel âge a l'enfant aujourd'hui ?", spec: { kind: "value", value: enf }, sol: M(age + " + " + y + " = 2(x + " + y + ") \\iff x = " + enf) + "." };
    }
    // Niveau 3 : problèmes plus longs, toujours du 1er degré (le 2e degré est dans probeq2) — audit 13.11.
    const t3 = R.int(0, 2);
    if (t3 === 0) { const n = R.int(12, 40), x = R.int(3, n - 3), A = R.pick([12, 15, 18, 20, 24]), E = R.pick([5, 6, 8, 9, 10]), T = A * x + E * (n - x);
      return { q: "Un groupe de " + M(n) + " personnes visite un musée. Le billet adulte coûte " + M(A) + " CHF, le billet enfant " + M(E) + " CHF. Le groupe paie " + M(nb(T)) + " CHF en tout. Combien y a-t-il d'adultes ?", spec: { kind: "value", value: x },
        sol: M("x") + " adultes et " + M(n + " - x") + " enfants : " + M(A + "x + " + E + "(" + n + " - x) = " + T + " \\iff " + (A - E) + "x = " + (T - E * n) + " \\iff x = " + x) + "." }; }
    if (t3 === 1) { const v1 = R.pick([60, 70, 80, 90, 100]), v2 = R.pick([40, 50, 60, 80]), t = R.pick([1.5, 2, 2.5, 3]), D = (v1 + v2) * t;
      return { q: "Deux trains partent en même temps de deux villes distantes de " + M(D) + " km et roulent l'un vers l'autre, à " + M(v1) + " km/h et " + M(v2) + " km/h. Au bout de combien d'heures se croisent-ils ?", spec: { kind: "value", value: t },
        sol: "En " + M("t") + " heures, ils parcourent ensemble " + M("(" + v1 + " + " + v2 + ")t") + " km : " + M((v1 + v2) + "t = " + D + " \\iff t = " + dec(t)) + " h." }; }
    const l = R.int(3, 20), k = R.int(2, 9), P = 2 * (2 * l + k);
    return { fig: FIG.rectFig(l + k, l, "?", "?"), q: "Un rectangle a un périmètre de " + M(P) + " cm. Sa longueur dépasse sa largeur de " + M(k) + " cm. Quelle est sa largeur (en cm) ?", spec: { kind: "value", value: l },
      sol: "Largeur " + M("x") + ", longueur " + M("x + " + k) + " : " + M("2(x + x + " + k + ") = " + P + " \\iff 4x + " + 2 * k + " = " + P + " \\iff x = " + l) + " cm." };
  },

  // ===== Collège 1re =====
  polyop(d) {
    let cs, q, sol;
    if (d === 1) {
      const a = R.nz(-4, 4), b = R.nz(-7, 7), c = R.nz(-4, 4), e = R.nz(-7, 7);
      cs = pmul([a, b], [c, e]);
      q = "(" + lin(a, b) + ")(" + lin(c, e) + ")";
      sol = "Double distributivité : " + M(poly(cs));
    } else if (d === 2) {
      const a = R.int(2, 5), b = R.nz(-6, 6), c = R.int(1, 4), e = R.int(1, 7);
      cs = padd(pmul([a, b], [a, b]), pscale(pmul([c, e], [c, -e]), -1));
      q = "(" + lin(a, b) + ")^2 - (" + lin(c, e) + ")(" + lin(c, -e) + ")";
      sol = M("(" + lin(a, b) + ")^2 = " + poly(pmul([a, b], [a, b]))) + " et " + M("(" + lin(c, e) + ")(" + lin(c, -e) + ") = " + poly(pmul([c, e], [c, -e]))) + " ; on soustrait : " + M(poly(cs));
    } else {
      const a = R.pick([1, 2]), b = R.nz(-3, 3), p = R.nz(-4, 4), r = R.nz(-5, 5), s = R.nz(-5, 5);
      cs = padd(pmul(pmul([a, b], [a, b]), [a, b]), pscale(pmul([1, p], [1, 0, r]), -1));
      q = "(" + lin(a, b) + ")^3 - (" + lin(1, p) + ")(" + poly([1, 0, r]) + ")";
      sol = M("(" + lin(a, b) + ")^3 = " + poly(pmul(pmul([a, b], [a, b]), [a, b]))) + " ; " + M("(" + lin(1, p) + ")(" + poly([1, 0, r]) + ") = " + poly(pmul([1, p], [1, 0, r]))) + " ; différence : " + M(poly(ptrim(cs)));
      void s;
    }
    cs = ptrim(cs);
    return { q: "Développe et réduis : " + M(q) + ".", spec: { kind: "expr", expr: poly(cs), form: "expanded" }, canon: poly(cs), sol: sol + "." };
  },

  factor2(d) {
    let ex, fac, sol;
    if (d === 1) {
      if (R.rand() < 0.5) { const a = R.int(2, 6), k = R.int(1, 9); ex = poly([a, 0, -a * k * k]); fac = a + "(x - " + k + ")(x + " + k + ")"; sol = "Mise en évidence de " + M(a) + ", puis " + M("x^2 - " + k * k) + " (différence de carrés)"; }
      else { const a = R.int(2, 6), m = R.nz(-9, 9); ex = poly([a, a * m, 0]); fac = a + "x(" + lin(1, m) + ")"; sol = "Mise en évidence de " + M(a + "x"); }
    } else if (d === 2) {
      const p = R.nz(-7, 7), q = R.nz(-7, 7), a = R.pick([1, 1, 2, 3]);
      if (p === q || p === -q) return GEN.factor2(2);
      ex = poly(pscale(pmul([1, -p], [1, -q]), a));
      fac = (a > 1 ? a : "") + "(" + xm(p) + ")(" + xm(q) + ")";
      sol = (a > 1 ? "Mise en évidence de " + M(a) + ", puis " : "") + "deux nombres de somme " + M(-(p + q)) + " et de produit " + M(p * q) + " : " + M(-p) + " et " + M(-q);
    } else {
      if (R.rand() < 0.5) {
        const p = R.nz(-5, 5), q = R.int(1, 5);
        if (Math.abs(p) === q) return GEN.factor2(3);
        ex = poly([1, p, -q * q, -p * q * q]);
        fac = "(" + lin(1, p) + ")(x - " + q + ")(x + " + q + ")";
        sol = "Groupements : " + M("x^2(" + lin(1, p) + ") - " + q * q + "(" + lin(1, p) + ") = (" + lin(1, p) + ")(x^2 - " + q * q + ")") + ", puis différence de carrés";
      } else {
        let a, b, c, e; do { a = R.int(2, 4); b = R.nz(-5, 5); c = R.int(1, 3); e = R.nz(-5, 5); } while (gcd(a, Math.abs(b)) !== 1 || gcd(c, Math.abs(e)) !== 1 || a * e === b * c);
        ex = poly(pmul([a, b], [c, e]));
        fac = "(" + lin(a, b) + ")(" + lin(c, e) + ")";
        sol = "Trinôme : discriminant (ou méthode « produit-somme »), racines " + M(ratT(-b / a)) + " et " + M(ratT(-e / c));
      }
    }
    return { q: "Factorise au maximum : " + M(ex) + ".", spec: { kind: "expr", expr: fac, form: "product" }, canon: fac, sol: sol + " : " + M(fac.replace(/\*/g, "")) + "." };
  },

  sys2(d) {
    // Corrigé détaillé par combinaison (audit 13.11).
    const steps = (a, b, r1, c, e, r2, X, Y) => {
      const k = a * e - b * c, rhs = r1 * e - r2 * b;
      return "On multiplie la 1re équation par " + M(par(e)) + " et la 2e par " + M(par(b)) + ", puis on soustrait pour éliminer " + M("y") + " : " +
        M(k + "x = " + rhs) + ", donc " + M("x = " + ratT(X)) + ". On remplace dans la 1re : " + M((b === 1 ? "" : b === -1 ? "-" : b) + "y = " + r1 + " - " + par(a) + " \\cdot " + par(+X.toFixed(6)) + " = " + (r1 - a * X)) + ", donc " + M("y = " + ratT(Y)) + ". Solution : " + M("(" + ratT(X) + " ; " + ratT(Y) + ")") + ".";
    };
    const x = R.nz(-6, 8), y = R.nz(-6, 8);
    const term = (c, v) => (c === 1 ? v : c === -1 ? "-" + v : c + v);
    const row = (a, b, r) => term(a, "x") + (b < 0 ? " - " + term(-b, "y") : " + " + term(b, "y")) + " = " + r;
    if (d === 1) {
      let a, b, c, e; do { a = R.nz(-4, 4); b = R.nz(-4, 4); c = R.nz(-4, 4); e = R.nz(-4, 4); } while (a * e - b * c === 0 || (Math.abs(a) !== 1 && Math.abs(b) !== 1 && Math.abs(c) !== 1 && Math.abs(e) !== 1));
      return { q: "Résous le système " + M("\\begin{cases} " + row(a, b, a * x + b * y) + " \\\\ " + row(c, e, c * x + e * y) + " \\end{cases}") + ". Réponds « x ; y ».", spec: { kind: "pair", values: [x, y] }, sol: steps(a, b, a * x + b * y, c, e, c * x + e * y, x, y) };
    }
    if (d === 2) {
      let a, b, c, e; do { a = R.nz(-7, 7); b = R.nz(-7, 7); c = R.nz(-7, 7); e = R.nz(-7, 7); } while (a * e - b * c === 0 || Math.abs(a) < 2 || Math.abs(b) < 2 || Math.abs(c) < 2 || Math.abs(e) < 2);
      const X = R.nz(-5, 5) / 2, Y = R.nz(-6, 6);
      const r1 = a * X + b * Y, r2 = c * X + e * Y;
      if (!Number.isInteger(r1) || !Number.isInteger(r2)) return GEN.sys2(2);
      return { q: "Résous le système " + M("\\begin{cases} " + row(a, b, r1) + " \\\\ " + row(c, e, r2) + " \\end{cases}") + ". Réponds « x ; y » (fractions acceptées).", spec: { kind: "pair", values: [X, Y] }, sol: steps(a, b, r1, c, e, r2, X, Y) };
    }
    const n1 = R.int(4, 9), n2 = n1 + R.int(3, 8), a = R.int(3, 9), b = 5 * R.int(2, 8);
    return { q: "Un cinéma propose un abonnement annuel fixe plus un prix réduit par film. Un client qui a vu " + M(n1) + " films a payé " + M(a * n1 + b) + " CHF ; un autre qui en a vu " + M(n2) + " a payé " + M(a * n2 + b) + " CHF. Donne le prix d'un film puis celui de l'abonnement : « prix ; abonnement ».", spec: { kind: "pair", values: [a, b] }, sol: M("\\begin{cases} " + n1 + "a + b = " + (a * n1 + b) + " \\\\ " + n2 + "a + b = " + (a * n2 + b) + " \\end{cases}") + " : soustraction, " + M((n2 - n1) + "a = " + a * (n2 - n1)) + ", donc " + M("a = " + a) + " CHF et " + M("b = " + b) + " CHF." };
  },

  sys3(d) {
    const x = R.nz(-4, 5), y = R.nz(-4, 5), z = R.nz(-4, 5);
    const T = (c, v, first) => (c === 0 ? "" : (first ? (c < 0 ? "-" : "") : c < 0 ? " - " : " + ") + (Math.abs(c) === 1 ? "" : Math.abs(c)) + v);
    const row = (c) => { const s = T(c[0], "x", true) + T(c[1], "y", c[0] === 0) + T(c[2], "z", c[0] === 0 && c[1] === 0); return s + " = " + (c[0] * x + c[1] * y + c[2] * z); };
    const det = (m) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
    let m;
    if (d === 1) m = [[1, 1, 1], [0, 1, R.nz(-3, 3)], [0, 0, R.nz(-3, 3)]];
    else if (d === 2) { do m = [[1, R.int(-2, 2), R.int(-2, 2)], [R.int(-2, 3), R.nz(-2, 3), R.int(-2, 2)], [R.int(-2, 3), R.int(-2, 2), R.nz(-3, 3)]]; while (det(m) === 0); }
    else { do m = [0, 1, 2].map(() => [R.nz(-4, 4), R.nz(-4, 4), R.nz(-4, 4)]); while (det(m) === 0 || m.some((r) => r.every((v) => Math.abs(v) === 1))); }
    // Corrigé de Gauss détaillé (audit 13.11) : x éliminé de L2 et L3 avec L1, puis y, puis remontée.
    const gauss = (m, rhs, sol, names = ["x", "y", "z"]) => {
      const [A, B, C] = m.map((r, i) => r.concat([rhs[i]]));
      const lin2 = (r) => T(r[1], names[1], true) + T(r[2], names[2], r[1] === 0) + " = " + r[3];
      const comb = (r, p, f) => r.map((v, k) => p * v - f * A[k]);
      const B2 = comb(B, A[0], B[0]), C2 = comb(C, A[0], C[0]);
      const sB = B[0] === 0 ? "" : "L2 ← " + (A[0] === 1 ? "" : A[0]) + "L2 " + (B[0] < 0 ? "+ " + (B[0] === -1 ? "" : -B[0]) : "- " + (B[0] === 1 ? "" : B[0])) + "L1", sC = C[0] === 0 ? "" : "L3 ← " + (A[0] === 1 ? "" : A[0]) + "L3 " + (C[0] < 0 ? "+ " + (C[0] === -1 ? "" : -C[0]) : "- " + (C[0] === 1 ? "" : C[0])) + "L1";
      let t = "On élimine " + M(names[0]) + (sB || sC ? " (" + [sB, sC].filter(Boolean).join(", ") + ")" : "") + " : " + M("\\begin{cases} " + lin2(B2) + " \\\\ " + lin2(C2) + " \\end{cases}") + ". ";
      const C3 = B2[1] === 0 ? C2 : C2[1] === 0 ? C2 : C2.map((v, k) => B2[1] * v - C2[1] * B2[k]);
      const zRow = B2[1] === 0 ? B2 : C3;
      t += "On élimine " + M(names[1]) + " : " + M((zRow[2] === 1 ? "" : zRow[2] === -1 ? "-" : zRow[2]) + names[2] + " = " + zRow[3]) + ", donc " + M(names[2] + " = " + sol[2]) + ". ";
      return t + "On remonte : " + M(names[1] + " = " + sol[1]) + ", puis " + M(names[0] + " = " + sol[0]) + ". Solution : " + M("(" + sol.join(" ; ") + ")") + ".";
    };
    if (d === 3 && R.rand() < 0.5) {
      const a = R.int(8, 20), e = R.int(4, 12), s = R.int(5, 10), na = R.int(1, 4), ne = R.int(1, 4), ns = R.int(1, 4);
      const t1 = 2 * a + 3 * e + s, t2 = a + 2 * e + 2 * s, t3 = na * a + ne * e + ns * s;
      const mm = [[2, 3, 1], [1, 2, 2], [na, ne, ns]]; if (det(mm) === 0) return GEN.sys3(3);
      return { q: "Au cinéma : 2 adultes, 3 enfants et 1 senior paient " + M(t1) + " CHF ; 1 adulte, 2 enfants et 2 seniors paient " + M(t2) + " CHF ; " + na + " adulte" + (na > 1 ? "s" : "") + ", " + ne + " enfant" + (ne > 1 ? "s" : "") + " et " + ns + " senior" + (ns > 1 ? "s" : "") + " paient " + M(t3) + " CHF. Prix adulte, enfant, senior : « a ; e ; s ».", spec: { kind: "pair", values: [a, e, s] }, sol: "Système " + M("\\begin{cases} 2a + 3e + s = " + t1 + " \\\\ a + 2e + 2s = " + t2 + " \\\\ " + (na === 1 ? "" : na) + "a + " + (ne === 1 ? "" : ne) + "e + " + (ns === 1 ? "" : ns) + "s = " + t3 + " \\end{cases}") + ". " + gauss(mm, [t1, t2, t3], [a, e, s], ["a", "e", "s"]) + " (en CHF)" };
    }
    return { q: "Résous le système " + M("\\begin{cases} " + m.map(row).join(" \\\\ ") + " \\end{cases}") + ". Réponds « x ; y ; z ».", spec: { kind: "pair", values: [x, y, z] }, sol: d === 1 ? "Le système est triangulaire : la 3e équation donne " + M("z = " + z) + ", la 2e " + M("y = " + y) + ", la 1re " + M("x = " + x) + "." : gauss(m, m.map((r) => r[0] * x + r[1] * y + r[2] * z), [x, y, z]) };
  },

  domaine(d) {
    const r = R.nz(-7, 7);
    if (d === 1) {
      if (R.rand() < 0.5) return { q: "Détermine le domaine de définition de " + M("f(x) = \\frac{" + R.nz(-9, 9) + "}{" + xm(r) + "}") + ". (Écris par exemple « R \\ {2} » ou « x ≠ 2 ».)", spec: solsetSpec([[-Infinity, false, r, false], [r, false, Infinity, false]]), sol: "On ne divise pas par 0 : " + M("x \\ne " + r) + ", donc " + M("D = \\mathbb{R} \\setminus \\{" + r + "\\}") + "." };
      return { q: "Détermine le domaine de définition de " + M("f(x) = \\sqrt{" + xm(r) + "}") + ". (Écris par exemple « x >= 2 ».)", spec: solsetSpec([[r, true, Infinity, false]]), sol: "Sous une racine, il faut " + M(xm(r) + " \\ge 0") + " : " + M("D = [" + r + " \\, ; +\\infty[") + "." };
    }
    if (d === 2) {
      if (R.rand() < 0.5) { const k = R.int(1, 7); return { q: "Détermine le domaine de définition de " + M("f(x) = \\frac{x}{x^2 - " + k * k + "}") + ".", spec: solsetSpec([[-Infinity, false, -k, false], [-k, false, k, false], [k, false, Infinity, false]]), sol: M("x^2 - " + k * k + " = 0 \\iff x = \\pm " + k) + " : " + M("D = \\mathbb{R} \\setminus \\{-" + k + " ; " + k + "\\}") + "." }; }
      const a = -R.int(2, 5), b = R.int(1, 12), z = -b / a;
      return { q: "Détermine le domaine de définition de " + M("f(x) = \\sqrt{" + lin(a, b) + "}") + ".", spec: solsetSpec([[-Infinity, false, z, true]]), sol: M(lin(a, b) + " \\ge 0 \\iff x \\le " + ratT(z)) + " (on divise par " + M(a) + " : on retourne le signe) : " + M("D = ]-\\infty \\, ; " + ratT(z) + "]") + "." };
    }
    if (R.rand() < 0.5) {
      const s = r + R.int(1, 6);
      return { q: "Détermine le domaine de définition de " + M("f(x) = \\frac{\\sqrt{" + xm(r) + "}}{" + xm(s) + "}") + ".", spec: solsetSpec([[r, true, s, false], [s, false, Infinity, false]]), sol: "Il faut " + M("x \\ge " + r) + " et " + M("x \\ne " + s) + " : " + M("D = [" + r + " ; " + s + "[ \\cup ]" + s + " ; +\\infty[") + "." };
    }
    const p = R.nz(-6, 4), q = p + R.int(1, 6);
    return { q: "Détermine le domaine de définition de " + M("f(x) = \\sqrt{" + poly([1, -(p + q), p * q]) + "}") + ".", spec: solsetSpec([[-Infinity, false, p, true], [q, true, Infinity, false]]), sol: M(poly([1, -(p + q), p * q]) + " = (" + xm(p) + ")(" + xm(q) + ")") + " est positif à l'extérieur des racines : " + M("D = ]-\\infty ; " + p + "] \\cup [" + q + " ; +\\infty[") + "." };
  },

  f2(d) {
    if (d === 1) {
      const p = R.nz(-6, 6), q = R.nz(-6, 6), a0 = R.pick([1, 1, -1, 2, -2, 3, 0.5, -0.5]);
      return { fig: FIG.parabola((x) => a0 * (x - p) * (x - q) / 3, [], null, false), q: "Détermine les zéros de " + M("f(x) = " + poly([a0, -a0 * (p + q), a0 * p * q])) + ".", spec: { kind: "set", values: [...new Set([p, q])] }, sol: "Produit-somme ou discriminant : " + M("f(x) = " + (a0 === 1 ? "" : a0 === -1 ? "-" : ratT(a0)) + "(" + xm(p) + ")(" + xm(q) + ")") + ", zéros " + M(p) + " et " + M(q) + "." };
    }
    if (d === 2) {
      const h = R.nz(-4, 4), k = R.int(-6, 6), a = R.pick([1, -1, 2, -2, 3, 0.5, -0.5, 1.5]);
      return { fig: FIG.parabola((x) => (a * (x - h) ** 2 + k) / 3, [], null, false), q: "Détermine le sommet de la parabole " + M("f(x) = " + poly([a, -2 * a * h, a * h * h + k])) + ". Réponds « x ; y ».", spec: { kind: "pair", values: [h, k] }, sol: M("x_S = -\\frac{b}{2a} = " + h) + " ; " + M("y_S = f(" + h + ") = " + k) + "." };
    }
    const a = R.pick([-2, 2, 3, -3, 0.5, -0.5, 1.5, -1]), b = R.nz(-7, 7), c = R.int(-5, 5);
    const xs = -b / (2 * a), ys = a * xs * xs + b * xs + c;
    return { fig: FIG.parabola((x) => (a * x * x + b * x + c) / 4, [], null, false), q: "Détermine le sommet de " + M("f(x) = " + poly([a, b, c])) + ". Réponds « x ; y » (fractions acceptées).", spec: { kind: "pair", values: [xs, ys] }, sol: M("x_S = -\\frac{" + b + "}{" + 2 * a + "} = " + ratT(xs)) + " ; " + M("y_S = f(x_S) = " + ratT(ys)) + "." };
  },

  f2expr(d) {
    if (d === 1) {
      let p, q, a; do { p = R.nz(-4, 3); q = R.nz(-3, 4); a = R.pick([-1, 2, -2, 0.5, -0.5, 1]); } while (p === q || Math.abs(a * p * q) > 5);
      const f = (x) => a * (x - p) * (x - q), c = a * p * q;
      const ex = rat(a) + "*(x" + sg(-p) + ")*(x" + sg(-q) + ")";
      return { fig: FIG.plot([{ f }], [[p, 0, ""], [q, 0, ""], [0, c, ""]], { numbers: true, yr: [-6, 6] }), q: "La parabole coupe l'axe des " + M("x") + " en " + M(p) + " et " + M(q) + ", et l'axe des " + M("y") + " en " + M(ratT(c)) + ". Donne l'expression de " + M("f(x)") + ".", spec: { kind: "expr", expr: ex }, canon: ex, sol: M("f(x) = a(" + xm(p) + ")(" + xm(q) + ")") + " ; " + M("f(0) = " + cx(p * q) + "a = " + ratT(c)) + " donc " + M("a = " + ratT(a)) + "." };
    }
    if (d === 2) {
      const h = R.nz(-3, 3), k = R.int(-4, 4), a = R.pick([1, -1, 2, -2, 0.5, -0.5]), x1 = h + R.pick([-2, -1, 1, 2]), y1 = a * (x1 - h) ** 2 + k;
      const ex = rat(a) + "*(x" + sg(-h) + ")^2" + sg(k);
      return { fig: FIG.plot([{ f: (x) => a * (x - h) ** 2 + k }], [[h, k, "S"], [x1, y1, "P"]], { numbers: true, yr: [-6, 6] }), q: "Une parabole a pour sommet " + M("S(" + h + " ; " + k + ")") + " et passe par " + M("P(" + x1 + " ; " + ratT(y1) + ")") + ". Donne l'expression de " + M("f(x)") + ".", spec: { kind: "expr", expr: ex }, canon: ex, sol: M("f(x) = a(" + xm(h) + ")^2 " + (k < 0 ? "- " + -k : "+ " + k)) + " ; avec " + M("P") + " : " + M("a = " + ratT(a)) + "." };
    }
    const a = R.nz(-2, 2), b = R.int(-4, 4), c = R.int(-4, 4), xs = [-1, 1, 2], ys = xs.map((x) => a * x * x + b * x + c);
    const ex = poly([a, b, c]);
    return { fig: FIG.plot([{ f: (x) => a * x * x + b * x + c }], xs.map((x, i) => [x, ys[i], ""]), { numbers: true, yr: [-8, 8], squash: 0.75 }), q: "Une parabole passe par " + xs.map((x, i) => M("(" + x + " ; " + ys[i] + ")")).join(", ") + ". Donne l'expression " + M("f(x) = ax^2 + bx + c") + ".", spec: { kind: "expr", expr: ex }, canon: ex, sol: "Système en " + M("a, b, c") + " : " + M("a - b + c = " + ys[0]) + ", " + M("a + b + c = " + ys[1]) + ", " + M("4a + 2b + c = " + ys[2]) + " ; " + M("f(x) = " + ex) + "." };
  },

  racinv(d) {
    if (d === 1) {
      const a = R.sign() * R.int(2, 12), y = R.pick([2, 3, 4, 6, -2, -3, 5]);
      if (R.rand() < 0.5) { const x = R.nz(-6, 6); return { fig: FIG.plot([{ f: (t) => a / t }], [], { ticks: true }), q: "Soit " + M("f(x) = \\frac{" + a + "}{x}") + ". Calcule " + M("f(" + x + ")") + " (fraction acceptée).", spec: { kind: "value", value: a / x }, sol: M("\\frac{" + a + "}{" + x + "} = " + ratT(a / x)) + "." }; }
      return { fig: FIG.plot([{ f: (t) => a / t }], [], {}), q: "Soit " + M("f(x) = \\frac{" + a + "}{x}") + ". Détermine la préimage de " + M(y) + ".", spec: { kind: "value", value: a / y }, sol: M("\\frac{" + a + "}{x} = " + y + " \\iff x = \\frac{" + a + "}{" + y + "} = " + ratT(a / y)) + "." };
    }
    if (d === 2) {
      const t = R.int(2, 5), c = t * t - t;
      return { fig: FIG.plot([{ f: (x) => Math.sqrt(x), from: 0 }, { f: (x) => x - c }], [], { xr: [-2, 30], yr: [-3, 7], grid: false, ticks: false }), q: "Résous " + M("\\sqrt{x} = x - " + c) + ". (Attention aux solutions parasites.)", spec: { kind: "set", values: [t * t] }, sol: "On élève au carré : " + M("x = (x - " + c + ")^2") + ", d'où " + M(t * t) + " et " + M((1 - t) ** 2) + ". Vérification : seule " + M("x = " + t * t) + " convient (" + M("\\sqrt{" + (1 - t) ** 2 + "} \\ne " + ((1 - t) ** 2 - c)) + ")." };
    }
    let p, q; do { p = R.nz(-5, 5); q = R.nz(-5, 5); } while (p === q || p + q === 0);
    const k = p * q, m = -(p + q); // k/x = x + m  ⇔ x² + m x - k = 0 → racines p, q ⇔ p+q = -m, pq = -k
    return { fig: FIG.plot([{ f: (x) => -k / x }, { f: (x) => x + m }], [], { grid: false, ticks: false }), q: "Pour quelles valeurs de " + M("x") + " les graphes de " + M("f(x) = \\frac{" + -k + "}{x}") + " et " + M("g(x) = " + lin(1, m)) + " se coupent-ils ?", spec: { kind: "set", values: [p, q] }, sol: M("\\frac{" + -k + "}{x} = " + lin(1, m) + " \\iff " + poly([1, m, k]) + " = 0") + " ; " + M("x = " + p) + " ou " + M("x = " + q) + "." };
  },

  ineq2(d) {
    const op = R.pick(["<", "<=", ">", ">="]);
    if (d === 1) {
      const p = R.nz(-6, 4), q = p + R.int(1, 7), f = (x) => (x - p) * (x - q);
      return { fig: FIG.parabola((x) => f(x) / 3, [], null, false), q: "Résous " + M("(" + xm(p) + ")(" + xm(q) + ") " + OPT[op] + " 0") + ".", spec: solsetSpec(signSet(f, [p, q], [], op)), sol: "La parabole est tournée vers le haut, de zéros " + M(p) + " et " + M(q) + " : " + M("S = " + SolSet.show(signSet(f, [p, q], [], op))) + "." };
    }
    if (d === 2) {
      if (R.rand() < 0.25) { const b = R.int(-3, 3), c = R.int(Math.ceil((b * b) / 4) + 1, 9), f = (x) => x * x + b * x + c, ivs = signSet(f, [], [], op); return { q: "Résous " + M(poly([1, b, c]) + " " + OPT[op] + " 0") + ". (Réponds « R » ou « aucune » si besoin.)", spec: solsetSpec(ivs), sol: M("\\Delta = " + (b * b - 4 * c) + " < 0") + " : le trinôme est toujours positif, " + M("S = " + (ivs.length ? "\\mathbb{R}" : "\\varnothing")) + "." }; }
      const p = R.nz(-6, 4), q = p + R.int(1, 7), a = R.pick([1, -1, 2, -1]), f = (x) => a * (x - p) * (x - q);
      return { q: "Résous " + M(poly([a, -a * (p + q), a * p * q]) + " " + OPT[op] + " 0") + ".", spec: solsetSpec(signSet(f, [p, q], [], op)), sol: "Zéros " + M(p) + " et " + M(q) + ". Comme " + M("a = " + a) + (a > 0 ? " > 0" : " < 0") + ", le trinôme est " + (a > 0 ? "positif" : "négatif") + " à l'extérieur des zéros et " + (a > 0 ? "négatif" : "positif") + " entre eux. On cherche où il est " + (op[0] === ">" ? "positif" : "négatif") + (op.length > 1 ? " ou nul" : "") + " : " + M("S = " + SolSet.show(signSet(f, [p, q], [], op))) + "." };
    }
    // f(x) op g(x), f quadratique non unitaire, g affine (épreuve commune 1re)
    const p = R.nz(-4, 2), q = p + R.pick([1.5, 2.5, 3, 3.5, 4.5, 5]), a = R.pick([-2, 2, -1, 1]), m = R.nz(-3, 3), k = R.int(-4, 4);
    const D = pmul([1, -p], [1, -q]).map((v) => v * a);
    if (D.some((v) => !Number.isInteger(v))) return GEN.ineq2(3);
    const fc = padd(D, [m, k]), f = (x) => a * (x - p) * (x - q);
    return { fig: FIG.parabola((x) => (fc[0] * x * x + fc[1] * x + fc[2]) / 4, [], (x) => (m * x + k) / 4, false), q: "Soit " + M("f(x) = " + poly(fc)) + " et " + M("g(x) = " + lin(m, k)) + ". Résous " + M("f(x) " + OPT[op] + " g(x)") + ".", spec: solsetSpec(signSet(f, [p, q], [], op)), sol: M("f(x) - g(x) = " + poly(D)) + ", de zéros " + M(ratT(p)) + " et " + M(ratT(q)) + " ; tableau des signes : " + M("S = " + SolSet.show(signSet(f, [p, q], [], op))) + "." };
  },

  euclide(d) {
    if (d === 1) {
      const p = R.int(1, 9), q = R.int(1, 9); if (!Number.isInteger(Math.sqrt(p * q))) return GEN.euclide(1);
      return { fig: GF.altitude(p, q, { lp: p + " cm", lq: q + " cm", lh: "h = ?" }), q: "Dans un triangle rectangle, la hauteur issue de l'angle droit découpe l'hypoténuse en segments de " + M(p) + " cm et " + M(q) + " cm. Calcule la hauteur (en cm).", spec: { kind: "value", value: Math.sqrt(p * q) }, sol: "Théorème de la hauteur : " + M("h^2 = p \\cdot q = " + p * q) + ", " + M("h = " + Math.sqrt(p * q)) + " cm." };
    }
    if (d === 2) {
      const c = R.int(5, 16), p = R.int(1, c - 1), a = Math.sqrt(p * c);
      return { fig: GF.altitude(p, c - p, { lp: p + " cm", lq: "", lh: "", lc: "c = " + c + " cm", la: "a = ?" }), q: "Un triangle est rectangle en " + M("C") + ", d'hypoténuse " + M("c = " + c) + " cm. La projection de la cathète " + M("a") + " sur l'hypoténuse mesure " + M(p) + " cm. Calcule " + M("a") + " (exacte ou au centième).", spec: { kind: "value", value: a, round: 0.01, exactOk: true }, sol: "Théorème d'Euclide : " + M("a^2 = p \\cdot c = " + p * c) + ", " + M("a = \\sqrt{" + p * c + "} \\approx " + dec(a.toFixed(2))) + " cm." };
    }
    const tr = R.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]]), k = R.pick([1, 1, 2, 3]), [a, b, c] = tr.map((v) => v * k), h = (a * b) / c;
    return { fig: GF.altitude((a * a) / c, (b * b) / c, { lp: "", lq: "", lh: "h = ?", la: a + " cm", lb: b + " cm" }), q: "Un triangle rectangle a des cathètes de " + M(a) + " cm et " + M(b) + " cm. Calcule la hauteur relative à l'hypoténuse (en cm, valeur exacte ou au centième).", spec: { kind: "value", value: h, round: 0.01, exactOk: true }, sol: "Hypoténuse " + M(c) + " cm ; aire : " + M("\\frac{" + a + " \\cdot " + b + "}{2} = \\frac{" + c + " \\cdot h}{2}") + " donc " + M("h = " + ratT(h)) + " cm." };
  },

  droitesrem(d) {
    if (d === 1) {
      const m = 3 * R.int(2, 10);
      return { fig: FIG.triLines("medianes", { m: m + " cm" }), q: "Dans le triangle " + M("ABC") + ", la médiane " + M("[CM]") + " mesure " + M(m) + " cm. " + M("G") + " est le centre de gravité. Calcule " + M("CG") + " (en cm).", spec: { kind: "value", value: (2 * m) / 3 }, sol: "Le centre de gravité est aux " + M("\\frac{2}{3}") + " de chaque médiane depuis le sommet : " + M("CG = \\frac{2}{3} \\cdot " + m + " = " + (2 * m) / 3) + " cm." };
    }
    if (d === 2) {
      const A = 2 * R.int(15, 50);
      return { fig: FIG.triLines("bissectrices", { A: A + "°" }), q: "Dans le triangle " + M("ABC") + ", " + M("\\widehat{A} = " + A + "°") + ". " + M("I") + " est le point d'intersection des bissectrices. Que mesure " + M("\\widehat{BIC}") + " (en degrés) ?", spec: { kind: "value", value: 90 + A / 2 }, sol: M("\\widehat{B} + \\widehat{C} = " + (180 - A) + "°") + ", donc " + M("\\widehat{IBC} + \\widehat{ICB} = " + (180 - A) / 2 + "°") + " et " + M("\\widehat{BIC} = 180 - " + (180 - A) / 2 + " = " + (90 + A / 2) + "°") + "." };
    }
    const tr = R.pick([[6, 8], [5, 12], [9, 12], [8, 15], [3, 4]]), k = R.int(1, 2), [a, b] = tr.map((v) => v * k), c = Math.hypot(a, b);
    return { fig: FIG.rightTriangle([a + " cm", b + " cm", ""]), q: "Un triangle rectangle a des cathètes de " + M(a) + " cm et " + M(b) + " cm. Quel est le rayon de son cercle circonscrit (en cm) ?", spec: { kind: "value", value: c / 2 }, sol: "Le centre du cercle circonscrit (intersection des médiatrices) est le milieu de l'hypoténuse (cercle de Thalès) : " + M("r = \\frac{" + c + "}{2} = " + dec(c / 2)) + " cm." };
  },

  // ===== Collège 2e =====
  polydiv(d) {
    if (d === 1) {
      const cs = [R.nz(-3, 3), R.int(-5, 5), R.int(-5, 5), R.int(-9, 9)], a = R.nz(-3, 3);
      return { q: "Quel est le reste de la division de " + M("P(x) = " + poly(cs)) + " par " + M(xm(a)) + " ?", spec: { kind: "value", value: peval(cs, a) }, sol: "Théorème du reste : " + M("P(" + a + ") = " + peval(cs, a)) + "." };
    }
    if (d === 2) {
      const qc = [R.nz(-3, 3), R.int(-5, 5), R.int(-6, 6)], a = R.nz(-4, 4), P = pmul(qc, [1, -a]);
      return { q: "Sachant que " + M("P(x) = " + poly(P)) + " est divisible par " + M(xm(a)) + ", donne le quotient " + M("Q(x)") + ".", spec: { kind: "expr", expr: poly(qc), form: "expanded" }, canon: poly(qc), sol: (() => { const r = [P[0]]; for (let i = 1; i < P.length; i++) r.push(r[i - 1] * a + P[i]);
      return "Schéma de Horner avec " + M(a) + " : coefficients de " + M("P") + " : " + M(P.join(" \\;|\\; ")) + ". On abaisse " + M(P[0]) + ", puis à chaque colonne on multiplie par " + M(a) + " et on ajoute : " + M(r.join(" \\;|\\; ")) + ". Le dernier nombre est le reste (" + M(r[r.length - 1]) + "), les autres sont les coefficients du quotient : " + M("Q(x) = " + poly(qc)) + "."; })() };
    }
    const a = R.nz(-3, 3), b = R.int(-4, 4), c = R.int(-9, 9);
    // x³ + b x² + k x + c divisible par (x - a) ⇔ a³ + b a² + k a + c = 0
    const k = -(a ** 3 + b * a * a + c) / a;
    if (!Number.isInteger(k)) return GEN.polydiv(3);
    return { q: "Détermine " + M("k") + " pour que " + M("P(x) = x^3" + (b ? " " + sg(b).trim().replace(/ 1$/, " ") + "x^2" : "") + " + kx" + sg(c)) + " soit divisible par " + M(xm(a)) + ".", spec: { kind: "value", value: k }, sol: "Il faut " + M("P(" + a + ") = 0") + " : " + M(a ** 3 + b * a * a + c + " + " + par(a) + "k = 0 \\iff k = " + k) + "." };
  },

  polyfact(d) {
    if (d === 1) {
      const r = [R.nz(-4, 4), R.nz(-4, 4), R.nz(-5, 5)]; if (new Set(r).size < 3) return GEN.polyfact(1);
      const P = pmul(pmul([1, -r[0]], [1, -r[1]]), [1, -r[2]]);
      return { q: "Sachant que " + M(r[0]) + " est racine de " + M("P(x) = " + poly(P)) + ", résous " + M("P(x) = 0") + ".", spec: { kind: "set", values: r }, sol: "Division par " + M(xm(r[0])) + " (Horner), puis le trinôme restant : " + M("S = \\{" + [...r].sort((u, v) => u - v).join(" ; ") + "\\}") + "." };
    }
    if (d === 2) {
      const r = [R.nz(-3, 3), R.nz(-4, 4), R.nz(-5, 5)], a = R.pick([1, 2, -1]); if (new Set(r).size < 3) return GEN.polyfact(2);
      const P = pscale(pmul(pmul([1, -r[0]], [1, -r[1]]), [1, -r[2]]), a);
      return { q: "Résous " + M(poly(P) + " = 0") + ". (Cherche une racine évidente parmi les diviseurs du terme constant.)", spec: { kind: "set", values: r }, sol: "Racine évidente, Horner, puis trinôme : " + M("S = \\{" + [...r].sort((u, v) => u - v).join(" ; ") + "\\}") + "." };
    }
    if (R.rand() < 0.5) {
      const a = R.int(1, 3), b = R.int(a + 1, 5);
      return { q: "Résous " + M("x^4 - " + (a * a + b * b) + "x^2 + " + a * a * b * b + " = 0") + ".", spec: { kind: "set", values: [a, -a, b, -b] }, sol: "On pose " + M("t = x^2") + " : " + M("t^2 - " + (a * a + b * b) + "t + " + a * a * b * b + " = 0") + ", " + M("t = " + a * a) + " ou " + M(b * b) + " ; " + M("x = \\pm " + a) + " ou " + M("\\pm " + b) + "." };
    }
    const r1 = R.nz(-3, 3), r2 = R.nz(-3, 3), num = R.pick([1, -1, 3, -3]), den = 2;
    if (r1 === r2) return GEN.polyfact(3);
    const P = pmul(pmul([1, -r1], [1, -r2]), [den, -num]);
    return { q: "Résous " + M(poly(P) + " = 0") + ".", spec: { kind: "set", values: [r1, r2, num / den] }, sol: "Racines entières " + M(r1) + " et " + M(r2) + " (Horner), puis " + M("2x" + sg(-num) + " = 0") + " : " + M("x = " + ratT(num / den)) + "." };
  },

  fracrat(d) {
    if (d === 1) {
      const a = R.nz(-7, 7), k = R.nz(-6, 6);
      if (a === k) return GEN.fracrat(1);
      return { q: "Simplifie " + M("\\frac{" + poly(pmul([1, -a], [1, -k])) + "}{" + xm(a) + "}") + " (pour " + M("x \\ne " + a) + ").", spec: { kind: "expr", expr: xm(k), form: "nodiv" }, canon: xm(k), sol: M(poly(pmul([1, -a], [1, -k])) + " = (" + xm(a) + ")(" + xm(k) + ")") + " : il reste " + M(xm(k)) + "." };
    }
    if (d === 2) {
      const a = R.int(1, 6), u = R.nz(-4, 4), v = R.nz(-4, 4);
      // u/(x-a) + v/(x+a) = ((u+v)x + a(u - v)) / (x² - a²)
      if (u + v === 0 && u - v === 0) return GEN.fracrat(2);
      const ex = "(" + ((u + v) ? (u + v) + "x" : "") + sg(a * (u - v)) + ")/(x^2 - " + a * a + ")";
      return { q: "Écris comme une seule fraction : " + M("\\frac{" + u + "}{x - " + a + "} " + (v < 0 ? "-" : "+") + " \\frac{" + Math.abs(v) + "}{x + " + a + "}") + ".", spec: { kind: "expr", expr: ex, form: "onefrac" }, canon: ex.replace("(+", "(").replace("( - ", "(-"), sol: "Dénominateur commun " + M("(x - " + a + ")(x + " + a + ") = x^2 - " + a * a) + " : " + M("\\frac{" + lin(u + v, a * (u - v)) + "}{x^2 - " + a * a + "}") + "." };
    }
    const p = R.nz(-5, 5), q = R.nz(-5, 5), r = R.nz(-5, 5);
    if (new Set([p, q, r]).size < 3) return GEN.fracrat(3);
    const ex = "(" + xm(q) + ")/(" + xm(r) + ")";
    return { q: "Simplifie " + M("\\frac{" + poly(pmul([1, -p], [1, -q])) + "}{" + poly(pmul([1, -p], [1, -r])) + "}") + ".", spec: { kind: "expr", expr: ex, form: "onefrac", maxNodes: 9 }, canon: ex, sol: "On factorise : " + M("\\frac{(" + xm(p) + ")(" + xm(q) + ")}{(" + xm(p) + ")(" + xm(r) + ")} = \\frac{" + xm(q) + "}{" + xm(r) + "}") + " (pour " + M("x \\ne " + p) + " et " + M("x \\ne " + r) + ")." };
  },

  eqrat(d) {
    if (d === 1) {
      const r = R.nz(-6, 6), b = R.nz(-5, 5), x = R.nz(-6, 6); if (x === r) return GEN.eqrat(1);
      const a = b * (x - r);
      return { q: "Résous " + M("\\frac{" + a + "}{" + xm(r) + "} = " + b) + ".", spec: { kind: "set", values: [x] }, sol: "Domaine " + M("x \\ne " + r) + " ; " + M(a + " = " + b + "(" + xm(r) + ")") + " donc " + M("x = " + x) + "." };
    }
    if (d === 2) {
      const p = R.nz(-5, 5), q = R.nz(-5, 5), A = R.nz(-5, 5), B = R.nz(-5, 5);
      if (p === q || A === B) return GEN.eqrat(2);
      const x = (A * q - B * p) / (A - B), bad = x === p || x === q;
      return { q: "Résous " + M("\\frac{" + A + "}{" + xm(p) + "} = \\frac{" + B + "}{" + xm(q) + "}") + ". (Réponds « aucune » s'il n'y a pas de solution.)", spec: { kind: "set", values: bad ? [] : [x] }, sol: "Produit en croix : " + M(A + "(" + xm(q) + ") = " + B + "(" + xm(p) + ")") + " donne " + M("x = " + ratT(x)) + (bad ? ", valeur interdite : aucune solution." : ", admissible.") };
    }
    // x/(x-p) + a/(x-q) = c/((x-p)(x-q))  ⇔  x² + (a - q)x - a p - c = 0, racines r1, r2
    let p, q, r1, r2, a, c;
    do { p = R.nz(-4, 4); q = R.nz(-4, 4); r1 = R.rand() < 0.4 ? p : R.nz(-5, 5); r2 = R.nz(-5, 5); a = q - (r1 + r2); c = -a * p - r1 * r2; } while (p === q || r1 === r2 || a === 0 || r2 === p || r2 === q);
    const sols = [r1, r2].filter((v) => v !== p && v !== q);
    return { q: "Résous " + M("\\frac{x}{" + xm(p) + "} " + (a < 0 ? "-" : "+") + " \\frac{" + Math.abs(a) + "}{" + xm(q) + "} = \\frac{" + c + "}{(" + xm(p) + ")(" + xm(q) + ")}") + ".", spec: { kind: "set", values: sols }, sol: "Domaine " + M("\\mathbb{R} \\setminus \\{" + Math.min(p, q) + " ; " + Math.max(p, q) + "\\}") + ". On multiplie par le dénominateur commun : " + M(poly([1, a - q, -a * p - c]) + " = 0") + ", racines " + M(r1) + " et " + M(r2) + (r1 === p ? " ; " + M(r1) + " est interdite" : "") + " : " + M("S = \\{" + sols.join(" ; ") + "\\}") + "." };
  },

  ineq(d) {
    const op = R.pick(["<", "<=", ">", ">="]);
    if (d === 1) {
      const x0 = R.nz(-6, 6), a = R.nz(-6, 6), b = R.nz(-9, 9);
      if (Math.abs(a) === 1) return GEN.ineq(1);
      const f = (x) => a * (x - x0);
      return { q: "Résous : " + M(lin(a, b) + " " + OPT[op] + " " + (a * x0 + b)) + ".", spec: solsetSpec(signSet(f, [x0], [], op)), sol: M(a + "x " + OPT[op] + " " + a * x0) + (a < 0 ? " ; on divise par " + M(a) + " (négatif) : on retourne le signe" : "") + " ; " + M("S = " + SolSet.show(signSet(f, [x0], [], op))) + "." };
    }
    if (d === 2) {
      const p = R.nz(-6, 5), q = R.nz(-6, 6); if (p === q) return GEN.ineq(2);
      const f = (x) => (x - p) / (x - q);
      return { q: "Résous " + M("\\frac{" + xm(p) + "}{" + xm(q) + "} " + OPT[op] + " 0") + ".", spec: solsetSpec(signSet(f, [p], [q], op)), sol: "Tableau des signes (zéro " + M(p) + ", valeur interdite " + M(q) + ") : " + M("S = " + SolSet.show(signSet(f, [p], [q], op))) + "." };
    }
    let p, q, r, s; do { p = R.nz(-5, 5); q = R.nz(-5, 5); r = R.nz(-6, 6); s = R.nz(-6, 6); } while (new Set([p, q, r, s]).size < 4);
    const f = (x) => ((x - p) * (q - x)) / ((x - r) * (x - s));
    const den = poly(pmul([1, -r], [1, -s]));
    return { q: "Résous " + M("\\frac{(" + xm(p) + ")(" + q + " - x)}{" + den + "} " + OPT[op] + " 0") + ".", spec: solsetSpec(signSet(f, [p, q], [r, s], op)), sol: "Dénominateur " + M("(" + xm(r) + ")(" + xm(s) + ")") + " ; tableau des signes avec " + M(p) + ", " + M(q) + " (zéros) et " + M(r) + ", " + M(s) + " (interdites) : " + M("S = " + SolSet.show(signSet(f, [p, q], [r, s], op))) + "." };
  },

  homog(d) {
    let a, b, c, e; do { a = R.nz(-5, 5); b = R.int(-8, 8); c = R.nz(-3, 3); e = R.int(-8, 8); } while (a * e - b * c === 0);
    const f = (x) => (a * x + b) / (c * x + e), txt = "f(x) = \\frac{" + lin(a, b) + "}{" + lin(c, e) + "}";
    const fig = FIG.plot([{ f }], [], { grid: false, ticks: false, label: "hyperbole" });
    if (d === 1) return { fig, q: "Soit " + M(txt) + ". Quelle est l'équation de l'asymptote verticale ? Donne la valeur de " + M("x") + ".", spec: { kind: "value", value: -e / c }, sol: "Le dénominateur s'annule en " + M("x = " + ratT(-e / c)) + " (et pas le numérateur) : asymptote " + M("x = " + ratT(-e / c)) + "." };
    if (d === 2) return { fig, q: "Soit " + M(txt) + ". Quelle est l'équation de l'asymptote horizontale ? Donne la valeur de " + M("y") + ".", spec: { kind: "value", value: a / c }, sol: "Quand " + M("x") + " devient grand, " + M("f(x) \\approx \\frac{" + cx(a) + "x}{" + cx(c) + "x}") + " : asymptote " + M("y = " + ratT(a / c)) + "." };
    const inv = "(" + lin(-e, b) + ")/(" + lin(c, -a) + ")";
    return { fig, q: "Soit " + M(txt) + ". Détermine la réciproque " + M("f^{-1}(x)") + ".", spec: { kind: "expr", expr: inv }, canon: inv, sol: "On pose " + M("y = \\frac{" + lin(a, b) + "}{" + lin(c, e) + "}") + " et on isole " + M("x") + " : " + M("y(" + lin(c, e) + ") = " + lin(a, b)) + ", " + M((c === 1 ? "" : c === -1 ? "-" : c) + "xy" + sg(e) + "y = " + lin(a, b)) + ", donc " + M("x(" + lin(c, -a, "y") + ") = " + lin(-e, b, "y")) + " et " + M("x = \\frac{" + lin(-e, b, "y") + "}{" + lin(c, -a, "y") + "}") + ". On échange les lettres : " + M("f^{-1}(x) = \\frac{" + lin(-e, b) + "}{" + lin(c, -a) + "}") + "." };
  },

  trigfn(d) {
    const A = R.pick([1, 2, 3, 4, 0.5]), k = R.pick([1, 2, 3, 4]), m = R.int(-2, 2), fn = R.pick(["sin", "cos"]);
    const txt = "f(x) = " + (A === 1 ? "" : dec(A)) + "\\" + fn + "(" + (k === 1 ? "" : k) + "x)" + (m ? sg(m) : "");
    const fig = FIG.plot([{ f: (x) => A * Math[fn](k * x) + m }], [], { xr: [-1, 7], yr: [-6, 6], grid: false, ticks: false, label: "sinusoïde" });
    if (d === 1) return { fig, q: "Quelle est l'amplitude de " + M(txt) + " ?", spec: { kind: "value", value: A }, sol: "L'amplitude est le coefficient devant " + M("\\" + fn) + " : " + M(dec(A)) + "." };
    if (d === 2) return { fig, q: "Quelle est la période de " + M(txt) + " ? (avec π)", spec: { kind: "value", value: (2 * Math.PI) / k }, sol: M("T = \\frac{2\\pi}{k}" + " = " + ["", "2\\pi", "\\pi", "\\frac{2\\pi}{3}", "\\frac{\\pi}{2}"][k]) + " (ici " + M("k = " + k) + ")." };
    return { fig, q: "En quel plus petit " + M("x \\ge 0") + " la fonction " + M(txt) + " atteint-elle sa valeur maximale, et quelle est cette valeur ? Réponds « x ; max » (avec π).", spec: { kind: "pair", values: [fn === "cos" ? 0 : Math.PI / (2 * k), A + m] }, sol: "Le maximum vaut " + M(dec(A) + (m ? sg(m) : "") + " = " + dec(A + m)) + " ; il est atteint quand " + M("\\" + fn + "(" + (k === 1 ? "" : k) + "x) = 1") + ", soit " + M("x = " + (fn === "cos" ? "0" : "\\frac{\\pi}{" + 2 * k + "}")) + "." };
  },

  droites(d) {
    const m = R.nz(-3, 3), h = R.nz(-5, 5);
    if (d === 1) {
      const x1 = R.int(-3, 0), x2 = x1 + R.int(1, 3);
      return { fig: FIG.plot([], [[x1, m * x1 + h, "A"], [x2, m * x2 + h, "B"]], { numbers: true, yr: [-8, 8], squash: 0.7 }), q: "Donne l'équation de la droite passant par " + M("A(" + x1 + " ; " + (m * x1 + h) + ")") + " et " + M("B(" + x2 + " ; " + (m * x2 + h) + ")") + ". Écris « y = … ».", spec: { kind: "expr", expr: lin(m, h) }, canon: lin(m, h), sol: "Pente " + M("m = \\frac{" + (m * x2 + h) + " - " + par(m * x1 + h) + "}{" + x2 + " - " + par(x1) + "} = " + m) + " ; ordonnée à l'origine " + M(h) + " : " + M("y = " + lin(m, h)) + "." };
    }
    if (d === 2) {
      const x0 = R.nz(-4, 4), y0 = R.int(-5, 5), perp = R.rand() < 0.6, mm = perp ? -1 / m : m, hh = y0 - mm * x0;
      const ex = rat(mm) + "*x" + (hh < 0 ? " - " + rat(-hh) : " + " + rat(hh));
      return { q: "Donne l'équation de la droite " + (perp ? "perpendiculaire" : "parallèle") + " à " + M("y = " + lin(m, h)) + " passant par " + M("P(" + x0 + " ; " + y0 + ")") + ". Écris « y = … ».", spec: { kind: "expr", expr: ex }, canon: ex, sol: (perp ? "Pentes perpendiculaires : " + M("m \\cdot m' = -1") + " donc " + M("m' = " + ratT(mm)) : "Même pente " + M(m)) + " ; avec " + M("P") + " : " + M("h = " + ratT(hh)) + "." };
    }
    let a, b, c, e; do { a = R.nz(-4, 4); b = R.nz(-4, 4); c = R.nz(-4, 4); e = R.nz(-4, 4); } while (a * e - b * c === 0);
    const x = R.nz(-5, 5), y = R.nz(-5, 5);
    const T = (u, v, w) => (u === 1 ? "" : u === -1 ? "-" : u) + "x " + (v < 0 ? "- " + (v === -1 ? "" : -v) : "+ " + (v === 1 ? "" : v)) + "y = " + w;
    return { q: "Donne le point d'intersection des droites " + M(T(a, b, a * x + b * y)) + " et " + M(T(c, e, c * x + e * y)) + ". Réponds « x ; y ».", spec: { kind: "pair", values: [x, y] }, sol: "On résout le système : " + M("I(" + x + " ; " + y + ")") + "." };
  },

  cercle(d) {
    const a = R.int(-5, 5), b = R.int(-5, 5), r = R.int(1, 7);
    const sq = (v, n) => (v === 0 ? n + "^2" : "(" + n + sg(-v) + ")^2");
    if (d === 1) return { fig: GEO().circle([0, 0], 1, "f-shape").pt("C", 0, 0, false).dot("C").text("C", "C(a ; b)", 0, 18).side("C", [0.8, 0.6], "r", { draw: true, cls: "f-accent", w: 2 }).svg("cercle de centre C et de rayon r"), q: "Le cercle " + M(sq(a, "x") + " + " + sq(b, "y") + " = " + r * r) + " a pour centre " + M("C(a ; b)") + " et pour rayon " + M("r") + ". Réponds « a ; b ; r ».", spec: { kind: "pair", values: [a, b, r] }, sol: "Forme " + M("(x - a)^2 + (y - b)^2 = r^2") + " : " + M("C(" + a + " ; " + b + ")") + ", " + M("r = " + r) + "." };
    if (d === 2) {
      const D = -2 * a, E = -2 * b, F = a * a + b * b - r * r;
      const T = "x^2 + y^2" + (D ? sg(D) + "x" : "") + (E ? sg(E) + "y" : "") + (F ? sg(F) : "") + " = 0";
      return { q: "Détermine le rayon du cercle " + M(T) + ".", spec: { kind: "value", value: r }, sol: "On complète les carrés : " + M(sq(a, "x") + " + " + sq(b, "y") + " = " + r * r) + ", donc " + M("r = " + r) + "." };
    }
    const pts = [[3, 4], [4, 3], [5, 0], [0, 5], [-3, 4], [-4, 3], [-5, 0], [0, -5], [3, -4], [4, -3], [-3, -4], [-4, -3]];
    let P, Q; do { P = R.pick(pts); Q = R.pick(pts); } while (P[0] === Q[0]);
    const A = Q[1] - P[1], B = -(Q[0] - P[0]), C = A * P[0] + B * P[1], g = gcd(gcd(Math.abs(A), Math.abs(B)), Math.abs(C)) || 1;
    const a2 = A / g, b2 = B / g, c2 = C / g;
    return { q: "Détermine les abscisses des points d'intersection du cercle " + M("x^2 + y^2 = 25") + " et de la droite " + M((a2 === 1 ? "" : a2 === -1 ? "-" : a2) + "x " + (b2 < 0 ? "- " + (b2 === -1 ? "" : -b2) : "+ " + (b2 === 1 ? "" : b2)) + "y = " + c2) + ".", spec: { kind: "set", values: [P[0], Q[0]] }, sol: "On isole une inconnue dans l'équation de la droite et on substitue : équation du 2e degré, " + M("x = " + P[0]) + " ou " + M("x = " + Q[0]) + " (points " + M("(" + P.join(" ; ") + ")") + " et " + M("(" + Q.join(" ; ") + ")") + ")." };
  },
});

// ---------- Indices des nouvelles notions ----------
const HINTS_EXTRA = {
  decim: "Aligne les virgules ; pour arrondir, regarde le chiffre juste après celui que tu gardes.",
  unites: "Longueurs : ×10 par rang ; aires : ×100 ; volumes : ×1000. Et 1 dm³ = 1 L.",
  angtri: "Somme des angles : 180° dans un triangle, 360° dans un quadrilatère.",
  arith: "Décompose en facteurs premiers. PGDC : facteurs communs ; PPMC : tous les facteurs, au plus grand exposant.",
  diagr: "Moyenne = somme des valeurs (chacune comptée autant de fois que son effectif) divisée par l'effectif total.",
  disque: "Périmètre : 2πr. Aire : πr². Pour un secteur, multiplie par angle/360.",
  vol: "Prisme et cylindre : aire de la base × hauteur.",
  polyreg: "Angle au centre : 360°/n. Angle intérieur : 180° − angle au centre.",
  volcone: "Pyramide et cône : un tiers de l'aire de la base × hauteur. Boule : 4/3 · πr³.",
  gquot: "Écris la formule (v = d/t, ρ = m/V, débit = V/t) et vérifie les unités avant de calculer.",
  formule: "Fais comme pour une équation : la lettre cherchée est l'inconnue, les autres sont des nombres.",
  simil: "Rapport k pour les longueurs, k² pour les aires, k³ pour les volumes.",
  proba: "Probabilité = cas favorables / cas possibles. Sans remise, le total diminue au deuxième tirage.",
  probeq: "Choisis l'inconnue, traduis l'énoncé en équation, résous, puis vérifie dans l'énoncé.",
  polyop: "Développe chaque produit séparément, attention au signe − devant une parenthèse, puis réduis.",
  factor2: "D'abord la mise en évidence, puis une identité remarquable ou le trinôme, jusqu'à ne plus pouvoir.",
  sys3: "Élimine la même inconnue dans deux paires d'équations : il reste un système 2 × 2.",
  domaine: "Deux interdits : diviser par 0 et prendre la racine d'un nombre négatif.",
  f2expr: "Zéros connus : f(x) = a(x − x₁)(x − x₂). Sommet connu : f(x) = a(x − h)² + k. Un point de plus donne a.",
  racinv: "Élève au carré (ou multiplie par x), résous, puis vérifie chaque solution dans l'équation de départ.",
  ineq2: "Ramène tout d'un côté, cherche les zéros, puis le signe : celui de a à l'extérieur des racines.",
  droitesrem: "Médianes → centre de gravité (aux 2/3). Bissectrices → centre du cercle inscrit. Médiatrices → cercle circonscrit.",
  polydiv: "Le reste de la division de P(x) par (x − a) vaut P(a). Horner donne le quotient.",
  polyfact: "Cherche une racine parmi les diviseurs du terme constant, divise, puis recommence.",
  fracrat: "Factorise numérateur et dénominateur avant de simplifier ; pour additionner, dénominateur commun.",
  eqrat: "Note d'abord les valeurs interdites, multiplie par le dénominateur commun, puis écarte les solutions interdites.",
  ineq: "Tableau des signes : une ligne par facteur. Les zéros du dénominateur sont toujours exclus.",
  homog: "Asymptote verticale : le dénominateur s'annule. Horizontale : rapport des coefficients de x.",
  trigfn: "f(x) = A·sin(kx) + m : amplitude |A|, période 2π/k, valeurs entre m − |A| et m + |A|.",
  droites: "Pente m = Δy/Δx. Parallèles : même pente. Perpendiculaires : m · m' = −1.",
  cercle: "(x − a)² + (y − b)² = r² : centre (a ; b), rayon r. Sinon, complète les carrés.",
};

// ---------- Mini-leçons des nouvelles notions ----------
const LESSONS_EXTRA = {
  decim: ["Les nombres décimaux", "Chaque chiffre a un rang : dixièmes, centièmes, millièmes.", "Pour arrondir, on regarde le chiffre suivant : de 0 à 4 on garde, de 5 à 9 on augmente de 1. Pour multiplier, on calcule sans virgule puis on replace autant de décimales qu'au total.", ["\\(3{,}476 \\approx 3{,}48\\) au centième", "\\(2{,}3 \\cdot 1{,}4 = 3{,}22\\) (\\(23 \\cdot 14 = 322\\), deux décimales)"], "\\(0{,}5 \\cdot 0{,}5 = 0{,}25\\) : multiplier par un nombre plus petit que 1 diminue."],
  unites: ["Les unités de mesure", "Changer d'unité, c'est multiplier ou diviser par une puissance de 10.", "Longueurs : ×10 par rang. Aires : ×100 par rang. Volumes : ×1000 par rang. Capacités : \\(1\\ \\text{dm}^3 = 1\\ \\text{L}\\).", ["\\(2{,}5\\ \\text{km} = 2500\\ \\text{m}\\)", "\\(3\\ \\text{m}^2 = 30\\,000\\ \\text{cm}^2\\)", "\\(1{,}2\\ \\text{m}^3 = 1200\\ \\text{L}\\)"], "\\(1\\ \\text{m}^2\\) ne vaut pas \\(100\\ \\text{cm}^2\\) mais \\(10\\,000\\ \\text{cm}^2\\)."],
  angtri: ["Angles des figures", "Dans une figure, les angles ne sont pas libres.", "Triangle : somme \\(180°\\). Quadrilatère : somme \\(360°\\). Triangle isocèle : deux angles à la base égaux.", ["Angles \\(50°\\) et \\(60°\\) : le troisième vaut \\(70°\\)", "Isocèle, sommet \\(40°\\) : bases \\(\\frac{180 - 40}{2} = 70°\\)"], "Dans un triangle isocèle, repère d'abord le sommet principal."],
  arith: ["Diviseurs, PGDC, PPMC", "Tout entier se décompose en facteurs premiers.", "PGDC : produit des facteurs communs. PPMC : produit de tous les facteurs, au plus grand exposant. \\(\\text{PGDC} \\cdot \\text{PPMC} = a \\cdot b\\).", ["\\(24 = 2^3 \\cdot 3\\), \\(36 = 2^2 \\cdot 3^2\\) : PGDC \\(= 12\\), PPMC \\(= 72\\)"], "« Se retrouver en même temps » → PPMC ; « partager en parts égales » → PGDC."],
  diagr: ["Diagrammes et moyennes", "Un diagramme résume des données.", "Moyenne : somme des valeurs divisée par l'effectif. Diagramme circulaire : angle \\(= \\frac{\\text{effectif}}{\\text{total}} \\cdot 360°\\).", ["Notes 4, 5, 6 : moyenne \\(\\frac{15}{3} = 5\\)", "6 élèves sur 24 : secteur de \\(90°\\)"], "Dans une moyenne pondérée, chaque valeur compte autant de fois que son effectif."],
  disque: ["Cercle et disque", "\\(\\pi \\approx 3{,}14\\) relie le rayon au périmètre et à l'aire.", "Périmètre : \\(2\\pi r\\). Aire : \\(\\pi r^2\\). Arc ou secteur d'angle \\(\\alpha\\) : multiplier par \\(\\frac{\\alpha}{360}\\).", ["\\(r = 3\\) : \\(P = 6\\pi\\), \\(A = 9\\pi\\)", "Secteur de \\(90°\\), \\(r = 4\\) : \\(A = 4\\pi\\)"], "Si on donne le diamètre, divise par 2 avant d'utiliser \\(r\\)."],
  vol: ["Volumes : pavé, prisme, cylindre", "Ces solides ont deux bases identiques.", "\\(V = \\text{aire de la base} \\cdot \\text{hauteur}\\). Pavé : \\(a \\cdot b \\cdot c\\). Cylindre : \\(\\pi r^2 h\\).", ["Pavé \\(2 \\times 3 \\times 4\\) : \\(24\\ \\text{cm}^3\\)", "Cylindre \\(r = 2\\), \\(h = 5\\) : \\(20\\pi\\ \\text{cm}^3\\)"], "La hauteur du prisme est la distance entre les deux bases, pas la hauteur du triangle de base."],
  polyreg: ["Polygones réguliers", "Tous les côtés et tous les angles sont égaux.", "Angle au centre : \\(\\frac{360°}{n}\\). Angle intérieur : \\(180° - \\frac{360°}{n}\\).", ["Hexagone : centre \\(60°\\), intérieur \\(120°\\)", "Octogone : centre \\(45°\\), intérieur \\(135°\\)"], "La somme des angles intérieurs vaut \\((n - 2) \\cdot 180°\\)."],
  volcone: ["Volumes : pyramide, cône, boule", "Un solide « pointu » occupe le tiers du solide droit de même base.", "Pyramide, cône : \\(V = \\frac{1}{3} A_{\\text{base}} \\cdot h\\). Boule : \\(V = \\frac{4}{3}\\pi r^3\\).", ["Cône \\(r = 3\\), \\(h = 4\\) : \\(12\\pi\\)", "Boule \\(r = 3\\) : \\(36\\pi\\)"], "La hauteur du cône n'est pas la génératrice : utilise Pythagore si on donne la génératrice."],
  gquot: ["Grandeurs quotients", "Une vitesse, une masse volumique, un débit sont des quotients.", "\\(v = \\frac{d}{t}\\), \\(\\rho = \\frac{m}{V}\\), débit \\(= \\frac{V}{t}\\). Pour passer de km/h à m/s, on divise par \\(3{,}6\\).", ["\\(72\\ \\text{km/h} = 20\\ \\text{m/s}\\)", "\\(m = \\rho \\cdot V = 2{,}7 \\cdot 10 = 27\\ \\text{g}\\)"], "Convertis d'abord dans des unités cohérentes (L et min, cm³ et g…)."],
  formule: ["Transformer une formule", "Isoler une lettre, c'est résoudre une équation dont elle est l'inconnue.", "On fait la même opération des deux côtés, en défaisant ce qui entoure la lettre cherchée, de l'extérieur vers l'intérieur.", ["\\(v = \\frac{d}{t} \\Rightarrow d = v \\cdot t\\)", "\\(A = \\frac{b \\cdot h}{2} \\Rightarrow h = \\frac{2A}{b}\\)"], "\\(P = 2(x + y)\\) : divise par 2 avant de soustraire."],
  simil: ["Agrandir, réduire", "Deux figures semblables ont la même forme.", "Si les longueurs sont multipliées par \\(k\\), les aires le sont par \\(k^2\\) et les volumes par \\(k^3\\).", ["\\(k = 3\\) : aire \\(\\times 9\\), volume \\(\\times 27\\)"], "Doubler les longueurs ne double pas l'aire : elle est multipliée par 4."],
  proba: ["Probabilités", "Une probabilité est un nombre entre 0 et 1.", "Si toutes les issues ont la même chance : \\(P = \\frac{\\text{cas favorables}}{\\text{cas possibles}}\\). Tirages successifs : on multiplie le long des branches de l'arbre.", ["Dé : \\(P(\\text{pair}) = \\frac{3}{6} = \\frac{1}{2}\\)", "Deux dés, somme 7 : \\(\\frac{6}{36} = \\frac{1}{6}\\)"], "Sans remise, il reste une boule de moins au deuxième tirage."],
  probeq: ["Mettre en équation", "L'algèbre traduit un énoncé.", "1. Choisir l'inconnue. 2. Écrire l'équation. 3. Résoudre. 4. Vérifier et répondre par une phrase.", ["Trois entiers consécutifs de somme 48 : \\(3n + 3 = 48\\), \\(n = 15\\)"], "Une solution de l'équation peut ne pas convenir à l'énoncé (âge négatif, nombre non entier)."],
  polyop: ["Développer et réduire", "On transforme un produit en somme.", "Chaque terme de la première parenthèse multiplie chaque terme de la seconde. Identités : \\((a \\pm b)^2 = a^2 \\pm 2ab + b^2\\), \\((a + b)(a - b) = a^2 - b^2\\), \\((a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3\\).", ["\\((2x - 1)^2 - (x + 3)(x - 3) = 3x^2 - 4x + 10\\)"], "Un signe \\(-\\) devant une parenthèse change tous les signes à l'intérieur."],
  factor2: ["Factoriser au maximum", "On transforme une somme en produit.", "Dans l'ordre : mise en évidence, identités remarquables, trinôme (somme et produit), groupements.", ["\\(3x^2 - 12 = 3(x - 2)(x + 2)\\)", "\\(x^3 + 2x^2 - 9x - 18 = (x + 2)(x - 3)(x + 3)\\)"], "Vérifie que chaque facteur ne peut plus être factorisé."],
  sys3: ["Systèmes à trois inconnues", "Trois équations pour trois inconnues.", "Méthode de Gauss : on élimine \\(x\\) dans deux équations, puis \\(y\\) : le système devient triangulaire et on remonte.", ["\\(z = 2\\), puis \\(y + z = 5 \\Rightarrow y = 3\\), puis \\(x + y + z = 6 \\Rightarrow x = 1\\)"], "Vérifie le triplet dans les trois équations."],
  domaine: ["Domaine de définition", "L'ensemble des \\(x\\) pour lesquels \\(f(x)\\) existe.", "Dénominateur \\(\\ne 0\\) ; expression sous une racine carrée \\(\\ge 0\\).", ["\\(\\frac{1}{x - 2}\\) : \\(D = \\mathbb{R} \\setminus \\{2\\}\\)", "\\(\\sqrt{x - 2}\\) : \\(D = [2 ; +\\infty[\\)"], "\\(\\frac{\\sqrt{x - 1}}{x - 3}\\) : les deux conditions à la fois."],
  f2expr: ["Retrouver l'expression d'une parabole", "Trois informations déterminent une parabole.", "Zéros \\(x_1, x_2\\) : \\(f(x) = a(x - x_1)(x - x_2)\\). Sommet \\((h ; k)\\) : \\(f(x) = a(x - h)^2 + k\\). Un point supplémentaire donne \\(a\\).", ["Zéros \\(-1\\) et \\(3\\), \\(f(0) = -6\\) : \\(a = 2\\)"], "N'oublie pas \\(a\\) : connaître les zéros ne suffit pas."],
  racinv: ["Racine carrée et inverse", "Deux fonctions de référence.", "\\(\\sqrt{x}\\) est définie pour \\(x \\ge 0\\) ; \\(\\frac{1}{x}\\) pour \\(x \\ne 0\\). Pour une intersection avec une droite, on obtient une équation du 2e degré.", ["\\(\\sqrt{x} = x - 2 \\Rightarrow x = (x - 2)^2\\) : \\(x = 4\\) (et \\(x = 1\\), à rejeter)"], "Élever au carré peut créer des solutions parasites : vérifie toujours."],
  ineq2: ["Inéquations du 2e degré", "On cherche où une parabole est au-dessus ou au-dessous de l'axe.", "Ramener à \\(ax^2 + bx + c \\lessgtr 0\\), chercher les zéros : le trinôme a le signe de \\(a\\) à l'extérieur des racines.", ["\\((x - 1)(x - 4) \\le 0\\) : \\(S = [1 ; 4]\\)", "\\(x^2 - 5x + 4 > 0\\) : \\(S = ]-\\infty ; 1[ \\cup ]4 ; +\\infty[\\)"], "Sans zéro (\\(\\Delta < 0\\)), le signe est constant : \\(S = \\mathbb{R}\\) ou \\(\\varnothing\\)."],
  droitesrem: ["Droites remarquables", "Quatre familles de droites dans un triangle.", "Médianes → centre de gravité \\(G\\) (aux \\(\\frac{2}{3}\\) depuis le sommet). Médiatrices → centre du cercle circonscrit. Bissectrices → centre du cercle inscrit. Hauteurs → orthocentre.", ["Médiane de 9 cm : \\(CG = 6\\) cm", "Triangle rectangle : cercle circonscrit centré au milieu de l'hypoténuse"], "Médiane (vers le milieu) et médiatrice (perpendiculaire au milieu) ne sont pas la même droite."],
  polydiv: ["Division de polynômes", "Comme pour les entiers : \\(P = Q \\cdot D + R\\).", "Le reste de la division de \\(P(x)\\) par \\((x - a)\\) vaut \\(P(a)\\). Si \\(P(a) = 0\\), \\(P\\) est divisible par \\((x - a)\\). Le schéma de Horner donne le quotient.", ["\\(P(x) = x^2 - 3x + 5\\), par \\((x - 2)\\) : reste \\(P(2) = 3\\)"], "Diviser par \\((x + 1)\\), c'est calculer \\(P(-1)\\)."],
  polyfact: ["Racine évidente", "Une racine entière divise le terme constant.", "Tester \\(\\pm 1, \\pm 2, \\dots\\) parmi les diviseurs du terme constant, diviser par \\((x - a)\\), recommencer avec le quotient.", ["\\(x^3 - 7x + 6\\) : \\(P(1) = 0\\), puis \\(x^2 + x - 6 = (x - 2)(x + 3)\\)"], "Équation bicarrée : pose \\(t = x^2\\)."],
  fracrat: ["Fractions rationnelles", "Des fractions dont les termes sont des polynômes.", "Simplifier : factoriser puis supprimer les facteurs communs. Additionner : dénominateur commun.", ["\\(\\frac{x^2 - 9}{x + 3} = x - 3\\)", "\\(\\frac{1}{x - 2} + \\frac{1}{x + 2} = \\frac{2x}{x^2 - 4}\\)"], "On simplifie des facteurs, jamais des termes : \\(\\frac{x + 3}{x} \\ne 3\\)."],
  eqrat: ["Équations rationnelles", "L'inconnue est au dénominateur.", "1. Valeurs interdites. 2. Multiplier par le dénominateur commun. 3. Résoudre. 4. Écarter les solutions interdites.", ["\\(\\frac{6}{x - 1} = 2 \\Rightarrow x = 4\\)"], "Une solution égale à une valeur interdite doit être rejetée."],
  ineq: ["Tableau des signes", "Le signe d'un produit ou d'un quotient se lit facteur par facteur.", "Une ligne par facteur, les zéros dans l'ordre, puis la règle des signes. Les zéros du dénominateur sont exclus.", ["\\(\\frac{x - 1}{x + 2} \\le 0\\) : \\(S = ]-2 ; 1]\\)"], "Ne multiplie jamais une inéquation par une expression dont tu ne connais pas le signe."],
  homog: ["Fonctions homographiques", "\\(f(x) = \\frac{ax + b}{cx + d}\\) : son graphe est une hyperbole.", "Asymptote verticale : \\(x = -\\frac{d}{c}\\). Asymptote horizontale : \\(y = \\frac{a}{c}\\). Zéro : \\(x = -\\frac{b}{a}\\).", ["\\(f(x) = \\frac{2x + 1}{x - 3}\\) : AV \\(x = 3\\), AH \\(y = 2\\)"], "La réciproque d'une fonction homographique est encore homographique."],
  trigfn: ["Fonctions trigonométriques", "\\(f(x) = A \\sin(kx) + m\\) est une sinusoïde.", "Amplitude \\(|A|\\), période \\(\\frac{2\\pi}{k}\\), valeurs entre \\(m - |A|\\) et \\(m + |A|\\).", ["\\(3\\sin(2x)\\) : amplitude 3, période \\(\\pi\\)"], "Plus \\(k\\) est grand, plus la période est courte."],
  droites: ["Équations de droites", "\\(y = mx + h\\) : pente \\(m\\), ordonnée à l'origine \\(h\\).", "\\(m = \\frac{y_B - y_A}{x_B - x_A}\\). Parallèles : même pente. Perpendiculaires : \\(m \\cdot m' = -1\\).", ["Par \\(A(0 ; 1)\\) et \\(B(2 ; 5)\\) : \\(y = 2x + 1\\)", "Perpendiculaire à \\(y = 2x\\) : pente \\(-\\frac{1}{2}\\)"], "Une droite verticale n'a pas de pente : son équation est \\(x = c\\)."],
  cercle: ["Équations de cercles", "Les points à distance \\(r\\) du centre.", "\\((x - a)^2 + (y - b)^2 = r^2\\) : centre \\((a ; b)\\), rayon \\(r\\). Forme développée : compléter les carrés.", ["\\((x - 1)^2 + (y + 2)^2 = 9\\) : centre \\((1 ; -2)\\), rayon 3"], "Le second membre est \\(r^2\\), pas \\(r\\)."],
};
