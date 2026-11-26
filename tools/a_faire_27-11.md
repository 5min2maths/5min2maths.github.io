# À faire le 27.11 (retours testeurs du 26.11 au soir, revues Claude externes)

Ordre (solidité d'abord) :
1. **Élèves faibles : lancer /eleves-faibles** (agent créé le 26.11 au soir ; simulation (tests/_simulation_testeur.js, simulateClass) sur la version du 26.11 soir :
   Lucas 49 %, Sarah 46 %, Yanis 17 % au 1er essai, Mathélo −126 / −152 / −113. Chercher pourquoi le moteur ne
   ramène pas la réussite vers la cible (55–65 %) : niveaux servis, remobilisation, poids de l'échec avec aide.
   Une seule réussite au positionnement ne doit pas donner « maîtrisée » (seulement « vue », décision n° 4).
   Proposer les réglages (finir sur une réussite, échauffement) à l'enseignant AVANT de toucher aux seuils.
2. **Corrigé = valeur attendue** (lancé puis arrêté le 26.11 à 22 h, quota : à relancer après le reset de 8 h) : test sur tout le catalogue.
3. **Zones tactiles ≥ 44 px** : 💬 (28 px), ⚙️ (34 px), « Choisir mon chapitre », En classe, Libre, ⓘ ; test à 360 px.
4. **Série perdue** : l'en-tête affiche « 0 j » sans message après 4 jours d'absence → pas de « 0 j », message doux
   (la phrase « Ta série de … » n'apparaît que dans la carte de séance, le jour du retour).
5. Petits défauts : pavé 1–4 pour les choix, ensembles de nombres hors automatismes, « Je ne sais pas » revient en
   révision, accords il/elle.
6. Recalcul des notions propres au lycée français (1re, Tle, niveaux 1–3).
Page légale : pas avant une ouverture au-delà des testeurs (décision de l'enseignant).

## En premier le 27.11 (fait le 26.11 à 20 h 45, pas encore testé ni publié)
- Pavé caché par la barre « Vérifier » (constaté par l'enseignant sur téléphone) : `#app:has(.qbar)` (au lieu de `> .qbar`)
  et `ansInView` remonte pour montrer tout le pavé sans faire sortir le champ par le haut.
- Aperçu de la réponse masqué pour un simple nombre (« 12 » apparaissait deux fois) ; gardé pour un calcul (3*7/4).
- Tests : kp.html, kp_stable.html, ergo.html, ux_2111*.html, entete_360.html, puis publier.
- Reste de la revue ergonomie/technique du soir : pavé 1–4 pour les choix, « Plus tard » / « Non » du bandeau
  statistiques, « Réessayer » / « On le fait ensemble », aria-live et prefers-reduced-motion, « Nouvelle version prête »,
  journal d'erreurs (avec accord), test de migration d'anciens profils, poids de la page.

## Présentation PDF (retour de l'enseignant, 26.11 soir : « globalement top »)
- Retirer « Loulou » (prénom fictif bizarre pour désigner l'enfant, vue parent) : prénom neutre ou « votre enfant ».
- Faire une **version séparée Suisse romande seulement** (sans la partie France), en plus de la version actuelle.
