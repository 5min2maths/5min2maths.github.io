# Pépite² (ex-5min2maths) — où on en est

Fichier d'état unique (journée ménage du 28.11). **On le met à jour au lieu de créer un rapport daté.**
Les rapports datés des agents vont dans `tools/archive/`, et l'essentiel en est reporté ici.
La vision à long terme reste dans `ROADMAP.md` (local, hors dépôt).

Dernière mise à jour : 28.11.2026

## Agents (structure du 28.11)

Trois commandes seulement, chacune avec son worktree permanent `../5min2maths-wt/<rôle>` (branche `agent/<rôle>`) :
**/contenu** (modes : niveau <classe>, figures, vraisemblance / variété, faibles), **/app** (écrans, univers Pépite²,
présentations / PDF, commentaires d'interface), **/entretien** (tests, ménage, poids / chargement, routines).
2 agents au plus en même temps. Routines cron : robot 3 h 30, tests de nuit 5 h, miroir Dropbox 6 h 10, revue élèves
Claude 6 h 40, gardien Chromium toutes les 5 min (tableau dans la commande /entretien).

## En cours

- **Univers Pépite²** : accueil fait (27.11, `pepite_accueil.md`) ; écrans et présentations / PDF en cours (agents du
  28.11, branches `agent/pepite-ecrans` et `agent/pepite-presentations`) ; captures à montrer avant publication.
- **Ménage** (28.11) : rapports archivés ✓, ce fichier ✓ ; reste à regrouper les tests par thème (180 pages → 80–100, `/entretien tests`) après la
  fusion des branches Pépite² (pour éviter les conflits).
- **Audit des figures** (demande du 28.11, `/contenu figures`, rapport `archive/contenu_figures_28-11.md`) : 105 formes
  reçoivent une figure dans 17 notions (11e : airepyr, volmanq, volcomp, volcone, thales, thalesrec, cercthales, angles,
  pythrec, probeq2 ; 1re : euclide, exactes, geocomb, droitesrem, trigo, trigexact ; 9e : volpave), branche
  `agent/contenu`, à fusionner après contrôle des captures (`tests/_shots/contenu/figures/`). Reste (par fréquence) :
  repère de pythrec 2, rectangles cotés (sysprob, sys2, ineq2, ratden), simil, cylindre donné par son diamètre
  (airelat, volmanq 4), disque / secteur (10e), voldecomp ; puis 2e–4e Collège et MP. À décider : figures qui feraient
  la mise en équation (eq2 4, idrem 4) ou trancheraient la question (pythrec 1–2, paraboles).
- **Élagage des figures superficielles** (demande du 28.11, `/contenu figures`, rapport `archive/contenu_elagage_28-11.md`,
  branche `agent/contenu2`, à fusionner après contrôle des captures `tests/_shots/contenu/elagage/`) : 57 couples
  notion × niveau × figure retirés (128 sites) — balances, objets alignés, barres de %, trajets, « ×k », bâtons et urnes
  qui répètent l'énoncé, paraboles / hyperboles / tangentes / sinus qui donnaient la réponse, mise en équation
  (probeq2), cercle trigo sur des conversions ; fonctions `balance`, `items`, `blocks`, `sciScale`, `road`, `barChart`
  supprimées. Décisions de l'enseignant sur les 11 cas (28.11, appliquées) : retirés aussi la droite graduée de
  « Calcule (−1) + 7 », le pavé de solides 1 (compter les faces), les arbres de denombr 1 (énoncés sans renvoi à
  l'arbre ; pas à pas réécrit), polyreg 2 (`FIG.polyTri` supprimé), fref « x² ≤ 9 » ; gardés : carré aire → côté,
  cercle trigo des valeurs exactes, tableau de signes, repère de sys3, plongeuse, figures des leçons.

- **Grand problème de la semaine** (décision du 28.11, `/contenu`, rapport `archive/contenu_probleme_28-11.md`, branche
  `agent/contenu3`, à fusionner) : le problème est un code fixe tiré parmi les **grands** (≥ 4 parties, en situation,
  au programme : `Engine.probKind`) ; repli explicite `weeklyPick.g` : chapitre en classe (grand → riche 3 p. → court),
  puis reste de l'année (idem), puis reprises (grand → court) ; jamais deux fois le même problème (forme déjà donnée = autres
  nombres). Élève faible : même problème + aide (`Engine.weeklyAid` : plan, « Coup de pouce » par partie, 4 essais) ;
  simulation : parties justes 73–80 % (avant 58–62 %), mais 18–21 min (avant 12). 4 grands problèmes de 11e ajoutés
  (silo, piscine, bonbons, taxi). **Inventaire : aucune classe n'a 35 grands problèmes de l'année** (11e 15, 1re
  Collège 11, MP 1re 22, 2e Collège 33 ; MP 3e–4e 0, 4e Collège / 1re FR / Tle 1, 3e Collège 2) : contenu à écrire.
  **API « Creuser encore » pour `/app mine`** : `Engine.digOpen(state)`, `Engine.digMore(state, n)` →
  `[{ code, id, kind: "semaine"|"chapitre", week?, done?, label, parts, minutes }]`, `Engine.digQuestion(state, code)`,
  `Engine.digNote(state, code)` ; pépites ordinaires, jamais `YP.weekly` ; historique `state.weeklyHist` (sauvegarde :
  champ `wh`). `src/app.js` : séance weekly = `Engine.weeklyQuestion`, `renderProblem` affiche `q.aid` et respecte
  `q.maxTries` (styles `.aid`, `.aid-plan` à faire par /app ; « Refaire » après le problème de la semaine à revoir).
  Nouvelle page de thème `tests/probleme_semaine.html` (à intégrer au regroupement de `/entretien tests`).
  À décider : 4 ou 3 essais pour les faibles (durée) ; chapitre en classe sans grand → riche du chapitre
  (choix actuel) ou grand d'un autre chapitre ; ordre d'écriture des grands problèmes manquants.

## À faire

Ordre (28.11, 2 agents au plus ; en cours : `/entretien tests`, `/contenu` élagage des figures superficielles) :
puis `/app animations` (grand problème de la semaine : moteur fait, branche `agent/contenu3`) ; puis `/app mine` (API digMore) ; puis deux dépôts GitHub
(+ domaine pepite-carre.ch, avant l'ouverture à la 11LS).
- **`/entretien` vitesse des tests** (après le regroupement, mesurer d'abord) : un seul navigateur qui enchaîne les pages
  (au lieu d'un Chromium par page, 1–3 s perdues chacune) ; puis 2 pages en parallèle quand aucun agent ne tourne (PC :
  2 navigateurs au plus) ; tirages réduits le jour, complets la nuit. Cible : suite rapide 1–2 min avant publication
  (la suite complète tourne la nuit, sa durée gêne peu).
- **`/app animations`** (validé 28.11, n° 1 à 5) : bonne réponse → petite pépite qui s'envole vers le compteur (« +2 ») ;
  bilan → nombre de pépites qui défile ; pépite polie → éclat doré sur la carte ; filon qui augmente → flamme qui grossit ;
  barre de séance qui se remplit en glissant. Règles : < 0,5 s, un retour (pas un décor), jamais d'attente, rien si
  mouvement réduit. Pas de tremblement sur une erreur (vécu comme une sanction). GIF de chaque avant publication.

0. **GitHub : deux dépôts** (décision du 28.11, APRÈS la fusion des branches Pépite²) : dépôt privé `5min2maths-dev`
   (tout : sources, tests, tools, historique complet) ; dépôt public `5min2maths.github.io` réduit à l'app publiée
   (`docs/`), historique neuf (les rapports, qui citent les écoles et classes, ne doivent plus être lisibles) ;
   `tools/publier.sh` pousse les sources au privé et docs/ au public ; adresse inchangée. Vérifier le dépôt privé complet
   AVANT de réécrire le public (opération irréversible). Retirer les `__pycache__` suivis.

1. Commentaires des testeurs restants : l'icône de pépite en grand au lancement, avec « Deviens une pépite en maths » en dessous
   et dans un cercle, pas dans un carré bleu (2 commentaires du 27–28.11) ; « Je prépare une évaluation » : une liste à cocher,
   est-ce le bon choix ? Les traiter après la fusion de Pépite² écrans.
2. Revue quotidienne du 28.11, n° 2 (France) : `rel` en 4e porte le titre « multiplier, diviser, priorités », mais le
   positionnement y pose une addition (température) ; il faut retirer cette variante de la notion en France (elle relève de reladd).
3. Robot : 68 réponses exactes non vérifiées (onglet Robot du suivi).
4. `ref_formes.js` (décision n° 22 du 26.11, faite en partie) : il reste les tables de formes pour Collège 2e–4e, France
   6e–5e et lycée, et les notions sans étiquette ctx (`diagr`, `airelat`, `agrand`, `premiers`, `prop`, `symetries`,
   `rotation`, `optim` n. 1, `eqverif`).
5. `tools/run_tests.sh` : « verrou des tests occupé … série annulée » sort avec le code 0 → un commit enchaîné passe sans
   test (28.11). Le verrou occupé doit être un échec (code ≠ 0). (`/entretien`)
6. `tools/publier.sh` : il teste l'arbre de travail puis fait `git add -A src …` À LA FIN → des modifications faites pendant
   les tests partent sans avoir été testées (28.11, écran d'ouverture publié avant son recadrage). Figer l'état (commit ou
   copie) AVANT les tests. (`/entretien`)

## Décisions de l'enseignant

- **28.11 : figures** — lot de /contenu figures validé (105 formes, 17 notions). Pas de figure là où elle ferait le travail
  de l'élève (mise en équation eq2 4 / idrem 4, réciproque de Pythagore pythrec 1–2, paraboles) : « parfois c'est à l'élève de la faire » ; piste : indice ou étape « Fais un croquis à main levée ».
  Diagonales du cube : d (face) rouge, D (cube) verte en pointillés. Petits chevauchements à reprendre : « r = 3 » du cube
  percé et de la glace (volcomp).

- **28.11 : pépites = seul score à poursuivre** (commentaire « deux monnaies, l'élève ne sait plus laquelle poursuivre »).
  Le Mathélo devient un indicateur de niveau : retiré de l'accueil, de l'en-tête et du bilan ; visible seulement dans
  « Mon trésor », dans une carte « Mon niveau » (jauge, palier en mots, nombre en petit, évolution sur plusieurs semaines).
  Le moteur n'est pas modifié. En cours sur la branche `agent/pepite-ecrans`.

- **28.11 : grand problème de la semaine** (« pas toujours si grand, un seul = rubrique faiblarde ») : (1) tiré seulement
  parmi les problèmes riches (≥ 4 parties, vrai contexte, figure si utile, 10–15 min, niveau évaluation) ; élève faible :
  même problème avec plus d'aide (pas à pas, indices) plutôt que raccourci (remplace pour ce problème la n° 24 du 26.11) ;
  (2) « Creuser encore » dans la mine une fois le problème fait : problèmes des semaines passées et autres problèmes des
  chapitres récents, pépites normales (plafond du jour), bonus +30 seulement pour celui de la semaine ; facultatif, hors
  séance. À faire : `/contenu` (sélection) puis `/app` (écran de la mine), après la fusion des branches Pépite².

- **28.11 : adresse** — passer de 5min2maths à pepiteaucarre : pas urgent, on attend. Plan retenu quand ce sera le moment :
  un seul déménagement, directement vers le domaine `pepiteaucarre.ch` (branché d'abord sur GitHub Pages, puis hébergement
  suisse sans changer d'adresse), avec une page de transfert de la progression (stockage lié à l'adresse : sinon les
  testeurs repartent de zéro). Jamais par `pepiteaucarre.github.io` (deux déménagements).
  Précision de l'enseignant : pas encore d'élèves (seulement ses appareils et quelques testeurs) → pas de page de transfert
  nécessaire SI c'est fait AVANT l'ouverture à la 11LS (échéance), avec la séparation en deux dépôts ; l'enseignant réserve
  `pepiteaucarre.ch` (recommandé) ou on passe par github.io.
  Infomaniak (vérifié le 28.11) : domaine seul suffit (1 adresse mail gratuite incluse, alias et redirections illimités) ;
  « Domain Plus » inutile. Hébergement : GitHub Pages d'abord (domaine branché), hébergement suisse plus tard sans
  changer d'adresse. Priorité « données en Suisse » le jour des écoles : statistiques et commentaires (Google Apps Script)
  avant l'hébergement de l'app (la progression reste sur l'appareil).

### Avant le 28.11

Toutes les décisions des 26 et 27.11 sont prises et appliquées : `archive/decisions_26-11.md` (19 points) et
`archive/a_decider_26-11.md` (33 points, avec les décisions du 27.11). Rien n'est en attente.
Décisions durables : PEE 2026 pour toutes les années MP ; automatismes de fin de primaire pour les 9e en grande difficulté ;
consolidation jusqu'à fin 2026 (pas de diffusion large) ; page légale plus tard ; l'adresse ne change pas avant le
déménagement.

## Fait le 28.11 (à publier)

- Présentations (`/app présentations`, branche `agent/app`, `archive/app_presentations_28-11.md`) : #decouvrir, #parents,
  #enseignants alignés sur « pépites = seul score, niveau en mots dans Mon trésor » ; PDF complet (36 p.) et suisse
  (33 p., version Suisse romande seule faite) : captures de l'app actuelle, page « Pépites et niveau », bonus +30.
- Commentaires : figures pour polyreg 2 (somme des angles, découpage en triangles) et racprop 4 (cube : diagonales d et D) ;
  la batte et la balle à des prix réalistes ; la douche « débite … litres d'eau par minute » ; problème de la semaine
  +10 → +30 pépites (règle affichée dans Mes progrès) ; formules de « Les bases : … » composées dans « Je prépare une évaluation ».
- Revue quotidienne : maquette (citerne, aquarium, cuve à vin, à 1 : 20 ou 1 : 50, grandeurs réalistes) ; indice `rel` complété
  (produit et quotient).
- Robot : valeurs triviales exclues (morceaux 1, nbderive 2, trigfn 2) ; volcone 2 : pièges « c'est le rayon / la hauteur ».

## Où trouver quoi (`tools/`)

- **Niveau par classe** (priorité absolue) : `niveau_910.md`, `niveau_11.md`, `niveau_1c.md`, `niveau_2c.md`, `niveau_34c.md`,
  `niveau_mp12.md`, `niveau_mp34.md`, `chantier_11e.md`, `evacom.md`, `programme_3e_4e_college.md`.
- **France et autres systèmes** : `france.md`, `france_couverture.md`, `couverture_fr.md`, `seconde_fr.md`,
  `premiere_terminale_fr.md`, `referentiels_belgique.md`, `referentiels_luxembourg.md`, `referentiels_quebec.md`.
- **MP** : `couverture.md`, `ref_mp.md`.
- **Primaire** : `primaire.md`, `primaire_9e.md`.
- **Qualité du contenu** : `pieges.md`, `defis.md`, `retiens.md`, `trouve_erreur.md`, `calculatrice.md`, `manipulation.md`,
  `plan_pas_a_pas.md` (généré).
- **Garde-fous et tests** : `tests.md` (deux niveaux : rapide avant publication, complet la nuit), `recalcul.md`, `corrige_valeur.md`.
- **Écrans et technique** : `ecrans.md`, `ergonomie.md`, `chargement.md`, `poids.md`, `stockage.md`.
- **Nom et univers** : `nom_app.md`, `pepite.md`, `pepite_accueil.md`.
- **Propositions en réserve** : `parents.md`, `syntheses.md`, `confidentialite.md`.
- **Suivi quotidien** : `suivi/revues/AAAA-MM-JJ.md` (élèves Claude), `suivi/robot/resume.txt`, `suivi/tests_nuit/dernier.txt`,
  `commentaires_traites.txt`.
