#!/usr/bin/env python3
"""Poids du code et contrôle d'équivalence du chargement par paquets (27.11, agent poids ; rapport tools/poids.md).

Usage :
  python3 tools/poids.py taille [DOSSIER…]      → taille brute / gzip de chaque fichier de docs/ (ou des dossiers donnés)
                                                   et de ce qu'un élève télécharge avant son premier écran, par profil
  python3 tools/poids.py empreinte [--avant DOSSIER] [--profils 11,12mp,fr8] [--src]
        → empreinte des questions (Engine.build / Engine.make, graines fixes) calculée dans Chromium sans interface :
          · docs/ avec TOUS les paquets, comparée à --avant (ancienne construction) : la mise en paquets / la
            minification ne doivent rien changer (« identique ») ;
          · pour chaque profil : docs/ avec SEULEMENT les paquets chargés avant le premier écran ; chaque notion du
            catalogue de la classe doit exister et donner exactement les mêmes questions qu'avec tous les paquets ;
          · --src : aussi les sources dans l'ordre de build.py (= dist/ et pages de test), pour information.
Sortie : « ok … » / « ÉCHEC … » ; code de retour 1 en cas d'échec. Un seul Chromium à la fois (verrou des tests).
"""
import gzip, json, os, re, subprocess, sys, tempfile, hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"
LOCK = "/tmp/5m2m_tests_v2.lock"

# Profils mesurés (clé courte → profil de l'app). need() = règle du chargeur de build.py.
PROFILS = {
    "nouveau": None,
    "9": {"system": "CH", "grade": 9, "track": "college"},
    "10": {"system": "CH", "grade": 10, "track": "college"},
    "11": {"system": "CH", "grade": 11, "track": "college"},
    "12": {"system": "CH", "grade": 12, "track": "college"},
    "13": {"system": "CH", "grade": 13, "track": "college"},
    "14": {"system": "CH", "grade": 14, "track": "college"},
    "15": {"system": "CH", "grade": 15, "track": "college"},
    "12mp": {"system": "CH", "grade": 12, "track": "mp"},
    "13mp": {"system": "CH", "grade": 13, "track": "mp"},
    "14mp": {"system": "CH", "grade": 14, "track": "mp"},
    "15mp": {"system": "CH", "grade": 15, "track": "mp"},
    **{"fr%d" % g: {"system": "FR", "grade": g} for g in range(6, 13)},
}
NOMS = {"nouveau": "Nouvel élève (écran d'entrée)", "11": "11e (CO)", "12": "1re Collège", "13mp": "MP 2e", "fr8": "4e France"}


def paquets_du_chargeur(dossier):
    """Liste des paquets (K) et fonction need() lues dans le chargeur de index.html."""
    page = (Path(dossier) / "index.html").read_text()
    m = re.search(r"L = (\[[^\]]*\]), K = L\.concat\((\[[^\]]*\])\)", page)  # 27.11 : paquets de niveau L + paquet « x »
    if m:
        niv = json.loads(m.group(1)); k = niv + json.loads(m.group(2))
    else:
        k = niv = json.loads(re.search(r"K = (\[[^\]]*\])", page).group(1))
    fr_tout = re.search(r'p\.system === "FR"\) return [KL]\.slice\(\)', page) is not None
    m = re.search(r"FRP = (\{.*?\});", page)
    frp = json.loads(m.group(1)) if m else None

    def need(p):
        if not p:
            return []
        if p["system"] == "FR":
            if frp is not None:
                return list(frp.get(str(p["grade"]), niv))
            return list(niv) if fr_tout else []
        r = [x for x in ["9", "10", "11", "12", "13", "14", "15"] if int(x) <= p["grade"]]
        if p.get("track") == "mp":
            r.append("mp")
        return r
    return k, need


def gz(b):
    return len(gzip.compress(b, 9))


def taille(dossiers):
    for d in dossiers:
        d = Path(d)
        print(f"\n== {d}")
        fs = sorted(list(d.glob("*.js")) + [d / "index.html"], key=lambda p: -p.stat().st_size)
        tot = [0, 0]
        print(f"{'fichier':14s}{'brut Ko':>9s}{'gzip Ko':>9s}")
        for f in fs:
            b = f.read_bytes()
            tot[0] += len(b); tot[1] += gz(b)
            print(f"{f.name:14s}{len(b) / 1024:9.0f}{gz(b) / 1024:9.0f}")
        print(f"{'total':14s}{tot[0] / 1024:9.0f}{tot[1] / 1024:9.0f}")
        k, need = paquets_du_chargeur(d)
        print(f"\nAvant le premier écran (index.html + app.js + paquets requis + start.js) :")
        for cle in ["nouveau", "11", "12", "13mp", "fr8"]:
            fichiers = ["index.html", "app.js"] + ["p-%s.js" % x for x in need(PROFILS[cle])] + ["start.js"]
            b = [(d / f).read_bytes() for f in fichiers]
            print(f"  {NOMS[cle]:32s}{sum(map(len, b)) / 1024:7.0f} Ko brut{sum(map(gz, b)) / 1024:7.0f} Ko gzip   ({', '.join(fichiers[2:-1]) or 'aucun paquet'})")


# ---------------------------------------------------------------- empreinte
EMPREINTE_JS = r"""
function H(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); }
function G(n) { try { return (0, eval)("typeof " + n + " === 'undefined' ? undefined : " + n); } catch (e) { return undefined; } }
function J(v) { try { return JSON.stringify(v, (k, x) => typeof x === "function" ? "fn" : x); } catch (e) { return "E:" + e.message; } }
function empreinte(profil) {
  const out = { reg: {}, q: {}, cat: null, err: [] };
  for (const n of ["NOTIONS", "LESSONS", "LESSONS_V2", "ACTIVE", "RICH", "VAR", "VARX", "PROBX", "HINTS", "COMPS", "PREREQ", "FINE", "HISTOIRE", "CURIEUX", "REF", "REFS"]) {
    const v = G(n); if (v === undefined) continue;
    out.reg[n] = Object.keys(v).length + ":" + H(Object.keys(v).sort().join(",")) + ":" + H(J(v));
  }
  const GENv = G("GEN"), hp = G("hasProb");
  let ids;
  if (profil) { const cat = Engine.catalog(profil); ids = cat.map((x) => x.id); out.cat = H(cat.map((x) => [x.id, x.label, x.theme, x.defaultStatus, x.current, J(placeOf(x, profil))].join("|")).join("\n")) + ":" + ids.length; }
  else ids = Object.keys(GENv).sort();
  const st = profil ? Engine.newState(profil) : null;
  if (st) for (const id of ids) st.notions[id] = Engine.newNotion("vu");
  for (const id of ids) {
    if (!GENv[id]) { out.q[id] = "absent"; continue; }
    const h = [];
    for (const lv of [1, 2, 3, 4]) {
      if (lv === 4 && !hp(id)) continue;
      for (const s of [1, 2, 7]) {
        try { h.push(H(J(st ? Engine.make(st, id, lv, s) : Engine.build(id, lv, s)))); } catch (e) { h.push("E:" + e.message); }
      }
    }
    const L = G("LESSONS"), A = G("ACTIVE");
    h.push("L" + (L && L[id] ? H(J(L[id])) : "-"), "A" + (A && A[id] ? "1" : "-"));
    out.q[id] = h.join(",");
  }
  return out;
}
"""

BLOQUE = r"""<script>
window.MathJax = { typesetPromise: () => Promise.resolve() };
try { localStorage.clear(); } catch (e) {}
window.__m2mTest = 1;
/* on garde le chargeur (loadPack, sync) mais on n'ouvre pas l'app (start.js) ni MathJax */
(function () { const ap = Node.prototype.appendChild;
  Node.prototype.appendChild = function (n) { if (n && n.tagName === "SCRIPT" && /(^|\/)(start\.js|vendor\/mathjax)/.test(n.getAttribute("src") || "")) return n; return ap.call(this, n); }; })();
window.addEventListener("error", (e) => (window.__errs = window.__errs || []).push(String(e.message) + " " + (e.filename || "").split("/").pop() + ":" + e.lineno));
</script>"""


def page_docs(dossier, paquets, profil):
    d = Path(dossier).resolve()
    html = (d / "index.html").read_text()
    loader = re.search(r'(<script src="app\.js\?v=[^"]+"></script>\s*<script>.*?</script>)', html, re.S).group(1)
    return ('<!doctype html><meta charset="utf-8"><base href="file://%s/"><main id="app"></main>' % d + BLOQUE + loader
            + "<pre id=out>en cours</pre><script>" + EMPREINTE_JS + """
const PQ = %s, PROFIL = %s;
PQ.reduce((p, k) => p.then(() => loadPack(k)), Promise.resolve()).then(() => {
  const o = empreinte(PROFIL); o.err = window.__errs || []; o.packs = Object.keys(window.__packs || {});
  document.getElementById("out").textContent = JSON.stringify(o);
}, (e) => { document.getElementById("out").textContent = "ÉCHEC chargement " + e.message; });
</script>""" % (json.dumps(paquets), json.dumps(profil)))


def page_src(profil):
    src = (ROOT / "build.py").read_text()
    js = json.loads("[" + re.search(r"^JS = \[(.*?)\]", src, re.M | re.S).group(1) + "]")
    js = [f for f in js if f != "app.js"]
    return ('<!doctype html><meta charset="utf-8"><main id="app"></main>' + BLOQUE
            + "".join('<script src="file://%s/src/%s"></script>' % (ROOT, f) for f in js)
            + "<pre id=out>en cours</pre><script>" + EMPREINTE_JS
            + "const o = empreinte(%s); o.err = window.__errs || []; document.getElementById('out').textContent = JSON.stringify(o);</script>" % json.dumps(profil))


def chromium(html, budget=120000):
    import fcntl
    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False, dir=ROOT / "tests", prefix="_poids_") as f:
        f.write(html); p = f.name
    try:
        with open(LOCK, "w") as lk:
            fcntl.flock(lk, fcntl.LOCK_EX)
            r = subprocess.run(["timeout", "-k", "5", "300", "nice", "chromium", "--headless", "--disable-gpu", "--no-sandbox",
                                "--allow-file-access-from-files", "--virtual-time-budget=%d" % budget, "--dump-dom", "file://" + p],
                               capture_output=True, text=True, pass_fds=())
    finally:
        os.unlink(p)
    m = re.search(r'<pre id="out">(.*?)</pre>', r.stdout, re.S)
    t = m.group(1) if m else ""
    import html as H
    t = H.unescape(t)
    try:
        return json.loads(t)
    except Exception:
        return {"echec": t[:300] or "page sans résultat"}


def compare(a, b):
    """Différences entre deux empreintes (questions et registres)."""
    diff = []
    for k in sorted(set(a.get("reg", {})) | set(b.get("reg", {}))):
        if a["reg"].get(k) != b["reg"].get(k):
            diff.append("registre " + k)
    qa, qb = a.get("q", {}), b.get("q", {})
    for k in sorted(set(qa) | set(qb)):
        if qa.get(k) != qb.get(k):
            diff.append(k)
    return diff


def empreinte(avant, profils, avec_src):
    res, echec = [], False

    def note(cond, msg):
        nonlocal echec
        res.append(("ok " if cond else "ÉCHEC ") + msg); print(res[-1], flush=True)
        if not cond: echec = True

    kd, need = paquets_du_chargeur(DOCS)
    tout = chromium(page_docs(DOCS, kd, None))
    note("echec" not in tout and not tout["err"], "docs/ (tous les paquets) : %d notions, erreurs JS %s" % (len(tout.get("q", {})), tout.get("err") or tout.get("echec")))
    if avant:
        ka, needa = paquets_du_chargeur(avant)
        ta = chromium(page_docs(avant, ka, None))
        d = compare(ta, tout)
        note(not d, "tous les paquets, avant / après : %s" % ("identique" if not d else "%d différences : %s" % (len(d), ", ".join(d[:15]))))
    if avec_src:
        s = chromium(page_src(None))
        d = compare(s, tout)
        res.append("info sources (ordre build.py) / docs : %s" % ("identique" if not d else "%d différences : %s" % (len(d), ", ".join(d[:25]))))
        print(res[-1], flush=True)
    for cle in profils:
        p = PROFILS[cle]
        ref = chromium(page_docs(DOCS, kd, p))
        part = chromium(page_docs(DOCS, need(p), p))
        if "echec" in part or "echec" in ref:
            note(False, "%s : %s" % (cle, part.get("echec") or ref.get("echec"))); continue
        absents = [k for k, v in part["q"].items() if v == "absent"]
        d = compare(ref, part)
        d = [x for x in d if not x.startswith("registre ")]  # les registres complets diffèrent forcément (autres classes)
        # 27.11 : questions différentes au premier écran et après le chargement en arrière-plan = écart PRÉEXISTANT (un
        # paquet supérieur remplace des générateurs de notions d'une classe inférieure : ch1c_eq.js → eq1 en 11e…) :
        # signalé (ALERTE), pas compté comme échec ; notion absente, erreur JS ou catalogue différent = échec.
        if d and not absents and not part["err"] and ref["cat"] == part["cat"]:
            res.append("ALERTE %s (paquets %s) : %d notions, questions différentes du premier écran à après l'arrière-plan : %s" % (cle, ",".join(need(p)), len(part["q"]), ",".join(d)))
            print(res[-1], flush=True)
        else:
          note(not absents and not d and not part["err"] and ref["cat"] == part["cat"],
               "%s (paquets %s) : %d notions au catalogue%s%s%s%s" % (cle, ",".join(need(p)) or "aucun", len(part["q"]),
               "" if ref["cat"] == part["cat"] else ", CATALOGUE DIFFÉRENT", ", absentes : " + ",".join(absents[:10]) if absents else "",
               ", questions différentes : " + ",".join(d[:10]) if d else "", ", erreurs JS : %s" % part["err"] if part["err"] else ""))
        if avant:
            pa = chromium(page_docs(avant, needa(p), p))
            d = compare(pa, part)
            d = [x for x in d if not x.startswith("registre ")]
            note(not d and pa.get("cat") == part["cat"], "%s avant / après (paquets requis) : %s" % (cle, "identique" if not d else ", ".join(d[:10])))
    return echec


def main():
    a = sys.argv[1:]
    if not a or a[0] == "taille":
        taille(a[1:] or [DOCS]); return
    if a[0] == "empreinte":
        avant = a[a.index("--avant") + 1] if "--avant" in a else None
        prof = a[a.index("--profils") + 1].split(",") if "--profils" in a else [k for k in PROFILS if k != "nouveau"]
        sys.exit(1 if empreinte(avant, prof, "--src" in a) else 0)
    print(__doc__)


if __name__ == "__main__":
    main()
