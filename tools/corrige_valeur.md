# Garde-fou « la réponse est dans le corrigé » (27.11, agent corrige)

Constat : plusieurs agents avaient trouvé des corrigés qui s'arrêtaient avant la réponse demandée (« 2a = −6 » sans
« a = −3 »), qui oubliaient le nombre de solutions ou qui donnaient un signe faux alors que la réponse attendue était
juste. Rien ne le contrôlait de façon systématique, sauf `tests/primaire.html` pour les notions de primaire.

## Pages de test (dans la suite, `tools/run_tests.sh`)

| page | contenu | questions (30 graines) | durée seule |
|---|---|---|---|
| `tests/corrige_valeur.html` | GEN niveaux 1 à 3, les 334 notions, textes suisses (CO 9e–11e, Collège 1re–4e MA1/MA2, MP 1re–4e) | 30'060 | ≈ 20 s |
| `tests/corrige_valeur_defis.html` | niveau 4 (problèmes à parties), 300 notions, max(30, 3 × nombre de défis) graines | 9'000 | ≈ 9 s |
| `tests/corrige_valeur_fr.html` | profils France 6e–3e (`Engine.finalize` : ×, milliers 1 200, notes sur 20), niveaux 1 à 4 | 32'205 | ≈ 38 s |
| `tests/corrige_valeur_frl.html` | profils France 2nde–Tle, niveaux 1 à 4 | 53'950 | ≈ 76 s |

Le contrôle est dans `tests/corrige_valeur.js` (`CV.check`) ; paramètres : `#n=30` (graines), `#ids=eq1,pyth`,
`#detail` (tous les exemples). Profils suisses : `Engine.build` suffit, `finalize` ne touche ni le corrigé ni la valeur
attendue pour un profil CH (seulement les marques de forme de la réponse : final, radical, exact…).

Couverture par classe (notions du catalogue, `Engine.catalog`) : 9e 49, 10e 83, 11e 109, 1re Collège 152, 2e 186,
3e MA1 211 / MA2 214, 4e MA1 230 / MA2 243, MP 1re 124, 2e 145, 3e 157, 4e 170 ; France 6e 36, 5e 68, 4e 93, 3e 115,
2nde 134, 1re 165, Tle 201. Toutes construites par GEN (une notion du catalogue absente de GEN ferait échouer la page).

## Méthode

1. Le corrigé (HTML + TeX) est mis en texte calculable : fractions imbriquées `\frac`, `\sqrt`, `\sqrt[3]`, puissances,
   fonctions (ln, sin, cos, e), π, virgule décimale, milliers 1'200 ou 1\,200, `·` ou `×`, matrices (une case = un
   nombre), étiquettes de parties a) b) retirées.
2. Réponse cherchée selon la forme :
   - **value** : un nombre du corrigé vaut la réponse, **signe compris** (un « − » binaire, « 38 − 8 », n'est pas un
     signe ; « vaut −3 », « = −3 », « (−3) » le sont), à l'arrondi annoncé près (`spec.round`) ou affiché arrondi (≈, deux
     décimales et plus). Formes reconnues : entier, décimal, fraction, a√b, (a ± √b)/c, aπ, (5/2)π, a · 10^n, %, et les
     formes exactes non rationnelles prises en entier dans un membre d'égalité (« 2 − 10e^(−2) », « 4 − 4 ln 4 »,
     « 36 − 9π cm² »). Comptent aussi, comme « parties » de réponse : numérateur et dénominateur d'une fraction (« ?/21 »),
     coefficient de a√b ou aπ, exposant de a · 10^n, coefficients et terme constant d'une expression donnée à droite de
     « y = » ou « f(x) = » (jamais dans un facteur (x − 3), où le signe est l'inverse de la racine), nombres écrits en
     lettres (« aucun zéro », « deux solutions ») et oui / non quand la consigne dit « 1 pour oui, 0 pour non ».
   - **set / pair** : chaque valeur attendue est dans le corrigé ; ensemble vide (« aucune ») ou « tous les nombres »
     écrits en toutes lettres.
   - **expr** : un membre d'égalité du corrigé (ou le contenu d'une parenthèse) est accepté par le correcteur de l'app
     (`checkAnswer`, forme exigée comprise : réduite, développée, factorisée, une seule fraction…), comme si l'élève
     l'avait tapé. L'expression de départ, équivalente mais pas dans la forme demandée, ne suffit donc pas.
   - **ineq** : « x > 4 », « 4 < x » ou « ]4 ; +∞[ » avec le bon sens et la bonne borne.
   - **solset** : chaque borne finie est dans le corrigé, avec un symbole d'inégalité ou d'intervalle (contrôle plus
     faible que les autres : le sens des crochets n'est pas vérifié).
   - Problèmes (niveau 4) : chaque partie dans le corrigé global.
3. **Fin contradictoire** : un corrigé qui se termine par « lettre = nombre » doit finir sur la réponse (ou une des
   valeurs attendues), sauf si la dernière phrase est une vérification ou dit aussi la réponse (« Donc a = −4 et b = 6 »).
4. **Contre-épreuve** (5 premières graines de chaque notion et niveau) : la réponse est faussée (signe inversé, valeur
   décalée, sens d'inégalité inversé, expression + 1) ; le contrôle doit la déclarer absente. Seuil 90 % (`CV_TAUX`) ;
   mesuré : 96,7 % (CH), 93,9 % (défis), 98,7 % (France collège), 97,1 % (France lycée). Les cas non repérés sont des
   valeurs faussées qui figurent légitimement dans une étape (−v dans un calcul intermédiaire).

## Écarts trouvés et corrigés (générateurs)

| notion (exemple) | défaut | correction |
|---|---|---|
| angtype-3 (`angtype-3-2`) | « combien d'angles droits ou plats ? » : angles listés, nombre absent | « …, soit 2 angles » (`src/variantes.js`) |
| bijection-3 (`bijection-3-1`) | fonctions injectives listées, nombre absent | « soit 4 fonctions » (`src/gen3.js`) |
| ensco-2, ensco-3, ensco-4 (`ensco-2-8`, `ensco-4-1`) | affirmations ou nombres listés, compte absent | « soit 2 affirmations », « 3 vraies : … », « soit 2 ; soit 4 ; soit 6 » (`src/perco.js`) |
| litconv-3 (`litconv-3-8`) | expressions équivalentes listées, compte absent | « soit 3 expressions » (`src/perco.js`) |
| demoalg-1 (`demoalg-1-5`) | « (2k)² = 4k² », contenu de la parenthèse jamais écrit | « = 4(k²) » (`src/ch1c_arg.js`) |
| implication-1, implication-2 (`implication-2-3`) | « (1) fausse, (2) fausse » : la réponse à taper (« aucune ») absente | « Réponse : aucune. » / « Réponse : 1 ; 2. » sur les 4 formes (`src/ch1c_arg.js`) |
| cplxalg-3 (`cplxalg-3-3`) | s'arrête à x = 1, y = 5 | « donc z = 1 + 5i » (`src/ch4c_ana.js`) |
| cplxeq-3 (`cplxeq-3-2`) | solution imaginaire pure jamais écrite | « donc z = 3i » (`src/ch4c_ana.js`) |
| eqdiff-2 (`eqdiff-2-5`) | s'arrête à K = 3 | « donc y = 3e^{2x²} » (`src/ch4c_ana.js`) |
| derivcomp-3 (`derivcomp-3-a`) | corrigé « 3,333333π » (tolérance de `den` trop fine) | `den` à 1e-7 dans `src/ch3c_ana.js` : « (10/3)π » |
| derivregles-3, derivprodquot-3 (`derivregles-3-2`, `derivprodquot-3-3`) | s'arrête à « 3(x + 2)(x − 4) = 0 », « nul pour x² = 1 » | solutions écrites (`src/ch3c_ana.js`) |
| derivregles-4, aireint-4 (`derivregles-4-4`, `aireint-4-1`) | partie a) arrêtée à la factorisation | « : x = −1 et x = 5 » (`src/defis.js`, 3 problèmes) |
| f2-3 (`f2-3-4`) | « x = 4 ± 2 » | « donc x = 2 ou x = 6 » (`src/ch1c_alg.js`) |
| f2formes-3 (`f2formes-3-1`) | forme canonique sans le couple demandé | « h = −3, k = 8 » (`src/ch1c_alg.js`) |
| factor2-1 (`factor2-1-2`) | « mise en évidence de 4, puis x² − 81 = (x − 9)(x + 9) » : le 4 disparaît | « : 4(x − 9)(x + 9) » (`src/ch1c_alg.js`) |
| f2expr-2, f2expr-3, f2trois-1/2/3 (`f2trois-2-4`) | a, b, c trouvés, f(x) jamais écrite | « : f(x) = 2x² + 3x + 4 » (6 formes, `src/ch1c_f2b.js`) |
| inter-1, interpar-1 (`interpar-1-1`) | s'arrête à « (x + 3)(x − 4) = 0 », « x² = 16 » | solutions écrites (`src/ch1c_f2b.js`, 3 formes) |
| graphefct-1 (`graphefct-1-3`) | numéros des tableaux qui conviennent jamais écrits | « Conviennent : tableaux 2 ; 3 ; 4 » (`src/ch1c_trous.js`) |
| valint-3 (`valint-3-1`) | s'arrête à la factorisation | « : 0, −2 et 2 » (`src/ch_mp1.js`) |
| sys3-1 (`sys3-1-5`) | s'arrête à y = 4 | « puis x = −4 et z = −1 » (`src/ch1c_sys.js`) |
| plans-3 (`plans-3-6`) | b, c, d demandés, seule l'équation du plan donnée | « donc b = −1, c = −2, d = −4 » (`src/ch3c_geo.js`) |
| trigassoc-1 (`trigassoc-1-1`) | angle de référence et signe, valeur absente | « : sin 225° ≈ −0,71 » (`src/ch_mp2.js`) |
| trigcercle-3 (`trigcercle-3-c`) | tan de l'angle de référence et signe, valeur absente | « donc tan 150° = −√3/3 » (`src/ch_mp2.js`) |
| trigeq-3 (`trigeq-3-1`) | « 4 solutions » sans les lister | solutions listées (`src/ch2c.js`, 2 formes) |
| trigeq-4 (`trigeq-4-6`) | partie b) (nombre de solutions) absente dans une des deux formes | « b) 3 solutions » (`src/defis.js`) |
| eqirrmp-4 (`eqirrmp-4-4`) | partie a) : c jamais écrit | « donc c = −3 » (`src/defis.js`) |
| pythrec-4 (`pythrec-4-1`) | « 1 pour oui, 0 pour non » : ni oui ni non | « oui, rectangle » / « non, pas rectangle » (`src/ch11_gm.js`) |
| pscal-1 (`pscal-1-i`, France 1re) | s'arrête à « 7 × 6 × (−1/2) » | valeur exacte « = −21 » (`src/fr_lycee.js`) |
| suitegeo-3 (`suitegeo-3-2`, France) | nombre d'années demandé jamais écrit | « : au bout de 33 ans » (`src/fr_lycee.js`) |

Aucun signe faux ni aucune fin contradictoire n'a été trouvé dans l'état actuel (les fins signalées au premier passage
étaient des vérifications ou des phrases qui disaient aussi la réponse : règle affinée, voir § Méthode 3).

## Exceptions

Aucune (`CV_OK` vide dans `tests/corrige_valeur.js`). Les QCM (« Tape le numéro de la bonne proposition ») passent
d'eux-mêmes : le corrigé finit par « C'est la proposition k ». Une exception future se note `CV_OK["absente|notion-niveau"]`
avec la raison, jamais pour une notion entière sans nécessité.

## Limites connues

- solset : le sens des crochets n'est pas contrôlé (bornes seulement).
- Exercices riches (RICH), questions curieuses et récits ne sont pas dans ces pages (catalogue GEN niveaux 1 à 4 seulement).
- Les « parties » de réponse (numérateur, coefficient, nombre en lettres) rendent le contrôle un peu plus indulgent ;
  la contre-épreuve mesure ce que cela coûte (≥ 94 % des réponses faussées repérées).
