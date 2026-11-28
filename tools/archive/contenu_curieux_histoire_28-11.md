# /contenu curieux et histoire (28.11) : +20 questions curieuses, +15 histoires

Branche `agent/contenu4` (à fusionner). Décision de l'enseignant (28.11) : 20 + 15 entrées là où il en manque. En cours
de route, autre décision : **filière MP en suspens** (pas public cible), donc aucun sujet ciblé MP 2e ; ils sont remplacés
par des sujets de 11e et de 1re Collège.

## Questions curieuses (`src/curieux.js`, 78 → 98)

| Clé | Titre | Classe | Notion (`uses`) | Famille |
|---|---|---|---|---|
| carre50 | Plus vite que la calculatrice | 11e | idrem | énigme |
| ballon | Combien de temps en l'air ? | 11e | eq2 | quotidien |
| pattes | Têtes et pattes | 11e | sys2 | énigme |
| geant | Pourquoi les géants n'existent pas | 11e | simil | paradoxe |
| equerre | Un angle droit sans équerre | 11e | cercthales | énigme |
| mouche | La mouche dans la chambre | 11e | repere3d | énigme |
| magie | Le tour de magie | 11e | idrem, parenth | énigme |
| cadre | Le cadre aussi grand que la photo | 11e | probeq2 | paradoxe |
| cornet | À moitié plein ? | 11e | volcone, simil | paradoxe |
| billet | Le prix qui rapporte le plus | 1C | optim | quotidien |
| euler41 | La formule à nombres premiers | 1C | contrex | paradoxe |
| consecutifs | Le calcul de tête de Léa | 1C | demoalg | énigme |
| rdv | Le point de rendez-vous | 1C | absval | énigme |
| colline | Le ballon et la colline | 1C | inter | quotidien |
| nuages | La hauteur des nuages | 1C | trigo | fermi |
| taxis | Deux taxis | 1C | modaff | quotidien |
| periode | Le nombre qui se répète | 1C | ensembles | énigme |
| chiffres2 | Combien de chiffres ? | 2C | log | énigme |
| gps | Se situer comme un GPS | 2C | cercle | quotidien |
| cafeine | Le café de l'après-midi | 2C | expo | quotidien |

Bilan : 9 en 11e, 8 en 1re Collège, 3 en 2e Collège ; familles : 9 énigmes, 6 quotidien, 4 paradoxes, 1 Fermi.
Contextes neutres (CHF → € par frLocal en France ; « chaque hausse de 1 CHF », jamais « franc » en dur). Pas de figure.
Valeurs exactes acceptées (entiers, ou arrondi explicite `round` ; fourchette pour la question Fermi).

## Histoires (`src/histoire.js`, 55 → 70) et sources

| Titre | Classe | `need` | Sources (exactitude à relire) |
|---|---|---|---|
| Une équation du 2e degré il y a 3800 ans | 11e | eq2disc, eq2fact | BM 13901, problème 1 : Høyrup, *Algebra in Cuneiform* (MPRL / LibreTexts), Melville (RHM 2005) |
| Viète met des lettres dans les calculs | 11e | formule | Britannica « In artem analyticem isagoge » (1591, voyelles / consonnes) ; MacTutor Viète (Tours, déchiffrement pour Henri IV) |
| La sphère et le cylindre sur la tombe d'Archimède | 11e | volcone | Cicéron, *Tusculanes* V, 64–66 (questeur en Sicile, 75 av. J.-C.) ; math.nyu.edu/Archimedes/Tomb ; Jaeger, JRS 92 (2002) |
| La planche de Galton | 11e | proba, denombr | UCL Science Collections « The Quincunx » (1873, conférence 1874) ; *Natural Inheritance* (1889) |
| Thalès et le triangle dans le demi-cercle | 11e | cercthales | Diogène Laërce I, 24 (d'après Pamphila ; même anecdote de Pythagore chez Apollodore) — dit « anecdote » ; Euclide III.31 |
| Les identités remarquables d'Euclide | 11e | idrem | Euclide, *Éléments* II.4 (énoncé cité) |
| Tartaglia, Cardan et le duel du 3e degré | 1C | eq3 | MacTutor « Tartaglia versus Cardan » (1535, 30 problèmes ; 1539 ; papiers de del Ferro 1543 ; *Ars magna* 1545) ; exemple x³ + 6x = 20 (*Ars magna*, ch. XI) |
| √2, le nombre qui n'est pas une fraction | 1C | ratden, ensembles | Légende d'Hippase (Jamblique, *Vie de Pythagore*) dite « légende » ; démonstration classique |
| Nicole Oresme dessine le mouvement | 1C | lectgraph, fimg | Britannica « Tractatus de configurationibus… » ; Clagett (1968) ; date « vers 1350–1360 » (incertaine, dite approximative) |
| Fermat cherche le maximum | 1C | optim | Wikipedia / Giusti « Adequality » : *Methodus*, exemple du segment ; lettre à Roberval du 22.09.1636 (d'où « vers 1636 ») |
| Hipparque et la première table de trigonométrie | 1C | trigo | MacTutor Hipparchus (observations datées des années 140–120 av. J.-C., Rhodes ; Jones 1991 : activité vers 150–125) ; Britannica (table perdue) ; Théon : traité en 12 livres |
| Euclide construit une racine carrée | 1C | euclide | Euclide, *Éléments* VI.13 (moyenne proportionnelle), VI.8, II.14 (carrer un rectangle) |
| Henry Briggs et les logarithmes décimaux | 2C | log | MacTutor Briggs ; Britannica « Arithmetica Logarithmica » (1–20 000 et 90 000–100 000, 14 décimales ; Vlacq 1628) |
| Willard Libby date le passé au carbone 14 | 2C | expo, modexp | nobelprize.org (chimie 1960) ; ACS « Discovery of radiocarbon dating » (Science 1949, « Curve of Knowns ») ; 5 568 → 5 730 ans |
| Joseph Fourier : tout est somme de sinus | 2C | trigfn | MacTutor Fourier (mémoire du 21.12.1807, objections Lagrange et Laplace, publié en 1822) ; Britannica |

Chaque récit a une illustration SVG (obligatoire : la carte Exploration l'affiche) et un « À toi » au niveau de la classe.

## Sujets remplacés

- **MP 2e (décision de l'enseignant en cours de route : filière en suspens)** : curieux « grande roue » (trigfn), « bateau »
  (sinlaw), « temps de trajet » (quartiles) → remplacés par 3 sujets de 11e sur des notions peu servies : **magie**
  (calcul littéral), **cadre** (problème du 2e degré), **cornet** (volume du cône, similitude). « Deux taxis » est gardé
  mais lié à `modaff` de **1re Collège** (où la notion figure aussi).
  Histoires Al-Battani (trigcercle), Tukey (quartiles), taximètre → remplacées par **Thalès et le demi-cercle** (11e),
  **Euclide II.4** (11e, identités) et **Euclide VI.13** (1re Collège, théorème de la hauteur).
- **Clé `pente`** déjà prise (« Le panneau de montagne ») : le ballon sur la pente s'appelle `colline`.
- **Nombres en 1re Collège** : la proposition 17 (MP) est devenue « Le nombre qui se répète » (`ensembles`).

## Inventaire avant / après (sonde `tests/_probe_inv.html`, non commitée)

Correction de la sonde : elle passait le profil au lieu de l'état à `Histoire.ok` (toutes les classes étaient comptées
comme un 9e romand) ; les chiffres d'histoires de l'inventaire du matin étaient donc faux (11e : 19 récits liés, pas 11).
« Liés à l'année » = somme par chapitre de l'année (une entrée liée à deux chapitres compte deux fois).

| Classe | Curieux accessibles début → fin (avant ⇒ après) | Curieux liés à l'année | Histoires permises | Histoires liées à l'année |
|---|---|---|---|---|
| 9e | 13 → 38 ⇒ 13 → 38 | 27 → 27 | 43 → 43 | 21 → 21 |
| 10e | 38 → 68 ⇒ 38 → 68 | 32 → 32 | 48 → 48 | 44 → 44 |
| **11e** | 68 → 74 ⇒ 68 → 83 | **6 → 16** | 51 → 57 | **19 → 25** |
| **1C** | 74 → 74 ⇒ 83 → 91 | **0 → 8** | 52 → 64 | **6 → 14** |
| **2C** | 74 → 75 ⇒ 91 → 95 | **1 → 4** | 53 → 68 | **4 → 7** |
| 3C, 4C | 75 ⇒ 95 | 0 → 0 | 54 → 69 | 2 → 4, 2 → 2 |
| MP1 / MP2 | 66 → 74 / 74 ⇒ 69 → 85 / 85 → 87 | 8 → 16 / 0 → 2 | 52 → 62 / 52 → 64 | 47 → 55 / 5 → 7 |
| France 3e / 2nde / 1re | 71–72 ⇒ 72 → 80 / 80 → 82 / 82 → 85 | 1 → 8 / 0 → 2 / 0 → 3 | +7 / +9 / +10 | 22 → 27 / 5 → 8 / 6 → 9 |

Par chapitre, 11e : fonctions et algèbre curieux 0 → 5, histoires 7 → 10 ; espace 0 → 4, 3 → 4 ; grandeurs 1 → 2.
1re Collège : fonctions 0 → 4 / 4 → 8 ; espace 0 → 1 / 2 → 4 ; nombres 0 → 3 / 0 → 2 ; grandeurs et mesures : toujours 0.

## Tests

- `explo` (sections explo et curieux : 200 graines par question, réponses acceptées, non trivialité ; récits : 40 tirages,
  réponse acceptée) : vert. Attendu du test « sec II » corrigé : il ignorait les notions du chapitre en cours (autoInit
  marque « encours » le premier chapitre de 1re : contrex, demoalg, ensembles) ; contrôle ajouté.
- `hc_contenu` : `ch1c_arg.js` chargé (notions tradalg, contrex des récits Viète et √2). `enonces`, `revues_eleves`,
  `lot_26_11`, `parcours` : verts. `tools/test_nom.py` : ok.

## Reste / à décider

- Grandeurs et mesures de 1re Collège (`exactes`) et 3e–4e Collège : aucune entrée liée.
- France : les entrées neutres servent aussi en 3e–1re (identités, systèmes, trigo…) ; à vérifier par la revue quotidienne.
