8 problème(s) dont 2 grave(s) — corrigés le 27.11 (branche agent/r27b, contrôles tests/r27b.html)

# Revue « élèves joués » — 27.11 (Claude, branche agent/eleves7)

Six élèves, 3 jours chacun dès le lundi 30.11 (graine 71), dans la vraie interface (`tests/_trace.html`), Histoire et Curieux
ouverts une fois chacun ; Kevin et Lucie reviennent après 4 jours d'absence (jour 3 = 06.12). Traces complémentaires :
Kevin 6 jours sans chapitre (graine 72), Arthur (10e) avec diagnostic des notions éligibles, Sami avec une évaluation (J−2 → J).

```
#eleve=kevin&jours=3&jour0=2026-11-30&graine=71&absence=5&extras=histoire,curieux,carnet
#eleve=lucie&jours=3&jour0=2026-11-30&graine=71&absence=5&extras=curieux,histoire,carnet
#nom=Arthur&profil=CH-10&niveau=moyen&strategie=aide,figure&premier=1&jours=3&jour0=2026-11-30&graine=71&extras=histoire,curieux,carnet&diag=1
#eleve=ines|sami|jade&jours=3&jour0=2026-11-30&graine=71&extras=…
#eleve=kevin&chapitre=&jours=6&consecutif=1&jour0=2026-11-30&graine=72&extras=carnet
#eleve=sami&jours=3&consecutif=1&jour0=2026-11-30&graine=73&evalj=2&extras=curieux
```

Outil étendu : `primaire.js` manquait dans la liste des scripts de la trace (les rappels de primaire ne pouvaient pas
apparaître) ; `absence=N` ; questions de primaire marquées « 🔙 PRIMAIRE » ; au départ de chaque séance, état « grande
difficulté » (struggling, plancher, réussite récente, primaire applicable et candidats, plan) ; décision « rejouer ? » et sa
raison ; `diag=1` : notions éligibles avec leur année (`r` = reprise du référentiel, `−` = malus « l'année d'abord ») ;
réponse en fraction quand la fraction est exigée.

**Contenu** : environ 120 questions, étapes de pas à pas, histoires et questions curieuses refaites à la main : **aucune
erreur de calcul**, aucun énoncé invraisemblable (peinture 60 m² → 2,4 → 3 pots ; recharge 15 Wh · 365 · 0,28 CHF/kWh
≈ 1,53 CHF ; aller-retour 48 km/h ; tangente → 23 ; enclos x(80 − 2x) = 702 → 13 ; 27 ; domaine √(x+4)/((x+6)(x+3)) →
14 entiers). Séparation France / romand respectée (Jade : €, espaces fines, Strasbourg, Delambre ; romands : CHF, `'`).
Récit de Galois vérifié (dates, Fourier, Chevalier, Abel, Liouville 1846) : exact (pas rencontré en trace).
**Durées** : premier lancement 4:45 à 6:17 ; séances 1:34 à 5:37 (Kevin, 6 jours : max 6:36) ; Carnet de Lucie 7:05.

## Changements du jour

| Changement | Verdict |
|---|---|
| Rejouer la notion ratée (grande difficulté) | **ne tient pas** avec un chapitre en classe (n° 1) ; tient sans (Kevin 6 j : « RÉVISION · 2 SUR 3 · NOUVELLES VALEURS », « APPLICATIONS · 3 SUR 3 · NOUVELLES VALEURS ») |
| Carnet effacé dès une réussite | tient : Kevin j3 « Bonne séance : 2 questions réussies et 2 erreurs effacées du carnet » ; règle « 2 réussites de suite » gardée pour Sami |
| Positionnement : 1re question au niveau 1 | tient (6 élèves sur 6) |
| 1er jour : 2 questions, niveau 2 au plus | tient (6 sur 6, séances 1:34 à 2:56) |
| Bilan centré sur les réussites | tient : « Aujourd'hui : 1 solution reconstruite. », « Bonne séance : … » ; sans réussite « 3 questions travaillées : c'est en pratiquant qu'on progresse. » |
| « Content de te revoir ! » après une absence | tient (Kevin, Lucie) ; reste le « 0 j » de l'en-tête (n° 6) |
| L'année d'abord sans chapitre en classe | tient à la lettre (notions de 9e sans reprise écartées), **pas dans l'esprit** (n° 4) |
| Rappels de primaire (9e en grande difficulté, jamais le jour du positionnement) | jamais le jour du positionnement : oui ; **jamais servis du tout** en 3 ni en 6 jours (n° 3) |
| Bandeau statistiques 2 jours au plus | tient (affiché le jour 2 seulement) |
| Accueil après une évaluation | tient : « ▶ Encore une séance · Séance du jour faite ✓ (évaluation) · Pour en refaire une : 🧠 Révision » |
| Brouillon dans les histoires | tient (« ✏️ Brouillon » dans les 6 histoires) ; pavé de calcul et pavé 1–n : non éprouvés (la trace masque le pavé) |
| Nouvelles histoires et questions curieuses | vues : Recorde, Agnesi, Newton–Leibniz, Delambre ; compter jusqu'à 100'000, peinture, poster, recharge, aller-retour, cadeau qui double : justes et bien choisies |
| « Nouvelle version prête » | **absent du code** (aucune occurrence dans src/, seulement dans tools/a_faire_27-11.md) |

## Problèmes

1. **Grave** — Rejouer ne se déclenche pas quand un chapitre est choisi « en classe » (ni pour une notion faible dont la leçon n'a pas été vue).
   Kevin j2 (Révision, chapitre Unités) : `ulong-1-t8r` « Je ne sais pas », puis `utemps-1-iow` raté →
   « ⓘ rejouer ? non (grande difficulté true, type rev, d1, suivante utemps|1|rev, leçon due true) », deux fois ; séance 0/3.
   Lucie j2 : `derivref-1-of7` raté → la remédiation `puiss-2-x8d` prend la place au lieu de rejouer.
   Cause : `Engine.replayNext` refuse si `lessonDue(suivante)` ; or toute notion du chapitre (statut « encours ») ou de
   maîtrise < 0,4 sans leçon vue est « leçon due », alors que la question suivante est posée sans leçon (« 📖 Rappel de cours »).
   Reproduire : 1re et 2e lignes de commande ci-dessus. Correction : tester si la question suivante affiche vraiment une
   leçon (position de la leçon dans le plan) au lieu de `lessonDue`.
   **Corrigé** (agent r27b) : `Engine.lessonShows` décide sur ce qui s'affichera vraiment (même règle que `nextQuestion` :
   séance sans leçon, leçon de la séance déjà vue ou placée ailleurs) ; `replayNext` reçoit la séance. Kevin j2 : « rejouer ?
   ulong|1|rev (… leçon due true, leçon affichée false) » ; Lucie j2 : `derivref` rejouée. Contrôle `tests/r27b.html` (1.).

2. **Grave** (motivation) — 9e très faible sans chapitre : toujours la même notion. Kevin, 6 jours : 18 questions sur 27
   sont `decread` (« Écris en nombre décimal : 5 dizaines, 9 unités et 5 centièmes. »), 6 `numer` ; jour 2 : série de 4
   automatismes 4 fois `decread` (`decread-2-z5t`, `-we4`, `-z15`, `-d5i`), la limite « 2 fois par séance » étant levée
   faute d'autre notion. Reproduire : 5e ligne de commande. Correction : quand moins de 3 notions sont possibles, compléter
   par les rappels de primaire (n° 3) ou d'autres notions de 9e au niveau 1 avant de lever la limite.
   **Corrigé** : `PRIM.vary` (src/primaire.js) : 3e occurrence et suivantes d'une même notion remplacées par un rappel de primaire
   (prérequis de la notion, puis ceux des notions ratées, puis tout automatisme de fin de primaire pas encore repris), sinon
   retirées ; élève visé par les rappels seulement (`PRIM.applies`). Kevin 6 jours : `decread` 17 → 10 questions sur 27 → 24,
   6 rappels de primaire ; série du jour 2 : `decread decread p8dizaines p8tables`. Contrôle 2.

3. **Moyenne** — Rappels de primaire jamais servis à l'élève visé. Kevin (6 jours) : « primaire : applique false » au départ
   de chaque séance, Mathélo 880, 899, 897, 888, 890 (seuil 875) ; « applique true » seulement au départ des séances Carnet,
   où rien n'est injecté. Kevin (graine 71) : réussite récente « null » jusqu'au jour 3 (le positionnement ne compte pas, il
   faut 8 réponses). Correction : sous le plancher ou en grande difficulté depuis 2 séances, lever la condition de Mathélo
   (ou seuil 900).
   **Corrigé** : réussite lue dès 5 réponses (avant : positionnement arrêté sur 3 ratés et ≤ 50 % de réussite depuis) ; seuil
   de Mathélo porté de 875 à 925 dans ce cas, sous le plancher ou en grande difficulté au départ de 2 jours de séance
   (`PRIM.note`, `state.strugDays`). `_faibles` (5 graines, 28 j) : 9e très faible, séances sans réussite 63 → 50 %, 1er essai
   15 → 20 % ; 9e faible 31 → 35 % (1er essai 33 → 32 %) ; moyens et forts : 0 % de séances avec primaire (inchangé) ;
   irréguliers 0 → 9 %. Kevin (graine 71) : primaire servi dès le jour 2. Contrôle 3.

4. **Moyenne** — 10e moyen sans chapitre : que des notions de 9e. Arthur : 13 questions sur 13 en séance sur des reprises de
   9e (`again: [10]`) : `arith`, `premiers`, `numer`, `aire3`, `fracsimp`, `decdiv` (« 48,6 ÷ 6 »), `isom`, `dec10`
   (« 7,51 → 75,1 »), défi du jour `solides-4-ujg` (prisme hexagonal : 8 faces, 18 arêtes, 12 sommets). Aucune des notions
   propres à la 10e ouvertes (fracmul, pct, disque, vitesse, grandmanq, fracops, airelat, voldecomp, repere, vol) ;
   `diag=1` : 37 reprises éligibles pour 12 notions propres. Correction : au moins une notion propre à l'année par séance
   (variante `reprise` déjà mesurée, ou demi-malus pour les reprises).
   **Corrigé** : `Engine.ownYear` : sans chapitre « en classe », séance de 3 questions et plus sans notion propre à l'année →
   une question du milieu (pas une reprise ratée) devient une notion propre ouverte, au niveau 1 et sans leçon si la leçon
   reste à voir (jamais une 2e leçon dans la séance) ; grande difficulté ou forte baisse : inchangé. Arthur j2 : `repere` dans la
   Révision. `_faibles` : année antérieure 10e moyen 81 → 72 %, 11e 84 → 76 %, 1re 86 → 71 % ; 1er essai des moyens ± 3 points,
   irréguliers 11e 69 → 63 %, 1re 70 → 67 % (à surveiller). Contrôle 4.

5. **Basse** — Histoire de Recorde servie en 9e : « Résous la toute première équation … \(14x + 15 = 71\). Que vaut \(x\) ? »
   (Kevin) ; les équations sont en 10e (`eq1` CH: [10]). Reproduire : ligne 1, jour 1, Histoire. Correction : `need: ["eq1"]`
   sur ce récit.
   **Corrigé** : `need: ["eq1"]` sur le récit de Recorde. Contrôle 5.

6. **Basse** — Retour après absence : l'en-tête affiche « ✏️ 0 j » juste au-dessus de « Content de te revoir ! Ta série de
   2 jours s'est arrêtée… » (Kevin, Lucie, jour 3). Point 4 de tools/a_faire_27-11.md toujours ouvert. Correction : pas de
   compteur à 0 (icône seule).
   **Corrigé** : série perdue → pastille « ✏️ » seule (plus de « 0 j ») ; série en cours inchangée (« 🔥 3 j »). Contrôle 6,
   `tests/entete_360.html`.

7. **Basse** — Carnet trop long pour un élève faible : Lucie « Effacer mes erreurs (5 questions) » 7:05, après une séance de
   5:06. Kevin, fin du Carnet : « Aujourd'hui : 1 question réussie. » (réussie au 2e essai, donc rien effacé) avec « Carnet 3 à
   effacer » inchangé et « Cette semaine : 2 erreurs effacées » repris de la séance. Correction : 3 questions au plus en
   grande difficulté ; ne pas répéter la ligne « Cette semaine » dans le bilan du Carnet.
   **Corrigé** : Carnet de 3 questions au plus en grande difficulté (Lucie : 5 questions 7:05 → 3 questions 3:11) ; toute séance du
   Carnet a le bilan léger, juste : « 📕 Bien joué : 2 erreurs effacées ! », « 📕 1 question réussie, pas encore effacée. » + la
   règle, sans ligne « cette semaine ». Contrôle 7.

8. **Basse** — Jade (4e France) : leçon « Échelle, agrandissement, réduction » au jour 3 alors que la notion a déjà été posée
   les jours 1 et 2 (`echelle-1-jga`, `echelle-1-gbe`) ; échelle 4 fois en 15 questions (`-94h`, `-qh` encore).
   Reproduire : `#eleve=jade&jours=3&jour0=2026-11-30&graine=71&extras=curieux,histoire,carnet`. Correction : leçon avant
   la première question d'une notion du chapitre, pas après.
   **Corrigé** : leçon d'abord : la question dont la leçon est due passe en tête de la séance (`lessonAtStart`) ; variété entre
   les jours : une notion du chapitre réussie hier (ou avant-hier) cède la place à une autre notion du chapitre (une notion
   ratée revient comme prévu). Jade : échelle 4 → 2 fois en 15 questions. La règle du 26.11 (n° 5 : notion du chapitre posée
   sans leçon en Révision / Automatismes, leçon à la séance Mixte suivante) est gardée : voir « À soumettre ». Contrôle 8.

## Motivation

Kevin ne réussit presque rien du premier coup (jours 1–2 : aucune sur 5) ; le bilan reste positif et le retour est accueillant,
mais sans « rejouer » (n° 1), avec la même notion répétée (n° 2) et sans rappels de primaire (n° 3), les trois mesures du
jour qui devaient l'aider ne se voient pas dans ses séances. Lucie (3e MA1) : séances courtes, pas à pas efficaces
(« 2 solutions reconstruites »), bilan encourageant. Inès, Sami, Jade, Arthur : séances fluides, « Excellente séance ! »
fréquent ; pour Arthur, contenu trop en dessous de sa classe (n° 4).

## À soumettre (agent r27b, 27.11)

- **Leçon du chapitre « en classe »** : la notion du chapitre reste posée sans sa leçon en Révision / Automatismes (décision
  du 26.11, n° 5) ; la revue propose la leçon avant la toute première question de la notion. Garder la règle du 26.11 ?
- **Rappels de primaire** : seuil de Mathélo levé jusqu'à 925 ; les élèves « irréguliers » (−60, 45 % des jours) en reçoivent
  dans 9 % de leurs séances ; 9e faible : moins de séances sans réussite chez les très faibles, pas de gain chez les faibles.
- **Une notion propre à l'année par séance** : réussite au 1er essai des irréguliers de 11e et 1re en baisse de 3 à 6 points
  (5 graines, bruit possible). La notion propre est posée au niveau 1 sans sa leçon quand celle-ci reste à voir.
- **Al-Khwârizmî** (x² + 10x = 39) reste ouvert en 9e (aucun `need`) : même cas que Recorde ? (proposition : `need: ["eq2"]`).
