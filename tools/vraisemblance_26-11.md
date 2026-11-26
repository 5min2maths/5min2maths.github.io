# Audit de vraisemblance des générateurs — 26.11

Règle de l'enseignant : « un énoncé déconnant, un paramètre mal fixé peut entraîner le décrochage et la perte d'un élève ».

## Périmètre

- 321 notions de GEN (niveaux 1 à 3), dont 295 avec défis (niveau 4, PROB, PROB_EXTRA, PROBX).
- 62 banques d'exercices riches (332 exercices), 61 questions curieuses, 41 récits d'histoire.
- Leçons actives (ACTIVE) : prédictions et défis relus. Ils sont écrits à la main, aucun défaut trouvé.
- Toutes les classes (CO 9e–11e, Collège 1re–4e, MP 1re–4e, France 6e–Tle) : les générateurs sont communs aux classes, et la passe France (frLocal) ne change que la monnaie et le vocabulaire.

## Outils ajoutés

- `tests/vraisemblance.html` (dans la suite) : 55 000 énoncés tirés (40 graines par notion et par niveau, plus les riches, les curieuses et l'histoire). Le contrôle automatique est dans `tests/vrai_checks.js`, la collecte dans `tests/vrai_collecte.js`. Options : `#n=200` (plus de graines), `#ids=pyth,vitesse`, `#detail`.
  Contrôles : valeur cassée (NaN, undefined, réponse non finie) ; figure de dimension négative ou écrasée (< 40 px) ; grandeur négative ou nulle dans l'énoncé ; inégalité triangulaire stricte (triangle nommé, ou « côtés a, b et c ») ; cathète ≥ hypoténuse ; angle de triangle ≤ 0 ; probabilité hors de [0 ; 1] ; arrondi demandé (« au dixième », etc.) sans tolérance, ou avec une tolérance trop lâche ; arrondi dans un sens imposé (« au … supérieur », « combien faut-il au minimum ») avec une tolérance qui accepte l'autre sens ; effectif (personnes, objets, tours…) non entier ; grandeur demandée ≤ 0 ; montant à 3 décimales, ou « 2,5 CHF » (mineur) ; pourcentage invraisemblable ; vitesse invraisemblable selon le contexte (vélo, piéton, voiture, > 1300 km/h) ; âge, température, effectif de classe (> 30) invraisemblables ; note suisse > 6 ; point décimal dans le texte ; élision manquante (« de Elsa ») ; « Un(e) », « il ou elle », « de le » ; mot doublé ; accord après 1 (« 1 vertes ») ; « décimaux » annoncés sans décimal.
  Liste d'exceptions relues (`OK`) : point décimal dans le code Python d'algopy.
  Vérifié aussi à 120 et à 200 graines (276 000 énoncés) : vert.
- `tests/_echantillon.html` (hors suite) : impression des tirages pour la lecture humaine (`#notions=…&n=8&src=gen,defi,riche,curieux,histoire&sol=1&dedup=1&ctx=1`).

## Corrections transversales (src/generators.js, engine.js, sujet.js)

- `moneyTidy` / `moneyQ`, appliqués aux textes de chaque question (Engine.build, défis, sujets riches), jamais aux réponses :
  - montants à deux décimales : « 2,5 CHF » devient « 2,50 CHF » (37 générateurs étaient touchés : affine, change, pct, decprob, proptab, syslin, sys3, droitesinter, suites…) ;
  - élision devant un nom propre : « le compte de Elsa » devient « le compte d'Elsa », « que Inès » devient « qu'Inès » ;
  - « de Le Havre » devient « du Havre ».
- `oneTidy` (énoncé et parties) : accord après 1, par exemple « 1 vertes » devient « 1 verte » et « 1 lancers francs » devient « 1 lancer franc ».

## Corrections par notion (avant → après)

### Graves : énoncé impossible, réponse fausse ou illisible

- **pythrec-1** (ch11_gm) : « Un triangle a pour côtés 3 cm, 4 cm et 8 cm. Est-il rectangle ? … (il a un angle obtus) » : ce triangle n'existe pas. Le côté ajouté est maintenant toujours < a + b.
- **thalesrec, riche « Le papillon »** (riche_11c) : OA = 2, OB = 3, AB = 5 donnait un triangle OAB aplati. Le tirage exige maintenant AB < OA + OB.
- **condbayes-2** (ch4c_ana) : « Calcule P_B(A) (arrondi au millième) » n'avait aucune tolérance. La réponse arrondie 0,444 était donc jugée « presque ». Tolérance 0,001 ajoutée.
- **approxnorm** (ch4c_trous) : avec n = 25 (μ = 12,5), le générateur demandait « P(X ≤ 18.5) » (borne non entière, point décimal) et appliquait la correction de continuité à 19 (faux). Les bornes partent maintenant de la partie entière de μ, et l'intervalle centré n'utilise que des μ entiers.
- **pvectmp-2/3** (ch_mp4) : « aire ½√(50.00000000000001) », « √(7154.000000000002) » : des déchets de calcul flottant s'affichaient. Corrigé par un arrondi entier.
- **trigfn-1** (ch_mp2) : la figure faisait 4 px de haut (abscisses de −20° à 380°, un carreau par degré), donc elle était invisible. Elle a maintenant un carreau tous les 30°.
- **pct-1** (variantes) : « 35 % de 750 élèves viennent en bus » donnait la réponse 262,5 élèves. Seuls les pourcentages qui donnent un entier sont gardés.
- **statfreq-3** (ch_mp2) : « secteur de 45° sur 180 élèves » donnait 22,5 élèves. Même filtre.
- **trigeq2-1** (ch_mp2) : solutions affichées « 22.5° » (point décimal). Elles s'écrivent maintenant 22,5°.
- **vitesse-4, defis** (generators, ch11_prop) : « (et non 97.5) » devient « 97,5 ».
- **riche rat2c « Le coût moyen »** : « x ≥ 133.33333333333334 tasses » devient « x ≥ 900/3 ≈ 133,3 : au moins 134 tasses ».
- **riche trigfn2c « grande roue »** : « après 2.5 minutes », « h(2.5) » : la période vaut maintenant 12, 18 ou 24 min.
- **riche sys1c « La facture du plombier »** : « Un client a payé 407.5 CHF » devient « 407,50 CHF ».

### Contextes invraisemblables

- **optim-2** (gen3) : « ballon de volley … hauteur maximale 127 m », « plongeur d'un plongeoir de 3 m … 48 m ». Chaque objet a maintenant ses propres vitesses : ballon 7 m, balle 6 à 22 m, fusée d'artifice 80 à 180 m. Le plongeur est remplacé par une pierre lancée d'une falaise de 20 m. Pronom accordé (« atteint-il / atteint-elle »).
- **optim-3** (gen3) : « chaque ruche produit 270 kg de miel » (réalité : 10 à 40 kg). Les rendements et le pas dépendent maintenant du cadre (ruches 14 à 36 kg).
- **droitesinter-3** (ch_mp2) : « deux cyclistes … à 20 et 4 km/h ». Les cyclistes roulent maintenant à 12–16 km/h, et le randonneur « va » (il ne « roule » pas).
- **eqratmp-3** (ch_mp3) : « Un cycliste parcourt 440 km » devient au plus 150 km.
- **linfn-2** (fr_3e) : « un TGV : 0,75 h correspondent à 24 km » (32 km/h), « fromage à 2,50 €/kg ». Le coefficient dépend maintenant du contexte : TGV 240–320 km/h, fromage 18–32 €/kg.
- **stats-2** (ch_mp2) : notes « 6,5 » sur l'échelle suisse de 1 à 6. Les notes vont maintenant de 3 à 6.
- **ordgr-1** (ch10_no) : « billet de train 856 CHF et hôtel 49 CHF » devient « séjour à l'hôtel … et billet de train ».
- **utemps-3** (ch11_prop) : « Le cours de piano a duré 3 h 10 », « épisode de série 3 h 55 ». Les heures dépendent maintenant du contexte (série 1 h, film 1–2 h, Genève–Berne 1–2 h, randonnée 2–4 h).
- **vitesse-2** (ch11_prop) : « escargot à 4 mm/s » devient 1,5 mm/s, et la chenille 3 mm/s.
- **volcone-2** (ch11_gm), **volcomp** (variantes), **pythfig/geocomb** (ch1c_geo) : un cornet de glace de 14 cm de diamètre sur 3 cm de haut, ou de 16–18 cm de diamètre. Les cornets mesurent maintenant 4–6 cm de diamètre et 9–12 cm de haut. Les grands cônes sont devenus entonnoir, abat-jour et chapeau de fête.
- **volcomp-3** (ch11_gm) : « tente longue de 3 dm » devient 18–25 dm.
- **decmul-2** (ch10_no) : « tapis de 12,9 m sur 4,6 m » devient « sol d'une salle ».
- **pente-3** (variantes) : « funiculaire » de 2 à 9 m de dénivelé devient « chemin ».
- **ulong-3** (variantes) : « piste d'athlétisme de 250 m », « 12,5 tours ». Les pistes font 400 m (ou 200 m en salle) et le nombre de tours est entier.
- **diagr-2, pct, fracconv-1, statfreq (MP), fractout-4, riche frac9** : « classe de 36 / 40 / 50 / 80 élèves ». Au-delà de 28, la formulation devient « Sur N élèves (apprentis) interrogés » ; les classes vont de 18 à 30.
- **defis reladd** : arrivée d'une randonnée à 199 m d'altitude. Elle reste maintenant ≥ max(193 m, départ − 200 m).
- **defis_910 decprob** : « 1,5 L de jus par personne » devient 0,4 à 0,75 L.
- **defis volrev** : un « verre » de 17 cm de diamètre contenant 1,1 L. Le rayon du bord est maintenant ≤ 4,5 cm.
- **riche_11b « crêpes »** : « 3/10 kg de beurre pour 6 personnes » devient de la farine (et le paquet entamé aussi).
- **riche_1c « trottinette »** : « Un vélo coûte 0 CHF de déblocage » devient « se loue sans frais de déblocage ».
- **fr_2nde tauxevol** : « La population de Grenoble (ou de son agglomération) passe de 25 000… » devient « d'une commune proche de Grenoble ».
- **fr_trous** : « un liquide perd 4 °C par minute au congélateur » devient « congélateur, t heures après sa mise en marche ». L'« aire x·x + 2 d'une figure de côté x » devient « un carré de côté x et un rectangle de 2 cm² ».

### Formulation et langue

- **sys2-2** (ch1c_sys) : « 2(x + y) = 0 + 4y » devient « = 4y ».
- **bayes-2** (ch4c_ana) : « Un(e) puce est défectueuse : … qu'il ou elle vienne » devient « Une puce … qu'elle vienne » ; « Une entreprise travaille avec trois lignes de bus » devient « Une compagnie exploite… ».
- **syslin-3** : « pour une prix total », « une montant » deviennent « un prix total », « un montant ».
- **proba6** (fr_fin) : « On en tire un(e) au hasard ; … un(e) des jetons », « fréquence d'apparition de le secteur rouge », « 1 vertes » : formulations corrigées.
- **projmp-1** (ch_mp4) : « par rapport à le canal » devient « au canal ».
- **croissexp-3** (ch_mp3) : « moins de le tiers » devient « moins du tiers ».
- **ineq1-3** (fr_2nde) : « combien de entrées » devient « combien d'entrées » ; « un graine » devient « une graine ».
- **suitesomme-2** (fr_lycee) : « en 6 jours (années) » devient « en 6 ans ».
- **binom-3** (fr_lycee) : « exactement 1 touches » devient « 1 touche ».
- **thales4e-2** (fr_3e) : « la longueur de la entretoise » devient « de l'entretoise ».
- **riche_9** : « le natation » devient « la natation » ; **riche_10** : « pour le fleurs » devient « pour les fleurs », « au sommet de le Grand Combin » devient « du Grand Combin ».
- **riche_mp34** : « chacune des marteaux-piqueurs » devient « chacun » ; **riche_col34** : « fait-il ou elle ? » devient « Quelle confusion fait X ? ».
- **decread-2** : « 1 dizaines » ; **reladd-1** : « de 1 unités » : accords corrigés.
- **defis logdef** : « 2,5 unité de pH » devient « unités ».

## Points douteux, à valider par l'enseignant

1. **approxnorm-3** : « un hôtel accepte 100 réservations pour 55 chambres, chaque client vient avec la probabilité 0,5 ». Les calculs sont justes, mais un surbooking de près du double n'est pas réaliste. Faut-il passer à p = 0,9 et 100 réservations pour 95 chambres ?
2. **arith-4** (défis) : deux contextes collés dans un même énoncé (« deux bus … et des croissants dans des corbeilles », « carreler une salle … puis empiler des boîtes »). Le procédé est voulu (PGDC et PPMC), mais la lecture est déroutante.
3. **vecmp4 « Le travail d'une force »**, **scalmp-2** : un cheval qui tire une péniche avec environ 120 N, une luge tirée avec 200 N. Les ordres de grandeur sont discutables (un cheval tire plutôt 500 à 1000 N).
4. **primitives-4** : chariot sur rail atteignant 50 m/s (180 km/h).
5. **rel-4** (La Brévine) : baisse de 26 °C en 10 h. C'est extrême mais plausible à La Brévine.
6. **fct11 « température en altitude »** : −5 °C par 500 m (réel : environ −3 °C). Valeur pédagogique simple, gardée.
7. **ineq-3** : cinéma à 6 CHF la séance (prix réel plutôt 15 à 20 CHF).
8. **similmp-2** : une bouteille de 20 cm qui contient 1,5 L.
9. Les questions à distracteurs (« La voiture est rouge et transporte 3 personnes », « le téléphérique a coûté 40 millions ») sont voulues et ont été gardées.

## Non traité (autre agent, worktree fixrevue)

Thalès niveau 3, le plongeur (ch11_no2, rel), dec()/decmul (ch10_no), probeq « une fois et demie », l'indice de f2, le filtre TeX au rendu, le déroulé des séances. Rien de neuf vu sur ces points.

## Décisions de l'enseignant appliquées (lot du 26.11, branche agent/lot)

- Hôtel (approxnorm-3) : plus d'hôtel ; « atelier gratuit » (un inscrit sur deux vient, dit dans l'énoncé) ; vol : présence 0,9, 400 billets pour 363 à 369 places.
- Péniche : 400 à 1000 N (ch_mp4, riche_mp34) ; luge : 30 à 80 N ; valise, skieur : forces propres au contexte.
- Chariot sur rail (défi primitives) : chariot de labo, en cm/s et cm.
- Altitude (riche_11c) : −3 °C par 500 m (≈ −0,65 °C par 100 m).
- Cinéma : 15 à 20 CHF la séance (ch1c_eq, ch1c_sys, gen2, variantes) ; billets à 2–9 CHF remplacés par la piscine.
- Bouteilles semblables (ch_mp3) : hauteur et contenance cohérentes (0,4 L pour 20 cm, 1,5 L pour 30 cm…).
- Défis arith : un seul contexte (bus ; corbeilles ; carrelage seul en 1re).
- Contrôles ajoutés à tests/vrai_checks.js : surréservation, force (cheval, luge), vitesse d'un chariot, gradient d'altitude, prix du cinéma, bouteille, « (elle) » / « Un(e) ».

## Soir (26.11, branche agent/vrais2) : notions ajoutées depuis le matin, profils séparés

### Périmètre

- Notions ajoutées ou très modifiées depuis l'audit du matin : isom, ensco, numer, fctlec, litconv (src/perco.js, 5 notions nouvelles : le catalogue passe de 321 à 326 notions), formes VARX ajoutées à simil (homothéties) et volcone (cône, sphère) ; graphefct, ineqgraph (ch1c_trous) ; geoesp, densite, approxnorm (ch4c_trous) ; cercle6, bissec6, filtre6, tabform5, hauteurs5 (fr_trous) ; symax, mediatrice, echelle6, proba6, empil, compdiff, posrelc, intmaj, suiteint (fr_fin) ; repere3d (ch11_rep3d) ; tradalg, contrex, demoalg, implication (ch1c_arg) et leurs leçons actives (ch1c_argact, relues à la main : rien à signaler).
- 31 notions, 150 à 400 graines par niveau (défis compris), lecture humaine de 2 ou 3 tirages par forme d'énoncé (environ 600 formes).
- Profils : tout le catalogue de chaque classe (CO 9e–11e, Collège 1re–4e, MP 1re–4e, France 6e–Tle), questions finales (Engine.make : formes réservées écartées, passe française appliquée), 3 graines dans la suite (29 000 questions) et 8 graines à la main (77 000 questions).

### Outils

- `tests/vraisemblance_soir.html` (dans la suite, environ 50 s) : notions du soir à 150 graines avec les contrôles de `tests/vrai_checks.js` et des contrôles propres (variable annoncée absente, accord « une allée … est représentée », colonne répétée dans un tableau de valeurs, congélateur sous −26 °C) ; séparation des profils (France : CHF, francs, lieux suisses, apprentis, PGDC, préimage, cathète, « mise en évidence », septante, produit « · » hors produit scalaire ; romand : € hors change, « × » entre deux nombres, PGCD, antécédent, brevet) ; rapport des défis figés (mineur). Options `#n=`, `#np=`, `#detail`.
- `tests/vrai_checks.js` : élision devant un nom commun ou un pronom (« combien de heures », « que il », « de abricots ») ; surréservation aussi pour « billets pour un avion de … places ».

### Corrections transversales

- `elideTidy` (src/generators.js, dans `moneyTidy`, donc appliquée à tous les textes de question, défis et sujets riches) : « de entrées », « de élèves », « que il », « de huile » deviennent « d'entrées », « d'élèves », « qu'il », « d'huile » (liste fermée de mots, h aspiré exclu). Elle corrige aussi probeq-2 (« une liste de élèves ») sans toucher à son générateur, ainsi que ineq-1/3, ratio-2, probtot-3, implication-1, riche dec9 et volmp3.
- Passe française (src/curriculum.js, profil France seulement) : « arrondie au franc supérieur (€) » (ordgr-4), « pas des francs » (pctvar-3), « chaque franc d'augmentation » (optim-4) passent à l'euro ; « apprentis » devient « élèves » (statfreq, quartiles : sondages de 5e posés à des apprentis) ; « sa préimage » devient « son antécédent » ; « on met (x + 4) en évidence » devient « on factorise par (x + 4) » (eq2-3) ; « La Brévine » devient « Mouthe » (rel-4) ; « trajet Genève–Berne » devient « Lyon–Grenoble » (utemps-3 : il donnait « Lyon–Berne »).

### Corrections par notion (code de la question → correction)

- **q-fctlec-1/2/3** (perco) : « Au bout de combien de heures » devient « combien d'heures » ; « le prix (en CHF) de farine » devient « de la farine » (« des pommes », « de l'essence ») ; la température « un matin de printemps » allait jusqu'à 14 h : « pendant une journée de printemps ».
- **q-litconv-2** (perco) : « calcule (a + b)² moins a² + b² » se lisait (a + b)² − a² + b² : « calcule (a + b)² et a² + b², puis tape la différence ».
- **q-volcone-1/2** (perco, formes cône et sphère) : « les points situés à au plus 8 cm » devient « à une distance d'au plus 8 cm » ; « On coupe un cône, par un plan… » (virgule) corrigé ; « une boule de pétanque géante d'une sculpture » devient « une boule de polystyrène ».
- **q-ensco-4, q-fctlec-4, q-litconv-4** (perco, défis) : un seul énoncé, toujours le même (« Voici six nombres : −7 ; 12/4… », taxi à 6 CHF + 2,50 CHF/km, A = 3(x + 4) − x) : tirés au hasard (nombres, prix, coefficients).
- **q-approxnorm-4** (ch4c_trous, défi) : « 625 billets pour un avion de 515 places, présence 0,8 » (110 billets de trop) contredisait la décision de l'enseignant du matin : 100 billets pour un vol de 94 places, présence 0,9 (μ = 90, σ = 3, Φ(1,5)).
- **q-approxnorm-1/2/3** (ch4c_trous) : « Un QCM a 625 questions à 5 choix » devient « 625 élèves répondent au hasard à une même question à 5 choix ».
- **q-densite-2/3** (ch4c_trous) : un vélo de location qui crève en moyenne tous les 2 à 20 km : distance en centaines de km.
- **q-graphefct-2** (ch1c_trous) : « Pour quelles abscisses a la droite x = a… » devient « Pour quelles valeurs de a ».
- **q-implication-1/2** (ch1c_arg) : « si x = 8, alors x² = 64 (x et y sont des réels) » : y n'apparaît pas, c'est maintenant « (x est un réel) » ; espace avant le point après les énoncés de géométrie (« » . ») supprimé.
- **q-tabform5-1** (fr_trous) : tableau « n : 1, 4, 6, 8, 5, 6 » (colonnes en désordre et répétées : le pas était tiré pour chaque colonne) ; congélateur refroidi de 4 °C par heure jusqu'à −33 °C : 2 ou 3 °C par heure (−21 °C au plus froid).
- **q-cercle6-3** (fr_trous) : « des cordes de 3 m et 3 m » devient « de 3 m chacune ».
- **q-echelle6-2** (fr_fin) : « une allée de 2,5 m est représenté » : accord.
- **q-proba6-2** (fr_fin) : « un paquet de 40 cartes, la probabilité d'une carte rouge vaut 0,3 » (un jeu de cartes est rouge pour moitié) : « une pochette de cartes à gratter, carte gagnante ».
- **q-simil-4** (defis, maquette d'un bâtiment) : volume tiré sans lien avec l'aire au sol et la hauteur (146 cm², 40 cm, 1 800 cm³) : maintenant 70 à 100 % de aire × hauteur.
- **q-croissexp-3** (ch_mp3) : « Après combien de ans » devient « combien d'années ».
- Profil romand : « on cherche un antécédent / l'antécédent / son antécédent » (affine, tabval, translin) devient « préimage » (passe française inchangée en France) ; « une feuille de 30 cm × 14 cm » (optimderiv-4), la plaque de carton (riche col34), la photo (question curieuse « Le poster ») : « de 30 cm sur 14 cm » ; « Aire × 6,25 » (corrigé du défi simil) : « aire multipliée par 6,25 ».

### Vérifié sans défaut

isom (formes, axes, centres, compositions), numer (égyptien, romain, binaire, base 60 ; « 11…1 » est un affichage de l'outil de lecture), ensco, repere3d, tradalg, contrex, demoalg, ineqgraph, geoesp, bissec6, hauteurs5 (hauteurs compatibles avec les côtés), symax, mediatrice, empil, compdiff, posrelc, intmaj, suiteint (« I₀ = 2 » est un affichage de l'outil : la question porte ln 2), filtre6.

### Reste (non traité)

- ~~Défis figés~~ : traité (agent/defis2, ci-dessous).
- Le signe « × » reste dans des aides en texte du profil romand (« longueur × largeur », « Longueurs × k », 91 notions-niveaux, src/generators.js HINTS et leçons) et pour les formats (« pavé 2 × 3 × 6 », « matrice 2 × 2 », produit vectoriel) : usage courant en Suisse aussi ; décision de l'enseignant à prendre (le contrôle de la page ne vise que « nombre × nombre = »).
- La pyramide du Louvre (pythfig, profil romand) et le change CHF ↔ EUR sont gardés (références voulues).
- Contrôle de densite-1 « position d'une panne sur un câble, loi uniforme sur [3 ; 7] (en m) » : vraisemblable mais peu parlant.

### Défis figés rendus aléatoires (26.11 soir, branche agent/defis2)

Les 12 défis (niveau 4) qui n'avaient qu'un ou deux énoncés fixes sont maintenant tirés au hasard, avec 3 contextes
chacun (tag `ctx`), corrigé calculé et recalculé indépendamment (`tests/recalc_oracles.js`, un oracle par contexte et par
question : 5'400 questions de défi sur 150 graines, toutes justes, contre-épreuves détectées).

| Notion | Profil | Contextes (ctx) |
|---|---|---|
| symax (6e) | France | triangle et axe (BC), angles calculés depuis les côtés (loi des cosinus, cohérents) ; allée d'un jardin à la française (statue, banc) ; rectangle doublé par symétrie (périmètre, aire) |
| mediatrice (6e) | France | puits à égale distance de trois maisons (PA > AB/2, cordes < 2PA) ; salle de sport commune à deux villages ; cerf-volant (C et D sur la médiatrice) |
| echelle6 (6e) | France | carte de randonnée (1/25 000 ou 1/50 000, 4 ou 5 km/h) ; plan d'appartement (1/50, 1/100 : dimensions et aire) ; maquette (paquebot, voilier, avion, pont ; maquette deux fois plus grande) |
| proba6 (6e) | France | sac (billes, jetons, bonbons ; objets à retirer pour une probabilité donnée) ; roue de loterie (secteurs à repeindre) ; cartes numérotées (multiples, « au moins ») |
| empil (5e) | France | pyramide à étages carrés ; escalier (profil, cubes, vue de dessus) ; tour creuse (contour, remplissage) |
| compdiff (2nde) | France | prix au kilo (café, fromage, chocolat, thé ; quotient) ; population ville / village (différence et quotient) ; consommation aux 100 km |
| posrelc (1re) | France | parabole et droite ; deux paraboles ; coût et recette (bénéfice maximal) |
| intmaj (Tle) | France | fonction croissante (amplitude) ; fonction décroissante (minorant, majorant, centre) ; débit d'une source (majorant du volume) — encadrement contrôlé par l'intégrale (Simpson) |
| suiteint (Tle) | France | xⁿ(1 − x)² ; xⁿ(1 − x) avec seuil ; xⁿ(a + x) avec limite de n·Iₙ — intégrales recalculées par Simpson |
| approxnorm (4e Collège) | romand | surréservation (présence 0,9, quelques places de moins) ; germination (« au moins k ») ; pièce ou sondage (intervalle centré) — valeur de Φ contrôlée, réponse « au dix-millième, avec la table » |
| isom (9e) | romand | deux symétries d'axes parallèles (verticaux ou horizontaux) ; symétrie de centre O ou Ω (aire conservée) ; translation appliquée une ou deux fois |
| numer (9e) | romand | date en chiffres romains (monument, cloche, gare après 1850, moulin) ; deux nombres binaires (au moins deux « 1 ») ; nombre égyptien et son double (échanges) |

Contrôle : `tests/vraisemblance_soir.html` échoue désormais (au lieu de signaler) si un défi des notions du soir n'a qu'un
énoncé, et si l'un de ces 12 défis a moins de 10 énoncés différents (énoncé et questions) ou moins de 3 contextes sur
#n graines.

Restent peu variés (2 à 4 énoncés au niveau 4, hors de cette tâche) : densite, hauteurs5, graphefct, repere3d, geoesp,
tabform5, ineqgraph ; et, dans tout le catalogue, une soixantaine de défis à 1 ou 2 énoncés (relevé sur 60 graines par
défi : pow9, angtype, lectgraph, puisrat, logprop, proba2, tauxevol, vect3e, probcond, algopy,
bayes, syslin, bases, cplxalg, cplxtrig, cplxeq, suitegeom, serie, expderiv, trigrad, autodnb, tabvar, lnfr…).
→ suite traitée ci-dessous (agent/defis3).

### Défis variés, suite (26.11 soir, branche agent/defis3)

Relevé de départ (`tests/_variete.html`, hors suite : 60 graines par défi, énoncé et questions) : 50 défis avaient moins
de 10 énoncés différents. Traités par ordre de fréquence (9e–11e et 1re Collège, puis 2e–4e Collège et MP) : valeurs
tirées, au moins 3 contextes vraisemblables (tag `ctx`), corrigé calculé à partir des valeurs, oracle par contexte et par
question dans `tests/recalc_oracles.js` (section « défis rendus variés (agent defis3) »).

| Notion (classe, fichier) | Avant | Contextes (ctx) |
|---|---|---|
| fracmul (10e–11e, ch11_no) | 7 | forêts et feuillus ; élèves sportifs et football ; potager et tomates ; ruban, fontaine à jus, planche (fraction retirée puis morceaux) |
| fracconv (9e–11e, ch11_no) | 2 | trois magasins (rabais en fraction, en %, hausse puis baisse) ; nombres périodiques tirés ; sondage (fraction, %, effectifs) |
| sci (10e–11e, defis.js) | 7 | lumière du Soleil aux planètes ; objets microscopiques (atome, virus, bactérie, globule, pollen : en nm ou µm, nombre alignés sur 1 mm) ; rayon d'un astre (en m, équateur) |
| scicalc (10e–11e, ch11_no) | 2 | année-lumière et étoile ; globules rouges ; battements de cœur (an, vie) |
| pythfig (10e–11e, ch11_gm) | 2 | boîte, coffre de voiture, placard (diagonale, l'objet entre-t-il ?) ; planche, parterre, vitrail (carré inscrit) |
| pythrec (11e, ch11_gm) | 2 | repère, carte (villages), voile d'ombrage (réciproque, rectangle ou non) ; formule n² − 1, 2n, n² + 1 ; équerrage d'un cadre, d'une dalle, d'une plate-bande |
| vol (10e–11e, ch11_gm) | 2 | piscine à fond incliné ; canal d'irrigation ; tente canadienne ; canette, conserve, pot de peinture (hauteur minimale) |
| airepyr (11e, ch11_gm) | 2 | toit de tour, tente, presse-papier ; patrons (carton, emballage, abat-jour) |
| volcomp (11e, ch11_gm) | 2 | silo, réservoir (cylindre et cône) ; bougie, presse-papier, savon (cube et pyramide, masse) |
| thales (11e, ch11_thales) | 2 | ombres (tour, clocher, sapin) ; triangle, charpente, voile (trapèze DECB) ; étang, rivière, ravin (piquets) |
| repere (10e–11e, ch11_fct) | 2 | parallélogramme (repère, parcelle en m², plateforme de jeu en pixels²) ; milieu (repère, rendez-vous, passerelle) |
| sysprob (11e–1re, ch1c_sys) | 2 | têtes et pattes (ferme, parking, tabourets et chaises) ; avec et contre le vent ou le courant (avion, bateau, kayak) |
| sysgraph (1re, ch1c_sys) | 2 | paramètres m et k (parallèles, confondues, solution) ; opérateurs, location de vélos, salle de sport |
| sysineq (1re, ch1c_sys) | 2 | budget (sortie, anniversaire, tournoi) ; double inéquation (borne gauche exclue ou comprise) |
| eqfrac (10e–11e, ch1c_eq) | 6 | robinets, imprimantes, peintres |
| bicarre (1re, ch1c_eq) | 9 | bicarrée à 4 ou 2 solutions (X négatif) ; rectangle (aire et diagonale) ; deux nombres (produit, somme des carrés) |
| lectgraph (1re–MP, defis.js) | 1 | f(x) < g(x), >, ≤, ≥ ; image hors du dessin tirée (la parabole est relue sur la figure par l'oracle) |
| trigexact (1re–MP, defis.js) | 5 | panneau équilatéral ; table hexagonale ; chevron de toit à 30°, 45°, 60° |
| droitesrem (1re–MP, defis.js) | 7 | triangle ; jardin et arroseur (centre du cercle circonscrit) ; équerre donnée par l'hypoténuse |
| polyreg (10e, defis_910) | 7 | somme des angles donnée ; kiosque (angle intérieur donné) ; bassin à n côtés |
| graphefct (1re, ch1c_trous) | 3 | cercle et droite verticale (0, 1 ou 2 points) ; arche de pont ; parabole couchée |
| ineqgraph (2e, ch1c_trous) | 4 | f(x) <, ≤ (entiers entre les zéros), >, ≥ (plus petit entier positif) ; bénéfice d'un atelier |
| repere3d (11e, ch11_rep3d) | 3 | boîte, salle de sport, aquarium (quadruplets a² + b² + c² = d², coordonnée du centre tirée) |
| bayes (4e, ch4c_ana) | 1 | dépistage ; filtre à spam ; contrôle qualité (second signal indépendant) |
| syslin (4e, ch4c_ana) | 1 | boulangerie, cinéma, papeterie (système 3 × 3 tiré, Cramer) |
| bases (4e, ch4c_ana) | 1 | vecteurs tirés ; composante α, β ou γ demandée |
| etudelnexp (4e, ch4c_ana) | 3 | x·e^(−x/k), x²·e^(−x/k), ln(x)/x, facteur tiré |
| geoesp (4e, ch4c_trous) | 4 | tente, toit, presse-papier (pyramide : arête, angle face–base, volume) |
| densite (4e, ch4c_trous) | 2 | durée d'appel, attente au guichet, fléchette sur une cible (f(x) = kx) |
| probaxiomes (3e–4e, ch3c_ana) | 6 | B = double, au moins un 6, rouge pair (comptage sur les 36 issues) |
| derivth (3e–4e, ch3c_ana) | 3 | \|(x − p)(x − q)\| (Rolle) ; \|x − p\| + \|x − q\| ; accroissements finis sur x³ |
| trigcercle (2e–4e, MP, defis.js) | 9 | angle (radians, cosinus, angles associés) ; grande roue, arroseur (coordonnées exactes) |
| optimderiv (3e–4e, defis.js) | 9 | boîte sans couvercle ; boîte de conserve (10 volumes) ; potager, enclos, terrasse le long d'un mur |
| eqlog (MP 3e–4e, defis.js) | 10 | base 2 ; base 3 ; équation-quotient log₂(x + b) − log₂(x − a) = k |
| eqbic (MP 3e–4e, defis.js) | 12 | écran (diagonale et aire) ; deux nombres ; triangle rectangle (hypoténuse et aire) |
| dec10, pow9, aire1 (9e, defis_9) | 1 contexte | feuilles, pièces, grains de riz ; bactéries, rumeur (puissances de 3), pliage ; carré et rectangle, pelouse et potager, affiches |
| quadri, decarr, airelat (9e–10e, defis_910) | 1–2 contextes | losange, rectangle, parallélogramme ; supermarché, librairie, papeterie (prix au 5 centimes) ; conserve, tube d'affiche, bidon |
| fracadd (9e–11e, ch11_no) | 2 contextes | élection (prénoms tirés) ; boisson diluée (sirop, thé glacé, cocktail) ; argent de poche |

Contrôles : `tests/vraisemblance_soir.html` (liste `VARIES`, 54 défis) échoue si l'un de ces défis a moins de 10 énoncés
différents ou moins de 3 contextes sur #n graines ; `tests/recalcul.html` recalcule leurs parties (oracles `DF`) ; le
recalcul reçoit maintenant l'item (`fig` compris) pour les règles de texte, ce qui permet de relire la parabole de
lectgraph sur la figure. Mesure hors suite : `tests/_defis3.html#ids=…&n=150&show=2` (énoncés, contextes, parties
recalculées, désaccords) et `tests/_variete.html` (relevé de tout le catalogue).

Défauts trouvés en route (corrigés) :

- bayes, thales (rivière) : réponse « au centième » non arrondie sur l'écriture décimale (3,475 donnait 3,47 en
  flottant) : arrondi décimal exact, ou valeur attendue déjà arrondie.
- optimderiv (conserve, existant) : l'oracle lisait « surface minimale (à l'unité) » comme un arrondi vers le haut ;
  la réponse attendue (au plus proche) est juste, l'oracle force maintenant l'arrondi au plus proche.
- decarr : prix à 21,65 CHF, 11,37 CHF : au 5 centimes près (usage romand).
- Énoncés : « l'ombre de une tour », « Hauteur de le clocher », « Nombre maximal de invités », « Une boîte … est
  posé » : élisions et accords corrigés avant publication ; salle de 1 m de haut, planche à repasser de 227 cm :
  dimensions et objets adaptés au contexte.

Restent à 1 ou 2 contextes (gabarits, nombres effacés ; relevé de `tests/_variete.html` sur 60 graines) : environ
130 défis, dont, en 9e–11e : rel, pct, valnum, eq1, prop, affine, disque, probeq, decread, deccomp, ordgr, decadd,
decdiv, decprob, tradexpr, multdiv, divcrit, relrep, reladd, fracrep, fracsimp, fractout, ulong, uaire, uvol, perim,
aire2, aire3, volpave, proptab, change, agrand, litelab, angtype, grandmanq, fracops, voldecomp, carres, racenc,
eqverif, pctvar, pente, rotation, parenth, probeq2, symetries, fctlec, prio, rac, reduire, distrib, idrem, eq2,
echelle, pyth, sys2, angles, angtri, diagr, volcone, formule, simil, proba, premiers, fracper… (valeurs déjà
tirées, contexte unique). Profil France (fichiers fr_*.js, réservés à l'agent frlycee) : proba2, tauxevol, vect3e,
probcond, algopy (fr_2nde), expderiv, trigrad (fr_1re), autodnb, tabvar (fr_3e), lnfr (fr_tle) n'ont qu'un énoncé
figé ; hauteurs5 (2 énoncés) et tabform5 (4) dans fr_trous. Hors catalogue (aucune classe) : cplxalg, cplxtrig, cplxeq,
suitegeom, serie, pvect, intsubst.



### Défis du profil France rendus variés (26.11 soir, branche agent/defisfr)

Les défis (niveau 4) des fichiers `src/fr_*.js` qui avaient un énoncé figé ou un seul contexte sont maintenant tirés au
hasard, avec 3 à 5 contextes français (tag `ctx` : euros, villes et régions françaises, Tour de France, brevet, TER,
lycée…), un corrigé calculé à partir des valeurs et un recalcul indépendant par contexte. Programmes : 2026 (6e–1re),
2019 (Tle). Arrondis demandés (« au dixième », « au centième », « à l'unité ») : tolérance de la moitié du pas, valeurs
tirées loin d'un « 5 » final ; seuils (lnfr, algopy) jamais sur un entier exact.

| Notion (classe, fichier) | Avant | Contextes (ctx) |
|---|---|---|
| proba2 (3e–2nde, fr_2nde) | figé | dé à n faces (S : « au moins k », « multiple de k ») ; tirage sans remise (billes, feutres, chocolats, bonbons) ; sondage au lycée (A ∩ B, A ∪ B, ni A ni B) ; QCM au hasard (2 ou 3 questions) |
| tauxevol (2nde, fr_2nde) | figé | hausse puis baisse (forfait de ski, loyer, salle d'escalade, trottinette) ; population d'une commune ; abonnés d'une chaîne vidéo ; soldes (taux réciproque) ; décote d'une voiture, d'un camping-car |
| vect3e (2nde, fr_2nde) | figé | parallélogramme (repère, jardin à la française, logiciel) ; alignement (course d'orientation à Fontainebleau, parc à Lille) ; déplacement u puis v (robot d'entrepôt, voilier à Quiberon, jeu vidéo, drone) |
| probcond (2nde, fr_2nde) | figé | arbre au lycée (demi-pensionnaires) ; dépistage ; usine à deux chaînes ; tableau croisé d'un club sportif |
| algopy (2nde, fr_2nde) | figé | somme par boucle for (range(1, n + 1) ou range(n)) ; livret et boucle while ; tarif par if/elif/else (musée, patinoire, piscine) |
| expderiv (1re, fr_1re) | figé | concentration a·t·e^(−kt) ; bactéries N₀e^(kt) ; f(x) = (ax + b)eˣ ; boisson qui refroidit |
| trigrad (1re, fr_1re) | figé | cos x ou sin x donné dans un quart de tour, angles associés ; nacelle d'une grande roue ; mesure principale de kπ/d |
| autodnb (3e, fr_3e) | figé | partie 1 du brevet : fractions et identités ; puissances de 10, probabilité, pourcentage ; Pythagore, vitesse d'un TGV ou TER, aire en π ; équation, évolutions, image |
| tabvar (2nde, fr_3e) | figé | tableau de f ; température d'un jour d'hiver ; profil d'étape du Tour de France ; bénéfice d'une petite entreprise |
| lnfr (Tle, fr_tle) | figé | placement ; utilisateurs d'une application ; médicament ; plaques de verre teinté |
| hauteurs5 (5e, fr_trous) | 2 énoncés | triangle rectangle ; voile de dériveur ; terrain ; pignon isocèle (triplets cohérents, pas de Pythagore demandé) |
| tabform5 (5e, fr_trous) | 4 énoncés | club ou école (prix = a × n + b) ; location à l'heure ; congélateur (2 ou 3 °C par heure, −21 °C au plus froid) ; bougie |
| cercle6, bissec6, filtre6 (6e, fr_trous) | 1 contexte | deux cercles, chèvre, piste graduée, antenne ; angles adjacents, angle plat, triangle, part de tarte ; sorties, smartphones, campings (deux critères) |
| progcalc, ratio (5e–4e, fr_college) | 1 contexte | deux programmes, programme à remonter, (x + a)² − x² ; associées, pâtisserie, béton, tombola |

Contrôles (dans la suite) : `tests/recalcul_fr.html` (oracles de `tests/recalc_oracles_fr.js`, placés en tête des règles
et réservés à ces notions : 17 défis × 150 graines, 7 650 questions, toutes recalculées, une contre-épreuve par question) ;
`tests/variete_fr.html` (les 26 défis des fichiers fr_*.js : au moins 10 énoncés différents et 3 contextes sur 60
graines). Hors suite : `tests/_defisfr.html#ids=…&n=150&show=2` (lecture des tirages et désaccords).

Défauts trouvés par les oracles avant publication (corrigés) : bénéfice « décroissant » qui remontait (tabvar) ;
« concentration maximale (au centième) » lue comme un arrondi par défaut (devenu « la plus élevée ») ; nacelle à 5π/4
où « tourner de π/2 » ne changeait pas la hauteur (π/4 et 5π/4 écartés) ; « 1 crayons bleus » (autodnb) ; la question
« aire d'un disque de rayon r » reconnue par un oracle générique comme une aire décimale (formulation changée).

### Défis à 3 contextes, suite (26.11 soir, branche agent/defisch)

Relevé de départ (`tests/_variete.html`, 60 graines) : 167 défis à 1 ou 2 gabarits. Traités ici **56 défis**, par
fréquence (9e–11e d'abord) : valeurs tirées, au moins 3 contextes vraisemblables (tag `ctx`), corrigé calculé, oracle
par contexte **et pour le gabarit d'origine** dans `tests/recalc_oracles.js` (section « agent defisch » ; les parties à
réponse en couple — coordonnées — sont maintenant recalculées aussi), ajout à la liste `VARIES` de
`tests/vraisemblance_soir.html` (≥ 10 énoncés, ≥ 3 contextes). Notions communes avec la France (defis.js, ch1c_eq,
ch11_litt, generators) : aucun lieu suisse dans les énoncés ajoutés (CHF → € par frLocal) ; contrôle hors suite
`tests/_frch.html#rel,pct,…` (profils FR 6e–Tle, 60 graines : ni CHF, ni lieu suisse, ni usage suisse).

| Notion (fichier) | Contextes (ctx) |
|---|---|
| decread (defis_9) | énigme ; décomposition avec retenue (« 41 millièmes ») ; chronomètre (slalom, natation, 400 m) |
| deccomp (defis_9) | sprint ; colis (le plus lourd) ; épaisseurs au micromètre |
| ulong (defis_9) | ficelle (masse) ; planche (chutes) ; ruban (rouleaux pour N cadeaux, au minimum) |
| uaire (defis_9) | carrelage ; terrasse (dalles de 40 cm, prix) ; planche de timbres (mm → cm²) |
| uvol (defis_9) | aquarium ; récupérateur d'eau de pluie (arrosoirs) ; piscine hors-sol (m³, débit du tuyau) |
| angtype (defis_9) | horloge ; gâteau (parts, angle obtus et non droit) ; rose des vents (girouette, sens horaire) |
| perim (defis_9) | rectangle ; enclos le long d'une grange (prix) ; fil de fer (carré, triangle, hexagone) |
| aire2 (defis_9) | parallélogramme ; voile triangulaire (hauteur relative au grand côté, tissu) ; cerf-volant en losange |
| aire3 (defis_9) | jardin et allée ; bassin et bordure de dalles ; photo et passe-partout (dm²) |
| volpave (defis_9) | boîte sans couvercle ; carton de déménagement (L, 6 faces) ; jardinière (sacs de terreau) |
| fracrep, fracsimp, fractout (defis_9) | tartes, sentier, gourdes ; fraction, matchs gagnés, sondage ; classe, argent de poche, bonbons |
| proptab, prop, change, agrand (defis_9) | cerises, essence, fromage à la coupe ; recette, sirop, mur de briques ; euro, livre (Londres), dollar (New York) ; photo, photocopie (%), logo de t-shirt |
| diagr, premiers, fracper (defis_910) | notes, basket, températures en montagne ; nombre, fanfare en rangs, dalles en rectangle ; trois formes de périodes |
| decprob, multdiv, relrep, symetries (defis_910) | pique-nique, peinture, gazon ; liste, bus, phares ; droite graduée, ascenseur, plongée ; repère, jeu vidéo, plan d'un parc |
| rac, disque, grandmanq, voldecomp (defis_910) | cube, terrain carré, aquarium cubique ; pizza, arroseur, aiguille des minutes ; trapèze, champ (are), canal ; piscine, escalier en béton, plate-bande en L |
| eqverif, pente, rotation (defis_910) | équation, rectangle, nombre pensé ; route, rampe (6 %), funiculaire ; repère, robot, logiciel de dessin |
| rel, reladd, decadd, decdiv, carres, ordgr (defis.js, communs FR) | températures, golf, compte d'un club ; randonnée, plongée, journée d'hiver ; achats, relais 4 × 100 m, randonnée ; restaurant, marché, vélo ; carrelage, chorale, verger ; course d'école, camp de ski, tournoi |
| fracops, divcrit, racenc, tradexpr, valnum (defis.js) | priorités, division, fractions d'heure ; 45 et 36, casiers, 15 et 18 ; racine, jardin carré, chute libre ; phrases, programme de calcul, rectangle ; freinage, chute libre, Fahrenheit |
| pctvar, affine, pyth, simil, monomes, reduire, pct (defis.js) | vélo, abonnés, récolte ; taxi, vélo électrique, plombier ; échelle, parc, cerf-volant ; photo, maquette, pizza ; pavé, cube, terrain ; triangle, rectangle, course d'orientation ; vélo, fitness, action |
| eq1, probeq, probeq2 (ch1c_eq) | bougies, citernes, tirelires ; musée, location de voiture, imprimerie ; cadre, entiers consécutifs, carré agrandi |
| litelab, parenth (ch11_litt), fctlec (perco), prio (ch11_no) | rectangle, triangle isocèle, âges ; expression, programme, plaque découpée ; taxi, kayak, électricité ; musée, parenthèses, anniversaire |

Défauts trouvés en route (corrigés) : moyenne de notes 4,625 « au centième » qui acceptait 4,62 et 4,63 (diagr) et
durée 1,95 h « au dixième » qui acceptait 1,9 et 2 (voldecomp) : valeur attendue arrondie exactement ; « Combien de
livres obtient-on » (compté comme des livres-objets) → « Somme obtenue en livres » ; corrigé de prio (musée) sans les
réponses a) et b) ; « 1 citrons », « 1 œufs » (prop) écartés ; « ≈ » devant une division exacte.

Restent à 1 ou 2 contextes (111 défis) :
- 9e–11e : distrib, idrem, eq2, echelle, sys2, angles, angtri, volcone, formule, proba, volmanq, eq2fact, cercthales,
  thalesrec, racprop (2 contextes chacun) ; litconv (1).
- 1re Collège : eq3, absval, ineq2, ensembles, trinfact, eqspec, modaff, geocomb, trigrel, f2, euclide, trigo, ineq,
  f2expr, racinv, ratden, exactes, f2trois, morceaux, tradalg, contrex, demoalg, implication.
- 2e–4e Collège, MP, France (fichiers fr_*.js réservés à l'agent defisfr) : cart, expo, stats, fracrat, droites,
  statfreq, quartiles, triaire, droitesinter, vecteurs, recipaff, eqratmp, logprop, croissexp, volmp, similmp, coordmp,
  vectmp, scalmp, projmp, pvectmp, explogfn, limitinf, continuite, combi, vect3d, droite3d, plans, pscal3d,
  primitives, volrev, croissance, appllin, condbayes, varalea, binomiale, normale, log, vabs, eqparam, trigassoc,
  trigeq2, eqirrmp, eqlog, derivref, etudefct, lnexp ; France seule : proba2, tauxevol, vect3e, probcond, algopy,
  colin, intparties, eqdiff, expderiv, trigrad, autodnb, tabvar, lnfr, cercle6, bissec6, tabform5, hauteurs5,
  progcalc ; hors catalogue : pvect, intsubst, cplxalg, cplxtrig, cplxeq, suitegeom, serie.

### Défis à 3 contextes, suite (26.11 soir, branche agent/defisch2)

Suite de la liste « Restent à 1 ou 2 contextes » de agent/defisch : **39 défis** (les 16 de 9e–11e, puis les 23 de
1re Collège). Même méthode : gabarits existants étiquetés (ctx), un contexte ajouté par notion (deux quand il n'y en
avait qu'un), valeurs tirées, corrigé calculé, oracle par contexte **y compris pour les gabarits d'origine** dans
`tests/recalc_oracles.js` (section « agent defisch2 »), ajout à `VARIES` de `tests/vraisemblance_soir.html`. Contrôle
`tests/_frch.html` sur les 39 notions : aucun CHF, lieu ou usage suisse en profil FR. Les défis hors de l'objet de
defis.js (distrib, echelle, litconv, eq3, eqspec, tradalg, contrex, demoalg, implication, angtri en 9e) sont complétés
dans PROB_EXTRA / PROBX ; les classes restent respectées (distrib « double » écarté en 10e par HORS_CO, angtri
« polygone » écarté en 9e, échelle « train » sans aire ni volume, donc permis en 10e).

| Notion | Contextes (ctx) |
|---|---|
| distrib | difference, accoles (10e), **double** (potager, poulailler, tapis agrandis ; 11e), **sortie** (classe et accompagnants, entrée + transport) |
| idrem | nombre, carre, **calcmental** (34², 26², 34 · 26 par les identités) |
| eq2 | rectangle, carre, **tournoi** (chaque équipe rencontre les autres une fois : n(n − 1)/2 matchs) |
| echelle | maquette, carte, **train** (trains miniatures H0, N, TT : locomotive, wagon, vitesse apparente en cm/s) |
| sys2 | billets, rectangle, **qcm** (points gagnés et perdus, autre barème) |
| angles | polygone, inscrits, **granderoue** (nacelles : angle au centre, inscrit, triangle isocèle) |
| angtri | polygone (1re), bissectrice (9e), **cerfvolant** (quadrilatère AB = AD, CB = CD) |
| volcone | cornet, boule, **tas** (sable, gravier, compost : remorques, couche étalée) |
| formule | imc, energie, **horizon** (d = 3,57√h : phare, tour, falaise) |
| proba | urne, des, **qcm** (2 ou 3 questions au hasard, 3 à 5 choix) |
| volmanq | conserve, verre, **piscine** (piscine ronde hors-sol : hauteur d'eau, durée au tuyau) |
| eq2fact | chute, lancer, **nappe** (nappe carrée qui dépasse : différence de deux carrés) |
| cercthales | tangentes, demicercle, **tunnel** (voûte en demi-cercle : hauteur, AC, BC, angle droit en C) |
| thalesrec | etagere, triangle, **escabeau** (sangle parallèle au sol) |
| racprop | carre, triangle, **cube** (arête a√k : diagonales exactes, aire) |
| litconv | comparer, **perimetre** (triangle isocèle ou rectangle), **conventions** (k · x · x − m · x + x · j · x) |
| eq3 | polynome, **evidence** (ax³ = bx), **groupement** (x³ + ax² − b²x − ab²) |
| absval | route, **tolerance** (pièces usinées), **bus** (deux fois plus loin de A que de B) |
| ineq2 | rectangle, **balle** (filmée au-dessus d'une hauteur), **recette** (prix pour une recette minimale) |
| ensembles | intervalles, **horaires** (magasin ouvert / Léo libre), **ages** (camp, tarif jeune adulte) |
| trinfact | benefice, **jet** (jet d'eau, zéro positif et sommet), **signe** (entiers où P(x) < 0) |
| eqspec | programme, **tarifs** (deux formules identiques), **perimetre** (aucune solution) |
| modaff | piscine, **cinema**, **escalade** |
| geocomb | tente, **rampe** (rampe de skate en prisme), **abri** (pavé et toit à deux pans) |
| trigrel | perimetre, **sinus** (hypoténuse donnée), **echelle** (cos donné) |
| f2 | recette, enclos, **fusee** (fusée à eau) |
| euclide | hauteur, cathete, **charpente** (AH et HB donnés) |
| trigo | elevation, rampe, **cerfvolant** (hauteur, distance, angle pour une hauteur visée) |
| ineq | rectangle, tarifs, **moyenne** (points par match à marquer) |
| f2expr | arche, sommet, **cable** (pont suspendu) |
| racinv | intersection, **partage** (une ou deux personnes de plus), **rectangle** (aire et périmètre donnés) |
| ratden | conjugue, **isocele** (a/√2), **inverse** (x = p + √q, x + 1/x, x² + 1/x²) |
| exactes | cube, hexagone, **equilateral** (panneau : hauteur, aire, rayon inscrit) |
| f2trois | points, falaise, **fleche** (trois hauteurs mesurées) |
| morceaux | parking, **kayak**, **velo** (location à l'heure plafonnée) |
| tradalg | impairs, reste, **calendrier** (carré 2 × 2 de dates) |
| contrex | multiples, premiers, **impairs** (« 2n + 1 est premier ») |
| demoalg | consecutifs, identite, **renverse** (ab + ba multiple de 11, ab − ba de 9) |
| implication | multiples, pair, **carres** (« n² multiple de 4 ⇒ n multiple de 4 ») |

Défauts trouvés par les oracles (corrigés) :

- Arrondis à égalité (valeur exacte en …5) qui acceptaient les deux voisins : thalesrec (AE ÷ AC au centième),
  formule (IMC, énergie cinétique), trigo (rampe), geocomb (tente) : valeur attendue arrondie sur l'écriture décimale
  (r1, r2c), comme pour les contextes ajoutés.
- litconv : k = 2 donnait « B = x + … » et le coefficient 1 (×1 trivial) : k ≥ 3.
- `tests/vrai_collecte.js` (texte lisible des tests) : \frac{12\sqrt{3}}{5} devenait « 12√(3)5 » (racine traitée après
  la fraction) ; la racine est maintenant remplacée d'abord — le corrigé de racprop (hauteur relative à l'hypoténuse)
  est enfin reconnu par le recalcul.
- Relecture : « Sur un jardin », chalet de vacances à 120 CHF, « l'échelle 0 », fusée à eau à 80 m, « heures entiers »
  corrigés avant publication.

Outil hors suite ajouté : `tests/_gabarits.html#ids=…&n=80` (gabarits par ctx, nombres effacés, sources PROB /
PROB_EXTRA / PROBX).

Restent à 1 ou 2 contextes : 2e–4e Collège et MP (cart, expo, stats, fracrat, droites, statfreq, quartiles, triaire,
droitesinter, vecteurs, recipaff, eqratmp, logprop, croissexp, volmp, similmp, coordmp, vectmp, scalmp, projmp, pvectmp,
explogfn, limitinf, continuite, combi, vect3d, droite3d, plans, pscal3d, primitives, volrev, croissance, appllin,
condbayes, varalea, binomiale, normale, log, vabs, eqparam, trigassoc, trigeq2, eqirrmp, eqlog, derivref, etudefct,
lnexp) ; France seule et hors catalogue : inchangés (voir la liste d'agent/defisch).
