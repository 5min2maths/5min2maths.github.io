# Pépite² : présentations (28.11, agent pepite-presentations)

Zone : pages de présentation de l'app (…/#decouvrir élèves, …/#parents, …/#enseignants) et PDF de présentation
(`~/Projets/5min2maths-presentation/`). Les écrans de l'app (question, bilan, carnet, progrès, badges, réglages, parents,
sauvegarde) sont traités par un autre agent : rien n'a été touché ici (ni `src/app.js`, `badges.js`, `parents.js`,
`backup.js`).

Consigne de l'enseignant (28.11) : « les présentations PDF, faut pas trop en faire ». On s'en tient donc au **strict
minimum** : le nom Pépite², le slogan, le vocabulaire validé (pépites, filon, À polir, portes du 27.11) et une phrase
claire « pépites = travail de l'année, Mathélo = niveau ». Pas de refonte, pas de nouvelle page, pas de décor. Un premier
passage plus large (logo, accent doré, section « Deux compteurs » dans #decouvrir) a été **retiré** avant ce rapport.
L'adresse reste 5min2maths.github.io : c'est l'adresse réelle tant que l'app n'a pas déménagé.

## 1. Inventaire (avant)

### Pages de l'app (src/presente.js)

Ces pages étaient déjà passées au nouveau nom le 27.11 (en-tête, slogan, À polir, Ton filon, La mine, Trésors cachés,
Chercheurs d'or, Jour J, Mon trésor). Il restait :

- **#decouvrir** : la carte « 🎯 Question du jour » portait l'ancien nom de la séance. Les pépites n'étaient pas
  distinguées du Mathélo.
- **#parents** : l'exemple de semaine ne montrait pas de pépites. La phrase « ni notes, ni **score** » était ambiguë, car
  le parent voit les pépites.
- **#enseignants** : le Mathélo était présenté seul, sans les pépites.
- Dans « « On le fait ensemble » », le guillemet fermant restait seul en début de ligne à 412 px.

### PDF (presentation.typ, en version complète et Suisse romande)

- Le nom était « 5 minutes de maths » partout : couverture, pied de page « … par jour », dernière page.
- Les 61 captures montraient l'ancienne app.
- Ancien vocabulaire : points, série (dont le joker), carnet d'erreurs, effacer ses erreurs, Progrès, et les cases
  Problème, Curieux, Histoire et Évaluation.

## 2. Changements (après)

### Pages de l'app

- **#decouvrir** :
  - « 🎯 Ta pépite du jour » : « Ni trop facile, ni impossible : les questions suivent ton niveau. **Pépites** = ton
    travail de l'année, **Mathélo** = ton niveau. »
- **#parents** :
  - L'exemple de semaine ajoute « 🟡 Cette semaine, votre enfant a trouvé **38 pépites** et en a poli **2**. », avec la
    classe `par-gems` de la vraie page parent.
  - « Ce que vous ne verrez pas : ni notes, ni Mathélo (son niveau)… »
- **#enseignants** : la carte « Noter vos élèves » dit « Pépites = le travail de l'année, Mathélo = le niveau : deux repères
  pour l'élève, pas une évaluation. »
- Espaces insécables dans « « On le fait ensemble » » et « 38 pépites ».
- Aucun CSS ajouté.

### PDF

**Nom et slogan**
- Les variables `app = "Pépite²"` et `slogan` sont en tête du fichier. La variable `url` est inchangée.
- Couverture : le titre devient « Deviens une pépite en maths. », suivi de la ligne « Environ 5 minutes par jour, juste
  à ton niveau. ».
- Pied de page : « Pépite² · Deviens une pépite en maths ».
- Dernière page : « Deviens une pépite en maths. ».

**Vocabulaire**
- Accueil : grand bouton « ▶ Ma pépite du jour » et cases La mine, Trésors cachés, Chercheurs d'or, Jour J, À polir,
  Mon trésor.
- Série devient filon (bilan, joker de filon).
- Carnet d'erreurs devient À polir, avec la vraie règle de l'app : deux réussites de suite du premier coup, une seule
  pour un élève en difficulté.
- Points deviennent pépites (« au plus 40 pépites par jour », « le problème de la semaine rapporte 10 pépites de plus »).
- Progrès devient Mon trésor.
- Titres : « La mine : le problème de la semaine », « Les trésors cachés : des questions curieuses », « Chercheurs d'or :
  l'histoire des maths », « Jour J : préparer une évaluation », « À polir : revenir sur ses erreurs ».

**Pépites et Mathélo (page 22)**
- Chapo : « les pépites comptent le travail de l'année, le Mathélo dit le niveau ».
- Cartes « 🟡 Les pépites = le travail de l'année » et « 📈 Le Mathélo = le niveau », dans le style existant, sans
  couleur ajoutée.

**Parents (page 27)**
- Le parent voit « les pépites trouvées et polies (« a trouvé 38 pépites et en a poli 2 ») ».
- Le parent ne voit « ni notes ni Mathélo (le niveau) ».

**Gardés tels quels**
- « Série d'automatismes » : c'est le nom d'un format de séance.
- « Point de départ » (le positionnement).

**Captures**
- Les 61 captures ont été refaites sur l'app de cette branche.
- Harnais : `docs/cap.html` est fabriqué à la volée et n'est jamais commité.
- Corrections du harnais :
  - date figée au 26.11 dans `cap_pre.js`, sinon le filon des états enregistrés « s'arrête » ;
  - `sc/placedone.js` gère le positionnement en deux étapes ;
  - nouveau `sc/badges.js` : les badges sont maintenant en bas de « Mes compétences ».
- Les anciennes captures, l'ancien .typ et les anciens scripts sont dans `archives/`.

**Fichiers**
- `pepite2_presentation.pdf` (36 p., avec la France) et `pepite2_presentation_suisse.pdf` (33 p.) sont copiés dans
  `~/Dropbox/Projets/5min2maths-presentation/`.
- Les anciens `5min2maths_presentation*.pdf` sont rangés dans `archives/`, dans les deux dossiers.

**À refaire après la fusion de l'autre agent** : les captures montrent ses écrans de master du 28.11 au matin. Ses
libellés encore anciens sont donc visibles dans certaines captures, en particulier le bilan (« Rangées dans ton carnet
d'erreurs », « encore 247 points ») et la page Jour J (« Je prépare une évaluation »). Après sa fusion, relancer
`outils/cap.py`, puis `outils/dims.py`, puis recompiler (≈ 15 min ; la marche à suivre est en tête de presentation.typ).

## 3. Vérifications

- Suite complète de l'app : 180 pages, aucun échec (avant le retour au minimum). Après le retour au minimum, presente,
  denominations, fumee et test_nom ont été relancés.
- tests/presente.html (commentés « 28.11 ») :
  - la phrase pépites / Mathélo est présente sur #decouvrir et sur #enseignants ;
  - la phrase « a trouvé 38 pépites et en a poli 2 » et « ni Mathélo » sont présentes sur #parents ;
  - les trois pages ne contiennent plus « points de l'année », « carnet d'erreurs », « 5 minutes de maths »,
    « 5min2maths » (sauf dans l'adresse) ni « série ».
- France / romand :
  - les textes ajoutés sont identiques dans les deux systèmes ;
  - tests/denominations.html est vert ;
  - le PDF suisse ne contient ni « France », ni « terminale », ni « euro », ni « lycée », ni « 6e » (pdftotext).
- PDF :
  - `outils/verif_pdf.py` : 0 erreur sur les deux PDF ;
  - les 36 pages ont été relues en image ; trois captures fausses ont été corrigées (placedone, badges, filon arrêté) ;
  - la couverture tient sur une page.

## 4. Captures (tests/_shots/pepite/presentations/)

Nommage : `<page>_<ch|fr>_<412|1440>_<avant|apres>.png`.
- Pages : decouvrir, parents, enseignants.
- Profils : romand (ch, élève de 11e) et France (fr, élève de 4e).
- Largeurs : téléphone (412 px) et ordinateur (1440 px), pages entières.

## 5. Propositions à soumettre à l'enseignant (non appliquées)

1. **Mathélo dans « Mon trésor » seulement** (décision du 28.11) : le PDF montre encore le Mathélo au positionnement
   (« Ton point de départ ») et dans « Mes grades ». Ces captures suivront les écrans de l'autre agent. Le texte du PDF
   ne promet rien de plus.
2. **Logo dans le PDF** (couverture, pied de page) : essayé puis retiré (pas de décor). À remettre seulement si
   l'enseignant le souhaite.
3. **Icône des pépites** : le « 🟡 » des écrans fait « jeton ». Une mini-pépite (LOGO_NUGGET) serait plus juste ; c'est à
   décider avec l'agent des écrans.
4. **Noms des fichiers** : `pepite2_…`, à renommer si l'adresse pepiteaucarre.ch est retenue.
