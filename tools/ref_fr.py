#!/usr/bin/env python3
"""Référentiel France embarqué dans l'app : src/ref_fr.js (25.11, phase France des référentiels de compétences).

« Mes compétences » d'un profil France (6e → Tle) affiche les items officiels de sa classe (règle de l'enseignant :
chaque système a SON référentiel et SES dénominations ; séparation complète France / romand) :
- 6e : attendus de fin d'année du cycle 3 (programme 2025, BO n° 16 du 17.04.2025) ;
- 5e : attendus du cycle 4 (programme 2026, BO n° 10 du 05.03.2026) ;
- 4e et 3e : attendus de fin d'année 2019 (programme 2020), en vigueur en 2026-2027 ;
- 2nde, 1re (spécialité), Tle (spécialité) : capacités attendues des programmes 2026 et liste des automatismes.
Source : tools/referentiels_fr.json (tools/referentiels_fr.py, textes officiels publics de l'Éducation nationale).

Rattachement item ↔ notions de l'app : table MAP de tools/france_couverture.py quand elle existe (plus récente), sinon
champ « notions » du JSON ; seulement des notions qui existent dans l'app. Items non saisissables (saisie: false du JSON,
ou NS de france_couverture.py : constructions, démonstrations, programmation…) : aucun rattachement, « travaillé en
classe » dans l'app.

Groupement : collège = les 5 domaines (Nombres et calculs ; Organisation et gestion de données, fonctions ; Grandeurs
et mesures ; Espace et géométrie ; Algorithmique et programmation), sous-titre = thème du programme ; lycée = parties
du programme (Automatismes en tête), sous-titre = chapitre.

Usage : python3 tools/ref_fr.py   (relancer après un changement du JSON ou de la table MAP de france_couverture.py)
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
OUT = ROOT / "src" / "ref_fr.js"
JSON = ROOT / "tools" / "referentiels_fr.json"

# (clé du JSON, classe de l'app = grade du profil France, libellé)
CLASSES = [("6e", 6, "6e"), ("5e", 7, "5e"), ("4e-2019", 8, "4e"), ("3e-2019", 9, "3e"), ("2nde", 10, "2nde"), ("1re", 11, "1re"), ("Tle", 12, "Tle")]
COLLEGE = {"NC": "Nombres et calculs", "DP": "Organisation et gestion de données, fonctions", "PF": "Organisation et gestion de données, fonctions",
           "GM": "Grandeurs et mesures", "EG": "Espace et géométrie", "PI": "Algorithmique et programmation"}
ORDRE_COL = ["Nombres et calculs", "Organisation et gestion de données, fonctions", "Grandeurs et mesures", "Espace et géométrie", "Algorithmique et programmation"]
# Lycée : parties du programme. « Analyse / fonctions » du JSON : Fonctions en 2nde, Analyse en 1re et Tle.
LYCEE = {"AU": "Automatismes", "NC": "Nombres et calculs", "AL": "Algèbre", "GE": "Géométrie", "AG": "Algèbre et géométrie",
         "SP": "Probabilités et statistiques", "AP": "Algorithmique et programmation"}
ORDRE_LY = ["Automatismes", "Nombres et calculs", "Algèbre", "Algèbre et géométrie", "Géométrie", "Fonctions", "Analyse", "Probabilités et statistiques", "Algorithmique et programmation"]


def known_ids():
    """Identifiants des notions de l'app (toutes les sources, notions françaises comprises)."""
    s = "\n".join(f.read_text(encoding="utf-8") for f in sorted((ROOT / "src").glob("*.js")) if not f.name.startswith(("ordre", "ref_")))
    ids = set(re.findall(r'\{ id: "(\w+)", (?:niv: "\w+", )?theme', s))
    # 25.11 soir : notions de 2nde déclarées en tableau (src/fr_2nde.js : ["tabsignes", "fa", "libellé", …]).
    ids |= set(re.findall(r'\[\s*"(\w+)", "(?:no|fa|gm|es)", "', s))
    return ids


def couverture():
    """MAP, PARTIEL, SANS, NS de tools/france_couverture.py (vides si le fichier change de forme)."""
    try:
        import france_couverture as F
        return F.MAP, F.PARTIEL, getattr(F, "SANS", {}), F.NS
    except Exception as e:  # noqa: BLE001
        print("(france_couverture.py illisible :", e, ")")
        return {}, set(), {}, set()


def items():
    """Une entrée par item officiel : code (JSON), code affiché, grade, classe, domaine, sous-titre, intitulé, type,
    saisissable, notions rattachées (existantes), notions annoncées mais absentes de l'app, partiel."""
    ref = json.loads(JSON.read_text(encoding="utf-8"))["classes"]
    MAP, PARTIEL, SANS, NS = couverture()
    ids = known_ids()
    out = []
    for key, g, lab in CLASSES:
        for t in ref[key]["themes"]:
            for a in t["attendus"]:
                code = a["code"]
                if g <= 9:
                    dom = COLLEGE[t["domaine"]]
                    sub = t["theme"] or (t["domaine_label"] if t["domaine_label"] != dom else "")
                else:
                    dom = LYCEE.get(t["domaine"]) or ("Fonctions" if g == 10 else "Analyse")
                    sub = t["theme"] if t["theme"] != dom else ""
                ns = a.get("saisie") is False or code in NS
                want = [] if ns else list(dict.fromkeys(MAP.get(code, a.get("notions") or [])))
                out.append({"code": code, "show": code.replace("-2019", ""), "grade": g, "classe": lab, "domaine": dom, "theme": sub,
                            "texte": a["texte"], "type": a.get("type", "attendu"), "ns": ns,
                            "links": [n for n in want if n in ids], "absentes": [n for n in want if n not in ids],
                            "partiel": code in PARTIEL or (code in SANS and SANS[code] not in want)})
    order = lambda x: (x["grade"], (ORDRE_COL if x["grade"] <= 9 else ORDRE_LY).index(x["domaine"]))
    return sorted(out, key=order)  # tri stable : ordre du texte officiel dans chaque domaine


def etat(x):
    if x["ns"]:
        return "hors saisie"
    if not x["links"]:
        return "à faire"
    return "partiel" if x["partiel"] else "couvert"


def main():
    xs = items()
    th, no = [], []
    idx = lambda L, v: L.index(v) if v in L else (L.append(v) or len(L) - 1)
    data = [[x["show"], int(x["type"] == "automatisme"), idx(th, x["domaine"]), idx(no, x["theme"]), x["texte"], x["grade"]] for x in xs]
    assert len({d[0] for d in data}) == len(data), "codes affichés en double"
    js = ("// Généré par tools/ref_fr.py (25.11) : référentiel France de « Mes compétences » (profils France, 6e à Tle).\n"
          "// Source : programmes officiels de mathématiques de l'Éducation nationale (textes publics) : cycle 3 2025\n"
          "// (BO n° 16 du 17.04.2025) en 6e ; cycle 4 2026 (BO n° 10 du 05.03.2026) en 5e ; attendus de fin d'année 2019\n"
          "// en 4e et 3e ; programmes 2026 de 2nde, 1re et Tle spécialité (BO n° 14 du 02.04.2026), capacités attendues\n"
          "// et automatismes. Extraction : tools/referentiels_fr.json. Codes classe.domaine.rang (pas de codes officiels).\n"
          "// Ligne : code, type (0 attendu, 1 automatisme), domaine, thème ou chapitre, intitulé officiel, classe (6 = 6e … 12 = Tle).\n"
          "const REF_FR = {\n  niv: [\"attendu\", \"automatisme\"],\n"
          "  th: " + json.dumps(th, ensure_ascii=False) + ",\n"
          "  no: " + json.dumps(no, ensure_ascii=False) + ",\n"
          "  c: [\n" + ",\n".join("    " + json.dumps(d, ensure_ascii=False) for d in data) + "\n  ],\n"
          "  // item → notions de l'app qui l'entraînent (items non saisissables : aucune, « travaillé en classe »)\n"
          "  q: " + json.dumps({x["show"]: x["links"] for x in xs if x["links"]}, ensure_ascii=False, separators=(",", ":")) + ",\n};\n")
    assert not any("//" in l for l in js.splitlines() if not l.lstrip().startswith("//")), "« // » au milieu d'une ligne"
    OUT.write_text(js, encoding="utf-8")
    print(f"{OUT.relative_to(ROOT)} : {len(xs)} items, {sum(bool(x['links']) for x in xs)} rattachés à des questions")
    for _, g, lab in CLASSES:
        ys = [x for x in xs if x["grade"] == g]
        e = [etat(x) for x in ys]
        print(f"  {lab:4} {len(ys):3} items, {sum(bool(x['links']) for x in ys):3} avec questions ({e.count('partiel')} partiels), "
              f"{e.count('hors saisie'):2} hors saisie, {e.count('à faire'):2} à faire")
    miss = sorted({n for x in xs for n in x["absentes"]})
    if miss:
        print("  notions annoncées mais absentes de l'app :", ", ".join(miss))


if __name__ == "__main__":
    main()
