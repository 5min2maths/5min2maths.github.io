# /contenu figures — élagage des figures superficielles (28.11)

Demande de l'enseignant (28.11, après « Calcule : 2 + 4 · 4 » illustré par des blocs, retiré par ec6961b) : « il faut
éliminer toutes ces illustrations superficielles ». Règle : une figure SEULEMENT si elle apporte une information spatiale
ou visuelle nécessaire. Dans une QUESTION, la figure ne fait jamais le travail ; dans une LEÇON, elle peut expliquer.

## Méthode

Sonde non commitée `tests/_elag_fig.html#60` : chaque notion (toutes classes et systèmes) × niveau 1–4 × 60 graines,
`Engine.fromCode`, type de figure lu dans l'`aria-label`. Avant : 421 couples notion × niveau × type de figure
(10'165 tirages avec figure sur 60 graines) ; après : 364 (8'707). Lecture des sources pour chaque type douteux
(`tests/_elag_code.html#code1,code2` : énoncé + étiquettes de la figure).

## Retiré (57 couples notion × niveau × figure ; 128 sites `fig:` dans 17 fichiers)

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

## À décider (gardées pour l'instant)

1. Droite graduée sur « Calcule : (−1) + 7 » (rel 1, ch10_no « même signe / signes contraires », ch11_no2 addition) :
   exception « relatifs » ; la droite ne montre que le point de départ.
2. Carré « aire 169 cm², côté = ? » (rac 1 jardin / carrelage / terrain ; exactes 1 « cote-aire », forme obligatoire
   de `tests/figs.html` validée le matin) : figure qui redit l'énoncé, mais objet géométrique.
3. solides 1 « Combien de faces un pavé droit possède-t-il ? » : le dessin permet de compter (donne presque la réponse).
4. Arbres de choix (denombr 1–2, `tree` de ch11_proba : « pantalons, t-shirts… ») : méthode du chapitre ; le pas à pas
   dit « compte les branches au bout de l'arbre ».
5. polyreg 2 (découpage en triangles) et racprop 4 (cube d, D) : demandés par l'enseignant le 28.11, mais le découpage
   fait le raisonnement.
6. Cercle trigonométrique pour les valeurs exactes (trigcercle 2 « sin 60° », ch_mp2 « -exact », coordonnées) et
   angles associés (`GF.assoc`, gen3 sin(180° − α)) : outil du chapitre, mais il montre la méthode.
7. fref 2 « Résous x² ≤ 9 » (France 2nde) : parabole + droite y = 9 ; résolution graphique attendue au programme,
   mais l'énoncé ne renvoie pas au graphique.
8. tabsignes 2–3 : tableau de signes à compléter (cadre de la méthode).
9. sys3 3 / parabole par trois points ou sommet + point (gen2, ch1c_sys) : repère gradué qui redit les points.
10. Plongeuse (generators, défi f2) : esquisse de la trajectoire, situation à se représenter.
11. Leçons (Retiens, `LESSON_FIGS`) : prioSteps (priorités), fractionBars, percentBar, scaling, numberLine — explicatives,
    gardées.

## Captures et tests

Captures 360 px (avant / après) : `tests/_shots/contenu/elagage/` (g1 : eq1, prop, pct, vitesse ; g2 : diagr, proba,
echelle, probeq2 ; g3 : f2, trigeq, homog, tangente ; g4_gardees : thales, volcomp, rel, exactes). Galerie relancée
(725 figures). Pages : syntaxe ok, figs (38 formes obligatoires) ok, figs_noms, figs_nombres, figsample, gallery,
figs_lecons, ch11, inventaire, primaire, frcollege, fr2nde ok. Aucune page de test n'exigeait une figure retirée.
