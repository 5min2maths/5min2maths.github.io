# Revue du 27.11 (agent eleves8) : chargement par segments et affichage ordinateur / tablette, version publiée

**8 problèmes, dont 0 grave** (3 moyens, 5 mineurs). Chargement : aucun problème trouvé.

Tout a été testé sur `docs/` (master d61476c, version abe8841079) servi en local, dans un vrai Chromium (une instance à la fois).
Outils hors suite : `tests/_charge_publiee.py` (chargement, https local pour le service worker) et
`tests/_ecrans_publiee.py` (captures et mesures) ; `tests/_trace.html` a reçu `garde=1` (robot d'élève injecté dans
la version publiée). Captures : `tests/_shots/charge/`, `tests/_shots/pub/` (16 écrans × 6 tailles),
`tests/_shots/pub_retour/` (retour après réponse, pas à pas), `tests/_shots/pub_avant/` (téléphone avant les affichages).

## Chargement (tout « ok »)

- Premier lancement : écran d'entrée en 1,2 s avec le seul code commun (8 segments).
- Choix de la classe : **un seul** rechargement, puis positionnement, puis accueil sans autre rechargement (11e, MP 2e,
  4e France) ; segments exécutés = ceux de la classe (`C['11']`, `C['13mp']`, `C['FR']`).
- **Séance complète** dans la version publiée pour la 11e, la MP 2e et la 4e France (positionnement, puis séance jusqu'au
  bilan ; robot de `_trace.html`) : pas de page blanche, pas d'erreur JS, pas de « Pas de connexion ».
- Retour après fermeture : accueil, segments de la classe, un seul chargement ; paquet x chargé après l'accueil.
- Changement de classe (Réglages, 11e → 2e Collège) : un rechargement, code de la 2e, positionnement.
- `#decouvrir`, `#parents`, `#enseignants`, `#q-…` : tout le code, un chargement ; adresse changée dans l'app ouverte :
  un rechargement ; réouverture ensuite : de nouveau le code de la classe.
- Hors ligne (service worker enregistré par l'app en https) : 36/36 segments en cache ; réouverture (0,8 s), séance
  complète, changement de classe 11e → MP 2e, `#parents` et `#q-…` : tout fonctionne, aucun « Pas de connexion ».
- « Nouvelle version prête » : rien pendant une question, ligne à l'accueil, « Recharger » → nouvelle version, un seul
  rechargement, pas de boucle.
- Passage depuis les anciennes versions installées (784821d d'hier soir, bce1327 de ce matin) : 1re ouverture après la
  publication = nouvelle version (3,8–4,4 s en local, installation du nouveau service worker en parallèle), ancien cache
  supprimé, 2e ouverture et hors ligne ok.

## Téléphone (360×640)

Inchangé : 13 écrans sur 16 identiques au pixel près à la version d'avant les affichages (fdcf6cf^1) ; les 3 autres
(accueil, problème, leçon active étape 2) ne diffèrent que de 1 à 10 px de défilement (minuterie du focus, déjà connue).

## Problèmes

1. **Moyen** · question avec pavé, problème · ordinateur (1440, 1280, 1024) et tablette paysage (1180×820).
   Petite barre de défilement parasite à droite de l'énoncé : `.q-l` (overflow-y auto) dépasse de 3 px à cause de la
   formule MathJax. Visible sous Windows / Linux (barres classiques). Captures : `tests/_shots/pub/1440x900_pave.png`,
   `tests/_shots/pub/1024x768_probleme.png`, `tests/_shots/pub/1180x820_pave.png`.
   Correction : `padding-bottom: 6px` sur `.ecran-2col .q-l`, ou n'activer `overflow-y: auto` que si le contenu dépasse
   vraiment la hauteur maximale (classe posée par `ecranSplit()`).

2. **Moyen** · Histoire, « À toi » · ordinateur (toutes tailles) et tablette paysage.
   Écran en une colonne, pavé grand format (touches de 55 px, 340×258) sous un vide de 70 px : « Vérifier » à 1'096 px,
   il faut défiler pour répondre, même à 1440×900. Captures : `tests/_shots/pub/1440x900_histoire.png`,
   `tests/_shots/pub/1024x768_histoire.png`, `tests/_shots/pub/1180x820_histoire.png`.
   Correction : appliquer le pavé compact de l'ordinateur à tous les `.keypad` (pas seulement dans les questions), ou
   le masquer sur ordinateur tant que le clavier physique est utilisé.

3. **Moyen** · retour après une erreur et pas à pas (« On le fait ensemble ») · ordinateur et tablette paysage.
   Dans la colonne de droite, la barre (« Une plus facile pour repartir » / « Continuer ») reste entre la réponse et le
   retour : l'élève voit « Continuer » avant « Pas cette fois ». Dans le pas à pas, pavé grand format et « Vérifier
   l'étape » sous le bord à 1024×768 (828 px) et 1180×820 (849 px). Captures : `tests/_shots/pub_retour/1440x900_figure_retour.png`,
   `tests/_shots/pub_retour/1024x768_guide.png`, `tests/_shots/pub_retour/1180x820_guide.png`.
   Correction : après la vérification, placer la barre sous `#fb` (ou le retour dans la colonne de gauche) et utiliser
   le pavé compact dans le pas à pas.

4. **Mineur** · question avec figure / avec pavé · 1024×768.
   La page fait 787 px : barre de défilement de la page et 19 px à défiler à chaque question. Capture :
   `tests/_shots/pub/1024x768_pave.png`.
   Correction : réduire les marges verticales (en-tête, carte) quand la hauteur est ≤ 800 px.

5. **Mineur** · Progrès · ordinateur et tablette paysage.
   Colonnes déséquilibrées : à gauche Ma semaine, Mes grades et la carte de progression (≈ 1'000 px), à droite deux
   cartes courtes (≈ 560 px). Capture : `tests/_shots/pub/1440x900_progres.png`.
   Correction : mettre « Ma carte de progression » dans la colonne de droite (ou sur toute la largeur en dessous).

6. **Mineur** · accueil, pavé · ordinateur et tablette.
   Textes très petits à côté d'un texte de base de 18 px : « POINTS DE L'ANNÉE » 10 px, « Apprenti dans 150 pts » 11 px,
   « fraction » / « clavier » sous les touches 10 px. Capture : `tests/_shots/pub/1440x900_accueil.png`.
   Correction : 12 px au moins dans `.ecran-ordi` et `.ecran-tablette`.

7. **Mineur** · pavé · tablette paysage (1180×820).
   Les deux colonnes reprennent le pavé compact de l'ordinateur : touches de 43 px, alors que la tablette promet
   ≥ 52 px (portrait : 55 px). Capture : `tests/_shots/pub/1180x820_pave.png`.
   Correction : ne compacter le pavé que dans `.ecran-ordi`, pas dans `.ecran-tablette.ecran-2col`.

8. **Mineur** · accueil, Progrès · tablette (820×1180) ; en-tête · ordinateur.
   Cibles tactiles sous 44 px : « Oui » / « Non » des statistiques (36 px), cases de la carte de progression (18 px).
   Sur ordinateur, l'en-tête se décale de 7 px entre un écran court et un écran qui défile (barre de défilement).
   Captures : `tests/_shots/pub/820x1180_accueil.png`, `tests/_shots/pub/820x1180_progres.png`,
   `tests/_shots/pub/1440x900_competences.png`.
   Correction : `min-height: 44px` sur ces boutons en tablette ; `scrollbar-gutter: stable` sur `html` hors téléphone.

## Vu et correct

Accueil (séance à gauche, 6 cases à droite), question avec figure (figure 480 px, réponse et « Vérifier » visibles sans
défiler à 1440, 1280, 1024 et 1180), problème (énoncé collé à gauche, barre en bas de la colonne de droite), leçon active,
bilan, Mes compétences, Réglages (option « Mise en page », 4 choix, gardée), Curieux, Carnet, « Je prépare une
évaluation » (bouton collé en bas) : aucun débordement horizontal à aucune taille ; tablette portrait en une colonne de
720 px, barre d'action en bas comme sur le téléphone.
