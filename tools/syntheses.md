# Synthèses de cours à façon (cartes mentales) — proposition du 23.11

## Décisions de l'enseignant (23.11) et réalisation

1. **Nom** : « Ma fiche ».
2. **Mode par défaut** : « Je me teste » (règles à trous), bascule vers « Je relis ».
3. **Emplacement** : derrière « Mon test » (bouton « 🗺 Ma fiche », limitée aux notions du test) et derrière « Progrès »
   (carte « Mes fiches », une fiche par chapitre). Rien sur l'accueil (6 cases).
4. **Erreurs personnelles** : oui, à l'écran et à l'impression (le carnet garde désormais le message de l'erreur reconnue
   et la réponse donnée).
5. **Carte du chapitre** : oui, avec « Je refais la carte ».
6. **Périmètre** : 11e Calcul littéral et Proportionnalité d'abord, puis le reste de la 11e. Trous, « L'essentiel » et liens
   de la carte rédigés par Claude, **à valider par l'enseignant** (`src/fiche_data.js`).

Réalisé sur la branche `agent/fiche` : `src/fiche.js` (écran, carte SVG, carte de mémoire, impression A4 paysage
3 colonnes à compléter / corrigé), `src/fiche_data.js` (chapitres 11C04 et 11C05), branchements minimaux dans `app.js`
(commentés « 22.11 »), test `tests/fiche.html`.

Maquette : `design/maquette_synthese.html` (3 écrans à 360 px, chapitre 11e « Calcul littéral », rien n'est branché).
Statut : **à contrôler**, aucune ligne de code de l'app modifiée.

## Recommandation (en tête)

1. **Une « fiche » par chapitre, à compléter, plutôt qu'une synthèse toute faite.** L'élève lit une règle avec des trous,
   se dit la réponse, touche le trou pour vérifier, puis coche ✓ ~ ✗ sur la ligne « Je sais… » (mêmes libellés et mêmes
   cases que l'autoévaluation de Mon test). Bouton « Je relis » pour tout voir.
2. **Triée pour l'élève** : à revoir d'abord (maîtrise basse, carnet d'erreurs, notions du test), puis en progrès, puis
   acquis (repliés), puis « pas encore vu en classe ». Son erreur réelle (carnet) est affichée sous la règle concernée.
3. **Une petite carte du chapitre** (5 à 8 cases, liens écrits à la main) colorée selon la maîtrise, pour la vue
   d'ensemble ; « Je refais la carte » = la reconstruire de mémoire. Pas de carte mentale radiale (illisible à 360 px).
4. **Emplacement** : derrière « Mon test » (outil « 🗺 Ma fiche », limité aux notions du test) et derrière « Progrès »
   (une fiche par chapitre, toujours disponible). Rien de nouveau sur l'accueil.
5. **Impression** A4 paysage 3 colonnes, mêmes couleurs que `synthese.typ`, version à compléter + version complète, par
   `window.print()` (« Enregistrer en PDF »). Étape 1 réalisable en ≈ 1 jour avec le contenu existant.

## 1. Quelles formes ? Ce que dit la recherche

Références citées de mémoire : titres et années à vérifier avant toute diffusion.

| Forme | Pour | Contre | Verdict |
|---|---|---|---|
| Synthèse toute faite (relire) | rassurante, rapide à produire | relire et résumer = efficacité faible ; illusion de maîtrise (« je reconnais, donc je sais ») | seulement en mode « Je relis » et en corrigé |
| Fiche 3 colonnes (modèle `synthese.typ`) | format connu des élèves de l'enseignant, tout le chapitre sur une page | trop dense pour un écran de 360 px | **format d'impression** |
| « L'essentiel en 3 lignes » | donne la structure du chapitre | à écrire à la main (12 chapitres en 11e) | en tête de la carte |
| Grille « Je sais… » cliquable | déjà dans l'app (qcm.js), métacognition, Avant / Après | ne contient pas la règle | **intégrée à chaque notion de la fiche** |
| Fiche à trous (règles à compléter) | pratique de récupération, effet de génération, réutilise les règles existantes | il faut marquer les trous (≈ 2 par notion) | **forme principale** |
| Carte mentale radiale | populaire, visuelle | illisible à 360 px ; les procédures de calcul s'y prêtent mal ; bénéfice surtout quand l'élève la construit | non |
| Carte des liens entre notions (petit graphe) | montre « développer ⇄ factoriser », « identités = cas particuliers » : ce que les fiches par notion ne montrent pas | liens à écrire à la main ; reste petite | **oui, petite, en complément** |

Ce qui soutient ce choix :

- **Pratique de récupération** : se tester fait mieux retenir que relire (Roediger & Karpicke, 2006, *Psychological
  Science*). Dunlosky et al. (2013, *Psychological Science in the Public Interest*) classent le test d'entraînement et la
  pratique espacée « haute utilité », le résumé, le surlignage et la relecture « faible utilité ».
- **Cartes conceptuelles** : construire une carte en étudiant fait moins bien que se tester (Karpicke & Blunt, 2011,
  *Science*) ; mais construire la carte **de mémoire** est une forme de récupération efficace (Blunt & Karpicke, 2014,
  *Journal of Educational Psychology*). La méta-analyse de Nesbit & Adesope (2006, *Review of Educational Research*)
  trouve un effet positif modéré, plus net quand l'élève construit la carte. D'où « Je refais la carte » plutôt qu'une
  carte à contempler.
- **Effet de génération** : on retient mieux ce qu'on produit que ce qu'on lit (Slamecka & Graf, 1978) → les trous.
- **Auto-explication** : expliquer pourquoi une étape est juste améliore la compréhension (Chi et al., 1994, *Cognitive
  Science*) ; Dunlosky et al. la classent « utilité modérée ». D'où une seule question « Explique en une phrase » par
  fiche, sur l'erreur personnelle de l'élève (pas une par notion : trop long pour un ado sur téléphone).
- **Illusions de compétence** : les élèves jugent mal ce qu'ils savent après une relecture (Bjork, Dunlosky & Kornell,
  2013, *Annual Review of Psychology*) → la case ✓ ~ ✗ est cochée **après** avoir tenté le trou, et confrontée au
  résultat du test rapide (« tu pensais savoir »), comme dans qcm.js.
- **Antisèches** : préparer une fiche autorisée à l'examen n'améliore pas le résultat (Dickson & Miller, 2005, *Teaching
  of Psychology*) — la fiche n'a de valeur que comme exercice de récupération, pas comme objet.

## 2. « À façon » : la personnalisation

Ce que l'app sait déjà, et ce qu'on en fait :

| Donnée existante | Où | Effet sur la fiche |
|---|---|---|
| Maîtrise `state.notions[id].m`, `status`, `ok` | engine.js | tri à revoir / en progrès / acquis / pas encore vu ; couleur des cases de la carte |
| Note par compétence `state.comps[cid]` (`compNote`) | engine.js, competences.js | note affichée à côté de chaque notion ; libellé de la ligne « Je sais… » |
| Carnet d'erreurs `state.carnet` (id, niveau, date) | app.js | badge 📕 n ; encadré « Ton erreur du … » ; trois erreurs sur la version imprimée |
| Chapitre en classe `state.now.ids` | app.js | fiche proposée par défaut dans Progrès |
| Test `state.prep.ids`, `date` | app.js | fiche limitée aux notions du test ; bord rouge = à revoir avant le test |
| Autoévaluation `state.autotest` (Avant, test rapide, Après) | qcm.js | ✓ ~ ✗ partagés : cocher dans la fiche remplit la colonne Avant, et inversement |

Règles de tri proposées (simples, explicables à l'élève) :
- **à revoir** : notion du test (ou du chapitre) avec `m < 0,5`, ou au moins une entrée dans le carnet, ou « ✗ » au test rapide ;
- **en progrès** : `0,5 ≤ m < 0,75` ; **acquis** : `m ≥ 0,75` et rien au carnet (repliés : une ligne avec la note) ;
- **pas encore vu** : `status` « avenir » ou « nonvu » (gris, jamais compté comme lacune).

Synthèse **à compléter** plutôt que toute faite : oui, par défaut (« Je me teste »), avec « Je relis » à un geste.
Les acquis restent repliés : ne pas faire relire ce qui est su (et la fiche tient sur deux écrans).

## 3. Emplacement, impression, génération

**Emplacement** (règle de l'accueil à 6 cases respectée) :
- **Mon test** → dans « En plus, quand tu veux » (`prepPanel`, à côté d'Autoévaluation et Sujet de préparation) :
  « 🗺 Ma fiche », limitée à `state.prep.ids`. Option : en faire l'étape « veille du test » du programme (`PREP_TASK`).
- **Progrès** → une ligne « 🗺 Fiche » par chapitre dans l'écran des compétences (`screenComps`), qui regroupe déjà par thème.
- **Fin de chapitre** : quand l'élève répond « J'ai changé de chapitre » (`screenNow`), un toast « Ta fiche de
  Calcul littéral est prête (Progrès) ». Pas de carte en plus, pas en fin de leçon (la séance doit rester à 5 min).

**Impression / export** :
- `@media print` + `window.print()` : A4 paysage, 3 colonnes, titres colorés comme `synthese.typ` (palette summy),
  marge haute de perforation. MathJax sort en SVG, donc s'imprime net. Sur Android Chrome : « Partager › Imprimer ›
  Enregistrer en PDF ». Aucun serveur, aucune bibliothèque.
- Deux versions : **à compléter** (trous en lignes) et **complète** (corrigé), plus les encadrés personnels (carnet, Avant).
- Image à partager (PNG) : plus tard. Rasteriser des formules MathJax en canvas est fragile ; le PDF suffit pour coller dans le cahier.

**Génération automatique : ce qui existe**
- Chapitres et notions : `ORDRE_THEME` / `THEME_LABEL` (ordre.js) — ex. `11C05` = litelab, valnum, reduire, distrib,
  parenth, idrem, factor. Existe aussi pour la matu et la MP.
- Contenu : `LESSONS` / `LESSONS_V2` / leçons actives (titre, idée, règle, exemples, piège) ; `COMPS` (libellés « Je sais… ») ;
  pièges des générateurs (`q.traps`) ; liens de prérequis `PREREQ` (engine.js).

**Données qui manquent**
1. **Trous** : marquer dans chaque règle 1 à 3 segments à cacher, par ex. `[[2ab]]`. Le faire à la main (≈ 7 notions ×
   12 chapitres en 11e) : un trou automatique (cacher un bout de TeX au hasard) cacherait souvent l'inessentiel.
2. **« L'essentiel en 3 lignes »** par chapitre : 12 textes pour la 11e, à écrire et faire valider.
3. **Liens de la carte** : `PREREQ` donne « vient avant », pas « contraire de », « cas particulier de », « lues à
   l'envers ». Petite table par chapitre (`CARTES = { "11C05": { pos: {...}, liens: [[a, b, "contraires"], …] } }`),
   positions sur une grille 2 colonnes : pas d'algorithme de placement.
4. **Message de l'erreur** : le carnet garde id, niveau, code de la question, mais pas le piège diagnostiqué
   (`diagnose` dans expr.js renvoie le message de `q.traps` au moment de la réponse). Ajouter `m` (message) et la réponse
   donnée à l'entrée du carnet : quelques lignes dans `carnetAdd`. Sans cela, l'encadré dit seulement « 2 erreurs dans ton carnet ».
5. **Formes courtes** pour la carte : un intitulé de 2 mots et un exemple de 20 caractères par notion (à tirer des
   exemples existants, à relire).

## 4. Coût et plan par étapes

| Étape | Contenu | Données nouvelles | Code | Relecture enseignant |
|---|---|---|---|---|
| **1. Fiche « Je relis » + impression** | règles, exemples, piège générique, « Je sais… » avec notes, tri personnel ; A4 3 colonnes | aucune | ≈ 1 jour (écran + CSS print) | 30 min (1 chapitre test) |
| **2. Mode « Je me teste »** | trous révélables, ✓ ~ ✗ partagés avec l'autoévaluation, version imprimée à compléter | trous `[[…]]` pour la 11e | ≈ ½ jour | ≈ 2 h (trous des 12 chapitres) |
| **3. Mon erreur** | encadré « Ton erreur du … » et question « Explique en une phrase » | champ `m` dans le carnet | ≈ ½ jour | — |
| **4. Carte du chapitre** | SVG couleur maîtrise, cases cliquables, « L'essentiel » | `CARTES` + 12 « essentiels » (11e) | ≈ 1 jour | ≈ 2 h |
| **5. Je refais la carte** | cases mélangées à replacer, comparaison | aucune | ≈ 1 jour | — |
| 6. Extension | 1re Collège, puis MP2, 10e, 9e | idem par niveau | — | idem |

Ordre conseillé : 1 → 2 → 3 sur **Calcul littéral et Proportionnalité (11e)**, tester avec la 11LS avant un test,
puis 4 → 5 si les élèves l'utilisent (mesure : ouvertures de la fiche, trous révélés, impressions ; signal élève, pas
relecture exhaustive, cf. principe du 20.11).

## Décisions à prendre par l'enseignant

1. **Nom** : « Ma fiche », « Ma synthèse », « Mon résumé » ?
2. **Mode par défaut** : « Je me teste » (recommandé) ou « Je relis » ?
3. **Emplacement** : Mon test + Progrès (recommandé) ; faut-il aussi en faire l'étape « veille du test » du programme ?
4. **Impression** : A4 paysage 3 colonnes comme les fiches papier (recommandé) ou A4 portrait 1 colonne ? Erreurs
   personnelles imprimées ou non (la feuille peut être vue par d'autres) ?
5. **Carte** : la faire (étape 4) ou s'en tenir à la fiche ? Qui écrit les liens et « L'essentiel » (proposition par
   Claude, validation par l'enseignant) ?
6. **Périmètre de départ** : 11e Calcul littéral + Proportionnalité, puis toute la 11e, puis 1re Collège ?
