# Pépite² : nouveau nom, logo, univers (27.11, agent pepite)

Décision de l'enseignant (27.11) : l'app s'appelle **Pépite²** (« Pépite au carré »), slogan **« Deviens une pépite en
maths »**. Mathélo (cote de niveau), grades Pousse → Légende et « Problème de la semaine » ne changent pas. L'adresse de
l'app, les clés de stockage `m2m-*` et l'identifiant d'appareil ne changent pas : aucun testeur ne perd sa progression.

## 1. Nom et slogan

- `src/curriculum.js` : `APP_NAME = APP_SHORT = "Pépite²"`, `APP_TAGLINE = "Deviens une pépite en maths"`,
  `APP_TITLE = "Pépite² · Deviens une pépite en maths"` (onglet), `APP_TAGLINE_HTML` (slogan avec « pépite » surligné).
- En-tête (`brand`) : icône de l'app en miniature (≈ 30 px, version favicon : carré bleu, pépite, ² sur papier) + « Pépite² » ; slogan à côté au-dessus de 430 px (caché en dessous : l'en-tête tient à 360 px).
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
(icône miniature de l'en-tête). **Appliquée : G1 (validée par l'enseignant le 27.11)** — style « objet de jeu » ; icône d'app complète (fond bleu, pépite G1,
² sur bout de cahier) pour le manifeste (any + maskable), apple-touch-icon et favicon (version simplifiée) ; dans l'en-tête,
la pépite G1 seule à gauche de « Pépite² » (`LOGO_MARK`, classe `logo-nug`, choix « B avec le logo G1 »).

- **A** (version lisse précédente) : vraie pépite d'or d'orpaillage, en or poli : silhouette d'un seul bloc ramassé de roche martelée
  (contour irrégulier, arêtes et pointes émoussées, un petit creux, inscrit dans le rectangle d'or), dégradé métallique à bandes claires et sombres (lumière en haut à gauche), plans
  sombres et clairs aux arêtes nettes, petits creux, liseré de contre-jour sur le bord bas, éclats presque blancs, ombre
  portée douce décalée en bas à droite ; ² en exposant sur un bout de papier quadrillé (idée de l'enseignant : la pépite = le côté brillant, le ² =
  le côté scolaire ; carré crème incliné, petits carreaux bleu clair, marge rouge discrète, ² à l'encre bleue de l'app) ;
  favicon : carré blanc sans quadrillage, plus grand ; fond bleu de l'app à quadrillage de cahier. Lisible à 48 px
  et en favicon 16–32 px (silhouette vérifiée).
- **B** : la même pépite posée sur une carte de cahier en carré arrondi (« au carré »), ² doré.
- **C** : typographique, grand P blanc, la pépite porte le ² (dans l'en-tête : « Pépite » + pépite-exposant).
- Versions refusées par l'enseignant le 27.11 : pépite à facettes (« un diamant »), pépite ronde et lisse (« biscuit »,
  « nuage »), pépite à deux lobes (« pomme de terre ») ; retenue : métal poli, un seul bloc, plus grande, ² sur cahier.
- En-tête : pépite seule (version lisse) jugée « croissant », puis icône miniature, puis choix final : pépite G1 seule
  (≈ 32 × 21 px, lisible à 360 px). La figure de la question curieuse utilise la pépite seule (`LOGO_NUGGET`) avec son
  rectangle d'or (`LOGO_PHI`, ou : "pepite").

**Propositions** (G1–G3 sur la planche ; les autres restent générables pour mémoire) :
- **G1, G2, G3** (style « objet de jeu » : or poli à facettes, contour foncé, reflets nets, éclats, spirale fondue dans le
  reflet) : silhouettes compactes (largeur / hauteur ≈ 1,2), 3 à 5 lobes inégaux, 1–2 arêtes nettes, une encoche, pas de
  taille entre deux lobes ; 48 px et favicon simplifiés (pas d'éclats, ² sur carré blanc). G1 retenue. φ : la pépite G1 est
  inscrite exactement dans le rectangle d'or 258,885 × 160 (contour normalisé sur sa boîte, affinité appliquée aux points de
  contrôle) et la spirale d'or est fondue dans le grand reflet ; vue « explication » sur la planche.
- **A-mix** (`gen_logos.py AM`, demandé par l'enseignant : « fais le mélange ») : matière d'A-réaliste (contour bosselé,
  relief) et éclat d'A3 : le relief éclairé est recoloré par une table uniquement or (brun-ambre #7A4E00 dans les creux →
  ambre #C88A04 → or #F2B705 → jaune chaud #FFD84D sur les crêtes), reflets spéculaires nets #FFF7D6, éclats étoilés
  discrets, spirale d'or fondue dans le grand reflet, ombre portée ; 48 px / favicon : silhouette bosselée jaune vif +
  3 reflets. En tête de la 2e rangée de la planche (512, 192, 48, favicon, en-tête 360 px). Validé et appliqué partout
  (icônes du manifeste any et maskable, apple-touch-icon, favicon, en-tête, écran d'entrée). Retouche finale : nodules
  moins nombreux et plus gros (bruit plus grave, 2 octaves, relief adouci et plus haut), creux ambre plus profonds.
- **A-réaliste** (`gen_logos.py AR`, d'après sa photo de référence, non commitée : `tools/logo/_ref/` ignoré) : filtres SVG
  (bruit fractal → `feDisplacementMap` pour le contour bosselé ; second bruit = relief → `feDiffuseLighting` et
  `feSpecularLighting`, lumière en haut à gauche, sur un dégradé or ; crevasses = bruit seuillé ; ombre vers le bas à
  droite ; grand reflet doux). Deux niveaux de détail : complet pour 512 / 192 / 180 px, simplifié pour 48 px et le
  favicon (contour bosselé + 3 zones de lumière). Rastérisés par Chromium (filtres vérifiés sur la planche et les PNG).
- **A3** (`gen_logos.py A3`) : meilleure des 3 silhouettes cassées (polygone irrégulier, pointes émoussées, encoches),
  gardée pour comparer ; A1 et A2 restent disponibles.
- Pour AR et A1–A3, φ n'est plus la boîte de la pépite (silhouette ≈ 1,25 × plus large que haute) mais le **rectangle
  d'or du reflet** (118 × 72,93, qui porte la spirale) ; `LOGO_PHI` (src/curriculum.js, généré) le dit, et la question
  curieuse change d'elle-même son énoncé (« le reflet brillant de la pépite (sa spirale) est tracé dans le rectangle »).

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

Captures `tests/_shots/pepite/` (360×640 et 1440×900 ; page `tests/_pepite_cap.html#cap=…`, tirages et date fixes) :
`entree` (écran d'entrée), `accueil`, `filon` (accueil avec filon en cours : pastille dorée), `curlogo` (question curieuse
du logo), `figure` (question avec figure), `bilanfilon` (bilan : filon, pépites, pépite polie), `polir` (À polir),
`progres`, `reglages`, `parent` (page parent), `decouvrir`, `parents`. À 360 px : rien ne déborde ; l'en-tête tient sur
une ligne (pépite + « Pépite² » + 💬 + filon + ⚙️) ; les nouveaux libellés tiennent (cases de l'accueil, bilan, « 37 pépites » dans la carte du haut).

## À soumettre à l'enseignant

- Choix du logo (A appliqué ; B et C prêts : `python3 tools/logo/gen_logos.py B`).
- PDF de présentation (`~/Projets/5min2maths-presentation/`) : pas encore renommés (hors de ce lot).
- Nom de domaine (pepiteaucarre.ch / .app) : au déménagement ; l'adresse actuelle reste.
