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
if not {"APP_NAME", "APP_SPOKEN", "APP_TAGLINE", "APP_SHORT", "APP_TITLE"} <= set(APP):  # 27.11 : APP_SPOKEN « Pépite au carré »
    bad.append("constantes APP_NAME, APP_SPOKEN, APP_TAGLINE, APP_SHORT, APP_TITLE absentes de src/curriculum.js")
# 27.11 : ancien nom (« 5 minutes de maths », « 5 min maths ») et nouveau nom / slogan (« Pépite² », « Deviens une pépite »)
PAT = re.compile(r"5\s*min(?:utes)?\s*(?:de\s*|2\s*)?maths|Pépite²|Pépite au carré|Deviens (?:carrément )?une pépite", re.I)  # 28.11 : variante « carrément »
for f in sorted(SRC.rglob("*")):
    if f.suffix not in (".js", ".css", ".html"):
        continue
    for i, line in enumerate(f.read_text(errors="replace").splitlines(), 1):
        if f.name == "curriculum.js" and re.match(r'^(const APP_[A-Z_]+ = "|/\* )', line):  # 28.11 : APP_[A-Z_] pour APP_TAGLINE_FUN
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
# 27.11 : nom dit (« Pépite au carré ») : nom accessible de l'en-tête, ligne de l'écran d'entrée, Réglages « À propos ».
if "APP_SPOKEN" not in re.search(r"^const brand = .*$", app, re.M).group(0):
    bad.append("src/app.js : l'en-tête (brand) n'a pas le nom accessible APP_SPOKEN")
if app.count("se dit <i>${APP_SPOKEN}</i>") < 2:
    bad.append("src/app.js : « se dit Pépite au carré » absent de l'écran d'entrée ou des Réglages")
# 27.11 : logo dans l'en-tête, icônes et favicon publiés.
if "LOGO_MARK" not in re.search(r"^const brand = .*$", app, re.M).group(0):
    bad.append("src/app.js : l'en-tête (brand) n'affiche pas le logo (LOGO_MARK)")
for f in ("icon-192.png", "icon-512.png", "icon-maskable-192.png", "icon-maskable-512.png", "apple-touch-icon.png", "favicon-32.png", "favicon.svg"):
    if not (SRC / "pwa" / f).exists() or f not in b:
        bad.append(f"src/pwa/{f} absent ou non copié par build.py")
print(("ÉCHEC " + " | ".join(bad[:20])) if bad else "ok nom de l'app centralisé (" + APP.get("APP_NAME", "?") + ")")
sys.exit(1 if bad else 0)
