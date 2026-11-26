# 5minutes2mathsparjour

Web app d'entraînement quotidien en maths (secondaire, Suisse romande et France), sans compte.

- `src/curriculum.js` : notions et niveaux
- `src/expr.js` : calculateur d'expressions (réponses libres)
- `src/generators.js`, `src/gen2.js` : générateurs aléatoires (3 niveaux par notion)
- `src/gen3.js` : notions fines calées sur les référentiels (≈ une notion pour 2 à 4 compétences) ; relire un échantillon avec `tests/fine.html#9` (ou `#10`, `#11`, `#MP`)
- `src/figures.js` : figures SVG
- `src/engine.js` : adaptation, Mathélo, révisions espacées
- `tests/test.html` : tests (chromium --headless --dump-dom)
- `tools/signaux.py` : signaux muets (20.11) — par question et par leçon, ce que font les élèves sans le dire (échecs, réponses illisibles, abandons, durée, aide) ; alertes dans le point du jour ; test `tests/signaux.html`. Feuille « questions » de `tools/votes.gs`.
- `tests/carnet.html` : carnet d'erreurs (ajout, effacement après 2 réussites, accueil, Progrès) et programme jusqu'au test (1er jour autoévaluation, révisions, J−2 sujet de préparation, J−1 tes erreurs, jour J).
- `src/curieux.js` : questions curieuses (21.11) — maths cachées dans une situation : pari, vérification par le calcul, « ici, tu as utilisé… » ; onglet Problème et bonus de fin de séance ; facultatives, sans Mathélo ; accès selon les notions déjà vues ; test `tests/curieux.html`.
- `src/qcm.js` : autoévaluation et test rapide (21.11, modèle : page « Autoévaluation » des champs) — onglet Test : grille « Je sais… » (au plus 8 compétences du test, colonne Avant ✓ ~ ✗), une question à choix par ligne (mauvaises réponses = erreurs typiques des générateurs, même forme que la bonne), grille finale Avant / test / Après avec « tu pensais savoir » ; grille gardée dans state.autotest ; test `tests/qcm.html`.
- `tests/auteur.html` : mode auteur (`…/#auteur` : l'appareil n'envoie plus de statistiques ; `#auteur-off` pour annuler).
- Leçons actives, étape 2 (22.11, `actPrep` dans `src/active.js`) : « Manipule » (curseur, figure à déplacer : tous les défis), « Essaie sur la figure » (réponse tapée qui fait réagir une figure : tous les défis), « À toi : 2 questions » (réponse tapée sans figure : 2 questions, coup de pouce après une erreur). `garde: [i, j]` dans une leçon impose les questions retenues (calcul enchaîné, question qui reprend le « Devine »).
- Calculatrice (25.11, `tools/calculatrice.md`) : le calcul tapé (le champ évalue `-7+19`, `pi*3^2`…) est permis ou non selon la notion (`CALC_*` dans `src/engine.js`) : résultat exigé quand le calcul est la compétence (relatifs, fractions, puissances, racines…), permis quand il est un outil (aire, volume, proportionnalité, statistiques…) ; formes littérales déduites de la consigne (développe, factorise). Test `tests/calculatrice.html`.
- France (25.11, `tools/france.md`) : audit et plan d'ouverture ; profil FR localisé (`frLocal` dans `src/curriculum.js` : €, milliers 1 200, PGCD, antécédent, factoriser) ; aperçu sur un appareil avec `…/#france` (`…/#france-off` pour annuler) ; test `tests/france.html`.
