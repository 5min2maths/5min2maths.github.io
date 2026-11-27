



(() => {
if (typeof PROBX === "undefined") return;
const ri = R.int, pk = R.pick;
const r6 = (v) => Math.round(v * 1e6) / 1e6;
const N = (v) => { const s = String(r6(v)), neg = s[0] === "-", [i, f] = (neg ? s.slice(1) : s).split("."); return (neg ? "-" : "") + (+i >= 1000 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}") : i) + (f ? "{,}" + f : ""); };
const X = (v) => M(N(v));
const PX = (id, cl, f) => { (PROBX[id] = PROBX[id] || []).push(() => Object.assign(f(), cl)); };
const PB = (q, parts, hints, sol) => ({ q, hints, sol, parts: parts.map(([label, v, rd]) => ({ label, spec: Object.assign({ kind: "value", value: r6(v) }, rd ? { round: rd } : {}) })) });
const gcd = (a, b) => (b ? gcd(b, a % b) : a);


const OPT = { co: [12, 13], mp: [13, 14] };
PX("optim", OPT, () => {
let p0, n0, k, x; do { p0 = pk([20, 24, 30]); n0 = pk([300, 360, 420, 480, 540]); k = pk([5, 6, 8, 10, 12]); x = (n0 - k * p0) / (2 * k); } while (!(x >= 2 && Number.isInteger(x * 2)));
const P = p0 + x, n = n0 - k * x, Rm = r6(P * n);
return PB("Un théâtre vend " + X(n0) + " billets par soir au prix de " + p0 + " CHF. Une étude montre que chaque franc d'augmentation du prix fait perdre " + k + " spectateurs (et chaque franc de baisse en fait gagner autant). On note " + M("x") + " l'augmentation du prix en CHF.",
[["a) Augmentation " + M("x") + " qui rend la recette maximale, en CHF", x], ["b) Prix du billet correspondant, en CHF", P], ["c) Recette maximale, en CHF", Rm]],
["Recette : " + M("R(x) = (" + p0 + " + x)(" + n0 + " - " + k + "x)") + ", une fonction du 2e degré.", "Le maximum est au sommet de la parabole, au milieu de ses deux zéros."],
M("R(x) = (" + p0 + " + x)(" + n0 + " - " + k + "x)") + " s'annule en " + M("x = -" + p0) + " et " + M("x = " + N(n0 / k)) + ". Sommet au milieu : " + M("x = \\frac{-" + p0 + " + " + N(n0 / k) + "}{2} = " + N(x)) + ". b) " + M(p0 + " + " + N(x) + " = " + N(P)) + " CHF. c) " + M(N(P) + " \\cdot " + N(n) + " = " + N(Rm)) + " CHF (" + N(n) + " spectateurs).");
});
PX("optim", OPT, () => {
const v = pk([12, 14, 16, 18, 22, 24]), h0 = pk([2, 3, 5]), tm = v / 10, hm = r6(h0 + (v * v) / 20), tg = (v + Math.sqrt(v * v + 20 * h0)) / 10;
return PB("Un ballon est lancé vers le haut. Sa hauteur (en m) après " + M("t") + " secondes est " + M("h(t) = -5t^2 + " + v + "t + " + h0) + ".",
[["a) Après combien de secondes atteint-il sa hauteur maximale ?", tm], ["b) Hauteur maximale, en m", hm], ["c) Après combien de secondes touche-t-il le sol ? (au centième)", tg, 0.01]],
["Sommet d'une parabole " + M("at^2 + bt + c") + " : " + M("t = -\\frac{b}{2a}") + ".", "c) Résous " + M("h(t) = 0") + " et garde la solution positive."],
"a) " + M("t = -\\frac{" + v + "}{2 \\cdot (-5)} = " + N(tm)) + " s. b) " + M("h(" + N(tm) + ") = " + N(hm)) + " m. c) " + M("\\Delta = " + v * v + " + 20 \\cdot " + h0 + " = " + (v * v + 20 * h0)) + " ; " + M("t = \\frac{" + v + " + \\sqrt{" + (v * v + 20 * h0) + "}}{10} \\approx " + N(Math.round(tg * 100) / 100)) + " s.");
});
PX("optim", OPT, () => {
const a = pk([8, 10, 12, 14]), b = pk([6, 9, 12, 15]);
return PB("Un rectangle a un sommet en " + M("O(0\\,;\\,0)") + ", deux côtés sur les axes, et le sommet opposé " + M("P(x\\,;\\,y)") + " sur la droite qui passe par " + M("(" + a + "\\,;\\,0)") + " et " + M("(0\\,;\\," + b + ")") + ".",
[["a) Abscisse de " + M("P") + " pour que l'aire du rectangle soit maximale", a / 2], ["b) Ordonnée de " + M("P") + " correspondante", b / 2], ["c) Aire maximale", (a * b) / 4]],
["Équation de la droite : " + M("y = " + b + " - \\frac{" + b + "}{" + a + "}x") + ". L'aire vaut " + M("A(x) = x \\cdot y") + ".", "A(x) est une fonction du 2e degré : son maximum est au sommet, au milieu de ses zéros."],
M("A(x) = x\\left(" + b + " - \\frac{" + b + "}{" + a + "}x\\right)") + " s'annule en 0 et en " + a + " : sommet en " + M("x = " + N(a / 2)) + ". b) " + M("y = " + b + " - \\frac{" + b + "}{" + a + "} \\cdot " + N(a / 2) + " = " + N(b / 2)) + ". c) " + M(N(a / 2) + " \\cdot " + N(b / 2) + " = " + N((a * b) / 4)) + " (le quart du triangle formé avec les axes, doublé).");
});


PX("arith", { co: [12], mp: [12] }, () => {
let g, m, n; do { g = ri(12, 48); m = ri(5, 17); n = ri(5, 17); } while (gcd(m, n) !== 1 || m === n);
const a = g * Math.max(m, n), b = g * Math.min(m, n), L = (a * b) / g;

return PB("On veut carreler sans découpe une salle rectangulaire de " + X(a) + " cm sur " + X(b) + " cm avec des carreaux carrés identiques, les plus grands possible. Les carreaux sont vendus par boîtes de 10.",
[["a) Côté des carreaux, en cm (algorithme d'Euclide conseillé)", g], ["b) Nombre de carreaux", m * n], ["c) Nombre de boîtes à acheter, au minimum", Math.ceil((m * n) / 10)]],
["Euclide : PGDC(a ; b) = PGDC(b ; reste de a ÷ b), jusqu'au reste nul.", "c) Il faut au moins le nombre de carreaux : on arrondit à la boîte supérieure."],
"a) PGDC(" + a + " ; " + b + ") = " + g + " cm. b) " + M((a / g) + " \\cdot " + (b / g) + " = " + m * n) + " carreaux. c) " + M(m * n + " \\div 10") + " arrondi à l'unité supérieure : " + Math.ceil((m * n) / 10) + " boîtes.");
});

PX("fracper", { co: [12] }, () => {
let a, per; do { a = ri(1, 9); per = ri(101, 998); } while (per % 111 === 0);
const num0 = a * 999 + per, den0 = 9990, g = gcd(num0, den0), P = String(per).padStart(3, "0");
return PB("On considère " + M("x = 0{,}" + a + "\\overline{" + P + "}") + " (le groupe " + P + " se répète indéfiniment).",
[["a) Que vaut " + M("10\\,000x - 10x") + " ?", num0], ["b) Numérateur de " + M("x") + " sous forme irréductible", num0 / g], ["c) Dénominateur", den0 / g]],
["Multiplie par 10 pour placer la période juste après la virgule, puis par 10'000 pour la décaler d'une période entière.", "Simplifie par le PGDC du numérateur et de 9'990."],
M("10\\,000x = " + a + P + "{,}\\overline{" + P + "}") + ", " + M("10x = " + a + "{,}\\overline{" + P + "}") + " ; " + M("9\\,990x = " + N(num0)) + " ; " + M("x = \\frac{" + N(num0) + "}{9\\,990} = \\frac{" + N(num0 / g) + "}{" + N(den0 / g) + "}") + " (PGDC " + g + ").");
});

PX("premiers", { mp: [12] }, () => {
const a = ri(2, 5), b = ri(1, 4), c = ri(1, 2), n = 2 ** a * 3 ** b * 5 ** c, cube = 2 ** ((3 - (a % 3)) % 3) * 3 ** ((3 - (b % 3)) % 3) * 5 ** ((3 - (c % 3)) % 3);
const m = 2 ** pk([1, 2]) * 3 ** pk([2, 3]) * 7, g = gcd(n, m);
return PB("On considère " + M("n = " + N(n)) + " et " + M("m = " + N(m)) + ".",
[["a) Nombre de diviseurs de " + M("n"), (a + 1) * (b + 1) * (c + 1)], ["b) Plus petit entier " + M("k") + " tel que " + M("n \\cdot k") + " soit un cube parfait", cube], ["c) PGDC(" + M("n") + " ; " + M("m") + ")", g]],
["Décompose n en facteurs premiers. Un diviseur choisit un exposant pour chaque facteur premier, de 0 au maximum.", "Un cube : chaque exposant est un multiple de 3. PGDC : facteurs communs, avec le plus petit exposant."],
M("n = 2^{" + a + "} \\cdot 3^{" + b + "} \\cdot 5^{" + c + "}") + ". a) " + M("(" + (a + 1) + ")(" + (b + 1) + ")(" + (c + 1) + ") = " + (a + 1) * (b + 1) * (c + 1)) + ". b) Exposants à compléter jusqu'au multiple de 3 suivant : " + M("k = " + N(cube)) + ". c) " + M("m = " + m.toString()) + " ; PGDC " + M("= " + g) + ".");
});

PX("rac", { mp: [12] }, () => {
let p, m, q, nn; do { p = pk([2, 3, 4, 5, 6]); m = pk([2, 3, 5, 6, 7]); q = pk([3, 5, 7, 11]); nn = pk([2, 3, 5]); } while (q === m || nn === m || q * q === m);
const A = p * p * m, prod = 4 * m - nn, bb = pk([[7, 5], [11, 7], [13, 11], [10, 6], [8, 6]]);
return PB("Calcul avec des racines carrées (sans calculatrice).",
[["a) " + M("\\sqrt{" + A + "}") + " s'écrit " + M("a\\sqrt{" + m + "}") + " : que vaut " + M("a") + " ?", p], ["b) " + M("(2\\sqrt{" + m + "} + \\sqrt{" + nn + "})(2\\sqrt{" + m + "} - \\sqrt{" + nn + "})") + " = ?", prod], ["c) " + M("\\frac{1}{\\sqrt{" + bb[0] + "} - \\sqrt{" + bb[1] + "}} = \\frac{\\sqrt{" + bb[0] + "} + \\sqrt{" + bb[1] + "}}{d}") + " : que vaut " + M("d") + " ?", bb[0] - bb[1]]],
["a) Cherche le plus grand carré qui divise " + A + ".", "b) Identité (u + v)(u − v) = u² − v². c) Multiplie haut et bas par la quantité conjuguée."],
"a) " + M("\\sqrt{" + A + "} = \\sqrt{" + p * p + " \\cdot " + m + "} = " + p + "\\sqrt{" + m + "}") + ". b) " + M("(2\\sqrt{" + m + "})^2 - (\\sqrt{" + nn + "})^2 = " + 4 * m + " - " + nn + " = " + prod) + ". c) " + M("(\\sqrt{" + bb[0] + "} - \\sqrt{" + bb[1] + "})(\\sqrt{" + bb[0] + "} + \\sqrt{" + bb[1] + "}) = " + bb[0] + " - " + bb[1] + " = " + (bb[0] - bb[1])) + ".");
});
})();






const COMPS = {

prio: ["Calculer avec les priorités (· avant +)", "Calculer avec des parenthèses", "Calculer avec puissances et parenthèses"],
arith: ["Trouver le PGDC de deux nombres", "Trouver le PPMC de deux nombres", "Résoudre un problème de PGDC ou de PPMC"],
fracadd: ["Additionner des fractions de même dénominateur", "Additionner des fractions de dénominateurs différents", "Additionner et soustraire plusieurs fractions"],
diagr: ["Calculer une moyenne", "Calculer l'angle d'un diagramme circulaire", "Calculer une moyenne à partir des effectifs"],
prop: ["Calculer une quatrième proportionnelle", "Calculer une quatrième proportionnelle", "Utiliser la proportionnalité dans un problème"],
valnum: ["Remplacer une lettre par un nombre", "Calculer une expression du 2e degré pour une valeur", "Calculer une expression à deux lettres"],
angtri: ["Utiliser la somme des angles d'un triangle", "Calculer les angles d'un triangle isocèle", "Utiliser la somme des angles d'un quadrilatère"],
decread: ["Lire le rang d'un chiffre", "Écrire un nombre à partir de sa décomposition", "Passer de l'écriture fractionnaire à l'écriture décimale"],
deccomp: ["Comparer deux nombres décimaux", "Ranger des nombres décimaux", "Intercaler un nombre entre deux décimaux"],
decarr: ["Arrondir au dixième ou au centième", "Encadrer un nombre décimal", "Arrondir avec retenue ou à la dizaine"],
ordgr: ["Estimer une somme", "Estimer un produit", "Estimer un quotient"],
decadd: ["Additionner des nombres décimaux", "Soustraire des nombres décimaux", "Enchaîner additions et soustractions"],
dec10: ["Multiplier par 10, 100, 1000", "Diviser par 10, 100, 1000", "Multiplier ou diviser par 0,1 ; 0,01…"],
decmul: ["Multiplier un décimal par un entier", "Multiplier deux nombres décimaux", "Multiplier des décimaux plus petits que 1"],
decdiv: ["Diviser un décimal par un entier", "Diviser par un nombre décimal", "Diviser par un nombre décimal"],
decprob: ["Résoudre un problème avec des décimaux", "Résoudre un problème avec des décimaux", "Résoudre un problème de partage"],
pow9: ["Calculer un carré ou un cube", "Calculer une puissance d'un décimal ou de 10", "Enchaîner des puissances"],
tradexpr: ["Traduire une phrase en calcul", "Traduire une phrase en calcul", "Traduire une phrase en calcul (puissances)"],
multdiv: ["Trouver des multiples", "Trouver les diviseurs d'un nombre", "Compter des multiples dans un intervalle"],
divcrit: ["Utiliser les critères de divisibilité par 3 et 9", "Utiliser les critères de divisibilité par 3 et 9", "Combiner des critères de divisibilité"],
premiers: ["Reconnaître un nombre premier", "Décomposer en produit de facteurs premiers", "Décomposer en produit de facteurs premiers"],
relrep: ["Comparer des nombres relatifs", "Calculer une distance sur la droite graduée", "Trouver le milieu de deux relatifs"],
reladd: ["Additionner des nombres relatifs", "Soustraire un nombre relatif", "Calculer une somme de plusieurs relatifs"],
fracrep: ["Comparer des fractions de même dénominateur", "Comparer des fractions de dénominateurs différents", "Encadrer une fraction entre deux entiers"],
fracsimp: ["Amplifier une fraction", "Simplifier une fraction", "Rendre une fraction irréductible"],
fracconv: ["Écrire une fraction en nombre décimal", "Écrire une fraction en pourcentage", "Écrire un pourcentage en fraction"],
fracper: ["Reconnaître un nombre périodique", "Reconnaître un nombre périodique", "Écrire un nombre périodique en fraction"],
fractout: ["Calculer une fraction d'une quantité", "Calculer une fraction d'une quantité", "Retrouver le tout à partir d'une fraction"],
ulong: ["Convertir longueurs et masses", "Convertir longueurs et masses", "Résoudre un problème avec des unités"],
uaire: ["Convertir des unités d'aire", "Convertir des unités d'aire", "Convertir ares, hectares et km²"],
uvol: ["Convertir des capacités (L, dL, cL, mL)", "Convertir des unités de volume", "Passer des volumes aux litres"],
utemps: ["Convertir des durées", "Additionner des durées", "Calculer une durée entre deux horaires"],
perim: ["Calculer un périmètre", "Retrouver un côté à partir du périmètre", "Calculer le périmètre d'une figure découpée"],
aire1: ["Calculer l'aire d'un carré ou d'un rectangle", "Calculer l'aire d'un triangle", "Combiner aire, périmètre et unités"],
aire2: ["Calculer l'aire d'un parallélogramme", "Calculer l'aire d'un losange", "Choisir la bonne hauteur"],
aire3: ["Calculer une aire par décomposition", "Calculer une aire par décomposition", "Calculer une aire par différence"],
volpave: ["Calculer le volume d'un pavé", "Calculer l'aire totale d'un cube ou d'un pavé", "Passer d'un volume à une contenance"],
solides: ["Décrire un cube ou un pavé", "Décrire un prisme droit", "Décrire un prisme droit"],
proptab: ["Trouver un coefficient de proportionnalité", "Trouver un coefficient de proportionnalité", "Compléter un tableau de proportionnalité"],
change: ["Convertir des euros en francs", "Convertir des francs en euros", "Comparer des prix en deux monnaies"],
agrand: ["Trouver le facteur d'agrandissement", "Agrandir ou réduire une longueur", "Agrandir ou réduire avec une fraction"],
litelab: ["Écrire une expression littérale", "Écrire un périmètre avec une lettre", "Écrire et réduire une expression littérale"],
angtype: ["Utiliser l'angle plat", "Utiliser l'angle plein", "Reconnaître angles aigus et obtus"],
quadri: ["Utiliser les propriétés du losange et du carré", "Utiliser les angles du parallélogramme", "Connaître symétries et diagonales des quadrilatères"],

rel: ["Additionner des nombres relatifs", "Multiplier des relatifs avec les priorités", "Calculer avec des puissances de relatifs"],
vol: ["Calculer le volume d'un pavé", "Calculer le volume d'un prisme droit", "Retrouver une dimension d'un cylindre"],
fracmul: ["Multiplier des fractions", "Diviser des fractions", "Calculer avec des fractions et des parenthèses"],
pct: ["Calculer un pourcentage d'une quantité", "Calculer un prix après une baisse", "Retrouver une valeur de départ"],
puiss: ["Multiplier des puissances de même base", "Calculer avec des exposants négatifs", "Utiliser les règles des puissances"],
sci: ["Écrire en notation scientifique", "Calculer en notation scientifique", "Calculer en notation scientifique"],
rac: ["Calculer une racine carrée", "Encadrer une racine carrée", "Résoudre un problème avec une racine carrée"],
racprop: ["Utiliser une propriété des racines", "Simplifier ou extraire une racine", "Calculer avec des racines carrées et cubiques"],
disque: ["Calculer le périmètre d'un cercle", "Calculer l'aire d'un disque", "Calculer un arc ou un secteur"],
vitesse: ["Calculer une vitesse", "Calculer une durée", "Calculer une vitesse moyenne sur un trajet"],
pyth: ["Calculer l'hypoténuse", "Calculer une cathète", "Utiliser Pythagore dans une figure"],
reduire: ["Réduire une expression du 1er degré", "Réduire une expression du 2e degré", "Réduire après avoir supprimé des parenthèses"],
distrib: ["Développer avec la simple distributivité", "Développer avec la double distributivité", "Développer avec la double distributivité"],
eq1: ["Résoudre une équation du type ax + b = c", "Résoudre une équation avec parenthèses", "Résoudre une équation avec fractions"],
probeq: ["Mettre un problème en équation", "Mettre un problème en équation", "Mettre un problème en équation (2e degré)"],
echelle: ["Utiliser une échelle", "Passer de la carte à la réalité (et inversement)", "Trouver et utiliser une échelle (plans, cartes, maquettes)"],
affine: ["Calculer l'image par une fonction affine", "Calculer la pente d'une droite", "Calculer une préimage par une fonction affine"],
polyreg: ["Calculer l'angle au centre d'un polygone régulier", "Calculer l'angle intérieur d'un polygone régulier", "Retrouver le nombre de côtés"],
grandmanq: ["Retrouver une longueur à partir de l'aire", "Retrouver une hauteur à partir de l'aire", "Retrouver une dimension à partir de l'aire"],
fracops: ["Soustraire des fractions (résultat négatif)", "Multiplier et diviser des fractions relatives", "Calculer avec des fractions et les priorités"],
airelat: ["Calculer l'aire latérale d'un prisme", "Calculer l'aire latérale d'un cylindre", "Calculer l'aire totale d'un cylindre"],
voldecomp: ["Calculer le volume d'un solide composé", "Calculer le volume d'un solide composé", "Calculer une contenance en litres"],
carres: ["Calculer une racine carrée exacte", "Calculer une racine décimale ou cubique simple", "Encadrer une racine, racine d'une somme"],
racenc: ["Encadrer une racine carrée", "Comparer une racine et un entier", "Encadrer une racine carrée"],
scicalc: ["Multiplier en notation scientifique", "Diviser en notation scientifique", "Écrire le résultat en notation scientifique"],
monomes: ["Multiplier des monômes", "Multiplier des monômes", "Calculer la puissance d'un monôme"],
pythfig: ["Calculer la diagonale d'un rectangle", "Calculer la hauteur d'un triangle isocèle", "Calculer la diagonale d'un pavé"],
eqverif: ["Vérifier une solution", "Vérifier une solution", "Vérifier les solutions d'une équation du 2e degré"],
pctvar: ["Calculer une augmentation", "Calculer une réduction", "Retrouver un prix ou un pourcentage de variation"],
pente: ["Calculer une pente", "Calculer un dénivelé", "Calculer une distance horizontale"],
repere: ["Lire des coordonnées", "Distance d'un point aux axes", "Trouver un sommet d'un rectangle"],
tabval: ["Calculer une image (fonction affine)", "Calculer une image (fonction du 2e degré)", "Calculer une image (fonctions diverses)"],
rotation: ["Trouver l'angle d'une rotation", "Trouver l'angle d'une rotation", "Trouver l'image d'un point par une rotation"],

proba: ["Calculer une probabilité simple", "Calculer une probabilité avec deux dés", "Calculer une probabilité sans remise"],
volcone: ["Calculer le volume d'une pyramide", "Calculer le volume d'une boule", "Calculer le volume d'un cône"],
gquot: ["Convertir une vitesse", "Utiliser la masse volumique", "Utiliser un débit"],
thales: ["Calculer une longueur avec Thalès", "Calculer une longueur avec Thalès", "Résoudre un problème avec Thalès"],
idrem: ["Développer (a + b)²", "Développer (a + b)(a − b)", "Développer (a − b)²"],
factor: ["Factoriser par mise en évidence", "Factoriser une différence de deux carrés", "Factoriser un carré parfait"],
formule: ["Transformer une formule", "Transformer une formule", "Transformer une formule (racine)"],
eq2: ["Résoudre une équation produit nul", "Résoudre en mettant x en évidence", "Résoudre avec une différence de carrés"],
eq2disc: ["Résoudre une équation du 2e degré", "Résoudre une équation du 2e degré", "Résoudre une équation du 2e degré (racines)"],
sys2: ["Résoudre un système de deux équations", "Résoudre un système de deux équations", "Mettre un problème en système"],
angles: ["Angle au centre et angle inscrit", "Angle au centre et angle inscrit", "Utiliser le cercle de Thalès"],
simil: ["Utiliser des triangles semblables", "Agrandir une aire (rapport k²)", "Agrandir un volume (rapport k³)"],
pythrec: ["Repérer l'hypoténuse", "Reconnaître un triangle rectangle", "Montrer qu'un triangle n'est pas rectangle"],
airepyr: ["Calculer l'aire latérale d'une pyramide", "Calculer l'aire totale d'une pyramide", "Calculer l'apothème puis l'aire"],
volcomp: ["Calculer le volume d'un solide composé", "Calculer le volume d'un solide composé", "Calculer le volume d'un solide composé"],
volmanq: ["Retrouver la hauteur d'un pavé", "Retrouver la hauteur d'un cylindre", "Retrouver le rayon d'un cône"],
ucomp: ["Convertir des km/h en m/s", "Convertir des m/s en km/h", "Convertir une masse volumique ou un débit"],
parenth: ["Supprimer des parenthèses", "Supprimer des parenthèses", "Supprimer des parenthèses (2e degré)"],
eqfrac: ["Résoudre une équation avec parenthèses", "Résoudre une équation avec une fraction", "Résoudre une équation avec plusieurs fractions"],
eq2fact: ["Résoudre x² = a", "Résoudre en mettant x en évidence", "Résoudre en factorisant"],
probeq2: ["Résoudre un problème du 2e degré", "Résoudre un problème du 2e degré", "Résoudre un problème du 2e degré"],
cercthales: ["Utiliser le cercle de Thalès", "Utiliser une tangente au cercle", "Utiliser le cercle de Thalès"],
thalesrec: ["Utiliser la réciproque de Thalès", "Utiliser la réciproque de Thalès", "Reconnaître des droites parallèles"],
sysprob: ["Résoudre un problème avec somme et différence", "Mettre un problème en système", "Mettre un problème en système"],
denombr: ["Dénombrer avec un arbre", "Dénombrer sans répétition", "Dénombrer des paires"],

polyop: ["Développer un produit de polynômes", "Développer avec des identités", "Développer un cube"],
factor2: ["Factoriser par mise en évidence", "Factoriser un trinôme", "Factoriser par groupements"],
eq3: ["Résoudre une équation de degré 3", "Résoudre une équation de degré 3", "Résoudre une équation de degré 3"],
sys3: ["Résoudre un système triangulaire", "Résoudre un système de trois équations", "Mettre un problème en système de trois équations"],
domaine: ["Trouver un domaine de définition", "Trouver un domaine de définition", "Trouver un domaine (2e degré sous la racine)"],
fimg: ["Calculer une image", "Calculer une image", "Trouver des préimages"],
f2: ["Trouver les zéros d'une parabole", "Trouver le sommet d'une parabole", "Trouver le sommet d'une parabole"],
f2expr: ["Retrouver une parabole par ses zéros", "Retrouver une parabole par son sommet", "Retrouver une parabole par trois points"],
inter: ["Intersection d'une parabole et d'une droite", "Intersection d'une parabole et d'une droite", "Intersection d'une parabole et d'une droite"],
ineq2: ["Résoudre une inéquation produit", "Résoudre une inéquation du 2e degré", "Comparer deux fonctions"],
racinv: ["Calculer une préimage par la fonction inverse", "Résoudre une équation avec une racine", "Intersection d'une hyperbole et d'une droite"],
euclide: ["Utiliser le théorème de la hauteur", "Utiliser le théorème d'Euclide", "Calculer la hauteur relative à l'hypoténuse"],
droitesrem: ["Utiliser le centre de gravité", "Utiliser les bissectrices", "Utiliser le cercle circonscrit"],
trigo: ["Calculer un côté avec sin, cos, tan", "Calculer un angle avec sin, cos, tan", "Résoudre un problème de trigonométrie"],
trinfact: ["Factoriser un trinôme par ses zéros", "Factoriser un trinôme par ses zéros", "Factoriser un trinôme par ses zéros"],
exactes: ["Diagonale d'un carré en valeur exacte", "Hauteur d'un triangle équilatéral en valeur exacte", "Aire en valeur exacte"],
sysgraph: ["Système sans solution (droites parallèles)", "Système sans solution", "Système avec une infinité de solutions"],
optim: ["Trouver où une fonction atteint son maximum", "Calculer une hauteur maximale", "Résoudre un problème d'optimisation"],
eqspec: ["Reconnaître une équation impossible", "Reconnaître une équation impossible", "Reconnaître une équation indéterminée"],
bicarre: ["Résoudre une équation bicarrée", "Résoudre une équation bicarrée", "Résoudre une équation bicarrée"],
lectgraph: ["Lire les zéros sur un graphique", "Lire les variations sur un graphique", "Résoudre graphiquement f(x) = k"],
affzero: ["Calculer le zéro d'une fonction affine", "Étudier le signe d'une fonction affine", "Étudier le signe d'une fonction affine"],
f2formes: ["Passer de la forme canonique à la forme développée", "Écrire la forme canonique", "Passer de la forme factorisée à la forme canonique"],
f2trois: ["Retrouver une parabole par trois points", "Retrouver une parabole par trois points", "Retrouver une parabole par trois points"],
interpar: ["Intersection de deux paraboles", "Intersection de deux paraboles", "Nombre de points d'intersection"],
modaff: ["Modéliser un tarif", "Comparer deux offres", "Comparer deux offres"],
trigexact: ["Utiliser les valeurs exactes de 30° et 60°", "Utiliser les valeurs exactes de 30°, 45° et 60°", "Relier pente et angle"],
geocomb: ["Enchaîner Pythagore et l'aire", "Calculer une hauteur par les aires", "Combiner Pythagore et trigonométrie"],

polydiv: ["Calculer le reste d'une division", "Diviser un polynôme par x − a", "Trouver un paramètre pour que la division tombe juste"],
polyfact: ["Résoudre avec une racine connue", "Trouver une racine évidente", "Résoudre une équation de degré 4"],
fracrat: ["Simplifier une fraction rationnelle", "Additionner des fractions rationnelles", "Simplifier une fraction rationnelle"],
eqrat: ["Résoudre une équation rationnelle simple", "Résoudre une proportion", "Résoudre une équation rationnelle"],
symetries: ["Trouver l'image d'un point par une symétrie d'axe Ox ou Oy", "Trouver l'image par une symétrie centrale ou une translation", "Symétrie d'axe x = c ou de centre quelconque"],
sysineq: ["Résoudre un système d'inéquations simple", "Résoudre un système d'inéquations (coefficient négatif)", "Reconnaître un système sans solution ou à une borne"],
ineqfrac: ["Résoudre une inéquation fractionnaire simple", "Résoudre une inéquation fractionnaire avec coefficients", "Ramener une inéquation fractionnaire à 0"],
eqirr: ["Résoudre une équation avec une racine", "Résoudre une équation irrationnelle et rejeter les solutions parasites", "Résoudre une équation irrationnelle plus complexe"],
morceaux: ["Calculer une image d'une fonction par morceaux", "Résoudre une équation avec une fonction par morceaux", "Rendre une fonction par morceaux continue"],
transf: ["Lire le sommet après une translation", "Transformer un point par une translation", "Transformer un point par translation et étirement"],
trigrel: ["Calculer cos à partir de sin", "Calculer tan à partir de cos", "Calculer une valeur exacte avec sin² + cos² = 1"],
expfrac: ["Calculer une puissance à exposant fractionnaire", "Calculer une puissance à exposant fractionnaire négatif", "Écrire un produit de racines comme une puissance"],
vecteurs: ["Calculer les composantes d'un vecteur", "Calculer une norme ou une combinaison de vecteurs", "Utiliser le produit scalaire"],
ineq: ["Résoudre une inéquation du 1er degré", "Résoudre avec x des deux côtés, des parenthèses ou des fractions", "Résoudre une double inégalité, comparer des offres"],
recip: ["Calculer avec une réciproque", "Calculer avec une composée", "Trouver l'expression d'une réciproque"],
absval: ["Résoudre une équation avec valeur absolue", "Résoudre une équation avec valeur absolue", "Reconnaître une équation sans solution"],
homog: ["Trouver l'asymptote verticale", "Trouver l'asymptote horizontale", "Trouver la réciproque d'une homographique"],
trigfn: ["Lire l'amplitude d'une sinusoïde", "Calculer la période d'une sinusoïde", "Trouver le maximum d'une sinusoïde"],
expo: ["Résoudre une équation exponentielle", "Résoudre une équation exponentielle", "Calculer des intérêts composés"],
log: ["Calculer un logarithme", "Résoudre avec un logarithme", "Utiliser les propriétés du logarithme"],
trigcercle: ["Convertir des degrés en radians", "Valeurs exactes sur le cercle trigonométrique", "Coordonnées d'un point du cercle trigonométrique"],
trigeq: ["Résoudre sin x = c", "Résoudre cos x = c", "Résoudre tan x = c"],
sinlaw: ["Utiliser le théorème du sinus", "Utiliser le théorème du cosinus", "Calculer un angle avec le cosinus"],
cart: ["Calculer une distance entre deux points", "Calculer un milieu", "Trouver l'équation d'une droite"],
droites: ["Trouver l'équation d'une droite", "Trouver une droite perpendiculaire", "Trouver l'intersection de deux droites"],
cercle: ["Lire centre et rayon d'un cercle", "Trouver le rayon (compléter les carrés)", "Intersection d'un cercle et d'une droite"],
valint: ["Trouver une valeur interdite", "Trouver les valeurs interdites", "Trouver les valeurs interdites (factoriser)"],
modexp: ["Calculer des intérêts composés", "Calculer une croissance par doublements", "Trouver un temps de doublement"],
compo: ["Calculer avec une composée", "Trouver l'expression d'une composée", "Comparer f ∘ g et g ∘ f"],
fracetage: ["Simplifier une fraction à étages", "Simplifier une fraction à étages", "Simplifier une fraction à étages"],
probrat: ["Résoudre un problème de travail en commun", "Résoudre un problème de travail en commun", "Résoudre un problème de vitesse"],
bijection: ["Restreindre une fonction pour une bijection", "Restreindre une fonction pour une bijection", "Reconnaître une fonction injective"],
decomp: ["Décomposer une fonction", "Décomposer une fonction", "Décomposer une fonction"],
polyexpr: ["Retrouver un polynôme par ses zéros", "Retrouver un polynôme (zéro double)", "Modéliser avec un polynôme"],
homogrec: ["Trouver la réciproque d'une homographique", "Trouver la réciproque d'une homographique", "Calculer une préimage par une homographique"],
trigassoc: ["Utiliser les angles associés", "Utiliser les angles complémentaires", "Utiliser sin² + cos² = 1"],
trigeq2: ["Résoudre sin(kx) = c", "Trouver amplitude et valeur moyenne", "Modéliser un phénomène périodique"],
logbase: ["Changer de base (valeur exacte)", "Changer de base (calculatrice)", "Enchaîner des changements de base"],
triaire: ["Calculer l'aire d'un triangle avec le sinus", "Calculer l'aire d'un triangle avec le sinus", "Calculer une distance avec le cosinus"],
droitesinter: ["Trouver l'intersection de deux droites", "Trouver une médiatrice", "Trouver une hauteur d'un triangle"],
cercletan: ["Trouver un cercle par son diamètre", "Rayon d'un cercle tangent à une droite", "Pente d'une tangente à un cercle"],

ensembles: ["Compter les entiers d'un intervalle", "Lire des bornes ouvertes ou fermées", "Intersection de deux intervalles"],
vabs: ["Calculer une valeur absolue", "Calculer avec des valeurs absolues", "Calculer avec des valeurs absolues"],
ratden: ["Rendre un dénominateur rationnel", "Rendre un dénominateur rationnel", "Utiliser l'expression conjuguée"],
eqparam: ["Équation sans solution selon un paramètre", "Équation sans solution selon un paramètre", "Solution double selon un paramètre"],
statfreq: ["Calculer une fréquence", "Calculer un effectif cumulé", "Calculer l'angle d'un secteur"],
quartiles: ["Calculer une étendue", "Calculer une médiane", "Calculer l'écart interquartile"],
stats: ["Calculer une moyenne", "Calculer une médiane", "Calculer un écart-type"],
};


function compOf(id, d) {
const L = COMPS[id];
if (!L) return id + ":0";
const k = Math.min(d, 3) - 1, i = L.indexOf(L[k]);
return id + ":" + i;
}

function compsOf(id) {
const L = COMPS[id] || [NOTIONS.find((n) => n.id === id).label];
return L.map((label, i) => ({ cid: id + ":" + i, label, i })).filter((c) => L.indexOf(c.label) === c.i);
}




function compNote(rec) {
if (!rec || rec.r.length < 3) return null;
const avg = rec.r.reduce((a, b) => a + b, 0) / rec.r.length, n = Math.round((1 + 5 * avg) * 2) / 2;
return n > 5 && !rec.hi && Math.max(rec.r.length, rec.n || 0) < 5 ? 5 : n;
}













const Referentiel = (() => {
const FR_Y = { 6: "6e", 7: "5e", 8: "4e", 9: "3e", 10: "2nde", 11: "1re", 12: "Terminale" };
const SYS = {


CO: {
data: () => (typeof REF_CO !== "undefined" ? REF_CO : null),
applies: (p) => p.system === "CH" && p.track !== "mp" && p.grade >= 9 && p.grade <= 11,
year: (p) => p.grade,
years: (p) => Array.from({ length: p.grade - 8 }, (_, i) => i + 9),
yearLabel: (y) => y + "e",
allowed: () => true,
track: () => "",
title: "Plan d'études romand",
intro: "Les apprentissages du Plan d'études romand (PER) pour ton année, par axe. Chacun reçoit une note de 1 à 6 dès que tu as répondu 3 fois à ses questions. La note suit tes 8 dernières réponses : elle monte quand tu progresses.",
},


MP: {
data: () => (typeof REF_MP !== "undefined" ? REF_MP : null),
applies: (p) => p.system === "CH" && p.track === "mp" && p.grade >= 12 && p.grade <= 15,
year: (p) => p.grade - 11,
yearLabel: (y) => "MP " + (y === 1 ? "1re" : y + "e"),
allowed: () => true,
track: () => "",
catalogOnly: () => [12, 13, 14, 15].map((grade) => ({ system: "CH", grade, track: "mp", minutes: 5 })),
title: "maturité professionnelle",
intro: "Les objectifs du plan d'études de mathématiques de la maturité professionnelle, semestre par semestre. Chacun reçoit une note de 1 à 6 dès que tu as répondu 3 fois à ses questions. La note suit tes 8 dernières réponses : elle monte quand tu progresses.",
},
MATU: {
data: () => (typeof REF_MATU !== "undefined" ? REF_MATU : null),
applies: (p) => p.system === "CH" && p.track === "college" && p.grade >= 12 && p.grade <= 15,
year: (p) => p.grade - 11,
yearLabel: (y) => (y === 1 ? "1re" : y + "e"),

allowed: (p, niv) => niv === 0 || (niv === 1 ? p.niv === "R" : p.niv !== "R"),
track: (p) => (p.grade >= 14 ? (p.niv === "R" ? "MA2" : "MA1") : ""),
title: "Collège",
intro: "Les compétences officielles du programme du Collège. Chacune reçoit une note de 1 à 6 dès que tu as répondu 3 fois à ses questions. La note suit tes 8 dernières réponses : elle monte quand tu progresses.",
},



FR: {
data: () => (typeof REF_FR !== "undefined" ? REF_FR : null),
applies: (p) => p.system === "FR" && p.grade >= 6 && p.grade <= 12,
year: (p) => p.grade,
years: (p) => Array.from({ length: p.grade - 5 }, (_, i) => i + 6),
yearLabel: (y) => FR_Y[y],
allowed: () => true,
track: (p) => (p.grade === 11 || p.grade === 12 ? "spécialité" : ""),

olds: (p) => (p.grade <= 9 ? [["Années précédentes", Array.from({ length: p.grade - 6 }, (_, i) => p.grade - 1 - i)]]
: [...Array.from({ length: p.grade - 10 }, (_, i) => [FR_Y[p.grade - 1 - i], [p.grade - 1 - i]]), ["Collège (6e–3e)", [9, 8, 7, 6]]]),
catalogOnly: () => [6, 7, 8, 9, 10, 11, 12].map((grade) => ({ system: "FR", grade, track: "college", minutes: 5 })),
fr: true,
title: "programme de mathématiques",
intro: (p) => (p.grade <= 9 ? "Les attendus de fin d'année du programme officiel de mathématiques de ta classe." : "Les capacités attendues et les automatismes du programme officiel de mathématiques de ta classe.")
+ " Chacun reçoit un niveau de maîtrise (insuffisante, fragile, satisfaisante, très bonne) dès que tu as répondu 3 fois à ses questions. Il suit tes 8 dernières réponses : il monte quand tu progresses.",
},
};
const cache = {};
const sysOf = (p) => { if (!p) return null; for (const k in SYS) if (SYS[k].applies(p) && SYS[k].data()) return k; return null; };


const rows = (k) => {
if (cache[k]) return cache[k];
const D = SYS[k].data();

return (cache[k] = D.c.map(([code, niv, th, no, label, y, y2]) => { const year = y === undefined ? +code[0] : y; return { code, year, y2: y2 === undefined ? year : y2, niv, theme: D.th[th], notion: D.no[no], label, links: D.q[code] || [], forms: (D.f && D.f[code]) || null }; }));
};



const catSet = {};
const catOk = (k, id) => {
if (!catSet[k]) { catSet[k] = new Set(); SYS[k].catalogOnly().forEach((p) => Engine.catalog(p).forEach((c) => catSet[k].add(c.id))); }
return catSet[k].has(id);
};
const rowsOf = (k) => {
const rs = rows(k);
if (!SYS[k].catalogOnly || rs.filtered) return rs;
rs.forEach((r) => { r.links = r.links.filter((s) => catOk(k, s.split("@")[0])); });
rs.filtered = true;
return rs;
};

const pairs = (r) => r.links.flatMap((s) => { const [id, lv] = s.split("@"); return (lv ? lv.split("") : ["1", "2", "3"]).map((d) => [id, +d]); });

const cids = (r) => [...new Set(pairs(r).map(([id, d]) => compOf(id, d)))];

const formsC = {};
const formsAt = (p, id, d) => {
const k = [p.system, p.grade, p.track, p.niv, id, d].join("|");
if (!formsC[k]) { const st = { profile: p }, cs = new Set(); for (let s = 1; s <= 30; s++) { try { const q = Engine.make(st, id, d, s); if (q && q.ctx) cs.add(q.ctx); } catch (e) { break; } } formsC[k] = [...cs]; }
return formsC[k];
};
return {
of: sysOf,
title: (p) => { const k = sysOf(p); return k ? SYS[k].title : ""; },
intro: (p) => { const S = SYS[sysOf(p)], t = S.intro; return typeof t === "function" ? t(p) : t; },
isFR: (p) => !!SYS[sysOf(p)].fr,

olds(p) {
const S = SYS[sysOf(p)];
if (S.olds) return S.olds(p).filter(([, ys]) => ys.length);
const ys = this.years(p).filter((y) => y < S.year(p)).reverse();
return ys.length ? [["Années précédentes", ys]] : [];
},
yearLabel: (p, y) => SYS[sysOf(p)].yearLabel(y),
track: (p) => SYS[sysOf(p)].track(p),
year: (p) => SYS[sysOf(p)].year(p),



list(p, y) {
const k = sysOf(p), S = SYS[k], y0 = S.year(p), yy = y || y0;
return rowsOf(k).filter((r) => (yy === y0 ? r.year <= yy && r.y2 >= yy : r.y2 === yy) && S.allowed(p, r.niv));
},
years(p) { const S = SYS[sysOf(p)]; if (S.years) return S.years(p); const y = this.year(p); return Array.from({ length: y }, (_, i) => i + 1); },
find(p, code) { const k = sysOf(p); return k ? rowsOf(k).find((r) => r.code === code) || null : null; },
cids,


note(st, r) {
const recs = cids(r).map((c) => (st.comps || {})[c]).filter((x) => x && x.r && x.r.length);
if (!recs.length) return null;
recs.sort((a, b) => String(a.last || "").localeCompare(String(b.last || "")));
return compNote({ r: recs.flatMap((x) => x.r).slice(-8), n: recs.reduce((a, x) => a + (x.n || x.r.length), 0), hi: recs.some((x) => x.hi) });
},
hasQuestions: (r) => r.links.length > 0,



plan(p, r) {
const ok = new Set(Engine.catalog(p).map((c) => c.id)), gen = (id) => typeof GEN === "undefined" || GEN[id];


const fit = ([id, d]) => !r.forms || !r.forms[id] || formsAt(p, id, d).some((c) => r.forms[id].includes(c));
let ps = pairs(r).filter(([id]) => ok.has(id) && gen(id)).filter(fit);
if (!ps.length) { const k = sysOf(p); ps = pairs(r).filter(([id]) => gen(id) && (SYS[k].catalogOnly ? catOk(k, id) : NOTIONS.some((n) => n.id === id))).filter(fit); }
return ps;
},

forms: (r, id) => (r && r.forms && r.forms[id]) || null,
stats(st, list) {
const notes = list.map((r) => this.note(st, r)).filter((x) => x !== null);
return { total: list.length, tested: notes.length, avg: notes.length ? notes.reduce((a, b) => a + b, 0) / notes.length : null };
},
};
})();






const TRX = (function () {
const pk = (a) => a[Math.floor(R.rand() * a.length)];
const nz = (a, b) => R.nz(a, b);
const r6 = (v) => +(+v).toFixed(9);
const den = (v) => { for (let d = 1; d <= 400; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-7) return d; return 0; };

const fT = (v) => { v = r6(v); const d = den(v); if (d === 1 || !d || d > 60) return nb(v); const n = Math.round(v * d); return (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };

const fS = (v) => { v = r6(v); const d = den(v); if (d === 1) return String(Math.round(v)); if (!d || d > 400) return String(v); return Math.round(v * d) + "/" + d; };
const dT = (v, k = 4) => nb(+(+v).toFixed(k));
const rd = (v, r) => +(Math.round(v / r) * r).toFixed(6);
const keepT = (spec, traps) => { const seen = new Set(); return (traps || []).filter((tr) => {
if (!tr) return false;
if (tr.e) { if (spec.kind !== "expr") return false; try { if (Expr.equivalent(Expr.parse(tr.e), Expr.parse(spec.expr))) return false; } catch (e) { return false; } if (seen.has(tr.e)) return false; seen.add(tr.e); return true; }
if (tr.s) { if (spec.kind !== "set" || !tr.s.every(isFinite)) return false; const k = tr.s.map(fS).sort().join(";"); if (seen.has(k) || checkAnswer(spec, tr.s.map(fS).join(" ; ")).status === "correct") return false; seen.add(k); return true; }
if (tr.spec) {
if (tr.spec.kind !== spec.kind) return false;
if (tr.spec.kind === "pair" && (tr.spec.values.length !== spec.values.length || !tr.spec.values.every(isFinite))) return false;
const c = tr.spec.kind === "pair" ? tr.spec.values.map(fS).join(" ; ") : SolSet.show(tr.spec.ivs, false);
if (seen.has(c) || checkAnswer(spec, c).status === "correct" || checkAnswer(tr.spec, c).status !== "correct") return false; seen.add(c); return true; }
if (spec.kind !== "value") return false;
const tol = Math.max(spec.round || 0, 1e-9), k = spec.round ? Math.round(tr.v / spec.round) : r6(tr.v);
if (!isFinite(tr.v) || Math.abs(tr.v - spec.value) <= tol || seen.has(k)) return false; seen.add(k); return true; }); };
const mk = (q, spec, sol, o) => { const x = { q, spec, sol, guide: o.guide, ctx: o.ctx, traps: keepT(spec, o.traps) }; for (const k of ["fig", "canon", "calcul"]) if (o[k] !== undefined) x[k] = o[k]; return x; };
const QN = (q, value, sol, o) => mk(q, Object.assign({ kind: "value", value: r6(value) }, o.radical ? { radical: true } : {}), sol, Object.assign({ canon: fS(value) }, o));
const QR = (q, value, round, sol, o) => mk(q, { kind: "value", value, round }, sol, Object.assign({ canon: String(rd(value, round)).replace(".", ",") }, o));
const QX = (q, expr, sol, o) => mk(q, { kind: "expr", expr }, sol, Object.assign({ canon: expr }, o));
const QSet = (q, vals, sol, o) => { const v = [...new Set(vals.map(r6))].sort((a, b) => a - b); return mk(q, { kind: "set", values: v }, sol, Object.assign({ canon: v.map(fS).join(" ; ") }, o)); };
const QP = (q, vals, sol, o) => (vals.every(isFinite) ? mk(q, { kind: "pair", values: vals.map(r6) }, sol, Object.assign({ canon: vals.map(fS).join(" ; ") }, o)) : null);
const QS = (q, ivs, sol, o) => mk(q, solsetSpec(ivs), sol, Object.assign({ canon: SolSet.show(ivs, false) }, o));
const GR = (ask, value, sol, round) => ({ ask, spec: Object.assign({ kind: "value", value: round ? value : r6(value) }, round ? { round } : {}), sol });
const GRad = (ask, value, sol) => ({ ask, spec: { kind: "value", value: r6(value), radical: true }, sol });
const GX = (ask, expr, sol) => ({ ask, spec: { kind: "expr", expr }, sol });
const GSet = (ask, vals, sol) => ({ ask, spec: { kind: "set", values: [...new Set(vals.map(r6))].sort((a, b) => a - b) }, sol });
const GP = (ask, vals, sol) => ({ ask, spec: { kind: "pair", values: vals.map(r6) }, sol });
const GSS = (ask, ivs, sol) => ({ ask, spec: solsetSpec(ivs), sol });
const TR = TRAP, TX = (e, m) => ({ e, m }), TSt = (s, m) => ({ s, m }), TP = (vals, m) => ({ spec: { kind: "pair", values: vals.map(r6) }, m }), TS = (ivs, m) => ({ spec: solsetSpec(ivs), m });

const P = (q, parts, hints, sol, fig) => ({ fig, q, sol, parts: parts.map(([label, value, round]) => ({ label, spec: Object.assign({ kind: "value", value: round ? value : r6(value) }, round ? { round } : {}) })), hints });

const reg = (defs) => {
for (const d of defs) {
if (!NOTIONS.some((n) => n.id === d.id)) NOTIONS.push(Object.assign({ id: d.id, theme: d.theme, label: d.label, ex: d.ex, CH: d.CH || null, MP: null, FR: d.FR || null }, d.againFR ? { againFR: d.againFR } : {}, d.niv ? { niv: d.niv } : {}));
GEN[d.id] = (lv) => pickForm(d.lv[Math.min(Math.max(lv, 1), 3)]);
if (typeof VAR !== "undefined") VAR[d.id] = {};
HINTS_EXTRA[d.id] = d.hint;
LESSONS_EXTRA[d.id] = d.lesson;
if (typeof COMPS !== "undefined") COMPS[d.id] = d.comps;
if (d.probs && typeof PROB_EXTRA !== "undefined") PROB_EXTRA[d.id] = d.probs;
if (d.act) actReg({ [d.id]: d.act });
}
};



const actReg = (defs) => { try { Object.assign(ACTIVE, defs); } catch (e) { Object.assign((window.ACT_LATER = window.ACT_LATER || {}), defs); } };

const anb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");
const parseNum = (s) => Number(String(s).replace(/,/g, ".").replace(/−/g, "-").replace(/\s|'/g, "").replace(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/, (m, u, w) => String(u / w)));
const W = (target, msg, tol = 1e-9) => (x) => (Math.abs(x - target) <= tol ? msg : "");


const hunt0 = (o) => (box, onWin) => {
let x = null, step = 0;
const draw = () => {
const s = Math.min(step, o.wins.length - 1), fig = x === null ? (o.blank ? o.blank(s) : "") : o.show(x, s);
box.innerHTML = fig + actAnswerHtml(o.label || "Ta réponse") + (o.note ? '<div class="small muted">' + o.note + "</div>" : "");
const inp = box.querySelector(".act-in"); if (x !== null) inp.value = anb(x).replace("−", "-");
const go = () => { const v = parseNum(inp.value); if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre (fraction acceptée, par exemple 3/2)."); return; }
x = v; draw(); if (!check()) { const mm = typeof o.miss === "function" ? o.miss(x, s) : o.miss; $hint(box, mm || "Pas encore : regarde le coup de pouce, puis recalcule."); } };
actAnswerBind(box, go);
};
const check = () => { if (step >= o.wins.length) return false; const mm = o.wins[step](x); if (mm) { onWin(step, mm); step++; x = null; draw(); return true; } return false; };
draw();
};
const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });

const toi = (cp, wins) => hunt({ ask: true, label: "Ta réponse", show: (x, s) => '<div class="act-out">' + cp[s] + "<br>tu proposes <b>" + anb(x) + "</b></div>", wins });

const sv = (w, h, g, lab) => '<svg class="fig" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + lab + '" xmlns="http://www.w3.org/2000/svg">' + g + "</svg>";
const tx = (x, y, s, a = "middle", sz = 13, cls = "f-txt") => '<text x="' + (+x).toFixed(1) + '" y="' + (+y).toFixed(1) + '" class="' + cls + '" text-anchor="' + a + '" font-size="' + sz + '">' + s + "</text>";
const ln = (x1, y1, x2, y2, cls = "f-line", ex = "") => '<line x1="' + (+x1).toFixed(1) + '" y1="' + (+y1).toFixed(1) + '" x2="' + (+x2).toFixed(1) + '" y2="' + (+y2).toFixed(1) + '" class="' + cls + '"' + ex + "/>";
const pg = (pts, cls = "f-shape", ex = "") => '<polygon points="' + pts.map((p) => (+p[0]).toFixed(1) + "," + (+p[1]).toFixed(1)).join(" ") + '" class="' + cls + '"' + ex + "/>";
const DASH = ' stroke-dasharray="5 4"';




const solid = (o) => {
const k = 0.5 * Math.SQRT1_2, raw = (p) => [p[0] + k * p[1], -(p[2] + k * p[1])], P0 = o.pts;
const all = Object.values(P0).map(raw).concat(o.extra ? o.extra.map(raw) : []);
const xs = all.map((p) => p[0]), ys = all.map((p) => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
const Wm = o.W || 300, mg = 26, s = Math.min((Wm - 2 * mg) / Math.max(x1 - x0, 1e-9), ((o.H || 210) - 2 * mg) / Math.max(y1 - y0, 1e-9));
const H = Math.round((y1 - y0) * s + 2 * mg), X = (p) => { const r = raw(p); return [mg + (r[0] - x0) * s, mg + (r[1] - y0) * s]; }, Q = (n) => X(P0[n]);
let g = "";
for (const F of o.faces || []) g += pg(F.map(Q), "f-shape2", ' style="stroke:none;fill-opacity:.55"');
for (const F of o.polys || []) g += pg(F.map(Q), "f-fill2", ' style="fill-opacity:.75"');
for (const [a, b, hid] of o.edges || []) { const A = Q(a), B = Q(b); g += ln(A[0], A[1], B[0], B[1], "f-line", ' stroke-width="1.8"' + (hid ? DASH : "")); }
for (const [a, b, hid] of o.accent || []) { const A = Q(a), B = Q(b); g += ln(A[0], A[1], B[0], B[1], "f-accent", ' stroke-width="2.6"' + (hid ? DASH : "")); }
for (const [a, b, t, dx = 0, dy = 0] of o.marks || []) { const A = Q(a), B = Q(b); g += tx((A[0] + B[0]) / 2 + dx, (A[1] + B[1]) / 2 + dy, t, "middle", 12, "f-accent f-txt"); }
const cx = mg + ((x0 + x1) / 2 - x0) * s, cy = mg + ((y0 + y1) / 2 - y0) * s;
for (const n of o.labels || Object.keys(P0)) { const A = Q(n), dx = A[0] - cx, dy = A[1] - cy, d = Math.hypot(dx, dy) || 1; g += tx(A[0] + (11 * dx) / d, A[1] + (11 * dy) / d + 4, n, "middle", 13); }
for (const n of o.dots || []) { const A = Q(n); g += '<circle cx="' + A[0].toFixed(1) + '" cy="' + A[1].toFixed(1) + '" r="3.5" class="f-dot"/>'; }
return sv(Wm, H, g, o.lab || "solide en perspective");
};
return { pk, nz, r6, den, fT, fS, dT, rd, mk, QN, QR, QX, QSet, QP, QS, GR, GRad, GX, GSet, GP, GSS, TR, TX, TSt, TP, TS, P, reg, actReg, W, toi, sv, tx, ln, pg, DASH, solid };
})();

