# Parcours EVACOM 11e (chantier L, 24.11.2026)

Usage interne. Les épreuves et champs cités sont des documents du DIP (Genève) ou de collègues :
on en tire la **forme** (structure, types de questions, niveau), **rien n'est recopié** dans l'app
(énoncés, contextes et valeurs sont écrits à neuf et tirés au hasard).

## Sources lues

| Source | Ce qu'on en tire |
|---|---|
| `~/Dropbox/2026-2027/Bude/EVACOM/champ-evacom-ma-11ls.pdf` (DGEO, 17.06.2026) | **Champ 2026-27, 11e LS** : lundi 31.05.2027, 95 min, 2 parties (une sans, une avec calculatrice), règle graduée, aucun document ni aide-mémoire, 20 % du T3 ; 2 pts d'écriture mathématique, 1 pt d'arrondis intermédiaires ; valeur exacte (π, racine) puis valeur approchée |
| `~/DATA/Enseignement/TI - EVACOM/Anciennes Evacom/2023/EVACOM MA11LS-2023.pdf` (+ critères) | Format le plus récent : partie 1 = 50 min sans calculatrice, partie 2 avec ; 14 questions, 59 pts ; consignes « fausses égalités sanctionnées », « réponse sans justification = 0 » |
| idem `2022/` (11LS, parties 1 et 2, critères) et `2016-17/` (11LS 2017) | Mêmes familles de questions, même niveau |
| `…/Anciennes Evacom/2024/champ-evacom-ma-11ls.pdf` | Champ 2023-24 (février, T2) : comparaison avec 2026-27 |
| `~/DATA/Enseignement/Sources/Officiel/PER/3.Champ-des-EVACOM-Maths-2015-2016.pdf`, `Livres Cycle/EVACOM/champs_14-15.pdf` | Historique (anciennes parties communes / spécifiques) |
| `~/Dropbox/2026-2027/Bude/11LS/Revision EVACOM/` (dossier de l'enseignant, `intro.typ`, `t7-evacom-blanches.typ`) | Analyse des points par thème 2017 / 2022 / 2023, grille « Je sais… », deux EVACOM blanches : modèle de répartition |

## Structure de l'épreuve (11e LS, 2026-27)

- **95 minutes**, deux parties :
  - **Partie 1 — 50 min, sans calculatrice** (≈ 29 pts sur 59 en 2023) ;
  - **Partie 2 — 45 min, calculatrice autorisée** (≈ 27 pts) ; + 2 pts écriture, + 1 pt arrondis.
- Pas de document, pas d'aide-mémoire : les formules (aires, volumes) doivent être sues.
- Calculatrice : Sharp EL-W531TG-WH, TI-30X Plus MathPrint ou équivalent (partie 2 seulement).

### Types d'items observés (2017, 2022, 2023)

Partie 1 : calculs de fractions (fraction irréductible ou entier, priorités, relatifs, puissances) ·
racines sous la forme a√b ou a∛b · « mets une croix devant la proposition correcte » (identités,
notation scientifique, formules de volume, racines) · expression littérale réduite d'une aire ·
« est-ce que −3 est solution ? justifie » · nommer un solide d'après sa description ou son
développement · solide composé ou grandeur manquante avec π ≈ 3 · développer, factoriser.

Partie 2 : QCM sur Pythagore (énoncé, réciproque) · conversion d'unités + grandeur manquante (aire du
losange…) · « identifie l'inconnue et pose l'équation (sans résoudre) » · résoudre une équation (fractions,
cas sans solution) · aire ou volume d'un solide réel avec arrondi demandé (coût, croquis) · problèmes
« concrets » (échelle contre un mur, débit, vitesse).

### Poids des thèmes (points hors écriture et arrondis, d'après l'analyse de l'enseignant)

| Thème | 2017 | 2022 | 2023 |
|---|---|---|---|
| Nombres (fractions, racines, notation scientifique) | 12 | 14 | 10 |
| Calcul littéral | 27 | 17 | 11 |
| Équations 1er degré, mise en équation | 12 | 7 | 8 |
| Solides (nommer, aires, volumes, composés) | 25 | 13 | 19 |
| Pythagore | 4 | 6 | 3 |

**Ajouts 2026-27** (absents des anciennes épreuves) : proportionnalité (quantités, agrandissement-réduction,
vitesse moyenne, débit, masse volumique), équations du 2e degré par factorisation (et mise en équation),
Thalès (application directe). Hors champ : systèmes, fonctions, transformations, probabilités.

## Sujet blanc retenu dans l'app (`src/riche_11c.js`, section « Parcours EVACOM »)

14 questions, au format de l'épreuve, **sans barème** (décision de l'enseignant : on compte les questions).

| # | Partie 1 — 50 min, sans calculatrice | # | Partie 2 — 45 min, calculatrice |
|---|---|---|---|
| 1 | Fractions : 3 calculs → fraction irréductible ou entier | 8 | Pythagore : QCM, échelle, réciproque, diagonale du pavé |
| 2 | Racines : a√b, a∛b, somme ; encadrer, ranger | 9 | Mise en équation (sans résoudre, ou résoudre ; 2e degré) |
| 3 | QCM « mets une croix » (4 items) | 10 | Résoudre une équation (fractions, cas particuliers) |
| 4 | Développer et réduire (2 expressions) | 11 | Solide réel : aire, volume, coût, arrondi demandé |
| 5 | Factoriser au maximum (4 expressions) | 12 | Grandeurs quotients : débit, vitesse, masse volumique |
| 6 | Solution d'une équation, 2e degré par factorisation, formule | 13 | Thalès (application directe) |
| 7 | Nommer des solides, π ≈ 3, aire littérale, preuve | 14 | Proportionnalité : échelle, agrandissement, devise, calculatrice |

Chaque emplacement a 3 ou 4 formes ; les formes du sujet précédent sont évitées, les valeurs et
contextes sont tirés (graine). Répartition voisine de 2023 + les trois ajouts du champ 2026-27.

## Points à contrôler par l'enseignant

- Le champ est celui de la **section LS** ; l'app ne connaît pas la section (11e = LS, LC, CT confondues).
- Niveau des formes « exigeantes » (rangement de racines, preuve) par rapport à l'épreuve réelle.
- Libellés des solides acceptés (le corrigé reprend les tolérances des critères : « pavé droit » = parallélépipède rectangle).
