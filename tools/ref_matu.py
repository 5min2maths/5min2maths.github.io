#!/usr/bin/env python3
"""Référentiel du Collège de Genève (maturité gymnasiale) embarqué dans l'app : src/ref_matu.js (25.11).

« Mes compétences » d'un élève du Collège affiche les compétences officielles de son année (référentiel de
l'enseignant, tiré du programme officiel public : ~/Dropbox/2026-2027/Matu/Referentiel/referentiel_matu.csv, hors
dépôt). On n'embarque que code, année (premier chiffre du code), niveau (MA1+MA2, MA2, MA1), thème, notion et
intitulé ; rien d'autre du CSV (Sésamath, documents, remarques restent hors de l'app).

Rattachement compétence ↔ questions : motifs de codes des notions (tools/referentiels.py : MAP[…]["MATU"] et champ
codesMATU des notions de src/*.js). Affiné au niveau de question quand c'est net (NIVEAUX ci-dessous, d'après les
savoir-faire par niveau de src/competences.js) ; sinon tous les niveaux de la notion alimentent la compétence.

Usage : python3 tools/ref_matu.py   (relancer après un changement du CSV, de MAP, des codesMATU ou de NIVEAUX)
"""
import csv, json, re, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import referentiels as R  # noqa: E402

ROOT = R.ROOT
CSV = R.REFS["MATU"][0]
OUT = ROOT / "src" / "ref_matu.js"
NIVEAU = ["MA1+MA2", "MA2", "MA1"]

# Notion → { code : niveaux de question (1, 2, 3) qui travaillent cette compétence }. [] : la notion ne l'alimente pas
# (la compétence reste rattachée aux autres notions, ou « travaillée en classe »). Codes absents : tous les niveaux.
# Seulement pour les notions dont les niveaux ont des savoir-faire distincts (src/competences.js) ; à valider.
# 26.11 (lot) : 1.AL.03c, 1.FO.03c, 1.FO.04a, 1.FO.09a, 1.GE.01a, 2.AL.02c, 2.GE.02c rattachées aux niveaux qui ont
# maintenant (ou avaient déjà) une forme de ce savoir-faire (formes « lot 26.11 » dans src/ch*.js).
NIVEAUX = {
    "simil": {"1.GE.03a": [1], "1.GE.03c": [2, 3]},
    "factor": {"1.AL.03a": [1], "1.AL.03b": [2, 3], "1.AL.03c": [3]},
    "affine": {"1.FO.05b": [2]},
    "angles": {"1.GE.01a": [1, 2, 3], "1.GE.01c": [2, 3]},
    "polyop": {"1.AL.01c": [1], "1.AL.02a": [2]},
    "factor2": {"1.AL.03d": [3]},
    "fimg": {"1.FO.03a": [1, 2], "1.FO.03b": [3], "1.FO.03c": [1, 2, 3], "1.FO.04a": [1, 2]},
    "f2": {"1.FO.07a": [1], "1.FO.07b": [2, 3]},
    "f2expr": {"1.FO.08a": [1], "1.FO.08b": [2]},
    "inter": {"1.FO.09a": [1], "1.FO.09b": [1, 2, 3]},
    "ineq2": {"1.FO.09d": [3], "2.AL.04b": [1, 2]},
    "racinv": {"1.FO.10c": [1], "1.FO.11a": [2], "1.FO.11b": [3]},
    "trigo": {"1.GE.05b": [1], "1.GE.05c": [2], "1.GE.06a": [3]},
    "polydiv": {"2.AL.01b": [2], "2.AL.01c": [1, 3]},
    "polyfact": {"2.AL.01d": [1, 2], "2.AL.01e": [3]},
    "fracrat": {"2.AL.02b": [1, 3], "2.AL.02d": [2], "2.AL.02c": [3]},
    "eqrat": {"2.AL.03a": [1, 2], "2.AL.03b": [3]},
    "recip": {"2.FO.03a": [1, 3], "2.FO.03c": [2]},
    "homog": {"2.FO.06b": [1, 2]},
    "trigcercle": {"2.FO.07a": [1], "2.FO.07c": [2], "2.FO.07b": [3]},
    "expo": {"2.FO.11a": [1, 2]},
    "log": {"2.FO.10c": [1], "2.FO.11b": [2], "2.FO.10d": [3]},
    "sinlaw": {"2.GE.02a": [1], "2.GE.02b": [2, 3], "2.GE.02c": [3]},
    "droites": {"2.GE.03b": [1], "2.GE.03c": [2]},
    "cercle": {"2.GE.04b": [1, 2], "2.GE.05a": [3]},
}


def rows():
    return list(csv.DictReader(open(CSV, encoding="utf-8"), delimiter=";"))


def links(rs=None):
    """{ code : ["notion" (tous niveaux) | "notion@13" (niveaux 1 et 3)] } ; seulement les notions qui existent dans l'app."""
    ids, _ = R.load_map()
    known = set(ids)
    out = {}
    for r in rs or rows():
        L = []
        for n, m in R.MAP.items():
            if n not in known or "MATU" not in m or not re.match(m["MATU"], r["code"]):
                continue
            lv = NIVEAUX.get(n, {}).get(r["code"])
            if lv is None:
                L.append(n)
            elif lv:
                L.append(n + "@" + "".join(map(str, lv)))
        out[r["code"]] = L
    return out


def etat(r, L):
    return "couvert" if L else ("hors saisie" if R.HORS.search(r["competence"]) else "à faire")


# Décisions de l'enseignant qui priment sur le niveau du CSV (25.11 soir : « sujets à choix » de MA1 → les deux niveaux).
NIVEAU_FORCE = {"4.GV.04a": "MA1+MA2", "4.GV.04b": "MA1+MA2", "4.GV.04c": "MA1+MA2", "4.GV.04d": "MA1+MA2"}


def main():
    rs = rows()
    for r in rs:
        r["niveau"] = NIVEAU_FORCE.get(r["code"], r["niveau"])
        assert r["annee"][0] == r["code"][0], r["code"]  # l'année se lit sur le code
        assert r["niveau"] in NIVEAU, r["niveau"]
    for n, d in NIVEAUX.items():  # pas de faute de frappe dans les codes affinés
        for c in d:
            assert re.match(R.MAP[n]["MATU"], c), (n, c)
    lk = links(rs)
    th, no = [], []
    idx = lambda L, x: L.index(x) if x in L else (L.append(x) or len(L) - 1)
    data = [[r["code"], NIVEAU.index(r["niveau"]), idx(th, r["theme"]), idx(no, r["notion"]), r["competence"]] for r in rs]
    js = ("// Généré par tools/ref_matu.py (25.11) : référentiel de compétences du Collège de Genève (code, niveau, thème,\n"
          "// notion, intitulé ; l'année est le premier chiffre du code) et rattachement aux notions de l'app.\n"
          "// Niveaux : 0 = MA1 et MA2, 1 = MA2 seulement, 2 = MA1 seulement.\n"
          "const REF_MATU = {\n  niv: " + json.dumps(NIVEAU, ensure_ascii=False) + ",\n"
          "  th: " + json.dumps(th, ensure_ascii=False) + ",\n"
          "  no: " + json.dumps(no, ensure_ascii=False) + ",\n"
          "  c: [\n" + ",\n".join("    " + json.dumps(d, ensure_ascii=False) for d in data) + "\n  ],\n"
          "  // compétence → notions de l'app (« id » : tous les niveaux de question ; « id@13 » : niveaux 1 et 3)\n"
          "  q: " + json.dumps({c: L for c, L in lk.items() if L}, ensure_ascii=False, separators=(",", ":")) + ",\n};\n")
    assert not any("//" in l for l in js.splitlines() if not l.lstrip().startswith("//")), "« // » au milieu d'une ligne"
    OUT.write_text(js, encoding="utf-8")
    by = {}
    for r in rs:
        k = (r["annee"], r["niveau"])
        t = by.setdefault(k, [0, 0, 0])
        t[0] += 1
        t[1] += bool(lk[r["code"]])
        t[2] += etat(r, lk[r["code"]]) == "hors saisie"
    print(f"{OUT.relative_to(ROOT)} : {len(rs)} compétences, {sum(bool(v) for v in lk.values())} rattachées à des questions")
    for (a, n), (t, q, h) in sorted(by.items()):
        print(f"  {a:4} {n:8} {t:3} compétences, {q:3} avec questions, {h:2} hors saisie, {t - q - h:2} à faire")


if __name__ == "__main__":
    main()
