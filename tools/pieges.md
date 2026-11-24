# Pièges (erreurs typiques) — audit du 24.11

Contexte : un testeur a tapé 40° pour l'angle intérieur d'un ennéagone (c'est l'angle au centre) et n'a eu
aucun message. Retour : « les erreurs fréquentes méritent un message précis ». Quand l'élève se trompe,
`diagnose` (src/expr.js) cherche d'abord dans `q.traps` ; sans piège, il ne reste que les diagnostics
génériques (signe, virgule, fraction inversée…).

## Méthode

Page de sonde `tests/_pieges_audit.html` (non commitée) : pour chaque notion et chaque niveau 1–3,
20 tirages `Engine.build` (mesure « élève », variantes comprises) + 8 tirages de chaque forme
(générateur d'origine et chaque variante de `VAR`). Compte les questions à réponse numérique
(`value` ou ensemble de solutions `set`) qui n'ont **aucun** piège valable (différent de la réponse).

## Couverture : % de questions avec au moins un piège

| Classe | Questions tirées | Avant | Après |
|---|---|---|---|
| 9e | 2568 | 92 % | 99 % |
| 10e | 1741 | 94 % | 100 % |
| 11e | 1163 | 100 % | 100 % |
| 1re Collège | 1319 | 95 % | 100 % |
| 2e Collège | 1435 | 37 % | 98 % |
| 3e Collège | 1115 | 100 % | 100 % |
| 4e Collège | 943 | 100 % | 100 % |
| MP 1re | 2199 | 99 % | 100 % |
| MP 2e | 903 | 93 % | 100 % |
| MP 3e | 711 | 100 % | 100 % |
| MP 4e | 463 | 100 % | 100 % |
| **Total** | 12875 | 90,2 % | 99,6 % |

(Une notion compte dans chaque classe où elle est introduite, CH et MP.)

Avant : 81 couples notion-niveau et 132 formes sans aucun piège. Après : 9 couples, 11 formes, tous
volontairement laissés : questions de comptage (« combien de ces angles sont aigus », « combien de
fonctions injectives », longueur d'une période) où un piège n'aurait pas de sens, ou tirages où le seul
piège tombe par hasard sur la réponse (filtré).

## Ajouts : 150 formes de générateurs (≈ 250 pièges)

### 9e – 10e
- **pct 1** : « n : p » au lieu de p % ; ce qui reste après la baisse au lieu de p % de n.
- **prop 1–3** : prix de k objets multiplié par n ; ajout de la différence (raisonnement additif) ;
  rapport inversé ; facteur 1/p oublié ; conversion CHF → € par multiplication au lieu de division.
- **echelle 1–3** : longueur en cm non convertie ; 1 m = 1000 cm ; aire × k au lieu de k² ; volume × k
  ou × k² au lieu de k³.
- **arith 1–3** (PGDC / PPMC, bus, pavage) : confusion PGDC / PPMC ; produit des deux nombres.
- **diagr 1–3** : somme non divisée ; médiane au lieu de moyenne ; pourcentage au lieu de l'angle
  (100 au lieu de 360°) ; moyenne non pondérée ; division par le nombre de notes au lieu du nombre d'élèves.
- **disque 1–3** : aire / périmètre (πr² ↔ 2πr) ; facteur 2 oublié (πr) ; diamètre pris pour le rayon ;
  aire du disque entier / longueur du cercle entier au lieu du secteur / de l'arc ; arc ↔ aire du secteur.
- **polyreg 1, 3** : angle intérieur ↔ angle au centre ; 180° au lieu de 360° ; 360 divisé par l'angle
  intérieur ; angle au centre rendu au lieu du nombre de côtés.
- **decread 2–3, decarr 3** : zéro de position oublié (pas de centièmes / dixièmes) ; centièmes pris pour
  des dixièmes ou des millièmes ; virgule déplacée d'un mauvais nombre de rangs ; arrondi dans le mauvais
  sens, au mauvais rang (centaine / dizaine / unité).
- **fracper 1–3** (et variantes) : partie entière, reste, numérateur pris pour la période ; rang pair /
  impair ; dixièmes au lieu de neuvièmes ; 99 / 100 ; partie entière oubliée ; 90 / 99.
- **solides 3, quadri 3** : sommets d'une seule base ; bases à n + 2 côtés ; diagonale entière au lieu
  de la moitié.
- **grandmanq 3, airelat 2–3** : aire non doublée ; volume au lieu de l'aire latérale ; facteur 2 oublié
  dans 2πr ; aire latérale seule ; une seule base.
- **eqverif 3** : une seule solution testée.

### 1re – 2e Collège, MP 2e
- **optim 1–3** (16 situations) : signe de −b/(2a) ; facteur 2 oublié ; abscisse du sommet rendue au lieu
  de la valeur maximale (et l'inverse) ; côté / largeur rendu au lieu de l'aire ; terrasse contre une
  façade traitée comme un carré ; baisse rendue au lieu du prix ; nombre ajouté au lieu du total ;
  produit minimal positif.
- **modexp** (et variantes) : intérêts simples au lieu de composés ; une année de moins ; 2n au lieu de 2ⁿ
  (3k au lieu de 3ᵏ) ; nombre de périodes confondu avec la durée ; demi-vie.
- **expo 1–3, log 1–3, logbase 1–3** (et variantes) : racine oubliée (b^{1/2}) ; signe de l'exposant
  (fraction 1/…) ; 2x non divisé par 2 ; x + k non isolé ; ln c : ln b inversé ; c : b ;
  log(a + b) au lieu de log(a·b) ; log(a − b) ; produit / quotient non passé au log ; ln ↔ log ;
  intérêts simples ; intérêt au lieu du capital.
- **expfrac 1–3** : base × exposant ; racine sans la puissance ; exposant négatif pris pour un signe ;
  inverse oublié ; exposants multipliés au lieu d'additionnés ; quotient.
- **compo, recip 1–2, homogrec 3** : g∘f au lieu de f∘g ; ordre de la soustraction ; f(k) au lieu de
  f⁻¹(k) ; signe en isolant x.
- **probrat 1–3** (et variantes) : somme ou moyenne des temps ; soustraction des durées au lieu des
  débits ; vitesse augmentée rendue ; solution négative de l'équation.
- **bijection 1–2, polyexpr 1–3** : a ↔ b ; signe du sommet ; f(0) ; signes des facteurs ; côté du fond
  L − x au lieu de L − 2x ; aire du fond sans la hauteur ; base carrée (x au lieu de x²).
- **polydiv 1, 3, polyfact 1–3, eqrat 1–3** (ensembles de solutions) : P(−a) au lieu de P(a) ; racine
  donnée oubliée ; valeurs de t = x² rendues ; solutions négatives oubliées ; facteur 2x non divisé ;
  valeur interdite gardée ; « aucune » alors qu'il y a une solution ; produit en croix mal croisé.
- **homog 1–2, cercle 2–3, cercletan 1–3, cart 1, vecteurs 2–3** : signe de l'asymptote ; zéro du
  numérateur ; rapport des termes constants ; asymptote verticale ↔ horizontale ; r² au lieu de r ;
  constante lue comme r² ; ordonnées au lieu des abscisses ; diamètre au carré ; division par 5
  oubliée ; pente du rayon ; somme des composantes au lieu de la norme ; produit scalaire croisé ou
  soustrait.

## Points à contrôler
- Les messages des pièges sont courts et nomment la confusion ; certains donnent la méthode (pas la réponse).
  Relecture prof utile surtout pour optim (16 contextes) et les variantes de logarithmes.
- Pièges de valeur arrondie (disque, cylindres, ln) : reconnus à la tolérance de l'arrondi (0,6 × round).
- Les questions de comptage restent sans piège (voir ci-dessus).

Fichiers modifiés : src/generators.js, src/gen2.js, src/gen3.js, src/variantes.js.
