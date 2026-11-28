# /contenu nickel 10e, chapitre 8 Pythagore — 28.11.2026 (branche `agent/contenu9`)

Même méthode que le chapitre 7 (`contenu_nickel10_ch7_28-11.md`). Références : plan de cheminement 10e (« 8. Théorème de
Pythagore (LC/LS) (1,5 sem.) — ⚠️ Pas de réciproque — Dans le plan (LC/LS) et dans l'espace (LS) »), `niveau_910.md` § 2
(10e, ch. 8 : valeur exacte √n, a√b en 11e), MER 10e ch. 11 GMA « Lignes, surfaces et théorème de Pythagore » (GM49–GM81,
QSJ ; données, rien d'exécuté). Les MER 10e travaillent aussi la réciproque (GM53, GM55, GM56, GM60, GM61) : **le plan
l'exclut, on suit le plan**. Aucun fichier de notes ni donnée d'élève ouvert.

Notions du chapitre (`CO_BY` 10C08) : pyth, pythfig (pythrec n'est qu'en 11e : rien à retirer).
Mesure : sonde non commitée `tests/_nickel10_ch8.html` (profil CH 10e, `Engine.make`, 150 tirages par notion et par
niveau) ; sujet : `tests/_sujet10_ch8.html`.

## Défauts trouvés (avant)

1. **Racines simplifiées en 10e** : la consigne disait « écris par exemple √13 » (racineCO, 25.11), mais les corrigés et les
   étapes des formes de 11e (`ch11_gm.js`) restaient en a√b : « AB = 2√34 », « d = √200 = 10√2 », « h = 2√3 », « d = 7√3 »,
   étape « Le plus grand carré qui divise 112 ? », « (simplifiée) », « Simplifie » ; réponse affichée (canon) « 4√7 ».
2. **Rappel de cours de 11e** : « La réponse exacte s'écrit souvent a√b », exemple « √20 = 2√5 ».
3. **Leçon active pyth** : 3e question « Un triangle de côtés 5, 7 et 9 est-il rectangle ? (réciproque de Pythagore) » ;
   Retiens « si l'angle est obtus, c² > a² + b² ».
4. **Sujet de préparation de 10e = banque de 11e** (`RICH.pyth11`, comme le calcul littéral avant le 28.11) : réciproque,
   racines simplifiées.
5. Formes surtout « exercice de manuel » : pyth 1 et pythfig 1 peu de valeurs décimales réalistes (les corrigés des MER
   arrondissent : « √40 ≈ 6,32 m ») ; pyth 4 : 3 défis ; pas de MER GM62 / GM63 / GM65 / GM68 / GM69 / GM70.

## Liste de contrôle par notion (avant → après)

Cases de `chantier_11e.md` : 1 variété, 2 trivialité, 3 contextes, 4 valeurs, 5 pas à pas, 6 corrigé, 7 pièges, 8 rappel,
9 leçon active, 11 trouve l'erreur, 12 exercices riches. 10 (figure à manipuler) : leçon active à carrés glissants
(existante). 13 estimation : raisonnement « Estime avant de calculer » dans le sujet. 14 retours testeurs : aucun.
**15 contrôle par l'enseignant : à faire.**

| Notion | Niveau | Avant (formes / ctx) | Après (formes / ctx) | Ajouts de 10e (`q.co = [10]`) |
|---|---|---|---|---|
| pyth | 1 | 5 / 5 | 13 / 6 | échelle sous la fenêtre (GM62, au centième), randonnée nord puis est (au dixième) |
| pyth | 2 | 10 / 5 | 12 / 7 | tyrolienne entre deux poteaux (différence des hauteurs, figure), rampe : longueur au sol (cm → m) |
| pyth | 3 | 5 / 5 | 14 / 7 | hauteur issue de l'angle droit (aire de deux façons, GM70), jogging rectangle / triangle (GM65) |
| pyth | 4 | 3 / 3 | 4 / 4 | défi « antenne haubanée » (donnée inutile, câble, prix) |
| pythfig | 1 | 5 / 5 | 8 / 8 | côté d'un losange par ses diagonales (GM69 ; 3 contextes) |
| pythfig | 2 | 4 / 4 | 6 / 6 | aire d'un trapèze rectangle (GM68, figure), armoire à redresser (GM63, largeur inutile) |
| pythfig | 3 | 3 / 3 | 5 / 5 | chevron d'un toit (demi-largeur, dépassement, hauteur des murs inutile ; figure), aire d'un hexagone régulier |
| pythfig | 4 | 9 / 6 | 10 / 7 | défi « armoire » (diagonale, marge sous le plafond, profondeur maximale : question inverse) |

Pas à pas (guide) : 100 % des questions des niveaux 1–3 ; défis : parties liées + indices + corrigé. Pièges (q.traps) sur
toutes les formes ajoutées : additionner les côtés, oublier la racine (c² donné comme réponse), additionner les carrés
pour une cathète, diagonales entières au lieu des demi-diagonales, largeur entière au lieu de la demi-largeur, côté oblique
pris pour la hauteur, différence des hauteurs oubliée, donnée inutile utilisée. « Réciproque mal conclue » : sans objet en
10e (plan) ; le sujet contient « Vrai ou faux : dans n'importe quel triangle… » (hypothèse « rectangle »).
Corrigés recalculés indépendamment depuis l'énoncé (section de test, 689 questions). Vraisemblance : rampes ≤ 8 %,
poteaux ≤ 18 m, armoires et casiers aux dimensions réelles.

Racines (case 4) : `racine10` (`engine.js`, appelé par `finalize` en 9e–10e pour pyth et pythfig) réécrit corrigés,
étapes, pièges et réponse affichée en √n (« √136 », « √147 ») et retire l'étape « plus grand carré qui divise » ; la 11e
garde a√b (contrôlé). Indice et rappel de 10e (TXT_CO) : hypoténuse, cathète, racine, arrondi, « ne s'applique que dans un
triangle rectangle », sans a√b. Leçon active de 10e (`act_manip.js`) : 3e question = une cathète ; Retiens sans
l'inégalité de l'angle obtus ; l'angle obtus reste à explorer (« le théorème ne s'applique que dans un triangle rectangle »).

## Figures

Seulement là où elles portent l'information spatiale de l'énoncé, jamais le triangle rectangle à trouver ni la réponse :
tyrolienne (deux poteaux et le câble, sans le triangle), trapèze rectangle (bases et côté oblique, sans la hauteur), façade
du chalet (`GF.house`, avec la hauteur des murs inutile), triangle de la hauteur issue de l'angle droit, pavé du casier,
pyramide. Aucune figure sur les échelles, randonnées, rampes, losanges : l'énoncé suffit et le croquis fait partie du
travail (décision du 28.11 ; l'exercice « L'échelle sous la fenêtre » demande le croquis).

## Test de préparation de qualité : `RICH.pyth10` (`src/riche_10.js`, fin de fichier)

Modèle : MER 10e GM62, GM63, GM64, GM68, GM69, GM70 et QSJ, modelés et non recopiés. Sans points, 45 min, A. automatismes
(pyth, pythfig), B. 3 exercices tirés de 6, C. 2 raisonnements tirés de 4 (T1–T6 ✓ ; T7 : relecture par l'enseignant).

- Exercices : **L'échelle sous la fenêtre** (hypoténuse, cathète, règle du quart, croquis), **Le losange** (demi-diagonales,
  périmètre, aire, erreur « diagonales entières », diagonale inconnue), **La parcelle** (trapèze rectangle : largeur, aire,
  clôture, gazon), **La hauteur sur l'hypoténuse** (aire de deux façons, distance d'un sommet à la diagonale),
  **Le casier de consigne** (espace : face avant, grande diagonale, skis, canne à plat), **La pyramide** (demi-diagonale,
  hauteur, apothème, « pourquoi ? »).
- Raisonnement : trouve l'erreur (côtés additionnés, racine oubliée, cathète calculée en additionnant), vrai ou faux
  (hypothèse rectangle, √(a + b), cathète plus longue, diagonale du carré, cathètes doublées, encadrement), estime avant de
  calculer, où est l'hypoténuse (triangle aux sommets mélangés).
- `richChapter` : rien à changer (champ `grades`, mécanisme du chapitre 7) : une 10e reçoit `pyth10`, une 11e `pyth11`.

## Fichiers

- `src/engine.js` : `racine10` (après `racineCO`, bloc « nickel 10e ch. 8 ») et son appel dans `finalize` ; `TXT_CO[10].pyth`.
- `src/variantes.js` : bloc séparé en fin de fichier (11 formes, 2 défis, `q.co = [10]`).
- `src/riche_10.js` : bloc séparé en fin de fichier (`RICH.pyth10`, grades [10]).
- `src/act_manip.js` : version de 10e de la leçon active pyth (getter sur le profil, comme `act_manip2.js` pour distrib).
- Tests : `tests/parcours.html#section=nickel10_ch8` (nouvelle section : formes et défis de 10e tirés en 10e et jamais en
  11e, racines √n en 10e et a√b en 11e, recalcul, rappel et leçon active, sujet de 10e sans réciproque, cône ni a√b) ;
  `tests/riche910.html` (10C08 → pyth10).

Captures 360 px (non commitées) : `tests/_shots/contenu/nickel10_ch8/figures_360.png` (tyrolienne, trapèze rectangle,
chalet, hauteur issue de l'angle droit, parcelle du sujet).

## Tests

Pages de thème `parcours` (toutes sections, dont `nickel10_ch8`), `riche910`, `variantes`, `recalcul` (4 morceaux),
`corrige_valeur` (ch, defis), `questions` (figs, figs_noms…), `catalogue`, `pas_a_pas`, `guides`, `variete_niveaux`,
`france`, `manip`, `tools/test_nom.py` : vertes. Suite rapide (55 pages) : deux échecs, aucun dû à cette branche —
`defis9` (factor, 11e : « valeur non finie », **déjà en échec sur master**) et `poids.py ordre` (docs/ non reconstruit ;
vert après un build local, docs/ remis, rien de commité).

## Reste / à décider

- Compétences affichées de pythfig (`COMPS`, `ch11_gm.js`) : « Pyramides et cônes » aussi en 10e, où le cône est écarté
  (HORS_CO) : libellé par classe à prévoir (pas de mécanisme pour l'instant).
- Formes de 11e gardées en 10e : distance dans un repère (MER 10e GM67 utilise des coordonnées), carré inscrit dans un
  cercle, triangle rectangle isocèle (x² = 8 : équation simple avant le chapitre 9) — d'accord ?
- Réciproque : le plan l'exclut, les MER 10e la travaillent (GM53–GM61) ; rien en 10e dans l'app. À confirmer.
- Contrôle par l'enseignant (case 15, T7) : imprimer un sujet de 10e (Je prépare une évaluation → Théorème de Pythagore).
