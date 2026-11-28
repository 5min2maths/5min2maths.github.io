















(function () {
if (typeof NOTIONS === "undefined" || typeof GEN === "undefined" || typeof TRX === "undefined") return;
const { pk, nz, r6, QN, QP, GR, GP, TR, TP, P, reg, W, toi, sv, tx, ln, pg } = TRX;
const fT = (v) => nb(r6(v));
const shuf = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(R.rand() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const CO10 = [10, 11, 12, 13, 14, 15];
const nT = (v) => M(fT(v));
const dS = (v) => String(r6(v)).replace(".", ",");


const QC = (q, opts, sol, o) => {
const good = o.good || 0, ord = o.fixed ? opts.map((_, i) => i) : shuf(opts.map((_, i) => i)), k = ord.indexOf(good) + 1;
const list = ord.map((i, j) => "<br><b>" + (j + 1) + "</b> — " + opts[i][0]).join("");
const traps = ord.map((i, j) => (i !== good ? TR(j + 1, opts[i][1]) : null)).filter(Boolean);
const guide = (o.guide || []).concat([GR("Numéro de la bonne proposition ?", k, "La proposition " + k + " : " + opts[good][0] + ".")]);
const x = QN(q + list + "<br>Tape le numéro de la bonne proposition.", k, sol + " C'est la proposition " + k + ".", Object.assign({}, o, { guide, traps }));
x.choix = opts.length; x.shownOk = true; if (o.co) x.co = o.co;
return x;
};
const tag = (q, co) => { if (q && co) q.co = co; return q; };




const SH = [
{ pts: [[0, 0], [1, 0], [1, 2], [2, 2], [2, 3], [0, 3]], at: [0.5, 0.6] },
{ pts: [[0, 0], [1, 0], [1, 1], [2, 1], [2, 3], [0, 3]], at: [0.5, 0.6] },
{ pts: [[0, 0], [3, 0], [0, 2]], at: [0.75, 0.6] },
{ pts: [[0, 0], [3, 0], [3, 1], [1, 1], [1, 2], [0, 2]], at: [0.5, 0.6] },
];
const TF = {
T: (dx, dy) => ([x, y]) => [x + dx, y + dy],
V: (c) => ([x, y]) => [2 * c - x, y],
H: (c) => ([x, y]) => [x, 2 * c - y],
C: (cx, cy) => ([x, y]) => [2 * cx - x, 2 * cy - y],
Q: (cx, cy, s) => ([x, y]) => (s > 0 ? [cx - (y - cy), cy + (x - cx)] : [cx + (y - cy), cy - (x - cx)]),
};
const bbox = (pts) => [Math.min(...pts.map((p) => p[0])), Math.max(...pts.map((p) => p[0])), Math.min(...pts.map((p) => p[1])), Math.max(...pts.map((p) => p[1]))];
const apart = (a, b) => { const A = bbox(a), B = bbox(b); return A[1] < B[0] || B[1] < A[0] || A[3] < B[2] || B[3] < A[2]; };

const gfig = (shapes, lab) => {
const all = shapes.flatMap((s) => s.pts), [a, b, c, d] = bbox(all), x0 = a - 1, x1 = b + 1, y0 = c - 1, y1 = d + 1;
if (x1 - x0 > 16 || y1 - y0 > 11) return null;
const u = Math.min(24, 296 / (x1 - x0), 230 / (y1 - y0)), Wd = Math.round((x1 - x0) * u + 4), Hd = Math.round((y1 - y0) * u + 4);
const X = (x) => 2 + (x - x0) * u, Y = (y) => 2 + (y1 - y) * u;
let g = "";
for (let x = x0; x <= x1; x++) g += ln(X(x), Y(y0), X(x), Y(y1), "f-grid");
for (let y = y0; y <= y1; y++) g += ln(X(x0), Y(y), X(x1), Y(y), "f-grid");
for (const s of shapes) { g += pg(s.pts.map(([x, y]) => [X(x), Y(y)]), s.cls || "f-shape", ' stroke-width="2"'); if (s.lab) g += tx(X(s.at[0]), Y(s.at[1]) + 5, s.lab, "middle", 14); }
return sv(Wd, Hd, g, lab || "figures sur un quadrillage");
};
const NOM = { T: "une translation", A: "une symétrie axiale", C: "une symétrie centrale", Q: "une rotation d'un quart de tour" };

const WHY = (ch, re) => ({
T: { A: "F' est retournée, comme dans un miroir : une translation ne retourne jamais une figure.", C: "F' a fait un demi-tour : une translation fait seulement glisser la figure, sans la tourner.", Q: "F' a tourné d'un quart de tour : une translation ne fait pas tourner la figure." },
A: { T: "Une symétrie axiale retourne la figure, comme un miroir ; ici F' n'est pas retournée : elle a seulement glissé.", C: "Une symétrie axiale retourne la figure ; ici F' n'est pas retournée : elle a fait un demi-tour.", Q: "Une symétrie axiale retourne la figure ; ici F' n'est pas retournée : elle a tourné d'un quart de tour." },
C: { T: "Une symétrie centrale fait faire un demi-tour à la figure ; ici F' a gardé la même orientation que F : elle a seulement glissé.", A: "F' est retournée comme dans un miroir ; une symétrie centrale (un demi-tour) ne retourne pas la figure.", Q: "F' n'a tourné que d'un quart de tour ; une symétrie centrale, c'est un demi-tour (180°)." },
Q: { T: "F' n'a pas tourné : elle a seulement glissé.", A: "F' est retournée comme dans un miroir ; une rotation ne retourne pas la figure.", C: "F' a fait un demi-tour (180°), pas un quart de tour : c'est une symétrie centrale." },
})[ch][re];

const isoImg = (t, F) => {
const [, x1, y0, y1] = bbox(F);
if (t === "T") { const dx = pk([1, -1]) * R.int(4, 7), dy = R.int(-3, 3); return TF.T(dx, dy); }
if (t === "A") return R.rand() < 0.6 ? TF.V(x1 + R.int(1, 2)) : TF.H(y1 + R.int(1, 2));
if (t === "C") return TF.C(x1 + 1, R.int(y0, y1));
return TF.Q(x1 + 1, y1 + R.int(0, 1), pk([1, -1]));
};
const nomIso = (types, co) => () => {
const S = pk(SH), t = pk(types), f = isoImg(t, S.pts), F2 = S.pts.map(f);
if (!apart(S.pts, F2)) return null;
const fig = gfig([{ pts: S.pts, at: S.at, lab: "F" }, { pts: F2, at: f(S.at), lab: "F'", cls: "f-shape2" }], "figure F et son image F'");
if (!fig) return null;
const opts = [t].concat(types.filter((u) => u !== t)).map((u) => [NOM[u], u === t ? "" : WHY(u, t)]);
const ret = t === "A" ? 1 : 0;
return QC("La figure F' est l'image de la figure F par une isométrie. Laquelle ?", opts,
t === "A" ? "F' est retournée, comme dans un miroir : c'est une symétrie axiale." : t === "T" ? "F' a la même orientation que F : elle a seulement glissé, c'est une translation." : t === "C" ? "F' n'est pas retournée, mais elle a fait un demi-tour : c'est une symétrie centrale." : "F' n'est pas retournée et elle a tourné d'un quart de tour : c'est une rotation.",
{ ctx: types.length > 3 ? "nom4" : "nom3", fig, co,
guide: [GR("F' est-elle retournée par rapport à F, comme dans un miroir ? Tape 1 pour oui, 0 pour non.", ret, ret ? "Oui : seule la symétrie axiale retourne une figure." : "Non : ce n'est pas une symétrie axiale.")] });
};

const laquelle = () => {
const S = pk(SH), F = S.pts, [x0, x1, y0, y1] = bbox(F);
const fs = { T: TF.T(R.int(-2, 2), y1 - y0 + R.int(1, 2)), A: TF.V(x0 - 1), C: TF.C(x1 + 1, R.int(y0, y1)) };
const ks = shuf(["T", "A", "C"]), imgs = ks.map((k) => F.map(fs[k]));
for (let i = 0; i < 3; i++) { if (!apart(F, imgs[i])) return null; for (let j = i + 1; j < 3; j++) if (!apart(imgs[i], imgs[j])) return null; }
const fig = gfig([{ pts: F, at: S.at, lab: "F" }].concat(imgs.map((p, i) => ({ pts: p, at: fs[ks[i]](S.at), lab: String(i + 1), cls: "f-shape2" }))), "figure F et trois images numérotées");
if (!fig) return null;
const t = pk(["T", "A", "C"]), k = ks.indexOf(t) + 1;
const traps = ks.map((u, i) => (u !== t ? TR(i + 1, "La figure " + (i + 1) + " est l'image de F par " + NOM[u] + ". " + WHY(t, u).replace(/^F'/, "Elle").replace(/F'/g, "elle")) : null)).filter(Boolean);
const x = QN("Les figures 1, 2 et 3 sont les images de F par une translation, une symétrie axiale et une symétrie centrale. Quelle figure est l'image de F par " + NOM[t] + " ? Tape son numéro.", k,
"La figure " + k + " : " + (t === "A" ? "elle est retournée, comme dans un miroir." : t === "T" ? "elle a la même orientation que F, elle a seulement glissé." : "elle n'est pas retournée, mais elle a fait un demi-tour.") ,
{ ctx: "laquelle", fig, traps, guide: [GR("Combien de figures sont retournées par rapport à F, comme dans un miroir ?", 1, "Une seule : l'image par la symétrie axiale."), GR("Numéro de la figure cherchée ?", k, "La figure " + k + ".")] });
x.choix = 3; x.shownOk = true; return x;
};
const XY = (p) => M("(" + p.map(fT).join(" \\,;\\, ") + ")"), XYn = (n, p) => M(n + "(" + p.map(fT).join(" \\,;\\, ") + ")");
const box = (ps, m = 1) => ({ xr: [Math.min(-1, ...ps.map((p) => p[0])) - m, Math.max(1, ...ps.map((p) => p[0])) + m], yr: [Math.min(-1, ...ps.map((p) => p[1])) - m, Math.max(1, ...ps.map((p) => p[1])) + m] });
const plotPts = (pts, o = {}) => { const b = box(pts.map((p) => p.slice(0, 2))); return FIG.plot([], pts, Object.assign({ numbers: true, xr: b.xr, yr: b.yr, step: b.xr[1] - b.xr[0] > 12 || b.yr[1] - b.yr[0] > 12 ? 2 : 1, maxH: 300 }, o)); };
const un = (n) => Math.abs(n) + (Math.abs(n) > 1 ? " unités" : " unité");
const deplace = (dx, dy) => [dx ? un(dx) + (dx > 0 ? " vers la droite" : " vers la gauche") : "", dy ? un(dy) + (dy > 0 ? " vers le haut" : " vers le bas") : ""].filter(Boolean).join(" et ");
const IS = {
1: [
nomIso(["T", "A", "C"]),
() => { const A = [R.int(-4, 1), R.int(-3, 1)], B = [A[0] + R.int(2, 4), A[1] + R.int(-1, 1)], C = [A[0] + R.int(0, 2), A[1] + R.int(2, 4)], dx = nz(-4, 4), dy = nz(-3, 3);
const A2 = [A[0] + dx, A[1] + dy], C2 = [C[0] + dx, C[1] + dy];
if (C2[0] === A[0] && C2[1] === A[1]) return null;
return QP("Le triangle " + M("ABC") + " est dessiné dans un repère. Une translation envoie le sommet " + M("A") + " sur le point " + M("A'") + ". Quelles sont les coordonnées de " + M("C'") + ", l'image de " + M("C") + " par cette translation ? Réponds « x ; y ».", C2,
"De " + M("A") + " à " + M("A'") + ", on se déplace de " + deplace(dx, dy) + ". On fait le même déplacement depuis " + XYn("C", C) + " : " + XYn("C'", C2) + ".",
{ ctx: "translation-image", fig: plotPts([[A[0], A[1], "A"], [B[0], B[1], "B"], [C[0], C[1], "C"], [A2[0], A2[1], "A'"]], { polys: [[A, B, C]] }),
guide: [GR("De combien d'unités se déplace-t-on horizontalement de " + M("A") + " à " + M("A'") + " (vers la droite : positif, vers la gauche : négatif) ?", dx, M(fT(A2[0]) + " - (" + fT(A[0]) + ") = " + dx) + "."), GR("Et verticalement (vers le haut : positif) ?", dy, M(fT(A2[1]) + " - (" + fT(A[1]) + ") = " + dy) + "."), GP("Coordonnées de " + M("C'") + " ?", C2, XY(C2) + ".")],
traps: [TP([C[0] - dx, C[1] - dy], "Le déplacement va de A vers A' : on l'ajoute aux coordonnées de C, dans le même sens."), TP(A2, "C'est A' ; on demande l'image de C."), TP([C[0] + dy, C[1] + dx], "Le déplacement horizontal s'ajoute à l'abscisse (x), le vertical à l'ordonnée (y).")] }); },
() => { const a = R.int(25, 80), b = R.int(30, 100), c = 180 - a - b; if (c < 20 || a === b || b === c || a === c) return null; const t = pk(["une translation", "une symétrie axiale", "une symétrie centrale"]);
return QN("Le triangle " + M("A'B'C'") + " est l'image du triangle " + M("ABC") + " par " + t + ". Dans " + M("ABC") + ", l'angle en " + M("A") + " mesure " + M(a + "°") + " et l'angle en " + M("B") + " mesure " + M(b + "°") + ". Combien mesure l'angle en " + M("C'") + " (en degrés) ?", c,
"Une isométrie conserve les angles : l'angle en " + M("C'") + " est égal à l'angle en " + M("C") + ", " + M("180° - " + a + "° - " + b + "° = " + c + "°") + ".",
{ ctx: "conserve-angle", guide: [GR("Angle en " + M("C") + " dans " + M("ABC") + " (somme des angles : 180°) ?", c, M("180 - " + a + " - " + b + " = " + c) + "."), GR("Une isométrie conserve les angles : angle en " + M("C'") + " ?", c, M(c + "°") + ".")],
traps: [TR(a + b, "La somme des trois angles vaut 180° : il faut soustraire " + a + " + " + b + " de 180."), TR(180 - c, "C'est la somme des angles en A et B ; l'angle en C' vaut 180° moins cette somme."), TR(360 - a - b, "La somme des angles d'un triangle vaut 180°, pas 360°.")] }); },
() => { const L = R.int(4, 12), l = R.int(2, L - 1), t = pk(["une translation", "une symétrie axiale", "une symétrie centrale", "une rotation"]), q = pk([["rectangle", "ABCD"], ["parallélogramme", "ABCD"]]);
return QN("Le " + q[0] + " " + M("A'B'C'D'") + " est l'image du " + q[0] + " " + M(q[1]) + " par " + t + ". On sait que " + M("AB = " + L) + " cm et " + M("BC = " + l) + " cm. Quel est le périmètre de " + M("A'B'C'D'") + " (en cm) ?", 2 * (L + l),
"Une isométrie conserve les longueurs : " + M("A'B' = " + L) + " cm et " + M("B'C' = " + l) + " cm. Périmètre : " + M("2 \\cdot (" + L + " + " + l + ") = " + 2 * (L + l)) + " cm.",
{ ctx: "conserve-perimetre", guide: [GR("Une isométrie conserve les longueurs : " + M("A'B'") + " (en cm) ?", L, M(L) + " cm."), GR("Périmètre de " + M("A'B'C'D'") + " ?", 2 * (L + l), M(2 * (L + l)) + " cm.")],
traps: [TR(L + l, "Le périmètre fait le tour : deux longueurs et deux largeurs."), TR(L * l, "Ça, c'est l'aire (pour un rectangle) ; on demande le périmètre.")] }); },
],
2: [
laquelle,
() => { const A = [R.int(-5, 3), R.int(-4, 4)], Cc = [R.int(-2, 3), R.int(-2, 3)], A2 = [2 * Cc[0] - A[0], 2 * Cc[1] - A[1]];
if (A2[0] === A[0] || A2[1] === A[1] || Math.abs(A2[0]) > 7 || Math.abs(A2[1]) > 6) return null;
return QP("La figure F' est l'image de F par une symétrie centrale. Le sommet " + XYn("A", A) + " a pour image " + XYn("A'", A2) + ". Quelles sont les coordonnées du centre de symétrie ? Réponds « x ; y ».", Cc,
"Le centre est le milieu de " + M("[AA']") + " : " + M("\\left(\\frac{" + fT(A[0]) + " + " + fT(A2[0]) + "}{2} \\,;\\, \\frac{" + fT(A[1]) + " + " + fT(A2[1]) + "}{2}\\right) = (" + Cc.map(fT).join(" \\,;\\, ") + ")") + ".",
{ ctx: "centre", fig: plotPts([[A[0], A[1], "A"], [A2[0], A2[1], "A'"]]),
guide: [GR("Le centre est le milieu de " + M("[AA']") + ". Son abscisse ?", Cc[0], M("(" + fT(A[0]) + " + " + fT(A2[0]) + ") : 2 = " + fT(Cc[0])) + "."), GR("Son ordonnée ?", Cc[1], M("(" + fT(A[1]) + " + " + fT(A2[1]) + ") : 2 = " + fT(Cc[1])) + "."), GP("Centre ?", Cc, XY(Cc) + ".")],
traps: [TP([A[0] + A2[0], A[1] + A2[1]], "Le milieu : on additionne, puis on divise par 2."), TP([(A2[0] - A[0]) / 2, (A2[1] - A[1]) / 2], "Pour le milieu, on additionne les coordonnées (on ne les soustrait pas), puis on divise par 2."), TP([0, 0], "Le centre n'est pas forcément l'origine : c'est le milieu de [AA'].")] }); },
() => { const y = nz(-4, 4), c = nz(-3, 4), a = c - R.int(2, 5), b = 2 * c - a, v = R.rand() < 0.5;
const A = v ? [a, y] : [y, a], A2 = v ? [b, y] : [y, b], ax = v ? "x" : "y";
return QN("La figure F' est l'image de F par une symétrie axiale d'axe " + (v ? "vertical" : "horizontal") + ". Le sommet " + XYn("A", A) + " a pour image " + XYn("A'", A2) + ". L'axe a pour équation " + M(ax + " = k") + ". Que vaut " + M("k") + " ?", c,
"L'axe passe par le milieu de " + M("[AA']") + " : " + M("k = \\frac{" + fT(a) + " + " + fT(b) + "}{2} = " + fT(c)) + ".",
{ ctx: "axe", fig: plotPts([[A[0], A[1], "A"], [A2[0], A2[1], "A'"]]),
guide: [GR("L'axe passe par le milieu de " + M("[AA']") + ". " + (v ? "Abscisses" : "Ordonnées") + " de " + M("A") + " et " + M("A'") + " : leur somme ?", a + b, M(fT(a) + " + " + fT(b) + " = " + (a + b)) + "."), GR(M("k") + " = cette somme divisée par 2 ?", c, M(fT(c)) + ".")],
traps: [TR(a + b, "On divise la somme par 2 : l'axe est à mi-chemin entre A et A'."), TR((b - a) / 2, "C'est la distance de A à l'axe ; on demande la position de l'axe."), TR(y, "Cette coordonnée ne change pas ; l'axe est " + (v ? "vertical : cherche son abscisse." : "horizontal : cherche son ordonnée."))] }); },
nomIso(["T", "A", "C", "Q"], CO10),
],
3: [
() => { const a = R.int(-4, 4), b = R.int(-3, 3), c = nz(-3, 3), dx = nz(-4, 4), dy = nz(-3, 3), A1 = [2 * c - a, b], A2 = [A1[0] + dx, A1[1] + dy];
if (a === c) return null;
const inv = [2 * c - (a + dx), b + dy];
return QP("On applique au point " + XYn("A", [a, b]) + " la symétrie d'axe vertical " + M("x = " + c) + ", puis la translation de " + deplace(dx, dy) + ". Quelles sont les coordonnées de l'image finale " + M("A''") + " ? Réponds « x ; y ».", A2,
"Symétrie : " + M("A") + " est à " + M(Math.abs(a - c)) + " de l'axe, son image " + XYn("A'", A1) + " est à la même distance de l'autre côté. Translation : " + XYn("A''", A2) + ".",
{ ctx: "compose-point", fig: plotPts([[a, b, "A"]], { vlines: [c] }),
guide: [GP("Image " + M("A'") + " par la symétrie d'axe " + M("x = " + c) + " ?", A1, XY(A1) + "."), GP("Puis la translation : " + M("A''") + " ?", A2, XY(A2) + ".")],
traps: [TP(inv, "L'ordre compte : d'abord la symétrie, ensuite la translation."), TP(A1, "C'est l'image après la symétrie seulement ; il reste la translation."), TP([a + dx, b + dy], "Tu n'as fait que la translation : commence par la symétrie d'axe x = " + c + ".")] }); },
() => { const c1 = R.int(-3, 2), c2 = c1 + R.int(2, 5), a = c1 - R.int(1, 3), b = R.int(-3, 3), A1 = 2 * c1 - a, A2 = 2 * c2 - A1, d = A2 - a;
return QN("On applique au point " + XYn("A", [a, b]) + " la symétrie d'axe " + M("x = " + c1) + ", puis la symétrie d'axe " + M("x = " + c2) + ". Le point final " + M("A''") + " est l'image de " + M("A") + " par une translation. De combien d'unités vers la droite ?", d,
XYn("A'", [A1, b]) + " puis " + XYn("A''", [A2, b]) + " : " + M(A2 + " - (" + a + ") = " + d) + ". Deux symétries d'axes parallèles donnent une translation du double de la distance entre les axes : " + M("2 \\cdot " + (c2 - c1) + " = " + d) + ".",
{ ctx: "deux-axes", fig: plotPts([[a, b, "A"]], { vlines: [c1, c2] }),
guide: [GR("Abscisse de " + M("A'") + " (symétrie d'axe " + M("x = " + c1) + ") ?", A1, M(A1) + "."), GR("Abscisse de " + M("A''") + " (symétrie d'axe " + M("x = " + c2) + ") ?", A2, M(A2) + "."), GR("Déplacement de " + M("A") + " à " + M("A''") + " ?", d, M(d) + ".")],
traps: [TR(c2 - c1, "C'est la distance entre les axes ; le déplacement en vaut le double."), TR(A2, "C'est l'abscisse de A'' ; on demande de combien le point s'est déplacé."), TR(c1 + c2, "Calcule les deux images l'une après l'autre.")] }); },
() => { const A = [nz(-4, 4), nz(-3, 3)], Pp = [nz(-3, 3), nz(-3, 3)], A1 = [-A[0], -A[1]], A2 = [2 * Pp[0] - A1[0], 2 * Pp[1] - A1[1]];
if (Math.abs(A2[0]) > 9 || Math.abs(A2[1]) > 8) return null;
return QP("On applique au point " + XYn("A", A) + " la symétrie de centre " + M("O(0 \\,;\\, 0)") + ", puis la symétrie de centre " + XYn("P", Pp) + ". Quelles sont les coordonnées de l'image finale " + M("A''") + " ? Réponds « x ; y ».", A2,
XYn("A'", A1) + " (les deux signes changent), puis " + M("P") + " est le milieu de " + M("[A'A'']") + " : " + XYn("A''", A2) + ". Deux symétries centrales donnent une translation.",
{ ctx: "deux-centres", fig: plotPts([[A[0], A[1], "A"], [Pp[0], Pp[1], "P"], [0, 0, "O"]]),
guide: [GP("Image " + M("A'") + " par la symétrie de centre " + M("O") + " ?", A1, XY(A1) + "."), GR(M("P") + " est le milieu de " + M("[A'A'']") + " : abscisse de " + M("A''") + " ?", A2[0], M("2 \\cdot " + fT(Pp[0]) + " - (" + fT(A1[0]) + ") = " + A2[0]) + "."), GP(M("A''") + " ?", A2, XY(A2) + ".")],
traps: [TP(A1, "C'est l'image après la première symétrie ; il reste la symétrie de centre P."), TP([2 * Pp[0] - A[0], 2 * Pp[1] - A[1]], "Tu as appliqué la symétrie de centre P à A ; il faut l'appliquer à A', l'image de A par la première symétrie."), TP([A1[0] + Pp[0], A1[1] + Pp[1]], "P est le milieu de [A'A''] : x'' = 2 · xP − x'.")] }); },
() => { const c = pk([
["la symétrie d'axe horizontal " + M("(Ox)") + ", puis la symétrie d'axe vertical " + M("(Oy)") + " (deux axes perpendiculaires qui se coupent en " + M("O") + ")", "C", "Deux symétries d'axes perpendiculaires : " + M("(x \\,;\\, y) \\to (x \\,;\\, -y) \\to (-x \\,;\\, -y)") + ", c'est la symétrie de centre " + M("O") + "."],
["la symétrie d'axe " + M("x = 1") + ", puis la symétrie d'axe " + M("x = 4") + " (deux axes parallèles)", "T", "Deux symétries d'axes parallèles : la figure est retournée deux fois, donc remise à l'endroit, et elle a glissé de " + M("2 \\cdot 3 = 6") + " unités : c'est une translation."],
["la symétrie de centre " + M("O(0 \\,;\\, 0)") + ", puis la symétrie de centre " + M("P(2 \\,;\\, 1)"), "T", "Deux demi-tours font un tour complet : la figure garde son orientation et elle a glissé (de " + M("2 \\cdot \\vec{OP}") + ") : c'est une translation."],
]), [txt, t, why] = c;
const opts = [t].concat(["T", "A", "C"].filter((u) => u !== t)).map((u) => [NOM[u], u === "A" ? "À la fin, la figure n'est pas retournée (deux retournements, ou aucun) : ce n'est pas une symétrie axiale." : u === "T" ? "La figure a fait un demi-tour autour de O : ce n'est pas un simple glissement." : "Deux demi-tours ou deux retournements remettent la figure dans son orientation de départ, sans demi-tour ; ici ce n'est pas une symétrie centrale."]);
return QC("On applique à une figure " + txt + ". Par quelle isométrie unique peut-on passer directement de la figure de départ à la figure d'arrivée ?", opts, why,
{ ctx: "compose-nom", guide: [GR("Combien de fois la figure est-elle retournée (comme dans un miroir) en tout ?", t === "C" ? 2 : t === "T" && /axe/.test(txt) ? 2 : 0, t === "C" || /axe/.test(txt) ? "Deux fois : elle est remise à l'endroit." : "Aucune : une symétrie centrale ne retourne pas la figure.")] }); },
],
};

const PC = (A, x, y) => M(A + "(" + nb(x) + " \\,;\\, " + nb(y) + ")");
const ISP = [
() => { const vert = R.rand() < 0.5, a = R.int(-2, 4), b = a + R.int(2, 5), p = a - R.int(1, 4), o = R.int(-3, 5), X1 = 2 * a - p, X2 = 2 * b - X1, c = vert ? "x" : "y", Cn = vert ? "Abscisse" : "Ordonnée", pp = (v) => (v < 0 ? "(" + v + ")" : String(v)), e = a - p;
return Object.assign(P("On applique au point " + (vert ? PC("A", p, o) : PC("A", o, p)) + " la symétrie d'axe " + (vert ? "vertical" : "horizontal") + " " + M(c + " = " + a) + ", puis la symétrie d'axe " + (vert ? "vertical" : "horizontal") + " " + M(c + " = " + b) + ".",
[["a) " + Cn + " de l'image après la 1re symétrie", X1], ["b) " + Cn + " de l'image finale", X2], ["c) De combien d'unités le point a-t-il glissé " + (vert ? "vers la droite" : "vers le haut") + " en tout ?", X2 - p]],
["A est à " + e + " unité" + (e > 1 ? "s" : "") + " de l'axe " + c + " = " + String(a).replace("-", "−") + " : son image est à " + e + " unité" + (e > 1 ? "s" : "") + " de l'autre côté.", "Deux symétries d'axes parallèles : une translation du double de la distance entre les axes."],
"a) " + M(pp(p) + " + 2 \\cdot " + e + " = " + X1) + " ; b) " + M("2 \\cdot " + pp(b) + " - " + pp(X1) + " = " + X2) + " ; c) " + M(X2 + " - " + pp(p) + " = " + (X2 - p) + " = 2 \\cdot (" + b + " - " + pp(a) + ")") + "."), { ctx: "deux-symetries" }); },
() => { const u = R.int(2, 6), v0 = R.int(2, 5), v = (u * v0) % 2 ? v0 + 1 : v0, x0 = R.int(1, 4), y0 = R.int(1, 4), [h, k] = R.rand() < 0.5 ? [0, 0] : [R.int(1, 3), R.int(-2, 2)], pp = (z) => (z < 0 ? "(" + z + ")" : String(z));
const B = [x0 + u, y0], C = [x0, y0 + v], Bx = 2 * h - B[0], Cy = 2 * k - C[1], O = h || k ? PC("\\Omega", h, k) : PC("O", 0, 0);
return Object.assign(P("Le triangle " + M("ABC") + " a pour sommets " + PC("A", x0, y0) + ", " + PC("B", B[0], B[1]) + " et " + PC("C", C[0], C[1]) + ". On lui applique la symétrie de centre " + O + ".",
[["a) Abscisse de B'", Bx], ["b) Ordonnée de C'", Cy], ["c) Aire du triangle A'B'C' (en unités d'aire)", (u * v) / 2]],
[h || k ? "Le centre Ω est le milieu de [BB'] et de [CC'] : x(B') = 2 · " + h + " − " + B[0] + "." : "Symétrie de centre O : les deux coordonnées changent de signe.", "Une isométrie conserve les aires : celle de ABC vaut " + u + " · " + v + " ÷ 2."],
"a) " + M(h || k ? "2 \\cdot " + h + " - " + B[0] + " = " + Bx : "-" + B[0]) + " ; b) " + M(h || k ? "2 \\cdot " + pp(k) + " - " + C[1] + " = " + Cy : "-" + C[1]) + " ; c) le triangle est rectangle en A : " + M("\\frac{" + u + " \\cdot " + v + "}{2} = " + (u * v) / 2) + ", comme " + M("ABC") + "."), { ctx: "symetrie-centrale" }); },
() => { const B = [R.int(-3, 3), R.int(-3, 3)], d = [nz(-5, 5), nz(-4, 4)], C = [B[0] + d[0], B[1] + d[1]], A = [R.int(-2, 6), R.int(-2, 6)], obj = pk(["un motif de frise", "une pièce de puzzle", "un logo"]);
return Object.assign(P("Sur un quadrillage, on déplace " + obj + " par la translation qui envoie le point " + PC("B", B[0], B[1]) + " sur le point " + PC("C", C[0], C[1]) + ". Un sommet du motif est " + PC("A", A[0], A[1]) + ".",
[["a) Abscisse de A', image de A", A[0] + d[0]], ["b) Ordonnée de A'", A[1] + d[1]], ["c) On applique la même translation une deuxième fois à A' : abscisse de A''", A[0] + 2 * d[0]]],
["De B à C : " + (d[0] > 0 ? d[0] + " vers la droite" : -d[0] + " vers la gauche") + ", " + (d[1] > 0 ? d[1] + " vers le haut" : -d[1] + " vers le bas") + ".", "Une translation déplace tous les points de la même façon."],
"De B à C : " + M("x") + " change de " + M((d[0] > 0 ? "+" : "") + d[0]) + " et " + M("y") + " de " + M((d[1] > 0 ? "+" : "") + d[1]) + ". a) " + M(A[0] + (d[0] < 0 ? " - " + -d[0] : " + " + d[0]) + " = " + (A[0] + d[0])) + " ; b) " + M(A[1] + (d[1] < 0 ? " - " + -d[1] : " + " + d[1]) + " = " + (A[1] + d[1])) + " ; c) " + M((A[0] + d[0]) + (d[0] < 0 ? " - " + -d[0] : " + " + d[0]) + " = " + (A[0] + 2 * d[0])) + "."), { ctx: "translation" }); },
];


const SETS = ["\\(\\mathbb{N}\\) (entiers naturels)", "\\(\\mathbb{Z}\\) (entiers relatifs)", "\\(\\mathbb{Q}\\) (rationnels)", "\\(\\mathbb{R}\\) (réels)"];
const SETN = ["\\mathbb{N}", "\\mathbb{Z}", "\\mathbb{Q}", "\\mathbb{R}"];

const NB = {
nat: () => { const n = R.int(2, 60); return [String(n), 0, n, M(n) + " est un entier positif"]; },
neg: () => { const n = R.int(2, 40); return ["-" + n, 1, -n, M("-" + n) + " est un entier négatif"]; },
fnat: () => { const d = R.int(2, 9), k = R.int(2, 9); return ["\\frac{" + k * d + "}{" + d + "}", 0, k, M("\\frac{" + k * d + "}{" + d + "} = " + k) + ", un entier naturel"]; },
fneg: () => { const d = R.int(2, 9), k = R.int(2, 9); return ["-\\frac{" + k * d + "}{" + d + "}", 1, -k, M("-\\frac{" + k * d + "}{" + d + "} = -" + k) + ", un entier négatif"]; },
dec: () => { const v = r6(R.int(11, 99) / 10 * pk([1, -1])); if (Number.isInteger(v)) return NB.dec(); return [fT(v), 2, v, M(fT(v)) + " n'est pas entier, mais c'est un quotient d'entiers (" + M(fT(v) + " = \\frac{" + Math.round(v * 10) + "}{10}") + ")"]; },
frac: () => { const d = pk([3, 4, 6, 7]), n = R.int(1, 3 * d); if (n % d === 0) return NB.frac(); const s = pk([1, -1]); return [(s < 0 ? "-" : "") + "\\frac{" + n + "}{" + d + "}", 2, (s * n) / d, M((s < 0 ? "-" : "") + "\\frac{" + n + "}{" + d + "}") + " n'est pas entier : c'est un quotient d'entiers"]; },
per: () => { const k = R.int(1, 8); return ["0{,}\\overline{" + k + "}", 2, k / 9, M("0{,}\\overline{" + k + "} = \\frac{" + k + "}{9}") + " : un rationnel (décimales périodiques)"]; },
rnat: () => { const n = R.int(2, 12); return ["\\sqrt{" + n * n + "}", 0, n, M("\\sqrt{" + n * n + "} = " + n) + ", un entier naturel"]; },
rneg: () => { const n = R.int(2, 12); return ["-\\sqrt{" + n * n + "}", 1, -n, M("-\\sqrt{" + n * n + "} = -" + n) + ", un entier négatif"]; },
rfrac: () => { const [a, b] = pk([[1, 2], [3, 2], [2, 3], [5, 2], [3, 4], [1, 3]]); return ["\\sqrt{\\frac{" + a * a + "}{" + b * b + "}}", 2, a / b, M("\\sqrt{\\frac{" + a * a + "}{" + b * b + "}} = \\frac{" + a + "}{" + b + "}") + ", un rationnel non entier"]; },
irr: () => { let n; do n = R.int(2, 60); while (Number.isInteger(Math.sqrt(n))); return ["\\sqrt{" + n + "}", 3, Math.sqrt(n), M(n) + " n'est pas un carré parfait : " + M("\\sqrt{" + n + "}") + " est irrationnel"]; },
pi: () => { const k = pk([1, 2, 3]); return [k === 1 ? "\\pi" : k + "\\pi", 3, k * Math.PI, M(k === 1 ? "\\pi" : k + "\\pi") + " est irrationnel"]; },
};
const plusPetit = (kinds, nset, ctx, co) => () => {
const [t, s, , why] = NB[pk(kinds)](), opts = SETS.slice(0, nset).map((lab, i) => [lab, i < s ? "Non : " + why + " ; il n'est pas dans " + M(SETN[i]) + "." : "Il y est bien, mais ce n'est pas le plus petit : " + why + "."]);
return QC("Quel est le plus petit ensemble de nombres qui contient " + M(t) + " ?", opts, why + " : le plus petit ensemble qui le contient est " + M(SETN[s]) + ".",
{ ctx, co, fixed: true, good: s, guide: [GR("Ce nombre est-il entier ? Tape 1 pour oui, 0 pour non.", s <= 1 ? 1 : 0, why + ".")] });
};
const liste = (kinds, n) => { for (let k = 0; k < 30; k++) { const L = kinds.map((x) => NB[x]()); if (new Set(L.map((x) => x[0])).size === L.length) return shuf(L).slice(0, n); } return null; };
const compte = (kinds, test, nom, ctx, co, why) => () => {
const L = liste(shuf(kinds).slice(0, 6), 6); if (!L) return null;
const ok = L.filter(test), c = ok.length; if (c < 2 || c > 4) return null;
const ints = L.filter((x) => x[1] <= 1).length;
return tag(QN("Parmi les nombres " + L.map((x) => M(x[0])).join(" ; ") + ", combien sont " + nom + " ?", c,
"Il y en a " + M(c) + " : " + ok.map((x) => M(x[0])).join(", ") + ". " + why,
{ ctx, guide: [GR("Combien de ces nombres sont " + nom + " ?", c, ok.map((x) => M(x[0])).join(", ") + ".")],
traps: [TR(c - L.filter((x) => test(x) && /frac|sqrt/.test(x[0])).length, "Simplifie d'abord les fractions et les racines : " + (L.filter((x) => test(x) && /frac|sqrt/.test(x[0])).map((x) => x[3]).join(" ; ") || "") + "."), ints !== c ? TR(ints, "Compte seulement les nombres " + nom + ".") : null] }), co);
};
const EN = {
1: [
plusPetit(["neg", "fnat", "fneg", "dec", "frac"], 3, "plus-petit"),
compte(["nat", "neg", "fnat", "dec", "frac", "fneg", "nat", "neg"], (x) => x[1] === 0, "des entiers naturels (dans " + M("\\mathbb{N}") + ")", "compte-N", null, "Un entier naturel est un entier positif ou nul : 0, 1, 2, 3…"),
compte(["nat", "neg", "fnat", "dec", "frac", "fneg", "neg", "nat"], (x) => x[1] === 1, "dans " + M("\\mathbb{Z}") + " mais pas dans " + M("\\mathbb{N}"), "compte-ZnonN", null, "Ce sont les entiers négatifs."),
],
2: [
() => { const L = liste(shuf(["nat", "neg", "fnat", "fneg", "dec", "frac", "per"]).slice(0, 5), 5); if (!L) return null;
const st = L.map((x) => { const s = R.int(0, 2), inn = x[1] <= s; return [M(x[0] + (inn ? " \\in " : " \\notin ") + SETN[s]), true]; });
const fl = L.map((x) => { const s = R.int(0, 2), inn = x[1] <= s; return [M(x[0] + (inn ? " \\notin " : " \\in ") + SETN[s]), false]; });
const pick = L.map((_, i) => (R.rand() < 0.5 ? st[i] : fl[i])), c = pick.filter((x) => x[1]).length; if (c < 2 || c > 4) return null;
return QN("Combien de ces affirmations sont vraies ? " + pick.map((x) => x[0]).join(" ; ") + ".", c,
"Vraies : " + pick.filter((x) => x[1]).map((x) => x[0]).join(", ") + ", soit " + M(c) + " affirmations. Rappel : " + M("\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q}") + " ; un nombre de " + M("\\mathbb{N}") + " est aussi dans " + M("\\mathbb{Z}") + " et dans " + M("\\mathbb{Q}") + ".",
{ ctx: "vrai-faux", guide: [GR("Combien d'affirmations vraies ?", c, M(c) + ".")], traps: [TR(5 - c, "Tu as compté les fausses."), TR(pick.filter((x) => /\\in/.test(x[0]) && !/notin/.test(x[0])).length, "« ∈ » veut dire « appartient à » : vérifie chaque affirmation, celles avec ∉ peuvent aussi être vraies.")] }); },
() => { const dec = shuf([[3, 4], [7, 20], [9, 25], [5, 8], [3, 5], [11, 4], [7, 2]]).slice(0, 3), nd = pk([[2, 3], [5, 6], [4, 7], [1, 3], [7, 9], [5, 12]]);
const opts = [["\\(\\frac{" + nd[0] + "}{" + nd[1] + "}\\)", ""]].concat(dec.map(([a, b]) => ["\\(\\frac{" + a + "}{" + b + "}\\)", M("\\frac{" + a + "}{" + b + "} = " + nb(a / b)) + " : c'est un nombre décimal (écriture décimale finie)."]));
return QC("Tous ces nombres sont rationnels. Lequel n'est pas un nombre décimal (son écriture décimale ne s'arrête jamais) ?", opts,
M("\\frac{" + nd[0] + "}{" + nd[1] + "} = " + nb(+(nd[0] / nd[1]).toFixed(4)) + "\\ldots") + " : les décimales ne s'arrêtent pas (elles se répètent). Les autres ont une écriture décimale finie.",
{ ctx: "non-decimal", guide: [GR("Écriture décimale de " + M("\\frac{" + dec[0][0] + "}{" + dec[0][1] + "}") + " ?", dec[0][0] / dec[0][1], M(nb(dec[0][0] / dec[0][1])) + " : elle s'arrête.")] }); },
plusPetit(["fnat", "fneg", "frac", "per", "dec"], 3, "plus-petit-frac"),
],
3: [
() => { const [n, d, p] = pk([[5, 11, 45], [7, 11, 63], [4, 11, 36], [8, 11, 72], [1, 7, 142857], [3, 7, 428571], [2, 7, 285714], [3, 11, 27], [6, 11, 54]]);
return QN("Le nombre " + M("\\frac{" + n + "}{" + d + "}") + " est rationnel : son écriture décimale est périodique. Quelle est sa période (le groupe de chiffres qui se répète) ? Tape ces chiffres.", p,
M("\\frac{" + n + "}{" + d + "} = " + nb(+(n / d).toFixed(7)) + "\\ldots") + " : le groupe " + M(p) + " se répète.",
{ ctx: "periode", guide: [GR("Premier chiffre après la virgule de " + M(n + " \\div " + d) + " ?", Math.floor((n / d) * 10) % 10, M(Math.floor((n / d) * 10) % 10) + "."), GR("Période ?", p, M(p) + ".")],
traps: [TR(Math.floor((n / d) * 100), "Ce sont les deux premières décimales ; cherche le groupe qui se répète, en entier."), TR(Math.floor((n / d) * 10) % 10, "Ce n'est que le premier chiffre de la période.")] }); },
() => { const d = pk([2, 4, 5, 8]), n = d * R.int(1, 6) + R.int(1, d - 1), s = pk([1, -1]), good = [(s < 0 ? "-" : "") + "\\frac{" + n + "}{" + d + "}", (s * n) / d];
const bad = shuf([[NB.fnat(), "est un entier"], [NB.fneg(), "est un entier"], [NB.neg(), "est un entier"]]).map(([x, w]) => ["\\(" + x[0] + "\\)", x[3] + " : il est dans " + M("\\mathbb{Z}") + "."]);
return QC("Lequel de ces nombres est dans " + M("\\mathbb{Q}") + " mais pas dans " + M("\\mathbb{Z}") + " ?", [["\\(" + good[0] + "\\)", ""]].concat(bad),
M(good[0] + " = " + nb(good[1])) + " n'est pas entier, mais c'est un quotient d'entiers : il est dans " + M("\\mathbb{Q}") + ", pas dans " + M("\\mathbb{Z}") + ".",
{ ctx: "QnonZ", guide: [GR("Combien de ces nombres sont des entiers (après simplification) ?", 3, "Trois : les fractions qui se simplifient en entiers et l'entier négatif.")] }); },
() => { const B = [["Tout entier naturel est aussi un entier relatif.", 1], ["Tout entier relatif est un entier naturel.", 0], ["Tout nombre décimal est un nombre rationnel.", 1], ["Tout nombre rationnel est un nombre décimal.", 0], ["0 est un entier naturel.", 1], ["Une fraction n'est jamais un entier.", 0], ["Un nombre négatif ne peut pas être rationnel.", 0], ["Tout entier relatif est un nombre rationnel.", 1]];
const S = shuf(B).slice(0, 4), c = S.filter((x) => x[1]).length; if (c < 2 || c > 3) return null;
return QN("Combien de ces affirmations sont vraies ? « " + S.map((x) => x[0]).join(" » ; « ") + " »", c,
M(c) + " vraies : « " + S.filter((x) => x[1]).map((x) => x[0]).join(" » ; « ") + " ». En effet " + M("\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q}") + " ; un rationnel comme " + M("\\frac{1}{3}") + " n'est pas décimal, et " + M("\\frac{6}{3} = 2") + " est un entier.",
{ ctx: "inclusions", guide: [GR("Combien d'affirmations vraies ?", c, M(c) + ".")], traps: [TR(4 - c, "Tu as compté les fausses."), TR(4, "Pas toutes : cherche un contre-exemple pour chacune (par exemple −3, 1/3 ou 6/3).")] }); },
() => { let n; do n = R.int(2, 60); while (Number.isInteger(Math.sqrt(n))); const m = R.int(2, 9), p = pk([[22, 7], [314, 100], [355, 113]]);
const opts = [["\\(\\sqrt{" + n + "}\\)", ""], ["\\(\\sqrt{" + m * m + "}\\)", M("\\sqrt{" + m * m + "} = " + m) + " : un entier, donc rationnel."], ["\\(\\frac{" + p[0] + "}{" + p[1] + "}\\)", "C'est un quotient d'entiers : il est rationnel (c'est seulement une valeur approchée de π)."], ["\\(0{,}\\overline{" + R.int(12, 98) + "}\\)", "Une écriture décimale périodique est celle d'un rationnel."]];
return QC("Lequel de ces nombres est irrationnel (il ne peut pas s'écrire comme une fraction) ?", opts, M(n) + " n'est pas un carré parfait : " + M("\\sqrt{" + n + "}") + " est irrationnel ; ses décimales ne s'arrêtent pas et ne se répètent pas.",
{ ctx: "irrationnel", co: CO10, guide: [GR(M(n) + " est-il un carré parfait ? Tape 1 pour oui, 0 pour non.", 0, "Non : " + M(Math.floor(Math.sqrt(n)) + "^2 < " + n + " < " + (Math.floor(Math.sqrt(n)) + 1) + "^2") + ".")] }); },
plusPetit(["rnat", "rneg", "rfrac", "irr", "pi", "fneg"], 4, "plus-petit-R", CO10),
compte(["rnat", "irr", "pi", "neg", "frac", "dec", "rfrac", "irr"], (x) => x[1] <= 2, "rationnels (dans " + M("\\mathbb{Q}") + ")", "compte-Q", CO10, "Les racines de carrés parfaits sont rationnelles ; " + M("\\pi") + " et les racines de nombres qui ne sont pas des carrés parfaits sont irrationnels."),
],
};

const ENP = [
() => { const a = -R.int(2, 9), f1 = pk([[12, 4], [15, 5], [18, 6], [14, 7], [20, 4]]), dc = pk([2.5, 1.5, 3.2, 0.4]), f2 = pk([[9, 3], [8, 4], [12, 3], [10, 5]]), f3 = pk([[2, 3], [3, 4], [5, 6], [1, 7]]);
const L = shuf([M(a), M("\\frac{" + f1[0] + "}{" + f1[1] + "}"), M(fT(dc)), M("0"), M("-\\frac{" + f2[0] + "}{" + f2[1] + "}"), M("\\frac{" + f3[0] + "}{" + f3[1] + "}")]);
return P("Voici six nombres : " + L.join(" ; ") + ".", [["a) Combien sont dans ℕ ?", 2], ["b) Combien sont dans ℤ ?", 4], ["c) Combien sont dans ℚ ?", 6]],
["Simplifie d'abord les fractions : " + f1[0] + "/" + f1[1] + " = " + f1[0] / f1[1] + " et −" + f2[0] + "/" + f2[1] + " = −" + f2[0] / f2[1] + ".", "ℕ ⊂ ℤ ⊂ ℚ : un nombre de ℕ compte aussi dans ℤ et dans ℚ."],
"a) " + M("\\frac{" + f1[0] + "}{" + f1[1] + "} = " + f1[0] / f1[1]) + " et " + M("0") + ", soit " + M(2) + " ; b) en plus " + M(a) + " et " + M("-" + f2[0] / f2[1]) + ", soit " + M(4) + " ; c) tous (ce sont des quotients d'entiers : " + M(fT(dc)) + " aussi), soit " + M(6) + "."); },
];


const ROM = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
const roman = (n) => { let s = ""; for (const [v, r] of ROM) while (n >= v) { s += r; n -= v; } return s; };
const VAL = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1 };
const addRead = (s) => [...s].reduce((a, c) => a + VAL[c], 0);
const swapDL = (s) => [...s].reduce((a, c) => a + (c === "D" ? 50 : c === "L" ? 500 : VAL[c]), 0);
const noSub = (n) => String(n).split("").every((d) => d !== "4" && d !== "9");
const RB = (s) => "<b>" + s + "</b>";
const bin = (n) => n.toString(2);
const NU = {
1: [
() => { let n; do n = R.int(12, 3888); while (!noSub(n)); const s = roman(n), w = swapDL(s);
return QN("Écris en chiffres le nombre romain " + RB(s) + ". (M = 1000, D = 500, C = 100, L = 50, X = 10, V = 5, I = 1)", n,
RB(s) + " : on additionne les valeurs des symboles, " + M(s.split("").map((c) => VAL[c]).join(" + ") + " = " + n) + ".",
{ ctx: "romain-lire", guide: [GR("Valeur des symboles M, D et C ?", Math.floor(n / 100) * 100, M(Math.floor(n / 100) * 100) + "."), GR("Valeur des symboles L, X, V et I ?", n % 100, M(n % 100) + "."), GR("Nombre ?", n, M(n) + ".")],
traps: [w !== n ? TR(w, "D vaut 500 et L vaut 50.") : null, TR(s.length, "On n'additionne pas des 1 : chaque symbole a sa valeur.")] }); },
() => { const d = [R.int(1, 9), R.int(0, 9), R.int(0, 9), R.int(0, 9), R.int(0, 9)], z = R.int(1, 3); d[z] = 0; const L = R.rand() < 0.5 ? 5 : 4, D = d.slice(5 - L), n = +D.join("");
const terms = D.map((x, i) => [x, L - 1 - i]).filter(([x]) => x).map(([x, e]) => (e === 0 ? String(x) : "(" + x + " \\cdot " + (e === 1 ? "10" : "10^" + e) + ")"));
if (D[0] === 0) return null;
return QN("Quel nombre s'écrit " + M(terms.join(" + ")) + " ?", n, "Chaque chiffre prend la valeur de sa position (unités, dizaines, centaines…) ; une position vide s'écrit 0 : " + M(nb(n)) + ".",
{ ctx: "positionnel", guide: [GR("Combien de chiffres a ce nombre ?", L, M(L) + " (la plus grande puissance est " + M("10^" + (L - 1)) + ")."), GR("Nombre ?", n, M(nb(n)) + ".")],
traps: [TR(+D.filter((x) => x).join(""), "Une position vide s'écrit avec un 0."), TR(D.reduce((a, b) => a + b, 0), "On ne fait pas la somme des chiffres : chaque chiffre est multiplié par sa puissance de 10.")] }); },
() => { const n = R.int(1102, 9898), dg = String(n).split("").map(Number), s = dg.reduce((a, b) => a + b, 0); if (s < 10) return null;
return QN("Les Égyptiens de l'Antiquité écrivaient les nombres avec des symboles répétés : un bâton vaut 1, une anse 10, une corde enroulée 100, une fleur de lotus 1000. Combien de symboles faut-il au minimum pour écrire " + M(nb(n)) + " ?", s,
M(dg[0]) + " fleurs de lotus, " + M(dg[1]) + " cordes, " + M(dg[2]) + " anses et " + M(dg[3]) + " bâtons : " + M(dg.join(" + ") + " = " + s) + " symboles.",
{ ctx: "egypte", guide: [GR("Combien de fleurs de lotus (milliers) ?", dg[0], M(dg[0]) + "."), GR("Nombre total de symboles ?", s, M(s) + ".")],
traps: [TR(4, "C'est le nombre de sortes de symboles ; on compte chaque symbole répété."), TR(n, "On demande le nombre de symboles, pas le nombre lui-même.")] }); },
() => { const m = R.int(1, 9), c = R.rand() < 0.5 ? 0 : R.int(1, 9), d = R.int(1, 9), u = R.rand() < 0.4 ? 0 : R.int(1, 9), n = 1000 * m + 100 * c + 10 * d + u;
const part = [[m, "fleur de lotus", "fleurs de lotus"], [c, "corde enroulée", "cordes enroulées"], [d, "anse", "anses"], [u, "bâton", "bâtons"]].filter((x) => x[0]).map((x) => x[0] + " " + (x[0] > 1 ? x[2] : x[1]));
if (c && u) return null;
return QN("En numération égyptienne (bâton : 1, anse : 10, corde enroulée : 100, fleur de lotus : 1000), un nombre est écrit avec " + part.join(", ") + ". Quel est ce nombre ?", n,
M(m + " \\cdot 1000 + " + c + " \\cdot 100 + " + d + " \\cdot 10 + " + u + " = " + nb(n)) + " ; une position sans symbole donne un 0.",
{ ctx: "egypte-lire", guide: [GR("Valeur des fleurs de lotus ?", 1000 * m, M(nb(1000 * m)) + "."), GR("Nombre ?", n, M(nb(n)) + ".")],
traps: [TR(+[m, c, d, u].filter((x) => x).join(""), "Une position sans symbole s'écrit 0 en chiffres."), TR(m + c + d + u, "Chaque symbole a sa valeur : une fleur vaut 1000.")] }); },
],
2: [
() => { const n = R.int(1400, 2099); const s = roman(n), a = addRead(s); if (a === n) return null;
return QN("Sur la façade d'un bâtiment, on lit son année de construction en chiffres romains : " + RB(s) + ". Écris cette année en chiffres. (Rappel : un symbole placé avant un symbole plus grand se soustrait, comme IV = 4.)", n,
RB(s) + " : " + s.match(/CM|CD|XC|XL|IX|IV|[MDCLXVI]/g).map((g) => g + " = " + (g.length === 2 ? VAL[g[1]] - VAL[g[0]] : VAL[g])).join(", ") + " ; total " + M(n) + ".",
{ ctx: "romain-annee", guide: [GR("Valeur de la partie des milliers et centaines (M, CM, D, CD, C) ?", Math.floor(n / 100) * 100, M(Math.floor(n / 100) * 100) + "."), GR("Année ?", n, M(n) + ".")],
traps: [TR(a, "Un symbole placé avant un plus grand se soustrait : CM = 900, XC = 90, IV = 4.")] }); },
() => { const n = R.int(19, 120), s = bin(n), rv = parseInt(s.split("").reverse().join(""), 2), ones = s.split("").filter((c) => c === "1").length;
return QN("En binaire (base 2), chaque position vaut le double de la précédente : 1, 2, 4, 8, 16… Quel nombre s'écrit " + RB(s) + " en binaire ?", n,
s.split("").map((c, i) => (c === "1" ? 2 ** (s.length - 1 - i) : 0)).filter(Boolean).join(" + ") + " = " + n + ".",
{ ctx: "binaire-lire", guide: [GR("Valeur de la position la plus à gauche ?", 2 ** (s.length - 1), M(2 ** (s.length - 1)) + "."), GR("Nombre ?", n, M(n) + ".")],
traps: [rv !== n ? TR(rv, "La position des unités est à droite, comme en base 10.") : null, TR(ones, "On ne compte pas les 1 : chaque 1 vaut la puissance de 2 de sa position."), TR(+s, "C'est l'écriture binaire ; on demande le nombre en base 10.")] }); },
() => { const n = R.int(9, 60), s = bin(n), rs = s.split("").reverse().join(""), p = 2 ** (s.length - 1);
return QN("Écris le nombre " + M(n) + " en binaire (base 2 : seulement des 0 et des 1 ; positions 1, 2, 4, 8, 16, 32…). Tape l'écriture binaire.", +s,
M(n + " = " + s.split("").map((c, i) => (c === "1" ? 2 ** (s.length - 1 - i) : 0)).filter(Boolean).join(" + ")) + " : en binaire " + RB(s) + ".",
{ ctx: "binaire-ecrire", guide: [GR("Plus grande puissance de 2 inférieure ou égale à " + M(n) + " ?", p, M(p) + "."), GR("Combien de chiffres aura l'écriture binaire ?", s.length, M(s.length) + "."), GR("Écriture binaire ?", +s, RB(s) + ".")],
traps: [rs !== s ? TR(+rs, "Les chiffres sont dans l'ordre inverse : la plus grande puissance de 2 s'écrit à gauche.") : null, TR(+bin(n - 1), "Vérifie : cette écriture vaut " + (n - 1) + ", pas " + n + ".")] }); },
],
3: [
() => { const a = R.int(1, 3), b = R.int(1, 59), c = R.int(1, 59), n = a * 3600 + b * 60 + c;
return QN("Les Babyloniens comptaient en base 60 (nous en gardons la trace dans les heures, minutes et secondes) : chaque rang vaut 60 fois le précédent. Quel nombre écrivaient-ils avec les « chiffres » " + M(a) + ", " + M(b) + " et " + M(c) + " (du plus grand rang au plus petit) ?", n,
M(a + " \\cdot 60^2 + " + b + " \\cdot 60 + " + c + " = " + nb(a * 3600) + " + " + b * 60 + " + " + c + " = " + nb(n)) + " (comme " + a + " h " + b + " min " + c + " s = " + nb(n).replace(/\\text\{'\}/g, "'") + " s).",
{ ctx: "base60", guide: [GR("Valeur du premier rang : " + M(a + " \\cdot 60^2") + " ?", a * 3600, M(nb(a * 3600)) + "."), GR("Deuxième rang : " + M(b + " \\cdot 60") + " ?", b * 60, M(b * 60) + "."), GR("Nombre ?", n, M(nb(n)) + ".")],
traps: [TR(a * 60 + b * 60 + c, "Le premier rang vaut 60 · 60 = 3600, pas 60."), TR(a * 3600 + b * 60, "N'oublie pas le dernier rang (" + c + ")."), TR(a * 10000 + b * 100 + c, "On ne colle pas les nombres : base 60, chaque rang vaut 60 fois le précédent.")] }); },
() => { const k = R.int(4, 10), n = 2 ** k;
return QN("Un ordinateur écrit les nombres en binaire avec des bits (chiffres 0 ou 1). Combien de nombres différents peut-on écrire avec " + M(k) + " bits (de " + M("0") + " à " + M("11\\ldots1") + ") ?", n,
"Chaque bit double le nombre de possibilités : " + M("2^{" + k + "} = " + nb(n)) + " (de 0 à " + M(nb(n - 1)) + ").",
{ ctx: "bits", guide: [GR("Avec 2 bits (00, 01, 10, 11), combien de nombres ?", 4, M("2^2 = 4") + "."), GR("Avec " + M(k) + " bits ?", n, M("2^{" + k + "} = " + nb(n)) + ".")],
traps: [TR(2 * k, "Chaque bit multiplie les possibilités par 2 (il ne les augmente pas de 2)."), TR(n - 1, "C'est le plus grand nombre ; avec 0, il y en a un de plus."), TR(k * k, "C'est " + k + "², pas 2 puissance " + k + ".")] }); },
() => { const a = R.int(1500, 1999), b = R.int(14, 99); if (noSub(a) && noSub(b)) return null; const sa = roman(a), sb = roman(b), n = a + b, f = addRead(sa) + addRead(sb);
return QN("Calcule " + RB(sa) + " + " + RB(sb) + " et écris le résultat en chiffres.", n,
RB(sa) + " = " + M(a) + " et " + RB(sb) + " = " + M(b) + " : " + M(a + " + " + b + " = " + n) + ".",
{ ctx: "romain-somme", guide: [GR(RB(sa) + " en chiffres ?", a, M(a) + "."), GR(RB(sb) + " en chiffres ?", b, M(b) + "."), GR("Somme ?", n, M(n) + ".")],
traps: [f !== n ? TR(f, "Un symbole placé avant un plus grand se soustrait : CM = 900, XL = 40, IX = 9.") : null] }); },
],
};

const NUP = [
() => { let y = 1848; for (let k = 0; k < 50; k++) { const t = R.int(1450, 2019); if (!noSub(t)) { y = t; break; } } const r = roman(y), lieu = pk(["Un monument porte l'inscription", "Une cloche d'église porte la date"].concat(y >= 1850 && y <= 1990 ? ["Le fronton d'une gare indique sa date de construction :"] : ["Le cadran d'un vieux moulin indique sa date de construction :"]));
return Object.assign(P(lieu + " " + RB(r) + ".", [["a) Année en chiffres", y], ["b) Combien d'années jusqu'en 2026 ?", 2026 - y], ["c) Nombre de symboles romains de l'inscription", r.length]],
["Un symbole placé avant un plus grand se soustrait (IV = 4, XC = 90, CM = 900).", "Compte chaque lettre."],
"a) " + r + " = " + M(nb(y)) + " ; b) " + M("2026 - " + y + " = " + (2026 - y)) + " ; c) " + [...r].join(", ") + " : " + r.length + " symboles."), { ctx: "romain-date" }); },
() => { const pc = (n) => bin(n).split("1").length - 1, two = () => { let t = 0; for (let k = 0; k < 30 && !t; k++) { const z = R.int(5, 31); if (pc(z) >= 2) t = z; } return t || 13; }, a = two(); let b = two(); if (b === a) b = a === 13 ? 22 : 13; const pos = (n) => bin(n).split("").map((c, i, t) => (c === "1" ? 2 ** (t.length - 1 - i) : 0)).filter((v) => v).join(" + "), cx = pk([["Un message est codé en binaire :", "puis"], ["Deux capteurs envoient leurs mesures en binaire :", "et"], ["Un robot reçoit deux nombres en binaire :", "puis"]]);
return Object.assign(P(cx[0] + " " + RB(bin(a)) + " " + cx[1] + " " + RB(bin(b)) + ".", [["a) " + bin(a) + " en base 10", a], ["b) " + bin(b) + " en base 10", b], ["c) La somme des deux, en base 10", a + b]],
["Positions de droite à gauche : 1, 2, 4, 8, 16.", "Additionne en base 10."], "a) " + M(pos(a) + " = " + a) + " ; b) " + M(pos(b) + " = " + b) + " ; c) " + M(a + " + " + b + " = " + (a + b)) + " (en binaire " + bin(a + b) + ")."), { ctx: "binaire" }); },
() => { let n = 2357; for (let k = 0; k < 50; k++) { const t = R.int(1100, 4899), d = String(t).split("").map(Number); if (d.every((x) => x <= 7) && d.some((x) => x >= 5) && d.filter((x) => x).length >= 3) { n = t; break; } }
const dg = String(n).split("").map(Number), [m, c, d, u] = dg, ds = (x) => String(x).split("").reduce((s, z) => s + +z, 0), n2 = 2 * n;
const part = [[m, "fleur de lotus", "fleurs de lotus"], [c, "corde enroulée", "cordes enroulées"], [d, "anse", "anses"], [u, "bâton", "bâtons"]].filter((x) => x[0]).map((x) => x[0] + " " + (x[0] > 1 ? x[2] : x[1]));
return Object.assign(P("En numération égyptienne (bâton : 1, anse : 10, corde enroulée : 100, fleur de lotus : 1000), un scribe écrit un nombre avec " + (part.length > 1 ? part.slice(0, -1).join(", ") + " et " + part[part.length - 1] : part[0]) + ".", [["a) Quel est ce nombre ?", n], ["b) Combien de symboles a-t-il utilisés ?", ds(n)], ["c) Combien de symboles faut-il, au minimum, pour écrire le double de ce nombre ?", ds(n2)]],
["Chaque symbole répété s'additionne.", "Pour le double, calcule-le en base 10, puis compte les symboles de chaque rang (10 bâtons s'échangent contre 1 anse…)."],
"a) " + M(nb(1000 * m) + " + " + 100 * c + " + " + 10 * d + " + " + u + " = " + nb(n)) + " ; b) " + M(dg.join(" + ") + " = " + ds(n)) + " symboles ; c) " + M("2 \\cdot " + nb(n) + " = " + nb(n2)) + " : " + M(String(n2).split("").join(" + ") + " = " + ds(n2)) + " symboles (et non " + 2 * ds(n) + " : les échanges en réduisent le nombre)."), { ctx: "egypte-double" }); },
];


const CTXG = [
{ nom: "la distance (en km) entre une randonneuse et son point de départ, en fonction du temps (en heures)", ul: "heures", cb: "combien d'heures", us: "heure", uy: "km", N: [6, 8], start: 0 },
{ nom: "le volume d'eau (en m³) dans une citerne, en fonction du temps (en jours)", ul: "jours", cb: "combien de jours", us: "jour", uy: "m³", N: [8, 10], start: null },
{ nom: "la température extérieure (en °C) pendant une journée de printemps, en fonction du nombre d'heures écoulées depuis 5 h", ul: "heures", cb: "combien d'heures", us: "heure", uy: "°C", N: [7, 9], start: null },
];
const duree = (C, t) => M(t) + " " + (t > 1 ? C.ul : C.us);


const profil = (C) => {
for (let t = 0; t < 60; t++) {
const N = R.int(C.N[0], C.N[1]), y = [C.start === 0 ? 0 : R.int(2, 6)];
for (let i = 1; i <= N; i++) y.push(Math.max(0, Math.min(12, y[i - 1] + pk([-3, -2, -1, 0, 1, 2, 3, 2]))));
const d = y.slice(1).map((v, i) => v - y[i]), mx = Math.max(...y);
if (d.filter((v) => v > 0).length < 2 || !d.some((v) => v < 0) || !d.some((v) => v === 0) || y.filter((v) => v === mx).length !== 1 || y.indexOf(mx) === 0 || y.indexOf(mx) === N) continue;
return y;
}
return null;
};
const gplot = (y, C) => { const N = y.length - 1, f = (x) => { const i = Math.min(Math.floor(x), N - 1); return y[i] + (y[i + 1] - y[i]) * (x - i); }, hi = Math.max(...y) + 1;
return FIG.plot([{ f, from: 0, to: N }], [], { xr: [-1, N], yr: [-1, hi], numbers: true, squash: Math.min(1, (230 / 300) * (N / hi)), label: C.nom }); };
const avecG = (f) => () => { const C = pk(CTXG), y = profil(C); if (!y) return null; return f(C, y, gplot(y, C)); };

const SIT = [
["le prix payé pour des croissants à 1,20 CHF pièce, selon le nombre de croissants", "P", "Le prix est le nombre de croissants multiplié par 1,20 : c'est proportionnel."],
["la distance parcourue par un train qui roule à 120 km/h, selon la durée du trajet", "P", "Distance = 120 · durée : c'est proportionnel."],
["le périmètre d'un carré, selon la longueur de son côté", "P", "Périmètre = 4 · côté : c'est proportionnel."],
["la masse d'un tas de briques de 2,5 kg chacune, selon le nombre de briques", "P", "Masse = 2,5 · nombre de briques : c'est proportionnel."],
["le prix d'une course en taxi (6 CHF de prise en charge, plus 3 CHF par kilomètre), selon le nombre de kilomètres", "A", "Prix = 3 · km + 6 : pour 0 km, on paie déjà 6 CHF ; ce n'est pas proportionnel, c'est affine.", "Pour 0 km, on paie déjà 6 CHF, et 2 km ne coûtent pas le double de 1 km : ce n'est pas proportionnel."],
["la hauteur d'une bougie de 20 cm qui diminue de 2 cm par heure, selon le temps", "A", "Hauteur = 20 − 2 · temps : elle n'est pas nulle au départ ; c'est affine, pas proportionnel.", "Au départ, la bougie mesure déjà 20 cm, et elle raccourcit : ce n'est pas proportionnel."],
["le prix d'un mois de fitness (30 CHF d'abonnement, plus 5 CHF par séance), selon le nombre de séances", "A", "Prix = 5 · séances + 30 : affine, pas proportionnel (30 CHF même sans séance).", "On paie 30 CHF même sans séance : ce n'est pas proportionnel."],
["l'aire d'un carré, selon la longueur de son côté", "N", "Aire = côté · côté : si le côté double, l'aire est multipliée par 4 ; ni proportionnel, ni affine.", "Si le côté double, l'aire est multipliée par 4 : ce n'est pas proportionnel."],
["la taille d'un enfant, selon son âge", "N", "La taille ne grandit pas toujours du même nombre de cm par an : ce n'est ni proportionnel, ni affine.", "À 0 an, un bébé mesure déjà 50 cm environ, et il ne grandit pas régulièrement : ce n'est pas proportionnel."],
["le volume d'un cube, selon la longueur de son arête", "N", "Volume = arête³ : ni proportionnel, ni affine.", "Si l'arête double, le volume est multiplié par 8 : ce n'est pas proportionnel."],
];

const reco = (k, q, why, why9, ctx, guide, fig) => {
const aff = R.rand() < 0.5, all = aff ? [["une situation de proportionnalité", "P"], ["une fonction affine (non proportionnelle)", "A"], ["ni l'une ni l'autre", "N"]] : [["une situation de proportionnalité", "P"], ["une situation qui n'est pas de proportionnalité", "X"]];
const kk = aff ? k : k === "P" ? "P" : "X", w = aff ? why : why9 || why, gi = all.findIndex((o) => o[1] === kk);
return QC(q + " Il s'agit de :", all.map((o) => [o[0], "Non. " + w]), w, { ctx, fig, good: gi, fixed: true, co: aff ? CO10 : [9], guide });
};
const table = (xs, ys) => M("\\begin{array}{c|" + xs.map(() => "c").join("|") + "} x & " + xs.map(fT).join(" & ") + " \\\\ \\hline y & " + ys.map(fT).join(" & ") + " \\end{array}");
const FL = {
1: [
avecG((C, y, fig) => { const N = y.length - 1; let t; do t = R.int(1, N - 1); while (y[t] === y[t - 1] && y[t] === y[t + 1] && R.rand() < 0.7); const v = y[t];
return QN("Le graphique représente " + C.nom + ". Quelle est la valeur (en " + C.uy + ") au bout de " + duree(C, t) + " ?", v,
"On part de " + M(t) + " sur l'axe horizontal, on monte jusqu'au graphique, puis on lit sur l'axe vertical : " + M(v) + " " + C.uy + ".",
{ ctx: "lire-image", fig, guide: [GR("Sur quel axe repère-t-on le temps " + M(t) + " ? Tape 1 pour l'axe horizontal, 2 pour l'axe vertical.", 1, "Le temps est sur l'axe horizontal."), GR("Valeur lue ?", v, M(v) + " " + C.uy + ".")],
traps: [TR(y[t - 1], "C'est la valeur à " + (t - 1) + " ; repère bien " + t + " sur l'axe horizontal."), TR(y[t + 1], "C'est la valeur à " + (t + 1) + " ; repère bien " + t + " sur l'axe horizontal."), TR(y.indexOf(t) >= 0 && y.indexOf(t) !== t ? y.indexOf(t) : NaN, "Tu as lu à l'envers : " + t + " se repère sur l'axe horizontal.")] }); }),
avecG((C, y, fig) => { const mx = Math.max(...y), t = y.indexOf(mx);
return QN("Le graphique représente " + C.nom + ". Au bout de " + C.cb + " la valeur est-elle la plus grande ?", t,
"Le point le plus haut du graphique est à " + M(t) + " sur l'axe horizontal (valeur " + M(mx) + " " + C.uy + ").",
{ ctx: "lire-max", fig, guide: [GR("Valeur la plus grande (en " + C.uy + ") ?", mx, M(mx) + "."), GR("Au bout de " + C.cb + " ?", t, M(t) + ".")],
traps: [TR(mx, "C'est la valeur maximale ; on demande quand elle est atteinte (axe horizontal)."), TR(y.indexOf(Math.min(...y)), "C'est le moment où la valeur est la plus petite.")] }); }),
avecG((C, y, fig) => { const d = y.slice(1).map((v, i) => v - y[i]), up = d.filter((v) => v > 0).length, dn = d.filter((v) => v < 0).length, st = d.filter((v) => v === 0).length;
return QN("Le graphique représente " + C.nom + ". Pendant " + C.cb + " en tout la valeur a-t-elle augmenté ?", up,
"Le graphique monte pendant " + duree(C, up) + " ; il descend pendant " + duree(C, dn) + " et reste horizontal pendant " + duree(C, st) + ".",
{ ctx: "duree-hausse", fig, guide: [GR("Pendant " + C.cb + " la valeur reste-t-elle constante (graphique horizontal) ?", st, duree(C, st) + "."), GR("Et pendant " + C.cb + " augmente-t-elle (graphique qui monte) ?", up, duree(C, up) + ".")],
traps: [TR(dn, "C'est la durée pendant laquelle la valeur diminue (le graphique descend)."), TR(up + st, "Quand le graphique est horizontal, la valeur ne change pas : elle n'augmente pas."), TR(Math.max(...y) - y[0], "On demande une durée (axe horizontal), pas une valeur.")] }); }),
],
2: [
() => { const [s, k, why, why9] = pk(SIT); return reco(k, "On considère " + s + ".", why, why9, "reco-situation", [GR("Pour une quantité nulle (0), la grandeur vaut-elle 0 ? Tape 1 pour oui, 0 pour non.", k === "P" || /aire|volume/.test(s) ? 1 : 0, k === "P" ? "Oui." : k === "A" ? "Non : il y a une valeur de départ." : /aire|volume/.test(s) ? "Oui, mais cela ne suffit pas : il faut aussi qu'elle augmente toujours de la même façon." : "Non.")]); },
() => { const k = pk(["P", "A", "N"]), xs = pk([[1, 2, 3, 4], [2, 4, 5, 8], [1, 3, 5, 6]]), a = R.int(2, 6), b = nz(-6, 9);
const ys = k === "P" ? xs.map((x) => a * x) : k === "A" ? xs.map((x) => a * x + b) : xs.map((x) => x * x + (R.rand() < 0.5 ? 0 : 1));
const q0 = ys.map((v, i) => r6(v / xs[i])), ec = ys.slice(1).map((v, i) => r6((v - ys[i]) / (xs[i + 1] - xs[i])));
const why = k === "P" ? "Les quotients y ÷ x sont tous égaux à " + a + " : c'est proportionnel (y = " + a + "x)." : k === "A" ? "y augmente toujours de " + a + " quand x augmente de 1, mais y ÷ x n'est pas constant (" + dS(q0[0]) + " puis " + dS(q0[1]) + ") : c'est affine (y = " + a + "x " + (b < 0 ? "− " + -b : "+ " + b) + "), pas proportionnel." : "Les accroissements ne sont pas réguliers (y augmente de " + dS(ec[0]) + " puis de " + dS(ec[1]) + " par unité de x) : ni proportionnel, ni affine.";
const why9 = k === "P" ? why : "Les quotients y ÷ x ne sont pas tous égaux (" + dS(q0[0]) + " puis " + dS(q0[1]) + ") : ce n'est pas proportionnel.";
return reco(k, "Voici un tableau de valeurs : " + table(xs, ys) + ".", why, why9, "reco-tableau", [GR("Quotient " + M("y \\div x") + " pour la première colonne ?", q0[0], M(fT(ys[0]) + " \\div " + xs[0] + " = " + fT(q0[0])) + "."), GR("Et pour la deuxième colonne ?", q0[1], M(fT(ys[1]) + " \\div " + xs[1] + " = " + fT(q0[1])) + ".")]); },
avecG((C, y, fig) => { const N = y.length - 1; for (let t = 0; t < 30; t++) { const a = R.int(0, N - 2), b = R.int(a + 2, N); if (y[b] < y[a]) { const d = y[a] - y[b];
return QN("Le graphique représente " + C.nom + ". De combien la valeur a-t-elle diminué entre " + M(a) + " et " + M(b) + " " + C.ul + " (en " + C.uy + ") ?", d,
"Au bout de " + duree(C, a) + " : " + M(y[a]) + " " + C.uy + " ; au bout de " + duree(C, b) + " : " + M(y[b]) + " " + C.uy + ". Diminution : " + M(y[a] + " - " + y[b] + " = " + d) + " " + C.uy + ".",
{ ctx: "difference", fig, guide: [GR("Valeur au bout de " + duree(C, a) + " ?", y[a], M(y[a]) + "."), GR("Valeur au bout de " + duree(C, b) + " ?", y[b], M(y[b]) + "."), GR("Diminution ?", d, M(d) + " " + C.uy + ".")],
traps: [TR(y[a], "C'est la valeur au début ; calcule la différence avec la valeur à la fin."), TR(b - a, "C'est la durée ; on demande la variation de la valeur."), TR(Math.max(...y.slice(a, b + 1)) - y[b], "Compare seulement les valeurs aux deux moments demandés.")] }); } } return null; }),
],
3: [
() => { const k = pk(["P", "A", "N"]), a = pk([0.5, 1, 1.5]), b = pk([1, 2, 3]), f = k === "P" ? (x) => a * x : k === "A" ? (x) => a * x + b : (x) => (x * x) / 3;
const fig = FIG.plot([{ f, from: 0, to: 6 }], [], { xr: [-1, 6], yr: [-1, 12], numbers: true, step: 2, squash: 0.45, label: "graphique d'une fonction" });
const why = k === "P" ? "Le graphique est une droite qui passe par l'origine : c'est une situation de proportionnalité." : k === "A" ? "C'est une droite, mais elle ne passe pas par l'origine (elle coupe l'axe vertical en " + b + ") : affine, pas proportionnelle." : "Le graphique n'est pas une droite : ni proportionnel, ni affine.";
const why9 = k === "P" ? why : k === "A" ? "La droite ne passe pas par l'origine (elle coupe l'axe vertical en " + b + ") : ce n'est pas proportionnel." : "Le graphique n'est pas une droite : ce n'est pas proportionnel.";
return reco(k, "Le graphique représente une grandeur en fonction d'une autre.", why, why9, "reco-graphe", [GR("Le graphique est-il une droite ? Tape 1 pour oui, 0 pour non.", k === "N" ? 0 : 1, k === "N" ? "Non, c'est une courbe." : "Oui.")], fig); },
() => { const [u, pu, obj] = pk([["kg", [2.5, 3.5], "des pommes"], ["L", [1.8, 1.9, 2.1, 2.2], "de l'essence"], ["kg", [1.5, 2.5], "de la farine"]]), p = pk(pu), x = pk([2, 4]), yv = r6(p * x), c = R.int(3, 9);
if (c === x) return null; const v = r6(p * c);
const fig = FIG.plot([{ f: (t) => p * t, from: 0, to: 5 }], [[x, yv, ""]], { xr: [-1, 5], yr: [-1, Math.ceil(p * 5) + 1], numbers: true, step: 2, squash: Math.min(1, 6 / (p * 5 + 1)), label: "prix en fonction de la quantité" });
return QN("Le graphique donne le prix (en CHF) " + obj + " en fonction de la quantité (en " + u + ") : c'est une situation de proportionnalité. Le point marqué indique que " + M(x) + " " + u + " coûtent " + M(fT(yv)) + " CHF. Combien coûtent " + M(c) + " " + u + " (en CHF) ?", v,
"Prix de 1 " + u + " : " + M(fT(yv) + " \\div " + x + " = " + fT(p)) + " CHF. Pour " + M(c) + " " + u + " : " + M(c + " \\cdot " + fT(p) + " = " + fT(v)) + " CHF.",
{ ctx: "coef-graphe", fig, guide: [GR("Prix de 1 " + u + " (en CHF) ?", p, M(fT(yv) + " \\div " + x + " = " + fT(p)) + "."), GR("Prix de " + M(c) + " " + u + " ?", v, M(fT(v)) + " CHF.")],
traps: [TR(r6(yv + (c - x)), "Ce n'est pas une différence : dans une situation de proportionnalité, on multiplie."), TR(r6(yv * c), "Tu as multiplié le prix de " + x + " " + u + " ; calcule d'abord le prix de 1 " + u + ".")] }); },
avecG((C, y, fig) => { const N = y.length - 1; for (let t = 0; t < 40; t++) { const a = R.int(0, N - 2), b = R.int(a + 2, N), d = y[b] - y[a]; if (d > 0 && Number.isInteger((2 * d) / (b - a))) { const v = d / (b - a);
return QN("Le graphique représente " + C.nom + ". Entre " + M(a) + " et " + M(b) + " " + C.ul + ", de combien la valeur a-t-elle augmenté en moyenne par " + C.us + " (en " + C.uy + ") ?", v,
"Augmentation : " + M(y[b] + " - " + y[a] + " = " + d) + " " + C.uy + " en " + duree(C, b - a) + ", soit " + M(d + " \\div " + (b - a) + " = " + fT(v)) + " " + C.uy + " par " + C.us + " en moyenne.",
{ ctx: "taux-moyen", fig, guide: [GR("Augmentation entre " + M(a) + " et " + M(b) + " " + C.ul + " ?", d, M(d) + " " + C.uy + "."), GR("Durée (en " + C.ul + ") ?", b - a, duree(C, b - a) + "."), GR("Augmentation moyenne par " + C.us + " ?", v, M(fT(v)) + ".")],
traps: [TR(d, "C'est l'augmentation totale ; divise par la durée."), TR(r6((b - a) / d), "On divise l'augmentation par la durée, pas l'inverse.")] }); } } return null; }),
],
};
const FLP = [
() => { const pc = pk([5, 6, 7]), pu = pk([2.5, 3, 3.5]), d1 = pk([3, 4, 5]), d2 = 2 * d1, y1 = r6(pc + pu * d1), y2 = r6(pc + pu * d2), ch = (v) => (Number.isInteger(v) ? String(v) : v.toFixed(2).replace(".", ","));
return P("Un taxi facture " + pc + " CHF de prise en charge, puis " + ch(pu) + " CHF par kilomètre.", [["a) Prix d'une course de " + d1 + " km (CHF)", y1], ["b) Prix d'une course de " + d2 + " km (CHF)", y2], ["c) De combien le prix augmente-t-il quand on passe de " + d1 + " km à " + d2 + " km (CHF) ?", r6(y2 - y1)]],
["Prix = " + ch(pu) + " · km + " + pc + ".", "Si c'était proportionnel, doubler la distance doublerait le prix."], "a) " + M(fT(pu) + " \\cdot " + d1 + " + " + pc + " = " + fT(y1)) + " ; b) " + M(fT(pu) + " \\cdot " + d2 + " + " + pc + " = " + fT(y2)) + " ; c) " + M(fT(y2) + " - " + fT(y1) + " = " + fT(r6(y2 - y1))) + " CHF. Doubler la distance ne double pas le prix (" + M(fT(y2) + " \\ne 2 \\cdot " + fT(y1)) + ") : ce n'est pas proportionnel."); },
];


{ const f0 = FLP[0]; FLP[0] = () => Object.assign(f0(), { ctx: "taxi" }); }
FLP.push(
() => { const pc = pk([8, 10, 12]), pu = pk([12, 15, 18]), d1 = pk([2, 3]), d2 = 2 * d1, y1 = pc + pu * d1, y2 = pc + pu * d2;
return Object.assign(P("Au bord du lac, la location d'un kayak coûte " + pc + " CHF de base, plus " + pu + " CHF par heure.", [["a) Prix pour " + d1 + " h (CHF)", y1], ["b) Prix pour " + d2 + " h (CHF)", y2], ["c) De combien le prix augmente-t-il quand on passe de " + d1 + " h à " + d2 + " h (CHF) ?", y2 - y1]],
["Prix = " + pu + " · heures + " + pc + ".", "Si c'était proportionnel, doubler la durée doublerait le prix."], "a) " + M(pu + " \\cdot " + d1 + " + " + pc + " = " + y1) + " ; b) " + M(pu + " \\cdot " + d2 + " + " + pc + " = " + y2) + " ; c) " + M(y2 + " - " + y1 + " = " + (y2 - y1)) + " CHF. Doubler la durée ne double pas le prix (" + M(y2 + " \\ne 2 \\cdot " + y1) + ") : ce n'est pas proportionnel."), { ctx: "kayak" }); },
() => { const ab = pk([18, 20, 24]), pu = pk([0.25, 0.3, 0.35]), d1 = pk([150, 200, 250]), d2 = 2 * d1, y1 = r6(ab + pu * d1), y2 = r6(ab + pu * d2);
return Object.assign(P("Une facture d'électricité mensuelle comprend un abonnement de " + ab + " CHF, plus " + M(fT(pu)) + " CHF par kWh consommé.", [["a) Facture pour " + d1 + " kWh (CHF)", y1], ["b) Facture pour " + d2 + " kWh (CHF)", y2], ["c) De combien la facture augmente-t-elle quand on passe de " + d1 + " kWh à " + d2 + " kWh (CHF) ?", r6(y2 - y1)]],
["Facture = " + dS(pu) + " · kWh + " + ab + ".", "Si c'était proportionnel, doubler la consommation doublerait la facture."], "a) " + M(fT(pu) + " \\cdot " + d1 + " + " + ab + " = " + fT(y1)) + " ; b) " + M(fT(pu) + " \\cdot " + d2 + " + " + ab + " = " + fT(y2)) + " ; c) " + M(fT(y2) + " - " + fT(y1) + " = " + fT(r6(y2 - y1))) + " CHF : la facture n'est pas proportionnelle à la consommation (" + M(fT(y2) + " \\ne 2 \\cdot " + fT(y1)) + ")."), { ctx: "electricite" }); });



const LT = () => pk(["x", "a", "n", "y"]);
const sg = (c) => (c < 0 ? " - " + -c : " + " + c);
const mono = (c, v) => (c === 1 ? v : c === -1 ? "-" + v : c + v);
const LC = {
1: [
() => { const c = R.int(2, 5), x = R.int(2, 6), v = LT(), r = c * x * x;
return QN("Calcule " + M(c + v + "^2") + " pour " + M(v + " = " + x) + ".", r,
"Convention : " + M(c + v + "^2 = " + c + " \\cdot " + v + " \\cdot " + v) + " (le carré ne porte que sur " + M(v) + ") : " + M(c + " \\cdot " + x + "^2 = " + c + " \\cdot " + x * x + " = " + r) + ".",
{ ctx: "carre-coef", guide: [GR(M(x + "^2") + " = ?", x * x, M(x * x) + "."), GR(M(c + " \\cdot " + x * x) + " = ?", r, M(r) + ".")],
traps: [TR((c * x) ** 2, "Le carré ne porte que sur " + v + " : " + c + v + "² = " + c + " · " + v + "², pas (" + c + v + ")²."), TR(c * 2 * x, v + "² = " + v + " · " + v + ", pas 2 · " + v + "."), TR(c + x * x, c + v + "² est un produit : " + c + " · " + v + "².")] }); },
() => { const x = R.int(2, 7), v = LT(), neg = R.rand() < 0.5, r = -x * x, xv = neg ? -x : x;
return QN("Calcule " + M("-" + v + "^2") + " pour " + M(v + " = " + xv) + ".", r,
M("-" + v + "^2 = -(" + v + "^2)") + " : on calcule d'abord le carré, puis on prend l'opposé. " + M("-(" + (neg ? "(" + xv + ")" : xv) + ")^2 = -" + x * x) + ".",
{ ctx: "moins-carre", guide: [GR("Carré de " + M(xv) + " ?", x * x, M((neg ? "(" + xv + ")" : xv) + "^2 = " + x * x) + "."), GR("Opposé ?", r, M(r) + ".")],
traps: [TR(x * x, "Le signe − devant " + v + "² s'applique après le carré : −" + v + "² = −(" + v + "²), un nombre négatif."), TR(-2 * x, v + "² = " + v + " · " + v + ".")] }); },
() => { const v = LT(), c = R.int(2, 5), m = pk([
[c + " \\cdot " + v + " \\cdot " + v + " \\cdot " + v, c + v + "^3", [["(" + c + v + ")^3", "Le cube ne porte que sur " + v + " : " + c + " n'est multiplié qu'une fois."], [3 * c + v, v + " · " + v + " · " + v + " est un produit de trois " + v + " : " + v + "³, pas 3" + v + "."], [c + "^3" + v, "Le nombre " + c + " n'apparaît qu'une fois : il n'est pas au cube."]]],
[v + " \\cdot " + v + " + " + v + " \\cdot " + v, "2" + v + "^2", [[v + "^4", "On additionne deux " + v + "² : 2" + v + "², pas " + v + "⁴."], ["4" + v, v + " · " + v + " = " + v + "², pas 2" + v + "."], ["2" + v + "^4", v + "² + " + v + "² = 2" + v + "² : l'exposant ne change pas quand on additionne."]]],
[c + " \\cdot " + v + " \\cdot b \\cdot " + v, c + v + "^2 b", [[c + v + "b^2", "C'est " + v + " qui apparaît deux fois, pas b."], [2 * c + v + "b", v + " · " + v + " = " + v + "², pas 2" + v + "."], [c + v + "^2 b^2", "b n'apparaît qu'une fois."]]],
]);
return QC("Laquelle de ces écritures est égale à " + M(m[0]) + " ?", [["\\(" + m[1] + "\\)", ""]].concat(m[2].map(([e, w]) => ["\\(" + e + "\\)", w])),
"Conventions : on n'écrit pas le signe de multiplication devant une lettre, et un produit de facteurs égaux s'écrit avec une puissance : " + M(m[0] + " = " + m[1]) + ".",
{ ctx: "ecriture-courte", guide: [GR("Combien de fois la lettre " + M(v) + " apparaît-elle dans le produit ?", (m[0].match(new RegExp("(^|[^a-z])" + v + "(?![a-z])", "g")) || []).length, "Compte-les.")] }); },
() => { const x = R.int(1, 4), c = R.int(2, 3), m = R.int(1, 4), v = LT(), r = c * (x + m) ** 2;
return QN("Calcule " + M(c + "(" + v + " + " + m + ")^2") + " pour " + M(v + " = " + x) + ".", r,
"D'abord la parenthèse, puis le carré, puis la multiplication : " + M(c + " \\cdot (" + x + " + " + m + ")^2 = " + c + " \\cdot " + (x + m) + "^2 = " + c + " \\cdot " + (x + m) ** 2 + " = " + r) + ".",
{ ctx: "parenthese-carre", guide: [GR("Parenthèse : " + M(x + " + " + m) + " ?", x + m, M(x + m) + "."), GR("Son carré ?", (x + m) ** 2, M((x + m) ** 2) + "."), GR("Résultat ?", r, M(r) + ".")],
traps: [TR((c * (x + m)) ** 2, "Le carré ne porte que sur la parenthèse : on multiplie par " + c + " après."), TR(c * (x * x + m * m), "(" + v + " + " + m + ")² n'est pas " + v + "² + " + m + "² : calcule d'abord la parenthèse."), TR(c * 2 * (x + m), "Le carré : la parenthèse multipliée par elle-même, pas par 2.")] }); },
],
2: [
() => { const v = LT(), k = R.int(2, 7), m = R.int(2, 9) * pk([1, -1]); if (k === Math.abs(m)) return null; const km = k * m;
return QC("Laquelle de ces expressions est égale à " + M(k + "(" + v + sg(m) + ")") + " pour toutes les valeurs de " + M(v) + " ?",
[["\\(" + k + v + sg(km) + "\\)", ""], ["\\(" + k + v + sg(m) + "\\)", "Le facteur " + k + " multiplie les deux termes de la parenthèse, " + v + " et " + m + "."], ["\\(" + v + sg(km) + "\\)", v + " est aussi multiplié par " + k + "."], ["\\(" + k + v + sg(-km) + "\\)", "Attention au signe : " + k + " · (" + m + ") = " + km + "."]],
"Distributivité : " + M(k + "(" + v + sg(m) + ") = " + k + " \\cdot " + v + " + " + k + " \\cdot (" + m + ") = " + k + v + sg(km)) + ".",
{ ctx: "equiv-developpe", guide: [GR("Vérifie avec " + M(v + " = 1") + " : valeur de " + M(k + "(1" + sg(m) + ")") + " ?", k * (1 + m), M(k * (1 + m)) + ".")] }); },
() => { const [a, b] = [R.int(2, 6), R.int(2, 6)], t = pk([
["(a + b)^2", "a^2 + b^2", (a + b) ** 2, a * a + b * b, "(a + b)² n'est pas égal à a² + b² : il manque le terme 2ab."],
["2(a + b)", "2a + b", 2 * (a + b), 2 * a + b, "2(a + b) = 2a + 2b : le 2 multiplie aussi b."],
["(ab)^2", "ab^2", (a * b) ** 2, a * b * b, "(ab)² = a²b² : le carré porte sur a et sur b."],
]); if (a === b && t[0] === "(ab)^2") return null; const d = t[2] - t[3], w = pk(["Lina", "Noé", "Inès", "Yanis", "Mia", "Sam"]);
return QN(w + " affirme que " + M(t[0] + " = " + t[1]) + " pour toutes les valeurs de " + M("a") + " et " + M("b") + ". Teste avec " + M("a = " + a) + " et " + M("b = " + b) + " : calcule " + M(t[0]) + " et " + M(t[1]) + ", puis tape la différence (la première valeur moins la deuxième).", d,
M(t[0]) + " vaut " + M(t[2]) + " et " + M(t[1]) + " vaut " + M(t[3]) + " : la différence est " + M(d) + ", pas 0. Une seule valeur suffit pour montrer que les expressions ne sont pas équivalentes. " + t[4],
{ ctx: "contre-exemple", guide: [GR("Valeur de " + M(t[0]) + " ?", t[2], M(t[2]) + "."), GR("Valeur de " + M(t[1]) + " ?", t[3], M(t[3]) + "."), GR("Différence ?", d, M(d) + ".")],
traps: [TR(0, "Calcule vraiment les deux expressions avec a = " + a + " et b = " + b + " : elles ne donnent pas la même valeur."), TR(-d, "On calcule la première moins la deuxième.")] }); },
() => { const v = LT(), a = R.int(3, 8), b = R.int(2, 5), c = R.int(1, a - 1);
return QC("Laquelle de ces expressions est égale à " + M(a + v + " + " + b + v + " \\cdot " + v + " - " + mono(c, v)) + " ?",
[["\\(" + b + v + "^2 + " + mono(a - c, v) + "\\)", ""], ["\\(" + mono(a + b - c, v) + "^2\\)", "On ne peut pas additionner des " + v + " et des " + v + "² : ce ne sont pas des termes semblables."], ["\\(" + b + v + "^2 + " + mono(a + c, v) + "\\)", "Attention au signe : on soustrait " + mono(c, v) + "."], ["\\(" + mono(a + 2 * b - c, v) + "\\)", v + " · " + v + " = " + v + "², pas 2" + v + "."]],
M(b + v + " \\cdot " + v + " = " + b + v + "^2") + " ; on regroupe les termes en " + M(v) + " : " + M(a + v + " - " + mono(c, v) + " = " + mono(a - c, v)) + ". Résultat : " + M(b + v + "^2 + " + mono(a - c, v)) + ".",
{ ctx: "equiv-reduire", guide: [GR("Coefficient de " + M(v) + " après regroupement ?", a - c, M(a + " - " + c + " = " + (a - c)) + ".")] }); },
],
3: [
() => { const v = LT(), k = R.int(2, 5), m = R.int(1, 6), A = k - 1, B = k * m;
const ok = [mono(A, v) + " + " + B, B + " + " + mono(A, v), mono(k, v) + " + " + B + " - " + v, mono(A, v) + " + " + (B - 1) + " + 1"], ko = [mono(A, v) + " + " + m, mono(k, v) + " + " + m + " - " + v, mono(k + 1, v) + " + " + B, mono(A, v) + " - " + B];
const nOk = R.int(2, 3), L = shuf(shuf(ok).slice(0, nOk).concat(shuf(ko).slice(0, 5 - nOk)));
return QN("Combien de ces expressions sont égales à " + M(k + "(" + v + " + " + m + ") - " + v) + " pour toutes les valeurs de " + M(v) + " ? " + L.map((e) => M(e)).join(" ; "), nOk,
M(k + "(" + v + " + " + m + ") - " + v + " = " + mono(k, v) + " + " + B + " - " + v + " = " + mono(A, v) + " + " + B) + ". Les expressions équivalentes sont celles qui se réduisent à " + M(mono(A, v) + " + " + B) + " : " + L.filter((e) => ok.includes(e)).map((e) => M(e)).join(", ") + ", soit " + M(nOk) + " expressions.",
{ ctx: "compte-equiv", guide: [GR("Forme réduite de " + M(k + "(" + v + " + " + m + ") - " + v) + " : coefficient de " + M(v) + " ?", A, M(k + " - 1 = " + A) + "."), GR("Terme constant ?", B, M(k + " \\cdot " + m + " = " + B) + "."), GR("Combien d'expressions équivalentes ?", nOk, M(nOk) + ".")],
traps: [TR(5 - nOk, "Tu as compté celles qui ne sont pas équivalentes."), TR(L.filter((e) => ok.includes(e) || e.includes(mono(A, v))).length, "Il faut aussi que le terme constant soit " + B + " (" + k + " multiplie " + m + ").")] }); },
() => { const v = LT(), p = R.int(2, 6), q = nz(-5, 5), r = nz(-6, 9), x = nz(-5, 6); const s = p * x + p * q - r * x; if (r === p || !s) return null;
return QN("Les expressions " + M("A = " + p + "(" + v + sg(q) + ")") + " et " + M("B = " + mono(r, v) + sg(s)) + " ne sont pas équivalentes. Pour quelle valeur de " + M(v) + " prennent-elles pourtant la même valeur ?", x,
M(p + v + sg(p * q) + " = " + mono(r, v) + sg(s)) + " donne " + M(mono(p - r, v) + " = " + (s - p * q)) + ", donc " + M(v + " = " + x) + ". Vérification : " + M("A = B = " + (p * (x + q))) + ".",
{ ctx: "meme-valeur", guide: [GR("Développe " + M("A") + " : terme constant ?", p * q, M(p + " \\cdot " + q + " = " + p * q) + "."), GR("Équation " + M(mono(p - r, v) + " = " + (s - p * q)) + " : " + M(v) + " ?", x, M(v + " = " + x) + ".")],
traps: [TR(r6((s - q) / (p - r)), "Développe d'abord A : " + p + " multiplie aussi " + q + "."), TR(-x, "Attention aux signes en isolant " + v + ".")] }); },
() => { const v = LT(), a = nz(-6, 7), b = nz(-6, 7); if (a === b || a === -b) return null;
const s = a + b, p = a * b;
const good = v + "^2" + (s ? (s === 1 ? " + " + v : s === -1 ? " - " + v : sg(s) + v) : "") + sg(p);
const f1 = v + "^2" + sg(p), f2 = v + "^2" + (p === 1 ? " + " + v : p === -1 ? " - " + v : sg(p) + v) + sg(s), f3 = "2" + v + sg(s);
if (!s || s === p) return null;
return QC("Laquelle de ces expressions est égale à " + M("(" + v + sg(a) + ")(" + v + sg(b) + ")") + " ?", [["\\(" + good + "\\)", ""], ["\\(" + f1 + "\\)", "Il manque les produits croisés : " + v + " · (" + b + ") et (" + a + ") · " + v + "."], ["\\(" + f2 + "\\)", "Le terme en " + v + " vient de " + a + " + " + b + ", et le terme constant de " + a + " · " + b + "."], ["\\(" + f3 + "\\)", v + " · " + v + " = " + v + "², pas 2" + v + "."]],
"Chaque terme de la première parenthèse multiplie chaque terme de la deuxième : " + M(v + "^2 + " + b + v + " + " + a + v + sg(p).replace("+ -", "- ") + " = " + good) + ".",
{ ctx: "equiv-double", guide: [GR("Terme constant : " + M("(" + a + ") \\cdot (" + b + ")") + " ?", p, M(p) + "."), GR("Coefficient de " + M(v) + " : " + M(a + " + (" + b + ")") + " ?", s, M(s) + ".")] }); },
],
};
const LCP = [
() => { const k = R.int(3, 6), m = R.int(2, 6), v = R.int(3, 7), A = k * (v + m) - v;
return P("On compare " + M("A = " + k + "(x + " + m + ") - x") + " et " + M("B = " + (k - 1 === 1 ? "" : k - 1) + "x + " + k * m) + ".", [["a) Valeur de A pour x = " + v, A], ["b) Valeur de B pour x = " + v, A], ["c) Coefficient de x dans A réduite", k - 1]],
["Remplace x par " + v + ", parenthèse d'abord.", "A = " + k + "x + " + k * m + " − x."], "a) " + M(k + " \\cdot " + (v + m) + " - " + v + " = " + A) + " ; b) " + M((k - 1) * v + " + " + k * m + " = " + A) + " ; c) " + M("A = " + (k - 1 === 1 ? "" : k - 1) + "x + " + k * m + " = B") + " : les expressions sont équivalentes."); },
];


reg([
{ id: "isom", theme: "es", label: "Reconnaître une isométrie", ex: "\\text{retournée} \\to \\text{symétrie axiale}", CH: [9], lv: IS, probs: ISP,
hint: "Retournée comme dans un miroir : symétrie axiale. Demi-tour : symétrie centrale. Quart de tour : rotation. Simple glissement : translation.",
lesson: ["Reconnaître une isométrie", "Une isométrie déplace une figure sans la déformer : longueurs, angles et aires sont conservés.",
"Translation : la figure glisse, sans tourner ni se retourner. Symétrie axiale : la figure est retournée, comme dans un miroir ; l'axe est à mi-chemin entre un point et son image. Symétrie centrale : la figure fait un demi-tour autour du centre, qui est le milieu de chaque segment [AA']. Rotation : la figure tourne autour d'un centre (par exemple d'un quart de tour). Deux isométries à la suite donnent encore une isométrie : deux symétries d'axes parallèles donnent une translation, deux symétries d'axes perpendiculaires une symétrie centrale.",
["\\(A(1 \\,;\\, 2)\\) et \\(A'(5 \\,;\\, 2)\\) symétriques : l'axe est \\(x = 3\\).", "Symétrie d'axe \\(x = 3\\), puis d'axe \\(x = 7\\) : translation de \\(2 \\cdot 4 = 8\\) unités vers la droite."],
"Pour savoir si la figure est retournée, suis ses sommets dans le même ordre sur F et sur F' : le sens de rotation change seulement avec une symétrie axiale."],
comps: ["Reconnaître translation, symétries axiale et centrale", "Trouver l'axe ou le centre ; reconnaître une rotation", "Enchaîner deux isométries"],
act: { retiens: { regle: "Retournée : symétrie axiale. Demi-tour : symétrie centrale. Quart de tour : rotation. Glissement : translation. Toutes conservent longueurs et angles.", exemple: ["\\(A(1 \\,;\\, 2) \\to A'(5 \\,;\\, 2)\\) par une symétrie axiale : axe \\(x = 3\\).", "Deux symétries d'axes \\(x = 3\\) et \\(x = 7\\) : translation de 8 vers la droite."], piege: "Une symétrie centrale ne retourne pas la figure : elle la fait tourner d'un demi-tour." },
predict: { q: "Dans un miroir, ta main droite devient…", choices: ["une main gauche", "une main droite", "une main à l'envers"], good: 0, why: "Le miroir retourne la figure : c'est une symétrie axiale. Une translation ou une rotation ne transforme jamais une main droite en main gauche." },
defis: ["Le point \\(A(2 \\,;\\, 5)\\) a pour image \\(A'\\) par la symétrie d'axe vertical \\(x = 4\\). Tape l'abscisse de \\(A'\\).", "On applique ensuite à \\(A'\\) la symétrie d'axe \\(x = 9\\). Tape l'abscisse de l'image finale."],
play: toi(["A est à 2 unités de l'axe x = 4 : son image est à 2 unités de l'autre côté.", "A' est en x = 6 : elle est à 3 unités de l'axe x = 9."], [W(6, "4 + 2 = 6 : A'(6 ; 5)."), W(12, "9 + 3 = 12 : le point a glissé de 10 = 2 · (9 − 4) unités, une translation.")]) } },
{ id: "ensco", theme: "no", label: "Ensembles de nombres", ex: "\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}", CH: [9], lv: EN, probs: ENP,
hint: "Simplifie d'abord le nombre. ℕ : entiers positifs ; ℤ : entiers (aussi négatifs) ; ℚ : quotients d'entiers (fractions, décimaux, périodiques) ; ℝ : aussi les irrationnels (√2, π).",
lesson: ["Ensembles de nombres", "Chaque nouvel ensemble contient le précédent : ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ.",
"\\(\\mathbb{N}\\) : les entiers naturels 0, 1, 2, 3… \\(\\mathbb{Z}\\) : les entiers relatifs, positifs ou négatifs. \\(\\mathbb{Q}\\) : les rationnels, quotients de deux entiers ; leur écriture décimale s'arrête (nombres décimaux) ou se répète (périodique). \\(\\mathbb{R}\\) : les réels ; ils contiennent aussi les irrationnels, comme \\(\\sqrt{2}\\) ou \\(\\pi\\), dont les décimales ne s'arrêtent pas et ne se répètent pas. Avant de classer un nombre, on le simplifie : \\(\\frac{12}{4} = 3\\) est un entier naturel.",
["\\(-\\frac{18}{6} = -3\\) : plus petit ensemble \\(\\mathbb{Z}\\).", "\\(\\frac{2}{3} = 0{,}666\\ldots\\) : dans \\(\\mathbb{Q}\\), mais ce n'est pas un nombre décimal."],
"Une fraction peut être un entier : \\(\\frac{12}{4} = 3\\)."],
comps: ["Classer un nombre dans ℕ, ℤ, ℚ", "Décimaux, fractions, appartenance", "Périodes et irrationnels"],
act: { retiens: { regle: "\\(\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}\\) : un entier naturel est aussi relatif, rationnel et réel. On simplifie avant de classer.", exemple: ["\\(\\frac{12}{4} = 3 \\in \\mathbb{N}\\).", "\\(\\frac{5}{11} = 0{,}4545\\ldots\\) : période 45, rationnel."], piege: "\\(\\frac{1}{3}\\) est rationnel, mais ce n'est pas un nombre décimal." },
predict: { q: "\\(\\frac{12}{4}\\) est-il un entier ?", choices: ["oui, il vaut 3", "non, c'est une fraction", "seulement s'il est négatif"], good: 0, why: "12 ÷ 4 = 3 : écrit sous forme de fraction, c'est quand même un entier naturel." },
defis: ["Parmi \\(-7\\) ; \\(\\frac{12}{4}\\) ; \\(2{,}5\\) ; \\(0\\) ; \\(-\\frac{9}{3}\\) ; \\(\\frac{2}{3}\\), tape combien sont dans \\(\\mathbb{Z}\\).", "\\(\\frac{5}{11} = 0{,}4545\\ldots\\) Tape la période (les chiffres qui se répètent)."],
play: toi(["Simplifie : 12/4 = 3 et −9/3 = −3. Compte aussi 0 et −7.", "5 ÷ 11 = 0,454545… : quel groupe de chiffres revient ?"], [W(4, "−7, 3, 0 et −3 : quatre entiers relatifs."), W(45, "0,454545… : la période est 45.")]) } },
{ id: "numer", theme: "no", label: "Systèmes de numération", ex: "\\text{MCMXCIV} = 1994", CH: [9], lv: NU, probs: NUP,
hint: "Base 10 : chaque chiffre vaut selon sa position. Romain : on additionne, sauf un symbole placé avant un plus grand (IV = 4). Binaire : positions 1, 2, 4, 8, 16…",
lesson: ["Systèmes de numération", "Notre système est positionnel, en base 10 : un chiffre vaut selon sa place.",
"Base 10 : \\(2'053 = 2 \\cdot 1000 + 0 \\cdot 100 + 5 \\cdot 10 + 3\\) ; le 0 marque une position vide. Égypte : on répète des symboles (bâton 1, anse 10, corde 100, fleur de lotus 1000) et on additionne. Rome : M = 1000, D = 500, C = 100, L = 50, X = 10, V = 5, I = 1 ; on additionne, sauf qu'un symbole placé avant un symbole plus grand se soustrait (IV = 4, XC = 90, CM = 900). Binaire (base 2) : seulement 0 et 1, positions 1, 2, 4, 8, 16… Babylone : base 60, comme les heures, minutes et secondes.",
["MCMXII = 1000 + 900 + 10 + 2 = 1912.", "En binaire, 10110 = 16 + 4 + 2 = 22."],
"En romain, l'ordre compte : XI = 11 mais IX = 9."],
comps: ["Lire un nombre égyptien, romain ; positions en base 10", "Romain avec soustraction ; binaire", "Base 60, bits, calculs"],
act: { retiens: { regle: "Base 10 : un chiffre vaut selon sa position. Binaire : positions 1, 2, 4, 8, 16… Romain : on soustrait un symbole placé avant un plus grand.", exemple: ["XLII = 40 + 2 = 42.", "101101 (binaire) = 32 + 8 + 4 + 1 = 45."], piege: "IX = 9, pas 11 : I est avant X, il se soustrait." },
predict: { q: "Dans 333, le premier 3 vaut-il autant que le dernier ?", choices: ["non : 300 et 3", "oui : ce sont deux 3", "ça dépend du calcul"], good: 0, why: "Notre numération est positionnelle : le même chiffre vaut 300, 30 ou 3 selon sa place." },
defis: ["Tape la valeur du nombre romain XLII.", "Tape la valeur du nombre binaire 101101."],
play: toi(["XL : X avant L, on soustrait (50 − 10). Puis II.", "Positions de droite à gauche : 1, 2, 4, 8, 16, 32."], [W(42, "XL = 40, II = 2 : 42."), W(45, "32 + 8 + 4 + 1 = 45.")]) } },
{ id: "fctlec", theme: "fa", label: "Lire un graphique, reconnaître une fonction", ex: "\\text{droite par l'origine} \\to \\text{proportionnalité}", CH: [9], lv: FL, probs: FLP,
hint: "Le temps se lit sur l'axe horizontal, la valeur sur l'axe vertical. Proportionnel : droite qui passe par l'origine (y ÷ x constant). Affine : droite qui ne passe pas par l'origine.",
lesson: ["Lire un graphique, reconnaître une fonction", "Un graphique montre comment une grandeur varie en fonction d'une autre.",
"On lit une valeur en partant de l'axe horizontal (la variable, souvent le temps), on monte jusqu'au graphique, puis on lit sur l'axe vertical. Le graphique monte : la grandeur augmente ; il descend : elle diminue ; il est horizontal : elle reste constante. Une situation est proportionnelle si y ÷ x est toujours le même (graphique : droite qui passe par l'origine). Elle est affine si y augmente toujours de la même quantité quand x augmente de 1, avec une valeur de départ (graphique : droite qui ne passe pas par l'origine). Sinon, ce n'est ni l'un ni l'autre.",
["Taxi : 6 CHF + 3 CHF par km : affine (6 CHF à 0 km).", "Croissants à 1,20 CHF : proportionnel (0 croissant, 0 CHF)."],
"Une augmentation régulière ne suffit pas pour la proportionnalité : il faut aussi que la grandeur soit nulle au départ."],
comps: ["Lire une valeur, un maximum, une durée", "Reconnaître une situation de proportionnalité ; lire une variation", "Reconnaître sur un graphique ; augmentation moyenne"],
act: { retiens: { regle: "Axe horizontal : la variable (souvent le temps). Axe vertical : la valeur. Proportionnel : droite par l'origine ; affine : droite qui ne passe pas par l'origine.", exemple: ["Taxi 6 CHF + 2,50 CHF par km : 4 km coûtent 16 CHF.", "Doubler la distance ne double pas le prix : ce n'est pas proportionnel."], piege: "Lire à l'envers : on part de l'axe horizontal, puis on lit la valeur sur l'axe vertical." },
predict: { q: "Un taxi coûte 6 CHF plus 2,50 CHF par km. Le prix de 8 km est-il le double de celui de 4 km ?", choices: ["non", "oui", "on ne peut pas savoir"], good: 0, why: "4 km : 16 CHF ; 8 km : 26 CHF. La prise en charge de 6 CHF n'est payée qu'une fois : ce n'est pas proportionnel." },
defis: ["Un taxi facture 6 CHF de prise en charge plus 2,50 CHF par km. Tape le prix (en CHF) d'une course de 4 km.", "Tape le prix d'une course de 8 km."],
play: toi(["2,50 · 4, puis ajoute la prise en charge.", "2,50 · 8 + 6."], [W(16, "2,50 · 4 + 6 = 16 CHF."), W(26, "2,50 · 8 + 6 = 26 CHF : pas le double de 16, ce n'est pas proportionnel.")]) } },
{ id: "litconv", theme: "fa", label: "Écriture algébrique et expressions équivalentes", ex: "3x^2 = 3 \\cdot x \\cdot x", CH: [10], lv: LC, probs: LCP,
hint: "3x² = 3 · x · x (le carré ne porte que sur x) ; −x² = −(x²). Deux expressions sont équivalentes si elles se réduisent à la même forme ; une seule valeur qui donne deux résultats différents suffit à montrer qu'elles ne le sont pas.",
lesson: ["Écriture algébrique, expressions équivalentes", "Les conventions d'écriture disent exactement quel calcul une expression représente.",
"On n'écrit pas le signe · devant une lettre ou une parenthèse : \\(3x = 3 \\cdot x\\), \\(2(x + 1) = 2 \\cdot (x + 1)\\). Un exposant ne porte que sur ce qui le précède immédiatement : \\(3x^2 = 3 \\cdot x \\cdot x\\), alors que \\((3x)^2 = 9x^2\\) ; \\(-x^2 = -(x^2)\\). Priorités : parenthèses, puissances, multiplications, additions. Deux expressions sont équivalentes si elles donnent la même valeur pour toutes les valeurs de la lettre : on le montre en développant et en réduisant. Pour montrer qu'elles ne le sont pas, une seule valeur suffit (un contre-exemple).",
["\\(3x^2\\) pour \\(x = 4\\) : \\(3 \\cdot 16 = 48\\) (et non \\(12^2 = 144\\)).", "\\((a + b)^2\\) et \\(a^2 + b^2\\) avec \\(a = 2\\), \\(b = 3\\) : 25 et 13, pas équivalentes."],
"\\(-x^2\\) est toujours négatif (ou nul) : pour \\(x = -3\\), \\(-x^2 = -9\\)."],
comps: ["Appliquer les conventions d'écriture", "Reconnaître une expression équivalente ; contre-exemple", "Comparer plusieurs expressions"],
act: { retiens: { regle: "\\(3x^2 = 3 \\cdot x \\cdot x\\) ; \\(-x^2 = -(x^2)\\). Équivalentes : même forme réduite. Un contre-exemple suffit pour dire « pas équivalentes ».", exemple: ["\\(3x^2\\) pour \\(x = 4\\) : 48.", "\\((2 + 3)^2 = 25\\), mais \\(2^2 + 3^2 = 13\\)."], piege: "\\((a + b)^2\\) n'est pas égal à \\(a^2 + b^2\\)." },
predict: { q: "Pour \\(x = 4\\), que vaut \\(3x^2\\) ?", choices: ["48", "144", "24"], good: 0, why: "Le carré ne porte que sur x : 3 · 4² = 3 · 16 = 48. (3 · 4)² = 144 serait \\((3x)^2\\)." },
defis: ["Tape la valeur de \\(3x^2\\) pour \\(x = 4\\).", "Tape \\((a + b)^2 - (a^2 + b^2)\\) pour \\(a = 2\\) et \\(b = 3\\)."],
play: toi(["D'abord 4², puis multiplie par 3.", "(2 + 3)² = 25 ; 2² + 3² = 13."], [W(48, "3 · 16 = 48."), W(12, "25 − 13 = 12 = 2 · 2 · 3 : les deux expressions ne sont pas équivalentes.")]) } },
]);

const AG = { isom: [10, 11], ensco: [10, 11], numer: [10, 11], fctlec: [10, 11], litconv: [11] };
for (const n of NOTIONS) if (AG[n.id]) n.again = AG[n.id];
if (typeof ORDRE !== "undefined" && ORDRE.CO) Object.assign(ORDRE.CO, { numer: 0.5, ensco: 36.5, isom: 44.5, fctlec: 45.5, litconv: 61.5 });
if (typeof ORDRE_THEME !== "undefined" && ORDRE_THEME.CO_BY) Object.assign(ORDRE_THEME.CO_BY, {
isom: { 9: "9C11", 10: "10C13", 11: "11C11" }, ensco: { 9: "9C08", 10: "10C06", 11: "11C01" }, numer: { 9: "9C01", 10: "10C01", 11: "11C01" },
fctlec: { 9: "9C12", 10: "10C11", 11: "11C10" }, litconv: { 10: "10C07", 11: "11C05" } });



const HO = {
1: [
() => { const k = pk([2, 3, 0.5, 1.5]), A = [nz(-4, 4), nz(-3, 3)].map((v) => (k === 0.5 || k === 1.5 ? 2 * v : v)), A2 = A.map((v) => r6(k * v));
if (Math.abs(A2[0]) > 9 || Math.abs(A2[1]) > 8) return null;
return QP("L'homothétie de centre " + M("O(0 \\,;\\, 0)") + " et de rapport " + nT(k) + " envoie le point " + XYn("A", A) + " sur " + M("A'") + ". Quelles sont les coordonnées de " + M("A'") + " ? Réponds « x ; y ».", A2,
"Centre à l'origine : on multiplie les deux coordonnées par le rapport, " + XYn("A'", A2) + ".",
{ ctx: "hom-image", fig: plotPts([[0, 0, "O"], [A[0], A[1], "A"]]),
guide: [GR("Abscisse de " + M("A'") + " : " + M(fT(k) + " \\cdot " + fT(A[0])) + " ?", A2[0], M(fT(A2[0])) + "."), GP(M("A'") + " ?", A2, XY(A2) + ".")],
traps: [TP(A.map((v) => r6(v + k)), "On multiplie les coordonnées par le rapport, on ne l'ajoute pas."), TP(A.map((v) => r6(v / k)), "Rapport " + dS(k) + " : on multiplie par " + dS(k) + "."), TP([A2[0], A[1]], "Les deux coordonnées sont multipliées.")] }); },
() => { const d = R.int(2, 9), k = pk([2, 2.5, 3, 1.5, 0.5, 4]), v = r6(k * d);
return QN("Une homothétie de centre " + M("O") + " et de rapport " + nT(k) + " envoie le point " + M("A") + " sur " + M("A'") + ". On sait que " + M("OA = " + d) + " cm. Combien mesure " + M("OA'") + " (en cm) ?", v,
M("OA' = " + fT(k) + " \\cdot OA = " + fT(k) + " \\cdot " + d + " = " + fT(v)) + " cm ; " + M("A'") + " est sur la demi-droite " + M("[OA)") + ".",
{ ctx: "hom-OA", guide: [GR(M("OA' = k \\cdot OA") + " = ?", v, M(fT(v)) + " cm.")], traps: [TR(d + k, "Les distances au centre sont multipliées par le rapport."), TR(r6(d / k), "On multiplie par " + dS(k) + ", on ne divise pas."), TR(r6(v - d), "C'est la distance AA' ; on demande OA'.")] }); },
() => { const d = R.int(2, 8), k = pk([2, 2.5, 3, 1.5, 4, 0.5]), D = r6(k * d);
return QN("Les points " + M("O") + ", " + M("A") + " et " + M("A'") + " sont alignés, " + M("A'") + " du même côté de " + M("O") + " que " + M("A") + ". " + M("OA = " + d) + " cm et " + M("OA' = " + fT(D)) + " cm. Quel est le rapport de l'homothétie de centre " + M("O") + " qui envoie " + M("A") + " sur " + M("A'") + " ?", k,
M("k = \\frac{OA'}{OA} = \\frac{" + fT(D) + "}{" + d + "} = " + fT(k)) + " (positif : " + M("A'") + " est du même côté que " + M("A") + ").",
{ ctx: "hom-k", guide: [GR(M("k = OA' \\div OA") + " ?", k, M(fT(k)) + ".")], traps: [TR(r6(1 / k), "Le rapport, c'est OA' ÷ OA (image ÷ départ)."), TR(r6(D - d), "C'est une différence de longueurs ; le rapport est un quotient.")] }); },
],
2: [
() => { const k = pk([-2, -3, -0.5, -1.5]), A = [nz(-4, 4), nz(-3, 3)].map((v) => (k === -0.5 || k === -1.5 ? 2 * v : v)), A2 = A.map((v) => r6(k * v));
if (Math.abs(A2[0]) > 9 || Math.abs(A2[1]) > 8) return null;
return QP("L'homothétie de centre " + M("O(0 \\,;\\, 0)") + " et de rapport " + nT(k) + " envoie " + XYn("A", A) + " sur " + M("A'") + ". Coordonnées de " + M("A'") + " ? Réponds « x ; y ».", A2,
"On multiplie les coordonnées par " + nT(k) + " : " + XYn("A'", A2) + ". Rapport négatif : " + M("A'") + " est de l'autre côté de " + M("O") + ".",
{ ctx: "hom-neg", fig: plotPts([[0, 0, "O"], [A[0], A[1], "A"]]),
guide: [GR("Abscisse de " + M("A'") + " : " + M(fT(k) + " \\cdot " + fT(A[0])) + " ?", A2[0], M(fT(A2[0])) + "."), GP(M("A'") + " ?", A2, XY(A2) + ".")],
traps: [TP(A.map((v) => r6(-k * v)), "Le rapport est négatif : A' est de l'autre côté de O, les signes changent."), TP(A.map((v) => -v), "Ça, c'est la symétrie de centre O (rapport −1) ; ici le rapport est " + dS(k) + ".")] }); },
() => { const C = [nz(-3, 3), nz(-3, 3)], k = pk([2, 3, -2]), A = [C[0] + nz(-2, 2), C[1] + nz(-2, 2)], A2 = [C[0] + k * (A[0] - C[0]), C[1] + k * (A[1] - C[1])];
if (Math.abs(A2[0]) > 9 || Math.abs(A2[1]) > 8) return null;
return QP("L'homothétie de centre " + XYn("C", C) + " et de rapport " + nT(k) + " envoie " + XYn("A", A) + " sur " + M("A'") + ". Coordonnées de " + M("A'") + " ? Réponds « x ; y ».", A2,
"De " + M("C") + " à " + M("A") + " : " + M("(" + (A[0] - C[0]) + " \\,;\\, " + (A[1] - C[1]) + ")") + ". On multiplie ce déplacement par " + nT(k) + " : " + M("(" + k * (A[0] - C[0]) + " \\,;\\, " + k * (A[1] - C[1]) + ")") + ", et on part de " + M("C") + " : " + XYn("A'", A2) + ".",
{ ctx: "hom-centre", fig: plotPts([[C[0], C[1], "C"], [A[0], A[1], "A"]]),
guide: [GP("Déplacement de " + M("C") + " à " + M("A") + " ?", [A[0] - C[0], A[1] - C[1]], M("(" + (A[0] - C[0]) + " \\,;\\, " + (A[1] - C[1]) + ")") + "."), GP("Multiplié par " + nT(k) + " ?", [k * (A[0] - C[0]), k * (A[1] - C[1])], M("(" + k * (A[0] - C[0]) + " \\,;\\, " + k * (A[1] - C[1]) + ")") + "."), GP(M("A'") + " (on part de " + M("C") + ") ?", A2, XY(A2) + ".")],
traps: [TP([k * A[0], k * A[1]], "Le centre n'est pas l'origine : on multiplie le déplacement de C à A, pas les coordonnées de A."), TP([k * (A[0] - C[0]), k * (A[1] - C[1])], "N'oublie pas de partir du centre C : ajoute ses coordonnées.")] }); },
() => { const L = R.int(2, 9), k = pk([-1.5, -2, -3, 2.5, -0.5, 1.5]), v = r6(Math.abs(k) * L); if (k === -0.5 && L % 2) return null;
return QN("Une homothétie de rapport " + nT(k) + " envoie le segment " + M("[AB]") + " sur " + M("[A'B']") + ". On sait que " + M("AB = " + L) + " cm. Combien mesure " + M("A'B'") + " (en cm) ?", v,
"Les longueurs sont multipliées par " + M("|k| = " + fT(Math.abs(k))) + " (une longueur est positive) : " + M("A'B' = " + fT(Math.abs(k)) + " \\cdot " + L + " = " + fT(v)) + " cm.",
{ ctx: "hom-longueur", guide: [GR("Facteur des longueurs " + M("|k|") + " ?", Math.abs(k), M(fT(Math.abs(k))) + "."), GR(M("A'B'") + " ?", v, M(fT(v)) + " cm.")], traps: [TR(r6(k * L), "Une longueur n'est jamais négative : on multiplie par |k| = " + dS(Math.abs(k)) + "."), TR(r6(L / Math.abs(k)), "On multiplie par |k|, on ne divise pas."), TR(r6(k * k * L), "k², c'est pour les aires.")] }); },
],
3: [
() => { const d = R.int(2, 8), k = pk([-1.5, -2, -2.5, -3, -0.5]), D = r6(-k * d);
return QN("Les points " + M("A") + ", " + M("O") + " et " + M("A'") + " sont alignés et " + M("O") + " est entre " + M("A") + " et " + M("A'") + ". " + M("OA = " + d) + " cm et " + M("OA' = " + fT(D)) + " cm. Quel est le rapport de l'homothétie de centre " + M("O") + " qui envoie " + M("A") + " sur " + M("A'") + " ?", k,
M("\\frac{OA'}{OA} = \\frac{" + fT(D) + "}{" + d + "} = " + fT(-k)) + " ; " + M("A'") + " est de l'autre côté de " + M("O") + " : le rapport est négatif, " + M("k = " + fT(k)) + ".",
{ ctx: "hom-kneg", guide: [GR(M("OA' \\div OA") + " ?", -k, M(fT(-k)) + "."), GR("Signe : " + M("A'") + " est de l'autre côté de " + M("O") + ". Rapport ?", k, M(fT(k)) + ".")], traps: [TR(-k, "O est entre A et A' : A' est de l'autre côté du centre, le rapport est négatif."), TR(r6(1 / k), "Le rapport, c'est OA' ÷ OA (image ÷ départ), avec un signe −."), TR(r6(d + D), "C'est la distance AA' ; on demande le rapport.")] }); },
() => { const O = [nz(-3, 3), nz(-3, 3)], k = pk([2, 3, -2]), A = [O[0] + nz(-2, 2), O[1] + nz(-2, 2)], A2 = [O[0] + k * (A[0] - O[0]), O[1] + k * (A[1] - O[1])];
if (Math.abs(A2[0]) > 9 || Math.abs(A2[1]) > 8) return null;
return QP("Une homothétie de rapport " + nT(k) + " envoie " + XYn("A", A) + " sur " + XYn("A'", A2) + ". Quelles sont les coordonnées de son centre ? Réponds « x ; y ».", O,
"Le centre " + M("O(x \\,;\\, y)") + " vérifie " + M(fT(A2[0]) + " - x = " + fT(k) + " \\cdot (" + fT(A[0]) + " - x)") + ", d'où " + M("x = " + O[0]) + " ; de même " + M("y = " + O[1]) + ". Centre " + XYn("O", O) + ".",
{ ctx: "hom-trouve-centre", fig: plotPts([[A[0], A[1], "A"], [A2[0], A2[1], "A'"]]),
guide: [GR("Abscisse du centre : résous " + M(fT(A2[0]) + " - x = " + fT(k) + " (" + fT(A[0]) + " - x)") + ".", O[0], M("x = " + O[0]) + "."), GR("Ordonnée du centre ?", O[1], M("y = " + O[1]) + "."), GP("Centre ?", O, XY(O) + ".")],
traps: [TP([(A[0] + A2[0]) / 2, (A[1] + A2[1]) / 2], "Le milieu de [AA'] n'est le centre que pour un rapport −1 (symétrie centrale)."), TP([A2[0] - k * A[0], A2[1] - k * A[1]], "Il reste à diviser par 1 − k = " + (1 - k) + ".")] }); },
() => { const A = R.int(3, 20), k = pk([-2, -3, 1.5, -1.5, -0.5, 2.5]), v = r6(k * k * A);
return QN("Une figure a une aire de " + M(A) + " cm². On lui applique une homothétie de rapport " + nT(k) + ". Quelle est l'aire de l'image (en cm²) ?", v,
"Les longueurs sont multipliées par " + M(fT(Math.abs(k))) + ", les aires par " + M("k^2 = " + fT(k * k)) + " : " + M(A + " \\cdot " + fT(k * k) + " = " + fT(v)) + " cm².",
{ ctx: "hom-aire", guide: [GR(M("k^2") + " ?", r6(k * k), M("(" + fT(k) + ")^2 = " + fT(k * k)) + "."), GR("Aire de l'image ?", v, M(fT(v)) + " cm².")], traps: [TR(r6(k * A), "Une aire est multipliée par k², et elle n'est jamais négative."), TR(r6(Math.abs(k) * A), "Les aires sont multipliées par k², pas par |k|."), TR(-v, "Un carré est toujours positif : (" + dS(k) + ")² = " + dS(k * k) + ".")] }); },
],
};

const TRI = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20]];
const SO = {
1: [
() => { const c = pk([["un rectangle tourne autour d'un de ses côtés", 0], ["un triangle rectangle tourne autour d'un des côtés de son angle droit", 1], ["un demi-disque tourne autour de son diamètre", 2]]);
const L = [["un cylindre", "un rectangle qui tourne autour d'un côté"], ["un cône", "un triangle rectangle qui tourne autour d'un côté de l'angle droit"], ["une boule", "un demi-disque qui tourne autour de son diamètre"]];
const opts = [[L[c[1]][0], ""]].concat(L.filter((_, i) => i !== c[1]).map((x) => [x[0], "Ce solide est engendré par " + x[1] + "."])).concat([["une pyramide", "Un solide obtenu en faisant tourner une figure a une section circulaire : ce n'est pas une pyramide."]]);
return QC("Quand " + c[0] + ", il engendre un solide de révolution. Lequel ?", opts, "Chaque point de la figure décrit un cercle autour de l'axe : " + c[0] + " donne " + L[c[1]][0] + ".", { ctx: "revolution", guide: [GR("Le côté qui touche l'axe forme-t-il une pointe (un seul point) ? Tape 1 pour oui, 0 pour non.", c[1] === 1 ? 1 : 0, c[1] === 1 ? "Oui : l'hypoténuse rejoint l'axe en un point, le sommet du cône." : "Non.")] }); },
() => { const r = R.int(2, 9), c = pk([["exactement", "de l'espace", "une sphère", 2], ["au plus", "de l'espace", "une boule", 3], ["exactement", "du plan", "un cercle", 0], ["au plus", "du plan", "un disque", 1]]), loin = (c[0] === "au plus" ? "à une distance d'au plus " : "à exactement ") + M(r) + " cm";
const N = ["un cercle", "un disque", "une sphère", "une boule"], E = ["l'ensemble des points du plan à exactement cette distance", "les points du plan à cette distance ou moins", "l'ensemble des points de l'espace à exactement cette distance (la surface d'un ballon)", "les points de l'espace à cette distance ou moins (le ballon plein)"];
const opts = [[N[c[3]], ""]].concat([0, 1, 2, 3].filter((i) => i !== c[3]).map((i) => [N[i], "Ça, c'est " + E[i] + "."]));
return QC("Comment s'appelle l'ensemble des points " + c[1] + " situés " + loin + " d'un point " + M("O") + " ?", opts, "Dans " + (c[1] === "du plan" ? "le plan" : "l'espace") + ", les points situés " + loin + " de " + M("O") + " forment " + c[2] + " de centre " + M("O") + " et de rayon " + M(r) + " cm.", { ctx: "sphere-boule", guide: [GR("Combien de dimensions : tape 2 pour le plan, 3 pour l'espace.", c[1] === "du plan" ? 2 : 3, c[1] === "du plan" ? "Le plan : 2 dimensions." : "L'espace : 3 dimensions.")] }); },
() => { const a = R.int(2, 9), b = R.int(3, 12); if (2 * a === b || a === b) return null;
return QN("Un triangle rectangle dont les côtés de l'angle droit mesurent " + M(a) + " cm et " + M(b) + " cm tourne autour du côté de " + M(b) + " cm. Il engendre un cône. Quel est le diamètre de la base de ce cône (en cm) ?", 2 * a,
"Le côté de " + M(b) + " cm reste sur l'axe : c'est la hauteur. L'autre côté de l'angle droit balaie la base : rayon " + M(a) + " cm, diamètre " + M("2 \\cdot " + a + " = " + 2 * a) + " cm.",
{ ctx: "revol-diametre", fig: FIG.cone("r = ?", "h = " + b), guide: [GR("Rayon de la base (le côté qui tourne) ?", a, M(a) + " cm."), GR("Diamètre ?", 2 * a, M(2 * a) + " cm.")],
traps: [TR(a, "C'est le rayon ; le diamètre est le double."), TR(2 * b, "Le côté de " + b + " cm est sur l'axe : c'est la hauteur, pas le rayon."), TR(b, "C'est la hauteur du cône.")] }); },
],
2: [
() => { const t = pk(TRI), [r, h] = R.rand() < 0.5 ? [t[0], t[1]] : [t[1], t[0]], g = t[2];
return QN("Un cône de révolution a une hauteur de " + M(h) + " cm et un rayon de base de " + M(r) + " cm. Quelle est la longueur de sa génératrice (du sommet à un point du cercle de base), en cm ?", g,
"La hauteur, le rayon et la génératrice forment un triangle rectangle : " + M("g = \\sqrt{" + h + "^2 + " + r + "^2} = \\sqrt{" + g * g + "} = " + g) + " cm.",
{ ctx: "generatrice", fig: FIG.cone("r = " + r, "h = " + h), guide: [GR(M("g^2 = h^2 + r^2") + " ?", g * g, M(h * h + " + " + r * r + " = " + g * g) + "."), GR(M("g") + " ?", g, M(g) + " cm.")],
traps: [TR(h + r, "Pythagore : on additionne les carrés, puis on prend la racine."), TR(g * g, "C'est g² : prends la racine carrée."), TR(Math.sqrt(Math.abs(h * h - r * r)), "La génératrice est l'hypoténuse : on additionne les carrés."),
TR(r, "C'est le rayon. La génératrice va du sommet au bord de la base : c'est l'hypoténuse du triangle hauteur – rayon – génératrice."), TR(h, "C'est la hauteur. La génératrice va du sommet au bord de la base : c'est l'hypoténuse, plus longue que la hauteur.")] }); },
() => { const t = pk(TRI), [d, rho] = R.rand() < 0.5 ? [t[0], t[1]] : [t[1], t[0]], Rr = t[2], o = Rr <= 6 ? "une orange" : Rr <= 13 ? "un ballon" : "une boule de polystyrène";
return QN("On coupe " + o + " (une boule de rayon " + M(Rr) + " cm) par un plan situé à " + M(d) + " cm de son centre. La section est un disque. Quel est son rayon (en cm) ?", rho,
"Le centre de la boule, le centre de la section et un point du bord forment un triangle rectangle d'hypoténuse " + M(Rr) + " cm : " + M("\\sqrt{" + Rr + "^2 - " + d + "^2} = \\sqrt{" + rho * rho + "} = " + rho) + " cm.",
{ ctx: "section-rayon", guide: [GR("Hypoténuse du triangle rectangle (le rayon de la boule) ?", Rr, M(Rr) + " cm."), GR("Rayon de la section au carré ?", rho * rho, M(Rr * Rr + " - " + d * d + " = " + rho * rho) + "."), GR("Rayon de la section ?", rho, M(rho) + " cm.")],
traps: [TR(Rr - d, "Pythagore : on soustrait les carrés, pas les longueurs."), TR(Math.sqrt(Rr * Rr + d * d), "Le rayon de la boule est l'hypoténuse : on soustrait d² de R²."), TR(rho * rho, "C'est le carré du rayon : prends la racine.")] }); },
() => { const c = pk([["un cylindre de rayon 2 cm et de hauteur 9 cm par un plan qui contient son axe", 1], ["un cône par un plan qui contient son axe", 2], ["une boule par un plan qui la traverse", 0], ["un cône par un plan parallèle à sa base", 0], ["un cylindre par un plan parallèle à ses bases", 0]]);
const N = ["un disque", "un rectangle", "un triangle isocèle", "un trapèze"], E = ["On obtient un disque en coupant une boule, ou un cône ou un cylindre parallèlement à la base.", "On obtient un rectangle en coupant un cylindre par un plan qui contient son axe.", "On obtient un triangle isocèle en coupant un cône par un plan qui contient son axe.", "Aucune de ces coupes ne donne un trapèze."];
const opts = [[N[c[1]], ""]].concat([0, 1, 2, 3].filter((i) => i !== c[1]).map((i) => [N[i], E[i]]));
return QC("On coupe " + c[0] + ". Quelle est la forme de la section ?", opts, E[c[1]], { ctx: "section-forme", guide: [GR("La section contient-elle l'axe du solide ? Tape 1 pour oui, 0 pour non.", /contient son axe/.test(c[0]) ? 1 : 0, /contient son axe/.test(c[0]) ? "Oui." : "Non.")] }); },
],
3: [
() => { const t = pk(TRI), [d, rho] = R.rand() < 0.5 ? [t[0], t[1]] : [t[1], t[0]], Rr = t[2];
return QN("Une boule de rayon " + M(Rr) + " cm est coupée par un plan ; la section est un disque de rayon " + M(rho) + " cm. À quelle distance du centre de la boule se trouve ce plan (en cm) ?", d,
"Triangle rectangle : hypoténuse " + M(Rr) + " (rayon de la boule), côtés " + M(rho) + " et " + M("d") + " : " + M("d = \\sqrt{" + Rr + "^2 - " + rho + "^2} = " + d) + " cm.",
{ ctx: "section-distance", guide: [GR(M("d^2 = R^2 - r^2") + " ?", d * d, M(Rr * Rr + " - " + rho * rho + " = " + d * d) + "."), GR(M("d") + " ?", d, M(d) + " cm.")],
traps: [TR(Rr - rho, "Pythagore : on soustrait les carrés."), TR(d * d, "C'est d² : prends la racine.")] }); },
() => { const t = pk(TRI), [a, b] = R.rand() < 0.5 ? [t[0], t[1]] : [t[1], t[0]], g = t[2], p = 2 * a + 2 * g;
return QN("Un triangle rectangle dont les côtés de l'angle droit mesurent " + M(a) + " cm et " + M(b) + " cm tourne autour du côté de " + M(b) + " cm. On coupe le cône obtenu par un plan qui contient son axe. Quel est le périmètre de la section (en cm) ?", p,
"La section est un triangle isocèle : base = diamètre " + M(2 * a) + " cm, côtés = génératrices " + M("\\sqrt{" + a + "^2 + " + b + "^2} = " + g) + " cm. Périmètre : " + M(2 * a + " + 2 \\cdot " + g + " = " + p) + " cm.",
{ ctx: "coupe-axiale", guide: [GR("Base de la section (diamètre) ?", 2 * a, M(2 * a) + " cm."), GR("Génératrice ?", g, M(g) + " cm."), GR("Périmètre ?", p, M(p) + " cm.")],
traps: [TR(a + b + g, "C'est le périmètre du triangle de départ ; la section est le triangle et son symétrique : base " + 2 * a + " cm."), TR(4 * a + 2 * b, "Les côtés de la section sont les génératrices (" + g + " cm), pas la hauteur.")] }); },
() => { const t = pk(TRI), [r, h] = R.rand() < 0.5 ? [t[0], t[1]] : [t[1], t[0]], g = t[2];
return QN("Un cône de révolution a une génératrice de " + M(g) + " cm et une hauteur de " + M(h) + " cm. Quel est le diamètre de sa base (en cm) ?", 2 * r,
M("r = \\sqrt{" + g + "^2 - " + h + "^2} = \\sqrt{" + r * r + "} = " + r) + " cm, donc le diamètre vaut " + M(2 * r) + " cm.",
{ ctx: "rayon-depuis-g", fig: FIG.cone("r = ?", "h = " + h), guide: [GR(M("r^2 = g^2 - h^2") + " ?", r * r, M(g * g + " - " + h * h + " = " + r * r) + "."), GR(M("r") + " ?", r, M(r) + " cm."), GR("Diamètre ?", 2 * r, M(2 * r) + " cm.")],
traps: [TR(r, "C'est le rayon ; on demande le diamètre."), TR(2 * (g - h), "Pythagore : on soustrait les carrés, pas les longueurs.")] }); },
],
};


const addX = (id, F, part) => { if (typeof VARX === "undefined") return; VARX[id] = VARX[id] || {};
for (const lv of [1, 2, 3]) VARX[id][lv] = (VARX[id][lv] || []).concat([() => (R.rand() < part ? pickForm(F[lv]) : GEN[id](lv))]); };
addX("simil", HO, 0.8);
addX("volcone", SO, 0.7);

window.PERCO = { HO, SO, IS, EN, NU, FL, LC };
})();

