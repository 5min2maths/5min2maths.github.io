17 problème(s) dont 1 grave(s) — 7 moyens, 9 bas

# Revue « élèves joués » — 26.11 soir (branche agent/eleves2)

Six profils nouveaux, ajoutés à `tests/_trace.html`, joués dans la vraie interface (mode scolaire, chapitre choisi dans
« En ce moment en classe » le jour 1), 2 traces chacun (jours et graines différents), 2 à 3 jours par trace :

| Élève | Profil | Traces (`tests/_trace.html#…`) |
|---|---|---|
| Yanis | 11e CO, moyen | `eleve=yanis&jours=2&jour0=2026-11-23&graine=11` ; `eleve=yanis&jours=3&jour0=2026-11-25&graine=23&premier=0` |
| Sami | MP 2e, moyen | `eleve=sami&jours=2&jour0=2026-11-23&graine=13` ; `eleve=sami&jours=3&jour0=2026-11-25&graine=29&premier=0&consecutif=1` |
| Lucie | 3e Coll. MA1, faible | `eleve=lucie&jours=2&jour0=2026-11-23&graine=17` ; `eleve=lucie&jours=2&jour0=2026-11-26&graine=53&premier=0&chapitre=Combinatoire` |
| Max | 4e Coll. MA2, fort | `eleve=max&jours=3&jour0=2026-11-23&graine=19&consecutif=1` ; `eleve=max&jours=2&jour0=2026-11-26&graine=59&premier=0&chapitre=Suites` |
| Jade | 4e France, moyenne | `eleve=jade&jours=3&jour0=2026-11-23&graine=37` ; `eleve=jade&jours=2&jour0=2026-11-26&graine=61&premier=0&chapitre=Espace` |
| Théo | 2nde France, moyen | `eleve=theo&jours=3&jour0=2026-11-23&graine=41` ; `eleve=theo&jours=2&jour0=2026-11-26&graine=67&premier=0&chapitre=Fonctions` |

Toutes les réponses attendues ont été recalculées (≈ 150 questions et parties) : **aucune erreur de calcul**, aucun triangle
impossible, pas de TeX visible hors formule, pas de « Nouvelle notion » à tort, pas de compteur qui change en cours de séance.
Séparation France / romand : € et × partout, pas de CHF ni de lieu suisse vu ; deux écarts mineurs (n° 13).
Ce qui marche : positionnements adaptés à chaque classe (5:12 à 6:37), problèmes exacts et bien gradués (échelle qui glisse,
bille lâchée, cinéma à 3 inconnues, taxi, assurance maladie à franchise), écran de choix du chapitre par l'exemple (MP 2e :
4 chapitres, très clair), carnet qui annonce « presque effacée ».

Outil : `chapitre=auto|<n>|<regex>` choisit le chapitre ; les questions du chapitre sont marquées « 📚 » et comptées dans le
résumé ; `niv=N|R` pour la 3e–4e du Collège ; le journal liste les chapitres proposés et leurs notions (`id@classe`).

## Grave

1. **Haute** — Le chapitre choisi « en classe » n'est presque jamais travaillé quand c'est un chapitre de l'année.
   Ses notions sont « en cours » avec leçon pas encore vue ; or Révision, Défi et Automatismes excluent toute notion à leçon
   (`Engine.planSession`, `exclude = pend`). Résultat, questions sur le chapitre choisi :
   Sami (MP 2e, « Fonctions quadratiques ») **0 sur 8** puis **0 sur 15** ; Lucie (3e MA1, « Dérivation ») 2 sur 18 (le seul
   défi), puis « Combinatoire » **0 sur 10** ; Max (4e MA2, « Logarithme et exponentielle ») **0 sur 18**, puis « Suites » **0 sur 8**.
   Seuls passent les chapitres déjà vus (Yanis, Pythagore = 9e–10e : 3 sur 4) ou les notions « vues » du chapitre (n° 2).
   Reproduire : `#eleve=sami&jours=3&jour0=2026-11-25&graine=29&premier=0&consecutif=1` (ligne « ⓘ notions du chapitre :
   f2=encours, f2expr=encours… », résumé « questions du chapitre en classe : 0 sur 15 »).
   Correction : choisir un chapitre = ses notions sont « vues en classe » (`lessonSeen = true` dans `Engine.setNow`) ; le
   « Rappel de cours » reste à portée de main.
   **Corrigé (agent/soir) :** une notion du chapitre « en classe » se pose sans sa leçon (`Engine.lessonFirst` faux, `nowHas`) : servie en Révision, Défi et Automatismes ; sa leçon reste prioritaire pour l'unique leçon d'une séance Mixte / Applications (`lessonPick`) ; jamais de leçon en Révision / Défi (`plan.noLesson`, `session.noLesson`). Test `tests/chapitre_classe.html` (35 chapitres de l'année, 6 profils ; 135 échecs sur master). Traces (compteur 📚 du résumé, avant → après ; le total compte aussi positionnement et carnet) : Sami 0/15 → 9/15 (et 6/15, graine 13) ; Lucie Dérivation 2/18 → 4/15 (séance seule : 4/8), Combinatoire 0/10 → 6/8 ; Max Logarithme 0/18 → 9/18, Suites 0/8 → 5/11 ; Jade Espace 3/8 (quadri 2 fois au plus, les autres notions du chapitre sans automatisme).

## Moyens

2. **Moyenne** — Même notion 4 à 5 fois de suite dans une série d'automatismes, quand une ou deux notions seulement du chapitre
   sont disponibles (conséquence du n° 1). Jade (4e FR, « Espace et géométrie ») : 5 × « Dans un parallélogramme, un angle est
   le quintuple / mesure 50° de plus… » (`q-quadri-2-s0o`, `-uuu`, `-mgv`, `-t1s`, `-pii`) ; Théo (2nde) : 4 × modaff (cours
   de musique, taxi, forfait, musique) ; « Translations et vecteurs » 4 fois le jour 2 puis 3 fois le jour 3.
   Reproduire : `#eleve=jade&jours=2&jour0=2026-11-26&graine=61&premier=0&chapitre=Espace`, jour 2.
   Correction : une notion au plus 2 fois par séance ; les créneaux « chapitre » en trop redeviennent des créneaux normaux.
   **Corrigé :** une notion au plus 2 fois par séance (`planSlots`, compteur `cnt`) ; un créneau « chapitre » sans notion possible redevient normal ; la limite ne se lève qu'à défaut de toute autre notion.

3. **Moyenne** — `<br>` affiché en clair dans le diagnostic « 🔎 » (après le 2e essai) :
   « 🔎 N'oublie pas la racine donnée, \(-2\)<br>Elle est aussi solution. » (`q-polyfact-1-bdt`),
   « 🔎 On divise par la fraction (on multiplie par son inverse) :<br>\(18 \times \frac{8}{3}\). » (`q-probeq-2-z9y`),
   « 🔎 Le nombre est une fraction \(\frac{1}{\ldots}\)<br>L'exposant est négatif. » (`q-expo-1-zmh`).
   Cause : `colonBreak` met des `<br>` dans les pièges, puis `esc(lastDiag)` (`src/app.js` l. 2257) les échappe.
   Correction : `esc(lastDiag).replace(/&lt;br&gt;/g, "<br>")`.
   **Corrigé :** `escT(lastDiag)` (rend `<br>`, `<b>`, `<i>`).

4. **Moyenne** — « Presque : vérifie l'arrondi (au près). » pour une réponse fausse : salle 9,9 × 6,1 × 3 m, air 1,2 kg/m³,
   « à 20 kg près » ; 150,975 (volume ÷ 1,2) est traité comme un arrondi raté, le vrai piège (« La masse, c'est la masse
   volumique fois le volume ») n'est pas montré, et la phrase perd son nombre. `q-gquot-2-x9r`.
   Cause : `src/expr.js` l. 472, tolérance `round * 5` = ± 100 kg. Reproduire : `#eleve=theo&jours=3&jour0=2026-11-23&graine=41`, carnet du jour 2.
   Correction : tolérance `round` (une graduation) quand `round ≥ 1`, libellé « (à 20 près) ».
   **Corrigé :** `src/expr.js` : pour une graduation ≥ 1, « presque » = à une graduation près ; libellé « à 20 près », « à l'unité », « au dixième »…

5. **Moyenne** — « 🏔 Défi du jour · Un seul problème, prends ton temps. » donne une seule question de niveau 3 :
   Max (4e MA2) « Avec la définition, calcule f'(3) pour f(x) = 2x³ » (`q-nbderive-3-hag`), séance de **0:58** ;
   Théo, centre d'un parallélogramme (`q-vecgeo-3-gga`), 2:07, « Score 0,5 / 1 ». (Contexte du problème vu dans les 7 jours :
   repli au niveau 3, correctif D4 de ce matin.)
   Reproduire : `#eleve=max&jours=3&jour0=2026-11-23&graine=19&consecutif=1`, jour 2.
   Correction : dans ce cas, prendre le problème d'une autre notion (sinon libellé « Une question de défi »).
   **Corrigé :** Défi du jour : si la question tirée retombe au niveau 3 (contexte vu dans les 7 jours), on prend le problème d'une autre notion (4 au plus, `session.defiSkip`).

6. **Moyenne** — Énoncé invraisemblable : « Une voiture démarre ; elle a parcouru d(t) = 5/2 t² + 8t mètres… c) Après combien
   de secondes la vitesse moyenne depuis le départ atteint-elle 40,5 m/s ? » → 13 s, vitesse 73 m/s (263 km/h) ; « démarre »
   avec déjà 8 m/s. `q-tauxvar-4-f7r` (la variante ½ t² + 4t, `q-tauxvar-4-ixl`, est réaliste).
   Reproduire : `#eleve=lucie&jours=2&jour0=2026-11-23&graine=17`, jour 1 (« Refaire avec d'autres valeurs »).
   Correction : coefficient ½ ou 1 et cible c) ≤ 20 m/s (ou contexte train / moto).
   **Corrigé :** `src/defis.js` : a ≤ 1,5, cible c) ≤ 20 m/s, vitesse instantanée ≤ 35 m/s ; « Une voiture accélère ; depuis l'instant t = 0… ».

7. **Moyenne** — Corrigé trop court pour trois fractions : « Dénominateur commun 10 :−14/5. » (−5/2 + 2/5 − 7/10), aucune
   fraction convertie ; l'élève qui s'est trompé ne voit pas où. `q-fracadd-3-kkw` ; `src/ch11_no.js` l. 159 et 173.
   Correction : comme l. 150, écrire la ligne convertie (−25/10 + 4/10 − 7/10 = −28/10 = −14/5).
   **Corrigé :** `conv3` (`src/ch11_no.js`) : « Dénominateur commun 10 : −25/10 + 4/10 − 7/10 = −28/10 = −14/5 » (niveaux 2 « trois » et 3 « rel3 »).

8. **Moyenne** — France 2nde, écran « Ça ressemble à quoi en classe ? » : deux chapitres « Collège · Nombres et calculs »
   (une seule notion : sommet de f(x) = 3x² + 12x + 8, f2) et « Collège · Organisation et gestion de données » (P(A ∪ B),
   probaxiomes). Ce sont des notions placées en 2nde, rangées sous un thème du collège ; et le sommet d'un trinôme
   développé (−b/2a) relève de la 1re spécialité, pas de la 2nde.
   Reproduire : `#eleve=theo&jours=1&jour0=2026-11-26&graine=67&premier=0&chapitre=Fonctions` (ligne « ⓘ chapitres »).
   Correction : thème 2nde pour probaxiomes (« Statistiques et probabilités ») ; f2 sorti de la 2nde FR (1re).
   **Corrigé :** probaxiomes rangé en 2nde « Statistiques et probabilités » ; f2 placé en 1re (« Second degré », 1re.AL.10 / AN.10) ; eq2 (automatisme de 1re, 1re.AU.05) dans « Automatismes » au lieu de « Collège · Nombres et calculs ». Plus aucun chapitre « Collège · » en 2nde, 1re, Tle.

## Bas

9. **Basse** — Régression du correctif B10 : espace perdue après « : » entre deux formules. « écart vertical 5 :AB² = 26 »
   (`q-pyth-2-2xa`), « x² + 9x + 18 = 0 :c = 18 » (`q-eq2-3-krx`), « Contrôle avec x = 4 :−4x + 3 = −13 » (`q-ineq-2-d0l`),
   leçon intervalles « [a ; b[ :a compris », « La droite d :{système} » (aperçu de chapitre, 3e Coll.).
   Correction : `src/generators.js` (`colonBreak`), remplacer `" :"` par `" : "`.
   **Corrigé :** `colonBreak` : « : » entre deux formules garde son espace.

10. **Basse** — Division écrite « : » en texte simple, coupée en deux lignes par `colonBreak` : piège « par minute, 360° :⏎60 = 6° »
    (`q-rotation-1-2ih`, `src/variantes.js` l. 645) ; pas à pas « Facteur = nouvelle⏎Ancienne = 15 : 5 = ? » (`q-agrand-1-gml`,
    l. 385). Correction : la division dans une formule `M(…)` (devient ÷ au rendu).
   **Corrigé :** divisions dans une formule (`M("360° : 60 = 6°")`) ; guide « Facteur : nouvelle longueur divisée par l'ancienne, … ».

11. **Basse** — Corrigé « 8x − 11 = 7x + 2, donc x = 13 et x = 13. » (`q-probeq-1-5q9`). Correction : un seul « x = 13 ».
   **Corrigé :** étape « 1x = … » omise quand a − c = 1.

12. **Basse** — « Après une injection, la concentration… vaut C(t) = 12t/(t + 5) » : elle monte pendant 45 h vers 12 mg/L,
    l'inverse d'une injection. `q-limitinf-4-y4h` (`src/ch3c_ana.js` l. 757 et 1311). Correction : « Pendant une perfusion ».
   **Corrigé :** « Pendant une perfusion » (`src/ch3c_ana.js`, deux énoncés).

13. **Basse** — France : figure de leçon « 3n + 3 = 3 · 10 + 3 » (point médian, B6 encore présent ; leçon probeq, « Manipule »,
    Jade jour 2) ; « Sondage auprès de 40 apprentis » en 4e (`q-statfreq-4-ei2`, contexte d'école professionnelle suisse).
    Correction : conversion « · → × » aussi dans les figures de leçon ; « 40 élèves » pour le profil FR.
   **Corrigé :** localisation France aussi sur les figures de leçon redessinées (MutationObserver sur `.lesson-card`, `.act-inline`) ; « apprentis » → « élèves » pour un profil FR (FR_WORDS).

14. **Basse** (latence) — 11e : « Ça ressemble à quoi en classe ? » = 15 chapitres, chacun avec un exercice (≈ 50 s de
    défilement), dont 3 de 10e. Reproduire : `#eleve=yanis…graine=11`, écran 16. Correction : chapitres de 10e repliés.
   **Corrigé :** chapitres d'une autre année repliés (« Chapitres des années précédentes (3) », ouverts si le chapitre actuel en fait partie) : 11e, 12 cartes visibles au lieu de 15.

15. **Basse** — Corrigés : `q-uvol-3-run` « Convertis 650 cm³ en L » → « Bien vu ! » sans explication ; `q-sysprob-3-oy9`
    « Ils se rapprochent de \(140 km/h\) » (unité en italique dans la formule). Correction : une ligne de corrigé ;
    `\ \text{km/h}`.
   **Corrigé :** au positionnement, une réponse juste a sa correction repliée (« Voir la correction ») ; `\ \text{km/h}`.

16. **Basse** — « 💪 Une plus facile pour repartir » après un échec sur `q-probeq-2-z9y` (3/8, 1/4, 18 chansons) donne
    « La somme de 4 nombres pairs consécutifs vaut 196 » (`q-probeq-1-q01`), pas plus facile. Correction : rester sur la même forme au niveau 1.
   **Corrigé :** « Une plus facile » : au niveau inférieur, parmi 10 tirages, la question de même contexte, sinon celle qui a le plus de mots en commun avec la question ratée.

17. **Basse** — Lucie (3e MA1, faible), jour 1 : défi `q-tauxvar-4-ixl` refait avec d'autres valeurs, **12:33** au total, puis
    bilan « Score 0,6 / 2 » et « Séance courte aujourd'hui. Tu peux continuer autant que tu veux. »
    Correction : message « courte » seulement si la durée l'est (pas selon le nombre de questions) ; pas de « Score » fractionnaire pour un problème.
   **Corrigé :** « Séance courte » seulement si la séance a duré moins de 4 min (Défi : « C'était le défi du jour ») ; séance faite de problèmes seulement (défi + reprise) : « Parties justes ».

## Défauts vus pendant la présentation (corrigés sur agent/soir)

- B1 Accueil : « rien n'est envoyé sans ton accord, seulement des statistiques anonymes si tu dis oui » (aligné sur « Ce que l'app envoie »).
- B2 Bilan : « Objectif pour demain » en texte normal dans la carte de série (`.streak .goal b`).
- B3 Question curieuse « Le temps d'écran » : « jours complets » / « Nombre de jours de 24 h (au dixième) ».
- B4 Monômes : espace après « : » entre deux formules (n° 9) ; ponctuation collée à la formule qui la précède (`glueDots`, après MathJax).
- B5 « évaluation » partout dans l'UI élève (Je prépare une évaluation, Date de l'évaluation, Révision de l'évaluation, Je m'entraîne pour mon évaluation…) ; « test rapide » gardé ; sous-titre de la case : « prépare le jour J ».
- B6 MP, « Mes compétences » : la classe (« MP 2e ») au lieu de « Cette année ».
- B7 France, Progrès / Ma semaine : « premier(s) niveau(x) de maîtrise », « Pas encore de niveau de maîtrise en hausse » ; « Ce que l'app envoie » : « tes niveaux de maîtrise ».
