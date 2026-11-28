# Poids du code publié (27.11, agent poids)

> 27.11 (agent ordre) : `docs/app.js` et les paquets `docs/p-*.js` décrits ci-dessous sont remplacés par des segments
> exécutés dans l'ordre des sources (`docs/sNN.js`) : voir § « Ordre d'exécution ». Les mesures « Après » ci-dessous
> sont celles de l'agent poids, avant ce changement.

Constat d'un testeur : `docs/app.js` pesait 2,7 Mo (8 Mo pour tous les `docs/*.js`). Objectif : moins de code
téléchargé et exécuté **avant le premier écran**, sans changer le comportement.
Outils : `python3 tools/poids.py taille [DOSSIER…]`, `python3 tools/poids.py ordre` (27.11, agent ordre),
page `tests/poids.html` (plafonds), `tools/test_paquets.py`, `tools/test_hors_ligne.py`.

## Avant / après : ce qu'un élève télécharge avant son premier écran

index.html + app.js + paquets requis + start.js (gzip niveau 9 ; GitHub Pages compresse un peu moins).

| Profil | Avant brut | Après brut | Avant gzip | Après gzip | Gain gzip |
|---|---|---|---|---|---|
| Nouvel élève (écran d'entrée) | 3'004 Ko | 2'430 Ko | 870 Ko | 690 Ko | −21 % |
| 11e (paquets 9, 10, 11) | 4'378 Ko | 3'678 Ko | 1'245 Ko | 1'035 Ko | −17 % |
| 1re Collège (9 à 12) | 5'429 Ko | 4'660 Ko | 1'512 Ko | 1'287 Ko | −15 % |
| MP 2e (9 à 13 + mp) | 6'213 Ko | 5'380 Ko | 1'728 Ko | 1'490 Ko | −14 % |
| 4e France (tout) | 8'208 Ko | 7'226 Ko | 2'274 Ko | 2'001 Ko | −12 % |

Fichiers : `app.js` 2'617 → 2'115 Ko (752 → 599 Ko gzip) ; `start.js` 304 → 232 Ko (97 → 70) ; total `docs/*.js`
8'210 → 7'466 Ko (2'275 → 2'078 Ko gzip).

Temps (`tools/mesure_chargement.py --comparer <avant> docs --rapide`, médiane de 3, écran affiché) :

| Scénario | Avant | Après |
|---|---|---|
| Nouvel élève, CPU ×4, réseau local | 471 ms | 427 ms |
| Nouvel élève, CPU ×6 + 4G lente | 7,6 s | 6,4 s (−1,2 s) |
| Habitué (11e, cache chaud), CPU ×4 | 366 ms | 398 ms (bruit de mesure) |
| Habitué, CPU ×6 + 4G lente | 551 ms | 541 ms |

Chez un habitué, le code est déjà en cache (compilé) : le gain porte surtout sur la première visite.

## Ce qui a été fait

1. **Paquet « x »** (`docs/p-x.js`, 237 Ko, 76 Ko gzip) : `histoire.js`, `curieux.js`, `presente.js` sortent du code
   commun. Chargé en arrière-plan après le premier écran (avec les autres paquets), ou à la première ouverture :
   cases Curieux et Histoire (`withX`, src/app.js), bouton « Bonus : une question curieuse » du bilan (apparaît à
   l'arrivée du paquet), adresses `#decouvrir`, `#parents`, `#enseignants`, `#parent=…`, `#q-cur-…` (le chargeur
   ajoute « x » au démarrage ; sur changement d'adresse, `showCode` l'attend). Hors ligne sans le paquet : message
   clair, retour à l'accueil. `parents.js` reste commun (carte de Progrès).
2. **Minification simple** (`tools/minijs.py`, appelée par build.py pour `docs/*.js` seulement) : commentaires et
   indentation retirés ; chaînes, gabarits et expressions régulières intacts ; **tous les sauts de ligne gardés** :
   les numéros de ligne des erreurs JS restent ceux du code non minifié (les colonnes changent). Rien n'est renommé.
   ≈ −9 % brut et gzip. `dist/` et les pages de test (sources) ne changent pas.
3. **Service worker** : tous les paquets (`p-*.js?v=…`) dans le précache d'installation. Avant, à la première visite,
   les paquets du premier écran étaient chargés avant que le service worker ne contrôle la page : ils n'étaient pas
   dans son cache, et l'app pouvait démarrer sans eux hors ligne si l'élève la fermait avant la visite suivante.

## Vérifications

- `tools/poids.py empreinte --avant <ancienne construction>` : questions (Engine.build / Engine.make, graines fixes,
  niveaux 1–4, leçons) de toutes les notions, dans Chromium : **identiques avant / après**, avec tous les paquets et,
  pour chacune des 18 classes (9e–4e, MP 1re–4e, France 6e–Tle), avec seulement les paquets du premier écran.
- `tests/poids.html` (nouveau) : plafonds gzip du premier chargement (nouvel élève 720 Ko, 11e 1'090, 1re 1'350,
  MP 2e 1'570, 4e FR 2'100), histoires / curieux / présentations hors du commun, chaque fichier source publié une fois,
  et pour chaque classe : avec les seuls paquets du premier écran, chaque notion du catalogue a son générateur et
  donne des questions de chaque niveau sans erreur.
- `tools/test_paquets.py` : + cases Histoire et Curieux (paquet x à la demande), `#decouvrir` (x au démarrage), 10 paquets.
- `tools/test_hors_ligne.py` : + les 10 paquets dans le cache hors ligne ; hors ligne, accueil et MathJax.
- `tests/robustesse.html#section=maj` (« Nouvelle version prête ») et suite complète `tools/run_tests.sh`.

## Ordre d'exécution (27.11, agent ordre) : la version publiée = la version testée

### Problème (trouvé ci-dessus)

1. **Version publiée ≠ version testée.** Le chargeur du 24.11 exécutait tout le code commun (`app.js`) AVANT les
   paquets, alors que les sources (pages de test, `dist/`) s'exécutent dans l'ordre de la liste `JS` de build.py, où
   code commun et fichiers de paquets s'entrelacent. Les fichiers qui « remplacent » (defis.js, act_manip2.js, riche.js…)
   étaient donc écrasés par les fichiers de chapitre au lieu de les remplacer.
2. **Générateurs provisoires au premier écran.** Le chargeur ne chargeait avant l'accueil que les paquets de la classe et
   des classes inférieures ; or des paquets supérieurs redéfinissent des notions inférieures (ch1c_eq.js → eq1 en 11e…).
   Les autres paquets arrivaient quelques secondes après, en arrière-plan, et changeaient les questions en cours de route.

### Solution

- **Segments dans l'ordre des sources** (build.py) : la liste `JS` est découpée en segments consécutifs (`docs/sNN.js`,
  36 au 27.11), chacun formé de fichiers du même groupe (code commun, paquet x, ou paquets requis par les mêmes classes).
  Mis bout à bout, les segments redonnent exactement `JS`.
- **Chaque classe exécute, dans l'ordre des sources, le code commun et les segments de ses paquets** (`CLASSES` de
  build.py), tous AVANT l'app (`start.js`) : scripts insérés d'un coup avec `async = false` (téléchargement en
  parallèle, exécution dans l'ordre). Plus aucun paquet en arrière-plan ; seul le paquet « x » (histoires, curieux,
  présentations, indépendant du reste) s'ajoute à la fin, à la demande.
- `CLASSES` = paquets de la classe et des classes inférieures (comme avant) **plus ceux qui redéfinissent ses notions** :
  10, 11, 12 en 9e–11e ; 13 en 1re Collège (ch2c.js : absval) ; fr en MP 2e–4e (fr_couv.js : quartiles). Mesuré page par
  page (une page neuve par classe et par paquet retiré : des générateurs gardent une mémoire anti-répétition, deux
  empreintes dans la même page diffèrent).
- **Changement de classe** (`ensurePacks(p, true)`) : si le code exécuté n'est pas exactement celui de la nouvelle classe,
  on vérifie que ses segments sont disponibles (cache hors ligne ou réseau ; sinon « Pas de connexion », comme avant),
  puis la page se recharge avec le bon code et le choix reprend (`window.__reprise` → `setProfile`, src/app.js).
- **Pages qui ont besoin de tout** (liens `#q-`, `#l-`, `#auteur`, présentations `#decouvrir` `#parents`
  `#enseignants`, espace parent `#parent=`) : tout le code, dans l'ordre (= les sources) ; adresse changée dans l'app
  ouverte → rechargement (showCode).
- **Garde** : au démarrage, code exécuté différent de celui de la classe de l'élève → rechargement avec tout le code ;
  segment manquant au chargement (hors ligne, jamais mis en cache) → message « Pas de connexion » et « Réessayer », jamais
  une app à moitié chargée.
- Service worker : tous les segments précachés à l'installation (changement de classe possible hors ligne).

### Empreintes avant / après (questions Engine.make, graines 1, 2, 7, niveaux 1–4, leçon, leçon active ; catalogue)

Notions de la classe dont l'empreinte publiée diffère des sources (= de ce que vérifient les tests) :

| Classe | Notions | Avant, premier écran | Avant, après l'arrière-plan | Après |
|---|---|---|---|---|
| 9e | 49 | 46 | 45 | 0 |
| 10e | 83 | 77 | 75 | 0 |
| 11e | 109 | 101 | 100 | 0 |
| 1re Collège | 152 | 143 | 143 | 0 |
| 2e Collège | 186 | 169 | 169 | 0 |
| 3e Collège | 211 | 194 | 194 | 0 |
| 4e Collège | 230 | 213 | 213 | 0 |
| MP 1re | 124 | 114 | 114 | 0 |
| MP 2e | 145 | 135 | 135 | 0 |
| MP 3e | 157 | 147 | 147 | 0 |
| MP 4e | 170 | 160 | 160 | 0 |
| France 6e–Tle | 36–201 | 32–184 | 32–184 | 0 |

(Avant : surtout les défis de niveau 4 et les leçons, que defis.js, riche.js et act_manip2.js n'arrivaient plus à
remplacer.) Après : identique aux sources pour les 18 classes, au premier écran et après le paquet x, ainsi que les
registres restreints à la classe (NOTIONS sans les champs FR/againFR/labelFR pour une classe suisse, LESSONS, ACTIVE,
RICH, VAR, VARX, PROBX, HINTS, PREREQ) ; tout le code (liens) : identique, registres complets compris.

### Coût en poids (gzip, avant le premier écran)

| Profil | Avant (27.11, agent poids) | Après | Écart |
|---|---|---|---|
| Nouvel élève (écran d'entrée) | 690 Ko | 696 Ko | +1 % |
| 9e, 10e, 11e | 11e : 1'035 Ko | 1'290 Ko | +25 % (11e) |
| 1re Collège | 1'287 Ko | 1'369 Ko | +6 % |
| 4e Collège | — | 1'638 Ko | |
| MP 1re | — | 1'420 Ko | |
| MP 2e | 1'490 Ko | 1'741 Ko | +17 % |
| MP 4e, France | 2'001 Ko | 2'011 Ko | +0,5 % |

Le prix de l'exactitude : 9e–11e chargent les chapitres de 1re (ch1c_*) qui redéfinissent leurs notions, MP 2e–4e les
fichiers France (fr_couv.js). Mais l'élève ne télécharge plus le reste en arrière-plan (avant : tout, 2 Mo gzip, juste
après l'accueil) ; le service worker le précache une fois à l'installation. Total `docs/*.js` inchangé (7,5 Mo brut,
2,1 Mo gzip). Un nouvel élève recharge la page une fois après le choix de sa classe.

### Contrôles

- `tools/poids.py ordre` (**dans la suite**, tools/run_tests.sh, série complète) : pour chaque classe, docs/ chargé par son
  vrai chargeur ; ÉCHEC si un segment s'exécute hors de l'ordre des sources, si l'app démarre avant tous les segments de
  la classe, si un segment s'exécute après le lancement (sauf x), ou si l'empreinte diffère des sources (docs/ non
  reconstruit après une modification des sources compris). ≈ 5 min.
- `tests/poids.html` : plafonds (nouvel élève 720, 11e 1'320, 1re 1'400, MP 2e 1'790, 4e FR 2'060 Ko gzip), segments =
  liste JS dans l'ordre, chaque classe complète avec ses seuls segments.
- `tools/test_paquets.py` : nouvel élève, 11e (rien après l'accueil), changements de classe (2e, 4e, MP 3e : rechargement,
  positionnement), choix de classe au bouton, liens #q- (au démarrage et depuis l'app ouverte), #decouvrir.
- `tools/test_hors_ligne.py` : + tous les segments en cache, changement de classe hors ligne.
- Ajouter un fichier source : l'ajouter à `JS` et à `paquet()` de build.py ; s'il redéfinit des notions d'autres
  classes, `tools/poids.py ordre` le signale (empreinte différente) : ajouter son paquet à `CLASSES`.
- `tools/mesure_chargement.py` (profils par fichier, `par_fichier`, `profil`) suppose encore un `app.js` unique : à adapter
  si on en a besoin.

## Pistes non retenues (pour l'instant)

- `defis.js` (501 Ko, le plus gros fichier commun) : s'exécute désormais à sa place (chantier « ordre » ci-dessus).
- France : charge tout (`need` FR) ; seulement en aperçu (`#france`).
- MathJax (2,1 Mo, déjà minifié) : inchangé.
