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

## 2e lot (24.11) : 43 notions de plus

Même standard (valeurs tirées, 2 à 4 parts enchaînées, 2 indices, corrigé complet). Nombres : `D`, `nb` (TeX) et
`T` (texte) de `src/defis.js` mettent désormais l'apostrophe des milliers dès 1'000 (avant : « 7500 CHF » dans
`croissexp`, `pctvar`… car le `nb()` global ne groupe qu'à partir de 10'000).

| Notion | Avant | Après |
|---|---|---|
| f2expr (1re, MP) | sommet (1 ; −4) fixe | arche de pont : choisir le repère, a (fraction), hauteur au-dessus d'un camion, distance pour une hauteur ; sommet + point → a, zéros, f(0) |
| f2trois (1re, MP) | points d'abscisses 0, ±1 fixes | trois points SANS abscisse 0 (système 3 × 3) puis ordonnée du sommet ; pierre lancée d'une falaise : 3 mesures → falaise, instant d'arrivée, hauteur max |
| fimg (1re, MP) | `x² − 2x − 3` fixe | préimages d'une valeur, f(f(x₀)), nombre à une seule préimage (sommet), nombre d'entiers d'image < v |
| lectgraph (1re, MP) | texte, sommet fixe | **figure** (parabole + droite) : a lu sur le quadrillage, f(10) hors du dessin, f = g, f < g (intervalle) |
| interpar (1re) | `x² − 4` et `−x² + 2x` fixes | intersections, écart vertical maximal, décalage t pour un seul point commun |
| eqirr (1re) | traces de freinage | √(x + a) = x − b : solution parasite, puis √(x + a) = b − x (c'est l'autre qui convient) |
| sys3 (1re, MP) | économies A, B, C fixes | cinéma (3 groupes, prix au demi-franc) ; nombre de trois chiffres (somme, relation, chiffres inversés) |
| trigeq (2e, MP) | 2 sin x = 1 | 2e degré en sin x ou cos x (une valeur parfois impossible) ; 2cos²x + K sin x + m = 0 avec sin² + cos² = 1 |
| trigeq2 (2e, MP) | marée fixe | grande roue (ω, hauteur, premier passage, durée au-dessus d'une hauteur) ; marée : d, A, durée navigable, heure de sortie |
| derivregles (3e) | `x³ − 6x² + 9x + 1` | tangentes parallèles à y = mx, ordonnée de la tangente, plus petite pente (sommet de f') |
| derivcomp (3e) | `(x² − 3)⁴` | √(ax + b) : f'(x₀), tangente, point de pente donnée |
| derivprodquot (3e) | `(2x + 1)/(x − 1)` | (x² + c)/(x − p) : extremums, max local < min local ; concentration at/(t² + b²) : max, durée d'efficacité |
| derivref (3e) | `2√x + x³` | bénéfice a√x − bx : budget optimal, maximum, B'(n²), zéro non nul |
| tangente (3e) | x² − 4x + 5 en 3 | tangente puis triangle avec les axes ; deux tangentes issues d'un point (contacts, pente, angle) |
| variations (3e) | `x³ − 3x² − 9x + 2` | extremums d'une cubique (a = ±1), nombre d'entiers k avec 3 solutions |
| nbderive (3e) | x² − 3x en 2 | quotient de Newton : Q(h), limite, h pour Q(h) donné ; idem pour k/x |
| tauxvar (3e) | 2t² + 5t | vitesse moyenne, instant où la vitesse instantanée l'égale (milieu), T pour une vitesse moyenne donnée |
| integrale (4e) | débit fixe | débit kt(T − t) : volume, débit moyen, instant où débit = moyenne ; freinage : durée, distance, décélération |
| primitives (4e) | ballon fixe | accélération → vitesse → position, vitesse minimale |
| aireint (4e) | 4 − x² et x + 2 | aire entre R² − x² et une corde, pourcentage de l'aire sous la parabole |
| volrev (4e) | verre √(2x) fixe | verre √(kx) : contenance, hauteur pour un volume, hauteur à moitié plein (H/√2) |
| eqabs (MP 3e) | \|2x − 3\| = 7 | \|ax + b\| = cx + d : condition, solution parfois rejetée ; somme de distances \|x − p\| + \|x − q\| = L |
| logprop (MP 3e) | log 2 ≈ 0,301 | somme de log₂ à simplifier ; 2 log x − log(x − a) = log b avec domaine |
| logdef (MP 3e) | log₂ 32… | décibels (N machines, nombre pour un niveau) ; pH (dilution, comparaison) |
| eqbic (MP 3e) | x⁴ − 10x² + 9 | écran : diagonale + aire → équation bicarrée, côtés, périmètre |
| eqirrmp (MP 3e) | √(x + 7) = x + 1 | √(2x + a) = 1 + √(x + b) : deux élévations au carré, vérification |
| eqratmp (MP 3e) | 5/(x + 2) + 4/(x − 1) = 0 | deux robinets (temps ensemble, écart) : équation rationnelle, fraction remplie |
| puisrat (MP 3e) | 27^(2/3), 16^(−3/4) | 4^(x + a) = 8^(x − b) (même base), Kepler T = a^(3/2) et a = T^(2/3) |
| vectmp (MP 4e) | u, v fixes | parallélogramme : D, centre, diagonale, colinéarité |
| droiteparam (MP 4e) | A(2 ; −1), B(5 ; 3) | deux droites paramétriques : t, intersection, angle |
| sinusmp (MP 4e) | −2 °C / 24 °C | température : A, T(x) au dixième, durée au-dessus d'un seuil |
| explogfn (MP 4e) | (0 ; 3), (2 ; 12) | a · bˣ par deux points sans abscisse 0, puis f(x) = Y (log) |
| ineqmp (MP 4e) | (2x − 1)/(x + 3) ≥ 0 | (ax + b)/(x − p) ≥ k : tout d'un côté, zéro, ensemble des solutions (intervalles) |
| thalesrec (11e) | étagère 30/75/32/80 | étagère pas parallèle : rapports, AE corrigée, déplacement ; triangle coupé : vérifier, DE, périmètre du trapèze |
| volcone (11e) | cône = cylindre fixe | cornet (cône + demi-boule) et cône équivalent ; boule fondue en cônes |
| volmanq (11e) | verre 20 cL fixe | conserve : hauteur, étiquette (2V ÷ r) ; verre conique : rayon, volume à mi-hauteur (÷ 8), hauteur pour la moitié (∛) |
| simil (11e) | photo 10 × 15 | photo : rapport, longueur, prix ∝ aire ; maquette 1 : n : longueur, aire, volume réels |
| sys2 (11e, MP) | droite par A et B | billets (système, nouveau prix) ; rectangle dont l'aire ne change pas |
| formule (11e, MP) | Fahrenheit (c = −40 toujours) | IMC (calculer, isoler m, isoler t avec √) ; énergie cinétique (isoler v, isoler m) |
| racprop (11e) | carré de 50 cm² | carré d'aire a²k : côté, diagonale, périmètre exacts ; triangle à cathètes p√s, q√s : hypoténuse, aire, hauteur |
| denombr (11e) | club de 10 | codes (total, sans répétition, au moins une) ; club : bureau, poignées, et l'inverse (n(n − 1)/2 = P) |
| cercthales (11e, MP) | P à 13 cm, r = 5 | tangentes : PT, aire, corde TT' ; triangle dans un demi-cercle : côté, aire, hauteur |
| angles (11e, MP) | inscrit 35° fixe | polygone régulier : n, somme, angle entre diagonales voisines (180°/n) ; inscrit / au centre / quadrilatère inscrit |

`factor` v2 (11e) : la part « combien d'entiers avec E(x) > 0 » (tableau de signes à trois facteurs, hors programme
de 11e) est remplacée par un paramètre : pour quel c l'équation n'a plus que deux solutions (c = m²p²).

## 3e lot (24.11 soir) : 57 notions de plus

Même standard. Toutes à valeurs tirées ; parts vérifiées par `tools/audit_defis.py`.

| Notion | Avant | Après |
|---|---|---|
| ineq (1re) | rectangle x / x + 7, 60 cm fixe | rectangle : largeur max (décimale), nombre de largeurs entières, aire max ; location de vélo : seuil où B est moins chère, budget, durées qui vérifient les deux |
| ineqfrac (1re) | (x − 2)/(x + 3) fixe | 1/(x − a) ≥ 1/(x − b) (piège : pas de produit en croix ; numérateur constant, intervalles) ; coût moyen (F + cn)/n ≤ t : nombre minimal de pièces, deux seuils |
| exactes (1re) | carré de côté 4 fixe | cube : diagonale de face a√2, diagonale a√3, section a²√2 ; hexagone régulier : distance entre côtés, aire, disque inscrit |
| modaff (1re) | fitness fixe | trois offres (unité, carte, illimité) : égalité A = B, seuil C < B, nombre d'entrées où B est la moins chère |
| affzero (1re) | club 60/5/9 et 3x − 7 fixes | deux bougies : même hauteur, hauteur commune, écart des extinctions ; f et g affines : zéro fractionnaire, intersection, entiers où f > 0 et g > 0 |
| quartiles (MP 2e) | série triée fixe | série de 11 valeurs NON triée : médiane, EIQ, nombre de valeurs extrêmes, médiane sans la valeur aberrante (10 valeurs) |
| statfreq (MP 2e) | sondage fixe | fréquence, angle, puis équation (c + x)/(n + x) = p % |
| trigcercle (MP 2e) | 150° fixe | θ tiré : kπ/d, cos θ exact, autre angle de même sinus, de même cosinus |
| trigassoc (MP 2e) | sin α = 0,6, aigu | sin α = p/h (triplets), quadrant 2–4 : cos α, tan α, sin(180° + α) + cos(180° − α) |
| trigfn (MP 2e) | 3 sin(2x) + 1 | A sin(bx) + d : période, deux premières solutions de f(x) = d + A/2, nombre de solutions sur [0° ; 360°[ |
| normale (4e) | 500 g / 5 g fixe | P(μ − k₁σ ≤ X ≤ μ + k₂σ), nombre de paquets au-dessus d'un seuil, nouvelle moyenne pour 2,5 % sous un seuil |
| binomiale (4e) | 12 billets / 0,8 fixe | n billets, n − 2 places, p tiré : E(X), P(X = n), risque de surréservation (deux termes) |
| matrices (4e) | 2x + y = 7 fixe | système tiré : det, x et y par Cramer, paramètre m qui annule le déterminant |
| optimderiv (3e) | feuille 30 × 30 | feuille rectangulaire a × b (x entier) puis feuille carrée de même périmètre ; boîte de conserve de volume V : r, h = 2r, surface |
| fctmp (MP 4e) | f = 2x + 3, g = x² | (f ∘ g)(x₀), f⁻¹(y₀) fractionnaire, (g ∘ f)(x) = K (deux solutions) |
| fratmp (MP 4e) | (2x − 6)/(x + 4) | zéro fractionnaire, f(x) = k, entiers où f(x) > a (f − a = constante ÷ dénominateur) |
| projmp (MP 4e) | u = (4 ; 7), v = (3 ; 4) | triangle ABC : AB · AC, AH, distance CH à (AB), aire |
| posdroites (MP 4e) | d, g fixes | droites tirées : t, s, m pour qu'elles soient sécantes, cote du point commun |
| coordmp (MP) | A(1 ; 2), B(4 ; 6) | triangle rectangle (réciproque de Pythagore), centre du cercle circonscrit, aire |
| volmp (MP 3e) | silo 3 m / 8 m / 4 m | silo tiré : volume, hauteur du grain, gain si demi-boule au lieu du cône |
| similmp (MP 3e) | verre 12 cm / 0,3 L | verre conique tiré : volume à une hauteur, nombre de verres avec 1 L, hauteur à moitié plein (∛0,5) |
| euclide (1re) | 9 / 16 cm fixe | hauteur + une projection → autre projection, cathète, périmètre ; cathète + projection → hypoténuse, hauteur, autre cathète (triplets agrandis) |
| geocomb (1re) | tente 2,5 / 4 / 3 m | tente tirée (triplets × 0,2 à 0,3 m) : hauteur, volume, surface de toile |
| droitesrem (1re) | 6 / 8 cm fixe | triangle rectangle tiré : rayon circonscrit, distance de C au centre de gravité (c/3), hauteur |
| droitesinter (MP 2e) | 20 + 1,50/km fixe | agence A donnée par deux courses (pente, ordonnée), agence B : km et prix communs |
| recipaff (MP 2e) | 0,5x + 12 fixe | forfait par deux factures, f⁻¹(y₀), intersection des graphes de f et f⁻¹ (sur y = x) |
| condbayes (4e) | détecteur fixe | dépistage : P(+), P(M \| +), puis après un second test positif |
| varalea (4e) | jeu à deux pièces fixe | dé : P(G > 0), E(G), somme pour un 6 qui rend le jeu équitable |
| angtri (1re) | pentagone fixe | polygone régulier tiré : angle intérieur, angle BAC, angle entre les diagonales AC et BD (360°/n) |
| carres (11e) | 196 dalles fixe | n² dalles tirées : côté, aire, dalles à ajouter pour agrandir |
| decdiv (10e) | repas 67,60 fixe | repas tiré : part, part sans boisson, nombre de boissons (quotient non entier) |
| decmul (10e) | 4,5 × 3,2 fixe | pièce et prix tirés : aire, prix, prix avec 10 % de chutes |
| decadd (10e) | Mia 50 CHF fixe | budget, achats et jeu tirés |
| reladd (10e) | randonnée fixe | 4 étapes tirées : point le plus haut, altitude finale, dénivelé positif, variation |
| rel (11e) | −6 / 9 / −11 fixe | températures tirées : hausse, minuit, moyenne (fraction), écart |
| fracops (11e) | 1/2 − 3/4 · 2/3 fixe | A = a/b − c/d · e/f et B = (a/b − c/d) · e/f tirés, A − B |
| puiss (11e) | pliages 0,1 mm fixe | pliages : épaisseur tirée, pliages pour dépasser une porte / le Jet d'eau / la tour Eiffel / le Cervin ; 2ᵃ · 4ᵇ ÷ 8ᶜ = 2ᵐ et 9ᵖ · 27ᵠ ÷ 3ʳ = 3ⁿ |
| sci (11e) | hydrogène, rayon terrestre | distance d'une planète : exposant en m, durée du trajet de la lumière (s, min) |
| divcrit (1re) | 74■■ fixe | ab■■ tiré : nombres divisibles par 45 (combien, le plus grand), par 36 |
| racenc (1re) | √70 fixe | √n tiré : entier inférieur, valeur au dixième par encadrement, entiers m avec k < √m < k + g |
| tradexpr (1re) | x = 4 fixe | x tiré (négatif possible) : double de la somme, somme du double, carré de la différence, différence des carrés |
| croissance (4e) | 400 · e^(0,25t) fixe | N₀ et k tirés : doublement, N(t₁), instant où N dépasse un seuil (ln) |
| lnexp (4e) | x − 2 ln x fixe | bx − a ln x : f'(x₁), minimum (abscisse, valeur), ordonnée à l'origine de la tangente en 1 |
| vabs (MP 1re) | A = −3, B = 5 fixe | distance, milieu (forme \|x − m\| ≤ r), entiers avec c < \|x − m\| ≤ r (deux morceaux) |
| pvectmp (MP 4e) | u, v fixes | u × v (1re et 3e composantes), aire du triangle, volume (produit mixte) |
| domaine (1re) | √(x + 3)/(x − 2) fixe | √(x + a) ÷ trinôme : borne de la racine, valeurs interdites qui comptent, entiers du domaine |
| ensembles (1re) | [−4 ; 6[ et ]1 ; 10] fixes | intervalles tirés : entiers de A, A ∩ B, A ∪ B, A \ B |
| tabval (11e) | bougie, x² − 4x fixes | x² − sx + c : image d'un négatif, autre antécédent (symétrie), plus petite image |
| monomes (11e) | cube 3x | pavé ax, bx, cx : volume kx³, aire kx², valeur, effet du doublement |
| reduire (11e) | x, 2x + 1, 3x − 2 | côtés tirés : périmètre réduit, x pour un périmètre, x pour deux côtés égaux |
| valnum (11e) | v²/200, v = 40/50/60 | v²/k tiré : distance, effet d'un facteur m sur la vitesse, vitesse pour une distance donnée |
| morceaux (1re) | parking 4 / 2,50 / 20 fixe | parking tiré : prix pour t h, heure du maximum, heures pour un budget |
| transf (1re) | (x − 3)² − 5 fixe | gestes décrits en mots (décalages, facteur a, retournement) → sommet, plus grand zéro, g(0) |
| racinv (1re) | 12/x et x + 1 fixes | P/x et x + c tirés : image fractionnaire, préimage, intersections |
| fracrat (MP 1re) | (x² − 9)/(x² + 3x) fixe | (x² − a²)/(x² + ax) : valeurs interdites, F(x₁), F(x) = k |
| eqparam (MP 1re) | x² − 6x + m fixe | x² − 2sx + m : m pour une solution, plus grand m entier pour deux, m pour qu'un t soit solution, autre solution |
| valint (MP 1re) | 1/(x² − 4x) fixe | 1/trinôme tiré : valeurs interdites, f(x₀), entiers où f < 0 |

## Ce qui reste (valeurs fixes, à reprendre)

Environ 8 notions gardent un défi à valeurs fixes :
`translin`, `absval`, MP `ratden`, et 9e–10e
(`ordgr`), plus `algopy`, `proba2`, `probcond`, `tauxevol`,
`vect3e` (sans classe). Liste à jour : relancer `tools/audit_defis.py`.

## À contrôler

- `factor2`, `polymp` (1re–4e, MP 4e) : « combien d'entiers vérifient E(x) > 0 » demande un tableau de signes à trois
  facteurs (au programme dès la 1re Collège ?).
- `trigexact`, `racprop` : réponses exactes « 6√3 » (le clavier propose √) ; décimal accepté pour `racprop`.
- `triaire` c), `sinlaw` c), `trigeq2`, `sinusmp`, `volmanq` : l'arrondi des étapes intermédiaires peut décaler la
  dernière décimale ; les indices demandent les valeurs non arrondies.
- `stats` : notes au demi-point, note visée entre 3,5 et 6.
- `lectgraph` : figure tracée par `FIG.plot` (repère −6 à 6) ; vérifier la lisibilité du sommet et des intersections.
- `eqabs` v1 : la part a) demande la borne de la condition (« x ≥ … » ou « x ≤ … » selon le signe de c).
- `ineqmp` : réponse en intervalles (`solset`), comme au niveau 3.
- `trigeq` : solutions en degrés sur [0° ; 360°[ (programme MP en degrés ? sinon passer en radians).
- `thalesrec` v1 : rapport AE ÷ AC au centième ; avec un décalage de 1 cm sur 120 cm, les deux rapports diffèrent de
  moins d'un centième seulement dans de rares cas (r = 0,25 : 0,25 et 0,26).
- 3e lot : `trigcercle` a) demande k dans kπ/6 même quand la fraction se simplifie (300° = 10π/6) ; `trigassoc`,
  `exactes` : réponses exactes (fractions, √) ; `quartiles` : convention Q1 = 3e valeur, Q3 = 9e (comme le niveau 3) ;
  `binomiale` c) et `optimderiv` (boîte de conserve) : arrondis au dixième à partir des valeurs non arrondies ;
  `posdroites` : coordonnées parfois grandes (jusqu'à ± 30) ; `condbayes` c) et `recipaff` c) (intersection de f et
  f⁻¹, parfois négative, hors contexte) : exigeants, à juger ; montants en CHF affichés avec deux décimales (`CHF`).
