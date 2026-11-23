# Couverture des programmes français par 5min2maths

Préparé le 23.11.2026 pour l'ouverture de l'app à la France. Données : `tools/referentiels_fr.json`, produit par
`tools/referentiels_fr.py` à partir des PDF officiels rangés hors dépôt (`~/DATA/Enseignement/Sources/Officiel/France`, README avec
URL et dates). Tableaux détaillés en fin de fichier : `python tools/referentiels_fr.py --md` (relancer après tout ajout de notion
ou toute modification de `MAP_FR`).

**À lire avec prudence.** « Couvert » veut dire qu'une notion de l'app permet de s'entraîner à l'attendu, pas que les questions
générées suivent exactement le niveau ou le vocabulaire français. La correspondance est faite par motifs sur le texte des
attendus (`MAP_FR`), à relire. CM1 et CM2 sont extraits dans le JSON mais pas analysés ici (un autre chantier s'en charge).

## 1. Quel texte s'applique en 2026-2027 ?

| Classe | Âge | Équivalent suisse | Texte en vigueur en 2026-2027 | Nouveau texte |
|---|---|---|---|---|
| 6e | 11-12 ans | 8P | programme cycle 3, BO 16 du 17.04.2025 | — |
| 5e | 12-13 ans | 9e CO | **programme cycle 4, BO 10 du 05.03.2026** | — |
| 4e | 13-14 ans | 10e CO | programme 2020 + attendus de fin d'année 2019 (clé `4e-2019`) | programme 2026 en 2027-2028 |
| 3e | 14-15 ans | 11e CO | programme 2020 + attendus 2019 (clé `3e-2019`), DNB | programme 2026 en 2028-2029 |
| 2nde | 15-16 ans | 1re sec. II | **programme 2026** (BO 14 du 02.04.2026) | — |
| 1re | 16-17 ans | 2e sec. II | **programme 2026** : spécialité, ou maths intégrées à l'enseignement scientifique ; épreuve anticipée de maths | — |
| Tle | 17-18 ans | 3e sec. II | programme 2019 (spécialité, complémentaires, expertes) | programme 2026 en 2027-2028 (sauf expertes) |

Conséquence : en 4e et 3e, il faut suivre **les deux** textes pendant deux ans (élèves actuels : 2019 ; élèves suivants : 2026).
Différences notables entre les deux : le cosinus et la notation scientifique sont en 4e dans les attendus 2019, en 3e dans le
programme 2026 ; Thalès (triangles emboîtés) est en 4e en 2019, en 3e en 2026 ; la multiplication des relatifs passe de 5e à 4e ;
les vecteurs (égalité, somme, Chasles) arrivent en 3e en 2026 ; la notion de fonction n'est pas étudiée en général avant la 3e.
En 2nde, le programme 2026 a **supprimé les systèmes de deux équations** (présents en 2019) : aucun programme français de
collège ni de 2nde ne les demande ; ils réapparaissent seulement en terminale (géométrie dans l'espace).

## 2. Bilan chiffré (attendus qui se prêtent à une réponse saisie)

| Classe | Attendus | Saisissables | Rattachés à une notion | Taux |
|---|---|---|---|---|
| 6e | 94 | 77 | 66 | 86 % |
| 5e (2026) | 151 | 119 | 107 | 90 % |
| 4e (2026) | 108 | 90 | 82 | 91 % |
| 3e (2026) | 85 | 68 | 61 | 90 % |
| 4e (2019) | 64 | 50 | 47 | 94 % |
| 3e (2019) | 53 | 40 | 38 | 95 % |
| 2nde | 79 | 66 | 57 | 86 % |
| 1re spécialité | 60 | 51 | 29 | 57 % |
| 1re maths intégrées | 36 | 32 | 23 | 72 % |
| Tle spécialité (2026) | 54 | 47 | 10 | 21 % |
| Tle complémentaires | 28 | 26 | 3 | 12 % |
| Tle expertes | 22 | 21 | 4 | 19 % |

Le collège est très largement couvert **en contenu** (l'app suit le CO genevois, qui couvre 9e-11e = 5e-3e) ; les vrais trous sont
des formes typiquement françaises (programmes de calcul, ratios, droite des milieux, inéquations simples) et, au lycée, les
suites, la dérivation, les probabilités conditionnelles et tout le programme de terminale (limites, intégrales, lois).

## 3. Notions à créer, par priorité

Collège 4e et 3e d'abord (DNB, et deux générations de programmes à la fois), puis 5e, 6e, 2nde.

| # | Id proposé | Notion | Classes | Pourquoi |
|---|---|---|---|---|
| 1 | `progcalc` | Programmes de calcul : appliquer à un nombre puis à x, remonter au nombre de départ, prouver que deux programmes donnent le même résultat | 4e (2026 PF, 2019 NC), 3e | exercice-type du DNB ; aucune notion ne le propose |
| 2 | `ratio` | Ratios et partage proportionnel (partager 120 € selon 2:3, en trois parts…) | 4e, 3e (automatismes), 2nde | absent ; nouveau dans le programme 2026 |
| 3 | `ineq1` | Inéquations du 1er degré a x + b ≥ c, solution en intervalle | 3e, 2nde | `ineq` est au niveau 2nde (tableau de signes) : il manque la marche collège |
| 4 | `milieux` | Droite des milieux (3 théorèmes) : parallélisme, longueur moitié, milieu | 4e, 3e (automatisme) | absente ; classique au DNB |
| 5 | `proba2` | Probabilités : évènement contraire, deux épreuves (arbre, tableau), réunion et intersection, P(A∪B) + P(A∩B) = P(A) + P(B) | 4e, 3e, 2nde | `proba` = une épreuve, vocabulaire suisse |
| 6 | `structexpr` | Somme ou produit ? termes et facteurs, nature d'une expression, l'opposé d'une expression | 5e, 4e, 3e, 4e-2019 | demandé à chaque niveau, sert la factorisation |
| 7 | `vect3e` | Translations et vecteurs : vecteurs égaux, somme, relation de Chasles, puis coordonnées (2nde) | 3e, 2nde | `vecteurs` est au niveau 2e Collège (norme, produit scalaire) |
| 8 | `motifs` | Suites de motifs évolutifs : poursuivre, trouver l'étape n, écrire la formule | 6e, 5e | automatisme et objectif du programme ; bon terrain « apprentissage actif » |
| 9 | `automat` | Automatismes de calcul mental : tables, multiplications à trou (3 × … = 7), nombre quotient, fractions simples ↔ décimaux, a % de c | 6e, 5e, 4e, 2nde | les programmes 2025-2026 en font une rubrique à part ; format « flash » idéal pour l'app |
| 10 | `probcond` | Fréquences et probabilités conditionnelles : tableau croisé, arbre pondéré, P_A(B) | 2nde, 1re | absent ; présent aussi dans l'épreuve anticipée de 1re |

Ensuite : suites arithmétiques et géométriques (1re, 1re maths intégrées), nombre dérivé et tangente (1re), variable aléatoire et
espérance (1re), comparaison par différence ou quotient (2nde), information chiffrée (taux successifs, taux réciproque : à ajouter à
`pctvar`), fonctions de référence et comparaison de f(a) et f(b) (2nde, à ajouter à `racinv`).

**Notions existantes à adapter plutôt qu'à créer** : `fimg` (version collège avec « antécédent », tableau de valeurs et graphique,
niveau 3e), `trigo` (cosinus seul en 4e-2019), `thales` (triangles emboîtés seuls en 4e-2019, papillon en 3e), `affine` (fonction
linéaire séparée en 3e), `eq2fact` (x² = a en 3e), `idrem` (3e : a² − b² surtout), `sci` (4e en 2019, 3e en 2026).

**Notions à masquer en France** (aucun attendu) : `sys2`, `sys3`, `sysprob`, `sysgraph` (systèmes), `euclide`, `polydiv`,
`homog`, `eqrat`, `eqirr`, `bicarre`, `pente` (pente en %, usage routier suisse), `change` (taux de change en CHF), `polyreg`,
`ratden`, `fracper`… La liste complète est sous le dernier tableau.

**Champ `FR` de `src/curriculum.js`** : renseigné pour 38 notions seulement, et plusieurs valeurs ne correspondent plus aux
programmes (ex. `prio` 6e → 5e, `distrib` 4e → 5e, `factor` 3e → 5e, `fimg` 2nde → 3e, `rel` 5e → 4e, `eq3` 2nde → Tle expertes,
`trigeq` 1re → Tle). Le tableau final propose une classe pour chaque notion rattachée ; les notions de `gen3.js` ont toutes `FR: null`.
Ne pas reporter automatiquement : la « première classe » est celle du premier attendu rattaché, parfois une simple initiation.

## 4. Écarts de vocabulaire (Suisse romande → France)

| App (Genève) | France | Remarque |
|---|---|---|
| préimage | **antécédent** | `fimg` s'appelle « Images et préimages » |
| PGDC, PPMC | PGCD (Tle expertes seulement), PPCM peu utilisé | au collège : « diviseurs communs », « dénominateur commun » |
| mettre en évidence | factoriser | « mise en évidence » est aussi belge |
| simplifier au maximum | **rendre irréductible**, forme irréductible | 3e (2026), 2nde |
| fonction du premier degré | fonction affine (et linéaire, à part) | « coefficient directeur » au lycée, « pente » aussi en 2nde 2026 |
| parabole, zéros | fonction carré (3e), polynôme du second degré, **racines** (1re) | « zéros » rare |
| identités remarquables | identités remarquables | Belgique : produits remarquables |
| cercle de Thalès | « triangle inscrit dans un demi-cercle », cercle circonscrit d'un triangle rectangle | « Thalès » désigne seulement le théorème des proportions |
| règle de trois | quatrième proportionnelle, produit en croix, coefficient de proportionnalité | « règle de trois » se dit, mais pas dans les programmes |
| statistiques : moyenne, médiane | moyenne (pondérée), médiane, étendue, quartiles, **boîte à moustaches**, effectifs cumulés | |
| demi-tour | symétrie centrale = demi-tour (vocabulaire 2026) | |
| connaître, maîtrise, boîte | **connaitre, maitrise, boite, évènement** | les textes 2025-2026 appliquent les rectifications de 1990 ; garder l'orthographe traditionnelle reste correct |
| CHF, francs, Genève, CO, Collège | €, contextes français, collège, lycée | contextes (`ctx`) à localiser : monnaie, villes, trains, TVA |

## 5. Différences d'usage

- **Séparateur des milliers** : l'app écrit `1'200` (usage suisse) ; en France on écrit **1 200** (espace fine insécable). À rendre
  selon le système de l'élève, au même endroit que le filtre `divSign`.
- **Virgule décimale** : identique. Les intervalles s'écrivent avec crochets retournés : [a, b], ]a, +∞[ ; le texte 2026 met une
  virgule entre les bornes, beaucoup de manuels un point-virgule (préférable quand les bornes sont décimales : [2,5 ; 3]).
- **Signes** : la France écrit le produit avec × (et 3x, 3(x + 2)) ; le point médian · des MER romands est inhabituel. La division
  « ÷ » est comprise ; au collège on écrit surtout la barre de fraction.
- **Ensemble des solutions** : à partir de la 2nde, « S = {4} » ou « l'ensemble des solutions est … » ; inéquations : solution en
  intervalle.
- **Calculatrice** : autorisée en classe et au DNB (mode examen) ; les programmes 2025-2026 et l'épreuve anticipée de 1re mettent
  l'accent sur des **automatismes sans calculatrice** (partie de l'épreuve consacrée aux automatismes). Le réglage « sans
  calculatrice » de l'app colle bien à cette partie.
- **Niveaux** : la France numérote les classes à rebours (6e → 3e, puis 2nde, 1re, Tle) ; l'app code déjà FR 6e = 6 … 3e = 9,
  2nde = 10 (`harmos = grade + 2`, cohérent : 6e = 8P, 5e = 9e HarmoS). Ajouter la Tle (12) au menu FR.
- **Unités** : identiques (SI) ; durées « 2 h 30 min ».
- **Algorithmique** : Scratch au collège, Python au lycée ; rien à saisir, hors périmètre de l'app.

## 6. Tableaux détaillés (générés)

### 6e — 6e

94 attendus (dont 0 automatismes) ; 77 se prêtent à une réponse saisie ; **66 rattachés à une notion (86 %)**.

Couverts : `decread` (NC.01, NC.03, NC.04) ; `pct` (NC.05, NC.06, NC.40, NC.41) ; `fracconv` (NC.06, NC.25, NC.30) ; `deccomp` (NC.07, NC.08, NC.09, NC.10) ; `decarr` (NC.11, NC.12, NC.13) ; `decadd` (NC.14) ; `dec10` (NC.15, NC.16) ; `decmul` (NC.18, NC.20) ; `ordgr` (NC.19) ; `decprob` (NC.20, NC.22) ; `decdiv` (NC.21, NC.22) ; `multdiv` (NC.23, NC.24) ; `fractout` (NC.27, NC.31, NC.36, NC.37) ; `fracrep` (NC.28, NC.33, NC.34) ; `fracsimp` (NC.32) ; `fracadd` (NC.35) ; `disque` (GM.01, GM.02, GM.03, EG.03) ; `perim` (GM.04, GM.05) ; `uaire` (GM.06) ; `aire1` (GM.07, GM.08) ; `volpave` (GM.09, GM.10, GM.11) ; `utemps` (GM.12, GM.13, GM.14) ; `droitesrem` (EG.06, EG.07, EG.17) ; `angtype` (EG.09) ; `angtri` (EG.14, EG.15, EG.16) ; `symetries` (EG.19, EG.20) ; `proba` (DP.05, DP.06, DP.07) ; `prop` (PF.01, PF.02, PF.03) ; `echelle` (PF.05)

Non couverts (saisissables) :

- `6e.NC.26` Comprendre et connaître la définition du quotient d’un entier a par un entier b non nul
- `6e.NC.42` Utiliser des modèles pré-algébriques pour résoudre des problèmes algébriques
- `6e.NC.43` Identifier la structure d’un motif évolutif en repérant une régularité et en identifiant une structure
- `6e.EG.01` Connaître et utiliser la définition de la distance entre deux points
- `6e.EG.02` Connaître et utiliser la définition du milieu d’un segment
- `6e.EG.04` Comprendre la définition d’un cercle et celle d’un disque sous la forme d’ensembles de points
- `6e.EG.05` Résoudre des problèmes mettant en jeu des distances à un point
- `6e.EG.08` Résoudre des problèmes en s’appuyant sur la propriété caractéristique de la médiatrice
- `6e.EG.11` Connaître la définition de la bissectrice d’un angle saillant
- `6e.EG.12` Utiliser la définition de la bissectrice d’un angle pour effectuer des constructions et résoudre des problèmes
- `6e.DP.04` Faire un choix en filtrant les données d’un tableau selon un critère


### 5e — 5e

151 attendus (dont 47 automatismes) ; 119 se prêtent à une réponse saisie ; **107 rattachés à une notion (90 %)**.

Couverts : `divcrit` (NC.01, NC.16) ; `multdiv` (NC.02, NC.15) ; `factor` (NC.03, NC.63) ; `decmul` (NC.04) ; `dec10` (NC.05) ; `decadd` (NC.06, NC.18) ; `decprob` (NC.07) ; `decdiv` (NC.09) ; `prio` (NC.10, NC.13) ; `tradexpr` (NC.11, NC.12) ; `distrib` (NC.14, NC.63) ; `eq1` (NC.19, NC.35, NC.69, NC.70) ; `relrep` (NC.20, NC.21, NC.22, NC.23, NC.24, NC.25) ; `vabs` (NC.21) ; `repere` (NC.24, NC.36, EG.01, EG.02, EG.03, EG.04, PF.13) ; `reladd` (NC.26, NC.27, NC.28, NC.30, NC.31, NC.32) ; `parenth` (NC.30) ; `fracconv` (NC.34, NC.39, NC.43) ; `fracsimp` (NC.37) ; `fracrep` (NC.38, NC.44) ; `fracadd` (NC.40, NC.45, NC.46) ; `fractout` (NC.41) ; `pct` (NC.42, DP.02, DP.08, PF.03, PF.04) ; `prop` (NC.42, PF.01, PF.02, PF.03, PF.04, PF.05, PF.06, PF.08, PF.09, PF.17) ; `uaire` (NC.48, EG.44) ; `uvol` (NC.48, EG.12) ; `pow9` (NC.49, NC.50, NC.51, NC.52, NC.53) ; `valnum` (NC.53, NC.54, NC.60) ; `litelab` (NC.59, PF.16) ; `perim` (NC.59) ; `eqverif` (NC.61) ; `reduire` (NC.64) ; `probeq` (NC.68, NC.69) ; `volpave` (EG.11) ; `vol` (EG.11, EG.13) ; `disque` (EG.13) ; `symetries` (EG.16, EG.17) ; `angtype` (EG.18, EG.19, EG.21) ; `angles` (EG.22) ; `angtri` (EG.23, EG.24, EG.34) ; `droitesrem` (EG.25, EG.28, EG.31) ; `aire1` (EG.29) ; `quadri` (EG.36, EG.37, EG.39, EG.41, EG.42) ; `aire2` (EG.43) ; `aire3` (EG.43) ; `ulong` (EG.44) ; `statfreq` (DP.02) ; `diagr` (DP.03, DP.06) ; `proba` (DP.07, DP.08, DP.09, DP.11, DP.12) ; `vitesse` (PF.06) ; `proptab` (PF.08) ; `tabval` (PF.11, PF.12, PF.13, PF.15) ; `lectgraph` (PF.14)

Non couverts (saisissables) :

- `5e.NC.33` Entretenir la connaissance et l’utilisation des tables de multiplication
- `5e.NC.47` Entretenir les tables de multiplications
- `5e.NC.55` Identifier des régularités et poursuivre une suite de motifs évolutive
- `5e.NC.56` Trouver le nombre d’éléments pour une étape donnée dans une suite de motifs évolutive
- `5e.NC.57` Identifier la structure d’un motif évolutif en repérant une régularité
- `5e.NC.58` Nombre quotient
- `5e.NC.62` Déterminer si une expression littérale est une somme ou un produit
- `5e.EG.05` Reconnaitre des vues (de dessus, dessous…) d’empilements de cubes
- `5e.EG.06` Dénombrer des cubes dans des empilements
- `5e.EG.20` Reconnaitre une bissectrice
- `5e.PI.02` Identifier les entrées et sorties d’un programme
- `5e.PI.05` Prévoir la valeur d’une expression informatique avant son exécution


### 4e — 4e

108 attendus (dont 39 automatismes) ; 90 se prêtent à une réponse saisie ; **82 rattachés à une notion (91 %)**.

Couverts : `reladd` (NC.01) ; `relrep` (NC.02, NC.17, EG.02, EG.03) ; `dec10` (NC.04, NC.26) ; `eq1` (NC.05, NC.37, NC.45, PF.12) ; `rel` (NC.07, NC.08, NC.09) ; `tradexpr` (NC.10) ; `fracadd` (NC.11) ; `fracrep` (NC.12) ; `fracconv` (NC.13) ; `fractout` (NC.14, NC.19) ; `fracsimp` (NC.15) ; `fracmul` (NC.18, NC.20, NC.21, NC.22) ; `fracops` (NC.23, NC.24) ; `pow9` (NC.25, NC.27, NC.28, NC.33) ; `puiss` (NC.29, NC.30, NC.31, NC.32) ; `carres` (NC.34) ; `racenc` (NC.35) ; `valnum` (NC.36, PF.11) ; `monomes` (NC.38, NC.39) ; `reduire` (NC.39) ; `litelab` (NC.40, NC.42, PF.13) ; `eqverif` (NC.41) ; `distrib` (NC.43) ; `factor` (NC.43) ; `probeq` (NC.46) ; `eqfrac` (NC.46) ; `repere` (EG.04) ; `solides` (EG.05, EG.09) ; `vol` (EG.06) ; `aire1` (EG.08) ; `volcone` (EG.11) ; `symetries` (EG.12, EG.13, EG.16, EG.18) ; `quadri` (EG.14, EG.15) ; `droitesrem` (EG.19) ; `quartiles` (EG.19, DP.05, DP.06, DP.07, DP.08, DP.09) ; `pyth` (EG.21) ; `pythrec` (EG.21) ; `cercthales` (EG.24) ; `diagr` (DP.01, DP.04) ; `statfreq` (DP.02, DP.03) ; `proba` (DP.12, DP.13, DP.14) ; `pct` (PF.01, PF.02, PF.07) ; `gquot` (PF.03) ; `prop` (PF.05, PF.06) ; `pctvar` (PF.08, PF.09)

Non couverts (saisissables) :

- `4e.NC.03` Entretien des tables de multiplication
- `4e.NC.06` Multiplication comme addition itérée : 3 + 3 + 3 + 3 = 4 × 3
- `4e.NC.16` Définir la notion de nombre rationnel : le quotient de deux nombres entiers relatifs
- `4e.NC.44` Utiliser le calcul algébrique pour produire des démonstrations
- `4e.EG.17` Faire le lien avec les parallélogrammes, les angles
- `4e.EG.20` Connaitre les trois théorèmes relatifs à la droite des milieux dans un triangle
- `4e.PF.04` Comparer deux nombres ou deux grandeurs à l’aide de leur rapport ou ratio
- `4e.PF.10` Résoudre des problèmes de partage proportionnel


### 3e — 3e

85 attendus (dont 36 automatismes) ; 68 se prêtent à une réponse saisie ; **61 rattachés à une notion (90 %)**.

Couverts : `fracops` (NC.01, NC.04) ; `fracsimp` (NC.02, NC.03, NC.16) ; `pow9` (NC.05, NC.12) ; `puiss` (NC.06, NC.07, NC.08, NC.09, NC.21) ; `sci` (NC.10, NC.11) ; `scicalc` (NC.11) ; `rac` (NC.13, NC.14) ; `eq2fact` (NC.13) ; `premiers` (NC.15) ; `fracadd` (NC.17) ; `divcrit` (NC.18) ; `eq1` (NC.19) ; `reduire` (NC.20) ; `valnum` (NC.21) ; `distrib` (NC.23, NC.27) ; `litelab` (NC.24) ; `parenth` (NC.25) ; `fracrat` (NC.26) ; `factor` (NC.27, NC.30) ; `ineq` (NC.28) ; `eq2` (NC.29) ; `idrem` (NC.30) ; `relrep` (EG.01, EG.02) ; `repere` (EG.03) ; `solides` (EG.04) ; `volcone` (EG.05, EG.11) ; `cercthales` (EG.12) ; `pyth` (EG.13) ; `thales` (EG.15, PF.08) ; `thalesrec` (EG.15) ; `trigo` (EG.16) ; `vecteurs` (EG.18, EG.19, EG.20, EG.21) ; `diagr` (DP.01) ; `quartiles` (DP.02, DP.03, DP.05) ; `statfreq` (DP.04) ; `pct` (PF.04) ; `echelle` (PF.05) ; `pctvar` (PF.06, PF.07) ; `affine` (PF.09, PF.12, PF.14, PF.15, PF.16) ; `fimg` (PF.10, PF.11) ; `lectgraph` (PF.13)

Non couverts (saisissables) :

- `3e.NC.22` Donner la nature d’une expression littérale : 3𝑥 + 2 est une somme, 5 (𝑥 + 4) est un produit
- `3e.EG.14` Utiliser la droite des milieux pour prouver que des droites sont parallèles, pour calculer une longueur, pour prouver qu’un point est le milieu d’un côté
- `3e.DP.09` Connaitre et savoir appliquer la relation 𝑃(𝐴 ∪ 𝐵) + 𝑃(𝐴 ∩ 𝐵) = 𝑃(𝐴) + 𝑃(𝐵)
- `3e.PF.01` Partager une somme en deux parts selon un certain ratio
- `3e.PF.02` Partager une masse en trois parts selon un certain ratio
- `3e.PF.03` Partager une somme entre deux personnes âgées de 20 et 30 ans proportionnellement à leur âge
- `3e.PI.02` Utiliser des conditions composées


### 4e-2019 — 4e (attendus 2019, en vigueur en 2026-2027)

64 attendus (dont 0 automatismes) ; 50 se prêtent à une réponse saisie ; **47 rattachés à une notion (94 %)**.

Couverts : `puiss` (NC.01, NC.06, NC.07) ; `fracconv` (NC.02) ; `sci` (NC.02, NC.03) ; `pow9` (NC.04) ; `carres` (NC.04, NC.05) ; `relrep` (NC.08) ; `racenc` (NC.09, NC.15) ; `ordgr` (NC.10, NC.17) ; `rel` (NC.11) ; `fracops` (NC.12, NC.14) ; `fracmul` (NC.13) ; `agrand` (NC.16, EG.01) ; `pyth` (NC.16, EG.07) ; `pythfig` (NC.16) ; `premiers` (NC.18, NC.19, NC.20) ; `fracsimp` (NC.20) ; `arith` (NC.21) ; `reduire` (NC.23) ; `distrib` (NC.23) ; `probeq` (NC.25) ; `eqverif` (NC.26) ; `eq1` (NC.27) ; `diagr` (DP.01) ; `statfreq` (DP.01) ; `quartiles` (DP.02) ; `proba` (DP.03, DP.04, DP.05, DP.06, DP.07) ; `prop` (PF.01, PF.02, PF.03, PF.04) ; `litelab` (PF.05) ; `lectgraph` (PF.06, PF.07) ; `volcone` (GM.01) ; `ucomp` (GM.02) ; `symetries` (EG.03, EG.07, EG.08, EG.10) ; `repere` (EG.04) ; `trigo` (EG.07)

Non couverts (saisissables) :

- `4e-2019.NC.22` Il identifie la structure d’une expression littérale (somme, produit)
- `4e-2019.EG.05` Il se repère dans un pavé droit
- `4e-2019.PI.07` Il décompose un problème en sous-problèmes et traduit un sous-problème en créant un « bloc-personnalisé »


### 3e-2019 — 3e (attendus 2019, en vigueur jusqu'en 2027-2028)

53 attendus (dont 0 automatismes) ; 40 se prêtent à une réponse saisie ; **38 rattachés à une notion (95 %)**.

Couverts : `puiss` (NC.01) ; `fracops` (NC.02) ; `rac` (NC.03) ; `scicalc` (NC.04) ; `fracsimp` (NC.06) ; `arith` (NC.07) ; `parenth` (NC.08) ; `reduire` (NC.09) ; `distrib` (NC.09) ; `factor` (NC.09, NC.10) ; `idrem` (NC.10) ; `eq1` (NC.11) ; `eq2` (NC.11) ; `eq2fact` (NC.11) ; `probeq` (NC.12) ; `diagr` (DP.01) ; `quartiles` (DP.02) ; `statfreq` (DP.03) ; `proba` (DP.04, DP.05) ; `affine` (PF.01, PF.09, PF.10, PF.12) ; `pctvar` (PF.02) ; `prop` (PF.03) ; `fimg` (PF.04, PF.05, PF.06, PF.07, PF.08, PF.13) ; `modaff` (PF.11) ; `volcone` (GM.01) ; `volcomp` (GM.02) ; `gquot` (GM.03, GM.04) ; `ucomp` (GM.04, GM.05) ; `rotation` (EG.01, EG.05, EG.07) ; `simil` (EG.01, EG.02, EG.05, EG.07) ; `agrand` (EG.02) ; `thales` (EG.05) ; `thalesrec` (EG.05) ; `trigo` (EG.05)

Non couverts (saisissables) :

- `3e-2019.EG.03` Il se repère sur une sphère (latitude, longitude)
- `3e-2019.PI.07` Il décompose un problème en sous-problèmes et traduit un sous-problème en créant un « bloc-personnalisé »


### 2nde — 2nde générale et technologique

79 attendus (dont 18 automatismes) ; 66 se prêtent à une réponse saisie ; **57 rattachés à une notion (86 %)**.

Couverts : `stats` (AP.07, SP.06) ; `fracops` (AU.02, NC.07) ; `puiss` (AU.03, NC.07) ; `fracconv` (AU.04) ; `ordgr` (AU.05) ; `uvol` (AU.07) ; `parenth` (AU.08) ; `distrib` (AU.09) ; `idrem` (AU.09) ; `factor` (AU.09, NC.09) ; `eq1` (AU.10, NC.12) ; `ineq` (AU.10, NC.11, NC.12, AN.05, AN.06, AN.07) ; `formule` (AU.11, NC.08) ; `valnum` (AU.12) ; `pct` (AU.13, AU.14, SP.01) ; `pctvar` (AU.15, SP.02, SP.03, SP.04) ; `fimg` (AU.16, AU.17, AN.01) ; `affine` (AU.18) ; `multdiv` (NC.01) ; `fracsimp` (NC.02) ; `ensembles` (NC.03, AN.09) ; `decarr` (NC.05, NC.06) ; `rac` (NC.07) ; `eq2fact` (NC.12) ; `vecteurs` (GE.03, GE.05, GE.06, GE.08, GE.09) ; `cart` (GE.04) ; `droites` (GE.08, GE.09, GE.11, GE.12) ; `droitesinter` (GE.13) ; `modaff` (AN.02) ; `racinv` (AN.03, AN.07, AN.14) ; `absval` (AN.03, AN.07, AN.13) ; `inter` (AN.06) ; `lectgraph` (AN.08, AN.09) ; `affzero` (AN.11) ; `optim` (AN.12) ; `statfreq` (SP.01) ; `diagr` (SP.05) ; `proba` (SP.11, SP.12, SP.13)

Non couverts (saisissables) :

- `2nde.AP.03` Écrire une formule permettant un calcul combinant des variables
- `2nde.AP.06` Écrire des fonctions simples ; lire, comprendre, modifier, compléter des fonctions plus complexes. Appeler une fonction
- `2nde.AP.08` Écrire des fonctions renvoyant le résultat numérique d’une expérience aléatoire, d’une répétition d’expériences aléatoires indépendantes
- `2nde.AU.01` Comparer deux nombres directement ou par calcul : • de leur différence ; • s’ils sont strictement positifs, de leur quotient
- `2nde.AU.06` S’assurer de la vraisemblance, de la cohérence d’un résultat
- `2nde.NC.10` Comparer deux quantités en utilisant leur différence, ou leur rapport (ratio) dans le cas de quantités positives. Interpréter, selon le contexte, cette comparai
- `2nde.GE.07` Résoudre des problèmes avec des méthodes diverses (méthodes vectorielles, repérées ou non, méthodes géométriques)
- `2nde.SP.07` Calculer des fréquences conditionnelles et des fréquences marginales
- `2nde.SP.14` Distinguer en situation PA(B) et PB(A), par exemple dans des situations de type « faux positifs


### 1re — 1re générale, spécialité mathématiques

60 attendus (dont 17 automatismes) ; 51 se prêtent à une réponse saisie ; **29 rattachés à une notion (57 %)**.

Couverts : `pctvar` (AU.01, AU.02, AU.03, AU.04) ; `eq2` (AU.05) ; `ineq` (AU.06) ; `affzero` (AU.06) ; `ineq2` (AU.06, AL.07) ; `reduire` (AU.07) ; `distrib` (AU.07) ; `lectgraph` (AU.08, AU.09, AU.14) ; `droites` (AU.11, AU.12, GE.04) ; `stats` (AU.15) ; `expo` (AL.05, AN.11, AN.14) ; `trinfact` (AL.08, AL.09) ; `eq2disc` (AL.10) ; `f2formes` (AL.10) ; `optim` (AL.10, AN.08) ; `f2` (AN.10) ; `modexp` (AN.14) ; `trigcercle` (AN.15, AN.16) ; `trigassoc` (AN.16) ; `vecteurs` (GE.02, GE.03) ; `cercle` (GE.06, GE.07)

Non couverts (saisissables) :

- `1re.AU.13` Lire un graphique, un histogramme, un diagramme en barres ou circulaire, un diagramme en boite ou toute autre représentation (repérer l’origine du repère, les u
- `1re.AU.16` Calculer des probabilités conditionnelles lorsque les évènements sont présentés sous forme de tableau croisé d’effectifs ou d’arbres pondérés
- `1re.AU.17` Distinguer P(A ∩ B), PA (B), PB (A)
- `1re.AL.01` Dans le cadre de l’étude d’une suite, utiliser le registre de la langue naturelle, le registre algébrique, le registre graphique, et passer de l’un à l’autre
- `1re.AL.02` Proposer, modéliser une situation permettant de générer une suite de nombres. Déterminer une relation explicite ou une relation de récurrence pour une suite déf
- `1re.AL.04` Pour une suite arithmétique ou géométrique, calculer le terme général, la somme de termes consécutifs, déterminer le sens de variation
- `1re.AN.01` Calculer un taux de variation, la pente d’une sécante
- `1re.AN.02` Interpréter le nombre dérivé en contexte : pente d’une tangente, vitesse instantanée, cout marginal, etc
- `1re.AN.04` Déterminer l’équation de la tangente en un point à la courbe représentative d’une fonction
- `1re.AN.05` Calculer une valeur approchée de ƒ (a + h)
- `1re.AN.06` Dans des cas simples, calculer une fonction dérivée en utilisant les propriétés des opérations sur les fonctions dérivables
- `1re.AN.07` Étudier les variations d’une fonction. Déterminer les extrémums
- `1re.AN.09` Exploiter les variations d’une fonction pour établir une inégalité. Étudier la position relative de deux courbes représentatives
- `1re.AN.12` Pour a réel, dérivée de la fonction t ↦ e^(at)
- `1re.AN.13` Pour une valeur numérique strictement positive de k, représenter graphiquement les fonctions t ↦ e^(–kt) et t ↦ e^(kt)
- `1re.GE.05` Déterminer les coordonnées du projeté orthogonal d’un point sur une droite
- `1re.GE.08` Utiliser un repère pour étudier une configuration
- `1re.SP.01` Dans des cas simples, calculer une probabilité à l’aide de la formule des probabilités totales
- `1re.SP.04` Pour 𝑛 ⩽ 4, représenter l’arbre associé à la répétition de 𝑛 épreuves de Bernoulli indépendantes et identiques afin de calculer des probabilités
- `1re.SP.07` Déterminer la loi de probabilité d’une variable aléatoire
- `1re.SP.08` Calculer une espérance, une variance, un écart type
- `1re.SP.09` Utiliser la notion d’espérance dans une résolution de problème (mise pour un jeu équitable, etc.)


### 1re-ES — 1re générale, mathématiques intégrées à l'enseignement scientifique

36 attendus (dont 17 automatismes) ; 32 se prêtent à une réponse saisie ; **23 rattachés à une notion (72 %)**.

Couverts : `pctvar` (AU.01, AU.02, AU.03, AU.04, VE.03) ; `eq2` (AU.05) ; `ineq` (AU.06) ; `affzero` (AU.06) ; `ineq2` (AU.06, MQ.03) ; `reduire` (AU.07) ; `distrib` (AU.07) ; `lectgraph` (AU.08, AU.09, AU.14) ; `droites` (AU.11, AU.12) ; `stats` (AU.15) ; `modaff` (VL.01, VL.04) ; `f2` (MQ.01, MQ.02) ; `trinfact` (MQ.03) ; `expo` (VE.01, VE.04, VE.05, VE.06) ; `modexp` (VE.01, VE.05, VE.06)

Non couverts (saisissables) :

- `1re-ES.AU.13` Lire un graphique, un histogramme, un diagramme en barres ou circulaire, un diagramme en boite ou toute autre représentation (repérer l’origine du repère, les u
- `1re-ES.AU.16` Calculer des probabilités conditionnelles lorsque les évènements sont présentés sous forme de tableau croisé d’effectifs ou d’arbres pondérés
- `1re-ES.AU.17` Distinguer P(A ∩ B), PA (B), PB (A)
- `1re-ES.AI.02` Déterminer et utiliser un ajustement affine pour interpoler ou extrapoler des valeurs inconnues
- `1re-ES.AI.03` Savoir calculer les coordonnées d’un point moyen. Plusieurs ajustements sont proposés (au jugé, droite de Mayer, moindres carrés) mais aucune connaissance théor
- `1re-ES.PA.01` Calculer des probabilités conditionnelles à l'aide d'un tableau croisé d'effectifs ou d'un arbre pondéré
- `1re-ES.VL.02` Calculer un terme de rang donné d'une suite arithmétique définie par une relation fonctionnelle ou une relation de récurrence
- `1re-ES.VL.03` Réaliser et exploiter la représentation graphique des termes d'une suite arithmétique ou d'une fonction affine
- `1re-ES.VE.02` Calculer un terme de rang donné d'une suite géométrique définie par une relation fonctionnelle ou une relation de récurrence


### Tle — Terminale générale, spécialité mathématiques (programme 2026)

54 attendus (dont 0 automatismes) ; 47 se prêtent à une réponse saisie ; **10 rattachés à une notion (21 %)**.

Couverts : `denombr` (AG.01, AG.02) ; `compo` (AG.07, AN.06) ; `sys2` (AG.16) ; `log` (AN.13, AN.14) ; `trigfn` (AN.15, AN.16) ; `trigeq` (AN.17)

Non couverts (saisissables) :

- `Tle.AP.01` Générer une liste (en extension, par ajouts successifs ou en compréhension)
- `Tle.AP.02` Manipuler des éléments d’une liste (ajouter, supprimer, etc.) et leurs indices
- `Tle.AP.03` Parcourir une liste
- `Tle.AP.04` Itérer sur les éléments d’une liste
- `Tle.AG.04` Exploiter une figure pour exprimer un vecteur comme combinaison linéaire de vecteurs
- `Tle.AG.05` Décrire la position relative de deux droites, d’une droite et d’un plan, de deux plans
- `Tle.AG.06` Lire sur une figure si deux vecteurs d’un plan, trois vecteurs de l’espace, forment une base
- `Tle.AG.08` Étudier géométriquement des problèmes simples de configurations dans l’espace (alignement, colinéarité, parallélisme, coplanarité)
- `Tle.AG.10` Utiliser la projection orthogonale pour déterminer la distance d’un point à une droite ou à un plan
- `Tle.AG.11` Résoudre des problèmes impliquant des grandeurs et mesures : longueur, angle, aire, volume
- `Tle.AG.12` Étudier des problèmes de configuration dans l’espace : orthogonalité de deux droites, d’une droite et d’un plan ; lieux géométriques simples, par exemple plan m
- `Tle.AG.13` Déterminer une représentation paramétrique d’une droite. Reconnaitre une droite donnée par une représentation paramétrique
- `Tle.AG.14` Déterminer l’équation cartésienne d’un plan dont on connait un vecteur normal et un point. Reconnaitre un plan donné par une équation cartésienne et préciser un
- `Tle.AG.15` Déterminer les coordonnées du projeté orthogonal d’un point sur un plan donné par une équation cartésienne, ou sur une droite donnée par un point et un vecteur 
- `Tle.AN.01` Établir la convergence d’une suite, ou sa divergence vers + ∞ ou – ∞
- `Tle.AN.02` Raisonner par récurrence pour établir une propriété d’une suite
- `Tle.AN.03` Étudier des phénomènes d’évolution modélisables par une suite
- `Tle.AN.04` Déterminer dans des cas simples la limite d’une suite ou d’une fonction en un point, en ± ∞, en utilisant les limites usuelles, les croissances comparées, les o
- `Tle.AN.05` Faire le lien entre l’existence d’une asymptote parallèle à un axe et celle de la limite correspondante
- `Tle.AN.10` Lire sur une représentation graphique de 𝑓 , de 𝑓 ’ ou de 𝑓 ’’ les intervalles où 𝑓 est convexe, concave, et les points d’inflexion. Dans le cadre de la résolut
- `Tle.AN.11` Étudier les solutions d’une équation du type ƒ (𝑥) = k : existence, unicité, encadrement
- `Tle.AN.12` Pour une fonction continue ƒ d’un intervalle dans lui-même, étudier une suite définie par une relation de récurrence 𝑢𝑛 + 1 = ƒ (𝑢𝑛)
- `Tle.AN.18` Dans le cadre de la résolution de problème, notamment géométrique, étudier une fonction simple définie à partir de fonctions trigonométriques, pour déterminer d
- `Tle.AN.19` Calculer une primitive en utilisant les primitives de référence et les fonctions de la forme (v’ ○ u) × u’
- `Tle.AN.20` Pour une équation différentielle 𝑦’ = a𝑦 + b (a ≠ 0) : déterminer une solution particulière constante ; utiliser cette solution pour déterminer toutes les solut
- `Tle.AN.21` Pour une équation différentielle 𝑦’ = a𝑦 + 𝑓 : à partir de la donnée d’une solution particulière, déterminer toutes les solutions
- `Tle.AN.22` Estimer graphiquement ou encadrer une intégrale, une valeur moyenne
- `Tle.AN.23` Calculer une intégrale à l’aide d’une primitive, à l’aide d’une intégration par parties
- `Tle.AN.24` Majorer (minorer) une intégrale à partir d'une majoration (minoration) d'une fonction par une autre fonction
- `Tle.AN.25` Calculer l’aire entre deux courbes
- `Tle.AN.26` Étudier une suite d’intégrales, vérifiant éventuellement une relation de récurrence
- `Tle.AN.27` Interpréter une intégrale, une valeur moyenne dans un contexte issu d’une autre discipline
- `Tle.SP.01` Modéliser une situation par une succession d’épreuves indépendantes, ou une succession de deux ou trois épreuves quelconques. Représenter la situation par un ar
- `Tle.SP.02` Modéliser une situation par un schéma de Bernoulli, par une loi binomiale
- `Tle.SP.03` Utiliser l’expression de la loi binomiale pour résoudre un problème de seuil, de comparaison, d’optimisation relatif à des probabilités de nombre de succès
- `Tle.SP.06` Calculer l’espérance d’une variable aléatoire, notamment en utilisant la propriété de linéarité
- `Tle.SP.07` Calculer la variance d’une variable aléatoire, notamment en l’exprimant comme somme de variables aléatoires indépendantes


### Tle-comp — Terminale, option mathématiques complémentaires (programme 2026)

28 attendus (dont 0 automatismes) ; 26 se prêtent à une réponse saisie ; **3 rattachés à une notion (12 %)**.

Couverts : `log` (AN.06, AN.09, AN.10)

Non couverts (saisissables) :

- `Tle-comp.AN.01` Modéliser un problème par une suite donnée par une formule explicite ou une relation de récurrence
- `Tle-comp.AN.02` Calculer une limite de suite géométrique, de la somme des termes d’une suite géométrique de raison positive et strictement inférieure à 1
- `Tle-comp.AN.04` Pour une récurrence arithmético-géométrique : recherche d’une suite constante solution particulière ; utilisation de cette suite pour déterminer toutes les solu
- `Tle-comp.AN.05` Calculer une fonction dérivée, calculer des limites. Dresser un tableau de variation
- `Tle-comp.AN.07` Exploiter le tableau de variation pour déterminer le nombre de solutions d’une équation du type ƒ(𝑥) = k, pour résoudre une inéquation du type ƒ(𝑥) ⩽ k
- `Tle-comp.AN.08` Déterminer des valeurs approchées, un encadrement d’une solution d’une équation du type ƒ(𝑥) = k
- `Tle-comp.AN.11` Vérifier qu’une fonction donnée est solution d’une équation différentielle
- `Tle-comp.AN.12` Déterminer les primitives d’une fonction, en reconnaissant la dérivée d’une fonction de référence ou une fonction de la forme 2 u u’, eu u’ ou u’ / u
- `Tle-comp.AN.13` Résoudre une équation différentielle y’ = a y. Pour une équation différentielle y’ = a y + b : déterminer une solution particulière constante ; utiliser cette s
- `Tle-comp.AN.14` Reconnaitre sur une représentation graphique une fonction convexe, concave, un point d’inflexion
- `Tle-comp.AN.15` Étudier la convexité, la concavité, d'une fonction deux fois dérivable sur un intervalle
- `Tle-comp.AN.16` Estimer graphiquement ou encadrer une intégrale, une valeur moyenne
- `Tle-comp.AN.17` Calculer une intégrale, une valeur moyenne
- `Tle-comp.AN.18` Calculer l’aire sous une courbe ou entre deux courbes
- `Tle-comp.AN.19` Interpréter une intégrale, une valeur moyenne dans un contexte issu d’une autre discipline
- `Tle-comp.PS.01` Identifier des situations où une variable aléatoire suit une loi de Bernoulli, une loi binomiale ou une loi géométrique
- `Tle-comp.PS.02` Déterminer des coefficients binomiaux à l’aide du triangle de Pascal
- `Tle-comp.PS.04` Dans le cas où X suit une loi binomiale, déterminer un intervalle I pour lequel la probabilité P(X ∈ I ) est inférieure à une valeur donnée α, ou supérieure à 1
- `Tle-comp.PS.05` Dans le cadre de la résolution de problème, utiliser l’espérance des lois précédentes
- `Tle-comp.PS.06` Utiliser en situation la caractérisation d’une loi géométrique par l’absence de mémoire
- `Tle-comp.PS.07` Calculer des probabilités dans des situations faisant intervenir des probabilités conditionnelles, des répétitions d’expériences aléatoires
- `Tle-comp.PS.08` Déterminer si une fonction est une densité de probabilité. Calculer des probabilités
- `Tle-comp.PS.09` Calculer l’espérance d’une variable aléatoire à densité


### Tle-exp — Terminale, option mathématiques expertes (programme 2019)

22 attendus (dont 0 automatismes) ; 21 se prêtent à une réponse saisie ; **4 rattachés à une notion (19 %)**.

Couverts : `eq2disc` (CX.09) ; `eq3` (CX.10) ; `polyfact` (CX.11) ; `arith` (AR.01)

Non couverts (saisissables) :

- `Tle-exp.CX.01` Effectuer des calculs algébriques avec des nombres complexes
- `Tle-exp.CX.02` Résoudre une équation linéaire az = b
- `Tle-exp.CX.03` Résoudre une équation simple faisant intervenir z et son conjugué
- `Tle-exp.CX.04` Déterminer le module et les arguments d'un nombre complexe
- `Tle-exp.CX.06` Passer de la forme algébrique d'un nombre complexe à sa forme trigonométrique ou exponentielle et inversement
- `Tle-exp.CX.07` Effectuer des calculs sur des nombres complexes en choisissant une forme adaptée, en particulier dans le cadre de la résolution de problèmes
- `Tle-exp.CX.08` Utiliser les formules d'Euler et de Moivre pour transformer des expressions trigonométriques, calculer des puissances de nombres complexes
- `Tle-exp.CX.12` Utiliser les nombres complexes pour étudier des configurations du plan : alignement, orthogonalité, longueurs, angles, ensembles de points
- `Tle-exp.CX.13` Utiliser les racines de l'unité dans l'étude de configurations liées aux polygones réguliers
- `Tle-exp.AR.02` Résoudre une congruence ax ≡ b [n]. Déterminer un inverse de a modulo n lorsque a et n sont premiers entre eux
- `Tle-exp.AR.03` Établir et utiliser des tests de divisibilité, étudier la primalité de certains nombres, étudier des problèmes de chiffrement
- `Tle-exp.AR.04` Résoudre des équations diophantiennes simples
- `Tle-exp.GR.01` Modéliser une situation par un graphe
- `Tle-exp.GR.02` Modéliser une situation par une matrice
- `Tle-exp.GR.03` Associer un graphe orienté pondéré à une chaîne de Markov à deux ou trois états
- `Tle-exp.GR.04` Calculer l'inverse, les puissances d'une matrice carrée
- `Tle-exp.GR.05` Utiliser le calcul matriciel pour résoudre un système linéaire, étudier une suite récurrente linéaire, compter des chemins, étudier une chaîne de Markov


### Niveau français de chaque notion (première classe où un attendu la mobilise) et champ FR actuel

| Notion | Libellé | Classe FR d'après les programmes | FR actuel (src) | Écart |
|---|---|---|---|---|
| `aire1` | Aire : carré, rectangle, triangle | 6e | — | à renseigner |
| `angtri` | Angles des triangles et quadrilatères | 6e | null | à renseigner |
| `angtype` | Angles : types et mesures | 6e | — | à renseigner |
| `dec10` | Multiplier et diviser par 10, 100, 1000 | 6e | — | à renseigner |
| `decadd` | Additionner et soustraire des décimaux | 6e | — | à renseigner |
| `decarr` | Encadrer et arrondir | 6e | — | à renseigner |
| `deccomp` | Comparer et ranger des nombres décimaux | 6e | — | à renseigner |
| `decdiv` | Diviser des nombres décimaux | 6e | — | à renseigner |
| `decmul` | Multiplier des nombres décimaux | 6e | — | à renseigner |
| `decprob` | Problèmes avec des nombres décimaux | 6e | — | à renseigner |
| `decread` | Lire et décomposer un nombre décimal | 6e | — | à renseigner |
| `disque` | Cercle et disque | 6e | null | à renseigner |
| `droitesrem` | Droites remarquables du triangle | 6e | null | à renseigner |
| `echelle` | Échelles et pentes | 6e | [9, 6] | à corriger (3e → 6e) |
| `fracadd` | Fractions : simplifier, additionner | 6e | [7, 4] | à corriger (5e → 6e) |
| `fracconv` | Fraction, nombre décimal, pourcentage | 6e | — | à renseigner |
| `fracrep` | Fractions : comparer et encadrer | 6e | — | à renseigner |
| `fracsimp` | Amplifier et simplifier une fraction | 6e | — | à renseigner |
| `fractout` | Fraction d'une quantité | 6e | — | à renseigner |
| `multdiv` | Multiples et diviseurs | 6e | — | à renseigner |
| `ordgr` | Ordre de grandeur | 6e | — | à renseigner |
| `pct` | Pourcentages | 6e | [6, 6] |  |
| `perim` | Périmètre d'un polygone | 6e | — | à renseigner |
| `proba` | Probabilités | 6e | null | à renseigner |
| `prop` | Proportionnalité, règle de trois | 6e | [6, 3] |  |
| `proptab` | Tableau de proportionnalité | 6e | — | à renseigner |
| `symetries` | Symétries et translations dans un repère | 6e | — | à renseigner |
| `uaire` | Unités d'aire | 6e | — | à renseigner |
| `utemps` | Durées et horaires | 6e | — | à renseigner |
| `volpave` | Cube et pavé : volume et aire | 6e | — | à renseigner |
| `aire2` | Aire : parallélogramme, losange | 5e | — | à renseigner |
| `aire3` | Aire par décomposition | 5e | — | à renseigner |
| `angles` | Angles : parallèles, cercle | 5e | null | à renseigner |
| `diagr` | Diagrammes et moyennes | 5e | null | à renseigner |
| `distrib` | Développer | 5e | [8, 5] | à corriger (4e → 5e) |
| `divcrit` | Critères de divisibilité | 5e | — | à renseigner |
| `eq1` | Équations du 1er degré | 5e | [8, 6] | à corriger (4e → 5e) |
| `eqverif` | Vérifier une solution d'équation | 5e | — | à renseigner |
| `factor` | Factoriser | 5e | [9, 4] | à corriger (3e → 5e) |
| `lectgraph` | Lire un graphique : zéros, variations, équations | 5e | — | à renseigner |
| `litelab` | Écrire une expression littérale | 5e | — | à renseigner |
| `parenth` | Supprimer des parenthèses | 5e | — | à renseigner |
| `pow9` | Carrés, cubes et puissances | 5e | — | à renseigner |
| `prio` | Priorités des opérations | 5e | [6, 1] | à corriger (6e → 5e) |
| `probeq` | Mettre un problème en équation | 5e | null | à renseigner |
| `quadri` | Quadrilatères particuliers | 5e | — | à renseigner |
| `reduire` | Réduire une expression | 5e | [7, 6] |  |
| `reladd` | Additionner et soustraire des relatifs | 5e | — | à renseigner |
| `relrep` | Nombres relatifs : repérer et comparer | 5e | — | à renseigner |
| `repere` | Se repérer dans le plan | 5e | — | à renseigner |
| `statfreq` | Effectifs, fréquences, diagramme circulaire | 5e | — | à renseigner |
| `tabval` | Tableau de valeurs d'une fonction | 5e | — | à renseigner |
| `tradexpr` | Traduire un énoncé en calcul | 5e | — | à renseigner |
| `ulong` | Unités de longueur et de masse | 5e | — | à renseigner |
| `uvol` | Unités de volume et de capacité | 5e | — | à renseigner |
| `vabs` | Valeur absolue d'un nombre | 5e | — | à renseigner |
| `valnum` | Expressions littérales | 5e | [7, 5] |  |
| `vitesse` | Vitesse, distance, durée | 5e | [8, 7] | à corriger (4e → 5e) |
| `vol` | Volumes : pavé, prisme, cylindre | 5e | [8, 8] | à corriger (4e → 5e) |
| `agrand` | Agrandir, réduire | 4e | — | à renseigner |
| `arith` | Diviseurs, PGDC et PPMC | 4e | null | à renseigner |
| `carres` | Carrés parfaits, racines exactes | 4e | — | à renseigner |
| `cercthales` | Cercle de Thalès et tangente | 4e | — | à renseigner |
| `eqfrac` | Équations avec parenthèses ou fractions | 4e | — | à renseigner |
| `fracmul` | Fractions : multiplier, diviser | 4e | [8, 2] |  |
| `fracops` | Fractions relatives et priorités | 4e | — | à renseigner |
| `gquot` | Grandeurs quotients (vitesse, masse volumique, débit) | 4e | null | à renseigner |
| `monomes` | Multiplier des monômes | 4e | — | à renseigner |
| `pctvar` | Augmentation et diminution en pourcentage | 4e | — | à renseigner |
| `premiers` | Nombres premiers, décomposition | 4e | — | à renseigner |
| `puiss` | Puissances | 4e | [8, 3] |  |
| `pyth` | Théorème de Pythagore | 4e | [8, 3] |  |
| `pythfig` | Pythagore dans une figure, dans l'espace | 4e | — | à renseigner |
| `pythrec` | Réciproque de Pythagore | 4e | — | à renseigner |
| `quartiles` | Étendue, médiane, quartiles | 4e | — | à renseigner |
| `racenc` | Encadrer et comparer des racines | 4e | — | à renseigner |
| `rel` | Nombres relatifs | 4e | [7, 2] | à corriger (5e → 4e) |
| `sci` | Notation scientifique | 4e | [8, 4] |  |
| `solides` | Solides : faces, arêtes, sommets | 4e | — | à renseigner |
| `trigo` | Trigonométrie du triangle rectangle | 4e | [9, 7] | à corriger (3e → 4e) |
| `ucomp` | Convertir des unités composées | 4e | — | à renseigner |
| `volcone` | Volumes : pyramide, cône, boule | 4e | null | à renseigner |
| `affine` | Fonctions affines | 3e | [9, 7] |  |
| `eq2` | Équations produit nul | 3e | [9, 5] |  |
| `eq2fact` | Équations du 2e degré par factorisation | 3e | — | à renseigner |
| `f2` | Parabole : zéros et sommet | 3e | [10, 6] | à corriger (2nde → 3e) |
| `fimg` | Images et préimages | 3e | [10, 2] | à corriger (2nde → 3e) |
| `fracrat` | Fractions rationnelles | 3e | null | à renseigner |
| `idrem` | Identités remarquables | 3e | [9, 3] |  |
| `ineq` | Inéquations, tableau des signes | 3e | [10, 7] | à corriger (2nde → 3e) |
| `modaff` | Modéliser avec une fonction du premier degré | 3e | — | à renseigner |
| `rac` | Racines carrées et cubiques | 3e | [9, 2] |  |
| `rotation` | Rotations | 3e | — | à renseigner |
| `scicalc` | Calculer en notation scientifique | 3e | — | à renseigner |
| `simil` | Homothéties et similitudes | 3e | null | à renseigner |
| `thales` | Théorème de Thalès | 3e | [9, 2] |  |
| `thalesrec` | Réciproque de Thalès | 3e | — | à renseigner |
| `vecteurs` | Vecteurs : composantes, norme, produit scalaire | 3e | — | à renseigner |
| `volcomp` | Volume d'un solide composé | 3e | — | à renseigner |
| `absval` | Valeur absolue | 2nde | [10, 6] |  |
| `affzero` | Zéro et signe d'une fonction du premier degré | 2nde | — | à renseigner |
| `cart` | Distance et milieu | 2nde | [10, 5] |  |
| `droites` | Équations de droites | 2nde | null | à renseigner |
| `droitesinter` | Intersection de droites, médiatrice, hauteur | 2nde | — | à renseigner |
| `ensembles` | Intervalles et ensembles de nombres | 2nde | — | à renseigner |
| `formule` | Transformer une formule | 2nde | null | à renseigner |
| `inter` | Intersection de deux graphes | 2nde | [10, 7] |  |
| `optim` | Problèmes d'optimisation (2e degré) | 2nde | — | à renseigner |
| `racinv` | Fonctions racine carrée et inverse | 2nde | null | à renseigner |
| `stats` | Statistiques (moyenne, médiane, écart-type) | 2nde | [10, 8] |  |
| `cercle` | Équations de cercles | 1re | null | à renseigner |
| `eq2disc` | Équations du 2e degré (formule) | 1re | [11, 2] |  |
| `expo` | Exponentielles | 1re | [11, 5] |  |
| `f2formes` | Formes d'une fonction du 2e degré | 1re | — | à renseigner |
| `ineq2` | Inéquations du 2e degré | 1re | null | à renseigner |
| `modexp` | Croissance exponentielle | 1re | — | à renseigner |
| `sinlaw` | Triangle quelconque (sinus, cosinus) | 1re | null | à renseigner |
| `trigassoc` | Angles associés, relations fondamentales | 1re | — | à renseigner |
| `trigcercle` | Cercle trigonométrique, radians | 1re | [11, 6] |  |
| `trinfact` | Factoriser un trinôme par ses zéros | 1re | — | à renseigner |
| `compo` | Composer des fonctions | Tle | — | à renseigner |
| `denombr` | Dénombrer | Tle | — | à renseigner |
| `eq3` | Équations de degré 3 par factorisation | Tle | [10, 3] | à corriger (2nde → Tle) |
| `log` | Logarithmes | Tle | [12, 3] |  |
| `polyfact` | Factoriser un polynôme, racine évidente | Tle | null | à renseigner |
| `sys2` | Systèmes de deux équations | Tle | [10, 4] | à corriger (2nde → Tle) |
| `trigeq` | Équations trigonométriques | Tle | [11, 7] | à corriger (1re → Tle) |
| `trigfn` | Fonctions trigonométriques | Tle | null | à renseigner |

Notions sans attendu français (hors programme en France, ou seulement en maths expertes / CM) : `polyreg`, `polyop`, `factor2`, `sys3`, `domaine`, `f2expr`, `euclide`, `polydiv`, `eqrat`, `recip`, `homog`, `fracper`, `change`, `grandmanq`, `airelat`, `voldecomp`, `pente`, `airepyr`, `volmanq`, `probeq2`, `sysprob`, `ratden`, `valint`, `eqparam`, `exactes`, `sysgraph`, `eqspec`, `bicarre`, `f2trois`, `interpar`, `trigexact`, `geocomb`, `fracetage`, `probrat`, `bijection`, `decomp`, `polyexpr`, `homogrec`, `trigeq2`, `logbase`, `triaire`, `cercletan`, `sysineq`, `ineqfrac`, `eqirr`, `morceaux`, `transf`, `trigrel`, `expfrac`

