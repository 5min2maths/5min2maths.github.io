# Calculatrice et calcul tapé : audit par notion (25.11)

Origine : commentaire de l'enseignant sur la question `vol-4-lsr` (11e) : « Pour la base ce serait ok de taper le calcul
dans la calculatrice. Il faut arriver à distinguer les cas où la calculatrice fournie apporte trop d'aide. Ex. trivial :
calcule −7 + 19 : si l'élève peut taper tel quel et que la valeur est acceptée ça va pas. Dans un cas comme calculer
l'aire d'un disque, taper π r² dans la calculatrice ça va bien ! » Précision : traiter le problème globalement (fraction
non simplifiée, `sqrt(968)` au lieu de simplifier, `2^5` au lieu de 32, expression développable laissée telle quelle).

## Le mécanisme

- Le champ de réponse **évalue les expressions** (`src/expr.js`) : `-7+19`, `3/4+1/2`, `2^5`, `sqrt(968)`, `log(250)`,
  `cos(pi/6)`, `5*(3-8)`… L'aperçu affiche « ≈ valeur » sous le champ : c'est la calculatrice de l'app (il n'y a pas
  d'autre bouton calculatrice). Le clavier complet (× ÷ ( ) ^ √ π) permet de taper ces calculs.
- **Avant (14.11)** : au CO (9e–11e), toute réponse numérique était un « résultat » (`spec.final`) ; au Collège, en MP et
  en France, **tout calcul tapé était accepté** (`-7+19` juste en relatifs MP 1re, `2^2*2^3` juste en puissances partout,
  `sqrt(968)`… refusé seulement grâce à la forme a√b quand elle était exigée).
- **Maintenant** : la règle dépend de la **notion**, plus de la classe (`Engine.finalize`, `src/engine.js`, bloc `CALC_*`).
  - **⛔ résultat exigé** (`spec.final`) : sont admis un entier, un décimal, une fraction **irréductible**, a√b, a√b/c,
    a/√b, a ± b√c (dénominateur rendu rationnel), aπ, aπ/b (coefficient et dénominateur premiers entre eux), avec signe,
    « x = » devant, séparateur de milliers ; `a^n` seulement si la consigne demande une puissance (« sous la forme d'une
    puissance », « puissance de 10 » → `spec.pow`, touche ^ ajoutée). Refusés **sans compter faux** : un calcul, une
    fraction non simplifiée, √16 (racine d'un carré parfait), 30π/180, 2^5 pour « Calcule ». Message : « Le résultat,
    pas le calcul » / « Donne le résultat final, pas le calcul : un seul nombre (ou une fraction irréductible). »
    (« C'est la bonne valeur, mais… » quand le calcul tapé vaut la réponse). Clavier : pavé numérique (chiffres, −, /,
    virgule ; √ ou π seulement si la réponse exacte en a besoin), aperçu sans « ≈ ». Les étapes « pas à pas » suivent la
    même règle (un calcul y est redemandé, pas compté faux).
  - **✅ autorisé** : le calcul tapé est accepté (aire du disque `pi*3^2`, volume, Pythagore `sqrt(18^2+24^2)`, règle de
    trois `6.3/3*7`, moyenne `(8+3+18)/3`…). Les formes exigées par la consigne restent contrôlées (a√b simplifié,
    notation scientifique, arrondi).
- **Ordre de décision** (pour chaque réponse : question, partie d'un défi, étape) :
  1. déclaration dans la question : `q.calcul`, `part.calcul` ou `étape.calcul` = `"oui"` | `"non"` ;
  2. consigne « sans calculatrice », « mentalement », « de tête », « calcul mental » → ⛔ ;
  3. consigne « à la calculatrice », « avec ta calculatrice », « valeur exacte avec ln » → ✅ ; arrondi demandé
     (`spec.round` : au dixième, au centime…) → ✅ ;
  4. exception de la notion : `CALC_NON` (⛔) ou `CALC_OUI` (✅) ;
  5. règle du thème : `CALC_THEME` — Nombres et opérations ⛔ ; Grandeurs et mesures, Espace, Fonctions et algèbre ✅.
  `sci` et `scicalc` gardent leur propre contrôle (notation scientifique).
- **Expressions littérales** (réponse `expr`) : quand le générateur n'a pas fixé de forme, la consigne la fixe :
  « Développe / développée / Réduis / réduite / Simplifie / Supprime les parenthèses / Calcule : » → forme réduite (si la
  réponse attendue est un polynôme), « Factorise » → produit. Ainsi `3(x-2)+4x` recopié n'est plus accepté pour
  « Développe et réduis », ni `(125x^9)^(1/3)` pour « Simplifie », ni `(2x+2)^2-2` pour « expression développée de g∘f ».
- **Test** : `tests/calculatrice.html` (échantillon à 3 niveaux : 11e, 1re Collège, MP 1re ; claviers ; puis audit de
  toutes les notions, niveaux 1 à 4 : quand le résultat est exigé, la réponse attendue doit pouvoir s'écrire dans une
  forme admise ; une forme déduite de la consigne doit accepter la réponse attendue). `#n=12&table` : plus de tirages et
  le tableau ci-dessous (colonnes « T »). Audit du 25.11 : 277 notions, aucune réponse bloquée.

## Cas limites à trancher par l'enseignant

| Notion | Choix actuel | Question |
|---|---|---|
| `perim`, `aire1`, `aire2`, `angtri`, `quadri`, `polyreg` (9e) | ✅ (Grandeurs / Espace) | En 9e, le calcul (10·7, 180 − 2·37) est-il aussi évalué ? Sinon ⛔ via `CALC_NON`. |
| `volpave`, `aire3`, `voldecomp`, `grandmanq` (9e–10e) | ✅ | Idem : décimaux simples, calcul mental attendu ? |
| `pct`, `pctvar` (10e) | ✅ (proportionnalité) | « Calcule 25 % de 160 » : `0.25*160` accepté. Garder ou ⛔ au niveau 1 ? |
| `probeq`, `eq1`, `eqfrac` | ⛔ | Problème mis en équation avec des décimaux (182/0,7) : ✅ ? |
| `proba` (11e) | ⛔ (thème Nombres) | Fraction irréductible exigée ; au Collège les probabilités sont ✅. Harmoniser ? |
| `decprob`, `ordgr`, `tradexpr` (9e) | ⛔ | `tradexpr` « Calcule le quotient de la somme de 12 et 42 par 9 » : `(12+42)/9` montre la traduction ; accepter ? |
| `ulong`, `uaire`, `uvol`, `utemps`, `ucomp` | ⛔ | Conversions : `7.06*1000` montre le facteur ; résultat exigé retenu. |
| `fimg`, `valnum` | ⛔ | Substitution : `4*(-2)^2-4*(-2)` refusé ; d'accord ? |
| `log`, `logbase`, `expo`, `eqexp`, `eqlog` | ⛔ / ✅ (`eqexp`, `eqlog` : thème) | `log(32)/log(2)` pour « Résous 2^x = 32 » est accepté en `eqexp`/`eqlog` (MP 3e) : ⛔ ? Les valeurs approchées restent ✅ (arrondi). |
| `trigexact`, `exactes` | ✅ | La forme a√b exigée suffit-elle (`14*sqrt(3)/2` accepté : non simplifié) ? |
| `combi`, `denombr` | ✅ | `6*5*4*3*2*1` ou `12*11*10` accepté. |
| Réponses en liste (`set`, `pair` : équations, systèmes, coordonnées) | non traitées | Une fraction non simplifiée (`26/4`) ou un calcul y est encore accepté. Étendre la règle aux listes ? |
| `expfn` (« Simplifie … sous la forme e^… ») | non traité | La forme « une seule puissance de e » n'existe pas encore : l'expression recopiée est acceptée. |
| Questions curieuses (`curieux.js`) | ✅ toujours | Calcul tapé accepté (choix du 21.11 : vérifier une intuition par le calcul). |
| Clavier des notions ✅ au CO | clavier complet (avec x, y) | Faire un clavier « calculatrice » sans lettres pour les réponses numériques ? |

## Tableau par notion

Colonnes : classe d'introduction (CO 9e–11e, 1C–4C Collège, MP1–MP4, FR = France) ; règle par défaut de la notion ;
source (exception de la notion ou règle du thème) ; « obs. » = réponses observées à l'audit (n = 12 tirages × 4 niveaux)
en résultat exigé / calcul permis (une consigne « sans calculatrice » ou un arrondi peut changer la règle d'une question),
puis expressions littérales avec forme contrôlée / total.

| Notion | Intitulé | Classe | Thème | Règle | Source | Obs. | Raison |
|---|---|---|---|---|---|---|---|
| `prio` | Priorités des opérations | 9e MP1 | Nombres | ⛔ résultat exigé | thème | 79/0 | 5·(3−8) refusé |
| `rel` | Nombres relatifs : multiplier, diviser, priorités | 10e MP1 | Nombres | ⛔ résultat exigé | thème | 84/0 | −7+19 refusé |
| `arith` | PGDC et PPMC | 9e MP1 | Nombres | ⛔ résultat exigé | thème | 48/0 | Nombres et opérations : le calcul est la compétence |
| `fracadd` | Fractions : additionner, soustraire | 9e MP1 | Nombres | ⛔ résultat exigé | thème | 72/0 | fraction irréductible exigée, 3/4+1/2 refusé |
| `diagr` | Diagrammes et moyennes | 9e | Nombres | ✅ autorisé | exception | 0/48 | moyenne, secteur : la formule est la compétence, le calcul un outil |
| `vol` | Volumes : prisme droit et cylindre | 10e | Grandeurs | ✅ autorisé | thème | 0/72 | formule appliquée : le calcul est un outil |
| `prop` | Quatrième proportionnelle, règle de trois | 9e | Fonctions/algèbre | ✅ autorisé | thème | 0/48 | modélisation, lecture ; formes littérales contrôlées |
| `valnum` | Substituer dans une expression littérale | 9e | Fonctions/algèbre | ⛔ résultat exigé | exception | 60/12 | substitution : remplacer et calculer est la compétence |
| `angtri` | Somme des angles d'un triangle | 9e | Espace | ✅ autorisé | thème | 0/72 | géométrie, trigonométrie : calcul d'outil |
| `decread` | Lire et décomposer un nombre décimal | 9e | Nombres | ⛔ résultat exigé | thème | 48/0 | Nombres et opérations : le calcul est la compétence |
| `deccomp` | Comparer et ranger des nombres décimaux | 9e | Nombres | ⛔ résultat exigé | thème | 48/0 | Nombres et opérations : le calcul est la compétence |
| `decarr` | Encadrer et arrondir | 9e | Nombres | ⛔ résultat exigé | thème | 48/0 | Nombres et opérations : le calcul est la compétence |
| `ordgr` | Ordre de grandeur | 9e | Nombres | ⛔ résultat exigé | thème | 84/0 | Nombres et opérations : le calcul est la compétence |
| `decadd` | Additionner et soustraire des décimaux | 9e | Nombres | ⛔ résultat exigé | thème | 72/0 | Nombres et opérations : le calcul est la compétence |
| `dec10` | Multiplier et diviser par 10, 100, 1000 | 9e | Nombres | ⛔ résultat exigé | thème | 48/0 | Nombres et opérations : le calcul est la compétence |
| `decmul` | Multiplier des nombres décimaux | 9e | Nombres | ⛔ résultat exigé | thème | 48/24 | Nombres et opérations : le calcul est la compétence |
| `decdiv` | Diviser des nombres décimaux | 9e | Nombres | ⛔ résultat exigé | thème | 72/0 | Nombres et opérations : le calcul est la compétence |
| `decprob` | Problèmes avec des nombres décimaux | 9e | Nombres | ⛔ résultat exigé | thème | 48/0 | Nombres et opérations : le calcul est la compétence |
| `pow9` | Carrés, cubes et puissances | 9e | Nombres | ⛔ résultat exigé | thème | 48/0 | Nombres et opérations : le calcul est la compétence |
| `tradexpr` | Traduire un énoncé en calcul | 9e | Nombres | ⛔ résultat exigé | thème | 74/0 ; expr 0/10 | Nombres et opérations : le calcul est la compétence |
| `multdiv` | Multiples et diviseurs | 9e | Nombres | ⛔ résultat exigé | thème | 48/0 | Nombres et opérations : le calcul est la compétence |
| `divcrit` | Critères de divisibilité | 9e MP1 | Nombres | ⛔ résultat exigé | thème | 72/0 | Nombres et opérations : le calcul est la compétence |
| `premiers` | Nombres premiers, décomposition | 9e MP1 | Nombres | ⛔ résultat exigé | thème | 48/0 | Nombres et opérations : le calcul est la compétence |
| `relrep` | Nombres relatifs : repérer et comparer | 9e | Nombres | ⛔ résultat exigé | thème | 48/0 | Nombres et opérations : le calcul est la compétence |
| `reladd` | Additionner et soustraire des relatifs | 9e | Nombres | ⛔ résultat exigé | thème | 84/0 | idem |
| `fracrep` | Fractions : comparer et encadrer | 9e | Nombres | ⛔ résultat exigé | thème | 48/0 | Nombres et opérations : le calcul est la compétence |
| `fracsimp` | Amplifier et simplifier une fraction | 9e MP1 | Nombres | ⛔ résultat exigé | thème | 48/0 | Nombres et opérations : le calcul est la compétence |
| `fracconv` | Fraction, nombre décimal, pourcentage | 9e MP1 | Nombres | ⛔ résultat exigé | thème | 72/0 | Nombres et opérations : le calcul est la compétence |
| `fracper` | Fractions et nombres périodiques | 9e | Nombres | ⛔ résultat exigé | thème | 48/0 | Nombres et opérations : le calcul est la compétence |
| `fractout` | Fraction d'une quantité | 9e | Nombres | ⛔ résultat exigé | thème | 48/0 | Nombres et opérations : le calcul est la compétence |
| `ulong` | Unités de longueur et de masse | 9e | Grandeurs | ⛔ résultat exigé | exception | 48/0 | conversion : le facteur de conversion est la compétence |
| `uaire` | Unités d'aire | 9e | Grandeurs | ⛔ résultat exigé | exception | 48/0 | conversion d'aire |
| `uvol` | Unités de volume et de capacité | 9e | Grandeurs | ⛔ résultat exigé | exception | 48/0 | conversion de volume |
| `utemps` | Durées et horaires | 9e | Grandeurs | ⛔ résultat exigé | exception | 65/7 | durées : calcul en base 60 |
| `perim` | Périmètre d'un polygone | 9e | Grandeurs | ✅ autorisé | thème | 0/48 | formule appliquée : le calcul est un outil |
| `aire1` | Aire : carré, rectangle, triangle | 9e | Grandeurs | ✅ autorisé | thème | 0/48 | formule appliquée : le calcul est un outil |
| `aire2` | Aire : parallélogramme, losange | 9e | Grandeurs | ✅ autorisé | thème | 0/48 | formule appliquée : le calcul est un outil |
| `aire3` | Aire par décomposition | 9e | Grandeurs | ✅ autorisé | thème | 0/48 | formule appliquée : le calcul est un outil |
| `volpave` | Cube et pavé : volume et aire | 9e | Grandeurs | ✅ autorisé | thème | 0/48 | formule appliquée : le calcul est un outil |
| `solides` | Solides : faces, arêtes, sommets | 9e | Espace | ✅ autorisé | thème | 0/48 | géométrie, trigonométrie : calcul d'outil |
| `proptab` | Tableau de proportionnalité | 9e | Fonctions/algèbre | ✅ autorisé | thème | 0/48 | modélisation, lecture ; formes littérales contrôlées |
| `change` | Taux de change | 9e | Fonctions/algèbre | ✅ autorisé | thème | 0/48 | modélisation, lecture ; formes littérales contrôlées |
| `agrand` | Agrandir, réduire | 9e | Fonctions/algèbre | ✅ autorisé | thème | 0/48 | modélisation, lecture ; formes littérales contrôlées |
| `litelab` | Écrire une expression littérale | 9e | Fonctions/algèbre | ✅ autorisé | thème | 0/36 ; expr 9/36 | modélisation, lecture ; formes littérales contrôlées |
| `angtype` | Angles : types et mesures | 9e | Espace | ✅ autorisé | thème | 0/48 | géométrie, trigonométrie : calcul d'outil |
| `quadri` | Quadrilatères particuliers | 9e | Espace | ✅ autorisé | thème | 0/48 | géométrie, trigonométrie : calcul d'outil |
| `symetries` | Symétries et translations dans un repère | 9e | Espace | ✅ autorisé | thème | 0/0 | géométrie, trigonométrie : calcul d'outil |
| `fracmul` | Fractions : multiplier, diviser | 10e MP1 | Nombres | ⛔ résultat exigé | thème | 72/0 | idem |
| `pct` | Pourcentages | 10e | Nombres | ✅ autorisé | exception | 0/72 | pourcentages = proportionnalité (règle de l'enseignant) |
| `puiss` | Puissances | 10e MP1 | Nombres | ⛔ résultat exigé | thème | 60/9 | résultat exigé ; a^n admis seulement si la consigne demande une puissance |
| `sci` | Notation scientifique | 10e MP1 | Nombres | forme propre | exception | 0/37 | forme propre (a·10^n), contrôle spec.sci |
| `rac` | Racines carrées | 10e MP1 | Nombres | ⛔ résultat exigé | thème | 48/0 | √968 non simplifié, √16 refusés |
| `racprop` | Racines : propriétés (carrées et cubiques) | 11e MP1 | Nombres | ⛔ résultat exigé | thème | 72/0 | idem |
| `disque` | Cercle et disque | 10e | Grandeurs | ✅ autorisé | thème | 0/48 | formule appliquée : le calcul est un outil |
| `vitesse` | Vitesse, distance, durée | 10e | Grandeurs | ✅ autorisé | thème | 1/74 | formule appliquée : le calcul est un outil |
| `pyth` | Théorème de Pythagore | 10e MP1 | Grandeurs | ✅ autorisé | thème | 0/72 | formule appliquée : le calcul est un outil |
| `reduire` | Réduire une expression | 10e MP1 | Fonctions/algèbre | ✅ autorisé | thème | 0/48 ; expr 36/36 | modélisation, lecture ; formes littérales contrôlées |
| `distrib` | Développer | 10e MP1 | Fonctions/algèbre | ✅ autorisé | thème | 0/45 ; expr 36/36 | modélisation, lecture ; formes littérales contrôlées |
| `eq1` | Équations du 1er degré | 10e MP1 | Fonctions/algèbre | ⛔ résultat exigé | exception | 71/0 ; expr 0/1 | équation : solution réduite exigée |
| `probeq` | Mettre un problème en équation | 10e MP1 | Fonctions/algèbre | ⛔ résultat exigé | exception | 72/0 | mise en équation : statu quo du CO (résultat) |
| `echelle` | Échelles et pentes | 10e | Fonctions/algèbre | ✅ autorisé | thème | 0/72 | modélisation, lecture ; formes littérales contrôlées |
| `affine` | Fonctions affines | 10e MP2 | Fonctions/algèbre | ✅ autorisé | thème | 0/57 ; expr 0/13 | modélisation, lecture ; formes littérales contrôlées |
| `polyreg` | Polygones réguliers | 10e | Espace | ✅ autorisé | thème | 0/48 | géométrie, trigonométrie : calcul d'outil |
| `grandmanq` | Retrouver une dimension à partir de l'aire | 10e | Grandeurs | ✅ autorisé | thème | 0/48 | formule appliquée : le calcul est un outil |
| `fracops` | Fractions relatives et priorités | 10e MP1 | Nombres | ⛔ résultat exigé | thème | 72/0 | idem |
| `airelat` | Aire latérale et totale : prisme, cylindre | 10e | Grandeurs | ✅ autorisé | thème | 0/48 | formule appliquée : le calcul est un outil |
| `voldecomp` | Volumes : décomposition et contenances | 10e | Grandeurs | ✅ autorisé | thème | 0/48 | formule appliquée : le calcul est un outil |
| `carres` | Carrés parfaits, racines exactes | 10e | Nombres | ⛔ résultat exigé | thème | 72/0 | Nombres et opérations : le calcul est la compétence |
| `racenc` | Encadrer et comparer des racines | 10e | Nombres | ⛔ résultat exigé | thème | 72/0 | Nombres et opérations : le calcul est la compétence |
| `scicalc` | Calculer en notation scientifique | 10e MP1 | Nombres | forme propre | exception | 0/24 | idem |
| `monomes` | Multiplier des monômes | 10e MP1 | Fonctions/algèbre | ✅ autorisé | thème | 0/48 ; expr 36/36 | modélisation, lecture ; formes littérales contrôlées |
| `pythfig` | Pythagore dans une figure, dans l'espace | 10e MP1 | Grandeurs | ✅ autorisé | thème | 0/72 | formule appliquée : le calcul est un outil |
| `eqverif` | Vérifier une solution d'équation | 10e | Fonctions/algèbre | ⛔ résultat exigé | exception | 48/0 | choisir la solution parmi des nombres |
| `pctvar` | Augmentation et diminution en pourcentage | 10e MP1 | Fonctions/algèbre | ✅ autorisé | thème | 0/72 | modélisation, lecture ; formes littérales contrôlées |
| `pente` | Pente en pourcentage | 10e | Fonctions/algèbre | ✅ autorisé | thème | 0/48 | modélisation, lecture ; formes littérales contrôlées |
| `repere` | Se repérer dans le plan | 10e | Fonctions/algèbre | ✅ autorisé | thème | 0/55 | modélisation, lecture ; formes littérales contrôlées |
| `tabval` | Tableau de valeurs d'une fonction | 10e | Fonctions/algèbre | ✅ autorisé | thème | 0/72 | modélisation, lecture ; formes littérales contrôlées |
| `rotation` | Rotations | 10e | Espace | ✅ autorisé | thème | 0/24 | géométrie, trigonométrie : calcul d'outil |
| `eqfrac` | Équations avec parenthèses ou fractions | 10e MP1 | Fonctions/algèbre | ⛔ résultat exigé | exception | 72/0 | idem |
| `proba` | Probabilités | 11e | Nombres | ⛔ résultat exigé | thème | 72/0 | Nombres et opérations : le calcul est la compétence |
| `volcone` | Volumes : pyramide, cône, boule | 11e | Grandeurs | ✅ autorisé | thème | 0/72 | formule appliquée : le calcul est un outil |
| `gquot` | Masse volumique et débit | 11e | Grandeurs | ✅ autorisé | thème | 1/71 | formule appliquée : le calcul est un outil |
| `thales` | Théorème de Thalès | 11e MP1 | Grandeurs | ✅ autorisé | thème | 0/76 | formule appliquée : le calcul est un outil |
| `idrem` | Identités remarquables | 11e MP1 | Fonctions/algèbre | ✅ autorisé | thème | 2/41 ; expr 29/29 | modélisation, lecture ; formes littérales contrôlées |
| `factor` | Factoriser | 11e MP1 | Fonctions/algèbre | ✅ autorisé | thème | 0/18 ; expr 36/36 | modélisation, lecture ; formes littérales contrôlées |
| `formule` | Transformer une formule | 11e MP1 | Fonctions/algèbre | ✅ autorisé | thème | 0/36 ; expr 0/36 | modélisation, lecture ; formes littérales contrôlées |
| `eq2` | Équations produit nul | 11e MP1 | Fonctions/algèbre | ✅ autorisé | thème | 0/29 | modélisation, lecture ; formes littérales contrôlées |
| `eq2disc` | Équations du 2e degré (formule) | 11e MP1 | Fonctions/algèbre | ✅ autorisé | thème | 0/45 | modélisation, lecture ; formes littérales contrôlées |
| `sys2` | Systèmes de deux équations | 11e MP1 | Fonctions/algèbre | ✅ autorisé | thème | 0/37 | modélisation, lecture ; formes littérales contrôlées |
| `angles` | Angles : parallèles, cercle | 11e MP1 | Espace | ✅ autorisé | thème | 0/72 | géométrie, trigonométrie : calcul d'outil |
| `simil` | Homothéties et similitudes | 11e | Espace | ✅ autorisé | thème | 0/72 | géométrie, trigonométrie : calcul d'outil |
| `pythrec` | Réciproque de Pythagore | 11e MP1 | Grandeurs | ✅ autorisé | thème | 0/72 | formule appliquée : le calcul est un outil |
| `airepyr` | Aire d'une pyramide, apothème | 11e | Grandeurs | ✅ autorisé | thème | 0/72 | formule appliquée : le calcul est un outil |
| `volcomp` | Volume d'un solide composé | 11e | Grandeurs | ✅ autorisé | thème | 0/72 | formule appliquée : le calcul est un outil |
| `volmanq` | Retrouver une dimension d'un solide | 11e | Grandeurs | ✅ autorisé | thème | 0/72 | formule appliquée : le calcul est un outil |
| `ucomp` | Convertir des unités composées | 11e | Fonctions/algèbre | ⛔ résultat exigé | exception | 58/14 | unités composées : la conversion est la compétence |
| `parenth` | Supprimer des parenthèses | 11e MP1 | Fonctions/algèbre | ✅ autorisé | thème | 0/36 ; expr 36/36 | modélisation, lecture ; formes littérales contrôlées |
| `eq2fact` | Équations du 2e degré par factorisation | 11e MP1 | Fonctions/algèbre | ✅ autorisé | thème | 0/31 | modélisation, lecture ; formes littérales contrôlées |
| `probeq2` | Problèmes du 2e degré | 11e | Fonctions/algèbre | ✅ autorisé | thème | 0/72 | modélisation, lecture ; formes littérales contrôlées |
| `cercthales` | Cercle de Thalès et tangente | 11e MP1 | Espace | ✅ autorisé | thème | 0/72 | géométrie, trigonométrie : calcul d'outil |
| `thalesrec` | Réciproque de Thalès | 11e | Grandeurs | ✅ autorisé | thème | 0/77 | formule appliquée : le calcul est un outil |
| `sysprob` | Problèmes à deux inconnues | 11e MP1 | Fonctions/algèbre | ✅ autorisé | thème | 0/42 | modélisation, lecture ; formes littérales contrôlées |
| `denombr` | Dénombrer | 11e | Nombres | ✅ autorisé | exception | 0/72 | dénombrer : 5·5·4 montre le raisonnement |
| `polyop` | Polynômes : développer et réduire | 1C MP1 | Fonctions/algèbre | ✅ autorisé | thème | 0/30 ; expr 36/36 | modélisation, lecture ; formes littérales contrôlées |
| `factor2` | Factoriser au maximum | 1C MP1 | Fonctions/algèbre | ✅ autorisé | thème | 0/12 ; expr 36/36 | modélisation, lecture ; formes littérales contrôlées |
| `eq3` | Équations de degré 3 par factorisation | 1C | Fonctions/algèbre | ✅ autorisé | thème | 0/36 | modélisation, lecture ; formes littérales contrôlées |
| `sys3` | Systèmes de trois équations | 1C MP1 | Fonctions/algèbre | ✅ autorisé | thème | 0/36 | modélisation, lecture ; formes littérales contrôlées |
| `domaine` | Domaine de définition | 1C MP1 | Fonctions/algèbre | ✅ autorisé | thème | 0/36 | modélisation, lecture ; formes littérales contrôlées |
| `fimg` | Images et préimages | 1C MP1 | Fonctions/algèbre | ⛔ résultat exigé | exception | 61/0 | image f(a) : substitution (sqrt(4) pour f(4) serait une recopie) |
| `f2` | Parabole : zéros et sommet | 1C MP2 | Fonctions/algèbre | ✅ autorisé | thème | 0/34 ; expr 0/1 | modélisation, lecture ; formes littérales contrôlées |
| `f2expr` | Parabole : retrouver l'expression | 1C MP2 | Fonctions/algèbre | ✅ autorisé | thème | 0/27 ; expr 27/36 | modélisation, lecture ; formes littérales contrôlées |
| `inter` | Intersection de deux graphes | 1C MP1 | Fonctions/algèbre | ✅ autorisé | thème | 0/30 | modélisation, lecture ; formes littérales contrôlées |
| `ineq2` | Inéquations du 2e degré | 1C | Fonctions/algèbre | ✅ autorisé | thème | 0/41 | modélisation, lecture ; formes littérales contrôlées |
| `racinv` | Fonctions racine carrée et inverse | 1C | Fonctions/algèbre | ✅ autorisé | thème | 0/66 | modélisation, lecture ; formes littérales contrôlées |
| `euclide` | Théorèmes d'Euclide et de la hauteur | 1C MP1 | Espace | ✅ autorisé | thème | 0/72 | géométrie, trigonométrie : calcul d'outil |
| `droitesrem` | Droites remarquables du triangle | 1C | Espace | ✅ autorisé | thème | 0/72 | géométrie, trigonométrie : calcul d'outil |
| `trigo` | Trigonométrie du triangle rectangle | 1C MP1 | Espace | ✅ autorisé | thème | 0/67 | géométrie, trigonométrie : calcul d'outil |
| `polydiv` | Division de polynômes | 2C | Fonctions/algèbre | ✅ autorisé | thème | 0/28 ; expr 12/16 | modélisation, lecture ; formes littérales contrôlées |
| `polyfact` | Factoriser un polynôme, racine évidente | 2C | Fonctions/algèbre | ✅ autorisé | thème | 0/0 | modélisation, lecture ; formes littérales contrôlées |
| `fracrat` | Fractions rationnelles | 2C MP1 | Fonctions/algèbre | ✅ autorisé | thème | 0/36 ; expr 27/36 | modélisation, lecture ; formes littérales contrôlées |
| `eqrat` | Équations rationnelles | 2C | Fonctions/algèbre | ✅ autorisé | thème | 0/0 | modélisation, lecture ; formes littérales contrôlées |
| `ineq` | Inéquations du 1er degré | 1C | Fonctions/algèbre | ✅ autorisé | thème | 0/42 | modélisation, lecture ; formes littérales contrôlées |
| `recip` | Composition et réciproque | 2C | Fonctions/algèbre | ✅ autorisé | thème | 0/31 ; expr 0/17 | modélisation, lecture ; formes littérales contrôlées |
| `absval` | Valeur absolue | 1C | Fonctions/algèbre | ✅ autorisé | thème | 0/54 | modélisation, lecture ; formes littérales contrôlées |
| `ensembles` | Intervalles et ensembles de nombres | 1C MP1 | Nombres | ⛔ résultat exigé | thème | 62/0 | Nombres et opérations : le calcul est la compétence |
| `ratden` | Rendre rationnel un dénominateur | 1C MP1 | Nombres | ⛔ résultat exigé | thème | 72/0 | Nombres et opérations : le calcul est la compétence |
| `trinfact` | Factoriser un trinôme par ses zéros | 1C MP1 | Fonctions/algèbre | ✅ autorisé | thème | 0/24 ; expr 34/34 | modélisation, lecture ; formes littérales contrôlées |
| `exactes` | Longueurs et aires en valeurs exactes | 1C MP1 | Grandeurs | ✅ autorisé | thème | 0/72 | formule appliquée : le calcul est un outil |
| `sysgraph` | Systèmes : nombre de solutions | 1C MP1 | Fonctions/algèbre | ✅ autorisé | thème | 0/50 | modélisation, lecture ; formes littérales contrôlées |
| `optim` | Problèmes d'optimisation (2e degré) | 1C MP2 | Fonctions/algèbre | ✅ autorisé | thème | 0/48 | modélisation, lecture ; formes littérales contrôlées |
| `eqspec` | Équations impossibles ou indéterminées | 1C MP1 | Fonctions/algèbre | ⛔ résultat exigé | exception | 43/0 | équations : résultat exigé |
| `bicarre` | Équations bicarrées | 1C | Fonctions/algèbre | ✅ autorisé | thème | 0/36 | modélisation, lecture ; formes littérales contrôlées |
| `lectgraph` | Lire un graphique : zéros, variations, équations | 1C MP1 | Fonctions/algèbre | ✅ autorisé | thème | 0/52 | modélisation, lecture ; formes littérales contrôlées |
| `affzero` | Zéro et signe d'une fonction du premier degré | 1C MP2 | Fonctions/algèbre | ✅ autorisé | thème | 0/45 | modélisation, lecture ; formes littérales contrôlées |
| `f2formes` | Formes d'une fonction du 2e degré | 1C MP2 | Fonctions/algèbre | ✅ autorisé | thème | 0/34 ; expr 13/13 | modélisation, lecture ; formes littérales contrôlées |
| `f2trois` | Parabole passant par trois points | 1C MP2 | Fonctions/algèbre | ✅ autorisé | thème | 0/51 ; expr 21/21 | modélisation, lecture ; formes littérales contrôlées |
| `interpar` | Intersections de courbes | 1C | Fonctions/algèbre | ✅ autorisé | thème | 0/28 | modélisation, lecture ; formes littérales contrôlées |
| `modaff` | Modéliser avec une fonction du premier degré | 1C MP2 | Fonctions/algèbre | ✅ autorisé | thème | 0/69 ; expr 0/3 | modélisation, lecture ; formes littérales contrôlées |
| `trigexact` | Valeurs exactes, pente et angle | 1C MP1 | Espace | ✅ autorisé | thème | 6/66 | géométrie, trigonométrie : calcul d'outil |
| `geocomb` | Problèmes combinant plusieurs théorèmes | 1C MP1 | Espace | ✅ autorisé | thème | 0/72 | géométrie, trigonométrie : calcul d'outil |
| `sysineq` | Systèmes d'inéquations du 1er degré | 1C | Fonctions/algèbre | ✅ autorisé | thème | 0/36 | modélisation, lecture ; formes littérales contrôlées |
| `ineqfrac` | Inéquations fractionnaires | 1C | Fonctions/algèbre | ✅ autorisé | thème | 0/35 | modélisation, lecture ; formes littérales contrôlées |
| `eqirr` | Équations irrationnelles | 1C | Fonctions/algèbre | ✅ autorisé | thème | 0/0 | modélisation, lecture ; formes littérales contrôlées |
| `morceaux` | Fonctions définies par morceaux | 1C | Fonctions/algèbre | ✅ autorisé | thème | 0/58 ; expr 0/5 | modélisation, lecture ; formes littérales contrôlées |
| `transf` | Transformer un graphe : f(x − a) + b | 1C | Fonctions/algèbre | ✅ autorisé | thème | 0/40 ; expr 0/6 | modélisation, lecture ; formes littérales contrôlées |
| `trigrel` | Relations trigonométriques | 1C | Espace | ⛔ résultat exigé | exception | 72/0 | relations sin/cos/tan : idem |
| `homog` | Fonctions homographiques | 2C | Fonctions/algèbre | ✅ autorisé | thème | 0/24 ; expr 0/24 | modélisation, lecture ; formes littérales contrôlées |
| `trigfn` | Fonctions trigonométriques | 2C MP2 | Fonctions/algèbre | ✅ autorisé | thème | 0/84 | modélisation, lecture ; formes littérales contrôlées |
| `expo` | Exponentielles | 2C | Fonctions/algèbre | ⛔ résultat exigé | exception | 51/21 | équations exponentielles : exposant exigé |
| `log` | Logarithmes | 2C | Fonctions/algèbre | ⛔ résultat exigé | exception | 36/24 | log(0,0001) tapé tel quel serait une recopie |
| `trigcercle` | Cercle trigonométrique, radians | 2C MP2 | Espace | ⛔ résultat exigé | exception | 78/0 | valeurs exactes et radians : cos(pi/6) tapé ferait le travail |
| `trigeq` | Équations trigonométriques | 2C MP2 | Espace | ✅ autorisé | thème | 0/12 | géométrie, trigonométrie : calcul d'outil |
| `sinlaw` | Triangle quelconque (sinus, cosinus) | 2C MP2 | Espace | ✅ autorisé | thème | 0/72 | géométrie, trigonométrie : calcul d'outil |
| `cart` | Distance et milieu | 2C | Espace | ✅ autorisé | thème | 0/52 | géométrie, trigonométrie : calcul d'outil |
| `droites` | Équations de droites | 2C MP2 | Espace | ✅ autorisé | thème | 0/54 ; expr 0/25 | géométrie, trigonométrie : calcul d'outil |
| `cercle` | Équations de cercles | 2C | Espace | ✅ autorisé | thème | 0/12 | géométrie, trigonométrie : calcul d'outil |
| `valint` | Valeurs interdites d'une fraction rationnelle | 2C MP1 | Fonctions/algèbre | ✅ autorisé | thème | 0/24 | modélisation, lecture ; formes littérales contrôlées |
| `modexp` | Croissance exponentielle | 2C | Fonctions/algèbre | ✅ autorisé | thème | 0/48 | modélisation, lecture ; formes littérales contrôlées |
| `compo` | Composer des fonctions | 2C | Fonctions/algèbre | ✅ autorisé | thème | 0/18 ; expr 6/12 | modélisation, lecture ; formes littérales contrôlées |
| `fracetage` | Fractions à étages | 2C | Fonctions/algèbre | ✅ autorisé | thème | 0/0 ; expr 45/48 | modélisation, lecture ; formes littérales contrôlées |
| `probrat` | Problèmes menant à une équation rationnelle | 2C | Fonctions/algèbre | ✅ autorisé | thème | 0/48 | modélisation, lecture ; formes littérales contrôlées |
| `bijection` | Injection, bijection | 2C | Fonctions/algèbre | ✅ autorisé | thème | 0/48 | modélisation, lecture ; formes littérales contrôlées |
| `decomp` | Décomposer une fonction | 2C | Fonctions/algèbre | ✅ autorisé | thème | 0/0 ; expr 0/48 | modélisation, lecture ; formes littérales contrôlées |
| `polyexpr` | Expression d'une fonction polynomiale | 2C | Fonctions/algèbre | ✅ autorisé | thème | 0/24 ; expr 24/24 | modélisation, lecture ; formes littérales contrôlées |
| `homogrec` | Réciproque d'une fonction homographique | 2C | Fonctions/algèbre | ✅ autorisé | thème | 0/24 ; expr 12/24 | modélisation, lecture ; formes littérales contrôlées |
| `trigassoc` | Angles associés, relations fondamentales | 2C MP2 | Espace | ⛔ résultat exigé | exception | 72/0 | angles associés : le calcul est la relation |
| `trigeq2` | Équations et modèles trigonométriques | 2C MP2 | Espace | ✅ autorisé | thème | 0/71 | géométrie, trigonométrie : calcul d'outil |
| `logbase` | Logarithmes : changement de base | 2C | Fonctions/algèbre | ⛔ résultat exigé | exception | 36/12 | changement de base : log(a)/log(b) ferait le travail (valeur approchée : décimal) |
| `triaire` | Triangle quelconque : aire et problèmes | 2C MP2 | Espace | ✅ autorisé | thème | 0/72 | géométrie, trigonométrie : calcul d'outil |
| `droitesinter` | Intersection de droites, médiatrice, hauteur | 2C MP2 | Espace | ✅ autorisé | thème | 0/62 ; expr 0/7 | géométrie, trigonométrie : calcul d'outil |
| `recipaff` | Réciproque d'une fonction affine | MP2 | Fonctions/algèbre | ✅ autorisé | thème | 0/50 ; expr 0/12 | modélisation, lecture ; formes littérales contrôlées |
| `cercletan` | Cercles : conditions et tangentes | 2C | Espace | ✅ autorisé | thème | 0/48 | géométrie, trigonométrie : calcul d'outil |
| `expfrac` | Exposants fractionnaires | 2C | Nombres | ⛔ résultat exigé | thème | 48/0 | Nombres et opérations : le calcul est la compétence |
| `vecteurs` | Vecteurs : composantes, norme, produit scalaire | 2C | Espace | ✅ autorisé | thème | 0/36 | géométrie, trigonométrie : calcul d'outil |
| `stats` | Statistiques (moyenne, médiane, écart-type) | MP2 | Nombres | ✅ autorisé | exception | 0/72 | statistiques : calcul d'outil |
| `vabs` | Valeur absolue d'un nombre | MP1 | Nombres | ⛔ résultat exigé | thème | 55/0 | Nombres et opérations : le calcul est la compétence |
| `eqparam` | Équations avec un paramètre | MP1 | Fonctions/algèbre | ✅ autorisé | thème | 0/84 | modélisation, lecture ; formes littérales contrôlées |
| `statfreq` | Effectifs, fréquences, diagramme circulaire | MP2 | Nombres | ✅ autorisé | exception | 0/72 | idem |
| `quartiles` | Étendue, médiane, quartiles | MP2 | Nombres | ✅ autorisé | exception | 0/84 | idem |
| `eqabs` | Équations avec valeur absolue | MP3 | Fonctions/algèbre | ✅ autorisé | thème | 0/12 | modélisation, lecture ; formes littérales contrôlées |
| `eqbic` | Équations bicarrées, changement de variable | MP3 | Fonctions/algèbre | ✅ autorisé | thème | 0/24 | modélisation, lecture ; formes littérales contrôlées |
| `eqirrmp` | Équations irrationnelles | MP3 | Fonctions/algèbre | ✅ autorisé | thème | 0/16 | modélisation, lecture ; formes littérales contrôlées |
| `eqratmp` | Équations rationnelles | MP3 | Fonctions/algèbre | ✅ autorisé | thème | 0/42 | modélisation, lecture ; formes littérales contrôlées |
| `puisrat` | Puissances d'exposant rationnel | MP3 | Nombres | ⛔ résultat exigé | thème | 41/24 ; expr 3/3 | Nombres et opérations : le calcul est la compétence |
| `logdef` | Logarithmes : définition et calcul | MP3 | Nombres | ⛔ résultat exigé | thème | 19/40 | Nombres et opérations : le calcul est la compétence |
| `logprop` | Propriétés des logarithmes | MP3 | Nombres | ⛔ résultat exigé | thème | 52/0 | Nombres et opérations : le calcul est la compétence |
| `eqexp` | Équations exponentielles | MP3 | Fonctions/algèbre | ✅ autorisé | thème | 0/30 | modélisation, lecture ; formes littérales contrôlées |
| `eqlog` | Équations logarithmiques | MP3 | Fonctions/algèbre | ✅ autorisé | thème | 0/41 | modélisation, lecture ; formes littérales contrôlées |
| `croissexp` | Croissance et décroissance exponentielles | MP3 | Fonctions/algèbre | ✅ autorisé | thème | 0/72 | modélisation, lecture ; formes littérales contrôlées |
| `volmp` | Volumes des solides | MP3 | Grandeurs | ✅ autorisé | thème | 0/72 | formule appliquée : le calcul est un outil |
| `similmp` | Similitude : rapports k, k², k³ | MP3 | Grandeurs | ✅ autorisé | thème | 0/72 | formule appliquée : le calcul est un outil |
| `coordmp` | Coordonnées : distance, milieu, polaires | MP4 | Espace | ✅ autorisé | thème | 0/64 | géométrie, trigonométrie : calcul d'outil |
| `vectmp` | Vecteurs : composantes, opérations, norme | MP4 | Espace | ✅ autorisé | thème | 0/39 | géométrie, trigonométrie : calcul d'outil |
| `scalmp` | Produit scalaire, angle, orthogonalité | MP4 | Espace | ✅ autorisé | thème | 0/72 | géométrie, trigonométrie : calcul d'outil |
| `projmp` | Projection orthogonale | MP4 | Espace | ✅ autorisé | thème | 0/58 | géométrie, trigonométrie : calcul d'outil |
| `pvectmp` | Produit vectoriel | MP4 | Espace | ✅ autorisé | thème | 0/76 | géométrie, trigonométrie : calcul d'outil |
| `droiteparam` | Droites paramétriques | MP4 | Espace | ✅ autorisé | thème | 0/38 | géométrie, trigonométrie : calcul d'outil |
| `posdroites` | Position relative de deux droites | MP4 | Espace | ✅ autorisé | thème | 0/73 | géométrie, trigonométrie : calcul d'outil |
| `ineqmp` | Inéquations, tableau des signes | MP4 | Fonctions/algèbre | ✅ autorisé | thème | 0/24 | modélisation, lecture ; formes littérales contrôlées |
| `fctmp` | Fonctions : réciproque, parité, transformations | MP4 | Fonctions/algèbre | ✅ autorisé | thème | 0/40 ; expr 0/6 | modélisation, lecture ; formes littérales contrôlées |
| `polymp` | Polynômes : zéros, division, signe | MP4 | Fonctions/algèbre | ✅ autorisé | thème | 0/45 ; expr 0/3 | modélisation, lecture ; formes littérales contrôlées |
| `sinusmp` | Fonctions sinusoïdales | MP4 | Fonctions/algèbre | ✅ autorisé | thème | 0/66 ; expr 0/6 | modélisation, lecture ; formes littérales contrôlées |
| `explogfn` | Fonctions exponentielles et logarithmiques | MP4 | Fonctions/algèbre | ✅ autorisé | thème | 0/69 | modélisation, lecture ; formes littérales contrôlées |
| `fratmp` | Fonctions rationnelles simples | MP4 | Fonctions/algèbre | ✅ autorisé | thème | 0/59 | modélisation, lecture ; formes littérales contrôlées |
| `suitedef` | Suites : termes, récurrence, sens de variation | FR | Fonctions/algèbre | ✅ autorisé | thème | 0/46 ; expr 0/2 | modélisation, lecture ; formes littérales contrôlées |
| `suitearith` | Suites arithmétiques | FR | Fonctions/algèbre | ✅ autorisé | thème | 0/45 ; expr 0/3 | modélisation, lecture ; formes littérales contrôlées |
| `suitegeo` | Suites géométriques | FR | Fonctions/algèbre | ✅ autorisé | thème | 0/47 ; expr 0/1 | modélisation, lecture ; formes littérales contrôlées |
| `suitesomme` | Sommes de termes d'une suite | FR | Fonctions/algèbre | ✅ autorisé | thème | 0/48 | modélisation, lecture ; formes littérales contrôlées |
| `expfn` | Fonction exponentielle : propriétés, équations | FR | Fonctions/algèbre | ✅ autorisé | thème | 0/21 ; expr 0/8 | modélisation, lecture ; formes littérales contrôlées |
| `pscal` | Produit scalaire | FR | Espace | ✅ autorisé | thème | 0/39 | géométrie, trigonométrie : calcul d'outil |
| `probtot` | Arbres pondérés, probabilités totales | FR | Nombres | ✅ autorisé | exception | 0/48 | idem |
| `vaesp` | Variable aléatoire : loi, espérance, variance | FR | Nombres | ✅ autorisé | exception | 0/48 | idem |
| `suitelim` | Limites de suites | FR | Fonctions/algèbre | ✅ autorisé | thème | 0/48 | modélisation, lecture ; formes littérales contrôlées |
| `binom` | Loi binomiale | FR | Nombres | ✅ autorisé | exception | 0/48 | idem |
| `ineq1` | Inéquations du 1er degré | FR | Fonctions/algèbre | ✅ autorisé | thème | 0/30 | modélisation, lecture ; formes littérales contrôlées |
| `proba2` | Probabilités : contraire, deux épreuves, réunion | FR | Nombres | ✅ autorisé | exception | 0/72 | idem (France) |
| `tabsignes` | Tableau de signes, inéquations produit et quotient | FR | Fonctions/algèbre | ✅ autorisé | thème | 0/1 | modélisation, lecture ; formes littérales contrôlées |
| `tauxevol` | Évolutions : coefficient multiplicateur, taux successifs et réciproque | FR | Nombres | ✅ autorisé | exception | 0/72 | coefficients multiplicateurs (France) |
| `vect3e` | Vecteurs et coordonnées | FR | Espace | ✅ autorisé | thème | 0/48 | géométrie, trigonométrie : calcul d'outil |
| `fref` | Fonctions de référence : carré, inverse, racine | FR | Fonctions/algèbre | ✅ autorisé | thème | 0/11 | modélisation, lecture ; formes littérales contrôlées |
| `probcond` | Probabilités conditionnelles, tableau croisé | FR | Nombres | ✅ autorisé | exception | 0/72 | idem |
| `algopy` | Algorithmique : lire un programme Python | FR | Nombres | ⛔ résultat exigé | thème | 72/0 | Nombres et opérations : le calcul est la compétence |
| `tauxvar` | Taux de variation moyen | 3C | Fonctions/algèbre | ✅ autorisé | thème | 0/65 ; expr 7/7 | modélisation, lecture ; formes littérales contrôlées |
| `nbderive` | Nombre dérivé | 3C | Fonctions/algèbre | ✅ autorisé | thème | 0/72 | modélisation, lecture ; formes littérales contrôlées |
| `derivref` | Dérivées des fonctions de référence | 3C | Fonctions/algèbre | ✅ autorisé | thème | 0/65 ; expr 0/19 | modélisation, lecture ; formes littérales contrôlées |
| `derivregles` | Dériver une somme, un polynôme | 3C | Fonctions/algèbre | ✅ autorisé | thème | 0/31 ; expr 8/19 | modélisation, lecture ; formes littérales contrôlées |
| `derivprodquot` | Dériver un produit, un quotient | 3C | Fonctions/algèbre | ✅ autorisé | thème | 0/44 ; expr 0/16 | modélisation, lecture ; formes littérales contrôlées |
| `derivcomp` | Dériver une fonction composée | 3C | Fonctions/algèbre | ✅ autorisé | thème | 0/54 ; expr 0/18 | modélisation, lecture ; formes littérales contrôlées |
| `tangente` | Équation de la tangente | 3C | Fonctions/algèbre | ✅ autorisé | thème | 0/47 ; expr 0/14 | modélisation, lecture ; formes littérales contrôlées |
| `variations` | Signe de la dérivée et variations | 3C | Fonctions/algèbre | ✅ autorisé | thème | 0/60 | modélisation, lecture ; formes littérales contrôlées |
| `optimderiv` | Problèmes d'optimisation | 3C | Fonctions/algèbre | ✅ autorisé | thème | 0/72 | modélisation, lecture ; formes littérales contrôlées |
| `limites` | Limites : lecture, calcul, forme 0/0 | 3C | Fonctions/algèbre | ✅ autorisé | thème | 0/72 | modélisation, lecture ; formes littérales contrôlées |
| `limitinf` | Limites à l'infini | 3C | Fonctions/algèbre | ✅ autorisé | thème | 0/72 | modélisation, lecture ; formes littérales contrôlées |
| `asymptotes` | Asymptotes | 3C | Fonctions/algèbre | ✅ autorisé | thème | 0/38 | modélisation, lecture ; formes littérales contrôlées |
| `continuite` | Continuité | 3C | Fonctions/algèbre | ✅ autorisé | thème | 0/67 | modélisation, lecture ; formes littérales contrôlées |
| `derivseconde` | Dérivée seconde, points d'inflexion | 3C | Fonctions/algèbre | ✅ autorisé | thème | 0/57 | modélisation, lecture ; formes littérales contrôlées |
| `etudefct` | Étude complète d'une fonction | 3C | Fonctions/algèbre | ✅ autorisé | thème | 0/35 | modélisation, lecture ; formes littérales contrôlées |
| `combi` | Dénombrement : permutations, combinaisons | 3C | Nombres | ✅ autorisé | exception | 0/72 | dénombrement (Collège) |
| `probaxiomes` | Probabilités : contraire, réunion | 3C | Nombres | ✅ autorisé | exception | 0/72 | probabilités (Collège) |
| `probarbre` | Expériences successives, arbres | 3C | Nombres | ✅ autorisé | exception | 0/72 | idem |
| `vect3d` | Vecteurs de l'espace | 3C | Espace | ✅ autorisé | thème | 0/44 | géométrie, trigonométrie : calcul d'outil |
| `colin` | Colinéarité et coplanarité | 3C | Espace | ✅ autorisé | thème | 0/63 | géométrie, trigonométrie : calcul d'outil |
| `droite3d` | Droites de l'espace | 3C | Espace | ✅ autorisé | thème | 0/53 ; expr 0/4 | géométrie, trigonométrie : calcul d'outil |
| `plans` | Équations d'un plan | 3C | Espace | ✅ autorisé | thème | 0/47 ; expr 0/4 | géométrie, trigonométrie : calcul d'outil |
| `posrel` | Positions relatives, intersections | 3C | Espace | ✅ autorisé | thème | 0/43 | géométrie, trigonométrie : calcul d'outil |
| `pscal3d` | Produit scalaire dans l'espace | 3C | Espace | ✅ autorisé | thème | 0/64 | géométrie, trigonométrie : calcul d'outil |
| `distances` | Distances et aires dans l'espace | 3C | Espace | ✅ autorisé | thème | 0/67 | géométrie, trigonométrie : calcul d'outil |
| `sphere` | Vecteur normal, plan médiateur, sphère | 3C | Espace | ✅ autorisé | thème | 0/56 | géométrie, trigonométrie : calcul d'outil |
| `primitives` | Primitives | 4C | Fonctions/algèbre | ✅ autorisé | thème | 0/55 ; expr 0/17 | modélisation, lecture ; formes littérales contrôlées |
| `integrale` | Intégrale définie | 4C | Fonctions/algèbre | ✅ autorisé | thème | 0/72 | modélisation, lecture ; formes littérales contrôlées |
| `aireint` | Aires avec une intégrale | 4C | Fonctions/algèbre | ✅ autorisé | thème | 0/60 | modélisation, lecture ; formes littérales contrôlées |
| `volrev` | Volume d'un corps de révolution | 4C | Fonctions/algèbre | ✅ autorisé | thème | 0/72 | modélisation, lecture ; formes littérales contrôlées |
| `lnexp` | Logarithme et exponentielle | 4C | Fonctions/algèbre | ✅ autorisé | thème | 0/73 ; expr 0/11 | modélisation, lecture ; formes littérales contrôlées |
| `croissance` | Modèles de croissance exponentielle | 4C | Fonctions/algèbre | ✅ autorisé | thème | 0/72 | modélisation, lecture ; formes littérales contrôlées |
| `intparties` | Intégration par parties | 4C | Fonctions/algèbre | ✅ autorisé | thème | 0/64 ; expr 0/8 | modélisation, lecture ; formes littérales contrôlées |
| `intsubst` | Intégration par substitution | 4C | Fonctions/algèbre | ✅ autorisé | thème | 0/72 | modélisation, lecture ; formes littérales contrôlées |
| `etudelnexp` | Étude de fonctions avec ln et exp | 4C | Fonctions/algèbre | ✅ autorisé | thème | 0/69 | modélisation, lecture ; formes littérales contrôlées |
| `eqdiff` | Équations différentielles | 4C | Fonctions/algèbre | ✅ autorisé | thème | 0/53 ; expr 0/19 | modélisation, lecture ; formes littérales contrôlées |
| `matrices` | Matrices 2 × 2 : calcul, déterminant, inverse | 4C | Fonctions/algèbre | ✅ autorisé | thème | 0/60 | modélisation, lecture ; formes littérales contrôlées |
| `translin` | Transformations linéaires du plan | 4C | Espace | ✅ autorisé | thème | 0/53 | géométrie, trigonométrie : calcul d'outil |
| `appllin` | Applications linéaires : noyau, image, bases | 4C | Fonctions/algèbre | ✅ autorisé | thème | 0/67 | modélisation, lecture ; formes littérales contrôlées |
| `condbayes` | Probabilités conditionnelles et Bayes | 4C | Nombres | ✅ autorisé | exception | 0/72 | idem |
| `varalea` | Variable aléatoire : espérance, variance | 4C | Nombres | ✅ autorisé | exception | 0/72 | idem |
| `binomiale` | Loi binomiale | 4C | Nombres | ✅ autorisé | exception | 0/72 | idem |
| `normale` | Loi normale (règle 68-95-99,7) | 4C | Nombres | ✅ autorisé | exception | 0/72 | idem |
| `statdesc` | Statistique descriptive : classes, écart-type | 4C | Nombres | ✅ autorisé | exception | 0/72 | idem |
| `ineqpoly` | Inéquations polynomiales (tableau des signes) | 2C | Fonctions/algèbre | ✅ autorisé | thème | 0/0 | modélisation, lecture ; formes littérales contrôlées |
| `tradalg` | Traduire en langage algébrique | 1C | Nombres | ⛔ résultat exigé | thème | 65/0 ; expr 19/19 | Nombres et opérations : le calcul est la compétence |
| `contrex` | Conjecture et contre-exemple | 1C | Nombres | ⛔ résultat exigé | thème | 75/0 | Nombres et opérations : le calcul est la compétence |
| `demoalg` | Démontrer en algèbre | 1C | Nombres | ⛔ résultat exigé | thème | 54/0 ; expr 0/22 | Nombres et opérations : le calcul est la compétence |
| `implication` | Implication, réciproque, contraposée | 1C | Nombres | ⛔ résultat exigé | thème | 50/0 ; expr 0/6 | Nombres et opérations : le calcul est la compétence |
| `progcalc` | Programmes de calcul | FR | Fonctions/algèbre | ⛔ résultat exigé | exception | 54/0 ; expr 14/14 | programme de calcul : calculer est la compétence |
| `ratio` | Ratios et partage proportionnel | FR | Fonctions/algèbre | ✅ autorisé | thème | 0/69 | modélisation, lecture ; formes littérales contrôlées |
| `milieux` | Droite des milieux | FR | Espace | ✅ autorisé | thème | 0/48 | géométrie, trigonométrie : calcul d'outil |
| `structexpr` | Somme ou produit ? Termes, facteurs, opposé | FR | Fonctions/algèbre | ⛔ résultat exigé | exception | 11/0 ; expr 13/37 | structure d'une expression : calculer les termes |
| `motifs` | Suites de motifs | FR | Fonctions/algèbre | ✅ autorisé | thème | 0/37 ; expr 11/11 | modélisation, lecture ; formes littérales contrôlées |
| `automat` | Automatismes de calcul mental | FR | Nombres | ⛔ résultat exigé | thème | 48/0 | Nombres et opérations : le calcul est la compétence |
