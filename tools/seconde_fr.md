# Seconde générale et technologique (France) : correspondance avec 5min2maths

Préparé le 23.11.2026 (branche `agent/fr2nde`). Source : programme de mathématiques de seconde GT, **BO n° 14 du
2 avril 2026, en vigueur dès 2026-2027** (`~/DATA/Enseignement/Sources/Officiel/France/lycee_2026_2nde_GT.pdf`, extrait dans
`tools/referentiels_fr.json`, clé `2nde`). Analyse générale de la France : `tools/couverture_fr.md`.

Codage de l'app : la France est le système `FR` ; `FR: [10, rang]` = notion qui apparaît en **seconde**
(6e = 6 … 3e = 9, 2nde = 10, 1re = 11, Tle = 12) ; `againFR: [10]` (nouveau, 22.11) = notion d'une classe antérieure que le
programme de seconde reprend (automatismes surtout) : elle est « de l'année » pour un élève de seconde. Les placements et les
reprises de seconde sont dans `src/fr_2nde.js` (table `FR_2NDE`), appliqués au chargement : aucune ligne de `curriculum.js` n'est
modifiée (l'agent « France collège » y renseigne 6e–3e).

## 1. Correspondance attendu par attendu

Légende : ✅ couvert ; 🟡 couvert avec écart (vocabulaire, notation, niveau) ; 🆕 notion créée le 23.11 ; ✗ non saisissable
(construction, programmation, démonstration) ou pas couvert.

### Automatismes (partie 1 de l'épreuve anticipée de 1re : sans calculatrice)

| Code | Capacité (abrégée) | Notion(s) | État |
|---|---|---|---|
| AU.01 | Comparer deux nombres par différence ou quotient | `tauxevol` (niv. 1) | 🆕 |
| AU.02 | Fractions simples : opérations, comparaisons | `fracops`, `fracadd`, `fracmul` | ✅ |
| AU.03 | Opérations sur les puissances | `puiss` | 🟡 point médian · au lieu de × |
| AU.04 | Écritures décimale, fractionnaire, pourcentage | `fracconv` | ✅ |
| AU.05 | Ordre de grandeur | `ordgr` | ✅ |
| AU.06 | Vraisemblance d'un résultat | — | ✗ (diffus) |
| AU.07 | Conversions d'unités | `uvol`, `ucomp`, `utemps` | ✅ |
| AU.08 | Calcul littéral élémentaire : −(a − b), x/a, a/b ÷ c/d | `parenth`, `fracmul` | ✅ |
| AU.09 | Développer, factoriser, identités | `distrib`, `idrem`, `factor` | 🟡 « mettre en évidence » → « factoriser » |
| AU.10 | x² = a, ax + b = cx + d, a/x = b, inéquation du 1er degré | `eq1`, `eq2fact`, `ineq1`, `ineq`, `racinv` | 🆕 `ineq1` |
| AU.11 | Isoler une variable | `formule` | ✅ |
| AU.12 | Application numérique d'une formule | `valnum` | ✅ |
| AU.13–14 | Proportion : partie, tout | `pct`, `fractout` | ✅ |
| AU.15 | « Augmenter de 5 % » = « multiplier par 1,05 » | `pctvar`, `tauxevol` | 🆕 vocabulaire CM |
| AU.16–17 | Images et antécédents graphiques, équation de courbe | `fimg`, `lectgraph` | 🟡 « préimage » → « antécédent » |
| AU.18 | Fonctions linéaire et affine, droite | `affine` | 🟡 « pente » (2026) = coefficient directeur |

### Nombres et calculs

| Code | Capacité | Notion(s) | État |
|---|---|---|---|
| NC.01 | Multiples, diviseurs, pair, impair | `multdiv`, `premiers` | ✅ |
| NC.02 | Fraction irréductible | `fracsimp` | 🟡 « simplifier au maximum » → « rendre irréductible » |
| NC.03 | Abscisse d'un réel sur une droite graduée | `ensembles`, `relrep` | ✅ |
| NC.04 | Intervalles, appartenance | `ensembles` | ✅ notation [a ; b[ identique |
| NC.05–06 | Encadrement, arrondi, chiffres significatifs | `decarr`, `racenc` | 🟡 pas de « chiffres significatifs » |
| NC.07 | Puissances, racines, fractions | `puiss`, `rac`, `fracops` | ✅ |
| NC.08 | Exprimer une variable (U = RI, V = πr²h, ax + by = c) | `formule` | ✅ |
| NC.09 | Choisir la forme adaptée | `factor`, `distrib` | ✅ |
| NC.10 | Comparer par différence ou ratio, variation additive / multiplicative | `tauxevol` | 🆕 |
| NC.11 | Modéliser par une inéquation | `ineq1` (niv. 3), `ineq` | 🆕 |
| NC.12 | Ensemble des solutions : ax = b, ax + b ≥ cx + d, x² = a | `eq1`, `ineq1`, `ineq`, `eq2fact` | 🆕 « S = … » |

### Géométrie

| Code | Capacité | Notion(s) | État |
|---|---|---|---|
| GE.01–02 | Représenter une somme, un vecteur ; lire ses coordonnées | `vect3e` (lecture sur quadrillage) | 🆕 (construction ✗) |
| GE.03 | Coordonnées d'une somme, de k·u | `vect3e` | 🆕 |
| GE.04 | Distance, milieu | `cart` | ✅ |
| GE.05 | Alignement, parallélisme par colinéarité (déterminant) | `vect3e` (niv. 3) | 🆕 |
| GE.06–07 | Problèmes vectoriels | `vect3e` (parallélogramme, Chasles) | 🆕 partiel |
| GE.08–09 | Équation de droite : deux points, point + vecteur directeur, point + pente | `droites` | 🟡 pas de vecteur directeur ni d'équation cartésienne |
| GE.10 | Tracer une droite | — | ✗ |
| GE.11–12 | Alignement, parallèles ou sécantes | `droites`, `vect3e` | ✅ |
| GE.13 | Intersection de deux droites (équations réduites) | `droitesinter` | ✅ (sans « système » : par égalisation) |

### Fonctions

| Code | Capacité | Notion(s) | État |
|---|---|---|---|
| AN.01 | Équation y = f(x) : appartenance, coordonnées | `fimg` | 🟡 antécédent |
| AN.02 | Modéliser par une fonction | `modaff` | 🟡 contextes CHF |
| AN.03 | Valeur absolue, carré, inverse : définitions, courbes | `fref`, `absval`, `racinv` | 🆕 |
| AN.04 | f(x) = k, f(x) < k : méthode adaptée | `fref`, `lectgraph` | 🆕 |
| AN.05 | **Tableau de signes** d'un produit ou d'un quotient | `tabsignes` | 🆕 (absent de l'app) |
| AN.06 | f(x) = g(x), f(x) < g(x) graphiquement | `lectgraph` (niv. 3), `inter` | ✅ |
| AN.07 | Fonctions de référence : f(x) = k, f(x) < k | `fref`, `racinv`, `absval` | 🆕 |
| AN.08–09 | Tableau de variations, extrémums | `lectgraph` | 🟡 pas de tableau de variations dessiné |
| AN.10 | Variations avec un logiciel, Python | — | ✗ |
| AN.11 | Affine : sens de variation, signe, droite | `affzero` | ✅ |
| AN.12 | Optimisation | `optim` | ✅ |
| AN.13 | Valeur absolue, carré : signe et variations | `fref`, `absval` | 🆕 |
| AN.14 | Comparer f(a) et f(b) pour une fonction de référence | `fref` | 🆕 |

### Statistiques et probabilités

| Code | Capacité | Notion(s) | État |
|---|---|---|---|
| SP.01 | Effectifs, proportions, pourcentages | `pct`, `statfreq` | ✅ |
| SP.02 | Pourcentages de pourcentages | `tauxevol` (niv. 2) | 🆕 |
| SP.03 | Valeurs successives et taux d'évolution | `tauxevol`, `pctvar` | 🆕 coefficient multiplicateur |
| SP.04 | Taux global, taux réciproque | `tauxevol` (niv. 3), `pctvar` | 🆕 |
| SP.05 | Séries en classes : moyenne (centres), classe médiane | `diagr` | 🟡 pas de classes ; à étoffer |
| SP.06 | Comparer deux séries (moyenne–écart type, médiane–écart interquartile) | `stats`, `quartiles` | ✅ |
| SP.07 | Fréquences conditionnelles et marginales | `probcond` (niv. 1) | 🆕 |
| SP.08 | Compléter un tableau croisé | `probcond` (case manquante) | 🆕 |
| SP.09 | Loi des grands nombres (simulation) | — | ✗ |
| SP.10 | Arbre pondéré, tableau ; langue ↔ symboles | `probcond`, `proba2` | 🆕 (construction ✗) |
| SP.11–13 | P_A(B) par tableau ou arbre ; produit des branches | `probcond`, `proba2` | 🆕 |
| SP.14 | Distinguer P_A(B) et P_B(A) (faux positifs) | `probcond` (niv. 3) | 🆕 |

### Algorithmique et programmation (Python)

| Code | Capacité | Notion(s) | État |
|---|---|---|---|
| AP.01–02, AP.04 | Types, affectation, conditionnelle, boucles (écrire) | `algopy` (lire et exécuter) | 🆕 lecture seulement |
| AP.03 | Formule combinant des variables | `algopy` (niv. 1) | 🆕 |
| AP.05–06 | Lire, compléter une fonction ; l'appeler | `algopy` | 🆕 |
| AP.07 | Fonction moyenne, écart type | `stats` | ✅ |
| AP.08 | Fonction simulant une expérience aléatoire | — | ✗ |

**Bilan** : 79 attendus, 66 saisissables. Avant : 57 rattachés (86 %), mais 9 non couverts, dont deux thèmes entiers
(croisement de deux variables, probabilités conditionnelles) et le tableau de signes. Après les 8 notions : **64 / 66 (97 %)**
(restent AU.06 et SP.05 en classes, et les capacités non saisissables).

## 2. Écarts (Suisse → France), notion par notion

- **Vocabulaire**. `fimg` dit « préimage » (France : **antécédent**) ; `factor` dit parfois « mettre en évidence » (France :
  **factoriser**) ; `fracsimp` « simplifier au maximum » (France : **rendre irréductible**) ; `affine` « pente » (accepté en
  2026, mais les manuels disent **coefficient directeur**) ; `droites` « y = mx + h » (France : **y = mx + p**, équation réduite) ;
  `proba` « événement » (France 2026 : **évènement**, les deux sont corrects). Les nouvelles notions emploient le vocabulaire
  français. Pour les notions suisses, il faudrait une variante de libellé par système (champ `labelFR` ?) et un filtre de mots
  au rendu (« préimage » → « antécédent ») : **pas fait** (décision à prendre : filtre global ou variantes d'énoncés).
- **Monnaie et contextes**. `pctvar`, `modaff`, `affzero`, `ineq`, `droites` ont des contextes en CHF (et parfois Genève,
  CFF). Un élève français verrait des francs suisses. Les nouvelles notions utilisent l'euro et des villes françaises.
  À régler : un filtre « CHF → € » au rendu pour le système FR suffirait pour la plupart des énoncés (ordres de grandeur
  voisins), les noms de lieux suisses restant rares.
- **Milliers**. L'app écrit `1'200` (`\text{'}` dans les formules, codé en dur dans chaque générateur : `N()` de `ch10_no.js`,
  `ch11_gm.js`, `ch1c_sys.js`, `riche.js`…). La France écrit **1 200** (espace fine). **Il manquait un réglage par système** :
  ajouté le 23.11, `frThou()` dans `app.js`, appelé par le préfiltre MathJax (`divSign`), remplace `\text{'}` par `\,` quand le
  profil est français. Reste à faire : les apostrophes écrites hors formules (texte simple, rares) et `qcm.js` (`thou`). La saisie
  « 1 200 » est déjà acceptée par le correcteur (`expr.js`). Les nouvelles notions écrivent directement l'espace fine.
- **Unités**. L'app met déjà une espace fine avant les unités dans les formules (`\,\%`, `\ \text{cm}`) : conforme.
- **Multiplication**. Les notions suisses écrivent `\cdot` (point médian) ; la France écrit ×. Les nouvelles notions
  écrivent `\times`. Pour les anciennes : filtre au rendu possible (`\cdot` → `\times` entre deux nombres), à décider.
- **Division**. Le filtre `divSign` (« : » → ÷) convient aussi en France.
- **Intervalles**. Le programme 2026 écrit [a, b] ; les manuels et l'app écrivent [a ; b] (préférable avec la virgule
  décimale). Le correcteur accepte les deux. Ensemble des solutions : « S = … » (France) ; l'app demande « l'ensemble des
  solutions », compatible.
- **Calculatrice**. Les automatismes sont sans calculatrice (épreuve anticipée) : le réglage « sans calculatrice » colle.
- **Algorithmique**. Python au lycée. `algopy` affiche de courts programmes Python et demande ce qu'ils renvoient : la
  saisie reste un nombre.
- **Systèmes d'équations** : supprimés du programme 2026 de seconde → `sys2`, `sys3`, `sysprob`, `sysgraph` : `FR: null`
  (masqués) ; `eq3` (degré 3) passe de `[10, 3]` à `[12]` (terminale) ; `vecteurs` (norme, **produit scalaire**) passe en 1re
  (`[11]`) : la seconde a `vect3e`. Attention : la table de `couverture_fr.md` proposait `vecteurs` en 3e (programme 2026) ;
  le produit scalaire n'y est pas, d'où ce choix (à harmoniser avec l'agent « collège »).
- **Placement** : 12 notions existantes placées en seconde (`FR_2NDE` dans `fr_2nde.js` : ensembles, formule, ineq,
  absval, racinv, affzero, inter, optim, cart, droites, droitesinter, stats) ; 33 notions du collège marquées « reprises en
  seconde » (`againFR: [10]` : automatismes et rappels). Pour une notion sans place française, une classe d'origine par défaut
  est mise (d'après `couverture_fr.md`), seulement si l'agent « collège » ne l'a pas déjà fixée.

## 3. Notions manquantes, par priorité (et ce qui a été fait)

| # | Id | Notion | Attendus | Fait le 23.11 |
|---|---|---|---|---|
| 1 | `probcond` | Tableau croisé, fréquences conditionnelles et marginales, P_A(B), arbre pondéré, faux positifs | SP.07–SP.14 | ✅ |
| 2 | `tabsignes` | Tableau de signes d'un produit ou d'un quotient de facteurs affines ; inéquations produit et quotient | AN.05 | ✅ |
| 3 | `tauxevol` | Comparer par différence ou quotient, coefficient multiplicateur, évolutions successives, taux réciproque | AU.01, AU.15, NC.10, SP.02–SP.04 | ✅ |
| 4 | `vect3e` | Vecteurs : lecture, coordonnées de AB, somme, k·u, Chasles, parallélogramme, colinéarité (déterminant), alignement | GE.01–GE.07, GE.11 | ✅ |
| 5 | `fref` | Fonctions de référence (carré, inverse, racine, cube, valeur absolue) : comparer f(a) et f(b), x² ≤ k, 1/x > k | AN.03, AN.07, AN.13, AN.14 | ✅ |
| 6 | `ineq1` | Inéquations du 1er degré « marche collège » : tester une valeur, résoudre, intervalle, modéliser | AU.10, NC.11, NC.12 (et 3e 2026) | ✅ |
| 7 | `proba2` | Évènement contraire, deux épreuves (arbre, tableau), A ∪ B et A ∩ B | SP.10–SP.13 (et 4e, 3e) | ✅ |
| 8 | `algopy` | Lire un programme Python (affectations, si/sinon, boucle for/while, fonction) et donner le résultat | AP.03–AP.06 | ✅ |
| 9 | `statclasses` | Séries regroupées en classes : moyenne avec les centres, classe médiane | SP.05 | à faire |
| 10 | `droitescart` | Équation cartésienne, vecteur directeur, passage cartésienne ↔ réduite | GE.08–GE.10 | à faire |
| 11 | `chsig` | Chiffres significatifs, arrondi adapté | NC.06 | à faire (petit) |

## 4. Réglages par système à décider

1. **Montrer la France** : `SYSTEMS.FR` reste commenté dans `curriculum.js` (bêta genevoise). Pour tester sans l'ouvrir au
   public, le profil `{ system: "FR", grade: 10 }` fonctionne dans le moteur (voir `tests/fr2nde.html`).
2. **Milliers** : filtre au rendu `frThou()` branché (sans effet tant que la France est masquée) ; texte simple et `qcm.js` à suivre.
3. **CHF → €** et **préimage → antécédent** : filtre au rendu ou variantes d'énoncés.
4. **`again` par système** : `again` (années suisses) était lu aussi pour un profil français (en seconde, grade 10, une
   notion avec `again: [10]` suisse devenait « de l'année ») ; corrigé : pour la France, l'app lit `againFR`.
5. **Ordre et chapitres** : `ORDRE.FR` et `ORDRE_THEME.FR` (chapitres de seconde : Nombres et calculs, Géométrie,
   Fonctions, Statistiques et probabilités, Algorithmique) ajoutés ; `Engine.refOf` rend « FR » pour un profil français.
