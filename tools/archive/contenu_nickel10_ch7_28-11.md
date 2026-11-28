# /contenu nickel 10e, chapitre 7 Calcul littéral — 28.11.2026 (branche `agent/contenu7`)

Demande de l'enseignant (28.11) : mettre la 10e « au niveau de la 11e » (liste de contrôle de `chantier_11e.md`),
chapitre 7 d'abord (le chapitre 6 attend ses décisions). Références : plan de cheminement 10e (simple distributivité,
pas de double distributivité ni de factorisation), étalons E10-7-1 à E10-7-3 (`niveau_910.md` § 2), MER 10e
`ch06_10FAB_Calcul_litteral` (FA150, FA162, FA170, FA172, FA174, FA177, QSJ p. 98 et 107 : données, rien d'exécuté).
Aucun fichier de notes ni donnée d'élève ouvert.

Notions du chapitre (`CO_BY` 10C07) : litelab, valnum, reduire, monomes, distrib, litconv.
Mesure : sonde non commitée `tests/_nickel10_ch7.html` (profil CH 10e, `Engine.make`, 200 tirages par notion et par
niveau : formes, ctx, pas à pas, pièges, corrigé) ; sujet : `tests/_sujet10_ch7.html`.

## Défauts trouvés (avant)

1. **Sujet de préparation de 10e = banque de 11e** : `richChapter` donnait `RICH.litt11` (5 notions sur 6) à une 10e :
   jardin (x + a)(x + b), « deux programmes » avec (x + k)², « développer, réduire, factoriser », vrai ou faux avec
   (x − 3)(x + 3). Hors programme de 10e.
2. **« Développer » montrait la double distributivité en 10e** : exemple du catalogue « (x + 2)(x − 3) = x² − x − 6 »,
   indice « chaque terme de la première parenthèse… », rappel de cours (règle, exemple, piège), et la leçon active
   (`act_manip2.js`) : rectangle (x + 2)(x + 3) au 2e défi, Retiens avec double distributivité.
3. valnum 2 : « aire du trapèze pour B = 10, b = 4, h = 5 » (entiers positifs, formule de 9e) ; seulement 3 formes.
4. litelab 2 : « écris le nombre entier qui suit n » (n + 1) : trivial en 10e.
5. distrib 3 : 2 contextes ; aucune forme à décimaux (E10-7-1, MER FA170 « 1,5x + 4(x − 1) ») ; reduire : aucune
   forme à coefficients décimaux.
6. Défis : 3 problèmes au plus par notion, souvent au format « coefficient de x » (réponse numérique).

## Liste de contrôle par notion (avant → après)

Cases de `chantier_11e.md` : 1 variété (≥ 3 formes par niveau), 2 trivialité, 3 contextes, 4 valeurs, 5 pas à pas,
6 corrigé, 7 pièges, 8 rappel, 9 leçon active, 11 trouve l'erreur, 12 exercices riches. 10 (figure à manipuler) : leçon
active à tuiles pour distrib et reduire. 13 estimation : sans objet (pas de grandeur quotient). 14 retours testeurs :
aucun sur ces notions. **15 contrôle par l'enseignant : à faire pour toutes.**

| Notion | Avant | Après |
|---|---|---|
| litelab | N2 « n + 1 » trivial ; N2 3 ctx (entiers, aire, périm.) ; défi 3 ctx | N2 + 3 formes de 10e (solde −p % + livraison, trois pairs / impairs consécutifs, âges dans n ans) : 6 ctx ; « n + 1 » écarté (HORS_CO) ; défi « programme de calcul » (4 parties, dont l'expression réduite) : 4 ctx. Cases 1–7, 9, 11 ✓ |
| valnum | N2 : 3 formes dont le trapèze (9e) | trapèze écarté en 10e ; + « −x² + bx − c pour x négatif » (piège −x² = −(x²)), « (a − 2b)/(a + b) » avec relatifs : 4 formes. N1, N3, défi déjà au niveau (audit du matin). Cases 1–7 ✓ |
| reduire | N2 3 ctx, entiers seulement | + coefficients décimaux (« 2,6x − 6 + 0,9x + 1,6 − 5,2x », pièges sur le signe) : 4 ctx ; N1, N3 (trouve l'erreur), défi inchangés. Cases 1–7, 9, 11 ✓ |
| monomes | au niveau (3 formes par niveau, trouve l'erreur N2) | inchangé ; N3 « quotient » toujours à valider (§ 5 n° 5 de `niveau_910.md`). Cases 1–7, 9, 11 ✓ |
| distrib | N3 2 ctx ; leçon, indice, exemple avec double distributivité | N3 + « 2,5(2x − 4) − 1,5(x − 3) » (E10-7-1) et « 3a(2a − b) − 2b(a − 5b) » : 4 ctx ; défi « allée autour d'un jardin » (simple distributivité, 2 parties en expression) : 3 ctx ; textes de 10e (TXT_CO) et leçon active de 10e (3 rectangles à simple distributivité, rappel « −2(4x − 3) »). Cases 1–9, 11 ✓ |
| litconv | au niveau (29–69 formes, contre-exemple, équivalences) | inchangé. Cases 1–7, 9 ✓ |

Pas à pas (guide) : 100 % des questions des niveaux 1–3 ; défis : parties liées + corrigé par étapes. Corrigés recalculés
indépendamment (section de test, 150–200 graines). Figures : aucune ajoutée aux questions (énoncés suffisants) ; deux
figures dans le sujet, où elles portent l'information (mur de briques, carré de carreaux).

## Test de préparation de qualité : `RICH.litt10` (`src/riche_10.js`)

Modèle : MER 10e (programmes de calcul à prouver FA150, murs FA162, équivalences FA174, motifs FA177, QSJ) et
étalons E10-7-x ; modelé, jamais recopié. Sans points, 45 min, A. automatismes (notions du chapitre), B. 3 exercices
tirés de 5, C. 2 raisonnements tirés de 5 (cases T1–T6 ✓ ; T7 : relecture par l'enseignant à faire).

- Exercices : **Le mur de briques** (réduire, valeur pour x négatif vérifiée de deux façons, brique inconnue), **Les
  carreaux du bord** (4n − 4 ; quatre propositions d'élèves à juger, contre-exemple ; question inverse ; « 50 carreaux,
  possible ? »), **Le programme de calcul** (tester, écrire, prouver, modifier), **Deux taxis** (formules à décimaux,
  différence réduite, égalité, vrai ou faux justifié), **La boîte sans couvercle** (monômes : volume, aire, erreur
  « 30x³ », x double).
- Raisonnement : trouve l'erreur (signe devant une parenthèse), vrai ou faux (3x² pour x = −2, a · a = 2a, termes non
  semblables, −x², (2x)³, (a + b)² par contre-exemple), sont-elles équivalentes ? (E10-7-3), deux méthodes (expression qui
  ne dépend pas de x), trouve l'erreur sur les monômes.
- `richChapter` (`src/riche.js`, 5 lignes) : champ `grades` d'une banque ; une 10e reçoit `litt10`, une 11e `litt11`
  (inchangé), une 9e `litt11` (inchangé, voir « Reste »).

## Fichiers

- `src/engine.js` : `HORS_CO[10]` (valnum « trapeze », litelab « nombre entier qui suit ») ; `TXT_CO` + `txtCO()` (textes
  d'une notion propres à une classe : exemple du catalogue dans `Engine.catalog`, indice et rappel par accesseurs sur
  `HINTS` / `LESSONS` qui lisent `state.profile`, sans toucher `app.js`).
- `src/variantes.js` (section « 28.11 : nickel 10e ») : 8 formes `q.co = [10]` et 2 défis (PROBX).
- `src/act_manip2.js` : leçon active distrib selon la classe (10e : simple distributivité).
- `src/riche_10.js` : `RICH.litt10` ; `src/riche.js` : `richChapter` (grades). **Fichiers riche* : touchés seulement pour
  le chapitre 7 de 10e** (l'autre agent /contenu y écrit les grands problèmes de 11e et 1re : fusion à surveiller dans
  `richChapter`, fin de `riche.js`). `src/defis*.js` : pas touchés (les défis de 10e sont dans `variantes.js`).
- Tests : `tests/parcours.html#section=nickel10_ch7` (nouvelle section : HORS_CO, formes et défis tirés en 10e et jamais
  en 9e ni 11e, recalcul, textes et leçon de 10e, sujet de 10e sans contenu de 11e) ; `tests/riche910.html` (10C07 →
  litt10, chapitres jugés avec le profil de leur classe).

## Reste / à décider

- **9e** : le sujet de calcul littéral de 9e (9C10 : litelab, valnum) tire lui aussi `RICH.litt11` (contenu de 11e) :
  à traiter au « nickel » 9e (banque `litt9`, même mécanisme `grades`).
- Défis de 10e qui demandent de résoudre une équation simple (« valeur de x pour un périmètre de 38 cm ») alors que les
  équations sont au chapitre 9 : gardés (arithmétique inverse) — d'accord ?
- Anciens défis au format « coefficient de x » (accoles, sortie, rectangle, orientation : `defis.js`) : à passer en
  réponse littérale quand `defis.js` sera libre.
- monomes N3 « quotient » en 10e LS : toujours à valider.
- Contrôle par l'enseignant (case 15, T7) : imprimer un sujet de 10e (Je prépare une évaluation → Calcul littéral).
