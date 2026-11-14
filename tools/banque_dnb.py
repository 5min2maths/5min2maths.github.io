"""Index des exercices du brevet (annales APMEP découpées par Coopmaths) rangés
par chapitre 11e CO et 1re Collège, pour modeler les « exercices riches ».

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
DICO = SRC / "coopmaths_mathalea/src/json/dictionnaireDNB.ts"
TEX = SRC / "coopmaths_dnb/sujets_decoupes"
OUT = Path(__file__).resolve().parent.parent / "banque" / "dnb_index.xlsx"

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
LAB = {
    "11C01": "Nombres et opérations", "11C02": "Pythagore", "11C03": "3D", "11C04": "Proportionnalité, grandeurs",
    "11C05": "Calcul littéral", "11C06": "Équations", "11C07": "Angles", "11C08": "Thalès",
    "11C10": "Fonctions", "11C11": "Transformations, similitude", "11C12": "Probabilités",
    "M1C01": "Nombres", "M1C03": "Argumenter", "M1C04": "Fonctions", "M1C05": "Degrés 0 et 1",
    "M1C06": "Calcul littéral", "M1C08": "Thalès à Pythagore", "M1C09": "Cercles, angles",
    "M1C10": "Trigonométrie",
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


def parse_dico():
    txt = DICO.read_text(encoding="utf-8")
    out = {}
    for m in re.finditer(r"\n  (dnb_\w+): \{(.*?)\n  \},", txt, re.S):
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
    dico = parse_dico()
    wb = Workbook()
    ws = wb.active
    ws.title = "Exercices"
    head = ["id", "année", "session", "chap. 11e", "chap. 1re Coll.", "thèmes", "questions",
            "types", "début de l'énoncé", "énoncé .tex", "corrigé .tex"]
    ws.append(head)
    count = {}
    for eid, d in sorted(dico.items()):
        f = TEX / d["annee"] / "tex" / f"{eid}.tex"
        if not f.exists():
            continue
        tex = f.read_text(encoding="utf-8", errors="replace")
        c11 = sorted({CH11[t] for t in d["tags"] if t in CH11})
        c1c = sorted({CH1C[t] for t in d["tags"] if t in CH1C})
        if not (c11 or c1c):
            continue
        low = re.sub(r"aucune justification[^.]*", "", tex.lower())
        types = [n for n, rx in TYPES if re.search(rx, low)]
        nq = len(re.findall(r"\\item", tex))
        txt = plain(tex)
        cor = f.with_name(f"{eid}_cor.tex")
        ws.append([eid, int(d["annee"]), f'{d["mois"]} {d["lieu"]}',
                   ", ".join(c11), ", ".join(c1c), ", ".join(d["tags"]), nq,
                   ", ".join(types), txt[:300], str(f), str(cor) if cor.exists() else ""])
        for c in c11 + c1c:
            k = count.setdefault(c, [0, 0, 0])
            k[0] += 1
            k[1] += "justifier" in types or "comparer" in types or "inverse" in types
            k[2] += nq >= 3
    bold = Font(bold=True)
    fill = PatternFill("solid", fgColor="DDEBF7")
    for cell in ws[1]:
        cell.font, cell.fill = bold, fill
    for col, w in zip("ABCDEFGHIJK", [30, 7, 22, 14, 14, 34, 9, 26, 80, 20, 20]):
        ws.column_dimensions[col].width = w
    for row in ws.iter_rows(min_row=2):
        row[8].alignment = Alignment(wrap_text=True, vertical="top")
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
