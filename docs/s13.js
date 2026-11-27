










const FR_COLLEGE = {

aire1: [6, [7, 8]], angtri: [6, [7]], angtype: [6, [7]], dec10: [6, [7, 8]], decadd: [6, [7]], decarr: [6], deccomp: [6],
decdiv: [6, [7]], decmul: [6, [7]], decprob: [6, [7]], decread: [6], disque: [6, [7]], fracadd: [6, [7, 8, 9]], fracconv: [6, [7, 8]],
fracrep: [6, [7, 8]], fracsimp: [6, [7, 8, 9]], fractout: [6, [7, 8]], multdiv: [6, [7]], ordgr: [6, [8]], pct: [6, [7, 8, 9]],
perim: [6, [7]], prop: [6, [7, 8, 9]], proptab: [6, [7]], uaire: [6, [7]], ulong: [6, [7]], utemps: [6], volpave: [6, [7]],

aire2: [7], aire3: [7], angles: [7], diagr: [7, [8, 9]], distrib: [7, [8, 9]], divcrit: [7, [9]], eq1: [7, [8, 9]], eqverif: [7, [8]],
factor: [7, [8, 9]], litelab: [7, [8, 9]], parenth: [7, [9]], pow9: [7, [8, 9]], prio: [7], proba: [7, [8, 9]], probeq: [7, [8, 9]],
quadri: [7, [8]], reduire: [7, [8, 9]], reladd: [7, [8]], relrep: [7, [8, 9]], repere: [7, [8, 9]], statfreq: [7, [8, 9]],
symetries: [7, [8]], tradexpr: [7, [8]], uvol: [7], valnum: [7, [8, 9]], vitesse: [7], vol: [7, [8]],

agrand: [8, [9]], carres: [8], cercthales: [8, [9]], echelle: [8, [9]], eqfrac: [8], fracmul: [8], fracops: [8, [9]],
lectgraph: [8, [9]], monomes: [8], premiers: [8, [9]], puiss: [8, [9]], pyth: [8, [9]], pythfig: [8], pythrec: [8], quartiles: [8, [9]],
racenc: [8], rel: [8], sci: [8, [9]], solides: [8, [9]], ucomp: [8, [9]], volcone: [8, [9]],

affine: [9], eq2: [9], eq2fact: [9], fimg: [9], gquot: [9], idrem: [9], modaff: [9], pctvar: [9], rac: [9], rotation: [9], scicalc: [9],
simil: [9], tabval: [9], thales: [9], thalesrec: [9], trigo: [9], volcomp: [9],

motifs: [6, [7]], automat: [6, [7, 8, 9]], structexpr: [7, [8, 9]], progcalc: [7, [8, 9]] , ratio: [8, [9]], milieux: [8, [9]],
};







const FR_MASK = ["change", "pente", "polyreg", "grandmanq", "airelat", "voldecomp", "airepyr", "volmanq", "fracper", "racprop",
"probeq2", "sysprob", "sysgraph", "euclide", "denombr", "arith" ,
"vabs" , "droitesrem" , "fracrat", "vecteurs" ];


const FR_PROGRESSION = {
6: ["automat", "decread", "deccomp", "decarr", "decadd", "angtype", "multdiv", "decmul", "dec10", "perim", "fracrep", "fracsimp", "ulong",
"fractout", "disque", "decdiv", "motifs", "prop", "aire1", "fracconv", "fracadd", "uaire", "proptab", "utemps", "ordgr", "decprob",
"pct", "volpave", "angtri"],
7: ["prio", "relrep", "reladd", "structexpr", "tradexpr", "progcalc", "litelab", "valnum", "divcrit", "angles", "quadri", "repere", "symetries",
"eqverif", "distrib", "reduire", "parenth", "factor", "aire2", "aire3", "uvol", "vol", "pow9", "eq1", "probeq", "statfreq", "diagr",
"proba", "vitesse"],
8: ["rel", "fracmul", "fracops", "puiss", "sci", "carres", "racenc", "pyth", "pythrec", "pythfig", "cercthales", "premiers",
"monomes", "eqfrac", "milieux", "echelle", "agrand", "ratio", "solides", "volcone", "ucomp", "quartiles", "lectgraph"],
9: ["idrem", "eq2", "eq2fact", "rac", "scicalc", "thales", "thalesrec", "trigo", "tabval", "fimg", "affine", "modaff", "pctvar",
"gquot", "volcomp", "rotation", "simil"],
};

ORDRE.FR_COL = {};
[6, 7, 8, 9].flatMap((g) => FR_PROGRESSION[g]).forEach((id, i) => { ORDRE.FR_COL[id] = i; });



function applyFrCollege() {
for (const n of NOTIONS) {
const t = FR_COLLEGE[n.id];


if (t) { n.FR = [t[0]]; n.againFR = [...new Set([...(t[1] || []), ...(n.againFR || []).filter((g) => g >= 10)])]; continue; }

if (n.FR && n.FR[0] <= 9) n.FR = null;
}
}





const FR_NEW = [
{ id: "progcalc", theme: "fa", label: "Programmes de calcul", ex: "x \\to x + 3 \\to 2(x + 3) \\to 2x + 1" },
{ id: "ratio", theme: "fa", label: "Ratios et partage proportionnel", ex: "120 \\text{ € selon } 2\\,:\\,3 \\to 48 \\text{ € et } 72 \\text{ €}" },
{ id: "milieux", theme: "es", label: "Droite des milieux", ex: "IJ = \\frac{1}{2}\\,BC" },
{ id: "structexpr", theme: "fa", label: "Somme ou produit ? Termes, facteurs, opposé", ex: "5(x + 4) \\text{ est un produit}" },
{ id: "motifs", theme: "fa", label: "Suites de motifs", ex: "\\text{étape } n : 3n + 1 \\text{ allumettes}" },
{ id: "automat", theme: "no", label: "Automatismes de calcul mental", ex: "25\\,\\% \\text{ de } 36 = 9" },
];
(function () {
const pk = (a) => a[Math.floor(R.rand() * a.length)];
const r6 = (v) => +(+v).toFixed(6);

const N = (v) => { let [i, f] = String(r6(v)).split("."); const sg = i.startsWith("-") ? "-" : ""; i = i.replace("-", ""); if (i.length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\,"); return sg + i + (f ? "{,}" + f : ""); };
const P = (v) => (v < 0 ? "(" + N(v) + ")" : N(v));
const keep = (value, traps) => { const seen = new Set(); return (traps || []).filter((t) => t && isFinite(t.v) && Math.abs(t.v - value) > 1e-9 && !seen.has(r6(t.v)) && seen.add(r6(t.v))); };
const p15 = (v) => +(+v).toPrecision(15);
const Qv = (q, value, sol, o = {}) => { const x = { q, spec: { kind: "value", value: p15(value) }, sol, guide: o.guide, traps: keep(p15(value), o.traps), ctx: o.ctx }; if (o.fig) x.fig = o.fig; return x; };
const G = (ask, value, sol) => GS(ask, p15(value), sol);
const TR = (v, m) => TRAP(r6(v), m);
const Qx = (q, e, sol, o = {}) => { const x = { q, spec: Object.assign({ kind: "expr", expr: e }, o.form ? { form: o.form } : {}), sol, guide: o.guide, ctx: o.ctx };
let target = null; try { target = Expr.parse(e); } catch (er) {}
x.traps = (o.traps || []).filter((tr) => { try { return !target || !Expr.equivalent(Expr.parse(tr.e), target); } catch (er) { return false; } });
if (o.fig) x.fig = o.fig; return x; };
const GX = (ask, e, sol, form) => ({ ask, spec: Object.assign({ kind: "expr", expr: e }, form ? { form } : {}), sol });
const TX = (e, m) => ({ e, m });
const GSet = (ask, vals, sol) => ({ ask, spec: { kind: "set", values: vals }, sol });
const Pb = (q, parts, hints, sol, fig) => ({ fig, q, parts: parts.map(([label, value]) => ({ label, spec: { kind: "value", value: p15(value) } })), hints, sol });
const who = () => pk(["Léa", "Hugo", "Chloé", "Nathan", "Manon", "Louis", "Camille", "Jules", "Inès", "Gabriel"]);
const ville = () => pk(["Lyon", "Lille", "Nantes", "Toulouse", "Bordeaux", "Strasbourg", "Rennes", "Marseille", "Montpellier", "Dijon"]);

const pol = (c, v = "x") => poly([c[2] || 0, c[1] || 0, c[0] || 0].filter((t, i, a) => i === 2 || a.slice(0, i + 1).some((u) => u !== 0)), v);



const S = {
add: (k) => ({ t: "Ajouter " + N(k) + ".", f: (v) => v + k, p: (c) => [c[0] + k, c[1], c[2]], tx: (e) => e + " + " + N(k), op: "+ " + k }),
sub: (k) => ({ t: "Soustraire " + N(k) + ".", f: (v) => v - k, p: (c) => [c[0] - k, c[1], c[2]], tx: (e) => e + " - " + N(k), op: "− " + k }),
mul: (k) => ({ t: "Multiplier par " + N(k) + ".", f: (v) => v * k, p: (c) => c.map((u) => u * k), tx: (e) => N(k) + "(" + e + ")", op: "× " + k }),
sq: () => ({ t: "Élever le résultat au carré.", f: (v) => v * v, p: (c) => [c[0] * c[0], 2 * c[0] * c[1], c[1] * c[1]], tx: (e) => "(" + e + ")^2", op: "²" }),
addX: () => ({ t: "Ajouter le nombre de départ.", f: (v, x0) => v + x0, p: (c) => [c[0], c[1] + 1, c[2]], tx: (e) => e + " + x", op: "+ départ" }),
subX2: () => ({ t: "Soustraire le carré du nombre de départ.", f: (v, x0) => v - x0 * x0, p: (c) => [c[0], c[1], c[2] - 1], tx: (e) => e + " - x^2", op: "− départ²" }),
};
const prog = (steps, name) => "<b>" + (name || "Programme") + "</b><br>• Choisir un nombre.<br>" + steps.map((s) => "• " + s.t).join("<br>");
const run = (steps, x0) => { const out = []; let v = x0; for (const s of steps) { v = s.f(v, x0); out.push(v); } return out; };
const runP = (steps) => steps.reduce((c, s) => s.p(c), [0, 1, 0]);
const stepGuide = (steps, x0) => { const vs = run(steps, x0); return steps.map((s, i) => G("« " + s.t.replace(/\.$/, "") + " » : résultat ?", vs[i], M((i ? N(vs[i - 1]) : N(x0)) + "\\ \\to\\ " + N(vs[i])) + ".")); };
const PC = {
1: [
() => { const a = R.int(2, 9), b = R.int(2, 6), c = R.int(2, 19), x0 = R.int(3, 12), st = [S.add(a), S.mul(b), S.sub(c)], v = run(st, x0)[2];
return Qv(prog(st) + "<br>On choisit " + M(N(x0)) + ". Quel résultat obtient-on ?", v, M("(" + x0 + " + " + a + ") \\times " + b + " - " + c + " = " + (x0 + a) + " \\times " + b + " - " + c + " = " + N(v)) + ".",
{ ctx: "appliquer", guide: stepGuide(st, x0), traps: [TR(x0 + a * b - c, "On multiplie le résultat de l'étape précédente, " + (x0 + a) + ", pas seulement " + a + " : il faut des parenthèses."), TR((x0 + a) * b + c, "La dernière étape soustrait " + c + ".")] }); },
() => { const b = R.int(2, 5), a = R.int(3, 12), c = R.int(2, 4), x0 = -R.int(2, 9), st = [S.mul(b), S.add(a), S.mul(c)], vs = run(st, x0), v = vs[2];
if (vs[1] === 0) return null;
return Qv(prog(st) + "<br>On choisit " + M(N(x0)) + ". Quel résultat obtient-on ?", v, M("(" + P(x0) + " \\times " + b + " + " + a + ") \\times " + c + " = " + P(vs[1]) + " \\times " + c + " = " + N(v)) + ".",
{ ctx: "negatif", guide: stepGuide(st, x0), traps: [TR((-x0 * b + a) * c, "Le nombre de départ est négatif : " + P(x0) + " × " + b + " = " + N(x0 * b) + "."), TR(x0 * b + a * c, "On multiplie tout le résultat " + P(vs[1]) + " par " + c + ".")] }); },
() => { const b = R.int(2, 6), a = R.int(2, 15), x0 = R.int(4, 15), st = [S.mul(b), S.sub(a), S.addX()], vs = run(st, x0), v = vs[2];
return Qv(prog(st) + "<br>On choisit " + M(N(x0)) + ". Quel résultat obtient-on ?", v, M(x0 + " \\times " + b + " - " + a + " + " + x0 + " = " + N(v)) + " : la dernière étape rajoute le nombre de départ, " + M(N(x0)) + ".",
{ ctx: "depart", guide: stepGuide(st, x0), traps: [TR(vs[1], "Il reste la dernière étape : ajouter le nombre de départ."), TR(vs[1] * 2, "On ajoute le nombre de départ (" + x0 + "), pas le résultat obtenu.")] }); },
() => { const a = R.int(2, 7), x0 = R.int(2, 9), st = [S.add(a), S.sq()], v = run(st, x0)[1];
return Qv(prog(st) + "<br>On choisit " + M(N(x0)) + ". Quel résultat obtient-on ?", v, M("(" + x0 + " + " + a + ")^2 = " + (x0 + a) + "^2 = " + v) + ".",
{ ctx: "carre", guide: stepGuide(st, x0), traps: [TR(x0 * x0 + a * a, "On élève au carré le résultat, " + (x0 + a) + ", pas chaque nombre séparément."), TR(2 * (x0 + a), "Élever au carré, c'est multiplier par lui-même, pas par 2.")] }); },
],
2: [
() => { const b = R.int(2, 5), a = R.int(2, 9), c = R.int(2, 4), x0 = R.int(2, 12), st = [S.mul(b), S.add(a), S.mul(c)], vs = run(st, x0), Rv = vs[2];
return Qv(prog(st) + "<br>" + who() + " obtient " + M(N(Rv)) + ". Quel nombre a été choisi au départ ?", x0, "On remonte le programme avec les opérations inverses : " + M(N(Rv) + " \\div " + c + " = " + N(vs[1])) + ", " + M(N(vs[1]) + " - " + a + " = " + N(vs[0])) + ", " + M(N(vs[0]) + " \\div " + b + " = " + N(x0)) + ".",
{ ctx: "remonter", guide: [G("Avant « Multiplier par " + c + " », on avait ?", vs[1], M(N(Rv) + " \\div " + c + " = " + N(vs[1])) + "."), G("Avant « Ajouter " + a + " » ?", vs[0], M(N(vs[1]) + " - " + a + " = " + N(vs[0])) + "."), G("Nombre de départ ?", x0, M(N(vs[0]) + " \\div " + b + " = " + N(x0)) + ".")],
traps: [TR(((Rv - a) / b) / c, "On défait les étapes dans l'ordre inverse : d'abord la dernière (÷ " + c + ")."), TR(run(st, Rv)[2], "On ne réapplique pas le programme : on le remonte avec les opérations inverses.")] }); },
() => { const a = R.int(2, 9), b = R.int(2, 6), c = R.int(2, 20), st = [S.add(a), S.mul(b), S.sub(c)], cf = runP(st);
if (cf[0] === 0) return null;
const e = pol(cf);
return Qx(prog(st) + "<br>On choisit le nombre " + M("x") + ". Écris le résultat en fonction de " + M("x") + ", sous forme réduite.", e, M(b + "(x + " + a + ") - " + c + " = " + b + "x + " + a * b + " - " + c + " = " + e) + ".",
{ ctx: "expression", form: "reduced", guide: [GX("Après « Ajouter " + a + " » :", "x+" + a, M("x + " + a) + "."), GX("Après « Multiplier par " + b + " » (avec des parenthèses) :", b + "*(x+" + a + ")", M(b + "(x + " + a + ")") + "."), GX("Après « Soustraire " + c + " », réduit :", e, M(e) + ".", "reduced")],
traps: [TX("x+" + (a * b - c), "On multiplie toute la somme x + " + a + " par " + b + ", donc aussi x."), TX(b + "x+" + (a - c), "Développe : " + b + " × " + a + " = " + a * b + ".")] }); },
() => { const b = R.int(2, 5), a = R.int(2, 12), x0 = R.int(2, 11), st = [S.mul(b), S.sub(a), S.addX()], Rv = run(st, x0)[2], cf = runP(st), e = pol(cf);
return Qv(prog(st) + "<br>Quel nombre faut-il choisir au départ pour obtenir " + M(N(Rv)) + " ?", x0, "Avec " + M("x") + " au départ, le programme donne " + M(b + "x - " + a + " + x = " + e) + ". On résout " + M(e + " = " + N(Rv)) + " : " + M((b + 1) + "x = " + N(Rv + a)) + ", " + M("x = " + N(x0)) + ".",
{ ctx: "equation", guide: [GX("Écris le résultat en fonction de " + M("x") + " (réduit).", e, M(e) + "."), G("Résous " + M(e + " = " + N(Rv)) + ". Que vaut " + M("x") + " ?", x0, M((b + 1) + "x = " + N(Rv + a)) + " donc " + M("x = " + N(x0)) + ".")],
traps: [TR((Rv + a) / b, "Le nombre de départ est ajouté à la fin : il y a " + (b + 1) + "x en tout, pas " + b + "x."), TR(Rv - a, "Mets le programme en équation : " + e + " = " + Rv + ".")] }); },
],
3: [
() => { const a = R.int(2, 9), sg = pk([1, -1]), st = [sg > 0 ? S.add(a) : S.sub(a), S.sq(), S.subX2()], cf = runP(st), e = pol(cf), dv = sg > 0 ? "x^2 + " + 2 * a + "x + " + a * a : "x^2 - " + 2 * a + "x + " + a * a;
return Qx(prog(st) + "<br>Montre que le résultat est une expression du premier degré : écris-le en fonction du nombre de départ " + M("x") + ", sous forme réduite.", e, M("(x " + (sg > 0 ? "+ " : "- ") + a + ")^2 - x^2 = " + dv + " - x^2 = " + e) + ".",
{ ctx: "prouver-carre", form: "reduced", guide: [GX("Après les deux premières étapes : écris le carré.", "(x" + (sg > 0 ? "+" : "-") + a + ")^2", M("(x " + (sg > 0 ? "+ " : "- ") + a + ")^2") + "."), GX("Développe ce carré (identité remarquable).", dv.replace(/ /g, ""), M(dv) + "."), GX("Soustrais " + M("x^2") + " et réduis.", e, M(e) + ".", "reduced")],
traps: [TX(String(a * a), "N'oublie pas le double produit : (x " + (sg > 0 ? "+" : "−") + " " + a + ")² = x² " + (sg > 0 ? "+" : "−") + " " + 2 * a + "x + " + a * a + "."), TX((sg > 0 ? "" : "-") + 2 * a + "x-" + a * a, "Le carré " + a + "² = " + a * a + " est positif.")] }); },
() => { const k = R.int(2, 5), m = R.int(2, 9), stA = [S.mul(k), S.add(k * m), S.mul(2)], stB = [S.add(m), S.mul(2 * k)], e = pol(runP(stA));
return Qx(prog(stA, "Programme A") + "<br>" + prog(stB, "Programme B") + "<br>Prouve que les deux programmes donnent toujours le même résultat : écris ce résultat en fonction du nombre de départ " + M("x") + ", sous forme réduite.", e,
"A : " + M("2(" + k + "x + " + k * m + ") = " + e) + ". B : " + M(2 * k + "(x + " + m + ") = " + e) + ". Même expression : même résultat pour tout nombre de départ.",
{ ctx: "prouver-egal", form: "reduced", guide: [GX("Programme A, en fonction de " + M("x") + " (réduit) :", e, M("2(" + k + "x + " + k * m + ") = " + e) + ".", "reduced"), GX("Programme B, en fonction de " + M("x") + " (réduit) :", e, M(2 * k + "(x + " + m + ") = " + e) + " : c'est la même expression.", "reduced")],
traps: [TX(2 * k + "x+" + m, "Développe 2k(x + m) : chaque terme est multiplié."), TX(k + "x+" + 2 * k * m, "Dans A, la dernière étape multiplie tout le résultat par 2.")] }); },
() => { const a = R.int(2, 6), t = R.int(a + 1, 12), Rv = t * t - a * a, st = [S.add(a)];
const txt = "<b>Programme</b><br>• Choisir un nombre.<br>• Lui ajouter " + a + ".<br>• Multiplier le résultat par le nombre de départ diminué de " + a + ".";
return { q: txt + "<br>Quels nombres de départ donnent " + M(N(Rv)) + " ? (sépare les solutions par « ; »)", spec: { kind: "set", values: [-t, t] }, ctx: "produit",
sol: "Avec " + M("x") + " : " + M("(x + " + a + ")(x - " + a + ") = x^2 - " + a * a) + ". On résout " + M("x^2 - " + a * a + " = " + N(Rv)) + " : " + M("x^2 = " + t * t) + ", donc " + M("x = " + t) + " ou " + M("x = -" + t) + ".",
guide: [GX("Écris le résultat en fonction de " + M("x") + ", développé et réduit.", "x^2-" + a * a, M("(x + " + a + ")(x - " + a + ") = x^2 - " + a * a) + "."), G("Que vaut alors " + M("x^2") + " ?", t * t, M("x^2 = " + N(Rv) + " + " + a * a + " = " + t * t) + "."), GSet("Quels nombres ont pour carré " + t * t + " ?", [-t, t], M(t) + " et " + M("-" + t) + ".")],
traps: [TR(t, "Deux nombres ont pour carré " + t * t + ", à savoir " + t + " et −" + t + "."), TR(Math.sqrt(Rv), "Calcule d'abord le résultat en fonction de x : x² − " + a * a + ".")] }; },
],
};


const PCPROB = [() => {
const mn = (v) => N(v).replace(/^-/, "−");
const cx = pk(["deux-programmes", "retrouver", "carre"]);
if (cx === "deux-programmes") {
let a, b, c, e, xs, d, x0; do { a = R.int(2, 6); b = R.int(2, 4); c = R.int(1, 9); e = b + R.int(1, 3); xs = R.int(2, 9); d = (b - e) * xs + a * b - c; x0 = R.int(2, 7); } while (!d || x0 === xs);
const stA = [S.add(a), S.mul(b), S.sub(c)], stB = [S.mul(e), d >= 0 ? S.add(d) : S.sub(-d)];
return Object.assign(Pb(prog(stA, "Programme A") + "<br>" + prog(stB, "Programme B"), [["a) Résultat du programme A avec " + x0, run(stA, x0)[2]], ["b) Résultat du programme B avec " + x0, run(stB, x0)[1]], ["c) Nombre de départ qui donne le même résultat avec A et B", xs]],
["Avec x : A donne " + b + "(x + " + a + ") − " + c + ".", "Écris aussi B avec x, puis résous l'égalité des deux expressions."],
"a) " + M("(" + x0 + " + " + a + ") \\times " + b + " - " + c + " = " + run(stA, x0)[2]) + " ; b) " + M(x0 + " \\times " + e + (d >= 0 ? " + " + d : " - " + -d) + " = " + run(stB, x0)[1]) + " ; c) " + M(pol(runP(stA)) + " = " + pol(runP(stB))) + " donne " + M("x = " + xs) + "."), { ctx: cx });
}
if (cx === "retrouver") {
const b = R.int(2, 5), a = R.int(2, 9), c = R.int(2, 4), st = [S.mul(b), S.add(a), S.mul(c)], x1 = R.int(3, 9); let x2, x3; do { x2 = R.int(4, 15); x3 = -R.int(2, 8); } while (x2 === x1 || b * x3 + a === 0);
const f = (x) => run(st, x)[2], nom = pk(["Léa", "Hugo", "Chloé", "Nathan", "Manon", "Louis"]);
return Object.assign(Pb(nom + " propose un tour de magie : « Choisis un nombre et applique mon programme ; annonce-moi le résultat et je retrouve ton nombre. »<br>" + prog(st), [["a) Résultat avec " + x1, f(x1)], ["b) Un ami annonce " + mn(f(x2)) + ". Quel était son nombre ?", x2], ["c) Une amie annonce " + mn(f(x3)) + ". Quel était son nombre ?", x3]],
["Pour remonter le programme, on fait les opérations inverses dans l'ordre inverse.", "Inverse de « multiplier par " + c + " » : diviser par " + c + " ; inverse de « ajouter " + a + " » : soustraire " + a + "."],
"a) " + M("(" + x1 + " \\times " + b + " + " + a + ") \\times " + c + " = " + f(x1)) + " ; b) " + M("(" + N(f(x2)) + " \\div " + c + " - " + a + ") \\div " + b + " = " + x2) + " ; c) " + M("(" + N(f(x3)) + " \\div " + c + " - " + a + ") \\div " + b + " = " + N(x3)) + "."), { ctx: cx });
}
const a = R.int(2, 7), st = [S.add(a), S.sq(), S.subX2()], x1 = R.int(2, 9), x2 = -R.int(2, 9); let x3; do x3 = R.int(3, 15); while (x3 === x1);
const f = (x) => run(st, x)[2];
return Object.assign(Pb(prog(st), [["a) Résultat avec " + x1, f(x1)], ["b) Résultat avec " + mn(x2), f(x2)], ["c) Le résultat est " + mn(f(x3)) + ". Quel était le nombre de départ ?", x3]],
["Avec x : " + M("(x + " + a + ")^2 - x^2") + " ; développe.", M("(x + " + a + ")^2 = x^2 + " + 2 * a + "x + " + a * a) + "."],
"a) " + M("(" + x1 + " + " + a + ")^2 - " + x1 + "^2 = " + (x1 + a) ** 2 + " - " + x1 * x1 + " = " + f(x1)) + " ; b) " + M("(" + N(x2) + " + " + a + ")^2 - (" + N(x2) + ")^2 = " + (x2 + a) ** 2 + " - " + x2 * x2 + " = " + N(f(x2))) + " ; c) le résultat vaut " + M(2 * a + "x + " + a * a) + " : " + M(2 * a + "x + " + a * a + " = " + f(x3)) + " donne " + M("x = " + x3) + "."), { ctx: cx });
}];


const RT = (a, b, c) => M(a + "\\,:\\," + b + (c ? "\\,:\\," + c : ""));
const RAT = {
1: [
() => { const [a, b] = pk([[2, 3], [3, 5], [1, 4], [3, 4], [2, 5], [5, 7], [4, 5], [1, 3], [3, 7]]), u = R.int(4, 30), S0 = u * (a + b), p1 = who(), p2 = who(), two = R.rand() < 0.5, v = (two ? b : a) * u;
if (p1 === p2) return null;
return Qv(p1 + " et " + p2 + " se partagent " + M(N(S0)) + " € selon le ratio " + RT(a, b) + " (" + p1 + " d'abord). Combien reçoit " + (two ? p2 : p1) + " (en €) ?", v,
"Il y a " + M(a + " + " + b + " = " + (a + b)) + " parts ; une part vaut " + M(N(S0) + " \\div " + (a + b) + " = " + N(u)) + " € ; " + (two ? p2 : p1) + " reçoit " + M((two ? b : a) + " \\times " + N(u) + " = " + N(v)) + " €.",
{ ctx: "partage", guide: [G("Combien de parts en tout ?", a + b, M(a + " + " + b + " = " + (a + b)) + "."), G("Valeur d'une part (en €) ?", u, M(N(S0) + " \\div " + (a + b) + " = " + N(u)) + " €."), G("Part de " + (two ? p2 : p1) + " (en €) ?", v, M((two ? b : a) + " \\times " + N(u) + " = " + N(v)) + " €.")],
traps: [TR(S0 / 2, "Le partage n'est pas égal : il suit le ratio " + a + " ∶ " + b + "."), TR(u, "C'est la valeur d'une part ; " + (two ? p2 : p1) + " en reçoit " + (two ? b : a) + "."), TR((two ? a : b) * u, "C'est la part de " + (two ? p1 : p2) + ".")] }); },
() => { const [a, b] = pk([[2, 3], [3, 4], [1, 2], [3, 5], [2, 7], [4, 5], [5, 6], [1, 3]]), k = R.int(2, 9), c = pk([["filles", "garçons", "Dans un club de basket de " + ville() + ", il y a"], ["romans", "BD", "Au CDI, on compte"], ["chats", "chiens", "Dans un refuge de " + ville() + ", il y a"], ["adultes", "enfants", "Dans un car pour " + ville() + ", il y a"]]);
return { q: c[2] + " " + M(a * k) + " " + c[0] + " et " + M(b * k) + " " + c[1] + ". Écris le ratio " + c[0] + " : " + c[1] + " sous forme irréductible. Réponds « a ; b ».", spec: { kind: "pair", values: [a, b] }, ctx: "simplifier",
sol: "On divise les deux nombres par " + k + " : " + RT(a * k, b * k) + " = " + RT(a, b) + ".",
guide: [G("Par quel plus grand nombre peut-on diviser " + (a * k) + " et " + (b * k) + " ?", k, M(a * k + " = " + k + " \\times " + a) + " et " + M(b * k + " = " + k + " \\times " + b) + "."), { ask: "Ratio irréductible ? Réponds « a ; b ».", spec: { kind: "pair", values: [a, b] }, sol: RT(a, b) + "." }],
traps: [TR(a / b, "Un ratio s'écrit avec deux nombres : réponds « " + a + " ; " + b + " ».")] }; },
() => { const c = pk([["une vinaigrette", "d'huile", "de vinaigre", "cL", 3, 1], ["un mortier", "de sable", "de ciment", "seaux", 4, 1], ["un sirop dilué", "d'eau", "de sirop", "cL", 7, 1], ["une peinture verte", "de jaune", "de bleu", "L", 2, 3], ["un cocktail de fruits", "de jus d'orange", "de jus d'ananas", "cL", 3, 2]]), [, x, y, un, a, b] = c, k = R.int(2, 12), rev = R.rand() < 0.5;
const given = rev ? a * k : b * k, v = rev ? b * k : a * k;
return Qv("Pour " + c[0] + ", les quantités " + x + " et " + y + " sont dans le ratio " + RT(a, b) + ". On utilise " + M(given) + " " + un + " " + (rev ? x : y) + ". Combien de " + un + " " + (rev ? y : x) + " faut-il ?", v,
"Une part vaut " + M(given + " \\div " + (rev ? a : b) + " = " + k) + " " + un + " ; il faut " + M((rev ? b : a) + " \\times " + k + " = " + v) + " " + un + ".",
{ ctx: "recette", guide: [G("Valeur d'une part (" + un + ") ?", k, M(given + " \\div " + (rev ? a : b) + " = " + k) + "."), G("Quantité cherchée (" + un + ") ?", v, M((rev ? b : a) + " \\times " + k + " = " + v) + ".")],
traps: [TR(rev ? given * a / b : given * b / a, "Le ratio est " + a + " ∶ " + b + " dans l'ordre « " + x.replace(/^d(e |')/, "") + " : " + y.replace(/^d(e |')/, "") + " »."), TR(given + Math.abs(a - b), "Ce n'est pas une différence fixe : on multiplie chaque part par le même nombre.")] }); },
],
2: [
() => { const t = pk([[1, 2, 3], [2, 3, 5], [1, 3, 4], [2, 3, 4], [3, 4, 5], [1, 2, 5], [2, 5, 7]]), su = t[0] + t[1] + t[2], u = R.int(3, 25) * 2, Mt = su * u, i = R.int(0, 2), nm = ["premier", "deuxième", "troisième"][i];
const c = pk([["Une coopérative de Bretagne partage", "kg de pommes", "entre trois épiceries"], ["Un producteur de la Drôme répartit", "kg d'abricots", "entre trois marchés"], ["Une boulangerie de " + ville() + " partage", "kg de farine", "entre trois fournées"]]);
return Qv(c[0] + " " + M(N(Mt)) + " " + c[1] + " " + c[2] + " selon le ratio " + RT(t[0], t[1], t[2]) + ". Quelle masse reçoit le " + nm + " (en kg) ?", t[i] * u,
M(t[0] + " + " + t[1] + " + " + t[2] + " = " + su) + " parts ; une part : " + M(N(Mt) + " \\div " + su + " = " + N(u)) + " kg ; le " + nm + " reçoit " + M(t[i] + " \\times " + N(u) + " = " + N(t[i] * u)) + " kg.",
{ ctx: "trois", guide: [G("Nombre total de parts ?", su, M(t[0] + " + " + t[1] + " + " + t[2] + " = " + su) + "."), G("Une part (kg) ?", u, M(N(Mt) + " \\div " + su + " = " + N(u)) + "."), G("Masse du " + nm + " (kg) ?", t[i] * u, M(t[i] + " \\times " + N(u) + " = " + N(t[i] * u)) + ".")],
traps: [TR(Mt / 3, "Le partage suit le ratio, il n'est pas égal."), TR(Mt * t[i] / 10, "On divise par le nombre total de parts (" + su + "), pas par 10.")] }); },
() => { const [a, b] = pk([[2, 3], [3, 5], [4, 7], [3, 4], [5, 8], [2, 5]]), u = R.int(3, 15), tot = R.rand() < 0.5, c = pk([["garçons", "filles", "Dans un collège de " + ville() + ", le ratio garçons : filles est"], ["élèves demi-pensionnaires", "élèves externes", "Dans une classe, le ratio demi-pensionnaires : externes est"], ["billes rouges", "billes bleues", "Dans un sac, le ratio rouges : bleues est"]]), v = tot ? (a + b) * u : b * u;
return Qv(c[2] + " " + RT(a, b) + ". Il y a " + M(a * u) + " " + c[0] + ". " + (tot ? "Combien y en a-t-il en tout ?" : "Combien y a-t-il de " + c[1] + " ?"), v,
M(a * u + " \\div " + a + " = " + u) + " par part ; " + (tot ? M((a + b) + " \\times " + u + " = " + v) + " en tout." : M(b + " \\times " + u + " = " + v) + " " + c[1] + "."),
{ ctx: "partconnue", guide: [G("Combien vaut une part ?", u, M(a * u + " \\div " + a + " = " + u) + "."), G(tot ? "Effectif total ?" : "Nombre de " + c[1] + " ?", v, (tot ? M((a + b) + " \\times " + u) : M(b + " \\times " + u)) + " " + M("= " + v) + ".")],
traps: [TR(a * u + b, "Le ratio n'ajoute pas " + b + " : chaque part vaut " + u + "."), TR(tot ? b * u : (a + b) * u, tot ? "Ajoute aussi les " + c[0] + "." : "On demande seulement les " + c[1] + ".")] }); },
() => { const g = R.int(2, 6), [a, b] = pk([[2, 3], [3, 4], [3, 5], [4, 5], [5, 6]]), x = a * g, y = b * g, u = R.int(3, 20) * 5, S0 = (a + b) * u, old = R.rand() < 0.5;
const c = pk([["Deux sœurs de " + x + " et " + y + " ans se partagent " + M(N(S0)) + " € proportionnellement à leur âge.", "la plus âgée", "la plus jeune"], ["Deux amis ont payé " + x + " € et " + y + " € un billet de loterie qui gagne " + M(N(S0)) + " €. Ils partagent le gain proportionnellement à leur mise.", "celui qui a payé " + y + " €", "celui qui a payé " + x + " €"]]);
const v = (old ? b : a) * u;
return Qv(c[0] + " Combien reçoit " + (old ? c[1] : c[2]) + " (en €) ?", v, "Ratio " + RT(x, y) + " = " + RT(a, b) + " ; " + (a + b) + " parts de " + M(N(S0) + " \\div " + (a + b) + " = " + N(u)) + " € ; part : " + M((old ? b : a) + " \\times " + N(u) + " = " + N(v)) + " €.",
{ ctx: "ages", guide: [G("Ratio simplifié " + x + " ∶ " + y + " = " + a + " ∶ … ?", b, RT(x, y) + " = " + RT(a, b) + " (on divise par " + g + ")."), G("Valeur d'une part (en €) ?", u, M(N(S0) + " \\div " + (a + b) + " = " + N(u)) + " €."), G("Part demandée (en €) ?", v, M((old ? b : a) + " \\times " + N(u) + " = " + N(v)) + " €.")],
traps: [TR(S0 / 2, "Le partage est proportionnel, pas égal."), TR((old ? a : b) * u, "C'est l'autre part.")] }); },
],
3: [
() => { const [a, b] = pk([[3, 5], [4, 7], [2, 5], [5, 8], [3, 8], [5, 9]]), u = R.int(4, 30), d = (b - a) * u, S0 = (a + b) * u;
return Qv("Une somme est partagée selon le ratio " + RT(a, b) + ". La plus grande part dépasse la plus petite de " + M(N(d)) + " €. Quelle est la somme partagée (en €) ?", S0,
"L'écart correspond à " + M(b + " - " + a + " = " + (b - a)) + " parts, donc une part vaut " + M(N(d) + " \\div " + (b - a) + " = " + N(u)) + " € ; la somme est " + M((a + b) + " \\times " + N(u) + " = " + N(S0)) + " €.",
{ ctx: "ecart", guide: [G("L'écart correspond à combien de parts ?", b - a, M(b + " - " + a + " = " + (b - a)) + "."), G("Valeur d'une part (en €) ?", u, M(N(d) + " \\div " + (b - a) + " = " + N(u)) + " €."), G("Somme partagée (en €) ?", S0, M((a + b) + " \\times " + N(u) + " = " + N(S0)) + " €.")],
traps: [TR(d * (a + b), "Divise d'abord l'écart par le nombre de parts d'écart (" + (b - a) + ")."), TR(b * u, "C'est seulement la plus grande part.")] }); },
() => { const [a, b] = pk([[2, 3], [1, 4], [3, 5], [3, 7], [1, 3], [5, 7], [2, 7]]), c = pk([["garçons", "filles", "Dans une classe"], ["élèves qui mangent à la cantine", "élèves qui rentrent chez eux", "Dans un collège de " + ville()], ["voitures électriques", "voitures thermiques", "Sur un parking de " + ville()]]), pct = 100 % (a + b) === 0 && R.rand() < 0.5, v = pct ? 100 * b / (a + b) : b / (a + b);
return Qv(c[2] + ", le ratio " + c[0] + " : " + c[1] + " est " + RT(a, b) + ". " + (pct ? "Quel pourcentage du total représentent les " + c[1] + " ?" : "Quelle fraction du total représentent les " + c[1] + " ? (fraction)"), v,
"Sur " + M(a + " + " + b + " = " + (a + b)) + " parts, " + b + " sont des " + c[1] + " : " + M("\\frac{" + b + "}{" + (a + b) + "}") + (pct ? " " + M("= " + N(v) + "\\,\\%") : "") + ".",
{ ctx: "fraction", guide: [G("Nombre total de parts ?", a + b, M(a + " + " + b + " = " + (a + b)) + "."), G(pct ? "Pourcentage ?" : "Fraction du total ?", v, M("\\frac{" + b + "}{" + (a + b) + "}") + (pct ? " = " + N(v) + " %" : "") + ".")],
traps: [TR(pct ? 100 * b / a : b / a, "Le ratio compare les deux groupes ; ici on compare au total (" + (a + b) + " parts)."), TR(pct ? 100 * a / (a + b) : a / (a + b), "C'est la part des " + c[0] + ".")] }); },
() => { const [a, b] = pk([[2, 3], [1, 2], [3, 4], [2, 5], [3, 2]]), uj = R.int(2, 8), ub = uj + pk([-2, -1, 1, 2, 3]); if (ub < 1 || ub === uj) return null;
const J = a * uj, B = b * ub, m = Math.min(uj, ub), v = (a + b) * m;
return Qv("Pour obtenir du vert, on mélange du jaune et du bleu dans le ratio " + RT(a, b) + ". On dispose de " + M(J) + " L de jaune et de " + M(B) + " L de bleu. Quelle quantité maximale de vert peut-on préparer (en L) ?", v,
"Le jaune permet " + M(J + " \\div " + a + " = " + uj) + " lots, le bleu " + M(B + " \\div " + b + " = " + ub) + " lots : on peut en faire " + m + ", soit " + M((a + b) + " \\times " + m + " = " + v) + " L.",
{ ctx: "melange", guide: [G("Nombre de « parts » possibles avec le jaune (" + J + " ÷ " + a + ") ?", uj, M(uj) + "."), G("Avec le bleu (" + B + " ÷ " + b + ") ?", ub, M(ub) + "."), G("Quantité maximale de vert (L) ?", v, "On est limité à " + m + " : " + M((a + b) + " \\times " + m + " = " + v) + " L.")],
traps: [TR(J + B, "On ne peut pas tout utiliser : il faut respecter le ratio " + a + " ∶ " + b + "."), TR((a + b) * Math.max(uj, ub), "La couleur qui manque le plus limite la quantité.")] }); },
],
};
const RATPROB = [() => {
const cx = pk(["associees", "patisserie", "beton", "cagnotte"]);
if (cx === "associees") {
const t = pk([[2, 3, 5], [1, 2, 3], [3, 4, 5], [2, 3, 4], [1, 3, 4], [2, 5, 6]]), k = R.int(2, 6) * 1000, su = t[0] + t[1] + t[2], u = R.int(2, 9) * 50, B = su * u;
return Object.assign(Pb("Trois associées d'une entreprise de " + ville() + " ont apporté " + M(N(t[0] * k)) + " €, " + M(N(t[1] * k)) + " € et " + M(N(t[2] * k)) + " €. Elles partagent un bénéfice de " + M(N(B)) + " € proportionnellement à leurs apports.",
[["a) Part de la première (€)", t[0] * u], ["b) Part de la deuxième (€)", t[1] * u], ["c) Part de la troisième (€)", t[2] * u]],
["Simplifie le ratio des apports : " + t.join(" ∶ ") + ".", "Une part vaut " + N(B).replace("\\,", " ") + " ÷ " + su + "."],
"Ratio " + RT(t[0], t[1], t[2]) + ", " + su + " parts de " + M(N(u)) + " € : " + M(N(t[0] * u)) + " €, " + M(N(t[1] * u)) + " € et " + M(N(t[2] * u)) + " €."), { ctx: cx });
}
if (cx === "patisserie") {
const [pate, ing, t] = pk([["une pâte sablée", ["farine", "beurre", "sucre"], [4, 2, 1]], ["une pâte brisée", ["farine", "beurre", "eau"], [4, 2, 1]], ["un crumble", ["farine", "beurre", "sucre"], [3, 2, 2]], ["une pâte à cookies", ["farine", "beurre", "sucre"], [5, 3, 2]]]), su = t[0] + t[1] + t[2], u = 10 * R.int(6, 20), Tm = su * u;
return Object.assign(Pb("Pour " + pate + ", un pâtissier de " + ville() + " mélange " + ing.join(", ").replace(/, ([^,]*)$/, " et $1") + " au ratio " + RT(t[0], t[1], t[2]) + " (en masse). Il prépare " + M(N(Tm)) + " g de pâte.",
[["a) Masse de " + ing[0] + " (g)", t[0] * u], ["b) Masse de " + ing[1] + " (g)", t[1] * u], ["c) Masse de " + ing[2] + " (g)", t[2] * u]],
["Le ratio " + t.join(" ∶ ") + " fait " + su + " parts en tout.", "Une part pèse " + Tm + " ÷ " + su + " g."],
su + " parts de " + M(N(Tm) + " \\div " + su + " = " + u) + " g : " + ing.map((x, i) => x + " " + M(t[i] + " \\times " + u + " = " + t[i] * u) + " g").join(", ") + "."), { ctx: cx });
}
if (cx === "beton") {
const t = pk([[1, 2, 3], [1, 2, 4], [1, 3, 5], [2, 3, 5]]), su = t[0] + t[1] + t[2], u = 10 * R.int(5, 40), Tm = su * u;
return Object.assign(Pb("Pour couler une dalle de terrasse, un maçon de " + ville() + " mélange ciment, sable et gravier au ratio " + RT(t[0], t[1], t[2]) + " (en masse). Il lui faut " + M(N(Tm)) + " kg de mélange sec.",
[["a) Masse de ciment (kg)", t[0] * u], ["b) Masse de sable (kg)", t[1] * u], ["c) Masse de gravier (kg)", t[2] * u]],
["Additionne les nombres du ratio : " + su + " parts.", "Une part pèse " + Tm + " ÷ " + su + " kg."],
su + " parts de " + M(N(Tm) + " \\div " + su + " = " + u) + " kg : ciment " + M(N(t[0] * u)) + " kg, sable " + M(N(t[1] * u)) + " kg, gravier " + M(N(t[2] * u)) + " kg."), { ctx: cx });
}
const m = pk([[2, 3, 5], [1, 2, 2], [3, 3, 4], [2, 4, 6], [1, 4, 5]]), su = m[0] + m[1] + m[2], u = R.int(3, 40) * 10, G = su * u, noms = pk([["Inès", "Tom", "Lina"], ["Jules", "Maël", "Sarah"], ["Emma", "Noah", "Jade"]]);
return Object.assign(Pb(noms[0] + ", " + noms[1] + " et " + noms[2] + " ont acheté ensemble un ticket de tombola de la fête de leur village, en payant " + m[0] + " €, " + m[1] + " € et " + m[2] + " €. Le ticket gagne un bon d'achat de " + M(N(G)) + " €, partagé proportionnellement aux mises.",
[["a) Part de " + noms[0] + " (€)", m[0] * u], ["b) Part de " + noms[2] + " (€)", m[2] * u], ["c) Écart entre la plus grande et la plus petite part (€)", (Math.max(...m) - Math.min(...m)) * u]],
["Ratio des mises : " + m.join(" ∶ ") + ", soit " + su + " parts.", "Une part vaut " + G + " ÷ " + su + " €."],
su + " parts de " + M(N(G) + " \\div " + su + " = " + u) + " € : " + noms[0] + " " + M(N(m[0] * u)) + " €, " + noms[1] + " " + M(N(m[1] * u)) + " €, " + noms[2] + " " + M(N(m[2] * u)) + " € ; écart " + M(N((Math.max(...m) - Math.min(...m)) * u)) + " €."), { ctx: cx });
}];



const TRI = [["A", "B", "C", "I", "J", "K"], ["E", "F", "G", "M", "N", "P"], ["R", "S", "T", "K", "L", "U"]];
const triFig = (L, o = {}) => {
const X = { A: [150 + (o.dx || 0), 18], B: [28, 182], C: [300, 172] }, mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
X.I = mid(X.A, X.B); X.J = mid(X.A, X.C); X.K = mid(X.B, X.C);
const seg = (p, q, cls = "f-line", extra = "") => '<line x1="' + X[p][0] + '" y1="' + X[p][1] + '" x2="' + X[q][0] + '" y2="' + X[q][1] + '" class="' + cls + '"' + extra + "/>";
const tick = (p, q, n) => { const m = mid(X[p], X[q]), dx = X[q][0] - X[p][0], dy = X[q][1] - X[p][1], l = Math.hypot(dx, dy), ux = -dy / l, uy = dx / l, tx = dx / l, ty = dy / l; let g = "";
for (let k = 0; k < n; k++) { const off = (k - (n - 1) / 2) * 4; g += '<line x1="' + (m[0] + tx * off - ux * 6) + '" y1="' + (m[1] + ty * off - uy * 6) + '" x2="' + (m[0] + tx * off + ux * 6) + '" y2="' + (m[1] + ty * off + uy * 6) + '" class="f-accent" stroke-width="1.6"/>'; } return g; };
const lab = (t, x, y) => '<text x="' + x + '" y="' + y + '" class="f-txt" font-size="15" text-anchor="middle">' + t + "</text>";
const vlab = (p, q, t, side = 1, at = 0.5) => { const m = [X[p][0] + (X[q][0] - X[p][0]) * at, X[p][1] + (X[q][1] - X[p][1]) * at], dx = X[q][0] - X[p][0], dy = X[q][1] - X[p][1], l = Math.hypot(dx, dy), o = (16 + 14 * Math.abs(dy / l)) * side; return '<text x="' + (m[0] - dy / l * o) + '" y="' + (m[1] + dx / l * o + 5) + '" class="f-accent f-txt" font-size="14" text-anchor="middle">' + t + "</text>"; };
let g = '<polygon points="' + ["A", "B", "C"].map((p) => X[p].join(",")).join(" ") + '" class="f-shape"/>';
(o.segs || []).forEach(([p, q, dash]) => (g += seg(p, q, "f-blue", dash ? ' stroke-dasharray="5 4" stroke-width="1.8"' : ' stroke-width="2"')));
(o.ticks || []).forEach(([p, q, n]) => (g += tick(p, q, n)));
(o.pts || []).forEach((p) => (g += '<circle cx="' + X[p][0] + '" cy="' + X[p][1] + '" r="3" class="f-dot"/>'));
const off = { A: [0, -4], B: [-12, 14], C: [12, 12], I: [-14, 0], J: [14, 0], K: [0, 22] };
["A", "B", "C", ...(o.pts || [])].forEach((p) => (g += lab(L["ABCIJK".indexOf(p)], X[p][0] + off[p][0], X[p][1] + off[p][1])));
(o.vals || []).forEach(([p, q, t, side, at]) => (g += vlab(p, q, t, side, at)));
return '<svg class="fig" viewBox="0 0 330 ' + (o.pts && o.pts.includes("K") ? 214 : 204) + '" role="img" aria-label="triangle et milieux">' + g + "</svg>";
};
const sq = (a, b) => "[" + a + b + "]", dr = (a, b) => "(" + a + b + ")";
const MI = {
1: [
() => { const L = pk(TRI), [A, B, C, I, J] = L, bc = R.int(5, 30) + pk([0, 0, 0.4, 0.6]), v = bc / 2;
return Qv(M(I) + " et " + M(J) + " sont les milieux des côtés " + M(sq(A, B)) + " et " + M(sq(A, C)) + " du triangle " + M(A + B + C) + ", et " + M(B + C + " = " + N(bc)) + " cm. Calcule " + M(I + J) + " (en cm).", v,
"La droite des milieux : le segment qui joint les milieux de deux côtés mesure la moitié du troisième côté. " + M(I + J + " = " + N(bc) + " \\div 2 = " + N(v)) + " cm.",
{ ctx: "moitie", fig: triFig(L, { pts: ["I", "J"], segs: [["I", "J"]], ticks: [["A", "I", 1], ["I", "B", 1], ["A", "J", 2], ["J", "C", 2]], vals: [["B", "C", N(bc).replace("{,}", ",") + " cm", 1]] }),
guide: [G(M(I + J) + " est-il la moitié ou le double de " + M(B + C) + " ? Coefficient (nombre par lequel on multiplie " + M(B + C) + ") :", 0.5, "La moitié : " + M(I + J + " = \\frac{1}{2}\\," + B + C) + "."), G(M(I + J) + " (en cm) ?", v, M(N(bc) + " \\div 2 = " + N(v)) + ".")],
traps: [TR(2 * bc, "Le segment des milieux est plus court : c'est la moitié."), TR(bc, "Le segment des milieux mesure la moitié du troisième côté.")] }); },
() => { const L = pk(TRI), [A, B, C, I, J] = L, ij = R.int(3, 19) + pk([0, 0, 0.5, 0.25]), v = 2 * ij;
return Qv("Dans le triangle " + M(A + B + C) + ", " + M(I) + " est le milieu de " + M(sq(A, B)) + " et " + M(J) + " celui de " + M(sq(A, C)) + ". On mesure " + M(I + J + " = " + N(ij)) + " cm. Quelle est la longueur " + M(B + C) + " (en cm) ?", v,
M(I + J + " = \\frac{1}{2}\\," + B + C) + ", donc " + M(B + C + " = 2 \\times " + N(ij) + " = " + N(v)) + " cm.",
{ ctx: "double", fig: triFig(L, { pts: ["I", "J"], segs: [["I", "J"]], ticks: [["A", "I", 1], ["I", "B", 1], ["A", "J", 2], ["J", "C", 2]], vals: [["I", "J", N(ij).replace("{,}", ",") + " cm", -1]] }),
guide: [G("Par combien multiplie-t-on " + M(I + J) + " pour obtenir " + M(B + C) + " ?", 2, M(B + C + " = 2 \\times " + I + J) + "."), G(M(B + C) + " (en cm) ?", v, M("2 \\times " + N(ij) + " = " + N(v)) + ".")],
traps: [TR(ij / 2, I + J + " est la moitié de " + B + C + " : " + B + C + " est donc le double."), TR(ij + 2, "On multiplie par 2, on n'ajoute pas 2.")] }); },
() => { const L = pk(TRI), [A, B, C, I, J, K] = L, a = R.int(6, 20), b = R.int(6, 20), c = R.int(Math.abs(a - b) + 2, a + b - 2), P0 = a + b + c, v = P0 / 2;
return Qv(M(I) + ", " + M(J) + " et " + M(K) + " sont les milieux des côtés " + M(sq(A, B)) + ", " + M(sq(A, C)) + " et " + M(sq(B, C)) + " du triangle " + M(A + B + C) + ", avec " + M(A + B + " = " + a) + " cm, " + M(A + C + " = " + b) + " cm et " + M(B + C + " = " + c) + " cm. Quel est le périmètre du triangle " + M(I + J + K) + " (en cm) ?", v,
"Chaque côté de " + M(I + J + K) + " mesure la moitié d'un côté de " + M(A + B + C) + " : le périmètre est la moitié de " + M(a + " + " + b + " + " + c + " = " + P0) + ", soit " + M(N(v)) + " cm.",
{ ctx: "perimetre", fig: triFig(L, { pts: ["I", "J", "K"], segs: [["I", "J"], ["J", "K"], ["K", "I"]], ticks: [["A", "I", 1], ["I", "B", 1], ["A", "J", 2], ["J", "C", 2], ["B", "K", 3], ["K", "C", 3]] }),
guide: [G("Périmètre de " + M(A + B + C) + " (cm) ?", P0, M(a + " + " + b + " + " + c + " = " + P0) + "."), G("Périmètre de " + M(I + J + K) + " (cm) ?", v, "La moitié : " + M(N(v)) + ".")],
traps: [TR(P0, "Chaque côté du petit triangle est la moitié d'un côté du grand."), TR(P0 / 4, "Les longueurs sont divisées par 2 (ce sont les aires qui sont divisées par 4).")] }); },
],
2: [
() => { const L = pk(TRI), [A, B, C, I, J] = L, ac = R.int(6, 30) + pk([0, 0, 0.4]), v = ac / 2;
return Qv("Dans le triangle " + M(A + B + C) + ", " + M(I) + " est le milieu de " + M(sq(A, B)) + ". La parallèle à " + M(dr(B, C)) + " passant par " + M(I) + " coupe " + M(sq(A, C)) + " en " + M(J) + ". On sait que " + M(A + C + " = " + N(ac)) + " cm. Calcule " + M(A + J) + " (en cm).", v,
"Une droite qui passe par le milieu d'un côté et qui est parallèle à un deuxième côté coupe le troisième côté en son milieu : " + M(J) + " est le milieu de " + M(sq(A, C)) + ", donc " + M(A + J + " = " + N(ac) + " \\div 2 = " + N(v)) + " cm.",
{ ctx: "parallele", fig: triFig(L, { pts: ["I", "J"], segs: [["I", "J", true]], ticks: [["A", "I", 1], ["I", "B", 1]], vals: [["A", "C", N(ac).replace("{,}", ",") + " cm", -1, 0.3]] }),
guide: [G("D'après le théorème, " + M(J) + " est le milieu de " + M(sq(A, C)) + ". Quelle fraction de " + M(A + C) + " vaut " + M(A + J) + " ? (décimal)", 0.5, "La moitié."), G(M(A + J) + " (en cm) ?", v, M(N(ac) + " \\div 2 = " + N(v)) + ".")],
traps: [TR(ac, M(J) + " est le milieu : " + A + J + " est la moitié de " + A + C + "."), TR(2 * ac, "On prend la moitié, pas le double.")] }); },
() => { const L = pk(TRI), [A, B, C, I, J] = L, bc = R.int(8, 30), v = bc / 2;
return Qv("Dans le triangle " + M(A + B + C) + ", la droite passant par le milieu " + M(I) + " de " + M(sq(A, B)) + " et parallèle à " + M(dr(B, C)) + " coupe " + M(sq(A, C)) + " en " + M(J) + ". Sachant que " + M(B + C + " = " + bc) + " cm, calcule " + M(I + J) + " (en cm).", v,
"D'abord, " + M(J) + " est le milieu de " + M(sq(A, C)) + " (parallèle passant par un milieu). Puis " + M(I + J + " = \\frac{1}{2}\\," + B + C + " = " + N(v)) + " cm.",
{ ctx: "deuxtheoremes", fig: triFig(L, { pts: ["I", "J"], segs: [["I", "J", true]], ticks: [["A", "I", 1], ["I", "B", 1]], vals: [["B", "C", bc + " cm", 1]] }),
guide: [G("Combien de milieux de côtés a-t-on maintenant (" + M(I) + " et " + M(J) + ") ?", 2, M(J) + " est aussi un milieu, d'après le premier théorème."), G(M(I + J) + " (en cm) ?", v, M(bc + " \\div 2 = " + N(v)) + ".")],
traps: [TR(bc, "Le segment qui joint deux milieux mesure la moitié du troisième côté."), TR(2 * bc, "La moitié, pas le double.")] }); },
() => { const p = R.int(6, 24), q = R.int(6, 24), v = p + q, Q = pk([["A", "B", "C", "D", "I", "J", "K", "L"], ["E", "F", "G", "H", "M", "N", "P", "R"]]);
const X = { A: [40, 40], B: [250, 22], C: [300, 170], D: [70, 190] }, mid = (a, b) => [(X[a][0] + X[b][0]) / 2, (X[a][1] + X[b][1]) / 2], Mi = [mid("A", "B"), mid("B", "C"), mid("C", "D"), mid("D", "A")];
let g = '<polygon points="' + ["A", "B", "C", "D"].map((k) => X[k].join(",")).join(" ") + '" class="f-shape"/>' + '<line x1="40" y1="40" x2="300" y2="170" class="f-line" stroke-dasharray="5 4"/><line x1="250" y1="22" x2="70" y2="190" class="f-line" stroke-dasharray="5 4"/>';
g += '<polygon points="' + Mi.map((m) => m.join(",")).join(" ") + '" fill="none" class="f-blue" stroke-width="2"/>';
const off = [[-12, -8], [14, 2], [6, 18], [-16, 4]], vo = [[-12, -6], [14, -4], [14, 14], [-14, 14]];
["A", "B", "C", "D"].forEach((k, i) => (g += '<text x="' + (X[k][0] + vo[i][0]) + '" y="' + (X[k][1] + vo[i][1]) + '" class="f-txt" font-size="15" text-anchor="middle">' + Q[i] + "</text>"));
Mi.forEach((m, i) => (g += '<circle cx="' + m[0] + '" cy="' + m[1] + '" r="3" class="f-dot"/><text x="' + (m[0] + off[i][0]) + '" y="' + (m[1] + off[i][1]) + '" class="f-txt" font-size="15" text-anchor="middle">' + Q[4 + i] + "</text>"));
const fig = '<svg class="fig" viewBox="0 0 330 214" role="img" aria-label="quadrilatère, ses diagonales et les milieux de ses côtés">' + g + "</svg>";
const [qa, qb, qc, qd, qi, qj, qk, ql] = Q;
return Qv(M(qi) + ", " + M(qj) + ", " + M(qk) + ", " + M(ql) + " sont les milieux des côtés " + M(sq(qa, qb)) + ", " + M(sq(qb, qc)) + ", " + M(sq(qc, qd)) + ", " + M(sq(qd, qa)) + " du quadrilatère " + M(qa + qb + qc + qd) + ". Ses diagonales mesurent " + M(qa + qc + " = " + p) + " cm et " + M(qb + qd + " = " + q) + " cm. Quel est le périmètre de " + M(qi + qj + qk + ql) + " (en cm) ?", v,
"Dans le triangle " + M(qa + qb + qc) + ", " + M(qi + qj + " = \\frac{1}{2}\\," + qa + qc) + " ; de même " + M(qk + ql + " = \\frac{1}{2}\\," + qa + qc) + ", et " + M(qj + qk + " = " + ql + qi + " = \\frac{1}{2}\\," + qb + qd) + ". Périmètre : " + M(qa + qc + " + " + qb + qd + " = " + v) + " cm.",
{ ctx: "quadrilatere", fig, guide: [G(M(qi + qj) + " (dans le triangle " + M(qa + qb + qc) + ") en cm ?", p / 2, M("\\frac{1}{2} \\times " + p + " = " + N(p / 2)) + "."), G(M(qj + qk) + " (dans le triangle " + M(qb + qc + qd) + ") en cm ?", q / 2, M(N(q / 2)) + "."), G("Périmètre de " + M(qi + qj + qk + ql) + " (cm) ?", v, M("2 \\times " + N(p / 2) + " + 2 \\times " + N(q / 2) + " = " + v) + ".")],
traps: [TR(v / 2, "Il y a deux segments égaux à la moitié de chaque diagonale."), TR(2 * v, "Chaque côté de " + qi + qj + qk + ql + " est la moitié d'une diagonale.")] }); },
],
3: [
() => { const L = pk(TRI), [A, B, C, I, J] = L, x = R.int(2, 9), p = R.int(2, 5), q = R.int(1, 9), d = pk([1, 2, 3, -1]), r = 2 * p + d, s = 2 * (p * x + q) - r * x;
if (r <= 0 || s === 0) return null;
const bcT = r + "x " + (s > 0 ? "+ " + s : "- " + -s);
return Qv("Dans le triangle " + M(A + B + C) + ", " + M(I) + " et " + M(J) + " sont les milieux de " + M(sq(A, B)) + " et " + M(sq(A, C)) + ". On a " + M(I + J + " = " + p + "x + " + q) + " et " + M(B + C + " = " + bcT) + " (en cm). Trouve " + M("x") + ".", x,
M(B + C + " = 2\\," + I + J) + " donne " + M(bcT + " = 2(" + p + "x + " + q + ") = " + 2 * p + "x + " + 2 * q) + ", donc " + M((r - 2 * p) + "x = " + (2 * q - s)) + " et " + M("x = " + x) + ".",
{ ctx: "equation", fig: triFig(L, { pts: ["I", "J"], segs: [["I", "J"]], ticks: [["A", "I", 1], ["I", "B", 1], ["A", "J", 2], ["J", "C", 2]] }),
guide: [{ ask: "Écris " + M("2 \\times " + I + J) + " en fonction de " + M("x") + " (développé).", spec: { kind: "expr", expr: 2 * p + "x+" + 2 * q }, sol: M(2 * p + "x + " + 2 * q) + "." }, G("Résous " + M(bcT + " = " + 2 * p + "x + " + 2 * q) + " : " + M("x") + " = ?", x, M("x = " + x) + ".")],
traps: [TR((2 * q - s) / (r - 2 * p) === x ? (q - s) / (r - p) : -x, "Utilise " + B + C + " = 2 " + I + J + ", pas " + B + C + " = " + I + J + "."), TR((q - s) / (r - p), "La relation est " + B + C + " = 2 × " + I + J + ".")] }); },
() => { const L = pk(TRI), [A, B, C, I, J] = L, S0 = R.int(3, 40) + pk([0, 0, 0.5]), up = R.rand() < 0.5, v = up ? 4 * S0 : S0 / 4, big = up ? S0 : 4 * S0;
return Qv("Dans le triangle " + M(A + B + C) + ", " + M(I) + " et " + M(J) + " sont les milieux de " + M(sq(A, B)) + " et " + M(sq(A, C)) + ". " + (up ? "Le triangle " + M(A + I + J) + " a une aire de " + M(N(S0)) + " cm². Quelle est l'aire du triangle " + M(A + B + C) + " (en cm²) ?" : "Le triangle " + M(A + B + C) + " a une aire de " + M(N(big)) + " cm². Quelle est l'aire du triangle " + M(A + I + J) + " (en cm²) ?"), v,
M(A + I + J) + " est une réduction de " + M(A + B + C) + " de rapport " + M("\\frac{1}{2}") + " (côtés deux fois plus courts, " + M(dr(I, J) + " \\parallel " + dr(B, C)) + ") ; les aires sont multipliées par " + M("\\left(\\frac{1}{2}\\right)^2 = \\frac{1}{4}") + ". " + (up ? M(N(S0) + " \\times 4 = " + N(v)) : M(N(big) + " \\div 4 = " + N(v))) + " cm².",
{ ctx: "aire", fig: triFig(L, { pts: ["I", "J"], segs: [["I", "J"]], ticks: [["A", "I", 1], ["I", "B", 1], ["A", "J", 2], ["J", "C", 2]] }),
guide: [G("Rapport de réduction des longueurs (de " + M(A + B + C) + " à " + M(A + I + J) + ") ?", 0.5, M("\\frac{1}{2}") + "."), G("Par quel nombre les aires sont-elles divisées ?", 4, M("2^2 = 4") + "."), G("Aire demandée (cm²) ?", v, M(N(v)) + " cm².")],
traps: [TR(up ? 2 * S0 : big / 2, "Les longueurs sont divisées par 2 ; les aires, par 2² = 4."), TR(up ? S0 + 4 : big - 4, "On multiplie ou on divise par 4.")] }); },
() => { const L = pk(TRI), [A, B, C, I, J, K] = L, a = R.int(6, 24), c = R.int(6, 24), b = R.int(Math.abs(a - c) + 2, a + c - 2), v = a + c;
return Qv("Dans le triangle " + M(A + B + C) + ", " + M(I) + ", " + M(J) + ", " + M(K) + " sont les milieux de " + M(sq(A, B)) + ", " + M(sq(A, C)) + " et " + M(sq(B, C)) + ". " + M(A + B + " = " + a) + " cm, " + M(A + C + " = " + b) + " cm, " + M(B + C + " = " + c) + " cm. Quel est le périmètre du parallélogramme " + M(B + I + J + K) + " (en cm) ?", v,
M(B + I + " = " + N(a / 2)) + ", " + M(I + J + " = \\frac{1}{2}\\," + B + C + " = " + N(c / 2)) + ", " + M(J + K + " = \\frac{1}{2}\\," + A + B + " = " + N(a / 2)) + ", " + M(K + B + " = " + N(c / 2)) + " : périmètre " + M(N(v)) + " cm.",
{ ctx: "parallelogramme", fig: triFig(L, { pts: ["I", "J", "K"], segs: [["I", "J"], ["J", "K"]], ticks: [["A", "I", 1], ["I", "B", 1], ["A", "J", 2], ["J", "C", 2], ["B", "K", 3], ["K", "C", 3]] }),
guide: [G(M(B + I) + " et " + M(J + K) + " (en cm) ?", a / 2, M(N(a / 2)) + " : moitiés de " + M(A + B) + "."), G(M(I + J) + " et " + M(B + K) + " (en cm) ?", c / 2, M(N(c / 2)) + " : moitiés de " + M(B + C) + "."), G("Périmètre (cm) ?", v, M("2 \\times " + N(a / 2) + " + 2 \\times " + N(c / 2) + " = " + v) + ".")],
traps: [TR((a + b + c) / 2, "C'est le périmètre du triangle des milieux ; ici le quadrilatère a deux côtés sur " + B + I + " et " + B + K + "."), TR(2 * (a + c), "Chaque côté du parallélogramme est une moitié de côté du triangle.")] }); },
],
};


const sgn = (n) => (n < 0 ? " - " + Math.abs(n) : " + " + n);
const mono = (c, v, first) => { const a = Math.abs(c), s0 = c < 0 ? (first ? "-" : " - ") : first ? "" : " + "; return s0 + (v ? (a === 1 ? "" : a) + v : a); };
const sumT = (T) => T.map(([c, v], i) => mono(c, v, i === 0)).join("");
const SE = {
1: [
() => { const vs = ["", "x", "x^2", "y", "x", ""], k = R.int(3, 5), T = []; for (let i = 0; i < k; i++) T.push([R.nz(-9, 9) || 2, pk(vs)]); if (T.every(([c]) => Math.abs(c) === 1)) return null;
const e = sumT(T), sep = k - 1;
return Qv("Combien de termes compte la somme " + M("E = " + e) + " ?", k, "Les termes sont séparés par les signes + et − : " + T.map(([c, v]) => M(mono(c, v, true))).join(", ") + ". Il y en a " + k + ".",
{ ctx: "compter", guide: [G("Combien de signes + ou − séparent deux termes ?", sep, M(sep) + " (un signe devant le premier terme ne sépare rien)."), G("Nombre de termes ?", k, M(sep + " + 1 = " + k) + ".")],
traps: [TR(sep, "Il y a un terme de plus que de signes qui les séparent."), TR(T.filter(([, v]) => v).length, "Les nombres seuls sont aussi des termes.")] }); },
() => { const a = R.nz(-9, 9), b = R.nz(-12, 12); if (Math.abs(a) === 1) return null;
const e = mono(a, "x", true) + sgn(b), res = mono(-a, "x", true) + sgn(-b);
return Qx("Écris l'opposé de " + M(e) + ", sans parenthèses.", res.replace(/ /g, ""), "L'opposé change le signe de chaque terme : " + M("-(" + e + ") = " + res) + ".",
{ ctx: "oppose", form: "reduced", guide: [GX("Écris l'opposé avec des parenthèses :", "-(" + e.replace(/ /g, "") + ")", M("-(" + e + ")") + "."), GX("Supprime les parenthèses (change chaque signe) :", res.replace(/ /g, ""), M(res) + ".", "reduced")],
traps: [TX((mono(-a, "x", true) + sgn(b)).replace(/ /g, ""), "Le signe de chaque terme change, y compris celui de " + b + "."), TX(e.replace(/ /g, ""), "L'opposé de A est −A : tous les signes changent.")] }); },
() => { const T = [[R.nz(-9, 9), ""], [R.nz(-9, 9), "x"], [R.nz(-6, 6), "x^2"]]; for (let i = 2; i > 0; i--) { const j = R.int(0, i); [T[i], T[j]] = [T[j], T[i]]; }
if (T.some(([c]) => Math.abs(c) === 1)) return null;
const e = sumT(T), cst = R.rand() < 0.5, v = T.find(([, w]) => w === (cst ? "" : "x"))[0], other = T.find(([, w]) => w === (cst ? "x" : "x^2"))[0];
return Qv("Dans la somme " + M("E = " + e) + ", quel est " + (cst ? "le terme constant (avec son signe)" : "le coefficient de " + M("x") + " (avec son signe)") + " ?", v,
"Les termes de " + M("E") + " sont " + T.map(([c, w]) => M(mono(c, w, true))).join(", ") + ". " + (cst ? "Le terme constant (sans lettre) est " : "Le terme en " + M("x") + " est " + M(mono(v, "x", true)) + " : son coefficient est ") + M(v) + ".",
{ ctx: cst ? "constante" : "coefficient", guide: [G("Combien de termes compte E ?", 3, "Trois termes."), G(cst ? "Terme sans lettre (avec son signe) ?" : "Coefficient du terme en x (avec son signe) ?", v, M(v) + ".")],
traps: [TR(-v, "Le signe qui précède le terme fait partie du terme."), TR(other, cst ? "Le terme constant ne contient pas de lettre." : "On cherche le terme en x, pas en x².")] }); },
],
2: [
() => { const k = R.int(2, 9), a = R.nz(-9, 9), b = R.nz(-9, 9), first = R.rand() < 0.5; if (Math.abs(b) === 1) return null;
const t1 = k + "(x" + sgn(a) + ")", t2 = mono(b, "x", true), E = t1 + (b < 0 ? " - " + Math.abs(b) + "x" : " + " + b + "x"), ans = first ? k + "*(x" + sgn(a).replace(/ /g, "") + ")" : b + "x";
return Qx("L'expression " + M("A = " + E) + " est une somme de deux termes. Écris son " + (first ? "premier" : "second") + " terme" + (first ? "" : " (avec son signe)") + ".", ans, "Le dernier calcul est l'addition : les deux termes sont " + M(t1) + " et " + M(t2) + ".",
{ ctx: "terme", guide: [G("Combien de termes compte A ?", 2, "Deux : " + M(t1) + " et " + M(t2) + "."), GX("Terme demandé :", ans, M(first ? t1 : t2) + ".")],
traps: [TX("x" + sgn(a).replace(/ /g, ""), "x " + (a < 0 ? "−" : "+") + " " + Math.abs(a) + " est à l'intérieur d'un facteur : le premier terme est " + k + "(x " + (a < 0 ? "−" : "+") + " " + Math.abs(a) + ")."), TX(first ? b + "x" : k + "*(x" + sgn(a).replace(/ /g, "") + ")", "C'est l'autre terme.")] }); },
() => { const p0 = R.int(2, 7), q = R.nz(-9, 9), r = R.nz(-9, 9), first = R.rand() < 0.5, f1 = p0 + "x" + sgn(q), f2 = "x" + sgn(r), ans = (first ? f1 : f2).replace(/ /g, "");
return Qx("L'expression " + M("B = (" + f1 + ")(" + f2 + ")") + " est un produit. Écris son " + (first ? "premier" : "second") + " facteur.", ans, "Le dernier calcul est la multiplication : les facteurs sont " + M(f1) + " et " + M(f2) + ".",
{ ctx: "facteur", guide: [G("Combien de facteurs compte B ?", 2, "Deux : " + M("(" + f1 + ")") + " et " + M("(" + f2 + ")") + "."), GX("Facteur demandé :", ans, M(first ? f1 : f2) + ".")],
traps: [TX((first ? f2 : f1).replace(/ /g, ""), "C'est l'autre facteur."), TX(p0 + "x", "Un facteur est tout le contenu d'une parenthèse.")] }); },
() => { const a = R.nz(-5, 5), b = R.nz(-9, 9), c = R.nz(-12, 12); if (Math.abs(b) === 1) return null;
const e = mono(a, "x^2", true) + mono(b, "x") + sgn(c), res = mono(-a, "x^2", true) + mono(-b, "x") + sgn(-c);
return Qx("Écris l'opposé de " + M(e) + ", sans parenthèses.", res.replace(/ /g, ""), M("-(" + e + ") = " + res) + " : chaque terme change de signe.",
{ ctx: "oppose3", form: "reduced", guide: [GX("Écris l'opposé avec des parenthèses :", "-(" + e.replace(/ /g, "") + ")", M("-(" + e + ")") + "."), GX("Change le signe de chaque terme :", res.replace(/ /g, ""), M(res) + ".", "reduced")],
traps: [TX((mono(-a, "x^2", true) + mono(b, "x") + sgn(c)).replace(/ /g, ""), "Tous les termes changent de signe, pas seulement le premier."), TX((mono(-a, "x^2", true) + mono(-b, "x") + sgn(c)).replace(/ /g, ""), "N'oublie pas le terme constant.")] }); },
],
3: [
() => { const a = R.int(2, 9), b = R.int(2, 9), c = pk([
["la somme du produit de " + a + " par x et du carré de x", "le produit de " + a + " par x", a + "x", a + "x+x^2", a + "x^2", a + "x + x^2"],
["le produit de la somme de x et de " + a + " par la différence de x et de " + b, "la somme de x et de " + a, "x+" + a, "(x+" + a + ")*(x-" + b + ")", "x+" + a + "*(x-" + b + ")", "(x + " + a + ")(x - " + b + ")"],
["le carré de la somme de x et de " + a, "la somme de x et de " + a, "x+" + a, "(x+" + a + ")^2", "x^2+" + a * a, "(x + " + a + ")^2"],
["la différence entre le triple de x et le carré de la somme de x et de " + a, "le carré de la somme de x et de " + a, "(x+" + a + ")^2", "3x-(x+" + a + ")^2", "3x-x^2+" + a * a, "3x - (x + " + a + ")^2"],
["la somme de " + a + " et du produit de " + b + " par x", "le produit de " + b + " par x", b + "x", a + "+" + b + "x", (a + b) + "x", a + " + " + b + "x"]]);
const ph = c[0].replace(/ x( |$)/g, " \\(x\\)$1"), sub = c[1].replace(/ x( |$)/g, " \\(x\\)$1");
return Qx("Écris l'expression : « " + ph + " ».", c[3], M(c[5]) + ". Le début de la phrase donne le dernier calcul.",
{ ctx: "phrase", guide: [GX("Écris d'abord « " + sub + " ».", c[2], M(c[2].replace("*", "")) + "."), GX("Puis l'expression complète :", c[3], M(c[5]) + ".")], traps: [TX(c[4], "Le début de la phrase dit quel calcul est fait en dernier : respecte les parenthèses.")] }); },
() => { const a = R.nz(-9, 9), b = R.int(2, 6), c = R.nz(-9, 9), d = R.int(2, 6), e = R.nz(-9, 9), k = R.int(2, 9), two = R.rand() < 0.5, f = "x" + sgn(-a);
const E = two ? "(" + f + ")(" + b + "x" + sgn(c) + ") + (" + f + ")(" + d + "x" + sgn(e) + ")" : k + "(" + f + ") - (" + f + ")^2";
return Qx("Dans " + M("E = " + E) + ", quel est le facteur commun aux deux termes ?", f.replace(/ /g, ""), "Les deux termes contiennent le facteur " + M("(" + f + ")") + " : c'est lui qu'on met en facteur pour factoriser " + M("E") + ".",
{ ctx: two ? "commun2" : "commun-carre", guide: [G("Combien de termes compte E ?", 2, "Deux termes, séparés par le signe central."), GX("Facteur présent dans les deux termes :", f.replace(/ /g, ""), M(f) + ".")],
traps: [TX(two ? b + "x" + sgn(c).replace(/ /g, "") : String(k), "Ce facteur n'apparaît que dans un des deux termes."), TX(two ? "x" : "(" + f.replace(/ /g, "") + ")^2", two ? "Le facteur commun est toute la parenthèse." : "(x " + (a < 0 ? "+" : "−") + " …)² = (…)(…) : le facteur commun est la parenthèse, une seule fois.")] }); },
() => { const k = R.int(2, 9), a = R.nz(-9, 9), m = R.int(2, 5), t = pk([-3, -2, 2, 3, 4]), u1 = k * (t + a), u2 = m * t * t, v = u1 - u2;
if (t + a === 0) return null;
return Qv("On considère " + M("E = " + k + "(x" + sgn(a) + ") - " + m + "x^2") + ". Calcule chacun des deux termes pour " + M("x = " + t) + ", puis " + M("E") + ".", v,
"Premier terme : " + M(k + " \\times (" + t + sgn(a) + ") = " + k + " \\times " + P(t + a) + " = " + u1) + ". Second : " + M(m + " \\times " + P(t) + "^2 = " + u2) + ". " + M("E = " + u1 + " - " + P(u2) + " = " + v) + ".",
{ ctx: "valeur", guide: [G("Premier terme pour " + M("x = " + t) + " ?", u1, M(k + " \\times " + P(t + a) + " = " + u1) + "."), G("Second terme (sans son signe) ?", u2, M(m + " \\times " + P(t) + "^2 = " + m + " \\times " + t * t + " = " + u2) + "."), G("Valeur de E ?", v, M(u1 + " - " + P(u2) + " = " + v) + ".")],
traps: [TR(k * t + a - u2, "Le facteur " + k + " multiplie toute la parenthèse."), TR(u1 - (m * t) ** 2, "Seul x est au carré : " + m + " × " + P(t) + "², pas (" + m + " × " + P(t) + ")²."), TR(u1 + u2, "Un carré est positif, mais on le soustrait.")] }); },
],
};


const PAT = [
{ nm: "carreaux", k: "L", f: (n) => { const c = []; for (let j = 0; j <= n; j++) c.push([0, j]); for (let i = 1; i <= n; i++) c.push([i, n]); return c; }, a: 2, b: 1 },
{ nm: "carreaux", k: "croix", f: (n) => { const c = [[n, n]]; for (let k = 1; k <= n; k++) c.push([n - k, n], [n + k, n], [n, n - k], [n, n + k]); return c; }, a: 4, b: 1 },
{ nm: "carreaux", k: "T", f: (n) => { const c = []; for (let i = 0; i <= 2 * n; i++) c.push([i, 0]); for (let j = 1; j <= n; j++) c.push([n, j]); return c; }, a: 3, b: 1 },
{ nm: "carreaux", k: "cadre", f: (n) => { const c = [], s0 = n + 2; for (let i = 0; i < s0; i++) for (let j = 0; j < s0; j++) if (i === 0 || j === 0 || i === s0 - 1 || j === s0 - 1) c.push([i, j]); return c; }, a: 4, b: 4 },
{ nm: "carreaux", k: "pont", f: (n) => { const c = [[0, 0], [1, 0], [2, 0]]; for (let j = 1; j <= n; j++) c.push([0, j], [2, j]); return c; }, a: 2, b: 3 },
{ nm: "allumettes", k: "carrés", st: "sq", a: 3, b: 1 },
{ nm: "allumettes", k: "triangles", st: "tri", a: 2, b: 1 },
];
const QPAT = [
{ k: "carré", f: (n) => { const c = []; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) c.push([i, j]); return c; }, v: (n) => n * n, g: (n) => [G("À l'étape " + n + ", combien de carreaux par côté ?", n, M(n) + "."), G("Nombre de carreaux ?", n * n, M(n + " \\times " + n + " = " + n * n) + ".")] },
{ k: "rectangle", f: (n) => { const c = []; for (let i = 0; i <= n; i++) for (let j = 0; j < n; j++) c.push([i, j]); return c; }, v: (n) => n * (n + 1), g: (n) => [G("Nombre de lignes à l'étape " + n + " ?", n, M(n) + "."), G("Nombre de carreaux par ligne ?", n + 1, M(n + 1) + "."), G("Nombre de carreaux ?", n * (n + 1), M(n + " \\times " + (n + 1) + " = " + n * (n + 1)) + ".")] },
{ k: "escalier", f: (n) => { const c = []; for (let j = 0; j < n; j++) for (let i = 0; i <= j; i++) c.push([i, j]); return c; }, v: (n) => (n * (n + 1)) / 2, g: (n) => [G("Combien de carreaux sur la dernière marche (en bas) à l'étape " + n + " ?", n, M(n) + "."), G("Total " + M("1 + 2 + \\dots + " + n) + " ?", (n * (n + 1)) / 2, M("1 + 2 + \\dots + " + n + " = " + (n * (n + 1)) / 2) + ".")] },
];
const patFig = (P0, steps = [1, 2, 3]) => {
let g = "", x = 6;
const parts = steps.map((n) => {
if (P0.st) { const w = P0.st === "sq" ? n : (n + 1) / 2; return { n, w: w + 0.4, h: 1 }; }
const c = P0.f(n), w = Math.max(...c.map((p) => p[0])) + 1, h = Math.max(...c.map((p) => p[1])) + 1; return { n, c, w, h };
});
const totW = parts.reduce((t, p) => t + p.w, 0), sz = Math.min(22, Math.floor((318 - 14 * steps.length) / totW)), H = Math.max(...parts.map((p) => p.h)) * sz;
for (const p of parts) {
const y0 = 8 + H - p.h * sz;
if (P0.st === "sq") { const L = (x1, y1, x2, y2) => (g += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="f-accent" stroke-width="3" stroke-linecap="round"/>');
for (let k = 0; k < p.n; k++) { L(x + k * sz, y0, x + (k + 1) * sz, y0); L(x + k * sz, y0 + sz, x + (k + 1) * sz, y0 + sz); L(x + k * sz, y0, x + k * sz, y0 + sz); } L(x + p.n * sz, y0, x + p.n * sz, y0 + sz); }
else if (P0.st === "tri") { const V = []; for (let k = 0; k < p.n + 2; k++) V.push([x + (k * sz) / 2, k % 2 ? y0 : y0 + sz]);
const L = (a, b) => (g += '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" class="f-accent" stroke-width="3" stroke-linecap="round"/>');
for (let k = 0; k + 1 < V.length; k++) L(V[k], V[k + 1]); for (let k = 0; k + 2 < V.length; k++) L(V[k], V[k + 2]); }
else p.c.forEach(([i, j]) => (g += '<rect x="' + (x + i * sz) + '" y="' + (y0 + j * sz) + '" width="' + sz + '" height="' + sz + '" class="f-fill2"/>'));
g += '<text x="' + (x + (p.w * sz) / 2) + '" y="' + (H + 28) + '" class="f-txt" font-size="13" text-anchor="middle">Étape ' + p.n + "</text>";
x += p.w * sz + 14;
}
return '<svg class="fig" viewBox="0 0 330 ' + (H + 36) + '" role="img" aria-label="motif aux étapes ' + steps.join(", ") + '">' + g + "</svg>";
};
const cnt = (P0, n) => P0.a * n + P0.b;
const intro = (P0) => "Voici les trois premières étapes d'un motif " + de(P0.nm) + ". ";
const de = (w) => (/^[aeiouéè]/.test(w) ? "d'" : "de ") + w;
const MO = {
1: [
() => { const P0 = pk(PAT), n = 4, v = cnt(P0, n);
return Qv(intro(P0) + "Combien " + de(P0.nm) + " faut-il pour l'étape " + n + " ?", v, "À chaque étape on ajoute " + P0.a + " " + P0.nm + " : étape 3 → " + cnt(P0, 3) + ", étape 4 → " + M(cnt(P0, 3) + " + " + P0.a + " = " + v) + ".",
{ ctx: P0.k, fig: patFig(P0), guide: [G("Combien " + de(P0.nm) + " ajoute-t-on d'une étape à la suivante ?", P0.a, M(cnt(P0, 2) + " - " + cnt(P0, 1) + " = " + P0.a) + "."), G("Nombre à l'étape 3 ?", cnt(P0, 3), M(cnt(P0, 3)) + "."), G("Nombre à l'étape 4 ?", v, M(cnt(P0, 3) + " + " + P0.a + " = " + v) + ".")],
traps: [TR(cnt(P0, 3), "C'est l'étape 3 ; on demande la suivante."), TR(P0.a * n, "Attention à ce qui ne change pas : l'étape 1 compte " + cnt(P0, 1) + ", pas " + P0.a + "."), TR(cnt(P0, 1) * n, "Le motif ne double pas : on ajoute " + P0.a + " à chaque étape.")] }); },
() => { const P0 = pk(PAT), v = P0.a;
return Qv(intro(P0) + "Combien " + de(P0.nm) + " ajoute-t-on d'une étape à la suivante ?", v, "Étape 1 : " + cnt(P0, 1) + ", étape 2 : " + cnt(P0, 2) + ", étape 3 : " + cnt(P0, 3) + ". On ajoute " + v + " à chaque fois.",
{ ctx: P0.k, fig: patFig(P0), guide: [G("Nombre à l'étape 1 ?", cnt(P0, 1), M(cnt(P0, 1)) + "."), G("Nombre à l'étape 2 ?", cnt(P0, 2), M(cnt(P0, 2)) + "."), G("Différence ?", v, M(cnt(P0, 2) + " - " + cnt(P0, 1) + " = " + v) + ".")],
traps: [TR(cnt(P0, 2), "On demande ce qu'on ajoute, pas le total de l'étape 2."), TR(cnt(P0, 1), "Compare deux étapes qui se suivent.")] }); },
() => { const P0 = pk(PAT), v = cnt(P0, 1) + cnt(P0, 2) + cnt(P0, 3);
return Qv(intro(P0) + "Combien " + de(P0.nm) + " faut-il en tout pour construire les trois étapes dessinées ?", v, M(cnt(P0, 1) + " + " + cnt(P0, 2) + " + " + cnt(P0, 3) + " = " + v) + ".",
{ ctx: P0.k, fig: patFig(P0), guide: [G("Étape 1 ?", cnt(P0, 1), M(cnt(P0, 1)) + "."), G("Étape 2 ?", cnt(P0, 2), M(cnt(P0, 2)) + "."), G("Étape 3 ?", cnt(P0, 3), M(cnt(P0, 3)) + "."), G("Total ?", v, M(v) + ".")],
traps: [TR(cnt(P0, 3), "On demande le total des trois étapes."), TR(3 * cnt(P0, 1), "Les étapes n'ont pas toutes le même nombre de " + P0.nm + ".")] }); },
],
2: [
() => { const P0 = pk(PAT), n = pk([10, 12, 15, 20]), v = cnt(P0, n);
return Qv(intro(P0) + "Combien " + de(P0.nm) + " faut-il pour l'étape " + n + " ?", v, "L'étape 1 compte " + cnt(P0, 1) + " ; on ajoute " + P0.a + " à chaque étape, " + (n - 1) + " fois : " + M(cnt(P0, 1) + " + " + (n - 1) + " \\times " + P0.a + " = " + v) + ".",
{ ctx: P0.k, fig: patFig(P0), guide: [G("Ajout à chaque étape ?", P0.a, M(P0.a) + "."), G("Nombre à l'étape 1 ?", cnt(P0, 1), M(cnt(P0, 1)) + "."), G("Étape " + n + " : étape 1 + " + (n - 1) + " ajouts ?", v, M(cnt(P0, 1) + " + " + (n - 1) + " \\times " + P0.a + " = " + v) + ".")],
traps: [TR(cnt(P0, 1) * n, "Le motif n'est pas proportionnel : on n'a pas " + n + " fois l'étape 1."), TR(P0.a * n, "Il manque les " + P0.b + " " + P0.nm + " de départ."), TR(cnt(P0, 1) + n * P0.a, "De l'étape 1 à l'étape " + n + ", il y a " + (n - 1) + " ajouts.")] }); },
() => { const P0 = pk(PAT), k = R.int(8, 25), Nn = cnt(P0, k);
return Qv(intro(P0) + "Quelle étape utilise exactement " + M(Nn) + " " + P0.nm + " ?", k, M(Nn + " - " + cnt(P0, 1) + " = " + (Nn - cnt(P0, 1))) + ", et " + M((Nn - cnt(P0, 1)) + " \\div " + P0.a + " = " + (k - 1)) + " ajouts après l'étape 1 : c'est l'étape " + k + ".",
{ ctx: P0.k, fig: patFig(P0), guide: [G("Nombre à l'étape 1 ?", cnt(P0, 1), M(cnt(P0, 1)) + "."), G("Combien d'ajouts de " + P0.a + " après l'étape 1 ?", k - 1, M("(" + Nn + " - " + cnt(P0, 1) + ") \\div " + P0.a + " = " + (k - 1)) + "."), G("Numéro de l'étape ?", k, M((k - 1) + " + 1 = " + k) + ".")],
traps: [TR(Nn / P0.a, "Retire d'abord ce qui ne change pas (" + P0.b + ")."), TR(k - 1, "Après " + (k - 1) + " ajouts depuis l'étape 1, on est à l'étape " + k + ".")] }); },
() => { const P0 = pk(PAT), k = R.int(6, 20), X = cnt(P0, k) + R.int(1, P0.a - 1 || 1); if (P0.a === 1 || X >= cnt(P0, k + 1)) return null;
return Qv(intro(P0) + who() + " dispose de " + M(X) + " " + P0.nm + ". Quelle est la plus grande étape du motif qu'on peut construire (une seule figure) ?", k, "L'étape " + k + " utilise " + cnt(P0, k) + " " + P0.nm + ", l'étape " + (k + 1) + " en utiliserait " + cnt(P0, k + 1) + " : trop. Réponse : étape " + k + ".",
{ ctx: P0.k, fig: patFig(P0), guide: [G("Nombre à l'étape 1 ?", cnt(P0, 1), M(cnt(P0, 1)) + "."), G("Combien d'ajouts complets de " + P0.a + " possibles avec le reste ?", k - 1, M("(" + X + " - " + cnt(P0, 1) + ") \\div " + P0.a) + " → " + (k - 1) + " ajouts complets."), G("Plus grande étape ?", k, M(k) + ".")],
traps: [TR(k + 1, "L'étape " + (k + 1) + " demande " + cnt(P0, k + 1) + " " + P0.nm + " : il n'y en a pas assez."), TR(Math.floor(X / P0.a), "Retire d'abord ce qui ne change pas (" + P0.b + ").")] }); },
],
3: [
() => { const P0 = pk(PAT), e = P0.a + "n+" + P0.b;
return Qx(intro(P0) + "Écris le nombre " + de(P0.nm) + " à l'étape " + M("n") + " en fonction de " + M("n") + ".", e, "On ajoute " + P0.a + " à chaque étape, et l'étape 1 compte " + cnt(P0, 1) + " = " + P0.a + " + " + P0.b + " : " + M(P0.a + "n + " + P0.b) + ".",
{ ctx: P0.k, form: "reduced", fig: patFig(P0), guide: [G("Ajout à chaque étape (coefficient de n) ?", P0.a, M(P0.a) + "."), G("Étape 1 moins l'ajout (ce qui ne change pas) ?", P0.b, M(cnt(P0, 1) + " - " + P0.a + " = " + P0.b) + "."), GX("Formule :", e, M(P0.a + "n + " + P0.b) + ".", "reduced")],
traps: [TX(cnt(P0, 1) + "n", "Vérifie avec l'étape 2 : " + cnt(P0, 1) + " × 2 ne donne pas " + cnt(P0, 2) + "."), TX(P0.a + "n+" + cnt(P0, 1), "Vérifie avec l'étape 1 : on doit trouver " + cnt(P0, 1) + "."), TX(P0.a + "n", "Il manque les " + P0.b + " " + P0.nm + " qui ne changent pas.")] }); },
() => { const P0 = pk(PAT), n = pk([50, 100, 200]), v = cnt(P0, n);
return Qv(intro(P0) + "Combien " + de(P0.nm) + " faudrait-il pour l'étape " + n + " ?", v, "À l'étape " + M("n") + " : " + M(P0.a + "n + " + P0.b) + " ; pour " + M("n = " + n) + " : " + M(P0.a + " \\times " + n + " + " + P0.b + " = " + v) + ".",
{ ctx: P0.k, fig: patFig(P0), guide: [{ ask: "Formule à l'étape " + M("n") + " ?", spec: { kind: "expr", expr: P0.a + "n+" + P0.b }, sol: M(P0.a + "n + " + P0.b) + "." }, G("Étape " + n + " ?", v, M(P0.a + " \\times " + n + " + " + P0.b + " = " + v) + ".")],
traps: [TR(cnt(P0, 1) * n, "Le motif n'est pas proportionnel."), TR(P0.a * n, "Ajoute les " + P0.b + " " + P0.nm + " qui ne changent pas.")] }); },
() => { const Q0 = pk(QPAT), n = R.int(6, 10), v = Q0.v(n), lin = Q0.v(3) + (n - 3) * (Q0.v(3) - Q0.v(2));
return Qv("Voici les trois premières étapes d'un motif de carreaux en " + Q0.k + ". Combien de carreaux à l'étape " + n + " ?", v, "Ce motif ne grandit pas de façon régulière : on décrit sa forme à l'étape " + n + ". " + Q0.g(n).map((x) => x.sol).join(" "),
{ ctx: "q" + Q0.k, fig: patFig(Q0, [1, 2, 3]), guide: Q0.g(n), traps: [TR(lin, "L'ajout n'est pas le même à chaque étape : décris plutôt la forme de l'étape " + n + "."), TR(Q0.v(3) * n / 3, "Le motif n'est pas proportionnel.")] }); },
],
};


const SC = "Sans calculatrice : ";
const AU = {
1: [
() => { const a = R.int(3, 9), b = R.int(6, 9), v = a * b;
return Qv(SC + "calcule " + M(a + " \\times " + b) + ".", v, M(a + " \\times " + b + " = " + v) + ".", { ctx: "table", guide: [G(M(a + " \\times " + (b - 1)) + " = ?", a * (b - 1), M(a * (b - 1)) + "."), G("Ajoute " + a + " : " + M(a + " \\times " + b) + " = ?", v, M(a * (b - 1) + " + " + a + " = " + v) + ".")], traps: [TR(v - a, "C'est " + a + " × " + (b - 1) + "."), TR(v + a, "C'est " + a + " × " + (b + 1) + "."), TR(a + b, "On multiplie.")] }); },
() => { const a = R.int(3, 9), b = R.int(3, 9), n = a * b;
return Qv(SC + "complète " + M(a + " \\times \\ldots = " + n) + ".", b, M(a + " \\times " + b + " = " + n) + ", donc il manque " + M(b) + " (c'est " + M(n + " \\div " + a) + ").", { ctx: "trou", guide: [G("Il manque " + M(n + " \\div " + a) + " = ?", b, M(b) + ".")], traps: [TR(n - a, "On cherche un facteur : on divise " + n + " par " + a + "."), TR(n * a, "On divise, on ne multiplie pas.")] }); },
() => { const big = pk([100, 1000]), a = big === 100 ? R.int(12, 88) : R.int(120, 880); if (a % 10 === 0) return null; const v = big - a;
return Qv(SC + "combien faut-il ajouter à " + M(N(a)) + " pour obtenir " + M(N(big)) + " ?", v, M(N(a) + " + " + N(v) + " = " + N(big)) + ".", { ctx: "complement", guide: [G("Jusqu'à la dizaine suivante : combien ajouter à " + M(N(a)) + " ?", 10 - (a % 10), M(N(a) + " + " + (10 - (a % 10)) + " = " + N(a + 10 - (a % 10))) + "."), G("Puis jusqu'à " + M(N(big)) + " ? Total ajouté :", v, M(N(v)) + ".")], traps: [TR(v + 10, "Attention à la retenue : " + N(a) + " + " + N(v) + " = " + N(big) + "."), TR(big - a - 10 < 0 ? v + 1 : v - 10, "Vérifie par une addition.")] }); },
() => { const a = R.int(3, 9), b = R.int(4, 12), n = a * b;
return Qv(SC + "calcule " + M(n + " \\div " + a) + ".", b, M(a + " \\times " + b + " = " + n) + ", donc " + M(n + " \\div " + a + " = " + b) + ".", { ctx: "division", guide: [G("Dans la table de " + a + ", quel nombre multiplié par " + a + " donne " + n + " ?", b, M(a + " \\times " + b + " = " + n) + ".")], traps: [TR(n - a, "Diviser, ce n'est pas soustraire."), TR(b + 1, "Vérifie : " + a + " × " + (b + 1) + " = " + a * (b + 1) + ".")] }); },
],
2: [
() => { const [n0, d] = pk([[1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 8], [3, 8], [7, 20], [3, 20], [9, 25], [1, 20]]), k = d === 8 ? 125 : 100 / d, v = n0 / d;
const x = { q: SC + "écris " + M("\\frac{" + n0 + "}{" + d + "}") + " sous forme décimale.", spec: { kind: "value", value: r6(v), plain: true }, ctx: "fracdec",
sol: M("\\frac{" + n0 + "}{" + d + "} = \\frac{" + n0 * k + "}{" + d * k + "} = " + N(v)) + ".",
guide: [G("Écris la fraction avec le dénominateur " + d * k + " : numérateur ?", n0 * k, M("\\frac{" + n0 + " \\times " + k + "}{" + d + " \\times " + k + "} = \\frac{" + n0 * k + "}{" + d * k + "}") + "."), G("Écriture décimale ?", v, M(N(v)) + ".")],
traps: keep(r6(v), [TR(d / n0, "C'est l'inverse : on divise " + n0 + " par " + d + "."), TR(+("0." + n0 + d), "Ce n'est pas « 0, numérateur dénominateur » : divise " + n0 + " par " + d + "."), TR(n0 / 10, "Le dénominateur est " + d + ", pas 10.")]) };
return x; },
() => { const p0 = pk([10, 20, 25, 50, 75, 5, 15, 30]), c = p0 % 25 === 0 ? R.int(2, 30) * 4 : R.int(2, 40) * 20, v = (p0 * c) / 100, base = p0 % 25 === 0 ? c / 4 : c / 10;
return Qv(SC + "calcule " + M(p0 + "\\,\\%") + " de " + M(N(c)) + ".", v, p0 % 25 === 0 ? M("25\\,\\%") + " de " + N(c) + " = " + M(N(c) + " \\div 4 = " + N(base)) + " ; " + M(p0 + "\\,\\%") + " = " + p0 / 25 + " fois plus : " + M(N(v)) + "." : M("10\\,\\%") + " de " + N(c) + " = " + M(N(base)) + " ; " + M(p0 + "\\,\\%") + " : " + M(N(v)) + ".",
{ ctx: "pourcent", guide: [G(p0 % 25 === 0 ? "25 % de " + N(c).replace("\\,", " ") + " (le quart) ?" : "10 % de " + N(c).replace("\\,", " ") + " (le dixième) ?", base, M(N(base)) + "."), G(p0 + " % de " + N(c).replace("\\,", " ") + " ?", v, M(N(v)) + ".")],
traps: [TR(c - p0, "Un pourcentage n'est pas une soustraction."), TR(c * p0 / 10, p0 + " % = " + p0 + " ÷ 100 : divise par 100, pas par 10.")] }); },
() => { const f = pk([[0.5, 2, "diviser par 2"], [0.25, 4, "diviser par 4"], [0.1, 10, "diviser par 10"]]), a = f[1] === 10 ? R.int(12, 99) : R.int(6, 60) * f[1], v = a * f[0];
return Qv(SC + "calcule " + M(a + " \\times " + N(f[0])) + ".", v, "Multiplier par " + M(N(f[0])) + ", c'est " + f[2] + " : " + M(a + " \\div " + f[1] + " = " + N(v)) + ".",
{ ctx: "fois" + f[1], guide: [G("Multiplier par " + N(f[0]).replace("{,}", ",") + ", c'est diviser par ?", f[1], M(N(f[0]) + " = \\frac{1}{" + f[1] + "}") + "."), G("Résultat ?", v, M(a + " \\div " + f[1] + " = " + N(v)) + ".")],
traps: [TR(a * f[1], "Multiplier par un nombre plus petit que 1 rend le résultat plus petit."), TR(a + f[0], "C'est une multiplication.")] }); },
() => { const d = pk([3, 6, 7, 9, 11]), n0 = R.int(2, d - 1); if (gcd(n0, d) !== 1) return null; const v = n0 / d;
return Qv("Quel nombre, multiplié par " + M(d) + ", donne " + M(n0) + " ? (écris-le en fraction)", v, "C'est le quotient de " + n0 + " par " + d + " : " + M("\\frac{" + n0 + "}{" + d + "}") + ", car " + M(d + " \\times \\frac{" + n0 + "}{" + d + "} = " + n0) + ".",
{ ctx: "quotient", guide: [G("Le nombre cherché est le quotient " + M(n0 + " \\div " + d) + ", écrit en fraction :", v, M("\\frac{" + n0 + "}{" + d + "}") + ".")], traps: [TR(d / n0, "C'est l'inverse : le numérateur est " + n0 + "."), TR(n0 * d, "On cherche un facteur : on divise."), TR(n0 - d, "On cherche un facteur, pas une différence.")] }); },
],
3: [
() => { const [n0, d] = pk([[3, 20], [7, 25], [9, 50], [3, 4], [11, 20], [2, 5], [13, 50], [17, 25]]), k = 100 / d, v = n0 * k;
return Qv(SC + "écris " + M("\\frac{" + n0 + "}{" + d + "}") + " en pourcentage.", v, M("\\frac{" + n0 + "}{" + d + "} = \\frac{" + v + "}{100} = " + v + "\\,\\%") + ".",
{ ctx: "fracpct", guide: [G("Par quel nombre multiplier " + d + " pour obtenir 100 ?", k, M(d + " \\times " + k + " = 100") + "."), G("Pourcentage ?", v, M(n0 + " \\times " + k + " = " + v) + " : " + M(v + "\\,\\%") + ".")], traps: [TR(n0 * d, "On amplifie la fraction pour obtenir le dénominateur 100."), TR(r6(n0 / d), "C'est l'écriture décimale ; en pourcentage, on multiplie par 100.")] }); },
() => { const c = pk([[25, 4], [50, 2], [125, 8]]), m = R.int(3, 12) * c[1] + (c[0] === 125 ? 0 : 0), v = c[0] * m;
if (m % 10 === 0) return null;
return Qv(SC + "calcule " + M(c[0] + " \\times " + m) + " astucieusement.", v, M(c[0] + " \\times " + m + " = " + c[0] + " \\times " + c[1] + " \\times " + m / c[1] + " = " + c[0] * c[1] + " \\times " + m / c[1] + " = " + N(v)) + ".",
{ ctx: "astuce", guide: [G(M(c[0] + " \\times " + c[1]) + " = ?", c[0] * c[1], M(c[0] * c[1]) + "."), G(M(m + " \\div " + c[1]) + " = ?", m / c[1], M(m / c[1]) + "."), G("Résultat ?", v, M(c[0] * c[1] + " \\times " + m / c[1] + " = " + N(v)) + ".")],
traps: [TR(v / 10, "Vérifie l'ordre de grandeur : " + c[0] + " × " + m + " ≈ " + c[0] * m + "."), TR(c[0] * c[1] + m / c[1], "On multiplie les deux résultats.")] }); },
() => { const t = pk(["pres100", "pres10"]);
if (t === "pres100") { const sg2 = pk([1, -1]), k = R.int(2, 4), b = R.int(3, 9), a = 100 + sg2 * k, v = a * b;
return Qv(SC + "calcule " + M(a + " \\times " + b) + ".", v, M(a + " \\times " + b + " = 100 \\times " + b + (sg2 > 0 ? " + " : " - ") + k + " \\times " + b + " = " + 100 * b + (sg2 > 0 ? " + " : " - ") + k * b + " = " + v) + ".",
{ ctx: "distrib100", guide: [G(M("100 \\times " + b) + " = ?", 100 * b, M(100 * b) + "."), G(M(k + " \\times " + b) + " = ?", k * b, M(k * b) + "."), G("Résultat ?", v, M(100 * b + (sg2 > 0 ? " + " : " - ") + k * b + " = " + v) + ".")], traps: [TR(100 * b + sg2 * k, "Le " + k + " est aussi multiplié par " + b + "."), TR(100 * b - sg2 * k * b, "Vérifie le signe : " + a + " est " + (sg2 > 0 ? "plus grand" : "plus petit") + " que 100.")] }); }
const m = pk([20, 30, 40, 50]), k = R.int(1, 2), a = m + k, b = m - k, v = a * b;
return Qv(SC + "calcule " + M(a + " \\times " + b) + ".", v, M(a + " \\times " + b + " = (" + m + " + " + k + ")(" + m + " - " + k + ") = " + m * m + " - " + k * k + " = " + v) + ".",
{ ctx: "difcarres", guide: [G(M(m + "^2") + " = ?", m * m, M(m * m) + "."), G(M(k + "^2") + " = ?", k * k, M(k * k) + "."), G("Résultat ?", v, M(m * m + " - " + k * k + " = " + v) + ".")], traps: [TR(m * m, "Il faut retirer " + k * k + " : (" + m + " + " + k + ")(" + m + " − " + k + ") = " + m + "² − " + k + "²."), TR(m * m + k * k, "On soustrait " + k + "².")] }); },
() => { const p0 = pk([10, 20, 25, 50, 5]), up = R.rand() < 0.5, c = p0 === 25 ? R.int(2, 30) * 4 : R.int(2, 40) * 20, d = (p0 * c) / 100, v = up ? c + d : c - d;
return Qv(SC + "un article à " + M(N(c)) + " € " + (up ? "augmente" : "baisse") + " de " + M(p0 + "\\,\\%") + ". Quel est son nouveau prix (en €) ?", v, M(p0 + "\\,\\%") + " de " + N(c) + " = " + M(N(d)) + " € ; nouveau prix : " + M(N(c) + (up ? " + " : " - ") + N(d) + " = " + N(v)) + " €.",
{ ctx: up ? "hausse" : "baisse", guide: [G(p0 + " % de " + N(c).replace("\\,", " ") + " (€) ?", d, M(N(d)) + " €."), G("Nouveau prix (€) ?", v, M(N(c) + (up ? " + " : " - ") + N(d) + " = " + N(v)) + " €.")],
traps: [TR(up ? c + p0 : c - p0, "On ajoute ou retire " + p0 + " % du prix, pas " + p0 + " €."), TR(d, "C'est le montant de la " + (up ? "hausse" : "baisse") + " ; on demande le nouveau prix.")] }); },
],
};

const ALL = { progcalc: PC, ratio: RAT, milieux: MI, structexpr: SE, motifs: MO, automat: AU };
for (const [id, lv] of Object.entries(ALL)) {
GEN[id] = (d) => pickForm(lv[Math.min(Math.max(d, 1), 3)]);
if (typeof VAR !== "undefined") VAR[id] = {};
}
PROB_EXTRA.progcalc = PCPROB;
PROB_EXTRA.ratio = RATPROB;
Object.assign(HINTS_EXTRA, {
structexpr: "Le dernier calcul effectué donne la nature de l'expression : une addition ou une soustraction → somme (de termes), une multiplication → produit (de facteurs). L'opposé change le signe de chaque terme.",
motifs: "Compte ce qu'on ajoute d'une étape à la suivante, et ce qui ne change pas. Étape n : (ajout) × n + (ce qui reste).",
automat: "Pense aux décompositions : × 0,5 = ÷ 2 ; 25 % = le quart ; 25 × 4 = 100 ; 102 × 7 = 700 + 14.",
ratio: "Ratio a ∶ b : on partage en a + b parts égales. Une part = total ÷ (a + b) ; la première personne reçoit a parts, la seconde b parts.",
milieux: "Le segment qui joint les milieux de deux côtés est parallèle au troisième côté et mesure sa moitié. Une parallèle à un côté passant par un milieu coupe le troisième côté en son milieu.",
progcalc: "Applique les étapes dans l'ordre, chacune au résultat de la précédente. Avec x : mets des parenthèses, puis développe. Pour remonter, défais les étapes de la dernière à la première.",
});
Object.assign(LESSONS_EXTRA, {
structexpr: ["Somme ou produit ?", "La nature d'une expression est donnée par le dernier calcul qu'on effectue en respectant les priorités.",
"Si le dernier calcul est une addition ou une soustraction, l'expression est une somme ; ses morceaux sont des termes. Si c'est une multiplication, c'est un produit ; ses morceaux sont des facteurs. L'opposé d'une expression change le signe de chacun de ses termes : \\(-(a + b - c) = -a - b + c\\).",
["\\(3x + 2\\) est une somme de deux termes ; \\(5(x + 4)\\) est un produit de deux facteurs, \\(5\\) et \\(x + 4\\).", "L'opposé de \\(2x - 7\\) est \\(-2x + 7\\)."],
"\\(5(x + 4) - 3\\) est une somme (le dernier calcul est la soustraction), même s'il contient un produit."],
motifs: ["Suites de motifs", "Un motif qui grandit toujours de la même quantité se décrit par une formule simple.",
"On repère ce qu'on ajoute d'une étape à la suivante (l'ajout) et ce qui ne bouge pas. À l'étape \\(n\\), il y a \\(\\text{ajout} \\times n + \\text{reste}\\). On vérifie la formule sur l'étape 1 et l'étape 2. Si l'ajout change à chaque étape (carrés, escaliers), on décrit plutôt la forme de l'étape.",
["Carrés d'allumettes en ligne : 4, 7, 10… On ajoute 3, il reste 1 : étape \\(n\\) : \\(3n + 1\\) ; étape 10 : 31.", "Pour 61 allumettes : \\(3n + 1 = 61\\), donc \\(n = 20\\)."],
"Le motif n'est pas proportionnel : l'étape 10 n'est pas 10 fois l'étape 1."],
automat: ["Automatismes de calcul mental", "Quelques faits connus par cœur et quelques astuces suffisent pour calculer vite et sans calculatrice.",
"Tables de multiplication ; \\(\\frac{1}{4} = 0{,}25\\), \\(\\frac{1}{5} = 0{,}2\\), \\(\\frac{1}{8} = 0{,}125\\) ; 10 % = le dixième, 25 % = le quart, 50 % = la moitié ; multiplier par 0,5, c'est diviser par 2 ; \\(25 \\times 4 = 100\\) et \\(125 \\times 8 = 1\\,000\\). Le nombre qui, multiplié par 7, donne 3 est \\(\\frac{3}{7}\\).",
["\\(25 \\times 36 = 25 \\times 4 \\times 9 = 900\\).", "\\(102 \\times 7 = 700 + 14 = 714\\) ; 15 % de 60 : 10 % = 6, 5 % = 3, donc 9."],
"Multiplier par un nombre plus petit que 1 (comme 0,5) rend le résultat plus petit."],
ratio: ["Ratios et partage proportionnel", "Partager selon le ratio \\(2\\,:\\,3\\), c'est faire 2 + 3 = 5 parts égales ; l'un en prend 2, l'autre 3.",
"Pour partager une quantité selon \\(a\\,:\\,b\\) : on compte \\(a + b\\) parts, on calcule une part (quantité ÷ \\((a + b)\\)), puis on multiplie par \\(a\\) et par \\(b\\). Un ratio se simplifie comme une fraction : \\(12\\,:\\,18 = 2\\,:\\,3\\). Partager proportionnellement à des âges ou à des mises, c'est partager selon leur ratio.",
["Partager 120 € selon \\(2\\,:\\,3\\) : 5 parts de 24 €, soit 48 € et 72 €.", "Ratio garçons : filles = \\(2\\,:\\,3\\) : les filles représentent \\(\\frac{3}{5}\\) de la classe."],
"Le ratio \\(2\\,:\\,3\\) ne veut pas dire « 2 sur 3 » : il y a 5 parts en tout, donc la première personne a \\(\\frac{2}{5}\\) du total."],
milieux: ["Droite des milieux", "Dans un triangle, relier les milieux de deux côtés donne un segment parallèle au troisième côté, deux fois plus court.",
"Si \\(I\\) et \\(J\\) sont les milieux de \\([AB]\\) et \\([AC]\\) : \\((IJ) \\parallel (BC)\\) et \\(IJ = \\frac{1}{2}\\,BC\\). Réciproquement, la parallèle à \\((BC)\\) passant par le milieu \\(I\\) de \\([AB]\\) coupe \\([AC]\\) en son milieu.",
["\\(BC = 9\\) cm, \\(I\\) et \\(J\\) milieux de \\([AB]\\) et \\([AC]\\) : \\(IJ = 4{,}5\\) cm.", "Triangle de périmètre 30 cm : le triangle formé par les trois milieux a un périmètre de 15 cm."],
"Le segment des milieux est parallèle au côté qu'il ne touche pas, pas à un côté qui contient l'un des milieux."],
progcalc: ["Programmes de calcul", "Un programme de calcul est une suite d'opérations faites l'une après l'autre sur un nombre choisi.",
"Chaque étape s'applique au résultat de l'étape précédente. En partant de \\(x\\), on obtient une expression : on met des parenthèses, puis on développe et on réduit. Pour retrouver le nombre de départ, on remonte le programme avec les opérations inverses (de la dernière étape à la première), ou on résout une équation.",
["Ajouter 3, multiplier par 2, soustraire 5. Avec 4 : \\(4 + 3 = 7\\), \\(7 \\times 2 = 14\\), \\(14 - 5 = 9\\).", "Avec \\(x\\) : \\(2(x + 3) - 5 = 2x + 6 - 5 = 2x + 1\\). Pour obtenir 21 : \\(2x + 1 = 21\\), donc \\(x = 10\\)."],
"« Ajouter 3 puis multiplier par 2 » donne \\(2(x + 3)\\), pas \\(x + 3 \\times 2\\) : on multiplie tout le résultat."],
});
if (typeof COMPS !== "undefined") Object.assign(COMPS, {
structexpr: ["Reconnaître termes, coefficients et opposé", "Repérer termes et facteurs d'une expression", "Lire la structure : phrase, facteur commun, calcul"],
motifs: ["Poursuivre un motif évolutif", "Trouver une étape lointaine ou un numéro d'étape", "Écrire la formule d'un motif"],
automat: ["Tables, divisions et compléments", "Fractions, pourcentages, nombre quotient", "Astuces de calcul et évolutions"],
ratio: ["Partager selon un ratio", "Utiliser une part connue, partage proportionnel", "Écart, fraction du total, mélange limité"],
milieux: ["Calculer avec le segment des milieux", "Utiliser la parallèle passant par un milieu", "Combiner : équation, aires, parallélogramme"],
progcalc: ["Appliquer un programme de calcul à un nombre", "Remonter un programme, l'écrire avec x", "Prouver un résultat avec le calcul littéral"],
});

for (const f of FR_NEW) if (GEN[f.id] && !NOTIONS.some((n) => n.id === f.id)) NOTIONS.push({ ...f, CH: null, MP: null, FR: null });
})();


applyFrCollege();








const FRX = (function () {
const pk = (a) => a[Math.floor(R.rand() * a.length)];
const nz = (a, b) => R.nz(a, b);
const rnd = (v, k = 10) => +(+v).toFixed(k);
const g2 = (a, b) => (b ? g2(b, a % b) : Math.abs(a));

const N = (v) => { v = rnd(v); const s = String(Math.abs(v)).split("."); let i = s[0]; if (i.length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\,"); return (v < 0 ? "-" : "") + i + (s[1] ? "{,}" + s[1] : ""); };
const NP = (v) => (v < 0 ? "(" + N(v) + ")" : N(v));
const den = (v) => { for (let d = 1; d <= 400; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-9) return d; return 0; };

const F = (v) => { const d = den(v); if (d === 1 || !d) return N(v); if ([2, 4, 5, 10, 20, 25, 50, 100].includes(d) && String(rnd(v)).length < 6) return N(v); const n = Math.round(v * d); return (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
const FS = (v) => { const d = den(v); if (d === 1 || !d) return String(rnd(v)).replace(".", ","); return Math.round(v * d) + "/" + d; };
const sg = (v) => (v < 0 ? " - " + N(-v) : " + " + N(v));
const X = " \\times ";
const co = (a, v = "x") => (a === 1 ? v : a === -1 ? "-" + v : N(a) + v);
const lin = (a, b, v = "x") => (a ? co(a, v) + (b ? sg(b) : "") : N(b));
const linE = (a, b, v = "x") => (a === 1 ? v : a === -1 ? "-" + v : a + "*" + v) + (b < 0 ? "-" + -b : b ? "+" + b : "");
const keepT = (spec, traps) => (traps || []).filter((tr) => {
if (!tr) return false;
if (tr.e) { try { return !Expr.equivalent(Expr.parse(tr.e), Expr.parse(spec.expr)); } catch (e) { return false; } }
if (tr.spec && tr.spec.kind === "pair") return tr.spec.values.every(isFinite) && tr.spec.values.some((x, i) => Math.abs(x - spec.values[i]) > 1e-9);
if (tr.spec) { try { return checkAnswer(spec, SolSet.show(tr.spec.ivs, false)).status !== "correct"; } catch (e) { return false; } }
if (tr.s) return tr.s.every(isFinite) && !(tr.s.length === spec.values.length && tr.s.every((x) => spec.values.some((y) => Math.abs(x - y) < 1e-9)));
return isFinite(tr.v) && Math.abs(tr.v - spec.value) > Math.max(1e-9, spec.round ? spec.round : 0);
});

const mk = (q, spec, sol, o) => { const x = { q, spec, sol, guide: o.guide, ctx: o.ctx, traps: keepT(spec, o.traps) }; for (const k of ["fig", "canon", "shownOk", "calcul"]) if (o[k] !== undefined) x[k] = o[k]; return x; };
const QN = (q, value, sol, o) => mk(q, { kind: "value", value }, sol, Object.assign({ canon: FS(value) }, o));
const QR = (q, value, round, sol, o) => mk(q, { kind: "value", value, round }, sol, Object.assign({ canon: String(rnd(Math.round(value / round) * round, 6)).replace(".", ",") }, o));
const QX = (q, expr, sol, o) => mk(q, { kind: "expr", expr }, sol, Object.assign({ canon: expr }, o));
const QS = (q, ivs, sol, o) => mk(q, solsetSpec(ivs), sol, Object.assign({ canon: SolSet.show(ivs, false) }, o));
const QSet = (q, vals, sol, o) => mk(q, { kind: "set", values: [...new Set(vals)] }, sol, Object.assign({ canon: [...new Set(vals)].map(FS).join(" ; ") }, o));
const QP = (q, vals, sol, o) => mk(q, { kind: "pair", values: vals }, sol, Object.assign({ canon: vals.map(FS).join(" ; ") }, o));
const GR = (ask, value, sol, round) => ({ ask, spec: Object.assign({ kind: "value", value }, round ? { round } : {}), sol });
const GX = (ask, expr, sol) => ({ ask, spec: { kind: "expr", expr }, sol });
const GSet = (ask, vals, sol) => ({ ask, spec: { kind: "set", values: [...new Set(vals)] }, sol });
const GP = (ask, vals, sol) => ({ ask, spec: { kind: "pair", values: vals }, sol });
const TR = TRAP, TX = (e, m) => ({ e, m }), TS = (ivs, m) => ({ spec: solsetSpec(ivs), m });

const P = (q, parts, hints, sol) => ({ q, parts: parts.map(([label, value]) => ({ label, spec: { kind: "value", value } })), hints, sol });

const reg = (defs) => {
for (const d of defs) {
if (!NOTIONS.some((n) => n.id === d.id)) NOTIONS.push(Object.assign({ id: d.id, theme: d.theme, label: d.label, ex: d.ex, CH: null, MP: null, FR: d.FR }, d.againFR ? { againFR: d.againFR } : {}));
GEN[d.id] = (lv) => pickForm(d.g[Math.min(Math.max(lv, 1), 3)]);
if (typeof VAR !== "undefined") VAR[d.id] = {};
HINTS_EXTRA[d.id] = d.hint;
LESSONS_EXTRA[d.id] = d.lesson;
if (typeof COMPS !== "undefined") COMPS[d.id] = d.comps;
if (d.probs && typeof PROB_EXTRA !== "undefined") PROB_EXTRA[d.id] = d.probs;
}
};
return { pk, nz, rnd, g2, N, NP, den, F, FS, sg, X, co, lin, linE, mk, QN, QR, QX, QS, QSet, QP, GR, GX, GSet, GP, TR, TX, TS, P, reg };
})();

(function () {
const { pk, nz, rnd, g2, N, NP, F, FS, sg, X, co, lin, QN, QR, QX, QSet, QP, GR, GX, GP, TR, TX, P, reg } = FRX;
const tri = (B, C) => "x^2" + (B ? (B < 0 ? " - " : " + ") + co(Math.abs(B)) : "") + (C ? sg(C) : "");


const ED = {
1: [
() => { const a = pk([2, 3, 4, 5, -2, -3, -4, 0.5, -0.5]), k = pk([1, 2, 3, -2, 5]);
return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = " + (k === 1 ? "" : k === -1 ? "-" : N(k)) + "e^{" + co(a) + "}") + ". Tape « exp(…) » ou « e^(…) ».", (k * a) + "*exp(" + a + "*x)",
M("(e^{ax})' = a\\,e^{ax}") + " : " + M("f'(x) = " + N(k) + X + NP(a) + "\\,e^{" + co(a) + "} = " + N(k * a) + "e^{" + co(a) + "}") + ".",
{ ctx: "eax", guide: [GR("Dérivée de " + M("e^{" + co(a) + "}") + " : par quel nombre multiplie-t-on " + M("e^{" + co(a) + "}") + " ?", a, M(N(a)) + "."), GX(M("f'(x)") + " ?", (k * a) + "*exp(" + a + "*x)", M(N(k * a) + "e^{" + co(a) + "}") + ".")],
traps: [TX(k + "*exp(" + a + "*x)", "La dérivée de e^(ax) n'est pas e^(ax) : on multiplie par a."), TX((k * a) + "*exp(" + (a - 1) + "*x)", "L'exposant ne baisse pas : ce n'est pas une puissance de x."), TX((k * a) + "*x*exp(" + a + "*x)", "Pas de x devant : (e^(ax))' = a e^(ax).")] }); },
() => { const k = nz(-5, 6), b = nz(-6, 6), c = nz(-9, 9); if (Math.abs(k) === 1 && R.rand() < 0.5) return null;
const e = k + "*exp(x)" + (2 * b < 0 ? "-" + -2 * b : "+" + 2 * b) + "*x";
return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = " + co(k, "e^{x}") + sg(b) + "x^2" + sg(c)) + ".", e,
M("(e^x)' = e^x") + ", " + M("(x^2)' = 2x") + ", la constante disparaît : " + M("f'(x) = " + co(k, "e^{x}") + sg(2 * b) + "x") + ".",
{ ctx: "somme", guide: [GX("Dérivée de " + M(co(k, "e^{x}")) + " ?", k + "*exp(x)", M(co(k, "e^{x}")) + "."), GX(M("f'(x)") + " ?", e, M(co(k, "e^{x}") + sg(2 * b) + "x") + ".")],
traps: [TX(k + "*exp(x)+" + 2 * b + "*x+" + c, "La dérivée d'une constante est 0."), TX(k + "*x*exp(x)+" + 2 * b + "*x", "(e^x)' = e^x, pas x e^x."), TX(k + "*exp(x)+" + b + "*x", "(x²)' = 2x : le coefficient double.")] }); },
() => { const c = nz(-4, 5), a = pk([2, 3, -2, -3, 4, 0.5]), b = nz(-6, 6), v = c * a + b;
return QN("Soit " + M("f(x) = " + co(c, "e^{" + co(a) + "}") + sg(b) + "x") + ". Calcule " + M("f'(0)") + ".", v,
M("f'(x) = " + N(c * a) + "e^{" + co(a) + "}" + sg(b)) + " et " + M("e^0 = 1") + " : " + M("f'(0) = " + N(c * a) + sg(b) + " = " + N(v)) + ".",
{ ctx: "valeur-0", guide: [GX(M("f'(x)") + " ?", (c * a) + "*exp(" + a + "*x)+" + b, M(N(c * a) + "e^{" + co(a) + "}" + sg(b)) + "."), GR(M("f'(0)") + " ?", v, M(N(v)) + ".")],
traps: [TR(c + b, "On multiplie aussi par " + N(a).replace("{,}", ",") + " (dérivée de e^(ax))."), TR(c, "C'est f(0), pas f'(0) : dérive d'abord."), TR(c * a, "Le terme " + b + "x a pour dérivée " + b + ".")] }); },
],
2: [
() => { const a = nz(-3, 4), b = nz(-6, 6), e = "(" + FRX.linE(a, a + b) + ")*exp(x)";
return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = (" + lin(a, b) + ")e^{x}") + ", sous la forme " + M("(\\dots)e^{x}") + ".", e,
"Produit " + M("uv") + " avec " + M("u = " + lin(a, b)) + ", " + M("v = e^x") + " : " + M("f'(x) = " + N(a) + "e^x + (" + lin(a, b) + ")e^x = (" + lin(a, a + b) + ")e^{x}") + ".",
{ ctx: "produit", guide: [GR(M("u'(x)") + " (u = " + M(lin(a, b)) + ") ?", a, M(N(a)) + "."), GX(M("f'(x) = u'v + uv'") + " ?", e, M("(" + lin(a, a + b) + ")e^{x}") + ".")],
traps: [TX(a + "*exp(x)", "(uv)' = u'v + uv' : il manque le terme uv'."), TX("(" + FRX.linE(a, b) + ")*exp(x)", "C'est f(x), pas f'(x) : la dérivée de " + lin(a, b).replace(/\\/g, "") + " s'ajoute."), TX(a + "*x*exp(x)", "(uv)' n'est pas u'v'.")] }); },
() => { const c = nz(-4, 5), m = c - 1;
return QN("Soit " + M("f(x) = (x" + sg(-c) + ")e^{x}") + " sur " + M("\\mathbb{R}") + ". En quelle abscisse " + M("f") + " atteint-elle son minimum ?", m,
M("f'(x) = e^x + (x" + sg(-c) + ")e^x = (x" + sg(1 - c) + ")e^x") + ". Comme " + M("e^x > 0") + ", " + M("f'") + " a le signe de " + M("x" + sg(1 - c)) + " : négative puis positive, " + M("f") + " est minimale en " + M("x = " + N(m)) + ".",
{ ctx: "minimum", guide: [GX(M("f'(x)") + " ? (sous la forme (…)e^x)", "(x" + (1 - c >= 0 ? "+" : "") + (1 - c) + ")*exp(x)", M("(x" + sg(1 - c) + ")e^x") + "."), GR("Pour quel " + M("x") + " a-t-on " + M("f'(x) = 0") + " ?", m, M("x = " + N(m)) + " (" + M("e^x") + " ne s'annule jamais).")],
traps: [TR(c, "En " + c + ", f s'annule ; le minimum est là où f' s'annule."), TR(c + 1, "f'(x) = (x − " + (c - 1) + ")eˣ : attention au signe."), TR(0, "e^x ne s'annule pas, mais f'(x) = (x − " + (c - 1) + ")eˣ s'annule.")] }); },
() => { const a = pk([2, 3, -2, -3, 4, -4]), b = pk([-5, -4, -3, -2, 2, 3, 4, 5]), e = a + "*x+" + (1 + b);
return QX("Donne l'équation réduite de la tangente à la courbe de " + M("f(x) = e^{" + co(a) + "}" + sg(b)) + " au point d'abscisse " + M("0") + ". Réponds « y = … ».", e,
M("f(0) = 1" + sg(b) + " = " + N(1 + b)) + ", " + M("f'(x) = " + N(a) + "e^{" + co(a) + "}") + ", " + M("f'(0) = " + N(a)) + " : " + M("y = " + lin(a, 1 + b)) + ".",
{ ctx: "tangente-0", guide: [GR(M("f(0)") + " ?", 1 + b, M("e^0" + sg(b) + " = " + N(1 + b)) + "."), GR(M("f'(0)") + " ?", a, M(N(a)) + "."), GX("Équation " + M("y = f'(0)\\,x + f(0)") + " ?", e, M("y = " + lin(a, 1 + b)) + ".")],
traps: [TX(a + "*x+" + b, "e⁰ = 1 : f(0) = 1 + " + b + "."), TX("x+" + (1 + b), "f'(0) = " + a + " (dérivée de e^(ax) en 0)."), TX(a + "*x", "La tangente passe par (0 ; f(0)).")] }); },
],
3: [
() => { const c = pk([["La concentration d'un médicament dans le sang", "mg/L", "heures", "medicament"], ["La température d'un café posé sur une table, au-dessus de celle de la pièce,", "°C", "minutes", "cafe"], ["La masse d'un échantillon radioactif", "g", "années", "radioactif"]]);
const C0 = pk([20, 40, 50, 80, 120]), k = pk([0.1, 0.2, 0.25, 0.5]), v = -k * C0;
return QN(c[0] + " vaut " + M("C(t) = " + N(C0) + "\\,e^{-" + N(k) + "t}") + " (en " + c[1] + ", " + M("t") + " en " + c[2] + "). Calcule " + M("C'(0)") + ", la vitesse de variation à l'instant initial.", v,
M("C'(t) = " + N(C0) + X + "(-" + N(k) + ")\\,e^{-" + N(k) + "t}") + ", donc " + M("C'(0) = " + N(v)) + " : la grandeur diminue d'environ " + M(N(-v)) + " " + c[1] + " par unité de temps au départ.",
{ ctx: "decroissance-" + c[3], guide: [GX(M("C'(t)") + " ?", v + "*exp(-" + k + "*t)", M(N(v) + "\\,e^{-" + N(k) + "t}") + "."), GR(M("C'(0)") + " ?", v, M(N(v)) + ".")],
traps: [TR(C0, "C'est C(0), pas C'(0)."), TR(-v, "La grandeur diminue : C'(0) est négative."), TR(-k, "On multiplie par " + C0 + " aussi.")] }); },
() => { const r1 = nz(-4, 3); let r2 = nz(-4, 4); if (r2 === r1) r2 = r1 + 2; const b = -(r1 + r2) - 2, c = r1 * r2 - b;
const poly = "x^2" + (b ? sg(b) + "x" : "") + (c ? sg(c) : "");
return QSet("Soit " + M("f(x) = (" + poly + ")e^{x}") + ". En quelles abscisses la tangente à la courbe de " + M("f") + " est-elle horizontale ? Sépare les valeurs par « ; ».", [r1, r2],
M("f'(x) = (" + lin(2, b) + ")e^x + (" + poly + ")e^x = (" + tri(b + 2, b + c) + ")e^x") + ". Comme " + M("e^x > 0") + ", on résout " + M(tri(b + 2, b + c) + " = 0") + " : " + M("x = " + N(Math.min(r1, r2))) + " ou " + M("x = " + N(Math.max(r1, r2))) + ".",
{ ctx: "extremums-trinome", guide: [GX(M("f'(x)") + " ? (forme (…)e^x)", "(x^2+" + (b + 2) + "*x+" + (b + c) + ")*exp(x)", M("(" + tri(b + 2, b + c) + ")e^x") + "."), GSetLoc("Racines du trinôme ?", [r1, r2])],
traps: [{ s: (() => { const d = b * b - 4 * c; return d >= 0 ? [(-b - Math.sqrt(d)) / 2, (-b + Math.sqrt(d)) / 2] : [NaN]; })(), m: "Ce sont les racines de f (ou du premier facteur) : il faut celles de f'." }, { s: [r1], m: "Il y a deux abscisses." }] }); },
() => { const a = pk([2, 3, 4, 5, 6]), k = pk([1, 2, 3, 4]), vmax = a * k * Math.exp(-1);
return pk([0, 1]) ? QN("Soit " + M("f(x) = " + N(a) + "x\\,e^{-x/" + k + "}") + " pour " + M("x \\geqslant 0") + (k === 1 ? "" : " (avec " + M("e^{-x/" + k + "}") + ")") + ". En quelle abscisse " + M("f") + " atteint-elle son maximum ?", k,
M("f'(x) = " + N(a) + "e^{-x/" + k + "} - \\frac{" + N(a) + "}{" + k + "}x\\,e^{-x/" + k + "} = " + N(a) + "e^{-x/" + k + "}\\left(1 - \\frac{x}{" + k + "}\\right)") + " : positive avant " + M(k) + ", négative après. Maximum en " + M("x = " + k) + ".",
{ ctx: "maximum-x", guide: [GX(M("f'(x)") + " ?", a + "*exp(-x/" + k + ")*(1-x/" + k + ")", M(N(a) + "e^{-x/" + k + "}\\left(1 - \\frac{x}{" + k + "}\\right)") + "."), GR(M("f'(x) = 0") + " pour " + M("x") + " = ?", k, M(k) + ".")],
traps: [TR(0, "En 0, f vaut 0 : c'est le minimum sur [0 ; +∞[."), TR(1 / k, "Résous 1 − x/" + k + " = 0."), TR(a, "Le coefficient " + a + " ne change pas l'abscisse du maximum.")] })
: QR("Soit " + M("f(x) = " + N(a) + "x\\,e^{-x/" + k + "}") + " pour " + M("x \\geqslant 0") + ". Son maximum est atteint en " + M("x = " + k) + ". Quelle est sa valeur maximale (au centième) ?", vmax, 0.01,
M("f(" + k + ") = " + N(a * k) + "\\,e^{-1} = \\frac{" + N(a * k) + "}{e} \\approx " + N(rnd(vmax, 2))) + ".",
{ ctx: "maximum-valeur", guide: [GR(M("f(" + k + ")") + " (au centième) ?", vmax, M("\\frac{" + N(a * k) + "}{e} \\approx " + N(rnd(vmax, 2))) + ".", 0.01)],
traps: [TR(rnd(a * k, 2), "e^(−" + k + "/" + k + ") = e^(−1) ≈ 0,37, pas 1."), TR(rnd(a * k * Math.exp(1), 2), "L'exposant est négatif : on divise par e.")] }); },
],
};

function GSetLoc(ask, vals) { return FRX.GSet(ask, vals, M(vals.map(N).join(" \\,;\\, ")) + "."); }



const R3 = Math.sqrt(3) / 2, R2 = Math.SQRT2 / 2;
const ex2 = (v) => { const t = [[0, "0", "0"], [0.5, "\\frac{1}{2}", "1/2"], [R2, "\\frac{\\sqrt{2}}{2}", "√2/2"], [R3, "\\frac{\\sqrt{3}}{2}", "√3/2"], [1, "1", "1"]].find((e) => Math.abs(Math.abs(v) - e[0]) < 1e-9);
return v < -1e-12 ? ["-" + t[1], "-" + t[2]] : [t[1], t[2]]; };

const ang = (k, d) => { const g = FRX.g2(k, d) || 1; k /= g; d /= g; if (k === 0) return ["0", "0"]; const s = k < 0 ? "-" : "", a = Math.abs(k);
return d === 1 ? [s + (a === 1 ? "" : a) + "\\pi", s + (a === 1 ? "" : a) + "π"] : [s + "\\frac{" + (a === 1 ? "" : a) + "\\pi}{" + d + "}", s + (a === 1 ? "" : a) + "π/" + d]; };
const ANG = [[1, 6], [1, 4], [1, 3], [2, 3], [3, 4], [5, 6], [7, 6], [5, 4], [4, 3], [5, 3], [7, 4], [11, 6], [-1, 6], [-1, 4], [-1, 3], [-2, 3], [-3, 4], [-5, 6]];

const princ = (k, d) => { let m = ((k % (2 * d)) + 2 * d) % (2 * d); if (m > d) m -= 2 * d; return m; };
const TG = {
1: [
() => { const [k, d] = pk(ANG), fn = pk(["cos", "sin"]), t = (k * Math.PI) / d, v = rnd(fn === "cos" ? Math.cos(t) : Math.sin(t)), [vt, vs] = ex2(v), [at] = ang(k, d);
const sv = Math.sign(rnd(fn === "cos" ? Math.cos(t) : Math.sin(t), 9));
return mk2("Sans calculatrice, donne la valeur exacte de " + M("\\" + fn + "\\left(" + at + "\\right)") + ".", v, vs,
"Sur le cercle trigonométrique, le point associé à " + M(at) + " a pour " + (fn === "cos" ? "abscisse" : "ordonnée") + " " + M(vt) + " (le quadrant donne le signe).",
{ ctx: "valeur-" + fn, guide: [GR(fn === "cos" ? "Le point est-il à droite (tape 1) ou à gauche (tape −1) de l'axe vertical (0 s'il est dessus) ?" : "Le point est-il en haut (tape 1) ou en bas (tape −1) de l'axe horizontal (0 s'il est dessus) ?", sv, sv > 0 ? "Signe positif." : sv < 0 ? "Signe négatif." : "Valeur nulle."), GR("Valeur exacte ?", v, M(vt) + ".")],
traps: [TR(-v, "Le signe dépend du quadrant : regarde où se trouve le point."), TR(rnd(fn === "cos" ? Math.sin(t) : Math.cos(t)), "Cosinus = abscisse, sinus = ordonnée.")] }); },
() => { const pairs = [[30, 1, 6], [45, 1, 4], [60, 1, 3], [120, 2, 3], [135, 3, 4], [150, 5, 6], [210, 7, 6], [240, 4, 3], [270, 3, 2], [300, 5, 3], [330, 11, 6], [72, 2, 5], [36, 1, 5], [20, 1, 9]];
const [deg, k, d] = pk(pairs), [at, as] = ang(k, d), toRad = R.rand() < 0.5;
return toRad ? mk2("Convertis " + M(deg + "°") + " en radians (valeur exacte, avec " + M("\\pi") + ").", (k * Math.PI) / d, as,
M("180° = \\pi") + " rad, donc " + M(deg + "° = " + deg + X + "\\frac{\\pi}{180} = " + at) + ".",
{ ctx: "deg-rad", guide: [GR("Par quel nombre multiplie-t-on " + M("\\pi") + " ? (fraction : " + M(deg) + " sur 180)", deg / 180, M("\\frac{" + deg + "}{180} = " + F(deg / 180)) + "."), GR("Mesure en radians ?", (k * Math.PI) / d, M(at) + ".")],
traps: [TR((deg * Math.PI) / 360, "180° = π (pas 360°)."), TR((180 * Math.PI) / deg / 1, "On multiplie par π/180, on ne divise pas.")] })
: QN("Convertis " + M(at) + " rad en degrés.", deg, M("\\pi") + " rad " + M("= 180°") + ", donc " + M(at + " = " + (k === 1 ? "" : k + X) + "\\frac{180°}{" + d + "} = " + deg + "°") + ".",
{ ctx: "rad-deg", guide: [GR("Combien de degrés vaut " + M("\\frac{\\pi}{" + d + "}") + " ?", 180 / d, M("\\frac{180°}{" + d + "} = " + N(180 / d) + "°") + "."), GR("Et " + M(at) + " ?", deg, M(deg + "°") + ".")],
traps: [TR(360 * k / d, "π rad = 180°, pas 360°."), TR(180 / d, "Multiplie par " + k + ".")] }); },
() => { const [k, d] = pk(ANG.filter(([a, b]) => b !== 1)), m = princ(k, d), [at, as] = ang(m, d), t = (m * Math.PI) / d, [ct] = ex2(rnd(Math.cos(t))), [st] = ex2(rnd(Math.sin(t)));
return mk2("Le point " + M("M") + " du cercle trigonométrique a pour coordonnées " + M("\\left(" + ct + " \\,;\\, " + st + "\\right)") + ". Quelle est la mesure de l'angle " + M("x") + " associé à " + M("M") + " dans " + M("]-\\pi \\,;\\, \\pi]") + " ?", t, as,
M("\\cos x = " + ct) + " et " + M("\\sin x = " + st) + " : " + (Math.sin(t) >= 0 ? "le point est en haut" : "le point est en bas, l'angle est négatif") + " ; " + M("x = " + at) + ".",
{ ctx: "point", guide: [GR("Le point est-il en haut (1) ou en bas (−1) ?", Math.sin(t) > 0 ? 1 : -1, Math.sin(t) > 0 ? "En haut : sinus positif, x entre 0 et π." : "En bas : sinus négatif, x entre −π et 0."), GR("Mesure de " + M("x") + " ?", t, M(at) + ".")],
traps: [TR(-t, "Regarde le signe du sinus : il donne le demi-cercle (haut ou bas)."), TR(Math.PI - t, "Regarde le signe du cosinus : il donne le côté (droite ou gauche).")] }); },
],
2: [
() => { const d = pk([3, 4, 6]), base = pk([1, 2, 3, 4, 5].filter((b) => FRX.g2(b, d) === 1)), tours = pk([1, 2, 3, -1, -2]), k = base + 2 * d * tours, kk = R.rand() < 0.5 ? k : -k, m = princ(kk, d), [at] = ang(kk, d), [mt, ms] = ang(m, d);
if (Math.abs(kk) <= d) return null;
return mk2("Donne la mesure principale de l'angle " + M(at) + " (la mesure qui est dans " + M("]-\\pi \\,;\\, \\pi]") + ").", (m * Math.PI) / d, ms,
"On retire (ou on ajoute) des tours complets " + M("2\\pi = \\frac{" + 2 * d + "\\pi}{" + d + "}") + " : " + M(at + " = " + mt + (kk - m > 0 ? " + " : " - ") + Math.abs((kk - m) / (2 * d)) + X + "2\\pi") + ". Mesure principale : " + M(mt) + ".",
{ ctx: "mesure-principale", guide: [GR("Combien de tours complets " + M("2\\pi") + " faut-il retirer (négatif s'il faut en ajouter) ?", (kk - m) / (2 * d), M(N((kk - m) / (2 * d))) + "."), GR("Mesure principale ?", (m * Math.PI) / d, M(mt) + ".")],
traps: [TR(((m + 2 * d) * Math.PI) / d, "Une mesure principale est dans ]−π ; π] : retire encore un tour."), TR((((kk % d) + d) % d * Math.PI) / d, "Un tour vaut 2π, pas π.")] }); },
() => { const c = pk([0.2, 0.3, 0.4, 0.6, 0.7, 0.8]), fn = pk(["cos", "sin"]), forms = fn === "cos" ? [["\\pi - x", -c], ["\\pi + x", -c], ["-x", c], ["x + 2\\pi", c]] : [["\\pi - x", c], ["\\pi + x", -c], ["-x", -c], ["x - 2\\pi", c]];
const [f, v] = pk(forms);
return QN("On sait que " + M("\\" + fn + " x = " + N(c)) + ". Que vaut " + M("\\" + fn + "(" + f + ")") + " ?", v,
"Sur le cercle trigonométrique, le point associé à " + M(f) + " est le symétrique de celui de " + M("x") + " " + ({ "\\pi - x": "par rapport à l'axe des ordonnées", "\\pi + x": "par rapport à l'origine", "-x": "par rapport à l'axe des abscisses", "x + 2\\pi": "(même point : un tour de plus)", "x - 2\\pi": "(même point : un tour de moins)" })[f] + " : " + M("\\" + fn + "(" + f + ") = " + N(v)) + ".",
{ ctx: "associe-" + fn, guide: [GR("Même valeur (1) ou valeur opposée (−1) ?", Math.sign(v / c), v === c ? "Même valeur." : "Valeur opposée."), GR(M("\\" + fn + "(" + f + ")") + " ?", v, M(N(v)) + ".")],
traps: [TR(-v, "Dessine les deux points : quelle symétrie passe de x à " + f.replace(/\\pi/g, "π") + " ?"), TR(rnd(Math.sqrt(1 - c * c)), "On reste sur la même fonction (" + fn + ") : pas besoin de sin² + cos² = 1.")] }); },
() => { const [c, s] = pk([[0.6, 0.8], [0.8, 0.6], [0.28, 0.96], [0.96, 0.28], [5 / 13, 12 / 13], [12 / 13, 5 / 13]]), q = pk([[1, "\\left[0 \\,;\\, \\frac{\\pi}{2}\\right]", 1, 1], [2, "\\left[\\frac{\\pi}{2} \\,;\\, \\pi\\right]", -1, 1], [3, "\\left[-\\pi \\,;\\, -\\frac{\\pi}{2}\\right]", -1, -1], [4, "\\left[-\\frac{\\pi}{2} \\,;\\, 0\\right]", 1, -1]]);
const askSin = R.rand() < 0.5, giv = askSin ? q[2] * c : q[3] * s, v = askSin ? q[3] * s : q[2] * c;
return QN("On sait que " + M((askSin ? "\\cos" : "\\sin") + " x = " + F(giv)) + " et que " + M("x \\in " + q[1]) + ". Calcule " + M((askSin ? "\\sin" : "\\cos") + " x") + " (valeur exacte).", v,
M("\\cos^2 x + \\sin^2 x = 1") + ", donc " + M((askSin ? "\\sin^2" : "\\cos^2") + " x = 1 - " + F(giv * giv) + " = " + F(v * v)) + ". Sur cet intervalle, " + M((askSin ? "\\sin" : "\\cos") + " x") + " est " + (v > 0 ? "positif" : "négatif") + " : " + M(F(v)) + ".",
{ ctx: "pythagore-" + (askSin ? "sin" : "cos"), guide: [GR(M((askSin ? "\\sin^2" : "\\cos^2") + " x") + " ?", v * v, M(F(v * v)) + "."), GR("Signe sur l'intervalle : 1 ou −1 ?", Math.sign(v), v > 0 ? "Positif." : "Négatif."), GR("Valeur ?", v, M(F(v)) + ".")],
traps: [TR(-v, "L'intervalle donne le signe : regarde le quadrant."), TR(rnd(1 - Math.abs(giv)), "sin² + cos² = 1 : ce sont les carrés qui s'ajoutent."), TR(v * v, "Il faut encore prendre la racine.")] }); },
],
3: [
() => { const [k1, d1] = pk(ANG), [k2, d2] = pk(ANG), t1 = (k1 * Math.PI) / d1, t2 = (k2 * Math.PI) / d2, v = rnd(Math.cos(t1) + Math.sin(t2), 9), [a1] = ang(k1, d1), [a2] = ang(k2, d2), [c1] = ex2(rnd(Math.cos(t1))), [s2] = ex2(rnd(Math.sin(t2)));
if (Math.abs(v) < 1e-9 || Math.abs(Math.abs(v) - 1) < 1e-9) return null;
const vs = exS(v); if (!vs) return null;
return mk2("Calcule la valeur exacte de " + M("\\cos\\left(" + a1 + "\\right) + \\sin\\left(" + a2 + "\\right)") + ".", v, vs,
M("\\cos\\left(" + a1 + "\\right) = " + c1) + " et " + M("\\sin\\left(" + a2 + "\\right) = " + s2) + " : la somme vaut " + M(exT(v)) + ".",
{ ctx: "somme", guide: [GR(M("\\cos\\left(" + a1 + "\\right)") + " ?", rnd(Math.cos(t1)), M(c1) + "."), GR(M("\\sin\\left(" + a2 + "\\right)") + " ?", rnd(Math.sin(t2)), M(s2) + "."), GR("Somme ?", v, M(exT(v)) + ".")],
traps: [TR(rnd(-Math.cos(t1) + Math.sin(t2), 9), "Vérifie le signe du cosinus (côté gauche ou droit)."), TR(rnd(Math.cos(t1) - Math.sin(t2), 9), "Vérifie le signe du sinus (haut ou bas).")] }); },
() => { const fn = pk(["cos", "sin"]), [vt, vs, vv] = pk([["\\frac{1}{2}", "1/2", 0.5], ["-\\frac{1}{2}", "-1/2", -0.5], ["\\frac{\\sqrt{2}}{2}", "√2/2", R2], ["-\\frac{\\sqrt{2}}{2}", "-√2/2", -R2], ["\\frac{\\sqrt{3}}{2}", "√3/2", R3], ["-\\frac{\\sqrt{3}}{2}", "-√3/2", -R3]]);
const a = fn === "cos" ? Math.acos(vv) : Math.asin(vv), sols = fn === "cos" ? [a, -a] : [a, a >= 0 ? Math.PI - a : -Math.PI - a];
const txt = (t) => { for (const d of [6, 4, 3, 2, 1]) { const k = Math.round((t * d) / Math.PI); if (Math.abs((k * Math.PI) / d - t) < 1e-9) return ang(k, d); } return ["?", "?"]; };
return QSet("Par lecture du cercle trigonométrique, donne les réels " + M("x") + " de " + M("]-\\pi \\,;\\, \\pi]") + " tels que " + M("\\" + fn + " x = " + vt) + ". Sépare-les par « ; » (avec π).", sols,
(fn === "cos" ? "On cherche les points d'abscisse " : "On cherche les points d'ordonnée ") + M(vt) + " : il y en a deux, " + (fn === "cos" ? "symétriques par rapport à l'axe des abscisses" : "symétriques par rapport à l'axe des ordonnées") + ". " + M("x = " + txt(sols[0])[0]) + " ou " + M("x = " + txt(sols[1])[0]) + ".",
{ ctx: "lecture-" + fn, canon: sols.map((t) => txt(t)[1]).join(" ; "), guide: [GR("Une solution (dans " + M("[0 \\,;\\, \\pi]") + (fn === "sin" ? " ou " + M("[-\\pi \\,;\\, 0]") : "") + ") ?", sols[0], M(txt(sols[0])[0]) + "."), GSetLoc2("Les deux solutions ?", sols, sols.map((t) => txt(t)[0]).join(" \\,;\\, "))],
traps: [{ s: [sols[0]], m: "Il y a deux points du cercle avec cette " + (fn === "cos" ? "abscisse" : "ordonnée") + "." }, { s: fn === "cos" ? [Math.asin(vv), Math.PI - Math.asin(vv)] : [Math.acos(vv), -Math.acos(vv)], m: (fn === "cos" ? "Cosinus = abscisse" : "Sinus = ordonnée") + " : tu as lu l'autre coordonnée." }] }); },
() => { const s = pk([0.6, 0.8, 0.28, 0.96]), c = rnd(Math.sqrt(1 - s * s)), form = pk([["\\cos(\\pi - x)", c, "cos(π − x) = −cos x"], ["\\sin(\\pi + x) + \\cos(-x)", rnd(-s - c), "sin(π + x) = −sin x et cos(−x) = cos x"], ["\\cos(x + \\pi) - \\sin(\\pi - x)", rnd(c - s), "cos(x + π) = −cos x et sin(π − x) = sin x"]]);
return QN("On sait que " + M("\\sin x = " + N(s)) + " et que " + M("x \\in \\left[\\frac{\\pi}{2} \\,;\\, \\pi\\right]") + ". Calcule " + M(form[0]) + ".", form[1],
"Sur cet intervalle, " + M("\\cos x < 0") + " : " + M("\\cos x = -\\sqrt{1 - " + N(s * s) + "} = " + N(-c)) + ". Puis " + form[2] + " : " + M(form[0] + " = " + N(form[1])) + ".",
{ ctx: "associe-quadrant", guide: [GR(M("\\cos x") + " ?", -c, M(N(-c)) + " (négatif : x entre π/2 et π)."), GR(M(form[0]) + " ?", form[1], M(N(form[1])) + ".")],
traps: [TR(form[0] === "\\cos(\\pi - x)" ? -c : rnd(-s + c), "Sur [π/2 ; π], le cosinus est négatif : cos x = " + N(-c).replace("{,}", ",") + "."), TR(-form[1], "Vérifie les signes des angles associés.")] }); },
],
};

function exS(v) { for (const [r, t] of [[0, ""], [R2, "√2/2"], [R3, "√3/2"]]) for (const a of [-1.5, -1, -0.5, 0, 0.5, 1, 1.5]) for (const sgn of [1, -1]) if (r && Math.abs(a + sgn * r - v) < 1e-9) return (a ? FS(a) : "") + (sgn > 0 ? (a ? " + " : "") : " - ") + t; return null; }
function exT(v) { for (const [r, t] of [[R2, "\\frac{\\sqrt{2}}{2}"], [R3, "\\frac{\\sqrt{3}}{2}"]]) for (const a of [-1.5, -1, -0.5, 0, 0.5, 1, 1.5]) for (const sgn of [1, -1]) if (Math.abs(a + sgn * r - v) < 1e-9) return (a ? F(a) : "") + (sgn > 0 ? (a ? " + " : "") : " - ") + t; return N(v); }
function GSetLoc2(ask, vals, tex) { return FRX.GSet(ask, vals, M(tex) + "."); }

function mk2(q, value, canon, sol, o) { return FRX.mk(q, { kind: "value", value }, sol, Object.assign({ canon }, o)); }


const pt = (x, y) => M("(" + N(x) + " \\,;\\, " + N(y) + ")");
const vc = (a, b) => M("\\begin{pmatrix} " + N(a) + " \\\\ " + N(b) + " \\end{pmatrix}");
const vcm = (a) => M("\\begin{pmatrix} " + N(a) + " \\\\ m \\end{pmatrix}");
const cartT = (a, b, c) => { let s = a === 1 ? "x" : a === -1 ? "-x" : N(a) + "x"; s += b ? (b < 0 ? " - " : " + ") + (Math.abs(b) === 1 ? "" : N(Math.abs(b))) + "y" : ""; s += c ? sg(c) : ""; return s + " = 0"; };
const DN = {
1: [
() => { const a = nz(-5, 5), b = nz(-5, 5), x0 = nz(-6, 6), y0 = nz(-6, 6), c = -(a * x0 + b * y0); if (!c) return null;
return QN("La droite " + M("d") + " passe par " + M("A") + pt(x0, y0) + " et admet " + M("\\vec{n}") + vc(a, b) + " pour vecteur normal. Son équation s'écrit " + M(cartT(a, b, 0).replace(" = 0", "") + " + c = 0") + ". Que vaut " + M("c") + " ?", c,
"Un vecteur normal " + M("\\vec{n}(a \\,;\\, b)") + " donne l'équation " + M("ax + by + c = 0") + ". " + M("A") + " est sur " + M("d") + " : " + M(N(a) + X + NP(x0) + sg(b) + X + NP(y0) + " + c = 0") + ", donc " + M("c = " + N(c)) + ".",
{ ctx: "normal-c", guide: [GR("Remplace " + M("x") + " et " + M("y") + " par les coordonnées de " + M("A") + " : que vaut " + M(N(a) + X + NP(x0) + sg(b) + X + NP(y0)) + " ?", a * x0 + b * y0, M(N(a * x0 + b * y0)) + "."), GR(M("c") + " ?", c, M(N(c)) + ".")],
traps: [TR(-c, "a·x_A + b·y_A + c = 0 : c est l'opposé de a·x_A + b·y_A."), TR(-(a * y0 + b * x0), "x avec l'abscisse de A, y avec l'ordonnée.")] }); },
() => { const a = nz(-6, 6), b = nz(-6, 6), c = nz(-9, 9), k = pk([2, 3, -2, -1, -3]), m = k * b;
return QN("Le vecteur " + M("\\vec{u}") + vcm(k * a) + " est normal à la droite " + M("d : " + cartT(a, b, c)) + ". Que vaut " + M("m") + " ?", m,
"Un vecteur normal à " + M("d") + " est " + M("\\vec{n}") + vc(a, b) + ". " + M("\\vec{u}") + " est normal à " + M("d") + " s'il est colinéaire à " + M("\\vec{n}") + " : " + M(N(k * a) + " = " + N(k) + X + NP(a)) + ", donc " + M("m = " + N(k) + X + NP(b) + " = " + N(m)) + ".",
{ ctx: "normal-m", guide: [GP("Coordonnées d'un vecteur normal lu dans l'équation ? Réponds « a ; b ».", [a, b], vc(a, b) + "."), GR("Par quel nombre multiplie-t-on " + M("\\vec{n}") + " pour obtenir " + M("\\vec{u}") + " ?", k, M(N(k)) + "."), GR(M("m") + " ?", m, M(N(m)) + ".")],
traps: [TR(b, "Multiplie aussi la seconde coordonnée par " + k + "."), TR(-m, "Les deux coordonnées sont multipliées par le même nombre " + k + " : attention au signe."), TR(a, "Un vecteur normal est (a ; b) : (" + a + " ; " + b + "), multiplié par " + k + ".")] }); },
() => { const a = nz(-6, 6), b = nz(-6, 6), c = nz(-9, 9), k = pk([1, 2, -1, 3]), v = k * a;
return QN("La droite " + M("d : " + cartT(a, b, c)) + " admet un vecteur directeur " + M("\\vec{u}") + vcm(-k * b) + ". Que vaut " + M("m") + " ?", v,
"Pour " + M("ax + by + c = 0") + ", " + M("\\vec{u}(-b \\,;\\, a)") + " est directeur (il est orthogonal à " + M("\\vec{n}(a \\,;\\, b)") + "). Ici " + M("(-b \\,;\\, a) = ") + vc(-b, a) + " ; on le multiplie par " + M(k) + " : " + M("m = " + N(v)) + ".",
{ ctx: "directeur", guide: [GP("Un vecteur directeur " + M("(-b \\,;\\, a)") + " ? Réponds « x ; y ».", [-b, a], vc(-b, a) + "."), GR(M("m") + " ?", v, M(N(v)) + ".")],
traps: [TR(k * b, "(a ; b) est normal ; un directeur est (−b ; a)."), TR(-k * a, "Directeur : (−b ; a), sans changer le signe de a.")] }); },
],
2: [
() => { const xA = nz(-5, 5), yA = nz(-5, 5), xB = xA + nz(-5, 5), yB = yA + nz(-5, 5), xC = nz(-6, 6), yC = nz(-6, 6), a = xB - xA, b = yB - yA, c = -(a * xC + b * yC); if (!c || !a || !b) return null;
return QN("Soit " + M("A") + pt(xA, yA) + ", " + M("B") + pt(xB, yB) + " et " + M("C") + pt(xC, yC) + ". La droite perpendiculaire à " + M("(AB)") + " passant par " + M("C") + " a une équation de la forme " + M(cartT(a, b, 0).replace(" = 0", "") + " + c = 0") + ". Que vaut " + M("c") + " ?", c,
M("\\overrightarrow{AB}") + vc(a, b) + " est normal à la droite cherchée. Elle passe par " + M("C") + " : " + M(N(a) + X + NP(xC) + sg(b) + X + NP(yC) + " + c = 0") + ", " + M("c = " + N(c)) + ".",
{ ctx: "perpendiculaire", guide: [GP("Coordonnées de " + M("\\overrightarrow{AB}") + " ?", [a, b], vc(a, b) + "."), GR(M("c") + " ?", c, M(N(c)) + ".")],
traps: [TR(-(a * xA + b * yA), "La droite passe par C, pas par A."), TR(-c, "c = −(a·x_C + b·y_C)."), TR(-(-b * xC + a * yC), "AB est normal (pas directeur) à la perpendiculaire.")] }); },
() => { const xA = nz(-6, 6), yA = nz(-6, 6), a = 2 * nz(-3, 3), b = 2 * nz(-3, 3), xB = xA + a, yB = yA + b, mx = (xA + xB) / 2, my = (yA + yB) / 2, c = -(a * mx + b * my); if (!c) return null;
return QN("Soit " + M("A") + pt(xA, yA) + " et " + M("B") + pt(xB, yB) + ". La médiatrice de " + M("[AB]") + " a une équation de la forme " + M(cartT(a, b, 0).replace(" = 0", "") + " + c = 0") + ". Que vaut " + M("c") + " ?", c,
"La médiatrice passe par le milieu " + M("I") + pt(mx, my) + " et " + M("\\overrightarrow{AB}") + vc(a, b) + " lui est normal : " + M(N(a) + X + NP(mx) + sg(b) + X + NP(my) + " + c = 0") + ", " + M("c = " + N(c)) + ".",
{ ctx: "mediatrice", guide: [GP("Milieu " + M("I") + " de " + M("[AB]") + " ?", [mx, my], pt(mx, my) + "."), GR(M("c") + " ?", c, M(N(c)) + ".")],
traps: [TR(-(a * xA + b * yA), "La médiatrice passe par le milieu de [AB], pas par A."), TR(-c, "c = −(a·x_I + b·y_I).")] }); },
() => { const xO = nz(-4, 4), yO = nz(-4, 4), [dx, dy] = pk([[3, 4], [4, 3], [-3, 4], [-4, -3], [3, -4], [6, 8], [-8, 6], [-4, 3]]), xA = xO + dx, yA = yO + dy, c = -(dx * xA + dy * yA);
if (!c) return null;
return QN("Le cercle de centre " + M("\\Omega") + pt(xO, yO) + " passe par " + M("A") + pt(xA, yA) + ". La tangente au cercle en " + M("A") + " a une équation de la forme " + M(cartT(dx, dy, 0).replace(" = 0", "") + " + c = 0") + ". Que vaut " + M("c") + " ?", c,
"La tangente en " + M("A") + " est perpendiculaire au rayon " + M("[\\Omega A]") + " : " + M("\\overrightarrow{\\Omega A}") + vc(dx, dy) + " est normal. Elle passe par " + M("A") + " : " + M("c = -(" + N(dx) + X + NP(xA) + sg(dy) + X + NP(yA) + ") = " + N(c)) + ".",
{ ctx: "tangente-cercle", guide: [GP("Coordonnées de " + M("\\overrightarrow{\\Omega A}") + " ?", [dx, dy], vc(dx, dy) + "."), GR(M("c") + " ?", c, M(N(c)) + ".")],
traps: [TR(-(dx * xO + dy * yO), "La tangente passe par A, pas par le centre."), TR(-c, "c = −(a·x_A + b·y_A).")] }); },
],
3: [
() => { const a = nz(-3, 3), b = nz(-3, 3), xH = nz(-5, 5), yH = nz(-5, 5), c = -(a * xH + b * yH), t = nz(-2, 2), xP = xH + t * a, yP = yH + t * b;
return QP("Détermine les coordonnées du projeté orthogonal " + M("H") + " du point " + M("P") + pt(xP, yP) + " sur la droite " + M("d : " + cartT(a, b, c)) + ". Réponds « x ; y ».", [xH, yH],
M("H") + " est sur la droite passant par " + M("P") + " et dirigée par " + M("\\vec{n}") + vc(a, b) + " : " + M("H(" + N(xP) + " + " + N(a) + "t \\,;\\, " + N(yP) + " + " + N(b) + "t)") + ". On remplace dans l'équation de " + M("d") + " : " + M("t = " + N(-t)) + ", d'où " + M("H") + pt(xH, yH) + ".",
{ ctx: "projete", guide: [GP("Vecteur normal à " + M("d") + " ?", [a, b], vc(a, b) + "."), GR("Valeur du paramètre " + M("t") + " pour laquelle " + M("P + t\\vec{n}") + " est sur " + M("d") + " ?", -t, M("t = " + N(-t)) + "."), GP(M("H") + " ?", [xH, yH], pt(xH, yH) + ".")],
traps: [{ spec: { kind: "pair", values: [xP + t * a, yP + t * b] }, m: "Le signe de t : H = P + t·n avec t = " + (-t) + "." }, { spec: { kind: "pair", values: [xP, yP] }, m: "P n'est pas sur d : il faut le projeter." }] }); },
() => { const xA = nz(-5, 5), yA = nz(-5, 5), xB = xA + nz(-6, 6), yB = yA + nz(-6, 6), xC = nz(-6, 6), yC = nz(-6, 6), a = xB - xA, b = yB - yA, c = -(a * xC + b * yC); if (!c || !a || !b) return null;
return QN("Dans le triangle " + M("ABC") + " avec " + M("A") + pt(xA, yA) + ", " + M("B") + pt(xB, yB) + " et " + M("C") + pt(xC, yC) + ", la hauteur issue de " + M("C") + " a une équation de la forme " + M(cartT(a, b, 0).replace(" = 0", "") + " + c = 0") + ". Que vaut " + M("c") + " ?", c,
"La hauteur issue de " + M("C") + " est perpendiculaire à " + M("(AB)") + " : " + M("\\overrightarrow{AB}") + vc(a, b) + " est normal. Elle passe par " + M("C") + " : " + M("c = " + N(c)) + ".",
{ ctx: "hauteur", guide: [GP(M("\\overrightarrow{AB}") + " ?", [a, b], vc(a, b) + "."), GR(M("c") + " ?", c, M(N(c)) + ".")],
traps: [TR(-(a * xA + b * yA), "La hauteur issue de C passe par C."), TR(-((xC - xA) * xC + (yC - yA) * yC), "Le vecteur normal est AB (le côté opposé à C).")] }); },
() => { const ux = nz(-3, 3), uy = nz(-3, 3), xA = nz(-5, 5), yA = nz(-5, 5), s = nz(-2, 3), xH = xA + s * ux, yH = yA + s * uy, t = nz(-2, 2), xP = xH - t * uy, yP = yH + t * ux;
return QP("La droite " + M("d") + " passe par " + M("A") + pt(xA, yA) + " et a pour vecteur directeur " + M("\\vec{u}") + vc(ux, uy) + ". Détermine le projeté orthogonal " + M("H") + " de " + M("P") + pt(xP, yP) + " sur " + M("d") + ". Réponds « x ; y ».", [xH, yH],
M("H = A + s\\vec{u}") + " avec " + M("\\overrightarrow{PH} \\cdot \\vec{u} = 0") + ". Or " + M("\\overrightarrow{AP} \\cdot \\vec{u} = " + N((xP - xA) * ux + (yP - yA) * uy)) + " et " + M("\\lVert \\vec{u} \\rVert^2 = " + N(ux * ux + uy * uy)) + ", donc " + M("s = " + N(s)) + " et " + M("H") + pt(xH, yH) + ".",
{ ctx: "projete-directeur", guide: [GR(M("\\overrightarrow{AP} \\cdot \\vec{u}") + " ?", (xP - xA) * ux + (yP - yA) * uy, M(N((xP - xA) * ux + (yP - yA) * uy)) + "."), GR(M("s = \\frac{\\overrightarrow{AP} \\cdot \\vec{u}}{\\lVert \\vec{u} \\rVert^2}") + " ?", s, M(N(s)) + "."), GP(M("H") + " ?", [xH, yH], pt(xH, yH) + ".")],
traps: [{ spec: { kind: "pair", values: [xA + s * ux * (ux * ux + uy * uy), yA + s * uy * (ux * ux + uy * uy)] }, m: "On divise par ‖u‖² : s = AP·u / ‖u‖²." }, { spec: { kind: "pair", values: [xP, yP] }, m: "P n'est pas sur d." }] }); },
],
};



const PR = (ctx, q, parts, hints, sol) => ({ ctx, q, hints, sol, parts: parts.map(([label, value, round]) => ({ label, spec: Object.assign({ kind: "value", value: rnd(value) }, round ? { round } : {}) })) });
const rdv = (v, s) => rnd(Math.round(rnd(v / s, 9)) * s, 9);
const nett = (v, s) => Math.abs((Math.abs(rnd(v / s, 9)) % 1) - 0.5) > 0.02;
const cT = (a) => (a === 1 ? "" : a === -1 ? "−" : T(a)) + "x";
const T = (v) => N(v).replace(/\\,/g, " ").replace("{,}", ",").replace(/^-/, "−");
const ek = (k, v = "t") => "e^(−" + (k === 1 ? "" : T(k)) + v + ")";
const EDP = [() => {
const cx = pk(["medicament", "bacteries", "fonction", "boisson"]);
if (cx === "medicament") {
const k = pk([0.5, 0.25, 0.2, 1]), a = R.int(6, 30), tm = 1 / k, Cm = a / (k * Math.E); let t1; do t1 = R.int(1, 10); while (t1 === tm || !nett(a * t1 * Math.exp(-k * t1), 0.01));
const C1 = a * t1 * Math.exp(-k * t1), prise = pk(["Après une injection", "Après la prise d'un comprimé", "Après la pose d'une perfusion courte"]);
return PR(cx, prise + ", la concentration d'un médicament dans le sang est C(t) = " + a + "t " + ek(k) + " (en mg/L, t en heures, t ⩾ 0).",
[["a) Instant t (en h) où C'(t) s'annule", tm], ["b) Concentration la plus élevée (mg/L, au centième)", Cm, 0.01], ["c) C(" + t1 + ") (mg/L, au centième)", C1, 0.01]],
["(uv)' = u'v + uv' avec u(t) = " + a + "t et v(t) = " + ek(k) + ".", "C'(t) = (…) × " + ek(k) + " a le signe de la parenthèse, car l'exponentielle est positive."],
"a) " + M("C'(t) = " + a + "e^{-" + (k === 1 ? "" : N(k)) + "t} - " + N(rnd(a * k)) + "t\\,e^{-" + (k === 1 ? "" : N(k)) + "t} = (" + a + " - " + N(rnd(a * k)) + "t)\\,e^{-" + (k === 1 ? "" : N(k)) + "t}") + " s'annule en " + M("t = " + N(tm)) + " (positive avant, négative après) ; b) " + M("C(" + N(tm) + ") = " + N(rnd(a * tm)) + "e^{-1} \\approx " + N(rdv(Cm, 0.01))) + " mg/L ; c) " + M("C(" + t1 + ") = " + N(rnd(a * t1)) + "e^{-" + N(rnd(k * t1)) + "} \\approx " + N(rdv(C1, 0.01))) + " mg/L.");
}
if (cx === "bacteries") {
let N0, k, t1; do { N0 = pk([2, 3, 5, 8, 12]); k = pk([0.2, 0.3, 0.4, 0.5]); t1 = R.int(2, 6); } while (!nett(N0 * Math.exp(k * t1), 0.1) || !nett(k * N0 * Math.exp(k * t1), 0.1));
const Nt = N0 * Math.exp(k * t1), lieu = pk(["Dans un laboratoire de Lyon", "Dans un laboratoire d'analyses de Lille", "Pour un TP de SVT"]);
return PR(cx, lieu + ", on modélise une culture de bactéries par N(t) = " + N0 + " e^(" + T(k) + "t) (en milliers de bactéries, t en heures).",
[["a) N'(0), vitesse de croissance au départ (milliers par heure)", k * N0], ["b) N(" + t1 + ") (en milliers, au dixième)", Nt, 0.1], ["c) N'(" + t1 + ") (milliers par heure, au dixième)", k * Nt, 0.1]],
["(e^(kt))' = k e^(kt).", "N'(t) = " + T(k) + " × N(t) : la vitesse de croissance est proportionnelle au nombre de bactéries."],
M("N'(t) = " + N0 + " \\times " + N(k) + "\\,e^{" + N(k) + "t} = " + N(rnd(k * N0)) + "e^{" + N(k) + "t}") + ". a) " + M("N'(0) = " + N(rnd(k * N0))) + " ; b) " + M("N(" + t1 + ") = " + N0 + "e^{" + N(rnd(k * t1)) + "} \\approx " + N(rdv(Nt, 0.1))) + " ; c) " + M("N'(" + t1 + ") = " + N(rnd(k * N0)) + "e^{" + N(rnd(k * t1)) + "} \\approx " + N(rdv(k * Nt, 0.1))) + ".");
}
if (cx === "fonction") {
let a, b, x0; do { a = pk([1, -1, 2, -2]); b = nz(-6, 6); x0 = -(a + b) / a; } while (a + b === 0 || Math.abs(x0) > 3 || !nett(-a * Math.exp(x0), 0.01));
const fx0 = -a * Math.exp(x0), kind = a > 0 ? "minimum" : "maximum";
return PR(cx, "Dans un repère, on étudie la fonction f définie sur ℝ par f(x) = (" + cT(a) + " " + (b < 0 ? "− " + T(-b) : "+ " + T(b)) + ")e^x.",
[["a) f'(0)", a + b], ["b) Abscisse x₀ de l'extremum de f (valeur exacte)", x0], ["c) Valeur de cet extremum f(x₀) (au centième)", fx0, 0.01]],
["(u e^x)' = (u' + u)e^x.", "Comme e^x > 0, f'(x) a le signe de " + cT(a) + " " + (a + b < 0 ? "− " + T(-(a + b)) : "+ " + T(a + b)) + "."],
M("f'(x) = (" + N(a) + " + " + co(a) + sg(b) + ")e^x = (" + co(a) + sg(a + b) + ")e^x") + ". a) " + M("f'(0) = " + (a + b)) + " ; b) " + M(co(a) + sg(a + b) + " = 0 \\iff x = " + F(x0)) + " : " + kind + " ; c) " + M("f(" + F(x0) + ") = (" + N(a) + " \\times " + NP(x0) + sg(b) + ")e^{" + N(x0) + "} = " + N(-a) + "e^{" + N(x0) + "} \\approx " + N(rdv(fx0, 0.01))) + ".");
}
const [bo, T0s] = pk([["un café", [80, 85, 90]], ["un thé", [85, 90, 95]], ["un bol de soupe", [70, 75, 80]], ["un chocolat chaud", [65, 70, 75]]]);
let Ta, T0, k, t1; do { Ta = R.int(18, 22); T0 = pk(T0s); k = pk([0.05, 0.08, 0.1]); t1 = pk([5, 10, 15]); } while (!nett(Ta + (T0 - Ta) * Math.exp(-k * t1), 0.1) || !nett(-k * (T0 - Ta) * Math.exp(-k * t1), 0.01));
const D = T0 - Ta, Tt = Ta + D * Math.exp(-k * t1), dT = -k * D * Math.exp(-k * t1);
return PR(cx, "Dans une pièce à " + Ta + " °C, la température d'" + bo + " servi à " + T0 + " °C est T(t) = " + Ta + " + " + D + " " + ek(k) + " (en °C, t en minutes).",
[["a) T'(0), vitesse de variation au départ (°C par minute)", -k * D], ["b) T(" + t1 + ") (°C, au dixième)", Tt, 0.1], ["c) T'(" + t1 + ") (°C par minute, au centième)", dT, 0.01]],
["(e^(−kt))' = −k e^(−kt) ; la constante " + Ta + " a une dérivée nulle.", "T'(t) < 0 : la boisson refroidit, de moins en moins vite."],
M("T'(t) = " + D + " \\times (-" + N(k) + ")e^{-" + N(k) + "t} = " + N(rnd(-k * D)) + "e^{-" + N(k) + "t}") + ". a) " + M("T'(0) = " + N(rnd(-k * D))) + " ; b) " + M("T(" + t1 + ") = " + Ta + " + " + D + "e^{-" + N(rnd(k * t1)) + "} \\approx " + N(rdv(Tt, 0.1))) + " °C ; c) " + M("T'(" + t1 + ") = " + N(rnd(-k * D)) + "e^{-" + N(rnd(k * t1)) + "} \\approx " + N(rdv(dT, 0.01))) + " °C/min.");
}];
const TGP = [() => {
const cx = pk(["cercle", "roue", "mesure"]);
if (cx === "cercle") {
const [c0, s0] = pk([[0.6, 0.8], [0.8, 0.6], [0.28, 0.96], [0.96, 0.28]]), qd = R.int(1, 4), sc = qd === 1 || qd === 4 ? 1 : -1, ss = qd <= 2 ? 1 : -1;
const c = sc * c0, s = ss * s0, x = Math.atan2(s, c), giveCos = R.rand() < 0.5, I = ["[0 ; π/2]", "[π/2 ; π]", "[−π ; −π/2]", "[−π/2 ; 0]"][qd - 1];
const [ex, exT, f] = pk([["cos(π − x) + sin(−x)", "\\cos(\\pi - x) + \\sin(-x)", () => -c - s], ["sin(π − x) − cos(−x)", "\\sin(\\pi - x) - \\cos(-x)", () => s - c], ["cos(π + x) + sin(π + x)", "\\cos(\\pi + x) + \\sin(\\pi + x)", () => -c - s], ["sin(π − x) + cos(π − x)", "\\sin(\\pi - x) + \\cos(\\pi - x)", () => s - c]]);
return PR(cx, "On sait que " + (giveCos ? "cos x = " + T(c) : "sin x = " + T(s)) + " et que x est dans " + I + ".",
[["a) " + (giveCos ? "sin² x" : "cos² x"), giveCos ? s * s : c * c], ["b) " + (giveCos ? "sin x" : "cos x"), giveCos ? s : c], ["c) " + ex, f()]],
["cos² x + sin² x = 1.", "Le quadrant donne le signe : sur " + I + ", le " + (giveCos ? "sinus" : "cosinus") + " est " + ((giveCos ? ss : sc) > 0 ? "positif" : "négatif") + "."],
"a) " + M("1 - " + N(giveCos ? c * c : s * s) + " = " + N(rnd(giveCos ? s * s : c * c))) + " ; b) " + M((giveCos ? "\\sin x = " : "\\cos x = ") + N(giveCos ? s : c)) + " ; c) " + M(exT + " = " + N(rnd(f()))) + " (angles associés).");
}
if (cx === "roue") {
let R0, h0, kk, d; do { R0 = pk([15, 20, 25, 30]); h0 = R.int(2, 4); [kk, d] = pk([[1, 6], [5, 6], [7, 6], [11, 6], [3, 4], [7, 4], [1, 3], [2, 3], [4, 3], [5, 3]]) ; } while (![Math.sin, Math.cos].every((f) => nett(R0 * f((kk * Math.PI) / d), 0.01)));
const H = R0 + h0, th = (kk * Math.PI) / d;
const lieu = pk(["La grande roue d'une fête foraine de Lille", "La grande roue installée sur le Vieux-Port de Marseille", "La grande roue d'un marché de Noël à Strasbourg", "La grande roue d'un parc d'attractions près de Paris"]);
const h = H + R0 * Math.sin(th), xh = R0 * Math.cos(th), h2 = H + R0 * Math.cos(th);
return PR(cx, lieu + " a un rayon de " + R0 + " m et son centre est à " + H + " m du sol. On repère une nacelle par l'angle θ (en radians, sens direct) entre le rayon horizontal vers la droite et le rayon de la nacelle : ici θ = " + (kk === 1 ? "" : kk) + "π/" + d + ".",
[["a) Hauteur de la nacelle au-dessus du sol (m, au centième)", h, 0.01], ["b) Position horizontale de la nacelle par rapport au centre (m, positive à droite, au centième)", xh, 0.01], ["c) Hauteur de la nacelle quand la roue a encore tourné de π/2 (m, au centième)", h2, 0.01]],
["Dans le repère centré sur le centre de la roue, la nacelle est en (" + R0 + " cos θ ; " + R0 + " sin θ).", "Hauteur = " + H + " + " + R0 + " sin θ ; et sin(θ + π/2) = cos θ."],
"a) " + M(H + " + " + R0 + "\\sin\\frac{" + (kk === 1 ? "" : kk) + "\\pi}{" + d + "} \\approx " + N(rdv(h, 0.01))) + " m ; b) " + M(R0 + "\\cos\\frac{" + (kk === 1 ? "" : kk) + "\\pi}{" + d + "} \\approx " + N(rdv(xh, 0.01))) + " m ; c) " + M(H + " + " + R0 + "\\sin\\left(\\theta + \\frac{\\pi}{2}\\right) = " + H + " + " + R0 + "\\cos\\theta \\approx " + N(rdv(h2, 0.01))) + " m.");
}
const d = pk([3, 4, 6]); let k; do k = pk([1, -1]) * R.int(2 * d + 1, 6 * d + 5); while (g2(Math.abs(k), d) !== 1);
let n = ((k % (2 * d)) + 2 * d) % (2 * d); if (n > d) n -= 2 * d;
const deg = (n * 180) / d, c2 = Math.cos((n * Math.PI) / d) ** 2, ctxt = pk(["Un point M du cercle trigonométrique est associé au réel", "Sur le cercle trigonométrique, on enroule la droite des réels ; le point M correspond au réel", "Un robot tourne sur un cercle de rayon 1 ; son angle de rotation total (en radians) est"]);
return PR(cx, ctxt + " x = " + (k < 0 ? "−" : "") + Math.abs(k) + "π/" + d + ".",
[["a) La mesure principale de x (dans ]−π ; π]) s'écrit nπ/" + d + " : valeur de n", n], ["b) cos² x (fraction acceptée)", rnd(c2)], ["c) Mesure principale de x en degrés", deg]],
["Retire (ou ajoute) des multiples de 2π = " + 2 * d + "π/" + d + ".", "π rad = 180°."],
"a) " + M(N(k) + " = " + N(n) + " + " + 2 * d + " \\times " + NP((k - n) / (2 * d))) + ", donc " + M("x = \\frac{" + N(n) + "\\pi}{" + d + "} + " + NP((k - n) / (2 * d)) + " \\times 2\\pi") + " : " + M("n = " + N(n)) + " ; b) " + M("\\cos^2\\frac{" + N(n) + "\\pi}{" + d + "} = " + F(rnd(c2))) + " ; c) " + M("\\frac{" + N(n) + " \\times 180°}{" + d + "} = " + N(deg) + "°") + ".");
}];

reg([
{ id: "expderiv", theme: "fa", label: "Exponentielle : dérivée, tangente, variations", ex: "(e^{ax})' = a\\,e^{ax}", FR: [11, 5], g: ED,
hint: "(e^x)' = e^x et (e^(ax + b))' = a e^(ax + b). Produit : (uv)' = u'v + uv'. Comme e^x > 0, f'(x) = (…)e^x a le signe de la parenthèse.",
comps: ["Dériver e^(ax), une somme avec e^x", "Produit (ax + b)e^x, tangente en 0, minimum", "Modèles e^(−kt), extremums, maximum de x e^(−x/k)"],
lesson: ["Dériver avec l'exponentielle", "La fonction exponentielle est égale à sa dérivée : \\((e^x)' = e^x\\).",
"Pour tout réel \\(a\\) : \\((e^{ax + b})' = a\\,e^{ax + b}\\). Avec un produit : \\((u\\,e^x)' = u'e^x + u\\,e^x = (u' + u)\\,e^x\\). Comme \\(e^x > 0\\), le signe de \\(f'(x) = (\\dots)\\,e^x\\) est celui de la parenthèse : on en déduit les variations. Pour \\(k > 0\\), \\(t \\mapsto e^{kt}\\) est croissante (croissance exponentielle) et \\(t \\mapsto e^{-kt}\\) décroissante (décroissance exponentielle).",
["\\((5e^{-2x})' = -10\\,e^{-2x}\\).", "\\(f(x) = (x - 3)e^x\\) : \\(f'(x) = (x - 2)e^x\\), minimum en \\(x = 2\\).", "Tangente en 0 à \\(e^{3x}\\) : \\(y = 3x + 1\\)."],
"\\((e^{3x})'\\) n'est pas \\(e^{3x}\\), ni \\(3x\\,e^{3x - 1}\\) : on multiplie par 3, l'exposant ne change pas."],
probs: EDP },
{ id: "trigrad", theme: "es", label: "Cercle trigonométrique en radians", ex: "\\cos\\left(\\frac{2\\pi}{3}\\right) = -\\frac{1}{2}", FR: [11, 5], g: TG,
hint: "π rad = 180°. Cosinus = abscisse, sinus = ordonnée du point du cercle. Angles associés : −x (symétrie par rapport à l'axe des abscisses), π − x (axe des ordonnées), π + x (origine).",
comps: ["Valeurs remarquables, conversions, angle d'un point", "Mesure principale, angles associés, cos² + sin² = 1", "Sommes exactes, lecture de cos x = a, quadrant donné"],
lesson: ["Le cercle trigonométrique", "On enroule la droite des réels sur le cercle de centre \\(O\\) et de rayon 1 : à chaque réel \\(x\\) correspond un point \\(M\\) du cercle.",
"Un tour complet mesure \\(2\\pi\\) : \\(\\pi\\) rad \\(= 180°\\). Le point \\(M\\) associé à \\(x\\) a pour coordonnées \\((\\cos x \\,;\\, \\sin x)\\), et \\(\\cos^2 x + \\sin^2 x = 1\\). \\(x\\) et \\(x + 2k\\pi\\) donnent le même point ; la mesure principale est celle de \\(]-\\pi \\,;\\, \\pi]\\). Angles associés : \\(\\cos(-x) = \\cos x\\), \\(\\sin(-x) = -\\sin x\\), \\(\\cos(\\pi - x) = -\\cos x\\), \\(\\sin(\\pi - x) = \\sin x\\), \\(\\cos(\\pi + x) = -\\cos x\\), \\(\\sin(\\pi + x) = -\\sin x\\).",
["\\(\\cos\\frac{\\pi}{3} = \\frac{1}{2}\\), \\(\\sin\\frac{\\pi}{4} = \\frac{\\sqrt{2}}{2}\\), \\(\\cos\\frac{5\\pi}{6} = -\\frac{\\sqrt{3}}{2}\\).", "\\(\\frac{17\\pi}{6} = \\frac{5\\pi}{6} + 2\\pi\\) : mesure principale \\(\\frac{5\\pi}{6}\\)."],
"Le cosinus se lit sur l'axe horizontal, le sinus sur l'axe vertical ; et le quadrant donne le signe."],
probs: TGP },
{ id: "droitenorm", theme: "es", label: "Vecteur normal, équation cartésienne, projeté orthogonal", ex: "\\vec{n}(a \\,;\\, b) \\perp d : ax + by + c = 0", FR: [11, 8], g: DN,
hint: "La droite ax + by + c = 0 a pour vecteur normal (a ; b) et pour vecteur directeur (−b ; a). On trouve c avec un point de la droite. Projeté orthogonal de P : H = P + t·n, sur la droite.",
comps: ["Vecteur normal, vecteur directeur, calculer c", "Perpendiculaire, médiatrice, tangente à un cercle", "Projeté orthogonal, hauteur d'un triangle"],
lesson: ["Vecteur normal à une droite", "Un vecteur normal à une droite est un vecteur non nul orthogonal à ses vecteurs directeurs.",
"La droite de vecteur normal \\(\\vec{n}(a \\,;\\, b)\\) a une équation \\(ax + by + c = 0\\) ; \\(c\\) se calcule avec un point de la droite. Réciproquement, \\(ax + by + c = 0\\) a pour vecteur normal \\((a \\,;\\, b)\\) et pour vecteur directeur \\((-b \\,;\\, a)\\). Le projeté orthogonal \\(H\\) d'un point \\(P\\) sur \\(d\\) est le point de \\(d\\) tel que \\(\\overrightarrow{PH}\\) soit normal à \\(d\\).",
["Normal \\((2 \\,;\\, -3)\\), passant par \\(A(1 \\,;\\, 4)\\) : \\(2x - 3y + 10 = 0\\).", "Médiatrice de \\([AB]\\) : normale \\(\\overrightarrow{AB}\\), passe par le milieu."],
"\\((a \\,;\\, b)\\) est normal, \\((-b \\,;\\, a)\\) est directeur : ne les confonds pas."] },
]);
})();







(function () {
const { pk, nz, rnd, g2, den, N, NP, F, FS, sg, X, co, lin, linE, QN, QR, QX, QS, QSet, QP, GR, GX, GP, TR, TX, TS, P, reg } = FRX;
const deg = (r) => (r * 180) / Math.PI, rad = (d) => (d * Math.PI) / 180;
const cm = (v) => M(N(v) + "\\ \\text{cm}"), m_ = (v) => M(N(v) + "\\ \\text{m}");
const EUR = (v) => M(N(v) + "\\ \\text{€}");


const LF = {
1: [
() => { const a = pk([1.5, 2.5, 3, 4, -2, -3, 0.4, 0.6, 1.2]), x = pk([2, 4, 5, 6, 8, 10]), y = rnd(a * x);
return QN("La fonction linéaire " + M("f") + " vérifie " + M("f(" + x + ") = " + N(y)) + ". Quel est son coefficient " + M("a") + " (" + M("f(x) = ax") + ") ?", a,
M("f(x) = ax") + " et " + M("f(" + x + ") = " + N(y)) + " : " + M(x + "a = " + N(y)) + ", donc " + M("a = \\frac{" + N(y) + "}{" + x + "} = " + N(a)) + ".",
{ ctx: "coef", guide: [GX("Écris " + M("f(" + x + ")") + " avec la lettre " + M("a") + ".", x + "*a", M(x + "a") + "."), GR(M("a") + " ?", a, M(N(a)) + ".")],
traps: [TR(rnd(y * x), "On divise l'image par " + x + ", on ne multiplie pas."), TR(rnd(x / y, 6), "a = f(x) ÷ x : l'image au numérateur."), TR(rnd(y - x), "Une fonction linéaire multiplie : a = f(x) ÷ x.")] }); },
() => { const a = pk([1.2, 0.8, 1.5, 2.5, -1.5, 0.25, 0.75, -0.4]), x = pk([12, 20, 24, 30, 35, 40, -8, -16]), v = rnd(a * x);
return QN("Soit la fonction linéaire " + M("f : x \\mapsto " + N(a) + "x") + ". Calcule l'image de " + M(N(x)) + ".", v,
M("f(" + N(x) + ") = " + N(a) + X + NP(x) + " = " + N(v)) + ".",
{ ctx: "image", guide: [GR(M("f(" + N(x) + ") = " + N(a) + X + NP(x)) + " = ?", v, M(N(v)) + ".")],
traps: [TR(rnd(x / a, 6), "L'image : on multiplie par " + N(a).replace("{,}", ",") + "."), TR(rnd(a + x), "f(x) = ax est un produit.")] }); },
() => { const a = pk([0.8, 1.25, 1.5, 2.5, 0.6, 4, -3, 0.75]), x = pk([12, 20, 24, 30, 40, 48, 60]), y = rnd(a * x);
return QN("Soit la fonction linéaire " + M("f(x) = " + N(a) + "x") + ". Quel est l'antécédent de " + M(N(y)) + " par " + M("f") + " ?", x,
"On résout " + M(N(a) + "x = " + N(y)) + " : " + M("x = \\frac{" + N(y) + "}{" + N(a) + "} = " + N(x)) + ".",
{ ctx: "antecedent", guide: [GX("Quelle équation faut-il résoudre ? Écris son membre de gauche.", a + "*x", M(N(a) + "x = " + N(y)) + "."), GR(M("x") + " ?", x, M(N(x)) + ".")],
traps: [TR(rnd(a * y), "C'est l'image de " + N(y).replace("{,}", ",") + " : on cherche le nombre qui a pour image " + N(y).replace("{,}", ",") + "."), TR(rnd(a / y, 6), "x = " + N(y).replace("{,}", ",") + " ÷ " + N(a).replace("{,}", ",") + ".")] }); },
],
2: [
() => { const t = pk([5, 12, 15, 18, 20, 25, 30, 35, 40]), up = R.rand() < 0.5, k = rnd(up ? 1 + t / 100 : 1 - t / 100), x = pk([40, 60, 80, 120, 150, 250]), v = rnd(k * x);
const c = pk([["Un prix", "€", "soldes"], ["Une facture d'électricité", "€", "facture"], ["La population d'un village", "habitants", "population"]]);
return QN(c[0] + " " + (up ? "augmente" : "baisse") + " de " + M(t + "\\,\\%") + ". On note " + M("f(x)") + " la nouvelle valeur quand la valeur de départ est " + M("x") + " ; la fonction " + M("f") + " est linéaire. Quel est son coefficient ?", k,
(up ? "Augmenter" : "Baisser") + " de " + M(t + "\\,\\%") + ", c'est multiplier par " + M("1 " + (up ? "+" : "-") + " \\frac{" + t + "}{100} = " + N(k)) + " : " + M("f(x) = " + N(k) + "x") + ". Par exemple " + M("f(" + x + ") = " + N(v)) + ".",
{ ctx: "pourcentage-" + c[2], guide: [GR(M(t + "\\,\\%") + " en écriture décimale ?", t / 100, M(N(t / 100)) + "."), GR("Coefficient ?", k, M(N(k)) + ".")],
traps: [TR(rnd(t / 100), "C'est la variation seule : on garde aussi la valeur de départ (1 " + (up ? "+" : "−") + " …)."), TR(rnd(up ? 1 - t / 100 : 1 + t / 100), up ? "Une hausse : 1 + t/100." : "Une baisse : 1 − t/100."), TR(t, "Le coefficient est un nombre décimal, pas un pourcentage.")] }); },
() => { const a = nz(-4, 4) * pk([1, 0.5, 1.5]), xA = pk([2, 4, 6, -2, -4]), yA = rnd(a * xA), x = pk([5, 7, 9, 10, -3, -5]), v = rnd(a * x); if (!a || x === xA) return null;
return QN("La droite qui représente la fonction linéaire " + M("f") + " passe par le point " + M("A(" + N(xA) + " \\,;\\, " + N(yA) + ")") + ". Calcule " + M("f(" + N(x) + ")") + ".", v,
"La droite passe par l'origine et par " + M("A") + " : " + M("a = \\frac{" + N(yA) + "}{" + N(xA) + "} = " + N(a)) + ", puis " + M("f(" + N(x) + ") = " + N(a) + X + NP(x) + " = " + N(v)) + ".",
{ ctx: "point", guide: [GR("Coefficient " + M("a") + " ?", a, M(N(a)) + "."), GR(M("f(" + N(x) + ")") + " ?", v, M(N(v)) + ".")],
traps: [TR(rnd((xA / yA) * x, 6), "a = ordonnée ÷ abscisse de A."), TR(rnd(yA + x - xA), "Une fonction linéaire est proportionnelle : on multiplie, on n'ajoute pas.")] }); },
() => { const c = pk([["Le prix du fromage à la coupe est proportionnel à sa masse", "kg", "€", "fromage"], ["La distance parcourue par un TGV à vitesse constante est proportionnelle à la durée", "h", "km", "tgv"], ["La masse d'un câble est proportionnelle à sa longueur", "m", "kg", "cable"]]);
const a = pk({ fromage: [18, 24, 32], tgv: [240, 280, 320], cable: [2.5, 4.5, 12] }[c[3]]) , x1 = pk([0.5, 1.5, 2.5, 0.75]), x2 = pk([1.25, 3.5, 4, 0.4]), y1 = rnd(a * x1), v = rnd(a * x2); if (x1 === x2) return null;
return QN(c[0] + " : " + M(N(x1) + "\\ \\text{" + c[1] + "}") + " correspondent à " + M(N(y1) + "\\ \\text{" + c[2] + "}") + ". Avec la fonction linéaire " + M("f(x) = ax") + ", calcule ce qui correspond à " + M(N(x2) + "\\ \\text{" + c[1] + "}") + ".", v,
M("a = \\frac{" + N(y1) + "}{" + N(x1) + "} = " + N(a)) + " (en " + c[2] + " par " + c[1] + ") et " + M("f(" + N(x2) + ") = " + N(a) + X + N(x2) + " = " + N(v)) + " " + c[2] + ".",
{ ctx: "contexte-" + c[3], guide: [GR("Coefficient " + M("a") + " ?", a, M(N(a)) + "."), GR(M("f(" + N(x2) + ")") + " ?", v, M(N(v)) + ".")],
traps: [TR(rnd(y1 * x2), "On passe d'abord par 1 " + c[1] + " : a = " + N(y1).replace("{,}", ",") + " ÷ " + N(x1).replace("{,}", ",") + "."), TR(rnd(y1 + x2 - x1), "C'est proportionnel : on multiplie par a.")] }); },
],
3: [
() => { const a = nz(-5, 6) * pk([1, 1.5]), p = R.int(2, 5), q = R.int(3, 7), r = R.int(6, 11), s = rnd(a * (p + q)); if (!a || p === q) return null;
return QN("Pour une fonction linéaire " + M("f") + ", on sait que " + M("f(" + p + ") + f(" + q + ") = " + N(s)) + ". Calcule " + M("f(" + r + ")") + ".", rnd(a * r),
M("f(" + p + ") + f(" + q + ") = " + p + "a + " + q + "a = " + (p + q) + "a = " + N(s)) + " : " + M("a = " + N(a)) + ". Donc " + M("f(" + r + ") = " + N(rnd(a * r))) + ". (Ou : " + M("f(" + p + ") + f(" + q + ") = f(" + (p + q) + ")") + ", propriété de linéarité.)",
{ ctx: "somme-images", guide: [GR(M("f(" + p + ") + f(" + q + ")") + " = combien de fois " + M("a") + " ?", p + q, M(p + q) + "."), GR(M("a") + " ?", a, M(N(a)) + "."), GR(M("f(" + r + ")") + " ?", rnd(a * r), M(N(rnd(a * r))) + ".")],
traps: [TR(rnd((s / 2 / p) * r, 6), "f(" + p + ") et f(" + q + ") ne sont pas égales : écris-les avec a."), TR(rnd(s / (p + q)), "C'est a ; il reste à calculer f(" + r + ").")] }); },
() => { const t1 = pk([10, 20, 25, 30, 50]), t2 = pk([10, 20, 25, 40]), up1 = R.rand() < 0.6, up2 = R.rand() < 0.4, k = rnd((1 + (up1 ? 1 : -1) * t1 / 100) * (1 + (up2 ? 1 : -1) * t2 / 100));
if (Math.abs(k - 1) < 1e-9) return null;
return QN("Un article " + (up1 ? "augmente" : "baisse") + " de " + M(t1 + "\\,\\%") + ", puis " + (up2 ? "augmente" : "baisse") + " de " + M(t2 + "\\,\\%") + ". Le prix final est " + M("f(x) = kx") + " où " + M("x") + " est le prix de départ. Que vaut " + M("k") + " ?", k,
"On compose deux fonctions linéaires : " + M("k = " + N(rnd(1 + (up1 ? 1 : -1) * t1 / 100)) + X + N(rnd(1 + (up2 ? 1 : -1) * t2 / 100)) + " = " + N(k)) + " (évolution globale de " + M(N(rnd((k - 1) * 100)) + "\\,\\%") + ").",
{ ctx: "composition", guide: [GR("Premier coefficient ?", rnd(1 + (up1 ? 1 : -1) * t1 / 100), M(N(rnd(1 + (up1 ? 1 : -1) * t1 / 100))) + "."), GR("Second coefficient ?", rnd(1 + (up2 ? 1 : -1) * t2 / 100), M(N(rnd(1 + (up2 ? 1 : -1) * t2 / 100))) + "."), GR(M("k") + " ?", k, M(N(k)) + ".")],
traps: [TR(rnd(1 + ((up1 ? 1 : -1) * t1 + (up2 ? 1 : -1) * t2) / 100), "Les pourcentages ne s'ajoutent pas : on multiplie les coefficients."), TR(rnd(((up1 ? 1 : -1) * t1 / 100) * ((up2 ? 1 : -1) * t2 / 100)), "On multiplie les coefficients 1 ± t/100, pas les taux.")] }); },
() => { const a = pk([1.5, 2, 2.5, 3, 0.5]), b = pk([2, 3, 4]) * pk([1, -1]), c = pk([4, 6, 8, 10, 12, -6]), x = rnd(c / (a - b), 6); if (a === b || !Number.isInteger(x * 2)) return null;
return QN("Soit la fonction linéaire " + M("f(x) = " + N(a) + "x") + " et la fonction affine " + M("g(x) = " + lin(b, c)) + ". Pour quelle valeur de " + M("x") + " a-t-on " + M("f(x) = g(x)") + " ?", x,
M(N(a) + "x = " + lin(b, c)) + " : " + M(N(rnd(a - b)) + "x = " + N(c)) + ", " + M("x = " + N(x)) + ". Les deux droites se coupent au point d'abscisse " + M(N(x)) + ".",
{ ctx: "intersection", guide: [GX("Après avoir regroupé les " + M("x") + " à gauche : " + M("(\\dots)x = " + N(c)) + ". Que vaut le coefficient ?", String(rnd(a - b)), M(N(rnd(a - b))) + "."), GR(M("x") + " ?", x, M(N(x)) + ".")],
traps: [TR(rnd(c / (a + b), 6), "En passant " + N(b).replace("{,}", ",") + "x à gauche, on change son signe."), TR(rnd(-c / (a - b), 6), "Attention au signe de " + c + ".")] }); },
],
};


const CS = {
1: [
() => { const h = pk([5, 6, 7, 8, 9, 10, 12, 15]), a = R.int(20, 70), v = h * Math.cos(rad(a));
return QR("Le triangle " + M("ABC") + " est rectangle en " + M("B") + ", avec " + M("AC = " + h) + " cm et " + M("\\widehat{BAC} = " + a + "°") + ". Calcule " + M("AB") + " (au dixième de cm).", v, 0.1,
M("[AB]") + " est le côté adjacent à " + M("\\widehat{A}") + " et " + M("[AC]") + " l'hypoténuse : " + M("\\cos \\widehat{A} = \\frac{AB}{AC}") + ", donc " + M("AB = " + h + X + "\\cos " + a + "° \\approx " + N(rnd(v, 1))) + " cm.",
{ ctx: "adjacent", guide: [GR("Valeur approchée de " + M("\\cos " + a + "°") + " (au millième) ?", Math.cos(rad(a)), M("\\approx " + N(rnd(Math.cos(rad(a)), 3))) + ".", 0.001), GR(M("AB") + " ?", v, M("\\approx " + N(rnd(v, 1))) + " cm.", 0.1)],
traps: [TR(rnd(h / Math.cos(rad(a)), 1), "AB = AC × cos A : on multiplie (AC est l'hypoténuse)."), TR(rnd(h * Math.sin(rad(a)), 1), "Le cosinus utilise le côté adjacent, pas l'opposé.")] }); },
() => { const adj = pk([4, 5, 6, 7, 8, 9, 12]), a = R.int(25, 65), v = adj / Math.cos(rad(a));
return QR("Le triangle " + M("EFG") + " est rectangle en " + M("F") + ", avec " + M("EF = " + adj) + " cm et " + M("\\widehat{FEG} = " + a + "°") + ". Calcule l'hypoténuse " + M("EG") + " (au dixième de cm).", v, 0.1,
M("\\cos \\widehat{E} = \\frac{EF}{EG}") + ", donc " + M("EG = \\frac{EF}{\\cos " + a + "°} = \\frac{" + adj + "}{\\cos " + a + "°} \\approx " + N(rnd(v, 1))) + " cm.",
{ ctx: "hypotenuse", guide: [GX("Écris " + M("\\cos \\widehat{E}") + " comme un quotient de longueurs : numérateur ? (tape EF ou EG)", "EF", M("\\frac{EF}{EG}") + " : adjacent sur hypoténuse."), GR(M("EG") + " ?", v, M("\\approx " + N(rnd(v, 1))) + " cm.", 0.1)],
traps: [TR(rnd(adj * Math.cos(rad(a)), 1), "L'hypoténuse est le plus grand côté : on divise par cos A."), TR(rnd(adj / Math.sin(rad(a)), 1), "Cosinus, pas sinus.")] }); },
() => { const [p, q] = pk([[3, 5], [4, 5], [5, 13], [12, 13], [8, 17], [15, 17], [7, 25], [6, 10]]), v = p / q;
return QN("Le triangle " + M("RST") + " est rectangle en " + M("S") + ", avec " + M("RS = " + p) + " cm et " + M("RT = " + q) + " cm. Donne la valeur exacte de " + M("\\cos \\widehat{SRT}") + " (fraction ou décimal).", v,
M("[RS]") + " est adjacent à l'angle " + M("\\widehat{R}") + " et " + M("[RT]") + " est l'hypoténuse : " + M("\\cos \\widehat{R} = \\frac{RS}{RT} = \\frac{" + p + "}{" + q + "}" + (FS(v).includes("/") && FS(v) !== p + "/" + q ? " = " + F(v) : "")) + ".",
{ ctx: "rapport", guide: [GR("Longueur de l'hypoténuse ?", q, M("RT = " + q) + " (en face de l'angle droit)."), GR(M("\\cos \\widehat{SRT}") + " ?", v, M(F(v)) + ".")],
traps: [TR(q / p, "Cosinus = adjacent ÷ hypoténuse : il est inférieur à 1."), TR(rnd(Math.sqrt(q * q - p * p) / q), "C'est le côté adjacent RS qui compte, pas ST.")] }); },
],
2: [
() => { const [adj, h] = pk([[4, 7], [5, 8], [6, 9], [3, 8], [7, 10], [9, 12], [5, 11]]), v = deg(Math.acos(adj / h));
return QR("Le triangle " + M("KLM") + " est rectangle en " + M("L") + ", avec " + M("KL = " + adj) + " cm et " + M("KM = " + h) + " cm. Calcule " + M("\\widehat{LKM}") + " (au degré près).", v, 1,
M("\\cos \\widehat{K} = \\frac{KL}{KM} = \\frac{" + adj + "}{" + h + "}") + " ; à la calculatrice, " + M("\\widehat{K} = \\arccos\\left(\\frac{" + adj + "}{" + h + "}\\right) \\approx " + Math.round(v) + "°") + ".",
{ ctx: "angle", guide: [GR(M("\\cos \\widehat{K}") + " (au millième) ?", adj / h, M("\\frac{" + adj + "}{" + h + "} \\approx " + N(rnd(adj / h, 3))) + ".", 0.001), GR("Angle (touche arccos ou cos⁻¹) ?", v, M("\\approx " + Math.round(v) + "°") + ".", 1)],
traps: [TR(Math.round(deg(Math.asin(adj / h))), "C'est l'arcsinus : avec l'adjacent et l'hypoténuse, on utilise arccos."), TR(Math.round(90 - v), "C'est l'autre angle aigu.")] }); },
() => { const L = pk([3, 4, 4.5, 5, 6]), a = R.int(60, 80), v = L * Math.cos(rad(a));
return QR("Une échelle de " + m_(L) + " est appuyée contre un mur vertical. Elle fait un angle de " + M(a + "°") + " avec le sol horizontal. À quelle distance du mur se trouve son pied (au centimètre près, en m) ?", v, 0.01,
"Le mur, le sol et l'échelle forment un triangle rectangle ; l'échelle est l'hypoténuse et la distance au mur est adjacente à l'angle au sol : " + M("d = " + N(L) + X + "\\cos " + a + "° \\approx " + N(rnd(v, 2))) + " m.",
{ ctx: "echelle", guide: [GR("Longueur de l'hypoténuse (en m) ?", L, m_(L) + " : l'échelle."), GR("Distance (au cm) ?", v, M("\\approx " + N(rnd(v, 2))) + " m.", 0.01)],
traps: [TR(rnd(L * Math.sin(rad(a)), 2), "C'est la hauteur atteinte sur le mur : la distance au mur est adjacente à l'angle au sol."), TR(rnd(L / Math.cos(rad(a)), 2), "L'échelle est l'hypoténuse : on multiplie par cos.")] }); },
() => { const c = pk([["Un toboggan aquatique", "toboggan"], ["Une rampe d'accès pour fauteuil roulant", "rampe"], ["Un tapis roulant de gare", "tapis"]]), d = pk([6, 8, 10, 12, 15]), a = pk([5, 8, 10, 12, 15, 20]), v = d / Math.cos(rad(a));
return QR(c[0] + " couvre une distance horizontale de " + m_(d) + " et fait un angle de " + M(a + "°") + " avec l'horizontale. Quelle est sa longueur (au centimètre près, en m) ?", v, 0.01,
"La longueur est l'hypoténuse, la distance horizontale le côté adjacent : " + M("L = \\frac{" + d + "}{\\cos " + a + "°} \\approx " + N(rnd(v, 2))) + " m.",
{ ctx: c[1], guide: [GR(M("\\cos " + a + "°") + " (au millième) ?", Math.cos(rad(a)), M("\\approx " + N(rnd(Math.cos(rad(a)), 3))) + ".", 0.001), GR("Longueur (au cm) ?", v, M("\\approx " + N(rnd(v, 2))) + " m.", 0.01)],
traps: [TR(rnd(d * Math.cos(rad(a)), 2), "La longueur est plus grande que la distance horizontale : on divise par cos."), TR(d, "La pente allonge la longueur.")] }); },
],
3: [
() => { const h = pk([10, 12, 13, 15, 17, 20]), a = R.int(30, 60), adj = h * Math.cos(rad(a)), opp = Math.sqrt(h * h - adj * adj);
return QR("Le triangle " + M("ABC") + " est rectangle en " + M("C") + ", avec " + M("AB = " + h) + " cm et " + M("\\widehat{BAC} = " + a + "°") + ". Calcule " + M("AC") + " avec le cosinus, puis " + M("BC") + " avec le théorème de Pythagore. Donne " + M("BC") + " au dixième de cm.", opp, 0.1,
M("AC = " + h + X + "\\cos " + a + "° \\approx " + N(rnd(adj, 2))) + " cm ; " + M("BC = \\sqrt{AB^2 - AC^2} \\approx " + N(rnd(opp, 1))) + " cm.",
{ ctx: "deux-etapes", guide: [GR(M("AC") + " (au centième) ?", adj, M("\\approx " + N(rnd(adj, 2))) + " cm.", 0.01), GR(M("BC") + " (au dixième) ?", opp, M("\\approx " + N(rnd(opp, 1))) + " cm.", 0.1)],
traps: [TR(rnd(adj, 1), "C'est AC ; on demande BC (Pythagore ensuite)."), TR(rnd(Math.sqrt(h * h + adj * adj), 1), "AB est l'hypoténuse : BC² = AB² − AC².")] }); },
() => { const b = pk([6, 8, 10, 12]), s = pk([5, 6, 7, 8, 9, 10]).valueOf(), side = Math.max(s, b / 2 + 1), v = deg(Math.acos(b / 2 / side));
return QR("Le triangle " + M("ABC") + " est isocèle en " + M("A") + ", avec " + M("AB = AC = " + side) + " cm et " + M("BC = " + b) + " cm. Calcule l'angle " + M("\\widehat{ABC}") + " au degré près (trace la hauteur issue de " + M("A") + ").", v, 1,
"La hauteur issue de " + M("A") + " coupe " + M("[BC]") + " en son milieu " + M("H") + " : " + M("BH = " + N(b / 2)) + ". Dans le triangle " + M("ABH") + " rectangle en " + M("H") + " : " + M("\\cos \\widehat{B} = \\frac{BH}{AB} = \\frac{" + N(b / 2) + "}{" + side + "}") + ", " + M("\\widehat{B} \\approx " + Math.round(v) + "°") + ".",
{ ctx: "isocele", guide: [GR(M("BH") + " ?", b / 2, M(N(b / 2)) + " cm (milieu de [BC])."), GR(M("\\widehat{ABC}") + " ?", v, M("\\approx " + Math.round(v) + "°") + ".", 1)],
traps: [TR(Math.round(deg(Math.acos(Math.min(1, b / side)))), "La hauteur partage [BC] en deux : BH = " + b / 2 + "."), TR(Math.round(180 - 2 * v), "C'est l'angle au sommet A.")] }); },
() => { const h = pk([8, 10, 12, 15]), a = R.int(25, 65), v = h * Math.cos(rad(a)), w = h * Math.sin(rad(a)), nm = pk(["Lina", "Yanis", "Inès", "Noé"]);
return QR("Dans le triangle " + M("PQR") + " rectangle en " + M("Q") + ", " + M("PR = " + h) + " cm et " + M("\\widehat{QPR} = " + a + "°") + ". " + nm + " écrit : « " + M("\\cos \\widehat{P} = \\frac{QR}{PR}") + ", donc " + M("QR = " + h + X + "\\cos " + a + "°") + " ». Trouve l'erreur, puis calcule " + M("PQ") + " au dixième de cm.", v, 0.1,
"Le côté adjacent à " + M("\\widehat{P}") + " est " + M("[PQ]") + ", pas " + M("[QR]") + " (opposé) : " + M("\\cos \\widehat{P} = \\frac{PQ}{PR}") + ", " + M("PQ = " + h + X + "\\cos " + a + "° \\approx " + N(rnd(v, 1))) + " cm.",
{ ctx: "erreur", guide: [GX("Quel côté est adjacent à l'angle " + M("\\widehat{P}") + " ? (tape PQ ou QR)", "PQ", M("[PQ]") + " : il touche P et n'est pas l'hypoténuse."), GR(M("PQ") + " ?", v, M("\\approx " + N(rnd(v, 1))) + " cm.", 0.1)],
traps: [TR(rnd(w, 1), "C'est QR (le côté opposé)."), TR(rnd(h / Math.cos(rad(a)), 1), "PQ = PR × cos P.")] }); },
],
};




const tri = () => { for (;;) { const k = pk([[1, 2], [1, 3], [2, 3], [3, 4], [2, 5], [3, 5], [1, 4]]), q = k[0] / k[1], u = pk([1, 1.5, 2, 2.5, 3]), t = { q, k, AB: rnd(k[1] * u * pk([2, 3, 4])), AC: rnd(k[1] * u * pk([2, 3, 5])), BC: rnd(k[1] * pk([2, 3, 4, 5])) };
if (t.BC < t.AB + t.AC && t.AB < t.AC + t.BC && t.AC < t.AB + t.BC) return t; } };
const cfg = "Dans le triangle " + M("ABC") + ", " + M("M \\in [AB]") + ", " + M("N \\in [AC]") + " et " + M("(MN) \\parallel (BC)") + ". ";
const TH = {
1: [
() => { const t = tri(), AM = rnd(t.q * t.AB), v = rnd(t.q * t.BC);
return QN(cfg + "On sait que " + M("AM = " + N(AM)) + " cm, " + M("AB = " + N(t.AB)) + " cm et " + M("BC = " + N(t.BC)) + " cm. Calcule " + M("MN") + ".", v,
"D'après le théorème de Thalès, " + M("\\frac{AM}{AB} = \\frac{AN}{AC} = \\frac{MN}{BC}") + ". Donc " + M("MN = BC" + X + "\\frac{AM}{AB} = " + N(t.BC) + X + "\\frac{" + N(AM) + "}{" + N(t.AB) + "} = " + N(v)) + " cm.",
{ ctx: "MN", guide: [GR("Rapport " + M("\\frac{AM}{AB}") + " ?", t.q, M(F(t.q)) + "."), GR(M("MN") + " ?", v, M(N(v)) + " cm.")],
traps: [TR(rnd(t.BC / t.q), "Le petit triangle est une réduction : MN < BC."), TR(rnd(t.BC * (1 - t.q)), "Le rapport est AM/AB, pas MB/AB.")] }); },
() => { const t = tri(), AM = rnd(t.q * t.AB), v = rnd(t.q * t.AC);
return QN(cfg + "On sait que " + M("AM = " + N(AM)) + " cm, " + M("AB = " + N(t.AB)) + " cm et " + M("AC = " + N(t.AC)) + " cm. Calcule " + M("AN") + ".", v,
M("\\frac{AN}{AC} = \\frac{AM}{AB}") + " (Thalès), donc " + M("AN = " + N(t.AC) + X + "\\frac{" + N(AM) + "}{" + N(t.AB) + "} = " + N(v)) + " cm.",
{ ctx: "AN", guide: [GR(M("\\frac{AM}{AB}") + " ?", t.q, M(F(t.q)) + "."), GR(M("AN") + " ?", v, M(N(v)) + " cm.")],
traps: [TR(rnd(t.AC / t.q), "AN est plus petit que AC."), TR(rnd(t.AC - v), "C'est NC = AC − AN : on demande AN.")] }); },
() => { const t = tri(), AM = rnd(t.q * t.AB);
return QN(cfg + "On sait que " + M("AM = " + N(AM)) + " cm et " + M("AB = " + N(t.AB)) + " cm. Par quel nombre faut-il multiplier les longueurs du triangle " + M("ABC") + " pour obtenir celles du triangle " + M("AMN") + " (fraction acceptée) ?", t.q,
"Le triangle " + M("AMN") + " est une réduction de " + M("ABC") + " de rapport " + M("\\frac{AM}{AB} = \\frac{" + N(AM) + "}{" + N(t.AB) + "} = " + F(t.q)) + ".",
{ ctx: "rapport", guide: [GR(M("\\frac{AM}{AB}") + " ?", t.q, M(F(t.q)) + ".")],
traps: [TR(rnd(1 / t.q, 6), "On passe du grand au petit triangle : le rapport est inférieur à 1."), TR(rnd(1 - t.q, 6), "Le rapport est AM/AB.")] }); },
],
2: [
() => { const t = tri(), AM = rnd(t.q * t.AB), MB = rnd(t.AB - AM), v = rnd(t.q * t.BC);
return QN(cfg + "On sait que " + M("AM = " + N(AM)) + " cm, " + M("MB = " + N(MB)) + " cm et " + M("BC = " + N(t.BC)) + " cm. Calcule " + M("MN") + ".", v,
M("AB = AM + MB = " + N(t.AB)) + " cm ; " + M("MN = BC" + X + "\\frac{AM}{AB} = " + N(t.BC) + X + "\\frac{" + N(AM) + "}{" + N(t.AB) + "} = " + N(v)) + " cm.",
{ ctx: "MB", guide: [GR(M("AB") + " ?", t.AB, M(N(t.AB)) + " cm."), GR(M("MN") + " ?", v, M(N(v)) + " cm.")],
traps: [TR(rnd(t.BC * AM / MB), "Le rapport de Thalès est AM/AB, pas AM/MB."), TR(rnd(t.BC * MB / t.AB), "C'est MB/AB : prends AM/AB.")] }); },
() => { const t = tri(), AM = rnd(t.q * t.AB), AN = rnd(t.q * t.AC), v = rnd(t.AC - AN);
return QN(cfg + "On sait que " + M("AM = " + N(AM)) + " cm, " + M("AB = " + N(t.AB)) + " cm et " + M("AN = " + N(AN)) + " cm. Calcule " + M("NC") + ".", v,
M("\\frac{AN}{AC} = \\frac{AM}{AB}") + " donne " + M("AC = AN" + X + "\\frac{AB}{AM} = " + N(t.AC)) + " cm, puis " + M("NC = AC - AN = " + N(v)) + " cm.",
{ ctx: "NC", guide: [GR(M("AC") + " ?", t.AC, M(N(t.AC)) + " cm."), GR(M("NC") + " ?", v, M(N(v)) + " cm.")],
traps: [TR(t.AC, "C'est AC ; on demande NC = AC − AN."), TR(rnd(AN * t.q), "AC = AN × AB / AM (le grand côté est au dénominateur du rapport).")] }); },
() => { const c = pk([["Sur la charpente d'un toit, une entretoise horizontale", "entretoise", "charpente"], ["Sur une échelle double, une barre de sécurité horizontale", "barre", "echelle-double"], ["Dans un chevalet de peintre, une traverse", "traverse", "chevalet"]]);
const base = pk([1.2, 1.5, 1.8, 2, 2.4]), L = pk([2, 2.5, 3]), d = pk([0.5, 0.8, 1, 1.2]), v = rnd((base * d) / L, 4); if (d >= L) return null;
return QR(c[0] + " relie deux montants de " + m_(L) + " de long, à " + m_(d) + " du sommet, parallèlement au sol. Les pieds des montants sont écartés de " + m_(base) + ". Quelle est la longueur de " + (/^[aeioué]/.test(c[1]) ? "l'" : "la ") + c[1] + " (au centimètre près, en m) ?", v, 0.01,
"Triangles emboîtés au sommet, côtés parallèles : " + M("\\frac{\\ell}{" + N(base) + "} = \\frac{" + N(d) + "}{" + N(L) + "}") + ", donc " + M("\\ell = " + N(base) + X + "\\frac{" + N(d) + "}{" + N(L) + "} \\approx " + N(rnd(v, 2))) + " m.",
{ ctx: c[2], guide: [GR("Rapport de réduction " + M("\\frac{" + N(d) + "}{" + N(L) + "}") + " ?", d / L, M(F(d / L)) + "."), GR("Longueur (au cm) ?", v, M("\\approx " + N(rnd(v, 2))) + " m.", 0.01)],
traps: [TR(rnd(base * (L - d) / L, 2), "La distance au sommet est " + N(d).replace("{,}", ",") + " m : le rapport est " + N(d).replace("{,}", ",") + "/" + N(L).replace("{,}", ",") + "."), TR(rnd(base * L / d, 2), "La traverse est plus courte que l'écart au sol.")] }); },
],
3: [
() => { const t = tri(), AM = rnd(t.q * t.AB), AN = rnd(t.q * t.AC), MN = rnd(t.q * t.BC), v = rnd(MN + (t.AC - AN) + t.BC + (t.AB - AM));
return QN(cfg + "On sait que " + M("AM = " + N(AM)) + ", " + M("AB = " + N(t.AB)) + ", " + M("AN = " + N(AN)) + " et " + M("MN = " + N(MN)) + " (en cm). Calcule le périmètre du trapèze " + M("MNCB") + ".", v,
"Rapport " + M("\\frac{AM}{AB} = " + F(t.q)) + " : " + M("BC = \\frac{MN}{" + F(t.q) + "} = " + N(t.BC)) + ", " + M("AC = " + N(t.AC)) + ". Périmètre " + M("= MN + NC + CB + BM = " + N(MN) + " + " + N(rnd(t.AC - AN)) + " + " + N(t.BC) + " + " + N(rnd(t.AB - AM)) + " = " + N(v)) + " cm.",
{ ctx: "perimetre", guide: [GR(M("BC") + " ?", t.BC, M(N(t.BC)) + " cm."), GR(M("NC") + " ?", rnd(t.AC - AN), M(N(rnd(t.AC - AN))) + " cm."), GR("Périmètre ?", v, M(N(v)) + " cm.")],
traps: [TR(rnd(t.AB + t.AC + t.BC), "C'est le périmètre de ABC ; le trapèze est MNCB."), TR(rnd(MN + t.AC + t.BC + t.AB), "NC = AC − AN et BM = AB − AM.")] }); },
() => { const k = pk([2, 3, 4]), x = pk([2, 3, 4, 5, 6]), MB = rnd(x * (k - 1)), AN = pk([3, 4, 5, 6]), NC = rnd(AN * (k - 1));
return QN(cfg + "On sait que " + M("AM = x") + ", " + M("MB = " + N(MB)) + ", " + M("AN = " + N(AN)) + " et " + M("NC = " + N(NC)) + " (en cm). Que vaut " + M("x") + " ?", x,
M("\\frac{AM}{AB} = \\frac{AN}{AC}") + " : " + M("\\frac{x}{x + " + N(MB) + "} = \\frac{" + N(AN) + "}{" + N(AN + NC) + "}") + ". Produit en croix : " + M(N(AN + NC) + "x = " + N(AN) + "x + " + N(AN * MB)) + ", " + M("x = " + N(x)) + ".",
{ ctx: "equation", guide: [GR("Rapport " + M("\\frac{AN}{AC}") + " ?", AN / (AN + NC), M("\\frac{" + AN + "}{" + (AN + NC) + "} = " + F(AN / (AN + NC))) + "."), GR(M("x") + " ?", x, M(N(x)) + ".")],
traps: [TR(rnd(MB * AN / (AN + NC)), "AB = x + " + MB + " : x est aussi dans AB."), TR(rnd(MB * (AN + NC) / AN), "Écris AM/AB = AN/AC avec AM = x et AB = x + " + MB + ".")] }); },
() => { const t = tri(), AM = rnd(t.q * t.AB), MB = rnd(t.AB - AM), v = rnd(t.q * t.BC), wrong = rnd((AM / MB) * t.BC), nm = pk(["Lina", "Sam", "Inès", "Noé"]);
if (Math.abs(wrong - v) < 1e-9) return null;
return QN(cfg + "On sait que " + M("AM = " + N(AM)) + ", " + M("MB = " + N(MB)) + " et " + M("BC = " + N(t.BC)) + " (en cm). " + nm + " écrit : « " + M("\\frac{AM}{MB} = \\frac{MN}{BC}") + ", donc " + M("MN = " + N(wrong)) + " ». Trouve l'erreur, puis calcule " + M("MN") + ".", v,
"Les rapports de Thalès comparent le petit triangle " + M("AMN") + " au grand " + M("ABC") + " : " + M("\\frac{AM}{AB}") + ", pas " + M("\\frac{AM}{MB}") + ". " + M("MN = " + N(t.BC) + X + "\\frac{" + N(AM) + "}{" + N(t.AB) + "} = " + N(v)) + " cm.",
{ ctx: "erreur", guide: [GR(M("AB") + " ?", t.AB, M(N(t.AB)) + " cm."), GR(M("MN") + " ?", v, M(N(v)) + " cm.")],
traps: [TR(wrong, "C'est l'erreur de " + nm + " : le rapport est AM/AB.")] }); },
],
};


const SC = "Sans calculatrice : ";
const fr = (n, d) => { const g = g2(n, d) || 1; n /= g; d /= g; return d === 1 ? N(n) : (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
const AD = {
1: [
() => { const [a, b] = pk([[2, 3], [3, 4], [1, 6], [5, 6], [3, 8], [2, 5]]), [c, d] = pk([[5, 6], [1, 4], [2, 9], [3, 10], [1, 12]]), [e, f] = pk([[3, 5], [2, 3], [4, 3], [6, 5], [3, 2]]), v = a / b + (c / d) * (e / f);
{ const dv = FRX.den(v); if (!dv || dv > 60) return null; }
return QN(SC + "calcule " + M(fr(a, b) + " + " + fr(c, d) + X + fr(e, f)) + ". Donne le résultat sous forme de fraction irréductible.", v,
"La multiplication d'abord : " + M(fr(c, d) + X + fr(e, f) + " = " + F((c * e) / (d * f))) + ", puis " + M(fr(a, b) + " + " + F((c * e) / (d * f)) + " = " + F(v)) + ".",
{ ctx: "fractions", guide: [GR("Produit " + M(fr(c, d) + X + fr(e, f)) + " ?", (c * e) / (d * f), M(F((c * e) / (d * f))) + "."), GR("Résultat ?", v, M(F(v)) + ".")],
traps: [TR((a / b + c / d) * (e / f), "La multiplication est prioritaire sur l'addition."), TR((a + c) / (b + d) * (e / f) + 0, "On n'additionne pas les dénominateurs.")] }); },
() => { const a = pk([2, 3, 4, 5, 6, 8]), b = pk([2, 3, 4, 5, 1.5, 2.5]), p = R.int(3, 7), q = -R.int(1, 5), v = rnd(a * b * 10 ** (p + q));
return QN(SC + "donne l'écriture décimale de " + M(N(a) + " \\times 10^{" + p + "} \\times " + N(b) + " \\times 10^{" + q + "}") + ".", v,
M(N(a) + X + N(b) + " = " + N(rnd(a * b))) + " et " + M("10^{" + p + "} \\times 10^{" + q + "} = 10^{" + (p + q) + "}") + " : " + M(N(rnd(a * b)) + " \\times 10^{" + (p + q) + "} = " + N(v)) + ".",
{ ctx: "puissances", guide: [GR(M("10^{" + p + "} \\times 10^{" + q + "} = 10^{n}") + " : " + M("n") + " ?", p + q, M(p + q) + " (on ajoute les exposants)."), GR("Écriture décimale ?", v, M(N(v)) + ".")],
traps: [TR(rnd(a * b * 10 ** (p * q)), "10ᵖ × 10^q = 10^(p+q) : on ajoute les exposants."), TR(rnd((a + b) * 10 ** (p + q)), "On multiplie " + a + " par " + N(b).replace("{,}", ",") + ".")] }); },
() => { const x = pk([40, 60, 80, 120, 150, 200, 250]), t = pk([5, 10, 15, 20, 25, 30]), up = R.rand() < 0.6, v = rnd(x * (1 + (up ? 1 : -1) * t / 100)), c = pk(["Un vélo", "Un forfait de téléphone", "Un billet de concert", "Une paire de chaussures"]);
return QN(SC + c.toLowerCase() + " coûte " + EUR(x) + ". Son prix " + (up ? "augmente" : "baisse") + " de " + M(t + "\\,\\%") + ". Quel est son nouveau prix (en €) ?", v,
M(t + "\\,\\%") + " de " + M(x) + " : " + M(N(rnd((x * t) / 100))) + ". Nouveau prix : " + M(x + (up ? " + " : " - ") + N(rnd((x * t) / 100)) + " = " + N(v)) + " € (ou " + M(x + X + N(rnd(1 + (up ? 1 : -1) * t / 100)) + ")") + ".",
{ ctx: "evolution", guide: [GR(M(t + "\\,\\%") + " de " + M(x) + " ?", rnd((x * t) / 100), M(N(rnd((x * t) / 100))) + "."), GR("Nouveau prix ?", v, EUR(v) + ".")],
traps: [TR(rnd((x * t) / 100), "C'est la " + (up ? "hausse" : "baisse") + " : il reste à l'" + (up ? "ajouter" : "enlever") + "."), TR(x + (up ? t : -t), "Un pourcentage s'applique au prix : " + t + " % de " + x + ".")] }); },
() => { const [a, b, c] = pk([[6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20], [7, 24, 25]]), hyp = R.rand() < 0.6;
return QN(SC + "le triangle " + M("ABC") + " est rectangle en " + M("A") + ", " + (hyp ? M("AB = " + a) + " cm et " + M("AC = " + b) + " cm. Calcule " + M("BC") : M("AB = " + a) + " cm et " + M("BC = " + c) + " cm. Calcule " + M("AC")) + " (en cm).", hyp ? c : b,
"Pythagore : " + (hyp ? M("BC^2 = " + a + "^2 + " + b + "^2 = " + (a * a + b * b)) + ", " + M("BC = " + c) : M("AC^2 = " + c + "^2 - " + a + "^2 = " + (c * c - a * a)) + ", " + M("AC = " + b)) + " cm.",
{ ctx: "pythagore", guide: [GR((hyp ? M("BC^2") : M("AC^2")) + " ?", hyp ? c * c : b * b, M(hyp ? c * c : b * b) + "."), GR("Longueur ?", hyp ? c : b, M(hyp ? c : b) + " cm.")],
traps: [TR(hyp ? a + b : c - a, "Pythagore porte sur les carrés des longueurs."), TR(hyp ? Math.round(Math.sqrt(Math.abs(b * b - a * a)) * 100) / 100 : Math.round(Math.sqrt(c * c + a * a) * 100) / 100, "L'hypoténuse est le côté opposé à l'angle droit : " + (hyp ? "BC." : "BC est connu."))] }); },
],
2: [
() => { const a = pk([2, 3, 5]), b = nz(-7, 7), e = (a * a) + "*x^2" + (b < 0 ? "-" : "+") + Math.abs(2 * a * b) + "*x+" + b * b;
return QX(SC + "développe et réduis " + M("(" + lin(a, b) + ")^2") + ".", e, M("(" + lin(a, b) + ")^2 = " + N(a * a) + "x^2" + sg(2 * a * b) + "x + " + N(b * b)) + " (identité " + M(b > 0 ? "(u + v)^2 = u^2 + 2uv + v^2" : "(u - v)^2 = u^2 - 2uv + v^2") + ").",
{ ctx: "developper", guide: [GR("Coefficient de " + M("x^2") + " ?", a * a, M(N(a * a)) + "."), GR("Coefficient de " + M("x") + " (double produit) ?", 2 * a * b, M(N(2 * a * b)) + "."), GX("Résultat ?", e, M(N(a * a) + "x^2" + sg(2 * a * b) + "x + " + N(b * b)) + ".")],
traps: [TX((a * a) + "*x^2+" + b * b, "N'oublie pas le double produit 2uv."), TX(a + "*x^2+" + (2 * a * b) + "*x+" + b * b, "(" + a + "x)² = " + a * a + "x²."), TX((a * a) + "*x^2+" + (a * b) + "*x+" + b * b, "Le double produit vaut 2 × " + a + "x × " + b + ".")] }); },
() => { const m = pk([50, 100, 200, 30, 70]), d = pk([1, 2, 3]), v = 4 * m * d;
return QN(SC + "calcule " + M((m + d) + "^2 - " + (m - d) + "^2") + ".", v,
M("a^2 - b^2 = (a - b)(a + b)") + " : " + M("(" + (m + d) + " - " + (m - d) + ")(" + (m + d) + " + " + (m - d) + ") = " + 2 * d + X + 2 * m + " = " + N(v)) + ".",
{ ctx: "identite", guide: [GR(M((m + d) + " - " + (m - d)) + " ?", 2 * d, M(2 * d) + "."), GR(M((m + d) + " + " + (m - d)) + " ?", 2 * m, M(2 * m) + "."), GR("Résultat ?", v, M(N(v)) + ".")],
traps: [TR((2 * d) ** 2, "a² − b² n'est pas (a − b)²."), TR(2 * d, "a² − b² = (a − b)(a + b) : il manque le facteur a + b.")] }); },
() => { const r = R.int(2, 7), b = R.int(2, 7), g = R.int(1, 6), n = r + b + g, which = pk([["ne soit pas bleue", r + g], ["soit rouge ou verte", r + g], ["ne soit pas rouge", b + g]]), v = which[1] / n;
return QN(SC + "un sac contient " + r + " boules rouges, " + b + " bleues et " + g + " vertes, indiscernables au toucher. On tire une boule au hasard. Quelle est la probabilité qu'elle " + which[0] + " ? (fraction irréductible)", v,
"Il y a " + M(n) + " boules en tout, dont " + M(which[1]) + " favorables : " + M("P = \\frac{" + which[1] + "}{" + n + "}" + (FS(v) !== which[1] + "/" + n ? " = " + F(v) : "")) + ".",
{ ctx: "proba", guide: [GR("Nombre total de boules ?", n, M(n) + "."), GR("Probabilité ?", v, M(F(v)) + ".")],
traps: [TR(1 - v, "C'est la probabilité de l'évènement contraire."), TR(which[1] / (n - which[1]), "On divise par le nombre total de boules.")] }); },
() => { const a = pk([3, 4, 5, 6]), b = pk([2, 3, 4]), c = pk([1, 2]), x = nz(-5, 8), d = a * (x - b) - c * x; if (a === c) return null;
return QN(SC + "résous l'équation " + M(N(a) + "(x - " + b + ") = " + (c === 1 ? "" : c) + "x" + sg(d)) + ".", x,
M(N(a) + "x - " + a * b + " = " + (c === 1 ? "" : c) + "x" + sg(d)) + ", " + M(N(a - c) + "x = " + N(d + a * b)) + ", " + M("x = " + N(x)) + ".",
{ ctx: "equation", guide: [GX("Développe le membre de gauche.", a + "*x-" + a * b, M(N(a) + "x - " + a * b) + "."), GR(M("x") + " ?", x, M(N(x)) + ".")],
traps: [TR((d + b) / (a - c), "Le " + a + " multiplie aussi le " + b + "."), TR((d + a * b) / (a + c), "En passant " + c + "x à gauche, on le soustrait.")] }); },
],
3: [
() => { const [a, b] = pk([[2, 3], [3, 4], [3, 2], [4, 5], [5, 3]]), [c, d] = pk([[9, 4], [16, 9], [4, 9], [25, 16], [9, 25]]), [e, f] = pk([[1, 2], [1, 3], [5, 6], [3, 4]]), v = (a * a) / (b * b) * (c / d) - e / f;
{ const dv = FRX.den(v); if (!dv || dv > 40 || Math.abs(v) < 1e-9) return null; }
return QN(SC + "calcule " + M("\\left(" + fr(a, b) + "\\right)^2" + X + fr(c, d) + " - " + fr(e, f)) + ". Donne le résultat sous forme de fraction irréductible.", v,
M("\\left(" + fr(a, b) + "\\right)^2 = " + fr(a * a, b * b)) + ", " + M(fr(a * a, b * b) + X + fr(c, d) + " = " + F((a * a * c) / (b * b * d))) + ", puis " + M(F((a * a * c) / (b * b * d)) + " - " + fr(e, f) + " = " + F(v)) + ".",
{ ctx: "fractions-puissances", guide: [GR(M("\\left(" + fr(a, b) + "\\right)^2") + " ?", (a * a) / (b * b), M(fr(a * a, b * b)) + "."), GR("Produit ?", (a * a * c) / (b * b * d), M(F((a * a * c) / (b * b * d))) + "."), GR("Résultat ?", v, M(F(v)) + ".")],
traps: [TR((2 * a) / b * (c / d) - e / f, "Le carré n'est pas le double : (a/b)² = a²/b²."), TR((a * a) / (b * b) * (c / d - e / f), "Puissance, puis multiplication, puis soustraction.")] }); },
() => { const t1 = pk([10, 20, 25, 50]), t2 = pk([10, 20, 30, 40]), d1 = pk([1, -1]), d2 = pk([1, 1, -1]), k = (1 + (d1 * t1) / 100) * (1 + (d2 * t2) / 100), v = rnd((k - 1) * 100, 6);
if (Math.abs(v) < 1e-9 || !Number.isInteger(v * 2)) return null;
return QN(SC + "un prix " + (d1 > 0 ? "augmente" : "baisse") + " de " + M(t1 + "\\,\\%") + " puis " + (d2 > 0 ? "augmente" : "baisse") + " de " + M(t2 + "\\,\\%") + ". Quel est le taux d'évolution global, en % ? (négatif pour une baisse)", v,
"Coefficients : " + M(N(rnd(1 + (d1 * t1) / 100)) + X + N(rnd(1 + (d2 * t2) / 100)) + " = " + N(rnd(k))) + ", soit une évolution de " + M(N(v) + "\\,\\%") + ".",
{ ctx: "evolutions", guide: [GR("Coefficient global ?", rnd(k), M(N(rnd(k))) + "."), GR("Taux global (%) ?", v, M(N(v)) + ".")],
traps: [TR(d1 * t1 + d2 * t2, "Les pourcentages ne s'ajoutent pas : on multiplie les coefficients."), TR(rnd(k), "Le coefficient " + N(rnd(k)).replace("{,}", ",") + " correspond à " + N(v).replace("{,}", ",") + " %.")] }); },
() => { const [dist, mins] = pk([[45, 36], [30, 24], [12, 15], [60, 45], [90, 72], [25, 20], [18, 12]]), v = dist / (mins / 60), c = pk(["Un cycliste", "Un bus", "Une coureuse de trail", "Un TER"]);
return QN(SC + c.toLowerCase() + " parcourt " + M(dist + "\\ \\text{km}") + " en " + M(mins + "\\ \\text{min}") + ". Quelle est sa vitesse moyenne en km/h ?", v,
M(mins + "\\ \\text{min} = \\frac{" + mins + "}{60}\\ \\text{h} = " + N(mins / 60) + "\\ \\text{h}") + " ; " + M("v = \\frac{" + dist + "}{" + N(mins / 60) + "} = " + N(v)) + " km/h.",
{ ctx: "vitesse", guide: [GR("Durée en heures ?", mins / 60, M(N(mins / 60)) + " h."), GR("Vitesse (km/h) ?", v, M(N(v)) + " km/h.")],
traps: [TR(rnd(dist / mins, 6), "La durée doit être en heures."), TR(rnd(dist / (mins / 100), 6), "1 h = 60 min, pas 100 min.")] }); },
() => { const a = pk([1, 2, -1, 3]), b = nz(-5, 5), x = pk([-2, -3, -4, -5, 3, 4]), v = a * x * x + b * x; if (!v) return null;
return QN(SC + "soit " + M("f(x) = " + (a === 1 ? "" : a === -1 ? "-" : a) + "x^2" + sg(b) + "x") + ". Calcule l'image de " + M(N(x)) + " par " + M("f") + ".", v,
M("f(" + N(x) + ") = " + (a === 1 ? "" : a === -1 ? "-" : a + X) + NP(x) + "^2" + sg(b) + X + NP(x) + " = " + (a === 1 ? "" : a === -1 ? "-" : a + X) + x * x + sg(b * x) + " = " + N(v)) + ".",
{ ctx: "image", guide: [GR(M(NP(x) + "^2") + " ?", x * x, M(x * x) + " (un carré est positif)."), GR(M("f(" + N(x) + ")") + " ?", v, M(N(v)) + ".")],
traps: [TR(-a * x * x + b * x, NP(x).replace(/[()]/g, "") + "² = " + x * x + " : le carré d'un négatif est positif."), TR(a * 2 * x + b * x, "x² n'est pas 2x.")] }); },
],
};


const PT = (x, y) => M("(" + N(x) + " \\,;\\, " + N(y) + ")");
const VG = {
1: [
() => { const A = [nz(-5, 5), nz(-5, 5)], B = [nz(-6, 6), nz(-6, 6)], C = [nz(-5, 5), nz(-5, 5)], D = [C[0] + B[0] - A[0], C[1] + B[1] - A[1]]; if (B[0] === A[0] && B[1] === A[1]) return null;
return QP("Dans un repère, " + M("A") + PT(...A) + ", " + M("B") + PT(...B) + " et " + M("C") + PT(...C) + ". La translation qui transforme " + M("A") + " en " + M("B") + " transforme " + M("C") + " en " + M("D") + ". Donne les coordonnées de " + M("D") + ". Réponds « x ; y ».", D,
"Pour aller de " + M("A") + " à " + M("B") + ", on se déplace de " + M(N(B[0] - A[0])) + " en abscisse et de " + M(N(B[1] - A[1])) + " en ordonnée. On fait le même déplacement depuis " + M("C") + " : " + M("D") + PT(...D) + ". " + M("ABDC") + " est un parallélogramme.",
{ ctx: "translation", guide: [GP("Déplacement de " + M("A") + " à " + M("B") + " (abscisse ; ordonnée) ?", [B[0] - A[0], B[1] - A[1]], PT(B[0] - A[0], B[1] - A[1]) + "."), GP(M("D") + " ?", D, PT(...D) + ".")],
traps: [{ spec: { kind: "pair", values: [C[0] - B[0] + A[0], C[1] - B[1] + A[1]] }, m: "Le déplacement va de A vers B (pas de B vers A)." }, { spec: { kind: "pair", values: [B[0] - A[0], B[1] - A[1]] }, m: "C'est le déplacement : ajoute-le aux coordonnées de C." }] }); },
() => { const A = [nz(-5, 5), nz(-5, 5)], B = [nz(-5, 5), nz(-5, 5)], C = [nz(-5, 5), nz(-5, 5)], D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]]; if ((A[0] - B[0]) * (C[1] - B[1]) === (A[1] - B[1]) * (C[0] - B[0])) return null;
return QP("Dans un repère, " + M("A") + PT(...A) + ", " + M("B") + PT(...B) + " et " + M("C") + PT(...C) + ". Donne les coordonnées du point " + M("D") + " tel que " + M("ABCD") + " soit un parallélogramme (sommets dans cet ordre). Réponds « x ; y ».", D,
M("ABCD") + " est un parallélogramme si " + M("\\overrightarrow{AD} = \\overrightarrow{BC}") + " : le déplacement de " + M("B") + " à " + M("C") + " est " + PT(C[0] - B[0], C[1] - B[1]) + ", qu'on applique à " + M("A") + " : " + M("D") + PT(...D) + ".",
{ ctx: "parallelogramme", guide: [GP("Coordonnées de " + M("\\overrightarrow{BC}") + " (déplacement de B à C) ?", [C[0] - B[0], C[1] - B[1]], PT(C[0] - B[0], C[1] - B[1]) + "."), GP(M("D") + " ?", D, PT(...D) + ".")],
traps: [{ spec: { kind: "pair", values: [B[0] + C[0] - A[0], B[1] + C[1] - A[1]] }, m: "L'ordre des sommets compte : ABCD, donc AD = BC." }, { spec: { kind: "pair", values: [A[0] + B[0] - C[0], A[1] + B[1] - C[1]] }, m: "ABCD : D est en face de B, AD = BC." }] }); },
() => { const A = [nz(-5, 5), nz(-5, 5)], u = [nz(-5, 5), nz(-5, 5)], B = [A[0] + u[0], A[1] + u[1]];
return QP("Le vecteur " + M("\\overrightarrow{AB}") + " a pour coordonnées " + PT(...u) + " et " + M("A") + PT(...A) + ". Donne les coordonnées de " + M("B") + ". Réponds « x ; y ».", B,
M("x_B = x_A + " + NP(u[0]) + " = " + N(B[0])) + " et " + M("y_B = y_A + " + NP(u[1]) + " = " + N(B[1])) + ".",
{ ctx: "extremite", guide: [GR(M("x_B") + " ?", B[0], M(N(B[0])) + "."), GR(M("y_B") + " ?", B[1], M(N(B[1])) + "."), GP(M("B") + " ?", B, PT(...B) + ".")],
traps: [{ spec: { kind: "pair", values: [A[0] - u[0], A[1] - u[1]] }, m: "AB va de A vers B : on ajoute ses coordonnées à celles de A." }, { spec: { kind: "pair", values: u }, m: "Ce sont les coordonnées du vecteur, pas du point B." }] }); },
],
2: [
() => { const A = [nz(-4, 4), nz(-4, 4)], B = [nz(-4, 4), nz(-4, 4)], C = [nz(-4, 4), nz(-4, 4)], D = [nz(-4, 4), nz(-4, 4)], s = [B[0] - A[0] + D[0] - C[0], B[1] - A[1] + D[1] - C[1]];
return QP("Dans un repère, " + M("A") + PT(...A) + ", " + M("B") + PT(...B) + ", " + M("C") + PT(...C) + " et " + M("D") + PT(...D) + ". Donne les coordonnées du vecteur " + M("\\overrightarrow{AB} + \\overrightarrow{CD}") + ". Réponds « x ; y ».", s,
M("\\overrightarrow{AB}") + PT(B[0] - A[0], B[1] - A[1]) + " et " + M("\\overrightarrow{CD}") + PT(D[0] - C[0], D[1] - C[1]) + " : la somme a pour coordonnées " + PT(...s) + ".",
{ ctx: "somme", guide: [GP(M("\\overrightarrow{AB}") + " ?", [B[0] - A[0], B[1] - A[1]], PT(B[0] - A[0], B[1] - A[1]) + "."), GP(M("\\overrightarrow{CD}") + " ?", [D[0] - C[0], D[1] - C[1]], PT(D[0] - C[0], D[1] - C[1]) + "."), GP("Somme ?", s, PT(...s) + ".")],
traps: [{ spec: { kind: "pair", values: [A[0] - B[0] + C[0] - D[0], A[1] - B[1] + C[1] - D[1]] }, m: "Coordonnées de AB : arrivée moins départ (x_B − x_A)." }, { spec: { kind: "pair", values: [D[0] - A[0], D[1] - A[1]] }, m: "Chasles ne s'applique que si l'arrivée du premier est le départ du second : ici, calcule les deux vecteurs." }] }); },
() => { const A = [nz(-5, 5), nz(-5, 5)], I = [nz(-4, 4), nz(-4, 4)], B = [2 * I[0] - A[0], 2 * I[1] - A[1]];
return QP(M("I") + PT(...I) + " est le milieu du segment " + M("[AB]") + ", avec " + M("A") + PT(...A) + ". Donne les coordonnées de " + M("B") + ". Réponds « x ; y ».", B,
M("I") + " milieu de " + M("[AB]") + " : " + M("\\overrightarrow{AI} = \\overrightarrow{IB}") + ". " + M("\\overrightarrow{AI}") + PT(I[0] - A[0], I[1] - A[1]) + ", qu'on applique à " + M("I") + " : " + M("B") + PT(...B) + ".",
{ ctx: "milieu", guide: [GP(M("\\overrightarrow{AI}") + " ?", [I[0] - A[0], I[1] - A[1]], PT(I[0] - A[0], I[1] - A[1]) + "."), GP(M("B") + " ?", B, PT(...B) + ".")],
traps: [{ spec: { kind: "pair", values: [(A[0] + I[0]) / 2, (A[1] + I[1]) / 2] }, m: "I est le milieu de [AB] : B est au-delà de I, à la même distance que A." }, { spec: { kind: "pair", values: [I[0] - A[0], I[1] - A[1]] }, m: "C'est le vecteur AI : ajoute-le à I." }] }); },
() => { const M0 = [nz(-5, 5), nz(-5, 5)], u = [nz(-4, 4), nz(-4, 4)], v = [nz(-4, 4), nz(-4, 4)], P = [M0[0] + u[0] + v[0], M0[1] + u[1] + v[1]];
return QP("On applique au point " + M("M") + PT(...M0) + " la translation de vecteur " + M("\\vec{u}") + PT(...u) + ", puis celle de vecteur " + M("\\vec{v}") + PT(...v) + ". Où arrive le point ? Réponds « x ; y ».", P,
"Enchaîner deux translations revient à faire la translation de vecteur " + M("\\vec{u} + \\vec{v}") + PT(u[0] + v[0], u[1] + v[1]) + " : " + PT(...P) + ".",
{ ctx: "enchainement", guide: [GP("Après la première translation ?", [M0[0] + u[0], M0[1] + u[1]], PT(M0[0] + u[0], M0[1] + u[1]) + "."), GP("Point d'arrivée ?", P, PT(...P) + ".")],
traps: [{ spec: { kind: "pair", values: [M0[0] + u[0], M0[1] + u[1]] }, m: "Il reste la seconde translation." }, { spec: { kind: "pair", values: [u[0] + v[0], u[1] + v[1]] }, m: "C'est le vecteur u + v ; on l'applique au point M." }] }); },
],
3: [
() => { const A = [nz(-4, 4), nz(-4, 4)], B = [nz(-4, 4), nz(-4, 4)], C = [nz(-4, 4), nz(-4, 4)], m = nz(-5, 6), Dy = C[1] + B[1] - A[1], D = [C[0] + B[0] - A[0], Dy], k = R.rand() < 0.5;
if (A[0] === B[0] && A[1] === B[1]) return null;
const Dx = D[0] - m;
return QN("Dans un repère, " + M("A") + PT(...A) + ", " + M("B") + PT(...B) + ", " + M("C") + PT(...C) + " et " + M("D(m" + sg(Dx) + " \\,;\\, " + N(Dy) + ")") + ". Pour quelle valeur de " + M("m") + " a-t-on " + M("\\overrightarrow{AB} = \\overrightarrow{CD}") + " ?", m,
M("\\overrightarrow{AB}") + PT(B[0] - A[0], B[1] - A[1]) + " ; " + M("\\overrightarrow{CD}(m" + sg(Dx - C[0]) + " \\,;\\, " + N(Dy - C[1]) + ")") + ". Les ordonnées sont égales ; les abscisses : " + M("m" + sg(Dx - C[0]) + " = " + N(B[0] - A[0])) + ", " + M("m = " + N(m)) + ".",
{ ctx: "parametre", guide: [GR("Abscisse de " + M("\\overrightarrow{AB}") + " ?", B[0] - A[0], M(N(B[0] - A[0])) + "."), GR(M("m") + " ?", m, M(N(m)) + ".")],
traps: [TR(D[0], "On cherche m, pas l'abscisse de D."), TR(m + 2 * Dx, "x_D = m + " + Dx + " : isole m.")] }); },
() => { const A = [nz(-4, 4), nz(-4, 4)], B = [nz(-4, 4), nz(-4, 4)], C = [nz(-4, 4), nz(-4, 4)], D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]], O = [(A[0] + C[0]) / 2, (A[1] + C[1]) / 2];
if ((A[0] - B[0]) * (C[1] - B[1]) === (A[1] - B[1]) * (C[0] - B[0])) return null;
return QP(M("ABCD") + " est un parallélogramme avec " + M("A") + PT(...A) + ", " + M("B") + PT(...B) + " et " + M("C") + PT(...C) + ". Donne les coordonnées de son centre " + M("O") + " (fractions ou décimaux acceptés). Réponds « x ; y ».", O,
"Les diagonales d'un parallélogramme se coupent en leur milieu : " + M("O") + " est le milieu de " + M("[AC]") + ", " + PT(...O) + ". (Inutile de calculer " + M("D") + PT(...D) + ".)",
{ ctx: "centre", guide: [GP("Milieu de " + M("[AC]") + " ?", O, PT(...O) + ".")],
traps: [{ spec: { kind: "pair", values: [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2] }, m: "Le centre est le milieu d'une diagonale ([AC] ou [BD]), pas d'un côté." }, { spec: { kind: "pair", values: D }, m: "C'est le quatrième sommet D, pas le centre." }] }); },
() => { const A = [nz(-4, 4), nz(-4, 4)], B = [nz(-4, 4), nz(-4, 4)], C = [nz(-4, 4), nz(-4, 4)], E = [B[0] + C[0] - A[0], B[1] + C[1] - A[1]];
return QP("Dans un repère, " + M("A") + PT(...A) + ", " + M("B") + PT(...B) + " et " + M("C") + PT(...C) + ". Le point " + M("E") + " vérifie " + M("\\overrightarrow{AE} = \\overrightarrow{AB} + \\overrightarrow{AC}") + ". Donne ses coordonnées. Réponds « x ; y ».", E,
M("\\overrightarrow{AB}") + PT(B[0] - A[0], B[1] - A[1]) + " et " + M("\\overrightarrow{AC}") + PT(C[0] - A[0], C[1] - A[1]) + " : " + M("\\overrightarrow{AE}") + PT(B[0] + C[0] - 2 * A[0], B[1] + C[1] - 2 * A[1]) + ", donc " + M("E") + PT(...E) + " (" + M("ABEC") + " est un parallélogramme).",
{ ctx: "regle-parallelogramme", guide: [GP(M("\\overrightarrow{AB} + \\overrightarrow{AC}") + " ?", [B[0] + C[0] - 2 * A[0], B[1] + C[1] - 2 * A[1]], PT(B[0] + C[0] - 2 * A[0], B[1] + C[1] - 2 * A[1]) + "."), GP(M("E") + " ?", E, PT(...E) + ".")],
traps: [{ spec: { kind: "pair", values: [B[0] + C[0] - 2 * A[0], B[1] + C[1] - 2 * A[1]] }, m: "C'est le vecteur AE ; ajoute-le aux coordonnées de A." }, { spec: { kind: "pair", values: [B[0] + C[0], B[1] + C[1]] }, m: "On ajoute des vecteurs, pas des points." }] }); },
],
};



const tvTex = (xs, ys) => M("\\begin{array}{c|" + "c".repeat(2 * xs.length - 1) + "} x & " + xs.map(N).join(" & & ") + " \\\\ \\hline f(x) & " + ys.map((y, i) => N(y) + (i < ys.length - 1 ? " & " + (ys[i + 1] > y ? "\\nearrow" : "\\searrow") : "")).join(" & ") + " \\end{array}");
const mkTab = (n, up0) => { const xs = [R.int(-6, -3)]; for (let i = 1; i < n; i++) xs.push(xs[i - 1] + R.int(2, 4)); const up = up0 === undefined ? R.rand() < 0.5 : up0, ys = [];
for (let i = 0; i < n; i++) ys.push(i === 0 ? nz(-5, 5) : ys[i - 1] + ((i % 2 === 1) === up ? 1 : -1) * R.int(2, 6)); return { xs, ys }; };
const INTRO = "Voici le tableau de variations d'une fonction " + M("f") + " : ";
const TV = {
1: [
() => { const { xs, ys } = mkTab(4), mx = Math.max(...ys), wantMax = R.rand() < 0.5, v = wantMax ? mx : Math.min(...ys);
return QN(INTRO + tvTex(xs, ys) + " Quel est le " + (wantMax ? "maximum" : "minimum") + " de " + M("f") + " sur " + M("[" + N(xs[0]) + " \\,;\\, " + N(xs[3]) + "]") + " ?", v,
"On compare les valeurs aux sommets des flèches et aux bornes : " + M(ys.map(N).join(" ; ")) + ". Le " + (wantMax ? "maximum" : "minimum") + " vaut " + M(N(v)) + ", atteint en " + M("x = " + N(xs[ys.indexOf(v)])) + ".",
{ ctx: wantMax ? "maximum" : "minimum", shownOk: true, guide: [GR("Le " + (wantMax ? "maximum" : "minimum") + " ?", v, M(N(v)) + ".")],
traps: [TR(xs[ys.indexOf(v)], "C'est l'abscisse où il est atteint ; on demande la valeur de f."), TR(wantMax ? Math.max(ys[1], ys[2]) === v ? Math.max(ys[0], ys[3]) : Math.max(ys[1], ys[2]) : Math.min(ys[1], ys[2]) === v ? Math.min(ys[0], ys[3]) : Math.min(ys[1], ys[2]), "Compare aussi les valeurs aux bornes de l'intervalle.")] }); },
() => { const dec = R.rand() < 0.5, { xs, ys } = mkTab(4, dec), i = 1, iv = [[xs[i], true, xs[i + 1], true]];
return QS(INTRO + tvTex(xs, ys) + " Sur quel intervalle " + M("f") + " est-elle " + (dec ? "décroissante" : "croissante") + " ?", iv,
"La flèche " + (dec ? "descend" : "monte") + " entre " + M(N(xs[i])) + " et " + M(N(xs[i + 1])) + " : " + M("f") + " est " + (dec ? "décroissante" : "croissante") + " sur " + M("[" + N(xs[i]) + " \\,;\\, " + N(xs[i + 1]) + "]") + ".",
{ ctx: dec ? "decroissante" : "croissante", guide: [{ ask: "Intervalle ?", spec: solsetSpec(iv), sol: M("[" + N(xs[i]) + " \\,;\\, " + N(xs[i + 1]) + "]") + "." }],
traps: [TS([[Math.min(ys[i], ys[i + 1]), true, Math.max(ys[i], ys[i + 1]), true]], "L'intervalle porte sur x (première ligne), pas sur les valeurs de f."), TS([[xs[0], true, xs[1], true]], "Regarde le sens de chaque flèche.")] }); },
() => { const { xs, ys } = mkTab(3), up = ys[1] > ys[0], a = xs[0] + 0.5, b = xs[1] - 0.5, big = up ? b : a;
return QN(INTRO + tvTex(xs, ys) + " Sans connaître " + M("f(" + N(a) + ")") + " ni " + M("f(" + N(b) + ")") + ", lequel de ces deux nombres est le plus grand ? Réponds " + M(N(a)) + " si c'est " + M("f(" + N(a) + ")") + ", " + M(N(b)) + " si c'est " + M("f(" + N(b) + ")") + ".", big,
M(N(a)) + " et " + M(N(b)) + " sont dans " + M("[" + N(xs[0]) + " \\,;\\, " + N(xs[1]) + "]") + ", où " + M("f") + " est " + (up ? "croissante : elle conserve l'ordre" : "décroissante : elle inverse l'ordre") + ". Donc " + M("f(" + N(big) + ")") + " est le plus grand.",
{ ctx: "comparer", shownOk: true, guide: [GR("Sur cet intervalle, " + M("f") + " est-elle croissante (1) ou décroissante (−1) ?", up ? 1 : -1, up ? "Croissante." : "Décroissante."), GR("Le plus grand est " + M("f(\\dots)") + " : tape le nombre entre parenthèses.", big, M("f(" + N(big) + ")") + ".")],
traps: [TR(up ? a : b, up ? "f croissante conserve l'ordre : le plus grand x donne la plus grande image." : "f décroissante inverse l'ordre.")] }); },
],
2: [
() => { const { xs, ys } = mkTab(4), lo = Math.min(...ys), hi = Math.max(...ys); let k = R.int(lo + 1, hi - 1); if (ys.includes(k)) k += 0.5;
let n = 0; for (let i = 0; i < 3; i++) if ((ys[i] - k) * (ys[i + 1] - k) < 0) n++;
return QN(INTRO + tvTex(xs, ys) + " Combien de solutions l'équation " + M("f(x) = " + N(k)) + " a-t-elle sur " + M("[" + N(xs[0]) + " \\,;\\, " + N(xs[3]) + "]") + " ?", n,
"Sur chaque intervalle où " + M("f") + " est monotone, la valeur " + M(N(k)) + " est atteinte au plus une fois, et elle l'est si elle est entre les valeurs aux extrémités. Ici : " + n + " intervalle" + (n > 1 ? "s" : "") + " sur 3.",
{ ctx: "nb-solutions", guide: [GR("Sur combien des trois intervalles " + M(N(k)) + " est-il compris entre les deux valeurs aux extrémités ?", n, M(n) + ".")],
traps: [TR(n === 1 ? 2 : 1, "Regarde chaque flèche : " + N(k).replace("{,}", ",") + " est-il entre la valeur de départ et la valeur d'arrivée ?"), TR(3, "Toutes les flèches ne passent pas par " + N(k).replace("{,}", ",") + ".")] }); },
() => { const { xs, ys } = mkTab(4), j = R.int(1, 2), sub = ys.slice(j), wantMax = R.rand() < 0.5, v = wantMax ? Math.max(...sub) : Math.min(...sub);
if (v === (wantMax ? Math.max(...ys) : Math.min(...ys))) return null;
return QN(INTRO + tvTex(xs, ys) + " Quel est le " + (wantMax ? "maximum" : "minimum") + " de " + M("f") + " sur l'intervalle " + M("[" + N(xs[j]) + " \\,;\\, " + N(xs[3]) + "]") + " ?", v,
"On ne regarde que la partie du tableau entre " + M(N(xs[j])) + " et " + M(N(xs[3])) + " : valeurs " + M(sub.map(N).join(" ; ")) + ". " + (wantMax ? "Maximum" : "Minimum") + " : " + M(N(v)) + ".",
{ ctx: "extremum-partiel", shownOk: true, guide: [GR("Valeurs de " + M("f") + " utiles (bornes et sommets) : la plus " + (wantMax ? "grande" : "petite") + " ?", v, M(N(v)) + ".")],
traps: [TR(wantMax ? Math.max(...ys) : Math.min(...ys), "Sur [" + xs[j] + " ; " + xs[3] + "] seulement : ignore le début du tableau.")] }); },
() => { const { xs, ys } = mkTab(4); if (ys.includes(0)) return null;
let n = 0; for (let i = 0; i < 3; i++) if (ys[i] * ys[i + 1] < 0) n++; if (!n) return null;
return QN(INTRO + tvTex(xs, ys) + " Combien de fois la courbe de " + M("f") + " coupe-t-elle l'axe des abscisses ?", n,
"La courbe coupe l'axe des abscisses quand " + M("f(x) = 0") + ", c'est-à-dire sur chaque flèche qui passe d'une valeur négative à une valeur positive (ou l'inverse) : " + n + " fois.",
{ ctx: "zeros", guide: [GR("Combien de flèches changent de signe ?", n, M(n) + ".")],
traps: [TR(n + 1, "Une flèche qui reste du même signe ne coupe pas l'axe."), TR(3, "Regarde le signe des valeurs aux deux bouts de chaque flèche.")] }); },
],
3: [
() => { const a = nz(-3, 3), b = nz(-6, 6), lo = a - R.int(1, 4), hi = a + R.int(1, 4), s = pk([1, -1]), vals = [lo, a, hi].map((x) => s * (x - a) ** 2 + b), v = s > 0 ? b : Math.max(...vals.filter((_, i) => i !== 1));
const askMin = s > 0;
return QN("Soit " + M("f(x) = " + (s < 0 ? "-" : "") + "(x" + sg(-a) + ")^2" + sg(b)) + " sur " + M("[" + N(lo) + " \\,;\\, " + N(hi) + "]") + ". Dresse son tableau de variations. Quel est son " + (askMin ? "minimum" : "maximum") + " sur cet intervalle ?", s > 0 ? b : b,
"Forme canonique : " + M("f") + " est " + (s > 0 ? "décroissante puis croissante" : "croissante puis décroissante") + ", avec un " + (s > 0 ? "minimum" : "maximum") + " en " + M("x = " + N(a)) + " : " + M("f(" + N(a) + ") = " + N(b)) + ". Tableau : " + tvTex([lo, a, hi], vals) + ".",
{ ctx: "canonique", guide: [GR("En quelle abscisse la flèche change-t-elle de sens ?", a, M("x = " + N(a)) + "."), GR((askMin ? "Minimum" : "Maximum") + " ?", b, M(N(b)) + ".")],
traps: [TR(a, "C'est l'abscisse ; on demande la valeur."), TR(-b, "f(" + a + ") = " + b + " : (x − " + a + ")² s'annule.")] }); },
() => { const { xs, ys } = mkTab(4), iv = [[Math.min(...ys), true, Math.max(...ys), true]];
return QS(INTRO + tvTex(xs, ys) + " Quand " + M("x") + " parcourt " + M("[" + N(xs[0]) + " \\,;\\, " + N(xs[3]) + "]") + ", dans quel intervalle " + M("f(x)") + " prend-elle ses valeurs ? Donne le plus petit intervalle possible.", iv,
M("f") + " est continue sur l'intervalle (pas de saut) : elle prend toutes les valeurs entre son minimum " + M(N(iv[0][0])) + " et son maximum " + M(N(iv[0][2])) + ", donc " + M("f(x) \\in [" + N(iv[0][0]) + " \\,;\\, " + N(iv[0][2]) + "]") + ".",
{ ctx: "image-intervalle", guide: [GR("Minimum ?", iv[0][0], M(N(iv[0][0])) + "."), GR("Maximum ?", iv[0][2], M(N(iv[0][2])) + "."), { ask: "Intervalle des valeurs ?", spec: solsetSpec(iv), sol: M("[" + N(iv[0][0]) + " \\,;\\, " + N(iv[0][2]) + "]") + "." }],
traps: [TS([[Math.min(ys[0], ys[3]), true, Math.max(ys[0], ys[3]), true]], "Les valeurs aux bornes ne suffisent pas : regarde aussi les sommets des flèches."), TS([[xs[0], true, xs[3], true]], "C'est l'intervalle des x ; on demande les valeurs de f.")] }); },
() => { const { xs, ys } = mkTab(4); let k = R.rand() < 0.5 ? ys[1] + (ys[2] > ys[1] ? 1 : -1) * 0.5 : (ys[2] + ys[3]) / 2, n = 0; for (let i = 1; i < 3; i++) if ((ys[i] - k) * (ys[i + 1] - k) < 0) n++;


if (ys.slice(1).includes(k)) return null;
return QN(INTRO + tvTex(xs, ys) + " Combien de solutions l'équation " + M("f(x) = " + N(k)) + " a-t-elle sur " + M("[" + N(xs[1]) + " \\,;\\, " + N(xs[3]) + "]") + " ?", n,
"On ne regarde que les flèches entre " + M(N(xs[1])) + " et " + M(N(xs[3])) + " : " + M(N(k)) + " est atteint une fois sur chaque flèche qui l'encadre, soit " + n + " solution" + (n > 1 ? "s" : "") + ".",
{ ctx: "nb-solutions-partiel", guide: [GR("Nombre de flèches (entre " + M(N(xs[1])) + " et " + M(N(xs[3])) + ") qui encadrent " + M(N(k)) + " ?", n, M(n) + ".")],
traps: [TR(n + ((ys[0] - k) * (ys[1] - k) < 0 ? 1 : 0), "Seulement sur [" + xs[1] + " ; " + xs[3] + "] : la première flèche ne compte pas."), TR(n + 1, "Compte les flèches qui encadrent " + N(k).replace("{,}", ",") + ".")] }); },
],
};



const PR = (ctx, q, parts, hints, sol) => ({ ctx, q, hints, sol, parts: parts.map(([label, value, round]) => ({ label, spec: Object.assign({ kind: "value", value: rnd(value) }, round ? { round } : {}) })) });
const T = (v) => N(v).replace(/\\,/g, " ").replace("{,}", ",").replace(/^-/, "−");
const ADP = [() => {
const cx = pk(["calcul", "puissances", "mesures", "equation"]), parts = [], sol = [];
if (cx === "calcul") {
let a, b, c, d, e, f, v; do { b = pk([3, 4, 5, 6]); a = R.int(1, b - 1); c = R.int(1, 5); d = pk([2, 3, 4, 5]); e = R.int(1, 5); f = pk([2, 3, 4, 5, 6]); v = a / b - (c * e) / (d * f); } while (g2(a, b) !== 1 || g2(c, d) !== 1 || g2(e, f) !== 1 || c === d || e === f || Math.abs(v) < 1e-9 || den(v) > 36);
const P0 = pk([20, 40, 60, 80, 120]), t = pk([5, 10, 15, 20, 25, 30]), obj = pk(["Un pull", "Une place de concert", "Un abonnement de téléphone", "Un sac à dos"]), m = pk([20, 30, 40, 50, 60, 100]), k = R.int(1, 4);
parts.push(["a) " + a + "/" + b + " − " + c + "/" + d + " × " + e + "/" + f + " (fraction irréductible ou décimal)", v], ["b) " + obj + " à " + P0 + " € augmente de " + t + " %. Nouveau prix (€)", (P0 * (100 + t)) / 100], ["c) " + (m + k) + "² − " + (m - k) + "²", 4 * m * k]);
sol.push("a) La multiplication d'abord : " + M("\\frac{" + a + "}{" + b + "} - \\frac{" + c * e + "}{" + d * f + "} = " + F(v)), "b) " + M(P0 + " \\times " + N(rnd(1 + t / 100)) + " = " + N(rnd((P0 * (100 + t)) / 100))) + " €", "c) " + M("(" + (m + k) + " - " + (m - k) + ")(" + (m + k) + " + " + (m - k) + ") = " + 2 * k + " \\times " + 2 * m + " = " + 4 * m * k));
} else if (cx === "puissances") {
let p, q, r; do { p = R.int(-4, 9); q = R.int(-6, 6); r = R.int(-4, 8); } while (!p || !q || !r || p + q - r === 0);
const [cont, o1, o2, o3, un] = pk([["Un sac contient", "billes rouges", "billes vertes", "billes jaunes", "une"], ["Une urne contient", "boules bleues", "boules blanches", "boules noires", "une"], ["Une boîte contient", "crayons rouges", "crayons verts", "crayons bleus", "un"]]), ep = (v) => (v < 0 ? "(" + T(v) + ")" : T(v)), x = R.int(2, 7), y = R.int(2, 7), z = R.int(2, 6), tt = pk([5, 15, 25, 30, 75]), NN = 20 * R.int(2, 12);
parts.push(["a) 10^" + ep(p) + " × 10^" + ep(q) + " ÷ 10^" + ep(r) + " s'écrit 10ⁿ : valeur de n", p + q - r], ["b) " + cont + " " + x + " " + o1 + ", " + y + " " + o2 + " et " + z + " " + o3 + ". On en tire " + un + " au hasard. P(" + o2.split(" ")[0].replace(/s$/, "") + " " + o2.split(" ")[1].replace(/s$/, "") + ") (fraction acceptée)", y / (x + y + z)], ["c) " + tt + " % de " + NN, (tt * NN) / 100]);
sol.push("a) " + M("10^{" + p + " + " + NP(q) + " - " + NP(r) + "} = 10^{" + (p + q - r) + "}"), "b) " + M("\\frac{" + y + "}{" + (x + y + z) + "}" + (g2(y, x + y + z) > 1 ? " = " + F(y / (x + y + z)) : "")), "c) " + M(NN + " \\times " + N(tt / 100) + " = " + N((tt * NN) / 100)));
} else if (cx === "mesures") {
const [a0, b0, c0] = pk([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20]]), [tr, vs] = pk([["Un TGV", [240, 270, 300, 320]], ["Un TER", [90, 120, 150]], ["Un Intercités", [120, 150, 180]]]), v = pk(vs), mn = pk([15, 20, 30, 40, 45]), dk = (v * mn) / 60, r = R.int(3, 12);
parts.push(["a) Un triangle est rectangle ; les côtés de l'angle droit mesurent " + a0 + " cm et " + b0 + " cm. Hypoténuse (cm)", c0], ["b) " + tr + " parcourt " + T(dk) + " km en " + mn + " min. Vitesse moyenne (km/h)", v], ["c) Un disque a pour rayon " + r + " cm ; son aire s'écrit k × π cm². Valeur de k", r * r]);
sol.push("a) " + M("\\sqrt{" + a0 + "^2 + " + b0 + "^2} = \\sqrt{" + c0 * c0 + "} = " + c0), "b) en 1 h = 60 min : " + M(N(dk) + " \\div " + mn + " \\times 60 = " + v) + " km/h", "c) " + M("\\pi \\times " + r + "^2 = " + r * r + "\\pi"));
} else {
let a, b, c, d, xs; do { a = R.int(2, 9); c = R.int(-5, 9); xs = R.int(-6, 8); b = R.int(-12, 12); d = (a - c) * xs + b; } while (a === c || !c || !b || !xs || Math.abs(d) > 30);
let t1, t2; do { t1 = pk([10, 20, 25, 30, 50]); t2 = pk([10, 20, 25, 30, 40]); } while ((100 + t1) * (100 - t2) === 10000);
const g = ((100 + t1) * (100 - t2) - 10000) / 100, ka = pk([2, 3, -2, 5]), kb = R.int(-9, 9), x0 = -R.int(2, 5), im = ka * x0 * x0 + kb;
const lin2 = (p, q) => (p === 1 ? "" : p === -1 ? "−" : T(p)) + "x" + (q ? (q < 0 ? " − " + T(-q) : " + " + T(q)) : "");
parts.push(["a) Solution de " + lin2(a, b) + " = " + lin2(c, d), xs], ["b) Un prix augmente de " + t1 + " %, puis baisse de " + t2 + " %. Taux d'évolution global (en %, négatif pour une baisse)", g], ["c) Image de " + T(x0) + " par la fonction f(x) = " + (ka === 1 ? "" : T(ka)) + "x²" + (kb ? (kb < 0 ? " − " + T(-kb) : " + " + T(kb)) : ""), im]);
sol.push("a) " + M(N(a - c) + "x = " + N(d - b)) + ", " + M("x = " + xs), "b) " + M(N(rnd(1 + t1 / 100)) + " \\times " + N(rnd(1 - t2 / 100)) + " = " + N(rnd(1 + g / 100))) + " : " + M(N(g) + "\\,\\%"), "c) " + M(N(ka) + " \\times " + NP(x0) + "^2" + sg(kb) + " = " + N(ka) + " \\times " + x0 * x0 + sg(kb) + " = " + N(im)) + " (le carré d'un négatif est positif)");
}
return PR(cx, "Partie 1 du brevet (automatismes), sans calculatrice.", parts, ["Priorités : puissances, puis × et ÷, puis + et −.", cx === "calcul" ? "a² − b² = (a − b)(a + b)." : cx === "puissances" ? "10ᵖ × 10^q = 10^(p + q) et 10ᵖ ÷ 10^q = 10^(p − q)." : cx === "mesures" ? "Pythagore : hypoténuse² = somme des carrés des deux autres côtés." : "Deux évolutions successives : on multiplie les coefficients."], sol.join(" ; ") + ".");
}];

const nbSol = (ys, k) => { let n = 0; for (let i = 0; i + 1 < ys.length; i++) if ((k - ys[i]) * (k - ys[i + 1]) < 0) n++; return n; };
const pickK = (ys, want) => { const lo = Math.min(...ys) - 3, hi = Math.max(...ys) + 3; const ks = []; for (let k = lo; k <= hi; k++) if (!ys.includes(k) && (want === undefined || nbSol(ys, k) === want)) ks.push(k); return ks.length ? pk(ks) : null; };
const TVP = [() => {
const cx = pk(["fonction", "temperature", "altitude", "benefice"]);
if (cx === "fonction") {
let xs, ys, k1, k2; do { const x0 = R.int(-6, -1), x1 = x0 + R.int(2, 6), x2 = x1 + R.int(2, 6), dn = R.rand() < 0.5, y1 = R.int(-8, 8); xs = [x0, x1, x2]; ys = dn ? [y1 + R.int(2, 9), y1, y1 + R.int(2, 9)] : [y1 - R.int(2, 9), y1, y1 - R.int(2, 9)]; k1 = pickK(ys, 2); k2 = pickK(ys, 1); } while (k1 === null || k2 === null || ys[0] === ys[2]);
const dn = ys[1] < ys[0], ext = dn ? Math.min(...ys) : Math.max(...ys), [p, q] = pk([[k1, k2], [k2, k1]]);
return PR(cx, "Tableau de variations de f sur [" + T(xs[0]) + " ; " + T(xs[2]) + "] : f(" + T(xs[0]) + ") = " + T(ys[0]) + ", f(" + T(xs[1]) + ") = " + T(ys[1]) + ", f(" + T(xs[2]) + ") = " + T(ys[2]) + " ; f est " + (dn ? "décroissante" : "croissante") + " sur [" + T(xs[0]) + " ; " + T(xs[1]) + "], puis " + (dn ? "croissante" : "décroissante") + " sur [" + T(xs[1]) + " ; " + T(xs[2]) + "].",
[["a) " + (dn ? "Minimum" : "Maximum") + " de f sur [" + T(xs[0]) + " ; " + T(xs[2]) + "]", ext], ["b) Nombre de solutions de f(x) = " + T(p), nbSol(ys, p)], ["c) Nombre de solutions de f(x) = " + T(q), nbSol(ys, q)]],
["Une flèche va de " + T(ys[0]) + " à " + T(ys[1]) + ", l'autre de " + T(ys[1]) + " à " + T(ys[2]) + ".", "Sur une flèche, f prend une fois chaque valeur comprise entre ses deux extrémités."],
"a) " + M(N(ext)) + " en " + M("x = " + N(xs[1])) + " ; b) " + M(N(p)) + (nbSol(ys, p) === 2 ? " est sur les deux flèches : 2 solutions" : " n'est que sur une flèche : 1 solution") + " ; c) " + M(N(q)) + (nbSol(ys, q) === 2 ? " est sur les deux flèches : 2 solutions" : " n'est que sur une flèche : 1 solution") + ".");
}
if (cx === "temperature") {
let ys, h1, h2, k; do { const y0 = R.int(-3, 4), y1 = y0 - R.int(2, 6), y2 = y1 + R.int(5, 12), y3 = y2 - R.int(2, 7); ys = [y0, y1, y2, y3]; h1 = R.int(5, 8); h2 = R.int(13, 16); k = pickK(ys.slice(0, 4)); } while (k === null || nbSol(ys, k) === 0 || ys[3] === ys[1] || ys[0] === ys[2]);
const mn = Math.min(...ys), mx = Math.max(...ys), ville = pk(["Strasbourg", "Besançon", "Clermont-Ferrand", "Mouthe", "Nancy", "Lille", "Metz"]);
return PR(cx, "Un jour d'hiver à " + ville + ", la température (en °C) varie ainsi : de 0 h à " + h1 + " h, elle baisse de " + T(ys[0]) + " °C à " + T(ys[1]) + " °C ; de " + h1 + " h à " + h2 + " h, elle monte jusqu'à " + T(ys[2]) + " °C ; de " + h2 + " h à 24 h, elle baisse jusqu'à " + T(ys[3]) + " °C.",
[["a) Température minimale de la journée (°C)", mn], ["b) Nombre d'instants de la journée où la température vaut " + T(k) + " °C", nbSol(ys, k)], ["c) Écart entre la température maximale et la température minimale (°C)", mx - mn]],
["Fais le tableau de variations : trois flèches.", "Une valeur est atteinte une fois sur chaque flèche qui la « traverse »."],
"Tableau : " + M(N(ys[0]) + " \\searrow " + N(ys[1]) + " \\nearrow " + N(ys[2]) + " \\searrow " + N(ys[3])) + ". a) " + M(N(mn)) + " °C ; b) " + M(N(k)) + " °C est atteinte sur " + nbSol(ys, k) + " flèche" + (nbSol(ys, k) > 1 ? "s" : "") + " : " + nbSol(ys, k) + " instant" + (nbSol(ys, k) > 1 ? "s" : "") + " ; c) " + M(N(mx) + " - " + NP(mn) + " = " + N(mx - mn)) + " °C.");
}
if (cx === "altitude") {
let ys, ds, k; do { ys = [10 * R.int(40, 90), 10 * R.int(150, 260), 10 * R.int(50, 120), 10 * R.int(120, 210)]; const d1 = R.int(20, 60), d2 = d1 + R.int(15, 35), d3 = d2 + R.int(10, 25); ds = [0, d1, d2, d3]; k = 100 * R.int(Math.ceil(Math.min(...ys) / 100), Math.floor(Math.max(...ys) / 100)); } while (ys[2] >= ys[0] + 200 || ys[3] <= ys[2] + 300 || ys.includes(k) || nbSol(ys, k) < 1);
const mass = pk(["des Alpes", "des Pyrénées", "du Massif central"]), dp = ys[1] - ys[0] + ys[3] - ys[2];
return PR(cx, "Profil d'une étape de montagne du Tour de France " + mass + " : départ à " + T(ys[0]) + " m d'altitude ; la route monte jusqu'à un col à " + T(ys[1]) + " m (km " + ds[1] + "), descend jusqu'à la vallée à " + T(ys[2]) + " m (km " + ds[2] + "), puis monte jusqu'à l'arrivée à " + T(ys[3]) + " m (km " + ds[3] + ").",
[["a) Altitude maximale de l'étape (m)", Math.max(...ys)], ["b) Nombre de fois où les coureurs passent à " + T(k) + " m d'altitude", nbSol(ys, k)], ["c) Dénivelé positif total : somme des montées (m)", dp]],
["Tableau de variations de l'altitude en fonction de la distance : trois flèches.", "Dénivelé positif : on n'additionne que les montées."],
"Tableau : " + M(N(ys[0]) + " \\nearrow " + N(ys[1]) + " \\searrow " + N(ys[2]) + " \\nearrow " + N(ys[3])) + ". a) " + M(N(Math.max(...ys))) + " m ; b) " + M(N(k)) + " m est atteinte sur " + nbSol(ys, k) + " flèche" + (nbSol(ys, k) > 1 ? "s" : "") + " ; c) " + M("(" + N(ys[1]) + " - " + N(ys[0]) + ") + (" + N(ys[3]) + " - " + N(ys[2]) + ") = " + N(dp)) + " m.");
}
let ys, X, x1, k; do { X = pk([40, 50, 60, 80, 100]); x1 = Math.round(X * (0.35 + R.rand() * 0.3)); ys = [-100 * R.int(2, 8), 100 * R.int(4, 25), 100 * R.int(-6, 6)]; k = 100 * R.int(1, Math.floor(ys[1] / 100) - 1); } while (!ys[2] || ys[2] >= ys[1] || ys.includes(k) || ys.includes(0));
const [prod, reg2] = pk([["crêpières", "de Bretagne"], ["planches de surf", "des Landes"], ["paires de skis", "du Jura"], ["lampes de bureau", "de Normandie"], ["bicyclettes en bois", "de la Drôme"]]);
return PR(cx, "Une petite entreprise " + reg2 + " fabrique chaque mois entre 0 et " + X + " " + prod + ". Son bénéfice B(x) (en €) pour x objets est croissant sur [0 ; " + x1 + "] et décroissant sur [" + x1 + " ; " + X + "], avec B(0) = " + T(ys[0]) + ", B(" + x1 + ") = " + T(ys[1]) + " et B(" + X + ") = " + T(ys[2]) + ".",
[["a) Bénéfice maximal (€)", ys[1]], ["b) Nombre de quantités x pour lesquelles le bénéfice est nul", nbSol(ys, 0)], ["c) Nombre de quantités x pour lesquelles le bénéfice vaut " + T(k) + " €", nbSol(ys, k)]],
["Une flèche monte de " + T(ys[0]) + " à " + T(ys[1]) + ", l'autre descend jusqu'à " + T(ys[2]) + ".", "Pour b), regarde si 0 est entre les extrémités de chaque flèche."],
"Tableau : " + M(N(ys[0]) + " \\nearrow " + N(ys[1]) + " \\searrow " + N(ys[2])) + ". a) " + M(N(ys[1])) + " € pour " + x1 + " objets ; b) 0 est atteint sur " + nbSol(ys, 0) + " flèche" + (nbSol(ys, 0) > 1 ? "s" : "") + " : " + nbSol(ys, 0) + " ; c) " + M(N(k)) + " € : " + nbSol(ys, k) + ".");
}];

reg([
{ id: "linfn", theme: "fa", label: "Fonctions linéaires", ex: "f(x) = ax", FR: [9, 6], againFR: [10], g: LF,
hint: "Une fonction linéaire s'écrit f(x) = ax : elle traduit une situation de proportionnalité (a = coefficient). a = f(x) ÷ x. Augmenter de t % : f(x) = (1 + t/100)x.",
comps: ["Coefficient, image, antécédent", "Pourcentages, droite par l'origine, proportionnalité", "Linéarité, évolutions successives, linéaire et affine"],
lesson: ["Fonctions linéaires", "Une fonction linéaire est une fonction de la forme \\(f(x) = ax\\) : elle modélise une situation de proportionnalité.",
"Le coefficient \\(a\\) est le coefficient de proportionnalité : \\(a = \\frac{f(x)}{x}\\) pour \\(x \\neq 0\\). La représentation graphique est une droite qui passe par l'origine. Appliquer un pourcentage d'évolution de \\(t\\,\\%\\) est une fonction linéaire de coefficient \\(1 + \\frac{t}{100}\\) (hausse) ou \\(1 - \\frac{t}{100}\\) (baisse). Linéarité : \\(f(u + v) = f(u) + f(v)\\) et \\(f(ku) = kf(u)\\).",
["\\(f(5) = 12\\) : \\(a = \\frac{12}{5} = 2{,}4\\), donc \\(f(x) = 2{,}4x\\).", "Une baisse de \\(15\\,\\%\\) : \\(f(x) = 0{,}85x\\)."],
"\\(f(x) = 2x + 3\\) n'est pas linéaire (affine) : sa droite ne passe pas par l'origine."] },
{ id: "cos4e", theme: "es", label: "Cosinus d'un angle aigu", ex: "\\cos \\widehat{A} = \\frac{\\text{adjacent}}{\\text{hypoténuse}}", FR: [8, 0], againFR: [9], g: CS,
hint: "Dans un triangle rectangle, cos(angle aigu) = côté adjacent ÷ hypoténuse. Côté adjacent = hypoténuse × cos ; hypoténuse = adjacent ÷ cos ; angle : touche arccos (cos⁻¹).",
comps: ["Calculer un côté adjacent ou l'hypoténuse, écrire un cosinus", "Calculer un angle, problèmes (échelle, rampe)", "Deux étapes avec Pythagore, triangle isocèle, repérer une erreur"],
lesson: ["Le cosinus", "Dans un triangle rectangle, le cosinus d'un angle aigu ne dépend que de l'angle.",
"\\(\\cos \\widehat{A} = \\frac{\\text{côté adjacent à } \\widehat{A}}{\\text{hypoténuse}}\\). L'hypoténuse est en face de l'angle droit ; le côté adjacent est l'autre côté de l'angle. Le cosinus est compris entre 0 et 1. On calcule un côté avec la calculatrice en degrés ; un angle avec la touche \\(\\arccos\\) (ou \\(\\cos^{-1}\\)).",
["Hypoténuse 10 cm, angle \\(60°\\) : côté adjacent \\(= 10 \\times \\cos 60° = 5\\) cm.", "Adjacent 4 cm, hypoténuse 8 cm : \\(\\cos \\widehat{A} = 0{,}5\\), \\(\\widehat{A} = 60°\\)."],
"Le cosinus utilise le côté adjacent, pas le côté opposé ; et l'hypoténuse est toujours au dénominateur."] },
{ id: "thales4e", theme: "gm", label: "Thalès dans des triangles emboîtés", ex: "\\frac{AM}{AB} = \\frac{AN}{AC} = \\frac{MN}{BC}", FR: [8, 7], againFR: [9], g: TH,
hint: "M sur [AB], N sur [AC], (MN) parallèle à (BC) : AM/AB = AN/AC = MN/BC. Le petit triangle AMN est une réduction de ABC. Attention : AB = AM + MB.",
comps: ["Écrire les rapports, calculer MN ou AN", "Avec MB ou NC, problèmes concrets", "Périmètre, équation, repérer une erreur"],
lesson: ["Le théorème de Thalès (triangles emboîtés)", "Une parallèle à un côté d'un triangle découpe un petit triangle, réduction du grand.",
"Si \\(M \\in [AB]\\), \\(N \\in [AC]\\) et \\((MN) \\parallel (BC)\\), alors \\(\\frac{AM}{AB} = \\frac{AN}{AC} = \\frac{MN}{BC}\\). On écrit les trois rapports (petit triangle en haut, grand triangle en bas), puis on garde les deux qui contiennent une seule inconnue et on fait un produit en croix.",
["\\(AM = 3\\), \\(AB = 9\\), \\(BC = 12\\) : \\(MN = 12 \\times \\frac{3}{9} = 4\\).", "\\(AM = 4\\) et \\(MB = 6\\) : \\(AB = 10\\), rapport \\(\\frac{4}{10}\\)."],
"Les rapports comparent le petit triangle au grand : \\(\\frac{AM}{AB}\\), jamais \\(\\frac{AM}{MB}\\)."] },
{ id: "autodnb", theme: "no", label: "Automatismes du brevet (partie 1)", ex: "\\frac{2}{3} + \\frac{5}{6} \\times \\frac{3}{5}", FR: [9, 0], g: AD,
hint: "Sans calculatrice : priorités (puissances, puis × et ÷, puis + et −), fractions irréductibles, 10ᵖ × 10^q = 10^(p+q), t % de x = x × t/100, a² − b² = (a − b)(a + b).",
comps: ["Fractions, puissances de 10, pourcentages, Pythagore", "Identités remarquables, probabilités, équations", "Calculs enchaînés, évolutions successives, vitesse, image"],
lesson: ["Automatismes du brevet", "La première partie du brevet (environ 20 minutes, sans calculatrice) teste des automatismes : il faut les reconnaître et calculer vite et juste.",
"Priorités : parenthèses, puissances, × et ÷, puis + et −. Fractions : même dénominateur pour additionner ; on multiplie numérateurs et dénominateurs entre eux ; résultat irréductible. \\(10^p \\times 10^q = 10^{p + q}\\). Évolution de \\(t\\,\\%\\) : on multiplie par \\(1 \\pm \\frac{t}{100}\\) ; deux évolutions : on multiplie les coefficients. \\((a + b)^2 = a^2 + 2ab + b^2\\), \\(a^2 - b^2 = (a - b)(a + b)\\).",
["\\(\\frac{2}{3} + \\frac{1}{6} \\times \\frac{3}{5} = \\frac{2}{3} + \\frac{1}{10} = \\frac{23}{30}\\).", "\\(102^2 - 98^2 = 4 \\times 200 = 800\\).", "\\(+20\\,\\%\\) puis \\(+10\\,\\%\\) : \\(1{,}2 \\times 1{,}1 = 1{,}32\\), soit \\(+32\\,\\%\\)."],
"Deux évolutions successives ne s'additionnent pas : \\(+20\\,\\%\\) puis \\(-20\\,\\%\\) donne \\(-4\\,\\%\\)."],
probs: ADP },
{ id: "vecgeo", theme: "es", label: "Translations et vecteurs", ex: "\\overrightarrow{AB} = \\overrightarrow{DC} \\iff ABCD \\text{ parallélogramme}", FR: [9, 9], againFR: [10], g: VG,
hint: "La translation qui transforme A en B déplace chaque point du même déplacement : le vecteur AB. AB = DC ⇔ ABCD est un parallélogramme. Coordonnées de AB : (x_B − x_A ; y_B − y_A).",
comps: ["Image par une translation, parallélogramme", "Somme de vecteurs, milieu, enchaîner deux translations", "Vecteurs égaux avec un paramètre, centre, règle du parallélogramme"],
lesson: ["Translations et vecteurs", "La translation qui transforme \\(A\\) en \\(B\\) fait glisser toute la figure dans la même direction, le même sens, de la même longueur : c'est le vecteur \\(\\overrightarrow{AB}\\).",
"\\(\\overrightarrow{AB} = \\overrightarrow{DC}\\) signifie que \\(ABCD\\) est un parallélogramme (éventuellement aplati). Enchaîner les translations de vecteurs \\(\\vec{u}\\) et \\(\\vec{v}\\) revient à faire la translation de vecteur \\(\\vec{u} + \\vec{v}\\) ; relation de Chasles : \\(\\overrightarrow{AB} + \\overrightarrow{BC} = \\overrightarrow{AC}\\). Dans un repère, \\(\\overrightarrow{AB}\\) a pour coordonnées \\((x_B - x_A \\,;\\, y_B - y_A)\\).",
["\\(A(1 \\,;\\, 2)\\), \\(B(4 \\,;\\, 3)\\) : la translation de vecteur \\(\\overrightarrow{AB}\\) envoie \\(C(0 \\,;\\, 5)\\) en \\((3 \\,;\\, 6)\\)."],
"Pour \\(ABCD\\), c'est \\(\\overrightarrow{AB} = \\overrightarrow{DC}\\) (et non \\(\\overrightarrow{CD}\\)) : l'ordre des lettres compte."] },
{ id: "tabvar", theme: "fa", label: "Tableaux de variations", ex: "\\nearrow \\ \\searrow", FR: [10, 12], g: TV,
hint: "Une flèche qui monte : f croissante ; qui descend : f décroissante. Les extremums se lisent aux sommets des flèches et aux bornes. Sur une flèche, f prend une fois chaque valeur comprise entre ses deux extrémités.",
comps: ["Lire extremums et sens de variation, comparer deux images", "Nombre de solutions de f(x) = k, extremum sur une partie, zéros", "Forme canonique, intervalle des valeurs, solutions sur une partie"],
lesson: ["Tableau de variations", "Un tableau de variations résume le sens de variation d'une fonction : une flèche par intervalle où elle est monotone.",
"\\(f\\) croissante sur \\(I\\) : si \\(a < b\\) dans \\(I\\), alors \\(f(a) \\leqslant f(b)\\) (l'ordre est conservé) ; décroissante : l'ordre est inversé. Le maximum (minimum) sur un intervalle se lit parmi les valeurs aux sommets des flèches et aux bornes. Sur une flèche, chaque valeur comprise entre les deux extrémités est atteinte exactement une fois (si la fonction est strictement monotone et continue).",
["Tableau \\(-3 \\nearrow 5 \\searrow -1\\) : maximum 5 ; l'équation \\(f(x) = 2\\) a deux solutions."],
"La première ligne contient les \\(x\\), la seconde les valeurs de \\(f\\) : un intervalle de variation se lit sur les \\(x\\)."],
probs: TVP },
]);
})();








(function () {
const { pk, nz, rnd, g2, N, NP, F, FS, sg, X, co, lin, linE, mk, QN, QR, QX, QS, QSet, QP, GR, GX, GP, TR, TX, TS, P, reg } = FRX;
const QV = (q, value, canon, sol, o) => mk(q, { kind: "value", value }, sol, Object.assign({ canon }, o));


const LN = {
1: [
() => { const [a, b, c] = pk([[6, 4, 3], [10, 3, 5], [2, 9, 6], [12, 5, 4], [15, 2, 6], [8, 9, 12], [14, 3, 7]]), k = (a * b) / c; if (!Number.isInteger(k) || k === 1) return null;
return QN("Écris " + M("\\ln " + a + " + \\ln " + b + " - \\ln " + c) + " sous la forme " + M("\\ln k") + ". Que vaut " + M("k") + " ?", k,
M("\\ln a + \\ln b = \\ln(ab)") + " et " + M("\\ln a - \\ln b = \\ln\\frac{a}{b}") + " : " + M("\\ln\\frac{" + a + X + b + "}{" + c + "} = \\ln " + k) + ".",
{ ctx: "proprietes", guide: [GR(M("\\ln " + a + " + \\ln " + b + " = \\ln(\\dots)") + " ?", a * b, M("\\ln " + a * b) + "."), GR(M("k") + " ?", k, M(k) + ".")],
traps: [TR(a + b - c, "ln transforme les produits en sommes : ln a + ln b = ln(ab), pas ln(a + b)."), TR(a * b * c, "Une différence de logarithmes donne un quotient.")] }); },
() => { const k = pk([2, 3, 5, 7, 10, 0.5]), a = pk([1, 2, 3, -1]), b = pk([0, 1, -1, 2]), v = (Math.log(k) - b) / a;
const ex = (a === 1 ? "x" : a === -1 ? "-x" : a + "x") + (b ? (b > 0 ? " + " : " - ") + Math.abs(b) : "");
const can = a === 1 && !b ? "ln(" + FS(k) + ")" : "(ln(" + FS(k) + ")" + (b ? (b > 0 ? "-" : "+") + Math.abs(b) : "") + ")/" + "(" + a + ")";
return QV("Résous " + M("e^{" + ex + "} = " + N(k)) + ". Donne la valeur exacte (tape « ln(…) »).", v, can,
M("e^{X} = " + N(k) + " \\iff X = \\ln " + N(k)) + " (car " + M(N(k) + " > 0") + ") : " + M(ex + " = \\ln " + N(k)) + ", " + M("x = " + (a === 1 && !b ? "\\ln " + N(k) : "\\frac{\\ln " + N(k) + (b ? sg(-b) : "") + "}{" + a + "}")) + ".",
{ ctx: "exp-egal", guide: [GR("Valeur de l'exposant " + M(ex) + " (avec ln) ?", Math.log(k), M("\\ln " + N(k)) + "."), GR(M("x") + " ?", v, M("x \\approx " + N(rnd(v, 3))) + ".")],
traps: [TR(rnd(Math.exp(k), 9), "On applique ln (la réciproque de exp), pas exp."), TR(rnd(k / a, 9), "e^X = k donne X = ln k.")] }); },
() => { const a = pk([2, 3, -1, 0.5, 4]), m = pk([1, 2, 3]), b = nz(-4, 4), v = (Math.exp(a) - b) / m;
const ex = (m === 1 ? "x" : m + "x") + sg(b);
return QV("Résous " + M("\\ln(" + ex + ") = " + N(a)) + ". Donne la valeur exacte (tape « exp(…) » ou « e^… »).", v, m === 1 ? "exp(" + a + ")" + (b ? (b > 0 ? "-" : "+") + Math.abs(b) : "") : "(exp(" + a + ")" + (b > 0 ? "-" : "+") + Math.abs(b) + ")/" + m,
M("\\ln X = " + N(a) + " \\iff X = e^{" + N(a) + "}") + " : " + M(ex + " = e^{" + N(a) + "}") + ", " + M("x = " + (m === 1 ? "e^{" + N(a) + "}" + sg(-b) : "\\frac{e^{" + N(a) + "}" + sg(-b) + "}{" + m + "}")) + " (et " + M(ex + " > 0") + " : c'est bien le cas).",
{ ctx: "ln-egal", guide: [GR(M(ex) + " = ?", Math.exp(a), M("e^{" + N(a) + "}") + "."), GR(M("x") + " ?", v, M("\\approx " + N(rnd(v, 3))) + ".")],
traps: [TR(rnd((Math.log(a > 0 ? a : 1) - b) / m, 9), "ln X = a donne X = e^a."), TR(rnd((a - b) / m, 9), "On applique exp aux deux membres.")] }); },
],
2: [
() => { const a = nz(-4, 5), b = pk([-7, -5, -3, 3, 5, 7, 2, -2]), v = (1 - b) / a; if (!a || Math.abs(a) === 1 && !(1 - b)) return null;
return QN("Résous " + M("\\ln(" + lin(a, b) + ") = 0") + ".", v,
M("\\ln X = 0 \\iff X = 1") + " : " + M(lin(a, b) + " = 1") + ", " + M("x = " + F(v)) + " (on vérifie " + M(lin(a, b) + " > 0") + ").",
{ ctx: "ln-affine", guide: [GR("Pour quel nombre " + M("X") + " a-t-on " + M("\\ln X = 0") + " ?", 1, M("X = 1") + "."), GR(M("x") + " ?", v, M(F(v)) + ".")],
traps: [TR(-b / a, "ln X = 0 donne X = 1, pas X = 0."), TR((Math.E - b) / a, "ln X = 0 donne X = e⁰ = 1.")] }); },
() => { const t = pk([3, 4, 5, 6, 8, 10]), c = pk([[2, "double"], [3, "triple"], [1.5, "augmente de moitié"]]), q = 1 + t / 100, n = Math.ceil(Math.log(c[0]) / Math.log(q) - 1e-12), ctx = pk([["Un capital", "placé à", "capital"], ["La population d'une ville", "qui augmente de", "population"], ["Le nombre d'abonnés d'une chaîne", "qui augmente de", "abonnes"]]);
return QN(ctx[0] + " " + ctx[1] + " " + M(t + "\\,\\%") + " par an " + (c[1] === "augmente de moitié" ? "augmente de moitié" : c[1] === "double" ? "double" : "triple") + " au bout de combien d'années au minimum ? (On résout " + M(N(q) + "^n \\geqslant " + N(c[0])) + ".)", n,
M(N(q) + "^n \\geqslant " + N(c[0]) + " \\iff n\\ln " + N(q) + " \\geqslant \\ln " + N(c[0]) + " \\iff n \\geqslant \\frac{\\ln " + N(c[0]) + "}{\\ln " + N(q) + "} \\approx " + N(rnd(Math.log(c[0]) / Math.log(q), 2))) + " (car " + M("\\ln " + N(q) + " > 0") + ") : " + M("n = " + n) + ".",
{ ctx: "seuil-" + ctx[2], guide: [GR(M("\\frac{\\ln " + N(c[0]) + "}{\\ln " + N(q) + "}") + " (au centième) ?", Math.log(c[0]) / Math.log(q), M("\\approx " + N(rnd(Math.log(c[0]) / Math.log(q), 2))) + ".", 0.01), GR("Plus petit entier " + M("n") + " ?", n, M(n) + ".")],
traps: [TR(n - 1, "n doit être supérieur ou égal au quotient : on arrondit à l'entier supérieur."), TR(Math.round(100 * (c[0] - 1) / t), "Les hausses se composent (suite géométrique) : on ne divise pas simplement.")] }); },
() => { const base = pk([2, 3, 5]), p = pk([3, 4, 5, -2, -3]), m = pk([1, 2, -1]), val = base ** p, k = p * m;
const tx = p > 0 ? N(val) : "\\frac{1}{" + N(base ** -p) + "}";
return QN("Écris " + M((m === 1 ? "" : m === -1 ? "-" : m) + "\\ln " + tx) + " sous la forme " + M("k\\ln " + base) + ". Que vaut " + M("k") + " ?", k,
M(tx + " = " + base + "^{" + p + "}") + " et " + M("\\ln(a^n) = n\\ln a") + " : " + M((m === 1 ? "" : m === -1 ? "-" : m) + "\\ln " + tx + " = " + (m === 1 ? "" : m === -1 ? "-" : m + X) + NP(p) + "\\ln " + base + " = " + N(k) + "\\ln " + base) + ".",
{ ctx: "puissance", guide: [GR(M(tx) + " est " + M(base) + " à la puissance ?", p, M(p) + "."), GR(M("k") + " ?", k, M(k) + ".")],
traps: [TR(-k, "ln(1/a) = −ln a : attention au signe."), TR(rnd(val / base * m), "ln(aⁿ) = n ln a : l'exposant passe devant.")] }); },
],
3: [
() => { const [a, b] = pk([[1, 2], [1, 3], [-1, 2], [2, 3], [-1, 1]]), s = a + b, p = a * b;
return QSet("Résous " + M("(\\ln x)^2" + sg(-s) + "\\ln x" + sg(p) + " = 0") + " (on pose " + M("X = \\ln x") + "). Donne les valeurs exactes séparées par « ; ».", [Math.exp(a), Math.exp(b)],
"Avec " + M("X = \\ln x") + " : " + M("X^2" + sg(-s) + "X" + sg(p) + " = 0") + ", " + M("X = " + a) + " ou " + M("X = " + b) + ". Donc " + M("x = e^{" + a + "}") + " ou " + M("x = e^{" + b + "}") + ".",
{ ctx: "changement-variable", canon: "exp(" + a + ") ; exp(" + b + ")", guide: [FRX.GSet("Solutions en " + M("X") + " ?", [a, b], M(a + " \\,;\\, " + b) + "."), FRX.GSet("Solutions en " + M("x") + " ?", [Math.exp(a), Math.exp(b)], M("e^{" + a + "} \\,;\\, e^{" + b + "}") + ".")],
traps: [{ s: [a, b], m: "Ce sont les valeurs de X = ln x : il reste x = e^X." }, { s: [Math.exp(a)], m: "Il y a deux solutions." }] }); },
() => { const r = pk([2, 3, 4, 5, 6]), k = r * r - 1;
return QN("Résous " + M("\\ln(x - 1) + \\ln(x + 1) = \\ln " + k) + ".", r,
"Il faut " + M("x > 1") + ". Alors " + M("\\ln((x - 1)(x + 1)) = \\ln " + k) + ", " + M("x^2 - 1 = " + k) + ", " + M("x^2 = " + r * r) + ", " + M("x = " + r) + " ou " + M("x = -" + r) + " ; seule " + M("x = " + r) + " vérifie " + M("x > 1") + ".",
{ ctx: "domaine-equation", guide: [GR("Équation sans ln : " + M("x^2 = \\dots") + " ?", r * r, M("x^2 = " + r * r) + "."), GR("Solution qui vérifie " + M("x > 1") + " ?", r, M(r) + ".")],
traps: [TR(-r, "−" + r + " n'est pas dans le domaine (x − 1 > 0)."), TR((k + 1) / 2, "ln a + ln b = ln(ab), pas ln(a + b).")] }); },
() => { const u0 = pk([500, 800, 1000, 2000]), q = pk([0.9, 0.8, 0.95, 0.85]), s = pk([100, 200, 50]), n = Math.ceil(Math.log(s / u0) / Math.log(q) + 1e-12), c = pk([["Une voiture perd", "de sa valeur chaque année ; elle vaut", "€", "voiture"], ["Un lac perd", "de ses poissons chaque année ; il abrite" , "poissons", "lac"], ["Un médicament s'élimine :", "de la dose disparaît chaque heure ; il en reste", "mg", "medicament"]]);
if (s >= u0) return null;
return QN(c[0] + " " + M(N(rnd((1 - q) * 100)) + "\\,\\%") + " " + c[1] + " " + M(N(u0)) + " " + c[2] + " au départ. À partir de quel rang " + M("n") + " a-t-on " + M("u_n = " + N(u0) + X + N(q) + "^n < " + N(s)) + " ?", n,
M(N(q) + "^n < " + F(s / u0) + " \\iff n\\ln " + N(q) + " < \\ln " + F(s / u0) + " \\iff n > \\frac{\\ln " + F(s / u0) + "}{\\ln " + N(q) + "} \\approx " + N(rnd(Math.log(s / u0) / Math.log(q), 2))) + " (on divise par " + M("\\ln " + N(q) + " < 0") + " : le sens change) : " + M("n = " + n) + ".",
{ ctx: "seuil-" + c[3], guide: [GR(M("\\frac{\\ln " + F(s / u0) + "}{\\ln " + N(q) + "}") + " (au centième) ?", Math.log(s / u0) / Math.log(q), M("\\approx " + N(rnd(Math.log(s / u0) / Math.log(q), 2))) + ".", 0.01), GR(M("n") + " ?", n, M(n) + ".")],
traps: [TR(n - 1, "Au rang " + (n - 1) + ", on n'est pas encore sous " + s + "."), TR(Math.floor(Math.log(u0 / s) / Math.log(q)), "ln " + N(q).replace("{,}", ",") + " < 0 : en divisant, le sens de l'inégalité change.")] }); },
],
};


const angT = (k, d) => { const g = g2(k, d) || 1; k /= g; d /= g; if (!k) return ["0", "0"]; const s = k < 0 ? "-" : "", a = Math.abs(k); return d === 1 ? [s + (a === 1 ? "" : a) + "\\pi", s + (a === 1 ? "" : a) + "π"] : [s + "\\frac{" + (a === 1 ? "" : a) + "\\pi}{" + d + "}", s + (a === 1 ? "" : a) + "π/" + d]; };
const TF = {
1: [
() => { const a = nz(-5, 5), b = nz(-5, 5), e = a + "*cos(x)" + (b > 0 ? "+" : "-") + Math.abs(b) + "*sin(x)";
return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = " + co(a, "\\sin x") + (b < 0 ? " + " : " - ") + co(Math.abs(b), "\\cos x")) + ". Tape « sin(x) » et « cos(x) ».", e,
M("(\\sin x)' = \\cos x") + " et " + M("(\\cos x)' = -\\sin x") + " : " + M("f'(x) = " + co(a, "\\cos x") + (b > 0 ? " + " : " - ") + co(Math.abs(b), "\\sin x")) + ".",
{ ctx: "derivee", guide: [GX("Dérivée de " + M(co(a, "\\sin x")) + " ?", a + "*cos(x)", M(co(a, "\\cos x")) + "."), GX(M("f'(x)") + " ?", e, M(co(a, "\\cos x") + (b > 0 ? " + " : " - ") + co(Math.abs(b), "\\sin x")) + ".")],
traps: [TX(a + "*cos(x)" + (b > 0 ? "-" : "+") + Math.abs(b) + "*sin(x)", "(cos x)' = −sin x : attention au signe."), TX(-a + "*cos(x)" + (b > 0 ? "+" : "-") + Math.abs(b) + "*sin(x)", "(sin x)' = cos x, sans signe moins.")] }); },
() => { const [vt, vs, vv] = pk([["\\frac{1}{2}", "1/2", 0.5], ["-\\frac{1}{2}", "-1/2", -0.5], ["\\frac{\\sqrt{2}}{2}", "√2/2", Math.SQRT2 / 2], ["-\\frac{\\sqrt{3}}{2}", "-√3/2", -Math.sqrt(3) / 2], ["\\frac{\\sqrt{3}}{2}", "√3/2", Math.sqrt(3) / 2]]);
const a = Math.asin(vv), s1 = ((a % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI), s2 = ((Math.PI - a) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI), txt = (t) => { const k = Math.round((t * 6) / Math.PI); if (Math.abs((k * Math.PI) / 6 - t) < 1e-9) return angT(k, 6); const k4 = Math.round((t * 4) / Math.PI); return angT(k4, 4); };
return QSet("Résous " + M("\\sin x = " + vt) + " sur " + M("[0 \\,;\\, 2\\pi[") + ". Sépare les solutions par « ; » (avec π).", [s1, s2],
"Deux points du cercle ont pour ordonnée " + M(vt) + ", symétriques par rapport à l'axe des ordonnées : " + M("x = " + txt(s1)[0]) + " et " + M("x = " + txt(s2)[0]) + " (" + M("\\pi - x") + ").",
{ ctx: "equation-sin", canon: [s1, s2].map((t) => txt(t)[1]).join(" ; "), guide: [GR("Une solution ?", Math.min(s1, s2), M(txt(Math.min(s1, s2))[0]) + "."), FRX.GSet("Les deux ?", [s1, s2], M(txt(s1)[0] + " \\,;\\, " + txt(s2)[0]) + ".")],
traps: [{ s: [s1], m: "Deux points du cercle ont cette ordonnée." }, { s: [a, -a].map((t) => ((t % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)), m: "Pour le sinus, l'autre solution est π − x (pas −x)." }] }); },
() => { const a = nz(-4, 4), b = nz(-5, 5), [k, d] = pk([[1, 6], [1, 4], [1, 3], [1, 2], [2, 3]]), t = (2 * k * Math.PI) / d, c = rnd(Math.cos(t), 9), v = rnd(a * c + b, 9);
const ct = Math.abs(c) < 1e-9 ? "0" : Math.abs(Math.abs(c) - 0.5) < 1e-9 ? (c < 0 ? "-" : "") + "\\frac{1}{2}" : Math.abs(Math.abs(c) - 1) < 1e-9 ? (c < 0 ? "-1" : "1") : null; if (!ct) return null;
return QN("Soit " + M("f(x) = " + co(a, "\\cos(2x)") + sg(b)) + ". Calcule " + M("f\\left(" + angT(k, d)[0] + "\\right)") + ".", v,
M("2" + X + angT(k, d)[0] + " = " + angT(2 * k, d)[0]) + " et " + M("\\cos\\left(" + angT(2 * k, d)[0] + "\\right) = " + ct) + " : " + M("f = " + N(a) + X + "(" + ct + ")" + sg(b) + " = " + F(v)) + ".",
{ ctx: "valeur", guide: [GR(M("\\cos\\left(" + angT(2 * k, d)[0] + "\\right)") + " ?", c, M(ct) + "."), GR("Valeur de " + M("f") + " ?", v, M(F(v)) + ".")],
traps: [TR(rnd(a * Math.cos((k * Math.PI) / d) + b, 9), "On calcule cos(2x) : double d'abord l'angle."), TR(rnd(2 * a * Math.cos((k * Math.PI) / d) + b, 9), "cos(2x) n'est pas 2 cos x.")] }); },
],
2: [
() => { const fn = pk(["sin", "cos"]), a = nz(-4, 5), b = nz(-3, 3), k = pk([1, 2, 3, -2]), arg = (a === 1 ? "x" : a === -1 ? "-x" : a + "x") + sg(b);
const e = fn === "sin" ? (k * a) + "*cos(" + linE(a, b) + ")" : (-k * a) + "*sin(" + linE(a, b) + ")";
return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = " + co(k, "\\" + fn + "(" + arg + ")")) + ".", e,
M("(\\" + fn + "(ax + b))' = " + (fn === "sin" ? "a\\cos(ax + b)" : "-a\\sin(ax + b)")) + " : " + M("f'(x) = " + (fn === "sin" ? N(k * a) + "\\cos(" + arg + ")" : N(-k * a) + "\\sin(" + arg + ")")) + ".",
{ ctx: "derivee-compose-" + fn, guide: [GR("Par quel nombre multiplie-t-on (dérivée de " + M(arg) + ") ?", a, M(N(a)) + "."), GX(M("f'(x)") + " ?", e, M(fn === "sin" ? N(k * a) + "\\cos(" + arg + ")" : N(-k * a) + "\\sin(" + arg + ")") + ".")],
traps: [TX(fn === "sin" ? k + "*cos(" + linE(a, b) + ")" : -k + "*sin(" + linE(a, b) + ")", "Composée : on multiplie aussi par la dérivée de " + arg.replace(/\\/g, "") + ", soit " + a + "."), TX(fn === "sin" ? (-k * a) + "*cos(" + linE(a, b) + ")" : (k * a) + "*sin(" + linE(a, b) + ")", fn === "sin" ? "(sin u)' = u' cos u, sans moins." : "(cos u)' = −u' sin u.")] }); },
() => { const kk = pk([2, 3, 4, 5, 6]), fn = pk(["sin", "cos"]), a = pk([1, 2, 3, -2]), v = (2 * Math.PI) / kk;
return QV("Quelle est la plus petite période positive de " + M("f(x) = " + co(a, "\\" + fn + "(" + kk + "x)")) + " ? (valeur exacte, avec π)", v, "2π/" + kk === "2π/2" ? "π" : (kk % 2 === 0 ? (kk === 2 ? "π" : "π/" + kk / 2) : "2π/" + kk),
M("\\" + fn) + " est " + M("2\\pi") + "-périodique ; " + M("\\" + fn + "(" + kk + "(x + T)) = \\" + fn + "(" + kk + "x + " + kk + "T)") + " : il faut " + M(kk + "T = 2\\pi") + ", " + M("T = \\frac{2\\pi}{" + kk + "}" + (kk % 2 === 0 ? " = " + (kk === 2 ? "\\pi" : "\\frac{\\pi}{" + kk / 2 + "}") : "")) + ".",
{ ctx: "periode-" + fn, guide: [GR("Résous " + M(kk + "T = 2\\pi") + " : " + M("T") + " ?", v, M("\\frac{2\\pi}{" + kk + "}") + ".")],
traps: [TR(2 * Math.PI * kk, "La période est 2π divisé par " + kk + "."), TR(2 * Math.PI, "Le " + kk + " devant x accélère les oscillations : la période diminue.")] }); },
() => { const fn = pk(["cos", "sin"]), [vt, vv, kc, dc, ks, ds] = pk([["\\frac{1}{2}", 0.5, 1, 3, 1, 6], ["\\frac{\\sqrt{2}}{2}", Math.SQRT2 / 2, 1, 4, 1, 4], ["\\frac{\\sqrt{3}}{2}", Math.sqrt(3) / 2, 1, 6, 1, 3], ["0", 0, 1, 2, 0, 1]]), ge = R.rand() < 0.5, k = fn === "cos" ? kc : ks, d = fn === "cos" ? dc : ds;
if (fn === "sin" && !k) return null;
let ivs, can;
if (fn === "cos") { const a = (k * Math.PI) / d; ivs = ge ? [[-a, true, a, true]] : [[-Math.PI, false, -a, false], [a, false, Math.PI, true]]; can = ge ? "[" + angT(-k, d)[1] + " ; " + angT(k, d)[1] + "]" : "]-π ; " + angT(-k, d)[1] + "[ ∪ ]" + angT(k, d)[1] + " ; π]"; }
else { const a = (k * Math.PI) / d, a2 = ((d - k) * Math.PI) / d; ivs = ge ? [[a, true, a2, true]] : [[-Math.PI, false, a, false], [a2, false, Math.PI, true]]; can = ge ? "[" + angT(k, d)[1] + " ; " + angT(d - k, d)[1] + "]" : "]-π ; " + angT(k, d)[1] + "[ ∪ ]" + angT(d - k, d)[1] + " ; π]"; }
return mk("Résous " + M("\\" + fn + " x " + (ge ? "\\geqslant" : "<") + " " + vt) + " sur " + M("]-\\pi \\,;\\, \\pi]") + ". Donne un intervalle ou une réunion d'intervalles (avec π).", solsetSpec(ivs),
"On lit sur le cercle trigonométrique les points dont " + (fn === "cos" ? "l'abscisse" : "l'ordonnée") + " est " + (ge ? "supérieure ou égale à " : "strictement inférieure à ") + M(vt) + " : " + M("S = " + can.replace(/π/g, "\\pi ").replace(/∪/g, "\\cup")) + ".",
{ ctx: "inequation-" + fn, canon: can, guide: [GR("Valeur positive de " + M("x") + " (dans " + M("[0 \\,;\\, \\pi]") + ") où " + M("\\" + fn + " x = " + vt) + " ?", (k * Math.PI) / d, M(angT(k, d)[0]) + "."), { ask: "Ensemble des solutions ?", spec: solsetSpec(ivs), sol: M("S = " + can.replace(/π/g, "\\pi ").replace(/∪/g, "\\cup")) + "." }],
traps: [TS(fn === "cos" ? (ge ? [[-Math.PI, false, -(k * Math.PI) / d, true], [(k * Math.PI) / d, true, Math.PI, true]] : [[-(k * Math.PI) / d, false, (k * Math.PI) / d, false]]) : (ge ? [[-Math.PI, false, (k * Math.PI) / d, true]] : [[(k * Math.PI) / d, false, Math.PI - (k * Math.PI) / d, false]]), "Tu as pris le complémentaire : vérifie le sens de l'inégalité sur le cercle.")] }); },
],
3: [
() => { const [a, c, at, ae] = pk([[1, 2, "x", "1"], [Math.SQRT2, 2, "\\sqrt{2}x", "sqrt(2)"], [Math.sqrt(3), 2, "\\sqrt{3}x", "sqrt(3)"], [1, 1, "x", "1"], [2, 4, "2x", "2"]]);
const s = a / c; const x1 = Math.asin(s), x2 = Math.PI - x1, txt = (t) => { for (const d of [6, 4, 3, 2]) { const k = Math.round((t * d) / Math.PI); if (Math.abs((k * Math.PI) / d - t) < 1e-9) return angT(k, d); } return ["?", "?"]; };
const S = Math.abs(x1 - x2) < 1e-9 ? [x1] : [x1, x2];
return mk("Soit " + M("f(x) = " + at + " + " + (c === 1 ? "" : c) + "\\cos x") + " sur " + M("[0 \\,;\\, \\pi]") + ". En quelles valeurs " + M("f'") + " s'annule-t-elle ? Sépare-les par « ; » (avec π).", { kind: "set", values: S },
M("f'(x) = " + at.replace("x", "") + (at === "x" ? "1" : "") + " - " + (c === 1 ? "" : c) + "\\sin x") + " ; " + M("f'(x) = 0 \\iff \\sin x = " + (Math.abs(s - Math.SQRT2 / 2) < 1e-9 ? "\\frac{\\sqrt{2}}{2}" : Math.abs(s - Math.sqrt(3) / 2) < 1e-9 ? "\\frac{\\sqrt{3}}{2}" : F(s))) + " : " + S.map((t) => M("x = " + txt(t)[0])).join(" et ") + ". " + (S.length === 1 ? M("f'(x) \\geqslant 0") + " : " + M("f") + " est croissante (tangente horizontale en " + M("\\frac{\\pi}{2}") + ")." : M("f") + " est croissante, décroissante puis croissante."),
{ ctx: "etude", canon: S.map((t) => txt(t)[1]).join(" ; "), guide: [GX(M("f'(x)") + " ?", ae + "-" + c + "*sin(x)", M(at.replace("x", "") + (at === "x" ? "1" : "") + " - " + (c === 1 ? "" : c) + "\\sin x") + "."), GR(M("\\sin x") + " = ?", s, "Valeur exacte " + M("\\approx " + N(rnd(s, 3))) + "."), FRX.GSet("Valeurs de " + M("x") + " ?", S, S.map((t) => M(txt(t)[0])).join(" ; ") + ".")],
traps: [{ s: [Math.acos(s), -Math.acos(s)].filter((t) => t >= 0), m: "(cos x)' = −sin x : on résout sin x = " + FS(s) + "." }, { s: [x1], m: "Sur [0 ; π], sin x = " + FS(s) + " a deux solutions : x et π − x." }] }); },
() => { const [vt, vv] = pk([["\\frac{1}{2}", 0.5], ["-\\frac{1}{2}", -0.5], ["\\frac{\\sqrt{2}}{2}", Math.SQRT2 / 2], ["0", 0], ["1", 1]]), kk = pk([2, 3]), fn = pk(["cos", "sin"]);
const n = Math.abs(vv) === 1 ? kk : 2 * kk;
return QN("Combien de solutions l'équation " + M("\\" + fn + "(" + kk + "x) = " + vt) + " a-t-elle sur " + M("[0 \\,;\\, 2\\pi[") + " ?", n,
"Quand " + M("x") + " parcourt " + M("[0 \\,;\\, 2\\pi[") + ", " + M(kk + "x") + " parcourt " + M("[0 \\,;\\, " + 2 * kk + "\\pi[") + ", soit " + kk + " tours du cercle. Sur un tour, " + M("\\" + fn + " X = " + vt) + " a " + (Math.abs(vv) === 1 ? "1 solution" : "2 solutions") + " : en tout " + n + ".",
{ ctx: "nb-solutions-" + fn, guide: [GR("Combien de tours de cercle parcourt " + M(kk + "x") + " ?", kk, M(kk) + "."), GR("Nombre de solutions ?", n, M(n) + ".")],
traps: [TR(Math.abs(vv) === 1 ? 1 : 2, "Avec " + kk + "x, on fait " + kk + " tours : plus de solutions."), TR(2 * kk + (Math.abs(vv) === 1 ? 0 : 2), "Compte les solutions sur un tour, puis multiplie par " + kk + ".")] }); },
() => { const k = pk([2, 3, 4, 5, -2, 0.5]), fn = pk(["sin", "tan"]), v = k;
return QN("Calcule " + M("\\lim_{x \\to 0} \\frac{\\sin(" + (k === 1 ? "" : N(k)) + "x)}{x}") + " (on rappelle que " + M("\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1") + ", nombre dérivé de " + M("\\sin") + " en 0).", v,
M("\\frac{\\sin(" + N(k) + "x)}{x} = " + N(k) + X + "\\frac{\\sin(" + N(k) + "x)}{" + N(k) + "x}") + " et " + M("\\frac{\\sin X}{X} \\to 1") + " quand " + M("X \\to 0") + " : la limite vaut " + M(N(k)) + ".",
{ ctx: "limite", guide: [GR("Par quel nombre faut-il multiplier et diviser ?", k, M(N(k)) + "."), GR("Limite ?", v, M(N(v)) + ".")],
traps: [TR(1, "Le " + N(k).replace("{,}", ",") + " compte : sin(kx)/x ≈ kx/x = k."), TR(rnd(1 / k), "sin(kx) ≈ kx près de 0 : k au numérateur.")] }); },
],
};


const tab = (xs, ys) => M("\\begin{array}{c|" + "c".repeat(2 * xs.length - 1) + "} x & " + xs.join(" & & ") + " \\\\ \\hline f(x) & " + ys.map((y, i) => y + (i < ys.length - 1 ? " & " + (typeof ys[i + 1] === "string" ? (ys[i + 1].includes("+") ? "\\nearrow" : "\\searrow") : (typeof y === "string" ? (y.includes("+") ? "\\searrow" : "\\nearrow") : (ys[i + 1] > y ? "\\nearrow" : "\\searrow"))) : "")).join(" & ") + " \\end{array}");
const TVI = {
1: [
() => { const c = pk([2, 3, 5, 7, 10, 20]), r = Math.cbrt(c), n = Math.floor(r); if (Math.abs(r - Math.round(r)) < 1e-9) return null;
return QN("La fonction " + M("f(x) = x^3") + " est continue et strictement croissante sur " + M("\\mathbb{R}") + ". L'équation " + M("x^3 = " + c) + " a une unique solution " + M("\\alpha") + ". Quel est l'entier " + M("n") + " tel que " + M("n < \\alpha < n + 1") + " ?", n,
M(n + "^3 = " + n ** 3 + " < " + c) + " et " + M((n + 1) + "^3 = " + (n + 1) ** 3 + " > " + c) + " : d'après le théorème des valeurs intermédiaires (fonction continue strictement croissante), " + M(n + " < \\alpha < " + (n + 1)) + ".",
{ ctx: "encadrement-cube", guide: [GR(M((n + 1) + "^3") + " ?", (n + 1) ** 3, M((n + 1) ** 3) + " (plus grand que " + c + ")."), GR(M("n") + " ?", n, M(n) + ".")],
traps: [TR(n + 1, "(" + (n + 1) + ")³ = " + (n + 1) ** 3 + " dépasse déjà " + c + " : α est avant " + (n + 1) + "."), TR(Math.round(c / 3), "On cherche α tel que α³ = " + c + ", pas 3α.")] }); },
() => { const a = R.int(-2, 1), b = a + R.int(2, 4), fa = -R.int(2, 9), fb = R.int(2, 9), inc = R.rand() < 0.5, ys = inc ? [fa, fb] : [fb, fa], n = fb - fa + 1;
return QN(M("f") + " est continue et strictement " + (inc ? "croissante" : "décroissante") + " sur " + M("[" + a + " \\,;\\, " + b + "]") + ", avec " + M("f(" + a + ") = " + ys[0]) + " et " + M("f(" + b + ") = " + ys[1]) + ". Pour combien d'entiers " + M("k") + " l'équation " + M("f(x) = k") + " a-t-elle une solution dans " + M("[" + a + " \\,;\\, " + b + "]") + " ?", n,
"D'après le théorème des valeurs intermédiaires, " + M("f") + " (continue) prend toutes les valeurs entre " + M(fa) + " et " + M(fb) + ", et seulement celles-là (monotone). Entiers de " + M(fa) + " à " + M(fb) + " : " + M(fb + " - (" + fa + ") + 1 = " + n) + ".",
{ ctx: "entiers-atteints", guide: [GR("Plus petit entier atteint ?", fa, M(fa) + "."), GR("Plus grand ?", fb, M(fb) + "."), GR("Combien d'entiers de " + M(fa) + " à " + M(fb) + " ?", n, M(n) + ".")],
traps: [TR(n - 1, "Les deux bornes " + fa + " et " + fb + " comptent (atteintes en " + a + " et " + b + ")."), TR(fb - fa - 1, "f(" + a + ") et f(" + b + ") sont des valeurs atteintes.")] }); },
() => { const [fx, f, lo, hi] = pk([["x^3 - 2x - 5", (x) => x ** 3 - 2 * x - 5, 2, 3], ["x^3 + x - 3", (x) => x ** 3 + x - 3, 1, 2], ["x^3 - 3x - 1", (x) => x ** 3 - 3 * x - 1, 1, 2], ["x^3 + 2x - 7", (x) => x ** 3 + 2 * x - 7, 1, 2]]), m = (lo + hi) / 2, fm = f(m), nl = fm < 0 ? m : lo;
return QN("On cherche la solution " + M("\\alpha") + " de " + M(fx + " = 0") + " par dichotomie. On sait que " + M("f(" + lo + ") < 0") + " et " + M("f(" + hi + ") > 0") + ". On calcule " + M("f(" + N(m) + ")") + ". Quelle est la borne gauche du nouvel intervalle qui contient " + M("\\alpha") + " ?", nl,
M("f(" + N(m) + ") = " + N(rnd(fm, 4))) + (fm < 0 ? " < 0 : la solution est entre " + M(N(m)) + " et " + M(hi) : " > 0 : la solution est entre " + M(lo) + " et " + M(N(m))) + ". Borne gauche : " + M(N(nl)) + ".",
{ ctx: "dichotomie", shownOk: true, guide: [GR(M("f(" + N(m) + ")") + " (au millième) ?", fm, M("\\approx " + N(rnd(fm, 3))) + ".", 0.001), GR("Borne gauche ?", nl, M(N(nl)) + ".")],
traps: [TR(fm < 0 ? lo : m, "On garde la moitié où f change de signe."), TR(hi, "C'est la borne droite.")] }); },
],
2: [
() => { const c = pk([3, 5, 6, 9, 12, 15]) , f = (x) => x ** 3 + x - c; let lo = 0; while (f(lo + 1) < 0) lo++; let x = lo; while (f(rnd(x + 0.1, 6)) < 0) x = rnd(x + 0.1, 6);
if (Math.abs(f(x)) < 1e-9 || Math.abs(f(rnd(x + 0.1, 6))) < 1e-9) return null;
return QN("L'équation " + M("x^3 + x = " + c) + " a une unique solution " + M("\\alpha") + " (fonction continue strictement croissante). Donne la valeur approchée de " + M("\\alpha") + " par défaut au dixième (balayage avec la calculatrice).", x,
"On tabule " + M("f(x) = x^3 + x - " + c) + " avec un pas de 0,1 : " + M("f(" + N(x) + ") \\approx " + N(rnd(f(x), 3)) + " < 0") + " et " + M("f(" + N(rnd(x + 0.1, 6)) + ") \\approx " + N(rnd(f(x + 0.1), 3)) + " > 0") + ", donc " + M(N(x) + " < \\alpha < " + N(rnd(x + 0.1, 6))) + ". Valeur par défaut : " + M(N(x)) + ".",
{ ctx: "balayage", guide: [GR("Entier " + M("n") + " tel que " + M("n < \\alpha < n + 1") + " ?", lo, M(lo) + "."), GR("Valeur par défaut au dixième ?", x, M(N(x)) + ".")],
traps: [TR(rnd(x + 0.1, 6), "C'est la valeur par excès : par défaut = la borne inférieure."), TR(lo, "Au dixième : il faut une décimale.")] }); },
() => { const k = pk([3, 4, 5, 6, 8, 10]), f = (x) => Math.exp(x) + x - k; let n = -1; while (f(n + 1) < 0) n++;
return QN("La fonction " + M("f(x) = e^x + x") + " est continue et strictement croissante sur " + M("\\mathbb{R}") + ". L'équation " + M("e^x + x = " + k) + " a une unique solution " + M("\\alpha") + ". Quel est l'entier " + M("n") + " tel que " + M("n < \\alpha < n + 1") + " ?", n,
M("f(" + n + ") = e^{" + n + "} + " + n + " \\approx " + N(rnd(f(n) + k, 2)) + " < " + k) + " et " + M("f(" + (n + 1) + ") \\approx " + N(rnd(f(n + 1) + k, 2)) + " > " + k) + " : " + M(n + " < \\alpha < " + (n + 1)) + ".",
{ ctx: "encadrement-exp", guide: [GR(M("e^{" + (n + 1) + "} + " + (n + 1)) + " (au centième) ?", f(n + 1) + k, M("\\approx " + N(rnd(f(n + 1) + k, 2))) + ".", 0.01), GR(M("n") + " ?", n, M(n) + ".")],
traps: [TR(n + 1, "f(" + (n + 1) + ") dépasse déjà " + k + "."), TR(Math.round(Math.log(k)), "Le terme + x compte aussi.")] }); },
() => { const k = R.int(-6, 6), a = -R.int(3, 8), b = R.int(3, 8);
if (k === a || k === b) return null;
let n = 0; const ys = ["-\\infty", b, a, "+\\infty"]; const vals = [-Infinity, Math.max(a, b), Math.min(a, b), Infinity];
for (let i = 0; i < 3; i++) { const u = vals[i], w = vals[i + 1]; if ((k > Math.min(u, w) && k < Math.max(u, w))) n++; }
return QN("Une fonction " + M("f") + " continue sur " + M("\\mathbb{R}") + " a pour tableau de variations " + tab(["-\\infty", -1, 2, "+\\infty"], ys) + ". Combien de solutions l'équation " + M("f(x) = " + k) + " a-t-elle ?", n,
"Sur chaque intervalle où " + M("f") + " est strictement monotone, elle prend une seule fois chaque valeur comprise entre ses limites ou valeurs aux bornes. " + M(k) + " est atteint sur " + n + " des trois intervalles : " + n + " solution" + (n > 1 ? "s" : "") + ".",
{ ctx: "tableau-limites", guide: [GR("Sur combien des trois intervalles " + M(k) + " est-il atteint ?", n, M(n) + ".")],
traps: [TR(n === 3 ? 1 : 3, "Regarde chaque flèche : " + k + " est-il entre ses deux extrémités ?"), TR(n === 1 ? 2 : 1, "Une flèche vers +∞ (ou −∞) atteint toutes les valeurs au-delà de son départ.")] }); },
],
3: [
() => { const [fx, l, f] = pk([["\\sqrt{2u_n + 3}", 3, (x) => Math.sqrt(2 * x + 3)], ["\\sqrt{u_n + 6}", 3, (x) => Math.sqrt(x + 6)], ["\\sqrt{3u_n + 4}", 4, (x) => Math.sqrt(3 * x + 4)]]);
return QN("La suite " + M("(u_n)") + " est définie par " + M("u_0 = 1") + " et " + M("u_{n+1} = " + fx) + ". On admet qu'elle converge vers " + M("\\ell") + ". Comme la fonction est continue, " + M("\\ell") + " vérifie " + M("\\ell = f(\\ell)") + ". Que vaut " + M("\\ell") + " ?", l,
"On résout " + M("\\ell = f(\\ell)") + " avec " + M("\\ell \\geqslant 0") + " : on élève au carré, on obtient une équation du second degré dont la racine positive est " + M(l) + ".",
{ ctx: "point-fixe", guide: [GR("Valeur de " + M("u_1") + " (au centième) ?", f(1), M("\\approx " + N(rnd(f(1), 2))) + ".", 0.01), GR(M("\\ell") + " ?", l, M(l) + ".")],
traps: [TR(-1, "Une racine carrée est positive : la solution négative de l'équation est exclue."), TR(rnd(f(1), 2), "C'est u₁ : on cherche la limite.")] }); },
() => { const k = R.int(-4, 4), n = Math.abs(k) < 2 ? 3 : Math.abs(k) === 2 ? 2 : 1;
return QN("Combien de solutions l'équation " + M("x^3 - 3x = " + k) + " a-t-elle sur " + M("\\mathbb{R}") + " ? (Étudie les variations de " + M("f(x) = x^3 - 3x") + ".)", n,
M("f'(x) = 3x^2 - 3") + " s'annule en " + M("-1") + " et " + M("1") + " ; " + M("f(-1) = 2") + " (maximum local), " + M("f(1) = -2") + " (minimum local), limites " + M("-\\infty") + " et " + M("+\\infty") + ". " + (n === 3 ? M(k) + " est entre −2 et 2 : une solution sur chaque intervalle, 3 en tout." : n === 2 ? M(k) + " est un extremum local : deux solutions (dont une double)." : M(k) + " est hors de [−2 ; 2] : une seule solution."),
{ ctx: "nb-cubique", guide: [GR("Maximum local " + M("f(-1)") + " ?", 2, M(2) + "."), GR("Minimum local " + M("f(1)") + " ?", -2, M(-2) + "."), GR("Nombre de solutions ?", n, M(n) + ".")],
traps: [TR(n === 3 ? 1 : 3, "Compare " + k + " aux valeurs des extremums locaux 2 et −2."), TR(n === 1 ? 2 : 1, "Sur chaque intervalle de monotonie, au plus une solution.")] }); },
() => { const c = pk([2, 3, 4]), f = (x) => Math.log(x) + x - c; let lo = 0.01, hi = 10; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (f(m) < 0) lo = m; else hi = m; } const r = lo;
return QR("L'équation " + M("\\ln x + x = " + c) + " a une unique solution " + M("\\alpha") + " sur " + M("]0 \\,;\\, +\\infty[") + ". Donne une valeur approchée de " + M("\\alpha") + " à 0,01 près.", r, 0.01,
M("f(x) = \\ln x + x - " + c) + " est continue et strictement croissante. Par balayage (ou dichotomie) : " + M("\\alpha \\approx " + N(rnd(r, 2))) + ".",
{ ctx: "ln-x", guide: [GR("Entier " + M("n") + " tel que " + M("n < \\alpha < n + 1") + " ?", Math.floor(r), M(Math.floor(r)) + "."), GR(M("\\alpha") + " à 0,01 près ?", r, M("\\approx " + N(rnd(r, 2))) + ".", 0.01)],
traps: [TR(rnd(Math.exp(c), 2), "e^" + c + " résout ln x = " + c + " seulement ; il y a aussi + x."), TR(c, "Le ln compte : ln " + c + " + " + c + " ≠ " + c + ".")] }); },
],
};


const SV = {
1: [
() => { const e1 = pk([2, 3.5, 4, -1, 1.5]), e2 = pk([5, 2.5, -2, 6, 1]), a = pk([1, 2, 3]), b = pk([1, -1, 2]), v = rnd(a * e1 + b * e2);
return QN("On sait que " + M("E(X) = " + N(e1)) + " et " + M("E(Y) = " + N(e2)) + ". Calcule " + M("E(" + (a === 1 ? "" : a) + "X " + (b < 0 ? "-" : "+") + " " + (Math.abs(b) === 1 ? "" : Math.abs(b)) + "Y)") + ".", v,
"L'espérance est linéaire : " + M("E(aX + bY) = aE(X) + bE(Y) = " + a + X + NP(e1) + sg(b) + X + NP(e2) + " = " + N(v)) + " (sans hypothèse d'indépendance).",
{ ctx: "esperance-somme", guide: [GR(M("aE(X) + bE(Y)") + " ?", v, M(N(v)) + ".")],
traps: [TR(rnd(e1 + e2), "Multiplie par les coefficients " + a + " et " + b + "."), TR(rnd(a * e1 - b * e2), "Attention au signe devant Y.")] }); },
() => { const v1 = pk([2, 4, 1.5, 3, 6]), v2 = pk([1, 5, 2.5, 4]), a = pk([1, 2, 3, -1, -2]), v = rnd(a * a * v1 + v2);
return QN(M("X") + " et " + M("Y") + " sont indépendantes, avec " + M("V(X) = " + N(v1)) + " et " + M("V(Y) = " + N(v2)) + ". Calcule " + M("V(" + (a === 1 ? "" : a === -1 ? "-" : a) + "X + Y)") + ".", v,
"Indépendantes : " + M("V(aX + Y) = a^2V(X) + V(Y) = " + a * a + X + N(v1) + " + " + N(v2) + " = " + N(v)) + ".",
{ ctx: "variance-somme", guide: [GR(M("V(" + (a === 1 ? "" : a === -1 ? "-" : a) + "X) = a^2V(X)") + " ?", rnd(a * a * v1), M(N(rnd(a * a * v1))) + "."), GR("Somme ?", v, M(N(v)) + ".")],
traps: [TR(rnd(a * v1 + v2), "V(aX) = a²V(X) : le coefficient est au carré."), TR(rnd(a * a * v1 - v2), "Les variances s'ajoutent toujours (variables indépendantes).")] }); },
() => { const mu = pk([10, 50, 3.5, 12, 0.4]), s2 = pk([4, 9, 16, 25, 36]), n = pk([4, 9, 16, 25, 100]), v = rnd(s2 / n);
return QN("On répète " + M(n) + " fois, de façon indépendante, une expérience dont le résultat " + M("X") + " vérifie " + M("E(X) = " + N(mu)) + " et " + M("V(X) = " + s2) + ". Soit " + M("M_n") + " la moyenne des " + n + " résultats. Calcule " + M("V(M_n)") + ".", v,
M("V(M_n) = \\frac{V(X)}{n} = \\frac{" + s2 + "}{" + n + "} = " + N(v)) + " (et " + M("E(M_n) = " + N(mu)) + ").",
{ ctx: "moyenne-echantillon", guide: [GR(M("V(X_1 + \\dots + X_n) = nV(X)") + " ?", n * s2, M(N(n * s2)) + "."), GR(M("V(M_n) = \\frac{1}{n^2}V(X_1 + \\dots + X_n)") + " ?", v, M(N(v)) + ".")],
traps: [TR(s2, "La moyenne varie moins que X : on divise par n."), TR(rnd(s2 / Math.sqrt(n)), "V(M_n) = V(X)/n ; c'est l'écart type qui est divisé par √n.")] }); },
],
2: [
() => { const n = pk([20, 50, 100, 200]), p = pk([0.1, 0.2, 0.25, 0.4, 0.5]), what = pk(["E", "V"]), v = what === "E" ? rnd(n * p) : rnd(n * p * (1 - p)), c = pk([["On lance", "fois une pièce truquée qui tombe sur pile avec la probabilité", "piles", "piece"], ["Un serveur reçoit", "requêtes ; chacune échoue indépendamment avec la probabilité", "échecs", "serveur"], ["On interroge", "personnes ; chacune a voté avec la probabilité", "votants", "sondage"]]);
return QN(c[0] + " " + M(n) + " " + c[1] + " " + M(N(p)) + ". On note " + M("S = X_1 + \\dots + X_n") + " le nombre " + (/^[aeéiou]/.test(c[2]) ? "d'" : "de ") + c[2] + " (" + M("X_i") + " de Bernoulli). Calcule " + M(what + "(S)") + ".", v,
(what === "E" ? M("E(S) = nE(X_1) = np = " + n + X + N(p) + " = " + N(v)) : M("V(S) = nV(X_1) = np(1 - p) = " + n + X + N(p) + X + N(rnd(1 - p)) + " = " + N(v)) + " (les " + M("X_i") + " sont indépendantes)") + ".",
{ ctx: "bernoulli-" + c[3], guide: [GR((what === "E" ? M("E(X_1) = p") : M("V(X_1) = p(1 - p)")) + " ?", what === "E" ? p : rnd(p * (1 - p)), M(N(what === "E" ? p : rnd(p * (1 - p)))) + "."), GR(M(what + "(S)") + " ?", v, M(N(v)) + ".")],
traps: [TR(what === "E" ? rnd(n * p * (1 - p)) : rnd(n * p), what === "E" ? "C'est la variance : E(S) = np." : "C'est l'espérance : V(S) = np(1 − p)."), TR(what === "E" ? p : rnd(p * (1 - p)), "On additionne n variables : on multiplie par n.")] }); },
() => { const mu = pk([50, 100, 20, 200]), s2 = pk([4, 9, 16, 25, 36]), d = pk([4, 5, 6, 10]), v = rnd(s2 / (d * d)); if (v >= 1) return null;
return QN("Une variable " + M("X") + " vérifie " + M("E(X) = " + mu) + " et " + M("V(X) = " + s2) + ". D'après l'inégalité de Bienaymé-Tchebychev, quel majorant obtient-on pour " + M("P(|X - " + mu + "| \\geqslant " + d + ")") + " ?", v,
M("P(|X - E(X)| \\geqslant \\delta) \\leqslant \\frac{V(X)}{\\delta^2} = \\frac{" + s2 + "}{" + d * d + "} = " + N(v)) + ".",
{ ctx: "bienayme", guide: [GR(M("\\delta^2") + " ?", d * d, M(d * d) + "."), GR("Majorant ?", v, M(N(v)) + ".")],
traps: [TR(rnd(s2 / d), "On divise par δ², pas par δ."), TR(rnd(Math.sqrt(s2) / d), "On utilise la variance V(X), pas l'écart type.")] }); },
() => { const k = pk([2, 3, 4, 5]), wh = pk(["E", "V"]), v = wh === "E" ? rnd(3.5 * k) : rnd((35 / 12) * k, 9);
return QN("On lance " + M(k) + " dés équilibrés à six faces et on note " + M("S") + " la somme des faces. Pour un dé, " + M("E(X) = 3{,}5") + " et " + M("V(X) = \\frac{35}{12}") + ". Calcule " + M(wh + "(S)") + (wh === "V" ? " (fraction acceptée)" : "") + ".", v,
(wh === "E" ? M("E(S) = " + k + X + "3{,}5 = " + N(v)) : M("V(S) = " + k + X + "\\frac{35}{12} = " + F(v)) + " (dés indépendants)") + ".",
{ ctx: "des-" + wh, guide: [GR(M(wh + "(S) = " + k + X + wh + "(X)") + " ?", v, M(wh === "E" ? N(v) : F(v)) + ".")],
traps: [TR(wh === "E" ? 3.5 : 35 / 12, "La somme de " + k + " dés : multiplie par " + k + "."), TR(wh === "E" ? rnd(3.5 * k * k) : rnd((35 / 12) * k * k, 9), "Pour une somme de variables indépendantes, on multiplie par " + k + ", pas par " + k * k + ".")] }); },
],
3: [
() => { const s2 = pk([1, 4, 9, 0.25]), d = pk([0.1, 0.2, 0.5, 0.05]), a = pk([0.05, 0.1, 0.01]), n = Math.ceil(s2 / (a * d * d) - 1e-9); if (n > 1e6 || n < 10) return null;
return QN("Pour la moyenne " + M("M_n") + " de " + M("n") + " résultats indépendants de même loi (variance " + M(N(s2)) + "), l'inégalité de concentration donne " + M("P(|M_n - \\mu| \\geqslant " + N(d) + ") \\leqslant \\frac{" + N(s2) + "}{n" + X + N(d) + "^2}") + ". À partir de quelle valeur de " + M("n") + " ce majorant est-il inférieur ou égal à " + M(N(a)) + " ?", n,
M("\\frac{" + N(s2) + "}{n" + X + N(rnd(d * d)) + "} \\leqslant " + N(a) + " \\iff n \\geqslant \\frac{" + N(s2) + "}{" + N(a) + X + N(rnd(d * d)) + "} = " + N(rnd(s2 / (a * d * d), 4))) + " : " + M("n = " + N(n)) + ".",
{ ctx: "concentration-n", guide: [GR(M("\\frac{" + N(s2) + "}{" + N(a) + X + N(rnd(d * d)) + "}") + " ?", s2 / (a * d * d), M(N(rnd(s2 / (a * d * d), 4))) + "."), GR(M("n") + " ?", n, M(N(n)) + ".")],
traps: [TR(Math.ceil(s2 / (a * d)), "δ est au carré : " + N(d).replace("{,}", ",") + "² = " + N(rnd(d * d)).replace("{,}", ",") + "."), TR(n - 1, "Au rang " + (n - 1) + ", le majorant dépasse encore " + N(a).replace("{,}", ",") + " : on arrondit au-dessus.")] }); },
() => { const g = pk([[[10, -2], [0.2, 0.8]], [[5, -1], [0.25, 0.75]], [[20, -3], [0.1, 0.9]], [[8, -2], [0.3, 0.7]]]), e = rnd(g[0][0] * g[1][0] + g[0][1] * g[1][1]), n = pk([10, 20, 50, 100]), v = rnd(n * e);
return QN("À un jeu, on gagne " + M(g[0][0]) + " € avec la probabilité " + M(N(g[1][0])) + " et on perd " + M(-g[0][1]) + " € sinon. On joue " + M(n) + " parties indépendantes et on note " + M("G") + " le gain total. Calcule " + M("E(G)") + " (en €).", v,
"Pour une partie : " + M("E(X) = " + g[0][0] + X + N(g[1][0]) + " + (" + g[0][1] + ")" + X + N(g[1][1]) + " = " + N(e)) + ". Par linéarité, " + M("E(G) = " + n + X + NP(e) + " = " + N(v)) + " €.",
{ ctx: "jeu-repete", guide: [GR("Espérance d'une partie ?", e, M(N(e)) + " €."), GR(M("E(G)") + " ?", v, M(N(v)) + " €.")],
traps: [TR(rnd(n * g[0][0] * g[1][0]), "Les pertes comptent aussi dans l'espérance."), TR(e, "C'est le gain moyen d'une partie : il y en a " + n + ".")] }); },
() => { const mu = pk([30, 60, 100]), s2 = pk([4, 9, 16]), d = pk([4, 5, 8, 10]), v = rnd(1 - s2 / (d * d)); if (v <= 0) return null;
return QN("Une variable " + M("X") + " vérifie " + M("E(X) = " + mu) + " et " + M("V(X) = " + s2) + ". Donne un minorant de " + M("P(" + (mu - d) + " < X < " + (mu + d) + ")") + " obtenu avec l'inégalité de Bienaymé-Tchebychev.", v,
M("P(" + (mu - d) + " < X < " + (mu + d) + ") = P(|X - " + mu + "| < " + d + ") = 1 - P(|X - " + mu + "| \\geqslant " + d + ") \\geqslant 1 - \\frac{" + s2 + "}{" + d * d + "} = " + N(v)) + ".",
{ ctx: "minoration", guide: [GR("Majorant de " + M("P(|X - " + mu + "| \\geqslant " + d + ")") + " ?", rnd(s2 / (d * d)), M(N(rnd(s2 / (d * d)))) + "."), GR("Minorant ?", v, M(N(v)) + ".")],
traps: [TR(rnd(s2 / (d * d)), "C'est le majorant de l'évènement contraire : 1 − " + N(rnd(s2 / (d * d))).replace("{,}", ",") + "."), TR(rnd(1 - s2 / d), "δ² = " + d * d + ".")] }); },
],
};


const RC = {
1: [
() => { const b = nz(-3, 4), c = nz(-5, 6);
const U = (n) => n * n + b * n + c, e = "n^2" + (b ? (b > 0 ? "+" : "") + b + "*n" : "") + (c > 0 ? "+" : "") + c;
return QX("On définit " + M("u_0 = " + c) + " et " + M("u_{n+1} = u_n + 2n" + sg(1 + b)) + ". Calcule " + M("u_1, u_2, u_3") + ", puis conjecture une expression de " + M("u_n") + " de la forme " + M("n^2 + bn + c") + " (à démontrer par récurrence).", e,
M("u_1 = " + U(1) + ", u_2 = " + U(2) + ", u_3 = " + U(3)) + ". Conjecture " + M("u_n = n^2" + (b ? sg(b) + "n" : "") + sg(c)) + ". Hérédité : " + M("u_{n+1} = n^2" + (b ? sg(b) + "n" : "") + sg(c) + " + 2n" + sg(1 + b) + " = (n + 1)^2" + (b ? sg(b) + "(n + 1)" : "") + sg(c)) + ".",
{ ctx: "conjecture-formule", guide: [GR(M("u_1") + " ?", U(1), M(U(1)) + "."), GR(M("u_2") + " ?", U(2), M(U(2)) + "."), GX(M("u_n") + " ?", e, M("n^2" + (b ? sg(b) + "n" : "") + sg(c)) + ".")],
traps: [TX("n^2+" + c, "Teste ta formule sur u₁ et u₂."), TX("2*n+" + (1 + b + c), "u_n grandit de plus en plus vite : ce n'est pas une suite arithmétique.")] }); },
() => { const [a, b, q] = pk([[2, 1, 2], [3, -2, 3], [2, -3, 2], [3, 4, 3], [5, 1, 5]]), k = b * (1 - q) , e = a * q + "*" + q + "^n" + (b > 0 ? "+" : "-") + Math.abs(b);
return QX("Par récurrence, on veut montrer que " + M("u_n = " + a + X + q + "^n" + sg(b)) + " pour la suite " + M("u_{n+1} = " + q + "u_n" + sg(k)) + ". Hérédité : on suppose " + M("u_n = " + a + X + q + "^n" + sg(b)) + ". Exprime " + M("u_{n+1} = " + q + "u_n" + sg(k)) + " en fonction de " + M("n") + ".", e,
M("u_{n+1} = " + q + "(" + a + X + q + "^n" + sg(b) + ")" + sg(k) + " = " + a + X + q + "^{n+1}" + sg(q * b + k) + " = " + a + X + q + "^{n+1}" + sg(b)) + " : la propriété est héréditaire.",
{ ctx: "heredite-geometrique", guide: [GX("Développe " + M(q + "(" + a + X + q + "^n" + sg(b) + ")") + ".", (a * q) + "*" + q + "^n+" + q * b, M(a * q + X + q + "^n" + sg(q * b)) + "."), GX(M("u_{n+1}") + " ?", e, M(a + X + q + "^{n+1}" + sg(b)) + ".")],
traps: [TX(a + "*" + q + "^n+" + b, "C'est u_n ; on calcule u_{n+1} = " + q + " u_n" + (k ? " + (" + k + ")" : "") + "."), TX(a * q + "*" + q + "^n+" + q * b, "N'oublie pas d'ajouter " + k + ".")] }); },
() => { const [S, t, e, d] = pk([["1 + 2 + \\dots + n = \\frac{n(n+1)}{2}", "1 + 2 + \\dots + n + (n + 1)", "n+1", "somme-entiers"], ["1 + 3 + 5 + \\dots + (2n - 1) = n^2", "1 + 3 + \\dots + (2n - 1) + (2n + 1)", "2*n+1", "somme-impairs"], ["1^2 + 2^2 + \\dots + n^2 = \\frac{n(n+1)(2n+1)}{6}", "1^2 + \\dots + n^2 + (n + 1)^2", "(n+1)^2", "somme-carres"]]);
return QX("On démontre par récurrence que " + M(S) + ". À l'étape d'hérédité, on passe de la somme jusqu'au rang " + M("n") + " à celle jusqu'au rang " + M("n + 1") + " (" + M(t) + ") : quel terme ajoute-t-on ? (expression en " + M("n") + ")", e,
"La somme au rang " + M("n + 1") + " est celle au rang " + M("n") + " plus le terme suivant : " + M(e.replace("*", "")) + ". On utilise ensuite l'hypothèse de récurrence pour la somme au rang " + M("n") + ".",
{ ctx: "heredite-" + d, guide: [GX("Terme ajouté ?", e, M(e.replace("*", "")) + ".")],
traps: [TX(d === "somme-impairs" ? "2*n-1" : d === "somme-carres" ? "n^2" : "n", "C'est le dernier terme de la somme au rang n ; on ajoute le suivant."), TX(d === "somme-entiers" ? "(n+1)*(n+2)/2" : "(n+1)^2", "C'est la formule au rang n + 1, pas le terme ajouté.")] }); },
],
2: [
() => { const [fx, f, M0, nm] = pk([["\\sqrt{u_n + 6}", (x) => Math.sqrt(x + 6), 3, "racine6"], ["\\sqrt{2u_n + 8}", (x) => Math.sqrt(2 * x + 8), 4, "racine8"], ["\\frac{1}{2}u_n + 3", (x) => x / 2 + 3, 6, "affine"], ["\\sqrt{3u_n + 10}", (x) => Math.sqrt(3 * x + 10), 5, "racine10"]]);
return QN("Soit " + M("u_0 = 0") + " et " + M("u_{n+1} = " + fx) + ". On montre par récurrence que " + M("0 \\leqslant u_n \\leqslant M") + " avec " + M("M") + " tel que " + M("f(M) = M") + " (la fonction est croissante). Que vaut " + M("M") + " ?", M0,
"Hérédité : si " + M("0 \\leqslant u_n \\leqslant " + M0) + ", la fonction étant croissante, " + M("f(0) \\leqslant u_{n+1} \\leqslant f(" + M0 + ") = " + M0) + ". On a choisi " + M("M = " + M0) + " car " + M("f(" + M0 + ") = " + M0) + ".",
{ ctx: "majorant-" + nm, guide: [GR(M("f(" + M0 + ")") + " ?", f(M0), M(f(M0)) + "."), GR(M("M") + " ?", M0, M(M0) + ".")],
traps: [TR(rnd(f(0), 3), "C'est u₁ = f(0) : on cherche M tel que f(M) = M."), TR(rnd(f(M0 + 1), 3), "Avec ce majorant, f(M) ≠ M : l'hérédité ne marche pas.")] }); },
() => { const a = pk([4, 5, 7, 10, 3]), d = a - 1;
return QN("On démontre par récurrence que " + M(a + "^n - 1") + " est divisible par " + M(d) + ". Hérédité : " + M(a + "^{n+1} - 1 = " + a + "(" + a + "^n - 1) + k") + ". Que vaut " + M("k") + " ?", d,
M(a + X + a + "^n - 1 = " + a + "(" + a + "^n - 1) + " + a + " - 1") + ", donc " + M("k = " + d) + " ; comme " + M(a + "^n - 1") + " est divisible par " + M(d) + " (hypothèse) et " + M(d) + " aussi, la somme l'est.",
{ ctx: "divisibilite", guide: [GR("Développe " + M(a + "(" + a + "^n - 1)") + " : " + M(a + "^{n+1} - k'") + " avec " + M("k'") + " = ?", a, M(a) + "."), GR(M("k") + " ?", d, M(d) + ".")],
traps: [TR(a, a + "^{n+1} − 1 = " + a + "(" + a + "ⁿ − 1) + " + a + " − 1."), TR(-1, "Développe " + a + "(" + a + "ⁿ − 1) = " + a + "^{n+1} − " + a + ".")] }); },
() => { const [u0, q, r] = pk([[2, 2, -1], [1, 3, 2], [3, 2, 1], [0, 3, -2], [1, 2, -3]]), seq = [u0]; for (let i = 0; i < 6; i++) seq.push(q * seq[i] + r);
const l = r / (1 - q), A = u0 - l;  if (!Number.isInteger(l) || !Number.isInteger(A)) return null; const e = A + "*" + q + "^n" + (l >= 0 ? "+" : "") + l;
return QX("Soit " + M("u_0 = " + u0) + " et " + M("u_{n+1} = " + q + "u_n" + sg(r)) + ". Calcule les premiers termes et conjecture " + M("u_n") + " sous la forme " + M("A" + X + q + "^n + B") + ".", e,
M("u_1 = " + seq[1] + ", u_2 = " + seq[2] + ", u_3 = " + seq[3]) + ". La suite " + M("u_n" + sg(-l)) + " est géométrique de raison " + M(q) + " : " + M("u_n = " + A + X + q + "^n" + sg(l)) + " (à démontrer par récurrence).",
{ ctx: "conjecture-arithmetico", guide: [GR(M("u_3") + " ?", seq[3], M(seq[3]) + "."), GR(M("B") + " (le nombre fixe : " + M("B = " + q + "B" + sg(r)) + ") ?", l, M(l) + "."), GX(M("u_n") + " ?", e, M(A + X + q + "^n" + sg(l)) + ".")],
traps: [TX(u0 + "*" + q + "^n", "Le terme " + r + " ajouté à chaque étape change la formule."), TX(u0 + "+" + r + "*n", "On multiplie par " + q + " à chaque étape : ce n'est pas arithmétique.")] }); },
],
3: [
() => { const [S, n0, nm] = pk([["2^n \\geqslant n^2", 4, "2n-n2"], ["2^n > n^3", 10, "2n-n3"], ["3^n > n^3", 4, "3n-n3"], ["2^n > 5n", 5, "2n-5n"], ["n! > 2^n", 4, "fact"]]);
return QN("La propriété " + M("P(n) : " + S) + " est fausse pour certains petits entiers. À partir de quel entier " + M("n_0 \\geqslant 1") + " est-elle vraie pour tous les entiers " + M("n \\geqslant n_0") + " (initialisation en " + M("n_0") + ", puis hérédité) ?", n0,
"On teste : " + M("P(" + (n0 - 1) + ")") + " est fausse et " + M("P(" + n0 + ")") + " est vraie ; l'hérédité se démontre pour " + M("n \\geqslant " + n0) + ". Donc " + M("n_0 = " + n0) + ".",
{ ctx: "rang-initial-" + nm, guide: [GR("Plus grand entier pour lequel " + M("P(n)") + " est fausse ?", n0 - 1, M(n0 - 1) + "."), GR(M("n_0") + " ?", n0, M(n0) + ".")],
traps: [TR(n0 - 1, "P(" + (n0 - 1) + ") est encore fausse."), TR(1, "Vraie au rang 1 ne suffit pas : elle doit rester vraie ensuite.")] }); },
() => { const [a, b, u0] = pk([[0.5, 4, 1], [0.5, 3, 10], [0.8, 2, 0], [0.25, 6, 2], [0.6, 4, 20]]), l = b / (1 - a), up = u0 < l;
return QN("Soit " + M("u_0 = " + N(u0)) + " et " + M("u_{n+1} = " + N(a) + "u_n + " + b) + ". On montre par récurrence que la suite est " + (up ? "croissante et majorée" : "décroissante et minorée") + " par un nombre " + M("L") + " vérifiant " + M("L = " + N(a) + "L + " + b) + ". Que vaut " + M("L") + " ?", l,
M("L = " + N(a) + "L + " + b + " \\iff " + N(rnd(1 - a)) + "L = " + b + " \\iff L = " + N(l)) + ". Hérédité : si " + (up ? M("u_n \\leqslant " + N(l)) + ", alors " + M("u_{n+1} \\leqslant " + N(a) + X + N(l) + " + " + b + " = " + N(l)) : M("u_n \\geqslant " + N(l)) + ", alors " + M("u_{n+1} \\geqslant " + N(l))) + ". La suite, monotone et bornée, converge vers " + M(N(l)) + ".",
{ ctx: "borne-" + (up ? "majorant" : "minorant"), guide: [GR(M("1 - " + N(a)) + " ?", rnd(1 - a), M(N(rnd(1 - a))) + "."), GR(M("L") + " ?", l, M(N(l)) + ".")],
traps: [TR(rnd(b / (1 + a)), "L − " + N(a).replace("{,}", ",") + "L = (1 − " + N(a).replace("{,}", ",") + ")L."), TR(rnd(a * u0 + b), "C'est u₁.")] }); },
() => { const [a, b, u0] = pk([[3, -4, 5], [2, 3, 1], [0.5, 2, 10], [4, -6, 3], [2, -5, 8]]), l = b / (1 - a), v0 = u0 - l; if (!Number.isInteger(l) || !v0) return null;
return QN("Soit " + M("u_0 = " + N(u0)) + " et " + M("u_{n+1} = " + N(a) + "u_n" + sg(b)) + ". On pose " + M("v_n = u_n" + sg(-l)) + " : " + M("(v_n)") + " est géométrique de raison " + M(N(a)) + ". Que vaut " + M("v_{3}") + " ?", rnd(v0 * a ** 3),
M("v_0 = u_0" + sg(-l) + " = " + N(v0)) + " et " + M("v_{n+1} = u_{n+1}" + sg(-l) + " = " + N(a) + "u_n" + sg(b - l) + " = " + N(a) + "v_n") + ". Donc " + M("v_3 = " + N(v0) + X + N(a) + "^3 = " + N(rnd(v0 * a ** 3))) + ".",
{ ctx: "suite-auxiliaire", guide: [GR(M("v_0") + " ?", v0, M(N(v0)) + "."), GR(M("v_3") + " ?", rnd(v0 * a ** 3), M(N(rnd(v0 * a ** 3))) + ".")],
traps: [TR(rnd(u0 * a ** 3), "On part de v₀ = u₀ − " + l + ", pas de u₀."), TR(rnd(v0 * a ** 3 + l), "C'est u₃ ; on demande v₃.")] }); },
],
};



const T = (v) => N(v).replace(/\\,/g, " ").replace("{,}", ",").replace(/^-/, "−");
const PRL = (ctx, q, parts, hints, sol) => ({ ctx, q, hints, sol, parts: parts.map(([label, value]) => ({ label, spec: { kind: "value", value: rnd(value) } })) });
const seuil = (q, r) => Math.ceil(Math.log(r) / Math.log(q) - 1e-12);
const loin = (q, r) => { const x = Math.log(r) / Math.log(q); return Math.abs(x - Math.round(x)) > 0.02; };
const LNP = [() => {
const cx = pk(["placement", "utilisateurs", "medicament", "vitres"]);
let q, r1, r2, txt, l1, l2, unit, hint;
if (cx === "placement" || cx === "utilisateurs") {
const pl = cx === "placement", t = pl ? pk([1.5, 2, 2.5, 3, 3.5, 4, 5]) : pk([3, 4, 5, 6, 8]), C0 = pl ? 500 * R.int(2, 12) : 100 * R.int(20, 90);
q = rnd(1 + t / 100); do r1 = pk([1.2, 1.25, 1.3, 1.5, 1.6, 1.8]); while (!loin(q, r1)); do r2 = pl ? pk([2, 2, 2, 3]) : pk([3, 4, 5, 10]); while (!loin(q, r2));
const S1 = rnd(C0 * r1);
txt = pl ? "Un capital de " + T(C0) + " € est placé à " + T(t) + " % par an (intérêts composés)." : "Une application de covoiturage créée à " + pk(["Bordeaux", "Nantes", "Lyon", "Toulouse"]) + " compte " + T(C0) + " utilisateurs ; leur nombre augmente de " + t + " % par mois.";
unit = pl ? "d'années" : "de mois";
l1 = pl ? "le capital dépasse " + T(S1) + " €" : "le nombre d'utilisateurs dépasse " + T(S1);
l2 = pl ? (r2 === 2 ? "le capital double" : "le capital soit multiplié par " + r2) : "le nombre d'utilisateurs soit multiplié par " + r2;
hint = T(C0) + " × " + T(q) + "ⁿ ⩾ " + T(S1) + " ⇔ n ⩾ ln(" + T(r1) + ") ÷ ln(" + T(q) + ")";
} else if (cx === "medicament") {
const D = pk([100, 200, 250, 400, 500]), p = pk([10, 15, 20, 25, 30]); q = rnd(1 - p / 100); r1 = 0.5; do r2 = pk([0.1, 0.05, 0.2, 0.02]); while (!loin(q, r2));
txt = "On injecte " + D + " mg d'un médicament. Chaque heure, la quantité présente dans le sang diminue de " + p + " %.";
unit = "d'heures"; l1 = "il reste moins de " + T(rnd(D * r1)) + " mg"; l2 = "il reste moins de " + T(rnd(D * r2)) + " mg";
hint = D + " × " + T(q) + "ⁿ < " + T(rnd(D * r1)) + " ⇔ n > ln(" + T(r1) + ") ÷ ln(" + T(q) + ") : ln(" + T(q) + ") < 0, le sens change";
} else {
const p = pk([8, 10, 12, 15, 20]); q = rnd(1 - p / 100); r1 = 0.5; do r2 = pk([0.1, 0.2, 0.25, 0.05]); while (!loin(q, r2));
txt = "Une plaque de verre teinté absorbe " + p + " % de la lumière qui la traverse. On superpose n plaques identiques.";
unit = "de plaques"; l1 = "l'intensité lumineuse transmise soit inférieure à 50 % de l'intensité de départ"; l2 = "elle soit inférieure à " + T(r2 * 100) + " %";
hint = T(q) + "ⁿ < 0,5 ⇔ n > ln 0,5 ÷ ln " + T(q) + " (ln " + T(q) + " < 0 : le sens change)";
}
const n1 = seuil(q, r1), n2 = seuil(q, r2), up = q > 1;
return PRL(cx, txt,
[["a) Coefficient multiplicateur " + (cx === "vitres" ? "de l'intensité par plaque" : cx === "medicament" ? "horaire" : cx === "placement" ? "annuel" : "mensuel"), q], ["b) Nombre minimal " + unit + " pour que " + l1, n1], ["c) Nombre minimal " + unit + " pour que " + l2, n2]],
[hint + ".", "On prend le premier entier qui convient (on arrondit au-dessus)."],
"a) " + M(N(q)) + " ; b) " + M("n " + (up ? "\\geqslant" : ">") + " \\frac{\\ln " + N(r1) + "}{\\ln " + N(q) + "} \\approx " + N(rnd(Math.log(r1) / Math.log(q), 2))) + ", donc " + M("n = " + n1) + " ; c) " + M("\\frac{\\ln " + N(r2) + "}{\\ln " + N(q) + "} \\approx " + N(rnd(Math.log(r2) / Math.log(q), 2))) + ", donc " + M("n = " + n2) + ".");
}];

reg([
{ id: "lnfr", theme: "fa", label: "Logarithme népérien : propriétés, équations, seuils", ex: "\\ln(ab) = \\ln a + \\ln b", FR: [12, 3], g: LN,
hint: "ln est la réciproque de exp : e^x = k ⇔ x = ln k (k > 0) ; ln x = a ⇔ x = e^a. ln(ab) = ln a + ln b, ln(a/b) = ln a − ln b, ln(aⁿ) = n ln a. Diviser par ln q < 0 (0 < q < 1) change le sens d'une inégalité.",
comps: ["Propriétés algébriques, e^x = k, ln x = a", "ln(ax + b) = 0, seuils qⁿ ≥ k, ln(aⁿ)", "Changement de variable, domaine, seuil d'une suite décroissante"],
lesson: ["Le logarithme népérien", "La fonction \\(\\ln\\) est la réciproque de \\(\\exp\\) : pour \\(x > 0\\), \\(y = \\ln x \\iff x = e^y\\).",
"\\(\\ln 1 = 0\\), \\(\\ln e = 1\\). Pour \\(a, b > 0\\) : \\(\\ln(ab) = \\ln a + \\ln b\\), \\(\\ln\\frac{a}{b} = \\ln a - \\ln b\\), \\(\\ln(a^n) = n\\ln a\\). \\(\\ln\\) est strictement croissante sur \\(]0 \\,;\\, +\\infty[\\) : \\(\\ln a < \\ln b \\iff a < b\\). Seuil : \\(q^n \\geqslant k \\iff n\\ln q \\geqslant \\ln k\\) ; si \\(0 < q < 1\\), \\(\\ln q < 0\\) et le sens change en divisant.",
["\\(e^{2x} = 5 \\iff x = \\frac{\\ln 5}{2}\\).", "\\(1{,}05^n \\geqslant 2 \\iff n \\geqslant \\frac{\\ln 2}{\\ln 1{,}05} \\approx 14{,}2\\) : \\(n = 15\\)."],
"\\(\\ln(a + b)\\) n'est pas \\(\\ln a + \\ln b\\) ; et on vérifie toujours le domaine (\\(\\ln\\) d'un nombre positif)."],
probs: LNP },
{ id: "trigfr", theme: "fa", label: "Fonctions sinus et cosinus", ex: "(\\sin x)' = \\cos x", FR: [12, 4], g: TF,
hint: "x en radians. (sin x)' = cos x ; (cos x)' = −sin x ; (sin(ax + b))' = a cos(ax + b). sin et cos sont 2π-périodiques ; cos est paire, sin impaire. Sur ]−π ; π], cos x = a donne ± la même valeur ; sin x = a donne x et π − x.",
comps: ["Dériver sin et cos, sin x = a, valeurs remarquables", "Composées sin(ax + b), période, inéquations sur le cercle", "Étude d'une fonction, nombre de solutions, limite de sin(kx)/x"],
lesson: ["Fonctions sinus et cosinus", "Les fonctions \\(\\sin\\) et \\(\\cos\\) se lisent sur le cercle trigonométrique (\\(x\\) en radians).",
"Elles sont définies et dérivables sur \\(\\mathbb{R}\\), \\(2\\pi\\)-périodiques ; \\(\\cos\\) est paire, \\(\\sin\\) impaire. \\((\\sin x)' = \\cos x\\), \\((\\cos x)' = -\\sin x\\), \\((\\sin(ax + b))' = a\\cos(ax + b)\\), \\((\\cos(ax + b))' = -a\\sin(ax + b)\\). \\(x \\mapsto \\sin(kx)\\) a pour période \\(\\frac{2\\pi}{k}\\). \\(\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1\\).",
["\\((3\\sin(2x))' = 6\\cos(2x)\\).", "\\(\\cos x \\geqslant \\frac{1}{2}\\) sur \\(]-\\pi \\,;\\, \\pi]\\) : \\(\\left[-\\frac{\\pi}{3} \\,;\\, \\frac{\\pi}{3}\\right]\\)."],
"\\((\\cos x)' = -\\sin x\\) : le signe moins est souvent oublié."] },
{ id: "tvi", theme: "fa", label: "Continuité, théorème des valeurs intermédiaires", ex: "f(a) < k < f(b) \\Rightarrow \\exists c, \\ f(c) = k", FR: [12, 2], g: TVI,
hint: "f continue sur [a ; b] : f prend toutes les valeurs entre f(a) et f(b). Si en plus f est strictement monotone, chaque valeur est prise une seule fois. Encadrer α : tabuler (balayage) ou couper l'intervalle en deux (dichotomie).",
comps: ["Encadrement par des entiers, une solution unique, dichotomie", "Balayage au dixième, tableau avec limites", "Point fixe d'une suite, nombre de solutions, approximation à 0,01"],
lesson: ["Théorème des valeurs intermédiaires", "Une fonction continue sur un intervalle ne « saute » pas : elle prend toutes les valeurs intermédiaires.",
"Si \\(f\\) est continue sur \\([a \\,;\\, b]\\) et si \\(k\\) est compris entre \\(f(a)\\) et \\(f(b)\\), l'équation \\(f(x) = k\\) a au moins une solution dans \\([a \\,;\\, b]\\). Si de plus \\(f\\) est strictement monotone, la solution est unique. On l'encadre par balayage (valeurs de \\(f\\) avec un pas de 0,1, 0,01…) ou par dichotomie (on garde la moitié de l'intervalle où \\(f - k\\) change de signe). Si \\(u_{n+1} = f(u_n)\\) converge vers \\(\\ell\\) et \\(f\\) est continue, alors \\(f(\\ell) = \\ell\\).",
["\\(x^3 = 10\\) : \\(2^3 = 8 < 10 < 27 = 3^3\\), donc \\(2 < \\alpha < 3\\).", "\\(u_{n+1} = \\sqrt{u_n + 6}\\) : \\(\\ell = \\sqrt{\\ell + 6}\\) donne \\(\\ell = 3\\)."],
"Sans la stricte monotonie, il peut y avoir plusieurs solutions ; sans la continuité, peut-être aucune."] },
{ id: "sommeva", theme: "no", label: "Sommes de variables aléatoires, concentration", ex: "V(X + Y) = V(X) + V(Y)", FR: [12, 7], g: SV,
hint: "E(X + Y) = E(X) + E(Y) toujours ; V(X + Y) = V(X) + V(Y) si X et Y sont indépendantes ; V(aX) = a²V(X). Moyenne de n répétitions : E = μ, V = σ²/n. Bienaymé-Tchebychev : P(|X − μ| ≥ δ) ≤ V(X)/δ².",
comps: ["Linéarité de l'espérance, variance d'une somme, moyenne d'un échantillon", "Somme de Bernoulli, Bienaymé-Tchebychev, somme de dés", "Taille d'échantillon, gain d'un jeu répété, minorer une probabilité"],
lesson: ["Sommes de variables aléatoires", "On étudie une grandeur obtenue en ajoutant les résultats de plusieurs expériences.",
"Linéarité : \\(E(aX + bY) = aE(X) + bE(Y)\\). Si \\(X\\) et \\(Y\\) sont indépendantes : \\(V(X + Y) = V(X) + V(Y)\\), et \\(V(aX) = a^2V(X)\\). Pour \\(n\\) répétitions indépendantes : \\(S_n = X_1 + \\dots + X_n\\) a \\(E(S_n) = n\\mu\\), \\(V(S_n) = n\\sigma^2\\) ; la moyenne \\(M_n = \\frac{S_n}{n}\\) a \\(E(M_n) = \\mu\\), \\(V(M_n) = \\frac{\\sigma^2}{n}\\). Bienaymé-Tchebychev : \\(P(|X - \\mu| \\geqslant \\delta) \\leqslant \\frac{V(X)}{\\delta^2}\\) ; inégalité de concentration : \\(P(|M_n - \\mu| \\geqslant \\delta) \\leqslant \\frac{\\sigma^2}{n\\delta^2}\\) (loi des grands nombres : \\(M_n\\) se concentre autour de \\(\\mu\\)).",
["Loi binomiale \\(\\mathcal{B}(n \\,;\\, p)\\) = somme de \\(n\\) Bernoulli : \\(E = np\\), \\(V = np(1 - p)\\).", "\\(V(X) = 4\\), \\(\\delta = 5\\) : \\(P(|X - \\mu| \\geqslant 5) \\leqslant 0{,}16\\)."],
"Les variances s'ajoutent seulement pour des variables indépendantes ; et \\(V(2X) = 4V(X)\\), pas \\(2V(X)\\)."] },
{ id: "recurrence", theme: "fa", label: "Raisonnement par récurrence", ex: "P(0) \\text{ et } P(n) \\Rightarrow P(n + 1)", FR: [12, 0], g: RC,
hint: "Initialisation : la propriété est vraie au premier rang. Hérédité : si elle est vraie au rang n, elle l'est au rang n + 1 (on utilise l'hypothèse). Conclusion : vraie pour tout n à partir du premier rang.",
comps: ["Conjecturer une formule, calculer l'hérédité, terme ajouté", "Majorant, divisibilité, conjecture d'une suite arithmético-géométrique", "Rang initial, suite bornée, suite auxiliaire"],
lesson: ["Raisonnement par récurrence", "Pour démontrer qu'une propriété \\(P(n)\\) est vraie pour tout entier \\(n \\geqslant n_0\\), on monte un escalier marche par marche.",
"Initialisation : on vérifie \\(P(n_0)\\). Hérédité : on suppose \\(P(n)\\) vraie pour un entier \\(n \\geqslant n_0\\) (hypothèse de récurrence) et on démontre \\(P(n + 1)\\). Conclusion : \\(P(n)\\) est vraie pour tout \\(n \\geqslant n_0\\). On conjecture souvent la propriété en calculant les premiers termes.",
["\\(u_0 = 1\\), \\(u_{n+1} = u_n + 2n + 3\\) : \\(u_n = (n + 1)^2\\).", "\\(4^{n+1} - 1 = 4(4^n - 1) + 3\\) : divisible par 3 si \\(4^n - 1\\) l'est."],
"L'hérédité seule ne suffit pas : sans initialisation, rien n'est démontré (\\(2^n > n^3\\) n'est vraie qu'à partir de 10)."] },
]);
})();










(function () {
const { pk, nz, rnd, g2, N, NP, F, FS, sg, X, co, mk, QN, QR, QX, QS, GR, GX, TR, TX, TS, P, reg } = FRX;
const D = (v) => String(rnd(v, 6)).replace(".", ",");
const QD = (q, value, sol, o) => mk(q, { kind: "value", value: rnd(value, 9) }, sol, Object.assign({ canon: D(value) }, o));
const QF = (q, value, sol, o) => mk(q, { kind: "value", value: rnd(value, 12) }, sol, Object.assign({ canon: FS(value) }, o));
const GD = (ask, value, sol, round) => GR(ask, rnd(value, 9), sol, round);
const TD = (v, m) => TR(rnd(v, 9), m);
const dec1 = (a, b) => R.int(Math.round(a * 10), Math.round(b * 10)) / 10;
const who = () => pk(["Léa", "Hugo", "Chloé", "Nathan", "Manon", "Louis", "Camille", "Jules", "Inès", "Gabriel", "Zoé", "Adam"]);
const cm = (v) => M(N(v) + "\\text{ cm}");
const deg = (v) => M(N(v) + "°");

const sv = (w, h, g, lab) => '<svg class="fig" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + lab + '" xmlns="http://www.w3.org/2000/svg">' + g + "</svg>";
const tx = (x, y, s, a = "middle", sz = 13, cls = "f-txt") => '<text x="' + (+x).toFixed(1) + '" y="' + (+y).toFixed(1) + '" class="' + cls + '" text-anchor="' + a + '" font-size="' + sz + '">' + String(s).replace(/\./g, ",") + "</text>";
const ln = (x1, y1, x2, y2, cls = "f-line", ex = "") => '<line x1="' + (+x1).toFixed(1) + '" y1="' + (+y1).toFixed(1) + '" x2="' + (+x2).toFixed(1) + '" y2="' + (+y2).toFixed(1) + '" class="' + cls + '"' + ex + "/>";
const dot = (x, y) => '<circle cx="' + (+x).toFixed(1) + '" cy="' + (+y).toFixed(1) + '" r="4" class="f-dot"/>';
const pg = (pts, cls = "f-shape", ex = "") => '<polygon points="' + pts.map((p) => (+p[0]).toFixed(1) + "," + (+p[1]).toFixed(1)).join(" ") + '" class="' + cls + '"' + ex + "/>";
const AX = ' stroke-width="2.4" stroke-dasharray="7 4"';

const grille = (o) => {
const s = o.s || 24, W = o.cols * s + 24, H = o.rows * s + 24, gx = (x) => 12 + x * s, gy = (y) => 12 + (o.rows - y) * s;
let g = "";
for (const [i, j] of o.cells || []) g += '<rect x="' + gx(i) + '" y="' + gy(j + 1) + '" width="' + s + '" height="' + s + '" class="f-fill2"/>';
for (let i = 0; i <= o.cols; i++) g += ln(gx(i), gy(0), gx(i), gy(o.rows), "f-grid", ' stroke-width="0.9"');
for (let j = 0; j <= o.rows; j++) g += ln(gx(0), gy(j), gx(o.cols), gy(j), "f-grid", ' stroke-width="0.9"');
for (const Q of o.polys || []) g += pg(Q.map(([x, y]) => [gx(x), gy(y)]), "f-shape", ' style="fill-opacity:.6"');
if (o.v !== undefined) g += ln(gx(o.v), gy(0) + 8, gx(o.v), gy(o.rows) - 8, "f-accent", AX) + tx(gx(o.v) + 5, gy(o.rows) + 2, "(d)", "start", 13, "f-accent f-txt");
if (o.h !== undefined) g += ln(gx(0) - 8, gy(o.h), gx(o.cols) + 8, gy(o.h), "f-accent", AX) + tx(gx(o.cols) - 4, gy(o.h) - 6, "(d)", "end", 13, "f-accent f-txt");
for (const [x, y, nm] of o.pts || []) g += dot(gx(x), gy(y)) + tx(gx(x) + 7, gy(y) - 7, nm, "start", 14);
return sv(W, H, g, o.lab || "quadrillage");
};

const graduee = (a, b, vs, pts, lab) => {
const W = 320, x = (v) => 16 + ((v - a) / (b - a)) * (W - 32), y0 = 70;
let g = ln(8, y0, W - 8, y0, "f-line", ' stroke-width="1.6"');
for (let v = a; v <= b + 1e-9; v++) g += ln(x(v), y0 - 6, x(v), y0 + 6) + tx(x(v), y0 + 22, v, "middle", 11, "f-txt f-tick");
vs.forEach(([v, nm], i) => (g += ln(x(v), 14, x(v), 120, "f-accent", AX) + tx(x(v) + 4, 24 + 12 * i, nm, "start", 12, "f-accent f-txt")));
for (const [v, nm] of pts) g += dot(x(v), y0) + tx(x(v), y0 - 10, nm, "middle", 14);
return sv(W, 130, g, lab);
};


const FIGS = [
["un rectangle (qui n'est pas un carré)", 2, 0, "Les diagonales d'un rectangle ne sont pas des axes de symétrie : plie-le selon une diagonale, les deux moitiés ne se superposent pas.", 4, "rectangle"],
["un carré", 2, 2, "Le carré a les axes du rectangle ET ceux du losange (ses deux diagonales).", 2, "carre"],
["un losange (qui n'est pas un carré)", 0, 2, "Les axes d'un losange sont ses diagonales, pas les droites qui joignent les milieux des côtés.", 4, "losange"],
["un triangle équilatéral", 0, 3, "Chaque axe passe par un sommet et par le milieu du côté opposé : il y en a un par sommet.", 1, "equilateral"],
["un hexagone régulier", 3, 3, "Trois axes passent par deux sommets opposés, trois autres par les milieux de deux côtés opposés.", 3, "hexagone"],
["un octogone régulier", 4, 4, "Quatre axes passent par deux sommets opposés, quatre autres par les milieux de deux côtés opposés.", 4, "octogone"],
["un pentagone régulier", 0, 5, "Avec un nombre impair de côtés, chaque axe passe par un sommet et par le milieu du côté opposé : un par sommet.", 10, "pentagone"],
];
const regFig = (n, lab) => { const c = [160, 92], r = 72, a0 = n === 4 ? Math.PI / 4 : -Math.PI / 2; return sv(320, 184, pg(Array.from({ length: n }, (_, k) => [c[0] + r * Math.cos(a0 + (2 * Math.PI * k) / n), c[1] + r * Math.sin(a0 + (2 * Math.PI * k) / n)])), lab); };
const shapeFig = (nm) => nm === "rectangle" ? sv(320, 150, pg([[50, 25], [270, 25], [270, 125], [50, 125]]), "rectangle") : nm === "losange" ? sv(320, 170, pg([[160, 10], [270, 85], [160, 160], [50, 85]]), "losange")
: regFig({ carre: 4, equilateral: 3, hexagone: 6, octogone: 8, pentagone: 5 }[nm], nm);
const SA = {
1: [
() => { const [nm, m, s, msg, trap, id] = pk(FIGS), t = m + s;
const sm = m ? M(m) + " passant par les milieux de deux côtés opposés" : "", ss = s ? M(s) + " passant par " + (id === "equilateral" || id === "pentagone" ? "un sommet et le milieu du côté opposé" : "deux sommets opposés") : "";
return QN("Combien d'axes de symétrie a " + nm + " ?", t, "Un axe de symétrie partage la figure en deux moitiés qui se superposent par pliage. " + [sm, ss].filter(Boolean).join(" et ") + " : " + M(t) + " axes.",
{ ctx: "axes-" + id, fig: shapeFig(id), guide: [GR("Combien d'axes passent par les milieux de deux côtés (opposés) ?", m, m ? M(m) + "." : "Aucun."), GR("Combien d'axes passent par un ou deux sommets ?", s, s ? M(s) + "." : "Aucun."), GR("Nombre total d'axes ?", t, M(t) + ".")],
traps: [TR(trap, msg), TR(t === 2 ? 1 : 2, "Plie la figure en pensée : compte tous les plis où les deux moitiés se superposent.")] }); },
() => { const s = [dec1(2.5, 6.5), dec1(2.5, 6.5), dec1(2.5, 6.5)]; if (s[0] + s[1] <= s[2] || s[0] + s[2] <= s[1] || s[1] + s[2] <= s[0] || new Set(s).size < 3) return null; const p = rnd(s[0] + s[1] + s[2], 6);
return QD("Le triangle " + M("A'B'C'") + " est le symétrique du triangle " + M("ABC") + " par rapport à une droite " + M("(d)") + ". On sait que " + M("AB = " + N(s[0])) + " cm, " + M("BC = " + N(s[1])) + " cm et " + M("AC = " + N(s[2])) + " cm. Quel est le périmètre du triangle " + M("A'B'C'") + " (en cm) ?", p,
"La symétrie axiale conserve les longueurs : " + M("A'B' = " + N(s[0])) + ", " + M("B'C' = " + N(s[1])) + ", " + M("A'C' = " + N(s[2])) + ". Périmètre : " + M(N(s[0]) + " + " + N(s[1]) + " + " + N(s[2]) + " = " + N(p)) + " cm.",
{ ctx: "conserve-longueur", guide: [GD("Combien mesure " + M("A'B'") + " (en cm) ?", s[0], M(N(s[0])) + " cm : même longueur que " + M("AB") + "."), GD("Périmètre de " + M("A'B'C'") + " (en cm) ?", p, M(N(p)) + " cm.")],
traps: [TD(2 * p, "On ne double pas : le triangle symétrique a les mêmes longueurs, donc le même périmètre."), TD(s[0] + s[1], "Le périmètre est la somme des trois côtés.")] }); },
() => { const a = R.int(35, 80), b = R.int(30, 75), c = 180 - a - b; if (c < 25 || a === b || b === c || a === c) return null;
return QN("Le triangle " + M("A'B'C'") + " est le symétrique du triangle " + M("ABC") + " par rapport à une droite " + M("(d)") + ". Dans " + M("ABC") + ", " + M("\\widehat{A} = " + a + "°") + " et " + M("\\widehat{B} = " + b + "°") + ". Quelle est la mesure de l'angle " + M("\\widehat{C'}") + " (en degrés) ?", c,
"Somme des angles d'un triangle : " + M("\\widehat{C} = 180° - " + a + "° - " + b + "° = " + c + "°") + ". La symétrie axiale conserve les angles : " + M("\\widehat{C'} = " + c + "°") + ".",
{ ctx: "conserve-angle", guide: [GR("Mesure de " + M("\\widehat{C}") + " dans " + M("ABC") + " ?", c, M("180 - " + a + " - " + b + " = " + c) + "."), GR(M("\\widehat{C'}") + " ?", c, M(c + "°") + " : la symétrie conserve les angles.")],
traps: [TR(a + b, "On cherche le troisième angle : 180° moins les deux autres."), TR(180 - c, "La symétrie conserve les angles : Ĉ' = Ĉ.")] }); },
() => { const vert = R.rand() < 0.5, k = R.int(2, 5), c = R.int(6, 8), r = R.int(1, 5);
const o = vert ? { cols: 14, rows: 6, v: c, pts: [[c - k, r, "A"]] } : { cols: 12, rows: 9, h: 5, pts: [[R.int(2, 9), 5 + (k > 3 ? -k : k), "A"]] };
return QN("Sur le quadrillage, " + M("A'") + " est le symétrique de " + M("A") + " par rapport à la droite " + M("(d)") + ". Combien de carreaux séparent " + M("A") + " et " + M("A'") + " ?", 2 * k,
M("A") + " est à " + M(k) + " carreaux de " + M("(d)") + " ; " + M("A'") + " est à " + M(k) + " carreaux de l'autre côté, sur la perpendiculaire à " + M("(d)") + " : " + M(k + " + " + k + " = " + 2 * k) + " carreaux.",
{ ctx: vert ? "quadrillage-vertical" : "quadrillage-horizontal", fig: grille(Object.assign(o, { lab: "point A et axe (d) sur un quadrillage" })),
guide: [GR("À combien de carreaux de " + M("(d)") + " est le point " + M("A") + " ?", k, M(k) + " carreaux."), GR("Distance " + M("AA'") + " en carreaux ?", 2 * k, M(2 * k) + " : " + M("(d)") + " passe au milieu de " + M("[AA']") + ".")],
traps: [TR(k, "C'est la distance de A à l'axe ; A' est aussi loin de l'autre côté.")] }); },
],
2: [
() => { const c = R.int(30, 70) / 10, a = rnd(c - dec1(0.6, 2.8), 6), b = rnd(2 * c - a, 6); if (a < 0.3) return null;
return QD("Sur une droite graduée, le point " + M("A") + " a pour abscisse " + M(N(a)) + ". La droite " + M("(d)") + ", perpendiculaire à la droite graduée, la coupe au point d'abscisse " + M(N(c)) + ". Quelle est l'abscisse du symétrique " + M("A'") + " de " + M("A") + " par rapport à " + M("(d)") + " ?", b,
M("A") + " est à " + M(N(c) + " - " + N(a) + " = " + N(rnd(c - a, 6))) + " de " + M("(d)") + " ; " + M("A'") + " est à la même distance de l'autre côté : " + M(N(c) + " + " + N(rnd(c - a, 6)) + " = " + N(b)) + ".",
{ ctx: "droite-graduee", fig: graduee(0, 10, [[c, "(d)"]], [[a, "A"]], "droite graduée, point A et axe (d)"), guide: [GD("Distance de " + M("A") + " à " + M("(d)") + " ?", c - a, M(N(rnd(c - a, 6)))), GD("Abscisse de " + M("A'") + " ?", b, M(N(b)) + ".")],
traps: [TD(c - a, "C'est la distance de A à (d) ; on demande l'abscisse de A'."), TD(c + a, "A' est à la même distance de (d) que A : ajoute à " + D(c) + " la distance " + D(c - a) + ".")] }); },
() => { const ax = dec1(2, 5), s = [dec1(1.5, 4.5), dec1(1.5, 4.5), dec1(1.5, 4.5)], p = rnd(2 * (s[0] + s[1] + s[2]), 6);
return QD("Une figure est symétrique par rapport à la droite " + M("(d)") + ". On n'en a dessiné que la moitié : un polygone dont un côté de " + cm(ax) + " est posé sur " + M("(d)") + " et dont les trois autres côtés mesurent " + cm(s[0]) + ", " + cm(s[1]) + " et " + cm(s[2]) + ". Quel est le périmètre de la figure entière (en cm) ?", p,
"Le côté posé sur l'axe est à l'intérieur de la figure entière : il ne compte pas. Les trois autres côtés et leurs symétriques forment le contour : " + M("2 \\times (" + N(s[0]) + " + " + N(s[1]) + " + " + N(s[2]) + ") = " + N(p)) + " cm.",
{ ctx: "moitie-perimetre", fig: sv(320, 160, pg([[160, 20], [70, 40], [50, 120], [160, 140]], "f-shape") + pg([[160, 20], [250, 40], [270, 120], [160, 140]], "f-soft", ' style="stroke-dasharray:5 4"') + ln(160, 8, 160, 152, "f-accent", AX) + tx(166, 18, "(d)", "start", 13, "f-accent f-txt"), "moitié de figure et son symétrique"),
guide: [GD("Contour d'une moitié, sans le côté posé sur l'axe (en cm) ?", s[0] + s[1] + s[2], M(N(rnd(s[0] + s[1] + s[2], 6))) + " cm."), GD("Périmètre de la figure entière (en cm) ?", p, M(N(p)) + " cm.")],
traps: [TD(2 * (s[0] + s[1] + s[2] + ax), "Le côté posé sur l'axe se retrouve à l'intérieur de la figure : il ne fait pas partie du contour."), TD(s[0] + s[1] + s[2] + ax, "C'est le périmètre de la moitié ; la figure entière a deux fois les trois côtés extérieurs.")] }); },
() => { const b = R.int(28, 76); if (b === 60 || b === 45) return null; const a = 180 - 2 * b;
return QN("La droite " + M("(d)") + " est un axe de symétrie du triangle " + M("ABC") + " : elle passe par " + M("A") + " et par le milieu de " + M("[BC]") + ". On sait que " + M("\\widehat{B} = " + b + "°") + ". Quelle est la mesure de " + M("\\widehat{A}") + " (en degrés) ?", a,
"Le symétrique de " + M("B") + " est " + M("C") + " : " + M("\\widehat{C} = \\widehat{B} = " + b + "°") + " (le triangle est isocèle en " + M("A") + "). Donc " + M("\\widehat{A} = 180° - 2 \\times " + b + "° = " + a + "°") + ".",
{ ctx: "isocele-axe", fig: sv(320, 170, pg([[160, 18], [60, 150], [260, 150]]) + ln(160, 8, 160, 162, "f-accent", AX) + tx(166, 20, "(d)", "start", 13, "f-accent f-txt") + tx(160, 12, "A", "end", 14) + tx(52, 160, "B", "end", 14) + tx(268, 160, "C", "start", 14), "triangle ABC et son axe (d)"),
guide: [GR("Mesure de " + M("\\widehat{C}") + " ?", b, M(b + "°") + " : la symétrie conserve les angles."), GR("Mesure de " + M("\\widehat{A}") + " ?", a, M("180 - " + 2 * b + " = " + a) + ".")],
traps: [TR(180 - b, "Il y a deux angles de " + b + "° (en B et en C) à retirer de 180°."), TR(90 - b, "La somme des trois angles vaut 180°.")] }); },
],
3: [
() => { const a = dec1(0.5, 3), c1 = dec1(a + 0.8, a + 2.5), c2 = rnd(c1 + dec1(0.6, 2.2), 6), a1 = rnd(2 * c1 - a, 6), a2 = rnd(2 * c2 - a1, 6); if (a1 < c2 + 0.2 && a1 > c2 - 0.2) return null; if (a2 < 0 || a2 > 14) return null;
return QD("Sur une droite graduée, " + M("A") + " a pour abscisse " + M(N(a)) + ". Deux droites " + M("(d_1)") + " et " + M("(d_2)") + ", perpendiculaires à la droite graduée, la coupent aux points d'abscisses " + M(N(c1)) + " et " + M(N(c2)) + ". " + M("A'") + " est le symétrique de " + M("A") + " par rapport à " + M("(d_1)") + ", puis " + M("A''") + " celui de " + M("A'") + " par rapport à " + M("(d_2)") + ". Quelle est l'abscisse de " + M("A''") + " ?", a2,
M("A'") + " : " + M(N(c1) + " + (" + N(c1) + " - " + N(a) + ") = " + N(a1)) + ". " + M("A''") + " : " + M(N(c2) + " " + (a1 > c2 ? "-" : "+") + " " + N(Math.abs(rnd(a1 - c2, 6))) + " = " + N(a2)) + " (même distance à " + M("(d_2)") + ", de l'autre côté).",
{ ctx: "deux-axes", fig: graduee(0, 14, [[c1, "(d₁)"], [c2, "(d₂)"]], [[a, "A"]], "droite graduée, point A et deux axes"), guide: [GD("Abscisse de " + M("A'") + " ?", a1, M(N(a1)) + "."), GD("Distance de " + M("A'") + " à " + M("(d_2)") + " ?", Math.abs(a1 - c2), M(N(Math.abs(rnd(a1 - c2, 6))))), GD("Abscisse de " + M("A''") + " ?", a2, M(N(a2)) + ".")],
traps: [TD(a1, "C'est A' ; il reste la symétrie par rapport à (d₂)."), TD(2 * c2 - a, "On applique la deuxième symétrie à A', pas à A.")] }); },
() => { const cols = 8, rows = 5, v = 4, all = []; for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) all.push([i, j]);
const key = (c) => c[0] + "," + c[1], mir = (c) => [2 * v - 1 - c[0], c[1]], S = new Set();
for (const c of all) if (c[0] < v && R.rand() < 0.4) { S.add(key(c)); if (R.rand() < 0.55) S.add(key(mir(c))); }
for (const c of all) if (c[0] >= v && R.rand() < 0.12) S.add(key(c));
const cells = [...S].map((k) => k.split(",").map(Number)), miss = cells.filter((c) => !S.has(key(mir(c)))).length;
if (miss < 2 || miss > 7 || cells.length < 6) return null;
return QN("On veut que la figure coloriée soit symétrique par rapport à la droite " + M("(d)") + ". Combien de carreaux faut-il colorier en plus, au minimum (on n'efface rien) ?", miss,
"Pour chaque carreau colorié, son symétrique par rapport à " + M("(d)") + " (même rangée, même distance à l'axe de l'autre côté) doit l'être aussi. " + M(miss) + " carreaux coloriés n'ont pas encore leur symétrique.",
{ ctx: "completer-cases", fig: grille({ cols, rows, v, cells, s: 30, lab: "carreaux coloriés et axe (d)" }), guide: [GR("Carreaux coloriés à gauche de " + M("(d)") + " dont le symétrique est blanc ?", cells.filter((c) => c[0] < v && !S.has(key(mir(c)))).length, "Compte rangée par rangée."), GR("Et à droite de " + M("(d)") + " ?", cells.filter((c) => c[0] >= v && !S.has(key(mir(c)))).length, "Même chose de l'autre côté."), GR("Carreaux à colorier en tout ?", miss, M(miss) + ".")],
traps: [TR(cells.length, "C'est le nombre de carreaux déjà coloriés ; compte seulement ceux dont le symétrique manque."), TR(cells.filter((c) => c[0] < v && !S.has(key(mir(c)))).length, "Regarde aussi les carreaux coloriés à droite de l'axe.")] }); },
() => { const L = dec1(2.5, 7), l = dec1(1.5, 4); if (L <= l + 0.4) return null; const p = rnd(2 * (2 * L + l), 6);
return QD("Le rectangle " + M("ABCD") + " a pour longueur " + M("AB = " + N(L)) + " cm et pour largeur " + M("BC = " + N(l)) + " cm. On trace son symétrique par rapport à la droite " + M("(BC)") + ". Le rectangle et son symétrique forment un grand rectangle. Quel est le périmètre de ce grand rectangle (en cm) ?", p,
"La symétrie conserve les longueurs ; le symétrique est collé le long de " + M("[BC]") + ". Le grand rectangle mesure " + M("2 \\times " + N(L) + " = " + N(rnd(2 * L, 6))) + " cm sur " + M(N(l)) + " cm : périmètre " + M("2 \\times (" + N(rnd(2 * L, 6)) + " + " + N(l) + ") = " + N(p)) + " cm.",
{ ctx: "recoller-rectangle", fig: sv(320, 120, pg([[20, 20], [160, 20], [160, 100], [20, 100]]) + pg([[160, 20], [300, 20], [300, 100], [160, 100]], "f-soft", ' style="stroke-dasharray:5 4"') + tx(14, 16, "A", "end", 13) + tx(160, 14, "B", "middle", 13) + tx(160, 116, "C", "middle", 13) + tx(14, 114, "D", "end", 13), "rectangle ABCD et son symétrique par rapport à (BC)"),
guide: [GD("Longueur du grand rectangle (en cm) ?", 2 * L, M(N(rnd(2 * L, 6))) + " cm."), GD("Périmètre (en cm) ?", p, M(N(p)) + " cm.")],
traps: [TD(4 * (L + l), "Le côté [BC], commun aux deux rectangles, n'est plus sur le contour."), TD(2 * (L + l), "C'est le périmètre du petit rectangle.")] }); },
],
};


const medFig = (lab, o = {}) => sv(320, 170, ln(50, 130, 270, 130, "f-line", ' stroke-width="2"') + dot(50, 130) + dot(270, 130) + tx(44, 148, "A", "end", 14) + tx(276, 148, "B", "start", 14) + ln(160, 10, 160, 165, "f-accent", AX) + tx(166, 22, "(d)", "start", 13, "f-accent f-txt")
+ '<path d="M160,120 L170,120 L170,130" class="f-line" fill="none"/>' + ln(102, 125, 108, 135) + ln(212, 125, 218, 135) + (o.M ? dot(160, 44) + ln(50, 130, 160, 44, "f-line") + ln(270, 130, 160, 44, "f-line") + tx(168, 44, "M", "start", 14) : "") + (o.I ? tx(166, 146, "I", "start", 14) : ""), lab);
const MD = {
1: [
() => { const ab = dec1(3.2, 9.8); if (Math.round(ab * 10) % 2) return null;
return QD("La médiatrice du segment " + M("[AB]") + " coupe " + M("[AB]") + " au point " + M("I") + ". On sait que " + M("AB = " + N(ab)) + " cm. Combien mesure " + M("AI") + " (en cm) ?", ab / 2,
"La médiatrice d'un segment est la droite perpendiculaire à ce segment qui passe par son milieu. " + M("I") + " est le milieu de " + M("[AB]") + " : " + M("AI = " + N(ab) + " \\div 2 = " + N(rnd(ab / 2, 6))) + " cm.",
{ ctx: "milieu", fig: medFig("segment AB et sa médiatrice", { I: 1 }), guide: [GD("Par quel nombre divise-t-on " + M("AB") + " pour obtenir " + M("AI") + " ?", 2, M("I") + " est le milieu : on divise par 2."), GD(M("AI") + " (en cm) ?", ab / 2, M(N(rnd(ab / 2, 6))) + " cm.")],
traps: [TD(2 * ab, "I est le milieu de [AB] : AI est la moitié de AB."), TD(ab - 1, "AI = AB ÷ 2.")] }); },
() => { const ma = dec1(3, 8.5), ab = dec1(2.5, 7.5); if (2 * ma <= ab) return null; const p = rnd(2 * ma + ab, 6);
return QD("Le point " + M("M") + " est sur la médiatrice du segment " + M("[AB]") + ". On sait que " + M("MA = " + N(ma)) + " cm et " + M("AB = " + N(ab)) + " cm. Quel est le périmètre du triangle " + M("MAB") + " (en cm) ?", p,
"Un point de la médiatrice de " + M("[AB]") + " est à la même distance de " + M("A") + " et de " + M("B") + " : " + M("MB = MA = " + N(ma)) + " cm. Périmètre : " + M(N(ma) + " + " + N(ma) + " + " + N(ab) + " = " + N(p)) + " cm.",
{ ctx: "perimetre", fig: medFig("M sur la médiatrice de [AB]", { M: 1 }), guide: [GD(M("MB") + " (en cm) ?", ma, M(N(ma)) + " cm : " + M("M") + " est équidistant de " + M("A") + " et " + M("B") + "."), GD("Périmètre de " + M("MAB") + " (en cm) ?", p, M(N(p)) + " cm.")],
traps: [TD(ma + ab, "Il manque le côté [MB], de même longueur que [MA]."), TD(2 * ma + ab / 2, "Le côté [AB] compte en entier dans le périmètre.")] }); },
() => { const s = dec1(6, 17); const h = rnd(s / 2, 6); if (Math.round(s * 10) % 2) return null;
return QD(who() + " place un point " + M("M") + " sur la médiatrice du segment " + M("[AB]") + " et mesure : " + M("MA + MB = " + N(s)) + " cm. Combien mesure " + M("MB") + " (en cm) ?", h,
M("M") + " est sur la médiatrice de " + M("[AB]") + " : " + M("MA = MB") + ". Les deux longueurs sont égales et ont pour somme " + M(N(s)) + " : " + M("MB = " + N(s) + " \\div 2 = " + N(h)) + " cm.",
{ ctx: "somme", guide: [GD("Que vaut " + M("MA - MB") + " ?", 0, "0 : " + M("MA = MB") + "."), GD(M("MB") + " (en cm) ?", h, M(N(h)) + " cm.")],
traps: [TD(s, "C'est la somme des deux longueurs ; elles sont égales."), TD(2 * s, "MA et MB sont égales : chacune vaut la moitié de la somme.")] }); },
],
2: [
() => { const a = dec1(0.5, 4), b = rnd(a + 2 * dec1(1, 3), 6), m = rnd((a + b) / 2, 6);
return QD("Sur une droite graduée, " + M("A") + " a pour abscisse " + M(N(a)) + " et " + M("B") + " a pour abscisse " + M(N(b)) + ". La médiatrice de " + M("[AB]") + " coupe la droite graduée en un point. Quelle est son abscisse ?", m,
"La médiatrice passe par le milieu de " + M("[AB]") + ". " + M("AB = " + N(b) + " - " + N(a) + " = " + N(rnd(b - a, 6))) + ", la moitié vaut " + M(N(rnd((b - a) / 2, 6))) + " : " + M(N(a) + " + " + N(rnd((b - a) / 2, 6)) + " = " + N(m)) + ".",
{ ctx: "droite-graduee", fig: graduee(0, 10, [], [[a, "A"], [b, "B"]], "points A et B sur une droite graduée"), guide: [GD("Longueur " + M("AB") + " ?", b - a, M(N(rnd(b - a, 6)))), GD("Moitié de " + M("AB") + " ?", (b - a) / 2, M(N(rnd((b - a) / 2, 6)))), GD("Abscisse du milieu ?", m, M(N(m)) + ".")],
traps: [TD((b - a) / 2, "C'est la demi-longueur ; ajoute-la à l'abscisse de A."), TD(a + b, "Le milieu est à mi-chemin : (a + b) ÷ 2.")] }); },
() => { const t = R.int(32, 74); if (t === 60 || t === 45) return null; const m = 180 - 2 * t;
return QN("Le point " + M("M") + " est sur la médiatrice du segment " + M("[AB]") + " (et pas sur " + M("[AB]") + "). L'angle " + M("\\widehat{MAB}") + " mesure " + deg(t) + ". Quelle est la mesure de l'angle " + M("\\widehat{AMB}") + " (en degrés) ?", m,
M("MA = MB") + " : le triangle " + M("MAB") + " est isocèle en " + M("M") + ", donc " + M("\\widehat{MBA} = \\widehat{MAB} = " + t + "°") + ". Somme des angles : " + M("\\widehat{AMB} = 180° - 2 \\times " + t + "° = " + m + "°") + ".",
{ ctx: "isocele-angle", fig: medFig("triangle MAB isocèle", { M: 1 }), guide: [GR(M("\\widehat{MBA}") + " ?", t, M(t + "°") + " (triangle isocèle)."), GR(M("\\widehat{AMB}") + " ?", m, M("180 - " + 2 * t + " = " + m) + ".")],
traps: [TR(180 - t, "Les angles en A et en B sont égaux : retire " + t + "° deux fois."), TR(90 - t, "La somme des angles d'un triangle vaut 180°.")] }); },
() => { const r = dec1(2.2, 6.4), s = rnd(2 * r, 6), ask = pk(["somme", "diametre"]);
const v = ask === "somme" ? s : s;
return QD("Les médiatrices des côtés du triangle " + M("ABC") + " se coupent au point " + M("O") + ", et " + M("OA = " + N(r)) + " cm. " + (ask === "somme" ? "Combien vaut " + M("OB + OC") + " (en cm) ?" : "Quel est le diamètre du cercle circonscrit au triangle " + M("ABC") + " (en cm) ?"), v,
M("O") + " est sur la médiatrice de " + M("[AB]") + " : " + M("OB = OA") + " ; sur celle de " + M("[AC]") + " : " + M("OC = OA") + ". " + (ask === "somme" ? M("OB + OC = 2 \\times " + N(r) + " = " + N(s)) + " cm." : "Le cercle de centre " + M("O") + " passe par " + M("A") + ", " + M("B") + ", " + M("C") + " : rayon " + M(N(r)) + " cm, diamètre " + M(N(s)) + " cm."),
{ ctx: "circonscrit-" + ask, guide: [GD(M("OB") + " (en cm) ?", r, M(N(r)) + " cm."), GD(ask === "somme" ? M("OB + OC") + " ?" : "Diamètre (en cm) ?", v, M(N(v)) + " cm.")],
traps: [TD(r, ask === "somme" ? "OB et OC valent chacun " + D(r) + " cm : additionne-les." : "C'est le rayon ; le diamètre est le double."), TD(3 * r, "On ne compte pas OA.")] }); },
],
3: [
() => { const ab = dec1(3, 8), ma = dec1(ab / 2 + 1, 9.5), p = rnd(2 * ma + ab, 6);
return QD("Le point " + M("M") + " est sur la médiatrice du segment " + M("[AB]") + ". Le triangle " + M("MAB") + " a un périmètre de " + M(N(p)) + " cm et " + M("AB = " + N(ab)) + " cm. Combien mesure " + M("MA") + " (en cm) ?", ma,
M("MA = MB") + " : " + M("2 \\times MA + " + N(ab) + " = " + N(p)) + ", donc " + M("2 \\times MA = " + N(rnd(p - ab, 6))) + " et " + M("MA = " + N(ma)) + " cm.",
{ ctx: "perimetre-inverse", fig: medFig("M sur la médiatrice de [AB]", { M: 1 }), guide: [GD(M("MA + MB") + " (en cm) ?", p - ab, M(N(p) + " - " + N(ab) + " = " + N(rnd(p - ab, 6)))), GD(M("MA") + " (en cm) ?", ma, M(N(ma)) + " cm.")],
traps: [TD(p - ab, "C'est MA + MB ; les deux longueurs sont égales."), TD((p - ab) / 3, "Le périmètre a deux côtés égaux (MA et MB) et le côté AB.")] }); },
() => { const m = dec1(3, 7.5), n = dec1(2, 6); if (Math.abs(m - n) < 0.4) return null; const p = rnd(2 * (m + n), 6);
return QD("Les points " + M("M") + " et " + M("N") + " sont sur la médiatrice du segment " + M("[AB]") + ", de part et d'autre de " + M("(AB)") + ". On sait que " + M("MA = " + N(m)) + " cm et " + M("NB = " + N(n)) + " cm. Quel est le périmètre du quadrilatère " + M("AMBN") + " (en cm) ?", p,
M("MB = MA = " + N(m)) + " et " + M("NA = NB = " + N(n)) + " (équidistance). Périmètre : " + M(N(m) + " + " + N(m) + " + " + N(n) + " + " + N(n) + " = " + N(p)) + " cm. " + M("AMBN") + " est un cerf-volant.",
{ ctx: "cerf-volant", fig: sv(320, 200, pg([[60, 100], [160, 20], [260, 100], [160, 170]]) + ln(160, 8, 160, 190, "f-accent", AX) + tx(52, 104, "A", "end", 14) + tx(268, 104, "B", "start", 14) + tx(166, 20, "M", "start", 14) + tx(166, 184, "N", "start", 14), "quadrilatère AMBN"),
guide: [GD(M("MB") + " (en cm) ?", m, M(N(m)) + " cm."), GD(M("NA") + " (en cm) ?", n, M(N(n)) + " cm."), GD("Périmètre (en cm) ?", p, M(N(p)) + " cm.")],
traps: [TD(m + n, "Il y a quatre côtés : MA, MB, NB et NA."), TD(4 * m, "NA et NB ne mesurent pas MA : N est un autre point de la médiatrice.")] }); },
() => { const a = dec1(0.5, 3.5), h = dec1(1.2, 3.4), m = rnd(a + h, 6), b = rnd(a + 2 * h, 6);
return QD("Sur une droite graduée, " + M("A") + " a pour abscisse " + M(N(a)) + ". La médiatrice du segment " + M("[AB]") + " coupe la droite graduée au point d'abscisse " + M(N(m)) + ". Quelle est l'abscisse de " + M("B") + " ?", b,
"La médiatrice passe par le milieu de " + M("[AB]") + " : " + M("B") + " est aussi loin du milieu que " + M("A") + ", de l'autre côté. " + M(N(m) + " - " + N(a) + " = " + N(h)) + ", donc " + M("B") + " a pour abscisse " + M(N(m) + " + " + N(h) + " = " + N(b)) + ".",
{ ctx: "graduee-inverse", fig: graduee(0, 10, [[m, "(d)"]], [[a, "A"]], "point A et médiatrice (d) sur une droite graduée"), guide: [GD("Distance de " + M("A") + " au milieu ?", h, M(N(h))), GD("Abscisse de " + M("B") + " ?", b, M(N(b)) + ".")],
traps: [TD(m + a, "B est à la même distance du milieu que A : ajoute " + D(h) + " à " + D(m) + "."), TD(h, "C'est la demi-longueur de [AB].")] }); },
],
};


const EC = {
1: [
() => { const e = pk([50, 200, 250, 500]), c = dec1(1.5, 9.5), r = rnd((c * e) / 100, 6); if (r !== Math.round(r * 100) / 100) return null; const o = pk([["un mur", "mur"], ["une pièce", "piece"], ["un couloir", "couloir"], ["une terrasse", "terrasse"]]);
return QD("Sur un plan à l'échelle " + M("\\frac{1}{" + e + "}") + ", " + o[0] + " mesure " + cm(c) + ". Quelle est sa longueur réelle, en mètres ?", r,
"Échelle " + M("\\frac{1}{" + e + "}") + " : 1 cm sur le plan représente " + M(e) + " cm en réalité. " + M(N(c) + " \\times " + e + " = " + N(rnd(c * e, 6))) + " cm, soit " + M(N(r)) + " m.",
{ ctx: "plan-" + o[1], guide: [GD("Longueur réelle en cm ?", c * e, M(N(rnd(c * e, 6))) + " cm."), GD("En mètres ?", r, M(N(r)) + " m (on divise par 100).")],
traps: [TD(c * e, "C'est la longueur en cm ; 1 m = 100 cm."), TD((c * e) / 1000, "1 m = 100 cm : divise par 100, pas par 1 000.")] }); },
() => { const k = pk([2, 3, 4, 5, 10]), c = dec1(2.5, 9.5), r = rnd(c * k, 6), o = pk([["deux villes", "villes", "l'une de l'autre"], ["deux villages", "villages", "l'un de l'autre"], ["deux refuges", "refuges", "l'un de l'autre"], ["deux phares", "phares", "l'un de l'autre"]]);
return QD("Sur une carte, " + M("1") + " cm représente " + M(k) + " km. " + o[0][0].toUpperCase() + o[0].slice(1) + " sont à " + cm(c) + " " + o[2] + " sur la carte. Quelle est la distance réelle (en km) ?", r,
"C'est une situation de proportionnalité : " + M(N(c) + " \\times " + k + " = " + N(r)) + " km.",
{ ctx: "carte-" + o[1], guide: [GD("Combien de km pour 1 cm ?", k, M(k) + " km."), GD("Distance réelle (en km) ?", r, M(N(c) + " \\times " + k + " = " + N(r)) + " km.")],
traps: [TD(c / k, "Chaque centimètre représente " + k + " km : on multiplie."), TD(c + k, "On multiplie par " + k + ", on n'ajoute pas.")] }); },
() => { const k = pk([20, 24, 25, 30, 40, 50]), c = R.int(12, 95), r = rnd((c * k) / 100, 6), o = pk([["d'un bateau", "bateau"], ["d'un avion", "avion"], ["d'une locomotive", "train"], ["d'un camion", "camion"]]);
return QD("Une maquette " + o[0] + " est " + M(k) + " fois plus petite que l'objet réel. La maquette mesure " + cm(c) + " de long. Quelle est la longueur réelle, en mètres ?", r,
"Longueur réelle : " + M(c + " \\times " + k + " = " + N(c * k)) + " cm, soit " + M(N(r)) + " m. L'échelle de la maquette est " + M("\\frac{1}{" + k + "}") + ".",
{ ctx: "maquette-" + o[1], guide: [GD("Longueur réelle en cm ?", c * k, M(N(c * k)) + " cm."), GD("En mètres ?", r, M(N(r)) + " m.")],
traps: [TD(c * k, "C'est en cm : divise par 100 pour avoir des mètres."), TD(c / k, "L'objet réel est plus grand : on multiplie par " + k + ".")] }); },
],
2: [
() => { const e = pk([50, 100, 200, 250]), r = pk([1.2, 1.6, 2, 2.4, 3, 3.5, 4, 4.5, 5]), c = rnd((r * 100) / e, 6); if (c !== Math.round(c * 10) / 10 || c < 0.5) return null; const o = pk([["une table", "table"], ["un lit", "lit"], ["un canapé", "canape"], ["une armoire", "armoire"]]);
return QD("On dessine le plan d'un appartement à l'échelle " + M("\\frac{1}{" + e + "}") + ". Quelle longueur (en cm) faut-il tracer sur le plan pour " + o[0] + " de " + M(N(r)) + " m ?", c,
M(N(r) + " \\text{ m} = " + N(rnd(r * 100, 6)) + " \\text{ cm}") + " ; sur le plan, tout est divisé par " + M(e) + " : " + M(N(rnd(r * 100, 6)) + " \\div " + e + " = " + N(c)) + " cm.",
{ ctx: "reel-plan-" + o[1], guide: [GD("Longueur réelle en cm ?", r * 100, M(N(rnd(r * 100, 6))) + " cm."), GD("Sur le plan (en cm) ?", c, M(N(c)) + " cm.")],
traps: [TD((r * 100) * e, "Sur le plan, c'est plus petit : on divise par " + e + "."), TD(r / e, "Convertis d'abord les mètres en centimètres.")] }); },
() => { const e = pk([10000, 20000, 25000, 50000]), c = dec1(2, 12), km = rnd((c * e) / 100000, 6); if (km !== Math.round(km * 100) / 100) return null;
return QD("Sur une carte de randonnée à l'échelle " + M("\\frac{1}{" + N(e) + "}") + ", un sentier mesure " + cm(c) + ". Quelle est sa longueur réelle, en km ?", km,
M(N(c) + " \\times " + N(e) + " = " + N(rnd(c * e, 6))) + " cm. Or " + M("1\\text{ km} = 100\\,000\\text{ cm}") + " : " + M(N(km)) + " km.",
{ ctx: "carte-km", guide: [GD("Longueur réelle en cm ?", c * e, M(N(rnd(c * e, 6))) + " cm."), GD("En mètres ?", (c * e) / 100, M(N(rnd((c * e) / 100, 6))) + " m."), GD("En km ?", km, M(N(km)) + " km.")],
traps: [TD((c * e) / 1000, "1 km = 100 000 cm (1 000 m de 100 cm)."), TD((c * e) / 100, "Ce sont des mètres ; 1 km = 1 000 m.")] }); },
() => { const e = pk([50, 100, 200, 250, 500]), c = pk([2, 3, 4, 5, 6, 8]), r = rnd((c * e) / 100, 6), o = pk([["un mur", "mur"], ["une allée", "allee"], ["un bassin", "bassin"]]);
return QN("Sur un plan, " + o[0] + " de " + M(N(r)) + " m est " + (o[0].startsWith("une") ? "représentée" : "représenté")  + " par un segment de " + cm(c) + ". L'échelle du plan est " + M("\\frac{1}{n}") + ". Que vaut " + M("n") + " ?", e,
M(N(r) + " \\text{ m} = " + N(rnd(r * 100, 6)) + " \\text{ cm}") + " ; " + M(N(rnd(r * 100, 6)) + " \\div " + c + " = " + e) + " : 1 cm sur le plan représente " + M(e) + " cm en réalité.",
{ ctx: "trouver-echelle-" + o[1], guide: [GD("Longueur réelle en cm ?", r * 100, M(N(rnd(r * 100, 6))) + " cm."), GR("Combien de cm réels pour 1 cm du plan ?", e, M(e) + ".")],
traps: [TR(rnd(r / c, 9), "Mets les deux longueurs dans la même unité (cm) avant de diviser."), TR(rnd((c * 100) / r, 9), "On divise la longueur réelle par la longueur sur le plan.")] }); },
],
3: [
() => { const e = pk([50, 100, 200, 250]), Lp = dec1(2, 9), lp = dec1(1.5, 6); if (lp >= Lp) return null; const Lr = rnd((Lp * e) / 100, 6), lr = rnd((lp * e) / 100, 6); if (Lr !== Math.round(Lr * 100) / 100 || lr !== Math.round(lr * 100) / 100) return null;
return QD("Sur un plan, une chambre mesure " + cm(Lp) + " sur " + cm(lp) + ". En réalité, sa longueur est de " + M(N(Lr)) + " m. Quelle est sa largeur réelle (en m) ?", lr,
"Échelle : " + M(N(Lr) + " \\text{ m} = " + N(rnd(Lr * 100, 6)) + " \\text{ cm}") + " et " + M(N(rnd(Lr * 100, 6)) + " \\div " + N(Lp) + " = " + e) + " : " + M("\\frac{1}{" + e + "}") + ". Largeur : " + M(N(lp) + " \\times " + e + " = " + N(rnd(lp * e, 6))) + " cm, soit " + M(N(lr)) + " m.",
{ ctx: "deux-longueurs", guide: [GR("Échelle " + M("\\frac{1}{n}") + " : " + M("n") + " = ?", e, M(e) + "."), GD("Largeur réelle en cm ?", lp * e, M(N(rnd(lp * e, 6))) + " cm."), GD("En m ?", lr, M(N(lr)) + " m.")],
traps: [TD(lp * e, "Ce sont des cm : divise par 100."), TD(Lr - (Lp - lp), "Les longueurs sont proportionnelles : on ne retire pas la même différence.")] }); },
() => { const [e1, e2] = pk([[25000, 50000], [50000, 25000], [20000, 50000], [10000, 25000], [25000, 100000], [50000, 100000]]), c = pk([4, 6, 8, 10, 12, 3, 5]), v = rnd((c * e1) / e2, 6); if (v !== Math.round(v * 10) / 10) return null;
return QD("Sur une carte au " + M("\\frac{1}{" + N(e1) + "}") + ", deux sommets sont à " + cm(c) + " l'un de l'autre. À quelle distance (en cm) sont-ils sur une carte au " + M("\\frac{1}{" + N(e2) + "}") + " ?", v,
"Distance réelle : " + M(c + " \\times " + N(e1) + " = " + N(c * e1)) + " cm. Sur l'autre carte : " + M(N(c * e1) + " \\div " + N(e2) + " = " + N(v)) + " cm.",
{ ctx: "deux-cartes", guide: [GD("Distance réelle en cm ?", c * e1, M(N(c * e1)) + " cm."), GD("Sur la seconde carte (en cm) ?", v, M(N(v)) + " cm.")],
traps: [TD((c * e2) / e1, "Plus n est grand, plus la carte est réduite : la distance y est " + (e2 > e1 ? "plus petite." : "plus grande.")), TD(c * e1, "C'est la distance réelle en cm.")] }); },
() => { const e = pk([100, 200, 250, 500]), a = dec1(2, 8), b = dec1(1.5, 6); if (b >= a) return null; const p = rnd((2 * (a + b) * e) / 100, 6); if (p !== Math.round(p * 10) / 10) return null; const o = pk([["un jardin", "jardin"], ["un terrain de sport", "terrain"], ["une cour", "cour"]]);
return QD("Sur un plan à l'échelle " + M("\\frac{1}{" + e + "}") + ", " + o[0] + " rectangulaire mesure " + cm(a) + " sur " + cm(b) + ". Quel est le périmètre réel, en mètres ?", p,
"Dimensions réelles : " + M(N(rnd((a * e) / 100, 6))) + " m et " + M(N(rnd((b * e) / 100, 6))) + " m. Périmètre : " + M("2 \\times (" + N(rnd((a * e) / 100, 6)) + " + " + N(rnd((b * e) / 100, 6)) + ") = " + N(p)) + " m.",
{ ctx: "perimetre-" + o[1], guide: [GD("Longueur réelle (en m) ?", (a * e) / 100, M(N(rnd((a * e) / 100, 6))) + " m."), GD("Largeur réelle (en m) ?", (b * e) / 100, M(N(rnd((b * e) / 100, 6))) + " m."), GD("Périmètre (en m) ?", p, M(N(p)) + " m.")],
traps: [TD(2 * (a + b), "C'est le périmètre sur le plan, en cm : il faut les longueurs réelles."), TD((a + b) * e / 100, "Le périmètre compte chaque côté deux fois.")] }); },
],
};


const wheel = (cols) => { const n = cols.length, c = [160, 95], r = 80; let g = "";
cols.forEach((cl, k) => { const a0 = (2 * Math.PI * k) / n - Math.PI / 2, a1 = (2 * Math.PI * (k + 1)) / n - Math.PI / 2;
g += '<path d="M' + c[0] + "," + c[1] + " L" + (c[0] + r * Math.cos(a0)).toFixed(1) + "," + (c[1] + r * Math.sin(a0)).toFixed(1) + " A" + r + "," + r + " 0 0 1 " + (c[0] + r * Math.cos(a1)).toFixed(1) + "," + (c[1] + r * Math.sin(a1)).toFixed(1) + ' Z" class="' + (cl ? "f-fill2" : "f-soft") + '" style="stroke:var(--ink)"/>'; });
return sv(320, 190, g + '<path d="M160,6 L152,0 L168,0 Z" class="f-head"/>', "roue partagée en " + n + " secteurs égaux"); };
const PR = {
1: [
() => { const E = pk([["un nombre pair", [2, 4, 6]], ["un nombre supérieur ou égal à 5", [5, 6]], ["un multiple de 3", [3, 6]], ["un nombre inférieur à 3", [1, 2]], ["un diviseur de 6", [1, 2, 3, 6]], ["un nombre premier", [2, 3, 5]], ["un nombre différent de 6", [1, 2, 3, 4, 5]]]), f = E[1].length;
return QF("On lance un dé équilibré à six faces, numérotées de 1 à 6. Quelle est la probabilité d'obtenir " + E[0] + " ? (fraction acceptée)", f / 6,
"Les 6 issues ont la même probabilité. Issues favorables : " + E[1].join(", ") + ", soit " + M(f) + ". " + M("P = \\frac{" + f + "}{6}" + (g2(f, 6) > 1 ? " = " + F(f / 6) : "")) + ".",
{ ctx: "de", guide: [GR("Combien d'issues possibles ?", 6, M(6) + "."), GR("Combien d'issues favorables ?", f, E[1].join(", ") + "."), GR("Probabilité ?", f / 6, M(F(f / 6)) + ".")],
traps: [TR(f, "C'est le nombre d'issues favorables ; divise par le nombre d'issues possibles."), TR(f / 10, "Il y a 6 issues possibles, pas 10.")] }); },
() => { const c = { rouges: R.int(2, 7), bleues: R.int(2, 7), vertes: R.int(1, 5) }, col = pk(["rouges", "bleues", "vertes"]), n = c.rouges + c.bleues + c.vertes, f = c[col];
return QF("Un sac contient " + M(c.rouges) + " billes rouges, " + M(c.bleues) + " bleues et " + M(c.vertes) + (c.vertes > 1 ? " vertes" : " verte") + ", indiscernables au toucher. On tire une bille au hasard. Quelle est la probabilité qu'elle soit " + col.slice(0, -1) + " ? (fraction acceptée)", f / n,
"Chaque bille a la même chance d'être tirée : " + M(n) + " issues, dont " + M(f) + " favorables. " + M("P = \\frac{" + f + "}{" + n + "}" + (g2(f, n) > 1 ? " = " + F(f / n) : "")) + ".",
{ ctx: "sac", fig: FIG.urn(c), guide: [GR("Nombre de billes en tout ?", n, M(n) + "."), GR("Probabilité ?", f / n, M(F(f / n)) + ".")],
traps: [TR(f / (n - f), "On divise par le nombre total de billes, pas par le nombre des autres."), TR(1 / 3, "Il y a 3 couleurs, mais pas le même nombre de billes de chaque couleur.")] }); },
() => { const n = pk([6, 8, 10, 12]), k = R.int(2, n - 2), cols = Array.from({ length: n }, (_, i) => i < k); for (let i = n - 1; i > 0; i--) { const j = Math.floor(R.rand() * (i + 1)); [cols[i], cols[j]] = [cols[j], cols[i]]; }
return QF("La roue de loterie est partagée en " + M(n) + " secteurs de même taille ; on gagne si la flèche s'arrête sur un secteur colorié. Quelle est la probabilité de gagner ? (fraction acceptée)", k / n,
"Secteurs de même taille : les " + M(n) + " issues sont équiprobables. " + M(k) + " secteurs coloriés : " + M("P = \\frac{" + k + "}{" + n + "}" + (g2(k, n) > 1 ? " = " + F(k / n) : "")) + ".",
{ ctx: "roue", fig: wheel(cols), guide: [GR("Combien de secteurs coloriés ?", k, M(k) + "."), GR("Probabilité de gagner ?", k / n, M(F(k / n)) + ".")],
traps: [TR(k / (n - k), "On divise par le nombre total de secteurs (" + n + ")."), TR((n - k) / n, "C'est la probabilité de perdre.")] }); },
],
2: [
() => { const [w, l] = pk([["MATHEMATIQUES", "A"], ["PROBABILITE", "B"], ["ANANAS", "A"], ["PARALLELE", "L"], ["ARITHMETIQUE", "I"], ["SYMETRIQUE", "E"]]), cnt = [...w].filter((c) => c === l).length, voy = pk([0, 1]);
const v = voy ? [...w].filter((c) => "AEIOUY".includes(c)).length : cnt;
return QF("On écrit chaque lettre du mot " + w + " sur un carton (" + M(w.length) + " cartons), et on tire un carton au hasard. Quelle est la probabilité d'obtenir " + (voy ? "une voyelle (A, E, I, O, U, Y)" : "la lettre " + l) + " ? (fraction acceptée)", v / w.length,
M(w.length) + " cartons, tous avec la même chance d'être tirés. " + (voy ? "Voyelles" : "Lettres " + l) + " : " + M(v) + ". " + M("P = \\frac{" + v + "}{" + w.length + "}" + (g2(v, w.length) > 1 ? " = " + F(v / w.length) : "")) + ".",
{ ctx: "lettres-" + (voy ? "voyelle" : "lettre"), guide: [GR("Nombre de cartons ?", w.length, M(w.length) + "."), GR("Cartons favorables ?", v, M(v) + "."), GR("Probabilité ?", v / w.length, M(F(v / w.length)) + ".")],
traps: [TR(1 / w.length, "Il y a plusieurs cartons favorables : compte-les tous."), TR(voy ? 6 / 26 : 1 / 26, "On tire parmi les lettres du mot, pas dans l'alphabet.")] }); },
() => { const n = pk([100, 200, 250, 400, 500]), k = R.int(Math.round(n / 8), Math.round(n / 4)), f = rnd(k / n, 6), o = pk([["un dé", "le 6", "de", "du 6"], ["une roue de loterie", "le secteur rouge", "roue", "du secteur rouge"], ["une punaise", "« pointe en l'air »", "punaise", "de « pointe en l'air »"]]);
if (f !== Math.round(f * 1000) / 1000) return null;
return QD("On a lancé " + o[0] + " " + M(n) + " fois et noté les résultats : " + o[1] + " est sorti " + M(k) + " fois. Quelle est la fréquence d'apparition " + o[3] + " (en écriture décimale) ?", f,
"Fréquence " + M("= \\frac{" + k + "}{" + n + "} = " + N(f)) + ". Quand on répète l'expérience un grand nombre de fois, la fréquence se rapproche de la probabilité" + (o[2] === "de" ? " (ici " + M("\\frac{1}{6} \\approx 0{,}17") + ")" : "") + ".",
{ ctx: "frequence-" + o[2], guide: [GR("Effectif de " + o[1] + " ?", k, M(k) + "."), GD("Fréquence " + M("\\frac{" + k + "}{" + n + "}") + " en décimal ?", f, M(N(f)) + ".")],
traps: [TD(n / k, "Fréquence = effectif ÷ nombre total de lancers."), TD(k, "C'est l'effectif ; divise par " + n + ".")] }); },
() => { const n = pk([20, 25, 40, 50]), p = pk([0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.6]), k = rnd(n * p, 6); if (!Number.isInteger(k) || k < 2) return null; const o = pk([["boules", "rouges", "une urne", "une", "une boule rouge"], ["jetons", "gagnants", "une boîte", "un", "un jeton gagnant"], ["cartes", "gagnantes", "une pochette", "une", "une carte gagnante"] ]);
return QN(o[2][0].toUpperCase() + o[2].slice(1) + " contient " + M(n) + " " + o[0] + ". On en tire " + o[3] + " au hasard ; la probabilité d'obtenir " + o[4] + " vaut " + M(N(p)) + ". Combien y a-t-il de " + o[0] + " " + o[1] + " ?", k,
M("P = \\frac{\\text{nombre de " + o[0] + " " + o[1] + "}}{" + n + "} = " + N(p)) + ", donc il y en a " + M(N(p) + " \\times " + n + " = " + k) + ".",
{ ctx: "retrouver-effectif", guide: [GD("Calcule " + M(N(p) + " \\times " + n) + ".", k, M(k) + ".")],
traps: [TD(n / p, "On multiplie le nombre total par la probabilité."), TD(p * 100, "La probabilité n'est pas un nombre d'objets : multiplie-la par " + n + ".")] }); },
],
3: [
() => { const r = R.int(2, 6), b = r + R.int(2, 6), t = pk([[1, 2], [1, 3], [2, 3]]); let add = null;
for (let k = 1; k <= 30; k++) if ((r + k) * t[1] === (r + b + k) * t[0]) { add = k; break; }
if (!add) return null;
return QN("Une urne contient " + M(r) + " boules rouges et " + M(b) + " boules bleues. Combien de boules rouges faut-il ajouter pour que la probabilité de tirer une rouge soit égale à " + M("\\frac{" + t[0] + "}{" + t[1] + "}") + " ?", add,
"Avec " + M(add) + " rouges de plus : " + M(r + add) + " rouges sur " + M(r + b + add) + " boules, et " + M("\\frac{" + (r + add) + "}{" + (r + b + add) + "} = \\frac{" + t[0] + "}{" + t[1] + "}") + ".",
{ ctx: "ajouter-" + t.join("-"), fig: FIG.urn({ rouges: r, bleues: b }), guide: [GR("Probabilité de tirer une rouge maintenant ?", r / (r + b), M(F(r / (r + b))) + "."), GR("Nombre de rouges à ajouter ?", add, "On essaie : " + M(r + add) + " rouges sur " + M(r + b + add) + " boules.")],
traps: [TR(b, "Teste ta réponse : avec ce nombre de rouges en plus, calcule la nouvelle probabilité."), TR(add + 1, "Vérifie : la probabilité dépasse alors " + t[0] + "/" + t[1] + ".")] }); },
() => { const n = pk([120, 300, 360, 600, 900]), E = pk([["un 6", 1], ["un nombre pair", 3], ["un nombre supérieur ou égal à 5", 2], ["un multiple de 3", 2]]), v = (n * E[1]) / 6;
return QN("On lance " + M(n) + " fois un dé équilibré à six faces. Environ combien de fois peut-on s'attendre à obtenir " + E[0] + " ?", v,
M("P = \\frac{" + E[1] + "}{6}") + ". Sur un grand nombre de lancers, la fréquence est proche de la probabilité : environ " + M("\\frac{" + E[1] + "}{6} \\times " + n + " = " + v) + " fois.",
{ ctx: "attendu", guide: [GR("Probabilité d'obtenir " + E[0] + " ?", E[1] / 6, M(F(E[1] / 6)) + "."), GR("Nombre de fois attendu ?", v, M(v) + ".")],
traps: [TR(n / 6, E[1] > 1 ? "Il y a " + E[1] + " issues favorables sur 6." : "Calcule la probabilité, puis multiplie par " + n + "."), TR(n - v, "C'est le nombre de fois où l'on n'obtient pas " + E[0] + ".")] }); },
() => { let a, b, c, d; do { b = R.int(5, 12); d = R.int(5, 12); a = R.int(2, b - 2); c = R.int(2, d - 2); } while (b === d || a * d === b * c || Math.abs(a / b - c / d) > 0.15 || g2(a, b) > 1 || g2(c, d) > 1);
const best = Math.max(a / b, c / d);
return QF("Sac A : " + M(a) + " billes gagnantes sur " + M(b) + ". Sac B : " + M(c) + " billes gagnantes sur " + M(d) + ". On tire une bille au hasard dans le sac de son choix. Quelle est la plus grande des deux probabilités de gagner ? (fraction)", best,
M("P_A = \\frac{" + a + "}{" + b + "}") + " et " + M("P_B = \\frac{" + c + "}{" + d + "}") + ". Même dénominateur " + M(b * d) + " : " + M("\\frac{" + a * d + "}{" + b * d + "}") + " et " + M("\\frac{" + c * b + "}{" + b * d + "}") + ". Le sac " + (a / b > c / d ? "A" : "B") + " est le meilleur : " + M(F(best)) + ".",
{ ctx: "comparer-sacs", guide: [GR(M("P_A") + " ?", a / b, M(F(a / b)) + "."), GR(M("P_B") + " ?", c / d, M(F(c / d)) + "."), GR("La plus grande ?", best, M(F(best)) + ".")],
traps: [TR(a / b > c / d ? c / d : a / b, "Compare les fractions en les mettant au même dénominateur."), TR(a > c ? c / d : a / b, "Le sac qui a le plus de billes gagnantes n'est pas forcément le meilleur : il faut comparer aux nombres totaux.")] }); },
],
};



const cubesFig = (h, lab) => {
const nx = h.length, ny = h[0].length, s = 30, k = 0.42 * s, P = (x, y, z) => [x * s + y * k, -z * s - y * k];
let mnx = Infinity, mxx = -Infinity, mny = Infinity, mxy = -Infinity; const H = Math.max(1, ...h.flat());
for (const x of [0, nx]) for (const y of [0, ny]) for (const z of [0, H]) { const [u, v] = P(x, y, z); mnx = Math.min(mnx, u); mxx = Math.max(mxx, u); mny = Math.min(mny, v); mxy = Math.max(mxy, v); }
const ox = (320 - (mxx - mnx)) / 2 - mnx, oy = 10 - mny, Q = (x, y, z) => { const [u, v] = P(x, y, z); return [ox + u, oy + v]; };
let g = "";
for (let y = ny - 1; y >= 0; y--) for (let x = 0; x < nx; x++) for (let z = 0; z < h[x][y]; z++) {
g += pg([Q(x, y, z), Q(x + 1, y, z), Q(x + 1, y, z + 1), Q(x, y, z + 1)], "f-shape", ' stroke-width="1.3"');
g += pg([Q(x, y, z + 1), Q(x + 1, y, z + 1), Q(x + 1, y + 1, z + 1), Q(x, y + 1, z + 1)], "f-shape2", ' stroke-width="1.3"');
g += pg([Q(x + 1, y, z), Q(x + 1, y + 1, z), Q(x + 1, y + 1, z + 1), Q(x + 1, y, z + 1)], "f-shape", ' style="fill:var(--blue);fill-opacity:.5" stroke-width="1.3"');
}
return sv(320, Math.round(mxy - mny + 20), g, lab || "empilement de cubes");
};

const vueFig = (views) => { const s = 22; let g = "", x0 = 8; const Hm = Math.max(...views.map((v) => v.rows));
for (const v of views) { for (const [i, j, t] of v.cells) { g += '<rect x="' + (x0 + i * s) + '" y="' + (20 + (Hm - 1 - j) * s) + '" width="' + s + '" height="' + s + '" class="f-shape2"/>'; if (t !== undefined) g += tx(x0 + i * s + s / 2, 20 + (Hm - 1 - j) * s + 16, t, "middle", 13); }
g += tx(x0 + (v.cols * s) / 2, 14, v.nom, "middle", 12); x0 += v.cols * s + 26; }
return sv(Math.max(200, x0), 28 + Hm * s, g, "vues de l'empilement"); };
const heights = (nx, ny, hmax, holes) => { const h = Array.from({ length: nx }, () => Array(ny).fill(0));
for (let x = 0; x < nx; x++) { let prev = 0; for (let y = 0; y < ny; y++) { const z = holes && y === 0 && R.rand() < 0.25 ? 0 : R.int(Math.max(1, prev), hmax); h[x][y] = z; prev = Math.max(prev, z); } }
return h; };
const sumH = (h) => h.flat().reduce((a, b) => a + b, 0), faceV = (h) => h.map((c) => Math.max(...c)), sideV = (h) => h[0].map((_, y) => Math.max(...h.map((c) => c[y])));
const top = (h) => h.flat().filter((z) => z > 0).length;
const NOTE = " (aucun cube n'est caché : il n'y a pas de trou, chaque cube repose sur la table ou sur un autre cube)";
const EM = {
1: [
() => { const h = heights(pk([2, 3]), 2, 3), n = sumH(h); if (n < 6) return null;
return QN("Combien de cubes compte cet empilement" + NOTE + " ?", n, "On compte colonne par colonne (hauteur de chaque pile) : " + M(h.flat().filter((z) => z).join(" + ") + " = " + n) + ".",
{ ctx: "compter", fig: cubesFig(h), guide: [GR("Combien de cubes dans les piles de devant ?", h.reduce((a, c) => a + c[0], 0), "Hauteurs : " + h.map((c) => c[0]).join(", ") + "."), GR("Nombre total de cubes ?", n, M(n) + ".")],
traps: [TR(top(h), "Ce sont les piles vues de dessus ; une pile peut avoir plusieurs cubes."), TR(n - h.reduce((a, c) => a + c[0], 0), "N'oublie pas les piles de devant.")] }); },
() => { const nx = pk([3, 4]), ny = pk([2, 3]), c = []; let n = 0; for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) { const z = R.int(0, 4); if (z) { c.push([i, j, z]); n += z; } } if (c.length < 4 || n < 8) return null;
return QN("Voici la vue de dessus d'un empilement de cubes : dans chaque case, on a écrit le nombre de cubes empilés. Combien de cubes compte l'empilement ?", n, "On additionne les nombres de la vue de dessus : " + M(c.map((t) => t[2]).join(" + ") + " = " + n) + ".",
{ ctx: "dessus-nombres", fig: vueFig([{ nom: "vue de dessus", cols: nx, rows: ny, cells: c }]), guide: [GR("Combien de piles (cases occupées) ?", c.length, M(c.length) + "."), GR("Nombre de cubes ?", n, M(n) + ".")],
traps: [TR(c.length, "C'est le nombre de piles ; chaque nombre dit combien de cubes il y a dans la pile.")] }); },
() => { const h = heights(3, pk([2, 3]), 3, true), t = top(h); if (t < 4) return null;
return QN("Combien de carrés voit-on sur la vue de dessus de cet empilement" + NOTE + " ?", t, "Vu de dessus, chaque pile donne un seul carré, quelle que soit sa hauteur : " + M(t) + " piles, donc " + M(t) + " carrés.",
{ ctx: "vue-dessus", fig: cubesFig(h), guide: [GR("Combien de piles dans la rangée de devant ?", h.filter((c) => c[0] > 0).length, "Compte les piles de devant."), GR("Carrés de la vue de dessus ?", t, M(t) + ".")],
traps: [TR(sumH(h), "Vu de dessus, on ne voit que le haut de chaque pile : un carré par pile."), TR(t - h.filter((c) => c[0] > 0).length, "Compte aussi les piles de devant.")] }); },
() => { const h = heights(3, 2, 3), f = faceV(h), v = f.reduce((a, b) => a + b, 0); if (v === sumH(h)) return null;
return QN("Combien de carrés voit-on sur la vue de face de cet empilement" + NOTE + " ? (on regarde de devant, sans perspective)", v,
"De face, on voit dans chaque colonne la pile la plus haute : " + M(f.join(" + ") + " = " + v) + " carrés.",
{ ctx: "vue-face", fig: cubesFig(h), guide: [GR("Hauteur de la pile la plus haute de la colonne de gauche ?", f[0], M(f[0]) + "."), GR("Carrés de la vue de face ?", v, M(v) + ".")],
traps: [TR(sumH(h), "Les cubes de derrière sont cachés par ceux de devant (ou dépassent au-dessus) : un carré par niveau visible."), TR(h.reduce((a, c) => a + c[0], 0), "Les piles de derrière, plus hautes, dépassent au-dessus de celles de devant.")] }); },
],
2: [
() => { const h = heights(3, 2, 3), n = sumH(h), H = Math.max(...h.flat()), v = 6 * H - n; if (v < 3) return null;
return QN("Combien de cubes faut-il ajouter, au minimum, pour compléter cet empilement en un pavé droit de " + M(3) + " cubes de long, " + M(2) + " de profondeur et " + M(H) + " de haut" + NOTE + " ?", v,
"Le pavé contient " + M("3 \\times 2 \\times " + H + " = " + 6 * H) + " cubes ; l'empilement en a " + M(n) + " : il en manque " + M(6 * H - n) + ".",
{ ctx: "completer-pave", fig: cubesFig(h), guide: [GR("Cubes du pavé ?", 6 * H, M(6 * H) + "."), GR("Cubes de l'empilement ?", n, M(n) + "."), GR("Cubes à ajouter ?", v, M(v) + ".")],
traps: [TR(6 * H, "C'est le nombre de cubes du pavé ; retire ceux qui sont déjà là."), TR(n, "C'est l'empilement ; on demande ce qui manque.")] }); },
() => { const h = heights(pk([2, 3]), 3, 3), s = sideV(h), v = s.reduce((a, b) => a + b, 0); if (v === sumH(h)) return null;
return QN("Combien de carrés voit-on sur la vue de droite de cet empilement" + NOTE + " ? (on regarde depuis la droite, sans perspective)", v,
"Depuis la droite, chaque rangée (de l'avant vers l'arrière) montre sa pile la plus haute : " + M(s.join(" + ") + " = " + v) + " carrés.",
{ ctx: "vue-droite", fig: cubesFig(h), guide: [GR("Hauteur maximale dans la rangée de devant ?", s[0], M(s[0]) + "."), GR("Carrés de la vue de droite ?", v, M(v) + ".")],
traps: [TR(sumH(h), "Les piles alignées se cachent : un carré par niveau visible dans chaque rangée."), TR(faceV(h).reduce((a, b) => a + b, 0), "Ça, c'est la vue de face.")] }); },
() => { const h = heights(3, 3, 4), n = sumH(h); if (n < 12) return null;
return QN("Combien de cubes compte cet empilement" + NOTE + " ?", n, "Colonne par colonne : " + M(h.flat().filter((z) => z).join(" + ") + " = " + n) + ".",
{ ctx: "compter-grand", fig: cubesFig(h), guide: [GR("Cubes de la rangée de devant ?", h.reduce((a, c) => a + c[0], 0), "Hauteurs " + h.map((c) => c[0]).join(", ") + "."), GR("Cubes de la rangée du milieu ?", h.reduce((a, c) => a + c[1], 0), "Hauteurs " + h.map((c) => c[1]).join(", ") + "."), GR("Nombre total ?", n, M(n) + ".")],
traps: [TR(top(h) + Math.max(...h.flat()) - 1, "Compte les cubes de chaque pile, y compris ceux du bas, cachés derrière."), TR(sumH(h.map((c) => c.slice(1))), "N'oublie pas la rangée de devant.")] }); },
],
3: [
() => { let h, n, mx; for (let t = 0; t < 30; t++) { h = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => R.int(0, 3))); n = sumH(h); const f = faceV(h), s = sideV(h); mx = h.reduce((a, c, x) => a + c.reduce((b, z, y) => b + (z ? Math.min(f[x], s[y]) : 0), 0), 0); if (mx > n && top(h) >= 5 && f.every((z) => z) && s.every((z) => z)) break; mx = null; }
if (!mx) return null; const f = faceV(h), s = sideV(h), cells = []; h.forEach((c, x) => c.forEach((z, y) => { if (z) cells.push([x, y]); }));
return QN("Un empilement de cubes (sans trou) a les trois vues ci-dessous. Quel est le plus grand nombre de cubes qu'il peut contenir ?", mx,
"Sur chaque case de la vue de dessus, la pile ne peut pas dépasser la hauteur de sa colonne (vue de face) ni celle de sa rangée (vue de droite) : on prend la plus petite des deux et on additionne : " + M(mx) + " cubes.",
{ ctx: "trois-vues", fig: vueFig([{ nom: "dessus", cols: 3, rows: 3, cells }, { nom: "face", cols: 3, rows: Math.max(...f), cells: f.flatMap((z, x) => Array.from({ length: z }, (_, k) => [x, k])) }, { nom: "droite", cols: 3, rows: Math.max(...s), cells: s.flatMap((z, y) => Array.from({ length: z }, (_, k) => [y, k])) }].map((v) => Object.assign(v, { rows: 3 }))),
guide: [GR("Combien de piles (vue de dessus) ?", cells.length, M(cells.length) + "."), GR("Nombre maximal de cubes ?", mx, M(mx) + ".")],
traps: [TR(cells.length, "C'est le nombre de piles ; certaines peuvent être hautes."), TR(9 * 3, "Les piles sont limitées par la vue de face ET par la vue de droite, et seulement sur les cases de la vue de dessus.")] }); },
() => { const w = pk([1, 2, 3]), n0 = pk([3, 4]), n = R.int(6, 10), v = (w * n * (n + 1)) / 2, hh = Array.from({ length: n0 }, (_, i) => Array(w).fill(n0 - i)).reverse();
return QN("On construit un escalier en cubes, de " + M(w) + " cube" + (w > 1 ? "s" : "") + " de large : la 1re marche a 1 cube de haut, la 2e en a 2, et ainsi de suite (la figure montre un escalier de " + M(n0) + " marches). Combien de cubes faut-il pour un escalier de " + M(n) + " marches ?", v,
"La marche numéro " + M("k") + " compte " + M(w + " \\times k") + " cube" + (w > 1 ? "s" : "") + " : " + M((w > 1 ? w + " \\times " : "") + "(1 + 2 + \\dots + " + n + ") = " + (w > 1 ? w + " \\times " : "") + (n * (n + 1)) / 2 + (w > 1 ? " = " + v : "")) + ".",
{ ctx: "escalier", fig: cubesFig(hh.map((c) => c.slice()), "escalier de cubes"), guide: [GR("Somme " + M("1 + 2 + \\dots + " + n) + " ?", (n * (n + 1)) / 2, M((n * (n + 1)) / 2) + "."), GR("Nombre de cubes ?", v, M(v) + ".")],
traps: [TR(w * n * n, "Toutes les marches n'ont pas " + n + " cubes de haut : la 1re en a 1, la 2e 2…"), TR(w * n, "Chaque marche a plusieurs cubes : additionne les hauteurs.")] }); },
() => { const h = heights(3, 3, 3), n = sumH(h), v = 27 - n; if (v < 4 || n < 8) return null;
return QN("Combien de cubes faut-il ajouter, au minimum, pour transformer cet empilement en un grand cube de " + M(3) + " cubes d'arête" + NOTE + " ?", v,
"Le grand cube contient " + M("3 \\times 3 \\times 3 = 27") + " petits cubes. L'empilement en a " + M(h.flat().filter((z) => z).join(" + ") + " = " + n) + " : il en manque " + M(v) + ".",
{ ctx: "completer-cube", fig: cubesFig(h), guide: [GR("Petits cubes du grand cube ?", 27, M("3^3 = 27") + "."), GR("Cubes de l'empilement ?", n, M(n) + "."), GR("Cubes à ajouter ?", v, M(v) + ".")],
traps: [TR(9 - top(h) > 1 ? 9 - top(h) : v + 9, "Il faut compléter chaque pile jusqu'à 3 cubes de haut, pas seulement les cases vides."), TR(n, "C'est l'empilement ; on demande ce qui manque pour arriver à 27.")] }); },
],
};


const CD = {
1: [
() => { let a, b, c, d, k; for (let t = 0; t < 60; t++) { b = R.int(5, 12); d = R.int(b + 1, 16); a = R.int(2, b - 1); c = Math.round((a * d) / b); k = a * d - c * b; if (k && Math.abs(k) <= 3 && g2(a, b) === 1 && g2(c, d) === 1 && c > 1) break; k = 0; } if (!k) return null;
const v = k / (b * d);
return QF("Pour comparer " + M("A = \\frac{" + a + "}{" + b + "}") + " et " + M("B = \\frac{" + c + "}{" + d + "}") + ", on calcule " + M("A - B") + ". Donne " + M("A - B") + " sous forme de fraction.", v,
M("A - B = \\frac{" + a * d + "}{" + b * d + "} - \\frac{" + c * b + "}{" + b * d + "} = " + F(v)) + ". " + (v > 0 ? M("A - B > 0") + ", donc " + M("A > B") : M("A - B < 0") + ", donc " + M("A < B")) + ".",
{ ctx: "diff-fractions", guide: [GR("Dénominateur commun (produit des dénominateurs) ?", b * d, M(b + " \\times " + d + " = " + b * d) + "."), GR("Numérateur de " + M("A - B") + " ?", k, M(a * d + " - " + c * b + " = " + k) + "."), GR(M("A - B") + " ?", v, M(F(v)) + ".")],
traps: [TR((a - c) / (b - d), "On ne soustrait pas numérateurs et dénominateurs : mets au même dénominateur."), TR(-v, "C'est B − A : attention à l'ordre.")] }); },
() => { const [p, q, u, e1, e2] = pk([[2, 4, 2, 5, 9], [2, 4, 2, 6, 10], [2, 8, 3, 3, 7], [3, 9, 2, 4, 6], [3, 9, 2, 3, 7], [5, 25, 2, 3, 5], [2, 8, 3, 4, 10], [3, 27, 3, 2, 8]]), ex = u * e1 - e2, v = p ** ex; if (!ex) return null;
return QF("Pour comparer les nombres positifs " + M("A = " + q + "^{" + e1 + "}") + " et " + M("B = " + p + "^{" + e2 + "}") + ", on calcule " + M("\\frac{A}{B}") + ". Que vaut ce quotient ? (fraction ou entier)", v,
M(q + " = " + p + "^{" + u + "}") + ", donc " + M("A = " + p + "^{" + u * e1 + "}") + " et " + M("\\frac{A}{B} = " + p + "^{" + u * e1 + " - " + e2 + "} = " + p + "^{" + ex + "} = " + F(v)) + ". " + (v > 1 ? "Quotient > 1 : " + M("A > B") : "Quotient < 1 : " + M("A < B")) + ".",
{ ctx: "quotient-puissances", guide: [GR(M(q) + " s'écrit " + M(p + "^k") + " : " + M("k") + " = ?", u, M(q + " = " + p + "^{" + u + "}") + "."), GR("Exposant de " + M(p) + " dans " + M("\\frac{A}{B}") + " ?", ex, M(u * e1 + " - " + e2 + " = " + ex) + "."), GR(M("\\frac{A}{B}") + " ?", v, M(F(v)) + ".")],
traps: [TR(p ** (e1 - e2), "Écris d'abord " + q + " comme une puissance de " + p + "."), TR(1 / v, "C'est B ÷ A.")] }); },
() => { const a = nz(-6, 7), c = R.int(-20, 30), k = a * a - c; if (Math.abs(k) < 2 || Math.abs(a) < 2 || !c) return null;
return QN("Pour tout réel " + M("x") + ", on compare " + M("A = (x" + sg(a) + ")^2") + " et " + M("B = x^2" + sg(2 * a) + "x" + sg(c)) + " en calculant " + M("A - B") + ". Que vaut " + M("A - B") + " ?", k,
M("A = x^2" + sg(2 * a) + "x" + sg(a * a)) + ", donc " + M("A - B = " + a * a + " - " + NP(c) + " = " + k) + " : " + (k > 0 ? M("A > B") : M("A < B")) + " pour tout " + M("x") + ".",
{ ctx: "diff-identite", guide: [GR("Terme constant de " + M("A") + " développé ?", a * a, M(NP(a) + "^2 = " + a * a) + "."), GR(M("A - B") + " ?", k, M(k) + ".")],
traps: [TR(a - c, "Développe (x " + (a > 0 ? "+ " : "− ") + Math.abs(a) + ")² : le terme constant est " + a * a + "."), TR(-k, "C'est B − A.")] }); },
],
2: [
() => { const r = pk([1.2, 1.25, 1.5, 0.8, 0.75, 1.15, 0.85, 1.4, 0.6]), o = pk([["Une ville A compte", "habitants, une ville B en compte", "habitants", 2000, "villes"], ["Une entreprise A a vendu", "téléphones, une entreprise B en a vendu", "téléphones", 500, "ventes"], ["Un site A a reçu", "visites, un site B en a reçu", "visites", 1000, "visites"]]), B = o[3] * R.int(12, 60), A = rnd(B * r, 6); if (!Number.isInteger(A)) return null;
return QD(o[0] + " " + M(N(A)) + " " + o[1] + " " + M(N(B)) + ". Pour comparer, on calcule le quotient " + M("\\frac{A}{B}") + " (écriture décimale).", r,
M("\\frac{" + N(A) + "}{" + N(B) + "} = " + N(r)) + " : " + (r > 1 ? "A a " + M(N(rnd((r - 1) * 100, 6)) + "\\,\\%") + " de plus que B" : "A a " + M(N(rnd((1 - r) * 100, 6)) + "\\,\\%") + " de moins que B") + ".",
{ ctx: "quotient-" + o[4], guide: [GD(M("\\frac{A}{B}") + " ?", r, M(N(r)) + ".")],
traps: [TD(1 / r, "C'est B ÷ A : on demande A ÷ B."), TD(A - B, "C'est la différence ; on demande le quotient.")] }); },
() => { const a = R.int(3, 8);
return QN("Pour tout réel " + M("x") + ", on compare " + M("A = x^2 + " + a * a) + " et " + M("B = " + 2 * a + "x") + ". On obtient " + M("A - B = (x - k)^2") + ". Que vaut " + M("k") + " ? (" + M("A - B") + " est un carré : " + M("A \\geqslant B") + ", avec égalité pour " + M("x = k") + ".)", a,
M("A - B = x^2 - " + 2 * a + "x + " + a * a + " = (x - " + a + ")^2 \\geqslant 0") + " : " + M("k = " + a) + ". " + M("A \\geqslant B") + " pour tout " + M("x") + ", et " + M("A = B") + " seulement pour " + M("x = " + a) + ".",
{ ctx: "diff-carre", guide: [GX("Écris " + M("A - B") + " (développé).", "x^2-" + 2 * a + "*x+" + a * a, M("x^2 - " + 2 * a + "x + " + a * a) + "."), GR(M("k") + " ?", a, M("(x - " + a + ")^2 = x^2 - " + 2 * a + "x + " + a * a) + ".")],
traps: [TR(a * a, "Dans (x − k)², le terme constant est k² = " + a * a + " : k = " + a + "."), TR(2 * a, "Le double produit vaut 2k = " + 2 * a + " : k = " + a + ".")] }); },
() => { const [a, b] = pk([[2, 8], [3, 12], [2, 18], [5, 20], [3, 27], [8, 18], [6, 24]]), v = 2 * Math.sqrt(a * b);
return QN("On compare les nombres positifs " + M("A = \\sqrt{" + a + "} + \\sqrt{" + b + "}") + " et " + M("B = \\sqrt{" + (a + b) + "}") + " par leurs carrés. Que vaut " + M("A^2 - B^2") + " ?", v,
M("A^2 = " + a + " + 2\\sqrt{" + a * b + "} + " + b + " = " + (a + b) + " + " + v) + " et " + M("B^2 = " + (a + b)) + " : " + M("A^2 - B^2 = " + v + " > 0") + ". " + M("A") + " et " + M("B") + " sont positifs, donc " + M("A > B") + ".",
{ ctx: "racines-carres", guide: [GR(M("\\sqrt{" + a + "} \\times \\sqrt{" + b + "}") + " ?", Math.sqrt(a * b), M("\\sqrt{" + a * b + "} = " + Math.sqrt(a * b)) + "."), GR(M("A^2 - B^2") + " ?", v, M("2 \\times " + Math.sqrt(a * b) + " = " + v) + ".")],
traps: [TR(Math.sqrt(a * b), "(√a + √b)² = a + 2√a√b + b : il y a un double produit."), TR(a + b, "On n'a pas (√a + √b)² = a + b.")] }); },
],
3: [
() => { const [t1, t2] = pk([[30, 20], [20, 30], [25, 25], [50, 40], [40, 25], [10, 20], [60, 50], [15, 10]]), q = rnd((1 + t1 / 100) * (1 - t2 / 100), 6); if (q === 1) return null; const o = pk(["Un prix", "Le loyer d'un local", "Le nombre d'abonnés d'un club"]);
return QD(o + " augmente de " + M(t1 + "\\,\\%") + ", puis baisse de " + M(t2 + "\\,\\%") + ". On compare la valeur finale " + M("V_f") + " à la valeur de départ " + M("V_0") + " par le quotient " + M("\\frac{V_f}{V_0}") + ". Que vaut-il ?", q,
M("\\frac{V_f}{V_0} = " + N(1 + t1 / 100) + " \\times " + N(1 - t2 / 100) + " = " + N(q)) + (q > 1 ? " > 1 : la valeur a augmenté de " : " < 1 : la valeur a baissé de ") + M(N(rnd(Math.abs(q - 1) * 100, 6)) + "\\,\\%") + ".",
{ ctx: "evolutions", guide: [GD("Coefficient de la hausse ?", 1 + t1 / 100, M(N(1 + t1 / 100))), GD("Coefficient de la baisse ?", 1 - t2 / 100, M(N(1 - t2 / 100))), GD(M("\\frac{V_f}{V_0}") + " ?", q, M(N(q)) + ".")],
traps: [TD(1 + (t1 - t2) / 100, "Les pourcentages ne s'ajoutent pas : on multiplie les coefficients."), TD(q * 100, "Le quotient est un nombre sans unité, proche de 1.")] }); },
() => { const [p, r] = pk([[1, 2], [2, 1], [1, 3], [3, 1], [2, 2], [2, 3], [3, 2], [3, 3]]), q = p + r, k = p * r;
return QN("Pour tout entier " + M("n \\geqslant 1") + ", on compare " + M("A = \\frac{n + " + p + "}{n}") + " et " + M("B = \\frac{n + " + q + "}{n + " + r + "}") + ". On obtient " + M("A - B = \\frac{k}{n(n + " + r + ")}") + ". Que vaut " + M("k") + " ?", k,
"Même dénominateur " + M("n(n + " + r + ")") + " : numérateur " + M("(n + " + p + ")(n + " + r + ") - n(n + " + q + ") = n^2 + " + q + "n + " + k + " - n^2 - " + q + "n = " + k) + ". " + M("A - B > 0") + " : " + M("A > B") + " pour tout " + M("n") + ".",
{ ctx: "diff-fractions-n", guide: [GX("Développe " + M("(n + " + p + ")(n + " + r + ")") + ".", "n^2+" + q + "*n+" + k, M("n^2 + " + q + "n + " + k) + "."), GR(M("k") + " ?", k, M(k) + ".")],
traps: [TR(p - q + r === 0 ? q : p + r, "Développe (n + " + p + ")(n + " + r + ") : le terme constant est " + p + " × " + r + "."), TR(-k, "On calcule A − B, pas B − A.")] }); },
() => { const [a, b, q, k, ka, kb] = pk([[2, 3, "\\frac{32}{27}", 20, 5, 3], [2, 3, "\\frac{8}{9}", 10, 3, 2], [5, 2, "\\frac{125}{128}", 10, 3, 7], [3, 2, "\\frac{9}{8}", 20, 2, 3], [7, 2, "\\frac{49}{64}", 15, 2, 6]]), v = a ** ka / b ** kb;
return QF("On compare " + M("A = " + a + "^{" + ka * k + "}") + " et " + M("B = " + b + "^{" + kb * k + "}") + " : " + M("\\frac{A}{B} = q^{" + k + "}") + ". Quelle est la fraction " + M("q") + " ? (puis compare-la à 1)", v,
M("A = (" + a + "^{" + ka + "})^{" + k + "}") + " et " + M("B = (" + b + "^{" + kb + "})^{" + k + "}") + ", donc " + M("\\frac{A}{B} = \\left(\\frac{" + a ** ka + "}{" + b ** kb + "}\\right)^{" + k + "}") + ". " + M("q = " + q) + (v > 1 ? " > 1, donc " + M("A > B") : " < 1, donc " + M("A < B")) + ".",
{ ctx: "grandes-puissances", guide: [GR(M(a + "^{" + ka + "}") + " ?", a ** ka, M(a ** ka) + "."), GR(M(b + "^{" + kb + "}") + " ?", b ** kb, M(b ** kb) + "."), GR(M("q") + " ?", v, M(q) + ".")],
traps: [TR(1 / v, "C'est B ÷ A."), TR(rnd(a / b, 9), "Regroupe les exposants : " + a + "^" + ka * k + " = (" + a + "^" + ka + ")^" + k + ".")] }); },
],
};


const plot2 = (f, g, xr, yr, lab) => FIG.plot([{ f }, { f: g, cls: "f-blue" }], [], { xr, yr, numbers: true, label: lab });
const lr = (a, b) => (a === 1 ? "x" : a === -1 ? "-x" : N(a) + "x") + (b ? sg(b) : "");
const PC = {
1: [
() => { const a = R.int(-4, 4), b = R.int(-6, 6), c = a + nz(-4, 4), d = R.int(-8, 8), m = a - c, r = (d - b) / m; if (!Number.isInteger(r * 2) || !r) return null;
const ivs = m > 0 ? [[r, false, Infinity, false]] : [[-Infinity, false, r, false]];
return QS("Soit " + M("f(x) = x^2" + (a ? sg(a) + "x" : "") + (b ? sg(b) : "")) + " et " + M("g(x) = x^2" + (c ? sg(c) + "x" : "") + (d ? sg(d) : "")) + ". Sur quel intervalle la courbe de " + M("f") + " est-elle strictement au-dessus de celle de " + M("g") + " ?", ivs,
M("f(x) - g(x) = " + lr(m, b - d)) + ". " + M("f(x) - g(x) > 0 \\iff x " + (m > 0 ? ">" : "<") + " " + F(r)) + " (on divise par " + M(N(m)) + (m < 0 ? ", négatif : le sens change" : "") + ").",
{ ctx: "affine-diff", guide: [GX(M("f(x) - g(x)") + " ?", (m === 1 ? "" : m === -1 ? "-" : m + "*") + "x" + (b - d < 0 ? "-" + (d - b) : b - d ? "+" + (b - d) : ""), M(lr(m, b - d)) + "."), GR("Valeur qui annule " + M("f(x) - g(x)") + " ?", r, M(F(r)) + "."), { ask: "Intervalle ?", spec: solsetSpec(ivs), sol: M(m > 0 ? "]" + F(r) + " \\,;\\, +\\infty[" : "]-\\infty \\,;\\, " + F(r) + "[") + "." }],
traps: [TS(m > 0 ? [[-Infinity, false, r, false]] : [[r, false, Infinity, false]], m < 0 ? "En divisant par un nombre négatif, le sens de l'inégalité change." : "C'est là où C_f est au-dessous.")] }); },
() => { const a = R.int(-3, 3), b = R.int(-6, 6), m = nz(-4, 4), r = nz(-5, 5), c = a - m, d = b + m * r;
return QN("Les courbes de " + M("f(x) = 2x^2" + (a ? sg(a) + "x" : "") + (b ? sg(b) : "")) + " et " + M("g(x) = 2x^2" + (c ? sg(c) + "x" : "") + (d ? sg(d) : "")) + " se coupent en un seul point. Quelle est son abscisse ?", r,
M("f(x) = g(x) \\iff f(x) - g(x) = 0 \\iff " + lr(m, b - d) + " = 0 \\iff x = " + r) + ".",
{ ctx: "intersection", guide: [GR("Coefficient de " + M("x") + " dans " + M("f(x) - g(x)") + " ?", m, M(a + " - " + NP(c) + " = " + m) + "."), GR("Abscisse ?", r, M("x = " + r) + ".")],
traps: [TR(-r, "Résous " + m + "x " + (b - d < 0 ? "− " + (d - b) : "+ " + (b - d)) + " = 0 avec soin (signe)."), TR(b - d, "Il faut diviser par le coefficient de x.")] }); },
() => { const a = pk([3, 4, 5, 6, -3, -4]);
return QN("Soit " + M("f(x) = x^2 + " + a * a) + " et " + M("g(x) = " + 2 * a + "x") + ". On a " + M("f(x) - g(x) = (x " + (a > 0 ? "-" : "+") + " " + Math.abs(a) + ")^2 \\geqslant 0") + " : la courbe de " + M("f") + " est au-dessus de celle de " + M("g") + ". En quelle abscisse se touchent-elles ?", a,
M("f(x) - g(x) = (x " + (a > 0 ? "-" : "+") + " " + Math.abs(a) + ")^2") + " s'annule seulement en " + M("x = " + a) + " : les courbes se touchent en ce point (la droite est tangente à la parabole) ; partout ailleurs, " + M("C_f") + " est strictement au-dessus.",
{ ctx: "contact", fig: plot2((x) => x * x + a * a, (x) => 2 * a * x, a > 0 ? [-2, a + 3] : [a - 3, 2], [-2, a * a * 2 + 4], "parabole et droite tangente"), guide: [GR("Valeur qui annule " + M("(x " + (a > 0 ? "-" : "+") + " " + Math.abs(a) + ")^2") + " ?", a, M(a) + ".")],
traps: [TR(-a, "(x − k)² s'annule pour x = k : attention au signe."), TR(a * a, "C'est la valeur de f(x) − g(x) en 0, pas une abscisse de contact.")] }); },
],
2: [
() => { const [r1, r2] = pk([[-1, 3], [-2, 1], [1, 4], [-3, 2], [0.5, 3], [-1, 2], [2, 5]]), s = r1 + r2, p = r1 * r2;
return QS("Sur quel intervalle la parabole " + M("y = x^2") + " est-elle strictement au-dessous de la droite " + M("y = " + lr(s, -p)) + " ?", [[r1, false, r2, false]],
M("x^2 - (" + lr(s, -p) + ") = x^2" + (s ? sg(-s) + "x" : "") + (p ? sg(p) : "") + " = (x" + sg(-r1) + ")(x" + sg(-r2) + ")") + " : négatif entre les racines " + M(F(r1)) + " et " + M(F(r2)) + ". La parabole est au-dessous de la droite sur " + M("]" + F(r1) + " \\,;\\, " + F(r2) + "[") + ".",
{ ctx: "parabole-droite", fig: plot2((x) => x * x, (x) => s * x - p, [Math.min(r1, 0) - 2, Math.max(r2, 0) + 2], [-3, Math.max(r1 * r1, r2 * r2) + 3], "parabole et droite"), guide: [GSet2("Racines de " + M("x^2" + (s ? sg(-s) + "x" : "") + (p ? sg(p) : "")) + " ?", [r1, r2]), { ask: "Intervalle ?", spec: solsetSpec([[r1, false, r2, false]]), sol: M("]" + F(r1) + " \\,;\\, " + F(r2) + "[") + "." }],
traps: [TS([[-Infinity, false, r1, false], [r2, false, Infinity, false]], "C'est là où la parabole est au-dessus : un trinôme (a > 0) est négatif entre ses racines.")] }); },
() => { const [r1, r2] = pk([[-2, 3], [-1, 4], [1, 3], [-4, -1], [-3, 2], [2, 6]]), s = r1 + r2, p = r1 * r2, b = R.int(-3, 3), c = R.int(-4, 4);
const ivs = [[-Infinity, false, r1, false], [r2, false, Infinity, false]];
return QS("Soit " + M("f(x) = 2x^2" + (b - s ? sg(b - s) + "x" : "") + (c + p ? sg(c + p) : "")) + " et " + M("g(x) = x^2" + (b ? sg(b) + "x" : "") + (c ? sg(c) : "")) + ". Sur quel ensemble la courbe de " + M("f") + " est-elle strictement au-dessus de celle de " + M("g") + " ?", ivs,
M("f(x) - g(x) = x^2" + (s ? sg(-s) + "x" : "") + (p ? sg(p) : "") + " = (x" + sg(-r1) + ")(x" + sg(-r2) + ")") + ", positif à l'extérieur des racines : " + M("]-\\infty \\,;\\, " + r1 + "[ \\cup ]" + r2 + " \\,;\\, +\\infty[") + ".",
{ ctx: "deux-paraboles", guide: [GX(M("f(x) - g(x)") + " ?", "x^2" + (s ? (-s > 0 ? "+" : "") + -s + "*x" : "") + (p ? (p > 0 ? "+" : "") + p : ""), M("x^2" + (s ? sg(-s) + "x" : "") + (p ? sg(p) : "")) + "."), GSet2("Racines ?", [r1, r2]), { ask: "Ensemble ?", spec: solsetSpec(ivs), sol: M("]-\\infty \\,;\\, " + r1 + "[ \\cup ]" + r2 + " \\,;\\, +\\infty[") + "." }],
traps: [TS([[r1, false, r2, false]], "Entre les racines, f − g est négatif : C_f y est au-dessous.")] }); },
() => { const k = pk([2, 3, 4, 1.5, 2.5]), m = rnd(k - k * Math.log(k), 9);
return QR("On étudie la position de la courbe de " + M("x \\mapsto e^x") + " par rapport à la droite " + M("y = " + N(k) + "x") + " avec " + M("h(x) = e^x - " + N(k) + "x") + ". Quel est le minimum de " + M("h") + " sur " + M("\\mathbb{R}") + " ? (au centième)", m, 0.01,
M("h'(x) = e^x - " + N(k)) + ", nulle en " + M("x = \\ln " + N(k)) + " (négative avant, positive après) : minimum " + M("h(\\ln " + N(k) + ") = " + N(k) + " - " + N(k) + "\\ln " + N(k) + " \\approx " + N(rnd(m, 2))) + ". " + (m > 0 ? "Il est positif : la courbe est toujours au-dessus de la droite." : "Il est négatif : la courbe passe au-dessous de la droite autour de " + M("\\ln " + N(k)) + "."),
{ ctx: "exp-droite", guide: [GR("Abscisse du minimum (" + M("h'(x) = 0") + ", au centième) ?", Math.log(k), M("\\ln " + N(k) + " \\approx " + N(rnd(Math.log(k), 2))) + ".", 0.01), GR("Minimum (au centième) ?", m, M("\\approx " + N(rnd(m, 2))) + ".", 0.01)],
traps: [TR(rnd(1 - k * Math.log(k), 9), "h(ln k) = e^(ln k) − k ln k = k − k ln k : e^(ln k) vaut k, pas 1."), TR(rnd(Math.log(k), 9), "C'est l'abscisse du minimum ; on demande sa valeur.")] }); },
],
3: [
() => { const a = pk([2, 3, -2, -3]);
return QN("La tangente à la courbe de " + M("f(x) = x^3") + " au point d'abscisse " + M(a) + " a pour équation " + M("y = " + 3 * a * a + "x" + sg(-2 * a ** 3)) + ". En quelle autre abscisse la tangente recoupe-t-elle la courbe ? (On étudie " + M("d(x) = x^3 - " + 3 * a * a + "x" + sg(2 * a ** 3)) + ", dont " + M(a) + " est racine double.)", -2 * a,
M("(x" + sg(-a) + ")^2(x" + sg(2 * a) + ") = 0 \\iff x = " + a + " \\text{ ou } x = " + -2 * a) + ". En " + M(a) + ", c'est le point de contact ; l'autre point commun est en " + M(-2 * a) + ". Le signe de " + M("x" + sg(2 * a)) + " donne la position : courbe au-dessus de la tangente pour " + M("x > " + -2 * a) + ".",
{ ctx: "tangente-recoupe", fig: plot2((x) => x ** 3, (x) => 3 * a * a * x - 2 * a ** 3, [-Math.abs(2 * a) - 1, Math.abs(2 * a) + 1], [-30, 30], "cubique et tangente"), guide: [GX("Factorise " + M("d(x)") + " sous la forme " + M("(x" + sg(-a) + ")^2(x + c)") + " : écris " + M("d(x)") + " factorisé.", "(x" + (a > 0 ? "-" : "+") + Math.abs(a) + ")^2*(x" + (2 * a > 0 ? "+" : "-") + Math.abs(2 * a) + ")", M("(x" + sg(-a) + ")^2(x" + sg(2 * a) + ")") + " (le terme constant donne " + M("a^2 c = " + 2 * a ** 3) + ")."), GR("Autre abscisse ?", -2 * a, M(-2 * a) + ".")],
traps: [TR(a, "C'est le point de contact ; on cherche l'autre point commun."), TR(2 * a, "x " + (2 * a > 0 ? "+ " : "− ") + Math.abs(2 * a) + " = 0 donne x = " + -2 * a + ".")] }); },
() => { const p = nz(-4, 4), q = R.int(p * p + 2, p * p + 12), mx = q - p * p;
return QS("Pour quelles valeurs du réel " + M("m") + " la droite " + M("y = m") + " est-elle strictement au-dessous de la parabole " + M("y = x^2" + sg(-2 * p) + "x" + sg(q)) + " pour tout réel " + M("x") + " ?", [[-Infinity, false, mx, false]],
M("x^2" + sg(-2 * p) + "x" + sg(q) + " = (x" + sg(-p) + ")^2 + " + mx) + " : la parabole a pour minimum " + M(mx) + " (en " + M("x = " + p) + "). La droite est au-dessous partout si " + M("m < " + mx) + ".",
{ ctx: "parametre-m", guide: [GR("Abscisse du sommet ?", p, M("\\frac{" + 2 * p + "}{2} = " + p) + "."), GR("Minimum de la parabole ?", mx, M(mx) + "."), { ask: "Valeurs de " + M("m") + " ?", spec: solsetSpec([[-Infinity, false, mx, false]]), sol: M("m < " + mx) + "." }],
traps: [TS([[-Infinity, false, mx, true]], "Pour m = " + mx + ", la droite touche la parabole : « strictement au-dessous » exclut ce cas."), TS([[-Infinity, false, q, false]], "Le minimum de la parabole n'est pas " + q + " (valeur en 0) : cherche le sommet.")] }); },
() => { const r = R.int(2, 4), c = R.int(-3, 3), d = R.int(-5, 5), ivs = [[-r, false, 0, false], [r, false, Infinity, false]];
return QS("Soit " + M("f(x) = x^3" + (c ? sg(c) + "x^2" : "") + (d ? sg(d) : "")) + " et " + M("g(x) = " + (c ? co(c, "x^2") + " + " : "") + r * r + "x" + (d ? sg(d) : "")) + ". Sur quel ensemble la courbe de " + M("f") + " est-elle strictement au-dessus de celle de " + M("g") + " ?", ivs,
M("f(x) - g(x) = x^3 - " + r * r + "x = x(x - " + r + ")(x + " + r + ")") + ". Tableau de signes : positif sur " + M("]-" + r + " \\,;\\, 0[ \\cup ]" + r + " \\,;\\, +\\infty[") + ".",
{ ctx: "cubique-signe", guide: [GX(M("f(x) - g(x)") + " ?", "x^3-" + r * r + "*x", M("x^3 - " + r * r + "x") + "."), GSet2("Valeurs qui l'annulent ?", [-r, 0, r]), { ask: "Ensemble ?", spec: solsetSpec(ivs), sol: M("]-" + r + " \\,;\\, 0[ \\cup ]" + r + " \\,;\\, +\\infty[") + "." }],
traps: [TS([[r, false, Infinity, false]], "x³ − " + r * r + "x = x(x² − " + r * r + ") : trois racines, fais un tableau de signes."), TS([[-Infinity, false, -r, false], [0, false, r, false]], "C'est là où C_f est au-dessous.")] }); },
],
};
function GSet2(ask, vals) { return { ask, spec: { kind: "set", values: [...new Set(vals)] }, sol: vals.map((v) => M(F(v))).join(" ; ") + "." }; }


const IM = {
1: [
() => { const a = R.int(-2, 3), b = a + R.int(2, 5), m = R.int(1, 4), Mx = m + R.int(2, 5), up = R.rand() < 0.5, v = (up ? Mx : m) * (b - a);
return QN("Une fonction " + M("f") + " continue vérifie " + M(m + " \\leqslant f(x) \\leqslant " + Mx) + " pour tout " + M("x \\in [" + a + " \\,;\\, " + b + "]") + ". Quel " + (up ? "majorant" : "minorant") + " de " + M("\\int_{" + a + "}^{" + b + "} f(x)\\,dx") + " obtient-on en intégrant cet encadrement ?", v,
"Par positivité de l'intégrale (croissance) : " + M(m + "(" + b + " - " + NP(a) + ") \\leqslant \\int_{" + a + "}^{" + b + "} f(x)\\,dx \\leqslant " + Mx + "(" + b + " - " + NP(a) + ")") + ", soit " + M((m * (b - a)) + " \\leqslant I \\leqslant " + Mx * (b - a)) + ".",
{ ctx: "encadrement-" + (up ? "max" : "min"), guide: [GR("Longueur de l'intervalle ?", b - a, M(b + " - " + NP(a) + " = " + (b - a)) + "."), GR((up ? "Majorant" : "Minorant") + " ?", v, M(v) + ".")],
traps: [TR(up ? Mx : m, "On intègre la constante sur l'intervalle : on multiplie par sa longueur " + (b - a) + "."), TR((up ? m : Mx) * (b - a), up ? "C'est le minorant." : "C'est le majorant.")] }); },
() => { const [fx, f, a, b, fa, fb, nm] = pk([["\\sqrt{x^2 + 9}", (x) => Math.sqrt(x * x + 9), 0, 4, 3, 5, "rac9"], ["\\sqrt{x^2 + 16}", (x) => Math.sqrt(x * x + 16), 0, 3, 4, 5, "rac16"], ["\\sqrt{x^2 + 36}", (x) => Math.sqrt(x * x + 36), 0, 8, 6, 10, "rac36"], ["\\frac{12}{x + 2}", (x) => 12 / (x + 2), 1, 4, 4, 2, "inverse"], ["\\sqrt{x^2 + 25}", (x) => Math.sqrt(x * x + 25), 0, 12, 5, 13, "rac25"]]), up = R.rand() < 0.5, mn = Math.min(fa, fb), mx = Math.max(fa, fb), v = (up ? mx : mn) * (b - a);
return QN("La fonction " + M("f(x) = " + fx) + " est " + (fa < fb ? "croissante" : "décroissante") + " sur " + M("[" + a + " \\,;\\, " + b + "]") + ", avec " + M("f(" + a + ") = " + fa) + " et " + M("f(" + b + ") = " + fb) + ". Quel " + (up ? "majorant" : "minorant") + " de " + M("\\int_{" + a + "}^{" + b + "} f(x)\\,dx") + " en déduit-on ?", v,
"Sur l'intervalle, " + M(mn + " \\leqslant f(x) \\leqslant " + mx) + " ; en intégrant : " + M(mn * (b - a) + " \\leqslant \\int_{" + a + "}^{" + b + "} f(x)\\,dx \\leqslant " + mx * (b - a)) + ".",
{ ctx: "monotone-" + nm, guide: [GR("Valeur " + (up ? "maximale" : "minimale") + " de " + M("f") + " sur l'intervalle ?", up ? mx : mn, M(up ? mx : mn) + "."), GR((up ? "Majorant" : "Minorant") + " ?", v, M(v) + ".")],
traps: [TR((up ? mn : mx) * (b - a), up ? "Pour majorer, on prend la plus grande valeur de f." : "Pour minorer, on prend la plus petite valeur de f."), TR(up ? mx : mn, "Multiplie par la longueur de l'intervalle (" + (b - a) + ").")] }); },
() => { const a = R.int(0, 4), b = a + R.int(2, 6), mu = dec1(1.5, 8.5), v = rnd(mu * (b - a), 6);
return QD("La valeur moyenne d'une fonction continue " + M("f") + " sur " + M("[" + a + " \\,;\\, " + b + "]") + " vaut " + M(N(mu)) + ". Que vaut " + M("\\int_{" + a + "}^{" + b + "} f(x)\\,dx") + " ?", v,
"Valeur moyenne " + M("\\mu = \\frac{1}{b - a}\\int_a^b f(x)\\,dx") + ", donc " + M("\\int_{" + a + "}^{" + b + "} f(x)\\,dx = " + (b - a) + " \\times " + N(mu) + " = " + N(v)) + ".",
{ ctx: "valeur-moyenne", guide: [GR("Longueur " + M("b - a") + " ?", b - a, M(b - a) + "."), GD("Intégrale ?", v, M(N(v)) + ".")],
traps: [TD(mu / (b - a), "μ = I ÷ (b − a), donc I = μ × (b − a)."), TD(mu * b, "On multiplie par la longueur b − a, pas par b.")] }); },
],
2: [
() => { const b = pk([1, 2, 3]), v = rnd(1 - Math.exp(-b), 9);
return QR("Sur " + M("[0 \\,;\\, " + b + "]") + ", " + M("0 \\leqslant \\sin x \\leqslant 1") + ". Majore " + M("I = \\int_0^{" + b + "} e^{-x}\\sin x\\,dx") + " par l'intégrale de " + M("e^{-x}") + " : quel majorant obtient-on ? (au centième)", v, 0.01,
M("e^{-x} > 0") + " et " + M("\\sin x \\leqslant 1") + " : " + M("e^{-x}\\sin x \\leqslant e^{-x}") + ". Donc " + M("I \\leqslant \\int_0^{" + b + "} e^{-x}\\,dx = \\left[-e^{-x}\\right]_0^{" + b + "} = 1 - e^{-" + b + "} \\approx " + N(rnd(v, 2))) + ".",
{ ctx: "majorer-exp-sin", guide: [GX("Une primitive de " + M("e^{-x}") + " ?", "-exp(-x)", M("-e^{-x}") + "."), GR("Majorant (au centième) ?", v, M("1 - e^{-" + b + "} \\approx " + N(rnd(v, 2))) + ".", 0.01)],
traps: [TR(b, "On intègre e^(−x), pas 1 : ∫ e^(−x) dx = 1 − e^(−" + b + ")."), TR(rnd(Math.exp(-b) - 1, 9), "[−e^(−x)] de 0 à " + b + " = −e^(−" + b + ") + 1.")] }); },
() => { const a = R.int(0, 3), b = a + R.int(1, 4), up = R.rand() < 0.5, v = up ? (b - a) / (1 + a) : (b - a) / (1 + b);
return QF("La fonction " + M("f(x) = \\frac{1}{1 + x}") + " est décroissante sur " + M("[" + a + " \\,;\\, " + b + "]") + ". En déduis un " + (up ? "majorant" : "minorant") + " de " + M("\\int_{" + a + "}^{" + b + "} \\frac{dx}{1 + x}") + " (fraction).", v,
M("f(" + b + ") \\leqslant f(x) \\leqslant f(" + a + ")") + ", soit " + M(F(1 / (1 + b)) + " \\leqslant f(x) \\leqslant " + F(1 / (1 + a))) + ". En intégrant sur un intervalle de longueur " + M(b - a) + " : " + M(F((b - a) / (1 + b)) + " \\leqslant I \\leqslant " + F((b - a) / (1 + a))) + ".",
{ ctx: "decroissante-" + (up ? "max" : "min"), guide: [GR("Valeur " + (up ? "maximale" : "minimale") + " de " + M("f") + " ?", up ? 1 / (1 + a) : 1 / (1 + b), M(F(up ? 1 / (1 + a) : 1 / (1 + b))) + " (en " + (up ? a : b) + ")."), GR((up ? "Majorant" : "Minorant") + " ?", v, M(F(v)) + ".")],
traps: [TR(up ? (b - a) / (1 + b) : (b - a) / (1 + a), "f est décroissante : son maximum est en " + a + ", son minimum en " + b + "."), TR(up ? 1 / (1 + a) : 1 / (1 + b), "Multiplie par la longueur de l'intervalle.")] }); },
() => { const [fx, gx, v, sens, nm, why] = pk([["e^{x^2}", "e^{x}", Math.E - 1, "majorant", "ex2", "x^2 \\leqslant x"], ["e^{x^3}", "e^{x}", Math.E - 1, "majorant", "ex3", "x^3 \\leqslant x"], ["\\frac{1}{1 + x^2}", "\\frac{1}{1 + x}", Math.log(2), "minorant", "inv", "1 + x^2 \\leqslant 1 + x"], ["\\sqrt{x}", "x", 0.5, "minorant", "rac", "x \\leqslant \\sqrt{x}"]]);
return QR("Sur " + M("[0 \\,;\\, 1]") + ", on a " + M(why) + ". En comparant " + M(fx) + " et " + M(gx) + ", quel " + sens + " de " + M("\\int_0^{\\,1} " + fx + "\\,dx") + " obtient-on ? (au centième)", rnd(v, 9), 0.01,
"Sur " + M("[0 \\,;\\, 1]") + " : " + M(why) + ", donc " + M(fx + (sens === "majorant" ? " \\leqslant " : " \\geqslant ") + gx) + ". Par croissance de l'intégrale : " + M("\\int_0^{\\,1} " + fx + "\\,dx" + (sens === "majorant" ? " \\leqslant " : " \\geqslant ") + "\\int_0^{\\,1} " + gx + "\\,dx \\approx " + N(rnd(v, 2))) + ".",
{ ctx: "comparer-" + nm, guide: [GR(M("\\int_0^{\\,1} " + gx + "\\,dx") + " (au centième) ?", rnd(v, 9), M("\\approx " + N(rnd(v, 2))) + ".", 0.01)],
traps: [TR(1, "On intègre " + gx.replace(/\\/g, "") + " sur [0 ; 1], pas la constante 1."), TR(rnd(Math.E, 9), "∫₀¹ eˣ dx = e − 1.")] }); },
],
3: [
() => { const n = pk([2, 3, 4]), up = R.rand() < 0.5; let s = 0; for (let k = up ? 0 : 1; k < (up ? n : n + 1); k++) s += 1 / (n + k);
return QF("On encadre " + M("\\int_1^2 \\frac{dx}{x}") + " par la méthode des rectangles avec " + M(n) + " rectangles de même largeur. " + M("x \\mapsto \\frac{1}{x}") + " est décroissante : les rectangles de hauteur la valeur " + (up ? "à gauche" : "à droite") + " donnent un " + (up ? "majorant" : "minorant") + ". Lequel ? (fraction)", s,
"Largeur " + M("\\frac{1}{" + n + "}") + ". Hauteurs : " + Array.from({ length: n }, (_, k) => M(F(1 / (1 + (k + (up ? 0 : 1)) / n)))).join(", ") + ". Somme des aires : " + M(F(s) + " \\approx " + N(rnd(s, 3))) + " (et " + M("\\ln 2 \\approx 0{,}693") + ").",
{ ctx: "rectangles-" + (up ? "gauche" : "droite"), guide: [GR("Largeur d'un rectangle ?", 1 / n, M("\\frac{1}{" + n + "}") + "."), GR("Hauteur du premier rectangle ?", 1 / (1 + (up ? 0 : 1) / n), M(F(1 / (1 + (up ? 0 : 1) / n))) + "."), GR((up ? "Majorant" : "Minorant") + " ?", s, M(F(s)) + ".")],
traps: [TR(rnd(Math.log(2), 9), "C'est la valeur exacte ln 2 ; on demande la somme des rectangles."), TR(rnd(s * n, 9), "Chaque aire = largeur × hauteur : multiplie par 1/" + n + ".")] }); },
() => { const n = R.int(4, 12), up = R.rand() < 0.5, v = up ? 1 / (n + 1) : 1 / (2 * (n + 1));
return QF("Soit " + M("I_n = \\int_0^{\\,1} \\frac{x^{" + "n}}{1 + x}\\,dx") + ". Pour " + M("x \\in [0 \\,;\\, 1]") + ", " + M("\\frac{x^n}{2} \\leqslant \\frac{x^n}{1 + x} \\leqslant x^n") + ". Donne le " + (up ? "majorant" : "minorant") + " de " + M("I_{" + n + "}") + " obtenu en intégrant (fraction).", v,
M("\\int_0^{\\,1} x^n\\,dx = \\frac{1}{n + 1}") + " : " + M("\\frac{1}{2(n + 1)} \\leqslant I_n \\leqslant \\frac{1}{n + 1}") + ". Pour " + M("n = " + n) + " : " + M(F(1 / (2 * (n + 1))) + " \\leqslant I_{" + n + "} \\leqslant " + F(1 / (n + 1))) + ". Donc " + M("I_n \\to 0") + ".",
{ ctx: "majorant-xn-" + (up ? "max" : "min"), guide: [GR(M("\\int_0^{\\,1} x^{" + n + "}\\,dx") + " ?", 1 / (n + 1), M("\\frac{1}{" + (n + 1) + "}") + "."), GR((up ? "Majorant" : "Minorant") + " ?", v, M(F(v)) + ".")],
traps: [TR(up ? 1 / n : 1 / (n + 1), up ? "Une primitive de xⁿ est x^(n+1)/(n + 1)." : "Le minorant vient de xⁿ/2 : on divise encore par 2."), TR(up ? 1 / (2 * (n + 1)) : 1 / (2 * n), up ? "C'est le minorant." : "∫₀¹ xⁿ dx = 1/(n + 1).")] }); },
() => { const [s, n] = pk([[0.01, 99], [0.02, 49], [0.04, 24], [0.05, 19], [0.005, 199], [0.025, 39]]);
return QN("On sait que " + M("0 \\leqslant I_n \\leqslant \\frac{1}{n + 1}") + " pour tout entier " + M("n") + ". À partir de quel entier " + M("n") + " l'encadrement garantit-il " + M("I_n \\leqslant " + N(s)) + " ?", n,
M("\\frac{1}{n + 1} \\leqslant " + N(s) + " \\iff n + 1 \\geqslant " + N(rnd(1 / s, 6)) + " \\iff n \\geqslant " + n) + ". La suite " + M("(I_n)") + " tend vers 0 (théorème des gendarmes).",
{ ctx: "seuil", guide: [GR(M("\\frac{1}{" + N(s) + "}") + " ?", rnd(1 / s, 9), M(N(rnd(1 / s, 6))) + "."), GR(M("n") + " ?", n, M(n) + ".")],
traps: [TR(n + 1, "1/(n + 1) ≤ " + D(s) + " ⇔ n + 1 ≥ " + (n + 1) + ", donc n ≥ " + n + "."), TR(n - 1, "Pour n = " + (n - 1) + ", 1/(n + 1) = 1/" + n + " > " + D(s) + ".")] }); },
],
};


const SI = {
1: [
() => { const b = pk([2, 3]), n = pk([2, 3, 4]), v = b ** (n + 1) / (n + 1);
return QF("Pour tout entier " + M("n \\geqslant 0") + ", on pose " + M("I_n = \\int_0^{" + b + "} x^n\\,dx") + ". Calcule " + M("I_{" + n + "}") + ".", v,
"Une primitive de " + M("x^n") + " est " + M("\\frac{x^{n+1}}{n + 1}") + " : " + M("I_{" + n + "} = \\left[\\frac{x^{" + (n + 1) + "}}{" + (n + 1) + "}\\right]_0^{" + b + "} = \\frac{" + b ** (n + 1) + "}{" + (n + 1) + "}" + (Number.isInteger(v) ? " = " + v : "")) + ".",
{ ctx: "puissance", guide: [GR(M(b + "^{" + (n + 1) + "}") + " ?", b ** (n + 1), M(b ** (n + 1)) + "."), GR(M("I_{" + n + "}") + " ?", v, M(F(v)) + ".")],
traps: [TR(b ** n / n, "Une primitive de xⁿ est x^(n+1)/(n + 1)."), TR(b ** (n + 1), "N'oublie pas de diviser par n + 1.")] }); },
() => { const n = R.int(2, 7), v = 1 / ((n + 1) * (n + 2));
return QF("On pose " + M("I_n = \\int_0^{\\,1} x^n\\,dx") + ". Calcule " + M("I_{" + n + "} - I_{" + (n + 1) + "}") + " (fraction). Son signe donne le sens de variation de la suite.", v,
M("I_n = \\frac{1}{n + 1}") + " : " + M("I_{" + n + "} - I_{" + (n + 1) + "} = \\frac{1}{" + (n + 1) + "} - \\frac{1}{" + (n + 2) + "} = " + F(v) + " > 0") + " : la suite est décroissante (sur " + M("[0 \\,;\\, 1]") + ", " + M("x^{n+1} \\leqslant x^n") + ").",
{ ctx: "difference", guide: [GR(M("I_{" + n + "}") + " ?", 1 / (n + 1), M("\\frac{1}{" + (n + 1) + "}") + "."), GR(M("I_{" + (n + 1) + "}") + " ?", 1 / (n + 2), M("\\frac{1}{" + (n + 2) + "}") + "."), GR("Différence ?", v, M(F(v)) + ".")],
traps: [TR(-v, "C'est I_(n+1) − I_n."), TR(1 / (n + 1), "C'est I_" + n + " seul.")] }); },
() => { const n = pk([2, 3, 4, 5]), v = rnd((1 - Math.exp(-n)) / n, 9);
return QR("Pour tout entier " + M("n \\geqslant 1") + ", " + M("J_n = \\int_0^{\\,1} e^{-nx}\\,dx") + ". Calcule " + M("J_{" + n + "}") + " (au centième).", v, 0.01,
"Une primitive de " + M("e^{-nx}") + " est " + M("-\\frac{1}{n}e^{-nx}") + " : " + M("J_{" + n + "} = \\frac{1 - e^{-" + n + "}}{" + n + "} \\approx " + N(rnd(v, 2))) + ".",
{ ctx: "exponentielle", guide: [GX("Une primitive de " + M("e^{-" + n + "x}") + " ?", "-exp(-" + n + "*x)/" + n, M("-\\frac{1}{" + n + "}e^{-" + n + "x}") + "."), GR(M("J_{" + n + "}") + " (au centième) ?", v, M("\\approx " + N(rnd(v, 2))) + ".", 0.01)],
traps: [TR(rnd(1 - Math.exp(-n), 9), "La primitive de e^(−nx) a un facteur 1/n."), TR(rnd(Math.exp(-n), 9), "J_n = [−e^(−nx)/n] de 0 à 1 = (1 − e^(−n))/n.")] }); },
],
2: [
() => { const n = pk([2, 3]), I = [Math.E - 1]; for (let k = 0; k < 3; k++) I.push(Math.E - (k + 1) * I[k]); const v = rnd(I[n], 9);
return QR("Soit " + M("I_n = \\int_0^{\\,1} x^n e^x\\,dx") + ". Une intégration par parties donne " + M("I_{n+1} = e - (n + 1)I_n") + ", et " + M("I_0 = e - 1") + ". Calcule " + M("I_{" + n + "}") + " (au centième).", v, 0.01,
M("I_1 = e - (e - 1) = 1") + (n >= 2 ? ", " + M("I_2 = e - 2 \\times 1 = e - 2 \\approx 0{,}72") : "") + (n >= 3 ? ", " + M("I_3 = e - 3(e - 2) = 6 - 2e \\approx 0{,}56") : "") + ".",
{ ctx: "ipp-recurrence", guide: [GR(M("I_1") + " ?", 1, M("e - (e - 1) = 1") + "."), GR(M("I_" + n) + " (au centième) ?", v, M("\\approx " + N(rnd(v, 2))) + ".", 0.01)],
traps: [TR(rnd(Math.E - I[n - 1], 9), "La relation est I_(n+1) = e − (n + 1) I_n : le coefficient change à chaque étape."), TR(rnd(I[n - 1], 9), "C'est I_" + (n - 1) + ".")] }); },
() => { const n = pk([1, 2, 3]), I = [Math.log(2)]; for (let k = 0; k < 3; k++) I.push(1 / (k + 1) - I[k]); const v = rnd(I[n], 9);
return QR("Soit " + M("I_n = \\int_0^{\\,1} \\frac{x^n}{1 + x}\\,dx") + ". On a " + M("I_n + I_{n+1} = \\int_0^{\\,1} x^n\\,dx = \\frac{1}{n + 1}") + " et " + M("I_0 = \\ln 2") + ". Calcule " + M("I_{" + n + "}") + " (au centième).", v, 0.01,
M("I_1 = 1 - \\ln 2 \\approx 0{,}31") + (n >= 2 ? ", " + M("I_2 = \\frac{1}{2} - I_1 = \\ln 2 - \\frac{1}{2} \\approx 0{,}19") : "") + (n >= 3 ? ", " + M("I_3 = \\frac{1}{3} - I_2 = \\frac{5}{6} - \\ln 2 \\approx 0{,}14") : "") + ".",
{ ctx: "somme-consecutifs", guide: [GR(M("I_1") + " (au centième) ?", rnd(I[1], 9), M("1 - \\ln 2 \\approx 0{,}31") + ".", 0.01), GR(M("I_" + n) + " (au centième) ?", v, M("\\approx " + N(rnd(v, 2))) + ".", 0.01)].slice(n === 1 ? 1 : 0),
traps: [TR(rnd(1 / (n + 1), 9), "C'est I_n + I_(n+1) ; il faut retrancher le terme précédent."), TR(rnd(1 / n + I[n - 1], 9), "I_n = 1/n − I_(n−1) : on soustrait.")] }); },
() => { const n = R.int(2, 6), v = 1 / ((n + 1) * (n + 2));
return QF("Pour tout entier " + M("n \\geqslant 0") + ", " + M("I_n = \\int_0^{\\,1} x^n(1 - x)\\,dx") + ". Calcule " + M("I_{" + n + "}") + " (fraction).", v,
M("I_n = \\int_0^{\\,1} (x^n - x^{n+1})\\,dx = \\frac{1}{n + 1} - \\frac{1}{n + 2} = \\frac{1}{(n + 1)(n + 2)}") + " : " + M("I_{" + n + "} = " + F(v)) + ". La suite est décroissante et tend vers 0.",
{ ctx: "beta", guide: [GR(M("\\int_0^{\\,1} x^{" + n + "}\\,dx") + " ?", 1 / (n + 1), M("\\frac{1}{" + (n + 1) + "}") + "."), GR(M("\\int_0^{\\,1} x^{" + (n + 1) + "}\\,dx") + " ?", 1 / (n + 2), M("\\frac{1}{" + (n + 2) + "}") + "."), GR(M("I_{" + n + "}") + " ?", v, M(F(v)) + ".")],
traps: [TR(1 / (n + 1), "Développe x^n(1 − x) = xⁿ − x^(n+1) et intègre les deux termes."), TR(1 / ((n + 1) * n), "∫₀¹ x^(n+1) dx = 1/(n + 2).")] }); },
],
3: [
() => { const [txt, v, nm, why] = pk([["x^n e^x", Math.E, "ex", "I_{n+1} = e - (n + 1)I_n"], ["x^n e^{-x}", 1 / Math.E, "emx", "I_{n+1} = (n + 1)I_n - e^{-1}"], ["\\frac{x^n}{1 + x}", 0.5, "inv", "I_n + I_{n+1} = \\frac{1}{n + 1}"]]);
return QR("Soit " + M("I_n = \\int_0^{\\,1} " + txt + "\\,dx") + ". On sait que " + M(why) + ", que " + M("(I_n)") + " est décroissante et tend vers 0. Vers quelle limite tend " + M("n I_n") + " ? (au centième)", rnd(v, 9), 0.01,
nm === "ex" ? M("(n + 1)I_n = e - I_{n+1} \\to e") + ", et " + M("nI_n = (n + 1)I_n - I_n \\to e \\approx 2{,}72") + "." : nm === "emx" ? M("(n + 1)I_n = I_{n+1} + e^{-1} \\to e^{-1}") + ", donc " + M("nI_n \\to e^{-1} \\approx 0{,}37") + "." : "La suite décroît : " + M("2I_{n+1} \\leqslant I_n + I_{n+1} = \\frac{1}{n + 1} \\leqslant 2I_n") + ", d'où " + M("\\frac{n}{2(n + 1)} \\leqslant nI_n \\leqslant \\frac{n}{2n}") + " (au rang suivant) : " + M("nI_n \\to \\frac{1}{2}") + ".",
{ ctx: "limite-nIn-" + nm, guide: [GR("Limite (au centième) ?", rnd(v, 9), M("\\approx " + N(rnd(v, 2))) + ".", 0.01)],
traps: [TR(1, "Utilise la relation : isole (n + 1) I_n, puis passe à la limite (I_n → 0)."), TR(rnd(2 * v, 9), "Reprends la relation : seul un terme tend vers 0.")] }); },
() => { const n = pk([3, 4, 5]), I = [Math.PI / 2, 1]; for (let k = 2; k <= 5; k++) I.push(((k - 1) / k) * I[k - 2]); const v = rnd(I[n], 9), ex = n === 3 ? "\\frac{2}{3}" : n === 5 ? "\\frac{8}{15}" : "\\frac{3\\pi}{16}";
return QR("Soit " + M("W_n = \\int_0^{\\frac{\\pi}{2}} \\sin^n x\\,dx") + " (intégrales de Wallis). Par parties, " + M("W_{n+2} = \\frac{n + 1}{n + 2}W_n") + ", avec " + M("W_0 = \\frac{\\pi}{2}") + " et " + M("W_1 = 1") + ". Calcule " + M("W_{" + n + "}") + " (au centième).", v, 0.01,
(n % 2 ? M("W_3 = \\frac{2}{3}W_1 = \\frac{2}{3}") + (n === 5 ? ", " + M("W_5 = \\frac{4}{5}W_3 = \\frac{8}{15}") : "") : M("W_2 = \\frac{1}{2}W_0 = \\frac{\\pi}{4}") + ", " + M("W_4 = \\frac{3}{4}W_2 = \\frac{3\\pi}{16}")) + " : " + M("W_{" + n + "} = " + ex + " \\approx " + N(rnd(v, 2))) + ".",
{ ctx: "wallis", guide: [GR(M("W_{" + (n - 2) + "}") + " (au centième) ?", rnd(I[n - 2], 9), M("\\approx " + N(rnd(I[n - 2], 2))) + ".", 0.01), GR(M("W_{" + n + "}") + " (au centième) ?", v, M(ex + " \\approx " + N(rnd(v, 2))) + ".", 0.01)],
traps: [TR(rnd(((n - 1) / n) * I[n - 1], 9), "La relation relie W_(n+2) à W_n (deux rangs plus bas)."), TR(rnd((n / (n + 1)) * I[n - 2], 9), "W_(n+2) = (n + 1)/(n + 2) × W_n : pour W_" + n + ", le coefficient est " + (n - 1) + "/" + n + ".")] }); },
() => { const s = pk([0.1, 0.2, 0.125, 0.25]) , n = Math.round(1 / s);
return QN("Pour tout entier " + M("n \\geqslant 1") + ", " + M("J_n = \\int_0^{\\,1} e^{-nx}\\,dx = \\frac{1 - e^{-n}}{n}") + ". La suite est décroissante. Quel est le plus petit entier " + M("n") + " tel que " + M("J_n < " + N(s)) + " ?", n,
M("J_n < \\frac{1}{n}") + " ; pour " + M("n = " + n) + " : " + M("J_{" + n + "} = " + N(s) + "(1 - e^{-" + n + "}) < " + N(s)) + ". Pour " + M("n = " + (n - 1)) + " : " + M("J_{" + (n - 1) + "} \\approx " + N(rnd((1 - Math.exp(-(n - 1))) / (n - 1), 4)) + " > " + N(s)) + ". Donc " + M("n = " + n) + ".",
{ ctx: "seuil-exp", guide: [GR(M("J_{" + (n - 1) + "}") + " (au millième) ?", rnd((1 - Math.exp(-(n - 1))) / (n - 1), 9), M("\\approx " + N(rnd((1 - Math.exp(-(n - 1))) / (n - 1), 3))) + " : encore trop grand.", 0.001), GR(M("n") + " ?", n, M(n) + ".")],
traps: [TR(n - 1, "J_" + (n - 1) + " ≈ " + D(rnd((1 - Math.exp(-(n - 1))) / (n - 1), 3)) + " n'est pas encore sous " + D(s) + "."), TR(n + 1, "J_" + n + " est déjà sous " + D(s) + ".")] }); },
],
};




const PX = (ctx, q, parts, hints, sol, fig) => Object.assign({ ctx, q, sol, hints, parts: parts.map(([label, value, round]) => ({ label, spec: Object.assign({ kind: "value", value: round ? value : rnd(value, 12) }, round ? { round } : {}) })) }, fig ? { fig } : {});
const ang = (c1, c2, o) => Math.round((Math.acos((c1 * c1 + c2 * c2 - o * o) / (2 * c1 * c2)) * 180) / Math.PI);
const pw = (a, b, c) => { let s = a === 1 ? "x^2" : a === -1 ? "-x^2" : a + "x^2"; if (b) s += (b < 0 ? " - " : " + ") + (Math.abs(b) === 1 ? "" : Math.abs(b)) + "x"; if (c) s += (c < 0 ? " - " : " + ") + Math.abs(c); return s; };
const lw = (m, p) => (m === 1 ? "x" : m === -1 ? "-x" : m + "x") + (p ? (p < 0 ? " - " : " + ") + Math.abs(p) : "");
const fr = (n, d) => { const g = g2(n, d); return "\\frac{" + n / g + "}{" + d / g + "}"; };
const em = (v) => (Number.isInteger(v) ? N(v) : N(v) + (String(rnd(v, 6)).split(".")[1].length === 1 ? "0" : ""));
const smooth = (n) => { while (n % 2 === 0) n /= 2; while (n % 5 === 0) n /= 5; return n === 1; };
const PROBS = {
symax: [
() => { let a = 5, b = 6, c = 7; for (let k = 0; k < 60; k++) { const x = R.int(4, 9), y = R.int(4, 9), z = R.int(5, 10); if (x === y || x + y <= z + 1 || x + z <= y + 1 || y + z <= x + 1) continue; if ((x * x + z * z - y * y) / (2 * x * z) < 0.2 || (y * y + z * z - x * x) / (2 * y * z) < 0.2) continue; [a, b, c] = [x, y, z]; break; }
const A = ang(a, b, c), B = ang(a, c, b), C = 180 - A - B, aB = R.rand() < 0.5;
return PX("triangle-axe", "Le triangle ABC a pour côtés " + M("AB = " + a) + " cm, " + M("BC = " + c) + " cm, " + M("AC = " + b) + " cm et pour angles " + M("\\widehat{A} = " + A + "°") + ", " + M("\\widehat{B} = " + B + "°") + ". On trace son symétrique A'B'C' par rapport à la droite (BC).",
[[aB ? "a) Longueur A'B' (cm)" : "a) Longueur A'C' (cm)", aB ? a : b], ["b) Mesure de l'angle " + M("\\widehat{C'}") + " (degrés)", C], ["c) Périmètre du quadrilatère ABA'C (cm)", 2 * a + 2 * b]],
["La symétrie conserve les longueurs et les angles ; B et C sont sur l'axe : B' = B, C' = C.", "Le quadrilatère ABA'C a pour côtés AB, BA', A'C et CA."],
"a) " + M(aB ? "A'B' = AB = " + a : "A'C' = AC = " + b) + " cm ; b) " + M("\\widehat{C} = 180° - " + A + "° - " + B + "° = " + C + "°") + ", conservé par la symétrie ; c) " + M(a + " + " + a + " + " + b + " + " + b + " = " + (2 * a + 2 * b)) + " cm ([BC] est à l'intérieur)."); },
() => { const d = R.int(6, 15), b = R.int(2, d - 3);
return PX("jardin-allee", "Dans un jardin à la française, l'allée centrale est un axe de symétrie : chaque élément d'un côté a son symétrique de l'autre côté. Une statue S est à " + M(d) + " m de l'axe ; un banc B est à " + M(b) + " m de l'axe, du même côté, sur la même perpendiculaire à l'allée. On note S' et B' leurs symétriques.",
[["a) Distance SS' (m)", 2 * d], ["b) Distance S'B' (m)", d - b], ["c) Distance SB' (m)", d + b]],
["Un point et son symétrique sont à la même distance de l'axe, de part et d'autre.", "S' et B' sont du même côté de l'allée, sur la même perpendiculaire."],
"a) " + M(d + " + " + d + " = " + 2 * d) + " m ; b) la symétrie conserve les longueurs : " + M("S'B' = SB = " + d + " - " + b + " = " + (d - b)) + " m ; c) S et B' sont de part et d'autre de l'axe : " + M(d + " + " + b + " = " + (d + b)) + " m."); },
() => { const L = R.int(4, 9), l = dec1(2, Math.min(L - 0.5, 6));
return PX("rectangle-double", "Le rectangle ABCD a pour longueur " + M("AB = " + L) + " cm et pour largeur " + M("BC = " + N(l)) + " cm. On trace son symétrique par rapport à la droite (BC) : avec le rectangle de départ, il forme un grand rectangle.",
[["a) Longueur AA' (cm)", 2 * L], ["b) Périmètre du grand rectangle (cm)", 4 * L + 2 * l], ["c) Aire du grand rectangle (cm²)", 2 * L * l]],
["A' est le symétrique de A : B est le milieu de [AA'].", "Le grand rectangle mesure " + 2 * L + " cm sur " + D(l) + " cm."],
"a) " + M("AA' = 2 \\times " + L + " = " + 2 * L) + " cm ; b) " + M("2 \\times (" + 2 * L + " + " + N(l) + ") = " + N(4 * L + 2 * l)) + " cm ; c) " + M(2 * L + " \\times " + N(l) + " = " + N(2 * L * l)) + " cm²."); },
],
mediatrice: [
() => { const ab = R.int(6, 14), r = R.int(Math.floor(ab / 2) + 2, ab + 2), bc = R.int(Math.max(4, ab - 4), Math.min(2 * r - 2, ab + 6));
return PX("puits", "Trois maisons A, B et C forment un triangle. On veut creuser un puits P à égale distance des trois maisons. On mesure " + M("AB = " + ab) + " m, " + M("BC = " + bc) + " m et la distance " + M("PA = " + r) + " m.",
[["a) Distance PB (m)", r], ["b) Périmètre du triangle PAB (m)", 2 * r + ab], ["c) Périmètre du triangle PBC (m)", 2 * r + bc]],
["P est sur la médiatrice de [AB] et sur celle de [BC] : c'est le centre du cercle qui passe par A, B et C.", "Équidistant des trois : PA = PB = PC."],
"a) " + M("PB = PA = " + r) + " m ; b) " + M(r + " + " + r + " + " + ab + " = " + (2 * r + ab)) + " m ; c) " + M("PB = PC = " + r) + " : " + M(r + " + " + r + " + " + bc + " = " + (2 * r + bc)) + " m."); },
() => { const ab = R.int(4, 12), x = dec1(ab / 2 + 1, ab + 3);
return PX("salle-villages", "Deux villages A et B sont distants de " + M(ab) + " km. Ils construisent une salle de sport commune M, à la même distance des deux villages, à " + M(N(x)) + " km de A. On note I le milieu de [AB].",
[["a) Distance MB (km)", x], ["b) Distance AI (km)", ab / 2], ["c) Longueur du trajet A → M → B (km)", 2 * x]],
["M est à égale distance de A et de B : il est sur la médiatrice de [AB].", "La médiatrice passe par le milieu I de [AB]."],
"a) " + M("MB = MA = " + N(x)) + " km ; b) " + M("AI = " + ab + " \\div 2 = " + N(ab / 2)) + " km ; c) " + M(N(x) + " + " + N(x) + " = " + N(2 * x)) + " km."); },
() => { const t = R.int(30, 60), c = R.int(Math.floor(t / 2) + 5, t), d = R.int(c + 15, c + 40), w = who();
return PX("cerf-volant", w + " fabrique un cerf-volant ACBD. La baguette transversale [AB] mesure " + M(t) + " cm ; les points C et D sont sur la médiatrice de [AB], de part et d'autre. " + M("CA = " + c) + " cm et " + M("DA = " + d) + " cm.",
[["a) Longueur CB (cm)", c], ["b) Longueur DB (cm)", d], ["c) Longueur de ficelle pour faire le tour ACBD (cm)", 2 * c + 2 * d]],
["Un point de la médiatrice de [AB] est à égale distance de A et de B.", "Le tour : AC + CB + BD + DA."],
"a) " + M("CB = CA = " + c) + " cm ; b) " + M("DB = DA = " + d) + " cm ; c) " + M(c + " + " + c + " + " + d + " + " + d + " = " + (2 * c + 2 * d)) + " cm."); },
],
echelle6: [
() => { const [s, T, v] = pk([[25000, R.int(3, 8), 4], [50000, R.int(5, 12), 4], [25000, R.int(4, 9), 5]]), tot = (T * 100000) / s;
let a, b, c; for (let k = 0; k < 40; k++) { a = dec1(tot / 5, tot / 2); b = dec1(tot / 6, tot / 2.5); c = rnd(tot - a - b, 6); if (c >= tot / 6) break; }
if (!(c >= tot / 6)) { a = rnd(tot / 2, 1); b = rnd(tot / 4, 1); c = rnd(tot - a - b, 6); }
const mn = (60 * T) / v;
return PX("carte-rando", "Sur une carte au " + M("1/" + N(s)) + ", " + who() + " trace son parcours de randonnée : " + M(N(a)) + " cm, puis " + M(N(b)) + " cm, puis " + M(N(c)) + " cm.",
[["a) Longueur du parcours sur la carte (cm)", tot], ["b) Longueur réelle (km)", T], ["c) Durée à " + v + " km/h (minutes)", mn]],
["Additionne, puis multiplie par " + N(s).replace("\\,", " ") + " (cm), et convertis : 1 km = 100 000 cm.", "À " + v + " km/h, 1 km prend " + 60 / v + " minutes."],
"a) " + M(N(a) + " + " + N(b) + " + " + N(c) + " = " + N(tot)) + " cm ; b) " + M(N(tot) + " \\times " + N(s) + " = " + N(tot * s)) + " cm = " + M(N(T)) + " km ; c) " + M(N(T) + " \\times " + 60 / v + " = " + N(mn)) + " minutes."); },
() => { const s = pk([50, 100]), room = pk(["le salon", "la chambre", "la cuisine", "la salle de jeux"]), Lr = pk(s === 50 ? [3.5, 4, 4.5, 5, 5.5, 6] : [4, 5, 6, 7, 8]), lr = pk([2.5, 3, 3.5, 4].filter((x) => x < Lr)), Lp = (Lr * 100) / s, lp = (lr * 100) / s;
return PX("plan-maison", "Sur le plan d'un appartement au " + M("1/" + s) + ", " + room + " est un rectangle de " + M(N(Lp)) + " cm sur " + M(N(lp)) + " cm.",
[["a) Longueur réelle (m)", Lr], ["b) Largeur réelle (m)", lr], ["c) Aire réelle de la pièce (m²)", Lr * lr]],
["1 cm sur le plan représente " + s + " cm, soit " + D(s / 100) + " m, en réalité.", "Aire d'un rectangle : longueur × largeur, avec les mesures réelles."],
"a) " + M(N(Lp) + " \\times " + s + " = " + N(Lr * 100)) + " cm = " + M(N(Lr)) + " m ; b) " + M(N(lp) + " \\times " + s + " = " + N(lr * 100)) + " cm = " + M(N(lr)) + " m ; c) " + M(N(Lr) + " \\times " + N(lr) + " = " + N(Lr * lr)) + " m²."); },
() => { const [obj, s, Lr, h, pr] = pk([["d'un paquebot", 400, 4 * R.int(50, 80), ["la cheminée", "de la cheminée"], [5, 6, 7, 8]], ["d'un voilier", 100, R.int(14, 25), ["le mât", "du mât"], [12, 14, 15, 16]], ["d'un avion de ligne", 200, 2 * R.int(15, 35), ["la dérive", "de la dérive"], [4, 5, 6]], ["d'un pont", 500, 5 * R.int(40, 90), ["une pile", "d'une pile"], [4, 6, 8]]]), Lm = (Lr * 100) / s, hm = pk(pr), hr = (hm * s) / 100, s2 = s / 2;
return PX("maquette", "On construit la maquette " + obj + " au " + M("1/" + s) + ". En réalité, il mesure " + M(N(Lr)) + " m de long. Sur la maquette, " + h[0] + " mesure " + M(N(hm)) + " cm.",
[["a) Longueur de la maquette (cm)", Lm], ["b) Hauteur réelle " + h[1] + " (m)", hr], ["c) Longueur d'une maquette deux fois plus grande, au 1/" + s2 + " (cm)", 2 * Lm]],
["Réel → maquette : divise par " + s + " (en cm : " + N(Lr) + " m = " + N(Lr * 100).replace("\\,", " ") + " cm).", "Maquette → réel : multiplie par " + s + ", puis convertis en m."],
"a) " + M(N(Lr * 100) + " \\div " + s + " = " + N(Lm)) + " cm ; b) " + M(N(hm) + " \\times " + s + " = " + N(hr * 100)) + " cm = " + M(N(hr)) + " m ; c) au " + M("1/" + s2) + " : " + M(N(Lr * 100) + " \\div " + s2 + " = " + N(2 * Lm)) + " cm."); },
],
proba6: [
() => { let r, b, v, T, t, x; for (let k = 0; k < 200; k++) { t = pk([0.25, 0.2, 0.5, 0.4]); r = R.int(2, 8); const Tp = r / t; if (!Number.isInteger(Tp) || Tp <= r + 1) continue; x = R.int(2, 6); T = Tp + x; if (!smooth(T)) continue; v = R.int(x + 1, T - r - 1); b = T - r - v; if (b >= 1 && v > x) break; T = 0; }
if (!T) { r = 4; b = 6; v = 10; T = 20; t = 0.25; x = 4; }
const C = pk([{ o: "billes", s: "un sac", a: "rouges", A: "une bille rouge", b: "bleues", c: "vertes", Cn: "une bille verte", pa: "bille rouge" }, { o: "jetons", s: "une boîte", a: "jaunes", A: "un jeton jaune", b: "noirs", c: "blancs", Cn: "un jeton blanc", pa: "jeton jaune" }, { o: "bonbons", s: "un sachet", a: "à la fraise", A: "un bonbon à la fraise", b: "au citron", c: "à la menthe", Cn: "un bonbon à la menthe", pa: "bonbon à la fraise" }]);
return PX("sac-" + C.o, (C.s[0].toUpperCase() + C.s.slice(1)) + " contient " + r + " " + C.o + " " + C.a + ", " + b + " " + C.o + " " + C.b + " et " + v + " " + C.o + " " + C.c + ". On en tire un au hasard.",
[["a) Probabilité de tirer " + C.A + " (décimal ou fraction)", r / T], ["b) Probabilité de ne pas tirer " + C.Cn + " (décimal ou fraction)", (r + b) / T], ["c) Nombre de " + C.o + " " + C.c + " à retirer pour que la probabilité de tirer " + C.A + " soit " + D(t), x]],
["Il y a " + T + " " + C.o + ". P = issues favorables ÷ issues possibles.", "c) Les " + r + " " + C.o + " " + C.a + " doivent représenter " + D(t) + " du total : " + r / t + " " + C.o + " en tout."],
"a) " + M(fr(r, T) + " = " + N(r / T)) + " ; b) " + M(fr(r + b, T) + " = " + N((r + b) / T)) + " ; c) il faut " + M(N(r) + " \\div " + N(t) + " = " + r / t) + " " + C.o + " en tout : on en retire " + M(T + " - " + r / t + " = " + x) + "."); },
() => { const n = pk([8, 10, 20]), r = R.int(1, Math.floor(n / 4)), j = R.int(1, Math.floor(n / 4)), bl = n - r - j, x = R.int(1, Math.min(bl - 1, Math.floor(n / 4))), t = (r + x) / n;
return PX("roue", "Une roue de loterie est partagée en " + n + " secteurs égaux : " + r + " rouge" + (r > 1 ? "s" : "") + ", " + j + " jaune" + (j > 1 ? "s" : "") + " et les autres bleus. On fait tourner la roue.",
[["a) Probabilité de tomber sur le rouge (décimal ou fraction)", r / n], ["b) Probabilité de ne pas tomber sur le bleu (décimal ou fraction)", (r + j) / n], ["c) Combien de secteurs bleus faut-il repeindre en rouge pour que P(rouge) = " + D(t) + " ?", x]],
["Il y a " + bl + " secteurs bleus.", "c) P(rouge) = " + D(t) + " correspond à " + D(t) + " × " + n + " secteurs rouges."],
"a) " + M(fr(r, n) + " = " + N(r / n)) + " ; b) " + (r + j) + " secteurs ne sont pas bleus : " + M(fr(r + j, n) + " = " + N((r + j) / n)) + " ; c) il faut " + M(N(t) + " \\times " + n + " = " + (r + x)) + " secteurs rouges : on en repeint " + M((r + x) + " - " + r + " = " + x) + "."); },
() => { const n = pk([20, 25, 40, 50]), m = pk([2, 4, 5, 10].filter((u) => u !== n)), k = R.int(Math.floor(n / 2), n - 3), nm = Math.floor(n / m);
return PX("cartes-numeros", "Une boîte contient " + n + " cartes numérotées de 1 à " + n + ". On tire une carte au hasard.",
[["a) Probabilité d'obtenir un multiple de " + m + " (décimal ou fraction)", nm / n], ["b) Probabilité d'obtenir un nombre supérieur ou égal à " + k + " (décimal ou fraction)", (n - k + 1) / n], ["c) On retire toutes les cartes multiples de " + m + ". Combien de cartes reste-t-il ?", n - nm]],
["Compte les multiples de " + m + " entre 1 et " + n + " : " + m + ", " + 2 * m + ", " + 3 * m + "…", "De " + k + " à " + n + ", il y a " + n + " − " + k + " + 1 nombres."],
"a) " + nm + " multiples de " + m + " : " + M(fr(nm, n) + " = " + N(nm / n)) + " ; b) " + (n - k + 1) + " cartes de " + k + " à " + n + " : " + M(fr(n - k + 1, n) + " = " + N((n - k + 1) / n)) + " ; c) " + M(n + " - " + nm + " = " + (n - nm)) + " cartes."); },
],
empil: [
() => { const n1 = pk([3, 4]), n2 = R.int(5, 7), sq = (n) => (n * (n + 1) * (2 * n + 1)) / 6, ls = (n) => Array.from({ length: n }, (_, i) => (i + 1) * (i + 1)).join(" + ");
return PX("pyramide-cubes", "On construit une pyramide de cubes à étages carrés : l'étage du haut a 1 cube, celui du dessous 2 × 2 cubes, puis 3 × 3, et ainsi de suite.",
[["a) Cubes d'une pyramide de " + n1 + " étages", sq(n1)], ["b) Cubes d'une pyramide de " + n2 + " étages", sq(n2)], ["c) Carrés de la vue de dessus (" + n2 + " étages)", n2 * n2]],
["Additionne les carrés 1² + 2² + 3² + …", "Vue de dessus : les étages du haut sont posés sur celui du bas, on ne voit que la surface de l'étage du bas."],
"a) " + M(ls(n1) + " = " + sq(n1)) + " ; b) " + M(ls(n2) + " = " + sq(n2)) + " ; c) la vue de dessus a la taille de l'étage du bas : " + M(n2 + " \\times " + n2 + " = " + n2 * n2) + " carrés."); },
() => { const n = R.int(4, 8), p = R.int(2, 4), tr = (n * (n + 1)) / 2;
return PX("escalier-cubes", "On construit un escalier de " + n + " marches avec des cubes : la 1re marche est haute de 1 cube, la 2e de 2 cubes, et ainsi de suite ; l'escalier a " + p + " cubes de largeur.",
[["a) Carrés de la vue de côté (le profil de l'escalier)", tr], ["b) Nombre de cubes de l'escalier", p * tr], ["c) Carrés de la vue de dessus", n * p]],
["Vue de côté : 1 + 2 + 3 + … + " + n + " carrés.", "Chaque carré du profil correspond à une rangée de " + p + " cubes."],
"a) " + M(Array.from({ length: n }, (_, i) => i + 1).join(" + ") + " = " + tr) + " ; b) " + M(tr + " \\times " + p + " = " + p * tr) + " cubes ; c) vue de dessus : " + n + " marches de " + p + " carrés, " + M(n + " \\times " + p + " = " + n * p) + "."); },
() => { const c = R.int(4, 7), h = R.int(3, 8), e = 4 * (c - 1);
return PX("tour-creuse", "Une tour creuse est faite de cubes : chaque étage est le contour d'un carré de " + c + " cubes de côté (vide au milieu), et la tour a " + h + " étages.",
[["a) Cubes d'un étage", e], ["b) Cubes de la tour", e * h], ["c) Cubes à ajouter pour la remplir entièrement", (c - 2) * (c - 2) * h]],
["Un étage : 4 côtés de " + c + " cubes, mais les 4 coins sont comptés deux fois.", "Le vide au milieu est un carré de " + (c - 2) + " cubes de côté, sur " + h + " étages."],
"a) " + M("4 \\times " + c + " - 4 = " + e) + " ; b) " + M(e + " \\times " + h + " = " + e * h) + " ; c) " + M((c - 2) + " \\times " + (c - 2) + " \\times " + h + " = " + (c - 2) * (c - 2) * h) + " cubes."); },
],
compdiff: [
() => { const prod = pk(["café", "fromage", "chocolat", "thé"]); let pa = 24, pb = 25; for (let k = 0; k < 60; k++) { const b = pk([16, 20, 25, 40, 50]), a = rnd(b * pk([0.8, 0.85, 0.88, 0.9, 0.92, 0.95, 0.96, 1.04, 1.05, 1.08, 1.1, 1.12, 1.2, 1.25]), 6); if (Number.isInteger(a) && a !== b) { pa = a; pb = b; break; } }
const mA = pk([250, 400, 500, 750, 200]), mB = pk([250, 400, 500, 1000, 200].filter((u) => u !== mA)), prA = rnd((pa * mA) / 1000, 2), prB = rnd((pb * mB) / 1000, 2), q = rnd(pa / pb, 4), eu = (v) => M(em(v)) + " €";
return PX("prix-kg-" + prod, "Au rayon " + prod + ", on compare deux paquets : A coûte " + eu(prA) + " pour " + M(mA) + " g, B coûte " + eu(prB) + " pour " + M(mB) + " g.",
[["a) Prix de A au kg (€)", pa], ["b) Prix de B au kg (€)", pb], ["c) Quotient prix de A ÷ prix de B, au kg", q]],
["Prix au kg = prix ÷ masse en kg.", "c) Un quotient inférieur à 1 : A est moins cher au kilo ; supérieur à 1 : plus cher."],
"a) " + M(em(prA) + " \\div " + N(mA / 1000) + " = " + N(pa)) + " € ; b) " + M(em(prB) + " \\div " + N(mB / 1000) + " = " + N(pb)) + " € ; c) " + M("\\frac{" + N(pa) + "}{" + N(pb) + "} = " + N(q) + (q < 1 ? " < 1" : " > 1")) + " : A est " + N(Math.abs(rnd((1 - q) * 100, 2))).replace("{,}", ",") + " % " + (q < 1 ? "moins" : "plus") + " cher au kilo."); },
() => { const p1 = 100 * R.int(80, 400), k1 = pk([1.04, 1.05, 1.06, 1.08]), q1 = 100 * R.int(10, 40), k2 = pk([1.15, 1.2, 1.25, 1.3]), p2 = Math.round(p1 * k1), q2 = Math.round(q1 * k2);
return PX("population", "En dix ans, la ville A est passée de " + M(N(p1)) + " à " + M(N(p2)) + " habitants, et le village B de " + M(N(q1)) + " à " + M(N(q2)) + " habitants.",
[["a) Augmentation de A (habitants)", p2 - p1], ["b) Augmentation de B (habitants)", q2 - q1], ["c) Quotient nouvelle population ÷ ancienne pour B", k2]],
["Comparer par différence : nouvelle − ancienne.", "Comparer par quotient : nouvelle ÷ ancienne ; c'est le coefficient multiplicateur."],
"a) " + M(N(p2) + " - " + N(p1) + " = " + N(p2 - p1)) + " ; b) " + M(N(q2) + " - " + N(q1) + " = " + N(q2 - q1)) + " ; c) " + M(N(q2) + " \\div " + N(q1) + " = " + N(k2)) + " (+ " + Math.round((k2 - 1) * 100) + " %, contre + " + Math.round((k1 - 1) * 100) + " % pour A) : A gagne plus d'habitants, mais B grandit plus vite."); },
() => { const cA = pk([5.5, 6, 6.4, 7, 7.5, 8]), cB = pk([4, 4.5, 5, 5.2, 5.6].filter((u) => u < cA - 0.3)), dA = pk([250, 400, 500, 600, 800]), dB = pk([250, 400, 500, 600, 800].filter((u) => u !== dA)), lA = rnd((cA * dA) / 100, 2), lB = rnd((cB * dB) / 100, 2);
return PX("consommation", "La voiture A a consommé " + M(N(lA)) + " L d'essence pour " + M(dA) + " km, la voiture B " + M(N(lB)) + " L pour " + M(dB) + " km.",
[["a) Consommation de A aux 100 km (L)", cA], ["b) Consommation de B aux 100 km (L)", cB], ["c) Différence des consommations aux 100 km, A − B (L)", rnd(cA - cB, 6)]],
["Aux 100 km : litres ÷ km × 100.", "On ne compare les litres consommés qu'à distance égale."],
"a) " + M(N(lA) + " \\div " + dA + " \\times 100 = " + N(cA)) + " L ; b) " + M(N(lB) + " \\div " + dB + " \\times 100 = " + N(cB)) + " L ; c) " + M(N(cA) + " - " + N(cB) + " = " + N(rnd(cA - cB, 6))) + " L : B consomme moins."); },
],
posrelc: [
() => { const r1 = R.int(-3, 3), w = pk([2, 4, 6]), r2 = r1 + w, m = pk([-3, -2, -1, 1, 2, 3]), p = R.int(-4, 4), b = m - (r1 + r2), c = r1 * r2 + p, mn = -((w / 2) ** 2);
return PX("parabole-droite", "Soit " + M("f(x) = " + pw(1, b, c)) + " et " + M("g(x) = " + lw(m, p)) + ". On étudie " + M("d(x) = f(x) - g(x)") + " pour comparer les courbes de f et g.",
[["a) Plus petite abscisse d'un point commun", r1], ["b) Plus grande abscisse d'un point commun", r2], ["c) Valeur minimale de d(x)", mn]],
["d(x) = " + pw(1, -(r1 + r2), r1 * r2).replace(/\^2/, "²").replace(/-/g, "−") + " : cherche ses racines.", "Le minimum d'un trinôme est atteint au milieu des racines, ici en x = " + String((r1 + r2) / 2).replace("-", "−") + "."],
"a) et b) " + M("d(x) = " + pw(1, -(r1 + r2), r1 * r2) + " = (x " + (r1 < 0 ? "+ " + -r1 : "- " + r1) + ")(x " + (r2 < 0 ? "+ " + -r2 : "- " + r2) + ")").replace("(x - 0)", "x") + " s'annule en " + M(r1) + " et " + M(r2) + " ; la courbe de f est au-dessous de celle de g entre ces deux valeurs ; c) " + M("d(" + (r1 + r2) / 2 + ") = " + mn) + "."); },
() => { const r1 = R.int(-3, 2), w = pk([2, 4]), r2 = r1 + w, u = R.int(-3, 3), v = R.int(-2, 5), s = r1 + r2, P0 = r1 * r2, b = u - 2 * s, c = v + 2 * P0, mn = -2 * (w / 2) ** 2;
return PX("deux-paraboles", "Soit " + M("f(x) = " + pw(1, b, c)) + " et " + M("g(x) = " + pw(-1, u, v)) + ". On étudie la position relative des deux paraboles.",
[["a) Plus petite abscisse d'un point d'intersection", r1], ["b) Plus grande abscisse d'un point d'intersection", r2], ["c) Valeur minimale de f(x) − g(x)", mn]],
["f(x) − g(x) = " + pw(2, -2 * s, 2 * P0).replace(/\^2/, "²").replace(/-/g, "−") + " = 2(" + pw(1, -s, P0).replace(/\^2/, "²").replace(/-/g, "−") + ").", "Le minimum est atteint en x = " + String(s / 2).replace("-", "−") + ", au milieu des racines."],
"a) et b) " + M("f(x) - g(x) = " + pw(2, -2 * s, 2 * P0) + " = 2(x " + (r1 < 0 ? "+ " + -r1 : "- " + r1) + ")(x " + (r2 < 0 ? "+ " + -r2 : "- " + r2) + ")").replace("(x - 0)", "x") + " : intersections en " + M(r1) + " et " + M(r2) + " ; c) en " + M("x = " + s / 2) + " : " + M("2 \\times (" + -w / 2 + ") \\times " + w / 2 + " = " + mn) + "."); },
() => { const r1 = R.int(1, 4), w = pk([2, 4, 6]), r2 = r1 + w, m = R.int(r1 + r2 + 1, r1 + r2 + 6), al = m - r1 - r2, bmax = (w / 2) ** 2;
return PX("benefice", "Une entreprise fabrique x centaines d'objets (" + M("0 \\leqslant x \\leqslant 12") + "). Le coût de production est " + M("C(x) = " + pw(1, al, r1 * r2)) + " et la recette " + M("R(x) = " + m + "x") + ", en milliers d'euros.",
[["a) Plus petite production (en centaines) pour laquelle R(x) = C(x)", r1], ["b) Plus grande production (en centaines) pour laquelle R(x) = C(x)", r2], ["c) Bénéfice maximal R(x) − C(x) (en milliers d'euros)", bmax]],
["R(x) − C(x) = " + pw(-1, r1 + r2, -r1 * r2).replace(/\^2/, "²").replace(/-/g, "−") + " : la courbe de R est au-dessus de celle de C entre ses racines.", "Le maximum est atteint au milieu des racines."],
"a) et b) " + M("R(x) - C(x) = " + pw(-1, r1 + r2, -r1 * r2) + " = -(x - " + r1 + ")(x - " + r2 + ")") + " : " + M("R = C") + " pour " + M("x = " + r1) + " et " + M("x = " + r2) + " ; bénéfice entre les deux ; c) en " + M("x = " + (r1 + r2) / 2) + " : " + M("-(" + (r1 + r2) / 2 + " - " + r1 + ")(" + (r1 + r2) / 2 + " - " + r2 + ") = " + bmax) + (bmax === 1 ? " millier" : " milliers") + " d'euros."); },
],
intmaj: [
() => { const [f, a, b, fa, fb] = pk([["\\sqrt{1 + x^3}", 0, 2, 1, 3], ["\\sqrt{9 + x^2}", 0, 4, 3, 5], ["\\sqrt{16 + x^2}", 0, 3, 4, 5], ["\\sqrt{36 + x^2}", 0, 8, 6, 10], ["\\sqrt{64 + x^2}", 0, 6, 8, 10]]), L = b - a;
return PX("croissante-amplitude", "Soit " + M("I = \\int_{" + a + "}^{" + b + "} " + f + "\\,dx") + ". La fonction " + M("x \\mapsto " + f) + " est croissante sur " + M("[" + a + " \\,;\\, " + b + "]") + ".",
[["a) Valeur de la fonction en " + a, fa], ["b) Valeur de la fonction en " + b, fb], ["c) Amplitude de l'encadrement obtenu (majorant − minorant)", L * (fb - fa)]],
["Croissante : f(" + a + ") ≤ f(x) ≤ f(" + b + ").", "Intègre l'encadrement sur un intervalle de longueur " + L + "."],
"a) " + M(fa) + " ; b) " + M(fb) + " ; c) " + M(L * fa + " \\leqslant I \\leqslant " + L * fb) + ", amplitude " + M(L * fb + " - " + L * fa + " = " + L * (fb - fa)) + "."); },
() => { const [f, a, b, fa, fb] = pk([["\\frac{1}{1 + x^2}", 0, 1, 1, 0.5], ["\\frac{1}{1 + x^2}", 0, 2, 1, 0.2], ["\\frac{1}{1 + x^2}", 0, 3, 1, 0.1], ["\\frac{6}{1 + x}", 1, 5, 3, 1], ["\\frac{12}{x + 2}", 0, 4, 6, 2], ["\\frac{10}{x^2 + 1}", 1, 3, 5, 1], ["\\frac{8}{x^2 + 4}", 0, 2, 2, 1]]), L = b - a, lo = rnd(L * fb, 9), hi = rnd(L * fa, 9);
return PX("decroissante-centre", "Soit " + M("J = \\int_{" + a + "}^{" + b + "} " + f + "\\,dx") + ". La fonction " + M("x \\mapsto " + f) + " est décroissante sur " + M("[" + a + " \\,;\\, " + b + "]") + ".",
[["a) Minorant de J obtenu", lo], ["b) Majorant de J obtenu", hi], ["c) Centre de l'encadrement (valeur approchée de J)", rnd((lo + hi) / 2, 9)]],
["Décroissante : f(" + b + ") ≤ f(x) ≤ f(" + a + ") sur l'intervalle.", "Multiplie par la longueur de l'intervalle, " + L + "."],
"Sur " + M("[" + a + " \\,;\\, " + b + "]") + " : " + M(N(fb) + " \\leqslant " + f + " \\leqslant " + N(fa)) + ", donc a) " + M(L + " \\times " + N(fb) + " = " + N(lo)) + " ; b) " + M(L + " \\times " + N(fa) + " = " + N(hi)) + " ; c) " + M("\\frac{" + N(lo) + " + " + N(hi) + "}{2} = " + N(rnd((lo + hi) / 2, 9))) + "."); },
() => { const c = R.int(1, 3), k = pk([2, 3, 4]), T = k * k;
return PX("debit-source", "Le débit d'une source (en L/min) vaut " + M("d(t) = " + c + " + \\sqrt{t}") + ", où t est le temps en minutes. Le volume écoulé entre 0 et " + T + " minutes est " + M("V = \\int_0^{" + T + "} d(t)\\,dt") + ".",
[["a) Débit au départ (L/min)", c], ["b) Débit au bout de " + T + " minutes (L/min)", c + k], ["c) Majorant de V obtenu avec le débit maximal (L)", T * (c + k)]],
["d est croissante sur [0 ; " + T + "] : d(0) ≤ d(t) ≤ d(" + T + ").", "Intègre sur " + T + " minutes."],
"a) " + M("d(0) = " + c) + " ; b) " + M("d(" + T + ") = " + c + " + " + k + " = " + (c + k)) + " ; c) " + M(T + " \\times " + c + " \\leqslant V \\leqslant " + T + " \\times " + (c + k) + " = " + T * (c + k)) + " L."); },
],
suiteint: [
() => { const k = R.int(0, 3), I = (n) => 1 / (n + 1) - 2 / (n + 2) + 1 / (n + 3), Is = (n) => fr(2, (n + 1) * (n + 2) * (n + 3)), wr = (n) => M("I_{" + n + "} = \\frac{1}{" + (n + 1) + "} - \\frac{2}{" + (n + 2) + "} + \\frac{1}{" + (n + 3) + "} = " + Is(n));
return PX("x-n-1-x-carre", "Soit " + M("I_n = \\int_0^{\\,1} x^n(1 - x)^2\\,dx") + " (n ≥ 0).",
[["a) " + M("I_{" + k + "}") + " (fraction)", I(k)], ["b) " + M("I_{" + (k + 1) + "}") + " (fraction)", I(k + 1)], ["c) " + M("I_{" + (k + 2) + "}") + " (fraction)", I(k + 2)]],
["Développe xⁿ(1 − x)² = xⁿ − 2xⁿ⁺¹ + xⁿ⁺².", "Iₙ = 1/(n + 1) − 2/(n + 2) + 1/(n + 3)."],
"a) " + wr(k) + " ; b) " + wr(k + 1) + " ; c) " + wr(k + 2) + " : la suite décroît vers 0."); },
() => { const k = R.int(1, 4), s = pk([50, 100, 200, 500]), I = (n) => 1 / ((n + 1) * (n + 2)); let n0 = 0; while ((n0 + 1) * (n0 + 2) <= s) n0++;
return PX("x-n-1-x-seuil", "Soit " + M("I_n = \\int_0^{\\,1} x^n(1 - x)\\,dx") + " (n ≥ 0).",
[["a) " + M("I_{" + k + "}") + " (fraction)", I(k)], ["b) " + M("I_{" + (k + 1) + "}") + " (fraction)", I(k + 1)], ["c) Plus petit entier n tel que " + M("I_n < \\frac{1}{" + s + "}"), n0]],
["Iₙ = 1/(n + 1) − 1/(n + 2) = 1/((n + 1)(n + 2)).", "c) Il faut (n + 1)(n + 2) > " + s + "."],
"a) " + M("I_{" + k + "} = \\frac{1}{" + (k + 1) * (k + 2) + "}") + " ; b) " + M("I_{" + (k + 1) + "} = \\frac{1}{" + (k + 2) * (k + 3) + "}") + " ; c) " + M("(n + 1)(n + 2) > " + s) + " : pour " + M("n = " + (n0 - 1)) + ", " + M(n0 * (n0 + 1) + " \\leqslant " + s) + " ; pour " + M("n = " + n0) + ", " + M((n0 + 1) * (n0 + 2) + " > " + s) + ". Donc " + M("n = " + n0) + "."); },
() => { const a = R.int(1, 3), k = R.int(1, 4), I = (n) => a / (n + 1) + 1 / (n + 2), Is = (n) => fr(a * (n + 2) + n + 1, (n + 1) * (n + 2)), ex = a === 1 ? "1 + x" : a + " + x";
return PX("x-n-a-plus-x", "Soit " + M("I_n = \\int_0^{\\,1} x^n(" + ex + ")\\,dx") + " (n ≥ 0).",
[["a) " + M("I_{" + k + "}") + " (fraction)", I(k)], ["b) " + M("I_{" + (k + 1) + "}") + " (fraction)", I(k + 1)], ["c) Limite de " + M("n I_n") + " quand n tend vers l'infini", a + 1]],
["Iₙ = " + a + "/(n + 1) + 1/(n + 2).", "c) n × " + a + "/(n + 1) tend vers " + a + ", et n/(n + 2) vers 1."],
"a) " + M("I_{" + k + "} = \\frac{" + a + "}{" + (k + 1) + "} + \\frac{1}{" + (k + 2) + "} = " + Is(k)) + " ; b) " + M("I_{" + (k + 1) + "} = \\frac{" + a + "}{" + (k + 2) + "} + \\frac{1}{" + (k + 3) + "} = " + Is(k + 1)) + " ; c) " + M("nI_n = \\frac{" + a + "n}{n + 1} + \\frac{n}{n + 2} \\to " + a + " + 1 = " + (a + 1)) + "."); },
],
};

reg([
{ id: "symax", theme: "es", label: "Symétrie axiale", ex: "A \\to A' : (d) \\text{ médiatrice de } [AA']", FR: [6], againFR: [7], g: SA, probs: PROBS.symax,
hint: "Le symétrique de A par rapport à (d) est sur la perpendiculaire à (d) passant par A, à la même distance de (d), de l'autre côté. La symétrie conserve longueurs, angles, aires. Un axe de symétrie d'une figure la partage en deux moitiés superposables par pliage.",
comps: ["Axes d'une figure, conservation des longueurs et des angles", "Symétrique sur une droite graduée, moitié de figure, triangle isocèle", "Deux symétries, compléter une figure, recoller"],
lesson: ["Symétrie axiale", "Deux figures symétriques par rapport à une droite \\((d)\\) se superposent quand on plie le long de \\((d)\\).",
"Le symétrique \\(A'\\) du point \\(A\\) par rapport à \\((d)\\) : \\((d)\\) est perpendiculaire à \\([AA']\\) et passe par son milieu (c'est la médiatrice de \\([AA']\\)). Un point de \\((d)\\) est son propre symétrique. La symétrie axiale conserve les longueurs, les angles, les périmètres et les aires. Une droite est un axe de symétrie d'une figure si la figure est sa propre symétrique.",
["Un rectangle a 2 axes de symétrie, un carré 4, un triangle équilatéral 3.", "\\(A\\) d'abscisse 2,4 et \\((d)\\) en 5 : \\(A'\\) a pour abscisse \\(5 + 2{,}6 = 7{,}6\\)."],
"Les diagonales d'un rectangle (non carré) ne sont pas des axes de symétrie."] },
{ id: "mediatrice", theme: "es", label: "Médiatrice d'un segment", ex: "M \\in (d) \\iff MA = MB", FR: [6], againFR: [7], g: MD, probs: PROBS.mediatrice,
hint: "La médiatrice de [AB] est la droite perpendiculaire à [AB] en son milieu. Un point est sur la médiatrice de [AB] si et seulement s'il est à la même distance de A et de B. Les trois médiatrices d'un triangle se coupent au centre du cercle circonscrit.",
comps: ["Milieu, équidistance, périmètre", "Abscisse du milieu, triangle isocèle, cercle circonscrit", "Retrouver une longueur ou un point, cerf-volant"],
lesson: ["Médiatrice d'un segment", "La médiatrice d'un segment est l'ensemble des points situés à égale distance de ses deux extrémités.",
"La médiatrice de \\([AB]\\) est la droite perpendiculaire à \\([AB]\\) qui passe par son milieu \\(I\\). Propriété : \\(M\\) est sur la médiatrice de \\([AB]\\) si et seulement si \\(MA = MB\\) (le triangle \\(MAB\\) est alors isocèle en \\(M\\)). Les médiatrices des trois côtés d'un triangle se coupent en un point \\(O\\), centre du cercle qui passe par les trois sommets (cercle circonscrit).",
["\\(M\\) sur la médiatrice de \\([AB]\\), \\(MA = 4\\) cm, \\(AB = 3\\) cm : périmètre de \\(MAB\\) = \\(4 + 4 + 3 = 11\\) cm.", "\\(A\\) en 2, \\(B\\) en 8 sur une droite graduée : la médiatrice passe par 5."],
"Pour qu'un point soit sur la médiatrice, il ne suffit pas qu'il soit « au milieu » : il doit être à égale distance de \\(A\\) et de \\(B\\)."] },
{ id: "echelle6", theme: "fa", label: "Échelles : plans, cartes, maquettes", ex: "\\frac{1}{200} : 3 \\text{ cm} \\to 6 \\text{ m}", FR: [6], againFR: [7], g: EC, probs: PROBS.echelle6,
hint: "Échelle 1/n : 1 cm sur le plan représente n cm en réalité. Réel = plan × n ; plan = réel ÷ n. Mets les deux longueurs dans la même unité. 1 m = 100 cm, 1 km = 100 000 cm.",
comps: ["Du plan à la réalité, carte, maquette", "De la réalité au plan, km, trouver l'échelle", "Deux longueurs, deux cartes, périmètre réel"],
lesson: ["Échelles", "Sur un plan ou une carte, les longueurs sont proportionnelles aux longueurs réelles.",
"Une échelle \\(\\frac{1}{n}\\) signifie que 1 cm sur le plan représente \\(n\\) cm en réalité. Longueur réelle = longueur sur le plan × \\(n\\) ; longueur sur le plan = longueur réelle ÷ \\(n\\). On exprime les deux longueurs dans la même unité (souvent le cm), puis on convertit : 1 m = 100 cm, 1 km = 100 000 cm. L'échelle se retrouve en divisant la longueur réelle par la longueur sur le plan (même unité).",
["Échelle \\(\\frac{1}{200}\\) : 3 cm sur le plan donnent \\(600\\) cm, soit 6 m.", "Carte au \\(\\frac{1}{25\\,000}\\) : 4 cm représentent \\(100\\,000\\) cm, soit 1 km."],
"Convertis avant de diviser : un mur de 6 m représenté par 3 cm donne \\(600 \\div 3 = 200\\), pas \\(6 \\div 3 = 2\\)."] },
{ id: "proba6", theme: "no", label: "Probabilités : premiers pas", ex: "P = \\frac{\\text{issues favorables}}{\\text{issues possibles}}", FR: [6], againFR: [7], g: PR, probs: PROBS.proba6,
hint: "Si toutes les issues ont la même chance (dé équilibré, tirage au hasard), P = nombre d'issues favorables ÷ nombre d'issues possibles. Une probabilité est comprise entre 0 (impossible) et 1 (certain). En répétant une expérience un grand nombre de fois, la fréquence se rapproche de la probabilité.",
comps: ["Dé, sac, roue : issues équiprobables", "Lettres d'un mot, fréquence, retrouver un effectif", "Modifier une urne, nombre attendu, comparer deux probabilités"],
lesson: ["Probabilités", "Une probabilité mesure la chance qu'un évènement se produise, par un nombre entre 0 et 1.",
"Expérience aléatoire : on connaît les issues possibles, mais pas celle qui sortira. Si les issues ont toutes la même chance (on dit équiprobables) : \\(P = \\frac{\\text{nombre d'issues favorables}}{\\text{nombre d'issues possibles}}\\). Un évènement impossible a la probabilité 0, un évènement certain la probabilité 1. Quand on répète l'expérience un grand nombre de fois, la fréquence d'un résultat (effectif ÷ nombre d'essais) se rapproche de sa probabilité.",
["Dé équilibré : \\(P(\\text{pair}) = \\frac{3}{6} = \\frac{1}{2}\\).", "Sac de 3 rouges et 5 bleues : \\(P(\\text{rouge}) = \\frac{3}{8}\\)."],
"On divise par le nombre total d'issues, pas par le nombre d'issues défavorables."] },
{ id: "empil", theme: "es", label: "Empilements de cubes, vues", ex: "\\text{vue de dessus, de face, de droite}", FR: [7], againFR: [8], g: EM, probs: PROBS.empil,
hint: "Compte pile par pile (sans oublier les cubes du bas, cachés). Vue de dessus : un carré par pile. Vue de face : dans chaque colonne, la hauteur de la pile la plus haute. Vue de droite : même chose dans chaque rangée.",
comps: ["Compter les cubes, vue de dessus, vue de face", "Compléter en pavé, vue de droite, grands empilements", "Trois vues, escaliers, compléter en cube"],
lesson: ["Empilements de cubes", "Un empilement de cubes se décrit par sa vue en perspective ou par ses vues de dessus, de face et de côté.",
"Pour compter les cubes, on compte pile par pile (les cubes du bas sont cachés mais présents). Vue de dessus : un carré par pile, quelle que soit sa hauteur (on peut y écrire la hauteur de chaque pile). Vue de face : dans chaque colonne, autant de carrés que la pile la plus haute. Vue de droite : de même pour chaque rangée. Pour compléter en pavé droit : nombre de cubes du pavé (longueur × largeur × hauteur) moins ceux déjà présents.",
["Vue de dessus avec les hauteurs 3, 1, 2, 2 : \\(3 + 1 + 2 + 2 = 8\\) cubes.", "Pavé \\(3 \\times 2 \\times 3 = 18\\) cubes ; avec 11 cubes déjà posés, il en manque 7."],
"Sur une vue de face, les piles de derrière ne s'ajoutent pas à celles de devant : on garde la plus haute."] },
{ id: "compdiff", theme: "no", label: "Comparer par différence ou par quotient", ex: "A - B > 0 \\iff A > B", FR: [10, 1], againFR: [11], g: CD, probs: PROBS.compdiff,
hint: "A > B ⇔ A − B > 0 : on calcule la différence et on étudie son signe. Si A et B sont strictement positifs : A > B ⇔ A/B > 1. Pour des nombres positifs, on peut aussi comparer leurs carrés.",
comps: ["Différence de fractions, quotient de puissances, identité", "Quotient de grandeurs, différence carrée, comparer des carrés", "Évolutions successives, fractions en n, très grandes puissances"],
lesson: ["Comparer deux nombres", "Pour comparer deux nombres, on étudie le signe de leur différence, ou on compare leur quotient à 1.",
"\\(A > B \\iff A - B > 0\\). On réduit \\(A - B\\) au même dénominateur, on factorise ou on reconnaît un carré pour lire son signe. Si \\(A > 0\\) et \\(B > 0\\) : \\(A > B \\iff \\frac{A}{B} > 1\\) (utile pour des puissances ou des grandeurs). Pour des nombres positifs, \\(A > B \\iff A^2 > B^2\\).",
["\\(\\frac{7}{9} - \\frac{10}{13} = \\frac{91 - 90}{117} = \\frac{1}{117} > 0\\), donc \\(\\frac{7}{9} > \\frac{10}{13}\\).", "\\(x^2 + 9 - 6x = (x - 3)^2 \\geqslant 0\\), donc \\(x^2 + 9 \\geqslant 6x\\) pour tout \\(x\\)."],
"Le quotient se compare à 1 seulement pour des nombres strictement positifs."] },
{ id: "posrelc", theme: "fa", label: "Position relative de deux courbes", ex: "f(x) - g(x) > 0 \\iff C_f \\text{ au-dessus}", FR: [11, 4], g: PC, probs: PROBS.posrelc,
hint: "On étudie le signe de d(x) = f(x) − g(x) : là où d(x) > 0, C_f est au-dessus de C_g ; là où d(x) = 0, les courbes se coupent. Factorise d(x), fais un tableau de signes, ou étudie ses variations (minimum positif ⇒ toujours au-dessus).",
comps: ["Différence affine, intersection, contact", "Parabole et droite, deux paraboles, exponentielle et droite", "Tangente qui recoupe, paramètre, tableau de signes"],
lesson: ["Position relative de deux courbes", "Comparer deux fonctions, c'est étudier le signe de leur différence.",
"On pose \\(d(x) = f(x) - g(x)\\). Si \\(d(x) > 0\\) sur un intervalle, la courbe \\(C_f\\) est au-dessus de \\(C_g\\) ; si \\(d(x) < 0\\), au-dessous ; les solutions de \\(d(x) = 0\\) sont les abscisses des points communs. On étudie le signe de \\(d\\) en factorisant (tableau de signes), ou par ses variations : si le minimum de \\(d\\) est positif, \\(C_f\\) est toujours au-dessus.",
["\\(f(x) = x^2\\), \\(g(x) = x + 2\\) : \\(d(x) = (x - 2)(x + 1)\\) ; \\(C_f\\) est au-dessous de la droite sur \\(]-1 \\,;\\, 2[\\).", "\\(e^x - (x + 1)\\) a pour minimum 0 (en 0) : la courbe de exp est au-dessus de sa tangente en 0."],
"On compare les ordonnées \\(f(x)\\) et \\(g(x)\\) pour un même \\(x\\), pas les formules."] },
{ id: "intmaj", theme: "fa", label: "Majorer, encadrer une intégrale", ex: "m \\leqslant f \\leqslant M \\Rightarrow m(b - a) \\leqslant \\int_a^b f \\leqslant M(b - a)", FR: [12, 6], g: IM, probs: PROBS.intmaj,
hint: "Croissance de l'intégrale (a ≤ b) : si f ≤ g sur [a ; b], alors ∫ f ≤ ∫ g. En particulier, m ≤ f ≤ M donne m(b − a) ≤ ∫ f ≤ M(b − a). Valeur moyenne : μ = (1/(b − a)) ∫ f. Méthode des rectangles : pour f monotone, les rectangles encadrent l'intégrale.",
comps: ["Encadrement constant, fonction monotone, valeur moyenne", "Majorer par une fonction plus simple, comparer deux fonctions", "Rectangles, majorant d'une suite d'intégrales, seuil"],
lesson: ["Majorer, encadrer une intégrale", "On encadre une intégrale qu'on ne sait pas calculer en encadrant la fonction.",
"Pour \\(a \\leqslant b\\) : si \\(f(x) \\leqslant g(x)\\) sur \\([a \\,;\\, b]\\), alors \\(\\int_a^b f(x)\\,dx \\leqslant \\int_a^b g(x)\\,dx\\) (croissance de l'intégrale). En particulier, si \\(m \\leqslant f(x) \\leqslant M\\), alors \\(m(b - a) \\leqslant \\int_a^b f(x)\\,dx \\leqslant M(b - a)\\). La valeur moyenne de \\(f\\) sur \\([a \\,;\\, b]\\) est \\(\\mu = \\frac{1}{b - a}\\int_a^b f(x)\\,dx\\). Pour une fonction monotone, les rectangles « à gauche » et « à droite » encadrent l'intégrale.",
["Sur \\([0 \\,;\\, 1]\\), \\(e^{x^2} \\leqslant e^x\\), donc \\(\\int_0^{\\,1} e^{x^2}\\,dx \\leqslant e - 1\\).", "\\(0 \\leqslant \\frac{x^n}{1 + x} \\leqslant x^n\\) donne \\(0 \\leqslant I_n \\leqslant \\frac{1}{n + 1}\\), donc \\(I_n \\to 0\\)."],
"On multiplie la borne par la longueur de l'intervalle : \\(\\int_1^4 5\\,dx = 15\\), pas 5."] },
{ id: "suiteint", theme: "fa", label: "Suites d'intégrales", ex: "I_n = \\int_0^{\\,1} x^n e^x\\,dx", FR: [12, 6], g: SI, probs: PROBS.suiteint,
hint: "Calcule les premiers termes. Monotonie : signe de I_(n+1) − I_n = ∫ (différence des fonctions). Relation de récurrence : intégration par parties ou somme de deux termes consécutifs. Limite : encadrement puis théorème des gendarmes.",
comps: ["Premiers termes, différence de deux termes, exponentielle", "Récurrence par parties, somme de deux termes, développer", "Limite de nIₙ, Wallis, seuil"],
lesson: ["Suites d'intégrales", "Une intégrale qui dépend d'un entier \\(n\\) définit une suite \\((I_n)\\).",
"Premiers termes : on calcule \\(I_0\\), \\(I_1\\). Sens de variation : \\(I_{n+1} - I_n = \\int_a^b (f_{n+1} - f_n)\\) a le signe de la fonction intégrée (par exemple \\(x^{n+1} \\leqslant x^n\\) sur \\([0 \\,;\\, 1]\\)). Relation de récurrence : par une intégration par parties (\\(I_{n+1} = e - (n + 1)I_n\\) pour \\(\\int_0^{\\,1} x^n e^x\\,dx\\)) ou en additionnant deux termes. Limite : on encadre \\(I_n\\) (par exemple \\(0 \\leqslant I_n \\leqslant \\frac{1}{n + 1}\\)) et on conclut avec le théorème des gendarmes.",
["\\(I_n = \\int_0^{\\,1} x^n\\,dx = \\frac{1}{n + 1}\\) : décroissante, de limite 0.", "\\(I_n = \\int_0^{\\,1} x^n e^x\\,dx\\) : \\(I_0 = e - 1\\), \\(I_1 = 1\\), \\(I_2 = e - 2\\)."],
"Dans la relation de récurrence, le coefficient dépend de \\(n\\) : il change à chaque étape."] },
]);




if (typeof VARX !== "undefined") {
const progT = (steps) => "<b>Programme</b><br>• Choisir un nombre.<br>" + steps.map((t) => "• " + t).join("<br>");
VARX.progcalc = VARX.progcalc || {};
VARX.progcalc[3] = (VARX.progcalc[3] || []).concat([
() => { const a = R.int(2, 9), b = R.int(2, 6), v = a * b;
return QN(progT(["Ajouter " + a + ".", "Multiplier le résultat par " + b + ".", "Soustraire " + b + " fois le nombre de départ."]) + "<br>Prouve que le résultat est toujours le même, quel que soit le nombre choisi : quel est ce résultat ?", v,
"Avec " + M("x") + " au départ : " + M(b + "(x + " + a + ") - " + b + "x = " + b + "x + " + v + " - " + b + "x = " + v) + ". Le résultat vaut toujours " + M(v) + ".",
{ ctx: "prouver-constant", guide: [GX("Résultat en fonction de " + M("x") + ", avant de réduire ?", b + "*(x+" + a + ")-" + b + "*x", M(b + "(x + " + a + ") - " + b + "x") + "."), GR("Résultat réduit ?", v, M(v) + ".")],
traps: [TR(a, "Développe " + b + "(x + " + a + ") : " + b + " × " + a + " = " + v + "."), TR(v + b, "On soustrait " + b + "x : les x disparaissent.")] }); },
() => { const k = R.int(2, 9), b = R.int(2, 7), c = k * b;
return QN(progT(["Ajouter un nombre " + M("k") + ".", "Multiplier le résultat par " + b + "."]) + "<br>En partant de " + M("x") + ", on obtient " + M(b + "x + " + c) + ". Que vaut " + M("k") + " ?", k,
M(b + "(x + k) = " + b + "x + " + b + "k") + " ; il faut " + M(b + "k = " + c) + ", donc " + M("k = " + k) + ".",
{ ctx: "retrouver-etape", guide: [GR("Que vaut " + M(b + "k") + " ?", c, M(c) + " (terme constant de " + M(b + "x + " + c) + ")."), GR(M("k") + " ?", k, M(c + " \\div " + b + " = " + k) + ".")],
traps: [TR(c, "C'est " + b + "k ; divise par " + b + "."), TR(c - b, "On multiplie après avoir ajouté k : " + b + "(x + k) = " + b + "x + " + b + "k.")] }); },
]);
}


if (typeof FR_PROGRESSION !== "undefined") {
const ins = (g, id, ref) => { const L = FR_PROGRESSION[g]; if (L.includes(id)) return; const i = L.indexOf(ref); L.splice(i < 0 ? L.length : i + 1, 0, id); };
ins(6, "symax", "angtype"); ins(6, "mediatrice", "symax"); ins(6, "echelle6", "proptab"); ins(6, "proba6", "pct");
ins(7, "empil", "vol");
}





const sum = (a) => a.reduce((x, y) => x + y, 0);
const tabN = (vals, effs) => M("\\begin{array}{c|" + "c".repeat(vals.length) + "} \\text{note} & " + vals.map(N).join(" & ") + " \\\\ \\hline \\text{effectif} & " + effs.join(" & ") + " \\end{array}");
const NT = {
pond: () => { const vals = pk([[8, 10, 12, 14, 16], [9, 11, 13, 15, 17], [6, 8, 10, 12, 14, 16]]), effs = vals.map(() => R.int(1, 6)), n = sum(effs), s = sum(vals.map((v, i) => v * effs[i])), m = rnd(s / n, 9); if (Math.abs(m * 100 - Math.round(m * 100)) > 1e-6) return null;
return QD("Notes d'un contrôle (sur 20) : " + tabN(vals, effs) + ". Calcule la moyenne de la classe (au centième).", m, "Moyenne pondérée : " + M("\\frac{" + vals.map((v, i) => v + " \\times " + effs[i]).join(" + ") + "}{" + n + "} = \\frac{" + s + "}{" + n + "} = " + N(m)) + " sur 20.",
{ ctx: "ponderee-20", guide: [GR("Somme des notes × effectifs ?", s, M(s) + "."), GR("Effectif total ?", n, M(n) + "."), GD("Moyenne ?", m, M(N(m)) + ".")], traps: [TD(sum(vals) / vals.length, "Chaque note compte autant de fois que son effectif (moyenne pondérée)."), TD(s / vals.length, "On divise par l'effectif total, pas par le nombre de notes différentes.")] }); },
manque: () => { const n = pk([3, 4, 5]), xs = Array.from({ length: n }, () => R.int(7, 18)), t = pk([12, 13, 14, 15]), x = t * (n + 1) - sum(xs); if (x < 4 || x > 20 || xs.includes(x)) return null; const w = who();
return QN(w + " a eu " + xs.map((v) => M(v)).join(", ") + " sur 20 à ses premiers contrôles. Quelle note lui faut-il au prochain contrôle (même coefficient) pour avoir exactement " + M(t) + " de moyenne ?", x,
"Avec " + M(n + 1) + " notes de moyenne " + M(t) + ", la somme doit valoir " + M((n + 1) + " \\times " + t + " = " + t * (n + 1)) + " ; on a déjà " + M(sum(xs)) + " : il faut " + M(t * (n + 1) + " - " + sum(xs) + " = " + x) + ".",
{ ctx: "note-manquante-20", guide: [GR("Somme nécessaire ?", t * (n + 1), M(t * (n + 1)) + "."), GR("Somme actuelle ?", sum(xs), M(sum(xs)) + "."), GR("Note nécessaire ?", x, M(x) + ".")], traps: [TR(t, "Il faut compenser les notes précédentes."), TR(t * n - sum(xs) > 0 ? t * n - sum(xs) : x + 3, "Il y aura " + (n + 1) + " notes en tout.")] }); },
mode: () => { const vals = pk([[8, 10, 12, 14, 16], [9, 11, 13, 15, 17], [10, 11, 12, 13, 14]]), effs = vals.map(() => R.int(1, 8)), mx = Math.max(...effs); if (effs.filter((e) => e === mx).length > 1) return null; const md = vals[effs.indexOf(mx)];
return Object.assign(QN("Notes d'un contrôle (sur 20) : " + tabN(vals, effs) + ". Quel est le mode de cette série ?", md, "Le mode est la valeur la plus fréquente : " + M(md) + " (effectif " + mx + ").",
{ ctx: "mode-20", guide: [GR("Plus grand effectif ?", mx, M(mx) + "."), GR("Note correspondante (le mode) ?", md, M(md) + ".")], traps: [TR(mx, "Le mode est la NOTE la plus fréquente, pas son effectif."), TR(Math.max(...vals), "Le mode n'est pas la plus grande note.")] }), { shownOk: true }); },
cumul: () => { const vals = [8, 10, 12, 14, 16], effs = vals.map(() => R.int(2, 9)), k = R.int(2, 3), c = sum(effs.slice(0, k));
return QN("Notes d'un contrôle (sur 20) : " + tabN(vals, effs) + ". Combien d'élèves ont une note inférieure ou égale à " + M(vals[k - 1]) + " (effectif cumulé) ?", c, M(effs.slice(0, k).join(" + ") + " = " + c) + ".",
{ ctx: "cumul-20", guide: [GR("Combien de notes du tableau sont inférieures ou égales à " + M(vals[k - 1]) + " ?", k, vals.slice(0, k).join(", ") + "."), GR("Effectif cumulé ?", c, M(c) + ".")], traps: [TR(effs[k - 1], "On additionne les effectifs de toutes les notes jusqu'à " + vals[k - 1] + "."), TR(c + effs[k], "« Inférieure ou égale à " + vals[k - 1] + " » : la note " + vals[k] + " n'est pas comprise.")] }); },
equation: () => { const n = R.int(3, 5); let xs, t, x; for (let k = 0; k < 40; k++) { xs = Array.from({ length: n }, () => R.int(8, 17)); t = pk([12, 13, 14]); x = t * (n + 2) - sum(xs); if (x % 2 === 0 && x / 2 >= 6 && x / 2 <= 20) break; x = null; } if (!x) return null; const v = x / 2;
return QN("Un élève a obtenu " + xs.map((u) => M(u)).join(", ") + " sur 20. Le prochain devoir compte double. Quelle note doit-il y obtenir pour avoir exactement " + M(t) + " de moyenne ?", v,
"Le devoir compte comme deux notes : " + M("\\frac{" + sum(xs) + " + 2x}{" + (n + 2) + "} = " + t) + ", donc " + M(sum(xs) + " + 2x = " + t * (n + 2)) + " et " + M("x = " + v) + ".",
{ ctx: "coefficient-20", guide: [GR("Somme visée (" + (n + 2) + " notes) ?", t * (n + 2), M(t * (n + 2)) + "."), GR(M("2x") + " ?", x, M(x) + "."), GR(M("x") + " ?", v, M(v) + ".")], traps: [TR(x, "C'est 2x : divise par 2."), TR(t * (n + 1) - sum(xs), "Le devoir compte double : " + (n + 2) + " notes en tout.")] }); },
};
const NDEF = () => P("Les notes de Yanis (sur 20) : 11 ; 14 ; 9 ; 15 ; 12. Le prochain devoir compte double.", [["a) Moyenne actuelle", 12.2], ["b) Médiane actuelle", 12], ["c) Note à obtenir au devoir double pour finir avec 13 de moyenne", 15]], ["Un devoir qui compte double compte comme deux notes : 7 notes en tout.", "Somme visée : 7 × 13 = 91 ; 61 + 2x = 91."], "a) " + M("\\frac{61}{5} = 12{,}2") + " ; b) série triée 9, 11, 12, 14, 15 : médiane " + M("12") + " ; c) " + M("61 + 2x = 91") + ", " + M("x = 15") + ".");
const NMAP = { statfreq: ["mode", "cumul"], stats: ["pond", "manque", "mode"], diagr: ["pond", "pond"], probeq: ["manque", "equation"], eq1: ["manque"], ineq: ["manque"] };
window.FR_NOTES = function (id, q) {
if (!q || !NMAP[id]) return null;
const t = String(q.q || "") + " " + (q.parts || []).map((x) => x.label || "").join(" ");
if (!/\b[Nn]otes?\b/.test(t) || /sur 20|[Oo]n note|la note en parts/.test(t)) return null;
R.seed((q.seed || 1) * 7919 + 4243);
let r = null;
if (q.d === 4 || q.parts) { const p = NDEF(); r = { ...p, spec: { kind: "multi" }, hint: p.hints[0] }; }
else for (let k = 0; k < 30 && !r; k++) r = NT[pk(NMAP[id])]();
if (!r) return null;
const cb = typeof colonBreak === "function" ? colonBreak : (x) => x;
r.q = cb(r.q); r.sol = cb(r.sol); if (r.guide) r.guide = r.guide.map((g) => ({ ...g, ask: cb(g.ask), sol: cb(g.sol) }));
return Object.assign(r, { id, d: q.d, seed: q.seed, code: q.code, hint: r.hint || q.hint });
};
})();







(function () {
if (typeof FRX === "undefined" || typeof TRX === "undefined") return;
const { pk, nz, rnd, N, F, FS, X, QN, QR, QSet, GR, GSet, TR, P, reg } = FRX;
const { W, toi, actReg } = TRX;
const D = (v) => String(rnd(v, 6)).replace(".", ",");
const dec = (a, b) => R.int(Math.round(a * 10), Math.round(b * 10)) / 10;
const cm = (v) => M(N(v) + "\\text{ cm}"), dg = (v) => M(N(v) + "°");
const TSt = (s, m) => ({ s, m });
const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R.rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };


const CE = {
1: [
() => { const d = dec(3, 15), toR = R.rand() < 0.6;
return toR ? QN("Le segment " + M("[AB]") + " est un diamètre du cercle de centre " + M("O") + ", et " + M("AB = ") + cm(d) + ". Quelle est la distance " + M("OA") + " (en cm) ?", rnd(d / 2, 6),
"Le centre " + M("O") + " est le milieu du diamètre : " + M("OA = " + N(d) + " \\div 2 = " + N(rnd(d / 2, 6))) + " cm. C'est le rayon : tous les points du cercle sont à cette distance de " + M("O") + ".",
{ ctx: "diametre-rayon", guide: [GR("Rayon = diamètre ÷ 2 ?", rnd(d / 2, 6), M(N(rnd(d / 2, 6))) + " cm.")], traps: [TR(d, "C'est le diamètre ; O est au milieu de [AB]."), TR(rnd(d * 2, 6), "Le rayon est la moitié du diamètre, pas le double.")] })
: QN("Tous les points d'un cercle de centre " + M("O") + " sont à " + cm(d) + " de " + M("O") + ". Quelle est la longueur d'un diamètre de ce cercle (en cm) ?", rnd(d * 2, 6),
"Un diamètre passe par le centre : il mesure deux rayons, " + M("2 \\times " + N(d) + " = " + N(rnd(2 * d, 6))) + " cm.",
{ ctx: "diametre-rayon", guide: [GR("Diamètre = 2 × rayon ?", rnd(2 * d, 6), M(N(rnd(2 * d, 6))) + " cm.")], traps: [TR(rnd(d / 2, 6), "Le diamètre est le double du rayon."), TR(d, "C'est le rayon.")] }); },
() => { const o = R.int(5, 14); let r; do r = R.int(2, o - 1); while (2 * r === o); const v = [o - r, o + r];
return QSet("Sur une droite graduée, le point " + M("O") + " a pour abscisse " + M(o) + ". Quelles sont les abscisses des points de la droite situés à " + M(r) + " unités de " + M("O") + " ? (sépare par « ; »)", v,
"Il y en a deux, un de chaque côté de " + M("O") + " : " + M(o + " - " + r + " = " + (o - r)) + " et " + M(o + " + " + r + " = " + (o + r)) + ". Ce sont les points où le cercle de centre " + M("O") + " et de rayon " + M(r) + " coupe la droite.",
{ ctx: "graduee-distance", guide: [GR("Abscisse du point à gauche de " + M("O") + " ?", o - r, M(o - r) + "."), GSet("Les deux abscisses ?", v, M((o - r) + " \\,;\\, " + (o + r)) + ".")],
traps: [TSt([o + r], "Il y a aussi un point de l'autre côté de O."), TSt([r], "On compte la distance à partir de O, pas à partir de 0."), TSt([o - r], "Il y a aussi un point à droite de O.")] }); },
() => { const r = R.int(3, 8); let ds, v; do { ds = Array.from({ length: 5 }, () => (R.rand() < 0.25 ? r : dec(1, 2 * r))); v = ds.filter((d) => d <= r).length; } while (v < 2 || v > 4 || !ds.includes(r));
const nm = ["A", "B", "C", "D", "E"];
return QN("Le disque de centre " + M("O") + " et de rayon " + cm(r) + " est formé de tous les points situés à " + cm(r) + " ou moins de " + M("O") + ". On donne " + ds.map((d, i) => M("O" + nm[i] + " = " + N(d)) + " cm").join(", ") + ". Combien de ces cinq points sont dans le disque ?", v,
"On garde les points dont la distance à " + M("O") + " est inférieure ou égale à " + M(r) + " : " + nm.filter((_, i) => ds[i] <= r).join(", ") + (ds.includes(r) ? " (un point à exactement " + r + " cm est sur le cercle, donc dans le disque)" : "") + " : " + v + ".",
{ ctx: "disque-ensemble", guide: [GR("Combien de points sont à moins de " + cm(r) + " (strictement) ?", ds.filter((d) => d < r).length, M(ds.filter((d) => d < r).length) + "."), GR("Avec ceux qui sont sur le cercle ?", v, M(v) + ".")],
traps: [TR(ds.filter((d) => d < r).length, "Les points à exactement " + r + " cm sont sur le cercle : ils font partie du disque."), TR(5 - v, "Ce sont les points hors du disque.")] }); },
],
2: [
() => { const L = dec(6, 15), r = dec(2, L - 1.5), v = rnd(L - r, 6);
return QN("Le cercle de centre " + M("A") + " et de rayon " + cm(r) + " coupe le segment " + M("[AB]") + " au point " + M("M") + ", et " + M("AB = ") + cm(L) + ". Calcule " + M("MB") + " (en cm).", v,
M("M") + " est sur le cercle, donc " + M("AM = " + N(r)) + " cm (le rayon). " + M("MB = AB - AM = " + N(L) + " - " + N(r) + " = " + N(v)) + " cm.",
{ ctx: "segment-cercle", guide: [GR(M("AM") + " ?", r, M(N(r)) + " cm, le rayon."), GR(M("MB") + " ?", v, M(N(v)) + " cm.")], traps: [TR(rnd(L + r, 6), "M est entre A et B : on soustrait."), TR(r, "C'est AM ; on demande MB.")] }); },
() => { const r = dec(2.5, 9), c = dec(1.5, 2 * r - 0.5), v = rnd(2 * r + c, 6);
return QN("Les points " + M("A") + " et " + M("B") + " sont sur le cercle de centre " + M("O") + " et de rayon " + cm(r) + ", avec " + M("AB = ") + cm(c) + ". Calcule le périmètre du triangle " + M("OAB") + " (en cm).", v,
M("OA = OB = " + N(r)) + " cm (deux rayons) : le triangle est isocèle en " + M("O") + ". Périmètre : " + M(N(r) + " + " + N(r) + " + " + N(c) + " = " + N(v)) + " cm.",
{ ctx: "triangle-rayons", guide: [GR(M("OA + OB") + " ?", rnd(2 * r, 6), M(N(rnd(2 * r, 6))) + " cm."), GR("Périmètre ?", v, M(N(v)) + " cm.")], traps: [TR(rnd(r + c, 6), "OA et OB sont deux rayons : compte-les tous les deux."), TR(rnd(4 * r + c, 6), "Ce sont des rayons, pas des diamètres.")] }); },
() => { const a = R.int(1, 6), T = a + R.int(2, 6), b = T + R.int(2, 6), r1 = T - a, r2 = b - T;
return QN("Sur une droite graduée, " + M("A") + " a pour abscisse " + M(a) + " et " + M("B") + " a pour abscisse " + M(b) + ". Un trésor est caché sur la droite, à " + M(r1) + " unités de " + M("A") + " et à " + M(r2) + " unités de " + M("B") + ". Quelle est son abscisse ?", T,
"À " + M(r1) + " de " + M("A") + " : " + M(a - r1) + " ou " + M(a + r1) + ". À " + M(r2) + " de " + M("B") + " : " + M(b - r2) + " ou " + M(b + r2) + ". Le seul point commun est " + M(T) + ".",
{ ctx: "tresor", guide: [GSet("Points à " + M(r1) + " unités de " + M("A") + " ?", [a - r1, a + r1], M((a - r1) + " \\,;\\, " + (a + r1)) + "."), GR("Lequel est aussi à " + M(r2) + " unités de " + M("B") + " ?", T, M(T) + ".")],
traps: [TR(a - r1, "Ce point est bien à " + r1 + " de A, mais pas à " + r2 + " de B."), TR(b + r2, "Ce point est à " + r2 + " de B, mais pas à " + r1 + " de A."), TR(r1 + r2, "On cherche une abscisse : pars de A (ou de B).")] }); },
],
3: [
() => { const d = R.int(6, 12), r = R.int(Math.ceil(d / 2), d - 1), s = R.int(d - r + 1, d), quad = R.rand() < 0.5, v = quad ? 2 * (r + s) : d + r + s;
return QN("Les cercles de centre " + M("A") + ", de rayon " + cm(r) + ", et de centre " + M("B") + ", de rayon " + cm(s) + ", se coupent en deux points " + M("M") + " et " + M("N") + ", avec " + M("AB = ") + cm(d) + ". Calcule le périmètre " + (quad ? "du quadrilatère " + M("AMBN") : "du triangle " + M("AMB")) + " (en cm).", v,
M("M") + " est sur les deux cercles : " + M("AM = " + r) + " cm et " + M("BM = " + s) + " cm" + (quad ? " ; de même " + M("AN = " + r) + " cm et " + M("BN = " + s) + " cm. Périmètre : " + M("2 \\times " + r + " + 2 \\times " + s + " = " + v) : ". Périmètre : " + M(d + " + " + r + " + " + s + " = " + v)) + " cm.",
{ ctx: "deux-cercles", guide: [GR(M("AM") + " ?", r, M(r) + " cm (rayon du cercle de centre A)."), GR(M("BM") + " ?", s, M(s) + " cm."), GR("Périmètre ?", v, M(v) + " cm.")],
traps: [TR(quad ? d + r + s : 2 * (r + s), quad ? "Le quadrilatère AMBN a quatre côtés : AM, MB, BN, NA ([AB] est une diagonale)." : "Le triangle AMB a pour côtés AB, AM et BM."), TR(quad ? 2 * d : r + s, "Utilise les rayons : M et N sont sur les deux cercles.")] }); },
() => { const L = R.int(3, 12), two = R.rand() < 0.5, d = R.int(2 * L + 3, 2 * L + 15), L2 = R.int(2, L), v = two ? d - L - L2 : 2 * L;
return two ? QN("Deux chèvres sont attachées à deux piquets distants de " + M(d) + " m, par des cordes de " + (L === L2 ? M(L) + " m chacune" : M(L) + " m et " + M(L2) + " m")  + ". Quelle est la plus petite distance possible entre les deux chèvres (en m) ?", v,
"Chaque chèvre reste dans un disque. Au plus près, elles sont sur le segment qui joint les piquets, chacune au bout de sa corde : " + M(d + " - " + L + " - " + L2 + " = " + v) + " m.",
{ ctx: "chevres", guide: [GR("Longueurs des deux cordes ensemble ?", L + L2, M(L + L2) + " m."), GR("Distance minimale ?", v, M(v) + " m.")], traps: [TR(d - L, "Les deux chèvres s'approchent : retire les deux cordes."), TR(d + L + L2, "C'est la plus grande distance possible.")] })
: QN("Une chèvre est attachée à un piquet par une corde de " + M(L) + " m : elle broute dans un disque. Quelle est la plus grande distance possible entre deux points où elle broute (en m) ?", v,
"Les deux points les plus éloignés du disque sont aux extrémités d'un diamètre : " + M("2 \\times " + L + " = " + v) + " m.",
{ ctx: "chevre-diametre", guide: [GR("Rayon du disque ?", L, M(L) + " m."), GR("Plus grande distance (un diamètre) ?", v, M(v) + " m.")], traps: [TR(L, "C'est la distance au piquet ; deux points opposés sont à deux rayons l'un de l'autre."), TR(L * L, "On cherche une longueur, pas une aire.")] }); },
() => { const r1 = R.int(2, 6), r2 = r1 + R.int(3, 8), large = R.rand() < 0.5, v = large ? r2 - r1 + 1 : r2 - r1 - 1;
return QN("On considère les points situés " + (large ? "à au moins " + cm(r1) + " et au plus " + cm(r2) : "à plus de " + cm(r1) + " et à moins de " + cm(r2)) + " d'un point " + M("O") + " (une couronne). Sur une demi-droite graduée d'origine " + M("O") + " (en cm), combien de points d'abscisse entière sont dans cette couronne ?", v,
(large ? "Les abscisses vont de " + M(r1) + " à " + M(r2) + ", bornes comprises" : "Les abscisses sont strictement entre " + M(r1) + " et " + M(r2)) + " : de " + M(large ? r1 : r1 + 1) + " à " + M(large ? r2 : r2 - 1) + ", soit " + M(v) + " points.",
{ ctx: "couronne", guide: [GR("Plus petite abscisse entière qui convient ?", large ? r1 : r1 + 1, M(large ? r1 : r1 + 1) + "."), GR("Nombre de points ?", v, M(v) + ".")], traps: [TR(r2 - r1, "Compte un par un : " + (large ? "les deux bornes sont comprises." : "les bornes sont exclues.")), TR(large ? r2 - r1 - 1 : r2 - r1 + 1, large ? "« Au moins » et « au plus » : les bornes sont comprises." : "« Plus de » et « moins de » : les bornes sont exclues.")] }); },
],
};


const AG = (n) => M("\\widehat{" + n + "}");
const BI = {
1: [
() => { const a = 2 * R.int(16, 80), v = a / 2;
return QN("L'angle " + AG("xOy") + " mesure " + dg(a) + ". La demi-droite " + M("[Oz)") + " est sa bissectrice. Combien mesure " + AG("xOz") + " (en degrés) ?", v,
"La bissectrice partage l'angle en deux angles de même mesure : " + M(N(a) + " \\div 2 = " + N(v)) + "°.",
{ ctx: "moitie", guide: [GR(AG("xOz") + " ?", v, M(N(v)) + "°.")], traps: [TR(a, "C'est l'angle entier ; la bissectrice le coupe en deux."), TR(180 - a, "La bissectrice partage l'angle xOy lui-même en deux.")] }); },
() => { const b = R.int(14, 85), v = 2 * b;
return QN("La demi-droite " + M("[Oz)") + " est la bissectrice de l'angle " + AG("xOy") + ", et " + AG("zOy") + " mesure " + dg(b) + ". Combien mesure " + AG("xOy") + " (en degrés) ?", v,
AG("xOz") + " et " + AG("zOy") + " sont égaux : " + M("2 \\times " + b + " = " + v) + "°.",
{ ctx: "double", guide: [GR(AG("xOz") + " ?", b, M(b) + "°."), GR(AG("xOy") + " ?", v, M(v) + "°.")], traps: [TR(b / 2, "zOy est déjà la moitié : on double."), TR(b, "C'est seulement la moitié de l'angle.")] }); },
() => { const a = 2 * R.int(20, 75); let b; do b = R.int(10, a - 10); while (Math.abs(b - a / 2) < 2); const v = Math.abs(b - a / 2);
return QN("La demi-droite " + M("[Ot)") + " partage l'angle " + AG("xOy") + " de " + dg(a) + " en " + AG("xOt") + " = " + dg(b) + " et " + AG("tOy") + " = " + dg(a - b) + ". De combien de degrés faut-il la tourner pour qu'elle devienne la bissectrice ?", v,
"La bissectrice ferait " + M(N(a) + " \\div 2 = " + N(a / 2)) + "° avec " + M("[Ox)") + " ; " + M("[Ot)") + " en fait " + M(b) + " : il faut la tourner de " + M(N(v)) + "°.",
{ ctx: "ecart-bissectrice", guide: [GR("Angle entre " + M("[Ox)") + " et la bissectrice ?", a / 2, M(N(a / 2)) + "°."), GR("Écart ?", v, M(N(v)) + "°.")], traps: [TR(Math.abs(a - 2 * b), "C'est la différence entre les deux angles ; tourner [Ot) en change deux à la fois : prends la moitié."), TR(a / 2, "On demande de combien tourner, pas la mesure de la moitié.")] }); },
],
2: [
() => { const a = 2 * R.int(20, 80), v = 180 - a / 2;
return QN("L'angle " + AG("xOy") + " mesure " + dg(a) + " ; " + M("[Oz)") + " est sa bissectrice et " + M("[Ot)") + " est la demi-droite opposée à " + M("[Ox)") + " (" + AG("xOt") + " est un angle plat). Combien mesure " + AG("zOt") + " (en degrés) ?", v,
AG("xOz") + " = " + M(N(a) + " \\div 2 = " + N(a / 2)) + "° ; " + AG("xOt") + " = 180° : " + AG("zOt") + " = " + M("180 - " + N(a / 2) + " = " + N(v)) + "°.",
{ ctx: "angle-plat", guide: [GR(AG("xOz") + " ?", a / 2, M(N(a / 2)) + "°."), GR(AG("zOt") + " ?", v, M(N(v)) + "°.")], traps: [TR(180 - a, "C'est l'angle yOt ; on mesure à partir de la bissectrice [Oz)."), TR(a / 2, "C'est xOz ; zOt complète jusqu'à l'angle plat.")] }); },
() => { let B, C; do { B = R.int(30, 90); C = R.int(25, 90); } while ((180 - B - C) % 2 || 180 - B - C < 20); const A = 180 - B - C, v = A / 2;
return QN("Dans le triangle " + M("ABC") + ", " + AG("ABC") + " = " + dg(B) + " et " + AG("ACB") + " = " + dg(C) + ". La bissectrice de l'angle " + AG("BAC") + " coupe " + M("[BC]") + " en " + M("D") + ". Combien mesure " + AG("BAD") + " (en degrés) ?", v,
"Somme des angles : " + AG("BAC") + " = " + M("180 - " + B + " - " + C + " = " + A) + "°. La bissectrice le coupe en deux : " + M(A + " \\div 2 = " + v) + "°.",
{ ctx: "triangle", guide: [GR(AG("BAC") + " ?", A, M(A) + "°."), GR(AG("BAD") + " ?", v, M(v) + "°.")], traps: [TR(A, "C'est l'angle entier BAC ; la bissectrice le partage en deux."), TR((B + C) / 2, "Calcule d'abord l'angle en A (somme des angles = 180°).")] }); },
() => { const b = R.int(30, 80), v = 90 - b;
return QN("Le triangle " + M("ABC") + " est isocèle en " + M("A") + " et ses angles à la base mesurent " + dg(b) + ". On trace la bissectrice de l'angle " + AG("BAC") + ". Quelle est la mesure de chacun des deux angles qu'elle forme en " + M("A") + " (en degrés) ?", v,
AG("BAC") + " = " + M("180 - 2 \\times " + b + " = " + (180 - 2 * b)) + "° ; sa bissectrice donne deux angles de " + M(N(v)) + "°. (Dans un triangle isocèle, elle est aussi l'axe de symétrie.)",
{ ctx: "isocele", guide: [GR(AG("BAC") + " ?", 180 - 2 * b, M(180 - 2 * b) + "°."), GR("Chaque moitié ?", v, M(N(v)) + "°.")], traps: [TR(180 - 2 * b, "C'est l'angle entier en A ; la bissectrice le coupe en deux."), TR(b / 2, "C'est l'angle au sommet A qu'on partage, pas un angle de la base.")] }); },
],
3: [
() => { let a, b; do { a = 2 * R.int(15, 60); b = 2 * R.int(15, 60); } while (a + b >= 178 || (a + b) % 2); const v = (a + b) / 2;
return QN("Les angles " + AG("xOy") + " = " + dg(a) + " et " + AG("yOt") + " = " + dg(b) + " sont côte à côte (adjacents). " + M("[Ou)") + " est la bissectrice de " + AG("xOy") + " et " + M("[Ov)") + " celle de " + AG("yOt") + ". Combien mesure " + AG("uOv") + " (en degrés) ?", v,
AG("uOy") + " = " + M(N(a / 2)) + "° et " + AG("yOv") + " = " + M(N(b / 2)) + "° : " + AG("uOv") + " = " + M(N(a / 2) + " + " + N(b / 2) + " = " + N(v)) + "°, la moitié de " + AG("xOt") + ".",
{ ctx: "deux-bissectrices", guide: [GR(AG("uOy") + " ?", a / 2, M(N(a / 2)) + "°."), GR(AG("yOv") + " ?", b / 2, M(N(b / 2)) + "°."), GR(AG("uOv") + " ?", v, M(N(v)) + "°.")], traps: [TR(a + b, "Chaque bissectrice ne garde que la moitié de son angle."), TR(Math.abs(a - b) / 2, "Les deux moitiés sont de part et d'autre de [Oy) : on les additionne.")] }); },
() => { const b = R.int(25, 80); let c; do c = R.int(5, b - 5); while (c === b - c); const v = 2 * b - c;
return QN("Dans l'angle " + AG("xOy") + ", on trace la bissectrice " + M("[Oz)") + " ; " + AG("zOy") + " = " + dg(b) + ". Une demi-droite " + M("[Ot)") + " est entre " + M("[Ox)") + " et " + M("[Oz)") + ", avec " + AG("xOt") + " = " + dg(c) + ". Combien mesure " + AG("tOy") + " (en degrés) ?", v,
AG("xOy") + " = " + M("2 \\times " + b + " = " + 2 * b) + "° ; " + AG("tOy") + " = " + M(2 * b + " - " + c + " = " + v) + "°.",
{ ctx: "trois-demi-droites", guide: [GR(AG("xOy") + " ?", 2 * b, M(2 * b) + "°."), GR(AG("tOy") + " ?", v, M(v) + "°.")], traps: [TR(b - c, "C'est l'angle tOz ; ajoute encore zOy."), TR(b + c, "[Ot) est entre [Ox) et [Oz) : tOy = xOy − xOt.")] }); },
() => { const a = 4 * R.int(8, 40), v = (3 * a) / 4;
return QN("L'angle " + AG("xOy") + " mesure " + dg(a) + ". On trace sa bissectrice " + M("[Oz)") + ", puis la bissectrice " + M("[Ow)") + " de l'angle " + AG("xOz") + ". Combien mesure " + AG("wOy") + " (en degrés) ?", v,
AG("xOz") + " = " + M(N(a / 2)) + "°, " + AG("xOw") + " = " + M(N(a / 4)) + "° ; " + AG("wOy") + " = " + M(N(a) + " - " + N(a / 4) + " = " + N(v)) + "°.",
{ ctx: "bissectrice-de-bissectrice", guide: [GR(AG("xOz") + " ?", a / 2, M(N(a / 2)) + "°."), GR(AG("xOw") + " ?", a / 4, M(N(a / 4)) + "°."), GR(AG("wOy") + " ?", v, M(N(v)) + "°.")], traps: [TR(a / 4, "C'est xOw ; on demande wOy."), TR(a / 2, "[Ow) n'est pas la bissectrice de xOy, mais celle de xOz.")] }); },
],
};


const SORTIES = ["Musée", "Zoo", "Cinéma", "Piscine", "Château", "Parc", "Ferme", "Théâtre", "Port", "Cirque", "Jardin", "Grotte"];
const table = () => { const names = shuffle(SORTIES.slice()).slice(0, 6); return names.map((n) => ({ n, p: R.int(4, 30), d: pk([1, 1.5, 2, 2.5, 3, 3.5, 4]), k: R.int(5, 60), e: R.int(2, 5) })); };
const tabT = (rows) => M("\\begin{array}{l|c|c|c|c} \\text{Sortie} & \\text{Prix (€)} & \\text{Durée (h)} & \\text{Dist. (km)} & \\text{Note} \\\\ \\hline " + rows.map((r) => "\\text{" + r.n + "} & " + r.p + " & " + N(r.d) + " & " + r.k + " & " + r.e).join(" \\\\ ") + " \\end{array}");
const INTRO = "Une classe compare des sorties (note des élèves sur 5) :<br>";
const ok2 = (c, n = 6) => c >= 2 && c <= n - 1;
const FI = {
1: [
() => { let rows, s, v; do { rows = table(); s = pk([10, 12, 15, 20]); v = rows.filter((r) => r.p < s).length; } while (!ok2(v));
return QN(INTRO + tabT(rows) + "<br>Combien de sorties coûtent moins de " + M(s) + " € ?", v, "On garde les prix inférieurs à " + M(s) + " : " + rows.filter((r) => r.p < s).map((r) => r.n + " (" + r.p + " €)").join(", ") + ", soit " + M(v) + ".",
{ shownOk: true, ctx: "un-critere", guide: [GR("Nombre de sorties à moins de " + M(s) + " € ?", v, M(v) + ".")], traps: [TR(6 - v, "Ce sont celles qui coûtent " + s + " € ou plus."), TR(rows.filter((r) => r.p <= s).length, "« Moins de " + s + " € » : une sortie à " + s + " € exactement ne compte pas.")] }); },
() => { let rows, t, L, v; do { rows = table(); t = pk([2, 2.5, 3]); L = rows.filter((r) => r.d < t); v = L.length ? Math.min(...L.map((r) => r.p)) : 0; } while (L.length < 2 || L.length > 5 || v === Math.min(...rows.map((r) => r.p)));
return QN(INTRO + tabT(rows) + "<br>Parmi les sorties qui durent moins de " + M(N(t)) + " h, quel est le prix de la moins chère (en €) ?", v,
"Sorties de moins de " + M(N(t)) + " h : " + L.map((r) => r.n + " (" + r.p + " €)").join(", ") + ". La moins chère coûte " + M(v) + " €.",
{ shownOk: true, ctx: "min-sous-critere", guide: [GR("Combien de sorties durent moins de " + M(N(t)) + " h ?", L.length, M(L.length) + "."), GR("Prix de la moins chère parmi elles ?", v, M(v) + " €.")], traps: [TR(Math.min(...rows.map((r) => r.p)), "C'est la moins chère de toutes ; il faut d'abord garder celles de moins de " + D(t) + " h."), TR(Math.max(...L.map((r) => r.p)), "C'est la plus chère du groupe.")] }); },
() => { let rows, s, t, v; do { rows = table(); s = pk([15, 20, 25]); t = pk([2, 2.5, 3]); v = rows.filter((r) => r.p <= s && r.d >= t).length; } while (!ok2(v, 5));
return QN(INTRO + tabT(rows) + "<br>Combien de sorties coûtent au plus " + M(s) + " € <b>et</b> durent au moins " + M(N(t)) + " h ?", v,
"Les deux conditions à la fois : " + rows.filter((r) => r.p <= s && r.d >= t).map((r) => r.n).join(", ") + ", soit " + M(v) + ".",
{ shownOk: true, ctx: "deux-criteres", guide: [GR("Combien coûtent au plus " + M(s) + " € ?", rows.filter((r) => r.p <= s).length, M(rows.filter((r) => r.p <= s).length) + "."), GR("Parmi elles, combien durent au moins " + M(N(t)) + " h ?", v, M(v) + ".")], traps: [TR(rows.filter((r) => r.p <= s || r.d >= t).length, "« Et » : il faut les deux conditions en même temps."), TR(rows.filter((r) => r.p <= s).length, "Il faut aussi vérifier la durée.")] }); },
],
2: [
() => { let rows, k, e, v; do { rows = table(); k = pk([15, 20, 25]); e = pk([4, 5]); v = rows.filter((r) => r.k < k || r.e >= e).length; } while (!ok2(v) || v === rows.filter((r) => r.k < k).length);
return QN(INTRO + tabT(rows) + "<br>Combien de sorties sont à moins de " + M(k) + " km <b>ou</b> ont une note d'au moins " + M(e) + " ? (une sortie qui vérifie les deux compte une fois)", v,
"« Ou » : au moins une des deux conditions. " + rows.filter((r) => r.k < k || r.e >= e).map((r) => r.n).join(", ") + " : " + M(v) + ".",
{ shownOk: true, ctx: "ou", guide: [GR("Combien sont à moins de " + M(k) + " km ?", rows.filter((r) => r.k < k).length, M(rows.filter((r) => r.k < k).length) + "."), GR("Total avec celles qui ont une note d'au moins " + M(e) + " (sans compter deux fois) ?", v, M(v) + ".")], traps: [TR(rows.filter((r) => r.k < k && r.e >= e).length, "« Ou » : une seule des deux conditions suffit."), TR(rows.filter((r) => r.k < k).length + rows.filter((r) => r.e >= e).length, "Une sortie qui vérifie les deux ne compte qu'une fois.")] }); },
() => { let rows, k, L, best; do { rows = table(); k = pk([20, 25, 30]); L = rows.filter((r) => r.k <= k); best = L.length ? Math.max(...L.map((r) => r.e)) : 0; } while (L.length < 2 || L.filter((r) => r.e === best).length !== 1);
const w = L.find((r) => r.e === best), v = w.p;
return QN(INTRO + tabT(rows) + "<br>La classe choisit, parmi les sorties à " + M(k) + " km au plus, celle qui a la meilleure note. Combien coûte-t-elle (en €) ?", v,
"À " + M(k) + " km au plus : " + L.map((r) => r.n + " (note " + r.e + ")").join(", ") + ". La meilleure note est " + M(best) + " : " + w.n + ", " + M(v) + " €.",
{ shownOk: true, ctx: "choix", guide: [GR("Meilleure note parmi les sorties à " + M(k) + " km au plus ?", best, M(best) + "."), GR("Prix de cette sortie ?", v, M(v) + " €.")], traps: [TR(Math.min(...L.map((r) => r.p)), "On choisit la meilleure note, pas le prix le plus bas."), TR(best, "On demande le prix de la sortie choisie.")] }); },
() => { let rows, t, L, v; do { rows = table(); t = pk([2, 2.5, 3]); L = rows.filter((r) => r.d > t); v = L.reduce((s, r) => s + r.p, 0); } while (!ok2(L.length));
return QN(INTRO + tabT(rows) + "<br>Combien coûtent en tout les sorties qui durent plus de " + M(N(t)) + " h (en €) ?", v,
"Plus de " + M(N(t)) + " h : " + L.map((r) => r.n + " (" + r.p + " €)").join(", ") + ". Total : " + M(L.map((r) => r.p).join(" + ") + " = " + v) + " €.",
{ shownOk: true, ctx: "total", guide: [GR("Combien de sorties durent plus de " + M(N(t)) + " h ?", L.length, M(L.length) + "."), GR("Total des prix ?", v, M(v) + " €.")], traps: [TR(rows.filter((r) => r.d >= t).reduce((s, r) => s + r.p, 0), "« Plus de " + D(t) + " h » : une durée de " + D(t) + " h exactement ne compte pas."), TR(rows.reduce((s, r) => s + r.p, 0), "On n'additionne que les sorties qui vérifient le critère.")] }); },
],
3: [
() => { let rows, s, k, e, v; do { rows = table(); s = pk([15, 20, 25]); k = pk([20, 30, 40]); e = pk([3, 4]); v = rows.filter((r) => r.p <= s && r.k <= k && r.e >= e).length; } while (v < 2);
return QN(INTRO + tabT(rows) + "<br>Combien de sorties coûtent au plus " + M(s) + " €, sont à " + M(k) + " km au plus <b>et</b> ont une note d'au moins " + M(e) + " ?", v,
"On filtre trois fois : " + rows.filter((r) => r.p <= s && r.k <= k && r.e >= e).map((r) => r.n).join(", ") + " : " + M(v) + ".",
{ shownOk: true, ctx: "trois-criteres", guide: [GR("Après le premier critère (prix), combien en reste-t-il ?", rows.filter((r) => r.p <= s).length, M(rows.filter((r) => r.p <= s).length) + "."), GR("Après les deux premiers (prix, distance) ?", rows.filter((r) => r.p <= s && r.k <= k).length, M(rows.filter((r) => r.p <= s && r.k <= k).length) + "."), GR("Avec les trois ?", v, M(v) + ".")],
traps: [TR(rows.filter((r) => r.p <= s && r.k <= k).length, "Il reste à vérifier la note."), TR(rows.filter((r) => r.p <= s || r.k <= k || r.e >= e).length, "Les trois conditions doivent être vraies en même temps.")] }); },
() => { let rows, B, t, L, v; do { rows = table(); t = pk([2, 2.5]); B = pk([30, 40, 50]); L = rows.filter((r) => r.d >= t).map((r) => r.p).sort((a, b) => a - b); v = 0; let s = 0; for (const p of L) if (s + p <= B) { s += p; v++; } } while (v < 2 || v === L.length);
return QN(INTRO + tabT(rows) + "<br>Avec un budget de " + M(B) + " €, combien de sorties différentes durant au moins " + M(N(t)) + " h peut-on faire au maximum ?", v,
"Sorties d'au moins " + M(N(t)) + " h, de la moins chère à la plus chère : " + M(L.join(" ; ")) + " €. On en prend le plus possible en commençant par les moins chères : " + M(v) + " (" + M(L.slice(0, v).join(" + ") + " = " + L.slice(0, v).reduce((a, b) => a + b, 0)) + " € ; une de plus dépasserait " + M(B) + " €).",
{ shownOk: true, ctx: "budget", guide: [GR("Combien de sorties durent au moins " + M(N(t)) + " h ?", L.length, M(L.length) + "."), GR("Nombre maximal dans le budget ?", v, M(v) + ".")], traps: [TR(L.length, "Toutes ne tiennent pas dans le budget de " + B + " € : additionne les prix."), TR(v - 1, "Commence par les moins chères : une de plus rentre.")] }); },
() => { let rows, k, L, v; do { rows = table(); k = pk([20, 30, 40]); L = rows.filter((r) => r.k < k); v = L.length ? Math.max(...L.map((r) => r.p)) - Math.min(...L.map((r) => r.p)) : 0; } while (L.length < 3 || v < 2);
return QN(INTRO + tabT(rows) + "<br>Parmi les sorties à moins de " + M(k) + " km, quel est l'écart de prix entre la plus chère et la moins chère (en €) ?", v,
"Moins de " + M(k) + " km : " + L.map((r) => r.n + " (" + r.p + " €)").join(", ") + ". Écart : " + M(Math.max(...L.map((r) => r.p)) + " - " + Math.min(...L.map((r) => r.p)) + " = " + v) + " €.",
{ shownOk: true, ctx: "ecart", guide: [GR("Prix le plus élevé parmi elles ?", Math.max(...L.map((r) => r.p)), M(Math.max(...L.map((r) => r.p))) + " €."), GR("Écart ?", v, M(v) + " €.")], traps: [TR(Math.max(...rows.map((r) => r.p)) - Math.min(...rows.map((r) => r.p)), "On ne garde que les sorties à moins de " + k + " km."), TR(Math.max(...L.map((r) => r.p)), "C'est le prix le plus élevé ; retire le plus bas.")] }); },
],
};



const FORM = [
() => { const a = pk([2.5, 3, 4, 6]), b = R.int(2, 9); return ["le prix à payer (en €) pour " + M("n") + " places, frais de réservation compris", "\\text{prix} = " + N(a) + " \\times n + " + b, (n) => a * n + b, "n", "€", (n) => a * (n + b), "On multiplie d'abord, puis on ajoute " + b + "."]; },
() => { const b = R.int(4, 9); return ["le périmètre (en cm) d'un rectangle de largeur " + M("x") + " cm", "\\text{périmètre} = 2 \\times (x + " + b + ")", (x) => 2 * (x + b), "x", "cm", (x) => 2 * x + b, "Les parenthèses d'abord : x + " + b + ", puis × 2."]; },
() => { const t0 = R.int(15, 25), r = pk([2, 3]) ; return ["la température (en °C) à l'intérieur d'un congélateur, " + M("t") + " heures après sa mise en marche" , "\\text{température} = " + t0 + " - " + r + " \\times t", (t) => t0 - r * t, "t", "°C", (t) => (t0 - r) * t, "La multiplication " + r + " × t passe avant la soustraction."]; },
() => { const c = R.int(1, 5); return ["l'aire (en cm²) d'une figure formée d'un carré de côté " + M("x") + " cm et d'un rectangle de " + c + " cm²", "\\text{aire} = x \\times x + " + c, (x) => x * x + c, "x", "cm²", (x) => 2 * x + c, "x × x, c'est x fois x (le carré), pas 2 fois x."]; },
];
const TF = {
1: [
() => { const [g, f, h, x, , w, wm] = pk(FORM)(), xv = R.int(3, 12), v = rnd(h(xv), 6);
return QN("La formule " + M(f) + " donne " + g + ". Calcule cette grandeur pour " + M(x + " = " + xv) + ".", v,
"On remplace " + M(x) + " par " + M(xv) + " et on calcule en respectant les priorités : " + M(N(v)) + ".",
{ ctx: "formule-valeur", guide: [GR("Résultat pour " + M(x + " = " + xv) + " ?", v, M(N(v)) + ".")], traps: [TR(rnd(w(xv), 6), wm), TR(rnd(h(xv + 1), 6), "Remplace " + x + " par " + xv + " exactement.")] }); },
() => { const [g, f, h, x, , w, wm] = pk(FORM)(), xs = [1, 2, 3, R.int(5, 10)], ys = xs.map((t) => rnd(h(t), 6)), k = R.int(0, 3), v = ys[k];
return QN("La formule " + M(f) + " donne " + g + ". Complète le tableau de valeurs : quel nombre remplace « ? »<br>" + M("\\begin{array}{c|cccc} " + x + " & " + xs.join(" & ") + " \\\\ \\hline \\text{valeur} & " + ys.map((y, i) => (i === k ? "?" : N(y))).join(" & ") + " \\end{array}"), v,
"Pour " + M(x + " = " + xs[k]) + ", la formule donne " + M(N(v)) + ".",
{ ctx: "tableau-formule", guide: [GR("Valeur pour " + M(x + " = " + xs[k]) + " ?", v, M(N(v)) + ".")], traps: [TR(rnd(w(xs[k]), 6), wm), TR(rnd(h(xs[k] + 1), 6), "Prends la valeur de " + x + " de la colonne du « ? ».")] }); },
() => { const pas = pk([1, 2]), xs = [1, 2, 3, 4, 5, 6].map((t) => t * pas) , mult = R.int(3, 9), add = R.int(0, 9), ys = xs.map((t) => mult * t + add), k = R.int(1, 5), y = ys[k], v = xs[k];
return QN("Le tableau donne la masse (en g) d'un sac selon le nombre " + M("n") + " de billes qu'il contient :<br>" + M("\\begin{array}{c|cccccc} n & " + xs.join(" & ") + " \\\\ \\hline \\text{masse (g)} & " + ys.join(" & ") + " \\end{array}") + "<br>Combien de billes contient un sac de " + M(y) + " g ?", v,
"On cherche " + M(y) + " dans la ligne des masses, puis on lit le nombre de billes au-dessus : " + M(v) + ".",
{ ctx: "lecture-inverse", guide: [GR("Nombre de billes au-dessus de " + M(y) + " g ?", v, M(v) + ".")], traps: [TR(y, "C'est la masse ; on lit le nombre de billes, dans la première ligne."), TR(xs[k - 1], "Regarde la colonne de " + y + " g exactement.")] }); },
],
2: [
() => { const [g, f, h, x, , w, wm] = pk(FORM.slice(1))(), xv = R.int(3, 9), v = rnd(h(xv), 6);
return QN("La formule " + M(f) + " donne " + g + ". Calcule-la pour " + M(x + " = " + xv) + " (attention aux priorités).", v,
"Parenthèses et multiplications d'abord : " + M("= " + N(v)) + ".",
{ ctx: "deux-etapes", guide: [GR("Résultat ?", v, M(N(v)) + ".")], traps: [TR(rnd(w(xv), 6), wm), TR(rnd(h(xv + 1), 6), "Remplace " + x + " par " + xv + " exactement.")] }); },
() => { const a = R.int(2, 9), b = R.int(2, 15), xs = [1, 2, 3, 4], ys = xs.map((t) => a * t + b);
return QN("Ce tableau a été fait avec la formule " + M("y = " + a + " \\times x + \\ldots") + " :<br>" + M("\\begin{array}{c|cccc} x & 1 & 2 & 3 & 4 \\\\ \\hline y & " + ys.join(" & ") + " \\end{array}") + "<br>Quel nombre manque dans la formule ?", b,
"Pour " + M("x = 1") + " : " + M(a + " \\times 1 = " + a) + " et " + M("y = " + ys[0]) + " : il manque " + M(ys[0] + " - " + a + " = " + b) + ". Vérification avec " + M("x = 2") + " : " + M(a + " \\times 2 + " + b + " = " + ys[1]) + ".",
{ ctx: "retrouver-nombre", guide: [GR(M(a + " \\times 1") + " ?", a, M(a) + "."), GR("Nombre manquant ?", b, M(b) + ".")], traps: [TR(ys[0], "C'est y pour x = 1 ; retire " + a + " × 1."), TR(ys[1] - ys[0], "C'est l'écart entre deux valeurs (le " + a + " de la formule).")] }); },
() => { const a = pk([0.5, 1, 2]), b = R.int(-2, 4), xs0 = [-4, -2, 0, 2, 4], k = pk([-3, -1, 1, 3, 5].filter((t) => a * t + b === Math.round(a * t + b) && Math.abs(a * t + b) <= 8)), v = a * k + b, f = (t) => a * t + b;
if (k === undefined || v === 0) return null;
return QN("Le graphique montre comment une grandeur " + M("y") + " dépend d'une grandeur " + M("x") + ". Lis la valeur de " + M("y") + " pour " + M("x = " + N(k)) + ".", v,
"On part de " + M(N(k)) + " sur l'axe horizontal, on monte (ou on descend) jusqu'à la droite, puis on lit sur l'axe vertical : " + M(N(v)) + ".",
{ ctx: "graphique-lecture", fig: FIG.plot([{ f }], xs0.map((t) => [t, f(t), ""]).filter((p) => Math.abs(p[1]) <= 8), { numbers: true, xr: [-6, 6], yr: [-6, 8], maxH: 300, label: "graphique" }),
guide: [GR("Valeur lue de " + M("y") + " ?", v, M(N(v)) + ".")], traps: [TR(k, "C'est la valeur de x ; on lit y sur l'axe vertical."), TR(rnd(v + a * 2, 6), "Pars bien de x = " + D(k) + ".")] }); },
],
3: [
() => { const pa = pk([2, 3, 4]), pb = pa + pk([1, 2, 3]), fix = (pb - pa) * R.int(3, 9), v = fix / (pb - pa);
return QN("Une piscine propose deux tarifs : tarif A, " + M(fix) + " € d'abonnement puis " + M(pa) + " € par entrée ; tarif B, " + M(pb) + " € par entrée sans abonnement. Pour combien d'entrées les deux tarifs coûtent-ils la même somme ?", v,
"Tarif A : " + M(fix + " + " + pa + " \\times n") + " ; tarif B : " + M(pb + " \\times n") + ". Chaque entrée coûte " + M(pb - pa) + " € de plus en B ; l'abonnement est rattrapé après " + M(fix + " \\div " + (pb - pa) + " = " + v) + " entrées (" + M(pb * v) + " € des deux côtés).",
{ ctx: "deux-tarifs", guide: [GR("Écart de prix par entrée ?", pb - pa, M(pb - pa) + " €."), GR("Nombre d'entrées ?", v, M(v) + ".")], traps: [TR(fix / pa, "L'abonnement se rattrape avec l'écart par entrée (" + (pb - pa) + " €)."), TR(fix / pb, "Compare les deux tarifs : divise par l'écart " + (pb - pa) + " €.")] }); },
() => { const h = R.int(-2, 2), m = pk([1, 2, 3]), k = R.int(-3, 1), f = (t) => (t - h) ** 2 + k, y = m * m + k, v = [h - m, h + m];
if (y === h + m || y === h - m) return null;
return QSet("Le graphique montre comment une grandeur " + M("y") + " dépend de " + M("x") + ". Pour quelles valeurs de " + M("x") + " la grandeur " + M("y") + " vaut-elle " + M(y) + " ? (sépare par « ; »)", v,
"On trace la droite horizontale à la hauteur " + M(y) + " : elle coupe la courbe en deux points, d'abscisses " + M(h - m) + " et " + M(h + m) + ".",
{ ctx: "graphique-valeurs", fig: FIG.plot([{ f }, { f: () => y, cls: "f-line", dash: true }], [], { numbers: true, xr: [-6, 6], yr: [Math.min(-2, k - 1), 9], maxH: 300, label: "courbe" }),
guide: [GR("En combien de points la droite " + M("y = " + y) + " coupe-t-elle la courbe ?", 2, "En deux points."), GSet("Valeurs de " + M("x") + " ?", v, M((h - m) + " \\,;\\, " + (h + m)) + ".")],
traps: [TSt([h + m], "Il y a un second point, de l'autre côté."), TSt([y], "On cherche des valeurs de x (axe horizontal).")] }); },
() => { const a = pk([1.5, 2.5, 3, 4]), b = R.int(2, 12), x1 = R.int(2, 6), x2 = x1 + R.int(2, 6), v = rnd(a * (x2 - x1), 6);
return QN("Avec la formule " + M("\\text{coût} = " + N(a) + " \\times n + " + b) + " (en €), de combien le coût augmente-t-il quand " + M("n") + " passe de " + M(x1) + " à " + M(x2) + " (en €) ?", v,
"Coût pour " + M(x1) + " : " + M(N(rnd(a * x1 + b, 6))) + " € ; pour " + M(x2) + " : " + M(N(rnd(a * x2 + b, 6))) + " €. Augmentation : " + M(N(v)) + " € (" + M(N(a) + " \\times " + (x2 - x1)) + " : le " + M(b) + " ne change pas).",
{ ctx: "variation", guide: [GR("Coût pour " + M("n = " + x1) + " ?", rnd(a * x1 + b, 6), M(N(rnd(a * x1 + b, 6))) + " €."), GR("Coût pour " + M("n = " + x2) + " ?", rnd(a * x2 + b, 6), M(N(rnd(a * x2 + b, 6))) + " €."), GR("Augmentation ?", v, M(N(v)) + " €.")], traps: [TR(rnd(a * x2 + b, 6), "C'est le coût pour " + x2 + " ; on demande l'augmentation."), TR(rnd(v + b, 6), "Les " + b + " € fixes sont payés dans les deux cas : ils ne comptent pas dans l'augmentation.")] }); },
],
};


const HA = {
1: [
() => { const b = dec(3, 14), h = dec(2, 10), v = rnd((b * h) / 2, 6);
return QN("Dans le triangle " + M("ABC") + ", " + M("BC = ") + cm(b) + " et la hauteur issue de " + M("A") + " mesure " + cm(h) + ". Calcule l'aire du triangle (en cm²).", v,
M("\\mathcal{A} = \\text{base} \\times \\text{hauteur} \\div 2 = " + N(b) + " \\times " + N(h) + " \\div 2 = " + N(v)) + " cm².",
{ ctx: "aire", guide: [GR(M(N(b) + " \\times " + N(h)) + " ?", rnd(b * h, 6), M(N(rnd(b * h, 6)))), GR("Aire ?", v, M(N(v)) + " cm².")], traps: [TR(rnd(b * h, 6), "N'oublie pas de diviser par 2."), TR(rnd(b + h, 6), "L'aire est un produit, pas une somme.")] }); },
() => { const b = R.int(4, 16), h = R.int(3, 12), A = (b * h) / 2;
return QN("Un triangle a une aire de " + M(N(A)) + " cm². Le côté " + M("[BC]") + " mesure " + cm(b) + ". Quelle est la hauteur relative à ce côté (en cm) ?", h,
M("\\text{base} \\times \\text{hauteur} = 2 \\times " + N(A) + " = " + b * h) + ", donc " + M("\\text{hauteur} = " + b * h + " \\div " + b + " = " + h) + " cm.",
{ ctx: "hauteur-depuis-aire", guide: [GR(M("2 \\times \\text{aire}") + " ?", b * h, M(b * h) + "."), GR("Hauteur ?", h, M(h) + " cm.")], traps: [TR(rnd(A / b, 6), "Aire = base × hauteur ÷ 2 : multiplie d'abord l'aire par 2."), TR(rnd(2 * A * b, 6), "On divise par la base.")] }); },
() => { const a = R.int(3, 14), b = R.int(3, 14), v = (a * b) / 2;
return QN("Le triangle " + M("ABC") + " est rectangle en " + M("A") + ", avec " + M("AB = ") + cm(a) + " et " + M("AC = ") + cm(b) + ". Calcule son aire (en cm²).", v,
"Dans un triangle rectangle, chaque côté de l'angle droit est une hauteur relative à l'autre : " + M("\\mathcal{A} = " + a + " \\times " + b + " \\div 2 = " + N(v)) + " cm².",
{ ctx: "rectangle-hauteurs", guide: [GR("Hauteur relative à " + M("[AC]") + " ?", a, M("AB = " + a) + " cm."), GR("Aire ?", v, M(N(v)) + " cm².")], traps: [TR(a * b, "N'oublie pas de diviser par 2."), TR(rnd((a + b) / 2, 6), "Base × hauteur : on multiplie.")] }); },
],
2: [
() => {
const [c, hc, a, v] = pk([[6, 4, 5, 4.8], [12, 8, 10, 9.6], [18, 12, 15, 14.4], [14, 24, 25, 13.44], [14, 12, 15, 11.2], [15, 5.6, 20, 4.2], [15, 5.6, 7, 12], [10, 16.8, 21, 8], [21, 8, 10, 16.8]]), A = rnd((c * hc) / 2, 6);
return QN("Dans le triangle " + M("ABC") + ", " + M("AB = ") + cm(c) + " et la hauteur issue de " + M("C") + " mesure " + cm(hc) + ". De plus " + M("BC = ") + cm(a) + ". Quelle est la longueur de la hauteur issue de " + M("A") + " (en cm) ?", v,
"L'aire se calcule avec n'importe quelle base et sa hauteur : " + M(N(c) + " \\times " + N(hc) + " \\div 2 = " + N(A)) + " cm². Avec la base " + M("[BC]") + " : " + M("\\text{hauteur} = 2 \\times " + N(A) + " \\div " + a + " = " + N(v)) + " cm.",
{ ctx: "deux-hauteurs", guide: [GR("Aire du triangle ?", A, M(N(A)) + " cm²."), GR("Hauteur issue de " + M("A") + " ?", v, M(N(v)) + " cm.")], traps: [TR(hc, "Chaque hauteur dépend de son côté : l'aire est la même, pas la hauteur."), TR(rnd(A / a, 6), "Aire = base × hauteur ÷ 2 : hauteur = 2 × aire ÷ base.")] }); },
() => { const B = R.int(25, 80), v = 90 - B;
return QN("Dans le triangle " + M("ABC") + ", " + AG("ABC") + " = " + dg(B) + ". La hauteur issue de " + M("A") + " coupe " + M("[BC]") + " en " + M("H") + ". Combien mesure " + AG("BAH") + " (en degrés) ?", v,
"La hauteur est perpendiculaire à " + M("(BC)") + " : le triangle " + M("ABH") + " est rectangle en " + M("H") + ". " + AG("BAH") + " = " + M("180 - 90 - " + B + " = " + v) + "°.",
{ ctx: "angle-hauteur", guide: [GR("Angle " + AG("AHB") + " ?", 90, "90° : la hauteur est perpendiculaire au côté."), GR(AG("BAH") + " ?", v, M(v) + "°.")], traps: [TR(180 - B, "Le triangle ABH a aussi un angle droit en H."), TR(B, "Ce n'est pas l'angle en B.")] }); },
() => { const b = R.int(3, 10), h = R.int(3, 9), out = R.int(1, 4), v = (b * h) / 2;
return QN("Le triangle " + M("ABC") + " a un angle obtus en " + M("B") + ", et la hauteur issue de " + M("A") + " tombe sur le prolongement de " + M("[BC]") + ", en " + M("H") + ", à " + cm(out) + " de " + M("B") + ". On a " + M("BC = ") + cm(b) + " et " + M("AH = ") + cm(h) + ". Calcule l'aire du triangle " + M("ABC") + " (en cm²).", v,
"La formule reste la même, avec la base " + M("[BC]") + " et la hauteur " + M("[AH]") + " (à l'extérieur du triangle) : " + M(b + " \\times " + h + " \\div 2 = " + N(v)) + " cm². La distance " + M("BH") + " ne sert pas.",
{ ctx: "obtus", guide: [GR("Base ?", b, M(b) + " cm."), GR("Aire ?", v, M(N(v)) + " cm².")], traps: [TR(((b + out) * h) / 2, "C'est l'aire du triangle AHC ; la base de ABC est [BC] seulement."), TR(b * h, "N'oublie pas de diviser par 2.")] }); },
],
3: [
() => { const [a, b, c] = pk([[6, 8, 10], [3, 4, 5], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20]]), v = (a * b) / c;  const gd = ((u, w) => { while (w) [u, w] = [w, u % w]; return u; })(a * b, c), vT = Math.abs(v * 1e4 - Math.round(v * 1e4)) < 1e-6 ? N(v) : "\\frac{" + (a * b) / gd + "}{" + c / gd + "} \\approx " + N(Math.round(v * 100) / 100);
return QN("Le triangle " + M("ABC") + " est rectangle en " + M("A") + ", avec " + M("AB = ") + cm(a) + ", " + M("AC = ") + cm(b) + " et " + M("BC = ") + cm(c) + ". Calcule la hauteur issue de " + M("A") + " (en cm).", v,
"Aire avec les côtés de l'angle droit : " + M(a + " \\times " + b + " \\div 2 = " + N((a * b) / 2)) + " cm². Avec la base " + M("[BC]") + " : " + M("\\text{hauteur} = 2 \\times " + N((a * b) / 2) + " \\div " + c + " = " + vT) + " cm.",
{ ctx: "hauteur-hypotenuse", guide: [GR("Aire ?", (a * b) / 2, M(N((a * b) / 2)) + " cm²."), GR("Hauteur issue de " + M("A") + " ?", v, M(vT) + " cm.")], traps: [TR(rnd((a + b) / 2, 6), "Calcule l'aire de deux façons."), TR(rnd((a * b) / 2 / c, 6), "Hauteur = 2 × aire ÷ base.")] }); },
() => { const C = R.int(30, 80), B = R.int(30, 80); if (B + C >= 170) return null; const v = 90 - C;
return QN("Le triangle " + M("ABC") + " a ses trois angles aigus : " + AG("ABC") + " = " + dg(B) + " et " + AG("ACB") + " = " + dg(C) + ". Ses trois hauteurs se coupent en un même point " + M("H") + " (l'orthocentre). La hauteur issue de " + M("B") + " coupe " + M("[AC]") + " en " + M("K") + ". Combien mesure " + AG("HBC") + " (en degrés) ?", v,
M("H") + " est sur la hauteur " + M("[BK]") + ", perpendiculaire à " + M("(AC)") + ". Dans le triangle " + M("BKC") + " rectangle en " + M("K") + " : " + AG("KBC") + " = " + M("180 - 90 - " + C + " = " + v) + "°, et " + AG("HBC") + " = " + AG("KBC") + ".",
{ ctx: "orthocentre", guide: [GR("Angle " + AG("BKC") + " ?", 90, "90°."), GR(AG("HBC") + " ?", v, M(v) + "°.")], traps: [TR(90 - B, "La hauteur issue de B est perpendiculaire à (AC) : utilise l'angle en C."), TR(180 - B - C, "C'est l'angle en A.")] }); },
() => { const m = R.int(3, 9), h = R.int(4, 12), v = (m * h) / 2;
return QN("Le triangle " + M("ABC") + " est isocèle en " + M("A") + ", avec " + M("BC = ") + cm(2 * m) + " et la hauteur " + M("AH = ") + cm(h) + " (" + M("H") + " sur " + M("[BC]") + "). Dans un triangle isocèle, cette hauteur coupe la base en son milieu. Calcule l'aire du triangle " + M("ABH") + " (en cm²).", v,
M("H") + " est le milieu de " + M("[BC]") + " : " + M("BH = " + m) + " cm. " + M("ABH") + " est rectangle en " + M("H") + " : " + M(m + " \\times " + h + " \\div 2 = " + N(v)) + " cm², la moitié de l'aire de " + M("ABC") + ".",
{ ctx: "isocele-moitie", guide: [GR(M("BH") + " ?", m, M(m) + " cm."), GR("Aire de " + M("ABH") + " ?", v, M(N(v)) + " cm².")], traps: [TR(m * h, "C'est l'aire de ABC tout entier ; ABH en est la moitié."), TR((m * h) / 4, "BH = " + m + " : l'aire de ABH vaut BH × AH ÷ 2.")] }); },
],
};



const PR = (ctx, q, parts, hints, sol) => ({ ctx, q, hints, sol, parts: parts.map(([label, value, round]) => ({ label, spec: Object.assign({ kind: "value", value: rnd(value) }, round ? { round } : {}) })) });
const rdv = (v, s) => rnd(Math.round(rnd(v / s, 9)) * s, 9);
const nett = (v, s) => Math.abs((Math.abs(rnd(v / s, 9)) % 1) - 0.5) > 0.02;
const eqa = (v) => (Number.isInteger(rnd(v * 10, 6)) ? " = " + N(rnd(v, 4)) : " \\approx " + N(rdv(v, 0.1)));
const TRIP = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20], [7, 24, 25], [15, 20, 25], [10, 24, 26]];
const PROBS = {
cercle6: [() => {
const cx = pk(["deux-cercles", "chevre", "piste", "antenne"]);
if (cx === "deux-cercles") {
let r, s, d; do { r = R.int(3, 8); s = R.int(3, 8); d = R.int(Math.abs(r - s) + 1, r + s - 1); } while (d < 3);
const meme = r === s;
return PR(cx, "Le cercle de centre A a pour rayon " + r + " cm, le cercle de centre B a pour rayon " + s + " cm, et AB = " + d + " cm. Les deux cercles se coupent en M et N.",
[["a) Longueur AM (cm)", r], ["b) Périmètre du triangle AMB (cm)", d + r + s], ["c) Périmètre du quadrilatère AMBN (cm)", 2 * (r + s)]],
["M est sur les deux cercles : AM est un rayon du premier, BM un rayon du second.", "AMBN a quatre côtés : AM, MB, BN et NA ([AB] est une diagonale)."],
"a) " + r + " cm (rayon) ; b) " + M(d + " + " + r + " + " + s + " = " + (d + r + s)) + " cm ; c) " + M(r + " + " + s + " + " + s + " + " + r + " = " + 2 * (r + s)) + " cm" + (meme ? " (c'est un losange)" : "") + ".");
}
if (cx === "chevre") {
const r = R.int(3, 9), dd = r + R.int(2, 8), x = R.int(1, 4), [animal, ferme] = pk([["chèvre", "Dans une ferme du Périgord"], ["chèvre", "Dans un pré des Vosges"], ["brebis", "Dans un alpage de Savoie"], ["chèvre", "Dans un jardin de Provence"]]);
return PR(cx, ferme + ", une " + animal + " est attachée à un piquet P par une corde de " + r + " m : elle peut brouter tous les points situés à " + r + " m ou moins de P (un disque). Un pommier est à " + dd + " m du piquet.",
[["a) Diamètre de la zone où elle peut brouter (m)", 2 * r], ["b) Distance entre le pommier et le bord de cette zone (m)", dd - r], ["c) On rallonge la corde de " + x + " m. Nouveau diamètre de la zone (m)", 2 * (r + x)]],
["La zone broutée est un disque de centre P et de rayon " + r + " m.", "Le bord de la zone le plus proche du pommier est sur le segment [P pommier], à " + r + " m de P."],
"a) " + M("2 \\times " + r + " = " + 2 * r) + " m ; b) " + M(dd + " - " + r + " = " + (dd - r)) + " m ; c) rayon " + (r + x) + " m, diamètre " + M(2 * (r + x)) + " m.");
}
if (cx === "piste") {
let a, r1, r2; do { a = R.int(3, 15); r1 = R.int(2, 9); r2 = R.int(2, 9); } while (r1 === r2 || a <= r1);
const T0 = a + r1, b = T0 + r2, lieu = pk(["le long du canal du Midi", "au bord de la Loire", "sur l'ancienne voie ferrée du Morvan", "le long du lac d'Annecy"]);
return PR(cx, "Une piste cyclable rectiligne " + lieu + " est graduée en kilomètres. La borne A est au km " + a + " et la borne B au km " + b + ". Une fontaine est sur la piste, à " + r1 + " km de A et à " + r2 + " km de B.",
[["a) Distance AB (km)", b - a], ["b) Au kilomètre combien se trouve la fontaine ?", T0], ["c) Un autre point de la piste est aussi à " + r1 + " km de A : à quel kilomètre ?", a - r1]],
["Sur une droite, deux points sont à " + r1 + " km de A : un de chaque côté.", "Cherche celui qui est aussi à " + r2 + " km de B."],
"a) " + M(b + " - " + a + " = " + (b - a)) + " km ; b) à " + r1 + " km de A : km " + (a - r1) + " ou km " + T0 + " ; à " + r2 + " km de B : km " + T0 + " ou km " + (b + r2) + ". La fontaine est au km " + T0 + " ; c) km " + M(a + " - " + r1 + " = " + (a - r1)) + ".");
}
const r = R.int(8, 20); let ds; do { ds = [r, ...Array.from({ length: 4 }, () => R.int(2 * r - 2 * r + 3, r + 9) + pk([0, 0.5]))]; } while (new Set(ds).size < 5 || ds.filter((x) => x <= r).length < 2 || ds.filter((x) => x <= r).length > 4);
ds = ds.sort(() => R.rand() - 0.5); const nom = ["Saint-Jean", "Lavaur", "Montfort", "Beaulieu", "Villeneuve"], cov = ds.filter((x) => x <= r).length, mx = Math.max(...ds);
return PR(cx, "Une antenne relais couvre tous les points situés à " + r + " km ou moins d'elle (un disque). Voici les distances de cinq villages à l'antenne : " + ds.map((x, i) => nom[i] + " " + D(x) + " km").join(", ") + ".",
[["a) Nombre de villages couverts", cov], ["b) De combien de km faut-il augmenter la portée pour couvrir les cinq villages ?", mx - r], ["c) Diamètre de la zone couverte (km)", 2 * r]],
["Un village est couvert si sa distance à l'antenne est inférieure ou égale à " + r + " km.", "Un village à exactement " + r + " km est sur le cercle : il est couvert."],
"a) Villages à " + r + " km au plus : " + ds.filter((x) => x <= r).map(D).join(" ; ") + ", soit " + cov + " villages ; b) le plus loin est à " + D(mx) + " km : " + M(N(mx) + " - " + r + " = " + N(rnd(mx - r))) + " km ; c) " + M("2 \\times " + r + " = " + 2 * r) + " km.");
}],
bissec6: [() => {
const cx = pk(["adjacents", "plat", "triangle", "tarte"]);
if (cx === "adjacents") {
let a, b; do { a = 2 * R.int(15, 60); b = 2 * R.int(12, 45); } while (a === b || a + b >= 180);
return PR(cx, "Les angles xOy = " + a + "° et yOt = " + b + "° sont adjacents. [Ou) est la bissectrice de xOy et [Ov) celle de yOt.",
[["a) Angle uOy (°)", a / 2], ["b) Angle yOv (°)", b / 2], ["c) Angle uOv (°)", (a + b) / 2]],
["Chaque bissectrice partage son angle en deux angles égaux.", "uOv = uOy + yOv."], "a) " + M(a + " \\div 2 = " + a / 2) + "° ; b) " + M(b + " \\div 2 = " + b / 2) + "° ; c) " + M(a / 2 + " + " + b / 2 + " = " + (a + b) / 2) + "°.");
}
if (cx === "plat") {
let a; do a = 2 * R.int(12, 78); while (a === 90);
return PR(cx, "Les angles xOy et yOz sont adjacents, et [Ox) et [Oz) sont dans le prolongement l'une de l'autre (angle plat xOz). xOy = " + a + "°. [Ou) est la bissectrice de xOy et [Ov) celle de yOz.",
[["a) Angle yOz (°)", 180 - a], ["b) Angle uOy (°)", a / 2], ["c) Angle uOv (°)", 90]],
["Un angle plat mesure 180°.", "uOv = moitié de xOy + moitié de yOz = moitié de 180°."],
"a) " + M("180 - " + a + " = " + (180 - a)) + "° ; b) " + M(a + " \\div 2 = " + a / 2) + "° ; c) " + M(a / 2 + " + " + (180 - a) / 2 + " = 90") + "° : les deux bissectrices sont perpendiculaires.");
}
if (cx === "triangle") {
let A, B; do { A = 2 * R.int(15, 50); B = R.int(25, 85); } while (A + B >= 165);
return PR(cx, "Dans le triangle ABC, l'angle Â mesure " + A + "° et l'angle B̂ mesure " + B + "°. La bissectrice de l'angle Â coupe le côté [BC] en D.",
[["a) Angle Ĉ (°)", 180 - A - B], ["b) Angle BAD (°)", A / 2], ["c) Angle ADB (°)", 180 - B - A / 2]],
["La somme des angles d'un triangle vaut 180°.", "Dans le triangle ABD : B̂, BAD et ADB."],
"a) " + M("180 - " + A + " - " + B + " = " + (180 - A - B)) + "° ; b) " + M(A + " \\div 2 = " + A / 2) + "° ; c) dans ABD : " + M("180 - " + B + " - " + A / 2 + " = " + (180 - B - A / 2)) + "°.");
}
const a = pk([40, 48, 60, 72, 80, 90, 96, 120]), qui = pk(["tarte aux pommes", "pizza", "galette des rois", "quiche lorraine"]);
return PR(cx, "Pour un goûter, on coupe dans une " + qui + " ronde une part dont l'angle au centre mesure " + a + "°. On partage cette part en deux selon la bissectrice de son angle, puis on partage encore chaque morceau en deux selon sa bissectrice.",
[["a) Angle au centre d'un morceau après le premier partage (°)", a / 2], ["b) Angle au centre d'un petit morceau à la fin (°)", a / 4], ["c) Combien de petits morceaux de cette taille faudrait-il pour faire toute la " + qui.split(" ")[0] + " ?", 1440 / a]],
["La bissectrice partage un angle en deux angles égaux.", "Un tour complet mesure 360°."],
"a) " + M(a + " \\div 2 = " + N(a / 2)) + "° ; b) " + M(N(a / 2) + " \\div 2 = " + N(a / 4)) + "° ; c) " + M("360 \\div " + N(a / 4) + " = " + 1440 / a) + ".");
}],
filtre6: [() => {
const cx = pk(["sorties", "smartphones", "campings"]), sh = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R.rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const tab = (H, rows) => M("\\begin{array}{l|c|c|c|c} " + H.map((h) => "\\text{" + h + "}").join(" & ") + " \\\\ \\hline " + rows.map((r) => "\\text{" + r[0] + "} & " + r.slice(1).map(N).join(" & ")).join(" \\\\ ") + " \\end{array}");
if (cx === "sorties") {
let rows, s, L; do { rows = sh(SORTIES.slice()).slice(0, 6).map((n) => [n, R.int(4, 30), pk([1, 1.5, 2, 2.5, 3, 3.5, 4]), R.int(5, 60), R.int(2, 5)]); s = pk([12, 15, 18, 20, 25]); L = rows.filter((r) => r[1] <= s); } while (L.length < 2 || L.length > 5);
const best = Math.max(...L.map((r) => r[4])), tot = rows.reduce((t, r) => t + r[1], 0);
return PR(cx, INTRO + tab(["Sortie", "Prix (€)", "Durée (h)", "Dist. (km)", "Note"], rows),
[["a) Nombre de sorties à " + s + " € au plus", L.length], ["b) Meilleure note parmi les sorties à " + s + " € au plus", best], ["c) Prix total de toutes les sorties du tableau (€)", tot]],
["Filtre d'abord par le prix (« au plus " + s + " € » : le prix de " + s + " € est compris).", "Additionne tous les prix pour c)."], "a) " + L.map((r) => r[0] + " (" + r[1] + " €)").join(", ") + ", soit " + L.length + " ; b) " + best + " ; c) " + tot + " €.");
}
if (cx === "smartphones") {
const MOD = ["Alto", "Brio", "Cosmo", "Delta", "Éclat", "Furio", "Gamma", "Hélio"];
let rows, s, h, L; do { rows = sh(MOD.slice()).slice(0, 6).map((n) => [n, 10 * R.int(15, 80), R.int(14, 40), pk([64, 128, 256]), R.int(2, 5)]); s = 10 * R.int(35, 60); h = R.int(20, 30); L = rows.filter((r) => r[1] < s && r[2] >= h); } while (L.length < 1 || L.length > 4);
const four = rows.filter((r) => r[4] >= 4); if (!four.length) rows[0][4] = 4;
const F4 = rows.filter((r) => r[4] >= 4), cheap = Math.min(...F4.map((r) => r[1])), ec = Math.max(...rows.map((r) => r[1])) - Math.min(...rows.map((r) => r[1]));
return PR(cx, "Un site compare six smartphones (note des clients sur 5) :<br>" + tab(["Modèle", "Prix (€)", "Autonomie (h)", "Mémoire (Go)", "Note"], rows),
[["a) Nombre de modèles à moins de " + s + " € ET avec au moins " + h + " h d'autonomie", L.length], ["b) Prix du moins cher des modèles notés 4 ou plus (€)", cheap], ["c) Écart de prix entre le plus cher et le moins cher des six (€)", ec]],
["Deux critères à la fois : un modèle doit vérifier les deux.", "« Moins de " + s + " € » : le prix de " + s + " € est exclu ; « au moins " + h + " h » : la durée de " + h + " h est comprise."], "a) " + (L.map((r) => r[0]).join(", ") || "aucun") + ", soit " + L.length + " ; b) notés 4 ou plus : " + F4.map((r) => r[0] + " (" + r[1] + " €)").join(", ") + ", donc " + cheap + " € ; c) " + ec + " €.");
}
const CAMP = ["Les Pins", "La Dune", "Le Phare", "Les Mouettes", "L'Estuaire", "La Pinède", "Les Oyats", "Le Moulin"], cote = pk(["en Vendée", "dans les Landes", "en Bretagne", "en Charente-Maritime"]);
let rows, d, L; do { rows = sh(CAMP.slice()).slice(0, 6).map((n) => [n, R.int(14, 45), pk([0.2, 0.5, 0.8, 1, 1.5, 2, 3, 4]), R.int(40, 250), R.int(2, 5)]); d = pk([0.5, 1, 1.5, 2]); L = rows.filter((r) => r[2] <= d); } while (L.length < 2 || L.length > 5);
const cheap = Math.min(...L.map((r) => r[1])), n = R.int(3, 7);
return PR(cx, "Une famille compare six campings " + cote + " (prix d'un emplacement pour une nuit, note des clients sur 5) :<br>" + tab(["Camping", "Prix (€)", "Plage (km)", "Places", "Note"], rows),
[["a) Nombre de campings à " + D(d) + " km de la plage au plus", L.length], ["b) Prix d'une nuit dans le moins cher des campings à " + D(d) + " km de la plage au plus (€)", cheap], ["c) Prix de " + n + " nuits dans ce camping, le moins cher à " + D(d) + " km de la plage au plus (€)", n * cheap]],
["« Au plus " + D(d) + " km » : la distance de " + D(d) + " km est comprise.", "Parmi les campings retenus, cherche le plus petit prix."], "a) " + L.map((r) => r[0] + " (" + D(r[2]) + " km)").join(", ") + ", soit " + L.length + " ; b) " + cheap + " € ; c) " + M(n + " \\times " + cheap + " = " + n * cheap) + " €.");
}],
tabform5: [() => {
const cx = pk(["club", "location", "congelateur", "bougie"]);
if (cx === "club" || cx === "location") {
const club = cx === "club", a = club ? R.int(3, 9) : pk([1.5, 2, 2.5, 3, 3.5, 4]), b = club ? R.int(5, 25) : pk([2, 3, 4, 5, 6]), n1 = R.int(2, 6), n2 = R.int(8, 12), n3 = R.int(13, 24);
const [qui, var1, unit] = club ? pk([["Un club d'escalade de Grenoble facture ses séances", "séances", "n"], ["L'école de musique de Rouen facture ses cours", "cours", "n"], ["La piscine municipale de Nantes facture ses entrées avec une carte", "entrées", "n"]]) : pk([["Pour louer un vélo électrique à La Rochelle, on paie", "heures", "t"], ["Pour louer un kayak sur l'Ardèche, on paie", "heures", "t"], ["Pour louer un paddle sur le lac d'Annecy, on paie", "heures", "t"]]);
const E2 = (v) => (Number.isInteger(v) ? D(v) : v.toFixed(2).replace(".", ","));
const f = (n) => rnd(a * n + b);
return PR(cx, qui + " : " + M("\\text{prix} = " + N(a) + " \\times " + unit + " + " + b) + " (en €) pour " + M(unit) + " " + var1 + ".",
[["a) Prix pour " + n1 + " " + var1 + " (€)", f(n1)], ["b) Prix pour " + n2 + " " + var1 + " (€)", f(n2)], ["c) Nombre de " + var1 + " pour un prix de " + E2(f(n3)) + " €", n3]],
["Remplace " + unit + " par " + n1 + ", puis par " + n2 + ".", "c) Retire " + b + ", puis divise par " + D(a) + "."],
"a) " + M(N(a) + " \\times " + n1 + " + " + b + " = " + N(f(n1))) + " ; b) " + M(N(a) + " \\times " + n2 + " + " + b + " = " + N(f(n2))) + " ; c) " + M("(" + N(f(n3)) + " - " + b + ") \\div " + N(a) + " = " + n3) + ".");
}
if (cx === "congelateur") {
const r = pk([2, 3]), T0 = pk([18, 20, 22]), t1 = R.int(2, 5), t2 = t1 + R.int(2, 4); let t3; do t3 = R.int(t2 + 1, Math.floor((T0 + 21) / r)); while (T0 - r * t3 > -6);
const f = (t) => T0 - r * t;
return PR(cx, "On met en marche un congélateur. " + M("t") + " heures après, la température à l'intérieur est " + M("T = " + T0 + " - " + r + " \\times t") + " (en °C), jusqu'à ce qu'il atteigne sa température de réglage.",
[["a) Température après " + t1 + " h (°C)", f(t1)], ["b) Température après " + t2 + " h (°C)", f(t2)], ["c) Au bout de combien d'heures la température est-elle de " + D(f(t3)).replace("-", "−") + " °C ?", t3]],
["Remplace t par " + t1 + ".", "c) La température baisse de " + r + " °C par heure : de " + T0 + " °C à " + D(f(t3)).replace("-", "−") + " °C, elle baisse de " + (T0 - f(t3)) + " °C."],
"a) " + M(T0 + " - " + r + " \\times " + t1 + " = " + f(t1)) + " °C ; b) " + M(T0 + " - " + r + " \\times " + t2 + " = " + N(f(t2))) + " °C ; c) " + M("(" + T0 + " - (" + N(f(t3)) + ")) \\div " + r + " = " + t3) + " h.");
}
let h0, c; do { h0 = pk([12, 15, 18, 20, 24, 25, 30]); c = pk([0.5, 1, 1.5, 2, 2.5]); } while (!Number.isInteger(h0 / c) || h0 / c < 6 || h0 / c > 40);
const tot = h0 / c, t1 = R.int(1, Math.floor(tot / 3)), t2 = R.int(Math.ceil(tot / 3) + 1, tot - 1), f = (t) => rnd(h0 - c * t), obj = pk(["Une bougie", "Un cierge", "Une bougie parfumée"]);
return PR(cx, obj + " allumé" + (obj === "Un cierge" ? "" : "e") + " mesure " + M("h = " + h0 + " - " + N(c) + " \\times t") + " cm de haut, " + M("t") + " heures après avoir été allumé" + (obj === "Un cierge" ? "" : "e") + ".",
[["a) Hauteur après " + t1 + " h (cm)", f(t1)], ["b) Hauteur après " + t2 + " h (cm)", f(t2)], ["c) Au bout de combien d'heures est-" + (obj === "Un cierge" ? "il" : "elle") + " entièrement consumé" + (obj === "Un cierge" ? "" : "e") + " (h = 0) ?", tot]],
["Remplace t par " + t1 + ", puis par " + t2 + ".", "c) Elle perd " + D(c) + " cm par heure : combien d'heures pour perdre " + h0 + " cm ?"],
"a) " + M(h0 + " - " + N(c) + " \\times " + t1 + " = " + N(f(t1))) + " cm ; b) " + M(h0 + " - " + N(c) + " \\times " + t2 + " = " + N(f(t2))) + " cm ; c) " + M(h0 + " \\div " + N(c) + " = " + tot) + " h.");
}],
hauteurs5: [() => {
const cx = pk(["rectangle", "terrain", "pignon", "voile"]);
if (cx === "rectangle" || cx === "voile") {
let a, b, c, k = 1; do { [a, b, c] = pk(TRIP); if (R.rand() < 0.5) [a, b] = [b, a]; k = cx === "voile" ? pk([0.5, 1]) : 1; } while ((!nett((a * b) / c, 0.1) && !Number.isInteger((a * b * 10) / c)) || c > 26 || (cx === "voile" && (c * k > 9 || Math.min(a, b) * k < 1.5)));
const Ar = (a * b) / 2, hA = (a * b) / c, fromB = R.rand() < 0.5, p = pk([12, 15, 18, 20, 25]);
if (cx === "rectangle") return PR(cx, "Le triangle ABC est rectangle en A, avec AB = " + a + " cm, AC = " + b + " cm et BC = " + c + " cm.",
[["a) Aire du triangle (cm²)", Ar], ["b) Longueur de la hauteur issue de A (cm, au dixième)", hA, 0.1], ["c) Longueur de la hauteur issue de " + (fromB ? "B" : "C") + " (cm)", fromB ? a : b]],
["Les deux côtés de l'angle droit sont aussi des hauteurs : aire = AB × AC ÷ 2.", "Hauteur issue de A (relative à [BC]) = 2 × aire ÷ BC."],
"a) " + M(a + " \\times " + b + " \\div 2 = " + N(Ar)) + " cm² ; b) " + M("2 \\times " + N(Ar) + " \\div " + c + " = " + N(rnd(hA, 4)) + (Number.isInteger(hA * 10) ? "" : " \\approx " + N(rdv(hA, 0.1)))) + " cm ; c) la hauteur issue de " + (fromB ? "B est [BA] : " + a : "C est [CA] : " + b) + " cm.");
const [m, bo, hy] = [a * k, b * k, c * k], ARv = (m * bo) / 2, hv = (m * bo) / hy;
return PR(cx, "La voile d'un dériveur, sur le lac de Serre-Ponçon, a la forme d'un triangle ABC rectangle en A : le côté le long du mât, [AB], mesure " + D(m) + " m, le côté le long de la bôme, [AC], mesure " + D(bo) + " m, et [BC] mesure " + D(hy) + " m.",
[["a) Aire de la voile (m²)", ARv], ["b) Longueur de la hauteur issue de A (m, au dixième)", hv, 0.1], ["c) Prix de la toile à " + p + " € le m² (€)", ARv * p]],
["Dans un triangle rectangle, les côtés de l'angle droit sont des hauteurs.", "Hauteur issue de A : 2 × aire ÷ BC."],
"a) " + M(N(m) + " \\times " + N(bo) + " \\div 2 = " + N(ARv)) + " m² ; b) " + M("2 \\times " + N(ARv) + " \\div " + N(hy) + eqa(hv)) + " m ; c) " + M(N(ARv) + " \\times " + p + " = " + N(rnd(ARv * p))) + " €.");
}
if (cx === "terrain") {
let bh, h, c, b; do { [bh, h, c] = pk(TRIP); if (R.rand() < 0.5) [bh, h] = [bh, h].reverse(); b = bh + R.int(2, 20); } while (c > 26 || b === c || !nett((b * h) / c, 0.1));
const Ar = (b * h) / 2, hC = (b * h) / c, p = pk([2, 3, 4, 5]), lieu = pk(["à Angers", "près de Toulouse", "en Normandie", "dans la Drôme"]);
return PR(cx, "Un terrain triangulaire ABC " + lieu + " a un côté [BC] de " + b + " m. La hauteur issue de A mesure " + h + " m et le côté [AB] mesure " + c + " m.",
[["a) Aire du terrain (m²)", Ar], ["b) Longueur de la hauteur issue de C, relative au côté [AB] (m, au dixième)", hC, 0.1], ["c) Prix du gazon pour tout le terrain, à " + p + " € le m² (€)", Ar * p]],
["Aire = base × hauteur ÷ 2, avec la hauteur relative à cette base.", "L'aire ne change pas si on prend [AB] comme base : hauteur = 2 × aire ÷ AB."],
"a) " + M(b + " \\times " + h + " \\div 2 = " + N(Ar)) + " m² ; b) " + M("2 \\times " + N(Ar) + " \\div " + c + eqa(hC)) + " m ; c) " + M(N(Ar) + " \\times " + p + " = " + N(rnd(Ar * p))) + " €.");
}
const [hb, h, s] = pk([[3, 4, 5], [4, 3, 5], [6, 2.5, 6.5], [4.5, 6, 7.5], [6, 4.5, 7.5], [2.4, 3.2, 4], [3.2, 2.4, 4], [2.5, 6, 6.5]]), b = 2 * hb, Ar = (b * h) / 2, hB = (b * h) / s;
return PR(cx, "Le pignon d'une maison " + pk(["normande", "alsacienne", "savoyarde", "bretonne"]) + " est un triangle isocèle ABC : la base [BC] mesure " + D(b) + " m, AB = AC = " + D(s) + " m, et la hauteur issue de A mesure " + D(h) + " m.",
[["a) Aire du pignon (m²)", Ar], ["b) Longueur de la hauteur issue de B, relative au côté [AC] (m, au dixième)", hB, 0.1], ["c) Aire à peindre pour les deux pignons de la maison (m²)", 2 * Ar]],
["Aire = base × hauteur ÷ 2.", "Avec [AC] comme base : hauteur issue de B = 2 × aire ÷ AC."],
"a) " + M(N(b) + " \\times " + N(h) + " \\div 2 = " + N(Ar)) + " m² ; b) " + M("2 \\times " + N(Ar) + " \\div " + N(s) + (Number.isInteger(hB * 10) ? " = " + N(rnd(hB, 4)) : " \\approx " + N(rdv(hB, 0.1)))) + " m ; c) " + M("2 \\times " + N(Ar) + " = " + N(2 * Ar)) + " m².");
}],
};

const DEFS = [
{ id: "cercle6", theme: "es", label: "Cercle, disque et distance à un point", ex: "M \\in \\mathcal{C} \\iff OM = r", FR: [6], againFR: [7], g: CE, probs: PROBS.cercle6,
hint: "Le cercle de centre O et de rayon r est formé de tous les points situés à r de O ; le disque, de tous les points situés à r ou moins de O. Diamètre = 2 × rayon. Sur une droite graduée, deux points sont à une distance donnée d'un point O : un de chaque côté.",
comps: ["Rayon et diamètre, points à une distance donnée, disque", "Segment, triangle isocèle, trésor sur une droite", "Deux cercles, chèvres, couronne"],
lesson: ["Cercle et disque", "Un cercle, c'est tous les points à la même distance de son centre.",
"Le cercle de centre \\(O\\) et de rayon \\(r\\) est l'ensemble des points \\(M\\) tels que \\(OM = r\\). Le disque de centre \\(O\\) et de rayon \\(r\\) est l'ensemble des points \\(M\\) tels que \\(OM \\leqslant r\\) (le cercle et son intérieur). Un diamètre passe par le centre : il mesure \\(2r\\). Pour trouver un point situé à une distance donnée de deux points \\(A\\) et \\(B\\), on cherche l'intersection de deux cercles.",
["Rayon 4 cm : un point à 3,5 cm de \\(O\\) est dans le disque, un point à 4 cm est sur le cercle.", "Sur une droite graduée, les points à 3 unités de 8 sont 5 et 11."],
"Un point situé exactement à la distance \\(r\\) du centre est sur le cercle, donc aussi dans le disque."],
act: { retiens: { regle: "Cercle de centre \\(O\\), rayon \\(r\\) : tous les points à \\(r\\) de \\(O\\). Disque : tous les points à \\(r\\) ou moins de \\(O\\).", exemple: ["Sur une droite graduée, les points à 3 unités de 8 sont 5 et 11.", "Diamètre d'un cercle de rayon 4,5 cm : 9 cm."], piege: "Il y a deux points à une distance donnée de \\(O\\) sur une droite : un de chaque côté." },
predict: { q: "Sur une droite graduée, combien de points sont à 4 unités du point d'abscisse 6 ?", choices: ["2", "1", "une infinité"], good: 0, why: "Un à gauche (2) et un à droite (10). Dans le plan, il y en aurait une infinité : tout un cercle." },
defis: ["Tape l'abscisse du point situé à 3 unités à gauche du point d'abscisse 8.", "Un cercle a un rayon de 4,5 cm. Tape la longueur de son diamètre (en cm)."],
play: toi(["À gauche de 8, on retire 3", "Diamètre = 2 × rayon"], [W(5, "8 − 3 = 5 (et à droite : 8 + 3 = 11)."), W(9, "2 × 4,5 = 9 cm.")]) } },
{ id: "bissec6", theme: "es", label: "Bissectrice d'un angle", ex: "\\widehat{xOz} = \\widehat{zOy} = \\frac{\\widehat{xOy}}{2}", FR: [6], againFR: [7], g: BI, probs: PROBS.bissec6,
hint: "La bissectrice d'un angle est la demi-droite qui le partage en deux angles de même mesure : chacun vaut la moitié de l'angle. Dans un triangle, la somme des angles vaut 180° ; un angle plat vaut 180°.",
comps: ["Moitié, double, écart à la bissectrice", "Angle plat, triangle, triangle isocèle", "Deux bissectrices, trois demi-droites, bissectrice d'une bissectrice"],
lesson: ["Bissectrice d'un angle", "La bissectrice coupe un angle en deux angles égaux.",
"La bissectrice de l'angle \\(\\widehat{xOy}\\) est la demi-droite \\([Oz)\\), d'origine \\(O\\), telle que \\(\\widehat{xOz} = \\widehat{zOy}\\). Chacun de ces deux angles mesure la moitié de \\(\\widehat{xOy}\\). On la reconnaît sur une figure codée (deux angles marqués du même signe) ou en mesurant au rapporteur. C'est aussi l'axe de symétrie de l'angle.",
["\\(\\widehat{xOy} = 74°\\) : \\(\\widehat{xOz} = 37°\\).", "\\(\\widehat{zOy} = 28°\\) et \\([Oz)\\) bissectrice : \\(\\widehat{xOy} = 56°\\)."],
"La bissectrice partage l'angle, pas le segment opposé dans un triangle : elle ne passe pas forcément par le milieu du côté."],
act: { retiens: { regle: "\\([Oz)\\) est la bissectrice de \\(\\widehat{xOy}\\) si \\(\\widehat{xOz} = \\widehat{zOy}\\) : chacun vaut la moitié de \\(\\widehat{xOy}\\).", exemple: ["\\(\\widehat{xOy} = 74°\\) : \\(\\widehat{xOz} = 37°\\).", "Bissectrices de deux angles adjacents de 60° et 40° : elles font \\(30 + 20 = 50°\\)."], piege: "La moitié de l'angle, pas la moitié de 180°." },
predict: { q: "La bissectrice d'un angle de 70° forme avec chaque côté un angle de…", choices: ["35°", "70°", "90°"], good: 0, why: "Elle partage l'angle en deux angles égaux : 70 ÷ 2 = 35°." },
defis: ["L'angle xOy mesure 74°. Tape la mesure de l'angle entre [Ox) et la bissectrice.", "Deux angles adjacents de 60° et 40° : tape l'angle entre leurs bissectrices."],
play: toi(["La moitié de 74°", "La moitié de 60° plus la moitié de 40°"], [W(37, "74 ÷ 2 = 37°."), W(50, "30° + 20° = 50°, la moitié de 100°.")]) } },
{ id: "filtre6", theme: "no", label: "Filtrer les données d'un tableau", ex: "\\text{prix} \\leqslant 20\\text{ € et durée} \\geqslant 2\\text{ h}", FR: [6], againFR: [7], g: FI, probs: PROBS.filtre6,
hint: "Lis le critère mot à mot : « moins de 20 » exclut 20, « au plus 20 » l'inclut. « Et » : les deux conditions à la fois ; « ou » : au moins une. Filtre une colonne après l'autre, en barrant les lignes qui ne conviennent pas.",
comps: ["Un critère, deux critères avec « et »", "Critère avec « ou », choix, total", "Trois critères, budget, écart"],
lesson: ["Filtrer un tableau", "Pour faire un choix, on garde seulement les lignes qui vérifient le critère.",
"On lit le critère colonne par colonne. « Moins de 20 € » : strictement inférieur à 20 ; « au plus 20 € » : 20 compris ; « au moins 2 h » : 2 h compris. Avec « et », une ligne doit vérifier toutes les conditions ; avec « ou », une seule suffit. On peut ensuite compter les lignes gardées, chercher la plus petite ou la plus grande valeur, ou additionner.",
["Prix 12, 25, 18, 30 € : trois sorties ne dépassent pas 25 € (« au plus 25 € »).", "Moins de 25 € : seulement deux (12 et 18)."],
"« Moins de » exclut la valeur limite ; « au plus » l'inclut."],
act: { retiens: { regle: "On garde les lignes qui vérifient le critère, puis on compte, on compare ou on additionne. « Et » : toutes les conditions ; « ou » : au moins une.", exemple: ["Prix 12, 25, 18, 30 € : « au plus 25 € » → 3 sorties.", "« Moins de 25 € » → 2 sorties."], piege: "« Moins de 25 » n'inclut pas 25." },
predict: { q: "Prix : 12 €, 25 €, 18 €, 30 €. Combien de sorties coûtent moins de 25 € ?", choices: ["2", "3", "1"], good: 0, why: "12 et 18 seulement : 25 n'est pas « moins de 25 »." },
defis: ["Prix : 12 €, 25 €, 18 €, 30 €. Tape le nombre de sorties qui coûtent au plus 25 €.", "Durées : 1 h, 3 h, 2 h, 4 h (dans le même ordre). Tape le prix de la moins chère des sorties d'au moins 3 h."],
play: toi(["« Au plus 25 » : 25 compris", "Au moins 3 h : la 2e (25 €) et la 4e (30 €)"], [W(3, "12, 25 et 18 : trois sorties."), W(25, "Parmi 25 € et 30 €, la moins chère coûte 25 €.")]) } },
{ id: "tabform5", theme: "fa", label: "Tableaux de valeurs et graphiques", ex: "\\text{prix} = 3 \\times n + 5", FR: [7], againFR: [8], g: TF, probs: PROBS.tabform5,
hint: "Pour compléter un tableau, on remplace la lettre par chaque valeur dans la formule, en respectant les priorités. Pour lire un graphique : on part de la valeur sur l'axe horizontal, on va jusqu'à la courbe, puis on lit sur l'axe vertical (ou l'inverse).",
comps: ["Calculer avec une formule, compléter et lire un tableau", "Priorités, retrouver un nombre, lire un graphique", "Comparer deux tarifs, lire des valeurs sur une courbe, variation"],
lesson: ["Tableaux de valeurs", "Une formule relie deux grandeurs : un tableau ou un graphique montre plusieurs valeurs d'un coup.",
"Quand une grandeur dépend d'une autre (le prix dépend du nombre de places), une formule permet de la calculer : on remplace la lettre par un nombre. Un tableau de valeurs rassemble plusieurs résultats ; on peut le lire dans les deux sens. Un graphique représente ces valeurs par des points : la grandeur de départ sur l'axe horizontal, la grandeur calculée sur l'axe vertical.",
["\\(\\text{prix} = 3 \\times n + 5\\) : pour \\(n = 4\\), \\(3 \\times 4 + 5 = 17\\).", "Pour \\(n = 10\\) : \\(35\\)."],
"Priorités : dans \\(3 \\times n + 5\\), on multiplie avant d'ajouter."],
act: { retiens: { regle: "On remplace la lettre par la valeur, puis on calcule en respectant les priorités.", exemple: ["\\(\\text{prix} = 3 \\times n + 5\\), \\(n = 4\\) : \\(17\\).", "Prix de 29 € : \\((29 - 5) \\div 3 = 8\\) places."], piege: "\\(3 \\times 4 + 5 = 17\\), pas \\(3 \\times 9\\)." },
predict: { q: "Avec prix = 4 × n + 3, combien coûtent 5 places ?", choices: ["23 €", "35 €", "20 €"], good: 0, why: "On multiplie d'abord : 4 × 5 = 20, puis on ajoute 3 : 23 €." },
defis: ["prix = 3 × n + 5. Tape le prix pour n = 4.", "Pour quel nombre de places le prix vaut-il 29 € ?"],
play: toi(["3 × 4, puis + 5", "29 − 5 = 24, puis ÷ 3"], [W(17, "3 × 4 + 5 = 17 €."), W(8, "(29 − 5) ÷ 3 = 8 places.")]) } },
{ id: "hauteurs5", theme: "es", label: "Hauteurs d'un triangle", ex: "\\mathcal{A} = \\frac{\\text{base} \\times \\text{hauteur}}{2}", FR: [7], againFR: [8], g: HA, probs: PROBS.hauteurs5,
hint: "Une hauteur part d'un sommet et coupe perpendiculairement le côté opposé (ou son prolongement). Aire = base × hauteur ÷ 2, avec n'importe quel côté comme base et la hauteur qui lui correspond. Les trois hauteurs se coupent en un même point, l'orthocentre.",
comps: ["Aire avec une hauteur, retrouver une hauteur, triangle rectangle", "Deux hauteurs, angle avec une hauteur, triangle obtus", "Hauteur relative à l'hypoténuse, orthocentre, triangle isocèle"],
lesson: ["Hauteurs d'un triangle", "Une hauteur tombe perpendiculairement d'un sommet sur le côté opposé.",
"La hauteur issue de \\(A\\) est la droite qui passe par \\(A\\) et qui est perpendiculaire à \\((BC)\\) ; on appelle aussi hauteur la longueur \\(AH\\), où \\(H\\) est son pied. L'aire du triangle vaut \\(\\text{base} \\times \\text{hauteur} \\div 2\\) pour chacun des trois côtés : la même aire, donc une hauteur plus courte pour un côté plus long. Dans un triangle rectangle, les deux côtés de l'angle droit sont des hauteurs. Dans un triangle obtus, deux hauteurs tombent à l'extérieur. Les trois hauteurs sont concourantes en l'orthocentre.",
["\\(BC = 8\\) cm, \\(AH = 5\\) cm : aire \\(8 \\times 5 \\div 2 = 20\\) cm².", "Aire 20 cm², \\(AB = 10\\) cm : hauteur issue de \\(C\\) : \\(2 \\times 20 \\div 10 = 4\\) cm."],
"Chaque hauteur va avec son côté : on ne multiplie pas \\(AB\\) par la hauteur issue de \\(A\\)."],
act: { retiens: { regle: "Aire = base × hauteur ÷ 2, pour n'importe quel côté et la hauteur qui lui correspond ; donc hauteur = 2 × aire ÷ base.", exemple: ["\\(BC = 8\\), \\(AH = 5\\) : aire 20.", "Même triangle, \\(AB = 10\\) : hauteur issue de \\(C\\) = \\(2 \\times 20 \\div 10 = 4\\)."], piege: "Une hauteur est perpendiculaire au côté : ce n'est pas un côté du triangle (sauf dans un triangle rectangle)." },
predict: { q: "Un triangle a pour base 6 cm et pour hauteur 7 cm. Son aire est…", choices: ["21 cm²", "42 cm²", "13 cm²"], good: 0, why: "6 × 7 = 42 serait l'aire du rectangle ; le triangle en est la moitié : 21 cm²." },
defis: ["BC = 8 cm et la hauteur issue de A mesure 5 cm. Tape l'aire (en cm²).", "Dans ce même triangle, AB = 10 cm. Tape la hauteur issue de C (en cm)."],
play: toi(["8 × 5 ÷ 2", "2 × aire ÷ 10"], [W(20, "8 × 5 ÷ 2 = 20 cm²."), W(4, "2 × 20 ÷ 10 = 4 cm : la même aire avec une autre base.")]) } },
];
reg(DEFS);

for (const d of DEFS) if (d.act) actReg({ [d.id]: d.act });
})();
















const HORS_FR = {
derivref: [["exposant-*", 99] , ["trigo-*", 12] ],
tangente: [["newton", 12]],
asymptotes: [["oblique", 99] ],
etudefct: [["rationnelle-oblique-*", 99]],
combi: [["groupe-jass", 99] ],
primitives: [["puissance-rac", 99], ["puissance-xrac", 99] ],
intparties: [["exp-cos", 99] ],
eqdiff: [["separable-*", 99] ],

progcalc: [["negatif", 8], ["prouver-carre", 8], ["produit", 8]],


fracconv: [["per1", 8], ["per2", 8], ["permixte", 8]],


quartiles: [[/quartile|Q_1|Q_3|moustache/i, 10]],


eq2fact: [["ramener-zero", 11], ["trinome", 11], ["erreur", 11], ["facteur-num", 11]],
fimg: [["zeros-calcul", 11], ["preimage-tri", 11], ["axes-triangle", 11]],

racinv: [["sqrt-lin", 99], ["sqrt-param", 99], ["inv-aff", 11]],

droites: [["systeme", 11]],

cart: [["angle-droit", 11]],

stats: [["notes6", 99]],

pct: [["succ-*", 9]],

f2formes: [["canon-couple", 99], ["dev-k-a", 99]],




factor: [["lettre", 8], ["parenthese", 9], ["diffcarres", 9], ["diffcarres2", 9], ["maximal", 9], ["cube", 9], ["carre", 10],
["trinome", 11], ["trinome-complete", 11], ["erreur", 11], [(q) => q.d === 4, 9]],


idrem: [["racines", 10] ],
distrib: [["negatif", 8], ["lettre", 8], ["double", 8], ["double2", 8], ["trinome", 8], ["difference", 9], ["deuxdev", 9], ["degre3", 10]],
};



const HINTS_FR_COL = {
quartiles: "Trie la série. Étendue = plus grande valeur − plus petite. Médiane : la valeur du milieu (effectif pair : la moyenne des deux valeurs du milieu).",
};






if (typeof VARX !== "undefined") (function () {
const nb = (v) => String(+(+v).toFixed(6)).replace(".", "{,}");
const lst = (a) => M(a.map(nb).join(" \\,;\\, "));
const srt = (a) => a.slice().sort((x, y) => x - y);
const med = (s) => (s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2);
const mix = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(R.rand() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const fr = (q, shown) => (q ? Object.assign(q, { fr: [8, 9] }, shown ? { shownOk: true } : {}) : q);
const pick = (fs) => () => { for (let k = 0; k < 40; k++) { const q = fs[Math.floor(R.rand() * fs.length)](); if (q) return q; } return fs[0](); };
const L = {
1: [
() => { const s = srt(Array.from({ length: 7 }, () => R.int(4, 20))), m = s[3];
return fr(QV("Notes (sur 20) de 7 élèves, rangées dans l'ordre croissant : " + lst(s) + ". Quelle est la médiane de cette série ?", m, "7 valeurs : la médiane est la 4e, " + M(nb(m)) + " (3 valeurs avant, 3 après).",
{ ctx: "mediane-triee", guide: [GS("Combien de valeurs ?", 7, "7."), GS("Rang de la valeur du milieu ?", 4, "4e (3 avant, 3 après)."), GS("Médiane ?", m, M(nb(m)) + ".")], traps: [TRAP(s[6] - s[0], "C'est l'étendue ; la médiane est la valeur du milieu."), TRAP(+(s.reduce((a, b) => a + b, 0) / 7).toFixed(6), "C'est la moyenne ; la médiane est la valeur du milieu.")] }), true); },
() => { const s = srt(Array.from({ length: 5 }, () => R.int(5, 40))), sh = mix(s), m = s[2]; if (sh[2] === m) return null;
return fr(QV("Quelle est la médiane de la série " + lst(sh) + " ?", m, "On range d'abord : " + lst(s) + ". 5 valeurs : la médiane est la 3e, " + M(nb(m)) + ".",
{ ctx: "mediane-5", guide: [GS("On range la série dans l'ordre croissant. Quelle est la 1re valeur ?", s[0], lst(s) + "."), GS("Médiane (3e valeur de la série rangée) ?", m, M(nb(m)) + ".")], traps: [TRAP(sh[2], "C'est la valeur du milieu de la série non rangée : range-la d'abord.")] }), true); },
],
2: [
() => { const n = 2 * R.int(10, 15), t = R.int(150, 165);
return fr(QV("Dans une classe de " + M(n) + " élèves, la médiane des tailles est " + M(t + "\\text{ cm}") + ". Au moins combien d'élèves mesurent " + M(t + "\\text{ cm}") + " ou plus ?", n / 2, "La médiane partage l'effectif en deux : au moins la moitié des élèves, " + M(n + " \\div 2 = " + n / 2) + ", mesure " + t + " cm ou plus.",
{ ctx: "mediane-sens", guide: [GS("Quelle part de l'effectif est au-dessus de la médiane (en %) ?", 50, "Au moins la moitié : 50 %."), GS("Nombre d'élèves ?", n / 2, M(n / 2) + ".")], traps: [TRAP(t, "On demande un nombre d'élèves."), TRAP(n, "Pas tous : la moitié au moins.")] })); },
() => { const s = srt(Array.from({ length: 6 }, () => R.int(2, 30))), sh = mix(s), m = med(s); if (s[2] === s[3]) return null;
return fr(QV("Quelle est la médiane de la série " + lst(sh) + " ?", m, "Série rangée : " + lst(s) + ". 6 valeurs : la médiane est entre la 3e et la 4e, " + M("\\frac{" + s[2] + " + " + s[3] + "}{2} = " + nb(m)) + ".",
{ ctx: "mediane-paire", guide: [GS("Série rangée : 3e valeur ?", s[2], lst(s) + "."), GS("4e valeur ?", s[3], M(s[3]) + "."), GS("Médiane (moyenne de ces deux valeurs) ?", m, M(nb(m)) + ".")], traps: [TRAP(s[2], "Effectif pair : la médiane est la moyenne des deux valeurs du milieu."), TRAP(s[3], "Effectif pair : la médiane est la moyenne des deux valeurs du milieu."), TRAP(med(sh), "Range d'abord la série.")] })); },
() => { const s = srt(Array.from({ length: 9 }, () => R.int(8, 45))), sh = mix(s), m = s[4]; if (sh[4] === m) return null;
return fr(QV("Temps (en minutes) mis par 9 élèves pour venir au collège : " + lst(sh) + ". Quelle est la médiane de ces temps ?", m, "Série rangée : " + lst(s) + ". 9 valeurs : la médiane est la 5e, " + M(nb(m)) + " min : la moitié des élèves met au plus " + nb(m) + " min.",
{ ctx: "mediane-trajet", guide: [GS("Rang de la médiane pour 9 valeurs ?", 5, "5e (4 avant, 4 après)."), GS("Médiane (série rangée) ?", m, M(nb(m)) + " min.")], traps: [TRAP(sh[4], "Range d'abord la série."), TRAP(s[8] - s[0], "C'est l'étendue.")] }), true); },
],
3: [
() => { const v = [8, 10, 12, 14, 16], e = v.map(() => R.int(1, 6)), N = e.reduce((a, b) => a + b, 0), s = v.flatMap((x, k) => Array(e[k]).fill(x)), m = med(s);
return fr(QV("Notes d'un contrôle : " + v.map((x, k) => "note " + M(x) + " : " + M(e[k]) + " élève" + (e[k] > 1 ? "s" : "")).join(" ; ") + ". Quelle est la note médiane ?", m,
"Effectif total " + M(N) + ". " + (N % 2 ? "La médiane est la " + (N + 1) / 2 + "e note" : "La médiane est la moyenne des " + N / 2 + "e et " + (N / 2 + 1) + "e notes") + " dans l'ordre croissant (effectifs cumulés : " + e.map((x, k) => e.slice(0, k + 1).reduce((a, b) => a + b, 0)).join(" ; ") + ") : " + M(nb(m)) + ".",
{ ctx: "mediane-effectifs", guide: [GS("Effectif total ?", N, M(N) + "."), GS("Médiane ?", m, M(nb(m)) + ".")], traps: [TRAP(12, "La note du milieu du tableau n'est pas forcément la médiane : compte les élèves."), TRAP(+(s.reduce((a, b) => a + b, 0) / N).toFixed(6), "C'est la moyenne.")] })); },
() => { const s = srt(Array.from({ length: 5 }, () => R.int(3, 30))), m0 = s[2], x = s[4] + R.int(3, 15), s2 = srt([...s, x]), m = med(s2); if (m === m0 || new Set(s).size < 5) return null;
return fr(QV("La série " + lst(s) + " a pour médiane " + M(m0) + ". On ajoute la valeur " + M(x) + ". Quelle est la nouvelle médiane ?", m, "Nouvelle série rangée : " + lst(s2) + ". 6 valeurs : médiane " + M("\\frac{" + s2[2] + " + " + s2[3] + "}{2} = " + nb(m)) + ".",
{ ctx: "mediane-ajout", guide: [GS("Combien de valeurs maintenant ?", 6, "6."), GS("Nouvelle médiane (moyenne des 3e et 4e valeurs) ?", m, M(nb(m)) + ".")], traps: [TRAP(m0, "La médiane change : il y a maintenant 6 valeurs."), TRAP(x, "La nouvelle valeur est la plus grande, pas la médiane.")] })); },
() => { const s = srt(Array.from({ length: 8 }, () => R.int(-6, 9))), sh = mix(s), m = med(s), e = s[7] - s[0]; if (s[3] === s[4] || s[0] >= 0) return null;
return fr(QV("Températures (en °C) relevées à 8 h pendant 8 jours : " + lst(sh) + ". Quelle est la température médiane ?", m, "Série rangée : " + lst(s) + ". 8 valeurs : " + M("\\frac{" + s[3] + (s[4] < 0 ? " + (" + s[4] + ")" : " + " + s[4]) + "}{2} = " + nb(m)) + " °C (étendue : " + M(s[7] + " - (" + s[0] + ") = " + e) + " °C).",
{ ctx: "mediane-temp", guide: [GS("Série rangée : 4e valeur ?", s[3], lst(s) + "."), GS("5e valeur ?", s[4], M(s[4]) + "."), GS("Médiane ?", m, M(nb(m)) + " °C.")], traps: [TRAP(e, "C'est l'étendue."), TRAP(med(sh), "Range d'abord la série (attention aux négatifs).")] })); },
],
};
const X = (VARX.quartiles = VARX.quartiles || {});
for (const lv of [1, 2, 3]) (X[lv] = X[lv] || []).push(pick(L[lv]));
})();




const UPFR = {

8: { progcalc: 2, fracadd: 2, prop: 2, valnum: 2, ordgr: 2, dec10: 2, pow9: 3, tradexpr: 2, relrep: 2, reladd: 3, fracrep: 2, fracsimp: 2, fracconv: 2, fractout: 2,
aire1: 2, litelab: 2, quadri: 2, pct: 2, reduire: 2, distrib: 2, eqverif: 2, statfreq: 2, structexpr: 2, automat: 2, vol: 2 },

9: { fracadd: 2, diagr: 2, prop: 2, valnum: 2, pow9: 3, divcrit: 2, relrep: 2, fracsimp: 2, solides: 2, agrand: 2, litelab: 2, pct: 2, puiss: 2, sci: 2,
reduire: 2, distrib: 2, repere: 2, parenth: 2, statfreq: 2, structexpr: 2, automat: 2, milieux: 2 },

10: { fracadd: 2, diagr: 2, valnum: 2, decarr: 2, ordgr: 2, multdiv: 2, premiers: 2, relrep: 3, fracsimp: 2, fracconv: 2, fractout: 2, uvol: 2, fracmul: 2,
pct: 2, puiss: 2, rac: 3, distrib: 2, eq1: 2, affine: 2, racenc: 2, pctvar: 2, proba: 2, idrem: 2, parenth: 2, fimg: 2, statfreq: 2, quartiles: 2, proba2: 2 },

11: { pct: 2, puiss: 2, distrib: 2, pctvar: 2, idrem: 2, factor: 2, eq2fact: 2, fimg: 2, affzero: 2, stats: 2, quartiles: 2, ineq1: 2 },
};

(function () {
const N = (id) => NOTIONS.find((x) => x.id === id);
{ const q = N("quartiles"); if (q) q.labelFR = [10, "Étendue, médiane"]; }
{ const q = N("droitesinter"); if (q) q.labelFR = [11, "Intersection de droites"]; }


for (const [id, lab] of [["lectgraph", "Lire un graphique : images, antécédents, variations"], ["f2", "Parabole : racines et sommet"],
["trinfact", "Factoriser un trinôme à l'aide de ses racines"], ["affzero", "Signe d'une fonction affine"], ["fimg", "Images et antécédents"]]) { const q = N(id); if (q && !q.labelFR) q.labelFR = [13, lab]; }
const place = (id, fr, again) => { const n = N(id); if (!n) return; n.FR = fr; if (again) n.againFR = [...new Set([...(n.againFR || []), ...again])]; };


const RATT = {

tauxvar: [11, 3], nbderive: [11, 3], derivref: [11, 3], derivregles: [11, 3], derivprodquot: [11, 3], tangente: [11, 3], variations: [11, 4], optimderiv: [11, 4],

probarbre: [11, 6], condbayes: [11, 6], varalea: [11, 7],

derivcomp: [12, 1], derivseconde: [12, 2], limites: [12, 1], limitinf: [12, 1], asymptotes: [12, 1], continuite: [12, 2], etudefct: [12, 2],
lnexp: [12, 3], etudelnexp: [12, 3], croissance: [12, 3], primitives: [12, 5], eqdiff: [12, 5], integrale: [12, 6], aireint: [12, 6], intparties: [12, 6],
combi: [12, 0], binomiale: [12, 7], vect3d: [12, 4], colin: [12, 4], droite3d: [12, 4], plans: [12, 4], posrel: [12, 4], pscal3d: [12, 4], distances: [12, 4],

probaxiomes: [10, 14],


f2: [11, 0],

optim: [11, 0], inter: [11, 1],
};
for (const [id, fr] of Object.entries(RATT)) place(id, fr);


place("ineq1", [9, 9], [10, 11]);
place("proba2", [9, 8], [10]);






for (const id of ["sinlaw", "recip", "expo", "modexp", "trigcercle", "trigassoc", "trigfn", "trigeq", "log", "vecteurs"]) { const n = N(id); if (n) { n.FR = null; delete n.againFR; } }



const AU1 = ["fracops", "puiss", "pct", "pctvar", "tauxevol", "eq2", "eq2fact", "ineq1", "affzero", "distrib", "factor", "idrem", "lectgraph", "fimg", "droites", "stats", "quartiles", "probcond", "tabvar", "droiteeq"];
for (const id of AU1) { const n = N(id); if (n && n.FR && n.FR[0] < 11) n.againFR = [...new Set([...(n.againFR || []), 11])]; }


const CHAP = {
"1SU": ["suitedef", "suitearith", "suitegeo", "suitesomme"],
"1SD": ["eq2disc", "f2", "f2formes", "trinfact", "ineq2", "inter", "optim"],
"1DE": ["tauxvar", "nbderive", "tangente", "derivref", "derivregles", "derivprodquot", "variations", "posrelc", "optimderiv"],
"1EX": ["expfn", "expderiv"],
"1TR": ["trigrad"],
"1PS": ["pscal", "droitenorm", "cercle"],
"1PR": ["probtot", "probarbre", "condbayes", "vaesp", "varalea"],
"TSU": ["suitelim", "recurrence"],
"TLI": ["limites", "limitinf", "asymptotes", "continuite", "tvi"],
"TDE": ["derivcomp", "derivseconde", "etudefct"],
"TLN": ["lnexp", "lnfr", "etudelnexp", "croissance"],
"TTR": ["trigfr"],
"TPR": ["primitives", "eqdiff"],
"TIN": ["integrale", "aireint", "intmaj", "intparties", "suiteint"],
"TDN": ["denombr", "combi", "binom", "binomiale", "sommeva"],
"TES": ["vect3d", "colin", "droite3d", "plans", "posrel", "pscal3d", "distances"],
"TAU": ["compo", "eq3"],
};
ORDRE.FR = ORDRE.FR || {}; ORDRE_THEME.FR = ORDRE_THEME.FR || {}; THEME_LABEL.FR = THEME_LABEL.FR || {};

if (typeof FR_PROGRESSION !== "undefined") {
const ins = (g, id, ref) => { const L = FR_PROGRESSION[g]; if (!N(id) || L.includes(id)) return; const i = L.indexOf(ref); L.splice(i < 0 ? L.length : i + 1, 0, id); };
ins(8, "cos4e", "pythfig"); ins(8, "thales4e", "milieux"); ins(9, "autodnb", "pctvar"); ins(9, "linfn", "affine"); ins(9, "proba2", "volcomp");
ins(9, "ineq1", "simil"); ins(9, "vecgeo", "ineq1");
ORDRE.FR_COL = {}; [6, 7, 8, 9].flatMap((g) => FR_PROGRESSION[g]).forEach((id, i) => { ORDRE.FR_COL[id] = i; });
}
for (const [id, ref, ch] of [["tabvar", "fref", "2AN"], ["linfn", "affine", "2AU"], ["vecgeo", "vect3e", "2GE"], ["compdiff", "fracsimp", "2NC"], ["probaxiomes", "probcond", "2SP"], ["eq2", "eq2fact", "2AU"] ]) if (N(id) && ORDRE.FR[ref] !== undefined) { ORDRE.FR[id] = ORDRE.FR[ref] + (id === "vecgeo" ? -0.5 : 0.5); ORDRE_THEME.FR[id] = ch; }
let rk = 1000;
for (const [ch, ids] of Object.entries(CHAP)) for (const id of ids) { if (!N(id)) continue; ORDRE.FR[id] = rk++; ORDRE_THEME.FR[id] = ch; }
Object.assign(THEME_LABEL.FR, { "1SU": "Suites numériques", "1SD": "Second degré", "1DE": "Dérivation", "1EX": "Fonction exponentielle", "1TR": "Trigonométrie",
"1PS": "Produit scalaire, géométrie repérée", "1PR": "Probabilités conditionnelles, variables aléatoires",
"TSU": "Suites, récurrence", "TLI": "Limites, continuité", "TDE": "Dérivation, convexité", "TLN": "Logarithme népérien", "TTR": "Fonctions sinus et cosinus",
"TPR": "Primitives, équations différentielles", "TIN": "Calcul intégral", "TDN": "Dénombrement, loi binomiale, sommes de variables aléatoires",
"TES": "Géométrie dans l'espace", "TAU": "Compléments" });
})();

