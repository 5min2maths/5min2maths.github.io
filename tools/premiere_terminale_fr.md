# Première et terminale (spécialité) : couverture par 5min2maths

Préparé le 23.11.2026 (branche `agent/frlycee`). Sources : `tools/referentiels_fr.json`, `tools/couverture_fr.md`, PDF officiels
(`~/DATA/Enseignement/Sources/Officiel/France/lycee_2026_1re_specialite.pdf`, `lycee_2019_Tle_specialite.pdf`,
`lycee_2026_Tle_specialite.pdf`). Codes d'attendus : ceux du JSON (`1re.AL.04`, `Tle.AN.19`…).

**Textes en vigueur en 2026-2027.** 1re spécialité : programme 2026 (BO 14 du 02.04.2026, avec une partie « automatismes »
évaluée sans calculatrice à l'épreuve anticipée de juin). Tle spécialité : programme **2019** encore (le programme 2026 arrive en
2027-2028). Les contenus de Tle 2019 et 2026 sont très proches pour ce qui se prête à l'app (suites, limites, continuité,
logarithme, primitives, intégrales, loi binomiale, espace) ; le JSON suit le texte 2026, qu'on garde comme repère.

Légende : ✅ notion existante qui couvre l'attendu ; ◐ couverture partielle ou à adapter ; ✚ notion créée sur cette branche ;
✗ manquant. Niveau FR : `FR: [classe, mois]` avec 11 = 1re, 12 = Tle, mois 0 = septembre … 9 = juin.

## 1. Première spécialité (programme 2026)

| Chapitre | Notions de l'app | Écarts | Manque (priorité) |
|---|---|---|---|
| Automatismes (AU.01–17) | ✅ `pctvar`, `eq2`, `ineq`, `affzero`, `reduire`, `distrib`, `lectgraph`, `droites`, `stats` | tout est en notions de collège/2nde (rattachées par les autres chantiers) ; le format « automatismes » = série flash sans calculatrice | ◐ AU.16–17 probabilités conditionnelles (tableau croisé, P(A∩B) / P_A(B)) : notion `probcond` prévue par le chantier 2nde ; ✚ `probtot` couvre l'arbre pondéré |
| Suites numériques (AL.01–06) | ◐ `modexp` (évolution à taux fixe = suite géométrique sans le mot) ; `expo` | l'app ne connaît pas la notation \(u_n\), \(u_{n+1} = f(u_n)\), ni « raison », « sens de variation d'une suite » | ✚ `suitedef`, ✚ `suitearith`, ✚ `suitegeo`, ✚ `suitesomme` (priorité 1) ; limite conjecturée : ✚ `suitelim` niveau 1 |
| Second degré (AL.07–10) | ✅ `f2formes` (forme canonique), `eq2disc` (discriminant), `trinfact`, `ineq2`, `optim`, `f2` | vocabulaire : « racines » plutôt que « zéros », « fonction polynôme du second degré », « parabole » ; Δ s'appelle bien « discriminant » | rien d'essentiel ; variante FR des énoncés (racines) à prévoir |
| Dérivation (AN.01–06) | ✗ (chantier 3e Collège suisse `agent/college34` : dérivées) | — | **ne pas doubler** : rattacher ses notions (nombre dérivé, tangente, dérivées usuelles, opérations) au FR 1re dès leur fusion |
| Variations (AN.07–10) | ◐ `optim`, `f2` | les études de variations passent par f′ en France | dépend des dérivées (college34) |
| Fonction exponentielle (AN.11–14) | ◐ `expo` (équations \(a^x = b\)), `modexp` (croissance) | en France, « exponentielle » = la fonction \(\exp\), \(e^x\) ; pas de \(a^x\) en 1re (ni de log) | ✚ `expfn` : propriétés algébriques de \(e^x\), équations et inéquations \(e^a = e^b\), signe, décroissance \(e^{-kt}\) ; dérivée de \(e^{at}\) : laissée aux dérivées |
| Trigonométrie (AN.15–16) | ✅ `trigcercle`, `trigassoc` | la France travaille en **radians** dès la 1re ; `trigcercle` niveau 1 convertit des degrés | variante FR à prévoir : angles en radians d'emblée |
| Produit scalaire (GE.01–03) | ◐ `vecteurs` (niveau 3 seulement), `sinlaw` (Al-Kashi) | notation \(\vec u \cdot \vec v\), « norme » \(\lVert \vec u \rVert\) | ✚ `pscal` : coordonnées, \(\lVert\vec u\rVert \lVert\vec v\rVert\cos\theta\), projeté, orthogonalité, polarisation |
| Géométrie repérée (GE.04–08) | ✅ `droites`, `cercle` ; ◐ `droitesinter` | équation cartésienne \(ax + by + c = 0\), vecteur normal ; l'app écrit \(y = mx + h\) (France : \(y = mx + p\)) | ✗ projeté orthogonal sur une droite (GE.05) : niveau 3 de `pscal` |
| Probabilités conditionnelles (SP.01–04) | ◐ `proba` (une épreuve, arbre non pondéré) | notation \(P_A(B)\), « évènement » | ✚ `probtot` (arbre pondéré, probabilités totales, indépendance, inversion) ; `probcond` (tableau croisé) : chantier 2nde |
| Variables aléatoires (SP.05–09) | ✗ | — | ✚ `vaesp` : loi, \(P(X \le a)\), espérance, variance, jeu équitable |
| Algorithmique (Python) | hors périmètre | rien à saisir | — |

## 2. Terminale spécialité (programme 2019 en 2026-2027)

| Chapitre | Notions de l'app | Écarts | Manque (priorité) |
|---|---|---|---|
| Suites (AN.01–03, récurrence) | ✚ `suitelim` | la récurrence (démonstration) ne se prête pas à une réponse saisie ; on peut demander l'étape d'hérédité en QCM plus tard | ✚ `suitelim` : limites de \(q^n\), opérations, formes indéterminées simples, suites arithmético-géométriques |
| Limites de fonctions (AN.04–05) | ✗ | — | ✗ `limfn` (priorité 2) : limites usuelles, asymptotes horizontales et verticales, croissances comparées |
| Dérivation, convexité (AN.06–10) | ◐ `compo` (composée), dérivées (college34) | — | ✗ convexité (f″, point d'inflexion) après les dérivées |
| Continuité, TVI (AN.11–12) | ✗ | encadrement par balayage : faisable en saisie (« au dixième ») | ✗ `tvi` (priorité 3) |
| Logarithme népérien (AN.13–14) | ◐ `log`, `logbase` | la France n'utilise que \(\ln\) (et \(\log\) décimal en physique) ; `log` part de \(\log_2 8\) | variante FR de `log` en \(\ln\) ; ✗ `lnfn` (équations \(\ln\), \(e^x = k \iff x = \ln k\), seuils \(q^n < s\)) |
| Sinus et cosinus (AN.15–17) | ✅ `trigfn`, `trigeq` | radians, \([-\pi ; \pi]\) | variante FR en radians |
| Primitives, équations différentielles (AN.19–21) | ✗ | — | ✗ `primit`, ✗ `eqdiff` — **à voir avec college34** (intégrales au programme suisse de 3e–4e) |
| Calcul intégral (AN.22–27) | ✗ | — | ✗ idem (college34) |
| Dénombrement (AG.01–02) | ✅ `denombr` | combinaisons \(\binom{n}{k}\), « k-uplets », permutations : à vérifier | — |
| Espace (AG.03–16) | ◐ `pythfig`, `sys2` (systèmes) | — | ✗ `espace` : représentation paramétrique, équation cartésienne de plan, vecteur normal (priorité 3) |
| Loi binomiale (SP.01–04) | ✗ | notation \(\mathcal{B}(n ; p)\), \(\binom{n}{k}\) | ✚ `binom` : arbre \(n \le 4\) (1re SP.04), \(P(X = k)\), \(P(X \ge 1)\), espérance \(np\), seuil |
| Sommes de variables aléatoires (SP.05–07) | ✗ | — | ✗ linéarité de l'espérance (niveau 3 de `vaesp` en partie) |
| Concentration, loi des grands nombres | ✗ | Bienaymé-Tchebychev | ✗ (faible priorité) |
| Python (listes) | hors périmètre | — | — |

## 3. Rattachements faits sur la branche (champ FR)

Seulement des notions dont la première classe française est la 1re ou la Tle (les autres sont aux chantiers collège et 2nde).

| Notion | Avant | Après | Pourquoi |
|---|---|---|---|
| `eq2disc` | [11, 2] | [11, 0] | discriminant : premier chapitre de 1re |
| `f2formes` | — (gen3) | [11, 0] | forme canonique (AL.10) |
| `trinfact` | — (gen3) | [11, 0] | AL.08–09 |
| `ineq2` | null | [11, 1] | signe d'un trinôme (AL.07, AU.06) |
| `modexp` | — (gen3) | [11, 2] | évolution à taux fixe, suites géométriques (AL.05, AN.14) |
| `sinlaw` | null | [11, 3] | Al-Kashi, chapitre produit scalaire (GE.01) |
| `cercle` | null | [11, 8] | géométrie repérée (GE.06–07) |
| `trigassoc` | — (gen3) | [11, 5] | angles associés (AN.16) |
| `trigcercle` | [11, 6] | [11, 5] | (inchangé sur l'année, mois ajusté) |
| `expo` | [11, 5] | [11, 4] | partiel : voir § 1 |
| `trigeq` | [11, 7] | [12, 5] | cos x = a : Tle (AN.17) |
| `trigfn` | null | [12, 5] | AN.15–16 |
| `compo` | — (gen3) | [12, 1] | dérivée d'une composée (AN.06), AG.07 |
| `denombr` | — (gen3) | [12, 0] | AG.01–02 |

Les champs FR des notions de `gen3.js` sont posés depuis `src/fr_lycee.js` (table `FR_LYCEE`, appliquée au chargement) :
l'enregistrement des notions fines (`registerFine`) écrit `FR: null` et d'autres chantiers modifient `gen3.js` en parallèle.
Non touchés, à décider avec le chantier 2nde : `sys2` [10, 4] et `eq3` [10, 3] (ni l'un ni l'autre ne sont en 2nde ; `sys2`
revient en Tle dans l'espace, `eq3` relève des maths expertes) ; `polyfact` (expertes) reste `null`.

## 4. Notions créées (`src/fr_lycee.js`)

Toutes : `CH: null` (invisibles en Suisse), 3 niveaux, au moins 3 formes par niveau, pas à pas, erreurs typiques, leçon,
3 compétences, étiquette `ctx`, euros et contextes français, notation \(u_n\), intervalles `[a ; b[`, milliers « 1 200 ».

| Id | Libellé | FR | Couvre |
|---|---|---|---|
| `suitedef` | Suites : calculer des termes, sens de variation | [11, 1] | AL.01–03, AL.06 |
| `suitearith` | Suites arithmétiques | [11, 1] | AL.04–05 |
| `suitegeo` | Suites géométriques | [11, 2] | AL.04–05, AN.14 |
| `suitesomme` | Sommes de termes (1 + 2 + … + n, 1 + q + … + qⁿ) | [11, 2] | AL.04 |
| `expfn` | Fonction exponentielle : propriétés, équations | [11, 4] | AN.11, AN.13 |
| `pscal` | Produit scalaire | [11, 3] | GE.01–03, GE.05 |
| `probtot` | Arbres pondérés, probabilités totales | [11, 6] | AU.16–17, SP.01–04 |
| `vaesp` | Variable aléatoire : loi, espérance, variance | [11, 7] | SP.05–09 |
| `suitelim` | Limites de suites | [12, 0] | Tle AN.01, AN.03 ; Tle-comp AN.02, AN.04 |
| `binom` | Loi binomiale | [12, 6] | Tle SP.01–04 ; 1re SP.04 |

## 5. Usages français à régler globalement (hors de ces notions)

1. **Milliers** : l'app écrit `1'200` ; en France « 1 200 » (espace fine insécable `\,` en TeX). À faire au rendu selon le
   système (comme `divSign`). Les nouvelles notions écrivent déjà `1\,200`.
2. **Intervalles** : `[a ; b[` avec point-virgule (l'app met `\,;\,` : bon) ; `SolSet.show` convient.
3. **Signe ×** : l'app écrit le produit avec `\cdot` (usage romand) ; la France écrit `\times`. Un filtre au rendu
   (`\cdot` → `\times` pour FR) serait simple, sur le modèle de `divSign`. Les nouvelles notions écrivent `\times`.
4. **Division** : `÷` est compris mais la barre de fraction est la norme au lycée.
5. **Vocabulaire** : préimage → antécédent ; zéros → racines (polynômes) ; PGDC → PGCD ; « fonction du premier degré » →
   fonction affine ; \(y = mx + h\) → \(y = mx + p\) ; « Δ » = discriminant (identique).
6. **Radians** : en 1re et Tle, les angles du cercle trigonométrique sont en radians ; `trigcercle`, `trigeq`, `trigfn`,
   `trigassoc` utilisent les degrés au niveau 1 : variante FR à prévoir (`VAR[id].FR` ou paramètre de profil).
7. **Logarithme** : seulement \(\ln\) en Tle spécialité ; `log` commence par \(\log_2\) (usage suisse).
8. **Moteur** : `Engine.refOf` renvoie « CO » pour un élève français de 1re et « MATU » en Tle ; l'ordre des notions FR
   vient alors de la position dans `NOTIONS` (les nouvelles notions ont un `ORDRE.FR`, non lu par le moteur). Ajouter
   `refOf → "FR"` quand la France sera ouverte. Le menu FR (`SYSTEMS.FR`, masqué) s'arrête à la 1re : ajouter `[12, "Tle"]`.
9. **Euros, contextes** : CHF, Genève, CO dans de nombreux énoncés (`ctx` à localiser) ; les nouvelles notions sont en euros.

## 6. Ce qui reste (par priorité)

1. Rattacher les dérivées de `agent/college34` (nombre dérivé, tangente, dérivées usuelles, \(e^{at}\)) au FR 1re dès leur fusion.
2. `probcond` (tableau croisé, \(P_A(B)\)) : vérifier qu'il est fait par le chantier 2nde, sinon le faire (1re AU.16–17).
3. Tle : `limfn` (limites de fonctions, asymptotes), `lnfn` (variante \(\ln\)), `tvi`, convexité, `espace` ; primitives et
   intégrales à coordonner avec college34.
4. Variantes FR (radians, ln, racines, `\times`, milliers) des notions suisses rattachées.
