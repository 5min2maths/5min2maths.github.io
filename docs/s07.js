






(function () {
if (typeof NOTIONS === "undefined" || typeof GEN === "undefined") return;

const pk = (a) => a[Math.floor(R.rand() * a.length)];
const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; };
const r6 = (v) => +(+v).toFixed(9);

const den = (v) => { for (let d = 1; d <= 400; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-7) return d; return 0; };

const fT = (v) => { v = r6(v); const d = den(v); if (d === 1 || !d || d > 60) return nb(v); const n = Math.round(v * d); return (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
const co = (a) => (a === 1 ? "" : a === -1 ? "-" : fT(a));
const sgS = (v) => (v < 0 ? " - " + fS(-v) : " + " + fS(v));

const fS = (v) => { v = r6(v); const d = den(v); if (d === 1) return String(Math.round(v)); if (!d) return String(v); return Math.round(v * d) + "/" + d; };
const par = (v) => (v < 0 ? "(" + fT(v) + ")" : fT(v));
const sg = (v) => (v < 0 ? " - " + fT(-v) : " + " + fT(v));
const P2 = (cs, x = "x") => poly(ptrim(cs), x);

const tp = (cs, x = "x") => { cs = ptrim(cs); const d = cs.length - 1; let o = "";
cs.forEach((c, i) => { const p = d - i; if (!c) return; const a = Math.abs(c), co = p === 0 ? fS(a) : a === 1 ? "" : Number.isInteger(r6(a)) ? fS(a) : "(" + fS(a) + ")";
const t = co + (p === 0 ? "" : p === 1 ? x : x + "^" + p); o += o === "" ? (c < 0 ? "-" : "") + t : (c < 0 ? " - " : " + ") + t; });
return o || "0"; };
const dP = (cs) => cs.slice(0, -1).map((c, i) => c * (cs.length - 1 - i));
const pv = (cs, x) => cs.reduce((a, c) => a * x + c, 0);

const mT = (c, n, x = "x") => (n === 0 ? fT(c) : (c === 1 ? "" : c === -1 ? "-" : fT(c)) + (n === 1 ? x : x + "^{" + n + "}"));
const mS = (c, n, x = "x") => (n === 0 ? fS(c) : (c === 1 ? "" : c === -1 ? "-" : Number.isInteger(r6(c)) ? fS(c) : "(" + fS(c) + ")") + (n === 1 ? x : x + "^" + (n < 0 ? "(" + n + ")" : n)));
const lin = (a, b, x = "x") => P2([a, b], x);
const linS = (a, b, x = "x") => tp([a, b], x);
const pw = (base, n) => "(" + base + ")" + (n === 1 ? "" : "^" + n);
const pwT = (base, n) => "(" + base + ")" + (n === 1 ? "" : "^{" + n + "}");
const sq3 = (p, q) => {
if (!q) return fT(p); const qa = Math.abs(q), qs = (qa === 1 ? "" : fT(qa).startsWith("\\frac") ? "" : fT(qa)) , isF = fT(qa).startsWith("\\frac");
const rt = isF ? "\\frac{" + (Math.round(qa * den(qa)) === 1 ? "" : Math.round(qa * den(qa))) + "\\sqrt{3}}{" + den(qa) + "}" : qs + "\\sqrt{3}";
return (p ? fT(p) + (q < 0 ? " - " : " + ") : q < 0 ? "-" : "") + rt; };
const PL = (fns, pts, o = {}) => FIG.plot(fns, pts || [], Object.assign({ numbers: true, xr: [-6, 6], yr: [-6, 6] }, o));

const keepT = (spec, traps) => { const seen = new Set(); return (traps || []).filter((tr) => {
if (!tr) return false;
if (tr.e) { try { const t = Expr.parse(tr.e); if (Expr.equivalent(t, Expr.parse(spec.expr))) return false; const k = tr.e; if (seen.has(k)) return false; seen.add(k); return true; } catch (e) { return false; } }
if (tr.s) { if (spec.kind !== "set" || !tr.s.every(isFinite)) return false; const k = tr.s.map(fS).sort().join(";"); if (seen.has(k) || checkAnswer(spec, tr.s.map(fS).join(" ; ")).status === "correct") return false; seen.add(k); return true; }
if (tr.spec) { const c = tr.spec.kind === "pair" ? tr.spec.values.map(fS).join(" ; ") : SolSet.show(tr.spec.ivs, false); if (seen.has(c) || checkAnswer(spec, c).status === "correct" || checkAnswer(tr.spec, c).status !== "correct") return false; seen.add(c); return true; }
if (!isFinite(tr.v) || Math.abs(tr.v - spec.value) < 1e-9 || seen.has(r6(tr.v))) return false; seen.add(r6(tr.v)); return true; }); };
const mk = (q, spec, sol, o) => { const x = { q, spec, sol, guide: o.guide, ctx: o.ctx, traps: keepT(spec, o.traps) }; if (o.fig) x.fig = o.fig; if (o.canon) x.canon = o.canon; return x; };
const QN = (q, value, sol, o) => mk(q, { kind: "value", value }, sol, o);
const QX = (q, expr, sol, o) => mk(q, { kind: "expr", expr }, sol, Object.assign({ canon: expr }, o));
const QSet = (q, vals, sol, o) => mk(q, { kind: "set", values: [...new Set(vals)].sort((a, b) => a - b) }, sol, o);
const QP = (q, vals, sol, o) => mk(q, { kind: "pair", values: vals }, sol, Object.assign({ canon: vals.map(fS).join(" ; ") }, o));
const QS = (q, ivs, sol, o) => mk(q, solsetSpec(ivs), sol, Object.assign({ canon: SolSet.show(ivs, false) }, o));
const GX = (ask, expr, sol) => ({ ask, spec: { kind: "expr", expr }, sol });
const GSet = (ask, vals, sol) => ({ ask, spec: { kind: "set", values: [...new Set(vals)].sort((a, b) => a - b) }, sol });
const GP = (ask, vals, sol) => ({ ask, spec: { kind: "pair", values: vals }, sol });
const GSS = (ask, ivs, sol) => ({ ask, spec: solsetSpec(ivs), sol });
const TX = (e, m) => ({ e, m });
const TSt = (s, m) => ({ s, m });
const TP = (vals, m) => ({ spec: { kind: "pair", values: vals }, m });
const TS = (ivs, m) => ({ spec: solsetSpec(ivs), m });
const TR = TRAP;
const P = (q, parts, hints, sol, fig) => ({ fig, q, parts: parts.map(([label, value]) => ({ label, spec: { kind: "value", value } })), hints, sol });
const quad = (cs) => (x) => pv(cs, x);
const ftex = (cs) => M("f(x) = " + P2(cs));





const TVC = [
() => { const v0 = R.int(12, 24), h0 = R.int(1, 3), t1 = R.int(0, 1), t2 = t1 + pk([1, 2]); const f = (t) => r6(h0 + v0 * t - 5 * t * t); const r = r6((f(t2) - f(t1)) / (t2 - t1)); if (f(t2) <= 0 || r === 0) return null;
return { ctx: "balle", r, v1: f(t1), v2: f(t2), d: t2 - t1, a: t1, b: t2, u: "m/s", fx: "h(t) = " + h0 + " + " + v0 + "t - 5t^2", fn: "h", txt: "Une balle est lancée vers le haut ; sa hauteur vaut " + M("h(t) = " + h0 + " + " + v0 + "t - 5t^2") + " mètres après " + M("t") + " secondes.", qq: "Quelle est sa vitesse verticale moyenne (en m/s) entre " + M("t = " + t1) + " et " + M("t = " + t2) + " ?" }; },
() => { const k = pk([2, 3, 4]), V0 = R.int(4, 9) * 100, t1 = R.int(1, 4), t2 = t1 + R.int(2, 4); const f = (t) => V0 - k * t * t - 10 * t; const r = r6((f(t2) - f(t1)) / (t2 - t1)); if (f(t2) <= 0) return null;
return { ctx: "vidange", r, v1: f(t1), v2: f(t2), d: t2 - t1, a: t1, b: t2, u: "L/min", fx: "V(t) = " + V0 + " - 10t - " + k + "t^2", fn: "V", txt: "Une cuve se vide : elle contient " + M("V(t) = " + nb(V0) + " - 10t - " + k + "t^2") + " litres après " + M("t") + " minutes.", qq: "Quel est le taux de variation moyen du volume (en L/min) entre " + M("t = " + t1) + " et " + M("t = " + t2) + " ?" }; },
() => { const N0 = R.int(2, 6) * 100, a = pk([2, 4, 6]), t1 = R.int(1, 3), t2 = t1 + R.int(2, 3); const f = (t) => N0 + a * t ** 3; const r = r6((f(t2) - f(t1)) / (t2 - t1));
return { ctx: "culture", r, v1: f(t1), v2: f(t2), d: t2 - t1, a: t1, b: t2, u: "bactéries par heure", fx: "N(t) = " + N0 + " + " + a + "t^3", fn: "N", txt: "Une culture compte " + M("N(t) = " + nb(N0) + " + " + a + "t^3") + " bactéries après " + M("t") + " heures.", qq: "Quel est le taux de variation moyen (en bactéries par heure) entre " + M("t = " + t1) + " et " + M("t = " + t2) + " ?" }; },
];
const TV = {
1: [
() => { const a = pk([1, -1, 2, -2, 3]), b = nz(-5, 5), c = R.int(-6, 6), x1 = R.int(-3, 2), x2 = x1 + R.int(2, 4), cs = [a, b, c], y1 = pv(cs, x1), y2 = pv(cs, x2), t = (y2 - y1) / (x2 - x1);
return QN("Calcule le taux de variation moyen de " + ftex(cs) + " entre " + M(x1) + " et " + M(x2) + ".", t, M("\\frac{f(" + x2 + ") - f(" + x1 + ")}{" + x2 + " - " + par(x1) + "} = \\frac{" + y2 + " - " + par(y1) + "}{" + (x2 - x1) + "} = " + fT(t)) + ".",
{ ctx: "polynome", guide: [GS("Calcule " + M("f(" + x1 + ")") + ".", y1, M("f(" + x1 + ") = " + y1) + "."), GS("Calcule " + M("f(" + x2 + ")") + ".", y2, M("f(" + x2 + ") = " + y2) + "."), GS("Taux : variation de " + M("f") + " divisée par variation de " + M("x") + ". Résultat ?", t, M("\\frac{" + (y2 - y1) + "}{" + (x2 - x1) + "} = " + fT(t)) + ".")],
traps: [TR(y2 - y1, "Il faut encore diviser par l'écart des abscisses."), TR(y2 === y1 ? NaN : (x2 - x1) / (y2 - y1), "C'est l'inverse : variation de f divisée par variation de x."), TR(-t, "Attention à l'ordre : f(x₂) − f(x₁) avec x₂ − x₁, dans le même ordre.")] }); },
() => { const c = pk(TVC)(); if (!c) return null;
return QN(c.txt + " " + c.qq, c.r, M("\\frac{" + c.fn + "(" + c.b + ") - " + c.fn + "(" + c.a + ")}{" + c.b + " - " + c.a + "} = \\frac{" + nb(c.v2) + " - " + (c.v1 < 0 ? "(" + nb(c.v1) + ")" : nb(c.v1)) + "}{" + c.d + "} = " + nb(c.r)) + " " + c.u + ".",
{ ctx: c.ctx, guide: [GS("Calcule " + M(c.fn + "(" + c.a + ")") + ".", c.v1, M(nb(c.v1)) + "."), GS("Calcule " + M(c.fn + "(" + c.b + ")") + ".", c.v2, M(nb(c.v2)) + "."), GS("Taux moyen = variation ÷ durée ?", c.r, M(nb(c.r)) + " " + c.u + ".")],
traps: [TR(r6(c.v2 - c.v1), "C'est la variation totale : divise-la par la durée " + c.d + "."), TR(r6(c.v2 / c.b), "On divise la variation " + c.fn + "(" + c.b + ") − " + c.fn + "(" + c.a + "), pas la valeur finale."), TR(-c.r, "Signe : la grandeur " + (c.r > 0 ? "augmente" : "diminue") + " sur cet intervalle.")] }); },
() => { const a = pk([1, -1]), h = nz(-2, 2), k = R.int(-3, 3), cs = [a, -2 * a * h, a * h * h + k], x1 = R.int(-3, 1), x2 = x1 + R.int(2, 3), y1 = pv(cs, x1), y2 = pv(cs, x2); if (Math.abs(y1) > 5 || Math.abs(y2) > 5 || y1 === y2) return null; const t = (y2 - y1) / (x2 - x1);
return QN("Lis les coordonnées des points " + M("A") + " et " + M("B") + " du graphe de " + M("f") + ". Quel est le taux de variation moyen de " + M("f") + " entre leurs abscisses (la pente de la sécante " + M("AB") + ") ?", t, M("A(" + x1 + " \\,;\\, " + y1 + ")") + ", " + M("B(" + x2 + " \\,;\\, " + y2 + ")") + " : " + M("\\frac{" + y2 + " - " + par(y1) + "}{" + x2 + " - " + par(x1) + "} = " + fT(t)) + ".",
{ ctx: "graphique", fig: PL([{ f: quad(cs) }], [[x1, y1, "A"], [x2, y2, "B"]], { segs: [[x1, y1, x2, y2, "f-line"]] }), guide: [GS("Variation verticale de " + M("A") + " à " + M("B") + " ?", y2 - y1, M(y2 - y1) + "."), GS("Variation horizontale ?", x2 - x1, M(x2 - x1) + "."), GS("Pente de la sécante ?", t, M(fT(t)) + ".")],
traps: [TR((x2 - x1) / (y2 - y1), "Pente = variation verticale ÷ variation horizontale, pas l'inverse."), TR(y2 - y1, "Divise par la variation horizontale."), TR(-t, "La sécante " + (t > 0 ? "monte" : "descend") + " de A vers B.")] }); },
],
2: [
() => { const k = pk([2, 3, 4, 5]), t1 = R.int(1, 4), t2 = t1 + R.int(1, 3), d1 = k * t1 * t1, d2 = k * t2 * t2, v = k * (t1 + t2), obj = pk([["Une bille descend un plan incliné", "bille"], ["Un skieur s'élance sur une piste", "skieur"], ["Une luge démarre dans une pente", "luge"]]);
return QN(obj[0] + " : après " + M("t") + " secondes, la distance parcourue est " + M("d(t) = " + k + "t^2") + " mètres. Quelle est la vitesse moyenne (en m/s) entre " + M("t = " + t1) + " et " + M("t = " + t2) + " ?", v, M("\\frac{d(" + t2 + ") - d(" + t1 + ")}{" + t2 + " - " + t1 + "} = \\frac{" + d2 + " - " + d1 + "}{" + (t2 - t1) + "} = " + v) + " m/s.",
{ ctx: "chute-" + obj[1], guide: [GS(M("d(" + t1 + ")") + " ?", d1, M(d1) + " m."), GS(M("d(" + t2 + ")") + " ?", d2, M(d2) + " m."), GS("Vitesse moyenne ?", v, M(v) + " m/s.")],
traps: [TR(d2 / t2, "C'est la vitesse moyenne depuis le départ, pas entre les deux instants."), TR(d2 - d1, "Divise par la durée " + (t2 - t1) + " s.")] }); },
() => { const k = pk([12, 24, 36, 60, 48]), ds = [1, 2, 3, 4, 6, 12].filter((x) => k % x === 0), x1 = pk(ds.slice(0, -1)), x2 = pk(ds.filter((x) => x > x1)); if (!x2) return null; const y1 = k / x1, y2 = k / x2, t = (y2 - y1) / (x2 - x1);
return QN("Calcule le taux de variation moyen de " + M("f(x) = \\frac{" + k + "}{x}") + " entre " + M(x1) + " et " + M(x2) + ".", t, M("\\frac{" + y2 + " - " + y1 + "}{" + x2 + " - " + x1 + "} = " + fT(t)) + " : négatif, la fonction décroît.",
{ ctx: "inverse", guide: [GS(M("f(" + x1 + ")") + " ?", y1, M(y1) + "."), GS(M("f(" + x2 + ")") + " ?", y2, M(y2) + "."), GS("Taux ?", t, M(fT(t)) + ".")],
traps: [TR(-t, "f décroît sur cet intervalle : le taux est négatif."), TR(y2 - y1, "Divise par " + (x2 - x1) + "."), TR((x2 - x1) / (y2 - y1), "Variation de f divisée par variation de x, pas l'inverse.")] }); },
() => { const a = pk([1, 2, 3, -1, -2]), p = nz(-4, 4), b = p + pk([2, 3, 4, 5, -3, -2]); if (b === 0 || b === p) return null; const T = a * (p + b);
return QN("Le taux de variation moyen de " + M("f(x) = " + mT(a, 2)) + " entre " + M(p) + " et un nombre " + M("b \\neq " + p) + " vaut " + M(T) + ". Que vaut " + M("b") + " ?", b, M("\\frac{f(b) - f(" + p + ")}{b - " + par(p) + "} = " + co(a) + "(b + " + par(p) + ")") + " (différence de carrés) ; " + M(co(a) + "(b + " + par(p) + ") = " + T) + " donne " + M("b = " + b) + ".",
{ ctx: "inconnue", guide: [GS("Le taux se simplifie en " + M(co(a) + "(" + p + " + b)") + ". Que vaut " + M(p + " + b") + " ?", T / a, M(fT(T / a)) + "."), GS(M("b") + " ?", b, M(b) + ".")],
traps: [TR(T / a, "Tu as trouvé p + b : retire encore " + p + "."), TR(T - p, a === 1 ? "Vérifie : p + b = " + T + "." : "Divise d'abord par " + a + "."), TR(T / a + p, "p + b = " + fT(T / a) + " : on soustrait " + p + ".")] }); },
],
3: [
() => { const a = pk([1, 2, -1, 3, -2]), b = R.int(-5, 5), c = R.int(-5, 5), x0 = nz(-3, 3), cs = [a, b, c], m = 2 * a * x0 + b; if (!m) return null;
return QX("Soit " + ftex(cs) + ". Simplifie le taux de variation moyen entre " + M(x0) + " et " + M(x0 + " + h") + " (avec " + M("h \\neq 0") + ") : " + M("\\frac{f(" + x0 + " + h) - f(" + x0 + ")}{h}") + ".", tp([a, m], "h"),
M("f(" + x0 + " + h) - f(" + x0 + ") = " + P2([a, m, 0], "h")) + ", donc le taux vaut " + M(P2([a, m], "h")) + ".",
{ ctx: "quotient-h", guide: [GX("Développe et réduis " + M("f(" + x0 + " + h) - f(" + x0 + ")") + " (en fonction de " + M("h") + ").", tp([a, m, 0], "h"), M(P2([a, m, 0], "h")) + "."), GX("Divise par " + M("h") + ".", tp([a, m], "h"), M(P2([a, m], "h")) + ".")],
traps: [TX(tp([a, m, 0], "h"), "Il reste à diviser par h."), TX(tp([a, 2 * a * x0], "h"), "Le terme " + b + "x de f compte aussi : il donne " + b + " dans le taux."), TX(tp([1, m], "h"), "Le coefficient de h² dans la différence est " + a + ".")] }); },
() => { const a = pk([0.02, 0.05, 0.1, 0.04]), b = R.int(8, 20), F = R.int(5, 15) * 100, q1 = R.int(5, 20) * 10, q2 = q1 + R.int(2, 6) * 10, C = (q) => r6(a * q * q + b * q + F), t = r6(a * (q1 + q2) + b), it = pk([["bougies", "bougie"], ["pots de confiture", "pot"], ["coques de téléphone", "coque"], ["mugs imprimés", "mug"]]);
return QN("Un atelier fabrique " + M("q") + " " + it[0] + " par jour pour un coût " + M("C(q) = " + nb(a) + "q^2 + " + b + "q + " + nb(F)) + " (en CHF). Quand la production passe de " + M(q1) + " à " + M(q2) + " " + it[0] + ", quel est le taux de variation moyen du coût (en CHF par " + it[1] + ") ?", t,
M("\\frac{C(" + q2 + ") - C(" + q1 + ")}{" + (q2 - q1) + "} = \\frac{" + nb(C(q2)) + " - " + nb(C(q1)) + "}{" + (q2 - q1) + "} = " + nb(t)) + " CHF par " + it[1] + " supplémentaire.",
{ ctx: "cout", guide: [GS(M("C(" + q1 + ")") + " ?", C(q1), M(nb(C(q1))) + " CHF."), GS(M("C(" + q2 + ")") + " ?", C(q2), M(nb(C(q2))) + " CHF."), GS("Taux moyen ?", t, M(nb(t)) + " CHF.")],
traps: [TR(r6(C(q2) - C(q1)), "C'est la hausse totale : divise par " + (q2 - q1) + "."), TR(r6(C(q2) / q2), "C'est le coût moyen d'une pièce, pas le taux de variation du coût.")] }); },
() => { const x0 = pk([1, 2, 3, -2]), h = pk([0.1, 0.2]), y0 = x0 ** 3, y1 = r6((x0 + h) ** 3), t = r6((y1 - y0) / h);
return QN("Calcule le taux de variation moyen de " + M("f(x) = x^3") + " entre " + M(x0) + " et " + M(nb(r6(x0 + h))) + ". (Plus l'intervalle est petit, plus ce taux approche la pente de la tangente en " + M(x0) + ".)", t,
M("\\frac{" + nb(y1) + " - " + par(y0) + "}{" + nb(h) + "} = " + nb(t)) + " (proche de " + M("3 \\cdot " + par(x0) + "^2 = " + 3 * x0 * x0) + ").",
{ ctx: "petit-intervalle", guide: [GS(M("f(" + nb(r6(x0 + h)) + ")") + " ?", y1, M(nb(y1)) + "."), GS("Variation " + M("f(" + nb(r6(x0 + h)) + ") - f(" + x0 + ")") + " ?", r6(y1 - y0), M(nb(r6(y1 - y0))) + "."), GS("Divisée par " + M(nb(h)) + " ?", t, M(nb(t)) + ".")],
traps: [TR(r6(y1 - y0), "Divise encore par " + String(h).replace(".", ",") + "."), TR(3 * x0 * x0, "C'est la pente de la tangente (la limite) ; ici on demande le taux sur l'intervalle.")] }); },
],
};


const ND = {
1: [
() => { const [a, dd] = pk([[1, 1], [1, 2], [-1, 1], [-1, 2], [0.5, 2], [-0.5, 2]]), d = dd * pk([1, -1]), h = R.int(-2, 2), k = R.int(-3, 3), x0 = h + d, cs = [a, -2 * a * h, a * h * h + k], y0 = pv(cs, x0), m = 2 * a * d; if (Math.abs(y0) > 5) return null;
return QN("La droite en pointillés est tangente au graphe de " + M("f") + " au point " + M("A") + ". Que vaut " + M("f'(" + x0 + ")") + " ?", m, "La tangente passe par " + M("A(" + x0 + " \\,;\\, " + y0 + ")") + " et par " + M("(" + (x0 + 1) + " \\,;\\, " + (y0 + m) + ")") + " : sa pente vaut " + M(m) + ", donc " + M("f'(" + x0 + ") = " + m) + ".",
{ ctx: "tangente-lue", fig: PL([{ f: quad(cs) }, { f: (x) => m * (x - x0) + y0, cls: "f-line", dash: true }], [[x0, y0, "A"]]), guide: [GS("Abscisse du point " + M("A") + " ?", x0, M(x0) + "."), GS("Sur la tangente, quand " + M("x") + " augmente de 1, de combien " + M("y") + " varie-t-il ?", m, M(m) + " : c'est la pente, donc " + M("f'(" + x0 + ")") + ".")],
traps: [TR(y0, "f(" + x0 + ") est l'ordonnée de A ; le nombre dérivé est la pente de la tangente."), TR(-m, "La tangente " + (m > 0 ? "monte" : "descend") + " : vérifie le signe."), TR(1 / m, "Pente = variation verticale ÷ variation horizontale.")] }); },
() => { const k = pk([1, 1, 2, 3, -1, -2]), c = R.int(-5, 5), a = nz(-6, 6), v = 2 * k * a;
return QN("Avec la définition " + M("f'(a) = \\lim_{h \\to 0} \\frac{f(a + h) - f(a)}{h}") + ", calcule " + M("f'(" + a + ")") + " pour " + M("f(x) = " + P2([k, 0, c])) + ".", v, M("\\frac{f(" + a + " + h) - f(" + a + ")}{h} = " + P2([k, 2 * k * a], "h")) + " ; quand " + M("h \\to 0") + ", il reste " + M(v) + ".",
{ ctx: "definition-x2", guide: [GX("Simplifie " + M("\\frac{f(" + a + " + h) - f(" + a + ")}{h}") + " (en fonction de " + M("h") + ").", tp([k, 2 * k * a], "h"), M(P2([k, 2 * k * a], "h")) + "."), GS("Limite quand " + M("h") + " tend vers 0 ?", v, M(v) + ".")],
traps: [TR(k * a * a + c, "C'est f(" + a + "), pas le nombre dérivé."), TR(v + k, "h tend vers 0 : on ne remplace pas h par 1."), TR(k * a, "(x²)' = 2x : il manque le facteur 2.")] }); },
() => { const x0 = nz(-4, 4), m = nz(-5, 5), p = nz(-6, 6), ask = pk(["der", "val"]), y0 = m * x0 + p;
return QN("La tangente au graphe de " + M("f") + " au point d'abscisse " + M(x0) + " a pour équation " + M("y = " + lin(m, p)) + ". Que vaut " + M(ask === "der" ? "f'(" + x0 + ")" : "f(" + x0 + ")") + " ?", ask === "der" ? m : y0,
ask === "der" ? "Le nombre dérivé est la pente de la tangente : " + M("f'(" + x0 + ") = " + m) + "." : "Le point de contact est sur la tangente : " + M("f(" + x0 + ") = " + m + " \\cdot " + par(x0) + sg(p) + " = " + y0) + ".",
{ ctx: "eq-tangente-" + ask, guide: ask === "der" ? [GS("Pente de la droite " + M("y = " + lin(m, p)) + " ?", m, M(m) + " = " + M("f'(" + x0 + ")") + ".")] : [GS("Le point de contact est sur la tangente. Ordonnée de la tangente en " + M("x = " + x0) + " ?", y0, M(y0) + ".")],
traps: ask === "der" ? [TR(p, "p est l'ordonnée à l'origine ; le nombre dérivé est la pente m."), TR(y0, "C'est f(" + x0 + ")."), TR(-m, "Signe de la pente.")] : [TR(m, "m est la pente, c'est-à-dire f'(" + x0 + ")."), TR(p, "p est la valeur en x = 0, pas en x = " + x0 + "."), TR(m * x0 - p, "Ordonnée : m · x0 + p.")] }); },
],
2: [
() => { const a = pk([1, -1, 2, -2, 3]), b = nz(-6, 6), c = R.int(-5, 5), x0 = nz(-3, 3), cs = [a, b, c], v = 2 * a * x0 + b; if (!v) return null;
return QN("Avec la définition du nombre dérivé, calcule " + M("f'(" + x0 + ")") + " pour " + ftex(cs) + ".", v, M("\\frac{f(" + x0 + " + h) - f(" + x0 + ")}{h} = " + P2([a, v], "h")) + " ; limite en " + M("h \\to 0") + " : " + M(v) + ".",
{ ctx: "definition-x2b", guide: [GX("Simplifie le quotient " + M("\\frac{f(" + x0 + " + h) - f(" + x0 + ")}{h}") + ".", tp([a, v], "h"), M(P2([a, v], "h")) + "."), GS("Limite quand " + M("h \\to 0") + " ?", v, M(v) + ".")],
traps: [TR(pv(cs, x0), "C'est f(" + x0 + ")."), TR(2 * a * x0, "Le terme " + b + "x donne aussi " + b + " dans la limite."), TR(v + a, "h tend vers 0 : le terme en h disparaît.")] }); },
() => { const k = pk([1, 2, 3, 4, 6]), a = pk([2, 3, 4, 5, -2, -3, -4]), v = -k / (a * a);
return QN("Avec la définition, calcule " + M("f'(" + a + ")") + " pour " + M("f(x) = \\frac{" + k + "}{x}") + ".", v, M("\\frac{f(" + a + " + h) - f(" + a + ")}{h} = \\frac{-" + k + "}{" + a + "(" + a + " + h)}") + " ; quand " + M("h \\to 0") + " : " + M("\\frac{-" + k + "}{" + a * a + "} = " + fT(v)) + ".",
{ ctx: "definition-inverse", guide: [GX("Simplifie " + M("\\frac{f(" + a + " + h) - f(" + a + ")}{h}") + " (une seule fraction).", "-" + k + "/(" + a + "*(" + a + "+h))", M("\\frac{-" + k + "}{" + a + "(" + a + " + h)}") + "."), GS("Limite quand " + M("h \\to 0") + " ?", v, M(fT(v)) + ".")],
traps: [TR(-v, "La fonction k/x décroît : le nombre dérivé est négatif."), TR(-k / a, "Au dénominateur, a(a + h) tend vers a², pas vers a."), TR(k / a, "C'est f(" + a + ").")] }); },
() => { const a = pk([1, -1, 0.5, -0.5]), h = nz(-3, 3), k = R.int(-3, 3), cs = [a, -2 * a * h, a * h * h + k], ask = pk(["abs", "signe"]);
if (ask === "abs") return QN("Sur le graphe de " + M("f") + ", en quelle abscisse le nombre dérivé " + M("f'(x)") + " est-il nul ?", h, "La tangente est horizontale au sommet de la parabole : " + M("x = " + h) + ".",
{ ctx: "derivee-nulle", fig: PL([{ f: quad(cs) }], []), guide: [GS("Où la tangente est-elle horizontale (pente 0) ? Au sommet. Abscisse du sommet ?", h, M(h) + ".")],
traps: [TR(k, "C'est l'ordonnée du sommet ; on demande l'abscisse."), TR(-h, "Lis l'abscisse sur l'axe horizontal (signe).")] });
const x0 = h + pk([-2, 2]), m = 2 * a * (x0 - h);
return QN("Sur le graphe de " + M("f(x) = " + P2(cs)) + ", calcule la pente de la tangente au point d'abscisse " + M(x0) + ", c'est-à-dire " + M("f'(" + x0 + ")") + ", avec la définition.", m, M("\\frac{f(" + x0 + " + h) - f(" + x0 + ")}{h} = " + P2([a, m], "h")) + " → " + M(m) + ". " + (m > 0 ? "La fonction croît en ce point." : "La fonction décroît en ce point."),
{ ctx: "pente-parabole", fig: PL([{ f: quad(cs) }], [[x0, pv(cs, x0), ""]]), guide: [GX("Quotient simplifié (en " + M("h") + ") ?", tp([a, m], "h"), M(P2([a, m], "h")) + "."), GS("Limite ?", m, M(m) + ".")],
traps: [TR(pv(cs, x0), "C'est f(" + x0 + ")."), TR(-m, "Vérifie le signe sur le graphique : la courbe " + (m > 0 ? "monte" : "descend") + ".")] }); },
],
3: [
() => { const r = R.int(2, 9), a = r * r, v = 1 / (2 * r);
return QN("Avec la définition (et l'expression conjuguée), calcule " + M("f'(" + a + ")") + " pour " + M("f(x) = \\sqrt{x}") + ".", v, M("\\frac{\\sqrt{" + a + " + h} - " + r + "}{h} = \\frac{1}{\\sqrt{" + a + " + h} + " + r + "}") + " ; quand " + M("h \\to 0") + " : " + M("\\frac{1}{" + 2 * r + "}") + ".",
{ ctx: "definition-racine", guide: [GX("Multiplie par l'expression conjuguée et simplifie le quotient (en " + M("h") + ").", "1/(sqrt(" + a + "+h)+" + r + ")", M("\\frac{1}{\\sqrt{" + a + " + h} + " + r + "}") + "."), GS("Limite quand " + M("h \\to 0") + " ?", v, M("\\frac{1}{" + 2 * r + "}") + ".")],
traps: [TR(1 / r, "Le dénominateur tend vers √a + √a = " + 2 * r + "."), TR(1 / (2 * a), "C'est 1/(2√a), pas 1/(2a)."), TR(r, "C'est f(" + a + ").")] }); },
() => { const a = nz(-4, 4), k = pk([1, 2, -1]), v = 3 * k * a * a;
return QN("Avec la définition, calcule " + M("f'(" + a + ")") + " pour " + M("f(x) = " + mT(k, 3)) + ".", v, M("\\frac{f(" + a + " + h) - f(" + a + ")}{h} = " + P2([k, 3 * k * a, 3 * k * a * a], "h")) + " → " + M(v) + ".",
{ ctx: "definition-cube", guide: [GX("Quotient simplifié (développe " + M("(" + a + " + h)^3") + ") ?", tp([k, 3 * k * a, 3 * k * a * a], "h"), M(P2([k, 3 * k * a, 3 * k * a * a], "h")) + "."), GS("Limite ?", v, M(v) + ".")],
traps: [TR(k * a ** 3, "C'est f(" + a + ")."), TR(3 * k * a, "(x³)' = 3x² : le carré manque."), TR(k * a * a, "Il manque le facteur 3.")] }); },
() => { const p = pk([0.5, 1, 1.5, 2, 2.5]), q = R.int(0, 6), t0 = R.int(2, 12), v = r6(2 * p * t0 + q), o = pk(["Un train qui démarre", "Une voiture qui s'insère sur l'autoroute", "Un cycliste qui accélère", "Un tram qui quitte l'arrêt"]);
const sT = nb(p).replace(/^1$/, "") + "t^2" + (q ? " + " + q + "t" : "");
return QN(o + " parcourt " + M("s(t) = " + sT) + " mètres en " + M("t") + " secondes. Quelle est sa vitesse instantanée (en m/s) à " + M("t = " + t0) + " s, c'est-à-dire " + M("s'(" + t0 + ")") + " ?", v, M("s'(t) = " + P2([2 * p, q], "t")) + " ; " + M("s'(" + t0 + ") = " + nb(v)) + " m/s.",
{ ctx: "vitesse-instantanee", guide: [GX("Dérivée " + M("s'(t)") + " ?", tp([2 * p, q], "t"), M(P2([2 * p, q], "t")) + "."), GS(M("s'(" + t0 + ")") + " ?", v, M(nb(v)) + " m/s.")],
traps: [TR(r6(p * t0 + q), "C'est la vitesse moyenne depuis le départ : la vitesse instantanée est s'(t)."), TR(r6(p * t0 * t0 + q * t0), "C'est la distance parcourue s(" + t0 + ")."), TR(r6(2 * p * t0), "Le terme " + q + "t donne aussi " + q + " m/s.")] }); },
],
};


const DR = {
1: [
() => { const n = R.int(3, 9);
return QX("Donne la fonction dérivée de " + M("f(x) = x^{" + n + "}") + ". Écris seulement l'expression de " + M("f'(x)") + ".", n + "x^" + (n - 1), M("(x^n)' = n x^{n - 1}") + " : " + M("f'(x) = " + n + "x^{" + (n - 1) + "}") + ".",
{ ctx: "puissance", guide: [GS("Exposant de la dérivée (" + M(n + " - 1") + ") ?", n - 1, M(n - 1) + "."), GX(M("f'(x)") + " ?", n + "x^" + (n - 1), M(n + "x^{" + (n - 1) + "}") + ".")],
traps: [TX(n + "x^" + n, "L'exposant diminue de 1."), TX("x^" + (n - 1), "L'exposant descend devant : facteur " + n + "."), TX((n - 1) + "x^" + n, "(xⁿ)' = n·xⁿ⁻¹.")] }); },
() => { const k = pk([2, 3, 4, 5, -2, -3, -4, -6, 7]), n = R.int(2, 6), c = k * n;
return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = " + mT(k, n)) + ".", mS(c, n - 1), M("f'(x) = " + k + " \\cdot " + n + mT(1, n - 1) + " = " + mT(c, n - 1)) + ".",
{ ctx: "multiple", guide: [GS("Dérivée de " + M("x^{" + n + "}") + " : coefficient ?", n, M("(x^{" + n + "})' = " + mT(n, n - 1)) + "."), GX("Avec le facteur " + M(k) + " ?", mS(c, n - 1), M(mT(c, n - 1)) + ".")],
traps: [TX(mS(c, n), "L'exposant diminue de 1."), TX(mS(k, n - 1), "Le facteur " + n + " (l'exposant) descend devant."), TX(mS(n, n - 1), "Le coefficient " + k + " reste : (k·u)' = k·u'.")] }); },
() => { const n = R.int(2, 5), a = pk([2, -2, 3, -3]), v = n * a ** (n - 1);
return QN("Pour " + M("f(x) = x^{" + n + "}") + ", calcule " + M("f'(" + a + ")") + ".", v, M("f'(x) = " + mT(n, n - 1)) + ", donc " + M("f'(" + a + ") = " + n + " \\cdot " + par(a) + (n - 1 > 1 ? "^{" + (n - 1) + "}" : "") + " = " + v) + ".",
{ ctx: "valeur-puissance", guide: [GX(M("f'(x)") + " ?", mS(n, n - 1), M(mT(n, n - 1)) + "."), GS(M("f'(" + a + ")") + " ?", v, M(v) + ".")],
traps: [TR(a ** n, "C'est f(" + a + ") : dérive d'abord."), TR(n * a ** n, "L'exposant de la dérivée est " + (n - 1) + "."), TR(a ** (n - 1), "N'oublie pas le facteur " + n + ".")] }); },
],
2: [
() => { const n = R.int(1, 4), ans = "-" + n + "/x^" + (n + 1);
return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = \\frac{1}{" + (n === 1 ? "x" : "x^{" + n + "}") + "}") + ".", ans, M("f(x) = x^{-" + n + "}") + ", donc " + M("f'(x) = -" + (n === 1 ? "" : n) + "x^{-" + (n + 1) + "} = -\\frac{" + n + "}{x^{" + (n + 1) + "}}") + ".",
{ ctx: "inverse-puissance", guide: [GS("Écris " + M("f(x) = x^{p}") + " : exposant " + M("p") + " ?", -n, M(-n) + "."), GX(M("f'(x)") + " ?", ans, M("-\\frac{" + n + "}{x^{" + (n + 1) + "}}") + ".")],
traps: [TX(n + "/x^" + (n + 1), "Exposant négatif : la dérivée est négative."), TX(n === 1 ? "-1" : "-" + n + "/x^" + (n - 1), "L'exposant −" + n + " diminue de 1 : il devient −" + (n + 1) + "."), TX("1/(" + n + "*x^" + (n - 1) + ")", "On ne dérive pas le dénominateur seul : écris f(x) = x^(−" + n + ").")] }); },
() => { const k = pk([1, 2, 3, 4, 6, 8, 10]), r = R.int(2, 7), a = r * r, v = k / (2 * r);
return QN("Pour " + M("f(x) = " + (k === 1 ? "" : k) + "\\sqrt{x}") + ", calcule " + M("f'(" + a + ")") + ".", v, M("f'(x) = \\frac{" + k + "}{2\\sqrt{x}}") + ", donc " + M("f'(" + a + ") = \\frac{" + k + "}{2 \\cdot " + r + "} = " + fT(v)) + ".",
{ ctx: "racine", guide: [GX(M("f'(x)") + " ?", k + "/(2*sqrt(x))", M("\\frac{" + k + "}{2\\sqrt{x}}") + "."), GS(M("f'(" + a + ")") + " ?", v, M(fT(v)) + ".")],
traps: [TR(k / r, "(√x)' = 1/(2√x) : le facteur 2 manque."), TR(k / (2 * a), "Au dénominateur : 2√x, pas 2x."), TR(k * r, "C'est f(" + a + ").")] }); },
() => { const t = pk(["cbrt", "x32", "x52"]);
const [eN, eD, ftx] = t === "cbrt" ? [1, 3, "\\sqrt[3]{x}"] : t === "x32" ? [3, 2, "x\\sqrt{x}"] : [5, 2, "x^2\\sqrt{x}"];
const b = t === "cbrt" ? pk([2, 3, 4]) : R.int(2, 5), a = t === "cbrt" ? b ** 3 : b * b, e = eN / eD, v = r6(e * Math.pow(a, e - 1));
return QN("Pour " + M("f(x) = " + ftx) + ", calcule " + M("f'(" + a + ")") + ". (Écris d'abord " + M("f(x)") + " comme une puissance de " + M("x") + ".)", v, M("f(x) = x^{\\frac{" + eN + "}{" + eD + "}}") + ", " + M("f'(x) = \\frac{" + eN + "}{" + eD + "} x^{" + fT(e - 1) + "}") + " ; " + M("f'(" + a + ") = " + fT(v)) + ".",
{ ctx: "exposant-" + t, guide: [GS("Exposant de " + M("x") + " dans " + M("f(x)") + " (fraction) ?", e, M("\\frac{" + eN + "}{" + eD + "}") + "."), GS(M("f'(" + a + ")") + " ?", v, M(fT(v)) + ".")],
traps: [TR(r6(e * Math.pow(a, e)), "L'exposant diminue de 1 : " + fS(e) + " − 1 = " + fS(e - 1) + "."), TR(r6(Math.pow(a, e - 1)), "N'oublie pas le facteur " + fS(e) + "."), TR(r6(Math.pow(a, e)), "C'est f(" + a + ").")] }); },
],
3: [
() => { const A = [["0", [1, 0], [0, 0]], ["\\frac{\\pi}{2}", [0, 0], [1, 0]], ["\\pi", [-1, 0], [0, 0]], ["\\frac{\\pi}{3}", [0.5, 0], [0, 0.5]], ["\\frac{\\pi}{6}", [0, 0.5], [0.5, 0]]];
const [xt, cz, si] = pk(A), a = nz(-5, 5), b = nz(-5, 5);
const p = a * cz[0] - b * si[0], q = a * cz[1] - b * si[1], v = r6(p + q * Math.sqrt(3)), fv = r6(a * (si[0] + si[1] * Math.sqrt(3)) + b * (cz[0] + cz[1] * Math.sqrt(3)));
return QN("Soit " + M("f(x) = " + co(a) + "\\sin x" + (b < 0 ? " - " : " + ") + (Math.abs(b) === 1 ? "" : Math.abs(b)) + "\\cos x") + " (" + M("x") + " en radians). Calcule " + M("f'\\left(" + xt + "\\right)") + " (valeur exacte).", v,
M("f'(x) = " + co(a) + "\\cos x" + (b < 0 ? " + " : " - ") + (Math.abs(b) === 1 ? "" : Math.abs(b)) + "\\sin x") + ", donc " + M("f'\\left(" + xt + "\\right) = " + sq3(p, q)) + ".",
{ ctx: "trigo-valeur", guide: [GX(M("f'(x)") + " ? (tape cos(x) et sin(x))", a + "*cos(x)" + sgS(-b) + "*sin(x)", M("f'(x) = " + co(a) + "\\cos x" + (b < 0 ? " + " : " - ") + co(Math.abs(b)) + "\\sin x") + "."), GS(M("f'\\left(" + xt + "\\right)") + " ?", v, M(sq3(p, q)) + ".")],
traps: [TR(r6(a * (cz[0] + cz[1] * Math.sqrt(3)) + b * (si[0] + si[1] * Math.sqrt(3))), "(cos x)' = −sin x : attention au signe."), TR(fv, "C'est f, pas f' : dérive d'abord."), TR(r6(-v), "(sin x)' = cos x et (cos x)' = −sin x : un seul signe moins.")] }); },
() => { const fn = pk(["sin", "cos"]), a = pk([2, 3, 4, 5, -2, -3]), k = nz(-4, 4), n = R.int(2, 4), c = k * n;
const ans = (fn === "sin" ? a + "*cos(x)" : -a + "*sin(x)") + (c < 0 ? " - " : " + ") + mS(Math.abs(c), n - 1);
const ansT = (fn === "sin" ? a + "\\cos x" : -a + "\\sin x") + sg(c) + (n - 1 === 1 ? "x" : "x^{" + (n - 1) + "}");
return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = " + a + "\\" + fn + " x" + (k < 0 ? " - " : " + ") + co(Math.abs(k)) + "x^{" + n + "}") + ". Tape " + M("\\sin") + " et " + M("\\cos") + " avec des parenthèses : « cos(x) ».", ans, M("f'(x) = " + ansT) + ".",
{ ctx: "trigo-" + fn, guide: [GX("Dérivée de " + M(a + "\\" + fn + " x") + " ?", fn === "sin" ? a + "*cos(x)" : -a + "*sin(x)", M(fn === "sin" ? a + "\\cos x" : -a + "\\sin x") + "."), GX(M("f'(x)") + " ?", ans, M(ansT) + ".")],
traps: [TX((fn === "sin" ? -a + "*cos(x)" : a + "*sin(x)") + sgS(c) + "*x^" + (n - 1), fn === "sin" ? "(sin x)' = cos x, sans signe moins." : "(cos x)' = −sin x : le signe moins manque."), TX((fn === "sin" ? a + "*cos(x)" : -a + "*sin(x)") + sgS(k) + "*x^" + (n - 1), "(xⁿ)' = n·xⁿ⁻¹ : facteur " + n + ".")] }); },
() => { const n = R.int(2, 4), a = pk([2, 3, -2, -3, 4, 5]), V = a * n * 2 ** (n - 1);
return QN("Pour " + M("f(x) = a \\cdot x^{" + n + "}") + ", on sait que " + M("f'(2) = " + V) + ". Que vaut " + M("a") + " ?", a, M("f'(x) = " + n + "a x^{" + (n - 1) + "}") + ", donc " + M("f'(2) = " + n * 2 ** (n - 1) + "a = " + V) + " : " + M("a = " + a) + ".",
{ ctx: "coefficient", guide: [GX(M("f'(x)") + " (avec la lettre " + M("a") + ") ?", n + "*a*x^" + (n - 1), M(n + "a x^{" + (n - 1) + "}") + "."), GS(M("f'(2)") + " vaut combien de fois " + M("a") + " ?", n * 2 ** (n - 1), M(n + " \\cdot 2^{" + (n - 1) + "} = " + n * 2 ** (n - 1)) + "."), GS(M("a") + " ?", a, M(a) + ".")],
traps: [TR(V / 2 ** n, "On utilise f'(2), pas f(2) : f'(2) = " + n * 2 ** (n - 1) + "a."), TR(V / 2 ** (n - 1), "N'oublie pas le facteur " + n + " de la dérivée.")] }); },
],
};


const DG = {
1: [
() => { const a = nz(-6, 6), b = nz(-9, 9), c = nz(-9, 9), cs = [a, b, c], d = dP(cs); if (Math.abs(a) === 1 && R.rand() < 0.5) return null;
return QX("Donne " + M("f'(x)") + " pour " + ftex(cs) + ".", tp(d), M("f'(x) = " + P2(d)) + " : " + M("(x^2)' = 2x") + ", " + M("(x)' = 1") + ", la constante disparaît.",
{ ctx: "degre2", guide: [GX("Dérivée de " + M(mT(a, 2)) + " ?", mS(2 * a, 1), M(mT(2 * a, 1)) + "."), GX(M("f'(x)") + " ?", tp(d), M(P2(d)) + ".")],
traps: [TX(tp([2 * a, b, c]), "La dérivée d'une constante est 0."), TX(tp([a, b]), "(x²)' = 2x : le coefficient double."), TX(tp([2 * a, 0]), "Le terme " + b + "x a pour dérivée " + b + ".")] }); },
() => { const cs = [nz(-4, 4), nz(-6, 6), nz(-9, 9), R.int(-9, 9)], d = dP(cs);
return QX("Donne " + M("f'(x)") + " pour " + ftex(cs) + ".", tp(d), M("f'(x) = " + P2(d)) + " (chaque terme se dérive séparément).",
{ ctx: "degre3", guide: [GX("Dérivée de " + M(mT(cs[0], 3)) + " ?", mS(3 * cs[0], 2), M(mT(3 * cs[0], 2)) + "."), GX(M("f'(x)") + " ?", tp(d), M(P2(d)) + ".")],
traps: [TX(tp([3 * cs[0], 2 * cs[1], cs[2], cs[3]]), "La dérivée d'une constante est 0."), TX(tp([cs[0], cs[1], cs[2]]), "L'exposant descend devant : (x³)' = 3x²."), TX(tp([3 * cs[0], 2 * cs[1], 0]), "Le terme " + cs[2] + "x a pour dérivée " + cs[2] + ".")] }); },
() => { const cs = [nz(-3, 3), R.int(-5, 5), nz(-6, 6), R.int(-9, 9)], x0 = nz(-3, 3), d = dP(cs), v = pv(d, x0);
return QN("Pour " + ftex(cs) + ", calcule " + M("f'(" + x0 + ")") + ".", v, M("f'(x) = " + P2(d)) + ", " + M("f'(" + x0 + ") = " + v) + ".",
{ ctx: "valeur-poly", guide: [GX(M("f'(x)") + " ?", tp(d), M(P2(d)) + "."), GS(M("f'(" + x0 + ")") + " ?", v, M(v) + ".")],
traps: [TR(pv(cs, x0), "C'est f(" + x0 + ") : dérive d'abord."), TR(pv([cs[0], cs[1], cs[2]], x0), "Dérive chaque terme : (x³)' = 3x², (x²)' = 2x.")] }); },
],
2: [
() => { const a = nz(-4, 4), n = R.int(3, 5), b = pk([2, 3, 4, 5, -2, -3, -6]), c = R.int(-6, 6), d1 = mS(n * a, n - 1), ans = d1 + sgS(-b) + "/x^2";
const fT0 = mT(a, n) + (b < 0 ? " - " : " + ") + "\\frac{" + Math.abs(b) + "}{x}" + (c ? sg(c) : ""), dT = mT(n * a, n - 1) + (b > 0 ? " - " : " + ") + "\\frac{" + Math.abs(b) + "}{x^2}";
return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = " + fT0) + ".", ans, M("\\left(\\frac{1}{x}\\right)' = -\\frac{1}{x^2}") + " : " + M("f'(x) = " + dT) + ".",
{ ctx: "puissance-inverse", guide: [GX("Dérivée de " + M("\\frac{" + b + "}{x}") + " ?", fS(-b) + "/x^2", M("\\frac{" + -b + "}{x^2}") + "."), GX(M("f'(x)") + " ?", ans, M(dT) + ".")],
traps: [TX(d1 + sgS(b) + "/x^2", "(1/x)' = −1/x² : signe moins."), TX(d1, "Le terme " + b + "/x se dérive aussi."), TX(d1 + sgS(b) + "*ln(x)", "On dérive, on ne cherche pas de primitive.")] }); },
() => { const p = nz(-6, 6), q = nz(-6, 6); if (p + q === 0) return null; const e = [1, p + q, p * q];
return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = (" + lin(1, p) + ")(" + lin(1, q) + ")") + ". (Développe d'abord.)", tp(dP(e)), M("f(x) = " + P2(e)) + ", donc " + M("f'(x) = " + P2(dP(e))) + ".",
{ ctx: "developper", guide: [GX("Forme développée de " + M("f(x)") + " ?", tp(e), M(P2(e)) + "."), GX(M("f'(x)") + " ?", tp(dP(e)), M(P2(dP(e))) + ".")],
traps: [TX("1", "La dérivée d'un produit n'est pas le produit des dérivées (1 · 1)."), TX("2x", "Le terme " + (p + q) + "x donne " + (p + q) + "."), TX(tp([2, p + q, p * q]), "Le terme constant " + p * q + " disparaît.")] }); },
() => { const k = pk([1, 2]), a = nz(-4, 4), b = nz(-6, 6), c = k === 1 ? nz(-5, 5) : 0, red = k === 1 ? [a, b, c] : [a, b], num = red.concat(k === 1 ? [0] : [0, 0]), dd = dP(red), denT = k === 1 ? "x" : "x^2";
return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = \\frac{" + P2(num) + "}{" + denT + "}") + " (" + M("x \\neq 0") + "). Simplifie d'abord la fraction.", tp(dd), M("f(x) = " + P2(red)) + ", donc " + M("f'(x) = " + P2(dd)) + ".",
{ ctx: "simplifier-" + k, guide: [GX("Forme simplifiée de " + M("f(x)") + " ?", tp(red), M(P2(red)) + "."), GX(M("f'(x)") + " ?", tp(dd), M(P2(dd)) + ".")],
traps: [TX(tp(dP(num)), "On ne dérive pas le numérateur seul : simplifie d'abord par " + (k === 1 ? "x" : "x²") + "."), TX(tp(red), "Il reste à dériver.")] }); },
],
3: [
() => { const x0 = pk([1, 2, 3, -1, -2]), k = pk([-5, -4, -3, -2, 2, 3, 4, 5]), m = -3 * x0 * x0 - 2 * k * x0; if (!m) return null;
return QN("Soit " + M("f(x) = x^3 + kx^2" + sg(m) + "x") + ". Pour quelle valeur de " + M("k") + " la tangente au point d'abscisse " + M(x0) + " est-elle horizontale ?", k, M("f'(x) = 3x^2 + 2kx" + sg(m)) + " ; " + M("f'(" + x0 + ") = " + 3 * x0 * x0 + (x0 < 0 ? " - " : " + ") + Math.abs(2 * x0) + "k" + sg(m) + " = 0") + " donne " + M("k = " + k) + ".",
{ ctx: "parametre", guide: [GX(M("f'(x)") + " (avec la lettre " + M("k") + ") ?", "3x^2 + 2*k*x" + sgS(m), M("3x^2 + 2kx" + sg(m)) + "."), GS("Tangente horizontale : " + M("f'(" + x0 + ") = 0") + ". Valeur de " + M("k") + " ?", k, M("k = " + k) + ".")],
traps: [TR(-k, "Vérifie le signe en résolvant f'(" + x0 + ") = 0."), TR(-(x0 ** 3 + m * x0) / (x0 * x0), "On veut f'(" + x0 + ") = 0 (pente nulle), pas f(" + x0 + ") = 0.")] }); },
() => { let r1 = nz(-4, 3), r2 = r1 + pk([2, 4, 6]); const b = -3 * (r1 + r2) / 2, mm = nz(-6, 6), c = 3 * r1 * r2 + mm, d = R.int(-5, 5), cs = [1, b, c, d];
return QSet("En quelles abscisses la tangente au graphe de " + ftex(cs) + " a-t-elle une pente égale à " + M(mm) + " ? Sépare les réponses par « ; ».", [r1, r2], M("f'(x) = " + P2(dP(cs)) + " = " + mm) + " ⟺ " + M(P2([3, 2 * b, c - mm]) + " = 0 ⟺ 3(x" + sg(-r1) + ")(x" + sg(-r2) + ") = 0") + " : " + M("x = " + r1) + " ou " + M("x = " + r2) + ".",
{ ctx: "pente-donnee", guide: [GX(M("f'(x)") + " ?", tp(dP(cs)), M(P2(dP(cs))) + "."), GSet("Résous " + M("f'(x) = " + mm) + ".", [r1, r2], M(r1) + " et " + M(r2) + ".")],
traps: [TSt([-r1, -r2], "Vérifie les signes : 3(x − r₁)(x − r₂) s'annule en r₁ et r₂."), TSt([r1], "Il y a deux solutions."), TSt([r2], "Il y a deux solutions.")] }); },
() => { const k = R.int(2, 5), a = pk([1, 2]), b = 3 * a * k, o = pk(["Un drone de livraison", "Une montgolfière", "Une fusée à eau"]);
return QN(o + " monte selon " + M("h(t) = " + P2([-a, b, 0, 0], "t")) + " mètres (" + M("t") + " en secondes, pendant la montée). À quel instant sa vitesse verticale " + M("v(t) = h'(t)") + " est-elle maximale ?", k, M("v(t) = " + P2([-3 * a, 2 * b, 0], "t")) + ", " + M("v'(t) = " + P2([-6 * a, 2 * b], "t") + " = 0") + " pour " + M("t = " + k) + " s.",
{ ctx: "vitesse-max", guide: [GX(M("v(t) = h'(t)") + " ?", tp([-3 * a, 2 * b, 0], "t"), M(P2([-3 * a, 2 * b, 0], "t")) + "."), GX("Pour son maximum, dérive encore : " + M("v'(t)") + " ?", tp([-6 * a, 2 * b], "t"), M(P2([-6 * a, 2 * b], "t")) + "."), GS(M("v'(t) = 0") + " pour " + M("t") + " = ?", k, M(k) + " s.")],
traps: [TR(2 * k, "À t = " + 2 * k + " s, la vitesse est nulle (sommet de la montée) ; on cherche quand elle est maximale."), TR(3 * k, "h(" + 3 * k + ") = 0 : c'est le retour au sol, pas le maximum de la vitesse.")] }); },
],
};


const PQ = {
1: [
() => { const a = nz(-5, 5), b = nz(-6, 6), c = nz(-5, 5), d = nz(-6, 6); if (a * d === b * c) return null; const e = [2 * a * c, a * d + b * c];
return QX("Avec la règle du produit, donne " + M("f'(x)") + " pour " + M("f(x) = (" + lin(a, b) + ")(" + lin(c, d) + ")") + ".", tp(e), M("(uv)' = u'v + uv'") + " : " + M(a + "(" + lin(c, d) + ") + " + par(c) + "(" + lin(a, b) + ") = " + P2(e)) + ".",
{ ctx: "produit-affines", guide: [GS(M("u = " + lin(a, b)) + " : " + M("u'") + " ?", a, M(a) + "."), GS(M("v = " + lin(c, d)) + " : " + M("v'") + " ?", c, M(c) + "."), GX(M("f'(x) = u'v + uv'") + " ?", tp(e), M(P2(e)) + ".")],
traps: [TX(String(a * c), "La dérivée d'un produit n'est pas u' · v'."), TX(tp([a * c, a * d]), "Il manque le terme u · v'."), TX(tp([a * c, b * c]), "Il manque le terme u' · v.")] }); },
() => { const n = R.int(2, 3), a = nz(-4, 4), b = nz(-5, 5), x0 = pk([-2, -1, 1, 2]), u = x0 ** n, du = n * x0 ** (n - 1), w = a * x0 + b, v = du * w + u * a;
return QN("Pour " + M("f(x) = x^{" + n + "}(" + lin(a, b) + ")") + ", calcule " + M("f'(" + x0 + ")") + " avec la règle du produit.", v, M("f'(x) = " + n + mT(1, n - 1) + "(" + lin(a, b) + ") + " + (a === 1 ? "" : par(a)) + "x^{" + n + "}") + " ; " + M("f'(" + x0 + ") = " + du + " \\cdot " + par(w) + " + " + par(u) + " \\cdot " + par(a) + " = " + v) + ".",
{ ctx: "produit-valeur", guide: [GS(M("u'(" + x0 + ")") + " avec " + M("u = x^{" + n + "}") + " ?", du, M(du) + "."), GS(M("v(" + x0 + ")") + " ?", w, M(w) + "."), GS(M("u'v + uv'") + " en " + M(x0) + " ?", v, M(v) + ".")],
traps: [TR(du * a, "La dérivée d'un produit n'est pas u' · v'."), TR(du * w, "Il manque le terme u · v'."), TR(u * w, "C'est f(" + x0 + ").")] }); },
() => { const a = nz(-5, 5), b = nz(-6, 6), ans = -a + "/(" + linS(a, b) + ")^2";
return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = \\frac{1}{" + lin(a, b) + "}") + ".", ans, M("\\left(\\frac{1}{v}\\right)' = -\\frac{v'}{v^2}") + " : " + M("f'(x) = \\frac{" + -a + "}{(" + lin(a, b) + ")^2}") + ".",
{ ctx: "inverse-affine", guide: [GS(M("v'") + " avec " + M("v = " + lin(a, b)) + " ?", a, M(a) + "."), GX(M("f'(x) = -\\frac{v'}{v^2}") + " ?", ans, M("\\frac{" + -a + "}{(" + lin(a, b) + ")^2}") + ".")],
traps: [TX(a + "/(" + linS(a, b) + ")^2", "Il y a un signe moins : (1/v)' = −v'/v²."), TX("-1/(" + linS(a, b) + ")^2", "N'oublie pas v' = " + a + " au numérateur."), TX("1/" + a, "On ne dérive pas le dénominateur seul.")] }); },
],
2: [
() => { const a = nz(-4, 4), b = nz(-6, 6), c = pk([1, 1, 2, -1]), d = nz(-6, 6), N = a * d - b * c; if (!N) return null; const ans = N + "/(" + linS(c, d) + ")^2";
return QX("Avec la règle du quotient, donne " + M("f'(x)") + " pour " + M("f(x) = \\frac{" + lin(a, b) + "}{" + lin(c, d) + "}") + ".", ans, M("\\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2}") + " : numérateur " + M(a + "(" + lin(c, d) + ") - " + par(c) + "(" + lin(a, b) + ") = " + N) + ", donc " + M("f'(x) = \\frac{" + N + "}{(" + lin(c, d) + ")^2}") + ".",
{ ctx: "quotient-affines", guide: [GS("Numérateur " + M("u'v - uv'") + " (il ne contient plus de " + M("x") + ") ?", N, M(N) + "."), GX(M("f'(x)") + " ?", ans, M("\\frac{" + N + "}{(" + lin(c, d) + ")^2}") + ".")],
traps: [TX((a * d + b * c) + "/(" + linS(c, d) + ")^2", "Au numérateur, u'v − uv' : un moins."), TX((-N) + "/(" + linS(c, d) + ")^2", "L'ordre compte : u'v − uv', pas uv' − u'v."), TX(fS(a / c), "La dérivée d'un quotient n'est pas u'/v'.")] }); },
() => { const p = nz(-5, 6), r = R.int(2, 5), x0 = r * r; if (x0 + p === 0) return null; const v = r6(r + (x0 + p) / (2 * r));
return QN("Pour " + M("f(x) = (" + lin(1, p) + ")\\sqrt{x}") + ", calcule " + M("f'(" + x0 + ")") + ".", v, M("f'(x) = \\sqrt{x} + \\frac{" + lin(1, p) + "}{2\\sqrt{x}}") + " ; " + M("f'(" + x0 + ") = " + r + " + \\frac{" + (x0 + p) + "}{" + 2 * r + "} = " + fT(v)) + ".",
{ ctx: "produit-racine", guide: [GS(M("u'v") + " en " + M(x0) + " (" + M("u = " + lin(1, p)) + ", " + M("v = \\sqrt{x}") + ") ?", r, M("1 \\cdot " + r + " = " + r) + "."), GS(M("uv'") + " en " + M(x0) + " ?", r6((x0 + p) / (2 * r)), M("\\frac{" + (x0 + p) + "}{" + 2 * r + "}") + "."), GS("Somme ?", v, M(fT(v)) + ".")],
traps: [TR(1 / (2 * r), "La dérivée d'un produit n'est pas u' · v'."), TR(r, "Il manque le terme u · v'."), TR(r6(r + (x0 + p) / r), "(√x)' = 1/(2√x) : facteur 2.")] }); },
() => { const a = nz(-4, 4), x0 = nz(-4, 4); if (x0 + a === 0) return null; const v = (x0 * (x0 + 2 * a)) / ((x0 + a) ** 2); if (!v) return null;
return QN("Pour " + M("f(x) = \\frac{x^2}{" + lin(1, a) + "}") + ", calcule " + M("f'(" + x0 + ")") + ".", v, M("f'(x) = \\frac{2x(" + lin(1, a) + ") - x^2}{(" + lin(1, a) + ")^2} = \\frac{" + P2([1, 2 * a, 0]) + "}{(" + lin(1, a) + ")^2}") + " ; " + M("f'(" + x0 + ") = " + fT(v)) + ".",
{ ctx: "quotient-valeur", guide: [GS("Numérateur " + M("u'v - uv'") + " en " + M(x0) + " ?", x0 * (x0 + 2 * a), M(2 * x0 + " \\cdot " + par(x0 + a) + " - " + x0 * x0 + " = " + x0 * (x0 + 2 * a)) + "."), GS(M("v^2") + " en " + M(x0) + " ?", (x0 + a) ** 2, M((x0 + a) ** 2) + "."), GS(M("f'(" + x0 + ")") + " ?", v, M(fT(v)) + ".")],
traps: [TR(2 * x0, "La dérivée d'un quotient n'est pas u'/v'."), TR((2 * x0 * (x0 + a) + x0 * x0) / (x0 + a) ** 2, "Au numérateur, u'v − uv' : un moins."), TR(x0 * (x0 + 2 * a), "N'oublie pas de diviser par v².")] }); },
],
3: [
() => { const a = nz(-6, 6), b = nz(-5, 5); if (b * b + a === 0) return null; const ans = "(" + tp([1, 2 * b, -a]) + ")/(" + linS(1, b) + ")^2";
return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = \\frac{" + P2([1, 0, a]) + "}{" + lin(1, b) + "}") + ". Écris une seule fraction.", ans, M("f'(x) = \\frac{2x(" + lin(1, b) + ") - (" + P2([1, 0, a]) + ")}{(" + lin(1, b) + ")^2} = \\frac{" + P2([1, 2 * b, -a]) + "}{(" + lin(1, b) + ")^2}") + ".",
{ ctx: "quotient-degre2", guide: [GX("Numérateur " + M("u'v - uv'") + " développé ?", tp([1, 2 * b, -a]), M(P2([1, 2 * b, -a])) + "."), GX(M("f'(x)") + " ?", ans, M("\\frac{" + P2([1, 2 * b, -a]) + "}{(" + lin(1, b) + ")^2}") + ".")],
traps: [TX("(" + tp([1, 2 * b, a]) + ")/(" + linS(1, b) + ")^2", "uv' se soustrait en entier : −(x² " + (a < 0 ? "− " + -a : "+ " + a) + ")."), TX("2x", "La dérivée d'un quotient n'est pas u'/v'."), TX("(" + tp([3, 2 * b, a]) + ")/(" + linS(1, b) + ")^2", "Au numérateur, u'v − uv' : un moins.")] }); },
() => { const s = R.int(1, 5), k = s * s, c = pk([1, 2, 3]);
return QSet("En quelles abscisses la tangente au graphe de " + M("f(x) = \\frac{" + (c === 1 ? "" : c) + "x}{x^2 + " + k + "}") + " est-elle horizontale ?", [-s, s], M("f'(x) = \\frac{" + c + "(x^2 + " + k + ") - " + c + "x \\cdot 2x}{(x^2 + " + k + ")^2} = \\frac{" + c + "(" + k + " - x^2)}{(x^2 + " + k + ")^2}") + " ; nul pour " + M("x^2 = " + k) + ", soit " + M("x = -" + s) + " ou " + M("x = " + s) + ".",
{ ctx: "tangentes-horizontales", guide: [GX("Numérateur de " + M("f'(x)") + " (développé) ?", tp([-c, 0, c * k]), M(P2([-c, 0, c * k])) + "."), GSet("Il s'annule pour ?", [-s, s], M("x = \\pm " + s) + ".")],
traps: [TSt([0], "x = 0 annule f (le numérateur de f), pas f'."), TSt([s], "x² = " + k + " a deux solutions."), TSt([-k, k], "x² = " + k + " : prends la racine.")] }); },
() => { const s = R.int(2, 6), b = s * s, a = pk([10, 12, 20, 30, 40]), ask = pk(["t", "C"]), Cm = r6(a / (2 * s));
return QN("Après une prise de médicament, la concentration dans le sang vaut " + M("C(t) = \\frac{" + a + "t}{t^2 + " + b + "}") + " (mg/L, " + M("t") + " en heures). " + (ask === "t" ? "Après combien d'heures la concentration est-elle maximale ?" : "Quelle est la concentration maximale (en mg/L) ?"), ask === "t" ? s : Cm,
M("C'(t) = \\frac{" + a + "(" + b + " - t^2)}{(t^2 + " + b + ")^2}") + " : positive avant " + M("t = " + s) + ", négative après. Maximum en " + M("t = " + s) + " h : " + M("C(" + s + ") = \\frac{" + a * s + "}{" + 2 * b + "} = " + fT(Cm)) + " mg/L.",
{ ctx: "medicament-" + ask, guide: [GX("Numérateur de " + M("C'(t)") + " (en " + M("t") + ") ?", tp([-a, 0, a * b], "t"), M(P2([-a, 0, a * b], "t")) + "."), GS("Instant où " + M("C'(t) = 0") + " (" + M("t > 0") + ") ?", s, M(s) + " h.")].concat(ask === "C" ? [GS(M("C(" + s + ")") + " ?", Cm, M(fT(Cm)) + " mg/L.")] : []),
traps: ask === "t" ? [TR(b, "C'(t) = 0 pour t² = " + b + " : prends la racine."), TR(Cm, "C'est la concentration maximale, pas l'instant.")] : [TR(s, "C'est l'instant du maximum ; calcule C(" + s + ")."), TR(r6(a / s), "C(" + s + ") = " + a * s + "/(" + s * s + " + " + b + ").")] }); },
],
};


const DC = {
1: [
() => { const a = pk([2, 3, 4, 5, -2, -3]), b = nz(-7, 7), n = R.int(2, 6), c = n * a, ans = c + "*" + pw(linS(a, b), n - 1);
return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = (" + lin(a, b) + ")^{" + n + "}") + ". (Laisse la parenthèse.)", ans, M("(u^n)' = n u^{n - 1} \\cdot u'") + " : " + M("f'(x) = " + n + " \\cdot " + par(a) + " \\cdot " + pwT(lin(a, b), n - 1) + " = " + c + pwT(lin(a, b), n - 1)) + ".",
{ ctx: "puissance-affine", guide: [GS("Dérivée de l'intérieur " + M("u = " + lin(a, b)) + " ?", a, M(a) + "."), GX(M("f'(x) = n u^{n-1} \\cdot u'") + " ?", ans, M(c + pwT(lin(a, b), n - 1)) + ".")],
traps: [TX(n + "*" + pw(linS(a, b), n - 1), "Multiplie par la dérivée de l'intérieur : " + a + "."), TX(c + "*" + pw(linS(a, b), n), "L'exposant diminue de 1."), TX(String(c), "On dérive l'extérieur en gardant l'intérieur : (" + n + "u^" + (n - 1) + ") · u'.")] }); },
() => { const a = pk([2, 3, 4, 5, 6]), r = R.int(2, 6), x0 = nz(-4, 6), b = r * r - a * x0, v = a / (2 * r);
return QN("Pour " + M("f(x) = \\sqrt{" + lin(a, b) + "}") + ", calcule " + M("f'(" + x0 + ")") + ".", v, M("f'(x) = \\frac{" + a + "}{2\\sqrt{" + lin(a, b) + "}}") + " ; en " + M(x0) + " : " + M("\\frac{" + a + "}{2 \\cdot " + r + "} = " + fT(v)) + ".",
{ ctx: "racine-affine", guide: [GS("Intérieur " + M("u(" + x0 + ")") + " ?", r * r, M(r * r) + "."), GS(M("\\sqrt{u(" + x0 + ")}") + " ?", r, M(r) + "."), GS(M("f'(" + x0 + ") = \\frac{u'}{2\\sqrt{u}}") + " ?", v, M(fT(v)) + ".")],
traps: [TR(1 / (2 * r), "Multiplie par u' = " + a + "."), TR(a / r, "(√u)' = u'/(2√u) : facteur 2."), TR(r, "C'est f(" + x0 + ").")] }); },
() => { const fn = pk(["sin", "cos"]), k = pk([2, 3, 4, 5, -2, -3]), ans = fn === "sin" ? k + "*cos(" + k + "x)" : -k + "*sin(" + k + "x)";
return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = \\" + fn + "(" + k + "x)") + ". Tape par exemple « 3cos(3x) ».", ans, M("f'(x) = " + (fn === "sin" ? k + "\\cos(" + k + "x)" : -k + "\\sin(" + k + "x)")) + " : on multiplie par la dérivée de l'intérieur, " + M(k) + ".",
{ ctx: "trigo-" + fn, guide: [GS("Dérivée de l'intérieur " + M(k + "x") + " ?", k, M(k) + "."), GX(M("f'(x)") + " ?", ans, M(fn === "sin" ? k + "\\cos(" + k + "x)" : -k + "\\sin(" + k + "x)") + ".")],
traps: [TX(fn === "sin" ? "cos(" + k + "x)" : "-sin(" + k + "x)", "Multiplie par la dérivée de l'intérieur : " + k + "."), TX(fn === "sin" ? k + "*cos(x)" : -k + "*sin(x)", "L'intérieur " + k + "x reste dans la fonction."), TX(fn === "sin" ? -k + "*cos(" + k + "x)" : k + "*sin(" + k + "x)", fn === "sin" ? "(sin u)' = u'·cos u, sans signe moins." : "(cos u)' = −u'·sin u.")] }); },
],
2: [
() => { const a = nz(-6, 6), n = R.int(2, 5), ans = 2 * n + "x*" + pw(tp([1, 0, a]), n - 1);
return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = (" + P2([1, 0, a]) + ")^{" + n + "}") + ". (Laisse la parenthèse.)", ans, M("f'(x) = " + n + pwT(P2([1, 0, a]), n - 1) + " \\cdot 2x = " + 2 * n + "x" + pwT(P2([1, 0, a]), n - 1)) + ".",
{ ctx: "puissance-carre", guide: [GX("Dérivée de l'intérieur " + M("u = " + P2([1, 0, a])) + " ?", "2x", M("2x") + "."), GX(M("f'(x)") + " ?", ans, M(2 * n + "x" + pwT(P2([1, 0, a]), n - 1)) + ".")],
traps: [TX(n + "*" + pw(tp([1, 0, a]), n - 1), "Multiplie par u' = 2x."), TX(2 * n + "x*" + pw(tp([1, 0, a]), n), "L'exposant diminue de 1."), TX(n + "*(2x)^" + (n - 1), "On garde l'intérieur x² " + (a < 0 ? "− " + -a : "+ " + a) + " entier.")] }); },
() => { const a = pk([2, 3, -2, -3, 4]), b = nz(-6, 6), k = pk([2, 3]), ans = -k * a + "/(" + linS(a, b) + ")^" + (k + 1);
return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = \\frac{1}{(" + lin(a, b) + ")^{" + k + "}}") + ".", ans, M("f(x) = (" + lin(a, b) + ")^{-" + k + "}") + ", " + M("f'(x) = -" + k + " \\cdot " + par(a) + "(" + lin(a, b) + ")^{-" + (k + 1) + "} = \\frac{" + -k * a + "}{(" + lin(a, b) + ")^{" + (k + 1) + "}}") + ".",
{ ctx: "inverse-puissance", guide: [GS("Écris " + M("f(x) = u^{p}") + " : exposant " + M("p") + " ?", -k, M(-k) + "."), GX(M("f'(x)") + " ?", ans, M("\\frac{" + -k * a + "}{(" + lin(a, b) + ")^{" + (k + 1) + "}}") + ".")],
traps: [TX(-k + "/(" + linS(a, b) + ")^" + (k + 1), "Multiplie par u' = " + a + "."), TX(k * a + "/(" + linS(a, b) + ")^" + (k + 1), "L'exposant −" + k + " descend : signe moins."), TX(-k * a + "/(" + linS(a, b) + ")^" + k, "L'exposant devient −" + (k + 1) + ".")] }); },
() => { const [x1, r] = pk([[3, 5], [4, 5], [6, 10], [8, 10], [5, 13], [12, 13], [8, 17], [15, 17]]), x0 = x1 * pk([1, -1]), a = r * r - x1 * x1, v = x0 / r;
return QN("Pour " + M("f(x) = \\sqrt{x^2 + " + a + "}") + ", calcule " + M("f'(" + x0 + ")") + ".", v, M("f'(x) = \\frac{2x}{2\\sqrt{x^2 + " + a + "}} = \\frac{x}{\\sqrt{x^2 + " + a + "}}") + " ; " + M("f'(" + x0 + ") = \\frac{" + x0 + "}{" + r + "}") + ".",
{ ctx: "racine-carre", guide: [GS(M("u(" + x0 + ")") + " avec " + M("u = x^2 + " + a) + " ?", r * r, M(r * r) + "."), GS(M("u'(" + x0 + ")") + " ?", 2 * x0, M(2 * x0) + "."), GS(M("f'(" + x0 + ") = \\frac{u'}{2\\sqrt{u}}") + " ?", v, M(fT(v)) + ".")],
traps: [TR(1 / (2 * r), "Multiplie par u' = 2x."), TR(2 * x0 / r, "(√u)' = u'/(2√u) : le 2 se simplifie."), TR(r, "C'est f(" + x0 + ").")] }); },
],
3: [
() => { const p = nz(-3, 3), n = R.int(2, 3), x0 = nz(-2, 3); if (x0 === p) return null; const v = (x0 - p) ** n + n * x0 * (x0 - p) ** (n - 1); if (!v) return null;
return QN("Pour " + M("f(x) = x(" + lin(1, -p) + ")^{" + n + "}") + ", calcule " + M("f'(" + x0 + ")") + " (produit et composée).", v, M("f'(x) = (" + lin(1, -p) + ")^{" + n + "} + " + n + "x" + pwT(lin(1, -p), n - 1)) + " ; " + M("f'(" + x0 + ") = " + (x0 - p) ** n + sg(n * x0 * (x0 - p) ** (n - 1)) + " = " + v) + ".",
{ ctx: "produit-composee", guide: [GS(M("u'v") + " en " + M(x0) + " (" + M("u = x") + ", " + M("v = " + pwT(lin(1, -p), n)) + ") ?", (x0 - p) ** n, M((x0 - p) ** n) + "."), GS(M("uv'") + " en " + M(x0) + " ?", n * x0 * (x0 - p) ** (n - 1), M(n * x0 * (x0 - p) ** (n - 1)) + "."), GS("Somme ?", v, M(v) + ".")],
traps: [TR(n * x0 * (x0 - p) ** (n - 1), "Il manque le terme u' · v = (x − " + p + ")^" + n + "."), TR((x0 - p) ** n, "Il manque le terme u · v'."), TR(n * (x0 - p) ** (n - 1), "La dérivée d'un produit n'est pas u' · v'.")] }); },
() => { const ctx = pk(["maree", "roue"]);
if (ctx === "maree") { const A = pk([2, 3, 4]), m = pk([3, 4, 5]), [t0, c] = pk([[0, 1], [2, 0.5], [4, -0.5], [6, -1], [8, -0.5], [10, 0.5]]), v = A * c * Math.PI / 6;
return QN("Dans un port, la hauteur d'eau vaut " + M("h(t) = " + m + " + " + A + "\\sin\\left(\\frac{\\pi t}{6}\\right)") + " mètres (" + M("t") + " en heures). À quelle vitesse (en m/h) l'eau monte-t-elle à " + M("t = " + t0) + " ? Valeur exacte (négative si elle descend).", v,
M("h'(t) = " + A + " \\cdot \\frac{\\pi}{6}\\cos\\left(\\frac{\\pi t}{6}\\right)") + " ; " + M("h'(" + t0 + ") = " + fT(A / 6) + "\\pi \\cdot " + par(c) + " = " + fT(A * c / 6) + "\\pi") + " m/h.",
{ ctx: "maree", guide: [GS("Dérivée de l'intérieur " + M("\\frac{\\pi t}{6}") + " (valeur exacte, tape pi) ?", Math.PI / 6, M("\\frac{\\pi}{6}") + "."), GS(M("\\cos\\left(\\frac{\\pi \\cdot " + t0 + "}{6}\\right)") + " ?", c, M(fT(c)) + "."), GS(M("h'(" + t0 + ")") + " ?", v, M(fT(A * c / 6) + "\\pi") + " m/h.")],
traps: [TR(A * c, "Multiplie par la dérivée de l'intérieur, π/6."), TR(-v, "(sin u)' = u' · cos u : vérifie le signe de cos."), TR(m + A * Math.sin(Math.PI * t0 / 6), "C'est la hauteur h(" + t0 + "), pas la vitesse.")] }); }
const R0 = pk([20, 25, 30]), [t0, s] = pk([[1, 0.5], [3, 1], [5, 0.5], [7, -0.5], [9, -1], [11, -0.5]]), v = R0 * s * Math.PI / 6;
return QN("Une cabine de grande roue est à la hauteur " + M("h(t) = " + (R0 + 2) + " - " + R0 + "\\cos\\left(\\frac{\\pi t}{6}\\right)") + " mètres (" + M("t") + " en minutes). À quelle vitesse verticale (en m/min) monte-t-elle à " + M("t = " + t0) + " ? Valeur exacte (négative si elle descend).", v,
M("h'(t) = " + R0 + " \\cdot \\frac{\\pi}{6}\\sin\\left(\\frac{\\pi t}{6}\\right)") + " ; " + M("h'(" + t0 + ") = " + fT(R0 / 6) + "\\pi \\cdot " + par(s) + " = " + fT(R0 * s / 6) + "\\pi") + " m/min.",
{ ctx: "grande-roue", guide: [GS(M("\\sin\\left(\\frac{\\pi \\cdot " + t0 + "}{6}\\right)") + " ?", s, M(fT(s)) + "."), GS(M("h'(" + t0 + ")") + " (tape pi) ?", v, M(fT(R0 * s / 6) + "\\pi") + " m/min.")],
traps: [TR(R0 * s, "Multiplie par la dérivée de l'intérieur, π/6."), TR(-v, "(−cos u)' = u' · sin u : le signe est +."), TR(R0 * Math.PI / 6 * Math.cos(Math.PI * t0 / 6), "La dérivée de cos est −sin, pas cos.")] }); },
() => { const a = pk([1, 2, 3, 4]), b = pk([1, 4, 9, 5, 2]), ans = (a === 1 ? "" : a) + "x/sqrt(" + tp([a, 0, b]) + ")";
return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = \\sqrt{" + P2([a, 0, b]) + "}") + ". Tape « sqrt(…) » pour la racine.", ans, M("f'(x) = \\frac{" + 2 * a + "x}{2\\sqrt{" + P2([a, 0, b]) + "}} = \\frac{" + (a === 1 ? "" : a) + "x}{\\sqrt{" + P2([a, 0, b]) + "}}") + ".",
{ ctx: "racine-expression", guide: [GX("Dérivée de l'intérieur " + M("u = " + P2([a, 0, b])) + " ?", mS(2 * a, 1), M(mT(2 * a, 1)) + "."), GX(M("f'(x) = \\frac{u'}{2\\sqrt{u}}") + " ?", ans, M("\\frac{" + (a === 1 ? "" : a) + "x}{\\sqrt{" + P2([a, 0, b]) + "}}") + ".")],
traps: [TX("1/(2*sqrt(" + tp([a, 0, b]) + "))", "Multiplie par u' = " + 2 * a + "x."), TX(2 * a + "x/sqrt(" + tp([a, 0, b]) + ")", "(√u)' = u'/(2√u) : le 2 se simplifie."), TX("sqrt(" + 2 * a + "x)", "On ne dérive pas sous la racine : (√u)' = u'/(2√u).")] }); },
],
};


const TG = {
1: [
() => { const a = pk([1, -1, 2, -2, 0.5]), b = R.int(-4, 4), c = R.int(-4, 4), x0 = nz(-3, 3), cs = [a, b, c], y0 = pv(cs, x0), m = 2 * a * x0 + b, p = y0 - m * x0; if (!m || !Number.isInteger(y0)) return null;
return QX("Donne l'équation de la tangente au graphe de " + ftex(cs) + " au point d'abscisse " + M(x0) + ". Réponds « y = … ».", tp([m, p]), M("f(" + x0 + ") = " + y0) + ", " + M("f'(" + x0 + ") = " + m) + " ; " + M("y = " + m + "(x - " + par(x0) + ")" + sg(y0) + " = " + P2([m, p])) + ".",
{ ctx: "parabole", fig: Math.abs(y0) <= 5 ? PL([{ f: quad(cs) }, { f: (x) => m * x + p, cls: "f-line", dash: true }], [[x0, y0, ""]]) : undefined, guide: [GS(M("f(" + x0 + ")") + " ?", y0, M(y0) + "."), GS(M("f'(" + x0 + ")") + " ?", m, M(m) + "."), GX("Tangente " + M("y = f'(x_0)(x - x_0) + f(x_0)") + " ?", tp([m, p]), M("y = " + P2([m, p])) + ".")],
traps: [TX(tp([m, y0]), "y = m(x − x₀) + f(x₀) : développe, l'ordonnée à l'origine n'est pas f(x₀)."), TX(tp([m, 0]), "Il manque l'ordonnée à l'origine."), TX(tp([m, y0 + m * x0]), "y = m(x − x₀) + f(x₀) : attention au signe de −m·x₀.")] }); },
() => { const x0 = nz(-4, 4), v = nz(-6, 6), m = nz(-5, 5), p = v - m * x0; if (!p) return null;
return QX("On sait que " + M("f(" + x0 + ") = " + v) + " et " + M("f'(" + x0 + ") = " + m) + ". Donne l'équation de la tangente au graphe de " + M("f") + " au point d'abscisse " + M(x0) + ". Réponds « y = … ».", tp([m, p]), M("y = " + m + "(x - " + par(x0) + ")" + sg(v) + " = " + P2([m, p])) + ".",
{ ctx: "donnees", guide: [GS("Pente de la tangente ?", m, M("f'(" + x0 + ") = " + m) + "."), GS("Ordonnée à l'origine " + M("p = f(x_0) - m x_0") + " ?", p, M(v + " - " + par(m) + " \\cdot " + par(x0) + " = " + p) + "."), GX("Tangente ?", tp([m, p]), M("y = " + P2([m, p])) + ".")],
traps: [TX(tp([m, v]), "La tangente passe par (" + x0 + " ; " + v + "), pas par (0 ; " + v + ")."), TX(tp([v, m]), "La pente est f'(" + x0 + ") = " + m + "."), TX(tp([m, v + m * x0]), "p = f(x₀) − m·x₀ : attention au signe.")] }); },
() => { const cs = [pk([1, -1, 2, -2]), R.int(-4, 4), R.int(-5, 5)], x0 = nz(-3, 3), y0 = pv(cs, x0), m = pv(dP(cs), x0), p = y0 - m * x0; if (!m || !p) return null;
return QN("Où la tangente au graphe de " + ftex(cs) + " au point d'abscisse " + M(x0) + " coupe-t-elle l'axe des " + M("y") + " ? Donne l'ordonnée.", p, "Tangente " + M("y = " + m + "(x - " + par(x0) + ")" + sg(y0) + " = " + P2([m, p])) + " : elle coupe l'axe des " + M("y") + " en " + M(p) + ".",
{ ctx: "ordonnee-origine", guide: [GS(M("f(" + x0 + ")") + " ?", y0, M(y0) + "."), GS(M("f'(" + x0 + ")") + " ?", m, M(m) + "."), GS("Valeur de la tangente en " + M("x = 0") + " ?", p, M(y0 + " - " + par(m) + " \\cdot " + par(x0) + " = " + p) + ".")],
traps: [TR(y0, "C'est l'ordonnée du point de contact, pas celle de l'intersection avec l'axe des y."), TR(cs[2], "C'est f(0) : la courbe coupe l'axe en " + cs[2] + ", la tangente ailleurs."), TR(m, "C'est la pente de la tangente.")] }); },
],
2: [
() => { const cs = [pk([1, -1, 2]), R.int(-3, 3), R.int(-5, 5), R.int(-5, 5)], x0 = nz(-2, 2), y0 = pv(cs, x0), m = pv(dP(cs), x0), p = y0 - m * x0; if (!m) return null;
return QX("Donne l'équation de la tangente au graphe de " + ftex(cs) + " au point d'abscisse " + M(x0) + ". Réponds « y = … ».", tp([m, p]), M("f(" + x0 + ") = " + y0) + ", " + M("f'(x) = " + P2(dP(cs))) + ", " + M("f'(" + x0 + ") = " + m) + " : " + M("y = " + P2([m, p])) + ".",
{ ctx: "cubique", guide: [GS(M("f(" + x0 + ")") + " ?", y0, M(y0) + "."), GS(M("f'(" + x0 + ")") + " ?", m, M(m) + "."), GX("Tangente ?", tp([m, p]), M("y = " + P2([m, p])) + ".")],
traps: [TX(tp([m, y0]), "y = m(x − x₀) + f(x₀) : développe."), TX(tp([m, y0 + m * x0]), "p = f(x₀) − m·x₀ : attention au signe."), TX(tp([y0, m]), "La pente est f'(" + x0 + ") = " + m + ".")] }); },
() => { const [r, ds] = pk([[5, [1, 2, 3, -1, -2]], [10, [1, 2, 3, 4, -1, -2, -3]], [4, [1, 2, -1, -2]], [20, [2, 4, -2, 6]]]), d = pk(ds), N = r * r, v = r6(r + d / (2 * r));
return QN("Avec l'approximation affine de " + M("f(x) = \\sqrt{x}") + " en " + M(N) + " (la tangente), donne une valeur approchée de " + M("\\sqrt{" + (N + d) + "}") + ".", v, M("f(" + (N + d) + ") \\approx f(" + N + ") + f'(" + N + ") \\cdot " + par(d) + " = " + r + " + \\frac{" + d + "}{" + 2 * r + "} = " + nb(v)) + ".",
{ ctx: "approx-racine", guide: [GS(M("f'(" + N + ") = \\frac{1}{2\\sqrt{" + N + "}}") + " ?", 1 / (2 * r), M("\\frac{1}{" + 2 * r + "}") + "."), GS(M("f(" + N + ") + f'(" + N + ") \\cdot " + par(d)) + " ?", v, M(nb(v)) + ".")],
traps: [TR(r6(r + d / r), "f'(" + N + ") = 1/(2√" + N + ") = 1/" + 2 * r + "."), TR(r + d, "On ajoute f'(" + N + ") · " + d + ", pas " + d + "."), TR(r6(r + d / (2 * N)), "f'(x) = 1/(2√x), pas 1/(2x).")] }); },
() => { const [k, x0] = pk([[4, 1], [4, 2], [8, 2], [12, 2], [18, 3], [9, 3], [16, 4], [4, -1], [8, -2], [18, -3]]), m = -k / (x0 * x0), p = 2 * k / x0;
return QX("Donne l'équation de la tangente au graphe de " + M("f(x) = \\frac{" + k + "}{x}") + " au point d'abscisse " + M(x0) + ". Réponds « y = … ».", tp([m, p]), M("f(" + x0 + ") = " + k / x0) + ", " + M("f'(x) = -\\frac{" + k + "}{x^2}") + ", " + M("f'(" + x0 + ") = " + m) + " : " + M("y = " + P2([m, p])) + ".",
{ ctx: "hyperbole", fig: PL([{ f: (x) => k / x, from: x0 > 0 ? 0.3 : -6, to: x0 > 0 ? 6 : -0.3 }, { f: (x) => m * x + p, cls: "f-line", dash: true }], Math.abs(k / x0) <= 6 ? [[x0, k / x0, ""]] : [], { xr: [-7, 7], yr: [-7, 9] }), guide: [GS(M("f(" + x0 + ")") + " ?", k / x0, M(k / x0) + "."), GS(M("f'(" + x0 + ")") + " ?", m, M(m) + "."), GX("Tangente ?", tp([m, p]), M("y = " + P2([m, p])) + ".")],
traps: [TX(tp([-m, p]), "(k/x)' = −k/x² : la pente est négative."), TX(tp([m, k / x0]), "y = m(x − x₀) + f(x₀) : développe."), TX(tp([m, 0]), "Il manque l'ordonnée à l'origine.")] }); },
],
3: [
() => { const a = pk([1, -1, 2, -2]), b = R.int(-4, 4), c = R.int(-4, 4), x = nz(-3, 3), m = 2 * a * x + b, cs = [a, b, c], y = pv(cs, x); if (!m) return null;
return QP("En quel point la tangente au graphe de " + ftex(cs) + " a-t-elle une pente égale à " + M(m) + " ? Réponds « x ; y ».", [x, y], M("f'(x) = " + P2([2 * a, b]) + " = " + m) + " donne " + M("x = " + x) + " ; " + M("f(" + x + ") = " + y) + ".",
{ ctx: "point-pente", guide: [GX(M("f'(x)") + " ?", tp([2 * a, b]), M(P2([2 * a, b])) + "."), GS("Résous " + M("f'(x) = " + m) + " : " + M("x") + " ?", x, M(x) + "."), GP("Point de contact (« x ; y ») ?", [x, y], M("(" + x + " \\,;\\, " + y + ")") + ".")],
traps: [TP([x, m], "La pente " + m + " n'est pas l'ordonnée : calcule f(" + x + ")."), TP([-x, pv(cs, -x)], "Vérifie le signe en résolvant " + 2 * a + "x " + (b < 0 ? "− " + -b : "+ " + b) + " = " + m + "."), TP([y, x], "Écris x d'abord, puis y.")] }); },
() => { const s = R.int(1, 5), c = s * s, a = pk([1, 2]);
return QSet("Quelles tangentes au graphe de " + M("f(x) = " + P2([a, 0, a * c])) + " passent par l'origine ? Donne les abscisses des points de contact.", [-s, s], "Tangente en " + M("t") + " : " + M("y = " + 2 * a + "t \\, x - " + (a === 1 ? "" : a) + "t^2 + " + a * c) + ". Elle passe par " + M("O") + " si " + M((a === 1 ? "" : a) + "t^2 = " + a * c) + " : " + M("t = \\pm " + s) + ".",
{ ctx: "tangentes-origine", guide: [GX("Ordonnée à l'origine de la tangente au point d'abscisse " + M("t") + " (en fonction de " + M("t") + ") ?", tp([-a, 0, a * c], "t"), M(P2([-a, 0, a * c], "t")) + "."), GSet("Elle vaut 0 pour ?", [-s, s], M("t = \\pm " + s) + ".")],
traps: [TSt([s], "Il y a deux tangentes, symétriques."), TSt([-c, c], c === 1 ? "t² = 1." : "t² = " + c + " : prends la racine."), TSt([0], "En t = 0, la tangente est horizontale à la hauteur " + a * c + " : elle ne passe pas par O.")] }); },
() => { const N = pk([2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 17]), x0 = Math.round(Math.sqrt(N)) + pk([0, 1]), v = (x0 * x0 + N) / (2 * x0);
return QN("Méthode de Newton pour " + M("\\sqrt{" + N + "}") + " : on part de " + M("x_0 = " + x0) + " et on remplace la courbe de " + M("f(x) = x^2 - " + N) + " par sa tangente en " + M("x_0") + ". Où cette tangente coupe-t-elle l'axe des " + M("x") + " ? (Valeur exacte.)", v,
M("f(" + x0 + ") = " + (x0 * x0 - N)) + ", " + M("f'(" + x0 + ") = " + 2 * x0) + " ; " + M("x_1 = x_0 - \\frac{f(x_0)}{f'(x_0)} = " + x0 + " - \\frac{" + (x0 * x0 - N) + "}{" + 2 * x0 + "} = " + fT(v)) + " (proche de " + M("\\sqrt{" + N + "}") + ").",
{ ctx: "newton", guide: [GS(M("f(" + x0 + ")") + " ?", x0 * x0 - N, M(x0 * x0 - N) + "."), GS(M("f'(" + x0 + ")") + " ?", 2 * x0, M(2 * x0) + "."), GS("Zéro de la tangente " + M("x_0 - \\frac{f(x_0)}{f'(x_0)}") + " ?", v, M(fT(v)) + ".")],
traps: [TR(x0 + (x0 * x0 - N) / (2 * x0), "x₁ = x₀ − f(x₀)/f'(x₀) : on soustrait."), TR((x0 * x0 - N) / (2 * x0), "C'est le déplacement ; il faut partir de x₀."), TR(x0 - (x0 * x0 - N), "Divise f(x₀) par la pente f'(x₀) = " + 2 * x0 + ".")] }); },
],
};


const VA = {
1: [
() => { let p, q, s, max; do { p = nz(-5, 3); q = p + R.int(2, 5); s = pk([1, -1]); max = s > 0 ? p : q; } while (Math.abs(max) <= 1); const min = s > 0 ? q : p;
return QN("La dérivée d'une fonction " + M("f") + " est " + M("f'(x) = " + (s > 0 ? "" : "-") + "(x" + sg(-p) + ")(x" + sg(-q) + ")") + ". En quelle abscisse " + M("f") + " admet-elle un maximum local ?", max, M("f'") + " s'annule en " + M(p) + " et " + M(q) + ". " + (s > 0 ? M("f'") + " est positive avant " + M(p) + ", négative entre les deux, positive après" : M("f'") + " est négative avant " + M(p) + ", positive entre les deux, négative après") + " : " + M("f") + " monte puis descend en " + M(max) + ".",
{ ctx: "signe-derivee", guide: [GSet("Zéros de " + M("f'") + " ?", [p, q], M(p) + " et " + M(q) + "."), GS("Où " + M("f'") + " passe-t-elle de + à − ?", max, M(max) + " : maximum local.")],
traps: [TR(min, "En " + min + ", f' passe de − à + : c'est un minimum."), TR(-max, "Les zéros de (x − a) sont en a : vérifie le signe.")] }); },
() => { const s = R.int(1, 4), d = R.int(-5, 5), k = pk([1, 2]), cs = [k, 0, -3 * k * s * s, d];
return QSet("En quelles abscisses " + ftex(cs) + " admet-elle un extremum local ?", [-s, s], M("f'(x) = " + P2(dP(cs)) + " = " + 3 * k + "(x - " + s + ")(x + " + s + ")") + " : s'annule et change de signe en " + M("\\pm " + s) + ".",
{ ctx: "cubique-symetrique", guide: [GX(M("f'(x)") + " ?", tp(dP(cs)), M(P2(dP(cs))) + "."), GSet("Zéros de " + M("f'") + " ?", [-s, s], M("\\pm " + s) + ".")],
traps: [TSt([s], "f'(x) = 0 a deux solutions."), TSt([0], "On cherche les zéros de f', pas ceux de f ou de f''."), TSt([-s * s, s * s], "x² = " + s * s + " : prends la racine.")] }); },


() => { const p = nz(-4, 4), q = p + pk([-5, -4, -3, -2, 2, 3, 4, 5]), s = pk([1, -1]), ext = q; if (Math.abs(q) <= 1) return null;
return Object.assign(QN("La dérivée d'une fonction " + M("f") + " est " + M("f'(x) = " + (s > 0 ? "" : "-") + "(x" + sg(-p) + ")^2(x" + sg(-q) + ")") + ". En quelle abscisse " + M("f") + " admet-elle un extremum local ?", ext,
M("f'") + " s'annule en " + M(p) + " et en " + M(q) + ". Le facteur " + M("(x" + sg(-p) + ")^2") + " est toujours positif : " + M("f'") + " ne change pas de signe en " + M(p) + " (palier, pas d'extremum). Elle change de signe en " + M(q) + " : " + (s > 0 ? "minimum" : "maximum") + " local.",
{ ctx: "racine-double", guide: [GSet("Zéros de " + M("f'") + " ?", [p, q], M(p) + " et " + M(q) + "."), GS("En lequel de ces zéros " + M("f'") + " change-t-elle de signe ?", ext, M(ext) + ".")],
traps: [TR(p, "En " + p + ", f' s'annule sans changer de signe (carré) : c'est un palier, pas un extremum."), TR(-q, "Le facteur (x − a) s'annule en a : vérifie le signe."), TR(-p, "Le facteur (x − a) s'annule en a ; et en ce point, f' ne change pas de signe.")] }), { shownOk: true }); },
],
2: [
() => { const p = nz(-4, 2), q = p + pk([2, 4]), b = -1.5 * (p + q), c = 3 * p * q, d = R.int(-5, 5), cs = [1, b, c, d], fp = pv(cs, p), fq = pv(cs, q);
return QN("Quelle est la valeur du maximum local de " + ftex(cs) + " ?", fp, M("f'(x) = " + P2(dP(cs)) + " = " + (q === 0 ? "3x(x" + sg(-p) + ")" : "3(x" + sg(-p) + ")(x" + sg(-q) + ")"))  + " : " + M("f'") + " passe de + à − en " + M(p) + ". Maximum local " + M("f(" + p + ") = " + fp) + ".",
{ ctx: "cubique-max", guide: [GX(M("f'(x)") + " ?", tp(dP(cs)), M(P2(dP(cs))) + "."), GSet("Zéros de " + M("f'") + " ?", [p, q], M(p) + " et " + M(q) + "."), GS("Maximum local (là où " + M("f'") + " passe de + à −) : sa valeur ?", fp, M("f(" + p + ") = " + fp) + ".")],
traps: [TR(fq, "f(" + q + ") est le minimum local (f' passe de − à +)."), TR(p, "C'est l'abscisse du maximum ; on demande sa valeur."), TR(d, "C'est f(0).")] }); },
() => { const p = nz(-4, 2), q = p + pk([2, 4]), b = -1.5 * (p + q), c = 3 * p * q, d = R.int(-5, 5), cs = [1, b, c, d], ivs = [[p, true, q, true]];
return QS("Sur quel intervalle (fermé) la fonction " + ftex(cs) + " est-elle décroissante ?", ivs, M("f'(x) = " + (q === 0 ? "3x(x" + sg(-p) + ")" : "3(x" + sg(-p) + ")(x" + sg(-q) + ")")) + " est négative entre ses zéros : " + M("f") + " décroît sur " + M("[" + p + " \\,;\\, " + q + "]") + ".",
{ ctx: "decroissance", guide: [GX(M("f'(x)") + " ?", tp(dP(cs)), M(P2(dP(cs))) + "."), GSet("Zéros de " + M("f'") + " ?", [p, q], M(p) + " et " + M(q) + "."), GSS("Où " + M("f'(x) \\le 0") + " ?", ivs, M("[" + p + " \\,;\\, " + q + "]") + ".")],
traps: [TS([[-Infinity, false, p, true], [q, true, Infinity, false]], "Là, f' > 0 : f est croissante."), TS([[-q, true, -p, true]], "Les zéros de (x − a) sont en a : vérifie les signes.")] }); },
() => { const s = R.int(2, 6), k = s * s, ask = pk(["val", "abs"]);
return QN("Pour " + M("x > 0") + ", la fonction " + M("f(x) = x + \\frac{" + k + "}{x}") + " admet un minimum. " + (ask === "val" ? "Quelle est sa valeur ?" : "En quelle abscisse ?"), ask === "val" ? 2 * s : s, M("f'(x) = 1 - \\frac{" + k + "}{x^2} = 0") + " pour " + M("x = " + s) + " ; " + M("f(" + s + ") = " + s + " + " + s + " = " + 2 * s) + ".",
{ ctx: "somme-inverse-" + ask, guide: [GX(M("f'(x)") + " ?", "1 - " + k + "/x^2", M("1 - \\frac{" + k + "}{x^2}") + "."), GS(M("f'(x) = 0") + " pour " + M("x > 0") + " ?", s, M(s) + ".")].concat(ask === "val" ? [GS(M("f(" + s + ")") + " ?", 2 * s, M(2 * s) + ".")] : []),
traps: ask === "val" ? [TR(s, "C'est l'abscisse ; la valeur minimale est f(" + s + ")."), TR(k + 1, "C'est f(1), pas le minimum.")] : [TR(k, "x² = " + k + " : prends la racine."), TR(2 * s, "C'est la valeur minimale ; on demande l'abscisse.")] }); },
],
3: [
() => { const a = R.int(1, 4);
return QN("Quelle est la valeur du minimum local de " + M("f(x) = \\frac{x^2}{x - " + a + "}") + " ?", 4 * a, M("f'(x) = \\frac{2x(x - " + a + ") - x^2}{(x - " + a + ")^2} = \\frac{x(x - " + 2 * a + ")}{(x - " + a + ")^2}") + " : zéros " + M(0) + " (maximum local) et " + M(2 * a) + " (minimum local). " + M("f(" + 2 * a + ") = \\frac{" + 4 * a * a + "}{" + a + "} = " + 4 * a) + ".",
{ ctx: "rationnelle-min", guide: [GX("Numérateur de " + M("f'(x)") + " ?", tp([1, -2 * a, 0]), M(P2([1, -2 * a, 0])) + "."), GSet("Zéros de " + M("f'") + " ?", [0, 2 * a], M(0) + " et " + M(2 * a) + "."), GS("Minimum local " + M("f(" + 2 * a + ")") + " ?", 4 * a, M(4 * a) + ".")],
traps: [TR(2 * a, "C'est l'abscisse du minimum ; calcule f(" + 2 * a + ")."), TR(0, "En 0, f' passe de + à − : c'est le maximum local (valeur 0).")] }); },
() => { const s = pk([1, 2, 3, -1, -2, -3]), k = -3 * s * s, c = pk([1, 2]);
return QN("Pour quelle valeur de " + M("k") + " la fonction " + M("f(x) = " + (c === 1 ? "" : c) + "x^3 + " + (c === 1 ? "" : c) + "kx") + " admet-elle un extremum local en " + M("x = " + s) + " ?", k, M("f'(x) = " + 3 * c + "x^2 + " + (c === 1 ? "" : c) + "k") + " ; " + M("f'(" + s + ") = " + 3 * c * s * s + " + " + (c === 1 ? "" : c) + "k = 0") + " donne " + M("k = " + k) + ".",
{ ctx: "parametre-extremum", guide: [GX(M("f'(x)") + " (avec " + M("k") + ") ?", 3 * c + "x^2 + " + c + "*k", M(3 * c + "x^2 + " + (c === 1 ? "" : c) + "k") + "."), GS(M("f'(" + s + ") = 0") + " : " + M("k") + " ?", k, M(k) + ".")],
traps: [TR(-k, "3x² + k = 0 donne k = −3x² : négatif."), TR(-s * s, "f'(x) = 3x² + k : facteur 3."), TR(-(s * s), "Le facteur 3 de 3x² compte.")] }); },
() => { const s = R.int(1, 3), a = pk([1, 2]), cs = [a, 0, -2 * a * s * s, 0, 0], mn = -a * s ** 4;
return QN("Quelle est la valeur minimale de " + ftex(cs) + " ?", mn, M("f'(x) = " + P2(dP(cs)) + " = " + 4 * a + "x(x - " + s + ")(x + " + s + ")") + " : minima en " + M("\\pm " + s) + ", maximum local en " + M(0) + ". " + M("f(" + s + ") = " + mn) + ".",
{ ctx: "degre4", guide: [GX(M("f'(x)") + " ?", tp(dP(cs)), M(P2(dP(cs))) + "."), GSet("Zéros de " + M("f'") + " ?", [-s, 0, s], M("-" + s) + ", " + M(0) + ", " + M(s) + "."), GS("Valeur minimale " + M("f(" + s + ")") + " ?", mn, M(mn) + ".")],
traps: [TR(0, "En 0, f a un maximum local."), TR(s, "C'est une abscisse du minimum ; calcule f(" + s + ")."), TR(-s, "C'est une abscisse ; on demande la valeur.")] }); },
],
};


const OP = {
1: [


() => { const a = pk([1, 2, 4, 5]), q0 = pk([10, 20, 30, 40, 50]), F = a * q0 * q0, b = pk([8, 12, 15, 20]), ask = pk(["q", "CM"]), CM = 2 * a * q0 + b, it = pk(["vélos", "drones", "tables", "trottinettes"]);
return QN("Une entreprise produit " + M("q") + " " + it + " par mois pour un coût total " + M("C(q) = " + co(a) + "q^2 + " + b + "q + " + nb(F)) + " CHF. Le coût moyen par pièce est " + M("C_M(q) = \\frac{C(q)}{q}") + ". " + (ask === "q" ? "Quelle production rend le coût moyen minimal ?" : "Quel est le coût moyen minimal (en CHF par pièce) ?"), ask === "q" ? q0 : CM,
M("C_M(q) = " + co(a) + "q + " + b + " + \\frac{" + nb(F) + "}{q}") + ", " + M("C_M'(q) = " + a + " - \\frac{" + nb(F) + "}{q^2} = 0") + " pour " + M("q^2 = " + nb(F / a)) + ", " + M("q = " + q0) + " ; " + M("C_M(" + q0 + ") = " + nb(a * q0) + " + " + b + " + " + nb(F / q0) + " = " + nb(CM)) + " CHF.",
{ ctx: "cout-moyen-" + ask, guide: [GX(M("C_M(q)") + " (simplifié) ?", (a === 1 ? "" : a) + "q + " + b + " + " + F + "/q", M(co(a) + "q + " + b + " + \\frac{" + nb(F) + "}{q}") + "."), GS(M("C_M'(q) = 0") + " pour " + M("q > 0") + " ?", q0, M(q0) + ".")].concat(ask === "CM" ? [GS(M("C_M(" + q0 + ")") + " ?", CM, M(nb(CM)) + " CHF.")] : []),
traps: ask === "q" ? [TR(F / a, "C'est q² : prends la racine."), TR(Math.sqrt(F), "C_M'(q) = " + a + " − " + F + "/q² : q² = " + F + " ÷ " + a + "."), TR(F / q0, "C'est la part des frais fixes ; on demande q.")] : [TR(q0, "C'est la production ; calcule C_M(" + q0 + ")."), TR(a * q0 + b, "N'oublie pas les frais fixes répartis : " + F + " ÷ " + q0 + "."), TR(a * q0 * q0 + b * q0 + F, "C'est le coût total, pas le coût moyen.")] }); },
() => { const x0 = R.int(4, 10), S = 3 * x0 * x0, ask = pk(["x", "V"]), V = x0 ** 3 / 2;
return QN("Une boîte sans couvercle, à base carrée de côté " + M("x") + ", est fabriquée avec " + M(nb(S) + tu("cm^2")) + " de carton. Sa hauteur vaut donc " + M("h = \\frac{" + nb(S) + " - x^2}{4x}") + ". " + (ask === "x" ? "Quel côté " + M("x") + " (en cm) rend son volume maximal ?" : "Quel est son volume maximal (en cm³) ?"), ask === "x" ? x0 : V,
M("V(x) = x^2 h = \\frac{" + nb(S) + "x - x^3}{4}") + ", " + M("V'(x) = \\frac{" + nb(S) + " - 3x^2}{4} = 0") + " pour " + M("x^2 = " + x0 * x0) + ", " + M("x = " + x0) + " (+ puis −) ; " + M("V(" + x0 + ") = \\frac{" + nb(S * x0) + " - " + nb(x0 ** 3) + "}{4} = " + nb(V)) + " cm³.",
{ ctx: "boite-surface-" + ask, guide: [GX(M("V(x) = x^2 h") + " (développé) ?", "(" + S + "x - x^3)/4", M("\\frac{" + nb(S) + "x - x^3}{4}") + "."), GS(M("V'(x) = 0") + " pour " + M("x > 0") + " ?", x0, M(x0) + " cm.")].concat(ask === "V" ? [GS("Volume maximal ?", V, M(nb(V)) + " cm³.")] : []),
traps: ask === "x" ? [TR(Math.sqrt(S), "x² = S donnerait h = 0 : résous V'(x) = 0, soit 3x² = " + S + "."), TR(x0 * x0, "C'est x² ; prends la racine."), TR(S / 4, "Dérive V(x) = (" + S + "x − x³) ÷ 4.")] : [TR(x0, "C'est le côté ; calcule V(" + x0 + ")."), TR(x0 ** 3, "V = (S·x − x³) ÷ 4 : n'oublie pas de diviser."), TR(S * x0 / 4, "Il faut retrancher x³.")] }); },
() => { const k = R.int(2, 8), S = 3 * k, ask = pk(["y", "P"]), y = 2 * k, Pm = 4 * k ** 3;
return QN("Deux nombres positifs " + M("x") + " et " + M("y") + " ont pour somme " + M(S) + ". On veut rendre le produit " + M("P = x y^2") + " le plus grand possible. " + (ask === "y" ? "Quelle valeur de " + M("y") + " faut-il choisir ?" : "Quelle est la valeur maximale de " + M("P") + " ?"), ask === "y" ? y : Pm,
M("P(y) = (" + S + " - y)y^2 = " + S + "y^2 - y^3") + ", " + M("P'(y) = " + 2 * S + "y - 3y^2 = y(" + 2 * S + " - 3y)") + " : " + M("y = " + y) + ", " + M("x = " + k) + ", " + M("P = " + k + " \\cdot " + y * y + " = " + Pm) + ".",
{ ctx: "produit-" + ask, guide: [GX(M("P(y)") + " (développé) ?", tp([-1, S, 0, 0], "y"), M(P2([-1, S, 0, 0], "y")) + "."), GX(M("P'(y)") + " ?", tp([-3, 2 * S, 0], "y"), M(P2([-3, 2 * S, 0], "y")) + "."), GS(M("P'(y) = 0") + " pour " + M("y > 0") + " ?", y, M(y) + ".")].concat(ask === "P" ? [GS(M("P") + " maximal ?", Pm, M(Pm) + ".")] : []),
traps: ask === "y" ? [TR(S / 2, "La moitié n'est pas l'optimum ici : y compte au carré."), TR(k, "C'est la valeur de x.")] : [TR(r6((S / 2) ** 3), "La moitié n'est pas l'optimum : dérive P(y)."), TR(y, "C'est y ; calcule P = x · y².")] }); },
],
2: [
() => { const L = pk([12, 18, 24, 30, 36]), x = L / 6, V = 2 * L ** 3 / 27, ask = pk(["x", "V"]);
return QN("Dans une feuille carrée de carton de " + M(L + tu("cm")) + " de côté, on découpe un carré de côté " + M("x") + " à chaque coin, puis on plie pour obtenir une boîte sans couvercle. " + (ask === "x" ? "Quelle valeur de " + M("x") + " (en cm) donne le volume maximal ?" : "Quel est le volume maximal (en cm³) ?"), ask === "x" ? x : V,
M("V(x) = x(" + L + " - 2x)^2") + ", " + M("V'(x) = (" + L + " - 2x)(" + L + " - 6x)") + " ; " + M("x = " + L / 2) + " donne une boîte plate, donc " + M("x = " + x) + " cm et " + M("V = " + x + " \\cdot " + (L - 2 * x) + "^2 = " + nb(V)) + " cm³.",
{ ctx: "boite-" + ask, guide: [GX(M("V(x)") + " développé ?", tp([4, -4 * L, L * L, 0]), M(P2([4, -4 * L, L * L, 0])) + "."), GX(M("V'(x)") + " ?", tp([12, -8 * L, L * L]), M(P2([12, -8 * L, L * L])) + "."), GS("Zéro utile de " + M("V'") + " (" + M("0 < x < " + L / 2) + ") ?", x, M(x) + " cm.")].concat(ask === "V" ? [GS("Volume maximal ?", V, M(nb(V)) + " cm³.")] : []),
traps: ask === "x" ? [TR(L / 2, "En x = " + L / 2 + ", le fond disparaît : volume nul."), TR(L / 4, "Dérive V(x) : V'(x) = (" + L + " − 2x)(" + L + " − 6x)."), TR(L / 3, "Résous V'(x) = 0.")] : [TR(x, "C'est x ; calcule V(" + x + ")."), TR((L / 4) * (L / 2) ** 2, "x = " + L / 4 + " n'est pas l'optimum.")] }); },
() => { const m = R.int(2, 5), ask = pk(["q", "B"]), q = 2 * m, B = 4 * m ** 3;
return QN("Le bénéfice d'une usine vaut " + M("B(q) = " + P2([-1, 3 * m, 0, 0], "q")) + " (en milliers de CHF, " + M("q") + " en centaines de pièces). " + (ask === "q" ? "Quelle production " + M("q") + " rend le bénéfice maximal ?" : "Quel est le bénéfice maximal (en milliers de CHF) ?"), ask === "q" ? q : B,
M("B'(q) = " + P2([-3, 6 * m, 0], "q") + " = -3q(q - " + 2 * m + ")") + " : maximum en " + M("q = " + q) + " ; " + M("B(" + q + ") = " + B) + ".",
{ ctx: "usine-" + ask, guide: [GX(M("B'(q)") + " ?", tp([-3, 6 * m, 0], "q"), M(P2([-3, 6 * m, 0], "q")) + "."), GS("Zéro non nul de " + M("B'") + " ?", q, M(q) + ".")].concat(ask === "B" ? [GS(M("B(" + q + ")") + " ?", B, M(B) + ".")] : []),
traps: ask === "q" ? [TR(3 * m, "B(" + 3 * m + ") = 0 : c'est là où le bénéfice s'annule."), TR(m, "Résous B'(q) = −3q² + " + 6 * m + "q = 0.")] : [TR(q, "C'est la production ; calcule B(" + q + ")."), TR(2 * m ** 3, "B(" + m + ") n'est pas le maximum.")] }); },
() => { const s = R.int(1, 3), c = 3 * s * s, ask = pk(["x", "A"]), A = 4 * s ** 3;
return QN("Un rectangle a deux sommets sur l'axe des " + M("x") + " et les deux autres sur la parabole " + M("y = " + c + " - x^2") + " (symétrique par rapport à l'axe des " + M("y") + "). On note " + M("x > 0") + " l'abscisse du sommet de droite. " + (ask === "x" ? "Quelle valeur de " + M("x") + " rend l'aire maximale ?" : "Quelle est l'aire maximale ?"), ask === "x" ? s : A,
M("A(x) = 2x(" + c + " - x^2) = " + 2 * c + "x - 2x^3") + ", " + M("A'(x) = " + 2 * c + " - 6x^2 = 0") + " pour " + M("x = " + s) + " ; " + M("A = 2 \\cdot " + s + " \\cdot " + (c - s * s) + " = " + A) + ".",
{ ctx: "rectangle-parabole-" + ask, fig: PL([{ f: (x) => c - x * x }], [[s, c - s * s, ""]], { xr: [-4, 4], yr: [-1, c + 1], squash: c > 8 ? 0.6 : 1, polys: [[[-s, 0], [s, 0], [s, c - s * s], [-s, c - s * s]]] }), guide: [GX("Aire " + M("A(x)") + " ?", tp([-2, 0, 2 * c, 0]), M(P2([-2, 0, 2 * c, 0])) + "."), GS(M("A'(x) = 0") + " pour " + M("x > 0") + " ?", s, M(s) + ".")].concat(ask === "A" ? [GS("Aire maximale ?", A, M(A) + ".")] : []),
traps: ask === "x" ? [TR(c, "Résous A'(x) = " + 2 * c + " − 6x² = 0."), TR(s * s, "x² = " + s * s + " : prends la racine.")] : [TR(r6(s * (c - s * s)), "La base vaut 2x, pas x."), TR(s, "C'est x ; calcule l'aire.")] }); },
],
3: [
() => { const x = pk([4, 6, 8, 10, 12]), V = x ** 3 / 2, h = V / (x * x), ask = pk(["x", "S"]), S = 3 * x * x;
return QN("Une boîte sans couvercle, à base carrée, doit contenir " + M(nb(V) + tu("cm^3")) + ". On veut utiliser le moins de matière possible. " + (ask === "x" ? "Quel côté de base (en cm) faut-il choisir ?" : "Quelle est l'aire minimale de matière (en cm²) ?"), ask === "x" ? x : S,
"Hauteur " + M("h = \\frac{" + nb(V) + "}{x^2}") + ", " + M("S(x) = x^2 + 4xh = x^2 + \\frac{" + nb(4 * V) + "}{x}") + ", " + M("S'(x) = 2x - \\frac{" + nb(4 * V) + "}{x^2} = 0 \\iff x^3 = " + nb(2 * V)) + " : " + M("x = " + x) + " cm, " + M("h = " + h) + " cm, " + M("S = " + nb(S)) + " cm².",
{ ctx: "boite-ouverte-" + ask, guide: [GX(M("S(x)") + " en fonction de " + M("x") + " ?", "x^2 + " + 4 * V + "/x", M("x^2 + \\frac{" + nb(4 * V) + "}{x}") + "."), GS(M("S'(x) = 0 \\iff x^3 =") + " ?", 2 * V, M(nb(2 * V)) + "."), GS(M("x") + " ?", x, M(x) + " cm.")].concat(ask === "S" ? [GS(M("S(" + x + ")") + " ?", S, M(nb(S)) + " cm².")] : []),
traps: ask === "x" ? [TR(r6(Math.cbrt(V)), "Le cube n'est pas l'optimum sans couvercle : x³ = 2V."), TR(h, "C'est la hauteur.")] : [TR(r6(6 * Math.cbrt(V) ** 2 - Math.cbrt(V) ** 2), "Ce cube n'est pas l'optimum : x³ = 2V."), TR(x, "C'est le côté ; calcule S.")] }); },
() => { const k = R.int(2, 6), V = 2 * k ** 3, ask = pk(["r", "h"]);
return QN("Une boîte de conserve cylindrique doit contenir " + M(nb(V) + "\\pi" + tu("cm^3")) + ". Pour utiliser le moins de métal possible (aire totale minimale), " + (ask === "r" ? "quel rayon (en cm) faut-il choisir ?" : "quelle hauteur (en cm) faut-il choisir ?"), ask === "r" ? k : 2 * k,
M("h = \\frac{" + V + "}{r^2}") + ", " + M("S(r) = 2\\pi r^2 + 2\\pi r h = 2\\pi r^2 + \\frac{" + 2 * V + "\\pi}{r}") + ", " + M("S'(r) = 4\\pi r - \\frac{" + 2 * V + "\\pi}{r^2} = 0 \\iff r^3 = " + k ** 3) + " : " + M("r = " + k) + " cm, " + M("h = " + 2 * k) + " cm (hauteur = diamètre).",
{ ctx: "conserve-" + ask, guide: [GS(M("S'(r) = 0 \\iff r^3 =") + " ?", k ** 3, M(k ** 3) + "."), GS("Rayon " + M("r") + " ?", k, M(k) + " cm.")].concat(ask === "h" ? [GS("Hauteur " + M("h = \\frac{" + V + "}{r^2}") + " ?", 2 * k, M(2 * k) + " cm.")] : []),
traps: ask === "r" ? [TR(2 * k, "C'est la hauteur (égale au diamètre)."), TR(r6(Math.cbrt(V)), "r³ = " + V + "/2 : la moitié.")] : [TR(k, "C'est le rayon ; h = " + V + "/r²."), TR(4 * k, "h = " + V + "/" + k * k + ".")] }); },
() => { const v = pk([60, 70, 80, 90, 100]), kk = pk([100, 200]), a = v * v / kk, d = pk([150, 240, 300, 420]);
return QN("Un camion fait un trajet de " + M(d + tu("km")) + " à vitesse constante " + M("v") + " (km/h). Le chauffeur coûte " + M(nb(a)) + " CHF par heure et le carburant " + M("\\frac{v^2}{" + kk + "}") + " CHF par heure. Le coût du trajet est " + M("C(v) = \\frac{" + d + "}{v}\\left(" + nb(a) + " + \\frac{v^2}{" + kk + "}\\right)") + ". Quelle vitesse rend ce coût minimal ?", v,
M("C(v) = \\frac{" + nb(d * a) + "}{v} + \\frac{" + d + "v}{" + kk + "}") + ", " + M("C'(v) = -\\frac{" + nb(d * a) + "}{v^2} + \\frac{" + d + "}{" + kk + "} = 0 \\iff v^2 = " + nb(a * kk)) + " : " + M("v = " + v) + " km/h.",
{ ctx: "camion", guide: [GS(M("C'(v) = 0 \\iff v^2 =") + " ?", a * kk, M(nb(a * kk)) + "."), GS(M("v") + " ?", v, M(v) + " km/h.")],
traps: [TR(r6(Math.sqrt(a)), "v² = " + nb(a) + " · " + kk + " : multiplie par " + kk + "."), TR(a * kk, "C'est v² : prends la racine."), TR(r6(Math.sqrt(a * kk / 2)), "Résous C'(v) = 0 sans diviser par 2.")] }); },
],
};


const PROBS = {
tauxvar: [() => P("Une voiture électrique a parcouru d(t) = 2t² + 5t mètres après t secondes.", [["a) Distance après 4 s (m)", 52], ["b) Vitesse moyenne entre 2 s et 4 s (m/s)", 17], ["c) Vitesse moyenne entre 4 s et 4,5 s (m/s)", 22]], ["d(2) = 18 et d(4) = 52.", "d(4,5) = 63, puis (63 − 52) ÷ 0,5."], "a) " + M("d(4) = 32 + 20 = 52") + " ; b) " + M("\\frac{52 - 18}{2} = 17") + " ; c) " + M("\\frac{63 - 52}{0{,}5} = 22") + " (proche de la vitesse instantanée " + M("d'(4) = 21") + ").")],
nbderive: [() => P("On étudie f(x) = x² − 3x au point d'abscisse 2.", [["a) f(2)", -2], ["b) Quotient (f(2 + h) − f(2)) ÷ h pour h = 0,1", 1.1], ["c) f'(2)", 1]], ["f(2 + h) − f(2) = h + h².", "Le quotient vaut 1 + h."], "a) −2 ; b) " + M("1 + 0{,}1 = 1{,}1") + " ; c) limite quand " + M("h \\to 0") + " : 1.")],
derivref: [() => P("Soit f(x) = 2√x + x³.", [["a) f(4)", 68], ["b) f'(4)", 48.5], ["c) f'(1)", 4]], ["f'(x) = 1/√x + 3x².", "f'(4) = 1/2 + 48."], "a) " + M("2 \\cdot 2 + 64 = 68") + " ; b) " + M("f'(x) = \\frac{1}{\\sqrt{x}} + 3x^2") + ", " + M("f'(4) = 48{,}5") + " ; c) " + M("1 + 3 = 4") + ".")],
derivregles: [() => P("Soit f(x) = x³ − 6x² + 9x + 1.", [["a) f'(0)", 9], ["b) Plus petite abscisse où f'(x) = 0", 1], ["c) Plus grande abscisse où f'(x) = 0", 3]], ["f'(x) = 3x² − 12x + 9.", "3(x − 1)(x − 3)."], "a) 9 ; b) et c) " + M("f'(x) = 3(x - 1)(x - 3)") + " : 1 et 3.")],
derivprodquot: [() => P("Soit f(x) = (2x + 1)/(x − 1), x ≠ 1.", [["a) Numérateur de f'(x) (une constante)", -3], ["b) f'(2)", -3], ["c) f'(0)", -3]], ["u'v − uv' = 2(x − 1) − (2x + 1).", "f'(x) = −3/(x − 1)²."], "a) " + M("2(x - 1) - (2x + 1) = -3") + " ; b) " + M("\\frac{-3}{1} = -3") + " ; c) " + M("\\frac{-3}{(-1)^2} = -3") + ".")],
derivcomp: [() => P("Soit f(x) = (x² − 3)⁴.", [["a) f(2)", 1], ["b) f'(2)", 16], ["c) f'(1)", -64]], ["f'(x) = 4(x² − 3)³ · 2x.", "En x = 1, on calcule 4 · (−2)³ · 2."], "a) " + M("1^4 = 1") + " ; b) " + M("8x(x^2 - 3)^3") + " en 2 : " + M("16 \\cdot 1 = 16") + " ; c) " + M("8 \\cdot (-8) = -64") + ".")],
tangente: [() => P("Tangente à f(x) = x² − 4x + 5 au point d'abscisse 3.", [["a) f(3)", 2], ["b) Pente f'(3)", 2], ["c) Ordonnée à l'origine de la tangente", -4]], ["f'(x) = 2x − 4.", "y = 2(x − 3) + 2."], "a) 2 ; b) 2 ; c) " + M("y = 2x - 4") + " : −4.")],
variations: [() => P("Soit f(x) = x³ − 3x² − 9x + 2.", [["a) Abscisse du maximum local", -1], ["b) Valeur du maximum local", 7], ["c) Valeur du minimum local", -25]], ["f'(x) = 3(x + 1)(x − 3).", "f(−1) = 7 et f(3) = −25."], "a) −1 ; b) " + M("f(-1) = -1 - 3 + 9 + 2 = 7") + " ; c) " + M("f(3) = 27 - 27 - 27 + 2 = -25") + ".")],
optimderiv: [() => P("Dans une feuille de 30 cm × 30 cm, on découpe un carré de côté x à chaque coin pour faire une boîte sans couvercle.", [["a) Volume pour x = 3 (cm³)", 1728], ["b) x qui rend le volume maximal (cm)", 5], ["c) Volume maximal (cm³)", 2000]], ["V(x) = x(30 − 2x)².", "V'(x) = (30 − 2x)(30 − 6x)."], "a) " + M("3 \\cdot 24^2 = 1728") + " ; b) 5 ; c) " + M("5 \\cdot 20^2 = 2000") + ".")],
};


const NEW = [
{ id: "tauxvar", theme: "fa", label: "Taux de variation moyen", ex: "\\frac{f(b) - f(a)}{b - a}", CH: [14], codesMATU: "3\\.AN\\.03a", lv: TV,
hint: "Taux de variation moyen entre a et b : (f(b) − f(a)) ÷ (b − a). C'est la pente de la sécante.",
lesson: ["Taux de variation moyen", "De combien une grandeur change-t-elle, en moyenne, par unité ?", "Entre \\(a\\) et \\(b\\), le taux de variation moyen de \\(f\\) vaut \\(\\frac{f(b) - f(a)}{b - a}\\). C'est la pente de la sécante qui relie les points d'abscisses \\(a\\) et \\(b\\). Une vitesse moyenne est un taux de variation moyen.",
["\\(f(x) = x^2\\) entre 1 et 3 : \\(\\frac{9 - 1}{3 - 1} = 4\\).", "De 8 h (4 °C) à 14 h (19 °C) : \\(\\frac{19 - 4}{6} = 2{,}5\\) °C par heure."], "On divise par l'écart des abscisses, dans le même ordre : \\(f(b) - f(a)\\) avec \\(b - a\\)."],
comps: ["Calculer un taux de variation moyen", "Interpréter un taux de variation (vitesse moyenne)", "Simplifier le taux de variation entre a et a + h"] },
{ id: "nbderive", theme: "fa", label: "Nombre dérivé", ex: "f'(a) = \\lim_{h \\to 0} \\frac{f(a + h) - f(a)}{h}", CH: [14], codesMATU: "3\\.AN\\.03b|3\\.AN\\.04a", lv: ND,
hint: "f'(a) est la pente de la tangente en a : la limite de (f(a + h) − f(a)) ÷ h quand h tend vers 0.",
lesson: ["Nombre dérivé", "Le nombre dérivé mesure la pente de la courbe en un point.", "\\(f'(a) = \\lim_{h \\to 0} \\frac{f(a + h) - f(a)}{h}\\). On simplifie d'abord le quotient (on peut alors diviser par \\(h\\)), puis on fait tendre \\(h\\) vers 0. Graphiquement, \\(f'(a)\\) est la pente de la tangente au point d'abscisse \\(a\\). Si \\(s(t)\\) est une position, \\(s'(t)\\) est la vitesse instantanée.",
["\\(f(x) = x^2\\), \\(a = 3\\) : \\(\\frac{(3 + h)^2 - 9}{h} = 6 + h\\), donc \\(f'(3) = 6\\).", "Tangente de pente 2 au point A : \\(f'(x_A) = 2\\)."], "Ne confonds pas \\(f(a)\\) (une hauteur) et \\(f'(a)\\) (une pente)."],
comps: ["Lire un nombre dérivé (pente de la tangente)", "Calculer un nombre dérivé avec la définition", "Calculer un nombre dérivé (racine, cube, vitesse)"] },
{ id: "derivref", theme: "fa", label: "Dérivées des fonctions de référence", ex: "(x^n)' = n x^{n - 1}", CH: [14], codesMATU: "3\\.AN\\.04[bc]", lv: DR,
hint: "(xⁿ)' = n·xⁿ⁻¹ (aussi pour n négatif ou fractionnaire), (√x)' = 1/(2√x), (sin x)' = cos x, (cos x)' = −sin x.",
lesson: ["Dérivées des fonctions de référence", "Quelques dérivées à connaître par cœur.", "\\((x^n)' = n x^{n - 1}\\) pour tout exposant \\(n\\) ; en particulier \\(\\left(\\frac{1}{x}\\right)' = -\\frac{1}{x^2}\\) et \\((\\sqrt{x})' = \\frac{1}{2\\sqrt{x}}\\). En radians : \\((\\sin x)' = \\cos x\\) et \\((\\cos x)' = -\\sin x\\). Une constante a pour dérivée 0.",
["\\((x^5)' = 5x^4\\)", "\\(\\left(\\frac{1}{x^3}\\right)' = (x^{-3})' = -3x^{-4} = -\\frac{3}{x^4}\\)", "\\((x\\sqrt{x})' = \\left(x^{\\frac{3}{2}}\\right)' = \\frac{3}{2}\\sqrt{x}\\)"], "Racines et inverses : écris d'abord une puissance de \\(x\\), puis applique la règle."],
comps: ["Dériver une puissance de x", "Dériver 1/xⁿ, √x et une racine", "Dériver sinus et cosinus"] },
{ id: "derivregles", theme: "fa", label: "Dériver une somme, un polynôme", ex: "(3x^2 - 5x + 1)' = 6x - 5", CH: [14], codesMATU: "3\\.AN\\.05a", lv: DG,
hint: "La dérivée d'une somme est la somme des dérivées ; (k·f)' = k·f' ; la dérivée d'une constante est 0.",
lesson: ["Dériver une somme", "On dérive terme par terme.", "\\((u + v)' = u' + v'\\) et \\((k u)' = k u'\\). Pour un polynôme, chaque terme \\(a x^n\\) devient \\(n a x^{n - 1}\\) et la constante disparaît. Un produit ou un quotient simple peut d'abord être développé ou simplifié.",
["\\((2x^3 - 5x^2 + 4x - 7)' = 6x^2 - 10x + 4\\)", "\\(((x + 1)(x - 3))' = (x^2 - 2x - 3)' = 2x - 2\\)"], "La dérivée d'un produit n'est pas le produit des dérivées : développe d'abord (ou utilise la règle du produit)."],
comps: ["Dériver un polynôme", "Dériver une somme de puissances (développer, simplifier)", "Utiliser la dérivée : paramètre, pente donnée, vitesse"] },
{ id: "derivprodquot", theme: "fa", label: "Dériver un produit, un quotient", ex: "\\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2}", CH: [14], codesMATU: "3\\.AN\\.05[bc]", lv: PQ,
hint: "(uv)' = u'v + uv' ; (u/v)' = (u'v − uv') ÷ v² ; (1/v)' = −v' ÷ v².",
lesson: ["Produit et quotient", "Deux règles à connaître.", "\\((uv)' = u'v + uv'\\). \\(\\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2}\\) (là où \\(v \\neq 0\\)) ; cas particulier \\(\\left(\\frac{1}{v}\\right)' = -\\frac{v'}{v^2}\\). On garde en général le dénominateur sous forme de carré.",
["\\((x^2(3x + 1))' = 2x(3x + 1) + 3x^2 = 9x^2 + 2x\\)", "\\(\\left(\\frac{2x + 1}{x - 1}\\right)' = \\frac{2(x - 1) - (2x + 1)}{(x - 1)^2} = \\frac{-3}{(x - 1)^2}\\)"], "Au numérateur du quotient : \\(u'v - uv'\\), dans cet ordre, et \\(uv'\\) se soustrait en entier (parenthèses)."],
comps: ["Dériver un produit", "Dériver un quotient", "Utiliser produit et quotient (tangente horizontale, maximum)"] },
{ id: "derivcomp", theme: "fa", label: "Dériver une fonction composée", ex: "\\left((3x + 1)^5\\right)' = 15(3x + 1)^4", CH: [14], codesMATU: "3\\.AN\\.05[de]", lv: DC,
hint: "(f(u))' = f'(u) · u' : on dérive l'extérieur en gardant l'intérieur, puis on multiplie par la dérivée de l'intérieur.",
lesson: ["Fonction composée", "Dériver « l'extérieur », puis multiplier par la dérivée de « l'intérieur ».", "\\((f(u(x)))' = f'(u(x)) \\cdot u'(x)\\). Cas fréquents : \\((u^n)' = n u^{n - 1} u'\\), \\((\\sqrt{u})' = \\frac{u'}{2\\sqrt{u}}\\), \\((\\sin u)' = u' \\cos u\\), \\((\\cos u)' = -u' \\sin u\\).",
["\\(\\left((x^2 + 1)^3\\right)' = 3(x^2 + 1)^2 \\cdot 2x = 6x(x^2 + 1)^2\\)", "\\((\\sin(3x))' = 3\\cos(3x)\\)", "\\(\\left(\\sqrt{2x + 5}\\right)' = \\frac{2}{2\\sqrt{2x + 5}} = \\frac{1}{\\sqrt{2x + 5}}\\)"], "N'oublie pas le facteur \\(u'\\) : \\(((3x + 1)^5)' = 15(3x + 1)^4\\), pas \\(5(3x + 1)^4\\)."],
comps: ["Dériver une puissance ou une racine d'une fonction affine", "Dériver une composée (carré, inverse, racine)", "Combiner produit et composée ; modèles périodiques"] },
{ id: "tangente", theme: "fa", label: "Équation de la tangente", ex: "y = f'(a)(x - a) + f(a)", CH: [14], codesMATU: "3\\.AN\\.03[cd]", lv: TG,
hint: "Tangente en a : y = f'(a)(x − a) + f(a). Pente f'(a), elle passe par (a ; f(a)).",
lesson: ["Équation de la tangente", "La tangente est la droite qui « colle » à la courbe en un point.", "Au point d'abscisse \\(a\\), la tangente a pour pente \\(f'(a)\\) et passe par \\((a \\,;\\, f(a))\\) : \\(y = f'(a)(x - a) + f(a)\\). Près de \\(a\\), \\(f(x) \\approx f(a) + f'(a)(x - a)\\) (approximation affine).",
["\\(f(x) = x^2\\) en 3 : \\(y = 6(x - 3) + 9 = 6x - 9\\).", "\\(\\sqrt{102} \\approx 10 + \\frac{2}{20} = 10{,}1\\) (tangente de \\(\\sqrt{x}\\) en 100)."], "Développe : l'ordonnée à l'origine est \\(f(a) - f'(a) \\cdot a\\), pas \\(f(a)\\)."],
comps: ["Établir l'équation d'une tangente", "Tangente d'une fonction quelconque ; approximation affine", "Résoudre un problème de tangente (pente donnée, Newton)"] },
{ id: "variations", theme: "fa", label: "Signe de la dérivée et variations", ex: "f' > 0 \\Rightarrow f \\nearrow", CH: [14], codesMATU: "3\\.AN\\.07[ab]", lv: VA,
hint: "f' > 0 : f croît ; f' < 0 : f décroît. Un extremum local là où f' s'annule en changeant de signe (+ → − : maximum).",
lesson: ["Variations et extrema", "Le signe de la dérivée donne le sens de variation.", "Sur un intervalle, si \\(f' > 0\\), \\(f\\) est croissante ; si \\(f' < 0\\), décroissante. Méthode : calculer \\(f'(x)\\), trouver ses zéros, dresser le tableau de signes de \\(f'\\), en déduire les variations. Si \\(f'\\) passe de + à − en \\(a\\), \\(f(a)\\) est un maximum local ; de − à +, un minimum local.",
["\\(f(x) = x^3 - 3x\\) : \\(f'(x) = 3(x - 1)(x + 1)\\), maximum local \\(f(-1) = 2\\), minimum local \\(f(1) = -2\\)."], "Un zéro de \\(f'\\) sans changement de signe n'est pas un extremum (exemple : \\(x^3\\) en 0). Et l'extremum est la valeur \\(f(a)\\), pas l'abscisse \\(a\\)."],
comps: ["Trouver les extrema avec le signe de f'", "Dresser les variations d'une fonction de degré 3", "Étudier une fonction rationnelle ou de degré 4"] },
{ id: "optimderiv", theme: "fa", label: "Problèmes d'optimisation", ex: "V'(x) = 0", CH: [14], codesMATU: "3\\.AN\\.10[abc]", lv: OP,
hint: "Exprime la grandeur à optimiser avec une seule variable, dérive, cherche où la dérivée s'annule et vérifie que c'est bien un maximum (ou un minimum).",
lesson: ["Optimisation", "Trouver la meilleure valeur : la plus grande aire, le plus petit coût…", "1. Choisir la variable \\(x\\) et son domaine. 2. Écrire la grandeur à optimiser en fonction de \\(x\\) seulement (utiliser la contrainte). 3. Dériver, résoudre \\(f'(x) = 0\\). 4. Vérifier avec le signe de \\(f'\\) (ou les bords du domaine) et répondre à la question posée.",
["Enclos le long d'une rivière, 40 m de clôture : \\(A(x) = x(40 - 2x)\\), \\(A'(x) = 40 - 4x = 0\\), \\(x = 10\\) m, aire 200 m².", "Boîte dans un carré de 30 cm : \\(V'(x) = (30 - 2x)(30 - 6x)\\), \\(x = 5\\) cm."], "Lis bien ce qu'on demande : la valeur de \\(x\\) ou la valeur optimale de la grandeur."],
comps: ["Optimiser avec une fonction de degré 2 (dérivée)", "Optimiser avec une fonction de degré 3", "Optimiser avec une contrainte (boîte, cylindre, coût)"] },
];


for (const n of NEW) {
if (!NOTIONS.some((x) => x.id === n.id)) NOTIONS.push(Object.assign({ id: n.id, theme: n.theme, label: n.label, ex: n.ex, CH: n.CH, MP: null, FR: null }, n.niv ? { niv: n.niv } : {}));
GEN[n.id] = (d) => pickForm(n.lv[Math.min(Math.max(d, 1), 3)]);
HINTS_EXTRA[n.id] = n.hint;
LESSONS_EXTRA[n.id] = n.lesson;
if (typeof COMPS !== "undefined") COMPS[n.id] = n.comps;
if (typeof PROB_EXTRA !== "undefined") PROB_EXTRA[n.id] = PROBS[n.id];
}

if (typeof LESSON_FIGS !== "undefined") {
const fq = (x) => 0.5 * x * x - 1;
LESSON_FIGS.nbderive = () => PL([{ f: fq }, { f: (x) => 2 * (x - 2) + 1, cls: "f-line", dash: true }, { f: (x) => 2.5 * (x - 2) + 1, cls: "f-line" }], [[2, 1, "A"], [3, 3.5, "B"]], { xr: [-3, 5], yr: [-2, 6], label: "sécante AB et tangente en A" });
LESSON_FIGS.tangente = () => PL([{ f: fq }, { f: (x) => 2 * (x - 2) + 1, cls: "f-line", dash: true }], [[2, 1, "(a ; f(a))"]], { xr: [-3, 5], yr: [-2, 6], label: "tangente au point d'abscisse a" });
}
})();








(function () {
if (typeof NOTIONS === "undefined" || typeof GEN === "undefined") return;

const pk = (a) => a[Math.floor(R.rand() * a.length)];
const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; };
const ri = R.int;
const r6 = (v) => +(+v).toFixed(9);
const den = (v) => { for (let d = 1; d <= 1000; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-7) return d; return 0; };

const grp = (v, sep, dp) => { const [i, f] = String(+(+v).toFixed(8)).split("."); return (Math.abs(+i) >= 1000 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : i) + (f ? dp + f : ""); };
const D = (v) => grp(v, "\\text{'}", "{,}");
const T = (v) => grp(v, "'", ",").replace(/^-/, "−");

const fT = (v) => { v = r6(v); const d = den(v); if (d === 1 || !d || d > 400) return D(v); const n = Math.round(v * d); return (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
const fS = (v) => { v = r6(v); const d = den(v); if (d === 1) return String(Math.round(v)); if (!d) return String(v); return Math.round(v * d) + "/" + d; };
const fX = (v) => fS(v).replace(/^-/, "−");
const par = (v) => (v < 0 ? "(" + fT(v) + ")" : fT(v));
const sg = (v) => (v < 0 ? " - " + fT(-v) : " + " + fT(v));
const lt = (c) => (c === 1 ? " + x" : c === -1 ? " - x" : sg(c) + "x");
const P2 = (cs, x = "x") => poly(ptrim(cs), x);
const pv = (cs, x) => cs.reduce((a, c) => a * x + c, 0);
const dP = (cs) => cs.slice(0, -1).map((c, i) => c * (cs.length - 1 - i));
const xm = (p, x = "x") => (p === 0 ? x : p > 0 ? x + " - " + fT(p) : x + " + " + fT(-p));
const xmT = (p) => (p === 0 ? "x" : p > 0 ? "x − " + fX(p) : "x + " + fX(-p));
const pT = (cs) => poly(ptrim(cs)).replace(/\^\{?2\}?/g, "²").replace(/\^\{?3\}?/g, "³").replace(/\^\{?4\}?/g, "⁴").replace(/\\frac\{(\d+)\}\{(\d+)\}/g, "$1/$2").replace(/-/g, "−");
const setT = (vs) => "\\{" + [...vs].sort((a, b) => a - b).map(fT).join(" \\,;\\, ") + "\\}";
const cases = (e1, c1, e2, c2) => "f(x) = \\begin{cases} " + e1 + " & \\text{si } " + c1 + " \\\\ " + e2 + " & \\text{si } " + c2 + " \\end{cases}";
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
const Cb = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return Math.round(r); };
const bn = (n, k) => "\\binom{" + n + "}{" + k + "}";
const PL = (fns, pts, o = {}) => { const yr = o.yr || [-6, 6]; return FIG.plot(fns, pts || [], Object.assign({ numbers: true, xr: [-6, 6], yr: [-6, 6], maxH: 300 }, yr[1] - yr[0] > 11 ? { step: 2 } : {}, o)); };

const vis = (t) => t.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, (m, a, b) => (a.length > b.length ? a : b)).replace(/\\[a-zA-Z]+/g, "x").replace(/\\[,;!]|[{}\s]/g, "");
const cut = (t) => { const out = []; let d = 0, last = 0;
for (let i = 0; i < t.length; i++) { const c = t[i];
if (c === "{") d++; else if (c === "}") d--; else if (t.startsWith("\\left", i)) d++; else if (t.startsWith("\\right", i)) d--;
else if (d === 0 && i > last + 1) { const m = /^ (=|\\iff|\\approx) /.exec(t.slice(i)); if (m) { out.push(t.slice(last, i)); last = i + 1; i += m[0].length - 2; } } }
out.push(t.slice(last)); return out; };
const wrapM = (h) => (typeof h !== "string" ? h : h.replace(/\\\((.*?)\\\)/g, (m, t) => { if (/\\begin/.test(t) || vis(t).length <= 22) return m; const ps = cut(t); if (ps.length < 2) return m;
const ch = []; let cur = ""; for (const p of ps) { if (cur && vis(cur + p).length > 22) { ch.push(cur); cur = p; } else cur = cur ? cur + " " + p : p; } ch.push(cur);
return ch.map((c) => "\\(" + c + "\\)").join(" "); }));

const keepT = (spec, traps) => { const seen = new Set(), tol = Math.max(spec.round || 0, 1e-9); return (traps || []).filter((tr) => {
if (!tr) return false;
if (tr.s) { if (spec.kind !== "set" || !tr.s.every(isFinite)) return false; const k = tr.s.map(r6).sort((a, b) => a - b).join(";"); if (seen.has(k) || checkAnswer(spec, tr.s.map(fS).join(" ; ")).status === "correct") return false; seen.add(k); return true; }
if (tr.spec) { const c = tr.spec.kind === "pair" ? tr.spec.values.map(fS).join(" ; ") : SolSet.show(tr.spec.ivs, false); if (seen.has(c) || checkAnswer(spec, c).status === "correct" || checkAnswer(tr.spec, c).status !== "correct") return false; seen.add(c); return true; }
if (spec.kind !== "value") return false;
const k = spec.round ? Math.round(tr.v / spec.round) : r6(tr.v);
if (!isFinite(tr.v) || Math.abs(tr.v - spec.value) <= tol || seen.has(k)) return false; seen.add(k); return true; }); };
const mk = (q, spec, sol, o) => { const x = { q: wrapM(q), spec, sol: wrapM(sol), guide: (o.guide || []).map((g) => Object.assign({}, g, { ask: wrapM(g.ask), sol: wrapM(g.sol) })), ctx: o.ctx, traps: keepT(spec, o.traps) }; if (o.fig) x.fig = o.fig; if (o.canon) x.canon = o.canon; return x; };
const QN = (q, value, sol, o) => mk(q, { kind: "value", value: r6(value) }, sol, o);
const QSet = (q, vals, sol, o) => mk(q, { kind: "set", values: [...new Set(vals.map(r6))].sort((a, b) => a - b) }, sol, o);
const QP = (q, vals, sol, o) => mk(q, { kind: "pair", values: vals.map(r6) }, sol, Object.assign({ canon: vals.map(fS).join(" ; ") }, o));
const QS = (q, ivs, sol, o) => mk(q, solsetSpec(ivs), sol, Object.assign({ canon: SolSet.show(ivs, false) }, o));
const G = (ask, value, sol) => GS(ask, r6(value), sol);
const dS3 = (v) => D(+(+v).toFixed(3));
const GSet = (ask, vals, sol) => ({ ask, spec: { kind: "set", values: [...new Set(vals.map(r6))].sort((a, b) => a - b) }, sol });
const GP = (ask, vals, sol) => ({ ask, spec: { kind: "pair", values: vals.map(r6) }, sol });
const GSS = (ask, ivs, sol) => ({ ask, spec: solsetSpec(ivs), sol });
const TR = (v, m) => TRAP(r6(v), m);
const TSt = (s, m) => ({ s, m });
const TP = (vals, m) => ({ spec: { kind: "pair", values: vals.map(r6) }, m });
const TS = (ivs, m) => ({ spec: solsetSpec(ivs), m });

const P = (q, parts, hints, sol, fig) => ({ fig, q: wrapM(q), sol: wrapM(sol), hints, parts: parts.map(([label, v, round]) => ({ label, spec: v && typeof v === "object" ? v : Object.assign({ kind: "value", value: r6(v) }, round ? { round } : {}) })) });
const SET = (vals) => ({ kind: "set", values: [...new Set(vals.map(r6))].sort((a, b) => a - b) });
const lim = (to) => "\\lim_{x \\to " + to + "}";
const ITEMS = [["boules", "rouges", "bleues", "rouge", "bleue"], ["billes", "vertes", "jaunes", "verte", "jaune"], ["perles", "noires", "blanches", "noire", "blanche"]];


const LI = {
1: [
() => { const x0 = ri(-2, 2), V = [-4, -3, -2, 2, 3, 4], L1 = pk(V), L2 = pk(V), m1 = pk([1, -1, 0.5, -0.5]), m2 = pk([1, -1, 0.5, -0.5]), g = R.rand() < 0.5, v = g ? L1 : L2;
if (Math.abs(L1 - L2) < 2 || v === x0) return null;
const f1 = (x) => L1 + m1 * (x - x0), f2 = (x) => L2 + m2 * (x - x0), cond = g ? "x < " + x0 : "x > " + x0;
return QN("Le graphique représente une fonction " + M("f") + " (le point plein donne " + M("f(" + x0 + ")") + "). Que vaut " + M("\\lim_{x \\to " + x0 + ",\\; " + cond + "} f(x)") + " ?", v,
"Quand " + M("x") + " s'approche de " + M(x0) + (g ? " par la gauche" : " par la droite") + ", la courbe se dirige vers la hauteur " + M(v) + ". " + (g ? "Ici, la limite à gauche (" + M(L1) + ") n'est pas égale à la limite à droite (" + M(L2) + ") : la courbe fait un saut." : "Ici, la limite à droite est égale à " + M("f(" + x0 + ")") + "."),
{ ctx: g ? "lecture-gauche" : "lecture-droite", fig: PL([{ f: f1, to: x0, cls: "f-accent" }, { f: f2, from: x0, cls: "f-accent" }], [[x0, L2, ""]]),
guide: [G("Suis la courbe " + (g ? "à gauche" : "à droite") + " de " + M("x = " + x0) + " en te rapprochant de cette abscisse : vers quelle hauteur va-t-elle ?", v, M(v) + ".")],
traps: [TR(g ? L2 : L1, g ? "C'est la limite à droite (et f(" + T(x0) + ")) : on demande x < " + T(x0) + ", à gauche." : "C'est la limite à gauche : on demande x > " + T(x0) + ", à droite."), TR(-v, "Vérifie le signe de la hauteur lue."), TR(x0, "C'est l'abscisse ; la limite se lit sur l'axe vertical.")] }); },
() => { const a = nz(-4, 4), p = pk([1, 2, -1, 3, -2]), q = nz(-6, 6), r = ri(-6, 6), cs = [p, q, r], v = pv(cs, a); if (Math.abs(v) <= 1) return null;
return QN("Calcule " + M(lim(a) + " \\left(" + P2(cs) + "\\right)") + ".", v, "Un polynôme est continu : sa limite en " + M(a) + " est sa valeur en " + M(a) + ". " + M(fT(p) + " \\cdot " + par(a) + "^2" + (q < 0 ? " - " : " + ") + Math.abs(q) + " \\cdot " + par(a) + (r ? sg(r) : "") + " = " + v) + ".",
{ ctx: "polynome", guide: [G("Valeur de " + M(P2([p, 0, 0])) + " en " + M("x = " + a) + " ?", p * a * a, M(p * a * a) + "."), G("Valeur de " + M(P2([q, 0])) + " en " + M("x = " + a) + " ?", q * a, M(q * a) + "."), G("Limite ?", v, M(v) + ".")],
traps: [TR(pv(cs, -a), "Remplace x par " + T(a) + " avec son signe."), TR(2 * p * a + q * a + r, "x² = x · x, pas 2x."), TR(p * a * a + q + r, "Le terme en x se multiplie aussi par " + T(a) + ".")] }); },
() => { const a = nz(-4, 4), b = nz(-5, 5), c = ri(-6, 6), d = pk([1, 2, 3, -1, -2]), e = ri(-6, 6), N = b * a + c, Dn = d * a + e; if (!Dn || !N || Math.abs(N) === Math.abs(Dn) || b * Dn === d * N) return null; const v = N / Dn;
return QN("Calcule " + M(lim(a) + " \\frac{" + P2([b, c]) + "}{" + P2([d, e]) + "}") + ".", v, "Le dénominateur ne s'annule pas en " + M(a) + " : on remplace " + M("x") + " par " + M(a) + ". " + M("\\frac{" + N + "}{" + Dn + "}" + (den(v) < Math.abs(Dn) ? " = " + fT(v) : "")) + ".",
{ ctx: "rationnelle-directe", guide: [G("Numérateur en " + M("x = " + a) + " ?", N, M(N) + "."), G("Dénominateur en " + M("x = " + a) + " ?", Dn, M(Dn) + " : il n'est pas nul, on peut diviser."), G("Limite ?", v, M(fT(v)) + ".")],
traps: [TR(Dn / N, "Numérateur divisé par dénominateur, pas l'inverse."), TR(b / d, "C'est la limite à l'infini ; ici x tend vers " + T(a) + "."), TR(-v, "Attention aux signes.")] }); },
],
2: [
() => { const a = nz(-5, 5), b = ri(-6, 6); if (Math.abs(a - b) < 2) return null; const v = a - b, num = [1, -(a + b), a * b];
return QN("Calcule " + M(lim(a) + " \\frac{" + P2(num) + "}{" + xm(a) + "}") + ".", v,
"En " + M(a) + " : forme " + M("\\frac{0}{0}") + ". " + M(P2(num) + " = (" + xm(a) + ")(" + xm(b) + ")") + ", donc le quotient vaut " + M(xm(b)) + " pour " + M("x \\neq " + a) + " ; limite " + M(a + " - " + par(b) + " = " + v) + ".",
{ ctx: "factorisation", guide: [G("Le numérateur s'annule en " + M(a) + " : il se factorise en " + M("(" + xm(a) + ")(x - b)") + ". Que vaut " + M("b") + " ?", b, M(b) + "."), G("Après simplification, il reste " + M(xm(b)) + ". Limite en " + M(a) + " ?", v, M(v) + ".")],
traps: [TR(0, "0 ÷ 0 n'est pas un résultat : simplifie d'abord par (" + xmT(a) + ")."), TR(b - a, "Il reste " + xmT(b) + " : en x = " + T(a) + ", cela donne " + T(a) + " − (" + T(b) + ")."), TR(a + b, "Factorise le numérateur, simplifie, puis remplace x.")] }); },
() => { const a = nz(-4, 4), c = ri(-5, 5); if (c === a || c === -a) return null; const v = (2 * a) / (a - c); if (Math.abs(v) === 1) return null; const num = [1, 0, -a * a], dn = [1, -(a + c), a * c];
return QN("Calcule " + M(lim(a) + " \\frac{" + P2(num) + "}{" + P2(dn) + "}") + ".", v,
"Forme " + M("\\frac{0}{0}") + ". " + M(P2(num) + " = (" + xm(a) + ")(" + xm(-a) + ")") + " et " + M(P2(dn) + " = (" + xm(a) + ")(" + xm(c) + ")") + ". On simplifie : " + M("\\frac{" + xm(-a) + "}{" + xm(c) + "}") + ", qui tend vers " + M("\\frac{" + 2 * a + "}{" + (a - c) + "}" + (den(v) < Math.abs(a - c) ? " = " + fT(v) : "")) + ".",
{ ctx: "deux-factorisations", guide: [G("Après simplification par " + M("(" + xm(a) + ")") + ", le numérateur devient " + M(xm(-a)) + ". Sa valeur en " + M(a) + " ?", 2 * a, M(2 * a) + "."), G("Le dénominateur devient " + M(xm(c)) + ". Sa valeur en " + M(a) + " ?", a - c, M(a - c) + "."), G("Limite ?", v, M(fT(v)) + ".")],
traps: [TR(0, "0 ÷ 0 n'est pas un résultat : factorise et simplifie."), TR((a - c) / (2 * a), "Numérateur divisé par dénominateur, pas l'inverse."), a + c ? TR((2 * a) / (a + c), "Le dénominateur se factorise en (x − " + T(a) + ")(" + xmT(c) + ").") : null] }); },
() => { const a = pk([2, 3, -2, -3, 4]), v = 3 * a * a;
return QN("Calcule " + M(lim(a) + " \\frac{" + P2([1, 0, 0, -(a ** 3)]) + "}{" + xm(a) + "}") + ".", v,
"Forme " + M("\\frac{0}{0}") + ". " + M(P2([1, 0, 0, -(a ** 3)]) + " = (" + xm(a) + ")(" + P2([1, a, a * a]) + ")") + " : le quotient vaut " + M(P2([1, a, a * a])) + ", qui tend vers " + M(a * a + sg(a * a) + sg(a * a) + " = " + v) + ".",
{ ctx: "cube", guide: [G("On factorise : " + M(P2([1, 0, 0, -(a ** 3)]) + " = (" + xm(a) + ")(" + P2([1, a, a * a]) + ")") + ". Valeur de " + M(P2([1, a, a * a])) + " en " + M("x = " + a) + " ?", v, M(v) + ".")],
traps: [TR(a * a, "Les trois termes valent chacun " + T(a * a) + " en x = " + T(a) + "."), TR(3 * a, "En x = " + T(a) + ", x² vaut " + T(a * a) + "."), TR(0, "0 ÷ 0 n'est pas un résultat : factorise d'abord.")] }); },
],
3: [
() => { const c = ri(2, 5), a = nz(-4, 6), b = c * c - a, v = 1 / (2 * c), rt = "\\sqrt{" + P2([1, b]) + "}";
return QN("Calcule " + M(lim(a) + " \\frac{" + rt + " - " + c + "}{" + xm(a) + "}") + ".", v,
"Forme " + M("\\frac{0}{0}") + ". On multiplie par la quantité conjuguée " + M(rt + " + " + c) + " : le numérateur devient " + M(P2([1, b]) + " - " + c * c + " = " + xm(a)) + ", d'où " + M("\\frac{1}{" + rt + " + " + c + "}") + ", qui tend vers " + M("\\frac{1}{" + 2 * c + "}") + ".",
{ ctx: "conjuguee", guide: [G("Après multiplication par la quantité conjuguée et simplification, il reste " + M("\\frac{1}{" + rt + " + " + c + "}") + ". Valeur du dénominateur en " + M(a) + " ?", 2 * c, M(c + " + " + c + " = " + 2 * c) + "."), G("Limite ?", v, M("\\frac{1}{" + 2 * c + "}") + ".")],
traps: [TR(1 / c, "Le dénominateur tend vers " + c + " + " + c + " = " + 2 * c + "."), TR(2 * c, "C'est le dénominateur : la limite est son inverse."), TR(0, "0 ÷ 0 n'est pas un résultat : utilise la quantité conjuguée.")] }); },
() => { const a = pk([2, 3, 4, 5, -2, -3, -4]), v = -1 / (a * a), fr = "\\frac{1}{x}" + (a > 0 ? " - \\frac{1}{" + a + "}" : " + \\frac{1}{" + -a + "}");
return QN("Calcule " + M(lim(a) + " \\frac{" + fr + "}{" + xm(a) + "}") + ".", v,
M(fr + " = \\frac{" + a + " - x}{" + a + "x} = \\frac{-(" + xm(a) + ")}{" + a + "x}") + " ; après division par " + M("(" + xm(a) + ")") + ", il reste " + M("\\frac{-1}{" + a + "x}") + ", qui tend vers " + M("\\frac{-1}{" + a * a + "}") + ".",
{ ctx: "fractions-etagees", guide: [G("Au même dénominateur, puis après division par (" + xmT(a) + "), il reste −1 ÷ (" + T(a) + "x). Valeur de " + M(a + "x") + " en " + M("x = " + a) + " ?", a * a, M(a * a) + "."), G("Limite ?", v, M(fT(v)) + ".")],
traps: [TR(1 / (a * a), "Signe : 1/x − 1/a = (a − x) ÷ (ax), et a − x = −(x − a)."), TR(-1 / a, "Le dénominateur " + T(a) + "x tend vers " + T(a * a) + "."), TR(0, "0 ÷ 0 n'est pas un résultat : réduis au même dénominateur.")] }); },
() => { const a = nz(-4, 4), b = nz(-5, 5); if (b === a || Math.abs(a + b) < 2) return null; const c = a * b, k = -(a + b), ka = a === 1 ? " + k" : a === -1 ? " - k" : (a < 0 ? " - " + -a : " + " + a) + "k";
return QN("Pour quelle valeur de " + M("k") + " la limite " + M(lim(a) + " \\frac{x^2 + kx" + sg(c) + "}{" + xm(a) + "}") + " est-elle un nombre (finie) ?", k,
"Le dénominateur s'annule en " + M(a) + " : il faut que le numérateur s'annule aussi (forme " + M("\\frac{0}{0}") + "). " + M(a * a + ka + sg(c) + " = 0") + ", donc " + M("k = " + k) + ". Alors " + M("x^2" + lt(k) + sg(c) + " = (" + xm(a) + ")(" + xm(b) + ")") + " et la limite vaut " + M(a - b) + ".",
{ ctx: "parametre", guide: [G("Il faut que le numérateur s'annule en " + M("x = " + a) + " : " + M(a * a + ka + sg(c) + " = 0") + ". Que vaut " + M(a + " \\cdot k") + " ?", -(a * a + c), M(-(a * a + c)) + "."), G(M("k") + " ?", k, M(k) + ".")],
traps: [TR(a + b, "Vérifie le signe : " + T(a * a) + (a < 0 ? " − " + T(-a) : " + " + T(a)) + "k + " + T(c) + " = 0."), Math.abs(a) > 1 ? TR(-(a * a + c), "C'est " + T(a) + "k : divise encore par " + T(a) + ".") : null, TR(b, "C'est l'autre racine du numérateur, pas k.")] }); },
],
};


const LF = {
1: [
() => { const a = nz(-6, 6), d = pk([2, 3, 4, 5, -2, -3]), b = ri(-5, 5), c = nz(-7, 7), e = nz(-7, 7), v = a / d, inf = pk(["+\\infty", "-\\infty"]); if (Math.abs(v) === 1) return null;
return QN("Calcule " + M(lim(inf) + " \\frac{" + P2([a, b, c]) + "}{" + P2([d, 0, e]) + "}") + ".", v, "À l'infini, seuls les termes de plus haut degré comptent : " + M("\\frac{" + P2([a, 0, 0]) + "}{" + P2([d, 0, 0]) + "} = " + fT(v)) + ".",
{ ctx: "degres-egaux", guide: [G("Terme dominant du numérateur : son coefficient ?", a, M(P2([a, 0, 0])) + "."), G("Terme dominant du dénominateur : son coefficient ?", d, M(P2([d, 0, 0])) + "."), G("Limite ?", v, M(fT(v)) + ".")],
traps: [TR(c / e, "C'est la valeur en x = 0 ; à l'infini, ce sont les termes de plus haut degré qui comptent."), TR(d / a, "Numérateur divisé par dénominateur, pas l'inverse."), TR(-v, "Les deux termes dominants sont en x² : le signe de x ne change rien.")] }); },
() => { const k = pk([-5, -4, -3, -2, 2, 3, 4, 5]), m = pk([2, 3, 5, 7, -2, -3, -5, -7]), xs = [10, 100, 1000, 10000], ys = xs.map((x) => r6(k + m / x));
return QN("Voici quelques valeurs d'une fonction " + M("f") + " :<br>" + M("\\begin{array}{c|c|c|c|c} x & 10 & 100 & 1\\text{'}000 & 10\\text{'}000 \\\\ \\hline f(x) & " + ys.map(D).join(" & ") + " \\end{array}") + "<br>Quelle est, vraisemblablement, " + M(lim("+\\infty") + " f(x)") + " ?", k,
"Quand " + M("x") + " grandit, " + M("f(x)") + " se rapproche de " + M(k) + " : l'écart (" + M(D(ys[0] - k)) + ", puis " + M(D(r6(ys[1] - k))) + ", …) est divisé par 10 à chaque fois. " + M(lim("+\\infty") + " f(x) = " + k) + ".",
{ ctx: "tableau-valeurs", guide: [G("Les valeurs se rapprochent d'un nombre entier quand " + M("x") + " grandit. Lequel ?", k, M(k) + ".")],
traps: [TR(ys[0], "C'est f(10) : regarde ce que deviennent les valeurs pour x très grand."), TR(0, "f(x) ne devient pas petit : c'est l'écart à " + T(k) + " qui tend vers 0."), TR(-k, "Vérifie le signe des valeurs.")] }); },
() => { const C = pk([["Pendant une perfusion, la concentration d'un médicament dans le sang vaut", "C(t)", "mg/L", "heures", "concentration", [3, 4, 5, 6, 8, 12]], ["Le nombre d'abonnés à une nouvelle application vaut", "N(t)", "milliers d'abonnés", "mois", "abonnes", [12, 15, 24, 40, 45]], ["La vitesse d'un parachutiste, parachute fermé, vaut", "v(t)", "m/s", "secondes", "parachutiste", [48, 50, 52, 54, 55]]]);
const L = pk(C[5]), k = pk([2, 3, 4]), b = ri(2, 9), a = k * L; if (b === L) return null;
return QN(C[0] + " " + M(C[1] + " = \\frac{" + a + "t}{" + k + "t + " + b + "}") + " (" + M("t") + " en " + C[3] + "). Vers quelle valeur (en " + C[2] + ") tend-elle quand " + M("t") + " devient très grand ?", L,
"Pour " + M("t") + " très grand, " + M(k + "t + " + b + " \\approx " + k + "t") + " : " + M("\\frac{" + a + "t}{" + k + "t} = " + L) + ". " + M("\\lim_{t \\to +\\infty} " + C[1] + " = " + L) + " " + C[2] + ".",
{ ctx: C[4], guide: [G("Pour t très grand, " + k + "t + " + b + " ≈ " + k + "t. Simplifie " + M("\\frac{" + a + "t}{" + k + "t}") + " :", L, M(L) + ".")],
traps: [TR(a, "Divise par " + k + " : au dénominateur, " + k + "t + " + b + " ≈ " + k + "t."), TR(a / b, "Le terme " + b + " ne compte plus quand t est très grand."), TR(0, "Le numérateur grandit aussi : la limite n'est pas 0.")] }); },
],
2: [
() => { const a = pk([2, 3, -2, -3, 4]), c = pk([2, 3, 5, 6, 8, 12]), b = nz(-5, 5), d = nz(-9, 9), v = (a * a) / c, inf = pk(["+\\infty", "-\\infty"]); if (Math.abs(v) === 1) return null;
return QN("Calcule " + M(lim(inf) + " \\frac{(" + P2([a, b]) + ")^2}{" + P2([c, 0, d]) + "}") + ".", v, "Développé, le numérateur commence par " + M("(" + a + "x)^2 = " + a * a + "x^2") + ". Termes dominants : " + M("\\frac{" + a * a + "x^2}{" + c + "x^2} = " + fT(v)) + ".",
{ ctx: "carre", guide: [G("Terme de plus haut degré du numérateur : son coefficient ?", a * a, M("(" + a + "x)^2 = " + a * a + "x^2") + "."), G("Limite ?", v, M(fT(v)) + ".")],
traps: [TR(a / c, "Le carré porte aussi sur " + T(a) + "x : (" + T(a) + "x)² = " + T(a * a) + "x²."), TR((2 * a) / c, "Le terme en x² vient de (" + T(a) + "x)², pas du double produit."), TR(-v, "Un carré est positif, et " + c + "x² aussi.")] }); },
() => { const a = pk([1, 2, 3, -2, -1]), c = nz(-5, 5), b = nz(-9, 9), v = -a * c; if (Math.abs(v) < 2) return null;
const ax = a > 0 ? " - " + (a === 1 ? "" : a) + "x" : " + " + (a === -1 ? "" : -a) + "x";
return QN("Calcule " + M(lim("+\\infty") + " \\left(\\frac{" + P2([a, 0, b]) + "}{" + xm(-c) + "}" + ax + "\\right)") + ".", v,
"Forme « ∞ − ∞ ». Au même dénominateur : " + M("\\frac{" + P2([a, 0, b]) + " - " + (a === 1 ? "" : a === -1 ? "-" : a) + "x(" + xm(-c) + ")}{" + xm(-c) + "} = \\frac{" + P2([-a * c, b]) + "}{" + xm(-c) + "}") + ", qui tend vers " + M("\\frac{" + (-a * c) + "x}{x} = " + v) + ".",
{ ctx: "difference", guide: [G("Au même dénominateur, le numérateur devient un polynôme de degré 1 : " + M(P2([-a * c, b])) + ". Son coefficient de " + M("x") + " ?", -a * c, M(-a * c) + "."), G("Limite ?", v, M(v) + ".")],
traps: [TR(a * c, "Signe : le terme " + T(a) + "x(" + xmT(-c) + ") se soustrait en entier."), TR(0, "« ∞ − ∞ » n'est pas 0 : réduis au même dénominateur."), TR(b, "Le terme constant ne compte plus à l'infini ; c'est le coefficient de x qui donne la limite.")] }); },
() => { const a = nz(-6, 6), c = pk([1, 2, 3, -1, -2]), e = pk([2, 3, 4, -2]), d = nz(-5, 5), f = nz(-5, 5), b = ri(-5, 5), v = a / (c * e), inf = pk(["+\\infty", "-\\infty"]); if (Math.abs(v) === 1) return null;
return QN("Calcule " + M(lim(inf) + " \\frac{" + P2([a, b, 0]) + "}{(" + P2([c, d]) + ")(" + P2([e, f]) + ")}") + ".", v, "Le dénominateur développé commence par " + M(P2([c * e, 0, 0])) + ". Termes dominants : " + M("\\frac{" + P2([a, 0, 0]) + "}{" + P2([c * e, 0, 0]) + "} = " + fT(v)) + ".",
{ ctx: "produit", guide: [G("Terme dominant du dénominateur (produit des deux termes en x) : son coefficient ?", c * e, M(P2([c * e, 0, 0])) + "."), G("Limite ?", v, M(fT(v)) + ".")],
traps: [c + e ? TR(a / (c + e), "Les termes en x se multiplient : (" + pT([c, 0]) + ")(" + pT([e, 0]) + ") = " + pT([c * e, 0, 0]) + ".") : null, TR(a / c, "Le second facteur compte aussi."), TR(-v, "Les deux termes dominants sont en x² : le signe de x ne change rien.")] }); },
],
3: [
() => { const a = pk([3, 4, 5, 6, 7, 8, -3, -4, -5, -6, -7, -8]), v = a / 2;
return QN("Calcule " + M(lim("+\\infty") + " \\left(\\sqrt{" + P2([1, a, 0]) + "} - x\\right)") + ".", v,
"Forme « ∞ − ∞ ». Quantité conjuguée : " + M("\\frac{(" + P2([1, a, 0]) + ") - x^2}{\\sqrt{" + P2([1, a, 0]) + "} + x} = \\frac{" + P2([a, 0]) + "}{\\sqrt{" + P2([1, a, 0]) + "} + x}") + ". Pour " + M("x") + " très grand, le dénominateur vaut environ " + M("2x") + " : " + M("\\frac{" + P2([a, 0]) + "}{2x} = " + fT(v)) + ".",
{ ctx: "conjuguee-infini", guide: [G("Après multiplication par la quantité conjuguée, le numérateur devient " + M("kx") + ". Que vaut " + M("k") + " ?", a, M(P2([a, 0])) + "."), G("Le dénominateur " + M("\\sqrt{" + P2([1, a, 0]) + "} + x") + " vaut environ combien de fois " + M("x") + " ?", 2, M("x + x = 2x") + "."), G("Limite ?", v, M(fT(v)) + ".")],
traps: [TR(a, "Le dénominateur √(x² + …) + x vaut environ 2x, pas x."), TR(0, "« ∞ − ∞ » n'est pas 0 : multiplie par la quantité conjuguée."), TR(-v, "Vérifie le signe.")] }); },
() => { const a = pk([2, 3, 4, 5, -2, -3, -4, -5]), b = nz(-6, 6), c = pk([1, 3, 4, 5, 9]), v = -a;
return QN("Calcule " + M(lim("-\\infty") + " \\frac{" + P2([a, b]) + "}{\\sqrt{" + P2([1, 0, c]) + "}}") + ".", v,
"Pour " + M("x") + " très négatif, " + M("\\sqrt{" + P2([1, 0, c]) + "} \\approx \\sqrt{x^2} = |x| = -x") + ". Donc " + M("\\frac{" + P2([a, 0]) + "}{-x} = " + v) + ".",
{ ctx: "racine-moins-infini", guide: [G("Pour " + M("x < 0") + ", " + M("\\sqrt{x^2} = |x| = kx") + ". Que vaut " + M("k") + " ?", -1, M("|x| = -x") + " pour " + M("x < 0") + "."), G("Limite ?", v, M(v) + ".")],
traps: [TR(a, "Pour x < 0, √(x²) = |x| = −x, pas x."), TR(0, "Numérateur et dénominateur sont tous deux « de degré 1 »."), TR(b, "Le terme constant ne compte plus à l'infini.")] }); },
() => { const c = pk([2, 3, 4, 5]), L = pk([2, 3, -2, -3, 1.5, -1.5, 2.5, 0.5, -0.5]), k = r6(c * L); if (!Number.isInteger(k) || Math.abs(k) < 2) return null; const b = nz(-6, 6), d = nz(-9, 9);
return QN("Pour quelle valeur de " + M("k") + " a-t-on " + M(lim("+\\infty") + " \\frac{kx^2" + lt(b) + "}{" + P2([c, 0, d]) + "} = " + fT(L)) + " ?", k,
"La limite vaut " + M("\\frac{k}{" + c + "}") + " (termes dominants). " + M("\\frac{k}{" + c + "} = " + fT(L) + " \\iff k = " + k) + ".",
{ ctx: "parametre-infini", guide: [G("La limite est le quotient des coefficients dominants : " + M("\\frac{k}{" + c + "}") + ". Résous " + M("\\frac{k}{" + c + "} = " + fT(L)) + " : " + M("k") + " ?", k, M(k) + ".")],
traps: [TR(L, "La limite vaut k ÷ " + c + " : multiplie par " + c + "."), TR(L / c, "On multiplie par " + c + ", on ne divise pas."), TR(-k, "Vérifie le signe.")] }); },
],
};


const AS = {
1: [
() => { const a = nz(-5, 5), b = ri(-6, 6), k = pk([2, 3, 4, -2]), c = pk([-5, -4, -3, -2, 2, 3, 4, 5]); if (a * c + b === 0) return null;
return QN("Soit " + M("f(x) = \\frac{" + P2([a, b]) + "}{" + P2([k, -k * c]) + "}") + ". Son asymptote verticale a pour équation " + M("x = c") + ". Que vaut " + M("c") + " ?", c,
"Le dénominateur s'annule en " + M("x = " + c) + ", et le numérateur n'y vaut pas 0 (" + M(a * c + b) + ") : asymptote verticale " + M("x = " + c) + ".",
{ ctx: "verticale", guide: [G("Résous " + M(P2([k, -k * c]) + " = 0") + " : " + M("x") + " ?", c, M("x = " + c) + ".")],
traps: [TR(-c, "Résous " + pT([k, -k * c]) + " = 0 : vérifie le signe."), b ? TR(-b / a, "C'est là que le numérateur s'annule (f vaut 0) ; l'asymptote vient du dénominateur.") : null, TR(-k * c, "Résous l'équation : divise par " + T(k) + ".")] }); },
() => { const a = nz(-6, 6), c = pk([2, 3, 4, 5, -2, -3]), b = ri(-6, 6), d = nz(-6, 6), v = a / c; if (Math.abs(v) === 1 || a * d === b * c) return null;
return QN("L'asymptote horizontale de " + M("f(x) = \\frac{" + P2([a, b]) + "}{" + P2([c, d]) + "}") + " a pour équation " + M("y = k") + ". Que vaut " + M("k") + " ?", v,
"À l'infini, " + M("f(x) \\approx \\frac{" + P2([a, 0]) + "}{" + P2([c, 0]) + "} = " + fT(v)) + " : asymptote horizontale " + M("y = " + fT(v)) + ".",
{ ctx: "horizontale", guide: [G("Limite de " + M("f(x)") + " à l'infini (quotient des coefficients de " + M("x") + ") ?", v, M(fT(v)) + ".")],
traps: [b ? TR(b / d, "C'est f(0) ; l'asymptote horizontale est la limite à l'infini.") : null, TR(c / a, "Numérateur divisé par dénominateur, pas l'inverse."), TR(-d / c, "C'est l'asymptote verticale (x = …).")] }); },
() => { const V = [-4, -3, -2, 2, 3, 4], c = pk(V), k = pk(V), m = pk([1, 2, -1, -2, 3, -3]), askV = R.rand() < 0.5, v = askV ? c : k;
return QN("La courbe de " + M("f") + " a deux asymptotes (en pointillés). " + (askV ? "L'asymptote verticale a pour équation " + M("x = a") + ". Que vaut " + M("a") : "L'asymptote horizontale a pour équation " + M("y = b") + ". Que vaut " + M("b")) + " ?", v,
"Asymptote verticale " + M("x = " + c) + " (la courbe file vers l'infini près de cette droite) ; asymptote horizontale " + M("y = " + k) + " (la courbe s'en approche quand " + M("x") + " devient très grand).",
{ ctx: askV ? "lecture-verticale" : "lecture-horizontale", fig: PL([{ f: (x) => k + m / (x - c) }], [], { vlines: [c], hlines: [k] }),
guide: [G(askV ? "La droite verticale en pointillés coupe l'axe horizontal en ?" : "La droite horizontale en pointillés coupe l'axe vertical en ?", v, M(v) + ".")],
traps: [TR(askV ? k : c, askV ? "C'est l'asymptote horizontale (y = …)." : "C'est l'asymptote verticale (x = …)."), TR(-v, "Lis le signe sur l'axe.")] }); },
],
2: [
() => { const r1 = nz(-5, 5), r2 = nz(-5, 5), a = nz(-4, 4), b = ri(-6, 6); if (r1 === r2 || r1 === -r2 || a * r1 + b === 0 || a * r2 + b === 0) return null; const dn = [1, -(r1 + r2), r1 * r2];
return QSet("Quelles sont les asymptotes verticales de " + M("f(x) = \\frac{" + P2([a, b]) + "}{" + P2(dn) + "}") + " ? Donne les nombres " + M("a") + " des équations " + M("x = a") + ", séparés par « ; ».", [r1, r2],
M(P2(dn) + " = (" + xm(r1) + ")(" + xm(r2) + ")") + " s'annule en " + M(r1) + " et en " + M(r2) + ", où le numérateur n'est pas nul : asymptotes " + M("x = " + Math.min(r1, r2)) + " et " + M("x = " + Math.max(r1, r2)) + ".",
{ ctx: "deux-verticales", guide: [GSet("Zéros du dénominateur " + M(P2(dn)) + " ?", [r1, r2], M(setT([r1, r2])) + ".")],
traps: [TSt([-r1, -r2], "Les zéros de (x − a)(x − b) sont a et b : attention aux signes."), TSt([r1], "Le dénominateur a deux zéros : deux asymptotes."), TSt([r2], "Le dénominateur a deux zéros : deux asymptotes.")] }); },
() => { const a = nz(-4, 4), b = nz(-4, 4), c = ri(-5, 5); if (a === b || c === a || c === b) return null; const num = [1, -(a + c), a * c], dn = [1, -(a + b), a * b];
return QSet("Quelles sont les asymptotes verticales de " + M("f(x) = \\frac{" + P2(num) + "}{" + P2(dn) + "}") + " ? Donne les nombres " + M("a") + " des équations " + M("x = a") + " (séparés par « ; » s'il y en a plusieurs).", [b],
M("f(x) = \\frac{(" + xm(a) + ")(" + xm(c) + ")}{(" + xm(a) + ")(" + xm(b) + ")}") + ". En " + M(a) + ", on simplifie : la courbe a un « trou », pas d'asymptote. Seule asymptote verticale : " + M("x = " + b) + ".",
{ ctx: "trou", guide: [GSet("Zéros du dénominateur ?", [a, b], M(setT([a, b])) + "."), GSet("Lesquels n'annulent pas aussi le numérateur ?", [b], M(b) + " (en " + M(a) + ", on simplifie).")],
traps: [TSt([a, b], "En x = " + T(a) + ", numérateur et dénominateur s'annulent : après simplification, la limite est finie (un « trou »)."), TSt([a], "En x = " + T(a) + ", on simplifie par (" + xmT(a) + ") : pas d'asymptote là."), TSt([-b], "x − b = 0 donne x = b : attention au signe.")] }); },
() => { const x0 = nz(-4, 4), c = pk([1, 2, 3, -1, -2]), a = nz(-6, 6), d = -c * x0, b = ri(-6, 6), y0 = a / c; if (a * d === b * c) return null;
return QP("Les deux asymptotes de " + M("f(x) = \\frac{" + P2([a, b]) + "}{" + P2([c, d]) + "}") + " se coupent en un point. Donne ses coordonnées « x ; y ».", [x0, y0],
"Asymptote verticale " + M("x = " + x0) + " (le dénominateur s'annule), asymptote horizontale " + M("y = " + fT(y0)) + " (quotient des coefficients de " + M("x") + ") : point " + M("(" + x0 + " \\,;\\, " + fT(y0) + ")") + ".",
{ ctx: "centre", guide: [G("Asymptote verticale : " + M("x") + " = ?", x0, M(x0) + "."), G("Asymptote horizontale : " + M("y") + " = ?", y0, M(fT(y0)) + "."), GP("Point « x ; y » ?", [x0, y0], M("(" + x0 + " \\,;\\, " + fT(y0) + ")") + ".")],
traps: [TP([y0, x0], "Abscisse d'abord : celle de l'asymptote verticale."), TP([-x0, y0], "Résous " + pT([c, d]) + " = 0 : vérifie le signe de l'abscisse."), TP([x0, b / d], "L'ordonnée est la limite à l'infini, pas f(0).")] }); },
],
3: [
() => { const a = pk([1, 2, 3, -1, -2]), d = pk([1, 2, 3, 4, 5]), b = nz(-4, 4), x0 = pk([-4, -3, -2, 2, 3, 4, 5]), c = a * d - b * x0;
return QN("La courbe de " + M("f(x) = \\frac{" + P2([a, b, c]) + "}{" + P2([1, 0, d]) + "}") + " coupe son asymptote horizontale en un point. Quelle est son abscisse ?", x0,
"Asymptote horizontale " + M("y = " + a) + ". " + M("f(x) = " + a + " \\iff " + P2([a, b, c]) + " = " + P2([a, 0, a * d]) + " \\iff " + P2([b, c - a * d]) + " = 0 \\iff x = " + x0) + ".",
{ ctx: "croise", guide: [G("Asymptote horizontale : " + M("y") + " = ?", a, M("y = " + a) + "."), G("Résous " + M("f(x) = " + a) + " (multiplie par " + M(P2([1, 0, d])) + ") : " + M("x") + " ?", x0, M("x = " + x0) + ".")],
traps: [TR(-x0, "Vérifie le signe en résolvant " + pT([b, c - a * d]) + " = 0."), TR(a, "C'est l'ordonnée (l'asymptote y = " + T(a) + ") ; on demande l'abscisse."), c ? TR(-c / b, "Le terme " + T(a * d) + " (le dénominateur multiplié par " + T(a) + ") compte aussi.") : null] }); },
() => { const a = pk([1, 2, -1, 3, -2]), d = nz(-4, 4), b = ri(-5, 5), c = ri(-6, 6), p = b + a * d, rem = a * d * d + b * d + c; if (!rem || !p) return null;
return QP("Soit " + M("f(x) = \\frac{" + P2([a, b, c]) + "}{" + xm(d) + "}") + ". Son asymptote oblique a pour équation " + M("y = mx + p") + ". Réponds « m ; p ».", [a, p],
"Division : " + M(P2([a, b, c]) + " = (" + xm(d) + ")(" + P2([a, p]) + ")" + sg(rem)) + ", donc " + M("f(x) = " + P2([a, p]) + " + \\frac{" + rem + "}{" + xm(d) + "}") + ". La fraction tend vers 0 : asymptote " + M("y = " + P2([a, p])) + ".",
{ ctx: "oblique", guide: [G("Division de " + M(P2([a, b, c])) + " par " + M(xm(d)) + " : coefficient " + M("m") + " du quotient ?", a, M(a) + "."), G("Terme constant " + M("p") + " du quotient ?", p, M(p) + "."), GP("« m ; p » ?", [a, p], M("y = " + P2([a, p])) + ".")],
traps: [TP([a, b], "Il faut diviser : p n'est pas le coefficient de x du numérateur (p = " + T(b) + " + " + T(a) + " · " + T(d) + ")."), TP([a, b - a * d], "Signe : on divise par (" + xmT(d) + ")."), TP([p, a], "Dans l'ordre : m (la pente) puis p.")] }); },
() => { const m = ri(2, 6), a = pk([-9, -7, -5, -3, -2, 2, 3, 4, 5, 7]);
return QSet("Pour quelles valeurs de " + M("k") + " la fonction " + M("f(x) = \\frac{" + a + "}{x^2 + kx + " + m * m + "}") + " a-t-elle une seule asymptote verticale ? (valeurs séparées par « ; »)", [-2 * m, 2 * m],
"Une seule asymptote : le dénominateur a une seule racine (double), donc " + M("\\Delta = k^2 - " + 4 * m * m + " = 0") + ", " + M("k = \\pm " + 2 * m) + ". (Pour " + M("k = " + 2 * m) + ", " + M("x^2 + " + 2 * m + "x + " + m * m + " = (x + " + m + ")^2") + ".)",
{ ctx: "une-seule-verticale", guide: [G("Discriminant du dénominateur : " + M("\\Delta = k^2 - c") + ". Que vaut " + M("c") + " ?", 4 * m * m, M("4 \\cdot " + m * m + " = " + 4 * m * m) + "."), GSet(M("\\Delta = 0") + " : " + M("k") + " ?", [-2 * m, 2 * m], M("k = \\pm " + 2 * m) + ".")],
traps: [TSt([2 * m], "k² = " + T(4 * m * m) + " a deux solutions."), TSt([-m, m], "k² = 4 · " + T(m * m) + " : k = ±" + T(2 * m) + "."), TSt([-4 * m * m, 4 * m * m], "C'est k² : prends la racine.")] }); },
],
};


const CO = {
1: [
() => { const x0 = nz(-3, 4), a = nz(-4, 4), b = ri(-6, 6), c = nz(-4, 4); if (c === a) return null; const k = (a - c) * x0 + b; if (Math.abs(k) <= 1) return null;
return QN("Pour quelle valeur de " + M("k") + " la fonction " + M(cases(P2([a, b]), "x < " + x0, P2([c, 0]) + " + k", "x \\ge " + x0)) + " est-elle continue en " + M(x0) + " ?", k,
"Les deux morceaux doivent se rejoindre en " + M(x0) + " : " + M(pv([a, b], x0) + " = " + c * x0 + " + k") + ", donc " + M("k = " + k) + ".",
{ ctx: "affine-morceaux", guide: [G("Valeur du 1er morceau en " + M("x = " + x0) + " ?", a * x0 + b, M(a * x0 + b) + "."), G("Valeur de " + M(P2([c, 0])) + " en " + M("x = " + x0) + " ?", c * x0, M(c * x0) + "."), G(M("k") + " ?", k, M(k) + ".")],
traps: [TR(a * x0 + b, "C'est la valeur du 1er morceau ; il faut encore retirer " + T(c * x0) + "."), TR(a * x0 + b + c * x0, "On retire " + T(c * x0) + ", on ne l'ajoute pas."), TR(-k, "Vérifie le signe.")] }); },
() => { const x0 = pk([-3, -2, 2, 3]), V = [-4, -3, -2, 2, 3, 4], L1 = pk(V), L2 = pk(V), m1 = pk([0.5, -0.5, 1, -1]), m2 = pk([0.5, -0.5, 1, -1]), ask = pk(["abs", "saut"]); if (Math.abs(L1 - L2) < 2) return null;
const fig = PL([{ f: (x) => L1 + m1 * (x - x0), to: x0, cls: "f-accent" }, { f: (x) => L2 + m2 * (x - x0), from: x0, cls: "f-accent" }], [[x0, L2, ""]]);
if (ask === "abs") return QN("Le graphique représente une fonction " + M("f") + " définie sur " + M("\\mathbb{R}") + " (le point plein est sur la courbe). En quelle abscisse " + M("f") + " n'est-elle pas continue ?", x0,
"En " + M("x = " + x0) + ", la courbe fait un saut : la limite à gauche (" + M(L1) + ") n'est pas égale à " + M("f(" + x0 + ") = " + L2) + ". On ne peut pas la tracer sans lever le crayon.",
{ ctx: "lecture-saut", fig, guide: [G("Où faut-il lever le crayon pour tracer la courbe ? Abscisse :", x0, M(x0) + ".")],
traps: [TR(L2, "C'est une ordonnée ; on demande l'abscisse du saut."), TR(L1, "C'est une ordonnée ; on demande l'abscisse du saut."), TR(-x0, "Lis le signe sur l'axe horizontal.")] });
return QN("Le graphique représente une fonction " + M("f") + " (le point plein donne " + M("f(" + x0 + ")") + "). En " + M("x = " + x0) + ", elle fait un saut. Que vaut " + M("f(" + x0 + ") - \\lim_{x \\to " + x0 + ",\\; x < " + x0 + "} f(x)") + " (la hauteur du saut, avec son signe) ?", L2 - L1,
"Limite à gauche " + M(L1) + ", " + M("f(" + x0 + ") = " + L2) + " : saut " + M(L2 + " - " + par(L1) + " = " + (L2 - L1)) + ".",
{ ctx: "lecture-hauteur", fig, guide: [G("Limite à gauche (hauteur où arrive la courbe de gauche) ?", L1, M(L1) + "."), G(M("f(" + x0 + ")") + " (le point plein) ?", L2, M(L2) + "."), G("Saut ?", L2 - L1, M(L2 - L1) + ".")],
traps: [TR(L1 - L2, "Dans l'ordre : f(" + T(x0) + ") moins la limite à gauche."), TR(L2, "C'est f(" + T(x0) + ") ; retire la limite à gauche."), TR(L1, "C'est la limite à gauche.")] }); },
() => { const a = nz(-5, 5), b = ri(-6, 6), m = pk([2, 3, -2]); if (Math.abs(a - b) < 1) return null; const num = [m, -m * (a + b), m * a * b], k = m * (a - b);
return QN("On pose " + M("f(x) = \\frac{" + P2(num) + "}{" + xm(a) + "}") + " pour " + M("x \\neq " + a) + ", et " + M("f(" + a + ") = k") + ". Quelle valeur de " + M("k") + " rend " + M("f") + " continue en " + M(a) + " ?", k,
"Pour " + M("x \\neq " + a) + ", " + M("f(x) = \\frac{" + m + "(" + xm(a) + ")(" + xm(b) + ")}{" + xm(a) + "} = " + m + "(" + xm(b) + ")") + ". Continuité : " + M("k = " + lim(a) + " f(x) = " + m + "(" + a + " - " + par(b) + ") = " + k) + ".",
{ ctx: "prolongement", guide: [G("Le numérateur se factorise en " + M(m + "(" + xm(a) + ")(x - b)") + ". Que vaut " + M("b") + " ?", b, M(b) + "."), G(M("k") + " = la limite en " + M(a) + " ?", k, M(m + "(" + a + " - " + par(b) + ") = " + k) + ".")],
traps: [TR(0, "0 ÷ 0 n'est pas une valeur : simplifie d'abord par (" + xmT(a) + ")."), TR(m * (b - a), "Il reste " + T(m) + "(" + xmT(b) + ") : en x = " + T(a) + ", vérifie le signe."), TR(a - b, "N'oublie pas le facteur " + T(m) + ".")] }); },
],
2: [
() => { const x0 = nz(-3, 3), p = nz(-5, 5), m = nz(-4, 4), k = x0 * x0 + p * x0 - m * x0; if (Math.abs(k) <= 1) return null;
return QN("Pour quelle valeur de " + M("k") + " la fonction " + M(cases(P2([1, p, 0]), "x \\le " + x0, P2([m, 0]) + " + k", "x > " + x0)) + " est-elle continue ?", k,
"Chaque morceau est continu ; il reste le raccord en " + M(x0) + " : " + M(par(x0) + "^2" + (p < 0 ? " - " : " + ") + Math.abs(p) + " \\cdot " + par(x0) + " = " + m * x0 + " + k") + ", donc " + M("k = " + (x0 * x0 + p * x0) + " - " + par(m * x0) + " = " + k) + ".",
{ ctx: "parabole-droite", guide: [G("Valeur de " + M(P2([1, p, 0])) + " en " + M("x = " + x0) + " ?", x0 * x0 + p * x0, M(x0 * x0 + p * x0) + "."), G("Valeur de " + M(P2([m, 0])) + " en " + M("x = " + x0) + " ?", m * x0, M(m * x0) + "."), G(M("k") + " ?", k, M(k) + ".")],
traps: [TR(x0 * x0 + p * x0, "C'est la valeur du 1er morceau ; retire encore " + T(m * x0) + "."), TR(x0 * x0 + p * x0 + m * x0, "On retire " + T(m * x0) + ", on ne l'ajoute pas."), TR(-x0 * x0 + p * x0 - m * x0, "(" + T(x0) + ")² = " + T(x0 * x0) + " : un carré est positif.")] }); },
() => { const x0 = pk([2, 3, 4, -3, -4]), k = pk([-5, -4, -3, -2, 2, 3, 4, 5]), b = x0 * x0 - k - k * x0; if (!b) return null;
return QN("Pour quelle valeur de " + M("k") + " la fonction " + M(cases("kx" + sg(b), "x < " + x0, "x^2 - k", "x \\ge " + x0)) + " est-elle continue en " + M(x0) + " ?", k,
"Les deux morceaux se rejoignent : " + M(par(x0) + "k" + sg(b) + " = " + x0 * x0 + " - k") + ", donc " + M((x0 + 1) + "k = " + (x0 * x0 - b)) + " et " + M("k = " + k) + ".",
{ ctx: "parametre-deux-cotes", guide: [G("On écrit " + M(par(x0) + "k" + sg(b) + " = " + x0 * x0 + " - k") + " et on regroupe les " + M("k") + " à gauche : coefficient de " + M("k") + " ?", x0 + 1, M(x0 + " + 1 = " + (x0 + 1)) + "."), G("Membre de droite (" + M(x0 * x0 + " - " + par(b)) + ") ?", x0 * x0 - b, M(x0 * x0 - b) + "."), G(M("k") + " ?", k, M(k) + ".")],
traps: [TR((x0 * x0 - b) / x0, "k apparaît aussi à droite (x² − k) : regroupe les k."), TR(-k, "Vérifie le signe."), TR((x0 * x0 + b) / (x0 + 1), "On isole k : " + T(x0 * x0) + " − (" + T(b) + ").")] }); },
() => { const C = pk([["Un parking facture", "h", "heures", [2, 3, 4], [[3, 2], [4, 2.5], [2.5, 1.5], [3.5, 2]]], ["Un fournisseur d'électricité facture", "kWh", "kWh", [100, 200, 300], [[0.3, 0.2], [0.35, 0.25], [0.4, 0.3]]], ["Un forfait de données mobiles coûte", "Go", "Go", [5, 10, 20], [[2, 1.5], [1.6, 1.2], [3, 2]]], ["Une compagnie de taxis facture", "km", "km", [10, 15, 20], [[3.5, 2.5], [4, 3], [3.2, 2.4]]]]);
const s = pk(C[3]), [a, b] = pk(C[4]), as = r6(a * s), bs = r6(b * s), k = r6(as - bs);
return QN(C[0] + " " + M("P(x) = " + D(a) + "x") + " CHF pour " + M("x \\le " + D(s)) + " " + C[2] + ", puis " + M("P(x) = " + D(b) + "x + k") + " CHF au-delà. Quelle valeur de " + M("k") + " (en CHF) évite un saut du prix en " + M(D(s)) + " " + C[1] + " ?", k,
"Les deux formules doivent donner le même prix en " + M(D(s)) + " : " + M(D(a) + " \\cdot " + D(s) + " = " + D(b) + " \\cdot " + D(s) + " + k") + ", donc " + M("k = " + D(as) + " - " + D(bs) + " = " + D(k)) + " CHF.",
{ ctx: "tarif-" + C[1], guide: [G("Prix en " + M(D(s)) + " " + C[1] + " avec la 1re formule ?", as, M(D(as)) + " CHF."), G(M(D(b) + " \\cdot " + D(s)) + " ?", bs, M(D(bs)) + "."), G(M("k") + " ?", k, M(D(k)) + " CHF.")],
traps: [TR(as, "C'est le prix en " + T(s) + " " + C[1] + " ; retire " + T(bs) + "."), TR(bs, "C'est b · s ; k = a · s − b · s."), TR(-k, "Vérifie le signe : le second tarif par unité est plus bas, k est positif.")] }); },
],
3: [
() => { const x1 = nz(-3, 1), dd = pk([1, 2, 3]), x2 = x1 + dd, u = ri(-3, 3), a = pk([-3, -2, 2, 3]), y1 = x1 * x1 + u, v = y1 + a * dd, b = v - a * x2;
return QP("Trouve " + M("a") + " et " + M("b") + " pour que " + M("f(x) = \\begin{cases} " + P2([1, 0, u]) + " & \\text{si } x < " + x1 + " \\\\ ax + b & \\text{si } " + x1 + " \\le x \\le " + x2 + " \\\\ " + v + " & \\text{si } x > " + x2 + " \\end{cases}") + " soit continue sur " + M("\\mathbb{R}") + ". Réponds « a ; b ».", [a, b],
"Raccord en " + M(x1) + " : la droite passe par " + M("(" + x1 + " \\,;\\, " + y1 + ")") + ". Raccord en " + M(x2) + " : par " + M("(" + x2 + " \\,;\\, " + v + ")") + ". Pente " + M("a = \\frac{" + v + " - " + par(y1) + "}{" + dd + "} = " + a) + ", puis " + M("b = " + v + " - " + par(a) + " \\cdot " + par(x2) + " = " + b) + ".",
{ ctx: "trois-morceaux", guide: [G("Valeur de " + M(P2([1, 0, u])) + " en " + M("x = " + x1) + " ?", y1, M(y1) + "."), G("La droite passe par " + M("(" + x1 + " \\,;\\, " + y1 + ")") + " et " + M("(" + x2 + " \\,;\\, " + v + ")") + ". Pente " + M("a") + " ?", a, M(a) + "."), G(M("b") + " ?", b, M(b) + "."), GP("« a ; b » ?", [a, b], M("(" + a + " \\,;\\, " + b + ")") + ".")],
traps: [TP([b, a], "Dans l'ordre : a (la pente), puis b."), TP([a, v], "b n'est pas la valeur en " + T(x2) + " : b = " + T(v) + " − a · (" + T(x2) + ")."), TP([-a, v + a * x2], "Pente = (valeur en " + T(x2) + " − valeur en " + T(x1) + ") ÷ (" + T(x2) + " − (" + T(x1) + ")), dans cet ordre.")] }); },
() => { const c = ri(2, 5), a = nz(-4, 6), b = c * c - a, v = 1 / (2 * c), rt = "\\sqrt{" + P2([1, b]) + "}";
return QN("On pose " + M("f(x) = \\frac{" + rt + " - " + c + "}{" + xm(a) + "}") + " pour " + M("x \\neq " + a) + ". Quelle valeur faut-il donner à " + M("f(" + a + ")") + " pour que " + M("f") + " soit continue en " + M(a) + " ?", v,
"Il faut " + M("f(" + a + ") = " + lim(a) + " f(x)") + ". Quantité conjuguée : " + M("f(x) = \\frac{" + xm(a) + "}{(" + xm(a) + ")(" + rt + " + " + c + ")} = \\frac{1}{" + rt + " + " + c + "}") + ", qui tend vers " + M("\\frac{1}{" + 2 * c + "}") + ".",
{ ctx: "prolongement-racine", guide: [G("Après multiplication par " + M(rt + " + " + c) + " et simplification, " + M("f(x) = \\frac{1}{" + rt + " + " + c + "}") + ". Valeur du dénominateur en " + M(a) + " ?", 2 * c, M(2 * c) + "."), G(M("f(" + a + ")") + " ?", v, M("\\frac{1}{" + 2 * c + "}") + ".")],
traps: [TR(1 / c, "Le dénominateur tend vers " + c + " + " + c + " = " + 2 * c + "."), TR(0, "0 ÷ 0 n'est pas une valeur : utilise la quantité conjuguée."), TR(2 * c, "C'est le dénominateur : prends l'inverse.")] }); },
() => { const x0 = pk([2, 3, -1, -2]), k = pk([-4, -3, -2, 2, 3, 4]), c = k * x0 * x0 - k * x0 - x0 * x0; if (!c) return null;
return QN("Pour quelle valeur de " + M("k") + " la fonction " + M(cases("x^2 + kx", "x \\le " + x0, "kx^2" + sg(-c), "x > " + x0)) + " est-elle continue en " + M(x0) + " ?", k,
"Raccord en " + M(x0) + " : " + M(x0 * x0 + " + " + par(x0) + "k = " + x0 * x0 + "k" + sg(-c)) + ", donc " + M((x0 * x0 - x0) + "k = " + (x0 * x0 + c)) + " et " + M("k = " + k) + ".",
{ ctx: "parametre-carres", guide: [G("On regroupe les " + M("k") + " : coefficient de " + M("k") + " (" + M(x0 * x0 + " - " + par(x0)) + ") ?", x0 * x0 - x0, M(x0 * x0 - x0) + "."), G("Autre membre (" + M(x0 * x0 + sg(c)) + ") ?", x0 * x0 + c, M(x0 * x0 + c) + "."), G(M("k") + " ?", k, M(k) + ".")],
traps: [TR((x0 * x0 + c) / (x0 * x0), "k apparaît des deux côtés : regroupe-les."), TR(-k, "Vérifie le signe."), TR((x0 * x0 - c) / (x0 * x0 - x0), "Le terme −" + T(c) + " passe de l'autre côté : il change de signe.")] }); },
],
};


const EF = {
1: [
() => { const a = nz(-5, 5), b = ri(2, 4); if (Math.abs(a) === b) return null; const cs = [1, -a, -b * b, a * b * b];
return QSet("Quels sont les zéros de " + M("f(x) = " + P2(cs)) + " ? (séparés par « ; »)", [a, -b, b],
"Groupement : " + M("f(x) = x^2(" + xm(a) + ") - " + b * b + "(" + xm(a) + ") = (" + xm(a) + ")(x^2 - " + b * b + ")") + ". Zéros : " + M(setT([a, -b, b])) + ".",
{ ctx: "zeros-cubique", guide: [G("Groupe les termes deux à deux : " + M("f(x) = (x - a)(x^2 - c)") + ". Que vaut " + M("c") + " ?", b * b, M(b * b) + "."), GSet("Zéros de " + M("f") + " ?", [a, -b, b], M(setT([a, -b, b])) + ".")],
traps: [TSt([a], "x² − " + T(b * b) + " s'annule aussi."), TSt([a, b], "x² = " + T(b * b) + " a deux solutions : " + T(b) + " et −" + T(b) + "."), TSt([-a, -b, b], "x − a = 0 donne x = a : vérifie le signe.")] }); },
() => { const k = ri(2, 6), a = nz(-5, 5), b = ri(-6, 6); if (b === 0 || [k, -k].some((z) => a * z + b === 0)) return null;
return QSet("Quelles valeurs faut-il exclure de l'ensemble de définition de " + M("f(x) = \\frac{" + P2([a, b]) + "}{" + P2([1, 0, -k * k, 0]) + "}") + " ? (séparées par « ; »)", [-k, 0, k],
"On exclut les zéros du dénominateur : " + M(P2([1, 0, -k * k, 0]) + " = x(x^2 - " + k * k + ") = x(" + xm(k) + ")(" + xm(-k) + ")") + ". Valeurs interdites : " + M(setT([-k, 0, k])) + ".",
{ ctx: "domaine", guide: [G("Mets " + M("x") + " en évidence : " + M(P2([1, 0, -k * k, 0]) + " = x(x^2 - c)") + ". Que vaut " + M("c") + " ?", k * k, M(k * k) + "."), GSet("Valeurs interdites ?", [-k, 0, k], M(setT([-k, 0, k])) + ".")],
traps: [TSt([-k, k], "Le facteur x s'annule aussi : 0 est interdit."), TSt([k], "x² = " + T(k * k) + " a deux solutions, et 0 est aussi interdit."), TSt([0, k * k], "x² = " + T(k * k) + " donne x = ±" + T(k) + ".")] }); },
() => { const k = ri(1, 3), d = ri(-6, 6), cs = [1, 0, -3 * k * k, d], ym = 2 * k ** 3 + d;
return QP("Donne les coordonnées « x ; y » du maximum local de " + M("f(x) = " + P2(cs)) + ".", [-k, ym],
M("f'(x) = " + P2([3, 0, -3 * k * k]) + " = 3(" + xm(-k) + ")(" + xm(k) + ")") + " : " + M("f'") + " passe de + à − en " + M(-k) + ". Maximum local " + M("f(" + -k + ") = " + ym) + ", au point " + M("(" + -k + " \\,;\\, " + ym + ")") + ".",
{ ctx: "maximum-cubique", guide: [GSet("Zéros de " + M("f'(x) = " + P2([3, 0, -3 * k * k])) + " ?", [-k, k], M(setT([-k, k])) + "."), G("En quelle abscisse " + M("f'") + " passe-t-elle de + à − ?", -k, M(-k) + "."), G(M("f(" + -k + ")") + " ?", ym, M(ym) + "."), GP("« x ; y » ?", [-k, ym], M("(" + -k + " \\,;\\, " + ym + ")") + ".")],
traps: [TP([k, d - 2 * k ** 3], "C'est le minimum local (f' passe de − à +)."), TP([-k, d], "L'ordonnée est f(−" + T(k) + "), pas f(0)."), TP([ym, -k], "Dans l'ordre : x, puis y.")] }); },
],
2: [
() => { const k = ri(2, 7), c = k * k, v = 2 * k;
return QN("Soit " + M("f(x) = \\frac{x^2 + " + c + "}{x}") + " pour " + M("x > 0") + ". Quelle est la valeur de son minimum ?", v,
M("f(x) = x + \\frac{" + c + "}{x}") + ", " + M("f'(x) = 1 - \\frac{" + c + "}{x^2}") + " s'annule en " + M("x = " + k) + " (de − à +). Minimum " + M("f(" + k + ") = " + k + " + " + k + " = " + v) + ".",
{ ctx: "x-plus-inverse", guide: [G(M("f'(x) = 1 - \\frac{" + c + "}{x^2}") + ". Zéro positif ?", k, M(k) + "."), G(M("f(" + k + ")") + " ?", v, M(v) + ".")],
traps: [TR(k, "C'est l'abscisse du minimum ; calcule f(" + T(k) + ")."), TR(2 * c, "f(" + T(k) + ") = (" + T(c) + " + " + T(c) + ") ÷ " + T(k) + " : divise par " + T(k) + "."), TR(c + 1, "C'est f(1) : le minimum est là où f' s'annule.")] }); },
() => { const k = ri(1, 4), a = pk([2, 4, 6, 8, 3, 5]), y = a / (2 * k);
return QP("Donne les coordonnées « x ; y » du maximum de " + M("f(x) = \\frac{" + a + "x}{x^2 + " + k * k + "}") + ".", [k, y],
M("f'(x) = \\frac{" + a + "(" + k * k + " - x^2)}{(x^2 + " + k * k + ")^2}") + " : positive entre " + M(-k) + " et " + M(k) + ", négative ensuite. Maximum en " + M("x = " + k) + " : " + M("f(" + k + ") = \\frac{" + a * k + "}{" + 2 * k * k + "} = " + fT(y)) + ".",
{ ctx: "rationnelle-bosse", guide: [G("Le numérateur de " + M("f'(x)") + " est " + M(a + "(" + k * k + " - x^2)") + ". Son zéro positif ?", k, M(k) + "."), G(M("f(" + k + ")") + " ?", y, M(fT(y)) + "."), GP("« x ; y » ?", [k, y], M("(" + k + " \\,;\\, " + fT(y) + ")") + ".")],
traps: [TP([-k, -y], "C'est le minimum (f' passe de − à +)."), TP([k, a / k], "Au dénominateur : " + T(k * k) + " + " + T(k * k) + " = " + T(2 * k * k) + "."), TP([y, k], "Dans l'ordre : x, puis y.")] }); },
() => { const a = ri(1, 3), b = ri(a + 1, 5), cs = [1, 0, -(a * a + b * b), 0, a * a * b * b];
return QSet("Quels sont les zéros de " + M("f(x) = " + P2(cs)) + " ? (séparés par « ; »)", [-b, -a, a, b],
"On pose " + M("X = x^2") + " : " + M("X^2 - " + (a * a + b * b) + "X + " + a * a * b * b + " = (X - " + a * a + ")(X - " + b * b + ")") + ". " + M("x^2 = " + a * a) + " ou " + M("x^2 = " + b * b) + " : " + M(setT([-b, -a, a, b])) + ".",
{ ctx: "bicarree", guide: [GSet("Avec " + M("X = x^2") + ", résous " + M("X^2 - " + (a * a + b * b) + "X + " + a * a * b * b + " = 0") + " : " + M("X") + " ?", [a * a, b * b], M(setT([a * a, b * b])) + "."), GSet("Zéros " + M("x") + " ?", [-b, -a, a, b], M(setT([-b, -a, a, b])) + ".")],
traps: [TSt([a * a, b * b], "Ce sont les valeurs de X = x² : prends les racines."), TSt([a, b], "x² = " + T(a * a) + " donne aussi x = −" + T(a) + "."), TSt([-b, b], "x² = " + T(a * a) + " donne aussi deux zéros.")] }); },
],
3: [
() => { let r1, r2; do { r1 = nz(-5, 3); r2 = r1 + pk([2, 4, 6]); } while (r2 === 0); const b = (r1 + r2) / 2, c = -r1 * r2, ask = pk(["min", "max"]), v = ask === "min" ? 2 * r2 : 2 * r1, x = ask === "min" ? r2 : r1;
return QN("Soit " + M("f(x) = \\frac{x^2" + sg(c) + "}{" + xm(b) + "}") + ". Quelle est la valeur de son " + (ask === "min" ? "minimum" : "maximum") + " local ?", v,
M("f'(x) = \\frac{2x(" + xm(b) + ") - (x^2" + sg(c) + ")}{(" + xm(b) + ")^2} = \\frac{" + P2([1, -2 * b, -c]) + "}{(" + xm(b) + ")^2}") + ", nulle en " + M(r1) + " et " + M(r2) + ". Maximum local " + M("f(" + r1 + ") = " + 2 * r1) + ", minimum local " + M("f(" + r2 + ") = " + 2 * r2) + " (ils sont sur les deux branches, de part et d'autre de l'asymptote " + M("x = " + b) + ").",
{ ctx: "rationnelle-oblique-" + ask, guide: [GSet("Zéros du numérateur de " + M("f'(x)") + ", " + M(P2([1, -2 * b, -c])) + " ?", [r1, r2], M(setT([r1, r2])) + "."), G("Le " + (ask === "min" ? "minimum (f' passe de − à +)" : "maximum (f' passe de + à −)") + " est en " + M("x") + " = ?", x, M(x) + "."), G("Valeur ?", v, M("f(" + x + ") = " + v) + ".")],
traps: [TR(x, "C'est l'abscisse ; calcule f en ce point."), TR(ask === "min" ? 2 * r1 : 2 * r2, "C'est l'autre extremum (le " + (ask === "min" ? "maximum" : "minimum") + " local)."), TR(-v, "Vérifie le signe.")] }); },
() => { const k = ri(1, 3), d = ri(-6, 6), hi = 2 * k ** 3 + d, lo = d - 2 * k ** 3, cs = [1, 0, -3 * k * k, d], iv = [[lo, false, hi, false]];
return QS("Pour quelles valeurs de " + M("m") + " l'équation " + M(P2(cs) + " = m") + " a-t-elle trois solutions ? (intervalle)", iv,
"Maximum local " + M("f(" + -k + ") = " + hi) + ", minimum local " + M("f(" + k + ") = " + lo) + " ; " + M("f") + " va de " + M("-\\infty") + " à " + M("+\\infty") + ". La droite " + M("y = m") + " coupe trois fois la courbe exactement quand " + M(lo + " < m < " + hi) + " : " + M(SolSet.show(iv)) + ".",
{ ctx: "nombre-solutions", guide: [G("Valeur du maximum local ?", hi, M("f(" + -k + ") = " + hi) + "."), G("Valeur du minimum local ?", lo, M("f(" + k + ") = " + lo) + "."), GSS("Valeurs de " + M("m") + " ?", iv, M(SolSet.show(iv)) + ".")],
traps: [TS([[lo, true, hi, true]], "Pour m = " + T(hi) + " ou m = " + T(lo) + ", la droite est tangente à la courbe : deux solutions seulement."), TS([[-k, false, k, false]], "Ce sont les abscisses des extremums ; m est une valeur de f (sur l'axe vertical).")] }); },
() => { const a = pk([2, 3, -2, -3]), d = ri(-9, 9), cs = [3, -4 * a, 0, 0, d], v = d - a ** 4;
return QN("Quelle est la valeur minimale de " + M("f(x) = " + P2(cs)) + " ?", v,
M("f'(x) = " + P2([12, -12 * a, 0, 0]) + " = 12x^2(" + xm(a) + ")") + ". En " + M(0) + ", " + M("f'") + " s'annule sans changer de signe (palier) ; en " + M(a) + ", elle passe de − à + : minimum " + M("f(" + a + ") = " + v) + ".",
{ ctx: "quartique-palier", guide: [GSet("Zéros de " + M("f'(x) = " + P2([12, -12 * a, 0, 0])) + " ?", [0, a], M(setT([0, a])) + "."), G("En quelle abscisse " + M("f'") + " passe-t-elle de − à + ?", a, M(a) + " (en 0, " + M("12x^2 \\ge 0") + " ne change pas de signe)."), G(M("f(" + a + ")") + " ?", v, M(v) + ".")],
traps: [TR(d, "En 0, f' s'annule sans changer de signe : ce n'est pas un extremum."), TR(a, "C'est l'abscisse du minimum ; calcule f(" + T(a) + ")."), TR(d + a ** 4, "f(" + T(a) + ") = 3 · " + T(a ** 4) + " − 4 · " + T(a ** 4) + " + " + T(d) + ".")] }); },
],
};


const DS = {
1: [
() => { const a = pk([1, 2, -1, 3, -2]), p = pk([-4, -3, -2, 2, 3, 4]), b = -3 * a * p, c = ri(-8, 8), d = ri(-6, 6), cs = [a, b, c, d];
return QN("En quelle abscisse la courbe de " + M("f(x) = " + P2(cs)) + " a-t-elle un point d'inflexion ?", p,
M("f'(x) = " + P2(dP(cs))) + ", " + M("f''(x) = " + P2([6 * a, 2 * b])) + " s'annule en changeant de signe en " + M("x = " + p) + ".",
{ ctx: "inflexion-cubique", guide: [G(M("f''(x) = " + P2([6 * a, 0]) + " + c") + ". Que vaut " + M("c") + " ?", 2 * b, M(2 * b) + "."), G("Zéro de " + M("f''") + " ?", p, M(p) + ".")],
traps: [TR(-p, "Résous " + pT([6 * a, 2 * b]) + " = 0 : vérifie le signe."), TR(3 * p, "f''(x) = " + pT([6 * a, 2 * b]) + " : divise par " + T(6 * a) + "."), TR(1.5 * p, "C'est le zéro de " + pT([2 * a, b]) + " ; f''(x) = 6ax + 2b.")] }); },
() => { const a = pk([1, -1, 2]), b = nz(-3, 3), c = nz(-5, 5), e = ri(-6, 6), x0 = nz(-3, 3), cs = [a, b, c, e, 0], v = 12 * a * x0 * x0 + 6 * b * x0 + 2 * c; if (Math.abs(v) <= 1) return null;
return QN("Soit " + M("f(x) = " + P2(cs)) + ". Calcule " + M("f''(" + x0 + ")") + ".", v,
M("f'(x) = " + P2(dP(cs))) + ", " + M("f''(x) = " + P2(dP(dP(cs)))) + ", donc " + M("f''(" + x0 + ") = " + v) + ".",
{ ctx: "valeur-seconde", guide: [G("Dans " + M("f''(x)") + ", coefficient de " + M("x^2") + " ?", 12 * a, M(12 * a) + "."), G(M("f''(" + x0 + ")") + " ?", v, M(v) + ".")],
traps: [TR(pv(dP(cs), x0), "C'est f'(" + T(x0) + ") : dérive encore une fois."), TR(12 * a * x0 * x0 + 6 * b * x0 + c, "Le terme " + T(c) + "x² donne " + T(2 * c) + "x, puis " + T(2 * c) + "."), TR(pv(cs, x0), "C'est f(" + T(x0) + ").")] }); },
() => { const p = pk([-4, -3, -2, 2, 3, 4]), m = pk([1, -1, 2, -2, 0.5, -0.5]);
return QN("Le graphique représente la dérivée seconde " + M("f''") + " d'une fonction " + M("f") + ". En quelle abscisse la courbe de " + M("f") + " a-t-elle un point d'inflexion ?", p,
M("f''") + " s'annule en changeant de signe en " + M("x = " + p) + " : la courbe de " + M("f") + " passe de " + (m > 0 ? "concave (tournée vers le bas) à convexe (tournée vers le haut)" : "convexe à concave") + ".",
{ ctx: "lecture-seconde", fig: PL([{ f: (x) => m * (x - p) }], []), guide: [G("Où la droite coupe-t-elle l'axe horizontal ?", p, M(p) + ".")],
traps: [TR(-m * p, "C'est l'ordonnée à l'origine de f'' ; cherche où f''(x) = 0."), TR(-p, "Lis le signe sur l'axe horizontal.")] }); },
],
2: [
() => { const a = pk([1, -1, 2, -2]), p = nz(-4, 4), b = -3 * a * p, c = ri(-6, 6), d = ri(-6, 6), cs = [a, b, c, d], ask = pk(["convexe", "concave"]);
const right = (ask === "convexe") === (a > 0), R1 = [[p, true, Infinity, false]], L1 = [[-Infinity, false, p, true]], iv = right ? R1 : L1;
return QS("Sur quel intervalle " + M("f(x) = " + P2(cs)) + " est-elle " + ask + " (courbe tournée vers " + (ask === "convexe" ? "le haut" : "le bas") + ") ?", iv,
M("f''(x) = " + P2([6 * a, 2 * b]) + " = " + 6 * a + "(" + xm(p) + ")") + ". " + (ask === "convexe" ? M("f'' \\ge 0") : M("f'' \\le 0")) + " sur " + M(SolSet.show(iv)) + ".",
{ ctx: ask + "-cubique", guide: [G("Zéro de " + M("f''(x) = " + P2([6 * a, 2 * b])) + " ?", p, M(p) + "."), GSS("Intervalle où " + (ask === "convexe" ? M("f'' \\ge 0") : M("f'' \\le 0")) + " ?", iv, M(SolSet.show(iv)) + ".")],
traps: [TS(right ? L1 : R1, "C'est l'intervalle où f est " + (ask === "convexe" ? "concave" : "convexe") + " : regarde le signe de " + T(6 * a) + " devant (" + xmT(p) + ")."), TS(right ? [[-p, true, Infinity, false]] : [[-Infinity, false, -p, true]], "Le zéro de f'' est " + T(p) + " : vérifie le signe.")] }); },
() => { const p = ri(-3, 2), q = p + ri(1, 4), e = ri(-5, 5), g = ri(-5, 5), cs = [1, -2 * (p + q), 6 * p * q, e, g];
return QSet("Quelles sont les abscisses des points d'inflexion de " + M("f(x) = " + P2(cs)) + " ? (séparées par « ; »)", [p, q],
M("f''(x) = " + P2([12, -12 * (p + q), 12 * p * q]) + " = 12(" + xm(p) + ")(" + xm(q) + ")") + " : elle change de signe en " + M(p) + " et en " + M(q) + ".",
{ ctx: "inflexion-quartique", guide: [G("Dans " + M("f''(x)") + ", coefficient de " + M("x") + " ?", -12 * (p + q), M(-12 * (p + q)) + "."), GSet("Zéros de " + M("f''(x) = " + P2([12, -12 * (p + q), 12 * p * q])) + " ?", [p, q], M(setT([p, q])) + ".")],
traps: [TSt([-p, -q], "Les zéros de 12(x − p)(x − q) sont p et q : vérifie les signes."), Number.isInteger((p + q) / 2) ? TSt([(p + q) / 2], "C'est le milieu des deux zéros : résous f''(x) = 0.") : null, TSt([p], "f'' a deux zéros, et elle change de signe en chacun.")] }); },
() => { const p = nz(-3, 3), c = ri(-6, 6), d = ri(-6, 6), cs = [1, -3 * p, c, d], y = pv(cs, p);
return QP("Donne les coordonnées « x ; y » du point d'inflexion de " + M("f(x) = " + P2(cs)) + ".", [p, y],
M("f''(x) = " + P2([6, -6 * p]) + "") + " s'annule en " + M(p) + " ; " + M("f(" + p + ") = " + y) + " : point " + M("(" + p + " \\,;\\, " + y + ")") + ".",
{ ctx: "point-inflexion", guide: [G("Zéro de " + M("f''(x) = " + P2([6, -6 * p])) + " ?", p, M(p) + "."), G(M("f(" + p + ")") + " ?", y, M(y) + "."), GP("« x ; y » ?", [p, y], M("(" + p + " \\,;\\, " + y + ")") + ".")],
traps: [TP([p, pv(dP(cs), p)], "L'ordonnée est f(" + T(p) + "), pas f'(" + T(p) + ")."), TP([-p, pv(cs, -p)], "Résous 6x − " + T(6 * p) + " = 0 : vérifie le signe."), TP([y, p], "Dans l'ordre : x, puis y.")] }); },
],
3: [
() => { const a = pk([1, 2, -1, 3]), p = nz(-3, 3), k = -3 * a * p, c = nz(-6, 6);
return QN("Pour quelle valeur de " + M("k") + " la courbe de " + M("f(x) = " + P2([a, 0, 0, 0]) + " + kx^2" + lt(c)) + " a-t-elle un point d'inflexion en " + M("x = " + p) + " ?", k,
M("f''(x) = " + P2([6 * a, 0]) + " + 2k") + " ; " + M("f''(" + p + ") = " + 6 * a * p + " + 2k = 0") + ", donc " + M("k = " + k) + ".",
{ ctx: "parametre-inflexion", guide: [G(M("f''(x) = " + P2([6 * a, 0]) + " + 2k") + ". Que vaut " + M(P2([6 * a, 0])) + " en " + M("x = " + p) + " ?", 6 * a * p, M(6 * a * p) + "."), G(M("k") + " ?", k, M(k) + ".")],
traps: [TR(-6 * a * p, "f''(x) = " + T(6 * a) + "x + 2k : divise encore par 2."), TR(-a * p, "La dérivée seconde de " + pT([a, 0, 0, 0]) + " est " + T(6 * a) + "x."), TR(3 * a * p, "Vérifie le signe.")] }); },
() => { const p = nz(-3, 3), c = ri(-6, 6), d = ri(-6, 6), cs = [1, -3 * p, c, d], fp = pv(cs, p), m = c - 3 * p * p, n = p ** 3 + d; if (Math.abs(n) <= 1) return null;
return QN("Soit " + M("f(x) = " + P2(cs)) + ". La tangente à sa courbe au point d'inflexion a pour équation " + M("y = mx + n") + ". Que vaut " + M("n") + " ?", n,
"Inflexion en " + M("x = " + p) + " (" + M("f''(x) = " + P2([6, -6 * p])) + "). " + M("f(" + p + ") = " + fp) + ", " + M("f'(" + p + ") = " + m) + ". Tangente " + M("y = " + m + "(" + xm(p) + ")" + sg(fp)) + ", ordonnée à l'origine " + M(fp + " - " + par(p) + " \\cdot " + par(m) + " = " + n) + ".",
{ ctx: "tangente-inflexion", guide: [G("Abscisse du point d'inflexion ?", p, M(p) + "."), G(M("f(" + p + ")") + " ?", fp, M(fp) + "."), G("Pente " + M("f'(" + p + ")") + " ?", m, M(m) + "."), G(M("n = f(" + p + ") - " + par(p) + " \\cdot f'(" + p + ")") + " ?", n, M(n) + ".")],
traps: [TR(fp, "C'est f(" + T(p) + ") : développe y = f'(" + T(p) + ")(" + xmT(p) + ") + f(" + T(p) + ")."), TR(m, "C'est la pente m."), TR(fp + p * m, "n = f(p) − p · f'(p) : vérifie le signe.")] }); },
() => { const m = ri(1, 4), a = pk([2, 3, 4, 6, 12, -6]), k = 3 * m * m;
return QSet("Quelles sont les abscisses des points d'inflexion de " + M("f(x) = \\frac{" + a + "}{x^2 + " + k + "}") + " ? (séparées par « ; »)", [-m, m],
M("f'(x) = \\frac{" + -2 * a + "x}{(x^2 + " + k + ")^2}") + ", " + M("f''(x) = \\frac{" + a + "(6x^2 - " + 2 * k + ")}{(x^2 + " + k + ")^3}") + " s'annule et change de signe quand " + M("x^2 = " + m * m) + " : " + M("x = \\pm " + m) + ".",
{ ctx: "inflexion-cloche", guide: [G(M("f''(x)") + " a le signe de " + (a > 0 ? "" : "l'opposé de ") + M("6x^2 - " + 2 * k) + ". Elle s'annule pour " + M("x^2") + " = ?", m * m, M(m * m) + "."), GSet("Abscisses ?", [-m, m], M("\\pm " + m) + ".")],
traps: [TSt([0], "En 0, f'(0) = 0 : c'est le sommet de la courbe, pas une inflexion."), TSt([m], "x² = " + T(m * m) + " a deux solutions."), TSt([-m * m, m * m], "C'est x² : prends la racine.")] }); },
],
};


const WORDS = ["ANANAS", "BANANE", "PAPAYE", "RADAR", "CERISE", "POMME", "GENEVE", "BALLON", "ARBRE", "ELEVE", "ALGEBRE", "CITRON", "MATHS"];
const KO = {
1: [


() => { const C = pk([["jass", 36, pk([3, 4, 5]), "On tire simultanément", "cartes d'un jeu de jass de 36 cartes. Combien de mains différentes peut-on obtenir ?"], ["loto", pk([42, 45, 49]), 6, "Au loto, on coche", "numéros parmi"], ["livres", ri(9, 15), pk([3, 4, 5]), "Pour les vacances, Noé choisit", "livres parmi"]]);
const n = C[1], k = C[2], v = Cb(n, k), A = Cb(n, k) * fact(k);
const txt = C[0] === "jass" ? C[3] + " " + k + " " + C[4] : C[0] === "loto" ? C[3] + " " + k + " " + C[4] + " " + n + " (l'ordre ne compte pas). Combien de grilles différentes ?" : C[3] + " " + k + " " + C[4] + " les " + n + " de sa bibliothèque. Combien de choix différents a-t-il ?";
return QN(txt, v, "On choisit " + M(k) + " éléments parmi " + M(n) + ", sans ordre : " + M(bn(n, k) + " = \\frac{" + Array.from({ length: k }, (_, i) => n - i).join(" \\cdot ") + "}{" + k + "!} = " + D(v)) + ".",
{ ctx: "groupe-" + C[0], guide: [G("Si l'ordre comptait (" + M(Array.from({ length: k }, (_, i) => n - i).join(" \\cdot ")) + ") ?", A, M(D(A)) + "."), G(M(k + "!") + " ?", fact(k), M(fact(k)) + "."), G(M(bn(n, k)) + " ?", v, M(D(v)) + ".")],
traps: [TR(A, "L'ordre ne compte pas : divise par " + k + "! = " + fact(k) + "."), TR(n ** k, "On ne choisit pas deux fois le même élément, et l'ordre ne compte pas."), TR(Cb(n, k - 1), "C'est le choix de " + (k - 1) + " éléments.")] }); },
() => { const n = ri(4, 7), C = pk([["De combien de façons peut-on ranger " + n + " livres différents sur une étagère ?", "etagere"], [n + " coureuses participent à une course (sans ex æquo). Combien d'ordres d'arrivée sont possibles ?", "course"], [n + " amis posent en ligne pour une photo. Combien d'ordres différents sont possibles ?", "photo"]]), v = fact(n);
return QN(C[0], v, "Permutations : " + M(n + " \\cdot " + (n - 1) + " \\cdot \\ldots \\cdot 2 \\cdot 1 = " + n + "! = " + D(v)) + ".",
{ ctx: C[1], guide: [G("Choix pour la 1re place ?", n, M(n) + "."), G("Choix pour la 2e place ?", n - 1, M(n - 1) + "."), G("Total " + M(n + "!") + " ?", v, M(D(v)) + ".")],
traps: [TR(n ** n, "Ce qui est déjà placé ne peut pas l'être une 2e fois : " + n + " · " + (n - 1) + " · …"), TR(n * (n - 1), "Continue jusqu'à 1 : " + n + " · " + (n - 1) + " · … · 1."), TR((n * (n + 1)) / 2, "On multiplie, on n'additionne pas.")] }); },
() => { const n = ri(6, 12), C = pk([[n + " athlètes disputent une finale. Combien de podiums (or, argent, bronze) sont possibles ?", "podium"], ["Un club de " + n + " membres élit un président, un vice-président et un caissier (trois personnes différentes). Combien de bureaux sont possibles ?", "bureau"], [n + " chevaux prennent le départ. Un pari « tiercé dans l'ordre » désigne le 1er, le 2e et le 3e. Combien de paris différents ?", "tierce"]]), v = n * (n - 1) * (n - 2);
return QN(C[0], v, "L'ordre compte et les trois sont différents : " + M(n + " \\cdot " + (n - 1) + " \\cdot " + (n - 2) + " = " + D(v)) + ".",
{ ctx: C[1], guide: [G("Choix pour la 1re place ?", n, M(n) + "."), G("Pour la 2e (une personne de moins) ?", n - 1, M(n - 1) + "."), G("Total ?", v, M(n + " \\cdot " + (n - 1) + " \\cdot " + (n - 2) + " = " + D(v)) + ".")],
traps: [TR(Cb(n, 3), "Ici l'ordre compte (1er ≠ 2e) : on ne divise pas par 3!."), TR(n ** 3, "Une même personne ne peut pas occuper deux places."), TR(n * (n - 1), "Il y a trois places à attribuer.")] }); },
],
2: [
() => { const t = pk(["deleg", "mains", "pizza"]); let n, k, txt;
if (t === "deleg") { n = ri(15, 25); k = pk([2, 3]); txt = "Une classe de " + n + " élèves choisit " + k + " délégués (sans rôle particulier). Combien de groupes de délégués sont possibles ?"; }
else if (t === "mains") { n = ri(8, 30); k = 2; txt = n + " personnes se saluent : chacune serre la main de chaque autre, une seule fois. Combien de poignées de main ?"; }
else { n = ri(8, 12); k = pk([2, 3, 4]); txt = "Une pizzeria propose " + n + " garnitures. Combien de pizzas différentes peut-on composer avec " + k + " garnitures différentes ?"; }
const A = Cb(n, k) * fact(k), v = Cb(n, k);
return QN(txt, v, "L'ordre ne compte pas : " + M(bn(n, k) + " = \\frac{" + D(A) + "}{" + k + "!} = " + D(v)) + ".",
{ ctx: "combinaisons-" + t, guide: [G("Si l'ordre comptait (" + M(Array.from({ length: k }, (_, i) => n - i).join(" \\cdot ")) + ") ?", A, M(D(A)) + "."), G("Nombre d'ordres d'un même groupe, " + M(k + "!") + " ?", fact(k), M(fact(k)) + "."), G("Nombre de groupes ?", v, M(D(v)) + ".")],
traps: [TR(A, "L'ordre ne compte pas : divise par " + k + "! = " + fact(k) + "."), TR(n ** k, "On ne choisit pas deux fois le même élément, et l'ordre ne compte pas."), TR(n * k, "Ce n'est pas n · k : compte les groupes.")] }); },
() => { const t = pk(["qcm", "cadenas", "code"]); let b, e, txt;
if (t === "qcm") { e = ri(5, 8); b = pk([3, 4]); txt = "Un QCM a " + e + " questions, chacune avec " + b + " réponses possibles. Combien de grilles de réponses différentes peut-on remplir (une réponse par question) ?"; }
else if (t === "cadenas") { e = ri(3, 5); b = pk([6, 8, 12]); txt = "Un cadenas a " + e + " roues de " + b + " symboles chacune. Combien de combinaisons différentes ?"; }
else { e = 3; b = 26; txt = "Combien de codes de 3 lettres (de A à Z, répétitions permises) peut-on former ?"; }
const v = b ** e;
return QN(txt, v, "Chaque position a " + M(b) + " possibilités, indépendamment des autres : " + M(b + "^" + e + " = " + D(v)) + ".",
{ ctx: "puissance-" + t, guide: [G("Nombre de possibilités pour chaque position ?", b, M(b) + "."), G("Total " + M(b + "^" + e) + " ?", v, M(D(v)) + ".")],
traps: [TR(b * e, "On multiplie " + b + " par lui-même " + e + " fois : " + b + "^" + e + "."), TR(e ** b, "C'est (possibilités par position) puissance (nombre de positions)."), TR(Cb(b, e) * fact(e), "Les répétitions sont permises.")] }); },
() => { const w = pk(WORDS), cnt = {}; for (const ch of w) cnt[ch] = (cnt[ch] || 0) + 1; const reps = Object.values(cnt).filter((c) => c > 1), prod = reps.reduce((s, c) => s * fact(c), 1), n = w.length, v = fact(n) / prod;
return QN("Combien de « mots » différents (même sans signification) peut-on écrire avec toutes les lettres du mot " + w + " ?", v,
M(n) + " lettres : " + M(n + "! = " + D(fact(n))) + " ordres. " + (reps.length ? "Échanger des lettres identiques ne change pas le mot : on divise par " + M(reps.map((c) => c + "!").join(" \\cdot ") + " = " + prod) + ". " + M("\\frac{" + D(fact(n)) + "}{" + prod + "} = " + D(v)) + "." : "Toutes les lettres sont différentes : " + M(D(v)) + " mots."),
{ ctx: "anagramme", guide: [G("Nombre de lettres " + M("n") + " ; que vaut " + M("n!") + " ?", fact(n), M(n + "! = " + D(fact(n))) + "."), G("Produit des factorielles des lettres répétées (1 s'il n'y en a pas) ?", prod, M(prod) + "."), G("Nombre de mots ?", v, M(D(v)) + ".")],
traps: [TR(fact(n), "Des lettres identiques échangées donnent le même mot : divise par les factorielles des répétitions."), reps.length > 1 ? TR(fact(n) / fact(reps[0]), "Toutes les lettres répétées comptent : divise par le produit de leurs factorielles.") : null, TR(n ** n, "Chaque lettre n'est utilisée qu'une fois.")] }); },
],
3: [
() => { const g = ri(4, 9), b = ri(4, 9), k = pk([3, 4]), j = ri(1, k - 1), v = Cb(g, j) * Cb(b, k - j);
return QN("Une classe compte " + g + " filles et " + b + " garçons. On forme un comité de " + k + " élèves. Combien de comités comptent exactement " + j + " fille" + (j > 1 ? "s" : "") + " ?", v,
"On choisit les filles ET les garçons : " + M(bn(g, j) + " \\cdot " + bn(b, k - j) + " = " + Cb(g, j) + " \\cdot " + Cb(b, k - j) + " = " + D(v)) + ".",
{ ctx: "comite-exact", guide: [G("Choix des " + j + " fille" + (j > 1 ? "s" : "") + ", " + M(bn(g, j)) + " ?", Cb(g, j), M(Cb(g, j)) + "."), G("Choix des " + (k - j) + " garçon" + (k - j > 1 ? "s" : "") + " ?", Cb(b, k - j), M(Cb(b, k - j)) + "."), G("Total ?", v, M(D(v)) + ".")],
traps: [TR(Cb(g + b, k), "Ce sont tous les comités, sans condition."), TR(Cb(g, j) + Cb(b, k - j), "Filles ET garçons : on multiplie les choix."), TR(Cb(g, j) * Cb(b, k - j) * fact(k), "Dans un comité, l'ordre ne compte pas.")] }); },
() => { const g = ri(3, 8), b = ri(4, 9), k = pk([3, 4]), n = g + b, v = Cb(n, k) - Cb(b, k);
return QN("Une classe compte " + g + " filles et " + b + " garçons. On forme un comité de " + k + " élèves. Combien de comités comptent au moins une fille ?", v,
"Par le contraire : tous les comités moins ceux sans fille. " + M(bn(n, k) + " - " + bn(b, k) + " = " + D(Cb(n, k)) + " - " + D(Cb(b, k)) + " = " + D(v)) + ".",
{ ctx: "au-moins-une", guide: [G("Nombre total de comités ?", Cb(n, k), M(bn(n, k) + " = " + D(Cb(n, k))) + "."), G("Comités sans fille (que des garçons) ?", Cb(b, k), M(bn(b, k) + " = " + D(Cb(b, k))) + "."), G("Au moins une fille ?", v, M(D(v)) + ".")],
traps: [TR(Cb(n, k), "Retire les comités sans fille."), TR(g * Cb(n - 1, k - 1), "Ce calcul compte plusieurs fois les comités à plusieurs filles : passe par le contraire."), TR(Cb(b, k), "C'est le nombre de comités sans fille.")] }); },
() => { const n = ri(6, 24), H = (n * (n - 1)) / 2;
return QN("Lors d'une fête, chaque invité serre la main de chaque autre invité, une seule fois. On compte " + T(H) + " poignées de main. Combien y a-t-il d'invités ?", n,
M("\\frac{n(n - 1)}{2} = " + D(H) + " \\iff n(n - 1) = " + D(2 * H)) + " ; or " + M(n + " \\cdot " + (n - 1) + " = " + D(2 * H)) + ", donc " + M("n = " + n) + ".",
{ ctx: "poignees-inverse", guide: [G("Avec " + M("n") + " invités, il y a " + M("\\frac{n(n - 1)}{2}") + " poignées. Que vaut " + M("n(n - 1)") + " ?", 2 * H, M(D(2 * H)) + "."), G(M("n") + " (deux entiers consécutifs dont le produit vaut " + M(D(2 * H)) + ") ?", n, M(n) + ".")],
traps: [TR(n - 1, "n(n − 1) : n est le plus grand des deux facteurs."), TR(2 * H, "C'est n(n − 1) ; il faut encore trouver n."), TR(n + 1, "Vérifie : " + (n + 1) + " · " + n + " ≠ " + T(2 * H) + ".")] }); },
() => { const n = ri(4, 7), v = 2 * fact(n - 1);
return QN(n + " amis, dont Alix et Bao, s'assoient sur un banc de " + n + " places. De combien de façons peuvent-ils s'asseoir si Alix et Bao veulent être côte à côte ?", v,
"On colle Alix et Bao en un bloc : " + M(n - 1) + " « objets » à ranger, " + M((n - 1) + "! = " + D(fact(n - 1))) + " façons ; dans le bloc, 2 ordres. " + M("2 \\cdot " + D(fact(n - 1)) + " = " + D(v)) + ".",
{ ctx: "cote-a-cote", guide: [G("Alix et Bao forment un bloc : combien d'« objets » à ranger ?", n - 1, M(n - 1) + "."), G("Nombre de rangements de ces objets ?", fact(n - 1), M((n - 1) + "! = " + D(fact(n - 1))) + "."), G("Total (2 ordres dans le bloc) ?", v, M(D(v)) + ".")],
traps: [TR(fact(n - 1), "Alix et Bao peuvent échanger leurs places : multiplie par 2."), TR(fact(n), "Ce sont toutes les dispositions, sans contrainte."), TR(2 * fact(n - 2), "Le bloc compte comme un objet : " + (n - 1) + " objets.")] }); },
() => { const k = pk([3, 4]), v = k === 3 ? 648 : 4536;
return QN("Combien de nombres de " + k + " chiffres (le premier n'est pas 0) ont tous leurs chiffres différents ?", v,
"1er chiffre : 9 choix (pas 0). 2e : 9 choix (0 redevient possible, mais pas le 1er chiffre). Puis 8" + (k === 4 ? ", puis 7" : "") + ". " + M("9 \\cdot 9 \\cdot 8" + (k === 4 ? " \\cdot 7" : "") + " = " + D(v)) + ".",
{ ctx: "chiffres-distincts", guide: [G("Choix du 1er chiffre ?", 9, M(9) + " (de 1 à 9)."), G("Choix du 2e chiffre ?", 9, M(9) + " : le 0 est permis, pas le 1er chiffre."), G("Total ?", v, M(D(v)) + ".")],
traps: [TR(k === 3 ? 720 : 5040, "Le premier chiffre ne peut pas être 0 : 9 choix."), TR(k === 3 ? 504 : 3024, "Pour le 2e chiffre, le 0 redevient possible : encore 9 choix."), TR(k === 3 ? 900 : 9000, "Les chiffres doivent être différents.")] }); },
],
};


const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];
const PA = {
1: [


() => { const r = ri(4, 9), b = ri(3, 8), n = r + b, col = pk([["rouges", "bleues", "boules"], ["vertes", "jaunes", "billes"], ["noires", "blanches", "perles"]]), ask = pk(["deux", "mixte"]);
const fav = ask === "deux" ? Cb(r, 2) : r * b, v = fav / Cb(n, 2);
return QN("Un sac contient " + r + " " + col[2] + " " + col[0] + " et " + b + " " + col[2] + " " + col[1] + ". On en tire deux simultanément. Quelle est la probabilité d'obtenir " + (ask === "deux" ? "deux " + col[2] + " " + col[0] : "une " + col[2].slice(0, -1) + " de chaque couleur") + " ?", v,
M(bn(n, 2) + " = " + Cb(n, 2)) + " tirages équiprobables ; favorables : " + M(ask === "deux" ? bn(r, 2) + " = " + fav : r + " \\cdot " + b + " = " + fav) + ". " + M("P = \\frac{" + fav + "}{" + Cb(n, 2) + "}" + (den(v) < Cb(n, 2) ? " = " + fT(v) : "")) + ".",
{ ctx: "simultane-" + ask, guide: [G("Nombre de tirages possibles " + M(bn(n, 2)) + " ?", Cb(n, 2), M(Cb(n, 2)) + "."), G("Nombre de tirages favorables ?", fav, M(fav) + "."), G("Probabilité ?", v, M(fT(v)) + ".")],
traps: ask === "deux" ? [TR((r / n) ** 2, "Les deux boules sont tirées ensemble : pas de remise."), TR(r / n, "Il faut deux boules de cette couleur."), TR(Cb(r, 2) / (n * n), "Le nombre de tirages possibles est C(" + n + " ; 2) = " + Cb(n, 2) + ".")] : [TR(r * b / (n * n), "Sans remise : C(" + n + " ; 2) = " + Cb(n, 2) + " tirages possibles."), TR(r * b / (n * (n - 1)), "Une paire non ordonnée : C(" + n + " ; 2) = " + Cb(n, 2) + ", pas " + n * (n - 1) + "."), TR(0.5, "Les couleurs n'ont pas le même nombre de boules.")] }); },
() => { const t = pk(["des", "jass"]); let v, txt, cmp, ctx, tr;
if (t === "des") { const k = pk([3, 4, 5]); v = 1 - (5 / 6) ** k; cmp = (5 / 6) ** k; ctx = "au-moins-un-six"; txt = "On lance " + k + " dés équilibrés. Quelle est la probabilité d'obtenir au moins un 6 (" + "arrondi au millième) ?"; tr = [TR(k / 6, "Les cas « un 6 sur le 1er dé », « sur le 2e »… ne sont pas incompatibles : passe par le contraire."), TR(cmp, "C'est la probabilité de n'avoir aucun 6 ; prends le contraire."), TR(1 - (1 / 6) ** k, "Le contraire de « au moins un 6 » est « aucun 6 » : (5/6)^" + k + ".")]; }
else { const k = pk([3, 4]); cmp = Cb(32, k) / Cb(36, k); v = 1 - cmp; ctx = "au-moins-un-as"; txt = "On tire simultanément " + k + " cartes d'un jeu de jass de 36 cartes (4 as). Quelle est la probabilité d'obtenir au moins un as (arrondi au millième) ?"; tr = [TR(k * 4 / 36, "Les événements « un as en 1re carte »… ne sont pas incompatibles : passe par le contraire."), TR(cmp, "C'est la probabilité de n'avoir aucun as ; prends le contraire."), TR(4 / 36, "Il y a " + k + " cartes tirées.")]; }
return mk(txt, { kind: "value", value: v, round: 0.001 }, "Événement contraire : " + M("P = 1 - P(\\text{aucun}) = 1 - " + dS3(cmp) + " \\approx " + dS3(v)) + ".",
{ ctx, guide: [GS("Probabilité de l'événement contraire « aucun » (" + "arrondie au millième) ?", cmp, M("\\approx " + dS3(cmp)) + ".", 0.001), GS("Probabilité cherchée ?", v, M("\\approx " + dS3(v)) + ".", 0.001)], traps: tr }); },
() => { const t = pk([["chiffres", 10, pk([3, 4]), "Un code de", "chiffres (de 0 à 9) est choisi au hasard."], ["lettres", 6, pk([3, 4]), "Un mot de passe de", "lettres, chacune tirée au hasard parmi A, B, C, D, E, F."], ["anniversaires", 12, pk([3, 4, 5]), "Dans un groupe de", "personnes, chacune est née un mois au hasard (12 mois équiprobables)."]]);
const n = t[1], k = t[2], A = Cb(n, k) * fact(k), N = n ** k, v = A / N;
return mk(t[3] + " " + k + " " + t[4] + " Quelle est la probabilité que " + (t[0] === "anniversaires" ? "toutes soient nées des mois différents" : "tous ses symboles soient différents") + " (arrondi au millième) ?", { kind: "value", value: v, round: 0.001 },
"Issues équiprobables : " + M(n + "^" + k + " = " + D(N)) + ". Favorables (arrangements) : " + M(Array.from({ length: k }, (_, i) => n - i).join(" \\cdot ") + " = " + D(A)) + ". " + M("P = \\frac{" + D(A) + "}{" + D(N) + "} \\approx " + dS3(v)) + ".",
{ ctx: "tous-differents-" + t[0], guide: [G("Nombre total d'issues " + M(n + "^" + k) + " ?", N, M(D(N)) + "."), G("Nombre d'issues sans répétition ?", A, M(D(A)) + "."), GS("Probabilité (arrondie au millième) ?", v, M("\\approx " + dS3(v)) + ".", 0.001)],
traps: [TR(Cb(n, k) / N, "L'ordre compte dans les issues : compte les arrangements " + n + " · " + (n - 1) + " · …"), TR(1 - v, "C'est la probabilité qu'au moins deux symboles soient égaux."), TR(A / (Cb(n + k - 1, k) * fact(k)), "Le total des issues est " + n + "^" + k + ".")] }); },
],
2: [
() => { const a = pk([0.3, 0.4, 0.45, 0.5, 0.25, 0.6]), b = pk([0.2, 0.35, 0.4, 0.15, 0.3]), i = pk([0.05, 0.1, 0.15]), ask = pk(["union", "inter"]), u = r6(a + b - i); if (i >= Math.min(a, b) || u > 1) return null;
if (ask === "union") return QN("On sait que " + M("P(A) = " + D(a)) + ", " + M("P(B) = " + D(b)) + " et " + M("P(A \\cap B) = " + D(i)) + ". Calcule " + M("P(A \\cup B)") + ".", u,
M("P(A \\cup B) = P(A) + P(B) - P(A \\cap B) = " + D(a) + " + " + D(b) + " - " + D(i) + " = " + D(u)) + ".",
{ ctx: "reunion", guide: [G(M("P(A) + P(B)") + " ?", r6(a + b), M(D(r6(a + b))) + "."), G(M("P(A \\cup B)") + " ?", u, M(D(u)) + ".")],
traps: [TR(r6(a + b), "A ∩ B est compté deux fois : retire-le une fois."), TR(r6(a + b + i), "On retire P(A ∩ B), on ne l'ajoute pas."), TR(r6(a * b), "C'est un produit ; pour « A ou B », on additionne et on retire P(A ∩ B).")] });
return QN("On sait que " + M("P(A) = " + D(a)) + ", " + M("P(B) = " + D(b)) + " et " + M("P(A \\cup B) = " + D(u)) + ". Calcule " + M("P(A \\cap B)") + ".", i,
M("P(A \\cap B) = P(A) + P(B) - P(A \\cup B) = " + D(a) + " + " + D(b) + " - " + D(u) + " = " + D(i)) + ".",
{ ctx: "intersection", guide: [G(M("P(A) + P(B)") + " ?", r6(a + b), M(D(r6(a + b))) + "."), G(M("P(A \\cap B)") + " ?", i, M(D(i)) + ".")],
traps: [TR(r6(a * b), "A et B ne sont pas forcément indépendants : utilise P(A ∪ B) = P(A) + P(B) − P(A ∩ B)."), TR(r6(u - a), "C'est P(B) − P(A ∩ B) : retire encore."), TR(r6(a + b + u), "P(A ∩ B) = P(A) + P(B) − P(A ∪ B).")] }); },
() => { const S = pk(["un cœur", "un pique", "un trèfle", "un carreau"]), Gp = pk([["un as", 4], ["une figure (valet, dame ou roi)", 12], ["une carte de valeur 6, 7 ou 8", 12], ["un dix ou un as", 8]]), both = Gp[1] / 4, cnt = 9 + Gp[1] - both, v = cnt / 36;

return QN("On tire une carte au hasard dans un jeu de jass de 36 cartes (4 couleurs de 9 cartes : 6, 7, 8, 9, 10, valet, dame, roi, as). Quelle est la probabilité de tirer " + S + (/ ou /.test(Gp[0]) ? ", ou bien " : " ou ") + Gp[0] + " ?", v,
M("P(A \\cup B) = \\frac{9}{36} + \\frac{" + Gp[1] + "}{36} - \\frac{" + both + "}{36} = \\frac{" + cnt + "}{36}" + (den(v) < 36 ? " = " + fT(v) : "")) + (both === 1 ? " (la carte qui est les deux à la fois est comptée une seule fois)." : " (les " + both + " cartes qui sont les deux à la fois sont comptées une seule fois)."),
{ ctx: "jass", guide: [G("Nombre de cartes de la couleur ?", 9, M(9) + "."), G("Nombre de cartes « " + Gp[0] + " » ?", Gp[1], M(Gp[1]) + "."), G("Cartes qui sont les deux à la fois ?", both, M(both) + "."), G("Probabilité ?", v, M(fT(v)) + ".")],
traps: [TR((9 + Gp[1]) / 36, "Les " + both + " cartes qui sont les deux à la fois sont comptées deux fois."), TR(both / 36, "C'est « et » ; on demande « ou »."), TR((9 * Gp[1]) / 36 / 36, "Pour « ou », on additionne et on retire l'intersection.")] }); },
() => { const N = pk([24, 25, 28, 30]), a = ri(8, 15), b = ri(6, 12), c = ri(2, Math.min(a, b) - 2), nn = N - a - b + c; if (nn <= 1) return null; const v = nn / N, act = pk([["font du football", "jouent d'un instrument", "ne fasse ni football ni musique", "sondage-loisirs"], ["ont un chat", "ont un chien", "n'ait ni chat ni chien", "sondage-animaux"], ["lisent des mangas", "lisent des BD", "ne lise ni mangas ni BD", "sondage-lecture"]]);
return QN("Dans une classe de " + N + " élèves, " + a + " " + act[0] + ", " + b + " " + act[1] + " et " + c + " font les deux. On choisit un élève au hasard. Quelle est la probabilité qu'il " + act[2] + " ?", v,
"Au moins l'un des deux : " + M(a + " + " + b + " - " + c + " = " + (a + b - c)) + " élèves. Ni l'un ni l'autre : " + M(N + " - " + (a + b - c) + " = " + nn) + ". Probabilité " + M("\\frac{" + nn + "}{" + N + "}" + (den(v) < N ? " = " + fT(v) : "")) + ".",
{ ctx: act[3], guide: [G("Élèves concernés par au moins l'un des deux (" + a + " + " + b + " − " + c + ") ?", a + b - c, M(a + b - c) + "."), G("Ni l'un ni l'autre ?", nn, M(nn) + "."), G("Probabilité ?", v, M(fT(v)) + ".")],
traps: [TR((N - a - b) / N, "Les " + c + " élèves qui font les deux ont été retirés deux fois."), TR(c / N, "C'est la probabilité de « les deux »."), TR(nn, "C'est un nombre d'élèves : divise par " + N + ".")] }); },
],
3: [
() => { const a = pk([0.4, 0.5, 0.45, 0.6, 0.35]), b = pk([0.3, 0.25, 0.4, 0.2]), i = pk([0.1, 0.15, 0.05]), u = r6(a + b - i), v = r6(a - i); if (u > 1 || i >= b) return null;
return QN("On sait que " + M("P(A) = " + D(a)) + ", " + M("P(B) = " + D(b)) + " et " + M("P(A \\cup B) = " + D(u)) + ". Quelle est la probabilité que " + M("A") + " se réalise, mais pas " + M("B") + " ?", v,
M("P(A \\cap B) = " + D(a) + " + " + D(b) + " - " + D(u) + " = " + D(i)) + ", puis " + M("P(A \\cap \\overline{B}) = P(A) - P(A \\cap B) = " + D(a) + " - " + D(i) + " = " + D(v)) + ".",
{ ctx: "a-seulement", guide: [G(M("P(A \\cap B)") + " ?", i, M(D(i)) + "."), G(M("P(A) - P(A \\cap B)") + " ?", v, M(D(v)) + ".")],
traps: [TR(i, "C'est P(A ∩ B) : A et B ensemble."), TR(r6(a - b), "On retire la partie commune P(A ∩ B), pas P(B)."), TR(r6(a * (1 - b)), "A et B ne sont pas forcément indépendants : passe par P(A ∩ B).")] }); },
() => { const m = ri(2, 5), ask = pk(["six", "pair", "petit"]), tot = 5 + m, v = ask === "six" ? m / tot : ask === "pair" ? (2 + m) / tot : 3 / tot, ev = { six: "un 6", pair: "un nombre pair", petit: "un nombre inférieur ou égal à 3" }[ask];
return QN("Un dé est truqué : le 6 sort " + m + " fois plus souvent que chacune des autres faces (qui sont équiprobables entre elles). Quelle est la probabilité d'obtenir " + ev + " ?", v,
"Si une face ordinaire a la probabilité " + M("p") + " : " + M("5p + " + m + "p = 1") + ", " + M("p = \\frac{1}{" + tot + "}") + ". " + (ask === "six" ? M("P(6) = \\frac{" + m + "}{" + tot + "}") : ask === "pair" ? M("P(\\text{pair}) = p + p + " + m + "p = \\frac{" + (2 + m) + "}{" + tot + "}") : M("P(\\le 3) = 3p = \\frac{3}{" + tot + "}")) + (den(v) < tot ? " " + M("= " + fT(v)) : "") + ".",
{ ctx: "de-truque-" + ask, guide: [G("Probabilité " + M("p") + " d'une face ordinaire (" + M("5p + " + m + "p = 1") + ") ?", 1 / tot, M("\\frac{1}{" + tot + "}") + "."), G("Probabilité demandée ?", v, M(fT(v)) + ".")],
traps: [TR(ask === "six" ? m / 6 : ask === "pair" ? 1 / 2 : 1 / 2, "Le dé est truqué : les faces ne sont pas équiprobables."), TR(ask === "six" ? 1 / 6 : ask === "pair" ? (2 + m) / 6 : 3 / (6 + m), "La somme des six probabilités vaut 1 : 5p + " + m + "p = 1."), TR(ask === "six" ? 1 / tot : (ask === "pair" ? 3 : 2) / tot, ask === "six" ? "C'est p, la probabilité d'une face ordinaire : le 6 vaut " + m + "p." : "Compte bien les faces : le 6 vaut " + m + "p.")] }); },
() => { const k = pk(["produit", "six", "ecart", "somme"]); let cnt, txt, trs;
if (k === "produit") { cnt = 27; txt = "un produit pair"; trs = [TR(1 / 2, "Le produit est pair dès qu'un des deux dés est pair."), TR(1 / 4, "C'est la probabilité que les deux soient pairs.")]; }
else if (k === "six") { cnt = 11; txt = "au moins un 6"; trs = [TR(12 / 36, "Le couple (6 ; 6) est compté deux fois."), TR(1 / 36, "C'est la probabilité de deux 6.")]; }
else if (k === "ecart") { const d = ri(1, 4); cnt = 2 * (6 - d); txt = "un écart de " + d + " entre les deux résultats (le plus grand moins le plus petit)"; trs = [TR((6 - d) / 36, "Deux ordres : par exemple (1 ; " + (1 + d) + ") et (" + (1 + d) + " ; 1)."), TR(1 / 6, "Les écarts ne sont pas équiprobables : compte les couples.")]; }
else { const s = ri(9, 11); cnt = [0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 6, 3][s]; txt = "une somme d'au moins " + s; trs = [TR((6 - Math.abs(7 - s)) / 36, "« Au moins " + s + " » : additionne les sommes " + s + ", " + (s + 1) + ", …, 12."), TR((13 - s) / 11, "Les sommes ne sont pas équiprobables : compte les 36 couples.")]; }
const v = cnt / 36;
return QN("On lance deux dés équilibrés (un rouge et un bleu). Quelle est la probabilité d'obtenir " + txt + " ?", v,
"On compte dans le tableau des 36 couples (rouge ; bleu) : " + M(cnt) + " cas favorables. " + M("\\frac{" + cnt + "}{36}" + (den(v) < 36 ? " = " + fT(v) : "")) + "." + (k === "produit" ? " (Par le contraire : produit impair quand les deux sont impairs, " + M("\\frac{9}{36}") + ".)" : k === "six" ? " (Par le contraire : " + M("1 - \\frac{25}{36}") + ".)" : ""),
{ ctx: "deux-des-" + k, guide: [G("Nombre de couples favorables (sur 36) ?", cnt, M(cnt) + "."), G("Probabilité ?", v, M(fT(v)) + ".")], traps: trs.concat([TR(cnt, "C'est le nombre de cas : divise par 36.")]) }); },
],
};


const PT = {
1: [


() => { const r = ri(3, 8), b = ri(3, 8), n = r + b, it = pk(ITEMS), v = (2 * r * b) / (n * (n - 1));
return QN("Une urne contient " + r + " " + it[0] + " " + it[1] + " et " + b + " " + it[0] + " " + it[2] + ". On en tire deux, l'une après l'autre, sans remise. Quelle est la probabilité d'obtenir exactement une " + it[0].replace(/s$/, "") + " " + it[1].replace(/s$/, "") + " ?", v,
"Deux chemins : " + it[1].replace(/s$/, "") + " puis " + it[2].replace(/s$/, "") + ", ou l'inverse. " + M("\\frac{" + r + "}{" + n + "} \\cdot \\frac{" + b + "}{" + (n - 1) + "} + \\frac{" + b + "}{" + n + "} \\cdot \\frac{" + r + "}{" + (n - 1) + "} = " + fT(v)) + ".",
{ ctx: "exactement-une", guide: [G("Probabilité du chemin « " + it[1].replace(/s$/, "") + " puis " + it[2].replace(/s$/, "") + " » ?", (r * b) / (n * (n - 1)), M(fT((r * b) / (n * (n - 1)))) + "."), G("Probabilité cherchée (deux chemins) ?", v, M(fT(v)) + ".")],
traps: [TR((r * b) / (n * (n - 1)), "Il y a deux chemins : l'ordre inverse convient aussi."), TR((2 * r * b) / (n * n), "Sans remise : il reste " + (n - 1) + " objets au 2e tirage."), TR((r / n) * (b / n), "Sans remise, et deux chemins possibles.")] }); },
() => { const p = pk([0.9, 0.95, 0.8, 0.85]), q = pk([0.7, 0.6, 0.75, 0.8]), rr = pk([0.5, 0.6, 0.7]), v = r6(p * (1 - (1 - q) * (1 - rr))), c = pk([["Un circuit électrique fonctionne si le composant A fonctionne et si au moins un des deux composants B, C (montés en parallèle) fonctionne.", "circuit", "le circuit fonctionne"], ["Un réseau informatique fonctionne si le serveur A fonctionne et si au moins un des deux routeurs B, C (de secours l'un pour l'autre) fonctionne.", "reseau", "le réseau fonctionne"], ["Une alarme se déclenche si la centrale A fonctionne et si au moins un des deux détecteurs B, C réagit.", "alarme", "l'alarme se déclenche"]]);
return QN(c[0] + " Les éléments sont indépendants : A fonctionne avec la probabilité " + M(D(p)) + ", B avec " + M(D(q)) + ", C avec " + M(D(rr)) + ". Quelle est la probabilité que " + c[2] + " ?", v,
"B ou C : " + M("1 - (1 - " + D(q) + ")(1 - " + D(rr) + ") = " + D(r6(1 - (1 - q) * (1 - rr)))) + ". Avec A : " + M(D(p) + " \\cdot " + D(r6(1 - (1 - q) * (1 - rr))) + " = " + D(v)) + ".",
{ ctx: "serie-parallele-" + c[1], guide: [G("Probabilité qu'aucun des deux, B et C, ne fonctionne ?", (1 - q) * (1 - rr), M(D(r6((1 - q) * (1 - rr)))) + "."), G("Probabilité qu'au moins un des deux fonctionne ?", 1 - (1 - q) * (1 - rr), M(D(r6(1 - (1 - q) * (1 - rr)))) + "."), G("Avec A ?", v, M(D(v)) + ".")],
traps: [TR(r6(p * q * rr), "B et C sont en parallèle : il suffit que l'un des deux fonctionne."), TR(r6(p * (q + rr)), "B et C ne sont pas incompatibles : passe par le contraire."), TR(r6(1 - (1 - q) * (1 - rr)), "A doit aussi fonctionner : multiplie par " + T(p) + ".")] }); },
() => { const p = pk([0.2, 0.25, 0.3, 0.4, 0.6]), k = pk([3, 4, 5]), v = r6((1 - p) ** (k - 1) * p), c = pk([["Une archère touche la cible", "touche la cible pour la première fois", "tir", "archere"], ["Un basketteur réussit un lancer franc", "réussisse pour la première fois", "lancer", "basket"], ["Un dé truqué donne un 6", "obtienne un 6 pour la première fois", "lancer", "de"]]);
return QN(c[0] + " avec la probabilité " + M(D(p)) + ", à chaque " + c[2] + " et indépendamment. Quelle est la probabilité qu'" + (c[3] === "de" ? "on" : c[3] === "archere" ? "elle" : "il") + " " + c[1] + " au " + k + "e " + c[2] + " ?", v,
"Chemin : " + (k - 1) + " échecs puis un succès. " + M("(1 - " + D(p) + ")^{" + (k - 1) + "} \\cdot " + D(p) + " = " + D(r6((1 - p) ** (k - 1))) + " \\cdot " + D(p) + " = " + D(v)) + ".",
{ ctx: "premier-succes-" + c[3], guide: [G("Probabilité de " + (k - 1) + " échecs de suite ?", (1 - p) ** (k - 1), M(D(r6((1 - p) ** (k - 1)))) + "."), G("Puis un succès ?", v, M(D(v)) + ".")],
traps: [TR(p, "Il faut d'abord " + (k - 1) + " échecs."), TR(r6((1 - p) ** k), "Le dernier " + c[2] + " est un succès : facteur " + T(p) + "."), TR(r6(1 - (1 - p) ** k), "C'est « au moins un succès en " + k + " », pas « le premier au " + k + "e ».")] }); },
],
2: [
() => { const r = ri(3, 7), b = ri(2, 6), n = r + b, it = pk(ITEMS), v = (r * (r - 1)) / (n * (n - 1));
return QN("Une urne contient " + r + " " + it[0] + " " + it[1] + " et " + b + " " + it[0] + " " + it[2] + ". On en tire deux, l'une après l'autre, sans remise. Quelle est la probabilité d'obtenir deux " + it[0] + " " + it[1] + " ?", v,
"Sans remise : au 2e tirage, il reste " + M(r - 1) + " " + it[1] + " sur " + M(n - 1) + ". " + M("\\frac{" + r + "}{" + n + "} \\cdot \\frac{" + (r - 1) + "}{" + (n - 1) + "} = " + fT(v)) + ".",
{ ctx: "urne-sans-remise", guide: [G("Probabilité au 1er tirage ?", r / n, M(fT(r / n)) + "."), G("Au 2e tirage, sachant que la 1re était " + it[3] + " ?", (r - 1) / (n - 1), M(fT((r - 1) / (n - 1))) + "."), G("Produit ?", v, M(fT(v)) + ".")],
traps: [TR((r / n) ** 2, "Sans remise : au 2e tirage, il reste " + (r - 1) + " " + it[1] + " sur " + (n - 1) + "."), TR((r - 1) / (n - 1), "C'est seulement la 2e branche : multiplie par la 1re."), TR((r * (r - 1)) / (n * n), "Le dénominateur aussi diminue : " + (n - 1) + " au 2e tirage.")] }); },
() => { const r = ri(2, 7), b = ri(2, 7), n = r + b, it = pk(ITEMS), v = (2 * r * b) / (n * n);
return QN("Une urne contient " + r + " " + it[0] + " " + it[1] + " et " + b + " " + it[0] + " " + it[2] + ". On en tire une, on la remet, puis on en tire une deuxième. Quelle est la probabilité d'obtenir deux couleurs différentes ?", v,
"Deux chemins : " + it[3] + " puis " + it[4] + ", ou " + it[4] + " puis " + it[3] + ". " + M("\\frac{" + r + "}{" + n + "} \\cdot \\frac{" + b + "}{" + n + "} + \\frac{" + b + "}{" + n + "} \\cdot \\frac{" + r + "}{" + n + "} = " + fT(v)) + ".",
{ ctx: "urne-deux-couleurs", guide: [G("Chemin " + it[3] + " puis " + it[4] + " ?", (r * b) / (n * n), M(fT((r * b) / (n * n))) + "."), G("Total (deux chemins) ?", v, M(fT(v)) + ".")],
traps: [TR((r * b) / (n * n), "Il y a deux ordres : " + it[3] + " puis " + it[4] + ", et l'inverse."), TR((2 * r * b) / (n * (n - 1)), "Avec remise : l'urne est la même au 2e tirage."), TR((r + b) / (n * n), "Le long d'un chemin, on multiplie.")] }); },
() => { const C = pk([[(p, k) => "Un archer touche la cible avec la probabilité " + M(D(p)) + " à chaque tir, indépendamment. Il tire " + k + " fois. Quelle est la probabilité qu'il touche la cible au moins une fois ?", "archer"], [(p, k) => "Sur son trajet, Mia passe " + k + " feux indépendants ; chacun est rouge avec la probabilité " + M(D(p)) + ". Quelle est la probabilité qu'elle rencontre au moins un feu rouge ?", "feux-rouges"], [(p, k) => "Une graine germe avec la probabilité " + M(D(p)) + ". On plante " + k + " graines (indépendantes). Quelle est la probabilité qu'au moins une graine germe ?", "graines"]]);
const p = pk([0.1, 0.2, 0.3, 0.4, 0.6]), k = ri(2, 4), none = r6((1 - p) ** k), v = r6(1 - none);
return QN(C[0](p, k), v,
"Par le contraire : « aucun » a la probabilité " + M(D(r6(1 - p)) + "^" + k + " = " + D(none)) + ", donc " + M("1 - " + D(none) + " = " + D(v)) + ".",
{ ctx: "au-moins-un-" + C[1], guide: [G("Probabilité d'un échec à un essai ?", 1 - p, M(D(r6(1 - p))) + "."), G("Probabilité de « aucun » sur les " + k + " essais ?", none, M(D(r6(1 - p)) + "^" + k + " = " + D(none)) + "."), G("Au moins un ?", v, M(D(v)) + ".")],
traps: [TR(r6(k * p), "On ne peut pas additionner : passe par le contraire « aucun »."), TR(r6(p ** k), "C'est la probabilité que tous réussissent."), TR(none, "C'est la probabilité de « aucun » : prends le contraire.")] }); },
],
3: [
() => { const r = ri(3, 6), b = ri(3, 6), n = r + b, it = pk(ITEMS), dn = n * (n - 1) * (n - 2), pr = (r * (r - 1) * (r - 2)) / dn, pb = (b * (b - 1) * (b - 2)) / dn, v = pr + pb;
return QN("Une urne contient " + r + " " + it[0] + " " + it[1] + " et " + b + " " + it[0] + " " + it[2] + ". On en tire trois, l'une après l'autre, sans remise. Quelle est la probabilité qu'elles soient toutes de la même couleur ?", v,
"Deux chemins : trois " + it[1] + " " + M("\\frac{" + r + " \\cdot " + (r - 1) + " \\cdot " + (r - 2) + "}{" + n + " \\cdot " + (n - 1) + " \\cdot " + (n - 2) + "} = " + fT(pr)) + ", ou trois " + it[2] + " " + M("= " + fT(pb)) + ". Total " + M(fT(v)) + ".",
{ ctx: "trois-meme-couleur", guide: [G("Probabilité de trois " + it[1] + " ?", pr, M(fT(pr)) + "."), G("Probabilité de trois " + it[2] + " ?", pb, M(fT(pb)) + "."), G("Total ?", v, M(fT(v)) + ".")],
traps: [TR(pr, "Il y a deux couleurs possibles : additionne les deux chemins."), TR((r ** 3 + b ** 3) / n ** 3, "Sans remise : l'urne change à chaque tirage."), TR(pr * pb, "Ce sont deux chemins différents : on les additionne.")] }); },
() => { const r1 = ri(1, 5), n1 = r1 + ri(1, 5), r2 = ri(1, 5), n2 = r2 + ri(1, 5), cho = pk(["piece", "de"]), pU = cho === "piece" ? 1 / 2 : 1 / 3; if (r1 * n2 === r2 * n1) return null; const v = pU * (r1 / n1) + (1 - pU) * (r2 / n2);
return QN("L'urne U₁ contient " + r1 + " boule" + (r1 > 1 ? "s" : "") + " rouge" + (r1 > 1 ? "s" : "") + " et " + (n1 - r1) + " bleue" + (n1 - r1 > 1 ? "s" : "") + " ; l'urne U₂, " + r2 + " rouge" + (r2 > 1 ? "s" : "") + " et " + (n2 - r2) + " bleue" + (n2 - r2 > 1 ? "s" : "") + ". " + (cho === "piece" ? "On lance une pièce : pile, on tire une boule dans U₁ ; face, dans U₂." : "On lance un dé : avec 1 ou 2, on tire une boule dans U₁ ; sinon, dans U₂.") + " Quelle est la probabilité de tirer une boule rouge ?", v,
"Deux chemins dans l'arbre : " + M(fT(pU) + " \\cdot \\frac{" + r1 + "}{" + n1 + "} + " + fT(1 - pU) + " \\cdot \\frac{" + r2 + "}{" + n2 + "} = " + fT(v)) + ".",
{ ctx: "deux-urnes-" + cho, guide: [G("Chemin U₁ puis rouge ?", pU * (r1 / n1), M(fT(pU * (r1 / n1))) + "."), G("Chemin U₂ puis rouge ?", (1 - pU) * (r2 / n2), M(fT((1 - pU) * (r2 / n2))) + "."), G("Total ?", v, M(fT(v)) + ".")],
traps: [TR((r1 + r2) / (n1 + n2), "On ne mélange pas les urnes : suis les deux chemins de l'arbre."), TR(r1 / n1 + r2 / n2, "Chaque chemin se multiplie par la probabilité de choisir l'urne."), TR((r1 / n1) * (r2 / n2), "On ne tire qu'une boule : les deux chemins s'additionnent.")] }); },
() => { const r = ri(2, 7), b = ri(2, 7), n = r + b, it = pk(ITEMS), rr = (r * (r - 1)) / (n * (n - 1)), br = (b * r) / (n * (n - 1)), v = r / n;
return QN("Une urne contient " + r + " " + it[0] + " " + it[1] + " et " + b + " " + it[0] + " " + it[2] + ". On en tire deux, l'une après l'autre, sans remise, sans regarder la première. Quelle est la probabilité que la deuxième soit " + it[3] + " ?", v,
"Deux chemins : " + M("\\frac{" + r + "}{" + n + "} \\cdot \\frac{" + (r - 1) + "}{" + (n - 1) + "} + \\frac{" + b + "}{" + n + "} \\cdot \\frac{" + r + "}{" + (n - 1) + "} = \\frac{" + r * (r - 1) + " + " + b * r + "}{" + n * (n - 1) + "} = " + fT(v)) + " : la même probabilité qu'au premier tirage !",
{ ctx: "second-tirage", guide: [G("Chemin " + it[3] + " puis " + it[3] + " ?", rr, M(fT(rr)) + "."), G("Chemin " + it[4] + " puis " + it[3] + " ?", br, M(fT(br)) + "."), G("Total ?", v, M(fT(v)) + ".")],
traps: [TR((r - 1) / (n - 1), "On ne sait pas ce qu'a donné le 1er tirage : il y a deux chemins."), TR(rr, "C'est « deux " + it[1] + " » ; il faut aussi le chemin " + it[4] + " puis " + it[3] + "."), TR(br, "Il manque le chemin " + it[3] + " puis " + it[3] + ".")] }); },
],
};





const DT = {
1: [
() => { const sq = R.rand() < 0.5;
if (sq) { const k = ri(2, 7), c = nz(-3, 3);
return QN("La fonction " + M("f(x) = |x^2 - " + k * k + "|" + (c ? sg(c) + "x" : "")) + " est continue sur " + M("\\mathbb{R}") + ", mais elle n'est pas dérivable en deux points (points anguleux). Donne le plus grand.", k,
"Les points anguleux sont aux zéros de " + M("x^2 - " + k * k) + ", où la valeur absolue « casse » la courbe : " + M("x = \\pm " + k) + ". Les demi-tangentes y ont des pentes différentes (" + M(fT(-2 * k + c)) + " et " + M(fT(2 * k + c)) + " en " + M(k) + ").",
{ ctx: "valeur-absolue-carre", guide: [GSet("Zéros de " + M("x^2 - " + k * k) + " ?", [-k, k], M(setT([-k, k])) + "."), G("Le plus grand ?", k, M(k) + ".")],
traps: [TR(k * k, "La courbe casse là où l'expression dans la valeur absolue s'annule : x² = " + T(k * k) + "."), TR(-k, "On demande le plus grand des deux points."), TR(0, "En 0, la fonction est dérivable : la parabole y est retournée, mais lisse.")] }); }
const a = pk([2, 3, 4, -2, -3]), b = nz(-9, 9), c = pk([1, 2, -1, -3]), v = -b / a; if (Number.isInteger(v) && Math.abs(v) < 2) return null;
return QN("La fonction " + M("f(x) = |" + P2([a, b]) + "|" + sg(c) + "x") + " n'est pas dérivable en un point. Lequel ? (fraction acceptée)", v,
"Point anguleux là où " + M(P2([a, b]) + " = 0") + " : " + M("x = " + fT(v)) + ". À gauche et à droite, les pentes valent " + M(fT(-Math.abs(a) + c)) + " et " + M(fT(Math.abs(a) + c)) + " : elles diffèrent.",
{ ctx: "valeur-absolue-affine", guide: [G("Zéro de " + M(P2([a, b])) + " ?", v, M(fT(v)) + ".")],
traps: [TR(-v, "Résous " + T(a) + "x + " + T(b) + " = 0 avec soin : attention au signe."), TR(-c / a, "Le terme " + T(c) + "x est dérivable partout : regarde l'intérieur de la valeur absolue."), TR(b / a, "x = −b ÷ a.")] }); },
() => { const a = nz(-3, 3), b = ri(-5, 5), m = nz(-6, 6), left = R.rand() < 0.5; if (m === 2 * a) return null; const ya = a * a + b, cc = ya - m * a, v = left ? 2 * a : m; if (Math.abs(v) < 2) return null;
return QN("Soit " + M(cases("x^2" + (b ? sg(b) : ""), "x \\leq " + a, P2([m, cc]), "x > " + a)) + ". Elle est continue en " + M(a) + ". Quelle est la pente de la demi-tangente " + (left ? "à gauche" : "à droite") + " en " + M(a) + " ?", v,
"À gauche : " + M("(x^2)' = 2x") + ", pente " + M(2 * a) + " ; à droite : pente " + M(m) + ". Les deux pentes diffèrent : " + M("f") + " n'est pas dérivable en " + M(a) + " (point anguleux).",
{ ctx: "demi-tangentes", guide: [G("Pente " + (left ? "de " + M("x^2" + (b ? sg(b) : "")) + " en " + M(a) : "de la droite " + M("y = " + P2([m, cc]))) + " ?", v, M(v) + ".")],
traps: [TR(left ? m : 2 * a, "C'est l'autre côté."), TR(left ? a * a + b : ya, "C'est la valeur f(" + T(a) + ") ; on demande une pente."), TR(left ? a : cc, left ? "La dérivée de x² est 2x." : "La pente est le coefficient de x.")] }); },
() => { const a = ri(-4, 2), b = a + pk([2, 4, 6, 3, 5]), p = -(a + b), q = nz(-8, 8), c = (a + b) / 2;
return QN("Soit " + M("f(x) = x^2" + (p ? (p < 0 ? " - " + (p === -1 ? "" : fT(-p)) : " + " + (p === 1 ? "" : fT(p))) + "x" : "") + sg(q)) + " sur " + M("[" + a + " \\,;\\, " + b + "]") + ". On a " + M("f(" + a + ") = f(" + b + ")") + ". Selon le théorème de Rolle, il existe " + M("c") + " dans " + M("]" + a + " \\,;\\, " + b + "[") + " avec " + M("f'(c) = 0") + ". Donne " + M("c") + " (fraction acceptée).", c,
M("f(" + a + ") = f(" + b + ") = " + pv([1, p, q], a)) + " ; " + M("f'(x) = 2x" + sg(p)) + " s'annule en " + M("c = " + fT(c)) + ", qui est bien entre " + M(a) + " et " + M(b) + " (le sommet de la parabole).",
{ ctx: "rolle", guide: [G(M("f(" + a + ")") + " ?", pv([1, p, q], a), M(pv([1, p, q], a)) + " (et de même " + M("f(" + b + ")") + ")."), G("Zéro de " + M("f'(x) = 2x" + sg(p)) + " ?", c, M(fT(c)) + ".")],
traps: [TR(pv([1, p, q], a), "C'est f(" + T(a) + ") ; on cherche c tel que f'(c) = 0."), TR(-c, "2x " + (p < 0 ? "− " + T(-p) : "+ " + T(p)) + " = 0 : attention au signe."), TR(b - a, "c est un nombre de l'intervalle, pas sa longueur.")] }); },
],
2: [
() => { const a = pk([0, 0, 1, 2]), b = a + pk([1, 2, 3]), c = Math.sqrt((a * a + a * b + b * b) / 3), slope = a * a + a * b + b * b;
return mk("Soit " + M("f(x) = x^3") + " sur " + M("[" + a + " \\,;\\, " + b + "]") + ". Selon le théorème des accroissements finis (Lagrange), il existe " + M("c") + " dans " + M("]" + a + " \\,;\\, " + b + "[") + " tel que " + M("f'(c) = \\frac{f(" + b + ") - f(" + a + ")}{" + b + " - " + a + "}") + ". Donne " + M("c") + " (au centième).", { kind: "value", value: c, round: 0.01 },
"Pente de la corde : " + M("\\frac{" + b ** 3 + " - " + a ** 3 + "}{" + (b - a) + "} = " + slope) + ". " + M("3c^2 = " + slope) + ", " + M("c = \\sqrt{\\frac{" + slope + "}{3}} \\approx " + D(+c.toFixed(2))) + " (la valeur positive, dans l'intervalle).",
{ ctx: "lagrange-cube", guide: [G("Pente de la corde " + M("\\frac{f(" + b + ") - f(" + a + ")}{" + b + " - " + a + "}") + " ?", slope, M(slope) + "."), G(M("c^2") + " (avec " + M("3c^2 = " + slope) + ") ?", slope / 3, M(fT(slope / 3)) + "."), GS(M("c") + " (au centième) ?", c, M("\\approx " + D(+c.toFixed(2))) + ".", 0.01)],
traps: [TR((a + b) / 2, "Pour x³, c n'est pas le milieu : résous 3c² = pente de la corde."), TR(slope / 3, "C'est c² : prends la racine."), TR(Math.sqrt(slope), "f'(c) = 3c² : divise par 3 avant la racine.")] }); },
() => { const k = pk([1, 2, -1, 3, 0.5]), x0 = nz(-3, 3), a = 2 * k * x0, b = k * x0 * x0 - a * x0;
return QP("Soit " + M(cases((k === 1 ? "" : fT(k)) + "x^2", "x \\leq " + x0, "ax + b", "x > " + x0)) + ". Trouve " + M("a") + " et " + M("b") + " pour que " + M("f") + " soit dérivable en " + M(x0) + ". Réponds « a ; b ».", [a, b],
"Dérivable en " + M(x0) + " : continue (mêmes valeurs) et mêmes pentes. Pente : " + M("a = 2 \\cdot " + par(k) + " \\cdot " + par(x0) + " = " + fT(a)) + ". Valeur : " + M(fT(a) + " \\cdot " + par(x0) + " + b = " + fT(k * x0 * x0)) + ", donc " + M("b = " + fT(b)) + " : la droite est la tangente à la parabole.",
{ ctx: "raccord-derivable", guide: [G("Pente de " + M((k === 1 ? "" : fT(k)) + "x^2") + " en " + M(x0) + " (" + M("a") + ") ?", a, M(fT(a)) + "."), G("Valeur " + M("f(" + x0 + ")") + " ?", k * x0 * x0, M(fT(k * x0 * x0)) + "."), GP("Réponse « a ; b » ?", [a, b], M("(" + fT(a) + " \\,;\\, " + fT(b) + ")") + ".")],
traps: [TP([a, k * x0 * x0], "b n'est pas f(" + T(x0) + ") : a·" + T(x0) + " + b doit valoir f(" + T(x0) + ")."), TP([k * x0, b], "La pente de kx² en x₀ est 2k·x₀."), TP([b, a], "Réponds a d'abord, puis b.")] }); },
() => { const inv = R.rand() < 0.5;
if (inv) { const [a, b] = pk([[1, 4], [2, 8], [4, 9], [3, 12], [1, 9], [4, 16], [2, 18]]), c = Math.sqrt(a * b);
return QN("Soit " + M("f(x) = \\frac{1}{x}") + " sur " + M("[" + a + " \\,;\\, " + b + "]") + ". Trouve le nombre " + M("c") + " de l'intervalle où la tangente est parallèle à la corde (théorème des accroissements finis).", c,
"Pente de la corde : " + M("\\frac{\\frac{1}{" + b + "} - \\frac{1}{" + a + "}}{" + b + " - " + a + "} = -\\frac{1}{" + a * b + "}") + ". " + M("f'(c) = -\\frac{1}{c^2} = -\\frac{1}{" + a * b + "}") + " : " + M("c = \\sqrt{" + a * b + "} = " + c) + ".",
{ ctx: "lagrange-inverse", guide: [G("Pente de la corde ?", -1 / (a * b), M("-\\frac{1}{" + a * b + "}") + "."), G(M("c") + " ?", c, M(c) + ".")],
traps: [TR((a + b) / 2, "Pour 1/x, c n'est pas le milieu : résous −1/c² = pente de la corde."), TR(a * b, "C'est c² : prends la racine."), TR(-c, "c doit être dans l'intervalle [" + T(a) + " ; " + T(b) + "].")] }); }
const a = ri(1, 4), b = a + ri(1, 4), c = ((a + b) / 2) ** 2;
return QN("Soit " + M("f(x) = \\sqrt{x}") + " sur " + M("[" + a * a + " \\,;\\, " + b * b + "]") + ". Trouve le nombre " + M("c") + " où la tangente est parallèle à la corde (théorème des accroissements finis ; fraction acceptée).", c,
"Pente de la corde : " + M("\\frac{" + b + " - " + a + "}{" + b * b + " - " + a * a + "} = \\frac{1}{" + (a + b) + "}") + ". " + M("f'(c) = \\frac{1}{2\\sqrt{c}} = \\frac{1}{" + (a + b) + "}") + " : " + M("\\sqrt{c} = " + fT((a + b) / 2)) + ", " + M("c = " + fT(c)) + ".",
{ ctx: "lagrange-racine", guide: [G("Pente de la corde ?", 1 / (a + b), M("\\frac{1}{" + (a + b) + "}") + "."), G(M("\\sqrt{c}") + " ?", (a + b) / 2, M(fT((a + b) / 2)) + "."), G(M("c") + " ?", c, M(fT(c)) + ".")],
traps: [TR((a * a + b * b) / 2, "Pour √x, c n'est pas le milieu de l'intervalle : résous f'(c) = pente de la corde."), TR((a + b) / 2, "C'est √c : élève au carré."), TR(a + b, "f'(c) = 1 ÷ (2√c).")] }); },
],
3: [
() => { const k = ri(2, 6), c = k / Math.sqrt(3);
return QSet("Soit " + M("f(x) = x^3 - " + k * k + "x") + " sur " + M("[-" + k + " \\,;\\, " + k + "]") + ". On a " + M("f(-" + k + ") = f(" + k + ") = 0") + ". Donne toutes les valeurs " + M("c") + " de " + M("]-" + k + " \\,;\\, " + k + "[") + " telles que " + M("f'(c) = 0") + " (valeurs exactes).", [-c, c],
M("f'(x) = 3x^2 - " + k * k) + " s'annule en " + M("x = \\pm\\frac{" + k + "}{\\sqrt{3}} \\approx \\pm " + D(+c.toFixed(2))) + " : Rolle garantit au moins une valeur, ici il y en a deux.",
{ ctx: "rolle-cubique", guide: [G(M("c^2") + " (avec " + M("3c^2 = " + k * k) + ") ?", k * k / 3, M(fT(k * k / 3)) + "."), GSet("Valeurs de " + M("c") + " ?", [-c, c], M("\\pm\\frac{" + k + "}{\\sqrt{3}}") + ".")],
traps: [TSt([c], "Rolle garantit au moins une valeur ; ici, il y en a deux (symétriques)."), TSt([-k, k], "Ce sont les bornes, où f s'annule ; on cherche les zéros de f'."), TSt([0], "f'(0) = −" + T(k * k) + " ≠ 0.")] }); },
() => { const radar = R.rand() < 0.5;
if (radar) { const d = pk([12, 15, 18, 20, 24]), tmin = pk([8, 9, 10, 12]), v = (d * 60) / tmin, lim = pk([80, 100]); if (v <= lim) return null;
return QN("Sur l'autoroute, deux bornes de contrôle sont distantes de " + M(d + "\\text{ km}") + ". Une voiture les franchit à " + M(tmin + "\\text{ min}") + " d'intervalle. D'après le théorème des accroissements finis, à au moins un instant, son compteur indiquait exactement une vitesse : laquelle (en km/h) ?", v,
"La position est dérivable ; entre les deux bornes, il existe un instant où la vitesse instantanée égale la vitesse moyenne : " + M("\\frac{" + d + "}{" + tmin + "} \\cdot 60 = " + D(v) + "\\text{ km/h}") + (v > lim ? ", au-dessus de la limite de " + lim + " km/h : excès de vitesse prouvé." : "."),
{ ctx: "radar-taf", guide: [G("Vitesse moyenne en km par minute ?", d / tmin, M(fT(d / tmin)) + "."), G("En km/h ?", v, M(D(v)) + ".")],
traps: [TR(d / tmin, "Convertis en km/h : × 60."), TR(lim, "La limite n'est pas la vitesse prouvée : c'est la vitesse moyenne."), TR((d * tmin) / 60, "Vitesse = distance ÷ temps.")] }); }
const a = ri(-2, 2), b = a + ri(2, 5), y0 = ri(-5, 5), Mx = pk([2, 3, 0.5, 1.5, 4]), v = y0 + Mx * (b - a);
return QN("La fonction " + M("f") + " est dérivable, " + M("f(" + a + ") = " + y0) + " et " + M("f'(x) \\leq " + D(Mx)) + " pour tout " + M("x") + ". Quelle est la plus grande valeur possible de " + M("f(" + b + ")") + " ?", v,
"Accroissements finis : " + M("f(" + b + ") - f(" + a + ") = f'(c)(" + b + " - " + par(a) + ") \\leq " + D(Mx) + " \\cdot " + (b - a)) + ", donc " + M("f(" + b + ") \\leq " + y0 + " + " + D(Mx * (b - a)) + " = " + D(v)) + " (atteint par une droite de pente " + T(Mx) + ").",
{ ctx: "majoration", guide: [G("Longueur " + M(b + " - " + par(a)) + " ?", b - a, M(b - a) + "."), G("Accroissement maximal de " + M("f") + " ?", Mx * (b - a), M(D(Mx * (b - a))) + "."), G(M("f(" + b + ")") + " au plus ?", v, M(D(v)) + ".")],
traps: [TR(Mx * (b - a), "Ajoute la valeur de départ f(" + T(a) + ") = " + T(y0) + "."), TR(y0 + Mx, "La pente est au plus " + T(Mx) + " sur toute la longueur " + T(b - a) + "."), TR(y0 + Mx * b, "La longueur de l'intervalle est " + T(b) + " − (" + T(a) + ").")] }); },
() => { const k = pk([0.5, 1, 1.5, 2, 3]), s = 2 * k, v = Math.round((1800 - (2 * Math.atan(s) * 1800) / Math.PI)) / 10, a1 = Math.round((Math.atan(s) * 1800) / Math.PI) / 10;
return mk("La fonction " + M("f(x) = |x^2 - " + D(k * k) + "|") + " a un point anguleux en " + M("x = " + D(k)) + ". Quel angle (en degrés, " + "au dixième) forment ses deux demi-tangentes en ce point ?", { kind: "value", value: v, round: 0.1 },
"Pentes des demi-tangentes : " + M("\\pm 2 \\cdot " + D(k) + " = \\pm " + D(s)) + ". Chacune fait l'angle " + M("\\arctan(" + D(s) + ") \\approx " + D(a1) + "^\\circ") + " avec l'horizontale ; l'angle entre elles vaut " + M("180^\\circ - 2\\arctan(" + D(s) + ") \\approx " + D(v) + "^\\circ") + ".",
{ ctx: "angle-demi-tangentes", guide: [G("Pente de la demi-tangente à droite ?", s, M(D(s)) + "."), GS("Angle (en degrés, au dixième) entre cette demi-tangente et l'horizontale ?", a1, M("\\approx " + D(a1) + "^\\circ") + ".", 0.1), GS("Angle entre les deux demi-tangentes ?", v, M("\\approx " + D(v) + "^\\circ") + ".", 0.1)],
traps: [TR(a1, "C'est l'angle d'une seule demi-tangente avec l'horizontale."), TR(Math.round(20 * a1) / 10, "Les deux demi-tangentes montent de part et d'autre : l'angle entre elles vaut 180° − 2·arctan(pente)."), TR(Math.round(900 - 10 * a1) / 10, "L'angle entre les deux demi-tangentes vaut 180° − 2 × " + T(a1) + "°.")] }); },
],
};

const PROBS = {
limites: [() => { let a, r, m; do { a = nz(-4, 4); r = nz(-5, 5); m = pk([2, 3, -2]); } while (r === a || r === -a);
const num = [m, -m * (a + r), m * a * r], v1 = (m * (a - r)) / (2 * a);
return P("Soit " + M("f(x) = \\frac{" + P2(num) + "}{" + P2([1, 0, -a * a]) + "}") + ".",
[["a) " + M(lim(a) + " f(x)") + " (fraction acceptée)", v1], ["b) " + M(lim("+\\infty") + " f(x)"), m], ["c) Abscisse de la seule asymptote verticale", -a]],
["Numérateur et dénominateur s'annulent tous deux en x = " + T(a) + " : factorise-les.", "Après simplification par (" + xmT(a) + "), f(x) = " + T(m) + "(" + xmT(r) + ") ÷ (" + xmT(-a) + ")."],
"a) " + M("f(x) = \\frac{" + m + "(" + xm(a) + ")(" + xm(r) + ")}{(" + xm(a) + ")(" + xm(-a) + ")} = \\frac{" + m + "(" + xm(r) + ")}{" + xm(-a) + "}") + " pour " + M("x \\neq " + a) + " ; limite " + M("\\frac{" + m * (a - r) + "}{" + 2 * a + "} = " + fT(v1)) + ". b) Termes dominants : " + M("\\frac{" + m + "x^2}{x^2} = " + m) + ". c) En " + M(a) + ", on simplifie (un « trou ») ; en " + M(-a) + ", seul le dénominateur s'annule : " + M("x = " + -a) + ".");
}],
limitinf: [() => { const a = pk([12, 20, 30, 8, 40]), b = ri(2, 6);
return P("Pendant une perfusion, la concentration d'un médicament dans le sang vaut " + M("C(t) = \\frac{" + a + "t}{t + " + b + "}") + " mg/L, " + M("t") + " en heures.",
[["a) " + M("C(" + b + ")") + " (mg/L)", a / 2], ["b) " + M("\\lim_{t \\to +\\infty} C(t)") + " (mg/L)", a], ["c) Après combien d'heures la concentration atteint-elle 90 % de cette limite ?", 9 * b]],
["En t = " + b + ", le numérateur vaut " + T(a * b) + " et le dénominateur " + 2 * b + ". À l'infini, t + " + b + " ≈ t.", "c) Résous " + a + "t ÷ (t + " + b + ") = " + T(r6(0.9 * a)) + " : multiplie les deux membres par (t + " + b + ")."],
"a) " + M("\\frac{" + a * b + "}{" + 2 * b + "} = " + fT(a / 2)) + " mg/L. b) " + M("\\frac{" + a + "t}{t} = " + a) + " mg/L. c) " + M(a + "t = " + D(r6(0.9 * a)) + "(t + " + b + ") \\iff " + D(r6(0.1 * a)) + "t = " + D(r6(0.9 * a * b)) + " \\iff t = " + 9 * b) + " h.");
}],
asymptotes: [() => { let a, b, c, d, p, rem; do { a = pk([1, 2, -1]); d = nz(-4, 4); b = ri(-5, 5); c = nz(-6, 6); p = b + a * d; rem = a * d * d + b * d + c; } while (!rem || !p);
return P("Soit " + M("f(x) = \\frac{" + P2([a, b, c]) + "}{" + xm(d) + "}") + ".",
[["a) Abscisse de l'asymptote verticale", d], ["b) Asymptote oblique " + M("y = mx + p") + " : réponds « m ; p »", { kind: "pair", values: [a, p] }], ["c) " + M("f(0)") + " (fraction acceptée)", -c / d]],
["Le dénominateur s'annule en x = " + T(d) + " (pas le numérateur).", "Divise " + pT([a, b, c]) + " par (" + xmT(d) + ") : le quotient est la droite asymptote."],
"a) " + M("x = " + d) + ". b) " + M(P2([a, b, c]) + " = (" + xm(d) + ")(" + P2([a, p]) + ")" + sg(rem)) + " : " + M("y = " + P2([a, p])) + ". c) " + M("f(0) = \\frac{" + c + "}{" + -d + "} = " + fT(-c / d)) + ".");
}],
continuite: [() => { const [a, b] = pk([[3, 2], [4, 2.5], [3.5, 2], [4, 3], [2.5, 1.5]]), h = pk([2, 3, 4]), k = r6((a - b) * h), x2 = h + ri(2, 5); let x3; do x3 = h + ri(1, 6); while (x3 === x2);
const P2v = r6(b * x2 + k), S = r6(b * x3 + k);
return P("Un parking facture " + M("P(x) = " + D(a) + "x") + " CHF pour une durée " + M("x \\le " + h) + " heures, puis " + M("P(x) = " + D(b) + "x + k") + " CHF au-delà.",
[["a) Valeur de k pour que le prix ne fasse pas de saut (CHF)", k], ["b) Prix pour " + x2 + " heures (CHF)", P2v], ["c) Durée de stationnement (h) pour un prix de " + M(D(S)) + " CHF", x3]],
["Les deux formules donnent le même prix en x = " + h + ".", "c) Le prix dépasse " + T(r6(a * h)) + " CHF : utilise la 2e formule et résous " + T(b) + "x + k = " + T(S) + "."],
"a) " + M(D(a) + " \\cdot " + h + " = " + D(b) + " \\cdot " + h + " + k \\iff k = " + D(k)) + ". b) " + M(D(b) + " \\cdot " + x2 + " + " + D(k) + " = " + D(P2v)) + " CHF. c) " + M(D(b) + "x + " + D(k) + " = " + D(S) + " \\iff x = " + x3) + " h.");
}],
etudefct: [() => { const k = ri(1, 3), d = nz(-6, 6), cs = [1, 0, -3 * k * k, d], hi = 2 * k ** 3 + d, lo = d - 2 * k ** 3;
return P("Soit " + M("f(x) = " + P2(cs)) + ".",
[["a) Abscisse du maximum local", -k], ["b) Valeur du maximum local", hi], ["c) Valeurs de " + M("m") + " pour lesquelles " + M("f(x) = m") + " a trois solutions (intervalle)", { kind: "solset", ivs: [[lo, false, hi, false]] }]],
["f'(x) = 3x² − " + 3 * k * k + " = 3(x − " + k + ")(x + " + k + ").", "c) Trace la droite horizontale y = m : elle coupe la courbe trois fois entre le minimum local et le maximum local."],
"a) " + M("f'") + " passe de + à − en " + M(-k) + ". b) " + M("f(" + -k + ") = " + hi) + ". c) Minimum local " + M("f(" + k + ") = " + lo) + " : " + M(SolSet.show([[lo, false, hi, false]])) + ".");
}],
derivseconde: [() => { const p = nz(-3, 3), c = ri(-6, 6), d = ri(-6, 6), cs = [1, -3 * p, c, d], fp = pv(cs, p), m = c - 3 * p * p, n = p ** 3 + d;
return P("Soit " + M("f(x) = " + P2(cs)) + ".",
[["a) Abscisse du point d'inflexion", p], ["b) Ordonnée du point d'inflexion", fp], ["c) Ordonnée à l'origine de la tangente au point d'inflexion", n]],
["f''(x) = 6x " + (p > 0 ? "− " + 6 * p : "+ " + -6 * p) + ".", "c) Tangente : y = f'(p)(x − p) + f(p) ; prends x = 0."],
"a) " + M("f''(x) = " + P2([6, -6 * p]) + " = 0 \\iff x = " + p) + ". b) " + M("f(" + p + ") = " + fp) + ". c) " + M("f'(" + p + ") = " + m) + ", " + M("y = " + m + "(" + xm(p) + ")" + sg(fp)) + " ; en " + M("x = 0") + " : " + M(n) + ".");
}],
combi: [() => { const g = ri(5, 9), b = ri(5, 9), n = g + b, v1 = Cb(n, 4), v2 = Cb(g, 2) * Cb(b, 2), v3 = Cb(n, 4) - Cb(b, 4);
return P("Une classe compte " + g + " filles et " + b + " garçons. On forme un comité de 4 élèves (sans rôle particulier).",
[["a) Nombre de comités possibles", v1], ["b) Nombre de comités avec exactement 2 filles", v2], ["c) Nombre de comités avec au moins une fille", v3]],
["L'ordre ne compte pas : combinaisons.", "c) Passe par le contraire : les comités sans fille."],
"a) " + M(bn(n, 4) + " = " + D(v1)) + ". b) " + M(bn(g, 2) + " \\cdot " + bn(b, 2) + " = " + Cb(g, 2) + " \\cdot " + Cb(b, 2) + " = " + D(v2)) + ". c) " + M(D(v1) + " - " + bn(b, 4) + " = " + D(v1) + " - " + D(Cb(b, 4)) + " = " + D(v3)) + ".");
}],

probaxiomes: [() => { const s = pk([4, 5, 6, 7, 8, 9, 10]), [cx, bT, inB] = pk([["double", "on obtient un double", (r, b) => r === b], ["six", "on obtient au moins un 6", (r, b) => r === 6 || b === 6], ["pair", "le dé rouge donne un nombre pair", (r) => r % 2 === 0]]);
let nA = 0, nB = 0, nAB = 0; for (let r = 1; r <= 6; r++) for (let b = 1; b <= 6; b++) { const a = r + b === s, bb = inB(r, b); nA += a; nB += bb; nAB += a && bb; }
const u = nA + nB - nAB;
return Object.assign(P("On lance deux dés équilibrés (un rouge et un bleu). A : « la somme vaut " + s + " » ; B : « " + bT + " ».",
[["a) P(A) (fraction acceptée)", nA / 36], ["b) P(B)", nB / 36], ["c) P(A ∪ B)", u / 36]],
["Compte les couples (rouge ; bleu) parmi les 36.", "c) P(A ∪ B) = P(A) + P(B) − P(A ∩ B) : compte les couples qui sont à la fois dans A et dans B (ici " + nAB + ")."],
"a) " + M("\\frac{" + nA + "}{36}" + (den(nA / 36) < 36 ? " = " + fT(nA / 36) : "")) + ". b) " + M("\\frac{" + nB + "}{36}" + (den(nB / 36) < 36 ? " = " + fT(nB / 36) : "")) + ". c) " + M("\\frac{" + nA + "}{36} + \\frac{" + nB + "}{36} - \\frac{" + nAB + "}{36} = \\frac{" + u + "}{36}" + (den(u / 36) < 36 ? " = " + fT(u / 36) : "")) + "."), { ctx: cx });
}],
probarbre: [() => { const r = ri(3, 6), b = ri(2, 5), n = r + b, it = pk(ITEMS), dd = n * (n - 1), p1 = (r * (r - 1)) / dd, p2 = (2 * r * b) / dd;
return P("Une urne contient " + r + " " + it[0] + " " + it[1] + " et " + b + " " + it[0] + " " + it[2] + ". On en tire deux, l'une après l'autre, sans remise.",
[["a) Probabilité de tirer deux " + it[0] + " " + it[1] + " (fraction acceptée)", p1], ["b) Probabilité de tirer deux couleurs différentes", p2], ["c) Probabilité qu'au moins une des deux soit " + it[4], 1 - p1]],
["Dessine l'arbre : au 2e tirage, il reste " + (n - 1) + " " + it[0] + ".", "c) Le contraire de « au moins une " + it[4] + " » est « deux " + it[1] + " »."],
"a) " + M("\\frac{" + r + "}{" + n + "} \\cdot \\frac{" + (r - 1) + "}{" + (n - 1) + "} = " + fT(p1)) + ". b) " + M("2 \\cdot \\frac{" + r + "}{" + n + "} \\cdot \\frac{" + b + "}{" + (n - 1) + "} = " + fT(p2)) + ". c) " + M("1 - " + fT(p1) + " = " + fT(1 - p1)) + ".");
}],

derivth: [() => { const cx = pk(["abs-trinome", "abs-somme", "taf"]), xm = (v) => (v < 0 ? "x + " + -v : "x - " + v);
if (cx === "abs-trinome") { let p, q; do { p = ri(-4, 3); q = ri(-2, 6); } while (q - p < 2 || p === 0 || q === 0 || (p + q) % 2 !== 0);
return Object.assign(P("Soit " + M("f(x) = |(" + xm(p) + ")(" + xm(q) + ")|") + " sur " + M("\\mathbb{R}") + ".", [["a) Plus grande abscisse où f n'est pas dérivable", q], ["b) Pente de la demi-tangente à gauche en ce point", -(q - p)], ["c) Nombre c de Rolle sur [" + p + " ; " + q + "] (f'(c) = 0)", (p + q) / 2]],
["Les points anguleux sont aux zéros de (" + xm(p) + ")(" + xm(q) + ").", "Sur [" + p + " ; " + q + "], le produit est négatif : f(x) = −(" + xm(p) + ")(" + xm(q) + ")."],
"a) zéros " + M(p) + " et " + M(q) + " : f n'est pas dérivable en " + M(q) + " ; b) sur [" + p + " ; " + q + "], " + M("f'(x) = -2x" + (p + q ? (p + q < 0 ? " - " + -(p + q) : " + " + (p + q)) : "")) + ", pente en " + M(q) + " : " + M(-(q - p)) + " (à droite : " + M(q - p) + ") ; c) " + M("f(" + p + ") = f(" + q + ") = 0") + " et " + M("-2c" + (p + q ? (p + q < 0 ? " - " + -(p + q) : " + " + (p + q)) : "") + " = 0")  + " : " + M("c = " + (p + q) / 2) + "."), { ctx: cx }); }
if (cx === "abs-somme") { let p, q; do { p = ri(-5, 2); q = ri(-1, 6); } while (q - p < 2 || p === 0 || q === 0);
return Object.assign(P("Soit " + M("f(x) = |" + xm(p) + "| + |" + xm(q) + "|") + " sur " + M("\\mathbb{R}") + ".", [["a) Plus grande abscisse où f n'est pas dérivable", q], ["b) Pente de la demi-tangente à droite en ce point", 2], ["c) Valeur minimale de f", q - p]],
["Chaque valeur absolue crée un point anguleux là où elle s'annule.", "Entre " + p + " et " + q + ", f(x) = (x − " + (p < 0 ? "(" + p + ")" : p) + ") + (" + q + " − x) est constante."],
"a) " + M(q) + " ; b) à droite de " + M(q) + ", " + M("f(x) = 2x " + (p + q < 0 ? "+ " + -(p + q) : "- " + (p + q))) + " : pente " + M(2) + " (à gauche : 0) ; c) entre " + M(p) + " et " + M(q) + ", " + M("f(x) = " + (q - p)) + " : minimum " + M(q - p) + "."), { ctx: cx }); }
const b = ri(2, 6), c = b / Math.sqrt(3);
return Object.assign(P("Soit " + M("f(x) = x^3") + " sur " + M("[0 \\,;\\, " + b + "]") + ". On applique le théorème des accroissements finis.", [["a) Taux d'accroissement de f entre 0 et " + b, b * b], ["b) Nombre c de ]0 ; " + b + "[ tel que f'(c) = ce taux (au centième)", (Math.round(c * 100) / 100), 0.01], ["c) f'(" + b + ")", 3 * b * b]],
["Taux : (f(" + b + ") − f(0)) ÷ " + b + ".", "f'(x) = 3x² : résous 3c² = " + b * b + "."],
"a) " + M("\\frac{" + b ** 3 + " - 0}{" + b + "} = " + b * b) + " ; b) " + M("3c^2 = " + b * b + " \\iff c = \\frac{" + b + "}{\\sqrt{3}} \\approx " + D((Math.round(c * 100) / 100))) + " ; c) " + M("3 \\cdot " + b + "^2 = " + 3 * b * b) + "."), { ctx: cx }); }],
};


const NEW = [
{ id: "limites", theme: "fa", label: "Limites : lecture, calcul, forme 0/0", ex: "\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3} = 6", CH: [14], codesMATU: "3\\.AN\\.01[ab]", lv: LI,
hint: "Si on peut remplacer x par a (dénominateur non nul), la limite est la valeur obtenue. Forme 0/0 : factorise par (x − a), simplifie, puis remplace.",
lesson: ["Limites", "Vers quelle valeur f(x) se dirige-t-elle quand x s'approche de a ?", "\\(\\lim_{x \\to a} f(x) = L\\) : \\(f(x)\\) devient aussi proche de \\(L\\) qu'on veut quand \\(x\\) s'approche de \\(a\\), sans forcément l'atteindre. Pour un polynôme, ou une fraction dont le dénominateur ne s'annule pas en \\(a\\), on remplace \\(x\\) par \\(a\\). Forme \\(\\frac{0}{0}\\) : on factorise par \\((x - a)\\) et on simplifie (avec une racine : quantité conjuguée), puis on remplace. Sur un graphique, on lit la limite à gauche (\\(x < a\\)) et la limite à droite (\\(x > a\\)).",
["\\(\\lim_{x \\to 2} (x^2 + 3x) = 4 + 6 = 10\\)", "\\(\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3} = \\lim_{x \\to 3} (x + 3) = 6\\)", "\\(\\lim_{x \\to 4} \\frac{\\sqrt{x} - 2}{x - 4} = \\lim_{x \\to 4} \\frac{1}{\\sqrt{x} + 2} = \\frac{1}{4}\\)"], "\\(\\frac{0}{0}\\) n'est pas un résultat (ni 0, ni 1) : c'est le signal qu'il faut simplifier."],
comps: ["Lire une limite sur un graphique ; calculer une limite par remplacement", "Lever une forme 0/0 en factorisant", "Quantité conjuguée, fractions étagées ; paramètre pour une limite finie"] },
{ id: "limitinf", theme: "fa", label: "Limites à l'infini", ex: "\\lim_{x \\to +\\infty} \\frac{6x^2 + 1}{2x^2 - 5} = 3", CH: [14], codesMATU: "3\\.AN\\.01c", lv: LF,
hint: "À l'infini, seuls les termes de plus haut degré comptent. Forme ∞ − ∞ : réduis au même dénominateur ou multiplie par la quantité conjuguée.",
lesson: ["Limites à l'infini", "Que devient f(x) quand x devient très grand, ou très négatif ?", "Pour un polynôme ou une fraction rationnelle, seuls les termes de plus haut degré comptent à l'infini. Mêmes degrés en haut et en bas : la limite est le quotient des coefficients dominants ; degré du haut plus petit : la limite est 0. Forme « \\(\\infty - \\infty\\) » : réduire au même dénominateur, ou multiplier par la quantité conjuguée. Pour \\(x < 0\\), \\(\\sqrt{x^2} = |x| = -x\\).",
["\\(\\lim_{x \\to +\\infty} \\frac{6x^2 + x}{2x^2 - 5} = \\frac{6}{2} = 3\\)", "\\(\\lim_{x \\to +\\infty} \\frac{4}{x + 1} = 0\\)", "\\(\\sqrt{x^2 + 6x} - x = \\frac{6x}{\\sqrt{x^2 + 6x} + x}\\), qui tend vers \\(\\frac{6x}{2x} = 3\\)"], "On ne remplace pas \\(x\\) par « l'infini » terme à terme : \\(\\infty - \\infty\\) et \\(\\frac{\\infty}{\\infty}\\) ne sont pas des résultats."],
comps: ["Limite à l'infini d'une fraction rationnelle ; lecture dans un tableau ; modèle concret", "Termes dominants (carré, produit) ; forme ∞ − ∞", "Quantité conjuguée ; √(x²) = |x| ; paramètre"] },
{ id: "asymptotes", theme: "fa", label: "Asymptotes", ex: "f(x) = \\frac{2x + 1}{x - 3} : x = 3, \\ y = 2", CH: [14], codesMATU: "3\\.AN\\.01[de]", lv: AS,
hint: "Verticale x = a : le dénominateur s'annule en a (pas le numérateur). Horizontale y = b : b est la limite à l'infini. Oblique : divise le numérateur par le dénominateur.",
lesson: ["Asymptotes", "Des droites dont la courbe s'approche sans fin.", "Asymptote verticale \\(x = a\\) : \\(f(x)\\) part vers \\(\\pm\\infty\\) quand \\(x\\) s'approche de \\(a\\) (le dénominateur s'annule en \\(a\\), pas le numérateur). Asymptote horizontale \\(y = b\\) : \\(\\lim_{x \\to \\pm\\infty} f(x) = b\\). Asymptote oblique \\(y = mx + p\\) (degré du haut = degré du bas + 1) : on divise, \\(f(x) = mx + p + \\frac{r}{x - d}\\), et la fraction tend vers 0.",
["\\(f(x) = \\frac{2x + 1}{x - 3}\\) : verticale \\(x = 3\\), horizontale \\(y = 2\\).", "\\(f(x) = \\frac{x^2 + 1}{x - 1} = x + 1 + \\frac{2}{x - 1}\\) : oblique \\(y = x + 1\\)."], "Si numérateur et dénominateur s'annulent tous deux en \\(a\\), on simplifie d'abord : souvent un « trou », pas une asymptote."],
comps: ["Trouver une asymptote verticale ou horizontale ; lecture graphique", "Plusieurs asymptotes ; trou ou asymptote ; point d'intersection", "Asymptote oblique ; courbe qui coupe son asymptote ; paramètre"] },
{ id: "continuite", theme: "fa", label: "Continuité", ex: "\\lim_{x \\to a} f(x) = f(a)", CH: [14], codesMATU: "3\\.AN\\.02[ab]", lv: CO,
hint: "f est continue en a si la limite en a existe et vaut f(a). Pour une fonction par morceaux, égale les valeurs des deux formules au point de raccord.",
lesson: ["Continuité", "Peut-on tracer la courbe sans lever le crayon ?", "\\(f\\) est continue en \\(a\\) si \\(\\lim_{x \\to a} f(x) = f(a)\\) : la limite à gauche, la limite à droite et \\(f(a)\\) sont égales. Polynômes, fractions rationnelles (là où elles sont définies) et racines sont continus. Fonction par morceaux : chaque morceau est continu ; on vérifie le raccord en égalant les valeurs des deux formules au point de jonction.",
["\\(f(x) = 2x + 1\\) si \\(x < 1\\), \\(x^2 + k\\) si \\(x \\ge 1\\) : \\(3 = 1 + k\\), donc \\(k = 2\\).", "\\(f(x) = \\frac{x^2 - 4}{x - 2}\\) et \\(f(2) = 4\\) : continue, car \\(\\lim_{x \\to 2} (x + 2) = 4\\)."], "Au raccord, on utilise les deux formules au même point, même si l'une est écrite avec « < » et l'autre avec « ≥ »."],
comps: ["Raccorder deux morceaux affines ; repérer un saut sur un graphique ; prolonger par continuité", "Raccord parabole-droite ; paramètre des deux côtés ; tarif sans saut", "Trois morceaux (deux paramètres) ; prolongement avec une racine ; paramètre au carré"] },
{ id: "derivseconde", niv: "R", theme: "fa", label: "Dérivée seconde, points d'inflexion", ex: "f''(x) = 0 \\text{ et change de signe}", CH: [14], codesMATU: "3\\.AN\\.08[ab]", lv: DS,
hint: "f'' > 0 : f convexe (tournée vers le haut) ; f'' < 0 : concave. Point d'inflexion : f'' s'annule en changeant de signe.",
lesson: ["Dérivée seconde, concavité", "Dans quel sens la courbe tourne-t-elle ?", "\\(f''\\) est la dérivée de \\(f'\\). Si \\(f'' > 0\\) sur un intervalle, \\(f\\) est convexe (courbe tournée vers le haut) ; si \\(f'' < 0\\), concave (tournée vers le bas). Un point d'inflexion est un point où la courbe change de concavité : \\(f''\\) s'y annule en changeant de signe. Pour \\(ax^3 + bx^2 + cx + d\\), il est en \\(x = -\\frac{b}{3a}\\).",
["\\(f(x) = x^3 - 6x^2\\) : \\(f''(x) = 6x - 12\\), inflexion en \\(x = 2\\) ; concave sur \\(]-\\infty \\,;\\, 2]\\), convexe sur \\([2 \\,;\\, +\\infty[\\)."], "\\(f''(a) = 0\\) ne suffit pas : il faut un changement de signe (\\(x^4\\) en 0 n'a pas de point d'inflexion)."],
comps: ["Trouver un point d'inflexion (degré 3, lecture de f'') ; calculer f''", "Intervalles de concavité ; inflexions d'un polynôme de degré 4", "Paramètre ; tangente d'inflexion ; inflexions d'une fonction rationnelle"] },
{ id: "etudefct", theme: "fa", label: "Étude complète d'une fonction", ex: "D_f, \\text{ zéros}, f', \\text{ extremums}", CH: [14], codesMATU: "3\\.AN\\.07[cd]", lv: EF,
hint: "Ensemble de définition, zéros, limites et asymptotes, signe de f' et extremums (là où f' change de signe), puis f'' pour la concavité.",
lesson: ["Étude complète d'une fonction", "Tout savoir d'une fonction avant d'en tracer la courbe.", "1. Ensemble de définition (valeurs interdites). 2. Zéros et signe. 3. Limites aux bornes, asymptotes. 4. Dérivée, son signe, tableau de variations, extremums (là où \\(f'\\) change de signe). 5. Éventuellement \\(f''\\) : concavité, inflexions. 6. Tableau récapitulatif, puis la courbe.",
["\\(f(x) = x^3 - 3x\\) : zéros \\(0\\) et \\(\\pm\\sqrt{3}\\) ; \\(f'(x) = 3(x - 1)(x + 1)\\) ; maximum local \\(f(-1) = 2\\), minimum local \\(f(1) = -2\\).", "\\(f(x) = x + \\frac{4}{x}\\) pour \\(x > 0\\) : \\(f'(x) = 1 - \\frac{4}{x^2}\\), minimum \\(f(2) = 4\\)."], "Un zéro de \\(f'\\) n'est un extremum que si \\(f'\\) y change de signe (\\(3x^4 - 8x^3\\) en 0 : palier, pas d'extremum)."],
comps: ["Zéros, valeurs interdites, extremum d'un polynôme de degré 3", "Extremums d'une fonction rationnelle ; zéros d'une bicarrée", "Extremums sur deux branches ; nombre de solutions de f(x) = m ; palier"] },
{ id: "combi", theme: "no", label: "Dénombrement : permutations, combinaisons", ex: "\\binom{n}{k} = \\frac{n!}{k!\\,(n - k)!}", CH: [14], codesMATU: "3\\.PS\\.01[a-e]", lv: KO,
hint: "Principe multiplicatif. L'ordre compte : n(n − 1)… ; il ne compte pas : divise par k!. Répétitions permises : nᵏ.",
lesson: ["Dénombrement", "Compter sans tout écrire.", "Principe multiplicatif : des choix successifs de \\(n_1, n_2, \\ldots\\) possibilités donnent \\(n_1 \\cdot n_2 \\cdot \\ldots\\) issues. Permutations de \\(n\\) objets : \\(n! = n(n - 1) \\ldots 2 \\cdot 1\\). Arrangements (\\(k\\) objets parmi \\(n\\), l'ordre compte) : \\(n(n - 1) \\ldots (n - k + 1)\\). Combinaisons (l'ordre ne compte pas) : \\(\\binom{n}{k} = \\frac{n(n - 1) \\ldots (n - k + 1)}{k!}\\). Avec répétitions : \\(n^k\\).",
["Podium avec 8 coureurs : \\(8 \\cdot 7 \\cdot 6 = 336\\)", "3 délégués parmi 20 : \\(\\binom{20}{3} = \\frac{20 \\cdot 19 \\cdot 18}{6} = 1\\text{'}140\\)", "Mots avec ANANAS : \\(\\frac{6!}{3! \\cdot 2!} = 60\\)"], "Demande-toi toujours si l'ordre compte (podium : oui ; comité : non) et si les répétitions sont permises."],
comps: ["Principe multiplicatif, permutations, arrangements", "Combinaisons ; répétitions (nᵏ) ; anagrammes", "Comités avec contraintes ; « au moins un » ; problèmes inverses"] },
{ id: "probaxiomes", theme: "no", label: "Probabilités : contraire, réunion", ex: "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)", CH: [14], codesMATU: "3\\.PS\\.02[abc]", lv: PA,
hint: "Équiprobabilité : cas favorables ÷ cas possibles. P(contraire) = 1 − P(A). P(A ∪ B) = P(A) + P(B) − P(A ∩ B).",
lesson: ["Probabilités : règles de calcul", "Calculer une probabilité sans tout recompter.", "Issues équiprobables : \\(P(A) = \\frac{\\text{cas favorables}}{\\text{cas possibles}}\\). Toujours \\(0 \\le P(A) \\le 1\\). Contraire : \\(P(\\overline{A}) = 1 - P(A)\\). Réunion : \\(P(A \\cup B) = P(A) + P(B) - P(A \\cap B)\\) ; si \\(A\\) et \\(B\\) sont incompatibles, \\(P(A \\cup B) = P(A) + P(B)\\).",
["Deux dés, somme 7 : 6 couples sur 36, \\(P = \\frac{1}{6}\\).", "\\(P(A) = 0{,}5\\), \\(P(B) = 0{,}4\\), \\(P(A \\cap B) = 0{,}2\\) : \\(P(A \\cup B) = 0{,}7\\)."], "Avec deux dés, les sommes ne sont pas équiprobables : on compte les 36 couples. Et dans \\(A \\cup B\\), l'intersection n'est comptée qu'une fois."],
comps: ["Équiprobabilité ; événement contraire ; deux dés", "Réunion et intersection ; jeu de cartes ; tableau d'effectifs", "A sans B ; dé truqué ; événements sur deux dés"] },
{ id: "probarbre", theme: "no", label: "Expériences successives, arbres", ex: "P(RR) = \\frac{3}{5} \\cdot \\frac{2}{4}", CH: [14], codesMATU: "3\\.PS\\.02d", lv: PT,
hint: "Le long d'un chemin de l'arbre, on multiplie ; entre chemins, on additionne. Sans remise, l'urne change. « Au moins un » : 1 − P(aucun).",
lesson: ["Expériences successives", "Un arbre pour organiser les étapes.", "Sur un arbre, la probabilité d'un chemin est le produit des probabilités de ses branches ; la probabilité d'un événement est la somme des probabilités de ses chemins. Avec remise, les tirages se répètent à l'identique ; sans remise, l'urne change (un objet de moins au 2e tirage). « Au moins un » : on passe par le contraire « aucun », \\(1 - (1 - p)^n\\).",
["3 rouges, 2 bleues, deux tirages sans remise : \\(P(RR) = \\frac{3}{5} \\cdot \\frac{2}{4} = \\frac{3}{10}\\)", "Au moins un 6 en 3 lancers : \\(1 - \\left(\\frac{5}{6}\\right)^3 = \\frac{91}{216}\\)"], "Le long d'un chemin, on multiplie ; entre chemins, on additionne. Pas l'inverse."],
comps: ["Deux étapes indépendantes ; tirages avec remise", "Tirages sans remise ; deux chemins ; « au moins un »", "Trois tirages ; deux urnes ; second tirage"] },
{ id: "derivth", theme: "fa", label: "Dérivabilité, théorèmes de Rolle et de Lagrange", ex: "f'(c) = \\frac{f(b) - f(a)}{b - a}", CH: [14], codesMATU: "3\\.AN\\.06[ab]|3\\.AN\\.09a", lv: DT,
hint: "Dérivable ⇒ continue, mais pas l'inverse (point anguleux : deux demi-tangentes de pentes différentes). Rolle : f(a) = f(b) ⇒ f'(c) = 0 pour un c entre a et b. Lagrange : f'(c) = pente de la corde.",
lesson: ["Dérivabilité et théorèmes", "Ce que la dérivée garantit.", "Si \\(f\\) est dérivable en \\(a\\), elle y est continue. L'inverse est faux : \\(|x|\\) est continue en 0, mais ses demi-tangentes ont les pentes \\(-1\\) et \\(1\\) (point anguleux). Pour un raccord dérivable, il faut les mêmes valeurs ET les mêmes pentes. Rolle : si \\(f\\) est dérivable sur \\([a \\,;\\, b]\\) et \\(f(a) = f(b)\\), il existe \\(c\\) entre \\(a\\) et \\(b\\) avec \\(f'(c) = 0\\) (tangente horizontale). Lagrange (accroissements finis) : il existe \\(c\\) avec \\(f'(c) = \\frac{f(b) - f(a)}{b - a}\\) : la tangente est parallèle à la corde. Conséquence : si \\(f' \\leq M\\), alors \\(f(b) \\leq f(a) + M(b - a)\\).",
["\\(f(x) = x^2 - 4x\\) sur \\([0 \\,;\\, 4]\\) : \\(f(0) = f(4)\\), \\(f'(c) = 2c - 4 = 0\\), \\(c = 2\\)", "\\(f(x) = x^3\\) sur \\([0 \\,;\\, 3]\\) : corde de pente 9, \\(3c^2 = 9\\), \\(c = \\sqrt{3}\\)"], "Rolle et Lagrange disent qu'un tel \\(c\\) existe ; pour le trouver, on résout \\(f'(c) = \\ldots\\), et on garde les solutions de l'intervalle."],
comps: ["Repérer un point anguleux ; demi-tangentes ; trouver le c de Rolle", "Nombre c de Lagrange ; raccord dérivable entre deux formules", "Plusieurs valeurs de Rolle ; majorer avec la dérivée (radar) ; angle de deux demi-tangentes"] },
];


for (const n of NEW) {
if (!NOTIONS.some((x) => x.id === n.id)) NOTIONS.push(Object.assign({ id: n.id, theme: n.theme, label: n.label, ex: n.ex, CH: n.CH, MP: null, FR: null }, n.niv ? { niv: n.niv } : {}));
GEN[n.id] = (d) => pickForm(n.lv[Math.min(Math.max(d, 1), 3)]);
HINTS_EXTRA[n.id] = n.hint;
LESSONS_EXTRA[n.id] = n.lesson;
if (typeof COMPS !== "undefined") COMPS[n.id] = n.comps;
if (typeof PROB_EXTRA !== "undefined") PROB_EXTRA[n.id] = PROBS[n.id];
}

if (typeof LESSON_FIGS !== "undefined") {
LESSON_FIGS.asymptotes = () => PL([{ f: (x) => 2 + 1 / (x - 1) }], [], { vlines: [1], hlines: [2], label: "f(x) = 2 + 1/(x − 1) : asymptotes x = 1 et y = 2" });
LESSON_FIGS.derivseconde = () => PL([{ f: (x) => 0.25 * (x - 1) ** 3 - (x - 1) + 1 }], [[1, 1, "I"]], { label: "point d'inflexion I : la courbe change de concavité" });
}
})();












(function () {
if (typeof NOTIONS === "undefined" || typeof GEN === "undefined") return;

const pk = (a) => a[Math.floor(R.rand() * a.length)];
const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; };
const r6 = (v) => { const x = +(+v).toFixed(9); return x === 0 ? 0 : x; };
const den = (v) => { for (let d = 1; d <= 400; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-7) return d; return 0; };

const fT = (v) => { v = r6(v); const d = den(v); if (d === 1 || !d || d > 60) return nb(v); const n = Math.round(v * d); return (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };

const fS = (v) => { v = r6(v); const d = den(v); if (d === 1) return String(Math.round(v)); if (!d) return String(v); return Math.round(v * d) + "/" + d; };
const par = (v) => (r6(v) < 0 ? "(" + fT(v) + ")" : fT(v));
const co = (a) => (a === 1 ? "" : a === -1 ? "-" : fT(a));
const DEG = 180 / Math.PI;

const frT = (m, n) => { const f = "\\frac{" + m + "}{" + n + "}", g = fT(m / n); return g === f ? f : f + " = " + g; };

const sgc = (c, v) => (c < 0 ? " - " : " + ") + (Math.abs(c) === 1 ? "" : fT(Math.abs(c))) + v;
const sgn = () => (R.rand() < 0.5 ? -1 : 1);
const perm = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(R.rand() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));

const add = (u, v) => u.map((x, i) => r6(x + v[i]));
const sub = (u, v) => u.map((x, i) => r6(x - v[i]));
const mul = (k, u) => u.map((x) => r6(k * x));
const dot = (u, v) => r6(u.reduce((s, x, i) => s + x * v[i], 0));
const cross = (u, v) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]].map(r6);
const nn2 = (u) => dot(u, u);
const nrm = (u) => Math.sqrt(nn2(u));
const isZ = (u) => u.every((x) => Math.abs(x) < 1e-9);
const red = (u) => { const g = u.reduce((a, x) => gcd(a, Math.abs(x)), 0) || 1; return u.map((x) => r6(x / g)); };
const det3 = (a, b, c) => dot(a, cross(b, c));
const angle = (u, v) => DEG * Math.acos(Math.max(-1, Math.min(1, dot(u, v) / (nrm(u) * nrm(v)))));
const rp = (k = 5) => [R.int(-k, k), R.int(-k, k), R.int(-k, k)];
const rv = (k = 3) => [nz(-k, k), nz(-k, k), nz(-k, k)];
const D = (v, s) => nb(r6(Math.round(v / s) * s));

const QUAD = [[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11], [6, 6, 7, 11], [3, 4, 12, 13], [2, 10, 11, 15]];
const qv = (lim) => { const [a, b, c, d] = pk(lim ? QUAD.slice(0, lim) : QUAD); return [perm([a, b, c]).map((x) => x * sgn()), d]; };

const ORTH = [[[[1, 2, 2], [2, 1, -2], [2, -2, 1]], 3], [[[2, 3, 6], [3, -6, 2], [6, 2, -3]], 7], [[[1, 4, 8], [4, 7, -4], [8, -4, 1]], 9]];
const orth = (lim) => { const [Mx, n] = pk(lim ? ORTH.slice(0, lim) : ORTH), p = perm([0, 1, 2]), s = [sgn(), sgn(), sgn()], rows = perm([0, 1, 2]).map((i) => p.map((j, k) => Mx[i][j] * s[k])); return { u: rows[0], w: rows[1], z: rows[2], n }; };

const vec = (s) => (s.length > 1 ? "\\overrightarrow{" + s + "}" : "\\vec{" + s + "}");
const v3 = (u) => "\\begin{pmatrix} " + u.map(fT).join(" \\\\ ") + " \\end{pmatrix}";
const vN = (s, u) => M(vec(s) + " = " + v3(u));
const ptT = (u) => "(" + u.map(fT).join(" \\,;\\, ") + ")";
const pt = (u) => M(ptT(u));
const ptN = (n, u) => M(n + ptT(u));
const TRIP = " Réponds « x ; y ; z ».";

const lt = (cs, vs) => { let o = ""; cs.forEach((c, i) => { c = r6(c); if (!c) return; const a = Math.abs(c), t = (vs[i] && a === 1 ? "" : fT(a)) + vs[i]; o += o === "" ? (c < 0 ? "-" : "") + t : (c < 0 ? " - " : " + ") + t; }); return o || "0"; };

const ltS = (cs, vs) => { let o = ""; cs.forEach((c, i) => { c = r6(c); if (!c) return; const a = Math.abs(c), cf = !vs[i] ? fS(a) : a === 1 ? "" : Number.isInteger(a) ? fS(a) : "(" + fS(a) + ")", t = cf + vs[i]; o += o === "" ? (c < 0 ? "-" : "") + t : (c < 0 ? " - " : " + ") + t; }); return o || "0"; };
const XYZ = ["x", "y", "z", ""];
const plT = (n, d) => lt(n.concat([d]), XYZ) + " = 0";

const cmp = (a, cs, ps) => { const tail = lt(cs, ps); if (!r6(a)) return tail; if (tail === "0") return fT(a); return fT(a) + (tail[0] === "-" ? " - " + tail.slice(1) : " + " + tail); };
const cmpS = (a, c, p) => { const tail = ltS([c], [p]); if (!r6(a)) return tail; if (tail === "0") return fS(a); return fS(a) + (tail[0] === "-" ? " - " + tail.slice(1) : " + " + tail); };
const eqD = (A, u, s = "t") => M("\\begin{cases} x = " + cmp(A[0], [u[0]], [s]) + " \\\\ y = " + cmp(A[1], [u[1]], [s]) + " \\\\ z = " + cmp(A[2], [u[2]], [s]) + " \\end{cases}");
const eqPl = (A, u, v) => M("\\begin{cases} x = " + cmp(A[0], [u[0], v[0]], ["s", "t"]) + " \\\\ y = " + cmp(A[1], [u[1], v[1]], ["s", "t"]) + " \\\\ z = " + cmp(A[2], [u[2], v[2]], ["s", "t"]) + " \\end{cases}");

const sq = (v, c) => (r6(c) ? "(" + v + (c < 0 ? " + " + fT(-c) : " - " + fT(c)) + ")^2" : v + "^2");
const sphT = (C, r2) => sq("x", C[0]) + " + " + sq("y", C[1]) + " + " + sq("z", C[2]) + " = " + fT(r2);

const keepT = (spec, traps) => { const seen = new Set(), tol = Math.max(spec.round || 0, 1e-9); return (traps || []).filter((tr) => {
if (!tr) return false;
if (tr.e !== undefined) { if (spec.kind !== "expr") return false; try { if (Expr.equivalent(Expr.parse(tr.e), Expr.parse(spec.expr))) return false; } catch (e) { return false; } if (seen.has(tr.e)) return false; seen.add(tr.e); return true; }
if (tr.s) { if (spec.kind !== "set" || !tr.s.length || !tr.s.every(isFinite)) return false; const k = tr.s.map(fS).sort().join(";"); if (seen.has(k) || checkAnswer(spec, tr.s.map(fS).join(" ; ")).status === "correct") return false; seen.add(k); return true; }
if (tr.spec) { if (spec.kind !== "pair" || tr.spec.values.length !== spec.values.length || !tr.spec.values.every(isFinite)) return false; const c = tr.spec.values.map(fS).join(" ; "); if (seen.has(c) || checkAnswer(spec, c).status === "correct") return false; seen.add(c); return true; }
if (spec.kind !== "value" || !isFinite(tr.v)) return false;
const k = spec.round ? Math.round(tr.v / spec.round) : r6(tr.v);
if (Math.abs(tr.v - spec.value) <= tol || seen.has(k)) return false; seen.add(k); return true; }); };

const vis = (t) => t.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, (m, a, b) => (a.length > b.length ? a : b)).replace(/\\[a-zA-Z]+/g, "x").replace(/\\[,;!]|[{}\s]/g, "");
const cut = (t) => { const out = []; let d = 0, last = 0;
for (let i = 0; i < t.length; i++) { const c = t[i];
if (c === "{") d++; else if (c === "}") d--; else if (t.startsWith("\\left", i)) d++; else if (t.startsWith("\\right", i)) d--;
else if (d === 0 && i > last + 1) { const m = /^ (=|\\iff|\\approx) /.exec(t.slice(i)); if (m) { out.push(t.slice(last, i)); last = i + 1; i += m[0].length - 2; } } }
out.push(t.slice(last)); return out; };
const wrapM = (h) => (typeof h !== "string" ? h : h.replace(/\\\((.*?)\\\)/g, (m, t) => { if (/\\begin/.test(t) || vis(t).length <= 22) return m; const ps = cut(t); if (ps.length < 2) return m;
const ch = []; let cur = ""; for (const p of ps) { if (cur && vis(cur + p).length > 22) { ch.push(cur); cur = p; } else cur = cur ? cur + " " + p : p; } ch.push(cur);
return ch.map((c) => "\\(" + c + "\\)").join(" "); }));
const mk = (q, spec, sol, o) => { const x = { q: wrapM(q), spec, sol: wrapM(sol), guide: (o.guide || []).map((g) => Object.assign({}, g, { ask: wrapM(g.ask), sol: wrapM(g.sol) })), ctx: o.ctx, traps: keepT(spec, o.traps) }; if (o.fig) x.fig = o.fig; if (o.canon) x.canon = o.canon; if (o.shownOk) x.shownOk = true; return x; };
const QN = (q, value, sol, o) => (isFinite(value) ? mk(q, { kind: "value", value: r6(value) }, sol, o) : null);
const QR = (q, value, round, sol, o) => (isFinite(value) ? mk(q, { kind: "value", value, round }, sol, o) : null);
const QP = (q, vals, sol, o) => (vals.every(isFinite) ? mk(q, { kind: "pair", values: vals.map(r6) }, sol, Object.assign({ canon: vals.map(fS).join(" ; ") }, o)) : null);
const QX = (q, expr, sol, o) => mk(q, { kind: "expr", expr }, sol, Object.assign({ canon: expr }, o));
const QSet = (q, vals, sol, o) => mk(q, { kind: "set", values: [...new Set(vals.map(r6))].sort((a, b) => a - b) }, sol, o);
const G = (ask, value, sol, round) => GS(ask, r6(value), sol, round);
const GP = (ask, vals, sol) => ({ ask, spec: { kind: "pair", values: vals.map(r6) }, sol });
const GX = (ask, expr, sol) => ({ ask, spec: { kind: "expr", expr }, sol });
const GSet = (ask, vals, sol) => ({ ask, spec: { kind: "set", values: [...new Set(vals.map(r6))].sort((a, b) => a - b) }, sol });
const TR = TRAP;
const TP = (vals, m) => ({ spec: { kind: "pair", values: vals.map(r6) }, m });
const TX = (e, m) => ({ e, m });
const TSt = (s, m) => ({ s: s.map(r6), m });
const P = (q, parts, hints, sol) => ({ q, sol: wrapM(sol), parts: parts.map(([label, value, round]) => ({ label, spec: Object.assign({ kind: "value", value: r6(value) }, round ? { round } : {}) })), hints });

const ptS = (u) => "(" + u.map((x) => String(r6(x)).replace(".", ",").replace("-", "−")).join(" ; ") + ")";
const plS = (n, d) => ltS(n.concat([d]), XYZ).replace(/-/g, "−") + " = 0";


const VE = {
1: [
() => { const A = rp(5), B = rp(5), u = sub(B, A); if (u.some((x) => !x)) return null;
return QP("Donne les composantes du vecteur " + M(vec("AB")) + " avec " + ptN("A", A) + " et " + ptN("B", B) + "." + TRIP, u, "Extrémité moins origine : " + M(vec("AB") + " = " + v3(u)) + ".",
{ ctx: "composantes", guide: [G("Première composante " + M("x_B - x_A") + " ?", u[0], M(fT(B[0]) + " - " + par(A[0]) + " = " + fT(u[0])) + "."), G("Deuxième " + M("y_B - y_A") + " ?", u[1], M(fT(B[1]) + " - " + par(A[1]) + " = " + fT(u[1])) + "."), G("Troisième " + M("z_B - z_A") + " ?", u[2], M(fT(B[2]) + " - " + par(A[2]) + " = " + fT(u[2])) + "."), GP("Composantes de " + M(vec("AB")) + " ?", u, M(v3(u)) + ".")],
traps: [TP(sub(A, B), "Extrémité moins origine : B − A, pas A − B."), TP(add(A, B), "On soustrait les coordonnées (B − A), on ne les additionne pas.")] }); },
() => { const A = rp(6), h = rv(3), B = add(A, mul(2, h)), Mi = add(A, h);
return QP("Donne les coordonnées du milieu " + M("M") + " de " + M("[AB]") + " avec " + ptN("A", A) + " et " + ptN("B", B) + "." + TRIP, Mi, "Moyenne des coordonnées : " + M("M = \\left(\\frac{x_A + x_B}{2} \\,;\\, \\frac{y_A + y_B}{2} \\,;\\, \\frac{z_A + z_B}{2}\\right)") + " = " + pt(Mi) + ".",
{ ctx: "milieu", guide: [G(M("x_M") + " ?", Mi[0], M("\\frac{" + fT(A[0]) + " + " + par(B[0]) + "}{2} = " + fT(Mi[0])) + "."), G(M("y_M") + " ?", Mi[1], M(fT(Mi[1])) + "."), G(M("z_M") + " ?", Mi[2], M(fT(Mi[2])) + "."), GP("Milieu ?", Mi, pt(Mi) + ".")],
traps: [TP(h, "Le milieu est la moyenne (x_A + x_B) ÷ 2, pas la demi-différence."), TP(add(A, B), "N'oublie pas de diviser par 2.")] }); },
() => { const a = pk([2, 3, -2, -3, 4]), b = pk([2, 3, -2, -3]), u = rp(4), v = rp(4); if (isZ(u) || isZ(v)) return null; const w = add(mul(a, u), mul(b, v)); if (isZ(w)) return null;
const ex = co(a) + "\\vec{u}" + (b < 0 ? " - " : " + ") + Math.abs(b) + "\\vec{v}";
return QP("Avec " + vN("u", u) + " et " + vN("v", v) + ", calcule les composantes de " + M(ex) + "." + TRIP, w, M(fT(a) + "\\vec{u} = " + v3(mul(a, u))) + ", " + M(fT(b) + "\\vec{v} = " + v3(mul(b, v))) + " ; on additionne : " + M(v3(w)) + ".",
{ ctx: "combinaison", guide: [GP("Composantes de " + M(fT(a) + "\\vec{u}") + " ?", mul(a, u), M(v3(mul(a, u))) + "."), GP("Composantes de " + M(fT(b) + "\\vec{v}") + " ?", mul(b, v), M(v3(mul(b, v))) + "."), GP("Somme ?", w, M(v3(w)) + ".")],
traps: [TP(add(mul(a, u), v), "Multiplie aussi chaque composante de v par " + b + "."), TP(add(mul(a, u), mul(-b, v)), "Attention au signe devant v."), TP(add(u, v), "Les coefficients " + a + " et " + b + " multiplient les vecteurs.")] }); },
],
2: [
() => { const [p, d] = qv(), A = rp(5), B = add(A, p);
return QN("Calcule la distance " + M("AB") + " avec " + ptN("A", A) + " et " + ptN("B", B) + ", c'est-à-dire la norme de " + M(vec("AB")) + ".", d, M(vec("AB") + " = " + v3(p)) + ", " + M("\\|" + vec("AB") + "\\| = \\sqrt{" + p.map((x) => par(x) + "^2").join(" + ") + "} = \\sqrt{" + d * d + "} = " + d) + ".",
{ ctx: "norme", guide: [GP("Composantes de " + M(vec("AB")) + " ?", p, M(v3(p)) + "."), G("Somme des carrés des composantes ?", d * d, M(p.map((x) => x * x).join(" + ") + " = " + d * d) + "."), G("Norme ?", d, M("\\sqrt{" + d * d + "} = " + d) + ".")],
traps: [TR(Math.abs(p[0]) + Math.abs(p[1]) + Math.abs(p[2]), "Pythagore dans l'espace : √(a² + b² + c²), on n'additionne pas les composantes."), TR(d * d, "N'oublie pas la racine carrée."), TR(Math.hypot(p[0], p[1]), "Il y a trois composantes : n'oublie pas z.")] }); },
() => { const A = rp(5), B = rp(5), C = rp(5); if (isZ(cross(sub(B, A), sub(C, B)))) return null; const Dp = add(A, sub(C, B));
return QP(M("ABCD") + " est un parallélogramme (sommets dans cet ordre) avec " + ptN("A", A) + ", " + ptN("B", B) + " et " + ptN("C", C) + ". Donne les coordonnées de " + M("D") + "." + TRIP, Dp, "Dans " + M("ABCD") + ", " + M(vec("AD") + " = " + vec("BC")) + " : " + M("D = A + " + vec("BC") + " = " + ptT(Dp)) + ".",
{ ctx: "parallelogramme", guide: [GP("Composantes de " + M(vec("BC")) + " ?", sub(C, B), M(v3(sub(C, B))) + "."), GP(M("D = A + " + vec("BC")) + " ?", Dp, pt(Dp) + ".")],
traps: [TP(add(B, sub(C, A)), "C'est le parallélogramme ABDC : dans ABCD, on a AD = BC."), TP(add(A, sub(B, C)), "Dans ABCD, AD = BC : D = A + (C − B)."), TP(add(C, sub(B, A)), "Ce point complète ABEC ; dans ABCD, AD = BC.")] }); },
() => { const u = rv(4), v = rv(4), w = sub(v, u); if (w.some((x) => !x)) return null;
return QP("On connaît " + vN("AB", u) + " et " + vN("AC", v) + ". Donne les composantes de " + M(vec("BC")) + "." + TRIP, w, "Chasles : " + M(vec("BC") + " = " + vec("BA") + " + " + vec("AC") + " = " + vec("AC") + " - " + vec("AB") + " = " + v3(w)) + ".",
{ ctx: "chasles", guide: [GP("Composantes de " + M(vec("BA") + " = -" + vec("AB")) + " ?", mul(-1, u), M(v3(mul(-1, u))) + "."), GP(M(vec("BC") + " = " + vec("BA") + " + " + vec("AC")) + " ?", w, M(v3(w)) + ".")],
traps: [TP(sub(u, v), "BC = BA + AC = AC − AB, pas AB − AC."), TP(add(u, v), "BA = −AB : on soustrait AB.")] }); },
],
3: [
() => { const A = rp(6), Mi = rp(4); if (A.some((x, i) => x === Mi[i])) return null; const B = sub(mul(2, Mi), A);
return QP("Le point " + M("B") + " est le symétrique de " + ptN("A", A) + " par rapport à " + ptN("M", Mi) + ". Donne les coordonnées de " + M("B") + "." + TRIP, B, M("M") + " est le milieu de " + M("[AB]") + " : " + M("B = A + 2\\," + vec("AM") + " = 2M - A = " + ptT(B)) + ".",
{ ctx: "symetrique", guide: [GP("Composantes de " + M(vec("AM")) + " ?", sub(Mi, A), M(v3(sub(Mi, A))) + "."), GP(M("B = M + " + vec("AM")) + " ?", B, pt(B) + ".")],
traps: [TP(mul(0.5, add(A, Mi)), "M est le milieu de [AB] : on cherche B, pas le milieu de [AM]."), TP(sub(Mi, A), "C'est le vecteur AM ; le point B vaut M + AM."), TP(add(Mi, A), "B = 2M − A.")] }); },
() => { const [a0, b0, c, d] = pk(QUAD), a = a0 * sgn(), b = b0 * sgn(); if (c < 2) return null;
return QN("Pour quelle valeur de " + M("m > 0") + " le vecteur " + M("\\vec{u} = \\begin{pmatrix} " + fT(a) + " \\\\ " + fT(b) + " \\\\ m \\end{pmatrix}") + " a-t-il pour norme " + M(d) + " ?", c, M(par(a) + "^2 + " + par(b) + "^2 + m^2 = " + d + "^2") + ", donc " + M("m^2 = " + (d * d) + " - " + (a * a + b * b) + " = " + c * c) + " et " + M("m = " + c) + ".",
{ ctx: "norme-inconnue", guide: [G(M("m^2 = " + d + "^2 - " + par(a) + "^2 - " + par(b) + "^2") + " ?", c * c, M(c * c) + "."), G(M("m") + " (positif) ?", c, M(c) + ".")],
traps: [TR(c * c, "C'est m² : prends la racine carrée."), TR(d - Math.abs(a) - Math.abs(b), "Pythagore : m² = d² − a² − b², pas m = d − a − b."), TR(Math.sqrt(d * d + a * a + b * b), "On soustrait a² et b² de d².")] }); },
() => { const Gc = rp(4), p = rv(3), q = rv(3); if (isZ(cross(p, q))) return null; const A = add(Gc, p), B = add(Gc, q), C = sub(sub(Gc, p), q);
return QP("Donne le centre de gravité " + M("G") + " du triangle de sommets " + ptN("A", A) + ", " + ptN("B", B) + " et " + ptN("C", C) + "." + TRIP, Gc, M("G = \\frac{A + B + C}{3}") + " (moyenne des trois sommets) : " + pt(Gc) + ".",
{ ctx: "centre-gravite", guide: [G(M("x_G = \\frac{x_A + x_B + x_C}{3}") + " ?", Gc[0], M("\\frac{" + (A[0] + B[0] + C[0]) + "}{3} = " + Gc[0]) + "."), G(M("y_G") + " ?", Gc[1], M(Gc[1]) + "."), G(M("z_G") + " ?", Gc[2], M(Gc[2]) + "."), GP("Centre de gravité ?", Gc, pt(Gc) + ".")],
traps: [TP(add(add(A, B), C), "Divise la somme par 3."), TP(mul(0.5, add(A, B)), "C'est le milieu de [AB] ; G est la moyenne des trois sommets.")] }); },
],
};


const CL = {
1: [
() => { const u = rv(5), k = pk([2, 3, -2, -3, 4]), m = k * u[1], v = [k * u[0], "m", k * u[2]];
return QN("Pour quelle valeur de " + M("m") + " les vecteurs " + vN("u", u) + " et " + M("\\vec{v} = \\begin{pmatrix} " + fT(v[0]) + " \\\\ m \\\\ " + fT(v[2]) + " \\end{pmatrix}") + " sont-ils colinéaires ?", m, M("\\frac{" + fT(v[0]) + "}{" + fT(u[0]) + "} = " + k) + " et " + M("\\frac{" + fT(v[2]) + "}{" + fT(u[2]) + "} = " + k) + " : " + M("\\vec{v} = " + k + "\\vec{u}") + ", donc " + M("m = " + k + " \\cdot " + par(u[1]) + " = " + m) + ".",
{ ctx: "colin-m", guide: [G("Facteur " + M("k") + " tel que " + M("\\vec{v} = k\\vec{u}") + " (avec les premières composantes) ?", k, M(k) + "."), G(M("m = k \\cdot u_y") + " ?", m, M(m) + ".")],
traps: [TR(u[1] / k, "v = k·u : on multiplie u_y par k, on ne divise pas."), TR(-m, "Attention au signe de k."), TR(u[1], "Les composantes de v valent k fois celles de u.")] }); },
() => { const k = pk([2, 3, -2, -3, 0.5, -0.5, 1.5]), u = den(k) > 1 ? mul(2, rv(3)) : rv(4), v = mul(k, u);
return QN("Les vecteurs " + vN("u", u) + " et " + vN("v", v) + " sont colinéaires : " + M("\\vec{v} = k\\,\\vec{u}") + ". Que vaut " + M("k") + " ?", k, M("k = \\frac{" + fT(v[0]) + "}{" + fT(u[0]) + "} = " + fT(k)) + " (même rapport pour les trois composantes).",
{ ctx: "facteur", guide: [G(M("\\frac{v_x}{u_x}") + " ?", k, M(fT(k)) + "."), G("Même rapport avec " + M("z") + " ? Donc " + M("k") + " = ?", k, M(fT(k)) + ".")],
traps: [TR(1 / k, "C'est le facteur de u = k·v ; ici v = k·u : k = v_x ÷ u_x."), TR(-k, "Attention au signe.")] }); },
() => { const A = rp(4), d = rv(3), t = pk([2, 3, -1, -2]), B = add(A, d), C = add(A, mul(t, d)); if (Math.abs(C[2]) < 2) return null;
return QN("Les points " + ptN("A", A) + ", " + ptN("B", B) + " et " + M("C(" + fT(C[0]) + " \\,;\\, " + fT(C[1]) + " \\,;\\, z)") + " sont alignés. Que vaut " + M("z") + " ?", C[2], M(vec("AB") + " = " + v3(d)) + " ; avec " + M("x") + " : " + M(vec("AC") + " = " + t + "\\," + vec("AB")) + ", donc " + M("z = " + fT(A[2]) + " + " + par(t) + " \\cdot " + par(d[2]) + " = " + fT(C[2])) + ".",
{ ctx: "alignes", guide: [GP(M(vec("AB")) + " ?", d, M(v3(d)) + "."), G("Nombre " + M("t") + " tel que " + M(vec("AC") + " = t\\," + vec("AB")) + " (avec " + M("x") + ") ?", t, M(t) + "."), G(M("z = z_A + t \\cdot (z_B - z_A)") + " ?", C[2], M(fT(C[2])) + ".")],
traps: [TR(B[2], "C'est la cote de B ; C correspond à t = " + t + "."), TR(t * d[2], "On part de A : z = z_A + t·(z_B − z_A)."), TR(-C[2], "Attention au signe.")] }); },
],
2: [
() => { const A = rp(4), d = mul(2, rv(2)), t = pk([0.5, 1.5, -0.5, 2.5]), B = add(A, d), C = add(A, mul(t, d));
return QP("Les points " + ptN("A", A) + ", " + ptN("B", B) + " et " + M("C(" + fT(C[0]) + " \\,;\\, m \\,;\\, n)") + " sont alignés. Donne " + M("m") + " et " + M("n") + ". Réponds « m ; n ».", [C[1], C[2]], M(vec("AC") + " = t\\," + vec("AB")) + " : avec " + M("x") + ", " + M("t = " + fT(t)) + " ; " + M("m = " + fT(A[1]) + " + " + fT(t) + " \\cdot " + par(d[1]) + " = " + fT(C[1])) + ", " + M("n = " + fT(A[2]) + " + " + fT(t) + " \\cdot " + par(d[2]) + " = " + fT(C[2])) + ".",
{ ctx: "alignes-deux", guide: [G(M("t") + " (avec les abscisses) ?", t, M(fT(t)) + "."), G(M("m") + " ?", C[1], M(fT(C[1])) + "."), G(M("n") + " ?", C[2], M(fT(C[2])) + "."), GP("Réponse « m ; n » ?", [C[1], C[2]], M(fT(C[1]) + " \\,;\\, " + fT(C[2])) + ".")],
traps: [TP([C[2], C[1]], "Dans l'ordre : m (ordonnée) puis n (cote)."), TP([B[1], B[2]], "C n'est pas B : AC = t·AB avec t = " + fS(t) + ".")] }); },
() => { const u = rv(3), v = rv(3); if (isZ(cross(u, v))) return null; const a = nz(-3, 3), b = nz(-3, 3); if (Math.abs(a) === 1 && Math.abs(b) === 1) return null; const w = add(mul(a, u), mul(b, v)); if (w.some((x) => !x)) return null;
return QP("Les vecteurs " + vN("u", u) + ", " + vN("v", v) + " et " + vN("w", w) + " sont coplanaires. Trouve " + M("\\alpha") + " et " + M("\\beta") + " tels que " + M("\\vec{w} = \\alpha\\vec{u} + \\beta\\vec{v}") + ". Réponds « α ; β ».", [a, b], "On résout le système des trois composantes (deux suffisent, la troisième vérifie) : " + M("\\alpha = " + a) + ", " + M("\\beta = " + b) + ".",
{ ctx: "decomposition", guide: [G(M("\\alpha") + " ?", a, M(a) + "."), G(M("\\beta") + " ?", b, M(b) + "."), GP("Réponse « α ; β » ?", [a, b], M(a + " \\,;\\, " + b) + ".")],
traps: [TP([b, a], "α multiplie u et β multiplie v : vérifie l'ordre."), TP([-a, -b], "Attention aux signes : vérifie avec une composante.")] }); },
() => { const A = rp(3), u = rv(3), v = rv(3); if (u[0] * v[1] - u[1] * v[0] === 0) return null; const a = nz(-2, 2), b = nz(-2, 2), Dp = add(A, add(mul(a, u), mul(b, v))); if (Math.abs(Dp[2]) < 2) return null; const B = add(A, u), C = add(A, v);
return QN("Les points " + ptN("A", A) + ", " + ptN("B", B) + ", " + ptN("C", C) + " et " + M("D(" + fT(Dp[0]) + " \\,;\\, " + fT(Dp[1]) + " \\,;\\, z)") + " sont coplanaires. Que vaut " + M("z") + " ?", Dp[2], M(vec("AD") + " = \\alpha\\," + vec("AB") + " + \\beta\\," + vec("AC")) + " ; avec " + M("x") + " et " + M("y") + " : " + M("\\alpha = " + a) + ", " + M("\\beta = " + b) + " ; puis " + M("z = " + fT(A[2]) + " + " + par(a) + " \\cdot " + par(u[2]) + " + " + par(b) + " \\cdot " + par(v[2]) + " = " + fT(Dp[2])) + ".",
{ ctx: "coplanaires", guide: [GP(M(vec("AB")) + " ?", u, M(v3(u)) + "."), GP(M(vec("AC")) + " ?", v, M(v3(v)) + "."), G(M("\\alpha") + " (avec les composantes x et y de " + M(vec("AD") + " = \\alpha\\," + vec("AB") + " + \\beta\\," + vec("AC")) + ") ?", a, M(a) + "."), G(M("\\beta") + " ?", b, M(b) + "."), G(M("z") + " ?", Dp[2], M(fT(Dp[2])) + ".")],
traps: [TR(A[2] + b * u[2] + a * v[2], "α multiplie AB et β multiplie AC."), TR(a * u[2] + b * v[2], "On part de A : z = z_A + α·(AB)_z + β·(AC)_z.")] }); },
],
3: [
() => { const k = pk([2, 3, -2, -3]), p = pk([1, 2, -1, -2, 3]), c = nz(-4, 4), m = p * k, q = p * k * k;
return QN("Pour quelle valeur de " + M("m") + " les vecteurs " + M("\\vec{u} = \\begin{pmatrix} m \\\\ " + fT(p) + " \\\\ " + fT(c) + " \\end{pmatrix}") + " et " + M("\\vec{v} = \\begin{pmatrix} " + fT(q) + " \\\\ m \\\\ " + fT(k * c) + " \\end{pmatrix}") + " sont-ils colinéaires ?", m, "Les troisièmes composantes donnent " + M("\\vec{v} = " + k + "\\vec{u}") + ". Deuxième composante : " + M("m = " + k + " \\cdot " + par(p) + " = " + m) + " ; vérification : " + M(k + " \\cdot " + par(m) + " = " + q) + ".",
{ ctx: "colin-parametre", guide: [G("Facteur " + M("k") + " (avec les troisièmes composantes) ?", k, M(k) + "."), G(M("m = k \\cdot " + par(p)) + " ?", m, M(m) + " (et " + M(k + " \\cdot " + par(m) + " = " + q) + " : ça vérifie).")],
traps: [TR(-m, "Les deux conditions m² = " + p * q + " donnent ±" + Math.abs(m) + " : seule la valeur compatible avec le facteur " + k + " convient."), TR(q / k, "v = k·u : m = k · " + p + ".")] }); },
() => { const A = rp(3), u = rv(3), v = rv(3); if (u[1] * v[2] - u[2] * v[1] === 0) return null; const a = nz(-2, 2), b = nz(-2, 2), Dp = add(A, add(mul(a, u), mul(b, v))); if (Math.abs(Dp[0]) < 2) return null; const B = add(A, u), C = add(A, v);
return QN("Pour quelle valeur de " + M("m") + " les points " + ptN("A", A) + ", " + ptN("B", B) + ", " + ptN("C", C) + " et " + M("D(m \\,;\\, " + fT(Dp[1]) + " \\,;\\, " + fT(Dp[2]) + ")") + " sont-ils coplanaires ?", Dp[0], M(vec("AD") + " = \\alpha\\," + vec("AB") + " + \\beta\\," + vec("AC")) + " ; les composantes " + M("y") + " et " + M("z") + " donnent " + M("\\alpha = " + a) + ", " + M("\\beta = " + b) + " ; puis " + M("m = " + fT(A[0]) + " + " + par(a) + " \\cdot " + par(u[0]) + " + " + par(b) + " \\cdot " + par(v[0]) + " = " + fT(Dp[0])) + ".",
{ ctx: "coplanaires-x", guide: [G(M("\\alpha") + " (système avec les composantes y et z) ?", a, M(a) + "."), G(M("\\beta") + " ?", b, M(b) + "."), G(M("m") + " ?", Dp[0], M(fT(Dp[0])) + ".")],
traps: [TR(A[0] + b * u[0] + a * v[0], "α multiplie AB et β multiplie AC."), TR(a * u[0] + b * v[0], "On part de A : m = x_A + α·(AB)_x + β·(AC)_x.")] }); },
() => { const A = [R.int(-3, 3), R.int(-3, 3), R.int(1, 4)], u = [nz(-3, 3), nz(-3, 3), nz(1, 3)], t = pk([2, 3, 4]), B = add(A, u), C = add(A, mul(t, u)); if (C[2] < 2) return null;
return QN("Un rayon laser part de " + ptN("A", A) + " et passe par " + ptN("B", B) + " (en m). À quelle hauteur " + M("z") + " passe-t-il à la verticale du point " + M("(" + fT(C[0]) + " \\,;\\, " + fT(C[1]) + " \\,;\\, 0)") + " ?", C[2], "Le point du rayon s'écrit " + M("A + t\\," + vec("AB")) + " ; avec " + M("x") + " : " + M("t = " + t) + " (même valeur avec " + M("y") + ") ; " + M("z = " + fT(A[2]) + " + " + t + " \\cdot " + par(u[2]) + " = " + fT(C[2])) + " m.",
{ ctx: "laser", guide: [GP(M(vec("AB")) + " ?", u, M(v3(u)) + "."), G(M("t") + " (avec l'abscisse) ?", t, M(t) + "."), G("Hauteur " + M("z") + " ?", C[2], M(fT(C[2])) + " m.")],
traps: [TR(B[2], "C'est la hauteur en B (t = 1) ; ici t = " + t + "."), TR(t * u[2], "On part de A : z = z_A + t·(AB)_z."), TR(t * B[2], "z = z_A + t·(z_B − z_A).")] }); },
],
};


const DT = {
1: [
() => { const A = rp(4), u = rv(3), t = pk([2, 3, -2, -3]), Q = add(A, mul(t, u));
return QP("La droite " + M("d") + " a pour équations paramétriques " + eqD(A, u) + ". Donne le point de " + M("d") + " obtenu pour " + M("t = " + t) + "." + TRIP, Q, "On remplace " + M("t") + " par " + M(t) + " : " + pt(Q) + ".",
{ ctx: "point-t", guide: [G(M("x") + " ?", Q[0], M(fT(A[0]) + " + " + par(u[0]) + " \\cdot " + par(t) + " = " + fT(Q[0])) + "."), G(M("y") + " ?", Q[1], M(fT(Q[1])) + "."), G(M("z") + " ?", Q[2], M(fT(Q[2])) + "."), GP("Point ?", Q, pt(Q) + ".")],
traps: [TP(mul(t, u), "N'oublie pas le point de départ (le terme sans t)."), TP(add(A, u), "Remplace t par " + t + ".")] }); },
() => { const A = rp(4), u = rv(3), t = pk([2, 3, -2, 4, -3]), Q = add(A, mul(t, u));
return QN("Le point " + ptN("P", Q) + " est sur la droite " + eqD(A, u) + ". Pour quelle valeur du paramètre " + M("t") + " ?", t, M(fT(Q[0]) + " = " + cmp(A[0], [u[0]], ["t"])) + " donne " + M("t = " + t) + " ; les deux autres équations donnent la même valeur.",
{ ctx: "parametre", shownOk: true, guide: [G("Avec la première équation : " + M(fT(u[0]) + "t") + " = ?", Q[0] - A[0], M(fT(Q[0]) + " - " + par(A[0]) + " = " + fT(Q[0] - A[0])) + "."), G(M("t") + " ?", t, M(t) + ".")],
traps: [TR(Q[0] - A[0], "Divise encore par " + u[0] + "."), TR(-t, "Attention au signe."), TR(Q[0], "On résout x_P = x_A + t·u_x.")] }); },
() => { const A = rp(5), B = rp(5), u = sub(B, A); if (u.some((x) => !x) || !A[2]) return null; const ex = cmpS(A[2], u[2], "t");
return QX("On paramètre la droite " + M("(AB)") + " par " + M("(x \\,;\\, y \\,;\\, z) = A + t\\," + vec("AB")) + ", avec " + ptN("A", A) + " et " + ptN("B", B) + ". Donne l'expression de " + M("z") + " en fonction de " + M("t") + ".", ex, M(vec("AB") + " = " + v3(u)) + ", donc " + M("z = " + cmp(A[2], [u[2]], ["t"])) + ".",
{ ctx: "equation-AB", guide: [G("Troisième composante de " + M(vec("AB")) + " ?", u[2], M(fT(B[2]) + " - " + par(A[2]) + " = " + fT(u[2])) + "."), GX(M("z") + " en fonction de " + M("t") + " ?", ex, M("z = " + cmp(A[2], [u[2]], ["t"])) + ".")],
traps: [TX(cmpS(B[2], u[2], "t"), "On part de A (t = 0 donne A), pas de B."), TX(cmpS(A[2], B[2], "t"), "Le coefficient de t est z_B − z_A."), TX(cmpS(A[2], -u[2], "t"), "AB = B − A : attention au signe.")] }); },
],
2: [
() => { const A = rv(6), u = rv(3), k = R.int(0, 2), name = ["yOz", "xOz", "xOy"][k], vr = ["x", "y", "z"][k], t = r6(-A[k] / u[k]); if (!Number.isInteger(t) || Math.abs(t) < 2) return null; const Q = A.map((x, i) => (i === k ? 0 : r6(x + t * u[i])));
return QP("Donne le point d'intersection de la droite " + eqD(A, u) + " avec le plan " + M(name) + " (d'équation " + M(vr + " = 0") + ")." + TRIP, Q, M(vr + " = 0") + " donne " + M("t = " + t) + " : " + pt(Q) + ".",
{ ctx: "plan-coord", guide: [G("On pose " + M(vr + " = 0") + " : " + M("t") + " = ?", t, M(t) + "."), GP("Point ?", Q, pt(Q) + ".")],
traps: [TP(A.map((x, i) => (i === k ? 0 : x)), "Calcule t, puis les deux autres coordonnées."), TP(A.map((x, i) => (i === k ? 0 : r6(x - t * u[i]))), "Attention au signe de t.")] }); },
() => { const A = rp(4), u = rv(3), t = pk([2, 3, -2, -3]), Q = add(A, mul(t, u)); if (Math.abs(Q[2]) < 2) return null;
return QN("Le point " + M("P(" + fT(Q[0]) + " \\,;\\, " + fT(Q[1]) + " \\,;\\, m)") + " appartient à la droite " + eqD(A, u) + ". Que vaut " + M("m") + " ?", Q[2], "Avec " + M("x") + " : " + M("t = " + t) + " (même valeur avec " + M("y") + ") ; " + M("m = " + fT(A[2]) + " + " + par(u[2]) + " \\cdot " + par(t) + " = " + fT(Q[2])) + ".",
{ ctx: "coordonnee-manquante", guide: [G(M("t") + " (avec l'équation de x) ?", t, M(t) + "."), G(M("m") + " ?", Q[2], M(fT(Q[2])) + ".")],
traps: [TR(A[2] + u[2] * Q[0], "Remplace t (et non x) dans l'équation de z."), TR(A[2] + u[2], "Calcule d'abord t avec x."), TR(u[2] * t, "N'oublie pas le terme constant " + A[2] + ".")] }); },
() => { const A = rp(4), B = rp(4), u = rv(3), t = pk([2, 3, -2]); if (A.every((x, i) => x === B[i])) return null; const Q = add(B, mul(t, u));
return QP("La droite " + M("d") + " passe par " + ptN("B", B) + " et est parallèle à la droite " + M("d'") + " : " + eqD(A, u) + ". On paramètre " + M("d") + " avec le même vecteur directeur que " + M("d'") + ". Donne le point de " + M("d") + " obtenu pour " + M("t = " + t) + "." + TRIP, Q, "Vecteur directeur de " + M("d'") + " : " + M(v3(u)) + ". " + M("d") + " : " + M("B + t\\," + v3(u)) + " ; pour " + M("t = " + t) + " : " + pt(Q) + ".",
{ ctx: "parallele", guide: [GP("Vecteur directeur de " + M("d'") + " ?", u, M(v3(u)) + "."), GP("Point " + M("B + " + t + "\\vec{u}") + " ?", Q, pt(Q) + ".")],
traps: [TP(add(A, mul(t, u)), "C'est le point de d' ; d passe par B."), TP(add(B, u), "Remplace t par " + t + "."), TP(add(B, mul(t, A)), "Le vecteur directeur est formé des coefficients de t, pas du point de départ.")] }); },
],
3: [
() => { const Pp = rp(4), u = rv(3), v = rv(3); if (isZ(cross(u, v))) return null; const t0 = pk([1, -1, 2, -2]), s0 = pk([1, 2, -1, -2, 3]), A = sub(Pp, mul(t0, u)), B = sub(Pp, mul(s0, v));
return QP("Les droites " + M("d_1") + " : " + eqD(A, u) + " et " + M("d_2") + " : " + eqD(B, v, "s") + " sont sécantes. Donne leur point d'intersection." + TRIP, Pp, "On égalise les coordonnées (système en " + M("t") + " et " + M("s") + ") : " + M("t = " + t0) + ", " + M("s = " + s0) + " (la troisième équation vérifie). Point " + pt(Pp) + ".",
{ ctx: "intersection", guide: [G(M("t") + " ?", t0, M(t0) + "."), G(M("s") + " ?", s0, M(s0) + "."), GP("Point (avec " + M("t") + " dans " + M("d_1") + ") ?", Pp, pt(Pp) + ".")],
traps: [TP(add(A, mul(s0, u)), "Dans d₁, remplace t (pas s)."), TP(add(B, mul(t0, v)), "Dans d₂, remplace s (pas t)."), TP(A, "C'est le point de d₁ pour t = 0.")] }); },
() => { const z0 = pk([150, 200, 300, 450]), w = pk([120, 150, 200, 250, 300]), t = R.int(4, 15), h = z0 + w * t, vx = pk([3, 4, 5, 6]), vy = pk([2, 3, 4, -3, -2]), x0 = R.int(-5, 5), y0 = R.int(-5, 5);
return QN("Un avion décolle ; " + M("t") + " minutes après le décollage, sa position est " + eqD([x0, y0, z0], [vx, vy, w]) + " (" + M("x") + " et " + M("y") + " en km, altitude " + M("z") + " en m). Au bout de combien de minutes atteint-il l'altitude de " + M(nb(h) + tu("m")) + " ?", t, M(z0 + " + " + w + "t = " + nb(h)) + ", donc " + M("t = \\frac{" + nb(h - z0) + "}{" + w + "} = " + t) + " min.",
{ ctx: "avion", guide: [G("Altitude à gagner depuis le décollage (en m) ?", h - z0, M(nb(h) + " - " + z0 + " = " + nb(h - z0)) + "."), G(M("t") + " (en min) ?", t, M(t) + ".")],
traps: [TR(r6(h / w), "L'avion part de l'altitude " + z0 + " m : retire-la d'abord."), TR(h - z0, "Divise encore par " + w + " (mètres par minute).")] }); },
() => { const A = rp(4), u0 = nz(-3, 3), u1 = nz(-3, 3), m = nz(-4, 4), t0 = pk([2, 3, -2]), Q = add(A, mul(t0, [u0, u1, m])); if (Math.abs(m) < 2) return null;
return QN("Pour quelle valeur de " + M("m") + " la droite " + M("d") + " : " + M("\\begin{cases} x = " + cmp(A[0], [u0], ["t"]) + " \\\\ y = " + cmp(A[1], [u1], ["t"]) + " \\\\ z = " + cmp(A[2], [1], ["mt"]) + " \\end{cases}") + " passe-t-elle par " + ptN("P", Q) + " ?", m, "Avec " + M("x") + " : " + M("t = " + t0) + " (même valeur avec " + M("y") + ") ; puis " + M(fT(Q[2]) + " = " + fT(A[2]) + " + " + t0 + "m") + ", donc " + M("m = " + m) + ".",
{ ctx: "parametre-direction", guide: [G(M("t") + " (avec x) ?", t0, M(t0) + "."), G(M("m") + " ?", m, M("\\frac{" + fT(Q[2]) + " - " + par(A[2]) + "}{" + t0 + "} = " + m) + ".")],
traps: [TR(Q[2] - A[2], "Divise encore par t = " + t0 + "."), TR(r6((Q[2] + A[2]) / t0), "On soustrait " + A[2] + " avant de diviser."), TR(-m, "Attention au signe.")] }); },
],
};


const PL = {
1: [
() => { const A = rp(4), u = rv(2), v = rv(2); if (isZ(cross(u, v))) return null; const s = pk([2, -1, 3, -2]), t = pk([2, 3, -2, -1]); if (s === t) return null; const Q = add(A, add(mul(s, u), mul(t, v)));
return QP("Le plan " + M("\\pi") + " a pour équations paramétriques " + eqPl(A, u, v) + ". Donne le point de " + M("\\pi") + " obtenu pour " + M("s = " + s) + " et " + M("t = " + t) + "." + TRIP, Q, "On remplace " + M("s") + " et " + M("t") + " : " + pt(Q) + ".",
{ ctx: "point-st", guide: [G(M("x") + " ?", Q[0], M(fT(Q[0])) + "."), G(M("y") + " ?", Q[1], M(fT(Q[1])) + "."), G(M("z") + " ?", Q[2], M(fT(Q[2])) + "."), GP("Point ?", Q, pt(Q) + ".")],
traps: [TP(add(A, add(mul(t, u), mul(s, v))), "s multiplie le premier vecteur directeur et t le second."), TP(add(mul(s, u), mul(t, v)), "N'oublie pas le point de départ.")] }); },
() => { const n = rv(4), x0 = R.int(-4, 4), y0 = R.int(-4, 4), m = nz(-5, 5); if (Math.abs(m) < 2) return null; const d = -(n[0] * x0 + n[1] * y0 + n[2] * m), K = n[0] * x0 + n[1] * y0 + d;
return QN("Le point " + M("P(" + fT(x0) + " \\,;\\, " + fT(y0) + " \\,;\\, m)") + " appartient au plan " + M("\\pi : " + plT(n, d)) + ". Que vaut " + M("m") + " ?", m, "On remplace : " + M(lt([n[0] * x0, n[1] * y0, d], ["", "", ""]) + " + " + co(n[2]) + "m = 0").replace("+ -", "- ") + ", soit " + M(lt([n[2], K], ["m", ""]) + " = 0") + ", donc " + M("m = " + m) + ".",
{ ctx: "point-plan-m", guide: [G("Somme des termes connus " + M(fT(n[0]) + " \\cdot " + par(x0) + " + " + fT(n[1]) + " \\cdot " + par(y0) + " + " + par(d)) + " ?", K, M(K) + "."), G(M("m") + " ?", m, M(lt([n[2]], ["m"]) + " = " + fT(-K)) + ", " + M("m = " + m) + ".")],
traps: [TR(-m, "Attention au signe : " + n[2] + "m = " + (-K) + "."), TR(-K, "Divise encore par " + n[2] + "."), TR(r6(K / n[2]), "On isole m : " + n[2] + "m = −(" + K + ").")] }); },
() => { const n = rv(4), k = R.int(0, 2), w = nz(-6, 6); if (Math.abs(w) < 2) return null; const d = -n[k] * w, Q = [0, 0, 0]; Q[k] = w; const ax = ["Ox", "Oy", "Oz"][k];
return QP("En quel point le plan " + M("\\pi : " + plT(n, d)) + " coupe-t-il l'axe " + M(ax) + " ?" + TRIP, Q, "Sur l'axe " + M(ax) + ", les deux autres coordonnées sont nulles : " + M(lt([n[k], d], [["x", "y", "z"][k], ""]) + " = 0") + ", d'où " + pt(Q) + ".",
{ ctx: "trace-axe", guide: [G("Coordonnée non nulle (" + M(["x", "y", "z"][k]) + ") ?", w, M(fT(w)) + "."), GP("Point ?", Q, pt(Q) + ".")],
traps: [TP(Q.map((x) => -x), "Attention au signe : " + n[k] + "·" + ["x", "y", "z"][k] + " = " + (-d) + "."), TP([0, 1, 2].map((i) => (i === (k + 1) % 3 ? w : 0)), "Sur l'axe " + ax + ", c'est la coordonnée " + ["x", "y", "z"][k] + " qui n'est pas nulle.")] }); },
],
2: [
() => { const n = rv(4), A = rp(4), d0 = nz(-6, 6), d = -dot(n, A); if (Math.abs(d) < 2 || d === d0) return null;
return QN("Le plan " + M("\\pi'") + " passe par " + ptN("A", A) + " et est parallèle au plan " + M("\\pi : " + plT(n, d0)) + ". Son équation s'écrit " + M(lt(n, ["x", "y", "z"]) + " + d = 0") + ". Que vaut " + M("d") + " ?", d, "Plans parallèles : même vecteur normal " + M(v3(n)) + ". " + M("A \\in \\pi'") + " : " + M("d = -(" + fT(n[0]) + " \\cdot " + par(A[0]) + " + " + fT(n[1]) + " \\cdot " + par(A[1]) + " + " + fT(n[2]) + " \\cdot " + par(A[2]) + ") = " + d) + ".",
{ ctx: "parallele", guide: [G(M("ax_A + by_A + cz_A") + " ?", -d, M(-d) + "."), G(M("d") + " ?", d, M(d) + ".")],
traps: [TR(-d, "d = −(a·x_A + b·y_A + c·z_A) : attention au signe."), TR(d0, "C'est le d de π ; π' passe par A.")] }); },
() => { const A = rp(3), u = rv(3), v = rv(3); if (u[0] * v[1] - u[1] * v[0] === 0) return null; const s0 = nz(-2, 2), t0 = nz(-2, 2), Q = add(A, add(mul(s0, u), mul(t0, v))); if (Math.abs(Q[2]) < 2) return null;
return QN("Le point " + M("P(" + fT(Q[0]) + " \\,;\\, " + fT(Q[1]) + " \\,;\\, m)") + " appartient au plan " + eqPl(A, u, v) + ". Que vaut " + M("m") + " ?", Q[2], "Les équations de " + M("x") + " et " + M("y") + " donnent " + M("s = " + s0) + " et " + M("t = " + t0) + " ; puis " + M("m = " + fT(Q[2])) + ".",
{ ctx: "param-appartenance", guide: [G(M("s") + " (système avec x et y) ?", s0, M(s0) + "."), G(M("t") + " ?", t0, M(t0) + "."), G(M("m") + " ?", Q[2], M(fT(Q[2])) + ".")],
traps: [TR(A[2] + t0 * u[2] + s0 * v[2], "s multiplie le premier vecteur directeur, t le second."), TR(s0 * u[2] + t0 * v[2], "N'oublie pas le terme constant " + A[2] + ".")] }); },
() => { const b = pk([1, -1, 2, -2]), p = nz(-3, 3), q = nz(-5, 5), c = nz(-4, 4), n = [b * p, b, c], d = b * q, ex = ltS([-p, -q], ["x", ""]);
return QX("La trace du plan " + M("\\pi : " + plT(n, d)) + " dans le plan " + M("xOy") + " (où " + M("z = 0") + ") est une droite. Donne son équation sous la forme " + M("y = mx + h") + " (tape l'expression de " + M("y") + ").", ex, "Avec " + M("z = 0") + " : " + M(plT([n[0], n[1], 0], d)) + ", donc " + M("y = " + lt([-p, -q], ["x", ""])) + ".",
{ ctx: "trace-plan", guide: [GX("Équation avec " + M("z = 0") + " : isole " + M(fT(b) + "y") + ". " + M(fT(b) + "y") + " = ?", ltS([-b * p, -b * q], ["x", ""]), M(fT(b) + "y = " + lt([-b * p, -b * q], ["x", ""])) + "."), GX(M("y") + " = ?", ex, M("y = " + lt([-p, -q], ["x", ""])) + ".")],
traps: [TX(ltS([p, q], ["x", ""]), "On fait passer les autres termes de l'autre côté : les signes changent."), TX(ltS([-b * p, -b * q], ["x", ""]), "Divise encore par " + b + "."), TX(ltS([-p, -q - c], ["x", ""]), "Dans le plan xOy, z = 0 : le terme en z disparaît.")] }); },
],
3: [
() => { const b = nz(-3, 3), c = pk([1, -1, 2, -2]), d = nz(-6, 6), n = [1, b, c], pts = [];
for (let i = 0; i < 40 && pts.length < 3; i++) { const x = R.int(-4, 4), y = R.int(-3, 3), z = r6(-(x + b * y + d) / c); if (Number.isInteger(z) && Math.abs(z) <= 9 && !pts.some((q) => q[0] === x && q[1] === y)) pts.push([x, y, z]); }
if (pts.length < 3 || isZ(cross(sub(pts[1], pts[0]), sub(pts[2], pts[0])))) return null; const [A, B, C] = pts;
return QP("Le plan passant par " + ptN("A", A) + ", " + ptN("B", B) + " et " + ptN("C", C) + " a une équation de la forme " + M("x + by + cz + d = 0") + ". Trouve " + M("b") + ", " + M("c") + " et " + M("d") + ". Réponds « b ; c ; d ».", [b, c, d], "Chaque point vérifie l'équation : trois équations en " + M("b, c, d") + ". Solution : " + M("\\pi : " + plT(n, d)) + ", donc " + M("b = " + b) + ", " + M("c = " + c) + ", " + M("d = " + d) + ".",
{ ctx: "trois-points", guide: [G(M("b") + " ?", b, M(b) + "."), G(M("c") + " ?", c, M(c) + "."), G(M("d") + " ?", d, M(d) + "."), GP("Réponse « b ; c ; d » ?", [b, c, d], M(b + " \\,;\\, " + c + " \\,;\\, " + d) + ".")],
traps: [TP([-b, -c, -d], "Le coefficient de x vaut 1 : vérifie les signes avec le point A."), TP([c, b, d], "b est le coefficient de y, c celui de z.")] }); },
() => { const u = rv(3), v = rv(3); let n = red(cross(u, v)); if (isZ(n) || !n[0] || n.some((x) => Math.abs(x) > 12)) return null; if (n[0] < 0) n = mul(-1, n); const A = rp(3), d = -dot(n, A);
return QP("Écris une équation cartésienne du plan " + M("\\pi") + " : " + eqPl(A, u, v) + " sous la forme " + M(lt([n[0]], ["x"]) + " + by + cz + d = 0") + ". Réponds « b ; c ; d ».", [n[1], n[2], d], "Un vecteur normal " + M("\\vec{n}") + " est orthogonal aux deux vecteurs directeurs " + M(v3(u)) + " et " + M(v3(v)) + " : " + M("\\vec{n} = " + v3(n)) + ". Avec " + ptN("A", A) + " : " + M("d = " + d) + ". " + M("\\pi : " + plT(n, d)) + ".",
{ ctx: "param-cartesienne", guide: [G("Vecteur normal " + M("\\begin{pmatrix} " + fT(n[0]) + " \\\\ b \\\\ c \\end{pmatrix}") + " orthogonal aux deux vecteurs directeurs (produits scalaires nuls). " + M("b") + " ?", n[1], M(n[1]) + "."), G(M("c") + " ?", n[2], M(n[2]) + "."), G(M("d = -(a x_A + b y_A + c z_A)") + " ?", d, M(d) + "."), GP("Réponse « b ; c ; d » ?", [n[1], n[2], d], M(n[1] + " \\,;\\, " + n[2] + " \\,;\\, " + d) + ".")],
traps: [TP([n[1], n[2], -d], "d = −(a·x_A + b·y_A + c·z_A) : attention au signe."), TP([-n[1], -n[2], d], "Vérifie : n · u = 0 et n · v = 0.")] }); },
() => { const p = pk([0.5, -0.5, 0.25, -0.25, 0.75]), q = pk([0.5, -0.5, 0.25, 0.75, -0.75]), r = R.int(6, 10), x1 = R.int(1, 4), y1 = R.int(1, 4), zf = (x, y) => r6(p * x + q * y + r), A = [x1, y1, zf(x1, y1)], B = [x1 + 4, y1, zf(x1 + 4, y1)], C = [x1, y1 + 4, zf(x1, y1 + 4)], X = R.int(5, 12), Y = R.int(5, 12), h = zf(X, Y);
const pD = (u) => M("(" + u.map(nb).join(" \\,;\\, ") + ")");
return QN("Un toit plat incliné passe par les points " + M("A") + pD(A) + ", " + M("B") + pD(B) + " et " + M("C") + pD(C) + " (coordonnées en m, " + M("z") + " = hauteur). Son équation s'écrit " + M("z = px + qy + r") + ". À quelle hauteur est le toit au-dessus du point " + M("(" + X + " \\,;\\, " + Y + " \\,;\\, 0)") + " ?", h, "De A à B, " + M("x") + " augmente de 4 : " + M("p = \\frac{" + nb(r6(B[2] - A[2])) + "}{4} = " + nb(p)) + " ; de A à C : " + M("q = " + nb(q)) + " ; avec A : " + M("r = " + r) + ". " + M("z = " + nb(p) + " \\cdot " + X + " + " + par(q).replace(/\\frac\{(\d+)\}\{(\d+)\}/, (m, a, b) => nb(r6(a / b))) + " \\cdot " + Y + " + " + r + " = " + nb(h)) + " m.",
{ ctx: "toit", guide: [G(M("p") + " (variation de " + M("z") + " de A à B, divisée par 4) ?", p, M(nb(p)) + "."), G(M("q") + " ?", q, M(nb(q)) + "."), G(M("r") + " ?", r, M(r) + "."), G("Hauteur au-dessus de " + M("(" + X + " \\,;\\, " + Y + ")") + " ?", h, M(nb(h)) + " m.")],
traps: [TR(r6(p * X + q * Y), "N'oublie pas la constante r = " + r + "."), TR(r6(q * X + p * Y + r), "p multiplie x et q multiplie y."), TR(r6(4 * p * X + 4 * q * Y + r), "p = variation de z ÷ 4 (pour 1 m en x).")] }); },
],
};


const PO = {
1: [
() => { const n = rv(4), Pp = rp(4), d = -dot(n, Pp), u = rv(3); if (!dot(n, u)) return null; const t0 = pk([2, -2, 3, -1]), A = sub(Pp, mul(t0, u));
return QP("Donne le point d'intersection de la droite " + M("d") + " : " + eqD(A, u) + " et du plan " + M("\\pi : " + plT(n, d)) + "." + TRIP, Pp, "On remplace " + M("x, y, z") + " dans l'équation du plan : équation du premier degré en " + M("t") + ", " + M("t = " + t0) + ". Point " + pt(Pp) + ".",
{ ctx: "droite-plan", guide: [G("Équation en " + M("t") + " obtenue en remplaçant dans " + M("\\pi") + ". " + M("t") + " = ?", t0, M(t0) + "."), GP("Point ?", Pp, pt(Pp) + ".")],
traps: [TP(A, "C'est le point de d pour t = 0 ; calcule t."), TP(sub(A, mul(t0, u)), "Attention au signe de t.")] }); },
() => { const b = pk([1, -1, 2, -2]), a = nz(-4, 4), c = nz(-4, 4), u0 = nz(-3, 3), u2 = nz(-3, 3), m = r6(-(a * u0 + c * u2) / b); if (!Number.isInteger(m) || Math.abs(m) < 2) return null; const n = [a, b, c], d = nz(-6, 6);
return QN("Pour quelle valeur de " + M("m") + " une droite de vecteur directeur " + M("\\vec{u} = \\begin{pmatrix} " + fT(u0) + " \\\\ m \\\\ " + fT(u2) + " \\end{pmatrix}") + " est-elle parallèle au plan " + M("\\pi : " + plT(n, d)) + " ?", m, "Parallèle au plan ⟺ " + M("\\vec{u}") + " orthogonal au vecteur normal " + M(v3(n)) + " : " + M(fT(a) + " \\cdot " + par(u0) + sgc(b, "m") + " + " + par(c) + " \\cdot " + par(u2) + " = 0") + ", donc " + M("m = " + m) + ".",
{ ctx: "parallele-m", guide: [G(M("a u_x + c u_z") + " ?", a * u0 + c * u2, M(a * u0 + c * u2) + "."), G(M("m") + " (avec " + M("\\vec{n} \\cdot \\vec{u} = 0") + ") ?", m, M(m) + ".")],
traps: [TR(-m, "Attention au signe : " + b + "m = " + (-(a * u0 + c * u2)) + "."), TR(a * u0 + c * u2, "Divise par le coefficient de y."), TR(r6(b * u0 / a), "Droite parallèle au plan : u orthogonal à n (pas colinéaire).")] }); },
() => { const n = rv(4), k = pk([2, 3, -2, -3]), d1 = nz(-6, 6), d2 = nz(-9, 9), m = k * n[1];
return QN("Pour quelle valeur de " + M("m") + " les plans " + M("\\pi_1 : " + plT(n, d1)) + " et " + M("\\pi_2 : " + lt([k * n[0]], ["x"]) + " + my" + (k * n[2] < 0 ? " - " : " + ") + fT(Math.abs(k * n[2])) + "z" + (d2 < 0 ? " - " : " + ") + fT(Math.abs(d2)) + " = 0") + " sont-ils parallèles ?", m, "Plans parallèles : vecteurs normaux colinéaires. " + M("\\frac{" + fT(k * n[0]) + "}{" + fT(n[0]) + "} = " + k) + ", donc " + M("m = " + k + " \\cdot " + par(n[1]) + " = " + m) + ".",
{ ctx: "plans-paralleles", guide: [G("Facteur entre les vecteurs normaux ?", k, M(k) + "."), G(M("m") + " ?", m, M(m) + ".")],
traps: [TR(n[1], "Les coefficients sont proportionnels : multiplie par " + k + "."), TR(r6(n[1] / k), "π₂ a les coefficients de π₁ multipliés par " + k + " : on multiplie."), TR(-m, "Attention au signe.")] }); },
],
2: [
() => { const Pp = rp(4), n1 = rv(3), n2 = rv(3); if (n1[0] * n2[1] - n1[1] * n2[0] === 0 || isZ(cross(n1, n2)) || Pp[0] === Pp[1] || !Pp[2]) return null; const d1 = -dot(n1, Pp), d2 = -dot(n2, Pp);
return QP("Les plans " + M("\\pi_1 : " + plT(n1, d1)) + " et " + M("\\pi_2 : " + plT(n2, d2)) + " se coupent selon une droite. Donne le point de cette droite dont la cote vaut " + M("z = " + Pp[2]) + "." + TRIP, Pp, "Avec " + M("z = " + Pp[2]) + ", on résout le système en " + M("x") + " et " + M("y") + " : " + M("x = " + Pp[0]) + ", " + M("y = " + Pp[1]) + ". Point " + pt(Pp) + ".",
{ ctx: "deux-plans", guide: [G(M("x") + " ?", Pp[0], M(Pp[0]) + "."), G(M("y") + " ?", Pp[1], M(Pp[1]) + "."), GP("Point ?", Pp, pt(Pp) + ".")],
traps: [TP([Pp[1], Pp[0], Pp[2]], "Dans l'ordre : x, puis y, puis z.")] }); },
() => { const n = rv(4), r = rv(2), u = red(cross(n, r)); if (isZ(u) || u.some((x) => Math.abs(x) > 9)) return null; const A = rp(4), d = -dot(n, A); if (Math.abs(d) < 2) return null;
return QN("La droite " + M("d") + " : " + eqD(A, u) + " est parallèle au plan " + M("\\pi : " + lt(n, ["x", "y", "z"]) + " + k = 0") + " (vérifie-le : " + M("\\vec{n} \\cdot \\vec{u} = 0") + "). Pour quelle valeur de " + M("k") + " la droite est-elle contenue dans le plan ?", d, "Il suffit qu'un point de " + M("d") + " soit dans " + M("\\pi") + " : avec " + ptN("A", A) + ", " + M("k = -(" + fT(n[0]) + " \\cdot " + par(A[0]) + " + " + fT(n[1]) + " \\cdot " + par(A[1]) + " + " + fT(n[2]) + " \\cdot " + par(A[2]) + ") = " + d) + ".",
{ ctx: "droite-contenue", guide: [GP("Point de " + M("d") + " pour " + M("t = 0") + " ?", A, pt(A) + "."), G(M("ax_A + by_A + cz_A") + " ?", -d, M(-d) + "."), G(M("k") + " ?", d, M(d) + ".")],
traps: [TR(-d, "k = −(a·x_A + b·y_A + c·z_A) : attention au signe."), TR(-dot(n, add(A, u)), "Le point de départ est celui obtenu pour t = 0.")] }); },
() => { const A = rp(3), u = rv(3), v = rv(3); if (u[0] * v[1] - u[1] * v[0] === 0) return null; const t0 = nz(-2, 2), s0 = nz(-2, 2), Pp = add(A, mul(t0, u)), B = sub(Pp, mul(s0, v)); if (Math.abs(B[2]) < 2) return null;
return QN("Pour quelle valeur de " + M("m") + " les droites " + M("d_1") + " : " + eqD(A, u) + " et " + M("d_2") + " : " + M("\\begin{cases} x = " + cmp(B[0], [v[0]], ["s"]) + " \\\\ y = " + cmp(B[1], [v[1]], ["s"]) + " \\\\ z = m" + (v[2] < 0 ? " - " : " + ") + (Math.abs(v[2]) === 1 ? "" : fT(Math.abs(v[2]))) + "s \\end{cases}") + " sont-elles sécantes ?", B[2], "Les équations de " + M("x") + " et " + M("y") + " donnent " + M("t = " + t0) + " et " + M("s = " + s0) + ". Les cotes doivent être égales : " + M(fT(Pp[2]) + " = m " + (v[2] * s0 < 0 ? "- " + fT(-v[2] * s0) : "+ " + fT(v[2] * s0))) + ", donc " + M("m = " + fT(B[2])) + ".",
{ ctx: "secantes-m", guide: [G(M("t") + " (système avec x et y) ?", t0, M(t0) + "."), G(M("s") + " ?", s0, M(s0) + "."), G(M("m") + " ?", B[2], M(fT(B[2])) + ".")],
traps: [TR(Pp[2], "C'est la cote du point d'intersection ; m = cette cote − (" + v[2] + ")·s."), TR(Pp[2] + v[2] * s0, "On retire " + v[2] + "·s (avec s = " + s0 + ").")] }); },
],
3: [
() => { const Pp = rp(3), ns = [rv(3), rv(3), rv(3)]; if (Math.abs(det3(...ns)) < 1e-9 || new Set(Pp).size < 3) return null; const ds = ns.map((n) => -dot(n, Pp));
return QP("Donne le point d'intersection des trois plans " + M("\\pi_1 : " + plT(ns[0], ds[0])) + ", " + M("\\pi_2 : " + plT(ns[1], ds[1])) + " et " + M("\\pi_3 : " + plT(ns[2], ds[2])) + "." + TRIP, Pp, "Système de trois équations à trois inconnues (substitution ou combinaisons) : " + pt(Pp) + ".",
{ ctx: "trois-plans", guide: [G(M("x") + " ?", Pp[0], M(Pp[0]) + "."), G(M("y") + " ?", Pp[1], M(Pp[1]) + "."), G(M("z") + " ?", Pp[2], M(Pp[2]) + "."), GP("Point ?", Pp, pt(Pp) + ".")],
traps: [TP(mul(-1, Pp), "Vérifie dans π₁ : attention aux signes."), TP([Pp[2], Pp[1], Pp[0]], "Dans l'ordre : x, y, z.")] }); },
() => { const n = rv(3), Pp = rp(3), d = -dot(n, Pp), u = rv(3); if (!dot(n, u)) return null; const t0 = pk([2, 3, -1, -2]), A = sub(Pp, mul(t0, u)), B = add(A, u);
return QP("La droite " + M("(AB)") + ", avec " + ptN("A", A) + " et " + ptN("B", B) + ", perce le plan " + M("\\pi : " + plT(n, d)) + " en un point " + M("I") + ". Donne ses coordonnées." + TRIP, Pp, M("(AB) : A + t\\," + vec("AB")) + " avec " + M(vec("AB") + " = " + v3(u)) + " ; dans " + M("\\pi") + " : " + M("t = " + t0) + " ; " + M("I") + pt(Pp) + ".",
{ ctx: "droite-AB-plan", guide: [GP(M(vec("AB")) + " ?", u, M(v3(u)) + "."), G(M("t") + " (on remplace " + M("A + t\\," + vec("AB")) + " dans " + M("\\pi") + ") ?", t0, M(t0) + "."), GP("Point " + M("I") + " ?", Pp, pt(Pp) + ".")],
traps: [TP(add(B, mul(t0, u)), "Avec A + t·AB, on part de A, pas de B."), TP(sub(A, mul(t0, u)), "Attention au signe de t.")] }); },
() => { const [h, t] = pk([[6, 2], [6, 3], [8, 2], [12, 2], [12, 3], [9, 3], [10, 2]]), pz = r6(h * (t - 1) / t), S = [R.int(-3, 3), R.int(-3, 3), h], Pz = [S[0] + nz(-4, 4), S[1] + nz(-4, 4), pz], O = add(S, mul(t, sub(Pz, S)));
return QP("Une lampe ponctuelle est en " + ptN("S", S) + " ; le sommet d'un poteau vertical est en " + ptN("P", Pz) + " (en m). Où se trouve l'ombre de " + M("P") + " sur le sol (plan " + M("z = 0") + ") ?" + TRIP, O, "L'ombre est sur la droite " + M("(SP)") + " : " + M("S + t\\," + vec("SP")) + " avec " + M(vec("SP") + " = " + v3(sub(Pz, S))) + ". " + M("z = 0") + " donne " + M("t = " + t) + " : ombre en " + pt(O) + ".",
{ ctx: "ombre", guide: [GP(M(vec("SP")) + " ?", sub(Pz, S), M(v3(sub(Pz, S))) + "."), G(M("t") + " tel que " + M("z = 0") + " ?", t, M(fT(h) + " " + (pz - h < 0 ? "- " + fT(h - pz) : "+ " + fT(pz - h)) + "t = 0") + ", " + M("t = " + t) + "."), GP("Ombre ?", O, pt(O) + ".")],
traps: [TP([Pz[0], Pz[1], 0], "L'ombre n'est pas au pied du poteau : prolonge la droite SP jusqu'au sol."), TP([S[0], S[1], 0], "C'est le point du sol sous la lampe."), TP(add(S, mul(2 * t, sub(Pz, S))).map((x, i) => (i === 2 ? 0 : x)), "Calcule t avec la cote : z = 0.")] }); },
],
};


const PS = {
1: [
() => { const u = rv(5), v = rv(5), p = dot(u, v); if (Math.abs(p) < 2) return null;
return QN("Calcule le produit scalaire " + M("\\vec{u} \\cdot \\vec{v}") + " avec " + vN("u", u) + " et " + vN("v", v) + ".", p, M("\\vec{u} \\cdot \\vec{v} = " + u.map((x, i) => par(x) + " \\cdot " + par(v[i])).join(" + ") + " = " + p) + ".",
{ ctx: "calcul", guide: [G("Somme des deux premiers produits " + M("u_x v_x + u_y v_y") + " ?", u[0] * v[0] + u[1] * v[1], M(u[0] * v[0] + u[1] * v[1]) + "."), G("Avec " + M("u_z v_z") + " ?", p, M(p) + ".")],
traps: [TR(u[0] * v[0] + u[1] * v[1], "Il y a trois produits dans l'espace : n'oublie pas z."), TR(u[0] * v[0] + u[1] * v[1] - u[2] * v[2], "On additionne les trois produits."), TR(u[0] + u[1] + u[2] + v[0] + v[1] + v[2], "On multiplie composante par composante, puis on additionne.")] }); },
() => { const u = [nz(-4, 4), pk([1, -1, 2, -2]), nz(-4, 4)], v0 = nz(-4, 4), v2 = nz(-4, 4), m = r6(-(u[0] * v0 + u[2] * v2) / u[1]); if (!Number.isInteger(m) || Math.abs(m) < 2) return null;
return QN("Pour quelle valeur de " + M("m") + " les vecteurs " + vN("u", u) + " et " + M("\\vec{v} = \\begin{pmatrix} " + fT(v0) + " \\\\ m \\\\ " + fT(v2) + " \\end{pmatrix}") + " sont-ils orthogonaux ?", m, "Orthogonaux ⟺ " + M("\\vec{u} \\cdot \\vec{v} = 0") + " : " + M(par(u[0]) + " \\cdot " + par(v0) + sgc(u[1], "m") + " + " + par(u[2]) + " \\cdot " + par(v2) + " = 0") + ", donc " + M("m = " + m) + ".",
{ ctx: "orthogonal-m", guide: [G(M("u_x v_x + u_z v_z") + " ?", u[0] * v0 + u[2] * v2, M(u[0] * v0 + u[2] * v2) + "."), G(M("m") + " ?", m, M(m) + ".")],
traps: [TR(-m, "Attention au signe : " + u[1] + "m = " + (-(u[0] * v0 + u[2] * v2)) + "."), TR(u[0] * v0 + u[2] * v2, "Divise par " + u[1] + " (et change de côté).")] }); },
() => { const u = rv(3), v = rv(3), c = dot(u, v) / (nrm(u) * nrm(v)); if (Math.abs(c) > 0.999 || Math.abs(c) < 1e-9) return null; const a = angle(u, v);
return QR("Calcule l'angle entre les vecteurs " + vN("u", u) + " et " + vN("v", v) + " (en degrés, arrondi au dixième).", a, 0.1, M("\\cos\\alpha = \\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{u}\\| \\, \\|\\vec{v}\\|} = \\frac{" + dot(u, v) + "}{\\sqrt{" + nn2(u) + "} \\cdot \\sqrt{" + nn2(v) + "}}") + ", " + M("\\alpha \\approx " + D(a, 0.1) + "°") + ".",
{ ctx: "angle", guide: [G(M("\\vec{u} \\cdot \\vec{v}") + " ?", dot(u, v), M(dot(u, v)) + "."), G(M("\\cos\\alpha") + " (au millième) ?", c, M(D(c, 0.001)) + ".", 0.001), G(M("\\alpha") + " (au dixième de degré) ?", a, M(D(a, 0.1) + "°") + ".", 0.1)],
traps: [TR(180 - a, "L'angle de deux vecteurs est entre 0° et 180° : garde le signe du produit scalaire."), TR(Math.acos(c), "Donne l'angle en degrés, pas en radians."), TR(DEG * Math.acos(Math.max(-1, Math.min(1, dot(u, v) / (nn2(u) * nn2(v))))), "On divise par le produit des normes (avec les racines).")] }); },
],
2: [
() => { const A = rp(4), B = rp(4), C = rp(4), u = sub(B, A), v = sub(C, A); if (isZ(cross(u, v))) return null; const a = angle(u, v);
return QR("Calcule l'angle " + M("\\widehat{BAC}") + " du triangle de sommets " + ptN("A", A) + ", " + ptN("B", B) + ", " + ptN("C", C) + " (en degrés, au dixième).", a, 0.1, M(vec("AB") + " = " + v3(u)) + ", " + M(vec("AC") + " = " + v3(v)) + " ; " + M("\\cos\\widehat{BAC} = \\frac{" + dot(u, v) + "}{\\sqrt{" + nn2(u) + "} \\cdot \\sqrt{" + nn2(v) + "}}") + ", " + M("\\widehat{BAC} \\approx " + D(a, 0.1) + "°") + ".",
{ ctx: "angle-triangle", guide: [GP(M(vec("AB")) + " ?", u, M(v3(u)) + "."), GP(M(vec("AC")) + " ?", v, M(v3(v)) + "."), G(M(vec("AB") + " \\cdot " + vec("AC")) + " ?", dot(u, v), M(dot(u, v)) + "."), G("Angle (au dixième) ?", a, M(D(a, 0.1) + "°") + ".", 0.1)],
traps: [TR(180 - a, "Les deux vecteurs partent de A : AB et AC (pas BA)."), TR(angle(sub(A, B), sub(C, B)), "C'est l'angle en B ; on demande l'angle en A.")] }); },
() => { const [u, d] = qv(4), v = rv(5), p = dot(u, v); if (!p || den(Math.abs(p) / d) === 1 && Math.abs(p) / d < 2) return null; const L = Math.abs(p) / d;
return QN("Calcule la longueur de la projection orthogonale du vecteur " + vN("v", v) + " sur la direction de " + vN("u", u) + " (fractions acceptées).", L, "Longueur " + M("\\frac{|\\vec{u} \\cdot \\vec{v}|}{\\|\\vec{u}\\|} = " + frT(Math.abs(p), d)) + ".",
{ ctx: "projection-longueur", guide: [G(M("\\vec{u} \\cdot \\vec{v}") + " ?", p, M(p) + "."), G(M("\\|\\vec{u}\\|") + " ?", d, M("\\sqrt{" + d * d + "} = " + d) + "."), G("Longueur de la projection ?", L, M(fT(L)) + ".")],
traps: [TR(Math.abs(p) / (d * d), "On divise par ‖u‖, pas par ‖u‖² (‖u‖² sert pour le vecteur projeté)."), TR(Math.abs(p), "Divise par la norme de u.")] }); },
() => { const A = rp(3), p = [nz(-3, 3), nz(-3, 3), pk([1, -1, 2, -2])], c0 = nz(-3, 3), c1 = nz(-3, 3), w2 = r6(-(p[0] * c0 + p[1] * c1) / p[2]); if (!Number.isInteger(w2)) return null; const B = add(A, p), C = [A[0] + c0, A[1] + c1, A[2] + w2]; if (Math.abs(C[2]) < 2) return null;

return QN("Pour quelle valeur de " + M("m") + " le triangle de sommets " + ptN("A", A) + ", " + ptN("B", B) + " et " + M("C(" + fT(C[0]) + " \\,;\\, " + fT(C[1]) + " \\,;\\, m)") + " est-il rectangle en " + M("A") + " ?", C[2], "Rectangle en A ⟺ " + M(vec("AB") + " \\cdot " + vec("AC") + " = 0") + " avec " + M(vec("AC") + " = \\begin{pmatrix} " + fT(c0) + " \\\\ " + fT(c1) + " \\\\ m" + (A[2] ? sg(-A[2]) : "") + " \\end{pmatrix}") + " : " + M(par(p[0]) + (c0 < 0 ? par(c0) : " \\cdot " + fT(c0)) + " + " + par(p[1]) + (c1 < 0 ? par(c1) : " \\cdot " + fT(c1)) + " + " + par(p[2]) + "(m" + (A[2] ? sg(-A[2]) : "") + ") = 0") + ", donc " + M("m = " + fT(C[2])) + ".",
{ ctx: "rectangle-m", guide: [GP(M(vec("AB")) + " ?", p, M(v3(p)) + "."), G("Somme des deux premiers produits de " + M(vec("AB") + " \\cdot " + vec("AC")) + " ?", p[0] * c0 + p[1] * c1, M(p[0] * c0 + p[1] * c1) + "."), G(M("m") + " ?", C[2], M(fT(C[2])) + ".")],
traps: [TR(w2, "C'est la troisième composante de AC ; m = z_A + (AC)_z."), TR(A[2] - w2, "Attention au signe."), TR(r6(-(p[0] * C[0] + p[1] * C[1]) / p[2]), "Utilise les composantes du vecteur AC, pas les coordonnées de C.")] }); },
],
3: [
() => { const base = pk([[1, 2, 2], [1, 1, 1], [2, 1, 2], [1, 1, 2], [1, 2, 3]]), u = perm(base).map((x) => x * sgn()), v = rv(4), k = dot(u, v) / nn2(u); if (!k || den(k) > 3) return null; const w = mul(k, u);
return QP("Donne le projeté orthogonal du vecteur " + vN("v", v) + " sur la droite dirigée par " + vN("u", u) + " (le vecteur projeté)." + TRIP + " (fractions acceptées)", w, "Vecteur projeté " + M("\\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{u}\\|^2}\\,\\vec{u} = \\frac{" + dot(u, v) + "}{" + nn2(u) + "}\\,\\vec{u} = " + v3(w)) + ".",
{ ctx: "projection-vecteur", guide: [G(M("\\vec{u} \\cdot \\vec{v}") + " ?", dot(u, v), M(dot(u, v)) + "."), G(M("\\|\\vec{u}\\|^2") + " ?", nn2(u), M(nn2(u)) + "."), G("Coefficient " + M("\\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{u}\\|^2}") + " ?", k, M(fT(k)) + "."), GP("Vecteur projeté ?", w, M(v3(w)) + ".")],
traps: [TP(mul(dot(u, v), u), "Divise par ‖u‖² = " + nn2(u) + "."), TP(mul(-k, u), "Attention au signe du produit scalaire."), TP(mul(k, v), "Le vecteur projeté est colinéaire à u (on multiplie u, pas v).")] }); },
() => { const { u, w, n } = orth(2), A = rp(3), t0 = pk([1, -1, 2]), H = add(A, mul(t0, u)), Pp = add(H, w), AP = sub(Pp, A);
return QP("Donne le projeté orthogonal " + M("H") + " du point " + ptN("P", Pp) + " sur la droite " + M("d") + " : " + eqD(A, u) + "." + TRIP, H, M("H = A + t\\,\\vec{u}") + " avec " + M("t = \\frac{" + vec("AP") + " \\cdot \\vec{u}}{\\|\\vec{u}\\|^2} = \\frac{" + dot(AP, u) + "}{" + n * n + "} = " + t0) + " : " + M("H") + pt(H) + ".",
{ ctx: "pied-droite", guide: [GP(M(vec("AP")) + " ?", AP, M(v3(AP)) + "."), G(M(vec("AP") + " \\cdot \\vec{u}") + " ?", dot(AP, u), M(dot(AP, u)) + "."), G(M("t = \\frac{" + vec("AP") + " \\cdot \\vec{u}}{\\|\\vec{u}\\|^2}") + " ?", t0, M(t0) + "."), GP("Point " + M("H") + " ?", H, pt(H) + ".")],
traps: [TP(add(A, mul(t0 * n, u)), "Divise par ‖u‖² = " + n * n + " (pas par ‖u‖)."), TP(A, "C'est le point de d pour t = 0."), TP(add(A, mul(dot(AP, u), u)), "t = (AP · u) ÷ ‖u‖².")] }); },
() => { const L = R.int(2, 9), l = R.int(2, 9), h = R.int(2, 9); if (L === l || l === h || L === h) return null; const kind = pk(["arete", "base", "face"]), g = [L, l, h], o = kind === "arete" ? [L, 0, 0] : kind === "base" ? [L, l, 0] : [0, l, h], a = angle(g, o);
const nom = kind === "arete" ? "l'arête " + M("[AB]") : kind === "base" ? "la diagonale " + M("[AC]") + " de la base" : "la diagonale " + M("[AH]") + " de la face " + M("ADHE");
const oT = kind === "arete" ? vec("AB") : kind === "base" ? vec("AC") : vec("AH");
return QR("Un pavé droit " + M("ABCDEFGH") + " a pour dimensions " + M("AB = " + L) + ", " + M("AD = " + l) + " et " + M("AE = " + h) + ". Dans le repère d'origine " + M("A") + " (axes selon " + M("[AB]") + ", " + M("[AD]") + ", " + M("[AE]") + "), " + M("G") + pt(g) + ". Calcule l'angle entre la diagonale " + M("[AG]") + " et " + nom + " (en degrés, au dixième).", a, 0.1,
M(vec("AG") + " = " + v3(g)) + ", " + M(oT + " = " + v3(o)) + " ; " + M("\\cos\\alpha = \\frac{" + dot(g, o) + "}{\\sqrt{" + nn2(g) + "} \\cdot \\sqrt{" + nn2(o) + "}}") + ", " + M("\\alpha \\approx " + D(a, 0.1) + "°") + ".",
{ ctx: "pave-" + kind, guide: [GP("Composantes de " + M(oT) + " ?", o, M(v3(o)) + "."), G(M(vec("AG") + " \\cdot " + oT) + " ?", dot(g, o), M(dot(g, o)) + "."), G("Angle (au dixième) ?", a, M(D(a, 0.1) + "°") + ".", 0.1)],
traps: [TR(90 - a, "C'est le complémentaire : vérifie avec cos α = (AG · v) ÷ (‖AG‖ ‖v‖)."), TR(DEG * Math.acos(dot(g, o) / nn2(g)), "Divise par le produit des deux normes.")] }); },
],
};


const DI = {
1: [
() => { const [n, nn] = qv(5), Pp = rp(4), m = R.int(2, 3 * nn); if (m % nn === 0 && m / nn < 2) return null; const s = sgn(), d = s * m - dot(n, Pp), L = m / nn;
return QN("Calcule la distance du point " + ptN("P", Pp) + " au plan " + M("\\pi : " + plT(n, d)) + " (fractions acceptées).", L, M("\\delta = \\frac{|" + fT(n[0]) + " \\cdot " + par(Pp[0]) + " + " + fT(n[1]) + " \\cdot " + par(Pp[1]) + " + " + fT(n[2]) + " \\cdot " + par(Pp[2]) + " + " + par(d) + "|}{\\sqrt{" + nn * nn + "}} = " + frT(m, nn)) + ".",
{ ctx: "point-plan", guide: [G("On remplace " + M("P") + " dans le membre de gauche : " + M("ax_P + by_P + cz_P + d") + " = ?", s * m, M(s * m) + "."), G("Norme du vecteur normal ?", nn, M("\\sqrt{" + nn * nn + "} = " + nn) + "."), G("Distance ?", L, M(fT(L)) + ".")],
traps: [TR(m, "Divise par la norme du vecteur normal."), TR(m / (nn * nn), "On divise par ‖n‖, pas par ‖n‖²."), TR(-L, "Une distance est positive : valeur absolue.")] }); },
() => { const [n, nn] = qv(5), d1 = nz(-9, 9), m = R.int(2, 2 * nn), d2 = d1 + m * sgn(), L = m / nn; if (m % nn === 0 && L < 2) return null;
return QN("Calcule la distance entre les plans parallèles " + M("\\pi_1 : " + plT(n, d1)) + " et " + M("\\pi_2 : " + plT(n, d2)) + " (fractions acceptées).", L, "Même vecteur normal " + M(v3(n)) + " de norme " + M(nn) + " : " + M("\\delta = \\frac{|" + fT(d1) + " - " + par(d2) + "|}{" + nn + "} = " + fT(L)) + ".",
{ ctx: "plans-paralleles", guide: [G(M("|d_1 - d_2|") + " ?", m, M(m) + "."), G(M("\\|\\vec{n}\\|") + " ?", nn, M(nn) + "."), G("Distance ?", L, M(fT(L)) + ".")],
traps: [TR(Math.abs(d1 + d2) / nn, "On soustrait d₁ − d₂ (même vecteur normal)."), TR(m, "Divise par la norme du vecteur normal.")] }); },
() => { const { u, w, n } = orth(), k1 = n > 3 ? 1 : pk([1, 2]), k2 = n > 3 ? 1 : pk([1, 2]), A = rp(3), B = add(A, mul(k1, u)), C = add(A, mul(k2, w)), S = (k1 * k2 * n * n) / 2;
return QN("Le triangle de sommets " + ptN("A", A) + ", " + ptN("B", B) + " et " + ptN("C", C) + " est rectangle en " + M("A") + " (vérifie-le : " + M(vec("AB") + " \\cdot " + vec("AC") + " = 0") + "). Calcule son aire.", S, M("AB = \\sqrt{" + k1 * k1 * n * n + "} = " + k1 * n) + ", " + M("AC = " + k2 * n) + " ; aire " + M("\\frac{" + k1 * n + " \\cdot " + k2 * n + "}{2} = " + fT(S)) + ".",
{ ctx: "aire-rectangle", guide: [G(M(vec("AB") + " \\cdot " + vec("AC")) + " ?", 0, M("0") + " : rectangle en A."), G(M("AB") + " ?", k1 * n, M(k1 * n) + "."), G(M("AC") + " ?", k2 * n, M(k2 * n) + "."), G("Aire ?", S, M(fT(S)) + ".")],
traps: [TR(2 * S, "Aire d'un triangle rectangle : produit des côtés de l'angle droit ÷ 2."), TR((k1 + k2) * n, "L'aire est un produit (÷ 2), pas une somme.")] }); },
],
2: [
() => { const { u, w, n } = orth(2), k = pk([1, 2]), A = rp(3), t0 = pk([1, -1, 2, -2]), H = add(A, mul(t0, u)), Pp = add(H, mul(k, w)), AP = sub(Pp, A);
return QN("Calcule la distance du point " + ptN("P", Pp) + " à la droite " + M("d") + " : " + eqD(A, u) + ".", k * n, "Pied de la perpendiculaire : " + M("H = A + t\\,\\vec{u}") + " avec " + M("t = \\frac{" + vec("AP") + " \\cdot \\vec{u}}{\\|\\vec{u}\\|^2} = " + t0) + ", " + M("H") + pt(H) + " ; " + M("PH = \\sqrt{" + k * k * n * n + "} = " + k * n) + ".",
{ ctx: "point-droite", guide: [GP(M(vec("AP")) + " ?", AP, M(v3(AP)) + "."), G(M("t = \\frac{" + vec("AP") + " \\cdot \\vec{u}}{\\|\\vec{u}\\|^2}") + " ?", t0, M(t0) + "."), GP("Pied " + M("H") + " ?", H, pt(H) + "."), G("Distance " + M("PH") + " ?", k * n, M(k * n) + ".")],
traps: [TR(nrm(AP), "C'est la distance AP ; la distance à la droite se mesure perpendiculairement (pied H)."), TR(k * k * n * n, "N'oublie pas la racine carrée.")] }); },
() => { const A = rp(3), u = rv(3), v = rv(3); if (isZ(cross(u, v)) || !dot(u, v)) return null; const S = 0.5 * Math.sqrt(nn2(u) * nn2(v) - dot(u, v) ** 2), B = add(A, u), C = add(A, v);
return QR("Calcule l'aire du triangle de sommets " + ptN("A", A) + ", " + ptN("B", B) + " et " + ptN("C", C) + " (arrondie au centième). Utilise " + M("\\mathcal{A} = \\frac{1}{2}\\sqrt{AB^2 \\cdot AC^2 - (" + vec("AB") + " \\cdot " + vec("AC") + ")^2}") + ".", S, 0.01, M("AB^2 = " + nn2(u)) + ", " + M("AC^2 = " + nn2(v)) + ", " + M(vec("AB") + " \\cdot " + vec("AC") + " = " + dot(u, v)) + " ; " + M("\\mathcal{A} = \\frac{1}{2}\\sqrt{" + nn2(u) * nn2(v) + " - " + dot(u, v) ** 2 + "} \\approx " + D(S, 0.01)) + ".",
{ ctx: "aire-formule", guide: [G(M("AB^2") + " ?", nn2(u), M(nn2(u)) + "."), G(M("AC^2") + " ?", nn2(v), M(nn2(v)) + "."), G(M(vec("AB") + " \\cdot " + vec("AC")) + " ?", dot(u, v), M(dot(u, v)) + "."), G("Aire (au centième) ?", S, M(D(S, 0.01)) + ".", 0.01)],
traps: [TR(0.5 * nrm(u) * nrm(v), "½·AB·AC n'est l'aire que si le triangle est rectangle en A."), TR(2 * S, "N'oublie pas le facteur ½."), TR(0.5 * Math.sqrt(nn2(u) * nn2(v) + dot(u, v) ** 2), "On soustrait le carré du produit scalaire.")] }); },
() => { const [n, nn] = qv(5), r = rv(2), u = red(cross(n, r)); if (isZ(u) || u.some((x) => Math.abs(x) > 9)) return null; const A = rp(3), m = R.int(2, 3 * nn); if (m % nn === 0 && m / nn < 2) return null; const s = sgn(), d = s * m - dot(n, A), L = m / nn;
return QN("La droite " + M("d") + " : " + eqD(A, u) + " est parallèle au plan " + M("\\pi : " + plT(n, d)) + ". Calcule la distance entre " + M("d") + " et " + M("\\pi") + " (fractions acceptées).", L, M("\\vec{n} \\cdot \\vec{u} = 0") + " : tous les points de " + M("d") + " sont à la même distance de " + M("\\pi") + ". Avec " + ptN("A", A) + " : " + M("\\delta = " + frT(m, nn)) + ".",
{ ctx: "droite-plan", guide: [G(M("\\vec{n} \\cdot \\vec{u}") + " ?", 0, M("0") + " : la droite est parallèle au plan."), G("On remplace " + M("A") + " (point de " + M("d") + ") dans le membre de gauche de " + M("\\pi") + " : valeur ?", s * m, M(s * m) + "."), G("Distance ?", L, M(fT(L)) + ".")],
traps: [TR(m, "Divise par la norme du vecteur normal (" + nn + ")."), TR(Math.abs(dot(n, A)) / nn, "Remplace les coordonnées de A dans tout le membre de gauche, d compris.")] }); },
],
3: [
() => { const [n, nn] = qv(5), T = rp(3), m = R.int(2, 3 * nn), s = sgn(), d = s * m - dot(n, T), S = 3 * R.int(2, 9), h = m / nn, V = (S * h) / 3;
return QN("La base d'une pyramide est un triangle du plan " + M("\\pi : " + plT(n, d)) + ", d'aire " + M(S) + ". Son sommet est " + ptN("T", T) + ". Calcule le volume de la pyramide (fractions acceptées).", V, "Hauteur = distance de " + M("T") + " à " + M("\\pi") + " : " + M("h = " + frT(m, nn)) + " ; " + M("V = \\frac{1}{3} \\cdot " + S + " \\cdot " + fT(h) + " = " + fT(V)) + ".",
{ ctx: "pyramide", guide: [G("Hauteur " + M("h") + " (distance de " + M("T") + " au plan) ?", h, M(fT(h)) + "."), G("Volume ?", V, M(fT(V)) + ".")],
traps: [TR(S * h, "Volume d'une pyramide : base × hauteur ÷ 3."), TR((S * h) / 2, "Pyramide : on divise par 3."), TR((S * m) / 3, "La hauteur est m ÷ ‖n‖ = " + m + " ÷ " + nn + ".")] }); },
() => { const [q0, nn] = qv(4); const iz = q0.findIndex((x) => Math.abs(x) <= 2); if (iz < 0) return null; const n = q0.slice(); [n[iz], n[2]] = [n[2], n[iz]]; const Dd = R.int(1, 3), m1 = R.int(-4, 4), m2 = r6(m1 - (2 * Dd * nn) / n[2]); if (!Number.isInteger(m2)) return null; const K = Dd * nn - n[2] * m1, p0 = R.int(-3, 3), p1 = R.int(-3, 3), d = K - n[0] * p0 - n[1] * p1;
return QSet("Pour quelles valeurs de " + M("m") + " le point " + M("P(" + fT(p0) + " \\,;\\, " + fT(p1) + " \\,;\\, m)") + " est-il à la distance " + M(Dd) + " du plan " + M("\\pi : " + plT(n, d)) + " ? Sépare les valeurs par « ; ».", [m1, m2], M("\\frac{|" + lt([n[2], K], ["m", ""]) + "|}{" + nn + "} = " + Dd) + ", donc " + M(lt([n[2], K], ["m", ""]) + " = \\pm " + Dd * nn) + " : " + M("m = " + m1) + " ou " + M("m = " + m2) + ".",
{ ctx: "distance-donnee", guide: [G(M("\\|\\vec{n}\\|") + " ?", nn, M(nn) + "."), G("Valeur absolue du numérateur : " + M("|" + lt([n[2], K], ["m", ""]) + "|") + " = ?", Dd * nn, M(Dd + " \\cdot " + nn + " = " + Dd * nn) + "."), GSet("Valeurs de " + M("m") + " ?", [m1, m2], M("m = " + m1) + " ou " + M("m = " + m2) + ".")],
traps: [TSt([m1], "Valeur absolue : deux cas, + et −."), TSt([r6((Dd - K) / n[2]), r6((-Dd - K) / n[2])], "Multiplie d'abord la distance par ‖n‖ = " + nn + ".")] }); },
() => { const { u, w, n } = orth(2), s = pk([2, 3]), t0 = R.int(1, s - 1), k = pk([1, 2]), A = [R.int(-3, 3), R.int(-3, 3), R.int(5, 9)], B = add(A, mul(s, u)), Pp = add(add(A, mul(t0, u)), mul(k, w)), AB = sub(B, A), AP = sub(Pp, A), t = t0 / s;
return QN("Un câble tendu relie " + ptN("A", A) + " et " + ptN("B", B) + " (en m). Un drone est en " + ptN("P", Pp) + ". À quelle distance minimale du câble se trouve-t-il ?", k * n, "Pied " + M("H = A + t\\," + vec("AB")) + " avec " + M("t = \\frac{" + vec("AP") + " \\cdot " + vec("AB") + "}{AB^2} = \\frac{" + dot(AP, AB) + "}{" + nn2(AB) + "} = " + fT(t)) + " (entre A et B) ; " + M("PH = " + k * n) + " m.",
{ ctx: "cable", guide: [GP(M(vec("AB")) + " ?", AB, M(v3(AB)) + "."), GP(M(vec("AP")) + " ?", AP, M(v3(AP)) + "."), G(M("t = \\frac{" + vec("AP") + " \\cdot " + vec("AB") + "}{AB^2}") + " ?", t, M(fT(t)) + "."), G("Distance " + M("PH") + " ?", k * n, M(k * n) + " m.")],
traps: [TR(nrm(AP), "C'est la distance PA ; la plus courte se mesure perpendiculairement au câble."), TR(Math.min(nrm(AP), nrm(sub(Pp, B))), "La distance au câble n'est pas la distance à une extrémité."), TR(k * k * n * n, "N'oublie pas la racine carrée.")] }); },
],
};


const SP = {
1: [
() => { const n = rv(4), A = rp(4), d = -dot(n, A); if (Math.abs(d) < 2) return null;
return QN("Le plan " + M("\\pi") + " passe par " + ptN("A", A) + " et admet " + vN("n", n) + " comme vecteur normal. Son équation s'écrit " + M(lt(n, ["x", "y", "z"]) + " + d = 0") + ". Que vaut " + M("d") + " ?", d, M("A \\in \\pi") + " : " + M(fT(n[0]) + " \\cdot " + par(A[0]) + " + " + fT(n[1]) + " \\cdot " + par(A[1]) + " + " + fT(n[2]) + " \\cdot " + par(A[2]) + " + d = 0") + ", donc " + M("d = " + d) + ".",
{ ctx: "plan-normal", guide: [G(M("\\vec{n} \\cdot \\overrightarrow{OA} = ax_A + by_A + cz_A") + " ?", -d, M(-d) + "."), G(M("d") + " ?", d, M(d) + ".")],
traps: [TR(-d, "d = −(a·x_A + b·y_A + c·z_A) : attention au signe."), TR(-(A[0] + A[1] + A[2]), "Multiplie chaque coordonnée de A par le coefficient correspondant.")] }); },
() => { const C = rv(5), r2 = pk([4, 9, 16, 25, 7, 10, 12, 20]);
return QP("Donne le centre de la sphère " + M(sphT(C, r2)) + "." + TRIP, C, "La sphère de centre " + M("(a \\,;\\, b \\,;\\, c)") + " et de rayon " + M("r") + " a pour équation " + M("(x - a)^2 + (y - b)^2 + (z - c)^2 = r^2") + " : centre " + pt(C) + ".",
{ ctx: "sphere-centre", guide: [G(M("a") + " (dans " + M(sq("x", C[0])) + ") ?", C[0], M(C[0]) + "."), G(M("b") + " ?", C[1], M(C[1]) + "."), G(M("c") + " ?", C[2], M(C[2]) + "."), GP("Centre ?", C, pt(C) + ".")],
traps: [TP(mul(-1, C), "(x − a)² : le centre a pour abscisse a ; « x + 2 » donne a = −2.")] }); },
() => { const C = rp(4), [p, d] = qv(), A = add(C, p);
return QN("Calcule le rayon de la sphère de centre " + ptN("C", C) + " qui passe par " + ptN("A", A) + ".", d, M("r = CA = \\sqrt{" + p.map((x) => par(x) + "^2").join(" + ") + "} = \\sqrt{" + d * d + "} = " + d) + ".",
{ ctx: "rayon-point", guide: [GP(M(vec("CA")) + " ?", p, M(v3(p)) + "."), G(M("CA^2") + " ?", d * d, M(d * d) + "."), G("Rayon ?", d, M(d) + ".")],
traps: [TR(d * d, "C'est r² : prends la racine."), TR(2 * d, "C'est le diamètre ; le rayon est CA."), TR(Math.abs(p[0]) + Math.abs(p[1]) + Math.abs(p[2]), "Distance : √(Δx² + Δy² + Δz²).")] }); },
],
2: [
() => { const A = rp(5), h = rv(3), B = add(A, mul(2, h)), Mi = add(A, h), d = -dot(h, Mi); if (Math.abs(d) < 2) return null;
return QN("Le plan médiateur de " + M("[AB]") + ", avec " + ptN("A", A) + " et " + ptN("B", B) + ", a une équation de la forme " + M(lt(h, ["x", "y", "z"]) + " + d = 0") + ". Que vaut " + M("d") + " ?", d, "Plan médiateur : perpendiculaire à " + M("[AB]") + " (vecteur normal " + M(vec("AB") + " = " + v3(mul(2, h))) + ", colinéaire à " + M(v3(h)) + ") et passant par le milieu " + M("M") + pt(Mi) + " : " + M("d = " + d) + ".",
{ ctx: "plan-mediateur", guide: [GP("Milieu " + M("M") + " de " + M("[AB]") + " ?", Mi, pt(Mi) + "."), G(M("d = -(ax_M + by_M + cz_M)") + " ?", d, M(d) + ".")],
traps: [TR(-dot(h, A), "Le plan médiateur passe par le milieu de [AB], pas par A."), TR(dot(h, Mi), "d = −(a·x_M + b·y_M + c·z_M) : attention au signe."), TR(-dot(h, B), "Il passe par le milieu M, pas par B.")] }); },
() => { const C = rv(4), r = R.int(2, 7), K = nn2(C) - r * r; if (!K) return null;
return QN("La sphère " + M("x^2 + y^2 + z^2 " + (lt([-2 * C[0], -2 * C[1], -2 * C[2], K], XYZ).replace(/^-/, "- ").replace(/^(?=\d)/, "+ ")) + " = 0") + " a quel rayon ?", r, "On complète les carrés : " + M(sphT(C, r * r)) + ". Centre " + pt(C) + ", rayon " + M("\\sqrt{" + r * r + "} = " + r) + ".",
{ ctx: "sphere-developpee", guide: [GP("Centre (moitié des coefficients de " + M("x, y, z") + ", signe changé) ?", C, pt(C) + "."), G(M("r^2 = a^2 + b^2 + c^2 - " + par(K)) + " ?", r * r, M(nn2(C) + " - " + par(K) + " = " + r * r) + "."), G("Rayon ?", r, M(r) + ".")],
traps: [TR(r * r, "C'est r² : prends la racine carrée."), TR(K > 0 ? NaN : Math.sqrt(-K), "Le terme constant ne donne pas r² directement : complète d'abord les carrés.")] }); },
() => { const C = rp(4), [p] = qv(), T = add(C, p), d = -dot(p, T);
return QP("Le point " + ptN("T", T) + " est sur la sphère de centre " + ptN("C", C) + ". Le plan tangent à la sphère en " + M("T") + " a une équation de la forme " + M(lt([p[0]], ["x"]) + " + by + cz + d = 0") + ". Réponds « b ; c ; d ».", [p[1], p[2], d], "Le plan tangent en " + M("T") + " est perpendiculaire au rayon : vecteur normal " + M(vec("CT") + " = " + v3(p)) + ". Il passe par " + M("T") + " : " + M("d = " + d) + ". " + M(plT(p, d)) + ".",
{ ctx: "plan-tangent", guide: [GP(M(vec("CT")) + " ?", p, M(v3(p)) + "."), G(M("d = -(ax_T + by_T + cz_T)") + " ?", d, M(d) + "."), GP("Réponse « b ; c ; d » ?", [p[1], p[2], d], M(p[1] + " \\,;\\, " + p[2] + " \\,;\\, " + d) + ".")],
traps: [TP([p[1], p[2], -dot(p, C)], "Le plan tangent passe par T, pas par le centre C."), TP([p[1], p[2], -d], "d = −(a·x_T + b·y_T + c·z_T) : attention au signe.")] }); },
],
3: [
() => { const [del, rho, Rr] = pk([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13], [9, 12, 15]]), [n, nn] = qv(4), C = rp(3), d = sgn() * del * nn - dot(n, C);
return QN("La sphère " + M(sphT(C, Rr * Rr)) + " coupe le plan " + M("\\pi : " + plT(n, d)) + " selon un cercle. Calcule le rayon de ce cercle.", rho, "Distance du centre " + pt(C) + " au plan : " + M("\\delta = \\frac{" + del * nn + "}{" + nn + "} = " + del) + " ; Pythagore : " + M("\\rho = \\sqrt{" + Rr + "^2 - " + del + "^2} = " + rho) + ".",
{ ctx: "cercle-section", guide: [G("Distance " + M("\\delta") + " du centre au plan ?", del, M(del) + "."), G("Rayon du cercle " + M("\\sqrt{R^2 - \\delta^2}") + " ?", rho, M(rho) + ".")],
traps: [TR(Rr - del, "Pythagore : ρ² = R² − δ², pas ρ = R − δ."), TR(rho * rho, "N'oublie pas la racine carrée."), TR(del, "C'est la distance du centre au plan ; le rayon du cercle vaut √(R² − δ²).")] }); },
() => { const [n, nn] = qv(4), C = rp(3), m = R.int(2, 3 * nn), s = sgn(), d = s * m - dot(n, C), r2 = (m * m) / (nn * nn); if (m % nn === 0 && m / nn < 2) return null;
return QN("La sphère de centre " + ptN("C", C) + " est tangente au plan " + M("\\pi : " + plT(n, d)) + ". Son équation s'écrit " + M(sq("x", C[0]) + " + " + sq("y", C[1]) + " + " + sq("z", C[2]) + " = r^2") + ". Que vaut " + M("r^2") + " ? (fractions acceptées)", r2, "Sphère tangente : rayon = distance du centre au plan, " + M("r = " + frT(m, nn)) + ", donc " + M("r^2 = " + fT(r2)) + ".",
{ ctx: "sphere-tangente", guide: [G("Rayon " + M("r") + " (distance de " + M("C") + " au plan) ?", m / nn, M(fT(m / nn)) + "."), G(M("r^2") + " ?", r2, M(fT(r2)) + ".")],
traps: [TR(m / nn, "C'est r ; on demande r²."), TR(m * m / nn, "r = " + m + " ÷ " + nn + " : élève aussi le dénominateur au carré."), TR(m, "Divise par la norme du vecteur normal.")] }); },
() => { const { u, w } = orth(1), mm = pk([1, 2]), k = pk([1, 2, 3]), C = rp(3), s0 = pk([2, -2, 3, -3, 4]), Mc = add(C, mul(mm, w)), A = sub(Mc, mul(s0, u)), R2 = 9 * (k * k + mm * mm), t1 = s0 - k, t2 = s0 + k; if (!t1 || !t2) return null;
return QSet("Pour quelles valeurs de " + M("t") + " la droite " + M("d") + " : " + eqD(A, u) + " coupe-t-elle la sphère " + M(sphT(C, R2)) + " ? Sépare les valeurs par « ; ».", [t1, t2], "On remplace " + M("x, y, z") + " dans l'équation de la sphère : " + M("9t^2 " + (-18 * s0 < 0 ? "- " + 18 * s0 : "+ " + -18 * s0) + "t " + (9 * (s0 * s0 - k * k) < 0 ? "- " + -9 * (s0 * s0 - k * k) : "+ " + 9 * (s0 * s0 - k * k)) + " = 0") + ", soit " + M(lt([1, -2 * s0, s0 * s0 - k * k], ["t^2", "t", ""]) + " = 0") + " : " + M("t = " + t1) + " ou " + M("t = " + t2) + ".",
{ ctx: "droite-sphere", guide: [G("Après remplacement, on divise par " + M("\\|\\vec{u}\\|^2 = 9") + " : " + M("t^2 + pt + q = 0") + ". " + M("p") + " ?", -2 * s0, M(-2 * s0) + "."), G(M("q") + " ?", s0 * s0 - k * k, M(s0 * s0 - k * k) + "."), GSet("Valeurs de " + M("t") + " ?", [t1, t2], M("t = " + t1) + " ou " + M("t = " + t2) + ".")],
traps: [TSt([t2], "La droite coupe la sphère en deux points : deux valeurs de t."), TSt([-t1, -t2], "Attention au signe : vérifie avec t² + pt + q = 0.")] }); },
],
};



const sq2 = (n) => { const r = Math.sqrt(n); return Number.isInteger(r6(r)) ? fT(r) : "\\sqrt{" + fT(n) + "}"; };
const PV = {
1: [
() => { const u = rv(4), v = rv(4), w = cross(u, v); if (isZ(w) || w.filter((x) => !x).length > 1) return null;
return QP("Calcule le produit vectoriel " + M("\\vec u \\times \\vec v") + " avec " + vN("u", u) + " et " + vN("v", v) + "." + TRIP, w,
M("\\vec u \\times \\vec v = " + "\\begin{pmatrix} u_2v_3 - u_3v_2 \\\\ u_3v_1 - u_1v_3 \\\\ u_1v_2 - u_2v_1 \\end{pmatrix}" + " = " + v3(w)) + ". Vérifie : " + M("(\\vec u \\times \\vec v) \\cdot \\vec u = 0") + ".",
{ ctx: "produit-vectoriel", guide: [G("Première composante " + M("u_2v_3 - u_3v_2") + " ?", w[0], M(par(u[1]) + " \\cdot " + par(v[2]) + " - " + par(u[2]) + " \\cdot " + par(v[1]) + " = " + fT(w[0])) + "."), G("Deuxième " + M("u_3v_1 - u_1v_3") + " ?", w[1], M(fT(w[1])) + "."), G("Troisième " + M("u_1v_2 - u_2v_1") + " ?", w[2], M(fT(w[2])) + "."), GP(M("\\vec u \\times \\vec v") + " ?", w, M(v3(w)) + ".")],
traps: [TP(mul(-1, w), "C'est v × u : le produit vectoriel change de signe quand on échange les vecteurs."), TP([u[0] * v[0], u[1] * v[1], u[2] * v[2]], "Ce n'est pas un produit composante par composante : u₂v₃ − u₃v₂, u₃v₁ − u₁v₃, u₁v₂ − u₂v₁."), TP([w[0], -w[1], w[2]], "Deuxième composante : u₃v₁ − u₁v₃ (attention au signe).")] }); },
() => { const u = rv(3), v = rv(3), w = cross(u, v), n2 = nn2(w); if (isZ(w)) return null;
return QN("Calcule l'aire du parallélogramme construit sur " + vN("u", u) + " et " + vN("v", v) + " (valeur exacte).", Math.sqrt(n2),
"Aire " + M("= \\|\\vec u \\times \\vec v\\|") + " avec " + M("\\vec u \\times \\vec v = " + v3(w)) + " : " + M("\\sqrt{" + w.map((x) => par(x) + "^2").join(" + ") + "} = " + sq2(n2)) + ".",
{ ctx: "aire-parallelogramme", guide: [GP(M("\\vec u \\times \\vec v") + " ?" + TRIP, w, M(v3(w)) + "."), G("Carré de sa norme ?", n2, M(n2) + "."), G("Aire ?", Math.sqrt(n2), M(sq2(n2)) + ".")],
traps: [TR(Math.abs(dot(u, v)), "Le produit scalaire ne donne pas l'aire : c'est la norme du produit vectoriel."), TR(n2, "N'oublie pas la racine carrée."), TR(Math.sqrt(n2) / 2, "Parallélogramme : pas de division par 2 (c'est pour le triangle).")] }); },
() => { const u = rv(3), v = rv(3), w = rv(3), d = det3(u, v, w); if (Math.abs(d) < 2) return null;
return QN("Calcule le produit mixte " + M("[\\vec u, \\vec v, \\vec w] = (\\vec u \\times \\vec v) \\cdot \\vec w") + " avec " + vN("u", u) + ", " + vN("v", v) + " et " + vN("w", w) + ".", d,
M("\\vec u \\times \\vec v = " + v3(cross(u, v))) + ", puis le produit scalaire avec " + M("\\vec w") + " : " + M(cross(u, v).map((x, i) => par(x) + " \\cdot " + par(w[i])).join(" + ") + " = " + d) + ". C'est aussi le déterminant des trois vecteurs.",
{ ctx: "produit-mixte", guide: [GP(M("\\vec u \\times \\vec v") + " ?" + TRIP, cross(u, v), M(v3(cross(u, v))) + "."), G("Produit scalaire avec " + M("\\vec w") + " ?", d, M(d) + ".")],
traps: [TR(-d, "(u × v)·w : l'ordre compte ; v × u donne l'opposé."), TR(dot(u, v) + dot(v, w) + dot(u, w), "Le produit mixte n'est pas une somme de produits scalaires : calcule d'abord u × v."), TR(u[0] * v[1] * w[2], "Il faut les trois composantes de u × v, chacune multipliée par celle de w.")] }); },
],
2: [
() => { const A = rp(3), u = rv(3), v = rv(3), w = cross(u, v); if (isZ(w)) return null; const B = add(A, u), C = add(A, v), S = nrm(w) / 2;
return QR("Calcule l'aire du triangle " + M("ABC") + " avec " + ptN("A", A) + ", " + ptN("B", B) + " et " + ptN("C", C) + " (au centième).", S, 0.01,
M(vec("AB") + " \\times " + vec("AC") + " = " + v3(w)) + " ; aire " + M("= \\frac{1}{2}\\|" + vec("AB") + " \\times " + vec("AC") + "\\| = \\frac{" + sq2(nn2(w)) + "}{2} \\approx " + D(S, 0.01)) + ".",
{ ctx: "aire-triangle", guide: [GP(M(vec("AB") + " \\times " + vec("AC")) + " ?" + TRIP, w, M(v3(w)) + "."), G("Norme (au centième) ?", nrm(w), M("\\approx " + D(nrm(w), 0.01)) + ".", 0.01), G("Aire (au centième) ?", S, M("\\approx " + D(S, 0.01)) + ".", 0.01)],
traps: [TR(nrm(w), "C'est l'aire du parallélogramme : divise par 2 pour le triangle."), TR(nn2(w) / 2, "Prends la racine de la norme au carré avant de diviser par 2."), TR(Math.abs(dot(u, v)) / 2, "L'aire vient du produit vectoriel, pas du produit scalaire.")] }); },
() => { const A = rp(2), u = rv(3), v = rv(3), w = rv(3), d = det3(u, v, w); if (Math.abs(d) < 2) return null; const par6 = R.rand() < 0.5, V = par6 ? Math.abs(d) : Math.abs(d) / 6, B = add(A, u), C = add(A, v), Dd = add(A, w);
return QN(par6 ? "Calcule le volume du parallélépipède construit sur " + vN("u", u) + ", " + vN("v", v) + " et " + vN("w", w) + "." : "Calcule le volume du tétraèdre " + M("ABCD") + " avec " + ptN("A", A) + ", " + ptN("B", B) + ", " + ptN("C", C) + " et " + ptN("D", Dd) + " (fraction acceptée).", V,
(par6 ? "Volume " + M("= |[\\vec u, \\vec v, \\vec w]|") : "Volume " + M("= \\frac{1}{6}|[" + vec("AB") + ", " + vec("AC") + ", " + vec("AD") + "]|")) + " ; produit mixte " + M(d) + " : " + M("V = " + fT(V)) + ".",
{ ctx: par6 ? "volume-parallelepipede" : "volume-tetraedre", guide: [G("Produit mixte ?", d, M(d) + "."), G("Volume ?", V, M(fT(V)) + ".")],
traps: [TR(par6 ? Math.abs(d) / 6 : Math.abs(d), par6 ? "Le 1/6 est pour le tétraèdre ; le parallélépipède a pour volume |produit mixte|." : "Tétraèdre : un sixième du parallélépipède."), TR(par6 ? Math.abs(d) / 2 : Math.abs(d) / 3, "Facteur : 1 (parallélépipède), 1/6 (tétraèdre)."), TR(-V, "Un volume est positif : valeur absolue.")] }); },
() => { const A = rp(3), u = rv(3), v = rv(3); let n = cross(u, v); if (isZ(n)) return null; n = red(n); if (n.some((x) => !x) || n.some((x) => Math.abs(x) > 12)) return null; const B = add(A, u), C = add(A, v), d = -dot(n, A); if (Math.abs(d) < 2) return null;
return QN("Le plan passant par " + ptN("A", A) + ", " + ptN("B", B) + " et " + ptN("C", C) + " a pour vecteur normal " + M("\\vec n = " + v3(n)) + " (multiple de " + M(vec("AB") + " \\times " + vec("AC")) + "). Son équation s'écrit " + M(lt(n, ["x", "y", "z"]) + " + d = 0") + ". Que vaut " + M("d") + " ?", d,
M(vec("AB") + " \\times " + vec("AC") + " = " + v3(cross(u, v))) + ", parallèle à " + M("\\vec n") + ". " + M("A") + " est dans le plan : " + M(n.map((x, i) => par(x) + " \\cdot " + par(A[i])).join(" + ") + " + d = 0") + ", donc " + M("d = " + d) + ".",
{ ctx: "plan-normal", guide: [G(M(n[0] + "x_A + " + par(n[1]) + "y_A + " + par(n[2]) + "z_A") + " ?", dot(n, A), M(dot(n, A)) + "."), G(M("d") + " ?", d, M(d) + ".")],
traps: [TR(-d, "d = −(a·x_A + b·y_A + c·z_A) : attention au signe."), TR(-dot(cross(u, v), A), "Utilise le vecteur normal n donné (AB × AC simplifié).")] }); },
],
3: [
() => { const A = rp(3), u = rv(3), Mp = rp(4), w = cross(sub(Mp, A), u); if (isZ(w)) return null; const dd = nrm(w) / nrm(u);
return QR("Calcule la distance du point " + ptN("M", Mp) + " à la droite passant par " + ptN("A", A) + " de vecteur directeur " + vN("u", u) + " (au centième).", dd, 0.01,
M("d = \\frac{\\|" + vec("AM") + " \\times \\vec u\\|}{\\|\\vec u\\|}") + " avec " + M(vec("AM") + " \\times \\vec u = " + v3(w)) + " : " + M("d = \\frac{" + sq2(nn2(w)) + "}{" + sq2(nn2(u)) + "} \\approx " + D(dd, 0.01)) + ".",
{ ctx: "distance-point-droite", guide: [GP(M(vec("AM")) + " ?" + TRIP, sub(Mp, A), M(v3(sub(Mp, A))) + "."), GP(M(vec("AM") + " \\times \\vec u") + " ?" + TRIP, w, M(v3(w)) + "."), G("Distance (au centième) ?", dd, M("\\approx " + D(dd, 0.01)) + ".", 0.01)],
traps: [TR(nrm(w), "Divise par la norme de u."), TR(nrm(sub(Mp, A)), "C'est la distance AM ; la distance à la droite est plus petite (perpendiculaire)."), TR(nrm(w) / nn2(u), "Divise par ‖u‖, pas par ‖u‖².")] }); },
() => { const A = rp(3), u = rv(2), B = rp(3), v = rv(2), n = cross(u, v); if (isZ(n)) return null; const m = det3(sub(B, A), u, v); if (Math.abs(m) < 1) return null; const dd = Math.abs(m) / nrm(n);
return QR("Deux droites gauches : " + M("d_1") + " passe par " + ptN("A", A) + " avec " + vN("u", u) + ", " + M("d_2") + " passe par " + ptN("B", B) + " avec " + vN("v", v) + ". Calcule leur distance (au centième).", dd, 0.01,
M("d = \\frac{|[" + vec("AB") + ", \\vec u, \\vec v]|}{\\|\\vec u \\times \\vec v\\|}") + " ; " + M("\\vec u \\times \\vec v = " + v3(n)) + ", produit mixte " + M(m) + " : " + M("d = \\frac{" + Math.abs(m) + "}{" + sq2(nn2(n)) + "} \\approx " + D(dd, 0.01)) + ".",
{ ctx: "droites-gauches", guide: [GP(M("\\vec u \\times \\vec v") + " ?" + TRIP, n, M(v3(n)) + "."), G("Produit mixte " + M("[" + vec("AB") + ", \\vec u, \\vec v]") + " ?", m, M(m) + "."), G("Distance (au centième) ?", dd, M("\\approx " + D(dd, 0.01)) + ".", 0.01)],
traps: [TR(nrm(sub(B, A)), "AB n'est pas perpendiculaire aux deux droites : projette sur u × v."), TR(Math.abs(m), "Divise par la norme de u × v."), TR(Math.abs(m) / nn2(n), "Divise par ‖u × v‖, pas par son carré.")] }); },
() => { const A = rp(2), u = rv(3), v = rv(3), n = cross(u, v); if (isZ(n) || !n[2]) return null; const al = nz(-2, 2), be = nz(-2, 2), Dp = add(A, add(mul(al, u), mul(be, v))), B = add(A, u), C = add(A, v); if (!Dp[2]) return null;
return QN("Pour quelle valeur de " + M("m") + " les points " + ptN("A", A) + ", " + ptN("B", B) + ", " + ptN("C", C) + " et " + M("D(" + fT(Dp[0]) + " \\,;\\, " + fT(Dp[1]) + " \\,;\\, m)") + " sont-ils coplanaires ?", Dp[2],
"Coplanaires quand le produit mixte " + M("[" + vec("AB") + ", " + vec("AC") + ", " + vec("AD") + "]") + " est nul. " + M(vec("AB") + " \\times " + vec("AC") + " = " + v3(n)) + " ; " + M(n[0] + " \\cdot " + par(Dp[0] - A[0]) + " + " + par(n[1]) + " \\cdot " + par(Dp[1] - A[1]) + " + " + par(n[2]) + (A[2] ? "(m - " + par(A[2]) + ")" : " \\cdot m") + " = 0") + ", donc " + M("m = " + fT(Dp[2])) + ".",
{ ctx: "coplanaires-m", guide: [GP(M(vec("AB") + " \\times " + vec("AC")) + " ?" + TRIP, n, M(v3(n)) + "."), G(M("m") + " ?", Dp[2], M(fT(Dp[2])) + ".")],
traps: [TR(-Dp[2], "Vérifie le signe en remplaçant m dans le produit mixte."), TR(Dp[2] - A[2], "C'est la composante de AD ; m est la cote de D : ajoute la cote de A."), TR(A[2], "D doit vérifier l'équation du plan ABC.")] }); },
],
};


const PROBS = {
vect3d: [() => { const A = rp(4), [p, d] = qv(4), B = add(A, p), Mi = add(A, mul(0.5, p)), E = add(A, mul(3, p));
return P("On donne A" + ptS(A) + " et B" + ptS(B) + ".", [["a) Longueur AB", d], ["b) Cote (z) du milieu de [AB]", Mi[2]], ["c) Cote du point E tel que AE = 3 · AB (vecteurs)", E[2]]], ["AB = B − A, puis Pythagore dans l'espace.", "E = A + 3·AB."], "a) " + M(vec("AB") + " = " + v3(p)) + ", " + M("AB = \\sqrt{" + d * d + "} = " + d) + " ; b) " + M("z_M = \\frac{" + fT(A[2]) + " + " + par(B[2]) + "}{2} = " + fT(Mi[2])) + " ; c) " + M("z_E = " + fT(A[2]) + " + 3 \\cdot " + par(p[2]) + " = " + fT(E[2])) + "."); }],
colin: [() => { const A = rp(3), u = mul(2, rv(2)), t = pk([1.5, 2.5, -0.5]), B = add(A, u), C = add(A, mul(t, u));
return P("Les points A" + ptS(A) + ", B" + ptS(B) + " et C(" + String(C[0]).replace("-", "−") + " ; m ; n) sont alignés.", [["a) Nombre t tel que AC = t · AB (vecteurs)", t], ["b) m", C[1]], ["c) n", C[2]]], ["Avec les abscisses : t = (x_C − x_A) ÷ (x_B − x_A).", "m = y_A + t·(y_B − y_A)."], "a) " + M("t = " + fT(t)) + " ; b) " + M("m = " + fT(C[1])) + " ; c) " + M("n = " + fT(C[2])) + "."); }],
droite3d: [() => { const A = rv(4), u = rv(3), k = 2; const t = -A[2] / u[2], Z = A.map((x, i) => r6(x + t * u[i])), Q = add(A, mul(k, u));
return P("La droite d passe par A" + ptS(A) + " et a pour vecteur directeur u" + ptS(u) + " (on écrit A + t·u).", [["a) Cote du point de d pour t = 2", Q[2]], ["b) Valeur de t où d coupe le plan z = 0", t], ["c) Abscisse de ce point d'intersection", Z[0]]], ["Point pour t : A + t·u.", "z = 0 donne t = −z_A ÷ u_z."], "a) " + M(fT(A[2]) + " + 2 \\cdot " + par(u[2]) + " = " + fT(Q[2])) + " ; b) " + M("t = " + fT(t)) + " ; c) " + M("x = " + fT(A[0]) + " + " + par(t) + " \\cdot " + par(u[0]) + " = " + fT(Z[0])) + "."); }],
plans: [() => { const n = rv(3), A = rp(3), d = -dot(n, A), x0 = R.int(-3, 3), y0 = R.int(-3, 3), m = r6(-(n[0] * x0 + n[1] * y0 + d) / n[2]);
return P("Le plan π passe par A" + ptS(A) + " et a pour vecteur normal n" + ptS(n) + " ; son équation s'écrit ax + by + cz + d = 0 avec (a ; b ; c) = n.", [["a) d", d], ["b) Abscisse du point où π coupe l'axe Ox", -d / n[0]], ["c) m tel que P(" + String(x0).replace("-", "−") + " ; " + String(y0).replace("-", "−") + " ; m) soit dans π", m]], ["d = −(a·x_A + b·y_A + c·z_A).", "Sur l'axe Ox : y = z = 0."], "a) " + M("d = " + d) + ", " + M("\\pi : " + plT(n, d)) + " ; b) " + M(lt([n[0], d], ["x", ""]) + " = 0") + ", " + M("x = " + fT(-d / n[0])) + " ; c) " + M("m = " + fT(m)) + "."); }],
posrel: [() => { const n = rv(3), Pp = rp(3), d = -dot(n, Pp), u = rv(2); if (!dot(n, u)) return PROBS.posrel[0](); const t0 = pk([2, -1, 3]), A = sub(Pp, mul(t0, u));
return P("La droite d passe par A" + ptS(A) + ", de vecteur directeur u" + ptS(u) + " ; le plan π a pour équation " + plS(n, d) + ".", [["a) Valeur de t du point d'intersection (A + t·u)", t0], ["b) Cote (z) du point d'intersection", Pp[2]], ["c) Produit scalaire n · u (n = vecteur normal de π)", dot(n, u)]], ["Remplace x, y, z de A + t·u dans l'équation de π.", "Si n · u ≠ 0, la droite n'est pas parallèle au plan."], "a) " + M("t = " + t0) + " ; b) point " + pt(Pp) + ", " + M("z = " + Pp[2]) + " ; c) " + M("\\vec{n} \\cdot \\vec{u} = " + dot(n, u) + " \\neq 0") + " : la droite coupe le plan."); }],
pscal3d: [() => { const A = rp(3), u = rv(3), v = rv(3); if (isZ(cross(u, v)) || !dot(u, v)) return PROBS.pscal3d[0](); const B = add(A, u), C = add(A, v), a = angle(u, v);
return P("Triangle de sommets A" + ptS(A) + ", B" + ptS(B) + " et C" + ptS(C) + ".", [["a) Produit scalaire AB · AC", dot(u, v)], ["b) AB² (carré de la longueur)", nn2(u)], ["c) Angle BAC en degrés (au dixième)", a, 0.1]], ["AB = B − A et AC = C − A.", "cos(BAC) = (AB · AC) ÷ (AB · AC)."], "a) " + M(dot(u, v)) + " ; b) " + M(nn2(u)) + " ; c) " + M("\\cos\\alpha = \\frac{" + dot(u, v) + "}{\\sqrt{" + nn2(u) + "} \\cdot \\sqrt{" + nn2(v) + "}}") + ", " + M("\\alpha \\approx " + D(a, 0.1) + "°") + "."); }],
distances: [() => { const [n, nn] = qv(4), Pp = rp(3), m = R.int(2, 3 * nn), d = m - dot(n, Pp), Q = rp(3), d2 = -dot(n, Q); if (d2 === d) return PROBS.distances[0]();
return P("Le plan π a pour équation " + plS(n, d) + " ; on donne P" + ptS(Pp) + " et Q" + ptS(Q) + ".", [["a) Norme du vecteur normal de π", nn], ["b) Distance de P à π", m / nn], ["c) Distance entre π et le plan parallèle à π passant par Q", Math.abs(d - d2) / nn]], ["δ = |ax + by + cz + d| ÷ ‖n‖.", "Le plan parallèle par Q : même n, d' = −n · Q."], "a) " + M(nn) + " ; b) " + M("\\frac{" + m + "}{" + nn + "}") + " ; c) " + M("d' = " + d2) + ", " + M("\\frac{|" + fT(d) + " - " + par(d2) + "|}{" + nn + "} = " + fT(Math.abs(d - d2) / nn)) + "."); }],
sphere: [() => { const C = rp(3), [p, r] = qv(4), T = add(C, p), dT = -dot(p, T), O = sub(mul(2, C), T);
return P("La sphère de centre C" + ptS(C) + " passe par T" + ptS(T) + ".", [["a) Rayon de la sphère", r], ["b) d dans l'équation du plan tangent en T : " + ltS(p, ["x", "y", "z"]).replace(/-/g, "−") + " + d = 0", dT], ["c) Cote (z) du point diamétralement opposé à T", O[2]]], ["Rayon = CT.", "Le plan tangent en T a pour vecteur normal CT ; le point opposé vaut 2C − T."], "a) " + M("CT = " + r) + " ; b) " + M("d = " + dT) + " ; c) " + M("2 \\cdot " + par(C[2]) + " - " + par(T[2]) + " = " + fT(O[2])) + "."); }],
pvect: [() => { const A = [1, 0, 0], B = [0, 2, 0], C = [0, 0, 3], k = pk([1, 2]), Ak = mul(k, A), Bk = mul(k, B), Ck = mul(k, C), n = cross(sub(Bk, Ak), sub(Ck, Ak)), S = nrm(n) / 2, V = Math.abs(det3(Ak, Bk, Ck)) / 6;
return P("On donne A" + ptS(Ak) + ", B" + ptS(Bk) + ", C" + ptS(Ck) + " et l'origine O.", [["a) Norme de AB × AC", nrm(n)], ["b) Aire du triangle ABC", S], ["c) Volume du tétraèdre OABC", V], ["d) Distance de O au plan ABC (fraction acceptée)", (3 * V) / S]],
["AB × AC = (" + 6 * k * k + " ; " + 3 * k * k + " ; " + 2 * k * k + ").", "Volume = aire de la base × hauteur ÷ 3 : la hauteur est la distance cherchée."],
"a) " + M(vec("AB") + " \\times " + vec("AC") + " = " + v3(n)) + ", norme " + M(fT(nrm(n))) + " ; b) " + M(fT(S)) + " ; c) " + M("\\frac{|[" + vec("OA") + ", " + vec("OB") + ", " + vec("OC") + "]|}{6} = " + fT(V)) + " ; d) " + M("\\frac{3V}{S} = " + fT((3 * V) / S)) + "."); }],
};


const NEW = [
{ id: "vect3d", theme: "es", label: "Vecteurs de l'espace", ex: "\\overrightarrow{AB} = \\begin{pmatrix} x_B - x_A \\\\ y_B - y_A \\\\ z_B - z_A \\end{pmatrix}", CH: [14], codesMATU: "3\\.GV\\.01[a-d]", lv: VE,
hint: "Composantes de AB : B − A (trois coordonnées). Milieu : moyenne des coordonnées. Norme : √(a² + b² + c²). Chasles : AB + BC = AC.",
lesson: ["Vecteurs de l'espace", "Comme dans le plan, avec une troisième coordonnée.", "Dans un repère de l'espace, \\(\\overrightarrow{AB}\\) a pour composantes \\(B - A\\). Les opérations se font composante par composante. Le milieu de \\([AB]\\) est la moyenne des coordonnées. La norme de \\(\\vec{u} = (a \\,;\\, b \\,;\\, c)\\) vaut \\(\\sqrt{a^2 + b^2 + c^2}\\) (Pythagore deux fois). Relation de Chasles : \\(\\overrightarrow{AB} + \\overrightarrow{BC} = \\overrightarrow{AC}\\).",
["\\(A(1 \\,;\\, 2 \\,;\\, -1)\\), \\(B(3 \\,;\\, 0 \\,;\\, 4)\\) : \\(\\overrightarrow{AB} = (2 \\,;\\, -2 \\,;\\, 5)\\), \\(AB = \\sqrt{33}\\).", "\\(\\|(2 \\,;\\, 3 \\,;\\, 6)\\| = \\sqrt{4 + 9 + 36} = 7\\)."], "Dans \\(ABCD\\) (parallélogramme), \\(\\overrightarrow{AD} = \\overrightarrow{BC}\\) : l'ordre des sommets compte."],
comps: ["Calculer composantes, milieu et combinaisons de vecteurs", "Calculer une norme ; parallélogramme ; relation de Chasles", "Symétrique, centre de gravité, norme avec une inconnue"] },
{ id: "colin", niv: "R", theme: "es", label: "Colinéarité et coplanarité", ex: "\\vec{v} = k\\,\\vec{u}", CH: [14], codesMATU: "3\\.GV\\.02[ab]", lv: CL,
hint: "Colinéaires : v = k·u (même rapport pour les trois composantes). Coplanaires : w = α·u + β·v. Points alignés : AC = t·AB.",
lesson: ["Colinéarité et coplanarité", "Deux vecteurs parallèles, trois vecteurs dans un même plan (niveau avancé MA2).", "\\(\\vec{u}\\) et \\(\\vec{v}\\) sont colinéaires s'il existe \\(k\\) tel que \\(\\vec{v} = k\\,\\vec{u}\\) : les trois rapports de composantes sont égaux. Trois points \\(A, B, C\\) sont alignés si \\(\\overrightarrow{AC} = t\\,\\overrightarrow{AB}\\). Trois vecteurs sont coplanaires si l'un est combinaison des deux autres : \\(\\vec{w} = \\alpha\\vec{u} + \\beta\\vec{v}\\) ; quatre points \\(A, B, C, D\\) sont coplanaires si \\(\\overrightarrow{AD} = \\alpha\\overrightarrow{AB} + \\beta\\overrightarrow{AC}\\).",
["\\((2 \\,;\\, -1 \\,;\\, 3)\\) et \\((6 \\,;\\, -3 \\,;\\, 9)\\) : \\(k = 3\\), colinéaires.", "\\(\\vec{w} = 2\\vec{u} - \\vec{v}\\) : on trouve \\(\\alpha\\) et \\(\\beta\\) avec deux composantes, la troisième vérifie."], "Deux équations donnent \\(\\alpha\\) et \\(\\beta\\) ; il faut toujours vérifier la troisième."],
comps: ["Reconnaître des vecteurs colinéaires (facteur k, alignement)", "Décomposer un vecteur ; points coplanaires", "Colinéarité ou coplanarité avec un paramètre"] },
{ id: "droite3d", theme: "es", label: "Droites de l'espace", ex: "\\begin{cases} x = 1 + 2t \\\\ y = -3t \\\\ z = 4 + t \\end{cases}", CH: [14], codesMATU: "3\\.GV\\.03[ab]", lv: DT,
hint: "Droite par A, de vecteur directeur u : (x ; y ; z) = A + t·u. Un point est sur la droite si les trois équations donnent la même valeur de t.",
lesson: ["Droites de l'espace", "Un point de départ et une direction.", "La droite passant par \\(A\\) et de vecteur directeur \\(\\vec{u}\\) a pour équations paramétriques \\(x = x_A + t\\,u_x\\), \\(y = y_A + t\\,u_y\\), \\(z = z_A + t\\,u_z\\). Chaque valeur de \\(t\\) donne un point. Un point appartient à la droite si les trois équations donnent le même \\(t\\). Deux droites de l'espace peuvent être sécantes, parallèles ou gauches (ni l'un ni l'autre).",
["\\((AB)\\) avec \\(A(1 \\,;\\, 0 \\,;\\, 2)\\), \\(B(3 \\,;\\, -1 \\,;\\, 5)\\) : \\(x = 1 + 2t\\), \\(y = -t\\), \\(z = 2 + 3t\\).", "Intersection avec le plan \\(z = 0\\) : \\(2 + 3t = 0\\), \\(t = -\\frac{2}{3}\\)."], "Les coefficients de \\(t\\) forment le vecteur directeur ; les termes constants, le point de départ."],
comps: ["Lire et utiliser des équations paramétriques de droite", "Intersection avec un plan de coordonnées ; droite parallèle", "Intersection de deux droites ; problèmes de trajectoire"] },
{ id: "plans", theme: "es", label: "Équations d'un plan", ex: "ax + by + cz + d = 0", CH: [14], codesMATU: "3\\.GV\\.03[ce]", lv: PL,
hint: "Paramétriques : A + s·u + t·v. Cartésienne : ax + by + cz + d = 0, où (a ; b ; c) est un vecteur normal. Traces : on annule une ou deux coordonnées.",
lesson: ["Équations d'un plan", "Deux directions, ou un vecteur normal.", "Le plan passant par \\(A\\) et dirigé par \\(\\vec{u}\\) et \\(\\vec{v}\\) (non colinéaires) a pour équations paramétriques \\(A + s\\,\\vec{u} + t\\,\\vec{v}\\). En éliminant \\(s\\) et \\(t\\), on obtient une équation cartésienne \\(ax + by + cz + d = 0\\) ; le vecteur \\((a \\,;\\, b \\,;\\, c)\\) est orthogonal au plan. Traces : avec \\(z = 0\\), on obtient la droite du plan \\(xOy\\) ; avec deux coordonnées nulles, le point sur un axe.",
["\\(2x - y + 3z - 6 = 0\\) coupe l'axe \\(Oz\\) en \\((0 \\,;\\, 0 \\,;\\, 2)\\).", "Plan parallèle passant par \\(A(1 \\,;\\, 1 \\,;\\, 1)\\) : \\(2x - y + 3z - 4 = 0\\)."], "Deux plans parallèles ont des coefficients \\(a, b, c\\) proportionnels ; seul \\(d\\) change."],
comps: ["Utiliser une équation paramétrique ou cartésienne de plan", "Plan parallèle ; appartenance ; trace dans un plan de coordonnées", "Équation cartésienne par trois points ou depuis les équations paramétriques"] },
{ id: "posrel", theme: "es", label: "Positions relatives, intersections", ex: "d \\cap \\pi", CH: [14], codesMATU: "3\\.GV\\.03d", lv: PO,
hint: "Droite et plan : remplace x, y, z de la droite dans l'équation du plan (équation en t). Parallèles si n · u = 0. Deux plans : système de deux équations.",
lesson: ["Positions relatives", "Se couper, être parallèles, être contenu.", "Droite \\(A + t\\vec{u}\\) et plan \\(\\vec{n} \\cdot (x \\,;\\, y \\,;\\, z) + d = 0\\) : si \\(\\vec{n} \\cdot \\vec{u} \\neq 0\\), ils se coupent en un point (une valeur de \\(t\\)) ; si \\(\\vec{n} \\cdot \\vec{u} = 0\\), la droite est parallèle au plan, et contenue dedans si \\(A\\) y est. Deux plans non parallèles se coupent selon une droite ; trois plans se coupent en général en un point (système 3 × 3).",
["\\(x = 1 + t\\), \\(y = 2t\\), \\(z = 3 - t\\) et \\(x + y + z - 7 = 0\\) : \\(4 + 2t = 7\\), \\(t = \\frac{3}{2}\\)."], "Parallèle au plan : \\(\\vec{u}\\) orthogonal à \\(\\vec{n}\\) (pas colinéaire)."],
comps: ["Intersection d'une droite et d'un plan ; parallélisme", "Intersection de deux plans ; droite contenue ; droites sécantes", "Trois plans ; droite qui perce un plan ; ombre portée"] },
{ id: "pscal3d", theme: "es", label: "Produit scalaire dans l'espace", ex: "\\vec{u} \\cdot \\vec{v} = u_x v_x + u_y v_y + u_z v_z", CH: [14], codesMATU: "3\\.GV\\.04[a-c]", lv: PS,
hint: "u · v = uₓvₓ + u_yv_y + u_zv_z = ‖u‖ ‖v‖ cos α. Orthogonaux ⟺ u · v = 0. Projeté de v sur u : (u · v ÷ ‖u‖²)·u.",
lesson: ["Produit scalaire dans l'espace", "Un nombre qui mesure l'angle entre deux directions.", "\\(\\vec{u} \\cdot \\vec{v} = u_x v_x + u_y v_y + u_z v_z = \\|\\vec{u}\\| \\, \\|\\vec{v}\\| \\cos\\alpha\\). Donc \\(\\cos\\alpha = \\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{u}\\| \\, \\|\\vec{v}\\|}\\), et \\(\\vec{u} \\perp \\vec{v} \\iff \\vec{u} \\cdot \\vec{v} = 0\\). Projection orthogonale de \\(\\vec{v}\\) sur la direction de \\(\\vec{u}\\) : longueur \\(\\frac{|\\vec{u} \\cdot \\vec{v}|}{\\|\\vec{u}\\|}\\), vecteur \\(\\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{u}\\|^2}\\,\\vec{u}\\).",
["\\((1 \\,;\\, 2 \\,;\\, 2) \\cdot (2 \\,;\\, 0 \\,;\\, -1) = 2 + 0 - 2 = 0\\) : orthogonaux.", "\\(\\cos\\alpha = \\frac{1}{\\sqrt{2} \\cdot \\sqrt{2}} = \\frac{1}{2}\\) : \\(\\alpha = 60°\\)."], "L'angle de deux vecteurs est entre 0° et 180° : un produit scalaire négatif donne un angle obtus."],
comps: ["Calculer un produit scalaire ; orthogonalité ; angle", "Angle d'un triangle ; projection ; triangle rectangle", "Vecteur projeté ; projeté d'un point sur une droite ; angles dans un pavé"] },
{ id: "distances", theme: "es", label: "Distances et aires dans l'espace", ex: "\\delta(P, \\pi) = \\frac{|ax_P + by_P + cz_P + d|}{\\sqrt{a^2 + b^2 + c^2}}", CH: [14], codesMATU: "3\\.GV\\.04[de]", lv: DI,
hint: "Point-plan : |ax + by + cz + d| ÷ √(a² + b² + c²). Point-droite : distance au pied H de la perpendiculaire. Aire : ½·√(AB²·AC² − (AB · AC)²).",
lesson: ["Distances et aires", "La plus courte distance se mesure perpendiculairement.", "Distance de \\(P\\) au plan \\(ax + by + cz + d = 0\\) : \\(\\frac{|ax_P + by_P + cz_P + d|}{\\sqrt{a^2 + b^2 + c^2}}\\). Distance de \\(P\\) à la droite \\(A + t\\vec{u}\\) : on cherche le pied \\(H\\) (\\(t = \\frac{\\overrightarrow{AP} \\cdot \\vec{u}}{\\|\\vec{u}\\|^2}\\)), puis \\(PH\\). Aire du triangle \\(ABC\\) : \\(\\frac{1}{2}\\sqrt{AB^2 \\cdot AC^2 - (\\overrightarrow{AB} \\cdot \\overrightarrow{AC})^2}\\).",
["\\(P(1 \\,;\\, 1 \\,;\\, 1)\\) et \\(2x + y + 2z - 2 = 0\\) : \\(\\frac{|2 + 1 + 2 - 2|}{3} = 1\\).", "Plans parallèles \\(\\vec{n} \\cdot X + d_1 = 0\\) et \\(\\vec{n} \\cdot X + d_2 = 0\\) : \\(\\frac{|d_1 - d_2|}{\\|\\vec{n}\\|}\\)."], "N'oublie ni la valeur absolue ni la racine de \\(a^2 + b^2 + c^2\\)."],
comps: ["Distance point-plan, plans parallèles ; aire d'un triangle rectangle", "Distance point-droite ; aire d'un triangle quelconque", "Volume d'une pyramide ; distance imposée ; problème de distance minimale"] },
{ id: "sphere", theme: "es", label: "Vecteur normal, plan médiateur, sphère", ex: "(x - a)^2 + (y - b)^2 + (z - c)^2 = r^2", CH: [14], codesMATU: "3\\.GV\\.05[a-d]", lv: SP,
hint: "Plan de vecteur normal n par A : n · AX = 0. Plan médiateur de [AB] : normal AB, par le milieu. Sphère : (x − a)² + (y − b)² + (z − c)² = r². Plan tangent en T : normal CT, par T.",
lesson: ["Sphère et plans", "Un vecteur normal suffit pour écrire un plan.", "Le plan passant par \\(A\\) et de vecteur normal \\(\\vec{n} = (a \\,;\\, b \\,;\\, c)\\) a pour équation \\(ax + by + cz + d = 0\\) avec \\(d = -(ax_A + by_A + cz_A)\\). Le plan médiateur de \\([AB]\\) a pour vecteur normal \\(\\overrightarrow{AB}\\) et passe par le milieu de \\([AB]\\). La sphère de centre \\(C\\) et de rayon \\(r\\) : \\((x - a)^2 + (y - b)^2 + (z - c)^2 = r^2\\). Le plan tangent en \\(T\\) a pour vecteur normal \\(\\overrightarrow{CT}\\). Un plan à distance \\(\\delta < r\\) du centre coupe la sphère selon un cercle de rayon \\(\\sqrt{r^2 - \\delta^2}\\).",
["\\(x^2 + y^2 + z^2 - 2x + 4z - 4 = 0\\) : \\((x - 1)^2 + y^2 + (z + 2)^2 = 9\\), centre \\((1 \\,;\\, 0 \\,;\\, -2)\\), rayon 3."], "Dans \\((x + 2)^2\\), la coordonnée du centre est \\(-2\\)."],
comps: ["Plan par un point et un vecteur normal ; centre et rayon d'une sphère", "Plan médiateur ; équation développée ; plan tangent", "Section d'une sphère ; sphère tangente à un plan ; droite et sphère"] },
{ id: "pvect", niv: "R", theme: "es", label: "Produit vectoriel et produit mixte", ex: "\\vec u \\times \\vec v", CH: [14], codesMATU: "3\\.GV\\.06[a-d]", lv: PV,
hint: "u × v = (u₂v₃ − u₃v₂ ; u₃v₁ − u₁v₃ ; u₁v₂ − u₂v₁), perpendiculaire à u et v. Aire du parallélogramme : ‖u × v‖ (triangle : la moitié). Volume : |(u × v)·w| (tétraèdre : un sixième).",
lesson: ["Produit vectoriel", "Un vecteur perpendiculaire à deux autres (niveau avancé MA2).", "\\(\\vec u \\times \\vec v = \\begin{pmatrix} u_2v_3 - u_3v_2 \\\\ u_3v_1 - u_1v_3 \\\\ u_1v_2 - u_2v_1 \\end{pmatrix}\\) est perpendiculaire à \\(\\vec u\\) et à \\(\\vec v\\) ; sa norme est l'aire du parallélogramme construit sur \\(\\vec u\\) et \\(\\vec v\\) ; \\(\\vec v \\times \\vec u = -\\vec u \\times \\vec v\\). Produit mixte \\([\\vec u, \\vec v, \\vec w] = (\\vec u \\times \\vec v) \\cdot \\vec w\\) : sa valeur absolue est le volume du parallélépipède (tétraèdre : \\(\\frac{1}{6}\\)) ; il est nul si les vecteurs sont coplanaires. Distances : point-droite \\(\\frac{\\|\\overrightarrow{AM} \\times \\vec u\\|}{\\|\\vec u\\|}\\), entre droites gauches \\(\\frac{|[\\overrightarrow{AB}, \\vec u, \\vec v]|}{\\|\\vec u \\times \\vec v\\|}\\).",
["\\((1 \\,;\\, 2 \\,;\\, 0) \\times (0 \\,;\\, 1 \\,;\\, 3) = (6 \\,;\\, -3 \\,;\\, 1)\\)", "Triangle \\(A(1 \\,;\\, 0 \\,;\\, 0)\\), \\(B(0 \\,;\\, 2 \\,;\\, 0)\\), \\(C(0 \\,;\\, 0 \\,;\\, 3)\\) : \\(\\overrightarrow{AB} \\times \\overrightarrow{AC} = (6 \\,;\\, 3 \\,;\\, 2)\\), aire \\(\\frac{7}{2}\\)"], "L'ordre compte : \\(\\vec v \\times \\vec u\\) est l'opposé de \\(\\vec u \\times \\vec v\\) ; et la deuxième composante est \\(u_3v_1 - u_1v_3\\)."],
comps: ["Calculer un produit vectoriel ; aire d'un parallélogramme ; produit mixte", "Aire d'un triangle ; volume d'un tétraèdre ou d'un parallélépipède ; équation d'un plan par trois points", "Distance point-droite ; distance de deux droites gauches ; points coplanaires"] },
];


for (const n of NEW) {
if (!NOTIONS.some((x) => x.id === n.id)) NOTIONS.push(Object.assign({ id: n.id, theme: n.theme, label: n.label, ex: n.ex, CH: n.CH, MP: null, FR: null }, n.niv ? { niv: n.niv } : {}));
GEN[n.id] = (d) => pickForm(n.lv[Math.min(Math.max(d, 1), 3)]);
HINTS_EXTRA[n.id] = n.hint;
LESSONS_EXTRA[n.id] = n.lesson;
if (typeof COMPS !== "undefined") COMPS[n.id] = n.comps;
if (typeof PROB_EXTRA !== "undefined") PROB_EXTRA[n.id] = PROBS[n.id];
}
})();

