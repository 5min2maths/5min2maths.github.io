# 5minutes2mathsparjour

Web app d'entraînement quotidien en maths (secondaire, Suisse romande et France), sans compte.

- `src/curriculum.js` : notions et niveaux
- `src/expr.js` : calculateur d'expressions (réponses libres)
- `src/generators.js`, `src/gen2.js` : générateurs aléatoires (3 niveaux par notion)
- `src/gen3.js` : notions fines calées sur les référentiels (≈ une notion pour 2 à 4 compétences) ; relire un échantillon avec `tests/fine.html#9` (ou `#10`, `#11`, `#MP`)
- `src/figures.js` : figures SVG
- `src/engine.js` : adaptation, Mathélo, révisions espacées
- `tests/test.html` : tests (chromium --headless --dump-dom)
