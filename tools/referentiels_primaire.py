#!/usr/bin/env python3
"""Référentiel du primaire (fin de primaire) : PER 7P–8P (Suisse romande) et CM1–CM2 (France).

Écrit tools/referentiels_primaire.json. Usage interne : les documents sources sont hors dépôt,
dans ~/DATA/Enseignement/Sources/Officiel/ (README.md : URL, date, droits).

- Suisse : le PER (portail.ciip.ch) est une application dynamique, sans PDF téléchargeable pour le cycle 2.
  Les éléments de progression 7e–8e viennent de l'extrait officiel du PER reproduit p. 4 de l'ECR
  Mathématiques 8P (DGEO Vaud, 27.04.2023) : « verifie": true. Les autres éléments sont repris de mémoire du PER
  et marqués « verifie": false (à contrôler sur portail.ciip.ch avant usage). Textes résumés, pas recopiés.
  Le PER ne distingue pas 7P et 8P : ses progressions couvrent le demi-cycle « 7e–8e ».
- France : CM1 et CM2 sont repris de tools/referentiels_fr.json (agent référentiels, programme du cycle 3,
  BO n° 16 du 17.04.2025, objectifs par année) s'il est disponible ; sinon on garde la partie FR du JSON existant.
  On y ajoute la correspondance avec les notions de l'app (« notions ») et la proximité (« proximite »).

Proximité avec l'app : « direct » = une notion de 9e existe déjà et son niveau 1 convient presque tel quel ;
« adapter » = la notion existe mais il faut des nombres plus petits, un vocabulaire du primaire ou une
représentation (droite graduée, figure) ; « nouveau » = rien dans l'app ; « hors_saisie » = construction,
manipulation d'instruments, production de données : pas de réponse saisie possible.
"""
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "tools/referentiels_primaire.json"
FR_CANDIDATS = [ROOT / "tools/referentiels_fr.json", Path.home() / "Projets/5min2maths-wt/referentiels/tools/referentiels_fr.json"]

ECR = "VD_ECR_MAT_8P_enseignant.pdf, p. 4 (extrait officiel du PER, objectifs évalués)"
MEM = "PER (portail.ciip.ch), repris de mémoire : à vérifier"

# (code, objectif, thème, élément, texte court, vérifié, notions, proximité)
CH = [
    # MSN 21 — Espace
    ("MSN21.78.01", "MSN 21", "Espace", "Figures planes", "Reconnaître, décrire et nommer triangles, quadrilatères et cercle selon leurs propriétés (axes de symétrie, côtés parallèles, côtés égaux)", True, ["quadri"], "adapter"),
    ("MSN21.78.02", "MSN 21", "Espace", "Figures planes", "Construire les figures planes courantes avec règle, équerre, compas et rapporteur", True, [], "hors_saisie"),
    ("MSN21.78.03", "MSN 21", "Espace", "Figures planes", "Construire des droites parallèles et perpendiculaires", True, [], "hors_saisie"),
    ("MSN21.78.04", "MSN 21", "Espace", "Transformations", "Construire l'image d'une figure par une translation ou une symétrie axiale", True, ["symetries"], "adapter"),
    ("MSN21.78.05", "MSN 21", "Espace", "Repérage", "Repérer et communiquer des positions et des itinéraires dans un plan (système personnel ou conventionnel)", True, ["symetries"], "adapter"),
    ("MSN21.78.06", "MSN 21", "Espace", "Solides", "Reconnaître et nommer des solides (cube, pavé, prisme, pyramide, cylindre, cône, boule) ; faces, arêtes, sommets", False, ["solides"], "direct"),
    ("MSN21.78.07", "MSN 21", "Espace", "Solides", "Associer un solide à son développement (cube, pavé)", False, [], "nouveau"),
    # MSN 22 — Nombres
    ("MSN22.78.01", "MSN 22", "Nombres", "Comparaison et représentation", "Comparer, ranger, encadrer et intercaler des nombres décimaux", True, ["deccomp", "decarr"], "direct"),
    ("MSN22.78.02", "MSN 22", "Nombres", "Comparaison et représentation", "Extraire le nombre entier de dizaines, centaines, milliers, dixièmes, centièmes ou millièmes d'un nombre", True, ["decread"], "adapter"),
    ("MSN22.78.03", "MSN 22", "Nombres", "Comparaison et représentation", "Comparer et ranger des fractions unitaires ou de même dénominateur", True, ["fracrep"], "adapter"),
    ("MSN22.78.04", "MSN 22", "Nombres", "Comparaison et représentation", "Placer et lire des nombres sur une droite graduée", True, [], "nouveau"),
    ("MSN22.78.05", "MSN 22", "Nombres", "Écriture de nombres", "Passer du mot-nombre (oral ou écrit) à sa décomposition en unités, dizaines… dixièmes, centièmes, millièmes, et inversement", True, ["decread"], "adapter"),
    ("MSN22.78.06", "MSN 22", "Nombres", "Écriture de nombres", "Reconnaître un nombre sous diverses écritures (1/2 = 0,5 = 5 dixièmes = 5/10)", True, ["fracconv", "decread"], "adapter"),
    ("MSN22.78.07", "MSN 22", "Nombres", "Écriture de nombres", "Exprimer la moitié, le tiers, le quart, les trois quarts, le dixième d'une quantité", True, ["fractout"], "direct"),
    ("MSN22.78.08", "MSN 22", "Nombres", "Écriture de nombres", "Écrire des nombres à l'aide de puissances (8 = 2³)", True, ["pow9"], "direct"),
    ("MSN22.78.09", "MSN 22", "Nombres", "Nombres naturels", "Lire, écrire et décomposer les grands nombres naturels (au-delà du million)", False, [], "nouveau"),
    # MSN 23 — Opérations
    ("MSN23.78.01", "MSN 23", "Opérations", "Multiples, diviseurs, suites", "Reconnaître et prolonger des suites numériques ; exprimer leur loi de formation (progressions, multiples, puissances)", True, [], "nouveau"),
    ("MSN23.78.02", "MSN 23", "Opérations", "Multiples, diviseurs, suites", "Trouver des multiples et des diviseurs ; critères de divisibilité usuels", False, ["multdiv", "divcrit"], "direct"),
    ("MSN23.78.03", "MSN 23", "Opérations", "Calculs", "Choisir l'outil de calcul : calcul réfléchi, algorithme, répertoire mémorisé, calculatrice", True, ["ordgr"], "adapter"),
    ("MSN23.78.04", "MSN 23", "Opérations", "Calculs", "Utiliser commutativité, associativité, distributivité et décompositions pour calculer efficacement et estimer", True, ["ordgr"], "adapter"),
    ("MSN23.78.05", "MSN 23", "Opérations", "Calculs", "Algorithmes : addition et soustraction de décimaux (au plus 2 décimales, < 10'000)", True, ["decadd"], "direct"),
    ("MSN23.78.06", "MSN 23", "Opérations", "Calculs", "Algorithme de la multiplication (facteurs et produit avec au plus 2 décimales)", True, ["decmul"], "direct"),
    ("MSN23.78.07", "MSN 23", "Opérations", "Calculs", "Division euclidienne (dividende < 10'000, diviseur < 100)", True, [], "nouveau"),
    ("MSN23.78.08", "MSN 23", "Opérations", "Calculs", "Division décimale (dividende < 10'000 et diviseur < 100 avec au plus une décimale, quotient au plus 2 décimales)", True, ["decdiv"], "adapter"),
    ("MSN23.78.09", "MSN 23", "Opérations", "Calculs", "Répertoire mémorisé : tables, doubles et moitiés, multiplier et diviser par 10, 100, 1000", False, ["dec10"], "adapter"),
    ("MSN23.78.10", "MSN 23", "Opérations", "Calculatrice", "Utiliser la calculatrice quand le calcul est secondaire, pour vérifier ou pour des calculs complexes", True, [], "hors_saisie"),
    # MSN 24 — Grandeurs et mesures
    ("MSN24.78.01", "MSN 24", "Grandeurs et mesures", "Mesure", "Doubler, tripler une grandeur ; en prendre la moitié, le tiers, le quart, les trois quarts", True, ["fractout"], "adapter"),
    ("MSN24.78.02", "MSN 24", "Grandeurs et mesures", "Mesure", "Mesurer une longueur (règle) et un angle (rapporteur) ; donner le résultat par un nombre ou un encadrement", True, ["angtype"], "adapter"),
    ("MSN24.78.03", "MSN 24", "Grandeurs et mesures", "Calcul de grandeurs", "Calculer des longueurs, des trajets et des périmètres", True, ["perim"], "direct"),
    ("MSN24.78.04", "MSN 24", "Grandeurs et mesures", "Calcul de grandeurs", "Aire (mesures entières) du carré et du rectangle", True, ["aire1"], "direct"),
    ("MSN24.78.05", "MSN 24", "Grandeurs et mesures", "Calcul de grandeurs", "Aire du triangle, du parallélogramme, du losange et de surfaces décomposables", True, ["aire1", "aire2", "aire3"], "direct"),
    ("MSN24.78.06", "MSN 24", "Grandeurs et mesures", "Unités", "Unités conventionnelles : longueurs (mm à km), aires (cm², dm², m²), angles (degrés)", True, ["ulong", "uaire"], "direct"),
    ("MSN24.78.07", "MSN 24", "Grandeurs et mesures", "Unités", "Exprimer une grandeur dans une autre unité (km/m, m/cm, t/kg, kg/g, h/min, min/s, l/dl)", True, ["ulong", "utemps", "uvol"], "direct"),
    ("MSN24.78.08", "MSN 24", "Grandeurs et mesures", "Unités", "Durées : calculer une durée, une heure de début ou de fin", False, ["utemps"], "direct"),
    ("MSN24.78.09", "MSN 24", "Grandeurs et mesures", "Unités", "Capacités (l, dl, cl, ml) et volume par dénombrement de cubes unités", False, ["uvol", "volpave"], "adapter"),
    # MSN 25 — Modélisation
    ("MSN25.78.01", "MSN 25", "Modélisation", "Résolution de problèmes", "Trier et organiser les informations (liste, tableau, schéma, croquis), mettre en œuvre une démarche, vérifier et communiquer", True, ["decprob"], "adapter"),
    ("MSN25.78.02", "MSN 25", "Modélisation", "Résolution de problèmes", "Traduire un problème en opérations, avec des parenthèses si besoin", True, ["tradexpr", "prio"], "direct"),
    ("MSN25.78.03", "MSN 25", "Modélisation", "Résolution de problèmes", "Lire, utiliser et élaborer des tableaux de valeurs ; lire des représentations graphiques", True, ["proptab", "diagr"], "adapter"),
    ("MSN25.78.04", "MSN 25", "Modélisation", "Résolution de problèmes", "Problèmes additifs et soustractifs (états, transformations, comparaisons : EEE, ECE, ETE, TTT)", True, ["decprob"], "adapter"),
    ("MSN25.78.05", "MSN 25", "Modélisation", "Résolution de problèmes", "Problèmes multiplicatifs et divisifs : itération, produit cartésien, produit de mesures, proportionnalité", True, ["prop", "proptab"], "direct"),
]

# France : attendus du cycle 3 (CM1, CM2) → notions de l'app (motif sur le texte, premières correspondances)
FR_MAP = [
    (r"valeur des chiffres|relations entre les unités de numération|diverses représentations d’un nombre", ["decread"], "adapter"),
    (r"suite écrite et la suite orale", [], "nouveau"),
    (r"(Comparer|Ordonner).*(nombres entiers|des nombres dans)|encadrer, intercaler des nombres entiers", ["deccomp"], "adapter"),
    (r"demi-droite graduée", [], "nouveau"),
    (r"divisions décimales", ["decdiv"], "adapter"),
    (r"divisions euclidiennes", [], "nouveau"),
    (r"multiples communs", ["multdiv", "arith"], "adapter"),
    (r"multiples? de 2, de 5|multiple d’un nombre|diviseurs?", ["multdiv", "divcrit"], "direct"),
    (r"« égal à »", ["deccomp"], "adapter"),
    (r"Comparer des (longueurs|masses)", ["ulong"], "adapter"),
    (r"fraction d’une quantité", ["fractout"], "direct"),
    (r"Comparer des fractions|Encadrer une fraction|encadrer une fraction", ["fracrep"], "adapter"),
    (r"Additionner et soustraire des fractions|produit d’un entier et d’une fraction", ["fracadd"], "adapter"),
    (r"fractions? décimales?|unités simples, dixièmes|écriture à virgule", ["decread", "fracconv"], "adapter"),
    (r"fraction supérieure à 1|somme d’un entier et d’une fraction|Interpréter, représenter, écrire et lire des fractions|Savoir interpréter", [], "nouveau"),
    (r"partie entière et l’arrondi", ["decarr"], "direct"),
    (r"nombres décimaux donnés", ["deccomp"], "direct"),
    (r"relations entre des fractions usuelles|écriture décimale de fractions usuelles", ["fracconv"], "direct"),
    (r"par 10, 100 ou 1 000|par 10$", ["dec10"], "direct"),
    (r"distributivité", ["distrib"], "adapter"),
    (r"Estimer le résultat", ["ordgr"], "direct"),
    (r"parenthèses", ["prio"], "direct"),
    (r"additions et des soustractions de nombres décimaux|Ajouter (ou soustraire )?(un nombre entier à un nombre décimal|deux nombres décimaux)", ["decadd"], "direct"),
    (r"multiplications? d’un nombre décimal|multiplication d’un nombre décimal", ["decmul"], "direct"),
    (r"problèmes additifs|problèmes multiplicatifs|problèmes mixtes|comparaison multiplicative", ["decprob"], "adapter"),
    (r"dénombrement", ["denombr"], "adapter"),
    (r"nombre manquant|nombre inconnu|problèmes algébriques", ["eqverif", "probeq"], "adapter"),
    (r"programme de calcul", ["tradexpr"], "adapter"),
    (r"suite de nombres|suite de motifs", [], "nouveau"),
    (r"unités de longueur|relations entre les unités de longueur|unités de masse|relations entre les unités de masse", ["ulong"], "direct"),
    (r"contenance", ["uvol"], "adapter"),
    (r"périmètre", ["perim"], "direct"),
    (r"aire d’un carré ou d’un rectangle|Déterminer des aires", ["aire1"], "direct"),
    (r"centimètres? carrés?|décimètre carré|Convertir des aires", ["uaire"], "direct"),
    (r"angle droit mesure 90|lexique spécifique associé aux angles|Comparer des angles", ["angtype"], "adapter"),
    (r"horloge|durées", ["utemps"], "adapter"),
    (r"triangle, triangle rectan|propriétés de parallélisme des côtés", ["quadri"], "adapter"),
    (r"axes? de symétrie|rendre symétrique", ["symetries"], "adapter"),
    (r"Nommer un cube|Décrire un cube|faces d’un|nature des faces", ["solides"], "direct"),
    (r"assemblages de cubes", ["volpave"], "adapter"),
    (r"diagramme|tableau à simple|données d’un tableau", ["diagr"], "adapter"),
    (r"aléatoire|probabilit|équiprobab|chances sur|issues", ["proba"], "adapter"),
    (r"proportionnalité", ["proptab", "prop"], "direct"),
]


def map_fr(texte, saisie):
    if saisie is False:
        return [], "hors_saisie"
    for pat, notions, prox in FR_MAP:
        if re.search(pat, texte):
            return notions, prox
    return [], "nouveau"


def france():
    src = next((p for p in FR_CANDIDATS if p.exists()), None)
    if src is None:
        old = json.loads(OUT.read_text()) if OUT.exists() else {}
        return old.get("systemes", {}).get("FR"), None
    classes = json.loads(src.read_text())["classes"]
    fr = {}
    for c in ("CM1", "CM2"):
        v = classes[c]
        themes = []
        for t in v["themes"]:
            att = []
            for a in t["attendus"]:
                notions, prox = map_fr(a["texte"], a.get("saisie"))
                att.append({"code": a["code"], "texte": a["texte"], "notions": notions, "proximite": prox})
            themes.append({"domaine": t["domaine"], "domaine_label": t["domaine_label"],
                           "theme": t["theme"] or "La proportionnalité", "attendus": att})
        fr[c] = {"label": c, "age": v["age"], "harmos": v["harmos"], "cycle": v["cycle"],
                 "source": "France/" + v["source"], "reference": v["reference"], "themes": themes}
    return fr, src


def main():
    themes = {}
    for code, obj, th, el, txt, ok, notions, prox in CH:
        t = themes.setdefault(obj, {"objectif": obj, "theme": th, "attendus": []})
        t["attendus"].append({"code": code, "element": el, "texte": txt, "verifie": ok,
                              "source": ECR if ok else MEM, "notions": notions, "proximite": prox})
    fr, src = france()
    data = {
        "_meta": {
            "titre": "Référentiel du primaire (fin de primaire) : PER 7P–8P et France CM1–CM2",
            "genere_par": "tools/referentiels_primaire.py",
            "date": "2026-11-23",
            "perimetre": "Décision du 23.11 : fin de primaire seulement (7P–8P, CM1–CM2). 1P–6P et CP–CE2 non traités (app peu adaptée : voir tools/primaire.md).",
            "sources": "~/DATA/Enseignement/Sources/Officiel/PER_Suisse_romande et ~/DATA/Enseignement/Sources/Officiel/France (README.md : URL, date, droits). Usage interne.",
            "codes_CH": "MSNxx.78.nn : numérotation interne (le PER n'a pas de code par élément de progression) ; MSN = objectif d'apprentissage officiel ; 78 = demi-cycle 7e–8e (le PER ne distingue pas 7P et 8P).",
            "codes_FR": "classe.domaine.rang, repris de tools/referentiels_fr.json (agent référentiels).",
            "verifie": "true = texte résumé de l'extrait officiel du PER (ECR Vaud 8P 2023, p. 4) ; false = repris de mémoire du PER, à vérifier sur portail.ciip.ch.",
            "notions": "ids des notions de l'app (src/curriculum.js, src/gen3.js), aujourd'hui en 9e, qui entraînent déjà l'attendu ou s'en approchent.",
            "proximite": "direct = la notion de 9e convient presque telle quelle (niveau 1) ; adapter = notion proche, à simplifier (nombres, vocabulaire, représentation) ; nouveau = rien dans l'app ; hors_saisie = construction, mesure aux instruments, recueil de données.",
            "fr_source": str(src) if src else "partie FR conservée du JSON précédent",
        },
        "correspondance": [
            {"harmos": "1P", "age": "4-5 ans", "france": "MS (cycle 1)", "per": "cycle 1"},
            {"harmos": "2P", "age": "5-6 ans", "france": "GS (cycle 1)", "per": "cycle 1"},
            {"harmos": "3P", "age": "6-7 ans", "france": "CP (cycle 2)", "per": "cycle 1"},
            {"harmos": "4P", "age": "7-8 ans", "france": "CE1 (cycle 2)", "per": "cycle 1"},
            {"harmos": "5P", "age": "8-9 ans", "france": "CE2 (cycle 2)", "per": "cycle 2"},
            {"harmos": "6P", "age": "9-10 ans", "france": "CM1 (cycle 3)", "per": "cycle 2"},
            {"harmos": "7P", "age": "10-11 ans", "france": "CM2 (cycle 3)", "per": "cycle 2"},
            {"harmos": "8P", "age": "11-12 ans", "france": "6e (cycle 3)", "per": "cycle 2"},
            {"harmos": "9e", "age": "12-13 ans", "france": "5e (cycle 4)", "per": "cycle 3"},
        ],
        "systemes": {
            "CH": {"label": "Suisse romande (PER)", "annees": {"7P-8P": {
                "label": "7P–8P (fin du cycle 2)", "age": "10-12 ans",
                "source": "PER_Suisse_romande/" + ECR.split(",")[0] + " ; PER_Suisse_romande/cycle_2_webCIIP.pdf (thématiques)",
                "evaluations": "GE : évaluation commune de 8P (maths, 20 % de la moyenne du 2e semestre ; 38 pts, seuil 27, 68,1 % de réussite en 2024-25, SRED n° 170) ; VD : ECR 8P (90 min, 1re partie sans calculatrice, 2e avec aide-mémoire et calculatrice).",
                "themes": list(themes.values())}}},
            "FR": fr,
        },
    }
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n")
    n_ch = sum(len(t["attendus"]) for t in themes.values())
    print(f"{OUT.name} : CH 7P–8P {n_ch} éléments ; FR {', '.join(fr) if fr else '—'}")
    for sysk, blocs in (("CH", [t for t in themes.values()]), ("FR", [t for c in (fr or {}).values() for t in c["themes"]])):
        cnt = {}
        for t in blocs:
            for a in t["attendus"]:
                cnt[a["proximite"]] = cnt.get(a["proximite"], 0) + 1
        print(" ", sysk, cnt)


if __name__ == "__main__":
    main()
