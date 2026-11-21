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
- `tests/carnet.html` : carnet d'erreurs (ajout, effacement après 2 réussites, accueil, Progrès) et programme jusqu'au test (J−5 révision, J−2 sujet, J−1 dernier tour, jour J).
- `src/curieux.js` : questions curieuses (21.11) — maths cachées dans une situation : pari, vérification par le calcul, « ici, tu as utilisé… » ; onglet Problème et bonus de fin de séance ; facultatives, sans Mathélo ; accès selon les notions déjà vues ; test `tests/curieux.html`.
- `src/qcm.js` : autoévaluation et test rapide (21.11, modèle : page « Autoévaluation » des champs) — onglet Test : grille « Je sais… » (au plus 8 compétences du test, colonne Avant ✓ ~ ✗), une question à choix par ligne (mauvaises réponses = erreurs typiques des générateurs, même forme que la bonne), grille finale Avant / test / Après avec « tu pensais savoir » ; grille gardée dans state.autotest ; test `tests/qcm.html`.
- `tests/auteur.html` : mode auteur (`…/#auteur` : l'appareil n'envoie plus de statistiques ; `#auteur-off` pour annuler).
