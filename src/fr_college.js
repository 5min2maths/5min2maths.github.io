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
ORDRE.FR = {};
[6, 7, 8, 9].flatMap((g) => FR_PROGRESSION[g]).forEach((id, i) => { ORDRE.FR[id] = i; });

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

  const ALL = { progcalc: PC, ratio: RAT, milieux: MI };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => pickForm(lv[Math.min(Math.max(d, 1), 3)]);
    if (typeof VAR !== "undefined") VAR[id] = {};
  }
  PROB_EXTRA.progcalc = PCPROB;
  PROB_EXTRA.ratio = RATPROB;
  Object.assign(HINTS_EXTRA, {
    ratio: "Ratio a ∶ b : on partage en a + b parts égales. Une part = total ÷ (a + b) ; la première personne reçoit a parts, la seconde b parts.",
    milieux: "Le segment qui joint les milieux de deux côtés est parallèle au troisième côté et mesure sa moitié. Une parallèle à un côté passant par un milieu coupe le troisième côté en son milieu.",
    progcalc: "Applique les étapes dans l'ordre, chacune au résultat de la précédente. Avec x : mets des parenthèses, puis développe. Pour remonter, défais les étapes de la dernière à la première.",
  });
  Object.assign(LESSONS_EXTRA, {
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
    ratio: ["Partager selon un ratio", "Utiliser une part connue, partage proportionnel", "Écart, fraction du total, mélange limité"],
    milieux: ["Calculer avec le segment des milieux", "Utiliser la parallèle passant par un milieu", "Combiner : équation, aires, parallélogramme"],
    progcalc: ["Appliquer un programme de calcul à un nombre", "Remonter un programme, l'écrire avec x", "Prouver un résultat avec le calcul littéral"],
  });
  // Notions françaises au catalogue (CH : null ; classe FR posée par applyFrCollege).
  for (const f of FR_NEW) if (GEN[f.id] && !NOTIONS.some((n) => n.id === f.id)) NOTIONS.push({ ...f, CH: null, MP: null, FR: null });
})();

// ======================= Fin : application des rattachements =======================
applyFrCollege();
