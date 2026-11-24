# Version parents : accompagner, pas surveiller (proposition du 24.11, à discuter)

Principe : le parent est un **allié** de l'apprentissage, pas un contrôleur. On lui donne de quoi **parler de maths
avec son enfant** et **encourager l'effort**, jamais un relevé de notes minute par minute.

## 0. Piste n° 1 retenue pour la discussion (24.11) : le code de sauvegarde transmis au parent

- Le code de sauvegarde (src/backup.js) contient déjà toute la progression, sans serveur : notions, carnet (avec le
  code exact de chaque question ratée), série, Mathélo, semaine.
- Page parent qui **lit** le code en lecture seule (sans remplacer la progression de l'appareil), en tire la carte
  de la semaine et « Résoudre ensemble » (Engine.fromCode régénère le problème raté à l'identique, avec pas à pas et
  erreur repérée), et garde plusieurs codes (un par enfant) sur l'appareil du parent.
- Bouton « Envoyer à mes parents » côté enfant (partage natif : WhatsApp, SMS) ; date du code affichée.
- Limite : photo du moment, renvoyée par l'enfant (rythme hebdomadaire = rituel de 2 min) ; un suivi automatique
  demandera un serveur.

## 1. Sans compte : la « carte de la semaine » partagée par l'élève (faisable vite)

- C'est l'élève qui décide de partager : bouton « Montrer ma semaine à mes parents » (Progrès). L'app produit un lien
  ou un QR code ; le contenu est **dans le lien lui-même** (fragment #…), rien ne passe par un serveur.
- Le parent ouvre une page simple :
  - **Ce que j'ai travaillé** : 2–3 notions en mots (« les angles des polygones réguliers », pas « polyreg niveau 2 ») ;
  - **Mon effort** : jours de pratique, régularité (« 4 jours sur 7 »), jamais de comparaison avec d'autres ;
  - **Une réussite à fêter** : une notion maîtrisée cette semaine, une erreur du carnet effacée ;
  - **Là où tu peux m'aider** : une notion qui résiste, avec **une question à me poser** (« Demande-moi pourquoi
    l'angle d'un hexagone vaut 120° ») plutôt qu'un score ;
  - **À faire ensemble** : la question curieuse ou l'histoire des maths de la semaine (« Le téléphone à 42 CHF × 24
    mois : qui devine le surcoût ? ») ;
  - **Comment accompagner** : 3 conseils courts (valoriser l'effort, laisser expliquer, ne pas donner la réponse).
- Pas de Mathélo brut, pas de liste d'erreurs, pas d'heures de connexion.

## 1 bis. Le cœur collaboratif : « Résoudre ensemble » (idée de l'enseignant, 24.11)

- Un problème raté par l'enfant (carnet d'erreurs, défi du jour) peut devenir un **problème à résoudre ensemble** :
  l'enfant l'envoie (ou il apparaît dans la carte de la semaine : « Un problème qui m'a résisté »).
- Le parent reçoit un **guide d'accompagnement**, pas la réponse d'abord :
  1. l'énoncé, avec la figure ;
  2. « Commencez par lui demander… » : 2–3 questions ouvertes (« Qu'est-ce qu'on cherche ? Qu'est-ce qu'on sait ? ») ;
  3. les étapes du pas à pas en **indices dévoilables un par un** (le parent aide sans faire à la place) ;
  4. l'erreur typique repérée par l'app, expliquée simplement (« Il a peut-être pris l'angle extérieur… ») ;
  5. la solution complète, repliée, pour le parent seulement s'il en a besoin ;
  6. « Rappel de cours » en mots simples, pour le parent qui a oublié.
- Ensuite l'enfant **refait le problème dans l'app** (avec de nouvelles valeurs) : la réussite efface l'erreur du carnet
  et peut s'afficher côté parent (« Problème réussi ensemble ✓ »).
- Variante ludique : « défi famille » — la question curieuse de la semaine, chacun parie, puis on calcule ensemble.

## 1 ter. Plusieurs enfants

- Sans compte : la page parent garde **sur l'appareil du parent** les cartes reçues de chaque enfant (prénom choisi par
  l'enfant ou surnom, jamais transmis à un serveur). Chaque enfant a sa colonne : semaine, problème à résoudre ensemble.
- Avec le palier payant (plus tard) : un parent relie plusieurs enfants par code d'appairage ; même contenu, mis à jour
  automatiquement.

## 1 quater. Le parent moteur (constat de l'enseignant, 24.11 : « c'est souvent le parent qui va pousser l'enfant »)

- Le parent est souvent le **prescripteur** (il découvre l'app, l'installe, relance) et le **payeur** : il faut une
  porte d'entrée « Je suis parent » (ce que ça apporte en 30 s, installation sur le téléphone de l'enfant, page parent).
- **Mise en route à deux** : classe, chapitre en cours, date du prochain test, choisis ensemble.
- **Pousser sans fliquer** : « contrat de la semaine » décidé ensemble (ex. 4 séances de 5 min, préparer le test de
  vendredi) ; le parent voit l'effort tenu, pas les notes ; messages d'encouragement du parent visibles dans l'app
  de l'enfant ; relances douces côté parent (« proposez-lui le défi du jour ensemble ? »).
- **Valeur pour le parent** : rassurer (où en est-il par rapport au chapitre et au test), outiller (Résoudre ensemble),
  créer un moment partagé (défi famille, question curieuse).
- **Garde-fous** : transparence totale pour l'enfant (il voit ce que voit le parent), pas de comparaison entre
  enfants, pas de démarchage des familles de ses propres élèves, accord écrit de l'employeur avant tout palier payant.
- **Point dur** : le lien parent-enfant sans compte ; partage par lien pour un prototype, appairage (serveur) pour un
  suivi régulier — lié au choix du remplaçant de Google Sheets.
- **Constat** : peu d'élèves viendront d'eux-mêmes, à part les passionnés. Trois moteurs extérieurs : le parent, l'enseignant
  (mode « En classe », devoirs, lien avec le chapitre — vrai test : 11LS), puis l'habitude (série, défi du jour), qui
  ne prend que si l'un des deux premiers a lancé le mouvement.
- **Effort minimal pour le parent** : un rituel de 2 min par semaine (lire la carte, encourager en un geste, éventuellement
  un problème à résoudre ensemble) ; une seule relance quand l'enfant décroche ; mise en route faite une fois.
- **Prochaine étape** : séance de conception avec l'enseignant avant d'écrire du code.

## 2. Plus tard (palier payant éventuel) : suivi régulier avec lien parent-enfant

- Rapport hebdomadaire automatique (mail ou page) : demande un **lien parent-enfant** consenti par les deux (code
  d'appairage), donc un service serveur et une politique de confidentialité adaptée (voir tools/confidentialite.md).
- Toujours le même ton : effort, progrès, piste d'aide, activité à faire ensemble ; l'élève voit exactement ce que
  voit le parent.
- Plusieurs enfants, historique des semaines, rappels doux (« pas de séance depuis 5 jours : proposez-lui le défi
  du jour ensemble ? ») — jamais d'alerte culpabilisante.

## 3. Décisions à prendre (enseignant)

- Commencer par la carte partagée (sans compte, sans serveur) : 1–2 jours de travail ; d'accord ?
- Le palier payant suppose l'accord écrit de l'employeur et le choix du service de données (voir la note de synthèse).
- Vocabulaire : « Montrer ma semaine » / « Ma semaine en famille » / autre ?
