# /contenu — grand problème de la semaine et « Creuser encore » (28.11)

Décision de l'enseignant (28.11) : « le grand problème de la semaine, parfois je ne le trouve pas si grand ; et ne pouvoir
en faire qu'un donne une impression de rubrique un peu faiblarde ». Branche `agent/contenu3`, non fusionnée.

## 1. Inventaire (sonde non commitée `tests/_inv_probleme.html`)

Problème de niveau 4 classé par `Engine.probKind` : **grand** = au moins 4 parties et un énoncé en situation (≥ 70
caractères hors formules), au programme du profil (horsCO) ; **riche** = 3 parties en situation ; **court** = le reste.
Comptes = formes distinctes (contexte, sinon énoncé aux nombres près) sur 40 graines, notions **de l'année**
(placeOf = classe). Durée estimée d'un grand problème (lecture + 2 min par partie) : 10 min partout (4 parties ; aucun
problème de 5 parties et plus dans l'app).

| classe | notions de l'année à problème | grands (année) | sur … notions | riches 3 p. | grands de reprise |
|---|---|---|---|---|---|
| 9e | 49 | 8 | 4 | 106 | 0 |
| 10e | 34 | 7 | 4 | 74 | 8 |
| **11e** | 26 | 11 → **15** (ajouts) | 5 → 9 | 62 | 14 |
| **1re Collège** | 43 | 11 | 5 | 74 | 25 |
| 2e Collège | 34 | 33 (dont recip 16, bijection 13) | 5 | 28 | 36 |
| 3e Collège | 25 | 2 | 2 | 67 | 69 |
| 4e Collège | 19 | 1 | 1 | 46 | 71 |
| MP 1re | 59 | 22 | 10 | 97 | 9 |
| MP 2e | 21 | 5 | 4 | 38 | 31 |
| MP 3e | 12 | **0** | 0 | 19 | 36 |
| MP 4e | 13 | **0** | 0 | 12 | 36 |
| 6e FR | 34 | 4 | 2 | 40 | 0 |
| 5e FR | 31 | 6 | 3 | 47 | 4 |
| 4e FR | 22 | 11 | 4 | 35 | 10 |
| 3e FR | 19 | 5 | 3 | 34 | 21 |
| 2nde | 17 | 4 | 3 | 44 | 27 |
| 1re FR | 22 | 1 | 1 | 33 | 31 |
| Tle | 29 | 1 | 1 | 102 | 32 |

Constat : presque tous les défis de niveau 4 ont **3 parties** (« 2 ou 3 étapes », réécriture du 24.11). **Aucune classe
n'a 35 grands problèmes de l'année** (une forme peut revenir avec d'autres nombres, voir § 2). Les plus pauvres, à écrire
en priorité : MP 3e et 4e (aucun), 4e Collège, 1re FR, Tle (1), 3e Collège (2), 6e FR et 2nde (4), MP 2e et 3e FR (5),
puis 9e, 10e, 1re Collège (7–11, sur 4–5 notions seulement). Le plus rentable : ajouter une 4e partie qui a du sens
(interprétation, question réciproque, comparaison) aux problèmes riches à 3 parties des chapitres les plus utilisés,
plutôt qu'écrire de nouveaux énoncés.

Ajouts pour la 11e (classe testeuse ; `src/defis_sec2.js`, `co: [11]`, indices marqués par partie) :
- volcone « silo » : cylindre + toit conique, puis masse du grain (masse volumique) ;
- gquot « piscine » : volume, durée de remplissage au robinet (L/min → h), débit de filtration en m³/h puis en L/min ;
- proba « bonbons » : trois parfums, deux tirages sans remise, même parfum, au moins une menthe (événement contraire) ;
- formule « taxi » : utiliser une formule, l'inverser, égalité de deux tarifs, prix commun.

## 2. Sélection (`Engine.weeklyProblem`, v5)

Le problème de la semaine est maintenant un **code fixe** (`state.weeklyPick.code`), lu par `Engine.weeklyQuestion`.
Passes successives, la classe et le chapitre avant la taille (plan d'études = priorité absolue ; règle du 26.11 : le
chapitre « en classe » d'abord, vérifiée par p6_26_11) :
1. chapitre en classe (notions de l'année) : **grand**, sinon repli **riche** (3 parties en situation), sinon **court**
   (l'ancien critère : 2 parties au moins) ;
2. autres notions de l'année travaillées : grand → riche → court ;
3. reprises (rangs 2–4) : grand → court ; sinon pas de problème.

`weeklyPick.g` dit quelle passe a servi. Dans une passe : d'abord une forme jamais donnée (historique) ; si toutes l'ont
été, la même forme **avec d'autres nombres** (jamais deux fois le même problème). Sur une année simulée (35 semaines,
toutes les notions travaillées) : 11e 35 grands / 15 formes, 1re Collège 35 grands / 11 formes.

## 3. Élèves faibles (`Engine.weeklyAid`)

Élève faible (`weak4`) : le **même** grand problème, jamais raccourci, avec `q.aid = { plan, parts }` (plan en une phrase,
un « Coup de pouce » repliable par partie, tiré des indices marqués « a) », « b) »…, sinon indice d'outil / de calcul /
de la notion ; jamais tiré du corrigé) et `q.maxTries = 4`. La règle n° 24 (shortProb) reste pour le défi du jour.

Simulation (`tests/_sim_semaine.html`, non commitée ; 60 tirages par case ; hypothèses : une partie = item de niveau 4
− 150, essais suivants 0,3 + 0,3 p, coup de pouce lu après un échec = +150 points, durée = lecture + 2 min/partie +
0,8 min/erreur + 0,5 min/coup de pouce). Parties justes %, problème résolu %, minutes :

| classe | élève | avant (court ≤ 3 p.) | après, avec aide (4 p., 4 essais) | après sans aide | aide, 3 essais |
|---|---|---|---|---|---|
| 11e | faible | 58 % · 22 % · 11,6 | **79 % · 32 % · 19,2** | 62 % · 17 % · 16,1 | 68 % · 22 % · 17,7 |
| 11e | très faible | 59 % · 22 % · 11,8 | **73 % · 27 % · 20,6** | 55 % · 5 % · 16,7 | 63 % · 13 % · 18,5 |
| 1re Coll. | faible | 62 % · 13 % · 12,2 | **80 % · 45 % · 18,4** | 63 % · 15 % · 15,7 | 67 % · 22 % · 16,9 |
| 1re Coll. | très faible | 61 % · 17 % · 12,5 | **76 % · 37 % · 18,5** | 59 % · 8 % · 16,2 | 58 % · 10 % · 17,7 |
| 9e | très faible | 50 % · 13 % · 13,1 | 76 % · 32 % · 18,8 | 58 % · 17 % · 16,0 | 63 % · 15 % · 17,2 |
| 10e | très faible | 77 % · 50 % · 9,7 | 68 % · 22 % · 19,4 | 59 % · 10 % · 16,1 | 65 % · 17 % · 17,0 |
| 11e | moyen | 81 % · 52 % · 11,7 | 73 % · 22 % · 14,8 | — | — |
| 11e | fort | 87 % · 68 % · 10,1 | 89 % · 63 % · 12,5 | — | — |

Lecture : la réussite des faibles ne s'effondre pas (parties justes en hausse, sauf 10e très faible ; résolution complète
comparable), mais **la durée monte à 18–21 min** pour eux (12–15 min pour les moyens et les forts) : c'est le prix d'un
vrai grand problème. Sans aide, les faibles tomberaient à 5–17 % de problèmes résolus. Modèle pessimiste sur la durée
(0,8 min par erreur, 4 essais) ; à revoir avec les données de la 11LS.

## 4. « Creuser encore » : API pour /app (moteur seulement, écran de la mine non touché)

- `Engine.digOpen(state)` : le problème de cette semaine est fait (`state.weeklyDone === Engine.weekId()`).
- `Engine.digMore(state, n = 8)` : `[{ code, id, kind: "semaine" | "chapitre", week?, done?, label, parts, minutes }]` —
  d'abord les problèmes des semaines passées **non faits**, puis les grands problèmes des chapitres récents (notions de
  l'année travaillées : chapitre en classe, puis récentes ; une forme par notion à tour de rôle), puis les problèmes des
  semaines passées déjà faits ; jamais celui de la semaine ni un problème creusé dans les 14 derniers jours ; `[]` tant
  que `digOpen` est faux.
- `Engine.digQuestion(state, code)` : la question (même aide pour un élève faible), `q.dig = true` ; `null` si invalide.
- `Engine.digNote(state, code)` : à appeler à la fin du problème (`state.digLog`, 80 au plus).
- Pépites : ordinaires (`ypPoints`, plafond du jour), **jamais `YP.weekly`** ; facultatif, hors séance (pas de
  `finishDay`, pas de série) : à la charge de l'écran.
- Historique : `state.weeklyHist = [{ w, id, c, g, done }]` (60 semaines), créé à la volée depuis `weeklyPick` pour un
  état d'avant (`Engine.weeklySync`) ; aucune clé `m2m-*` changée ; code de sauvegarde : champ facultatif `wh`
  (20 dernières semaines).

Changements dans `src/app.js` (strict nécessaire, hors écran de la mine) : la séance « weekly » prend
`Engine.weeklyQuestion` ; `renderProblem` affiche `q.aid` (phrase « 🪜 … » et `<details class="aid">Coup de pouce`) et
respecte `q.maxTries`. Pas de style ajouté (`.aid`, `.aid-plan` : à /app). « Refaire avec d'autres valeurs » après le
problème de la semaine tire encore `make(state, id, 4)` (court pour un faible) : à revoir par /app avec l'écran.

## 5. Tests

`tests/probleme_semaine.html` (nouvelle page de thème, **à intégrer au regroupement de /entretien**) : grand problème
de l'année et code fixe (5 classes × 4 Mathélo), durée 9–16 min ; faible = même problème + aide, pas la réponse dans un
coup de pouce, défi du jour toujours court (n° 24) ; repli « riche » ; historique sur 5 semaines et migration v4 ;
digMore / digQuestion / digNote ; rendu de l'aide ; une année de 35 semaines sans répétition (11e, 1re Collège).

## À décider (enseignant)

0. Un chapitre « en classe » sans grand problème donne un problème riche (3 parties) du chapitre, et non un grand
   problème d'un autre chapitre de l'année : garder (lien avec la classe) ou préférer la taille ?

1. Durée pour les faibles (18–21 min estimées) : garder 4 essais, ou 3 essais (17–18 min, réussite plus basse) ?
2. Contenu : écrire les grands problèmes manquants (liste § 1), en commençant par ajouter une 4e partie aux problèmes
   riches des chapitres les plus utilisés ; MP 3e–4e d'abord (aucun grand problème de l'année).
