# Niveau réel des questions — 11e du Cycle d'orientation (Genève, 11e LS)

Audit du 25.11.2026 (agent niv11, branche `agent/niv11`). Classe des bêta-testeurs (11LS de l'enseignant). Règle de
l'enseignant (24.11) : chaque notion proposée correspond à un objectif du plan d'études de 11e ; ses niveaux 2–3 (et le
défi 4) ont la difficulté d'une vraie évaluation de 11e (tests de l'enseignant, EVACOM) ; le niveau 1 = automatismes
**de 11e**, jamais ceux de 9e–10e. Registre machine : `tools/niveau.json` (entrée « 11e » ; pour une notion déjà auditée
dans une autre classe : `par_classe["11e"]`, lu par `tools/suivi.py`).

## 1. Sources (données ; rien n'a été exécuté ; aucun fichier de notes ouvert)

| Réf. | Document | Ce qu'on en tire |
|---|---|---|
| PLAN | Plan de cheminement 11e 2026-27 (`Bude/PER/Plans de cheminement 26-27 (2).pdf`) | Chapitres 1–12 de 11e, objectifs par section (CT/LC/LS) |
| PRESC | Prescriptions cantonales et indications pédagogiques 2023 (`Bude/PER/`) | Cadre (2e degré : LS) |
| CHAMP | Champ EVACOM 11e LS 2026-27 (`Bude/EVACOM/champ-evacom-ma-11ls.pdf`) | Objectifs de 11e (sans crochets) vs années antérieures [entre crochets] |
| EVA | `tools/evacom.md`, `src/riche_11c.js` | Types d'items des EVACOM 2017–2023 |
| T1.1 | Test 1.1 11LS (calcul numérique, sans calculatrice) | Étalons chapitre 1 |
| T1.2 | Test 1.2 11LS (calcul numérique et racines) | Étalons racines |
| T1.3 | Test 1.3 11LS (Pythagore) | Étalons chapitre 2 |
| T1.4, T1.5 | Tests 1.4 et 1.5 11LS (3D) | Étalons chapitre 3 |
| DPROP | Dossier « Grandeurs quotients » 11LS + plan de séquence | Étalons chapitre 4 (test 6 du 04.12) |
| DLITT | Dossier « Calcul littéral » 11LS | Étalons chapitre 5 (tests 7 et 8) |

## 2. Objectifs et étalons par chapitre (numérotés `E-<chapitre>-<n>`)

**1. Nombres et opérations** — 4 opérations dans ℤ et ℚ, priorités, puissances (exposants entiers), écriture
scientifique, propriétés des racines (LS), racines cubiques, extraction.
- E-1-1 (T1.1) : 19/36 − 11/60 ; 2,5/24 − 90/16 ÷ 75 ; chaînes de relatifs décimaux → fraction irréductible.
- E-1-2 (T1.1) : 5⁻⁴⁷ · (5¹¹)³ ÷ (5⁻¹³ · 5⁻⁹) sous forme de puissance.
- E-1-3 (T1.1) : produit de 7 facteurs en notation scientifique.
- E-1-4 (T1.2) : √968 = 22√2 ; ∛−72000 = −20∛9 ; √72/√32.
- E-1-5 (T1.2) : −6√28 − 7√175 + 3√700 ; √300 · √112 · 2√24 ; (5√75 − 3√27)/√24.

**2. Pythagore** — application directe, valeur exacte a√b, réciproque et contraposée, problèmes.
- E-2-1 (T1.3 Q2) : AC = 5√6, AB = 3√10, BC = ? (a√b). E-2-2 (T1.3 Q3, Q7) : trapèze isocèle, hexagone régulier.
- E-2-3 (T1.3 Q4) : A(−3 ; −1), B(2 ; 1), C(0 ; 7) : carrés des côtés, triangle rectangle ?

**3. 3D** — volumes prisme, cylindre, pyramide, cône, boule ; aires (pyramide, cylindre, sphère) ; grandeur manquante.
- E-3-1 (T1.4 Q2–Q3) : pyramide (apothème 17, côté 16) ; prisme trapézoïdal, cylindre, cône, boule (exact puis au centième).
- E-3-2 (T1.4 Q4–Q5) : bille dans un vase (débordement), cornet + demi-boule, pourcentage.
- E-3-3 (T1.5 Q1–Q3) : aire du cylindre ; boule d'aire 37,7 mm² ; pyramide d'aire totale 3'920 m².
- E-3-4 (T1.5 Q4, Q6, Q7) : r en fonction de V et h ; hauteur d'eau d'une cuve ; trophée.

**4. Proportionnalité, grandeurs quotients et unités** (test 6, 04.12)
- E-4-1 (DPROP Ex. 5–7) : faucon 150 m en 3 s → m/s, km/h ; conversions m/min ↔ km/h.
- E-4-2 (DPROP Ex. 15–16) : record du marathon ; vitesse moyenne sur deux trajets.
- E-4-3 (DPROP Ex. 19–26) : lingot, air de la classe, pièce de Bob (cylindre + ρ).
- E-4-4 (DPROP Ex. 30–31) : conversions de débit ; château d'eau (cylindre + cône) vidé en 53 min 54 s.

**5. Calcul littéral** (tests 7 et 8, 18.12 et 22.01)
- E-5-1 (CHAMP) : substitution (valeurs négatives, fractions). E-5-2 (DLITT Ex. 7–14) : périmètre et aire d'un « L », pavé.
- E-5-3 (DLITT Ex. 3, 6, 17) : réduire, crochets, (x + 5)/3 − (x − 1)/2.
- E-5-4 (DLITT Ex. 16, 22) : (2a − b)(3a + 4b) − 5a(b − 2a) ; (2x − 3)² + (x − 2)(x + 2).
- E-5-5 (DLITT Ex. 18–20) : identités avec fractions et racines, (5√3 − 4√2)(5√3 + 4√2).
- E-5-6 (DLITT Ex. 25–30) : factoriser au maximum, facteur commun binôme.

**6. Équations** — 1er degré (révision), formules, 2e degré par factorisation ou formule (LS).
- E-6-1 : équations à parenthèses et fractions. E-6-2 : mise en équation. E-6-3 (T1.5 Q4) : r = √(3V/(πh)).
- E-6-4 : (3x + 12)² = (2x + 13)² ; 3x² + 12x + 9 = 0. E-6-5 : problèmes (cadre, cycliste).

**7. Angles** — alternes-internes, adjacents, opposés, inscrits, au centre ; tangente, cercle de Thalès (LS).
- E-7-1 : angles avec parallèles, angle inscrit / au centre, équation d'angles. E-7-2 : tangente et Pythagore.

**8. Thalès** — E-8-1 : application directe, ombres ; E-8-2 : réciproque, papillon.
**9. Systèmes (LS)** — E-9-1 : combinaison, substitution, fractions ; E-9-2 : problèmes.
**10. Fonctions** — E-10-1 : droites, pente, expression ; E-10-2 : tableaux, ax², lecture graphique.
**11. Transformations** — E-11-1 : rapport k, aires × k², volumes × k³.
**12. Probabilités** — E-12-1 : tirages sans remise ; E-12-2 : dénombrements (podiums, poignées de main).

## 3. Audit (sonde `tests/_niv11.html`, non commitée : 8 tirages par notion et par niveau, profil CH 11e)

52 notions « de l'année » en 11e (dont 4 révisions de 10e : rac, carres, monomes, pctvar). Verdicts : **au niveau** ;
**trop facile** ; **remonté** (corrigé le 25.11) ; **à valider** (décision de l'enseignant). « UP11 » = en 11e, le niveau 1
tire les formes du niveau 2 (`Engine.make`, CO 11e seulement : la 9e et la 10e ne changent pas).

| Ch. | Notion | N1 | N2 | N3 | N4 | Remarque |
|---|---|---|---|---|---|---|
| 1 | prio | **remonté** (UP11) | au niveau | au niveau | à valider | N1 « 22 − 12 : 4 » (9e) ; N4 « place des parenthèses » léger |
| 1 | rel | à valider | au niveau | au niveau | au niveau | N1 « (−2) · (−6) » (9e) ; N2 tire déjà N3 en 11e (UP2), pas d'UP11 possible |
| 1 | fracadd, fracconv, fracmul, fracops | **remonté** (UP11) | au niveau | au niveau | au niveau | N1 « 1/3 − 1/9 », « 3 % en décimal », « 3/4 de 200 CHF » |
| 1 | puiss, sci, scicalc | **remonté** (UP11) | au niveau | au niveau | au niveau | |
| 1 | racprop | au niveau | **remonté** | **remonté** | au niveau | ajout : √(k²m) jusqu'à 3'000, ∛(±c³m) jusqu'à 100'000 ; sommes de 3 termes à coefficients, produits et quotients de radicaux (E-1-4, E-1-5) |
| 10e | rac, carres | **remonté** (UP11) | trop facile | à valider | au niveau | révisions de 10e ; racprop couvre la 11e |
| 2 | pyth, pythfig | **remonté** (UP11) | au niveau | au niveau | au niveau | |
| 2 | pythrec | au niveau | au niveau | au niveau | au niveau | |
| 3 | vol | **remonté** (UP11) | au niveau | au niveau | au niveau | N1 prisme à base triangulaire (10e) |
| 3 | volcone, airepyr, volcomp, volmanq | au niveau | au niveau | au niveau | au niveau | aire de la sphère et du cylindre présentes |
| 4 | vitesse | **remonté** (UP11) | au niveau | au niveau | au niveau | N1 « 180 km à 80 km/h » (10e) → durées en h min |
| 4 | gquot, ucomp | au niveau | au niveau | au niveau | au niveau | conforme au dossier (faucon, orage, Bob, air de la classe) |
| 5 | valnum, litelab, reduire, distrib | **remonté** (UP11) | au niveau | au niveau | au niveau | N1 « 4 − 5x pour x = −4 », « le quintuple de x augmenté de 3 », « −4(4x − 9) » |
| 5 | reduire | | | **remonté** | | ajout : fractions à numérateur binôme, réponse en une seule fraction (E-5-3) |
| 5 | idrem | au niveau | au niveau | **remonté** | au niveau | ajout : (a√m − b√n)(a√m + b√n) (E-5-5) |
| 5 | parenth, factor | au niveau | au niveau | au niveau | au niveau | |
| 10e | monomes | **remonté** (UP11) | au niveau | au niveau | au niveau | |
| 6 | eq1, eqfrac, probeq | **remonté** (UP11) | au niveau | au niveau | au niveau | N1 « 3x + 9 = 33 » |
| 6 | formule, eq2, eq2fact, probeq2 | au niveau | au niveau | au niveau | au niveau | |
| 6 | eq2disc | au niveau | au niveau | au niveau | au niveau | formule : « Viète (LS) » au plan de cheminement, hors champ EVACOM → à valider |
| 7 | angles | **remonté** | au niveau | au niveau | au niveau | « trois angles autour d'un point » (9e) remplacé par internes du même côté / alternes-externes |
| 7 | cercthales | au niveau | au niveau | au niveau | au niveau | |
| 8 | thales, thalesrec | au niveau | au niveau | au niveau | au niveau | |
| 9 | sys2, sysprob | au niveau | au niveau | au niveau | au niveau | hors champ EVACOM |
| 10 | affine, repere, tabval | **remonté** (UP11) | au niveau | au niveau | au niveau | N1 « lis b », « lis l'ordonnée de A » |
| 10e | pctvar | **remonté** (UP11) | au niveau | au niveau | au niveau | |
| 11 | simil | au niveau | au niveau | au niveau | au niveau | |
| 12 | proba, denombr | au niveau | au niveau | au niveau | au niveau | N1 = premières probabilités (1re année du thème) |

Aucun chapitre vide. Sujets de préparation (onglet Test) des banques de 11e dont les notions viennent de 9e–10e
(no11, pyth11, gm3d11, prop11, litt11, fct11) : automatismes au niveau 2 au moins (`minA: 2`, `src/sujet.js`).
Banques riches de proportionnalité et de calcul littéral relues : au niveau des dossiers 11LS.

## 4. Points à valider par l'enseignant

1. UP11 : 26 notions de 9e–10e voient leur niveau 1 tiré au niveau 2 en 11e. D'accord ?
2. rel : N1 reste « (−2) · (−6) » en 11e (le niveau 2 tire déjà le 3). Le garder comme révision ?
3. rac, carres (révisions de 10e ajoutées le 20.11) : encore utiles en 11e, à côté de racprop ?
4. eq2disc (formule du 2e degré) : au plan de cheminement (LS), hors champ EVACOM. La proposer dès l'année ?
5. Manquent : nommer un solide d'après sa description ou son patron (EVACOM), expressions équivalentes (11FA2.05).
6. 4ᵉ racine (∜1250, test 1.2) non couverte : hors PER ?
