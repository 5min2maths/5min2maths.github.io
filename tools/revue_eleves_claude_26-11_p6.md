15 problème(s) dont 0 grave(s) — 7 moyens, 8 bas

# Revue « élèves joués » — 26.11, 6e passage (branche agent/eleves6, master f5525af)

Dernier passage du jour, sur la version finale. Huit élèves, 2 jours chacun (février 2027, graines nouvelles), avec la case
Problème et « Mes compétences » (`extras=probleme,comp`) ; en priorité, les **46 défis réécrits** (2e–4e Collège, MP).

| Élève | Profil | Trace (`tests/_trace.html#…`) | Séances |
|---|---|---|---|
| Léa | 9e, faible | `eleve=lea&jours=2&jour0=2027-02-01&graine=601&extras=probleme,comp` | 1:00, 3:25 |
| Emma | 10e | `eleve=emma&jours=2&jour0=2027-02-02&graine=602&extras=probleme,comp` | 4:07 (défi), 4:09 |
| Yanis | 11e, evalj=2 | `eleve=yanis&jours=2&jour0=2027-02-03&graine=603&evalj=2&extras=probleme,comp` | 3:14, veille 3:03 |
| Inès | 1re Coll. | `eleve=ines&jours=2&jour0=2027-02-01&graine=604&chapitre=auto&extras=probleme,comp` | 2:30 (défi), 3:41 |
| Malik | MP 2e | `eleve=malik&jours=2&jour0=2027-02-04&graine=605&chapitre=auto&extras=probleme,comp` | 1:40, 3:44 |
| Max | 4e Coll. MA2 | `eleve=max&jours=2&jour0=2027-02-02&graine=606&extras=probleme,comp` | 2:05, 3:05 |
| Adam | MP 3e | `eleve=adam&jours=2&jour0=2027-02-03&graine=607&extras=probleme,comp` | 2:13, 3:37 |
| Hugo | 6e France, faible | `eleve=hugo&jours=2&jour0=2027-02-04&graine=608&extras=probleme,comp` | 4:11 (défi), **6:37** |
| Théo | 2nde France | `eleve=theo&jours=2&jour0=2027-02-01&graine=611&extras=probleme,comp` | 3:16 (défi), 3:22 |

Défis réécrits : `tests/_defis3.html#ids=<46 notions>&n=40&show=1`, puis `n=60&show=3` sur 30 notions (≈ 280 énoncés lus) ;
toutes les parties des 140 contextes montrés **recalculées à la main** (aires, Al-Kashi, quartiles, Bayes, binomiale, normale,
intégrales de révolution, produits vectoriels, ln/exp…) : **aucune valeur attendue fausse**, arrondis justes (y compris
toit 23,585 → 23,58, câbles 70,346° → 70,3, bol 418,9 → 419). Traces : ≈ 120 questions, parties et items de sujets refaits,
aucune erreur de calcul, pas de TeX visible, pas de CHF ni de « · » en France, pas de compteur qui change.

Tiennent : chapitre en classe servi sans leçon (📚 partout), défis en plusieurs parties, veille « 3 questions : tes erreurs »
(Yanis), « Me tester » ciblé et note 5,5 (pas 6) sur des réponses faciles, Mes compétences MP « Semestre », badges repliés.

Outil (`tests/_trace.html`) : ligne « ⓘ problème : notion@classe (année / HORS année) · éligibles de l'année » à la porte du
Problème ; réponse fausse lisible pour un intervalle ou une inéquation (« ]-inf ; 0[ », « x > 0 ») — avec « 7 », la trace
de Théo (graine 609) restait bloquée au positionnement de 2nde.

## Moyens

1. **Moyenne** — Le Problème de la semaine vient de l'année précédente, même quand le chapitre en classe est de l'année.
   Emma (10e, chapitre « Aires et périmètres ») : `arith` (9e) ; Yanis (11e, chapitre Pythagore avec `pythrec`@11 éligible) :
   `vol` (10e, `q-vol-4-t1o`) ; Théo (2nde, deux graines) : `pctvar` (3e). La trace affiche « arith@9 (année) » : le
   `yearSet` de `Engine.weeklyProblem` (catalogue, `current`) contient aussi les reprises, et l'écart d'un an n'est pas pénalisé
   (`gap >= 2`). Reproduire : `#eleve=emma&jours=1&jour0=2027-02-02&graine=602&extras=probleme` (ligne « ⓘ problème »).
   Correction : d'abord les notions du chapitre en classe, puis celles dont `placeOf(...)[0] === grade` (comme `nowOwn`).

2. **Moyenne** — Problème de la semaine sur une notion jamais travaillée : « NOUVELLE NOTION · ÉTAPE 1 SUR 2 » (une
   devinette) puis un problème de niveau 4. Hugo (6e, faible) : leçon « 0,5 × 0,5 » puis `q-decmul-4-gm` (job d'été,
   3 parties), 6:54, 2/3, +2 points ; Léa (9e) : leçon PGDC puis `q-arith-4-f3x`. Reproduire : traces de Hugo et Léa, case
   Problème du jour 1. Correction : `weeklyProblem` ne choisit qu'une notion déjà travaillée (`seen`, maîtrise > 0).

3. **Moyenne** (corrigé faux) — `recipaff`, contexte forfait, c) : « 0,5x + 10 = x ⟺ 0,5x = −10 ⟺ x = 20 ». Le
   corrigé écrit `(1 − m)x = −p` au lieu de `(1 − m)x = p` (`src/defis.js` l. 1650) ; la valeur attendue (20) est juste.
   Reproduire : `tests/_defis3.html#ids=recipaff&n=12&show=3` (ctx forfait, s4). Correction : `D(r2c(1 - m)) + "x = " + p`.

4. **Moyenne** (vraisemblance) — `similmp`, contexte maquette : façade, volume et toit tirés indépendamment
   (`src/defis.js` l. 3276). « 1 : 50 … volume 1'890 cm³ » (236 m³) et « Le toit réel a une aire de 370 m² » : bâtiment de
   64 cm de haut ; au 1 : 200, façade de 6'720 m². Reproduire : `_defis3.html#ids=similmp&n=12&show=3` (s2, s6, s9).
   Correction : tirer L, l, h réels plausibles, puis façade = L · h, volume = L · l · h, toit = L · l.

5. **Moyenne** (vraisemblance) — `q-ensembles-4-8un` (1re Coll., défi du jour) : « Un camp de vacances accepte les jeunes de
   6 ans (compris) à 19 ans (non compris). Le tarif « jeune adulte » s'applique au-delà de 16 ans … jusqu'à 23 ans », puis
   « c) âges acceptés au camp **ou** au tarif « jeune adulte » » : un tarif du camp pour des âges que le camp refuse.
   Correction : deux conditions indépendantes (camp A, assurance ou transport B), `src/defis.js` l. 2713.

6. **Moyenne** (niveau) — 6e France, défi du jour `q-pct-4-z3j` : « Le prix augmente de 20 % ; puis, avec la carte
   d'étudiant, il baisse de 30 % … c) Variation globale en % ». Les évolutions successives (coefficient multiplicateur) sont
   au programme de 3e ; en 6e, appliquer un pourcentage seulement ; « carte d'étudiant » à 11 ans. Les trois contextes du
   défi `pct` (`src/defis.js` l. 3722–3729) sont des variations successives, servis aussi en 9e CO. Correction : en France
   avant la 3e (et en 9e), défi `pct` = remise puis prix payé, ou part d'un total ; variations successives réservées à `pctvar`.

7. **Moyenne** — `colonBreak` met une majuscule à une variable : piège « Le double produit vaut 2k = 8 ⏎ **K** = 4 »
   (`q-compdiff-2-95c`), « k² = 36 ⏎ **K** = 6 » (`q-compdiff-2-6v1`, positionnement de 2nde). Reproduire : trace de Théo,
   graine 611, question 5. Correction : pas de majuscule si la ligne commence par une lettre seule suivie de « = » (ou une formule).

## Bas

8. **Basse** (trivialité) — `fracrat`, contexte evidence : b) « F(−3) = 3 », puis c) « Solution de F(x) = 3 » → −3,
   réponse déjà donnée par b) (x1 et xs tirés sans s'exclure, `src/defis.js` l. 2083). Correction : `x1 !== xs` dans le `while`.

9. **Basse** (vraisemblance) — `stats`, contexte velo : « Une traileuse » / « Un coureur à ski de fond » notent 7 sorties
   de 25 à 90 km par mois (« 82 ; 71 ; 88 … »). Plausible à vélo seulement. Correction : cyclistes seuls, ou 8–30 km pour la course.

10. **Basse** — « Indice 1 · Partie b) · » suivi de l'indice général de la notion, sans rapport avec b) : périmètre →
    « Un produit est nul si… » (`q-eq2-4-teo`, Théo, graine 609), aire visible → « Découpe la figure en rectangles et en
    triangles » (`q-aire3-4-6bt`), salaire de 4 jours → règle des décimales (`q-decmul-4-gm`). Correction : sans indice
    propre à la partie, ne pas écrire « Partie b) ».

11. **Basse** (corrigés) — `q-logprop-1-h05` « log₃ 54 ÷ 6 » sans parenthèses (lu (log₃ 54)/6) ; `q-logprop-2-h97`
    « 32 = 2⁵ · 10⁰ … + 0 » ; `q-integrale-4-p4z` « au centième » pour 3 s et 18 m (attendu « 3,00 », « 18,00 ») et
    « = 18 ≈ 18 m » ; `q-decread-1-d1f` (chiffre des dizaines de 78,641) : corrigé « À droite de la virgule : dixièmes… ».
    Correction : log₃(54 ÷ 6) ; « 32 = 2⁵ » ; pas d'arrondi pour une valeur exacte entière ; corrigé « à gauche de la virgule ».

12. **Basse** — « Me tester » : 9e, objectif « triangles, quadrilatères et cercles » = deux fois le même parallélogramme
    (« le triple », « le quadruple de son voisin », `q-quadri-2-2nz`, `-hzk`) et un trapèze sous le titre « Somme des angles
    d'un triangle » (`q-angtri-3-94a`) ; 10e, même objectif → « polygone régulier à 162° » (`q-angtri-3-sor`, objectif voisin
    « polygones réguliers »). Correction : une forme au plus 1 fois par test ; angtri « polygone » rattaché aux polygones.

13. **Basse** — Figure de `q-angles-3-ao6` : « (1x + 29)° » (l'énoncé dit (x + 29)°). Correction : coefficient 1 omis dans l'étiquette.

14. **Basse** (libellés) — « Les notes d'Yanis » (élision devant Y ; prénom toujours Yanis dans `stats` notes6) ;
    « On place 5000 CHF » sans apostrophe (`log` capital ; « 6'500 CHF » ailleurs) ; « un trèfle ou un 6, un 7 ou un 8 »
    (`q-probaxiomes-2-kn6`, lire « un trèfle ou une carte 6, 7 ou 8 ») ; consigne en double sous `q-ensembles-2-swc`
    (« Pas de solution : touche ∅ … ou ∅ (« aucune ») s'il n'y a pas de solution »).

15. **Basse** (durée, C4 encore) — Hugo (6e, faible) : jour 1, positionnement 6:52 (annoncé « environ 5 minutes ») puis
    défi du jour de niveau 4 en 3 parties (4:11) ; jour 2, « ⚡ Série d'automatismes · 6 calculs rapides » **6:37** (deux
    pas à pas, `q-prop-1-vy9`, `q-proptab-1-cmi`) ; « Me tester » 6:00. Correction : série de 4 pour un élève dont le Mathélo
    est sous la moyenne de la classe (pas seulement `struggling`) ; pas de défi le jour du positionnement.
