# Recalcul indépendant (garde-fou, 26.11)

Déclencheur : un testeur a trouvé une réponse attendue fausse (canette, « hauteur minimale » acceptée à 9,6 au lieu
de 9,7) que les contrôles existants n'avaient pas vue : `tests/vraisemblance.html` contrôle la vraisemblance des
énoncés (bornes, triangles, arrondis déclarés…), le robot contrôle qu'une réponse juste n'est pas refusée, mais
personne ne refaisait le calcul.

## Principe

- `tests/recalc_oracles.js` (`RECALC.check(item)`) : chaque **oracle** relit les nombres **dans le texte que l'élève
  voit** (pas dans les variables du générateur), refait le calcul par une autre voie et compare :
  1. à la réponse attendue (`checkAnswer` sur la valeur recalculée, sans les contraintes de forme) ;
  2. à l'arrondi demandé par l'énoncé (« au dixième », « au centième », « à 10 km/h près », « à l'unité »…), **sens
     compris** : « supérieur », « minimal », « au moins », « faut-il prévoir » → arrondi vers le haut, et l'arrondi
     dans l'autre sens doit être **refusé** (cas de la canette) ; sans sens imposé, une tolérance qui accepterait
     aussi l'arrondi voisin est signalée (moyenne exactement à 5,225) ;
  3. au corrigé : `q.sol` doit contenir la valeur finale (nombre, fraction, kπ, a√b, ou expression TeX évaluée).
- Oracles génériques (sur le TeX de l'énoncé) :
  - **calcul** : « Calcule : … », « Écris … en notation scientifique / en nombre décimal » → évaluation de l'expression ;
  - **exposant** : « a^m · a^n = a^□ » ;
  - **substitution** : « Calcule E pour x = … », « Utilise la formule A = … pour L = … » ;
  - **fonction** : « Soit f(x) = … » → image, préimages, zéros, ordonnée à l'origine ;
  - **équation** : « Résous … » (une inconnue) → **toutes** les racines réelles cherchées numériquement sur
    [−200 ; 200] (changements de signe hors pôles, minima isolés pour les racines doubles), identités détectées
    (« tous les nombres »), solutions hors de l'intervalle vérifiées une à une ;
  - **inéquation** : ensemble attendu comparé point par point (grille + bornes ± 0,001, bornes elles-mêmes) ;
  - **systèmes** 2 × 2 et 3 × 3 linéaires : Cramer ;
  - **équivalence** : « Développe / Factorise / Réduis » → la réponse attendue est égale à l'expression affichée ;
  - **dérivée** : « Donne f'(x) pour f(x) = … » → dérivée numérique.
- Règles de texte (environ 250 gabarits) pour les énoncés à contexte : pourcentages, proportionnalité, vitesses,
  volumes et aires, cercle, Pythagore (et réciproque), trigonométrie, Thalès (et réciproque), triangle quelconque,
  statistiques, probabilités (dénombrement exact), arithmétique, angles et polygones, échelles, pentes, similitudes,
  grandeurs composées, pyramides.
- **Valeur exacte arrondie** (contrôle générique, toutes notions, réponses, étapes guidées et parties) : une valeur
  sans tolérance qui est l'arrondi à 5–8 décimales d'une fraction non décimale (q ≤ 30), de (p/q)·π ou (p/q)·√n
  (ex. `r6(2/3) = 0,666667`) : l'élève qui tape 2/3 ou 2π est refusé (« très proche »). Idem pour un coefficient
  arrondi dans une réponse attendue de type expression.
- **Saisie** (26.11, extension) : avec la réponse attendue **complète** (formes exigées : `plain`, `radical`, `final`),
  `checkAnswer` doit accepter l'arrondi annoncé tapé avec la virgule (« 14,9 »), la fraction irréductible (quand
  l'énoncé dit « fraction » ou que la valeur est un décimal illimité), kπ (« 160π ») et a√b (« 2√2 ») quand la valeur
  en est un ; une réponse `plain` (décimal seul) dont la valeur est un décimal illimité est signalée.
- Oracles génériques ajoutés le 26.11 : **vérification** (« Lequel / Combien de ces nombres est solution de … ? » :
  chaque proposition est substituée, « Lequel » exige exactement une solution), **équation trigonométrique** (toutes
  les solutions sur [0° ; 360°[ ou [0 ; 2π[, racines doubles comprises), **monômes** (« Calcule : 4y · 9y », M² = …),
  **périodique** (0,2\overline{7} → fraction), **domaine** de définition (appartenance point par point, pôles et bords
  des racines vérifiés exactement), **parabole** (sommet, zéros, extremum, expression à partir de sommet + a, zéros + a,
  sommet + point, zéros + point, trois points, axe + ordonnée à l'origine + point, zéros + extremum), **zéro** d'une
  fonction, **inéquation « x > a »** (réponse de type `ineq`), **formule** (« exprime t en fonction des autres lettres » :
  la réponse substituée vérifie la formule pour des valeurs quelconques). Valeur absolue |…| lue dans le TeX.
- Règles de texte ajoutées (≈ 330) : volumes composés et manquants, Pythagore dans les figures, conversions d'unités
  (longueurs, masses, aires, volumes, capacités, durées, unités composées — table d'unités, pas de gabarit par
  conversion), fractions (amplifier, simplifier, comparer, encadrer, périodiques, fraction d'une quantité), périmètres
  et aires, grandeur manquante, décimaux (arrondir, encadrer, comparer, ranger, ×10, lire), divisibilité, multiples,
  premiers, tableaux de proportionnalité, change, agrandissement, ordre de grandeur, relatifs sur la droite, racines
  (encadrer, comparer), cercle de Thalès et tangente, dénombrement, Euclide et hauteur, droites remarquables,
  relations trigonométriques, problèmes (mise en équation, 2e degré, systèmes à deux inconnues — réponse en couple).
  Option `exact` (`TE`) : réponse exacte, sans relire l'arrondi dans l'énoncé (« au dixième » y est une donnée).
- **Contre-épreuve** : sur les 3 premières graines de chaque notion et niveau (et sur chaque défi reconnu), la
  réponse attendue est faussée ; l'oracle doit protester, sinon échec (oracle devenu aveugle). `#mutant` : partout.

## Page de test

`tests/recalcul.html` et `tests/recalcul2.html` (dans la suite ; **scindée en deux le 26.11 au soir** : 316 s sous charge 10 pour la page unique après la 3e extension, au-delà de la cible de 200 s ; recalcul.html = notions de rang pair + exercices riches et défis, recalcul2.html = notions de rang impair, `<meta name="part">` ; les deux fichiers ne diffèrent que par cette meta) : passe 1, toutes les notions, niveaux 1 à 3, graines 1 à 15 ;
passe 2, notions reconnues (≥ 20 % à un niveau), graines 16 à 100, soit **100 énoncés par notion et niveau** ;
puis exercices riches et défis (parties reconnues). Échec sur tout désaccord, avec le code de la question.
Options : `#ids=pct,vitesse`, `#n=…`, `#detail` (taux de reconnaissance), `#mutant`.

Ajouter un oracle : une ligne `T(null, /gabarit/, (a, b) => calcul)` dans `tests/recalc_oracles.js` (les nombres
sont lus avec la virgule et l'apostrophe), puis vérifier avec `#ids=…&detail` et `#ids=…&mutant`.

## Erreurs trouvées et corrigées (26.11)

| Code | Notion | Avant | Après |
|---|---|---|---|
| `droites-2-4` (ch_mp2) | k pour une perpendiculaire | attendu −0,333333 (r6), « −1/3 » jugé « très proche » | −1/3 exact |
| `recip-2-*` (ch_mp2) | réciproque d'une affine | réponse `1/3*x-0.333333`, « x/3 − 1/3 » refusé | coefficients exacts |
| `diagr-3-5` (gen2) | moyenne au centième | 104,5 : 20 = 5,225 → corrigé « 5,22 », 5,22 et 5,23 acceptés | 5,23 (arrondi exact), seul 5,23 accepté |
| `automat-2-*` (fr_college) | « écris-le en fraction » | attendu 0,666667 : la fraction 2/3 refusée | valeur exacte (Qv, G, Pb sans r6) |
| `ratio-3-*` (fr_college) | fraction d'un ratio | 0,777778 : 7/9 refusé | exact |
| `ch10_no` (Qv, G) | (même constructeur) | r6 dans la réponse | exact |
| `defis_910` (sp) | défis 9e–10e | r6 dans la réponse | exact |
| `trigassoc-2-*` (ch_mp2) | tan α (fraction ou décimal) | 0,291667 : 7/24 refusé | 7/24 exact |
| `trigfn-2-*` (ch_mp2), étape | période de sin en radians | 6,283185 : « 2π » refusé | 2π exact |
| `thalesrec-3-*` (ch11_thales) | DE, EC (fraction ou décimal) | 5,333333 : 16/3 refusé ; corrigé « 5,333333 » | exact ; corrigé « 16/3 ≈ 5,33 » |
| `thales-3-r` (ch11_thales), étape | BC « au dixième » | étape sans tolérance : 10,7 refusé | tolérance 0,1 |
| `euclide-3-*` (ch1c_geo) | écart des projections | 9,153846 : 119/13 refusé | exact ; corrigé « 119/13 ≈ 9,15 » |
| `hauteurs5-3-*` (fr_trous) | hauteur issue de A | 7,058824 : 120/17 refusé | exact |
| `vitesse-3-*` (ch11_prop), étapes | « 1 h 20 min en heures décimales » et durées | 1,333333 : 1,33 refusé (faux), 4/3 « très proche » | exact, 3 chiffres significatifs acceptés (1,33 ; 4/3) |

### Extension du 26.11 (agent/recalc2)

Aucune réponse attendue fausse dans les 53 notions ajoutées (≈ 9'300 énoncés de plus recalculés) ; la saisie accepte
partout les écritures justes. Corrections :

| Code | Notion | Avant | Après |
|---|---|---|---|
| `probeq-*` (ch1c_eq, âges) | « a le double de l'âge de son fils » | un père de 12 ans pour un fils de 6 ans (écart d'âge invraisemblable) ; « Une mère … sa fille … ils » | écart ≥ 20 ans (grands-parents ≥ 45 ans) ; « elles » pour deux femmes |
| `eqverif-3-*` (gen3) | combien de solutions parmi une liste | corrigé sans le nombre demandé | « …, donc 2 nombres de la liste » |
| `fracper-1-*`, `fracper-2-*` (variantes) | chiffre / groupe qui se répète | corrigé « 10,6666… » sans la réponse | « : le chiffre 6 se répète », « le groupe 81 se répète » |
| `divcrit-2-*`, `divcrit-3-*` (ch1c_no) | combien sont divisibles ; plus petit chiffre ■ | corrigé sans le nombre (liste seule) ; sans le chiffre (852 seul) | « soit 2 nombres » ; « le chiffre est 2 » |
| `premiers-1-*` (variantes) | combien de premiers entre a et b | corrigé = liste de tous les premiers jusqu'à 100 | premiers de l'intervalle et leur nombre |
| `racenc-2-*` (ch1c_no) | le plus grand de a√b et √c | corrigé sans conclusion | « le plus grand est √19 » |
| `f2trois-1-*` (ch1c_f2b) | que vaut a ? | corrigé s'arrêtant à « 2a = −6 » | « …, donc a = −3 » |

Oracle : la recherche des racines doubles manquait une racine située exactement à mi-chemin de deux pas de la grille
(sin 2x = 1) ; corrigé (≤ d'un côté). `solHas` lit aussi les nombres sans fusionner « 21 133 » (« 21 : 133 » en
texte lisible).

Contrôle de la canette du testeur (`vol-4-*`, défi) : recalculé, hauteur minimale 9,7 (9,6 refusé) — correct depuis
le 25.11.

### Extension du soir (26.11, agent/defis2)

Oracles ajoutés (`tests/recalc_oracles.js`, sections « défis » et « notions encore sous 20 % ») :

- **Défis rendus aléatoires** (symax, mediatrice, echelle6, proba6, empil, compdiff, posrelc, intmaj, suiteint, approxnorm,
  isom, numer) : un oracle par contexte et par question (`DF`, texte « énoncé ¶ question », seulement sur les parties de
  défi) ; cohérence de l'énoncé contrôlée (angles du triangle et côtés, cordes < 2R, monotonie et encadrement de
  l'intégrale par Simpson, valeur de Φ donnée comparée à Φ réelle, z recalculé) ; suites d'intégrales recalculées par
  Simpson. 5'400 questions sur 150 graines : 100 % reconnues, aucun désaccord, contre-épreuves détectées.
- **transf** (sommets et minima par recherche numérique sur g, points images, g(a), forme canonique, décalages),
  **trigcercle** (conversions, quadrants, valeurs exactes, coordonnées, angle unique sur un intervalle), **trigfn**
  (amplitude, extremums, position du minimum, image en degrés, période par balayage et affinage, nombre de zéros),
  **recip** (antécédent unique sur le domaine de restriction, expression de f⁻¹ vérifiée par f(f⁻¹(y)) = y, composée).
- **Lecture de graphique** (`figRead`) : la figure SVG de `FIG.plot` est relue (graduations → échelle, tracé de la courbe,
  points marqués et leurs noms) ; parabole ajustée par moindres carrés, lecture « propre » exigée à la demi-unité près.
  Couvre f2 (zéros lus, axe de symétrie, sommet lu, forme canonique lue, a à partir de S et P, a à partir des zéros et de
  f(0)) et f2expr (sommet lu, même ouverture que ±x²). Le texte de l'item porte maintenant `fig`.
- f2 « Détermine le sommet » (fractions), f2expr « axe, ordonnée à l'origine et un point ».
- probeq : nombres pairs/impairs consécutifs, note manquante pour une moyenne, prix avant réduction, partage du sac la
  nuit ; decadd : rendu de monnaie, écarts (course, saut), bouteille.
- Autres notions fréquentes : **inter** (intersections, nombre de points, distance horizontale, tangente horizontale),
  **homog** (asymptotes, réciproque vérifiée), **polydiv** (reste, quotient vérifié, a et b, k, reste d'une division par
  un trinôme), **nbderive** (nombre dérivé par différences centrées d'ordre 4, s'(t)), **combi** (19 gabarits),
  **milieux**, **suitearith** / **suitegeo** (formes directes).

Taux (niveaux 1 / 2 / 3) : transf, trigcercle, trigfn, recip, f2, f2expr, probeq, decadd, inter, homog 100 % partout ;
polydiv 100 / 100 / 59 ; combi 100 / 100 / 70 ; nbderive 33 / 87 / 100 ; milieux 100 / 100 / 0 ; suitearith 70 / 41 / 0 ;
suitegeo 54 / 0 / 0. Total : **187 notions couvertes** (178 avant), 41'266 énoncés recalculés sur 62'355.

Erreurs trouvées et corrigées :

| Code | Notion | Avant | Après |
|---|---|---|---|
| `f2expr-3-*` (ch1c_f2b, axe-point) | axe x = h, ordonnée à l'origine c, point (2h ; c) | le point donné était le symétrique de (0 ; c) : a indéterminé, infinité de paraboles, une seule acceptée | point choisi hors de 0, h et 2h |
| `inter-2-*` (ch1c_f2b, delta) et forme hyperbole | « combien de points d'intersection » | corrigé « un point (droite tangente) », sans le nombre en chiffres | « 1 point (droite tangente) », « 2 points », « 0 point » |

Outils corrigés : `tests/recalcul.html` ne chargeait pas `src/perco.js` (isom, ensco, numer, fctlec, litconv jamais
recalculés) ; la contre-épreuve v → 1,2v + 0,7 laissait −3,5 inchangé (point fixe : réponse faussée identique), elle
ajoute maintenant 1 dans ce cas.

Aucune erreur dans les fichiers réservés à l'autre agent (app.js, expr.js, active.js, riche_2c.js, variantes.js) n'a
été rencontrée par ces oracles.

### Défis variés, suite (26.11 soir, agent/defis3)

Section « défis rendus variés (agent defis3) » de `tests/recalc_oracles.js` : un oracle `DF` par contexte et par question
pour les 42 défis rendus variés ce soir (fracmul, fracconv, fracadd, sci, scicalc, pythfig, pythrec, vol, airepyr,
volcomp, thales, repere, sysprob, sysgraph, sysineq, eqfrac, bicarre, lectgraph, trigexact, droitesrem, polyreg,
graphefct, ineqgraph, repere3d, bayes, syslin, bases, etudelnexp, geoesp, densite, probaxiomes, derivth, trigcercle,
optimderiv, eqlog, eqbic, dec10, pow9, aire1, quadri, decarr, airelat). Sur 150 graines par défi : toutes les parties
numériques reconnues, aucun désaccord. Les règles de texte reçoivent maintenant l'item en second argument
(`r.f(txt, x)`) et les items de défi portent `fig` (recalcul.html, recalcul2.html) : la parabole de lectgraph est relue
sur la figure (`figRead`, `quadFit`). Réponses oui/non (1/0) et valeurs exactes en fraction imbriquée : `{ v, sol: false }`
(le corrigé dit « oui » ou donne la forme exacte, illisible en texte simple).

### 3e–4e Collège et MP 3e–4e (27.11, agent/recalc34)

Déclencheur : le noyau faux d'appllin (4e Collège). Nouveau fichier **`tests/recalc_oracles34.js`** (chargé après
`recalc_oracles.js`) : oracles placés en tête de `RECALC.G`, limités aux notions nommées, qui relisent le **TeX** de l'énoncé
et refont le calcul par une autre voie, quelle que soit la forme de la réponse attendue (valeur, ensemble, couple ou
triplet, expression comparée en 6 points, nombre complexe a + bi, intervalles). Outils : dérivées par différences
centrées d'ordre 4, limites extrapolées (Richardson ; ±∞ avec ln et exp traités à part), intégrales par Simpson adaptatif,
extremums par changement de signe de f', optimisation par balayage et section dorée, Cramer 2×2 / 3×3, produits scalaire,
vectoriel et mixte, droites et plans paramétriques ou cartésiens (lus dans les `cases` et `pmatrix`), sphères (centre et
rayon tirés de l'équation), petit évaluateur de nombres complexes (z, w, z̄, i, e^{iθ}, puissances), tableaux `array`
(lois de probabilité, effectifs, classes, tableaux de contingence), règle 68-95-99,7, table de Φ donnée dans l'énoncé.
Contre-épreuve sur toutes les graines pendant la mise au point (`#mutant`) : toute réponse faussée est détectée.

Pages : **`tests/recalcul3.html`** et **`tests/recalcul4.html`** (même gabarit, `<meta name="part" content="3|4">`) recalculent
les notions de `recalc_oracles34.js` (`RECALC.IDS34`, une sur deux par page) ; `recalcul.html` et `recalcul2.html` les
excluent (recalcul.html : 280 s sous charge 15 avec ces notions, au-delà de 200 s).

Erreurs trouvées et corrigées :

| Code | Notion | Gravité | Avant | Après |
|---|---|---|---|---|
| `cplxalg-2-*` (ch4c_ana, équation (a)z + c = e) | Résoudre dans ℂ | **grave** | avec c = −3 + 6i, l'énoncé affichait « (6 − 6i)z − 3 − 6i » (partie imaginaire de c de signe inversé dès que Re c < 0) : réponse attendue fausse pour l'énoncé lu, environ une question sur quatre | énoncé « − 3 + 6i », cohérent avec la réponse |
| `normale-*` (ch4c_ana) | Loi normale | moyenne | réponses de la règle 68-95-99,7 (68 %, 16 %, 32 % « au dixième »…) sans que l'énoncé le dise : l'élève qui calcule avec Φ (68,27 %, 31,7 %) est refusé | « Utilise la règle 68-95-99,7. » dans l'énoncé (sauf la valeur centrée réduite) |
| `approxnorm-2-*`, `approxnorm-3-*` (ch4c_trous) | Approximation normale | faible | probabilité lue dans la table (4 décimales) demandée au millième, parfois pile entre deux millièmes (0,3085) : 0,308 et 0,309 acceptés | réponse = arrondi au millième (demi vers le haut) |
| `statdesc-3-*`, `statdesc-2-*`, `condbayes-3-*` et tout `QR` de ch4c_ana | Arrondis à égalité | faible | 53,25 au dixième, médiane 18,125 au centième, 0,3125 au millième : les deux voisins acceptés | arrondi demi vers le haut, comme le corrigé (`tie` dans `QR`) |
| `croissexp-1-*` (ch_mp3) | Dépréciation au franc près | faible | 25'000 · 0,9⁴ = 16'402,5 : 16'402 et 16'403 acceptés | 16'403 |
| `lnexp-3-*` (ch4c_ana) | Ordonnée à l'origine de la tangente à ln | corrigé | corrigé s'arrêtant à l'équation y = x/a + ln a − 1 | « ; ordonnée à l'origine ln(a) − 1 » |
| `probaxiomes-2-*` (ch3c_ana, jass) | Réunion d'événements | énoncé | « tirer un pique ou un 6, un 7 ou un 8 », « un carreau ou un dix ou un as » ; corrigé « les 1 cartes » | « une carte de valeur 6, 7 ou 8 », « un carreau, un dix ou un as » ; « la carte qui est les deux à la fois » |

Aucune autre réponse attendue fausse dans les ≈ 90 notions balayées (≈ 25'000 énoncés à 100 tirages par niveau).

Couverture (taux d'énoncés recalculés aux niveaux 1 / 2 / 3, avant → après ; avant : mesure à 30 tirages, après : 100 tirages) :

**90 notions** visées (3e et 4e Collège MA1 et MA2, MP 3e–4e) : **32 couvertes avant** (≥ 20 % à un niveau), **90 après**. Pages 3 et 4 : 83 s et 155 s sous charge 13 ; recalcul3 + recalcul4 : 24'600 énoncés, 21'139 recalculés.

| Notion | Avant (1 / 2 / 3) | Après (1 / 2 / 3) |
|---|---|---|
| `polyfact` | 0 %  100 %  100 % | 100 %  100 %  100 % |
| `fracrat` | 70 %  100 %  67 % | 70 %  100 %  67 % |
| `ineqfrac` | 100 %  100 %  73 % | 100 %  100 %  73 % |
| `trigfn` | 100 %  100 %  100 % | 100 %  100 %  100 % |
| `expo` | 100 %  100 %  0 % | 100 %  100 %  100 % |
| `log` | 0 %  77 %  0 % | 100 %  78 %  100 % |
| `compo` | 0 %  0 %  0 % | 100 %  100 %  100 % |
| `tauxvar` | 0 %  0 %  0 % | 75 %  100 %  100 % |
| `nbderive` | 37 %  97 %  100 % | 33 %  87 %  100 % |
| `derivref` | 37 %  37 %  57 % | 100 %  100 %  55 % |
| `derivregles` | 70 %  100 %  0 % | 100 %  100 %  53 % |
| `derivprodquot` | 67 %  17 %  47 % | 100 %  100 %  84 % |
| `derivcomp` | 80 %  60 %  40 % | 100 %  100 %  100 % |
| `tangente` | 0 %  0 %  0 % | 100 %  100 %  100 % |
| `variations` | 0 %  0 %  0 % | 99 %  100 %  100 % |
| `optimderiv` | 0 %  0 %  0 % | 100 %  100 %  100 % |
| `limites` | 0 %  0 %  0 % | 72 %  100 %  100 % |
| `limitinf` | 0 %  0 %  0 % | 66 %  100 %  100 % |
| `asymptotes` | 0 %  0 %  0 % | 59 %  100 %  100 % |
| `continuite` | 0 %  0 %  0 % | 73 %  100 %  100 % |
| `derivseconde` | 0 %  0 %  0 % | 49 %  100 %  100 % |
| `etudefct` | 0 %  0 %  0 % | 100 %  100 %  59 % |
| `combi` | 100 %  100 %  73 % | 100 %  100 %  73 % |
| `probaxiomes` | 0 %  0 %  0 % | 85 %  100 %  85 % |
| `probarbre` | 0 %  0 %  0 % | 100 %  100 %  100 % |
| `derivth` | 0 %  0 %  0 % | 78 %  100 %  71 % |
| `vect3d` | 0 %  0 %  0 % | 100 %  100 %  100 % |
| `colin` | 0 %  0 %  0 % | 100 %  100 %  100 % |
| `droite3d` | 0 %  0 %  0 % | 100 %  100 %  100 % |
| `plans` | 0 %  0 %  0 % | 100 %  100 %  100 % |
| `posrel` | 0 %  0 %  0 % | 100 %  100 %  100 % |
| `pscal3d` | 0 %  0 %  0 % | 100 %  100 %  100 % |
| `distances` | 0 %  0 %  0 % | 100 %  100 %  100 % |
| `sphere` | 0 %  0 %  0 % | 100 %  100 %  100 % |
| `pvect` | 0 %  0 %  0 % | 100 %  100 %  100 % |
| `ineqpoly` | 100 %  100 %  100 % | 100 %  100 %  100 % |
| `primitives` | 0 %  0 %  0 % | 100 %  100 %  96 % |
| `integrale` | 0 %  0 %  0 % | 100 %  85 %  74 % |
| `aireint` | 0 %  0 %  0 % | 100 %  100 %  100 % |
| `volrev` | 0 %  0 %  0 % | 100 %  100 %  88 % |
| `lnexp` | 80 %  87 %  0 % | 74 %  92 %  84 % |
| `croissance` | 0 %  0 %  0 % | 88 %  100 %  83 % |
| `intparties` | 0 %  0 %  0 % | 100 %  100 %  100 % |
| `intsubst` | 0 %  0 %  0 % | 100 %  100 %  100 % |
| `etudelnexp` | 0 %  0 %  23 % | 74 %  82 %  100 % |
| `eqdiff` | 0 %  0 %  0 % | 100 %  100 %  96 % |
| `matrices` | 0 %  0 %  27 % | 100 %  100 %  100 % |
| `translin` | 0 %  0 %  0 % | 93 %  100 %  100 % |
| `appllin` | 0 %  0 %  0 % | 100 %  100 %  71 % |
| `condbayes` | 0 %  0 %  0 % | 47 %  64 %  86 % |
| `varalea` | 0 %  0 %  0 % | 100 %  100 %  94 % |
| `binomiale` | 0 %  0 %  0 % | 81 %  57 %  100 % |
| `normale` | 0 %  0 %  0 % | 100 %  100 %  70 % |
| `statdesc` | 0 %  0 %  0 % | 100 %  79 %  100 % |
| `bayes` | 0 %  0 %  0 % | 100 %  100 %  72 % |
| `syslin` | 0 %  30 %  43 % | 100 %  100 %  100 % |
| `bases` | 0 %  0 %  0 % | 100 %  100 %  100 % |
| `cplxalg` | 0 %  0 %  0 % | 66 %  100 %  100 % |
| `cplxtrig` | 0 %  0 %  0 % | 66 %  59 %  53 % |
| `cplxeq` | 0 %  0 %  0 % | 80 %  66 %  74 % |
| `suitegeom` | 70 %  0 %  0 % | 92 %  65 %  100 % |
| `serie` | 33 %  0 %  0 % | 100 %  44 %  61 % |
| `geoesp` | 0 %  0 %  0 % | 84 %  80 %  77 % |
| `densite` | 0 %  0 %  0 % | 100 %  68 %  46 % |
| `approxnorm` | 0 %  0 %  0 % | 55 %  100 %  59 % |
| `eqabs` | 100 %  70 %  73 % | 100 %  70 %  73 % |
| `eqbic` | 63 %  100 %  100 % | 63 %  100 %  100 % |
| `eqirrmp` | 100 %  100 %  80 % | 100 %  100 %  80 % |
| `eqratmp` | 67 %  100 %  47 % | 67 %  100 %  47 % |
| `puisrat` | 73 %  30 %  77 % | 79 %  65 %  64 % |
| `logdef` | 0 %  0 %  33 % | 91 %  100 %  72 % |
| `logprop` | 0 %  0 %  0 % | 100 %  77 %  61 % |
| `eqexp` | 100 %  100 %  100 % | 100 %  100 %  100 % |
| `eqlog` | 30 %  50 %  70 % | 100 %  100 %  85 % |
| `croissexp` | 0 %  0 %  0 % | 100 %  49 %  43 % |
| `volmp` | 47 %  43 %  27 % | 73 %  85 %  54 % |
| `similmp` | 0 %  0 %  0 % | 69 %  83 %  70 % |
| `coordmp` | 43 %  0 %  0 % | 100 %  59 %  71 % |
| `vectmp` | 0 %  0 %  0 % | 100 %  100 %  58 % |
| `scalmp` | 0 %  0 %  0 % | 85 %  54 %  71 % |
| `projmp` | 0 %  0 %  0 % | 45 %  100 %  66 % |
| `pvectmp` | 0 %  0 %  0 % | 41 %  100 %  100 % |
| `droiteparam` | 0 %  0 %  0 % | 100 %  100 %  72 % |
| `posdroites` | 0 %  0 %  0 % | 39 %  100 %  70 % |
| `ineqmp` | 100 %  73 %  100 % | 100 %  73 %  100 % |
| `fctmp` | 0 %  0 %  0 % | 50 %  73 %  100 % |
| `polymp` | 0 %  0 %  30 % | 62 %  100 %  56 % |
| `sinusmp` | 0 %  0 %  0 % | 78 %  39 %  64 % |
| `explogfn` | 0 %  0 %  0 % | 92 %  69 %  82 % |
| `fratmp` | 0 %  23 %  0 % | 72 %  100 %  0 % |

Restent non couverts : lectures de graphique (tauxvar 1, limites et continuité lues, asymptotes en pointillés, dérivée
seconde lue, fratmp 3, sinusmp lus), quelques formes rares (d'Alembert hors fractions simples, Mac-Laurin autre que e^{ax}).

### Lycée français, niveaux 1 à 3 (27.11, agent/recalcfr)

Champ : les **30 notions propres au lycée français** (catalogue FR, classe 2nde à Tle, `CH: null` ; src/fr_2nde.js,
fr_1re.js, fr_tle.js, fr_lycee.js, fr_fin.js, fr_3e.js pour tabvar, série `stats` de generators.js). Jusque-là, seuls
les défis (niveau 4) étaient recalculés (`recalc_oracles_fr.js`) et quelques formes des niveaux 1 à 3 par les oracles
communs. Nouveau fichier **`tests/recalc_oracles_frl.js`** (chargé après `recalc_oracles34.js`, dont il reprend les
outils numériques) : un oracle par notion, en tête de `RECALC.G`, limité aux niveaux 1 à 3 (`RECALC.IDSFRL`). Il relit
l'énoncé (TeX, ou texte « à plat » pour les contextes) **et la figure quand les données y sont** (nuage de points d'une
suite lu par les graduations, arbre pondéré lu branche par branche, vecteur sur quadrillage, point de l'hyperbole), puis
refait le calcul par une autre voie : itération des suites, dénombrement exhaustif (arbres à 3 épreuves), loi jointe
p · q · r pour les arbres et les probabilités conditionnelles (données « P(A) = … » de l'énoncé, résolution pas à pas),
tableau croisé dont les évènements sont rattachés aux en-têtes par les mots communs, mini-interpréteur Python (def,
if / elif / else, while, for … in range, print), racines numériques, dérivées par différences, intégrales par Simpson,
limites extrapolées, tableaux de variations relus nœud par nœud (flèches contrôlées).

Page **`tests/recalcul_frl.html`** (dans la suite) : chaque question est construite puis **finalisée pour un profil
français de sa classe** (`Engine.finalize` : €, consignes `exact`, `frac`, `final`, comme l'élève la voit) ; 100 graines
par notion et niveau (9 000 énoncés) ; **toutes** les questions doivent être reconnues (une forme non lue = échec) ;
contre-épreuve sur **chaque** énoncé reconnu. Saisie : la réponse recalculée est tapée dans `checkAnswer` — valeur à
l'arrondi demandé, fraction quand l'énoncé dit « fraction » (dénominateur jusqu'à 5 000), écriture exacte avec π ou √
(trigrad, trigfr, lnfr : « 5π/3 », « e^(3)+4 », « ln(7) »), ensembles « a ; b », couples « x ; y ». Options `#ids`, `#n`,
`#detail`, `#miss` (+ `#flat` : texte lu par les oracles). Durée : 23 à 46 s (charge 4 à 6), bien sous la cible de 200 s.
`recalcul.html` et `recalcul2.html` excluent ces notions (pages 1 à 4 : `recalc_oracles_frl.js` chargé, filtre `IDSFRL`).

Couverture (énoncés recalculés aux niveaux 1 / 2 / 3, avant → après ; avant : oracles communs + défis FR, 15 tirages ;
après : 100 tirages, finalisés FR) : **6 notions sur 30 couvertes avant** (≥ 20 % à un niveau, souvent une seule forme),
**30 sur 30 à 100 % aux trois niveaux après** (9 000 / 9 000, 9 000 contre-épreuves détectées).

| Notion | Avant | Après |
|---|---|---|
| `stats` | 100 %  100 %  100 % | 100 %  100 %  100 % |
| `suitedef`, `suitesomme`, `suitelim` | 0 %  0 %  0 % | 100 %  100 %  100 % |
| `suitearith` | 73 %  60 %  0 % | 100 %  100 %  100 % |
| `suitegeo` | 80 %  0 %  0 % | 100 %  100 %  100 % |
| `expfn` | 33 %  20 %  73 % | 100 %  100 %  100 % |
| `lnfr` | 73 %  40 %  73 % | 100 %  100 %  100 % |
| `expderiv` | 80 %  27 %  0 % | 100 %  100 %  100 % |
| `trigfr` | 33 %  33 %  0 % | 100 %  100 %  100 % |
| `fref` | 33 %  40 %  7 % | 100 %  100 %  100 % |
| `tabsignes` | 0 %  100 %  100 % | 100 %  100 %  100 % |
| `tauxevol` | 7 %  0 %  0 % | 100 %  100 %  100 % |
| `pscal`, `probtot`, `vaesp`, `binom`, `vect3e`, `probcond`, `algopy`, `trigrad`, `droitenorm`, `tabvar`, `tvi`, `sommeva`, `recurrence`, `compdiff`, `posrelc`, `intmaj`, `suiteint` | 0 %  0 %  0 % | 100 %  100 %  100 % |

Erreurs trouvées et corrigées :

| Code | Notion (fichier) | Gravité | Avant | Après |
|---|---|---|---|---|
| `tabvar-3-11`, `tabvar-3-1a` (nb-solutions-partiel) | Tableaux de variations (fr_3e.js) | **grave** | « Combien de solutions de f(x) = −7 sur [−2 ; 6] ? » avec f(−2) = −7 : attendu 1 (flèches seulement), il y en a 2 (la borne compte) — k = (y₂ + y₃)/2 tombait sur y₁ | tirage refait quand k est une valeur du tableau |
| `tvi-2-d`, `tvi-2-r`, `tvi-2-1s`, `tvi-2-1w`, `tvi-2-2e` (balayage) | TVI (fr_tle.js) | **grave** | x³ + x = 10 a pour solution 2 : attendu 1,9 « par défaut au dixième », corrigé « f(2) ≈ 0 > 0 » | 10 remplacé par 9 ; garde-fou si f(x + 0,1) = 0 |
| `binom-2-1`, `binom-2-*` (aumoins), `binom-3-b`, `binom-3-*` (auplus) | Loi binomiale (fr_lycee.js) | moyenne | P(X ⩾ 1) = 0,99999 → « 1 » et P(X ⩽ 1) = 0,0004 → « 0 » au millième (environ une question sur huit) : question sans objet | tirage refait si l'arrondi vaut 0 ou 1 (`ok3`) |
| `binom-2-1x`, `binom-2-2l`, `binom-3-a`, `binom-3-1b` | Loi binomiale (fr_lycee.js) | faible | valeur exacte pile entre deux millièmes (0,1875, 0,0625…) : les deux voisins acceptés | tirage refait (`ok3`) |
| `probtot-3-q`, `probtot-3-15`, `probtot-3-1o` (au moins une fois) | Probabilités totales (fr_lycee.js) | faible | 1 − 0,85² = 0,2775 au millième : 0,277 et 0,278 acceptés ; « Probabilité que au moins un panneau », « qu'elle gagne » (code promo) | tirage refait à égalité ; « Probabilité qu'au moins un panneau… », « d'obtenir au moins un code gagnant » |
| `suiteint-3-b`, `suiteint-3-10`… (seuil-exp) | Suites d'intégrales (fr_fin.js) | moyenne | J₅₀ = 0,02(1 − e⁻⁵⁰) < 0,02 : vrai, mais la calculatrice affiche 0,02 ; l'élève qui vérifie répond 51 | seuils 0,1 ; 0,2 ; 0,125 ; 0,25 seulement (e⁻ⁿ visible) |
| `tauxevol-1-z` (cm-vers-taux) | Évolutions (fr_2nde.js) | énoncé | « revient à l'diminuer de combien de pour cent ? » et −8 attendu pour « diminuer de combien » | « On multiplie une quantité par 0,92. Quel est le taux d'évolution correspondant (en %, négatif pour une baisse) ? » |
| `suitegeo-3-b` (lac), `lnfr-3-6` (seuil-lac) | Suites géométriques, ln (fr_lycee.js, fr_tle.js) | énoncé | « leur nombre baisse … passera-t-elle » ; « il en compte 800 poissons au départ » | « passera-t-il » ; « il abrite 800 poissons au départ » |
| `suitelim-1-*` (geo-limite) | Limites de suites (fr_lycee.js) | style | « u_n = 9 + 1 × (1/3)ⁿ » | « u_n = 9 + (1/3)ⁿ » |

Aucune autre réponse attendue fausse sur les 9 000 énoncés. Relevé hors périmètre (src/expr.js, non modifié) : pour une
réponse en couple, « (−5 ; −2) » tapé avec parenthèses est refusé « Parenthèse non fermée » (seul « −5 ; −2 » passe, comme
le demande la consigne) ; la lecture graphique de suitearith-1 (graphique) place parfois u₀ entre deux lignes du
quadrillage (graduation de 2 pour une raison de 3).

## Notions couvertes (taux d'énoncés recalculés aux niveaux 1, 2, 3 ; 100 tirages par niveau ; état du 26.11 après extension)

Avant l'extension (matin du 26.11) : **119 notions** couvertes (≥ 20 % à un niveau). Après : **172 notions** (+53, marquées « nouveau »), 38'173 énoncés recalculés sur 58'560 (avant : 28'827 sur 50'655), 1'176 contre-épreuves.

| Notion | Libellé | Niveaux 1 / 2 / 3 |
|---|---|---|
| `prio` | Priorités des opérations | 82 %  78 %  100 % |
| `pct` | Pourcentages | 100 %  100 %  100 % |
| `puiss` | Puissances | 100 %  76 %  100 % |
| `valnum` | Substituer dans une expression littérale | 100 %  100 %  100 % |
| `reduire` | Réduire une expression | 100 %  100 %  76 % |
| `distrib` | Développer | 100 %  92 %  100 % |
| `idrem` | Identités remarquables | 100 %  77 %  59 % |
| `factor` | Factoriser | 100 %  100 %  58 % |
| `eq1` | Équations du 1er degré | 100 %  79 %  76 % |
| `eq2` | Équations produit nul | 84 %  100 %  74 % |
| `prop` | Quatrième proportionnelle, règle de trois | 100 %  100 %  100 % |
| `vitesse` | Vitesse, distance, durée | 100 %  100 %  100 % |
| `echelle` | Échelles et pentes | 100 %  88 %  100 % |
| `pyth` | Théorème de Pythagore | 100 %  100 %  100 % |
| `vol` | Volumes : prisme droit et cylindre | 100 %  100 %  100 % |
| `thales` | Théorème de Thalès | 100 %  100 %  74 % |
| `eq3` | Équations de degré 3 par factorisation | 100 %  100 %  100 % |
| `eq2disc` | Équations du 2e degré (formule) | 63 %  100 %  59 % |
| `euclide` (nouveau) | Théorèmes d'Euclide et de la hauteur | 100 %  100 %  100 % |
| `trigo` | Trigonométrie du triangle rectangle | 100 %  78 %  100 % |
| `sinlaw` | Triangle quelconque (sinus, cosinus) | 100 %  100 %  100 % |
| `expo` | Exponentielles | 100 %  100 %  0 % |
| `absval` (nouveau) | Valeur absolue | 73 %  100 %  100 % |
| `trigeq` (nouveau) | Équations trigonométriques | 100 %  100 %  100 % |
| `stats` | Statistiques (moyenne, médiane, écart-type) | 100 %  100 %  100 % |
| `angtri` | Somme des angles d'un triangle | 100 %  100 %  100 % |
| `arith` | PGDC et PPMC | 100 %  100 %  100 % |
| `diagr` | Diagrammes et moyennes | 100 %  100 %  100 % |
| `disque` | Cercle et disque | 100 %  100 %  100 % |
| `polyreg` | Polygones réguliers | 100 %  100 %  100 % |
| `volcone` | Volumes : pyramide, cône, boule | 100 %  100 %  100 % |
| `gquot` | Masse volumique et débit | 100 %  40 %  100 % |
| `formule` (nouveau) | Transformer une formule | 100 %  100 %  88 % |
| `simil` | Homothéties et similitudes | 100 %  78 %  100 % |
| `proba` | Probabilités | 100 %  100 %  100 % |
| `polyop` | Polynômes : développer et réduire | 100 %  81 %  100 % |
| `factor2` | Factoriser au maximum | 100 %  100 %  100 % |
| `domaine` (nouveau) | Domaine de définition | 100 %  100 %  100 % |
| `f2expr` (nouveau) | Parabole : retrouver l'expression | 100 %  60 %  98 % |
| `racinv` | Fonctions racine carrée et inverse | 100 %  59 %  30 % |
| `ineq2` | Inéquations du 2e degré | 100 %  79 %  0 % |
| `droitesrem` (nouveau) | Droites remarquables du triangle | 100 %  100 %  100 % |
| `polyfact` | Factoriser un polynôme, racine évidente | 0 %  100 %  100 % |
| `fracrat` | Fractions rationnelles | 72 %  100 %  70 % |
| `eqrat` | Équations rationnelles | 100 %  100 %  100 % |
| `decread` | Lire et décomposer un nombre décimal | 100 %  100 %  100 % |
| `deccomp` (nouveau) | Comparer et ranger des nombres décimaux | 100 %  100 %  100 % |
| `decarr` (nouveau) | Encadrer et arrondir | 100 %  100 %  100 % |
| `ordgr` (nouveau) | Ordre de grandeur | 100 %  100 %  100 % |
| `decadd` | Additionner et soustraire des décimaux | 73 %  72 %  100 % |
| `dec10` | Multiplier et diviser par 10, 100, 1000 | 100 %  100 %  100 % |
| `decmul` | Multiplier des nombres décimaux | 100 %  39 %  67 % |
| `decprob` (nouveau) | Problèmes avec des nombres décimaux | 100 %  100 %  100 % |
| `pow9` | Carrés, cubes et puissances | 39 %  57 %  100 % |
| `multdiv` (nouveau) | Multiples et diviseurs | 100 %  100 %  100 % |
| `divcrit` (nouveau) | Critères de divisibilité | 98 %  71 %  100 % |
| `premiers` (nouveau) | Nombres premiers, décomposition | 100 %  100 %  100 % |
| `relrep` (nouveau) | Nombres relatifs : repérer et comparer | 100 %  100 %  100 % |
| `fracrep` (nouveau) | Fractions : comparer et encadrer | 100 %  100 %  100 % |
| `fracsimp` (nouveau) | Amplifier et simplifier une fraction | 100 %  100 %  100 % |
| `fracconv` | Fraction, nombre décimal, pourcentage | 90 %  100 %  100 % |
| `fracper` (nouveau) | Fractions et nombres périodiques | 100 %  100 %  100 % |
| `fractout` (nouveau) | Fraction d'une quantité | 100 %  100 %  100 % |
| `ulong` (nouveau) | Unités de longueur et de masse | 100 %  100 %  100 % |
| `uaire` (nouveau) | Unités d'aire | 100 %  100 %  100 % |
| `uvol` (nouveau) | Unités de volume et de capacité | 100 %  100 %  100 % |
| `utemps` (nouveau) | Durées et horaires | 100 %  95 %  91 % |
| `perim` (nouveau) | Périmètre d'un polygone | 100 %  100 %  100 % |
| `aire1` (nouveau) | Aire : carré, rectangle, triangle | 100 %  89 %  100 % |
| `aire2` (nouveau) | Aire : parallélogramme, losange | 100 %  100 %  100 % |
| `aire3` (nouveau) | Aire par décomposition | 100 %  100 %  100 % |
| `proptab` (nouveau) | Tableau de proportionnalité | 100 %  100 %  100 % |
| `change` (nouveau) | Taux de change | 100 %  100 %  100 % |
| `agrand` (nouveau) | Agrandir, réduire | 100 %  100 %  100 % |
| `grandmanq` (nouveau) | Retrouver une dimension à partir de l'aire | 100 %  100 %  100 % |
| `fracops` | Fractions relatives et priorités | 100 %  100 %  65 % |
| `voldecomp` (nouveau) | Volumes : décomposition et contenances | 100 %  100 %  100 % |
| `racenc` (nouveau) | Encadrer et comparer des racines | 100 %  100 %  100 % |
| `monomes` (nouveau) | Multiplier des monômes | 100 %  73 %  27 % |
| `pythfig` (nouveau) | Pythagore dans une figure ou un solide | 90 %  100 %  100 % |
| `eqverif` (nouveau) | Vérifier une solution d'équation | 100 %  100 %  100 % |
| `pctvar` | Augmentation et diminution en pourcentage | 100 %  100 %  100 % |
| `pente` | Pente en pourcentage | 100 %  100 %  100 % |
| `airepyr` | Aire d'une pyramide, apothème | 100 %  100 %  38 % |
| `volcomp` (nouveau) | Volume d'un solide composé | 100 %  100 %  100 % |
| `volmanq` (nouveau) | Retrouver une dimension d'un solide | 100 %  100 %  100 % |
| `ucomp` | Convertir des unités composées | 89 %  100 %  100 % |
| `parenth` | Supprimer des parenthèses | 100 %  71 %  70 % |
| `eqfrac` | Équations avec parenthèses ou fractions | 100 %  100 %  100 % |
| `eq2fact` | Équations du 2e degré par factorisation | 69 %  87 %  100 % |
| `probeq2` (nouveau) | Problèmes du 2e degré | 76 %  100 %  100 % |
| `cercthales` (nouveau) | Cercle de Thalès et tangente | 100 %  100 %  100 % |
| `thalesrec` | Réciproque de Thalès | 56 %  100 %  100 % |
| `sysprob` (nouveau) | Problèmes à deux inconnues | 100 %  100 %  100 % |
| `denombr` (nouveau) | Dénombrer | 100 %  100 %  61 % |
| `statfreq` | Effectifs, fréquences, diagramme circulaire | 53 %  0 %  100 % |
| `eqspec` | Équations impossibles ou indéterminées | 100 %  100 %  41 % |
| `bicarre` | Équations bicarrées | 100 %  100 %  100 % |
| `affzero` (nouveau) | Zéro et signe d'une fonction du premier degré | 86 %  100 %  61 % |
| `f2trois` (nouveau) | Parabole passant par trois points | 100 %  100 %  100 % |
| `fracetage` | Fractions à étages | 100 %  0 %  0 % |
| `ineqfrac` | Inéquations fractionnaires | 100 %  100 %  72 % |
| `eqirr` | Équations irrationnelles | 85 %  100 %  100 % |
| `trigrel` (nouveau) | Relations trigonométriques | 100 %  100 %  100 % |
| `expfrac` | Exposants fractionnaires | 84 %  100 %  0 % |
| `racprop` | Racines : propriétés (carrées et cubiques) | 100 %  21 %  31 % |
| `eqabs` (nouveau) |  | 100 %  73 %  76 % |
| `eqbic` | Équations bicarrées, changement de variable | 66 %  100 %  100 % |
| `eqirrmp` | Équations irrationnelles | 100 %  100 %  72 % |
| `eqratmp` | Équations rationnelles | 67 %  100 %  38 % |
| `eqexp` | Équations exponentielles | 100 %  100 %  100 % |
| `ineqmp` | Inéquations, tableau des signes | 100 %  84 %  100 % |
| `tabsignes` | Tableau de signes, inéquations produit et quotient | 0 %  100 %  100 % |
| `derivregles` | Dériver une somme, un polynôme | 66 %  100 %  0 % |
| `ineqpoly` | Inéquations polynomiales (tableau des signes) | 100 %  100 %  100 % |
| `trinfact` | Factoriser un trinôme par ses zéros | 71 %  68 %  98 % |
| `lnexp` | Logarithme et exponentielle | 74 %  92 %  0 % |
| `rel` | Nombres relatifs : multiplier, diviser, priorités | 73 %  76 %  90 % |
| `sys2` | Systèmes de deux équations | 67 %  90 %  29 % |
| `fracadd` | Fractions : additionner, soustraire | 71 %  62 %  89 % |
| `cercle` | Équations de cercles | 0 %  84 %  0 % |
| `rac` | Racines carrées | 82 %  6 %  0 % |
| `pythrec` | Réciproque de Pythagore | 81 %  63 %  31 % |
| `carres` | Carrés parfaits, racines exactes | 53 %  79 %  46 % |
| `expderiv` | Exponentielle : dérivée, tangente, variations | 79 %  35 %  0 % |
| `sci` | Notation scientifique | 78 %  35 %  72 % |
| `log` | Logarithmes | 0 %  78 %  0 % |
| `fimg` | Images et préimages | 71 %  77 %  35 % |
| `ineq` | Inéquations du 1er degré | 70 %  77 %  69 % |
| `probeq` (nouveau) | Mettre un problème en équation | 69 %  77 %  77 % |
| `derivcomp` | Dériver une fonction composée | 74 %  65 %  35 % |
| `sys3` | Systèmes de trois équations | 73 %  69 %  28 % |
| `puisrat` | Puissances d'exposant rationnel | 73 %  40 %  64 % |
| `lnfr` | Logarithme népérien : propriétés, équations, seuils | 72 %  29 %  65 % |
| `angles` | Angles : parallèles, cercle | 44 %  52 %  71 % |
| `quartiles` | Étendue, médiane, quartiles | 71 %  16 %  30 % |
| `expfn` | Fonction exponentielle : propriétés, équations | 29 %  37 %  71 % |
| `derivprodquot` | Dériver un produit, un quotient | 71 %  34 %  35 % |
| `fracmul` | Fractions : multiplier, diviser | 63 %  66 %  70 % |
| `decdiv` | Diviser des nombres décimaux | 66 %  67 %  70 % |
| `f2` | Parabole : zéros et sommet | 63 %  68 %  38 % |
| `vabs` (nouveau) | Valeur absolue d'un nombre | 67 %  63 %  49 % |
| `ineq1` | Inéquations du 1er degré | 51 %  67 %  0 % |
| `volpave` (nouveau) | Cube et pavé : volume et aire | 65 %  0 %  0 % |
| `scicalc` | Calculer en notation scientifique | 65 %  58 %  30 % |
| `exactes` (nouveau) | Longueurs et aires en valeurs exactes | 62 %  0 %  0 % |
| `f2formes` | Formes d'une fonction du 2e degré | 62 %  0 %  61 % |
| `reladd` | Additionner et soustraire des relatifs | 28 %  14 %  61 % |
| `eqlog` | Équations logarithmiques | 37 %  48 %  60 % |
| `fref` | Fonctions de référence : carré, inverse, racine | 28 %  58 %  21 % |
| `volmp` | Volumes des solides | 47 %  56 %  36 % |
| `derivref` | Dérivées des fonctions de référence | 37 %  44 %  55 % |
| `cart` | Distance et milieu | 45 %  0 %  41 % |
| `tabval` | Tableau de valeurs d'une fonction | 43 %  25 %  20 % |
| `syslin` | Systèmes linéaires et matrices (Cramer, inverse) | 0 %  35 %  42 % |
| `affine` | Fonctions affines | 39 %  0 %  41 % |
| `serie` (nouveau) |  | 37 %  0 %  0 % |
| `coordmp` | Coordonnées : distance, milieu, polaires | 36 %  0 %  0 % |
| `trigfr` | Fonctions sinus et cosinus | 35 %  31 %  0 % |
| `ratden` | Rendre rationnel un dénominateur | 34 %  0 %  30 % |
| `trigeq2` (nouveau) | Équations et modèles trigonométriques | 34 %  0 %  27 % |
| `logdef` | Logarithmes : définition et calcul | 0 %  0 %  34 % |
| `airelat` | Aire latérale et totale : prisme, cylindre | 0 %  0 %  32 % |
| `trigexact` | Valeurs exactes, pente et angle | 0 %  32 %  28 % |
| `etudelnexp` | Étude de fonctions avec ln et exp | 0 %  0 %  32 % |
| `droites` | Équations de droites | 0 %  24 %  31 % |
| `sysineq` | Systèmes d'inéquations du 1er degré | 0 %  31 %  0 % |
| `matrices` | Matrices 2 × 2 : calcul, déterminant, inverse | 0 %  0 %  30 % |
| `polymp` | Polynômes : zéros, division, signe | 0 %  0 %  29 % |
| `trigassoc` (nouveau) | Angles associés, relations fondamentales | 24 %  27 %  0 % |
| `sysgraph` | Systèmes : nombre de solutions | 26 %  0 %  0 % |
| `autodnb` | Automatismes du brevet (partie 1) | 0 %  0 %  25 % |

## Notions non couvertes et pourquoi

- **Lecture de figure ou de graphique** (les données ne sont pas dans le texte) : `affine` (lire la pente),
  `fimg` (« la courbe représente »), `angles` (angle marqué), `lectgraph`, `ineqgraph`, `repere`, `repere3d`,
  `rotation`, `symax`, `empil`, `solides`, `tabform5`, `filtre6`, `graphefct`, `sysgraph` en partie.
- **Réponse qui n'est pas un nombre recalculable** (choix, vrai/faux, forme d'écriture, raisonnement) :
  `structexpr`, `tradexpr`, `tradalg`, `implication`, `contrex`, `demoalg`, `recurrence`, `algopy`, `bijection`,
  `ensembles`, `angtype`, `quadri`, `continuite`, `tvi`, `derivth`.
- **Énoncés à mise en équation très variés** (un gabarit par histoire, rendement faible) : `probeq`, `probeq2`,
  `sysprob`, `probrat`, `optim`, `optimderiv`, `modaff`, `modexp`, `croissexp`, `croissance`, `decprob`.
- **Niveaux avancés** (outillés le 27.11 par `tests/recalc_oracles34.js`, voir « 3e–4e Collège et MP 3e–4e ») :
  `vectmp`, `scalmp`, `projmp`, `pvectmp`, `vect3d`, `colin`, `droite3d`, `plans`, `posrel`, `pscal3d`, `distances`,
  `sphere`, `pvect`, `cplxalg`, `cplxtrig`, `cplxeq`, `primitives`, `integrale`, `aireint`, `volrev`, `intparties`,
  `intsubst`, `eqdiff`, `suitedef`, `suitesomme`, `suitelim`, `serie`, `binom`,
  `binomiale`, `normale`, `approxnorm`, `densite`, `varalea`, `vaesp`, `matrices`, `translin`, `appllin`, `bases`.
- **Couverture partielle restante** (après l'extension du soir) : `absval` niveau 1 (formes rares), `affzero` niveau 3
  (comparaison de forfaits), `polydiv` 3, `combi` 3, `milieux` 3, `suitearith` / `suitegeo` (problèmes à contexte),
  `suitesomme`, `tangente` (lecture de la tangente sur la figure), `interpar`, `geocomb`, `morceaux`, `litelab`,
  `tradexpr` (réponse = expression). transf, trigcercle, trigfn, recip, homog, inter et les lectures de f2 / f2expr sont
  maintenant couverts.
- **Exercices riches** : leurs parties n'ont pas de réponse attendue automatique (barème en points) ; **défis**
  (niveau 4) : seule la canette est reconnue (14 tirages) — les défis sont des problèmes à étapes, un gabarit par
  défi.

Liste brute des notions sous 20 % (après extension) : `fratmp`, `optim`, `combi`, `tauxevol`, `automat`, `inter`, `recip`, `trigcercle`, `polydiv`, `homog`, `trigfn`, `tradexpr`, `solides`, `litelab`, `angtype`, `quadri`, `repere`, `rotation`, `ensembles`, `valint`, `eqparam`, `modexp`, `compo`, `lectgraph`, `interpar`, `modaff`, `geocomb`, `probrat`, `bijection`, `decomp`, `polyexpr`, `homogrec`, `logbase`, `triaire`, `droitesinter`, `cercletan`, `symetries`, `morceaux`, `transf`, `vecteurs`, `recipaff`, `logprop`, `croissexp`, `similmp`, `vectmp`, `scalmp`, `projmp`, `pvectmp`, `droiteparam`, `posdroites`, `fctmp`, `sinusmp`, `explogfn`, `suitedef`, `suitesomme`, `pscal`, `probtot`, `vaesp`, `suitelim`, `binom`, `proba2`, `vect3e`, `probcond`, `algopy`, `tauxvar`, `nbderive`, `tangente`, `variations`, `optimderiv`, `limites`, `limitinf`, `asymptotes`, `continuite`, `derivseconde`, `etudefct`, `probaxiomes`, `probarbre`, `derivth`, `vect3d`, `colin`, `droite3d`, `plans`, `posrel`, `pscal3d`, `distances`, `sphere`, `pvect`, `primitives`, `integrale`, `aireint`, `volrev`, `croissance`, `intparties`, `intsubst`, `eqdiff`, `translin`, `appllin`, `condbayes`, `varalea`, `binomiale`, `normale`, `statdesc`, `bayes`, `bases`, `cplxalg`, `cplxtrig`, `cplxeq`, `suitegeom`, `geoesp`, `densite`, `approxnorm`, `tradalg`, `contrex`, `demoalg`, `implication`, `graphefct`, `ineqgraph`, `repere3d`, `progcalc`, `ratio`, `milieux`, `structexpr`, `motifs`, `trigrad`, `droitenorm`, `linfn`, `cos4e`, `thales4e`, `vecgeo`, `tabvar`, `tvi`, `sommeva`, `recurrence`, `symax`, `mediatrice`, `echelle6`, `proba6`, `empil`, `compdiff`, `posrelc`, `intmaj`, `suiteint`, `cercle6`, `bissec6`, `filtre6`, `tabform5`, `hauteurs5`.

## Défis à 3 contextes (agent defisch, 26.11 soir)

Section « agent defisch » de `tests/recalc_oracles.js` : un oracle `DF` par contexte pour 56 défis (gabarits d'origine
compris), helpers `rx` / `rs` (nombre « # », relatif « § »), `pick` (réponse selon la lettre de la partie). `check()`
recalcule aussi les parties de défi dont la réponse est un couple (coordonnées : symetries, rotation). Mesure :
`tests/_defis3.html#ids=…&n=150` ; `tests/recalcul2.html` reste sous 40 s à charge normale.
