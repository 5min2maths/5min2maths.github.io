# Audit du profil France, lycée (26.11.2026, branche agent/frlycee)

Classes : 2nde GT, 1re spécialité, Tle spécialité (le tronc commun « enseignement scientifique » n'est pas visé).
Méthode : catalogue réel `Engine.catalog({ system: "FR", grade })`, questions tirées par `Engine.make` (niveaux 1 à 3,
plusieurs graines), comparées aux textes officiels de `~/DATA/Enseignement/Sources/Officiel/France/` (rien de nouveau
téléchargé). Contrôle permanent : `tests/frplace.html`.

## Textes en vigueur en 2026-2027 (vérifié)

| Classe | Texte | Remarque |
|---|---|---|
| 2nde | **programme 2026** (arrêté du 26.02.2026, BO n° 14 du 02.04.2026), dès la rentrée 2026 | remplace le programme 2019 : plus de systèmes linéaires, valeur absolue limitée à la distance et à la fonction de référence |
| 1re spécialité | **programme 2026** (même BO), dès la rentrée 2026 | forme canonique « dans des cas simples » seulement ; fonctions paires et impaires (nouveau) ; loi des sinus en approfondissement |
| Tle spécialité | programme 2019, jusqu'en 2026-2027 ; texte 2026 à la rentrée 2027 | |

Confirmé le 26.11 par le BO (education.gouv.fr, BO n° 14 du 2 avril 2026) : 2nde et 1re à la rentrée 2026, Tle à la rentrée 2027.

## Corrigé

**(a) Placement**
- `optim` (sommet d'un trinôme, −b ÷ 2a) et `inter` (intersection parabole–droite, discriminant) : 2nde → **1re**
  (chapitre « Second degré »). En 2nde, l'optimisation se fait par lecture d'un graphique ou d'un tableau de variations.
- `vecteurs` : la ligne de `fr_2nde.js` qui la plaçait en 1re était déjà écrasée par `fr_couv.js` (FR = null) ; elle est
  supprimée. La notion suisse (« composantes », produit scalaire) reste hors du catalogue français. Les vecteurs de 2nde sont
  servis par `vect3e` (coordonnées, Chasles, somme et produit par un réel, parallélogramme, déterminant, colinéarité,
  alignement, **norme : forme créée**), `cart` (distance, milieu) et `vecgeo`.

**(a) Formes hors programme écartées** (HORS_FR, `src/fr_couv.js`, profil français seulement)
- 2nde : trinômes à factoriser (`eq2fact` : x² − 4x = 12, x(x − 1) = 12… ; `fimg` : racines de x² + 5x + 4) ;
  12/x = x − 1 (`racinv`) ; système de deux équations cartésiennes (`droites`) ; triangle rectangle par le produit scalaire (`cart`).
- Partout en France : équations avec radical à solutions parasites (√x = x − 12) ; forme canonique dans le cas général
  (`f2formes`, a ≠ 1 : « pas un attendu », programme de 1re 2026).

**(c) Vocabulaire et notations** (`src/curriculum.js` : FR_WORDS, FR_ZERO, frIdTxt ; libellés : labelFR)
- « zéro(s) » d'une fonction → **racine(s)** au lycée (le collège garde « zéro » : « racine » y évoque la racine carrée) ;
  « zéro du dénominateur » → « valeur qui annule le dénominateur » ; le nombre zéro et « complète par des zéros » restent.
- « graphe » → **courbe** ; « axe horizontal / vertical » → **axe des abscisses / des ordonnées** ; « composantes » →
  **coordonnées** ; « h » de y = mx + h → **p** dans les corrigés (`droites`, `droitesinter`) ; « · » → **×** hors produit
  scalaire de deux vecteurs (u · v, AB · AC) ; « (5x) en évidence » → « en facteur » ; « domaine de g ∘ f » → ensemble de définition.
- Libellés : « Images et antécédents », « Parabole : racines et sommet », « Factoriser un trinôme à l'aide de ses racines »,
  « Signe d'une fonction affine », « Lire un graphique : images, antécédents, variations ».

**(d) Niveau** : l'essentiel des écarts de niveau venait des formes de 1re servies en 2nde (trinômes, sommet,
discriminant), corrigées ci-dessus. Les reprises du collège partent déjà du niveau 2 (UPFR). 1re et Tle : questions au niveau
des attendus.

## Trous restants (capacités sans question)

- 2nde : vraisemblance d'un résultat (AU.06) ; algorithmique de simulation et loi des grands nombres (AP.08, SP.09, non saisissables).
- 1re : **fonctions paires et impaires** (contenu nouveau 2026, aucune question) ; approximation affine f(a + h) (en partie
  dans `tangente`) ; arbre de n ⩽ 4 épreuves de Bernoulli (en partie) ; dérivabilité de |x| en 0 (non saisissable).
- Tle (2019) : convexité pour démontrer une inégalité, esquisse de courbe, suites u(n+1) = f(u(n)) (en partie), Python (listes).

## À soumettre à l'enseignant

1. `eq3` (équations de degré 3 par factorisation) est rangée en Tle « Compléments » : ni au programme 2019 de Tle, ni attendu
   en 1re 2026 (approfondissement). Garder, ou retirer ?
2. `cercle`, niveau 3 : intersection d'un cercle et d'une droite oblique ; le programme de 1re ne cite (en approfondissement)
   que la droite parallèle à un axe. Garder ?
3. `nbderive` : « avec la définition » pour x³ et √x ; le programme 2026 limite le calcul algébrique du taux de variation au
   second degré et à la fonction inverse. Écarter ces deux formes en France ?
4. « racine » au lycée, « zéro » gardé au collège (4e–3e : `lectgraph`, `affine`, `tabval`) ; un collégien français dirait
   plutôt « antécédent de 0 ». À trancher.
5. `cart`, niveau 3 en 2nde : aire d'un triangle par le déterminant (approfondissement seulement).
6. Défaut de texte vu en passant (commun avec la Suisse, non corrigé ici) : `eq3`, forme « erreur » : « je divise par xx^2 = 9 ».
7. Dans une formule avec un vecteur, le produit de deux nombres garde « · » (det(AB, AC) = 4 · 2 − …) : règle de `frTimes`.
