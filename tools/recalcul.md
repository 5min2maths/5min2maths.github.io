# Recalcul indépendant (garde-fou, 26.11)

Déclencheur : un testeur a trouvé une réponse attendue fausse (canette, « hauteur minimale » acceptée à 9,6 au lieu
de 9,7) que les contrôles existants n'avaient pas vue : `tests/vraisemblance.html` contrôle la vraisemblance des
énoncés (bornes, triangles, arrondis déclarés…), le robot contrôle qu'une réponse juste n'est pas refusée, mais
personne ne refaisait le calcul.

## Principe

- `tests/recalc_oracles.js` (`RECALC.check(item)`) : chaque **oracle** relit les nombres **dans le texte que l'élève
  voit** (pas dans les variables du générateur), refait le calcul par une autre voie et compare :
  1. à la réponse attendue (`checkAnswer` sur la valeur recalculée, sans les contraintes de forme) ;
  2. à l'arrondi demandé par l'énoncé (« au dixième », « au centième », « à 10 km/h près », « à l'unité »…), **sens
     compris** : « supérieur », « minimal », « au moins », « faut-il prévoir » → arrondi vers le haut, et l'arrondi
     dans l'autre sens doit être **refusé** (cas de la canette) ; sans sens imposé, une tolérance qui accepterait
     aussi l'arrondi voisin est signalée (moyenne exactement à 5,225) ;
  3. au corrigé : `q.sol` doit contenir la valeur finale (nombre, fraction, kπ, a√b, ou expression TeX évaluée).
- Oracles génériques (sur le TeX de l'énoncé) :
  - **calcul** : « Calcule : … », « Écris … en notation scientifique / en nombre décimal » → évaluation de l'expression ;
  - **exposant** : « a^m · a^n = a^□ » ;
  - **substitution** : « Calcule E pour x = … », « Utilise la formule A = … pour L = … » ;
  - **fonction** : « Soit f(x) = … » → image, préimages, zéros, ordonnée à l'origine ;
  - **équation** : « Résous … » (une inconnue) → **toutes** les racines réelles cherchées numériquement sur
    [−200 ; 200] (changements de signe hors pôles, minima isolés pour les racines doubles), identités détectées
    (« tous les nombres »), solutions hors de l'intervalle vérifiées une à une ;
  - **inéquation** : ensemble attendu comparé point par point (grille + bornes ± 0,001, bornes elles-mêmes) ;
  - **systèmes** 2 × 2 et 3 × 3 linéaires : Cramer ;
  - **équivalence** : « Développe / Factorise / Réduis » → la réponse attendue est égale à l'expression affichée ;
  - **dérivée** : « Donne f'(x) pour f(x) = … » → dérivée numérique.
- Règles de texte (environ 250 gabarits) pour les énoncés à contexte : pourcentages, proportionnalité, vitesses,
  volumes et aires, cercle, Pythagore (et réciproque), trigonométrie, Thalès (et réciproque), triangle quelconque,
  statistiques, probabilités (dénombrement exact), arithmétique, angles et polygones, échelles, pentes, similitudes,
  grandeurs composées, pyramides.
- **Valeur exacte arrondie** (contrôle générique, toutes notions, réponses, étapes guidées et parties) : une valeur
  sans tolérance qui est l'arrondi à 5–8 décimales d'une fraction non décimale (q ≤ 30), de (p/q)·π ou (p/q)·√n
  (ex. `r6(2/3) = 0,666667`) : l'élève qui tape 2/3 ou 2π est refusé (« très proche »). Idem pour un coefficient
  arrondi dans une réponse attendue de type expression.
- **Contre-épreuve** : sur les 3 premières graines de chaque notion et niveau (et sur chaque défi reconnu), la
  réponse attendue est faussée ; l'oracle doit protester, sinon échec (oracle devenu aveugle). `#mutant` : partout.

## Page de test

`tests/recalcul.html` (dans la suite, ≈ 40 s) : passe 1, toutes les notions, niveaux 1 à 3, graines 1 à 15 ;
passe 2, notions reconnues (≥ 20 % à un niveau), graines 16 à 100, soit **100 énoncés par notion et niveau** ;
puis exercices riches et défis (parties reconnues). Échec sur tout désaccord, avec le code de la question.
Options : `#ids=pct,vitesse`, `#n=…`, `#detail` (taux de reconnaissance), `#mutant`.

Ajouter un oracle : une ligne `T(null, /gabarit/, (a, b) => calcul)` dans `tests/recalc_oracles.js` (les nombres
sont lus avec la virgule et l'apostrophe), puis vérifier avec `#ids=…&detail` et `#ids=…&mutant`.

## Erreurs trouvées et corrigées (26.11)

| Code | Notion | Avant | Après |
|---|---|---|---|
| `droites-2-4` (ch_mp2) | k pour une perpendiculaire | attendu −0,333333 (r6), « −1/3 » jugé « très proche » | −1/3 exact |
| `recip-2-*` (ch_mp2) | réciproque d'une affine | réponse `1/3*x-0.333333`, « x/3 − 1/3 » refusé | coefficients exacts |
| `diagr-3-5` (gen2) | moyenne au centième | 104,5 : 20 = 5,225 → corrigé « 5,22 », 5,22 et 5,23 acceptés | 5,23 (arrondi exact), seul 5,23 accepté |
| `automat-2-*` (fr_college) | « écris-le en fraction » | attendu 0,666667 : la fraction 2/3 refusée | valeur exacte (Qv, G, Pb sans r6) |
| `ratio-3-*` (fr_college) | fraction d'un ratio | 0,777778 : 7/9 refusé | exact |
| `ch10_no` (Qv, G) | (même constructeur) | r6 dans la réponse | exact |
| `defis_910` (sp) | défis 9e–10e | r6 dans la réponse | exact |
| `trigassoc-2-*` (ch_mp2) | tan α (fraction ou décimal) | 0,291667 : 7/24 refusé | 7/24 exact |
| `trigfn-2-*` (ch_mp2), étape | période de sin en radians | 6,283185 : « 2π » refusé | 2π exact |
| `thalesrec-3-*` (ch11_thales) | DE, EC (fraction ou décimal) | 5,333333 : 16/3 refusé ; corrigé « 5,333333 » | exact ; corrigé « 16/3 ≈ 5,33 » |
| `thales-3-r` (ch11_thales), étape | BC « au dixième » | étape sans tolérance : 10,7 refusé | tolérance 0,1 |
| `euclide-3-*` (ch1c_geo) | écart des projections | 9,153846 : 119/13 refusé | exact ; corrigé « 119/13 ≈ 9,15 » |
| `hauteurs5-3-*` (fr_trous) | hauteur issue de A | 7,058824 : 120/17 refusé | exact |
| `vitesse-3-*` (ch11_prop), étapes | « 1 h 20 min en heures décimales » et durées | 1,333333 : 1,33 refusé (faux), 4/3 « très proche » | exact, 3 chiffres significatifs acceptés (1,33 ; 4/3) |

Contrôle de la canette du testeur (`vol-4-*`, défi) : recalculé, hauteur minimale 9,7 (9,6 refusé) — correct depuis
le 25.11.

## Notions couvertes (taux d'énoncés recalculés aux niveaux 1, 2, 3 ; 100 tirages par niveau)

| Notion | Libellé | Niveaux 1 / 2 / 3 |
|---|---|---|
| `prio` | Priorités des opérations | 82 %  78 %  100 % |
| `pct` | Pourcentages | 100 %  100 %  100 % |
| `puiss` | Puissances | 100 %  76 %  100 % |
| `valnum` | Substituer dans une expression littérale | 100 %  100 %  100 % |
| `reduire` | Réduire une expression | 100 %  100 %  76 % |
| `distrib` | Développer | 100 %  92 %  100 % |
| `idrem` | Identités remarquables | 100 %  77 %  59 % |
| `factor` | Factoriser | 100 %  100 %  58 % |
| `eq1` | Équations du 1er degré | 100 %  79 %  76 % |
| `eq2` | Équations produit nul | 84 %  100 %  74 % |
| `prop` | Quatrième proportionnelle, règle de trois | 100 %  100 %  100 % |
| `vitesse` | Vitesse, distance, durée | 100 %  100 %  100 % |
| `echelle` | Échelles et pentes | 100 %  88 %  100 % |
| `pyth` | Théorème de Pythagore | 100 %  100 %  100 % |
| `vol` | Volumes : prisme droit et cylindre | 100 %  100 %  100 % |
| `thales` | Théorème de Thalès | 100 %  100 %  74 % |
| `eq3` | Équations de degré 3 par factorisation | 100 %  100 %  100 % |
| `eq2disc` | Équations du 2e degré (formule) | 63 %  100 %  59 % |
| `trigo` | Trigonométrie du triangle rectangle | 100 %  78 %  100 % |
| `sinlaw` | Triangle quelconque (sinus, cosinus) | 100 %  100 %  100 % |
| `expo` | Exponentielles | 100 %  100 %  0 % |
| `stats` | Statistiques (moyenne, médiane, écart-type) | 100 %  100 %  100 % |
| `angtri` | Somme des angles d'un triangle | 100 %  100 %  100 % |
| `arith` | PGDC et PPMC | 100 %  100 %  100 % |
| `diagr` | Diagrammes et moyennes | 100 %  100 %  100 % |
| `disque` | Cercle et disque | 100 %  100 %  100 % |
| `polyreg` | Polygones réguliers | 100 %  100 %  100 % |
| `volcone` | Volumes : pyramide, cône, boule | 100 %  100 %  100 % |
| `gquot` | Masse volumique et débit | 100 %  40 %  100 % |
| `simil` | Homothéties et similitudes | 100 %  78 %  100 % |
| `proba` | Probabilités | 100 %  100 %  100 % |
| `polyop` | Polynômes : développer et réduire | 100 %  81 %  100 % |
| `factor2` | Factoriser au maximum | 100 %  100 %  100 % |
| `racinv` | Fonctions racine carrée et inverse | 100 %  59 %  30 % |
| `ineq2` | Inéquations du 2e degré | 100 %  79 %  0 % |
| `polyfact` | Factoriser un polynôme, racine évidente | 0 %  100 %  100 % |
| `fracrat` | Fractions rationnelles | 72 %  100 %  70 % |
| `eqrat` | Équations rationnelles | 100 %  100 %  100 % |
| `pow9` | Carrés, cubes et puissances | 39 %  57 %  100 % |
| `fracops` | Fractions relatives et priorités | 100 %  100 %  65 % |
| `pctvar` | Augmentation et diminution en pourcentage | 100 %  100 %  100 % |
| `pente` | Pente en pourcentage | 100 %  100 %  100 % |
| `airepyr` | Aire d'une pyramide, apothème | 100 %  100 %  38 % |
| `ucomp` | Convertir des unités composées | 89 %  100 %  96 % |
| `parenth` | Supprimer des parenthèses | 100 %  71 %  70 % |
| `eqfrac` | Équations avec parenthèses ou fractions | 100 %  100 %  100 % |
| `eq2fact` | Équations du 2e degré par factorisation | 69 %  87 %  100 % |
| `thalesrec` | Réciproque de Thalès | 56 %  100 %  100 % |
| `statfreq` | Effectifs, fréquences, diagramme circulaire | 53 %  0 %  100 % |
| `eqspec` | Équations impossibles ou indéterminées | 100 %  100 %  41 % |
| `bicarre` | Équations bicarrées | 100 %  100 %  100 % |
| `fracetage` | Fractions à étages | 100 %  0 %  0 % |
| `ineqfrac` | Inéquations fractionnaires | 100 %  100 %  72 % |
| `eqirr` | Équations irrationnelles | 85 %  100 %  100 % |
| `expfrac` | Exposants fractionnaires | 84 %  100 %  0 % |
| `racprop` | Racines : propriétés (carrées et cubiques) | 100 %  21 %  16 % |
| `eqbic` | Équations bicarrées, changement de variable | 66 %  100 %  100 % |
| `eqirrmp` | Équations irrationnelles | 100 %  100 %  72 % |
| `eqratmp` | Équations rationnelles | 67 %  100 %  38 % |
| `eqexp` | Équations exponentielles | 100 %  100 %  100 % |
| `ineqmp` | Inéquations, tableau des signes | 37 %  84 %  100 % |
| `tabsignes` | Tableau de signes, inéquations produit et quotient | 0 %  100 %  100 % |
| `derivregles` | Dériver une somme, un polynôme | 66 %  100 %  0 % |
| `ineqpoly` | Inéquations polynomiales (tableau des signes) | 100 %  100 %  100 % |
| `trinfact` | Factoriser un trinôme par ses zéros | 71 %  68 %  98 % |
| `lnexp` | Logarithme et exponentielle | 74 %  92 %  0 % |
| `rel` | Nombres relatifs : multiplier, diviser, priorités | 73 %  76 %  90 % |
| `sys2` | Systèmes de deux équations | 67 %  90 %  29 % |
| `fracadd` | Fractions : additionner, soustraire | 71 %  62 %  89 % |
| `cercle` | Équations de cercles | 0 %  84 %  0 % |
| `pythrec` | Réciproque de Pythagore | 81 %  63 %  31 % |
| `carres` | Carrés parfaits, racines exactes | 53 %  79 %  46 % |
| `expderiv` | Exponentielle : dérivée, tangente, variations | 79 %  35 %  0 % |
| `sci` | Notation scientifique | 78 %  35 %  72 % |
| `log` | Logarithmes | 0 %  78 %  0 % |
| `fimg` | Images et préimages | 71 %  77 %  35 % |
| `ineq` | Inéquations du 1er degré | 70 %  77 %  69 % |
| `derivcomp` | Dériver une fonction composée | 74 %  65 %  35 % |
| `sys3` | Systèmes de trois équations | 73 %  69 %  28 % |
| `puisrat` | Puissances d'exposant rationnel | 73 %  40 %  64 % |
| `rac` | Racines carrées | 72 %  6 %  0 % |
| `lnfr` | Logarithme népérien : propriétés, équations, seuils | 72 %  29 %  65 % |
| `angles` | Angles : parallèles, cercle | 44 %  52 %  71 % |
| `quartiles` | Étendue, médiane, quartiles | 71 %  16 %  30 % |
| `expfn` | Fonction exponentielle : propriétés, équations | 29 %  37 %  71 % |
| `derivprodquot` | Dériver un produit, un quotient | 71 %  34 %  35 % |
| `fracmul` | Fractions : multiplier, diviser | 63 %  66 %  70 % |
| `decdiv` | Diviser des nombres décimaux | 66 %  24 %  70 % |
| `ineq1` | Inéquations du 1er degré | 51 %  67 %  0 % |
| `scicalc` | Calculer en notation scientifique | 65 %  58 %  30 % |
| `decmul` | Multiplier des nombres décimaux | 63 %  22 %  38 % |
| `f2formes` | Formes d'une fonction du 2e degré | 62 %  0 %  27 % |
| `reladd` | Additionner et soustraire des relatifs | 28 %  14 %  61 % |
| `eqlog` | Équations logarithmiques | 37 %  48 %  60 % |
| `fref` | Fonctions de référence : carré, inverse, racine | 28 %  58 %  21 % |
| `fracconv` | Fraction, nombre décimal, pourcentage | 57 %  0 %  0 % |
| `derivref` | Dérivées des fonctions de référence | 37 %  44 %  55 % |
| `decread` | Lire et décomposer un nombre décimal | 0 %  22 %  51 % |
| `dec10` | Multiplier et diviser par 10, 100, 1000 | 28 %  26 %  47 % |
| `volmp` | Volumes des solides | 47 %  0 %  22 % |
| `cart` | Distance et milieu | 45 %  0 %  41 % |
| `tabval` | Tableau de valeurs d'une fonction | 43 %  25 %  20 % |
| `syslin` | Systèmes linéaires et matrices (Cramer, inverse) | 0 %  35 %  42 % |
| `affine` | Fonctions affines | 39 %  0 %  41 % |
| `decadd` | Additionner et soustraire des décimaux | 36 %  25 %  36 % |
| `coordmp` | Coordonnées : distance, milieu, polaires | 36 %  0 %  0 % |
| `trigfr` | Fonctions sinus et cosinus | 35 %  31 %  0 % |
| `ratden` | Rendre rationnel un dénominateur | 34 %  0 %  30 % |
| `logdef` | Logarithmes : définition et calcul | 0 %  0 %  34 % |
| `airelat` | Aire latérale et totale : prisme, cylindre | 0 %  0 %  32 % |
| `trigexact` | Valeurs exactes, pente et angle | 0 %  32 %  28 % |
| `etudelnexp` | Étude de fonctions avec ln et exp | 0 %  0 %  32 % |
| `droites` | Équations de droites | 0 %  24 %  31 % |
| `sysineq` | Systèmes d'inéquations du 1er degré | 0 %  31 %  0 % |
| `matrices` | Matrices 2 × 2 : calcul, déterminant, inverse | 0 %  0 %  30 % |
| `polymp` | Polynômes : zéros, division, signe | 0 %  0 %  29 % |
| `sysgraph` | Systèmes : nombre de solutions | 26 %  0 %  0 % |
| `autodnb` | Automatismes du brevet (partie 1) | 0 %  0 %  25 % |
| `f2` | Parabole : zéros et sommet | 0 %  20 %  0 % |

## Notions non couvertes et pourquoi

- **Lecture de figure ou de graphique** (les données ne sont pas dans le texte) : `affine` (lire la pente),
  `fimg` (« la courbe représente »), `angles` (angle marqué), `lectgraph`, `ineqgraph`, `repere`, `repere3d`,
  `rotation`, `symax`, `empil`, `solides`, `tabform5`, `filtre6`, `graphefct`, `sysgraph` en partie.
- **Réponse qui n'est pas un nombre recalculable** (choix, vrai/faux, forme d'écriture, raisonnement) :
  `structexpr`, `tradexpr`, `tradalg`, `implication`, `contrex`, `demoalg`, `recurrence`, `algopy`, `bijection`,
  `ensembles`, `angtype`, `quadri`, `continuite`, `tvi`, `derivth`.
- **Énoncés à mise en équation très variés** (un gabarit par histoire, rendement faible) : `probeq`, `probeq2`,
  `sysprob`, `probrat`, `optim`, `optimderiv`, `modaff`, `modexp`, `croissexp`, `croissance`, `decprob`.
- **Niveaux avancés pas encore outillés** (oracles à écrire : vecteurs, complexes, intégrales, suites, lois) :
  `vectmp`, `scalmp`, `projmp`, `pvectmp`, `vect3d`, `colin`, `droite3d`, `plans`, `posrel`, `pscal3d`, `distances`,
  `sphere`, `pvect`, `cplxalg`, `cplxtrig`, `cplxeq`, `primitives`, `integrale`, `aireint`, `volrev`, `intparties`,
  `intsubst`, `eqdiff`, `suitedef`, `suitearith`, `suitegeo`, `suitesomme`, `suitelim`, `serie`, `binom`,
  `binomiale`, `normale`, `approxnorm`, `densite`, `varalea`, `vaesp`, `matrices`, `translin`, `appllin`, `bases`.
- **Couverture partielle à compléter en priorité** (notions fréquentes de 9e–11e dont seules certaines formes
  sont reconnues) : `volcomp`, `volmanq`, `grandmanq`, `voldecomp`, `pythfig`, `eqverif`, `ucomp` (formes rares),
  `perim`, `aire1`–`aire3`, `ulong`, `uaire`, `uvol`, `utemps`, `fracsimp`, `fracrep`, `fracper`, `fractout`,
  `trigcercle`, `trigeq` (solutions périodiques), `absval`, `recip`, `formule` (réponse = expression littérale).
- **Exercices riches** : leurs parties n'ont pas de réponse attendue automatique (barème en points) ; **défis**
  (niveau 4) : seule la canette est reconnue (14 tirages) — les défis sont des problèmes à étapes, un gabarit par
  défi.

Liste brute des notions sous 20 % : `fratmp`, `volpave`, `monomes`, `tauxevol`, `automat`, `inter`, `euclide`, `recip`, `absval`, `trigcercle`, `trigeq`, `formule`, `probeq`, `domaine`, `f2expr`, `droitesrem`, `polydiv`, `homog`, `trigfn`, `deccomp`, `decarr`, `ordgr`, `decprob`, `tradexpr`, `multdiv`, `divcrit`, `premiers`, `relrep`, `fracrep`, `fracsimp`, `fracper`, `fractout`, `ulong`, `uaire`, `uvol`, `utemps`, `perim`, `aire1`, `aire2`, `aire3`, `solides`, `proptab`, `change`, `agrand`, `litelab`, `angtype`, `quadri`, `grandmanq`, `voldecomp`, `racenc`, `pythfig`, `eqverif`, `repere`, `rotation`, `volcomp`, `volmanq`, `probeq2`, `cercthales`, `sysprob`, `denombr`, `ensembles`, `vabs`, `valint`, `eqparam`, `exactes`, `optim`, `modexp`, `compo`, `lectgraph`, `affzero`, `f2trois`, `interpar`, `modaff`, `geocomb`, `probrat`, `bijection`, `decomp`, `polyexpr`, `homogrec`, `trigassoc`, `trigeq2`, `logbase`, `triaire`, `droitesinter`, `cercletan`, `symetries`, `morceaux`, `transf`, `trigrel`, `vecteurs`, `recipaff`, `eqabs`, `logprop`, `croissexp`, `similmp`, `vectmp`, `scalmp`, `projmp`, `pvectmp`, `droiteparam`, `posdroites`, `fctmp`, `sinusmp`, `explogfn`, `suitedef`, `suitearith`, `suitegeo`, `suitesomme`, `pscal`, `probtot`, `vaesp`, `suitelim`, `binom`, `proba2`, `vect3e`, `probcond`, `algopy`, `tauxvar`, `nbderive`, `tangente`, `variations`, `optimderiv`, `limites`, `limitinf`, `asymptotes`, `continuite`, `derivseconde`, `etudefct`, `combi`, `probaxiomes`, `probarbre`, `derivth`, `vect3d`, `colin`, `droite3d`, `plans`, `posrel`, `pscal3d`, `distances`, `sphere`, `pvect`, `primitives`, `integrale`, `aireint`, `volrev`, `croissance`, `intparties`, `intsubst`, `eqdiff`, `translin`, `appllin`, `condbayes`, `varalea`, `binomiale`, `normale`, `statdesc`, `bayes`, `bases`, `cplxalg`, `cplxtrig`, `cplxeq`, `suitegeom`, `serie`, `geoesp`, `densite`, `approxnorm`, `tradalg`, `contrex`, `demoalg`, `implication`, `graphefct`, `ineqgraph`, `repere3d`, `progcalc`, `ratio`, `milieux`, `structexpr`, `motifs`, `trigrad`, `droitenorm`, `linfn`, `cos4e`, `thales4e`, `vecgeo`, `tabvar`, `tvi`, `sommeva`, `recurrence`, `symax`, `mediatrice`, `echelle6`, `proba6`, `empil`, `compdiff`, `posrelc`, `intmaj`, `suiteint`, `cercle6`, `bissec6`, `filtre6`, `tabform5`, `hauteurs5`.
