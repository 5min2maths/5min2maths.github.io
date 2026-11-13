#!/usr/bin/env python3
"""Couverture des référentiels de compétences par les notions de l'app.

Lit les trois référentiels (hors dépôt, dans Dropbox) et le catalogue src/curriculum.js, puis écrit
tools/couverture.md (non versionné) : compétences couvertes par notion, compétences non couvertes.
Les motifs sont des expressions régulières sur les codes des référentiels.
"""
import csv, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB = Path.home() / "Dropbox/2026-2027"
REFS = {
    "CO": (DB / "Bude/Groupe Maths/Banque commune/Referentiel/referentiel_cycle.csv", "code", "competence"),
    "MATU": (DB / "Matu/Referentiel/referentiel_matu.csv", "code", "competence"),
    "MP": (DB / "CFPT/Referentiel/referentiel_MP.csv", "code", "competence"),
}

# notion → motifs par référentiel
MAP = {
    "prio": {"CO": r"9NO3\.02|10NO1\.02|11NO1\.11", "MP": r"S1\.CN\.0[56]"},
    "rel": {"CO": r"10NO1\.0[567]|11NO1\.01", "MP": r"S1\.CN\.06"},
    "arith": {"CO": r"9NO4\.0[45]|10NO2\.02", "MP": r"S1\.CN\.0[7-9]"},
    "fracadd": {"CO": r"9NO6\.08|10NO2\.0[67]|11NO1\.02", "MP": r"S1\.CN\.(04|10|11)"},
    "fracmul": {"CO": r"10NO2\.08|11NO1\.03", "MP": r"S1\.CN\.11"},
    "pct": {"CO": r"10NO2\.1[12]"},
    "puiss": {"CO": r"10NO3\.07|11NO1\.08", "MP": r"S1\.CN\.1[23]"},
    "sci": {"CO": r"10NO3\.0[56]|11NO1\.07"},
    "rac": {"CO": r"10NO3\.02|11NO1\.10", "MP": r"S1\.CN\.1[45]"},
    "diagr": {"CO": r"9DO1\.|10DO1\."},
    "proba": {"CO": r"11DO1\.04"},
    "disque": {"CO": r"10GM1\.0[1-4]"},
    "vol": {"CO": r"10GM2\.0[14]|11GM2\.01"},
    "volcone": {"CO": r"11GM2\.0[245]|11ES1\.01"},
    "vitesse": {"CO": r"10GM3\.03|11FA1\.02"},
    "gquot": {"CO": r"11FA1\.0[345]"},
    "pyth": {"CO": r"10GM4\.0[123]|11GM1\.01", "MP": r"S2\.GE\.0[45]"},
    "thales": {"CO": r"11GM3\.0[36]", "MP": r"S2\.GE\.06"},
    "simil": {"CO": r"11ES3\.0[13]", "MATU": r"1\.GE\.03"},
    "prop": {"CO": r"9FA1\.02|10FA3\.05"},
    "echelle": {"CO": r"10FA3\.01"},
    "valnum": {"CO": r"9FA2\.02|10FA1\.02|11FA2\.02"},
    "reduire": {"CO": r"10FA1\.0[67]|11FA2\.0[67]", "MP": r"S1\.CA\.0[1-3]"},
    "distrib": {"CO": r"10FA1\.09|11FA2\.(09|10)", "MP": r"S1\.CA\.04"},
    "idrem": {"CO": r"11FA2\.11", "MP": r"S1\.CA\.05"},
    "factor": {"CO": r"11FA2\.1[23]", "MP": r"S1\.CA\.0[6-8]"},
    "eq1": {"CO": r"10FA2\.0[23]|11FA3\.01", "MATU": r"1\.AL\.04", "MP": r"S1\.EQ\.0[12]"},
    "probeq": {"CO": r"10FA2\.05|11FA3\.03", "MP": r"S1\.EQ\.0[38]"},
    "formule": {"CO": r"11FA3\.04", "MP": r"S1\.CA\.14"},
    "eq2": {"CO": r"11FA3\.05", "MP": r"S1\.EQ\.04"},
    "eq2disc": {"CO": r"11FA3\.07", "MATU": r"1\.AL\.05", "MP": r"S1\.EQ\.0[5-7]"},
    "sys2": {"CO": r"11FA4\.0[23]", "MATU": r"1\.AL\.07", "MP": r"S2\.SY\.0[1245]"},
    "affine": {"CO": r"10FA4\.0[35]|11FA5\.0[35678]", "MATU": r"1\.FO\.0[56]", "MP": r"S3\.FA\.0[1256]"},
    "angtri": {"CO": r"9ES3\.0[16]"},
    "polyreg": {"CO": r"10ES2\.01"},
    "angles": {"CO": r"11ES2\.0[1236]", "MATU": r"1\.GE\.01", "MP": r"S2\.GE\.08"},
    "polyop": {"MATU": r"1\.AL\.0[12]", "MP": r"S1\.CA\.0[45]"},
    "factor2": {"MATU": r"1\.AL\.03", "MP": r"S1\.CA\.0[6-9]"},
    "eq3": {"MATU": r"1\.AL\.06"},
    "sys3": {"MATU": r"1\.AL\.07", "MP": r"S2\.SY\.03"},
    "domaine": {"MATU": r"1\.FO\.01", "MP": r"S2\.FO\.02"},
    "fimg": {"MATU": r"1\.FO\.0[234]", "MP": r"S2\.FO\.0[1345]"},
    "f2": {"MATU": r"1\.FO\.07", "MP": r"S3\.FQ\.0[1-4]"},
    "f2expr": {"MATU": r"1\.FO\.08", "MP": r"S3\.FQ\.05"},
    "inter": {"MATU": r"1\.FO\.09", "MP": r"S2\.FO\.06|S3\.FQ\.06"},
    "ineq2": {"MATU": r"1\.FO\.09|2\.AL\.04"},
    "racinv": {"MATU": r"1\.FO\.1[01]"},
    "euclide": {"MATU": r"1\.GE\.0[23]", "MP": r"S2\.GE\.07"},
    "droitesrem": {"MATU": r"1\.GE\.04", "MP": r"S2\.GE\.02"},
    "trigo": {"MATU": r"1\.GE\.0[56]", "MP": r"S2\.TR\."},
    "polydiv": {"MATU": r"2\.AL\.01"},
    "polyfact": {"MATU": r"2\.AL\.01|2\.FO\.04"},
    "fracrat": {"MATU": r"2\.AL\.02", "MP": r"S1\.CA\.1[0-3]"},
    "eqrat": {"MATU": r"2\.AL\.03"},
    "ineq": {"MATU": r"2\.AL\.04|2\.FO\.04"},
    "recip": {"MATU": r"2\.FO\.0[123]"},
    "absval": {"MATU": r"2\.FO\.05"},
    "homog": {"MATU": r"2\.FO\.06"},
    "trigcercle": {"MATU": r"2\.FO\.07", "MP": r"S4\.TG\.0[1-3]"},
    "trigeq": {"MATU": r"2\.FO\.08", "MP": r"S4\.TG\.0[78]"},
    "trigfn": {"MATU": r"2\.FO\.09"},
    "expo": {"MATU": r"2\.FO\.1[01]"},
    "log": {"MATU": r"2\.FO\.1[01]"},
    "sinlaw": {"MATU": r"2\.GE\.0[12]", "MP": r"S4\.TG\.0[456]"},
    "cart": {"MATU": r"2\.GE\.03"},
    "droites": {"MATU": r"2\.GE\.03", "MP": r"S3\.FA\.0[34]"},
    "cercle": {"MATU": r"2\.GE\.0[45]"},
    "stats": {"MP": r"S4\.AD\.0[57]"},
}
# Compétences qui ne se prêtent pas à une réponse saisie (constructions, dessins, démonstrations…)
HORS = re.compile(r"construire|réaliser|représenter|tracer|croquis|dessin|développement d|reconnaître, nommer|démonstration|Démontrer|placer|calculatrice|livrets|vocabulaire|justifier|prouver|expérience|illustrer|Représenter|Maîtriser une démonstration|mesurer et construire", re.I)

def main():
    cur = (ROOT / "src/curriculum.js").read_text() + (ROOT / "src/gen3.js").read_text()
    ids = re.findall(r'\{ id: "(\w+)"', cur)
    labels = dict(re.findall(r'\{ id: "(\w+)", theme: "\w+", label: "((?:[^"\\]|\\.)*)"', cur))
    # notions fines (src/gen3.js) : motifs déclarés avec la notion (codes = CO, codesMATU, codesMP)
    for m in re.finditer(r'\{ id: "(\w+)", theme[^\n]*', cur):
        for key, ref in (("codes", "CO"), ("codesMATU", "MATU"), ("codesMP", "MP")):
            c = re.search(key + r': "((?:[^"\\]|\\.)*)"', m.group(0))
            if c: MAP.setdefault(m.group(1), {})[ref] = c.group(1).replace("\\\\", "\\")
    ids = [i for i in ids if i in MAP or i in labels]
    missing = [i for i in ids if i not in MAP]
    out = ["# Couverture des référentiels par l'app 5min2maths", "", "Généré par `tools/referentiels.py`. Usage interne (les référentiels ne sont pas dans le dépôt).", ""]
    if missing: out += ["**Notions sans correspondance :** " + ", ".join(missing), ""]
    for ref, (path, kc, kt) in REFS.items():
        if not path.exists():
            out += [f"## {ref} : fichier introuvable ({path})", ""]; continue
        rows = list(csv.DictReader(open(path, encoding="utf-8"), delimiter=";"))
        scope = [r for r in rows if not (ref == "MATU" and r[kc][0] in "34") and not (ref == "MP" and r.get("annee") in ("MP3", "MP4"))]
        cov = {}
        for r in scope:
            cov[r[kc]] = [n for n, m in MAP.items() if ref in m and re.match(m[ref], r[kc])]
        ok = [r for r in scope if cov[r[kc]]]
        ko = [r for r in scope if not cov[r[kc]]]
        ko_saisie = [r for r in ko if not HORS.search(r[kt])]
        out += [f"## {ref} — {len(ok)} compétences rattachées à une notion sur {len(scope)} ({round(100 * len(ok) / max(1, len(scope)))} %)", "",
                f"Non couvertes : {len(ko)}, dont {len(ko) - len(ko_saisie)} qui ne se prêtent pas à une réponse saisie (constructions, tracés, démonstrations) et **{len(ko_saisie)} à traiter**.", ""]
        if len(rows) != len(scope): out += [f"Hors périmètre actuel de l'app : {len(rows) - len(scope)} compétences (3e-4e du Collège, MP3-MP4).", ""]
        out += ["### À traiter", ""] + [f"- `{r[kc]}` {r[kt]}" for r in ko_saisie] + [""]
        out += ["### Non couvertes (constructions, tracés, démonstrations)", ""] + [f"- `{r[kc]}` {r[kt]}" for r in ko if r not in ko_saisie] + [""]
        out += ["### Rattachées (la notion existe ; chaque compétence n'a pas encore sa propre question)", "", "| Notion | Compétences |", "|---|---|"]
        for n in ids:
            cs = [c for c, ns in cov.items() if n in ns]
            if cs: out.append(f"| {labels.get(n, n)} (`{n}`) | {', '.join(cs)} |")
        out.append("")
        print(f"{ref}: {len(ok)}/{len(scope)} couvertes, {len(ko_saisie)} à traiter, {len(ko) - len(ko_saisie)} hors saisie")
        for r in ko_saisie: print("   à traiter :", r[kc], r[kt][:90])
        larges = [(n, len([c for c, ns in cov.items() if n in ns])) for n in MAP]
        larges = [f"{n} ({k})" for n, k in larges if k > 5]
        if larges: print("   notions encore larges (> 5 compétences) :", ", ".join(larges))
    (ROOT / "tools/couverture.md").write_text("\n".join(out), encoding="utf-8")
    if missing: print("sans correspondance :", missing)

if __name__ == "__main__":
    main()
