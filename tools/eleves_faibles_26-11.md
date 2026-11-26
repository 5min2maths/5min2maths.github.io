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
