#!/usr/bin/env python3
"""Assemble l'app en un seul fichier HTML.
dist/5min2maths.html : page pour un lien claude.ai (sans <html>/<head>, ajoutés à la publication)
dist/index.html      : document complet, prêt pour un hébergement statique (GitHub Pages, Netlify…)
"""
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "src"
JS = ["curriculum.js", "expr.js", "figures.js", "generators.js", "engine.js", "app.js"]

head = """<title>5minutes2mathsparjour</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="Chaque jour, quelques minutes de maths, à ton niveau.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=JetBrains+Mono:wght@400;600&display=swap">
<style>
""" + (SRC / "style.css").read_text() + """
</style>
<script>
window.MathJax = { tex: { inlineMath: [["\\\\(", "\\\\)"]] }, svg: { fontCache: "global" }, startup: { typeset: false } };
</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-svg.min.js"></script>
"""
body = '<main id="app" aria-live="polite"></main>\n<script>\n' + "\n".join((SRC / f).read_text() for f in JS) + "\n</script>\n"

(ROOT / "dist").mkdir(exist_ok=True)
(ROOT / "dist" / "5min2maths.html").write_text(head + body)
(ROOT / "dist" / "index.html").write_text(
    '<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
    + head + "</head>\n<body>\n" + body + "</body>\n</html>\n")
print("dist/5min2maths.html et dist/index.html :", round(len(head + body) / 1024), "Ko")
