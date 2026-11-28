# Élèves faibles — diagnostic et propositions (26.11)

Agent « élèves faibles », branche `agent/faibles`. **Aucun changement dans `src/`** : tout est à soumettre.
Mesures sur le moteur publié aujourd'hui (struggling, séances de 3–4 questions, positionnement arrêté après 3 ratés…).

## Outils

- `tests/_faibles.html` + `tests/_faibles.js` (hors suite) : vrai moteur, horloge simulée, déroulé de l'app
  (positionnement, une leçon au plus, remédiation, question allégée, « trop facile », « je ne sais pas », abandon après
  3 échecs). 9e, 10e, 11e, 1re Collège × 5 profils, **20 graines**, 28 jours dès le 9.11, chapitre « en classe » non
  choisi. Chaque élève a sa propre graine. Écart de profil compté depuis le Mathélo de départ de la classe :
  fort +250, moyen 0, faible −250, très faible −400 (« je ne sais pas » 30 %), irrégulier −60 (45 % des jours).
  Variantes : `#v=rejouer,place1,…`, modèle `#m=learn2`, testeur `#part=testeur`.
- Traces écran par écran `tests/_trace.html` : kevin (9e très faible), lucie et lea en `niveau=tresfaible&idk=0.3`, 4 jours.

## Constats

**Simulation du testeur, version actuelle (20 graines)** : Lucas 51 %, Sarah 46 %, Yanis 24 % au 1er essai ; Mathélo
−144, −164, −91 ; 3,5 à 4 min par séance. Par rapport au rapport du testeur (49 / 46 / 17 %), la réussite est
**à peu près la même** : les corrections du jour ont raccourci les séances, elles n'ont pas changé la réussite.

**Tableau avant** (moyenne de 20 graines ; « décourageante » = moins d'un tiers juste du premier coup, ou plus de 6 min) :

| Classe | Profil | 1er essai | dern. sem. | p prévu | niveau moy. | Δ Mathélo | s/séance (max) | abandons | sans réussite | décourageantes | fin sur échec | leçons/séance | année inf. |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 9e | fort | 77 % | 74 % | 78 % | 1,79 | +349 | 179 (320) | 0 % | 3 % | 4 % | 31 % | 0,28 | 0 % |
| 9e | moyen | 57 % | 53 % | 60 % | 1,23 | +94 | 179 (320) | 0 % | 5 % | 11 % | 46 % | 0,32 | 0 % |
| 9e | faible | **27 %** | 26 % | 30 % | 1,01 | −133 | 198 (290) | 6 % | 40 % | 53 % | 75 % | 0,44 | 0 % |
| 9e | très faible | **11 %** | 11 % | 15 % | 1,01 | −255 | 208 (245) | 13 % | 70 % | 78 % | 90 % | 0,42 | 0 % |
| 9e | irrégulier | 48 % | 46 % | 54 % | 1,08 | +29 | 182 (355) | 2 % | 17 % | 22 % | 56 % | 0,36 | 0 % |
| 10e | fort | 78 % | 75 % | 80 % | 1,91 | +317 | 184 (320) | 0 % | 1 % | 4 % | 25 % | 0,24 | 44 % |
| 10e | moyen | 67 % | 68 % | 66 % | 1,40 | +92 | 177 (320) | 0 % | 4 % | 7 % | 40 % | 0,28 | 78 % |
| 10e | faible | **39 %** | 39 % | 41 % | 1,06 | −180 | 191 (315) | 3 % | 26 % | 37 % | 61 % | 0,41 | 88 % |
| 10e | très faible | **16 %** | 15 % | 23 % | 1,03 | −338 | 206 (315) | 10 % | 62 % | 72 % | 86 % | 0,40 | 87 % |
| 10e | irrégulier | 59 % | 62 % | 61 % | 1,35 | +3 | 174 (290) | 0 % | 7 % | 11 % | 42 % | 0,24 | 88 % |
| 11e | fort | 80 % | 77 % | 80 % | 1,94 | +323 | 181 (290) | 0 % | 1 % | 2 % | 34 % | 0,26 | 47 % |
| 11e | moyen | 70 % | 73 % | 71 % | 1,58 | +61 | 176 (320) | 0 % | 4 % | 6 % | 39 % | 0,25 | 82 % |
| 11e | faible | **53 %** | 55 % | 57 % | 1,19 | −199 | 181 (290) | 1 % | 15 % | 20 % | 48 % | 0,36 | 92 % |
| 11e | très faible | **28 %** | 26 % | 38 % | 1,07 | −381 | 203 (315) | 7 % | 42 % | 55 % | 72 % | 0,41 | 90 % |
| 11e | irrégulier | 66 % | 67 % | 68 % | 1,62 | −7 | 173 (290) | 0 % | 5 % | 10 % | 42 % | 0,18 | 92 % |
| 1re | fort | 79 % | 77 % | 79 % | 1,93 | +322 | 181 (290) | 0 % | 1 % | 2 % | 28 % | 0,25 | 41 % |
| 1re | moyen | 70 % | 70 % | 73 % | 1,55 | +51 | 174 (325) | 0 % | 4 % | 7 % | 35 % | 0,25 | 83 % |
| 1re | faible | **57 %** | 62 % | 62 % | 1,27 | −208 | 174 (290) | 1 % | 9 % | 14 % | 40 % | 0,33 | 89 % |
| 1re | très faible | **41 %** | 43 % | 49 % | 1,09 | −352 | 190 (270) | 3 % | 25 % | 33 % | 51 % | 0,38 | 88 % |
| 1re | irrégulier | 68 % | 72 % | 71 % | 1,59 | −7 | 170 (290) | 1 % | 5 % | 6 % | 33 % | 0,19 | 91 % |

« p prévu » = réussite prévue par le modèle pour les questions servies ; « année inf. » = part des questions sur une
notion d'une année antérieure ; série : elle tient (pas de séance sautée par découragement dans ce modèle).

**Pourquoi la réussite ne remonte pas : le plancher.** Les élèves faibles reçoivent déjà le plus facile que les règles
permettent : niveau moyen 1,0 à 1,1, et en 10e–1re 88 à 92 % des questions portent déjà sur des notions d'années
antérieures. La cible propre (`tadj`) descend à −300 sans trouver de question plus facile. Réussite prévue au niveau 1
le plus bas disponible (`itemRating`) : 9e faible 25 % (notions de 9e, 890), très faible 13 % ; 10e faible 44 % (9e) ;
11e faible 65 % (9e) à 44 % (10e) ; 1re faible 65 % (10e) à 44 % (11e). Les chiffres observés sont entre ces bornes.
En 9e il n'existe rien en dessous : ni `difficulty`, ni `adapt`, ni `easeNext`, ni `minLevel` n'y peuvent rien.
Le Mathélo qui baisse est le moteur qui rejoint le vrai niveau (en fin de simulation, le Mathélo des faibles reste en général 50 à 170 points au-dessus de leur vrai niveau).

**Le modèle d'élève, honnêtement.**
1. Tout dépend de l'échelle de `itemRating` (constantes du code) par rapport au niveau supposé : même l'élève **moyen**
   de 9e ne réussit que 57 % (niveau 1 de 9e = Mathélo de départ − 60). Si les automatismes de 9e sont en réalité
   réussis à 80 % par un élève moyen, c'est l'échelle qui est trop dure, pas l'élève ; la simulation ne peut pas trancher.
2. Apprentissage : +6 à +10 points par question (+8 à +14 dans `eleves.js`), soit ≈ 0,05 logit. La littérature
   (Koedinger et al., PNAS 2023 : ≈ 0,1 logit par occasion de pratique) donne environ le double. Essai `#m=learn2` :
   9e moyen 57 → 65 %, 9e faible 27 → 34 %, 11e faible 53 → 55 % : le modèle explique une partie de l'écart, pas
   l'essentiel ; le plancher reste.
3. Le modèle n'a ni mémoire d'une forme de question déjà réussie, ni effet d'« exemple résolu » (refaire juste après une
   correction). Les traces (`_trace.html`) tirent une probabilité fixe (0,25) quelle que soit la question.
   Conclusion : **la simulation dit que le moteur fait ce qu'il peut ; elle ne dit pas la vraie réussite**. Seules les
   données de la 11LS (réussite au 1er essai au niveau 1, par tranche de Mathélo) le diront.

**Ce que l'élève vit (traces).** Kevin, 9e très faible : positionnement = 1 raté et 2 « je ne sais pas » en 3 min 30
(simulation : élève faible 0,3 juste sur 3,4 questions, 1re question juste 0 %) ; séances de 1:33 à 6:13 (un défi en
3 parties, 3 essais, le 3e jour, car il avait réussi ses deux premières séances). Lucie, 4e Collège très faible : un
positionnement chanceux (3/5, Mathélo 1713) puis presque tout raté ; carnet 1 → 6 en 4 jours ; titre « Séance faite :
c'est en pratiquant qu'on progresse. » 4 fois sur 4, liste « Reviendront bientôt », « consolider Nombre dérivé » chaque
jour. Ce qui donne envie de revenir : points de l'année toujours en hausse (+12 à +22), série 🔥 et joker, « Tu as
reconstruit une solution pas à pas : ça compte aussi », Mathélo caché. Ce qui décourage : commencer par 3 ratés,
finir sur un raté (75–90 % des séances en 9e faible / très faible), et un **carnet qui ne fait que grossir** : une erreur
s'efface après 2 réussites de suite au 1er essai, soit p² ≈ 9 % par tentative à 30 % de réussite.

## Propositions essayées (avant → après, mêmes 20 graines)

Variantes appliquées dans la page seulement. Écart de moins de 3 points = bruit.

| Proposition | Élèves faibles / très faibles | Moyens et forts | Risque |
|---|---|---|---|
| **1. Rejouer au lieu d'ajouter** (en grande difficulté : après un raté, la question suivante prévue devient la même notion, autres nombres, un niveau en dessous ; une fois par séance ; durée inchangée) | séances sans réussite 9e tf 70 → 63 %, 10e tf 62 → 50 %, 11e tf 42 → 35 %, 9e f 40 → 34 % ; pire suite de séances décourageantes 9e tf 8,7 → 6,2 ; 1er essai +3 à +6 pts (très faibles 9e–11e) ; rien en 1re (très faible : décourageantes 33 → 37 %) | aucun changement (struggling seulement) | faible ; **dépend de l'effet « exemple résolu »** supposé (b = 0,3) : avec b = 0, rien. Revient en partie sur « pas de reprise » du jour, sans allonger la séance |
| **2. Carnet à la portée** (en grande difficulté : une réussite au 1er essai efface l'erreur, et les réussites en séance comptent ; afficher « effacées cette semaine ») | non simulé ; chance d'effacer à 30 % de réussite : 9 % → 30 % par tentative | aucun | faible ; règle du carnet = décision |
| **3. Positionnement au niveau 1** | Δ Mathélo du positionnement −44 → −27 (9e f), 1re question juste 0 → 5 % ; réussite inchangée | 1re question juste moyen 40 → 55 %, irrégulier 30 → 45 % ; fort : positionnement un peu moins discriminant (+69 → +58) | moyen ; gain surtout pour la 1re impression des moyens |
| **4. 9e : automatismes de fin de primaire** pour l'élève en grande difficulté (déjà demandé, `adaptivite_26-11.md`, n° 2) | seul levier capable de passer le plancher de 9e : réussite prévue 9e faible 25 → ≈ 44 % (score 740) ; non simulé, pas de contenu | aucun | décision de plan d'études |
| **5. Bilan et retour** : titre centré sur ce qui a été fait (« 2 questions réussies », « 1 solution reconstruite ») au lieu de « Séance faite… » répété ; message de retour après une absence (« On reprend en douceur ») | non mesurable en simulation | aucun | très faible |

Essayées et **sans effet mesurable** (le plancher les annule) : finir sur une question facile (`finir`), échauffement
facile (`echauf`), question allégée dès le 1er échec (`ease1`), pas de leçon deux jours de suite (`lecon`), prérequis
anciens en rappel (`prereq`), notions des deux années précédentes admises (`bas`). Perte de Mathélo divisée par deux
après un échec (`eloaide`) : Δ Mathélo −133 → −45 (9e f), réussite inchangée ; déconseillé (Mathélo caché, et un
Mathélo trop haut garde des questions trop dures).

## Recommandation

1. Soumettre **1 (rejouer)** et **2 (carnet)** : les seules qui touchent ce que l'élève faible vit (séances sans
   réussite, dette du carnet) sans allonger la séance ni toucher aux seuils 55 / 65 / 85 %.
2. Trancher **4** (9e en dessous du niveau 1) : sans ça, l'élève faible de 9e reste vers 27 % quoi qu'on règle.
3. **5** à faire quand on veut, sans risque. **3** seulement si l'on veut soigner la 1re impression des élèves moyens.
4. Ne plus régler le moteur sur la simulation pour les faibles : attendre les données de la 11LS et regarder la
   réussite au 1er essai au niveau 1 par tranche de Mathélo ; si elle dépasse nettement la prévision, c'est
   `itemRating` (échelle) qu'il faut recaler, pas les règles de séance.

Autre constat à soumettre : sans chapitre « en classe », 78 à 83 % des questions d'un élève moyen de 10e–1re portent
en novembre sur l'année précédente (notions « récentes » = année en cours ou précédente, peu de notions de l'année
ouvertes à cette date). Voulu ou non ?

Correctifs : aucun bug avéré trouvé dans `src/`. Hors suite : la liste de scripts de `tests/_adapt_mesure.html` est en
retard sur `build.py` (manquent `referentiel.js`, `trx.js`, `ref_*.js`…) ; `_faibles.html` est générée depuis `build.py`.

## Appliqué le 27.11 (branche `agent/faibles2`, décision de l'enseignant n° 27–32)

Mesures : `tests/_faibles.html`, **20 graines (1 à 20)**, 28 jours dès le 9.11, chapitre « en classe » non choisi ;
« avant » = master du 27.11 (automatismes de primaire compris), « après » = cette branche, même page de simulation.
La page suit désormais les règles de l'app (`Engine.replayNext`, `Engine.placementLevel`) et compte le carnet
(nouvelles colonnes : « hors année (sans reprise) », « rejouées/séance », « carnet fin », « effacées en séance »).
Test qui fixe chaque règle : `tests/faibles27.html` (dans la suite). Suite complète : 164 pages, un échec (`ux_2111` :
reprise « Refaire » + question rejouée sur le même raté, corrigé : voir 1.), repassé ensuite avec les pages voisines.

**Ce qui a été fait**
1. **Rejouer au lieu d'ajouter** (`Engine.replayNext`, app : `onDone`) : élève en grande difficulté (`Engine.struggling`),
   question pas réussie du premier coup → la question suivante prévue devient la même notion, d'autres nombres (forme la
   plus proche, même contexte si possible), un niveau en dessous (le niveau 1 reste 1), étiquette « nouvelles valeurs ».
   Une fois par séance, à la place d'une question (programme de même longueur). Ni automatisme, ni problème, ni carnet,
   « Me tester », évaluation, problème de la semaine ; jamais à la place d'une question qui porte la leçon. Elle passe avant
   la remédiation et l'allègement (pas deux remplacements pour le même raté) ; si l'élève choisit lui-même « Refaire »,
   la question rejouée rend sa place (pas deux reprises du même raté).
2. **Carnet à la portée** : élève en grande difficulté seulement : une réussite du premier coup efface l'erreur (séance
   « Carnet »), et une réussite du premier coup dans une séance ordinaire efface les erreurs de la même notion rangées au
   même niveau ou en dessous. **Autres élèves : règle inchangée** (2 réussites de suite) : le rapport ne recommandait la
   règle que pour la grande difficulté, et un carnet trop vite vidé ne sert plus à rien à un élève qui réussit. Règle
   affichée selon l'élève ; « ✓ N effacée(s) cette semaine » sur la carte du carnet, sa page et le bilan.
   Notions de fin de primaire (`src/primaire.js`) : **elles n'entrent jamais au carnet** (solution la plus simple : rien à
   effacer quand l'élève revient au niveau de sa classe) et ne figurent ni sur la carte de progression ni dans « Ma semaine ».
3. **Positionnement** (`Engine.placementLevel`) : **la 1re question au niveau 1, les 4 suivantes au niveau 2**. Tout au
   niveau 1 (variante `place1`) donne la même première impression mais un positionnement moins discriminant (élèves
   moyens et irréguliers surévalués de 25 à 35 points de plus, 4,5 à 4,8 justes sur 5) : non retenu.
5. **Bilan centré sur les réussites** : « Aujourd'hui : 2 questions réussies et 1 solution reconstruite. » (erreurs effacées
   aussi) au lieu de « Séance faite… » ; « Bonne séance : … » entre 50 et 80 % ; « Excellente séance ! » inchangé ; sans
   aucune réussite : « 3 questions travaillées : c'est en pratiquant qu'on progresse. ». **Retour après une absence**
   (3 jours ou plus) : « Content de te revoir ! » en tête de la phrase de série perdue du 26.11 (gardée telle quelle).
6. **L'année d'abord** (`Engine.prevPenalty`, `PREV_PEN = 2` dans `planSlots`) : sans chapitre « en classe », une notion
   de l'année précédente passe après celles de l'année (malus de 200 points d'écart), sauf si le parcours la demande :
   ratée (maîtrise < 0,45 ou deux échecs), prérequis d'une notion de l'année qui coince, Mathélo en forte baisse, ou élève
   en grande difficulté (plancher : le plus facile possible). Les **reprises du référentiel** (`again` : priorités,
   relatifs, fractions… reprises en 10e–11e) comptent comme notions de l'année.

**Mesures avant → après** (1er essai · Δ Mathélo · séances sans réussite · décourageantes ; « = » : écart < 3 points, bruit)

| Classe | Profil | 1er essai | Δ Mathélo | sans réussite | décourageantes | carnet fin (effacées en séance) | 1re question du positionnement juste |
|---|---|---|---|---|---|---|---|
| 9e | fort | 77 → 78 % | +341 → +347 | 2 → 1 % | 4 → 3 % | 4,0 → 3,5 (0,4) | 65 → 75 % |
| 9e | moyen | 57 → 56 % | +90 → +88 | 8 → 7 % | 12 → 11 % | 7,2 → 2,8 (7,5) | 40 → 65 % |
| 9e | faible | 29 → 31 % | −148 → −129 | **39 → 34 %** | **50 → 46 %** | **12,0 → 6,6** (11,6) | 5 → 10 % |
| 9e | très faible | 13 → 17 % | −287 → −254 | **64 → 59 %** | **75 → 68 %** | **12,2 → 8,7** (7,0) | 0 → 0 % |
| 9e | irrégulier | 49 → 53 % | +32 → +57 | 14 → 9 % | 21 → 16 % | 4,5 → 2,1 | 25 → 35 % |
| 10e | fort | 78 → 78 % | +327 → +303 | 2 → 2 % | 4 → 4 % | 4,3 → 3,8 | 80 → 90 % |
| 10e | moyen | 67 → 66 % | +83 → +67 | 4 → 3 % | 6 → 5 % | 9,2 → 6,3 | 50 → 60 % |
| 10e | faible | 38 → 37 % | −181 → −184 | 29 → 28 % | 36 → 38 % | **19,9 → 11,7** (9,3) | 15 → 20 % |
| 10e | très faible | 16 → 17 % | −335 → −323 | 59 → 61 % | 71 → 71 % | **25,9 → 19,4** (4,5) | 5 → 10 % |
| 10e | irrégulier | 60 → 59 % | +9 → +3 | 7 → 7 % | 9 → 12 % | 6,8 → 4,5 | 30 → 55 % |
| 11e | fort | 79 → 79 % | +320 → +316 | 1 → 1 % | 3 → 3 % | 3,1 → 3,3 | 80 → 90 % |
| 11e | moyen | 70 → 72 % | +48 → +76 | 3 → 4 % | 6 → 6 % | 8,3 → 6,1 | 50 → 60 % |
| 11e | faible | 54 → 52 % | −183 → −201 | 15 → 17 % | 20 → 20 % | 12,6 → 7,3 (9,5) | 15 → 20 % |
| 11e | très faible | 29 → 30 % | −373 → −363 | 42 → 39 % | 53 → 51 % | 16,5 → 12,3 (9,9) | 5 → 10 % |
| 11e | irrégulier | 64 → 66 % | −9 → −2 | 4 → 2 % | 9 → 5 % | 6,1 → 4,1 | 30 → 55 % |
| 1re | fort | 79 → 78 % | +328 → +317 | 1 → 2 % | 2 → 3 % | 4,2 → 3,8 | 80 → 90 % |
| 1re | moyen | 71 → 69 % | +60 → +53 | 4 → 4 % | 6 → 7 % | 8,3 → 7,0 | 50 → 60 % |
| 1re | faible | 58 → 59 % | −197 → −164 | 10 → 10 % | 15 → 13 % | 12,8 → 8,3 (6,5) | 15 → 20 % |
| 1re | très faible | 39 → 39 % | −365 → −347 | 29 → 28 % | 37 → 35 % | 16,4 → 10,7 (10,4) | 5 → 10 % |
| 1re | irrégulier | 68 → 66 % | 0 → −19 | 4 → 4 % | 6 → 7 % | 6,2 → 4,8 | 30 → 55 % |

Durée des séances inchangée (s/séance identiques à ± 3 s, max inchangé) ; rejouées : 0,4 par séance en 9e faible / très
faible, 0,1 à 0,3 en 10e–1re faibles, 0 à 0,05 chez les moyens et forts (struggling rarement vrai). Carnet : pas de séance
« Carnet » simulée, donc « avant » il ne fait que grossir ; « après », l'élève en grande difficulté efface 5 à 12 erreurs en
4 semaines rien qu'en réussissant ses séances. **Aucune régression mesurable chez les moyens et forts** (1er essai à ± 2
points, sans réussite et décourageantes à ± 3 points ; écarts de Δ Mathélo de ±25 points = bruit des graines : 9e moyen
+90 → +88, 11e moyen +48 → +76, 10e fort +327 → +303).

**Année précédente, sans chapitre « en classe »** (part des questions, élève moyen) :

| Classe | année antérieure, reprises comprises | dont hors reprise du référentiel | variante `reprise` (reprises aussi après) |
|---|---|---|---|
| 10e | 81 → 81 % | **30 → 10 %** | 63 % (hors reprise 23 %), 1er essai 66 → 63 % |
| 11e | 83 → 81 % | **14 → 2 %** | 65 % (8 %), 72 → 68 % |
| 1re | 81 → 78 % | **28 → 7 %** | 57 % (15 %), 69 → 68 % |

Constat : les 78–83 % du rapport du 26.11 étaient surtout des **reprises du référentiel** (notions d'une année antérieure
que le programme de l'année reprend, `again`), donc des notions de l'année au sens du référentiel ; les vraies notions de
l'année précédente tombent à 2–10 %. Il reste peu de notions propres à l'année ouvertes en novembre : les faire passer
aussi avant les reprises (variante `reprise`, essayée, non appliquée) ne descend qu'à 57–65 % et coûte 1 à 4 points de
réussite aux moyens. **À trancher par l'enseignant** si l'on veut aller plus loin (n° 32 bis). Élèves faibles et très
faibles : inchangé (85–90 %), voulu (grande difficulté = règle levée).

**Simulation du testeur** (`#part=testeur`, 20 graines) : Lucas 48 → 48 %, Sarah 46 → 46 %, Yanis 30 → 27 % (3 jours,
bruit), Emma 66 → 69 %, Hugo 63 → 66 %, Léa et Noah 81 → 81 % ; Δ Mathélo et minutes par séance inchangés (± 0,1 min).

Ce que la simulation ne mesure pas : l'effet « exemple résolu » de la question rejouée est une hypothèse (b = 0,3, comme
le 26.11) ; sans lui, rejouer ne change presque rien à la réussite (mais garde la durée). Le bilan et le message de retour
ne se mesurent pas en simulation : contrôlés par `tests/faibles27.html`.

## Re-mesure du 27.11 après-midi (branche `agent/faibles3`)

Après les lots du jour (faibles2, primaire, r27b : rejouer, carnet, positionnement, notions de l'année `ownYear`, rappels de
primaire, leçon en tête…). Mêmes outils : `tests/_faibles.html`, **20 graines (1 à 20)**, 28 jours dès le 9.11, sans
chapitre « en classe » ; testeur `#part=testeur` (20 graines, 14 jours). « Avant » = master du 27.11 13 h (2618068),
« après » = cette branche.

### Les leçons par séance du testeur : surtout un artefact de comptage

Le script du testeur (`tests/_simulation_testeur.js`) compte une leçon dès qu'une question du programme a sa leçon due,
**même en Automatismes et dans une séance sans leçon** (`plan.noLesson` : Révision, Défi, chapitre en classe), où l'app
n'en montre jamais (`src/app.js`, `nextQuestion`). Depuis r27b, `Engine.ownYear` met dans ces séances une notion de
l'année dont la leçon reste à voir (au niveau 1, sans leçon, comme prévu) : le testeur la compte comme une leçon.
Mesure par version du compteur du testeur (leçons/séance, Lucas · Sarah · Yanis) : 26.11 soir 0,60 · 0,65 · 0,43 ;
après faibles2 0,58 · 0,62 · 0,55 ; après r27b **0,69 · 0,72 · 0,73** ; master 0,71 · 0,71 · 0,78. Le saut vient de r27b
(`ownYear`), seul. Compté comme l'app (nouvelle option `#part=testeur&fidele=1`) : **0,33 à 0,35 pour Lucas et Sarah
dans toutes les versions** (0,07 à 0,15 pour Yanis), sans hausse. Le testeur ne s'est donc pas trompé sur un point :
l'élève qui échoue reçoit plus de leçons que l'élève fort (0,35 contre 0,25 ; `_faibles` : 0,42 contre 0,28), parce que ses
notions ratées (maîtrise < 0,4) gardent leur leçon due. C'est ce qui est corrigé.

### Correction : pas de nouvelle leçon tant que la précédente n'est pas réussie (`Engine.lessonHold`)

Élève en grande difficulté (`Engine.struggling`) seulement : tant que la notion de sa dernière leçon n'a pas été réussie
une fois du premier coup depuis la leçon, la séance se fait sans leçon ni notion nouvelle (notions déjà travaillées,
`plan.noLesson`, comme une Révision) ; l'attente s'arrête après 4 questions sur cette notion ou 7 jours (jamais bloqué),
et si l'élève n'a pas encore deux notions travaillées, la règle ordinaire s'applique. Le mode libre suit la même règle
(`Engine.oneLesson`). Jour de la leçon noté par `Engine.record` (première réponse après la leçon : `lessonDay`, `lessonOk0`,
`lessonN0`). Au plus une leçon par séance : inchangé. Essayé aussi « pas de leçon le lendemain d'une leçon » : rien de
plus chez les faibles, 0,03 à 0,05 leçon/séance de moins chez les moyens : non retenu. Test : `tests/faibles27.html`
(5 contrôles « lessonHold »).

**Tableau** (moyenne de 20 graines) : 26.11 · 27.11 matin (après faibles2) · 27.11 13 h (avant) → **après** ; leçons/séance :
26.11 · avant → après ; carnet fin : 27.11 matin · avant → après.

| Classe | Profil | 1er essai | Δ Mathélo | sans réussite | décourageantes | leçons/séance | carnet fin |
|---|---|---|---|---|---|---|---|
| 9e | fort | 77 % · 78 % · 77 % → 77 % | +349 · +347 · +331 → +331 | 3 % · 1 % · 0 % → 0 % | 4 % · 3 % · 2 % → 2 % | 0,28 · – · 0,28 → 0,28 | 3,5 · 3,1 → 3,1 |
| 9e | moyen | 57 % · 56 % · 58 % → 59 % | +94 · +88 · +105 → +110 | 5 % · 7 % · 6 % → 5 % | 11 % · 11 % · 11 % → 10 % | 0,32 · – · 0,34 → 0,31 | 2,8 · 3,1 → 2,6 |
| 9e | faible | 27 % · 31 % · 31 % → 33 % | −133 · −129 · −129 → −130 | 40 % · 34 % · 35 % → 30 % | 53 % · 46 % · 46 % → 40 % | 0,44 · – · 0,43 → 0,28 | 6,6 · 6,3 → 4,8 |
| 9e | très faible | 11 % · 17 % · 16 % → 19 % | −255 · −254 · −255 → −236 | 70 % · 59 % · 59 % → 52 % | 78 % · 68 % · 67 % → 64 % | 0,42 · – · 0,42 → 0,24 | 8,7 · 8,7 → 6,3 |
| 9e | irrégulier | 48 % · 53 % · 54 % → 54 % | +29 · +57 · +57 → +66 | 17 % · 9 % · 8 % → 9 % | 22 % · 16 % · 14 % → 15 % | 0,36 · – · 0,33 → 0,31 | 2,1 · 1,9 → 1,6 |
| 10e | fort | 78 % · 78 % · 79 % → 79 % | +317 · +303 · +313 → +313 | 1 % · 2 % · 1 % → 1 % | 4 % · 4 % · 3 % → 3 % | 0,24 · – · 0,24 → 0,24 | 3,8 · 3,5 → 3,5 |
| 10e | moyen | 67 % · 66 % · 63 % → 64 % | +92 · +67 · +59 → +63 | 4 % · 3 % · 3 % → 3 % | 7 % · 5 % · 6 % → 6 % | 0,28 · – · 0,28 → 0,24 | 6,3 · 6,0 → 6,0 |
| 10e | faible | 39 % · 37 % · 39 % → 40 % | −180 · −184 · −174 → −187 | 26 % · 28 % · 23 % → 21 % | 37 % · 38 % · 34 % → 31 % | 0,41 · – · 0,41 → 0,21 | 11,7 · 11,5 → 9,3 |
| 10e | très faible | 16 % · 17 % · 21 % → 21 % | −338 · −323 · −288 → −307 | 62 % · 61 % · 55 % → 52 % | 72 % · 71 % · 64 % → 61 % | 0,40 · – · 0,39 → 0,18 | 19,4 · 18,6 → 17,1 |
| 10e | irrégulier | 59 % · 59 % · 58 % → 59 % | +3 · +3 · +15 → +15 | 7 % · 7 % · 8 % → 7 % | 11 % · 12 % · 12 % → 12 % | 0,24 · – · 0,22 → 0,17 | 4,5 · 4,8 → 4,5 |
| 11e | fort | 80 % · 79 % · 79 % → 79 % | +323 · +316 · +312 → +311 | 1 % · 1 % · 1 % → 1 % | 2 % · 3 % · 2 % → 3 % | 0,26 · – · 0,25 → 0,25 | 3,3 · 3,7 → 3,7 |
| 11e | moyen | 70 % · 72 % · 70 % → 70 % | +61 · +76 · +62 → +63 | 4 % · 4 % · 3 % → 3 % | 6 % · 6 % · 5 % → 4 % | 0,25 · – · 0,26 → 0,24 | 6,1 · 6,8 → 7,0 |
| 11e | faible | 53 % · 52 % · 52 % → 54 % | −199 · −201 · −190 → −193 | 15 % · 17 % · 16 % → 12 % | 20 % · 20 % · 20 % → 18 % | 0,36 · – · 0,37 → 0,19 | 7,3 · 7,1 → 6,0 |
| 11e | très faible | 28 % · 30 % · 32 % → 32 % | −381 · −363 · −336 → −364 | 42 % · 39 % · 36 % → 34 % | 55 % · 51 % · 46 % → 46 % | 0,41 · – · 0,41 → 0,18 | 12,3 · 10,7 → 9,2 |
| 11e | irrégulier | 66 % · 66 % · 62 % → 63 % | −7 · −2 · −19 → −19 | 5 % · 2 % · 6 % → 5 % | 10 % · 5 % · 10 % → 10 % | 0,18 · – · 0,24 → 0,19 | 4,1 · 5,0 → 5,3 |
| 1re | fort | 79 % · 78 % · 79 % → 79 % | +322 · +317 · +309 → +309 | 1 % · 2 % · 2 % → 2 % | 2 % · 3 % · 3 % → 3 % | 0,25 · – · 0,25 → 0,25 | 3,8 · 3,4 → 3,4 |
| 1re | moyen | 70 % · 69 % · 69 % → 70 % | +51 · +53 · +43 → +47 | 4 % · 4 % · 4 % → 4 % | 7 % · 7 % · 7 % → 6 % | 0,25 · – · 0,27 → 0,23 | 7,0 · 7,5 → 8,0 |
| 1re | faible | 57 % · 59 % · 57 % → 60 % | −208 · −164 · −177 → −167 | 9 % · 10 % · 12 % → 8 % | 14 % · 13 % · 15 % → 12 % | 0,33 · – · 0,33 → 0,19 | 8,3 · 7,5 → 7,3 |
| 1re | très faible | 41 % · 39 % · 41 % → 44 % | −352 · −347 · −319 → −347 | 25 % · 28 % · 30 % → 23 % | 33 % · 35 % · 37 % → 29 % | 0,38 · – · 0,38 → 0,16 | 10,7 · 10,1 → 8,0 |
| 1re | irrégulier | 68 % · 66 % · 65 % → 65 % | −7 · −19 · −6 → −11 | 5 % · 4 % · 4 % → 4 % | 6 % · 7 % · 8 % → 8 % | 0,19 · – · 0,20 → 0,19 | 4,8 · 4,7 → 4,8 |

**Lecture.** Élèves faibles et très faibles : **leçons/séance 0,33–0,43 → 0,16–0,28** (moins que l'élève fort, 0,24–0,28),
séances sans aucune réussite −2 à −7 points (9e très faible 59 → 52 %, 1re très faible 30 → 23 %), décourageantes −2 à
−8 points, carnet en fin de mois plus court (9e très faible 8,7 → 6,3), réussite au 1er essai +0 à +3 points, durée des
séances égale ou plus courte (−1 à −5 s). Δ Mathélo des très faibles de 10e–1re : −20 à −30 points (bruit des graines et
questions plus proches de leur vrai niveau ; le Mathélo est caché). **Moyens et forts** : réussite, séances sans réussite
et décourageantes inchangées (± 1 point) ; forts : leçons inchangées ; moyens : 0,02 à 0,04 leçon/séance de moins (les
jours où un élève moyen passe sous 55 % de réussite, `struggling` vrai), leçon gardée tous les autres jours.

**Testeur** (20 graines ; compte de l'app `fidele=1`, avant → après) : Lucas 0,35 → 0,16–0,17 leçon/séance (50 → 50–53 %),
Sarah 0,35 → 0,15–0,17 (45 → 46–47 %), Yanis 0,15 → 0,07–0,13, Chloé 0,09 → 0,10–0,15 ; Léa, Noah, Emma, Hugo, Inès,
Tom inchangés (0,16–0,26 ; Tom 0, trois séances par jour en Automatismes / Révision). Compteur du testeur : Lucas 0,72 → 0,53,
Sarah 0,74 → 0,60, Yanis 0,78 → 0,67 (reste gonflé par l'artefact ci-dessus). 1er essai au testeur : Lucas 49–51 %,
Sarah 44–47 %, Chloé 38–48 %, Yanis 26–34 % selon le tirage : la réussite ne bouge pas (plancher, voir plus haut).

**À décider (n° 33)** : `ownYear` pose une notion de l'année **jamais vue, sans leçon** dans les séances sans leçon
(0,1 à 0,6 par séance au testeur, surtout Chloé et Yanis, élèves faibles qui ne sont pas « en grande difficulté » au sens du
moteur). Voulu (décision du 26.11 : chapitre en classe posé sans leçon), mais pour une notion jamais vue en classe, l'élève
la découvre sans cours. Variante possible : `ownYear` ne choisit que des notions de l'année déjà travaillées, ou garde
la notion à leçon pour une séance qui admet une leçon.

### Petites corrections signalées par le testeur

- **Corrigés non réduits** : FR 1re, tangente en 0 à `e^{ax} + b` : b = −1 donnait « y = 2x + 0 » (réponse refusée,
  non réduite, et le piège « ax » devenait la bonne réponse) → b ≠ −1, corrigé par `lin`. Nouveau contrôle dans
  `tests/corrige_valeur.js` (`CV.reduit`, clé « non réduit ») : ni « x + 0 » / « y − 0 » (terme nul après une lettre),
  ni « 1x » / « 0x » ; il a trouvé 14 autres générateurs, tous corrigés : `ch2c.js` (rectangle en A « 1(k + 0) », droite
  par un point « −4(x + 0) + 6 », réciproque « −(x + 0)^2 + 0 »), `defis.js` (intersection de droites « y = −x + 0 »,
  « y = · (−2) + 4 »), `ch3c_geo.js` (coplanaires « (m − 0) »), `ch_mp4.js` (« 1(x + 0) »), `ch4c_ana.js` (« + 0n »),
  `ch1c_sys.js` (substitution : **système dégénéré « 0x = 0 » présenté avec une solution unique**, écarté ; « 0a + b »,
  « 1a »), `ch1c_arg.js` (« 10(3k + 0) »), `ch3c_ana.js` (« 3(x + 4)(x + 0) », « −2x + 0 » et « −2x + −2 »),
  `fr_1re.js` (« (2x + 0)e^x », « + 0x »), `fr_2nde.js` (« y − 0 »).
- **Carnet (présentation)** : « réussis-la deux fois de suite, elle s'efface » → « réussis-la du premier coup, elle
  s'efface (deux fois de suite si tu es à l'aise). » ; côté parent : « Une erreur du carnet enfin réussie : effacée ! » ;
  page parent (`src/parents.js`) : « … effacée : réussie à nouveau du premier coup. » (au lieu de « il faut la réussir deux
  fois de suite »).
