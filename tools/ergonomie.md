# Ergonomie de l'app sur téléphone (audit du 24.11)

Chantier « Ergonomie app – développement ». Public : élèves de 13 à 19 ans, écran de 360 à 400 px.

## Méthode

- Sonde `tests/_ergo.html#<écran>` (non commitée, comme les autres `tests/_*`) : l'app complète (tous les fichiers de
  `build.py`, vraies polices, vrai MathJax), un élève de 11e créé par `Engine.newState`, puis des clics simulés
  (`#q`, `#q_wrong`, `#q_corr`, `#q_steps`, `#bilan`, `#prog`, `#carnet_plein`, `#reglages`, `#fab`…).
  Suffixes : `-dark` (thème sombre), `-s<n>` (autre tirage ; le hasard est fixé pour que les captures se refassent à l'identique).
- Captures `chromium --headless --window-size=380,800 --screenshot=tests/_cap/<écran>.png` (non commitées, `*.png`
  est ignoré par git) ; captures « après » : `tests/_cap/apres_<écran>.png`.
- Mesures `tests/_ergo_m.html#<écran>` (l'app dans un cadre de 380 px) : débordement horizontal, zones tactiles
  de moins de 44 px, textes de moins de 13 px.

## Constats

Légende : ✅ corrigé dans la branche `agent/ergo` · 💡 proposition à décider (non faite) · ✔️ déjà bien.

### Accueil (home.png, home_libre.png, home_now.png, home_carnet.png, home_resume.png, home_tour.png, home-dark.png)

- ✔️ Les 6 cases, la carte de séance et le Mathélo tiennent sur un écran de 380 × 800 sans défiler, sans débordement, en clair comme en sombre.
- ✅ Case avec une ligne de plus (« Carnet · 2 à effacer ») : les noms de la rangée n'étaient plus alignés (Carnet 9 px plus bas que Mon test et Progrès). `.door { align-content: start }`.
- ✅ Séance interrompue (home_resume.png) : la carte « Reprendre ma séance » était suivie d'un grand bouton « ▶ Encore une séance » et de « séance faite ✓ », alors que la séance n'est pas finie (une seule réponse suffit à compter la journée). Le bouton dit maintenant « ▶ Nouvelle séance » et « séance faite ✓ » n'apparaît pas tant qu'une séance attend d'être reprise.
- ✅ Choix « 🎒 En classe / 🧭 Libre » : 41 px de haut → 44 px (règle `.seg button`, valable partout).
- ✅ Lien « changer » (chapitre en classe) : 37 px → 44 px (règle `.btn-ghost`).
- 💡 « séance faite ✓ » est collé à la fin du texte du format, qui est coupé par « … » sur une ligne (home_resume.png : « Tes notions à revoir aujourd'hui. · séance… ») : l'élève ne le voit presque jamais. Proposition : le mettre dans le grand bouton (« ▶ Encore une séance ✓ ») ou dans une coche à côté du titre du format.
- 💡 Bouton 🔁 (changer de format) : sous 380 px, il n'a plus que l'icône (libellé « Changer » masqué). Un élève ne devine pas qu'il change le programme du jour. Proposition : garder « Changer » visible (la place existe à 380 px) ou une icône plus parlante.
- 💡 Pastille de série « ✏️ 0 j » : cryptique pour un nouvel élève (0 quoi ?). Proposition : « 0 jour » ou masquer la pastille tant que la série est à 0.
- 💡 Bandeau Mathélo : « Stratège dans 75 pts » en 11 px, seul texte de l'accueil sous 12 px.

### Séance : question, clavier, correction (q.png, q_lesson.png, q_mp.png, q_wrong.png, q_corr.png, q_ok.png, q_steps.png, q_rappel.png, q_brouillon.png, q_prob.png)

- ✅ Titre doublé : « 🧠 Révision · 1 sur 4 · 🧠 Révision », « ⚡ Série d'automatismes · 1 sur 8 · ⚡ Automatisme », « 🏔 Défi du jour · 🏔 Défi ». Le type de question n'est plus ajouté quand toute la séance est de ce type (il reste dans « Mixte » et pour « 🧱 Une base à consolider »).
- ✅ **Indice invisible après une erreur** (q_wrong.png) : « Pas encore. Réessaie ! » et l'indice s'affichaient sous le clavier et les boutons, hors de l'écran ; l'élève voyait seulement sa réponse resélectionnée. L'app défile maintenant juste assez pour montrer l'indice (aussi pour « Je n'arrive pas à lire ta réponse » et pour les indices des problèmes en plusieurs parties). Fonction `fbInView` dans `src/app.js`.
- ✅ Clavier à 7 colonnes (q_mp.png) : les chiffres, les touches les plus utilisées, faisaient 36 px de large contre 52 px pour « / fraction » ou « ^ puissance » (colonnes calées sur la largeur des légendes). Colonnes égales (`minmax(0, 1fr)`), légendes un peu plus grandes (0,62 rem).
- ✅ Zones tactiles sous 44 px : « ✏️ Brouillon » (37), « 📖 Rappel de cours » (30), « Pas encore vu en classe » (37), « Voir directement la correction » (21), « 💬 Un commentaire sur cette question ? » (28), « Afficher ma réponse » (35), 👍 / 👎 (36). Tous à 44 px.
- 💡 **« Valider » sous le premier écran** quand la question a une figure (q.png : énoncé + figure + brouillon + rappel + champ + clavier = « Valider » vers 1 000 px sur un écran de 800). L'élève tape au clavier puis doit défiler pour valider. Pistes : bouton « Valider » dans la dernière rangée du clavier (à la place de « ⌨ » qui sert peu sur téléphone), ou barre « Valider · Je ne sais pas » collée en bas de l'écran pendant la saisie.
- 💡 Pas de sortie visible avant la première réponse : « Terminer ici » n'apparaît qu'après une question répondue ; avant, seul le nom de l'app ramène à l'accueil (et le bouton retour du téléphone). Proposition : un petit « ✕ » ou « ← Accueil » discret en haut, avec la même confirmation.
- 💡 « Je ne sais pas » coûte autant de Mathélo qu'une mauvaise réponse (q_ok.png : −28). Cohérent avec le calcul, mais décourage l'honnêteté ; à décider (pédagogie, pas ergonomie).
- 💡 Brouillon ouvert (q_brouillon.png) : « Cacher le brouillon » au-dessus et « Fermer » en dessous font la même chose. Garder un seul des deux.
- ✔️ Problèmes en plusieurs parties (q_prob.png, q_corr.png) : le clavier suit la partie active, bien. Mais l'écran est très long (≈ 1 250 px) ; voir la proposition « Valider » ci-dessus.
- ✔️ Pas à pas (q_steps.png) : énoncé gardé en haut, étapes avec leur clavier, « Afficher ma réponse » : clair.

### Leçon active et rappel (lecon.png, lecon_active.png, q_rappel.png)

- ✅ Pastilles de réponse du « Devine » (15 / 5 / 23) : 40 × 41 px → 44 px de haut (règle `.seg button`).
- ✔️ Le rappel de cours s'ouvre dans la question, avec la leçon active dedans : lisible à 380 px.

### Bilan de séance (bilan.png, bilan-dark.png)

- 💡 Long (≈ 930 px et plus avec un nouveau grade, le carnet, l'installation) ; « Retour à l'accueil » est tout en bas, sous le bonus et le commentaire. Proposition : mettre le bouton « Retour à l'accueil » juste après le score, ou ajouter « ← Accueil » en haut.
- ✅ Résumé « Une remarque sur l'application ? » : 42 → 44 px.

### Pages ouvertes par les cases (prob.png, test.png, carnet.png, carnet_plein.png, prog.png)

- ✔️ « ← Accueil » en haut de chaque page, titre de la page : cohérent.
- ✅ Carnet d'erreurs : titre « Carnet d'erreurs » puis surtitre « 📕 CARNET D'ERREURS » juste en dessous ; le surtitre est masqué sur cette page.
- 💡 Progrès, « Ma carte de progression » : 105 cases de 17 × 17 px à toucher pour lire le nom de la notion (prog.png). Au doigt, on touche souvent la voisine. Proposition : toucher le thème ouvre la liste de ses notions, ou cases de 24 px.
- 💡 Problème de la semaine : surtitre « 🔍 Problème de la semaine » sous le titre identique (il porte « · fait ✓ », donc pas masqué) ; on pourrait déplacer « fait ✓ » dans le bouton.

### Curieux, Histoire, Réglages, Mes grades, Mes compétences (cur.png, hist.png, reglages.png, grades.png, comps.png)

- ✅ Leur « Retour » n'était qu'en bas de page : après l'échelle des 12 grades, toute l'histoire avec son clavier, la liste des badges et des compétences, tous les réglages. Ajout d'un « ← Retour » en haut, même style que le « ← Accueil » des pages de l'accueil (le bouton du bas reste).
- ✅ Curieux : « Voir la réponse » en bouton discret (bleu sans cadre) alors que le même bouton est un bouton bleu clair dans Histoire et « Je ne sais pas » dans les questions : harmonisé en bouton bleu clair.
- 💡 Retour : « ← Accueil » (pages de l'accueil), « ← Retour », « Retour » (bouton plein), « Annuler » : à unifier quand on reprendra les écrans (un seul « ← » en haut partout, bouton du bas seulement si l'écran est long).
- 💡 Réglages : « Tout effacer » est juste au-dessus de « Retour » (la confirmation en deux temps protège). Le placer plus loin ou dans une section « Zone sensible ».

### Je prépare un test (prep.png)

- ✅ La page fait 4 400 px en 11e (52 notions) et « Enregistrer mon test » était tout en bas ; le message « Coche au moins une notion » aussi, hors de l'écran. Le bouton et le message restent maintenant collés en bas de l'écran pendant le défilement (idem « C'est ça » du choix du chapitre en classe).

- 💡 « Supprimer ce test » efface le test sans confirmation, à côté de « Annuler ». Proposition : demander « Supprimer ce test et son programme ? ».
- ✔️ Liste de notions cochable sur toute la ligne.

### Fenêtre 💬 (fab.png, q_fab.png)

- ✅ « À propos de : cette question / l'application en général » : boutons radio de 13 px, libellés sur une même ligne → un choix par ligne, rond de 20 px, toute la ligne se touche.
- ✔️ La fenêtre s'ouvre sous l'en-tête et ne cache pas le bouton 💬 ; la croix reste en haut à droite.
- 💡 Pas de voile derrière la fenêtre : toucher la page à côté ne la ferme pas, et on peut écrire dans la question en dessous. Proposition : fermer la fenêtre en touchant à côté.

### Thème sombre (home-dark.png, q_corr-dark.png, q_ok-dark.png, bilan-dark.png, prog-dark.png, lecon_active-dark.png)

- ✔️ Pas de texte illisible repéré : aplats bleus avec encre foncée, figures lisibles, marge rouge adoucie.

### Entrée (welcome.png, level.png)

- ✔️ Exemple jouable, choix de classe en pastilles (maintenant 44 px). Le lien « ce que l'app envoie » (écran d'accueil) est un lien dans le texte (21 px de haut) : écran de l'autre chantier (confidentialité), pas touché.

## Revue d'un testeur (reçue par l'enseignant, 24.11 soir)

Déjà fait sur master avant cet audit (pas refait ici) : visite guidée non bloquante, identifiants de question masqués hors mode auteur, carnet alimenté par le calibrage, « Encore une séance » après une séance courte, piège angle extérieur (polyreg).

| # | Demande | Suite donnée |
|---|---|---|
| 1 | Corrigés progressifs après une erreur | ✅ (soir) la 1re étape du corrigé s'affiche d'office, sans rien replier, puis « Voir l'étape suivante (2 sur 4) » dévoile les autres (`solStepper`, réutilise `splitSol`) ; « Voir directement la correction » reste. Aussi pour les problèmes en plusieurs parties (corrigé jusque-là d'un seul tenant). Avant : après la 2e erreur (ou « Je ne sais pas »), « 🪜 Voir la correction étape par étape » / « On le fait ensemble », énoncé gardé au-dessus, le reste replié (q_steps.png) ; correction d'un seul tenant seulement quand elle n'a qu'une étape. ✅ L'indice de la 1re erreur est maintenant ramené à l'écran (voir plus haut). |
| 2 | Défis à plusieurs parties : écran long | ✅ « 📌 Énoncé » collé en haut dès que l'énoncé sort de l'écran (2 lignes ; toucher = tout lire, max 42 % de l'écran ; disparaît quand la carte du problème n'est plus visible) : `bindRecap`, `.qrecap`. Le passage partie par partie (a, puis b) reste une option, non faite (change le déroulé). |
| 3 | Champ visible quand le clavier est ouvert (360 × 640) | ✅ Clavier de l'app : au toucher du champ, l'écran défile pour montrer d'un coup champ + clavier + « Valider » ; à chaque touche, le champ revient s'il est sorti de l'écran (aussi sous le rappel d'énoncé des problèmes) : `ansInView`. Clavier du téléphone (⌨) : quand la zone visible rétrécit et que le champ passe dessous, il est recentré (`visualViewport`, `src/app.js`). À vérifier sur un vrai téléphone (le navigateur sans interface n'ouvre pas de clavier). |
| 4 | « Mathélo », noms des grades | ✅ Phrase d'explication en haut de « Mes grades » (ouvert en touchant le bandeau Mathélo) ; bulle de la visite guidée complétée (score, un grade tous les 75 points, exemples) ; pour qui a passé la visite avant cette bulle : petite carte unique sous le bandeau (« Mathélo = ton score… tu es 🌱 Pousse, le prochain est ✏️ Apprenti » · Compris · Voir tous les grades), dans l'emplacement des cartes de rappel (pas une case). `state.eloSeen`. |
| 5 | En classe / Libre : une phrase claire | ✅ Une phrase sous chacun des deux boutons (celle du mode choisi en encre normale) au lieu d'une seule phrase qui changeait. |
| 6 | Bilan : objectif concret pour demain | ✅ « 🎯 Objectif pour demain : encore N points avant ♟️ Stratège · consolider <notion> » (notion ratée dans la séance, sinon la dernière du carnet). Ancienne formulation : « 🎯 Prochain objectif : encore N points avant ♟️ Stratège · à consolider : <notion> » dans la carte de série du bilan. |
| 7 | Calibrage : durée estimée | ✅ « Étape 2 sur 2 · question 1 sur 5 · encore 4 après celle-ci · environ 3 min » (30 s par question). |
| 8 | Contrastes (WCAG AA) | ✅ (soir) vert un peu foncé (`--ok` #14714a : vert sur vert clair 4,69 → 5,29) ; case « ~ » de l'autoévaluation (#a86400 + blanc, 4,68, et règle sombre qui ignorait le thème forcé) → variables `--warn`/`--on-ok` ; grades à venir et légendes du clavier rendus pâles par l'opacité (2,6:1) → encre secondaire (5,7 / 6,8). Calculés pour les deux thèmes : « Presque » / avertissements (orangé sur crème) 4,98 en clair, 7,51 en sombre ; vert 4,69 / 7,09 ; rouge 4,97 / 6,77 ; bleu clair 5,2 / 5,48 ; textes gris 5,1 à 5,7 / 5,6 à 7,4 ; blanc sur bleu 6,16 ; blanc sur rouge 4,72. Tout passe AA (4,5) ; le vert clair (4,69) et le rouge de la marge (4,72) sont les plus justes. |
| 9 | Police plus lisible découvrable | ✅ À la 1re question du calibrage, petit bouton « Aa Lettres difficiles à lire ? Police plus lisible » (bascule immédiate, réglage gardé, modifiable ensuite dans ⚙️). |

### À décider (propositions de la revue)

- **Un seul bouton principal sur l'accueil** (densité) : aujourd'hui le grand « ▶ Ma séance du jour » coexiste avec « Choisir mon chapitre » et 🔁 dans la même carte. Piste : replier « format » et « chapitre » dans une ligne « Aujourd'hui : Révision · Thalès ✎ ».
- **Rappel quotidien facultatif** (notifications, app installée) : à réserver à l'app installée (sur iPhone, les notifications web n'existent que pour l'app ajoutée à l'écran d'accueil), une heure choisie par l'élève, proposé seulement après 3 jours de pratique, désactivable d'un toucher. Sans serveur d'envoi, la seule voie fiable est la notification planifiée par le service worker au moment de l'ouverture (« demain à 17 h ») : pas de notification si l'app n'a pas été ouverte la veille, ce qui est acceptable pour un rappel de série. Texte court et non culpabilisant (« 5 minutes de maths ? Ta série est à 4 jours »). À décider aussi côté confidentialité (rien d'envoyé, tout reste sur le téléphone).
- **Écran « Pour mes parents »** : voir `tools/parents.md` (branche `agent/parents`). Côté ergonomie : l'ouvrir depuis Réglages ou Progrès, jamais une case de plus sur l'accueil ; une page lisible sans connaître l'app (Mathélo et grades expliqués en une phrase, jours de pratique, notions solides / à revoir), partageable par une capture d'écran.

## Corrections faites (branche `agent/ergo`)

| Fichier | Correction |
|---|---|
| `src/app.js` | titre de question sans doublon du type ; objectif du bilan (`sumGoal`) ; durée du calibrage et police lisible proposée ; phrase sous En classe / Libre ; Mathélo expliqué dans Mes grades ; champ recentré quand le clavier du téléphone s'ouvre ; indice ramené à l'écran après une erreur (`fbInView`) ; « Nouvelle séance » quand une séance attend d'être reprise ; « ← Retour » en haut de Mes grades, Réglages, Mes compétences, Curieux, Histoire (`backTop`) ; « Voir la réponse » harmonisé (Curieux) |
| `src/style.css` | section « Ergonomie téléphone » : cases alignées, zones tactiles ≥ 44 px (`.btn-ghost`, `.seg button`, résumés repliables), clavier à colonnes égales, surtitre du carnet masqué, choix de la fenêtre 💬, 👍/👎 et icônes de grade à 44 px, bouton « Enregistrer » et message d'erreur collés en bas des longues listes (Je prépare un test : 4 400 px en 11e ; chapitre en classe) |

Aucun changement de fonctionnement ; rien ajouté à l'accueil hormis la deuxième phrase sous En classe / Libre (demande de la revue).

## Propositions à soumettre (non faites)

Par ordre d'intérêt pour un élève sur téléphone :

1. **« Valider » toujours à portée** pendant la saisie (dans le clavier ou barre collée en bas).
2. **Sortie visible en séance** dès la première question (« ✕ » discret avec confirmation).
3. **Retours unifiés** : un seul « ← » en haut de chaque écran ; « Retour à l'accueil » du bilan remonté après le score.
4. **Carte de progression** utilisable au doigt (liste par thème ou cases plus grandes).
5. **Libellés** : pastille de série « 0 j », bouton 🔁 sans texte, « séance faite ✓ » coupé, « Supprimer ce test » sans confirmation.
6. Brouillon : un seul bouton pour le fermer ; fenêtre 💬 qui se ferme en touchant à côté.
7. « Je ne sais pas » moins pénalisé que la mauvaise réponse (question pédagogique).

## Points à contrôler

Ajouts du 24.11 soir (captures `tests/_cap/soir_*.png`, sonde `_ergo.html#q_prob_recap`, `#q_prob_bas`, `#q_prob_corr`, `#home_elo`) :

- Corrigé progressif : la 1re étape d'office convient-elle, ou préfère-t-on que l'élève la demande (ancien bouton) ? Le découpage vient de `splitSol` : vérifier quelques corrigés coupés à un endroit bizarre.
- Rappel « 📌 Énoncé » des problèmes : sur un vrai téléphone, pendant la saisie de b) et c) ; il laisse la place du bouton 💬 à droite.
- Défilement automatique au toucher du champ (`ansInView`) : ne doit pas faire « sauter » l'écran quand la question a une grande figure (il ne défile que si champ + clavier + Valider tiennent dans l'écran).
- Carte « Mathélo = ton score de maths » : apparaît une fois aux élèves qui avaient déjà passé la visite guidée (y compris les testeurs actuels), puis plus jamais.
- Vert un peu plus foncé (`--ok`) : à regarder sur l'accueil et les corrections justes.

- Une vraie séance sur téléphone : après une erreur, l'indice apparaît-il sans faire disparaître le champ de réponse ?
- Clavier à 7 colonnes (secondaire II) : les légendes « fraction », « puissance » sous les touches restent lisibles à 360 px.
- Les boutons discrets passés à 44 px de haut (« Passer » de la visite, « changer », « Abandonner ») : la mise en page reste aérée sans paraître lourde.
