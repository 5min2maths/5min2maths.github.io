# Ouverture de 5min2maths à la France — audit et plan (25.11.2026)

Chantier AA de la feuille de route (ROADMAP § 5, « France d'abord » ; jalon : pas d'ouverture avant juin 2027). Branche
`agent/france`. Ce document fait la synthèse des trois chantiers déjà menés (`tools/couverture_fr.md` collège et programmes,
`tools/seconde_fr.md`, `tools/premiere_terminale_fr.md`), y ajoute une sonde de l'app en profil français (25.11), les
adaptations d'usage, le cadre légal, la diffusion et un plan chiffré. Sources officielles : `~/DATA/Enseignement/Sources/Officiel/France/`
(README de `Officiel/`, droits du ministère, usage interne). Rien n'est encore visible des élèves : la France reste masquée
(`SYSTEMS_HIDDEN`), sauf aperçu sur l'appareil de l'enseignant (`…/#france`, voir § 6).

## 0. En bref

- **Contenus** : le collège est couvert à 90 % des attendus saisissables, la 2nde à 97 %, la 1re spécialité à 57 % → ≈ 80 % avec
  les notions créées le 23.11, la terminale à 20 % (pas de limites de fonctions, dérivation, intégrales, logarithme népérien
  propre). Classes jouables aujourd'hui : **6e → 1re** ; la Tle n'est pas prête.
- **Niveau (priorité absolue)** : les règles de relèvement du niveau 1 (« jamais un automatisme d'une année inférieure »),
  posées pour la 9e, la 11e, le Collège et la MP, **ne s'appliquent pas aux profils français**. Une élève de 3e, de 2nde ou de
  1re reçoit au niveau 1 des questions de 5e–4e sur toutes les notions reprises (`againFR`). C'est le premier chantier avant toute
  ouverture (§ 3, § 7 étape 1).
- **Usages suisses visibles** (sonde du 25.11, 6e → Tle, tout le catalogue, niveaux 1–3, 12 graines) : 1'372 questions avec
  CHF ou « francs », 962 avec l'apostrophe des milliers, 182 avec PGDC / PPMC, 120 avec « mise en évidence », 73 avec « préimage », 37 avec
  un lieu suisse. **Corrigé le 25.11** pour le profil français (§ 6) : dans les questions, il ne reste que le point médian du produit (à
  décider) ; contrôle permanent : `tests/france.html` (toutes les classes, 7'800 questions, écrans et leçons).
- **Défauts corrigés au passage** : en 2nde, les 33 automatismes repris du collège n'étaient plus « de l'année » (19 notions au
  lieu de 52) ; une Tle française recevait les chapitres de 1re du Collège de Genève comme « de l'année » (relatifs,
  Pythagore…) ; les énoncés de change EUR ↔ CHF et « en Suisse » sont écartés du tirage français.
- **Cadre légal** : l'app est déjà proche du RGPD (pas de compte, rien de nominatif, polices et MathJax servis localement) ;
  le point dur restant est le cas des moins de 15 ans (consentement de l'élève ET d'un parent) et l'hébergement des statistiques chez Google (États-Unis) ; depuis le 24.11, rien n'est envoyé sans accord (option A faite)
  (§ 5). Voir `tools/confidentialite.md` (option A : consentement, **faite le 24.11** ; option B : réception dans l'UE, à décider).
- **Concurrence** : MathALÉA (Coopmaths) et MathsMentales sont gratuits, alignés sur les programmes et très utilisés par les
  enseignants ; Sésamath (LaboMEP), Kwyk (freemium), MIA Seconde (ministère). La place de 5min2maths : **l'élève seul, chaque
  jour, 5 minutes, sans compte**, avec adaptation (Mathélo), leçons actives et préparation d'évaluation — pas un outil de
  l'enseignant pour fabriquer des fiches.

- **Audit du lycée (26.11, branche agent/frlycee)** : placement, formes hors programme, vocabulaire et niveau de la 2nde,
  de la 1re et de la Tle contrôlés contre les textes en vigueur : `tools/audit_fr_lycee_26-11.md` (test `tests/frplace.html`).

## 1. Programmes et examens en vigueur (2026-2027)

Détail attendu par attendu : `tools/couverture_fr.md` § 1 et § 6 (JSON `tools/referentiels_fr.json`).

| Classe | Âge | Texte 2026-2027 | Nouveau texte | Examen |
|---|---|---|---|---|
| 6e | 11–12 | cycle 3, BO 16 du 17.04.2025 | — | — |
| 5e | 12–13 | **cycle 4, BO 10 du 05.03.2026** | — | — |
| 4e | 13–14 | programme 2020 + attendus 2019 | 2026 en 2027-2028 | — |
| 3e | 14–15 | programme 2020 + attendus 2019 | 2026 en 2028-2029 | **DNB** |
| 2nde GT | 15–16 | **programme 2026** (BO 14 du 02.04.2026) | — | — |
| 1re générale | 16–17 | **programme 2026** : spécialité, ou maths intégrées à l'enseignement scientifique | — | **épreuve anticipée de maths** |
| Tle générale | 17–18 | 2019 (spécialité, complémentaires, expertes) | 2026 en 2027-2028 (sauf expertes) | bac (spécialité) |

Nouveautés à connaître (sources secondaires consultées le 25.11, à vérifier sur Eduscol avant toute communication) :

- **DNB** : depuis la session 2026, épreuves finales 60 %, contrôle continu 40 %. Maths : environ 2 h, **partie 1
  « automatismes et applications directes » (6 points, ≈ 20 min, sans calculatrice, sans justification, ≈ 9 questions)**,
  puis partie 2 « raisonnement et résolution de problèmes » (14 points, calculatrice). Sujets de référence 2027 publiés sur
  Eduscol (septembre 2026). Le DNB n'est pas (ou pas encore) une condition d'entrée en 2nde ; les « prépa-seconde » sont restées
  marginales.
- **Groupes de besoins** (choc des savoirs, 2024) : 6e–5e, assouplis à partir de 2025-2026 (rendus facultatifs ou réduits
  selon les établissements). Pour l'app : la différenciation est son terrain naturel (Mathélo), sans dépendre de ce dispositif.
- **Épreuve anticipée de mathématiques en 1re** (première session : 12 juin 2026, compte pour le bac 2027) : 2 h, sans
  calculatrice, coefficient 2 ; **partie 1 automatismes en QCM sur 6 points**, partie 2 exercices sur 14 points. Deux sujets :
  avec et sans spécialité maths (élèves sans spécialité : programme de maths de l'enseignement scientifique). La liste des
  automatismes est fixée par note de service. **C'est la cible la plus naturelle de l'app en France** : automatismes
  quotidiens, sans calculatrice, pour tous les élèves de 1re générale et technologique.
- **Automatismes** partout : les programmes 2025-2026 (cycle 3, cycle 4, 2nde, 1re) en font une rubrique à part. Le format
  « 5 questions par jour sans calculatrice » de l'app y correspond exactement.

Sources consultées le 25.11 (secondaires, à confirmer par les textes officiels) : [education.gouv.fr, épreuve anticipée de
mathématiques](https://www.education.gouv.fr/reussir-au-lycee/epreuve-anticipee-de-mathematiques-en-classe-de-premiere-450607),
[digiSchool, sujets de référence du brevet 2027](https://www.digischool.fr/articles/college/brevet/sujets-de-reference-brevet-2027/),
[L'Étudiant, nouveau brevet et groupes de besoin](https://www.letudiant.fr/college/nouveau-brevet-fin-des-groupes-de-besoin-ce-qui-change-pour-les-collegiens-en-2026.html).
Rien de nouveau téléchargé : les programmes sont déjà dans `Sources/Officiel/France/` (23.11).

### Chapitres par classe (résumé)

| Classe | Chapitres (programmes) |
|---|---|
| 6e | nombres entiers et décimaux, fractions (partage, quotient, repérage), opérations, proportionnalité et pourcentages simples, grandeurs (longueurs, aires, volumes du pavé, durées), géométrie plane (figures, symétrie axiale, angles), motifs évolutifs, automatismes |
| 5e (2026) | relatifs (addition, soustraction, repérage), fractions (égalité, comparaison, somme), calcul littéral (expressions, distributivité simple, tester une égalité), équations simples, proportionnalité, statistiques (fréquences), probabilités (vocabulaire), aires et volumes (prisme, cylindre), symétrie centrale, angles et parallélisme, triangle (inégalité, somme des angles) |
| 4e (2019 → 2026) | relatifs (produit, quotient), fractions (produit, quotient), puissances, notation scientifique, nombres premiers, calcul littéral (développer, réduire, factoriser simple), équations du 1er degré, programmes de calcul, proportionnalité (quatrième proportionnelle, ratios en 2026), Pythagore (et réciproque), Thalès (triangles emboîtés en 2019), cosinus (2019), translations, pyramide et cône, statistiques (médiane, étendue), probabilités |
| 3e (2019 → 2026) | arithmétique (diviseurs, nombres premiers, fractions irréductibles), puissances, racines carrées, identités remarquables et factorisation, équations produit nul et x² = a, inéquations (2026), fonctions (notation f(x), image, antécédent, affine et linéaire), pourcentages d'évolution, Thalès (configuration papillon) et réciproque, trigonométrie (sin, cos, tan), homothéties, rotations, vecteurs (2026), sphère et sections, statistiques, probabilités ; DNB |
| 2nde (2026) | automatismes (AU.01–18), nombres et calculs (intervalles, inéquations, fraction irréductible, comparer par différence ou quotient), géométrie (vecteurs et coordonnées, droites, colinéarité), fonctions (de référence, tableau de signes, variations, extrémums), statistiques et probabilités (deux variables, probabilités conditionnelles en tableau), algorithmique (Python) |
| 1re spé (2026) | automatismes, suites (arithmétiques, géométriques, sommes), second degré, dérivation et variations, exponentielle, trigonométrie (radians), produit scalaire, géométrie repérée, probabilités conditionnelles, variables aléatoires |
| Tle spé (2019) | suites et récurrence, limites, continuité (TVI), dérivation et convexité, logarithme népérien, primitives, équations différentielles, intégrales, dénombrement, géométrie dans l'espace, loi binomiale, sommes de variables aléatoires, loi des grands nombres |

## 2. Couverture actuelle de l'app, classe par classe (sonde du 25.11)

Catalogue d'un profil `{ system: "FR", grade }` (`Engine.catalog`), après les chantiers du 22–23.11 (`src/fr_college.js`,
`src/fr_2nde.js`, `src/fr_lycee.js`).

| Classe | Notions au catalogue | « De l'année » | Taux d'attendus couverts | Verdict | Manques principaux |
|---|---|---|---|---|---|
| 6e | 29 | 29 | 86 % | 🟡 jouable | constructions (non saisissables) ; contextes de fractions-partage ; niveau 3 plafonné à 2 (`difficultyCap`) |
| 5e | 57 | 52 | 90 % | 🟡 jouable | statistiques (fréquences) en partie ; vocabulaire « préimage », « mise en évidence » (corrigé) |
| 4e | 81 | 55 | 91 % (2019 : 94 %) | 🟡 jouable | cosinus seul (2019), Thalès emboîté seul (2019) : `trigo` et `thales` mélangent les cas ; ratios et programmes de calcul créés le 22.11 |
| 3e | 98 | 54 | 90 % (2019 : 95 %) | 🟠 contenu OK, **niveau 1 trop bas** | inéquations collège (`ineq1` créé en 2nde, à rattacher), vecteurs 2026 (en 2028), fonction linéaire distincte, antécédent (corrigé) ; pas de parcours « partie 1 du DNB » |
| 2nde | 117 | 52 (19 avant la correction du 25.11) | 97 % | 🟡 jouable | variations sans tableau dessiné ; y = mx + p ; **niveau 1 des automatismes** très bas (6e–5e : « arrondis 26,24 à l'unité », « 4 % en décimal ») |
| 1re spé | 137 | 21 | ≈ 80 % (57 % avant le 23.11) | 🟠 | **dérivation absente** (chantier `college34`), radians, ln ; trois notions hors programme français placées en 1re : `sinlaw` (la loi des sinus n'est pas au programme ; Al-Kashi oui), `recip` (\(f^{-1}\) : pas au programme), `expo` (\(a^x\) : la 1re ne connaît que \(e^x\)) ; « zéros » (`trinfact`), « composantes » (`vecteurs` : coordonnées) ; automatismes de 1re non repris (`againFR` 11 absent) |
| 1re maths intégrées | — | — | 72 % | — | pas de profil distinct (élèves sans spécialité : épreuve anticipée « sans spécialité ») |
| Tle spé | 145 | 8 (50 avant la correction) | ≈ 20 % | 🔴 pas prête | limites de fonctions, continuité, dérivation, convexité, ln, primitives, intégrales, espace ; seules les suites (limites), la loi binomiale, le dénombrement, la trigonométrie existent |
| Tle complémentaires / expertes | — | — | 12 % / 19 % | 🔴 | hors périmètre avant 2028 |

Lecture : « De l'année » = notions proposées comme travail de l'année (première classe française, ou reprise `againFR`).
Le reste du catalogue = notions des années précédentes (révisions).

**Défauts trouvés par la sonde et corrigés le 25.11** (§ 6) : (1) en 2nde, les 33 automatismes repris du collège n'étaient
plus « de l'année » (fr_college.js, chargé après fr_2nde.js, écrasait `againFR`) ; (2) en Tle, les chapitres de 1re du
Collège de Genève étaient « de l'année » (relatifs, Pythagore, puissances : 50 notions au lieu de 8) ; (3) les énoncés de change
EUR ↔ CHF restaient tirables en France (« 1 euro vaut 0,92 € » une fois CHF traduit).

## 3. Niveau des questions par rapport au DNB et à l'épreuve anticipée

Méthode : sonde `tests/_niv_fr.html?ech#8,9,10,11` (non commitée) — pour chaque notion « de l'année », une question de
niveau 1 et une de niveau 3, comparées aux exercices types du DNB (sujets de référence 2027 : partie 1 automatismes, partie 2
problèmes) et de l'épreuve anticipée de 1re (QCM automatismes + exercices). Étalons à constituer à l'étape 1 du plan avec les
sujets officiels (non téléchargés ici).

**Constat principal : aucune des règles de relèvement du niveau ne s'applique à un profil français.** `Engine.make` relève le
niveau 1 en 9e (`UP9`), en 11e (`UP11`), au Collège (`UPC`) et en MP (`UPMP`), toutes conditionnées à `system === "CH"`. Pour
un élève français, une notion reprise d'une année inférieure démarre à son niveau 1, qui est un automatisme de 6e–5e.

| Classe | Niveau 1 (exemples réels de la sonde) | Niveau 3 | Verdict |
|---|---|---|---|
| 4e | « Complète 2/3 = 14/? », « Calcule le carré de 9 », « plus petit de 5 ; −1 ; 1 ; −8 » (reprises 5e) | Thalès, Pythagore à valeur exacte, équations à décimaux : niveau 4e–3e | 🟠 niveau 1 des reprises trop facile |
| 3e | « Développe 9(6x − 1) », « f(1) pour f(x) = 4x − 9 », « 84 ÷ 7 », « longueur totale des arêtes d'un cube de 11 cm », « 11e multiple de 11 » | « (x − 6)(x + 1) = 98 », probabilité sans remise, Thalès et périmètre de trapèze, volumes composés, programmes de calcul à prouver, ratios : **niveau DNB partie 2** | 🔴 niveau 1 = automatismes de 5e ; **le DNB partie 1 est plus exigeant** (fractions et puissances combinées, a² − b², augmentation en %) |
| 2nde | « Arrondis 26,24 à l'unité », « écris 4 % en décimal », « convertis 9,27 dL en mL », « 7/8 de 48 » | ensembles, inéquations, valeur absolue, tableaux de signes, probabilités conditionnelles : niveau 2nde | 🟠 les automatismes AU.01–18 sont simples, mais le niveau 1 des reprises est de 6e : partir du niveau 2 |
| 1re | « zéros de x² + 7x + 6 », « 2^x = 1/16 », loi des sinus | suites (sommes), produit scalaire, probabilités totales, variable aléatoire : niveau 1re | 🟠 contenu de l'année correct pour les notions créées le 23.11 ; trois notions suisses hors programme FR à retirer de la 1re |

Ce qui est au bon niveau : les notions créées pour la France (`progcalc`, `ratio`, `milieux`, `structexpr`, `probcond`,
`tabsignes`, `vect3e`, `suite*`, `pscal`, `probtot`, `vaesp`, `binom`) et le niveau 3 des notions du CO de 11e (DNB partie 2).

**Recommandation (étape 1 du plan, décision de principe déjà prise pour la Suisse le 24.11)** : appliquer aux profils français
la même règle « le niveau 1 = automatismes de l'année, jamais ceux d'une année inférieure » — table `UPFR` par classe
(4e, 3e, 2nde, 1re) pour les notions `againFR`, calibrée sur les sujets de référence du DNB 2027 (partie 1) et les QCM de
l'épreuve anticipée. Non fait ici : le choix des notions relevées demande les étalons officiels et la relecture de l'enseignant.

## 4. Adaptations : vocabulaire, notations, interface

### 4.1 Vocabulaire et notations (questions et leçons)

| Usage suisse dans l'app | France | État au 25.11 |
|---|---|---|
| CHF, francs | € (« 7,50 € ») | **corrigé** au rendu (profil FR) ; énoncés de change écartés |
| 1'200 (apostrophe) | 1 200 (espace fine insécable) | **corrigé** (formules et texte) |
| PGDC, PPMC | PGCD, PPCM | **corrigé** |
| préimage | antécédent | **corrigé** (accords : l'antécédent, un seul antécédent, plus grand antécédent) |
| mise en évidence, mets en évidence | factorisation par…, factorise, facteur commun | **corrigé** |
| Genève (énoncé) | ville française | **corrigé** (Lyon ; un seul énoncé concerné) |
| point médian · pour le produit | × (et 3x, 3(x + 2)) | **à décider** : 9'430 questions concernées ; filtre `\cdot` → `\times` entre deux nombres possible, mais `\cdot` sert aussi au produit scalaire (`pscal`, `cart`) |
| y = mx + h | y = mx + p (équation réduite) | à faire (variantes d'énoncés de `droites`) |
| zéros (d'une parabole) | racines (trinôme), « s'annule en » | à faire (`f2`, `f2expr`, `eq2disc`) |
| simplifier au maximum | rendre irréductible, forme irréductible | à faire (`fracsimp`) |
| cercle de Thalès | triangle inscrit dans un demi-cercle | à décider (`cercthales` : libellé et leçon) |
| fonction du premier degré, pente | fonction affine, coefficient directeur | à faire (libellés, leçons) |
| log₂, log | ln seul en Tle (log décimal en physique) | à faire (variante FR de `log`) |
| degrés (cercle trigonométrique) | radians dès la 1re | à faire (variantes FR de `trigcercle`, `trigeq`, `trigfn`, `trigassoc`) |
| événement | évènement (textes 2026 ; les deux sont corrects) | rien à faire |
| [a ; b[ | [a ; b[ (manuels), [a, b[ (programme 2026) | conforme ; le correcteur accepte les deux |

Les notions créées pour la France (`fr_*.js`) écrivent déjà €, 1 200, ×, u_n, antécédent.

### 4.2 Interface : ce qui est propre à la Suisse

| Élément | Où | Pour la France |
|---|---|---|
| Choix « Ton école » : Suisse romande / France | étape 1 (`screenLevel`) | France masquée ; apparaît avec `…/#france` (aperçu de l'enseignant, 25.11) |
| Exemple de l'accueil « Je suis en : 9e, 10e, 11e, Sec. II » | `screenWelcome` (`#dgrade`) | **à faire** : boutons 6e … Tle quand le pays est connu, ou choix du pays d'abord |
| Voie « Collège / maturité professionnelle » | étape 1, sec. II | non affichée en FR (déjà) ; la spécialité maths (1re–Tle) et les maths intégrées / complémentaires / expertes seraient l'équivalent : **à décider** (une seule voie « générale » au départ) |
| « En ce moment en classe » | `screenNow` | fonctionne (chapitres FR de 2nde, ordre FR_COL au collège) ; libellés des chapitres de 1re–Tle à compléter |
| Parcours EVACOM (11e) | `evacomCard`, `screenEvacom` | propre à Genève ; pas affiché en FR. Équivalents : **« Brevet : automatismes »** (partie 1 du DNB, 9 questions, 20 min) et **« Épreuve anticipée : automatismes »** (QCM 1re) — même moteur que le parcours EVACOM et que le test rapide (`qcm.js`) |
| Préparer une évaluation, sujet, carnet d'erreurs | `screenPrep`, `sujet.js` | fonctionne (notions de l'année) |
| Page parents | `parents.js` | neutre ; à relire (aucun sigle suisse trouvé) |
| Mentions légales | `screenLegal` | rédigées pour la LPD suisse et une école genevoise : **à réécrire pour la France** (§ 5) |
| Mathélo, grades, histoire des maths | `app.js`, `histoire.js` | neutres |
| Leçons actives (`act_*.js`) | rendu de l'app | localisées au rendu (`frDom`) ; une partie des exemples reste en contexte suisse (Genève, CFF) dans les défis : à relire au moment de l'ouverture |

## 5. Cadre légal et diffusion

### 5.1 Données personnelles (RGPD, loi Informatique et libertés)

- **Âge du consentement numérique : 15 ans en France** (art. 45 de la loi Informatique et libertés, art. 8 RGPD). En dessous,
  quand le traitement repose sur le consentement, il faut celui de l'élève **et** d'un titulaire de l'autorité parentale. Le
  collège (11–15 ans) est entièrement concerné.
- **Recommandations de la CNIL sur les mineurs** (2021) : minimiser, informer dans des mots accessibles aux enfants, pas de
  profilage commercial, paramètres protecteurs par défaut. L'app y répond déjà en grande partie : **pas de compte, pas de
  nom, pas d'adresse e-mail, progression dans le navigateur, pas de publicité ni de traceur tiers, polices et MathJax servis
  par le site**.
- **Ce qui n'est pas conforme en l'état** : les statistiques (séances, signaux par question, votes, erreurs JS) partent vers
  Google Apps Script (États-Unis) (depuis le 24.11 **seulement avec l'accord** de l'élève, désactivé par défaut), avec un identifiant d'appareil aléatoire (donnée
  pseudonyme = donnée personnelle au sens du RGPD), et les commentaires libres peuvent contenir un nom. Pour la France :
  1. **consentement explicite, désactivé par défaut** (option A de `tools/confidentialite.md`) ; avant 15 ans, base légale
     « intérêt légitime » discutable pour des mineurs : le plus simple est **aucun envoi sans accord**, et pour les moins de
     15 ans soit aucun envoi, soit un accord parent (case « un parent a donné son accord ») — décision à prendre ;
  2. transfert hors UE : Google est certifié Data Privacy Framework (UE–États-Unis), à mentionner ; mieux, **héberger la
     réception des statistiques dans l'UE** (option B de `confidentialite.md`) avant une diffusion large ;
  3. mentions légales françaises : responsable du traitement (l'enseignant, à titre personnel ? une association ?), finalités,
     durée de conservation, droits (accès, effacement par identifiant d'appareil), contact, droit de réclamation auprès de la
     **CNIL** ; éditeur et hébergeur du site (LCEN, art. 6 : nom de l'éditeur et de l'hébergeur — GitHub Pages = GitHub Inc.) ;
  4. pas d'analyse d'impact (AIPD) a priori (pas de données sensibles ni de profilage à effet juridique), mais tenir un petit
     registre des traitements.
- **Usage en classe** : un enseignant français peut recommander une ressource gratuite sans compte ; s'il l'impose en classe,
  le chef d'établissement est responsable des ressources numériques utilisées (registre de l'établissement, souvent le DPO
  académique). Une app sans compte ni donnée nominative passe beaucoup plus facilement ce filtre.
- **Hébergement** : GitHub Pages (États-Unis) convient pour des fichiers statiques sans cookie ; il voit l'adresse IP (journaux
  serveur), comme tout hébergeur. Un hébergeur européen (OVHcloud, Scaleway…) serait un
  argument auprès des établissements, pas une obligation.
- **Accessibilité** : les services publics sont soumis au RGAA ; une app personnelle ne l'est pas, mais les académies le
  demandent pour référencer une ressource. Le travail d'accessibilité déjà fait (`tests/accessibilite.html`) est un atout.

### 5.2 Canaux de diffusion réalistes

| Canal | Pour qui | Effort | Remarques |
|---|---|---|---|
| Collègues enseignants (bouche-à-oreille, listes de diffusion d'IREM, APMEP) | enseignants de maths | faible | **le canal principal** : un enseignant qui recommande l'app à ses classes = 25 à 150 élèves d'un coup ; APMEP (association des professeurs de maths) : bulletin, journées nationales, forum |
| Réseaux d'enseignants (X/Bluesky « profs de maths », groupes Facebook « Profs de maths collège/lycée », Mastodon, forums Sésamath) | enseignants | faible | présenter un usage précis : « 5 min d'automatismes pour l'épreuve anticipée », « partie 1 du brevet » |
| ENT (Pronote, ENT régionaux) | élèves, via l'enseignant | faible | un lien dans le cahier de textes Pronote suffit (pas de compte) |
| Parents (FCPE, PEEP, sites de conseils scolaires) | familles | moyen | page parents existante ; argument : gratuit, sans compte, sans publicité |
| Éduscol, sites académiques (pages « ressources numériques maths ») | enseignants | moyen | référencement possible pour une ressource gratuite et conforme ; prendre contact avec les IA-IPR / référents numériques de l'académie |
| GAR (Gestionnaire d'accès aux ressources) | établissements | élevé | **pas pertinent** : le GAR sert aux ressources avec compte élève via l'ENT, il impose une convention et des flux de données ; l'app sans compte n'en a pas besoin |
| Édu-Up, appels à projets du ministère (« Innovation numérique pour l'éducation ») | éditeurs | élevé | à envisager seulement avec une structure (association) |
| Lumni, Canopé | grand public | élevé | partenariats lourds ; pas avant une base d'utilisateurs |

### 5.3 Concurrents gratuits (ou freemium) à connaître

| Outil | Ce que c'est | Gratuit | Différence avec 5min2maths |
|---|---|---|---|
| **MathALÉA (Coopmaths)** | générateur d'exercices aléatoires aligné sur les programmes, 6e → Tle, très utilisé ; corrigés, diaporamas, « course aux nombres » | oui, libre | outil de l'**enseignant** (il fabrique la séance) ; pas d'adaptation à l'élève ni de suivi quotidien ; **concurrent le plus proche sur le contenu** |
| **MathsMentales** | automatismes et calcul mental en diaporama, aligné sur les programmes | oui, libre | en classe, projeté ; pas d'élève seul ni d'adaptation |
| **Sésamath** : LaboMEP, Mathenpoche, manuels | exercices interactifs, parcours assignés par l'enseignant (compte) | oui (association) | comptes et classes ; très installé au collège |
| **Kwyk** | exercices en ligne adaptatifs, devoirs | freemium (établissements payants) | compte, payant pour les fonctions de suivi ; très présent au lycée |
| **MIA Seconde** (ministère, EvidenceB) | IA d'entraînement en maths et français pour la 2nde | oui (via ENT) | officiel, adaptatif, 2nde seulement, compte ENT |
| **Adaptiv'Math** | entraînement adaptatif primaire (cycle 2–3) | oui (via ENT) | primaire seulement |
| **Mathador** (Canopé) | jeu de calcul mental | payant (solo gratuit limité) | ludique, calcul seulement |
| **Lalilo** | lecture en primaire (pas les maths) | — | hors champ |
| Khan Academy (fr), Maths et tiques (vidéos d'Yvan Monka), Wims, Mathsenligne | cours et exercices | oui | vidéos ou banques d'exercices, pas de quotidien adaptatif |

**Ce qui distingue l'app** : (1) l'**élève seul, sans compte, 5 minutes par jour** (ni l'enseignant ni l'ENT ne sont
nécessaires) ; (2) l'adaptation fine (Mathélo par notion, révisions espacées, carnet d'erreurs) ; (3) l'**apprentissage actif**
(leçons devine / manipule / retiens, pas à pas replié) ; (4) la **préparation d'une évaluation précise** (programme jusqu'au
test, autoévaluation, sujet) ; (5) les questions curieuses. Positionnement conseillé : « **l'entraînement quotidien aux
automatismes, du brevet à l'épreuve anticipée** », complémentaire de MathALÉA (que l'enseignant utilise en classe).

## 6. Corrections faites le 25.11 (sans décision, sans effet pour les profils suisses)

| Correction | Où | Contrôle |
|---|---|---|
| Localisation d'un profil FR : CHF → €, « en CHF / en francs » → « en euros », « au franc près » → « à l'euro près », 1'200 → 1 200 (formules : `\,` ; texte : espace fine insécable), PGDC / PPMC → PGCD / PPCM, préimage → antécédent (avec accords), mise en évidence → factorisation / facteur commun / factoriser, Genève → Lyon | `frLocal` (`src/curriculum.js`), appliqué dans `Engine.finalize` (questions : tous les textes, jamais les réponses attendues), au rendu des formules (préfiltre MathJax, `frThou`) et aux textes des écrans (`frDom`, appelé par `typeset` : leçons, aide, compétences, QCM) | `tests/france.html` |
| Énoncés propres à la Suisse écartés du tirage français (change EUR ↔ CHF, « en Suisse », TVA suisse), aussi pour une question à graine (lien, sujet : graine suivante) | `horsCO`, `Engine.make` (`src/engine.js`) | `tests/france.html` (tirages normaux et à graine) |
| 2nde : les automatismes repris du collège (`againFR: [10]`, `src/fr_2nde.js`) étaient effacés par `src/fr_college.js` (chargé après) : 19 notions « de l'année » au lieu de 52 | `applyFrCollege` | `tests/france.html`, `tests/fr2nde.html` |
| Une Tle française (grade 12) recevait comme « de l'année » les chapitres de 1re du Collège de Genève (relatifs, Pythagore, puissances…) : les chapitres Sésamath ne valent que pour un profil suisse | `Engine.catalog` | `tests/france.html` |
| Terminale ajoutée au système FR masqué (`[12, "Tle"]`) ; nom de classe d'un système masqué (`gradeName`) | `src/curriculum.js`, `src/app.js` | `tests/france.html` |
| **Aperçu France** pour l'enseignant : `…/#france` ajoute « France » au choix de l'école sur cet appareil (`…/#france-off` pour annuler) ; sans ce réglage, rien ne change pour personne | `src/app.js` | `tests/france.html` |

Défaut suisse relevé au passage (non corrigé, hors mission) : `ch10_no.js` écrit un nombre au format TeX (`76\text{'}000`) dans
un message de piège en texte simple (« On garde la valeur du nombre : … ») : un élève suisse voit `\text{'}` tel quel.

## 7. Plan de mise en œuvre (septembre 2026 → juin 2027 et au-delà)

Effort en demi-journées de travail d'agent + relecture de l'enseignant (R = relecture). Rythme compatible avec la règle « ne
pas ouvrir un nouveau pays tant que le précédent n'est pas propre ».

| # | Étape | Contenu | Effort | Quand | Dépend de |
|---|---|---|---|---|---|
| 1 | **Niveau FR (priorité absolue)** | audit `/audit-niveau` par classe française avec étalons tirés des sujets de référence du DNB 2027, des annales DNB 2024–2026 et des sujets 0 / 2026 de l'épreuve anticipée (à ranger dans `Sources/Officiel/France/`) ; règles de relèvement FR (`UPFR` dans `Engine.make` : niveau 1 → 2 pour les notions reprises en 3e, 2nde, 1re), registre `tools/niveau.json` étendu aux classes FR | 6 + 3 R | janv.–fév. 2027 | — |
| 2 | **Parcours « automatismes »** | « Brevet : partie 1 » (9 questions, 20 min, sans calculatrice) et « Épreuve anticipée : automatismes » (QCM, liste officielle) sur le moteur du test rapide (`qcm.js`) et du parcours EVACOM | 4 + 2 R | fév. 2027 | 1 |
| 3 | **Vocabulaire restant** | variantes d'énoncés FR : `droites` (y = mx + p), `f2`/`eq2disc` (racines), `fracsimp` (irréductible), `cercthales`, radians (`trigcercle`, `trigeq`, `trigfn`, `trigassoc`), `ln` (`log`) ; décision sur `\cdot` → `\times` | 3 + 1 R | mars 2027 | décisions 2, 3 |
| 4 | **Contextes** | relecture des `ctx` suisses restants (CFF, TPG, lieux dans les leçons actives et défis), table de contextes français (villes, SNCF, €) au rendu ; prénoms déjà variés | 2 + 1 R | mars 2027 | — |
| 5 | **Interface FR** | choix du pays à l'accueil (`#dgrade` selon le pays), libellés des chapitres 1re–Tle pour « En classe », page parents relue, mentions légales FR | 2 + 1 R | avril 2027 | décisions 1, 4 |
| 6 | **Confidentialité** | consentement aux statistiques (option A) fait le 24.11 ; reste l'accord parental avant 15 ans ; puis réception des statistiques dans l'UE (option B) | 1 (A) ; 4–6 (B) | avant l'ouverture | décision 4 |
| 7 | **Terminale** | `limfn`, `lnfn`, `tvi`, convexité, primitives et intégrales (à partager avec la 3e–4e du Collège), espace ; seulement si la Tle est ouverte | 10 + 4 R | 2027-2028 | décision 5 |
| 8 | **Programmes 2026 de 4e et 3e** | bascule des placements FR (cosinus, notation scientifique, Thalès, vecteurs en 3e) à la rentrée 2027 (4e) et 2028 (3e) ; `FR_COLLEGE` en deux versions | 2 | été 2027, été 2028 | — |
| 9 | **Testeurs** | 2 ou 3 enseignants français (un collège, un lycée) : bêta fermée par lien `…/#france` ; les élèves jugent (signaux, votes) | — | mai–juin 2027 | 1–6 |
| 10 | **Ouverture** | « France » visible au choix de l'école (décommenter `SYSTEMS.FR`), annonce aux réseaux d'enseignants (§ 5.2) | ½ | rentrée 2027 (septembre) | 9 |

Total avant ouverture (étapes 1–6, 9–10) : ≈ 19 demi-journées d'agent et ≈ 9 demi-journées de relecture, étalées de janvier à
juin 2027, sans toucher aux classes genevoises. La terminale (étape 7) double presque l'effort : la garder pour 2027-2028.

### Décisions à prendre par l'enseignant

1. **Classes ouvertes en France** : recommandation **6e → 1re** à la rentrée 2027 (la Tle quand les limites, le logarithme et
   les intégrales existeront). Alternative plus ciblée : **3e et 1re seulement** (brevet et épreuve anticipée), là où l'app
   apporte le plus et où le relevé de niveau est le plus urgent.
2. **Produit : point médian ou ×** pour les élèves français (filtre au rendu entre deux nombres, en épargnant le produit
   scalaire) — recommandation : × en France, sans changer la Suisse.
3. **Vocabulaire : filtre global ou variantes d'énoncés** pour le reste (racines, y = mx + p, irréductible, radians, ln) —
   recommandation : variantes d'énoncés (le filtre ne sait pas accorder ni changer une méthode, comme les radians).
4. **Statistiques en France** : (a) aucun envoi sans consentement, (b) aucun envoi avant 15 ans sauf case « accord d'un
   parent », (c) réception dans l'UE avant l'ouverture ; et **qui est responsable du traitement** (l'enseignant à titre
   personnel, ou une association loi 1901 / suisse — qui faciliterait aussi les partenariats et l'hébergement).
5. **Terminale** : la construire (≈ 14 demi-journées) ou se limiter à 6e → 1re en 2027-2028.
6. **Positionnement et diffusion** : « automatismes du brevet et de l'épreuve anticipée » auprès des enseignants (APMEP,
   réseaux, Pronote) ; contacter une académie (référents numériques) seulement après la bêta. GAR : non.
7. **Calendrier** : bêta fermée en mai–juin 2027 avec 2 ou 3 enseignants français (qui ? contacts de l'enseignant, collègues
   frontaliers de Genève : Haute-Savoie, Ain — académie de Grenoble et de Lyon), ouverture à la rentrée 2027.
8. **Nom et domaine** : « 5 minutes de maths par jour » convient en France ; un domaine `.fr` ou neutre (`.org`) plutôt que
   GitHub Pages pour la confiance des parents et des établissements (voir `tools/nom_app.md`).

## Décisions de l'enseignant (25.11.2026)

1. Classes ouvertes en France : **de la 6e à la 1re** (la Tle s'ajoutera quand elle sera prête).
2. Produit : **signe ×** en France à la place du point médian (profil FR seulement).
4. **Construire la Tle** (≈ 14 demi-journées d'agent, après le niveau FR et les automatismes).
Restent ouvertes : 3 (filtre ou variantes pour le vocabulaire), 5 (statistiques : moins de 15 ans, hébergement UE,
responsable), 6 (positionnement et diffusion), 7 (testeurs), 8 (domaine propre).

## Couverture recalculée et manques comblés (25.11, branche `agent/frcouv`)

Détail attendu par attendu : `tools/france_couverture.md` (script `tools/france_couverture.py`). Taux = (✅ + ½ ◐) / attendus
saisissables, sur le catalogue réel d'un profil français.

| Classe | Avant | Après | Ce qui a changé |
|---|---|---|---|
| 6e | 77 % | 77 % | rien (manques : probabilités, symétrie axiale, médiatrice — voir « Ce qui reste ») |
| 5e | 90 % | 90 % | rien |
| 4e | 96 % | 96 % | `cos4e` (cosinus seul, 2019) et `thales4e` (triangles emboîtés) : les attendus étaient « couverts » par des notions de 3e qui mélangeaient les cas |
| 3e | 89 % | 94 % | `linfn`, `autodnb` (partie 1 du DNB), `vecgeo` et `ineq1` (programme 2026, fin d'année), `proba2` rattachée ; niveau 1 relevé (`UPFR`) |
| 2nde | 95 % | 95 % | `tabvar` (tableaux de variations), `probaxiomes`, y = mx + p ; niveau 1 des automatismes relevé |
| 1re | 70 % | 95 % | dérivation (8 notions de la 3e du Collège), `expderiv`, `trigrad` (radians), `droitenorm`, probabilités ; 10 notions suisses retirées (`sinlaw`, `recip`, `expo`, degrés, `log`…) ; automatismes de l'épreuve anticipée repris |
| Tle | 20 % | 91 % | 28 notions de 3e–4e du Collège rattachées (limites, continuité, convexité, ln/exp, primitives, intégrales, équations différentielles, espace, dénombrement) + `lnfr`, `trigfr`, `tvi`, `sommeva`, `recurrence` |

Mécanismes ajoutés (sans effet pour un profil suisse, contrôlé par `tests/france.html` : mêmes catalogues 9e–11e, Collège,
MP qu'avant) : `HORS_FR` (formes d'une notion partagée hors programme d'une classe française), `UPFR` (niveau minimal des
notions reprises en 4e, 3e, 2nde, 1re), champ `q.fr` (forme réservée à des classes françaises), dans `src/engine.js` ;
tables dans `src/fr_couv.js`.

## Décision du 25.11 (soir) : compétences en profil France

Référentiel de compétences France construit sur les items officiels (`tools/referentiels_fr.json` : attendus de fin d'année
et repères au collège, capacités attendues et automatismes au lycée), libellés officiels. Échelle **4 niveaux du LSU**,
collège ET lycée, en pastilles sans chiffre : maîtrise insuffisante (< 40 % de réussite) · fragile (40–60 %) ·
satisfaisante (60–85 %, seuil = note suisse 4) · très bonne maîtrise (≥ 85 %). Profils suisses inchangés (notes 1–6).
Anciennes grilles « Livret de connaissances et de compétences » (Sources/Officiel/Competences College FR) : périmées, non utilisées.

## Derniers manques comblés (25.11 au soir, branche `agent/frfin`)

| Classe | Avant | Après | Ce qui a changé |
|---|---|---|---|
| 6e | 77 % | 90 % | `symax` (symétrie axiale), `mediatrice`, `echelle6` (échelles ; `echelle` mélange aires et volumes de 4e), `proba6` (premiers pas ; `proba` est de 5e) |
| 5e | 90 % | 93 % | `empil` (empilements de cubes, vues) ; `progcalc` passe de la 4e à la 5e (formes de 4e écartées par `HORS_FR`) |
| 2nde | 95 % | 98 % | `compdiff` (comparer par différence ou quotient, AU.01, NC.10) |
| 1re | 95 % | 96 % | `posrelc` (position relative de deux courbes, AN.09) |
| Tle | 91 % | 95 % | `intmaj` (majorer, encadrer une intégrale, AN.24), `suiteint` (suites d'intégrales, AN.26) |

Notions dans `src/fr_fin.js`, leçons actives (curseurs) dans `src/fr_act.js`, contrôles `tests/frfin.html` et
`tests/act_frfin.html`. Notes scolaires : pour un profil français, les questions de `statfreq`, `stats`, `diagr`, `probeq`
à notes suisses (1 à 6) sont remplacées par des notes sur 20 (`FR_NOTES`, lu par `Engine.finalize`) ; profils suisses
inchangés. Reste : leçons actives suisses de moyenne (`act_9b.js`, `act_manip2.js` : « notes 6 ; 6 ; 3 ») non localisées.

## À lancer après la phase Collège (décision du 25.11 soir)

Phase France du chantier « référentiel de compétences » : « Mes compétences » d'un profil FR = attendus officiels de la
classe (collège : attendus de fin d'année ; lycée : capacités attendues + automatismes ; tools/referentiels_fr.json),
intitulés exacts, échelle LSU 4 niveaux (déjà en place), items non saisissables « travaillé en classe ». Même structure
générique que la phase Collège (src/ref_matu.js, agent refcomp). Données existantes des élèves conservées.
