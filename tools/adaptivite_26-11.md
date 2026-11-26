# Adaptivité du moteur — 26.11

Constat de départ (simulation d'un testeur, 10 profils × 14 jours, vrai moteur) : élèves faibles à 39–45 % de
réussite au premier essai, Mathélo en baisse, séances sans réussite. Les robots de `tests/eleves.js` donnaient la même
image (élève en difficulté de 9e : 26 %).

## Mesures

Deux simulations, toutes deux sur le vrai moteur avec une horloge simulée :

- **Robots** (`tests/eleves.js`, remis en état : déroulé actuel des séances — une leçon au plus, en tête ; pas de
  leçon en automatismes ; vrais automatismes ; remédiation ; « trop facile » ; « je ne sais pas » ; abandon après 3
  échecs de suite avec une probabilité ; points de l'année ; durée estimée). 14 semaines dès septembre, graine 7,
  avec et sans chapitre « en classe » (+cl : les 3 notions proposées par `nowSuggest`, renouvelées chaque semaine).
  Page : `tests/_adapt_mesure.html#classes=9e,11e,1re&semaines=14` (hors suite).
- **Testeur** (`tests/_simulation_testeur.js`, déposé tel quel) : 11e, 14 jours dès le 7.12, 5 graines.
  Page : `tests/_adapt_mesure.html#part=testeur`. Cette simulation ne fait ni la remédiation, ni la question allégée
  (elle suit le programme de la séance tel quel), ni « trop facile » (question sautée sans appel au moteur).
- Ancien moteur : `git show 226a5a9:src/engine.js > tests/_engine_avant.js`, puis `#moteur=avant&…` (la page charge
  `tests/_engine_<nom>.js` ; copies non versionnées).

Durée estimée (robots) : leçon 75 s, automatisme 25 s, application / révision 50 s, défi 70 s, problème 150 s,
+30 s par erreur.

### Robots : avant → après (réglages retenus)

Réussite au 1er essai · séances sans aucune réussite / séances · abandons · durée moyenne / max · Δ Mathélo
(vrai niveau − départ entre parenthèses) · points de l'année · part de niveaux 3–4.

| Classe, profil | Avant | Après |
|---|---|---|
| 9e fort | 86 % · 1/83 · 0 · 186/290 s · +530 · 2132 pts · 39 % | 86 % · 1/85 · 0 · 189/300 s · +528 · 2136 pts · 40 % |
| 9e moyen régulier | 54 % · 5/86 · 0 · 204/320 s · +114 · 1815 pts | 68 % · 3/83 · 0 · 195/290 s · +213 · 1824 pts |
| 9e moyen régulier +cl | 60 % · 4/85 · 204 s · +160 · 1841 pts | 68 % · 1/91 · 193 s · +230 · 1995 pts |
| 9e faible régulier | 32 % · 19/89 · 12 · 213/320 s · −40 · 1624 pts | 38 % · 15/90 · 5 · 227/320 s · −31 · 1794 pts |
| 9e lent (« je ne sais pas ») +cl | 41 % · 7/76 · 3 | 47 % · 7/74 · 1 |
| 9e en difficulté (3 j/sem.) | 26 % · 10/38 · 5 | 27 % · 11/31 · 7 |
| 11e fort | 83 % · 0/78 · 188/290 s · 44 % | 84 % · 0/78 · 188/290 s · 44 % |
| 11e moyen régulier | 63 % · 3/81 · 209/395 s · +102 · 1797 pts | 71 % · 0/85 · 201/335 s · −34 · 1934 pts |
| 11e moyen régulier +cl | 68 % · 5/87 · +269 · 1977 pts | 70 % · 1/89 · +105 · 2033 pts |
| 11e faible régulier | 47 % · 9/90 · 3 · 230/395 s · −264 · 1849 pts | 59 % · 6/88 · 2 · 218/365 s · −163 · 1921 pts |
| 11e faible régulier +cl | 43 % · 12/88 · 9 · 226/395 s | 51 % · 6/85 · 3 · 225/365 s |
| 11e lent | 49 % · 4/79 · 1 | 61 % · 2/71 · 0 |
| 11e irrégulier | 65 % · 1/56 | 71 % · 0/49 |
| 11e en difficulté +cl | 31 % · 9/44 · 6 | 42 % · 8/40 · 2 |
| 1re fort | 86 % · 0/86 · 40 % | 85 % · 0/82 · 45 % |
| 1re moyen régulier | 65 % · 2/83 · +119 · 1856 pts | 72 % · 0/83 · +59 · 1904 pts |
| 1re faible régulier | 52 % · 6/86 · 1 · 216/395 s · 1780 pts | 65 % · 0/91 · 0 · 206/335 s · 2029 pts |
| 1re faible régulier +cl | 54 % · 9/88 · 2 | 59 % · 6/92 · 3 |
| 1re lent | 53 % · 8/76 · 2 | 68 % · 1/68 · 0 |
| 1re lent +cl | 50 % · 10/73 · 3 | 63 % · 2/68 · 0 |
| 1re en difficulté | 45 % · 8/49 · 5 | 61 % · 3/44 · 1 |

Durée : aucune séance au-dessus de 6 min 35 avant (395 s), 6 min 15 au plus après (375 s), moyenne 3 à 4 min.
Questions par notion sur 14 semaines : 4 à 10 en 11e–1re, 12 à 30 en 9e (peu de notions ouvertes en septembre–décembre).
Profondeur avec chapitre « en classe » : chaque notion du chapitre revient 3,5 à 5,7 fois par semaine en 9e–11e
(élève régulier) ; en 1re elle passait à 1,4–2,7 fois, car le chapitre de 1re reprend des notions d'années
précédentes (Pythagore, angles) que le moteur traitait en notions anciennes : après le réglage d, 3,3 à 3,8 fois.

Étapes (mêmes robots, réussite au 1er essai du profil faible régulier 9e / 11e / 1re) : avant 32 / 47 / 52 % ;
a seul 35 / 52 / 55 % ; a + b 35 / 53 / 70 % ; a + b + c 35 / 58 / 65 % ; final (+ défi moins fréquent sous le
plancher, chapitre « en classe ») 38 / 59 / 65 %. L'effet de chaque étape varie de quelques points d'une graine à
l'autre (une seule graine par profil) : ne lire que les écarts de plus de 5 points.

### Testeur (11e, 14 jours, moyenne de 5 graines) : avant → après

| Élève | Profil | 1er essai | Δ Mathélo | min/séance | boîte ≥ 3 |
|---|---|---|---|---|---|
| Léa | forte, régulière | 85 → 84 % | +234 → +231 | 2,5 → 2,6 | 4,4 → 4,6 |
| Noah | fort, « trop facile » | 79 → 81 % | +149 → +133 | 2,2 → 2,3 | 1,6 → 2,2 |
| Emma | moyenne, régulière | 66 → 71 % | +32 → +40 | 3,4 → 3,2 | 3,0 → 2,8 |
| Hugo | moyen, irrégulier | 64 → 65 % | +16 → +26 | 3,3 → 3,5 | 0,8 → 1,6 |
| Lucas | faible, régulier | 45 → 51 % | −120 → −137 | 4,1 → 4,2 | 1,6 → 2,8 |
| Chloé | faible, abandonne vite | 37 → 45 % | −58 → −51 | 3,1 → 3,8 | 0 → 1,0 |
| Sarah | lente, « je ne sais pas » 30 % | 43 → 48 % | −173 → −142 | 4,4 → 4,3 | 1,2 → 1,8 |
| Yanis | désengagé, 3 jours | 41 → 30 % | −48 → −75 | 3,3 → 3,8 | 0 → 0 |

Yanis : une dizaine de questions par graine, et le hasard est partagé entre élèves dans cette simulation (un autre
élève qui tire un peu plus de nombres change toute la suite des siens) ; seul, avec la même graine, il donne 22 %
avant comme après. Son écart n'est pas significatif.

Lucas (−250 par rapport au Mathélo de départ) : le Mathélo qui baisse de 140 est le moteur qui retrouve son vrai
niveau, pas un recul. Ses questions possibles en 11e : notions de 9e reprises (score 890, 65 % pour lui), de 10e
(1040, 44 %), de 11e (1190, 25 %), problème du défi du jour (1280, 17 %). Sans notion antérieure (règle de
remobilisation : rien ne la déclenche en deux semaines), 50 % est à peu près le maximum atteignable.

## Réglages retenus (src/engine.js, src/app.js)

a. **Question allégée après deux échecs de suite** (`Engine.easeNext`, appelé dans `onDone` de l'app, pas en
   préparation de test, carnet, « Me tester », problème de la semaine ni « Refaire ») : la question suivante est
   remplacée si elle n'est pas déjà plus facile (difficulté ressentie = score de la question − 200 × maîtrise, marge
   50) : même notion un niveau en dessous ; au niveau 1, une base (PREREQ) déjà ouverte (« Une base à consolider ») ;
   sinon la notion de l'année la mieux maîtrisée, au niveau 1. Jamais une notion dont la leçon reste à voir ; dans une
   série d'automatismes, seulement un vrai automatisme. Le nombre de questions ne change pas. La remédiation existante
   (deux échecs sur la même notion) reste prioritaire.
b. **Cible propre à l'élève** (`ADAPT`, `Engine.adapt`, appelé par `record`) : réussite au 1er essai sur les
   16 dernières réponses (8 au moins, « je ne sais pas » = échec). Sous 55 % : la cible baisse de 20 points de
   Mathélo par réponse, et continue tant que la réussite reste sous 65 % ; au-dessus de 85 % : elle monte de 10
   points par réponse ; elle revient vers 0 quand la réussite dépasse 75 % (cible abaissée) ou tombe sous 70 % (cible
   relevée). Bornes : −300 à +120. Appliquée dans `planSlots` et `difficulty`. Stockée dans `state.tadj`, `state.last1`.
c. **Sous le plancher** (`Engine.underFloor` : cible ≤ −150 et réussite encore sous 65 %) : jusqu'à 2 rappels de
   notions anciennes par séance de 3 questions et plus (au lieu de 1), toujours selon `oldNeed` (notion ratée,
   prérequis, Mathélo en baisse) ; niveau 1 permis pour ces rappels s'il n'est pas trivial pour l'élève (score au plus
   350 points sous son Mathélo, ≈ 88 % de réussite prévue) ; le défi du jour (un problème de niveau 4) est moins
   souvent choisi (−1,5 dans `chooseFormat`).
d. **Profondeur** : une notion du chapitre « en classe » passe toujours par le créneau du chapitre, même si c'est une
   reprise d'une année précédente (1re du Collège : Pythagore, angles…), à un niveau non trivial (`oldLevels`). Avant,
   elle n'était posée que par le créneau de rappel, donc presque jamais.

Essayés et écartés : fenêtre de 20 réponses (réaction trop lente sur 14 jours, Lucas 51 → 47 %) ; sous le plancher,
un tiers seulement des créneaux sur le chapitre « en classe » (gain en 11e–1re, perte en 9e : 38 → 32 %, abandons 6 → 14).

## Garde-fou

`tests/adaptivite.html` (dans la suite, quelques secondes) : 6 élèves simulés, 8 semaines. Échoue si l'élève faible
régulier (11e, 1re, 1re + chapitre) sort de 55–80 % au premier essai, si le bon élève (9e, 11e) a moins de 25 % de
niveaux 3–4, si une séance dépasse 395 s estimées (380 s jusqu’à la décision n° 2 du 26.11 : une question allégée par séance au plus ; la séance maximale, leçon + 4 échecs, revient à 395 s chez l’élève faible de 1re), ou si le moteur lève une erreur.

## Limites du modèle

- Le robot réussit selon la formule d'Elo appliquée au score de la question : il n'y a pas de questions « faciles
  pour lui » en dehors de ce que dit le score. Tout dépend donc de `itemRating` : au niveau 1, une notion de l'année
  vaut le Mathélo de départ de la classe moins 60 (9e : 890). Un élève 250 points en dessous réussit ≈ 30 % au niveau 1
  de sa classe, quel que soit le réglage.
- **9e : plancher absolu.** Aucune notion d'une année précédente au catalogue (le CO commence en 9e) : ni la cible
  abaissée ni la remobilisation n'ont d'effet. Élève faible régulier 32 → 38 % seulement. Pour aller plus loin, il
  faudrait des questions d'un niveau inférieur au niveau 1 de la 9e (fin de primaire), ce qui sort du plan d'études
  de la classe : décision de l'enseignant.
- 11e avec chapitre « en classe » : 2 créneaux sur 3 sur le chapitre de 11e, au niveau 1 de 11e : l'élève faible reste
  vers 50 %.
- Le Mathélo du moyen régulier monte moins vite après réglage (11e : +102 → −34 ; vrai niveau +50) : avec des
  questions plus faciles, il s'approche du vrai niveau du robot au lieu de le dépasser. Le robot n'apprend que
  10 points par réussite et oublie 3 points par jour : sa « progression » est faible par construction ; les points de
  l'année, eux, montent (1797 → 1934).
- Une seule graine par profil (robots) : écarts de ± 5 points d'une graine à l'autre.
- Le modèle ne dit rien de la clarté des énoncés ni de la motivation (abandon = règle simple).

## À faire valider par l'enseignant

1. Les valeurs de la cible propre (55 % / 65 % / 85 %, −300 à +120) et du « sous le plancher » (2 rappels par séance,
   niveau 1 permis pour une notion ancienne non triviale).
2. 9e : accepter le plancher, ou ouvrir quelques automatismes de fin de primaire aux élèves de 9e sous le plancher.
3. La question allégée après deux échecs peut être la notion la mieux maîtrisée de l'élève (hors du programme prévu) :
   d'accord ?
4. Notion du chapitre « en classe » reprise d'une année précédente posée dans le créneau du chapitre (1re du Collège).
