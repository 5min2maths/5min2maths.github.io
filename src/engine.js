// Notions reprises au standard (formes variées, pas à pas, erreurs typiques) : réservoir du mode libre « au point » (18.11).
const FREE_READY = ["utemps", "ucomp", "vitesse", "gquot", "litelab", "valnum", "reduire", "monomes", "parenth", "distrib", "idrem", "factor",
  "eq1", "eqfrac", "eqspec", "formule", "probeq", "eq2fact", "eq2", "eq2disc", "probeq2", "eq3", "bicarre", "eqirr", "sys2", "sysprob", "sysgraph", "sys3", "affine", "affzero", "sysineq",
  "prio", "fracadd", "fracmul", "fracconv", "puiss", "sci", "scicalc", "pyth", "pythfig", "pythrec", "vol", "volcone", "airepyr", "volcomp", "volmanq", "angles", "cercthales", "thales", "thalesrec", "simil", "repere", "tabval"];
// Moteur adaptatif : profil, état de chaque notion, positionnement, choix des questions, mise à jour.
// Tout reste sur l'appareil (localStorage) ; aucune donnée ne part ailleurs.

const HINTS = {
  prio: "D'abord les parenthèses, puis les puissances, puis × et :, enfin + et −.",
  rel: "Moins par moins donne plus. Et attention : −3² = −9, alors que (−3)² = 9.",
  fracadd: "Mets les fractions au même dénominateur avant d'additionner les numérateurs.",
  fracmul: "Multiplie les numérateurs entre eux et les dénominateurs entre eux. Diviser, c'est multiplier par l'inverse.",
  pct: "p % de N, c'est p/100 × N. Une hausse de p % multiplie par (1 + p/100).",
  puiss: "aᵐ · aⁿ = aᵐ⁺ⁿ et (aᵐ)ⁿ = aᵐⁿ. Une puissance négative est un inverse.",
  sci: "Notation scientifique : a · 10ⁿ avec 1 ≤ a < 10. Compte de combien de rangs la virgule se déplace.",
  rac: "Cherche le plus grand carré qui divise le nombre : √72 = √(36 · 2) = 6√2.",
  valnum: "Remplace la lettre par le nombre entre parenthèses, puis respecte les priorités.",
  reduire: "Regroupe les termes de même nature : les x², les x, les nombres.",
  distrib: "Chaque terme de la première parenthèse multiplie chaque terme de la seconde.",
  idrem: "(a + b)² = a² + 2ab + b² : n'oublie pas le double produit 2ab.",
  factor: "Cherche d'abord un facteur commun, puis une identité remarquable.",
  eq1: "Fais la même opération des deux côtés pour isoler x.",
  eq2: "Un produit est nul si l'un de ses facteurs est nul : résous chaque facteur = 0.",
  prop: "Calcule d'abord pour 1 (passage à l'unité), puis multiplie.",
  vitesse: "v = d / t. Attention aux unités : 1 h = 60 min, et 1 m/s = 3,6 km/h.",
  echelle: "Longueurs × k, aires × k², volumes × k³.",
  aires: "Triangle : b·h/2 ; trapèze : (B + b)·h/2 ; disque : π·r².",
  pyth: "Hypoténuse² = somme des carrés des deux autres côtés.",
  vol: "Prisme : base × hauteur ; pyramide et cône : base × hauteur / 3.",
  thales: "Écris les trois rapports égaux AD/AB = AE/AC = DE/BC, puis utilise les deux utiles.",
  affine: "f(x) = ax + b : a est la pente, b l'ordonnée à l'origine.",
  eq3: "Mets x en évidence, puis factorise ce qui reste.",
  eq2disc: "Δ = b² − 4ac ; si Δ > 0, x = (−b ± √Δ) / 2a ; si Δ < 0, aucune solution.",
  sys2: "Additionne ou soustrais les équations pour éliminer une inconnue, ou isole-la et remplace.",
  fimg: "Image : remplace x par le nombre. Préimage : résous f(x) = valeur.",
  f2: "Sommet : x = −b / 2a, puis calcule f en ce point. Zéros : f(x) = 0.",
  inter: "Les graphes se coupent là où f(x) = g(x) : mets tout d'un côté et résous.",
  angles: "L'angle au centre vaut le double de l'angle inscrit qui intercepte le même arc.",
  euclide: "Hauteur : h² = p · q. Euclide : cathète² = projection · hypoténuse.",
  trigo: "SOH CAH TOA : sin = opposé/hypoténuse, cos = adjacent/hypoténuse, tan = opposé/adjacent.",
  cart: "Distance : √((xB − xA)² + (yB − yA)²). Milieu : moyenne des coordonnées. Pente : Δy / Δx.",
  recip: "(f ∘ g)(x) = f(g(x)) : calcule d'abord g. Réciproque : résous y = f(x) pour x.",
  sinlaw: "Sinus : a / sin α = b / sin β. Cosinus : c² = a² + b² − 2ab·cos γ.",
  expo: "Écris les deux membres comme puissances de la même base, puis égale les exposants.",
  log: "log_b(x) = y signifie b^y = x. Pour résoudre b^x = c : x = ln c / ln b.",
  absval: "|A| = b (b ≥ 0) donne A = b ou A = −b. Une valeur absolue n'est jamais négative.",
  ineq: "Comme une équation, mais on retourne le signe en multipliant ou divisant par un négatif.",
  trigcercle: "180° = π rad. Sur le cercle trigonométrique, le point a pour coordonnées (cos α ; sin α).",
  trigeq: "Sur [0° ; 360°[ : sin x = s donne x et 180° − x ; cos x = c donne x et 360° − x.",
  stats: "Moyenne : somme / effectif. Médiane : valeur du milieu de la série triée. Écart-type : √(moyenne des carrés des écarts).",
};
if (typeof HINTS_EXTRA !== "undefined") Object.assign(HINTS, HINTS_EXTRA);

/* 27.11 : version du format de l'état enregistré (state.v) ; 1 jusqu'au 27.11, 2 : champs de base contrôlés (Engine.upgrade). */
const STATE_V = 2;
const Store = {
  key: "5m2m.v1",
  load() { try { return JSON.parse(localStorage.getItem(this.key)) || null; } catch (e) { return null; } },
  save(s) { try { localStorage.setItem(this.key, JSON.stringify(s)); } catch (e) {} },
  clear() { try { localStorage.removeItem(this.key); } catch (e) {} },
};

const day = (d = new Date()) => d.toISOString().slice(0, 10);
const addDays = (s, n) => { const d = new Date(s + "T12:00:00"); d.setDate(d.getDate() + n); return day(d); };
const INTERVALS = [0, 1, 3, 7, 14, 30];
/* 25.11 : domaines des programmes français du collège (cycles 3 et 4), pour les profils FR. */
const FR_DOMAINS = { NC: "Nombres et calculs", OGD: "Organisation et gestion de données, fonctions", GM: "Grandeurs et mesures", EG: "Espace et géométrie", AP: "Algorithmique et programmation" };
function frDomain(id) {
  const n = NOTIONS.find((x) => x.id === id) || {}, L = n.label || "";
  if (/algorithm|programm/i.test(L)) return "AP";
  if (/diagramme|moyenne|médiane|statist|probab|proportion|pourcentage|fonction|graphique|tableau|échelle|vitesse|débit|grandeurs quotients/i.test(L)) return "OGD";
  return { no: "NC", fa: "NC", gm: "GM", es: "EG" }[n.theme] || "NC";
}
const TARGET = { drill: -300, app: -100, defi: 80, defi4: 80, rev: -150 }; // écart visé au Mathélo (≈ 85 %, 65 %, 40 % de réussite)
/* 26.11 (adaptivité, tools/archive/adaptivite_26-11.md ; simulation d'un testeur : élèves faibles à 39–45 % au premier essai).
   Cible de réussite propre à chaque élève : réussite au 1er essai sur ses 16 dernières réponses (8 au moins) ; sous 55 %,
   la cible baisse (tadj, en points de Mathélo) jusqu'à revenir vers 70 % ; au-dessus de 85 %, elle monte un peu. Sous
   le plancher (tadj ≤ -150 et réussite encore sous 65 %) : 2 rappels de notions anciennes par séance au plus (règle de
   remobilisation inchangée), niveau 1 permis s'il n'est pas trivial pour l'élève (au plus 350 points sous son Mathélo). */
const ADAPT = { win: 16, min: 8, low: 0.55, aim: 0.7, high: 0.85, down: 20, up: 10, lo: -300, hi: 120, floor: -150 };
/* 27.11 (n° 32) : malus de choix d'une notion de l'année précédente non demandée par le parcours, sans chapitre « en classe »
   (en centaines de points d'écart à la cible : 2 = 200 points). Réglé sur tests/_faibles.html (tools/archive/eleves_faibles_26-11.md). */
const PREV_PEN = 2;
const KIND_LABEL = { drill: "⚡ Automatisme", app: "🧩 Application", defi: "🏔 Défi", rev: "🧠 Révision", rem: "🧱 Une base à consolider" };
// Remédiation (13.11) : notions de base à reprendre quand une notion échoue deux fois de suite.
const PREREQ = { eq1: ["rel", "valnum"], eq2: ["factor", "eq1"], eq2disc: ["eq2fact", "rel"], eq2fact: ["factor"], fracadd: ["fracsimp", "arith"], fracmul: ["fracsimp"],
  fracops: ["fracadd", "fracmul", "rel"], pyth: ["carres", "rac"], pythfig: ["pyth"], pythrec: ["pyth"], thales: ["prop"], affine: ["valnum", "rel"], factor: ["distrib"],
  idrem: ["distrib"], sys2: ["eq1"], trigo: ["prop"], pct: ["prop"], pctvar: ["pct"], ineq: ["eq1"], domaine: ["eq1"], f2: ["eq2"], probeq: ["eq1"], eqfrac: ["fracadd", "eq1"],
  reduire: ["rel"], distrib: ["rel"], sci: ["puiss"], scicalc: ["sci"], monomes: ["puiss"], racenc: ["rac"], valnum: ["prio", "rel"], rel: ["prio"], fracsimp: ["arith"],
  sysineq: ["ineq"], ineqfrac: ["ineq"], eqirr: ["eq2disc"], absval: ["eq1"], trinfact: ["eq2disc"], vol: ["aire2"], echelle: ["prop"],
  // 23.11 : dérivation (3e Collège, src/ch3c_ana.js)
  tauxvar: ["fimg"], nbderive: ["tauxvar"], derivref: ["puiss"], derivregles: ["derivref"], derivprodquot: ["derivregles"], derivcomp: ["derivregles", "compo"],
  tangente: ["nbderive", "droites"], variations: ["derivregles", "ineq2"], optimderiv: ["variations"],
  // 24.11 (agent niv2c) : inéquations polynomiales, 2e Collège (src/ch2c.js)
  ineqpoly: ["polyfact", "ineqfrac"],
  // 24.11 (agent c3geo) : géométrie vectorielle de l'espace, 3e Collège (src/ch3c_geo.js)
  vect3d: ["vecteurs"], colin: ["vect3d"], droite3d: ["vect3d"], plans: ["droite3d"], posrel: ["plans"], pscal3d: ["vect3d"], distances: ["pscal3d", "plans"], sphere: ["plans", "pscal3d"],
  // 24.11 soir : limites, asymptotes, continuité, dérivée seconde, étude, combinatoire, probabilités (3e Collège, src/ch3c_ana.js)
  limites: ["fracrat", "factor"], limitinf: ["limites"], asymptotes: ["limitinf", "fracrat"], continuite: ["limites", "morceaux"],
  derivseconde: ["derivregles"], etudefct: ["variations", "asymptotes"], combi: ["denombr"], probaxiomes: ["proba"], probarbre: ["probaxiomes"],
  // 24.11 : 4e Collège (src/ch4c_ana.js) : intégration, ln et exp, probabilités 2
  primitives: ["derivregles"], integrale: ["primitives"], aireint: ["integrale"], volrev: ["integrale"], lnexp: ["log", "derivcomp"], croissance: ["expo", "log"],
  condbayes: ["proba"], varalea: ["proba"], binomiale: ["varalea"],
  // 25.11 (agent col34) : 3e–4e Collège complétées (derivth, pvect ; syslin, bases, bayes ; MA2 : complexes, suites et séries)
  derivth: ["continuite", "nbderive"], pvect: ["pscal3d"], syslin: ["matrices"], bases: ["matrices", "vect3d"], bayes: ["condbayes"],
  // 25.11 (agent trous) : derniers savoir-faire calculables (src/ch4c_trous.js, ch1c_trous.js, ch11_rep3d.js, fr_trous.js)
  geoesp: ["pythfig", "trigo"], densite: ["integrale", "varalea"], approxnorm: ["binomiale", "normale"], graphefct: ["fimg"], ineqgraph: ["ineqpoly", "inter"],
  // 26.11 (agent perco) : items du PER encore sans question (src/perco.js)
  isom: ["symetries"], ensco: ["relrep", "fracconv"], numer: ["decread"], fctlec: ["repere", "proptab"], litconv: ["valnum", "distrib"],
  repere3d: ["pythfig", "vol"], cercle6: ["disque"], bissec6: ["angtri"], filtre6: ["diagr"], tabform5: ["valnum"], hauteurs5: ["aire1"],
  cplxalg: ["eq2disc"], cplxtrig: ["cplxalg", "trigexact"], cplxeq: ["cplxtrig", "eq2disc"], suitegeom: ["expo", "log"], serie: ["suitegeom", "limitinf"],
  intparties: ["integrale", "derivprodquot"], intsubst: ["integrale", "derivcomp"], etudelnexp: ["lnexp", "variations"], eqdiff: ["croissance", "primitives"],
  // 24.11 (agent niv1c) : 1re Collège, chapitre Argumenter (src/ch1c_arg.js) ; divcrit et tradexpr deviennent des prérequis
  tradalg: ["tradexpr", "valnum"], contrex: ["divcrit", "premiers"], demoalg: ["tradalg", "distrib"], implication: ["contrex", "divcrit"], ratden: ["rac", "idrem"], racprop: ["rac"], fracper: ["fracops"],
  // 24.11 : MP 3e (src/ch_mp3.js) et MP 4e (src/ch_mp4.js)
  eqabs: ["eq1"], eqbic: ["eq2disc"], eqirrmp: ["eq2disc"], eqratmp: ["fracrat", "eq2disc"], puisrat: ["puiss", "rac"], logdef: ["puiss"], logprop: ["logdef"],
  eqexp: ["logdef"], eqlog: ["logprop"], croissexp: ["eqexp"], volmp: ["pyth"], similmp: ["volmp"],
  coordmp: ["pyth"], vectmp: ["coordmp"], scalmp: ["vectmp"], droiteparam: ["vectmp"], ineqmp: ["eq1", "eq2disc"], fctmp: ["fimg"], polymp: ["factor", "eq2disc"],
  sinusmp: ["trigfn"], explogfn: ["eqexp", "logdef"],
  // 24.11 (chantier G, agent greste) : MP 4e (projection, position de droites, fonctions rationnelles) ; 4e Collège (algèbre linéaire, loi normale)
  projmp: ["scalmp"], pvectmp: ["scalmp"], posdroites: ["droiteparam"], fratmp: ["fracrat", "ineqmp"], matrices: ["sys2"], translin: ["matrices"], appllin: ["translin"], normale: ["varalea", "statdesc"], statdesc: ["varalea"], stats: ["diagr"], quartiles: ["diagr"] };
// 24.11 (audit de niveau 1re Collège, tools/niveau_1c.md) : notions du CO dont le niveau 1 est trop facile au Collège (voir make).
const UPC = ["droitesinter", /* 25.11 : N1 donnait la réponse dans l énoncé en 2e Collège */ "arith", "rel", "fracops", "puiss", "sci", "racprop", "tabval", "eq1", "eqfrac", "formule", "probeq", "affine", "ineq", "sysprob",
  "reduire", "monomes", "parenth", "distrib", "idrem", "factor", "eq2", "simil", "thales", "pyth", "pythfig", "pythrec", "geocomb", "angles", "angtri", "cercthales"];
const UPC_MIN = { fracper: 3 };
/* 25.11 (audit de niveau 9e–10e, tools/niveau_910.md ; plans de cheminement CO 2026-27) : formes d'une année supérieure
   qui se glissaient dans les notions de 9e et de 10e. Au tirage (Engine.make, sujets, QCM), une question dont le contexte
   (q.ctx), l'énoncé (RegExp) ou la réponse (fonction) est listé ici pour la classe est refaite ; les autres classes
   (11e, Collège, MP) ne changent pas. */
const HORS_MA1 = { asymptotes: [/oblique/i], etudefct: [/oblique/i] };
/* 26.11 (agent trousmp, objectif S2.GE.02 du plan d'études MP) : filière MP, formes d'une notion partagée avec le Collège
   qui sortent du cours de MP 1re (Chap04 : définitions, points de concours, G aux 2/3, triangle isocèle) : la formule du
   rayon du cercle inscrit r = (a + b − c)/2 et l'angle BHC à l'orthocentre (quadrilatère à deux angles droits). Par ctx. */
const HORS_MP = { droitesrem: ["inscrit", "orthocentre"] };
const HORS_CO = {
  /* 9e : relatifs sans multiplication ni division, fractions dans Q+ (addition, soustraction), périodes d'un chiffre
     (tiers, neuvièmes) ; réduction d'expressions et polygones réguliers en 10e. */
  9: {
    prio: ["rel", "puiss", "carre", "frac"],
    valnum: ["frac", /=\s*-/],
    fracadd: ["negatif", "parmoins", "rel3", (q) => !!(q.spec && q.spec.kind === "value" && q.spec.value < 0)],
    angtri: ["polygone", "nb-cotes", /polygone régulier/],
    litelab: ["perim", "magie", "age", "taxi"],
    fracconv: ["per2", "permixte"],
    fracper: [/seul le \d se répète|\{,\}(\d)(?!\1)(\d)\1\2/],
    quadri: [/axes? de symétrie/], /* primaire (trop facile), remplacé par diagonales et triangles isocèles */
    /* 26.11 (revue p6, n° 6) : pourcentages successifs (défi pct « succ-* ») en 10e avec pctvar ; en 9e, appliquer un pourcentage */
    pct: [(q) => /^succ-/.test(String(q.ctx || ""))],
  },
  /* 10e : simple distributivité seulement (double distributivité, identités : 11e), pas de fractions algébriques ni de
     formules à transformer, pas d'inéquations, pas de cône (11e), aires × k² et volumes × k³ en 11e, vitesse moyenne sur deux trajets en 11e. */
  10: {
    distrib: ["double", "double2", "degre3", "difference", /on retire un carré/],
    reduire: ["fractions-binomes"],
    eq1: ["identites", "carres-elimines", "lit-a", "lit-b", "lit-c", "lit-d", "lit-e"],
    affine: ["f-sup-g-droites"],
    pythfig: ["conehaut", "conegen"],
    echelle: [/\baires?\b|volume|cube|m³|dm³/],
    vitesse: [/aller de|aller-retour|, puis [^.]*km\/h/], /* vitesse moyenne sur deux trajets : 11e (10e = sensibilisation) */
    /* 28.11 (audit de niveau 10e) : double distributivité (11e) ; formule du rectangle A = L · l, P = 2(L + l) : trop facile en 10e
       (substitution de nombres positifs dans une formule du primaire), il reste les formes avec relatifs et décimaux. */
    litconv: ["equiv-double"],
    valnum: ["aire", "perim", "trapeze"],
    /* 28.11 (nickel 10e, ch. 7, tools/archive/contenu_nickel10_ch7_28-11.md) : « le nombre entier qui suit n » (n + 1) est
       trivial en 10e ; aire du trapèze avec des entiers positifs (valnum 2) = formule de 9e, remplacée par des formes avec relatifs. */
    litelab: [/nombre entier qui suit/],
  },
};
/* 28.11 (nickel 10e, ch. 7 Calcul littéral ; règle « leçons progressives » du 15.11 : n'afficher que ce qui est au programme
   et présenté) : textes d'une notion propres à une classe du CO (exemple du catalogue, indice, rappel de cours). En 10e,
   « Développer » = simple distributivité (plan de cheminement 10e : « pas de double distributivité ») ; le texte général
   (11e) parle de (x + 2)(x − 3). Lu par Engine.catalog (ex) et, pour l'indice et le rappel, par des accesseurs sur HINTS et
   LESSONS (fin de ce fichier) qui lisent le profil de l'élève (state, src/app.js) : app.js n'a pas à changer. */
const TXT_CO = {
  10: {
    distrib: {
      ex: "-3(2x - 5) = -6x + 15",
      hint: "Le facteur devant la parenthèse multiplie CHAQUE terme de la parenthèse : 3(2x − 5) = 6x − 15. Un facteur négatif change tous les signes : −2(x − 4) = −2x + 8. Puis réduis.",
      lesson: {
        regle: "Simple distributivité : \\(k(a + b) = ka + kb\\) et \\(k(a - b) = ka - kb\\). Le facteur devant la parenthèse multiplie chaque terme de la parenthèse. Un facteur négatif change le signe de chaque terme : \\(-3(2x - 5) = -6x + 15\\). Avec plusieurs parenthèses, on développe chacune, puis on réduit.",
        exemple: ["\\(3(2x - 5) = 6x - 15\\).", "\\(-2(4x - 3) = -8x + 6\\).", "\\(2x(4x^2 + x - 3) = 8x^3 + 2x^2 - 6x\\).", "\\(3(x + 2) - 2(x - 4) = 3x + 6 - 2x + 8 = x + 14\\)."],
        piege: "Le facteur multiplie tous les termes : \\(3(2x + 5)\\) n'est pas \\(6x + 5\\). Et devant une parenthèse, \\(-2(x - 4) = -2x + 8\\) : moins par moins donne plus.",
      },
    },
  },
};
function txtCO(profile, id) { const p = profile; return p && p.system === "CH" && p.track !== "mp" && TXT_CO[p.grade] && TXT_CO[p.grade][id] || null; }
/* 26.11 (revue élèves p3, n° 1, grave : 2nde FR servie avec l'équation du cercle circonscrit, un « cercle déguisé », la
   perpendiculaire par les pentes — banque de la 2e du Collège suisse) : contenus hors programme d'une classe française,
   repérés dans le TEXTE de la question ou de l'exercice (énoncé, parties, corrigé), quelle que soit la notion :
   [RegExp, première classe FR où le contenu est permis, libellé]. Programme de 2nde (2019, BO 2026) : vecteurs, colinéarité,
   équations de droites, droites parallèles ; PAS l'équation de cercle, ni l'orthogonalité (pentes, vecteur normal), ni le
   produit scalaire (1re spécialité). Lu par horsCO (questions), richOkFR (sujets riches, src/sujet.js) et tests/p3_26_11.html. */
const HORS_FR_TXT = [
  [/équation (?:cartésienne )?(?:du|d'un|de ce) cercle|cercle (?:circonscrit )?d'équation|\\left\(x\s*[-+][^)]*\\right\)\^\{?2\}?\s*\+\s*\\left\(y|\(x\s*[-+−][^()]*\)\^\{?2\}?\s*\+\s*\(y\s*[-+−]|\(x\s*[-+−][^()]*\)²\s*\+\s*\(y|x\^\{?2\}?\s*\+\s*y\^\{?2\}?|x²\s*\+\s*y²/, 11, "équation de cercle"],
  [/perpendiculaire[^.?!;]{0,160}(?:pente|coefficient directeur|y\s*=|équation)|(?:pente|coefficient directeur|y\s*=|équation)[^.?!;]{0,160}perpendiculaire|produit des pentes/, 11, "orthogonalité de droites (repère)"],
  [/produit scalaire|vecteur normal|orthogona/, 11, "produit scalaire, orthogonalité"],
  /* 26.11 (revue p5, n° 1) : différence de deux carrés (a² − b² = (a − b)(a + b)) : 3e (exercices riches, défis, corrigés) */
  [/différence de (?:deux )?carrés|a\^\{?2\}?\s*-\s*b\^\{?2\}?|a²\s*[−-]\s*b²/, 9, "différence de deux carrés"],
  /* 26.11 (revue p5, n° 7 : indice « Q1 et Q3… écart interquartile » en 4e FR) : quartiles, écart interquartile : 2nde */
  [/[Qq]uartile|\bQ_?\{?[13]\}?(?!\d)|[Mm]oustache/, 10, "quartiles"],
  [/(?:médiatrice|hauteur issue)[^.?!;]{0,120}(?:équation|y\s*=)|(?:équation|y\s*=)[^.?!;]{0,120}(?:médiatrice|hauteur issue)/, 11, "médiatrice, hauteur en repère"],
];
const qTextAll = (q) => [q.q, q.sol, ...(q.parts || []).map((x) => x.label), ...(q.guide || []).flatMap((g) => [g.ask, g.sol])].map((t) => String(t || "")).join(" ");
/* Libellé du contenu hors programme d'une classe française trouvé dans le texte t (ou null). */
function horsFRTexte(grade, t) { for (const [r, g, lab] of HORS_FR_TXT) if (grade < g && r.test(t)) return lab; return null; }
/* 26.11 (revue p3, n° 3 : parc traversé en diagonale 4 fois en 2 jours autour d'une évaluation — sujet, défi, veille ;
   table ronde 2 fois dans un même sujet) : scènes reconnues dans l'énoncé, quelle que soit la notion ou l'étiquette ctx.
   Une scène servie est notée (state.ctxDay, clé « s:… ») ; pendant 7 jours, Engine.make et le sujet de préparation
   (mockDistinct, src/sujet.js) l'évitent quand une autre forme existe. */
const SCENES = [
  [/parc[^.?!]{0,90}diagonale|diagonale[^.?!]{0,90}parc|coin au coin opposé|coupe en diagonale/i, "parc-diagonale"],
  [/table ronde/i, "table-ronde"], [/pizza[^.?!]{0,60}(?:diamètre|ronde|rayon)|(?:diamètre|rayon)[^.?!]{0,60}pizza/i, "pizza"], [/tapis rond/i, "tapis-rond"],
  [/échelle[^.?!]{0,90}(?:mur|façade)|(?:mur|façade)[^.?!]{0,90}échelle/i, "echelle-mur"],
  [/carrel/i, "carrelage"], [/enclos/i, "enclos"], [/cerf-volant/i, "cerf-volant"],
  /* 26.11 (revue p4, n° 11 : 3e FR, sujet « Un robinet remplit 25 L en 5 minutes… 40 L » puis, à J−1, mêmes données pour 45 L ;
     « Sur 50 élèves, 5 viennent à vélo » puis « Sur 80 élèves, 12 viennent à vélo ») */
  [/robinet/i, "robinet"], [/viennent (?:à|en) vélo/i, "velo-eleves"],
];
function sceneKey(q) { const t = q ? String(q.q || "") + " " + (q.parts || []).map((x) => x.label || "").join(" ") : ""; for (const [r, k] of SCENES) if (r.test(t)) return k; return null; }
/* scène vue dans les 7 derniers jours (hors aujourd'hui exclu : aujourd'hui compte aussi) ; note une scène servie */
function sceneStale(state, k) { const c = state && state.ctxDay; return !!(k && c && c["s:" + k] && c["s:" + k] >= addDays(day(), -6)); }
function sceneNote(state, k) { if (k && state) (state.ctxDay = state.ctxDay || {})["s:" + k] = day(); }
function horsCO(state, id, q) {
  const p = state && state.profile;
  /* forme réservée à certaines classes : q.co = classes CO / Collège (grade), q.mp = classes MP (25.11, src/defis_sec2.js) */
  if (q && (q.co || q.mp) && p && !(p.system === "CH" && (p.track === "mp" ? (q.mp || []) : (q.co || [])).includes(p.grade))) return true;
  /* 25.11 (audit France, tools/france.md) : profil français : énoncés propres à la Suisse (change EUR ↔ CHF, « en Suisse »,
     TVA suisse) écartés du tirage ; frLocal (CHF → €) les rendrait absurdes (« 1 € = 0,95 € »). */
  if (q && p && p.system === "FR") { const t = String(q.q || "") + " " + (q.parts || []).map((x) => x.label || "").join(" ") + " " + (q.guide || []).map((g) => g.ask || "").join(" "); if (/\bEUR\b|Suisse|suisse|CHF[\s\S]*(€|\beuros?\b)|(€|\beuros?\b)[\s\S]*CHF/.test(t)) return true; }
  /* 25.11 (couverture France, tools/france_couverture.md) : forme réservée à certaines classes françaises (q.fr = classes FR) ;
     formes d'une notion partagée hors programme d'une classe française (HORS_FR, src/fr_couv.js : [ctx | RegExp | fonction,
     première classe FR où la forme est permise]). Sans effet pour un profil suisse, sauf q.fr (forme propre à la France). */
  if (q && q.fr && p && !(p.system === "FR" && q.fr.includes(p.grade))) return true;
  if (q && p && p.system === "FR" && p.grade && horsFRTexte(p.grade, qTextAll(q))) return true;
  if (q && p && p.system === "FR" && typeof HORS_FR !== "undefined" && HORS_FR[id]) {
    const t = String(q.q || "") + " " + (q.parts || []).map((x) => x.label || "").join(" ");
    if (HORS_FR[id].some(([r, g]) => p.grade < g && (typeof r === "string" ? q.ctx === r || (r.endsWith("*") && String(q.ctx || "").startsWith(r.slice(0, -1))) : r instanceof RegExp ? r.test(t) : r(q)))) return true;
  }
  if (q && p && p.system === "CH" && p.track === "mp" && HORS_MP[id] && HORS_MP[id].includes(q.ctx)) return true;
  if (!q || !p || p.system !== "CH" || p.track === "mp") return false;
  /* 25.11 (agent col34, programme du Collège 2021) : en 3e–4e niveau normal MA1, formes réservées au niveau avancé MA2
     (asymptotes obliques : « horizontales, verticales, obliques » en MA2 seulement). Notions entières MA2 : champ niv "R". */
  if (p.grade >= 14 && p.niv !== "R" && HORS_MA1[id]) { const t = String(q.ctx || "") + " " + String(q.q || "") + " " + (q.parts || []).map((x) => x.label || "").join(" "); if (HORS_MA1[id].some((r) => r.test(t))) return true; }
  const L = HORS_CO[p.grade] && HORS_CO[p.grade][id];
  if (!L) return false;
  const txt = String(q.q || "") + " " + (q.parts || []).map((x) => x.label || "").join(" ");
  return L.some((r) => (typeof r === "string" ? q.ctx === r : r instanceof RegExp ? r.test(txt) : r(q)));
}
/* 25.11 : en 9e–10e, une racine exacte s'écrit √n (la simplification a√b est au programme de 11e) : la forme a√b
   n'est plus exigée et la consigne propose √13. */
function racineCO(q) {
  const un = (sp) => { if (sp && sp.radical) delete sp.radical; };
  un(q.spec); (q.guide || []).forEach((g) => { un(g.spec); if (g.ask) g.ask = g.ask.replace(" : simplifie", ""); }); (q.parts || []).forEach((x) => un(x.spec));
  if (q.q) q.q = q.q.replace(/écris par exemple \\\(3\\sqrt\{5\}\\\)/g, "écris par exemple \\(\\sqrt{13}\\)");
  return q;
}
/* 25.11 (commentaire de l'enseignant sur vol-4-lsr, 11e : « Dans un cas comme calculer l'aire d'un disque, taper π r² dans
   la calculatrice ça va bien ! Calcule −7 + 19 : si l'élève peut taper tel quel et que la valeur est acceptée ça va pas »).
   Calcul tapé (le champ évalue l'expression et l'aperçu affiche « ≈ … », c'est la calculatrice de l'app) :
   - permis quand le calcul numérique n'est pas l'objet de la question (formule de géométrie, proportionnalité, statistique,
     probabilités du Collège, trigonométrie, valeur approchée demandée) ;
   - interdit quand le calcul EST la compétence (relatifs, priorités, fractions, puissances, racines, décimaux, conversions,
     substitution, équations, valeurs exactes de trigonométrie, logarithmes) : spec.final, le champ exige le résultat
     (nombre, fraction irréductible, a√b, aπ…), le clavier n'a plus d'opérations et l'aperçu ne calcule plus.
   Règle par thème (CALC_THEME), exceptions par notion (CALC_NON, CALC_OUI), puis par question : q.calcul ou part.calcul
   ("oui" | "non"), consigne « sans calculatrice / mentalement » → non, « à la calculatrice / avec ln » → oui, arrondi
   demandé (spec.round) → oui. Tableau complet et cas à trancher : tools/calculatrice.md (test tests/calculatrice.html).
   Expressions littérales (kind "expr") : la consigne fixe la forme quand le générateur ne l'a pas fait (« Développe »,
   « Réduis » → forme réduite ; « Factorise » → produit), pour que l'expression recopiée de l'énoncé ne soit pas acceptée. */
const CALC_THEME = { no: false, gm: true, es: true, fa: true };
const CALC_NON = [
  "ulong", "uaire", "uvol", "utemps", "ucomp",
  "trigcercle", "trigassoc", "trigrel",
  "valnum", "eq1", "eqfrac", "probeq", "eqverif", "eqspec", "structexpr", "fimg", "progcalc", "log", "logbase", "expo",
];
const CALC_OUI = [
  "diagr", "pct", "denombr", "stats", "statfreq", "quartiles", "statdesc", "combi", "probaxiomes", "probarbre", "condbayes",
  "varalea", "binomiale", "normale", "proba2", "tauxevol", "probcond", "probtot", "vaesp", "binom", "bayes",
];
/* notation scientifique : forme propre (spec.sci), ni calcul ni résultat brut */
const CALC_LIBRE = ["sci", "scicalc"];
const CALC_SANS = /sans calculatrice|mentalement|de tête|calcul mental/i, CALC_AVEC = /à la calculatrice|avec (la|une|ta) calculatrice|valeur exacte avec ln/i;
const CALC_POW = /forme d'une (seule )?puissance|comme une (seule )?puissance|puissance de 10/i;
/* Calcul tapé permis pour cette notion (règle par défaut, sans la question) : true, false ou null (forme propre). */
function calcNotion(id) {
  if (CALC_LIBRE.includes(id)) return null;
  if (CALC_NON.includes(id)) return false;
  if (CALC_OUI.includes(id)) return true;
  const n = typeof NOTIONS !== "undefined" && NOTIONS.find((x) => x.id === id);
  return n && n.theme in CALC_THEME ? CALC_THEME[n.theme] : true;
}
/* Pour une réponse précise : txt = consigne (énoncé + intitulé de la partie), own = déclaration "oui" | "non" éventuelle. */
function calcPermis(id, txt, spec, own) {
  if (own === "oui" || own === "non") return own === "oui";
  if (CALC_SANS.test(txt)) return false;
  if (CALC_AVEC.test(txt) || (spec && spec.round)) return true;
  return calcNotion(id);
}
/* Polynôme (lettres, nombres, + − ·, puissances entières, division par un nombre) : sa forme réduite s'écrit toujours. */
const polyLike = (n) => {
  if (!n) return true;
  if (n.t === "par" || n.t === "neg") return polyLike(n.a);
  if (n.t === "num" || n.t === "var") return true;
  if (["add", "sub", "mul"].includes(n.t)) return polyLike(n.a) && polyLike(n.b);
  if (n.t === "div") return polyLike(n.a) && Expr.vars(n.b).size === 0 && !/const|fn/.test(JSON.stringify(n.b));
  if (n.t === "pow") { const e = Expr.unpar(n.b); return polyLike(n.a) && e.t === "num" && Number.isInteger(e.v) && e.v >= 0; }
  return false;
};
const exprForm = (sp, txt) => {
  if (!sp || sp.kind !== "expr" || sp.form || typeof Expr === "undefined") return;
  const f = /factoris/i.test(txt), d = /développ|réduis|réduire|réduite|simplifi|supprime les parenthèses|^\s*calcule/i.test(txt);
  if (f === d) return;
  let t; try { t = Expr.parse(sp.expr); } catch (e) { return; }
  if (f && Expr.isProduct(t)) sp.form = "product";
  else if (d && polyLike(t)) sp.form = "reduced";
};
// Programme du jour : le format change d'un jour à l'autre ; l'équilibre se fait sur 7 jours.
// 22.11 : textes courts (une ligne sur téléphone : pas de saut quand on change de format).
const DRILL_OK = {}; /* Engine.drillable (26.11) */
/* Notions de problèmes à mettre en équation : jamais en série d'automatismes (Engine.isDrill ; revue p5, n° 6). */
const NO_DRILL = ["probeq", "probeq2", "sysprob", "probrat", "decprob"];
const FORMATS = {
  defi: { label: "🏔 Défi du jour", slots: ["defi4"], text: "Un seul problème, prends ton temps." },
  /* 25.11 (séance de 5 minutes) : 6 calculs au lieu de 8. */
  auto: { label: "⚡ Série d'automatismes", slots: ["drill", "drill", "drill", "drill", "drill", "drill"], text: "6 calculs rapides, enchaînés." },
  app: { label: "🧩 Applications", slots: ["app", "app", "app"], text: "Trois questions de fond." },
  mixte: { label: "⚖️ Mixte", slots: ["drill", "app", "defi"], text: "Automatisme, application, défi." },
  revision: { label: "🧠 Révision", slots: ["rev", "rev", "rev", "rev"], text: "Tes notions à revoir aujourd'hui." },
};
const WEEK = { defi: 2, auto: 2, app: 1, mixte: 1, revision: 1 };

// ---------- Mathélo : score de type Elo ----------
// Année HarmoS équivalente : CH 9e–11e = 9–11 ; FR 6e = 8 … 3e = 11.
const harmos = (system, grade) => (system === "FR" ? grade + 2 : grade);
// Score d'une question : niveau scolaire de la notion + difficulté.
function itemRating(profile, id, d) {
  const n = NOTIONS.find((x) => x.id === id);
  // Niveau propre à la notion : l'année où elle apparaît au CO / Collège. Reprise plus tard en MP : demi-écart en plus.
  /* 24.11 : Math.min, pour une notion ouverte au Collège après la MP (stats, quartiles : 4e Collège, MP 2e) */
  const pl = placeOf(n, profile) || n.CH || n.MP || n.FR, base = profile.system === "CH" && n.CH ? Math.min(n.CH[0], pl[0]) : pl[0];
  const g = base + Math.max(0, pl[0] - base) / 2;
  return 700 + (harmos(profile.system, g) - 8) * 150 + 40 + (d - 1) * 130;
}
// Échelle de référence (sans données partagées) : Mathélo typique en fin d'année par niveau HarmoS.
const ELO_REF = [[8, 850], [9, 1000], [10, 1150], [11, 1300], [12, 1450], [13, 1600], [14, 1750], [15, 1900]]; // 22.11 : 3e et 4e du Collège
function eloLabel(profile, r) {
  const sys = SYSTEMS[profile.system] || (typeof SYSTEMS_HIDDEN !== "undefined" && SYSTEMS_HIDDEN[profile.system]) || { grades: [] }; // 22.11 : France masquée dans l'interface
  const name = (h) => { const g = sys.grades.find(([gg]) => harmos(profile.system, gg) === h); return g ? g[1] : h === 12 ? (profile.system === "FR" ? "2nde" : "1re du Collège") : h === 13 ? (profile.system === "FR" ? "1re" : "2e du Collège") : h === 14 || h === 15 ? (h - 11) + "e du Collège" : h + "e"; };
  let lvl = ELO_REF[0];
  for (const ref of ELO_REF) if (r >= ref[1] - 75) lvl = ref;
  const h = lvl[0], gap = r - lvl[1];
  const adj = gap >= 60 ? "solide" : gap <= -40 ? "en route vers la fin" : "typique de fin";
  return r < ELO_REF[0][1] - 75 ? "En route vers la fin de " + name(8) : "Niveau " + adj + (adj === "solide" ? " de " : " de ") + name(h);
}

// Correction en étapes (étape 0 de l'aide pas à pas, 14.11) : pour les questions sans guide interactif,
// le corrigé est découpé en étapes que l'élève dévoile une à une. Coupure après « . » ou « ; » (hors formules
// \( … \) et hors balises), sinon devant « , donc » / « , soit » ; moins de 2 étapes → pas de découpage.
function splitSol(html) {
  const t = String(html || ""), cut = (re) => {
    const parts = []; let depth = 0, tag = false, last = 0;
    for (let i = 0; i < t.length; i++) {
      const c = t[i];
      if (t.startsWith("\\(", i)) depth++; else if (t.startsWith("\\)", i)) depth = Math.max(0, depth - 1);
      else if (c === "<") tag = true; else if (c === ">") tag = false;
      if (depth || tag) continue;
      const m = re.exec(t.slice(i, i + 8));
      if (m && m.index === 0) { const end = i + m[1].length; parts.push(t.slice(last, end).trim()); last = end; i = end - 1; }
    }
    parts.push(t.slice(last).trim());
    return parts.filter((p) => p.replace(/<[^>]+>/g, "").trim().length > 1);
  };
  let p = cut(/^([.;] )(?=[A-ZÀ-Ý(\\<]|[a-zà-ÿ])/);
  if (p.length < 2) p = cut(/^(,)(?= (donc|soit|puis|d'où) )/);
  if (p.length >= 2 && p.length <= 6) return p;
  // Sinon : la plus longue chaîne de calcul \( a = b = c \) ou \( … \iff … \) est dévoilée relation par relation.
  let best = null;
  for (const m of t.matchAll(/\\\(([\s\S]*?)\\\)/g)) {
    const cuts = []; let dep = 0;
    for (let i = 0; i < m[1].length; i++) {
      const c = m[1][i]; if (c === "{") dep++; else if (c === "}") dep--;
      if (dep) continue;
      if (c === "=" && m[1][i - 1] !== "\\" && m[1][i + 1] !== "=") cuts.push(i);
      else if (m[1].startsWith("\\iff", i)) cuts.push(i);
    }
    if (cuts.length >= 2 && (!best || cuts.length > best.cuts.length)) best = { m, cuts };
  }
  if (!best) return null;
  const { m, cuts } = best, before = t.slice(0, m.index), after = t.slice(m.index + m[0].length);
  const steps = cuts.slice(1).map((c) => before + "\\(" + m[1].slice(0, c).trim() + "\\)");
  steps.push(t);
  return steps.length <= 6 ? steps : [...steps.slice(0, 4), t];
}

// Question triviale ? (règle du 14.11, contrôlée aussi par tests/trivial.html)
// - écriture neutre visible : « + 0 », « - 0 », « · 1 », « × 1 », exposant 1 ;
// - réponse lisible dans l'énoncé alors que deux données sont égales (ex. « 5 cahiers coûtent 30 CHF ; combien coûtent 5 cahiers ? ») ;
// - réponse 0 ou ±1 : écartée aux deux premiers essais seulement (fréquence divisée, mais encore possible quand c'est le sujet).
function trivialQ(q, k) {
  const raw = String(q.q || "").replace(/<[^>]+>/g, " ");
  if (/(^|[^\d.,{}])[+-]\s*0(?![\d.,{])/.test(raw)) return "terme nul";
  if (/\\cdot\s*1(?![\d.,{])|×\s*1(?![\d.,{])|\^\s*\{?\s*1\s*\}?(?![\d.,{])/.test(raw)) return "facteur ou exposant 1";
  const sp = q.spec || {};
  if (sp.kind !== "value" || typeof sp.value !== "number") return "";
  const nums = (raw.replace(/\{,\}/g, ".").replace(/[\^_]\s*(\{[^}]*\}|-?\d)/g, " ").replace(/\\[a-zA-Z]+/g, " ").match(/-?\d+(?:[.,]\d+)?/g) || []).map((t) => +t.replace(",", "."));
  if (!q.shownOk && nums.includes(sp.value) && new Set(nums).size < nums.length) return "réponse dans l'énoncé, données égales";
  /* 26.11 (agent perco) : question à choix numérotés (q.choix = nombre de propositions) : « 1 » est une réponse comme une autre. */
  if (k < 2 && !q.choix && (sp.value === 0 || Math.abs(sp.value) === 1)) return "réponse 0 ou ±1";
  return "";
}

// Réponse visible par coïncidence (audit 14.11) : la valeur attendue (entier, |v| > 1) figure parmi les nombres de l'énoncé,
// hors questions à choix dans une liste. Le tirage l'évite quand il peut (préférence, pas interdiction).
function answerShown(q) {
  const sp = q.spec || {}, raw = String(q.q || "").replace(/<[^>]+>/g, " ");
  // q.shownOk (20.11) : la réponse est par nature une des données (mode, médiane, quartile d'une série).
  if (q.shownOk || q.choix || sp.kind !== "value" || !Number.isInteger(sp.value) || Math.abs(sp.value) < 2 || /ces nombres|parmi|lequel|laquelle/i.test(raw)) return false;
  const nums = (raw.replace(/\{,\}/g, ".").replace(/\\[a-zA-Z]+/g, " ").match(/-?\d+(?:[.,]\d+)?/g) || []).map((t) => +t.replace(",", "."));
  return nums.includes(sp.value) || nums.includes(-sp.value);
}

// Forme d'une question : l'énoncé sans les nombres (deux questions de même forme ne diffèrent que par les valeurs).
const qForm = (q) => String(q.q || "").replace(/\d+(?:[.,]\d+|\{,\}\d+)?/g, "#").replace(/\s+/g, " ");

const Engine = {
  newState(profile) {
    const h = harmos(profile.system, profile.grade);
    const start = 700 + (h - 8) * 150 + 100;
    return { v: STATE_V, profile, notions: {}, streak: { count: 0, last: null }, history: [], created: day(), elo: { r: Math.round(start), n: 0, log: [] } };
  },

  // Notions du programme jusqu'à l'année de l'élève. Années précédentes : vues. Année en cours : « à venir » ;
  // elles s'ouvrent dans l'ordre du référentiel (unlock), sans rien demander à l'élève.
  catalog(profile) {
    /* 25.11 soir (décision de l'enseignant : « distinguer normal et renforcé en 3e–4e ») : au Collège de Genève, 3e et 4e,
       les notions niv: "R" (MA2, niveau renforcé) ne sont proposées qu'aux élèves de MA2. Sans choix : MA1. */
    const ma1 = profile.system === "CH" && profile.track !== "mp" && profile.grade >= 14 && profile.niv !== "R";
    /* 27.11 (agent primaire) : automatismes de fin de primaire (n.prim, src/primaire.js) jamais au catalogue : servis par PRIM.inject seulement */
    return NOTIONS.filter((n) => { const pl = placeOf(n, profile); return pl && pl[0] <= profile.grade && !(ma1 && n.niv === "R") && !n.prim; }).map((n) => {
      const [g] = placeOf(n, profile);
      // Matu : une notion est « de l'année » si son chapitre Sésamath est celui de l'année (Ma1 = 1re, Ma2 = 2e).
      /* 25.11 (audit France) : chapitres Sésamath du Collège de Genève pour les profils suisses seulement (une Tle française, grade 12,
         recevait les chapitres de 1re du Collège comme « de l'année » : relatifs, Pythagore, puissances…). */
      const yr = "M" + (profile.grade - 11), sesa = profile.system === "CH" && profile.track !== "mp" && profile.grade >= 12 && typeof ORDRE_THEME !== "undefined" &&
        [(ORDRE_THEME.MATU || {})[n.id], (ORDRE_THEME.MATU_ALT || {})[n.id], (ORDRE_THEME.MATU_REP || {})[n.id]].some((k) => (k || "").startsWith(yr));
      /* 25.11 (agent col34) : MATU_REP = reprises d'une année précédente rangées dans un chapitre de l'année (3e, « 1. Prérequis ») :
         « de l'année » (current), mais statut « vu » (g < grade), donc pas « nouvelles ». */
      const coYear = this.coChap(profile, n.id, true);
      // 22.11 (seconde FR) : « again » liste des années suisses ; pour la France, on lit againFR (sinon une notion reprise en 10e
      // suisse devenait « de l'année » en 2nde, grade 10 aussi).
      const again = sesa || coYear || (profile.track !== "mp" && ((profile.system === "FR" ? n.againFR : n.again) || []).includes(profile.grade));
      const label = profile.system === "FR" && n.labelFR && profile.grade < n.labelFR[0] ? n.labelFR[1] : n.label; /* 26.11 : libellé du collège français (fr_couv.js) */
      /* 28.11 (nickel 10e, ch. 7) : exemple de la notion propre à la classe (TXT_CO : « Développer » sans double distributivité en 10e) */
      const tc = txtCO(profile, n.id), ex = tc && tc.ex ? tc.ex : n.ex;
      return { ...n, label, ex, theme: this.themeKey(profile, n.id), defaultStatus: g < profile.grade ? "vu" : "avenir", current: g === profile.grade || again, again };
    });
  },
  // 22.11 : référentiel « FR » pour un profil français (ordre et chapitres dans ORDRE.FR / ORDRE_THEME.FR, src/fr_2nde.js).
  refOf(profile) { return profile.system === "FR" ? "FR" : profile.track === "mp" ? "MP" : profile.grade >= 12 ? "MATU" : "CO"; },
  // Thème d'une notion selon le référentiel de l'élève (13.11) : matu = thèmes (Algèbre, Fonctions…), MP = chapitres ;
  // CO, ou notion absente du référentiel : les 4 thèmes du CO.
  // CO (élèves suisses, 9e–11e) : chapitre du plan de l'année ; pour une notion d'une année précédente, son dernier chapitre.
  coChap(profile, id, onlyThisYear = false) {
    if (profile.system !== "CH" || profile.grade > 11 || typeof ORDRE_THEME === "undefined") return null;
    const by = (ORDRE_THEME.CO_BY || {})[id];
    if (!by) return null;
    if (by[profile.grade]) return by[profile.grade];
    if (onlyThisYear) return null;
    const ys = Object.keys(by).map(Number).sort((a, b) => a - b), y = ys.filter((v) => v <= profile.grade).pop() ?? ys[0];
    return by[y];
  },
  themeKey(profile, id) {
    const co = this.coChap(profile, id);
    if (co) return "CO." + co;
    const ref = this.refOf(profile), alt = ref === "MATU" && typeof ORDRE_THEME !== "undefined" && ([(ORDRE_THEME.MATU_REP || {})[id], (ORDRE_THEME.MATU_ALT || {})[id]].find((k) => (k || "").startsWith("M" + (profile.grade - 11))) || (ORDRE_THEME.MATU_ALT || {})[id]);
    // Notion sur deux années : le chapitre de l'année de l'élève.
    const k = alt && alt.startsWith("M" + (profile.grade - 11)) ? alt : ref !== "CO" && typeof ORDRE_THEME !== "undefined" && (ORDRE_THEME[ref] || {})[id];
    /* 25.11 (règle de l'auteur, « très important » : chaque système a ses dénominations ; « Nombres et opérations » parle
       à un élève du CO, pas à un collégien français ni au Collège de Genève) : jamais les 4 domaines du PER hors du CO.
       France, collège : domaines des programmes (Nombres et calculs…) ; lycée, notion du collège : idem, « Collège · ».
       Collège de Genève et MP : notion venue du CO → son chapitre du CO (« CO 10e · 6. Puissances et racines »). */
    if (ref === "FR" && (!k || profile.grade <= 9)) return "FRD." + frDomain(id);
    if (k) return ref + "." + k;
    const by = typeof ORDRE_THEME !== "undefined" && (ORDRE_THEME.CO_BY || {})[id];
    if (ref !== "CO" && by) { const ys = Object.keys(by).map(Number).sort((a, b) => a - b); return "CO." + by[ys[ys.length - 1]]; }
    return NOTIONS.find((n) => n.id === id).theme;
  },
  // Libellé d'un thème ou chapitre ; chapitre CO d'une autre année : précédé de l'année (« 9e · 10. Calcul littéral »).
  themeLabel(key, profile) {
    const [ref, k] = key.split(".");
    if (!k) return THEMES[key];
    if (ref === "FRD") return (profile && profile.grade >= 10 ? "Collège · " : "") + FR_DOMAINS[k];
    /* Lycée français : chapitre d'une autre année précédé de l'année (« 2nde · Fonctions »). */
    const fy = ref === "FR" && k !== "2AU" && { 2: [10, "2nde"], 1: [11, "1re"], T: [12, "Tle"] }[k[0]];
    if (fy && profile && fy[0] !== profile.grade) return fy[1] + " · " + THEME_LABEL.FR[k];
    const y = ref === "CO" && k.split("C")[0], coElsewhere = profile && this.refOf(profile) !== "CO";
    return (y && profile && +y !== profile.grade ? (coElsewhere ? "CO " : "") + y + "e · " : "") + THEME_LABEL[ref][k];
  },
  // Thèmes présents dans une liste du catalogue, dans l'ordre du référentiel puis ceux du CO.
  // Chapitres CO d'une autre année (révisions) : après ceux de l'année.
  themeOrder(list, profile) {
    const keys = [...new Set(list.map((c) => c.theme))], pos = (k) => {
      const [ref, t] = k.split(".");
      if (!t) return 1000 + Object.keys(THEMES).indexOf(k);
      if (ref === "FRD") return (profile && profile.grade >= 10 ? 600 : 0) + Object.keys(FR_DOMAINS).indexOf(t);
      return Object.keys(THEME_LABEL[ref]).indexOf(t) + (ref === "CO" && profile && +t.split("C")[0] !== profile.grade ? 500 : 0);
    };
    return keys.sort((a, b) => pos(a) - pos(b));
  },
  // Rang dans l'ordre du référentiel (CO, matu ou MP selon l'élève).
  rank(profile, id) {
    // 22.11 : collège français (6e–3e) : progression propre (ORDRE.FR_COL, défini dans fr_college.js), sinon l'ordre du CO.
    if (profile.system === "FR" && profile.grade <= 9 && ORDRE.FR_COL && ORDRE.FR_COL[id] !== undefined) return ORDRE.FR_COL[id];
    const ref = this.refOf(profile);
    const r = (ORDRE[ref] || {})[id] ?? ORDRE.CO[id];
    return r ?? 1000 + NOTIONS.findIndex((n) => n.id === id);
  },
  newNotion(status) {
    return { status, m: status === "vu" ? 0.55 : status === "encours" ? 0.4 : 0, box: status === "vu" ? 1 : 0, due: day(), seen: 0, ok: 0 };
  },
  autoInit(state) {
    this.initNotions(state, Object.fromEntries(this.catalog(state.profile).map((c) => [c.id, c.defaultStatus])));
    this.unlock(state);
  },
  // Ouvre les notions de l'année dans l'ordre du référentiel : toujours au moins 3 notions ouvertes et pas encore
  // maîtrisées, et au moins la part de l'année écoulée (novembre ≈ 20 %, juin ≈ 90 %). Une notion « pas encore vue
  // en classe » revient au bout de 3 semaines.
  unlock(state, date = new Date()) {
    const today = day(date), p = state.profile;
    const cur = Object.keys(state.notions).filter((id) => { const pl = placeOf(NOTIONS.find((n) => n.id === id), p); return pl && pl[0] === p.grade; })
      .sort((a, b) => this.rank(p, a) - this.rank(p, b));
    for (const id of cur) { const s = state.notions[id]; if (s.status === "nonvu" && (!s.retry || s.retry <= today)) s.status = "avenir"; }
    const open = () => cur.filter((id) => ["encours", "vu"].includes(state.notions[id].status));
    const active = () => open().filter((id) => { const s = state.notions[id]; return !(s.ok >= 2 && s.m >= 0.6); }).length;
    const minOpen = Math.ceil((cur.length * schoolMonth(date)) / 10);
    let changed = false;
    while (active() < 3 || open().length < minOpen) {
      const next = cur.find((id) => state.notions[id].status === "avenir");
      if (!next) break;
      Object.assign(state.notions[next], { status: "encours", m: Math.max(0.4, state.notions[next].m), due: today });
      changed = true;
    }
    return changed;
  },
  // « Pas encore vu en classe » : la notion sort des séances pendant 3 semaines, sans pénalité.
  notYet(state, id) {
    const s = state.notions[id];
    if (!s) return;
    s.status = "nonvu"; s.retry = addDays(day(), 21); s.due = s.retry;
    this.unlock(state);
  },
  // Progression visible (24.11, chantier S) : instantané léger pris au début de chaque jour d'activité, AVANT la
  // première modification (appelé par record, tooEasy, updateElo, recordComp et au chargement). Contenu : notes des
  // compétences (en demi-points, entiers) et notions maîtrisées (vues, m ≥ 0,7, même critère que la carte des thèmes).
  // Comme l'état ne change que les jours d'activité, et que chacun commence par un instantané, l'état « il y a 7 jours »
  // est le premier instantané de la fenêtre : on ne garde que ceux des 7 derniers jours (7 au plus).
  // Ancien state sans instantané : rien à migrer, le premier est pris au chargement (la semaine part de ce jour-là).
  snap(state, today = day()) {
    if (!state || !state.notions) return;
    const S = Array.isArray(state.snaps) ? state.snaps : [];
    if (S.length && S[S.length - 1] && S[S.length - 1].d === today) return;
    const c = {};
    for (const [cid, rec] of Object.entries(state.comps || {})) { const n = compNote(rec); if (n !== null) c[cid] = Math.round(n * 2); }
    const k = Object.keys(state.notions).filter((id) => { const s = state.notions[id]; return s && s.seen > 0 && s.m >= 0.7; });
    const lim = addDays(today, -6);
    state.snaps = [...S.filter((x) => x && x.d >= lim && x.d < today), { d: today, c, k }];
  },
  /* 26.11 (revue p5, n° 12 : « Cette semaine : 6 notions consolidées » dès le premier jour, 1 à 3 questions faites) : à la fin
     du positionnement, l'instantané du jour reprend les notions qu'il a validées ; seules les séances comptent ensuite. */
  snapPlaced(state, today = day()) {
    if (!state || !state.notions) return;
    this.snap(state, today);
    const x = state.snaps[state.snaps.length - 1];
    if (x && x.d === today) x.k = Object.keys(state.notions).filter((id) => { const s = state.notions[id]; return s && s.seen > 0 && s.m >= 0.7; });
  },
  // Bilan des 7 derniers jours (aujourd'hui compris), comparé à soi-même seulement.
  // ups : compétences dont la note a monté [{ cid, label, b, a }], de la plus forte hausse à la plus faible ;
  // first : compétences notées pour la première fois ; cons : notions devenues maîtrisées ; fixed : erreurs effacées du
  // carnet ; days / n : jours actifs et questions ; since : date de départ si la fenêtre est partielle (sinon null).
  week(state, today = day()) {
    const lim = addDays(today, -6), S = (Array.isArray(state.snaps) ? state.snaps : []).filter((x) => x && x.d >= lim && x.d <= today);
    const ref = S[0] || null, H = (state.history || []).filter((x) => x && x.date >= lim && x.date <= today && x.n > 0);
    const out = { ups: [], first: [], cons: [], fixed: 0, days: H.length, n: H.reduce((a, x) => a + (x.n || 0), 0), since: null };
    out.fixed = (Array.isArray(state.carnetOut) ? state.carnetOut : []).filter((d) => d >= lim && d <= today).length;
    if (!ref) return out;
    // Activité dans la fenêtre avant le premier instantané (state d'avant le 24.11) : on dit « depuis le … ».
    if (H.some((x) => x.date < ref.d)) out.since = ref.d;
    const lab = (cid) => { const [id, i] = cid.split(":"), L = COMPS[id]; return (L && L[+i]) || (NOTIONS.find((x) => x.id === id) || {}).label || id; };
    for (const [cid, rec] of Object.entries(state.comps || {})) {
      const a = compNote(rec);
      if (a === null) continue;
      const b = ref.c && ref.c[cid] != null ? ref.c[cid] / 2 : null;
      if (b === null) out.first.push({ cid, label: lab(cid), a });
      else if (a > b) out.ups.push({ cid, label: lab(cid), b, a });
    }
    out.ups.sort((x, y) => y.a - y.b - (x.a - x.b) || y.a - x.a);
    const had = new Set(ref.k || []);
    out.cons = Object.keys(state.notions || {}).filter((id) => { const s = state.notions[id]; return s && s.status !== "prim" /* 27.11 : notions de primaire exclues */ && s.seen > 0 && s.m >= 0.7 && !had.has(id); });
    return out;
  },
  // Compétence : les 8 dernières réponses (1, 0,5 ou 0).
  recordComp(state, id, d, score) {
    this.snap(state);
    state.comps = state.comps || {};
    const cid = compOf(id, d), rec = (state.comps[cid] = state.comps[cid] || { r: [], n: 0 }), before = compNote(rec);
    rec.r.push(score); rec.r = rec.r.slice(-8); rec.n++; rec.last = day();
    if (d >= 2 || +cid.split(":")[1] > 0) rec.hi = true; /* 26.11 (revue p5, n° 3) : réponse de niveau 2 ou plus (note 6 possible, compNote) */
    if (typeof Badges !== "undefined") Badges.onComp(state, cid, before, compNote(rec));
  },

  /* 27.11 (robustesse, migrations ; test : tests/migration.html) : champs de base d'un état enregistré par une version
     ancienne (ou abîmé) remis en forme sans rien perdre : profil (voie, durée), notions (nombres, statut, échéance), série,
     historique, Mathélo, carnet, savoir-faire ; numéro de version (state.v, STATE_V). Ne touche jamais à une valeur valable.
     Renvoie vrai si l'état a changé. */
  upgrade(state) {
    let ch = false;
    const set = (o, k, v) => { o[k] = v; ch = true; }, num = (x) => typeof x === "number" && isFinite(x);
    const p = state.profile;
    if (!num(p.grade)) set(p, "grade", +p.grade || 9);
    if (p.system === "CH" && p.track !== "mp" && p.track !== "college") set(p, "track", "college");
    if (!num(p.minutes)) set(p, "minutes", 5);
    if (!state.notions || typeof state.notions !== "object" || Array.isArray(state.notions)) set(state, "notions", {});
    const ST = ["vu", "encours", "avenir", "nonvu"];
    for (const [id, n] of Object.entries(state.notions)) {
      if (!n || typeof n !== "object") { state.notions[id] = this.newNotion("avenir"); ch = true; continue; }
      if (!ST.includes(n.status)) set(n, "status", "vu");
      for (const k of ["m", "box", "seen", "ok"]) if (!num(n[k])) set(n, k, k === "m" ? (n.status === "vu" ? 0.55 : 0) : 0);
      if (typeof n.due !== "string") set(n, "due", day());
    }
    if (!state.streak || typeof state.streak !== "object") set(state, "streak", { count: 0, last: null });
    else if (!num(state.streak.count)) set(state.streak, "count", 0);
    if (!Array.isArray(state.history)) set(state, "history", []);
    else if (state.history.some((x) => !x || typeof x.date !== "string" || !num(x.n))) set(state, "history", state.history.filter((x) => x && typeof x.date === "string" && num(x.n)));
    if (!state.elo || !num(state.elo.r)) set(state, "elo", { ...(state.elo || {}), r: this.newState(p).elo.r });
    if (!num(state.elo.n)) set(state.elo, "n", 0);
    if (!Array.isArray(state.elo.log)) set(state.elo, "log", []);
    if (typeof state.created !== "string") set(state, "created", (state.history[0] && state.history[0].date) || day());
    if (state.carnet !== undefined && !Array.isArray(state.carnet)) set(state, "carnet", []);
    if (Array.isArray(state.carnet) && state.carnet.some((x) => !x || !x.id || !x.d)) set(state, "carnet", state.carnet.filter((x) => x && x.id && x.d));
    if (state.comps && typeof state.comps === "object") for (const [cid, r] of Object.entries(state.comps)) if (!r || !Array.isArray(r.r)) { delete state.comps[cid]; ch = true; }
    if (state.v !== STATE_V) set(state, "v", STATE_V);
    return ch;
  },

  // Catalogue modifié depuis la création du profil : ajoute les notions manquantes (anciennes = vues, année en cours = à cocher).
  migrate(state) {
    let changed = false;
    for (const c of this.catalog(state.profile)) if (!state.notions[c.id]) { state.notions[c.id] = this.newNotion(c.defaultStatus); changed = true; }
    // Ancien questionnaire : « pas encore » coché par l'élève → à venir (la notion s'ouvrira dans l'ordre).
    for (const s of Object.values(state.notions)) if (s.status === "nonvu" && !s.retry) { s.status = "avenir"; changed = true; }
    /* Décision de l'enseignant (26.11, n° 4) : une réussite au positionnement compte comme notion vue. Progressions
       antérieures : notion réussie au positionnement (boîte 2) et jamais reposée depuis → vue, leçon comprise. */
    for (const s of Object.values(state.notions)) if (s.placed && !s.seen && !s.lessonSeen && s.box >= 2) { s.seen = 1; s.lessonSeen = true; changed = true; }
    /* 26.11 (revue p5, n° 3) : savoir-faire de niveau 2 ou 3 déjà notés : réponses de niveau 2 ou plus (compNote) */
    for (const [cid, rec] of Object.entries(state.comps || {})) if (rec && !rec.hi && +cid.split(":")[1] > 0) { rec.hi = true; changed = true; }
    for (const id of Object.keys(state.notions)) { const n = NOTIONS.find((x) => x.id === id); if (!n || !placeOf(n, state.profile)) { delete state.notions[id]; changed = true; } }
    if (this.unlock(state)) changed = true;
    return changed;
  },

  initNotions(state, statuses) {
    state.notions = {};
    for (const [id, status] of Object.entries(statuses)) {
      state.notions[id] = this.newNotion(status);
    }
  },

  // Mode « progression libre » (18.11), programme adaptatif (19.11, demande de l'auteur : pas de bouton, c'est l'app
  // qui construit le parcours). Niveau L = maîtrise moyenne des notions travaillées :
  //  - élève à l'aise (L ≥ 0,75) : surtout des notions neuves, prises un peu plus loin dans le référentiel, et un cran
  //    de difficulté en plus sur ce qu'il maîtrise déjà ;
  //  - élève moyen : tiers forts / à travailler / neuves (cross-training) ;
  //  - élève en difficulté (L < 0,55) : surtout ses points faibles, précédés de leurs bases (PREREQ) non maîtrisées ;
  //    les notions neuves sont les premières du référentiel, et seulement si leurs bases sont acquises.
  // Thèmes alternés. Le second argument (ancien choix de périmètre) est ignoré.
  freePlan(state, scope, n = 6) {
    const theme = (id) => (NOTIONS.find((x) => x.id === id) || {}).theme || "";
    /* 26.11 (revue des élèves joués p4, n° 2, grave : 2e Collège en mode libre, 4 questions sur 5 en « 🔙 Rappel » du CO,
       notions des années précédentes dans les groupes « forts » et « neufs ») : notions de l'année seulement (catalogue,
       current) ; une notion d'avant n'entre que si le parcours le demande (remob : ratée, prérequis d'une notion de l'année
       qui coince, Mathélo en baisse), et seulement parmi les points faibles. Sans assez de notions de l'année : les autres. */
    const yearSet = new Set(this.catalog(state.profile).filter((c) => c.current).map((c) => c.id)), need = this.remob(state, yearSet);
    const all = Object.keys(state.notions).filter((id) => GEN[id]), yr = all.filter((id) => yearSet.has(id));
    const pool = yr.length >= n ? yr.concat(all.filter((id) => !yearSet.has(id) && need.has(id))) : all;
    const inYear = (id) => yr.length < n || yearSet.has(id);
    const s = (id) => state.notions[id], ok = (id) => !state.notions[id] || (s(id).seen > 0 && s(id).m >= 0.7);
    const seen = pool.filter((id) => s(id).seen > 0), L = seen.length ? seen.reduce((t, id) => t + s(id).m, 0) / seen.length : 0.6;
    const tier = seen.length < 3 ? "mid" : L >= 0.75 ? "fort" : L < 0.55 ? "fragile" : "mid";
    const sh = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    const rk = (id) => this.rank(state.profile, id);
    // Anti-répétition entre séances (commentaire testeur du 20.11 : « beaucoup trop de questions de temps ») : une notion
    // posée lors des deux dernières séances libres passe après les autres ; les points faibles reviennent, mais en alternance.
    const recent = (state.freeRecent || []).flat(), rec = (id) => recent.filter((x) => x === id).length;
    const byRecent = (a) => a.map((id, i) => [id, i]).sort((x, y) => rec(x[0]) - rec(y[0]) || x[1] - y[1]).map((x) => x[0]);
    const strong = byRecent(sh(pool.filter((id) => inYear(id) && s(id).seen > 0 && s(id).m >= 0.7)));
    // Points faibles du plus fragile au moins fragile ; pour un élève fragile, chaque point faible est précédé de ses bases.
    let weak = pool.filter((id) => s(id).seen > 0 && s(id).m < 0.7).sort((a, b) => s(a).m + 0.3 * rec(a) - s(b).m - 0.3 * rec(b) + (Math.random() - 0.5) * 0.1);
    if (tier === "fragile") weak = [...new Set(weak.flatMap((id) => [...(PREREQ[id] || []).filter((p) => all.includes(p) && !ok(p)), id]))];
    // Notions neuves dans l'ordre du référentiel : l'élève fragile prend les premières (bases d'abord, prérequis acquis) ;
    // l'élève à l'aise pioche plus loin (fenêtre décalée).
    let fresh = pool.filter((id) => inYear(id) && !s(id).seen).sort((a, b) => rk(a) - rk(b));
    if (tier === "fragile") fresh = fresh.filter((id) => (PREREQ[id] || []).every(ok));
    const win = tier === "fort" ? fresh.slice(Math.min(4, Math.max(0, fresh.length - 8)), Math.min(4, Math.max(0, fresh.length - 8)) + 20) : fresh.slice(0, tier === "fragile" ? 10 : 20); // fenêtre élargie (20.11) : plusieurs chapitres, pour la limite de 2 par chapitre
    fresh = byRecent(sh(win.length ? win : fresh));
    const want = tier === "fort" ? [1, 1, n - 2] : tier === "fragile" ? [1, n - 2, 1] : [Math.round(n / 3), Math.round(n / 3), n - 2 * Math.round(n / 3)];
    const groups = [strong, weak, fresh], out = [], used = new Set();
    // Au plus 2 notions du même chapitre par séance (20.11) : un élève qui rate tout un chapitre (ex. proportionnalité,
    // durées et vitesses) ne reçoit plus que ça ; les places libérées vont aux autres chapitres, sinon on lève la limite.
    const fam = (id) => { try { return this.themeKey(state.profile, id) || theme(id); } catch (e) { return theme(id); } };
    const famN = (id) => out.filter((x) => fam(x) === fam(id)).length;
    const take = (g, cap = true) => { const last = out.length ? theme(out[out.length - 1]) : "", free = (id) => !used.has(id) && (!cap || famN(id) < 2); let k = g.findIndex((id) => free(id) && theme(id) !== last); if (k < 0) k = g.findIndex(free); if (k < 0) return false; used.add(g[k]); out.push(g[k]); return true; };
    for (let round = 0; out.length < n && round < 3 * n; round++) { const gi = [1, 2, 0][round % 3]; if (want[gi] > 0 && take(groups[gi])) want[gi]--; else if (want.every((w, i) => w <= 0 || !groups[i].some((id) => !used.has(id) && famN(id) < 2))) { if (!groups.some((g) => take(g))) break; } }
    while (out.length < n && (groups.some((g) => take(g)) || groups.some((g) => take(g, false)))) {}
    const cap = difficultyCap(state.profile);
    state.freeRecent = [...(state.freeRecent || []), out.slice()].slice(-2);
    return out.map((id) => { let d = this.difficulty(state, id); if (tier === "fort" && s(id).seen > 0 && s(id).m >= 0.85) d = Math.min(cap, d + 1); return id + "|" + d; });
  },

  /* 26.11 (revue p4, n° 2) : notions hors de l'année que le parcours de l'élève demande de remobiliser (règle du 24.11) :
     ratée (travaillée dans l'app, maîtrise < 0,45 ou deux échecs), prérequis d'une notion de l'année qui coince, ou toutes
     celles déjà travaillées si le Mathélo est en forte baisse. year : ensemble des notions de l'année. */
  remob(state, year) {
    const need = new Set(), coince = (s) => !!s && s.seen > 0 && (s.m < 0.45 || (s.fails || 0) >= 2);
    for (const [id, s] of Object.entries(state.notions)) {
      if (!year.has(id)) { if (coince(s)) need.add(id); continue; }
      if (s.seen >= 2 && coince(s)) for (const p of PREREQ[id] || []) if (state.notions[p] && !year.has(p)) need.add(p);
    }
    if (this.eloDrop(state)) for (const [id, s] of Object.entries(state.notions)) if (!year.has(id) && s.seen > 0) need.add(id);
    return need;
  },
  eligible(state) {
    return Object.entries(state.notions).filter(([, s]) => s.status === "vu" || s.status === "encours").map(([id]) => id);
  },

  // Difficulté : visée ≈ 70 % de réussite (question ≈ 150 points sous le Mathélo), corrigée par la maîtrise de la notion.
  difficulty(state, id) {
    const cap = difficultyCap(state.profile), m = state.notions[id].m;
    let best = 1, bestGap = Infinity;
    for (let d = 1; d <= cap; d++) {
      const gap = Math.abs(itemRating(state.profile, id, d) - (state.elo.r - 150 + (state.tadj || 0)));
      if (gap < bestGap) { bestGap = gap; best = d; }
    }
    if (m < 0.3) best = Math.max(1, best - 1);
    if (m > 0.8) best = Math.min(cap, best + 1);
    // Niveau 4 (problème) : notion solide, Mathélo suffisant, environ une fois sur trois.
    if (hasProb(id) && m >= 0.7 && state.elo.r >= itemRating(state.profile, id, 4) - 250 && Math.random() < 0.35) return 4;
    return best;
  },

  /* 26.11 (revue d'un testeur, parcours « erreur » : −35 après deux erreurs puis un pas à pas réussi jusqu'au bout) :
     pas à pas mené à bien (toutes les étapes justes) → la moitié de la perte est rendue (comme une demi-réussite). */
  eloRefund(state, delta) {
    if (!(delta < 0)) return 0;
    const back = Math.round(-delta / 2), e = state.elo; e.r += back;
    const last = e.log[e.log.length - 1]; if (last && last[0] === day()) last[1] = e.r;
    return back;
  },
  // Mise à jour du Mathélo. score : 1, 0,5 ou 0. K plus grand au début (positionnement rapide).
  updateElo(state, id, d, score, weight = 1) {
    this.snap(state);
    const e = state.elo, q = itemRating(state.profile, id, d);
    const expected = 1 / (1 + Math.pow(10, (q - e.r) / 400));
    const K = (e.n < 20 ? 48 : e.n < 60 ? 32 : 20) * weight; // calibrage progressif : provisoire tant que n < 20
    let delta = Math.round(K * (score - expected));
    /* 26.11 (revue élèves : −32, −37 sur des questions de niveau 1 pendant la phase provisoire, « Bonne séance. Mathélo −42 ») :
       pendant le calibrage (n < 20), un échec sur une question de niveau 1 coûte 15 points au plus. Les réussites et les
       niveaux 2 et plus (positionnement compris) gardent le K du calibrage. */
    if (e.n < 20 && d <= 1 && delta < -15) delta = -15;
    e.r = Math.max(400, e.r + delta);
    e.n++;
    const today = day(), last = e.log[e.log.length - 1];
    if (last && last[0] === today) last[1] = e.r; else e.log.push([today, e.r]);
    e.log = e.log.slice(-90);
    return delta;
  },

  // Anti-répétition (audit 13.11) : une question déjà posée parmi les 15 dernières de la notion est retirée.
  // Résultat exigé ou calcul tapé permis : règle par notion et par question (CALC_*, 25.11 ; avant : tout le CO en résultat).
  finalize(state, id, q) {
    const p = state && state.profile;
    if (q && p && p.system === "CH" && p.track !== "mp" && p.grade <= 10) racineCO(q);
    if (!q) return q;
    const txt0 = String(q.q || "");
    const mark = (sp, txt, own, step) => {
      if (!sp) return;
      if (!step) exprForm(sp, txt);
      /* 26.11 (revue p3, n° 12, A11 : 0,309016994375 accepté pour « Donne la valeur exacte ») : valeur exacte demandée, pas
         d'arrondi prévu : un décimal de calculatrice est refusé (checkAnswer, src/expr.js) ; un décimal exact reste accepté. */
      if (sp.kind === "value" && !sp.round && /valeur exacte/i.test(txt) && !/approch|arrondi/i.test(txt)) sp.exact = true;
      /* 26.11 (revue p5, n° 14 : « … sous forme de fraction irréductible » acceptait 0,9375) : fraction demandée (spec.frac) */
      if (!step && sp.kind === "value" && !sp.round && isFinite(sp.value) && !Number.isInteger(sp.value) && /fraction irréductible|sous forme (?:de|d'une) fraction/i.test(txt)) sp.frac = true;
      if (sp.kind !== "value" || sp.sci || sp.final) return;
      if (calcPermis(id, txt, sp, own) === false) { sp.final = true; if (CALC_POW.test(txt)) sp.pow = true; }
    };
    mark(q.spec, txt0, q.calcul);
    (q.parts || []).forEach((x) => mark(x.spec, txt0 + " " + (x.label || ""), x.calcul || q.calcul));
    (q.guide || []).forEach((g) => mark(g.spec, txt0 + " " + (g.ask || ""), g.calcul || q.calcul, true));
    /* 25.11 (audit France, tools/france.md) : profil français : €, milliers 1 200, PGCD, antécédent, factoriser (frLocal,
       src/curriculum.js). Tous les textes de la question ; jamais les réponses attendues (spec, canon, expressions des pièges). */
    /* 25.11 (soir, couverture France) : notes suisses (1 à 6) remplacées par des notes sur 20 (FR_NOTES, src/fr_fin.js). */
    if (p && p.system === "FR" && typeof FR_NOTES === "function") { const r = FR_NOTES(id, q); if (r) q = r; }
    /* 26.11 (revue p3, n° 1, trace de Théo : piège « −1/a, c'est pour perpendiculaire » en 2nde) : profil français, un message
       de piège ou un indice qui parle d'un contenu hors programme de la classe est retiré (le retour générique reste). */
    if (p && p.system === "FR" && p.grade) {
      if (q.traps) q = { ...q, traps: q.traps.filter((t) => !horsFRTexte(p.grade, String(t.m || ""))) };
      if (q.hints) q = { ...q, hints: q.hints.filter((h) => !horsFRTexte(p.grade, String(h || ""))) };
      if (q.hint && horsFRTexte(p.grade, String(q.hint))) q = { ...q, hint: plainTeX(typeof HINTS_FR_COL !== "undefined" && HINTS_FR_COL[id] && !horsFRTexte(p.grade, HINTS_FR_COL[id]) ? HINTS_FR_COL[id] : HINTS[id] && !horsFRTexte(p.grade, HINTS[id]) ? HINTS[id] : "Relis l'énoncé et fais un calcul à la fois.") };
    }
    if (p && p.system === "FR" && typeof frLocal === "function") {
      const SKIP = new Set(["spec", "canon", "code", "id", "ctx", "e", "expr", "values", "value"]);
      /* copies (jamais de modification en place : une question peut partager des objets avec les tables communes) */
      const loc = (v, d) => typeof v === "string" ? (typeof frIdTxt === "function" && !/^\s*<svg/.test(v) ? frIdTxt(id, frLocalQ(v), p.grade) : frLocalQ(v)) : d > 6 || !v || typeof v !== "object" ? v : Array.isArray(v) ? v.map((x) => loc(x, d + 1))
        : Object.getPrototypeOf(v) !== Object.prototype ? v : Object.fromEntries(Object.entries(v).map(([k, x]) => [k, SKIP.has(k) ? x : loc(x, d + 1)]));
      q = loc(q, 0);
    }
    return q;
  },
  make(state, id, d, seed, vary) {
    let level = d || this.difficulty(state, id);
    const asked = level; /* 25.11 : niveau demandé (carnet, baisse après erreur) ; le contenu peut être remonté ci-dessous */
    const keep = (q) => { if (q && typeof q === "object" && q.d && q.d !== 4 && asked !== 4) q.d = asked; return q; };
    /* 25.11 (audit de niveau 11e, tools/niveau_11.md ; règle de l'enseignant du 24.11 : le niveau 1 = automatismes de
       l'année, jamais ceux d'une année inférieure) : notions de 9e-10e reprises en 11e (CO). Leur niveau 1 est un
       automatisme de 9e-10e (« 3x + 9 = 33 », « calcule 4 - 5x pour x = -4 », « 3/4 de 200 CHF ») : en 11e, le niveau 1
       tire les formes du niveau 2 (le code de la question reste reproductible : …-2-…). La 9e et la 10e ne changent pas.
       rel n'y est pas : son niveau 2 tire déjà le niveau 3 en 11e (UP2 ci-dessous). */
    const UP11 = ["prio", "fracadd", "fracconv", "fracmul", "fracops", "puiss", "sci", "scicalc", "rac", "carres", "pyth", "pythfig", "vol",
      "vitesse", "valnum", "litelab", "reduire", "monomes", "distrib", "eq1", "eqfrac", "probeq", "affine", "repere", "tabval", "pctvar"];
    if (level === 1 && UP11.includes(id) && state && state.profile && state.profile.system === "CH" && state.profile.track !== "mp" && state.profile.grade === 11) level = 2;
    /* 25.11 (audit de niveau MP 1re–2e, tools/niveau_mp12.md) : notions du CO reprises en maturité professionnelle. Leur
       niveau 1 est un automatisme de 9e–11e (« (−4) · 2 », « 3/4 = 24/? », « (x − 8)(x + 1) = 0 », « f(5) pour f(x) = −2x + 3 ») ;
       les épreuves CFPT (base Maurizio) commencent au niveau 2 (chaînes de fractions, puissances à changer de base, systèmes
       à coefficients quelconques). En MP, le niveau 1 tire le niveau 2 ; le niveau 2 ne monte pas (la MP n'est pas le
       Collège, UPC ci-dessous ne s'applique pas à la filière mp). Les notions propres au PEE MP gardent leur niveau 1,
       de même que reduire, idrem, factor, sci, scicalc et racprop : leurs questions de niveau 1 sont celles qui ouvrent les épreuves
       CFPT de MP 1re (Test S1.1 Q7, Test S1.3 Q1 « factorisations directes », Récit 2 ex. 1). */
    const UPMP = {
      12: ["prio", "rel", "arith", "fracadd", "fracmul", "fracsimp", "fracconv", "fracops", "puiss", "rac", "premiers", "divcrit", "pctvar",
        "monomes", "distrib", "parenth", "formule", "eq1", "eqfrac", "probeq", "eq2", "eq2fact", "sys2", "sysprob", "pyth", "pythfig", "pythrec",
        "thales", "angles", "cercthales", "geocomb"],
      13: ["affine", "modaff", "affzero", "droitesinter"],
    };
    if (level === 1 && state && state.profile && state.profile.system === "CH" && state.profile.track === "mp" && (UPMP[state.profile.grade] || []).includes(id)) level = 2;
    /* 25.11 (audit de niveau 9e–10e, tools/niveau_910.md) : en 9e, le niveau 1 de ces notions était un automatisme du
       primaire (« chiffre des unités de 98,245 », « le plus grand de 5,9 et 5,96 », périmètre d'un triangle 3-7-9, aire d'un
       carré de côté 9, faces d'un pavé, périmètre d'un losange) : il tire les formes du niveau 2. La 10e et la 11e ne changent pas. */
    const UP9 = ["decread", "deccomp", "perim", "aire1", "solides", "quadri"];
    if (level === 1 && UP9.includes(id) && state && state.profile && state.profile.system === "CH" && state.profile.track !== "mp" && state.profile.grade === 9) level = 2;
    /* 28.11 (audit de niveau 10e, tools/niveau_910.md § 3 ; plan de cheminement 10e : « révision nombres décimaux »,
       fractions et arithmétique au chapitre 3, solides au chapitre 4) : notions de 9e reprises en 10e. Leur niveau 1 (et
       parfois 2) est un automatisme de 9e ou du primaire (« 37 − 16 : 2 », « PGDC de 35 et 40 », « 1/6 + 2/6 »,
       « 18,70 + rendu sur 20 CHF », « (−9) + (−4) », « sommets d'un pavé », « 4 cahiers coûtent 32 CHF ») : en 10e,
       niveau minimal UP10[id] (le code de la question reste reproductible : …-2-…). La 9e et la 11e ne changent pas. */
    const UP10 = { prio: 2, arith: 2, premiers: 2, fracadd: 2, fracsimp: 2, fracrep: 2, fracconv: 2, fractout: 2, decmul: 2, decdiv: 2,
      ordgr: 2, aire3: 2, solides: 2, numer: 2, decadd: 3, reladd: 3, prop: 3 };
    if (level < 4 && UP10[id] && level < UP10[id] && state && state.profile && state.profile.system === "CH" && state.profile.track !== "mp" && state.profile.grade === 10) level = UP10[id];
    // Notions de révision trop faciles au niveau 2 pour les grandes classes (21.11, « relève le niveau 2 pour la 11e ») :
    // dès la classe indiquée, le niveau 2 tire les formes du niveau 3 (le code de la question reste reproductible : …-3-…).
    const UP2 = { rel: 11 };
    if (level === 2 && UP2[id] && state && state.profile && state.profile.grade >= UP2[id]) level = 3;
    /* 24.11 (audit de niveau 1re Collège, tools/niveau_1c.md ; alerte de l'enseignant : « on demande à un élève de 1re ce qu'on
       demanderait à un élève de 9e ») : notions du CO reprises au Collège (1re–4e, filière gymnasiale). Leur niveau 1 est un
       automatisme de 9e–10e : au Collège, le niveau 1 tire le niveau 2 et le niveau 2 le niveau 3 ; UPC_MIN impose un niveau minimal. */
    if (level < 3 && state && state.profile && state.profile.system === "CH" && state.profile.track !== "mp" && state.profile.grade >= 12) {
      if (UPC_MIN[id]) level = Math.max(level, UPC_MIN[id]); else if (UPC.includes(id)) level += 1;
    }
    /* 25.11 (couverture France, tools/france_couverture.md) : même règle pour un profil français (le niveau 1 = automatismes
       de l'année) : UPFR (src/fr_couv.js) = { classe FR : { notion : niveau minimal } } pour les notions reprises d'une année
       inférieure, calibré sur le DNB (partie 1) et l'épreuve anticipée de 1re. Sans effet pour un profil suisse. */
    if (level < 3 && state && state.profile && state.profile.system === "FR" && typeof UPFR !== "undefined" && UPFR[state.profile.grade] && UPFR[state.profile.grade][id]) level = Math.max(level, UPFR[state.profile.grade][id]);
    /* 25.11 (audit France) : profil français, énoncé propre à la Suisse (horsCO) : graine suivante (le code suit la question). */
    if (seed && state && state.profile && state.profile.system === "FR") { let q = this.build(id, level, seed); for (let k = 1; k <= 40 && horsCO(state, id, q); k++) q = this.build(id, level, seed + k * 977); /* 26.11 p3 : 40 graines (formes hors programme FR filtrées par le texte) */
      /* 26.11 (revue p5, n° 1 : carnet de 4e FR « Factorise x² − 64 ») : aucune forme du niveau au programme de la classe → niveau inférieur */
      if (horsCO(state, id, q) && level > 1) return this.make(state, id, level - 1, seed);
      return keep(this.finalize(state, id, q)); }
    /* 26.11 : forme réservée à la France (q.fr, p. ex. médiane en 4e–3e FR, src/fr_couv.js) tirée pour un autre profil : graine suivante. */
    if (seed) { let q = this.build(id, level, seed); for (let k = 1; k <= 12 && q && q.fr && horsCO(state, id, q); k++) q = this.build(id, level, seed + k * 977); return keep(this.finalize(state, id, q)); }
    const rec = ((state.recentQ = state.recentQ || {})[id] = (state.recentQ[id] || []));
    const key = (q) => { let h = 0; for (const c of String(q.q) + JSON.stringify(q.spec)) h = (h * 31 + c.charCodeAt(0)) | 0; return h; };
    let q;
    // Contextes variés (règle du 14.11) : un contexte (q.ctx) vu dans les 2 dernières questions de la notion est évité.
    const ctxs = ((state.recentCtx = state.recentCtx || {})[id] = (state.recentCtx[id] || []));
    // Formes variées (14.11, « les questions doivent absolument être variées ») : la forme d'une question
    // (son énoncé aux nombres près) vue dans les 2 dernières questions de la notion est évitée quand c'est possible.
    const forms = ((state.recentForm = state.recentForm || {})[id] = (state.recentForm[id] || []));
    /* 26.11 (revue élèves : « On carrelle une pièce… » 3 fois en 4 jours, 2 fois le même jour) : un problème (niveau 4) dont
       le contexte (ctx, sinon les premiers mots de l'énoncé) a été vu dans les 7 derniers jours, sur cette notion ou une
       autre, est évité ; s'il n'y en a pas d'autre, on pose une question de niveau 3. */
    const pKey = (x) => x && x.spec && x.spec.kind === "multi" ? "p:" + (x.ctx || String(x.q).replace(/\\\(.*?\\\)|<[^>]*>/g, " ").replace(/[^A-Za-zÀ-ÿ' ]/g, " ").trim().split(/\s+/).slice(0, 4).join(" ").toLowerCase()) : null;
    const cday = (state.ctxDay = state.ctxDay || {}), lim = addDays(day(), -6), stale = (x) => { const k = pKey(x); return !!(k && cday[k] && cday[k] >= lim) || sceneStale(state, sceneKey(x)); };
    /* 27.11 (décision de l'enseignant, n° 24 : Hugo, 6e FR faible, défi du jour en 4 parties, 6 min) : élève sous la moyenne
       de sa classe (belowClass, comme autoN) ou en grande difficulté : un problème de 2 ou 3 parties au plus (shortProb). */
    const short4 = level === 4 && this.weak4(state), long4 = (x) => short4 && !!x && x.d === 4 && Array.isArray(x.parts) && x.parts.length > 3;
    let found = false, fresh1 = null, lastOk = null, lv = level;
    /* 25.11 : une forme hors programme de la classe (HORS_CO, 9e–10e) est refaite ; si le niveau n'a plus aucune forme
       du programme (défi d'une autre année), on descend d'un niveau. */
    for (let k = 0, t = 0; k < 16 && !found && t < 60; t++) {
      if (t && t % 15 === 0 && !lastOk && lv > 1) lv -= 1; /* 26.11 : on descend jusqu'au niveau 1 (quartiles en 4e FR : niveaux 2 et 3 hors programme) */
      q = this.build(id, lv);
      if (horsCO(state, id, q) || long4(q)) continue;
      k++; lastOk = q;
      const fresh = !rec.includes(key(q)) && !(q.ctx && ctxs.includes(q.ctx)) && !stale(q);
      if (fresh && !forms.includes(qForm(q))) found = true;
      else if (fresh && !fresh1) fresh1 = q;
    }
    if (!found && fresh1) q = fresh1; // une seule forme possible : au moins une question jamais vue
    else if (!found && lastOk) q = lastOk;
    if (vary && stale(q) && level === 4) return this.make(state, id, 3); /* vary : séance ordinaire (pas le problème de la semaine) */
    if (pKey(q)) { for (const k in cday) if (cday[k] < lim) delete cday[k]; cday[pKey(q)] = day(); }
    sceneNote(state, sceneKey(q));
    rec.push(key(q)); state.recentQ[id] = rec.slice(-15);
    /* 28.11 (audit de niveau 10e) : la mémoire garde les 2 DERNIÈRES questions de la notion, avec ou sans ctx (règle du 14.11).
       Avant, seules les questions à ctx y entraient : dans une notion où une ou deux formes ont un ctx et les autres non
       (aire3, fracrep…), ces formes restaient « vues » indéfiniment et n'étaient presque plus tirées (1 fois sur 60). */
    state.recentCtx[id] = [...ctxs, q.ctx || ""].slice(-2);
    state.recentForm[id] = [...forms, qForm(q)].slice(-2);
    return keep(this.finalize(state, id, q));
  },
  // Question reproductible : même notion, niveau et graine → même question.
  build(id, level, seed) {
    seed = seed || Math.floor(Math.random() * 46655) + 1;
    R.seed(seed * 7919 + level * 104729 + [...id].reduce((a, c) => a + c.charCodeAt(0), 0));
    const code = id + "-" + level + "-" + seed.toString(36);
    // Écritures maladroites des générateurs (audit 13.11) : « 1x » → « x », « + -2 » → « - 2 », « - -3 » → « + 3 ».
    /* 26.11 (revue élèves, B11 : corrigé « −1L + 2l = 2 ») : « -1L » → « -L » aussi (inconnues majuscules), et les défis passent par tidy. */
    const tidy = (t) => typeof t !== "string" ? t : t.replace(/([(=+\-\s{]|\\\()(-?)1([a-z])(?![a-z{])/g, "$1$2$3").replace(/([(=+\s{]|\\\()-1([A-Z])(?![a-zA-Z{])/g, "$1-$2").replace(/\+\s*-\s*(?=[\da-z(\\])/g, "- ").replace(/-\s*-\s*(?=[\da-z(\\])/g, "+ ")
      /* 26.11 (revue p3, n° 11 : « 2(x + 2)(x) », « (x)(x − 6) = 0 ») : facteur x écrit en tête, sans parenthèses */
      .replace(/(^|[^\w)}'′\\])(-?(?:\d+|[ak])?)((?:\([^()]*\)){2,})/g, (m, b, c, g) => { const fs = g.match(/\([^()]*\)/g); if (fs.filter((f) => f === "(x)").length !== 1 || fs.length < 2 || /\\|∘/.test(g)) return m; return b + c + "x" + fs.filter((f) => f !== "(x)").join(""); });
    /* 25.11 : PROBX (variantes.js, audit 9e–10e) = défis ajoutés, réservés à certaines classes (p.co). */
    if (level === 4 && hasProb(id)) { const p = moneyQ(R.pick(probList(id).concat((typeof PROBX !== "undefined" && PROBX[id]) || []))()); /* 26.11 : TeX visible hors formule (plainTeX, generators.js) */
      const P = { ...p, q: tidy(plainTeX(p.q)), sol: tidy(plainTeX(p.sol)), hints: (p.hints || []).map(plainTeX) }; if (p.parts) P.parts = p.parts.map((x) => ({ ...x, label: plainTeX(x.label) }));
      return { ...P, id, d: 4, seed, code, spec: { kind: "multi" }, hint: P.hints[0] }; }
    // Pas de question triviale (règle du 14.11 : la trivialité fait décrocher) : tirage refait, de façon
    // déterministe (même code → même question), jusqu'à 6 essais ; le dernier est gardé quoi qu'il arrive.
    let q, keep = null;
    for (let k = 0; k < 6; k++) {
      if (k) R.seed(seed * 7919 + level * 104729 + [...id].reduce((a, c) => a + c.charCodeAt(0), 0) + k * 15485863);
      // Variantes (variantes.js) : la forme d'origine ou une forme ajoutée, au hasard.
      /* 25.11 : VARX (variantes.js, audit 9e–10e) = formes ajoutées qui survivent aux modules de chapitre (ils vident VAR[id]). */
      const vs = [].concat((typeof VAR !== "undefined" && VAR[id] && VAR[id][level]) || [], (typeof VARX !== "undefined" && VARX[id] && VARX[id][level]) || []), vk = vs.length ? Math.floor(R.rand() * (vs.length + 1)) : 0;
      q = vk ? vs[vk - 1]() : GEN[id](level);
      q.q = tidy(q.q); q.sol = tidy(q.sol);
      if (trivialQ(q, k)) continue;
      if (!answerShown(q)) { keep = null; break; }
      if (!keep) keep = q; // non triviale mais réponse visible : gardée en réserve
    }
    if (keep) q = keep;
    q = moneyQ(q); /* 26.11 : « 2,50 CHF » */
    if (q.guide) q.guide = q.guide.map((g) => ({ ...g, ask: colonBreak(tidy(g.ask)), sol: colonBreak(tidy(g.sol)) }));
    q.q = colonBreak(q.q); q.sol = colonBreak(q.sol);
    if (q.traps) q.traps = q.traps.map((t) => ({ ...t, m: colonBreak(t.m) }));
    if (q.hints) q.hints = q.hints.map(colonBreak);
    if (q.traps && q.spec && q.spec.kind === "value") q.traps = q.traps.filter((t) => isFinite(t.v) && Math.abs(t.v - q.spec.value) > Math.max(q.spec.round || 0, 1e-6 * (Math.abs(q.spec.value) >= 1 ? Math.abs(q.spec.value) : Math.max(Math.abs(q.spec.value), 1e-300))));
    if (q.parts) q.parts = q.parts.map((p) => ({ ...p, label: colonBreak(tidy(p.label)) }));
    // Consigne de forme : « notation scientifique » contrôlée par le correcteur.
    if (q.spec && q.spec.kind === "value" && /notation scientifique/.test(q.q) && !/^Calcule : /.test(q.q)) {
      q.spec = { ...q.spec, sci: true };
      if (!q.canon) { const e = Math.floor(Math.log10(Math.abs(q.spec.value)) + 1e-9), a = +(q.spec.value / 10 ** e).toFixed(8); q.canon = String(a).replace(".", ",") + "*10^" + e; }
    }
    return { ...q, id, d: level, seed, code, hint: plainTeX(q.hint || HINTS[id]) };
  },
  // 25.11 : forme hors programme pour la classe de l'élève (HORS_CO, 9e–10e) ; utilisé aussi par les sujets et les QCM.
  horsCO(state, id, q) { return horsCO(state, id, q); },
  // Lecture d'un code « eq2disc-2-k3f » → question exacte (ou null).
  fromCode(code) {
    const m = /^([a-z0-9]+)-([1-4])-([a-z0-9]+)$/.exec(String(code).trim().toLowerCase());
    if (!m || !GEN[m[1]] || (m[2] === "4" && !hasProb(m[1]))) return null;
    return this.build(m[1], +m[2], parseInt(m[3], 36));
  },

  // Positionnement : premier repère rapide (5 notions vues ou en cours) ; le niveau se précise ensuite au fil des séances, en variant les thèmes, notions récentes d'abord.
  placementPlan(state) {
    const all = this.eligible(state), recent = all.filter((id) => this.isRecent(state, id));
    const ids = recent.length >= 3 ? recent : all;
    const byTheme = {};
    for (const id of ids) {
      const n = NOTIONS.find((x) => x.id === id);
      (byTheme[n.theme] = byTheme[n.theme] || []).push(n);
    }
    const pl = (n) => placeOf(n, state.profile);
    Object.values(byTheme).forEach((arr) => arr.sort((a, b) => pl(b)[0] - pl(a)[0] || pl(b)[1] - pl(a)[1]));
    const plan = [];
    while (plan.length < 5 && Object.values(byTheme).some((a) => a.length)) {
      for (const arr of Object.values(byTheme)) if (arr.length && plan.length < 5) plan.push(arr.shift().id);
    }
    return plan;
  },

  /* 27.11 (décision de l'enseignant, n° 29 ; tools/archive/eleves_faibles_26-11.md, proposition 3) : niveau de la question i du
     positionnement. La première au niveau 1 (première impression), les suivantes au niveau 2 (positionnement discriminant). */
  placementLevel(state, i) { return i === 0 ? 1 : Math.min(2, difficultyCap(state.profile)); },
  // Résultat d'une question de positionnement : true, false ou null (« je ne sais pas »).
  placementResult(state, id, ok, d = 2) {
    this.updateElo(state, id, d, ok === true ? 1 : 0);
    this.recordComp(state, id, d, ok === true ? 1 : 0);
    const s = state.notions[id];
    /* 26.11 (revue élèves : decread juste au positionnement, puis « Nouvelle notion · Lire un nombre décimal ») : une notion
       réussie au positionnement est vue, sa leçon aussi. */
    if (ok === true) Object.assign(s, { m: 0.75, box: 2, due: addDays(day(), 3), seen: Math.max(1, s.seen || 0), lessonSeen: true });
    else if (ok === false) Object.assign(s, { m: 0.3, box: 0, due: day() });
    else Object.assign(s, { m: 0.2, box: 0, due: day() });
    s.placed = true;
  },

  // Séance du jour : notions dues et fragiles d'abord, puis « en cours », puis rappels espacés.
  // Notions anciennes (avant l'année précédente) que le parcours de l'élève demande de remobiliser (24.11) :
  // 1) une notion ancienne travaillée dans l'app et ratée ; 2) les prérequis anciens d'une notion de l'année qui coince ;
  // 3) un Mathélo en forte baisse (au moins 120 points sous son meilleur des 30 derniers jours) : toutes les anciennes.
  oldNeed(state) {
    const el = this.eligible(state), old = el.filter((id) => !this.isRecent(state, id)), need = new Set();
    const coince = (s) => s.seen > 0 && (s.m < 0.45 || (s.fails || 0) >= 2);
    for (const id of old) if (coince(state.notions[id])) need.add(id);
    for (const id of el) if (!old.includes(id) && state.notions[id].seen >= 2 && coince(state.notions[id])) for (const p of PREREQ[id] || []) if (old.includes(p)) need.add(p);
    if (this.eloDrop(state)) old.forEach((id) => need.add(id));
    return need;
  },
  eloDrop(state) { const lim = addDays(day(), -30), peak = Math.max(state.elo.r, ...((state.elo.log || []).filter((x) => x[0] >= lim).map((x) => x[1]))); return peak - state.elo.r >= 120; },
  // Notion « actuelle » : année en cours ou précédente. Les plus anciennes ne reviennent qu'en remédiation.
  isRecent(state, id) {
    const pl = placeOf(NOTIONS.find((n) => n.id === id), state.profile);
    const n = NOTIONS.find((x) => x.id === id);
    if (n && n.prim) return false; /* 27.11 (agent primaire) : toujours « 🔙 Rappel », jamais dans les créneaux ordinaires */
    return pl && (pl[0] >= state.profile.grade - 1 || (state.profile.track !== "mp" && (n.again || []).includes(state.profile.grade)));
  },
  /* 27.11 (n° 32) : notions de l'année précédente (hors reprise du référentiel, « again ») que le parcours ne demande pas :
     ni ratées (travaillées, maîtrise < 0,45 ou deux échecs), ni prérequis d'une notion de l'année qui coince. Ensemble des
     notions à placer après celles de l'année (planSlots). */
  prevPenalty(state) {
    const g = state.profile.grade, el = this.eligible(state), out = new Set(), keep = new Set();
    const coince = (s) => !!s && s.seen > 0 && (s.m < 0.45 || (s.fails || 0) >= 2);
    const yearOf = (id) => { const n = NOTIONS.find((x) => x.id === id), pl = n && placeOf(n, state.profile); return !pl ? null : pl[0] === g || (state.profile.track !== "mp" && (n.again || []).includes(g)) ? 0 : pl[0] === g - 1 ? -1 : -2; };
    for (const id of el) if (yearOf(id) === 0 && state.notions[id].seen >= 2 && coince(state.notions[id])) for (const p of PREREQ[id] || []) keep.add(p);
    for (const id of el) if (yearOf(id) === -1 && !coince(state.notions[id]) && !keep.has(id)) out.add(id);
    return out;
  },
  // Toutes les notions vues sont candidates ; les anciennes sont filtrées par niveau dans oldLevels.
  pool(state, kind) {
    return this.eligible(state);
  },
  // Notion ancienne : jamais triviale. Niveau 3 ou problème, assez proche de la cible ;
  // ou niveau ≥ 2 si l'élève l'a ratée (fragile), car alors elle n'est pas triviale pour lui.
  oldLevels(state, id, levels, target) {
    const s = state.notions[id], weak = s.m < 0.45 || this.eloDrop(state); /* 24.11 : baisse du Mathélo = remédiation, niveau 2 permis */
    /* 26.11 : élève sous le plancher : niveau 1 permis, s'il n'est pas trivial pour lui */
    if (this.underFloor(state)) return levels.filter((d) => itemRating(state.profile, id, d) >= state.elo.r - 350);
    return levels.filter((d) => weak ? d >= 2 : d >= 3 && itemRating(state.profile, id, d) >= target - 150);
  },
  /* 26.11 : réussite au 1er essai récente (null avant 8 réponses) ; cible propre à l'élève ; élève sous le plancher */
  recentRate(state) { const L = state.last1 || []; return L.length >= ADAPT.min ? L.reduce((a, b) => a + b, 0) / L.length : null; },
  adapt(state, ok1) {
    state.last1 = [...(state.last1 || []), ok1 ? 1 : 0].slice(-ADAPT.win);
    const r = this.recentRate(state); if (r === null) return;
    let a = state.tadj || 0;
    if (r < ADAPT.low || (a < 0 && r < ADAPT.aim - 0.05) || (a > 0 && r < ADAPT.aim)) a -= ADAPT.down;
    else if (r > ADAPT.high || (a < 0 && r > ADAPT.aim + 0.05)) a += ADAPT.up;
    state.tadj = Math.max(ADAPT.lo, Math.min(ADAPT.hi, a));
  },
  underFloor(state) { const r = this.recentRate(state); return (state.tadj || 0) <= ADAPT.floor && r !== null && r < ADAPT.aim - 0.05; },

  // Format du jour : le plus en retard sur l'équilibre des 7 derniers jours, jamais celui de la veille.
  chooseFormat(state, exclude = [], today = day()) {
    const since = addDays(today, -7), log = (state.formats || []).filter((f) => f.date >= since && f.date < today);
    const recentRev = log.some((x) => x.f === "revision" && x.date >= addDays(today, -3));
    const yesterday = (state.formats || []).filter((f) => f.date < today).slice(-1)[0];
    const due = this.eligible(state).filter((id) => state.notions[id].due <= today).length;
    let best = null;
    for (const f of Object.keys(FORMATS)) {
      if (exclude.includes(f)) continue;
      let sc = WEEK[f] - log.filter((x) => x.f === f).length;
      if (yesterday && yesterday.f === f) sc -= 3;
      if (f === "revision") sc += due >= 4 && !recentRev ? 1 : due >= 4 ? 0 : -1;
      if (f === "defi" && !this.eligible(state).some((id) => hasProb(id) && this.isRecent(state, id))) sc -= 0.5;
      /* 26.11 (adaptivité) : élève sous le plancher : le défi du jour (un problème de niveau 4) revient moins souvent */
      if (f === "defi" && this.underFloor(state)) sc -= 1.5;
      /* 26.11 (revue p5, n° 5 : Kevin, Mathélo 928, problème de niveau 4 en 3 parties, 6:19) : élève en grande difficulté
         (struggling) : pas de défi du jour (ni annoncé au bilan « Demain : 🏔 Défi ») ; il revient quand l'élève remonte. */
      if (f === "defi" && this.struggling(state)) continue;
      /* 26.11 (revue p6, n° 15 : positionnement 6:52 puis défi de niveau 4 en 3 parties) : pas de défi le jour du positionnement */
      if (f === "defi" && state.placedOn === today) continue;
      sc += Math.random() * 0.4;
      if (!best || sc > best.sc) best = { f, sc };
    }
    return best ? best.f : "mixte";
  },

  /* 25.11 (revue « un élève joue une séance » : 4 leçons complètes + 4 questions, bien plus que 5 minutes ; principe :
     resserrer, tenir la promesse des 5 minutes). Au plus UNE leçon par séance : les notions dont la leçon reste à voir
     (lessonDue) attendent les séances suivantes, sauf une, la plus prioritaire (chapitre « en classe » d'abord, puis
     l'ordre du référentiel), placée en tête au niveau 1. La leçon prend la place d'une question (séances de 3 questions
     et plus). Révision et défi du jour : jamais de leçon (« Révision » = du déjà-vu), sauf s'il n'y a rien d'autre. */
  lessonDue(state, id) {
    const s = state.notions[id];
    return !!(s && typeof LESSONS !== "undefined" && LESSONS[id] && !s.lessonSeen && (s.status === "encours" || s.m < 0.4));
  },
  // Notion dont la leçon reste à voir et qu'on ne peut pas poser en question sans elle (encore jamais travaillée, ou en cours).
  /* 26.11 soir (revue des élèves joués, n° 1, grave : chapitre « en classe » de l'année jamais travaillé, ses notions étant
     exclues de Révision, Défi et Automatismes tant que leur leçon n'était pas vue) : une notion du chapitre choisi « en
     classe » a été vue en classe ; elle se pose sans sa leçon. Sa leçon (active si elle existe) reste prioritaire pour
     l'unique leçon d'une séance qui en admet une (lessonPick), et le rappel de cours reste ouvrable dans chaque question. */
  nowHas(state, id) { return this.nowActive(state) && state.now.ids.includes(id); },
  lessonFirst(state, id) { const s = state.notions[id]; return this.lessonDue(state, id) && (!s.seen || s.status === "encours") && !this.nowHas(state, id); },
  /* 27.11 après-midi (agent élèves faibles, re-mesure : un élève en grande difficulté recevait plus de leçons par séance
     que l'élève fort, 0,42 contre 0,28, ses notions ratées gardant leur leçon due ; principe : moins de notions nouvelles
     pour un élève qui échoue). Élève en grande difficulté (struggling) : pas de nouvelle leçon tant que la notion de la
     dernière leçon n'a pas été réussie une fois du premier coup depuis (au plus 4 questions et 7 jours d'attente, pour ne
     jamais bloquer) ; en attendant, séances sans leçon (notions déjà travaillées). Autres élèves : règle inchangée.
     Essayé aussi « pas de leçon le lendemain d'une leçon » : rien de plus chez les faibles, moins de leçons chez les moyens. */
  lessonHold(state) {
    if (!this.struggling(state)) return false;
    let last = null;
    for (const s of Object.values(state.notions)) if (s && s.lessonDay && (!last || s.lessonDay > last.lessonDay)) last = s;
    if (!last) return false;
    return (last.ok || 0) <= (last.lessonOk0 || 0) && (last.seen || 0) - (last.lessonN0 || 0) < 4 && last.lessonDay >= addDays(day(), -7);
  },
  lessonPick(state, ids) {
    const now = this.nowActive(state) ? state.now.ids : [], s = (id) => state.notions[id];
    const key = (id) => (now.includes(id) ? 0 : s(id).status === "encours" ? 1 : 2) * 1e5 + (s(id).status === "encours" || now.includes(id) ? this.rank(state.profile, id) : Math.round(s(id).m * 1000));
    return [...ids].sort((a, b) => key(a) - key(b))[0] || null;
  },
  /* 26.11 soir (revue des élèves testeurs, n° 7 : positionnement 5:10 puis 6 automatismes en 6:05, 12 minutes le premier
     jour) : série d'automatismes de 3 calculs le jour du positionnement, de 4 pour un élève sous le plancher, sinon 6. */
  /* 26.11 (revue p4, n° 3 : 9e très faible, série de 6 automatismes en 9:58) : 4 aussi pour un élève en grande difficulté
     encore en calibrage (au moins 5 réponses récentes, moins de 55 % justes du premier coup), avant que underFloor ne s'établisse. */
  struggling(state) { const L = state.last1 || [], r = L.length ? L.reduce((a, b) => a + b, 0) / L.length : 1;
    /* pendant le calibrage, moins de 5 réponses : positionnement arrêté sur 3 ratés (placeMiss) et pas de réussite franche depuis */
    return this.underFloor(state) || (L.length >= 5 && r < ADAPT.low) || (L.length < 5 && state.elo.n < 20 && (state.placeMiss || 0) >= 3 && r < 0.75); },
  /* 26.11 (revue p5, n° 5 : Kevin, jour 1 = positionnement + série de 3 avec deux pas à pas, 13 min) : le jour du positionnement,
     élève en grande difficulté : 2 questions (jour 1 ≈ 10 minutes). */
  /* 27.11 (revue, n° 5 : MP 2e, positionnement 5:46 puis Révision de 3 questions de niveau 3, 11:07 le premier jour) :
     le jour du positionnement, première séance de 2 questions, niveau 2 au plus (firstDayCap). */
  firstDayN(state) { return 2; },
  firstDayCap(state, plan) {
    if (!plan || state.placedOn !== day()) return plan;
    const out = plan.slice(0, this.firstDayN(state)).map((e) => { const x = String(e).split("|"); if (!/^PROB:/.test(x[0]) && +x[1] > 2) x[1] = "2"; return x.join("|"); });
    return Object.assign(out, plan.noLesson ? { noLesson: true } : {});
  },
  /* 26.11 (revue p6, n° 15 : Hugo, 6e faible, série de 6 automatismes en 6:37 avec deux pas à pas) : élève sous la moyenne
     de la classe : Mathélo sous la valeur de départ de sa classe (Engine.newState : élève moyen), ou
     moins de 70 % de réussites du premier coup sur ses 5 dernières réponses au moins. */
  belowClass(state) {
    const h = harmos(state.profile.system, state.profile.grade), r0 = 700 + (h - 8) * 150 + 100, L = state.last1 || [];
    return state.elo.r + (state.tadj || 0) < r0 || (L.length >= 5 && L.reduce((a, b) => a + b, 0) / L.length < ADAPT.aim);
  },
  /* 27.11 (décision de l'enseignant, n° 24) : élève faible au sens de autoN (sous la moyenne de sa classe ou en grande
     difficulté) : défi du jour limité à un problème de 2 ou 3 parties. shortProb : la notion a un tel problème pour ce profil. */
  weak4(state) { return !!(state && state.profile && state.elo) && (this.struggling(state) || this.belowClass(state)); },
  shortProb(state, id) {
    const c = (this._short = this._short || {}), k = [state.profile.system, state.profile.grade, state.profile.track, state.profile.niv, id].join("|");
    if (!(k in c)) { c[k] = false; for (let s = 1; s <= 24 && !c[k]; s++) { try { const q = this.build(id, 4, s); if (q && q.d === 4 && Array.isArray(q.parts) && q.parts.length >= 2 && q.parts.length <= 3 && !horsCO(state, id, q)) c[k] = true; } catch (e) { break; } } }
    return c[k];
  },
  autoN(state) { return state.placedOn === day() ? this.firstDayN(state) : this.struggling(state) || this.belowClass(state) ? 4 : FORMATS.auto.slots.length; },
  fmtText(state, f) { const n = f === "auto" ? this.autoN(state) : 0; return n && n < FORMATS.auto.slots.length ? n + " calculs rapides, enchaînés." : FORMATS[f].text; },
  planSession(state, format) { return this.firstDayCap(state, this.ownYear(state, this.planSession0(state, format), format)); },
  /* 27.11 (revue des élèves joués, n° 4 : Arthur, 10e moyen sans chapitre « en classe », 13 questions sur 13 sur des reprises
     de 9e ; les notions propres à la 10e ouvertes attendaient leur leçon, une seule leçon par séance, aucune en Révision ni
     en Automatismes) : sans chapitre choisi, au moins une notion PROPRE à l'année (placeOf = classe) par séance de 3
     questions ou plus. Si le programme n'en a aucune, une question du milieu (sinon la dernière) qui n'est pas une reprise demandée par le parcours
     (ratée : maîtrise < 0,45 ou deux échecs) devient une notion propre à l'année déjà ouverte, choisie comme les autres
     (planSlots) ; si sa leçon reste à voir, au niveau 1 et sans leçon (comme une notion du chapitre en classe, n° 5 du
     26.11), le rappel de cours restant ouvrable ; sa leçon vient à la séance qui en admet une. Élève en grande difficulté ou
     Mathélo en forte baisse : rien ne change (règle levée, comme prevPenalty). */
  ownYear(state, plan, format) {
    if (!Array.isArray(plan) || plan.length < 3 || this.nowActive(state) || this.struggling(state) || this.eloDrop(state) || state.placedOn === day()) return plan;
    const g = state.profile.grade, idOf = (e) => String(e).split("|")[0];
    const own = (id) => { const n = NOTIONS.find((x) => x.id === id), pl = n && placeOf(n, state.profile); return !!pl && pl[0] === g && !n.prim; };
    if (plan.some((e) => own(idOf(e)))) return plan;
    const coince = (id) => { const s = state.notions[id]; return !!s && s.seen > 0 && (s.m < 0.45 || (s.fails || 0) >= 2); };
    /* au milieu de la séance plutôt qu'à la fin (une notion moins travaillée en dernier faisait finir sur un échec) */
    let at = -1;
    for (const j of [...Array(plan.length).keys()].slice(1, -1).concat(plan.length - 1)) if (at < 0 && !String(plan[j]).startsWith("PROB:") && !coince(idOf(plan[j])) && !this.lessonDue(state, idOf(plan[j]))) at = j;
    if (at < 0) return plan;
    const kind = String(plan[at]).split("|")[2] || "app", inPlan = new Set(plan.map(idOf));
    /* 27.11 (décision de l'enseignant, n° 33 : ownYear posait une notion de l'année jamais vue, sans sa leçon, dans les
       séances sans leçon, 0,1 à 0,6 par séance au testeur) : seulement une notion de l'année déjà travaillée (seen > 0). */
    const vue = (id) => !!state.notions[id] && state.notions[id].seen > 0;
    const ex = new Set(this.eligible(state).filter((id) => !own(id) || inPlan.has(id) || !vue(id)));
    const b = this.planSlots(state, [kind], { exclude: ex })[0];
    if (!b) return plan;
    const x = b.split("|"), les = this.lessonDue(state, x[0]);
    /* séance qui montre une leçon : une notion dont la leçon reste à voir n'y entre pas (une seule leçon par séance) */
    if (les && !plan.noLesson && format !== "auto" && (format || this.todayFormat(state)) !== "auto") return plan;
    if (les) x[1] = "1";
    plan[at] = x.join("|");
    return plan;
  },
  planSession0(state, format) {
    /* 26.11 (revue p4, n° 3) : le jour du positionnement, 3 questions au plus quel que soit le format (positionnement + séance ≈ 10 min) ; */
    const f = format || this.todayFormat(state), slots = f === "auto" ? FORMATS.auto.slots.slice(0, this.autoN(state)) : FORMATS[f].slots.slice(0, state.placedOn === day() ? this.firstDayN(state) : this.struggling(state) ? 3 : 9); /* et pour l'élève en grande difficulté (Kevin : Révision de 4 questions avec pas à pas, 8 à 9 min) */
    const el = this.eligible(state), pend = el.filter((id) => this.lessonFirst(state, id));
    /* 26.11 soir (n° 1) : notions du chapitre « en classe » dont la leçon reste à voir : posées sans leçon (lessonFirst),
       mais candidates à la leçon de la séance. Révision, Défi, Automatismes : jamais de leçon (plan.noLesson). */
    const nowLes = el.filter((id) => this.nowHas(state, id) && this.lessonDue(state, id));
    const noLes = (p) => Object.assign(p, { noLesson: true });
    if (!pend.length && !nowLes.length) return this.planSlots(state, slots);
    const exclude = new Set(pend);
    /* 27.11 après-midi : élève en grande difficulté qui attend sa prochaine leçon (lessonHold) : séance sans leçon */
    if (f !== "auto" && this.lessonHold(state)) { const p = this.planSlots(state, slots, { exclude }); if (new Set(p.map((e) => String(e).split("|")[0])).size >= Math.min(2, p.length) && p.length) return noLes(p); } /* au moins 2 notions déjà travaillées, sinon la règle ordinaire */
    if (f === "revision" || f === "defi") { const p = this.planSlots(state, slots, { exclude }); if (p.length) return noLes(p); }
    /* 26.11 (revue d'un testeur, jour 3) : jamais de leçon dans une série d'automatismes ; sans notion déjà travaillée,
       les questions viennent sans leçon (l'app ne montre pas de leçon dans ce format). */
    if (f === "auto") { const p = this.planSlots(state, slots, { exclude }); return p.length ? p : this.planSlots(state, slots); }
    const keep = this.lessonPick(state, [...pend, ...nowLes]);
    exclude.add(keep);
    const rest = slots.length >= 3 ? slots.slice(1, -1) : slots.slice(1);
    const k0 = slots[0] === "defi4" ? "defi" : slots[0];
    const out = [keep + "|1|" + k0, ...this.planSlots(state, rest, { exclude })];
    /* 26.11 (revue élèves, C6 : leçon + 1 question, séance d'une minute) : s'il manque des notions déjà travaillées, la
       notion de la leçon complète la séance (niveau 1 puis 2). */
    while (slots.length >= 3 && out.length < slots.length - 1) out.push(keep + "|" + Math.min(2, out.length) + "|" + (rest[0] === "defi4" ? "defi" : rest[0] || "app"));
    return out;
  },
  // Séance déjà tirée (mode libre…) : une seule notion à leçon, en tête au niveau 1 ; les autres sortent. n : nombre de questions visé.
  oneLesson(state, plan, n) {
    const idOf = (e) => String(e).split("|")[0], pend = plan.map(idOf).filter((id) => state.notions[id] && this.lessonDue(state, id));
    if (!pend.length) return plan.slice(0, n);
    /* 27.11 après-midi : élève en grande difficulté qui attend sa prochaine leçon (lessonHold) : les notions à leçon sortent */
    if (this.lessonHold(state)) { const r = plan.filter((e) => !pend.includes(idOf(e))); if (r.length) return r.slice(0, n); }
    const keep = this.lessonPick(state, pend), e0 = plan.find((e) => idOf(e) === keep).split("|");
    const rest = plan.filter((e) => !pend.includes(idOf(e)));
    return [[keep, 1, ...e0.slice(2)].join("|"), ...rest].slice(0, Math.max(1, n - 1));
  },
  // Format retenu pour aujourd'hui (stable dans la journée, sauf « Autre format »).
  todayFormat(state) {
    const today = day();
    // Format annoncé la veille au bilan (21.11) : promesse tenue.
    if (!state.today || state.today.date !== today) state.today = { date: today, f: state.tomorrow && state.tomorrow.date === today && FORMATS[state.tomorrow.f] && !(state.tomorrow.f === "defi" && this.struggling(state)) /* revue p5, n° 5 */ ? state.tomorrow.f : this.chooseFormat(state) };
    /* revue p6, n° 15 : format tiré avant la fin du positionnement : pas de défi ce jour-là */
    if (state.today.f === "defi" && state.placedOn === today) state.today.f = this.chooseFormat(state, ["defi"]);
    return state.today.f;
  },
  // Format de demain, choisi dès aujourd'hui et annoncé au bilan (21.11).
  tomorrowFormat(state) {
    const tm = addDays(day(), 1);
    if (!state.tomorrow || state.tomorrow.date !== tm) state.tomorrow = { date: tm, f: this.chooseFormat(state, [], tm) };
    return state.tomorrow.f;
  },
  // « Changer de format » : toujours le même ordre (défi → automatismes → applications → mixte → révision → défi…), demande du 19.11.
  otherFormat(state) {
    const cur = this.todayFormat(state), order = Object.keys(FORMATS);
    state.today = { date: day(), f: order[(order.indexOf(cur) + 1) % order.length] };
    return state.today.f;
  },
  // Trace du format fait (pour l'équilibre sur 7 jours).
  logFormat(state, f) {
    const today = day();
    state.formats = (state.formats || []).filter((x) => x.date >= addDays(today, -30));
    if (!state.formats.some((x) => x.date === today && x.f === f)) state.formats.push({ date: today, f });
  },

  // Remplit des créneaux : pour chacun, la notion ET le niveau les plus proches de la cible fixée par le Mathélo.
  planSlots(state, slots, opts = {}) {
    const today = day(), elo = state.elo.r + (state.tadj || 0) /* 26.11 : cible propre à l'élève */, cap = difficultyCap(state.profile), used = new Set(), plan = [], ex = opts.exclude || new Set();
    const under = slots.length >= 3 && this.underFloor(state), maxOld = slots.includes("rev") || under ? 2 : 1;
    let old = 0;
    // Créneau « Rappel » : une notion ancienne, jamais triviale. Une séance sur trois environ ;
    // en révision, chaque fois qu'une notion ancienne est fragile. Sans candidate valable : créneau normal.
    // 24.11 (règle de l'auteur : « c'est le parcours de l'élève qui dicte s'il y a besoin de remobiliser des compétences
    // antérieures ») : plus de rappel tiré au hasard ; une notion ancienne ne revient que si le parcours le justifie.
    const need = [...this.oldNeed(state)];
    const wantRappel = slots.length > 1 && need.length > 0;
    const rappelAt = wantRappel ? slots.length - 1 - Math.floor(Math.random() * Math.min(2, slots.length)) : -1;
    /* 26.11 : sous le plancher, un 2e rappel possible (l'autre des deux derniers créneaux) */
    const rappel2 = wantRappel && under ? (rappelAt === slots.length - 1 ? slots.length - 2 : slots.length - 1) : -1;
    // « En ce moment en classe » : environ 2 créneaux sur 3 portent sur le chapitre choisi par l'élève.
    const nowIds = this.nowActive(state) ? state.now.ids.filter((id) => state.notions[id] && ["vu", "encours"].includes(state.notions[id].status)) : [];
    const nowK = nowIds.length ? (slots.length === 1 ? 1 : Math.round((slots.length * 2) / 3)) : 0;
    /* 27.11 (décision de l'enseignant, n° 32 ; tools/archive/eleves_faibles_26-11.md : sans chapitre « en classe », 78 à 83 % des
       questions d'un élève moyen de 10e–1re portaient en novembre sur l'année précédente) : sans chapitre choisi, les
       notions de l'année déjà ouvertes passent d'abord ; une notion de l'année précédente ne revient en tête que si le
       parcours le demande (prevPenalty). Élève en grande difficulté ou Mathélo en forte baisse : règle levée. */
    const prevPen = !this.nowActive(state) && !this.struggling(state) && !this.eloDrop(state) ? this.prevPenalty(state) : null;
    const usedPair = new Set(), cnt = new Map(), weak4 = this.weak4(state);
    /* 26.11 soir (revue des élèves joués, n° 2 : 5 × la même notion dans une série d'automatismes quand le chapitre en
       classe n'en offre qu'une ou deux) : une notion au plus 2 fois par séance ; un créneau « chapitre » sans notion
       possible redevient un créneau normal ; la limite ne se lève qu'à défaut de toute autre notion (free). */
    const choose = (kind, base, rappel, only, isNow, free) => {
      let best = null, pool = only || this.pool(state, base);
      if (kind === "rev" && !only) { const due = pool.filter((id) => state.notions[id].due <= today || state.notions[id].m < 0.5); if (due.length) pool = due; }
      for (const id of pool) {
        if (ex.has(id)) continue;
        if (!free && (cnt.get(id) || 0) >= 2) continue;
        const s = state.notions[id], recent = this.isRecent(state, id), target = elo + TARGET[kind] + (s.easy || 0) * 120;
        /* 26.11 (profondeur, tools/archive/adaptivite_26-11.md) : une notion du chapitre « en classe » passe toujours par le créneau du
           chapitre, même reprise d'une année précédente (1re du Collège : Pythagore, angles…), à un niveau non trivial (oldLevels) */
        if (!isNow && (rappel ? recent : !recent)) continue; /* les anciennes notions ne passent que par le créneau Rappel */
        if (kind === "drill" && !this.drillable(state, id)) continue; /* 26.11 : notion sans vrai automatisme au niveau 1 */
        let levels = [1, 2, 3].filter((d) => d <= cap && (base !== "defi" || d >= 2) && (kind !== "drill" || d === 1)); /* 26.11 : automatisme = niveau 1 */
        if ((kind === "defi4" || kind === "defi") && hasProb(id) && (!weak4 || this.shortProb(state, id))) levels.push(4); /* 27.11, n° 24 */
        if (!recent) levels = this.oldLevels(state, id, levels, target);
        /* 26.11 soir (revue des élèves testeurs, n° 9 : élève forte, Révision de 4 questions de niveau 1, +12 à +15 chacune) :
           en Révision, un élève dont le Mathélo atteint le niveau 2 de la notion (et qui ne l'a pas ratée) n'a plus de niveau 1. */
        /* 26.11 (revue p3, n° 13, D5 : Inès, Mathélo 1508, intervalle au niveau 1 ; Sami, MP 2e, priorités de 9e au niveau 1) :
           même règle dans tous les formats, sauf le créneau d'automatisme (niveau 1 : décision de l'enseignant du 26.11, n° 12,
           tests/decisions26.html) : minLevel. */
        if (kind !== "drill" && levels.some((d) => d >= 2) && this.minLevel(state, id) >= 2) levels = levels.filter((d) => d >= 2);
        for (const d of levels) {
          let sc = Math.abs(itemRating(state.profile, id, d) - target) / 100;
          if (rappel) sc = (s.m < 0.45 ? -1 : 0) + Math.max(0, itemRating(state.profile, id, d) - target) / 200;
          if (s.due <= today && base !== "defi") sc -= 0.6;
          if (kind === "app" || kind === "rev") sc -= (1 - s.m) * 0.8;
          if (s.status === "encours") sc -= 0.4;
          if (this.prepActive(state) && state.prep.ids.includes(id)) sc -= 1.2;
          if (used.has(id)) sc += only ? 0.5 : 2;
          if (usedPair.has(id + "|" + d)) sc += 1;
          if (d === 4) sc -= kind === "defi4" ? 3 : 0.3;
          if (prevPen && !rappel && !isNow && prevPen.has(id)) sc += PREV_PEN; /* 27.11 : l'année d'abord (n° 32) */
          /* 27.11 (revue, n° 8 : Jade, l'échelle 4 fois en 15 questions sur 3 jours) : notion du chapitre « en classe » posée hier ou
             avant-hier et réussie du premier coup la dernière fois (box ≥ 1) : elle cède la place à une autre notion du chapitre
             si possible (hors chapitre : sans effet, l'élève très faible y perdait ses notions réussies, tests/_faibles.html) ; une notion ratée (box 0)
             revient comme prévu. */
          if (isNow && s.last && s.last < today && s.last >= addDays(today, -2) && (s.box || 0) >= 1) sc += s.last === addDays(today, -1) ? 0.8 : 0.4;
          sc += Math.random() * 0.5;
          if (!best || sc < best.sc) best = { id, d, sc };
        }
      }
      return best;
    };
    const nowPart = [];
    for (const [si, kind] of slots.entries()) {
      const base = kind === "defi4" ? "defi" : kind;
      if (si < nowK && si !== rappelAt && si !== rappel2) {
        const b = choose(kind, base, false, nowIds, true);
        if (b) { used.add(b.id); usedPair.add(b.id + "|" + b.d); cnt.set(b.id, (cnt.get(b.id) || 0) + 1); nowPart.push(b.id + "|" + b.d + "|" + base); continue; }
      }
      let best = (si === rappelAt || si === rappel2) && old < maxOld ? choose(kind, base, true, need) : null;
      if (best) old++; else best = choose(kind, base, false);
      if (!best) best = choose(kind, base, true); // aucune notion de l'année disponible
      if (!best) best = choose(kind, base, false, null, false, true) || choose(kind, base, true, null, false, true);
      if (!best) continue;
      used.add(best.id); cnt.set(best.id, (cnt.get(best.id) || 0) + 1);
      plan.push(best.id + "|" + best.d + "|" + base);
    }
    // Le chapitre du moment d'abord, du plus simple au plus difficile.
    return [...nowPart.sort((x, y) => +x.split("|")[1] - +y.split("|")[1]), ...plan];
  },

  // « Trop facile » : l'élève passe la question. Demi-victoire au Mathélo (sans répondre, on ne compte pas plein),
  // la notion monte, et son niveau visé est relevé (décalage par notion, qui retombe si l'élève échoue ensuite).
  tooEasy(state, id, d, kind) {
    this.snap(state);
    const s = state.notions[id];
    s.easy = Math.min(3, (s.easy || 0) + 1);
    s.m = Math.min(1, s.m + (1 - s.m) * 0.25);
    s.box = Math.min(5, s.box + 1);
    s.due = addDays(day(), INTERVALS[s.box]);
    if (s.status === "encours" && s.m > 0.7) s.status = "vu";
    const delta = this.updateElo(state, id, d, 1, 0.5);
    this.recordComp(state, id, d, 1);
    // Remplaçante : même notion, un cran au-dessus (si possible), sinon la question suivante du programme.
    const cap = difficultyCap(state.profile), top = hasProb(id) && kind !== "drill" ? 4 : Math.min(3, cap);
    return { delta, next: d < top && d < 4 ? id + "|" + (d + 1) + "|" + (kind === "drill" ? "app" : kind || "app") : null };
  },

  // Score Moodle : 1 au premier essai, 0,5 au deuxième, 0 ensuite.
  record(state, id, d, tries, solved, partial) {
    this.snap(state);
    const s = state.notions[id];
    s.fails = (partial !== undefined ? partial < 0.5 : !solved) ? (s.fails || 0) + 1 : solved && tries === 1 ? 0 : s.fails || 0;
    if (typeof Badges !== "undefined") Badges.onAnswer(state, id, d, tries, solved, partial);
    if (partial !== undefined) { // problème : score partiel 0..1
      this.recordComp(state, id, d, partial);
      s.seen++;
      s.m = Math.min(1, Math.max(0, s.m + (partial - 0.5) * 0.2));
      if (partial >= 0.99) { s.box = Math.min(5, s.box + 1); s.ok++; } else if (partial < 0.5) s.box = 0;
      s.due = addDays(day(), partial >= 0.99 ? INTERVALS[s.box] : 1);
      this.adapt(state, partial >= 0.99 && tries <= 1);
      return partial;
    }
    const today = day();
    /* 27.11 après-midi (lessonHold) : première réponse après la leçon : jour de la leçon, réussites et questions comptées depuis */
    if (s.lessonSeen && !s.lessonDay) { s.lessonDay = today; s.lessonOk0 = s.ok || 0; s.lessonN0 = s.seen || 0; }
    s.seen++;
    s.last = today; /* 27.11 (revue, n° 8) : dernier jour où la notion a été posée (variété entre les jours, planSlots) */
    if (solved && tries === 1) {
      s.m = Math.min(1, s.m + (1 - s.m) * (0.18 + 0.06 * d));
      s.box = Math.min(5, s.box + 1);
      s.ok++;
    } else if (solved) {
      s.m = Math.min(1, s.m + (1 - s.m) * 0.06);
    } else {
      s.m = s.m * 0.6;
      s.box = 0;
      if (s.easy) s.easy--;
    }
    s.due = addDays(today, solved && tries === 1 ? INTERVALS[s.box] : 1);
    if (s.status === "encours" && s.m > 0.7) s.status = "vu";
    const sc = solved ? (tries === 1 ? 1 : 0.5) : 0;
    this.adapt(state, sc === 1);
    this.recordComp(state, id, d, sc);
    this.unlock(state);
    return sc;
  },

  finishDay(state, answered, score) {
    const today = day();
    if (answered > 0) {
      if (typeof Badges !== "undefined") Badges.onDay(state, today);
      // Joker de série (21.11) : un jour manqué par semaine (du lundi au dimanche) ne casse pas la série.
      let joker = false;
      if (state.streak.last !== today) {
        const wk = this.weekOf(today);
        if (state.streak.last === addDays(today, -1)) state.streak.count++;
        else if (state.streak.count && state.streak.last === addDays(today, -2) && state.streak.jokerWk !== wk) { state.streak.count++; state.streak.jokerWk = wk; joker = true; }
        else state.streak.count = 1;
      }
      state.streak.last = today;
      state.streak.best = Math.max(state.streak.best || 0, state.streak.count);
      const h = state.history.find((x) => x.date === today);
      if (h) { h.n += answered; h.score += score; } else state.history.push({ date: today, n: answered, score });
      state.history = state.history.slice(-120);
      return joker ? "joker" : "";
    }
    return "";
  },
  // Semaine (lundi) d'une date : clé du joker de série.
  weekOf(d) { const x = new Date(d + "T12:00:00"); return addDays(d, -((x.getDay() + 6) % 7)); },
  // Joker encore disponible cette semaine ?
  jokerFree(state, today = day()) { return state.streak.jokerWk !== this.weekOf(today); },

  // Notion de base à reprendre après deux échecs de suite (la moins maîtrisée de ses prérequis connus).
  /* 26.11 (revue élèves) : à la place d'une notion dont la leçon reste à voir (une leçon par séance), une notion déjà
     travaillée, hors du programme du jour ; null s'il n'y en a pas. Le nombre de questions de la séance ne change pas. */
  /* 26.11 (revue d'un testeur, jour 3 : « aire latérale d'une pyramide », « √7825 ≈ 88,46 » dans une série d'automatismes).
     Un automatisme : une question seule (pas de parties), courte (énoncé de 170 caractères au plus), sans figure, sans
     arrondi ni calculatrice, sans « Trouve l'erreur », réponse exacte et courte (entier ou décimal à 2 chiffres après la
     virgule au plus). Contrôlé par tests/lot_26_11.html (séances « automatismes » tirées dans toutes les classes). */
  isDrill(q) {
    if (!q || q.parts || !q.spec || q.fig || q.figure || q.ctx === "erreur" || q.spec.round || q.spec.radical) return false;
    /* 26.11 (revue p5, n° 6 : « Un père a le triple de l'âge de son fils… » dans une série d'automatismes, 6:04) : un problème
       à mettre en équation n'est jamais un automatisme (lecture, modélisation, résolution). */
    if (NO_DRILL.includes(q.id)) return false;
    const t = String(q.q || "").replace(/<[^>]+>/g, " ").replace(/\\[()]/g, "").replace(/\s+/g, " ").trim();
    /* 26.11 (revue p4, n° 8 : MP 3e, « Calcule sans calculatrice \(\log_2 32\) » refusé comme automatisme, chapitre absent
       de la série) : « sans calculatrice » annonce justement un automatisme ; seule la calculatrice demandée exclut. */
    if (t.length > 170 || /mets? (?:le problème )?en équation|l'âge|ans de plus|ans de moins|(?:double|triple|quadruple) de (?:l'âge|celui|celle)|arrondi|au dixième|au centième|au millième|à l'unité|près\b|(?<!sans )calculatrice|\\approx|≈|Trouve l'erreur/i.test(t)) return false;
    const v = q.spec.value;
    const simple = (x) => Math.abs(x * 100 - Math.round(x * 100)) < 1e-6 || [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 16, 20].some((d) => Math.abs(x * d - Math.round(x * d)) < 1e-9);
    if (q.spec.kind === "value" && typeof v === "number" && !simple(v)) return false;
    return true;
  },
  makeDrill(state, id) {
    for (let k = 0; k < 15; k++) { let q = null; try { q = this.make(state, id, 1, undefined, true); } catch (e) { return null; } if (this.isDrill(q)) return q; }
    return null;
  },
  // Notion qui fournit des automatismes (au moins la moitié de 6 tirages au niveau 1) ; mémorisé pour la page.
  drillable(state, id) {
    const key = (state.profile.system || "") + (state.profile.track || "") + state.profile.grade + "|" + id;
    /* 26.11 (revue p4, n° 8) : 8 tirages à graine fixe (reproductible, sans toucher à l'anti-répétition) au lieu de 6 au hasard */
    if (!(key in DRILL_OK)) { let n = 0; for (let k = 1; k <= 8; k++) { let q = null; try { q = this.make(state, id, 1, k * 101); } catch (e) {} if (this.isDrill(q)) n++; } DRILL_OK[key] = n >= 4; }
    return DRILL_OK[key];
  },
  swapLesson(state, plan, i) {
    const idOf = (e) => String(e).split("|")[0], k = String(plan[i]).split("|")[2], kind = TARGET[k] !== undefined ? k : "app";
    const ex = new Set([...plan.map(idOf), ...this.eligible(state).filter((id) => this.lessonDue(state, id) || !state.notions[id].seen)]);
    return this.planSlots(state, [kind], { exclude: ex })[0] || null;
  },
  /* 26.11 (adaptivité) : après deux échecs de suite dans une séance, la question suivante est plus facile, jamais plus
     dure : même notion un niveau en dessous ; au niveau 1, une base (PREREQ) déjà ouverte ; sinon la notion la mieux
     maîtrisée de l'élève au niveau 1. Difficulté ressentie = score de la question − 200 × maîtrise. Renvoie la nouvelle
     entrée du programme (à mettre en i + 1) ou null si la question prévue est déjà plus facile (ou une base). */
  easeNext(state, plan, i, id, d) {
    const nx = String(plan[i + 1] || "").split("|");
    if (!state.notions[nx[0]] || nx[2] === "rem" || String(plan[i + 1]).startsWith("PROB:")) return null;
    const feel = (x, dd) => itemRating(state.profile, x, dd) - 200 * ((state.notions[x] || {}).m || 0);
    const bar = feel(id, d), kind = nx[2] === "drill" ? "drill" : nx[2] || "app";
    if (feel(nx[0], +nx[1] || 1) < bar - 50) return null;
    const ok = (x, dd) => GEN[x] && state.notions[x] && ["vu", "encours"].includes(state.notions[x].status) && !this.lessonFirst(state, x) && (kind !== "drill" || (dd === 1 && this.drillable(state, x)));
    if (d > 1 && d !== 4 && ok(id, d - 1)) return id + "|" + (d - 1) + "|" + (kind === "drill" ? "app" : kind);
    if (d === 4 && ok(id, 2)) return id + "|2|" + kind;
    const pre = (PREREQ[id] || []).filter((p) => ok(p, 1) && feel(p, 1) < bar).sort((a, b) => state.notions[a].m - state.notions[b].m)[0];
    if (pre) return pre + "|1|rem";
    const inPlan = new Set(plan.map((e) => String(e).split("|")[0]));
    const best = this.eligible(state).filter((x) => x !== id && !inPlan.has(x) && this.isRecent(state, x) && state.notions[x].seen > 0 && ok(x, 1) && feel(x, 1) < bar - 50)
      .sort((a, b) => feel(a, 1) - feel(b, 1))[0];
    return best ? best + "|1|" + kind : null;
  },
  /* 27.11 (décision de l'enseignant, n° 27 ; tools/archive/eleves_faibles_26-11.md, proposition 1) : rejouer au lieu d'ajouter.
     Élève en grande difficulté (struggling), question pas réussie du premier coup : la question suivante prévue devient la
     même notion, d'autres nombres, un niveau en dessous (le niveau 1 reste 1). Elle remplace, elle ne s'ajoute pas : la
     séance garde sa durée. Une fois par séance (l'appelant le garde). Ni automatisme, ni problème (niveau 4), ni à la place
     d'une question qui porte la leçon du jour ou du problème de la semaine. Renvoie l'entrée à mettre en i + 1, ou null. */
  /* 27.11 (revue, n° 1, grave : Kevin, Révision sur le chapitre « en classe », « rejouer ? non … leçon due true » deux fois,
     séance 0/3) : on ne refusait dès que la notion suivante avait une leçon à voir (lessonDue), or les notions du chapitre en
     classe sont posées SANS leçon en Révision / Défi / Automatismes, et une seule leçon passe par séance. On décide sur ce
     qui s'affichera vraiment : lessonShows (même règle que nextQuestion dans src/app.js). sess = { noLesson, lessonDone,
     lessonAt } de la séance ; sans sess (appelant ancien), règle du plan seul (plan.noLesson). */
  lessonShows(state, plan, j, sess) {
    const nid = String(plan[j] || "").split("|")[0];
    if (!nid || String(plan[j]).startsWith("PROB:") || !state.notions[nid] || !this.lessonDue(state, nid)) return false;
    const S = sess || {};
    if (S.noLesson || plan.noLesson || S.fmt === "auto") return false;
    return !S.lessonDone && (S.lessonAt == null || S.lessonAt === j);
  },
  replayNext(state, plan, i, id, d, kind, sess) {
    if (!this.struggling(state) || i + 1 >= plan.length || kind === "drill" || !(d >= 1 && d < 4) || !GEN[id] || !state.notions[id]) return null;
    const nx = String(plan[i + 1]), nid = nx.split("|")[0];
    if (nx.startsWith("PROB:") || (nid !== id && this.lessonShows(state, plan, i + 1, sess))) return null;
    return id + "|" + Math.max(1, d - 1) + "|" + (kind === "rem" || kind === "carnet" || !kind ? "app" : kind);
  },
  remediation(state, id) {
    const s = state.notions[id];
    if (!s || (s.fails || 0) < 2) return null;
    const cands = (PREREQ[id] || []).filter((p) => state.notions[p] && GEN[p]);
    if (!cands.length) return null;
    s.fails = 0;
    return cands.sort((a, b) => state.notions[a].m - state.notions[b].m)[0];
  },

  // « Je prépare mon test » : notions choisies, actif jusqu'au jour du test inclus.
  // « En ce moment en classe » (13.11) : 1 à 5 notions choisies par l'élève (3 jusqu'au 20.11) ; question de relance chaque semaine (22.11).
  nowActive(state) { return !!(state.now && state.now.ids && state.now.ids.length); },
  // 22.11 (demande de l'auteur) : relance chaque semaine (7 jours) au lieu de 3 semaines, pour inciter à changer de chapitre.
  nowStale(state, today = day()) { return this.nowActive(state) && addDays(state.now.since, 7) <= today; },
  setNow(state, ids) {
    state.now = ids.length ? { ids, since: day() } : null;
    for (const id of ids) { const n = state.notions[id]; if (n && n.status !== "vu" && n.status !== "encours") { Object.assign(n, { status: "encours", m: Math.max(0.4, n.m), due: day() }); delete n.retry; } }
  },
  // Notions probables du moment : ouvertes et pas encore maîtrisées, puis les suivantes dans l'ordre du référentiel.
  nowSuggest(state, n = 6) {
    const p = state.profile, cur = this.catalog(p).filter((c) => c.current && state.notions[c.id]).sort((a, b) => this.rank(p, a.id) - this.rank(p, b.id));
    const open = cur.filter((c) => ["vu", "encours"].includes(state.notions[c.id].status) && !(state.notions[c.id].m >= 0.75 && state.notions[c.id].ok >= 3));
    const next = cur.filter((c) => ["avenir", "nonvu"].includes(state.notions[c.id].status));
    return [...open.slice(-4), ...next.slice(0, n)].slice(0, n).map((c) => c.id);
  },
  prepActive(state) { return !!(state.prep && state.prep.ids.length && state.prep.date >= day()); },
  /* 26.11 (revue élèves : « Révision ciblée » de 7 questions + problème = 7 à 12 min) : 4 questions, sans problème
     (niveau 3 au plus) ; le sujet de préparation reste à part, au choix. */
  /* 26.11 (revue p3, n° 13) : niveau minimal d'une notion pour un élève : 2 si son Mathélo (cible propre) atteint le niveau 2
     de la notion et qu'il ne l'a pas ratée (maîtrise ≥ 0,45), hors élève sous le plancher ; sinon 1. */
  minLevel(state, id) {
    const s = state.notions[id]; if (!s || this.underFloor(state)) return 1;
    /* 26.11 (revue p4, n° 9 : Tle forte, Mathélo 1852, 4 questions de niveau 1 sur des notions jamais vues, m = 0,4 à
       l'ouverture) : notion jamais travaillée ni ratée au positionnement → même règle, sur le seul Mathélo. La question qui
       suit une leçon reste au niveau 1 (nextQuestion). */
    return (s.m >= 0.45 || (!s.seen && !s.placed)) && state.elo.r + (state.tadj || 0) >= itemRating(state.profile, id, 2) ? 2 : 1;
  },
  planPrep(state) {
    const ids = state.prep.ids.filter((id) => state.notions[id]);
    const order = [...ids].sort((a, b) => state.notions[a].m - state.notions[b].m);
    const plan = [];
    for (let i = 0; order.length && plan.length < 4; i++) { const id = order[i % order.length]; plan.push(id + "|" + Math.min(3, Math.max(this.difficulty(state, id), this.minLevel(state, id)))); }
    return plan;
  },

  /* ================= Problème de la semaine et « Creuser encore » (28.11, décision de l'enseignant) =================
     « Le grand problème de la semaine, parfois je ne le trouve pas si grand ; et ne pouvoir en faire qu'un donne une
     impression de rubrique un peu faiblarde. »
     (1) Un VRAI grand problème : tiré parmi les problèmes riches (isGrand : au moins GRAND.parts parties, un énoncé en
         situation d'au moins GRAND.prose caractères hors formules, au programme de la classe), environ 10–15 minutes.
         Élève faible : le MÊME problème, avec plus d'aide (weeklyAid : plan, coup de pouce par partie, 4 essais), jamais
         raccourci (la règle n° 24 du 26.11, shortProb, reste valable pour le défi du jour).
     (2) « Creuser encore » (digMore) une fois le problème fait : problèmes des semaines passées et autres grands problèmes
         des chapitres récents ; pépites ordinaires (l'app : plafond du jour), bonus YP.weekly pour le seul problème de la
         semaine ; facultatif, hors séance. API documentée dans tools/ETAT.md (section « Problème de la semaine »).
     Repli explicite (weeklyPick.g) : chapitre en classe (grand → riche, 3 parties en situation → court, 2–3 parties), puis
     autres notions de l'année (même ordre), puis reprises (grand → court) ; la classe et le chapitre avant la taille. */
  GRAND: { parts: 4, prose: 70, seeds: 40 },
  probProse(q) { return String((q && q.q) || "").replace(/\\\(.*?\\\)|\\\[.*?\\\]/g, " ").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(); },
  /* sorte d'un problème de niveau 4 pour ce profil : "grand", "riche" (3 parties en situation), "court", ou null (pas un problème) */
  probKind(state, id, q) {
    if (!q || q.d !== 4 || !Array.isArray(q.parts) || q.parts.length < 2 || (state && horsCO(state, id, q))) return null;
    const ctx = this.probProse(q).length >= this.GRAND.prose;
    return q.parts.length >= this.GRAND.parts && ctx ? "grand" : q.parts.length >= 3 && ctx ? "riche" : "court";
  },
  isGrand(state, id, q) { return this.probKind(state, id, q) === "grand"; },
  /* durée estimée (min) : lecture + 2 min par partie ; un grand problème ≈ 10–15 min */
  probMinutes(q) { return Math.round(1.5 + this.probProse(q).length / 250 + 2 * ((q && q.parts) || []).length); },
  /* problèmes distincts (un code par forme : contexte, sinon début de l'énoncé) d'une notion, par sorte, pour ce profil ; mis en cache */
  probCodes(state, id, kind) {
    const p = state.profile, c = (this._pc = this._pc || {}), k = [p.system, p.grade, p.track, p.niv, id].join("|");
    if (!(k in c)) {
      const out = { grand: [], riche: [], court: [] }, seen = new Set();
      for (let s = 1; s <= this.GRAND.seeds; s++) {
        let q; try { q = this.build(id, 4, s); } catch (e) { break; }
        const kd = this.probKind(state, id, q); if (!kd) continue;
        const f = q.ctx || qForm(q).slice(0, 60); if (seen.has(kd + f)) continue; seen.add(kd + f);
        out[kd].push(q.code);
      }
      c[k] = out;
    }
    return kind ? c[k][kind] : c[k];
  },
  weekId() { const d = new Date(); return d.getFullYear() + "-" + Math.floor((d - new Date(d.getFullYear(), 0, 1)) / 6048e5); },
  /* historique (state.weeklyHist, champ facultatif : migration douce, aucune clé de stockage changée) :
     [{ w: semaine, id, c: code, g: sorte, done }] ; done = fait (state.weeklyDone de cette semaine-là) */
  weeklySync(state) {
    const H = (state.weeklyHist = Array.isArray(state.weeklyHist) ? state.weeklyHist : []);
    if (!H.length && state.weeklyPick && state.weeklyPick.id) H.push({ w: state.weeklyPick.week, id: state.weeklyPick.id, c: state.weeklyPick.code || null, g: state.weeklyPick.g || null, done: false }); /* état d'avant le 28.11 */
    for (const e of H) if (!e.done && state.weeklyDone && e.w === state.weeklyDone) e.done = true;
    return H;
  },
  // Problème de la semaine : une notion « à problème » parmi celles vues, fixée pour la semaine (renvoie la notion ; le
  // problème lui-même, un code fixe, est dans state.weeklyPick.code et se lit par weeklyQuestion).
  // Calé sur le Mathélo (22.11 : un seul problème par semaine, il doit être à la bonne hauteur) :
  // les 3 notions dont le défi (niveau 4) est le plus proche du Mathélo, une notion pas encore travaillée (m < 0,3) en dernier recours.
  weeklyProblem(state) {
    const week = this.weekId(), H = this.weeklySync(state);
    /* 26.11 (revue p6, n° 2 : Hugo 6e, leçon « 0,5 × 0,5 » puis un problème de niveau 4 sur une notion jamais travaillée) :
       seulement une notion déjà travaillée (seen, maîtrise > 0) ou du chapitre « en classe » ; jamais de leçon avant. */
    const worked = (id) => { const s = state.notions[id]; return this.nowHas(state, id) || (s && s.seen > 0 && s.m > 0); };
    const ids = this.eligible(state).filter((id) => hasProb(id) && worked(id));
    if (!ids.length) return null;
    /* revue p6, n° 1 (Yanis, Emma : problème tiré à l'accueil avant le choix du chapitre « en classe ») : le choix de la semaine
       est refait si le chapitre en classe change, tant que le problème n'est pas fait */
    const nowSig = this.nowActive(state) ? state.now.ids.join(",") : "", done = state.weeklyDone === week;
    const wp = state.weeklyPick;
    if (wp && wp.week === week && (wp.v === 5 || (wp.v === 4 && done)) && ids.includes(wp.id) && (done || (wp.now || "") === nowSig)) return wp.id; /* v5 (28.11) : un code fixe ; un v4 déjà fait cette semaine reste */
    const r = state.elo.r, m = (id) => (state.notions[id] || {}).m || 0;
    // 24.11 (auteur en 4e : « une factorisation vraiment simple ») : un vrai défi. Notions de l'année ou de l'année
    // précédente d'abord (les plus anciennes pénalisées) ; difficulté visée au-dessus du Mathélo (+150), plus faciles pénalisées.
    const g = state.profile.grade, yr = (id) => { try { const p = placeOf(NOTIONS.find((n) => n.id === id), state.profile); return p ? p[0] : g; } catch (e) { return g; } };
    /* 26.11 (revue p4, n° 7) : notion de l'année (catalogue, current) avant toute autre. Rangs (revue p6, n° 1) : 0 = notion de
       l'année (placeOf = classe) du chapitre « en classe », 1 = autre notion de l'année, 2 = reprise du chapitre en classe,
       3 = reprise du catalogue de l'année, 4 = autre. L'écart d'année est pénalisé dès 1 an. */
    const yearSet = new Set(this.catalog(state.profile).filter((c) => c.current).map((c) => c.id));
    const tier = (id) => { const own = yr(id) === g, ch = this.nowHas(state, id); return own && ch ? 0 : own ? 1 : ch ? 2 : yearSet.has(id) ? 3 : 4; };
    const score = (id) => { const it = itemRating(state.profile, id, 4), gap = g - yr(id);
      return Math.abs(it - (r + 150)) + (it < r ? 150 : 0) + (gap >= 1 ? 250 * gap : 0) + (m(id) < 0.3 ? 400 : 0); };
    /* 28.11 : passes successives (sorte de problème × rangs) ; dans une passe, le meilleur rang qui donne au moins un problème
       de la sorte, puis les 3 notions les mieux placées (score). « court » = l'ancien critère (26.11, revue p4, n° 6 : un vrai
       problème en plusieurs parties). */
    /* chapitre « en classe » d'abord (règle du 26.11, revue p6, n° 1), puis le reste de l'année, puis les reprises */
    const PASSES = [["grand", [0]], ["riche", [0]], ["court", [0]], ["grand", [1]], ["riche", [1]], ["court", [1]], ["grand", [2, 3, 4]], ["court", [2, 3, 4]]];
    const has = (id, kd) => kd === "court" ? this.probCodes(state, id, "grand").length + this.probCodes(state, id, "riche").length + this.probCodes(state, id, "court").length > 0 : this.probCodes(state, id, kd).length > 0;
    /* le problème : une forme pas encore donnée en problème de la semaine (historique) ; d'abord les notions qui en ont encore */
    const poolOf = (id, kd) => kd === "court" ? [...this.probCodes(state, id, "grand"), ...this.probCodes(state, id, "riche"), ...this.probCodes(state, id, "court")] : this.probCodes(state, id, kd);
    const used = new Set(H.filter((e) => e.w !== week).map((e) => e.c)), freshOf = (id, kd) => poolOf(id, kd).filter((c) => !used.has(c));
    let best = [], kind = null;
    /* sorte par sorte : une forme jamais donnée, sinon (toutes données) une forme déjà donnée, avec d'autres nombres */
    for (const [kd, tiers] of PASSES) {
      for (const newOnly of [true, false]) {
        for (const t of tiers) {
          for (const id of ids.filter((x) => tier(x) === t).sort((a, b) => score(a) - score(b))) { if (has(id, kd) && (!newOnly || freshOf(id, kd).length)) best.push(id); if (best.length >= 3) break; }
          if (best.length) break;
        }
        if (best.length) break;
      }
      if (best.length) { kind = kd; break; }
    }
    if (!best.length) return null;
    const n = +week.split("-")[1], id = best[n % best.length];
    const pool = poolOf(id, kind), fresh = freshOf(id, kind), L = fresh.length ? fresh : pool;
    let code = L[n % L.length];
    if (used.has(code)) { const q0 = this.fromCode(code), f0 = q0 && (q0.ctx || qForm(q0).slice(0, 60)), kd0 = q0 && this.probKind(state, id, q0);
      for (let s = this.GRAND.seeds + 1 + n; s <= this.GRAND.seeds + 400; s += 7) { let q; try { q = this.build(id, 4, s); } catch (e) { break; }
        if (q && !used.has(q.code) && this.probKind(state, id, q) === kd0 && (q.ctx || qForm(q).slice(0, 60)) === f0) { code = q.code; break; } } }
    state.weeklyPick = { week, id, v: 5, now: nowSig, code, g: kind };
    const e = H.find((x) => x.w === week); if (e) Object.assign(e, { id, c: code, g: kind }); else H.push({ w: week, id, c: code, g: kind, done: false });
    if (H.length > 60) H.splice(0, H.length - 60);
    return id;
  },
  /* La question du problème de la semaine (code fixe de la semaine), avec l'aide des élèves faibles ; null sans problème.
     L'app l'utilise à la place de make(state, id, 4) dans la séance « weekly ». */
  weeklyQuestion(state) {
    const id = this.weeklyProblem(state); if (!id) return null;
    const c = state.weeklyPick && state.weeklyPick.code;
    let q = c ? this.fromCode(c) : null;
    if (!q) { q = this.make(state, id, 4, undefined, false); return q && q.d === 4 ? this.weeklyAid(state, q) : q; } /* choix v4 d'avant le 28.11 */
    return this.weeklyAid(state, this.finalize(state, id, q));
  },
  /* 28.11 : aide pour un élève faible (weak4 : sous la moyenne de sa classe ou en grande difficulté), sans raccourcir :
     q.aid = { plan, parts: [coup de pouce par partie | null] }, q.maxTries = 4 (au lieu de 3). Les coups de pouce viennent
     des indices du problème (segments « a) … », « b) … »), sinon l'indice d'outil pour a) et l'indice de calcul pour la
     dernière partie, sinon l'indice de la notion. Jamais la réponse : rien n'est tiré du corrigé. force : pour les tests. */
  weeklyAid(state, q, force) {
    if (!q || !Array.isArray(q.parts) || !(force || this.weak4(state))) return q;
    const H = (q.hints || []).map((x) => String(x)), seg = {}, free = [];
    for (const h of H) {
      const bits = h.split(/(?:^|\s)(?=[a-h]\)\s)/);
      for (const b of bits) { const m = /^([a-h])\)\s*([\s\S]*)$/.exec(b.trim()); if (m) (seg[m[1]] = seg[m[1]] || []).push(m[2].trim()); else if (b.trim()) free.push(b.trim()); }
    }
    const nH = typeof HINTS !== "undefined" && HINTS[q.id] ? plainTeX(HINTS[q.id]) : "";
    const n = q.parts.length, parts = q.parts.map((p, i) => { const L = String.fromCharCode(97 + i);
      if (seg[L]) return seg[L].join(" ");
      if (i === 0 && free[0]) return free[0];
      if (i === n - 1 && free.length > 1) return free[free.length - 1];
      return i === 0 && nH ? nH : null; });
    const plan = "Un grand problème en " + n + " parties : lis tout l'énoncé et repère les données. Fais les parties dans l'ordre : chaque réponse sert souvent à la suivante. Tu as 4 essais et un coup de pouce par partie.";
    return { ...q, aid: { plan, parts }, maxTries: 4, helped: true };
  },

  /* ---------- « Creuser encore » (dans la mine, une fois le problème de la semaine fait) ----------
     digOpen(state) : le problème de cette semaine est fait.
     digMore(state, n = 8, opt) : liste de problèmes à creuser, [{ code, id, kind: "semaine" | "chapitre", week?, done?, label,
       parts, minutes }] : d'abord les problèmes des semaines passées pas faits, puis les grands problèmes des chapitres
       récents (notions de l'année travaillées, chapitre en classe d'abord), puis les problèmes des semaines passées déjà
       faits ; jamais celui de la semaine, jamais un problème creusé dans les 14 derniers jours. opt.force : sans digOpen (tests).
     digQuestion(state, code) : la question (avec l'aide des élèves faibles), q.dig = true ; null si le code est invalide.
     digNote(state, code) : à appeler quand l'élève a fini ce problème (state.digLog = { code: jour }, 80 au plus).
     Pépites : ordinaires (plafond du jour), jamais YP.weekly : c'est l'app qui les compte. */
  digOpen(state) { return !!state && state.weeklyDone === this.weekId(); },
  digMore(state, n = 8, opt) {
    if (!state || !(opt && opt.force) && !this.digOpen(state)) return [];
    const H = this.weeklySync(state), week = this.weekId(), cur = state.weeklyPick && state.weeklyPick.week === week ? state.weeklyPick.code : null;
    const log = state.digLog || {}, lim = addDays(day(), -14), recentDug = (c) => !!(log[c] && log[c] >= lim);
    const lab = (id) => { const x = NOTIONS.find((k) => k.id === id); return x ? x.label : id; };
    const item = (code, kind, extra) => { let q = null; try { q = this.fromCode(code); } catch (e) { q = null; } if (!q || !this.probKind(state, q.id, q)) return null;
      return { code, id: q.id, kind, label: lab(q.id), parts: q.parts.length, minutes: this.probMinutes(q), ...(extra || {}) }; };
    const out = [], seen = new Set(cur ? [cur] : []), push = (x) => { if (x && !seen.has(x.code) && !recentDug(x.code)) { seen.add(x.code); out.push(x); } };
    const past = H.filter((e) => e.w !== week && e.c).reverse(), histC = new Set(H.map((e) => e.c));
    for (const e of past.filter((e) => !e.done)) push(item(e.c, "semaine", { week: e.w, done: false }));
    /* grands problèmes des chapitres récents : notions de l'année (placeOf = classe) travaillées, chapitre en classe puis
       notions récentes, une forme par notion à tour de rôle */
    const g = state.profile.grade, own = (id) => { const p = placeOf(NOTIONS.find((k) => k.id === id), state.profile); return !!p && p[0] === g; };
    const s = (id) => state.notions[id] || {}, worked = (id) => this.nowHas(state, id) || (s(id).seen > 0 && s(id).m > 0);
    const ids = this.eligible(state).filter((id) => hasProb(id) && own(id) && worked(id) && (this.nowHas(state, id) || this.isRecent(state, id)))
      .sort((a, b) => (this.nowHas(state, b) ? 1 : 0) - (this.nowHas(state, a) ? 1 : 0) || (s(b).last || "").localeCompare(s(a).last || ""));
    const lists = ids.map((id) => this.probCodes(state, id, "grand").slice());
    for (let k = 0; out.length < n && lists.some((l) => l.length); k++) for (const l of lists) { if (out.length >= n) break; const c = l.shift(); if (c && !histC.has(c)) push(item(c, "chapitre")); }
    for (const e of past.filter((e) => e.done)) push(item(e.c, "semaine", { week: e.w, done: true }));
    return out.slice(0, n);
  },
  digQuestion(state, code) {
    let q = null; try { q = this.fromCode(code); } catch (e) { q = null; }
    if (!q || q.d !== 4 || !q.parts) return null;
    return { ...this.weeklyAid(state, this.finalize(state, q.id, q)), dig: true };
  },
  digNote(state, code) {
    const L = (state.digLog = state.digLog || {}); L[code] = day();
    const ks = Object.keys(L).sort((a, b) => L[a].localeCompare(L[b])); while (ks.length > 80) delete L[ks.shift()];
  },
  isProvisional(state) { return state.elo.n < 20; },

  themeLevels(state) {
    const out = {};
    for (const [id, s] of Object.entries(state.notions)) {
      if (s.status !== "vu" && s.status !== "encours") continue;
      const th = NOTIONS.find((n) => n.id === id).theme;
      (out[th] = out[th] || []).push(s.m);
    }
    return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.reduce((a, b) => a + b, 0) / v.length]));
  },
};

// Deux-points lisibles (16.11) : rappels de cours et « Devine » des leçons actives, une fois tout chargé.
if (typeof LESSONS !== "undefined") for (const L of Object.values(LESSONS)) if (L && typeof L === "object") { for (const k of ["intro", "regle", "piege"]) if (typeof L[k] === "string") L[k] = colonBreak(L[k]); if (Array.isArray(L.exemple)) L.exemple = L.exemple.map(colonBreak); }
if (typeof ACTIVE !== "undefined") for (const A of Object.values(ACTIVE)) if (A && A.predict) A.predict.why = colonBreak(A.predict.why);

/* 27.11 (agent primaire, tools/primaire_9e.md) : relais des automatismes de fin de primaire (src/primaire.js, paquet 9).
   PRIM.inject n'agit que pour un élève de 9e (CO, hors MP) en grande difficulté (Engine.struggling) : 1 à 2 questions à la
   place des dernières prévues. Sans src/primaire.js chargé (autres classes, France) : aucun effet. Mode libre : les notions
   primaires que freePlan aurait tirées sont retirées (PRIM.strip), seul PRIM.inject en place. */
(function () {
  const plan0 = Engine.planSession, one0 = Engine.oneLesson, P = () => (typeof PRIM !== "undefined" ? PRIM : null);
  /* 27.11 : pas de rappel de primaire le jour du positionnement (séance de 2 questions, firstDayCap) */
  /* 27.11 (revue, n° 2 et 3) : PRIM.note (jours en grande difficulté), PRIM.vary (pas plus de 2 fois la même notion) */
  Engine.planSession = function (state, format) { const p = plan0.call(this, state, format), X = P(); if (X) X.note(state); return X ? (state.placedOn === day() ? X.strip(p) : X.inject(state, X.vary(state, X.strip(p)))) : p; };
  Engine.oneLesson = function (state, plan, n) { const X = P(); return X ? X.inject(state, X.vary(state, one0.call(this, state, X.strip(plan), n))) : one0.call(this, state, plan, n); };
})();
/* 28.11 (nickel 10e, ch. 7) : indice et rappel de cours propres à la classe (TXT_CO, plus haut) : accesseurs sur HINTS[id] et
   sur les champs de LESSONS[id], selon le profil de l'élève en cours (state, src/app.js). Sans profil (tests, autre classe) :
   le texte général, inchangé. LESSONS[id] peut être remplacé plus tard (L_ dans un autre fichier) : l'accesseur est posé ici,
   après tous les fichiers de leçons (engine.js est chargé après eux). */
(function () {
  const cur = (id) => (typeof state !== "undefined" && state && state.profile ? txtCO(state.profile, id) : null);
  const ids = new Set(Object.values(TXT_CO).flatMap((o) => Object.keys(o)));
  for (const id of ids) {
    if (typeof HINTS !== "undefined" && id in HINTS) { const h0 = HINTS[id]; Object.defineProperty(HINTS, id, { configurable: true, enumerable: true, get: () => { const t = cur(id); return t && t.hint ? t.hint : h0; }, set: (v) => { Object.defineProperty(HINTS, id, { value: v, writable: true, configurable: true, enumerable: true }); } }); }
    const L = typeof LESSONS !== "undefined" && LESSONS[id];
    if (L) for (const k of ["regle", "exemple", "piege"]) { const v0 = L[k]; Object.defineProperty(L, k, { configurable: true, enumerable: true, get: () => { const t = cur(id); return t && t.lesson && t.lesson[k] !== undefined ? t.lesson[k] : v0; } }); }
  }
})();
