11 problème(s) dont 2 grave(s) — 4 moyens, 5 bas

# Revue « élèves joués » — 26.11, 4e passage (branche agent/eleves4, master 1c3b743)

Sept élèves nouveaux, 2 jours chacun (7 → 11.12), dont 2 avec une évaluation à J+2 (`evalj=2` : sujet puis veille) :

| Élève | Profil | Trace (`tests/_trace.html#…`) | Séances |
|---|---|---|---|
| Adam | MP 3e, fort | `eleve=adam&jour0=2026-12-07&graine=201` | 3:22, 3:04 |
| Nina | MP 4e, moyenne | `eleve=nina&jour0=2026-12-08&graine=202&evalj=2` | 5:33, veille 2:02 |
| Elias | 2e Coll., moyen, **mode libre** | `eleve=elias&jour0=2026-12-07&graine=203` | 6:52, 6:07 |
| Kevin | 9e, très faible (« Je ne sais pas » 40 %) | `eleve=kevin&jour0=2026-12-09&graine=204` | 6:46, **9:58** |
| Manon | 5e France, moyenne | `eleve=manon&jour0=2026-12-08&graine=205` | 4:12, 4:08 |
| Louis | 3e France (brevet), moyen | `eleve=louis&jour0=2026-12-07&graine=206&evalj=2` | 1:47, veille 2:32 |
| Clara | Tle France spécialité, forte | `eleve=clara&jour0=2026-12-10&graine=207` | 2:14, 2:25 |

Outil : profils `adam`, `nina`, `elias`, `kevin`, `manon`, `louis`, `clara` ; `niveau=tresfaible` ; `idk=0.4` (taux de
« Je ne sais pas ») ; `mode=libre` (touche « 🧭 Libre » le jour 1).

Toutes les réponses attendues ont été refaites (≈ 95 questions, parties et items des deux sujets) : **aucune erreur de
calcul**, aucun énoncé absurde, pas de TeX visible, pas de compteur qui change. Tiennent : défis en plusieurs parties
(décibels, sinusoïde, pont au 1/500, parking continu), veille « 3 questions » exacte, « Demain : jour J », figures FR en ×,
€ partout en France, Euclide « 2'310 » en profil romand, bilans bienveillants pour l'élève très faible.

## Graves

1. **Haute** — France 5e, 4e, 3e : le chapitre « en classe » se réduit aux notions de 6e–5e. Les chapitres français sont
   des thèmes de cycle (« Organisation et gestion de données, fonctions » = 16 notions de la 6e à la 3e) et `nowPickIds`
   (`src/app.js` l. 1371) garde les 5 premières ouvertes, donc les plus anciennes. Louis (3e) : « ⓘ notions du chapitre :
   prop, pct, statfreq, diagr, proba » (aucune des 7 notions de 3e : affine, linfn, pctvar, proba2…) ; son évaluation de 3e
   devient « Un robinet remplit 25 L en 5 minutes… ». Manon (5e) : prop, fracconv, proptab, echelle6, pct (toutes de 6e),
   alors que la carte du chapitre montre un exemple de 5e.
   Reproduire : `#eleve=louis&jour0=2026-12-07&graine=206&evalj=2`, écran 15 ; `#eleve=manon&jour0=2026-12-08&graine=205`.
   Correction : dans `nowPickIds`, d'abord les notions de la classe (`placeOf(...)[0] === profile.grade`), les autres
   seulement s'il en manque.
   **Corrigé** (agent/p4) : `nowPickIds` prend d'abord les notions de la classe (`nowOwn` : `placeOf(...)[0] === grade`),
   les autres seulement s'il en manque ; l'exemple de la carte du chapitre (`nowSample`) aussi ; dans « Je prépare une
   évaluation », chaque chapitre liste la classe d'abord (le sujet suit l'ordre coché). Même règle au Collège, en MP et au CO
   (11e : chapitres « 1. Nombres et opérations », « 5. Calcul littéral », « 6. Équations » faits surtout de reprises : les
   notions de 11e passent devant). Louis : tabval, affine, linfn, modaff, pctvar ; évaluation « Fonctions affines ·
   Augmentation et diminution en pourcentage · Tableau de valeurs ». Test : `tests/p4_26_11.html` (échoue sur master).

2. **Haute** — Mode libre, 2e Collège : « Mon défi du jour » est fait de rappels du CO. Jour 1 : 4 questions sur 5 en
   « 🔙 RAPPEL », niveau 3, dont `q-decadd-3-mi0` (9e) « Le matin, il fait 2,5 °C. La température monte de 4,5 °C, puis
   baisse de 10,1 °C », `q-arith-3-ftv` (billes, PGDC), `q-fracper-3-ze3`, `q-fracops-3-kmx` ; jour 2 : leçon « Rappel de
   cours · Entre quels entiers se trouve √50 ? » puis 3 rappels. L'écran promet « Tous les sujets de ton année ». Durées
   6:52 et 6:07. Cause : `Engine.freePlan` (`src/engine.js` l. 582) met dans le groupe « forts » toutes les notions vues,
   années précédentes comprises.
   Reproduire : `#eleve=elias&jour0=2026-12-07&graine=203`.
   Correction : groupes « forts » et « neufs » limités aux notions de l'année ; une notion d'avant seulement si elle a été
   ratée (groupe « faibles ») ou si c'est un prérequis pour un élève fragile.
   **Corrigé** : `Engine.freePlan` limité aux notions de l'année (catalogue, `current`) ; une notion d'avant n'entre que par
   `Engine.remob` (ratée : maîtrise < 0,45 ou 2 échecs ; prérequis d'une notion de l'année qui coince ; Mathélo en forte
   baisse), et seulement dans les « faibles » (plus les prérequis de l'élève fragile, comme avant). Moins de notions de
   l'année que la séance : tout le catalogue. Le problème du défi (`startFree`) est toujours une notion de l'année. Elias :
   plus aucun « 🔙 Rappel », séances 3:30 et 4:29. Test : `tests/p4_26_11.html` (2e Coll., MP 2e, 5e–3e FR ; échoue sur master).

## Moyens

3. **Moyenne** (revue du jour n° 7, ne tient pas pour un élève très faible) — Kevin (9e, Mathélo 820) : « ⚡ Série
   d'automatismes » **9:58** (6 créneaux + 1 « À toi »), score 2,5 / 7 ; jour 1 : positionnement 7:19 + séance 6:46.
   Correction : 4 automatismes au plus sous le plancher, une seule question par créneau (voir n° 4).
   **Corrigé** : série de 4 aussi pour un élève en grande difficulté encore en calibrage (`Engine.struggling` : ≥ 5 réponses
   récentes, < 55 % justes du premier coup) ; pas de « À toi » dans une série d'automatismes (n° 4) ; le jour du
   positionnement, 3 questions au plus quel que soit le format ; positionnement arrêté après 3 ratés ou « Je ne sais pas ».
   Élève en grande difficulté : 3 questions aussi dans les autres formats (Révision, Applications…).
   Kevin : positionnement 4:51 (3 questions), séance du jour 1 3:43, jour 2 (Révision) 6:05 au lieu de 9:58
   (3 questions avec pas à pas, lecteur lent à 170 mots/min). Élève repéré aussi d'après le positionnement (`placeMiss`).

4. **Moyenne** — Reprises en chaîne : après un pas à pas, « À toi : une question du même type » devient le bouton
   principal, même sur une reprise déjà ratée. Carnet de Kevin : « CARNET D'ERREURS · 3 SUR 5 » trois fois (deccomp-2-r17,
   puis deccomp-2-diu, puis deccomp-2-7yk, toutes ratées), carnet **14:21**, « Score 0 / 7 ».
   Reproduire : `#eleve=kevin&jour0=2026-12-09&graine=204`, case Carnet. Correction : pas de bouton « À toi » sur une
   question « Nouvelles valeurs » ; « Continuer » en bouton principal.
   **Corrigé** : option `noRedo` de `renderQuestion` (question déjà reprise, ou série d'automatismes) : ni « À toi » ni
   « Refaire », « Continuer » en bouton principal (questions simples et problèmes en parties). Une erreur revient au plus
   2 fois de suite (question, puis une reprise). Élève en grande difficulté (`Engine.struggling`) : pas de reprise du tout
   (Kevin : Révision de 4 questions devenue 6 avec deux « À toi », 9:25) ; le pas à pas reste.

5. **Moyenne** — Les ratés du positionnement vont au carnet, alors que l'écran dit « ces questions servaient à te situer,
   pas à te noter ». Kevin : « Carnet · 6 erreurs à effacer » dès le jour 1 (decread, deccomp, ulong du positionnement),
   puis 7, puis 8 : le carnet ne fait que grossir. Idem Nina (3), Elias (2). Correction : ne pas ranger au carnet les
   questions du positionnement.
   **Corrigé** : `carnetAdd` retiré du positionnement (`startPlacement`) ; décision du 24.11 (« erreur du calibrage aussi
   dans le carnet ») remplacée — à confirmer par l'enseignant.

6. **Moyenne** — Problème de la semaine d'une seule question : Louis (3e FR) `q-rac-3-7l7` « Deux carrés ont des côtés de
   9 cm et 12 cm… » (1:15), sous la porte « Un problème en plusieurs étapes, avec des indices si tu bloques » ; bilan
   « Score 1 / 1 ». Reproduire : `#eleve=louis…`, jour 2, case Problème. Correction : notion du problème de la semaine
   choisie parmi celles qui ont un niveau 4.
   **Corrigé** : `Engine.weeklyProblem` ne retient qu'une notion dont le niveau 4 donne, pour ce profil, un problème en
   plusieurs parties hors des formes exclues (`horsCO`) : rac en 3e FR n'a que des problèmes hors programme (racine
   cubique), d'où le repli au niveau 3. Le tirage de la séance reprend jusqu'à obtenir le niveau 4. Choix de la semaine
   refait (v3). Louis : « Problème de la semaine » = scicalc (3e), en 2 parties.

## Bas

7. **Basse** — Problème de la semaine d'une année antérieure : Clara (Tle) « Parabole : zéros et sommet » (enclos le long
   d'un mur, `q-f2-4-wo1`, programme de 1re) ; Adam (MP 3e) « Fonctions trigonométriques » (`q-trigfn-4-86y`, MP 2e).
   Correction : notion de l'année en priorité.
   **Corrigé** : notion de l'année (catalogue, `current`) avant toute autre dans `weeklyProblem` (+5000 au score sinon).
   Adam : eqabs (MP 3e) ; Clara : limites (Tle).

8. **Basse** — MP 3e, chapitre « Puissances et logarithmes » choisi : le jour 2 (automatismes), 0 question du chapitre sur 6
   (trigeq2, trigassoc, quartiles, droitesinter, recipaff, droites : MP 2e) ; résumé « 1 sur 13 ».
   Reproduire : `#eleve=adam&jour0=2026-12-07&graine=201`. Correction : au moins 2 créneaux d'automatismes sur le chapitre.
   **Corrigé** : cause = `Engine.isDrill` refusait tout énoncé contenant « calculatrice », donc « Calcule sans calculatrice
   \(\log_2 32\) » (puisrat, logdef, logprop : 0 à 29 % d'automatismes, tirage au hasard de `drillable`). « sans
   calculatrice » est désormais accepté (100 %), et `drillable` tire 8 graines fixes (reproductible). Le chapitre a alors ses
   4 créneaux sur 6.

9. **Basse** — Élève forte, notions du chapitre au niveau 1 : Clara (Tle, Mathélo 1852) Révision de 4 questions de niveau 1
   en 2:14 (`q-tvi-1-2f`, `q-limitinf-1-4d` « C(t) = 24t/(3t + 7) », `q-asymptotes-1-eo7`), 4/4, « Excellente séance ! ».
   `Engine.minLevel` ne s'applique pas aux notions jamais vues. Correction : niveau 2 d'entrée quand le Mathélo est
   au-dessus du niveau 2 de la notion.
   **Corrigé** : `Engine.minLevel` vaut aussi 2 pour une notion jamais travaillée ni ratée au positionnement quand le
   Mathélo atteint son niveau 2 ; la question qui suit une leçon reste au niveau 1. Clara, jour 1 : tvi-2, limitinf-2.

10. **Basse** — France : rappel de cours tradexpr « Somme (+), différence (−), produit (·), quotient (:). » (Manon, 5e,
    `q-tradexpr-2-ejp`, carnet) ; `src/gen3.js` l. 104. Correction : « produit (×), quotient (÷) » en profil FR (`frLocal`
    sur ce texte).
    **Corrigé** : remplacement « produit (·), quotient (:) » → « produit (×), quotient (÷) » dans `FR_WORDS`
    (src/curriculum.js), appliqué à tout texte affiché en profil FR.

11. **Basse** — Même scène autour d'une évaluation (3e FR) : sujet Q2 « Un robinet remplit 25 L en 5 minutes… 40 L » puis,
    à J−1, `q-prop-2-72g` « Un robinet remplit 25 L en 5 minutes… 45 L » (mêmes données) ; sujet Ex. 1 a) « Sur 50 élèves,
    5 viennent à vélo » puis `q-diagr-2-olb` « Sur 80 élèves, 12 viennent à vélo ». Correction : robinet et « viennent à
    vélo » dans `SCENES`.
    **Corrigé** : scènes « robinet » et « velo-eleves » (« viennent à/en vélo ») dans `SCENES` : évitées 7 jours par
    `Engine.make` et le sujet de préparation quand une autre forme existe.

## Remarques sans correction demandée

- 5e FR : `q-fracconv-2-cka` « Écris 0,3̄ sous forme de fraction », corrigé « 10x − x = 3 » : méthode par équation avant
  la 4e ; à vérifier au registre de niveau.
  **Corrigé** : formes per1, per2, permixte de fracconv réservées à la 4e et au-delà en France (`HORS_FR`, src/fr_couv.js).
  À confirmer : le programme du collège français ne mentionne pas l'écriture fractionnaire d'un décimal périodique.
- Motivation de Kevin : messages justes et doux (« Séance faite : c'est en pratiquant qu'on progresse », « 🪜 Tu as
  reconstruit 2 solutions ») ; ce qui décourage, c'est la durée (n° 3, 4) et le carnet qui grossit (n° 5), pas le ton.
- Brevet (Louis) : rien de propre au brevet hors `autodnb` ; pas de manque bloquant vu en 2 jours.
