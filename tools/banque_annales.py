"""Index des annales françaises découpées par Coopmaths (brevet, E3C, épreuve anticipée
de 1re, bac ; transcriptions APMEP) rangées par chapitre 11e CO, 1re et 2e Collège,
pour modeler les « exercices riches ».

Sources (hors Dropbox, usage interne, on modèle sans recopier) :
  ~/DATA/Enseignement/Sources/Libres/coopmaths_mathalea/src/json/dictionnaireDNB.ts
  ~/DATA/Enseignement/Sources/Libres/coopmaths_dnb/sujets_decoupes/<année>/tex/
Sortie : banque/dnb_index.xlsx (privé, gitignoré).
"""
import re
from pathlib import Path
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment

SRC = Path.home() / "DATA/Enseignement/Sources/Libres"
JSON = SRC / "coopmaths_mathalea/src/json"
SOURCES = [  # (nom, index Coopmaths, dépôt)
    ("brevet", "dictionnaireDNB.ts", "coopmaths_dnb"),
    ("E3C 1re", "dictionnaireE3C.ts", "coopmaths_e3c"),
    ("EAM 1re", "dictionnaireEAM.ts", "coopmaths_eam"),
    ("bac", "dictionnaireBAC.ts", "coopmaths_bac"),
]
# Base C. Poulain (forge cpoulain/bases-college) : dossiers par thème, 3e et 4e françaises
# (≈ 10e-11e CO). Usage personnel libre ; mise en ligne = autorisation de l'auteur.
POULAIN = SRC / "cpoulain_bases-college"
PDIR = {
    "3arithmetique": "11C01", "3racines": "11C01", "4fractions": "11C01", "4puissances": "11C01",
    "3litteral": "11C05", "4litteral": "11C05", "3equainequa": "11C06", "4equa": "11C06",
    "3fonctions": "11C10", "3affine": "11C10", "3geoana": "11C10", "3espace": "11C03",
    "4espace": "11C03", "3geoplane": "11C07", "4trireccercle": "11C07", "3proba": "11C12",
    "3rotation": "11C11", "3systemes": "11C09", "3thales": "11C08", "4thales": "11C08",
    "4pythagore": "11C02", "4proportionnalite": "11C04", "3trigo": "M1C10", "4cosinus": "M1C10",
    "3vecteurs": "M2C10", "4demonstration": "M1C03",
    "3Probleme": "", "3problemegeo": "", "3problemenum": "", "3cumul": "",
    "4Problemes": "", "4TachesComplexes": "", "4geoprobleme": "",
}
VERS1C = {"11C01": "M1C01", "11C05": "M1C06", "11C06": "M1C05", "11C10": "M1C04",
          "11C02": "M1C08", "11C08": "M1C08", "11C07": "M1C09", "11C09": "M1C05"}
OUT = Path(__file__).resolve().parent.parent / "banque" / "annales_index.xlsx"

CH11 = {  # tag Coopmaths -> chapitre 11e (THEME_LABEL CO)
    "Calcul numérique": "11C01", "Fractions": "11C01", "Puissances": "11C01", "Arithmétique": "11C01",
    "Pythagore": "11C02", "Géométrie dans l'espace": "11C03", "Volumes": "11C03",
    "Proportionnalité": "11C04", "Pourcentages": "11C04", "Vitesses": "11C04",
    "Grandeurs composées": "11C04", "Durées": "11C04",
    "Calcul littéral": "11C05", "Programme de calculs": "11C05", "Équations": "11C06",
    "Géométrie plane": "11C07", "Thalès": "11C08", "Triangles semblables": "11C11",
    "Fonctions": "11C10", "Lecture graphique": "11C10",
    "Transformations": "11C11", "Agrandissement-réduction": "11C11", "Probabilités": "11C12",
}
CH1C = {  # tag -> chapitre 1re Collège (THEME_LABEL MATU)
    "Calcul numérique": "M1C01", "Fractions": "M1C01", "Puissances": "M1C01",
    "Pourcentages": "M1C01", "Arithmétique": "M1C01",
    "Vrai/Faux": "M1C03", "Prise d'initiatives": "M1C03",
    "Fonctions": "M1C04", "Lecture graphique": "M1C04", "Équations": "M1C05",
    "Calcul littéral": "M1C06", "Programme de calculs": "M1C06",
    "Thalès": "M1C08", "Pythagore": "M1C08", "Triangles semblables": "M1C08",
    "Agrandissement-réduction": "M1C08", "Géométrie plane": "M1C09", "Trigonométrie": "M1C10",
}
LYC = {  # thèmes lycée -> chapitres Collège (M1 = 1re, M2 = 2e)
    "Second degré": "M1C07", "Polynômes": "M2C03", "Troisième degré": "M2C03",
    "Géométrie repérée": "M2C01", "Produit scalaire": "M2C10", "Espace": "M2C10",
    "Trigonométrie": "M2C09", "Exponentielle": "M2C05", "Logarithme": "M2C07",
    "Pourcentages (évolutions)": "M1C01", "Automatismes": "M1C01",
    "Affirmations": "M1C03", "Vrai/Faux": "M1C03", "Croissance linéaire": "M1C05",
}
LAB = {
    "11C01": "Nombres et opérations", "11C02": "Pythagore", "11C03": "3D", "11C04": "Proportionnalité, grandeurs",
    "11C05": "Calcul littéral", "11C06": "Équations", "11C07": "Angles", "11C08": "Thalès",
    "11C10": "Fonctions", "11C11": "Transformations, similitude", "11C12": "Probabilités",
    "M1C01": "Nombres", "M1C03": "Argumenter", "M1C04": "Fonctions", "M1C05": "Degrés 0 et 1",
    "M1C06": "Calcul littéral", "M1C08": "Thalès à Pythagore", "M1C09": "Cercles, angles",
    "M1C07": "Degré 2", "M1C10": "Trigonométrie", "M2C01": "Équations cartésiennes",
    "M2C03": "Fonctions polynomiales", "M2C05": "Exponentielles", "M2C07": "Logarithmes",
    "M2C09": "Fonctions trigonométriques", "M2C10": "Géométrie vectorielle",
}
# Ce qui rend un exercice « riche » (repérage grossier dans l'énoncé)
TYPES = [
    ("justifier", r"justifi|montrer|démontrer|expliquer|prouver"),
    ("vrai/faux", r"vrai ou faux|vraie ou fausse|affirmation"),
    ("inverse", r"quel(le)? nombre .*choisir|retrouver|déterminer le nombre de départ|combien faut"),
    ("comparer", r"compar|le plus avantageux|meilleur|lequel|laquelle|a-t-il raison|a raison"),
    ("tableau", r"\\begin\{tabular|tableur"),
    ("figure", r"pspicture|tikzpicture|includegraphics"),
    ("initiative", r"toute trace de recherche|prise d'initiative"),
]


def parse_dico(name):
    txt = (JSON / name).read_text(encoding="utf-8")
    out = {}
    for m in re.finditer(r"\n  (\w+): \{(.*?)\n  \},", txt, re.S):
        body = m.group(2)
        g = lambda k: (re.search(k + r": '([^']*)'", body) or [None, ""])[1]
        tags = re.findall(r"'((?:[^'\\]|\\.)*)'", (re.search(r"tags: \[(.*?)\]", body, re.S) or [0, ""])[1])
        out[m.group(1)] = dict(annee=g("annee"), lieu=g("lieu"), mois=g("mois"),
                               tags=[t.replace("\\'", "'") for t in tags])
    return out


def plain(tex):
    t = re.sub(r"%.*", "", tex)
    t = re.sub(r"\\begin\{(pspicture|tikzpicture|figure)\}.*?\\end\{\1\}", " [figure] ", t, flags=re.S)
    t = re.sub(r"\\begin\{tabular\}.*?\\end\{tabular\}", " [tableau] ", t, flags=re.S)
    t = re.sub(r"\\item", "\n•", t)
    t = re.sub(r"\\[a-zA-Z]+\*?(\[[^]]*\])?", " ", t)
    t = re.sub(r"[{}$\\]", " ", t)
    return re.sub(r"[ \t]+", " ", t).strip()


def main():
    wb = Workbook()
    ws = wb.active
    ws.title = "Exercices"
    head = ["id", "source", "année", "session", "chap. 11e", "chap. 1re Coll.", "chap. 2e Coll.", "thèmes", "questions",
            "types", "début de l'énoncé", "énoncé .tex", "corrigé .tex"]
    ws.append(head)
    count = {}
    for src, dname, repo in SOURCES:
      files = {f.stem: f for f in (SRC / repo).rglob("*.tex")}
      for eid, d in sorted(parse_dico(dname).items()):
        f = files.get(eid)
        if f is None:
            continue
        tex = f.read_text(encoding="utf-8", errors="replace")
        c11 = sorted({CH11[t] for t in d["tags"] if t in CH11}) if src == "brevet" else []
        cm = {CH1C[t] for t in d["tags"] if t in CH1C} | {LYC[t] for t in d["tags"] if t in LYC}
        if src == "bac":  # Terminale : on ne garde que ce que fait le Collège
            cm = {c for c in cm if c in ("M2C05", "M2C07", "M2C09", "M2C10", "M1C03")}
        c1c = sorted(c for c in cm if c.startswith("M1"))
        c2c = sorted(c for c in cm if c.startswith("M2"))
        if not (c11 or c1c or c2c):
            continue
        low = re.sub(r"aucune justification[^.]*", "", tex.lower())
        types = [n for n, rx in TYPES if re.search(rx, low)]
        nq = len(re.findall(r"\\item", tex))
        txt = plain(tex)
        cor = files.get(f"{eid}_cor")
        ws.append([eid, src, int(d["annee"]), f'{d["mois"]} {d["lieu"]}',
                   ", ".join(c11), ", ".join(c1c), ", ".join(c2c), ", ".join(d["tags"]), nq,
                   ", ".join(types), txt[:300], str(f), str(cor) if cor else ""])
        for c in c11 + c1c + c2c:
            k = count.setdefault(c, [0, 0, 0])
            k[0] += 1
            k[1] += "justifier" in types or "comparer" in types or "inverse" in types
            k[2] += nq >= 3
    labs = dict((b, a.strip().rstrip(".")) for a, b in re.findall(
        r"\+ \[([^]]*)\]\(([^)]*)\)", (POULAIN / "README.md").read_text(encoding="utf-8")))
    for d, ch in PDIR.items():
        lab = labs.get(d, d)
        for f in sorted((POULAIN / d / "tex").glob("*.tex")):
            tex = f.read_text(encoding="utf-8", errors="replace")
            com = " ".join(re.findall(r"%@Commentaire:(.*)", tex)).strip()
            low = re.sub(r"aucune justification[^.]*", "", tex.lower())
            types = [n for n, rx in TYPES if re.search(rx, low)]
            if not ch:
                types.insert(0, "problème")
            if "riche" in com.lower():
                types.insert(0, "situation riche")
            c11 = [ch] if ch.startswith("11") else []
            cm = [VERS1C[ch]] if ch in VERS1C else ([ch] if ch.startswith("M") else [])
            nq = len(re.findall(r"\\item", tex))
            ws.append([f"{d}/{f.stem}", "Poulain " + d[0] + "e", None, lab,
                       ", ".join(c11), ", ".join(c for c in cm if c.startswith("M1")),
                       ", ".join(c for c in cm if c.startswith("M2")), lab, nq, ", ".join(types),
                       (("[" + com + "] ") if com else "") + plain(tex)[:300], str(f), ""])
            for c in c11 + cm:
                k = count.setdefault(c, [0, 0, 0])
                k[0] += 1
                k[1] += "justifier" in types or "comparer" in types or "inverse" in types
                k[2] += nq >= 3
    bold = Font(bold=True)
    fill = PatternFill("solid", fgColor="DDEBF7")
    for cell in ws[1]:
        cell.font, cell.fill = bold, fill
    for col, w in zip("ABCDEFGHIJKLM", [30, 9, 7, 22, 14, 14, 14, 34, 9, 26, 80, 20, 20]):
        ws.column_dimensions[col].width = w
    for row in ws.iter_rows(min_row=2):
        row[10].alignment = Alignment(wrap_text=True, vertical="top")
    ws.freeze_panes = "B2"
    ws.auto_filter.ref = ws.dimensions

    s = wb.create_sheet("Synthèse", 0)
    s.append(["chapitre", "intitulé", "exercices", "avec justifier / comparer / inverse", "≥ 3 questions"])
    for c in sorted(count, key=lambda c: (c[0] == "M", c)):
        s.append([c, LAB.get(c, ""), *count[c]])
    for cell in s[1]:
        cell.font, cell.fill = bold, fill
    for col, w in zip("ABCDE", [9, 28, 11, 34, 14]):
        s.column_dimensions[col].width = w
    OUT.parent.mkdir(exist_ok=True)
    wb.save(OUT)
    print(f"{ws.max_row - 1} exercices -> {OUT}")
    for r in s.iter_rows(min_row=2, values_only=True):
        print(" ", *r)


if __name__ == "__main__":
    main()
