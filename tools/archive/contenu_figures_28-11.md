# /contenu figures — audit des figures manquantes (28.11)

Demande de l'enseignant (28.11) : « il faudrait faire un audit de tous les endroits où il faut rajouter des figures »
(après polyreg 2 et racprop 4, faits le matin : `FIG.polyTri`, `FIG.cube(la, "diag")`).

## Méthode

Sonde non commitée `tests/_audit_fig.html#30` : pour chaque notion de chaque classe (CH 9e–4e, MP 1re–4e), chaque niveau
1–4 et 30 graines, `Engine.fromCode` → présence de `fig` ; regroupement par forme (énoncé aux nombres près).
Fréquence = poids de la classe (11e et 1re Collège = testeurs) × part de la notion × poids du niveau × part de la forme.
Tri des formes sans figure par mots-clés (géométrie, mesures, solides, repères, situations spatiales), puis lecture.

Avant : 39 couples notion × niveau de 11e et 1re Collège avec des formes géométriques sans figure.

## Fait (branche `agent/contenu`)

**105 formes** reçoivent une figure dans **17 notions** (≈ 900 tirages sur 30 × 4 niveaux par notion) :

| Classe | Notion | Niveaux | Formes (figure) |
|---|---|---|---|
| 11e | airepyr | 1–4 | toutes : pyramide avec apothème (nouveau `FIG.pyramid(…, { apo, edge })`), hauteur |
| 11e | volmanq | 1–3 | pavé, cylindre, prisme, cône, pyramide, boule, piscine, boîte, entonnoir (« ? » sur la dimension cherchée) |
| 11e | volcomp | 2–4 | gélule (`FIG.capsule`), cube percé (`FIG.cubeHole`), glace (`FIG.iceCone`), silo / réservoir (`GF.silo`), bougie / savon (profil) |
| 11e | volcone | 2, 4 | bol (`FIG.halfBall`), cornet de glace |
| 11e | thales | 4 | ombres (`GF.shadows`), charpente / voile / triangle, étang / rivière / ravin (`GF.thales`) |
| 11e | thalesrec | 1–2 | configuration ; (DE) dessinée NON parallèle quand les rapports diffèrent (`labs.kE`) |
| 11e | cercthales | 2–4 | tangente et angles (`GF.tangent` : lP, lO, both), cercle de Thalès (`GF.diam` : angles en C de part et d'autre de [OC]) |
| 11e | angles | 1, 3 | supplément, complément (`GF.complement`), équations alternes-internes et angle plat (droites `par`), angle au centre (`GF.centralTri`) |
| 11e | pythrec | 3 | menuisier (équerre 3-4-5), cadre (diagonale) |
| 11e | probeq2 | 3 | jardin et allées (`GF.allees`) |
| 1re | euclide | 1–4 | toutes : hauteur sur l'hypoténuse (`GF.altitude`) |
| 1re | exactes | 1–3 | toutes : carré (diagonale), équilatéral, rectangle, cube (d, D), hexagone (`FIG.hexTri`), disque inscrit (`FIG.squareDisk`) |
| 1re | geocomb | 1–4 | toutes : rectangle, isocèle, losange, carton, trapèze isocèle (`GF.trapIso`), cône, terrain, tente, rampe, abri |
| 1re | droitesrem | 1–3 | médianes, hauteur issue de A (`GF.footH`), isocèle, médiatrice |
| 1re | trigo | 3–4 | route, rampe, deux visées d'une tour (`GF.elev`) |
| 1re | trigexact | 1–3 | pentes, angle d'une pente, dénivelé, aire de l'équilatéral |
| 9e | volpave | 1 | volume d'un cube |

Corrections de figures existantes faites au passage (lisibilité à 360 px) : étiquettes longues des angles (`GEO.angle`,
expressions « (4x + 16)° » coupées par la sécante), hauteur du triangle isocèle (`GF.isoH`, coupait le côté ; noms
paramétrables), cote du toit (`GF.house`, `GF.profile`), losange, rayon de la boule (`FIG.sphere`), hauteur du cône
(cote à gauche quand l'étiquette est large), rapport de Thalès borné pour le dessin (AD = 3, DB = 30 : tout se
chevauchait en A). Énoncé droitesrem 1 « GM » : médiane [CM] (comme la figure et la forme voisine), au lieu de [AM].

Contrôles : jamais la réponse ni une valeur calculée sur la figure (les inconnues sont « ? », « h », « a ») ;
`tests/figs.html` vérifie maintenant 38 formes (niveaux 1–3 et thales 4) à figure obligatoire (ÉCHEC si l'une perd sa figure).

Captures 360 px (clair, plus un échantillon sombre) : `tests/_shots/contenu/figures/` (33 planches, une par notion et
groupe de 4 formes, `sombre_exemples.png`).

## Reste à faire (classé par fréquence de tirage, 11e et 1re d'abord)

Figure utile :
1. 11e pythrec 2 — repère A, B, C (« Calcule AC² ») : `FIG.lineGraph(null, null, pts, { poly })`.
2. 11e sysprob 1, sys2 4, ineq2 3 (1re), ratden 2 (1re) — rectangles avec périmètre / aire : rectangle coté.
3. 11e simil 1–3 — triangles ou figures agrandis : `FIG.simTri` / `FIG.scaling`.
4. 11e cercthales 4 (tunnel en demi-cercle), thalesrec 4 (escabeau et sangle), repere3d 4 (pavé dans un repère de
   l'espace), parenth 4 (plaque et fente).
5. 10e disque 2–3 (périmètre → aire, secteur), grandmanq 3 (parallélogramme et carré), voldecomp 1–3 (solides en L,
   escalier, citerne), airelat 2–3 (cylindre donné par son diamètre : `FIG.cylinder` ne dessine que le rayon, il faut
   une variante « d = … »), pente 1–2.
6. 9e volpave 2 (aire totale du cube), solides 2 (prisme à base octogonale).
7. 11e volmanq 4 (conserve, piscine ronde : même besoin du cylindre au diamètre), verre conique (pointe en bas).

À décider (la figure ferait une partie du travail) :
- 11e eq2 4, idrem 4 (rectangle « x » et « x + 7 ») : la figure donnerait la mise en équation, qui est l'objet du défi.
- 11e pythrec 1–2 (« le triangle est-il rectangle ? ») : un dessin trancherait la question.
- 1re paraboles (f2trois, interpar, transf, f2formes) : le graphe donnerait sommet ou intersections.
- 1re trigrel / trigexact 2 (sin α = 4/5 → cos α) : un triangle 3-4-5 aiderait mais montre la méthode.

Inutile : équations, ensembles, conversions, probabilités, unités composées (mots-clés « aire », « piscine »… sans
situation spatiale).

Classes suivantes (pas encore relues) : 2e–4e Collège et MP, surtout géométrie analytique (droites, cercles, vecteurs,
plans) où un repère aiderait souvent ; à faire avec la même sonde (`tests/_audit_fig.html`, non commitée).
