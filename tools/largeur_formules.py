#!/usr/bin/env python3
"""Largeur réelle des formules (24.11) : rend énoncés et corrigés avec le vrai MathJax (CDN, réseau requis) dans
328 px utiles, après le découpage des longues égalités fait par l'app (splitLongMath), et liste ce qui dépasse.
Le robot (tests/bot.html) ne met pas les formules en forme : ce contrôle complète le sien. Lancé chaque nuit après le
robot (tools/bot_eleve.py) ; résultat dans suivi/robot/formules.txt.
Usage : python3 tools/largeur_formules.py [n tirages par niveau, défaut 3] [ids séparés par des virgules]
"""
import html, re, subprocess, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
n = sys.argv[1] if len(sys.argv) > 1 else "3"
ids = ("&ids=" + sys.argv[2]) if len(sys.argv) > 2 else ""
url = f"file://{ROOT}/tests/_mathjax_largeur.html#n={n}{ids}"
dom = subprocess.run(["timeout", "-k", "5", "900", "chromium", "--headless", "--disable-gpu", "--no-sandbox", "--virtual-time-budget=880000", "--dump-dom", url],
                     capture_output=True, text=True).stdout
m = re.search(r'<pre id="log">(.*?)</pre>', dom, re.S)
out = html.unescape(m.group(1)).strip() if m else "pas de résultat (page bloquée ou réseau absent)"
(ROOT / "suivi" / "robot").mkdir(parents=True, exist_ok=True)
(ROOT / "suivi" / "robot" / "formules.txt").write_text(out + "\n")
lignes = [l for l in out.splitlines() if l.strip()]
print("Formules trop larges : " + ("aucune" if lignes == ["aucune formule trop large"] else str(len(lignes))))
