#!/usr/bin/env python3
"""Référentiel du Cycle d'orientation (9e–11e) embarqué dans l'app : src/ref_co.js (25.11, phase CO).

Règle de l'enseignant : chaque système affiche SON référentiel, avec SES dénominations. Pour le CO, c'est le Plan
d'études romand (PER), cycle 3, domaine MSN, axes 31 à 34 (mathématiques) : progression des apprentissages par année
et attentes fondamentales. Le référentiel de la Banque commune Budé (travail collectif non publiable) n'est PAS utilisé :
ni ses intitulés, ni ses codes.

Source (publique) : tableaux du PER sur le portail de la CIIP (portail.ciip.ch, ex-plandetudes.ch), API publique
https://per.ciip.ch/api/bdper/objectifs-apprentissage/<id>/tableau (MSN 31 = 45, 32 = 48, 33 = 51, 34 = 54, 35 = 151),
récupérés le 25.11.2026 et rangés hors dépôt : ~/DATA/Enseignement/Sources/Officiel/PER/PER_cycle3_MSN/
(JSON bruts et texte lisible PER_cycle3_MSN31-35.txt). Le texte officiel de chaque item est recopié en commentaire
(champ « per » ci-dessous) ; l'intitulé affiché est une forme courte et fidèle.

Choix (à valider par l'enseignant) :
- Un item = une ligne (ou une sous-ligne) de la progression des apprentissages ; ses années = les colonnes 9e, 10e, 11e
  que la cellule du PER couvre (y1–y2). Dans l'app, un élève voit les items de son année (y1 ≤ année ≤ y2) ; les items
  terminés une année précédente sont repliés sous cette année-là.
- Les variantes par niveau (Niv 1, 2, 3, « s » = sensibilisation) sont fusionnées : le profil CO de l'app n'a pas de
  niveau. Les années retenues sont celles où au moins un niveau travaille l'item hors sensibilisation (sauf mention).
- MSN 35 (Modélisation) : « Cet objectif n'est pas travaillé pour lui-même. Il s'active dans les autres axes
  seulement » (PER) : pas d'item propre ; ses composantes (A–H) sont dans les items des axes 31 à 34.
- Éléments pour la résolution de problèmes : un item par axe (intitulé court), rattaché seulement aux notions dont
  c'est tout le travail (problèmes, traduction d'un énoncé) ; sinon « travaillée en classe ».
- Rattachement (champ « q ») : une notion (ou certains de ses niveaux de question, « id@13 ») n'est rattachée que si
  ses questions entraînent vraiment l'item (lu dans les générateurs et src/competences.js, sans les modifier) ;
  constructions, représentations, manipulations, preuves : aucun rattachement (« travaillée en classe »).
- 26.11 (agent perco) : 31-SO2, 31-TR1, 31-TR3, 31-TR4, 31-TR8, 32-NB9, 32-NB10, 33-FO1, 33-FO2, 33-LI1, 33-LI4 rattachés aux
  notions de src/perco.js (isom, ensco, numer, fctlec, litconv) et aux formes ajoutées à simil (homothéties) et volcone
  (cône et sphère). Items « Résoudre des problèmes » (31-RP, 33-RP) laissés sans rattachement : aucune notion ne les porte
  sans forcer.

Usage : python3 tools/ref_co.py   (relancer après un changement de ITEMS)
"""
import json, re, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import referentiels as R  # noqa: E402

ROOT = R.ROOT
OUT = ROOT / "src" / "ref_co.js"
AXES = {31: "Espace", 32: "Nombres", 33: "Opérations", 34: "Grandeurs et mesures"}  # thématiques du PER (MSN 31–34)
HORS = "hors saisie"

# (code, axe, champ du PER, intitulé court, 1re année, dernière année, notions rattachées, texte du PER)
ITEMS = [
    # ---------------- MSN 31 – Espace ----------------
    ("31-RP", 31, "Éléments pour la résolution de problèmes", "Résoudre des problèmes géométriques (figures, transformations)", 9, 11, [],
     "Résolution de problèmes géométriques en lien avec les figures et les transformations étudiées"),
    ("31-FG1", 31, "Figures géométriques planes", "Reconnaître, décrire et construire triangles, quadrilatères et cercles (côtés, angles, diagonales, symétries)", 9, 10, ["quadri", "angtri"],
     "Reconnaissance, dénomination, description de figures planes selon leurs propriétés (symétrie-s interne-s, côtés, angles, somme des angles, diagonales) et construction de : triangles, quadrilatères, cercles"),
    ("31-FG2", 31, "Figures géométriques planes", "Reconnaître, décrire et construire des polygones réguliers", 10, 11, ["polyreg", "angtri@3"],  # 27.11 (n° 26) : formes « polygone », « nb-cotes » (src/ref_formes.js)
     "… et construction de : polygones réguliers (Niv 1s-2-3)"),
    ("31-FG3", 31, "Figures géométriques planes", "Reconnaître et nommer les angles (aigu, obtus, droit, plat)", 9, 9, ["angtype"],
     "Reconnaissance et dénomination des angles (aigu, obtus, droit, plat)"),
    ("31-FG4", 31, "Figures géométriques planes", "Parallèles, perpendiculaires, hauteur, médiatrice, bissectrice, médiane : propriétés et construction", 9, 10, [],
     "Reconnaissance, dénomination, description des propriétés et construction de : droites parallèles, droites perpendiculaires ; hauteur, médiatrice, bissectrice ; cercles inscrit et circonscrit (Niv 1s-2-3) ; médiane, centre de gravité (Niv 2-3)"),
    ("31-FG5", 31, "Figures géométriques planes", "Tangente, angle au centre, angle inscrit, angles isométriques, cercle de Thalès", 11, 11, ["angles", "cercthales"],
     "… tangente, angle au centre d'un cercle, angle inscrit dans un cercle, angles isométriques (opposés par le sommet, alternes-internes,…) (Niv 2s-3) ; cercle de Thalès (Niv 3)"),
    ("31-FG6", 31, "Figures géométriques planes", "Représenter une figure par un croquis ou un dessin à l'échelle", 9, 11, [],
     "Représentation de figures planes par un croquis et/ou un dessin à l'échelle (y compris l'échelle 1:1)"),
    ("31-SO1", 31, "Solides", "Reconnaître et décrire cube, pavé, prisme droit, cylindre, pyramide (faces, arêtes, sommets)", 9, 10, ["solides"],
     "Reconnaissance, dénomination, description de solides selon leurs propriétés (faces, sommets, arêtes, polyèdre ou non) : cube, parallélépipède rectangle, prisme droit, cylindre, pyramide"),
    ("31-SO2", 31, "Solides", "Reconnaître et décrire le cône et la sphère", 11, 11, ["volcone"],
     "… : cône, sphère"),
    ("31-SO3", 31, "Solides", "Réaliser le développement d'un cube, d'un pavé, d'un prisme droit", 9, 10, [],
     "Réalisation de développements et construction de solides : cube, parallélépipède rectangle, prisme droit"),
    ("31-SO4", 31, "Solides", "Réaliser le développement d'un cylindre, d'une pyramide régulière", 11, 11, [],
     "… : cylindre (Niv 1s-2-3) ; pyramide régulière (Niv 2-3)"),
    ("31-SO5", 31, "Solides", "Représenter un solide en perspective", 9, 11, [],
     "Représentation de solides en perspective"),
    ("31-TR1", 31, "Transformations géométriques", "Reconnaître et nommer les isométries : translation, symétries axiale et centrale, rotation", 9, 10, ["isom@12"],
     "Reconnaissance et dénomination des isométries : translation, symétrie axiale, rotation, symétrie centrale"),
    ("31-TR2", 31, "Transformations géométriques", "Identifier les caractéristiques d'une isométrie (vecteur, axe, centre, angle)", 9, 10, ["rotation@12"],
     "Description et identification des caractéristiques d'une isométrie (vecteur de translation, axe de symétrie, centre de rotation ou de symétrie, conservation des grandeurs,…)"),
    ("31-TR3", 31, "Transformations géométriques", "Identifier les caractéristiques d'une homothétie (centre, rapport)", 11, 11, ["simil"],
     "Description et identification des caractéristiques d'une : homothétie (centre, rapport,…) ; similitude (Niv 3s) (Niv 2-3)"),
    ("31-TR4", 31, "Transformations géométriques", "Anticiper la position d'une figure après une ou plusieurs isométries", 9, 11, ["isom@13"],
     "Anticipation de la position d'une figure plane après une ou plusieurs isométries"),
    ("31-TR5", 31, "Transformations géométriques", "Réaliser des frises et des pavages", 9, 11, [],
     "Réalisation de frises ou de pavages à l'aide d'isométries"),
    ("31-TR6", 31, "Transformations géométriques", "Construire l'image d'une figure par une isométrie", 9, 10, ["symetries", "rotation@3"],
     "À l'aide des instruments ou de logiciels appropriés, construction de l'image d'une figure plane par une isométrie : translation, symétrie axiale, rotation, symétrie centrale"),
    ("31-TR7", 31, "Transformations géométriques", "Agrandir et réduire une figure (proportionnalité)", 10, 10, ["agrand"],
     "Agrandissement et réduction de figures planes en utilisant la proportionnalité (9e : Niv s)"),
    ("31-TR8", 31, "Transformations géométriques", "Construire l'image d'une figure par une homothétie", 11, 11, ["simil"],
     "Construction de l'image d'une figure plane : par une homothétie ; par une similitude (Niv 3s) (Niv 2-3)"),
    ("31-RE", 31, "Repérage dans le plan et dans l'espace", "Se repérer dans le plan et dans l'espace (placer des points, coordonnées)", 9, 11, ["repere", "repere3d"],
     "Utilisation de systèmes de repérage pour communiquer des positions et des itinéraires, pour placer des points (plan et espace)"),
    # ---------------- MSN 32 – Nombres ----------------
    ("32-RP", 32, "Éléments pour la résolution de problèmes", "Résoudre des problèmes numériques (traduire l'énoncé en calcul)", 9, 11, ["decprob", "tradexpr"],
     "Résolution de problèmes numériques […] notamment : traduction des données d'un problème en opérations arithmétiques, en respectant les conventions d'écriture"),
    ("32-CALC", 32, "Éléments pour la résolution de problèmes", "Utiliser la calculatrice (parenthèses, mémoire, puissance, racine)", 9, 11, [],
     "Connaissance et utilisation de diverses fonctions de la calculatrice : quatre opérations de base, parenthèses, mise en mémoire et récupération de valeurs, puissance, racine,… ; prise en compte de l'ordre dans lequel la calculatrice effectue les opérations"),
    ("32-AL1", 32, "Éléments pour la résolution de problèmes", "Explorer des situations aléatoires (dénombrer les possibilités)", 10, 11, ["denombr"],
     "Exploration de situations aléatoires"),
    ("32-AL2", 32, "Éléments pour la résolution de problèmes", "Calculer des probabilités", 11, 11, ["proba"],
     "Traitement de situations aléatoires à l'aide de notions de probabilités (Niv 2-3)"),
    ("32-NB1", 32, "Nombres", "Critères de divisibilité, multiples et diviseurs", 9, 9, ["divcrit", "multdiv"],
     "Reconnaissance et utilisation de propriétés des nombres naturels : critères de divisibilité, multiples et diviseurs communs"),
    ("32-NB2", 32, "Nombres", "PPMC, PGDC, nombres premiers, décomposition en facteurs premiers", 9, 10, ["premiers", "arith"],
     "… : ppmc, pgdc, nombres premiers, produit de facteurs (9e : Niv 2-3 ; 10e : Niv 1)"),
    ("32-NB3", 32, "Nombres", "Passer d'une écriture d'un nombre à une autre (décimale, fraction, pourcentage)", 9, 11, ["decread", "fracconv", "fracper"],
     "Connaissance et utilisation de différentes écritures d'un même nombre"),
    ("32-NB4", 32, "Nombres", "Comparer, encadrer, arrondir des entiers relatifs et des décimaux ; les placer sur une droite", 9, 9, ["relrep", "deccomp", "decarr"],
     "Comparaison, approximation, encadrement, représentation sur une droite et ordre de grandeur de nombres écrits sous forme : entière dans ℤ ; décimale dans ℚ"),
    ("32-NB5", 32, "Nombres", "Comparer et encadrer des fractions, des pourcentages ; simplifier, amplifier", 9, 10, ["fracrep", "fracsimp"],
     "… sous forme : fractionnaire (y compris simplification et amplification), de pourcentage (9e : dans ℚ+ ; 10e : dans ℚ)"),
    ("32-NB6", 32, "Nombres", "Comparer et estimer des puissances", 9, 10, ["pow9"],
     "… sous forme : de puissance aᵇ (a sous forme décimale, b dans ℕ)"),
    ("32-NB7", 32, "Nombres", "Notation scientifique : écrire, comparer, ordre de grandeur", 10, 11, ["sci"],
     "… sous forme : de la notation scientifique a·10ⁿ (n dans ℕ : Niv 1s ; n dans ℤ : Niv 2-3)"),
    ("32-NB8", 32, "Nombres", "Encadrer et comparer des racines carrées et cubiques", 10, 11, ["racenc", "rac@2"],
     "… sous forme : de racine carrée et cubique dans ℝ+"),
    ("32-NB9", 32, "Nombres", "Distinguer les ensembles de nombres ; découvrir des irrationnels", 9, 11, ["ensco"],
     "Discernement des ensembles de nombres, découverte de quelques nombres irrationnels"),
    ("32-NB10", 32, "Nombres", "Explorer des systèmes de numération (romain, égyptien, binaire…)", 9, 11, ["numer"],
     "Exploration de quelques systèmes de numération (Rome, Égypte, Babylone, binaire,…)"),
    ("32-CA1", 32, "Calculs", "Priorités des opérations (parenthèses comprises)", 9, 10, ["prio"],
     "Connaissance et utilisation des priorités des opérations (y compris parenthèses)"),
    ("32-CA2", 32, "Calculs", "Utiliser les propriétés des opérations pour calculer efficacement et estimer", 9, 10, ["ordgr", "dec10"],
     "Connaissance et utilisation des propriétés des opérations pour organiser et effectuer des calculs de manière efficace et pour donner des estimations : addition, soustraction, multiplication, division"),
    ("32-CA3", 32, "Calculs", "Règles de calcul des puissances", 10, 10, ["puiss", "scicalc"],
     "… : puissances (a, b, m et n dans ℕ) : aᵐ·aⁿ = aᵐ⁺ⁿ ; aᵐ : aⁿ = aᵐ⁻ⁿ ; (aᵐ)ⁿ = aᵐ·ⁿ ; aᵐ·bᵐ = (a·b)ᵐ (Niv 2-3)"),
    ("32-CA4", 32, "Calculs", "Propriétés des racines carrées (et cubiques), extraction d'entiers", 11, 11, ["racprop"],
     "… : racines carrées (cubiques), y compris extraction d'entiers (a et b dans ℕ) : √a·√b = √(a·b) ; √a : √b = √(a:b) ; √(a²·b) = a·√b (Niv 3)"),
    ("32-CA5", 32, "Calculs", "Calculer avec des nombres décimaux positifs (+, −, ×, :)", 9, 11, ["decadd", "decmul", "decdiv"],
     "Utilisation de procédures de calcul réfléchi ou de calcul mental avec des nombres rationnels positifs sous forme décimale (+, −, ∙, :) ; utilisation des algorithmes […] inférieurs à 10000, ayant au plus deux décimales (9e)"),
    ("32-CA6", 32, "Calculs", "Calculer avec des nombres relatifs (+, −, ×, :)", 9, 11, ["reladd", "rel"],
     "… calcul réfléchi ou calcul mental avec des nombres entiers relatifs de -100 à +100 (+, −, ∙, :) (9e–10e : Niv 2-3 ; 10e : + Niv 1 ; 11e : Niv 1) ; nombres rationnels sous forme décimale (+, −, ∙, :) (10e–11e : Niv 2-3)"),
    ("32-CA7", 32, "Calculs", "Additionner et soustraire des fractions", 9, 10, ["fracadd"],
     "… nombres rationnels positifs sous forme fractionnaire (+, −) (9e : Niv 3 ; 10e : Niv 1-2), calcul réfléchi et algorithmes"),
    ("32-CA8", 32, "Calculs", "Multiplier et diviser des fractions, fractions relatives", 10, 11, ["fracmul", "fracops", "fractout"],
     "… nombres rationnels sous forme fractionnaire (+, −, ·, :) (10e : Niv 3 ; 11e : Niv 1-2)"),
    ("32-CA9", 32, "Calculs", "Extraire la racine d'un carré parfait", 10, 11, ["carres", "rac@1"],
     "… calcul réfléchi ou calcul mental avec des : carrés parfaits pour en extraire la racine"),
    # ---------------- MSN 33 – Opérations ----------------
    ("33-RP", 33, "Éléments pour la résolution de problèmes", "Résoudre des problèmes (fonctions, diagrammes, expressions, équations)", 9, 11, [],
     "Résolution de problèmes en lien avec les notions étudiées (fonctions, diagrammes, expressions algébriques et équations)"),
    ("33-PR1", 33, "Éléments pour la résolution de problèmes", "Proportionnalité : prix, poids, devises, agrandissements", 9, 10, ["proptab", "prop", "change"],
     "Résolution de problèmes de proportionnalité (propriétés, facteur de la proportionnalité) : quantité / quantité (prix, poids, devises,…), agrandissement et réduction de figures"),
    ("33-PR2", 33, "Éléments pour la résolution de problèmes", "Proportionnalité : échelle, pourcentage, pente", 10, 11, ["echelle", "pct", "pctvar", "pente"],
     "… : échelle, pourcentage, pente"),
    ("33-PR3", 33, "Éléments pour la résolution de problèmes", "Proportionnalité : vitesse moyenne, masse volumique, débit", 11, 11, ["vitesse", "gquot"],
     "… : vitesse moyenne ; masse volumique (Niv 1s-2-3) ; débit (Niv 3)"),
    ("33-FO1", 33, "Fonctions", "Reconnaître une situation qui se modélise par une fonction", 9, 11, ["fctlec@23"],
     "Reconnaissance de situations pouvant être modélisées par des fonctions"),
    ("33-FO2", 33, "Fonctions", "Lire et interpréter un tableau de valeurs, un graphique", 9, 11, ["fctlec@13"],
     "Lecture et interprétation de tableaux de valeurs, de représentations graphiques"),
    ("33-FO3", 33, "Fonctions", "Représenter une relation par un tableau, un graphique, un opérateur ; passer de l'un à l'autre", 9, 11, [],
     "Représentation d'une relation où interviennent deux grandeurs variables par : un tableau de valeurs ; une représentation graphique ; un ou plusieurs opérateurs ; passage d'une représentation à une autre : de l'opérateur au tableau de valeurs et inversement, du tableau de valeurs à la représentation graphique et inversement"),
    ("33-FO4", 33, "Fonctions", "De l'expression fonctionnelle au tableau de valeurs et au graphique", 10, 11, ["tabval", "affine@13"],
     "… de l'expression fonctionnelle au tableau de valeurs et à la représentation graphique : x→b, x→ax, x→ax+b, x→ax² (10e : Niv 2-3 ; 11e : tous niveaux)"),
    ("33-FO5", 33, "Fonctions", "Du graphique à l'expression fonctionnelle (x → ax + b)", 11, 11, ["affine@2"],
     "… de la représentation graphique à l'expression fonctionnelle (Niv 2-3) : x→b, x→ax, x→ax+b (a et b dans ℚ)"),
    ("33-DI1", 33, "Diagrammes", "Lire et interpréter des données et des diagrammes", 9, 11, ["diagr@13"],
     "Lecture de données (horaires, statistiques,…) et interprétation de diagrammes"),
    ("33-DI2", 33, "Diagrammes", "Réaliser un diagramme cartésien, en colonnes", 9, 9, [],
     "Réalisation de diagrammes : diagramme cartésien, en colonnes"),
    ("33-DI3", 33, "Diagrammes", "Réaliser un diagramme circulaire, en barre", 10, 11, ["diagr@2"],
     "Réalisation de diagrammes : diagramme circulaire, en barre (Niv 1s-2-3)"),
    ("33-DI4", 33, "Diagrammes", "Utiliser un tableur, un grapheur", 9, 11, [],
     "Utilisation d'outils appropriés (tableur, grapheur,…)"),
    ("33-LI1", 33, "Algèbre – Calcul littéral", "Règles et conventions d'écriture algébrique", 10, 11, ["litconv@1"],
     "Connaissance et utilisation des règles et conventions usuelles d'écriture algébrique (9e : Niv 2s-3s ; 10e : Niv 1s-2-3 ; 11e : Niv 1)"),
    ("33-LI2", 33, "Algèbre – Calcul littéral", "Calculer la valeur d'une expression littérale", 9, 11, ["valnum"],
     "Détermination de la valeur numérique d'une expression littérale en substituant des nombres aux lettres (9e : Niv 2-3 ; 10e–11e : tous niveaux)"),
    ("33-LI3", 33, "Algèbre – Calcul littéral", "Écrire une expression littérale (énoncé, figure, phrase)", 10, 11, ["litelab"],
     "Élaboration d'expressions littérales à partir d'énoncés de problèmes, de figures géométriques ou d'expressions verbales (9e : Niv 2s-3s ; 10e–11e : Niv 2-3 ; 11e : Niv 1s)"),
    ("33-LI4", 33, "Algèbre – Calcul littéral", "Interpréter des expressions et reconnaître des expressions équivalentes", 10, 11, ["litconv@23"],
     "Interprétation d'expressions littérales et identification de celles qui sont équivalentes (Niv 2-3)"),
    ("33-LI5", 33, "Algèbre – Calcul littéral", "Réduire et ordonner monômes et polynômes", 10, 11, ["reduire"],
     "Connaissance de la terminologie, écriture réduite et ordonnée de : monômes (10e) ; polynômes de degré ≤ 3 (11e) (Niv 2-3) ; addition, réduction de polynômes du premier degré (11e, Niv 1)"),
    ("33-LI6", 33, "Algèbre – Calcul littéral", "Additionner, soustraire, multiplier des monômes", 10, 10, ["monomes"],
     "Opérations sur les polynômes : addition, soustraction et multiplication de monômes (Niv 2-3)"),
    ("33-LI7", 33, "Algèbre – Calcul littéral", "Additionner, soustraire, multiplier des polynômes (développer)", 10, 11, ["distrib", "parenth"],
     "… : addition, soustraction et multiplication de polynômes (Niv 2-3)"),
    ("33-LI8", 33, "Algèbre – Calcul littéral", "Identités remarquables de degré 2", 11, 11, ["idrem"],
     "… : connaissance et utilisation d'identités remarquables de degré 2 (Niv 3)"),
    ("33-LI9", 33, "Algèbre – Calcul littéral", "Factoriser un polynôme", 11, 11, ["factor"],
     "… : décomposition de polynômes en produit de facteurs (Niv 3)"),
    ("33-LI10", 33, "Algèbre – Calcul littéral", "Prouver avec le calcul littéral", 11, 11, [],
     "… : utilisation du calcul littéral comme outil de preuve dans des cas simples (Niv 3)"),
    ("33-EQ1", 33, "Algèbre – Équations", "Traduire un problème par une équation du premier degré", 10, 11, ["probeq@12"],
     "Résolution de problèmes nécessitant le recours à l'algèbre ; traduction d'une situation par une équation du premier degré à une inconnue"),
    ("33-EQ2", 33, "Algèbre – Équations", "Traduire un problème par un système de deux équations", 11, 11, ["sysprob"],
     "Traduction d'une situation par un système d'équations du premier degré à deux inconnues (Niv 3)"),
    ("33-EQ3", 33, "Algèbre – Équations", "Traduire un problème par une équation du deuxième degré", 11, 11, ["probeq2", "probeq@3"],
     "Traduction d'une situation par une équation du deuxième degré à une inconnue (Niv 3)"),
    ("33-EQ4", 33, "Algèbre – Équations", "Résoudre une équation du premier degré", 10, 11, ["eq1", "eqfrac", "eqverif@12"],
     "Résolution d'équations du premier degré à une inconnue à l'aide des règles d'équivalence"),
    ("33-EQ5", 33, "Algèbre – Équations", "Résoudre un système de deux équations (combinaison, substitution)", 11, 11, ["sys2"],
     "Résolution d'un système d'équations du premier degré à deux inconnues à l'aide des méthodes de combinaison linéaire et de substitution (Niv 3)"),
    ("33-EQ6", 33, "Algèbre – Équations", "Résoudre une équation du deuxième degré (factorisation, formule)", 11, 11, ["eq2", "eq2fact", "eq2disc", "eqverif@3"],
     "Résolution d'équations du deuxième degré à une inconnue par factorisation ou à l'aide de la formule de Viète (Niv 3)"),
    ("33-EQ7", 33, "Algèbre – Équations", "Exprimer une variable d'une formule en fonction des autres", 11, 11, ["formule"],
     "Expression de chacune des variables d'une formule connue en fonction des autres (Niv 2-3)"),
    # ---------------- MSN 34 – Grandeurs et mesures ----------------
    ("34-RP", 34, "Éléments pour la résolution de problèmes", "Résoudre des problèmes de mesurage", 9, 11, ["ulong@3"],
     "Résolution de problèmes de mesurage en lien avec les grandeurs et les théorèmes étudiés"),
    ("34-ME1", 34, "Mesure de grandeurs et conversion d'unités", "Comparer, classer et mesurer des grandeurs (longueur, aire, volume, angle, masse)", 9, 11, [],
     "Comparaison, classement et mesure de grandeurs (longueur, aire, volume, angle, masse) par manipulation de lignes, angles, surfaces, ou solides, en utilisant des unités conventionnelles et non conventionnelles"),
    ("34-ME2", 34, "Mesure de grandeurs et conversion d'unités", "Estimer et convertir longueurs, masses, aires", 9, 9, ["ulong", "uaire"],
     "Estimation de grandeurs, choix d'une unité adéquate, prise de mesure à l'aide d'un instrument adapté et expression d'une grandeur dans diverses unités : longueur, angle (mesure en degrés), masse, aire"),
    ("34-ME3", 34, "Mesure de grandeurs et conversion d'unités", "Estimer et convertir volumes, capacités, durées", 10, 11, ["uvol", "utemps"],
     "… : volume, capacité ; temps (9e : Niv s)"),
    ("34-ME4", 34, "Mesure de grandeurs et conversion d'unités", "Vitesse, débit, masse volumique : unités", 11, 11, ["ucomp"],
     "… : vitesse (10e : Niv s) ; autres grandeurs (débit, masse volumique,…) (Niv 1s-2-3)"),
    ("34-ME5", 34, "Mesure de grandeurs et conversion d'unités", "Unités d'autres cultures et d'autrefois (mile, pouce, coudée…)", 9, 11, [],
     "Sensibilisation aux aspects culturels (degré Fahrenheit, mile, pouce, mille marin, nœud,…) et historiques (coudée, pied, arpent,…) de la mesure"),
    ("34-CG1", 34, "Calcul de grandeurs", "Périmètre d'un polygone", 9, 9, ["perim"],
     "Mesure des dimensions adéquates et calcul : du périmètre d'un polygone"),
    ("34-CG2", 34, "Calcul de grandeurs", "Aire du carré, du rectangle, du triangle, du parallélogramme, du losange", 9, 9, ["aire1", "aire2"],
     "… de l'aire d'un carré, d'un rectangle, d'un triangle, d'un parallélogramme, d'un losange (par décomposition et à l'aide d'une formule)"),
    ("34-CG3", 34, "Calcul de grandeurs", "Aire et périmètre par décomposition en figures simples", 9, 11, ["aire3", "perim@3"],
     "… de l'aire d'un polygone par décomposition en figures simples (9e–10e) ; du périmètre et de l'aire d'une surface par décomposition en figures simples (10e–11e)"),
    ("34-CG4", 34, "Calcul de grandeurs", "Périmètre et aire du disque", 10, 10, ["disque@12"],
     "… du périmètre et de l'aire d'un disque"),
    ("34-CG5", 34, "Calcul de grandeurs", "Longueur d'un arc, aire d'un secteur", 10, 11, ["disque@3"],
     "… de la longueur d'un arc de cercle et de l'aire d'un secteur circulaire (Niv 2-3)"),
    ("34-CG6", 34, "Calcul de grandeurs", "Volume et aire du cube et du pavé", 9, 9, ["volpave", "vol@1"],
     "… du volume et de l'aire du cube et du parallélépipède rectangle"),
    ("34-CG7", 34, "Calcul de grandeurs", "Volume et aire d'un prisme droit", 9, 11, ["vol@2", "airelat@1"],
     "… du volume (par décomposition et à l'aide d'une formule) et de l'aire de prismes droits (9e–10e : Niv 2-3 ; 10e–11e : Niv 1)"),
    ("34-CG8", 34, "Calcul de grandeurs", "Volume et aire du cylindre", 10, 11, ["vol@3", "airelat@23"],
     "… du volume et de l'aire du cylindre (10e : Niv 2-3) ; du volume du cylindre (11e : Niv 1)"),
    ("34-CG9", 34, "Calcul de grandeurs", "Volume et aire d'une pyramide, volume d'un cône et d'une sphère", 11, 11, ["volcone", "airepyr"],
     "… du volume et de l'aire : d'une pyramide (Niv 2-3), d'une sphère (Niv 3) ; du volume d'un cône (Niv 2-3)"),
    ("34-CG10", 34, "Calcul de grandeurs", "Volume d'un solide décomposé en solides simples", 10, 11, ["voldecomp", "volcomp"],
     "… du volume d'un solide (en le décomposant au besoin en solides simples)"),
    ("34-CG11", 34, "Calcul de grandeurs", "Calculer une grandeur manquante (hauteur à partir de l'aire…)", 10, 11, ["grandmanq", "volmanq"],
     "Calcul d'une grandeur manquante à partir de celles qui sont connues (hauteur d'un triangle à partir de sa base et de son aire,…)"),
    ("34-CG12", 34, "Calcul de grandeurs", "Utiliser le théorème de Pythagore", 10, 11, ["pyth", "pythfig", "pythrec"],
     "Utilisation du théorème de Pythagore (10e–11e : Niv 2-3 ; 11e : Niv 1)"),
    ("34-CG13", 34, "Calcul de grandeurs", "Figures semblables et théorème de Thalès", 11, 11, ["simil", "thales", "thalesrec"],
     "Utilisation de la proportionnalité des figures semblables et du théorème de Thalès (Niv 2-3)"),
]


def rows():
    """Items du référentiel : dicts (code, axe, theme, champ, label, y1, y2, links, per)."""
    out = []
    for code, ax, champ, label, y1, y2, links, per in ITEMS:
        out.append({"code": code, "axe": f"MSN {ax}", "theme": AXES[ax], "champ": champ, "label": label, "y1": y1, "y2": y2, "links": links, "per": per})
    return out


def etat(r):
    return "couvert" if r["links"] else HORS


def main():
    rs = rows()
    ids, _ = R.load_map()
    known = set(ids)
    codes = [r["code"] for r in rs]
    assert len(set(codes)) == len(codes), "codes en double"
    for r in rs:
        assert 9 <= r["y1"] <= r["y2"] <= 11, r["code"]
        assert len(r["label"]) <= 110, ("intitulé trop long", r["code"])
        for s in r["links"]:
            n, _, lv = s.partition("@")
            assert n in known, ("notion inconnue", r["code"], n)
            assert not lv or set(lv) <= set("123"), (r["code"], s)
    th, no = [], []
    idx = lambda L, x: L.index(x) if x in L else (L.append(x) or len(L) - 1)
    data = [[r["code"], 0, idx(th, r["theme"]), idx(no, r["champ"]), r["label"], r["y1"], r["y2"]] for r in rs]
    head = ("// Généré par tools/ref_co.py (25.11) : référentiel du Cycle d'orientation (9e–11e) = Plan d'études romand (PER),\n"
            "// cycle 3, MSN 31 à 34 : progression des apprentissages, intitulés courts (texte officiel en commentaire ci-dessous).\n"
            "// Source : portail.ciip.ch (tableaux du PER, API publique per.ciip.ch), récupérés le 25.11.2026.\n"
            "// Champs : code, niveau (0 : profil CO sans niveau), axe, champ du PER, intitulé, 1re année, dernière année.\n")
    src = "".join(f"// {r['code']} [{r['y1']}e–{r['y2']}e] PER : {r['per']}\n" for r in rs)
    js = (head + src +
          "const REF_CO = {\n  niv: [\"tous\"],\n"
          "  th: " + json.dumps(th, ensure_ascii=False) + ",\n"
          "  no: " + json.dumps(no, ensure_ascii=False) + ",\n"
          "  c: [\n" + ",\n".join("    " + json.dumps(d, ensure_ascii=False) for d in data) + "\n  ],\n"
          "  // item → notions de l'app (« id » : tous les niveaux de question ; « id@13 » : niveaux 1 et 3)\n"
          "  q: " + json.dumps({r["code"]: r["links"] for r in rs if r["links"]}, ensure_ascii=False, separators=(",", ":")) + ",\n};\n")
    assert not any("//" in l for l in js.splitlines() if not l.lstrip().startswith("//")), "« // » au milieu d'une ligne"
    OUT.write_text(js, encoding="utf-8")
    print(f"{OUT.relative_to(ROOT)} : {len(rs)} items, {sum(bool(r['links']) for r in rs)} rattachés à des questions")
    for y in (9, 10, 11):
        cur = [r for r in rs if r["y1"] <= y <= r["y2"]]
        q = [r for r in cur if r["links"]]
        print(f"  {y}e : {len(cur):3} items, {len(q):3} avec questions, {len(cur) - len(q):2} travaillés en classe")
    print("  par axe :", ", ".join(f"{a} {sum(r['axe'] == 'MSN ' + str(k) for r in rs)}" for k, a in AXES.items()))


if __name__ == "__main__":
    main()
