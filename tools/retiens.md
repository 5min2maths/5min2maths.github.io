# « Retiens » des leçons actives : écarts et corrections (24.11)

Règle de l'enseignant (15.11) : l'étape « Retiens » d'une leçon active n'affiche que ce que les défis (Devine, défis montrés, messages de réussite et coups de pouce) ont présenté, avec le vocabulaire exact.

**Mécanisme** : champ facultatif `retiens: { regle, exemple: […], piege }` (ou fonction `(L) => {…}`) dans `ACTIVE[id]`. Chaque champ donné remplace celui de `LESSONS[id]` dans l'étape 3 (`actRetiens`, src/active.js) ; titre et introduction inchangés ; sans champ, la leçon générale. La leçon générale reste affichée ailleurs (rappel de cours, 📖 Leçon des questions). Test : tests/act_retiens.html (leçons sans champ : leçon générale inchangée ; avec champ : règle, exemples et piège affichés, `\(` `\)` appariés).

**Audit** : `nice python3 tools/audit_retiens.py [act_….js]` génère tests/_retiens_audit.html (non commité), vide le Retiens réellement affiché et les textes des défis, et écrit tools/audit-retiens.md (non commité) : unités du Retiens dont les mots-clés ou symboles (sin, ln, det, π, %…) n'apparaissent pas dans le bloc de la leçon. Heuristique bruyante (reformulations) : chaque leçon a été relue à la main.

**Mode « À toi : 2 questions »** : une seule des questions est cachée (la 2e sur 3, en général) ; une règle présentée seulement dans ce défi caché compte comme non vue.

Bilan : 149 leçons corrigées par un Retiens propre, sur 225 leçons actives relues. Aucun défi ajouté (les générateurs et les jeux n'ont pas été touchés) : les règles non présentées ont été retirées du Retiens, pas ajoutées aux défis.

## act_col34.js

| Leçon | Écart | Correction |
|---|---|---|
| binomiale | V(X) = np(1 − p) non vue | retirée |
| croissance | refroidissement et croissance limitée non vus | retirés ; « pour trouver t : isoler, puis ln » gardé |
| derivcomp | (sin u)' et exemple sin(3x) non vus | remplacés par cos(2x) du défi |
| derivprodquot | « dénominateur gardé au carré » jamais dit | retiré |
| derivref | (cos x)' et constante seulement en aparté (Devine, message) ; exemples x√x et 1/x³ non vus | retiens : xⁿ, 1/x, √x, sin, exemples des défis |
| derivregles | « quotient simple simplifié » jamais vu | retiré ; tangente horizontale f' = 0 (défi 3) ajoutée |
| integrale | linéarité, Chasles, ∫ inversée non vus | retirés |
| lnexp | ln(ab), (ln u)', primitives u'/u et u'eᵘ non vus | retirés ; ln(aⁿ) (coup de pouce) gardé ; exemples des défis |
| matrices | somme et produit par un nombre, det(AB), det(kA) non vus | retirés ; exemple = matrice des défis |
| normale | valeur centrée réduite z non vue | retirée |
| primitives | 1/x² → −1/x et sin → −cos non vus | retirés |
| translin | rotation d'angle θ quelconque non vue | retirée |
| varalea | écart-type, E(aX + b), V(aX + b) non vus | retirés ; jeu équitable ajouté (défi 1) |
| variations | « tableau de signes » jamais présenté | « signe de f' de part et d'autre » |

Relues, sans écart retenu : aireint, condbayes, nbderive, optimderiv, tangente, tauxvar, volrev.

## act_mp34.js

| Leçon | Écart | Correction |
|---|---|---|
| coordmp | 3D, passage cartésien → polaire et quadrant non vus | retirés |
| croissexp | intérêts composés, dépréciation, demi-vie, n = log k ÷ log q non vus | exemples des défis |
| droiteparam | angle entre deux droites, intersection (t et s) non vus | coupe des axes (défis) |
| eqabs | /A/ = /B/ et membre de droite avec x non vus | retirés |
| eqbic | X = x³, √x, x² − 2x et exemple en √x non vus | retirés ; exemples des défis |
| eqexp | X = bˣ (b²ˣ) et bˣ > 0 non vus | retirés |
| eqirrmp | conditions (radicande ≥ 0, membre ≥ 0) non présentées | méthode isoler / carré / vérifier |
| eqlog | log A = log B ⇒ A = B non vu | retiré |
| eqratmp | « factorise le dénominateur » non vu ; exemples des défis | règle réduite à ce qui est vu |
| explogfn | sens de variation, asymptote verticale du log non vus | retirés |
| fctmp | parité, étirements kf(x), f(kx) non vus | retirés ; composition et ordre (défi) |
| fratmp | forme k/(x − h) + v (hyperbole) non vue | retirée |
| logdef | changement de base et log₄ 2 non vus | retirés |
| logprop | log(a/b) et changement de base non vus | retirés |
| polymp | Horner, « zéro entier divise le terme constant », tableau de signes non vus | retirés |
| projmp | projeté d'un point sur une droite, distance point-droite non vus | retirés |
| puisrat | règles de calcul aᴿaˢ, aᴿ/aˢ, (aᴿ)ˢ et exemples ∛x², x√x non vus | retirés |
| pvectmp | vecteurs colinéaires, ordre (v × u = −u × v), moment non vus | retirés |
| scalmp | signe (aigu, obtus), travail d'une force non vus | retirés |
| similmp | aires × k² non vues (seulement les volumes) | retirées |
| sinusmp | lecture de a et d sur un graphe non vue | retirée ; quart de période (défi 3) |
| vectmp | combinaisons au + bv et colinéarité non vues | retirées |
| volmp | prisme, pyramide, boule, solide composé non vus | cylindre et cône |

Relues, sans écart retenu : ineqmp, posdroites.

## act_2c.js

| Leçon | Écart | Correction |
|---|---|---|
| bijection | exemple « x³ et 2x + 1 injectives » non vu | contre-exemple x² |
| cart | pente de (AB) jamais vue (défis : milieu, distance) | retirée, piège sur la pente remplacé |
| decomp | exemple 1/(x² + 4) = défi caché en mode À toi | (2x − 5)³ |
| expfrac | (aʳ)ˢ et exemple ∛x² · √x non vus | retirés |
| expo | intérêts composés non vus (curseur sur y = bˣ) | base > 1 / < 1 et même base (défis) |
| homog | zéro et réciproque jamais vus dans les défis | retirés |
| log | ln c ÷ ln b et propriétés log(ab), log(a/b), log(aⁿ) non vus | lecture sur la courbe, log négatif |
| logbase | log_a b · log_b c = log_a c et « ln 8/ln 4 ≠ ln 2 » non vus | retirés |
| modexp | « un logarithme pour trouver un temps » non vu (curseurs) | demi-vie ajoutée (défi 3) |
| polyexpr | exemple de la boîte V(x) = x(L − 2x)² non vu | zéro double (défi 3) |
| polyfact | piège « X = x² » (équation bicarrée) hors sujet des défis | remplacé (diviseurs du terme constant) |

Relues, sans écart retenu : cercle, compo, eqrat, fracetage, homogrec, polydiv, probrat, recip, vecteurs.

## act_mp2.js

| Leçon | Écart | Correction |
|---|---|---|
| droites | calcul de h (défi caché en mode À toi), parallèles et droite verticale non vus | retirés |
| droitesinter | perpendiculaires, médiatrice, hauteur jamais vues (défis : égaler deux y) | retirées |
| recipaff | formule (x − b)/a et symétrie par rapport à y = x non vues | résoudre f(x) = b, échange des coordonnées |
| statfreq | effectif cumulé non vu | retiré |
| stats | écart-type non vu | retiré ; exemples des défis |
| triaire | théorème du cosinus (3e côté) non vu | parallélogramme (défi 3) |
| trigassoc | cos(180° − α), sin(90° − α), (180° + α) (défi caché), cos(90° + α), tan non vus | retirés |
| trigcercle | 1° = π/180, sens de rotation, tableau des valeurs remarquables non vus | angle de référence + signe |
| trigeq2 | résolution de sin(kx) = c non vue | maximum, période, premier maximum (défis) |

Relues, sans écart retenu : quartiles, sinlaw, trigeq, trigfn.

## act_1c.js

| Leçon | Écart | Correction |
|---|---|---|
| droitesrem | médiatrices, bissectrices, hauteurs, orthocentre non vus | retirés |
| ensembles | inclusions ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ non vues | retirées |
| euclide | théorème d'Euclide a² = p · c seulement dans le défi caché (mode À toi) | retiré |
| exactes | aire du triangle équilatéral non vue | retirée |
| f2expr | forme sommet a(x − h)² + k non vue | retirée |
| factor2 | méthode m et n (trinôme) et groupements non vus | retirés |
| fracrat | addition de fractions rationnelles non vue | retirée |
| geocomb | aire écrite de deux façons (défi caché) et trigonométrie non vues | losange, pavé |
| ineq | tableau des signes jamais présenté (défis : inéquations du 1er degré) | isoler x, retourner le sens |
| ineq2 | piège Δ < 0 non vu | remplacé (x² ≤ 16) |
| ineqfrac | exemple (x + 3)/(x − 1) ≥ 1 et « on soustrait » non vus | retirés |
| interpar | discriminant et intersection avec 1/x non vus | retirés |
| lectgraph | croissance de la fonction non vue | retirée |
| optim | exemple h(t) = −5t² + 20t non vu | rectangle du défi |
| pct | « p % de N » seul (défi caché) | hausse en %, prix de départ (défis montrés) |
| polyop | (a + b)(a − b) (défi caché), parenthèse précédée de −, exemple non vu | retirés |
| racinv | résolution de √x = x − 2 avec vérification non vue | √x = a, f(x) = 12/x (défis) |
| ratden | expression conjuguée seulement dans le défi caché | retirée |
| transf | k · f(x) (étirement, retournement) non vu | retiré |
| trigo | exemple tangente (défi caché) et réglage de la calculatrice non vus | remplacés |
| trinfact | coefficient a ≠ 1 non vu | retiré ; piège remplacé |

Relues, sans écart retenu : absval, domaine, eqparam, f2, f2trois, fimg, inter, morceaux, racenc, tradexpr, trigexact, trigrel, vabs, valint.

## act_9a.js

| Leçon | Écart | Correction |
|---|---|---|
| dec10 | × 0,1, : 0,1 et × 0,01 jamais vus (défis : déplacer la virgule) | retirés |
| pow9 | 10ⁿ et 5³ (défi caché) non vus | retirés |
| quadri | angles opposés égaux, diagonales du losange perpendiculaires non vus | retirés |
| uaire | are (1 a = 100 m²) non vu | retiré |
| uvol | volumes m³ ↔ dm³ ↔ L (défi caché) non vus | capacités, 1 dm³ = 1 L |

Relues, sans écart retenu : aire1, aire2, aire3, angtype, decadd, decarr, deccomp, decdiv, decmul, decprob, decread, ordgr, perim, reladd, relrep, ulong.

## act_9b.js

| Leçon | Écart | Correction |
|---|---|---|
| fracper | exemple 3/11 (défi caché) | 8/3, 1,222… |
| fracrep | nombre fractionnaire 17/5 entre 3 et 4 non vu | retiré |
| fracsimp | exemple 36/48 non vu | 12/18 du défi |
| prop | piège « âge et taille » non vu | remplacé par celui du Devine |
| solides | cube et pavé (6, 12, 8), « 4 arêtes de chaque longueur » non vus | prisme seulement |
| volpave | aire totale du pavé non vue | retirée |

Relues, sans écart retenu : agrand, change, proptab, symetries.

## act_ch11b.js

| Leçon | Écart | Correction |
|---|---|---|
| airepyr | aire latérale et totale non vues (défis : apothème) | retirées |
| fracmul | division par une fraction, simplifier avant, fraction d'un nombre non vus (défis : fraction d'une fraction) | retirés |
| puiss | règles aᵐ · aⁿ, aᵐ/aⁿ, (aᵐ)ⁿ, −3² ≠ (−3)², 2⁵ · 5⁵ non vus (escalier des puissances) | retirés |
| pythfig | triangle isocèle (défi caché) et pyramide non vus | retirés |
| pythrec | équerre des maçons (3, 4, 5) non vue | retirée ; exemples des défis |
| sci | comparaison et 34 · 10⁵ non vus | retirés |
| scicalc | quotient (défi caché) | retiré |
| volcomp | silo, cube percé, gélule (demi-boule, trou) non vus | exemples des défis |
| volcone | boule, sphère, facteur k³ non vus (défis : combien de cônes pour remplir) | retirés |
| volmanq | cône (défi caché), boule, conversion litres non vus | retirés |

## act_ch11c.js

| Leçon | Écart | Correction |
|---|---|---|
| carres | cubes et racines cubiques non vus | retirés |
| denombr | « un élément ne peut pas être repris » (podium, défi caché) et codes non vus | retirés |
| fracops | priorités (défi caché) et exemple non vus | règle des signes (Devine) et défis montrés |

Relues, sans écart retenu : pctvar, repere, tabval, thalesrec.

## act_eq1c.js

| Leçon | Écart | Correction |
|---|---|---|
| eq2 | facteur qui ne s'annule jamais, produit de trois facteurs non vus | retirés |
| eq2disc | formule (−b ± √Δ)/2a, somme et produit des solutions non vus (défis : choisir c selon Δ) | retirés |
| eq2fact | cas a = 0 / a < 0, identité et trinôme (x² + 4x = 21), 4x² = 9 non vus | retirés |
| eq3 | mise en évidence de x² ou d'un groupe (x³ + 2x² − 9x − 18) non vue | retirée |
| eqfrac | développer les parenthèses, « − » devant une fraction, produit en croix non vus | retirés ; exemples des défis |
| formule | lettre au carré (A = πr²) et piège v = u + at non vus | retirés |
| probeq | exemples réduction de 20 % et moyenne de notes, piège « solution sans sens » non vus | exemples des défis |
| probeq2 | entiers consécutifs de produit 72 non vus | aire 70 (défi 2) |

Relues, sans écart retenu : bicarre, eqirr, eqspec.

## act_litt11.js

| Leçon | Écart | Correction |
|---|---|---|
| litelab | parité (2n, 2n + 1), consécutifs et exemples (carré d'une somme, périmètre) non vus | machines A et B des défis |
| monomes | produit des coefficients, puissance d'un monôme (−3x²)² non vus | exposants seulement |
| parenth | crochets non vus | retirés ; exemples des défis |
| valnum | exemple à deux lettres a, b non vu | exemples des défis |

## act_sys1c.js

| Leçon | Écart | Correction |
|---|---|---|
| affzero | comparaison f(x) > g(x) par le signe de f − g non vue | retirée |
| sysgraph | exemple 2x + 3y = 6 / 4x + 6y = 12 non vu | x + y = 4 (défi 2) |
| sys3 | élimination par combinaison de paires de lignes non vue (défis : système en escalier, somme des lignes) | retirée |
| sysprob | exemple du bateau (courant) non vu | exemples des défis |

## act_prop11.js

| Leçon | Écart | Correction |
|---|---|---|
| gquot | débit (V = débit · t), air, piscine non vus | retirés ; or et glaçon des défis |
| ucomp | masses volumiques (g/cm³ ↔ kg/m³) et débit L/min non vus | retirés |

Relues, sans écart retenu : vitesse.

## active.js

| Leçon | Écart | Correction |
|---|---|---|
| cercletan | équation du cercle, cercle de diamètre [AB], distance d'un point à une droite non vus (défis : pente de la tangente) | retirés |
| divcrit | critères par 10 et par 25 non vus | retirés ; exemple 1350 remplacé |
| fractout | problème à l'envers (les 3/5 valent 18) et exemple « filles / garçons » non vus | retirés |
| multdiv | multiples de 7 non vus | diviseurs de 18 (défi 2) |
| prio | puissances et « de gauche à droite » (12 : 2 · 3) non vus | retirés ; exemples des défis |

Relues, sans écart retenu : arith, premiers.

## act_10a.js

Relues, sans écart retenu : airelat, disque, grandmanq, voldecomp.

## act_10b.js

| Leçon | Écart | Correction |
|---|---|---|
| echelle | aires × k², volumes × k³ non vus | conversions (défis) |
| polyreg | piège somme des angles (n − 2) · 180° non vu | remplacé |

Relues, sans écart retenu : eqverif, rotation.

## act_11d.js

| Leçon | Écart | Correction |
|---|---|---|
| racprop | √(a ÷ b), (√a)², racine cubique d'un négatif, ∛1080 non vus | retirés ; ∛2 · ∛4 (défi 4) |

Relues, sans écart retenu : rac.

## act_manip.js

| Leçon | Écart | Correction |
|---|---|---|
| affine | b = f(x₁) − a · x₁, droites parallèles, taxi non vus | retirés |
| fracconv | décimal → fraction, nombres périodiques, piège deux baisses de 20 % non vus | retirés |
| pyth | cathète par soustraction et écriture a√b non vues (défis : angle droit, obtus) | retirées ; obtus ajouté |
| sysineq | cas sans solution (S = ∅) non vu | retiré |

## act_manip2.js

| Leçon | Écart | Correction |
|---|---|---|
| angles | Retiens hors sujet (angle au centre, angle inscrit) : les défis portent sur les parallèles et la sécante | alternes-internes, co-intérieurs |
| angtri | somme des angles du quadrilatère (360°) non vue | retirée |
| cercthales | tangente perpendiculaire au rayon non vue | retirée ; angle au centre (défi 3) ajouté |
| diagr | moyenne avec effectifs et diagramme circulaire non vus | retirés |
| distrib | exemple 2x(4x² + x − 3) non vu | exemples des défis |
| eq1 | solution négative et solution fractionnaire non vues | exemples des défis |
| factor | identités a² − b², carré parfait et piège (2x + 1)(3x − 1) non vus | mise en évidence seulement |
| fracadd | entier écrit en fraction, soustraction non vus | retirés |
| idrem | (a − b)² et (a + b)(a − b) non vus (défis : carrés x + 1, x + 2, x + 3) | retirés |
| modaff | exemple de l'abonnement non vu | taxis des défis |
| proba | arbre, tirages sans remise, somme de deux dés non vus | retirés |
| reduire | exemple à deux lettres (2xy) non vu | exemples des défis |
| rel | règle des signes de la multiplication et −3² non vues (défis : additions et soustractions) | retirées |
| simil | volumes × k³ et maquette non vus | retirés |
| sys2 | substitution et combinaison (multiplier les équations) non vues (défis : placer le point commun) | retirées |
| utemps | secondes (7'274 s) et durée entre deux horaires non vues | retirées |
| vol | prisme, cylindre, contenances (L, cL) non vus | pavé seulement |

Relues, sans écart retenu : f2formes, pente, thales.

## Points à contrôler

- **angles** (act_manip2.js) : la leçon s'intitule « Angle au centre, angle inscrit » mais les défis portent sur deux parallèles et une sécante. Le Retiens suit les défis ; le titre (LESSONS) et le rattachement de la notion sont à revoir.
- **ineq** (act_1c.js) : titre « Tableau des signes », défis d'inéquations du 1er degré ; même question.
- **rel** (act_manip2.js) : la règle des signes de la multiplication n'est plus dans le Retiens (défis : additions et soustractions) ; à ajouter en défi si la notion doit la couvrir.
- Leçons où la notion est plus large que les défis (lnexp, matrices, derivref, primitives, varalea, puiss, volcone, fctmp…) : si ces règles doivent être apprises ici, il faut ajouter des défis courts (générateurs à modifier, non fait : autre agent sur les générateurs).
- Exemples réécrits avec les nombres des défis : vérifier l'exactitude (calculs refaits à la main, pas par un test).
- Après correction, l'audit passe de 184 leçons signalées (score 1'597) à 104 (score 660), presque tous des écarts de vocabulaire de méthode (« repérer », « tableau », « vérifier ») relus et gardés. Restent avec la leçon générale : les leçons listées « sans écart retenu » ci-dessus ; écarts mineurs de vocabulaire possibles (ex. nbderive : notation lim jamais écrite dans les défis).
