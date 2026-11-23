# Belgique (Fédération Wallonie-Bruxelles) : référentiel de mathématiques

Résumé préparé le 23.11.2026 pour une ouverture future de 5min2maths. Source principale : **Référentiel de mathématiques du tronc
commun** (FWB, PDF du 22.06.2022, 157 p.), `~/DATA/Enseignement/Sources/Officiel/Belgique/FWB_referentiel_mathematiques_tronc_commun.pdf`,
https://ifpc.cfwb.be/v5/documents/tc/refMATH.pdf. Usage interne.

**Non récupéré** : les « Compétences terminales et savoirs requis en mathématiques » des humanités générales et technologiques
(1999, confirmées par décret en 2014) sont sur gallilex.cfwb.be, qui refuse les téléchargements automatiques. Le résumé du
secondaire supérieur ci-dessous ne repose donc que sur ce qu'en disent les résultats de recherche (trois profils) ; à compléter.

## Structure et correspondance d'âge

| Belgique (FWB) | Âge | France | Suisse romande (HarmoS) |
|---|---|---|---|
| P5 | 10-11 | CM2 | 7P |
| P6 (CEB, épreuve externe en fin d'année) | 11-12 | 6e | 8P |
| S1 | 12-13 | 5e | 9e CO |
| S2 (CE1D aujourd'hui) | 13-14 | 4e | 10e CO |
| S3 (fin du tronc commun) | 14-15 | 3e | 11e CO |
| S4 | 15-16 | 2nde | 1re sec. II |
| S5 | 16-17 | 1re | 2e sec. II |
| S6 (CESS) | 17-18 | Tle | 3e sec. II |

Le **tronc commun** (P1 à S3) remplace les « Socles de compétences » ; son déploiement est progressif, année par année (primaire
d'abord, puis S1 à S3). Le calendrier exact du secondaire et le futur certificat de fin de tronc commun sont à vérifier sur
enseignement.be avant toute ouverture. Après S3 : humanités générales et technologiques (transition) ou qualifiantes ; en
transition, trois profils de mathématiques (mathématiques de base, générales, pour scientifiques, souvent 2, 4 ou 6 périodes).

Le référentiel est organisé en **4 champs** (identiques de P1 à S3), et pour chaque année en **savoirs, savoir-faire, compétences**,
chacun avec ses **attendus** :

1. Des objets de l'espace à la géométrie (solides et figures)
2. Des grandeurs à la relation entre variables (grandeurs, proportionnalité, puis fonctions)
3. De l'arithmétique à l'algèbre (nombres, calcul, expressions, équations)
4. De l'organisation des données à la statistique

## Grandes notions par année (d'après les textes d'introduction de chaque année et de chaque champ)

**S1 (≈ 5e)** : repère cartésien ; rapporteur, amplitude d'un angle ; médiatrice, bissectrice, axes et centre de symétrie ; les quatre
isométries et leurs invariants ; périmètres et aires, périmètre du cercle et aire du disque (π) ; pourcentages en contexte ;
proportionnalité directe (tableau, graphique) ; **nombres négatifs et rationnels** (fraction-nombre, droite graduée, écritures
fractionnaire et décimale) ; opérations sur les entiers, fractions simplifiées ou irréductibles, puissances à exposant naturel ;
équations simples ; la lettre pour généraliser des suites numériques et figurées ; statistique : population, variable, effectifs,
fréquences, étendue, diagrammes en bandes et en bâtonnets, moyenne.

**S2 (≈ 4e)** : géométrie dans l'espace (perspective cavalière, vues coordonnées, sections planes du cube et du pavé) ;
agrandissements et réductions ; distance, lieux géométriques (médiatrice, bissectrice, parallèles, cercle) ; volumes de solides ;
proportionnalité sous forme d'expression analytique (coefficient), croissance ou décroissance ; opérations sur les fractions,
puissances à base entière (y compris négative), distributivité, **produits remarquables** ; équations du premier degré ; valeur
numérique d'une expression ; statistique : tableau de distribution, diagramme circulaire, mode et médiane.

**S3 (≈ 3e)** : **Pythagore et Thalès** (calcul de longueurs, distances inaccessibles, justification du parallélisme et de la
perpendicularité), inégalité triangulaire ; **fonction du premier degré** (« modèle de croissance linéaire ») dans ses trois
représentations, résolution graphique d'une équation ; nombres irrationnels, racines carrées, valeur exacte, valeur approchée,
encadrement ; **factorisation** (mise en évidence, différence de deux carrés, trinôme carré parfait) ; équations « produit nul »,
équations a x + b = c x + d, produit en croix ; puissances de 10 à exposants entiers ; statistique de variables continues,
histogramme, médiane approchée à partir des effectifs cumulés.

## Particularités pour l'app

- **Vocabulaire** : « mise en évidence » (factoriser), « produits remarquables », « règle fondamentale des proportions » (produit en
  croix), « amplitude » d'un angle, « parallélépipède rectangle », « latte » (règle), « isométries », « vues coordonnées »,
  « équation produit nul », « radical » (√), « mode ». Plus proche du vocabulaire genevois que du français sur plusieurs points
  (mise en évidence, valeur numérique).
- **Progression** : Pythagore et Thalès la même année (S3 ≈ 3e), plus tard qu'en France pour Pythagore (4e) et qu'à Genève (10e) ;
  la factorisation des trinômes carrés parfaits arrive en S3 ; fonction du premier degré en S3 comme en France (3e).
- **Notation** : virgule décimale ; séparateur des milliers à confirmer dans le référentiel (espace ou point selon les usages).
- **Couverture probable** : les notions CO de l'app (9e-11e) couvrent l'essentiel de S1-S3 ; à ajouter : suites de motifs
  (généralisation, S1-S2, aussi en France), inégalité triangulaire, lieux géométriques, histogramme et médiane de classes. Un
  référentiel JSON par attendu (comme `referentiels_fr.json`) est faisable : les attendus sont listés par année et par champ.
