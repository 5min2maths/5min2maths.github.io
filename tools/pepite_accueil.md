# Pépite² : portes d'entrée renommées (27.11, agent pepite-accueil)

Décision de l'enseignant (27.11, tools/nom_app.md § « Portes d'entrée ») : **renommages seulement**, aucune règle ne
change (calculs, plafonds, explications des cases aux 3 premières ouvertures, ordre des cases, comportements).

| Avant | Après (nom · explication sous la case) |
|---|---|
| ▶ Ma séance du jour | **▶ Ma pépite du jour** (mode « En classe » ; « Mon défi du jour » du mode Libre inchangé) |
| Problème · chaque semaine | **La mine** · le grand problème de la semaine |
| Curieux · maths cachées | **Trésors cachés** · maths cachées |
| Histoire · découvertes | **Chercheurs d'or** · histoire des maths |
| Évaluation · prépare le jour J | **Jour J** · prépare ton évaluation |
| À polir · tes erreurs | inchangé |
| Progrès · grades, badges | **Mon trésor** · grades, badges, pépites |

## Où

- `src/app.js` : cases de l'accueil (noms, explications, noms accessibles `DOOR_NAME`), titres des pages (`T` : « La mine »,
  « Jour J », « Mon trésor »), onglets hérités (`HOME_TABS`), visite guidée (« ▶ Ta pépite du jour », bulle « Tes rubriques »),
  carte de l'évaluation sur l'accueil (« 📝 Jour J · dans 3 jours »), séance du problème (« ⛏️ La mine · problème de la
  semaine »), **bilan du problème** (nouvelle ligne de titre « ⛏️ La mine · problème de la semaine »), page La mine (« ⛏️
  Problème de la semaine » gardé comme sous-titre explicatif), Trésors cachés (« Trésors cachés · <famille> », « Un autre
  trésor caché », bonus du bilan « 🔍 Bonus : un trésor caché », message « Pas encore de trésor caché pour toi »),
  Chercheurs d'or (« 📜 Chercheurs d'or · <thème> »).
- `src/presente.js` (#decouvrir, #parents, page enseignants) : cartes « ⛏️ La mine », « 🔍 Trésors cachés », « 📜 Chercheurs
  d'or », « 📝 Jour J » (avec leur explication en clair), « Mon trésor → 👪 Envoyer à mes parents ».
- `src/parents.js` : « Mon trésor → « 👪 Envoyer à mes parents » » (3 endroits).
- Réglages : ne citaient aucune porte (voir « Pépite au carré » ci-dessous). Profils France et romand : mêmes libellés
  (aucun libellé de porte ne dépend du système).
- Gardés : « Problème de la semaine » dans les règles des pépites (« problème de la semaine réussi +10 ») et comme
  sous-titre ; l'étiquette de la question « Problème · <notion> » ; « Mes grades et mon Mathélo ».

## Icônes des cases (style actuel : trait 1,9, coins ronds)

- La mine : **pioche** (manche en diagonale, fer courbe) au lieu de la loupe « ? ».
- Trésors cachés : **loupe « ? »** (reprise de l'ancienne case Problème) au lieu de l'ampoule : chercher ce qui est caché.
- Mon trésor : **médaille à ruban** (grades, badges) au lieu du diagramme en barres. **Pas de coffre** : la règle de
  l'univers (SKILL pepite) interdit les coffres (mécanique de butin) ; un coffre reste possible si l'enseignant le
  souhaite comme simple pictogramme.
- Chercheurs d'or (livre), Jour J (feuille), À polir (pierre) : gardées.

## 360 px

« Trésors cachés », « Chercheurs d'or » et « le grand problème de la semaine » ne tiennent pas sur une ligne dans une
colonne de 3 cases (≈ 100 px) : nom et explication passent sur **deux lignes au plus**, coupées de façon équilibrée
(`text-wrap: balance`, `src/style.css`). Le test de l'accueil (tests/ergo.html, section 6) accepte désormais deux lignes
(était : une) et vérifie les 6 noms, le grand bouton et le nom dit. Sur ordinateur, tout tient sur une ligne sauf
l'explication de La mine (2 lignes).

## « Pépite² se dit Pépite au carré » (ajout validé le 27.11)

- `src/curriculum.js` : `APP_SPOKEN = "Pépite au carré"` (centralisé ; `tools/test_nom.py` l'exige et vérifie l'en-tête,
  l'écran d'entrée et les Réglages).
- En-tête (toutes les pages, présentations et page parent comprises) : logo + nom lus comme une image nommée
  (`role="img"`, `aria-label` = APP_SPOKEN « Pépite au carré » ; pas d'élément sr-only, que les tests de débordement
  signaleraient).
- Écran d'entrée : petite ligne discrète sous le grand titre « Pépite² se dit *Pépite au carré* » (une ligne à 360 px).
- Réglages : nouvelle carte « À propos » : « Pépite² se dit *Pépite au carré* : une pépite… au carré ! » + bouton
  « 🔍 Le secret du logo » (ouvre la question curieuse du logo, retour aux Réglages).
- Manifeste : `name` « Pépite² » laissé tel quel (aucune propriété de prononciation). Titre de l'onglet : inchangé
  (APP_TITLE, pas d'attribut possible).

## Tests mis à jour (commentaire « 27.11 »)

ergo (section 6 : deux lignes, noms des cases, nom dit, entrée, À propos), explo (cases La mine, Chercheurs d'or), ux_2111b
(« Ta pépite du jour »), ecrans et _pepite_cap (titre de la séance du problème), _trace (bonus « trésor caché »),
tools/test_paquets.py (Chercheurs d'or), tools/test_nom.py (APP_SPOKEN).

## Captures (tests/_shots/pepite/accueil/, page tests/_pepite_cap.html#cap=…)

360×640 et 1440×900 : `entree`, `accueil`, `mine` (problème disponible), `tresors`, `chercheurs`, `jourj`, `tresor`,
`bilanmine`, `reglages` ; 360×1000 : `accueil` (les 6 cases) ; 360×1700 : `reglages` (carte « À propos » en bas).

Suite complète : 179 pages, aucun échec (après la dernière correction).

## À soumettre à l'enseignant

- Explications sous les cases : toujours affichées seulement aux 3 premières ouvertures (règle inchangée). Avec des noms
  imagés, les afficher **toujours** aiderait (« La mine », « Mon trésor » ne disent pas ce qu'il y a derrière).
- Mode Libre : le grand bouton reste « ▶ Mon défi du jour » (« Ma pépite du jour » aussi ?).
- Coffre pour Mon trésor : non appliqué (règle « pas de coffres »), médaille à la place.
