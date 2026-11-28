# Niveau réel de la 1re du Collège de Genève — audit de 5min2maths

Établi le 24.11.2026 (agent niv1c), après l'alerte de l'enseignant : « dans le thème Argumenter, on demande à un élève de 1re ce
qu'on demanderait à un élève de 9e ». Usage interne. Classe : 1re du Collège (grade 12, filière gymnasiale, MA1 normal et MA2
avancé : en 1re, même programme, MA2 va plus vite et plus loin dans les épreuves). Registre machine : `tools/niveau.json`.

## 1. Sources

| Source | Où | Ce qu'on en tire |
|---|---|---|
| Programmes du Collège de Genève 2021, maths p. 80–83 (1re–2e MA1/MA2) | `~/DATA/Enseignement/Sources/Officiel/sism_college_geneve/programme_cdg_2021.txt` | **Le programme officiel de 1re** : algèbre (polynômes, identités, factorisation, équations 1er et 2e degré, degré > 2 par factorisation, systèmes 2×2 et 3×3), fonctions (domaine, graphes, images, 1er et 2e degré, racine et inverse, problèmes), géométrie (angles, Pythagore–Euclide–hauteur et leurs démonstrations, similitude, droites remarquables, trigonométrie du triangle rectangle) ; objectif transversal : « s'initier à l'argumentation logique… distinguer hypothèse et conclusion » |
| PEC fédéral 2024 (CDIP) | `…/Officiel/College_GE/Plan-etudes-cadre-ecoles-maturite.pdf` | Cadre national (raisonner, démontrer, modéliser) |
| Référentiel matu de l'enseignant (compétences `1.AL.01a`…, `1.FO…`, `1.GE…`) | `~/Dropbox/2026-2027/Matu/Referentiel/referentiel_matu.csv` | Découpage fin compétence par compétence (aucune ligne « Argumenter » : chapitre ajouté par SESA_FIX) |
| Manuel Sésamath Ma1 (matu gym 1re), 10 chapitres, « À savoir en fin de chapitre » et exercices | `~/DATA/Enseignement/Sources/Web/sesamath_matugym/fichiers/manuel-matugym-1e/` | **Ce que les élèves font vraiment**, chapitre par chapitre (notamment Ch3 Argumenter : th. 1–6, ex. 1–40) |
| Épreuves regroupées Sismondi 2023-24 : 1MA2 (20.12.2023, S1, sans calculatrice) et 1MA1 (06.06.2024, S2) | `…/sism_college_geneve/2023-2024_SISM_1_MA*_DF_énoncé_corrige.pdf` | **Niveau réel d'une évaluation de 1re** (étalons ci-dessous) |
| Cours et épreuve d'un collègue 1MA2 (ch. 6 Logique et raisonnement ; épreuve 2 calcul algébrique) | `~/DATA/Enseignement/Sources/Collegues/Friedli/` | Logique en 1MA2 : négation, quantificateurs, implication, réciproque, contraposée, absurde (√2) ; niveau du calcul algébrique |
| Admission en 1re (COPAD 2024, objectifs 2022) | `~/DATA/Enseignement/Sources/Officiel/admission_secondaire2_GE/` | **Plancher** : ce qui est exigé à l'entrée = fin de 11e. Une question de ce niveau est « trop facile » pour la 1re |
| Exercices riches de 1re déjà dans l'app | `src/riche_1c.js`, `src/riche_sys1c.js` | Format des problèmes autocorrigés |

## 2. Objectifs et étalons par chapitre (Sésamath Ma1)

Un **étalon** est un exercice type du niveau réel d'une évaluation de 1re, rédigé d'après les sources (réf. `E3.2` = chapitre 3,
étalon 2). MA1 et MA2 ont le même programme en 1re ; MA2 : épreuves sans calculatrice, plus de calcul littéral et d'inéquations.

### M1C01 · 1. Nombres
Objectifs (Ma1 Ch1, programme « consolider le CO ») : calculs à parenthèses imbriquées, PGDC/PPMC et division euclidienne,
fractions irréductibles, nombres périodiques ↔ fractions, puissances entières relatives, écriture scientifique, racines carrées :
extraire les facteurs carrés, simplifier, **rendre rationnel le dénominateur** ; irrationalité de √2.
- **E1.1** Calculer sans calculatrice et donner la fraction irréductible : \((\frac{2}{3} - \frac{5}{4}) \div (1 + \frac{1}{6})\) → \(-\frac{1}{2}\).
- **E1.2** Écrire comme puissance de 2 : \(\frac{2^3 \cdot 4^{-2}}{8^{-1}}\) → \(2^2\).
- **E1.3** Simplifier \(\sqrt{72} - 3\sqrt{8} + \sqrt{50}\) → \(5\sqrt{2}\).
- **E1.4** Rendre rationnel le dénominateur : \(\frac{6}{3 - \sqrt{3}}\) → \(3 + \sqrt{3}\).
- **E1.5** Écrire \(0{,}\overline{36}\) sous forme de fraction irréductible → \(\frac{4}{11}\).

### M1C02 · 2. Ensembles
Objectifs (Ma1 Ch2) : ensembles de nombres ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ, appartenance, inclusion, ∪, ∩, \, intervalles, diagrammes de Venn.
- **E2.1** \(A = [-4 \,;\, 5[\), \(B = ]0 \,;\, 9]\) : écrire \(A \cap B\), \(A \cup B\), \(A \setminus B\).
- **E2.2** Traduire « les réels dont la distance à 5 est au plus 3 » en intervalle → \([2 \,;\, 8]\).
- **E2.3** Classer \(-3\), \(0{,}5\), \(\sqrt{16}\), \(\frac{2}{3}\), \(\sqrt{2}\), \(\pi\) dans ℤ, ℚ, ℝ \ ℚ.

### M1C03 · 3. Argumenter
Objectifs (Ma1 Ch3 ; programme : « argumentation logique… distinguer hypothèse et conclusion ») : traduire en langage algébrique
(pair 2k, impair 2k + 1, multiple, consécutifs, « se termine par » 10k + c) ; conjecture, contre-exemple, démonstration directe ;
implication, hypothèse et conclusion ; réciproque, contraposée, équivalence. MA2 (cours 1MA2) : en plus négation (et/ou,
quantificateurs) et démonstration par l'absurde (√2 irrationnel). **divcrit et tradexpr (critères de divisibilité, phrase → calcul
numérique) sont du 9e : prérequis, pas contenu de 1re.**
- **E3.1** (Sésamath ex. 24) « Un multiple de 10 est un multiple de 30 » : l'écrire sous forme d'implication, vraie ou fausse ?
  Énoncer la réciproque, la contraposée ; vraies ou fausses ? Justifier.
- **E3.2** (Sésamath ex. 15, cours 1MA2 ex. 6.11) Démontrer que la différence des carrés de deux nombres pairs consécutifs est
  un multiple de 4 : \((2n + 2)^2 - (2n)^2 = 4(2n + 1)\).
- **E3.3** (Sésamath th. 5) « \(n^2 + n + 41\) est premier pour tout n » : trouver un contre-exemple (n = 40).
- **E3.4** (épreuve 1MA2, ex. 6) Trois entiers consécutifs : le carré du premier égale la somme des deux autres. Lesquels ?
- **E3.5** (cours 1MA2 ex. 6.1, 6.7) Nier « tous les entiers > 8 sont premiers » ; « si n − 3 est un multiple de 8, alors
  n² − 1 est un multiple de 8 » : vrai ou faux ?

### M1C04 · 4. Fonctions
Objectifs (Ma1 Ch4 ; 1.FO.01–04, 1.FO.10–11) : domaine (quotient, racine, les deux, en intervalles), images et préimages
(calcul et lecture), zéros, signe et tableau de signes lus sur un graphique, variations, fonctions de référence (carré,
racine, inverse, valeur absolue), modéliser.
- **E4.1** (1MA1 ex. 3d) Domaines de \(h(x) = \sqrt{x - \frac{1}{2}}\) et \(j(x) = \frac{1}{\sqrt{x - \frac{1}{2}}}\).
- **E4.2** Lire sur un graphique les préimages de 2, les zéros, le tableau de signes et les intervalles de croissance.
- **E4.3** Intersection de \(f(x) = \frac{6}{x}\) et \(g(x) = x + 1\) (équation du 2e degré, deux points).
- **E4.4** Résoudre \(\sqrt{x + 5} = x - 1\) en vérifiant les solutions.

### M1C05 · 5. Degrés 0 et 1
Objectifs (Ma1 Ch5 ; 1.AL.04, 1.AL.07, 1.FO.05–06) : équations du 1er degré (fractions, parenthèses, impossibles, identités),
formules, problèmes ; droites (pente, parallèles, perpendiculaires, par deux points) ; systèmes 2×2 (trois méthodes,
interprétation graphique) et 3×3 ; inéquations du 1er degré.
- **E5.1** (1MA2 ex. 3a) \(\frac{x}{2} - \frac{x - 1}{3} = 1 + \frac{3x + 1}{4}\) → \(x = -\frac{11}{7}\).
- **E5.2** (1MA2 ex. 4a) \(4x - (2x - 3) < 5(x + 3)\) → \(x > -4\).
- **E5.3** (1MA1 ex. 5) Tarif affine : 7 films → 55 CHF, 12 films → 80 CHF ; trouver P(n), le prix fixe, le nombre de films pour 105 CHF.
- **E5.4** (1MA2 ex. 5) Pièces de 2 et de 5 CHF, 102 pièces de moins après l'échange : quelle somme ? (340 CHF)
- **E5.5** Système 3×3 à coefficients entiers ; droite perpendiculaire à une droite donnée passant par un point.

### M1C06 · 6. Calcul littéral
Objectifs (Ma1 Ch6 ; 1.AL.01–03) : développer et réduire des produits de polynômes, identités remarquables (aussi à plusieurs
lettres), factoriser au maximum (mise en évidence, identités, somme-produit, groupements, combinaisons).
- **E6.1** (1MA2 ex. 1) Développer et réduire \(3x(1 - 2x) - (2x - 1)^2\) ; \((2a + 1)(4a^2 + 1)(2a - 1)\) ; \((2x - 1)(2 - 3x) + 2(x + 3)^2\).
- **E6.2** (1MA2 ex. 2) Factoriser au maximum \(27x^3 + 36x^2 + 12x\) ; \((2x - 1)^2 + (2x - 1)(x^2 - 14)\) ; \((x - 5)^2 - (3x + 2)^2\) ; \(2x^2 + 9x - 5\).
- **E6.3** (épreuve 1MA2 d'un collègue) Développer \((x - 1)(x + 1)(x^2 + 1)\).

### M1C07 · 7. Degré 2
Objectifs (Ma1 Ch7 ; 1.AL.05–06, 1.FO.07–09, 1.FO.12) : équations du 2e degré (incomplètes, produit nul, formule), factoriser par
les zéros, degré > 2 et bicarrées ; parabole (zéros, sommet, formes, expression depuis le graphe ou trois points) ; intersections ;
optimisation ; inéquations du 2e degré (tableau de signes).
- **E7.1** (1MA1 ex. 3a) \(f(x) = -\frac{1}{2}x^2 + x + 4\) : zéros, sommet.
- **E7.2** (1MA2 ex. 3b) \(2(x - 1)^2 = 3x - 2\) → \(\{\frac{1}{2} \,;\, 2\}\).
- **E7.3** (1MA2 ex. 4b–c) \(-2(1 - 2x)(x - 3)^2 \le 0\) ; \(6x + 5 > 8x^2\).
- **E7.4** (1MA1 ex. 3c, 4) Résoudre \(f(x) \le g(x)\) par tableau de signes ; retrouver l'expression d'une parabole sur un graphique.
- **E7.5** (1MA2 ex. 6) Problème qui mène à \(n^2 = 2n + 3\) (entiers consécutifs).

### M1C08 · 8. De Thalès à Pythagore
Objectifs (Ma1 Ch8 ; 1.GE.02–04) : angles (opposés, alternes-internes, somme dans un polygone), triangles semblables,
Thalès et réciproque, Pythagore et réciproque, Euclide et hauteur (énoncés et démonstrations), problèmes combinés, droites
remarquables.
- **E8.1** (1MA1 ex. 2) Configuration papillon : (DE) ∥ (AB), longueurs données, calculer le périmètre de CDE.
- **E8.2** (1MA1 ex. 1) Aire d'une figure inscrite dans un rectangle de 18 × 10 (Pythagore, différence d'aires).
- **E8.3** Triangle rectangle : hauteur relative à l'hypoténuse 12, un segment 9 : l'autre segment, les cathètes, l'aire.
- **E8.4** Démonstration de Pythagore par les triangles semblables (non saisissable : voir § 4).

### M1C09 · 9. Cercles
Objectifs (Ma1 Ch9 ; 1.GE.01) : angle inscrit et angle au centre (énoncé, démonstration, usage avec justification), cercle
de Thalès, tangente ⊥ rayon, longueur d'arc et aire de secteur, aires « circulaires ».
- **E9.1** A, B, C, D sur un cercle de centre O, \(\widehat{ACB} = 33°\) : \(\widehat{AOB}\), \(\widehat{OAB}\), \(\widehat{ADB}\) en justifiant.
- **E9.2** Tangentes issues d'un point P à 15 cm du centre d'un cercle de rayon 9 cm : PT, aire de OTPT', corde TT'.
- **E9.3** Arc de 72° d'un cercle de rayon 5 cm : longueur de l'arc et aire du secteur (valeurs exactes).

### M1C10 · 10. Trigonométrie du triangle rectangle
Objectifs (Ma1 Ch10 ; 1.GE.05–06) : sin, cos, tan ; calculer côté et angle ; résoudre un triangle ; valeurs exactes 30°, 45°, 60° ;
sin² + cos² = 1, tan = sin/cos, angles complémentaires ; problèmes (élévation, deux visées, pente).
- **E10.1** Hauteur d'une tour visée sous 53° puis sous 39° après avoir reculé de 60 m.
- **E10.2** α aigu, \(\sin\alpha = \frac{2}{5}\) : \(\cos\alpha\) et \(\tan\alpha\) exacts.
- **E10.3** Triangle rectangle de côté adjacent 9 à un angle de 30° : côté opposé exact (\(3\sqrt{3}\)).

## 3. Audit (sonde `tests/_niv1c.html`, 24.11)

Méthode : pour chaque notion des chapitres M1C01–M1C10 (ORDRE_THEME.MATU et MATU_ALT), 3 tirages par niveau 1, 2, 3 et 4
(problème), comparés aux étalons. Codes : **A** au niveau ; **F** trop facile (niveau 9e–11e, en dessous de l'admission en 1re ou
égal) ; **H** hors programme de 1re ; **–** sans objet. Colonne « Correction » : ce qui a été fait le 24.11.

| Ch. | Notion | N1 | N2 | N3 | N4 | Exemple trop facile (avant) | Verdict / correction |
|---|---|---|---|---|---|---|---|
| 01 | arith | F | F | A | A | « plus grand diviseur de 16 et 40 » | remonté (UPC : N1→N2, N2→N3) |
| 01 | rel | F | F | A | A | « 10 − (−9) » | remonté (UPC) |
| 01 | fracops | F | A | A | A | « 1/3 − 4/7 » | remonté (UPC) |
| 01 | pct | F | F | F | F | « 15 % de 400 » | **retiré de 1re** (révision CO) |
| 01 | rac | F | F | F | F | « √256 » | **retiré de 1re** → racprop, ratden |
| 01 | racenc | F | F | F | A | « √148 entre deux entiers » | **retiré de 1re** |
| 01 | sci | F | F | A | A | « 4,2·10⁴ en décimal » | remonté (UPC) |
| 01 | puiss | F | A | A | A | « 7⁴·7² = 7^? » | remonté (UPC) |
| 01 | scicalc | F | F | A | A | « (4·10³)(5·10³) » | **retiré de 1re** |
| 01 | racprop | F | A | A | A | « (3√5)² » | **ajouté** à 1re + remonté (UPC) |
| 01 | ratden | A | A | A | A | — | **ajouté** à 1re (était MP seulement) |
| 01 | fracper | F | F | A | A | « 12e chiffre de 2/11 » | **ajouté** à 1re, niveau ≥ 3 (UPC_MIN) |
| 02 | ensembles | A | A | A | A | — | au niveau |
| 03 | tradexpr | F | F | F | F | « le triple de la différence entre 11 et 7 » | **retiré de 1re** (prérequis) |
| 03 | divcrit | F | F | F | F | « chiffre ■ pour que 7■0 soit divisible par 9 » | **retiré de 1re** (prérequis) |
| 03 | tradalg | A | A | A | A | — | **créé** (E3.2, E3.4) |
| 03 | contrex | A | A | A | A | — | **créé** (E3.3, E3.5) |
| 03 | demoalg | A | A | A | A | — | **créé** (E3.2) |
| 03 | implication | A | A | A | A | — | **créé** (E3.1, E3.5) |
| 04 | absval | A | A | A | A | — | au niveau |
| 04 | morceaux | A | A | A | A | — | au niveau |
| 04 | domaine | A | A | A | A | — | au niveau (E4.1) |
| 04 | tabval | F | F | A | A | « f(−5) pour x² − 6 » | remonté (UPC) |
| 04 | fimg | A | A | A | A | — | au niveau (N1 = automatisme de lecture) |
| 04 | lectgraph | A | A | A | A | — | au niveau |
| 04 | racinv | A | A | A | A | — | au niveau (E4.3, E4.4) |
| 04 | modaff | A | A | A | A | — | au niveau (E5.3) |
| 04 | transf | A | A | A | A | — | au niveau |
| 05 | ineq | F | A | A | A | « avec 27 CHF, combien de cahiers à 6,50 » | remonté (UPC) |
| 05 | eq1 | F | A | A | A | « 3 − 7x = 45 » | remonté (UPC) |
| 05 | eqfrac | F | A | A | A | « x/7 − 1 = −3 » | remonté (UPC) |
| 05 | eqspec | A | A | A | A | — | au niveau |
| 05 | formule | F | A | A | A | « F = m·a, isoler m » | remonté (UPC) |
| 05 | probeq | F | A | A | A | âges (10e) | remonté (UPC) |
| 05 | sys2, sysgraph, sys3 | A | A | A | A | — | au niveau |
| 05 | sysprob | F | A | A | A | billets de 10 et 20 | remonté (UPC) |
| 05 | affine | F | A | A | A | « f(1) pour 5x + 9 » | remonté (UPC) |
| 05 | affzero | A | A | A | A | — | au niveau ; défaut corrigé : « 8/2 x » non simplifié |
| 05 | sysineq | A | A | A | A | — | au niveau |
| 06 | reduire | F | F | A | A | « a − 4 − 8a − 9 » | remonté (UPC) |
| 06 | monomes | F | A | A | A | « 7x³ · 6x⁵ » | remonté (UPC) |
| 06 | polyop | A | A | A | A | — | au niveau (E6.1) |
| 06 | parenth | F | F | A | A | « (6x − 9) − (2x − 5) » | remonté (UPC) |
| 06 | distrib | F | F | A | A | « 2(3x + 1) » | remonté (UPC) |
| 06 | idrem | F | A | A | A | « (x + 8)(x − 8) » | remonté (UPC) |
| 06 | factor | F | A | A | A | « x² − 64 » | remonté (UPC) |
| 06 | factor2 | A | A | A | A | — | au niveau (E6.2) |
| 07 | ineqfrac | A | A | A | A | — | **à valider** : programme 2021 = 2e, mais tableau de signes en épreuve de 1re (E7.3, E7.4) |
| 07 | eq2fact, eq2disc, trinfact, probeq2, eq3, bicarre | A | A | A | A | — | au niveau (E7.2, E7.5) |
| 07 | eq2 | F | A | A | A | « (6 − x)(x + 3) = 0 » | remonté (UPC) |
| 07 | f2, f2formes, f2expr, f2trois, inter, interpar, ineq2, optim, eqirr | A | A | A | A | — | au niveau (E7.1, E7.4) |
| 08 | simil | F | A | A | A | échelle 1 : 50'000 | remonté (UPC) |
| 08 | thales | F | A | A | A | ombre d'un bâton | remonté (UPC) |
| 08 | pyth | F | A | A | A | « 3, 4 → 5 » | remonté (UPC) |
| 08 | pythfig | F | A | A | A | diagonale d'un écran 12 × 9 | remonté (UPC) |
| 08 | pythrec | F | F | A | A | « 24² − (15² + 20²) » | remonté (UPC) |
| 08 | euclide, droitesrem, exactes | A | A | A | A | — | au niveau (E8.3) |
| 08 | geocomb | F | A | A | A | diagonale d'un portail 8 × 15 | remonté (UPC) |
| 09 | angles | F | A | A | A | « complément de 54° » | remonté (UPC) |
| 09 | angtri | F | F | A | A | somme des angles d'un triangle (9e) | remonté (UPC) |
| 09 | cercthales | F | A | A | A | diamètre 5, AC = 3 → 4 | remonté (UPC) |
| 10 | trigrel, trigo, trigexact | A | A | A | A | — | au niveau (E10.1–E10.3) |

« Remonté (UPC) » : `src/engine.js` (`UPC`, `UPC_MIN`, dans `Engine.make`) : pour un élève du Collège (CH, filière gymnasiale,
grade ≥ 12), le niveau 1 de ces notions tire les formes du niveau 2, le niveau 2 celles du niveau 3. Le CO (9e–11e) et la MP ne
changent pas. Le code de question reste reproductible (…-2-… ou …-3-…).

**Lacunes signalées (pas de notion dans l'app)** : M1C09 longueur d'arc et aire de secteur (E9.3) ; M1C04 milieu, distance et
pente entre deux points (Ma1 Ch4) ; démonstrations de Pythagore, Euclide, angle inscrit (non saisissables : à travailler dans
les séries riches « raison »).

## 4. Corrections du 24.11

- **3. Argumenter** (`src/ch1c_arg.js`) : quatre notions de 1re, chacune 3 niveaux × 3 à 4 formes, pas à pas, pièges, ctx, leçon,
  indice, 3 compétences, 2 problèmes de niveau 4 à valeurs aléatoires :
  - `tradalg` traduire en langage algébrique (consécutifs, 2k / 2k + 1, 10k + c, restes, nombres renversés, problèmes d'entiers) ;
  - `contrex` conjecture et contre-exemple (« … est premier », « si p premier… », multiples, ensembles de contre-exemples réels,
    somme de m consécutifs) ;
  - `demoalg` démontrer en algèbre (mise en évidence, plus grand diviseur toujours présent, programmes de calcul, critères par 9,
    7, 11, irrationalité de √d par l'absurde) ;
  - `implication` implication, réciproque, contraposée, équivalence, raisonnements de la vie courante, négation de « et », « ou »,
    « si… alors », démonstration par la contraposée.
  Formats vérifiables : nombre ; expression (« 2k^2 + 2k ») ; ensemble de numéros (« 1 ; 3 », « aucune ») ; intervalle.
  `divcrit` et `tradexpr` deviennent des prérequis (PREREQ) ; série riche `RICH.arg1c` réécrite.
- **1. Nombres** : rac, racenc, pct, scicalc retirés de 1re (révisions du CO) ; racprop, ratden (rendre rationnel le dénominateur,
  objectif explicite de Ma1 Ch1), fracper (périodiques → fractions, niveau 3 au moins) ajoutés.
- **Notions du CO reprises en 1re** : niveau remonté (UPC), voir tableau.
- Registre : `tools/niveau.json` (une entrée par notion auditée).

## 5. Méthode réutilisable (11e, 2e, 3e, 4e, MP)

1. **Sources** : programme officiel de l'année (CO : PER et plan du DIP ; Collège : programme 2021 et PEC ; MP : PEE), manuel
   réellement utilisé (Sésamath, MER), **au moins une vraie épreuve de la classe** (Sismondi, collègues, examens VD),
   et le **plancher** = ce qu'on exige à l'entrée de l'année (fin de l'année précédente, tests d'admission). Extraire avec
   `pdftotext -layout` (formules souvent en image : rendre la page avec `pdftoppm -r 70 -png` et la lire).
2. **Objectifs par chapitre** (chapitres de `ORDRE_THEME` pour cette classe), puis **3 à 5 étalons** par chapitre, numérotés
   `E<chapitre>.<n>`, rédigés d'après les épreuves (citer la source).
3. **Sonde** : copier `tests/_niv1c.html` (non commitée) en changeant le préfixe de chapitre (`/^M1C/` → `/^M2C/`, CO : `CO_BY` et
   l'année) ; pour chaque notion, 3 tirages par niveau 1–4 ; le hash `#id1,id2` restreint, `#+id1,id2` ajoute des notions hors
   chapitre. Lancer une page à la fois (`chromium --headless --dump-dom`, nice), lire le `<pre>`.
4. **Classer** chaque notion × niveau : A / F / H, avec l'exemple qui prouve le verdict. Règle : un niveau 1 peut être un
   automatisme, mais un automatisme **de l'année** (pas de l'année d'avant) ; « F » si la question pourrait figurer dans le test
   d'admission ou dans l'épreuve de l'année précédente.
5. **Corriger**, par ordre de coût :
   - notion d'une année antérieure qui n'a rien à faire dans le chapitre : la retirer du chapitre (`ORDRE_THEME`, `again`,
     `SESA_FIX` / plans CO) → elle reste une révision ;
   - notion légitime mais niveau 1–2 trop bas : l'ajouter à `UPC` (ou `UPC_MIN`) — à étendre par classe si besoin
     (aujourd'hui : tout le Collège, grade ≥ 12) ;
   - contenu de l'année absent : créer les notions (standard du projet : 3 niveaux, ≥ 3 formes, pas à pas, pièges, ctx, leçon,
     indice, compétences, problème de niveau 4, ORDRE/ORDRE_THEME, `tools/referentiels.py`, PREREQ, pages de test).
6. **Tests** : `tests/pas_a_pas.html#section=ch1c#ids` (ou la page de la classe), `test`, `trivial`, `pieges` ; puis relancer la sonde.
7. **Registre** `tools/niveau.json` : une entrée par notion auditée
   `{ "classe", "plan", "etalon", "audit", "verdict" }` (verdict : « au niveau », « remonté », « hors programme », « à valider »),
   et un tableau d'audit dans `tools/niveau_<classe>.md`.
