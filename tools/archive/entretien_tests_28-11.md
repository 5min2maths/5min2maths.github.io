# Entretien des tests, 28.11 (journée ménage, `/entretien tests`)

Décision de l'enseignant : « la machinerie est devenue lourde » → regrouper les pages de test par thème, sans perdre de
couverture. Branche `agent/entretien` (non fusionnée). Doc à jour : `tools/tests.md` ; mécanisme : `tests/lot.js`.

## Avant → après

| | Avant | Après |
|---|---|---|
| Pages `tests/*.html` (hors `tests/_*`) | 180 | **95** |
| Lancements de la suite complète (pages × morceaux, hors bot et eleves) | 178 | 99 |
| Pages datées (revues, décisions, lots) | 16 | 2 (`lot_26_11`, `vraisemblance_soir` : fichiers chargés uniques, cadre) |
| Paires `X` / `X_vue` | 9 aperçus séparés | sections d'aperçu de la page du thème |
| Variantes numérotées | recalcul, 2, 3, 4 ; corrige_valeur, _defis, _fr, _frl | `recalcul#part=1…4`, `corrige_valeur#jeu=ch/defis/fr/frl` (`<meta name="suite">`) |
| Durée, pages fusionnées (100 anciennes pages → 21 pages de thème), un navigateur, même séance | 518 s | **280 s** |
| Suite complète, un navigateur, somme des pages (mesure du matin, charge ≈ 10) | 1 344 s (22 min) | ≈ 1 100 s attendus (−240 s) |

La mesure de la suite entière après regroupement (2 083 s avec `poids.py ordre`, un seul navigateur) a été faite pendant
que d'autres agents travaillaient (recalcul#part=1 : 146 s contre 61 s le matin) : elle n'est pas comparable. Estimation
pour la nuit (2 navigateurs, machine au repos, 15 min le 28.11 pour l'ancienne suite) : **≈ 12 min**. La vraie mesure :
`suivi/tests_nuit/pages.txt` (nouveau : chaque page avec sa durée) après la nuit qui suivra la fusion.

## Aucune vérification perdue

- Les 178 pages ont été lancées une à une avant (sortie complète gardée), puis chaque page de thème ; la sortie de
  chaque section a été comparée à celle de l'ancienne page : **100 sections sur 100 présentes et vertes**, 67 identiques
  au caractère près ; les 33 autres diffèrent seulement par des tirages au hasard non fixés (mêmes contrôles, mêmes
  « ok », autres exemples : « 0 question de niveau 1 sur 92 » → « sur 89 »), par la pile d'une erreur (numéro de ligne)
  ou par un aperçu (aucun contrôle). 6 565 lignes de résultat avant ; même nombre de lignes par section après.
- Le code et les commentaires datés de chaque ancienne page sont recopiés tels quels dans sa section
  (`/* ======== act_9b (ancienne page tests/act_9b.html) ======== */`).
- Seules des pages qui chargent exactement les mêmes fichiers ont été réunies : un premier essai par thème « large »
  (fichiers réunis) changeait ce que testaient les leçons actives (un `act_X.js` de plus redéfinit des leçons) ; abandonné.
- `recalcul2–4` et `corrige_valeur_*` : copies de la même page où seule une ligne changeait ; une page à paramètre, même
  code par morceau (diff vérifié), la suite lance chaque morceau.

## Pages de thème

| Page de thème | Sections (anciennes pages) | Lignes de résultat avant → après | Durée avant → après |
|---|---|---|---|
| `actives` | 17 : act_1c, act_mp2, act_ch11b, act_prop11, act_eq1c, act_sys1c, act_manip, act_arith, act_cercletan, act_divcrit, act_fractout, act_multdiv, act_premiers, act_prio, act_ch11b_vue, act_ch11c_vue, act_manip_vue | 130 → 127 | 45 s → 6 s |
| `interface` | 9 : accueil_demo, auteur, home_nav, ux_2111, ux_2111b, voie, placement_type, signaux, erreurs | 21 → 22 | 22 s → 3 s |
| `seance` | 9 : free, progression, carnet, ctest, sujet, riche11c, evacom, variete, free_vue | 95 → 96 | 22 s → 4 s |
| `questions` | 6 : final, pi_keys, pieges, qcm, figs_nombres, figs_noms | 45 → 45 | 51 s → 34 s |
| `parcours` | 4 : dec27, faibles27, r27b, r27 | 100 → 100 | 12 s → 6 s |
| `robustesse` | 3 : maj, migration, a11y | 3 → 3 | 11 s → 4 s |
| `saisie` | 6 : vide, ui, sent, cmt, kp, lesson | 123 → 123 | 21 s → 10 s |
| `mathjax` | 6 : sujet11, act_eq1c_vue, act_litt11_vue, act_prop11_vue, eq1c_vue, no11_vue | 11 → 9 | 15 s → 3 s |
| `catalogue` | 6 : figs, oldnotions, fine, code, one, figsample | 2376 → 2376 | 14 s → 2 s |
| `revues_eleves` | 4 : revue26, decisions26, p5_26_11, p6_26_11 | 55 → 55 | 21 s → 12 s |
| `guide` | 5 : guide_fold, guide_fold2, guide, code2, dyn | 3 → 2 | 15 s → 2 s |
| `explo` | 2 : explo, curieux | 2 → 2 | 12 s → 4 s |
| `guides` | 4 : guides, solsteps, trivial, figs_lecons | 59 → 59 | 78 s → 55 s |
| `france` | 3 : france, frfin, act_frfin | 157 → 157 | 20 s → 13 s |
| `pas_a_pas` | 3 : ch11, ch1c, deuxpoints | 801 → 801 | 29 s → 19 s |
| `variantes` | 3 : variantes, domaine, releve | 2 → 2 | 7 s → 2 s |
| `enonces` | 2 : revue_26_11, p3_26_11 | 63 → 63 | 95 s → 86 s |
| `actives_11` | 2 : act_ch11c, act_litt11 | 12 → 12 | 6 s → 3 s |
| `chapitre_classe` | 2 : chapitre_classe, p4_26_11 | 2 → 2 | 7 s → 5 s |
| `defis9` | 2 : defis9, now | 2 → 2 | 6 s → 2 s |
| `manip` | 2 : manip, manip_vue | 21 → 20 | 9 s → 5 s |

Pages fusionnées : 518 s → 280 s (mesure page par page, un seul navigateur).

Autres pages (74, dont `recalcul` et `corrige_valeur` à paramètre) : cadres (`fumee`, `ecrans`, `ergo`, `entete_360`, `accessibilite`, `stockage`, `kp_stable`,
`grades_annee`, `trouve_erreur`, `lot_26_11`, `poids`), fichiers chargés uniques (leçons actives `act_9a`…`act_mp34`,
pas à pas `college34`…`mp34`, `ref_*`, `separation`, `primaire`, `test`, `trous`…), `bot` et `eleves` (hors suite).

## Défauts trouvés en chemin (déjà là avant, jamais vus)

« ERR » n'est pas un mot d'échec pour `run_tests.sh` : ces pages étaient vertes sans rien contrôler à la fin.
`home_nav` (clic sur un bouton absent), fin de `free` (bouton de séance absent) ; aperçus cassés : `act_ch11b_vue`,
`act_ch11c_vue`, `act_manip_vue`, `free_vue`, `eq1c_vue`, `no11_vue`, `code`, `cmt`, `lesson` (Badges non chargé),
`domaine`. Repris dans `ETAT.md` (à réparer ou supprimer). `tools/test_nom.py` échoue sur master depuis l'écran
d'ouverture (`src/app.js` : « Deviens une pépite » écrit en dur au lieu de `APP_TAGLINE`).

## Machinerie corrigée

- `tools/run_tests.sh` : code de retour 0 / 1 / 2 (avant : toujours 0 sauf verrou ; verrou occupé = 2, message
  « série annulée, ÉCHEC ») ; `grep -a` partout (signalé par /contenu : un résultat vu comme binaire masquait un échec) ;
  DOM illisible = échec, jamais un succès par défaut ; navigateur sorti sans résultat détecté tout de suite (avant :
  400 s d'attente) ; durée de chaque page ; `<meta name="suite">` ; `M2M_PARALLELE`, `M2M_JOURNAL`.
- `tools/publier.sh` : commit AVANT les tests, tests sur ce commit, push seulement si vert ET arbre inchangé ; sinon
  commit défait (modifications gardées dans l'arbre).
- `tools/tests_rapides.py` / `.txt` : sections des pages de thème (`page#section=a,b`), règle du nom appliquée aux
  sections, deux morceaux d'une même page possibles.
- `tools/tests_nuit.sh` : `suivi/tests_nuit/pages.txt`. Renvois mis à jour : `tools/*.md`, `france_couverture.py`,
  `plan_pas_a_pas.py`.
