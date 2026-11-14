#!/usr/bin/env python3
"""Tableau de suivi du contenu de 5min2maths (14.11) : suivi/Suivi_5min2maths.xlsx.

Un onglet par classe (9e … MP 2e), une ligne par question (notion × niveau 1, 2, 3, défi, problème),
dans l'ordre des chapitres de l'année. Colonnes automatiques (lues dans l'app par tests/inventaire.html,
dans Chromium sans interface) : générateur, figure, leçon, leçon active, votes et commentaires des testeurs.
Colonnes de l'utilisateur, jamais écrasées : « Contrôlé » (à faire / vu / à corriger / validé) et « Remarque ».
Usage : python3 tools/suivi.py   (relancer après chaque changement de l'app)
"""
import html, json, os, re, shutil, subprocess, sys, urllib.request
from pathlib import Path

try:
    from openpyxl import Workbook, load_workbook
    from openpyxl.formatting.rule import CellIsRule, FormulaRule
    from openpyxl.styles import Alignment, Font, PatternFill
    from openpyxl.worksheet.datavalidation import DataValidation
except ImportError:
    sys.exit("openpyxl manquant : lancer avec ~/.venvs/cfpt/bin/python")

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "suivi" / "Suivi_5min2maths.xlsx"
INV = ROOT / "suivi" / "inventaire.json"
STATUTS = ["à faire", "vu", "à corriger", "validé"]
NIV = {1: "N1", 2: "N2", 3: "N3", 4: "Défi"}
COLS = ["Chapitre", "Notion", "id", "Question", "Compétence", "Révision", "Générateur", "Formes", "Figure", "Leçon",
        "Leçon active", "Retours leçon", "👍", "👎", "💬", "Contrôlé", "Remarque"]
WIDTH = [30, 30, 10, 9, 42, 9, 11, 8, 9, 9, 13, 13, 5, 5, 5, 12, 40]


def inventaire():
    page = ROOT / "tests" / "inventaire.html"
    chrome = shutil.which("chromium") or shutil.which("chromium-browser") or shutil.which("google-chrome")
    if not chrome:
        sys.exit("Chromium introuvable")
    r = subprocess.run([chrome, "--headless", "--no-sandbox", "--disable-gpu", "--allow-file-access-from-files",
                        "--virtual-time-budget=120000", "--dump-dom", page.as_uri()], capture_output=True, text=True, timeout=300)
    m = re.search(r'<pre id="out">(.*?)</pre>', r.stdout, re.S)
    t = html.unescape(m.group(1)) if m else ""
    if not t.startswith("{"):
        sys.exit("Inventaire impossible : " + t[:300])
    INV.write_text(t)
    return json.loads(t)


def retours():
    """Votes et commentaires des testeurs (comptes seulement). En cas d'échec : vide."""
    try:
        url = re.search(r'VOTE_ENDPOINT = "([^"]+)"', (ROOT / "src" / "app.js").read_text()).group(1)
        lire = lambda u: json.loads(urllib.request.urlopen(u, timeout=20).read().decode())
        votes = lire(url)
        cle = (ROOT / "tools" / ".cle_lecture").read_text().strip()
        comms = lire(url + "?commentaires=" + cle)
        return votes, comms if isinstance(comms, list) else []
    except Exception as e:
        print("(retours des testeurs indisponibles :", e, ")")
        return {}, []


def manuel():
    """(classe, id, question) -> (contrôlé, remarque) du tableau existant."""
    if not OUT.exists():
        return {}
    wb, keep = load_workbook(OUT), {}
    for ws in wb.worksheets:
        if ws.title == "Synthèse":
            continue
        head = [c.value for c in ws[1]]
        if "id" not in head:
            continue
        i, q, c, r = head.index("id"), head.index("Question"), head.index("Contrôlé"), head.index("Remarque")
        for row in ws.iter_rows(min_row=2, values_only=True):
            if row[i]:
                keep[(ws.title, row[i], row[q])] = (row[c], row[r])
    return keep


def main():
    d = inventaire()
    votes, comms = retours()
    keep = manuel()
    P = d["probe"]
    # votes : « notion · niveau d » et « lecon · niveau id » ; commentaires : code « notion-d-… » ou « lecon-id »
    v_q, v_l, c_q, c_l = {}, {}, {}, {}
    for k, x in votes.items():
        m = re.match(r"(\S+) · niveau (\S+)", k)
        if m and m.group(1) == "lecon":
            v_l[m.group(2)] = x
        elif m:
            v_q[(m.group(1), m.group(2))] = x
    for x in comms:
        code = str(x.get("code", ""))
        if code.startswith("lecon-"):
            c_l[code[6:]] = c_l.get(code[6:], 0) + 1
        else:
            p = code.split("-")
            if len(p) >= 2:
                c_q[(p[0], p[1])] = c_q.get((p[0], p[1]), 0) + 1

    wb = Workbook()
    syn = wb.active
    syn.title = "Synthèse"
    bold, head_fill = Font(bold=True), PatternFill("solid", fgColor="DCE6F8")
    fills = {"validé": "C6EFCE", "vu": "DDEBF7", "à corriger": "FFC7CE", "à faire": "F2F2F2"}
    for cl in d["classes"]:
        ws = wb.create_sheet(cl["name"])
        ws.append(COLS)
        for c in ws[1]:
            c.font, c.fill = bold, head_fill
        for row in cl["rows"]:
            n = P[row["id"]]
            comps = n["comps"] or [n["label"]] * 3
            act = "✓ dynamique" if n["active"] else ("curseur" if n["dyn"] else "à faire")
            vl, cnl = v_l.get(row["id"], {}), c_l.get(row["id"], 0)
            rl = " ".join(s for s in [f"{vl.get('up', 0)}👍" if vl.get("up") else "", f"{vl.get('down', 0)}👎" if vl.get("down") else "", f"{cnl}💬" if cnl else ""] if s)
            qs = [(NIV[l["d"]], comps[min(l["d"], 3) - 1], l) for l in n["lv"]]
            if n.get("prob"):
                qs.append(("Problème", comps[2], {"d": "P", **n["prob"], "err": ""}))
            for qn, comp, l in qs:
                ok = l["ok"] > 0
                gen = "✓" if ok else ("✗ " + l["err"][:30] if l["err"] else "✗")
                fig = "✓" if l["fig"] == l["ok"] and ok else (f"{l['fig']}/{l['ok']}" if l["fig"] else "—")
                key = (row["id"], str(l["d"]))
                vq = v_q.get(key, {})
                ctl, rem = keep.get((cl["name"], row["id"], qn), ("à faire", None))
                ws.append([row["chap"], n["label"], row["id"], qn, comp, "oui" if row["again"] else "", gen, l.get("forms"), fig,
                           "✓" if n["lesson"] else "—", act, rl, vq.get("up") or None, vq.get("down") or None,
                           c_q.get(key) or None, ctl or "à faire", rem])
        last = ws.max_row
        for i, w in enumerate(WIDTH):
            ws.column_dimensions[chr(65 + i)].width = w
        ws.freeze_panes = "E2"
        ws.auto_filter.ref = f"A1:Q{last}"
        dv = DataValidation(type="list", formula1='"' + ",".join(STATUTS) + '"', allow_blank=True)
        ws.add_data_validation(dv)
        dv.add(f"P2:P{last}")
        for s, col in fills.items():
            ws.conditional_formatting.add(f"P2:P{last}", CellIsRule(operator="equal", formula=[f'"{s}"'], fill=PatternFill("solid", fgColor=col)))
        ws.conditional_formatting.add(f"K2:K{last}", CellIsRule(operator="equal", formula=['"✓ dynamique"'], fill=PatternFill("solid", fgColor="C6EFCE")))
        ws.conditional_formatting.add(f"G2:G{last}", FormulaRule(formula=['LEFT(G2,1)="✗"'], fill=PatternFill("solid", fgColor="FFC7CE")))
        # Variété (14.11) : une seule forme de question = rouge, deux = orange
        ws.conditional_formatting.add(f"H2:H{last}", CellIsRule(operator="equal", formula=["1"], fill=PatternFill("solid", fgColor="FFC7CE")))
        ws.conditional_formatting.add(f"H2:H{last}", CellIsRule(operator="equal", formula=["2"], fill=PatternFill("solid", fgColor="FFEB9C")))
        # chapitre en gras au premier rang de chaque chapitre
        prev = None
        for r in range(2, last + 1):
            if ws.cell(r, 1).value != prev:
                ws.cell(r, 1).font = bold
                prev = ws.cell(r, 1).value
            else:
                ws.cell(r, 1).font = Font(color="999999")

    # Synthèse : formules (se met à jour quand l'utilisateur change « Contrôlé »)
    syn.append(["Classe", "Notions", "Questions", "Leçons actives", "% notions actives", "Validées", "À corriger", "Vues", "% validé", "Questions à 1 forme"])
    for c in syn[1]:
        c.font, c.fill = bold, head_fill
    for i, cl in enumerate(d["classes"], start=2):
        t = f"'{cl['name']}'!"
        notions = len(cl["rows"])
        actives = sum(1 for r in cl["rows"] if P[r["id"]]["active"])
        syn.append([cl["name"], notions, f"=COUNTA({t}C:C)-1", actives, f"=D{i}/B{i}",
                    f'=COUNTIF({t}P:P,"validé")', f'=COUNTIF({t}P:P,"à corriger")', f'=COUNTIF({t}P:P,"vu")', f"=F{i}/C{i}", f"=COUNTIF({t}H:H,1)"])
        syn[f"E{i}"].number_format = syn[f"I{i}"].number_format = "0%"
    syn.append([])
    syn.append(["Statuts « Contrôlé » : à faire → vu → à corriger → validé. Colonnes automatiques recalculées par tools/suivi.py ; Contrôlé et Remarque conservés."])
    for col, w in zip("ABCDEFGHIJ", [12, 9, 10, 14, 16, 9, 11, 7, 9, 18]):
        syn.column_dimensions[col].width = w
    OUT.parent.mkdir(exist_ok=True)
    wb.save(OUT)
    tot = sum(1 for c, r in keep.values() if (c and c != "à faire") or r)
    print(f"{OUT.relative_to(ROOT)} : " + ", ".join(f"{c['name']} {len(c['rows'])} notions" for c in d["classes"]) + f" ; {tot} statuts ou remarques conservés")


if __name__ == "__main__":
    main()
