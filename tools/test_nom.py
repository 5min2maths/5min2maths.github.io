#!/usr/bin/env python3
"""Nom de l'app centralisé (26.11) : aucun « 5 minutes de maths » (ni « 5 min maths ») écrit en dur dans src/ hors des
constantes APP_* de src/curriculum.js ; build.py reporte le nom dans le titre et le manifeste (docs/).
Lancé par tools/run_tests.sh ; sortie « ok … » ou « ÉCHEC … »."""
import re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
cur = (SRC / "curriculum.js").read_text()
APP = dict(re.findall(r'^const (APP_[A-Z]+) = "([^"]*)";', cur, re.M))
bad = []
if not {"APP_NAME", "APP_TAGLINE", "APP_SHORT", "APP_TITLE"} <= set(APP):
    bad.append("constantes APP_NAME, APP_TAGLINE, APP_SHORT, APP_TITLE absentes de src/curriculum.js")
PAT = re.compile(r"5\s*min(?:utes)?\s*(?:de\s*|2\s*)?maths", re.I)
for f in sorted(SRC.rglob("*")):
    if f.suffix not in (".js", ".css", ".html"):
        continue
    for i, line in enumerate(f.read_text(errors="replace").splitlines(), 1):
        if f.name == "curriculum.js" and re.match(r'^const APP_[A-Z]+ = "', line):
            continue
        if PAT.search(line):
            bad.append(f"{f.relative_to(ROOT)}:{i} : {PAT.search(line).group(0)!r} écrit en dur")
# Les textes de l'app utilisent bien la constante.
app = (SRC / "app.js").read_text()
if "APP_NAME" not in re.search(r"^const brand = .*$", app, re.M).group(0):
    bad.append("src/app.js : l'en-tête (brand) n'utilise pas APP_NAME")
b = (ROOT / "build.py").read_text()
if 'APP["APP_TITLE"]' not in b or 'MAN["name"]' not in b:
    bad.append("build.py : titre ou manifeste sans les constantes APP_*")
print(("ÉCHEC " + " | ".join(bad[:20])) if bad else "ok nom de l'app centralisé (" + APP.get("APP_NAME", "?") + ")")
sys.exit(1 if bad else 0)
