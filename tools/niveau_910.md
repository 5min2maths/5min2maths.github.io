# Niveau réel des questions — 9e et 10e du Cycle d'orientation (Genève)

Audit du 25.11.2026 (agent niv910, branche `agent/niv910`). Règle de l'enseignant (24.11) : chaque notion proposée
correspond à un objectif du plan d'études de la classe ; ses niveaux 2–3 (et le défi 4) ont la difficulté d'une vraie
évaluation de la classe ; le niveau 1 = automatismes **de l'année**. Au CO, le risque est double : **trop facile**
(niveau primaire) ou **hors programme** (notion de la classe suivante qui se glisse). L'app ne distingue pas les
regroupements (R1–R3 en 9e, CT/LC/LS en 10e) : la référence retenue est le haut du programme (R3 en 9e, LS en 10e) ;
ce qui n'est prévu qu'en sensibilisation est signalé. Registre machine : `tools/niveau.json` (entrées « 9e » / « 10e » ;
pour une notion déjà auditée dans une autre classe : `par_classe["9e"]` ou `par_classe["10e"]`).

## 1. Sources (données ; rien n'a été exécuté ; aucun fichier de notes ni donnée d'élève ouvert)

| Réf. | Document | Ce qu'on en tire |
|---|---|---|
| PLAN9, PLAN10 | Plans de cheminement 9e et 10e 2026-27 (`Bude/PER/Plans de cheminement 26-27 (2).pdf`) | Chapitres et objectifs, restrictions ⚠️ (ex. « 9e : relatifs, pas de multiplication/division » ; « 10e : pas de double distributivité ni de factorisation », « Pythagore : pas de réciproque ») |
| PRESC | Prescriptions cantonales CO 2023, annexe « résumé des apprentissages du PER » (`Bude/PER/`) | Répartition 9e / 10e / 11e (ex. polygones réguliers 10e, cône 11e, vitesse 11e, × et ÷ de fractions et de relatifs 10e) |
| MER9, MER10 | Nouveaux MER 2024, livres 9e et 10e (`~/DATA/.../Nouveaux MER 2024/`) | Exercices types (ex. FA69 substitution y = 3,5 ; FA147, FA170 développer ; FA197–FA199 équations) |
| PE | Plan d'études maths CO (`~/DATA/.../PER/pe_maths CO.pdf`) | Diagrammes (lecture du circulaire), moyenne |

Remarque : les MER 9e 2024 traitent déjà la multiplication des relatifs (« Multiplication et division de nombres
relatifs », p. 54), mais le plan de cheminement et les prescriptions cantonales la placent en 10e : l'app suit Genève.

## 2. Objectifs et étalons par chapitre (numérotés `E9-<ch>-<n>` et `E10-<ch>-<n>`)

### 9e (PLAN9)
1. **Écritures décimale et fractionnaire** — 4 opérations, ordre de grandeur, décomposition, arrondi, comparaison ;
   puissances à base décimale positive ; priorités. E9-1-1 : 7 + 2/10 + 8/1000 en décimal ; ranger 9,606 ; 9,6 ; 9,06 ;
   9,66. E9-1-2 : 2 · 1,5² + 5 · (7 − 0,8) ; 128 : (3 + 1)² − 2 ; 52 − [6 − (1 − 2 · 4)] · 3 (relatifs additifs seulement).
2. **Unités et mesures** — longueur, masse, aire ; volume, capacité, temps en sensibilisation. E9-2-1 : 1,6 km² en ha ;
   3,7 kg − 780 g en g.
3. **Géométrie du plan** — triangles, quadrilatères, angles, somme des angles d'un triangle. E9-3-1 : angles d'un
   triangle proportionnels à 3, 4, 5 ; trapèze rectangle ; E9-3-2 : losange, angle entre côté et diagonale (isocèle).
4. **Arithmétique** — critères, multiples et diviseurs, premiers, PGDC et PPMC (R2/R3). E9-4-1 : pavage 108 × 60 cm.
5. **Aires et périmètres** — polygones, par décomposition. E9-5-1 : chemin de 1 m autour d'un jardin 10 × 9 m.
6. **Nombres relatifs** — repérage, comparaison, addition et soustraction (pas de × ni de ÷). E9-6-1 : solde, altitudes.
7. **3D** — cube, pavé, prisme droit (description, volume et aire du cube et du pavé). E9-7-1 : arêtes d'un prisme à
   8 côtés ; contenance d'un aquarium en L.
8. **Écriture fractionnaire dans ℚ⁺** — comparer, simplifier, convertir, périodiques (tiers R1–R3, neuvièmes R3),
   addition et soustraction (R3). E9-8-1 : 8/9 − 1/6 + 3/4 ; 4 − 3/4 − 1/6. E9-8-2 : 2,555… = 23/9.
9. **Proportionnalité** — quantité/quantité, taux de change, agrandissement. E9-9-1 : 1 EUR = 0,95 CHF.
10. **Calcul littéral (R2/R3)** — conventions, substitution, élaboration (pas de réduction : 10e). E9-10-1 (MER9 FA69) :
   2a² + 3ab pour a = 1,5 et b = 4 ; aire totale d'un pavé A = 2(ab + bc + ac). E9-10-2 : volume d'un pavé x, x + 5, 4.
11. **Transformations** — symétries axiale et centrale, translation. 12. **Diagrammes** — lecture, colonnes.

### 10e (PLAN10)
1. **Relatifs** — 4 opérations dans ℤ (LC/LS). E10-1-1 : (−3)³ − 2 · (−5) + (−1)³.
2. **Aires et périmètres** — disque, arc et secteur (LC/LS), grandeur manquante. E10-2-1 : secteur de 150°, r = 5 cm.
3. **Écriture fractionnaire** — 4 opérations dans ℚ (LS), pourcentages, périodiques → fraction (LS).
4. **3D** — prismes droits, cylindre (LC/LS), décomposition, contenances. E10-4-1 : cylindre creux.
5. **Unités** — temps et vitesses (sensibilisation). E10-5-1 : 60 km à 90 km/h en minutes.
6. **Puissances et racines** — carrés parfaits, √ et ∛ dans ℝ⁺, encadrement, notation scientifique, propriétés (LC/LS).
7. **Calcul littéral** — réduire, substituer, élaborer ; × de monômes (degré 6 LS) ; **simple distributivité**.
   E10-7-1 (MER10 FA170) : 1,5x + 4(x − 1) ; 3(3x − 2) − 4(4x − 2). E10-7-2 : 4x(4x − 2) − 2x(3x + 6) + 8x.
8. **Pythagore (LC/LS)** — dans le plan, dans l'espace (LS) ; **pas de réciproque** ; valeur exacte √n (a√b en 11e).
9. **Équations (LC/LS)** — 1er degré, mise en équation. E10-9-1 (MER10 FA198 j, FA199 f) : 2x + 1 = 4(2x + 4) − (4x + 8) ;
   1,2(x + 6) = 4,8 + 3x ; 5(x − 4) − 4(x + 1) = 4(x − 3) + 9.
10. **Proportionnalité** — échelle, pourcentages, pente. E10-10-1 : carte 1:25'000 → 1:50'000 ; plan d'appartement ;
   maquette 1:87. (Aires × k², volumes × k³ : 11e.)
11. **Fonctions (LC/LS)** — tableaux, x ↦ ax + b, ax² ; tracés. 12. **Polygones réguliers**. 13. **Rotations**.
14. **Diagrammes** — circulaires et en barres.

## 3. Audit (sonde `tests/_niv910.html`, non commitée : 4–6 tirages distincts par notion et par niveau, profil CH)

45 notions de 9e, 34 de 10e. Verdicts : **au niveau** ; **remonté** (niveau 1 trop facile → formes du niveau 2) ;
**corrigé** (formes hors programme écartées pour la classe, `HORS_CO` dans `src/engine.js`, et formes du programme
ajoutées, `VARX` / `PROBX` dans `src/variantes.js`, réservées à la classe par `q.co`) ; **à valider** (décision).

| Cl. | Ch. | Notion | N1 | N2 | N3 | N4 | Remarque |
|---|---|---|---|---|---|---|---|
| 9e | 1 | decread, deccomp | **remonté** (UP9) | au niveau | au niveau | = N3 | N1 « chiffre des unités de 98,245 », « le plus grand de 5,9 et 5,96 » (primaire) |
| 9e | 1 | decarr, ordgr, decadd, decmul, decdiv, decprob, tradexpr | au niveau | au niveau | au niveau | au niveau | révision du primaire prévue au plan (5 sem.) |
| 9e | 1 | dec10 | à valider | au niveau | au niveau | = N3 | N1 « 36,81 · 100 » (primaire, mais objectif 9NO2.04) |
| 9e | 1 | pow9 | au niveau | au niveau | au niveau | = N3 | |
| 9e | 1 | prio | au niveau | **corrigé** | **corrigé** | au niveau | N2 « (−2) − 5 · (−2) », N3 « −6² + (6 − 9)³ », « (4 − 7)² », « (−2)² » : produit de relatifs (10e) écarté ; N3 : + 3 formes (E9-1-2) |
| 9e | 2 | ulong, uaire, uvol, utemps | au niveau | au niveau | au niveau | = N3 | uvol, utemps : sensibilisation au plan |
| 9e | 3 | angtype | au niveau | au niveau | au niveau | = N3 | N3 « combien sont aigus ? » léger |
| 9e | 3 | quadri | **remonté** (UP9) | au niveau | **corrigé** | **corrigé** | N1 périmètre du losange ; N3 « axes de symétrie d'un carré » (primaire) → diagonales du rectangle, losange (isocèle) |
| 9e | 3 | angtri | au niveau | au niveau | **corrigé** | **corrigé** | polygones réguliers (10e) écartés ; + trapèze rectangle, 3 angles égaux, écarts ; défi : bissectrice dans un isocèle |
| 9e | 4 | multdiv, divcrit, premiers, arith | au niveau | au niveau | au niveau | au niveau | |
| 9e | 5 | perim, aire1 | **remonté** (UP9) | au niveau | au niveau | = N3 | N1 « triangle 3, 7, 9 cm », « carré de côté 9 » |
| 9e | 5 | aire2, aire3 | au niveau | au niveau | au niveau | = N3 | |
| 9e | 6 | relrep, reladd | au niveau | au niveau | au niveau | au niveau | |
| 9e | 7 | solides | **remonté** (UP9) | au niveau | au niveau | = N3 | N1 « faces d'un pavé » |
| 9e | 7 | volpave | au niveau | au niveau | au niveau | = N3 | |
| 9e | 8 | fracrep | à valider | au niveau | au niveau | = N3 | N1 « 2/9 ou 5/9 » (même dénominateur) |
| 9e | 8 | fracsimp, fractout | au niveau | au niveau | au niveau | = N3 | |
| 9e | 8 | fracconv | au niveau | au niveau | **corrigé** | au niveau | 0,(27), 0,5(8) (10e LS) écartés |
| 9e | 8 | fracper | au niveau | au niveau | **corrigé** | **corrigé** | périodes de 2 chiffres et mixtes (10e LS) écartées ; restent tiers et neuvièmes |
| 9e | 8 | fracadd | au niveau | **corrigé** | **corrigé** | au niveau | résultats négatifs, −2/3 + 7/4 − 7/6 (ℚ : 10e) écartés ; + 2 formes dans ℚ⁺ |
| 9e | 9 | proptab, prop, change, agrand | au niveau | au niveau | au niveau | = N3 | |
| 9e | 10 | litelab | au niveau | **corrigé** | **corrigé** | au niveau | « sous forme réduite », tour de magie (réduction : 10e) écartés ; + volume d'un pavé |
| 9e | 10 | valnum | **corrigé** | **corrigé** | **corrigé** | au niveau | « 4 − 5x pour x = −4 » (produit de relatifs : 10e) et x = 2/3 (× de fractions : 10e) écartés ; + 3 formes décimales (E9-10-1) |
| 9e | 11 | symetries | au niveau | au niveau | au niveau | au niveau | |
| 9e | 12 | diagr | au niveau | à valider | à valider | à valider | secteur circulaire (lecture au PE ; construction en 10e) ; moyenne pondérée |
| 10e | 1 | rel | au niveau | au niveau | au niveau | au niveau | |
| 10e | 2 | disque, grandmanq | au niveau | au niveau | au niveau | = N3 | |
| 10e | 3 | fracmul, fracops, pct | au niveau | au niveau | au niveau | au niveau | |
| 10e | 4 | vol, airelat, voldecomp | au niveau | au niveau | au niveau | au niveau | |
| 10e | 5 | vitesse | au niveau | au niveau | **corrigé** | **corrigé** | vitesse moyenne sur deux trajets / aller-retour (11e, E-4-2 de 11e) écartée ; à valider |
| 10e | 6 | carres, rac, sci, scicalc | au niveau | au niveau | au niveau | au niveau | |
| 10e | 6 | racenc | au niveau | à valider | au niveau | au niveau | N2 « 2√7 ou √26 » suppose a√b = √(a²b) |
| 10e | 6 | puiss | au niveau | au niveau | à valider | au niveau | N3 « (3/5)⁻³ », « 2⁻¹ + 3⁻² » (LS) |
| 10e | 7 | reduire | au niveau | au niveau | **corrigé** | au niveau | « (3x − 1)/3 + (2x − 7)/5 en une fraction » (ajout 11e du 25.11) écarté en 10e |
| 10e | 7 | monomes | au niveau | au niveau | à valider | au niveau | N3 quotient de monômes (plan : +, −, ×) |
| 10e | 7 | distrib | au niveau | **corrigé** | **corrigé** | **corrigé** | double distributivité (11e) écartée ; + 2 formes de simple distributivité (E10-7-1, E10-7-2) ; nouveau défi |
| 10e | 8 | pyth, pythfig | au niveau | **corrigé** | **corrigé** | au niveau | valeur exacte √n acceptée (a√b : 11e) ; cône (11e) écarté |
| 10e | 9 | eqverif, eqfrac, probeq | au niveau | au niveau | au niveau | au niveau | |
| 10e | 9 | eq1 | au niveau | **corrigé** | **corrigé** | au niveau | (x + 6)(x + 2) = …, (x + 2)² − (x − 1)² (11e), formules littérales (11e) écartées ; + 2 formes (E10-9-1) |
| 10e | 10 | echelle | au niveau | **corrigé** | **corrigé** | **corrigé** | aires × k², volumes × k³ (11e) écartés ; + 5 formes et un défi (cartes, plans, maquettes) |
| 10e | 10 | pctvar, pente | au niveau | au niveau | au niveau | au niveau | |
| 10e | 11 | tabval, repere | au niveau | au niveau | au niveau | au niveau | |
| 10e | 11 | affine | au niveau | à valider | **corrigé** | au niveau | inéquation graphique f(x) > g(x) écartée ; pente, droites parallèles : à valider |
| 10e | 12–13 | polyreg, rotation | au niveau | au niveau | au niveau | = N3 | |

« = N3 » : le défi reprend les formes du niveau 3 (pas de problème propre) ; à enrichir plus tard.
Aucun chapitre vide. Les règles de la nuit ne touchent pas la 9e et la 10e : `UP11` exige `grade === 11`, `UP2` (rel)
`grade >= 11`, `UPC` et `UPC_MIN` `grade >= 12`, `finalize` reste inchangé jusqu'à la 11e (vérifié dans le code et à la sonde : les formes
de niveau 1 de 9e–10e sortent toujours au niveau 1, hors `UP9`). Les nouvelles règles (`UP9`, `HORS_CO`, formes `q.co`) ne touchent que la 9e et
la 10e : vérifié en 11e (prio, valnum, distrib, eq1, fracadd, litelab : aucune forme ajoutée tirée).

## 4. Corrections (25.11)

- `src/engine.js` : `HORS_CO` (formes écartées par classe : contexte, énoncé ou réponse) et `horsCO()` (aussi utilisé par
  les sujets, `src/sujet.js`, et les QCM, `src/qcm.js`) ; si un niveau n'a plus de forme du programme, on descend d'un
  niveau. `UP9` (niveau 1 → 2 en 9e pour 6 notions). `racineCO()` : en 9e–10e, √n accepté sans simplification.
  `VARX` / `PROBX` lus en plus de `VAR` / `PROB` (les modules de chapitre vident `VAR[id]`).
- `src/variantes.js` : formes et défis de 9e et de 10e (section « 25.11 : audit de niveau 9e–10e »), réservés à la classe.
- `src/ch1c_eq.js` : défi des bougies (eq1) : hauteur commune non nulle (« 24 − 4 · 6 = 0 cm » sortait).
- `src/competences.js` : compétences de `echelle` (plus d'aires × k² en 10e).

## 5. Points à valider par l'enseignant

1. **UP9** : en 9e, le niveau 1 de decread, deccomp, perim, aire1, solides, quadri tire le niveau 2. D'accord ?
   (dec10, fracrep : N1 aussi proche du primaire, laissé.)
2. **Regroupements** : l'app vise R3 (9e) et LS (10e). Les objectifs R2/R3 (PGDC/PPMC, substitution, fractions + et −)
   et LC/LS (Pythagore, fonctions, équations) restent proposés à tous.
3. **Vitesse moyenne sur deux trajets** écartée en 10e (sensibilisation au plan, vitesse en 11e aux prescriptions).
4. **affine** en 10e : pente à partir de deux points, droite parallèle passant par un point — 10e ou 11e ?
5. **racenc** (2√7 ou √26), **puiss** ((3/5)⁻³), **monomes** (quotient) : à garder en 10e LS ?
6. **diagr** en 9e : angle d'un secteur circulaire et moyenne pondérée (le plan de 9e ne cite que la lecture et les
   diagrammes en colonnes).
7. Défis « = N3 » (decread, deccomp, perim, aire1, quadri…) : problèmes propres à écrire.
