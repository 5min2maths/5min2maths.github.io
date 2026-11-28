# /contenu nickel 10e, chapitre 9 Équations + correctif 9e — 28.11.2026 (branche `agent/contenu8`)

Références : plan de cheminement 10e (1er degré, mise en équation, pas de double distributivité), étalons E10-9-1 à
E10-9-4 (`niveau_910.md` § 2), MER 10e `ch07_10FAC_Equations` (FA179 QSJ, FA190–FA228) et MER 9e `ch06_9FAB_Calcul_litteral`
(FA61–FA83) : données, rien d'exécuté. Aucun fichier de notes ni donnée d'élève ouvert.

Notions (`CO_BY` 10C09) : eqverif, eq1, eqfrac, probeq. Mesure : sonde non commitée `tests/_nickel10_ch9.html` (profil CH
10e, `Engine.make`, 200 tirages par notion et par niveau).

## Défauts trouvés (avant)

1. **Sujet de préparation de 10e = banque de 1re Collège** : `richChapter` donnait `RICH.eq1c` (2e degré, bicarrées,
   racines, discriminant) à une 10e.
2. **Manques du MER 10e** : aucune équation impossible ni indéterminée en 10e (FA198–FA200 en ont), pas de « − » devant
   une parenthèse (E10-9-1, FA198 j), pas de x² qui s'annulent par simple distributivité (FA198 i, FA226 h) ; problèmes
   sans têtes et pattes, billets, angles, âges (FA205–FA219).
3. eqverif 2 : une seule forme (« lequel de ces nombres ? »), avec « 5x = 4x » ; eq1 3 : 3 formes.
4. eq1 2 « trouve l'erreur » : « Noé résout … ainsi : x = 11, donc x = 11 » quand le coefficient vaut 1 (`ch1c_eq.js`,
   aussi en 11e et en 1re Collège).
5. **9e** : le sujet de 9C10 (litelab, valnum) tirait `RICH.litt11` (double distributivité, identités, factorisation).

## Liste de contrôle par notion (avant → après)

| Notion | Avant | Après |
|---|---|---|
| eqverif | N2 : 1 forme, sans ctx | N2 + 3 formes de 10e (tous les nombres solutions, trouver c pour que −3 soit solution, combien d'équations vérifiées) : 12 formes, 3 ctx. N1 (3 formes, sans étiquette ctx) et N3 (x², comme FA192) inchangés |
| eq1 | N2 : 3 ctx ; N3 : 3 formes ; rien d'impossible / indéterminé | N2 + « − » devant une parenthèse, impossible / tous (réponse « aucune » / « tous »), x² qui s'annulent : 7 ctx ; N3 + décimaux et deux parenthèses, x² des deux côtés : 5 ctx ; rappel de 10e (TXT_CO) avec ces cas ; erreur « x = …, donc x = … » corrigée |
| eqfrac | N2 3 ctx | N2 + « au tiers ajoutez k, vous aurez la moitié » (FA216) ; défi « partage » (FA217) : 4 ctx au défi |
| probeq | N2 4 ctx, N3 5 ctx, défi : 3 fois « deux tarifs » | N2 + têtes et pattes / pièces / spectateurs, angles (triangle, triangle rectangle) : 9 ctx ; N3 + âge du capitaine, prix du billet : 7 ctx ; défi « coffre » (FA219) |

Pas à pas sur 100 % des questions des niveaux 1–3, pièges sur toutes les formes nouvelles (jamais égaux à la réponse),
corrigés recalculés indépendamment (équations relues dans l'énoncé et évaluées par `Expr`, 200 graines). Figures : aucune
ajoutée (aucune ne serait utile sans faire la mise en équation). Rien de 11e : pas de 2e degré à résoudre, pas de double
distributivité, pas de formule à transformer.

## Tests de préparation

- **`RICH.eq10`** (`src/riche_10.js`, `grades: [10]`) : 6 exercices — Le prix du billet (FA205), Combien de chaque sorte ?
  (têtes et pattes, pièces, billets ; « oublier les parenthèses »), Angles et côtés (FA208–FA209), Résous et vérifie
  (« − » devant une parenthèse, décimaux, impossible, indéterminée), Le tiers et la moitié (FA216, « multiplier chaque
  terme »), Est-ce une solution ? (FA191–FA192, x² testé, paramètre) ; 5 raisonnements — Cherche l'erreur (trois erreurs
  types : diviser un seul terme, changer de membre sans changer le signe, oublier de distribuer), Vrai ou faux, Équivalentes
  mais comment ? (FA196), Trouve la bonne traduction (FA207), Construis une équation. Cases T1–T6 ✓ ; T7 à faire.
- **`RICH.litt9`** (`src/riche_9.js`, `grades: [9]`) : 6 exercices — Les machines à calculer (FA64), Phrases et expressions
  (FA63, FA65), Le rectangle (FA62, figure qui porte les cotes), Le pavé droit (E9-10-1, E9-10-2), Degrés Fahrenheit (FA80,
  donnée inutile), Les boîtes (FA81) ; 4 raisonnements — Trouve l'erreur (substitutions fautives : « 5x pour x = 2,5 »
  = 52,5…), Vrai ou faux, Égales ? (FA70), Somme ou produit ? (FA72). Sans produit de relatifs, réduction ni distributivité.

## Banques d'une autre classe (9e et 10e, profil de la classe)

Branchés : 9C10 → litt9, 10C09 → eq10 (tous les autres chapitres de 9e et 10C01–04, 07, 10, 12–14 l'étaient déjà).
**Restent** : 10C05 Unités (prop11, 11e), 10C06 Puissances et racines (no1c, 1re Collège), 10C08 Pythagore (pyth11, 11e),
10C11 Fonctions (fct11, 11e) → à traiter à leur « nickel ».

## Fichiers

`src/riche_10.js` (RICH.eq10), `src/riche_9.js` (RICH.litt9), `src/variantes.js` (section « nickel 10e, chapitre 9 »),
`src/engine.js` (TXT_CO[10].eq1), `src/ch1c_eq.js` (une condition : a − c ≥ 2 dans « trouve l'erreur »). `richChapter`
pas touché (le champ `grades` suffit). Tests : `tests/parcours.html#section=nickel10_ch9` (nouvelle section ; `nickel10_ch7`
attend maintenant litt9 en 9e), `tests/riche910.html` (9C10 → litt9, 10C09 → eq10).

## Reste / à décider

- Défis eqfrac « robinets, peintres, imprimantes » (1/a + 1/b) en 10e : gardés (faisables), mais plutôt 11e ?
- eqverif 1 : 3 formes sans étiquette ctx (liste `ref_formes.js`).
- Contrôle par l'enseignant (case 15, T7) : imprimer un sujet de 10e « Équations » et un sujet de 9e « Calcul littéral ».
