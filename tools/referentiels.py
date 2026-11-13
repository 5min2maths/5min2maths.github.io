#!/usr/bin/env python3
"""Couverture des référentiels de compétences par les notions de l'app.

Lit les trois référentiels (hors dépôt, dans Dropbox) et le catalogue src/curriculum.js, puis écrit
tools/couverture.md (non versionné) : compétences couvertes par notion, compétences non couvertes.
Les motifs sont des expressions régulières sur les codes des référentiels.
"""
import csv, re, sys, json
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
    "pyth": {"MATU": r"1\.GE\.03d", "CO": r"10GM4\.0[123]|11GM1\.01", "MP": r"S2\.GE\.0[45]"},
    "thales": {"MATU": r"1\.GE\.03b", "CO": r"11GM3\.0[36]", "MP": r"S2\.GE\.06"},
    "simil": {"CO": r"11ES3\.0[13]", "MATU": r"1\.GE\.03[ac]"},
    "prop": {"CO": r"9FA1\.02|10FA3\.05"},
    "echelle": {"CO": r"10FA3\.01"},
    "valnum": {"CO": r"9FA2\.02|10FA1\.02|11FA2\.02"},
    "reduire": {"MATU": r"1\.AL\.01a", "CO": r"10FA1\.0[67]|11FA2\.0[67]", "MP": r"S1\.CA\.0[1-3]"},
    "distrib": {"MATU": r"1\.AL\.01c", "CO": r"10FA1\.09|11FA2\.(09|10)", "MP": r"S1\.CA\.04"},
    "idrem": {"MATU": r"1\.AL\.02[ab]", "CO": r"11FA2\.11", "MP": r"S1\.CA\.05"},
    "factor": {"MATU": r"1\.AL\.03[abc]", "CO": r"11FA2\.1[23]", "MP": r"S1\.CA\.0[6-8]"},
    "eq1": {"CO": r"10FA2\.0[23]|11FA3\.01", "MATU": r"1\.AL\.04a", "MP": r"S1\.EQ\.0[12]"},
    "probeq": {"MATU": r"1\.AL\.04e", "CO": r"10FA2\.05|11FA3\.03", "MP": r"S1\.EQ\.0[38]"},
    "formule": {"MATU": r"1\.AL\.04d", "CO": r"11FA3\.04", "MP": r"S1\.CA\.14"},
    "eq2": {"MATU": r"1\.AL\.05b", "CO": r"11FA3\.05", "MP": r"S1\.EQ\.04"},
    "eq2disc": {"CO": r"11FA3\.07", "MATU": r"1\.AL\.05c", "MP": r"S1\.EQ\.0[5-7]"},
    "sys2": {"CO": r"11FA4\.0[23]", "MATU": r"1\.AL\.07[ab]", "MP": r"S2\.SY\.0[1245]"},
    "affine": {"CO": r"10FA4\.0[35]|11FA5\.0[35678]", "MATU": r"1\.FO\.05[abc]|1\.FO\.06[ab]", "MP": r"S3\.FA\.0[1256]"},
    "angtri": {"MATU": r"1\.GE\.01b", "CO": r"9ES3\.0[16]"},
    "polyreg": {"CO": r"10ES2\.01"},
    "angles": {"CO": r"11ES2\.0[1236]", "MATU": r"1\.GE\.01[ac]", "MP": r"S2\.GE\.08"},
    "polyop": {"MATU": r"1\.AL\.01[bcd]|1\.AL\.02[ac]", "MP": r"S1\.CA\.0[45]"},
    "factor2": {"MATU": r"1\.AL\.03[bde]", "MP": r"S1\.CA\.0[6-9]"},
    "eq3": {"MATU": r"1\.AL\.06[ab]"},
    "sys3": {"MATU": r"1\.AL\.07d", "MP": r"S2\.SY\.03"},
    "domaine": {"MATU": r"1\.FO\.01", "MP": r"S2\.FO\.02"},
    "fimg": {"MATU": r"1\.FO\.03|1\.FO\.04a", "MP": r"S2\.FO\.0[1345]"},
    "f2": {"MATU": r"1\.FO\.07[ab]", "MP": r"S3\.FQ\.0[1-4]"},
    "f2expr": {"MATU": r"1\.FO\.08[ab]", "MP": r"S3\.FQ\.05"},
    "inter": {"MATU": r"1\.FO\.09[ab]", "MP": r"S2\.FO\.06|S3\.FQ\.06"},
    "ineq2": {"MATU": r"1\.FO\.09d|2\.AL\.04b"},
    "racinv": {"MATU": r"1\.FO\.10c|1\.FO\.11[ab]"},
    "euclide": {"MATU": r"1\.GE\.03e", "MP": r"S2\.GE\.07"},
    "droitesrem": {"MATU": r"1\.GE\.04[bc]", "MP": r"S2\.GE\.02"},
    "trigo": {"MATU": r"1\.GE\.05[abcd]|1\.GE\.06a", "MP": r"S2\.TR\."},
    "polydiv": {"MATU": r"2\.AL\.01[abc]"},
    "polyfact": {"MATU": r"2\.AL\.01[de]|2\.FO\.04a"},
    "fracrat": {"MATU": r"2\.AL\.02[bcd]", "MP": r"S1\.CA\.1[0-3]"},
    "eqrat": {"MATU": r"2\.AL\.03[ab]"},
    "ineq": {"MATU": r"2\.AL\.04[acd]|2\.FO\.04b"},
    "recip": {"MATU": r"2\.FO\.03[ac]"},
    "absval": {"MATU": r"2\.FO\.05[ab]"},
    "homog": {"MATU": r"2\.FO\.06[ab]"},
    "trigcercle": {"MATU": r"2\.FO\.07[abc]", "MP": r"S4\.TG\.0[1-3]"},
    "trigeq": {"MATU": r"2\.FO\.08[ab]", "MP": r"S4\.TG\.0[78]"},
    "trigfn": {"MATU": r"2\.FO\.09b"},
    "expo": {"MATU": r"2\.FO\.10[ab]|2\.FO\.11a"},
    "log": {"MATU": r"2\.FO\.10[cd]|2\.FO\.11[bc]"},
    "sinlaw": {"MATU": r"2\.GE\.02[abc]", "MP": r"S4\.TG\.0[456]"},
    "cart": {"MATU": r"2\.GE\.03a"},
    "droites": {"MATU": r"2\.GE\.03[bc]|1\.FO\.06c", "MP": r"S3\.FA\.0[34]"},
    "cercle": {"MATU": r"2\.GE\.04[ab]|2\.GE\.05a"},
    "stats": {"MP": r"S4\.AD\.0[57]"},
}
# Compétences qui ne se prêtent pas à une réponse saisie (constructions, dessins, démonstrations…)
HORS = re.compile(r"Énoncer|Esquisser|Maîtriser une démonstration|Justifier|Représenter|Connaître le vocabulaire|construire|réaliser|représenter|tracer|croquis|dessin|développement d|reconnaître, nommer|démonstration|Démontrer|placer|calculatrice|livrets|vocabulaire|justifier|prouver|expérience|illustrer|Représenter|Maîtriser une démonstration|mesurer et construire", re.I)

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
    write_order()
    if missing: print("sans correspondance :", missing)

# Notions sans code dans le référentiel de l'élève (soutien, reprises du CO) : rangées dans le thème ou chapitre le plus proche.
THEME_FALLBACK = {
    "MATU": {},
    "MP": {"divcrit": "CN", "premiers": "CN", "fracsimp": "CN", "fracops": "CN", "pctvar": "CN", "pythfig": "GE", "pythrec": "GE",
           "eqfrac": "EQ", "parenth": "CA", "eq2fact": "EQ", "eqspec": "EQ", "sysprob": "SY", "lectgraph": "FO", "cercthales": "GE",
           "trigexact": "TR", "geocomb": "GE", "affzero": "FA", "modaff": "FA", "f2formes": "FQ", "f2trois": "FQ",
           "trigassoc": "TG", "trigeq2": "TG", "triaire": "TG", "droitesinter": "FA"},
}

# Matu : chapitres des manuels Sésamath matu gym (1re : Ma1, 2e : Ma2), ce que les élèves étudient vraiment (13.11).
SESA = {"M1C01": "1. Nombres", "M1C02": "2. Ensembles", "M1C03": "3. Argumenter", "M1C04": "4. Fonctions", "M1C05": "5. Degrés 0 et 1",
        "M1C06": "6. Calcul littéral", "M1C07": "7. Degré 2", "M1C08": "8. De Thalès à Pythagore", "M1C09": "9. Cercles",
        "M1C10": "10. Trigonométrie du triangle rectangle",
        "M2C01": "1. Équations cartésiennes", "M2C02": "2. Raisonner en géométrie", "M2C03": "3. Fonctions polynomiales",
        "M2C04": "4. Fonctions rationnelles", "M2C05": "5. Exponentielles", "M2C06": "6. Composition et réciproque", "M2C07": "7. Logarithmes",
        "M2C08": "8. Trigonométrie du triangle quelconque", "M2C09": "9. Fonctions trigonométriques",
        "M2C10": "Géométrie vectorielle"}  # pas de chapitre Sésamath en 2e (Ma3) ; enseignée en 2e chez pinkmaths
# Chapitre imposé : notions sans ligne Sésamath (reprises du CO en 1re) ou dont le premier chapitre trouvé n'est pas le bon.
SESA_FIX = {"rel": "M1C01", "fracops": "M1C01", "puiss": "M1C01", "rac": "M1C01", "racenc": "M1C01", "sci": "M1C01", "scicalc": "M1C01",
            "pct": "M1C01", "arith": "M1C01", "ensembles": "M1C02", "divcrit": "M1C03", "tradexpr": "M1C03", "exactes": "M1C08",
            "droitesrem": "M1C08", "inter": "M1C07", "ineq2": "M1C07", "interpar": "M1C07", "optim": "M1C07", "log": "M2C07", "logbase": "M2C07",
            "trigeq2": "M2C09", "absval": "M2C06", "droites": "M2C01", "modexp": "M2C05",
            # notions ajoutées le 13.11 d'après les cours pinkmaths 2026-27
            "sysineq": "M1C05", "ineqfrac": "M2C04", "eqirr": "M1C07", "morceaux": "M2C06", "transf": "M1C04", "trigrel": "M2C09",
            "expfrac": "M2C05", "vecteurs": "M2C10"}

# Notions enseignées sur deux années (cours réels du Collège, ex. pinkmaths 2026-27) : chapitre de 1re en plus du chapitre principal.
SESA_ALSO = {"ineq": "M1C05", "absval": "M1C04", "ineqfrac": "M1C07", "morceaux": "M1C04", "trigrel": "M1C10"}

def write_order():
    """src/ordre.js : rang de chaque notion dans l'ordre du référentiel (seulement des numéros, aucun libellé).
    CO et MP : ordre des lignes du référentiel ; matu : ordre des chapitres Sésamath (Ma1, Ma2), puis des lignes."""
    rank, theme, label = {}, {}, {}
    for ref, (path, kc, kt) in REFS.items():
        if not path.exists(): continue
        rows = list(csv.DictReader(open(path, encoding="utf-8"), delimiter=";"))
        rk, th, lab = {}, {}, {}
        if ref == "MATU":
            # Chapitre Sésamath de chaque notion (premier chapitre cité par ses compétences, ou imposé), rang = chapitre puis ligne.
            for i, r in enumerate(rows):
                m = re.search(r"Ma(\d) Ch(\d+)", r.get("sesamath", ""))
                for n, mm in MAP.items():
                    if "MATU" in mm and re.match(mm["MATU"], r[kc]) and m:
                        k = (int(m.group(1)) * 100 + int(m.group(2))) * 1000 + i
                        if k < rk.get(n, 10 ** 9): rk[n], th[n] = k, "M%sC%02d" % (m.group(1), int(m.group(2)))
            co = {n: i for i, n in enumerate(rank.get("CO", {}))}
            for n, c in SESA_FIX.items():
                th[n] = c
                rk[n] = (int(c[1]) * 100 + int(c[3:])) * 1000 + (rk.get(n, 0) % 1000 if n in rk and th.get(n) == c else 500 + co.get(n, 0))
            for n, c in SESA_ALSO.items():  # rang : la première des deux années
                rk[n] = min(rk.get(n, 10 ** 9), (int(c[1]) * 100 + int(c[3:])) * 1000 + 900)
            lab = dict(SESA)
        else:
            # MP : chapitre du référentiel, code « S1.CN.01 » → CN ; libellé court seulement.
            for r in rows:
                if ref == "CO": break
                k = r[kc].split(".")[1]
                lab.setdefault(k, re.sub(r"\s*\(S\d.*\)$", "", r.get("chapitre") or k).strip())
            for i, r in enumerate(rows):
                for n, m in MAP.items():
                    if ref in m and re.match(m[ref], r[kc]):
                        if i < rk.get(n, 10 ** 9) and ref != "CO": th[n] = r[kc].split(".")[1]
                        rk[n] = min(rk.get(n, 10 ** 9), i)
        order = sorted(rk, key=lambda n: rk[n])
        rank[ref] = {n: k for k, n in enumerate(order)}
        if ref != "CO":
            for n, k in THEME_FALLBACK.get(ref, {}).items(): th.setdefault(n, k)
            theme[ref], label[ref] = th, lab
            if ref == "MATU": theme["MATU_ALT"] = dict(SESA_ALSO)
    js = "// Généré par tools/referentiels.py : rang de chaque notion dans l'ordre du référentiel (CO, matu, MP).\n"
    js += "const ORDRE = " + json.dumps(rank, separators=(",", ":")) + ";\n"
    js += "// Matu : chapitre Sésamath de chaque notion ; MP : chapitre du référentiel MP. Libellés courts des chapitres.\n"
    js += "const ORDRE_THEME = " + json.dumps(theme, separators=(",", ":"), ensure_ascii=False) + ";\n"
    js += "const THEME_LABEL = " + json.dumps(label, separators=(",", ":"), ensure_ascii=False) + ";\n"
    (ROOT / "src/ordre.js").write_text(js, encoding="utf-8")

if __name__ == "__main__":
    main()
