# Programme de 3e et 4e du Collège de Genève (maturité gymnasiale) — 5min2maths

Établi le 23.11.2026 (agent college34). Usage interne : base pour créer les notions de 3e (grade 14) et de 4e (grade 15).

## 1. Sources

| Document | Où | Ce qu'on en tire |
|---|---|---|
| Programmes du Collège de Genève, version 2021 (mars 2021), maths p. 80–90 | `~/DATA/Enseignement/Sources/Officiel/sism_college_geneve/01_programmes_cdg_2021_mars_2021_0_1.pdf` (texte : `programme_cdg_2021.txt`) | **Le programme officiel** : 3e–4e MA1 (p. 84–86) et MA2 (p. 87–90), thèmes → notions → savoir-faire |
| Plan d'études du Collège, mathématiques | `…/sism_college_geneve/PlanEtudeCollege_mathematiques_0_1.pdf` | Grille horaire : MA1 4-4-4-4 h, MA2 4-4-**6-6** h ; MA2 obligatoire pour l'OS physique et applications des mathématiques (PAM) |
| Sujets d'oral de maturité 3MA1, 3MA2, 4MA1, 4MA2 (Collège Sismondi, 2021–2023) | `…/sism_college_geneve/03*_sujets_epreuve*.pdf` | **Répartition réelle 3e / 4e** (voir § 2) |
| Épreuves communes Sismondi 2023-24 (SISM_3_MA1/MA2, SISM_4_MA1/MA2) | `…/sism_college_geneve/` | Niveau d'exigence, modèles d'exercices |
| PEC fédéral des écoles de maturité gymnasiale (CDIP, 20.06.2024, en vigueur 01.08.2024), maths p. 65–68 | `~/DATA/Enseignement/Sources/Officiel/College_GE/Plan-etudes-cadre-ecoles-maturite.pdf` (téléchargé le 23.11) | Cadre national : 4 domaines (arithmétique-algèbre, analyse, géométrie, stochastique) ; compétences de base CdBA (dérivée, primitive, optimisation, trigonométrie, vecteurs, dénombrement, statistique) |
| Référentiel matu de l'enseignant (compétences codées `3.AN.03a`…, chapitres Sésamath) | `~/Dropbox/2026-2027/Matu/Referentiel/referentiel_matu.csv` (lu par `tools/referentiels.py`) | Découpage fin compétence par compétence, niveau MA1+MA2 / MA2, chapitre Sésamath |
| Manuels Sésamath matu gym 3e (Ma3) et 4e (Ma4) | `~/DATA/Enseignement/Sources/Web/sesamath_matugym/` | Ordre des chapitres (ce que les élèves font vraiment) |
| Catalogue CRM 2014 (niveaux standard / renforcé) ; anciens écrits Ma4N (edugemath) | `…/Officiel/matu_gym_suisse/` | Comparaison romande, exercices de maturité |
| Compétences Collège FR (`Officiel/Competences College FR/`) | — | Collège **français** (6e–3e) : sans rapport avec la 3e–4e du Collège de Genève |

Non récupérés : « Plan d'études 2023-2024 » et « Présentation CdG R25 » d'edu.ge.ch (réponse HTML : accès protégé). Le site ge.ch annonce une réforme (nouveau cadre fédéral, volées à partir de 2027) : le programme 2021 reste celui des élèves actuels de 3e–4e ; à revoir quand le nouveau plan genevois sera publié.

## 2. Organisation genevoise

- Mathématiques = **discipline fondamentale (DF)** à deux niveaux : **niveau normal MA1** (4 h/sem.) et **niveau avancé MA2** (4 h en 1re–2e, **6 h en 3e–4e**). Le choix du niveau se fait à l'entrée en 2e (ge.ch) ; MA2 obligatoire avec l'OS PAM, conseillé pour les études scientifiques ou économiques.
- La consigne parle de « normal DF/DN et renforcé OS/NR » : à Genève, les documents officiels disent **normal (MA1) / avancé (MA2)** ; « renforcé » est le terme vaudois / CRM. Dans l'app : *normal* = MA1, *renforcé* = MA2.
- En 3e–4e, MA2 = programme MA1 **plus** des savoir-faire et des chapitres propres (voir § 3).
- Répartition 3e / 4e (oraux Sismondi, Sésamath Ma3 / Ma4) :
  - **3e** : limites et asymptotes, **dérivation** (taux de variation, nombre dérivé, règles, tangente, étude de fonctions, optimisation, théorèmes de Rolle et Lagrange), **géométrie vectorielle et analytique de l'espace**, **combinatoire et probabilités (1)** ; MA2 en plus : dérivée seconde, produit vectoriel, et selon l'école suites-séries et nombres complexes (Sismondi les place en 3e, Sésamath en 4e).
  - **4e** : **primitives et intégrales**, logarithme et exponentielle (définition intégrale, modèles de croissance), **algèbre linéaire** (transformations du plan, matrices, déterminant), **probabilités (2)** (conditionnelles, Bayes, variables aléatoires, binomiale, loi normale), statistique descriptive ; MA2 en plus : intégration par parties et par substitution, équations différentielles, nombres complexes, suites et séries.

## 3. Programme par année et par niveau (chapitres → notions → compétences)

Code des compétences : référentiel matu (`3.AN.03a` = 3e, analyse, groupe 03, compétence a). « N+R » = normal et renforcé ; « R » = renforcé (MA2) seulement.

### 3e année

| Chapitre (Sésamath Ma3) | Notion de l'app (id) | Niv. | Compétences | Existe ? |
|---|---|---|---|---|
| 1. Prérequis | reprises de 2e (Sésamath Ma3 ch. 1) : `polyfact`, `fracrat`, `ineqpoly`, `ineqfrac`, `compo`, `expo`, `log`, `trigfn` | N+R | (2e) | **rattachées le 25.11** : chapitre M3C01, « de l'année » en 3e mais statut « vu » (pas nouvelles) ; `ORDRE_THEME.MATU_REP` (src/ordre.js), lu par `Engine.catalog` et `themeKey` |
| 2. Limites et continuité | **`limites`** — limite par lecture / calcul direct, forme 0/0 | N+R | 3.AN.01a, 01b | **créée le 24.11** |
| | **`limitinf`** — limite à l'infini (polynôme, rationnelle) | N+R | 3.AN.01c | **créée** |
| | **`asymptotes`** — asymptotes verticales, horizontales (obliques : R) | N+R / R | 3.AN.01d, 01e | **créée** |
| | **`continuite`** — continuité en un point, fonction par morceaux | N+R | 3.AN.02a, 02b | **créée** (prérequis `morceaux`) |
| 3. Dérivation | **`tauxvar`** — taux de variation moyen, pente d'une sécante | N+R | 3.AN.03a | **créée le 23.11** |
| | **`nbderive`** — nombre dérivé : limite du taux d'accroissement, pente de la tangente lue | N+R | 3.AN.03b, 04a | **créée** |
| | **`derivref`** — fonction dérivée des fonctions de référence (xⁿ, √x, 1/x, sin, cos) | N+R | 3.AN.04b, 04c | **créée** |
| | **`derivregles`** — somme, multiple, polynômes | N+R | 3.AN.05a | **créée** |
| | **`derivprodquot`** — produit et quotient | N+R | 3.AN.05b, 05c | **créée** |
| | **`derivcomp`** — fonction composée, puissance d'une fonction | N+R (R : démonstrations) | 3.AN.05d, 05e | **créée** |
| | **`tangente`** — équation de la tangente, approximation affine | N+R | 3.AN.03c, 03d | **créée** |
| | **`variations`** — signe de f′, tableau de variations, extrema locaux | N+R | 3.AN.07a, 07b | **créée** |
| | **`etudefct`** — étude complète (polynomiale, rationnelle) | N+R | 3.AN.07c, 07d | **créée le 24.11** |
| | **`derivseconde`** — concavité, points d'inflexion | **R** | 3.AN.08a, 08b | **créée le 24.11** |
| | **`optimderiv`** — problèmes d'extremum (géométrie, économie) | N+R | 3.AN.10a–c | **créée** |
| 4. Dérivation (théorie) | **`derivth`** — dérivable ⇒ continue, points anguleux, demi-tangentes, raccord dérivable, Rolle, Lagrange, majoration (radar) | N+R | 3.AN.06a, 06b, 09a | **créée le 25.11** (démonstrations 09b–c : hors saisie) |
| 5. Combinatoire et probabilités | **`combi`** — principe multiplicatif, permutations, arrangements, combinaisons | N+R | 3.PS.01a–e | **créée le 24.11** (`denombr` 11e = bases) |
| | **`probaxiomes`** — vocabulaire, équiprobabilité, contraire, réunion | N+R | 3.PS.02a–c | **créée** (`proba` 11e = bases) |
| | **`probarbre`** — expériences successives (arbres, tableaux) | N+R | 3.PS.02d | **créée** |
| 6. Géométrie vectorielle | `vecteurs` (2e) — composantes, norme, produit scalaire dans le plan | N+R | 3.GV.01a–d (plan) | oui (CH 13) ; à étendre à l'espace |
| | **`vect3d`** — vecteurs de l'espace, milieu, norme, Chasles | N+R | 3.GV.01a–d | **créée le 24.11** |
| | **`colin`** — colinéarité, coplanarité | **R** | 3.GV.02a, 02b | **créée** |
| | **`droite3d`** — équations paramétriques de droites de l'espace (`droiteparam` reste MP : paquet « mp ») | N+R | 3.GV.03a, 03b | **créée** |
| | **`plans`** — équations paramétriques et cartésienne d'un plan, traces | N+R | 3.GV.03c, 03e | **créée** |
| | **`posrel`** — positions relatives, intersections | N+R | 3.GV.03d | **créée** |
| | **`pscal3d`** — produit scalaire dans l'espace : angle, orthogonalité, projection (id ≠ `pscal` du lycée français) | N+R | 3.GV.04a–c | **créée** |
| | **`distances`** — distance point-droite, point-plan ; aire d'un triangle | N+R | 3.GV.04d, 04e | **créée** |
| | **`sphere`** — vecteur normal, plan médiateur, sphère, plan tangent | N+R | 3.GV.05a–d | **créée** (`cercle`, `cercletan` 2e = plan) |
| | **`pvect`** — produit vectoriel, produit mixte, aires, volumes, distances point-droite et entre droites gauches | **R** | 3.GV.06a–d | **créée le 25.11** |

### 4e année

| Chapitre (Sésamath Ma4) | Notion (id proposé) | Niv. | Compétences | Existe ? |
|---|---|---|---|---|
| 1. Intégration | `primitives` — primitives des fonctions de référence, linéarité, condition initiale | N+R | 4.AN.01a–c | **créée le 24.11** (`primitives`) |
| | `integrale` — intégrale définie (théorème fondamental), propriétés, valeur moyenne | N+R | 4.AN.02a–c, 03a | **créée** (`integrale`) |
| | `aires` (nom à éviter : déjà pris au CO) → `aireint` — aire sous une courbe, entre deux courbes | N+R | 4.AN.05a, 05b | **créée** (`aireint`) |
| | `volrev` — volume d'un corps de révolution | N+R | 4.AN.05c | **créée** (`volrev`) |
| | **`intparties`** — intégration par parties ; **`intsubst`** — par substitution | **R** | 4.AN.04a, 04b (**créées le 25.11**) | **créées le 25.11** (R) |
| 2. ln et exp | `lnexp` — propriétés, dérivées et primitives de ln et exp | N+R | 4.AN.06a–c | **créée** (`lnexp`) |
| | **`etudelnexp`** — étude de fonctions avec ln, exp (croissances comparées) | N+R | 4.AN.06d (**créée le 25.11**) | **créée le 25.11** |
| | `modexp` (2e) étendu → `croissance` — N(t) = N₀·e^(kt), doublement, demi-vie, croissance limitée | N+R | 4.AN.07a–c | **créée** (`croissance`) |
| | **`eqdiff`** — équations différentielles à variables séparables | **R** | 4.AN.08a–c, 09a–b (**créée le 25.11**) | **créée le 25.11** (R) |
| 3. Algèbre linéaire | `matrices` — opérations, produit, déterminant, inverse | N+R | 4.GV.02b, 02c | **créée** (`matrices`, avec Cramer 2 × 2) |
| | `translin` — matrice d'une transformation (rotation, symétrie, projection, homothétie), composition, déterminant = rapport d'aires | N+R | 4.GV.01a–d | **créée** (`translin`) |
| | `syslin` — systèmes par les matrices (Cramer, inverse) | N+R | 4.GV.02e | **créée le 25.11** (`syslin` : D, Dx, Cramer, inverse, paramètre, 3 × 3, infinité de solutions) |
| | `appllin` — noyau, image ; `bases` — famille libre, base, composantes | N+R | 4.GV.02a, 02d ; 4.GV.03a–d | **créées** (`appllin` 24.11 ; `bases` le 25.11 : familles libres, composantes, dimension, changement de base). MA1 : « sujet à choix » du programme |
| 4. Probabilités 2 | `probcond` — probabilité conditionnelle, probabilités totales, indépendance | N+R | 4.PS.02a–c | **rattachée** : `condbayes` (conditionnelles, totales, indépendance ; id ≠ `probcond` du lycée français) |
| | `bayes` — théorème de Bayes | N+R | 4.PS.02d | **créée le 25.11** (`bayes`, notion séparée de `condbayes` : trois causes, effectifs, deux tests, prévalence) |
| | `varalea` — loi, espérance, variance d'une variable discrète | N+R | 4.PS.03a, 03b | **créée** (`varalea`) |
| | **`densite`** — variables continues : densité, constante, lois uniforme et exponentielle, espérance, variance, médiane | **R** | 4.PS.03e | **créée le 25.11** (agent trous, R) |
| | `binomiale` — schéma de Bernoulli, loi binomiale, E et V | N+R | 4.PS.03c, 03d | **créée** (`binomiale`) |
| | `normale` — loi normale, centrer-réduire, intervalles 68–95–99,7 % | N+R | 4.PS.04a–c (04d : R) | **créée** (`normale`) |
| | **`approxnorm`** — approximation de la binomiale par la normale, correction de continuité (table de Φ dans l'énoncé) | **R** | 4.PS.04d | **créée le 25.11** (agent trous, R) |
| | `stats` (existe, MP seulement) + `quartiles` (MP) → ouvrir au Collège | N+R | 4.PS.01a–d | **remplacées** par `statdesc` (25.11, audit : `stats` et `quartiles` = niveau CO, retirées du Collège, MP inchangée) |
| Av1 Complexes | `cplxalg` — forme algébrique, opérations, conjugué, division | **R** | 4.NC.01a–c | **créée le 25.11** (R) |
| | `cplxtrig` — module, argument, formes trigonométrique et exponentielle, Moivre | **R** | 4.NC.02a–d | **créée le 25.11** (R) |
| | `cplxeq` — az² + bz + c = 0, racines n-ièmes ; lieux |z − a| = r | **R** | 4.NC.03a–c, 04a–b | **créée le 25.11** (R) |
| Av3 Suites et séries | `suitearith`, `suitegeom` — terme général, somme ; `serie` — série géométrique, intérêts | **R** | 4.AN.10a–d | **créées le 25.11** (R) : `suitegeom` (arithmétiques et géométriques, notion suisse ; `suitearith` reste au profil France), `serie` (géométriques, d'Alembert, télescopiques, Mac-Laurin) |
| 7. Géométrie dans l'espace (sujet à choix MA1) | **`geoesp`** — diagonales, volumes, perspective cavalière, angles dans un solide, sections planes (nature, dimensions), tronc de cône, angle entre deux faces | N (gardé MA2 aussi) | 4.GV.04a–d | **créée le 25.11** (agent trous ; nouveau chapitre M4C07) |
| | `taylor` — critères de convergence, rayon, Taylor / Mac-Laurin | **R** | 4.AN.11a–c (peu saisissable) | en partie dans `serie` (d'Alembert, coefficients de Mac-Laurin) ; rayon de convergence : non |

Hors saisie (démonstrations, constructions) : 3.AN.05e (démontrer), 3.AN.09b–c, 3.GV.06 (partie preuve), 4.AN.03b, 4.GV.02f, 4.PS.02e, 4.NC.04c : à traiter par la leçon (« pourquoi ») et les questions curieuses, pas par des questions à réponse tapée.

## 4. Correspondance avec l'app

- Profil : `{ system: "CH", grade: 14 | 15, track: "college" }` (3e et 4e du Collège). La MP n'a pas de 3e–4e dans l'app : au-delà de la 2e, la voie est forcée à « Collège ».
- `curriculum.js` : `SYSTEMS.CH.grades` reçoit `[14, "3e (sec. II)"]` et `[15, "4e (sec. II)"]`.
- Notions : champ `CH: [14]` (3e) ou `[15]` (4e), `MP: null` (hors MP2 ; la dérivation de MP3–MP4 pourra reprendre ces générateurs plus tard avec `MP: [14, "S5"]`…), `FR: null` (l'agent France 1re–Tle pourra poser `FR: [11, …]`).
- Chapitres : `ORDRE_THEME.MATU` reçoit `M3C02` (Limites), `M3C03` (Dérivation), `M3C04` (Dérivation, théorie), `M3C05` (Combinatoire et probabilités), `M3C06` (Géométrie vectorielle), `M4C01`… (via `tools/referentiels.py` : `SESA`, `SESA_FIX`, `codesMATU`). Le catalogue (`Engine.catalog`) range déjà une notion dans « l'année » si son chapitre commence par `M` + (grade − 11) : `M3…` pour grade 14, `M4…` pour grade 15. Rien d'autre à changer dans le moteur.
- Niveau normal / renforcé : pas encore dans le profil. Proposition : un champ `profile.niv = "N" | "R"` (question à l'entrée en 3e–4e) et un champ `niv: "R"` sur les notions renforcées (dérivée seconde, produit vectoriel, complexes, équations différentielles, suites et séries, intégration par parties) ; `catalog()` les écarte pour `niv = "N"`. **Décision de l'enseignant** (voir § 6). Les 9 premières notions (dérivation) sont communes aux deux niveaux.
- Les notions de 1re–2e (CH 12–13) restent « vues » pour un élève de 3e et servent de révision et de remédiation (`PREREQ`).

### Notions de dérivation créées (réutilisables par l'agent France 1re–Tle)

Fichier unique `src/ch3c_ana.js` (chargé après `ch_mp2.js`, avant `riche.js` et `lessons.js`). Chaque notion : 3 niveaux, ≥ 3 formes par niveau, pas à pas, erreurs typiques, `ctx`, leçon, indice, 3 compétences, problème en étapes (niveau 4).

| id | Libellé | Compétences (matu) | Réponse attendue |
|---|---|---|---|
| `tauxvar` | Taux de variation moyen | 3.AN.03a | nombre |
| `nbderive` | Nombre dérivé | 3.AN.03b, 3.AN.04a | nombre |
| `derivref` | Dérivées des fonctions de référence | 3.AN.04b, 3.AN.04c | expression ou nombre |
| `derivregles` | Dériver une somme, un polynôme | 3.AN.05a | expression |
| `derivprodquot` | Dériver un produit, un quotient | 3.AN.05b, 3.AN.05c | expression ou nombre |
| `derivcomp` | Dériver une fonction composée | 3.AN.05d, 3.AN.05e | expression ou nombre |
| `tangente` | Équation de la tangente | 3.AN.03c, 3.AN.03d | expression (y = …) ou nombre |
| `variations` | Signe de la dérivée et variations | 3.AN.07a, 3.AN.07b | nombre, ensemble, couple |
| `optimderiv` | Problèmes d'optimisation | 3.AN.10a–c | nombre |

Pour l'agent France : programme de 1re spécialité (taux de variation, nombre dérivé, tangente, dérivées usuelles, somme / produit / quotient, variations, extremums) = `tauxvar`, `nbderive`, `derivref`, `derivregles`, `derivprodquot`, `tangente`, `variations` ; Tle = `derivcomp`, `optimderiv`. Il suffit d'ajouter `FR: [année, …]` à ces notions (dans `ch3c_ana.js`, tableau `NEW`).

### Notions de 4e créées le 24.11 (agent college4)

Fichier `src/ch4c_ana.js` (paquet de chargement « 15 », chargé après `ch3c_ana.js`). Même standard que la 3e. Rangement : `ORDRE.MATU` et `ORDRE_THEME.MATU` complétés à la main en fin de `src/ordre.js` (chapitres M4C01, M4C02, M4C04) ; `tools/referentiels.py` lit déjà le fichier.

| id | Libellé | Chapitre | Compétences (matu) |
|---|---|---|---|
| `primitives` | Primitives | M4C01 | 4.AN.01a–c |
| `integrale` | Intégrale définie | M4C01 | 4.AN.02a–c, 4.AN.03a |
| `aireint` | Aires avec une intégrale | M4C01 | 4.AN.05a, 05b |
| `volrev` | Volume d'un corps de révolution | M4C01 | 4.AN.05c |
| `lnexp` | Logarithme et exponentielle | M4C02 | 4.AN.06a–d |
| `croissance` | Modèles de croissance exponentielle | M4C02 | 4.AN.07a–c |
| `condbayes` | Probabilités conditionnelles et Bayes (id ≠ `probcond` du lycée français) | M4C04 | 4.PS.02a–d |
| `varalea` | Variable aléatoire : espérance, variance | M4C04 | 4.PS.03a, 03b |
| `binomiale` | Loi binomiale (id ≠ `binom` du lycée français) | M4C04 | 4.PS.03c, 03d |
| `intparties` (R, 25.11) | Intégration par parties (x·eˣ, ln x, x·cos x, x²eˣ, eˣ·sin x, xⁿ·ln x) | M4C01 | 4.AN.04a |
| `intsubst` (R, 25.11) | Intégration par substitution (ax + b, x² + c, sin x, ln x, eˣ + c, racines) | M4C01 | 4.AN.04b |
| `etudelnexp` (25.11) | Étude de fonctions avec ln et exp : domaine, zéro, extremum, croissances comparées | M4C02 | 4.AN.06d |
| `eqdiff` (R, 25.11) | Équations différentielles : y' = ky, y' = ay + b, variables séparables, modèles | M4C02 | 4.AN.08–09 |

Ajouts du 25.11 (agent c4plus) : réponses = valeur d'une intégrale (exacte : ln, e, π acceptés ; ou arrondie) ou expression (primitive avec condition F(a) = 0, solution y(x) avec condition initiale). Champ `niv: "R"` posé sur `intparties`, `intsubst`, `eqdiff` (pas encore lu par le moteur, décision § 6.1). Rangs `ORDRE.MATU` 204, 205, 212, 213 (fin de `src/ordre.js`, à la main).

Restent pour la 4e : `normale`, `stats`/`quartiles` au Collège (M4C04), algèbre linéaire (M4C03, réponses matricielles à créer), et le renforcé (MA2).

### Notions de géométrie vectorielle de l'espace créées le 24.11 (agent c3geo)

Fichier `src/ch3c_geo.js` (paquet de chargement « 14 », chargé après `ch3c_ana.js`). Même standard que la dérivation ; problèmes de niveau 4 à valeurs tirées. Rangement : `ORDRE.MATU` (150–157) et `ORDRE_THEME.MATU` (M3C06) complétés à la main en fin de `src/ordre.js` ; `tools/referentiels.py` lit le fichier ; prérequis dans `PREREQ` (engine.js).

| id | Libellé | Compétences (matu) | Réponse attendue |
|---|---|---|---|
| `vect3d` | Vecteurs de l'espace | 3.GV.01a–d | triplet « x ; y ; z », nombre |
| `colin` | Colinéarité et coplanarité (MA2) | 3.GV.02a, 02b | nombre, couple « α ; β » / « m ; n » |
| `droite3d` | Droites de l'espace | 3.GV.03a, 03b | triplet, nombre, expression (z en fonction de t) |
| `plans` | Équations d'un plan | 3.GV.03c, 03e | triplet (point, « b ; c ; d »), nombre, expression (y = …) |
| `posrel` | Positions relatives, intersections | 3.GV.03d | triplet, nombre |
| `pscal3d` | Produit scalaire dans l'espace | 3.GV.04a–c | nombre (angles au dixième), triplet |
| `distances` | Distances et aires dans l'espace | 3.GV.04d, 04e | nombre (fractions acceptées ; aire au centième), ensemble |
| `sphere` | Vecteur normal, plan médiateur, sphère | 3.GV.05a–d | nombre, triplet, ensemble (valeurs de t) |

Choix : `droiteparam` (MP 4e, `src/ch_mp4.js`) n'est pas ouverte au Collège, car son générateur est dans le paquet « mp », non chargé pour un élève de 3e (il faudrait déplacer tout `ch_mp4.js`) : notion Collège `droite3d` à la place. Équation cartésienne : la réponse est un triplet « b ; c ; d » (coefficient de x imposé) ou la valeur de d (coefficients donnés), pour une réponse unique.

Restent pour ce chapitre : `pvect` (produit vectoriel, produit mixte : MA2), figures 3D (perspective cavalière) pour les leçons et quelques questions, leçons actives, séries riches et défis de géométrie de l'espace.

## 5. Liste priorisée des notions à créer

1. **Dérivation (3e, M3C03)** — fait le 23.11 : `tauxvar`, `nbderive`, `derivref`, `derivregles`, `derivprodquot`, `derivcomp`, `tangente`, `variations`, `optimderiv`.
2. **Limites et asymptotes (3e, M3C02)** : `limites`, `limitinf`, `asymptotes`, `continuite` — prérequis du nombre dérivé et de l'étude de fonctions rationnelles ; puis `etudefct`, `derivseconde` (R), `derivth`.
3. **Géométrie vectorielle de l'espace (3e, M3C06)** — fait le 24.11 : `vect3d`, `droite3d`, `plans`, `posrel`, `pscal3d`, `distances`, `sphere` ; R : `colin` (fait), `pvect` (à faire). Gros chapitre (120 exercices Sésamath) : figures 3D en SVG à prévoir (perspective cavalière, comme `solides` au CO).
4. **Combinatoire et probabilités (3e, M3C05)** : `combi`, `probaxiomes`, `probarbre`.
2. **Limites et asymptotes (3e, M3C02)** — fait le 24.11 soir (agent c3ana, src/ch3c_ana.js) : `limites`, `limitinf`, `asymptotes`, `continuite` ; et en M3C03 `etudefct`, `derivseconde` (R). Reste `derivth` (M3C04). Leçons actives « À toi : 2 questions » dans src/act_col34.js.
3. **Géométrie vectorielle de l'espace (3e, M3C06)** : `vect3d`, `droiteparam`, `plans`, `posrel`, `pscal`, `distances`, `normal` ; R : `colin`, `pvect`. Gros chapitre (120 exercices Sésamath) : figures 3D en SVG à prévoir (perspective cavalière, comme `solides` au CO).
4. **Combinatoire et probabilités (3e, M3C05)** — fait le 24.11 soir (agent c3ana) : `combi`, `probaxiomes`, `probarbre`.
5. **Intégration (4e, M4C01)** — fait le 24.11 : `primitives`, `integrale`, `aireint`, `volrev` ; R : `intparties`, `intsubst`.
6. **ln et exp (4e, M4C02)** — fait le 24.11 : `lnexp` (avec tangente et extremum, une partie de `etudelnexp`), `croissance` ; R : `eqdiff`.
5. **Intégration (4e, M4C01)** — fait le 24.11 : `primitives`, `integrale`, `aireint`, `volrev` ; R : `intparties`, `intsubst` (fait le 25.11).
6. **ln et exp (4e, M4C02)** — fait le 24.11 : `lnexp` (avec tangente et extremum, une partie de `etudelnexp`), `croissance` ; `etudelnexp` et R : `eqdiff` (faits le 25.11).
7. **Probabilités 2 et statistique (4e, M4C04)** — fait le 24.11 : `condbayes` (conditionnelles et Bayes), `varalea`, `binomiale` ; puis (agent greste) `normale` (sans table, règle 68-95-99,7) et `stats`, `quartiles` ouverts à la 4e (`CH: [15]`).
8. **Algèbre linéaire (4e, M4C03)** — fait le 24.11 (agent greste) : `matrices` (avec Cramer, donc `syslin` inclus), `translin` ; reste `appllin`, `bases`.
9. **Renforcé (4e)** : `cplxalg`, `cplxtrig`, `cplxeq`, `suitearith`, `suitegeom`, `serie`.

Outils à prévoir : le calculateur (`src/expr.js`) comprend depuis le 23.11 `sin`, `cos`, `tan`, `exp` (réponses du type « 3cos(3x) ») ; il faudra des réponses vectorielles (triplets : déjà possibles avec `pair` à 3 valeurs), des matrices (à créer) et des nombres complexes (à créer : `i`).

## 6. Décisions pour l'enseignant

1. **Niveau normal / renforcé dans le profil** (question « Maths niveau normal ou avancé ? » à l'entrée en 3e–4e) ou programme MA1 seulement pour l'instant, MA2 plus tard ?
2. **Suites-séries et complexes en 3e ou en 4e** (MA2) : Sismondi les place en 3e, Sésamath en 4e. Suivre quel collège ?
3. **Ordre des chapitres de 3e** : Sésamath (limites → dérivation → combinatoire → vecteurs) ou selon l'école (souvent analyse et géométrie vectorielle en parallèle) ? L'app ouvre les notions de l'année dans l'ordre `ORDRE.MATU`.
4. **Réforme genevoise** (nouveau cadre fédéral, volées 2027+) : attendre le nouveau plan d'études pour la 4e ?
5. **Bêta-testeurs** : des élèves de 3e ou 4e du Collège sont-ils disponibles (comme les 1re pour les chapitres actuels) ? Sinon, les notions de 3e restent ouvertes mais sans retour élève.


## 7. Bilan du 25.11 (agent col34) : 3e et 4e complètes

Notions ajoutées : 3e `derivth` (M3C04), `pvect` (M3C06, MA2) ; 4e `syslin`, `bases` (M4C03), `bayes` (M4C04) ; MA2 `cplxalg`, `cplxtrig`, `cplxeq` (nouveau chapitre M4C05 « 5. Nombres complexes ») et `suitegeom`, `serie` (M4C06 « 6. Suites et séries »). Chapitre 3e « 1. Prérequis » : huit reprises de 2e. Réponses complexes tapées « a + bi » (touche i du clavier, expression en i). Leçons actives dans `src/act_col34b.js` ; test `tests/college34c.html`.

Notions de l'année (avant → après) : 3e MA1 24 → 33 (dont 25 nouvelles et 8 reprises) ; 3e MA2 26 → 36 (28 nouvelles) ; 4e MA1 15 → 18 ; 4e MA2 18 → 26.

Niveau MA1 / MA2 relu (programme 2021, oraux Sismondi) : asymptotes obliques = MA2 (formes écartées en MA1 par `HORS_MA1`) ; `appllin` et `bases` sont des « sujets à choix » en MA1 (gardés N : à trancher) ; suites et séries et complexes : Sismondi les place en 3e MA2, l'app en 4e (décision § 6.2).


## 8. Bilan du 25.11 (agent trous) : derniers savoir-faire calculables

- 4e : `geoesp` (4.GV.04a–d, chapitre M4C07 « 7. Géométrie dans l'espace ») : diagonales de pavé et de cube, volume par
  l'apothème, perspective cavalière (coefficient de réduction), angles diagonale-base, arête-base, face-base, sections
  d'un cube (triangle BDE, rectangle diagonal, hexagone régulier), section parallèle d'une pyramide, tronc de cône. Les
  propriétés de perspective et la nature des sections, jusqu'ici classées « hors saisie », sont devenues calculables
  (dimensions et aires). Programme 2021 : « notions de géométrie dans l'espace » = sujet à choix de MA1 ; gardée N (visible
  aussi en MA2, comme `appllin` et `bases`) : **à trancher**.
- 4e MA2 (niv R) : `densite` (4.PS.03e) et `approxnorm` (4.PS.04d), chapitre M4C04. Approximation normale : valeurs de Φ
  données dans l'énoncé (style table), σ ∈ {2,5 ; 5 ; 10} pour des z à deux décimales ; la calculatrice TI-30X Plus donne
  les mêmes valeurs.
- 1re : `graphefct` (1.FO.02c, M1C04) ; `droitesrem` étendue à 1.GE.04d (problèmes : isocèle et centre de gravité,
  orthocentre, point de la médiatrice).
- 2e : `ineqgraph` (2.AL.04e, M2C03) : lecture graphique de f(x) ≷ 0, ≷ k, ≷ g(x), asymptote, zéro double, encadrement,
  intersection à calculer.
- 4e MA2 et Tle française : `eqdiff` + y' = ay + f (solution particulière donnée, affine, exponentielle).
- CO 11e : `repere3d` (11ES1.05, chapitre 11C03).
- Couverture (`tools/referentiels.py`, lancé sur une copie) : MATU 1re–2e 156 → 159 / 176 (0 à traiter) ; CO 220 → 221 / 245
  (0 à traiter). En 3e–4e, 4.GV.04a–d, 4.PS.03e et 4.PS.04d sont désormais rattachées.
- Fichiers : `src/trx.js` (outils communs), `src/ch4c_trous.js`, `src/ch1c_trous.js`, `src/ch11_rep3d.js` ; tests
  `tests/trous.html`, `tests/act_trous.html`.
