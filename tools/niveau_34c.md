# Niveau réel des questions — 3e et 4e du Collège de Genève (grades 14 et 15)

Audit du 25.11.2026 (agent niv34, branche `agent/niv34`). Règle de l'enseignant (24.11) : chaque notion proposée doit
correspondre à un objectif du plan d'études de la classe ; ses niveaux 2–3 (et le défi 4) ont la difficulté d'une vraie
évaluation de la classe ; le niveau 1 = automatismes **de l'année**, jamais ceux d'une année inférieure.

## 1. Sources (données ; rien n'a été exécuté)

| Réf. | Document | Emplacement |
|---|---|---|
| PROG | Programmes du Collège de Genève 2021, maths 3e–4e MA1 / MA2 | `~/DATA/Enseignement/Sources/Officiel/sism_college_geneve/01_programmes_cdg_2021_mars_2021_0_1.pdf` |
| PEC | Plan d'études cadre fédéral des écoles de maturité (2024), maths | `~/DATA/Enseignement/Sources/Officiel/College_GE/Plan-etudes-cadre-ecoles-maturite.pdf` |
| REF | Référentiel matu (codes `3.AN.03a`…) | `~/Dropbox/2026-2027/Matu/Referentiel/referentiel_matu.csv` ; `tools/programme_3e_4e_college.md` |
| S3A | Épreuve semestrielle 3MA1, Collège Sismondi, 18.12.2023 (160 min) | `…/sism_college_geneve/2023-2024_SISM_3_MA1_DF_énoncé_corrige.pdf` |
| S3B | Épreuve semestrielle 3MA2, Sismondi, déc. 2023 | `…/2023-2024_SISM_3_MA2_DF_énoncé_corrige.pdf` |
| S4A | Épreuve regroupée 4MA1, Sismondi, déc. 2023 | `…/2023-2024_SISM_4_MA1_DF_enonce_corrige.pdf` |
| S4B | Épreuve 4MA2, Sismondi, 2023-24 | `…/2023-2024_SISM_4_MA2_DF_enonce_corrige.pdf` |
| M14 | Écrit de maturité Ma4N, Collège de Saussure, 30.05.2014 | `~/DATA/Enseignement/Sources/Officiel/matu_gym_suisse/GE_edugemath/Ma4n_2014_matu.pdf` |
| M13 | Écrit de maturité, juin 2013 (analyse, probabilités, algèbre linéaire) | `…/GE_edugemath/ecrit-math-juin-2013.pdf` |
| ORAL | Sujets d'oral de maturité 3MA1/3MA2/4MA1/4MA2 (Sismondi) | `…/sism_college_geneve/03*_sujets_epreuve*.pdf` |

Les autres PDF d'edugemath (corrigés 2011, 2013, 2014, « ancienne matu ») sont des scans sans texte : non utilisés.

## 2. Objectifs et étalons par chapitre

Niveau : N = normal (MA1), R = renforcé / avancé (MA2). Étalons repris des épreuves (valeurs d'origine), désignés
`E-<chapitre>-<n>` dans `tools/niveau.json`.

### 3e année

**3.2 Limites et continuité** (3.AN.01–02, N+R) — limite par calcul, forme 0/0 (factorisation, conjuguée, trigo en R), limite à l'infini, asymptotes verticales / horizontales / obliques, position relative, continuité d'une fonction par morceaux, paramètre de continuité.
- E-3.2-1 (S3A Ex.1a) : lim_{x→3} (2x³ − 3x² − 11x + 6)/(2x² − x − 15) = 25/11.
- E-3.2-2 (S3A Ex.1b) : lim_{x→0} (1 − √(1 − x²))/x² = 1/2 (conjuguée).
- E-3.2-3 (S3A Ex.3) : f(x) = (3x² + x − 4)/(x² − 2x + 1) : domaine, zéros, asymptotes, position relative.
- E-3.2-4 (S3A Ex.5.2) : k pour que g(x) = (x² + 2x)/(x + 2) si x ≠ −2, 4x + k sinon, soit continue.
- E-3.2-5 (S3B Ex.4) : asymptote de 6x − √(25x² + 5x + 6) en ±∞ (R).

**3.3 Dérivation** (3.AN.03–10) — taux de variation, nombre dérivé par la définition, règles (produit, quotient, composée), tangente, variations et extremums, étude complète, dérivée seconde (R), optimisation.
- E-3.3-1 (S3A Ex.6) : f(x) = −x² + 2x + 3 ; f′ par la définition ; tangente en (2 ; f(2)) ; point où la tangente est parallèle à y = 4x − 4.
- E-3.3-2 (S3A Ex.7) : dériver (x² + 3)(6x² + 2)⁴ ; (3x + 1)/(2x − 1)² simplifiée ; sin²(7x) ; ∛(3x²) + 1/(5x).
- E-3.3-3 (S4A Ex.1) : f(x) = (2x² − 4x)/(x² + 2x − 3) : asymptotes, f′, tableau de variations, extremums, tangente en x = 2.
- E-3.3-4 (S4A Ex.2) : rectangle inscrit sous y = −x² + 9, aire maximale.
- E-3.3-5 (S3B Ex.2e–g, R) : f″, concavité et points d'inflexion d'une rationnelle.

**3.5 Combinatoire et probabilités** (3.PS.01–02) — permutations, arrangements, combinaisons, choix du modèle ; axiomes, contraire, réunion, équiprobabilité par dénombrement, arbres.
- E-3.5-1 (M13 Ex.6a) : 3 amis devant 3 machines parmi 10 : arrangements.
- E-3.5-2 (M13 Ex.6b) : probabilité d'être devant les 3 machines défectueuses (dénombrement).
- E-3.5-3 (M13 Ex.5c) : au moins une fois « 10 » en 6 lancers (contraire).
- E-3.5-4 (ORAL 4MA1, proba 2) : P(A ∪ B) = P(A) + P(B) − P(A ∩ B).

**3.6 Géométrie vectorielle et analytique de l'espace** (3.GV.01–06) — composantes, colinéarité / coplanarité (R), droites et plans (paramétriques, cartésiennes), positions relatives, produit scalaire, distances, sphère et plan tangent.
- E-3.6-1 (ORAL 4MA1, géométrie 1) : projection orthogonale d'un vecteur sur un autre dans R³.
- E-3.6-2 (ORAL 4MA1, géométrie 2) : distance d'un point à un plan.
- E-3.6-3 (ORAL, géométrie 3) : équation cartésienne d'un plan par trois points.
- E-3.6-4 (PROG, MA1 3e) : intersection droite-plan, positions relatives de deux droites, sphère et plan tangent.

### 4e année

**4.1 Intégration** (4.AN.01–05 ; parties et substitution : R) — primitives, intégrale définie, valeur moyenne, aires, volumes de révolution.
- E-4.1-1 (S4A Ex.3a) : primitives de 5x² + 3/x³, (3 − 2x)¹⁰, 2sin(x/6) + e^{5x−4}, 12/(4x − 3).
- E-4.1-2 (S4A Ex.4) : primitive de 3x² − 3x + 2 avec G(2) = 1 ; valeur moyenne sur [0 ; 2] et nombre c du théorème de la moyenne.
- E-4.1-3 (S4A Ex.5, S4B Ex.3) : aire entre f(x) = x, g(x) = x/4 et h(x) = 4/x (valeur exacte).
- E-4.1-4 (M14 Q4) : volume de l'« œuf » engendré par f(x) = ¼·√(x²(36 − x)) sur [0 ; 6].
- E-4.1-5 (S4B Ex.1b, R) : ∫ (2x + 1)sin x dx par parties ; ∫ √(1 − x²) dx avec x = sin t.

**4.2 Logarithme et exponentielle** (4.AN.06–09 ; équations différentielles : R) — dérivées et primitives de ln, exp, étude de fonctions, croissances comparées, modèles de croissance (doublement, demi-vie, croissance limitée, refroidissement).
- E-4.2-1 (S4A Ex.7) : f(x) = (1 − x)²/eˣ : zéros, f′, variations, extremums (arrondis), esquisse.
- E-4.2-2 (M13 Ex.3) : f(x) = 2x·e^{−x²} : zéros, f′, intervalles de croissance.
- E-4.2-3 (S4A Ex.8d) : F(x) = ln(x)/x² est-elle une primitive de (1 − 2ln x)/x³ ?
- E-4.2-4 (REF 4.AN.07b–c) : temps de doublement, demi-vie, modèle N(t) = N₀e^{kt} à partir de deux mesures.

**4.3 Algèbre linéaire** (4.GV.01–03) — matrices 2×2, déterminant, inverse, Cramer, transformations du plan, composition, aires.
- E-4.3-1 (M14 Q1) : B·A, B·I·A, X tel que A·X = B.
- E-4.3-2 (M14 Q2) : rotation d'angle 2π/3, projection, symétrie : images, préimages, composée, réciproque.
- E-4.3-3 (M13 Ex.8) : cisaillement : A³, inversibilité, inverse.
- E-4.3-4 (ORAL 4MA1, alg. lin. 1–2) : det(AB) = det A · det B, det(kA) = k² det A ; Cramer.

**4.4 Probabilités 2 et statistique** (4.PS.01–04) — conditionnelles, probabilités totales, Bayes, variable aléatoire (E, V), loi binomiale, loi normale ; statistique descriptive (séries en classes, écart-type, quartiles, comparaison).
- E-4.4-1 (M14 Q6) : stylos de 4 couleurs, taux de défauts : P(rouge et bon), P(défectueux), P(vert | défectueux).
- E-4.4-2 (M14 Q7) : binomiale B(12 ; 0,15) : P(X = 10), P(X ≥ 2).
- E-4.4-3 (M13 Ex.6c–d) : Bayes (machine défectueuse sachant gain) ; espérance de gain.
- E-4.4-4 (M13 Ex.5b–c) : exactement 2 fois « 10 » en 6 lancers ; au moins une fois.
- E-4.4-5 (REF 4.PS.01b–d) : moyenne et écart-type d'une série en classes, comparaison de séries (aucune épreuve sur le disque ne porte sur la statistique descriptive : étalon tiré du référentiel et de Sésamath Ma4 Ch4).

## 3. Audit (page de sonde `tests/_niv34.html`, non commitée : 7 formes distinctes par notion et par niveau)

Verdicts : **au niveau** ; **trop facile** (niveau d'une année inférieure) ; **remonté** (corrigé le 25.11) ; **hors
programme MA1** (renforcé, montré à tous tant que le moteur ne lit pas `niv`) ; **à valider** (limite, décision de l'enseignant).

### 3e (grade 14)

| Notion | N1 | N2 | N3 | N4 (défi) | Étalon | Remarque |
|---|---|---|---|---|---|---|
| limites | au niveau | au niveau | au niveau | au niveau | E-3.2-1, E-3.2-2 | N2 = 0/0 par factorisation, N3 = conjuguée, paramètre |
| limitinf | au niveau | au niveau | au niveau | au niveau | E-3.2-3, E-3.2-5 | |
| asymptotes | au niveau | au niveau | au niveau | au niveau | E-3.2-3 | N1 = automatisme (AH, AV d'une homographique) |
| continuite | au niveau | au niveau | au niveau | au niveau | E-3.2-4 | |
| tauxvar | **remonté** | au niveau | au niveau | au niveau | E-3.3-1 | N1 avait « vélo, plante, température, population » (Δy ÷ Δx entre deux relevés : niveau CO) → fonctions à évaluer (balle, vidange, culture) |
| nbderive | au niveau | au niveau | au niveau | au niveau | E-3.3-1 | |
| derivref | au niveau | au niveau | au niveau | au niveau | E-3.3-2 | N1 (xⁿ) = automatisme de base de l'année |
| derivregles | au niveau | au niveau | au niveau | au niveau | E-3.3-2 | |
| derivprodquot | au niveau | au niveau | au niveau | au niveau | E-3.3-2 | |
| derivcomp | au niveau | au niveau | au niveau | au niveau | E-3.3-2 | manque une forme « sin²(ax) » / quotient à carré simplifié (S3A Ex.7) : à ajouter plus tard |
| tangente | au niveau | au niveau | au niveau | au niveau | E-3.3-1 | |
| variations | **remonté** | au niveau | au niveau | au niveau | E-3.3-3 | N1 « valeur extrême d'une parabole » (sommet : 1re) → racine double de f′ (palier) |
| etudefct | au niveau | au niveau | au niveau | au niveau | E-3.3-3 | |
| derivseconde | au niveau | au niveau | au niveau | au niveau | E-3.3-5 | MA2 au programme genevois (S3B), non marqué `niv: "R"` : à valider |
| optimderiv | **remonté** | au niveau | au niveau | au niveau | E-3.3-4 | N1 « bénéfice du 2e degré » et « enclos le long d'une rivière » (sommet de parabole : 1re) → coût moyen minimal, boîte de volume maximal à surface donnée |
| combi | **remonté** | au niveau | au niveau | au niveau | E-3.5-1 | N1 « menus, tenues, coupes » (principe multiplicatif : 11e) → combinaisons (jass, loto, livres) |
| probaxiomes | **remonté** | à valider | au niveau | au niveau | E-3.5-2, E-3.5-3 | N1 « multiple de k dans une urne », « 1 − 0,08 », somme de deux dés (9e–11e) → tirage simultané (dénombrement), « au moins un » (contraire), « tous différents ». N2 « sondage à deux ensembles » et « une carte de jass » restent limites (11e + formule de la réunion) |
| probarbre | **remonté** | au niveau | au niveau | au niveau | E-3.5-3 | N1 « avec remise », « deux événements indépendants », « dé lancé deux fois » (un seul chemin : 11e) → exactement une (deux chemins, sans remise), série-parallèle, premier succès au k-ième essai |
| vect3d | au niveau | au niveau | à valider | au niveau | E-3.6-4 | N3 (centre de gravité, symétrique) = automatismes d'entrée du chapitre plutôt que niveau d'épreuve |
| colin | au niveau | au niveau | au niveau | au niveau | E-3.6-4 | MA2 (`niv` absent ; cf. programme § 6.1) |
| droite3d | au niveau | au niveau | au niveau | au niveau | E-3.6-4 | |
| plans | au niveau | au niveau | au niveau | au niveau | E-3.6-3 | |
| posrel | au niveau | au niveau | au niveau | au niveau | E-3.6-4 | |
| pscal3d | au niveau | au niveau | au niveau | au niveau | E-3.6-1 | |
| distances | au niveau | au niveau | au niveau | au niveau | E-3.6-2 | |
| sphere | au niveau | au niveau | au niveau | au niveau | E-3.6-4 | |

Chapitres de 3e : aucun vide. Manquent toujours `derivth` (3.4 Dérivation, théorie : Rolle, Lagrange) et `pvect` (MA2).

### 4e (grade 15)

| Notion | N1 | N2 | N3 | N4 (défi) | Étalon | Remarque |
|---|---|---|---|---|---|---|
| primitives | au niveau | au niveau | au niveau | au niveau | E-4.1-1, E-4.1-2 | N1 « vérifier F par dérivation » = 4.AN.01a |
| integrale | au niveau | au niveau | au niveau | au niveau | E-4.1-2 | N1 « trapèze » = interprétation comme aire (4.AN.02a) |
| aireint | au niveau | au niveau | au niveau | au niveau | E-4.1-3 | |
| volrev | au niveau | au niveau | au niveau | au niveau | E-4.1-4 | N1 (cône, cylindre par la formule) = automatisme |
| intparties | au niveau | au niveau | au niveau | au niveau | E-4.1-5 | **MA2** (`niv: "R"`, non lu par le moteur) |
| intsubst | au niveau | au niveau | au niveau | au niveau | E-4.1-5 | **MA2** |
| lnexp | au niveau | au niveau | au niveau | au niveau | E-4.2-1 | |
| etudelnexp | au niveau | au niveau | au niveau | au niveau | E-4.2-1, E-4.2-2 | |
| croissance | **remonté** | au niveau | à valider | au niveau | E-4.2-4 | N1 « calcule N(3) » et « demi-vie : diviser par 2ⁿ » (2e, modexp) → vitesse N′(t) = kN(t), demi-vie pour une durée non multiple. N3 « doublement d'un capital à 8 % composés » et « taux continu » restent proches de la 2e |
| eqdiff | au niveau | au niveau | au niveau | au niveau | (S4B) | **MA2** |
| matrices | au niveau | au niveau | au niveau | au niveau | E-4.3-1, E-4.3-4 | |
| translin | **remonté** | au niveau | au niveau | au niveau | E-4.3-2 | N1 : symétries d'axe Ox / Oy retirées (changer un signe : CO) ; restent rotations ±90°, symétrie y = x, homothéties, image par une matrice, aire |
| appllin | au niveau | au niveau | au niveau | au niveau | E-4.3-2 | |
| condbayes | au niveau | au niveau | au niveau | au niveau | E-4.4-1, E-4.4-3 | |
| varalea | au niveau | au niveau | au niveau | au niveau | E-4.4-3 | |
| binomiale | au niveau | au niveau | au niveau | au niveau | E-4.4-2, E-4.4-4 | |
| normale | au niveau | au niveau | au niveau | au niveau | (REF 4.PS.04) | sans table (règle 68-95-99,7) : les épreuves utilisent la table numérique → à valider |
| stats | trop facile | trop facile | trop facile | — | E-4.4-5 | moyenne de 5 nombres, mode, médiane, note manquante : niveau 7e–11e. **Retirée de la 4e** (reste MP 2e et France) |
| quartiles | trop facile | trop facile | trop facile | — | E-4.4-5 | étendue, Q₁ d'une série triée : niveau 11e. **Retirée de la 4e** (reste MP 2e) |
| **statdesc** (nouvelle) | au niveau | au niveau | au niveau | au niveau | E-4.4-5 | moyenne d'une série en classes, écart-type d'un tableau, König ; transformation affine, effectif inconnu, médiane interpolée ; ajout d'une valeur, regroupement de deux séries, valeur centrée réduite ; problème : moyenne et écart-type d'une série en classes |

Chapitres de 4e : aucun vide (4.4 garde la statistique descriptive avec `statdesc`). Manquent toujours les
complexes et suites-séries (MA2).

### Défis de niveau 4 (`src/defis.js`, `PROBS` de `ch3c_ana.js` / `ch4c_ana.js`)

Échantillon de 7 tirages par notion : tous en 3 étapes enchaînées, valeurs tirées, au niveau d'un exercice d'épreuve
(ex. limites : 0/0 + limite à l'infini + asymptote ; tangente : tangentes issues d'un point extérieur ; binomiale :
surréservation). Aucun défi en dessous du niveau 3.

## 4. Corrections du 25.11 (formes remplacées)

- `src/ch3c_ana.js` : tauxvar N1, variations N1, optimderiv N1 (deux formes), combi N1, probaxiomes N1 (trois formes), probarbre N1 (trois formes).
- `src/ch4c_ana.js` : croissance N1 (deux formes), translin N1 (symétries Ox / Oy), nouvelle notion `statdesc` (3 niveaux × 3 formes, pas à pas, pièges, ctx, leçon, indice, compétences, problème de niveau 4).
- `stats` (`src/curriculum.js`) et `quartiles` (`src/gen3.js`) : `CH: null` ; `src/ordre.js` : rang et chapitre de `statdesc` (M4C04) ; `src/engine.js` : PREREQ `statdesc`, `normale` → `statdesc` ; `src/riche_col34.js` : séries riches « temps de trajet » et « deux classes » rattachées à `statdesc`.

## 5. À faire valider par l'enseignant

1. **Renforcé (MA2) montré aux élèves de niveau normal** : `derivseconde`, `colin`, `intparties`, `intsubst`, `eqdiff` (et `asymptotes` obliques) — le moteur ne lit pas `niv` (programme § 6.1). Pour un élève MA1, ce sont des questions hors programme.
2. **stats et quartiles retirés de la 4e** au profit de `statdesc` : d'accord ?
3. Limites restantes : probaxiomes N2 (sondage, une carte de jass), vect3d N3, croissance N3 (intérêts composés) — remonter aussi ?
4. **Loi normale sans table** : les épreuves genevoises utilisent la table numérique ; la notion se limite à la règle 68-95-99,7.
5. derivcomp : ajouter des formes d'épreuve (sin²(7x), quotient à dénominateur au carré à simplifier) ?
