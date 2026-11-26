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
- **Saisie** (26.11, extension) : avec la réponse attendue **complète** (formes exigées : `plain`, `radical`, `final`),
  `checkAnswer` doit accepter l'arrondi annoncé tapé avec la virgule (« 14,9 »), la fraction irréductible (quand
  l'énoncé dit « fraction » ou que la valeur est un décimal illimité), kπ (« 160π ») et a√b (« 2√2 ») quand la valeur
  en est un ; une réponse `plain` (décimal seul) dont la valeur est un décimal illimité est signalée.
- Oracles génériques ajoutés le 26.11 : **vérification** (« Lequel / Combien de ces nombres est solution de … ? » :
  chaque proposition est substituée, « Lequel » exige exactement une solution), **équation trigonométrique** (toutes
  les solutions sur [0° ; 360°[ ou [0 ; 2π[, racines doubles comprises), **monômes** (« Calcule : 4y · 9y », M² = …),
  **périodique** (0,2\overline{7} → fraction), **domaine** de définition (appartenance point par point, pôles et bords
  des racines vérifiés exactement), **parabole** (sommet, zéros, extremum, expression à partir de sommet + a, zéros + a,
  sommet + point, zéros + point, trois points, axe + ordonnée à l'origine + point, zéros + extremum), **zéro** d'une
  fonction, **inéquation « x > a »** (réponse de type `ineq`), **formule** (« exprime t en fonction des autres lettres » :
  la réponse substituée vérifie la formule pour des valeurs quelconques). Valeur absolue |…| lue dans le TeX.
- Règles de texte ajoutées (≈ 330) : volumes composés et manquants, Pythagore dans les figures, conversions d'unités
  (longueurs, masses, aires, volumes, capacités, durées, unités composées — table d'unités, pas de gabarit par
  conversion), fractions (amplifier, simplifier, comparer, encadrer, périodiques, fraction d'une quantité), périmètres
  et aires, grandeur manquante, décimaux (arrondir, encadrer, comparer, ranger, ×10, lire), divisibilité, multiples,
  premiers, tableaux de proportionnalité, change, agrandissement, ordre de grandeur, relatifs sur la droite, racines
  (encadrer, comparer), cercle de Thalès et tangente, dénombrement, Euclide et hauteur, droites remarquables,
  relations trigonométriques, problèmes (mise en équation, 2e degré, systèmes à deux inconnues — réponse en couple).
  Option `exact` (`TE`) : réponse exacte, sans relire l'arrondi dans l'énoncé (« au dixième » y est une donnée).
- **Contre-épreuve** : sur les 3 premières graines de chaque notion et niveau (et sur chaque défi reconnu), la
  réponse attendue est faussée ; l'oracle doit protester, sinon échec (oracle devenu aveugle). `#mutant` : partout.

## Page de test

`tests/recalcul.html` et `tests/recalcul2.html` (dans la suite ; **scindée en deux le 26.11 au soir** : 316 s sous charge 10 pour la page unique après la 3e extension, au-delà de la cible de 200 s ; recalcul.html = notions de rang pair + exercices riches et défis, recalcul2.html = notions de rang impair, `<meta name="part">` ; les deux fichiers ne diffèrent que par cette meta) : passe 1, toutes les notions, niveaux 1 à 3, graines 1 à 15 ;
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

### Extension du 26.11 (agent/recalc2)

Aucune réponse attendue fausse dans les 53 notions ajoutées (≈ 9'300 énoncés de plus recalculés) ; la saisie accepte
partout les écritures justes. Corrections :

| Code | Notion | Avant | Après |
|---|---|---|---|
| `probeq-*` (ch1c_eq, âges) | « a le double de l'âge de son fils » | un père de 12 ans pour un fils de 6 ans (écart d'âge invraisemblable) ; « Une mère … sa fille … ils » | écart ≥ 20 ans (grands-parents ≥ 45 ans) ; « elles » pour deux femmes |
| `eqverif-3-*` (gen3) | combien de solutions parmi une liste | corrigé sans le nombre demandé | « …, donc 2 nombres de la liste » |
| `fracper-1-*`, `fracper-2-*` (variantes) | chiffre / groupe qui se répète | corrigé « 10,6666… » sans la réponse | « : le chiffre 6 se répète », « le groupe 81 se répète » |
| `divcrit-2-*`, `divcrit-3-*` (ch1c_no) | combien sont divisibles ; plus petit chiffre ■ | corrigé sans le nombre (liste seule) ; sans le chiffre (852 seul) | « soit 2 nombres » ; « le chiffre est 2 » |
| `premiers-1-*` (variantes) | combien de premiers entre a et b | corrigé = liste de tous les premiers jusqu'à 100 | premiers de l'intervalle et leur nombre |
| `racenc-2-*` (ch1c_no) | le plus grand de a√b et √c | corrigé sans conclusion | « le plus grand est √19 » |
| `f2trois-1-*` (ch1c_f2b) | que vaut a ? | corrigé s'arrêtant à « 2a = −6 » | « …, donc a = −3 » |

Oracle : la recherche des racines doubles manquait une racine située exactement à mi-chemin de deux pas de la grille
(sin 2x = 1) ; corrigé (≤ d'un côté). `solHas` lit aussi les nombres sans fusionner « 21 133 » (« 21 : 133 » en
texte lisible).

Contrôle de la canette du testeur (`vol-4-*`, défi) : recalculé, hauteur minimale 9,7 (9,6 refusé) — correct depuis
le 25.11.

### Extension du soir (26.11, agent/defis2)

Oracles ajoutés (`tests/recalc_oracles.js`, sections « défis » et « notions encore sous 20 % ») :

- **Défis rendus aléatoires** (symax, mediatrice, echelle6, proba6, empil, compdiff, posrelc, intmaj, suiteint, approxnorm,
  isom, numer) : un oracle par contexte et par question (`DF`, texte « énoncé ¶ question », seulement sur les parties de
  défi) ; cohérence de l'énoncé contrôlée (angles du triangle et côtés, cordes < 2R, monotonie et encadrement de
  l'intégrale par Simpson, valeur de Φ donnée comparée à Φ réelle, z recalculé) ; suites d'intégrales recalculées par
  Simpson. 5'400 questions sur 150 graines : 100 % reconnues, aucun désaccord, contre-épreuves détectées.
- **transf** (sommets et minima par recherche numérique sur g, points images, g(a), forme canonique, décalages),
  **trigcercle** (conversions, quadrants, valeurs exactes, coordonnées, angle unique sur un intervalle), **trigfn**
  (amplitude, extremums, position du minimum, image en degrés, période par balayage et affinage, nombre de zéros),
  **recip** (antécédent unique sur le domaine de restriction, expression de f⁻¹ vérifiée par f(f⁻¹(y)) = y, composée).
- **Lecture de graphique** (`figRead`) : la figure SVG de `FIG.plot` est relue (graduations → échelle, tracé de la courbe,
  points marqués et leurs noms) ; parabole ajustée par moindres carrés, lecture « propre » exigée à la demi-unité près.
  Couvre f2 (zéros lus, axe de symétrie, sommet lu, forme canonique lue, a à partir de S et P, a à partir des zéros et de
  f(0)) et f2expr (sommet lu, même ouverture que ±x²). Le texte de l'item porte maintenant `fig`.
- f2 « Détermine le sommet » (fractions), f2expr « axe, ordonnée à l'origine et un point ».
- probeq : nombres pairs/impairs consécutifs, note manquante pour une moyenne, prix avant réduction, partage du sac la
  nuit ; decadd : rendu de monnaie, écarts (course, saut), bouteille.
- Autres notions fréquentes : **inter** (intersections, nombre de points, distance horizontale, tangente horizontale),
  **homog** (asymptotes, réciproque vérifiée), **polydiv** (reste, quotient vérifié, a et b, k, reste d'une division par
  un trinôme), **nbderive** (nombre dérivé par différences centrées d'ordre 4, s'(t)), **combi** (19 gabarits),
  **milieux**, **suitearith** / **suitegeo** (formes directes).

Taux (niveaux 1 / 2 / 3) : transf, trigcercle, trigfn, recip, f2, f2expr, probeq, decadd, inter, homog 100 % partout ;
polydiv 100 / 100 / 59 ; combi 100 / 100 / 70 ; nbderive 33 / 87 / 100 ; milieux 100 / 100 / 0 ; suitearith 70 / 41 / 0 ;
suitegeo 54 / 0 / 0. Total : **187 notions couvertes** (178 avant), 41'266 énoncés recalculés sur 62'355.

Erreurs trouvées et corrigées :

| Code | Notion | Avant | Après |
|---|---|---|---|
| `f2expr-3-*` (ch1c_f2b, axe-point) | axe x = h, ordonnée à l'origine c, point (2h ; c) | le point donné était le symétrique de (0 ; c) : a indéterminé, infinité de paraboles, une seule acceptée | point choisi hors de 0, h et 2h |
| `inter-2-*` (ch1c_f2b, delta) et forme hyperbole | « combien de points d'intersection » | corrigé « un point (droite tangente) », sans le nombre en chiffres | « 1 point (droite tangente) », « 2 points », « 0 point » |

Outils corrigés : `tests/recalcul.html` ne chargeait pas `src/perco.js` (isom, ensco, numer, fctlec, litconv jamais
recalculés) ; la contre-épreuve v → 1,2v + 0,7 laissait −3,5 inchangé (point fixe : réponse faussée identique), elle
ajoute maintenant 1 dans ce cas.

Aucune erreur dans les fichiers réservés à l'autre agent (app.js, expr.js, active.js, riche_2c.js, variantes.js) n'a
été rencontrée par ces oracles.

## Notions couvertes (taux d'énoncés recalculés aux niveaux 1, 2, 3 ; 100 tirages par niveau ; état du 26.11 après extension)

Avant l'extension (matin du 26.11) : **119 notions** couvertes (≥ 20 % à un niveau). Après : **172 notions** (+53, marquées « nouveau »), 38'173 énoncés recalculés sur 58'560 (avant : 28'827 sur 50'655), 1'176 contre-épreuves.

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
| `euclide` (nouveau) | Théorèmes d'Euclide et de la hauteur | 100 %  100 %  100 % |
| `trigo` | Trigonométrie du triangle rectangle | 100 %  78 %  100 % |
| `sinlaw` | Triangle quelconque (sinus, cosinus) | 100 %  100 %  100 % |
| `expo` | Exponentielles | 100 %  100 %  0 % |
| `absval` (nouveau) | Valeur absolue | 73 %  100 %  100 % |
| `trigeq` (nouveau) | Équations trigonométriques | 100 %  100 %  100 % |
| `stats` | Statistiques (moyenne, médiane, écart-type) | 100 %  100 %  100 % |
| `angtri` | Somme des angles d'un triangle | 100 %  100 %  100 % |
| `arith` | PGDC et PPMC | 100 %  100 %  100 % |
| `diagr` | Diagrammes et moyennes | 100 %  100 %  100 % |
| `disque` | Cercle et disque | 100 %  100 %  100 % |
| `polyreg` | Polygones réguliers | 100 %  100 %  100 % |
| `volcone` | Volumes : pyramide, cône, boule | 100 %  100 %  100 % |
| `gquot` | Masse volumique et débit | 100 %  40 %  100 % |
| `formule` (nouveau) | Transformer une formule | 100 %  100 %  88 % |
| `simil` | Homothéties et similitudes | 100 %  78 %  100 % |
| `proba` | Probabilités | 100 %  100 %  100 % |
| `polyop` | Polynômes : développer et réduire | 100 %  81 %  100 % |
| `factor2` | Factoriser au maximum | 100 %  100 %  100 % |
| `domaine` (nouveau) | Domaine de définition | 100 %  100 %  100 % |
| `f2expr` (nouveau) | Parabole : retrouver l'expression | 100 %  60 %  98 % |
| `racinv` | Fonctions racine carrée et inverse | 100 %  59 %  30 % |
| `ineq2` | Inéquations du 2e degré | 100 %  79 %  0 % |
| `droitesrem` (nouveau) | Droites remarquables du triangle | 100 %  100 %  100 % |
| `polyfact` | Factoriser un polynôme, racine évidente | 0 %  100 %  100 % |
| `fracrat` | Fractions rationnelles | 72 %  100 %  70 % |
| `eqrat` | Équations rationnelles | 100 %  100 %  100 % |
| `decread` | Lire et décomposer un nombre décimal | 100 %  100 %  100 % |
| `deccomp` (nouveau) | Comparer et ranger des nombres décimaux | 100 %  100 %  100 % |
| `decarr` (nouveau) | Encadrer et arrondir | 100 %  100 %  100 % |
| `ordgr` (nouveau) | Ordre de grandeur | 100 %  100 %  100 % |
| `decadd` | Additionner et soustraire des décimaux | 73 %  72 %  100 % |
| `dec10` | Multiplier et diviser par 10, 100, 1000 | 100 %  100 %  100 % |
| `decmul` | Multiplier des nombres décimaux | 100 %  39 %  67 % |
| `decprob` (nouveau) | Problèmes avec des nombres décimaux | 100 %  100 %  100 % |
| `pow9` | Carrés, cubes et puissances | 39 %  57 %  100 % |
| `multdiv` (nouveau) | Multiples et diviseurs | 100 %  100 %  100 % |
| `divcrit` (nouveau) | Critères de divisibilité | 98 %  71 %  100 % |
| `premiers` (nouveau) | Nombres premiers, décomposition | 100 %  100 %  100 % |
| `relrep` (nouveau) | Nombres relatifs : repérer et comparer | 100 %  100 %  100 % |
| `fracrep` (nouveau) | Fractions : comparer et encadrer | 100 %  100 %  100 % |
| `fracsimp` (nouveau) | Amplifier et simplifier une fraction | 100 %  100 %  100 % |
| `fracconv` | Fraction, nombre décimal, pourcentage | 90 %  100 %  100 % |
| `fracper` (nouveau) | Fractions et nombres périodiques | 100 %  100 %  100 % |
| `fractout` (nouveau) | Fraction d'une quantité | 100 %  100 %  100 % |
| `ulong` (nouveau) | Unités de longueur et de masse | 100 %  100 %  100 % |
| `uaire` (nouveau) | Unités d'aire | 100 %  100 %  100 % |
| `uvol` (nouveau) | Unités de volume et de capacité | 100 %  100 %  100 % |
| `utemps` (nouveau) | Durées et horaires | 100 %  95 %  91 % |
| `perim` (nouveau) | Périmètre d'un polygone | 100 %  100 %  100 % |
| `aire1` (nouveau) | Aire : carré, rectangle, triangle | 100 %  89 %  100 % |
| `aire2` (nouveau) | Aire : parallélogramme, losange | 100 %  100 %  100 % |
| `aire3` (nouveau) | Aire par décomposition | 100 %  100 %  100 % |
| `proptab` (nouveau) | Tableau de proportionnalité | 100 %  100 %  100 % |
| `change` (nouveau) | Taux de change | 100 %  100 %  100 % |
| `agrand` (nouveau) | Agrandir, réduire | 100 %  100 %  100 % |
| `grandmanq` (nouveau) | Retrouver une dimension à partir de l'aire | 100 %  100 %  100 % |
| `fracops` | Fractions relatives et priorités | 100 %  100 %  65 % |
| `voldecomp` (nouveau) | Volumes : décomposition et contenances | 100 %  100 %  100 % |
| `racenc` (nouveau) | Encadrer et comparer des racines | 100 %  100 %  100 % |
| `monomes` (nouveau) | Multiplier des monômes | 100 %  73 %  27 % |
| `pythfig` (nouveau) | Pythagore dans une figure ou un solide | 90 %  100 %  100 % |
| `eqverif` (nouveau) | Vérifier une solution d'équation | 100 %  100 %  100 % |
| `pctvar` | Augmentation et diminution en pourcentage | 100 %  100 %  100 % |
| `pente` | Pente en pourcentage | 100 %  100 %  100 % |
| `airepyr` | Aire d'une pyramide, apothème | 100 %  100 %  38 % |
| `volcomp` (nouveau) | Volume d'un solide composé | 100 %  100 %  100 % |
| `volmanq` (nouveau) | Retrouver une dimension d'un solide | 100 %  100 %  100 % |
| `ucomp` | Convertir des unités composées | 89 %  100 %  100 % |
| `parenth` | Supprimer des parenthèses | 100 %  71 %  70 % |
| `eqfrac` | Équations avec parenthèses ou fractions | 100 %  100 %  100 % |
| `eq2fact` | Équations du 2e degré par factorisation | 69 %  87 %  100 % |
| `probeq2` (nouveau) | Problèmes du 2e degré | 76 %  100 %  100 % |
| `cercthales` (nouveau) | Cercle de Thalès et tangente | 100 %  100 %  100 % |
| `thalesrec` | Réciproque de Thalès | 56 %  100 %  100 % |
| `sysprob` (nouveau) | Problèmes à deux inconnues | 100 %  100 %  100 % |
| `denombr` (nouveau) | Dénombrer | 100 %  100 %  61 % |
| `statfreq` | Effectifs, fréquences, diagramme circulaire | 53 %  0 %  100 % |
| `eqspec` | Équations impossibles ou indéterminées | 100 %  100 %  41 % |
| `bicarre` | Équations bicarrées | 100 %  100 %  100 % |
| `affzero` (nouveau) | Zéro et signe d'une fonction du premier degré | 86 %  100 %  61 % |
| `f2trois` (nouveau) | Parabole passant par trois points | 100 %  100 %  100 % |
| `fracetage` | Fractions à étages | 100 %  0 %  0 % |
| `ineqfrac` | Inéquations fractionnaires | 100 %  100 %  72 % |
| `eqirr` | Équations irrationnelles | 85 %  100 %  100 % |
| `trigrel` (nouveau) | Relations trigonométriques | 100 %  100 %  100 % |
| `expfrac` | Exposants fractionnaires | 84 %  100 %  0 % |
| `racprop` | Racines : propriétés (carrées et cubiques) | 100 %  21 %  31 % |
| `eqabs` (nouveau) |  | 100 %  73 %  76 % |
| `eqbic` | Équations bicarrées, changement de variable | 66 %  100 %  100 % |
| `eqirrmp` | Équations irrationnelles | 100 %  100 %  72 % |
| `eqratmp` | Équations rationnelles | 67 %  100 %  38 % |
| `eqexp` | Équations exponentielles | 100 %  100 %  100 % |
| `ineqmp` | Inéquations, tableau des signes | 100 %  84 %  100 % |
| `tabsignes` | Tableau de signes, inéquations produit et quotient | 0 %  100 %  100 % |
| `derivregles` | Dériver une somme, un polynôme | 66 %  100 %  0 % |
| `ineqpoly` | Inéquations polynomiales (tableau des signes) | 100 %  100 %  100 % |
| `trinfact` | Factoriser un trinôme par ses zéros | 71 %  68 %  98 % |
| `lnexp` | Logarithme et exponentielle | 74 %  92 %  0 % |
| `rel` | Nombres relatifs : multiplier, diviser, priorités | 73 %  76 %  90 % |
| `sys2` | Systèmes de deux équations | 67 %  90 %  29 % |
| `fracadd` | Fractions : additionner, soustraire | 71 %  62 %  89 % |
| `cercle` | Équations de cercles | 0 %  84 %  0 % |
| `rac` | Racines carrées | 82 %  6 %  0 % |
| `pythrec` | Réciproque de Pythagore | 81 %  63 %  31 % |
| `carres` | Carrés parfaits, racines exactes | 53 %  79 %  46 % |
| `expderiv` | Exponentielle : dérivée, tangente, variations | 79 %  35 %  0 % |
| `sci` | Notation scientifique | 78 %  35 %  72 % |
| `log` | Logarithmes | 0 %  78 %  0 % |
| `fimg` | Images et préimages | 71 %  77 %  35 % |
| `ineq` | Inéquations du 1er degré | 70 %  77 %  69 % |
| `probeq` (nouveau) | Mettre un problème en équation | 69 %  77 %  77 % |
| `derivcomp` | Dériver une fonction composée | 74 %  65 %  35 % |
| `sys3` | Systèmes de trois équations | 73 %  69 %  28 % |
| `puisrat` | Puissances d'exposant rationnel | 73 %  40 %  64 % |
| `lnfr` | Logarithme népérien : propriétés, équations, seuils | 72 %  29 %  65 % |
| `angles` | Angles : parallèles, cercle | 44 %  52 %  71 % |
| `quartiles` | Étendue, médiane, quartiles | 71 %  16 %  30 % |
| `expfn` | Fonction exponentielle : propriétés, équations | 29 %  37 %  71 % |
| `derivprodquot` | Dériver un produit, un quotient | 71 %  34 %  35 % |
| `fracmul` | Fractions : multiplier, diviser | 63 %  66 %  70 % |
| `decdiv` | Diviser des nombres décimaux | 66 %  67 %  70 % |
| `f2` | Parabole : zéros et sommet | 63 %  68 %  38 % |
| `vabs` (nouveau) | Valeur absolue d'un nombre | 67 %  63 %  49 % |
| `ineq1` | Inéquations du 1er degré | 51 %  67 %  0 % |
| `volpave` (nouveau) | Cube et pavé : volume et aire | 65 %  0 %  0 % |
| `scicalc` | Calculer en notation scientifique | 65 %  58 %  30 % |
| `exactes` (nouveau) | Longueurs et aires en valeurs exactes | 62 %  0 %  0 % |
| `f2formes` | Formes d'une fonction du 2e degré | 62 %  0 %  61 % |
| `reladd` | Additionner et soustraire des relatifs | 28 %  14 %  61 % |
| `eqlog` | Équations logarithmiques | 37 %  48 %  60 % |
| `fref` | Fonctions de référence : carré, inverse, racine | 28 %  58 %  21 % |
| `volmp` | Volumes des solides | 47 %  56 %  36 % |
| `derivref` | Dérivées des fonctions de référence | 37 %  44 %  55 % |
| `cart` | Distance et milieu | 45 %  0 %  41 % |
| `tabval` | Tableau de valeurs d'une fonction | 43 %  25 %  20 % |
| `syslin` | Systèmes linéaires et matrices (Cramer, inverse) | 0 %  35 %  42 % |
| `affine` | Fonctions affines | 39 %  0 %  41 % |
| `serie` (nouveau) |  | 37 %  0 %  0 % |
| `coordmp` | Coordonnées : distance, milieu, polaires | 36 %  0 %  0 % |
| `trigfr` | Fonctions sinus et cosinus | 35 %  31 %  0 % |
| `ratden` | Rendre rationnel un dénominateur | 34 %  0 %  30 % |
| `trigeq2` (nouveau) | Équations et modèles trigonométriques | 34 %  0 %  27 % |
| `logdef` | Logarithmes : définition et calcul | 0 %  0 %  34 % |
| `airelat` | Aire latérale et totale : prisme, cylindre | 0 %  0 %  32 % |
| `trigexact` | Valeurs exactes, pente et angle | 0 %  32 %  28 % |
| `etudelnexp` | Étude de fonctions avec ln et exp | 0 %  0 %  32 % |
| `droites` | Équations de droites | 0 %  24 %  31 % |
| `sysineq` | Systèmes d'inéquations du 1er degré | 0 %  31 %  0 % |
| `matrices` | Matrices 2 × 2 : calcul, déterminant, inverse | 0 %  0 %  30 % |
| `polymp` | Polynômes : zéros, division, signe | 0 %  0 %  29 % |
| `trigassoc` (nouveau) | Angles associés, relations fondamentales | 24 %  27 %  0 % |
| `sysgraph` | Systèmes : nombre de solutions | 26 %  0 %  0 % |
| `autodnb` | Automatismes du brevet (partie 1) | 0 %  0 %  25 % |

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
  `intsubst`, `eqdiff`, `suitedef`, `suitesomme`, `suitelim`, `serie`, `binom`,
  `binomiale`, `normale`, `approxnorm`, `densite`, `varalea`, `vaesp`, `matrices`, `translin`, `appllin`, `bases`.
- **Couverture partielle restante** (après l'extension du soir) : `absval` niveau 1 (formes rares), `affzero` niveau 3
  (comparaison de forfaits), `polydiv` 3, `combi` 3, `milieux` 3, `suitearith` / `suitegeo` (problèmes à contexte),
  `suitesomme`, `tangente` (lecture de la tangente sur la figure), `interpar`, `geocomb`, `morceaux`, `litelab`,
  `tradexpr` (réponse = expression). transf, trigcercle, trigfn, recip, homog, inter et les lectures de f2 / f2expr sont
  maintenant couverts.
- **Exercices riches** : leurs parties n'ont pas de réponse attendue automatique (barème en points) ; **défis**
  (niveau 4) : seule la canette est reconnue (14 tirages) — les défis sont des problèmes à étapes, un gabarit par
  défi.

Liste brute des notions sous 20 % (après extension) : `fratmp`, `optim`, `combi`, `tauxevol`, `automat`, `inter`, `recip`, `trigcercle`, `polydiv`, `homog`, `trigfn`, `tradexpr`, `solides`, `litelab`, `angtype`, `quadri`, `repere`, `rotation`, `ensembles`, `valint`, `eqparam`, `modexp`, `compo`, `lectgraph`, `interpar`, `modaff`, `geocomb`, `probrat`, `bijection`, `decomp`, `polyexpr`, `homogrec`, `logbase`, `triaire`, `droitesinter`, `cercletan`, `symetries`, `morceaux`, `transf`, `vecteurs`, `recipaff`, `logprop`, `croissexp`, `similmp`, `vectmp`, `scalmp`, `projmp`, `pvectmp`, `droiteparam`, `posdroites`, `fctmp`, `sinusmp`, `explogfn`, `suitedef`, `suitesomme`, `pscal`, `probtot`, `vaesp`, `suitelim`, `binom`, `proba2`, `vect3e`, `probcond`, `algopy`, `tauxvar`, `nbderive`, `tangente`, `variations`, `optimderiv`, `limites`, `limitinf`, `asymptotes`, `continuite`, `derivseconde`, `etudefct`, `probaxiomes`, `probarbre`, `derivth`, `vect3d`, `colin`, `droite3d`, `plans`, `posrel`, `pscal3d`, `distances`, `sphere`, `pvect`, `primitives`, `integrale`, `aireint`, `volrev`, `croissance`, `intparties`, `intsubst`, `eqdiff`, `translin`, `appllin`, `condbayes`, `varalea`, `binomiale`, `normale`, `statdesc`, `bayes`, `bases`, `cplxalg`, `cplxtrig`, `cplxeq`, `suitegeom`, `geoesp`, `densite`, `approxnorm`, `tradalg`, `contrex`, `demoalg`, `implication`, `graphefct`, `ineqgraph`, `repere3d`, `progcalc`, `ratio`, `milieux`, `structexpr`, `motifs`, `trigrad`, `droitenorm`, `linfn`, `cos4e`, `thales4e`, `vecgeo`, `tabvar`, `tvi`, `sommeva`, `recurrence`, `symax`, `mediatrice`, `echelle6`, `proba6`, `empil`, `compdiff`, `posrelc`, `intmaj`, `suiteint`, `cercle6`, `bissec6`, `filtre6`, `tabform5`, `hauteurs5`.
