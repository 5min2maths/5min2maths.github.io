# Décisions de l'enseignant — 26.11.2026

Validées en bloc (« ok pour tes recommandations »). ✅ = rien à changer ou fait (agent « decisions », branche agent/decisions, 26.11) ; contrôles : tests/decisions26.html.

| # | Sujet | Décision | |
|---|---|---|---|
| 1 | Très faibles en 9e | accepter le plancher ; automatismes du primaire = 2027 | ✅ |
| 2 | Question allégée | oui, peut être la notion la mieux maîtrisée ; **une par séance au plus** | ✅ fait : aucune limite n'existait (2 échecs de suite relançaient l'allègement à chaque question) ; `session.easeUsed`, une par séance (app.js, robots tests/eleves.js) |
| 3 | Seuils 55 / 65 / 85 % | garder | ✅ |
| 4 | Réussite au positionnement | compte comme notion « vue » (pas de leçon refaite juste après) | ✅ fait : déjà en place (`placementResult` : vue, leçon vue) ; ajout de la migration des progressions antérieures (`Engine.migrate`) |
| 5 | Stats en 4e France | médiane et étendue restent (4e.DP.02) ; **quartiles retirés de la 4e FR**, gardés en 2nde | ✅ fait : libellé « Étendue, médiane » et formes à quartiles écartées (déjà là) ; 8 formes de médiane réservées à la 4e–3e FR (`VARX.quartiles`, q.fr, src/fr_couv.js) — la médiane n'avait aucune question |
| 6 | Multiplication de décimaux | élargir les contextes (tag ctx, vraisemblance) | ✅ fait : `decmul` niveau 4 (un seul problème, le carrelage) : 6 contextes de plus avec ctx (marché, électricité, location de vélos, job d'été, casiers de bouteilles, rideaux), src/defis.js |
| 7 | Items PER placés en 11e, travaillés en 10e dans les MER | suivre les MER | ✅ (déjà fait par l'agent PER) |
| 8 | Choix « tape le numéro » (items PER) | garder | ✅ |
| 9 | 40 % homothétie / 35 % cône-sphère | garder | ✅ |
| 10 | Décimal pour une fraction | accepté s'il est exact (0,75 pour 3/4), refusé s'il est arrondi (0,33 pour 1/3) | ✅ fait : exact déjà accepté ; arrondi = « faux » sans message (ou « presque » à 0,1 %) → refusé sans compter faux, « C'est une valeur arrondie : donne la valeur exacte, en fraction. » (valeur, ensemble, coordonnées ; src/expr.js) |
| 11 | Sujet de préparation | à J−2 ; J−1 = erreurs | ✅ fait : J−2 déjà le sujet ; J−1 = « Tes erreurs, une dernière fois » (carnet du test, compétences ratées au test rapide, notions fragiles ; 4 questions) au lieu du test rapide final, qui reste dans l'onglet Test (`prepKindOn`, app.js) |
| 12 | Automatismes | niveau 1 seulement | ✅ vérifié (planSlots : niveau 1) ; garde ajoutée dans `nextQuestion` (créneau « drill » toujours au niveau 1, même dans une séance reprise) |
| 13 | Durées des estimations | garder ; recalibrer après l'ouverture à la 11LS | ✅ |
| 14 | Barème guide / grades | garder jusqu'aux premiers retours | ✅ |
| 15 | Ligne « Leçons » dans Mes compétences (CO) | retirer | ✅ fait (screenCompsRef) |
| 16 | Bouton de réponse | « Vérifier » au lieu de « Valider » | ✅ fait (question, problème, pas à pas « Vérifier l'étape » ; tests et tools/ergonomie.md ; « Valider ma correction » du sujet gardé : ce n'est pas une réponse) |
| 17 | Clavier calculatrice | garder ; le reste contextuel | ✅ |
| 18 | Carte iOS, rappel toutes les 2 semaines | garder | ✅ |
| 19 | APP_TITLE | attendre (nom pas encore fixé) | ✅ |
