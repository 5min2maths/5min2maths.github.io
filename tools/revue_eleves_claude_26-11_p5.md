14 problème(s) dont 1 grave(s) — 5 moyens, 8 bas

# Revue « élèves joués » — 26.11, 5e passage (branche agent/eleves5, master 271d53f)

Huit élèves déjà connus de la trace, sur des jours et des graines nouveaux (janvier 2027), 2 jours chacun :

| Élève | Profil | Trace (`tests/_trace.html#…`) | Séances |
|---|---|---|---|
| Kevin | 9e, très faible, idk 0,4 | `eleve=kevin&jours=2&jour0=2027-01-11&graine=311` | 5:35, 6:19 |
| Louis | 3e France, evalj=2 | `eleve=louis&jours=2&jour0=2027-01-12&graine=312&evalj=2` | 3:08, veille 2:39 |
| Elias | 2e Coll., mode libre | `eleve=elias&jours=2&jour0=2027-01-13&graine=313` | 3:19, 4:18 |
| Sami | MP 2e | `eleve=sami&jours=2&jour0=2027-01-11&graine=314&extras=comp,probleme` | 4:05, 4:59 |
| Nina | MP 4e | `eleve=nina&jours=2&jour0=2027-01-14&graine=315&extras=comp,carnet` | 1:51, 3:19 |
| Jade | 4e France | `eleve=jade&jours=2&jour0=2027-01-12&graine=316` | 4:00, 6:04 |
| Yanis | 11e, evalj=2 | `eleve=yanis&jours=2&jour0=2027-01-11&graine=317&evalj=2` | 2:47, veille 2:38 |
| Clara | Tle France | `eleve=clara&jours=2&jour0=2027-01-13&graine=318` | 2:54, 2:25 |

Toutes les réponses attendues ont été refaites (≈ 110 questions, parties, cartes de chapitre et items des deux sujets) :
**aucune erreur de calcul**, aucun énoncé absurde, pas de TeX visible, pas de compteur qui change, pas de CHF ni de « · »
en France, PGDC et intitulés MP propres à la MP (aucun objectif du Collège ou du PER dans « Mes compétences » MP).

**Outil** : `_trace.html` ne chargeait pas 4 fichiers de l'app (`ch1c_argact.js`, `perco.js`, `ref_co.js`, `ref_mp.js`) :
les traces précédentes ne voyaient donc ni « Mes compétences » MP / CO réels, ni les notions de `perco.js`. Liste
alignée sur `build.py`. Ajouts : `extras=comp` (écran « Mes compétences », années précédentes dépliées, puis « Me tester »)
et `tests/_cadre360.html` (cadre de 360 px autour de la trace, pour les captures :
`chromium --headless --allow-file-access-from-files --window-size=500,2400 --screenshot=… "file://…/tests/_cadre360.html#eleve=sami&…&stopat=21&ecran=1"` ;
Chromium ne peut écrire la capture que sous `~/Projets`).

## Corrections du jour vérifiées

Tiennent :
- p4 n° 1 (chapitre « en classe » = notions de la classe d'abord) : Louis 3e = tabval, affine, linfn, modaff, pctvar ;
  Jade 4e = echelle, ratio, quartiles, lectgraph (+ prop pour compléter) ; « Je prépare un test » : classe d'abord, reste replié.
- p4 n° 2 (mode libre) : Elias, aucun « 🔙 Rappel », que des notions de 2e Coll. (cart, cercle, polydiv, polyfact), 3:19 et 4:18.
- p4 n° 3 et 4 : Kevin, série de 3 le jour du positionnement ; plus de « À toi » après un pas à pas (série, carnet) ; « Continuer ».
- p4 n° 5 : ratés du positionnement absents du carnet (Kevin : carnet 2 = les 2 erreurs de la séance).
- p4 n° 6 et 7 : Problème de la semaine en plusieurs parties et de l'année (Louis scicalc/sci 3e, Sami f2, Clara limites).
- p4 n° 9 : Clara (forte) en Révision au niveau 2 d'entrée.
- p3 / soir : veille « 3 questions : tes erreurs… » (Louis, Yanis), « Demain : jour J : ✏️ Échauffement, puis l'évaluation »,
  J−2 sujet « au choix » et séance en grand bouton, positionnement « environ 5 minutes » (4:26 à 5:45 réels), une notion
  au plus 2 fois par séance, « C'était le défi du jour », séance du chapitre en classe sans leçon (séances ordinaires).
- Référentiel MP : en-tête « MP 2e » / « MP 4e », objectifs « Semestre n — chapitre », note 1–6 (« pas testé »),
  « travaillée en classe » sans bouton, années précédentes repliées, codes en `title` seulement, « facultatif » marqué.

Ne tiennent pas (ou en partie) :
- soir n° 1 (pas de leçon pour une notion du chapitre en classe) : la leçon revient au **Problème de la semaine** (n° 4).
- p3 / B11 (quartiles hors programme au collège FR) : formes écartées, mais indice et bilan parlent encore de quartiles (n° 7).
- Revue du jour n° 7 / C4 (séance > 5 min) : réglé pour l'élève sous le plancher, pas pour l'élève moyenne (n° 6) ;
  Kevin dépasse encore 5 min avec le défi du jour (n° 5).

## Grave

1. **Haute** (niveau) — 4e France : « Factorise : \(x^2 - 100\) » (`q-factor-2-nfz`), puis au carnet « \(x^2 - 64\) »
   (`q-factor-2-did`). La différence de deux carrés (a² − b²) est une identité remarquable de 3e (repères de 3e) ; en 4e,
   on factorise seulement par un facteur commun. `factor` est placé en 5e–3e (`src/fr_college.js` l. 20) sans écarter ces formes.
   Reproduire : `#eleve=jade&jours=2&jour0=2027-01-12&graine=316`, jour 1, Révision 3/3, puis Carnet.
   Correction : formes « différence de carrés » de `factor` dans `HORS_FR` (`src/fr_couv.js`) avant la 3e (FR-9).

## Moyens

2. **Moyenne** — « Me tester » ne teste pas l'objectif affiché. Sami, S3.FA.01 « Connaître la définition d'une fonction
   affine (pente, ordonnée à l'origine) et l'interpréter graphiquement » : Q1 = problème de forfaits « Pour combien de
   minutes les deux forfaits coûtent-ils la même chose ? » (`q-affine-3-mt1`, c'est S3.FA.05), Q3 = « Pour quelles valeurs
   de x a-t-on f(x) > 0 ? » (`q-affzero-2-y87`, signe / inéquation). Nina, S7.CO.01 « … dans le plan » : Q2 = « distance
   entre A(−4 ; −3 ; 4) et B(5 ; 3 ; 2) (dans l'espace) » (`q-coordmp-1-ch2`, c'est S7.CO.03). Cause : `src/ref_mp.js`
   rattache la notion entière (`"S3.FA.01":["affine","affzero"]`, coordmp pour les 3 objectifs CO).
   Reproduire : `#eleve=sami&…&graine=314&extras=comp,probleme` ; `#eleve=nina&…&graine=315&extras=comp,carnet`.
   Correction : rattacher par niveau ou par forme (`affine@1,2` sans problème ; coordmp formes « plan » / « espace » / « polaires »).

3. **Moyenne** — Note et badges trop faciles : Nina réussit 3 questions de niveau 1 au « Me tester » → note 6 et, d'un
   coup, « ⭐ Première compétence (note 5) » et « 💎 Expert (note 6) ». Reproduire : trace de Nina, écran 32.
   Correction : note 6 (et Expert) seulement avec au moins une réponse de niveau ≥ 2, ou après 5 réponses.

4. **Moyenne** — Leçon avant le Problème de la semaine pour une notion du chapitre en classe. Sami (MP 2e, chapitre
   « Fonctions quadratiques », f2 = encours, sommet déjà réussi la veille au défi f2formes) : « NOUVELLE NOTION · ÉTAPE 1
   SUR 2 · La parabole » avant `q-f2-4-are`. Clara (Tle, chapitre « Limites », limites-2 réussie 5 minutes avant) :
   « RAPPEL DE COURS · ÉTAPE 1 SUR 2 · Limites » avant `q-limites-4-d61`. « Étape 1 sur 2 » sous « Problème de la semaine »
   déroute, et « Nouvelle notion » est faux.
   Reproduire : `#eleve=sami&…&graine=314&extras=comp,probleme`, jour 2, case Problème ; `#eleve=clara&…&graine=318`, jour 1.
   Correction : appliquer au Problème de la semaine la règle des séances (`Engine.lessonFirst` faux si `nowHas`, ou notion vue).

5. **Moyenne** — Élève très faible et Défi du jour : Kevin (Mathélo 928) reçoit le jour 2 un problème de niveau 4 en
   3 parties (`q-utemps-4-aq3`, 16'352 s en h, min, s), 2 essais et 2 indices, **6:19**. Jour 1 : positionnement 5 questions
   (3 ratés, le 3e à la dernière question) + série de 3 avec deux pas à pas = 13:13, puis carnet 2:08.
   Reproduire : `#eleve=kevin&jours=2&jour0=2027-01-11&graine=311`.
   Correction : pour `Engine.struggling`, défi au niveau 3 (ou format Révision de 3 questions) ; ne pas annoncer « Demain : 🏔 Défi ».

6. **Moyenne** (C4) — Jade (4e FR, moyenne) : « ⚡ Série d'automatismes · 6 calculs rapides » **6:04**, avec un problème à
   mettre en équation (`q-probeq-1-j0p` « Un père a le triple de l'âge de son fils… ») et un partage (`q-ratio-1-zk2`).
   Reproduire : `#eleve=jade&…&graine=316`, jour 2.
   Correction : `Engine.isDrill` refuse les énoncés de mise en équation (probeq) ; ou série de 5.

## Bas

7. **Basse** — France, quartiles (correction B11 en partie) : en 4e, indice « Trie la série. Étendue = max − min. Q1 et Q3 :
   médianes des moitiés… Écart interquartile = Q3 − Q1. » (`q-quartiles-1-bwv`) ; bilan « Réussies : Étendue, médiane,
   quartiles » alors que l'écran dit « Étendue, médiane » (le bilan prend `label`, pas `labelFR`).
   Correction : `labelFR` partout (bilan, carnet) ; indice FR sans quartiles avant la 2nde.

8. **Basse** — `colonBreak` coupe dans une citation et met une majuscule au milieu d'une phrase : sujet de 3e FR
   « « f(x) = 3x est une fonction linéaire⏎Sa courbe passe par l'origine. » » et « « Le tableau x : 1, 2, 3 ; f(x) :⏎4, 6, 9
   … » » (`src/riche_11c.js` l. 127) ; « Sachant que : P(x) = …⏎Est divisible par x − 4 » (`q-polydiv-2-rkc`).
   Correction : pas de coupure entre « et » ; majuscule après `<br>` seulement si la ligne d'avant finit une phrase.

9. **Basse** — Pas à pas générique : taxi « 6 CHF par kilomètre, 7 km » → « Prix des 7 éléments au même prix : 7 · 6 = ? » et
   piège « On ne peut pas additionner un nombre d'objets et un prix » (`q-prio-1-fd`, `src/ch11_no.js` l. 77–78).
   Correction : unité tirée du contexte (« Prix des 7 km »).

10. **Basse** — Corrigé du positionnement non ordonné : « (2a − 3b)² » → « −12ab + 4a² + 9b² » (`q-idrem-2-oxo`).
    Correction : ordonner (4a² − 12ab + 9b²).

11. **Basse** — Lisibilité à 360 px (captures `_cadre360.html`) : « Mes compétences » MP commence par 19–21 badges
    (≈ 1,5 écran) avant le premier objectif ; les intitulés, serrés par « Me tester » + « pas testé », tiennent sur 6–7
    lignes ; en « Me tester », l'en-tête en majuscules « ME TESTER · CONNAÎTRE LA DÉFINITION D'UNE FONCTION AFFINE
    (PENTE, ORDONNÉE À L'ORIGINE) ET L'INTERPRÉTER GRAPHIQUEMENT · 1 SUR 3 » prend 4 lignes ; « Je ne sais pas » rogné.
    Correction : badges repliés (« 🏅 Mes badges 1 / 19 ») ; boutons sous l'intitulé ; en-tête « ME TESTER · 1 SUR 3 »,
    l'intitulé en texte normal.

12. **Basse** — « Cette semaine : 4 / 5 / 6 notions consolidées » dès le premier jour (Sami, Nina, Jade : 1 à 3 questions
    faites) : le positionnement est compté. Correction : ne compter que les séances.

13. **Basse** — Curieux « Une douche coule environ 12 ℓ par minute … baignoires pleines (150 l) » : deux notations dans le
    même énoncé (`cur-douche-jav`). Correction : « L » partout.

14. **Basse** — « Calcule et donne le résultat sous forme de fraction irréductible » accepte « 0,9375 » (`q-fracmul-2-kpv`).
    Correction : demander la fraction (spec `frac`) ou retirer « sous forme de fraction irréductible ».

## Ce qui marche

Problèmes exacts et vraisemblables (perfusion, t-shirts, parallélogramme ABCD, atome d'hydrogène, chronométrage), sujets
de préparation 3e FR et 11e justes (bâton dans la boîte : 130 < 135 cm), Elias en libre entièrement dans son année, Kevin
accompagné sans reprise en chaîne, ton toujours doux ; Mes compétences MP conforme au PEE, séparé du Collège et du CO.
