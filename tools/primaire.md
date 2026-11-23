# 5min2maths au primaire : fin de primaire (7P–8P, CM1–CM2)

Note du 23.11.2026 (ROADMAP § 5, chantier AB). Référentiel : `tools/referentiels_primaire.json`
(généré par `tools/referentiels_primaire.py`). Sources hors dépôt : `~/DATA/Enseignement/Sources/Officiel/`
(`PER_Suisse_romande/`, `France/`, README avec URL, dates et droits). Usage interne.

**Périmètre (décision du 23.11).** Seulement la fin du primaire : 7P–8P en Suisse romande, CM1–CM2 en France.
Avant (1P–6P, CP–CE2), l'app n'est sans doute pas adaptée telle quelle (peu de lecture autonome, pas de saisie
au clavier, manipulation d'objets) : non traité ici, à reprendre avec des enseignants du primaire (chantier AC).

## (a) Structure par année

### Correspondance des années

| HarmoS | Âge | France | Cycle PER |
|---|---|---|---|
| 5P | 8–9 ans | CE2 | cycle 2 |
| 6P | 9–10 ans | CM1 | cycle 2 |
| **7P** | 10–11 ans | **CM2** | cycle 2 |
| **8P** | 11–12 ans | **6e** (déjà dans l'app, masquée) | cycle 2 |
| 9e | 12–13 ans | 5e | cycle 3 |

Point important : **CM1 ≈ 6P, CM2 ≈ 7P, et 8P ≈ 6e**. La 6e française existe déjà dans `curriculum.js` (champ `FR`,
niveau 6, plafond de difficulté 2), seulement masquée. La fin du primaire suisse est donc à mi-chemin entre ce
que l'app sait déjà faire (9e, 6e) et ce qu'elle n'a pas.

### Suisse romande : PER, cycle 2, demi-cycle 7e–8e

Le PER ne distingue pas 7P et 8P : ses progressions sont données par demi-cycle (5e–6e, 7e–8e), avec des
attentes fondamentales « au plus tard à la fin du cycle ». Le découpage annuel est celui des moyens
d'enseignement (MER ESPER, plateforme sous identifiant : table des matières non accessible) et des cantons.
Le référentiel garde donc une seule clé `7P-8P`. 40 éléments, dont 33 tirés de l'extrait officiel du PER
de l'ECR vaudoise 8P (2023, p. 4) et 7 repris de mémoire du PER (`verifie: false`, à contrôler).

| Objectif | Thématique | Contenus 7e–8e (résumé) |
|---|---|---|
| MSN 21 | Espace | figures planes (propriétés, constructions aux instruments), parallèles et perpendiculaires, translation et symétrie axiale, repérage dans le plan, solides |
| MSN 22 | Nombres | décimaux jusqu'aux millièmes (comparer, encadrer, décomposer), droite graduée, fractions unitaires et de même dénominateur, écritures équivalentes (½ = 0,5 = 5/10), moitié, tiers, quart d'une quantité, puissances (8 = 2³) |
| MSN 23 | Opérations | suites et lois de formation, multiples et diviseurs, calcul réfléchi et propriétés, algorithmes écrits avec décimaux (< 10'000, ≤ 2 décimales), division euclidienne (diviseur < 100), division décimale, calculatrice |
| MSN 24 | Grandeurs et mesures | doubler, fractionner une grandeur ; mesurer longueurs et angles ; périmètres ; aires (carré, rectangle, triangle, parallélogramme, losange, décomposition) ; unités de longueur, aire, angle, masse, temps, capacité et conversions |
| MSN 25 | Modélisation | trier l'information, démarche, vérification et communication ; traduire en opérations (parenthèses) ; tableaux de valeurs et graphiques ; problèmes additifs (EEE, ECE, ETE, TTT) et multiplicatifs (itération, produit cartésien, produit de mesures, proportionnalité) |

**Évaluations externes.** Genève : évaluation commune (EC) de 8P en maths, 20 % de la moyenne du 2e semestre ;
en 2024-25 : 38 points, seuil 27, **68,1 % de réussite** (76 à 82 % les années précédentes ; écart de
46 points entre élèves « à l'heure » et « en retard », de 32 points selon le milieu social ; SRED n° 170,
juillet 2026). La moyenne de 8P décide du regroupement R1/R2/R3 au CO : enjeu fort pour les familles.
Vaud : ECR 8P, 90 min, 1re partie sans calculatrice (algorithmes, écriture de nombres, angles, aires),
2e partie avec aide-mémoire et calculatrice (problèmes, démarche exigée). Le champ genevois de l'EC 8P n'a pas
pu être téléchargé (voir fin).

### France : cycle 3, CM1 et CM2 (programme 2025, objectifs par année)

Repris de `tools/referentiels_fr.json` (agent référentiels ; BO n° 16 du 17.04.2025 : CM1 dès 2025-26,
CM2 dès 2026-27). Les mêmes rubriques chaque année, avec des bornes qui montent :

| Domaine | Rubriques | Ce qui change de CM1 à CM2 |
|---|---|---|
| Nombres et calculs | entiers, fractions, décimaux, calcul mental, quatre opérations, problèmes, algèbre | entiers jusqu'à 999 999 → 999 999 999 ; décimaux aux centièmes → millièmes ; diviseurs (≤ 100, tous ≤ 30, communs) ; produit entier × fraction ; division décimale (dividende entier puis décimal, diviseur à un chiffre) ; programmes de calcul produits ; suites de motifs |
| Grandeurs et mesures | longueurs, masses, contenances (CM1) ; aires, angles, durées | aires en cm² (CM1) → cm², dm², m² et conversions (CM2) ; angle droit = 90°, notations ; durées en h, min, s |
| Espace et géométrie | géométrie plane, solides, repérage, déplacements | figures et propriétés (CM1) → programmes de construction (CM2) ; patrons du cube puis du pavé |
| Données, probabilités | tableaux, diagrammes, probabilités | diagramme circulaire et courbe (CM2) ; « a chances sur b », arbre ou tableau à deux étapes (CM2) |
| Proportionnalité | identifier, résoudre | identique |

CM1 : 128 attendus ; CM2 : 112 (dont 27 au total hors saisie : constructions, patrons, recueil de données).

## (b) Ce que l'app couvre déjà

Les notions de 9e de `src/gen3.js` (chapitres 9C01 à 9C09 du CO) recouvrent une grande partie de la fin du
primaire. Classement des éléments du référentiel selon la proximité avec l'app :

| | direct | adapter | nouveau | hors saisie |
|---|---|---|---|---|
| PER 7P–8P (40) | 15 | 17 | 5 | 3 |
| CM1 + CM2 (240) | 54 | 99 | 60 | 27 |

**Notions de 9e déjà proches de 7P–8P** (niveau 1, avec des nombres plus petits) :

- Décimaux : `decread`, `deccomp`, `decarr`, `decadd`, `dec10`, `decmul`, `decdiv`, `ordgr`, `decprob`
  (le PER de 7e–8e fixe les bornes : < 10'000, au plus 2 décimales, diviseur < 100) ;
- Fractions : `fractout` (fraction d'une quantité, tel quel), `fracrep`, `fracconv` (fractions usuelles ½, ¼, ¾, 1/10) ;
- Arithmétique : `multdiv`, `divcrit` (CM2 : diviseurs ≤ 100, tous les diviseurs ≤ 30), `pow9` (8 = 2³, PER 8P) ;
- Grandeurs : `ulong` (longueurs et masses), `uaire`, `uvol` (capacités), `utemps`, `perim`, `aire1`, `aire2`, `aire3` ;
- Géométrie : `angtype`, `quadri`, `solides`, `symetries` (sans repère à coordonnées négatives) ;
- Proportionnalité et problèmes : `proptab`, `prop`, `tradexpr`, `prio` (parenthèses seulement).

**Ce qui manque** (rien dans l'app) : la droite graduée (placer et lire des entiers, décimaux, fractions),
la division euclidienne (quotient et reste), le calcul mental et les faits numériques (tables, ×5, ×50, ÷4,
± 9 ou 19), les grands nombres (lecture en mots, jusqu'au milliard), les fractions comme parts (représenter,
fraction > 1 = entier + fraction), les suites de nombres et de motifs, l'estimation de mesures, la lecture de
l'heure, les probabilités du CM (« a chances sur b »).

## (c) Ce qu'implique le primaire pour l'app

- **Lecture.** Énoncés d'une ou deux lignes, vocabulaire du plan d'études (CH : « calcul réfléchi »,
  « droite graduée », « répertoire mémorisé » ; FR : « demi-droite graduée », « fraction décimale »). Pas de
  lettre comme inconnue avant 8P (sauf « nombre manquant » et le symbole des égalités à trous). 44 % des
  élèves de 8P à Genève sont allophones (SRED) : la lecture est la première difficulté.
- **Audio.** La lecture à voix haute (idée en réserve du 21.11) devient utile dès 7P, surtout pour les
  allophones ; à faire avant le primaire si possible, au moins pour les énoncés.
- **Manipulation.** Les pilotes de `src/act_manip.js` (glisser sur la figure) sont le bon modèle : droite
  graduée à curseur, parts de fraction à colorier, cubes à empiler, aiguilles d'horloge. Au primaire, le geste
  doit précéder la saisie, et non l'illustrer.
- **Saisie.** Le clavier de l'app (`k-num`) suffit : chiffres, virgule, peut-être la barre de fraction.
  Pas de lettres, pas de puissances ni de racines. La division euclidienne demande deux champs (quotient,
  reste) : les questions à plusieurs parties (`q.parts`) le permettent déjà. Les choix (QCM, cases) seront plus
  fréquents qu'au CO.
- **Calculatrice.** Comme à l'ECR 8P : algorithmes écrits sans calculatrice (l'app ne peut pas vérifier le
  posé, seulement le résultat ; montrer l'algorithme en colonnes dans le « pas à pas »).
- **Niveaux.** Ajouter `[7, "7P"], [8, "8P"]` à `SYSTEMS.CH` et `CM1`, `CM2` (4, 5) au système `FR`, avec un
  plafond de difficulté (≤ 2, comme la 6e). Les notions de 9e réutilisées reçoivent `CH: [8]` ou `again`,
  avec des bornes primaires (valeurs, nombre de décimales) passées au générateur plutôt qu'un nouveau générateur.
- **Mathélo et séances.** 5 minutes conviennent ; la série et les badges doivent rester sobres (pas de pression
  à l'âge de l'orientation R1/R2/R3).
- **Mode parent / enseignant.** Sans compte, un parent ou un enseignant doit pouvoir choisir le thème en cours
  (« En ce moment en classe ») et voir un bilan simple sur l'appareil de l'enfant. Le « mode classe » en
  réserve prend plus de sens au primaire (un enseignant généraliste, toutes les branches).
- **Localisation.** Séparateur des milliers (10'000 / 10 000), monnaie (CHF / €), vocabulaire (septante),
  contextes de l'enfance (goûter, sport, argent de poche) : chantier Z de la ROADMAP.

## (d) Premières notions à créer (priorité)

Ordre : d'abord ce qui réutilise une notion de 9e (7P–8P et CM2 en même temps, mêmes contenus), puis les deux
vrais manques, puis le reste du CM1–CM2.

| # | Notion (7P–8P / CM1–CM2) | Base dans l'app | Travail |
|---|---|---|---|
| 1 | Additionner, soustraire, multiplier des décimaux (algorithmes, < 10'000, ≤ 2 décimales) | `decadd`, `decmul` | bornes primaires, pas à pas « posé en colonnes » |
| 2 | Multiplier et diviser par 10, 100, 1000 | `dec10` | bornes, glisser des chiffres dans un tableau de numération |
| 3 | Comparer, ranger, encadrer, arrondir à l'entier des décimaux | `deccomp`, `decarr` | dixièmes et centièmes surtout |
| 4 | Lire et décomposer un nombre (unités… millièmes, mot-nombre ↔ chiffres) | `decread` | ajouter les grands nombres en mots (jusqu'au milliard en CM2) |
| 5 | Moitié, tiers, quart, trois quarts, fraction d'une quantité | `fractout` | contextes de l'enfance, grandeurs (MSN 24 : fractionner une grandeur) |
| 6 | Multiples, diviseurs, critères de divisibilité | `multdiv`, `divcrit` | diviseurs ≤ 100, tous les diviseurs ≤ 30, multiples communs < 15 |
| 7 | Unités : longueurs, masses, capacités, durées | `ulong`, `uvol`, `utemps` | conversions simples (km/m, kg/g, l/dl, h/min), calcul de durées |
| 8 | Périmètre et aire (rectangle, carré, triangle, parallélogramme, décomposition), mesures entières | `perim`, `aire1`, `aire2`, `aire3` | figures quadrillées, aire en comptant les carreaux d'abord |
| 9 | Division euclidienne (quotient et reste) et division décimale | `decdiv` (pour la décimale) | **nouveau générateur** : deux champs, problèmes de partage (« combien de boîtes ? reste ? ») |
| 10 | Placer et lire sur une droite graduée (entiers, décimaux, fractions) | — | **nouvelle manipulation** (curseur sur la droite), commune à MSN 22 et CM1–CM2 |

Ensuite : 11. fractions de même dénominateur (comparer, additionner, fraction > 1) ; 12. calcul mental
(faits numériques, ×5, ×50, ÷4, ± 9/19, doubles et moitiés) ; 13. proportionnalité et problèmes multiplicatifs
(`proptab`, `prop`) ; 14. problèmes additifs en étapes (`decprob`) ; 15. suites de nombres et de motifs ;
16. tableaux et diagrammes (`diagr`) ; 17. probabilités du CM (« a chances sur b ») ; 18. angles (types,
90°, mesure lue sur un rapporteur à l'écran) ; 19. solides et patrons (`solides`) ; 20. puissances simples
(`pow9`, 8P).

## (e) Risques

- **Données d'enfants (10–12 ans).** L'app reste sans compte, mais tout ce qui sort de l'appareil doit être
  revu avant d'ouvrir au primaire : statistiques d'usage, votes, et surtout le **commentaire libre** (un enfant
  peut y écrire son nom, son école). Pour le primaire : pas de champ de texte libre, ou un champ réservé au
  parent ou à l'enseignant. Suisse : nLPD (données de mineurs, information claire des parents) ; France :
  RGPD, consentement parental en dessous de 15 ans pour les services en ligne (art. 45 loi Informatique et
  libertés) ; pas de traceur publicitaire, ni de lien sortant sans avertissement.
- **Consentement et information.** Une page « parents et enseignants » (ce que l'app stocke : rien hors de
  l'appareil sauf statistiques anonymes) avant toute diffusion. Usage en classe : vérifier les règles du DIP
  genevois (et de chaque canton) pour les ressources numériques utilisées avec des élèves du primaire.
- **Orientation en 8P.** La moyenne de 8P décide du regroupement au CO : une app qui « prépare l'EC » sera
  utilisée avec anxiété par certaines familles. Garder le ton d'entraînement, pas de pronostic de note.
- **Inégalités.** Les écarts à l'EC 8P de maths sont les plus forts (retard scolaire, milieu, REP) : l'audio,
  la manipulation et des énoncés courts comptent plus que le nombre de notions.
- **Qualité.** Une erreur d'énoncé fait plus de dégâts face à un enfant seul. Même règle que pour le CO :
  finir proprement quelques notions avec des enseignants du primaire testeurs (Budé n'a pas de primaire :
  trouver une classe de 7P ou 8P) avant d'étendre.
- **Programmes mouvants.** France : CM2 au nouveau programme dès 2026-27 seulement. Suisse : le PER complet
  n'est lisible que sur portail.ciip.ch (dynamique) ; 7 éléments du référentiel sont repris de mémoire et
  marqués `verifie: false`.
- **Charge.** Le primaire ajoute de la relecture et des niveaux ; la ROADMAP le place après la bêta (juin 2027)
  et après la France (recommandation du 22.11).

## Non trouvé

- Le texte intégral du PER (objectifs MSN 21–25, progressions et attentes fondamentales de 7e–8e) : portail.ciip.ch
  est une application dynamique, sans PDF ; seul l'extrait de l'ECR vaudoise 8P et la brochure CIIP 2012 sont
  en local.
- Le champ de l'évaluation commune de 8P (DIP Genève, edu.ge.ch) : « Accès refusé » aux clients automatiques ;
  à télécharger à la main.
- La table des matières des MER ESPER 7e–8e (plateforme sous identifiant).
