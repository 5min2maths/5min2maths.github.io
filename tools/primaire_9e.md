# Automatismes de fin de primaire pour la 9e en grande difficulté (27.11)

Décision de l'enseignant du 27.11 (« retravailler primaire si nécessaire ») ; contexte : `tools/eleves_faibles_26-11.md`
(plancher de la 9e). Branche `agent/primaire`. Code : `src/primaire.js` (paquet 9), relais en fin de `src/engine.js`.

## Notions choisies (8, « niveau primaire », CH: [8], `prim: true`)

Source : PER cycle 2, progression des apprentissages 7e–8e (MSN 22 à 25), extrait officiel de l'ECR vaudoise 8P 2023
(`~/DATA/Enseignement/Sources/Officiel/PER_Suisse_romande/VD_ECR_MAT_8P_enseignant.pdf`, p. 4) et `tools/primaire.md`.
Les attentes fondamentales complètes du PER ne sont pas en local (portail CIIP dynamique) : à vérifier.
Critère : un automatisme dont une notion de 9e a besoin, et qui n'existe pas déjà au niveau 1 de la 9e (en 9e, `dec10`,
`fractout`, `ulong`, `ordgr` travaillent déjà avec des décimaux ; `decread`, `deccomp`, `perim`, `aire1` ont des formes
primaires au niveau 1, mais l'audit du 25.11 les écarte en 9e, UP9). Ici : entiers, fractions unitaires, unités entières.

| Notion | PER | Prérequis de (9e) |
|---|---|---|
| `p8tables` Tables, produits à trous, décomposer (14 · 6, 25 · a · 4) | MSN 23 (répertoire mémorisé, calcul réfléchi) | multdiv, divcrit, premiers, fracsimp, aires, prio, valnum, proptab… |
| `p8calcadd` Calcul réfléchi ± (± 9, ± 99, compléments à 100 / 1000, monnaie) | MSN 23 | decadd, reladd, ordgr, perim, diagr, angles |
| `p8dizaines` × et : par 10, 100, 1000 ; 30 · 40 ; nombre de dizaines / centaines | MSN 22–23 | dec10, decread, ordgr, decmul, decdiv, unités |
| `p8diveucl` Division euclidienne : quotient, reste, « combien de cars » | MSN 23 (diviseur < 100) | multdiv, divcrit, decdiv, utemps, fracper |
| `p8droite` Lire une droite graduée (entiers, 0,1, 0,01, quarts, grands nombres) | MSN 22 | deccomp, decarr, relrep, fracrep |
| `p8fracpart` Moitié, tiers, quart d'une quantité, d'une heure, d'un kg ; ½ = 5/10 | MSN 22, 24 | fractout, fracconv, fracrep, fracadd |
| `p8conv` Conversions usuelles (km, m, cm, kg, g, t, L, dL, h, min, s) | MSN 24 | ulong, uvol, utemps, perim |
| `p8probop` Problèmes en une étape : choisir l'opération (EEE, ECE, comparaison, produit cartésien) | MSN 25 | decprob, tradexpr, prop, change, litelab |

Chaque notion : 3 niveaux × 3 formes, pas à pas (dernière étape = réponse), erreurs typiques, leçon courte (Retiens) et
indice ; contextes d'élèves de 12–13 ans (tournoi, playlist, concert, abonnements, Escalade, sommets romands) ; profil
romand (·, CHF à deux décimales, 10'000). Rien pour la France. Correspondance 9e → primaire : `PRIM_PRE` (pas `PREREQ`,
où la remédiation et le mode libre puisent sans tester la grande difficulté).

## Branchement

- Hors catalogue (`Engine.catalog` écarte `n.prim`) : jamais dans « Mes notions », le positionnement, les créneaux ordinaires
  (statut « prim », ignoré par `Engine.eligible`) ; `Engine.isRecent` faux → libellé « 🔙 Rappel » comme les autres
  rappels. Aucun texte ne dit « primaire » ni « 8P ».
- Relais (fin de `src/engine.js`, enveloppe `planSession` et `oneLesson`, sans toucher leur corps) → `PRIM.inject`.
- Conditions (toutes) : CH, 9e, hors MP ; `Engine.struggling` ; réussite du 1er coup ≤ 40 % sur les 8 à 16 dernières
  réponses ; Mathélo ≤ 875 (75 sous le départ d'un 9e moyen) ; au moins une notion de 9e ratée (maîtrise < 0,45 ou deux
  échecs) dont c'est le prérequis. Sans ces deux seuils, `struggling` seul servait l'élève moyen en mauvaise passe
  (45 % de ses séances en simulation).
- Dose : 1 question par séance, 2 sous le plancher (`underFloor`) dans une séance de 4 questions ou plus ; elle remplace la
  dernière question prévue (durée inchangée, la séance finit plus souvent sur une réussite) ; niveau 1 seulement ; même
  type de créneau (automatisme : notion qui en fournit ; défi → application). Pas deux séances de suite la même notion.
- Sortie (seuil) : une notion est reprise après **2 réussites du premier coup sans échec entre deux** (box ≥ 2 du moteur)
  et n'est plus servie ; tout s'arrête dès que l'élève n'est plus en grande difficulté (conditions ci-dessus) : il revient
  au niveau 1 de 9e.
- Mode libre : `PRIM.strip` retire les notions primaires que `freePlan` aurait tirées (fuite par `remob`), puis même injection.

## Mesures (tests/_faibles.html, graines 1 à 20, 28 jours ; `#v=sansprim` = avant)

| 9e | 1er essai | dern. sem. | sans réussite | décourageantes | pire suite | fin sur échec | Δ Mathélo | vrai − Mathélo | part prim. (1er essai) |
|---|---|---|---|---|---|---|---|---|---|
| faible avant → après | 28 → 29 % | 25 → 28 % | 41 → 39 % | 52 → 50 % | 4,5 → 4,3 | 73 → 66 % | −129 → −148 | −121 → −102 | 22 % (41 %) |
| très faible | 11 → 13 % | 12 → 13 % | 70 → 64 % | 79 → 75 % | 8,8 → 7,6 | 90 → 84 % | −252 → −287 | −148 → −112 | 30 % (20 %) |
| moyen, fort | identiques | | | | | | | | 0 % |
| irrégulier | identique à ± 1 pt | | | | | | | | 1 % des séances |

10e, 11e, 1re : lignes identiques avant / après (jamais servi). Lecture : gain réel mais modeste dans ce modèle. Les
questions primaires sont réussies à 41 % (faible) et 20 % (très faible) au 1er essai, contre 27 % et 11 % en 9e : le
plancher est passé, mais elles ne font qu'un quart des questions. Le Mathélo baisse un peu plus (une erreur sur une question
facile coûte davantage) et rejoint mieux le vrai niveau. Comme le 26.11, la simulation ne dit pas la vraie réussite :
à regarder sur les données de la 11LS / des 9e.

Essais écartés : `struggling` seul (moyen servi dans 45 % des séances) ; `underFloor` (39 %) ; seuil 40 % sans Mathélo
(moyen 6 %) ; niveau 2 après une réussite (moins de réussites, sans gain) ; prérequis des notions de la séance faute de
notion ratée (plus de questions primaires, sans gain).

## Tests

- `tests/primaire.html` (suite) : 3600 énoncés (8 × 3 niveaux × 150 graines) tous recalculés par un oracle indépendant
  (texte affiché ; figure lue pour la droite graduée), contre-épreuves, corrigé qui contient la réponse, ≥ 3 formes par
  niveau, pas de « primaire / 8P », nombres à la suisse ; service : jamais 9e moyen, fort, moyen en mauvaise passe, 10e,
  11e, Collège, MP, France 6e–5e ; 9e en grande difficulté ≤ 2 par séance, en fin, « 🔙 Rappel », prérequis de la notion
  ratée d'abord, reprise après 2 réussites, mode libre sans fuite, rien sans notion de 9e ratée.
- `tests/vraisemblance.html` : notions ajoutées (0 problème sur 1440 tirages).

## Limites, à décider

- Une erreur sur une question primaire entre au carnet (déroulé de l'autre agent) : l'élève la retrouve dans « Effacer mes
  erreurs », même revenu au niveau de la classe. À filtrer si on préfère.
- La carte de progression (thème « Nombres et opérations ») affiche les notions primaires déjà servies à cet élève.
- Le PER complet (attentes fondamentales de fin de cycle 2) n'a pas pu être relu en local.
