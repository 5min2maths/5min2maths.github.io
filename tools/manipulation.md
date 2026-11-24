# Manipulation : diagnostic et principes (23.11)

Demande de l'enseignant : « la manipulation est un point faible de l'outil, l'améliorer significativement ».
Retours déjà reçus : « les manipulations où on ne fait que toucher des curseurs n'apportent pas grand-chose » (17.11) ;
« Manipule » seulement s'il y a un vrai geste (22.11) ; sur téléphone, la consigne suivante remplaçait l'ancienne sans
qu'on le voie (corrigé le 22.11).

## 1. Inventaire avant le 23.11

Étape 2 des leçons actives (`src/active.js`, `actPrep`) : trois modes. « Manipule » (`play` sans `o.ask`), « Essaie sur la
figure » (réponse tapée qui fait réagir une figure), « À toi : 2 questions » (réponse tapée sans figure).

| Fichier | Leçons | Mécanisme | Verdict |
|---|---|---|---|
| `active.js` | fractout, prio, divcrit, premiers | toucher des parts / des nombres (boutons) | bon : on agit sur l'objet |
| `active.js` | multdiv, arith | compteur ± (rangées, côté du carré) + boutons « saute » | moyen : le compteur ne montre rien que la figure ne montre |
| `active.js` | cercletan | curseur sous la figure | faible : on bouge un curseur, pas T |
| `act_litt11.js` | litelab, valnum, reduire, monomes, distrib, idrem, factor | **7 compteurs ±** (jusqu'à 3 par leçon) | faible : on règle des coefficients en tâtonnant ; les « tuiles » de réduire sont un dessin qu'on recopie avec des compteurs |
| `act_litt11.js` | parenth | toucher les termes pour changer leur signe | bon |
| `act_prop11.js` | utemps, ucomp, vitesse, gquot | compteurs ± (utemps : barre touchable) | moyen : on cherche la bonne valeur en cliquant |
| `act_eq1c.js` | eq1, eqfrac, eqspec | « balance » = boutons d'opérations + compteur k, sans balance dessinée | moyen : bonne idée (même opération des deux côtés), mais rien ne penche |
| `act_eq1c.js` | eq2, eq2fact, eq3, bicarre, eqirr, probeq2, eq2disc, probeq | compteur sur x : on cherche une solution en tâtonnant | faible (deviner au hasard) |
| `act_eq1c.js` | formule | choisir l'étape (boutons) | correct (pas un geste) |
| `act_sys1c.js` | sys2, sysprob, sysgraph, sys3, affzero (+ affine, sysineq) | compteur sur la valeur | faible |
| `act_ch11b.js`, `act_ch11c.js` | fracmul, puiss, rac, simil | compteur (hunt sans réponse) | faible |
| `act_ch11b.js`, `act_ch11c.js`, `act_9a.js`, `act_9b.js`, `act_10a.js`, `act_10b.js`, `act_11d.js`, `act_1c.js`, `act_mp2.js` | ≈ 120 leçons | mode réponse (calcul tapé, figure qui réagit ou coup de pouce) | correct pour du calcul ; pas de manipulation |
| `act_9b.js` | fracrep | curseur | faible |
| `act_manip.js` (18.11) | pyth, affine, fracconv, sysineq | **glisser sur la figure** (poignées aimantées, vérification au lâcher, flèches du clavier) | bon : le seul vrai geste ; brique privée au fichier, poignées seulement (pas de pièces ni de zones) |

Bilan : sur ≈ 160 leçons actives, 4 avaient un vrai geste sur l'objet mathématique, une vingtaine un compteur ±
(ou un curseur) qui fait varier un nombre, le reste est en mode réponse.

### Ce qui marche et ce qui ne marche pas au téléphone (360 px, doigt)

- **Compteurs ±** : cibles de 44 px, fiables, mais le geste (taper « + » cinq fois) n'a aucun lien avec l'idée ; on
  « gagne » en balayant les valeurs.
- **Curseurs `<input type="range">`** : petits au doigt, on rate la valeur exacte, et le curseur est à côté de la figure,
  pas dessus.
- **Glisser (`act_manip.js`)** : `touch-action:none` sur toute la figure — la page ne défile plus quand le doigt est sur la
  figure (gênant pour une grande figure) ; zone de saisie de 36 px ; pas de pièces à déposer ni de « toucher puis cible ».
- **Figures trop petites** : `.fig` plafonnée à 340 px, dessins de 300 unités : les petites tuiles ou unités font 10 px.
- **Clavier** : flèches sur les poignées de `act_manip.js` seulement ; compteurs et boutons accessibles.

## 2. Principes d'une bonne manipulation

1. **Geste direct sur l'objet** : on tire le sommet, la barre, le plateau — pas un curseur à côté.
2. **L'objet réagit en continu** pendant le geste (pas seulement au lâcher).
3. **Le geste rend visible la propriété** : la balance penche si on n'enlève que d'un côté ; les tuiles rouges et bleues
   s'annulent ; ce qui dépasse la ligne comble les trous (moyenne) ; les angles mis bout à bout font un angle plat.
4. **Un but clair**, énoncé avant le geste, vérifié **au lâcher** (on ne gagne pas en balayant).
5. **Retour immédiat** sous la figure : ce qui est faux est dit (« cette case mesure x sur 1 : il y faut une barre x »).
6. **Pas de « deviner en tâtonnant »** : quand on peut balayer toutes les valeurs, l'aide au lâcher explique l'écart
   (« rectangle complet, mais chaque rangée se partage encore »), et une question « à toi, sans la figure » suit le défi.
7. **Alternative sans glisser** : toucher (sélection puis cible), clavier (Tab, flèches, Entrée) ; zones de saisie ≥ 44 px ;
   la page défile si on touche le fond de la figure, pas si on touche un objet.
8. **Là où il n'y a pas de bon geste**, garder le mode réponse (calcul, lecture de figure).

Références de ce qui marche (idées, pas de copie) : manipulables virtuels (tuiles algébriques, barres de fractions, cubes),
balance à deux plateaux pour les équations, droite graduée où l'on étire des flèches, géométrie dynamique (on tire un
sommet, la propriété reste vraie), diagrammes qu'on construit en tirant les barres.

## 3. Bibliothèque `src/manip.js`

- `MANIP.bindDrag(el, svg, {ok, start, move, end, tap, cancel})` : événements pointeur (souris, doigt, stylet), capture,
  seuil de 4 px (6 au doigt) entre toucher et glisser, `touchstart` non passif sur l'objet seulement (la page défile si on
  touche le fond, `touch-action: pan-y` sur la figure).
- Contraintes `MANIP.C` : `grid` (aimantation sur une grille), `segment` (sur une droite, pas 1/n), `circle` (sur un cercle,
  pas en degrés, bornes), `values` (valeurs aimantées) ; `MANIP.zoneAt(zones, p, marge)` pour déposer dans une zone.
- `manipLesson(o)` : moteur des défis. Poignées dessinées en SVG (pièces, points, bords), zone de saisie élargie
  (`R` ou `hit`), décalage de prise conservé, `move` en continu, `drop` au lâcher, `tap` (toucher, Entrée, Espace),
  `nudge` (flèches), `click` (toucher le fond), boutons de secours, aide au lâcher (`hint`), question « à toi, sans la
  figure » après un défi (`ask`). Pour les tests : `MANIP.sim` (vrai geste pointerdown / pointermove / pointerup),
  `MANIP.simTap`, `MANIP.simKey`.

## 4. Manipulations refaites (`src/act_manip2.js`, 23.11)

| Leçon (niveau) | Avant | Geste |
|---|---|---|
| reduire (9e–11e) | 3 compteurs | glisser les tuiles x², x, 1 dans trois bacs ; une tuile rouge et une bleue de même forme s'annulent (paire nulle) ; une tuile dans le mauvais bac est refusée avec la raison |
| distrib (10e–11e) | 3 compteurs | remplir le rectangle « facteur × facteur » de tuiles ; chaque case est le produit de sa ligne et de sa colonne ; après une tuile glissée, toucher les cases suffit |
| idrem (11e) | compteur a | remplir le carré (x + a)² : les deux rectangles du double produit apparaissent |
| factor (11e) | compteur + bouton | tirer le bord du rectangle : les tuiles se rangent en k rangées égales, les restes sont montrés |
| eq1 (10e–11e) | boutons d'opérations | balance dessinée : on enlève (glisse ou touche) sacs x et cubes ; elle penche si on n'agit que d'un côté ; but : un sac seul |
| fracadd (9e–11e) | réponse tapée | poser des pièces 1/n sous 1/4 + 1/6 jusqu'à la même longueur, pièces toutes pareilles |
| rel (9e–12e) | réponse tapée | étirer une flèche sur la droite graduée depuis le départ ; « − (−6) » = retourner la flèche grise |
| thales (11e) | réponse tapée | glisser D sur [AB], la parallèle (DE) suit ; les trois rapports s'affichent et restent égaux ; puis déformer le triangle |
| simil (11e) | compteur k | tirer le coin de l'image le long du rayon depuis O : on compte les copies du petit carré (aire × k²) |
| angles (11e) | réponse tapée | faire tourner la sécante : les deux angles alternes-internes restent égaux, le co-intérieur complète à 180° |
| angtri (9e) | réponse tapée | déplacer les sommets d'un triangle : les trois angles mis bout à bout forment toujours un angle plat |
| diagr (9e) | réponse tapée | tirer les barres d'un diagramme, puis la ligne de la moyenne jusqu'à ce que ce qui dépasse comble les trous |
| vol (9e–11e) | réponse tapée | étirer un pavé de cubes (longueur, largeur, hauteur) ; volume = couches × cubes par couche |
| cercthales (11e, 24.11) | réponse tapée | glisser C sur le cercle de diamètre [AB] : l'angle en C reste droit ; isocèle en C ; l'angle au centre BOC vaut le double de l'angle en A |
| proba (11e, 24.11) | réponse tapée (deux dés) | remplir une urne (glisser ou toucher des boules rouges, bleues, vertes ; les sortir pour les enlever) jusqu'à P(rouge) = 1/2, 2/5, puis P(rouge) = 1/2 et P(verte) = 1/6 ; barre des chances ; piège « 2 rouges pour 5 bleues » |
| modaff (1re Collège, 24.11) | réponse tapée | régler la droite du taxi A avec deux poignées (ordonnée à l'origine, un point), glisser un repère jusqu'au croisement avec B, construire la droite d'un taxi C qui passe par un point de B |
| f2formes (1re Collège, 24.11) | réponse tapée | tirer le sommet d'une parabole y = (x − h)² + k pour la poser sur une parabole cible ; la forme développée suit ; puis viser deux zéros donnés |
| pente (10e, 24.11) | réponse tapée | tirer le bout de la route (hauteur, puis longueur d'une rampe) ; repères tous les 100 m (« 6 % = 6 m par 100 m »), hauteurs dessinées 5 fois plus grandes |

Chaque défi garde une question « à toi, sans la figure » quand c'est utile (calcul tapé après le geste).

## 5. Pistes suivantes

- Remplacer les compteurs restants : `monomes` (empiler des facteurs x), `valnum`, `litelab` ; `utemps`, `vitesse`
  (tirer la voiture sur la route), `gquot` ; `eq2` et `eq3` (glisser x sur la droite, la courbe montre le signe).
- Parabole dont on déplace le sommet (`f2formes`, secondaire II), droites qu'on fait pivoter (`droites`, `pente`).
- Migrer les 4 pilotes de `act_manip.js` sur `manip.js` (même moteur, mêmes tests).
