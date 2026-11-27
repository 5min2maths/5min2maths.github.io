# Pépite² : nouveau nom, logo, univers (27.11, agent pepite)

Décision de l'enseignant (27.11) : l'app s'appelle **Pépite²** (« Pépite au carré »), slogan **« Deviens une pépite en
maths »**. Mathélo (cote de niveau), grades Pousse → Légende et « Problème de la semaine » ne changent pas. L'adresse de
l'app, les clés de stockage `m2m-*` et l'identifiant d'appareil ne changent pas : aucun testeur ne perd sa progression.

## 1. Nom et slogan

- `src/curriculum.js` : `APP_NAME = APP_SHORT = "Pépite²"`, `APP_TAGLINE = "Deviens une pépite en maths"`,
  `APP_TITLE = "Pépite² · Deviens une pépite en maths"` (onglet), `APP_TAGLINE_HTML` (slogan avec « pépite » surligné).
- En-tête (`brand`) : logo + « Pépite² » ; slogan à côté au-dessus de 430 px (caché en dessous : l'en-tête tient à 360 px).
- Accueil d'un nouveau visiteur et présentation #decouvrir : titre « Deviens une pépite en maths. », puis « Chaque jour,
  environ 5 minutes, à ton niveau » (la durée reste une information, plus le nom).
- Manifeste : `name` / `short_name` « Pépite² », description = slogan ; `apple-mobile-web-app-title` « Pépite² » ;
  page confidentialité « « Pépite² » (« Deviens une pépite en maths ») est une application… » ; partage et sauvegarde
  passent par `APP_NAME`.
- `tools/test_nom.py` refuse aussi « Pépite² », « Pépite au carré » et « Deviens une pépite » écrits en dur dans `src/`
  (hors constantes), et vérifie le logo dans l'en-tête et les icônes publiées.

## 2. Logo (tools/logo/)

`python3 tools/logo/gen_logos.py [A|B|C]` génère les 3 propositions (SVG), la planche `tools/logo/planche.png` et applique
la variante choisie : icônes `src/pwa/icon-192/512.png` (any), `icon-maskable-192/512.png` (zone sûre à 80 %),
`apple-touch-icon.png` (180), `favicon-32.png`, `favicon.svg`, et la ligne `const LOGO_MARK` de `src/curriculum.js`
(pépite de l'en-tête, SVG en ligne). **Appliquée : A.**

- **A** (défaut) : vraie pépite d'or d'orpaillage, en or poli : silhouette de roche martelée (contour irrégulier, plus
  large que haut, angles et encoches), dégradé métallique à bandes claires et sombres (lumière en haut à gauche), plans
  sombres et clairs aux arêtes nettes, petits creux, liseré de contre-jour sur le bord bas, éclats presque blancs, ombre
  portée douce décalée en bas à droite ; ² en exposant sur un bout de papier quadrillé (idée de l'enseignant : la pépite = le côté brillant, le ² =
  le côté scolaire ; carré crème incliné, petits carreaux bleu clair, marge rouge discrète, ² à l'encre bleue de l'app) ;
  favicon : carré blanc sans quadrillage, plus grand ; fond bleu de l'app à quadrillage de cahier. Lisible à 48 px
  et en favicon 16–32 px (silhouette vérifiée).
- **B** : la même pépite posée sur une carte de cahier en carré arrondi (« au carré »), ² doré.
- **C** : typographique, grand P blanc, la pépite porte le ² (dans l'en-tête : « Pépite » + pépite-exposant).
- Versions refusées par l'enseignant le 27.11 : pépite à facettes (« un diamant »), pépite ronde et lisse (« biscuit »,
  « nuage ») ; 3e version retenue : métal, plus de relief, pépite 15 % plus grande.

**Maths cachées** (demande de l'enseignant) : la pépite s'inscrit exactement dans un **rectangle d'or** 160·φ × 160
(258,885 × 160, coin (142 ; 190) dans le cadre 512 ; contour normalisé sur ce rectangle) ; son reflet principal cache une
**spirale d'or** (fine, opacité qui monte puis redescend le long du tracé, fondue dans le reflet spéculaire) (quarts de cercle dans 8 carrés retirés d'un rectangle d'or de 118 × 72,93, posé en haut de la pépite).
En petit, la spirale passe pour un reflet ; la planche montre A à 460 px et une vue « explication » (rectangle d'or en
pointillés, carrés de la spirale).

Nouvelle **question curieuse** `logo` (`src/curieux.js`, famille Énigme, notions `decdiv` + `rac` : 11e+, Collège, MP,
France selon les notions vues ; contexte neutre) : « Le logo de Pépite² cache un nombre célèbre » — figure de la pépite
dans son rectangle (largeur et hauteur en mm), pari (π, nombre d'or, √2), calcul largeur ÷ hauteur au centième (1,62),
révélation φ = (1 + √5) / 2 et la spirale. Oracle dans `tests/hc_contenu.html` (rapport recalculé depuis l'énoncé,
rectangle d'or vérifié).

## 3. Accent doré

Variables `--gold #f2b705`, `--gold-deep #e0a100`, `--gold-soft`, `--gold-ink` (clair et sombre ; --gold-ink sur
--gold-soft ≥ 9:1). Utilisé avec parcimonie : logo, pastille du filon dans l'en-tête (quand le filon est en cours), bord
gauche de la carte du filon au bilan, nombre de pépites sur la page parent. Bleu principal et contrastes inchangés ; jamais
de texte courant en or.

## 4. Vocabulaire (validé par l'enseignant, renommages seulement, calculs inchangés)

| Avant | Après |
|---|---|
| Points de l'année | **pépites** (« 🟡 120 pépites cette année », « +31 pépites » au bilan, « Gagner des pépites », bandeau « Pépites », « Apprenti dans 150 🟡 ») |
| Série (« 5 jours d'affilée ») | **filon** (« Ton filon : 5 jours », « tu es sur un bon filon ! » dès 3 jours, « Ton filon de 3 jours s'est arrêté. Fais une séance aujourd'hui : il repart à 1. », « Joker de filon ») ; badge « 3 jours d'affilée » gardé (sens clair) |
| Carnet d'erreurs | **À polir** (case de l'accueil « À polir · N à polir », « 3 pépites à polir », « ✨ Polie ! », « 2 polies cette semaine », « Polir mes pépites (3 questions) », « Pépite brute : rangée dans « À polir » ») ; règle gardée (« réussis-la du premier coup, elle est polie, deux fois de suite si tu es à l'aise ») ; icône 📕 → ✨, case : pierre au lieu du carnet |
| Parents | « 🟡 Cette semaine, <prénom> a trouvé N pépites et en a poli M. » (pépites de la semaine estimées depuis l'historique avec le barème des pépites, plafond du jour compris) |

« Série d'automatismes » (format de séance) n'est pas la série de jours : inchangée. Textes mis à jour dans `src/app.js`,
`src/parents.js`, `src/presente.js` (#decouvrir, #parents), `src/badges.js`.

Tests mis à jour (libellés seulement, chaque ligne commentée « 27.11 ») : carnet, faibles27, revue26, revue_26_11, r27b,
ux_2111b, lot_26_11, progression, parents, grades_annee, hc_contenu (nouvelle curieuse).

## 5. Vérifications

Captures `tests/_shots/pepite/` (360×640 et 1440×900, page `tests/_pepite_cap.html#cap=…`) : entree, accueil, filon,
polir, bilanfilon, reglages, parent, decouvrir, parents, curlogo. À 360 px : rien ne déborde, l'en-tête tient sur une
ligne (logo + « Pépite² » + filon + classe + ⚙️), les nouveaux libellés tiennent (cases de l'accueil, bilan).

## À soumettre à l'enseignant

- Choix du logo (A appliqué ; B et C prêts : `python3 tools/logo/gen_logos.py B`).
- PDF de présentation (`~/Projets/5min2maths-presentation/`) : pas encore renommés (hors de ce lot).
- Nom de domaine (pepiteaucarre.ch / .app) : au déménagement ; l'adresse actuelle reste.
