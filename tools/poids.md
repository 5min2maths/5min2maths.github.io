# Poids du code publié (27.11, agent poids)

Constat d'un testeur : `docs/app.js` pesait 2,7 Mo (8 Mo pour tous les `docs/*.js`). Objectif : moins de code
téléchargé et exécuté **avant le premier écran**, sans changer le comportement.
Outils : `python3 tools/poids.py taille [DOSSIER…]`, `python3 tools/poids.py empreinte --avant DOSSIER`,
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
- `tests/maj.html` (« Nouvelle version prête ») et suite complète `tools/run_tests.sh`.

## Écart préexistant découvert (pas corrigé : il changerait le comportement)

L'outil d'empreinte montre deux écarts **déjà présents avant ce chantier** :

1. **Premier écran ≠ après l'arrière-plan.** Des paquets supérieurs remplacent les générateurs de notions de classes
   inférieures. Tant qu'ils ne sont pas chargés (quelques secondes après l'accueil), l'élève reçoit d'autres questions :
   - 9e : 14 notions (ch10_no → decadd, decmul… ; ch11_no → fracadd, prio ; ch11_litt → litelab ; ch1c_no → divcrit) ;
   - 10e : 33 notions (ch11_*, act_ch11b/c, ch1c_eq/sys/no/geo) ;
   - 11e : 21 notions (**ch1c_eq.js** : eq1, eq2, eq2disc, eq2fact… ; **ch1c_sys.js** : affine, sys2, tabval… ; ch1c_no.js) ;
   - 1re Collège : absval (ch2c.js) ; MP 2e–4e : quartiles (fr_couv.js).
   Une séance lancée tout de suite après l'ouverture peut donc servir l'ancienne version de eq1 à un élève de 11e.
2. **Version publiée ≠ version testée.** Les pages de test chargent les sources dans l'ordre de build.py ; la version
   publiée exécute le code commun AVANT les paquets. Résultat (mesure du 27.11, 334 notions) : 159 notions ont
   d'autres questions publiées que testées, et 147 autres une leçon différente. Exemples : `defis.js` (« remplace les problèmes de niveau 4 des chapitres ») s'exécute avant les
   chapitres, qui le remplacent à leur tour ; `act_manip2.js` (manipulations) passe avant les leçons actives des
   paquets, qui l'écrasent. Mesure : `python3 tools/poids.py empreinte --src`.

Piste (chantier à décider) : publier pour chaque classe **un seul fichier dans l'ordre des sources** (commun + ses
fichiers, ordre de build.py), et choisir les fichiers de chaque classe avec `tools/poids.py empreinte` (mêmes
questions que la version testée). Le chargement par paquets en arrière-plan deviendrait inutile ; le précache garde
la classe de l'élève hors ligne. Conséquence : 9e–11e devront charger les fichiers ch11_* / ch1c_* qui redéfinissent
leurs notions (plus lourd qu'aujourd'hui, mais exact).

## Pistes non retenues (pour l'instant)

- `defis.js` (501 Ko, le plus gros fichier commun) : dépend de l'ordre d'exécution (voir ci-dessus), à traiter avec
  le chantier « ordre ».
- France : charge tout (`need` FR) ; seulement en aperçu (`#france`).
- MathJax (2,1 Mo, déjà minifié) : inchangé.
