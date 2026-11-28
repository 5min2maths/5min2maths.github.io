# /app animations (28.11)

Décision de l'enseignant (28.11) : « d'autres animations dans l'app, pas trop, juste pour dynamiser », n° 1 à 5 validés.
Branche `agent/app2` (worktree `../5min2maths-wt/app2`), fichiers : `src/app.js`, `src/style.css` (engine.js non touché).

| n° | Animation | Où | Durée |
|---|---|---|---|
| 1 | Petite pépite (LOGO_NUGGET) + « +N » (pépites gagnées pour CETTE question, plafond compris) qui part de la zone de réponse ; vers le compteur de pépites s'il est à l'écran, sinon vers le haut, et s'efface | `nugFly` (renderQuestion, renderProblem), `.nugfly` | 0,45 s |
| 2 | « +N pépites » du bilan qui défile 0 → N | `ypCount`, `.yp-cnt.cnt` (compteur CSS `@property --ypc`) | 0,6 s |
| 3 | Éclat doré qui balaie le message « ✨ Polie ! … » | `toast(msg, ms, "shine")`, `.toast.shine::after` | 0,45 s (départ 0,12 s) |
| 4 | Flamme 🔥 qui grossit quand le filon augmente : carte du bilan, puis une fois dans la pastille de l'en-tête de l'accueil | `session.filonUp`, `flameChip`, `.flame-up` | 0,45 s (départ 0,2 s) |
| 5 | Barre de séance qui se remplit en glissant : à la réponse (jusqu'à la largeur « après »), puis d'un écran au suivant ; jamais à reculons (« Refaire ») | `seanceBar` (appelée par `h()`), `seanceBarDone`, transition `.pbar i` | 0,45 s |

Règles tenues : aucune attente (`pointer-events: none`, rien n'est désactivé, « Continuer » utilisable tout de suite) ;
éléments décoratifs `aria-hidden` ; le texte réel ne change pas (le bilan garde « +N pépites » dans le DOM, le chiffre
qui défile est un compteur CSS) ; rien si « réduire les animations » (système ; l'app n'a pas de réglage propre) ;
couleurs `--gold-*` (mode sombre) ; 360 px. Pas de tremblement sur une erreur.

Au passage : le message éphémère (toast) partait de la droite puis sautait au centre (l'animation `.pop` remplaçait le
`transform: translateX(-50%)`) : centrage par la propriété `translate`.

À noter pour l'enseignant : la gerbe de symboles existante (`burst`, 0,9 s) part toujours à chaque bonne réponse ; la
pépite s'ajoute par-dessus (visible sur le GIF n° 1). Si c'est trop, on peut retirer la gerbe des réponses justes et la
garder pour les grades et badges.

GIF (à valider) : `tests/_shots/app/animations/` — `1_pepite_envol(_sombre).gif`, `2_bilan_defilement(_sombre).gif`,
`3_pepite_polie.gif`, `4_filon_bilan.gif`, `4_filon_entete.gif`, `5_barre_seance.gif`. Régénérer :
`~/.venvs/cfpt/bin/python tests/_gif_animations.py` (images figées par `tests/_probe_anim.html`, document.getAnimations()).

Tests : nouvelle section `animations` de `tests/interface.html` (pépite « +N » décorative et non bloquante, barre à la
largeur « après », pas de recul, rien en mouvement réduit, éclat sur « Polie », bilan au texte intact, flamme au bilan
et une seule fois dans l'en-tête, pas d'animation sur une erreur).

## Ajout (28.11) : mini-pépite à la place de l'emoji 🟡

Demande de l'enseignant : la « monnaie » pépite était l'emoji 🟡. Remplacée par une mini-pépite dessinée, une seule
constante `NUG_IC` (`src/curriculum.js`) : forme du logo simplifiée pour 16 px, sans `<defs>` ni id (répétable dans une
page), aplat doré, contour brun, facettes, étincelle ; `aria-hidden` ; `.nug-ic` (hauteur 0,9 em, sur la ligne de base).
6 endroits : Mes grades (`yp-gems`), en-tête « Chercheur dans N », reprise d'une sauvegarde, 2 lignes « Pépites » du
bilan, page parents (`src/parents.js`), présentation (`src/presente.js`). La pépite qui s'envole utilise la même icône.
Captures avant / après (clair, sombre) : `tests/_shots/app/animations/icone_avant_apres_{home,grades,count}.png`.
Test du grade « Chercheur dans 100 🟡 » (interface, ux_2111) adapté ; contrôles ajoutés dans la section `animations`.

Vérification : pages interface (section animations comprise), presente, fumee, ecrans, seance : vertes ; test_nom ok ;
suite rapide : 43 pages vertes ; `poids.py ordre` en échec seulement parce que le docs/ suivi (10 h 14) est plus ancien
que les générateurs de master (12 h 17, notions uvol, prop, pct…, sans rapport) : après `build.py` local (non commité,
docs/ restauré), 0 échec.

## Retours de l'enseignant sur les GIF (28.11)

- « Parasite bleu » sur le bilan = la gerbe de symboles `burst()` (π √ ∞ empilés au départ). Remplacée par des
  **étincelles dorées ✦** (--gold / --gold-deep, tailles variées, ≈ 0,8 s, aria-hidden, rien en mouvement réduit), en
  éventail depuis la carte concernée, ou autour du titre du bilan quand la carte est sous le pli (cas courant à 360 × 640).
  Réservées aux **grands moments** : nouveau grade, nouveau badge, « Ton niveau monte ! » (`bigMoment`). Plus de gerbe à
  chaque bonne réponse ; `burst()` sans carte (leçons actives, QCM, sujet, exercices riches : src/active.js, qcm.js,
  sujet.js, riche_11c.js, non modifiés) ne fait plus rien.
- « Je n'ai pas vu la pépite qui s'envole » : pépite 46 × 30 px, « +N » 1,4 rem en gras doré cerclé (--gold-ink sur
  --gold-soft), « pop » 0,6 → 1,15 → 1, montée en légère courbe et fondu, **0,7 s** ; GIF n° 1 à 35 ms par image (23 images).
- Nouveaux GIF : `2_bilan_badge.gif`, `6_grand_moment_grade.gif` ; tous dans `voir_animations.html`.
