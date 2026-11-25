# Revue « élèves joués » — 26.11 (Claude, branche agent/eleves)

## Corrigé le 26.11 (branche agent/fixrevue)

Règle suivie : resserrer (corriger, simplifier, alléger), rien d'ajouté hors demande. Contrôles automatiques dans
`tests/revue_26_11.html` (sections `#only=tri,plong,tex,dec,arr,app`) ; suite complète verte (135 pages) ;
`_trace.html#scan=1` : **0 champ** ; les 5 élèves rejoués (graine 7).

| Point | Corrigé | Vérification |
|---|---|---|
| 1. Triangles impossibles (A1) | `ch11_thales.js` : refus des tirages sans inégalité stricte (niveau 3 périmètre, réciproque niveau 3, papillon) ; aussi `fr_3e.js` (thales4e : AB, AC, BC tirés séparément, 4/2/6 trouvé) et `ch11_gm.js` (pythrec « 3, 4, 8 cm ») | test : 486 triangles par côtés (toutes notions, niveaux 1–4), inégalité stricte |
| 2. Plongeur au-dessus de l'eau (A2) | `ch11_no2.js` : la remontée reste sous la surface, température ≥ −25 °C ; « point le plus bas d'un lac à −30 m » (référence ambiguë) → sous-marin / avion | test : plongeur toujours sous l'eau, températures plausibles |
| 3. TeX visible (A3) | filtre unique `plainTeX` (`generators.js`) appliqué par `colonBreak`, à l'indice et aux problèmes (niveau 4) : `{,}` → `,`, `\text{'}` → `'` hors formule ; un piège trigeq réécrit en formule | scan 0 champ (14 688 questions) |
| 4. Compteur instable (B1, B2) | jamais de leçon dans le Carnet ni dans « Mon évaluation » ; une 2e notion à leçon n'est plus retirée mais remplacée par une notion déjà travaillée (`Engine.swapLesson`) ; la remédiation remplace la question suivante au lieu de s'ajouter | test : Carnet « 1 sur 2 », « 2 sur 2 » ; séance à total constant ; traces : plus aucun « 5 sur 7 → étape 6 sur 8 » |
| 5. Durée de « Mon évaluation » (C1) | révision ciblée = 4 questions, niveau 3 au plus, sans problème | traces : 3:31 à 5:30 (au lieu de 7:41 à 12:07) |
| 6. Deux grands boutons (C2) | évaluation active et tâche du jour pas faite : la tâche remplace la carte séance (un seul bouton) ; J−2 (sujet de préparation) : présenté « au choix », la séance reste le grand bouton | test accueil ; la trace ne joue plus de séance en plus ces jours-là |
| 7. « Nouvelle notion » (B3) | notion réussie au positionnement : vue et leçon vue ; libellé réservé aux notions de l'année jamais travaillées (sinon « Rappel de cours », et en Révision ni « Nouvelle notion » ni « Révision ») | test (decread, Pythagore en 11e) |
| 8. Décimaux entiers (A4) | `dec()` (ch10_no.js) : dernier chiffre jamais 0 (corrige aussi « 3 · ? = 18 », A10) ; partage « 63 CHF entre 7 » (quotient entier) refusé | test decmul, decdiv, decadd : 1 350 questions |
| 9. Arrondi, énoncé, indice (A5–A7) | carrelage : valeur attendue = valeur du corrigé (523,08), arrondis `r1`/`r2c` et « Les bonnes réponses » sur l'écriture décimale ; « une fois et demie le tarif normal » ; f2 sommet canonique : indice propre + piège (−h ; −k) | tests sur les codes de la revue |
| 10. Motivation (D1–D4, D2) | « plafond du jour atteint, reviens demain » au lieu de +0 ; fin du pas à pas selon le résultat (« Voici la solution complète (n étapes justes sur N) ») ; un problème dont le contexte a été vu dans les 7 jours (toutes notions) est évité, sinon niveau 3 en séance ; Mathélo provisoire (n < 20) : échec de niveau 1 plafonné à −15 | tests |
| 11. France (B6, B7, A14) | accueil avec l'aperçu France : 6e · 5e · 4e · 3e · Lycée, essai localisé (€, ×), énoncés suisses écartés ; titres d'écran (.eyebrow) sans conversion « · → × » ; quartiles : hors programme au collège (médiane et étendue seulement, 4e.DP.02 / 3e.DP.02, quartiles en 2nde) → formes à quartiles écartées avant la 2nde (HORS_FR), libellé « Étendue, médiane » | tests |
| 12. Petits points (B5, B8, C3) | veille du test sans grille de départ : « Autoévaluation » (plus de « Test rapide final ») et fin de grille adaptée ; « Je prépare un test » : chapitre en classe et chapitres récents, le reste replié (« Autres chapitres de l'année ») ; positionnement annoncé « environ 5 minutes » (1 min par question) | tests |

Tests existants modifiés volontairement (commentaire dans le test) : `court.html` (le total ne grandit plus avec la
remédiation ; « Nouvelle notion » seulement pour les notions de l'année), `carnet.html` (veille sans grille =
Autoévaluation).

**Ce qui reste** (non demandé dans ce lot, ou à décider) : séance d'une question (Léa jour 1, C6) et bilan « c'était le
défi du jour » (B4) ; pas à pas qui ne donne pas la valeur de l'étape (A8) ; « Vrai ou faux ? » sur un « Trouve
l'erreur » (A9) ; décimal de calculatrice accepté pour une valeur exacte (A11) ; Curieux « 35 % » sans signe (A12) ;
accords « décimale(s) » (A13) ; « Classe 2e MP » et « MP 2e » (B9) ; colonBreak entre deux formules (B10) ; corrigé
« −1L » (B11) ; séance de 6 à 8 min avec leçon + 6 automatismes (C4) ; Mathélo de la bonne élève (D5) ; carte
statistiques répétée (D6) ; leçon « Étendue et quartiles » encore affichée telle quelle en 4e FR.

Cinq élèves, chacun sur 4 jours (du lundi 16.11 au vendredi 20.11), joués dans la **vraie interface** par l'outil
`tests/_trace.html` (premier lancement, positionnement, visite guidée, séances, « Mon évaluation » du jour 1 au jour J,
Carnet, Problème de la semaine, Curieux, Histoire). Chaque question rencontrée a été refaite à la main.
Règle suivie : **resserrer plutôt qu'enrichir** — les corrections proposées simplifient, corrigent ou allègent.

## L'outil de trace

```
nice timeout 300 chromium --headless --disable-gpu --no-sandbox --virtual-time-budget=120000 \
  --dump-dom "file://$PWD/tests/_trace.html#eleve=lea"        # lea | noah | ines | malik | chloe
```

- Paramètres libres : `#profil=CH-9|CH-11|CH-12|MP-13|FR-8&niveau=faible|moyen|fort&strategie=aide,guide,idk,lecon,figure,presse,facile&jours=4&premier=1&extras=carnet,curieux,histoire,eval,probleme&jour0=2026-11-16&graine=7`, `consecutif=1` (jours qui se suivent, pour voir le sujet de préparation du mercredi).
- Journal dans `<pre id="out">` : texte visible de chaque écran (`#n` = numéro d'écran), boutons proposés, action, retour,
  Mathélo, points de l'année, carnet, temps estimé (lecture à la vitesse de l'élève, réflexion selon la difficulté,
  saisie), et pour chaque question la réponse attendue (`ⓘ attendu`) pour la vérification.
- `stopat=31` (ou une expression régulière sur le titre de l'écran) arrête la trace et laisse l'écran affiché, pour une
  capture `--screenshot --window-size=390,1200`.
- `#scan=1&n=12` : balayage de contenu (TeX visible hors formule dans indices, pièges, pas à pas, corrigés) sur toutes
  les notions et les 4 niveaux.
- Limites : MathJax est simulé (les formules apparaissent en TeX dans le journal, c'est normal) ; Chromium sans
  interface impose une fenêtre d'au moins 500 px, donc la mise en page à 390 px n'est jugée que sur les captures
  (pas de mesure fiable des débordements) ; les défis à glisser (Manipule) ne sont pas joués ; au test rapide, le
  choix de l'élève est en partie au hasard.

Temps estimés ci-dessous = temps qu'un élève réel passerait (lecture + réflexion), pas le temps machine.
Les journaux cités sont ceux de `#eleve=…` (graine 7, reproductibles) ; quelques exemples marqués « 1er passage »
viennent d'un premier passage, avant une retouche de l'outil (choix au test rapide) : leur code `q-…` les rejoue
(`…/#q-code`).

---

## 1. Léa — 9e CO, en difficulté, lit vite, utilise l'aide

**Déroulé** (journal `#eleve=lea`)
- Premier lancement : **6 min 16** jusqu'à l'accueil (accueil 0:42, positionnement de 5 questions 5:14 alors que
  l'écran annonce « au plus 5 questions … (2 à 3 minutes) » et « environ 3 min »).
- Jour 1 : séance « 🧠 Révision » = 1 leçon + **1 question** (1:32). Carnet (1:48).
- Jour 2 : « 🎯 Révision ciblée » de l'évaluation **12:07**, puis la séance du jour (Défi) 5:03 → **17 min** ce jour-là.
- Jour 3 : test rapide final (8 QCM, ≈ 6 min) + séance automatismes 6:31.
- Jour 4 (jour J) : échauffement 6:10 + séance 6:20 + carnet 5:06.

**Ce qui marche**
- Les diagnostics d'erreurs typiques tombent juste : 9,2 au lieu de 15,4 (« 🔎 On multiplie le prix par le nombre
  d'objets. ») ; −1,3 pour un écart (« Un écart est positif ») ; 9,076 (« Les dixièmes sont le 1er chiffre après la virgule. »).
- « On le fait ensemble » est court (1 ou 2 étapes) et bien ciblé (decdiv-1-scj : « Opération : 199,50 ÷ 7. Résultat ? »).
- Histoire « La Pascaline » : récit court, exercice direct (4 554 + 2 769 = 7 323), réponse expliquée.

**Ce qui gêne** (texte vu à l'écran)
- Jour 1, séance « Révision · Tes notions à revoir aujourd'hui » : « NOUVELLE NOTION · ÉTAPE 1 SUR 2 » (leçon decread),
  une question, fin. Le bilan dit : « Une seule question aujourd'hui : **c'était le défi du jour**. » — faux, c'était la Révision.
- La leçon « Nouvelle notion » porte sur une notion qu'elle vient de **réussir au positionnement** (decread-2-o75 juste,
  puis « NOUVELLE NOTION · Lire un nombre décimal »). Idem decarr, ordgr, deccomp, decadd les jours suivants.
- Carnet : « Effacer mes erreurs (2 questions) » → leçon « NOUVELLE NOTION · ÉTAPE 1 SUR 3 », « CARNET D'ERREURS · 2 SUR 3 »,
  puis **fin après une seule question** (la 2e erreur est retirée du programme sans le dire). Jour 4 : « CARNET D'ERREURS ·
  1 SUR 5 » puis « NOUVELLE NOTION · ÉTAPE 2 SUR 6 » : le total change en cours de route.
- decmul-1-5it : « Calcule sans calculatrice : 5 · 3 » dans « Multiplier des nombres décimaux », corrigé « 5 a 0 décimale,
  donc 15 » ; le piège affiché après 1,5 : « Le résultat a autant de décimales que 5 (pas plus). »
- Piège illisible (TeX brut hors formule) : « Pas encore. Réessaie ! Il faut replacer la virgule : 2{,}86 a 2 décimale(s). » ;
  au 1er passage : « 🔎 Il faut replacer la virgule : 1{,}91 a 2 décimale(s). »,
  « Multiplier par 0{,}01 rend le nombre plus petit. », test rapide « 🔎 Le carré, c'est 2{,}7 · 2{,}7, pas 2 · 2{,}7. »
- (1er passage) Pas à pas decarr-1-k0v (18,07 à l'unité) : deux étapes ratées (« Pas tout à fait. 5 ou plus : on monte ; sinon on garde. » —
  la valeur attendue, 0, n'est jamais dite), puis « **Bravo, tu as reconstruit la solution.** »
- « On carrelle une pièce rectangulaire… » 3 fois en 4 jours (decmul-4-qkr, decmul-4-nwk le **même jour**, decmul-4-q7e).
- decmul-4-qkr : b) 21,35 · 24,50 = 523,075 ; le corrigé dit « ≈ 523,08 », la valeur stockée est 523,0749999… : si b) est
  ratée, « Les bonnes réponses » affiche **523,07** sous un corrigé qui dit 523,08 (les deux sont acceptés).
- (1er passage) Test rapide : ligne « Diviser par un décimal, portions, compléter » → « Complète : 3 · ? = 18 » (aucun décimal, livret).
- Jour 3, « 📋 Test rapide final … ta grille compare avec le début » alors qu'aucune autoévaluation de départ n'a été
  faite ; fin de grille : « Refais le test rapide dans quelques jours, juste avant le test » — le test est le lendemain.
- Mathélo très nerveux en provisoire : −29, −30 pour une question de niveau 1 ratée ; « Bonne séance. Mathélo −23 ».

## 2. Noah — 11e CO, moyen, pressé

**Déroulé** (profil créé sans positionnement) : séance automatismes 3:07 ; « Révision ciblée » 7:41 ; Révision 3:02 ;
carnet 0:41 ; test rapide ≈ 6 min ; défi 4:21 ; jour J 2:19 ; séance 3:33.

**Ce qui marche**
- Automatismes de 11e bien dosés et variés : (5√7)², trapèze, 0,6̄ en fraction, aire x(x + 8), crochets.
- Diagnostics précis : pctvar « Attention au signe : c'est une baisse. » ; monomes « Additionne les exposants de chaque lettre ».
- Curieux « Plus riche ? » (salaire +2 %, prix +3 %) : pari parlant, « Le fin mot » clair (× 1,02/1,03 ≈ 0,9903).
  Au 1er passage, « Les concombres qui sèchent » (50 kg à 99 % d'eau → 25 kg) : excellent.
- Petit bémol sur « Plus riche ? » (cur-salaire-j3w) : l'étape « On vérifie » demande seulement le nouveau salaire
  (5 000 · 1,02 = 5 100), ce qui ne tranche pas le pari ; c'est « Le fin mot » qui fait le vrai calcul.

**Ce qui gêne**
- « Je prépare un test » : **une cinquantaine de notions** à parcourir (12 chapitres de 11e + 10e) pour en cocher trois ; un élève pressé abandonne.
- Révision ciblée : « RÉVISION DU TEST · 5 SUR 7 », puis « RAPPEL DE COURS · **ÉTAPE 6 SUR 8** » (leçon insérée au milieu,
  le total passe de 7 à 8), 7:41 au lieu de 5 min.
- Séance « 🧠 RÉVISION · 1 SUR 4 », puis « NOUVELLE NOTION · 2 SUR 4 » et « NOUVELLE NOTION · 3 SUR 4 » sans leçon
  (racenc, pythfig) : Pythagore n'est pas une nouvelle notion en novembre de 11e.
- Bilans « Points de l'année **+0** » (séance 3,5/4 du jour 2, puis carnet) : le plafond de 40 points/jour a été atteint par
  la révision ciblée ; l'« Objectif pour demain : encore 81 points » ne bouge pas.
- Le jour J, l'accueil montre deux grands boutons (« C'est parti » de l'évaluation et « ▶ Ma séance du jour ») : il fait
  les deux, pensant que les deux sont dus.

## 3. Inès — 1re Collège, très bonne

**Déroulé** : premier lancement 5:03 ; Révision 3:57 ; Problème de la semaine 2:27 ; Révision ciblée 9:55 ; défi 2:32 ;
test rapide ≈ 6:45 ; automatismes 6:00 (dont leçon) ; jour J 4:03 ; Problème 4:18. A touché « Trop facile ⏭ » 4 fois.

**Ce qui marche**
- Positionnement juste et rapide pour une bonne élève (ensembles, domaine, cône avec erreur de Noé, angles, 8/√5 + √5 = 13√5/5).
- Problèmes riches et exacts : angles inscrits (94°, 43°, 133°), dodécagone (150°, 15°, 30°), tangentes (15 ; 120 ; 14,1),
  racprop-4-3re (17√3 ; 180 ; 120√3/17).
- « Trop facile » fait monter immédiatement (« ⚡ … · 🧩 APPLICATION » à la question suivante).
- Curieux « Garder ou changer ? » (Monty Hall) : très bien écrit.

**Ce qui gêne**
- thales-3-q7c : « AD = 2, AB = 4, AE = 4 et DE = 6 (en cm). Calcule le périmètre du trapèze DECB. » → **triangle ADE
  impossible** (2 + 4 = 6 : triangle plat), et ABC de côtés 4, 8, 12 aussi. Une bonne élève le voit tout de suite.
- Séance « Révision » de 1re : « NOUVELLE NOTION · 1 SUR 4 » à « 4 SUR 4 » pour Thalès, cercle de Thalès, réciproque de
  Pythagore, formule — tout cela vient du CO.
- racprop-4-3re c) « valeur exacte » : un décimal à 10 chiffres (12,2262409946, ce qu'affiche une calculatrice) est accepté
  comme juste.
- « Je prépare un test » : plus de 80 notions (17 pour le seul chapitre « Degré 2 »).
- Mathélo +3 / +4 sur des automatismes de niveau 2 réussis : « Excellente séance ! » mais progression quasi nulle ; elle
  s'ennuie dans la série d'automatismes (4 « Trop facile » en 4 jours).

## 4. Malik — MP 2e, pragmatique

**Déroulé** : premier lancement 5:45 ; Révision 6:01 (4 questions de niveau 3) ; Révision ciblée **11:13** ; défi 4:25 ;
carnet 4:08 (leçon « Les priorités » comprise) ; test rapide ≈ 8 min ; automatismes **8:22** ; jour J 3:29 ; séance 4:48.

**Ce qui marche**
- Le choix « Maturité professionnelle (CFPT, école professionnelle…) » est clair ; positionnement adapté (repère, pente lue, droite parallèle).
- Problèmes ancrés dans le réel (heures supplémentaires, rectangle de périmètre 50 → 16 × 9), corrigés complets.
- Réciproque d'une fonction affine : diagnostic « Réciproque ≠ opposé ni inverse : on défait l'opération. » et pas à pas d'une étape, net.

**Ce qui gêne**
- probeq-3-xpp : « chaque heure supplémentaire est payée **une fois et demie plus** » — compris littéralement, c'est 2,5 fois
  le tarif ; la réponse attendue (3 h) suppose 1,5 fois (39 CHF).
- f2-1-b9d (sommet de f(x) = −(x − 3)² − 5) : après « −3 ; 5 », l'indice parle d'autre chose : « Zéros : factorise ou
  discriminant. Sommet : x_S = −b/(2a)… » ; aucun mot sur la lecture de la forme canonique ni sur le signe.
- Jour J : « RÉVISION DU TEST · 1 SUR 3 », puis « RAPPEL DE COURS · **ÉTAPE 2 SUR 4** » (leçon « Retrouver l'expression
  d'une parabole », avec son « Devine ») **le jour de l'évaluation** ; « 3 questions pour te mettre en route » en fait 4 étapes.
- Carnet : leçon « NOUVELLE NOTION · Les priorités — Combien fait 2 + 3 · 4 ? » pour un apprenti de 2e année.
- Mathélo −32 puis −35 dans la révision ciblée, −22 puis −37 au carnet (questions de niveau 1) ; bilan du carnet
  « Bonne séance. Mathélo −42 ».
- En-tête « Classe 2e MP » et carte « 🌱 Pousse · MP 2e » sur le même écran.
- (premier passage de la trace) Corrigé sys2-4-msi : « \(-1L + 2l\) = 2 » (coefficient −1 écrit) ; reduire-2-wuc : « Les x² ⏎ 3x² ; les x ⏎ 3x » (les « : »
  après une formule sont remplacés par un retour à la ligne, la phrase perd son sens).

## 5. Chloé — 4e, France (aperçu)

**Déroulé** : premier lancement 5:44 ; défi 3:17 ; Révision ciblée 9:36 ; automatismes 6:38 ; carnet 2:11 ; test rapide
≈ 7 min ; Révision 6:19 ; jour J 2:09 ; séance 4:42.

**Ce qui marche**
- Localisation des questions : « × », « € » (Sara, 5/6 de 840 € = 700), programmes de calcul, empilements, hauteurs.
- Hauteurs : hauteurs5-2-jq0 (AB = 14, h = 24, BC = 25 → 13,44) cohérent ; orthocentre (90° − 67° = 23°) juste.
- Curieux « +50 % gratuit » vs « −35 % » : très bon pour une 4e.

**Ce qui gêne**
- Accueil (premier écran, aperçu France activé) : « Je suis en : 9e · 10e · 11e · Sec. II » et l'essai « Un stylo coûte 3,30 CHF ».
- Test rapide : « JE PRÉPARE MON TEST · ÉTAPE 2 SUR 2 **×** 1 SUR 8 » (le « · » du titre est converti en « × » car il est entre deux chiffres).
- rel-1-jny : « Un plongeur est à −2 m (sous la surface). Il **remonte de 16 m**. À quelle altitude est-il ensuite ? » → 14 m :
  le plongeur est à 14 m au-dessus de l'eau.
- Leçon valnum « Manipule » : « 2 · (1)² − 3 · (1) = 2 · 1 − 3 = −1 » (point médian, pas « × », dans la figure).
- Curieux cur-gratuit : l'énoncé dit « « 35 % sur le prix » » (sans le signe −) alors que le choix dit « −35 % sur le prix ».
- « Je prépare un test » : une soixantaine de notions pour une 4e, dont « Étendue, médiane, **quartiles** » (programme de 2nde en France).
- Révision de 4e : « NOUVELLE NOTION » sur divcrit, eqverif, repere (notions de 5e).

---

## Problèmes consolidés

Gravité : **H** haute (faux ou bloquant, à corriger d'abord), **M** moyenne, **B** basse.

### A. Erreurs de contenu (priorité 1)

| # | Gravité | Problème | Reproduire | Correction proposée |
|---|---|---|---|---|
| A1 | H | Triangle impossible dans Thalès niveau 3 : AD, AE, DE tirés indépendamment (AD = 2, AE = 4, DE = 6) | `#q-thales-3-q7c` ; `src/ch11_thales.js` l. 52 | Refuser le tirage si l'inégalité triangulaire n'est pas stricte (`if (de >= ad + ae \|\| ad >= ae + de \|\| ae >= ad + de) return null`) |
| A2 | H | Plongeur qui « remonte » au-dessus de l'eau (−2 m, remonte de 16 m → +14 m) | `#q-rel-1-jny` ; `src/ch11_no2.js` l. 43 | Pour le plongeur, borner la remontée : d < \|t0\| (ou contexte « température » seulement quand le résultat est positif) |
| A3 | H | TeX brut visible hors formule dans 46 champs (pièges, indices, pas à pas, corrigés) : « 1{,}91 », « 1\text{'}000 », « 0{,}01 » | `#scan=1` (liste en annexe) ; ex. `#q-decmul-1-2`, `#q-dec10-1-3`, `#q-change-1-6` | Entourer les nombres de `M(…)` dans les messages, ou, plus court, un filtre unique au rendu (escT / runGuide) qui remplace `{,}` → `,` et `\text{'}` → `'` hors formule |
| A4 | M | « Décimaux » qui sont des entiers : `dec()` peut rendre 5,0 → « Calcule sans calculatrice : 5 · 3 », « 5 a 0 décimale » | `#q-decmul-1-5it` ; `src/ch10_no.js` l. 18 et 115 | Dans `dec`, refaire le tirage si le résultat est entier (ou tirer le dernier chiffre de 1 à 9) |
| A5 | M | Énoncé ambigu : « payée une fois et demie plus » (= 2,5 fois au sens strict) | `#q-probeq-3-xpp` ; `src/ch1c_eq.js` l. 318 | « payée une fois et demie le tarif normal » |
| A6 | M | Arrondi au centime incohérent : 523,075 → corrigé « 523,08 », « Les bonnes réponses » « 523,07 » (flottant 523,0749999) | `#q-decmul-4-qkr`, partie b) fausse | Arrondir la valeur attendue avec un epsilon (`Math.round(v / r + 1e-9) * r`) dans le générateur et dans `pAns` |
| A7 | M | Indice hors sujet : sommet d'une forme canonique, indice sur les zéros et le discriminant | `#q-f2-1-b9d`, répondre « −3 ; 5 » | Indice propre à la question (« f(x) = a(x − h)² + k : sommet (h ; k), attention au signe de h ») et un piège TR sur (−h ; k) |
| A8 | M | Pas à pas qui ne donne pas la valeur de l'étape (« Chiffre des dixièmes ? » → « Pas tout à fait. 5 ou plus : on monte ») | `#q-decarr-1-k0v` (18,07), « On le fait ensemble », répondre faux | Faire commencer chaque `g.sol` par la valeur attendue |
| A9 | B | « Vrai ou faux ? » sur une question qui n'en est pas une (« Sam écrit … Trouve l'erreur, puis donne le bon produit. ») | Sujet de préparation (Noah, `consecutif=1`), partie C | Titre « Trouve l'erreur » pour ce type d'item |
| A10 | B | Ligne du test rapide sans rapport avec sa question : « Diviser par un décimal, portions, compléter » → « 3 · ? = 18 » | Test rapide, évaluation décimaux 9e | Retirer cette variante « compléter » de la ligne, ou un facteur décimal |
| A11 | B | Valeur exacte demandée, décimal de calculatrice accepté (12,2262409946 pour 120√3/17) | `#q-racprop-4-3re`, partie c) | Avec `radical`/`pi`, refuser un décimal non terminal de plus de 4 décimales (« Donne la valeur exacte ») |
| A12 | B | Curieux : énoncé « « 35 % sur le prix » » sans signe, choix « −35 % » | `#q-cur-gratuit-rjr` ; `src/curieux.js` l. 113 | « −35 % sur le prix » dans l'énoncé |
| A13 | B | Français : « 1 rang(s) », « 2 décimale(s) », « angle consécutif (voisin) (en degrés) » | `#q-decdiv-1-upg`, `#q-decmul-1-2` | Accord calculé (déjà fait dans le corrigé de decmul, pas dans les pièges) ; une seule parenthèse |
| A14 | B | France 4e : « Étendue, médiane, quartiles » proposé (quartiles = 2nde) | Profil FR-8, « Je prépare un test » | Vérifier le placement FR de la notion quartiles |

### B. Bugs et ergonomie

| # | Gravité | Problème | Reproduire | Correction proposée |
|---|---|---|---|---|
| B1 | H | Le compteur change en cours de séance quand une leçon arrive au milieu : « 5 SUR 7 » → « ÉTAPE 6 SUR 8 » ; « CARNET · 1 SUR 5 » → « ÉTAPE 2 SUR 6 » ; jour J « 1 SUR 3 » → « ÉTAPE 2 SUR 4 » | Noah révision ciblée (`#eleve=noah`, écran « RAPPEL DE COURS ») ; Léa carnet jour 4 ; Malik jour J (« 1 SUR 3 » → « ÉTAPE 2 SUR 4 ») | Pas de leçon hors de la 1re étape : en Carnet et en Évaluation, jamais de leçon (le rappel de cours reste ouvrable dans la question) |
| B2 | H | Carnet « Effacer mes erreurs (2 questions) » qui s'arrête après 1 question (la 2e retirée car sa leçon n'a pas été vue) ; compteur « 2 SUR 3 » | `#eleve=lea`, jour 1, case Carnet | Même correction que B1 : pas de leçon ni de retrait en Carnet |
| B3 | H | « Nouvelle notion » (leçon d'entrée) sur des notions réussies au positionnement, et sur toute notion des années précédentes jamais travaillée dans l'app (Thalès en 1re, Pythagore en 11e, priorités en MP 2e, relatifs en 4e) | `#eleve=lea` (decread juste puis leçon), `#eleve=ines` jour 1 | Au positionnement, marquer la notion vue (`seen`, `lessonSeen`) ; libellé « Nouvelle notion » réservé aux notions de l'année en cours, sinon aucun libellé |
| B4 | M | Bilan « Une seule question aujourd'hui : c'était le défi du jour » après une séance Révision réduite à 1 question | `#eleve=lea`, jour 1 | Message selon `session.fmt` ; et ne pas réduire une séance à 1 question (voir C2) |
| B5 | M | « Test rapide final … ta grille compare avec le début » sans autoévaluation de départ ; grille finale « Refais le test rapide dans quelques jours » la veille du test | Tous, jour 3 (J−1) | Sans colonne Avant, titre « Test rapide » ; message de fin selon les jours restants (J−1 : « Demain, c'est le test : relis les ⚠️ ») |
| B6 | M | France : titre « ÉTAPE 2 SUR 2 × 1 SUR 8 » (le « · » d'interface converti en « × ») ; figure de leçon « 2 · (1)² − 3 · (1) » non convertie | `#eleve=chloe`, test rapide ; leçon valnum, « Essayer sur la figure » | Ne pas appliquer la conversion « · → × » au titre (`.eyebrow`) ; l'appliquer aux textes des figures de leçon |
| B7 | M | Accueil d'un visiteur France : classes suisses (« 9e · 10e · 11e · Sec. II ») et essai en CHF | `#eleve=chloe`, écran 1 | Avec l'aperçu France, ligne « 6e … 3e · Lycée » et essai sans devise (ou en €) |
| B8 | M | « Je prépare un test » : toute l'année d'un coup (une cinquantaine en 11e, une soixantaine en 4e FR, plus de 80 en 1re Coll.) | Case Évaluation → « Je prépare une évaluation » | N'afficher que les chapitres déjà ouverts (vu / en cours), le reste derrière « Autres chapitres » |
| B9 | B | En-tête « Classe 2e MP » et carte « Pousse · MP 2e » sur le même écran | `#eleve=malik`, accueil | Une seule forme (« MP 2e ») |
| B10 | B | `colonBreak` mange le « : » entre deux formules : « Les x² ⏎ 3x² ; les x ⏎ 3x » | `#q-reduire-2-wuc` | Ne couper qu'après une phrase (texte non mathématique avant le « : ») |
| B11 | B | Corrigé « −1L + 2l = 2 » (coefficient −1 affiché) | `#q-sys2-4-msi` | Passer le corrigé par `tidy` (déjà fait pour l'énoncé) |

### C. Durée et charge

| # | Gravité | Problème | Mesure | Correction proposée |
|---|---|---|---|---|
| C1 | H | « 🎯 Révision ciblée · 7 questions … avec un problème pour finir » : 7:41 (Noah, pressé) à 12:07 (Léa) | Tous, jour 2 de l'évaluation | 4 questions, sans problème (le problème reste dans le Défi du jour) |
| C2 | H | Le même jour, deux grands boutons (évaluation + « Ma séance du jour ») : les élèves font les deux, 15 à 17 min | Accueil du jour 2 au jour J | Évaluation active → la séance du jour *est* la tâche de l'évaluation (un seul bouton) |
| C3 | M | Positionnement annoncé « 2 à 3 minutes », « environ 3 min » : 4 à 5 min réelles pour 5 questions de niveau 2 | Tous les premiers lancements (5:03 à 6:16 jusqu'à l'accueil) | Annoncer « environ 5 minutes », ou 4 questions |
| C4 | M | Séance « 5 minutes » à 6–8 min dès qu'une leçon s'ajoute à 6 automatismes (Malik 8:22, Léa 6:31, Chloé 6:38) | `#eleve=malik`, jour 3 | Leçon + 4 automatismes au plus (la leçon compte pour 2) |
| C5 | M | Sujet de préparation « environ 40 min » comme tâche du jour (J−2) | `#eleve=noah&consecutif=1&jours=3` | Le présenter comme facultatif ; tâche du jour J−2 = la moitié A + B (≈ 15 min) |
| C6 | B | À l'inverse, séance d'1 question (Léa jour 1 : leçon + 1 question = 1:32) | `#eleve=lea`, jour 1 | Si les notions suivantes sont retirées (leçon non vue), les remplacer par des révisions de notions vues |

### D. Motivation

| # | Gravité | Problème | Reproduire | Correction proposée |
|---|---|---|---|---|
| D1 | M | « Points de l'année +0 » après une bonne séance (3,5/4), parce que le plafond de 40 points/jour a été atteint par la révision ciblée | `#eleve=noah`, jour 2 ; Chloé, Inès jour 2 | Les +10 de séance finie hors plafond, ou ne pas afficher la ligne quand c'est 0 (« plafond du jour atteint ») |
| D2 | M | Mathélo provisoire très nerveux : −32, −35, −37 sur des questions de niveau 1 ; « Bonne séance. Mathélo −42 » | `#eleve=malik`, jour 2 (révision ciblée, carnet) | Plafonner la perte par question pendant la période provisoire (p. ex. −15) |
| D3 | M | « Bravo, tu as reconstruit la solution. » même quand toutes les étapes du pas à pas sont fausses | « On le fait ensemble » en répondant faux à chaque étape | « Voici la solution complète » si une étape au moins est fausse |
| D4 | B | Même contexte répété : « On carrelle une pièce… » 3 fois en 4 jours, 2 fois le même jour | `#eleve=lea` (decmul-4-qkr, -nwk, -q7e) | Le tag `ctx` anti-répétition aussi pour les problèmes de niveau 4 (et entre Évaluation et Défi) |
| D5 | B | Bonne élève : +3 / +4 de Mathélo par automatisme réussi, 4 « Trop facile » en 4 jours | `#eleve=ines` | Après deux « Trop facile » dans une semaine, format du jour Application ou Défi plutôt qu'Automatismes |
| D6 | B | Carte « 📊 Envoyer des statistiques anonymes ? » en tête de l'accueil chaque jour tant qu'on ne répond pas | Tous, jours 2 à 4 | L'afficher 2 fois au plus, puis seulement dans les Réglages |

---

## Annexe — TeX visible hors formule (`#scan=1&n=12`, 12 tirages par niveau)

46 champs touchés. Exemples (le reste dans la sortie du scan) :

- decmul · piège ×17 : « Il faut replacer la virgule : 2{,}5 a 1 décimale(s). »
- dec10 · piège ×23 : « Le nombre a grandi : on a multiplié par 10, pas par 0{,}1. » ; dec10 · pas à pas ×11
- decarr · corrigé ×18 : « … on arrondit à 8{,}5 … » ; decarr · piège ×12
- divcrit · corrigé ×12 : « 1\text{'}935 ; 1\text{'}980 »
- reladd · corrigé ×12 : « Altitudes : 460 ; 1\text{'}635 ; 1\text{'}225 … »
- pente · piège ×16 : « La pente 8 % = 0{,}08. »
- uaire · indice ×12 : « 50 cm = 0{,}5 m. » ; pow9 · indices ×10 : « Écris 2\text{'}048 comme une puissance de 2 »
- change, prop, ulong · pas à pas : « 1 EUR = 0{,}95 CHF … », « 4{,}1 kg en g ? »
- log, pct, modexp, normale, suitedef, trigfn, ineq1, logbase, probrat, approxnorm, optimderiv, ordgr, rac, racprop, pctvar, proptab, deccomp, decdiv, decadd, fracsimp : idem (1 à 12 occurrences)

Cause commune : des nombres formatés par `N()` (virgule TeX `{,}`, milliers `\text{'}`) collés dans du texte hors
`\( … \)` ; MathJax ne les traite pas. Un seul filtre au rendu corrige l'ensemble sans toucher aux générateurs.
