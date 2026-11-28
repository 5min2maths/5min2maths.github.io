# Référentiel MP dans « Mes compétences » (26.11, branche agent/refmp)

Source : référentiel de l'enseignant `CFPT/Referentiel/referentiel_MP.csv` (150 objectifs, tirés du PEE MP 8 de
l'ordonnance 2026, `PEE_mp - 2026.docx`, et marqués PEC / * / facultatif). Contrôlé ligne par ligne contre le PEE 2026 :
conforme. PEC fédéraux (2012 et 2025) dans `~/DATA/Enseignement/Sources/Officiel/matu_pro_suisse/SEFRI/` (rien de
téléchargé). Générateur `tools/ref_mp.py` → `src/ref_mp.js` ; test `tests/referentiels.html#section=ref_mp` ; onglet « Référentiel MP » du suivi.

Affichage : profil MP (1re–4e) → en-tête « MP 2e », objectifs groupés « Semestre n — chapitre », note 1–6,
« travaillée en classe » sans question, années précédentes repliées, code en `title` seulement. « Savoir » retiré des
intitulés ; « PGCD » → « PGDC » (dénomination romande) ; « facultatif » ajouté aux 6 objectifs facultatifs.

## Couverture : 142 / 150 objectifs rattachés à des questions (139 avant les trous du 26.11)

| Année | Objectifs | Avec questions | Travaillés en classe |
|---|---|---|---|
| MP 1re (S1–S2) | 62 | 60 | 2 |
| MP 2e (S3–S4) | 30 | 27 | 3 |
| MP 3e (S5–S6) | 22 | 22 | 0 |
| MP 4e (S7–S8) | 36 | 33 | 3 |

Les questions de « Me tester » ne viennent que du catalogue MP (jamais une notion propre au Collège ou au CO).

## Sans question (8)

- Hors saisie (8) : S2.GE.01 figures élémentaires, S2.GE.03 vocabulaire du cercle, S3.FA.02 tracer une droite,
  S3.FQ.04 tracer une parabole, S4.AD.04 représenter des données, S7.VE.01 définition d'un vecteur, S7.VE.02 opérations
  graphiques sur les vecteurs, S8.FP.05 tracer une fonction transformée.
- Trous réels : aucun. Comblés le 26.11 (branche agent/trousmp, détail : `tools/niveau_mp12.md` § 6) :
  - S1.CN.04 passer d'une écriture à l'autre → `fracconv`, `sci` (notions de l'année de MP 1re depuis le 25.11, sans motif MP) ;
  - S2.GE.02 médiane, bissectrice, médiatrice → `droitesrem`, ouverte en MP 1re (semestre 2) ; formes hors du cours MP
    écartées pour la filière MP (`HORS_MP`, `src/engine.js` : cercle inscrit par formule, orthocentre), inchangées au Collège ;
  - S5.EA.04 équations paramétriques avancées (facultatif) → `eqparam` niveaux 2–3.

## À soumettre à l'enseignant

1. Volées 2026-27 : MP2 (et MP3–MP4) suivent l'ancien PEE (fonctions : généralités en S3, trigonométrie S3/S4,
   équations rationnelles et inéquations en MP1). L'app suit le PEE 2026 pour toutes les années : un élève de MP2 voit
   par exemple les inéquations en MP 4e. Garder un seul plan (choix actuel) ?
2. Les objectifs « * » (ajoutés par l'école) et facultatifs sont affichés comme les autres (facultatifs marqués).
3. Rattachements à valider : tables NIVEAUX, AJOUTS et SANS (dont S1.CN.04, S5.EA.04 du 26.11) et formes écartées HORS_MP de `tools/ref_mp.py` (MP 3e–4e et notions de soutien
   rattachées à la main, d'après les savoir-faire par niveau).
4. Quelques intitulés génériques sont identiques mot pour mot dans le Collège ou le CO (« Utiliser le théorème de
   Pythagore ») : chacun vient de sa source, le test vérifie qu'aucun intitulé propre à un système n'apparaît ailleurs.
