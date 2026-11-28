# Couverture du programme français, attendu par attendu (25.11.2026)

Branches `agent/frcouv`, `agent/frfin` (25.11 au soir), puis `agent/trous` (25.11, derniers manques). Calculé par `tools/france_couverture.py` à partir des attendus officiels (`tools/referentiels_fr.json` :
cycle 3 2025, cycle 4 2026 pour la 5e, attendus 2019 en 4e et 3e — en vigueur en 2026-2027 —, 2nde et 1re 2026, Tle (texte
2026, très proche du 2019 en vigueur) et du catalogue réel d'un profil français (`Engine.catalog`), avant et après le chantier.
Décisions, rattachements, retraits et niveau : § final de `tools/france.md` et rapport de l'agent.

## Synthèse

| Classe | Attendus saisissables | Avant (agent/frfin) | Après (agent/trous) | Notions de l'année / catalogue |
|---|---|---|---|---|
| 6e | 77 | 67 ✅ · 4 ◐ · 6 ✗ → **90 %** | 73 ✅ · 4 ◐ · 0 ✗ → **97 %** | 36 / 36 |
| 5e | 119 | 110 ✅ · 1 ◐ · 8 ✗ → **93 %** | 116 ✅ · 1 ◐ · 2 ✗ → **98 %** | 63 / 68 |
| 4e | 50 | 48 ✅ · 0 ◐ · 2 ✗ → **96 %** | 48 ✅ · 0 ◐ · 2 ✗ → **96 %** | 60 / 93 |
| 3e | 40 | 37 ✅ · 1 ◐ · 2 ✗ → **94 %** | 37 ✅ · 1 ◐ · 2 ✗ → **94 %** | 61 / 115 |
| 2nde | 66 | 64 ✅ · 1 ◐ · 1 ✗ → **98 %** | 63 ✅ · 2 ◐ · 1 ✗ → **97 %** (26.11, agent/frlycee) | 56 / 134 |
| 1re spécialité | 51 | 47 ✅ · 4 ◐ · 0 ✗ → **96 %** | 47 ✅ · 4 ◐ · 0 ✗ → **96 %** | 48 / 165 |
| Tle spécialité | 43 | 39 ✅ · 4 ◐ · 0 ✗ → **95 %** | 40 ✅ · 3 ◐ · 0 ✗ → **97 %** | 36 / 201 |

Taux = (✅ + ½ ◐) / attendus saisissables. ✅ : une notion du catalogue de la classe entraîne l'attendu (de l'année, ou
automatisme repris) ; ◐ : couverture partielle, ou seulement en révision d'une année antérieure ; ✗ : rien ; — : non
saisissable (construction, démonstration, programmation). « avant » = catalogue après la branche agent/frfin
(25.11 au soir) ; « après » = branche agent/trous (25.11). Les taux agent/frcouv → agent/frfin : 6e 77 → 90 %, 5e 90 → 93 %,
2nde 95 → 98 %, 1re 95 → 96 %, Tle 91 → 95 %.


## 6e (`6e`, BO n° 16 du 17 avril 2025 (arrêté du 10 avril 2025) : CM1 et 6e dès 2025-2026, CM2 dès 2026-2027)

| Code | Attendu | Notions | Verdict |
|---|---|---|---|
| 6e.NC.01 | Connaître et utiliser la valeur des chiffres selon leur rang dans l’écriture d’un nombre | `decread` | ✅ |
| 6e.NC.02 | Connaître les liens entre les unités de numération unité, dizaine, centaine, millier, dixième, centième, milli… | `decread` | — |
| 6e.NC.03 | Connaître des grands nombres entiers | `decread` | ✅ |
| 6e.NC.04 | Reconnaître un nombre décimal | `decread` | ✅ |
| 6e.NC.05 | Connaître la définition d’un pourcentage | `pct` | ✅ |
| 6e.NC.06 | Associer et utiliser différentes écritures d’un nombre décimal : écriture à virgule, fraction, nombre mixte, p… | `fracconv`, `pct` | ✅ |
| 6e.NC.07 | Placer sur une demi-droite graduée un point dont l’abscisse est un nombre décimal | `deccomp` | ✅ |
| 6e.NC.08 | Repérer un nombre décimal sur une demi-droite graduée | `deccomp` | ✅ |
| 6e.NC.09 | Comparer deux nombres décimaux | `deccomp` | ✅ |
| 6e.NC.10 | Ordonner une liste de nombres décimaux | `deccomp` | ✅ |
| 6e.NC.11 | Donner la valeur arrondie à l’unité, au dixième ou au centième, d’un nombre décimal | `decarr` | ✅ |
| 6e.NC.12 | Déterminer ou connaître la valeur arrondie de certains nombres non décimaux | `decarr` | ✅ |
| 6e.NC.13 | Encadrer un nombre décimal par deux nombres décimaux, intercaler un nombre décimal entre deux nombres décimaux | `decarr` | ✅ |
| 6e.NC.14 | Additionner et soustraire des nombres décimaux | `decadd` | ✅ |
| 6e.NC.15 | Multiplier un nombre entier ou un nombre décimal par 0,1, par 0,01, et par 0,001 | `dec10` | ✅ |
| 6e.NC.16 | Connaître le lien avec la division par 10, 100 et par 1 000 | `dec10` | ✅ |
| 6e.NC.17 | Comprendre le sens de la multiplication de deux nombres décimaux | `decmul` | — |
| 6e.NC.18 | Calculer le produit de deux nombres décimaux | `decmul` | ✅ |
| 6e.NC.19 | Contrôler les résultats à l’aide d’ordres de grandeur | `ordgr` | ✅ |
| 6e.NC.20 | Résoudre des problèmes mettant en jeu des multiplications entre des nombres décimaux | `decmul`, `decprob` | ✅ |
| 6e.NC.21 | Diviser un nombre décimal par un nombre entier non nul inférieur à 10 | `decdiv` | ✅ |
| 6e.NC.22 | Résoudre des problèmes mettant en jeu des divisions décimales | `decdiv`, `decprob` | ✅ |
| 6e.NC.23 | Effectuer la division euclidienne d’un nombre entier par un nombre entier inférieur à 100 | `multdiv` | ✅ |
| 6e.NC.24 | Résoudre des problèmes mettant en jeu des divisions euclidiennes | `multdiv` | ✅ |
| 6e.NC.25 | Relier une fraction au résultat exact de la division de son numérateur par son dénominateur | `fracconv` | ✅ |
| 6e.NC.26 | Comprendre et connaître la définition du quotient d’un entier a par un entier b non nul | `decdiv`, `multdiv` | ◐ |
| 6e.NC.27 | Compléter des égalités à trous multiplicatives | `fractout` | ✅ |
| 6e.NC.28 | Placer une fraction sur une demi-droite graduée dans des cas simples | `fracrep` | ✅ |
| 6e.NC.29 | Graduer un segment de longueur donnée | — | — |
| 6e.NC.30 | Savoir que la fraction peut représenter un nombre entier, un nombre décimal non entier ou un nombre non décima… | `fracconv` | ✅ |
| 6e.NC.31 | Utiliser une multiplication pour appliquer une fraction à un nombre entier | `fractout` | ✅ |
| 6e.NC.32 | Établir des égalités de fractions | `fracsimp` | ✅ |
| 6e.NC.33 | Comparer et encadrer des fractions | `fracrep` | ✅ |
| 6e.NC.34 | Ordonner une liste de nombres écrits sous forme de fractions ou de nombres mixtes | `fracrep` | ✅ |
| 6e.NC.35 | Additionner et soustraire des fractions | `fracadd` | ✅ |
| 6e.NC.36 | Multiplier une fraction par un nombre entier | `fractout` | ✅ |
| 6e.NC.37 | Résoudre des problèmes mettant en jeu des fractions | `fractout` | ✅ |
| 6e.NC.38 | Inventer des problèmes mettant en jeu des fractions | `fractout` | — |
| 6e.NC.39 | Comprendre le sens d’un pourcentage | `pct` | — |
| 6e.NC.40 | Calculer une proportion (rapport entre une partie et le tout) et l’exprimer sous forme de pourcentage dans des… | `pct` | ✅ |
| 6e.NC.41 | Appliquer un pourcentage à une grandeur ou à un nombre | `pct` | ✅ |
| 6e.NC.42 | Utiliser des modèles pré-algébriques pour résoudre des problèmes algébriques | `prop`, `fractout` | ◐ |
| 6e.NC.43 | Identifier la structure d’un motif évolutif en repérant une régularité et en identifiant une structure | `motifs` | ✅ |
| 6e.GM.01 | Savoir que le périmètre du disque est proportionnel à son diamètre | `disque` | ✅ |
| 6e.GM.02 | Connaître la formule du périmètre d’un disque | `disque` | ✅ |
| 6e.GM.03 | Calculer le périmètre d’un disque | `disque` | ✅ |
| 6e.GM.04 | Calculer des périmètres de figures composées | `perim` | ✅ |
| 6e.GM.05 | Résoudre des problèmes impliquant des longueurs | `perim` | ✅ |
| 6e.GM.06 | Effectuer des conversions d’aire | `uaire` | ✅ |
| 6e.GM.07 | Connaître la formule de l’aire d’un carré ou d’un rectangle | `aire1` | ✅ |
| 6e.GM.08 | Calculer l’aire d’un carré ou d’un rectangle | `aire1` | ✅ |
| 6e.GM.09 | Connaître l’unité centimètre cube | `volpave` | ✅ |
| 6e.GM.10 | Comparer des volumes | `volpave` | ✅ |
| 6e.GM.11 | Déterminer un volume | `volpave` | ✅ |
| 6e.GM.12 | Effectuer des calculs sur des horaires et des durées | `utemps` | ✅ |
| 6e.GM.13 | Résoudre des problèmes impliquant des horaires et des durées | `utemps` | ✅ |
| 6e.GM.14 | Convertir des durées | `utemps` | ✅ |
| 6e.EG.01 | Connaître et utiliser la définition de la distance entre deux points | `cercle6` | ✅ (avant ✗) |
| 6e.EG.02 | Connaître et utiliser la définition du milieu d’un segment | `mediatrice` | ◐ |
| 6e.EG.03 | Connaître les définitions d’un cercle, d’un disque, d’un rayon, d’un diamètre, d’une corde | `disque` | ✅ |
| 6e.EG.04 | Comprendre la définition d’un cercle et celle d’un disque sous la forme d’ensembles de points | `cercle6` | ✅ (avant ✗) |
| 6e.EG.05 | Résoudre des problèmes mettant en jeu des distances à un point | `cercle6` | ✅ (avant ✗) |
| 6e.EG.06 | Connaître la définition de la médiatrice d’un segment | `mediatrice` | ✅ |
| 6e.EG.07 | Comprendre et utiliser la propriété caractéristique de la médiatrice d’un segment | `mediatrice` | ✅ |
| 6e.EG.08 | Résoudre des problèmes en s’appuyant sur la propriété caractéristique de la médiatrice | `mediatrice` | ✅ |
| 6e.EG.09 | Mesurer un angle | `angtype` | ✅ |
| 6e.EG.10 | Construire un angle de mesure donnée | — | — |
| 6e.EG.11 | Connaître la définition de la bissectrice d’un angle saillant | `bissec6` | ✅ (avant ✗) |
| 6e.EG.12 | Utiliser la définition de la bissectrice d’un angle pour effectuer des constructions et résoudre des problèmes | `bissec6` | ✅ (avant ✗) |
| 6e.EG.13 | Construire des triangles | — | — |
| 6e.EG.14 | Connaître et utiliser les propriétés angulaires des triangles particuliers : triangle rectangle, triangle isoc… | `angtri` | ✅ |
| 6e.EG.15 | Connaître la valeur de la somme des mesures des angles d’un triangle | `angtri` | ✅ |
| 6e.EG.16 | L’utiliser pour calculer des angles, effectuer des constructions et résoudre des problèmes | `angtri` | ✅ |
| 6e.EG.17 | Savoir que les médiatrices d’un triangle sont concourantes | `mediatrice` | ◐ |
| 6e.EG.18 | Connaître et construire le cercle circonscrit à un triangle | `droitesrem` | — |
| 6e.EG.19 | Connaître la définition du symétrique d’un point par rapport à une droite | `symax` | ✅ |
| 6e.EG.20 | Connaître et utiliser les propriétés de la symétrie axiale pour effectuer des constructions | `symax` | ✅ |
| 6e.EG.21 | Voir dans l’espace des assemblages de cubes | — | — |
| 6e.DP.01 | Planifier une enquête et recueillir des données | — | — |
| 6e.DP.02 | Réaliser des mesures et les consigner dans un tableau | — | — |
| 6e.DP.03 | Construire un tableau simple pour présenter des données (observations, caractères) | — | — |
| 6e.DP.04 | Faire un choix en filtrant les données d’un tableau selon un critère | `filtre6` | ✅ (avant ✗) |
| 6e.DP.05 | Savoir que la probabilité d’un évènement est un nombre compris entre 0 et 1 | `proba6` | ✅ |
| 6e.DP.06 | Calculer des probabilités dans des situations simples d’équiprobabilité | `proba6` | ✅ |
| 6e.DP.07 | Comparer des résultats d’une expérience aléatoire répétée à une probabilité calculée | `proba6` | ✅ |
| 6e.PF.01 | Connaître la définition de la proportionnalité entre deux grandeurs et la mettre en lien avec des expressions … | `prop` | ✅ |
| 6e.PF.02 | Identifier si une situation relève du « modèle » de la proportionnalité | `prop` | ✅ |
| 6e.PF.03 | Résoudre un problème de proportionnalité en choisissant une procédure adaptée : propriété de linéarité pour la… | `prop` | ✅ |
| 6e.PF.04 | Représenter une situation de proportionnalité à l’aide d’un tableau ou de notations symboliques | `prop`, `proptab` | — |
| 6e.PF.05 | S’initier à la résolution de problèmes d’échelles | `echelle6` | ✅ |
| 6e.PI.01 | Identifier une instruction ou une séquence d’instructions | — | — |
| 6e.PI.02 | Produire et exécuter une séquence d’instructions | — | — |
| 6e.PI.03 | Répéter à la main une séquence d’instructions pour accomplir une tâche imposée | — | — |
| 6e.PI.04 | Programmer la construction d’un chemin simple | — | — |

## 5e (`5e`, BO n° 10 du 5 mars 2026 (arrêté du 18 février 2026) : 5e en 2026-2027, 4e en 2027-2028, 3e en 2028-2029)

| Code | Attendu | Notions | Verdict |
|---|---|---|---|
| 5e.NC.01 | Mobiliser les critères de divisibilité par 2, 5 et 10 vus en CM1 et CM2 | `divcrit` | ✅ |
| 5e.NC.02 | Déterminer le quotient et le reste dans une division euclidienne, par exemple, savoir que 17 = 3 × 5 + 2 | `multdiv` | ✅ |
| 5e.NC.03 | Utiliser les tables de multiplication pour factoriser des nombres entiers décomposables en produit de deux nom… | `factor` | ✅ |
| 5e.NC.04 | Savoir calculer des produits en lien avec les tables : 0,6 × 7 ; 40 × 0,03 | `decmul` | ✅ |
| 5e.NC.05 | Multiplier et diviser par 10, 100, 1 000 | `dec10` | ✅ |
| 5e.NC.06 | Additionner et soustraire des décimaux, par exemple, 2,7 + 1,4 ; 3,4 – 0,8 | `decadd` | ✅ |
| 5e.NC.07 | Additionner, soustraire, multiplier et diviser pour résoudre des problèmes et contrôler la vraisemblance de so… | `decprob` | ✅ |
| 5e.NC.08 | Connaitre le sens et les situations d’emploi de ces opérations | — | — |
| 5e.NC.09 | Diviser par un nombre décimal | `decdiv` | ✅ |
| 5e.NC.10 | Enchainer des opérations | `prio` | ✅ |
| 5e.NC.11 | Traduire un problème, une succession donnée d’opérations, un programme de calcul, en une seule expression, en … | `tradexpr`, `progcalc` | ✅ |
| 5e.NC.12 | Nommer un calcul, distinguer sommes et produits, termes et facteurs | `tradexpr` | ✅ |
| 5e.NC.13 | Connaitre et utiliser les priorités opératoires | `prio` | ✅ |
| 5e.NC.14 | Connaitre et utiliser la distributivité simple sur des exemples numériques | `distrib` | ✅ |
| 5e.NC.15 | Utiliser les notions de multiples et diviseurs | `multdiv` | ✅ |
| 5e.NC.16 | Connaitre les critères de divisibilité par 3 et par 9 | `divcrit` | ✅ |
| 5e.NC.17 | Mobiliser un algorithme dans le cadre du calcul numérique | — | — |
| 5e.NC.18 | Additionner, soustraire, multiplier des nombres décimaux à une ou deux décimales | `decadd` | ✅ |
| 5e.NC.19 | Savoir que pour compléter une addition à trou, on utilise une soustraction : 2 + ... = 7 se complète en calcul… | `eq1` | ✅ |
| 5e.NC.20 | Définir les nombres relatifs | `relrep` | ✅ |
| 5e.NC.21 | Définir l’opposé et la valeur absolue d’un nombre | `relrep` | ✅ |
| 5e.NC.22 | Définir la notion de nombre positif, strictement positif, négatif, strictement négatif | `relrep` | ✅ |
| 5e.NC.23 | Utiliser les nombres relatifs pour représenter des grandeurs observables qui peuvent prendre des valeurs infér… | `relrep` | ✅ |
| 5e.NC.24 | Lire l’abscisse d’un nombre relatif sur une droite graduée et placer un nombre relatif d’abscisse donnée | `relrep`, `repere` | ✅ |
| 5e.NC.25 | Comparer et ranger dans l’ordre croissant et décroissant des nombres décimaux relatifs | `relrep` | ✅ |
| 5e.NC.26 | Additionner deux nombres décimaux relatifs | `reladd` | ✅ |
| 5e.NC.27 | Additionner plusieurs nombres décimaux relatifs | `reladd` | ✅ |
| 5e.NC.28 | Soustraire deux nombres décimaux relatifs | `reladd` | ✅ |
| 5e.NC.29 | Connaitre et justifier les situations dans lesquelles des parenthèses sont indispensables au sens des écriture… | — | — |
| 5e.NC.30 | Simplifier l’écriture de sommes comportant des parenthèses | `reladd`, `parenth` | ✅ |
| 5e.NC.31 | Enchainer additions et soustractions de décimaux relatifs | `reladd` | ✅ |
| 5e.NC.32 | Résoudre des problèmes mobilisant addition et soustraction de nombres décimaux relatifs | `reladd` | ✅ |
| 5e.NC.33 | Entretenir la connaissance et l’utilisation des tables de multiplication | `automat` | ✅ |
| 5e.NC.34 | Entretenir l’écriture décimale des fractions simples comme | `fracconv` | ✅ |
| 5e.NC.35 | Faire vivre la notion de nombre quotient en complétant des multiplications à trou : 3 × … = 7 puis 3 × = … | `eq1` | ✅ |
| 5e.NC.36 | Lire l’abscisse d’un point sur une droite graduée en tiers, en quarts, en moitiés, en dixièmes | `repere` | ✅ |
| 5e.NC.37 | Reconnaitre des fractions égales : = ; = | `fracsimp` | ✅ |
| 5e.NC.38 | Comparer deux fractions : et ; et ; et ; et | `fracrep` | ✅ |
| 5e.NC.39 | Écrire une fraction sous la forme d’une somme d’un nombre entier et d’une fraction inférieure à 1 : =3+ | `fracconv` | ✅ |
| 5e.NC.40 | Addition et soustraction de fractions simples : + ; 1 – ; – ;3+ ; + | `fracadd` | ✅ |
| 5e.NC.41 | Prendre une fraction simple d’un nombre : le de 18 ; le de 12 | `fractout` | ✅ |
| 5e.NC.42 | Prendre 1 %, 10 % ou 50 % d’un nombre, en lien avec la proportionnalité | `pct`, `prop` | ✅ |
| 5e.NC.43 | Écrire un même nombre sous de multiples formes, par exemple dire que 1,2 = = = 1 + = 120 % = etc | `fracconv` | ✅ |
| 5e.NC.44 | Comparer des fractions | `fracrep` | ✅ |
| 5e.NC.45 | Additionner et soustraire des fractions de dénominateurs quelconques | `fracadd` | ✅ |
| 5e.NC.46 | Résoudre des problèmes avec des additions et soustractions de fractions | `fracadd` | ✅ |
| 5e.NC.47 | Entretenir les tables de multiplications | `automat` | ✅ |
| 5e.NC.48 | Connaitre les unités d’aires et de volume | `uaire`, `uvol` | ✅ |
| 5e.NC.49 | Découvrir la notion de puissance d’un nombre et sa notation dans le cas du carré et du cube | `pow9` | ✅ |
| 5e.NC.50 | Connaitre les carrés des entiers de 0 à 12 | `pow9` | ✅ |
| 5e.NC.51 | Connaitre le cube de 10 | `pow9` | ✅ |
| 5e.NC.52 | Savoir écrire un nombre sous la forme d’une puissance 2 ou 3 | `pow9` | ✅ |
| 5e.NC.53 | Calculer la valeur numérique d’expressions contenant des puissances simples, additions, soustractions et produ… | `pow9`, `valnum` | ✅ |
| 5e.NC.54 | Calculer la valeur d’une expression littérale contenant une puissance simple | `valnum` | ✅ |
| 5e.NC.55 | Identifier des régularités et poursuivre une suite de motifs évolutive | `motifs` | ✅ |
| 5e.NC.56 | Trouver le nombre d’éléments pour une étape donnée dans une suite de motifs évolutive | `motifs` | ✅ |
| 5e.NC.57 | Identifier la structure d’un motif évolutif en repérant une régularité | `motifs` | ✅ |
| 5e.NC.58 | Nombre quotient | `automat` | ✅ |
| 5e.NC.59 | Produire des formules (double, triple, carré, successeur, prédécesseur, aire, périmètre, etc.) | `litelab`, `perim` | ✅ |
| 5e.NC.60 | Calculer la valeur d’une expression littérale par substitution | `valnum` | ✅ |
| 5e.NC.61 | Tester si une égalité entre expressions algébriques comportant une variable est vraie ou fausse | `eqverif` | ✅ |
| 5e.NC.62 | Déterminer si une expression littérale est une somme ou un produit | `structexpr` | ✅ |
| 5e.NC.63 | Exploiter les relations k(a + b) = ka + kb ou k(a – b) = ka – kb pour factoriser, ou développer une expression… | `distrib`, `factor` | ✅ |
| 5e.NC.64 | Réduire une expression littérale de la forme a𝑥 + b, où a et b sont des nombres décimaux | `reduire` | ✅ |
| 5e.NC.65 | Démontrer une propriété générale par le calcul littéral | — | — |
| 5e.NC.66 | Utiliser un contre-exemple pour démontrer qu’une assertion est fausse | — | — |
| 5e.NC.67 | Formuler des conjectures en s’appuyant sur un langage algorithmique ou un tableur | — | — |
| 5e.NC.68 | Donner à la lettre le statut d’inconnue | `probeq` | ✅ |
| 5e.NC.69 | Modéliser des problèmes relevant des opérations à trous par des équations du type a𝑥 = c ou 𝑥 + b = c | `eq1`, `probeq` | ✅ |
| 5e.NC.70 | Résoudre des équations du type a𝑥 = c ou 𝑥 + b = c par des méthodes arithmétiques s'appuyant sur les opération… | `eq1` | ✅ |
| 5e.EG.01 | Placer sur une demi-droite graduée un point dont l’abscisse est un nombre décimal | `repere` | ✅ |
| 5e.EG.02 | Repérer un nombre décimal sur une demi-droite graduée | `repere` | ✅ |
| 5e.EG.03 | Sur une droite graduée : - lire l’abscisse d’un point donné ; - placer un point d’abscisse donnée | `repere` | ✅ |
| 5e.EG.04 | Dans le plan muni d’un repère orthogonal : - lire les coordonnées d’un point donné ; - placer un point de coor… | `repere` | ✅ |
| 5e.EG.05 | Reconnaitre des vues (de dessus, dessous…) d’empilements de cubes | `empil` | ✅ |
| 5e.EG.06 | Dénombrer des cubes dans des empilements | `empil` | ✅ |
| 5e.EG.07 | Reconnaitre un cube, un pavé représenté en perspective cavalière | — | — |
| 5e.EG.08 | Reconnaitre un patron d’un cube | — | — |
| 5e.EG.09 | Construire et mettre en relation différentes représentations en perspectives cavalières des solides suivants :… | `vol` | — |
| 5e.EG.10 | Savoir mettre en relation une représentation en perspective cavalière et un patron d’un pavé, d’un prisme droi… | — | — |
| 5e.EG.11 | Calculer le volume du cube, du pavé droit, du prisme droit | `volpave`, `vol` | ✅ |
| 5e.EG.12 | Connaitre et convertir des unités usuelles (volume et capacité) | `uvol` | ✅ |
| 5e.EG.13 | Calculer l’aire du disque, le volume du cylindre de révolution | `disque`, `vol` | ✅ |
| 5e.EG.14 | Reconnaitre et construire le symétrique d’une figure par symétrie axiale, dont l’axe est vertical, horizontal,… | `symetries` | — |
| 5e.EG.15 | Construire le symétrique, par rapport à un axe, d’un point, d’une figure, sur feuille blanche | `symetries` | — |
| 5e.EG.16 | Définir le demi-tour, ou symétrie centrale | `symetries` | ✅ |
| 5e.EG.17 | Connaitre les propriétés du demi-tour | `symetries` | ✅ |
| 5e.EG.18 | Reconnaitre et citer sur une configuration géométrique des angles : angle plein, plat, nul, droit ; angles opp… | `angtype` | ✅ |
| 5e.EG.19 | Savoir qu’un angle droit mesure 90°, qu’un angle plat mesure 180° | `angtype` | ✅ |
| 5e.EG.20 | Reconnaitre une bissectrice | `bissec6` | ✅ (avant ✗) |
| 5e.EG.21 | Connaitre les mesures des angles de l’équerre dont dispose l’élève (30° 60° 90° ou 45° 45° 90°) | `angtype` | ✅ |
| 5e.EG.22 | Caractériser le parallélisme par les angles : angles alternes internes, angles correspondants | `angles` | ✅ |
| 5e.EG.23 | Reconnaitre un triangle isocèle, équilatéral ou rectangle à partir d’un schéma codé | `angtri` | ✅ |
| 5e.EG.24 | Connaitre la somme des angles d’un triangle, calculer le 3e angle d’un triangle connaissant les mesures des de… | `angtri` | ✅ |
| 5e.EG.25 | Connaitre la notion de médiatrice, de cercle circonscrit | `mediatrice` | ✅ |
| 5e.EG.26 | Connaitre la somme des angles d’un triangle et savoir la démontrer | `angtri` | — |
| 5e.EG.27 | Construire des triangles à partir de données partielles | — | — |
| 5e.EG.28 | Connaitre les propriétés des médiatrices et du cercle circonscrit dans le cas de triangles particuliers | `mediatrice` | ◐ |
| 5e.EG.29 | Calculer l’aire d’un triangle | `aire1`, `hauteurs5` | ✅ |
| 5e.EG.30 | Définir et tracer les hauteurs dans un triangle | `droitesrem` | — |
| 5e.EG.31 | Savoir que les hauteurs d’un triangle sont concourantes | `hauteurs5` | ✅ (avant ✗) |
| 5e.EG.32 | Définir et tracer les médianes dans un triangle | `droitesrem` | — |
| 5e.EG.33 | Démontrer qu’une médiane partage un triangle en deux triangles d’aires égales | — | — |
| 5e.EG.34 | Utiliser ces propriétés dans le cas de triangles particuliers | `angtri` | ✅ |
| 5e.EG.35 | Reconnaitre en justifiant un quadrilatère, un parallélogramme, un rectangle, un losange, un carré, un trapèze,… | `aire3`, `quadri` | — |
| 5e.EG.36 | Exploiter le codage d’une figure pour identifier des parallélogrammes particuliers | `quadri` | ✅ |
| 5e.EG.37 | Définir le parallélogramme | `quadri` | ✅ |
| 5e.EG.38 | Construire des parallélogrammes | — | — |
| 5e.EG.39 | Connaitre les propriétés caractéristiques des côtés opposés et des diagonales | `quadri` | ✅ |
| 5e.EG.40 | Utiliser une propriété caractéristique sur les diagonales ou les côtés pour les construire ou donner la nature… | `quadri` | — |
| 5e.EG.41 | Définir les parallélogrammes particuliers (rectangle, losange, carré) | `quadri` | ✅ |
| 5e.EG.42 | Connaitre les propriétés caractéristiques | `quadri` | ✅ |
| 5e.EG.43 | Savoir calculer l’aire d’un parallélogramme et de figures complexes | `aire2`, `aire3` | ✅ |
| 5e.EG.44 | Résoudre des problèmes faisant appel à des conversions d’unités de longueur et d’unités d’aires | `ulong`, `uaire` | ✅ |
| 5e.DP.01 | Recueillir et organiser des données | — | — |
| 5e.DP.02 | Calculer des effectifs et des fréquences (exprimées sous forme décimale, fractionnaire ou de pourcentage) | `pct`, `statfreq` | ✅ |
| 5e.DP.03 | Lire et interpréter des informations présentées sous forme de tableaux, de diagrammes et de graphiques | `diagr` | ✅ |
| 5e.DP.04 | Représenter, sur papier ou à l’aide d’un tableur-grapheur, des données sous la forme d’un tableau, d’un diagra… | `lectgraph`, `diagr` | — |
| 5e.DP.05 | Choisir une représentation adaptée à ce qu’il convient de mettre en avant | — | — |
| 5e.DP.06 | Calculer et interpréter la moyenne simple d’une série de données | `diagr` | ✅ |
| 5e.DP.07 | Positionner sur une échelle de probabilité les évènements du type : • évènement impossible ; • évènement certa… | `proba` | ✅ |
| 5e.DP.08 | Donner la probabilité sous diverses formes (fraction, décimale, pourcentage) pour les cinq premiers évènements… | `pct`, `proba` | ✅ |
| 5e.DP.09 | Lier l’expression « une chance sur quatre » (par exemple) et la probabilité | `proba` | ✅ |
| 5e.DP.10 | Aborder les questions relatives au hasard à partir de problèmes simples | — | — |
| 5e.DP.11 | Utiliser le vocabulaire des probabilités dans des contextes concrets : expérience aléatoire, issue, évènement | `proba` | ✅ |
| 5e.DP.12 | Attribuer des probabilités dans des cas simples (équiprobabilité) | `proba` | ✅ |
| 5e.DP.13 | Répéter matériellement une expérience aléatoire simple. Enregistrer les résultats observés dans un tableau d’e… | — | — |
| 5e.PF.01 | Reconnaitre si une situation donnée entre dans le cadre de la proportionnalité ou non | `prop` | ✅ |
| 5e.PF.02 | Dans des situations simples, mobiliser une procédure adaptée (propriété de linéarité pour la multiplication ou… | `prop` | ✅ |
| 5e.PF.03 | Utiliser des proportions, des pourcentages | `pct`, `prop` | ✅ |
| 5e.PF.04 | Calculer, appliquer des proportions, des pourcentages | `pct`, `prop` | ✅ |
| 5e.PF.05 | Identifier des situations de proportionnalité dans des contextes concrets (prix, recettes, distances, échelles… | `prop` | ✅ |
| 5e.PF.06 | Utiliser un coefficient de proportionnalité dans des contextes concrets (prix unitaire, vitesse moyenne, échel… | `prop`, `vitesse` | ✅ |
| 5e.PF.07 | Représenter une situation de proportionnalité par un tableau ou un graphique | `prop`, `proptab` | — |
| 5e.PF.08 | Reconnaitre une situation de proportionnalité à partir d’un tableau ou d’un graphique | `prop`, `proptab` | ✅ |
| 5e.PF.09 | Reconnaitre graphiquement qu’un nuage de points est ou n’est pas associé à une situation de proportionnalité e… | `prop` | ✅ |
| 5e.PF.10 | Introduire l’expression : « en fonction de » dans des contextes concrets ou mathématiques | — | — |
| 5e.PF.11 | Produire un tableau de valeurs | `tabform5` | ✅ (avant ✗) |
| 5e.PF.12 | Lire et interpréter un tableau de valeurs | `tabform5` | ✅ (avant ✗) |
| 5e.PF.13 | Placer dans un repère orthogonal donné des points correspondant à un tableau de valeurs | `repere` | ✅ |
| 5e.PF.14 | Lire et interpréter un graphique cartésien donné par une courbe ou un nuage de points | `tabform5` | ✅ (avant ✗) |
| 5e.PF.15 | Traduire la relation de dépendance entre deux grandeurs par un tableau de valeurs à partir d’une formule | `tabform5` | ✅ (avant ✗) |
| 5e.PF.16 | Produire une formule simple représentant la dépendance de deux grandeurs | `litelab` | ✅ |
| 5e.PF.17 | Caractériser graphiquement la proportionnalité | `prop` | ✅ |
| 5e.PI.01 | Manipuler des instructions simples et les séquencer | — | — |
| 5e.PI.02 | Identifier les entrées et sorties d’un programme | — | ✗ |
| 5e.PI.03 | Représenter des formules sous la forme d’une expression informatique dans un langage de programmation par bloc… | — | — |
| 5e.PI.04 | Calculer la valeur de formules à l’aide d’une suite d’instruction dans un langage de programmation par blocs | — | — |
| 5e.PI.05 | Prévoir la valeur d’une expression informatique avant son exécution | — | ✗ |
| 5e.PI.06 | Analyser un programme simple donné et modifier ses paramètres | — | — |
| 5e.PI.07 | Effectuer une boucle inconditionnelle simple permettant de répéter une séquence linéaire d’instructions un nom… | — | — |

## 4e (`4e-2019`, Attendus de fin d'année 2019 (programme 2020), en vigueur en 4e jusqu'en 2026-2027)

| Code | Attendu | Notions | Verdict |
|---|---|---|---|
| 4e-2019.NC.01 | Il utilise les puissances de 10 d’exposants positifs ou négatifs | `puiss` | ✅ |
| 4e-2019.NC.02 | Il associe, dans le cas des nombres décimaux, écriture décimale, écriture fractionnaire et notation scientifiq… | `fracconv`, `sci` | ✅ |
| 4e-2019.NC.03 | Il utilise les préfixes de nano à giga | `sci` | ✅ |
| 4e-2019.NC.04 | Il utilise les carrés parfaits de 1 à 144 | `pow9`, `carres` | ✅ |
| 4e-2019.NC.05 | Il connaît la définition de la racine carrée d’un nombre positif | `carres` | ✅ |
| 4e-2019.NC.06 | Il utilise les puissances d’exposants strictement positifs d’un nombre pour simplifier l’écriture des produits | `puiss` | ✅ |
| 4e-2019.NC.07 | Il utilise des puissances de 10 pour comparer des nombres | `puiss` | ✅ |
| 4e-2019.NC.08 | Il compare, range et encadre des nombres rationnels (positifs ou négatifs) | `relrep` | ✅ |
| 4e-2019.NC.09 | Il encadre la racine carrée d’un nombre positif entre deux entiers | `racenc` | ✅ |
| 4e-2019.NC.10 | Il associe à des objets des ordres de grandeur en lien avec d’autres disciplines | `ordgr` | ✅ |
| 4e-2019.NC.11 | Il effectue avec des nombres décimaux relatifs, des produits et des quotients | `rel` | ✅ |
| 4e-2019.NC.12 | Il calcule avec les nombres rationnels : addition, soustraction, multiplication, division | `fracops` | ✅ |
| 4e-2019.NC.13 | Il utilise l’inverse pour calculer | `fracmul` | ✅ |
| 4e-2019.NC.14 | Il résout des problèmes avec des nombres rationnels | `fracops` | ✅ |
| 4e-2019.NC.15 | Il utilise la calculatrice pour déterminer une valeur approchée de la racine carrée d’un nombre positif | `racenc` | ✅ |
| 4e-2019.NC.16 | Il utilise la racine carrée d’un nombre positif en lien avec des situations géométriques (théorème de Pythagor… | `agrand`, `pyth`, `pythfig` | ✅ |
| 4e-2019.NC.17 | Il utilise les ordres de grandeur pour vérifier ses résultats | `ordgr` | ✅ |
| 4e-2019.NC.18 | Il détermine la liste des nombres premiers inférieurs à 100 | `premiers` | ✅ |
| 4e-2019.NC.19 | Il décompose un nombre entier en produit de facteurs premiers | `premiers` | ✅ |
| 4e-2019.NC.20 | Il utilise les nombres premiers inférieurs à 100 pour : - reconnaître et produire des fractions égales ; - sim… | `premiers`, `fracsimp` | ✅ |
| 4e-2019.NC.21 | Il modélise et résout des problèmes simples mettant en jeu les notions de divisibilité et de nombre premier | `premiers` | ✅ |
| 4e-2019.NC.22 | Il identifie la structure d’une expression littérale (somme, produit) | `structexpr` | ✅ |
| 4e-2019.NC.23 | Il utilise la propriété de distributivité simple pour développer un produit, factoriser une somme ou réduire u… | `reduire`, `distrib` | ✅ |
| 4e-2019.NC.24 | Il démontre l’équivalence de deux programmes de calcul | — | — |
| 4e-2019.NC.25 | Il introduit une lettre pour désigner une valeur inconnue et met un problème en équation | `probeq`, `progcalc` | ✅ |
| 4e-2019.NC.26 | Il teste si un nombre est solution d’une équation | `eqverif` | ✅ |
| 4e-2019.NC.27 | Il résout algébriquement une équation du premier degré | `eq1` | ✅ |
| 4e-2019.DP.01 | Il lit, interprète et représente des données sous forme de diagrammes circulaires | `diagr`, `statfreq` | ✅ |
| 4e-2019.DP.02 | Il calcule et interprète la médiane d’une série de données de petit effectif total | `quartiles` (« Étendue, médiane » en 4e–3e : médiane seulement, sans quartiles, 26.11) | ✅ |
| 4e-2019.DP.03 | Il utilise le vocabulaire des probabilités : expérience aléatoire, issues, événement, probabilité, événement c… | `proba` | ✅ |
| 4e-2019.DP.04 | Il reconnaît des événements contraires et s’en sert pour calculer des probabilités | `proba` | ✅ |
| 4e-2019.DP.05 | Il calcule des probabilités | `proba` | ✅ |
| 4e-2019.DP.06 | Il sait que la probabilité d’un événement est un nombre compris entre 0 et 1 | `proba` | ✅ |
| 4e-2019.DP.07 | Il exprime des probabilités sous diverses formes | `proba` | ✅ |
| 4e-2019.PF.01 | Il reconnaît sur un graphique une situation de proportionnalité ou de non proportionnalité | `prop` | ✅ |
| 4e-2019.PF.02 | Il calcule une quatrième proportionnelle par la procédure de son choix | `prop` | ✅ |
| 4e-2019.PF.03 | Il utilise une formule liant deux grandeurs dans une situation de proportionnalité | `prop` | ✅ |
| 4e-2019.PF.04 | Il résout des problèmes en utilisant la proportionnalité dans le cadre de la géométrie | `prop`, `agrand`, `ratio` | ✅ |
| 4e-2019.PF.05 | Il produit une formule littérale représentant la dépendance de deux grandeurs | `litelab` | ✅ |
| 4e-2019.PF.06 | Il représente la dépendance de deux grandeurs par un graphique | `lectgraph` | ✅ |
| 4e-2019.PF.07 | Il utilise un graphique représentant la dépendance de deux grandeurs pour lire et interpréter différentes vale… | `lectgraph` | ✅ |
| 4e-2019.GM.01 | Il calcule le volume d’une pyramide, d’un cône | `volcone` | ✅ |
| 4e-2019.GM.02 | Il effectue des conversions d’unités sur des grandeurs composées | `ucomp` | ✅ |
| 4e-2019.EG.01 | Il utilise un rapport d’agrandissement ou de réduction pour calculer, des longueurs, des aires, des volumes | `agrand` | ✅ |
| 4e-2019.EG.02 | Il construit un agrandissement ou une réduction d’une figure donnée | `agrand` | — |
| 4e-2019.EG.03 | Il comprend l’effet d’une translation : conservation du parallélisme, des longueurs, des aires et des angles | `symetries` | ✅ |
| 4e-2019.EG.04 | Il utilise le vocabulaire du repérage : abscisse, ordonnée, altitude | `repere` | ✅ |
| 4e-2019.EG.05 | Il se repère dans un pavé droit | — | ✗ |
| 4e-2019.EG.06 | Il construit et met en relation une représentation en perspective cavalière et un patron d’une pyramide, d’un … | — | — |
| 4e-2019.EG.07 | À partir des connaissances suivantes : - les cas d’égalité des triangles ; - le théorème de Thalès et sa récip… | `thales4e`, `cos4e`, `pyth` | ✅ |
| 4e-2019.EG.08 | Il transforme une figure par translation | `symetries` | ✅ |
| 4e-2019.EG.09 | Il identifie des translations dans des frises et des pavages | `symetries` | — |
| 4e-2019.EG.10 | Il mobilise les connaissances des figures, des configurations et de la translation pour déterminer des grandeu… | `symetries` | ✅ |
| 4e-2019.EG.11 | Il mène des raisonnements en utilisant des propriétés des figures, des configurations et de la translation | `symetries` | — |
| 4e-2019.PI.01 | Il réalise des activités d’algorithmique débranchée | — | — |
| 4e-2019.PI.02 | Il met en ordre et/ou complète des blocs fournis par le professeur pour construire un programme simple sur un … | — | — |
| 4e-2019.PI.03 | Il écrit un script de déplacement ou de construction géométrique utilisant des instructions conditionnelles et… | — | — |
| 4e-2019.PI.04 | Il gère le déclenchement d'un script en réponse à un événement | — | — |
| 4e-2019.PI.05 | Il écrit une séquence d’instructions (condition « si … alors » et boucle « répéter … fois ») | — | — |
| 4e-2019.PI.06 | Il intègre une variable dans un programme de déplacement, de construction géométrique ou de calcul | — | — |
| 4e-2019.PI.07 | Il décompose un problème en sous-problèmes et traduit un sous-problème en créant un « bloc-personnalisé » | — | ✗ |
| 4e-2019.PI.08 | Il construit une figure en créant un motif et en le reproduisant à l’aide d’une boucle | — | — |
| 4e-2019.PI.09 | Il utilise simultanément les boucles « Répéter … fois », et « Répéter jusqu’à … » ainsi que les instructions c… | — | — |
| 4e-2019.PI.10 | Il écrit plusieurs scripts fonctionnant en parallèle pour gérer des interactions et créer des jeux | — | — |

## 3e (`3e-2019`, Attendus de fin d'année 2019 (programme 2020), en vigueur en 3e jusqu'en 2027-2028)

| Code | Attendu | Notions | Verdict |
|---|---|---|---|
| 3e-2019.NC.01 | Il utilise les puissances d’exposants positifs ou négatifs pour simplifier l’écriture des produits | `puiss` | ✅ |
| 3e-2019.NC.02 | Il calcule avec les nombres rationnels, notamment dans le cadre de résolution de problèmes | `fracops`, `autodnb` | ✅ |
| 3e-2019.NC.03 | Il résout des problèmes mettant en jeu des racines carrées | `rac` | ✅ |
| 3e-2019.NC.04 | Il résout des problèmes avec des puissances, notamment en utilisant la notation scientifique | `scicalc` | ✅ |
| 3e-2019.NC.05 | Il décompose un nombre entier en produit de facteurs premiers (à la main, à l’aide d’un tableur ou d’un logici… | `premiers` | — |
| 3e-2019.NC.06 | Il simplifie une fraction pour la rendre irréductible | `fracsimp` | ✅ |
| 3e-2019.NC.07 | Il modélise et résout des problèmes mettant en jeu la divisibilité (engrenages, conjonction de phénomènes…) | `premiers`, `divcrit` | ◐ |
| 3e-2019.NC.08 | Il détermine l’opposé d’une expression littérale | `parenth` | ✅ |
| 3e-2019.NC.09 | Il développe (par simple et double distributivités), factorise, réduit des expressions algébriques simples | `reduire`, `distrib`, `factor` | ✅ |
| 3e-2019.NC.10 | Il factorise une expression du type a² − b² et développe des expression du type (a + b)(a - b) | `idrem`, `factor`, `autodnb` | ✅ |
| 3e-2019.NC.11 | Il résout algébriquement différents types d’équations : - équation du premier degré ; - équation s’y ramenant … | `eq1`, `eq2`, `eq2fact` | ✅ |
| 3e-2019.NC.12 | Il résout des problèmes s’y ramenant, qui peuvent être internes aux mathématiques ou en lien avec d’autres dis… | `probeq` | ✅ |
| 3e-2019.DP.01 | Il lit, interprète et représente des données sous forme d’histogrammes pour des classes de même amplitude | `diagr` | ✅ |
| 3e-2019.DP.02 | Il calcule et interprète l’étendue d’une série présentée sous forme de données brutes, d’un tableau, d’un diag… | `quartiles` | ✅ |
| 3e-2019.DP.03 | Il calcule des effectifs et des fréquences | `statfreq` | ✅ |
| 3e-2019.DP.04 | À partir de dénombrements, il calcule des probabilités pour des expériences aléatoires simples à une ou deux é… | `proba` | ✅ |
| 3e-2019.DP.05 | Il fait le lien entre stabilisation des fréquences et probabilités | `proba` | ✅ |
| 3e-2019.PF.01 | Il modélise une situation de proportionnalité à l’aide d’une fonction linéaire | `linfn` | ✅ |
| 3e-2019.PF.02 | Il utilise le lien entre pourcentage d’évolution et coefficient multiplicateur | `pctvar`, `linfn` | ✅ |
| 3e-2019.PF.03 | Il résout des problèmes en utilisant la proportionnalité dans le cadre de la géométrie | `prop` | ✅ |
| 3e-2019.PF.04 | Il utilise les notations et le vocabulaire fonctionnels | `fimg` | ✅ |
| 3e-2019.PF.05 | Il passe d’un mode de représentation d’une fonction à un autre | `fimg` | ✅ |
| 3e-2019.PF.06 | Il détermine, à partir de tous les modes de représentation, l’image d’un nombre | `fimg` | ✅ |
| 3e-2019.PF.07 | Il détermine un antécédent à partir d‘une représentation graphique ou d’un tableau de valeurs d’une fonction | `fimg` | ✅ |
| 3e-2019.PF.08 | Il détermine de manière algébrique l’antécédent par une fonction, dans des cas se ramenant à la résolution d’u… | `fimg` | ✅ |
| 3e-2019.PF.09 | Il représente graphiquement une fonction linéaire, une fonction affine | `affine`, `linfn` | ✅ |
| 3e-2019.PF.10 | Il interprète les paramètres d’une fonction affine suivant l’allure de sa courbe représentative | `affine` | ✅ |
| 3e-2019.PF.11 | Il modélise un phénomène continu par une fonction | `modaff` | ✅ |
| 3e-2019.PF.12 | Il modélise une situation de proportionnalité à l’aide d’une fonction linéaire | `linfn` | ✅ |
| 3e-2019.PF.13 | Il résout des problèmes modélisés par des fonctions en utilisant un ou plusieurs modes de représentation | `fimg` | ✅ |
| 3e-2019.GM.01 | Il calcule le volume d’une boule | `volcone` | ✅ |
| 3e-2019.GM.02 | Il calcule les volumes d’assemblages de solides étudiés au cours du cycle | `volcomp` | ✅ |
| 3e-2019.GM.03 | Il mène des calculs sur des grandeurs mesurables, notamment des grandeurs composées, et exprime les résultats … | `gquot` | ✅ |
| 3e-2019.GM.04 | Il résout des problèmes utilisant les conversions d’unités sur des grandeurs composées | `gquot`, `ucomp` | ✅ |
| 3e-2019.GM.05 | Il vérifie la cohérence des résultats du point de vue des unités pour les calculs de grandeurs simples ou comp… | `ucomp` | ✅ |
| 3e-2019.EG.01 | Il calcule des grandeurs géométriques (longueurs, aires et volumes) en utilisant les transformations (symétrie… | `rotation`, `simil` | ✅ |
| 3e-2019.EG.02 | Il résout des problèmes en utilisant la proportionnalité en géométrie dans le cadre de certaines configuration… | `agrand`, `simil` | ✅ |
| 3e-2019.EG.03 | Il se repère sur une sphère (latitude, longitude) | — | ✗ |
| 3e-2019.EG.04 | Il construit et met en relation différentes représentations des solides étudiés au cours du cycle (représentat… | — | — |
| 3e-2019.EG.05 | À partir des connaissances suivantes : - le théorème de Thalès et sa réciproque dans la configuration papillon… | `rotation`, `thales`, `thalesrec`, `trigo`, `simil` | ✅ |
| 3e-2019.EG.06 | Il identifie des rotations et des homothéties dans des frises, des pavages et des rosaces | `rotation`, `simil` | — |
| 3e-2019.EG.07 | Il mobilise les connaissances des figures, des configurations, de la rotation et de l’homothétie pour détermin… | `rotation`, `simil` | ✅ |
| 3e-2019.EG.08 | Il mène des raisonnements en utilisant des propriétés des figures, des configurations, de la rotation et de l’… | `rotation`, `simil` | — |
| 3e-2019.PI.01 | Il réalise des activités d’algorithmique débranchée | — | — |
| 3e-2019.PI.02 | Il met en ordre et/ou complète des blocs fournis par le professeur pour construire un programme simple sur un … | — | — |
| 3e-2019.PI.03 | Il écrit un script de déplacement ou de construction géométrique utilisant des instructions conditionnelles et… | — | — |
| 3e-2019.PI.04 | Il gère le déclenchement d'un script en réponse à un événement | — | — |
| 3e-2019.PI.05 | Il écrit une séquence d’instructions (condition « si … alors » et boucle « répéter … fois ») | — | — |
| 3e-2019.PI.06 | Il intègre une variable dans un programme de déplacement, de construction géométrique ou de calcul | — | — |
| 3e-2019.PI.07 | Il décompose un problème en sous-problèmes et traduit un sous-problème en créant un « bloc-personnalisé » | — | ✗ |
| 3e-2019.PI.08 | Il construit une figure en créant un motif et en le reproduisant à l’aide d’une boucle | — | — |
| 3e-2019.PI.09 | Il utilise simultanément les boucles « Répéter … fois » et « Répéter jusqu’à … » ainsi que les instructions co… | — | — |
| 3e-2019.PI.10 | Il écrit plusieurs scripts fonctionnant en parallèle pour gérer des interactions et créer des jeux | — | — |

## 2nde (`2nde`, BO n° 14 du 2 avril 2026 : en vigueur dès 2026-2027)

| Code | Attendu | Notions | Verdict |
|---|---|---|---|
| 2nde.AP.01 | Choisir ou déterminer le type d’une variable (entier, flottant ou chaine de caractères) | — | — |
| 2nde.AP.02 | Concevoir et écrire une instruction d’affectation, une séquence d’instructions, une instruction conditionnelle | — | — |
| 2nde.AP.03 | Écrire une formule permettant un calcul combinant des variables | `algopy` | ✅ |
| 2nde.AP.04 | Programmer, dans des cas simples, une boucle bornée, une boucle non bornée | — | — |
| 2nde.AP.05 | Dans des cas plus complexes : lire, comprendre, modifier ou compléter un algorithme ou un programme | — | — |
| 2nde.AP.06 | Écrire des fonctions simples ; lire, comprendre, modifier, compléter des fonctions plus complexes. Appeler une… | `algopy` | ✅ |
| 2nde.AP.07 | Lire et comprendre une fonction renvoyant une moyenne, un écart type. Aucune connaissance sur les listes n’est… | `algopy`, `stats` | ✅ |
| 2nde.AP.08 | Écrire des fonctions renvoyant le résultat numérique d’une expérience aléatoire, d’une répétition d’expérience… | `algopy` | ◐ |
| 2nde.AU.01 | Comparer deux nombres directement ou par calcul : • de leur différence ; • s’ils sont strictement positifs, de… | `compdiff` | ✅ |
| 2nde.AU.02 | Effectuer des opérations et des comparaisons entre des fractions simples | `fracops` | ✅ |
| 2nde.AU.03 | Effectuer des opérations sur les puissances | `puiss` | ✅ |
| 2nde.AU.04 | Passer d’une écriture d’un nombre à une autre (décimale, fractionnaire, pourcentage) | `fracconv` | ✅ |
| 2nde.AU.05 | Estimer un ordre de grandeur | `ordgr` | ✅ |
| 2nde.AU.06 | S’assurer de la vraisemblance, de la cohérence d’un résultat | — | ✗ |
| 2nde.AU.07 | Effectuer des conversions d’unités : longueurs, aires, volumes, contenances, durées, vitesses, masses | `uvol` | ✅ |
| 2nde.AU.08 | Effectuer un calcul littéral élémentaire : • expressions additives : – (a + b) = –a – b, – (a – b) = b – a ; 𝑥… | `parenth` | ✅ |
| 2nde.AU.09 | Développer, factoriser, réduire une expression algébrique simple : • identités (factorisation et développement… | `distrib`, `idrem`, `factor` | ✅ |
| 2nde.AU.10 | Résoudre une équation du type : 𝑥² = a, a𝑥 + b = c𝑥 + d ou = b ou une inéquation du premier degré. 𝑥 | `eq1`, `eq2fact`, `ineq1` | ✅ |
| 2nde.AU.11 | Isoler une variable dans une égalité qui en comporte plusieurs, sur des exemples internes aux mathématiques ou… | `formule` | ✅ |
| 2nde.AU.12 | Effectuer une application numérique d’une formule (notamment pour les formules utilisées dans les autres disci… | `valnum` | ✅ |
| 2nde.AU.13 | Calculer, appliquer, exprimer une proportion sous différentes formes (décimale, fractionnaire, pourcentage) | `pct` | ✅ |
| 2nde.AU.14 | Utiliser une proportion pour calculer une partie connaissant le tout, ou le tout connaissant une partie | `pct` | ✅ |
| 2nde.AU.15 | Passer d’une formulation additive (« augmenter de 5 % », respectivement « diminuer de 5 % ») à une formulation… | `pctvar` | ✅ |
| 2nde.AU.16 | Déterminer graphiquement des images et des antécédents | `fimg` | ✅ |
| 2nde.AU.17 | Exploiter une équation de courbe (appartenance d’un point, calcul de coordonnées) | `fimg` | ✅ |
| 2nde.AU.18 | Reconnaitre l’expression d’une fonction linéaire, d’une fonction affine, savoir que leur représentation graphi… | `affine`, `linfn` | ✅ |
| 2nde.NC.01 | Modéliser et résoudre des problèmes mobilisant les notions de multiple, de diviseur, de nombre pair, de nombre… | `multdiv` | ✅ |
| 2nde.NC.02 | Présenter les fractions sous forme irréductible | `fracsimp` | ✅ |
| 2nde.NC.03 | Lire l’abscisse d’un nombre réel sur une droite graduée et placer un nombre réel d’abscisse donnée | `ensembles` | ✅ |
| 2nde.NC.04 | Représenter un intervalle de la droite numérique. Déterminer si un nombre réel appartient à un intervalle donn… | `ensembles` | — |
| 2nde.NC.05 | Donner un encadrement, d’amplitude donnée, d’un nombre réel par des décimaux | `decarr` | ✅ |
| 2nde.NC.06 | Dans le cadre de la résolution de problèmes, arrondir en donnant le nombre de chiffres significatifs adapté à … | `decarr` | ✅ |
| 2nde.NC.07 | Effectuer des calculs numériques ou littéraux mettant en jeu des puissances, des racines carrées, des écriture… | `fracops`, `puiss`, `rac` | ✅ |
| 2nde.NC.08 | Sur des cas simples de relations entre variables (par exemple U = RI, d =vt, S = πr², V = abc, V = πr²h, expri… | `formule` | ✅ |
| 2nde.NC.09 | Choisir la forme la plus adaptée (factorisée, développée réduite) d’une expression en vue de la résolution d’u… | `factor` | ✅ |
| 2nde.NC.10 | Comparer deux quantités en utilisant leur différence, ou leur rapport (ratio) dans le cas de quantités positiv… | `ratio`, `tauxevol`, `compdiff` | ✅ |
| 2nde.NC.11 | Modéliser un problème par une inéquation | `ineq` | ✅ |
| 2nde.NC.12 | Donner l’ensemble des solutions d’une équation du premier degré du type a𝑥 = b, a + 𝑥 = b, a𝑥 + b = c𝑥 + d, d’… | `eq1`, `eq2fact`, `ineq` | ✅ |
| 2nde.GE.01 | Représenter la somme de deux vecteurs à partir de représentants de même origine | `vect3e` | — |
| 2nde.GE.02 | Représenter un vecteur dont on connait les coordonnées. Lire les coordonnées d’un vecteur | `vect3e` | — |
| 2nde.GE.03 | Calculer les coordonnées d’une somme de vecteurs, d’un produit d’un vecteur par un nombre réel | `vect3e` | ✅ |
| 2nde.GE.04 | Calculer la distance entre deux points. Calculer les coordonnées du milieu d’un segment | `cart` | ✅ |
| 2nde.GE.05 | Caractériser alignement et parallélisme par la colinéarité de vecteurs | `vect3e` | ✅ |
| 2nde.GE.06 | Résoudre des problèmes en utilisant la représentation la plus adaptée des vecteurs | `vect3e`, `vecgeo` | ✅ |
| 2nde.GE.07 | Résoudre des problèmes avec des méthodes diverses (méthodes vectorielles, repérées ou non, méthodes géométriqu… | `vect3e`, `cart` | ✅ |
| 2nde.GE.08 | Déterminer une équation de droite à partir de deux points, un point et un vecteur directeur ou un point et la … | `droites`, `vect3e` | ✅ |
| 2nde.GE.09 | Déterminer la pente ou un vecteur directeur d’une droite donnée par une équation ou une représentation graphiq… | `droites`, `vect3e` | ✅ |
| 2nde.GE.10 | Tracer une droite connaissant son équation cartésienne ou réduite | `droites` | — |
| 2nde.GE.11 | Établir que trois points sont alignés ou non | `droites` | ✅ |
| 2nde.GE.12 | Déterminer si deux droites sont parallèles ou sécantes | `droites` | ✅ |
| 2nde.GE.13 | Déterminer le point d’intersection de deux droites sécantes données par leur équation réduite | `droitesinter` | ✅ |
| 2nde.AN.01 | Exploiter l’équation 𝑦 = ƒ (𝑥) d’une courbe : appartenance, calcul de coordonnées | `fimg` | ✅ |
| 2nde.AN.02 | Modéliser par des fonctions des situations issues des mathématiques, des autres disciplines ou de la vie coura… | `modaff` | ✅ |
| 2nde.AN.03 | Fonctions valeur absolue, carré, inverse : définitions et courbes représentatives | `racinv`, `absval` | ✅ |
| 2nde.AN.04 | Résoudre une équation ou une inéquation du type ƒ (𝑥) = k, ƒ (𝑥) < k, en choisissant une méthode adaptée : gra… | `ineq` | — |
| 2nde.AN.05 | Résoudre une équation ou une inéquation de la forme ƒ (𝑥) = 0, ƒ (𝑥) > 0 à l’aide d’un tableau de signes, lors… | `tabsignes`, `ineq1` | ✅ |
| 2nde.AN.06 | Résoudre, graphiquement ou à l’aide d’un outil numérique, une équation ou inéquation du type ƒ (𝑥) = g (𝑥), ƒ … | `ineq`, `lectgraph` | ✅ |
| 2nde.AN.07 | Pour les fonctions affines, valeur absolue, carré, inverse, racine carrée et cube, résoudre graphiquement ou a… | `ineq`, `racinv`, `absval` | ✅ |
| 2nde.AN.08 | Relier représentation graphique et tableau de variations | `tabvar`, `lectgraph` | ✅ |
| 2nde.AN.09 | Déterminer graphiquement les extrémums d’une fonction sur un intervalle | `tabvar`, `lectgraph` | ✅ |
| 2nde.AN.10 | Exploiter un logiciel de géométrie dynamique ou de calcul formel, la calculatrice ou Python pour décrire les v… | — | — |
| 2nde.AN.11 | Pour une fonction affine, relier sens de variation, signe de la fonction et droite représentative | `affzero` | ✅ |
| 2nde.AN.12 | Traiter de problèmes d’optimisation | `tabvar`, `lectgraph` (`optim` en 1re) | ◐ |
| 2nde.AN.13 | Fonctions valeur absolue, carré : signe et variations | `absval` | ✅ |
| 2nde.AN.14 | Pour deux nombres a et b donnés et une fonction de référence ƒ, comparer ƒ (a) et ƒ (b) numériquement ou graph… | `racinv` | ✅ |
| 2nde.SP.01 | Exploiter la relation entre effectifs, proportions et pourcentages | `pct`, `statfreq` | ✅ |
| 2nde.SP.02 | Traiter des situations simples mettant en jeu des pourcentages de pourcentages | `pctvar` | ✅ |
| 2nde.SP.03 | Exploiter la relation entre deux valeurs successives et leur taux d’évolution | `pctvar` | ✅ |
| 2nde.SP.04 | Calculer le taux d’évolution global à partir des taux d’évolution successifs. Calculer un taux d’évolution réc… | `pctvar` | ✅ |
| 2nde.SP.05 | Pour une série statistique regroupée en classes : • calculer la moyenne à partir de la moyenne et des effectif… | `stats`, `diagr` | ✅ |
| 2nde.SP.06 | Décrire les différences entre deux séries statistiques, en s’appuyant sur des indicateurs ou couples d’indicat… | `stats` | ✅ |
| 2nde.SP.07 | Calculer des fréquences conditionnelles et des fréquences marginales | `probcond` | ✅ |
| 2nde.SP.08 | Compléter un tableau croisé par des raisonnements sur les effectifs ou en utilisant des fréquences conditionne… | — | — |
| 2nde.SP.09 | Observer la loi des grands nombres à l’aide d’une simulation sur Python ou tableur | — | — |
| 2nde.SP.10 | Construire un arbre pondéré ou un tableau en lien avec une situation donnée. Passer du registre de la langue n… | `probcond` | — |
| 2nde.SP.11 | Calculer des probabilités conditionnelles lorsque les évènements sont présentés sous forme de tableau croisé d… | `probcond` | ✅ |
| 2nde.SP.12 | Interpréter les pondérations de chaque branche d’un arbre en termes de probabilités, et notamment de probabili… | `probcond`, `proba2` | ✅ |
| 2nde.SP.13 | Faire le lien entre la définition des probabilités conditionnelles et la multiplication des probabilités des b… | `probcond`, `proba2` | ✅ |
| 2nde.SP.14 | Distinguer en situation PA(B) et PB(A), par exemple dans des situations de type « faux positifs | `probcond` | ✅ |

## 1re spécialité (`1re`, BO n° 14 du 2 avril 2026 : spécialité, en vigueur dès 2026-2027)

| Code | Attendu | Notions | Verdict |
|---|---|---|---|
| 1re.AU.01 | Appliquer un taux d’évolution pour calculer une valeur finale ou initiale | `pctvar` | ✅ |
| 1re.AU.02 | Calculer un taux d’évolution, l’exprimer en pourcentage | `pctvar` | ✅ |
| 1re.AU.03 | Calculer le taux d’évolution équivalent à plusieurs évolutions successives | `pctvar` | ✅ |
| 1re.AU.04 | Calculer un taux d’évolution réciproque | `pctvar` | ✅ |
| 1re.AU.05 | Déterminer les solutions d’une équation produit nul | `eq2` | ✅ |
| 1re.AU.06 | Déterminer le signe d’une expression du premier degré, d’une expression factorisée du second degré | `ineq1`, `affzero`, `ineq2`, `tabsignes` | ✅ |
| 1re.AU.07 | Développer, factoriser, réduire une expression algébrique simple | `distrib`, `factor`, `idrem` | ✅ |
| 1re.AU.08 | Résoudre graphiquement une équation, une inéquation du type : ƒ (𝑥) = k, ƒ (𝑥) < k, etc | `lectgraph` | ✅ |
| 1re.AU.09 | Déterminer graphiquement le signe d’une fonction ou son tableau de variations | `lectgraph`, `tabvar` | ✅ |
| 1re.AU.10 | Tracer une droite donnée par son équation réduite ou par un point et son coefficient directeur | `droites` | — |
| 1re.AU.11 | Lire graphiquement l’équation réduite d’une droite | `droites` | ✅ |
| 1re.AU.12 | Déterminer le coefficient directeur d’une droite à partir des coordonnées de deux de ses points | `droites` | ✅ |
| 1re.AU.13 | Lire un graphique, un histogramme, un diagramme en barres ou circulaire, un diagramme en boite ou toute autre … | `diagr`, `stats`, `quartiles` | ✅ |
| 1re.AU.14 | Passer du graphique aux données et vice-versa | `lectgraph` | ✅ |
| 1re.AU.15 | Calculer et interpréter des indicateurs statistiques pour une série statistique | `stats`, `quartiles` | ✅ |
| 1re.AU.16 | Calculer des probabilités conditionnelles lorsque les évènements sont présentés sous forme de tableau croisé d… | `probcond`, `probtot` | ✅ |
| 1re.AU.17 | Distinguer P(A ∩ B), PA (B), PB (A) | `probcond`, `probtot` | ✅ |
| 1re.AL.01 | Dans le cadre de l’étude d’une suite, utiliser le registre de la langue naturelle, le registre algébrique, le … | `suitedef` | ✅ |
| 1re.AL.02 | Proposer, modéliser une situation permettant de générer une suite de nombres. Déterminer une relation explicit… | `suitedef`, `suitearith`, `suitegeo` | ✅ |
| 1re.AL.03 | Calculer des termes d’une suite définie explicitement, par récurrence ou par un algorithme | — | — |
| 1re.AL.04 | Pour une suite arithmétique ou géométrique, calculer le terme général, la somme de termes consécutifs, détermi… | `suitearith`, `suitegeo`, `suitesomme` | ✅ |
| 1re.AL.05 | Modéliser un phénomène discret à croissance linéaire par une suite arithmétique, un phénomène discret à croiss… | `suitearith`, `suitegeo` | ✅ |
| 1re.AL.06 | Conjecturer, dans des cas simples, la limite éventuelle d’une suite | — | — |
| 1re.AL.07 | Étudier le signe d’une fonction polynôme du second degré donnée sous forme factorisée | `ineq2` | ✅ |
| 1re.AL.08 | Déterminer les fonctions polynômes du second degré s’annulant en deux nombres réels distincts | `trinfact` | ✅ |
| 1re.AL.09 | Factoriser une fonction polynôme du second degré, en diversifiant les stratégies : racine évidente, détection … | `trinfact` | ✅ |
| 1re.AL.10 | Choisir une forme adaptée (développée réduite, canonique, factorisée) d’une fonction polynôme du second degré … | `eq2disc`, `f2formes`, `optim`, `inter` | ✅ |
| 1re.AN.01 | Calculer un taux de variation, la pente d’une sécante | `tauxvar` | ✅ |
| 1re.AN.02 | Interpréter le nombre dérivé en contexte : pente d’une tangente, vitesse instantanée, cout marginal, etc | `nbderive`, `tangente` | ✅ |
| 1re.AN.03 | Déterminer graphiquement un nombre dérivé par la pente de la tangente. Construire la tangente en un point à un… | — | — |
| 1re.AN.04 | Déterminer l’équation de la tangente en un point à la courbe représentative d’une fonction | `tangente` | ✅ |
| 1re.AN.05 | Calculer une valeur approchée de ƒ (a + h) | `tangente` | ◐ |
| 1re.AN.06 | Dans des cas simples, calculer une fonction dérivée en utilisant les propriétés des opérations sur les fonctio… | `derivref`, `derivregles`, `derivprodquot` | ✅ |
| 1re.AN.07 | Étudier les variations d’une fonction. Déterminer les extrémums | `variations` | ✅ |
| 1re.AN.08 | Résoudre un problème d’optimisation | `optimderiv`, `optim` | ✅ |
| 1re.AN.09 | Exploiter les variations d’une fonction pour établir une inégalité. Étudier la position relative de deux courb… | `variations`, `posrelc` | ✅ |
| 1re.AN.10 | Étudier, en lien avec la dérivation, une fonction polynôme du second degré : variations, extrémum, allure selo… | `variations`, `f2` | ✅ |
| 1re.AN.11 | Transformer une expression en utilisant les propriétés algébriques de la fonction exponentielle | `expfn` | ✅ |
| 1re.AN.12 | Pour a réel, dérivée de la fonction t ↦ e^(at) | `expderiv` | ✅ |
| 1re.AN.13 | Pour une valeur numérique strictement positive de k, représenter graphiquement les fonctions t ↦ e^(–kt) et t … | `expderiv` | ◐ |
| 1re.AN.14 | Modéliser une situation par une croissance, une décroissance exponentielle (par exemple évolution d’un capital… | `expderiv`, `suitegeo` | ✅ |
| 1re.AN.15 | Placer un point sur le cercle trigonométrique | `trigrad` | ✅ |
| 1re.AN.16 | Par lecture du cercle trigonométrique, déterminer, pour des valeurs remarquables de 𝑥, les cosinus et sinus d’… | `trigrad` | ✅ |
| 1re.GE.01 | Utiliser le produit scalaire pour démontrer une orthogonalité, pour calculer un angle, une longueur dans le pl… | `vecteurs`, `sinlaw` | — |
| 1re.GE.02 | En vue de la résolution d’un problème, calculer le produit scalaire de deux vecteurs en choisissant une méthod… | `pscal` | ✅ |
| 1re.GE.03 | Utiliser le produit scalaire pour résoudre un problème géométrique | `pscal` | ✅ |
| 1re.GE.04 | Déterminer une équation cartésienne d’une droite connaissant un point et un vecteur normal | `droitenorm` | ✅ |
| 1re.GE.05 | Déterminer les coordonnées du projeté orthogonal d’un point sur une droite | `droitenorm` | ✅ |
| 1re.GE.06 | Déterminer et utiliser l’équation d’un cercle donné par son centre et son rayon | `cercle` | ✅ |
| 1re.GE.07 | Reconnaitre une équation de cercle, déterminer centre et rayon | `cercle` | ✅ |
| 1re.GE.08 | Utiliser un repère pour étudier une configuration | `droitenorm`, `pscal`, `cart` | ◐ |
| 1re.SP.01 | Dans des cas simples, calculer une probabilité à l’aide de la formule des probabilités totales | `probtot`, `condbayes` | ✅ |
| 1re.SP.02 | Savoir utiliser ou justifier l’indépendance de deux évènements | — | — |
| 1re.SP.03 | Représenter la succession de deux épreuves indépendantes par un arbre ou un tableau | — | — |
| 1re.SP.04 | Pour 𝑛 ⩽ 4, représenter l’arbre associé à la répétition de 𝑛 épreuves de Bernoulli indépendantes et identiques… | `probarbre` | ◐ |
| 1re.SP.05 | Interpréter en situation et utiliser les notations {X = a}, {X ⩽ a}, P(X = a), P(X ⩽ a). Passer du registre de… | — | — |
| 1re.SP.06 | Modéliser une situation à l’aide d’une variable aléatoire | — | — |
| 1re.SP.07 | Déterminer la loi de probabilité d’une variable aléatoire | `vaesp`, `varalea` | ✅ |
| 1re.SP.08 | Calculer une espérance, une variance, un écart type | `vaesp`, `varalea` | ✅ |
| 1re.SP.09 | Utiliser la notion d’espérance dans une résolution de problème (mise pour un jeu équitable, etc.) | `vaesp`, `varalea` | ✅ |

## Tle spécialité (`Tle`, BO n° 14 du 2 avril 2026 : spécialité, en vigueur dès 2027-2028 (programme 2019 en 2026-2027))

| Code | Attendu | Notions | Verdict |
|---|---|---|---|
| Tle.AP.01 | Générer une liste (en extension, par ajouts successifs ou en compréhension) | — | — |
| Tle.AP.02 | Manipuler des éléments d’une liste (ajouter, supprimer, etc.) et leurs indices | — | — |
| Tle.AP.03 | Parcourir une liste | — | — |
| Tle.AP.04 | Itérer sur les éléments d’une liste | — | — |
| Tle.AG.01 | Dans le cadre d’un problème de dénombrement, utiliser une représentation adaptée (ensembles, arbres, tableaux,… | `denombr`, `combi` | ✅ |
| Tle.AG.02 | Effectuer des dénombrements simples dans des situations issues de divers domaines scientifiques (informatique,… | `denombr`, `combi` | ✅ |
| Tle.AG.03 | Représenter des combinaisons linéaires de vecteurs donnés | — | — |
| Tle.AG.04 | Exploiter une figure pour exprimer un vecteur comme combinaison linéaire de vecteurs | `colin` | ✅ |
| Tle.AG.05 | Décrire la position relative de deux droites, d’une droite et d’un plan, de deux plans | `posrel` | ✅ |
| Tle.AG.06 | Lire sur une figure si deux vecteurs d’un plan, trois vecteurs de l’espace, forment une base | `colin` | ◐ |
| Tle.AG.07 | Lire sur une figure la décomposition d'un vecteur dans une base | `colin` | ✅ |
| Tle.AG.08 | Étudier géométriquement des problèmes simples de configurations dans l’espace (alignement, colinéarité, parall… | `colin`, `vect3d` | ✅ |
| Tle.AG.09 | Utiliser le produit scalaire pour démontrer une orthogonalité, la perpendicularité de deux plans, pour calcule… | — | — |
| Tle.AG.10 | Utiliser la projection orthogonale pour déterminer la distance d’un point à une droite ou à un plan | `distances`, `pscal3d` | ✅ |
| Tle.AG.11 | Résoudre des problèmes impliquant des grandeurs et mesures : longueur, angle, aire, volume | `distances` | ✅ |
| Tle.AG.12 | Étudier des problèmes de configuration dans l’espace : orthogonalité de deux droites, d’une droite et d’un pla… | `pscal3d`, `plans` | ◐ |
| Tle.AG.13 | Déterminer une représentation paramétrique d’une droite. Reconnaitre une droite donnée par une représentation … | `droite3d` | ✅ |
| Tle.AG.14 | Déterminer l’équation cartésienne d’un plan dont on connait un vecteur normal et un point. Reconnaitre un plan… | `plans` | ✅ |
| Tle.AG.15 | Déterminer les coordonnées du projeté orthogonal d’un point sur un plan donné par une équation cartésienne, ou… | `pscal3d`, `distances` | ✅ |
| Tle.AG.16 | Dans un cadre géométrique repéré, traduire par un système d’équations linéaires des problèmes de types suivant… | `posrel`, `colin` | ✅ |
| Tle.AN.01 | Établir la convergence d’une suite, ou sa divergence vers + ∞ ou – ∞ | `suitelim` | ✅ |
| Tle.AN.02 | Raisonner par récurrence pour établir une propriété d’une suite | `recurrence` | ✅ |
| Tle.AN.03 | Étudier des phénomènes d’évolution modélisables par une suite | `suitelim`, `suitegeo` | ✅ |
| Tle.AN.04 | Déterminer dans des cas simples la limite d’une suite ou d’une fonction en un point, en ± ∞, en utilisant les … | `limites`, `limitinf`, `suitelim` | ✅ |
| Tle.AN.05 | Faire le lien entre l’existence d’une asymptote parallèle à un axe et celle de la limite correspondante | `asymptotes` | ✅ |
| Tle.AN.06 | Calculer la dérivée d’une fonction donnée par une formule simple mettant en jeu opérations algébriques et comp… | `derivcomp`, `lnexp` | ✅ |
| Tle.AN.07 | Calculer la fonction dérivée, déterminer les limites et étudier les variations d'une fonction construite simpl… | — | — |
| Tle.AN.08 | Démontrer des inégalités en utilisant la convexité d’une fonction | — | — |
| Tle.AN.09 | Esquisser l’allure de la courbe représentative d’une fonction ƒ à partir de la donnée de tableaux de variation… | — | — |
| Tle.AN.10 | Lire sur une représentation graphique de 𝑓 , de 𝑓 ’ ou de 𝑓 ’’ les intervalles où 𝑓 est convexe, concave, et l… | `derivseconde` | ✅ |
| Tle.AN.11 | Étudier les solutions d’une équation du type ƒ (𝑥) = k : existence, unicité, encadrement | `tvi` | ✅ |
| Tle.AN.12 | Pour une fonction continue ƒ d’un intervalle dans lui-même, étudier une suite définie par une relation de récu… | `tvi`, `suitelim` | ◐ |
| Tle.AN.13 | Utiliser l’équation fonctionnelle de l’exponentielle ou du logarithme pour transformer une écriture, résoudre … | `lnfr`, `lnexp` | ✅ |
| Tle.AN.14 | Dans le cadre d’une résolution de problème, utiliser les propriétés des fonctions exponentielle et logarithme | `lnfr`, `etudelnexp`, `croissance` | ✅ |
| Tle.AN.15 | Lier la représentation graphique des fonctions sinus et cosinus et le cercle trigonométrique | `trigfr` | ✅ |
| Tle.AN.16 | Traduire graphiquement la parité et la périodicité des fonctions sinus et cosinus | `trigfr` | ✅ |
| Tle.AN.17 | Résoudre une équation du type cos(𝑥) = a, une inéquation de la forme cos(𝑥) ⩽ a sur [-π,π] | `trigfr` | ✅ |
| Tle.AN.18 | Dans le cadre de la résolution de problème, notamment géométrique, étudier une fonction simple définie à parti… | `trigfr` | ✅ |
| Tle.AN.19 | Calculer une primitive en utilisant les primitives de référence et les fonctions de la forme (v’ ○ u) × u’ | `primitives` | ✅ |
| Tle.AN.20 | Pour une équation différentielle 𝑦’ = a𝑦 + b (a ≠ 0) : déterminer une solution particulière constante ; utilis… | `eqdiff` | ✅ |
| Tle.AN.21 | Pour une équation différentielle 𝑦’ = a𝑦 + 𝑓 : à partir de la donnée d’une solution particulière, déterminer t… | `eqdiff` | ✅ (avant ◐) |
| Tle.AN.22 | Estimer graphiquement ou encadrer une intégrale, une valeur moyenne | `integrale` | ✅ |
| Tle.AN.23 | Calculer une intégrale à l’aide d’une primitive, à l’aide d’une intégration par parties | `integrale`, `intparties` | ✅ |
| Tle.AN.24 | Majorer (minorer) une intégrale à partir d'une majoration (minoration) d'une fonction par une autre fonction | `intmaj` | ✅ |
| Tle.AN.25 | Calculer l’aire entre deux courbes | `aireint` | ✅ |
| Tle.AN.26 | Étudier une suite d’intégrales, vérifiant éventuellement une relation de récurrence | `suiteint` | ✅ |
| Tle.AN.27 | Interpréter une intégrale, une valeur moyenne dans un contexte issu d’une autre discipline | `integrale` | ✅ |
| Tle.SP.01 | Modéliser une situation par une succession d’épreuves indépendantes, ou une succession de deux ou trois épreuv… | `probarbre`, `binom` | ✅ |
| Tle.SP.02 | Modéliser une situation par un schéma de Bernoulli, par une loi binomiale | `binom`, `binomiale` | ✅ |
| Tle.SP.03 | Utiliser l’expression de la loi binomiale pour résoudre un problème de seuil, de comparaison, d’optimisation r… | `binom`, `binomiale` | ✅ |
| Tle.SP.04 | Dans le cadre d’une résolution de problème modélisé par une variable binomiale X, calculer numériquement une p… | — | — |
| Tle.SP.05 | Représenter une variable comme somme de variables aléatoires plus simples | — | — |
| Tle.SP.06 | Calculer l’espérance d’une variable aléatoire, notamment en utilisant la propriété de linéarité | `sommeva` | ✅ |
| Tle.SP.07 | Calculer la variance d’une variable aléatoire, notamment en l’exprimant comme somme de variables aléatoires in… | `sommeva` | ✅ |

## Méthode (pour refaire le calcul)

1. Instantané du catalogue : page de sonde (non commitée) qui charge les sources dans l'ordre de `build.py` et écrit
   `OK {"notions": [...], "cat": {"6": [[id, 1 si de l'année, thème], …], …}}` pour les profils `{ system: "FR", grade: 6…12 }`
   (`Engine.catalog`) ; Chromium sans interface (`--dump-dom`), une page à la fois, verrou de `tools/run_tests.sh`.
2. `python3 tools/france_couverture.py avant.json apres.json > tools/france_couverture.md`.
3. La table `MAP` du script corrige la correspondance attendu → notions du JSON (périmée depuis le 23.11) ; `PARTIEL` et
   `NS` sont des jugements de l'agent, à relire.

## Ce qui a été fait (25.11, branche agent/frcouv)

- **Rattachées** (attendu contrôlé forme par forme ; formes hors programme écartées par `HORS_FR`, `src/fr_couv.js`) :
  1re : `tauxvar`, `nbderive`, `derivref` (sans exposants rationnels ; sin/cos en Tle), `derivregles`, `derivprodquot`,
  `tangente` (Newton en Tle), `variations`, `optimderiv`, `probarbre`, `condbayes`, `varalea` ; Tle : `derivcomp`,
  `derivseconde`, `limites`, `limitinf`, `asymptotes` (sans asymptote oblique), `continuite`, `etudefct`, `lnexp`,
  `etudelnexp`, `croissance`, `primitives` (sans x^(3/2)), `eqdiff` (sans variables séparables), `integrale`, `aireint`,
  `intparties` (sans e^x cos x), `combi` (sans le jass), `binomiale`, `vect3d`, `colin`, `droite3d`, `plans`, `posrel`,
  `pscal3d`, `distances` ; 2nde : `probaxiomes` ; 3e : `ineq1` (programme 2026, fin d'année), `proba2` (effacées par
  `applyFrCollege` depuis le 23.11).
- **Retirées** du catalogue français : `sinlaw`, `recip`, `expo`, `modexp`, `trigcercle`, `trigassoc`, `trigfn`, `trigeq`
  (degrés), `log` (log₂), `vecteurs` (« composantes »). Non rattachées : `sphere`, `volrev`, `intsubst`, `normale`,
  `statdesc`, `matrices`… (hors programme français).
- **Créées** (3 niveaux, ≥ 3 formes par niveau, pas à pas, pièges, contextes, leçon, compétences ; défi de niveau 4
  pour `expderiv`, `trigrad`, `autodnb`, `tabvar`, `lnfr`) : 1re `expderiv`, `trigrad`, `droitenorm` (`src/fr_1re.js`) ;
  4e `cos4e`, `thales4e` ; 3e `linfn`, `autodnb`, `vecgeo` ; 2nde `tabvar` (`src/fr_3e.js`) ; Tle `lnfr`, `trigfr`, `tvi`,
  `sommeva`, `recurrence` (`src/fr_tle.js`).
- **Niveau** : `UPFR` (`src/fr_couv.js`, lu par `Engine.make`) relève le niveau 1 des notions reprises d'une année
  inférieure en 4e, 3e, 2nde et 1re (sonde `tests/_niv_fr.html` : « 3² », « 5 − 7 », « 50 % de 260 », « 4(2x + 2 ) »…) ;
  automatismes de l'épreuve anticipée repris en 1re (`againFR` 11). Profils suisses inchangés (test `tests/france.html`).
- **Vocabulaire** (`frLocal`) : y = mx + p, « côtés de l'angle droit » (cathètes), « ensemble de définition ».

## Ce qui a été fait (25.11 au soir, branche agent/frfin)

- **Créées** (`src/fr_fin.js` ; 3 niveaux, ≥ 3 formes par niveau, pas à pas, pièges, contextes, leçon, compétences, défi de
  niveau 4 ; leçon active à curseurs dans `src/fr_act.js`) : 6e `symax` (symétrie axiale : axes d'une figure, conservation,
  quadrillage, droite graduée), `mediatrice` (équidistance, milieu, cercle circonscrit), `echelle6` (plans, cartes,
  maquettes ; la notion suisse `echelle` mélange aires × k² et volumes × k³, de 4e), `proba6` (dé, sac, roue, fréquences ;
  `proba`, de 5e, a deux dés et des tirages sans remise) ; 5e `empil` (empilements de cubes, vues de dessus, de face, de
  droite) ; 2nde `compdiff` (comparer par différence ou par quotient) ; 1re `posrelc` (position relative de deux courbes,
  signe de f − g) ; Tle `intmaj` (majorer, encadrer une intégrale, rectangles), `suiteint` (suites d'intégrales).
- **Rattachée** : `progcalc` (programmes de calcul) passe de la 4e à la 5e (5e.NC.11), reprise en 4e et 3e ; formes de 4e
  écartées en 5e par `HORS_FR` (nombre négatif multiplié, (x + a)², (x + a)(x − a)), deux formes de 5e ajoutées au niveau 3 ;
  niveau 1 relevé en 4e (`UPFR`).
- **Notes sur 20** : pour un profil français, `FR_NOTES` (lu par `Engine.finalize`) remplace les questions à notes suisses
  (1 à 6) de `statfreq`, `stats`, `diagr`, `probeq` par des questions de même niveau et de même graine, notes sur 20.
- Contrôle : `tests/frfin.html` (générateurs, défis, classes, progcalc en 5e, notes), `tests/act_frfin.html` (leçons actives).

## Ce qui a été fait (25.11, branche agent/trous)

- **Créées** (`src/fr_trous.js` ; 3 niveaux, ≥ 3 formes par niveau, pas à pas, pièges, contextes, leçon, compétences, défi
  de niveau 4, leçon active « À toi : 2 questions ») : 6e `cercle6` (distance à un point, cercle et disque comme ensembles
  de points, EG.01, 04, 05), `bissec6` (bissectrice : calculs d'angles, EG.11–12 ; reprise en 5e pour EG.20), `filtre6`
  (filtrer un tableau selon un ou plusieurs critères, DP.04) ; 5e `tabform5` (formules, tableaux de valeurs et graphiques
  sans la notation f(x), PF.11, 12, 14, 15), `hauteurs5` (aire, deux hauteurs, triangle obtus, orthocentre, EG.29–31).
- **Étendue** : `eqdiff` reçoit trois formes y' = ay + f (solution particulière donnée, affine, exponentielle) : Tle.AN.21
  complet (formes partagées avec la 4e MA2 du Collège).
- Contrôle : `tests/trous.html` (générateurs, classes, séparation des systèmes), `tests/act_trous.html` (leçons actives).

## Ce qui a été fait (26.11, branche agent/frlycee : audit du lycée, `tools/archive/audit_fr_lycee_26-11.md`)

- **Placement** : `optim` (sommet d'un trinôme) et `inter` (intersection parabole–droite, discriminant) passent de 2nde en
  1re (chapitre « Second degré ») ; `vecteurs` (notion suisse : composantes, produit scalaire) reste hors du catalogue
  français, la ligne morte qui la plaçait en 1re (`fr_2nde.js`) est supprimée : les vecteurs de 2nde sont `vect3e`
  (+ forme « norme » créée), `cart` (distance, milieu), `vecgeo`.
- **Formes écartées** (HORS_FR, `src/fr_couv.js`) : en 2nde, trinômes à factoriser (`eq2fact`, `fimg`), 12/x = x − 1
  (`racinv`), système de deux équations cartésiennes (`droites`), triangle rectangle par le produit scalaire (`cart`) ;
  partout en France, équations à radical (√x = x − 12) et forme canonique dans le cas général (`f2formes`, a ≠ 1).
- **Vocabulaire** : racine(s) au lycée (au lieu de « zéro(s) »), courbe (graphe), axe des abscisses / des ordonnées,
  coordonnées (composantes), ordonnée à l'origine p, produit × hors produit scalaire ; libellés français (`labelFR`).
- 2nde.AN.12 (optimisation) passe en ◐ : en 2nde, extremums lus sur un graphique ou un tableau de variations seulement.
- Contrôle : `tests/frplace.html`.

## Ce qui reste

- 6e : constructions (bissectrice, cercles) : non saisissables.
- 4e–3e : repérage dans un pavé droit, sur une sphère (latitude, longitude).
- 2nde : algorithmique de simulation (AP.08).
- 1re : arbre de n ⩽ 4 épreuves de Bernoulli
  (SP.04, en partie dans `probarbre`) ; tracé des courbes de e^(kt) (AN.13, non saisissable).
- Tle : Python (listes) hors périmètre.
- Programmes 2026 de 4e (2027-2028) et de 3e (2028-2029) : `vecgeo` et `ineq1` sont déjà en fin de 3e.

