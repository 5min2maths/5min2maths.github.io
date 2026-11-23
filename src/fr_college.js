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
          traps: [TR(t, "Deux nombres ont pour carré " + t * t + " : " + t + " et −" + t + "."), TR(Math.sqrt(Rv), "Calcule d'abord le résultat en fonction de x : x² − " + a * a + ".")] }; },
    ],
  };
  const PCPROB = [() => {
    const a = R.int(2, 6), b = R.int(2, 4), c = R.int(1, 9), e = b + R.int(1, 3), xs = R.int(2, 9), d = (b - e) * xs + a * b - c, stA = [S.add(a), S.mul(b), S.sub(c)], stB = [S.mul(e), d >= 0 ? S.add(d) : S.sub(-d)], x0 = 3;
    return Pb(prog(stA, "Programme A") + "<br>" + prog(stB, "Programme B"), [["a) Résultat de A avec 3", run(stA, x0)[2]], ["b) Résultat de B avec 3", run(stB, x0)[1]], ["c) Nombre de départ qui donne le même résultat avec A et B", xs]],
      ["Avec x : A donne " + b + "(x + " + a + ") − " + c + " = " + pol(runP(stA)) + ".", "B donne " + pol(runP(stB)) + " ; résous l'égalité des deux expressions."],
      "a) " + M("(3 + " + a + ") \\times " + b + " - " + c + " = " + run(stA, x0)[2]) + ". b) " + M("3 \\times " + e + (d >= 0 ? " + " + d : " - " + -d) + " = " + run(stB, x0)[1]) + ". c) " + M(pol(runP(stA)) + " = " + pol(runP(stB))) + " donne " + M("x = " + xs) + ".");
  }];

  const ALL = { progcalc: PC };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => pickForm(lv[Math.min(Math.max(d, 1), 3)]);
    if (typeof VAR !== "undefined") VAR[id] = {};
  }
  PROB_EXTRA.progcalc = PCPROB;
  Object.assign(HINTS_EXTRA, {
    progcalc: "Applique les étapes dans l'ordre, chacune au résultat de la précédente. Avec x : mets des parenthèses, puis développe. Pour remonter, défais les étapes de la dernière à la première.",
  });
  Object.assign(LESSONS_EXTRA, {
    progcalc: ["Programmes de calcul", "Un programme de calcul est une suite d'opérations faites l'une après l'autre sur un nombre choisi.",
      "Chaque étape s'applique au résultat de l'étape précédente. En partant de \\(x\\), on obtient une expression : on met des parenthèses, puis on développe et on réduit. Pour retrouver le nombre de départ, on remonte le programme avec les opérations inverses (de la dernière étape à la première), ou on résout une équation.",
      ["Ajouter 3, multiplier par 2, soustraire 5. Avec 4 : \\(4 + 3 = 7\\), \\(7 \\times 2 = 14\\), \\(14 - 5 = 9\\).", "Avec \\(x\\) : \\(2(x + 3) - 5 = 2x + 6 - 5 = 2x + 1\\). Pour obtenir 21 : \\(2x + 1 = 21\\), donc \\(x = 10\\)."],
      "« Ajouter 3 puis multiplier par 2 » donne \\(2(x + 3)\\), pas \\(x + 3 \\times 2\\) : on multiplie tout le résultat."],
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    progcalc: ["Appliquer un programme de calcul à un nombre", "Remonter un programme, l'écrire avec x", "Prouver un résultat avec le calcul littéral"],
  });
  // Notions françaises au catalogue (CH : null ; classe FR posée par applyFrCollege).
  for (const f of FR_NEW) if (GEN[f.id] && !NOTIONS.some((n) => n.id === f.id)) NOTIONS.push({ ...f, CH: null, MP: null, FR: null });
})();

// ======================= Fin : application des rattachements =======================
applyFrCollege();
