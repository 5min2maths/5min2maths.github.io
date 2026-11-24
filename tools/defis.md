# Défis (niveau 4, « Problème de la semaine ») — audit et réécriture du 24.11

Demande : en 4e Collège, le problème de la semaine était « une factorisation au maximum vraiment simple »
(`factor2` : toujours `f(x) = 2x³ − 18x`, plus facile que le niveau 3 `x⁴ − 1`).

## Audit

Outil : `nice python3 tools/audit_defis.py [n] [ids]` (génère `tests/_defis.html`, non commité, avec les scripts de
`build.py`) → `suivi/robot/defis.txt` : pour chaque notion à défi, une question de niveau 3 pour comparer, puis
n problèmes tirés (énoncé, parts, réponses, corrigé).

Constat sur les 173 notions à défi :

- **la grande majorité avait des valeurs fixes** : le même énoncé à chaque tirage, et « Refaire avec d'autres
  valeurs » redonnait exactement le même problème (environ 130 notions sur 173) ;
- beaucoup étaient **plus faciles que le niveau 3** : parts = lectures ou calculs directs (« discriminant », « abscisse
  du sommet », « P(2) », « u · v »), drill déguisé en problème ;
- vrais défis déjà présents : `eq2disc`, `expo`, `log`, `cart`, `euclide`, `eq3`, `bicarre`, `vitesse`, `ucomp`,
  `gquot`, les problèmes de géométrie 11e (`thales`, `volcomp`…), `binomiale`, `condbayes`, `optimderiv`.

## Notions réécrites (27) : avant → après

Fichier `src/defis.js` (chargé après les fichiers de chapitre : il remplace leur niveau 4 pour ces notions). Toutes
les valeurs sont tirées au hasard, 2 à 4 parts qui s'enchaînent, 2 indices (outil, puis calcul), corrigé complet.

| Notion | Avant | Après |
|---|---|---|
| factor (11e, MP 1re) | calcul mental 56² − 44², 98 · 102, 29² | (1) `(2x − 7)² − 25` : k de la forme factorisée au maximum (piège : un seul 2 mis en évidence), solutions, nombre d'entiers avec E(x) < 0 ; (2) `4x²(x − 3) − 25(x − 3)` : 3 solutions (fractions), signe sur [−10 ; 10] |
| factor2 (1re–4e Collège) | `2x³ − 18x` fixe (coef, nombre de facteurs, plus grand zéro) | (1) `x³ − px² − q²x + pq²` : groupement + identité, solutions, signe ; (2) `kx³ + … ` avec k négatif possible : mise en évidence + somme-produit, solutions, signe (le signe de k compte) |
| eq2 (11e) | `(x + 5)(x + 1)(x − 1) = 0` (lecture) | rectangle (longueur = largeur + k, aire donnée) → largeur, périmètre, diagonale ; carré modifié (+a, −b, aire du rectangle) → côté, variation d'aire |
| eq2fact (11e) | bille 45 m fixe | chute : sol, mi-hauteur (√), durée de la seconde moitié ; lancer vers le haut : durée du vol, deux instants à une hauteur donnée, hauteur max |
| idrem (11e) | (n + 1)² − n² | (n + k)² − (n − k)² = 4kn, puis calcul astucieux et équation ; carré → rectangle (x + k)(x − k) : perte d'aire, côté, périmètre |
| polyop (1re) | (x + 3)², valeurs fixes | réduire A(x) = (x + a)² − (x − b)(x + b) puis résoudre A(x) = T ; différence d'aires de deux rectangles puis équation |
| trinfact (1re) | `2x² − 2x − 12` fixe | bénéfice B(x) = −k(x − p)(x − q) développé : seuils de rentabilité, production optimale, bénéfice max |
| f2 (1re) | `−x² + 4x + 5` fixe | recette R(p) = p(a − bp) : prix optimal, recette max, deux prix pour une recette donnée ; enclos le long d'un mur : largeur optimale, aire max, deux largeurs pour une aire donnée |
| f2formes (1re) | `x² − 8x + 12` fixe | sommet par la forme canonique (a ≠ 1 possible), puis résoudre f(x) = m par la forme canonique |
| ineq2 (1re) | `x² − 2x − 8 ≤ 0` fixe | rectangle de périmètre donné, aire au moins A : intervalle des longueurs, aire max |
| pyth (10e, MP 1re) | écran 55 pouces, bateaux 12/16 km/h (fixes) | échelle qui glisse (deux triplets de même hypoténuse : descente du haut en cm) ; raccourci en diagonale (distance et temps gagnés) |
| trigo (1re) | cerf-volant fixe | deux angles d'élévation (équation en x) ; rampe : pente en %, longueur, angle |
| trigexact (1re) | hypoténuse 12, 30° fixe | triangle équilatéral : hauteur, aire, rayon du cercle inscrit en valeurs exactes |
| trigrel (1re) | sin α = 0,6, hypoténuse 15 | tan α = p/q et périmètre donné : sin α, hypoténuse, aire |
| sinlaw (2e) | a = 7, b = 8, γ = 60° | deux bateaux : cosinus (distance), sinus (angle), proportionnalité (instant où ils sont à D km) |
| triaire (2e) | 40 m, 30 m, 60° fixe | aire, troisième côté, hauteur relative au troisième côté |
| proba (11e) | deux dés (fixe), urne 5/3 (fixe) | urne : P(deux rouges), P(même couleur), P(au moins une verte) ; deux dés : « somme s OU double » (sans compter deux fois) |
| stats (4e, MP) | notes fixes | moyenne, médiane, note à obtenir à un test qui compte double |
| pctvar (10e, MP) | vélo 800 CHF fixe | hausse puis baisse : prix, variation globale, hausse nécessaire pour revenir au prix initial |
| affine (10e, MP) | bougie fixe | taxi : prix au km et prise en charge à partir de deux courses, km possibles avec un budget |
| droites (2e) | A(−1 ; 5), B(3 ; −3) fixe | pente, ordonnée, pied H de la perpendiculaire issue de C, distance CH |
| inter (1re) | `x² − 2x − 1` et `x + 3` fixes | droite tangente (Δ = 0) puis corde ; intersections puis longueur du segment |
| croissexp (MP 3e) | 5'000 CHF à 2 % fixe | valeur après n ans, années pour doubler, taux pour doubler en N ans |
| eqexp (MP 3e) | `4^x − 6 · 2^x + 8` fixe | changement de variable avec une solution parfois impossible (X < 0) ou non entière (log) |
| eqlog (MP 3e) | `log x + log(x − 3) = 1` fixe | base 2, domaine, solution rejetée, et comparaison avec log₂(x(x − a)) = n (2 solutions : pas équivalentes) |
| scalmp (MP 4e) | u = (2 ; 1), v = (1 ; 3) fixe | triangle ABC : produit scalaire, angle en A, aire |
| polymp (MP 4e) | `x³ − 7x + 6` fixe | zéro évident + Horner + trinôme, puis signe sur [−10 ; 10] |

## Ce qui reste (valeurs fixes, à reprendre)

Environ 100 notions gardent un défi à valeurs fixes, notamment : `f2expr`, `f2trois`, `fimg`, `lectgraph`,
`interpar`, `ineq`, `ineqfrac`, `eqirr`, `euclide`, `exactes`, `geocomb`, `droitesinter`, `modaff`, `affzero`,
`recipaff`, `trigassoc`, `trigcercle`, `trigeq`, `trigeq2`, `trigfn`, `sys3`, `quartiles`, `statfreq`, `varalea`,
`normale`, `matrices`, `translin`, dérivées (`derivregles`, `derivcomp`, `derivprodquot`, `derivref`, `tangente`,
`variations`, `nbderive`, `tauxvar`), intégrales (`integrale`, `primitives`, `aireint`, `volrev`), MP 3e–4e
(`eqabs`, `eqbic`, `eqirrmp`, `eqratmp`, `logdef`, `logprop`, `puisrat`, `fctmp`, `fratmp`, `ineqmp`, `sinusmp`,
`vectmp`, `projmp`, `pvectmp`, `posdroites`, `droiteparam`, `coordmp`, `explogfn`, `similmp`, `volmp`),
et la plupart des notions de 9e–10e. Liste complète : relancer `tools/audit_defis.py`.

## À contrôler

- `factor`, `factor2`, `polymp` : la part « combien d'entiers vérifient E(x) > 0 sur [−10 ; 10] » demande un tableau
  de signes à trois facteurs ; vérifier que c'est au programme de la classe (11e pour `factor` v2).
- `trigexact` : réponses exactes « 6√3 » (le clavier propose √) ; décimal refusé.
- `triaire` c) et `sinlaw` c) : l'arrondi des étapes intermédiaires peut décaler le dixième ; l'indice demande les
  valeurs non arrondies.
- `stats` : notes au demi-point, note visée entre 3,5 et 6.
