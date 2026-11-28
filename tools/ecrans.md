# Affichages téléphone / tablette / ordinateur (27.11, agent écrans)

Décision de l'enseignant du 25.11 : plusieurs affichages choisis automatiquement, avec un choix dans les Réglages ;
ordinateur d'abord. Seulement de la mise en page : aucune fonction nouvelle, téléphone inchangé.

## Fonctionnement

- `ecranApply()` (src/app.js) pose une classe sur `<html>` : `ecran-tel` (aucune règle CSS), `ecran-tablette`,
  `ecran-ordi`, plus `ecran-2col` quand la place permet deux colonnes. Recalculée au redimensionnement.
- Automatique (`ecranAuto(largeur, tactile)`) : tactile (`pointer: coarse`) dès 700 px = tablette ; souris dès 1024 px =
  ordinateur ; sinon téléphone (une fenêtre étroite sur ordinateur garde la colonne habituelle ; les pages de test à
  800 px restent en téléphone).
- Deux colonnes : ordinateur ≥ 900 px, tablette en paysage ≥ 1000 px.
- Réglages › Affichage › « Mise en page (cet appareil) » : Automatique / Téléphone / Tablette / Ordinateur, gardé dans
  `m2m-ui` (`UI.ecran`, propre à l'appareil). Choix montré dès 700 px (ou s'il a été changé) : l'écran Réglages d'un
  téléphone reste identique.
- CSS : bloc « affichages tablette et ordinateur » à la fin de src/style.css.

## Mise en page

- Ordinateur : texte 18 px ; colonne de lecture ≤ 720 px (leçons, Réglages…) ; écrans à deux colonnes jusqu'à 1120 px.
  - Question et problème : énoncé et figure à gauche (collés en haut, figure jusqu'à 480 px), à droite brouillon,
    rappel de cours, réponse, pavé (gardé, plus compact ; clavier physique et Entrée = Vérifier comme avant) et barre
    d'action sous la réponse (plus collée au bord de l'écran ; dans un problème long elle reste visible en bas de la
    colonne). Fait par `ecranSplit()` dans `h()`, seulement en deux colonnes. Le rappel d'énoncé fixe (problème) est
    masqué : l'énoncé reste à gauche.
  - Énoncé (colonne de gauche) : défilement seulement s'il dépasse la hauteur de l'écran (classe `q-long`, posée par
    `ecranSplit()`), sinon aucune barre parasite. Après la vérification, la barre (« Continuer »…) passe sous le retour
    (`ecranBarApres()`).
  - Histoire : le récit à gauche, « À toi » à droite (réponse et « Vérifier » visibles sans défiler).
  - Pavé compact (touches de 42 px) partout sur ordinateur (question, pas à pas, Histoire, Curieux…), jamais sur tablette.
  - Écran bas (≤ 800 px, 1024 × 768) : marges verticales réduites ; place de la barre de défilement réservée
    (`scrollbar-gutter: stable`) ; aucun texte sous 12 px sur ordinateur et tablette.
  - Accueil : séance à gauche, les 6 cases à droite, plus grandes.
  - Bilan, Mes compétences (`ecranCols()`) : cartes sur deux colonnes ; Progrès : la carte de progression seule à
    droite, les autres cartes à gauche.
- Tablette : colonne de 720 px, texte 18 px, cartes plus aérées, figures 460 px, pavé plus grand (touches ≥ 52 px),
  boutons ≥ 44 px (aussi Oui / Non des statistiques ; cases de la carte de progression de 32 px avec une zone de
  toucher de 44 px) ; en paysage, mêmes deux colonnes que l'ordinateur, pavé non compacté (touches ≥ 52 px).

## Vérifications

- `tests/ecrans.html` (dans la suite) : cadres 1440×900, 1280×800, 1024×768, 820×1180 et 1180×820 (tablette par le
  réglage, Chromium sans interface n'a pas d'écran tactile), 360×640, plus 1440×900 forcé en téléphone et 1280×800 forcé
  en tablette ; 9 écrans (accueil, question avec figure, question avec pavé, problème, leçon active, bilan, Progrès,
  Mes compétences, Réglages) : pas de débordement horizontal, classe d'écran, réponse et « Vérifier » visibles sans
  défiler sur ordinateur, barre dans la colonne de réponse, choix des Réglages appliqué et gardé, détection
  automatique (12 cas), et à 360 px mise en page identique au pixel près à la même page sans classe d'écran.
  Depuis le 27.11 soir (revue `tools/archive/revue_ecrans_chargement_27-11.md`) : pas de barre de défilement dans l'énoncé
  quand il tient, 1024 × 768 sans défilement, touches ≥ 52 px sur tablette (question et pas à pas), aucun texte sous
  12 px, Histoire « À toi » visible, barre sous le retour après une erreur, « Vérifier l'étape » visible, carte de
  progression à droite, cases de la carte ≥ 44 px (tablette), `scrollbar-gutter` (ordinateur).
- 360 px avant / après : signatures de mise en page (position et taille de chaque élément, tirages et date fixes)
  identiques à celles de master 2618068 pour les 9 écrans ; captures 360×640 identiques au pixel près (la capture du
  problème varie d'une prise à l'autre de quelques pixels de défilement, minuterie du focus, aussi sur master).
- Captures : `tools/ecrans_captures.sh [dossier] [écran…]` (variable TAILLES pour restreindre).
  - après : `tests/_shots/ecrans/<L>x<H>_<écran>.png` (6 tailles × 9 écrans) ;
  - avant (master) : `tests/_shots/avant/<L>x<H>_<écran>.png`.

## Limites

- Leçon active, Réglages, écrans de texte : une colonne de 720 px (pas de deuxième colonne utile).
- Bilan et Mes compétences en colonnes CSS : l'ordre de lecture va de haut en bas dans la colonne de gauche, puis à droite.
- Détection tactile : un ordinateur portable tactile avec souris est vu comme ordinateur (`pointer: fine`) ; le réglage
  permet de choisir.
