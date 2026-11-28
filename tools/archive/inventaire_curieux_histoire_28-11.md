# Questions curieuses et histoires : inventaire et sujets (28.11)

Sonde : `tests/_probe_inv.html` (non commitée) : pour chaque classe, élève fictif dont toutes les notions des années
précédentes (début d'année) ou jusqu'à l'année en cours (fin d'année) sont « vues » ; compte des questions curieuses
accessibles (`Curieux.available`), des histoires permises (`Histoire.ok`) et de celles **liées au programme de l'année**
(notions `uses` / `need` / `ids` de l'année, par thème).

## Constat

L'existant (78 questions curieuses, 55 histoires) repose presque entièrement sur des notions de 9e–10e (et 6e–4e en
France). Un élève du Collège y a accès, mais rien ne touche le programme de son année.

| Classe | Curieux accessibles (début → fin) | Curieux liés à l'année | Histoires liées à l'année |
|---|---|---|---|
| 9e | 13 → 38 | 27 | 21 |
| 10e | 38 → 68 | 32 | 38 |
| **11e** | 68 → 74 | **6** (fonctions et algèbre : 0 ; espace : 0) | 11 |
| **1re Collège** | 74 | **0** | **3** |
| 2e Collège | 74 → 75 | 1 | 3 |
| 3e, 4e Collège | 75 | 0 | 1 |
| MP 1re | 66 → 74 | 8 | 36 |
| **MP 2e** | 74 | **0** | 5 |
| MP 3e, 4e | 74 | 0 | 4, 0 |
| France 6e / 5e / 4e | 13 → 50 / 50 → 61 / 61 → 71 | 39 / 13 / 10 | 18 / 18 / 20 |
| France 3e, 2nde, 1re, Tle | 71–72 | 1, 0, 0, 0 | 18, 4, 2, 0 |

Priorité (classes des testeurs, mémoire « cible secondaire ») : **11e, 1re Collège, MP 2e**, puis 2e Collège ; lycée
français et 3e–4e Collège plus tard.

## Sujets proposés : +20 questions curieuses

Aucun doublon avec les clés existantes (pliage, forfait, pente, vmoy, salaire, graphe… déjà pris). Chaque sujet : pari →
calcul au niveau de la classe → révélation ; grandeurs vraisemblables ; séparation France / romand (CHF / €).

| # | Classe | Notion (`uses`) | Famille | Sujet |
|---|---|---|---|---|
| 1 | 11e | idrem | énigme | Calculer 49² (ou 51²) de tête plus vite que la calculatrice : (50 − 1)² |
| 2 | 11e | eq2 | quotidien | Un ballon lancé vers le haut (h = 20t − 5t²) : quand retombe-t-il ? |
| 3 | 11e | sys2 | énigme | Têtes et pattes : poules et lapins dans la cour |
| 4 | 11e | simil | paradoxe | Pourquoi les géants ne peuvent pas exister (aires × k², masses × k³) |
| 5 | 11e | cercthales | énigme | Un angle droit sans équerre : n'importe quel point d'un demi-cercle |
| 6 | 11e | repere3d | énigme | La mouche qui traverse la chambre : diagonale du pavé |
| 7 | 11e | factor / ucomp | énigme | Le tour de magie « pense à un nombre » qui retombe toujours sur le même résultat |
| 8 | 1C | optim | quotidien | Le prix du billet qui rapporte le plus (recette = prix × spectateurs) |
| 9 | 1C | contrex | paradoxe | n² + n + 41 donne des nombres premiers… jusqu'à n = 40 (1681 = 41²) |
| 10 | 1C | demoalg | énigme | La somme de 3 nombres consécutifs est toujours un multiple de 3 |
| 11 | 1C | absval | énigme | Où installer le point de rendez-vous pour minimiser la marche totale |
| 12 | 1C | inter | quotidien | Le ballon et la pente : où retombe-t-il (intersection parabole / droite) |
| 13 | 1C | trigo | fermi | La hauteur des nuages (ou d'un avion) à partir d'un angle et d'une distance |
| 14 | MP 2e | modaff | quotidien | Deux taxis : prise en charge + prix au km, lequel à partir de quelle distance |
| 15 | MP 2e | trigfn | quotidien | La grande roue : hauteur d'une nacelle au fil du tour |
| 16 | MP 2e | sinlaw | énigme | La distance d'un bateau depuis la côte avec deux visées |
| 17 | MP 2e | quartiles | paradoxe | Le temps de trajet : un jour de bouchon change la moyenne, pas la médiane |
| 18 | 2C | log | énigme | Combien de chiffres a 2^100 ? |
| 19 | 2C | cercle | quotidien | Le GPS : se situer à l'intersection de cercles |
| 20 | 2C | expo | quotidien | La caféine du café : demi-vie, combien en reste-t-il au coucher ? |

## Sujets proposés : +15 histoires

Faits à vérifier un par un sur des sources sérieuses avant écriture ; une légende est dite « légende ».

| # | Classe | Notion (`need`) | Sujet |
|---|---|---|---|
| 1 | 11e | eq2 | Les Babyloniens résolvaient déjà des équations du 2e degré (tablettes vers −1800) |
| 2 | 11e | formule / tradalg | Viète et les lettres en algèbre (fin du XVIe siècle) |
| 3 | 11e | volcomp / volcone | Archimède, la sphère et le cylindre (gravés sur sa tombe selon Cicéron) |
| 4 | 11e | proba / denombr | Galton et sa planche (XIXe siècle) |
| 5 | 1C | eq3 | Tartaglia, Cardan et la formule du 3e degré (XVIe siècle) |
| 6 | 1C | ratden / contrex | √2 n'est pas une fraction : le choc des pythagoriciens (Hippase : légende) |
| 7 | 1C | lectgraph / fimg | Nicole Oresme et les premiers graphiques (XIVe siècle) |
| 8 | 1C | optim | Fermat cherche les maximums avant le calcul différentiel |
| 9 | 1C | trigo | Hipparque et la première table de cordes (IIe siècle av. J.-C.) |
| 10 | MP 2e / 2C | trigcercle | Al-Battani et le sinus (IXe–Xe siècle) |
| 11 | MP 2e | quartiles | John Tukey invente la boîte à moustaches (années 1970) |
| 12 | MP 2e | affine / modaff | Le tarif des taxis et le taximètre (fin du XIXe siècle) — à vérifier, sinon autre sujet affine |
| 13 | 2C | log | Briggs et les logarithmes décimaux (début du XVIIe siècle) |
| 14 | 2C | expo | Willard Libby et la datation au carbone 14 (prix Nobel 1960) |
| 15 | 2C | trigfn | Fourier : toute vibration est une somme de sinus (début du XIXe siècle) |

## Suite

Agent `/contenu curieux et histoire` : écrire ces sujets (ou ceux que l'enseignant garde) au standard de
`src/curieux.js` et `src/histoire.js` (calcul de l'« À toi » au niveau de la classe, vraisemblance, faits vérifiés avec
sources dans le rapport), relancer la sonde pour mesurer l'effet ; relecture de l'enseignant ciblée sur l'exactitude des
faits historiques.
