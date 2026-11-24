#!/usr/bin/env python3
"""Galerie des figures (24.11, chantier Q) : toutes les figures de l'app dans un seul fichier HTML autonome.

Lance tests/_galerie.html dans Chromium sans interface (un seul navigateur, --dump-dom, délai limité) et écrit
suivi/galerie/galerie_AAAA-MM-JJ.html : SVG inline, feuille de style de l'app incluse, ouvrable hors ligne dans un
navigateur d'ordinateur (double-clic). En tête : sommaire par classe et chapitre ; chaque carte = figure à la taille
téléphone, code de la question (reproductible dans l'app : …/#q-<code>), énoncé en petit.
Les figures signalées par le robot (suivi/robot/dernier.json, problèmes « figure… ») sont encadrées en rouge avec le
motif, et regroupées en tête. Appelé à la fin de tools/bot_eleve.py (routine de nuit) ; à la main :
python3 tools/galerie.py [--n 1] [--seed 20261124]
"""
import datetime, html, json, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGE = ROOT / "tests" / "_galerie.html"
OUT = ROOT / "suivi" / "galerie"
LIMITE_MO = 15


def sync_scripts():
    """Garde la liste des scripts de la page alignée sur build.py (ordre de chargement de l'app)."""
    js = eval(re.search(r"^JS = (\[.*\])", (ROOT / "build.py").read_text(), re.M).group(1))
    tags = "".join(f'<script src="../src/{f}"></script>' for f in js)
    s = PAGE.read_text()
    s2 = re.sub(r'(<script src="\.\./src/[^"]+"></script>)+', lambda m: tags, s, count=1)
    if s2 != s:
        PAGE.write_text(s2)


def problemes_figures():
    f = ROOT / "suivi" / "robot" / "dernier.json"
    if not f.exists():
        return {}
    d = json.loads(f.read_text())
    out = {}
    for p in d.get("problemes", []):
        if p.get("type", "").startswith("figure") and p.get("code"):
            out.setdefault(p["code"], []).append(f'{p["type"]} ({p.get("classe", "")}) : {p.get("detail", "")}')
    return out


def dump(n, seed, codes, limite=300):
    url = f"file://{PAGE}#seed={seed}&n={n}&codes={','.join(c for c in codes if re.fullmatch(r'[a-z0-9]+-[1-4]-[a-z0-9]+', c))}"
    try:
        r = subprocess.run(["timeout", "-k", "5", str(limite), "chromium", "--headless", "--disable-gpu", "--no-sandbox", "--window-size=1200,900",
                            "--virtual-time-budget=600000", "--dump-dom", url], capture_output=True, text=True, timeout=limite + 30)
    except subprocess.TimeoutExpired:
        return None
    return r.stdout


def build(n, seed, flags):
    dom = dump(n, seed, list(flags))
    if not dom:
        raise SystemExit("galerie : Chromium n'a rien rendu (délai dépassé ?)")
    m = re.search(r'<main id="gal">(.*)</main>', dom, re.S)
    o = re.search(r'<pre id="out"[^>]*>(.*?)</pre>', dom, re.S)
    if not m or not o or not o.group(1).strip():
        raise SystemExit("galerie : page incomplète")
    info = json.loads(html.unescape(o.group(1)))
    gal = m.group(1)
    marques = 0

    def marque(mt):
        nonlocal marques
        code = html.unescape(mt.group(1))
        if code not in flags:
            return mt.group(0)
        marques += 1
        motif = "<br>".join(html.escape(x) for x in flags[code])
        return f'<div class="gcard bad" data-code="{mt.group(1)}"><div class="motif">⚠ Robot : {motif}</div>'
    # Code de question sans figure à lui (ex. étiquette du rappel de cours ouvert pendant la question) : on marque la leçon.
    presents = set(html.unescape(c) for c in re.findall(r'<div class="gcard" data-code="([^"]*)">', gal))
    for code in [c for c in flags if c not in presents]:
        cle = "lecon-" + code.split("-")[0]
        flags.setdefault(cle, []).extend(f"{x} — pendant la question {code}" for x in flags[code])
    gal = re.sub(r'<div class="gcard" data-code="([^"]*)">', marque, gal)
    css = (ROOT / "src" / "style.css").read_text()
    galcss = re.search(r'<style id="galcss">(.*?)</style>', PAGE.read_text(), re.S).group(1)
    titre = f"Galerie des figures — {datetime.date.today().strftime('%d.%m.%Y')}"
    doc = (f'<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
           f"<title>{titre}</title><style>{css}</style><style>{galcss}</style></head><body><main id=\"gal\">{gal}</main></body></html>")
    return doc, info, marques


def main():
    a = sys.argv
    n = int(a[a.index("--n") + 1]) if "--n" in a else 2
    seed = a[a.index("--seed") + 1] if "--seed" in a else datetime.date.today().strftime("%Y%m%d")
    sync_scripts()
    flags = problemes_figures()
    doc, info, marques = build(n, seed, dict(flags))
    if len(doc.encode()) > LIMITE_MO * 1e6 and n > 1:
        n = 1
        doc, info, marques = build(n, seed, dict(flags))
    OUT.mkdir(parents=True, exist_ok=True)
    f = OUT / f"galerie_{datetime.date.today().isoformat()}.html"
    f.write_text(doc)
    mo = len(doc.encode()) / 1e6
    print(f"Galerie : {info['total']} figures ({info['questions']} questions, {info['lecons']} leçons, {info['autres']} autres), "
          f"{n} tirage(s) par niveau, {marques} marquée(s) par le robot, {mo:.1f} Mo → {f}")
    if info.get("erreurs"):
        print(f"  {len(info['erreurs'])} erreur(s) : " + " ; ".join(info["erreurs"][:5]))


if __name__ == "__main__":
    main()
