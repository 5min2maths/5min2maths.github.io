14 problème(s) dont 1 grave(s) — 4 moyens, 9 bas

# Revue « élèves joués » — 26.11, 3e passage (branche agent/eleves3, master 149c3cb)

Huit élèves, 2 jours chacun, graines et jours nouveaux (30.11 → 4.12), mode scolaire (chapitre choisi le jour 1) :

| Élève | Profil | Trace (`tests/_trace.html#…`) |
|---|---|---|
| Léa | 9e, faible | `eleve=lea&jours=2&jour0=2026-12-03&graine=108&chapitre=auto&extras=carnet,histoire` |
| Emma (nouveau) | 10e, moyenne | `eleve=emma&jours=2&jour0=2026-11-30&graine=101&evalj=2` (J−2 puis J−1) |
| Yanis | 11e, moyen | `eleve=yanis&jours=2&jour0=2026-12-02&graine=103&evalj=2&extras=carnet` (J−2 puis J−1) |
| Inès | 1re Coll., forte | `eleve=ines&jours=2&jour0=2026-11-30&graine=104&chapitre=auto&extras=probleme,curieux` |
| Lucie | 3e Coll. MA1, faible | `eleve=lucie&jours=2&jour0=2026-12-03&graine=105&premier=0` |
| Sami | MP 2e, moyen | `eleve=sami&jours=2&jour0=2026-12-01&graine=106&evalj=2&extras=probleme` (J−2 puis J−1) |
| Hugo (nouveau) | 6e France, faible | `eleve=hugo&jours=2&jour0=2026-12-01&graine=102` |
| Théo | 2nde France, moyen | `eleve=theo&jours=2&jour0=2026-12-02&graine=107&evalj=2&extras=carnet` (J−2 puis J−1) |

Outil (`tests/_trace.html`) : profils `emma` (CH-10) et `hugo` (FR-6) ; `evalj=N` enregistre l'évaluation le jour 1 pour J+N
(evalj=2 : sujet de préparation puis « Tes erreurs ») ; réponses aux ensembles de solutions (`solset` : « ]-inf ; 8[ »), sans
quoi la trace restait bloquée au positionnement de la 1re Coll. et de la 2nde.

Toutes les réponses attendues ont été refaites (≈ 110 questions, parties et items de sujets) : **aucune erreur de calcul**,
pas de triangle impossible, pas de TeX visible hors formule, pas de compteur qui change en cours de séance.

## Corrections vérifiées

| Point (revues du 26.11) | Verdict |
|---|---|
| Soir 1 — chapitre « en classe » travaillé | **Tient.** Questions du chapitre, hors positionnement : Emma 6/8, Hugo 7/10, Léa 9/12, Lucie 5/7, Théo 3/4 (jour 1), Yanis et Sami 100 % les jours d'évaluation ; Inès 3/5 (chapitre d'une seule notion). |
| Soir 2 — une notion 2 fois au plus | **Tient** (créneaux). Léa voit pourtant 4 conversions d'aire dans une séance : 2 créneaux + 2 « Refaire / À toi » choisis par elle. |
| Soir 3 — `<br>` dans le diagnostic 🔎 | **Tient** (aucun `<br>` visible). |
| Soir 5 — Défi du jour d'une seule question de niveau 3 | **Tient** : 4 défis vus, tous niveau 4 en plusieurs parties (Yanis, Inès, Lucie, Léa). |
| Soir 8 — « Collège · » en 2nde FR | **Tient** (6 chapitres 2nde, aucun « Collège · »). Mais voir n° 1 (niveau). |
| Soir 9 / 10 — « : » et division en texte | **En partie** : voir n° 6 et 7. |
| Soir 13 — localisation France des figures de leçon | **En partie** : effet de bord, voir n° 5. |
| Soir 14 — chapitres des années précédentes repliés | **Tient** (10e : « Chapitres des années précédentes (2) »). |
| Soir 15 — correction repliée au positionnement | **Tient** (« Voir la correction »). |
| Soir 16 — « Une plus facile pour repartir » | **Tient** (Léa : 35 − 3 · (8 − 4) → 6 + 7 · 6). |
| Soir 17 — « Séance courte », « Parties justes » | **Tient** (« Parties justes 3 / 4 », « c'était le défi du jour »). |
| Matin C2 — un seul grand bouton à J−1, sujet « au choix » à J−2 | **Tient** (4 élèves). |
| Matin — « Presque » / vérification | **Tient** (« Presque ! Les deux valeurs sont justes, mais dans le mauvais ordre : x d'abord »). |
| Durée | Séances de 2:08 à 6:28 (Lucie, défi). Jour 1 d'une élève faible encore long en tout : Hugo 6:58 de positionnement + 4:17 de séance (+ 5:18 de carnet, volontaire). |
| Matin A11 et D5 | **Encore présents** : n° 12 et 13. |

## Grave

1. **Haute** — France 2nde : le sujet de préparation et des questions sortent du programme de 2nde (banque de la 2e du Collège
   suisse, `src/riche_2c.js`, servie telle quelle). Évaluation « Distance et milieu · Équations de droites · Intersection de
   droites » : « Donne le centre, le rayon et l'équation du cercle circonscrit au triangle » (exercice `cart`, l. 24),
   « Exercice 3 · Un cercle déguisé : x² + y² − 4x − 2y − 20 = 0 » (`cercle`, l. 40, notion **non choisie**), « La route et la
   maison » (perpendiculaire par les pentes, l. 32), Vrai/faux « Le cercle (x − 1)² + (y + 2)² = 9… », Question 4 « k pour
   que y = kx + 1 soit perpendiculaire à y = 3x + 2 » ; puis, à J−1, `q-droites-1-8s3` « Quelle est la pente d'une droite
   perpendiculaire à la droite 6x + 4y = −2 ? ». Équation de cercle et orthogonalité (pentes, vecteur normal) = 1re spécialité.
   Reproduire : `#eleve=theo&jours=2&jour0=2026-12-02&graine=107&evalj=2&extras=carnet` (écran 22, puis jour 2).
   Correction : profil FR, sujets et formes filtrés par le référentiel français (pas d'exercice d'une notion hors programme de
   la classe ; formes « perpendiculaire » et « cercle » écartées avant la 1re, comme HORS_FR pour les quartiles).

## Moyens

2. **Moyenne** — Veille de l'évaluation : la carte promet « 📕 Tes erreurs, une dernière fois · 4 questions : tes erreurs du
   carnet sur ce test, puis ce que ton test rapide a raté, avec d'autres nombres. » La séance a **3** questions
   (« RÉVISION DE L'ÉVALUATION · 1 SUR 3 ») et l'élève n'a jamais fait de test rapide (évaluation enregistrée à J−2 :
   l'autoévaluation n'est jamais proposée dans le programme) ; « ce test », « test rapide » au lieu d'« évaluation » (B5).
   4 traces sur 4 (Emma, Yanis, Sami, Théo). Reproduire : `#eleve=emma&jours=2&jour0=2026-11-30&graine=101&evalj=2`, jour 2.
   Correction : texte calculé (« 3 questions : tes erreurs sur ces notions, puis ce qui reste à consolider ») ; « ce test » → « cette évaluation ».

3. **Moyenne** — Même contexte en boucle autour d'une évaluation (Pythagore, 11e) : parc traversé en diagonale **4 fois en
   2 jours** — sujet Question 1 (« parc rectangulaire de 50 m sur 55 m, Léo coupe en diagonale »), sujet Exercice 3 (« parc de
   80 m sur 120 m, Lina… à 1,5 m/s »), Défi du jour `q-pyth-4-8bt` (« parc de 20 m sur 15 m… Léa… Noé… 1,5 m/s »), J−1
   `q-pyth-2-ajz` (« parc de 30 m sur 65 m, Léo coupe en diagonale »). 10e : table ronde 2 fois dans le même sujet
   (Question 2 et « Trouve l'erreur »). Reproduire : `#eleve=yanis&jours=2&jour0=2026-12-02&graine=103&evalj=2&extras=carnet`.
   Correction : tag `ctx` commun au sujet (automatismes ≠ exercices) et aux séances des 7 jours, comme pour les problèmes.

4. **Moyenne** — Énoncé absurde : « Le diamètre d'une table ronde mesure 6 cm. Inès calcule son aire… » (sujet 10e,
   Question 2). Le générateur `disque` niveau 2 tire d = 4 à 16 cm pour « un disque », « une pizza », « un tapis rond »,
   « une table ronde » : table de 6 cm, tapis de 4 cm, pizza de 5 cm. `src/variantes.js` l. 1228.
   Reproduire : `#eleve=emma&jours=2&jour0=2026-11-30&graine=101&evalj=2`, écran 23.
   Correction : diamètre selon l'objet (pizza 24–40 cm, tapis 8–20 dm, table 8–16 dm, « disque » libre) et unité accordée.

5. **Moyenne** — France, rappel de cours : « Défi 1 × 5 m de tissu coûtent 42 €. Combien coûte 1 m ? » (Hugo, 6e, leçon prop
   ouverte depuis `q-prop-1-u78`). La localisation « · → × » prend le séparateur de l'en-tête « Défi 1 · … » pour un produit :
   l'élève lit « 1 × 5 m ». Cause : `setGoal(X.lab(k) + " · " + A.defis[k])` (`src/active.js` l. 398 et 409) puis `frLocal`
   via l'observateur ajouté hier (`src/app.js` l. 207). Dans la même leçon (proptab), « 4 · ? = 14 » reste en point médian.
   Reproduire : `#eleve=hugo&jours=2&jour0=2026-12-01&graine=102`, jour 2, question 2 (Rappel de cours).
   Correction : séparateur « — » (ou `.act-goal` traité comme `.eyebrow`, `frWords` seulement) ; « 4 × ? = 14 » pour un profil FR.

## Bas

6. **Basse** — Division « : » en texte simple, encore (n° 10 du soir) : piège « Calcule d'abord le prix d'un kilo : 14,80 :⏎4. »
   (`q-prop-1-rfj`, coupé en deux lignes) et « Du poids au prix : prix : masse, pas l'inverse. » (`q-proptab-1-axk`), en 6e
   France où la division s'écrit ÷. `src/variantes.js` l. 350 et 361. Correction : `M(chf(…) + " : " + a)` (÷ au rendu) ;
   « prix ÷ masse ».

7. **Basse** — `colonBreak` avale le « : » entre une formule et une citation : « Yanis résout x² = 5x en divisant par x⏎« x = 5 ». »
   (sujet MP 2e, `src/riche_1c.js` l. 38) ; « Sam calcule le milieu de [AB] avec A(−1 ; 2) et B(6 ; −2)⏎« M = … » » (sujet 2nde).
   Correction : garder « : » avant « (`/^\s*:\s+(?=«)/` → « : »).

8. **Basse** — Bilan de la séance la veille de J−1 et à J−1 : « Demain : 🏔 Défi du jour » / « Demain : ⚡ Série d'automatismes »,
   alors que demain la tâche de l'évaluation remplace la séance. Correction : « Demain : 📕 Tes erreurs » / « Demain : jour J ».

9. **Basse** — Défi `q-derivref-4-pi6` (bénéfice B(x) = 12√x − 3x, 3e Coll. faible, 6:28) : « Indice 1 · Partie a) · (xⁿ)' = n·xⁿ⁻¹…,
   (√x)' = 1/(2√x)… » puis « Indice 2 · Partie a) · » **identique** ; rien sur « le maximum est où B'(x) = 0 ».
   Correction : Indice 2 propre à la partie (« Résous B'(x) = 0 »), ou pas d'Indice 2 s'il répète le 1.

10. **Basse** — Milliers en profil romand : indice uaire « 1 m² = 100 dm² = 10 000 cm² » alors que la leçon écrit « 10'000 cm² »
    (`q-uaire-1-*`) ; Histoire « Euclide » : « 2 310, plus 1 : 2 311 ». Correction : `'` partout en profil CH.

11. **Basse** — Écriture maladroite d'un facteur x : « Quel est le sommet de f(x) = 2(x + 2)(x) ? » (aperçu « 7. Degré 2 »,
    1re Coll.) ; corrigé « x² − 6x = 0 ⟺ (x)(x − 6) = 0 » (`q-fimg-4-y4m`). Correction : « 2x(x + 2) », « x(x − 6) ».

12. **Basse** (A11, encore présent) — « Rends rationnel le dénominateur de 1/(1 + √5). Donne la valeur exacte (touche √). » :
    0,309016994375 → « ✓ Juste ! Exact ! » (`q-ratden-2-htf`, positionnement Inès). Correction : valeur exacte exigée
    (« Presque : donne la valeur exacte ») quand l'énoncé la demande.

13. **Basse** (D5, encore présent) — Élève au-dessus de la cible en niveau 1 : Inès (Mathélo 1508) « Combien de nombres entiers
    l'intervalle ]−2 ; 6] contient-il ? » puis « plus grand entier de [−1 ; 7[ » ; Sami (MP 2e, 1615) révision `q-prio-1-ucg`
    « Léa achète 4 cahiers à 8 CHF et une gomme à 8 CHF » (Priorités réussies au positionnement ; gomme à 8 CHF).
    Correction : niveau 2 au moins au-dessus de la cible ; pas de notion de 9e réussie au positionnement en révision MP 2e.

14. **Basse** (vraisemblance) — « Le chronomètre d'une course de relais affiche 13'219 secondes. » (`q-utemps-4-kfg`) : un
    chronomètre affiche h:min:s ; « temps total en secondes donné par l'ordinateur de course » serait plausible. Histoire
    « John Snow » : « une épidémie de choléra tue plus de 500 personnes » puis « Sur 800 victimes d'une épidémie… ».
    Correction : reformuler l'appareil ; même ordre de grandeur (« Sur 600 victimes »).

## Ce qui marche

Chapitre « en classe » enfin au cœur des séances ; défis riches et justes (pâte à modeler → cônes, nombre à trois chiffres,
cinéma, ensembles A ∩ B / A ∪ B / A \ B, f(f(2))) ; pas à pas courts et justes ; « Une plus facile » vraiment plus facile ;
carnet qui montre le progrès (« presque effacée ») ; 6e France : €, « collège », pas de CHF ni de lieu suisse vu ; accueil
France (6e · 5e · 4e · 3e · Lycée) correct ; J−2 : sujet « au choix », la séance reste le grand bouton.
