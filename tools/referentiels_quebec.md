# Québec : Programme de formation de l'école québécoise (PFEQ), mathématique au secondaire

Résumé préparé le 23.11.2026 pour une ouverture future de 5min2maths. Sources (gouvernement du Québec, rangées dans
`~/DATA/Enseignement/Sources/Officiel/Quebec/`, URL dans le README) : PFEQ mathématique 1er cycle et 2e cycle du secondaire,
**Progression des apprentissages au secondaire, mathématique** (août 2016, mise à jour CST 5e), document « Notations et symboles »,
cadre d'évaluation. Page : https://www.quebec.ca/education/prescolaire-primaire-et-secondaire/programmes-formations-evaluation/programme-formation-ecole-quebecoise/secondaire/mathematique

Limite : dans la Progression des apprentissages, l'année où chaque connaissance est enseignée est indiquée par des symboles
graphiques (flèche, étoile, grisé) que l'extraction de texte ne restitue pas. Les placements par année ci-dessous viennent des notes
du texte (« s'ajoute en 3e secondaire »…) et de la structure des programmes ; à vérifier sur le PDF avant de créer un référentiel fin.

## Structure et correspondance d'âge

| Québec | Âge (au 30 sept.) | France | Suisse romande |
|---|---|---|---|
| 6e année du primaire | 11-12 | 6e | 8P |
| Secondaire 1 (1er cycle) | 12-13 | 5e | 9e CO |
| Secondaire 2 (1er cycle) | 13-14 | 4e | 10e CO |
| Secondaire 3 (2e cycle, tronc commun) | 14-15 | 3e | 11e CO |
| Secondaire 4 (séquence CST, TS ou SN) | 15-16 | 2nde | 1re sec. II |
| Secondaire 5 (CST, TS ou SN ; diplôme d'études secondaires) | 16-17 | 1re | 2e sec. II |
| Cégep (collège) | 17-19 | Tle / supérieur | 3e sec. II |

Trois **séquences** dès la 4e secondaire : **CST** (Culture, société et technique), **TS** (Technico-sciences), **SN** (Sciences
naturelles, préalable aux sciences au cégep). Le programme est rédigé par compétences (résoudre une situation-problème, déployer un
raisonnement mathématique, communiquer) ; les connaissances sont regroupées par champs : arithmétique, algèbre, probabilités,
statistique, géométrie, géométrie analytique, mathématiques discrètes (graphes, choix social, matrices), mathématiques financières.

## Grandes notions par année

**1er cycle (Sec. 1-2)** : nombres réels sous leurs écritures (fractions, décimaux, entiers relatifs, pourcentages) et opérations ;
puissances et décomposition en facteurs premiers ; **rapports, taux, proportionnalité** (tant pour cent, taux unitaire, situations
de proportionnalité, table de valeurs, graphique) ; expressions algébriques, équations du premier degré ; figures planes, angles,
périmètres, aires, solides et développements ; transformations (translation, rotation, réflexion, homothétie ; le vecteur sert aux
translations) ; probabilités (dénombrement, arbres) ; statistique descriptive simple.

**Sec. 3** : **notation scientifique** (note explicite de la Progression), puissances et radicaux ; relations et fonctions (affine,
rationnelle d'inverse, initiation non formelle) ; inéquations du premier degré ; **relation de Pythagore** ; solides et volumes ;
statistique (diagrammes, mesures de tendance centrale).

**Sec. 4-5 (selon la séquence)** : systèmes d'équations ; fonctions du second degré, exponentielle, logarithme, périodiques
(SN, TS) ; **géométrie analytique** (distance, droites, coniques en SN 5) ; relations métriques, trigonométrie (loi des sinus en TS
et SN) ; **vecteurs** (SN, TS) ; statistique à deux caractères (corrélation, droite de régression) ; CST : graphes, théorie du choix
social, optimisation, mathématiques financières.

## Particularités pour l'app

- **Vocabulaire** : « taux » et « rapport », « relation de Pythagore », « relations métriques », « table de valeurs » (et non
  tableau), « règle » d'une fonction (= expression), « variable dépendante / indépendante », « fonction partie entière », « mesures de
  tendance centrale et de dispersion », « situation-problème ». Anglicismes évités : « pourcentage » plutôt que « percent ».
- **Notations** : le Québec a un document officiel « Notations et symboles » (à suivre) : virgule décimale, espace pour les milliers,
  intervalles avec crochets ; symboles d'unités SI ; dollars ($) pour les contextes.
- **Organisation** : par cycles de deux ans au 1er cycle (pas de répartition annuelle stricte entre Sec. 1 et Sec. 2) et par
  séquences au 2e cycle : l'app devrait proposer « Sec. 4 SN », « Sec. 4 CST »… comme elle distingue le Collège et la MP.
- **Couverture probable** : le 1er cycle et la Sec. 3 sont proches du CO genevois (notions `rel`, `fracadd`, `prop`, `eq1`, `pyth`,
  `sci`, `vol`…) ; manquent les mathématiques discrètes, financières et la statistique à deux caractères ; la séquence SN de 4e-5e
  correspond à peu près à la 1re-2e du Collège (fonctions, trigonométrie, géométrie analytique).
