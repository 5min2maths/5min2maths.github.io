#!/usr/bin/env python3
"""Élève-robot de 5min2maths (22.11) : joue l'app dans Chromium sans interface (tests/bot.html) et enregistre ce qu'il trouve.

- Séances réelles par classe (9e … MP 2e) et balayage de chaque notion à chaque niveau : voir tests/bot.html.
- Rapport : suivi/robot/rapport_AAAA-MM-JJ.json (complet) et suivi/robot/dernier.json (le plus récent),
  plus une ligne de résumé dans suivi/robot/resume.txt (lue par le point du matin) ; l'onglet « Robot » du suivi
  (tools/suivi.py) liste les problèmes, nouveaux ou déjà vus.
- Lancé chaque nuit par cron (03h30), puis tools/suivi.py ; rattrapage chaque heure de 7h à 20h (--si-absent) si l'ordinateur était éteint. Une page Chromium par classe (23.11). À la main : python3 tools/bot_eleve.py [--rapide] [--classes 9e,10e]
"""
import datetime, html, json, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "suivi" / "robot"


CLASSES = ["9e", "10e", "11e", "1re", "2e", "MP 1re", "MP 2e"]


def run_page(rapide, classe, limite):
    h = "#" + "&".join(x for x in [("rapide" if rapide else ""), "classes=" + classe.replace(" ", "%20")] if x)
    url = "file://" + str(ROOT / "tests" / "bot.html") + h
    try:
        dom = subprocess.run(["timeout", "-k", "5", str(limite), "chromium", "--headless", "--disable-gpu", "--no-sandbox",  "--window-size=360,780",  # 24.11 : vraie fenêtre de téléphone (règles CSS « max-width »)
                              
                              "--virtual-time-budget=1500000", "--dump-dom", url],
                             capture_output=True, text=True, timeout=limite + 30).stdout
    except subprocess.TimeoutExpired:
        return None
    m = re.findall(r'<pre id="out">(.*?)</pre>', dom, re.S)
    return json.loads(html.unescape(m[-1])) if m and m[-1].strip() else None


def run(rapide=False, classes=None):
    # 23.11 : une page Chromium par classe (tout dans une seule page dépassait 50 min et tout était perdu à la coupure).
    # Limite de 5 min par classe ; si la version complète n'aboutit pas, on refait la classe en mode rapide ;
    # si même le mode rapide échoue, la classe est signalée comme bloquée et les autres sont gardées.
    d = {"date": datetime.datetime.now().isoformat(timespec="seconds"), "secondes": 0, "stats": {}, "types": {}, "problemes": []}
    for c in (classes.split(",") if classes else CLASSES):
        r = run_page(rapide, c, 300) or (None if rapide else run_page(True, c, 120))
        if not r:
            d["problemes"].append({"type": "robot bloqué", "classe": c, "code": "", "detail": "la page de la classe n'a pas abouti (5 min, puis 2 min en mode rapide)", "ou": "robot"})
            continue
        d["secondes"] += r["secondes"]
        d["stats"].update(r["stats"])
        d["problemes"] += r["problemes"]
    for p in d["problemes"]:
        d["types"][p["type"]] = d["types"].get(p["type"], 0) + 1
    if not d["stats"]:
        raise SystemExit("robot : aucune classe n'a abouti")
    return d


def main():
    # --si-absent (22.11) : rattrapage dans la journée si l'ordinateur était éteint à 3h30.
    if "--si-absent" in sys.argv and (OUT / f"rapport_{datetime.date.today().isoformat()}.json").exists():
        return
    rapide = "--rapide" in sys.argv
    classes = sys.argv[sys.argv.index("--classes") + 1] if "--classes" in sys.argv else None
    d = run(rapide, classes)
    OUT.mkdir(parents=True, exist_ok=True)
    jour = datetime.date.today().isoformat()
    prev = json.loads((OUT / "dernier.json").read_text()) if (OUT / "dernier.json").exists() else {"problemes": []}
    vus = {(p["type"], p["code"], p["classe"]) for p in prev.get("problemes", [])}
    for p in d["problemes"]:
        p["nouveau"] = (p["type"], p["code"], p["classe"]) not in vus
    (OUT / f"rapport_{jour}.json").write_text(json.dumps(d, ensure_ascii=False, indent=1))
    (OUT / "dernier.json").write_text(json.dumps(d, ensure_ascii=False, indent=1))
    n, nouv = len(d["problemes"]), sum(1 for p in d["problemes"] if p["nouveau"])
    q = sum(s["questions"] + s["balayage"] for s in d["stats"].values())
    types = ", ".join(f"{k} {v}" for k, v in sorted(d["types"].items(), key=lambda kv: -kv[1])[:4])
    resume = f"Robot {jour[8:10]}.{jour[5:7]} : {q} questions jouées, {n} problème{'s' if n > 1 else ''} ({nouv} nouveau{'x' if nouv > 1 else ''})" + (f" — {types}" if types else "")
    nv = sum(s.get("nonverif", 0) for s in d["stats"].values())  # 24.11 : réponses approchées (forme exacte exigée), non vérifiables
    if nv:
        resume += f" · {nv} réponses exactes non vérifiées"
    (OUT / "resume.txt").write_text(resume + "\n")
    print(resume)
    # Galerie des figures (24.11, chantier Q) : suivi/galerie/galerie_AAAA-MM-JJ.html, figures signalées par le robot
    # encadrées en rouge. Jamais bloquant pour le robot.
    try:
        subprocess.run([sys.executable, str(ROOT / "tools" / "galerie.py")], timeout=420)
    except Exception as e:
        print(f"galerie : non générée ({e})")
    # Largeur réelle des formules (24.11) : le robot ne met pas les formules en forme ; vrai MathJax, 328 px utiles.
    try:
        subprocess.run([sys.executable, str(ROOT / "tools" / "largeur_formules.py"), "2"], timeout=960)
    except Exception as e:
        print(f"formules : non contrôlées ({e})")


if __name__ == "__main__":
    main()
