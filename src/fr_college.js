// 22.11 · Collège français (6e, 5e, 4e, 3e) : rattachements, masquage des notions suisses, progression par classe,
// et notions propres aux programmes français (programmes de calcul, ratios, droite des milieux, structure d'une
// expression, motifs évolutifs, automatismes). Sources : tools/couverture_fr.md, tools/referentiels_fr.json.
// Codage des classes (comme SYSTEMS_HIDDEN.FR) : 6e = 6, 5e = 7, 4e = 8, 3e = 9 (2nde = 10, géré ailleurs).
// Texte en vigueur en 2026-2027 : 6e = cycle 3 2025 ; 5e = cycle 4 2026 ; 4e et 3e = programme 2020 + attendus 2019.
// Classe d'une notion = première de ces classes où un attendu la mobilise, corrigée à la main quand le contenu des
// questions ne convient pas (voir FR_OVERRIDE). againFR = classes suivantes qui la reprennent (attendus 2019 et 2026).
// Mécanisme de masquage : une notion dont le champ FR est null n'entre pas dans le catalogue d'un élève français
// (Engine.catalog filtre sur placeOf(n, profile) = n.FR).

// ---------- 1. Classe française des notions existantes : [classe, reprises] ----------
const FR_COLLEGE = {
    // 6e
    aire1: [6, [7, 8]], angtri: [6, [7]], angtype: [6, [7]], dec10: [6, [7, 8]], decadd: [6, [7]], decarr: [6], deccomp: [6],
    decdiv: [6, [7]], decmul: [6, [7]], decprob: [6, [7]], decread: [6], disque: [6, [7]], fracadd: [6, [7, 8, 9]], fracconv: [6, [7, 8]],
    fracrep: [6, [7, 8]], fracsimp: [6, [7, 8, 9]], fractout: [6, [7, 8]], multdiv: [6, [7]], ordgr: [6, [8]], pct: [6, [7, 8, 9]],
    perim: [6, [7]], prop: [6, [7, 8, 9]], proptab: [6, [7]], uaire: [6, [7]], ulong: [6, [7]], utemps: [6], volpave: [6, [7]],
    // 5e
    aire2: [7], aire3: [7], angles: [7], diagr: [7, [8, 9]], distrib: [7, [8, 9]], divcrit: [7, [9]], eq1: [7, [8, 9]], eqverif: [7, [8]],
    factor: [7, [8, 9]], litelab: [7, [8, 9]], parenth: [7, [9]], pow9: [7, [8, 9]], prio: [7], proba: [7, [8, 9]], probeq: [7, [8, 9]],
    quadri: [7, [8]], reduire: [7, [8, 9]], reladd: [7, [8]], relrep: [7, [8, 9]], repere: [7, [8, 9]], statfreq: [7, [8, 9]],
    symetries: [7, [8]], tradexpr: [7, [8]], uvol: [7], valnum: [7, [8, 9]], vitesse: [7], vol: [7, [8]],
    // 4e
    agrand: [8, [9]], carres: [8], cercthales: [8, [9]], echelle: [8, [9]], eqfrac: [8], fracmul: [8], fracops: [8, [9]],
    lectgraph: [8, [9]], monomes: [8], premiers: [8, [9]], puiss: [8, [9]], pyth: [8, [9]], pythfig: [8], pythrec: [8], quartiles: [8, [9]],
    racenc: [8], rel: [8], sci: [8, [9]], solides: [8, [9]], ucomp: [8, [9]], volcone: [8, [9]],
    // 3e
    affine: [9], eq2: [9], eq2fact: [9], fimg: [9], gquot: [9], idrem: [9], modaff: [9], pctvar: [9], rac: [9], rotation: [9], scicalc: [9],
    simil: [9], tabval: [9], thales: [9], thalesrec: [9], trigo: [9], volcomp: [9],
    // notions créées ci-dessous
    motifs: [6, [7]], automat: [6, [7, 8, 9]], structexpr: [7, [8, 9]], progcalc: [8, [9]], ratio: [8, [9]], milieux: [8, [9]],
};
// Corrections manuelles de la « première classe » (déjà appliquées dans le tableau ci-dessus), pour mémoire :
// symetries 6e → 5e (images par coordonnées, relatifs) ; proba 6e → 5e (deux dés, tirages) ; echelle 6e → 4e (aires × k²) ;
// ulong 5e → 6e (conversions du cycle 3) ; lectgraph 5e → 4e et tabval 5e → 3e (notation f(x) : fonctions en 3e) ;
// trigo 4e → 3e (le cosinus seul est en 4e-2019 ; les questions mélangent sin, cos, tan).

// ---------- 2. Notions suisses masquées au collège français (FR null ; liste pour mémoire et pour les tests) ----------
// Aucun attendu français, vocabulaire ou contexte suisse, ou contenu hors programme au collège.
const FR_MASK = ["change", "pente", "polyreg", "grandmanq", "airelat", "voldecomp", "airepyr", "volmanq", "fracper", "racprop",
  "probeq2", "sysprob", "sysgraph", "euclide", "denombr", "arith" /* PGDC/PPMC : vocabulaire suisse, PGCD en Tle expertes */,
  "vabs" /* |x| : 2nde */, "droitesrem" /* centre de gravité, bissectrices : hors collège */, "fracrat", "vecteurs" /* norme, produit scalaire */];

// ---------- 3. Progression annuelle par classe (ordre d'ouverture des notions de l'année) ----------
const FR_PROGRESSION = {
  6: ["automat", "decread", "deccomp", "decarr", "decadd", "angtype", "multdiv", "decmul", "dec10", "perim", "fracrep", "fracsimp", "ulong",
    "fractout", "disque", "decdiv", "motifs", "prop", "aire1", "fracconv", "fracadd", "uaire", "proptab", "utemps", "ordgr", "decprob",
    "pct", "volpave", "angtri"],
  7: ["prio", "relrep", "reladd", "structexpr", "tradexpr", "litelab", "valnum", "divcrit", "angles", "quadri", "repere", "symetries",
    "eqverif", "distrib", "reduire", "parenth", "factor", "aire2", "aire3", "uvol", "vol", "pow9", "eq1", "probeq", "statfreq", "diagr",
    "proba", "vitesse"],
  8: ["rel", "fracmul", "fracops", "puiss", "sci", "progcalc", "carres", "racenc", "pyth", "pythrec", "pythfig", "cercthales", "premiers",
    "monomes", "eqfrac", "milieux", "echelle", "agrand", "ratio", "solides", "volcone", "ucomp", "quartiles", "lectgraph"],
  9: ["idrem", "eq2", "eq2fact", "rac", "scicalc", "thales", "thalesrec", "trigo", "tabval", "fimg", "affine", "modaff", "pctvar",
    "gquot", "volcomp", "rotation", "simil"],
};
// 23.11 : table propre au collège (ORDRE.FR = 2nde, 1re, Tle) ; les mêmes notions ont un autre rang au lycée.
ORDRE.FR_COL = {};
[6, 7, 8, 9].flatMap((g) => FR_PROGRESSION[g]).forEach((id, i) => { ORDRE.FR_COL[id] = i; });

// Application (en fin de fichier, après la création des notions françaises) : seules les classes 6e–3e sont touchées ;
// une notion rattachée à la 2nde ou au-delà (FR ≥ 10) garde sa valeur (chantier lycée).
function applyFrCollege() {
  for (const n of NOTIONS) {
    const t = FR_COLLEGE[n.id];
    if (t) { n.FR = [t[0]]; n.againFR = t[1] || []; continue; }
    // Ancienne valeur collège non confirmée, ou notion de FR_MASK placée au collège : masquée. FR ≥ 10 : inchangé.
    if (n.FR && n.FR[0] <= 9) n.FR = null;
  }
}

// ======================= 4. Notions françaises (22.11) =======================
// Standard de l'app : 3 niveaux, au moins 3 formes par niveau, pas à pas (guide), erreurs typiques (traps), étiquette ctx,
// leçon [titre, idée, règle, exemples, piège], 3 compétences. Usages France appliqués ici seulement : milliers « 1 200 »
// (espace fine), × pour le produit, euros et villes françaises, « antécédent ». Notions sans CH (France seulement).
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
  // Nombre en TeX à la française : virgule décimale, espace fine pour les milliers (1 200).
  const N = (v) => { let [i, f] = String(r6(v)).split("."); const sg = i.startsWith("-") ? "-" : ""; i = i.replace("-", ""); if (i.length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\,"); return sg + i + (f ? "{,}" + f : ""); };
  const P = (v) => (v < 0 ? "(" + N(v) + ")" : N(v));
  const keep = (value, traps) => { const seen = new Set(); return (traps || []).filter((t) => t && isFinite(t.v) && Math.abs(t.v - value) > 1e-9 && !seen.has(r6(t.v)) && seen.add(r6(t.v))); };
  const Qv = (q, value, sol, o = {}) => { const x = { q, spec: { kind: "value", value: r6(value) }, sol, guide: o.guide, traps: keep(r6(value), o.traps), ctx: o.ctx }; if (o.fig) x.fig = o.fig; return x; };
  const G = (ask, value, sol) => GS(ask, r6(value), sol);
  const TR = (v, m) => TRAP(r6(v), m);
  const Qx = (q, e, sol, o = {}) => { const x = { q, spec: Object.assign({ kind: "expr", expr: e }, o.form ? { form: o.form } : {}), sol, guide: o.guide, ctx: o.ctx };
    let target = null; try { target = Expr.parse(e); } catch (er) {}
    x.traps = (o.traps || []).filter((tr) => { try { return !target || !Expr.equivalent(Expr.parse(tr.e), target); } catch (er) { return false; } });
    if (o.fig) x.fig = o.fig; return x; };
  const GX = (ask, e, sol, form) => ({ ask, spec: Object.assign({ kind: "expr", expr: e }, form ? { form } : {}), sol });
  const TX = (e, m) => ({ e, m });
  const GSet = (ask, vals, sol) => ({ ask, spec: { kind: "set", values: vals }, sol });
  const Pb = (q, parts, hints, sol, fig) => ({ fig, q, parts: parts.map(([label, value]) => ({ label, spec: { kind: "value", value: r6(value) } })), hints, sol });
  const who = () => pk(["Léa", "Hugo", "Chloé", "Nathan", "Manon", "Louis", "Camille", "Jules", "Inès", "Gabriel"]);
  const ville = () => pk(["Lyon", "Lille", "Nantes", "Toulouse", "Bordeaux", "Strasbourg", "Rennes", "Marseille", "Montpellier", "Dijon"]);
  // Polynôme en x (coefficients [c0, c1, c2]) : écriture réduite (TeX et saisie : « 3x^2 - 5x + 2 »).
  const pol = (c, v = "x") => poly([c[2] || 0, c[1] || 0, c[0] || 0].filter((t, i, a) => i === 2 || a.slice(0, i + 1).some((u) => u !== 0)), v);

  // ===================== progcalc : programmes de calcul =====================
  // Étape : texte, effet sur un nombre (v = résultat courant, x0 = nombre de départ), effet sur le polynôme.
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
    const a = R.int(2, 6), b = R.int(2, 4), c = R.int(1, 9), e = b + R.int(1, 3), xs = R.int(2, 9), d = (b - e) * xs + a * b - c, stA = [S.add(a), S.mul(b), S.sub(c)], stB = [S.mul(e), d >= 0 ? S.add(d) : S.sub(-d)], x0 = 3;
    return Pb(prog(stA, "Programme A") + "<br>" + prog(stB, "Programme B"), [["a) Résultat de A avec 3", run(stA, x0)[2]], ["b) Résultat de B avec 3", run(stB, x0)[1]], ["c) Nombre de départ qui donne le même résultat avec A et B", xs]],
      ["Avec x : A donne " + b + "(x + " + a + ") − " + c + " = " + pol(runP(stA)) + ".", "B donne " + pol(runP(stB)) + " ; résous l'égalité des deux expressions."],
      "a) " + M("(3 + " + a + ") \\times " + b + " - " + c + " = " + run(stA, x0)[2]) + ". b) " + M("3 \\times " + e + (d >= 0 ? " + " + d : " - " + -d) + " = " + run(stB, x0)[1]) + ". c) " + M(pol(runP(stA)) + " = " + pol(runP(stB))) + " donne " + M("x = " + xs) + ".");
  }];

  // ===================== ratio : ratios et partage proportionnel =====================
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
  const RATPROB = [() => { const t = pk([[2, 3, 5], [1, 2, 3], [3, 4, 5], [2, 3, 4]]), k = R.int(2, 6) * 1000, su = t[0] + t[1] + t[2], u = R.int(2, 9) * 50, B = su * u;
    return Pb("Trois associées d'une entreprise de " + ville() + " ont apporté " + M(N(t[0] * k)) + " €, " + M(N(t[1] * k)) + " € et " + M(N(t[2] * k)) + " €. Elles partagent un bénéfice de " + M(N(B)) + " € proportionnellement à leurs apports.",
      [["a) Part de la première (€)", t[0] * u], ["b) Part de la deuxième (€)", t[1] * u], ["c) Part de la troisième (€)", t[2] * u]],
      ["Simplifie le ratio des apports : " + t.join(" ∶ ") + ".", "Une part vaut " + N(B).replace("\\,", " ") + " ÷ " + su + "."],
      "Ratio " + RT(t[0], t[1], t[2]) + ", " + su + " parts de " + M(N(u)) + " € : " + M(N(t[0] * u)) + " €, " + M(N(t[1] * u)) + " € et " + M(N(t[2] * u)) + " €."); }];

  // ===================== milieux : droite des milieux =====================
  // Figure : triangle (sommets nommés), milieux marqués par des codages, longueurs données seulement.
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

  // ===================== structexpr : somme ou produit, termes, facteurs, opposé =====================
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

  // ===================== motifs : suites de motifs évolutifs =====================
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

  // ===================== automat : automatismes de calcul mental =====================
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
      () => { const d = pk([3, 6, 7, 9, 11]), n0 = R.int(2, d - 1); if (gcd(n0, d) !== 1) return null; const v = n0 / d; // dénominateurs non décimaux
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
  // Notions françaises au catalogue (CH : null ; classe FR posée par applyFrCollege).
  for (const f of FR_NEW) if (GEN[f.id] && !NOTIONS.some((n) => n.id === f.id)) NOTIONS.push({ ...f, CH: null, MP: null, FR: null });
})();

// ======================= Fin : application des rattachements =======================
applyFrCollege();
