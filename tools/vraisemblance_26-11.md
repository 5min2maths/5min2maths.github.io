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
