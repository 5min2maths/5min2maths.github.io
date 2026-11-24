# À contrôler — 25.11 (travail de la nuit)

Tout ce qui est marqué « publié » est en ligne (fermer et rouvrir l'app). Mode auteur : …/#auteur.

## En ligne depuis hier soir

- Accueil « Séance d'abord » (bouton en premier, format en une ligne, En classe / Libre en petit interrupteur avec ⓘ).
- Espace parent (prototype) : Progrès → « 👪 Envoyer à mes parents » ; page parent en lecture seule, « Résoudre ensemble »,
  plusieurs enfants (tools/parents.md). À trancher : vocabulaire, 1 ou 3 problèmes, écriture inclusive, bouton 💬 côté parent.
- Statistiques seulement avec accord (option A) ; polices et MathJax hébergés ; mentions légales en projet (13 champs).
- Messages ciblés : 99,6 % des questions numériques ont au moins un piège (tools/pieges.md) — relire les messages d'optim.
- Ergonomie : corrigé étape par étape (1re étape affichée d'office : OK ?), rappel d'énoncé collé en haut, champ visible.

## Audits de niveau (agents robustesse, /audit-niveau)

Registre : tools/niveau.json ; colonne « Audit de niveau » du suivi.

### 3e et 4e Collège — fait, publié (tools/niveau_34c.md)

- Au niveau : la plupart des notions. Remontées (niveau 1) : tauxvar, variations, optimderiv, combi, probaxiomes,
  probarbre, croissance, translin. Nouvelle notion `statdesc` (4.PS.01) ; `stats` et `quartiles` retirées de la 4e
  (niveau CO), gardées pour la MP.
- Étalons : épreuves Sismondi 2023-24 (3MA1, 3MA2, 4MA1, 4MA2), écrits de maturité 2013–2014.
- À trancher :
  1. Renforcé MA2 montré à tous (derivseconde, colin, intparties, intsubst, eqdiff) : il faut un champ normal / renforcé.
  2. Retirer stats / quartiles de la 4e au profit de statdesc : d'accord ?
  3. Remonter aussi probaxiomes N2, vect3d N3, croissance N3 ?
  4. Loi normale : les épreuves utilisent la table ; l'app reste sur 68-95-99,7.
  5. derivcomp : ajouter des formes d'épreuve (sin²(7x), quotient à simplifier) ?

### 1re Collège — fait (tools/niveau_1c.md)

- **Argumenter refait** : 4 notions de 1re (src/ch1c_arg.js) : tradalg (traduire en algèbre), contrex (conjecture et
  contre-exemple), demoalg (démonstration algébrique, divisibilité, √d irrationnel), implication (réciproque,
  contraposée, négation). divcrit et tradexpr deviennent des prérequis.
- Retirées du programme de 1re (restent révision CO) : rac, racenc, pct, scicalc, divcrit, tradexpr.
  Ajoutées à « 1. Nombres » : racprop, ratden, fracper (niveau 3 minimum).
- **Notions du CO partagées remontées au Collège** (grade ≥ 12, voie gymnasiale) : niveau 1 → questions de niveau 2,
  niveau 2 → niveau 3, pour 30 notions (eq1, distrib, pyth, thales, factor…) ; le CO et la MP ne changent pas.
- Étalons : programme du Collège 2021 (p. 80–83), PEC 2024, épreuves communes Sismondi 1MA2 (déc.) et 1MA1 (juin),
  Sésamath Ma1, cours de logique d'un collègue (Collegues/Friedli).
- À trancher : portée de la remontée (aussi en révision 2e–4e ?) ; ineqfrac en 1re ou en 2e ; négation et preuve
  par l'absurde (cours MA2) acceptables en MA1 ? ; notions manquantes : longueur d'arc et secteur, milieu / distance /
  pente (Ma1 ch. 4 et 9).

### 2e Collège — fait (tools/niveau_2c.md)

- Notion manquante créée : **ineqpoly** (inéquations par tableau des signes). ineq et trigrel (1re) ne comptent plus
  comme notions de 2e.
- Remontées : cart, droites N1, polyexpr N3, modexp (N1–N3 étaient de niveau 11e), recip N3, compo N3, vecteurs N3 ;
  formes de niveau 3 ajoutées : trigeq, absval, polydiv.
- Étalons : épreuves regroupées Sismondi 2MA1 (11.12.2023) et 2MA2 (10.06.2024), brochure 2MA, Sésamath Ma2.
- **Découverte** : les générateurs de trigonométrie et de droites de 2e sont ceux de la MP (ch_mp2.js, « méthodes
  guidées, nombres simples ») et l'app travaille en degrés alors que les épreuves de 2e sont en radians.
- À trancher : chapitre « Raisonner en géométrie » (vide, hors programme officiel) ; passer la trigonométrie du
  Collège en radians ; séparer les générateurs Collège et MP.

### 11e — fait (tools/niveau_11.md)

- Au niveau : la plupart des chapitres ; banques riches de proportionnalité et de calcul littéral au niveau des dossiers 11LS.
- Corrigé : en 11e, le niveau 1 de 26 notions de 9e–10e prend les questions du niveau 2 (liste UP11) ; racprop au
  niveau du test 1.2 (√968, ∛−72'000, sommes de 3 termes) ; reduire N3 (fractions à numérateur binôme, dossier Ex. 17) ;
  idrem N3 (a√m − b√n)(a√m + b√n) (Ex. 20) ; angles N1 (alternes-externes au lieu de « autour d'un point ») ;
  automatismes des sujets de préparation de 11e au moins au niveau 2.
- À trancher : remontée du niveau 1 en 11e (d'accord ?) ; rac et carres encore utiles en 11e ? ; eq2disc dès l'année
  (plan LS, hors EVACOM) ? ; ∜1250 du test 1.2 au programme ? ; manquent : nommer un solide d'après son patron,
  expressions équivalentes. **À relire avant l'ouverture à la 11LS** (colonne Contrôlé).

### Tes 3 commentaires d'hier soir (agent en cours)

- fracmul-3-3an (valeurs mal choisies), clavier qui « saute » après la 1re touche, ensemble vide (touche ∅).
### MP 3e–4e — en cours (agent)
