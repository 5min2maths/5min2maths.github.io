# « Trouve l'erreur » (chantier I)

Un camarade (Sam, Lina, Noé, Inès, Yanis ou Léa) a fait une faute typique ; l'élève la repère et donne le bon résultat.
Forme : `ctx: "erreur"`, correction qui nomme l'erreur, guide de 1 à 3 étapes, piège = le résultat faux du camarade.
Test : `tests/trouve_erreur.html` (chaque forme tirée 50 fois, rendu à 360 px, passage par `Engine.build`).

## Formes déjà présentes avant le 24.11 (suite)

11e : proportionnalité (`utemps`, `ucomp`, `vitesse`, `gquot`), calcul littéral (`reduire`, `parenth`), Thalès,
Pythagore, puissances, probabilités, pente (ch11_fct.js) ; 1re : équations (`ch1c_eq`), trigonométrie,
systèmes, sommet.

## Ajoutées le 24.11 (32 formes, toutes au niveau 2)

| Année | Notion | Fichier | Erreur visée |
|---|---|---|---|
| 9e | `prio` | ch11_no.js | soustraction faite avant la multiplication : a − b·(c + d) = (a − b)·(c + d) |
| 9e | `reladd` | ch10_no.js | soustraire un négatif : a − (−b) = a − b |
| 9e | `fracadd` | ch11_no.js | numérateurs et dénominateurs additionnés : a/b + c/d = (a + c)/(b + d) |
| 9e | `decmul` | ch10_no.js | décimales d'un produit : 0,7 · 0,4 = 2,8 (une seule décimale gardée) |
| 9e | `pow9` | variantes.js | priorité de la puissance : a · b² = (ab)² |
| 9e | `aire1` | variantes.js | aire du triangle sans diviser par 2 |
| 9e | `fractout` | variantes.js | fraction d'une quantité : N : a · b au lieu de N : b · a |
| 9e | `dec10` | variantes.js | « ajouter des zéros » après la virgule : 3,45 · 100 = 3,4500 |
| 9e | `uaire` | variantes.js | unités d'aire avec le facteur des longueurs : 1 m² = 100 cm² |
| 9e | `perim` | variantes.js | confusion aire / périmètre (clôture = L · l) |
| 10e | `fracmul` | ch11_no.js | division sans l'inverse : a/b : c/d = a/b · c/d |
| 10e | `scicalc` | ch11_no.js | quotient de puissances de 10 : exposant m + n au lieu de m − n (n négatif) |
| 10e | `rac` | ch11_no2.js | √(a + b) = √a + √b |
| 10e | `pctvar` | ch11_no2.js | +t % puis −t % « s'annulent » |
| 10e | `monomes` | ch11_litt.js | exposants multipliés dans un produit : x³ · x⁵ = x¹⁵ |
| 10e | `distrib` | ch11_litt.js | signe devant la parenthèse : −k(ax − b) = −kax − kb |
| 10e | `pct` | variantes.js | retrouver le tout : on prend t % de la partie |
| 10e | `disque` | variantes.js | aire avec le diamètre : π · d² |
| 10e | `echelle` | variantes.js | conversion cm → km avec 1 km = 1000 cm |
| 11e | `idrem` | ch11_litt.js | (a + b)² = a² + b² |
| 11e | `volcone` | ch11_gm.js | volume du cône sans le tiers (volume du cylindre) |
| 11e | `simil` | ch11_thales.js | aire multipliée par k au lieu de k² |
| 11e | `eq2` | ch1c_eq.js | division par x : solution x = 0 perdue (ax² = bx) |
| 11e | `formule` | ch1c_eq.js | lettre au dénominateur mal isolée (t = v · d, h = A/(2b), R = U · I) |
| 1re | `polyop` | ch1c_alg.js | −(x − b)² : seul le premier terme change de signe |
| 1re | `fimg` | ch1c_fct.js | −(−k)² calculé comme +k² |
| 1re | `ineq` | ch1c_sys.js | division par un négatif sans retourner le sens |
| 1re | `ineq2` | ch1c_f2b.js | x² > k² « donc x > k » (solutions négatives oubliées) |
| 2e | `sinlaw` | ch_mp2.js | théorème du cosinus : racine carrée oubliée (c au lieu de c²) |
| 2e | `expo` | variantes.js | a · b^x = (ab)^x |
| 2e | `log` | variantes.js | log(ab) = log a · log b |
| 2e | `modexp` | variantes.js | pourcentages successifs additionnés (n · t % au lieu de (1 + t)ⁿ) |

Remarques
- `uaire` n'avait pas de variantes : la forme d'origine est remise dans la liste (`() => GEN.uaire(2)`) pour que
  l'erreur sorte une fois sur trois, pas une fois sur deux.
- Notions de `variantes.js` : ajout par `VA` (la forme s'ajoute aux variantes du niveau 2).
