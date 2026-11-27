# Variété des questions — 27.11 (agent variete)

Règle de l'enseignant : **au moins 3 FORMES de question par niveau** (une autre façon de poser la question, un autre
contexte, une autre représentation), pas seulement d'autres nombres. Resserrer plutôt qu'enrichir : aucune notion
nouvelle, seulement des formes au niveau de la classe où la notion est enseignée.

## Mesure (tools/variete.py)

- **Forme** = énoncé lisible (énoncé + parties) aux nombres près, aux signes près (un signe devant un nombre fait partie
  du nombre), aux lettres isolées près (x ou t, A ou B ne font pas une autre forme), une liste de nombres comptant pour un
  nombre (`tests/variete_formes.js`). Plus strict que la colonne « Formes » de `tools/suivi.py` (qForm : nombres
  seulement), qui comptait comme formes différentes « A(−3 ; 0) » et « A(2 ; −3) », ou « x + 3 » et « x − 3 ».
- 200 tirages reproductibles (graines 1 à 200) par notion et par niveau 1 à 3, pour toutes les notions de GEN (1002 niveaux).
- **Fréquence** : questions réellement posées par le vrai moteur à des élèves simulés (`tests/eleves.js`, 14 semaines dès
  septembre, profils moyen régulier, faible régulier, fort), dans 17 classes : 9e–11e, 1re–4e Collège, MP 1re–4e,
  France 6e–1re. Pondération = nombre de fois où le niveau est posé.
- Commandes : `tools/variete.py` (mesure complète, verrou des tests, ~2 min), `--formes` (formes seulement, fréquences
  reprises), `--liste N`, `--relire`, `--garde` (régénère le garde-fou). Données : `suivi/variete.json` (hors git).

## Avant / après, par classe (niveaux 1–3 posés dans les séances simulées)

Avant (master du 27.11) — nombre de niveaux à 1 et à 2 formes, et part des questions posées qu'ils représentent :

| Classe | Questions simulées | Niveaux vus | à 1 forme | à 2 formes |
|---|---|---|---|---|
| 9e | 1211 | 65 | 1 (1 %) | 1 (1 %) |
| 10e | 1494 | 154 | 1 (1 %) | 4 (2 %) |
| 11e | 1822 | 198 | 2 (0 %) | 6 (3 %) |
| 1re | 2059 | 207 | 1 (0 %) | 4 (2 %) |
| 2e | 2322 | 275 | 14 (5 %) | 11 (5 %) |
| 3e | 2661 | 319 | 12 (6 %) | 13 (4 %) |
| 4e | 2842 | 297 | 7 (3 %) | 10 (2 %) |
| MP 1re | 1554 | 156 | 1 (1 %) | 4 (4 %) |
| MP 2e | 2038 | 252 | 1 (0 %) | 5 (3 %) |
| MP 3e | 2051 | 227 | 1 (0 %) | 7 (2 %) |
| MP 4e | 2183 | 239 | 1 (0 %) | 6 (2 %) |
| FR 6e | 1272 | 79 | 0 | 0 |
| FR 5e | 1461 | 169 | 2 (1 %) | 6 (7 %) |
| FR 4e | 1521 | 112 | 1 (1 %) | 3 (3 %) |
| FR 3e | 1770 | 145 | 1 (2 %) | 5 (4 %) |
| FR 2nde | 1906 | 185 | 1 (2 %) | 5 (3 %) |
| FR 1re | 1985 | 233 | 1 (0 %) | 5 (2 %) |

Après : **0 niveau à 1 ou 2 formes dans toutes les classes** ; sur tout le catalogue (1002 niveaux, y compris ceux que
les élèves simulés n'ont pas vus) : 39 niveaux sous 3 formes avant, 0 après.

Les niveaux les plus fréquents à 1–2 formes étaient des bases reprises dans presque toutes les classes (distrib 1,
relrep 1, diagr 1, symetries 1, idrem 1 : posés en 10e–4e, MP et France comme base à consolider), puis les notions de
fonctions de 2e Collège (compo, polyexpr, homogrec, bijection, decomp, eqrat, cercletan).

## Niveaux traités (39), par fréquence

Fréquence = questions simulées toutes classes ; formes avant → après ; ctx des formes ajoutées (préfixe `v27-`).

| Niveau | Fréq. | Formes | Classes | Formes ajoutées |
|---|---|---|---|---|
| distrib 1 | 198 | 2 → 4 | 10e–4e, MP, FR 5e–1re | aire d'un rectangle k(ax + b) ; « −( … ) » |
| relrep 1 | 176 | 2 → 7 | 9e (base 10e–4e, MP, FR) | entier voisin (−7 → −8) ; entiers strictement entre −a et b ; relevés de température |
| diagr 1 | 174 | 1 → 5 | 9e (base ailleurs) | somme connaissant la moyenne ; moyenne en contexte (vélo, lecture, saut) |
| symetries 1 | 170 | 2 → 6 | 9e (base ailleurs) | retrouver A depuis A' ; longueur AA' |
| idrem 1 | 144 | 2 → 4 | 11e, 1re–4e, MP, FR 3e–1re | aire d'un carré (x + a)² ; identité à trou (double produit) |
| cart 1 | 115 | 2 → 4 | 2e–4e, FR 2nde–1re | B connaissant le milieu ; phare et bateau (km) |
| vecteurs 1 | 72 | 1 → 4 | 3e–4e | B = A + AB ; A = B − AB ; translation d'un personnage de jeu |
| sinlaw 1 | 58 | 2 → 3 | 2e–4e, MP 2e–4e | montgolfière vue par deux promeneurs (un quart des tirages ; Suisse seulement) |
| polyexpr 1 | 57 | 1 → 3 | 2e–4e | a par un point du graphe ; parabole par ses intersections avec les axes |
| compo 1 | 49 | 1 → 4 | 2e–4e | kelvins → °C → °F ; tableau de valeurs ; expression réduite de f∘g |
| cercletan 1 | 48 | 1 → 3 | 2e–4e | r² par le centre et un point ; rayon par deux points diamétralement opposés |
| homogrec 1 | 45 | 2 → 4 | 2e–4e | f⁻¹(c) ; réciproque de a/(x − b) + c |
| bijection 1 | 41 | 1 → 3 | 2e–4e | branche de gauche ]−∞ ; a] ; préimage dans la branche |
| eqrat 1 | 40 | 1 → 3 | 2e–4e | a/x + c = d ; (x + p)/(x − r) = b |
| decomp 1 | 33 | 2 → 5 | 2e–4e | trouver f (racine, cube, inverse) |
| relrep 2 | 15 | 2 → 4 | 10e–11e, FR 5e | point à d unités à gauche ; fond du lac et sommet |
| p8droite 1 | 14 | 1 → 3 | 9e (primaire) | valeur d'une graduation ; compter des graduations |
| p8calcadd 1 | 12 | 2 → 3 | 9e (primaire) | passagers d'un bus |
| cercletan 3 | 10 | 1 → 3 | 2e–3e | ordonnée à l'origine de la tangente ; tangente, cercle hors de l'origine |
| symetries 3 | 7 | 2 → 3 | 9e (base ailleurs) | axe horizontal y = c |
| eqverif 3 | 7 | 1 → 3 | 10e (base 11e, 2e, FR 5e) | le seul nombre solution ; valeur de p |
| compo 2 | 5 | 2 → 3 | 2e–4e | (f∘f)(k) |
| f2trois 3 | 4 | 2 → 3 | 4e, MP 3e | f(k) par trois points |
| homogrec 3 | 3 | 1 → 3 | 2e–3e | coût moyen d'affiches (Suisse) ; point du graphe de f⁻¹ |
| polyexpr 2 | 3 | 1 → 3 | 2e–3e | zéro double et un point ; f(m) connaissant a |
| homogrec 2 | 3 | 1 → 3 | 2e–3e | dénominateur cx + d ; valeur interdite de f⁻¹ |
| eqrat 2 | 2 | 1 → 3 | 2e | x/(x + p) = b ; a/x + b/x = c |
| eqrat 3 | 2 | 1 → 3 | 2e–3e | x + a/x = b ; a/(x − p) = x − q |
| bijection 2 | 2 | 1 → 3 | 2e | branche de gauche et préimage, forme développée |
| rotation 3 | 2 | 2 → 3 | 10e (MP 4e, FR 3e) | quart de tour horaire ; demi-tour de centre C |
| decomp 3 | 2 | 2 → 4 | 2e–3e | trouver g ; f(x) = x² + kx |
| decomp 2 | 2 | 2 → 4 | 2e–3e | f = 1/x² ; g sous la racine |
| relrep 3 | 2 | 2 → 4 | 9e (FR 5e) | plongeur à mi-chemin ; partage en trois |
| log 3 | 1 | 2 → 4 | 2e–3e (Suisse) | log_b n par puissances communes ; 2 log a + log c |
| p8droite 3, p8droite 2, p8calcadd 2, cercletan 2, trigrel 2 | 0 | 1–2 → 3–5 | (non vus en simulation) | centièmes, « avant », partage d'une unité, pages restantes, cercle tangent à un axe, deux cercles tangents, cos → tan, angle obtus (2e–4e) |

Chaque forme a un corrigé qui finit sur la réponse, un pas à pas (guide) et des pièges cohérents (erreurs typiques :
oubli du double produit, « − » qui ne change qu'un terme, f∘g et g∘f inversés, branche de la mauvaise moitié, etc.).
Contextes neutres (°C, km, lac, bus, livre, jeu vidéo), sans CHF ni « Suisse » sauf les deux formes marquées
`co` (Suisse seulement) ; les formes propres à la Suisse ou hors programme français (loi des sinus en situation,
log_b, angle obtus, coût en francs) portent `co` (et `mp` si la notion est en MP) : écartées en France.

## Équilibre des tirages

Une forme ajoutée (VARX) est tirée à égalité avec le générateur d'origine ; le moteur écarte en plus les tirages dont la
réponse se lit dans l'énoncé (`answerShown`). Là où la forme ajoutée prenait plus de la moitié des tirages (sinlaw 1,
trigrel 2, polyexpr 2), elle rend la main au générateur une fois sur deux. Reste déséquilibré : **bijection 1** (la forme
d'origine « Que vaut a ? » a sa réponse dans l'énoncé (x − 6)² : le moteur la tire rarement, 2 fois sur 80 ;
la branche de gauche, marquée `shownOk`, la remplace souvent). À décider : marquer aussi la forme d'origine `shownOk`
(dans gen3.js, hors du périmètre de ce lot).

## Contrôles

- **Oracles de recalcul** : `tests/recalc_oracles_var.js` (une règle par forme v27, placées en tête de RECALC.RULES /
  RECALC.G), chargé par recalcul.html à recalcul4.html. Réponses en expression : composée, réciproque (f(f⁻¹(t)) = t),
  décomposition (f(g(t)) = h(t)), aires ; équations « Résous » : oracle générique.
- **Garde-fou** `tests/variete_niveaux.html` (dans la suite, ~15 s) : 345 niveaux protégés (les 39 traités + 306 niveaux
  posés au moins 20 fois dans les séances simulées). Échoue si l'un redescend sous 3 formes sur 200 tirages, ou si une
  forme v27 n'est pas reconnue par son oracle ou est contredite. Régénérer après une nouvelle mesure : `tools/variete.py --garde`.
- `tests/corrige_valeur.html` : passe sur les notions traitées. Avec 60 graines (#n=60), un écart **antérieur** apparaît
  sur cart 3 (cart-3-1a, corrigé « (x + 0)^2 ») : générateur d'origine, non modifié ici.
- Pages de la suite touchées par les nouvelles formes et corrigées : `calculatrice.html` et `guides.html` (réponse
  littérale attendue écrite développée, acceptée telle quelle par le correcteur), `primaire.html` (son oracle reconnaît les
  cinq formes sans figure de p8droite / p8calcadd, lues avant la figure ; aucune réponse négative en primaire).
- Pas à pas : 100 % des tirages guidés sur toutes les notions traitées (`tests/guides.html#eqrat,…`).

## Limites, restant

- La mesure compte les formes sans profil : une forme réservée (co/mp) compte pour toutes les classes. En France,
  log 3 et sinlaw 1 gardent 2 formes (formes ajoutées réservées à la Suisse) ; en 1re Collège, trigrel 2 a 3 formes
  (l'angle obtus est réservé à 2e–4e).
- Les formes « plus petit / plus grand » ou « axe Ox / axe Oy » comptent pour deux : le critère suit l'énoncé.
- Les défis (niveau 4) ne sont pas mesurés ici (règle ctx anti-répétition déjà en place, 26.11).
- À relire par l'enseignant : les 75 formes v27 (exactitude, niveau), en priorité distrib 1, relrep 1, diagr 1,
  symetries 1, idrem 1 (posées dans presque toutes les classes).
