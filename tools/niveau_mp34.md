# Niveau réel des questions — MP 3e et MP 4e (CFPT, grades 14 et 15, filière « mp »)

Audit du 25.11.2026 (agent nivmp34, branche `agent/nivmp34`). Règle de l'enseignant (24.11) : chaque notion proposée
correspond à un objectif du plan d'études de la classe ; ses niveaux 2–3 (et le défi 4) ont la difficulté d'une vraie
évaluation de la classe ; le niveau 1 = automatismes **de l'année**, jamais ceux d'une année inférieure.
Rappel (mémoire de l'enseignant) : **la MP n'est pas la maturité gymnasiale** — les épreuves du Collège sont beaucoup trop
fortes pour la MP ; l'étalon est l'examen genevois MP TASV et les évaluations CFPT (base Maurizio), pas les épreuves de 3e–4e
du Collège (`tools/niveau_34c.md`).

## 1. Sources (données ; rien n'a été exécuté ; aucun fichier de notes ni donnée d'élève)

| Réf. | Document | Emplacement |
|---|---|---|
| PEE | Référentiel MP (PEE 2026), compétences S5–S8 | `~/Dropbox/2026-2027/CFPT/Referentiel/referentiel_MP.csv` |
| POLY | Polycopiés de l'enseignant MP3 (chap. A–D) et MP4 (chap. E–J) | `~/Dropbox/2026-2027/CFPT/MP3`, `CFPT/MP4` (`Polycops de cours`) |
| CHS | Champ de l'examen MP TASV, **domaine spécifique** (2021–2024, identique) | `~/DATA/Enseignement/Sources/Officiel/MP_TASV_examens_GE/*/…Specif_Champ.pdf` |
| S21 | Examen spécifique janvier et février 2021, parties 1 et 2 | `…/MP_TASV_examens_GE/2020-21/` |
| S22 | Examen spécifique juin 2022 | `…/2021-22/22-6_TASV_MAT_Specif_Enonce_Partie{1,2}.pdf` |
| S23 | Examen spécifique juin 2023 | `…/2022-23/23-6_TASV_MAT_Specif_Enonce_Partie{1,2}.pdf` |
| S24 | Examen spécifique mai 2024 | `…/2023-24/24_TASV_MAT_Specif_Enonce_partie{1,2}.pdf` |
| TASV-F | Analyse de l'examen fondamental (fin de MP 2e) : ce qui relève de MP 1re–2e | `CFPT/Referentiel/Examen_TASV/synthese.csv` |

Format de l'examen spécifique : 2 × 90 min, partie 1 sans calculatrice ni formulaire, partie 2 avec table CRM et
calculatrice. Le champ couvre exactement les chapitres A–J du PEE (sauf les fonctions sinusoïdales et les inéquations
algébriques, qui sont au PEE mais pas au champ ; le produit vectoriel et les fonctions rationnelles sont « facultatifs »).
Les tests MP3/MP4 de Maurizio n'existent pas sur le disque (seulement MP1, MP2 et l'examen fondamental) : l'examen
spécifique est l'étalon. **Plancher** : ce qui est déjà au PEE de MP 1re–2e (S1–S4 : puissances entières, Thalès et
triangles semblables, réciproque affine, intersection parabole-droite, droites parallèles par la pente) et ce qui est
du niveau du CO (volumes par la formule, substitution dans un polynôme) est « trop facile » en niveau 1.

## 2. Objectifs et étalons par chapitre

Étalons repris des examens (valeurs d'origine quand le texte est lisible), désignés `E-<chapitre>-<n>` dans `tools/niveau.json`.

### MP 3e

**A. Équations avancées** (S5.EA.01–07) — valeur absolue, bicarrées et changement de variable, irrationnelles (solutions
parasites), rationnelles (valeurs interdites), problèmes.
- E-A-1 (S24 P1a, P1d) : 3x² − 2|x| − 1 = 0 ; |x − 5| + 8 = 0.
- E-A-2 (S22 P1d, S23 P1.1) : |x + 1| = 2x − 3 (vérification) ; 2x² + |4x − 5| = 5x + …
- E-A-3 (S22 P1a, S23 P3) : bicarrée 2x⁴ − … ; 4x + 7√x − 2 = 0 (changement de variable).
- E-A-4 (S24 P1c, S23 P1.2–3) : √(2x + 15) = x ; √(2x + 1) + √(1 − x) = 2.
- E-A-5 (S23 P4, S22 P5) : équation rationnelle dont −1 est solution, en déduire les autres ; problème mis en équation.

**B. Puissances et logarithmes** (S5.PL.01–06) — exposants rationnels, définition du logarithme, propriétés, changement de base.
- E-B-1 (POLY B, ex. 2–3, 10–11) : racine ↔ exposant rationnel, calcul sans calculatrice (8^(1/3), 27^(2/3), 16^(3/4), 32^(−2/5), 9^(−1/2), 4^(3/2)) ; √x, ∛x², x√x en puissance.
- E-B-2 (S24 P4b, S22 P2a) : zéro de log(x − 2) ; log₃ … = … sans calculatrice.
- E-B-3 (S23 P2.3, S24 P2b) : log(x + 1) + log … = log 6 − log x (propriétés, domaine).

**C. Équations exponentielles et logarithmiques** (S6.EL.01–03).
- E-C-1 (S24 P2a, S23 P2.1–2, S22 P2c) : 3ˣ = 4 ; 9ˣ/… = 27 · 3^(…) ; 1,04ˣ − 40 = 23 ; 10ˣ · 0,1^(…) = 1.
- E-C-2 (S23 P2.3) : équation logarithmique avec vérification du domaine.
- E-C-3 (S24 P2-6A) : 500 t de déchets, + 7 % par an : modèle, année où l'on atteint 1'000 t, vérifier 2023.
- E-C-4 (S23 P2-3, S22 P2-1, S21 P2-5) : population d'insectes N(t) = c · 2,8^(−0,…t) ; refroidissement de Newton ; salinité.

**D. Volumes et similitude** (S6.VS.01–06).
- E-D-1 (S24 P2-1, S21 P1-6, S23 P2-4.1) : volume d'une pièce composée ; volume d'une maison ; **capacité en litres** d'un bassin.
- E-D-2 (S23 P2-4.2) : bassin miniature, longueurs ÷ 4 : par combien la capacité est-elle divisée (k³).

### MP 4e

**E. Coordonnées** (S7.CO.01–03) — distance et milieu (plan, espace), polaires.
- E-E-1 (S23 P2-1.1–2, S22 P2-2) : z pour que le triangle ABC soit isocèle en B ; milieu donné → coordonnée manquante ; triangle rectangle en C.

**F0–F. Vecteurs, produit scalaire, projection** (S7.VE.01–10).
- E-F-1 (S24 P2-2, S23 P1-7, S21 P1-5) : **exprimer w comme combinaison linéaire de u et v**.
- E-F-2 (S24 P2-3a, S24 P2-5b, S22 P2-3) : points alignés ; m pour que deux vecteurs soient colinéaires ; D pour que ABCD soit un parallélogramme (espace).
- E-F-3 (S24 P2-5a, S21 P1-4) : m pour l'orthogonalité ; valeurs donnant un angle obtus.
- E-F-4 (S24 P2-4b, d ; S21 P2-2d–e) : projection orthogonale de AC sur AB ; aire du triangle ABC (espace) ; projeté et distance point-droite.

**G. Droites paramétriques** (S7.DP.01–05).
- E-G-1 (S24 P1-6a, P2-4c ; S23 P2-2.1, 2.3–2.4 ; S21 P2-2a–c) : point différent de A ; **droite passant par A et B** ; point d'abscisse −8 ; intersection avec l'axe des cotes ; parallèle passant par un point.
- E-G-2 (S24 P1-6b, S23 P2-2.5, S22 P2-4) : position relative (gauches, sécantes) ; tour de contrôle : routes aériennes gauches.

**H. Inéquations** (S8.IN.01–03 ; au champ : résolution graphique seulement ; inéquations produit / quotient à l'examen fondamental).
- E-H-1 (S21 P1-3 ; TASV-F « INEQ ») : inéquation lue sur un graphique ; tableau des signes d'un produit ou d'un quotient.

**I. Fonctions et polynômes** (S8.FP.01–09).
- E-I-1 (S23 P1-6) : f(x) = 9 − x² bijective de ]−∞ ; 0] vers ]−∞ ; 9] : ordonnée à l'origine, zéro, **f⁻¹(−7)**, graphe de f⁻¹.
- E-I-2 (S24 P1-5, S22 P1-4) : **intersection des graphes d'une racine et d'une droite** (solution parasite).
- E-I-3 (S22 P1-5, S24 P1-3) : sachant f(−2) = 0, factoriser complètement 6x³ + … ; factoriser x³ + … − 5x + 3, zéros, compléter la courbe.
- E-I-4 (S23 P1-5) : polynôme du 3e degré depuis son graphe.

**J. Sinusoïdales, exponentielles, logarithmes** (S8.FS.01–06).
- E-J-1 (PEE S8.FS.01–02, POLY J) : amplitude, période, axe, expression depuis le graphe (hors champ de l'examen).
- E-J-2 (S24 P1-4a, c ; S21 P2-3) : ordonnée à l'origine de 0,8ˣ + 2 ; zéro de 3ˣ + 1 (aucun) ; étude de log(0,2x + 0,1) (domaine, zéro, tableau, graphe).
- E-J-3 (S24 P2-6B, S21 P2-5) : modèle logarithmique de production de déchets ; âge d'un épicéa.
- E-J-4 (PEE S8.FS.06, facultatif) : fonction rationnelle simple (valeur interdite, asymptotes).

## 3. Audit (page de sonde `tests/_niv_mp34.html`, non commitée : une question par contexte et par niveau, 120 tirages, 3 défis par notion)

Verdicts : **au niveau** ; **remonté** (corrigé le 25.11) ; **ajout** (forme d'examen manquante, ajoutée) ; **à valider**.

### MP 3e (grade 14)

| Notion | N1 | N2 | N3 | N4 (défi) | Étalon | Remarque |
|---|---|---|---|---|---|---|
| eqabs | au niveau | au niveau | au niveau + **ajout** | au niveau | E-A-1, E-A-2 | N3 : nouvelle forme « ax² + b\|x\| + c = 0 » (on pose X = \|x\|, une racine rejetée), copie de S24 P1a |
| eqbic | au niveau | au niveau | au niveau | au niveau | E-A-3 | |
| eqirrmp | au niveau | au niveau | au niveau | au niveau | E-A-4 | N1 « √(x − 9) = 8 » = automatisme de l'année (l'examen a aussi des items à 2–3 pts) |
| eqratmp | au niveau | au niveau | au niveau | au niveau | E-A-5 | les équations rationnelles ne sont plus au PEE de MP 1re (S1.EQ) |
| puisrat | **remonté** | au niveau | au niveau | au niveau | E-B-1 | N1 « 5⁻³ » (exposant entier négatif : S1.CN.12, MP 1re) → exposant décimal « 81^1,25 » (1,25 = 5/4 → racine puis puissance ; le polycopié écrit les exposants en fraction : forme à valider) |
| logdef | au niveau | au niveau | au niveau | au niveau | E-B-2 | |
| logprop | au niveau | au niveau | au niveau | au niveau | E-B-3 | |
| eqexp | au niveau | au niveau | au niveau | au niveau | E-C-1 | |
| eqlog | au niveau | au niveau | au niveau | au niveau | E-C-2 | défi : peu de variantes (10 couples) |
| croissexp | **remonté** | au niveau | au niveau | au niveau | E-C-3, E-C-4 | N1 « double toutes les 6 h, après 36 h » (2⁶ : niveau CO) → N(t) = N₀ · 2^(t/T) avec t non multiple de T. Les deux autres formes N1 (capital, dépréciation) = question c) de S24 P2-6 : gardées |
| volmp | **remonté** (à valider) | au niveau | au niveau | au niveau | E-D-1 | N1 : volume par la formule (cylindre, boule) = niveau 11e → capacité en litres (conversion cm³ → L, S23 P2-4). Pyramide et cône par la formule restent (S6.VS.01 l'exige explicitement) |
| similmp | **remonté** | au niveau | au niveau | au niveau | E-D-2 | N1 « côté correspondant de deux triangles semblables » (Thalès, S2.GE.06, MP 1re) → longueur depuis le rapport des aires (k = √(A′/A)) |

### MP 4e (grade 15)

| Notion | N1 | N2 | N3 | N4 (défi) | Étalon | Remarque |
|---|---|---|---|---|---|---|
| coordmp | au niveau | au niveau | au niveau | au niveau | E-E-1 | distance et milieu : nouveaux au PEE 2026 (S7.CO.01), pas au PEE de MP 1re–2e |
| vectmp | au niveau | au niveau | au niveau + **ajout** | au niveau | E-F-1, E-F-2 | N3 : « w = a·u + b·v » (système 2 × 2), présent dans 3 sessions d'examen, manquait |
| scalmp | au niveau | au niveau | au niveau | au niveau | E-F-3 | |
| projmp | au niveau | au niveau | au niveau | au niveau | E-F-4 | défi : AH revient souvent à 1,6 (vecteurs AB de norme 10) — variété à revoir |
| pvectmp | **à valider** | à valider | à valider | à valider | E-F-4 | facultatif au PEE (S7.VE.10), absent du champ ; l'aire d'un triangle de l'espace (S24) se fait sans produit vectoriel |
| droiteparam | au niveau + **ajout** | au niveau | au niveau | au niveau | E-G-1 | N1 : « droite (AB) avec A et AB, point pour t = … » (S24 P2-4c), manquait |
| posdroites | **remonté** | au niveau | au niveau | au niveau | E-G-2 | N1 « 5x + 4y = 9 et 15x + my = −8 parallèles » (pentes : MP 2e, S3.FA) → droite paramétrique parallèle à une droite cartésienne (vecteur directeur (b ; −a)) |
| ineqmp | à valider | au niveau | au niveau | au niveau | E-H-1 | N1 « −x + 8 > 11 » : un seul geste ; c'est bien S8.IN.01 au PEE 2026, mais niveau CO |
| fctmp | **remonté** | au niveau | **remonté** | au niveau | E-I-1, E-I-2 | N1 « f paire, f(2) = 8, f(−2) ? » (réponse lue dans l'énoncé, parité facultative) → f⁻¹ d'une fonction du 2e degré restreinte (S23 P1-6) ; N1 « f⁻¹ d'une fonction affine » (S3.FA.06, MP 2e) → f⁻¹ d'une cubique ; N3 « intersection parabole-droite » (S3.FQ.06, MP 2e) → intersection racine-droite avec solution parasite (S24 P1-5) |
| polymp | **remonté** | au niveau | au niveau | au niveau | E-I-3, E-I-4 | N1 « calcule P(2) » (substitution) → zéros de ax³ + bx² + cx (mise en évidence puis trinôme) |
| sinusmp | au niveau | au niveau | au niveau | au niveau | E-J-1 | au PEE, hors champ de l'examen spécifique |
| explogfn | au niveau | au niveau | au niveau | au niveau | E-J-2, E-J-3 | |
| fratmp | au niveau (à valider) | au niveau | au niveau | au niveau | E-J-4 | facultatif au PEE (S8.FS.06) |

Aucune notion n'est « trop difficile pour la MP » : les niveaux 3 et les défis restent dans le registre de l'examen
spécifique (méthodes guidées, nombres simples, 2 à 4 étapes) ; aucune question de niveau Collège (limites, dérivées,
plans de l'espace, matrices) n'est proposée à la MP (les notions MP ont `CH: null`, celles du Collège `MP: null`).
Chapitres : aucun vide (A–D en MP 3e, E–J en MP 4e).

## 4. Corrections du 25.11

- `src/ch_mp3.js` : puisrat N1 (exposant décimal), croissexp N1 (doublement à exposant rationnel), volmp N1 (cylindre et
  boule : capacité en litres), similmp N1 (longueur depuis les aires), eqabs N3 (nouvelle forme ax² + b|x| + c = 0) ;
  deux commentaires `//` en fin de ligne passés en `/* */`.
- `src/ch_mp4.js` : fctmp N1 (réciproque restreinte, réciproque d'une cubique), fctmp N3 (intersection racine-droite),
  vectmp N3 (combinaison linéaire, ajout), droiteparam N1 (droite par deux points, ajout), posdroites N1 (paramétrique
  parallèle à une cartésienne), polymp N1 (mise en évidence et zéros).
- `tools/niveau.json` : 25 notions MP 3e / MP 4e.

## 5. À faire valider par l'enseignant

1. **Facultatifs** : `pvectmp` (produit vectoriel) et `fratmp` (fonctions rationnelles) sont proposés à tous les élèves de MP 4e
   alors que le PEE les marque « facultatif » et que l'examen spécifique ne les demande pas : les garder, ou les retirer de l'année ?
2. **volmp N1** : la formule seule (pyramide, cône) reste en niveau 1 parce que S6.VS.01 l'exige ; cylindre et boule passent
   en « capacité en litres ». Suffisant, ou remonter tout le niveau 1 vers les solides composés ?
3. **ineqmp N1** (« −x + 8 > 11 ») : niveau CO, mais c'est S8.IN.01 au PEE 2026 (les inéquations ont quitté la MP 1re) : garder ?
4. **sinusmp** est au PEE mais hors champ de l'examen spécifique : temps d'apprentissage à réduire ?
5. Variété des défis `projmp` (AH souvent 1,6) et `eqlog` (10 couples) : à élargir plus tard (hors niveau).
