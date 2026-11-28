# /contenu figures — élagage des figures superficielles (28.11)

Demande de l'enseignant (28.11, après « Calcule : 2 + 4 · 4 » illustré par des blocs, retiré par ec6961b) : « il faut
éliminer toutes ces illustrations superficielles ». Règle : une figure SEULEMENT si elle apporte une information spatiale
ou visuelle nécessaire. Dans une QUESTION, la figure ne fait jamais le travail ; dans une LEÇON, elle peut expliquer.

## Méthode

Sonde non commitée `tests/_elag_fig.html#60` : chaque notion (toutes classes et systèmes) × niveau 1–4 × 60 graines,
`Engine.fromCode`, type de figure lu dans l'`aria-label`. Avant : 421 couples notion × niveau × type de figure
(10'165 tirages avec figure sur 60 graines) ; après : 364 (8'707). Lecture des sources pour chaque type douteux
(`tests/_elag_code.html#code1,code2` : énoncé + étiquettes de la figure).

## Retiré (premier lot : 57 couples notion × niveau × figure ; 128 sites `fig:` dans 17 fichiers ; deuxième lot ci-dessous)

| Type | Notions (exemple de code) | Raison |
|---|---|---|
| Balance | eq1 1 (eq1-1-1), eq2 / eq3 / eq2disc (générateurs) | calcul pur ; une balance pour « x² + bx + c = 0 » n'a pas de sens |
| Objets alignés | prop 1–2 (prop-1-2), decprob 1–2 | redit l'énoncé (« 2 cahiers → 4 CHF ») |
| Barre de pourcentage | pct 1, 2, 4 (pct-1-2), défi pct | calcul pur, répète les nombres |
| Trajet (véhicule + route) | vitesse 1, 3, 4 (vitesse-1-1), ch11_prop | décoratif, redit l'énoncé |
| Agrandissement « ×k » | echelle 1–4, agrand 1, simil 2, thales (aire) | redit le rapport ; donne la méthode (k², k³) |
| Diagramme en bâtons | diagr 1, 3 (diagr-1-5), stats (moyenne, médiane, écart-type), notes | barres qui répètent les nombres de l'énoncé |
| Secteur | diagr 2, statfreq 3 (angle, %) | dessiné à l'angle cherché (donne la réponse) ou redit l'énoncé |
| Urne | proba 1–3, proba6 1, 3 (proba-1-3) | redit les effectifs de l'énoncé |
| Carré d'aire / pavé | rac 2 (√256), uaire 1, uvol 2 (conversions), gquot 1 (cube de verre) | calcul pur, décor |
| Blocs, échelle de 10ⁿ, barres de fractions, tuiles algébriques | puiss, sci, fracadd/fracmul, distrib/idrem/factor (générateurs) | calcul pur ; tuiles = méthode |
| Mise en équation | probeq2 1–2 (rectangle « x / x + 6 », cadre « 12 + 2x », triangle « x / x + 7 ») | la figure fait la mise en équation (décision du 28.11) |
| Paraboles / hyperboles d'illustration | f2 1–2, fimg 2, inter 1–2, ineq2 1, 3, interpar 2, homog 1–3, racinv 1–3, expo 1, 3, log 2, 4 | calcul ; la courbe donne zéros, intersections, nombre de solutions ou asymptote |
| Tangente tracée sur quadrillage | tangente 1–2 (tangente-1-d) | la droite dessinée donne l'équation demandée |
| Courbe sinus | trigfn 1 (extremum, position du max) | la courbe donne la réponse |
| Cercle trigonométrique | trigcercle 1 (conversion °→rad), trigeq 1 (sin x = …, cos x = … : l'angle-solution était dessiné) | calcul pur / donne la réponse |
| Triangle 5-12-? | trigrel 2–3 (tan α = 5/12 → cos α) | donne la méthode |
| Cercle C(a ; b), r | cercle 1 (lire centre et rayon dans l'équation) | décor |
| Droite graduée | valnum (3x + 2 pour x = …), absval 1 (\|x − a\| = b) | calcul pur |

Fonctions supprimées de `src/figures.js` (plus aucune référence, ni leçon ni galerie) : `balance`, `items`, `blocks`,
`sciScale`, `road` (+ `vehicle`), `barChart`. Gardées car encore utilisées par des leçons : `percentBar`, `fractionBars`,
`scaling`, `numberLine`, `areaSquare`, `tiles`, `urn`, `sector`.

## Gardé (364 couples)

Géométrie plane et dans l'espace (figures du matin intactes : `tests/figs.html`, 38 formes obligatoires, ok), solides,
Thalès, Pythagore, angles, polygones, symétries / isométries / médiatrice, repères et lecture graphique quand l'énoncé
renvoie au graphique (« La courbe représente… », « Lis… », « On a tracé… »), aires entre courbes, motifs, empilements,
roues de loterie, arbres pondérés porteurs des données, droite graduée quand l'énoncé parle de la droite graduée
(reladd, relrep, p8droite, ineq1, symax, médiatrice), situations spatiales (horloge, façade, cadre, pavage, plongeuse).

## Décisions de l'enseignant sur les 11 cas « à décider » (28.11, appliquées)

Retirés (deuxième lot) :
1. Droite graduée sur « Calcule : (−1) + 7 » (rel 1 : generators, gen3, ch10_no « même signe / signes contraires »,
   ch11_no2 « addition ») — calcul pur ; la droite reste dans la leçon et dans les énoncés qui parlent de la droite
   graduée (reladd, relrep, ch10_no « droite »).
3. solides 1 « Combien de faces / arêtes / sommets un pavé droit possède-t-il ? » (pavé) — le dessin fait compter.
4. Arbres de choix de denombr 1 (menus, tenues, pizzas ; chemins, glaces) : aucun énoncé ne renvoie à l'arbre → retirés ;
   pas à pas « Compte les branches au bout de l'arbre » remplacé par « Chaque choix de la 1re étape se combine avec
   chaque choix de la 2e : on multiplie ».
5. polyreg 2 (polygone découpé en triangles) — `FIG.polyTri` supprimé (plus aucune référence). Le cube de racprop 4
   (d, D) est gardé.
7. fref 2 « Résous x² ≤ 9 » (fr_2nde, ctx carre-inf) — l'énoncé ne renvoie pas au graphique.

Gardés : 2. carré « aire → côté » (rac 1, exactes 1) ; 6. cercle trigo des valeurs exactes et angles associés ;
8. tableau de signes ; 9. repère gradué de sys3 ; 10. plongeuse ; 11. figures des leçons.

## Captures et tests

Captures 360 px (avant / après) : `tests/_shots/contenu/elagage/` (g1 : eq1, prop, pct, vitesse ; g2 : diagr, proba,
echelle, probeq2 ; g3 : f2, trigeq, homog, tangente ; g4_gardees : thales, volcomp, rel, exactes). Galerie relancée
(725 figures). Pages : syntaxe ok, figs (38 formes obligatoires) ok, figs_noms, figs_nombres, figsample, gallery,
figs_lecons, ch11, inventaire, primaire, frcollege, fr2nde ok. Aucune page de test n'exigeait une figure retirée.
