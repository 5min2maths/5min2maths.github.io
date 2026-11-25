// 25.11 · Couverture du programme français (tools/france_couverture.md, branche agent/frcouv). Chargé en dernier du paquet
// « fr » (après fr_college.js et les notions françaises créées le 25.11 : fr_1re.js, fr_3e.js, fr_tle.js).
//  1. rattache aux classes françaises les notions suisses récentes dont l'attendu est le même (dérivation de la 3e du
//     Collège → 1re ; limites, continuité, convexité, ln, primitives, intégrales, équations différentielles, espace,
//     dénombrement → Tle), après contrôle des formes : les formes hors programme d'une classe française sont écartées du
//     tirage par HORS_FR (src/engine.js, horsCO), sans toucher aux profils suisses ;
//  2. retire de la 1re (et de la Tle) les notions hors programme ou écrites à la suisse (loi des sinus, réciproque, a^x,
//     degrés, log₂, « composantes ») — remplacées par des notions françaises (trigrad, trigfr, lnfr…) ;
//  3. reprend en 1re les automatismes de l'épreuve anticipée (againFR 11) et relève le niveau 1 des notions reprises
//     d'une année inférieure (UPFR) : « le niveau 1 = automatismes de l'année » (règle du 24.11, étendue à la France) ;
//  4. donne l'ordre et les chapitres de 1re et de Tle (ORDRE.FR, ORDRE_THEME.FR, THEME_LABEL.FR).
// Rien ne change pour un profil suisse : seuls les champs FR / againFR et des tables lues pour un profil FR sont touchés.

/* Formes d'une notion partagée hors programme d'une classe française : [ctx (« préfixe* » permis) | RegExp | fonction,
   première classe FR où la forme est permise (99 = jamais en France)]. Lu par horsCO (src/engine.js). */
const HORS_FR = {
  derivref: [["exposant-*", 99] /* x^(3/2), racine cubique : exposants rationnels, hors programme FR */, ["trigo-*", 12] /* dérivées de sin, cos : Tle */],
  tangente: [["newton", 12]],
  asymptotes: [["oblique", 99] /* programme FR : asymptotes parallèles aux axes seulement */],
  etudefct: [["rationnelle-oblique-*", 99]],
  combi: [["groupe-jass", 99] /* jeu de cartes suisse */],
  primitives: [["puissance-rac", 99], ["puissance-xrac", 99] /* x^(3/2) */],
  intparties: [["exp-cos", 99] /* double intégration par parties avec cosinus : hors programme */],
  eqdiff: [["separable-*", 99] /* variables séparables : hors programme (y' = ay + b seulement) */],
};

/* Niveau minimal d'une notion reprise d'une année inférieure, pour un profil FR de la classe indiquée (Engine.make).
   Calibré sur la sonde tests/_niv_fr.html (25.11) et les attendus du DNB (partie 1 : automatismes de 3e) et de
   l'épreuve anticipée de 1re (QCM d'automatismes). Le code de la question suit le niveau tiré (…-2-…). */
const UPFR = {
  /* 4e : reprises de 6e–5e dont le niveau 1 est un automatisme de 6e (« 3² », « 5 − 7 », « 50 % de 260 », « 4(2x + 2) ») */
  8: { fracadd: 2, prop: 2, valnum: 2, ordgr: 2, dec10: 2, pow9: 3, tradexpr: 2, relrep: 2, reladd: 3, fracrep: 2, fracsimp: 2, fracconv: 2, fractout: 2,
    aire1: 2, litelab: 2, quadri: 2, pct: 2, reduire: 2, distrib: 2, eqverif: 2, statfreq: 2, structexpr: 2, automat: 2, vol: 2 },
  /* 3e : DNB partie 1 (automatismes) — fractions et puissances combinées, pourcentages d'évolution, a² − b² */
  9: { fracadd: 2, diagr: 2, prop: 2, valnum: 2, pow9: 3, divcrit: 2, relrep: 2, fracsimp: 2, solides: 2, agrand: 2, litelab: 2, pct: 2, puiss: 2, sci: 2,
    reduire: 2, distrib: 2, repere: 2, parenth: 2, statfreq: 2, structexpr: 2, automat: 2, milieux: 2 },
  /* 2nde : automatismes AU.01–18 ; les reprises du collège partent du niveau 2 (tools/france.md § 3) */
  10: { fracadd: 2, diagr: 2, valnum: 2, decarr: 2, ordgr: 2, multdiv: 2, premiers: 2, relrep: 3, fracsimp: 2, fracconv: 2, fractout: 2, uvol: 2, fracmul: 2,
    pct: 2, puiss: 2, rac: 3, distrib: 2, eq1: 2, affine: 2, racenc: 2, pctvar: 2, proba: 2, idrem: 2, parenth: 2, fimg: 2, statfreq: 2, quartiles: 2, proba2: 2 },
  /* 1re : QCM d'automatismes de l'épreuve anticipée (développer (2x − 3)², taux réciproque, signe d'un produit…) */
  11: { pct: 2, puiss: 2, distrib: 2, pctvar: 2, idrem: 2, factor: 2, eq2fact: 2, fimg: 2, affzero: 2, stats: 2, quartiles: 2, ineq1: 2 },
};

(function () {
  const N = (id) => NOTIONS.find((x) => x.id === id);
  const place = (id, fr, again) => { const n = N(id); if (!n) return; n.FR = fr; if (again) n.againFR = [...new Set([...(n.againFR || []), ...again])]; };

  // ---------- 1. Rattachements (attendu contrôlé ; formes écartées : HORS_FR ci-dessus) ----------
  const RATT = {
    // 1re spécialité 2026 : dérivation (AN.01–10) — src/ch3c_ana.js
    tauxvar: [11, 3], nbderive: [11, 3], derivref: [11, 3], derivregles: [11, 3], derivprodquot: [11, 3], tangente: [11, 3], variations: [11, 4], optimderiv: [11, 4],
    // 1re : probabilités conditionnelles, variables aléatoires (SP.01–09) — src/ch3c_ana.js, src/ch4c_ana.js
    probarbre: [11, 6], condbayes: [11, 6], varalea: [11, 7],
    // Tle spécialité (2019) — src/ch3c_ana.js, src/ch4c_ana.js, src/ch3c_geo.js
    derivcomp: [12, 1], derivseconde: [12, 2], limites: [12, 1], limitinf: [12, 1], asymptotes: [12, 1], continuite: [12, 2], etudefct: [12, 2],
    lnexp: [12, 3], etudelnexp: [12, 3], croissance: [12, 3], primitives: [12, 5], eqdiff: [12, 5], integrale: [12, 6], aireint: [12, 6], intparties: [12, 6],
    combi: [12, 0], binomiale: [12, 7], vect3d: [12, 4], colin: [12, 4], droite3d: [12, 4], plans: [12, 4], posrel: [12, 4], pscal3d: [12, 4], distances: [12, 4],
    // 2nde : réunion, contraire (SP) — src/ch3c_ana.js
    probaxiomes: [10, 14],
  };
  for (const [id, fr] of Object.entries(RATT)) place(id, fr);
  // Créées en 2nde (fr_2nde.js) avec une place au collège, effacée ensuite par applyFrCollege (fr_college.js chargé après) :
  // inéquations (3e, programme 2026 : 3e.NC.28, en fin d'année) et probabilités à deux épreuves (3e-2019 DP.04).
  place("ineq1", [9, 9], [10, 11]);
  place("proba2", [9, 8], [10]);

  // ---------- 2. Retraits (hors programme français, ou écrits à la suisse et remplacés) ----------
  // sinlaw : loi des sinus hors programme (Al-Kashi : pscal) ; recip : f⁻¹ hors programme ; expo, modexp : a^x et racine n-ième
  // (la 1re ne connaît que e^x ; modèles discrets : suitegeo) ; trigcercle, trigassoc, trigfn, trigeq : en degrés (la France
  // travaille en radians dès la 1re : trigrad, trigfr) ; log : log₂ (la Tle ne connaît que ln : lnexp, lnfr) ; vecteurs :
  // « composantes » (vect3e en 2nde, pscal en 1re).
  for (const id of ["sinlaw", "recip", "expo", "modexp", "trigcercle", "trigassoc", "trigfn", "trigeq", "log", "vecteurs"]) { const n = N(id); if (n) { n.FR = null; delete n.againFR; } }

  // ---------- 3. Automatismes de 1re (épreuve anticipée, partie 1 : 1re.AU.01–17) ----------
  // Notions de collège et de 2nde reprises « de l'année » en 1re ; leur niveau 1 est relevé (UPFR[11]).
  const AU1 = ["fracops", "puiss", "pct", "pctvar", "tauxevol", "eq2", "eq2fact", "ineq1", "affzero", "distrib", "factor", "idrem", "lectgraph", "fimg", "droites", "stats", "quartiles", "probcond", "tabvar", "droiteeq"];
  for (const id of AU1) { const n = N(id); if (n && n.FR && n.FR[0] < 11) n.againFR = [...new Set([...(n.againFR || []), 11])]; }

  // ---------- 4. Ordre et chapitres de 1re et de Tle (référentiel « FR ») ----------
  const CHAP = {
    "1SU": ["suitedef", "suitearith", "suitegeo", "suitesomme"],
    "1SD": ["eq2disc", "f2formes", "trinfact", "ineq2"],
    "1DE": ["tauxvar", "nbderive", "tangente", "derivref", "derivregles", "derivprodquot", "variations", "optimderiv"],
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
    "TIN": ["integrale", "aireint", "intparties"],
    "TDN": ["denombr", "combi", "binom", "binomiale", "sommeva"],
    "TES": ["vect3d", "colin", "droite3d", "plans", "posrel", "pscal3d", "distances"],
    "TAU": ["compo", "eq3"],
  };
  let rk = 1000;
  for (const [ch, ids] of Object.entries(CHAP)) for (const id of ids) { if (!N(id)) continue; ORDRE.FR[id] = rk++; ORDRE_THEME.FR[id] = ch; }
  Object.assign(THEME_LABEL.FR, { "1SU": "Suites numériques", "1SD": "Second degré", "1DE": "Dérivation", "1EX": "Fonction exponentielle", "1TR": "Trigonométrie",
    "1PS": "Produit scalaire, géométrie repérée", "1PR": "Probabilités conditionnelles, variables aléatoires",
    "TSU": "Suites, récurrence", "TLI": "Limites, continuité", "TDE": "Dérivation, convexité", "TLN": "Logarithme népérien", "TTR": "Fonctions sinus et cosinus",
    "TPR": "Primitives, équations différentielles", "TIN": "Calcul intégral", "TDN": "Dénombrement, loi binomiale, sommes de variables aléatoires",
    "TES": "Géométrie dans l'espace", "TAU": "Compléments" });
})();
