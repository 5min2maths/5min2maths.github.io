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
  { id: "decim", theme: "no", label: "Nombres décimaux", ex: "3{,}47 \\approx 3{,}5", CH: [9], again: [10], FR: null },
  { id: "prio", theme: "no", label: "Priorités des opérations", ex: "3 + 4 \\cdot 2 = 11", CH: [9], again: [10,11], FR: [6, 1] },
  { id: "rel", theme: "no", label: "Nombres relatifs", ex: "(-3) - 5 \\cdot (-2) = 7", CH: [9], again: [10,11], MP: [12, "S1"], FR: [7, 2] },
  { id: "arith", theme: "no", label: "Diviseurs, PGDC et PPMC", ex: "\\text{PGDC}(24 ; 36) = 12", CH: [9], again: [10], MP: [12, "S1"], FR: null },
  { id: "fracadd", theme: "no", label: "Fractions : simplifier, additionner", ex: "\\frac{2}{3} + \\frac{1}{4} = \\frac{11}{12}", CH: [9], again: [10,11], MP: [12, "S1"], FR: [7, 4] },
  { id: "diagr", theme: "no", label: "Diagrammes et moyennes", ex: "\\bar{x} = \\frac{\\text{somme}}{\\text{effectif}}", CH: [9], again: [10], FR: null },
  { id: "unites", theme: "gm", label: "Unités de mesure", ex: "1\\ \\text{dm}^3 = 1\\ \\text{L}", CH: [9], again: [10], FR: null },
  { id: "aires", theme: "gm", label: "Périmètres et aires", ex: "\\text{triangle : } \\frac{b \\cdot h}{2}", CH: [9], again: [10], FR: [6, 5] },
  { id: "vol", theme: "gm", label: "Volumes : pavé, prisme, cylindre", ex: "V = A_{\\text{base}} \\cdot h", CH: [9], again: [10,11], FR: [8, 8] },
  { id: "prop", theme: "fa", label: "Proportionnalité, règle de trois", ex: "3 \\text{ kg} \\to 7{,}50 \\text{ CHF}, \\; 5 \\text{ kg} \\to ?", CH: [9], again: [10], FR: [6, 3] },
  { id: "valnum", theme: "fa", label: "Expressions littérales", ex: "3x^2 \\text{ pour } x = -2 \\text{ vaut } 12", CH: [9], again: [10,11], FR: [7, 5] },
  { id: "angtri", theme: "es", label: "Angles des triangles et quadrilatères", ex: "\\alpha + \\beta + \\gamma = 180°", CH: [9], FR: null },
  { id: "fracmul", theme: "no", label: "Fractions : multiplier, diviser", ex: "\\frac{2}{3} \\cdot \\frac{9}{4} = \\frac{3}{2}", CH: [10], again: [11], MP: [12, "S1"], FR: [8, 2] },
  { id: "pct", theme: "no", label: "Pourcentages", ex: "15\\,\\% \\text{ de } 80 = 12", CH: [10], FR: [6, 6] },
  { id: "puiss", theme: "no", label: "Puissances", ex: "2^3 \\cdot 2^4 = 2^7", CH: [10], again: [11], MP: [12, "S1"], FR: [8, 3] },
  { id: "sci", theme: "no", label: "Notation scientifique", ex: "0{,}0042 = 4{,}2 \\cdot 10^{-3}", CH: [10], again: [11], FR: [8, 4] },
  { id: "rac", theme: "no", label: "Racines carrées", ex: "\\sqrt{72} = 6\\sqrt{2}", CH: [10], again: [11], MP: [12, "S1"], FR: [9, 2] },
  { id: "disque", theme: "gm", label: "Cercle et disque", ex: "A = \\pi r^2", CH: [10], FR: null },
  { id: "vitesse", theme: "gm", label: "Vitesse, distance, durée", ex: "150 \\text{ km en } 2 \\text{ h} \\to 75 \\text{ km/h}", CH: [10], again: [11], FR: [8, 7] },
  { id: "pyth", theme: "gm", label: "Théorème de Pythagore", ex: "a^2 + b^2 = c^2", CH: [10], again: [11], MP: [12, "S2"], FR: [8, 3] },
  { id: "reduire", theme: "fa", label: "Réduire une expression", ex: "3x + 5 - x + 2 = 2x + 7", CH: [10], again: [11], MP: [12, "S1"], FR: [7, 6] },
  { id: "distrib", theme: "fa", label: "Développer", ex: "(x + 2)(x - 3) = x^2 - x - 6", CH: [10], again: [11], MP: [12, "S1"], FR: [8, 5] },
  { id: "eq1", theme: "fa", label: "Équations du 1er degré", ex: "3x - 5 = 7 \\iff x = 4", CH: [10], again: [11,12], MP: [12, "S1"], FR: [8, 6] },
  { id: "probeq", theme: "fa", label: "Mettre un problème en équation", ex: "n + (n+1) + (n+2) = 48", CH: [10], again: [11], MP: [12, "S1"], FR: null },
  { id: "echelle", theme: "fa", label: "Échelles et pentes", ex: "1 : 200 : \\; 3 \\text{ cm} \\to 6 \\text{ m}", CH: [10], FR: [9, 6] },
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
  { id: "eq2disc", theme: "fa", label: "Équations du 2e degré (formule)", ex: "x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}", CH: [11], again: [12], MP: [12, "S1"], FR: [11, 2] },
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
  { id: "ineq2", theme: "fa", label: "Inéquations du 2e degré", ex: "f(x) \\le g(x)", CH: [12], MP: null, FR: null },
  { id: "racinv", theme: "fa", label: "Fonctions racine carrée et inverse", ex: "\\sqrt{x} = x - 2", CH: [12], MP: null, FR: null },
  { id: "euclide", theme: "es", label: "Théorèmes d'Euclide et de la hauteur", ex: "h^2 = p \\cdot q", CH: [12], MP: [12, "S2"], FR: null },
  { id: "droitesrem", theme: "es", label: "Droites remarquables du triangle", ex: "CG = \\frac{2}{3}\\,CM", CH: [12], MP: null, FR: null },
  { id: "trigo", theme: "es", label: "Trigonométrie du triangle rectangle", ex: "\\sin \\alpha = \\frac{\\text{opposé}}{\\text{hypoténuse}}", CH: [12], MP: [12, "S2"], FR: [9, 7] },
  { id: "polydiv", theme: "fa", label: "Division de polynômes", ex: "P(a) = \\text{reste de } P : (x - a)", CH: [13], MP: null, FR: null },
  { id: "polyfact", theme: "fa", label: "Factoriser un polynôme, racine évidente", ex: "x^3 - 7x + 6 = 0", CH: [13], MP: null, FR: null },
  { id: "fracrat", theme: "fa", label: "Fractions rationnelles", ex: "\\frac{1}{x-2} + \\frac{1}{x+2}", CH: [13], MP: [12, "S1"], FR: null },
  { id: "eqrat", theme: "fa", label: "Équations rationnelles", ex: "\\frac{3}{x - 1} = \\frac{2}{x + 4}", CH: [13], MP: null, FR: null },
  { id: "ineq", theme: "fa", label: "Inéquations, tableau des signes", ex: "\\frac{x - 1}{x + 2} \\le 0", CH: [13], MP: null, FR: [10, 7] },
  { id: "recip", theme: "fa", label: "Composition et réciproque", ex: "(f \\circ g)(x) = f(g(x))", CH: [13], MP: null, FR: [11, 3] },
  { id: "absval", theme: "fa", label: "Valeur absolue", ex: "|x - 3| = 5", CH: [13], MP: null, FR: [10, 6] },
  { id: "homog", theme: "fa", label: "Fonctions homographiques", ex: "f(x) = \\frac{2x + 1}{x - 3}", CH: [13], MP: null, FR: null },
  { id: "trigfn", theme: "fa", label: "Fonctions trigonométriques", ex: "f(x) = 3\\sin(2x)", CH: [13], MP: null, FR: null },
  { id: "expo", theme: "fa", label: "Exponentielles", ex: "2^x = 32 \\iff x = 5", CH: [13], MP: null, FR: [11, 5] },
  { id: "log", theme: "fa", label: "Logarithmes", ex: "\\log_2 8 = 3", CH: [13], MP: null, FR: [12, 3] },
  { id: "trigcercle", theme: "es", label: "Cercle trigonométrique, radians", ex: "180° = \\pi \\text{ rad}", CH: [13], MP: [13, "S2"], FR: [11, 6] },
  { id: "trigeq", theme: "es", label: "Équations trigonométriques", ex: "\\sin x = \\frac{1}{2}", CH: [13], MP: [13, "S2"], FR: [11, 7] },
  { id: "sinlaw", theme: "es", label: "Triangle quelconque (sinus, cosinus)", ex: "c^2 = a^2 + b^2 - 2ab\\cos\\gamma", CH: [13], MP: [13, "S2"], FR: null },
  { id: "cart", theme: "es", label: "Distance et milieu", ex: "d(A,B) = \\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}", CH: [13], MP: null, FR: [10, 5] },
  { id: "droites", theme: "es", label: "Équations de droites", ex: "y = mx + h", CH: [13], MP: null, FR: null },
  { id: "cercle", theme: "es", label: "Équations de cercles", ex: "(x - a)^2 + (y - b)^2 = r^2", CH: [13], MP: null, FR: null },
  { id: "stats", theme: "no", label: "Statistiques (moyenne, médiane, écart-type)", ex: "\\bar{x}, \\text{ médiane}, \\sigma", CH: null, MP: [13, "S2"], FR: [10, 8] },
];

function placeOf(n, profile) {
  if (profile.system === "CH" && profile.track === "mp" && n.MP !== undefined) return n.MP;
  return n[profile.system];
}

// Niveaux proposés à l'élève : clé interne (système + année) et libellé.
const SYSTEMS = {
  CH: { label: "Suisse romande", grades: [[9, "9e"], [10, "10e"], [11, "11e"], [12, "1re (sec. II)"], [13, "2e (sec. II)"]] },
  // FR: { label: "France", grades: [[6, "6e"], [7, "5e"], [8, "4e"], [9, "3e"], [10, "2nde"], [11, "1re"]] }, // masqué (bêta genevoise)
};

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
