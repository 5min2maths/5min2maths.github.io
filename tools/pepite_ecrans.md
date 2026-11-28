# Pépite² : écrans hors accueil (28.11, agent pepite-ecrans)

Zone : écran question, bilan de séance, « À polir », Mon trésor (progrès), Mes grades, badges, réglages, page parent,
sauvegarde / reprise, toasts, profil France. Hors zone : accueil (fait le 27.11, tools/pepite_accueil.md) et
présentations / PDF (src/presente.js : #decouvrir, #parents, page enseignants — autre agent).
Renommages et précisions de texte seulement : aucun calcul, plafond, règle ni consigne mathématique ne change ; clés
m2m-*, identifiant d'appareil et adresse inchangés.

## 1. Inventaire (profils romand 11e et France 3e)

Page `tests/_pepite_cap.html#cadre&inv[&fr]` (nouvelle) : rend 45 écrans et relève leur texte visible (et les toasts).
La passe du 27.11 avait déjà fait l'essentiel (pépites, filon, À polir, parents). Restaient :

| Où | Avant | Après |
|---|---|---|
| Toasts d'une séance « À polir » (`src/app.js`, onDone) | « 📕 Effacée de ton carnet d'erreurs ✓ » · « 📕 1 réussite sur 2 : encore une, du premier coup, et elle sort du carnet. » · « 📕 Elle reste dans ton carnet : il faut … » | « ✨ Polie ! Une pépite de plus ✓ » (même message qu'en séance ordinaire) · « ✨ 1 réussite sur 2 : encore une, du premier coup, et elle est polie. » · « ✨ Pas encore polie : il faut … » |
| Toast du pas à pas réussi | « 🪜 Tu as reconstruit la solution : +1 point de l'année. » | « … : +1 pépite. » |
| Bilan, carte « Nouveau grade ! » | « Prochain grade : ✏️ Apprenti, encore 113 points. » | « … encore 113 pépites. » |
| Bilan, carte du filon | « ton filon passe à 1 jours » (pluriel fautif quand le filon repart) | « passe à 1 jour » |
| Mes grades | « 🟡 37 pépites cette année » | « 🟡 37 pépites trouvées cette année » (nombre en doré) |
| Bilan, ligne Pépites | « +31 pépites » | même texte, nombre en doré (pastille --gold-soft / --gold-ink) |
| Sauvegarde | « … toute ta progression : notions, compétences, badges, Mathélo. » | « … : pépites et grade, notions, compétences, badges, Mathélo. » |
| Reprise d'un code | « 11e · Mathélo 1250 · 12 jours … » | « 11e · 🟡 340 pépites · Mathélo 1250 · 12 jours … » |
| Réglages, « Tout effacer » | « Effacer ta progression et ton Mathélo ? » | « Effacer ta progression (pépites, grades, badges, Mathélo) ? » |
| Ce que l'app envoie | « Tes grades Mathélo, quand tu en atteins un » (faux depuis le 25.11) ; « Ta progression : tes notes…, tes badges, ton Mathélo… » | « Tes grades de l'année… » ; « Ta progression : tes pépites et ton grade, … » |
| Mentions légales | « les grades Mathélo atteints » ; « la progression (notions, compétences, badges, Mathélo, …) » | « les grades de l'année atteints » ; « (pépites et grades, notions, …) » — exactitude, à relire avec le reste de la page |
| Statistiques (auteur) | « grades de l'année (points de travail, …) » | « (pépites, remises à zéro à la rentrée) » |
| Badges, profil **France** (séparation) | « Une compétence atteint la note 5 / la note 6 », « à 5 ou plus », « de 3 ou moins à 5 ou plus » : notes 1–6 suisses montrées à un élève français (niveaux du LSU) | France : « Une compétence bien maîtrisée », « … parfaitement maîtrisée », « Toutes les compétences d'une notion bien maîtrisées », « Faire remonter une compétence très fragile jusqu'à bien maîtrisée ». Romand inchangé ; seuils inchangés |
| Carte d'aide Mathélo (désactivée depuis le 26.11) | « Mathélo = ton score de maths » | « = ton niveau » (cohérence si elle revient) |

Gardés tels quels (sens clair ou hors vocabulaire validé) : « Score 3 / 4 » du bilan, « Ton point de départ » (fin du
positionnement), badge « 3 jours d'affilée », « Tes erreurs, une dernière fois » (tâche J−1 de Jour J : elle mêle
erreurs et test rapide), « Une séance de quelques minutes suffit pour reprendre le fil » (bilan sans aucune séance dans
la semaine), « Série d'automatismes » (format), tout « série » mathématique. Profil France : mêmes libellés de l'univers
(grades français « Élève »… déjà propres au système).

## 2. Pépites seul score, Mathélo = niveau (décision de l'enseignant du 28.11)

Commentaire testeur : « conflit / incompréhensible possible entre les deux monnaies Pépites et Mathélo ». Décision :
**un seul score à poursuivre, les pépites** (travail de l'année, ne baissent jamais, font monter les grades : accueil,
en-tête, bilan « +12 pépites »). Le **Mathélo devient un indicateur de niveau**, visible seulement dans Mon trésor.
Le moteur l'utilise comme avant (aucun calcul changé, clés m2m-* inchangées).

- Accueil, en-tête, questions, bilan : le Mathélo n'y apparaissait déjà plus depuis le 26.11 (vérifié par
  tests/lot_26_11.html) ; rien à retirer.
- **Retiré** : bloc Mathélo de la fin du positionnement (« MATHÉLO PROVISOIRE 1250 » ; les barres par thème restent) et
  de Mes grades (Mes grades = pépites et grades seulement ; « 🟡 37 pépites trouvées cette année : elles ne se perdent
  jamais. »). Bouton de Mon trésor : « 🏅 Mes grades et mon Mathélo » → « 🏅 Mes grades ».
- **Nouvelle carte « 📈 Mon niveau »** dans Mon trésor (`niveauCard()`, src/app.js) : « Niveau en bonne voie » (palier en
  mots, pastille « se précise » pendant les 20 premières réponses), jauge bleue (pas d'or : ce n'est pas un score),
  évolution sur 4 semaines (« ↗ En hausse sur 4 semaines. » / « → Stable… » / « ↘ Un peu en baisse ces dernières
  semaines : les questions suivent ton niveau, la pratique le fait remonter. »), courbe d'une valeur par semaine
  (8 semaines au plus, plus séance par séance), puis « Ton niveau suit tes réponses : il monte et descend, c'est normal.
  Ton grade, lui, monte avec tes pépites, qui ne se perdent jamais. Mathélo 1318 » (nombre en petit).
- Les écrans de données (sauvegarde, reprise, Tout effacer, Ce que l'app envoie) citent encore le Mathélo comme donnée
  gardée : exact, laissé.

**Paliers en mots (PROPOSITION à valider)** — écart entre le Mathélo et le Mathélo typique de *fin d'année* de la classe
(`ELO_REF`, src/engine.js ; ex. 11e : 1300) ; un élève qui commence l'année (départ = repère − 50) est « en bonne voie » :

| Écart au repère de fin d'année | Palier affiché |
|---|---|
| < −300 | Niveau à consolider |
| −300 à −151 | Niveau en construction |
| −150 à −41 | Niveau en bonne voie |
| −40 à +59 | Niveau de fin d'année |
| +60 à +199 | Niveau solide |
| ≥ +200 | Niveau très solide |

Jauge : de repère − 450 (vide) à repère + 300 (pleine). Mots sobres, sans univers minier (le niveau n'est pas un butin).

## 3. Accent doré

Deux usages ajoutés (pépites seulement, jamais le niveau), texte en `--gold-ink` sur `--gold-soft` (≥ 9:1 en clair et en sombre, mesure du 27.11) : nombre de
pépites de Mes grades, « +N pépites » du bilan. Pas de texte courant en or.

## 4. Vérifications

- Captures avant / après, 360×640 et 1440×900, romand (`ch`) et France (`fr`) :
  `tests/_shots/pepite/ecrans/{avant,apres}/<taille>_<profil>_<écran>.png` — écrans accueil, tresorlog (Mon trésor avec
  6 semaines d'historique : carte « Mon niveau »), progres (Mon trésor, nouvel élève), grades, bilan, bilanfilon,
  bilanpolir, depart (fin du positionnement), reglages, sauvegarde, reprise, envoyer, parent, badges, polir.
  (« avant » = master 95b28ff avec la même page de captures.)
- Suite complète : 180 pages, aucun échec (poids.html après `python3 build.py`, docs/ non commité).
- Test mis à jour (commentaire « 28.11, décision pépites seul score ») : `tests/lot_26_11.html` — Mon trésor : carte
  « Mon niveau » avec un palier en mots (au lieu de « Mathélo = ton niveau ») ; nouveaux contrôles : pas de « Mathélo »
  dans Mes grades ni à la fin du positionnement (accueil et bilan : contrôles existants gardés).

## Fusion

Cette branche ne touche ni `DOOR_HINT` (sous-titre « ton carnet d'erreurs » de la case À polir, voulu, fixé sur master
le 28.11) ni les boutons « Retour à l'accueil » du bilan (homeTab = "today" sur master) : garder la version de master.

## À soumettre à l'enseignant (non appliqué)

1. Badge « 3 jours d'affilée » → « Filon de 3 jours » ? (le critère dit déjà « joker de filon »).
2. Bilan « Score 3 / 4 » → « Réussies 3 / 4 » ou « 3 / 4 trouvées » ? (« Score » fait un peu contrôle.)
3. Tâche J−1 de Jour J « Tes erreurs, une dernière fois » → « Tes pépites à polir, une dernière fois » ?
4. Fin du positionnement « Ton point de départ » → « Ton filon de départ » / « Ta première pépite » ? (je garderais
   « point de départ » : sens clair).
5. « Une séance de quelques minutes suffit pour reprendre le fil » : « fil » voisine avec « filon » ; garder ?
6. Présentations (#decouvrir) : « Ni trop facile, ni impossible : ton Mathélo monte quand tu progresses » — à aligner sur
   la décision « pépites seul score » par l'agent des présentations (src/presente.js, hors de cette branche).
7. Paliers de niveau en mots (tableau du § 2) : mots, seuils, et le repère « fin d'année » (plutôt que « milieu d'année »).
