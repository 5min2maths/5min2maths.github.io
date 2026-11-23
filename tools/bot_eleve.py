#!/usr/bin/env python3
"""Élève-robot de 5min2maths (22.11) : joue l'app dans Chromium sans interface (tests/bot.html) et enregistre ce qu'il trouve.

- Séances réelles par classe (9e … MP 2e) et balayage de chaque notion à chaque niveau : voir tests/bot.html.
- Rapport : suivi/robot/rapport_AAAA-MM-JJ.json (complet) et suivi/robot/dernier.json (le plus récent),
  plus une ligne de résumé dans suivi/robot/resume.txt (lue par le point du matin) ; l'onglet « Robot » du suivi
  (tools/suivi.py) liste les problèmes, nouveaux ou déjà vus.
- Lancé chaque nuit par cron (03h30), puis tools/suivi.py ; rattrapage chaque heure de 7h à 20h (--si-absent) si l'ordinateur était éteint. À la main : python3 tools/bot_eleve.py [--rapide] [--classes 9e,10e]
"""
import datetime, html, json, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "suivi" / "robot"


def run(rapide=False, classes=None):
    h = "#" + "&".join(x for x in [("rapide" if rapide else ""), ("classes=" + classes if classes else "")] if x)
    url = "file://" + str(ROOT / "tests" / "bot.html") + (h if h != "#" else "")
    dom = subprocess.run(["chromium", "--headless", "--disable-gpu", "--no-sandbox", "--virtual-time-budget=1500000", "--dump-dom", url],
                         capture_output=True, text=True, timeout=3000).stdout
    m = re.findall(r'<pre id="out">(.*?)</pre>', dom, re.S)
    if not m or not m[-1].strip():
        raise SystemExit("robot : pas de résultat (page bloquée ?)")
    return json.loads(html.unescape(m[-1]))


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
    (OUT / "resume.txt").write_text(resume + "\n")
    print(resume)


if __name__ == "__main__":
    main()
