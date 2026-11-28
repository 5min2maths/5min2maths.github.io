# /app présentations (28.11, après-midi) : pépites = seul score, captures de l'app actuelle

Consigne : « les présentations PDF, faut pas trop en faire » → strict minimum, pas de nouvelle page ni de décor.
Base : master du 28.11 (Pépite² écrans publiés : portes en couleur, « Réussies 3 / 4 », pépites, À polir, Mes grades
sans Mathélo, carte « Mon niveau », figures).

## Pages de l'app (src/presente.js)

Décision du 28.11 : les pépites sont le seul score à poursuivre ; le Mathélo est un indicateur de niveau, visible
seulement dans Mon trésor (carte « Mon niveau », paliers en mots).
- #decouvrir, « Ta pépite du jour » : « Pépites = ton travail de l'année, Mathélo = ton niveau » (deux compteurs
  côte à côte) → « Chaque réussite te rapporte des pépites : ton travail de l'année, elles ne se perdent jamais. Ton
  niveau, lui, se lit en mots dans Mon trésor. » Le mot Mathélo n'apparaît plus sur la page élèves.
- #parents : « ni notes, ni Mathélo (son niveau) » → « ni notes, ni niveau » (la page parent réelle ne montre pas le
  niveau, c'est cohérent).
- #enseignants : « deux repères pour l'élève » → les pépites sont le seul score de l'élève, son niveau est dit en mots
  dans Mon trésor ; « Quatre niveaux par notion » : « Le niveau de l'élève (son Mathélo) suit ses réponses ».
- tests/presente.html : assertions mises à jour (commentées 28.11 après-midi) ; aucun « Mathélo » sur #decouvrir ni
  #parents.
- src/app.js : un commentaire (écran d'ouverture) citait le slogan en toutes lettres → tools/test_nom.py échouait sur
  master ; reformulé (« le slogan [APP_TAGLINE] »). Aucun changement de code.

## PDF (~/Projets/5min2maths-presentation/, hors git)

- Les 62 captures refaites sur master du 28.11 (docs/ reconstruit dans le worktree, harnais cap.html jamais commité,
  puis docs/ remis à l'état du dépôt). Vérifiées : accueil à portes colorées, bilan « Réussies 3 / 4 » et +28 pépites,
  À polir, Mes grades sans Mathélo, Mon trésor avec la carte « Mon niveau ».
- Texte, seulement ce qui contredisait l'app :
  - p. 22 « Pépites et Mathélo : deux mesures » → « Pépites et niveau » : un seul score à poursuivre (les pépites, qui
    ne se perdent jamais pendant l'année) ; « Mon niveau = un repère » (paliers en mots, évolution sur plusieurs
    semaines ; le Mathélo sert à l'app pour choisir la difficulté). Seconde capture : la carte « Mon niveau » (au lieu
    de « Le Mathélo et l'échelle des grades ») ; sommaire aligné.
  - p. 15 : le problème de la semaine rapporte 30 pépites de plus (et non 10), comme dans l'app.
  - p. 21 : recadrage de la seconde capture sur « Ma carte de progression » (la carte Mon niveau a décalé l'écran).
- Gardé : parents « ni notes ni Mathélo (le niveau) » (exact).
- Version précédente : `archives/2811_matin/` (captures, .typ, PDF) ; dans Dropbox : `archives/*_2811_matin.pdf`.
- Vérifs : verif_pdf.py 0 erreur sur les deux ; complet 36 p., suisse 33 p. relues en image ; la version suisse ne
  contient ni France, ni terminale, ni lycée, ni euro (pdftotext).
- Copiés dans `~/Dropbox/Projets/5min2maths-presentation/`.
