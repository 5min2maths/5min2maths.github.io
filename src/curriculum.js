/* Nom de l'app (26.11, centralisé : il peut encore changer avant l'ouverture). Seul endroit où il est écrit : en-tête (brand),
   présentations, textes qui le citent ; build.py le reporte dans le titre de la page et le manifeste (docs/). Contrôle :
   tools/test_nom.py (lancé par tools/run_tests.sh). APP_TITLE : titre actuel de l'onglet, gardé tel quel. */
const APP_NAME = "5 minutes de maths";
const APP_TAGLINE = "par jour";
const APP_SHORT = "5 min maths";
const APP_TITLE = "5minutes2mathsparjour";
// Catalogue des notions (recalibré le 12.11 sur les référentiels : PER / CO, programme du Collège de Genève 2021,
// PEE de la maturité professionnelle ; correspondance notion → compétences dans tools/referentiels.py).
// CH : [année] (9-11 = CO, 12-13 = 1re-2e du Collège). Pas de mois : l'ordre des chapitres varie d'une école à l'autre.
// again : années suivantes où le référentiel reprend la notion (elle reste proposée dans « Mes notions » ces années-là).
// MP : [année, semestre du PEE] ; absent = comme au CO (notion antérieure) ; null = hors programme MP.
// FR : conservé pour plus tard (France masquée pendant la bêta genevoise).
const THEMES = {
  no: "Nombres et opérations",
  gm: "Grandeurs et mesures",
  fa: "Fonctions et algèbre",
  es: "Espace",
};

const NOTIONS = [
  { id: "prio", theme: "no", label: "Priorités des opérations", ex: "3 + 4 \\cdot 2 = 11", CH: [9], again: [10,11], FR: [6, 1] },
  { id: "rel", theme: "no", label: "Nombres relatifs", ex: "(-3) - 5 \\cdot (-2) = 7", CH: [9], again: [10,11,12], MP: [12, "S1"], FR: [7, 2] },
  { id: "arith", theme: "no", label: "Diviseurs, PGDC et PPMC", ex: "\\text{PGDC}(24 ; 36) = 12", CH: [9], again: [10,12], MP: [12, "S1"], FR: null },
  { id: "fracadd", theme: "no", label: "Fractions : simplifier, additionner", ex: "\\frac{2}{3} + \\frac{1}{4} = \\frac{11}{12}", CH: [9], again: [10,11], MP: [12, "S1"], FR: [7, 4] },
  { id: "diagr", theme: "no", label: "Diagrammes et moyennes", ex: "\\bar{x} = \\frac{\\text{somme}}{\\text{effectif}}", CH: [9], again: [10], FR: null },
  { id: "vol", theme: "gm", label: "Volumes : pavé, prisme, cylindre", ex: "V = A_{\\text{base}} \\cdot h", CH: [9], again: [10,11], FR: [8, 8] },
  { id: "prop", theme: "fa", label: "Proportionnalité, règle de trois", ex: "3 \\text{ kg} \\to 7{,}50 \\text{ CHF}, \\; 5 \\text{ kg} \\to ?", CH: [9], again: [10], FR: [6, 3] },
  { id: "valnum", theme: "fa", label: "Expressions littérales", ex: "3x^2 \\text{ pour } x = -2 \\text{ vaut } 12", CH: [9], again: [10,11], FR: [7, 5] },
  { id: "angtri", theme: "es", label: "Angles des triangles et quadrilatères", ex: "\\alpha + \\beta + \\gamma = 180°", CH: [9], FR: null },
  { id: "fracmul", theme: "no", label: "Fractions : multiplier, diviser", ex: "\\frac{2}{3} \\cdot \\frac{9}{4} = \\frac{3}{2}", CH: [10], again: [11], MP: [12, "S1"], FR: [8, 2] },
  { id: "pct", theme: "no", label: "Pourcentages", ex: "15\\,\\% \\text{ de } 80 = 12", CH: [10], /* 24.11 : plus reprise en 1re (tools/niveau_1c.md) */ FR: [6, 6] },
  { id: "puiss", theme: "no", label: "Puissances", ex: "2^3 \\cdot 2^4 = 2^7", CH: [10], again: [11,12], MP: [12, "S1"], FR: [8, 3] },
  { id: "sci", theme: "no", label: "Notation scientifique", ex: "0{,}0042 = 4{,}2 \\cdot 10^{-3}", CH: [10], again: [11,12], FR: [8, 4] },
  { id: "rac", theme: "no", label: "Racines carrées", ex: "\\sqrt{72} = 6\\sqrt{2}", CH: [10], again: [11], /* 24.11 : 1re = racprop, ratden */ MP: [12, "S1"], FR: [9, 2] },
  { id: "racprop", theme: "no", label: "Racines : propriétés (carrées et cubiques)", ex: "\\sqrt{72} = 6\\sqrt{2}", CH: [11], again: [12] }, // 22.11 : propriétés en 11e seulement
  { id: "disque", theme: "gm", label: "Cercle et disque", ex: "A = \\pi r^2", CH: [10], FR: null },
  { id: "vitesse", theme: "gm", label: "Vitesse, distance, durée", ex: "150 \\text{ km en } 2 \\text{ h} \\to 75 \\text{ km/h}", CH: [10], again: [11], FR: [8, 7] },
  { id: "pyth", theme: "gm", label: "Théorème de Pythagore", ex: "a^2 + b^2 = c^2", CH: [10], again: [11], MP: [12, "S2"], FR: [8, 3] },
  { id: "reduire", theme: "fa", label: "Réduire une expression", ex: "3x + 5 - x + 2 = 2x + 7", CH: [10], again: [11], MP: [12, "S1"], FR: [7, 6] },
  { id: "distrib", theme: "fa", label: "Développer", ex: "(x + 2)(x - 3) = x^2 - x - 6", CH: [10], again: [11], MP: [12, "S1"], FR: [8, 5] },
  { id: "eq1", theme: "fa", label: "Équations du 1er degré", ex: "3x - 5 = 7 \\iff x = 4", CH: [10], again: [11,12], MP: [12, "S1"], FR: [8, 6] },
  { id: "probeq", theme: "fa", label: "Mettre un problème en équation", ex: "n + (n+1) + (n+2) = 48", CH: [10], again: [11], MP: [12, "S1"], FR: null },
  { id: "echelle", theme: "fa", label: "Échelles et pentes", ex: "1\\,:\\,200 : \\; 3 \\text{ cm} \\to 6 \\text{ m}", CH: [10], FR: [9, 6] },
  { id: "affine", theme: "fa", label: "Fonctions affines", ex: "f(x) = ax + b", CH: [10], again: [11,12], MP: [13, "S1"], FR: [9, 7] },
  { id: "polyreg", theme: "es", label: "Polygones réguliers", ex: "\\text{angle au centre} = \\frac{360°}{n}", CH: [10], FR: null },
  { id: "proba", theme: "no", label: "Probabilités", ex: "P = \\frac{\\text{cas favorables}}{\\text{cas possibles}}", CH: [11], FR: null },
  { id: "volcone", theme: "gm", label: "Volumes : pyramide, cône, boule", ex: "V = \\frac{1}{3} A_{\\text{base}} \\cdot h", CH: [11], FR: null },
  { id: "gquot", theme: "gm", label: "Grandeurs quotients (vitesse, masse volumique, débit)", ex: "\\rho = \\frac{m}{V}", CH: [11], FR: null },
  { id: "thales", theme: "gm", label: "Théorème de Thalès", ex: "\\frac{AD}{AB} = \\frac{AE}{AC} = \\frac{DE}{BC}", CH: [11], MP: [12, "S2"], FR: [9, 2] },
  { id: "idrem", theme: "fa", label: "Identités remarquables", ex: "(x + 3)^2 = x^2 + 6x + 9", CH: [11], again: [12], MP: [12, "S1"], FR: [9, 3] },
  { id: "factor", theme: "fa", label: "Factoriser", ex: "x^2 - 9 = (x - 3)(x + 3)", CH: [11], again: [12], MP: [12, "S1"], FR: [9, 4] },
  { id: "formule", theme: "fa", label: "Transformer une formule", ex: "v = \\frac{d}{t} \\iff t = \\frac{d}{v}", CH: [11], MP: [12, "S1"], FR: null },
  { id: "eq2", theme: "fa", label: "Équations produit nul", ex: "(x - 2)(x + 5) = 0", CH: [11], MP: [12, "S1"], FR: [9, 5] },
  { id: "eq2disc", theme: "fa", label: "Équations du 2e degré (formule)", ex: "x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}", CH: [11], again: [12], MP: [12, "S1"], FR: [11, 0] }, // 22.11 : FR 1re/Tle (tools/premiere_terminale_fr.md)
  { id: "sys2", theme: "fa", label: "Systèmes de deux équations", ex: "\\begin{cases} x + y = 7 \\\\ x - y = 1 \\end{cases}", CH: [11], again: [12], MP: [12, "S2"], FR: [10, 4] },
  { id: "angles", theme: "es", label: "Angles : parallèles, cercle", ex: "\\widehat{AOB} = 2\\,\\widehat{ACB}", CH: [11], again: [12], MP: [12, "S2"], FR: null },
  { id: "simil", theme: "es", label: "Homothéties et similitudes", ex: "\\text{aires} \\times k^2", CH: [11], again: [12], FR: null },
  { id: "polyop", theme: "fa", label: "Polynômes : développer et réduire", ex: "(2x - 1)^2 - (x + 3)(x - 3)", CH: [12], MP: [12, "S1"], FR: null },
  { id: "factor2", theme: "fa", label: "Factoriser au maximum", ex: "x^3 + 2x^2 - 9x - 18", CH: [12], MP: [12, "S1"], FR: null },
  { id: "eq3", theme: "fa", label: "Équations de degré 3 par factorisation", ex: "x^3 - 4x = 0", CH: [12], MP: null, FR: [10, 3] },
  { id: "sys3", theme: "fa", label: "Systèmes de trois équations", ex: "\\begin{cases} x + y + z = 6 \\\\ \\dots \\end{cases}", CH: [12], MP: [12, "S2"], FR: null },
  { id: "domaine", theme: "fa", label: "Domaine de définition", ex: "f(x) = \\frac{\\sqrt{x - 1}}{x - 3}", CH: [12], MP: [12, "S2"], FR: null },
  { id: "fimg", theme: "fa", label: "Images et préimages", ex: "f(x) = x^2 - 3 : \\; f(2) = 1", CH: [12], MP: [12, "S2"], FR: [10, 2] },
  { id: "f2", theme: "fa", label: "Parabole : zéros et sommet", ex: "f(x) = (x - 1)^2 - 4", CH: [12], MP: [13, "S1"], FR: [10, 6] },
  { id: "f2expr", theme: "fa", label: "Parabole : retrouver l'expression", ex: "f(x) = a(x - x_1)(x - x_2)", CH: [12], MP: [13, "S1"], FR: null },
  { id: "inter", theme: "fa", label: "Intersection de deux graphes", ex: "x^2 = x + 2", CH: [12], MP: [12, "S2"], FR: [10, 7] },
  { id: "ineq2", theme: "fa", label: "Inéquations du 2e degré", ex: "f(x) \\le g(x)", CH: [12], MP: null, FR: [11, 1] }, // 22.11 : FR 1re/Tle (tools/premiere_terminale_fr.md)
  { id: "racinv", theme: "fa", label: "Fonctions racine carrée et inverse", ex: "\\sqrt{x} = x - 2", CH: [12], MP: null, FR: null },
  { id: "euclide", theme: "es", label: "Théorèmes d'Euclide et de la hauteur", ex: "h^2 = p \\cdot q", CH: [12], MP: [12, "S2"], FR: null },
  { id: "droitesrem", theme: "es", label: "Droites remarquables du triangle", ex: "CG = \\frac{2}{3}\\,CM", CH: [12], MP: [12, "S2"], FR: null }, /* 26.11 (agent trousmp) : MP 1re, S2.GE.02 (Chap04 Géométrie) ; formes hors du cours MP : HORS_MP (src/engine.js) */
  { id: "trigo", theme: "es", label: "Trigonométrie du triangle rectangle", ex: "\\sin \\alpha = \\frac{\\text{opposé}}{\\text{hypoténuse}}", CH: [12], MP: [12, "S2"], FR: [9, 7] },
  { id: "polydiv", theme: "fa", label: "Division de polynômes", ex: "P(a) = \\text{reste de } P : (x - a)", CH: [13], MP: null, FR: null },
  { id: "polyfact", theme: "fa", label: "Factoriser un polynôme, racine évidente", ex: "x^3 - 7x + 6 = 0", CH: [13], MP: null, FR: null },
  { id: "fracrat", theme: "fa", label: "Fractions rationnelles", ex: "\\frac{1}{x-2} + \\frac{1}{x+2}", CH: [13], MP: [12, "S1"], FR: null },
  { id: "eqrat", theme: "fa", label: "Équations rationnelles", ex: "\\frac{3}{x - 1} = \\frac{2}{x + 4}", CH: [13], MP: null, FR: null },
  { id: "ineq", theme: "fa", label: "Inéquations du 1er degré", ex: "-2x + 5 \\le 11", CH: [12], MP: null, FR: [10, 7] },
  { id: "recip", theme: "fa", label: "Composition et réciproque", ex: "(f \\circ g)(x) = f(g(x))", CH: [13], MP: null, FR: [11, 3] },
  { id: "absval", theme: "fa", label: "Valeur absolue", ex: "|x - 3| = 5", CH: [12], MP: null, FR: [10, 6] },
  { id: "homog", theme: "fa", label: "Fonctions homographiques", ex: "f(x) = \\frac{2x + 1}{x - 3}", CH: [13], MP: null, FR: null },
  { id: "trigfn", theme: "fa", label: "Fonctions trigonométriques", ex: "f(x) = 3\\sin(2x)", CH: [13], MP: null, FR: [12, 5] }, // 22.11 : FR 1re/Tle (tools/premiere_terminale_fr.md)
  { id: "expo", theme: "fa", label: "Exponentielles", ex: "2^x = 32 \\iff x = 5", CH: [13], MP: null, FR: [11, 4] }, // 22.11 : FR 1re/Tle (tools/premiere_terminale_fr.md)
  { id: "log", theme: "fa", label: "Logarithmes", ex: "\\log_2 8 = 3", CH: [13], MP: null, FR: [12, 3] },
  { id: "trigcercle", theme: "es", label: "Cercle trigonométrique, radians", ex: "180° = \\pi \\text{ rad}", CH: [13], MP: [13, "S2"], FR: [11, 5] }, // 22.11 : FR 1re/Tle (tools/premiere_terminale_fr.md)
  { id: "trigeq", theme: "es", label: "Équations trigonométriques", ex: "\\sin x = \\frac{1}{2}", CH: [13], MP: [13, "S2"], FR: [12, 5] }, // 22.11 : FR 1re/Tle (tools/premiere_terminale_fr.md)
  { id: "sinlaw", theme: "es", label: "Triangle quelconque (sinus, cosinus)", ex: "c^2 = a^2 + b^2 - 2ab\\cos\\gamma", CH: [13], MP: [13, "S2"], FR: [11, 3] }, // 22.11 : FR 1re/Tle (tools/premiere_terminale_fr.md)
  { id: "cart", theme: "es", label: "Distance et milieu", ex: "d(A,B) = \\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}", CH: [13], MP: null, FR: [10, 5] },
  { id: "droites", theme: "es", label: "Équations de droites", ex: "y = mx + h", CH: [13], MP: null, FR: null },
  { id: "cercle", theme: "es", label: "Équations de cercles", ex: "(x - a)^2 + (y - b)^2 = r^2", CH: [13], MP: null, FR: [11, 8] }, // 22.11 : FR 1re/Tle (tools/premiere_terminale_fr.md)
  { id: "stats", theme: "no", label: "Statistiques (moyenne, médiane, écart-type)", ex: "\\bar{x}, \\text{ médiane}, \\sigma", CH: null /* 24.11 : ouverte à la 4e du Collège ; 25.11 (audit niveau) : retirée, niveau CO (moyenne de 5 nombres) : la 4e a « statdesc » (src/ch4c_ana.js) */, MP: [13, "S2"], FR: [10, 8] },
];

function placeOf(n, profile) {
  if (profile.system === "CH" && profile.track === "mp" && profile.grade >= 12 && n.MP !== undefined) return n.MP;
  return n[profile.system];
}

// Niveaux proposés à l'élève : clé interne (système + année) et libellé.
const SYSTEMS = {
  CH: { label: "Suisse romande", grades: [[9, "9e"], [10, "10e"], [11, "11e"], [12, "1re (sec. II)"], [13, "2e (sec. II)"], [14, "3e (sec. II)"], [15, "4e (sec. II)"]] },
  // 22.11 : 3e et 4e du Collège (grade 14, 15). Programme : tools/programme_3e_4e_college.md.
  // 24.11 : aussi MP 3e et 4e (grade 14, 15, track « mp » : src/ch_mp3.js, src/ch_mp4.js) ; le moteur distingue par la filière (placeOf).
  // FR: { label: "France", grades: [[6, "6e"], [7, "5e"], [8, "4e"], [9, "3e"], [10, "2nde"], [11, "1re"]] }, // masqué (bêta genevoise)
};
// 22.11 : systèmes définis mais pas proposés dans l'interface (France : collège rendu jouable, ouverture à décider).
// Sert au moteur (Mathélo, libellés de classe) et aux tests avec des profils { system: "FR", grade: 6…9 }.
// 25.11 (audit France, tools/france.md) : terminale ajoutée (notions de src/fr_lycee.js placées en 12).
const SYSTEMS_HIDDEN = { FR: { label: "France", grades: [[6, "6e"], [7, "5e"], [8, "4e"], [9, "3e"], [10, "2nde"], [11, "1re"], [12, "Tle"]] } };

// Usages français (25.11, audit France : tools/france.md § 4). Appliqué aux textes d'un profil FR seulement (Engine.finalize,
// rendu de l'app) ; jamais pour un profil suisse. Idempotent. Sans décision de l'enseignant : seulement ce qui est un défaut
// certain pour un élève français (monnaie, séparateur des milliers, sigles PGDC / PPMC, « préimage », « mise en évidence »).
// Genève → Lyon : énoncés seulement (FR_QWORDS, frLocalQ) ; un seul énoncé au catalogue français le 25.11 : une cycliste « part de Genève »). Les énoncés propres à la
// Suisse (change EUR ↔ CHF, TVA suisse) sont écartés du tirage par horsCO (src/engine.js), pas traduits.
// Produit : × en France (décision du 25.11, frTimes) ; laissé pour décision : « cercle de Thalès ».
const FR_WORDS = [
  [/\ben (CHF|francs)\b/g, "en euros"], [/\bCHF\b/g, "€"], [/au franc près/g, "à l'euro près"], [/(\d|\\\)) francs\b/g, "$1 euros"], [/\bde francs\b/g, "d'euros"],
  [/produit \(·\), quotient \(:\)/g, "produit (×), quotient (÷)"], /* 26.11 (revue p4, n° 10 : rappel de tradexpr, 5e FR) */
  [/\bapprentis\b/g, "élèves"], /* 26.11 soir (revue des élèves joués, n° 13 : « Sondage auprès de 40 apprentis » en 4e FR, école professionnelle suisse) */
  /* 25.11 (couverture France) : équation réduite y = mx + p ; « côtés de l'angle droit » (cathètes : usage suisse) ;
     « ensemble de définition » (domaine de définition : usage suisse ; « l'aire du domaine » inchangé). */
  [/\bmx \+ h\b/g, "mx + p"], [/\b([Ll])es cathètes\b/g, "$1es côtés de l'angle droit"], [/\bcathètes\b/g, "côtés de l'angle droit"], [/\b([Ll])a cathète(?![a-zà-ÿ])/g, "$1e côté de l'angle droit"], [/\bcathète(?![a-zà-ÿ])/g, "côté de l'angle droit"],
  [/\b([Ll])e domaine de définition\b/g, "$1'ensemble de définition"], [/\bdu domaine de définition\b/g, "de l'ensemble de définition"], [/\bdomaine de définition\b/g, "ensemble de définition"], [/\bdu domaine de (?=\\\()/g, "de l'ensemble de définition de "],
  [/PGDC/g, "PGCD"], [/PPMC/g, "PPCM"],
  /* 26.11 soir (vraisemblance, profils séparés) : « arrondie au franc supérieur (€) », « pas des francs », « Sur 50 apprentis
     interrogés » (apprenti = filière professionnelle suisse ; en France, élèves de collège et de lycée). */
  [/\bau franc (supérieur|inférieur)\b/g, "à l'euro $1"], [/\bdes francs\b/g, "des euros"], [/\b([Cc]haque|[Uu]n|[Pp]ar) franc\b/g, "$1 euro"],
  [/\b([Aa])pprenti(e?)(s?)\b/g, (m, a, e, p) => (a === "A" ? "É" : "é") + "lève" + p],
  [/\b([Ll])a préimage\b/g, (m, a) => a + "'antécédent"], [/\b([Uu])ne seule préimage\b/g, (m, a) => a + "n seul antécédent"],
  [/\b([Uu])ne préimage\b/g, (m, a) => a + "n antécédent"], [/\b([Ss])a préimage\b/g, (m, a) => a + "on antécédent"], [/\b([Pp]lus) (grande|petite) préimage\b/g, (m, a, b) => a + " " + b.slice(0, -1) + " antécédent"],
  [/\bpréimages\b/g, "antécédents"], [/\bPréimages\b/g, "Antécédents"], [/\bpréimage\b/g, "antécédent"], [/\bPréimage\b/g, "Antécédent"],
  [/\b([Ff])actorise \(mise en évidence\)/g, "$1actorise (facteur commun)"],
  [/\b([Mm])ise en évidence d(?:e |')/g, (m, a) => (a === "M" ? "F" : "f") + "actorisation par "],
  [/\b([Mm])ise en évidence\b/g, (m, a) => (a === "M" ? "F" : "f") + "acteur commun"], [/\b([Mm])ets en évidence\b/g, (m, a) => (a === "M" ? "F" : "f") + "actorise"],
  [/\b([Aa])près ((?:(?!en évidence)[^.;!?]){1,40}?) en évidence\b/g, "$1près factorisation par $2"], [/\b([Mm])ettre en évidence\b/g, (m, a) => (a === "M" ? "F" : "f") + "actoriser"], [/\b([Mm])et(s|tre|) ((?:(?!en évidence)[^.;!?]){1,40}?) en évidence\b/g, (m, a, t, x) => (a === "M" ? "F" : "f") + "actorise" + (t === "tre" ? "r" : "") + " par " + x] /* 26.11 soir : aussi « on met (x + 4) en évidence » */, [/\bmettant en évidence\b/g, "factorisant"], [/\bmis en évidence\b/g, "mis en facteur"],
  /* 26.11 (audit lycée, tools/audit_fr_lycee_26-11.md) : « graphe » → courbe (représentative), « axe horizontal / vertical »
     → axe des abscisses / des ordonnées, « composantes » d'un vecteur → coordonnées, « zéro(s) » d'une fonction → racine(s)
     (au lycée seulement : FR_ZERO ci-dessous). */
  [/\b([Ll])e graphe\b/g, "$1a courbe"], [/\bau graphe\b/g, "à la courbe"], [/\bdu graphe\b/g, "de la courbe"], [/\b([Ll])es graphes\b/g, "$1es courbes"],
  [/\bdes graphes\b/g, "des courbes"], [/\b([Ss])on graphe\b/g, "$1a courbe"], [/\bun graphe\b/g, "une courbe"],
  [/\bdeux graphes\b/g, "deux courbes"], [/(?<!d')\baxe horizontal\b(?! de symétrie)/g, "axe des abscisses"], [/(?<!d')\baxe vertical\b(?! de symétrie)/g, "axe des ordonnées"],
  [/\\\)\s+en évidence\b/g, "\\) en facteur"], [/\b([Ll])e domaine de (?=[a-z] ∘)/g, "$1'ensemble de définition de "],
  [/\b([Cc])omposante(s?)\b/g, "$1oordonnée$2"],
];
/* 26.11 (audit lycée) : « zéro(s) » d'une fonction → racine(s), au lycée seulement (au collège, « racine » évoque la racine
   carrée) ; le nombre zéro et les zéros d'un nombre écrit (« complète par des zéros », « compte les zéros ») restent.
   Lu par frIdTxt (questions, Engine.finalize) et frDom (leçons, src/app.js) pour une classe française ≥ 2nde. */
const FR_ZERO = [
  [/\b(?:le |les |des )?zéro(s?) du (numérateur|dénominateur)\b/g, (m, p, w) => (p ? "les valeurs qui annulent" : "la valeur qui annule") + " le " + w],
  [/\b([Ll])e plus (petit|grand) zéro\b/g, "$1a plus $2e racine"], [/\b([Ss])on plus (petit|grand) zéro\b/g, "$1a plus $2e racine"], [/\b([Uu])n seul zéro\b/g, "$1ne seule racine"],
  [/\b([Pp]lus) (petit|grand) zéro\b/g, "$1 $2e racine"], [/\bzéro évident\b/g, "racine évidente"],
  [/\bzéro (positif|négatif|entier)\b/g, (m, a) => "racine " + { positif: "positive", "négatif": "négative", entier: "entière" }[a]],
  [/\b([Ll])e zéro\b/g, "$1a racine"], [/\b([Uu])n zéro\b/g, "$1ne racine"], [/\b([Ss])on zéro\b/g, "$1a racine"], [/\bdu zéro\b/g, "de la racine"], [/\bau zéro\b/g, "à la racine"],
  [/\bchaque zéro\b/g, "chaque racine"], [/\bZéro(?= \?| de )/g, "Racine"],
  [/\b([Tt])ous les zéros de\b/g, "$1outes les racines de"], [/(?<!(?:avec|par|ajouter|ajoute|ompte|omplète|tous|Tous) )\b(les|Les|des|ses|Ses|aux|deux|ces) zéros\b(?! après| <b>après| : le 1)/g, "$1 racines"], [/\bde zéros (?=\\\(|[-\d−])/g, "de racines "],
  [/\bzéros (?=\\\()/g, "racines "], [/\bzéro (?=\\\()/g, "racine "], [/\bracines sont (in|ex)clus\b/g, "racines sont $1cluses"], [/\bracines sont compris\b/g, "racines sont comprises"], [/\bQuels sont (les|ses|leurs) racines/g, "Quelles sont $1 racines"], [/(racines de [^,;.]{1,12}, pas) ceux\b/g, "$1 celles"], [/\bQuel est (sa|la) plus (petite|grande) racine/g, "Quelle est $1 plus $2 racine"],
];
const frZero = (t) => FR_ZERO.reduce((a, [re, by]) => a.replace(re, by), t);
/* 27.11 (décision de l'enseignant, n° 18) : en 4e et en 3e françaises, le « zéro » d'une fonction se dit « antécédent de 0 »
   (le collège ne parle ni de zéro ni de racine d'une fonction). Formes du sens « fonction » seulement (lectgraph, fimg,
   affine, leçons) ; le nombre zéro (« loin de zéro », « complète par des zéros », « autant que de zéros ») reste. Lycée :
   « racine » (FR_ZERO) ; Suisse : inchangé. Lu par frIdTxt (questions) et frDom (leçons, écrans, src/app.js). */
const FR_ZERO_COL = [
  [/\bCombien de zéros (\\\(.*?\\\)) a-t-elle\s*\?/g, "Combien 0 a-t-il d'antécédents par $1 ?"],
  [/\b([Ss]on|[Ll]e) plus (petit|grand) zéro\b/g, "$1 plus $2 antécédent de 0"], [/\b([Pp]lus) (petit|grand) zéro\b/g, "$1 $2 antécédent de 0"],
  [/\bzéro (positif|négatif|entier)\b/g, "antécédent de 0 $1"], [/\(le zéro\)/g, "(l'antécédent de 0)"],
  [/\b([Ll])e zéro d(?:e |')(?=\\\(|[a-z]\b|la fonction|une fonction)/g, "$1'antécédent de 0 par "],
  [/\b([Ll]es|[Dd]es|[Ss]es) zéros d(?:e |')(?=\\\(|[a-z]\b|la fonction|une fonction|la parabole)/g, "$1 antécédents de 0 par "],
  [/\b([Uu]n) zéro\b(?= \(| se lit)/g, "$1 antécédent de 0"],
  [/\b([Ll]es|[Dd]es|[Ss]es) zéros\b(?= \\\(| \(f| sont (?:exclus|inclus|solutions|symétriques|les|\d|\\\()| sur (?:un|le) graphique| [-−\d])/g, "$1 antécédents de 0"],
  [/\bZéros :/g, "Antécédents de 0 :"], [/\bzéros (?=\\\()/g, "antécédents de 0 "],
];
const frZeroCol = (t) => FR_ZERO_COL.reduce((a, [re, by]) => a.replace(re, by), t);
function frThouPart(t, tex) {
  return tex ? frTimes(t.replace(/\\text\{['’]\}/g, "\\,").replace(/(\d)['’](?=\d{3}(?!\d))/g, "$1\\,"))
    : t.replace(/\\text\{['’]\}/g, "\u202f").replace(/(\d)['’](?=\d{3}(?!\d))/g, "$1\u202f").replace(/(\d|\)|\?)\s·\s(?=[\d(?]|[a-zA-Z](?![A-Za-zÀ-ÿ]))/g, "$1 × ").replace(/(^|[^A-Za-zÀ-ÿ0-9])([a-zA-Z])\s·\s(?=[\d(]|[a-zA-Z](?![A-Za-zÀ-ÿ]))/g, "$1$2 × "); /* 25.11 soir : produit seulement (nombres, lettres isolées, parenthèses), pas les séparateurs de l'interface (« Mathélo · provisoire ») */
}
/* 25.11 (décision de l'enseignant) : en France, le produit s'écrit × et non avec le point médian. Le produit scalaire
   (formule avec \vec ou \overrightarrow) garde son point. */
function frTimes(t) { return /\\vec|\\overrightarrow/.test(t) ? t : t.replace(/\\cdot(?![a-zA-Z])/g, "\\times"); }
const frWords = (t) => FR_WORDS.reduce((a, [re, by]) => a.replace(re, by), t);
/* formule seule (préfiltre MathJax) */
function frLocalPart(t, tex) { return frWords(frThouPart(t, tex)); }
/* texte avec formules \( … \) : milliers selon le mode, puis les mots sur tout le texte (« mets \(t\) en évidence ») */
function frLocal(s) {
  if (typeof s !== "string" || !s) return s;
  return frWords(s.split(/(\\\([\s\S]*?\\\))/).map((t, i) => frThouPart(t, i % 2 === 1)).join(""));
}
/* Énoncés de questions seulement (25.11 soir : « Collège de Genève » devenait « Collège de Lyon » dans la présentation
   aux enseignants) : les lieux suisses d'un énoncé deviennent français ; l'interface et les pages genevoises, jamais. */
const FR_QWORDS = [[/\bGenève–Berne\b/g, "Lyon–Grenoble"] /* 26.11 soir : « trajet Lyon–Berne » */, [/\bGenève\b/g, "Lyon"], [/\bLa Brévine\b/g, "Mouthe"] /* 26.11 soir : village du Jura suisse ; Mouthe (Doubs), son équivalent français */];
/* 26.11 (audit lycée) : textes d'une question française selon la notion (Engine.finalize) : ordonnée à l'origine p (et non h)
   dans les équations de droites ; produit écrit × (et non ·) hors du produit scalaire de deux vecteurs (AB · AC, u · v). */
const FR_ORD_P = new Set(["droites", "droitesinter"]);
function frIdTxt(id, s, grade) {
  if (typeof s !== "string" || !s) return s;
  if (grade >= 10) s = frZero(s); else if (grade >= 8) s = frZeroCol(s); /* 27.11, n° 18 : 4e–3e, « antécédent de 0 » */
  if (FR_ORD_P.has(id)) s = s.replace(/(^|[^\\\w\/'’])h(?![\w'’])/g, "$1p");
  return s.replace(/(\S)[  ]?·[  ]?(?=\S)/g, (m, a, i, all) => {
    const L = all.slice(Math.max(0, i - 2), i + 1), R = all.slice(i + m.length, i + m.length + 3);
    return /(?:[A-Z]{2}|(?:^|[^A-Za-z'’])[uvwn])$/.test(L) && /^(?:[A-Z]{2}|[uvwn])(?![A-Za-z'’])/.test(R) ? m : a + " × ";
  });
}
function frLocalQ(s) { const r = frLocal(s); return typeof r === "string" ? FR_QWORDS.reduce((a, [re, by]) => a.replace(re, by), r) : r; }

// Difficulté maximale (1 = bases, 3 = approfondi) : on ne demande pas la section à l'élève ;
// c'est le Mathélo qui situe son niveau. Seules les petites classes (6e, 5e) plafonnent à 2.
function difficultyCap(profile) {
  return profile.system === "FR" && profile.grade <= 7 ? 2 : 3;
}

// Mois de l'année scolaire (0 = septembre ; août compte comme septembre).
function schoolMonth(date) {
  const mo = date.getMonth(); // 0 = janvier
  if (mo >= 7) return Math.max(0, mo - 8);
  return mo + 4; // janvier = 4 … juin = 9, juillet = 10
}
