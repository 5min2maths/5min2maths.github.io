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
- **Audit des figures** (demande du 28.11, `/contenu figures`) : relever toutes les questions de géométrie, de mesures ou de problème qui n'ont pas
  de figure (par fréquence, 9e–11e et 1re Collège d'abord), puis ajouter des figures (SVG maison, lisibles à 360 px, cotes
  justes, jamais la réponse). À lancer dès qu'un agent Pépite² a fini (2 agents au plus).

## À faire

1. Commentaires des testeurs restants : l'icône de pépite en grand au lancement, avec « Deviens une pépite en maths » en dessous
   et dans un cercle, pas dans un carré bleu (2 commentaires du 27–28.11) ; « Je prépare une évaluation » : une liste à cocher,
   est-ce le bon choix ? Les traiter après la fusion de Pépite² écrans.
2. Revue quotidienne du 28.11, n° 2 (France) : `rel` en 4e porte le titre « multiplier, diviser, priorités », mais le
   positionnement y pose une addition (température) ; il faut retirer cette variante de la notion en France (elle relève de reladd).
3. Robot : 68 réponses exactes non vérifiées (onglet Robot du suivi).
4. `ref_formes.js` (décision n° 22 du 26.11, faite en partie) : il reste les tables de formes pour Collège 2e–4e, France
   6e–5e et lycée, et les notions sans étiquette ctx (`diagr`, `airelat`, `agrand`, `premiers`, `prop`, `symetries`,
   `rotation`, `optim` n. 1, `eqverif`).
5. Présentation PDF : faire une version Suisse romande seule (retour du 26.11) ; c'est peut-être fait par l'agent présentations, à vérifier.

## Décisions de l'enseignant

- **28.11 : pépites = seul score à poursuivre** (commentaire « deux monnaies, l'élève ne sait plus laquelle poursuivre »).
  Le Mathélo devient un indicateur de niveau : retiré de l'accueil, de l'en-tête et du bilan ; visible seulement dans
  « Mon trésor », dans une carte « Mon niveau » (jauge, palier en mots, nombre en petit, évolution sur plusieurs semaines).
  Le moteur n'est pas modifié. En cours sur la branche `agent/pepite-ecrans`.

### Avant le 28.11

Toutes les décisions des 26 et 27.11 sont prises et appliquées : `archive/decisions_26-11.md` (19 points) et
`archive/a_decider_26-11.md` (33 points, avec les décisions du 27.11). Rien n'est en attente.
Décisions durables : PEE 2026 pour toutes les années MP ; automatismes de fin de primaire pour les 9e en grande difficulté ;
consolidation jusqu'à fin 2026 (pas de diffusion large) ; page légale plus tard ; l'adresse ne change pas avant le
déménagement.

## Fait le 28.11 (à publier)

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
