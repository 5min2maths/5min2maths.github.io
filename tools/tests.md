# Tests à deux niveaux (27.11), pages par thème (28.11)

Décision de l'enseignant (27.11) : la suite complète ne bloque plus chaque publication. Deux niveaux :

| Niveau | Quand | Durée | Commande |
|---|---|---|---|
| **Rapide** | avant chaque publication (`tools/publier.sh "message"`) | 2–4 min | `tools/run_tests.sh --rapide` |
| **Complet** | chaque nuit à 5 h (cron) ; publication des gros changements (chargement, `build.py`, moteur) | 10–15 min | `tools/run_tests.sh` ; `tools/publier.sh --complet "message"` |

`tools/publier.sh` écrit dans son journal le niveau lancé (« TESTS : niveau RAPIDE … » / « niveau COMPLET … »), les
pages ajoutées et la durée.

## Pages par thème (28.11, journée ménage)

« La machinerie est devenue lourde » : les 180 pages de `tests/` (une par correction, par revue, par copie) sont
regroupées par THÈME, sans perdre une seule vérification (bilan : `tools/archive/entretien_tests_28-11.md`).

- **Une page de thème = plusieurs sections** ; chaque section est une ancienne page, recopiée telle quelle (son code,
  ses commentaires datés, qui disent pourquoi le contrôle existe). Mécanisme commun : `tests/lot.js` (doc en tête du
  fichier). Le code de l'app n'est chargé qu'une fois par page : c'est le gain de temps.
- Seules des pages qui chargent **exactement les mêmes fichiers** ont été réunies (un fichier `act_X.js` de plus
  redéfinit des leçons : réunir des pages aux fichiers différents changerait ce qu'elles testent).
- Résultat d'une page de thème : 1re ligne « ok N sections (…) » ou « ÉCHEC k/N sections : noms », puis chaque section
  sous « == nom ». Une section se lance seule : `tests/actives.html#section=act_1c` (dans le navigateur, ou
  `tools/run_tests.sh 'actives#section=act_1c'`).
- Sections d'**aperçu** (`apercu: true`, anciennes pages de capture sans contrôle, ex. `act_ch11b_vue`) : écran laissé
  affiché quand on lance la section seule (`#section=act_ch11b_vue&id=pythrec`) ; une erreur JS y est notée sans faire
  échouer la page.
- **Une page, plusieurs morceaux** : `<meta name="suite" content="part=1 part=2 part=3 part=4">` → la suite complète
  lance `recalcul.html#part=1` … `#part=4` (anciennes pages `recalcul2`–`recalcul4`) ; de même
  `corrige_valeur.html#jeu=ch|defis|fr|frl` (anciennes pages `corrige_valeur_defis`, `_fr`, `_frl`).
- **Ajouter un contrôle** : dans la section du thème concerné (jamais une nouvelle page datée). Nouvelle section :
  `Lot.section("nom", { html: '<main id="app"></main><pre id="out"></pre>' }, function () { … });` avant
  `Lot.lance();`, dans une page qui charge les fichiers dont le contrôle a besoin.
- Pages restées seules : celles qui travaillent dans un cadre (`fumee`, `ecrans`, `ergo`, `entete_360`,
  `accessibilite`, `stockage`, `kp_stable`, `grades_annee`, `trouve_erreur`, `lot_26_11`, `poids`), les longues
  (`recalcul*`, `corrige_valeur`, `vraisemblance*`, `test`, `primaire`…) et celles dont les fichiers chargés sont
  uniques (leçons actives `act_9a` … `act_mp34`, pas à pas `college34` … `mp34`, référentiels `ref_co`, `ref_fr`… : `ref_co.js` et `ref_mp.js` se lancent eux-mêmes au chargement).

Thèmes (sections = anciennes pages) : `actives` (17 : leçons actives de base, défis d'arithmétique, aperçus),
`interface` (9), `seance` (9), `questions` (6), `parcours` (4 : décisions et revues du 27.11), `robustesse` (maj,
migration, a11y), `saisie` (6), `mathjax` (6 : MathJax réel), `catalogue` (6), `revues_eleves` (4 : revues et
décisions du 26.11), `guide` (5), `explo`, `guides` (4), `france`, `pas_a_pas`, `variantes`, `enonces` (revues du
26.11, 1er et 3e passages), `actives_11`, `chapitre_classe` (+ revue p4), `defis9`, `manip`.
Liste complète des sections : `grep -o 'Lot.section("[^"]*"' tests/*.html`.

## Niveau rapide

Liste explicite : `tools/tests_rapides.txt` (format documenté en tête du fichier), complétée par
`tools/tests_rapides.py` :

- toujours : contrôle de syntaxe de tous les fichiers de l'app (`tests/_syntaxe.html`), `tools/test_nom.py` ;
- **chargement et ordre d'exécution, toutes les classes** (`ORDRE 6` → `tools/poids.py ordre --rapide 6`) : pour les
  18 classes et le nouvel élève, `docs/` chargé par son vrai chargeur exécute les segments de la classe dans l'ordre
  des sources, tous avant le lancement, sans erreur JS ; empreinte (catalogue, registres de la classe, questions à
  graines fixes) identique aux sources, questions sur une notion sur 6. Ni « tout le code », ni « après le paquet x »
  (suite complète) ;
- **fumée** (`tests/fumee.html`) : à 360 × 640 et 1440 × 900, pour une 11e et une 4e France, accueil, séance
  (première question ou leçon), bilan, À polir (page et séance), Réglages, Progrès, présentation parents, espace
  parent vide, aperçu parent : aucune erreur JS, écran non vide, pas de débordement horizontal ;
- **garde-fous essentiels, échantillon** : `recalcul` morceaux 1 et 2, `recalcul_fr` (3 tirages par notion),
  `corrige_valeur` jeux `ch` et `fr` (3 tirages), `separation` (France / romand), `entete_360`,
  `robustesse#section=maj,migration` ;
- **pages touchées** depuis la dernière publication (`git diff origin/master`, plus fichiers non suivis) : toute page
  `tests/*.html` modifiée ou ajoutée ; pour `src/X.js` modifié, `tests/X.html`, `tests/X_*.html`, `tests/X2.html`… et,
  dans les pages de thème, les sections du même nom (`src/manip.js` → `manip#section=manip,manip_vue`) ; pour un
  fichier d'aide `tests/X.js`, les pages qui le chargent (`tests/lot.js` → toutes les pages de thème) ; et les
  correspondances `src/… -> pages` du fichier (une page ou une section) ;
- **échecs de la nuit** : les pages en échec dans `suivi/tests_nuit/dernier.txt`.

Mesure du 27.11 (machine au repos, sans changement de contenu en attente) : **2 min 29 s** pour 10 pages + syntaxe +
`test_nom.py` + `poids.py ordre --rapide 6` (19 profils). Chaque page de contenu modifiée ajoute son propre temps.
Essai : `M2M_BASE=HEAD tools/run_tests.sh --rapide` (autre référence que `origin/master`).

Les paramètres d'adresse sont permis (`recalcul#part=1&n=3`, `actives#section=act_1c`) :
`tools/run_tests.sh 'recalcul#part=1&n=3' fumee` marche aussi à la main (guillemets à cause du `&`).

## Codes de retour et verrou (28.11)

`tools/run_tests.sh` sort avec **0** si tout est vert, **1** s'il y a au moins un échec, **2** si le verrou des tests
est resté occupé (série annulée : rien n'a été testé, c'est un échec). Avant le 28.11, il sortait toujours avec 0 sauf
verrou : un `tools/run_tests.sh … && git commit` pouvait passer sans test. Dans un enchaînement avec un tube
(`run_tests.sh | tail`), le code est celui de `tail` : utiliser `set -o pipefail` ou lire « aucun échec ».
`M2M_PARALLELE=1` : un seul navigateur à la fois (mesures, autre agent au travail) ; `M2M_JOURNAL=fichier` : résultat
et durée de chaque page.

## Publication (28.11)

`tools/publier.sh` fige l'état AVANT les tests : construction, commit, tests sur ce commit, puis l'arbre doit être
resté identique (`git status` vide pour src, docs, tools, tests, build.py) avant le push. Échec des tests, autre commit
ou fichier modifié pendant les tests : rien n'est poussé, le commit est défait (`git reset`, les modifications restent
dans l'arbre) ; corriger, puis relancer. (Le 28.11, un écran modifié pendant les tests était parti sans être testé.)

## Niveau complet, la nuit

`tools/tests_nuit.sh` (cron `0 5 * * *`) : copie jetable (worktree `../5min2maths-wt/nuit`, remise sur master chaque
nuit), `python3 build.py`, `nice tools/run_tests.sh` (toutes les pages, tous les morceaux). Verrou propre
(`/tmp/5m2m_tests_nuit.lock`) en plus du verrou commun des tests. Jamais de publication ni de commit.

Résultat : `suivi/tests_nuit/AAAA-MM-JJ.log` (journal complet), `suivi/tests_nuit/pages.txt` (chaque page avec sa
durée, dernière nuit) et `suivi/tests_nuit/dernier.txt`, une ligne (« OK 98 pages (29.11, 12 min) » ou « 2 ÉCHEC(S) :
kp_stable, recalcul (29.11, 13 min) »), copiés aussi dans `~/Dropbox/Projets/5min2maths/suivi/tests_nuit/`. Le point
du matin l'affiche (« Tests de la nuit : … », section 5min2maths, `Calendrier/stats_5min2maths.py`), avec une alerte si
le résultat a plus de 36 h. « pages testées » compte les lancements (une page à 4 morceaux compte 4) et les deux
contrôles d'outils (`test_nom.py`, `poids.py ordre`).

Un échec de nuit = à corriger avant la publication suivante : la page revient d'elle-même dans le niveau rapide tant
que la nuit suivante ne l'a pas vue passer.
