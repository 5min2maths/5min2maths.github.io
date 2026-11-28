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

### 10e (PLAN10 ; complété le 28.11 avec les MER 10e 2025, `Livre_10E_2025.pdf`)
Le plan de 10e reprend des notions de 9e (révision des décimaux au chapitre 1, PGDC/PPMC « CT » au chapitre 3, solides au
chapitre 4) : en 10e, leur niveau 1 n'est plus un automatisme de l'année (règle UP10, § 4). Référence : LS.
1. **Relatifs et révision des décimaux** — 4 opérations dans ℤ (LC/LS), révision des 4 opérations sur les décimaux et des
   priorités, systèmes de numération (MER 10e, « Exploration de quelques systèmes de numération », NO95 numération grecque).
   E10-1-1 : (−3)³ − 2 · (−5) + (−1)³. E10-1-2 : (−9) − 4 · (−9) + 7 ; 2,6 + 2,4 − 8,4. E10-1-3 : 9 − (−6) − 6 − (−9) ;
   −[−2 − (6 − 8) · 2] + 5. E10-1-4 : écrire 1419 en chiffres romains, 100110 (base 2) en base 10.
2. **Aires et périmètres** — disque, arc et secteur (LC/LS), aire et périmètre **par décomposition, avec des parties de
   disque** (MER 10e GM29 « Place de jeux » : hexagone et demi-disques), grandeur manquante. E10-2-1 : secteur de 150°,
   r = 5 cm. E10-2-2 : fenêtre = rectangle 80 × 140 cm surmonté d'un demi-disque ; plaque carrée moins un quart de
   disque. E10-2-3 : tour de piste (deux droites de 100 m, deux demi-cercles de 60 m de diamètre) ; aire de la pelouse.
3. **Écriture fractionnaire et arithmétique** — nombres premiers, décomposition, PGDC, PPMC (CT ; MER 10e NO14–NO21) ;
   dans ℚ : comparaison, encadrement, droite numérique (fractions **négatives**), simplification, amplification ;
   4 opérations dans ℚ (LS), pourcentages, périodiques → fraction (LS). E10-3-1 : la plus grande de −3/4 et −5/6 ;
   encadrer −25/8 entre deux entiers ; nombre d'entiers entre −24/5 et 3/2. E10-3-2 : 0,2363636… = 13/55 (LS).
   E10-3-3 : (3/4 − 1/6) : 7/9 ; (−7/4) : 9/2. E10-3-4 : PGDC de 56 et 32 (problème de sachets), 2² · 3 · 5².
4. **3D** — prismes droits, cylindre (LC/LS), **pyramide** (reconnaissance, faces, arêtes, sommets ; MER 10e ES49–ES63),
   décomposition, unités de volume et de capacité (m³ ↔ L). E10-4-1 : cylindre creux. E10-4-2 : pyramide à 18 arêtes :
   combien de faces ? ; pyramide à 12 sommets : combien d'arêtes ? E10-4-3 : 2,6 m³ en hL ; 4,4 cL en cm³.
5. **Unités** — temps et vitesses (sensibilisation). E10-5-1 : 60 km à 90 km/h en minutes ; 2 h 5 min 26 s en s.
6. **Puissances et racines** — carrés parfaits, √ et ∛ dans ℝ⁺, encadrement, notation scientifique, propriétés (LC/LS),
   ensembles ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ (irrationnels : √n non carré). E10-6-1 : √83 entre 9 et 10 ; (4/5)⁻² ; 6 · 10³ + 1,5 · 10².
7. **Calcul littéral** — conventions d'écriture, expressions équivalentes (LC/LS ; contre-exemple), substitution avec
   relatifs, élaboration, réduire ; × de monômes (degré 6 LS) ; **simple distributivité**. E10-7-1 (MER10 FA170) :
   1,5x + 4(x − 1) ; 3(3x − 2) − 4(4x − 2). E10-7-2 : 4x(4x − 2) − 2x(3x + 6) + 8x. E10-7-3 : laquelle est égale à
   4(x − 2) − 5(x + 4) ? ; (5x − 3)/3 pour x = −6.
8. **Pythagore (LC/LS)** — dans le plan, dans l'espace (LS) ; **pas de réciproque** ; valeur exacte √n (a√b en 11e).
9. **Équations (LC/LS)** — 1er degré, mise en équation. E10-9-1 (MER10 FA198 j, FA199 f) : 2x + 1 = 4(2x + 4) − (4x + 8) ;
   1,2(x + 6) = 4,8 + 3x ; 5(x − 4) − 4(x + 1) = 4(x − 3) + 9.
10. **Proportionnalité** — échelle, pourcentages (augmentation, diminution), pente ; règle de trois en reprise (niveau 3
   de 9e au moins). E10-10-1 : carte 1:25'000 → 1:50'000 ; plan d'appartement ; maquette 1:87. (Aires × k², volumes × k³ : 11e.)
11. **Fonctions (LC/LS)** — tableaux, x ↦ ax + b, ax² ; tracés ; lire un graphique, reconnaître une situation de
   proportionnalité ou affine. 12. **Polygones réguliers**. 13. **Rotations, agrandissements et réductions** (LC/LS),
   isométries (reprise de 9e et composition). 14. **Diagrammes** — circulaires (angle d'un secteur) et en barres, moyenne.

## 3. Audit (sonde `tests/_niv910.html`, non commitée : 4–6 tirages distincts par notion et par niveau, profil CH ; 10e complétée le 28.11)

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

**Suite de l'audit de la 10e (28.11, `/contenu niveau 10e`, sonde `tests/_niv_10e.html` non commitée : profil CH 10e, tirages
par `Engine.make` sans graine, 6–8 par notion et par niveau ; rapport `archive/contenu_niveau10_28-11.md`).** Le catalogue de
10e compte 63 notions « de l'année » (chapitre de 10e dans `CO_BY` ou `again: [10]`) : les 33 ci-dessus et 30 notions de 9e
reprises en 10e ou ajoutées par l'agent PER. **UP10** = niveau 1 (et 2) remonté en 10e (§ 4).

| Cl. | Ch. | Notion | N1 | N2 | N3 | N4 | Remarque |
|---|---|---|---|---|---|---|---|
| 10e | 1 | prio | **remonté** (UP10 → 2) | au niveau | au niveau | au niveau | N1 « 37 − 16 : 2 », « 8 + 3 · 3 » (9e) |
| 10e | 1 | decadd, reladd | **remonté** (→ 3) | **remonté** (→ 3) | au niveau | au niveau | « 18,70 + rendu sur 20 CHF », « (−9) + (−4) » : primaire et 9e ; « révision » au plan |
| 10e | 1 | decmul, decdiv, ordgr | **remonté** (→ 2) | au niveau | au niveau | au niveau | N1 « 6,5 : 1000 », « arrondis 5506 à la centaine » |
| 10e | 1 | reladd (N3 « regrouper ») | | | **corrigé** | | « 7 + 11 + 9 + 4 + 8 » sortait (que des positifs, aussi en 9e) : 2 négatifs et 2 positifs au moins |
| 10e | 1 | numer | **remonté** (→ 2) | au niveau | au niveau | au niveau | MER 10e : systèmes de numération ; N1 « 7 · 10³ + 2 · 10² + 9 » (9e) |
| 10e | — | dec10 | **hors programme** | | | | pas au plan de 10e (9NO2.04) : retiré de l'année (`again: [10]` supprimé), reste en remobilisation |
| 10e | — | proptab | **hors programme** | | | | 9FA1.01 ; en 10e, prop, echelle, pctvar, pente : retiré de l'année |
| 10e | 2 | aire3 | **remonté** (→ 2) | **corrigé** | **corrigé** | au niveau | polygones seulement (9e) : + fenêtre à demi-disque, plaque moins quart de disque (N2), piste et pelouse de stade (N3), `q.co = [10]` |
| 10e | 3 | arith, premiers | **remonté** (→ 2) | au niveau | au niveau | au niveau | PGDC/PPMC « CT » au plan, travaillés dans les MER 10e (NO14–NO21) ; à valider (§ 5) |
| 10e | 3 | fracadd | **remonté** (→ 2) | au niveau | au niveau | au niveau | N1 « 1/6 + 2/6 » ; N2–N3 dans ℚ (négatifs permis en 10e) |
| 10e | 3 | fracsimp, fractout, fracconv | **remonté** (→ 2) | au niveau | au niveau | au niveau | N1 « 1/6 = ?/30 », « 3/4 de 24 km », « 0,6 en fraction » |
| 10e | 3 | fracrep | **remonté** (→ 2) | **corrigé** | **corrigé** | au niveau | dans ℚ⁺ seulement (9e) : + comparer, ranger, encadrer, compter des entiers avec des fractions négatives |
| 10e | 3 | fracper | au niveau | au niveau | au niveau | au niveau | conversion périodique → fraction = objectif LS de 10e |
| 10e | 4 | solides | **remonté** (→ 2) | **corrigé** | **corrigé** | au niveau | pyramide (10e) absente des niveaux 2–3 : + faces, arêtes, sommets d'une pyramide, et le chemin inverse |
| 10e | 4 | uvol | au niveau | au niveau | au niveau | au niveau | m³ ↔ L = objectif de 10e |
| 10e | 5 | utemps | au niveau | au niveau | au niveau | au niveau | sensibilisation au plan |
| 10e | 6 | ensco | au niveau | au niveau | au niveau | au niveau | ℝ, irrationnels avec les racines |
| 10e | 7 | valnum | **corrigé** | au niveau | au niveau | au niveau | « A = L · l pour 13 et 7 cm », « P = 2(L + l) » écartés en 10e ; + (5x − 3)/3 et 5(x − 9) pour x négatif |
| 10e | 7 | litelab | au niveau | au niveau | au niveau | au niveau | élaboration (LC/LS) ; réduction permise en 10e |
| 10e | 7 | litconv | au niveau | au niveau | **corrigé** | au niveau | « (a − 1)(a − 3) » (double distributivité, 11e) écarté en 10e ; + 4(x − 2) − 5(x + 4) |
| 10e | 10 | prop | **remonté** (→ 3) | **remonté** (→ 3) | au niveau | au niveau | règle de trois de 9e (« 4 cahiers coûtent 32 CHF ») |
| 10e | 11 | fctlec | au niveau | au niveau | au niveau | au niveau | lire un graphique, reconnaître proportionnalité / affine |
| 10e | 13 | agrand, isom | au niveau | au niveau | au niveau | au niveau | agrandissements (LC/LS) ; isométries, rotation d'un quart de tour, compositions |
| 10e | 14 | diagr | au niveau | au niveau | au niveau | au niveau | angle d'un secteur = objectif de 10e |

Re-sondage des 33 notions de 10e du 25.11 (4 tirages) : aucun écart nouveau. Défaut du moteur trouvé en passant (corrigé,
§ 4) : la mémoire « contexte vu dans les 2 dernières questions » ne retenait que les questions à ctx ; dans une notion où
une ou deux formes ont un ctx et les autres non, ces formes restaient « vues » et n'étaient presque plus tirées (1 fois sur
60 au lieu de 10) : 42 couples notion × niveau concernés, toutes classes (dec10 2, relrep 2–3, fracrep 2–3, aire3 2–3,
solides 3, quadri 3, pct 2, disque 2, eqverif 3, rotation 3, eqrat, log, cercletan…).

« = N3 » : le défi reprend les formes du niveau 3 (pas de problème propre) ; à enrichir plus tard.
Aucun chapitre vide. Les règles de la nuit ne touchent pas la 9e et la 10e : `UP11` exige `grade === 11`, `UP2` (rel)
`grade >= 11`, `UPC` et `UPC_MIN` `grade >= 12`, `finalize` reste inchangé jusqu'à la 11e (vérifié dans le code et à la sonde : les formes
de niveau 1 de 9e–10e sortent toujours au niveau 1, hors `UP9`). Les nouvelles règles (`UP9`, `HORS_CO`, formes `q.co`) ne touchent que la 9e et
la 10e : vérifié en 11e (prio, valnum, distrib, eq1, fracadd, litelab : aucune forme ajoutée tirée).

## 4. Corrections (25.11 ; 28.11 pour la 10e)

28.11 (branche `agent/contenu5`) :
- `src/engine.js` : **UP10** (niveau minimal en 10e des notions de 9e reprises : prio, arith, premiers, fracadd, fracsimp,
  fracrep, fracconv, fractout, decmul, decdiv, ordgr, aire3, solides, numer → 2 ; decadd, reladd, prop → 3 ; niveau affiché
  inchangé, code `…-2-…`) ; `HORS_CO[10]` : `litconv` (equiv-double), `valnum` (aire, perim) ; mémoire des ctx
  (`recentCtx` : les 2 dernières questions, avec ou sans ctx).
- `src/gen3.js` : dec10 et proptab plus « de l'année » en 10e ; solides (indice, leçon) et fracrep (indice) : pyramide,
  fractions négatives. `src/competences.js` : solides 2–3 « Décrire un prisme droit ou une pyramide ».
- `src/variantes.js` (section « 28.11 : audit de niveau 10e ») : 13 formes réservées à la 10e (`q.co = [10]`) : fracrep 2–3
  (4), aire3 2–3 (4), solides 2–3 (3 : pyr-faces / sommets / arêtes, pyr-inverse-faces, pyr-inverse-aretes), valnum 1 (2).
  `src/perco.js` : litconv 3 « equiv-deuxsimples ». `src/ch10_no.js` : reladd 3 « regrouper » avec des négatifs.
- Contrôle : `tests/parcours.html#section=niv10` (chaque règle, formes tirées en 10e et jamais en 9e, recalcul indépendant
  des 13 formes sur 120 graines).

25.11 :

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
8. (28.11) **arith, premiers en 10e** : le plan de 10e les réserve au regroupement CT ; les MER 10e les travaillent
   (NO14–NO21). Gardés (niveau 1 remonté) ou retirés de l'année de 10e (comme dec10 et proptab) ?
9. (28.11) **dec10, proptab retirés de l'année de 10e** (pas d'objectif de 10e) : d'accord ? Ils restent en remobilisation.
10. (28.11) **UP10 : decadd, reladd, prop au niveau 3 dès le niveau 1** (révision au plan) : les trois niveaux se ressemblent ;
   autre choix : retirer ces trois notions de l'année de 10e (rel, fracops, pctvar couvrent l'année).

## 6. « Nickel » 10e (chapitre par chapitre, liste de contrôle de `chantier_11e.md`)

| Ch. | Notions | État | Rapport |
|---|---|---|---|
| 7 Calcul littéral | litelab, valnum, reduire, monomes, distrib, litconv | cases 1–9, 11, 12 ✓ ; test de préparation `RICH.litt10` (T1–T6 ✓) ; **contrôle par l'enseignant (15, T7) à faire** | `archive/contenu_nickel10_ch7_28-11.md` |
| 8 Pythagore | pyth, pythfig | cases 1–9, 11, 12 ✓ ; test de préparation `RICH.pyth10` (T1–T6 ✓) ; **contrôle par l'enseignant (15, T7) à faire** | `archive/contenu_nickel10_ch8_28-11.md` |
| 6 Puissances et racines | carres, rac, racenc, sci, scicalc, puiss, ensco | attend les décisions § 5 n° 5 | — |

Ch. 7 (28.11, branche `agent/contenu7`) : + 8 formes de 10e (`q.co = [10]`, `variantes.js`) et 2 défis (programme de
calcul, allée autour d'un jardin) ; HORS_CO[10] : valnum « trapeze », litelab « nombre entier qui suit » ; textes de 10e
pour « Développer » (TXT_CO, `engine.js` : exemple, indice, rappel sans double distributivité ; leçon active à simple
distributivité, `act_manip2.js`) ; sujet de préparation de 10e = `RICH.litt10` (avant : banque de 11e). Contrôle :
`tests/parcours.html#section=nickel10_ch7`. Reste : 9e (9C10) tire encore la banque de 11e ; monomes N3 quotient à valider.

Ch. 8 (28.11, branche `agent/contenu9`) : plan « ⚠️ Pas de réciproque », plan (LC/LS) et espace (LS), √n (a√b en 11e).
+ 11 formes de 10e (`q.co = [10]`, fin de `variantes.js` : échelle sous la fenêtre, randonnée, tyrolienne, rampe, hauteur
issue de l'angle droit, jogging, losange, trapèze rectangle, armoire, chalet, hexagone ; modelées sur MER 10e GM62–GM70)
et 2 défis (antenne, armoire) ; `racine10` (engine.js) : corrigés, étapes et réponse en √n en 9e–10e ; rappel et indice de
10e (TXT_CO) ; leçon active sans réciproque en 10e ; sujet de préparation `RICH.pyth10` (avant : banque de 11e). Étalons :
E10-8-1 (MER GM62) : échelle, fenêtre à 6 m, pied à 2 m → √40 ≈ 6,32 m. E10-8-2 (GM68, GM69) : trapèze rectangle (côté
oblique → hauteur → aire) ; losange de diagonales 15 et 20 cm → côté 12,5 cm. E10-8-3 (GM63, GM64, LS) : armoire
236 × 60 cm à redresser sous 2,5 m ; casier 80 × 150 × 60 cm et skis de 1,70 m. E10-8-4 (GM70) : hauteur issue de
l'angle droit (AC = 6, AB = 10 → 4,8 cm). Contrôle : `tests/parcours.html#section=nickel10_ch8`.
