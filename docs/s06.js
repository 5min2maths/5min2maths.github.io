




(function () {
const pk = (a) => a[Math.floor(R.rand() * a.length)];
const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; };
const rnd = (v, k = 10) => +(+v).toFixed(k);

const N = (v) => { v = rnd(v); const s = String(Math.abs(v)).split("."); let i = s[0]; if (i.length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\,"); return (v < 0 ? "-" : "") + i + (s[1] ? "{,}" + s[1] : ""); };
const NP = (v) => (v < 0 ? "(" + N(v) + ")" : N(v));
const den = (v) => { for (let d = 1; d <= 400; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-9) return d; return 0; };

const F = (v) => { const d = den(v); if (d === 1 || !d || [2, 4, 5, 8, 10, 20, 25, 50, 100].includes(d) && d > 1 && String(rnd(v)).length < 7) return N(v); const n = Math.round(v * d); return (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
const sg = (v) => (v < 0 ? " - " + N(-v) : " + " + N(v));
const u = (k) => "u_{" + k + "}";
const X = " \\times ";

const pol = (cs, v = "n") => { let s = ""; const deg = cs.length - 1; cs.forEach((c, i) => { const p = deg - i; if (!c) return; const a = Math.abs(c), m = p === 0 ? N(a) : (a === 1 ? "" : N(a)) + v + (p > 1 ? "^" + p : ""); s += s ? (c < 0 ? " - " : " + ") + m : (c < 0 ? "-" : "") + m; }); return s || "0"; };
const polE = (cs, v = "n") => pol(cs, v).replace(/\{,\}/g, ".").replace(/\\,/g, "").replace(/ /g, "");

const keepT = (spec, traps) => (traps || []).filter((tr) => {
if (!tr) return false;
if (tr.e) { try { return !Expr.equivalent(Expr.parse(tr.e), Expr.parse(spec.expr)); } catch (e) { return false; } }
if (tr.spec && tr.spec.kind === "pair") return tr.spec.values.every(isFinite) && tr.spec.values.some((x, i) => Math.abs(x - spec.values[i]) > 1e-9);
if (tr.spec) { try { return checkAnswer(spec, SolSet.show(tr.spec.ivs, false)).status !== "correct"; } catch (e) { return false; } }
if (tr.s) return tr.s.every(isFinite) && !(tr.s.length === spec.values.length && tr.s.every((x) => spec.values.some((y) => Math.abs(x - y) < 1e-9)));
return isFinite(tr.v) && Math.abs(tr.v - spec.value) > Math.max(1e-9, spec.round ? spec.round : 0);
});
const mk = (q, spec, sol, o) => { const x = { q, spec, sol, guide: o.guide, ctx: o.ctx, traps: keepT(spec, o.traps) }; if (o.fig) x.fig = o.fig; if (o.canon) x.canon = o.canon; if (o.shownOk) x.shownOk = true; return x; };
const QN = (q, value, sol, o) => mk(q, { kind: "value", value }, sol, o);
const QR = (q, value, round, sol, o) => mk(q, { kind: "value", value, round }, sol, o);
const QX = (q, expr, sol, o) => mk(q, { kind: "expr", expr }, sol, Object.assign({ canon: expr }, o));
const QS = (q, ivs, sol, o) => mk(q, solsetSpec(ivs), sol, Object.assign({ canon: SolSet.show(ivs, false) }, o));
const QSet = (q, vals, sol, o) => mk(q, { kind: "set", values: [...new Set(vals)] }, sol, o);
const QP = (q, vals, sol, o) => mk(q, { kind: "pair", values: vals }, sol, Object.assign({ canon: vals.map((v) => String(rnd(v, 6))).join(" ; ") }, o));
const GR = (ask, value, sol, round) => ({ ask, spec: { kind: "value", value, round }, sol });
const GX = (ask, expr, sol) => ({ ask, spec: { kind: "expr", expr }, sol });
const GSS = (ask, ivs, sol) => ({ ask, spec: solsetSpec(ivs), sol });
const GSet = (ask, vals, sol) => ({ ask, spec: { kind: "set", values: [...new Set(vals)] }, sol });
const GP = (ask, vals, sol) => ({ ask, spec: { kind: "pair", values: vals }, sol });
const TR = TRAP;
const TX = (e, m) => ({ e, m });
const TS = (ivs, m) => ({ spec: solsetSpec(ivs), m });
const ivOf = (op, v) => ({ ">": [v, false, Infinity, false], ">=": [v, true, Infinity, false], "<": [-Infinity, false, v, false], "<=": [-Infinity, false, v, true] }[op]);
const OPT = { "<": "<", "<=": "\\leqslant", ">": ">", ">=": "\\geqslant" };
const FLIP = { "<": ">", "<=": ">=", ">": "<", ">=": "<=" };
const C = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return Math.round(r); };


const svg = (w, h, g, label) => '<svg class="fig" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg">' + g + "</svg>";
const T = (x, y, s, o = {}) => '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" class="' + (o.cls || "f-txt") + '" text-anchor="' + (o.a || "middle") + '" font-size="' + (o.fs || 14) + '">' + s + "</text>";
const Ln = (x1, y1, x2, y2, cls = "f-line", w = 1.6) => '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" class="' + cls + '" stroke-width="' + w + '"/>';
const dTxt = (v) => String(rnd(v, 6)).replace(".", ",");

const figSuite = (terms) => {
const W = 320, H = 210, x0 = 40, y0 = 180, lo = Math.min(0, ...terms), hi = Math.max(0, ...terms), span = hi - lo || 1;
const raw = span / 12, mag = 10 ** Math.floor(Math.log10(raw)), step = [1, 2, 5, 10].map((k) => k * mag).find((s) => s >= raw), lab = span / step > 8 ? 2 : 1;
const a = Math.floor(lo / step) * step, b = Math.ceil(hi / step) * step, Y = (v) => y0 - ((v - a) / (b - a)) * 160, Xn = (n) => x0 + 16 + n * ((W - x0 - 30) / Math.max(terms.length - 1, 1));
let g = "";
for (let v = a, i = 0; v <= b + 1e-9; v += step, i++) g += Ln(x0, Y(v), W - 8, Y(v), "f-grid", 1) + (Math.round(v / step) % lab === 0 ? T(x0 - 6, Y(v) + 4, dTxt(rnd(v, 6)), { cls: "f-txt f-tick", a: "end", fs: 12 }) : "");
g += Ln(x0, Y(0), W - 8, Y(0), "f-line", 1.6) + Ln(x0, 12, x0, y0 + 4, "f-line", 1.6);
terms.forEach((t, n) => (g += T(Xn(n), Math.min(H - 4, Y(a) + 18), n, { cls: "f-txt f-tick", fs: 12 }) + '<circle cx="' + Xn(n).toFixed(1) + '" cy="' + Y(t).toFixed(1) + '" r="4.5" class="f-dot"/>'));
g += T(W - 10, Math.min(H - 4, Y(a) + 18), "n", { a: "end", fs: 13 }) + T(x0 + 6, 16, "uₙ", { a: "start", fs: 13 });
return svg(W, H, g, "premiers termes d'une suite");
};

const figTree = (p, A, B, hide = []) => {
const lab = (i, v) => (hide.includes(i) ? "?" : dTxt(v));
const R0 = [20, 110], A1 = [130, 55], A2 = [130, 165], L = [[290, 25], [290, 85], [290, 135], [290, 195]];
let g = Ln(R0[0], R0[1], A1[0] - 14, A1[1]) + Ln(R0[0], R0[1], A2[0] - 14, A2[1]);
g += T(A1[0], A1[1] + 5, A, { fs: 16 }) + T(A2[0], A2[1] + 5, A + "̅", { fs: 16 });
g += T(70, 70, lab(0, p[0]), { cls: "f-accent f-txt", fs: 13 }) + T(70, 160, lab(3, 1 - p[0]), { cls: "f-accent f-txt", fs: 13 });
const kids = [[A1, L[0], B, lab(1, p[1])], [A1, L[1], B + "̅", lab(4, 1 - p[1])], [A2, L[2], B, lab(2, p[2])], [A2, L[3], B + "̅", lab(5, 1 - p[2])]];
kids.forEach(([s, e, nm, l], i) => { g += Ln(s[0] + 14, s[1], e[0] - 14, e[1]) + T(e[0], e[1] + 5, nm, { fs: 16 }) + T((s[0] + e[0]) / 2, (s[1] + e[1]) / 2 + (i % 2 ? 16 : -6), l, { cls: "f-accent f-txt", fs: 13 }); });
return svg(320, 215, g, "arbre pondéré");
};

const figProj = (ab, ah, sameSide) => {
const s = 220 / Math.max(ab, Math.abs(ah) + (sameSide ? 0 : ab)), Ax = sameSide ? 40 : 40 + Math.abs(ah) * s, A = [Ax, 160], B = [Ax + ab * s, 160], H = [Ax + (sameSide ? 1 : -1) * Math.abs(ah) * s, 160], Cc = [H[0], 50];
let g = Ln(Math.min(H[0], A[0]) - 10, 160, B[0] + 10, 160, "f-grid", 1.4) + '<polygon points="' + [A, B, Cc].map((q) => q.map((v) => v.toFixed(1)).join(",")).join(" ") + '" class="f-shape"/>';
g += Ln(Cc[0], Cc[1], H[0], H[1], "f-line", 1.4).replace("/>", ' stroke-dasharray="5 4"/>') + '<path d="M' + (H[0] + 9) + ",160 L" + (H[0] + 9) + ",151 L" + H[0] + ',151" fill="none" class="f-line" stroke-width="1.2"/>';
g += T(A[0] - 4, 180, "A") + T(B[0] + 4, 180, "B") + T(Cc[0], Cc[1] - 8, "C") + T(H[0], 180, "H");
return svg(320, 190, g, "projeté orthogonal");
};
const tab = (xs, ps, hx = "x_i", hp = "P(X = x_i)") => M("\\begin{array}{|c|" + "c|".repeat(xs.length) + "} \\hline " + hx + " & " + xs.map((x) => (typeof x === "string" ? x : N(x))).join(" & ") + " \\\\ \\hline " + hp + " & " + ps.map((x) => (typeof x === "string" ? x : N(x))).join(" & ") + " \\\\ \\hline \\end{array}");
const code = (lines) => '<code style="display:block;white-space:pre;font-size:15px;margin:6px 0;line-height:1.5">' + lines.join("\n") + "</code>";


const SD = {
1: [
() => { const a = pk([1, 2, 3, -1, -2]), b = nz(-6, 6), c = nz(-9, 9), k = R.int(3, 9), v = a * k * k + b * k + c;
return QN("La suite " + M("(u_n)") + " est définie pour tout entier naturel " + M("n") + " par " + M("u_n = " + pol([a, b, c])) + ". Calcule " + M(u(k)) + ".", v,
"On remplace " + M("n") + " par " + M(k) + " : " + M(u(k) + " = " + (a === 1 ? "" : a === -1 ? "-" : N(a) + X) + k + "^2" + (b < 0 ? " - " + N(-b) + X : " + " + N(b) + X) + k + sg(c) + " = " + N(v)) + ".",
{ ctx: "explicite", guide: [GS(M(k + "^2") + " = ?", k * k, M(k * k) + "."), GS(M(u(k)) + " = ?", v, M(N(v)) + ".")],
traps: [TR(a * 2 * k + b * k + c, M(k + "^2") + " vaut " + M(k + X + k) + ", pas " + M("2" + X + k) + "."), TR(a * (k + 1) ** 2 + b * (k + 1) + c, "On remplace n par " + k + " (pas par " + (k + 1) + ")."), TR(a * k * k - b * k + c, "Attention au signe du terme en n.")] }); },
() => { const p = pk([2, 3, -2]), q = nz(-5, 5), a = nz(-3, 5), u1 = p * a + q, u2 = p * u1 + q, u3 = p * u2 + q; if (Math.abs(u3) > 300) return null;
return QN("On définit " + M("u_0 = " + N(a)) + " et, pour tout entier naturel " + M("n") + ", " + M("u_{n+1} = " + N(p) + "u_n" + sg(q)) + ". Calcule " + M("u_3") + ".", u3,
M("u_1 = " + N(p) + X + NP(a) + sg(q) + " = " + N(u1)) + ", " + M("u_2 = " + N(p) + X + NP(u1) + sg(q) + " = " + N(u2)) + ", " + M("u_3 = " + N(p) + X + NP(u2) + sg(q) + " = " + N(u3)) + ".",
{ ctx: "recurrence", guide: [GS(M("u_1") + " = ?", u1, M(N(u1)) + "."), GS(M("u_2") + " = ?", u2, M(N(u2)) + "."), GS(M("u_3") + " = ?", u3, M(N(u3)) + ".")],
traps: [TR(u2, "C'est " + M("u_2") + " : de " + M("u_0") + " à " + M("u_3") + ", il faut trois étapes."), TR(p ** 3 * a + q, "On ajoute " + q + " à chaque étape, pas seulement à la fin."), TR(p * u1 + q * 2, "Applique la relation exactement : " + M(N(p) + "u_n" + sg(q)) + ".")] }); },
() => { const a = nz(-5, 6), b = nz(-7, 7), c = R.int(1, 4), k = R.int(2, 8), v = (a * k + b) / (k + c); if (Number.isInteger(v) || a * k + b === 0) return null;
return QN("Pour tout entier naturel " + M("n") + ", " + M("u_n = \\frac{" + pol([a, b]) + "}{n + " + c + "}") + ". Calcule " + M(u(k)) + " (fraction acceptée).", v,
M(u(k) + " = \\frac{" + N(a) + X + k + sg(b) + "}{" + k + " + " + c + "} = \\frac{" + N(a * k + b) + "}{" + (k + c) + "}" + (den(v) !== k + c ? " = " + F(v) : "")) + ".",
{ ctx: "explicite-quotient", guide: [GS("Numérateur ?", a * k + b, M(N(a * k + b)) + "."), GS("Dénominateur ?", k + c, M(k + c) + "."), GS(M(u(k)) + " = ?", v, M(F(v)) + ".")],
traps: [TR(a * k + b / (k + c), "Tout le numérateur est divisé par " + (k + c) + "."), TR((a * k + b) / k + c, "Le dénominateur est " + M("n + " + c) + " en entier."), TR((a * (k + 1) + b) / (k + 1 + c), "On remplace n par " + k + ".")] }); },
() => { const c = nz(-20, 20), k = R.int(5, 9), v = 2 ** k + c;
return QN("On pose " + M("u_n = 2^n" + sg(c)) + " pour tout entier naturel " + M("n") + ". Calcule " + M(u(k)) + ".", v, M(u(k) + " = 2^{" + k + "}" + sg(c) + " = " + 2 ** k + sg(c) + " = " + N(v)) + ".",
{ ctx: "puissance", guide: [GS(M("2^{" + k + "}") + " = ?", 2 ** k, M(2 ** k) + "."), GS(M(u(k)) + " = ?", v, M(N(v)) + ".")],
traps: [TR(2 * k + c, M("2^{" + k + "}") + " est un produit de " + k + " facteurs 2, pas " + M("2" + X + k) + "."), TR(2 ** (k - 1) + c, M("2^{" + k + "}") + " : " + k + " facteurs.")] }); },
],
2: [
() => { const a = nz(-4, 8), b = nz(-3, 4); let t = a; const us = [a]; for (let n = 0; n < 4; n++) { t = t + 2 * n + b; us.push(t); }
return QN("On définit " + M("u_0 = " + N(a)) + " et " + M("u_{n+1} = u_n + 2n" + sg(b)) + " pour tout entier naturel " + M("n") + ". Calcule " + M("u_4") + ".", us[4],
"Le terme ajouté change à chaque étape : " + M("u_1 = " + N(a) + " + 0" + sg(b) + " = " + N(us[1])) + ", " + M("u_2 = " + N(us[1]) + " + 2" + sg(b) + " = " + N(us[2])) + ", " + M("u_3 = " + N(us[3])) + ", " + M("u_4 = " + N(us[3]) + " + 6" + sg(b) + " = " + N(us[4])) + ".",
{ ctx: "recurrence-n", guide: [GS(M("u_1") + " (avec " + M("n = 0") + ") ?", us[1], M(N(us[1])) + "."), GS(M("u_2") + " (avec " + M("n = 1") + ") ?", us[2], M(N(us[2])) + "."), GS(M("u_3") + " ?", us[3], M(N(us[3])) + "."), GS(M("u_4") + " ?", us[4], M(N(us[4])) + ".")],
traps: [TR(a + 4 * b, "Le terme " + M("2n") + " change à chaque étape (n = 0, 1, 2, 3)."), TR(us[3], "C'est " + M("u_3") + " : encore une étape."), TR(a + 4 * (8 + b), "Avec n = 4 à chaque fois ? Non : n vaut 0, puis 1, 2, 3.")] }); },
() => { const b = nz(-9, 9), c = nz(-9, 9), e = "2n" + (1 + b === 0 ? "" : (1 + b > 0 ? "+" : "") + (1 + b));
return QX("Pour tout entier naturel " + M("n") + ", " + M("u_n = " + pol([1, b, c])) + ". Exprime " + M("u_{n+1} - u_n") + " en fonction de " + M("n") + ".", e,
M("u_{n+1} = (n + 1)^2" + (b < 0 ? " - " + -b : " + " + b) + "(n + 1)" + sg(c) + " = " + pol([1, 2 + b, 1 + b + c])) + " ; " + M("u_{n+1} - u_n = " + pol([2, 1 + b])) + ".",
{ ctx: "difference", guide: [GX(M("u_{n+1}") + " développé et réduit ?", polE([1, 2 + b, 1 + b + c]), M(pol([1, 2 + b, 1 + b + c])) + "."), GX(M("u_{n+1} - u_n") + " = ?", e, M(pol([2, 1 + b])) + ".")],
traps: [TX("2n+" + b, M("(n + 1)^2 = n^2 + 2n + 1") + " : n'oublie pas le 1."), TX("1+" + b, M("(n + 1)^2 \\ne n^2 + 1") + "."), TX("2n+1", "Le terme " + M(N(b) + "n") + " donne aussi " + M(N(b)) + " dans la différence.")] }); },
() => { const ctxs = [["Une association compte", "adhérents", "ne renouvellent pas leur adhésion", "nouveaux adhérents s'inscrivent", "asso", "d'adhérents"], ["Un parc naturel abrite", "cerfs", "quittent le parc ou meurent", "cerfs y sont réintroduits", "cerfs", "de cerfs"], ["Une médiathèque compte", "abonnés", "résilient leur abonnement", "nouveaux abonnés s'inscrivent", "mediatheque", "d'abonnés"]], c = pk(ctxs);
const u0 = pk([400, 600, 800, 1000, 1200, 2000]), p = pk([10, 15, 20, 25, 30]), add = pk([60, 90, 120, 150, 200]), q = 1 - p / 100, u1 = rnd(q * u0 + add), u2 = rnd(q * u1 + add); if (!Number.isInteger(u2)) return null;
return QN(c[0] + " " + M(N(u0)) + " " + c[1] + " cette année. Chaque année, " + M(p + "\\,\\%") + " d'entre eux " + c[2] + " et " + M(add) + " " + c[3] + ". On note " + M("u_n") + " le nombre " + c[5] + " dans " + M("n") + " ans, donc " + M("u_{n+1} = " + N(q) + "u_n + " + add) + ". Calcule " + M("u_2") + ".", u2,
M("u_1 = " + N(q) + X + N(u0) + " + " + add + " = " + N(u1)) + " puis " + M("u_2 = " + N(q) + X + N(u1) + " + " + add + " = " + N(u2)) + ".",
{ ctx: c[4], guide: [GS("Coefficient multiplicateur pour une baisse de " + M(p + "\\,\\%") + " ?", q, M("1 - " + N(p / 100) + " = " + N(q)) + "."), GS(M("u_1") + " = ?", u1, M(N(u1)) + "."), GS(M("u_2") + " = ?", u2, M(N(u2)) + ".")],
traps: [TR(u1, "C'est " + M("u_1") + " : il faut deux années."), TR(rnd((p / 100) * u1 + add), "On garde " + (100 - p) + " % des " + c[1] + " : on multiplie par " + N(q).replace("{,}", ",") + "."), TR(rnd(q * q * u0 + add), "Les " + add + " " + c[1] + " arrivent chaque année.")] }); },
() => { const c = pk([["allumettes", "carrés alignés", "d'allumettes"], ["jetons", "motifs en L", "de jetons"], ["cubes", "escaliers en tranche", "de cubes"]]), a = R.int(3, 9), r = R.int(2, 7), k = R.int(15, 45), v = a + (k - 1) * r;
return QN("On construit des " + c[1] + ". Le motif n° 1 utilise " + M(a) + " " + c[0] + ", le n° 2 en utilise " + M(a + r) + ", le n° 3 en utilise " + M(a + 2 * r) + ", et l'on continue de la même façon. Combien " + c[2] + " pour le motif n° " + M(k) + " ?", v,
"On ajoute " + M(r) + " à chaque motif. Du n° 1 au n° " + k + ", on l'ajoute " + M(k - 1) + " fois : " + M(N(a) + " + " + (k - 1) + X + r + " = " + N(v)) + ".",
{ ctx: "motif", guide: [GS("Combien en ajoute-t-on d'un motif au suivant ?", r, M(r) + "."), GS("Combien de fois l'ajoute-t-on du motif n° 1 au motif n° " + k + " ?", k - 1, M(k - 1) + "."), GS("Nombre " + c[2] + " ?", v, M(N(v)) + ".")],
traps: [TR(a + k * r, "Du motif n° 1 au n° " + k + ", il y a " + (k - 1) + " ajouts, pas " + k + "."), TR(a * k, "On ne multiplie pas le premier motif : on ajoute " + r + " à chaque fois."), TR(r * k, "Le premier motif n'a pas " + r + " " + c[0] + " mais " + a + ".")] }); },
],
3: [
() => { const a = pk([20, 30, 40, 50, 60]), cc = pk([5, 10, 15]), S = pk([500, 800, 1000, 2000]); let t = a, n = 0; while (t < S) { t = 2 * t - cc; n++; }
if (n < 3 || n > 10) return null;
return QN("Que vaut " + M("n") + " à la fin de ce programme Python ?" + code(["u = " + a, "n = 0", "while u < " + S + ":", "    u = 2*u - " + cc, "    n = n + 1"]), n,
"Valeurs successives de u : " + M([a].concat(Array.from({ length: n }, (_, i) => { let w = a; for (let j = 0; j <= i; j++) w = 2 * w - cc; return w; })).map(N).join(" ; ")) + ". La boucle s'arrête dès que " + M("u \\geqslant " + N(S)) + " : " + M("n = " + n) + ".",
{ ctx: "algo-seuil", guide: [GS("Valeur de u après le premier passage dans la boucle ?", 2 * a - cc, M("2" + X + a + " - " + cc + " = " + (2 * a - cc)) + "."), GS("Valeur finale de n ?", n, M(n) + ".")],
traps: [TR(n - 1, "La boucle tourne encore une fois tant que " + M("u < " + N(S)) + "."), TR(n + 1, "On s'arrête dès que u dépasse " + S + " : compte les passages.")] }); },
() => { const b = R.int(5, 16), c = nz(-9, 9), n0 = Math.floor((b - 1) / 2) + 1, e = "2n" + (1 - b < 0 ? "-" + (b - 1) : "+" + (1 - b));
return QN("Pour tout entier naturel " + M("n") + ", " + M("u_n = n^2 - " + b + "n" + sg(c)) + ". À partir de quel rang " + M("n") + " a-t-on " + M("u_{n+1} > u_n") + " ? (donne le plus petit entier)", n0,
M("u_{n+1} - u_n = (n + 1)^2 - " + b + "(n + 1) - n^2 + " + b + "n = " + pol([2, 1 - b])) + ". Il est strictement positif dès que " + M("n > " + F((b - 1) / 2)) + ", soit à partir de " + M("n = " + n0) + " : la suite est croissante à partir de ce rang.",
{ ctx: "sens-variation", guide: [GS(M("u_{n+1} - u_n = 2n + c") + ". Que vaut la constante " + M("c") + " ?", 1 - b, M("u_{n+1} - u_n = " + pol([2, 1 - b])) + "."), GS("Plus petit entier " + M("n") + " qui rend cette différence strictement positive ?", n0, M(n0) + ".")],
traps: [TR(n0 - 1, "Pour n = " + (n0 - 1) + ", la différence vaut " + (2 * (n0 - 1) + 1 - b) + " : pas strictement positive."), TR(Math.ceil(b / 2), "Calcule bien u_{n+1} − u_n = 2n + 1 − " + b + "."), TR(b, "Ce n'est pas le coefficient : résous 2n + 1 − " + b + " > 0.")] }); },
() => { let a, c, b, d; do { a = nz(-6, 9); c = R.int(2, 5); b = nz(-9, 9); d = R.int(1, 9); } while (Math.abs(a) < 2 || a % c === 0 && Math.abs(a / c) < 2); const lim = a / c, v1000 = (1000 * a + b) / (1000 * c + d);
return QN("Pour tout entier naturel " + M("n") + ", " + M("u_n = \\frac{" + pol([a, b]) + "}{" + pol([c, d]) + "}") + ". Calcule " + M("u_{1\\,000}") + " à la calculatrice, puis conjecture la limite de " + M("(u_n)") + " (valeur exacte).", lim,
M("u_{1\\,000} \\approx " + N(rnd(v1000, 4))) + ". Pour " + M("n") + " très grand, " + M(N(b)) + " et " + M(N(d)) + " deviennent négligeables : " + M("u_n \\approx \\frac{" + N(a) + "n}{" + c + "n} = " + F(lim)) + ". On conjecture que " + M("(u_n)") + " tend vers " + M(F(lim)) + ".",
{ ctx: "conjecture-limite", shownOk: true, guide: [GR(M("u_{1\\,000}") + " arrondi au millième ?", rnd(v1000, 6), M("\\approx " + N(rnd(v1000, 3))) + ".", 0.001), GS("Limite conjecturée (valeur exacte) ?", lim, M(F(lim)) + ".")],
traps: [TR(b / d, "Pour n très grand, ce sont les termes en n qui l'emportent."), TR(a, "Le dénominateur aussi grandit : " + c + "n."), TR(rnd(v1000, 3), "On demande la limite exacte : " + F(lim).replace(/\\frac\{(\d+)\}\{(\d+)\}/, "$1/$2") + ".")] }); },
() => { const cc = nz(-8, 12), a = nz(-6, 6), lim = 2 * cc; if (a === lim) return null; const us = [a]; for (let i = 0; i < 3; i++) us.push(rnd(0.5 * us[i] + cc));
return QN("On définit " + M("u_0 = " + N(a)) + " et " + M("u_{n+1} = 0{,}5\\,u_n" + sg(cc)) + ". Calcule quelques termes (tableur, calculatrice) et conjecture la limite de la suite.", lim,
M("u_1 = " + N(us[1]) + ", \\; u_2 = " + N(us[2]) + ", \\; u_3 = " + N(us[3])) + "… Les termes se rapprochent du nombre " + M("\\ell") + " tel que " + M("\\ell = 0{,}5\\,\\ell" + sg(cc)) + ", soit " + M("\\ell = " + N(lim)) + ".",
{ ctx: "point-fixe", guide: [GS(M("u_1") + " = ?", us[1], M(N(us[1])) + "."), GS("Si la suite se stabilise vers " + M("\\ell") + ", alors " + M("\\ell = 0{,}5\\,\\ell" + sg(cc)) + ". " + M("\\ell") + " = ?", lim, M(N(lim)) + ".")],
traps: [TR(cc, "Résous ℓ = 0,5 ℓ " + (cc < 0 ? "− " + -cc : "+ " + cc) + " : 0,5 ℓ = " + cc + "."), TR(0, "Les termes ne tendent pas vers 0 : on ajoute " + cc + " à chaque étape."), TR(a, "Le premier terme ne compte pas pour la limite.")] }); },
],
};


const SA = {
1: [
() => { const a = nz(-20, 30), r = nz(-7, 9), n = R.int(10, 40), v = a + n * r;
return QN(M("(u_n)") + " est la suite arithmétique de premier terme " + M("u_0 = " + N(a)) + " et de raison " + M("r = " + N(r)) + ". Calcule " + M(u(n)) + ".", v, M(u(n) + " = u_0 + " + n + "r = " + N(a) + " + " + n + X + NP(r) + " = " + N(v)) + ".",
{ ctx: "u0-r", guide: [GS(M(n + X + NP(r)) + " = ?", n * r, M(N(n * r)) + "."), GS(M(u(n)) + " = ?", v, M(N(v)) + ".")],
traps: [TR(a + (n - 1) * r, "En partant de " + M("u_0") + ", on ajoute la raison " + n + " fois."), TR(a * r ** 1 * n, "On ajoute la raison, on ne multiplie pas le premier terme."), TR(a + r, "Il faut ajouter la raison " + n + " fois.")] }); },
() => { const a = nz(-15, 30), r = nz(-6, 8), k = R.int(12, 50), v = a + (k - 1) * r;
return QN("Une suite arithmétique " + M("(u_n)") + " a pour premier terme " + M("u_1 = " + N(a)) + " et pour raison " + M(N(r)) + ". Calcule " + M(u(k)) + ".", v, M(u(k) + " = u_1 + (" + k + " - 1)r = " + N(a) + " + " + (k - 1) + X + NP(r) + " = " + N(v)) + ".",
{ ctx: "u1-r", guide: [GS("Combien de fois ajoute-t-on la raison de " + M("u_1") + " à " + M(u(k)) + " ?", k - 1, M(k - 1) + "."), GS(M(u(k)) + " = ?", v, M(N(v)) + ".")],
traps: [TR(a + k * r, "La suite commence à " + M("u_1") + " : de " + M("u_1") + " à " + M(u(k)) + ", " + (k - 1) + " ajouts."), TR(a + (k + 1) * r, "Compte les ajouts : " + (k - 1) + ".")] }); },
() => { const p = R.int(2, 9), q = p + R.int(3, 9), r = nz(-8, 9), up = nz(-30, 40), uq = up + (q - p) * r;
return QN("Une suite arithmétique vérifie " + M(u(p) + " = " + N(up)) + " et " + M(u(q) + " = " + N(uq)) + ". Quelle est sa raison ?", r,
"De " + M(u(p)) + " à " + M(u(q)) + ", on ajoute " + M(q - p) + " fois la raison : " + M("r = \\frac{" + N(uq) + " - " + NP(up) + "}{" + (q - p) + "} = " + N(r)) + ".",
{ ctx: "deux-termes", guide: [GS(M(u(q) + " - " + u(p)) + " = ?", uq - up, M(N(uq - up)) + "."), GS("Raison " + M("r") + " ?", r, M("\\frac{" + N(uq - up) + "}{" + (q - p) + "} = " + N(r)) + ".")],
traps: [TR(uq - up, "Cet écart contient " + (q - p) + " fois la raison : divise par " + (q - p) + "."), TR((uq - up) / (q - p + 1), "Entre les rangs " + p + " et " + q + ", il y a " + (q - p) + " pas."), TR((uq + up) / (q - p), "C'est la différence des termes, pas leur somme.")] }); },
],
2: [
() => { const p = R.int(3, 8), q = p + R.int(3, 7), r = nz(-7, 8), a = nz(-25, 25), up = a + p * r, uq = a + q * r;
return QN("Une suite arithmétique vérifie " + M(u(p) + " = " + N(up)) + " et " + M(u(q) + " = " + N(uq)) + ". Calcule " + M("u_0") + ".", a,
M("r = \\frac{" + N(uq) + " - " + NP(up) + "}{" + (q - p) + "} = " + N(r)) + ", puis " + M("u_0 = " + u(p) + " - " + p + "r = " + N(up) + " - " + p + X + NP(r) + " = " + N(a)) + ".",
{ ctx: "u0-deux-termes", guide: [GS("Raison " + M("r") + " ?", r, M(N(r)) + "."), GS(M("u_0") + " = ?", a, M(N(up) + " - " + p + X + NP(r) + " = " + N(a)) + ".")],
traps: [TR(up + p * r, "Pour revenir en arrière, on retire la raison."), TR(up - (p - 1) * r, "De " + M("u_0") + " à " + M(u(p)) + " : " + p + " pas."), TR(up - r, "Il faut reculer de " + p + " rangs.")] }); },
() => { const a = nz(-20, 30), r = nz(-6, 9), n = R.int(12, 60), t = a + n * r;
return QN("La suite arithmétique " + M("(u_n)") + " a pour premier terme " + M("u_0 = " + N(a)) + " et pour raison " + M(N(r)) + ". Pour quel entier " + M("n") + " a-t-on " + M("u_n = " + N(t)) + " ?", n,
M(pol([r, a]) + " = " + N(t)) + " donne " + M(pol([r, 0]) + " = " + N(t - a)) + ", donc " + M("n = " + n) + ".",
{ ctx: "rang", guide: [GS(M("u_n - u_0") + " = ?", t - a, M(N(t - a)) + "."), GS(M("n") + " = ?", n, M("\\frac{" + N(t - a) + "}{" + N(r) + "} = " + n) + ".")],
traps: [TR(n + 1, "Le premier terme est " + M("u_0") + " : le rang est " + n + "."), TR(t / r, "Retire d'abord " + M("u_0") + " avant de diviser par la raison."), TR(n - 1, "Vérifie : " + M("u_0 + nr") + ".")] }); },
() => { const a = nz(-12, 20), r = nz(-7, 9), base = pk(["u0", "u1"]), e = base === "u0" ? r + "n" + (a < 0 ? a : "+" + a) : r + "n" + (a - r < 0 ? a - r : "+" + (a - r)), cs = base === "u0" ? [r, a] : [r, a - r];
if (a - r === 0 && base === "u1") return null;
return QX("Une suite arithmétique a pour " + (base === "u0" ? "premier terme " + M("u_0 = " + N(a)) : "premier terme " + M("u_1 = " + N(a))) + " et pour raison " + M(N(r)) + ". Exprime " + M("u_n") + " en fonction de " + M("n") + ".", e,
(base === "u0" ? M("u_n = u_0 + nr = " + pol(cs)) : M("u_n = u_1 + (n - 1)r = " + N(a) + " + " + NP(r) + "(n - 1) = " + pol(cs))) + ". C'est une fonction affine de " + M("n") + " : les points " + M("(n \\,;\\, u_n)") + " sont alignés.",
{ ctx: "formule-" + base, guide: [GX("Expression de " + M("u_n") + " ?", e, M(pol(cs)) + ".")],
traps: [TX(r + "n" + (a < 0 ? a : "+" + a), "La suite commence à " + M("u_1") + " : " + M("u_n = u_1 + (n - 1)r") + "."), TX(a + "n+" + r, "La raison multiplie n ; le premier terme est la constante."), TX(r + "(n+1)" + (a < 0 ? a : "+" + a), "De " + M("u_0") + " à " + M("u_n") + ", n pas.")] }); },
() => { const c = pk([["Léo a", "€ sur son livret et y ajoute", "€ chaque mois", "mois", "livret"], ["Une plante mesure", "cm et grandit de", "cm chaque semaine", "semaines", "plante"], ["Un club compte", "membres et en gagne", "de plus chaque année", "ans", "club"]]);
const a = pk([120, 180, 240, 75, 300]), r = pk([12, 15, 25, 35, 40]), n = R.int(9, 30), v = a + n * r;
return QN(c[0] + " " + M(a) + " " + c[1] + " " + M(r) + " " + c[2] + ". On note " + M("u_n") + " la valeur après " + M("n") + " " + c[3] + " (" + M("u_0 = " + a) + "). Calcule " + M(u(n)) + ".", v,
"Accroissement constant : suite arithmétique de raison " + M(r) + ". " + M(u(n) + " = " + a + " + " + n + X + r + " = " + N(v)) + ".",
{ ctx: c[4], guide: [GS("Raison de la suite ?", r, M(r) + "."), GS(M(u(n)) + " = ?", v, M(N(v)) + ".")],
traps: [TR(a + (n - 1) * r, "Après " + n + " " + c[3] + ", on a ajouté " + n + " fois " + r + "."), TR(a * n, "C'est la raison qui est ajoutée " + n + " fois."), TR(n * r, "N'oublie pas la valeur de départ " + a + ".")] }); },
],
3: [
() => { const c = pk([["Le stock d'un entrepôt est de", "cartons ; on en expédie", "chaque jour", "jours", "stock", "cartons"], ["Une citerne contient", "litres ; on en prélève", "chaque semaine", "semaines", "citerne", "litres"], ["Un forfait de", "minutes diminue de", "minutes par jour", "jours", "forfait", "minutes"]]);
const S = pk([1500, 2400, 3000, 4500, 1800]), d = pk([45, 65, 70, 85, 110, 130]), T = pk([200, 300, 500, 250]), n = Math.floor((S - T) / d) + 1;
return QN(c[0] + " " + M(N(S)) + " " + c[1] + " " + M(d) + " " + c[2] + ". Au bout de combien de " + c[3] + " restera-t-il pour la première fois moins de " + M(T) + " " + c[5] + " ?", n,
M("u_n = " + N(S) + " - " + d + "n") + ". " + M(N(S) + " - " + d + "n < " + T + " \\iff n > \\frac{" + N(S - T) + "}{" + d + "} \\approx " + N(rnd((S - T) / d, 2))) + " : la première fois pour " + M("n = " + n) + ".",
{ ctx: c[4], guide: [GS("Inéquation " + M(N(S) + " - " + d + "n < " + T) + " : " + M("n >") + " ? (fraction ou valeur approchée)", (S - T) / d, M("\\frac{" + N(S - T) + "}{" + d + "}") + "."), GS("Plus petit entier " + M("n") + " ?", n, M(n) + ".")],
traps: [TR(Math.floor((S - T) / d), "Il faut le premier entier strictement supérieur à " + N(rnd((S - T) / d, 2)).replace("{,}", ",") + "."), TR(Math.ceil(S / d), "On s'arrête quand il reste moins de " + T + ", pas quand tout est parti.")] }); },
() => { const a = pk([30, 40, 45, 50]), p = pk([1.5, 2, 2.5, 3]), b = a - pk([10, 15, 20, 25]), q = p + pk([0.5, 1, 1.5]), t = (a - b) / (q - p), n = Number.isInteger(t) ? t + 1 : Math.ceil(t); if (n < 4) return null;
return QN("Pour louer un local, le forfait A coûte " + M(a + " \\text{ €}") + " plus " + M(N(p) + " \\text{ €}") + " par heure ; le forfait B coûte " + M(b + " \\text{ €}") + " plus " + M(N(q) + " \\text{ €}") + " par heure. À partir de combien d'heures (nombre entier) le forfait A est-il strictement moins cher ?", n,
M(a + " + " + N(p) + "n < " + b + " + " + N(q) + "n \\iff " + N(q - p) + "n > " + (a - b) + " \\iff n > " + N(rnd(t, 3))) + " : à partir de " + M(n) + " heures.",
{ ctx: "forfaits", guide: [GS("Écart des parts fixes " + M(a + " - " + b) + " ?", a - b, M(a - b) + "."), GS("Écart des prix horaires ?", q - p, M(N(q - p)) + "."), GS("Plus petit entier " + M("n") + " ?", n, M(n) + ".")],
traps: [TR(n - 1, Number.isInteger(t) ? "Pour " + t + " heures, les deux forfaits coûtent autant : il faut strictement moins cher." : "Prends l'entier juste au-dessus de " + N(rnd(t, 2)).replace("{,}", ",") + "."), TR(Math.round((a - b) / q), "Divise par la différence des prix horaires.")] }); },
() => { const a = nz(-15, 20), r = nz(-6, 7), s = 2 * a + 9 * r, t = a + 3 * r;
return QN("Une suite arithmétique " + M("(u_n)") + " vérifie " + M("u_3 = " + N(t)) + " et " + M("u_2 + u_7 = " + N(s)) + ". Calcule " + M("u_0") + ".", a,
M("u_2 + u_7 = 2u_0 + 9r") + " et " + M("u_3 = u_0 + 3r") + ", donc " + M("u_2 + u_7 - 2u_3 = 3r = " + N(s - 2 * t)) + ", " + M("r = " + N(r)) + " et " + M("u_0 = " + N(t) + " - 3" + X + NP(r) + " = " + N(a)) + ".",
{ ctx: "systeme", guide: [GS("En écrivant tout avec " + M("u_0") + " et " + M("r") + " : " + M("u_2 + u_7 - 2u_3 = 3r") + ". " + M("r") + " = ?", r, M("\\frac{" + N(s) + " - 2" + X + NP(t) + "}{3} = " + N(r)) + "."), GS(M("u_0") + " = ?", a, M(N(a)) + ".")],
traps: [TR(t - 3 * r + r, "De " + M("u_0") + " à " + M("u_3") + ", 3 pas : " + M("u_0 = u_3 - 3r") + "."), TR(s / 2 - 9 * r, "u_2 + u_7 = 2u_0 + 9r : divise aussi 9r par 2."), TR(r, "C'est la raison ; on demande " + M("u_0") + ".")] }); },
],
};

SA[1].push(() => { const a = R.int(-4, 8), r = nz(-3, 3), k = R.int(9, 25), v = a + k * r, ts = [0, 1, 2, 3, 4, 5].map((n) => a + n * r); if (Math.abs(r) === 1 && R.rand() < 0.5) return null;
return QN("Le graphique représente les premiers termes d'une suite arithmétique " + M("(u_n)") + ". Lis " + M("u_0") + " et la raison, puis calcule " + M(u(k)) + ".", v,
"On lit " + M("u_0 = " + N(a)) + " et, d'un point au suivant, " + M(r > 0 ? "+" + r : N(r)) + " : " + M("r = " + N(r)) + ". " + M(u(k) + " = " + N(a) + " + " + k + X + NP(r) + " = " + N(v)) + ".",
{ ctx: "graphique", fig: figSuite(ts), guide: [GS("Premier terme " + M("u_0") + " ?", a, M(N(a)) + "."), GS("Raison " + M("r") + " (écart vertical entre deux points voisins) ?", r, M(N(r)) + "."), GS(M(u(k)) + " = ?", v, M(N(v)) + ".")],
traps: [TR(a + (k - 1) * r, "Depuis " + M("u_0") + ", on ajoute la raison " + k + " fois."), TR(ts[5] + k * r, "On part de u_0, le premier point (n = 0)."), TR(a - k * r, "Regarde si les points montent ou descendent : signe de la raison.")] }); });


const SG = {
1: [
() => { const a = pk([2, 3, 5, -3, 4, 7]), q = pk([2, 3, -2]), n = R.int(4, 6), v = a * q ** n; if (Math.abs(v) > 5000) return null;
return QN(M("(u_n)") + " est la suite géométrique de premier terme " + M("u_0 = " + N(a)) + " et de raison " + M("q = " + N(q)) + ". Calcule " + M(u(n)) + ".", v, M(u(n) + " = u_0" + X + "q^{" + n + "} = " + N(a) + X + NP(q) + "^{" + n + "} = " + N(a) + X + NP(q ** n) + " = " + N(v)) + ".",
{ ctx: "u0-q", guide: [GS(M(NP(q) + "^{" + n + "}") + " = ?", q ** n, M(N(q ** n)) + (q < 0 ? " (exposant " + (n % 2 ? "impair : négatif" : "pair : positif") + ")." : ".")), GS(M(u(n)) + " = ?", v, M(N(v)) + ".")],
traps: [TR(a * q * n, "On multiplie " + n + " fois par la raison : c'est une puissance."), TR(a * q ** (n - 1), "Depuis " + M("u_0") + ", il y a " + n + " multiplications."), TR(a + n * q, "Suite géométrique : on multiplie, on n'ajoute pas."), TR((a * q) ** n, "Seule la raison est à la puissance " + n + ".")] }); },
() => { const t = pk([2, 3, 4, 5, 8, 12, 15, 1.5, 2.5, 0.5]), up = R.rand() < 0.5, q = rnd(1 + (up ? t : -t) / 100), what = pk([["un loyer", "augmente", "diminue"], ["une population de pandas roux", "augmente", "diminue"], ["le prix d'un abonnement", "augmente", "baisse"], ["la production d'une ferme solaire", "augmente", "diminue"]]);
return QN("Chaque année, " + what[0] + " " + (up ? what[1] : what[2]) + " de " + M(N(t) + "\\,\\%") + ". On note " + M("u_n") + " sa valeur l'année " + M("n") + ". " + M("(u_n)") + " est géométrique : quelle est sa raison ?", q,
(up ? "Augmenter" : "Diminuer") + " de " + M(N(t) + "\\,\\%") + ", c'est multiplier par " + M("1 " + (up ? "+" : "-") + " \\frac{" + N(t) + "}{100} = " + N(q)) + ".",
{ ctx: "taux-raison", guide: [GS(M(N(t) + "\\,\\%") + " en écriture décimale ?", t / 100, M(N(t / 100)) + "."), GS("Raison " + M("q") + " ?", q, M(N(q)) + ".")],
traps: [TR(t / 100, "On garde aussi la valeur de départ : q = 1 " + (up ? "+" : "−") + " " + N(t / 100).replace("{,}", ",") + "."), TR(rnd(1 + (up ? -t : t) / 100), up ? "Une hausse donne q > 1." : "Une baisse donne q < 1."), TR(1 + t, "Le taux en % se divise par 100.")] }); },
() => { const a = pk([3, 5, 6, -2, 10, 7]), q = pk([2, 3, -2, -3]), k = R.int(4, 6), v = a * q ** (k - 1); if (Math.abs(v) > 6000) return null;
return QN("Une suite géométrique " + M("(u_n)") + " a pour premier terme " + M("u_1 = " + N(a)) + " et pour raison " + M(N(q)) + ". Calcule " + M(u(k)) + ".", v, M(u(k) + " = u_1" + X + "q^{" + (k - 1) + "} = " + N(a) + X + NP(q) + "^{" + (k - 1) + "} = " + N(v)) + ".",
{ ctx: "u1-q", guide: [GS("Exposant de " + M("q") + " de " + M("u_1") + " à " + M(u(k)) + " ?", k - 1, M(k - 1) + "."), GS(M(u(k)) + " = ?", v, M(N(v)) + ".")],
traps: [TR(a * q ** k, "De " + M("u_1") + " à " + M(u(k)) + ", " + (k - 1) + " multiplications."), TR(a * q * (k - 1), "On multiplie plusieurs fois : puissance.")] }); },
() => { const q = pk([2, 3, 4]), n = R.int(3, 5), a = pk([3, 5, 7, 2, 6]), un = a * q ** n; if (un > 5000) return null;
return QN("Une suite géométrique de raison " + M(q) + " vérifie " + M(u(n) + " = " + N(un)) + ". Calcule " + M("u_0") + ".", a,
M(u(n) + " = u_0" + X + q + "^{" + n + "}") + " donc " + M("u_0 = \\frac{" + N(un) + "}{" + N(q ** n) + "} = " + N(a)) + ".",
{ ctx: "retour-u0", guide: [GS(M(q + "^{" + n + "}") + " = ?", q ** n, M(N(q ** n)) + "."), GS(M("u_0") + " = ?", a, M(N(a)) + ".")],
traps: [TR(un / q ** (n - 1), "De " + M("u_0") + " à " + M(u(n)) + " : " + n + " multiplications par " + q + "."), TR(un - n * q, "Suite géométrique : on divise par la raison, on ne retire pas."), TR(un / (q * n), "Divise par " + M(q + "^{" + n + "}") + ".")] }); },
],
2: [
() => { const C0 = pk([1500, 2000, 2500, 3000, 4000, 5000, 8000]), t = pk([1.5, 2, 2.5, 3, 3.5, 4]), n = R.int(5, 12), q = rnd(1 + t / 100), v = C0 * q ** n;
return QR("On place " + M(N(C0) + " \\text{ €}") + " à intérêts composés au taux annuel de " + M(N(t) + "\\,\\%") + ". Quel est le capital au bout de " + M(n) + " ans ? (arrondi au centime)", v, 0.01,
"Chaque année, le capital est multiplié par " + M(N(q)) + " : " + M("C_{" + n + "} = " + N(C0) + X + N(q) + "^{" + n + "} \\approx " + N(rnd(v, 2)) + " \\text{ €}") + ".",
{ ctx: "capital", guide: [GS("Raison de la suite géométrique ?", q, M(N(q)) + "."), GR("Capital au bout de " + n + " ans (au centime) ?", v, M("\\approx " + N(rnd(v, 2))) + ".", 0.01)],
traps: [TR(rnd(C0 * (1 + n * t / 100), 2), "Ce serait des intérêts simples : à intérêts composés, les intérêts rapportent aussi."), TR(rnd(C0 * q ** (n - 1), 2), "Au bout de " + n + " ans : " + n + " multiplications."), TR(rnd(C0 * q * n, 2), "On multiplie " + n + " fois par " + N(q).replace("{,}", ",") + " : puissance.")] }); },
() => { const q = pk([2, 3, -2, 0.5, -3]), a = pk([2, 3, 4, 5, -4, 8, 16, 32]), u2 = a * q ** 2, u5 = a * q ** 5; if (!Number.isInteger(u2) || !Number.isInteger(u5) || Math.abs(u5) > 3000) return null;
return QN("Une suite géométrique vérifie " + M("u_2 = " + N(u2)) + " et " + M("u_5 = " + N(u5)) + ". Quelle est sa raison ?", q,
M("u_5 = u_2" + X + "q^3") + ", donc " + M("q^3 = \\frac{" + N(u5) + "}{" + N(u2) + "} = " + F(q ** 3)) + " et " + M("q = " + F(q)) + ".",
{ ctx: "q-deux-termes", guide: [GS(M("q^3 = \\frac{u_5}{u_2}") + " = ?", q ** 3, M(F(q ** 3)) + "."), GS(M("q") + " = ?", q, M(F(q)) + " (racine cubique).")],
traps: [TR(q ** 3, "C'est " + M("q^3") + " : de " + M("u_2") + " à " + M("u_5") + ", trois multiplications."), TR((u5 - u2) / 3, "Suite géométrique : on compare par quotient, pas par différence."), TR(q ** 3 / 3, "Prends la racine cubique, pas le tiers.")] }); },
() => { const a = pk([2, 3, 4, 5, 6, 7, 8, 9]), q = pk([2, 3, 5, "0.5"]), qv = +q, e = a + "*" + q + "^n";
return QX(M("(u_n)") + " est géométrique, de premier terme " + M("u_0 = " + a) + " et de raison " + M(N(qv)) + ". Exprime " + M("u_n") + " en fonction de " + M("n") + ".", e,
M("u_n = u_0" + X + "q^n = " + a + X + N(qv) + "^n") + ".",
{ ctx: "formule-geo", guide: [GX("Expression de " + M("u_n") + " ?", e, M(a + X + N(qv) + "^n") + ".")],
traps: [TX("(" + a + "*" + q + ")^n", "Seule la raison est élevée à la puissance n."), TX(a + "*" + q + "^(n-1)", "Avec " + M("u_0") + ", l'exposant est n."), TX(a + "+" + q + "*n", "Géométrique : on multiplie par la raison à chaque rang.")] }); },
() => { const t = pk([5, 8, 10, 12, 15, 20]), n = R.int(4, 12), q = rnd(1 - t / 100), c = pk([["Un échantillon radioactif a une masse de", "g ; elle diminue de", "par an", "radio"], ["Un médicament : la quantité dans le sang est de", "mg ; elle diminue de", "par heure", "medicament"], ["Un vélo électrique vaut", "€ ; sa valeur baisse de", "par an", "decote"]]), m0 = c[3] === "decote" ? pk([1200, 1800, 2400, 3000]) : pk([50, 80, 120, 200, 250]), v = m0 * q ** n;
return QR(c[0] + " " + M(N(m0)) + " " + c[1] + " " + M(t + "\\,\\%") + " " + c[2] + ". Que vaut-elle au bout de " + M(n) + " " + (c[3] === "medicament" ? "heures" : "ans") + " ? (arrondi au centième)", v, 0.01,
"Coefficient multiplicateur " + M(N(q)) + " : " + M(N(m0) + X + N(q) + "^{" + n + "} \\approx " + N(rnd(v, 2))) + ".",
{ ctx: c[3], guide: [GS("Raison ?", q, M("1 - " + N(t / 100) + " = " + N(q)) + "."), GR("Valeur au bout de " + n + " (au centième) ?", v, M("\\approx " + N(rnd(v, 2))) + ".", 0.01)],
traps: [TR(rnd(m0 * (1 - n * t / 100), 2), "Les baisses en % se composent : on multiplie " + n + " fois par " + N(q).replace("{,}", ",") + "."), TR(rnd(m0 * (t / 100) ** n, 2), "On garde " + (100 - t) + " %, on multiplie par " + N(q).replace("{,}", ",") + "."), TR(rnd(m0 * q ** (n - 1), 2), n + " périodes : exposant " + n + ".")] }); },
],
3: [
() => { const P0 = pk([12000, 15000, 8000, 20000, 25000]), t = pk([2, 3, 4, 5, 6]), T = rnd(P0 * pk([0.75, 0.7, 0.8, 0.6])), q = rnd(1 - t / 100); let n = 0, p = P0; while (p >= T) { p *= q; n++; }
const c = pk([["Une commune compte", "habitants ; sa population baisse de", "habitants", "commune", "elle"], ["Un glacier a une surface de", "m² ; elle diminue de", "m²", "glacier", "elle"], ["Un lac contient", "poissons ; leur nombre baisse de", "poissons", "lac", "il" ]]);
return QN(c[0] + " " + M(N(P0)) + " " + c[1] + " " + M(t + "\\,\\%") + " par an. Au bout de combien d'années passera-t-" + c[4] + " pour la première fois sous " + M(N(T)) + " " + c[2] + " ?", n,
M("u_n = " + N(P0) + X + N(q) + "^n") + ". À la calculatrice (ou avec une boucle) : " + M("u_{" + (n - 1) + "} \\approx " + N(rnd(P0 * q ** (n - 1), 0))) + " et " + M("u_{" + n + "} \\approx " + N(rnd(P0 * q ** n, 0))) + " : au bout de " + M(n) + " ans.",
{ ctx: c[3], guide: [GS("Raison ?", q, M(N(q)) + "."), GS("Plus petit " + M("n") + " tel que " + M("u_n < " + N(T)) + " ?", n, M(n) + ".")],
traps: [TR(n - 1, "Au bout de " + (n - 1) + " ans, on est encore au-dessus de " + N(T).replace(/\\,/g, " ") + "."), TR(Math.ceil((1 - T / P0) / (t / 100)), "Les baisses se composent : il en faut un peu plus que si on retirait toujours " + t + " % de la valeur de départ.")] }); },
() => { const C0 = pk([1000, 2000, 1500, 3000]), add = pk([40, 60, 80, 100]), t = pk([3, 4, 5]), q = 1 + t / 100; let n = 0; while (C0 * q ** n <= C0 + add * n || n === 0) n++; if (n < 4 || n > 40) return null;
return QN("Deux placements partent de " + M(N(C0) + " \\text{ €}") + ". Le placement A rapporte " + M(add + " \\text{ €}") + " par an ; le placement B augmente de " + M(t + "\\,\\%") + " par an. Au bout de combien d'années B dépasse-t-il A pour la première fois ?", n,
"A : " + M("a_n = " + N(C0) + " + " + add + "n") + " (arithmétique) ; B : " + M("b_n = " + N(C0) + X + N(q) + "^n") + " (géométrique). Au tableur : " + M("b_{" + n + "} \\approx " + N(rnd(C0 * q ** n, 2)) + " > a_{" + n + "} = " + N(C0 + add * n)) + ", et c'était l'inverse l'année d'avant : au bout de " + M(n) + " ans.",
{ ctx: "placements", guide: [GS("Placement A au bout de " + n + " ans ?", C0 + add * n, M(N(C0 + add * n)) + "."), GS("Première année où B dépasse A ?", n, M(n) + ".")],
traps: [TR(n - 1, "Cette année-là, A est encore devant."), TR(Math.round(add / (C0 * t / 100)), "La première année, B rapporte " + C0 * t / 100 + " € ; mais ses intérêts augmentent chaque année.")] }); },
() => { const q = pk([2, 3, 0.5, -2]), a = pk([1, 2, 3, 4, 5]) * (q === 0.5 ? 32 : 1), u3 = a * q ** 3, u5 = a * q ** 5; if (!Number.isInteger(u5) || !Number.isInteger(u3) || Math.abs(u5) > 4000) return null; const qq = Math.abs(q);
return QN("Une suite géométrique de raison positive vérifie " + M("u_3 = " + N(Math.abs(u3))) + " et " + M("u_5 = " + N(Math.abs(u5))) + ". Calcule " + M("u_0") + ".", Math.abs(a),
M("q^2 = \\frac{u_5}{u_3} = " + F(qq * qq)) + ", " + M("q > 0") + " donc " + M("q = " + F(qq)) + ". Puis " + M("u_0 = \\frac{u_3}{q^3} = \\frac{" + N(Math.abs(u3)) + "}{" + F(qq ** 3) + "} = " + N(Math.abs(a))) + ".",
{ ctx: "u0-q-positive", guide: [GS(M("q^2") + " = ?", qq * qq, M(F(qq * qq)) + "."), GS(M("q") + " = ?", qq, M(F(qq)) + "."), GS(M("u_0") + " = ?", Math.abs(a), M(N(Math.abs(a))) + ".")],
traps: [TR(Math.abs(u3) / qq ** 2, "De " + M("u_0") + " à " + M("u_3") + " : trois multiplications."), TR(Math.abs(u3) - 3 * qq, "Géométrique : on divise par la raison."), TR(Math.abs(u3) / (qq * qq) ** 3, "Calcule d'abord q (racine de q²).")] }); },
],
};


const SS = {
1: [
() => { const n = pk([R.int(20, 60), 100, R.int(70, 150), 200, 1000]), v = (n * (n + 1)) / 2;
return QN("Calcule " + M("S = 1 + 2 + 3 + \\dots + " + N(n)) + ".", v, M("1 + 2 + \\dots + n = \\frac{n(n + 1)}{2}") + " avec " + M("n = " + N(n)) + " : " + M("S = \\frac{" + N(n) + X + N(n + 1) + "}{2} = " + N(v)) + ".",
{ ctx: "gauss", guide: [GS("Nombre de termes ?", n, M(N(n)) + "."), GS(M("S") + " = ?", v, M(N(v)) + ".")],
traps: [TR((n * (n - 1)) / 2, "La formule est " + M("\\frac{n(n + 1)}{2}") + "."), TR(n * (n + 1), "N'oublie pas de diviser par 2."), TR((n * n) / 2, "Formule : " + M("\\frac{n(n + 1)}{2}") + ".")] }); },
() => { const a = nz(-10, 20), r = nz(-4, 7), n = R.int(9, 30), un = a + n * r, v = ((n + 1) * (a + un)) / 2;
return QN("La suite arithmétique " + M("(u_n)") + " a pour premier terme " + M("u_0 = " + N(a)) + " et pour raison " + M(N(r)) + ". Calcule " + M("S = u_0 + u_1 + \\dots + " + u(n)) + ".", v,
M(u(n) + " = " + N(un)) + " ; il y a " + M(n + 1) + " termes : " + M("S = " + (n + 1) + X + "\\frac{" + N(a) + " + " + NP(un) + "}{2} = " + N(v)) + ".",
{ ctx: "somme-arith", guide: [GS(M(u(n)) + " = ?", un, M(N(un)) + "."), GS("Nombre de termes de " + M("u_0") + " à " + M(u(n)) + " ?", n + 1, M(n + 1) + "."), GS(M("S") + " = ?", v, M("\\text{nombre de termes}" + X + "\\frac{\\text{premier} + \\text{dernier}}{2} = " + N(v)) + ".")],
traps: [TR((n * (a + un)) / 2, "De " + M("u_0") + " à " + M(u(n)) + ", il y a " + (n + 1) + " termes."), TR((n + 1) * (a + un), "On multiplie par la moyenne du premier et du dernier : divise par 2."), TR(un, "C'est le dernier terme ; on demande la somme.")] }); },
() => { const q = pk([2, 3]), n = R.int(5, q === 2 ? 11 : 7), v = (q ** (n + 1) - 1) / (q - 1);
return QN("Calcule " + M("S = 1 + " + q + " + " + q + "^2 + \\dots + " + q + "^{" + n + "}") + ".", v, M("1 + q + \\dots + q^n = \\frac{q^{n+1} - 1}{q - 1}") + " : " + M("S = \\frac{" + q + "^{" + (n + 1) + "} - 1}{" + (q - 1) + "} = " + N(v)) + ".",
{ ctx: "somme-puissances", guide: [GS(M(q + "^{" + (n + 1) + "}") + " = ?", q ** (n + 1), M(N(q ** (n + 1))) + "."), GS(M("S") + " = ?", v, M(N(v)) + ".")],
traps: [TR((q ** n - 1) / (q - 1), "Il y a " + (n + 1) + " termes (de q⁰ à qⁿ) : l'exposant est " + (n + 1) + "."), TR(q ** (n + 1) - 1, "Divise par " + M("q - 1 = " + (q - 1)) + "."), TR(q ** n, "C'est le dernier terme, pas la somme.")] }); },
],
2: [
() => { const n = R.int(15, 120), odd = R.rand() < 0.5, last = odd ? 2 * n - 1 : 2 * n, v = odd ? n * n : n * (n + 1);
return QN("Calcule " + M("S = " + (odd ? "1 + 3 + 5" : "2 + 4 + 6") + " + \\dots + " + N(last)) + ".", v,
"Suite arithmétique de raison 2 ; nombre de termes : " + M(n) + ". " + M("S = " + n + X + "\\frac{" + (odd ? 1 : 2) + " + " + N(last) + "}{2} = " + N(v)) + ".",
{ ctx: odd ? "impairs" : "pairs", guide: [GS("Nombre de termes ?", n, M(n) + (odd ? " (le k-ième impair est 2k − 1)." : " (on compte de 2 en 2).")), GS(M("S") + " = ?", v, M(N(v)) + ".")],
traps: [TR((last * (last + 1)) / 2, "On n'additionne qu'un nombre sur deux."), TR(((n - 1) * ((odd ? 1 : 2) + last)) / 2, "Il y a " + n + " termes.")] }); },
() => { const c = pk([["Un message est envoyé à", "personnes le premier jour ; chaque jour, chaque nouveau destinataire le transfère à", "personnes", "message"], ["Une ferme plante", "arbres la première année puis, chaque année,", "fois plus que l'année précédente", "arbres"], ["Un club organise une chaîne : le premier jour,", "personnes jouent, puis chaque jour il y en a", "fois plus", "chaine"]]);
const a = pk([2, 3, 4, 5]), q = pk([2, 3]), N0 = R.int(5, q === 2 ? 9 : 6), v = (a * (q ** N0 - 1)) / (q - 1);
return QN(c[0] + " " + M(a) + " " + c[1] + " " + M(q) + (c[3] === "message" ? " " + c[2] : " " + c[2]) + ". Combien au total en " + M(N0) + (c[3] === "arbres" ? " ans" : " jours") + " ?", v,
"Termes " + M(a + ", " + a * q + ", " + a * q * q + ", \\dots") + " : suite géométrique de raison " + M(q) + ". " + M("S = " + a + X + "\\frac{" + q + "^{" + N0 + "} - 1}{" + q + " - 1} = " + N(v)) + ".",
{ ctx: c[3], guide: [GS("Terme du jour " + N0 + " ?", a * q ** (N0 - 1), M(a + X + q + "^{" + (N0 - 1) + "} = " + N(a * q ** (N0 - 1))) + "."), GS("Total ?", v, M(N(v)) + ".")],
traps: [TR(a * q ** (N0 - 1), "C'est le nombre du dernier jour ; on demande le total."), TR((a * (q ** (N0 + 1) - 1)) / (q - 1), N0 + " jours = " + N0 + " termes : exposant " + N0 + "."), TR(a * q * N0, "Les termes sont multipliés par " + q + " chaque jour.")] }); },
() => { const r1 = pk([12, 15, 18, 20, 24]), d = pk([2, 3, 4]), k = R.int(10, 25), last = r1 + (k - 1) * d, v = (k * (r1 + last)) / 2, c = pk([["Dans un amphithéâtre, le 1er rang compte", "places et chaque rang a", "places de plus que le précédent", "rangs", "amphi"], ["Dans une pyramide de canettes, la rangée du haut compte", "canettes et chaque rangée en a", "de plus que celle du dessus", "rangées", "canettes"]]);
return QN(c[0] + " " + M(r1) + " " + c[1] + " " + M(d) + " " + c[2] + ". Il y a " + M(k) + " " + c[3] + ". Combien en tout ?", v,
"Dernier : " + M(r1 + " + " + (k - 1) + X + d + " = " + last) + ". Total : " + M(k + X + "\\frac{" + r1 + " + " + last + "}{2} = " + N(v)) + ".",
{ ctx: c[4], guide: [GS("Nombre au dernier rang ?", last, M(last) + "."), GS("Total ?", v, M(N(v)) + ".")],
traps: [TR(k * r1, "Les rangs ne sont pas tous pareils : ils augmentent de " + d + "."), TR((k * (r1 + r1 + k * d)) / 2, "Le dernier rang : " + r1 + " + (" + k + " − 1) × " + d + "."), TR(last, "C'est le dernier rang ; on demande le total.")] }); },
() => { const a = nz(-5, 12), r = nz(2, 6), p = R.int(3, 9), q = p + R.int(8, 20), up = a + p * r, uq = a + q * r, cnt = q - p + 1, v = (cnt * (up + uq)) / 2;
return QN("Pour tout entier naturel " + M("n") + ", " + M("u_n = " + pol([r, a])) + ". Calcule " + M("S = " + u(p) + " + " + u(p + 1) + " + \\dots + " + u(q)) + ".", v,
M(u(p) + " = " + N(up)) + ", " + M(u(q) + " = " + N(uq)) + ", " + M(cnt) + " termes : " + M("S = " + cnt + X + "\\frac{" + N(up) + " + " + N(uq) + "}{2} = " + N(v)) + ".",
{ ctx: "somme-partielle", guide: [GS("Nombre de termes de " + M(u(p)) + " à " + M(u(q)) + " ?", cnt, M(q + " - " + p + " + 1 = " + cnt) + "."), GS(M(u(p) + " + " + u(q)) + " = ?", up + uq, M(N(up + uq)) + "."), GS(M("S") + " = ?", v, M(N(v)) + ".")],
traps: [TR(((q - p) * (up + uq)) / 2, "De " + M(u(p)) + " à " + M(u(q)) + " : " + cnt + " termes (on compte les deux bouts)."), TR(((q + 1) * (a + uq)) / 2, "La somme commence à " + M(u(p)) + ", pas à " + M("u_0") + ".")] }); },
],
3: [
() => { const n = R.int(15, 70), S = (n * (n + 1)) / 2;
return QN("Pour quel entier " + M("n") + " a-t-on " + M("1 + 2 + \\dots + n = " + N(S)) + " ?", n,
M("\\frac{n(n + 1)}{2} = " + N(S) + " \\iff n(n + 1) = " + N(2 * S)) + ". Deux entiers consécutifs de produit " + M(N(2 * S)) + " : " + M(n + X + (n + 1)) + ", donc " + M("n = " + n) + ".",
{ ctx: "gauss-inverse", guide: [GS(M("n(n + 1)") + " = ?", 2 * S, M(N(2 * S)) + "."), GS(M("n") + " = ? (proche de " + M("\\sqrt{" + N(2 * S) + "}") + ")", n, M(n) + ".")],
traps: [TR(n + 1, "Vérifie : " + M("\\frac{" + (n + 1) + X + (n + 2) + "}{2} \\ne " + N(S)) + "."), TR(Math.round(Math.sqrt(S)), "Résous " + M("n(n + 1) = " + N(2 * S)) + ".")] }); },
() => { const a = pk([50, 80, 100, 120, 150]), t = pk([2, 3, 4, 5]), n = pk([10, 12, 15, 18, 24]), q = rnd(1 + t / 100), v = (a * (q ** n - 1)) / (q - 1);
return QR("Chaque mois, Sarah verse sur un compte une somme qui augmente de " + M(t + "\\,\\%") + " : " + M(a + " \\text{ €}") + " le premier mois, puis " + M(N(rnd(a * q, 2)) + " \\text{ €}") + ", etc. Combien a-t-elle versé en tout au bout de " + M(n) + " mois ? (arrondi au centime)", v, 0.01,
"Versements géométriques de raison " + M(N(q)) + " : " + M("S = " + a + X + "\\frac{" + N(q) + "^{" + n + "} - 1}{" + N(q) + " - 1} \\approx " + N(rnd(v, 2)) + " \\text{ €}") + ".",
{ ctx: "versements", guide: [GS("Raison ?", q, M(N(q)) + "."), GR("Total (au centime) ?", v, M("\\approx " + N(rnd(v, 2))) + ".", 0.01)],
traps: [TR(rnd(a * q ** (n - 1), 2), "C'est le dernier versement ; on demande le total."), TR(a * n, "Les versements augmentent chaque mois."), TR(rnd((a * (q ** (n + 1) - 1)) / (q - 1), 2), n + " versements : exposant " + n + ".")] }); },
() => { const S = pk([1000, 5000, 10000, 50000, 100000, 1000000]); let n = 1; while (2 ** n - 1 < S) n++;
return QN("Sur un échiquier, on pose 1 grain de riz sur la 1re case, 2 sur la 2e, 4 sur la 3e, et ainsi de suite en doublant. À partir de combien de cases le total dépasse-t-il " + M(N(S)) + " grains ?", n,
"Avec " + M("n") + " cases : " + M("1 + 2 + \\dots + 2^{n-1} = 2^n - 1") + ". " + M("2^{" + (n - 1) + "} - 1 = " + N(2 ** (n - 1) - 1)) + " et " + M("2^{" + n + "} - 1 = " + N(2 ** n - 1)) + " : il faut " + M(n) + " cases.",
{ ctx: "echiquier", guide: [GS("Total pour " + M("10") + " cases (" + M("1 + 2 + \\dots + 2^9") + ") ?", 1023, M("2^{10} - 1 = 1\\,023") + " : avec " + M("n") + " cases, " + M("2^n - 1") + "."), GS("Plus petit " + M("n") + " ?", n, M(n) + ".")],
traps: [TR(n - 1, "Avec " + (n - 1) + " cases, on n'a que " + N(2 ** (n - 1) - 1).replace(/\\,/g, " ") + " grains."), TR(n + 1, "Avec " + n + " cases, on a déjà " + N(2 ** n - 1).replace(/\\,/g, " ") + " grains.")] }); },
],
};


const ex = (k) => "e^{" + N(k) + "}";
const EF = {
1: [
() => { const a = nz(-6, 9), b = nz(-7, 8), c = R.rand() < 0.5 ? 0 : nz(-5, 6), k = a + b - c; if (k === 0 || Math.abs(k) === 1) return null;
return QN("Écris " + M(ex(a) + X + ex(b) + (c ? " \\div " + ex(c) : "")) + " sous la forme " + M("e^k") + ". Que vaut " + M("k") + " ?", k,
M("e^a" + X + "e^b = e^{a + b}") + (c ? " et " + M("\\frac{e^a}{e^b} = e^{a - b}") : "") + " : " + M("k = " + N(a) + " + " + NP(b) + (c ? " - " + NP(c) : "") + " = " + N(k)) + ".",
{ ctx: "produit", guide: [GS("Exposant de " + M(ex(a) + X + ex(b)) + " ?", a + b, M(N(a + b)) + "."), GS(M("k") + " = ?", k, M(N(k)) + ".")],
traps: [TR(a * b - c, "On ajoute les exposants (on ne les multiplie pas)."), TR(a + b + c, "Diviser par " + M(ex(c)) + " retire l'exposant " + c + ".")] }); },
() => { const a = nz(-5, 6), b = nz(-4, 5), k = a * b; if (Math.abs(a) === 1 || Math.abs(b) === 1) return null;
return QN("Écris " + M("\\left(" + ex(a) + "\\right)^{" + N(b) + "}") + " sous la forme " + M("e^k") + ". Que vaut " + M("k") + " ?", k, M("(e^a)^b = e^{ab}") + " : " + M("k = " + N(a) + X + NP(b) + " = " + N(k)) + ".",
{ ctx: "puissance", guide: [GS(M("k = " + N(a) + X + NP(b)) + " = ?", k, M(N(k)) + ".")], traps: [TR(a + b, "Puissance d'une puissance : on multiplie les exposants."), TR(a ** b, "L'exposant devient " + M(N(a) + X + NP(b)) + ".")] }); },
() => { const a = nz(-5, 5), b = nz(-8, 8), c = nz(-9, 9); if (Math.abs(a) === 1 || c === b) return null; const x = (c - b) / a;
return QN("Résous " + M("e^{" + pol([a, b], "x") + "} = " + ex(c)) + " (fraction acceptée).", x,
"La fonction exponentielle est strictement croissante : " + M("e^a = e^b \\iff a = b") + ". Donc " + M(pol([a, b], "x") + " = " + N(c)) + " et " + M("x = " + F(x)) + ".",
{ ctx: "equation", guide: [GS("Équation sur les exposants : " + M(N(a) + "x = ") + " ?", c - b, M(N(c) + " - " + NP(b) + " = " + N(c - b)) + "."), GS(M("x") + " = ?", x, M(F(x)) + ".")],
traps: [TR((c + b) / a, "Pour isoler " + M(N(a) + "x") + ", on retire " + N(b).replace("{,}", ",") + "."), TR(c / a - b, "Retire d'abord " + N(b) + ", puis divise par " + N(a) + "."), TR((c - b) * a, "On divise par " + N(a) + ".")] }); },
() => { const a = nz(-6, 8); if (Math.abs(a) < 2) return null; const b = nz(-6, 6), k = b - a; if (k === 0 || Math.abs(k) === 1) return null;
return QN("Écris " + M("\\frac{" + ex(b) + "}{" + ex(a) + "}") + " sous la forme " + M("e^k") + ". Que vaut " + M("k") + " ?", k, M("\\frac{e^b}{e^a} = e^{b - a}") + " : " + M("k = " + N(b) + " - " + NP(a) + " = " + N(k)) + ".",
{ ctx: "quotient", guide: [GS(M("k = " + N(b) + " - " + NP(a)) + " = ?", k, M(N(k)) + ".")], traps: [TR(b / a, "Quotient de deux exponentielles : on soustrait les exposants."), TR(a - b, "C'est exposant du haut moins exposant du bas."), TR(a + b, "On divise : on soustrait.")] }); },
],
2: [
() => { const a = nz(-5, 6), c = nz(-5, 6), b = nz(-9, 9), d = nz(-9, 9); if (a === c || b === d) return null; const x = (d - b) / (a - c);
return QN("Résous " + M("e^{" + pol([a, b], "x") + "} = e^{" + pol([c, d], "x") + "}") + " (fraction acceptée).", x,
"Exponentielle strictement croissante : " + M(pol([a, b], "x") + " = " + pol([c, d], "x")) + ", soit " + M(N(a - c) + "x = " + N(d - b)) + " et " + M("x = " + F(x)) + ".",
{ ctx: "equation-2", guide: [GS("On égale les exposants et on regroupe : coefficient de " + M("x") + " ?", a - c, M(N(a) + " - " + NP(c) + " = " + N(a - c)) + "."), GS(M("x") + " = ?", x, M(F(x)) + ".")],
traps: [TR((d - b) / (a + c), "En passant " + M(N(c) + "x") + " à gauche, on le soustrait."), TR((d + b) / (a - c), "En passant " + N(b) + " à droite, on le soustrait.")] }); },
() => { const a = nz(-5, 5), b = nz(-8, 8), c = nz(-8, 8), op = pk(["<", "<=", ">", ">="]); if (Math.abs(a) === 1 || c === b) return null; const v = (c - b) / a, op2 = a > 0 ? op : FLIP[op], ivs = [ivOf(op2, v)];
return QS("Résous " + M("e^{" + pol([a, b], "x") + "} " + OPT[op] + " " + ex(c)) + ". Donne l'ensemble des solutions (intervalle).", ivs,
"L'exponentielle est strictement croissante : elle conserve l'ordre. " + M(pol([a, b], "x") + " " + OPT[op] + " " + N(c)) + (a < 0 ? " ; on divise par " + M(N(a)) + " (négatif) : le sens change" : "") + ". " + M("S = " + SolSet.show(ivs)) + ".",
{ ctx: "inequation", guide: [GS("Borne : " + M("x = ") + " ?", v, M(F(v)) + "."), GSS("Ensemble des solutions ?", ivs, M("S = " + SolSet.show(ivs)) + ".")],
traps: [TS([ivOf(FLIP[op2], v)], a < 0 ? "Diviser par un négatif change le sens de l'inégalité." : "L'exponentielle est croissante : le sens ne change pas."), TS([ivOf({ "<": "<=", "<=": "<", ">": ">=", ">=": ">" }[op2], v)], op2.length === 2 ? "Inégalité large : la borne est comprise (crochet fermé)." : "Inégalité stricte : la borne est exclue (crochet ouvert).")] }); },
() => { const a = nz(-4, 5), b = nz(-6, 6), c = nz(-4, 5), d = nz(-6, 6), k = a + b - c, m = 0; if (k === 0) return null; const e = "e^(" + k + "x)";
return QX("Simplifie " + M("A = \\frac{e^{" + pol([a, 0], "x") + "}" + X + "e^{" + pol([b, 0], "x") + "}}{e^{" + pol([c, 0], "x") + "}}") + " (écris le résultat sous la forme " + M("e^{\\dots}") + ").", e,
M("A = e^{" + N(a) + "x + " + NP(b) + "x - " + NP(c) + "x} = e^{" + pol([k, 0], "x") + "}") + ".",
{ ctx: "simplifier", guide: [GX("Exposant de " + M("A") + " ?", k + "x", M(pol([k, 0], "x")) + "."), GX(M("A") + " = ?", e, M("e^{" + pol([k, 0], "x") + "}") + ".")],
traps: [TX("e^(" + (a * b - c) + "x)", "Produit : on ajoute les exposants."), TX("e^(" + (a + b + c) + "x)", "Quotient : on soustrait l'exposant du bas.")] }); },
() => { const a = pk([2, 3, 4]), b = nz(-5, 5), k = a + b; if (k === 0) return null; const e = "e^(" + k + "x)";
return QX("Simplifie " + M("B = \\left(e^{x}\\right)^{" + a + "}" + X + "e^{" + pol([b, 0], "x") + "}") + ".", e, M("(e^x)^{" + a + "} = e^{" + a + "x}") + ", puis " + M("B = e^{" + a + "x + " + NP(b) + "x} = e^{" + pol([k, 0], "x") + "}") + ".",
{ ctx: "puissance-x", guide: [GX(M("(e^x)^{" + a + "}") + " = ?", "e^(" + a + "x)", M("e^{" + a + "x}") + "."), GX(M("B") + " = ?", e, M("e^{" + pol([k, 0], "x") + "}") + ".")],
traps: [TX("e^(" + a * b + "x^2)", "On ajoute les exposants : " + a + "x + " + b + "x."), TX("e^(" + (a + 1 + b) + "x)", "(e^x)^" + a + " = e^(" + a + "x).")] }); },
],
3: [
() => { const p = nz(-5, 5), q = nz(-5, 6); if (p === q) return null; const s = p + q, pr = p * q;
return QSet("Résous " + M("e^{x^2} = e^{" + pol([s, -pr], "x") + "}") + ". Donne les solutions séparées par « ; ».", [p, q],
M("x^2 = " + pol([s, -pr], "x") + " \\iff " + pol([1, -s, pr], "x") + " = 0 \\iff (x " + (p < 0 ? "+ " + -p : "- " + p) + ")(x " + (q < 0 ? "+ " + -q : "- " + q) + ") = 0") + " : " + M("x = " + p) + " ou " + M("x = " + q) + ".",
{ ctx: "equation-carre", guide: [GX("Équation du second degré obtenue (" + M("\\dots = 0") + ") : membre de gauche ?", polE([1, -s, pr], "x"), M(pol([1, -s, pr], "x")) + "."), GSet("Solutions ?", [p, q], M(p) + " et " + M(q) + ".")],
traps: [{ s: [-p, -q], m: "Vérifie les signes : (x − a) s'annule en a." }, { s: [s], m: "C'est une équation du second degré : deux solutions." }] }); },
() => { const a = nz(-6, 6), up = R.rand() < 0.5, k = pk([1, 2, 3]), op = pk([">", ">=", "<", "<="]), ivs = [ivOf(up ? op : FLIP[op], a)];
const fx = (up ? "(x " + (a < 0 ? "+ " + -a : "- " + a) + ")" : "(" + N(a) + " - x)") + "e^{" + (k === 1 ? "" : k) + "x}";
return QS("Résous " + M(fx + " " + OPT[op] + " 0") + ". Donne l'ensemble des solutions.", ivs,
"Pour tout réel " + M("x") + ", " + M("e^{" + (k === 1 ? "" : k) + "x} > 0") + " : le signe est celui de " + M(up ? "x - " + NP(a) : N(a) + " - x") + ". " + M("S = " + SolSet.show(ivs)) + ".",
{ ctx: "signe-produit", guide: [GS("Valeur qui annule le facteur affine ?", a, M(N(a)) + "."), GSS("Ensemble des solutions ?", ivs, M("S = " + SolSet.show(ivs)) + ".")],
traps: [TS([ivOf(up ? FLIP[op] : op, a)], up ? "x − a est positif pour x > a." : "a − x est positif pour x < a : attention au signe de x."), TS([[-Infinity, false, Infinity, false]], "L'exponentielle est positive, mais l'autre facteur change de signe.")] }); },
() => { const T0 = pk([60, 70, 75, 80]), amb = pk([18, 20, 22]), k = pk([0.04, 0.05, 0.06, 0.08, 0.1]), t = pk([5, 8, 10, 12, 15, 20]), v = amb + T0 * Math.exp(-k * t);
return QR("La température d'un café (en °C) au bout de " + M("t") + " minutes est " + M("T(t) = " + amb + " + " + T0 + "e^{-" + N(k) + "t}") + ". Calcule " + M("T(" + t + ")") + " (arrondi au dixième).", v, 0.1,
M("e^{-" + N(k) + X + t + "} = e^{" + N(rnd(-k * t)) + "} \\approx " + N(rnd(Math.exp(-k * t), 4))) + ", donc " + M("T(" + t + ") \\approx " + amb + " + " + T0 + X + N(rnd(Math.exp(-k * t), 4)) + " \\approx " + N(rnd(v, 1))) + " °C.",
{ ctx: "refroidissement", guide: [GR(M("e^{-" + N(k) + X + t + "}") + " (à 0,001 près) ?", Math.exp(-k * t), M("\\approx " + N(rnd(Math.exp(-k * t), 3))) + ".", 0.001), GR(M("T(" + t + ")") + " au dixième ?", v, M("\\approx " + N(rnd(v, 1))) + ".", 0.1)],
traps: [TR(rnd((amb + T0) * Math.exp(-k * t), 1), "Seul " + T0 + " est multiplié par l'exponentielle."), TR(rnd(amb + T0 * Math.exp(k * t), 1), "L'exposant est négatif : la température baisse."), TR(rnd(amb + T0 * (1 - k * t), 1), "Utilise la touche exp de la calculatrice.")] }); },
],
};


const vc = (a, b, nm = "u") => "\\vec{" + nm + "}\\begin{pmatrix} " + N(a) + " \\\\ " + N(b) + " \\end{pmatrix}";
const ANG = [["\\frac{\\pi}{3}", 0.5, "\\frac{1}{2}"], ["\\frac{2\\pi}{3}", -0.5, "-\\frac{1}{2}"], ["\\frac{\\pi}{4}", Math.SQRT1_2, "\\frac{\\sqrt{2}}{2}"], ["\\frac{3\\pi}{4}", -Math.SQRT1_2, "-\\frac{\\sqrt{2}}{2}"], ["\\frac{\\pi}{6}", Math.sqrt(3) / 2, "\\frac{\\sqrt{3}}{2}"], ["\\frac{5\\pi}{6}", -Math.sqrt(3) / 2, "-\\frac{\\sqrt{3}}{2}"]];
const TRIP = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [4, 3, 5], [12, 5, 13]];
const PS = {
1: [
() => { const a = nz(-6, 6), b = nz(-6, 6), c = nz(-6, 6), d = nz(-6, 6), v = a * c + b * d; if (v === 0) return null;
return QN("Dans un repère orthonormé, " + M(vc(a, b, "u")) + " et " + M(vc(c, d, "v")) + ". Calcule " + M("\\vec{u} \\cdot \\vec{v}") + ".", v,
M("\\vec{u} \\cdot \\vec{v} = xx' + yy' = " + N(a) + X + NP(c) + " + " + NP(b) + X + NP(d) + " = " + N(v)) + ".",
{ ctx: "coordonnees", guide: [GS(M("xx'") + " = ?", a * c, M(N(a * c)) + "."), GS(M("yy'") + " = ?", b * d, M(N(b * d)) + "."), GS(M("\\vec{u} \\cdot \\vec{v}") + " = ?", v, M(N(v)) + ".")],
traps: [TR(a * d + b * c, "On multiplie les abscisses entre elles, puis les ordonnées entre elles."), TR(a * c - b * d, "Les deux produits s'additionnent."), TR(a * b + c * d, "On combine " + M("\\vec{u}") + " avec " + M("\\vec{v}") + " : abscisse avec abscisse.")] }); },
() => { const p = R.int(2, 8), q = R.int(2, 9), A = pk(ANG), v = p * q * A[1];
return QN("On a " + M("\\lVert \\vec{u} \\rVert = " + p) + ", " + M("\\lVert \\vec{v} \\rVert = " + q) + " et l'angle " + M("(\\vec{u}, \\vec{v})") + " mesure " + M(A[0]) + " rad. Calcule " + M("\\vec{u} \\cdot \\vec{v}") + " (valeur exacte).", v,
M("\\vec{u} \\cdot \\vec{v} = \\lVert \\vec{u} \\rVert" + X + "\\lVert \\vec{v} \\rVert" + X + "\\cos\\theta = " + p + X + q + X + "\\left(" + A[2] + "\\right) = " + (() => {
const k = p * q, s = A[1] < 0 ? "-" : "", r = Math.abs(A[1]) === 0.5 ? "" : Math.abs(A[1]) < 0.75 ? "\\sqrt{2}" : "\\sqrt{3}";
return s + (k % 2 ? (r ? "\\frac{" + k + r + "}{2}" : "\\frac{" + k + "}{2}") : (k / 2 === 1 && r ? "" : k / 2) + r); })()) + ".",
{ ctx: "norme-angle", guide: [GS(M("\\cos " + A[0]) + " = ?", A[1], M(A[2]) + "."), GS(M("\\vec{u} \\cdot \\vec{v}") + " = ?", v, M(p * q + X + "\\left(" + A[2] + "\\right)") + ".")],
traps: [TR(p * q, "Il faut multiplier par le cosinus de l'angle."), TR(p * q * Math.sqrt(1 - A[1] ** 2), "C'est le cosinus, pas le sinus."), TR(-v, "Vérifie le signe du cosinus de cet angle.")] }); },
() => { const b = pk([2, -2, 3, -3, 4, 6, -4]), cc = nz(-6, 6), a = nz(-6, 6), m = (-a * cc) / b; if (!Number.isInteger(m) || m === 0 || Math.abs(m) === 1) return null;
return QN("Pour quelle valeur de " + M("m") + " les vecteurs " + M("\\vec{u}\\begin{pmatrix} m \\\\ " + N(a) + " \\end{pmatrix}") + " et " + M(vc(b, cc, "v")) + " sont-ils orthogonaux ?", m,
"Orthogonaux " + M("\\iff \\vec{u} \\cdot \\vec{v} = 0") + " : " + M(N(b) + "m + " + NP(a) + X + NP(cc) + " = 0") + ", " + M(N(b) + "m = " + N(-a * cc)) + ", " + M("m = " + N(m)) + ".",
{ ctx: "orthogonal", guide: [GS("Produit des ordonnées " + M(NP(a) + X + NP(cc)) + " ?", a * cc, M(N(a * cc)) + "."), GS(M("m") + " = ?", m, M(N(m)) + ".")],
traps: [TR(-m, "Passe " + N(a * cc) + " de l'autre côté : il change de signe."), TR((-a * b) / cc, "Abscisse avec abscisse, ordonnée avec ordonnée.")] }); },
],
2: [
() => { const t1 = pk(TRIP), t2 = pk(TRIP), s1 = [pk([1, -1]), pk([1, -1])], s2 = [pk([1, -1]), pk([1, -1])], u1 = [s1[0] * t1[0], s1[1] * t1[1]], v1 = [s2[0] * t2[0], s2[1] * t2[1]], dot = u1[0] * v1[0] + u1[1] * v1[1], v = dot / (t1[2] * t2[2]); if (dot === 0) return null;
return QN("Avec " + M(vc(u1[0], u1[1], "u")) + " et " + M(vc(v1[0], v1[1], "v")) + ", calcule " + M("\\cos(\\vec{u}, \\vec{v})") + " (fraction acceptée).", v,
M("\\vec{u} \\cdot \\vec{v} = " + N(dot)) + ", " + M("\\lVert \\vec{u} \\rVert = " + t1[2]) + ", " + M("\\lVert \\vec{v} \\rVert = " + t2[2]) + " : " + M("\\cos\\theta = \\frac{" + N(dot) + "}{" + t1[2] + X + t2[2] + "} = " + F(v)) + ".",
{ ctx: "cosinus", guide: [GS(M("\\vec{u} \\cdot \\vec{v}") + " = ?", dot, M(N(dot)) + "."), GS(M("\\lVert \\vec{u} \\rVert" + X + "\\lVert \\vec{v} \\rVert") + " = ?", t1[2] * t2[2], M(t1[2] + X + t2[2] + " = " + t1[2] * t2[2]) + "."), GS(M("\\cos\\theta") + " = ?", v, M(F(v)) + ".")],
traps: [TR(dot, "Divise par le produit des normes."), TR(dot / (t1[2] + t2[2]), "On divise par le produit des normes, pas leur somme."), TR(dot / (t1[2] ** 2 * t2[2] ** 2), "La norme est la racine de x² + y².")] }); },
() => { const b = R.int(3, 9), c = R.int(3, 9), A = pk([[60, 0.5, "\\frac{\\pi}{3}"], [120, -0.5, "\\frac{2\\pi}{3}"]]), bc2 = b * b + c * c - 2 * b * c * A[1], v = Math.sqrt(bc2); if (b === c && A[0] === 60) return null;
return QN("Dans le triangle " + M("ABC") + ", " + M("AB = " + c) + ", " + M("AC = " + b) + " et " + M("\\widehat{BAC} = " + A[2]) + " rad. Calcule " + M("BC") + " (valeur exacte).", v,
"Al-Kashi : " + M("BC^2 = AB^2 + AC^2 - 2" + X + "AB" + X + "AC" + X + "\\cos\\widehat{A} = " + c * c + " + " + b * b + " - 2" + X + c + X + b + X + "\\left(" + (A[1] > 0 ? "\\frac{1}{2}" : "-\\frac{1}{2}") + "\\right) = " + bc2) + ", donc " + M("BC = \\sqrt{" + bc2 + "}") + ".",
{ ctx: "al-kashi", fig: FIG.triAngles(["", "", A[0] === 60 ? "π/3" : "2π/3"], ["", String(b), String(c)], ["B", "C", "A"]), guide: [GS(M("BC^2") + " = ?", bc2, M(bc2) + "."), GS(M("BC") + " = ?", v, M("\\sqrt{" + bc2 + "}") + ".")],
traps: [TR(Math.sqrt(b * b + c * c), "Pythagore ne vaut que pour un angle droit : il manque le terme en cosinus."), TR(bc2, "C'est BC² : prends la racine."), TR(Math.sqrt(b * b + c * c + 2 * b * c * A[1]), "Al-Kashi : on soustrait 2 × AB × AC × cos A.")] }); },
() => { const a = R.int(2, 7), b = R.int(2, 8), s = R.int(Math.abs(a - b) + 1, a + b - 1), v = (s * s - a * a - b * b) / 2; if (v === 0) return null;
return QN("On sait que " + M("\\lVert \\vec{u} \\rVert = " + a) + ", " + M("\\lVert \\vec{v} \\rVert = " + b) + " et " + M("\\lVert \\vec{u} + \\vec{v} \\rVert = " + s) + ". Calcule " + M("\\vec{u} \\cdot \\vec{v}") + ".", v,
M("\\lVert \\vec{u} + \\vec{v} \\rVert^2 = \\lVert \\vec{u} \\rVert^2 + 2\\,\\vec{u} \\cdot \\vec{v} + \\lVert \\vec{v} \\rVert^2") + " : " + M(s * s + " = " + a * a + " + 2\\,\\vec{u} \\cdot \\vec{v} + " + b * b) + ", donc " + M("\\vec{u} \\cdot \\vec{v} = " + F(v)) + ".",
{ ctx: "polarisation", guide: [GS(M(s * s + " - " + a * a + " - " + b * b) + " = ?", s * s - a * a - b * b, M(N(s * s - a * a - b * b)) + "."), GS(M("\\vec{u} \\cdot \\vec{v}") + " = ?", v, M(F(v)) + " (on divise par 2).")],
traps: [TR(s * s - a * a - b * b, "Le double produit vaut 2 u·v : divise par 2."), TR((s - a - b) / 2, "Il faut les carrés des normes."), TR((a * a + b * b - s * s) / 2, "Isole bien u·v : " + s * s + " − " + a * a + " − " + b * b + ".")] }); },
() => { const ab = R.int(4, 10), ah = R.int(2, 7), same = R.rand() < 0.6, v = same ? ab * ah : -ab * ah;
return QN("Dans le triangle " + M("ABC") + ", " + M("H") + " est le projeté orthogonal de " + M("C") + " sur la droite " + M("(AB)") + ". On a " + M("AB = " + ab) + " et " + M("AH = " + ah) + ", " + (same ? M("H") + " étant sur la demi-droite " + M("[AB)") : M("H") + " et " + M("B") + " étant de part et d'autre de " + M("A")) + ". Calcule " + M("\\overrightarrow{AB} \\cdot \\overrightarrow{AC}") + ".", v,
M("\\overrightarrow{AB} \\cdot \\overrightarrow{AC} = \\overrightarrow{AB} \\cdot \\overrightarrow{AH}") + " (projection) " + M("= " + (same ? "" : "-") + "AB" + X + "AH = " + N(v)) + (same ? " (même sens)." : " (sens contraires)."),
{ ctx: "projection", fig: figProj(ab, ah, same), guide: [GS(M("AB" + X + "AH") + " = ?", ab * ah, M(ab * ah) + "."), GS(M("\\overrightarrow{AB} \\cdot \\overrightarrow{AC}") + " = ?", v, M(N(v)) + (same ? " : même sens." : " : sens contraires, produit négatif."))],
traps: [TR(-v, same ? "AB et AH sont de même sens : produit positif." : "AB et AH sont de sens contraires : produit négatif."), TR(ab * ab, "On projette C sur (AB) : c'est AH qui compte, pas AB²."), TR(ab + ah, "C'est un produit.")] }); },
],
3: [
() => { const A = [nz(-4, 4), nz(-4, 4)], uu = pk([[1, 2], [2, 1], [1, -1], [2, -1], [1, 3], [3, -1], [1, 1]]), t = nz(-3, 3), s = nz(-2, 2), H = [A[0] + t * uu[0], A[1] + t * uu[1]], Mp = [H[0] - s * uu[1], H[1] + s * uu[0]], AM = [Mp[0] - A[0], Mp[1] - A[1]], dot = AM[0] * uu[0] + AM[1] * uu[1], n2 = uu[0] ** 2 + uu[1] ** 2;
return QP("La droite " + M("d") + " passe par " + M("A(" + A[0] + " \\,;\\, " + A[1] + ")") + " et a pour vecteur directeur " + M(vc(uu[0], uu[1])) + ". Donne les coordonnées du projeté orthogonal " + M("H") + " de " + M("M(" + Mp[0] + " \\,;\\, " + Mp[1] + ")") + " sur " + M("d") + " (sous la forme « x ; y »).", H,
M("H = A + t\\vec{u}") + " avec " + M("t = \\frac{\\overrightarrow{AM} \\cdot \\vec{u}}{\\lVert \\vec{u} \\rVert^2} = \\frac{" + dot + "}{" + n2 + "} = " + t) + " : " + M("H(" + H[0] + " \\,;\\, " + H[1] + ")") + ".",
{ ctx: "projete", guide: [GS(M("\\overrightarrow{AM} \\cdot \\vec{u}") + " = ?", dot, M(dot) + "."), GS(M("t") + " = ?", t, M("\\frac{" + dot + "}{" + n2 + "} = " + t) + "."), GP("Coordonnées de " + M("H") + " ?", H, M("(" + H[0] + " \\,;\\, " + H[1] + ")") + ".")],
traps: [{ spec: { kind: "pair", values: [A[0] + dot * uu[0], A[1] + dot * uu[1]] }, m: "Il faut diviser AM · u par ‖u‖² = " + n2 + " pour obtenir t." }, { spec: { kind: "pair", values: [H[1], H[0]] }, m: "Abscisse d'abord, ordonnée ensuite." }, { spec: { kind: "pair", values: Mp }, m: "C'est le point M ; on cherche son projeté sur la droite." }] }); },
() => { const a = R.int(2, 7), b = R.int(2, 7), p = nz(-12, 15), v = a * a + 2 * p + b * b; if (v <= 0) return null;
return QN("On sait que " + M("\\lVert \\vec{u} \\rVert = " + a) + ", " + M("\\lVert \\vec{v} \\rVert = " + b) + " et " + M("\\vec{u} \\cdot \\vec{v} = " + N(p)) + ". Calcule " + M("\\lVert \\vec{u} + \\vec{v} \\rVert^2") + ".", v,
M("\\lVert \\vec{u} + \\vec{v} \\rVert^2 = \\lVert \\vec{u} \\rVert^2 + 2\\,\\vec{u} \\cdot \\vec{v} + \\lVert \\vec{v} \\rVert^2 = " + a * a + " + " + NP(2 * p) + " + " + b * b + " = " + v) + ".",
{ ctx: "norme-somme", guide: [GS(M("2\\,\\vec{u} \\cdot \\vec{v}") + " = ?", 2 * p, M(N(2 * p)) + "."), GS(M("\\lVert \\vec{u} + \\vec{v} \\rVert^2") + " = ?", v, M(v) + ".")],
traps: [TR(a * a + b * b + p, "Comme (a + b)² : le double produit est 2 u·v."), TR(a * a + b * b, "Les vecteurs ne sont pas orthogonaux : il reste 2 u·v."), TR((a + b) ** 2, "Il faut le produit scalaire, pas le produit des normes.")] }); },
() => { const a = R.int(2, 6), b = R.int(2, 6), p = nz(-10, 10), k = pk([2, 3]), v = a * a + (k - 1) * p - k * b * b;
return QN("On sait que " + M("\\lVert \\vec{u} \\rVert = " + a) + ", " + M("\\lVert \\vec{v} \\rVert = " + b) + " et " + M("\\vec{u} \\cdot \\vec{v} = " + N(p)) + ". Calcule " + M("(\\vec{u} + " + k + "\\vec{v}) \\cdot (\\vec{u} - \\vec{v})") + ".", v,
"On développe : " + M("\\vec{u} \\cdot \\vec{u} - \\vec{u} \\cdot \\vec{v} + " + k + "\\,\\vec{v} \\cdot \\vec{u} - " + k + "\\,\\vec{v} \\cdot \\vec{v} = " + a * a + " + " + (k - 1) + X + NP(p) + " - " + k + X + b * b + " = " + N(v)) + ".",
{ ctx: "developper", guide: [GS("Coefficient de " + M("\\vec{u} \\cdot \\vec{v}") + " après développement ?", k - 1, M("-1 + " + k + " = " + (k - 1)) + "."), GS("Résultat ?", v, M(N(v)) + ".")],
traps: [TR(a * a - k * b * b, "Les termes croisés ne s'annulent pas : " + (k - 1) + " u·v."), TR(a * a + (k - 1) * p - k * b, "v·v = ‖v‖² = " + b * b + "."), TR(a * a + (k + 1) * p - k * b * b, "−u·v + " + k + " v·u = " + (k - 1) + " u·v.")] }); },
],
};


const PCTX = [
["M", "la personne est atteinte de la maladie", "T", "le test est positif", "On fait un test de dépistage sur une personne choisie au hasard.", "depistage", [[0.02, 0.05, 0.1, 0.15], [0.9, 0.95, 0.98, 0.99], [0.02, 0.03, 0.05, 0.1]]],
["W", "il pleut", "R", "Inès arrive en retard", "Inès va au lycée à vélo ou en bus selon la météo. On choisit un jour au hasard.", "retard", [[0.2, 0.25, 0.3, 0.35, 0.4], [0.2, 0.25, 0.3, 0.4], [0.05, 0.1, 0.15]]],
["A", "la pièce sort de l'atelier A (sinon de l'atelier B)", "D", "la pièce est défectueuse", "Une usine fabrique des pièces dans deux ateliers. On prend une pièce au hasard.", "usine", [[0.4, 0.45, 0.55, 0.6, 0.7], [0.02, 0.03, 0.04, 0.05], [0.01, 0.06, 0.08, 0.1]]],
["F", "le client a la carte de fidélité", "C", "le client paie sans contact", "On choisit au hasard un client d'une boulangerie.", "boulangerie", [[0.3, 0.35, 0.4, 0.45, 0.6], [0.6, 0.7, 0.75, 0.8], [0.4, 0.45, 0.5, 0.55]]],
["D", "le skieur est débutant", "C", "il chute dans la journée", "On interroge au hasard un skieur d'une station des Alpes.", "ski", [[0.15, 0.2, 0.25, 0.3], [0.6, 0.7, 0.75, 0.8], [0.1, 0.15, 0.2, 0.3]]],
["L", "l'élève est en option latin", "S", "l'élève fait partie de l'association sportive", "On choisit au hasard un élève d'un lycée de Lyon.", "lycee", [[0.1, 0.15, 0.2, 0.25], [0.3, 0.35, 0.4, 0.45], [0.2, 0.25, 0.3]]],
];

const dP = (v) => N(rnd(v, 6));
const ev = (c) => "Évènements : " + M(c[0]) + " « " + c[1] + " » et " + M(c[2]) + " « " + c[3] + " ». ";

const revele = (p, q, r, v) => [p, 1 - p, q, 1 - q, r, 1 - r].some((x) => Math.abs(x - v) < 1e-9);
const PT = {
1: [
() => { const c = pk(PCTX), pA = pk(c[6][0]), pBA = pk(c[6][1]), pBn = pk(c[6][2]), v = rnd(pA * pBA); if (revele(pA, pBA, pBn, v)) return null;
return QN(c[4] + " " + ev(c) + "On a " + M("P(" + c[0] + ") = " + dP(pA)) + " et " + M("P_{" + c[0] + "}(" + c[2] + ") = " + dP(pBA)) + ". Calcule " + M("P(" + c[0] + " \\cap " + c[2] + ")") + ".", v,
"On suit la branche " + M(c[0]) + " puis " + M(c[2]) + " : " + M("P(" + c[0] + " \\cap " + c[2] + ") = P(" + c[0] + ")" + X + "P_{" + c[0] + "}(" + c[2] + ") = " + dP(pA) + X + dP(pBA) + " = " + dP(v)) + ".",
{ ctx: c[5], fig: figTree([pA, pBA, pBn], c[0], c[2], [2, 5]), guide: [GS(M("P(" + c[0] + " \\cap " + c[2] + ")") + " = ?", v, M(dP(pA) + X + dP(pBA) + " = " + dP(v)) + ".")],
traps: [TR(rnd(pA + pBA), "Le long d'une branche, on multiplie."), TR(pBA, "P_" + c[0] + "(" + c[2] + ") est une probabilité sachant " + c[0] + " : il faut encore multiplier par P(" + c[0] + ")."), TR(rnd(pA * pBn), "Prends la branche " + c[2] + " issue de " + c[0] + ".")] }); },
() => { const c = pk(PCTX), pA = pk(c[6][0]), pBA = pk(c[6][1]), pBn = pk(c[6][2]), v = rnd((1 - pA) * pBn); if (revele(pA, pBA, pBn, v)) return null;
return QN(c[4] + " " + ev(c) + "Calcule " + M("P(\\overline{" + c[0] + "} \\cap " + c[2] + ")") + " à l'aide de l'arbre.", v,
M("P(\\overline{" + c[0] + "}) = 1 - " + dP(pA) + " = " + dP(1 - pA)) + ", puis " + M("P(\\overline{" + c[0] + "} \\cap " + c[2] + ") = " + dP(1 - pA) + X + dP(pBn) + " = " + dP(v)) + ".",
{ ctx: c[5], fig: figTree([pA, pBA, pBn], c[0], c[2], [3]), guide: [GS(M("P(\\overline{" + c[0] + "})") + " = ?", rnd(1 - pA), M(dP(1 - pA)) + "."), GS(M("P(\\overline{" + c[0] + "} \\cap " + c[2] + ")") + " = ?", v, M(dP(v)) + ".")],
traps: [TR(rnd(pA * pBn), "La branche " + c[0] + "̄ a pour probabilité 1 − " + dTxt(pA) + "."), TR(rnd((1 - pA) * pBA), "Sur la branche " + c[0] + "̄, la probabilité de " + c[2] + " est " + dTxt(pBn) + "."), TR(rnd(1 - pA + pBn), "On multiplie le long de la branche.")] }); },
() => { const c = pk(PCTX), pA = pk(c[6][0]), pBA = pk(c[6][1]), inter = rnd(pA * pBA);
return QN(c[4] + " " + ev(c) + "On sait que " + M("P(" + c[0] + ") = " + dP(pA)) + " et " + M("P(" + c[0] + " \\cap " + c[2] + ") = " + dP(inter)) + ". Calcule " + M("P_{" + c[0] + "}(" + c[2] + ")") + ".", pBA,
M("P_{" + c[0] + "}(" + c[2] + ") = \\frac{P(" + c[0] + " \\cap " + c[2] + ")}{P(" + c[0] + ")} = \\frac{" + dP(inter) + "}{" + dP(pA) + "} = " + dP(pBA)) + ".",
{ ctx: c[5] + "-cond", guide: [GS(M("P_{" + c[0] + "}(" + c[2] + ")") + " = ?", pBA, M("\\frac{" + dP(inter) + "}{" + dP(pA) + "} = " + dP(pBA)) + ".")],
traps: [TR(rnd(inter * pA), "On divise par P(" + c[0] + "), on ne multiplie pas."), TR(rnd(pA / inter), "C'est P(" + c[0] + " ∩ " + c[2] + ") divisé par P(" + c[0] + ")."), TR(inter, "P(" + c[0] + " ∩ " + c[2] + ") n'est pas P_" + c[0] + "(" + c[2] + ").")] }); },
],
2: [
() => { const c = pk(PCTX), pA = pk(c[6][0]), pBA = pk(c[6][1]), pBn = pk(c[6][2]), i1 = rnd(pA * pBA), i2 = rnd((1 - pA) * pBn), v = rnd(i1 + i2); if (revele(pA, pBA, pBn, v)) return null; if (pBA === pBn) return null;
return QN(c[4] + " " + ev(c) + "Calcule " + M("P(" + c[2] + ")") + " (formule des probabilités totales).", v,
M("P(" + c[2] + ") = P(" + c[0] + " \\cap " + c[2] + ") + P(\\overline{" + c[0] + "} \\cap " + c[2] + ") = " + dP(pA) + X + dP(pBA) + " + " + dP(1 - pA) + X + dP(pBn) + " = " + dP(v)) + ".",
{ ctx: c[5] + "-totales", fig: figTree([pA, pBA, pBn], c[0], c[2], [3, 4, 5]), guide: [GS(M("P(" + c[0] + " \\cap " + c[2] + ")") + " = ?", i1, M(dP(i1)) + "."), GS(M("P(\\overline{" + c[0] + "} \\cap " + c[2] + ")") + " = ?", i2, M(dP(i2)) + "."), GS(M("P(" + c[2] + ")") + " = ?", v, M(dP(v)) + ".")],
traps: [TR(i1, "Il y a deux chemins qui mènent à " + c[2] + " : on additionne."), TR(rnd(pBA + pBn), "Chaque chemin se pondère par la première branche."), TR(rnd(pA * pBA + pA * pBn), "La deuxième branche part de " + c[0] + "̄, de probabilité " + dTxt(1 - pA) + ".")] }); },
() => { const c = pk(PCTX), pA = pk(c[6][0]), pBA = pk(c[6][1]), pBn = pk(c[6][2]), i1 = pA * pBA, pB = i1 + (1 - pA) * pBn, v = i1 / pB; if (revele(pA, pBA, pBn, v)) return null; if (pBA === pBn) return null;
return QR(c[4] + " " + ev(c) + "Sachant que " + M(c[2]) + " est réalisé, quelle est la probabilité de " + M(c[0]) + " ? Calcule " + M("P_{" + c[2] + "}(" + c[0] + ")") + " (arrondi au millième).", v, 0.001,
M("P(" + c[2] + ") = " + dP(rnd(pB))) + " (probabilités totales) puis " + M("P_{" + c[2] + "}(" + c[0] + ") = \\frac{P(" + c[0] + " \\cap " + c[2] + ")}{P(" + c[2] + ")} = \\frac{" + dP(rnd(i1)) + "}{" + dP(rnd(pB)) + "} \\approx " + N(rnd(v, 3))) + ".",
{ ctx: c[5] + "-inverse", fig: figTree([pA, pBA, pBn], c[0], c[2], [3, 4, 5]), guide: [GS(M("P(" + c[0] + " \\cap " + c[2] + ")") + " = ?", rnd(i1), M(dP(rnd(i1))) + "."), GS(M("P(" + c[2] + ")") + " = ?", rnd(pB), M(dP(rnd(pB))) + "."), GR(M("P_{" + c[2] + "}(" + c[0] + ")") + " au millième ?", v, M("\\approx " + N(rnd(v, 3))) + ".", 0.001)],
traps: [TR(pBA, "C'est P_" + c[0] + "(" + c[2] + ") ; on demande l'inverse : P_" + c[2] + "(" + c[0] + ")."), TR(rnd(i1, 3), "Divise par P(" + c[2] + ")."), TR(rnd(i1 / pA, 3), "On divise par P(" + c[2] + "), l'évènement connu.")] }); },
() => { const c = pk([["A", "Lina réussit son premier lancer franc", "B", "Lina réussit son second lancer franc", "basket"], ["A", "le bus de 7 h 40 est à l'heure", "B", "le TER de 8 h 05 est à l'heure", "transports"], ["A", "le dé rouge donne 6", "B", "la pièce donne pile", "jeu"]]), pA = pk([0.3, 0.4, 0.6, 0.7, 0.8, 0.75]), pB = pk([0.5, 0.6, 0.65, 0.85, 0.9, 0.2]), inter = rnd(pA * pB), v = rnd(pA + pB - inter);
return QN("Les évènements " + M("A") + " « " + c[1] + " » et " + M("B") + " « " + c[3] + " » sont indépendants, avec " + M("P(A) = " + dP(pA)) + " et " + M("P(B) = " + dP(pB)) + ". Calcule " + M("P(A \\cup B)") + ".", v,
"Indépendants : " + M("P(A \\cap B) = P(A)" + X + "P(B) = " + dP(inter)) + ". Puis " + M("P(A \\cup B) = P(A) + P(B) - P(A \\cap B) = " + dP(v)) + ".",
{ ctx: c[4], guide: [GS(M("P(A \\cap B)") + " = ?", inter, M(dP(inter)) + "."), GS(M("P(A \\cup B)") + " = ?", v, M(dP(v)) + ".")],
traps: [TR(rnd(pA + pB), "On a compté deux fois A ∩ B : retire-le."), TR(inter, "C'est P(A ∩ B) ; on demande la réunion."), TR(rnd(1 - inter), "P(A ∪ B) = P(A) + P(B) − P(A ∩ B).")] }); },
],
3: [
() => { const c = pk(PCTX), pA = pk(c[6][0]), pBA = pk(c[6][1]), pBn = pk(c[6][2]), pB = rnd(pA * pBA + (1 - pA) * pBn); if (pBA === pBn) return null;
return QN(c[4] + " " + ev(c) + "On sait que " + M("P(" + c[0] + ") = " + dP(pA)) + ", " + M("P_{" + c[0] + "}(" + c[2] + ") = " + dP(pBA)) + " et " + M("P(" + c[2] + ") = " + dP(pB)) + ". Calcule " + M("P_{\\overline{" + c[0] + "}}(" + c[2] + ")") + ".", pBn,
M("P(\\overline{" + c[0] + "} \\cap " + c[2] + ") = P(" + c[2] + ") - P(" + c[0] + " \\cap " + c[2] + ") = " + dP(pB) + " - " + dP(rnd(pA * pBA)) + " = " + dP(rnd(pB - pA * pBA))) + ", puis on divise par " + M("P(\\overline{" + c[0] + "}) = " + dP(1 - pA)) + " : " + M(dP(pBn)) + ".",
{ ctx: c[5] + "-retrouver", fig: figTree([pA, pBA, pBn], c[0], c[2], [2, 3, 4, 5]), guide: [GS(M("P(" + c[0] + " \\cap " + c[2] + ")") + " = ?", rnd(pA * pBA), M(dP(rnd(pA * pBA))) + "."), GS(M("P(\\overline{" + c[0] + "} \\cap " + c[2] + ")") + " = ?", rnd(pB - pA * pBA), M(dP(rnd(pB - pA * pBA))) + "."), GS(M("P_{\\overline{" + c[0] + "}}(" + c[2] + ")") + " = ?", pBn, M(dP(pBn)) + ".")],
traps: [TR(rnd(pB - pA * pBA), "C'est P(" + c[0] + "̄ ∩ " + c[2] + ") : divise par P(" + c[0] + "̄)."), TR(rnd(pB - pBA), "Utilise la formule des probabilités totales.")] }); },
() => { const sh = pk([[0.5, 0.3, 0.2], [0.4, 0.35, 0.25], [0.6, 0.25, 0.15], [0.45, 0.35, 0.2]]), df = [pk([0.01, 0.02, 0.03]), pk([0.02, 0.04, 0.05]), pk([0.01, 0.03, 0.06])], parts = sh.map((s, i) => rnd(s * df[i])), v = rnd(parts[0] + parts[1] + parts[2]);
return QN("Trois machines A, B, C produisent respectivement " + M(N(sh[0] * 100) + "\\,\\%") + ", " + M(N(sh[1] * 100) + "\\,\\%") + " et " + M(N(sh[2] * 100) + "\\,\\%") + " des stylos d'une usine. Leurs taux de stylos défectueux sont " + M(N(df[0] * 100) + "\\,\\%") + ", " + M(N(df[1] * 100) + "\\,\\%") + " et " + M(N(df[2] * 100) + "\\,\\%") + ". On prend un stylo au hasard : probabilité qu'il soit défectueux ?", v,
"Probabilités totales (trois branches) : " + M(sh.map((s, i) => dP(s) + X + dP(df[i])).join(" + ") + " = " + dP(v)) + ".",
{ ctx: "trois-machines", guide: [GS("Branche A : " + M(dP(sh[0]) + X + dP(df[0])) + " = ?", parts[0], M(dP(parts[0])) + "."), GS("Branches B et C ensemble ?", rnd(parts[1] + parts[2]), M(dP(parts[1]) + " + " + dP(parts[2]) + " = " + dP(rnd(parts[1] + parts[2]))) + "."), GS("Probabilité totale ?", v, M(dP(v)) + ".")],
traps: [TR(rnd(df[0] + df[1] + df[2]), "Chaque taux est pondéré par la part de la machine."), TR(rnd((df[0] + df[1] + df[2]) / 3), "Les machines ne produisent pas autant : pondère par leurs parts."), TR(parts[0], "Il y a trois branches à additionner.")] }); },
() => { const p = pk([0.1, 0.2, 0.3, 0.15, 0.25, 0.4]), n = R.int(2, 4), c = pk([["Un archer touche le centre de la cible avec la probabilité", "tirs", "qu'il touche le centre au moins une fois", "archer"], ["À chaque achat, le code promo imprimé sur le ticket est gagnant avec la probabilité", "achats", "d'obtenir au moins un code gagnant", "promo"], ["Un panneau solaire tombe en panne dans l'année avec la probabilité", "panneaux indépendants", "qu'au moins un panneau tombe en panne", "panneaux"]]), q = rnd(1 - p), v = 1 - q ** n;


if (Math.abs(((v * 1000) % 1) - 0.5) < 1e-6) return null;
return QR(c[0] + " " + M(dP(p)) + ". On considère " + M(n) + " " + c[1] + " (épreuves indépendantes). Probabilité " + c[2] + " ? (au millième)", v, 0.001,
"L'évènement contraire est « jamais » : " + M(dP(q) + "^{" + n + "}") + ". Donc " + M("P = 1 - " + dP(q) + "^{" + n + "} \\approx " + N(rnd(v, 3))) + ".",
{ ctx: c[3], guide: [GR("Probabilité de « jamais » (au millième) ?", q ** n, M(dP(q) + "^{" + n + "} \\approx " + N(rnd(q ** n, 3))) + ".", 0.001), GR("Probabilité cherchée ?", v, M("\\approx " + N(rnd(v, 3))) + ".", 0.001)],
traps: [TR(rnd(n * p, 3), "On ne peut pas additionner : passe par l'évènement contraire."), TR(rnd(p ** n, 3), "p^" + n + " : succès à chaque fois. On veut au moins un succès."), TR(rnd(1 - p ** n, 3), "Le contraire de « au moins un succès » est « aucun succès » : " + dTxt(q) + "^" + n + ".")] }); },
],
};


const law = (k) => { for (let t = 0; t < 200; t++) { const ps = Array.from({ length: k - 1 }, () => R.int(1, 7) * 0.05), s = rnd(ps.reduce((a, b) => a + b)); if (s < 0.95 && s > 0.3) return ps.concat(rnd(1 - s)).map((x) => rnd(x)); } return [0.2, 0.3, 0.5].slice(0, k); };
const vals = (k) => { const s = new Set(); while (s.size < k) s.add(R.int(-5, 12)); return [...s].sort((a, b) => a - b); };
const EXX = (xs, ps) => rnd(xs.reduce((a, x, i) => a + x * ps[i], 0));
const VA = {
1: [
() => { const k = pk([3, 4]), xs = vals(k), ps = law(k), j = R.int(0, k - 1), sh = ps.map((p, i) => (i === j ? "p" : p)), s = rnd(1 - ps[j]);
return QN("Une variable aléatoire " + M("X") + " a la loi suivante. Que vaut " + M("p") + " ?<br>" + tab(xs, sh), ps[j],
"La somme des probabilités vaut 1 : " + M("p = 1 - " + dP(s) + " = " + dP(ps[j])) + ".",
{ ctx: "loi-manquante", guide: [GS("Somme des probabilités connues ?", s, M(dP(s)) + "."), GS(M("p") + " = ?", ps[j], M(dP(ps[j])) + ".")],
traps: [TR(s, "La somme de toutes les probabilités vaut 1 : p = 1 − " + dTxt(s) + "."), TR(rnd(1 / k), "Les issues ne sont pas équiprobables.")] }); },
() => { const k = pk([3, 4]), xs = vals(k), ps = law(k), E = EXX(xs, ps); if (E === 0) return null;
return QN("Calcule l'espérance " + M("E(X)") + " de la variable aléatoire " + M("X") + " de loi :<br>" + tab(xs, ps), E,
M("E(X) = " + xs.map((x, i) => NP(x) + X + dP(ps[i])).join(" + ") + " = " + dP(E)) + ".",
{ ctx: "esperance", guide: [GS("Produit " + M(NP(xs[0]) + X + dP(ps[0])) + " ?", rnd(xs[0] * ps[0]), M(dP(rnd(xs[0] * ps[0]))) + "."), GS(M("E(X)") + " = ?", E, M(dP(E)) + ".")],
traps: [TR(rnd(xs.reduce((a, b) => a + b) / k), "C'est une moyenne pondérée par les probabilités."), TR(rnd(xs.reduce((a, b) => a + b)), "Multiplie chaque valeur par sa probabilité.")] }); },
() => { const k = 4, xs = vals(k), ps = law(k), j = R.int(1, 2), op = pk(["\\leqslant", "<", ">", "\\geqslant"]), sel = xs.map((x, i) => (op === "\\leqslant" ? i <= j : op === "<" ? i < j : op === ">" ? i > j : i >= j)), v = rnd(ps.reduce((a, p, i) => a + (sel[i] ? p : 0), 0)), alt = rnd(ps.reduce((a, p, i) => a + ((op === "\\leqslant" ? i < j : op === "<" ? i <= j : op === ">" ? i >= j : i > j) ? p : 0), 0));
return QN("Avec la loi ci-dessous, calcule " + M("P(X " + op + " " + N(xs[j]) + ")") + ".<br>" + tab(xs, ps), v,
"On additionne les probabilités des valeurs " + M(xs.filter((x, i) => sel[i]).map(N).join(", ")) + " : " + M(dP(v)) + ".",
{ ctx: "p-x-inf", guide: [GS("Probabilité cherchée ?", v, M(ps.filter((p, i) => sel[i]).map(dP).join(" + ") + " = " + dP(v)) + ".")],
traps: [TR(alt, op === "\\leqslant" || op === "\\geqslant" ? "Avec ⩽ ou ⩾, la valeur " + xs[j] + " est comprise." : "Inégalité stricte : la valeur " + xs[j] + " est exclue."), TR(ps[j], "On cumule plusieurs valeurs.")] }); },
],
2: [
() => { const xs = vals(3), ps = law(3), E = EXX(xs, ps), E2 = EXX(xs.map((x) => x * x), ps), V = rnd(E2 - E * E); if (V <= 0) return null;
return QN("Calcule la variance " + M("V(X)") + " de la variable aléatoire " + M("X") + " de loi :<br>" + tab(xs, ps), V,
M("E(X) = " + dP(E)) + ", " + M("E(X^2) = " + dP(E2)) + ", donc " + M("V(X) = E(X^2) - E(X)^2 = " + dP(E2) + " - " + NP(E) + "^2 = " + dP(V)) + ".",
{ ctx: "variance", guide: [GS(M("E(X)") + " = ?", E, M(dP(E)) + "."), GS(M("E(X^2)") + " = ?", E2, M(dP(E2)) + "."), GS(M("V(X)") + " = ?", V, M(dP(V)) + ".")],
traps: [TR(E2, "C'est E(X²) : retire E(X)²."), TR(rnd(E2 - E), "On retire le carré de l'espérance."), TR(rnd(Math.sqrt(V), 4), "C'est l'écart type ; on demande la variance.")] }); },
() => { const m = pk([1, 2, 3, 4, 5]), W = pk([10, 12, 15, 20]), w = pk([2, 3, 4, 5]), G = (W + 2 * w) / 6, E = G - m; if (Math.abs(E) < 1e-9) return null;
return QN("À une kermesse, on paie " + M(m + " \\text{ €}") + " pour lancer un dé équilibré. On gagne " + M(W + " \\text{ €}") + " si le dé donne 6, " + M(w + " \\text{ €}") + " s'il donne 4 ou 5, rien sinon. " + M("G") + " est le gain algébrique (gain moins mise). Calcule " + M("E(G)") + " (fraction acceptée).", E,
"Gains nets : " + M(N(W - m)) + " (probabilité " + M("\\frac{1}{6}") + "), " + M(N(w - m)) + " (probabilité " + M("\\frac{2}{6}") + "), " + M(N(-m)) + " (probabilité " + M("\\frac{3}{6}") + "). " + M("E(G) = \\frac{" + (W - m) + " + 2" + X + NP(w - m) + " + 3" + X + NP(-m) + "}{6} = " + F(E)) + ".",
{ ctx: "kermesse", guide: [GS("Gain net si on obtient 6 ?", W - m, M(W + " - " + m + " = " + (W - m)) + "."), GS("Gain net si on n'obtient ni 4, ni 5, ni 6 ?", -m, M(N(-m)) + "."), GS(M("E(G)") + " = ?", E, M(F(E)) + ".")],
traps: [TR(G, "Il faut retirer la mise de " + m + " € à chaque partie."), TR((W + w) / 6 - m, "4 ou 5 : deux faces sur six."), TR((W + 2 * w - m) / 6, "La mise est payée à chaque partie, même gagnante.")] }); },
() => { const xs = vals(3), ps = law(3), E = EXX(xs, ps), V = rnd(EXX(xs.map((x) => x * x), ps) - E * E), s = Math.sqrt(V); if (V <= 0) return null;
return QR("Calcule l'écart type " + M("\\sigma(X)") + " (arrondi au centième) pour la loi :<br>" + tab(xs, ps), s, 0.01,
M("V(X) = " + dP(V)) + " donc " + M("\\sigma(X) = \\sqrt{" + dP(V) + "} \\approx " + N(rnd(s, 2))) + ".",
{ ctx: "ecart-type", guide: [GS(M("E(X)") + " = ?", E, M(dP(E)) + "."), GS(M("V(X)") + " = ?", V, M(dP(V)) + "."), GR(M("\\sigma(X)") + " (au centième) ?", s, M("\\approx " + N(rnd(s, 2))) + ".", 0.01)],
traps: [TR(rnd(V, 2), "L'écart type est la racine carrée de la variance."), TR(rnd(Math.sqrt(EXX(xs.map((x) => x * x), ps)), 2), "Retire E(X)² avant de prendre la racine.")] }); },
],
3: [
() => { const r = R.int(2, 6), b = R.int(2, 6), g = R.int(1, 4), n = r + b + g, Wr = pk([2, 3, 4, 5]), Wg = pk([10, 12, 15, 20]), m = (r * Wr + g * Wg) / n;
return QN("Une urne contient " + M(r) + " boules rouges, " + M(b) + " bleues et " + M(g) + " vertes. On tire une boule : une rouge rapporte " + M(Wr + " \\text{ €}") + ", une verte " + M(Wg + " \\text{ €}") + ", une bleue rien. Quelle mise rend le jeu équitable (espérance du gain net nulle) ? (fraction acceptée)", m,
"Espérance des gains : " + M("\\frac{" + r + X + Wr + " + " + g + X + Wg + "}{" + n + "} = " + F(m)) + ". Le jeu est équitable si la mise vaut " + M(F(m) + " \\text{ €}") + ".",
{ ctx: "urne-equitable", guide: [GS("Nombre total de boules ?", n, M(n) + "."), GS("Espérance du gain (sans la mise) ?", m, M(F(m)) + "."), GS("Mise équitable ?", m, M(F(m)) + " €.")],
traps: [TR((Wr + Wg) / 3, "Pondère chaque gain par la probabilité de la couleur."), TR((Wr + Wg) / 2, "Les couleurs n'ont pas la même probabilité."), TR((r * Wr + g * Wg) / (r + g), "Il y a aussi les " + b + " boules bleues dans l'urne.")] }); },
() => { const ps = law(3), x1 = nz(-6, 2), x2 = R.int(1, 5), a = R.int(6, 15), E = rnd(x1 * ps[0] + x2 * ps[1] + a * ps[2]); if (x2 === x1) return null;
return QN("Une variable aléatoire " + M("X") + " a la loi ci-dessous et " + M("E(X) = " + dP(E)) + ". Calcule " + M("a") + ".<br>" + tab([x1, x2, "a"], ps), a,
M(NP(x1) + X + dP(ps[0]) + " + " + NP(x2) + X + dP(ps[1]) + " + " + dP(ps[2]) + "a = " + dP(E)) + " donc " + M(dP(ps[2]) + "a = " + dP(rnd(E - x1 * ps[0] - x2 * ps[1]))) + " et " + M("a = " + a) + ".",
{ ctx: "valeur-inconnue", guide: [GS("Somme des deux premiers produits ?", rnd(x1 * ps[0] + x2 * ps[1]), M(dP(rnd(x1 * ps[0] + x2 * ps[1]))) + "."), GS(M(dP(ps[2]) + "a") + " = ?", rnd(E - x1 * ps[0] - x2 * ps[1]), M(dP(rnd(E - x1 * ps[0] - x2 * ps[1]))) + "."), GS(M("a") + " = ?", a, M(a) + ".")],
traps: [TR(rnd(E - x1 * ps[0] - x2 * ps[1]), "Divise encore par " + dTxt(ps[2]) + "."), TR(rnd(E / ps[2]), "Retire d'abord les deux autres produits.")] }); },
() => { const E = pk([4, 5, 6, 8, 12, 15]), V = pk([2, 3, 4, 5, 6]), a = pk([8, 10, 12, 15, 20]), b = pk([20, 30, 40, 50]), what = pk(["E", "V"]), v = what === "E" ? a * E - b : a * a * V;
return QN("Le nombre " + M("X") + " de clients servis par heure dans un food-truck vérifie " + M("E(X) = " + E) + " et " + M("V(X) = " + V) + ". La recette horaire, en euros, est " + M("R = " + a + "X - " + b) + " (frais fixes déduits). Calcule " + M(what === "E" ? "E(R)" : "V(R)") + ".", v,
what === "E" ? "Linéarité : " + M("E(aX + b) = aE(X) + b") + " : " + M("E(R) = " + a + X + E + " - " + b + " = " + v) + "." : M("V(aX + b) = a^2 V(X)") + " (une constante ne fait pas varier) : " + M("V(R) = " + a + "^2" + X + V + " = " + N(v)) + ".",
{ ctx: "lineaire-" + what, guide: what === "E" ? [GS(M(a + X + "E(X)") + " = ?", a * E, M(a * E) + "."), GS(M("E(R)") + " = ?", v, M(v) + ".")] : [GS(M(a + "^2") + " = ?", a * a, M(a * a) + "."), GS(M("V(R)") + " = ?", v, M(N(v)) + ".")],
traps: what === "E" ? [TR(a * E, "N'oublie pas de retirer les frais fixes " + b + " €."), TR(E - b, "E(aX) = a E(X) : multiplie par " + a + ".")] : [TR(a * V, "Le coefficient s'élève au carré : a² V(X)."), TR(a * a * V - b, "Une constante ne change pas la variance."), TR(a * V - b, "V(aX + b) = a² V(X).")] }); },
],
};


const QS0 = [[0.5, "\\frac{1}{2}"], [1 / 3, "\\frac{1}{3}"], [0.8, "0{,}8"], [-0.5, "-0{,}5"], [2 / 3, "\\frac{2}{3}"], [0.9, "0{,}9"]];
const SL = {
1: [
() => { const a = nz(-9, 9), b = nz(-8, 8), q = pk(QS0); if (Math.abs(a) < 2) return null;
return QN("Pour tout entier naturel " + M("n") + ", " + M("u_n = " + N(a) + (Math.abs(b) === 1 ? (b < 0 ? " - " : " + ") : (b < 0 ? " - " + N(-b) : " + " + N(b)) + X) + "\\left(" + q[1] + "\\right)^n")  + ". Quelle est la limite de " + M("(u_n)") + " ?", a,
"Comme " + M("-1 < " + q[1] + " < 1") + ", " + M("\\lim \\left(" + q[1] + "\\right)^n = 0") + ". Donc " + M("\\lim u_n = " + N(a)) + ".",
{ ctx: "geo-limite", shownOk: true, guide: [GS(M("\\lim\\limits_{n \\to +\\infty} \\left(" + q[1] + "\\right)^n") + " = ?", 0, M(0) + " (raison entre −1 et 1)."), GS(M("\\lim u_n") + " = ?", a, M(N(a)) + ".")],
traps: [TR(a + b, M("q^n") + " tend vers 0, pas vers 1."), TR(b, "Le terme constant " + a + " reste.")] }); },
() => { const a = nz(-8, 9), c = R.int(2, 6), b = nz(-9, 9), d = nz(-9, 9), v = a / c; if (Math.abs(v) === 1 || Math.abs(a) < 2) return null;
return QN("Détermine " + M("\\lim\\limits_{n \\to +\\infty} \\frac{" + pol([a, b]) + "}{" + pol([c, d]) + "}") + " (fraction acceptée).", v,
"On factorise par " + M("n") + " : " + M("\\frac{n\\left(" + N(a) + (b < 0 ? " - " : " + ") + "\\frac{" + Math.abs(b) + "}{n}\\right)}{n\\left(" + c + (d < 0 ? " - " : " + ") + "\\frac{" + Math.abs(d) + "}{n}\\right)}") + " et " + M("\\frac{k}{n} \\to 0") + " : la limite est " + M(F(v)) + ".",
{ ctx: "quotient-affine", shownOk: true, guide: [GS("Limite de " + M("\\frac{" + N(b) + "}{n}") + " ?", 0, M(0) + "."), GS("Limite cherchée ?", v, M("\\frac{" + N(a) + "}{" + c + "} = " + F(v)) + ".")],
traps: [TR(b / d, "Pour n grand, ce sont les termes en n qui l'emportent."), TR(a, "Le dénominateur grandit aussi."), TR(c / a, "Numérateur sur dénominateur : " + a + "/" + c + ".")] }); },
() => { const a = nz(-7, 9), k = pk([2, 3, 4, 5]), b = nz(-20, 20); if (Math.abs(a) < 2) return null;
return QN("Détermine la limite de " + M("u_n = \\frac{" + N(a) + X + k + "^n" + sg(b) + "}{" + k + "^n}") + ".", a,
M("u_n = " + N(a) + (b < 0 ? " - " : " + ") + "\\frac{" + N(Math.abs(b)) + "}{" + k + "^n}") + " et " + M(k + "^n \\to +\\infty") + ", donc " + M("\\frac{" + N(Math.abs(b)) + "}{" + k + "^n} \\to 0") + " : " + M("\\lim u_n = " + N(a)) + ".",
{ ctx: "quotient-puissance", shownOk: true, guide: [GS("Limite de " + M("\\frac{" + N(b) + "}{" + k + "^n}") + " ?", 0, M(0) + "."), GS(M("\\lim u_n") + " = ?", a, M(N(a)) + ".")],
traps: [TR(a + b, "Le terme " + b + " est divisé par " + k + "ⁿ, qui devient immense."), TR(a * k, "On simplifie par " + k + "ⁿ.")] }); },
],
2: [
() => { const q = pk([0.5, 0.2, 0.25, 0.8, 0.6, 0.75, 0.9]), l = nz(-12, 30), b = rnd(l * (1 - q)), u0 = nz(-5, 15); if (!Number.isInteger(b * 100) || u0 === l) return null;
return QN("La suite définie par " + M("u_0 = " + N(u0)) + " et " + M("u_{n+1} = " + N(q) + "u_n" + sg(b)) + " converge. Quelle est sa limite " + M("\\ell") + " ?", l,
"La limite vérifie " + M("\\ell = " + N(q) + "\\ell" + sg(b)) + ", soit " + M(N(rnd(1 - q)) + "\\ell = " + N(b)) + " et " + M("\\ell = " + N(l)) + ".",
{ ctx: "arith-geo", guide: [GS("Coefficient de " + M("\\ell") + " après regroupement (" + M("\\ell - " + N(q) + "\\ell") + ") ?", rnd(1 - q), M(N(rnd(1 - q))) + "."), GS(M("\\ell") + " = ?", l, M(N(l)) + ".")],
traps: [TR(b, "Résous ℓ = " + dTxt(q) + " ℓ + " + dTxt(b) + "."), TR(rnd(b / q), "On regroupe : (1 − " + dTxt(q) + ") ℓ = " + dTxt(b) + "."), TR(u0, "Le premier terme ne change pas la limite.")] }); },
() => { const c = pk([["Une balle lâchée de", "m rebondit à chaque fois aux", "de la hauteur précédente. Quelle distance totale parcourt-elle en descente (limite de la somme des hauteurs de chute) ?", "balle"], ["Un médicament : on injecte", "mg, puis chaque jour une dose égale aux", "de la dose de la veille. Quelle quantité totale injectée à long terme (limite de la somme) ?", "doses"]]);
const q = pk([[0.5, "\\frac{1}{2}"], [2 / 3, "\\frac{2}{3}"], [0.75, "\\frac{3}{4}"], [0.4, "\\frac{2}{5}"], [0.8, "\\frac{4}{5}"]]), h = pk([2, 3, 4, 5, 6, 10, 12]), v = h / (1 - q[0]);
return QN(c[0] + " " + M(h) + " " + c[1] + " " + M(q[1]) + " " + c[2] + " (fraction acceptée)", v,
"Somme géométrique : " + M(h + " + " + h + X + q[1] + " + \\dots = " + h + X + "\\frac{1 - (" + q[1] + ")^{n+1}}{1 - " + q[1] + "}") + " ; comme " + M("(" + q[1] + ")^{n+1} \\to 0") + ", la limite est " + M("\\frac{" + h + "}{1 - " + q[1] + "} = " + F(v)) + ".",
{ ctx: c[3], guide: [GS(M("1 - " + q[1]) + " = ?", rnd(1 - q[0]), M(F(1 - q[0])) + "."), GS("Limite de la somme ?", v, M(F(v)) + ".")],
traps: [TR(h / q[0], "La limite de la somme est (premier terme)/(1 − q)."), TR(h * (1 + q[0]), "Il y a une infinité de termes qui s'ajoutent."), TR(rnd(h / (1 + q[0])), "C'est 1 − q au dénominateur.")] }); },
() => { const a = nz(-6, 8), d = R.int(2, 5), b = nz(-9, 9), c = nz(-9, 9), e = nz(-9, 9), v = a / d; if (Math.abs(v) === 1 || Math.abs(a) < 2) return null;
return QN("Détermine " + M("\\lim\\limits_{n \\to +\\infty} \\frac{" + pol([a, b, c]) + "}{" + pol([d, 0, e]) + "}") + " (fraction acceptée).", v,
"On factorise par " + M("n^2") + " en haut et en bas : les termes " + M("\\frac{k}{n}") + " et " + M("\\frac{k}{n^2}") + " tendent vers 0. Limite : " + M("\\frac{" + N(a) + "}{" + d + "} = " + F(v)) + ".",
{ ctx: "quotient-carre", shownOk: true, guide: [GS("Coefficient de " + M("n^2") + " en haut ?", a, M(N(a)) + "."), GS("Limite ?", v, M(F(v)) + ".")],
traps: [TR(b / d, "Ce sont les termes de plus haut degré (n²) qui comptent."), TR(c / e, "Termes de plus haut degré : " + a + "n² et " + d + "n²."), TR(a, "Divise par " + d + ".")] }); },
],
3: [
() => { const q = pk([0.5, 0.5, 0.25]), qT = q === 0.5 ? "\\frac{1}{2}" : "\\frac{1}{4}", l = nz(-8, 12), b = rnd(l * (1 - q)), v0 = nz(-8, 8) * (q === 0.5 ? 2 : 4), u0 = l + v0, k = R.int(3, 5), uk = l + v0 * q ** k;
return QN("On pose " + M("u_0 = " + N(u0)) + " et " + M("u_{n+1} = " + qT + "u_n" + sg(b)) + ". La suite " + M("v_n = u_n - " + NP(l)) + " est géométrique de raison " + M(qT) + ". Calcule " + M(u(k)) + " (valeur exacte).", uk,
M("v_0 = " + N(u0) + " - " + NP(l) + " = " + N(v0)) + ", " + M(u(k) + " = " + N(l) + " + " + NP(v0) + X + "\\left(" + qT + "\\right)^{" + k + "} = " + F(uk)) + ".",
{ ctx: "suite-auxiliaire", guide: [GS(M("v_0") + " = ?", v0, M(N(v0)) + "."), GS(M("v_{" + k + "}") + " = ?", v0 * q ** k, M(F(v0 * q ** k)) + "."), GS(M(u(k)) + " = ?", uk, M(F(uk)) + ".")],
traps: [TR(v0 * q ** k, "C'est v_" + k + " : u_" + k + " = v_" + k + " + " + l + "."), TR(u0 * q ** k, "C'est v_n qui est géométrique, pas u_n."), TR(l + v0 * q ** (k - 1), "Exposant " + k + " depuis v_0.")] }); },
() => { const l = nz(-5, 10), cc = pk([2, 3, 5, 8, 10]), q = pk([0.5, 0.8, 0.9, 0.7]), eps = pk([0.01, 0.001]); let n = 0; while (cc * q ** n >= eps) n++;
return QN("Pour tout entier naturel " + M("n") + ", " + M("u_n = " + N(l) + " + " + cc + X + N(q) + "^n") + ". La suite tend vers " + M(N(l)) + ". À partir de quel rang " + M("n") + " a-t-on " + M("u_n - " + NP(l) + " < " + N(eps)) + " ?", n,
"On cherche le plus petit " + M("n") + " tel que " + M(cc + X + N(q) + "^n < " + N(eps)) + " (calculatrice, tableur ou boucle) : " + M(cc + X + N(q) + "^{" + (n - 1) + "} \\approx " + N(rnd(cc * q ** (n - 1), 5))) + " et " + M(cc + X + N(q) + "^{" + n + "} \\approx " + N(rnd(cc * q ** n, 5))) + " : " + M("n = " + n) + ".",
{ ctx: "seuil-limite", guide: [GR("L'écart " + M("u_n - " + NP(l)) + " vaut " + M(cc + X + N(q) + "^n") + ". Que vaut-il pour " + M("n = 10") + " (au millième) ?", cc * q ** 10, M("\\approx " + N(rnd(cc * q ** 10, 3))) + ".", 0.001), GS("Plus petit " + M("n") + " ?", n, M(n) + ".")],
traps: [TR(n - 1, "Pour n = " + (n - 1) + ", l'écart vaut encore environ " + dTxt(rnd(cc * q ** (n - 1), 5)) + "."), TR(n + 1, "Pour n = " + n + ", c'est déjà vrai.")] }); },
() => { const c = pk([3, 4, 5]), a = R.int(2, c - 1), b = nz(-5, 6), v = b * c; if (Math.abs(b) === 1 && false) return null;
return QN("Détermine la limite de " + M("u_n = \\frac{" + a + "^n" + (b < 0 ? " - " + N(-b) : " + " + N(b)) + X + c + "^{n+1}}{" + c + "^n}") + ".", v,
M("u_n = \\left(\\frac{" + a + "}{" + c + "}\\right)^n" + sg(b) + X + c) + " ; comme " + M("0 < \\frac{" + a + "}{" + c + "} < 1") + ", le premier terme tend vers 0 : " + M("\\lim u_n = " + N(v)) + ".",
{ ctx: "croissance-comparee", guide: [GS("Limite de " + M("\\left(\\frac{" + a + "}{" + c + "}\\right)^n") + " ?", 0, M(0) + "."), GS(M(c + "^{n+1}") + " divisé par " + M(c + "^n") + " ?", c, M(c) + "."), GS(M("\\lim u_n") + " = ?", v, M(N(v)) + ".")],
traps: [TR(b, c + "^(n+1) / " + c + "^n = " + c + " : il reste un facteur " + c + "."), TR(v + 1, "(" + a + "/" + c + ")ⁿ tend vers 0, pas vers 1.")] }); },
],
};



const BCTX = [["Un QCM a", "questions à 4 choix ; un élève répond au hasard et a la probabilité", "de bien répondre à chacune", "bonnes réponses", "qcm", [0.25]],
["Un test « vrai ou faux » a", "questions ; un élève répond au hasard et a la probabilité", "de bien répondre à chacune", "bonnes réponses", "vraifaux", [0.5]],
["Une joueuse tire", "penalties ; elle marque avec la probabilité", "à chaque tir, indépendamment", "buts", "penalties", [0.6, 0.7, 0.75, 0.8, 0.85]],
["On contrôle", "smartphones d'une grande production ; chacun est défectueux avec la probabilité", "", "smartphones défectueux", "controle", [0.02, 0.05, 0.1, 0.15]],
["On plante", "graines ; chacune germe avec la probabilité", "", "graines qui germent", "graines", [0.6, 0.7, 0.8, 0.9]]];
const bc = (c, n, p) => c[0] + " " + M(n) + " " + c[1] + " " + M(dP(p)) + (c[2] ? " " + c[2] : "") + ". " + M("X") + " compte le nombre de " + c[3] + " : " + M("X") + " suit la loi binomiale " + M("\\mathcal{B}(" + n + " \\,;\\, " + dP(p) + ")") + ". ";


const ok3 = (v) => { const k = v * 1000, r = Math.round(k); return r >= 1 && r <= 999 && Math.abs((k % 1) - 0.5) > 1e-6; };
const BI = {
1: [
() => { const c = pk(BCTX), n = R.int(2, 4), p = pk(c[5]); let all = R.rand() < 0.5; if ((all ? p ** n : (1 - p) ** n) < 0.001) all = !all;  const v = rnd(all ? p ** n : (1 - p) ** n);
return QN(bc(c, n, p) + "Calcule " + M("P(X = " + (all ? n : 0) + ")") + ".", v,
(all ? "Tous les essais réussis : " + M(dP(p) + "^{" + n + "} = " + dP(v)) : "Aucun succès : " + M("(1 - " + dP(p) + ")^{" + n + "} = " + dP(1 - p) + "^{" + n + "} = " + dP(v))) + ".",
{ ctx: c[4] + "-extreme", guide: [GS("Probabilité d'" + (all ? "un succès" : "un échec") + " à un essai ?", all ? p : rnd(1 - p), M(dP(all ? p : 1 - p)) + "."), GS("Probabilité cherchée ?", v, M(dP(v)) + ".")],
traps: [TR(rnd(n * (all ? p : 1 - p)), "Les essais sont indépendants : on multiplie, on n'additionne pas."), TR(rnd(all ? (1 - p) ** n : p ** n), all ? "« X = " + n + " » : que des succès." : "« X = 0 » : aucun succès, donc que des échecs.")] }); },
() => { const n = R.int(5, 10), k = R.int(2, Math.min(4, n - 2)), v = C(n, k), c = pk([["Combien de chemins de l'arbre d'un schéma de Bernoulli à", "épreuves comportent exactement", "succès ?", "chemins"], ["De combien de façons peut-on choisir", "élèves pour une délégation parmi", "", "delegation"], ["Combien de mains de", "cartes peut-on former avec", "cartes différentes ?", "mains"]]);
const q = c[3] === "chemins" ? c[0] + " " + M(n) + " " + c[1] + " " + M(k) + " " + c[2] : c[3] === "delegation" ? c[0] + " " + M(k) + " " + c[1] + " " + M(n) + " ?" : c[0] + " " + M(k) + " " + c[1] + " " + M(n) + " " + c[2];
return QN(q + " (coefficient binomial " + M("\\binom{" + n + "}{" + k + "}") + ")", v,
M("\\binom{" + n + "}{" + k + "} = \\frac{" + Array.from({ length: k }, (_, i) => n - i).join(X) + "}{" + Array.from({ length: k }, (_, i) => k - i).join(X) + "} = " + v) + ".",
{ ctx: "binomial-" + c[3], guide: [GS("Produit " + M(Array.from({ length: k }, (_, i) => n - i).join(X)) + " ?", Array.from({ length: k }, (_, i) => n - i).reduce((a, b) => a * b), M(Array.from({ length: k }, (_, i) => n - i).reduce((a, b) => a * b)) + "."), GS("On divise par " + M(k + "!") + " : résultat ?", v, M(v) + ".")],
traps: [TR(Array.from({ length: k }, (_, i) => n - i).reduce((a, b) => a * b), "L'ordre ne compte pas : divise par " + k + "!."), TR(n * k, "C'est un coefficient binomial, pas un produit n × k."), TR(C(n, k - 1), "On choisit " + k + " éléments.")] }); },
() => { const c = pk(BCTX), n = pk([10, 20, 25, 40, 50, 100, 200]), p = pk(c[5]), v = rnd(n * p); if (!Number.isInteger(v * 10)) return null;
return QN(bc(c, n, p) + "Calcule l'espérance " + M("E(X)") + ".", v, M("E(X) = np = " + n + X + dP(p) + " = " + N(v)) + " : en moyenne " + N(v).replace("{,}", ",") + " " + c[3] + ".",
{ ctx: c[4] + "-esperance", guide: [GS(M("E(X) = np") + " = ?", v, M(N(v)) + ".")], traps: [TR(rnd(n * (1 - p)), "C'est n × p, avec p la probabilité de succès."), TR(rnd(n * p * (1 - p)), "C'est la variance ; l'espérance vaut np.")] }); },
],
2: [
() => { const c = pk(BCTX), n = R.int(5, 10), p = pk(c[5]), k = R.int(2, n - 2), v = C(n, k) * p ** k * (1 - p) ** (n - k); if (!ok3(v)) return null;
return QR(bc(c, n, p) + "Calcule " + M("P(X = " + k + ")") + " (arrondi au millième).", v, 0.001,
M("P(X = " + k + ") = \\binom{" + n + "}{" + k + "}" + X + dP(p) + "^{" + k + "}" + X + dP(1 - p) + "^{" + (n - k) + "} = " + C(n, k) + X + dP(p) + "^{" + k + "}" + X + dP(1 - p) + "^{" + (n - k) + "} \\approx " + N(rnd(v, 3))) + ".",
{ ctx: c[4] + "-pk", guide: [GS(M("\\binom{" + n + "}{" + k + "}") + " = ?", C(n, k), M(C(n, k)) + "."), GR(M("P(X = " + k + ")") + " au millième ?", v, M("\\approx " + N(rnd(v, 3))) + ".", 0.001)],
traps: [TR(rnd(p ** k * (1 - p) ** (n - k), 3), "Il y a " + C(n, k) + " chemins avec " + k + " succès : multiplie par le coefficient binomial."), TR(rnd(C(n, k) * p ** k, 3), "N'oublie pas les " + (n - k) + " échecs."), TR(rnd(C(n, k) * p ** (n - k) * (1 - p) ** k, 3), "p est à la puissance du nombre de succès (" + k + ").")] }); },
() => { const c = pk(BCTX), n = R.int(3, 12), p = pk(c[5]), v = 1 - (1 - p) ** n; if (!ok3(v)) return null;
return QR(bc(c, n, p) + "Calcule " + M("P(X \\geqslant 1)") + " (arrondi au millième).", v, 0.001,
M("P(X \\geqslant 1) = 1 - P(X = 0) = 1 - " + dP(1 - p) + "^{" + n + "} \\approx " + N(rnd(v, 3))) + ".",
{ ctx: c[4] + "-aumoins", guide: [GR(M("P(X = 0)") + " au millième ?", (1 - p) ** n, M(dP(1 - p) + "^{" + n + "} \\approx " + N(rnd((1 - p) ** n, 3))) + ".", 0.001), GR(M("P(X \\geqslant 1)") + " ?", v, M("\\approx " + N(rnd(v, 3))) + ".", 0.001)],
traps: [TR(rnd(1 - p ** n, 3), "Le contraire de « au moins un succès » est « aucun succès » : (1 − p)ⁿ."), TR(rnd((1 - p) ** n, 3), "C'est P(X = 0) ; on demande le contraire."), TR(Math.min(0.999, rnd(n * p, 3)), "On passe par l'évènement contraire.")] }); },
() => { const c = pk(BCTX), n = pk([20, 25, 50, 80, 100, 150]), p = pk(c[5]), V = rnd(n * p * (1 - p)), s = Math.sqrt(V);
return QR(bc(c, n, p) + "Calcule l'écart type " + M("\\sigma(X)") + " (arrondi au centième).", s, 0.01,
M("V(X) = np(1 - p) = " + n + X + dP(p) + X + dP(1 - p) + " = " + N(V)) + " et " + M("\\sigma(X) = \\sqrt{" + N(V) + "} \\approx " + N(rnd(s, 2))) + ".",
{ ctx: c[4] + "-sigma", guide: [GS(M("V(X)") + " = ?", V, M(N(V)) + "."), GR(M("\\sigma(X)") + " au centième ?", s, M("\\approx " + N(rnd(s, 2))) + ".", 0.01)],
traps: [TR(rnd(V, 2), "L'écart type est la racine de la variance."), TR(rnd(Math.sqrt(n * p), 2), "V(X) = np(1 − p).")] }); },
],
3: [
() => { const p = pk([0.05, 0.1, 0.15, 0.2, 0.3]), s = pk([0.9, 0.95, 0.99]); let n = 1; while (1 - (1 - p) ** n < s) n++; const c = pk([["Un jeu à gratter est gagnant avec la probabilité", "tickets", "un ticket gagnant", "grattage"], ["Une plante rare pousse dans une parcelle avec la probabilité", "parcelles", "une parcelle avec la plante", "botanique"], ["Un lancer de fléchette atteint le centre avec la probabilité", "lancers", "un lancer au centre", "flechettes"]]);
return QN(c[0] + " " + M(dP(p)) + ", indépendamment. Combien de " + c[1] + " faut-il au minimum pour que la probabilité d'avoir au moins " + c[2] + " dépasse " + M(dP(s)) + " ?", n,
"On cherche le plus petit " + M("n") + " tel que " + M("1 - " + dP(1 - p) + "^n \\geqslant " + dP(s)) + ", soit " + M(dP(1 - p) + "^n \\leqslant " + dP(rnd(1 - s))) + ". À la calculatrice : " + M(dP(1 - p) + "^{" + (n - 1) + "} \\approx " + N(rnd((1 - p) ** (n - 1), 4))) + ", " + M(dP(1 - p) + "^{" + n + "} \\approx " + N(rnd((1 - p) ** n, 4))) + " : " + M("n = " + n) + ".",
{ ctx: c[3], guide: [GR("Avec " + M("n") + " essais, " + M("P = 1 - " + dP(1 - p) + "^n") + ". Que vaut-elle pour " + M("n = 10") + " (au millième) ?", 1 - (1 - p) ** 10, M("\\approx " + N(rnd(1 - (1 - p) ** 10, 3))) + ".", 0.001), GS("Plus petit " + M("n") + " ?", n, M(n) + ".")],
traps: [TR(n - 1, "Avec " + (n - 1) + " essais, la probabilité est encore inférieure à " + dTxt(s) + "."), TR(Math.ceil(s / p), "Ce n'est pas proportionnel : passe par (1 − p)ⁿ.")] }); },
() => { const c = pk(BCTX), n = R.int(4, 10), p = pk(c[5]), p0 = (1 - p) ** n, p1 = n * p * (1 - p) ** (n - 1), v = p0 + p1; if (!ok3(v)) return null;
return QR(bc(c, n, p) + "Calcule " + M("P(X \\leqslant 1)") + " (arrondi au millième).", v, 0.001,
M("P(X \\leqslant 1) = P(X = 0) + P(X = 1) = " + dP(1 - p) + "^{" + n + "} + " + n + X + dP(p) + X + dP(1 - p) + "^{" + (n - 1) + "} \\approx " + N(rnd(v, 3))) + ".",
{ ctx: c[4] + "-auplus", guide: [GR(M("P(X = 0)") + " ?", p0, M("\\approx " + N(rnd(p0, 3))) + ".", 0.001), GR(M("P(X = 1)") + " ?", p1, M("\\approx " + N(rnd(p1, 3))) + ".", 0.001), GR(M("P(X \\leqslant 1)") + " ?", v, M("\\approx " + N(rnd(v, 3))) + ".", 0.001)],
traps: [TR(rnd(p1, 3), "X ⩽ 1 comprend aussi X = 0."), TR(rnd(p0 + p * (1 - p) ** (n - 1), 3), "Il y a " + n + " façons d'avoir exactement un succès."), TR(rnd(1 - v, 3), "C'est P(X ⩾ 2), le contraire.")] }); },
() => { const p = pk([0.6, 0.7, 0.75, 0.8, 0.4]), k = pk([2, 1]), v = rnd(3 * p ** k * (1 - p) ** (3 - k)), c = pk([["Un tireur à l'arc", "tire 3 flèches et atteint la cible avec la probabilité", "touches", "archer3"], ["Un serveur de jeux en ligne", "reçoit 3 connexions ; chacune réussit avec la probabilité", "connexions réussies", "serveur"], ["Une joueuse de tennis", "joue 3 premiers services ; chacun passe avec la probabilité", "services réussis", "tennis"]]);
return QN(c[0] + " " + c[1] + " " + M(dP(p)) + ", indépendamment. À l'aide d'un arbre, calcule la probabilité d'obtenir exactement " + M(k) + " " + (k > 1 ? c[2] : c[2].replace(/s\b/g, "")) + " sur 3." , v,
"Il y a " + M("\\binom{3}{" + k + "} = 3") + " chemins avec " + k + " succès, chacun de probabilité " + M(dP(p) + (k > 1 ? "^{" + k + "}" : "") + X + dP(1 - p) + (3 - k > 1 ? "^{" + (3 - k) + "}" : "")) + " : " + M("3" + X + dP(rnd(p ** k * (1 - p) ** (3 - k))) + " = " + dP(v)) + ".",
{ ctx: c[3], guide: [GS("Nombre de chemins avec " + k + " succès ?", 3, M(3) + "."), GS("Probabilité d'un de ces chemins ?", rnd(p ** k * (1 - p) ** (3 - k)), M(dP(rnd(p ** k * (1 - p) ** (3 - k)))) + "."), GS("Probabilité cherchée ?", v, M(dP(v)) + ".")],
traps: [TR(rnd(p ** k * (1 - p) ** (3 - k)), "Plusieurs chemins donnent " + k + " succès : additionne-les (il y en a 3)."), TR(rnd(p ** k), "Les autres tirs sont des échecs : multiplie aussi par (1 − p)."), TR(rnd(3 * p ** (3 - k) * (1 - p) ** k), "p est à la puissance du nombre de succès.")] }); },
],
};


const DEFS = [
{ id: "suitedef", theme: "fa", label: "Suites : termes, récurrence, sens de variation", ex: "u_{n+1} = 2u_n - 3", FR: [11, 1], g: SD,
hint: "Suite explicite : on remplace n par le rang. Récurrence : on calcule les termes un par un, en partant du premier. Sens de variation : signe de u(n+1) − u(n).",
comps: ["Calculer des termes (explicite, récurrence)", "Modéliser, motifs, différence u(n+1) − u(n)", "Algorithme, sens de variation, conjecturer une limite"],
lesson: ["Suites numériques", "Une suite associe un nombre \\(u_n\\) à chaque entier naturel \\(n\\) (le rang).",
"Formule explicite \\(u_n = f(n)\\) : on calcule directement \\(u_{10}\\). Relation de récurrence \\(u_{n+1} = f(u_n)\\) et premier terme : on calcule les termes de proche en proche. La suite est croissante si \\(u_{n+1} - u_n \\geqslant 0\\) pour tout \\(n\\), décroissante si \\(u_{n+1} - u_n \\leqslant 0\\).",
["\\(u_n = n^2 - 3\\) : \\(u_4 = 16 - 3 = 13\\).", "\\(u_0 = 2\\), \\(u_{n+1} = 3u_n - 1\\) : \\(u_1 = 5\\), \\(u_2 = 14\\), \\(u_3 = 41\\).", "\\(u_n = n^2\\) : \\(u_{n+1} - u_n = 2n + 1 > 0\\), la suite est croissante."],
"\\(u_{n+1}\\) n'est pas \\(u_n + 1\\) : c'est le terme suivant. Et \\(u_3\\) se calcule à partir de \\(u_2\\), pas directement depuis \\(u_0\\)."] },
{ id: "suitearith", theme: "fa", label: "Suites arithmétiques", ex: "u_n = u_0 + nr", FR: [11, 1], g: SA,
hint: "On ajoute la raison r à chaque rang : u(n) = u(0) + n r, ou u(n) = u(1) + (n − 1) r. Deux termes connus : r = écart ÷ nombre de pas.",
comps: ["Terme général, raison", "Retrouver u(0), le rang, la formule ; modéliser", "Seuil, comparer deux évolutions, système"],
lesson: ["Suites arithmétiques", "Une suite arithmétique augmente (ou diminue) toujours de la même quantité : la raison \\(r\\).",
"\\(u_{n+1} = u_n + r\\). Terme général : \\(u_n = u_0 + nr\\), et plus généralement \\(u_n = u_p + (n - p)r\\). Si \\(r > 0\\) la suite est croissante, si \\(r < 0\\) décroissante. Les points \\((n \\,;\\, u_n)\\) sont alignés : c'est le pendant discret d'une fonction affine.",
["\\(u_0 = 7\\), \\(r = 3\\) : \\(u_{20} = 7 + 20 \\times 3 = 67\\).", "\\(u_4 = 11\\) et \\(u_9 = 26\\) : \\(r = \\frac{26 - 11}{5} = 3\\)."],
"Si la suite commence à \\(u_1\\), le terme de rang \\(n\\) est \\(u_1 + (n - 1)r\\) : il y a \\(n - 1\\) pas, pas \\(n\\)."] },
{ id: "suitegeo", theme: "fa", label: "Suites géométriques", ex: "u_n = u_0 \\times q^n", FR: [11, 2], g: SG,
hint: "On multiplie par la raison q à chaque rang : u(n) = u(0) × qⁿ. Une hausse de t % donne q = 1 + t/100, une baisse q = 1 − t/100.",
comps: ["Terme général, raison d'un taux", "Capital, décroissance, raison à partir de deux termes", "Seuil, comparer deux placements"],
lesson: ["Suites géométriques", "Une suite géométrique est multipliée à chaque rang par le même nombre : la raison \\(q\\).",
"\\(u_{n+1} = q \\times u_n\\). Terme général : \\(u_n = u_0 \\times q^n\\). Une évolution à taux fixe est géométrique : hausse de \\(t\\,\\%\\) → \\(q = 1 + \\frac{t}{100}\\), baisse → \\(q = 1 - \\frac{t}{100}\\). Pour \\(u_0 > 0\\) : croissante si \\(q > 1\\), décroissante si \\(0 < q < 1\\).",
["\\(u_0 = 3\\), \\(q = 2\\) : \\(u_5 = 3 \\times 2^5 = 96\\).", "\\(1\\,000\\) € à \\(3\\,\\%\\) par an : \\(u_{10} = 1\\,000 \\times 1{,}03^{10} \\approx 1\\,343{,}92\\) €."],
"Augmenter de \\(3\\,\\%\\) chaque année pendant 10 ans n'est pas augmenter de \\(30\\,\\%\\) : les hausses se composent."] },
{ id: "suitesomme", theme: "fa", label: "Sommes de termes d'une suite", ex: "1 + 2 + \\dots + n = \\frac{n(n+1)}{2}", FR: [11, 2], g: SS,
hint: "Arithmétique : nombre de termes × (premier + dernier) ÷ 2. Géométrique : 1 + q + … + qⁿ = (qⁿ⁺¹ − 1) ÷ (q − 1). Compte bien les termes.",
comps: ["1 + 2 + … + n, somme arithmétique, 1 + q + … + qⁿ", "Pairs, impairs, gradins, somme géométrique", "Retrouver n, versements, seuil"],
lesson: ["Sommes de termes", "Deux formules à connaître, démontrées en classe.",
"\\(1 + 2 + \\dots + n = \\frac{n(n + 1)}{2}\\). Pour \\(q \\ne 1\\) : \\(1 + q + q^2 + \\dots + q^n = \\frac{q^{n+1} - 1}{q - 1}\\). Somme de termes consécutifs d'une suite arithmétique : \\(\\text{nombre de termes} \\times \\frac{\\text{premier} + \\text{dernier}}{2}\\) ; d'une suite géométrique : \\(\\text{premier} \\times \\frac{1 - q^{\\text{nombre de termes}}}{1 - q}\\).",
["\\(1 + 2 + \\dots + 100 = \\frac{100 \\times 101}{2} = 5\\,050\\).", "\\(1 + 2 + 4 + \\dots + 2^9 = 2^{10} - 1 = 1\\,023\\)."],
"De \\(u_0\\) à \\(u_n\\), il y a \\(n + 1\\) termes ; de \\(u_5\\) à \\(u_{20}\\), il y en a \\(16\\)."] },
{ id: "expfn", theme: "fa", label: "Fonction exponentielle : propriétés, équations", ex: "e^a \\times e^b = e^{a+b}", FR: [11, 4], g: EF,
hint: "Produit : on ajoute les exposants ; quotient : on les soustrait ; puissance : on les multiplie. e^a = e^b ⇔ a = b ; e^a < e^b ⇔ a < b. Et e^x > 0 toujours.",
comps: ["Propriétés algébriques, e^a = e^b", "Équations, inéquations, simplifier", "Équations du 2nd degré, signe d'un produit, modèle"],
lesson: ["La fonction exponentielle", "\\(\\exp\\) est l'unique fonction dérivable égale à sa dérivée et qui vaut 1 en 0. On note \\(e^x\\).",
"Pour tous réels \\(a\\), \\(b\\) : \\(e^a \\times e^b = e^{a + b}\\), \\(\\frac{e^a}{e^b} = e^{a - b}\\), \\((e^a)^n = e^{na}\\), \\(e^{-a} = \\frac{1}{e^a}\\). L'exponentielle est strictement positive et strictement croissante : \\(e^a = e^b \\iff a = b\\) et \\(e^a < e^b \\iff a < b\\).",
["\\(e^{3} \\times e^{-5} = e^{-2}\\).", "\\(e^{2x - 1} = e^{5} \\iff 2x - 1 = 5 \\iff x = 3\\).", "\\((x - 2)e^x > 0 \\iff x > 2\\) car \\(e^x > 0\\)."],
"\\(e^a \\times e^b\\) n'est pas \\(e^{ab}\\) : on ajoute les exposants."] },
{ id: "pscal", theme: "es", label: "Produit scalaire", ex: "\\vec{u} \\cdot \\vec{v} = xx' + yy'", FR: [11, 3], g: PS,
hint: "Coordonnées : xx' + yy'. Normes et angle : ‖u‖ × ‖v‖ × cos θ. Projection : AB · AC = AB · AH. Orthogonaux ⇔ produit scalaire nul.",
comps: ["Coordonnées, normes et angle, orthogonalité", "Cosinus d'un angle, Al-Kashi, projection", "Projeté orthogonal, développer, normes"],
lesson: ["Produit scalaire", "Le produit scalaire de deux vecteurs est un nombre.",
"Dans un repère orthonormé : \\(\\vec{u} \\cdot \\vec{v} = xx' + yy'\\). Avec les normes : \\(\\vec{u} \\cdot \\vec{v} = \\lVert \\vec{u} \\rVert \\times \\lVert \\vec{v} \\rVert \\times \\cos(\\vec{u}, \\vec{v})\\). Si \\(H\\) est le projeté orthogonal de \\(C\\) sur \\((AB)\\) : \\(\\overrightarrow{AB} \\cdot \\overrightarrow{AC} = \\overrightarrow{AB} \\cdot \\overrightarrow{AH}\\). \\(\\vec{u} \\perp \\vec{v} \\iff \\vec{u} \\cdot \\vec{v} = 0\\). Al-Kashi : \\(BC^2 = AB^2 + AC^2 - 2\\,AB \\times AC \\times \\cos\\widehat{A}\\).",
["\\(\\vec{u}(2 ; -1)\\), \\(\\vec{v}(3 ; 4)\\) : \\(\\vec{u} \\cdot \\vec{v} = 6 - 4 = 2\\).", "\\(\\lVert \\vec{u} \\rVert = 3\\), \\(\\lVert \\vec{v} \\rVert = 4\\), angle \\(\\frac{\\pi}{3}\\) : \\(3 \\times 4 \\times \\frac{1}{2} = 6\\)."],
"Le produit scalaire peut être négatif (angle obtus, ou projeté de sens contraire)."] },
{ id: "probtot", theme: "no", label: "Arbres pondérés, probabilités totales", ex: "P(B) = P(A)P_A(B) + P(\\overline{A})P_{\\overline{A}}(B)", FR: [11, 6], g: PT,
hint: "Le long d'une branche, on multiplie ; pour un évènement atteint par plusieurs chemins, on additionne. P_A(B) = P(A ∩ B) ÷ P(A).",
comps: ["Lire un arbre pondéré, P(A ∩ B), P_A(B)", "Probabilités totales, inverser le conditionnement, indépendance", "Retrouver une branche, trois branches, au moins une fois"],
lesson: ["Probabilités conditionnelles", "\\(P_A(B)\\) est la probabilité de \\(B\\) sachant que \\(A\\) est réalisé.",
"\\(P_A(B) = \\frac{P(A \\cap B)}{P(A)}\\), donc \\(P(A \\cap B) = P(A) \\times P_A(B)\\) : on multiplie le long d'une branche. Formule des probabilités totales : \\(P(B) = P(A \\cap B) + P(\\overline{A} \\cap B)\\). \\(A\\) et \\(B\\) sont indépendants si \\(P(A \\cap B) = P(A) \\times P(B)\\).",
["\\(P(A) = 0{,}3\\), \\(P_A(B) = 0{,}8\\), \\(P_{\\overline{A}}(B) = 0{,}1\\) : \\(P(B) = 0{,}24 + 0{,}07 = 0{,}31\\).", "Puis \\(P_B(A) = \\frac{0{,}24}{0{,}31} \\approx 0{,}774\\)."],
"\\(P_A(B)\\) et \\(P_B(A)\\) sont différentes : « malade sachant test positif » n'est pas « test positif sachant malade »."] },
{ id: "vaesp", theme: "no", label: "Variable aléatoire : loi, espérance, variance", ex: "E(X) = \\sum x_i\\,p_i", FR: [11, 7], g: VA,
hint: "La somme des probabilités vaut 1. E(X) = somme des xᵢ pᵢ ; V(X) = E(X²) − E(X)² ; σ = √V. E(aX + b) = aE(X) + b et V(aX + b) = a²V(X).",
comps: ["Loi, espérance, P(X ⩽ a)", "Variance, écart type, gain moyen d'un jeu", "Jeu équitable, valeur inconnue, linéarité"],
lesson: ["Variables aléatoires", "Une variable aléatoire associe un nombre à chaque issue ; sa loi donne la probabilité de chaque valeur.",
"Espérance : \\(E(X) = x_1 p_1 + x_2 p_2 + \\dots + x_k p_k\\) (moyenne à long terme). Variance : \\(V(X) = E(X^2) - E(X)^2\\), écart type \\(\\sigma(X) = \\sqrt{V(X)}\\). \\(E(aX + b) = aE(X) + b\\) et \\(V(aX + b) = a^2V(X)\\). Un jeu est équitable si l'espérance du gain net est nulle.",
["Loi \\(-2 ; 1 ; 5\\) avec \\(0{,}5 ; 0{,}3 ; 0{,}2\\) : \\(E(X) = -1 + 0{,}3 + 1 = 0{,}3\\)."],
"Dans un jeu, le gain net retire la mise de chaque gain, même quand on gagne."] },
{ id: "suitelim", theme: "fa", label: "Limites de suites", ex: "\\lim q^n = 0 \\text{ si } -1 < q < 1", FR: [12, 0], g: SL,
hint: "qⁿ → 0 si −1 < q < 1 ; k/n → 0. Quotient de polynômes en n : termes de plus haut degré. Suite u(n+1) = a u(n) + b qui converge : ℓ = a ℓ + b.",
comps: ["Suites géométriques, quotients en n", "Point fixe, somme géométrique, quotients de degré 2", "Suite auxiliaire, seuil, croissances comparées"],
lesson: ["Limites de suites", "Une suite converge vers \\(\\ell\\) si ses termes finissent par être aussi proches de \\(\\ell\\) qu'on veut.",
"Si \\(-1 < q < 1\\), \\(q^n \\to 0\\) ; si \\(q > 1\\), \\(q^n \\to +\\infty\\). \\(\\frac{k}{n} \\to 0\\). Pour un quotient de polynômes en \\(n\\), on factorise par la plus haute puissance de \\(n\\). Si \\(u_{n+1} = au_n + b\\) converge, sa limite vérifie \\(\\ell = a\\ell + b\\). Somme géométrique (\\(|q| < 1\\)) : \\(u_0 + u_0q + u_0q^2 + \\dots \\to \\frac{u_0}{1 - q}\\).",
["\\(\\lim \\frac{3n + 1}{2n - 5} = \\frac{3}{2}\\).", "\\(u_{n+1} = 0{,}5u_n + 4\\) : \\(\\ell = 0{,}5\\ell + 4\\), \\(\\ell = 8\\)."],
"\\(\\ell = a\\ell + b\\) ne prouve pas que la suite converge : il faut le savoir d'abord (monotone et bornée, ou suite auxiliaire)."] },
{ id: "binom", theme: "no", label: "Loi binomiale", ex: "P(X = k) = \\binom{n}{k}p^k(1-p)^{n-k}", FR: [12, 6], g: BI,
hint: "X ~ B(n ; p) compte les succès de n épreuves de Bernoulli indépendantes. P(X = k) = C(n, k) pᵏ (1 − p)ⁿ⁻ᵏ ; E(X) = np ; V(X) = np(1 − p). « Au moins un » : 1 − (1 − p)ⁿ.",
comps: ["P(X = 0), P(X = n), coefficient binomial, espérance", "P(X = k), au moins un succès, écart type", "Seuil, P(X ⩽ 1), arbre à trois épreuves"],
lesson: ["Loi binomiale", "On répète \\(n\\) fois, de façon indépendante, une épreuve à deux issues (succès de probabilité \\(p\\)).",
"Le nombre \\(X\\) de succès suit la loi binomiale \\(\\mathcal{B}(n ; p)\\) : \\(P(X = k) = \\binom{n}{k}p^k(1 - p)^{n - k}\\), où \\(\\binom{n}{k}\\) compte les chemins de l'arbre à \\(k\\) succès. \\(E(X) = np\\), \\(V(X) = np(1 - p)\\). \\(P(X \\geqslant 1) = 1 - (1 - p)^n\\).",
["\\(\\mathcal{B}(4 ; 0{,}5)\\) : \\(P(X = 2) = 6 \\times 0{,}5^4 = 0{,}375\\).", "\\(\\mathcal{B}(50 ; 0{,}2)\\) : \\(E(X) = 10\\)."],
"Sans le coefficient \\(\\binom{n}{k}\\), on ne compte qu'un seul chemin de l'arbre."] },
];

const FR_LYCEE = { f2formes: [11, 0], trinfact: [11, 0], modexp: [11, 2], trigassoc: [11, 5], compo: [12, 1], denombr: [12, 0] };
for (const [id, fr] of Object.entries(FR_LYCEE)) { const n = NOTIONS.find((x) => x.id === id); if (n) n.FR = fr; }
for (const d of DEFS) {
if (NOTIONS.some((n) => n.id === d.id)) continue;
NOTIONS.push({ id: d.id, theme: d.theme, label: d.label, ex: d.ex, CH: null, MP: null, FR: d.FR });
GEN[d.id] = (lv) => pickForm(d.g[Math.min(Math.max(lv, 1), 3)]);
if (typeof VAR !== "undefined") VAR[d.id] = {};
HINTS_EXTRA[d.id] = d.hint;
LESSONS_EXTRA[d.id] = d.lesson;
if (typeof COMPS !== "undefined") COMPS[d.id] = d.comps;
}
})();










(function () {
const pk = (a) => a[Math.floor(R.rand() * a.length)];
const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; };
const g2 = (a, b) => (b ? g2(b, a % b) : Math.abs(a));
const r9 = (v) => +(+v).toFixed(9);

const grp = (i) => (i.length >= 4 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\,") : i);
const nf = (v) => { v = r9(v); const [i, f] = String(Math.abs(v)).split("."); return (v < 0 ? "-" : "") + grp(i) + (f ? "{,}" + f : ""); };
const nt = (v) => nf(v).replace(/\\,/g, "\u202f").replace("{,}", ",").replace(/^-/, "−");

const eu = (v) => { const c = Math.round(v * 100) / 100, s = Number.isInteger(c) ? String(Math.abs(c)) : Math.abs(c).toFixed(2), [i, f] = s.split("."); return (c < 0 ? "-" : "") + grp(i) + (f ? "{,}" + f : ""); };
const EUR = (v) => M(eu(v) + "\\ \\text{€}");
const PC = (v) => M(nf(v) + "\\,\\%");
const par = (v) => (v < 0 ? "(" + nf(v) + ")" : nf(v));

const FT = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = g2(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n) : (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
const den = (v) => { for (let d = 1; d <= 400; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-9) return d; return 0; };
const fT = (v) => { const d = den(v); if (d === 1) return nf(Math.round(v)); if (!d || d > 40) return nf(+v.toFixed(4)); return FT(Math.round(v * d), d); };
const sg = (v) => (v < 0 ? " - " + nf(-v) : " + " + nf(v));
const lin = (a, b) => (a === 1 ? "" : a === -1 ? "-" : nf(a)) + "x" + (b ? sg(b) : "");
const linE = (a, b) => a + "*x" + (b < 0 ? "-" + -b : b ? "+" + b : "");
const OPT = { ">": ">", "<": "<", ">=": "\\ge", "<=": "\\le" };
const IV = (ivs) => (ivs.length ? ivs.map(([a, ai, b, bi]) => (ai ? "[" : "]") + (a === -Infinity ? "-\\infty" : fT(a)) + " \\,;\\, " + (b === Infinity ? "+\\infty" : fT(b)) + (bi ? "]" : "[")).join(" \\cup ") : "\\varnothing");

const show = (spec) => (spec.kind === "pair" || spec.kind === "set" ? spec.values.map((v) => { const d = den(v); return d > 1 && d <= 40 ? Math.round(v * d) + "/" + d : String(r9(v)); }).join(" ; ") : SolSet.show(spec.ivs, false));
const keepT = (spec, traps) => { const seen = new Set(); return (traps || []).filter((tr) => { if (!tr) return false; if (tr.e) return true;
if (tr.spec) { let c; try { c = show(tr.spec); if (seen.has(c) || tr.spec.kind !== spec.kind || checkAnswer(tr.spec, c).status !== "correct" || checkAnswer(spec, c).status === "correct") return false; } catch (e) { return false; }
seen.add(c); return true; }
if (!isFinite(tr.v) || seen.has(r9(tr.v))) return false; seen.add(r9(tr.v)); return Math.abs(tr.v - spec.value) > Math.max(spec.round || 0, 1e-9); }); };
const mk = (q, spec, sol, o) => { const x = { q, spec, sol, guide: o.guide, ctx: o.ctx, traps: keepT(spec, o.traps) }; if (o.fig) x.fig = o.fig; if (o.canon) x.canon = o.canon; if (o.shownOk) x.shownOk = true; return x; };
const QN = (q, value, sol, o) => mk(q, Object.assign({ kind: "value", value }, o.round ? { round: o.round } : {}), sol, o);
const QP = (q, vals, sol, o) => mk(q, { kind: "pair", values: vals }, sol, Object.assign({ canon: vals.map((v) => String(v)).join(" ; ") }, o));
const QSet = (q, vals, sol, o) => mk(q, { kind: "set", values: [...new Set(vals)] }, sol, o);
const QS = (q, ivs, sol, o) => mk(q, solsetSpec(ivs), sol, Object.assign({ canon: SolSet.show(ivs, false) }, o));
const GP = (ask, vals, sol) => ({ ask, spec: { kind: "pair", values: vals }, sol });
const GSS = (ask, ivs, sol) => ({ ask, spec: solsetSpec(ivs), sol });
const GSet = (ask, vals, sol) => ({ ask, spec: { kind: "set", values: [...new Set(vals)] }, sol });
const TP = (vals, m) => ({ spec: { kind: "pair", values: vals }, m });
const TS = (ivs, m) => ({ spec: solsetSpec(ivs), m });
const TSet = (vals, m) => ({ spec: { kind: "set", values: [...new Set(vals)] }, m });
const TR = TRAP;
const FA = " (fraction acceptée)";
const SETQ = " Donne l'ensemble des solutions (intervalle ou réunion d'intervalles).";
const P = (q, parts, hints, sol, fig) => ({ fig, q, parts: parts.map(([label, value]) => ({ label, spec: { kind: "value", value } })), hints, sol });


let uid = 0;
const svg = (w, h, g, label) => '<svg class="fig" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg">' + g + "</svg>";
const tx = (x, y, s, o = {}) => '<text x="' + (+x).toFixed(1) + '" y="' + (+y).toFixed(1) + '" class="' + (o.cls || "f-txt") + '" text-anchor="' + (o.a || "middle") + '" font-size="' + (o.size || 13) + '">' + s + "</text>";
const ln = (x1, y1, x2, y2, cls = "f-line", extra = "") => '<line x1="' + (+x1).toFixed(1) + '" y1="' + (+y1).toFixed(1) + '" x2="' + (+x2).toFixed(1) + '" y2="' + (+y2).toFixed(1) + '" class="' + cls + '" ' + extra + "/>";

function vecGrid(vecs, pts = [], xr = [0, 9], yr = [0, 7]) {
const id = "fv" + ++uid, U = 30, W = (xr[1] - xr[0]) * U + 24, H = (yr[1] - yr[0]) * U + 24, X = (x) => 12 + (x - xr[0]) * U, Y = (y) => H - 12 - (y - yr[0]) * U;
let g = '<defs><marker id="' + id + '" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" class="f-headacc"/></marker></defs>';
for (let x = xr[0]; x <= xr[1]; x++) g += ln(X(x), Y(yr[0]), X(x), Y(yr[1]), "f-grid");
for (let y = yr[0]; y <= yr[1]; y++) g += ln(X(xr[0]), Y(y), X(xr[1]), Y(y), "f-grid");
vecs.forEach(([x0, y0, u1, u2, nm]) => {
g += ln(X(x0), Y(y0), X(x0 + u1), Y(y0 + u2), "f-accent", 'stroke-width="2.6" marker-end="url(#' + id + ')"');
const mx = (X(x0) + X(x0 + u1)) / 2, my = (Y(y0) + Y(y0 + u2)) / 2, nx = -u2, ny = u1, nn = Math.hypot(nx, ny) || 1;
if (nm) g += tx(mx + (14 * nx) / nn, my - (14 * ny) / nn + 5, nm, { cls: "f-accent f-txt", size: 15 });
});
pts.forEach(([x, y, nm]) => (g += '<circle cx="' + X(x) + '" cy="' + Y(y) + '" r="3.5" class="f-dot"/>' + tx(X(x) + 9, Y(y) - 7, nm, { a: "start", size: 13 })));
return svg(W, H, g, "quadrillage avec vecteurs");
}

function treeFig(lab, p) {
const f = (v) => (v === null ? "?" : nt(v)), [A, B] = lab;
const R0 = [18, 110], N1 = [[130, 55], [130, 165]], N2 = [[262, 28], [262, 82], [262, 138], [262, 192]];
let g = '<circle cx="' + R0[0] + '" cy="' + R0[1] + '" r="4" class="f-dot"/>';
const lb = [[A, f(p[0])], [A + "\u0305", p[0] === null ? "?" : nt(r9(1 - p[0]))]];
N1.forEach((n, i) => { g += ln(R0[0], R0[1], n[0] - 12, n[1]) + tx(n[0], n[1] + 5, lb[i][0], { size: 15 }) + tx((R0[0] + n[0]) / 2 - 4, (R0[1] + n[1]) / 2 + (i ? 18 : -8), lb[i][1], { cls: "f-accent f-txt", size: 13 }); });
const q = [p[1], p[2]];
N2.forEach((n, j) => { const i = j >> 1, top = !(j & 1), v = q[i] === null ? null : top ? q[i] : r9(1 - q[i]);
g += ln(N1[i][0] + 12, N1[i][1], n[0] - 14, n[1]) + tx(n[0], n[1] + 5, top ? B : B + "\u0305", { size: 15 }) + tx((N1[i][0] + n[0]) / 2 + 4, (N1[i][1] + n[1]) / 2 + (top ? -6 : 16), q[i] === null ? "?" : nt(v), { cls: "f-accent f-txt", size: 13 }); });
return svg(300, 214, g, "arbre pondéré");
}


function signTable(factors, last, signs) {
const zs = [...new Set(factors.map((f) => r9(f[1])))].sort((a, b) => a - b), W = 330, c0 = 96, rh = 30, H = rh * (factors.length + 2) + 4;
const X = (k) => c0 + 26 + ((W - c0 - 52) * (k + 1)) / (zs.length + 1);
let g = '<rect x="2" y="2" width="' + (W - 4) + '" height="' + (H - 4) + '" class="f-line" fill="none"/>' + ln(c0, 2, c0, H - 2);
g += tx(c0 / 2, 22, "x", { size: 14 }) + tx(c0 + 14, 22, "−∞", { size: 13 }) + tx(W - 16, 22, "+∞", { size: 13 });
zs.forEach((z, k) => (g += tx(X(k), 22, nt(z), { size: 13 })));
const rows = factors.map((f) => [f[0], f]).concat([[last, null]]);
rows.forEach(([name, f], r) => {
const y = rh * (r + 1) + 2;
g += ln(2, y, W - 2, y) + tx(c0 / 2, y + 20, name, { size: name.length > 11 ? 11 : 13 });
zs.forEach((z, k) => {
if (f && Math.abs(f[1] - z) > 1e-9) return;
const isDen = f ? f[2] : factors.some((ff) => ff[2] && Math.abs(ff[1] - z) < 1e-9);
g += isDen ? ln(X(k) - 2, y, X(k) - 2, y + rh) + ln(X(k) + 2, y, X(k) + 2, y + rh) : tx(X(k), y + 20, "0", { size: 13 }) + ln(X(k), y, X(k), y + rh, "f-grid");
});
if (signs && signs[r]) signs[r].forEach((sgn, k) => (g += tx(k === 0 ? (c0 + X(0)) / 2 + 6 : k === zs.length ? (X(k - 1) + W) / 2 - 4 : (X(k - 1) + X(k)) / 2, y + 21, sgn, { cls: "f-accent f-txt", size: 16 })));
});
return svg(W, H, g, "tableau de signes à compléter");
}

function rayFig(a, right, incl) {
const W = 320, H = 64, x0 = a - 5, X = (x) => 20 + ((x - x0) * (W - 40)) / 10, y = 34;
let g = ln(10, y, W - 10, y);
for (let x = x0; x <= x0 + 10; x++) g += ln(X(x), y - 4, X(x), y + 4) + (x === a || x === x0 + 1 || x === x0 + 9 || x === 0 ? tx(X(x), y + 20, nt(x), { size: 12 }) : "");
g += ln(X(a), y, right ? W - 12 : 12, y, "f-accent", 'stroke-width="4"');
const open = right ? !incl : incl, d = open ? -7 : 7;
g += '<path d="M' + (X(a) + d) + "," + (y - 10) + " L" + X(a) + "," + (y - 10) + " L" + X(a) + "," + (y + 10) + " L" + (X(a) + d) + "," + (y + 10) + '" class="f-accent" stroke-width="2.6" fill="none"/>';
return svg(W, H, g, "droite graduée");
}

window.FR2NDE_FIG = { vecGrid, treeFig, signTable };



const CROIS = [
{ pop: "élèves", lieu: "un lycée de Nantes", un: "un élève", A: "F", tA: "l'élève est une fille", rA: ["Filles", "Garçons"], B: "D", tB: "l'élève est demi-pensionnaire", cB: ["Demi-pens.", "Externes"] },
{ pop: "habitants", lieu: "une enquête menée à Lyon", un: "un habitant", A: "J", tA: "la personne a moins de 30 ans", rA: ["− de 30 ans", "30 ans et +"], B: "V", tB: "la personne se déplace à vélo", cB: ["Vélo", "Autre"] },
{ pop: "spectateurs", lieu: "un cinéma de Lille", un: "un spectateur", A: "T", tA: "le spectateur a vu le film en 3D", rA: ["3D", "2D"], B: "C", tB: "le spectateur a acheté du pop-corn", cB: ["Pop-corn", "Sans"] },
{ pop: "salariés", lieu: "une entreprise de Bordeaux", un: "un salarié", A: "C", tA: "le salarié est cadre", rA: ["Cadres", "Autres"], B: "W", tB: "le salarié télétravaille", cB: ["Télétravail", "Sur site"] },
{ pop: "clients", lieu: "une librairie de Strasbourg", un: "un client", A: "E", tA: "le client est étudiant", rA: ["Étudiants", "Autres"], B: "N", tB: "le client a acheté une BD", cB: ["BD", "Pas de BD"] },
];
const crois = () => { const c = pk(CROIS), k = pk([1, 2, 5]), a = R.int(6, 30) * k, b = R.int(6, 30) * k, cc = R.int(6, 30) * k, d = R.int(6, 30) * k; return { c, a, b, cc, d, N: a + b + cc + d }; };
const tab = (T, hide) => { const { c, a, b, cc, d, N } = T, v = { a, b, cc, d }, cell = (k) => (hide === k ? "\\boldsymbol{?}" : nf(v[k]));
return M("\\small\\begin{array}{l|c|c|c} & \\text{" + c.cB[0] + "} & \\text{" + c.cB[1] + "} & \\text{Total} \\\\ \\hline \\text{" + c.rA[0] + "} & " + cell("a") + " & " + cell("b") + " & " + nf(a + b) + " \\\\ \\text{" + c.rA[1] + "} & " + cell("cc") + " & " + cell("d") + " & " + nf(cc + d) + " \\\\ \\hline \\text{Total} & " + nf(a + cc) + " & " + nf(b + d) + " & " + nf(N) + " \\end{array}"); };
const evts = (c) => "On note " + M(c.A) + " l'évènement « " + c.tA + " » et " + M(c.B) + " l'évènement « " + c.tB + " ».";
const pr = (v) => [0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9].filter((x) => x !== v);
const DEPIST = [
["Une maladie touche", "des personnes d'une région. Un test de dépistage est positif chez", "des malades et chez", "des personnes saines (faux positifs). Le test d'une personne prise au hasard est positif. Quelle est la probabilité qu'elle soit réellement malade ?", "malade", "test positif"],
["Dans un magasin de Marseille,", "des clients ont un article non payé dans leur sac. Le portique sonne pour", "de ces clients et, par erreur, pour", "des clients honnêtes. Le portique sonne. Quelle est la probabilité que le client ait vraiment un article non payé ?", "fraude", "portique sonne"],
["Parmi les courriels reçus par une mairie,", "sont des courriels frauduleux. Le filtre bloque", "des courriels frauduleux et, par erreur,", "des courriels normaux. Un courriel est bloqué. Quelle est la probabilité qu'il soit frauduleux ?", "frauduleux", "bloqué"],
];

const revele = (p, q, r, v) => [p, 1 - p, q, 1 - q, r, 1 - r].some((x) => Math.abs(x - v) < 1e-9);
const PCOND = {
1: [
() => { const T = crois(), { c, a, b, N } = T, v = (a + b) / N;
return QN("Dans " + c.lieu + ", on a interrogé " + M(nf(N)) + " " + c.pop + ". " + tab(T) + " Quelle est la fréquence des « " + c.rA[0] + " » parmi l'ensemble des " + c.pop + " ?" + FA, v, "Fréquence marginale : effectif de la ligne sur l'effectif total, " + M("\\frac{" + nf(a + b) + "}{" + nf(N) + "} = " + fT(v)) + ".",
{ ctx: "marginale", guide: [GS("Effectif total de la ligne « " + c.rA[0] + " » ?", a + b, M(nf(a) + " + " + nf(b) + " = " + nf(a + b)) + "."), GS("Fréquence : " + M("\\frac{" + nf(a + b) + "}{" + nf(N) + "}") + " = ?", v, M(fT(v)) + ".")],
traps: [TR(a / N, "Ça, c'est la fréquence d'une seule case ; on veut toute la ligne « " + c.rA[0] + " »."), TR((a + b) / (a + T.cc), "On divise par l'effectif total " + nt(N) + ".")] }); },
() => { const T = crois(), { c, a, b, cc, N } = T, v = a / (a + b);
return QN("Dans " + c.lieu + ", on a interrogé " + M(nf(N)) + " " + c.pop + ". " + tab(T) + " Parmi les « " + c.rA[0] + " », quelle est la fréquence des « " + c.cB[0] + " » ?" + FA, v, "Fréquence conditionnelle : on se place dans la ligne « " + c.rA[0] + " » (" + nt(a + b) + " " + c.pop + "), " + M("\\frac{" + nf(a) + "}{" + nf(a + b) + "} = " + fT(v)) + ".",
{ ctx: "conditionnelle", guide: [GS("Combien de « " + c.rA[0] + " » en tout ?", a + b, M(nf(a + b)) + " : c'est le nouveau total."), GS("Fréquence " + M("\\frac{" + nf(a) + "}{" + nf(a + b) + "}") + " = ?", v, M(fT(v)) + ".")],
traps: [TR(a / N, "« Parmi les " + c.rA[0] + " » : on divise par " + nt(a + b) + ", pas par l'effectif total."), TR(a / (a + cc), "Ça, c'est la fréquence des « " + c.rA[0] + " » parmi les « " + c.cB[0] + " » : l'ordre compte.")] }); },
() => { const T = crois(), { c, a, b, cc, d } = T, k = pk(["a", "b", "cc", "d"]), v = T[k], row = k === "a" || k === "b" ? a + b : cc + d, oth = { a: b, b: a, cc: d, d: cc }[k];
return QN("Dans " + c.lieu + ", on a interrogé " + T.N + " " + c.pop + ". Complète la case manquante du tableau croisé. " + tab(T, k), v, "Sur sa ligne, le total vaut " + M(nf(row)) + " : " + M(nf(row) + " - " + nf(oth) + " = " + nf(v)) + ".",
{ ctx: "case-manquante", guide: [GS("Total de la ligne de la case manquante ?", row, M(nf(row)) + "."), GS("Case manquante : " + M(nf(row) + " - " + nf(oth)) + " = ?", v, M(nf(v)) + ".")],
traps: [TR(row + oth, "La case et sa voisine font le total de la ligne : on soustrait."), TR(T.N - row - oth, "Utilise le total de la ligne (ou de la colonne) de la case.")] }); },
],
2: [
() => { const T = crois(), { c, a, b, cc, N } = T, v = a / (a + b);
return QN("Dans " + c.lieu + ", on choisit au hasard " + c.un + ". " + tab(T) + " " + evts(c) + " Calcule " + M("P_{" + c.A + "}(" + c.B + ")") + "." + FA, v, M("P_{" + c.A + "}(" + c.B + ")") + " : probabilité de " + M(c.B) + " sachant " + M(c.A) + ". On se place dans la ligne « " + c.rA[0] + " » : " + M("\\frac{" + nf(a) + "}{" + nf(a + b) + "} = " + fT(v)) + ".",
{ ctx: "pab-tableau", guide: [GS("On sait que " + M(c.A) + " est réalisé : combien de " + c.pop + " restent possibles ?", a + b, M(nf(a + b)) + " (ligne « " + c.rA[0] + " »)."), GS(M("P_{" + c.A + "}(" + c.B + ")") + " = ?", v, M("\\frac{" + nf(a) + "}{" + nf(a + b) + "} = " + fT(v)) + ".")],
traps: [TR(a / (a + cc), "Ça, c'est " + "P_" + c.B + "(" + c.A + ") : sachant " + c.A + ", on divise par l'effectif de " + c.A + "."), TR(a / N, "Ça, c'est P(" + c.A + " ∩ " + c.B + ") : « sachant " + c.A + " » réduit l'univers à " + c.A + ".")] }); },
() => { const c = pk(CROIS), p = pk(pr()), q = pk(pr()), r = pk(pr(q)), v = r9(p * q); if (revele(p, q, r, v)) return null;
return QN("On choisit au hasard " + c.un + " (" + c.lieu + "). " + evts(c) + " L'arbre pondéré décrit la situation. Calcule " + M("P(" + c.A + " \\cap " + c.B + ")") + ".", v, "Produit des probabilités le long du chemin " + M(c.A) + " puis " + M(c.B) + " : " + M(nf(p) + " \\times " + nf(q) + " = " + nf(v)) + ".",
{ ctx: "arbre-inter", fig: treeFig([c.A, c.B], [p, q, r]), guide: [GS("Probabilité de la première branche, " + M("P(" + c.A + ")") + " ?", p, M(nf(p)) + "."), GS("Puis " + M("P_{" + c.A + "}(" + c.B + ")") + " ?", q, M(nf(q)) + " (branche de " + c.A + " vers " + c.B + ")."), GS("On multiplie : " + M("P(" + c.A + " \\cap " + c.B + ")") + " = ?", v, M(nf(v)) + ".")],
traps: [TR(r9(p + q), "Le long d'un chemin, on multiplie les probabilités (on n'additionne pas)."), TR(q, "Ça, c'est P_" + c.A + "(" + c.B + ") ; il faut encore multiplier par P(" + c.A + ").")] }); },
() => { const c = pk(CROIS), p = pk(pr()), q = pk(pr()), r = pk(pr(q)), v = r9(p * q + (1 - p) * r); if (revele(p, q, r, v)) return null;
return QN("On choisit au hasard " + c.un + " (" + c.lieu + "). " + evts(c) + " L'arbre pondéré décrit la situation. Calcule " + M("P(" + c.B + ")") + ".", v, "Deux chemins mènent à " + M(c.B) + " (formule des probabilités totales) : " + M(nf(p) + " \\times " + nf(q) + " + " + nf(r9(1 - p)) + " \\times " + nf(r) + " = " + nf(v)) + ".",
{ ctx: "arbre-totale", fig: treeFig([c.A, c.B], [p, q, r]), guide: [GS("Chemin " + M(c.A) + " puis " + M(c.B) + " : probabilité ?", r9(p * q), M(nf(p) + " \\times " + nf(q) + " = " + nf(r9(p * q))) + "."), GS("Chemin " + M("\\bar{" + c.A + "}") + " puis " + M(c.B) + " : probabilité ?", r9((1 - p) * r), M(nf(r9(1 - p)) + " \\times " + nf(r) + " = " + nf(r9((1 - p) * r))) + "."), GS(M("P(" + c.B + ")") + " = ?", v, "On additionne les deux chemins : " + M(nf(v)) + ".")],
traps: [TR(r9(p * q), "Il y a un second chemin qui mène à " + c.B + " : en passant par " + c.A + "̅."), TR(r9(q + r), "On multiplie le long de chaque chemin avant d'additionner."), TR(r9(q * r), "On additionne les probabilités des deux chemins.")] }); },
],
3: [
() => { const D = pk(DEPIST), p = pk([0.01, 0.02, 0.05, 0.1]), s = pk([0.9, 0.95, 0.99]), f = pk([0.02, 0.05, 0.1]), num = r9(p * s), tot = r9(p * s + (1 - p) * f), v = num / tot; if (revele(p, s, f, v)) return null;
return QN(D[0] + " " + PC(p * 100) + " " + D[1] + " " + PC(s * 100) + " " + D[2] + " " + PC(f * 100) + " " + D[3] + " (arrondie au centième)", v, "On note M : « " + D[4] + " » et T : « " + D[5] + " ». " + M("P(M \\cap T) = " + nf(p) + " \\times " + nf(s) + " = " + nf(num)) + " ; " + M("P(T) = " + nf(num) + " + " + nf(r9(1 - p)) + " \\times " + nf(f) + " = " + nf(tot)) + " ; " + M("P_T(M) = \\frac{" + nf(num) + "}{" + nf(tot) + "} \\approx " + nf(+v.toFixed(2))) + ".",
{ ctx: "faux-positifs", round: 0.01, fig: treeFig(["M", "T"], [p, s, f]), guide: [GS(M("P(M \\cap T)") + " = ?", num, M(nf(p) + " \\times " + nf(s) + " = " + nf(num)) + "."), GS(M("P(T)") + " (deux chemins) = ?", tot, M(nf(num) + " + " + nf(r9(1 - p)) + " \\times " + nf(f) + " = " + nf(tot)) + "."), GS(M("P_T(M) = \\frac{P(M \\cap T)}{P(T)}") + " ≈ ? (au centième)", v, M("\\approx " + nf(+v.toFixed(2))) + ".", 0.01)],
traps: [TR(s, "Ça, c'est P_M(T) (le test chez les malades). On demande l'inverse : P_T(M), malade sachant le test positif."), TR(num, "Ça, c'est P(M ∩ T) ; il faut diviser par P(T)."), TR(1 - f, "Les faux positifs comptent, mais il faut passer par P(T).")] }); },
() => { const T = crois(), { c, a, b, cc } = T, v = a / (a + cc);
return QN("Dans " + c.lieu + ", on choisit au hasard " + c.un + ". " + tab(T) + " " + evts(c) + " Calcule " + M("P_{" + c.B + "}(" + c.A + ")") + "." + FA, v, "Sachant " + M(c.B) + " : on se place dans la colonne « " + c.cB[0] + " » (" + nt(a + cc) + "), " + M("P_{" + c.B + "}(" + c.A + ") = \\frac{" + nf(a) + "}{" + nf(a + cc) + "} = " + fT(v)) + ".",
{ ctx: "pba-tableau", guide: [GS("« Sachant " + c.B + " » : quel est l'effectif de " + M(c.B) + " (colonne « " + c.cB[0] + " ») ?", a + cc, M(nf(a + cc)) + "."), GS(M("P_{" + c.B + "}(" + c.A + ")") + " = ?", v, M(fT(v)) + ".")],
traps: [TR(a / (a + b), "Ça, c'est P_" + c.A + "(" + c.B + ") : ici on sait que " + c.B + " est réalisé, on divise par l'effectif de " + c.B + "."), TR(a / T.N, "Ça, c'est P(" + c.A + " ∩ " + c.B + ").")] }); },
() => { const c = pk(CROIS), pa = pk([0.2, 0.25, 0.4, 0.5, 0.6, 0.75, 0.8]), q = pk([0.15, 0.2, 0.3, 0.35, 0.45, 0.6, 0.7]), inter = r9(pa * q), swap = R.rand() < 0.5;
const X = swap ? c.B : c.A, Y = swap ? c.A : c.B;
return QN("On choisit au hasard " + c.un + " (" + c.lieu + "). " + evts(c) + " On sait que " + M("P(" + X + ") = " + nf(pa)) + " et " + M("P(" + c.A + " \\cap " + c.B + ") = " + nf(inter)) + ". Calcule " + M("P_{" + X + "}(" + Y + ")") + ".", q, M("P_{" + X + "}(" + Y + ") = \\frac{P(" + c.A + " \\cap " + c.B + ")}{P(" + X + ")} = \\frac{" + nf(inter) + "}{" + nf(pa) + "} = " + nf(q)) + ".",
{ ctx: "definition", guide: [GS("Formule : " + M("P_{" + X + "}(" + Y + ") = \\frac{P(" + c.A + " \\cap " + c.B + ")}{P(" + X + ")}") + ". Calcule " + M("\\frac{" + nf(inter) + "}{" + nf(pa) + "}") + ".", q, M(nf(q)) + ".")],
traps: [TR(r9(inter * pa), "On divise par P(" + X + ") : P(" + c.A + " ∩ " + c.B + ") = P(" + X + ") × P_" + X + "(" + Y + ")."), TR(r9(inter / (1 - pa)), "On divise par P(" + X + "), pas par P(" + X + "̅).")] }); },
],
};


const fval = (fs, x) => fs.reduce((p, [a, b]) => p * (a * x + b), 1);
function signSet(nums, dens, op) {
const zd = dens.map(([a, b]) => -b / a), cr = [...new Set(nums.concat(dens).map(([a, b]) => r9(-b / a)))].sort((u, v) => u - v), pts = [-Infinity, ...cr, Infinity];
const isD = (x) => zd.some((z) => Math.abs(z - x) < 1e-9);
const ok = (x) => { if (isD(x)) return false; const v = fval(nums, x) / fval(dens, x), e = Math.abs(v) < 1e-12 ? 0 : v; return op === ">" ? e > 0 : op === "<" ? e < 0 : op === ">=" ? e >= 0 : e <= 0; };
const ivs = [];
for (let i = 0; i < pts.length - 1; i++) {
const lo = pts[i], hi = pts[i + 1], mid = lo === -Infinity ? (hi === Infinity ? 0 : hi - 1) : hi === Infinity ? lo + 1 : (lo + hi) / 2;
if (!ok(mid)) continue;
const loIn = isFinite(lo) && ok(lo), hiIn = isFinite(hi) && ok(hi), last = ivs[ivs.length - 1];
if (last && last[2] === lo && last[3]) { last[2] = hi; last[3] = hiIn; } else ivs.push([lo, loIn, hi, hiIn]);
}
return ivs;
}
const facT = ([a, b]) => (b === 0 ? lin(a, 0) : "(" + lin(a, b) + ")");
const facS = ([a, b]) => lin(a, b).replace(/\{,\}/g, ",").replace(/ - /g, " − ").replace(/^-/, "−");
const facZ = () => { const a = pk([1, 1, 1, 2, 3, -1, -2]), z = R.int(-6, 6); return [a, -a * z]; };
const zero = ([a, b]) => r9(-b / a);
const complement = (ivs) => { const out = []; let lo = -Infinity, li = false; for (const [a, ai, b, bi] of ivs) { if (a > lo || (a === lo && !ai && !li && isFinite(a))) out.push([lo, li, a, !ai]); lo = b; li = !bi; } if (lo < Infinity) out.push([lo, li, Infinity, false]); return out.filter(([a, , b]) => a < b); };
const twoFac = (allowNeg) => { let f1, f2; do { f1 = facZ(); f2 = facZ(); } while (zero(f1) === zero(f2) || (!allowNeg && (f1[0] < 0 || f2[0] < 0)) || (f1[1] === 0 && f2[1] === 0)); return zero(f1) < zero(f2) ? [f1, f2] : [f2, f1]; };
const TSIG = {
1: [
() => { const a = pk([2, 3, 4, 5, -2, -3, -4]), z = R.int(-7, 7) || 3, b = -a * z;
return QN("Dans le tableau de signes de " + M("f(x) = " + lin(a, b)) + ", pour quelle valeur de " + M("x") + " le signe change-t-il ?", z, "Le signe change là où " + M("f(x) = 0") + " : " + M(lin(a, b) + " = 0 \\iff x = " + nf(z)) + ".",
{ ctx: "zero-affine", guide: [GS("On résout " + M(lin(a, b) + " = 0") + " : " + M(nf(a) + "x") + " = ?", -b, M(nf(-b)) + "."), GS(M("x") + " = ?", z, M(nf(z)) + ".")], traps: [TR(-z, "Attention au signe : " + nt(a) + "x = " + nt(-b) + "."), TR(b, "Le changement de signe a lieu en x = −b/a, pas en b.")] }); },
() => { const a = pk([2, 3, 4, -2, -3, -1]), z = nz(-6, 6), b = -a * z, op = pk([">", "<"]), ivs = signSet([[a, b]], [], op);
return QS("Pour quelles valeurs de " + M("x") + " a-t-on " + M(lin(a, b) + " " + OPT[op] + " 0") + " ?" + SETQ, ivs, "Zéro en " + M("x = " + nf(z)) + " ; le coefficient de " + M("x") + " est " + (a > 0 ? "positif : " + M("-") + " puis " + M("+") : "négatif : " + M("+") + " puis " + M("-")) + ". Donc " + M(IV(ivs)) + ".",
{ ctx: "signe-affine", guide: [GS("Valeur qui annule " + M(lin(a, b)) + " ?", z, M(nf(z)) + "."), GS("Signe de " + M(lin(a, b)) + " pour " + M("x") + " très grand : 1 pour « + », −1 pour « − » ?", a > 0 ? 1 : -1, "Même signe que " + M("a = " + nf(a)) + " (à droite du zéro)."), GSS("Ensemble des solutions ?", ivs, M(IV(ivs)) + ".")],
traps: [TS(complement(ivs), "C'est l'autre côté : regarde le signe du coefficient de x (" + nt(a) + ")."), TS(signSet([[Math.abs(a), -Math.abs(a) * z]], [], op), "Avec un coefficient négatif, les signes sont « + » puis « − ».")] }); },
() => { const [f1, f2] = twoFac(true), z1 = zero(f1), z2 = zero(f2);
return QSet("On veut dresser le tableau de signes de " + M("P(x) = " + facT(f1) + facT(f2)) + ". Quelles valeurs de " + M("x") + " faut-il placer dans la première ligne ? (Sépare-les par « ; ».)", [z1, z2], "Ce sont les valeurs qui annulent un facteur : " + M(facS(f1).replace(/−/g, "-") + " = 0 \\iff x = " + nf(z1)) + " et " + M(facS(f2).replace(/−/g, "-") + " = 0 \\iff x = " + nf(z2)) + ".",
{ ctx: "valeurs-ligne", guide: [GS("Zéro de " + M(lin(...f1)) + " ?", z1, M(nf(z1)) + "."), GS("Zéro de " + M(lin(...f2)) + " ?", z2, M(nf(z2)) + ".")], traps: [TSet([-z1, -z2], "Le zéro de x − a est a (et non −a)."), TSet([f1[1], f2[1]], "On cherche x tel que chaque facteur s'annule, pas les nombres de l'expression.")] }); },
],
2: [
() => { const [f1, f2] = twoFac(false), op = pk([">", "<", ">=", "<="]), ivs = signSet([f1, f2], [], op), z1 = zero(f1), z2 = zero(f2);
return QS("Résous " + M(facT(f1) + facT(f2) + " " + OPT[op] + " 0") + " à l'aide d'un tableau de signes." + SETQ, ivs, "Zéros : " + M(nf(z1)) + " et " + M(nf(z2)) + ". Le produit est positif à l'extérieur des zéros et négatif entre eux. " + M("S = " + IV(ivs)) + ".",
{ ctx: "produit", fig: signTable([[facS(f1), z1], [facS(f2), z2]], "produit"), guide: [GS("Plus petit zéro ?", z1, M(nf(z1)) + "."), GS("Plus grand zéro ?", z2, M(nf(z2)) + "."), GS("Signe du produit entre les deux zéros : 1 pour « + », −1 pour « − » ?", -1, "Un facteur positif et un négatif : « − »."), GSS("Ensemble des solutions ?", ivs, M(IV(ivs)) + ".")],
traps: [TS(complement(ivs), "C'est l'ensemble contraire : le produit est négatif entre les zéros, positif à l'extérieur.")] }); },
() => { let f1, f2; do { [f1, f2] = twoFac(true); } while (f1[0] * f2[0] > 0); const op = pk([">", "<", ">=", "<="]), ivs = signSet([f1, f2], [], op), z1 = zero(f1), z2 = zero(f2);
return QS("Résous " + M(facT(f1) + facT(f2) + " " + OPT[op] + " 0") + "." + SETQ, ivs, "Zéros " + M(nf(z1)) + " et " + M(nf(z2)) + ". Un des coefficients de " + M("x") + " est négatif : le produit est négatif à l'extérieur des zéros, positif entre eux. " + M("S = " + IV(ivs)) + ".",
{ ctx: "produit-negatif", fig: signTable([[facS(f1), z1], [facS(f2), z2]], "produit"), guide: [GS("Le facteur de coefficient négatif est positif à gauche de son zéro. Signe du produit pour x très grand : 1 ou −1 ?", -1, "Un facteur « + », l'autre « − » : « − »."), GSS("Ensemble des solutions ?", ivs, M(IV(ivs)) + ".")],
traps: [TS(complement(ivs), "Attention au facteur dont le coefficient de x est négatif : son signe est « + » puis « − »."), TS(signSet([[Math.abs(f1[0]), Math.abs(f1[0]) * -z1], [Math.abs(f2[0]), Math.abs(f2[0]) * -z2]], [], op), "Avec un coefficient négatif, les signes du facteur sont inversés.")] }); },
() => { const k = pk([1, 2, 3, -1, -2]), z = nz(-7, 7), op = pk([">", "<", ">=", "<="]), f1 = [k, 0], f2 = [1, -z], ivs = signSet([f1, f2], [], op), A = k, B = -k * z;
return QS("Résous " + M((A === 1 ? "" : A === -1 ? "-" : A) + "x^2" + sg(B).replace(/(\d)$/, "$1x") + " " + OPT[op] + " 0") + " (factorise d'abord)." + SETQ, ivs, M((A === 1 ? "" : A === -1 ? "-" : A) + "x^2" + sg(B) + "x = " + nf(k) + "x(x" + sg(-z) + ")").replace("1x(", "x(").replace("-1x(", "-x(") + " ; zéros " + M("0") + " et " + M(nf(z)) + ". " + M("S = " + IV(ivs)) + ".",
{ ctx: "factoriser", guide: [GSet("Valeurs qui annulent l'expression (factorise par x) ?", [0, z], M("0") + " et " + M(nf(z)) + "."), GSS("Ensemble des solutions ?", ivs, M(IV(ivs)) + ".")],
traps: [TS(complement(ivs), "Vérifie le signe du coefficient de x² : il donne le signe à l'extérieur des zéros."), TS(signSet([[1, -z]], [], op), "On ne divise pas par x (son signe change) : on factorise et on fait un tableau de signes.")] }); },
],
3: [
() => { const [f1, f2] = twoFac(false), swap = R.rand() < 0.5, nu = swap ? f2 : f1, de = swap ? f1 : f2, op = pk([">=", "<=", ">", "<"]), ivs = signSet([nu], [de], op), zn = zero(nu), zd = zero(de);
return QS("Résous " + M("\\frac{" + lin(...nu) + "}{" + lin(...de) + "} " + OPT[op] + " 0") + "." + SETQ, ivs, "Zéro du numérateur " + M(nf(zn)) + ", valeur interdite " + M(nf(zd)) + " (double barre, toujours exclue). Le quotient a le signe du produit. " + M("S = " + IV(ivs)) + ".",
{ ctx: "quotient", fig: signTable([[facS(nu), zn], [facS(de), zd, true]], "quotient"), guide: [GS("Valeur interdite (dénominateur nul) ?", zd, M(nf(zd)) + " : elle est toujours exclue (crochet ouvert)."), GS("Zéro du numérateur ?", zn, M(nf(zn)) + (op.length === 2 ? " : inclus, car l'inégalité est large." : " : exclu, l'inégalité est stricte.")), GSS("Ensemble des solutions ?", ivs, M(IV(ivs)) + ".")],
traps: [TS(complement(ivs).map(([a, ai, b, bi]) => [a, ai && Math.abs(a - zd) > 1e-9, b, bi && Math.abs(b - zd) > 1e-9]), "C'est l'ensemble contraire : refais les signes colonne par colonne.")] }); },
() => { let f1, f2; do { [f1, f2] = twoFac(true); } while (f1[0] * f2[0] > 0); const swap = R.rand() < 0.5, nu = swap ? f2 : f1, de = swap ? f1 : f2, op = pk([">=", "<=", ">", "<"]), ivs = signSet([nu], [de], op), zn = zero(nu), zd = zero(de);
return QS("Résous " + M("\\frac{" + lin(...nu) + "}{" + lin(...de) + "} " + OPT[op] + " 0") + "." + SETQ, ivs, "Zéro du numérateur " + M(nf(zn)) + ", valeur interdite " + M(nf(zd)) + ". Un des coefficients de " + M("x") + " est négatif : les signes de ce facteur sont « + » puis « − ». " + M("S = " + IV(ivs)) + ".",
{ ctx: "quotient-negatif", guide: [GS("Valeur interdite ?", zd, M(nf(zd)) + "."), GS("Signe du quotient pour x très grand : 1 ou −1 ?", -1, "Un facteur « + », l'autre « − » : « − »."), GSS("Ensemble des solutions ?", ivs, M(IV(ivs)) + ".")],
traps: [TS(signSet([[Math.abs(nu[0]), -Math.abs(nu[0]) * zn]], [[Math.abs(de[0]), -Math.abs(de[0]) * zd]], op), "Un coefficient de x est négatif : ce facteur est positif à gauche de son zéro.")] }); },
() => { const z = nz(-5, 5), k = pk([2, 3, 4, 5, 6]), c = pk([1, 2, -1, -2]), op = pk([">=", "<=", ">", "<"]), nu = [-c, k + c * z], de = [1, -z];
if (nu[0] === 0 || Math.abs(zero(nu) - z) < 1e-9) return null; const ivs = signSet([nu], [de], op);
return QS("Résous " + M("\\frac{" + k + "}{x" + sg(-z) + "} " + OPT[op] + " " + c) + " (ramène à « … " + OPT[op].replace("\\ge", "≥").replace("\\le", "≤") + " 0 »)." + SETQ, ivs, M("\\frac{" + k + "}{x" + sg(-z) + "} - " + par(c) + " = \\frac{" + lin(...nu) + "}{x" + sg(-z) + "}") + " ; zéro " + M(fT(zero(nu))) + ", valeur interdite " + M(nf(z)) + ". " + M("S = " + IV(ivs)) + ".",
{ ctx: "ramener", guide: [GS("Une seule fraction : numérateur de " + M("\\frac{" + k + "}{x" + sg(-z) + "} - " + par(c)) + ", zéro du numérateur ?" + FA, zero(nu), M(k + " - " + par(c) + "(x" + sg(-z) + ") = " + lin(...nu)) + ", nul pour " + M("x = " + fT(zero(nu))) + "."), GS("Valeur interdite ?", z, M(nf(z)) + "."), GSS("Ensemble des solutions ?", ivs, M(IV(ivs)) + ".")],
traps: [TS(signSet([[c, k - c * z].map((v, i) => (i ? v : v))], [], op === ">=" ? "<=" : op === "<=" ? ">=" : op === ">" ? "<" : ">"), "On ne multiplie pas par (x − " + nt(z) + ") : son signe change. On ramène tout d'un côté."), TS(signSet([[c, -k - c * z].map((v) => v)], [], op), "On ne « fait pas passer » le dénominateur : on écrit une seule fraction comparée à 0.")] }); },
],
};


const TX = [3, 4, 6, 8, 12, 15, 18, 22, 35, 40, -3, -4, -6, -8, -12, -15, -18, -22, -35, -40];
const VILLES = ["Montpellier", "Rennes", "Angers", "Dijon", "Grenoble", "Tours", "Reims", "Le Havre", "Brest", "Limoges"];
const TAUX = {
1: [
() => { const t = pk(TX), cm = r9(1 + t / 100), inv = R.rand() < 0.5;
if (inv) return QN("On multiplie une quantité par " + M(nf(cm)) + ". Quel est le taux d'évolution correspondant (en %, négatif pour une baisse) ?" , t, M(nf(cm) + " = 1 " + sg(t / 100).replace(" ", "")) + " : taux " + M(nf(t) + "\\,\\%") + ".",
{ ctx: "cm-vers-taux", guide: [GS("Écart entre le coefficient et 1 : " + M(nf(cm) + " - 1") + " = ?", r9(t / 100), M(nf(r9(t / 100))) + "."), GS("En pour cent ?", t, M(nf(t) + "\\,\\%") + ".")], traps: [TR(r9(cm * 100), "Le coefficient " + nt(cm) + " correspond à " + nt(cm * 100) + " % de la valeur de départ : l'évolution, c'est l'écart avec 100 %."), TR(-t, "Coefficient " + (cm > 1 ? "plus grand" : "plus petit") + " que 1 : c'est une " + (t > 0 ? "hausse" : "baisse") + ".")] });
return QN((t > 0 ? "Augmenter" : "Diminuer") + " une quantité de " + PC(Math.abs(t)) + " revient à la multiplier par quel nombre (coefficient multiplicateur) ?", cm, M("1 " + (t > 0 ? "+" : "-") + " \\frac{" + Math.abs(t) + "}{100} = " + nf(cm)) + ".",
{ ctx: "taux-vers-cm", guide: [GS(M(Math.abs(t) + "\\,\\%") + " en écriture décimale ?", Math.abs(t) / 100, M(nf(Math.abs(t) / 100)) + "."), GS("Coefficient multiplicateur ?", cm, M("1 " + (t > 0 ? "+" : "-") + " " + nf(Math.abs(t) / 100) + " = " + nf(cm)) + ".")], traps: [TR(Math.abs(t) / 100, "Multiplier par " + nt(Math.abs(t) / 100) + " donne " + Math.abs(t) + " % de la quantité, pas la quantité " + (t > 0 ? "augmentée" : "diminuée") + "."), TR(r9(1 - t / 100), (t > 0 ? "Hausse" : "Baisse") + " : on " + (t > 0 ? "ajoute" : "retire") + " " + nt(Math.abs(t) / 100) + " à 1.")] }); },
() => { const S = pk([["le prix d'un ticket de tram à Strasbourg", [1.6, 2, 2.5]], ["le loyer mensuel d'un studio à Bordeaux", [400, 480, 560, 640]], ["le prix d'une baguette dans une boulangerie de Lille", [1, 1.2]], ["le prix d'un abonnement de vélo en libre-service à Paris", [20, 40, 80]]]), vd = pk(S[1]), cm = pk([1.25, 1.2, 1.5, 0.8, 0.75, 1.1, 0.9, 1.05]), va = r9(vd * cm), diff = R.rand() < 0.5;
if (Math.abs(va * 100 - Math.round(va * 100)) > 1e-6) return null;
return diff ? QN("En un an, " + S[0] + " passe de " + EUR(vd) + " à " + EUR(va) + ". Compare par une différence : de combien d'euros a-t-il varié ? (négatif pour une baisse)", r9(va - vd), "Variation absolue : " + M(eu(va) + " - " + eu(vd) + " = " + eu(r9(va - vd))) + " €.",
{ ctx: "difference", guide: [GS("Valeur d'arrivée moins valeur de départ ?", r9(va - vd), M(eu(r9(va - vd))) + " €.")], traps: [TR(r9(vd - va), "Variation = valeur d'arrivée − valeur de départ (négative pour une baisse)."), TR(cm, "Ça, c'est le quotient (comparaison multiplicative) ; on demande la différence.")] })
: QN("En un an, " + S[0] + " passe de " + EUR(vd) + " à " + EUR(va) + ". Compare par un quotient : par quel nombre a-t-il été multiplié ?", cm, "Coefficient multiplicateur : " + M("\\frac{" + eu(va) + "}{" + eu(vd) + "} = " + nf(cm)) + ".",
{ ctx: "quotient", guide: [GS("Quotient " + M("\\frac{\\text{arrivée}}{\\text{départ}}") + " = ?", cm, M(nf(cm)) + (cm > 1 ? " : plus grand que 1, c'est une hausse." : " : plus petit que 1, c'est une baisse."))], traps: [TR(r9(vd / va), "On divise la valeur d'arrivée par celle de départ."), TR(r9(va - vd), "Ça, c'est la différence ; on demande le quotient.")] }); },
() => { const v = pk(VILLES), vd = pk([12000, 25000, 40000, 48000, 64000, 75000, 150000]), t = pk([-8, -5, -4, 2, 4, 5, 6, 12, 15]), va = r9(vd * (1 + t / 100));
return QN("La population d'une commune proche de " + v + " passe de "  + "" + M(nf(vd)) + " à " + M(nf(va)) + " habitants en dix ans. Quel est le taux d'évolution, en % ? (négatif pour une baisse)", t, M("\\frac{" + nf(va) + " - " + nf(vd) + "}{" + nf(vd) + "} = \\frac{" + nf(r9(va - vd)) + "}{" + nf(vd) + "} = " + nf(t / 100)) + ", soit " + M(nf(t) + "\\,\\%") + ".",
{ ctx: "taux-deux-valeurs", guide: [GS("Variation absolue ?", r9(va - vd), M(nf(r9(va - vd)))+ " habitants."), GS("Taux en % : " + M("\\frac{" + nf(r9(va - vd)) + "}{" + nf(vd) + "} \\times 100") + " = ?", t, M(nf(t) + "\\,\\%") + ".")], traps: [TR(r9(va - vd), "Ça, c'est la variation absolue ; le taux la divise par la valeur de départ."), TR(r9(((va - vd) / va) * 100), "On divise par la valeur de DÉPART " + nt(vd) + ".")] }); },
],
2: [
() => { const t1 = pk([10, 20, 25, 30, 50]), t2 = pk([-10, -20, -40, -50, 10, 20]), g = r9(((1 + t1 / 100) * (1 + t2 / 100) - 1) * 100), S = pk(["Le prix d'un vélo électrique", "Le nombre d'abonnés d'une médiathèque de Caen", "Le prix d'un billet de TER", "Le chiffre d'affaires d'une crêperie de Quimper"]);
if (g === 0) return null;
return QN(S + " " + (t1 > 0 ? "augmente" : "baisse") + " de " + PC(t1) + ", puis " + (t2 > 0 ? "augmente" : "baisse") + " de " + PC(Math.abs(t2)) + ". Quel est le taux d'évolution global, en % ? (négatif pour une baisse)", g, "On multiplie les coefficients : " + M(nf(1 + t1 / 100) + " \\times " + nf(r9(1 + t2 / 100)) + " = " + nf(r9(1 + g / 100))) + ", soit " + M(nf(g) + "\\,\\%") + ".",
{ ctx: "successives", guide: [GS("Coefficient de la 1re évolution ?", r9(1 + t1 / 100), M(nf(r9(1 + t1 / 100))) + "."), GS("Coefficient de la 2e ?", r9(1 + t2 / 100), M(nf(r9(1 + t2 / 100))) + "."), GS("Coefficient global (produit) ?", r9(1 + g / 100), M(nf(r9(1 + g / 100))) + "."), GS("Taux global en % ?", g, M(nf(g) + "\\,\\%") + ".")], traps: [TR(t1 + t2, "Les pourcentages successifs ne s'additionnent pas : on multiplie les coefficients."), TR(r9((1 + t1 / 100) * (1 + t2 / 100) * 100), "Le coefficient global " + nt(r9(1 + g / 100)) + " correspond à une évolution de " + nt(g) + " %.")] }); },
() => { const p1 = pk([40, 45, 50, 60, 70, 80]), p2 = pk([15, 20, 25, 30, 35, 40]), v = r9((p1 * p2) / 100), S = pk([["des élèves d'un lycée de Rennes sont des filles", "d'entre elles font partie de l'association sportive", "des élèves sont des filles inscrites à l'association sportive"], ["des clients d'un supermarché de Nancy paient par carte", "d'entre eux paient sans contact", "des clients paient par carte sans contact"], ["des habitants d'un village du Jura ont un vélo", "d'entre eux ont un vélo électrique", "des habitants ont un vélo électrique"]]);
return QN(M(p1 + "\\,\\%") + " " + S[0] + " et " + M(p2 + "\\,\\%") + " " + S[1] + ". Quel pourcentage " + S[2] + " ?", v, "Proportion d'une proportion : " + M("\\frac{" + p1 + "}{100} \\times \\frac{" + p2 + "}{100} = " + nf(v / 100)) + ", soit " + M(nf(v) + "\\,\\%") + ".",
{ ctx: "pourcentage-de-pourcentage", guide: [GS("En décimal : " + M(nf(p1 / 100) + " \\times " + nf(p2 / 100)) + " = ?", r9(v / 100), M(nf(r9(v / 100)))+ "."), GS("En pour cent ?", v, M(nf(v) + "\\,\\%") + ".")], traps: [TR(p2, "Les " + p2 + " % sont pris « parmi » un groupe, pas parmi tout le monde."), TR(p1 + p2, "Un pourcentage de pourcentage se multiplie.")] }); },
() => { const t = pk([20, 25, -20, -25, 5, -10, 50, -40]), cm = r9(1 + t / 100), vd = pk([80, 120, 160, 240, 360, 400, 640]), va = r9(vd * cm), S = pk(["une trottinette", "un forfait de ski à Chamonix", "une console de jeux", "une nuit d'hôtel à Annecy"]);
if (Math.abs(va * 100 - Math.round(va * 100)) > 1e-6) return null;
return QN("Après " + (t > 0 ? "une hausse" : "une baisse") + " de " + PC(Math.abs(t)) + ", le prix d'" + S + " est de " + EUR(va) + ". Quel était le prix avant " + (t > 0 ? "la hausse" : "la baisse") + " (en €) ?", vd, "Prix initial × " + M(nf(cm)) + " = " + M(eu(va)) + ", donc prix initial " + M("= \\frac{" + eu(va) + "}{" + nf(cm) + "} = " + eu(vd)) + " €.",
{ ctx: "valeur-initiale", guide: [GS("Coefficient multiplicateur ?", cm, M(nf(cm)) + "."), GS("On divise : " + M("\\frac{" + eu(va) + "}{" + nf(cm) + "}") + " = ?", vd, M(eu(vd)) + " €.")], traps: [TR(r9(va * (1 - t / 100)), "On ne retire pas " + Math.abs(t) + " % du nouveau prix : le pourcentage porte sur l'ancien. On divise par le coefficient."), TR(r9(va * cm), "On divise par le coefficient (on remonte l'évolution).")] }); },
],
3: [
() => { const [t, r] = pk([[25, -20], [100, -50], [-20, 25], [-50, 100], [60, -37.5], [150, -60], [-75, 300], [300, -75], [-60, 150], [-37.5, 60]]);
return QN("Le prix d'une action a " + (t > 0 ? "augmenté" : "baissé") + " de " + PC(Math.abs(t)) + ". Quel taux d'évolution le ramènerait à sa valeur de départ ? (taux réciproque, en %, négatif pour une baisse)", r, "Coefficient " + M(nf(r9(1 + t / 100))) + " ; coefficient réciproque " + M("\\frac{1}{" + nf(r9(1 + t / 100)) + "} = " + nf(r9(1 + r / 100))) + " : taux " + M(nf(r) + "\\,\\%") + ".",
{ ctx: "reciproque", guide: [GS("Coefficient de l'évolution ?", r9(1 + t / 100), M(nf(r9(1 + t / 100))) + "."), GS("Coefficient réciproque (l'inverse) ?", r9(1 + r / 100), M(nf(r9(1 + r / 100))) + "."), GS("Taux réciproque en % ?", r, M(nf(r) + "\\,\\%") + ".")], traps: [TR(-t, "Une baisse de " + Math.abs(t) + " % ne compense pas une hausse de " + Math.abs(t) + " % : le pourcentage ne porte pas sur la même valeur.")] }); },
() => { const t = pk([2, 3, 4, 5, -2, -3, -5]), n = R.int(3, 6), g = (Math.pow(1 + t / 100, n) - 1) * 100;
return QN("Le nombre d'élèves d'un collège de Toulouse " + (t > 0 ? "augmente" : "baisse") + " de " + PC(Math.abs(t)) + " par an pendant " + n + " ans. Quel est le taux d'évolution global, en % (arrondi au dixième, négatif pour une baisse) ?", g, "Coefficient global " + M(nf(r9(1 + t / 100)) + "^{" + n + "} \\approx " + nf(+(1 + g / 100).toFixed(4))) + ", soit environ " + M(nf(+g.toFixed(1)) + "\\,\\%") + ".",
{ ctx: "repetees", round: 0.1, guide: [GS("Coefficient annuel ?", r9(1 + t / 100), M(nf(r9(1 + t / 100))) + "."), GS("Coefficient global " + M(nf(r9(1 + t / 100)) + "^{" + n + "}") + " (au dix-millième) ?", +(1 + g / 100).toFixed(4), M("\\approx " + nf(+(1 + g / 100).toFixed(4))) + ".", 0.0001), GS("Taux global en % (au dixième) ?", g, M("\\approx " + nf(+g.toFixed(1)) + "\\,\\%") + ".", 0.1)],
traps: [TR(n * t, "On n'additionne pas " + n + " fois " + t + " % : on multiplie " + n + " fois par " + nt(r9(1 + t / 100)) + "."), TR(+((Math.pow(1 + t / 100, n - 1) - 1) * 100).toFixed(1), "Il y a " + n + " évolutions, donc la puissance " + n + ".")] }); },
() => { const t1 = pk([25, 20, -20, 60, 50]), cm2 = pk([0.72, 0.8, 0.9, 1.2, 1.25, 0.75]), g = r9(((1 + t1 / 100) * cm2 - 1) * 100), t2 = r9((cm2 - 1) * 100);
if (Math.abs(g * 10 - Math.round(g * 10)) > 1e-6 || g === 0 || t2 === -t1) return null;
return QN("Le prix d'un panier de fruits au marché de Nice " + (t1 > 0 ? "augmente" : "baisse") + " de " + PC(Math.abs(t1)) + " en juin, puis évolue encore en juillet. Sur les deux mois, l'évolution globale est de " + PC(g) + ". Quel est le taux d'évolution de juillet, en % ? (négatif pour une baisse)", t2, "Coefficient global " + M(nf(r9(1 + g / 100))) + " ; coefficient de juillet " + M("\\frac{" + nf(r9(1 + g / 100)) + "}{" + nf(r9(1 + t1 / 100)) + "} = " + nf(cm2)) + ", soit " + M(nf(t2) + "\\,\\%") + ".",
{ ctx: "taux-inconnu", guide: [GS("Coefficient global ?", r9(1 + g / 100), M(nf(r9(1 + g / 100))) + "."), GS("Coefficient de juillet " + M("\\frac{" + nf(r9(1 + g / 100)) + "}{" + nf(r9(1 + t1 / 100)) + "}") + " = ?", cm2, M(nf(cm2)) + "."), GS("Taux de juillet en % ?", t2, M(nf(t2) + "\\,\\%") + ".")], traps: [TR(r9(g - t1), "On ne soustrait pas les pourcentages : on divise les coefficients.")] }); },
],
};


const PN = (x, y, n) => M(n + "(" + nf(x) + " \\,;\\, " + nf(y) + ")");
const VC = (n, u) => M("\\vec{" + n + "}\\begin{pmatrix} " + nf(u[0]) + " \\\\ " + nf(u[1]) + " \\end{pmatrix}");
const VB = (n) => "\\overrightarrow{" + n + "}";
const PAIRQ = " Réponds « x ; y ».";
const VECT = {
1: [
() => { let u1, u2, x0, y0; do { u1 = nz(-5, 5); u2 = nz(-4, 4); x0 = R.int(0, 8); y0 = R.int(0, 6); } while (x0 + u1 < 0 || x0 + u1 > 8 || y0 + u2 < 0 || y0 + u2 > 6 || Math.abs(u1) === Math.abs(u2));
return QP("Lis les coordonnées du vecteur " + M("\\vec{u}") + " dessiné sur le quadrillage (une case = une unité)." + PAIRQ, [u1, u2], "De l'origine à l'extrémité de la flèche : " + M(nf(u1)) + " horizontalement, " + M(nf(u2)) + " verticalement : " + M("\\vec{u}\\begin{pmatrix} " + u1 + " \\\\ " + u2 + " \\end{pmatrix}") + ".",
{ ctx: "lire", fig: vecGrid([[x0, y0, u1, u2, "u"]], [], [0, 8], [0, 6]), guide: [GS("Déplacement horizontal (vers la droite : positif) ?", u1, M(nf(u1)) + "."), GS("Déplacement vertical (vers le haut : positif) ?", u2, M(nf(u2)) + ".")], traps: [TP([u2, u1], "D'abord l'abscisse (horizontal), puis l'ordonnée (vertical)."), TP([-u1, -u2], "On part de l'origine de la flèche vers sa pointe."), TP([x0 + u1, y0 + u2], "Ce sont les coordonnées de la pointe ; un vecteur, c'est un déplacement.")] }); },
() => { const A = [R.int(-6, 6), R.int(-6, 6)], B = [R.int(-6, 6), R.int(-6, 6)], u = [B[0] - A[0], B[1] - A[1]]; if (!u[0] || !u[1]) return null;
return QP("On donne " + PN(A[0], A[1], "A") + " et " + PN(B[0], B[1], "B") + ". Calcule les coordonnées du vecteur " + M(VB("AB")) + "." + PAIRQ, u, M(VB("AB") + "\\begin{pmatrix} x_B - x_A \\\\ y_B - y_A \\end{pmatrix} = \\begin{pmatrix} " + nf(B[0]) + " - " + par(A[0]) + " \\\\ " + nf(B[1]) + " - " + par(A[1]) + " \\end{pmatrix} = \\begin{pmatrix} " + u[0] + " \\\\ " + u[1] + " \\end{pmatrix}") + ".",
{ ctx: "ab", guide: [GS(M("x_B - x_A") + " = ?", u[0], M(nf(B[0]) + " - " + par(A[0]) + " = " + u[0]) + "."), GS(M("y_B - y_A") + " = ?", u[1], M(u[1]) + ".")], traps: [TP([-u[0], -u[1]], "C'est " + "BA" + " : pour AB, on fait « arrivée − départ », B − A."), TP([A[0] + B[0], A[1] + B[1]], "On soustrait les coordonnées (B − A), on ne les additionne pas.")] }); },
() => { const u = [nz(-6, 6), nz(-6, 6)], v = [nz(-6, 6), nz(-6, 6)], w = [u[0] + v[0], u[1] + v[1]]; if (!w[0] || !w[1]) return null; const [P, Q, S] = pk([["A", "B", "C"], ["E", "F", "G"], ["R", "S", "T"]]);
return QP("On sait que " + M(VB(P + Q) + "\\begin{pmatrix} " + u[0] + " \\\\ " + u[1] + " \\end{pmatrix}") + " et " + M(VB(Q + S) + "\\begin{pmatrix} " + v[0] + " \\\\ " + v[1] + " \\end{pmatrix}") + ". Calcule les coordonnées de " + M(VB(P + S)) + "." + PAIRQ, w, "Relation de Chasles : " + M(VB(P + S) + " = " + VB(P + Q) + " + " + VB(Q + S)) + ", donc " + M("\\begin{pmatrix} " + u[0] + " + " + par(v[0]) + " \\\\ " + u[1] + " + " + par(v[1]) + " \\end{pmatrix} = \\begin{pmatrix} " + w[0] + " \\\\ " + w[1] + " \\end{pmatrix}") + ".",
{ ctx: "chasles", guide: [GS("Chasles : " + M(VB(P + S) + " = " + VB(P + Q) + " + " + VB(Q + S)) + ". Abscisse ?", w[0], M(u[0] + " + " + par(v[0]) + " = " + w[0]) + "."), GS("Ordonnée ?", w[1], M(w[1]) + ".")], traps: [TP([u[0] - v[0], u[1] - v[1]], "Chasles : on additionne " + P + Q + " et " + Q + S + "."), TP([v[0] - u[0], v[1] - u[1]], "On additionne les deux vecteurs (pas de soustraction).")] }); },
],
2: [
() => { const u = [nz(-5, 5), nz(-5, 5)], v = [nz(-5, 5), nz(-5, 5)], k = pk([2, 3, -2, -3]), m = pk([1, -1, 2, -2, 3]), w = [k * u[0] + m * v[0], k * u[1] + m * v[1]];
const cm = (c) => (c === 1 ? " + " : c === -1 ? " - " : c < 0 ? " - " + -c : " + " + c);
return QP("On donne " + VC("u", u) + " et " + VC("v", v) + ". Calcule les coordonnées de " + M(k + "\\vec{u}" + cm(m) + "\\vec{v}") + "." + PAIRQ, w, "Coordonnée par coordonnée : " + M(k + " \\times " + par(u[0]) + cm(m) + (Math.abs(m) === 1 ? "" : "\\times ") + par(v[0]) + " = " + w[0]) + " et " + M(k + " \\times " + par(u[1]) + cm(m) + (Math.abs(m) === 1 ? "" : "\\times ") + par(v[1]) + " = " + w[1]) + ".",
{ ctx: "combinaison", guide: [GP("Coordonnées de " + M(k + "\\vec{u}") + " ?", [k * u[0], k * u[1]], M("(" + k * u[0] + " \\,;\\, " + k * u[1] + ")") + "."), GP("Coordonnées de " + M(k + "\\vec{u}" + cm(m) + "\\vec{v}") + " ?", w, M("(" + w[0] + " \\,;\\, " + w[1] + ")") + ".")], traps: [TP([k * u[0] + m * v[0], u[1] + m * v[1]], "Le nombre " + k + " multiplie les deux coordonnées de u."), TP([k * u[0] - m * v[0], k * u[1] - m * v[1]], "Attention au signe devant v.")] }); },
() => { const A = [R.int(-5, 3), R.int(-5, 3)], B = [A[0] + R.int(2, 6), A[1] + nz(-3, 3)], C = [B[0] + nz(-3, 3), B[1] + R.int(2, 5)], D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]];
return QP("On donne " + PN(A[0], A[1], "A") + ", " + PN(B[0], B[1], "B") + " et " + PN(C[0], C[1], "C") + ". Calcule les coordonnées du point " + M("D") + " tel que " + M("ABCD") + " soit un parallélogramme." + PAIRQ, D, M("ABCD") + " est un parallélogramme si " + M(VB("AD") + " = " + VB("BC")) + ". " + M(VB("BC") + "\\begin{pmatrix} " + (C[0] - B[0]) + " \\\\ " + (C[1] - B[1]) + " \\end{pmatrix}") + ", donc " + M("D(" + nf(A[0]) + " + " + par(C[0] - B[0]) + " \\,;\\, " + nf(A[1]) + " + " + par(C[1] - B[1]) + ") = (" + D[0] + " \\,;\\, " + D[1] + ")") + ".",
{ ctx: "parallelogramme",
guide: [GP("Coordonnées de " + M(VB("BC")) + " ?", [C[0] - B[0], C[1] - B[1]], M("(" + (C[0] - B[0]) + " \\,;\\, " + (C[1] - B[1]) + ")") + "."), GP("On reporte depuis A : " + M("D = A + " + VB("BC")) + " ?", D, M("D(" + D[0] + " \\,;\\, " + D[1] + ")") + ".")],
traps: [TP([B[0] + C[0] - A[0], B[1] + C[1] - A[1]], "L'ordre des sommets compte : ABCD, donc AD = BC (D est l'image de A)."), TP([(A[0] + C[0]) / 2, (A[1] + C[1]) / 2], "Ça, c'est le centre du parallélogramme (milieu de [AC]).")] }); },
() => { const A = [R.int(-5, 5), R.int(-5, 5)], u = [nz(-4, 4), nz(-4, 4)], k = pk([2, 3, -1, -2]), Mx = [A[0] + k * u[0], A[1] + k * u[1]], B = [A[0] + u[0], A[1] + u[1]];
return QP("On donne " + PN(A[0], A[1], "A") + " et " + PN(B[0], B[1], "B") + ". Calcule les coordonnées du point " + M("M") + " tel que " + M(VB("AM") + " = " + (k === -1 ? "-" : k) + VB("AB")) + "." + PAIRQ, Mx, M(VB("AB") + "\\begin{pmatrix} " + u[0] + " \\\\ " + u[1] + " \\end{pmatrix}") + ", " + M(VB("AM") + "\\begin{pmatrix} " + k * u[0] + " \\\\ " + k * u[1] + " \\end{pmatrix}") + ", donc " + M("M(" + nf(A[0]) + " + " + par(k * u[0]) + " \\,;\\, " + nf(A[1]) + " + " + par(k * u[1]) + ") = (" + Mx[0] + " \\,;\\, " + Mx[1] + ")") + ".",
{ ctx: "point-image", guide: [GP("Coordonnées de " + M(VB("AB")) + " ?", u, M("(" + u[0] + " \\,;\\, " + u[1] + ")") + "."), GP("Coordonnées de " + M(VB("AM")) + " ?", [k * u[0], k * u[1]], M("(" + k * u[0] + " \\,;\\, " + k * u[1] + ")") + "."), GP(M("M = A + " + VB("AM")) + " ?", Mx, M("M(" + Mx[0] + " \\,;\\, " + Mx[1] + ")") + ".")],
traps: [TP([k * u[0], k * u[1]], "Ce sont les coordonnées du vecteur AM ; le point M s'obtient en partant de A."), TP([B[0] + k * u[0], B[1] + k * u[1]], "Le vecteur AM part de A, pas de B.")] }); },

() => { const [a, b, c] = pk([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [4, 3, 5], [12, 5, 13], [9, 12, 15], [8, 15, 17]]), u = [a * pk([1, -1]), b * pk([1, -1])];
return QN("Dans un repère orthonormé, on donne " + VC("u", u) + ". Calcule la norme " + M("\\lVert \\vec{u} \\rVert") + ".", c, M("\\lVert \\vec{u} \\rVert = \\sqrt{" + par(u[0]) + "^2 + " + par(u[1]) + "^2} = \\sqrt{" + c * c + "} = " + c) + ".",
{ ctx: "norme", guide: [GS("Somme des carrés des coordonnées ?", c * c, M(a * a + " + " + b * b + " = " + c * c) + "."), GS("Norme (racine carrée) ?", c, M("\\sqrt{" + c * c + "} = " + c) + ".")],
traps: [TR(Math.abs(u[0]) + Math.abs(u[1]), "La norme n'est pas la somme des coordonnées : c'est la racine de la somme des carrés."), TR(c * c, "Il reste à prendre la racine carrée."), TR(u[0] + u[1], "Les carrés font disparaître les signes : la norme est la racine de la somme des carrés.")] }); },
],
3: [
() => { const u = [nz(-6, 6), nz(-6, 6)], v = [nz(-6, 6), nz(-6, 6)], d = u[0] * v[1] - u[1] * v[0]; if (d === 0 || Math.abs(d) === 1) return null;
return QN("On donne " + VC("u", u) + " et " + VC("v", v) + ". Calcule le déterminant " + M("\\det(\\vec{u}, \\vec{v})") + ". Les vecteurs sont-ils colinéaires ?", d, M("\\det(\\vec{u}, \\vec{v}) = x_u y_v - y_u x_v = " + par(u[0]) + " \\times " + par(v[1]) + " - " + par(u[1]) + " \\times " + par(v[0]) + " = " + d) + " : non nul, donc les vecteurs ne sont pas colinéaires.",
{ ctx: "determinant", guide: [GS(M("x_u \\times y_v") + " = ?", u[0] * v[1], M(u[0] * v[1]) + "."), GS(M("y_u \\times x_v") + " = ?", u[1] * v[0], M(u[1] * v[0]) + "."), GS("Déterminant (différence) ?", d, M(d) + ".")], traps: [TR(u[0] * v[0] + u[1] * v[1], "Le déterminant croise : x_u × y_v − y_u × x_v."), TR(u[0] * v[1] + u[1] * v[0], "C'est une différence des produits croisés."), TR(-d, "L'ordre compte : x_u × y_v − y_u × x_v.")] }); },
() => { const a = nz(-5, 5), b = nz(-6, 6), c = pk([2, 3, -2, -3, 4]), m = (a * b) / c; if (!Number.isInteger(m) || m === 0 || Math.abs(m) === 1 || m === a) return null;
return QN("Pour quelle valeur de " + M("m") + " les vecteurs " + M("\\vec{u}\\begin{pmatrix} m \\\\ " + a + " \\end{pmatrix}") + " et " + M("\\vec{v}\\begin{pmatrix} " + b + " \\\\ " + c + " \\end{pmatrix}") + " sont-ils colinéaires ?", m, "Colinéaires si le déterminant est nul : " + M("m \\times " + par(c) + " - " + par(a) + " \\times " + par(b) + " = 0") + ", donc " + M(c + "m = " + a * b) + " et " + M("m = " + m) + ".",
{ ctx: "parametre", guide: [GS("Déterminant : " + M("m \\times " + par(c) + " - " + par(a) + " \\times " + par(b)) + ". Calcule " + M(par(a) + " \\times " + par(b)) + ".", a * b, M(a * b) + " : on résout " + M(c + "m - " + par(a * b) + " = 0") + "."), GS(M("m") + " = ?", m, M(m) + ".")], traps: [TR((a * c) / b, "Le déterminant croise : m × " + c + " − " + a + " × " + b + " = 0."), TR(-m, "Vérifie le signe : " + c + "m = " + a * b + ".")] }); },
() => { const A = [R.int(-4, 2), R.int(-4, 4)], s = [pk([1, 2, 3]), nz(-3, 3)], k = pk([2, 3, -1, -2]), xC = A[0] + k * s[0], y = A[1] + k * s[1], B = [A[0] + s[0], A[1] + s[1]];
return QN("On donne " + PN(A[0], A[1], "A") + ", " + PN(B[0], B[1], "B") + " et " + M("C(" + nf(xC) + " \\,;\\, y)") + ". Pour quelle valeur de " + M("y") + " les points " + M("A") + ", " + M("B") + ", " + M("C") + " sont-ils alignés ?", y, M(VB("AB") + "\\begin{pmatrix} " + s[0] + " \\\\ " + s[1] + " \\end{pmatrix}") + " et " + M(VB("AC") + "\\begin{pmatrix} " + (xC - A[0]) + " \\\\ " + (A[1] ? "y - " + par(A[1]) : "y") + " \\end{pmatrix}") + " colinéaires : " + M((s[0] === 1 ? "" : s[0]) + (A[1] ? "(y - " + par(A[1]) + ")" : "y") + " - " + par(s[1]) + " \\times " + par(xC - A[0]) + " = 0") + ", donc " + M("y = " + y) + ".",
{ ctx: "alignement", guide: [GP("Coordonnées de " + M(VB("AB")) + " ?", s, M("(" + s[0] + " \\,;\\, " + s[1] + ")") + "."), GS("Abscisse de " + M(VB("AC")) + " ?", xC - A[0], M(nf(xC) + " - " + par(A[0]) + " = " + (xC - A[0])) + " : c'est " + k + " fois " + s[0] + ", donc " + M(VB("AC") + " = " + k + VB("AB")) + "."), GS(M("y") + " = ?", y, M(nf(A[1]) + " + " + k + " \\times " + par(s[1]) + " = " + y) + ".")],
traps: [TR(k * s[1], "Ça, c'est l'ordonnée du vecteur AC ; celle du point C vaut y_A + " + k * s[1] + "."), TR(A[1] + s[1], "C est plus loin que B : AC = " + k + " AB.")] }); },
],
};


const d1 = (lo, hi) => R.int(lo * 10, hi * 10) / 10;
const FREF = {
1: [
() => { let a, b; do { a = -d1(1, 9); b = -d1(1, 9); } while (Math.abs(a - b) < 0.3 || Number.isInteger(a) || Number.isInteger(b)); const big = Math.min(a, b);
return QN("Sans calculer les carrés : lequel des deux nombres " + M(nf(a)) + " et " + M(nf(b)) + " a le plus grand carré ? Donne ce nombre.", big, "La fonction carré est décroissante sur " + M("]-\\infty \\,;\\, 0]") + " : le plus petit des deux, " + M(nf(big)) + ", a le plus grand carré (" + M(nf(big) + "^2 = " + nf(r9(big * big))) + ").",
{ ctx: "comparer-carres", shownOk: true, guide: [GS("Le plus petit des deux nombres ?", big, M(nf(big)) + "."), GS("Sur les négatifs, le carré est décroissant : le plus grand carré est celui de quel nombre ?", big, M(nf(big)) + " : plus loin de 0, plus grand carré.")], traps: [TR(a === big ? b : a, "Pour des nombres négatifs, le plus grand (le plus proche de 0) a le plus PETIT carré : la fonction carré est décroissante sur ]−∞ ; 0].")] }); },
() => { const r = pk([4, 5, 6, 7, 8, 9, 11, 12, 13]), neg = R.rand() < 0.2, k = r * r;
return QSet("Résous " + M("x^2 = " + (neg ? "-" : "") + nf(k)) + ". (Sépare les solutions par « ; », ou « aucune ».)", neg ? [] : [-r, r], neg ? "Un carré est toujours positif ou nul : aucune solution." : "La parabole " + M("y = x^2") + " coupe la droite " + M("y = " + nf(k)) + " en deux points : " + M("x = -" + r) + " ou " + M("x = " + r) + ".",
{ ctx: neg ? "carre-negatif" : "carre-egal", guide: neg ? [GSet("Un carré peut-il être négatif ? Solutions ?", [], "Non : aucune solution.")] : [GS("Nombre positif dont le carré vaut " + M(nf(k)) + " ?", r, M(r) + "."), GSet("Solutions ?", [-r, r], M("-" + r) + " et " + M(r) + ".")],
traps: neg ? [TSet([r], "Le carré d'un nombre n'est jamais négatif."), TSet([-r, r], "(−" + r + ")² = " + k + ", pas −" + k + ".")] : [TSet([r], "Il y a deux solutions : " + r + " et −" + r + "."), TSet([k / 2], "Le carré n'est pas le double.")] }); },
() => { const neg = R.rand() < 0.5, [a, b] = pk([[0.2, 0.5], [0.4, 2.5], [1.6, 2.5], [0.8, 1.25], [4, 5], [2, 8], [0.25, 4], [1.5, 3]]), A = neg ? -b : a, B = neg ? -a : b, big = neg ? A : A;
return QN("Sans calculer : lequel des deux nombres " + M(nf(A)) + " et " + M(nf(B)) + " a le plus grand inverse ? Donne ce nombre.", big, "La fonction inverse est décroissante sur " + (neg ? M("]-\\infty \\,;\\, 0[") : M("]0 \\,;\\, +\\infty[")) + " : le plus petit nombre, " + M(nf(A)) + ", a le plus grand inverse (" + M("\\frac{1}{" + nf(A) + "} = " + fT(1 / A)) + ").",
{ ctx: neg ? "comparer-inverses-neg" : "comparer-inverses", shownOk: true, guide: [GS("La fonction inverse est décroissante sur cet intervalle. Plus petit des deux nombres ?", A, M(nf(A)) + "."), GS("Nombre qui a le plus grand inverse ?", A, M(nf(A)) + ".")], traps: [TR(B, "La fonction inverse est décroissante : le plus grand nombre a le plus petit inverse.")] }); },
],
2: [
() => { const r = pk([2, 3, 4, 5, 6, 7, 9, 10]), op = pk(["<=", "<"]), k = r * r, ivs = [[-r, op === "<=", r, op === "<="]];
return QS("Résous " + M("x^2 " + OPT[op] + " " + nf(k)) + "." + SETQ, ivs, "La parabole " + M("y = x^2") + " est sous la droite " + M("y = " + nf(k)) + " entre ses points d'intersection " + M("x = -" + r) + " et " + M("x = " + r) + " : " + M("S = " + IV(ivs)) + ".",
{ ctx: "carre-inf", fig: FIG.plot([{ f: (x) => (x * x) / (k / 6) }], [], { xr: [-r * 1.6, r * 1.6].map((v) => Math.round(v)), yr: [-1, 8], hlines: [6], label: "parabole et droite horizontale", ticks: false }), guide: [GSet("Solutions de " + M("x^2 = " + nf(k)) + " ?", [-r, r], M("-" + r) + " et " + M(r) + "."), GSS("Ensemble des solutions de l'inéquation ?", ivs, M(IV(ivs)) + ".")],
traps: [TS([[-Infinity, false, r, op === "<="]], "Les nombres très négatifs ont un grand carré : (−" + (r + 10) + ")² > " + k + ". Il y a une borne de chaque côté."), TS([[-Infinity, false, -r, op === "<="], [r, op === "<=", Infinity, false]], "C'est l'ensemble des x dont le carré est PLUS GRAND.")] }); },
() => { const r = pk([2, 3, 4, 5, 6, 8, 10]), op = pk([">", ">="]), k = r * r, I = op === ">=", ivs = [[-Infinity, false, -r, I], [r, I, Infinity, false]];
return QS("Résous " + M("x^2 " + OPT[op] + " " + nf(k)) + "." + SETQ, ivs, "Le carré dépasse " + M(nf(k)) + " quand " + M("x") + " est loin de 0 : à gauche de " + M("-" + r) + " ou à droite de " + M(r) + ". " + M("S = " + IV(ivs)) + ".",
{ ctx: "carre-sup", guide: [GSet("Solutions de " + M("x^2 = " + nf(k)) + " ?", [-r, r], M("-" + r) + " et " + M(r) + "."), GSS("Ensemble des solutions ?", ivs, M(IV(ivs)) + ".")],
traps: [TS([[r, I, Infinity, false]], "Il manque les nombres négatifs : (−" + (r + 1) + ")² = " + (r + 1) * (r + 1) + " convient aussi."), TS([[-r, I, r, I]], "C'est l'ensemble des x dont le carré est plus PETIT.")] }); },
() => { const k = pk([2, 3, 4, 5, 6, 7, 8, 9]), op = pk(["<=", "<", ">", ">="]), sm = op[0] === "<", I = op.length === 2, ivs = sm ? [[0, true, k * k, I]] : [[k * k, I, Infinity, false]];
return QS("Résous " + M("\\sqrt{x} " + OPT[op] + " " + k) + "." + SETQ, ivs, "La racine carrée n'est définie que pour " + M("x \\ge 0") + " et elle est croissante : " + M("\\sqrt{x} " + OPT[op] + " " + k + " \\iff " + (sm ? "0 \\le x " : "x ") + OPT[op] + " " + k * k) + ". " + M("S = " + IV(ivs)) + ".",
{ ctx: sm ? "racine-inf" : "racine-sup", guide: [GS("Pour quel " + M("x") + " a-t-on " + M("\\sqrt{x} = " + k) + " ?", k * k, M(k + "^2 = " + k * k) + "."), GSS("Ensemble des solutions (n'oublie pas " + M("x \\ge 0") + ") ?", ivs, M(IV(ivs)) + ".")],
traps: sm ? [TS([[-Infinity, false, k * k, I]], "√x n'existe pas pour x < 0 : l'intervalle commence à 0."), TS([[0, true, k, I]], "On élève au carré : √x ≤ " + k + " donne x ≤ " + k * k + ".")] : [TS([[k, I, Infinity, false]], "On élève au carré : x " + (I ? "≥ " : "> ") + k * k + ".")] }); },
],
3: [
() => { const [k, inv] = pk([[2, 0.5], [4, 0.25], [5, 0.2], [10, 0.1], [0.5, 2], [0.25, 4], [0.2, 5]]), op = pk([">", "<"]), ivs = op === ">" ? [[0, false, inv, false]] : [[-Infinity, false, 0, false], [inv, false, Infinity, false]];
return QS("Résous " + M("\\frac{1}{x} " + OPT[op] + " " + nf(k)) + " (avec " + M("x \\ne 0") + ")." + SETQ, ivs, "La courbe de " + M("x \\mapsto \\frac{1}{x}") + " coupe la droite " + M("y = " + nf(k)) + " en " + M("x = " + fT(inv)) + ". " + (op === ">" ? "Elle est au-dessus pour " + M("0 < x < " + fT(inv)) : "Elle est en dessous pour " + M("x < 0") + " (valeurs négatives) et pour " + M("x > " + fT(inv))) + ". " + M("S = " + IV(ivs)) + ".",
{ ctx: op === ">" ? "inverse-sup" : "inverse-inf", fig: FIG.plot([{ f: (x) => (Math.abs(x) > 0.05 ? 1 / x : NaN) }], [], { xr: k >= 4 ? [-2, 2] : [-Math.max(4, Math.ceil(inv) + 1), Math.max(4, Math.ceil(inv) + 1)], yr: k < 1 ? [-2, 2] : [-Math.max(4, k + 2), Math.max(4, k + 2)], hlines: [k], numbers: false, minH: 170, maxH: 280, label: "hyperbole y = 1/x" }),
guide: [GS("Pour quel " + M("x") + " a-t-on " + M("\\frac{1}{x} = " + nf(k)) + " ?" + FA, inv, M("x = \\frac{1}{" + nf(k) + "} = " + fT(inv)) + "."), GSS("Ensemble des solutions (pense aux x négatifs) ?", ivs, M(IV(ivs)) + ".")],
traps: op === ">" ? [TS([[-Infinity, false, inv, false]], "Pour x < 0, 1/x est négatif : il ne peut pas dépasser " + nt(k) + ".")] : [TS([[inv, false, Infinity, false]], "Les x négatifs conviennent aussi : 1/x y est négatif, donc plus petit que " + nt(k) + ".")] }); },
() => { let a, b; do { a = R.int(-6, 5); b = R.int(a + 2, 7); } while (a === 0 || b === 0); const lo = a >= 0 ? a * a : b <= 0 ? b * b : 0, hi = Math.max(a * a, b * b), ivs = [[lo, true, hi, true]];
return QS("On sait que " + M(a + " \\le x \\le " + b) + ". Dans quel intervalle se trouve " + M("x^2") + " ? Donne le plus petit intervalle possible.", ivs, (a < 0 && b > 0 ? "L'intervalle contient 0 : le carré y vaut 0 (minimum). Le plus grand carré est celui de l'extrémité la plus loin de 0, " + M(Math.abs(a) > b ? a : b) + "." : a >= 0 ? "Sur les positifs, le carré est croissant : l'ordre est conservé." : "Sur les négatifs, le carré est décroissant : l'ordre est inversé.") + " " + M("x^2 \\in " + IV(ivs)) + ".",
{ ctx: a < 0 && b > 0 ? "encadrer-0" : "encadrer", guide: [GS("Plus petite valeur de " + M("x^2") + " sur l'intervalle ?", lo, M(nf(lo)) + (a < 0 && b > 0 ? " (en x = 0, qui est dans l'intervalle)." : ".")), GS("Plus grande valeur ?", hi, M(nf(hi)) + "."), GSS("Intervalle de " + M("x^2") + " ?", ivs, M(IV(ivs)) + ".")],
traps: a < 0 ? [TS([[Math.min(a * a, b * b), true, Math.max(a * a, b * b), true]], b > 0 ? "0 est entre " + a + " et " + b + " : x² peut valoir 0." : "Les deux bornes sont négatives : le carré inverse l'ordre.")].filter(() => !(a >= 0)) : [] }); },
() => { const [a, b] = pk([[2, 5], [4, 10], [0.5, 4], [2, 8], [-5, -2], [-4, -0.5], [1, 4], [0.25, 2]]), lo = 1 / b, hi = 1 / a, ivs = [[lo, true, hi, true]];
return QS("On sait que " + M(nf(a) + " \\le x \\le " + nf(b)) + ". Dans quel intervalle se trouve " + M("\\frac{1}{x}") + " ?" + FA, ivs, "La fonction inverse est décroissante sur " + (a > 0 ? M("]0 \\,;\\, +\\infty[") : M("]-\\infty \\,;\\, 0[")) + " : l'ordre s'inverse, " + M(fT(1 / b) + " \\le \\frac{1}{x} \\le " + fT(1 / a)) + ".",
{ ctx: "encadrer-inverse", guide: [GS("Inverse de " + M(nf(a)) + " ?" + FA, 1 / a, M(fT(1 / a)) + "."), GS("Inverse de " + M(nf(b)) + " ?" + FA, 1 / b, M(fT(1 / b)) + "."), GSS("Intervalle (l'ordre s'inverse) ?", ivs, M(IV(ivs)) + ".")],
traps: [TS([[a, true, b, true]], "Il faut prendre les inverses des bornes."), TS([[-hi, true, -lo, true]], "L'inverse de " + nt(a) + " est 1/" + nt(a) + ", pas son opposé.")] }); },
],
};


const INEQ1 = {
1: [
() => { const a = pk([2, 3, 4, 5]), b = nz(-6, 6), op = pk([">", ">=", "<", "<="]), c = R.int(-5, 15), L = pickN([-3, -2, -1, 0, 1, 2, 3, 4, 5, 6], 5).sort((u, v) => u - v), okv = (x) => { const v = a * x + b; return op === ">" ? v > c : op === ">=" ? v >= c : op === "<" ? v < c : v <= c; }, n = L.filter(okv).length;
if (n < 2 || n > 4) return null;
return QN("Parmi les nombres " + L.map((x) => M(x)).join(" ; ") + ", combien sont solutions de l'inéquation " + M(lin(a, b) + " " + OPT[op] + " " + c) + " ?", n, "On teste chaque nombre : " + L.map((x) => M(lin(a, b).replace("x", "\\times " + par(x)).replace(/^(\d)/, "$1") + " = " + (a * x + b)) + (okv(x) ? " ✓" : " ✗")).join(" ; ") + ". Il y en a " + M(n) + ".",
{ ctx: "tester", guide: [GS("Valeur de " + M(lin(a, b)) + " pour " + M("x = " + L[0]) + " ?", a * L[0] + b, M(a * L[0] + b) + (okv(L[0]) ? " : solution." : " : pas solution.")), GS("Nombre de solutions dans la liste ?", n, M(n) + ".")],
traps: [TR(5 - n, "Tu as compté les nombres qui ne sont PAS solutions."), TR(L.filter((x) => { const v = a * x + b; return op.length === 2 ? v > c || v < c ? (op[0] === ">" ? v > c : v < c) : false : (op[0] === ">" ? v >= c : v <= c); }).length, "Attention au cas d'égalité : « " + (op.length === 2 ? "≥ / ≤ » inclut" : "> / < » exclut") + " l'égalité.")] }); },
() => { const a = pk([2, 3, 4, 5, 6, 8]), s = nz(-9, 9), op = pk([">", ">=", "<", "<="]), b = a * s + (R.rand() < 0.3 ? pk([1, 2, -1]) : 0), sol = b / a, ivs = op[0] === ">" ? [[sol, op === ">=", Infinity, false]] : [[-Infinity, false, sol, op === "<="]];
return QS("Résous " + M(a + "x " + OPT[op] + " " + nf(b)) + "." + SETQ, ivs, "On divise par " + M(a) + ", positif : le sens ne change pas. " + M("x " + OPT[op] + " " + fT(sol)) + ", " + M("S = " + IV(ivs)) + ".",
{ ctx: "ax-b", guide: [GS("Borne : " + M("\\frac{" + nf(b) + "}{" + a + "}") + " = ?" + FA, sol, M(fT(sol)) + "."), GSS("Ensemble des solutions ?", ivs, M(IV(ivs)) + ".")],
traps: [TS(op[0] === ">" ? [[-Infinity, false, sol, op === ">="]] : [[sol, op === "<=", Infinity, false]], "On divise par " + a + ", qui est positif : le sens de l'inégalité ne change pas."), TS(op[0] === ">" ? [[b - a, op === ">=", Infinity, false]] : [[-Infinity, false, b - a, op === "<="]], a + "x, c'est " + a + " × x : on divise par " + a + " (on ne soustrait pas).")] }); },
() => { const a = pk([2, 3, 4, 5]), b = nz(-9, 9), c = R.int(-10, 20), big = R.rand() < 0.5, op = big ? pk([">", ">="]) : pk(["<", "<="]), t = (c - b) / a;
if (Number.isInteger(t) && op.length === 1 && R.rand() < 0.5) return null;
const v = big ? (op === ">=" ? Math.ceil(t - 1e-9) : Math.floor(t + 1e-9) + 1) : op === "<=" ? Math.floor(t + 1e-9) : Math.ceil(t - 1e-9) - 1;
return QN("Quel est le " + (big ? "plus petit" : "plus grand") + " nombre entier solution de " + M(lin(a, b) + " " + OPT[op] + " " + c) + " ?", v, M(lin(a, b) + " " + OPT[op] + " " + c + " \\iff " + a + "x " + OPT[op] + " " + (c - b) + " \\iff x " + OPT[op] + " " + fT(t)) + ". " + (big ? "Le plus petit" : "Le plus grand") + " entier qui convient est " + M(v) + ".",
{ ctx: "entier", guide: [GS("Borne : " + M("x " + OPT[op] + " ?") + FA, t, M(fT(t)) + (Number.isInteger(t) ? (op.length === 2 ? " (incluse)." : " (exclue).") : ".")), GS((big ? "Plus petit" : "Plus grand") + " entier ?", v, M(v) + ".")],
traps: [TR(big ? v - 1 : v + 1, Number.isInteger(t) ? "L'inégalité est " + (op.length === 2 ? "large : " + t + " est solution." : "stricte : " + t + " n'est pas solution.") : "Vérifie avec x = " + (big ? v - 1 : v + 1) + " : ça ne marche pas.")] }); },
],
2: [
() => { const a = pk([2, 3, 4, 5]), s = nz(-8, 8), b = nz(-9, 9), c = -a * s + b, op = pk([">", ">=", "<", "<="]), ivs = signSet([[-a, b - c]], [], op);
return QS("Résous " + M(lin(-a, b) + " " + OPT[op] + " " + c) + "." + SETQ, ivs, M("-" + a + "x " + OPT[op] + " " + (c - b)) + ". On divise par " + M("-" + a) + ", négatif : on change le sens. " + M("x " + OPT[{ ">": "<", "<": ">", ">=": "<=", "<=": ">=" }[op]] + " " + s) + ", " + M("S = " + IV(ivs)) + ".",
{ ctx: "coef-negatif", guide: [GS("Après avoir retiré " + M(nf(b)) + " : " + M("-" + a + "x " + OPT[op] + " ?"), c - b, M(c - b) + "."), GS("On divise par " + M("-" + a) + " : borne ?", s, M(s) + " — et le sens de l'inégalité change."), GSS("Ensemble des solutions ?", ivs, M(IV(ivs)) + ".")],
traps: [TS(complement(ivs).map(([lo, li, hi, hi2]) => [lo, isFinite(lo) ? op.length === 2 : li, hi, isFinite(hi) ? op.length === 2 : hi2]), "On divise par un nombre négatif (−" + a + ") : le sens de l'inégalité change.")] }); },
() => { let a, c; do { a = nz(-6, 7); c = nz(-6, 7); } while (a === c); const s = nz(-7, 7), b = nz(-9, 9), d = (a - c) * s + b, op = pk([">", ">=", "<", "<="]), ivs = signSet([[a - c, b - d]], [], op);
return QS("Résous " + M(lin(a, b) + " " + OPT[op] + " " + lin(c, d)) + "." + SETQ, ivs, "On regroupe les " + M("x") + " à gauche : " + M(lin(a - c, 0) + " " + OPT[op] + " " + (d - b)) + (a - c < 0 ? " ; on divise par " + M(a - c) + ", négatif : le sens change" : "") + ". " + M("S = " + IV(ivs)) + ".",
{ ctx: "deux-membres", guide: [GS("Coefficient de " + M("x") + " après regroupement à gauche ?", a - c, M(nf(a) + " - " + par(c) + " = " + (a - c)) + "."), GS("Nombre à droite ?", d - b, M(nf(d) + " - " + par(b) + " = " + (d - b)) + "."), GSS("Ensemble des solutions ?", ivs, M(IV(ivs)) + ".")],
traps: [TS(signSet([[Math.abs(a - c), (a - c > 0 ? 1 : -1) * (b - d)]], [], op), a - c < 0 ? "Le coefficient " + (a - c) + " est négatif : on change le sens en divisant." : "Vérifie le sens."), TS(complement(ivs).map(([lo, li, hi, hi2]) => [lo, isFinite(lo) ? op.length === 2 : li, hi, isFinite(hi) ? op.length === 2 : hi2]), "C'est l'ensemble contraire.")] }); },
() => { const a = nz(-4, 4), right = R.rand() < 0.5, incl = R.rand() < 0.5, ivs = right ? [[a, incl, Infinity, false]] : [[-Infinity, false, a, incl]];
return QS("La droite graduée représente l'ensemble des solutions d'une inéquation (le crochet indique si " + M(a) + " est compris). Écris cet ensemble sous forme d'intervalle.", ivs, "Le trait part de " + M(a) + " vers la " + (right ? "droite" : "gauche") + " ; le crochet est tourné " + (incl ? "vers le trait : " + M(a) + " est compris" : "vers l'extérieur : " + M(a) + " est exclu") + ". " + M(IV(ivs)) + ".",
{ ctx: "droite-graduee", fig: rayFig(a, right, incl), guide: [GS("Le trait va-t-il vers la droite (1) ou vers la gauche (−1) ?", right ? 1 : -1, right ? "Vers la droite : jusqu'à " + M("+\\infty") + "." : "Vers la gauche : depuis " + M("-\\infty") + "."), GSS("Intervalle ?", ivs, M(IV(ivs)) + ".")],
traps: [TS(right ? [[-Infinity, false, a, incl]] : [[a, incl, Infinity, false]], "Regarde de quel côté de " + a + " va le trait.")], shownOk: true }); },
],
3: [
() => { const S = pk([["Un cinéma de Lille", "la séance", "la carte d'abonnement", "séances", "elle"], ["Une piscine de Grenoble", "l'entrée", "la carte annuelle", "entrées", "elle"], ["Un musée de Lyon", "la visite", "le pass", "visites", "il"]]), p = pk([8, 9, 10, 12]), r = pk([4, 5, 6, 7].filter((v) => v < p)), F = R.int(3, 12) * 5, t = F / (p - r), n = Math.floor(t + 1e-9) + 1;
return QN(S[0] + " propose deux tarifs : " + EUR(p) + " " + S[1] + ", ou " + S[2] + " à " + EUR(F) + " puis " + EUR(r) + " " + S[1] + ". À partir de combien " + (/^[aeiouéè]/.test(S[3]) ? "d'" : "de ") + S[3] + " " + S[2] + " est-" + S[4] + " strictement plus avantageu" + (S[4] === "il" ? "x" : "se") + " ?", n, "Avec " + M("n") + " " + S[3] + " : " + M(F + " + " + r + "n < " + p + "n \\iff " + F + " < " + (p - r) + "n \\iff n > " + fT(t)) + ". Le plus petit entier est " + M(n) + ".",
{ ctx: "tarifs", guide: [GS("Inéquation : " + M(F + " + " + r + "n < " + p + "n") + ". Après regroupement, " + M((p - r) + "n > ?"), F, M(F) + "."), GS("Borne " + M("n > ?") + FA, t, M(fT(t)) + "."), GS("Plus petit nombre entier ?", n, M(n) + (Number.isInteger(t) ? " (à " + t + ", les deux tarifs sont égaux : pas strictement plus avantageux)." : "."))],
traps: [TR(Math.floor(t + 1e-9), Number.isInteger(t) ? "Pour " + t + ", les deux tarifs sont égaux : il faut un de plus." : "Pour " + Math.floor(t) + ", la carte coûte encore plus cher : vérifie."), TR(Math.ceil(F / p), "Il faut comparer les deux tarifs, pas seulement le prix de la carte.")] }); },
() => { const n1 = R.int(6, 16), n2 = R.int(5, 16), goal = pk([10, 11, 12, 13, 14]), need = 3 * goal - n1 - n2; if (need <= 8 || need > 20) return null;
return QN("Inès a eu " + M(n1) + " et " + M(n2) + " sur 20 à ses deux premiers devoirs de mathématiques. Quelle note minimale doit-elle avoir au troisième pour que sa moyenne soit au moins de " + M(goal) + " ?", need, "Avec la note " + M("x") + " : " + M("\\frac{" + n1 + " + " + n2 + " + x}{3} \\ge " + goal + " \\iff " + (n1 + n2) + " + x \\ge " + 3 * goal + " \\iff x \\ge " + need) + ".",
{ ctx: "moyenne", guide: [GS("Total de points nécessaire sur les trois devoirs ?", 3 * goal, M("3 \\times " + goal + " = " + 3 * goal) + "."), GS("Note minimale ?", need, M(3 * goal + " - " + (n1 + n2) + " = " + need) + ".")],
traps: [TR(goal, "Avec " + goal + ", la moyenne n'atteint pas " + goal + " : les deux premières notes la tirent vers le bas (ou le haut)."), TR(2 * goal - n1 - n2 + goal - goal, "Il y a trois notes : on multiplie " + goal + " par 3.")] }); },
() => { const pc = pk([4, 5, 6]), km = pk([1.5, 2, 2.5]), B = R.int(20, 60), t = (B - pc) / km, n = Math.floor(t + 1e-9), C = pk(["Toulouse", "Marseille", "Nice", "Lyon"]);
if (Number.isInteger(t) && R.rand() < 0.5) return null;
return QN("À " + C + ", un taxi facture " + EUR(pc) + " de prise en charge puis " + EUR(km) + " par kilomètre. Avec " + EUR(B) + " au plus, quelle distance entière maximale (en km) peut-on parcourir ?", n, M(nf(pc) + " + " + nf(km) + "d \\le " + B + " \\iff d \\le " + fT(t)) + (Number.isInteger(t) ? "" : " \\approx " + nf(+t.toFixed(2))) + " : au plus " + M(n) + " km.",
{ ctx: "budget", guide: [GS("Budget restant après la prise en charge (€) ?", B - pc, M(B + " - " + pc + " = " + (B - pc)) + "."), GS("Nombre entier maximal de km ?", n, M(nf(B - pc) + " \\div " + nf(km) + (Number.isInteger(t) ? " = " : " \\approx ") + nf(+t.toFixed(2))) + " : " + M(n) + ".")],
traps: [TR(n + 1, "Avec " + (n + 1) + " km, on dépasse " + B + " € : on arrondit vers le bas."), TR(Math.floor(B / km), "N'oublie pas la prise en charge de " + pc + " €.")] }); },
],
};


const PROBA2 = {
1: [
() => { const S = pk([["qu'il pleuve demain à Brest", "qu'il ne pleuve pas"], ["que le TER Rouen–Paris soit en retard", "qu'il soit à l'heure"], ["qu'une graine de tournesol germe", "qu'elle ne germe pas"], ["qu'un client d'une boulangerie de Tours prenne un croissant", "qu'il n'en prenne pas"]]), p = pk([0.12, 0.15, 0.27, 0.35, 0.38, 0.42, 0.58, 0.63, 0.7, 0.85]);
return QN("La probabilité " + S[0] + " est " + M(nf(p)) + ". Quelle est la probabilité " + S[1] + " ?", r9(1 - p), "Évènement contraire : " + M("P(\\bar{A}) = 1 - P(A) = 1 - " + nf(p) + " = " + nf(r9(1 - p))) + ".",
{ ctx: "contraire", guide: [GS(M("1 - " + nf(p)) + " = ?", r9(1 - p), M(nf(r9(1 - p))) + ".")], traps: [TR(p, "C'est la probabilité de l'évènement lui-même ; on demande le contraire."), TR(r9(100 - p), "Une probabilité est entre 0 et 1 : on calcule 1 − " + nt(p) + ".")] }); },
() => { const r = R.int(3, 9), b = R.int(2, 8), v = R.int(1, 6), N = r + b + v, c = pk([["rouge", r], ["bleue", b], ["verte", v]]);
return QN("Un sac contient " + M(r) + " billes rouges, " + M(b) + " bleues et " + M(v) + " vertes. On tire une bille au hasard. Quelle est la probabilité qu'elle ne soit pas " + c[0] + " ?" + FA, (N - c[1]) / N, M("P(\\text{" + c[0] + "}) = " + FT(c[1], N)) + ", donc " + M("P(\\text{pas " + c[0] + "}) = 1 - " + FT(c[1], N) + " = " + FT(N - c[1], N)) + ".",
{ ctx: "contraire-sac", guide: [GS("Nombre total de billes ?", N, M(N) + "."), GS("Probabilité de tirer une bille " + c[0] + " ?" + FA, c[1] / N, M(FT(c[1], N)) + "."), GS("Probabilité de l'évènement contraire ?" + FA, (N - c[1]) / N, M(FT(N - c[1], N)) + ".")], traps: [TR(c[1] / N, "C'est la probabilité de tirer une bille " + c[0] + " ; on veut l'évènement contraire."), TR((N - c[1]) / c[1], "On divise par le nombre total de billes, " + N + ".")] }); },
() => { const ps = pk([[0.15, 0.4, 0.25], [0.1, 0.35, 0.3], [0.05, 0.45, 0.2], [0.22, 0.18, 0.4], [0.3, 0.12, 0.33]]), miss = r9(1 - ps[0] - ps[1] - ps[2]), k = R.int(0, 3), L = ps.slice(); L.splice(k, 0, null);
return QN("Une roue de loterie a quatre secteurs, notés 1 à 4. On connaît les probabilités : " + L.map((p, i) => M("P(" + (i + 1) + ") = " + (p === null ? "?" : nf(p)))).join(" ; ") + ". Calcule la probabilité manquante.", miss, "La somme des probabilités de toutes les issues vaut 1 : " + M("1 - " + ps.map(nf).join(" - ") + " = " + nf(miss)) + ".",
{ ctx: "loi", guide: [GS("Somme des trois probabilités connues ?", r9(1 - miss), M(nf(r9(1 - miss)))+ "."), GS("Probabilité manquante ?", miss, M("1 - " + nf(r9(1 - miss)) + " = " + nf(miss)) + ".")], traps: [TR(r9(1 - miss), "Ça, c'est la somme des probabilités connues ; il manque ce qu'il faut pour arriver à 1.")] }); },
],
2: [
() => { const E = pk([[["un dé équilibré à 6 faces", 6], [["obtenir un 6", 1], ["obtenir un nombre pair", 3], ["obtenir un multiple de 3", 2]]], [["une roue à 8 secteurs égaux numérotés de 1 à 8", 8], [["obtenir 8", 1], ["obtenir un nombre impair", 4], ["obtenir plus que 5", 3]]], [["une pièce équilibrée", 2], [["obtenir pile", 1]]]]), F = pk([[["un dé équilibré à 6 faces", 6], [["obtenir un 6", 1], ["obtenir un nombre premier", 3], ["obtenir moins que 3", 2]]], [["une pièce équilibrée", 2], [["obtenir face", 1]]], [["un dé équilibré à 4 faces", 4], [["obtenir 4", 1], ["obtenir 1 ou 2", 2]]]]);
if (E[0][0] === F[0][0]) return null;
const a = pk(E[1]), b = pk(F[1]), v = (a[1] * b[1]) / (E[0][1] * F[0][1]);
return QN("On lance " + E[0][0] + ", puis " + F[0][0] + ". Quelle est la probabilité d'" + a[0] + " avec le premier, puis d'" + b[0] + " avec le second ?" + FA, v, "Les deux épreuves sont indépendantes : on multiplie le long de la branche, " + M(FT(a[1], E[0][1]) + " \\times " + FT(b[1], F[0][1]) + " = " + FT(a[1] * b[1], E[0][1] * F[0][1])) + ".",
{ ctx: "independantes", guide: [GS("Probabilité de " + a[0] + " ?" + FA, a[1] / E[0][1], M(FT(a[1], E[0][1])) + "."), GS("Probabilité de " + b[0] + " avec " + F[0][0] + " ?" + FA, b[1] / F[0][1], M(FT(b[1], F[0][1])) + "."), GS("Produit ?" + FA, v, M(FT(a[1] * b[1], E[0][1] * F[0][1])) + ".")], traps: [TR(a[1] / E[0][1] + b[1] / F[0][1], "Pour « … puis … », on multiplie (on n'additionne pas).")] }); },
() => { const r = R.int(3, 7), b = R.int(2, 6), N = r + b, v = (r * (r - 1)) / (N * (N - 1)), C = pk(["rouges", "noires", "jaunes"]);
return QN("Une urne contient " + M(r) + " boules " + C + " et " + M(b) + " blanches. On tire deux boules successivement, sans remise. Quelle est la probabilité d'obtenir deux boules " + C + " ?" + FA, v, M(FT(r, N) + " \\times " + FT(r - 1, N - 1) + " = " + FT(r * (r - 1), N * (N - 1))) + " : au second tirage, il reste " + M(N - 1) + " boules dont " + M(r - 1) + " " + C + ".",
{ ctx: "sans-remise", guide: [GS("Probabilité au 1er tirage ?" + FA, r / N, M(FT(r, N)) + "."), GS("Au 2e tirage (une boule " + C.replace(/s$/, "") + " en moins) ?" + FA, (r - 1) / (N - 1), M(FT(r - 1, N - 1)) + "."), GS("Produit ?" + FA, v, M(FT(r * (r - 1), N * (N - 1))) + ".")], traps: [TR((r * r) / (N * N), "Sans remise, il reste " + (N - 1) + " boules au second tirage, dont " + (r - 1) + " " + C + "."), TR(r / N + (r - 1) / (N - 1), "Le long d'une branche, on multiplie.")] }); },
() => { const r = R.int(2, 7), b = R.int(2, 7), N = r + b, v = (2 * r * b) / (N * N);
if (r === b) return null;
return QN("Une urne contient " + M(r) + " jetons verts et " + M(b) + " jetons orange. On tire un jeton, on le remet, puis on en tire un second. Quelle est la probabilité d'obtenir deux jetons de couleurs différentes ?" + FA, v, "Deux chemins : vert puis orange, et orange puis vert. " + M(FT(r, N) + " \\times " + FT(b, N) + " + " + FT(b, N) + " \\times " + FT(r, N) + " = " + FT(2 * r * b, N * N)) + ".",
{ ctx: "deux-chemins", guide: [GS("Probabilité de « vert puis orange » ?" + FA, (r * b) / (N * N), M(FT(r * b, N * N)) + "."), GS("Combien de chemins donnent deux couleurs différentes ?", 2, "Deux : VO et OV."), GS("Probabilité totale ?" + FA, v, M(FT(2 * r * b, N * N)) + ".")], traps: [TR((r * b) / (N * N), "Il y a deux chemins : vert puis orange ET orange puis vert."), TR((2 * r * b) / (N * (N - 1)), "Avec remise, il y a toujours " + N + " jetons au second tirage.")] }); },
],
3: [
() => { const pa = pk([0.3, 0.35, 0.4, 0.45, 0.5, 0.6]), pb = pk([0.2, 0.25, 0.3, 0.4, 0.5]), pi = pk([0.05, 0.1, 0.15].filter((x) => x < Math.min(pa, pb))), v = r9(pa + pb - pi), S = pk(["Dans un lycée de Poitiers, on choisit un élève au hasard. A : « il pratique un sport en club » ; B : « il joue d'un instrument ».", "On choisit au hasard un abonné d'une médiathèque d'Amiens. A : « il emprunte des romans » ; B : « il emprunte des BD ».", "On choisit au hasard un client d'un camping des Landes. A : « il loue un vélo » ; B : « il loue un kayak »."]);
return QN(S + " On sait que " + M("P(A) = " + nf(pa)) + ", " + M("P(B) = " + nf(pb)) + " et " + M("P(A \\cap B) = " + nf(pi)) + ". Calcule " + M("P(A \\cup B)") + ".", v, M("P(A \\cup B) = P(A) + P(B) - P(A \\cap B) = " + nf(pa) + " + " + nf(pb) + " - " + nf(pi) + " = " + nf(v)) + ".",
{ ctx: "reunion", guide: [GS(M("P(A) + P(B)") + " = ?", r9(pa + pb), M(nf(r9(pa + pb)))+ "."), GS("On retire l'intersection, comptée deux fois : " + M("P(A \\cup B)") + " = ?", v, M(nf(v)) + ".")], traps: [TR(r9(pa + pb), "Les éléments de A ∩ B sont comptés deux fois : on retire P(A ∩ B)."), TR(r9(pa + pb + pi), "On retire P(A ∩ B), on ne l'ajoute pas.")] }); },
() => { const [deck, A, nA, B, nB, nI] = pk([[32, "un cœur", 8, "un roi", 4, 1], [32, "une carte rouge", 16, "un as", 4, 2], [32, "une figure (valet, dame ou roi)", 12, "un pique", 8, 3], [52, "un cœur", 13, "un roi", 4, 1], [52, "une figure (valet, dame ou roi)", 12, "un trèfle", 13, 3]]), v = (nA + nB - nI) / deck;
return QN("On tire une carte au hasard dans un jeu de " + deck + " cartes. Quelle est la probabilité de tirer " + A + " ou " + B + " ?" + FA, v, M("P = \\frac{" + nA + "}{" + deck + "} + \\frac{" + nB + "}{" + deck + "} - \\frac{" + nI + "}{" + deck + "} = " + FT(nA + nB - nI, deck)) + " (" + (nI === 1 ? "la carte qui est les deux à la fois est comptée une seule fois" : "les " + nI + " cartes qui sont les deux à la fois sont comptées une seule fois") + ").",
{ ctx: "cartes", guide: [GS("Nombre de cartes qui sont " + A + " ?", nA, M(nA) + "."), GS("Nombre de cartes qui sont à la fois " + A + " et " + B + " ?", nI, M(nI) + "."), GS("Nombre de cartes favorables (sans compter deux fois) ?", nA + nB - nI, M(nA + " + " + nB + " - " + nI + " = " + (nA + nB - nI)) + "."), GS("Probabilité ?" + FA, v, M(FT(nA + nB - nI, deck)) + ".")],
traps: [TR((nA + nB) / deck, "Les cartes qui sont à la fois " + A + " et " + B + " sont comptées deux fois."), TR(nI / deck, "« ou » : l'une, l'autre ou les deux (c'est la réunion, pas l'intersection).")] }); },
() => { const pa = pk([0.4, 0.45, 0.5, 0.55, 0.6]), pb = pk([0.3, 0.35, 0.45, 0.5]), pi = pk([0.1, 0.15, 0.2, 0.25].filter((x) => x < Math.min(pa, pb))), pu = r9(pa + pb - pi);
return QN("Pour deux évènements " + M("A") + " et " + M("B") + ", on sait que " + M("P(A) = " + nf(pa)) + ", " + M("P(B) = " + nf(pb)) + " et " + M("P(A \\cup B) = " + nf(pu)) + ". Calcule " + M("P(A \\cap B)") + ".", pi, M("P(A \\cap B) = P(A) + P(B) - P(A \\cup B) = " + nf(pa) + " + " + nf(pb) + " - " + nf(pu) + " = " + nf(pi)) + ".",
{ ctx: "intersection", guide: [GS(M("P(A) + P(B)") + " = ?", r9(pa + pb), M(nf(r9(pa + pb)))+ "."), GS(M("P(A \\cap B)") + " = ?", pi, M(nf(r9(pa + pb)) + " - " + nf(pu) + " = " + nf(pi)) + ".")], traps: [TR(r9(pa * pb), "On ne sait pas si A et B sont indépendants : on utilise P(A ∪ B) = P(A) + P(B) − P(A ∩ B)."), TR(r9(pa + pb + pu), "On isole P(A ∩ B) : P(A) + P(B) − P(A ∪ B).")] }); },
],
};


const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const PY = (lines) => '<pre class="py">' + esc(lines.join("\n")) + "</pre>";
const ALGO = {
1: [
() => { const x = R.int(3, 12), k = nz(-6, 9), a1 = x, b = 2 * a1 + k, a2 = b - a1;
return QN("Qu'affiche ce programme Python ?" + PY(["a = " + x, "b = 2 * a + " + k, "a = b - a", "print(a)"]).replace("+ -", "- ").replace(/\+ -(\d)/, "- $1"), a2, "Ligne par ligne : " + M("a = " + x) + " ; " + M("b = 2 \\times " + x + sg(k) + " = " + b) + " ; " + M("a = " + b + " - " + x + " = " + a2) + ". Le programme affiche " + M(a2) + ".",
{ ctx: "affectations", guide: [GS("Valeur de " + M("b") + " après la 2e ligne ?", b, M(b) + "."), GS("Nouvelle valeur de " + M("a") + " (on utilise l'ancienne valeur de " + M("a") + ", " + x + ") ?", a2, M(b + " - " + x + " = " + a2) + ".")], traps: [TR(b, "print(a) affiche a, pas b."), TR(x, "La 3e ligne modifie a : a prend la valeur b − a.")] }); },
() => { const a = pk([2, 3, 4, 5, -2]), b = R.int(1, 9), c = pk([-4, -3, -2, 2, 3, 5]), v = a * c * c - b;
return QN("On a défini la fonction Python ci-dessous. Que renvoie " + M("\\texttt{f(" + c + ")}") + " ?" + PY(["def f(x):", "    return " + a + " * x**2 - " + b]), v, M("f(" + c + ") = " + a + " \\times " + par(c) + "^2 - " + b + " = " + a + " \\times " + c * c + " - " + b + " = " + v) + ". (En Python, ** est la puissance.)",
{ ctx: "fonction", guide: [GS(M(par(c) + "^2") + " (x**2 avec x = " + c + ") ?", c * c, M(c * c) + "."), GS("Valeur renvoyée ?", v, M(a + " \\times " + c * c + " - " + b + " = " + v) + ".")], traps: [TR((a * c) ** 2 - b, "La puissance passe avant la multiplication : " + a + " * x**2 = " + a + " × (x²)."), TR(-a * c * c - b, "(" + c + ")² = " + c * c + " est positif."), TR(a * c * 2 - b, "x**2 est x au carré, pas 2x.")] }); },
() => { const p = pk([12, 15, 18, 24, 35, 40]), q = R.int(2, 5), r = pk([10, 20, 25]), tot = p * q, fin = r9(tot * (1 - r / 100)), S = pk(["livre", "place de concert", "maillot", "jeu de société"]);
return QN("Ce programme calcule le prix d'un achat de " + S + "s (en €) avec une remise. Qu'affiche-t-il ?" + PY(["prix = " + p, "quantite = " + q, "total = prix * quantite", "remise = total * " + String(r / 100), "total = total - remise", "print(total)"]), fin, M("total = " + p + " \\times " + q + " = " + tot) + " ; " + M("remise = " + tot + " \\times " + nf(r / 100) + " = " + nf(r9(tot * r / 100))) + " ; " + M("total = " + tot + " - " + nf(r9(tot * r / 100)) + " = " + nf(fin)) + ".",
{ ctx: "remise", guide: [GS("Valeur de " + M("\\texttt{total}") + " à la 3e ligne ?", tot, M(tot) + "."), GS("Valeur de " + M("\\texttt{remise}") + " ?", r9(tot * r / 100), M(nf(r9(tot * r / 100)))+ "."), GS("Valeur affichée ?", fin, M(nf(fin)) + ".")], traps: [TR(r9(tot * r / 100), "C'est la remise ; le programme affiche le total après remise."), TR(tot, "La 5e ligne retire la remise du total.")] }); },
],
2: [
() => { const t = [pk([4, 5, 6]), pk([7, 8, 9]), pk([10, 11.5, 12])], a1 = pk([10, 12, 14]), a2 = pk([16, 18, 26]), age = pk([a1 - 1, a1, a1 + 2, a2 - 1, a2, a2 + 5]), v = age < a1 ? t[0] : age < a2 ? t[1] : t[2];
return QN("Un musée de Nantes calcule le prix d'entrée avec cette fonction. Que renvoie " + M("\\texttt{tarif(" + age + ")}") + " ?" + PY(["def tarif(age):", "    if age < " + a1 + ":", "        return " + t[0], "    elif age < " + a2 + ":", "        return " + t[1], "    else:", "        return " + String(t[2])]), v, M(age) + (age < a1 ? " < " + a1 + " : première branche." : " n'est pas < " + a1 + (age < a2 ? " mais " + age + " < " + a2 + " : deuxième branche." : " ni < " + a2 + " : branche else.")) + " La fonction renvoie " + M(nf(v)) + ".",
{ ctx: "si-sinon", guide: [GS("Le test " + M("\\texttt{" + age + " < " + a1 + "}") + " est-il vrai (1) ou faux (0) ?", age < a1 ? 1 : 0, age < a1 ? "Vrai." : "Faux" + (age === a1 ? " : " + age + " n'est pas strictement plus petit que " + a1 + "." : ".")), GS("Valeur renvoyée ?", v, M(nf(v)) + ".")],
traps: [TR(age < a1 ? t[1] : age < a2 ? (age === a1 ? t[0] : t[2]) : t[1], "Le test « < » est strict : " + (age === a1 || age === a2 ? age + " < " + age + " est faux." : "relis chaque condition dans l'ordre."))] }); },
() => { const n0 = pk([6, 10, 12, 14, 18, 20, 7, 9, 11, 13]), f = (n) => (n % 2 === 0 ? n / 2 : 3 * n + 1), v = f(f(n0));
return QN("Que renvoie " + M("\\texttt{suivant(suivant(" + n0 + "))}") + " ? (" + M("\\texttt{n \\% 2}") + " est le reste de la division par 2, " + M("\\texttt{//}") + " le quotient entier.)" + PY(["def suivant(n):", "    if n % 2 == 0:", "        return n // 2", "    else:", "        return 3 * n + 1"]), v, M("\\texttt{suivant(" + n0 + ")} = " + f(n0)) + " (" + (n0 % 2 ? "impair : 3n + 1" : "pair : n // 2") + "), puis " + M("\\texttt{suivant(" + f(n0) + ")} = " + v) + " (" + (f(n0) % 2 ? "impair" : "pair") + ").",
{ ctx: "syracuse", guide: [GS(M("\\texttt{suivant(" + n0 + ")}") + " = ?", f(n0), M(n0) + (n0 % 2 ? " est impair : " + M("3 \\times " + n0 + " + 1 = " + f(n0)) : " est pair : " + M(n0 + " \\div 2 = " + f(n0))) + "."), GS("Puis " + M("\\texttt{suivant(" + f(n0) + ")}") + " = ?", v, M(v) + ".")], traps: [TR(f(n0), "La fonction est appelée deux fois : suivant(suivant(" + n0 + "))."), TR(n0 % 2 ? (3 * n0 + 1) * 3 + 1 : n0 / 4, "Relis le test pour chaque valeur : pair ou impair ?")] }); },
() => { const a = nz(-8, 8), b = nz(-8, 8); if (a === b || Math.abs(a - b) < 2) return null; const v = Math.abs(a - b);
return QN("Que renvoie " + M("\\texttt{ecart(" + a + ", " + b + ")}") + " ?" + PY(["def ecart(a, b):", "    if a > b:", "        return a - b", "    else:", "        return b - a"]), v, M(a + " > " + b) + (a > b ? " est vrai : on renvoie " + M(a + " - " + par(b) + " = " + v) : " est faux : on renvoie " + M(b + " - " + par(a) + " = " + v)) + ". (C'est la distance entre les deux nombres.)",
{ ctx: "ecart", guide: [GS("Le test " + M("\\texttt{" + a + " > " + b + "}") + " est-il vrai (1) ou faux (0) ?", a > b ? 1 : 0, a > b ? "Vrai." : "Faux."), GS("Valeur renvoyée ?", v, M(v) + ".")], traps: [TR(a - b === v ? b - a : a - b, "Relis le test : la fonction renvoie toujours un nombre positif."), TR(Math.abs(a + b), "On soustrait : a − b ou b − a.")] }); },
],
3: [
() => { const a = pk([0, 1, 2, 3]), n = R.int(5, 11), k = pk([1, 2, 3]), v = (() => { let s = 0; for (let i = a; i < n; i++) s += k * i; return s; })(), incl = (() => { let s = 0; for (let i = a; i <= n; i++) s += k * i; return s; })();
return QN("Qu'affiche ce programme ? (" + M("\\texttt{range(" + a + ", " + n + ")}") + " parcourt les entiers de " + a + " à " + (n - 1) + ".)" + PY(["s = 0", "for i in range(" + a + ", " + n + "):", "    s = s + " + (k === 1 ? "i" : k + " * i"), "print(s)"]), v, "On ajoute " + (k === 1 ? "" : k + " fois ") + "les entiers de " + M(a) + " à " + M(n - 1) + " (" + M(n) + " est exclu) : " + M((k === 1 ? "" : k + " \\times (") + (n - a > 6 ? [a, a + 1, a + 2, "\\ldots", n - 1].join(" + ") : Array.from({ length: n - a }, (_, j) => a + j).join(" + "))  + (k === 1 ? "" : ")") + " = " + v) + ".",
{ ctx: "boucle-for", guide: [GS("Dernière valeur prise par " + M("\\texttt{i}") + " ?", n - 1, M(n - 1) + " : la borne " + n + " est exclue."), GS("Valeur affichée ?", v, M(v) + ".")], traps: [TR(incl, "range(" + a + ", " + n + ") s'arrête à " + (n - 1) + " : " + n + " n'est pas compris."), TR(n - a, "Ça, c'est le nombre de tours ; s accumule les valeurs.")] }); },
() => { const S = pk([["capital", "Un livret d'épargne de", "€ rapporte", "Au bout de combien d'années le capital dépasse-t-il le seuil ?"], ["population", "Une colonie de bactéries de", "individus grandit de", "Combien d'heures faut-il pour dépasser le seuil ?"]]), u0 = pk([100, 200, 500, 1000]), m = pk([1.5, 2, 1.25]), seuil = u0 * pk([3, 5, 8, 10]); let u = u0, n = 0; while (u < seuil) { u *= m; n++; }
return QN("Qu'affiche ce programme ?" + PY(["u = " + u0, "n = 0", "while u < " + seuil + ":", "    u = u * " + String(m), "    n = n + 1", "print(n)"]), n, "On multiplie " + M("u") + " par " + M(nf(m)) + " tant que " + M("u < " + nf(seuil)) + " : " + (() => { let w = u0, L = [nf(w)]; for (let i = 0; i < n; i++) { w = r9(w * m); L.push(nf(Math.round(w * 100) / 100)); } return M(L.join(" \\to ")) + (m === 1.25 ? " (valeurs arrondies au centième)" : ""); })()  + ". La boucle tourne " + M(n) + " fois.",
{ ctx: "boucle-while", guide: [GS("Valeur de " + M("u") + " après un tour ?", r9(u0 * m), M(nf(r9(u0 * m)))+ "."), GS("Nombre de tours (valeur de n à la fin) ?", n, M(n) + " : après " + n + " tours, " + M("u = " + nf(r9(u))) + " n'est plus inférieur à " + M(nf(seuil)) + ".")], traps: [TR(n - 1, "La boucle s'arrête seulement quand u ≥ " + seuil + " : compte aussi le dernier tour."), TR(n + 1, "Quand u atteint ou dépasse " + seuil + ", on sort de la boucle sans incrémenter n.")] }); },
() => { const a = pk([2, 3, -1]), b = nz(-3, 4), u0 = R.int(1, 4), n = R.int(3, 4); let u = u0; const L = [u]; for (let k = 0; k < n; k++) { u = a * u + b; L.push(u); } if (Math.abs(u) > 400) return null;
return QN("Qu'affiche ce programme ?" + PY(["u = " + u0, "for k in range(" + n + "):", "    u = " + (a === -1 ? "-u" : a + " * u") + (b < 0 ? " - " + -b : " + " + b), "print(u)"]), u, "La boucle tourne " + M(n) + " fois : " + M(L.join(" \\to ")) + ".",
{ ctx: "suite", guide: [GS("Valeur de " + M("u") + " après le 1er tour ?", L[1], M(L[1]) + "."), GS("Après le 2e tour ?", L[2], M(L[2]) + "."), GS("Valeur affichée (après " + n + " tours) ?", u, M(u) + ".")], traps: [TR(L[n - 1], "range(" + n + ") fait " + n + " tours (k = 0 à " + (n - 1) + ")."), TR(a * L[n] + b, "range(" + n + ") fait exactement " + n + " tours, pas " + (n + 1) + ".")] }); },
],
};


const sqF = (o = {}) => FIG.plot([{ f: (x) => x * x, from: o.from, to: o.to }].concat(o.more || []), o.pts || [], Object.assign({ numbers: true, xr: [-4, 4], yr: [-1, 10], squash: 0.62, label: "parabole y = x²" }, o.opt || {}));
const OPS = { ">": ">", "<": "<", ">=": "\\ge", "<=": "\\le" };
FREF[1].push(
() => { const r = pk([2, 3, 1.5, 2.5]), k = r * r;
return QSet("Sur le graphique de la fonction carré, on a tracé la droite " + M("y = " + nf(k)) + ". Lis les solutions de " + M("x^2 = " + nf(k)) + ". (Sépare-les par « ; ».)", [-r, r], "La droite coupe la parabole en deux points d'abscisses " + M(nf(-r)) + " et " + M(nf(r)) + " (symétriques par rapport à l'axe vertical).",
{ ctx: "carre-lu", fig: sqF({ opt: { hlines: [k] } }), guide: [GS("Abscisse du point d'intersection de droite" + (Number.isInteger(r) ? "" : " (à mi-chemin entre deux graduations)") + " ?", r, M(nf(r)) + "."), GSet("Les deux solutions ?", [-r, r], M(nf(-r)) + " et " + M(nf(r)) + ".")],
traps: [TSet([r], "La droite coupe la parabole deux fois : n'oublie pas la solution négative."), TSet([k], "On cherche les abscisses x (axe horizontal), pas la hauteur " + nt(k) + "."), TSet([-Math.floor(r), Math.floor(r)], "Lis précisément : le point est à mi-chemin entre deux graduations.")] }); },
() => { const x0 = pk([0.5, -0.5, 2, -2]), v = 1 / x0;
return QN("Le point " + M("M") + " est sur la courbe de la fonction inverse " + M("x \\mapsto \\frac{1}{x}") + ". Lis son abscisse sur le graphique, puis donne son ordonnée (nombre décimal accepté).", v, "On lit l'abscisse de " + M("M") + " : " + M(nf(x0)) + ". Son ordonnée est son image : " + M("\\frac{1}{" + nf(x0) + "} = " + nf(v)) + " (on peut la lire aussi sur l'axe vertical).",
{ ctx: "inverse-lu", fig: FIG.plot([{ f: (x) => (Math.abs(x) > 0.05 ? 1 / x : NaN) }], [[x0, v, "M"]], { numbers: true, xr: [-5, 5], yr: [-5, 5], label: "hyperbole y = 1/x" }), guide: [GS("Abscisse de " + M("M") + " (axe horizontal) ?", x0, M(nf(x0)) + "."), GS("Ordonnée = inverse de l'abscisse ?", v, M(nf(v)) + ".")],
traps: [TR(x0, "Ça, c'est l'abscisse ; on demande l'ordonnée (axe vertical)."), TR(-v, "Le point est " + (v < 0 ? "sous" : "au-dessus de") + " l'axe horizontal : l'inverse garde le signe."), TR(-x0, "L'inverse n'est pas l'opposé.")] }); },
);
FREF[2].push(
() => { let r1, r2; do { r1 = R.int(-3, 1); r2 = R.int(-1, 3); } while (r1 >= r2 || r1 === -r2); const m = r1 + r2, p = -r1 * r2;
return QSet("On a tracé la parabole " + M("y = x^2") + " et une droite " + M("d") + ". Résous graphiquement " + M("x^2 = " + lin(m, p)) + " (équation de " + M("d") + "). (Sépare les solutions par « ; ».)", [r1, r2], "La droite coupe la parabole aux points d'abscisses " + M(r1) + " et " + M(r2) + " : ce sont les solutions. Vérification : " + M(par(r1) + "^2 = " + r1 * r1) + " et " + M(nf(m) + " \\cdot " + par(r1) + (p ? sg(p) : "") + " = " + (m * r1 + p)) + ".",
{ ctx: "carre-droite", fig: sqF({ more: [{ f: (x) => m * x + p, cls: "f-blue" }] }), guide: [GS("Abscisse du point d'intersection de gauche ?", r1, M(r1) + "."), GSet("Les deux solutions ?", [r1, r2], M(r1) + " et " + M(r2) + ".")],
traps: [TSet([r1 * r1, r2 * r2], "Les solutions sont des abscisses (axe horizontal), pas les hauteurs des points."), TSet([-r1, -r2], "Vérifie le signe : regarde de quel côté de l'axe vertical sont les points.")] }); },
() => { const c = pk([2, 3]), eqn = R.rand() < 0.5, k = c, sq = c * c;
if (eqn) return QN("On a tracé la courbe de " + M("x \\mapsto \\sqrt{x}") + " et la droite " + M("y = \\frac{x}{" + c + "}") + ". Elles se coupent en deux points. Lis l'abscisse du point qui n'est pas l'origine : c'est la solution non nulle de " + M("\\sqrt{x} = \\frac{x}{" + c + "}") + ".", sq, "Les courbes se coupent en " + M("(0 \\,;\\, 0)") + " et " + M("(" + sq + " \\,;\\, " + c + ")") + " : " + M("\\sqrt{" + sq + "} = " + c + " = \\frac{" + sq + "}{" + c + "}") + ".",
{ ctx: "racine-droite", fig: FIG.plot([{ f: (x) => Math.sqrt(x), from: 0 }, { f: (x) => x / c, cls: "f-blue" }], [], { numbers: true, xr: [-1, sq + 1], yr: [-1, c + 1], label: "racine et droite" }), guide: [GS("Hauteur (ordonnée) du point d'intersection qui n'est pas l'origine ?", c, M(c) + "."), GS("Son abscisse (axe horizontal) ? Vérifie : " + M("\\sqrt{x}") + " doit valoir " + M(c) + ".", sq, M(sq) + " : " + M("\\sqrt{" + sq + "} = " + c) + " et " + M(sq + " : " + c + " = " + c) + ".")],
traps: [TR(c, "Ça, c'est l'ordonnée du point (hauteur) ; on demande x."), TR(c * 2, "Lis l'abscisse sur l'axe horizontal.")] });
const op = pk(["<=", "<"]), I = op === "<=", ivs = [[0, true, sq, I]];
return QS("On a tracé la courbe de " + M("x \\mapsto \\sqrt{x}") + " et la droite " + M("y = " + k) + ". Résous graphiquement " + M("\\sqrt{x} " + OPS[op] + " " + k) + "." + SETQ, ivs, "La courbe est sous la droite pour " + M("x") + " entre " + M(0) + " (début de la courbe) et " + M(sq) + " (point d'intersection) : " + M("S = " + IV(ivs)) + ".",
{ ctx: "racine-lue", fig: FIG.plot([{ f: (x) => Math.sqrt(x), from: 0 }], [], { numbers: true, xr: [-1, sq + 1], yr: [-1, k + 1], hlines: [k], label: "racine et droite horizontale" }), guide: [GS("Abscisse du point où la courbe coupe la droite ?", sq, M(sq) + "."), GSS("Ensemble des solutions (la courbe commence en 0) ?", ivs, M(IV(ivs)) + ".")],
traps: [TS([[-Infinity, false, sq, I]], "√x n'existe pas pour x < 0 : la courbe commence en 0."), TS([[0, true, k, I]], "Les solutions se lisent sur l'axe horizontal : jusqu'au point d'intersection (" + sq + ")."), TS([[sq, I, Infinity, false]], "Là, la courbe est AU-DESSUS de la droite.")] }); },
);
FREF[3].push(
() => { const [c, r, lbl] = pk([[4, 2, "\\frac{x}{4}"], [1, 1, "x"], [0.25, 0.5, "4x"]]) , op = pk([">=", ">", "<=", "<"]), I = op.length === 2, ge = op[0] === ">";
const ivs = ge ? [[-Infinity, false, -r, I], [0, false, r, I]] : [[-r, I, 0, false], [r, I, Infinity, false]];
return QS("On a tracé la courbe de " + M("x \\mapsto \\frac{1}{x}") + " et la droite " + M("y = " + lbl) + ". Lis les abscisses des points d'intersection, puis résous graphiquement " + M("\\frac{1}{x} " + OPS[op] + " " + lbl) + "." + SETQ, ivs,
"Points d'intersection en " + M("x = " + nf(-r)) + " et " + M("x = " + nf(r)) + ". L'hyperbole est " + (ge ? "au-dessus" : "en dessous") + " de la droite " + (ge ? "à gauche de " + M(nf(-r)) + " et entre " + M(0) + " (exclu) et " + M(nf(r)) : "entre " + M(nf(-r)) + " et " + M(0) + " (exclu) et à droite de " + M(nf(r))) + " : " + M("S = " + IV(ivs)) + ".",
{ ctx: "inverse-droite", fig: FIG.plot([{ f: (x) => (Math.abs(x) > 0.05 ? 1 / x : NaN) }, { f: (x) => x / c, cls: "f-blue" }], [], { numbers: true, xr: [-4, 4], yr: [-4, 4], label: "hyperbole et droite" }), guide: [GS("Abscisse du point d'intersection de droite ?", r, M(nf(r)) + "."), GSS("Où l'hyperbole est-elle " + (ge ? "au-dessus" : "en dessous") + " de la droite (0 est exclu) ?", ivs, M(IV(ivs)) + ".")],
traps: [TS(ge ? [[-r, I, 0, false], [r, I, Infinity, false]] : [[-Infinity, false, -r, I], [0, false, r, I]], "Regarde où l'hyperbole est " + (ge ? "AU-DESSUS" : "EN DESSOUS") + " de la droite."), TS(ge ? [[-r, I, r, I]] : [[-Infinity, false, -r, I], [r, I, Infinity, false]], "0 est une valeur interdite : la courbe change de côté en x = 0.")] }); },
() => { const kind = pk(["mix", "neg", "pos"]), mx = kind === "mix" ? true : R.rand() < 0.5; let a, b; do { a = kind === "pos" ? R.int(1, 2) : R.int(-3, -1); b = kind === "neg" ? R.int(-2, -1) : kind === "pos" ? R.int(2, 3) : R.int(1, 3); } while (a >= b || Math.abs(a) === Math.abs(b) || (kind === "pos" && a >= b));
const sqs = [a * a, b * b], v = mx ? Math.max(...sqs) : Math.min(...sqs), wrong = mx ? Math.min(...sqs) : Math.max(...sqs); if (Math.abs(v) < 2) return null;
return QN("On a tracé la fonction carré pour " + M("x \\in [" + a + " \\,;\\, " + b + "]") + ". Lis sur le graphique la valeur " + (mx ? "maximale" : "minimale") + " de " + M("x^2") + " sur cet intervalle.", v, (kind === "mix" ? "L'intervalle contient 0 (minimum 0) ; " : kind === "neg" ? "Sur les négatifs, le carré est décroissant ; " : "Sur les positifs, le carré est croissant ; ") + "le point " + (mx ? "le plus haut" : "le plus bas") + " de l'arc est en " + M("x = " + (sqs.indexOf(v) ? b : a)) + " : " + M(v) + ".",
{ ctx: "encadrement-carre", fig: sqF({ from: a, to: b, pts: [[a, a * a, ""], [b, b * b, ""]] }), guide: [GS("Hauteur de l'extrémité gauche de l'arc (" + M("x = " + a) + ") ?", a * a, M(a * a) + "."), GS("De l'extrémité droite (" + M("x = " + b) + ") ?", b * b, M(b * b) + "."), GS("Valeur " + (mx ? "maximale" : "minimale") + " sur l'arc ?", v, M(v) + (kind === "mix" && !mx ? "" : ".") )],
traps: [TR(wrong, kind === "neg" ? "Sur les négatifs, x² diminue quand x augmente : le plus grand carré est en " + a + "." : "Regarde la hauteur des deux extrémités de l'arc."), TR(mx ? b : a, "On demande une valeur de x² (hauteur), pas l'abscisse."), TR(kind === "mix" ? 0 : NaN, "0 est le minimum ; on demande le maximum.")] }); },
);




const PR = (ctx, q, parts, hints, sol) => ({ ctx, q, hints, sol, parts: parts.map(([label, value, round]) => ({ label, spec: Object.assign({ kind: "value", value: r9(value) }, round ? { round } : {}) })) });
const rdv = (v, s) => r9(Math.round(r9(v / s)) * s);
const nett = (v, s) => Math.abs((r9(v / s) % 1) - 0.5) > 0.02;
const et = (v) => eu(v).replace(/\\,/g, " ").replace("{,}", ",");
const fx = (v) => { const d = den(v); return d > 1 && d <= 400 ? Math.round(v * d) + "/" + d : nt(v); };
const VL = ["Nantes", "Rennes", "Lille", "Bordeaux", "Toulouse", "Strasbourg", "Lyon", "Montpellier", "Dijon", "Clermont-Ferrand", "Orléans", "Amiens"];
const PROBA2P = [() => {
const cx = pk(["de", "urne", "sondage", "qcm"]);
if (cx === "de") {
const n = pk([6, 8, 10, 12, 20]), sup = R.rand() < 0.5; let k, f;
if (sup) { k = R.int(Math.ceil(n / 2) + 1, n - 1); f = n - k + 1; } else { k = pk([3, 4, 5].filter((m) => Math.floor(n / m) >= 2)); f = Math.floor(n / k); }
const p = f / n, a = p * p, b = (1 - p) * (1 - p), c = 1 - b, lab = sup ? "un nombre supérieur ou égal à " + k : "un multiple de " + k, jeu = pk(["Pour un jeu de société", "Pour un jeu de rôle", "Pendant une partie de jeu de plateau"]);
return PR(cx, jeu + ", on lance deux fois un dé équilibré à " + n + " faces numérotées de 1 à " + n + ". On note S l'évènement « obtenir " + lab + " » à un lancer.",
[["a) P(S aux deux lancers)" + FA, a], ["b) P(S à aucun des deux lancers)" + FA, b], ["c) P(S au moins une fois)" + FA, c]],
["À un lancer : " + f + " issues favorables sur " + n + ".", "« Au moins une fois » est le contraire de « aucune fois »."],
"À un lancer, " + M("P(S) = " + FT(f, n)) + ". a) Les lancers sont indépendants : " + M(FT(f, n) + " \\times " + FT(f, n) + " = " + fT(a)) + " ; b) " + M(fT(1 - p) + " \\times " + fT(1 - p) + " = " + fT(b)) + " ; c) contraire de b) : " + M("1 - " + fT(b) + " = " + fT(c)) + ".");
}
if (cx === "urne") {
const [cont, sg1, pl, f1, f2, a1, a2, fem, sorte] = pk([["Un sac", "bille", "billes", "rouges", "bleues", "rouge", "bleue", true, "couleur"], ["Une trousse", "feutre", "feutres", "noirs", "verts", "noir", "vert", false, "couleur"], ["Une boîte", "chocolat", "chocolats", "noirs", "au lait", "noir", "au lait", false, "sorte"], ["Un bocal", "bonbon", "bonbons", "à la fraise", "à la menthe", "à la fraise", "à la menthe", false, "sorte"]]);
let r, v; do { r = R.int(3, 8); v = R.int(2, 7); } while (r + v > 12 || r === v);
const N = r + v, a = (r * (r - 1)) / (N * (N - 1)), b = (r * (r - 1) + v * (v - 1)) / (N * (N - 1)), c = 1 - a, un = fem ? "une" : "un";
return PR(cx, cont + " contient " + r + " " + pl + " " + f1 + " et " + v + " " + pl + " " + f2 + ". On tire au hasard " + un + " " + sg1 + ", on " + (fem ? "la" : "le") + " garde, puis on en tire " + un + " second" + (fem ? "e" : "") + " (tirage sans remise).",
[["a) P(deux " + pl + " " + f1 + ")" + FA, a], ["b) P(deux " + pl + " de la même " + sorte + ")" + FA, b], ["c) P(au moins " + un + " " + sg1 + " " + a2 + ")" + FA, c]],
["Sans remise : au second tirage, il reste " + (N - 1) + " " + pl + ".", "« Au moins " + un + " " + a2 + " » est le contraire de « deux " + f1 + " »."],
"a) " + M("\\frac{" + r + "}{" + N + "} \\times \\frac{" + (r - 1) + "}{" + (N - 1) + "} = " + fT(a)) + " ; b) on ajoute « deux " + f2 + " » : " + M(fT(a) + " + \\frac{" + v + "}{" + N + "} \\times \\frac{" + (v - 1) + "}{" + (N - 1) + "} = " + fT(b)) + " ; c) " + M("1 - " + fT(a) + " = " + fT(c)) + ".");
}
if (cx === "sondage") {
const N = pk([200, 250, 400, 500]), [e1, e2] = pk([["pratique un sport en club", "joue d'un instrument de musique"], ["lit au moins un livre par mois", "va au cinéma au moins une fois par mois"], ["a un abonnement de bus ou de TER", "vient au lycée à vélo au moins une fois par semaine"], ["est inscrit à l'association sportive", "fait partie de la chorale"]]);
let a, b, c; do { a = R.int(Math.round(N * 0.2), Math.round(N * 0.55)); b = R.int(Math.round(N * 0.15), Math.round(N * 0.5)); c = R.int(Math.round(N * 0.05), Math.round(N * 0.15)); } while (c >= Math.min(a, b) || a + b - c >= N || a === b);
const u = a + b - c;
return PR(cx, "Dans un lycée de " + pk(VL) + ", on interroge " + N + " élèves. Soit A : « l'élève " + e1 + " » et B : « l'élève " + e2 + " ». " + a + " élèves sont dans A, " + b + " dans B, et " + c + " dans les deux. On choisit un de ces élèves au hasard.",
[["a) P(A ∩ B) (en décimal)", c / N], ["b) P(A ∪ B) (en décimal)", u / N], ["c) P(ni A ni B) (en décimal)", 1 - u / N]],
["P(A ∪ B) = P(A) + P(B) − P(A ∩ B) : les élèves des deux groupes ne sont comptés qu'une fois.", "« Ni A ni B » est le contraire de « A ou B »."],
"a) " + M("\\frac{" + c + "}{" + N + "} = " + nf(c / N)) + " ; b) " + M(nf(a / N) + " + " + nf(b / N) + " - " + nf(c / N) + " = " + nf(u / N)) + " ; c) " + M("1 - " + nf(u / N) + " = " + nf(r9(1 - u / N))) + ".");
}
const k = pk([3, 4, 5]), n = pk([2, 3]), q = (k - 1) / k, a = Math.pow(1 / k, n), b = Math.pow(q, n), c = 1 - b, quiz = pk(["un QCM de SVT", "un quiz de culture générale", "un QCM d'histoire-géographie", "un jeu télévisé"]);
return PR(cx, "Dans " + quiz + ", chaque question propose " + k + " réponses dont une seule est juste. Sans réfléchir, " + pk(["Hugo", "Léa", "Nathan", "Manon", "Yanis", "Chloé"]) + " répond au hasard à " + n + " questions (réponses indépendantes).",
[["a) P(" + (n === 2 ? "les deux" : "les trois") + " réponses justes)" + FA, a], ["b) P(aucune réponse juste)" + FA, b], ["c) P(au moins une réponse juste)" + FA, c]],
["Pour une question : P(juste) = 1/" + k + ", P(fausse) = " + (k - 1) + "/" + k + ".", "On multiplie le long d'une branche ; « au moins une » est le contraire de « aucune »."],
"a) " + M("\\left(\\frac{1}{" + k + "}\\right)^{" + n + "} = " + fT(a)) + " ; b) " + M("\\left(\\frac{" + (k - 1) + "}{" + k + "}\\right)^{" + n + "} = " + fT(b)) + " ; c) " + M("1 - " + fT(b) + " = " + fT(c)) + ".");
}];
const TAUXP = [() => {
const cx = pk(["prix", "commune", "abonnes", "soldes", "voiture"]);
if (cx === "prix") {
const [obj, P0] = pk([["Le prix d'un forfait journée de ski à " + pk(["Chamonix", "Val Thorens", "La Clusaz", "Font-Romeu", "Superbagnères", "Les Arcs"]), 20 * R.int(2, 3)], ["Le loyer mensuel d'un studio à " + pk(VL), 20 * R.int(20, 34)], ["Le prix d'un abonnement annuel à une salle d'escalade de " + pk(VL), 20 * R.int(15, 25)], ["Le prix d'une trottinette électrique", 20 * R.int(12, 24)]]);
let t1, t2; do { t1 = 5 * R.int(1, 6); t2 = 5 * R.int(1, 6); } while ((100 + t1) * (100 - t2) === 10000);
const p1 = r9((P0 * (100 + t1)) / 100), p2 = r9((p1 * (100 - t2)) / 100), g = r9(((100 + t1) * (100 - t2) - 10000) / 100);
return PR(cx, obj + " valait " + et(P0) + " € en 2024. Il augmente de " + t1 + " % en 2025, puis baisse de " + t2 + " % en 2026.",
[["a) Prix en 2025 (€)", p1], ["b) Prix en 2026 (€)", p2], ["c) Taux d'évolution global de 2024 à 2026 (en %, négatif pour une baisse)", g]],
["Coefficients : " + nt(r9(1 + t1 / 100)) + " puis " + nt(r9(1 - t2 / 100)) + ".", "Le taux global se lit sur le produit des coefficients, pas sur la somme des taux."],
"a) " + M(eu(P0) + " \\times " + nf(r9(1 + t1 / 100)) + " = " + eu(p1)) + " € ; b) " + M(eu(p1) + " \\times " + nf(r9(1 - t2 / 100)) + " = " + eu(p2)) + " € ; c) " + M(nf(r9(1 + t1 / 100)) + " \\times " + nf(r9(1 - t2 / 100)) + " = " + nf(r9(1 + g / 100))) + ", soit " + M((g > 0 ? "+" : "") + nf(g) + "\\,\\%") + ".");
}
if (cx === "commune" || cx === "abonnes") {
const com = cx === "commune", t = com ? pk([1.5, 2, 2.5, 3, 4]) : pk([5, 6, 8, 10, 12]), q = 1 + t / 100;
let A; do A = com ? 200 * R.int(15, 120) : 100 * R.int(20, 300); while (!nett(A * q ** 3, 1) || !nett((q ** 3 - 1) * 100, 0.1));
const a1 = r9(A * q), a3 = A * q ** 3, g = (q ** 3 - 1) * 100;
const txt = com ? "La population d'une commune de la périphérie de " + pk(VL) + " augmente de " + nt(t) + " % par an depuis 2020 ; elle comptait " + nt(A) + " habitants en 2020."
: "Une chaîne vidéo de recettes de cuisine compte " + nt(A) + " abonnés au 1er janvier. Le nombre d'abonnés augmente de " + t + " % par mois.";
return PR(cx, txt,
[["a) " + (com ? "Population en 2021" : "Abonnés au 1er février"), a1], ["b) " + (com ? "Population en 2023 (arrondie à l'unité)" : "Abonnés au 1er avril (arrondi à l'unité)"), a3, 1], ["c) Taux d'évolution global sur ces trois " + (com ? "années" : "mois") + " (en %, au dixième)", g, 0.1]],
["Augmenter de " + nt(t) + " %, c'est multiplier par " + nt(q) + ".", "Trois évolutions de " + nt(t) + " % : coefficient " + nt(q) + "³ (et non 3 × " + nt(t) + " %)."],
"a) " + M(nf(A) + " \\times " + nf(q) + " = " + nf(a1)) + " ; b) " + M(nf(A) + " \\times " + nf(q) + "^3 \\approx " + nf(rdv(a3, 1))) + " ; c) " + M(nf(q) + "^3 \\approx " + nf(rdv(q ** 3, 0.0001))) + ", soit environ " + M("+" + nf(rdv(g, 0.1)) + "\\,\\%") + ".");
}
if (cx === "soldes") {
const [obj, gen] = pk([["un manteau", "Il"], ["une paire de baskets", "Elle"], ["un vélo de ville", "Il"], ["une console de jeu", "Elle"], ["une tente de camping", "Elle"]]);
let I, t; do { I = 5 * R.int(8, 60); t = pk([10, 20, 25, 30, 40]); } while (!nett((100 / (100 - t) - 1) * 100, 0.1) && t !== 20 && t !== 25);
const Pn = r9((I * (100 - t)) / 100), q = r9(1 - t / 100), h = (100 / (100 - t) - 1) * 100;
return PR(cx, "Pendant les soldes d'hiver, le prix d'" + obj + " baisse de " + t + " %. " + gen + " coûte maintenant " + et(Pn) + " €.",
[["a) Coefficient multiplicateur de la baisse", q], ["b) Prix avant les soldes (€)", I], ["c) Taux de hausse qu'il faudrait pour revenir au prix d'avant (en %, au dixième)", h, 0.1]],
["Prix après = prix avant × " + nt(q) + " : on divise pour remonter.", "Coefficient réciproque : 1 ÷ " + nt(q) + "."],
"a) " + M("1 - " + nf(t / 100) + " = " + nf(q)) + " ; b) " + M(eu(Pn) + " \\div " + nf(q) + " = " + eu(I)) + " € ; c) " + M("\\frac{1}{" + nf(q) + "} \\approx " + nf(rdv(1 / q, 0.0001))) + ", soit une hausse d'environ " + M(nf(rdv(h, 0.1)) + "\\,\\%") + " (et non " + t + " %).");
}
let P0, t; do { P0 = 500 * R.int(16, 40); t = pk([10, 12, 15, 18, 20]); } while (!nett(P0 * (1 - t / 100) ** 3, 1) || !nett((1 - (1 - t / 100) ** 3) * 100, 0.1));
const q = r9(1 - t / 100), v1 = r9(P0 * q), v3 = P0 * q ** 3, g = (1 - q ** 3) * 100, obj = pk(["Une voiture d'occasion", "Un camping-car", "Une moto"]);
return PR(cx, obj + " achetée " + et(P0) + " € perd " + t + " % de sa valeur chaque année.",
[["a) Valeur après 1 an (€)", v1], ["b) Valeur après 3 ans (€, arrondie à l'unité)", v3, 1], ["c) Perte de valeur en 3 ans (en % de la valeur d'achat, au dixième)", g, 0.1]],
["Perdre " + t + " %, c'est multiplier par " + nt(q) + ".", "Sur 3 ans : coefficient " + nt(q) + "³ ; la perte n'est pas 3 × " + t + " %."],
"a) " + M(eu(P0) + " \\times " + nf(q) + " = " + eu(v1)) + " € ; b) " + M(eu(P0) + " \\times " + nf(q) + "^3 \\approx " + nf(rdv(v3, 1))) + " € ; c) " + M(nf(q) + "^3 = " + nf(r9(q ** 3))) + " : perte " + M("(1 - " + nf(r9(q ** 3)) + ") \\times 100 \\approx " + nf(rdv(g, 0.1)) + "\\,\\%") + ".");
}];
const VECTP = [() => {
const cx = pk(["parallelogramme", "alignement", "deplacement"]), pt = (n, x, y) => n + "(" + nt(x) + " ; " + nt(y) + ")";
if (cx === "parallelogramme") {
let A, B, C, d; do { A = [R.int(-4, 5), R.int(-4, 5)]; B = [R.int(-4, 7), R.int(-4, 7)]; C = [R.int(-4, 7), R.int(-4, 7)]; d = (B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0]); } while (!d || A[0] === B[0] || B[1] === C[1]);
const D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]], u = [B[0] - A[0], B[1] - A[1]], w = [C[0] - A[0], C[1] - A[1]], bc = [C[0] - B[0], C[1] - B[1]];
const intro = pk(["Dans un repère, on donne ", "Sur le plan d'un jardin à la française (repère orthonormé, unité : 10 m), trois coins d'un bassin en forme de parallélogramme ABCD sont ", "Sur l'écran d'un logiciel de géométrie, on place "]);
return PR(cx, intro + pt("A", ...A) + ", " + pt("B", ...B) + " et " + pt("C", ...C) + ".",
[["a) Abscisse du point D tel que ABCD soit un parallélogramme", D[0]], ["b) Ordonnée de D", D[1]], ["c) Déterminant des vecteurs AB et AC", d]],
["ABCD parallélogramme ⇔ vecteur AD = vecteur BC.", "det(u, v) = x_u × y_v − y_u × x_v."],
"a), b) " + M("\\overrightarrow{BC}(" + nf(bc[0]) + " \\,;\\, " + nf(bc[1]) + ")") + ", donc " + M("D(" + nf(A[0]) + sg(bc[0]) + " \\,;\\, " + nf(A[1]) + sg(bc[1]) + ") = (" + nf(D[0]) + " \\,;\\, " + nf(D[1]) + ")") + " ; c) " + M("\\overrightarrow{AB}(" + nf(u[0]) + " \\,;\\, " + nf(u[1]) + ")") + ", " + M("\\overrightarrow{AC}(" + nf(w[0]) + " \\,;\\, " + nf(w[1]) + ")") + " : " + M(par(u[0]) + " \\times " + par(w[1]) + " - " + par(u[1]) + " \\times " + par(w[0]) + " = " + nf(d)) + " (non nul : A, B, C ne sont pas alignés).");
}
if (cx === "alignement") {
let A, u, C, d, k, L; do { A = [R.int(-3, 4), R.int(-3, 4)]; u = [R.nz(-4, 4), R.nz(-4, 4)]; C = [R.int(-3, 8), R.int(-3, 8)]; d = u[0] * (C[1] - A[1]) - u[1] * (C[0] - A[0]); k = pk([2, 3, -1, -2]); L = Math.hypot(u[0], u[1]); } while (!d || !nett(L, 0.1) || Math.abs(u[0]) === Math.abs(u[1]));
const B = [A[0] + u[0], A[1] + u[1]], E = [A[0] + k * u[0], A[1] + k * u[1]], w = [C[0] - A[0], C[1] - A[1]];
const intro = pk([["Sur la carte d'une course d'orientation en forêt de Fontainebleau (repère orthonormé, unité : 100 m), les balises A et B ont pour coordonnées ", "le poste de secours"], ["Sur le plan d'un parc à Lille (repère orthonormé, unité : 10 m), deux lampadaires sont en ", "un banc"], ["Dans un repère orthonormé, on donne ", "le point"]]);
return PR(cx, intro[0] + pt("A", ...A) + " et " + pt("B", ...B) + " ; " + intro[1] + " C est en " + pt("C", ...C) + ".",
[["a) Déterminant des vecteurs AB et AC", d], ["b) Ordonnée du point E d'abscisse " + nt(E[0]) + " aligné avec A et B", E[1]], ["c) Longueur AB (en unités, au dixième)", L, 0.1]],
["A, B, E alignés ⇔ det(AB, AE) = 0.", "AB = √((x_B − x_A)² + (y_B − y_A)²)."],
"a) " + M("\\overrightarrow{AB}(" + nf(u[0]) + " \\,;\\, " + nf(u[1]) + ")") + ", " + M("\\overrightarrow{AC}(" + nf(w[0]) + " \\,;\\, " + nf(w[1]) + ")") + " : " + M(par(u[0]) + " \\times " + par(w[1]) + " - " + par(u[1]) + " \\times " + par(w[0]) + " = " + nf(d)) + " (non alignés) ; b) " + M("\\overrightarrow{AE}(" + nf(E[0] - A[0]) + " \\,;\\, " + (A[1] ? "y - " + par(A[1]) : "y") + ")") + " colinéaire à " + M("\\overrightarrow{AB}") + " : " + M("y = " + nf(E[1])) + " ; c) " + M("\\sqrt{" + par(u[0]) + "^2 + " + par(u[1]) + "^2} = \\sqrt{" + (u[0] ** 2 + u[1] ** 2) + "} \\approx " + nf(rdv(L, 0.1))) + ".");
}
const [s0, s1] = pk([[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5], [8, 15], [9, 12]]), s = [s0 * pk([1, -1]), s1 * pk([1, -1])];
let u, v, A; do { u = [R.nz(-7, 7), R.nz(-7, 7)]; v = [s[0] - u[0], s[1] - u[1]]; A = [R.int(-5, 5), R.int(-5, 5)]; } while (!v[0] || !v[1] || u[0] * v[1] - u[1] * v[0] === 0);
const Z = [A[0] + s[0], A[1] + s[1]], n = Math.hypot(s0, s1), [who, unit] = pk([["Un robot d'un entrepôt de Saint-Priest, près de Lyon, part du point", "1 m"], ["Un voilier, sur une carte marine de la baie de Quiberon, part du point", "1 mille marin"], ["Le personnage d'un jeu vidéo part de la case", "1 case"], ["Un drone de livraison, au-dessus d'une zone d'activités de Toulouse, part du point", "10 m"]]);
return PR(cx, who + " " + pt("A", ...A) + " (repère orthonormé, unité : " + unit + "). Il se déplace selon le vecteur u(" + nt(u[0]) + " ; " + nt(u[1]) + "), puis selon le vecteur v(" + nt(v[0]) + " ; " + nt(v[1]) + ").",
[["a) Abscisse du point d'arrivée", Z[0]], ["b) Ordonnée du point d'arrivée", Z[1]], ["c) Distance entre le départ et l'arrivée (en unités)", n]],
["Les deux déplacements s'enchaînent : vecteur u + v.", "Distance : norme de u + v."],
"a), b) " + M("\\vec{u} + \\vec{v} = (" + nf(s[0]) + " \\,;\\, " + nf(s[1]) + ")") + ", arrivée " + M("(" + nf(A[0]) + sg(s[0]) + " \\,;\\, " + nf(A[1]) + sg(s[1]) + ") = (" + nf(Z[0]) + " \\,;\\, " + nf(Z[1]) + ")") + " ; c) " + M("\\sqrt{" + par(s[0]) + "^2 + " + par(s[1]) + "^2} = \\sqrt{" + (s0 * s0 + s1 * s1) + "} = " + n) + ".");
}];
const PCONDP = [() => {
const cx = pk(["lycee", "depistage", "club", "usine"]);
if (cx === "club") {
const N = pk([80, 100, 125, 160, 200, 250]), sport = pk(["handball", "judo", "basket", "escalade", "rugby", "natation"]);
let F, fc, gc; do { F = R.int(Math.round(N * 0.3), Math.round(N * 0.6)); fc = R.int(5, F - 5); gc = R.int(5, N - F - 5); } while (!nett((100 * fc) / F, 1) || !nett((100 * fc) / (fc + gc), 1) || fc === gc);
const G = N - F, C = fc + gc;
return PR(cx, "Un club de " + sport + " de " + pk(VL) + " compte " + N + " licenciés : " + F + " filles et " + G + " garçons. " + fc + " filles et " + gc + " garçons jouent en compétition. On choisit un licencié au hasard ; F : « c'est une fille », C : « la personne joue en compétition ».",
[["a) P(C) (en décimal)", C / N], ["b) P_F(C) (au centième)", fc / F, 0.01], ["c) P_C(F) (au centième)", fc / C, 0.01]],
["P_F(C) : on se limite aux " + F + " filles.", "P_C(F) : on se limite aux " + C + " licenciés en compétition."],
"a) " + M("\\frac{" + C + "}{" + N + "} = " + nf(C / N)) + " ; b) " + M("\\frac{" + fc + "}{" + F + "} \\approx " + nf(rdv(fc / F, 0.01))) + " ; c) " + M("\\frac{" + fc + "}{" + C + "} \\approx " + nf(rdv(fc / C, 0.01))) + ".");
}
let p, q1, q2, txt, A, B, Ab, ctr = 0;
do {
if (cx === "lycee") { p = 5 * R.int(8, 14); q1 = 10 * R.int(2, 8); q2 = 10 * R.int(2, 8); }
else if (cx === "depistage") { p = pk([1, 2, 4, 5, 8, 10]); q1 = pk([90, 95, 98]); q2 = pk([2, 3, 5, 10]); }
else { p = 5 * R.int(6, 14); q1 = pk([1, 2, 3, 4, 5]); q2 = pk([1, 2, 3, 4, 5, 6]); }
ctr++;
} while ((q1 === q2 || !nett((p * q1) / (p * q1 + (100 - p) * q2), 0.01)) && ctr < 200);
const a = (p * q1) / 10000, b = a + ((100 - p) * q2) / 10000, c = a / b;
if (cx === "lycee") { const [ev, lt] = pk([["prennent le bus", "B"], ["font du sport à l'association sportive", "S"], ["ont un abonnement à la médiathèque", "M"]]); A = "D"; B = lt; Ab = "D̄";
txt = "Dans un lycée de " + pk(VL) + ", " + p + " % des élèves sont demi-pensionnaires (évènement D). Parmi eux, " + q1 + " % " + ev + " (évènement " + lt + ") ; parmi les autres élèves, " + q2 + " % " + ev + "."; }
else if (cx === "depistage") { A = "M"; B = "T"; Ab = "M̄";
txt = "Une maladie touche " + p + " % de la population d'une région. Un test de dépistage est positif pour " + q1 + " % des malades et pour " + q2 + " % des personnes non malades. On teste une personne au hasard ; M : « la personne est malade », T : « le test est positif »."; }
else { const [obj, gen] = pk([["vélos électriques", "assemblés"], ["casques de vélo", "fabriqués"], ["smartphones reconditionnés", "préparés"]]); A = "A"; B = "D"; Ab = "Ā";
txt = "Une usine de " + pk(VL) + " a deux chaînes de production de " + obj + " : la chaîne A en produit " + p + " %, la chaîne B le reste. " + q1 + " % des " + obj + " " + gen + " sur A et " + q2 + " % de ceux " + gen + " sur B ont un défaut. On choisit un produit au hasard ; D : « il a un défaut »."; }
return PR(cx, txt,
[["a) P(" + A + " ∩ " + B + ") (en décimal)", a], ["b) P(" + B + ") (en décimal)", b], ["c) P_" + B + "(" + A + "), arrondie au centième", c, 0.01]],
["Arbre : " + A + " (" + nt(p / 100) + "), puis " + B + " sachant " + A + " (" + nt(q1 / 100) + ").", "P(" + B + ") : on additionne les deux chemins qui mènent à " + B + " ; puis P_" + B + "(" + A + ") = P(" + A + " ∩ " + B + ") ÷ P(" + B + ")."],
"a) " + M(nf(p / 100) + " \\times " + nf(q1 / 100) + " = " + nf(a)) + " ; b) " + M(nf(a) + " + " + nf(r9(1 - p / 100)) + " \\times " + nf(q2 / 100) + " = " + nf(r9(b))) + " ; c) " + M("\\frac{" + nf(a) + "}{" + nf(r9(b)) + "} \\approx " + nf(rdv(c, 0.01))) + ".");
}];
const ALGOP = [() => {
const cx = pk(["somme", "epargne", "tarif"]);
if (cx === "somme") {
const a = pk([0, 1, 2, 3, 5, 10]), k = pk([1, 1, 2, 3]), full = R.rand() < 0.6, m1 = R.int(3, 6), m2 = R.int(8, 12), f = (n) => a + (k * (full ? n * (n + 1) : n * (n - 1))) / 2;
let S; do S = R.int(60, 300); while ([...Array(60).keys()].some((n) => f(n) === S));
let n0 = 0; while (f(n0) <= S) n0++;
return PR(cx, "On considère la fonction Python ci-dessous." + PY(["def f(n):", "    s = " + a, "    for i in range(" + (full ? "1, n + 1" : "n") + "):", "        s = s + " + (k === 1 ? "i" : k + " * i"), "    return s"]),
[["a) f(" + m1 + ")", f(m1)], ["b) f(" + m2 + ")", f(m2)], ["c) Plus petit entier n tel que f(n) > " + S, n0]],
[full ? "range(1, n + 1) donne i = 1, 2, …, n." : "range(n) donne i = 0, 1, …, n − 1 (n est exclu).", "c) Calcule f(n) pour des n de plus en plus grands, ou utilise la somme 1 + 2 + … + m = m(m + 1)/2."],
"f(n) = " + M(a + " + " + (k === 1 ? "" : k + " \\times ") + "(" + (full ? "1 + 2 + \\dots + n" : "0 + 1 + \\dots + (n - 1)") + ")") + ". a) " + M("f(" + m1 + ") = " + f(m1)) + " ; b) " + M("f(" + m2 + ") = " + f(m2)) + " ; c) " + M("f(" + (n0 - 1) + ") = " + f(n0 - 1) + " \\le " + S) + " et " + M("f(" + n0 + ") = " + f(n0) + " > " + S) + " : " + M("n = " + n0) + ".");
}
if (cx === "epargne") {
const who = pk(["Lucas", "Emma", "Yanis", "Léna", "Théo", "Zoé"]), t = pk([2, 3, 4, 5]), C = 100 * R.int(5, 30), q = 1 + t / 100;
const yrs = (s) => { let c = C, n = 0; while (c < s) { c *= q; n++; } return n; };
let S1, S2; do { S1 = 50 * Math.round((C * (1.1 + R.rand() * 0.25)) / 50); S2 = 50 * Math.round((C * (1.4 + R.rand() * 0.5)) / 50); } while ([S1, S2].some((s) => Math.abs(Math.log(s / C) / Math.log(q) - Math.round(Math.log(s / C) / Math.log(q))) < 1e-3) || yrs(S1) === yrs(S2) || yrs(S1) < 2);
return PR(cx, who + " place " + nt(C) + " € sur un livret à " + t + " % par an (intérêts composés). On considère la fonction Python ci-dessous." + PY(["def annees(seuil):", "    capital = " + C, "    n = 0", "    while capital < seuil:", "        capital = capital * " + q.toFixed(2), "        n = n + 1", "    return n"]),
[["a) Valeur de capital après le premier passage dans la boucle (€)", r9(C * q)], ["b) annees(" + S1 + ")", yrs(S1)], ["c) annees(" + S2 + ")", yrs(S2)]],
["Chaque passage multiplie le capital par " + nt(q) + " et ajoute 1 à n.", "La boucle s'arrête dès que capital ≥ seuil ; n compte les années."],
"a) " + M(nf(C) + " \\times " + nf(q) + " = " + nf(r9(C * q))) + " € ; b) " + M(nf(C) + " \\times " + nf(q) + "^{" + (yrs(S1) - 1) + "} \\approx " + nf(rdv(C * q ** (yrs(S1) - 1), 0.01)) + " < " + nf(S1)) + " et " + M(nf(C) + " \\times " + nf(q) + "^{" + yrs(S1) + "} \\approx " + nf(rdv(C * q ** yrs(S1), 0.01)) + " \\ge " + nf(S1)) + " : " + yrs(S1) + " ; c) de même, " + M(nf(C) + " \\times " + nf(q) + "^{" + yrs(S2) + "} \\approx " + nf(rdv(C * q ** yrs(S2), 0.01))) + " : " + yrs(S2) + ".");
}
const [lieu, ag] = pk([["un musée de Bordeaux", [4, 18]], ["la patinoire de Grenoble", [6, 16]], ["un parc d'attractions près de Nantes", [3, 12]], ["la piscine municipale de Rennes", [5, 18]]]), p1 = R.int(3, 9), p2 = p1 + R.int(3, 8);
const prix = (x) => (x < ag[0] ? 0 : x < ag[1] ? p1 : p2), e1 = ag[1], e2 = R.int(ag[0], ag[1] - 1);
const fam = [R.int(35, 48), R.int(33, 46), R.int(1, ag[0] - 1), R.int(ag[0], ag[1] - 1), ag[1]], tot = fam.reduce((s, x) => s + prix(x), 0);
return PR(cx, "Le tarif d'entrée dans " + lieu + " est calculé par la fonction Python ci-dessous (âge en années, prix en euros)." + PY(["def prix(age):", "    if age < " + ag[0] + ":", "        return 0", "    elif age < " + ag[1] + ":", "        return " + p1, "    else:", "        return " + p2]),
[["a) prix(" + e2 + ")", prix(e2)], ["b) prix(" + e1 + ")", prix(e1)], ["c) Prix total pour une famille dont les âges sont " + fam.join(", ") + " (€)", tot]],
["if … elif … else : la première condition vraie l'emporte.", "« age < " + ag[1] + " » est fausse pour " + ag[1] + " : on passe au else."],
"a) " + M(ag[0] + " \\le " + e2 + " < " + ag[1]) + " : " + p1 + " € ; b) " + M(e1 + " < " + ag[1]) + " est faux : " + p2 + " € ; c) " + fam.map(prix).join(" + ") + " = " + tot + " €.");
}];
const PROBS = { probcond: PCONDP, tauxevol: TAUXP, proba2: PROBA2P, algopy: ALGOP, vect3e: VECTP };


const NEW = [
["ineq1", "fa", "Inéquations du 1er degré", "2x - 3 \\ge 5 \\iff x \\ge 4", [9, 6], [10], INEQ1, "Une inéquation se résout comme une équation ; on change le sens quand on multiplie ou divise par un nombre négatif.", ["Tester une valeur, résoudre ax ⩾ b", "Coefficient négatif, deux membres, lire une droite graduée", "Modéliser par une inéquation"]],
["proba2", "no", "Probabilités : contraire, deux épreuves, réunion", "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)", [9, 9], [10], PROBA2, "Contraire : 1 − P(A). Deux épreuves : on multiplie le long d'une branche et on additionne les branches. « A ou B » : P(A) + P(B) − P(A ∩ B).", ["Évènement contraire, somme égale à 1", "Deux épreuves : arbre, avec ou sans remise", "Réunion et intersection"]],
["tabsignes", "fa", "Tableau de signes, inéquations produit et quotient", "\\frac{x - 1}{x + 3} \\ge 0", [10, 7], null, TSIG, "Une ligne par facteur (signe de ax + b : celui de a à droite du zéro), puis la règle des signes. Valeur interdite : double barre, toujours exclue.", ["Signe d'une expression affine", "Inéquation produit", "Inéquation quotient"]],
["tauxevol", "no", "Évolutions : coefficient multiplicateur, taux successifs et réciproque", "+20\\,\\% \\text{ puis } -10\\,\\% : \\times 1{,}08", [10, 5], null, TAUX, "Évoluer de t %, c'est multiplier par 1 + t/100. Évolutions successives : on multiplie les coefficients. Taux réciproque : coefficient inverse.", ["Coefficient multiplicateur, comparer deux valeurs", "Évolutions successives, proportion de proportion", "Taux réciproque, évolutions répétées"]],
["vect3e", "es", "Vecteurs et coordonnées", "\\overrightarrow{AB}\\begin{pmatrix} x_B - x_A \\\\ y_B - y_A \\end{pmatrix}", [10, 9], null, VECT, "AB a pour coordonnées (x_B − x_A ; y_B − y_A). Chasles : AB + BC = AC. Norme de u(a ; b) : √(a² + b²). Colinéaires ⇔ déterminant x_u y_v − y_u x_v nul.", ["Lire et calculer des coordonnées, Chasles", "Somme, produit par un réel, parallélogramme, norme", "Déterminant, colinéarité, alignement"]],
["fref", "fa", "Fonctions de référence : carré, inverse, racine", "x^2 \\le 9 \\iff -3 \\le x \\le 3", [10, 11], null, FREF, "Carré : décroissante sur ]−∞ ; 0], croissante sur [0 ; +∞[. Inverse : décroissante sur chacun de ses deux intervalles. Racine : croissante sur [0 ; +∞[.", ["Comparer des images, x² = k", "Inéquations x² ⩽ k, √x ⩽ k", "Inverse, encadrements"]],
["probcond", "no", "Probabilités conditionnelles, tableau croisé", "P_A(B) = \\frac{P(A \\cap B)}{P(A)}", [10, 14], [11], PCOND, "P_A(B) : on se place dans A (ligne ou colonne du tableau, ou branche de l'arbre). Le long d'un chemin, on multiplie ; on additionne les chemins.", ["Fréquences marginales et conditionnelles", "P_A(B) par tableau ou arbre", "P_B(A), faux positifs"]],
["algopy", "no", "Algorithmique : lire un programme Python", "\\texttt{for i in range(5)}", [10, 15], null, ALGO, "Suis le programme ligne par ligne en notant la valeur de chaque variable ; range(a, b) s'arrête à b − 1 ; if … elif … else : la première condition vraie l'emporte.", ["Affectations, fonctions", "Instructions conditionnelles", "Boucles for et while"]],
];
for (const [id, theme, label, ex, fr, again, lv, hint, comps] of NEW) {
if (!NOTIONS.find((n) => n.id === id)) NOTIONS.push(Object.assign({ id, theme, label, ex, CH: null, FR: fr }, again ? { againFR: again } : {}));
GEN[id] = (d) => pickForm(lv[Math.min(Math.max(d, 1), 3)]);
if (typeof VAR !== "undefined") VAR[id] = {};
HINTS_EXTRA[id] = hint;
if (typeof COMPS !== "undefined") COMPS[id] = comps;
if (PROBS[id] && typeof PROB_EXTRA !== "undefined") PROB_EXTRA[id] = PROBS[id];
}



const FR_2NDE = { ensembles: 1, formule: 3, ineq: 7, absval: 10, racinv: 11, affzero: 12, cart: 8, droites: 9, droitesinter: 9, stats: 14 };
for (const [id, k] of Object.entries(FR_2NDE)) { const n = NOTIONS.find((x) => x.id === id); if (n) n.FR = [10, k]; }

for (const id of ["sys2", "sys3", "sysprob", "sysgraph"]) { const n = NOTIONS.find((x) => x.id === id); if (n) n.FR = null; }
{ const n = NOTIONS.find((x) => x.id === "eq3"); if (n) n.FR = [12, 3]; }



{ const n = NOTIONS.find((x) => x.id === "vecteurs"); if (n) n.FR = null; }


const AGAIN_2NDE = { fracops: 8, fracadd: 6, fracmul: 8, puiss: 8, fracconv: 6, ordgr: 6, uvol: 7, ucomp: 8, parenth: 7, distrib: 7, idrem: 9, factor: 7, eq1: 7, eq2fact: 9,
valnum: 7, pct: 6, fractout: 6, pctvar: 8, fimg: 9, affine: 9, modaff: 9, lectgraph: 7, multdiv: 6, premiers: 8, fracsimp: 6, decarr: 6, racenc: 8, rac: 9, relrep: 7,
statfreq: 7, diagr: 7, quartiles: 8, proba: 6 };
for (const [id, g] of Object.entries(AGAIN_2NDE)) {
const n = NOTIONS.find((x) => x.id === id); if (!n) continue;
if (!n.FR) n.FR = [g, 0];
n.againFR = [...new Set([...(n.againFR || []), 10])];
}


const CHAP = {
"2AU": ["fracops", "fracadd", "fracmul", "puiss", "fracconv", "ordgr", "uvol", "ucomp", "parenth", "distrib", "idrem", "factor", "eq1", "eq2fact", "valnum", "pct", "fractout", "pctvar", "fimg", "affine"],
"2NC": ["multdiv", "premiers", "fracsimp", "ensembles", "relrep", "decarr", "racenc", "rac", "formule", "ineq1", "ineq", "tabsignes"],
"2GE": ["vect3e", "cart", "droites", "droitesinter"],
"2AN": ["lectgraph", "modaff", "affzero", "fref", "racinv", "absval"],
"2SP": ["tauxevol", "statfreq", "diagr", "stats", "quartiles", "proba", "proba2", "probcond"],
"2AP": ["algopy"],
};
ORDRE.FR = ORDRE.FR || {}; ORDRE_THEME.FR = ORDRE_THEME.FR || {};
let rk = 0;
for (const [ch, ids] of Object.entries(CHAP)) for (const id of ids) { ORDRE.FR[id] = rk++; ORDRE_THEME.FR[id] = ch; }
THEME_LABEL.FR = { "2AU": "Automatismes", "2NC": "Nombres et calculs", "2GE": "Géométrie", "2AN": "Fonctions", "2SP": "Statistiques et probabilités", "2AP": "Algorithmique et programmation" };
})();

