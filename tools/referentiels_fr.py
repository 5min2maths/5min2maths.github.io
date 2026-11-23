#!/usr/bin/env python3
"""Référentiel France (programmes officiels de mathématiques) → tools/referentiels_fr.json.

Lit les PDF officiels rangés hors dépôt dans ~/DATA/Enseignement/Sources/Officiel/France (voir le README de ce dossier)
et en extrait, par classe, les thèmes et les attendus (objectifs d'apprentissage du cycle 3 et du cycle 4,
« capacités attendues » du lycée, attendus de fin d'année 2019 encore en vigueur en 4e et 3e en 2026-2027).
Chaque attendu reçoit un code stable « classe.domaine.numéro » (ex. 3e.NC.07) et la liste des notions de l'app
qui le couvrent (table MAP_FR ci-dessous, motifs sur les codes, même logique que tools/referentiels.py).

Usage : python tools/referentiels_fr.py            (écrit le JSON et affiche la couverture)
        python tools/referentiels_fr.py --liste    (liste code + texte, pour ajuster MAP_FR)
"""
import json, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = Path.home() / "DATA/Enseignement/Sources/Officiel/France"
OUT = ROOT / "tools/referentiels_fr.json"

def pdftext(name):
    return subprocess.run(["pdftotext", "-layout", str(SRC / name), "-"], capture_output=True, text=True, check=True).stdout

def clean(s):
    s = re.sub(r"\s+", " ", s).strip(" .;:")
    return s

def noisy(l):
    """Ligne de mise en page d'une fraction (chiffres et espaces) : à ignorer."""
    t = l.strip()
    return bool(t) and len(re.sub(r"[\d\s.,;…+–\-×=a-z𝑥]", "", t)) <= 1 and len(t) < 200 and re.search(r"\d", t) and not re.search(r"[a-zé]{4}", t)

# ---------------- Cycles 3 et 4 (programmes 2025 et 2026 : « Objectifs d'apprentissage » par année) ----------------
LEVELS = {"Cours moyen première année": "CM1", "Cours moyen deuxième année": "CM2", "Sixième": "6e",
          "Cinquième": "5e", "Quatrième": "4e", "Troisième": "3e"}
DOMAINS = {"Nombres, calcul et résolution de problèmes": "NC", "Nombres et calculs": "NC", "Grandeurs et mesures": "GM",
           "Espace et géométrie": "EG", "Organisation et gestion de données et probabilités": "DP",
           "La proportionnalité": "PF", "Proportionnalité, fonctions": "PF",
           "Initiation à la pensée informatique": "PI", "La pensée informatique": "PI"}

def parse_cycle(text, cycle):
    L = text.split("\n")
    # Sommaire : sous-titres connus (lignes indentées entre « Sommaire » et le premier « Principes » du corps)
    end = next(i for i, l in enumerate(L) if i > 5 and l.strip() == "Principes" and not l.startswith(" ") and i > 30)
    subs = {l.strip() for l in L[:end] if l.startswith(" ") and l.strip()}
    body = L[end:]
    # début du corps du programme = premier titre de domaine après « Organisation du programme »
    start = next(i for i, l in enumerate(body) if l.strip() == "Organisation du programme")
    dom = lvl = sub = None
    items = []
    i = start
    while i < len(body):
        t = body[i].strip()
        if t in DOMAINS and not body[i].startswith("  "):
            dom, lvl, sub = DOMAINS[t], None, None
        elif t in LEVELS:
            lvl, sub = LEVELS[t], None
        elif t in subs and lvl:
            sub = t
        elif t == "Automatismes" and lvl and dom and cycle == "c4":
            # cycle 4 : automatismes en puces « − » avant les objectifs
            i += 1
            while i < len(body):
                s = body[i].strip()
                if s.startswith("Objectifs d") or s in subs or s in LEVELS or s in DOMAINS or s.startswith("Prolongements"): break
                if s.startswith("−"):
                    txt = s.lstrip("− ").strip(); i += 1
                    while i < len(body) and body[i].strip() and not body[i].strip().startswith("−") and not body[i].strip().startswith("Objectifs d"):
                        if not noisy(body[i]): txt += " " + body[i].strip()
                        i += 1
                    items.append({"classe": lvl, "domaine": dom, "theme": sub or "", "groupe": "Automatismes", "texte": clean(txt)})
                    continue
                i += 1
            continue
        elif t.startswith("Objectifs d’apprentissage") and lvl and dom:
            # intitulé de groupe : ligne non vide qui précède (ex. « Le sens quotient d'une fraction »)
            j = i - 1
            while j > 0 and not body[j].strip(): j -= 1
            grp = body[j].strip()
            grp = None if (grp in subs or grp in LEVELS or grp.startswith("Connaissances") or len(grp) > 70 or grp.endswith((".", ":"))) else grp
            i += 1
            cur = []
            while i < len(body):
                l = body[i]; s = l.strip()
                if not s:
                    # fin de liste si la ligne non vide suivante n'est pas un objectif (prose, titre…)
                    k = i + 1
                    while k < len(body) and not body[k].strip(): k += 1
                    nxt = body[k].strip() if k < len(body) else ""
                    if not nxt or nxt in subs or nxt in LEVELS or nxt in DOMAINS or nxt.startswith(("Prolongements", "Automatismes", "Objectifs", "Connaissances")) or len(nxt) > 140 or noisy(body[k]):
                        break
                    i += 1; continue
                if s in subs or s in LEVELS or s in DOMAINS or s.startswith(("Prolongements", "Automatismes", "Objectifs d")):
                    break
                if noisy(l): i += 1; continue
                if cur and (s[0].islower() or s[0] in "-(•" or cur[-1].endswith(":")) :
                    cur[-1] += " " + s
                else:
                    cur.append(s)
                i += 1
            for c in cur:
                items.append({"classe": lvl, "domaine": dom, "theme": sub or "", "groupe": grp or "", "texte": clean(c)})
            continue
        i += 1
    return items

# ---------------- Attendus de fin d'année 2019 (4e, 3e : encore en vigueur en 2026-2027) ----------------
ATT_DOM = {"Utiliser les nombres": "NC", "Pratiquer le calcul": "NC", "Comprendre et utiliser les notions de divisibilité": "NC",
           "Utiliser le calcul littéral": "NC", "Interpréter, représenter": "DP", "Comprendre et utiliser des notions élémentaires de probabilités": "DP",
           "Résoudre des problèmes de proportionnalité": "PF", "Comprendre et utiliser la notion de fonction": "PF",
           "Calculer avec des grandeurs": "GM", "Comprendre l’effet": "EG", "Représenter l’espace": "EG",
           "Utiliser les notions de géométrie plane": "EG", "Écrire, mettre au point": "PI"}

def parse_attendus(text, classe):
    L = text.split("\n")
    items, heading = [], None
    i = 0
    while i < len(L):
        s = L[i].strip()
        for k in ATT_DOM:
            if s.startswith(k): heading = s
        if s == "Ce que sait faire l’élève":
            if heading is None: heading = "Utiliser les nombres pour comparer, calculer et résoudre des problèmes"
            dom = next(v for k, v in ATT_DOM.items() if heading.startswith(k))
            i += 1; cur = []
            while i < len(L) and "Exemples de réussite" not in L[i]:
                l = L[i]; t = re.sub(r"^[^\wÀ-ÿ«(-]+", "", l.strip())
                if t and not t.startswith(("Attendus de fin", "Niveau")) and not noisy(l):
                    if t.startswith("Il ") or t.startswith("À partir") or (l.startswith("        ") and not cur):
                        cur.append(t)
                    elif cur:
                        cur[-1] += " " + t
                i += 1
            for c in cur:
                items.append({"classe": classe, "domaine": dom, "theme": heading, "groupe": "", "texte": clean(c)})
        i += 1
    return items

# ---------------- Lycée (programmes 2026 ; expertes 2019) : « Capacités attendues » et automatismes ----------------
LY_DOM = {"Nombres et calculs": "NC", "Nombres et calculs, algèbre": "NC", "Algèbre": "AL", "Analyse": "AN", "Fonctions": "AN",
          "Géométrie": "GE", "Statistiques et probabilités": "SP", "Probabilités et statistiques": "SP", "Probabilités": "SP",
          "Algorithmique et programmation": "AP", "Vocabulaire ensembliste et logique": "VL", "Automatismes": "AU",
          "Arithmétique": "AR", "Algèbre et géométrie": "AG", "Nombres complexes": "CX", "Graphes et matrices": "GR", "Suites": "AN"}
STOP = ("Démonstration", "Exemples d’algorithme", "Exemple d’algorithme", "Approfondissement", "Contenus", "Histoire des mathématiques",
        "Objectifs", "Exemples d’activité", "Commentaires", "Exemples de")

def parse_lycee(text, classe):
    L = text.split("\n")
    # Sommaire : profondeur de chaque titre (indentation) ; les domaines sont les titres les moins indentés sous « Programme ».
    k0 = next(i for i, l in enumerate(L[:80]) if l.strip() in ("Programme", "Contenus", "Contenus d'enseignement") and i > 3)
    som = {}
    for l in L[k0 + 1:k0 + 80]:
        if not l.strip(): break
        som.setdefault(l.strip(), len(l) - len(l.lstrip()))
    dom_indent = min(som.values())
    doms = {t for t, d in som.items() if d == dom_indent}
    subs = {t for t, d in som.items() if d > dom_indent and t not in ("Objectifs", "Histoire des mathématiques")}
    code = lambda t: LY_DOM.get(t) or "".join(w[0] for w in re.findall(r"[A-ZÉ][\wé]+|[a-zé]{4,}", t))[:2].upper()
    body0 = k0 + len(som)
    items, dom, sub = [], None, None
    i = body0 + 1
    while i < len(L):
        s = L[i].strip()
        if s in doms:
            dom, sub, domt = code(s), None, s
            if s == "Automatismes":
                i += 1
                grp = ""
                while i < len(L):
                    t = L[i].strip()
                    if t in doms: break
                    if t and not t.startswith("−") and len(t) < 50 and not t.endswith((".", ";", ":")) and not L[i].startswith("   "):
                        grp = t
                    elif t.startswith("−"):
                        txt = t.lstrip("− ").strip(); i += 1
                        while i < len(L) and L[i].strip() and not L[i].strip().startswith("−") and L[i].startswith("  "):
                            if not noisy(L[i]): txt += " " + L[i].strip()
                            i += 1
                        if grp: items.append({"classe": classe, "domaine": "AU", "theme": "Automatismes", "groupe": grp, "texte": clean(txt)})
                        continue
                    i += 1
                continue
        elif s in subs and dom:
            sub = s
        elif s.startswith("Capacités attendues") and dom:
            i += 1
            while i < len(L):
                t = L[i].strip()
                if t.startswith(STOP) or t in subs or t in doms: break
                if t.startswith(("−", "●")):
                    txt = t.lstrip("−● ").strip(); i += 1
                    while i < len(L):
                        u = L[i].strip()
                        if not u or u.startswith(("−", "●")) or u.startswith(STOP) or u in subs or u in doms: break
                        if not noisy(L[i]): txt += " " + u
                        i += 1
                    items.append({"classe": classe, "domaine": dom, "theme": sub or domt, "groupe": "", "texte": clean(txt)})
                    continue
                i += 1
            continue
        i += 1
    return items

# Maths expertes (programme 2019, mise en page en tableau : capacités attendues recopiées du PDF, texte officiel).
EXPERTES = [
    ("CX", "Nombres complexes : point de vue algébrique", "Effectuer des calculs algébriques avec des nombres complexes"),
    ("CX", "Nombres complexes : point de vue algébrique", "Résoudre une équation linéaire az = b"),
    ("CX", "Nombres complexes : point de vue algébrique", "Résoudre une équation simple faisant intervenir z et son conjugué"),
    ("CX", "Nombres complexes : point de vue géométrique", "Déterminer le module et les arguments d'un nombre complexe"),
    ("CX", "Nombres complexes : point de vue géométrique", "Représenter un nombre complexe par un point. Déterminer l'affixe d'un point"),
    ("CX", "Nombres complexes et trigonométrie", "Passer de la forme algébrique d'un nombre complexe à sa forme trigonométrique ou exponentielle et inversement"),
    ("CX", "Nombres complexes et trigonométrie", "Effectuer des calculs sur des nombres complexes en choisissant une forme adaptée, en particulier dans le cadre de la résolution de problèmes"),
    ("CX", "Nombres complexes et trigonométrie", "Utiliser les formules d'Euler et de Moivre pour transformer des expressions trigonométriques, calculer des puissances de nombres complexes"),
    ("CX", "Équations polynomiales", "Résoudre une équation polynomiale de degré 2 à coefficients réels"),
    ("CX", "Équations polynomiales", "Résoudre une équation de degré 3 à coefficients réels dont une racine est connue"),
    ("CX", "Équations polynomiales", "Factoriser un polynôme dont une racine est connue"),
    ("CX", "Utilisation des nombres complexes en géométrie", "Utiliser les nombres complexes pour étudier des configurations du plan : alignement, orthogonalité, longueurs, angles, ensembles de points"),
    ("CX", "Utilisation des nombres complexes en géométrie", "Utiliser les racines de l'unité dans l'étude de configurations liées aux polygones réguliers"),
    ("AR", "Arithmétique", "Déterminer les diviseurs d'un entier, le PGCD de deux entiers"),
    ("AR", "Arithmétique", "Résoudre une congruence ax ≡ b [n]. Déterminer un inverse de a modulo n lorsque a et n sont premiers entre eux"),
    ("AR", "Arithmétique", "Établir et utiliser des tests de divisibilité, étudier la primalité de certains nombres, étudier des problèmes de chiffrement"),
    ("AR", "Arithmétique", "Résoudre des équations diophantiennes simples"),
    ("GR", "Graphes et matrices", "Modéliser une situation par un graphe"),
    ("GR", "Graphes et matrices", "Modéliser une situation par une matrice"),
    ("GR", "Graphes et matrices", "Associer un graphe orienté pondéré à une chaîne de Markov à deux ou trois états"),
    ("GR", "Graphes et matrices", "Calculer l'inverse, les puissances d'une matrice carrée"),
    ("GR", "Graphes et matrices", "Utiliser le calcul matriciel pour résoudre un système linéaire, étudier une suite récurrente linéaire, compter des chemins, étudier une chaîne de Markov"),
]

DOCS = [
    # (fichier, analyseur, classe ou cycle, statut, référence)
    ("c3_2025_programme_BO16.pdf", "cycle", "c3", "BO n° 16 du 17 avril 2025 (arrêté du 10 avril 2025) : CM1 et 6e dès 2025-2026, CM2 dès 2026-2027"),
    ("c4_2026_programme_annexe2.pdf", "cycle", "c4", "BO n° 10 du 5 mars 2026 (arrêté du 18 février 2026) : 5e en 2026-2027, 4e en 2027-2028, 3e en 2028-2029"),
    ("c4_attendus_4e_2019.pdf", "att", "4e", "Attendus de fin d'année 2019 (programme 2020), en vigueur en 4e jusqu'en 2026-2027"),
    ("c4_attendus_3e_2019.pdf", "att", "3e", "Attendus de fin d'année 2019 (programme 2020), en vigueur en 3e jusqu'en 2027-2028"),
    ("lycee_2026_2nde_GT.pdf", "ly", "2nde", "BO n° 14 du 2 avril 2026 : en vigueur dès 2026-2027"),
    ("lycee_2026_1re_specialite.pdf", "ly", "1re", "BO n° 14 du 2 avril 2026 : spécialité, en vigueur dès 2026-2027"),
    ("lycee_2026_1re_maths_integrees_ens_sci.pdf", "ly", "1re-ES", "BO n° 14 du 2 avril 2026 : mathématiques intégrées à l'enseignement scientifique (élèves sans spécialité)"),
    ("lycee_2026_Tle_specialite.pdf", "ly", "Tle", "BO n° 14 du 2 avril 2026 : spécialité, en vigueur dès 2027-2028 (programme 2019 en 2026-2027)"),
    ("lycee_2026_Tle_maths_complementaires.pdf", "ly", "Tle-comp", "BO n° 14 du 2 avril 2026 : option maths complémentaires, dès 2027-2028"),
    ("lycee_2019_Tle_maths_expertes.pdf", "ly", "Tle-exp", "BO spécial n° 8 du 25 juillet 2019 : option maths expertes (pas de nouveau texte publié au BO du 2 avril 2026)"),
]
DOCS = [d if d[0] != "lycee_2019_Tle_maths_expertes.pdf" else (d[0], "manuel", d[2], d[3]) for d in DOCS]

# Classes : âge, équivalent HarmoS (Suisse romande) et statut du texte en 2026-2027.
CLASSES = {
    "CM1": {"label": "CM1", "age": "9-10 ans", "harmos": "6P", "cycle": "cycle 3", "app": None},
    "CM2": {"label": "CM2", "age": "10-11 ans", "harmos": "7P", "cycle": "cycle 3", "app": None},
    "6e": {"label": "6e", "age": "11-12 ans", "harmos": "8P", "cycle": "cycle 3", "app": 6},
    "5e": {"label": "5e", "age": "12-13 ans", "harmos": "9e (CO)", "cycle": "cycle 4", "app": 7},
    "4e": {"label": "4e", "age": "13-14 ans", "harmos": "10e (CO)", "cycle": "cycle 4", "app": 8},
    "3e": {"label": "3e", "age": "14-15 ans", "harmos": "11e (CO)", "cycle": "cycle 4", "app": 9},
    "4e-2019": {"label": "4e (attendus 2019, en vigueur en 2026-2027)", "age": "13-14 ans", "harmos": "10e (CO)", "cycle": "cycle 4", "app": 8},
    "3e-2019": {"label": "3e (attendus 2019, en vigueur jusqu'en 2027-2028)", "age": "14-15 ans", "harmos": "11e (CO)", "cycle": "cycle 4", "app": 9},
    "2nde": {"label": "2nde générale et technologique", "age": "15-16 ans", "harmos": "1re sec. II (Collège / MP1)", "cycle": "lycée", "app": 10},
    "1re": {"label": "1re générale, spécialité mathématiques", "age": "16-17 ans", "harmos": "2e sec. II", "cycle": "lycée", "app": 11},
    "1re-ES": {"label": "1re générale, mathématiques intégrées à l'enseignement scientifique", "age": "16-17 ans", "harmos": "2e sec. II", "cycle": "lycée", "app": 11},
    "Tle": {"label": "Terminale générale, spécialité mathématiques (programme 2026)", "age": "17-18 ans", "harmos": "3e sec. II", "cycle": "lycée", "app": 12},
    "Tle-comp": {"label": "Terminale, option mathématiques complémentaires (programme 2026)", "age": "17-18 ans", "harmos": "3e sec. II", "cycle": "lycée", "app": 12},
    "Tle-exp": {"label": "Terminale, option mathématiques expertes (programme 2019)", "age": "17-18 ans", "harmos": "3e-4e sec. II", "cycle": "lycée", "app": 12},
}
DOM_LABEL = {"NC": "Nombres et calculs", "GM": "Grandeurs et mesures", "EG": "Espace et géométrie",
             "DP": "Organisation et gestion de données, probabilités", "PF": "Proportionnalité, fonctions", "PI": "Pensée informatique",
             "AU": "Automatismes", "AP": "Algorithmique et programmation", "AN": "Analyse / fonctions", "AL": "Algèbre",
             "GE": "Géométrie", "AG": "Algèbre et géométrie", "SP": "Statistiques et probabilités", "PS": "Probabilités et statistique",
             "CX": "Nombres complexes", "AR": "Arithmétique", "GR": "Graphes et matrices", "VL": "Variation linéaire",
             "VE": "Variation exponentielle", "AI": "Analyse de l'information chiffrée", "PA": "Phénomènes aléatoires", "MQ": "Modélisation quadratique"}

INFINITIF = re.compile(r"^(?:L’|L'|S’|S')?\w+(?:er|ir|re|oir|dre)\b|^(?:Il|À partir|Exemples|Pour|Dans|Sur|Fonctions|Lois)\b")

def collect():
    items = []
    for f, kind, c, ref in DOCS:
        if kind == "manuel":
            its = [{"classe": c, "domaine": d, "theme": t, "groupe": "", "texte": x} for d, t, x in EXPERTES]
        elif not (SRC / f).exists():
            print("introuvable :", f, file=sys.stderr); continue
        else:
            t = pdftext(f)
            its = parse_cycle(t, c) if kind == "cycle" else parse_attendus(t, c + "-2019") if kind == "att" else parse_lycee(t, c)
        groups = {(x["classe"], x["groupe"]) for x in its}
        for x in its:
            x["source"] = f
            if not re.search(r"[A-Za-zé]{3}", x["groupe"]): x["groupe"] = ""
            if kind == "cycle" and x["classe"] in ("CM1", "CM2", "6e"): x["texte"] = re.sub(r" [ab]$", "", x["texte"])
            # cycle 3 : intertitres et paragraphes de prose captés par erreur
            if kind == "cycle" and x["groupe"] != "Automatismes" and (len(x["texte"]) > 230 or (x["classe"], x["texte"]) in groups or not INFINITIF.search(x["texte"])):
                continue
            items.append(x)
    # codes stables : classe.domaine.rang
    seen = {}
    for x in items:
        k = (x["classe"], x["domaine"]); seen[k] = seen.get(k, 0) + 1
        x["code"] = "%s.%s.%02d" % (x["classe"], x["domaine"], seen[k])
    return items

# Artefacts d'extraction (exposants aplatis par pdftotext) : corrections ponctuelles du texte officiel.
FIXES = [("3 × 3 × 3 × 3 = 34", "3 × 3 × 3 × 3 = 3⁴"), ("2² = 4 ; 23 = 8 ; 33 = 27", "2² = 4 ; 2³ = 8 ; 3³ = 27"),
         ("10² = 100 ; 103 = 1 000", "10² = 100 ; 10³ = 1 000"), ("𝑥2 = a", "𝑥² = a"), ("Il factorise une expression du type a - b", "Il factorise une expression du type a² − b²"),
         ("a 2 + 2ab + b 2 = (a + b) 2 a 2 – 2ab + b 2 = (a – b) 2 a 2 – b 2 = (a – b) (a + b)", "a² + 2ab + b² = (a + b)², a² – 2ab + b² = (a – b)², a² – b² = (a – b)(a + b)"),
         ("équations de la forme x = a", "équations de la forme x² = a"), ("ln q n = n ln q", "ln qⁿ = n ln q"),
         ("t ↦ eat", "t ↦ e^(at)"), ("t ↦ e–kt et t ↦ ekt", "t ↦ e^(–kt) et t ↦ e^(kt)"), ("un+1 = ƒ (un)", "u(n+1) = ƒ(u(n))")]

# ---------------- Correspondance attendus → notions de l'app ----------------
# notion → liste de (motif sur la classe, motif sur le texte de l'attendu), insensible à la casse.
# Une notion « couvre » un attendu quand elle permet de s'y entraîner par une réponse saisie (pas forcément tout l'attendu).
C3, C4 = r"6e", r"5e|4e|3e"
MAP_FR = {
    # --- nombres décimaux, 6e ---
    "decread": [(C3, r"valeur des chiffres|unités de numération|grands nombres entiers|Reconnaître un nombre décimal")],
    "deccomp": [(C3, r"Comparer deux nombres décimaux|Ordonner une liste de nombres décimaux|abscisse est un nombre décimal|Repérer un nombre décimal")],
    "decarr": [(C3, r"valeur arrondie|Encadrer un nombre décimal"), ("2nde", r"encadrement, d’amplitude|chiffres significatifs")],
    "ordgr": [(C3, r"ordres de grandeur"), ("4e-2019", r"ordres de grandeur"), ("2nde", r"ordre de grandeur")],
    "decadd": [(C3, r"Additionner et soustraire des nombres décimaux"), ("5e", r"Additionner et soustraire des décimaux|Additionner, soustraire, multiplier des nombres décimaux")],
    "dec10": [(C3, r"par 0,1|division par 10, 100"), (C4, r"Multiplier et diviser par 10, 100")],
    "decmul": [(C3, r"produit de deux nombres décimaux|sens de la multiplication de deux|multiplications entre des nombres décimaux"), ("5e", r"produits en lien avec les tables")],
    "decdiv": [(C3, r"Diviser un nombre décimal|divisions décimales"), ("5e", r"Diviser par un nombre décimal")],
    "decprob": [(C3, r"problèmes mettant en jeu des (multiplications|divisions décimales)"), ("5e", r"pour résoudre des problèmes et contrôler")],
    # --- entiers, divisibilité ---
    "multdiv": [(C3, r"divisions euclidiennes"), (C3, r"division euclidienne"), ("5e", r"multiples et diviseurs|quotient et le reste"), ("2nde", r"multiple, de diviseur")],
    "divcrit": [("5e|3e", r"critères de divisibilité")],
    "premiers": [("4e-2019|3e-2019", r"nombres premiers|facteurs premiers"), ("3e", r"Factoriser un nombre entier positif")],
    "arith": [("4e-2019|3e-2019", r"divisibilité"), ("Tle-exp", r"PGCD")],
    # --- fractions ---
    "fracrep": [(C3, r"Comparer et encadrer des fractions|Ordonner une liste de nombres écrits sous forme de fractions|Placer une fraction"), (C4, r"^Comparer des fractions|Comparer deux fractions|Comparaison de fractions")],
    "fracsimp": [(C3, r"égalités de fractions"), (C4, r"Simplifier une fraction|irréductible|fractions égales"), ("4e-2019|3e-2019", r"fractions égales|irréductible"), ("2nde", r"irréductible")],
    "fracadd": [(C3, r"Additionner et soustraire des fractions"), (C4, r"(Additionner|Addition) et soustra\w+ (des|de) fractions|additions et soustractions de fractions|dénominateur commun")],
    "fracmul": [("4e", r"produit de nombres rationnels|Diviser des fractions|inverse d’une fraction|inverse d’un nombre"), ("4e-2019", r"inverse pour calculer")],
    "fracops": [("4e", r"plusieurs opérations avec des fractions|opérations sur les fractions"), ("3e", r"faisant appel à des fractions|Additionner, soustraire, multiplier et diviser des fractions"),
                ("4e-2019|3e-2019", r"calcule avec les nombres rationnels|problèmes avec des nombres rationnels"), ("2nde", r"fractions simples|écritures fractionnaires")],
    "fractout": [(C3, r"Multiplier une fraction par un nombre entier|égalités à trous multiplicatives"), (C3, r"problèmes mettant en jeu des fractions"), (C3, r"appliquer une fraction à un nombre entier"), ("4e", r"fraction d’une fraction, d’un nombre|prendre la fraction d’un nombre"), ("5e", r"fraction simple d’un nombre")],
    "fracconv": [("5e", r"somme d’un nombre entier et d’une fraction"), ("4e", r"fraction est aussi le quotient"), (C3, r"différentes écritures d’un nombre décimal|Relier une fraction au résultat exact|fraction peut représenter"), ("5e", r"écriture décimale des fractions simples|sous de multiples formes"),
                 ("4e-2019", r"associe, dans le cas des nombres décimaux"), ("2nde", r"Passer d’une écriture d’un nombre à une autre")],
    # --- pourcentages, proportionnalité ---
    "pct": [("4e", r"20 % de 120"), (C3, r"pourcentage"), ("5e", r"pourcentages?|1 %, 10 %"), ("4e", r"Calculer avec des pourcentages|a % de c"), ("3e", r"pourcentage d’une quantité"), ("2nde", r"proportion")],
    "pctvar": [("1re-ES", r"taux d.évolution moyen"), ("4e|3e", r"augmentation ou une diminution|coefficient multiplicateur"), ("3e-2019", r"pourcentage d’évolution"), ("2nde", r"taux d’évolution|formulation additive|pourcentages de pourcentages"), ("1re|1re-ES", r"taux d’évolution")],
    "prop": [("4e-2019", r"situation de proportionnalité ou de non|proportionnalité dans le cadre de la géométrie"), (C3, r"proportionnalité"), ("5e", r"proportionnalité|proportions"), ("4e", r"quatrième proportionnelle|égalités de rapports"), ("4e-2019", r"quatrième proportionnelle|formule liant deux grandeurs"),
             ("3e-2019", r"proportionnalité dans le cadre de la géométrie")],
    "proptab": [(C3, r"proportionnalité à l’aide d’un tableau"), ("5e", r"proportionnalité par un tableau|proportionnalité à partir d’un tableau")],
    "echelle": [(C3, r"échelles"), ("3e", r"carte routière")],
    "agrand": [("4e-2019|3e-2019", r"agrandissement")],
    "vitesse": [("5e", r"vitesse moyenne")],
    "gquot": [("4e", r"grandeurs quotients"), ("3e-2019", r"grandeurs composées")],
    "ucomp": [("3e-2019", r"cohérence des résultats du point de vue des unités"), ("4e-2019|3e-2019", r"conversions d’unités sur des grandeurs composées")],
    # --- relatifs, opérations ---
    "prio": [("5e", r"priorités opératoires|Enchainer des opérations")],
    "tradexpr": [("5e", r"Traduire un problème|Nommer un calcul"), ("4e", r"Utiliser le vocabulaire \(somme")],
    "relrep": [("5e", r"représenter des grandeurs observables"), ("4e", r"Opposé d’un nombre|opposé d’un nombre rationnel"), ("5e", r"Définir les nombres relatifs|opposé et la valeur absolue|nombre positif, strictement|abscisse d’un nombre relatif|Comparer et ranger"), ("4e|3e", r"abscisse est un nombre relatif|Repérer un nombre relatif"),
               ("4e-2019", r"compare, range et encadre")],
    "reladd": [("5e", r"Additionner (deux|plusieurs) nombres décimaux relatifs|Soustraire deux|sommes comportant des parenthèses|Enchainer additions|addition et soustraction de nombres décimaux relatifs"), ("4e", r"sommes et différences de nombre relatifs")],
    "rel": [("4e", r"Multiplier deux nombres relatifs|Diviser deux nombres relatifs|enchainement d’opérations avec des nombres relatifs"), ("4e-2019", r"produits et des quotients")],
    # --- puissances, racines ---
    "pow9": [("4e", r"10² = 100"), ("3e", r"multiplication itérée"), (C4, r"carrés des nombres entiers compris"), ("5e", r"carré et du cube|carrés des entiers|cube de 10|puissance 2 ou 3|puissances simples"), ("4e", r"Puissances simples|carrés parfaits"), ("4e-2019", r"carrés parfaits")],
    "puiss": [("4e", r"Multiplier des puissances"), ("4e", r"puissances d’exposant|faisant intervenir des puissances"), ("3e", r"puissances"), ("3e-2019", r"puissances d’exposants positifs ou négatifs"), ("4e-2019", r"puissances d’exposants strictement|puissances de 10"),
              ("2nde", r"opérations sur les puissances|puissances, des racines")],
    "sci": [("3e", r"notation scientifique"), ("4e-2019", r"notation scientifique|préfixes de nano")],
    "scicalc": [("3e", r"problèmes notamment en utilisant la notation scientifique"), ("3e-2019", r"notation scientifique")],
    "carres": [("4e", r"définition de la racine carrée"), ("4e-2019", r"définition de la racine carrée|carrés parfaits")],
    "racenc": [("4e", r"Encadrer la racine carrée"), ("4e-2019", r"encadre la racine carrée|valeur approchée de la racine")],
    "rac": [("3e", r"utilisant la racine carrée|𝑥² = a"), ("3e-2019", r"racines carrées"), ("2nde", r"des racines carrées")],
    # --- calcul littéral, équations ---
    "valnum": [("5e", r"valeur d’une expression littérale|valeur numérique d’expressions"), ("3e", r"valeur d’une expression algébrique"), ("4e", r"valeur d’expressions numériques simples|programme de calcul à deux"), ("2nde", r"application numérique d’une formule")],
    "litelab": [("5e|4e", r"Produire (des formules|une formule)|formule littérale|double, le triple"), ("4e-2019", r"formule littérale"), ("3e", r"expression générique d’un nombre pair")],
    "eqverif": [("5e", r"Tester si une égalité"), ("4e", r"Tester si un nombre vérifie"), ("4e-2019", r"teste si un nombre est solution")],
    "monomes": [("4e", r"3 × 𝑥 sous la forme 3𝑥"), ("4e", r"3𝑥 × 2𝑥 = 6𝑥²")],
    "reduire": [("5e", r"Réduire une expression littérale"), ("4e", r"3𝑥 \+ 2𝑥 = 5𝑥"), ("3e", r"Simplifier des expressions littérales"), ("4e-2019", r"réduire une expression"), ("3e-2019", r"réduit des expressions"), ("1re|1re-ES", r"Développer, factoriser, réduire")],
    "parenth": [("5e", r"sommes comportant des parenthèses"), ("3e", r"opposé d’une expression"), ("3e-2019", r"opposé d’une expression"), ("2nde", r"expressions additives")],
    "distrib": [("5e", r"k\(a \+ b\)|distributivité simple"), ("4e", r"distributivité simple"), ("3e", r"double distributivité|Développer et factoriser une expression simple"), ("4e-2019", r"distributivité simple"), ("3e-2019", r"développe \(par simple"),
                ("2nde|1re|1re-ES", r"Développer, factoriser")],
    "idrem": [("3e", r"identités remarquables"), ("3e-2019", r"a² − b²"), ("2nde", r"identités \(factorisation")],
    "factor": [("2nde", r"forme la plus adaptée"), ("5e", r"pour factoriser"), ("4e", r"développer et factoriser une expression algébrique"), ("3e", r"factoriser des expressions dont le facteur|identités remarquables"), ("3e-2019", r"factorise"), ("2nde", r"factorisation de a𝑥")],
    "eq1": [("4e", r"retrouver le nombre de départ"), ("5e|4e", r"multiplications à trou|addition à trou"), ("5e", r"équations du type a𝑥 = c"), ("4e", r"équation du premier degré du type a𝑥 \+ b = c$|Résoudre des équations du type a𝑥 = c"), ("3e", r"Résoudre des équations du type"), ("4e-2019", r"résout algébriquement une équation du premier degré"),
            ("3e-2019", r"différents types d’équations"), ("2nde", r"Résoudre une équation du type|solutions d’une équation du premier degré")],
    "probeq": [("5e", r"opérations à trous par des équations|statut d’inconnue"), ("4e", r"Mettre en équation"), ("4e-2019", r"met un problème en équation"), ("3e-2019", r"problèmes s’y ramenant")],
    "eqfrac": [("4e", r"a𝑥 \+ b = c𝑥 \+ d")],
    "eq2": [("3e", r"produit nul"), ("3e-2019", r"équations produits"), ("2nde", r"équation produit nul"), ("1re|1re-ES", r"produit nul")],
    "eq2fact": [("3e", r"équations de la forme 𝑥² = a"), ("3e", r"𝑥² = a"), ("3e-2019", r"x² = a"), ("2nde", r"équation du type 𝑥² = a")],
    "formule": [("2nde", r"exprimer une variable en fonction des autres|Isoler une variable")],
    "ineq": [("3e", r"inéquation du premier degré"), ("2nde", r"inéquation|tableau de signes|signe des expressions"), ("1re|1re-ES", r"signe d’une expression du premier degré")],
    "trinfact": [("1re", r"Factoriser une fonction polynôme du second degré|s’annulant en deux"), ("1re-ES", r"forme factorisée")],
    "eq2disc": [("1re", r"forme adaptée \(développée réduite, canonique"), ("Tle-exp", r"équation polynomiale de degré 2")],
    "eq3": [("Tle-exp", r"degré 3 à coefficients réels")],
    "polyfact": [("Tle-exp", r"Factoriser un polynôme dont une racine")],
    # --- grandeurs et mesures ---
    "utemps": [(C3, r"horaires et des durées|Convertir des durées")],
    "ulong": [("5e", r"unités de longueur")],
    "uaire": [(C3, r"conversions d’aire"), ("5e", r"unités d’aires")],
    "uvol": [("5e", r"unités usuelles \(volume et capacité\)|unités d’aires et de volume"), ("2nde", r"conversions d’unités")],
    "perim": [(C3, r"périmètres de figures composées|problèmes impliquant des longueurs"), ("5e", r"périmètre")],
    "disque": [(C3, r"définitions d’un cercle, d’un disque"), (C3, r"périmètre d’un disque|périmètre du disque"), ("5e", r"aire du disque"), ("2nde", r"périmètres \(polygone et cercle\)")],
    "aire1": [(C3, r"aire d’un carré ou d’un rectangle"), ("5e", r"aire d’un triangle"), ("4e", r"aire des figures planes usuelles"), ("2nde", r"aires \(rectangle, triangle")],
    "aire2": [("5e", r"aire d’un parallélogramme")],
    "aire3": [("5e", r"figures complexes")],
    "volpave": [(C3, r"volume|centimètre cube"), ("5e", r"volume du cube, du pavé droit")],
    "vol": [("5e", r"prisme droit\.?$|volume du cylindre|volume du cube, du pavé droit, du prisme"), ("4e", r"volume d’un cube, d’un pavé, d’un prisme"), ("2nde", r"volumes \(pavé droit")],
    "volcone": [("4e", r"volume de la pyramide et du cône"), ("3e", r"volume d’une boule|volume d’une pyramide ou d’un cône"), ("4e-2019", r"volume d’une pyramide"), ("3e-2019", r"volume d’une boule")],
    "volcomp": [("3e-2019", r"assemblages de solides")],
    # --- géométrie ---
    "angtype": [("5e", r"angles de l’équerre"), (C3, r"Mesurer un angle|les angles ainsi que le lexique"), ("5e", r"angle plein, plat|angle droit mesure 90")],
    "angtri": [("5e", r"triangle isocèle, équilatéral ou rectangle|Utiliser ces propriétés dans le cas"), (C3, r"somme des mesures des angles|propriétés angulaires|L’utiliser pour calculer des angles"), ("5e", r"somme des angles d’un triangle")],
    "angles": [("5e", r"alternes internes")],
    "quadri": [("4e", r"Reconnaitre un parallélogramme à l’aide"), ("5e", r"Définir le parallélogramme"), ("5e", r"^Connaitre les propriétés caractéristiques$"), ("4e", r"parallélogramme particulier"), ("5e", r"parallélogrammes? particuliers|propriétés caractéristiques des côtés|nature du quadrilatère|Reconnaitre en justifiant un quadrilatère")],
    "symetries": [("4e-2019", r"translation"), (C3, r"symétri"), ("5e", r"demi-tour|symétrique"), ("4e", r"translation|demi-tour|symétrie axiale")],
    "rotation": [("3e-2019", r"rotation")],
    "droitesrem": [("5e", r"notion de médiatrice"), (C3, r"médiatrices? d’un|cercle circonscrit"), ("5e", r"hauteurs|médianes|médiatrices et du cercle circonscrit"), ("4e", r"droites remarquables")],
    "pyth": [("4e", r"Pythagore"), ("3e", r"égalité de Pythagore"), ("4e-2019", r"Pythagore"), ("2nde", r"Pythagore")],
    "pythrec": [("4e", r"Pythagore, sa réciproque")],
    "pythfig": [("4e-2019", r"racine carrée d’un nombre positif en lien avec des situations géométriques")],
    "cercthales": [("4e", r"demi-cercle|cercle circonscrit d’un triangle rectangle"), ("3e", r"triangle rectangle et de son cercle circonscrit")],
    "thales": [("3e", r"Thalès"), ("3e-2019", r"Thalès"), ("2nde", r"Thalès")],
    "thalesrec": [("3e", r"Thalès, sa réciproque"), ("3e-2019", r"Thalès et sa réciproque")],
    "trigo": [("3e", r"lignes trigonométriques"), ("3e-2019", r"lignes trigonométriques"), ("4e-2019", r"cosinus d’un angle"), ("2nde", r"lignes trigonométriques")],
    "simil": [("3e-2019", r"triangles semblables|homothétie")],
    "vecteurs": [("3e", r"translation : définition ponctuelle"), ("3e", r"vecteur|Chasles"), ("2nde", r"vecteurs?"), ("1re", r"produit scalaire")],
    "repere": [("4e-2019", r"vocabulaire du repérage"), ("5e", r"coordonnées|droite graduée|Placer dans un repère"), ("4e|3e", r"coordonnées d’un point")],
    "cart": [("2nde", r"distance entre deux points")],
    "droites": [("2nde", r"équation de droite|pente ou un vecteur directeur|Tracer une droite|trois points sont alignés|parallèles ou sécantes"), ("1re|1re-ES", r"équation réduite|coefficient directeur|équation cartésienne d’une droite")],
    "droitesinter": [("2nde", r"point d’intersection de deux droites")],
    "cercle": [("1re", r"équation d’un cercle|équation de cercle")],
    "sinlaw": [("1re", r"produit scalaire pour démontrer une orthogonalité, pour calculer un angle")],
    # --- fonctions ---
    "tabval": [("5e", r"tableau de valeurs")],
    "lectgraph": [("4e-2019", r"dépendance de deux grandeurs par un graphique|graphique représentant la dépendance"), ("3e", r"Résoudre graphiquement des équations"), ("1re|1re-ES", r"Passer du graphique aux données"), ("5e", r"graphique cartésien"), ("4e", r"par un graphique"), ("2nde", r"tableau de variations|extrémums"), ("1re|1re-ES", r"graphiquement (une équation|le signe)")],
    "fimg": [("3e-2019", r"notations et le vocabulaire fonctionnels|mode de représentation d’une fonction|problèmes modélisés par des fonctions"), ("3e", r"image, antécédents|différentes représentations d’une fonction"), ("3e-2019", r"image d’un nombre|antécédent"), ("2nde", r"images et des antécédents|équation de courbe|𝑦 = ƒ \(𝑥\)")],
    "affine": [("3e", r"fonctions? (linéaires?|affines?)|coefficients d’une fonction affine"), ("3e-2019", r"fonction (linéaire|affine)|paramètres d’une fonction affine"), ("2nde", r"fonction linéaire, d’une fonction affine")],
    "modaff": [("3e-2019", r"modélise un phénomène continu"), ("2nde", r"Modéliser par des fonctions"), ("1re-ES", r"croissance linéaire")],
    "affzero": [("2nde", r"fonction affine, relier sens de variation, signe"), ("1re|1re-ES", r"signe d’une expression du premier degré")],
    "f2": [("3e", r"fonction carré"), ("1re", r"fonction polynôme du second degré : variations"), ("1re-ES", r"parabole|éléments caractéristiques")],
    "f2formes": [("1re", r"forme adaptée \(développée réduite, canonique")],
    "ineq2": [("1re", r"signe d’une fonction polynôme du second degré"), ("1re|1re-ES", r"expression factorisée du second degré|étudier son signe")],
    "optim": [("2nde|1re", r"optimisation")],
    "inter": [("2nde", r"ƒ \(𝑥\) = g \(𝑥\)")],
    "racinv": [("2nde", r"fonction de référence"), ("2nde", r"inverse|racine carrée et cube")],
    "absval": [("2nde", r"valeur absolue")],
    "vabs": [("5e", r"opposé et la valeur absolue")],
    "ensembles": [("2nde", r"abscisse d’un nombre réel"), ("2nde", r"intervalle")],
    "expo": [("1re", r"exponentielle"), ("1re-ES", r"exponentielle")],
    "modexp": [("1re", r"croissance, une décroissance exponentielle"), ("1re-ES", r"croissance ou décroissance exponentielle")],
    "log": [("Tle|Tle-comp", r"logarithme|ln q")],
    "trigcercle": [("1re", r"cercle trigonométrique")],
    "trigassoc": [("1re", r"angles associés")],
    "trigfn": [("Tle", r"fonctions sinus et cosinus")],
    "trigeq": [("Tle", r"cos\(𝑥\) = a")],
    "compo": [("Tle", r"composition")],
    # --- données, probabilités ---
    "diagr": [("5e", r"moyenne simple|diagramme|tableaux, de diagrammes"), ("4e", r"moyenne pondérée|Calculer une moyenne"), ("3e", r"Calculer une moyenne"), ("4e-2019", r"diagrammes circulaires"), ("3e-2019", r"histogrammes"),
              ("2nde", r"moyenne pondérée|graphiques usuels")],
    "statfreq": [("5e", r"effectifs et des fréquences"), ("4e", r"fréquence simple|effectif manquant"), ("3e", r"effectifs cumulés"), ("3e-2019", r"effectifs et des fréquences"), ("4e-2019", r"diagrammes circulaires"), ("2nde", r"effectifs, proportions")],
    "quartiles": [("4e", r"différents indicateurs|comparaison de séries"), ("4e", r"médiane|étendue"), ("3e", r"quartiles|médiane|étendue|boites à moustache"), ("4e-2019", r"médiane"), ("3e-2019", r"étendue"), ("2nde", r"médiane, quartiles|boites à moustaches")],
    "stats": [("2nde", r"écart type"), ("1re|1re-ES", r"indicateurs statistiques")],
    "proba": [("4e", r"complémentaire, réunion, intersection"), (C3, r"probabilit"), ("5e", r"probabilit|équiprobabilité|chance sur"), ("4e", r"évènement contraire|deux épreuves"), ("3e", r"P\(𝐴 ∪"), ("4e-2019|3e-2019", r"probabilit"), ("2nde", r"probabilit")],
    "fracrat": [("3e", r"rapports comportant des facteurs communs")],
    "solides": [(C4, r"Reconnaitre (les|des) solides")],
    "sys2": [("Tle", r"système d’équations linéaires")],
    "denombr": [("Tle", r"dénombrement")],
}

def notions_for(x):
    out = []
    for n, pats in MAP_FR.items():
        for cls, pat in pats:
            if re.fullmatch(cls, x["classe"]) and re.search(pat, x["texte"], re.I):
                out.append(n); break
    return out

# Attendus qui ne se prêtent pas à une réponse saisie (constructions, tracés, démonstrations, programmation, tableur…)
HORS = re.compile(r"construi|tracer|démontr|justifi|programmer|programmation|un programme (?!de calcul)|des programmes|Structurer|tableur|logiciel|Python|algorithm|instruction|boucle|"
                  r"Manipuler une variable|notion de variables|type d’une variable|script|patron|perspective|^Représenter|boites à moustache|représentations? des solides|"
                  r"vocabulaire géométrique|vocabulaire lié|notations? ensemblistes|Définir la boule|grands cercles|Recueillir|Planifier|enquête|Inventer|Graduer|Répéter|simul|"
                  r"Observer|raisonnement|Mener un travail de logique|Conjecturer|Formuler des conjectures|Visualiser|Esquisser|sans équerre|Choisir une représentation|interpréter des données|outils géométriques|codes usuels|"
                  r"Connaître les liens|Connaitre le sens|Comprendre le sens|Mobiliser les connaissances|Lire et commenter|Voir dans l’espace|Interpréter en situation|Modéliser une situation à l’aide d’une variable|"
                  r"Aborder les questions|Introduire l’expression|Comprendre la dépendance|Approfondir|frises|pavages|activités d’algorithmique|blocs fournis|Réaliser des mesures", re.I)

def build():
    items = collect()
    for x in items:
        for a, b in FIXES: x["texte"] = x["texte"].replace(a, b)
        x["notions"] = notions_for(x)
        x["type"] = "automatisme" if x["groupe"] == "Automatismes" or x["domaine"] == "AU" else "attendu"
        x["saisie"] = not HORS.search(x["texte"])
    src = {f: ref for f, k, c, ref in DOCS}
    classes = {}
    for x in items:
        c = classes.setdefault(x["classe"], dict(CLASSES[x["classe"]], source=x["source"], reference=src.get(x["source"], ""), themes=[]))
        th = next((t for t in c["themes"] if t["domaine"] == x["domaine"] and t["theme"] == x["theme"]), None)
        if th is None:
            th = {"domaine": x["domaine"], "domaine_label": DOM_LABEL.get(x["domaine"], x["domaine"]), "theme": x["theme"], "attendus": []}
            c["themes"].append(th)
        a = {"code": x["code"], "texte": x["texte"], "type": x["type"], "notions": x["notions"]}
        if x["groupe"] and x["groupe"] != "Automatismes": a["groupe"] = x["groupe"]
        if not x["saisie"]: a["saisie"] = False
        th["attendus"].append(a)
    data = {
        "_meta": {
            "titre": "Référentiel France : programmes officiels de mathématiques (cycle 3, cycle 4, lycée général)",
            "genere_par": "tools/referentiels_fr.py",
            "sources": "PDF officiels (education.gouv.fr, eduscol.education.fr) rangés dans ~/DATA/Enseignement/Sources/Officiel/France (README.md : URL, date, droits). Usage interne.",
            "codes": "classe.domaine.rang (rang dans l'ordre du texte officiel) ; les codes officiels n'existent pas pour ces programmes.",
            "type": "attendu = objectif d'apprentissage (cycles 3-4), capacité attendue (lycée) ou attendu de fin d'année (2019) ; automatisme = rubrique « Automatismes »",
            "notions": "ids des notions de l'app (src/curriculum.js, src/gen3.js) qui permettent de s'entraîner à l'attendu (correspondance MAP_FR)",
            "saisie": "false = attendu qui ne se prête pas à une réponse saisie (construction, démonstration, programmation…)",
            "transition_2026_2027": "5e : programme 2026 ; 4e et 3e : programme 2020 et attendus 2019 (clés 4e-2019, 3e-2019) — nouveau programme en 4e en 2027-2028, en 3e en 2028-2029 ; 6e et CM1 : programme 2025 ; CM2 : programme 2025 dès 2026-2027 ; 2nde et 1re : programmes 2026 ; Tle : programme 2019 en 2026-2027, programme 2026 dès 2027-2028",
            "domaines": DOM_LABEL,
        },
        "classes": classes,
    }
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    return items

APP_GRADE = {"6e": 6, "5e": 7, "4e": 8, "3e": 9, "4e-2019": 8, "3e-2019": 9, "2nde": 10, "1re": 11, "1re-ES": 11, "Tle": 12, "Tle-comp": 12, "Tle-exp": 12}
GRADE_LABEL = {6: "6e", 7: "5e", 8: "4e", 9: "3e", 10: "2nde", 11: "1re", 12: "Tle"}

def rapport_md(items):
    """Tableaux de couverture (collés dans tools/couverture_fr.md)."""
    cur = (ROOT / "src/curriculum.js").read_text() + (ROOT / "src/gen3.js").read_text()
    labels = dict(re.findall(r'\{ id: "(\w+)", theme: "\w+", label: "((?:[^"\\]|\\.)*)"', cur))
    fr = {m.group(1): m.group(2) for m in re.finditer(r'\{ id: "(\w+)",[^\n]*?FR: (\[[^\]]*\]|null)', cur)}
    out = []
    order = ["6e", "5e", "4e", "3e", "4e-2019", "3e-2019", "2nde", "1re", "1re-ES", "Tle", "Tle-comp", "Tle-exp"]
    for c in order:
        xs = [x for x in items if x["classe"] == c]
        s_ = [x for x in xs if x["saisie"]]; ok = [x for x in s_ if x["notions"]]
        out += ["", "### %s — %s" % (c, CLASSES[c]["label"]), "",
                "%d attendus (dont %d automatismes) ; %d se prêtent à une réponse saisie ; **%d rattachés à une notion (%d %%)**." % (len(xs), sum(x["type"] == "automatisme" for x in xs), len(s_), len(ok), round(100 * len(ok) / max(1, len(s_)))), ""]
        by = {}
        for x in ok:
            for n in x["notions"]: by.setdefault(n, []).append(x["code"].split(".", 1)[1])
        out += ["Couverts : " + " ; ".join("`%s` (%s)" % (n, ", ".join(v)) for n, v in by.items()), ""]
        ko = [x for x in s_ if not x["notions"]]
        if ko:
            out += ["Non couverts (saisissables) :", ""] + ["- `%s` %s" % (x["code"], x["texte"][:160]) for x in ko] + [""]
    # niveau français proposé par notion
    first = {}
    for x in items:
        if x["classe"] in APP_GRADE:
            for n in x["notions"]:
                g = APP_GRADE[x["classe"]]
                first[n] = min(first.get(n, 99), g)
    out += ["", "### Niveau français de chaque notion (première classe où un attendu la mobilise) et champ FR actuel", "",
            "| Notion | Libellé | Classe FR d'après les programmes | FR actuel (src) | Écart |", "|---|---|---|---|---|"]
    for n in sorted(first, key=lambda k: (first[k], k)):
        cur_fr = fr.get(n, "—")
        m = re.match(r"\[(\d+)", cur_fr or "")
        ecart = "" if (m and int(m.group(1)) == first[n]) else ("à renseigner" if not m else "à corriger (%s → %s)" % (GRADE_LABEL.get(int(m.group(1)), m.group(1)), GRADE_LABEL[first[n]]))
        out.append("| `%s` | %s | %s | %s | %s |" % (n, labels.get(n, n).replace("|", "/"), GRADE_LABEL[first[n]], cur_fr, ecart))
    none = [n for n in re.findall(r'\{ id: "(\w+)"', cur) if n not in first]
    out += ["", "Notions sans attendu français (hors programme en France, ou seulement en maths expertes / CM) : " + ", ".join("`%s`" % n for n in dict.fromkeys(none)), ""]
    return "\n".join(out)

def main():
    items = build()
    used = {n for x in items for n in x["notions"]}
    unknown = used - set(re.findall(r'\{ id: "(\w+)"', (ROOT / "src/curriculum.js").read_text() + (ROOT / "src/gen3.js").read_text()))
    if unknown: print("notions inconnues dans MAP_FR :", sorted(unknown))
    if "--md" in sys.argv:
        print(rapport_md(items)); return
    if "--liste" in sys.argv:
        for x in items: print(x["code"], "|", ",".join(x["notions"]) or ("—" if x["saisie"] else "(hors saisie)"), "|", x["texte"][:110])
        return
    order = ["CM1", "CM2", "6e", "5e", "4e", "3e", "4e-2019", "3e-2019", "2nde", "1re", "1re-ES", "Tle", "Tle-comp", "Tle-exp"]
    print("classe      attendus  saisissables  couverts  %")
    for c in order:
        xs = [x for x in items if x["classe"] == c]
        s = [x for x in xs if x["saisie"]]; ok = [x for x in s if x["notions"]]
        print("%-10s %6d %10d %10d %5d" % (c, len(xs), len(s), len(ok), round(100 * len(ok) / max(1, len(s)))))
    print("écrit :", OUT.relative_to(ROOT))

if __name__ == "__main__":
    main()
