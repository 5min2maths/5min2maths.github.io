# Tests à deux niveaux (27.11)

Décision de l'enseignant : la suite complète (≈ 180 pages + `tools/poids.py ordre`, 25–30 min) ne bloque plus chaque
publication. Deux niveaux :

| Niveau | Quand | Durée | Commande |
|---|---|---|---|
| **Rapide** | avant chaque publication (`tools/publier.sh "message"`) | 2–4 min | `tools/run_tests.sh --rapide` |
| **Complet** | chaque nuit à 5 h (cron) ; publication des gros changements (chargement, `build.py`, moteur) | 25–30 min | `tools/run_tests.sh` ; `tools/publier.sh --complet "message"` |

`tools/publier.sh` écrit dans son journal le niveau lancé (« TESTS : niveau RAPIDE … » / « niveau COMPLET … »), les
pages ajoutées et la durée.

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
- **garde-fous essentiels, échantillon** : `recalcul`, `recalcul2`, `recalcul_fr` (3 tirages par notion),
  `corrige_valeur`, `corrige_valeur_fr` (3 tirages), `separation` (France / romand), `entete_360`, `maj`, `migration` ;
- **pages touchées** depuis la dernière publication (`git diff origin/master`, plus fichiers non suivis) : toute page
  `tests/*.html` modifiée ou ajoutée ; pour `src/X.js` modifié, `tests/X.html`, `tests/X_*.html`, `tests/X2.html`… ;
  pour un fichier d'aide `tests/X.js`, les pages qui le chargent ; et les correspondances `src/… -> pages` du fichier ;
- **échecs de la nuit** : les pages en échec dans `suivi/tests_nuit/dernier.txt`.

Les paramètres d'adresse sont permis (`recalcul#n=3`) : `tools/run_tests.sh recalcul#n=3 fumee` marche aussi à la
main. Les pages lancées une à une gardent leurs seuils (aucune page de la suite n'est modifiée).

## Niveau complet, la nuit

`tools/tests_nuit.sh` (cron `0 5 * * *`) : copie jetable (worktree `../5min2maths-wt/nuit`, remise sur master chaque
nuit), `python3 build.py`, `nice tools/run_tests.sh` (couverture inchangée). Verrou propre (`/tmp/5m2m_tests_nuit.lock`)
en plus du verrou commun des tests. Jamais de publication ni de commit.

Résultat : `suivi/tests_nuit/AAAA-MM-JJ.log` (journal complet) et `suivi/tests_nuit/dernier.txt`, une ligne
(« OK 178 pages (28.11, 26 min) » ou « 2 ÉCHEC(S) : kp_stable, recalcul3 (28.11, 27 min) »), copiés aussi dans
`~/Dropbox/Projets/5min2maths/suivi/tests_nuit/`. Le point du matin l'affiche (« Tests de la nuit : … », section
5min2maths, `Calendrier/stats_5min2maths.py`), avec une alerte si le résultat a plus de 36 h.

Un échec de nuit = à corriger avant la publication suivante : la page revient d'elle-même dans le niveau rapide tant
que la nuit suivante ne l'a pas vue passer.
