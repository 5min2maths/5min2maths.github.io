# Niveau réel de la 2e du Collège de Genève (grade 13) — audit du 24.11.2026

Agent niv2c (branche `agent/niv2c`). Règle de l'enseignant (24.11) : chaque question proposée en 2e doit correspondre à
un objectif du plan d'études de 2e ; niveaux 2–3 (et défi 4) à la difficulté d'une vraie épreuve de 2e ; niveau 1 =
automatismes de 2e, jamais ceux d'une année inférieure. Registre : `tools/niveau.json`.

## Sources (données, usage interne)

- Programme du Collège de Genève 2021, maths p. 80–84 : `~/DATA/Enseignement/Sources/Officiel/sism_college_geneve/programme_cdg_2021.txt`
  (2e MA1 et MA2 : **même programme**, texte commun « 2e MA1 et MA2 » ; MA2 = plus d'heures en 3e–4e seulement).
- PEC 2024 (CDIP), `Officiel/College_GE/` : cadre général (arithmétique-algèbre, analyse, géométrie, stochastique), pas de
  répartition par année.
- Épreuves regroupées de 2e, Collège Sismondi : **2MA1 du 11.12.2023** (90', polynômes, fractions rationnelles, vecteurs)
  et **2MA2 du 10.06.2024** (composition, bijection, log, exp, trigonométrie) — `sism_college_geneve/2023-2024_SISM_2_MA*_DF_*.pdf`.
- Brochure 2MA (Collège, G. Vorpe), `Libres/College Vorpe/2MA niveau 1-2 - BROCHURE - Complète.pdf` : polynômes, fractions
  rationnelles, vecteurs, droites et cercles, composition / bijection / réciproque, exponentielles et logarithmes.
- Manuel Sésamath Ma2 (chapitres de l'app), `Web/sesamath_matugym/fichiers/manuel-matugym-2e/` ; `tools/referentiels.py`.

## Objectifs et étalons par chapitre (chapitres Sésamath Ma2 de l'app)

Les étalons « 2MA1 Qn » / « 2MA2 Qn » renvoient aux épreuves ci-dessus ; les autres sont construits au même niveau.

### 1. Équations cartésiennes (géométrie cartésienne)
Plan : construire, reconnaître et utiliser des équations de droites (parallélisme, perpendicularité) et de cercles ;
intersections droites–cercles. (Vecteurs du plan : voir ch. 10.)
- E1.1 (2MA1 Q6) A(3 ; 2), B(1 ; 7), C(7 ; 5) : composantes de AB, AC, BC ; ABC isocèle en A ? rectangle en A ? aire de ABC ; D tel que ABCD soit un parallélogramme.
- E1.2 Équation de la perpendiculaire à 3x − 2y + 6 = 0 passant par P(4 ; −1) (forme réduite et cartésienne).
- E1.3 Centre et rayon de x² + y² − 6x + 4y − 12 = 0 ; intersection avec la droite x − y = 1.
- E1.4 Tangente au cercle x² + y² = 25 au point (3 ; −4) ; rayon du cercle de centre (−3 ; −4) tangent à 3x + 4y + 50 = 0.

### 2. Raisonner en géométrie (Sésamath Ma2 Ch2)
Sésamath : triangles isométriques (CCC, CAC, ACA), démonstrations (parallélogramme, droites remarquables, droite d'Euler).
**Absent du programme CdG de 2e** (l'argumentation et les droites remarquables sont en 1re). Aucune notion dans l'app.
- E2.1 Deux triangles avec AB = DE = 5, B̂ = 32°, D̂ = 112°, Ĉ = F̂ = 42° : isométriques ? quel cas ?
- E2.2 Démontrer que les diagonales d'un parallélogramme se coupent en leur milieu.
- E2.3 Dans un triangle, calculer la position du centre de gravité / de l'orthocentre (lien avec le ch. 1).

### 3. Fonctions polynomiales
Plan : polynômes — factoriser et diviser (division avec reste) ; étudier les fonctions polynomiales (factorisation, zéros,
tableau des signes, représentation graphique) ; inéquations à une inconnue (tableau des signes).
- E3.1 (2MA1 Q1) Division euclidienne de A(x) = −2x⁴ + x² − 3x + 1 par B(x) = x² − x ; A est-il divisible par x + 1 ?
- E3.2 (2MA1 Q2) Factoriser complètement P(x) = 8x⁴ + 2x³ − 29x² − 17x + 6 ; résoudre P(x) = 0.
- E3.3 (2MA1 Q3) P de degré 4 : 2 et −3 racines, divisible par x² + 1, P(−1) = −4.
- E3.4 Résoudre (x + 2)(3 − x)(x − 5)² ≤ 0 et x³ ≥ 4x² (tableau des signes).
- E3.5 (2MA1 Q8a) Le polynôme x⁶ + 1 est-il factorisable ?

### 4. Fonctions rationnelles
Plan : fractions rationnelles (simplifier, additionner, multiplier, diviser) ; équations rationnelles ; inéquations
(tableau des signes) ; fonctions homographiques (domaine, asymptotes, zéros, réciproque).
- E4.1 (2MA1 Q4) Résoudre 6/(x + 2) − (3x − 2)/(x + 1) = 5/(x² + 3x + 2) en précisant le domaine.
- E4.2 (2MA1 Q5) Résoudre (x + 2)(3 − x)/(x² − 3x − 10) ≤ 0.
- E4.3 f(x) = (2x + 1)/(x − 3) : domaine, asymptotes, zéro, réciproque.
- E4.4 Simplifier (x² − 4)/(x² + x − 6) · (x + 3)/(x + 2) ; écrire 1/(x − 1) − 2/(x² − 1) en une seule fraction.

### 5. Exponentielles
Plan : définir la fonction exponentielle ; puissances à exposant rationnel ; modèles de croissance.
- E5.1 (2MA2 Q3b) Résoudre 2^(3 − x) · 4^(2x + 1) = 1/16.
- E5.2 (2MA2 Q4) 10 Gtep en 2010, +5,6 %/an : consommation en 2017 ; année où l'on atteint 750 Gtep ; taux annuel pour
  n'atteindre ce seuil qu'en 2150 (au centième de %).
- E5.3 (2MA2 Q8b) Simplifier ⁴√(a⁵)·√(a³) / (∛(a⁷)·⁶√a) (a > 0), réponse avec une racine.

### 6. Composition et réciproque
Plan : composer, décomposer ; déterminer A et B pour qu'une fonction soit une bijection de A vers B ; calculer la
réciproque ; représenter f et f⁻¹ ; fonctions simples avec valeurs absolues.
- E6.1 (2MA2 Q1) f(x) = (4x − 3)/(x + 1), g(x) = x² + 2x − 4, h(x) = (3x − 1)/(x + 2) : f∘g et h∘f simplifiées avec domaine ; décomposer h.
- E6.2 (2MA2 Q2) f(x) = −x² + 2x + 2 : A et B les plus grands possibles pour une bijection ; réciproque et ensembles ; graphes.
- E6.3 (2MA2 Q8a) Une fonction polynomiale de ℝ dans ℝ est-elle toujours bijective ?
- E6.4 Résoudre |2x − 5| > 3 ; représenter f(x) = |x² − 4|.

### 7. Logarithmes
Plan : réciproque de l'exponentielle, propriétés, équations logarithmiques et exponentielles simples.
- E7.1 (2MA2 Q3a) Résoudre 2 log₃(2 − x) = log₃(x + 4) + 1.
- E7.2 (2MA2 Q8d) log_b(∛(b²)/b) (b > 0, b ≠ 1).
- E7.3 Résoudre 3^(x + 1) = 5^x ; au bout de combien d'années un capital à 2,5 % double-t-il ?

### 8. Trigonométrie du triangle quelconque
Plan : démonstration des théorèmes du sinus et du cosinus ; résoudre des triangles quelconques ; problèmes.
- E8.1 Résoudre le triangle a = 7, b = 9, γ = 52° ; cas ambigu a = 6, b = 8, α = 40°.
- E8.2 Distance entre deux bateaux (vitesses, angle des routes) ; hauteur d'un objet inaccessible avec deux visées.
- E8.3 Aire d'un triangle (½ab sin γ) ; aire d'un hexagone régulier.

### 9. Fonctions trigonométriques
Plan : sin, cos, tan à partir du cercle trigonométrique ; angles associés ; équations sin(f(x)) = constante ; graphes
(période, amplitude, zéros). **En radians** dans les épreuves.
- E9.1 (2MA2 Q5) Résoudre sin(3x − π/2) = sin(x + π/3) ; cos(2x − π/2) = cos(x − π) (solutions sur le cercle).
- E9.2 (2MA2 Q6) f(x) = −2 sin(x/4) : période, zéros, graphe sur [−4π ; 12π], g = f − 2.
- E9.3 (2MA2 Q7) Expression d'une sinusoïde lue sur un graphe ; préimages ; nombre de solutions de f(x) = 1 sur [7π ; 30π].
- E9.4 (2MA2 Q8c) sin(x²) = (sin x)² pour tout x ?

### 10. Géométrie vectorielle (2e chez pinkmaths et à Sismondi, épreuve de décembre)
- E10.1 (2MA1 Q7) u = (−3 ; 7), v = (6 ; 4) : y pour que a = (5 ; y) soit colinéaire à u ; angle entre u et v (au centième).
- E10.2 (2MA1 Q8b) ‖u + v‖ = ‖u‖ + ‖v‖ ? (vrai / faux, justifier).
- E10.3 Norme de 2u − 3v ; k pour que (2 ; 1) et (k ; 10) soient orthogonaux.

## Audit (sonde `tests/_niv2c.html`, profil CH grade 13 college, 3 tirages par niveau ; puis contrôle complet des
notions touchées avec `tests/college4.html#…`, 300 tirages par niveau)

Avant correction : 36 notions « de l'année » ; chapitre 2 (Raisonner en géométrie) vide ; deux notions de 1re comptées
comme notions de 2e (ineq, trigrel). Les générateurs de trigonométrie (trigcercle, trigfn, sinlaw, trigeq, trigassoc,
trigeq2, triaire) et de droites (droites, droitesinter) sont ceux du chantier MP 2e (`src/ch_mp2.js`, « méthodes
guidées, nombres simples »), partagés avec le Collège.

| Ch. | Notion | N1 | N2 | N3 | Verdict | Action |
|---|---|---|---|---|---|---|
| 1 | cart | au niveau (distance) | trop facile (milieu) | trop facile (droite par 2 points, 11e) | remonté | N1 = distance et milieu ; N2 = parallélogramme, symétrique, partage (E1.1e) ; N3 = aire par déterminant, point équidistant, angle droit (E1.1) |
| 1 | droites | trop facile (lecture graphique, 2 points : 11e) | au niveau | au niveau, sauf contextes « bougie », « taxi » (11e) | remonté (N1) | N1 = cartésienne → réduite, pente perpendiculaire, vecteur directeur |
| 1 | cercle | au niveau | au niveau | au niveau | au niveau | — |
| 1 | droitesinter | trop facile (droite horizontale) | trop facile (location de voiture, 11e) | au niveau (médiatrice, hauteur) | à valider | partagée avec MP 2e S1 : non modifiée |
| 1 | cercletan | au niveau | au niveau | au niveau | au niveau | — |
| 2 | (aucune) | — | — | — | à valider | chapitre Sésamath hors programme CdG de 2e : créer ou non ? |
| 3 | polydiv | au niveau | au niveau | au niveau | au niveau | manque la division par un diviseur de degré 2 avec reste (E3.1) |
| 3 | polyfact | au niveau | au niveau | au niveau (E3.2) | au niveau | — |
| 3 | polyexpr | au niveau | au niveau | trop facile (volume d'une boîte pour x donné) | remonté | N3 = polynôme sous conditions, forme développée (E3.3) |
| 3 | ineq | niveau 1re | niveau 1re | niveau 1re | retiré de l'année | reste en 1re (M1C05) ; en 2e : ineqpoly, ineqfrac |
| 3 | **ineqpoly** | — | — | — | nouvelle | inéquations polynomiales, tableau des signes (E3.4) |
| 4 | fracrat | en partie trop facile ((5x − 25)/5) | au niveau | au niveau | à valider | partagée avec MP 1re S1 |
| 4 | eqrat | automatisme 1re | au niveau | au niveau (E4.1) | au niveau | — |
| 4 | ineqfrac | au niveau | au niveau | au niveau (E4.2) | au niveau | — |
| 4 | homog, homogrec, valint, fracetage, probrat | au niveau | au niveau | au niveau | au niveau | — |
| 5 | expo | au niveau | au niveau | au niveau | au niveau | — |
| 5 | modexp | trop facile (−15 % sur 2 ans : 11e) | trop facile (triple toutes les 2 semaines) | trop facile (divisé par 32 = 5 périodes) | remonté | N1 = demi-vies, doublements ; N2 = intérêts composés, valeur initiale, taux global ; N3 = taux pour atteindre un seuil, taux mensuel, durée (E5.2) |
| 5 | expfrac | au niveau | au niveau | au niveau (E5.3) | au niveau | — |
| 6 | recip | automatisme | au niveau | trop facile (réciproque affine) | remonté | N2 = affine (ancien N3) et composée ; N3 = parabole restreinte (E6.2), racine, cube |
| 6 | compo | au niveau | au niveau | trop facile ((f∘g)(2) − (g∘f)(2)) | remonté | N3 = homographique ∘ affine, domaine de h∘f (E6.1), domaine avec racine |
| 6 | bijection, decomp | au niveau | au niveau | au niveau | au niveau | — |
| 6 | absval | en partie trop facile (f(−9)) | niveau 1re | niveau 1re | remonté (N3) | variantes N3 : inéquations |x − a| ≤ b, |kx − a| > b, |x − a| < |x − b| (E6.4) |
| 6 | morceaux | trop facile (taxi, abonnement) | niveau 1re | niveau 1re | à valider | notion de 1re reprise en 2e (pinkmaths) |
| 7 | log, logbase | au niveau | au niveau | au niveau | au niveau | — |
| 8 | sinlaw, triaire | au niveau | au niveau | au niveau | au niveau | — |
| 9 | trigrel | niveau 1re (angle aigu) | niveau 1re | niveau 1re | retiré de l'année | reste en 1re (M1C10) ; en 2e : trigassoc |
| 9 | trigcercle, trigassoc, trigeq2 | au niveau | au niveau | au niveau | au niveau | degrés surtout (épreuves en radians) |
| 9 | trigfn | au niveau | au niveau | un peu facile (max et min → d) | à valider | radians, zéros, nombre de solutions (E9.2, E9.3) manquent |
| 9 | trigeq | au niveau | au niveau | trop facile (= N2) | remonté (variantes) | N3 + sin(kx) = c, sin(3x + b) = sin(x + c) (E9.1, en degrés) ; partagée avec MP 2e S2 |
| 10 | vecteurs | au niveau | au niveau | trop facile (produit scalaire seul) | remonté | N2 = combinaisons et produit scalaire ; N3 = angle, colinéarité, norme d'une combinaison (E10.1) |

Après correction : tous les chapitres de 2e ont au moins une notion de 2e ; aucun chapitre n'est réduit à des notions
d'années inférieures (le chapitre 2 reste vide, voir ci-dessous).

## Points à faire valider par l'enseignant

1. **Chapitre 2 « Raisonner en géométrie »** : hors programme CdG de 2e (Sésamath seulement) ; une app à réponses
   numériques se prête mal à la démonstration. Le laisser vide, ou créer une notion « triangles isométriques » (cas
   d'isométrie, calculs justifiés) ?
2. **Trigonométrie en radians** : les épreuves de 2e sont en radians (π) ; l'app travaille surtout en degrés (générateurs
   du chantier MP 2e). Passer les niveaux 2–3 de trigeq, trigfn en radians pour le Collège ?
3. **Générateurs partagés avec la MP** (droites, droitesinter, trigeq, trigfn… dans `ch_mp2.js`) : un générateur ne
   connaît pas la classe de l'élève. Les formes ajoutées à trigeq N3 sont aussi tirées en MP 2e (S2) ; droitesinter N1–N2
   restent au niveau 11e pour le Collège. Faut-il séparer les générateurs Collège / MP ?
4. **ineq et trigrel** ne sont plus « de l'année » en 2e (restent en 1re, et en révision via le parcours de l'élève).
5. **morceaux, absval** (notions de 1re reprises en 2e) : garder en 2e ?
6. **France** : cart (2nde), recip (1re), compo et modexp (lycée) utilisent les mêmes générateurs ; les nouveaux niveaux
   y restent au programme, mais à vérifier.
7. Restent à faire : division par un polynôme de degré 2 avec reste (polydiv, E3.1), trigfn en radians (E9.2–E9.3).
