# /contenu niveau 10e — 28.11.2026 (branche `agent/contenu5`)

Objectif : terminer l'audit de niveau de la 10e du CO (Genève). Référence : plan de cheminement 10e 2026-27
(`Bude/PER/Plans de cheminement 26-27 (2).pdf`), MER 10e 2025 (`Nouveaux MER 2024/MER complets 10eme/Livre_10E_2025.pdf`),
prescriptions cantonales ; haut du programme (LS). Données seulement ; aucun fichier de notes ni donnée d'élève ouvert.
Document de fond mis à jour : `tools/niveau_910.md` (§ 2 étalons 10e, § 3 audit, § 4 corrections, § 5 points 8–10).
Registre : `tools/niveau.json` (30 notions ajoutées en 10e, entrées ou `par_classe["10e"]`).

## Méthode

Sonde non commitée `tests/_niv_10e.html` (`#g=10&n=6&ids=…`) : profil CH 10e, catalogue « de l'année », tirages par
`Engine.make` sans graine (comme une séance : `HORS_CO` et `q.co` appliqués), 6 à 8 tirages par notion et par niveau 1–4.
Le catalogue de 10e compte 63 notions de l'année : 33 auditées le 25.11 (re-sondées, aucun écart nouveau) et 30 nouvelles
(notions de 9e reprises au plan de 10e et notions de l'agent PER).

## Verdicts (30 notions)

| Notion | Ch. | Verdict | Ce qui a été vu / fait |
|---|---|---|---|
| prio | 1 | remonté | N1 « 37 − 16 : 2 » (9e) → niveau 2 (relatifs) |
| decadd, reladd | 1 | remonté | N1–N2 primaire / 9e → niveau 3 ; reladd 3 « regrouper » : « 7 + 11 + 9 + 4 + 8 » corrigé |
| decmul, decdiv, ordgr | 1 | remonté | N1 → 2 |
| numer | 1 | remonté | MER 10e (numération) ; N1 → 2 |
| dec10 | — | hors programme | pas d'objectif de 10e : retiré de l'année |
| proptab | — | hors programme | pas d'objectif de 10e : retiré de l'année |
| aire3 | 2 | corrigé | polygones seulement ; + demi-disque, quart de disque, stade (4 formes) |
| arith, premiers | 3 | à valider | « CT » au plan, travaillés dans les MER 10e ; N1 → 2 |
| fracadd, fracsimp, fractout, fracconv | 3 | remonté | N1 → 2 |
| fracrep | 3 | corrigé | ℚ⁺ seulement ; + fractions négatives (4 formes) |
| fracper | 3 | au niveau | objectif LS de 10e |
| solides | 4 | corrigé | pyramide absente des niveaux 2–3 ; + 3 formes |
| uvol, utemps | 4–5 | au niveau | |
| ensco | 6 | au niveau | |
| valnum | 7 | corrigé | formule du rectangle (13 × 7) écartée ; + 2 formes avec relatifs |
| litelab | 7 | au niveau | |
| litconv | 7 | corrigé | double distributivité (11e) écartée ; + 1 forme (deux simples distributivités) |
| prop | 10 | remonté | règle de trois de 9e : N1–N2 → 3 |
| fctlec, agrand, isom, diagr | 11–14 | au niveau | |

Bilan des 30 nouvelles : 9 au niveau, 12 remontées, 5 corrigées, 2 hors programme (retirées de l'année), 2 à valider
(arith, premiers). Les 33 du 25.11 sont inchangées ; il y reste à valider racenc 2, puiss 3, monomes 3, affine 2 (§ 5 n° 4–5).
La 10e a désormais 61 notions de l'année, toutes auditées.

## Corrections (commit sur `agent/contenu5`)

- `src/engine.js` : **UP10** (niveau minimal en 10e de 17 notions reprises de 9e ; niveau affiché inchangé) ; `HORS_CO[10]`
  litconv (`equiv-double`), valnum (`aire`, `perim`) ; **défaut du moteur** : la mémoire « ctx vu dans les 2 dernières
  questions » ne retenait que les questions à ctx, si bien qu'une ou deux formes à ctx mêlées à des formes sans ctx
  n'étaient presque plus tirées (1 sur 60 au lieu de 10–14) : 42 couples notion × niveau touchés, toutes classes ;
  désormais les 2 dernières questions, avec ou sans ctx (règle du 14.11).
- `src/gen3.js` : dec10, proptab hors de l'année de 10e ; indice et leçon de solides (pyramide), indice de fracrep (négatifs).
- `src/variantes.js` : 13 formes réservées à la 10e (`q.co = [10]`), avec pas à pas, pièges, ctx : fracrep 2–3, aire3 2–3,
  solides 2–3, valnum 1. `src/perco.js` : litconv 3 « equiv-deuxsimples ». `src/ch10_no.js` : reladd 3 « regrouper ».
  `src/competences.js` : solides 2–3 « Décrire un prisme droit ou une pyramide ».
- Figures : aucune ajoutée (énoncés descriptifs suffisants ; à revoir au mode `figures` pour fenêtre et stade).
- Contrôle : `tests/parcours.html#section=niv10` (règles, formes tirées en 10e et jamais en 9e, recalcul indépendant).

## À décider (enseignant)

1. arith, premiers en 10e (« CT » au plan, MER 10e) : garder (niveau 1 remonté) ou retirer de l'année ?
2. dec10, proptab retirés de l'année de 10e : d'accord ?
3. decadd, reladd, prop au niveau 3 dès le niveau 1 en 10e (révision au plan) : garder, ou retirer ces notions de l'année ?
4. Points du 25.11 encore ouverts : vitesse moyenne sur deux trajets écartée en 10e ; affine 2 (pente par deux points,
   parallèle) ; racenc 2 (a√b), puiss 3 (exposants négatifs de fractions), monomes 3 (quotient) en 10e LS ?

## Ordre proposé pour le « nickel » de la 10e (chapitre par chapitre, liste de contrôle de `chantier_11e.md`)

Critère : chapitres que les élèves de 10e rencontrent bientôt (fin novembre : chapitre 4 en cours), puis les reprises.
1. **Ch. 6 Puissances et racines** (janvier) : carres, rac, racenc, sci, scicalc, puiss, ensco — points à valider à trancher d'abord.
2. **Ch. 7 Calcul littéral** (février–mars) : reduire, monomes, distrib, valnum, litelab, litconv — chapitre le plus long, cœur LS.
3. **Ch. 9 Équations** : eq1, eqfrac, eqverif, probeq — en lien direct avec le chapitre 7.
4. **Ch. 8 Pythagore** : pyth, pythfig (pas de réciproque, √n).
5. **Ch. 10 Proportionnalité** : echelle, pctvar, pente, prop.
6. **Ch. 11 Fonctions** : tabval, repere, affine, fctlec (objectif minimal du plan : « jusqu'aux fonctions »).
7. **Ch. 4 3D** (en cours : finir les défis et figures) : vol, airelat, voldecomp, solides, uvol.
8. Reprises : **Ch. 3 Fractions** (le plus de notions : fracrep… fracops, pct, arith), **Ch. 1 Relatifs**, **Ch. 2 Aires**.
9. Courts : **Ch. 5 Unités**, **Ch. 12 Polygones réguliers**, **Ch. 13 Transformations**, **Ch. 14 Diagrammes**.

## Tests

Pages de thème `parcours` (nouvelle section `niv10`), `variantes`, `questions`, `variete_niveaux`, `france` : vertes.
Suite rapide (49 pages) : 2 échecs, tous deux expliqués : `france` (empreinte du catalogue suisse 10e, changée exprès
par le retrait de dec10 et proptab : mise à jour, page verte) et `poids.py ordre` (docs/ non reconstruit : avec docs/
reconstruit en local, 19 profils ok, 0 échec ; docs/ remis ensuite, rien de commité). Moteur touché (mémoire des ctx) :
suite complète conseillée avant publication (`publier.sh --complet`).
