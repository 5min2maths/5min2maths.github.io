// Catalogue des notions et correspondance des niveaux (Suisse romande / France).
// grade : année où la notion est introduite (CH : 9-11 ; FR : 6-9 avec 6=6e, 7=5e, 8=4e, 9=3e).
// m : mois de l'année scolaire où elle est en général traitée (0 = septembre … 9 = juin).
const THEMES = {
  nombres: "Nombres et calculs",
  algebre: "Calcul littéral et équations",
  prop: "Proportionnalité",
  geo: "Géométrie et mesures",
  fonctions: "Fonctions",
};

const NOTIONS = [
  { id: "prio", theme: "nombres", label: "Priorités des opérations", ex: "3 + 4 \\cdot 2 = 11", CH: [9, 0], FR: [6, 1] },
  { id: "rel", theme: "nombres", label: "Nombres relatifs", ex: "(-3) - 5 \\cdot (-2) = 7", CH: [9, 1], FR: [7, 2] },
  { id: "fracadd", theme: "nombres", label: "Additionner des fractions", ex: "\\frac{2}{3} + \\frac{1}{4} = \\frac{11}{12}", CH: [9, 3], FR: [7, 4] },
  { id: "fracmul", theme: "nombres", label: "Multiplier, diviser des fractions", ex: "\\frac{2}{3} \\cdot \\frac{9}{4} = \\frac{3}{2}", CH: [10, 1], FR: [8, 2] },
  { id: "pct", theme: "nombres", label: "Pourcentages", ex: "15\\,\\% \\text{ de } 80 = 12", CH: [9, 6], FR: [6, 6] },
  { id: "puiss", theme: "nombres", label: "Puissances", ex: "2^3 \\cdot 2^4 = 2^7", CH: [10, 2], FR: [8, 3] },
  { id: "sci", theme: "nombres", label: "Notation scientifique", ex: "0{,}0042 = 4{,}2 \\cdot 10^{-3}", CH: [10, 3], FR: [8, 4] },
  { id: "rac", theme: "nombres", label: "Racines carrées", ex: "\\sqrt{72} = 6\\sqrt{2}", CH: [11, 0], FR: [9, 2] },
  { id: "valnum", theme: "algebre", label: "Remplacer une lettre par un nombre", ex: "3x^2 \\text{ pour } x = -2 \\text{ vaut } 12", CH: [9, 4], FR: [7, 5] },
  { id: "reduire", theme: "algebre", label: "Réduire une expression", ex: "3x + 5 - x + 2 = 2x + 7", CH: [9, 5], FR: [7, 6] },
  { id: "distrib", theme: "algebre", label: "Développer", ex: "(x + 2)(x - 3) = x^2 - x - 6", CH: [10, 4], FR: [8, 5] },
  { id: "idrem", theme: "algebre", label: "Identités remarquables", ex: "(x + 3)^2 = x^2 + 6x + 9", CH: [11, 4], FR: [9, 3] },
  { id: "factor", theme: "algebre", label: "Factoriser", ex: "x^2 - 9 = (x - 3)(x + 3)", CH: [11, 5], FR: [9, 4] },
  { id: "eq1", theme: "algebre", label: "Équations du 1er degré", ex: "3x - 5 = 7 \\iff x = 4", CH: [10, 6], FR: [8, 6] },
  { id: "eq2", theme: "algebre", label: "Équations produit nul", ex: "(x - 2)(x + 5) = 0", CH: [11, 6], FR: [9, 5] },
  { id: "prop", theme: "prop", label: "Proportionnalité, règle de trois", ex: "3 \\text{ kg} \\to 7{,}50 \\text{ CHF}, \\; 5 \\text{ kg} \\to ?", CH: [9, 2], FR: [6, 3] },
  { id: "vitesse", theme: "prop", label: "Vitesse moyenne, durées", ex: "150 \\text{ km en } 2 \\text{ h} \\to 75 \\text{ km/h}", CH: [11, 3], FR: [8, 7] },
  { id: "echelle", theme: "prop", label: "Échelle, agrandissement, réduction", ex: "1 : 200 : \\; 3 \\text{ cm} \\to 6 \\text{ m}", CH: [11, 3], FR: [9, 6] },
  { id: "aires", theme: "geo", label: "Aires de figures planes", ex: "\\text{triangle : } \\frac{b \\cdot h}{2}", CH: [9, 3], FR: [6, 5] },
  { id: "pyth", theme: "geo", label: "Théorème de Pythagore", ex: "3^2 + 4^2 = 5^2", CH: [11, 1], FR: [8, 3] },
  { id: "vol", theme: "geo", label: "Volumes de solides", ex: "V_{\\text{cône}} = \\frac{\\pi r^2 h}{3}", CH: [10, 5], FR: [8, 8] },
  { id: "thales", theme: "geo", label: "Théorème de Thalès", ex: "\\frac{AD}{AB} = \\frac{AE}{AC} = \\frac{DE}{BC}", CH: [11, 7], FR: [9, 2] },
  { id: "affine", theme: "fonctions", label: "Fonctions affines", ex: "f(x) = 2x - 3, \\; f(4) = 5", CH: [11, 9], FR: [9, 7] },
  // ---- Secondaire II : 1re du Collège (HarmoS 12) ; FR 2nde = 10, 1re = 11 ; null = hors programme ----
  { id: "eq3", theme: "algebre", label: "Équations de degré 3 par factorisation", ex: "x^3 - 4x = 0", CH: [12, 2], FR: [10, 3] },
  { id: "eq2disc", theme: "algebre", label: "Équations du 2e degré (discriminant)", ex: "\\Delta = b^2 - 4ac", CH: [12, 2], FR: [11, 2] },
  { id: "sys2", theme: "algebre", label: "Systèmes de deux équations", ex: "\\begin{cases} x + y = 7 \\\\ x - y = 1 \\end{cases}", CH: [12, 3], FR: [10, 4] },
  { id: "fimg", theme: "fonctions", label: "Images et préimages", ex: "f(x) = x^2 - 3 : \\; f(2) = 1", CH: [12, 4], FR: [10, 2] },
  { id: "f2", theme: "fonctions", label: "Parabole : sommet et zéros", ex: "f(x) = (x - 1)^2 - 4", CH: [12, 5], FR: [10, 6] },
  { id: "inter", theme: "fonctions", label: "Intersection de deux graphes", ex: "x^2 = x + 2", CH: [12, 6], FR: [10, 7] },
  { id: "angles", theme: "geo", label: "Angles au centre et inscrits", ex: "\\widehat{AOB} = 2\\,\\widehat{ACB}", CH: [12, 7], FR: null },
  { id: "euclide", theme: "geo", label: "Théorèmes de la hauteur et d'Euclide", ex: "h^2 = p \\cdot q", CH: [12, 8], FR: null },
  { id: "trigo", theme: "geo", label: "Trigonométrie du triangle rectangle", ex: "\\sin \\alpha = \\frac{\\text{opposé}}{\\text{hypoténuse}}", CH: [12, 8], FR: [9, 7] },
];

// Niveaux proposés à l'élève : clé interne (système + année) et libellé.
const SYSTEMS = {
  CH: { label: "Suisse romande", grades: [[9, "9e"], [10, "10e"], [11, "11e"], [12, "1re du Collège (sec. II)"]] },
  FR: { label: "France", grades: [[6, "6e"], [7, "5e"], [8, "4e"], [9, "3e"], [10, "2nde"]] },
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
