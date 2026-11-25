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
        "Leçon active", "Retours leçon", "👍", "👎", "💬", "Contrôlé", "Remarque", "Ex. 1", "Ex. 2", "Ex. 3", "Voir la leçon", "Audit de niveau"]
SITE = "https://5min2maths.github.io/"
WIDTH = [30, 30, 10, 9, 42, 9, 11, 8, 9, 9, 13, 13, 5, 5, 5, 12, 40, 7, 7, 7, 12]


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


def banques_riches():
    """Chapitres qui ont un test de préparation de qualité (src/riche.js, 15.11) : clé -> (notions, nb exercices, nb raisonnement)."""
    out = {}
    # Ordre de chargement de build.py (23.11) : comme richChapter (sujet), à égalité la première banque chargée l'emporte.
    ordre = re.search(r'JS = \[(.*?)\]', (ROOT / "build.py").read_text(), re.S)
    ordre = re.findall(r'"(riche[^"]*\.js)"', ordre.group(1)) if ordre else []
    for f in sorted((ROOT / "src").glob("riche*.js"), key=lambda f: (ordre.index(f.name) if f.name in ordre else 99, f.name)):
        s = f.read_text()
        for m in re.finditer(r'RICH\.(\w+) = \{ ids: \[([^\]]*)\](, track: "(\w+)")?', s):
            out[m.group(1)] = re.findall(r'"([a-z0-9]+)"', m.group(2))
            TRACK[m.group(1)] = m.group(4)  # 23.11 : banque réservée à une filière (mp / col)
    return out


TRACK = {}


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


TRAITES = ROOT / "tools" / "commentaires_traites.txt"
try:
    NIVREG = json.loads((ROOT / "tools" / "niveau.json").read_text())  # 24.11 : registre des audits de niveau
except Exception:
    NIVREG = {}
C_COLS = ["Reçu le", "Classe", "Code", "Commentaire", "Traité", "Ce qui a été fait", "Remarque"]


def traites():
    """horodatage -> ce qui a été fait (tools/commentaires_traites.txt : « horodatage | note », note facultative)."""
    out = {}
    if TRAITES.exists():
        for l in TRAITES.read_text().splitlines():
            if l.strip() and not l.startswith("#"):
                t, _, note = l.partition("|")
                out[t.strip()] = note.strip()
    return out


def manuel_comms():
    """Onglet Commentaires existant : reçu -> (traité, fait, remarque) saisis à la main (conservés)."""
    if not OUT.exists():
        return {}
    wb = load_workbook(OUT)
    if "Commentaires" not in wb.sheetnames:
        return {}
    ws, keep = wb["Commentaires"], {}
    head = [c.value for c in ws[1]]
    if head[:len(C_COLS)] != C_COLS:
        return {}
    for row in ws.iter_rows(min_row=2, values_only=True):
        if row[0]:
            keep[str(row[0])] = (row[4], row[5], row[6])
    return keep


def onglet_commentaires(wb, comms, bold, head_fill):
    """Onglet « Commentaires » (22.11) : tous les commentaires, du plus récent au plus ancien, traité ou non et ce qui a
    été fait. Sources : l'Apps Script (texte) et tools/commentaires_traites.txt (traité + note) ; ce que l'utilisateur
    écrit dans les colonnes Traité, Ce qui a été fait et Remarque est conservé d'une génération à l'autre."""
    T, keep = traites(), manuel_comms()
    ws = wb.create_sheet("Commentaires", 1)
    ws.append(C_COLS)
    for c in ws[1]:
        c.font, c.fill = bold, head_fill
    n_non = 0
    for x in sorted(comms, key=lambda x: str(x.get("recu", "")), reverse=True):
        recu = str(x.get("recu", ""))
        k_tr, k_fait, k_rem = keep.get(recu, (None, None, None))
        fait_txt = T.get(recu) or k_fait or ("traité (détail dans le journal git)" if recu in T else "")
        tr = "oui" if recu in T else (k_tr or "non")
        if tr != "oui":
            n_non += 1
        ws.append([recu[:16].replace("T", " "), x.get("classe", ""), x.get("code", ""), " ".join(str(x.get("commentaire", "")).split()),
                   tr, fait_txt if (recu in T or fait_txt) else "", k_rem or ""])
    dv = DataValidation(type="list", formula1='"oui,non,sans suite"', allow_blank=True)
    ws.add_data_validation(dv)
    dv.add(f"E2:E{max(2, ws.max_row)}")
    ws.conditional_formatting.add(f"A2:G{max(2, ws.max_row)}", FormulaRule(formula=['$E2="non"'], fill=PatternFill("solid", fgColor="FFF2CC")))
    for col, w in zip("ABCDEFG", [16, 14, 26, 70, 9, 55, 30]):
        ws.column_dimensions[col].width = w
    for row in ws.iter_rows(min_row=2):
        for c in row:
            c.alignment = Alignment(wrap_text=True, vertical="top")
    ws.freeze_panes = "A2"
    ws.auto_filter.ref = f"A1:G{max(1, ws.max_row)}"
    return len(comms), n_non


def onglet_robot(wb, bold, head_fill):
    """Onglet « Robot » (22.11) : problèmes trouvés par l'élève-robot (tools/bot_eleve.py, suivi/robot/dernier.json)."""
    f = ROOT / "suivi" / "robot" / "dernier.json"
    if not f.exists():
        return 0
    d = json.loads(f.read_text())
    ws = wb.create_sheet("Robot", 2)
    ws.append(["Nouveau", "Type", "Classe", "Code", "Où", "Détail"])
    for c in ws[1]:
        c.font, c.fill = bold, head_fill
    for p in sorted(d.get("problemes", []), key=lambda p: (not p.get("nouveau"), p["type"], p["classe"])):
        ws.append(["oui" if p.get("nouveau") else "", p["type"], p["classe"], p["code"], p.get("ou", ""), p["detail"]])
    ws.conditional_formatting.add(f"A2:F{max(2, ws.max_row)}", FormulaRule(formula=['$A2="oui"'], fill=PatternFill("solid", fgColor="FFF2CC")))
    for col, w in zip("ABCDEF", [9, 26, 9, 22, 10, 90]):
        ws.column_dimensions[col].width = w
    ws.freeze_panes = "A2"
    ws.auto_filter.ref = f"A1:F{max(1, ws.max_row)}"
    ws.append([])
    ws.append([f"Rapport du {d.get('date', '')[:10]} : " + ", ".join(f"{k} {v['questions'] + v['balayage']} q." for k, v in d.get("stats", {}).items())])
    return len(d.get("problemes", []))


def onglet_chantiers(wb, bold, head_fill):
    """Onglet « Chantiers » (23.11) : tous les chantiers du projet et leur état (source : tools/chantiers.tsv, à tenir à
    jour) ; la colonne « Remarque » de l'utilisateur est conservée d'une génération à l'autre."""
    src = ROOT / "tools" / "chantiers.tsv"
    if not src.exists():
        return 0
    rem = {}
    if OUT.exists():
        try:
            old = load_workbook(OUT)
            if "Chantiers" in old.sheetnames:
                w = old["Chantiers"]
                h = [c.value for c in w[1]]
                if "Remarque" in h:
                    for r in w.iter_rows(min_row=2, values_only=True):
                        if r[0] and r[h.index("Remarque")]:
                            rem[r[0]] = r[h.index("Remarque")]
        except Exception:
            pass
    lignes = [l.split("\t") for l in src.read_text().splitlines() if l.strip()]
    ws = wb.create_sheet("Chantiers", 1)
    ws.append(lignes[0] + ["Remarque"])
    for c in ws[1]:
        c.font, c.fill = bold, head_fill
    for l in lignes[1:]:
        ws.append(l + [rem.get(l[0])])
    couleurs = {"fait": "C6EFCE", "en cours": "DDEBF7", "à contrôler": "FFEB9C", "en partie": "DDEBF7", "à faire": "F2F2F2",
                "abandonné": "D9D9D9", "en attente": "F2F2F2", "en réserve": "F2F2F2", "études": "F2F2F2", "à décider": "FFC7CE"}
    n = ws.max_row
    for st, col in couleurs.items():
        ws.conditional_formatting.add(f"E2:E{n}", CellIsRule(operator="equal", formula=[f'"{st}"'], fill=PatternFill("solid", fgColor=col)))
    for col, w in zip("ABCDEFGHIJ", [8, 48, 12, 6, 12, 11, 10, 60, 50, 30]):
        ws.column_dimensions[col].width = w
    for row in ws.iter_rows(min_row=2):
        for c in row:
            c.alignment = Alignment(wrap_text=True, vertical="top")
    ws.freeze_panes = "C2"
    ws.auto_filter.ref = f"A1:J{n}"
    return n - 1


def onglet_referentiel(wb, bold, head_fill, P):
    """Onglet « Référentiel Collège » (25.11) : une ligne par compétence officielle du Collège (tools/ref_matu.py) :
    code, année, niveau, intitulé, notions de l'app rattachées, état (couvert / à faire / hors saisie). Filtrable."""
    try:
        sys.path.insert(0, str(ROOT / "tools"))
        import ref_matu
        rs = ref_matu.rows()
    except Exception as e:
        print("(référentiel du Collège indisponible :", e, ")")
        return 0
    lk = ref_matu.links(rs)
    ws = wb.create_sheet("Référentiel Collège", 1)
    ws.append(["Code", "Année", "Niveau", "Thème", "Notion du référentiel", "Compétence", "Notions de l'app rattachées", "État"])
    for c in ws[1]:
        c.font, c.fill = bold, head_fill
    lab = lambda n: (P.get(n.split("@")[0], {}).get("label", "") + " [" + n.split("@")[0] + "]").strip() + (" (niv. " + ", ".join(n.split("@")[1]) + ")" if "@" in n else "")
    for r in rs:
        L = lk[r["code"]]
        ws.append([r["code"], r["annee"], r["niveau"], r["theme"], r["notion"], r["competence"], " ; ".join(lab(n) for n in L), ref_matu.etat(r, L)])
    n = ws.max_row
    for st, col in {"couvert": "C6EFCE", "à faire": "FFC7CE", "hors saisie": "F2F2F2"}.items():
        ws.conditional_formatting.add(f"H2:H{n}", CellIsRule(operator="equal", formula=[f'"{st}"'], fill=PatternFill("solid", fgColor=col)))
    for col, w in zip("ABCDEFGH", [10, 7, 10, 18, 26, 70, 50, 12]):
        ws.column_dimensions[col].width = w
    for row in ws.iter_rows(min_row=2):
        for c in row:
            c.alignment = Alignment(wrap_text=True, vertical="top")
    ws.freeze_panes = "B2"
    ws.auto_filter.ref = f"A1:H{n}"
    return n - 1


def main():
    d = inventaire()
    votes, comms = retours()
    keep = manuel()
    global RICH_B
    RICH_B = banques_riches()
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
        rows = cl["rows"]
        for k, row in enumerate(rows):
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
                # Liens de contrôle (15.11) : trois tirages de la question dans l'app (…/#q-id-niveau-graine) et la leçon.
                lv = 4 if l["d"] in (4, "P") else l["d"]
                r = ws.max_row
                for j, seed in enumerate(["1", "2", "3"]):
                    c = ws.cell(r, 18 + j, f"ex. {j + 1}"); c.hyperlink = f"{SITE}#q-{row['id']}-{lv}-{seed}"; c.font = Font(color="1F4FD8", underline="single")
                if n["lesson"]:
                    c = ws.cell(r, 21, "leçon"); c.hyperlink = f"{SITE}#l-{row['id']}"; c.font = Font(color="1F4FD8", underline="single")
                # 24.11 : agents robustesse (/audit-niveau) : verdict du registre tools/niveau.json, sinon « à auditer »
                au = NIVREG.get(row["id"]) or {}
                au = (au.get("par_classe") or {}).get(cl["name"], au)  # 25.11 : verdict propre à la classe (audit 11e d'une notion partagée)
                ws.cell(r, 22, (au.get("verdict", "") + " (" + au.get("audit", "") + ")") if au else "à auditer")
            # Fin de chapitre : statut du test de préparation (évaluation d'entraînement, demande du 15.11).
            if k + 1 == len(rows) or rows[k + 1]["chap"] != row["chap"]:
                ids = [r["id"] for r in rows if r["chap"] == row["chap"]]
                mp = cl["name"].startswith("MP")
                cand = [c for c in RICH_B if not TRACK.get(c) or TRACK[c] == ("mp" if mp else "col")]
                cand.sort(key=lambda c: (-sum(i in RICH_B[c] for i in ids), not TRACK.get(c)))
                ch = next((c for c in cand if 2 * sum(i in RICH_B[c] for i in ids) >= len(ids)), None)
                sid = "sujet:" + row["chap"][:20]
                ctl, rem = keep.get((cl["name"], sid, "Test"), ("à faire", None))
                ws.append([row["chap"], "Test de préparation (évaluation)", sid, "Test", "Sujet type test : automatismes, exercices en situation, raisonnement", "",
                           ("✓ qualité (banque " + ch + ")") if ch else "✗ drill seulement", None, "", "", "", "", None, None, None, ctl or "à faire", rem])
                for c in ws[ws.max_row]:
                    c.fill = PatternFill("solid", fgColor="FFF2CC")
        last = ws.max_row
        for i, w in enumerate(WIDTH):
            ws.column_dimensions[chr(65 + i)].width = w
        ws.freeze_panes = "E2"
        ws.auto_filter.ref = f"A1:U{last}"
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

    n_c, n_non = onglet_commentaires(wb, comms, bold, head_fill)
    n_r = onglet_robot(wb, bold, head_fill)
    n_ch = onglet_chantiers(wb, bold, head_fill)
    n_ref = onglet_referentiel(wb, bold, head_fill, P)
    # Synthèse : formules (se met à jour quand l'utilisateur change « Contrôlé »)
    syn.append(["Classe", "Notions", "Questions", "Leçons actives", "% notions actives", "Validées", "À corriger", "Vues", "% validé", "Questions à 1 forme", "Tests de qualité"])
    for c in syn[1]:
        c.font, c.fill = bold, head_fill
    for i, cl in enumerate(d["classes"], start=2):
        t = f"'{cl['name']}'!"
        notions = len(cl["rows"])
        actives = sum(1 for r in cl["rows"] if P[r["id"]]["active"])
        syn.append([cl["name"], notions, f"=COUNTA({t}C:C)-1", actives, f"=D{i}/B{i}",
                    f'=COUNTIF({t}P:P,"validé")', f'=COUNTIF({t}P:P,"à corriger")', f'=COUNTIF({t}P:P,"vu")', f"=F{i}/C{i}", f"=COUNTIF({t}H:H,1)", f'=COUNTIF({t}G:G,"✓ qualité*")&" / "&COUNTIF({t}D:D,"Test")'])
        syn[f"E{i}"].number_format = syn[f"I{i}"].number_format = "0%"
    syn.append([])
    syn.append([f"Commentaires des testeurs : {n_c}, dont {n_non} non traités (onglet Commentaires, lignes en jaune)."])
    syn.append([f"Chantiers du projet : {n_ch} (onglet Chantiers, source tools/chantiers.tsv)."])
    syn.append([f"Référentiel du Collège : {n_ref} compétences officielles, rattachement aux notions de l'app (onglet Référentiel Collège)."])
    syn.append([f"Élève-robot : {n_r} problème(s) dans le dernier rapport (onglet Robot ; nouveaux en jaune)."])
    syn.append(["Statuts « Contrôlé » : à faire → vu → à corriger → validé. Colonnes automatiques recalculées par tools/suivi.py ; Contrôlé et Remarque conservés."])
    for col, w in zip("ABCDEFGHIJK", [12, 9, 10, 14, 16, 9, 11, 7, 9, 18, 14]):
        syn.column_dimensions[col].width = w
    OUT.parent.mkdir(exist_ok=True)
    wb.save(OUT)
    tot = sum(1 for c, r in keep.values() if (c and c != "à faire") or r)
    print(f"{OUT.relative_to(ROOT)} : " + ", ".join(f"{c['name']} {len(c['rows'])} notions" for c in d["classes"]) + f" ; {tot} statuts ou remarques conservés ; commentaires : {n_c}, dont {n_non} non traités")


if __name__ == "__main__":
    main()
