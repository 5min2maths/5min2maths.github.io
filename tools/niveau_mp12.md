# Niveau réel des questions — MP 1re et MP 2e (CFPT, grades 12 et 13, filière « mp »)

Audit du 25.11.2026 (agent nivmp12, branche `agent/nivmp12`). Règle de l'enseignant (24.11) : chaque notion proposée
correspond à un objectif du plan d'études de la classe ; ses niveaux 2–3 (et le défi 4) ont la difficulté d'une vraie
évaluation de la classe ; le niveau 1 = automatismes **de l'année**, jamais ceux d'une année inférieure.
Ce sont les classes de l'enseignant (MP1, MP2C, MP2D) et des testeurs. **La MP n'est pas la maturité gymnasiale** : l'étalon
est l'évaluation CFPT (base Maurizio, `xDATA Maurizio`) et les tests de l'enseignant, jamais les épreuves du Collège.
Le relèvement du Collège (UPC, `engine.js`, 24.11 : niveau 1 → 2 et 2 → 3 pour les notions du CO) ne s'applique pas à la
filière mp (`track !== "mp"`) ; cet audit vérifie donc séparément que le niveau 1 de MP n'est pas du niveau CO.

## 1. Sources (données ; rien n'a été exécuté ; aucun fichier de notes ni donnée d'élève)

| Réf. | Document | Emplacement |
|---|---|---|
| PEE | Référentiel MP (PEE 2026), compétences S1–S4 (PEC, \* = ajout du groupe CFPT, fac.) | `~/Dropbox/2026-2027/CFPT/Referentiel/referentiel_MP.csv` |
| POLY | Polycopiés MP1 (Chap01–07) et MP2 (Chap01–05) | `CFPT/MP1/Polycops de cours`, `CFPT/MP2/Polycops de cours` |
| T11, T13 | Tests de l'enseignant 2026 : Test S1.1 (calcul numérique), Test S1.3 (calcul algébrique), versions A | `CFPT/MP1/Evaluations/Test S1.1`, `Test S1.3` |
| M1-R1, M1-E1 | Maurizio MP1, Récitation 1 et Épreuve 1 « Révision calcul numérique » (2022, 2023) | `CFPT/xDATA Maurizio/Tests MP1` |
| M1-R2, M1-E3 | Maurizio MP1, Récit 2 et Épreuve 3 « Calcul littéral » (2024) | idem |
| M1-R4, M1-E5, M1-E6 | Maurizio MP1, Récit 4 « Équ. 1er degré, facto » (2024), Épreuve 5 « Équ. 1 et 2d » (2025), Épreuve 6 « Équ. para, ratio, inéqu. » (2025) | idem |
| M1-R8, M1-E7, M1-E9 | Maurizio MP1, Récit 8 « Systèmes » (2024), Épreuve 7 « Syst-Pyth-Thal » (2025), Épreuve 9 « Pyth-Thal-Cercle-Trigo » (2024) | idem |
| M2-E2, M2-E4, M2-E6, M2-E7 | Maurizio MP2, Épreuve 2 « gén. fct + affines » (2025), Épreuve 4 « fct 2e degré » (2024), Épreuve 6 « Trigo » (2025), Épreuve 7 « Analyse de données » (2025) | `CFPT/xDATA Maurizio/Tests MP2` |

Les MP1 2026-2027 suivent le PEE 2026 ; les MP2 suivent encore l'ancien PEE (fonctions en S3, trigonométrie S3–S4,
inéquations en MP1). Dans le PEE 2026 les inéquations ne sont plus en MP 1re (elles sont en S8, MP 4e).

## 2. Objectifs et étalons par chapitre

Étalons repris des épreuves (valeurs d'origine quand le texte est lisible), désignés `E-<chapitre>-<n>` dans `tools/niveau.json`.

### MP 1re (PEE S1–S2)

**CN. Calcul numérique** (S1.CN.01–15, Chap01) — ensembles, valeur absolue, intervalles, écritures, 4 opérations,
signes et hiérarchie, divisibilité et nombres premiers (\*), PGDC/PPMC (\*), fractions, puissances, racines, dénominateur (\*).
- E-CN-1 (T11 Q1–Q3, M1-E1 ex. 1–3) : ensemble le plus restrictif de √49, −12/4, 0,3, π/2 ; (10 − 28 : 2) · 2 − 3 − √64 (3 étapes) ;
  8/12 − 15/18 + 21/15 ; 21/15 ÷ 14/25 (fraction irréductible).
- E-CN-2 (T11 Q4, M1-E1) : Léa dépense le quart de son argent de poche, puis les deux tiers du reste ; il reste 15 francs.
- E-CN-3 (T11 Q5–Q8) : (3² · 3⁵)^… ; 7⁸ / (7² · 7⁻⁵) ; 8¹² · 2²⁵ / 4²⁸ = 2^… ; 0,042 · 10⁴ en décimal ; 0,000'000'58 en
  notation scientifique ; (4 · 10^a)(3 · 10^b) / (6 · 10^c) en notation scientifique.
- E-CN-4 (T11 Q2, Q9–Q10 ; M1-R1 ex. 9–10) : décomposer 117 et 3'600 ; √12 + 7√3 − 2√27 ; 6/√5.

**CA. Calcul algébrique** (S1.CA.01–14, Chap02–02b).
- E-CA-1 (M1-R2 ex. 1–3) : 5x − x + 2 − 3x + 13 − 9x ; 3x²y · (−2xy³z) ; (−5y²)³ ; 5a − {2a − 1 − (3 + 6a − [8 − a] − 2) + 7a}.
- E-CA-2 (M1-R2 ex. 5–6, M1-E3 ex. 1–2) : (2x − 5)² ; (3x + 4y)(3x − 4y) ; (√7x + √7)² ; (x + 2)(x − 2)(x + 3) − (x − 4)² − 5(x + 1).
- E-CA-3 (T13 Q1–Q5, M1-E3 ex. 3–6) : « factorisations directes » 7x − 7y, x² − 49, x² − 6x + 9 ; 5a(b + 7) − (b + 7) ;
  2ab − 6a − 7b + 21 ; x² − 2x − 24 ; 2x² + 7x + 3 ; (2y − 3)² − (5y + 6)² ; 2x³ − 12x² + 18x.
- E-CA-4 (POLY Chap02b, S1.CA.10–14) : valeurs interdites, simplifier, opérations sur les fractions rationnelles ; isoler une grandeur.

**EQ. Équations** (S1.EQ.01–08, Chap03).
- E-EQ-1 (M1-R4 ex. 1–2) : écrire une équation avec une, aucune, une infinité de solutions ; 3(4x − 1) + 13 = −6x + 4(4x + 3) ;
  3√5 y − 5 = 7√5 y + 14.
- E-EQ-2 (M1-R4 ex. 4–5) : concert, 248 personnes, billets à 36 et 22 CHF, recette 7'654 CHF ; Léon a 26 ans de moins que son père…
- E-EQ-3 (M1-E5 ex. 1–6) : 2x² − 12x + 18 = 0 ; boulet d(t) = −5t² + … ; jardin carré agrandi de 500 m² ; trois impairs consécutifs.
- E-EQ-4 (M1-E6 ex. 1–3) : équation en x à paramètre m, discuter ; m pour une seule solution d'une équation du 2e degré ; équation rationnelle.

**GE. Géométrie** (S2.GE.01–09, Chap04).
- E-GE-1 (M1-E7 ex. 4, M1-E9 ex. 1–3) : Thalès, aire et périmètre du quadrilatère ADEC ; hauteur de la Burj Khalifa par les
  ombres ; diagonale d'un parallélépipède (AB = 16, BC = 14, AD = 72).
- E-GE-2 (M1-E7 ex. 5–6, M1-E9 ex. 4–5) : angles inscrits et au centre (α, γ, δ) ; secteur de pizza (arc 15 cm, rayon 10 cm).

**TR. Trigonométrie du triangle rectangle** (S2.TR.01–05, Chap05).
- E-TR-1 (M1-E9 ex. 6–7) : AB = 8 km, angle CAB = 38°, calculer BC ; angle ABC depuis deux côtés.

**SY. Systèmes** (S2.SY.01–05, Chap06).
- E-SY-1 (M1-R8, M1-E7 ex. 1–3) : 3x − 2y = 1 et 2x + 5y = 4 (par addition) ; 3x = 18 − 6y et y = 3 − x/2 ; système 3 × 3 ;
  concert à deux inconnues.

**FO. Fonctions : généralités** (S2.FO.01–06, Chap07).
- E-FO-1 (POLY Chap07 ; M2-E2 ex. 1–2, même contenu dans l'ancien PEE) : f(x) = (3x − 1)/2 : f(5), préimage de −7, ordonnée à
  l'origine, zéro, f⁻¹(2) ; domaines de 2(x − 3)(x + 4) / (x(x − 1)(x + 4)) et de √(x + 10).

### MP 2e (ancien PEE, S3–S4)

- E-FA-1 (M2-E2 ex. 3–8) : droite par A(−4 ; 3) et B(5 ; −3) ; intersection de 2x − 3y − 5 = 0 et 4x + y + 2 = 0 ; m pour
  perpendiculaire ou parallèle ; réciproque de f(x) = (2/3)x − 1 ; batterie (65 % à 10 h, 22 % à 15 h) : modèle affine.
- E-FQ-1 (M2-E4) : 6x² − 10x − 4 en forme factorisée et canonique ; intersections de deux paraboles ; parabole par trois points ;
  sauterelle h(t) ; enclos de 320 m le long d'une rivière ; prix d'une application qui maximise le revenu.
- E-TG-1 (M2-E6) : aires de triangles ; 75° en radians ; angle α avec deux solutions (théorème du sinus) ; angles en radians
  dont sin = √3/2, cos = √2/2, tan = √3/3 ; plinthes (cosinus) ; sin x = 0,6, 4 tan(x/2) = √48, cos(3x) + 0,5 = 0,2.
- E-AD-1 (M2-E7) : série 2 ; 6 ; 6 ; 3 ; 5 ; 4 ; 7 ; 6 ; 5 ; 6 : effectifs cumulés, mode, médiane, moyenne, étendue, quartiles,
  écart interquartile, écart-type, boîte à moustaches ; nature des variables ; tour de tête de 40 élèves par classes.

## 3. Audit (page de sonde `tests/_niv_mp12.html`, non commitée : profil { CH, grade, track: "mp" }, notions de l'année dans
l'ordre du PEE, jusqu'à 4 formes distinctes par niveau 1–4)

Verdicts : **au niveau** ; **remonté** (niveau 1 corrigé le 25.11) ; **ajout** (notion du PEE ajoutée à l'année) ; **à valider**.
Le niveau 1 des notions du CO reprises en MP est tiré au niveau 2 (`UPMP`, `engine.js`) ; le niveau 2 ne monte pas
(contrairement au Collège), car les épreuves CFPT restent au niveau 2–3 de l'app.

### MP 1re (grade 12) — 59 notions (58 + droitesrem le 26.11)

| Ch. | Notion | N1 | N2 | N3 | N4 | Étalon | Remarque |
|---|---|---|---|---|---|---|---|
| CN | ensembles | au niveau | au niveau | au niveau | au niveau | E-CN-1 | |
| CN | vabs | à valider | au niveau | au niveau | au niveau | E-CN-1 | N1 « \|8 − 12\| » : S1.CN.02 à la lettre, mais niveau 9e |
| CN | fracconv | **ajout**, remonté | au niveau | au niveau | au niveau | E-CN-3 | S1.CN.04 ; N1 « 2,5 % en décimal » (9e) → N2 (périodiques, % ↔ fraction) |
| CN | sci | **ajout** | au niveau | au niveau | au niveau | E-CN-3 | N1 = T11 Q7 (0,000'000'58 en notation scientifique) |
| CN | fracadd | remonté | au niveau | au niveau | au niveau | E-CN-1 | N1 « 3/4 − 1/8 », « 4 + 5/6 » → N2 |
| CN | prio | **ajout**, remonté | au niveau | au niveau | au niveau | E-CN-1 | S1.CN.06 ; N1 « 22 − 12 : 4 » → N2 (relatifs, barre de fraction) |
| CN | rel | remonté | au niveau | au niveau | au niveau | E-CN-1 | N1 « (−4) · 2 » → N2, lui-même tiré au N3 dès la 11e (UP2) |
| CN | arith | remonté | au niveau | au niveau | à valider | E-CN-4 | pas de défi propre (N4 = une question de N3) |
| CN | fracmul | remonté | au niveau | au niveau | au niveau | E-CN-1, E-CN-2 | N1 « 9 · 1/6 », « 3/4 de 200 CHF » → N2 |
| CN | puiss | remonté | au niveau | au niveau | au niveau | E-CN-3 | N1 « 5⁴ · 5⁶ », « (−5)² » → N2 ; le défi = T11 Q5c–d |
| CN | scicalc | **ajout** | au niveau | au niveau | au niveau | E-CN-3 | N1 = T11 Q8 simplifié |
| CN | rac | remonté | au niveau | au niveau | à valider | E-CN-4 | N1 « √289 », « carré de 64 cm² » → N2 ; notion de 10e : la compétence S1.CN.14 est portée par racprop |
| CN | racprop | **ajout** | au niveau | au niveau | au niveau | E-CN-4 | N3 « √12 + √75 » = T11 Q9 |
| CN | ratden | au niveau | au niveau | au niveau | au niveau | E-CN-4 | |
| CN | divcrit | remonté | à valider | à valider | au niveau | E-CN-4 | S1.CN.07 (\*) : reste du niveau 9e même remonté |
| CN | premiers | remonté | au niveau | à valider | à valider | E-CN-4 | S1.CN.08 (\*) ; T11 Q2 « décomposer 3'600 » ; N3–N4 = une recomposition (2² · 3 · 5) |
| CN | fracsimp | remonté | à valider | à valider | à valider | E-CN-1 | S1.CN.10 (\*) : notion de 9e, N2–N4 restent du niveau CO |
| CN | fracops | remonté | au niveau | au niveau | au niveau | E-CN-1 | |
| CN | pctvar | remonté | au niveau | au niveau | au niveau | E-CN-2 | N1 « 60 CHF + 5 % » → N2 |
| CA | reduire | au niveau | au niveau | au niveau | au niveau | E-CA-1 | N1 = M1-R2 ex. 1a (« 5x − x + 2 − 3x + 13 − 9x ») : gardé |
| CA | monomes | **ajout**, remonté | au niveau | au niveau | au niveau | E-CA-1 | S1.CA.01–02 ; N1 « 3x · 4x » → N2 (« (−4a²b)(5ab⁴) ») |
| CA | distrib | remonté | au niveau | au niveau | au niveau | E-CA-1 | N1 « 6(7x + 2) » → N2 |
| CA | parenth | remonté | au niveau | au niveau | au niveau | E-CA-1 | N1 « 7 − (6x + 9) » → N2 |
| CA | polyop | au niveau | au niveau | au niveau | au niveau | E-CA-2 | |
| CA | idrem | au niveau | au niveau | au niveau | au niveau | E-CA-2 | N1 « (x − 7)² » = items de M1-R2 ex. 5 : gardé |
| CA | factor | au niveau | au niveau | au niveau | au niveau | E-CA-3 | N1 = T13 Q1 « factorisations directes » : gardé |
| CA | factor2 | au niveau | au niveau | au niveau | au niveau | E-CA-3 | |
| CA | fracrat | au niveau | au niveau | au niveau | au niveau | E-CA-4 | |
| CA | valint | au niveau | au niveau | au niveau | au niveau | E-CA-4 | |
| CA | formule | remonté | au niveau | au niveau | au niveau | E-CA-4 | N1 « v = d/t → d » → N2 |
| EQ | eq1 | remonté | au niveau | au niveau | au niveau | E-EQ-1 | N1 « 20 − 2x = 18 » → N2 (parenthèses, décimaux) |
| EQ | eqfrac | remonté | au niveau | au niveau | au niveau | E-EQ-1 | |
| EQ | eqspec | au niveau | au niveau | au niveau | au niveau | E-EQ-1 | = M1-R4 ex. 1 |
| EQ | eqparam | au niveau | au niveau | au niveau | au niveau | E-EQ-4 | |
| EQ | probeq | remonté | au niveau | au niveau | au niveau | E-EQ-2 | N1 « trois entiers consécutifs » → N2 |
| EQ | eq2 | remonté | au niveau | au niveau | au niveau | E-EQ-3 | N1 « (x − 8)(x + 1) = 0 » → N2 |
| EQ | eq2fact | remonté | au niveau | au niveau | au niveau | E-EQ-3 | N1 « x² = 121 » → N2 |
| EQ | eq2disc | au niveau | au niveau | au niveau | au niveau | E-EQ-3 | |
| EQ | trinfact | au niveau | au niveau | au niveau | au niveau | E-EQ-3 | |
| GE | exactes | au niveau | au niveau | au niveau | au niveau | E-GE-1 | |
| GE | pyth | remonté | au niveau | au niveau | au niveau | E-GE-1 | N1 « 7, 24 → 25 » → N2 (valeurs exactes, repère) |
| GE | pythfig | remonté | au niveau | au niveau | au niveau | E-GE-1 | |
| GE | pythrec | remonté | au niveau | au niveau | au niveau | E-GE-1 | |
| GE | thales | remonté | au niveau | au niveau | au niveau | E-GE-1 | N1 « AD = 5, AB = 10, BC = 8 » → N2 (papillon, erreur) |
| GE | euclide | au niveau | au niveau | au niveau | au niveau | E-GE-1 | |
| GE | angles | remonté | au niveau | au niveau | au niveau | E-GE-2 | N1 « complément de 25° » (9e) → N2 (angle au centre, inscrit) |
| GE | cercthales | remonté | au niveau | au niveau | au niveau | E-GE-2 | |
| GE | geocomb | remonté | au niveau | au niveau | au niveau | E-GE-1 | N1 « écran 5 × 12 » (Pythagore direct) → N2 |
| GE | droitesrem | **ajout** (26.11) | au niveau | au niveau, sans inscrit ni orthocentre | au niveau | Chap04 | S2.GE.02 ; voir § 6 |
| TR | trigo | au niveau | au niveau | au niveau | au niveau | E-TR-1 | |
| TR | trigexact | au niveau | au niveau | au niveau | au niveau | E-TR-1 | |
| SY | sys2 | remonté | au niveau | au niveau | au niveau | E-SY-1 | N1 « x + y = 3, x − y = −7 » → N2 (« −4x − 5y = 9, −6x + 2y = −15 ») |
| SY | sys3 | au niveau | au niveau | au niveau | au niveau | E-SY-1 | |
| SY | sysgraph | au niveau | au niveau | au niveau | au niveau | E-SY-1 | |
| SY | sysprob | remonté | au niveau | au niveau | au niveau | E-SY-1 | N1 « âges, 31 ans et 3 ans de plus » → N2 |
| FO | fimg | au niveau | au niveau | au niveau | au niveau | E-FO-1 | |
| FO | domaine | au niveau | au niveau | à valider | au niveau | E-FO-1 | N3 « √(x² − 3x − 4) » demande une inéquation du 2e degré, plus au PEE 2026 de MP 1re |
| FO | inter | au niveau | au niveau | au niveau | au niveau | E-FO-1 | |
| FO | lectgraph | au niveau | au niveau | au niveau | au niveau | E-FO-1 | |

### MP 2e (grade 13) — 21 notions

| Ch. | Notion | N1 | N2 | N3 | N4 | Étalon | Remarque |
|---|---|---|---|---|---|---|---|
| FA | affine | remonté | au niveau | au niveau | au niveau | E-FA-1 | N1 « f(5) pour f(x) = −2x + 3 », « lis b » (10e–11e) → N2 (expression par deux points) |
| FA | droites | au niveau | au niveau | au niveau | au niveau | E-FA-1 | |
| FA | recipaff | à valider | au niveau | au niveau | au niveau | E-FA-1 | N1 « f(x) = x + 2 → f⁻¹ », « (2 ; 0) → (0 ; 2) » : automatisme de l'année, mais très court |
| FA | affzero | remonté | au niveau | au niveau | au niveau | E-FA-1 | N1 « zéro de 3x + 12 » → N2 (signe, zéro fractionnaire) |
| FA | modaff | remonté | au niveau | au niveau | au niveau | E-FA-1 | N1 « 65 + 3 · 9 » → N2 (offres, expression) |
| FA | droitesinter | remonté | au niveau | au niveau | au niveau | E-FA-1 | N1 « coupe l'axe des ordonnées » (réponse dans l'énoncé) → N2 ; voir § 5 pour la 2e Collège |
| FQ | f2 | au niveau | au niveau | au niveau | au niveau | E-FQ-1 | |
| FQ | f2formes | au niveau | au niveau | au niveau | au niveau | E-FQ-1 | |
| FQ | f2expr | au niveau | au niveau | au niveau | au niveau | E-FQ-1 | |
| FQ | f2trois | au niveau | au niveau | au niveau | au niveau | E-FQ-1 | |
| FQ | optim | au niveau | au niveau | au niveau | au niveau | E-FQ-1 | |
| TG | trigcercle | au niveau | au niveau | au niveau | au niveau | E-TG-1 | |
| TG | trigfn | au niveau | au niveau | au niveau | au niveau | E-TG-1 | |
| TG | sinlaw | au niveau | au niveau | au niveau | au niveau | E-TG-1 | |
| TG | trigeq | au niveau | au niveau | au niveau | au niveau | E-TG-1 | l'épreuve demande aussi des solutions en radians et à la calculatrice (sin x = 0,6) : l'app reste en degrés et valeurs exactes |
| TG | trigassoc | au niveau | au niveau | au niveau | au niveau | E-TG-1 | |
| TG | trigeq2 | au niveau | au niveau | au niveau | au niveau | E-TG-1 | |
| TG | triaire | au niveau | au niveau | au niveau | au niveau | E-TG-1 | |
| AD | statfreq | à valider | au niveau | au niveau | au niveau | E-AD-1 | N1 « 60 % de 400 personnes » = pourcentage du CO ; les autres formes (fréquence, tableau) sont au niveau |
| AD | stats | au niveau | au niveau | au niveau | au niveau | E-AD-1 | moyenne d'une série : retirée de la 4e Collège (niveau CO), mais c'est S4.AD.05 et M2-E7 ex. 1 en MP 2e |
| AD | quartiles | au niveau | au niveau | au niveau | au niveau | E-AD-1 | |

Aucune notion n'est « trop difficile pour la MP » : niveaux 3 et défis restent dans le registre des épreuves CFPT
(2 à 4 étapes, nombres simples). Aucun chapitre vide : CN (19), CA (11), EQ (9), GE (9 ; 10 avec droitesrem, 26.11), TR (2), SY (4), FO (4) en MP 1re ;
FA (6), FQ (5), TG (7), AD (3) en MP 2e. Avant l'audit, le chapitre CN de MP 1re n'avait ni la hiérarchie des opérations
(S1.CN.06), ni la notation scientifique (S1.CN.04, T11 Q6–Q8), ni la simplification des racines (S1.CN.14, T11 Q9) :
ces notions étaient traitées comme des notions antérieures du CO.

## 4. Corrections du 25.11

- `src/engine.js` : `UPMP` (filière mp seulement) — MP 1re : niveau 1 → 2 pour 31 notions du CO reprises en MP
  (prio, rel, arith, fracadd, fracmul, fracsimp, fracconv, fracops, puiss, rac, premiers, divcrit, pctvar, monomes, distrib,
  parenth, formule, eq1, eqfrac, probeq, eq2, eq2fact, sys2, sysprob, pyth, pythfig, pythrec, thales, angles, cercthales,
  geocomb) ; MP 2e : affine, modaff, affzero, droitesinter. Le niveau demandé reste celui de la question (`keep`), le code
  reste reproductible ; les sujets de préparation (`sujet.js`, `Engine.make`) en profitent sans `minA`.
  Gardent leur niveau 1 : les notions propres au PEE MP, et reduire, idrem, factor, sci, scicalc, racprop, dont le niveau 1
  correspond aux premiers items des épreuves CFPT (T11 Q7, T13 Q1, M1-R2 ex. 1).
- `src/ch_mp1.js` : prio, fracconv, sci, scicalc, racprop, monomes ajoutées à l'année de MP 1re (`MP: [12, "S1"]`, rang et
  chapitre MP dans `ORDRE.MP` / `ORDRE_THEME.MP`).
- `tools/niveau.json` : 79 entrées (58 MP 1re, 21 MP 2e) ; `par_classe["MP 1re"]` / `["MP 2e"]` pour les notions déjà
  au registre pour une autre classe.

## 5. À faire valider par l'enseignant

1. **Notions \* de calcul numérique** (fracsimp, divcrit, premiers ; S1.CN.07–10, « ajout du groupe CFPT ») : même remontées
   d'un niveau, fracsimp et divcrit restent du niveau 9e (« simplifier 42/60 », « chiffre manquant pour être divisible par 6 »).
   Les garder en MP 1re (révision du CO, T11 Q2 évalue la décomposition), ou les sortir de l'année (elles reviendraient alors
   seulement si le parcours de l'élève le demande, Engine.oldNeed) ?
2. **Niveau 1 gardé tel quel** pour reduire, idrem, factor (« (x − 7)² », « 5x² + 5x », « 8y − 3 + y − 7 ») parce que tes
   épreuves de MP 1re ouvrent par ces items (Test S1.3 Q1 « factorisations directes ») : d'accord, ou remonter comme au Collège ?
3. **vabs N1** (« \|8 − 12\| ») et **recipaff N1** (« f(x) = x + 2 → f⁻¹ ») : automatismes de l'année (S1.CN.02, S3.FA.06), mais très courts.
4. **domaine N3** « √(x² − 3x − 4) » : demande une inéquation du 2e degré, plus au PEE 2026 de MP 1re (les inéquations sont en S8) ;
   le garder (les MP2 actuels ont eu les inéquations en MP1, M1-E6) ou le réserver au Collège ?
5. **statfreq N1** « 60 % de 400 » : pourcentage du CO dans la notion « fréquences » : le remplacer par une fréquence à calculer ?
6. **Défis manquants** : arith, rac, premiers, fracsimp n'ont pas de défi en plusieurs étapes (le niveau 4 retombe sur une
   question de niveau 3).
7. **2e Collège, droitesinter N1** : la forme « en quel point la droite y = −½x − 3 coupe-t-elle l'axe des ordonnées ? »
   donne la réponse dans l'énoncé (et « y = 2x − 5 coupe y = −5 » donne x = 0) ; corrigé pour la MP 2e par UPMP, pas pour
   la 2e Collège (hors du périmètre de cet audit).
8. **Banques riches** : MP 1re n'a qu'une banque (cnmp1, calcul numérique) ; les chapitres CA, EQ, GE, SY, FO de MP 1re
   tirent leurs sujets de préparation des banques génériques.

## 6. Trous du référentiel MP comblés (26.11, agent trousmp)

- **S1.CN.04** (passer d'une écriture à l'autre) : rattaché à `fracconv` et `sci`, déjà notions de l'année de MP 1re
  depuis le 25.11 (`src/ch_mp1.js`) mais sans motif MP. Formes vérifiées par tirages : fraction ↔ décimal ↔ %, nombres
  périodiques, % successifs (N3, défi « trois magasins »), notation scientifique ↔ décimal, conversions d'unités en
  notation scientifique (N2–N3), défis astronomie / microscopie.
- **S2.GE.02** (médiane, bissectrice, médiatrice) : `droitesrem` ouverte en MP 1re, semestre 2 (`MP: [12, "S2"]`,
  rang et chapitre GE déjà dans `ORDRE.MP`). Étalon : polycopié MP1 Chap04 « Droites remarquables du triangle »
  (définitions, points de concours, G aux 2/3, triangle isocèle ; l'exercice du polycopié est une construction).
  Gardé : N1 CG, GM, cercle circonscrit du triangle rectangle ; N2 médiane depuis BG, hauteur (angle BAH), angle BIC des
  bissectrices ; N3 équilatéral (rayon exact), angle AIB, isocèle (Pythagore puis 2/3), point de la médiatrice
  (Pythagore) ; N4 défis (triangle rectangle : cercle circonscrit, G, hauteur). Écarté pour la filière MP (`HORS_MP`,
  `src/engine.js`, par ctx) : rayon du cercle inscrit par la formule r = (a + b − c)/2 (pas au cours) et angle BHC à
  l'orthocentre (quadrilatère à deux angles droits) ; ces formes restent au Collège. Pas de `UPMP` (notion propre au PEE).
- **S5.EA.04** (équations paramétriques avancées, facultatif) : `eqparam` niveaux 2–3 (Δ = 0, infinité, écart des
  solutions, seuil), notion de MP 1re déjà au catalogue des MP 3e.
