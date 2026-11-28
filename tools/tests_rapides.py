#!/usr/bin/env python3
"""Liste des pages du niveau RAPIDE des tests (27.11, tests à deux niveaux ; doc tools/tests.md).

Lit tools/tests_rapides.txt et ajoute les pages touchées par les changements non publiés et les échecs de la dernière
suite de nuit. Sortie (lue par tools/run_tests.sh --rapide) : une ligne par page (« nom » ou « nom#params »), puis
« ORDRE N » s'il est demandé. Sur stderr : d'où vient chaque page ajoutée (pour le journal de publication).
Usage : python3 tools/tests_rapides.py [--base origin/master]
"""
import re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TESTS = ROOT / "tests"
NUIT = Path("/home/jj/Projets/5min2maths/suivi/tests_nuit/dernier.txt")
EXCLUS = {"bot", "eleves"}  # trop lourdes, à part (comme dans run_tests.sh)


def git(*a):
    r = subprocess.run(["git", "-C", str(ROOT), *a], capture_output=True, text=True)
    return [l for l in r.stdout.splitlines() if l.strip()] if r.returncode == 0 else []


def page_ok(nom):
    base = nom.split("#")[0]
    return base not in EXCLUS and not base.startswith("_") and (TESTS / (base + ".html")).exists()


def sections():
    """28.11 (pages par thème, tests/lot.js) : {nom de section: page} — une section porte le nom de l'ancienne page."""
    idx = {}
    for t in sorted(TESTS.glob("*.html")):
        if t.stem.startswith("_"):
            continue
        for nom in re.findall(r'Lot\.section\("([\w-]+)"', t.read_text(errors="ignore")):
            idx.setdefault(nom, t.stem)
    return idx


def main():
    base = sys.argv[sys.argv.index("--base") + 1] if "--base" in sys.argv else "origin/master"
    pages, ordre, corresp = [], None, {}
    for l in (ROOT / "tools/tests_rapides.txt").read_text().splitlines():
        l = l.strip()
        if not l or l.startswith("#"):
            continue
        if l.startswith("ORDRE"):
            ordre = int(l.split()[1]); continue
        if "->" in l:
            k, v = l.split("->", 1); corresp[k.strip()] = v.split(); continue
        pages.append(l)
    vus = set(pages)   # 28.11 : noms complets (recalcul#part=1&n=3 et recalcul#part=3&n=3 sont deux lancements)

    SEC = sections(); parts = {}   # page de thème → sections demandées (seulement celles-là : page#section=a,b)

    def ajoute(nom, pourquoi):
        b = nom.split("#")[0]
        if nom in vus or b in vus or not page_ok(nom):   # déjà là, ou page déjà lancée en entier
            return
        vus.add(nom); pages.append(nom); print("  + %s (%s)" % (nom, pourquoi), file=sys.stderr)

    def ajoute_section(sec, pourquoi):
        page = SEC[sec]
        if page in vus or not page_ok(page):
            return
        if sec not in parts.setdefault(page, []):
            parts[page].append(sec); print("  + %s#section=%s (%s)" % (page, sec, pourquoi), file=sys.stderr)

    # changements non publiés : commits, fichiers modifiés et fichiers nouveaux non suivis
    ch = set(git("diff", base, "--name-only", "--diff-filter=d")) | set(git("ls-files", "--others", "--exclude-standard", "src", "tests", "build.py"))
    for f in sorted(ch):
        p = Path(f)
        if f.startswith("tests/") and p.suffix == ".html":
            ajoute(p.stem, "page modifiée")
        elif f.startswith("tests/") and p.suffix == ".js":
            for t in sorted(TESTS.glob("*.html")):
                if re.search(r'src="%s"' % re.escape(p.name), t.read_text(errors="ignore")):
                    ajoute(t.stem, "charge " + f)
        if f.startswith("src/") and p.suffix == ".js":
            for t in sorted(TESTS.glob("*.html")):
                if re.fullmatch(re.escape(p.stem) + r"(_.*|\d+)?", t.stem):
                    ajoute(t.stem, "teste " + f)
            for sec in sorted(SEC):   # même règle du nom, appliquée aux sections des pages de thème
                if re.fullmatch(re.escape(p.stem) + r"(_.*|\d+)?", sec):
                    ajoute_section(sec, "teste " + f)
        for nom in corresp.get(f, []):
            if nom in SEC and not page_ok(nom):
                ajoute_section(nom, "lié à " + f)
            else:
                ajoute(nom, "lié à " + f)
    # échecs de la dernière nuit : « N ÉCHEC(S) : page1, page2 … »
    try:
        t = NUIT.read_text()
        if "ÉCHEC" in t:
            for nom in re.findall(r"[A-Za-z0-9_]+", t.split(":", 1)[-1]):
                ajoute(nom, "en échec la nuit dernière")
    except OSError:
        pass
    for page, secs in parts.items():
        if page not in vus:   # page demandée en entier par ailleurs : elle l'emporte
            pages.append("%s#section=%s" % (page, ",".join(secs)))
    print("\n".join(pages))
    if ordre:
        print("ORDRE %d" % ordre)


if __name__ == "__main__":
    main()
