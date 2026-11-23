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

// ======================= Fin : application des rattachements =======================
applyFrCollege();
