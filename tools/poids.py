#!/usr/bin/env python3
"""Poids du code publié et contrôle d'ordre (27.11, agents poids et ordre ; rapport tools/poids.md).

Usage :
  python3 tools/poids.py taille [DOSSIER…]   → taille brute / gzip de chaque fichier de docs/ (ou des dossiers donnés)
                                               et de ce qu'un élève télécharge avant son premier écran, par classe
  python3 tools/poids.py ordre [--profils 11,12mp,fr8] [--dossier DOCS] [--rapide N]   (alias : empreinte)
        --rapide N (27.11, niveau rapide de tools/publier.sh) : toutes les classes, premier écran seulement (ni « tout le
          code », ni après le paquet x), empreinte des questions sur une notion sur N (catalogue et registres complets).
        → contrôle de la suite (tools/run_tests.sh) : pour chaque classe, la version publiée chargée par son vrai
          chargeur exécute exactement les segments de la classe, dans l'ordre des sources, tous avant le lancement de
          l'app et rien après (sauf le paquet « x » à la demande) ; empreinte (Engine.make à graines fixes, niveaux 1–4,
          leçons, catalogue, registres restreints à la classe) identique à celle des sources dans l'ordre de build.py
          (= dist/ et pages de test), au premier écran et après le paquet x ; tout le code (liens #q-…) = sources,
          registres complets compris ; nouvel élève : code commun seul.
Sortie : « ok … » / « ÉCHEC … » ; code de retour 1 en cas d'échec. Un seul Chromium à la fois (verrou des tests ;
M2M_VERROU_TENU=1 quand l'appelant le tient déjà).
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


def chargeur(dossier):
    """Segments du chargeur de index.html (27.11, agent ordre) : S (noms), C (segments de chaque classe), X (paquet x),
    U (code commun, nouvel élève). Ancienne construction (app.js + p-*.js) : None."""
    page = (Path(dossier) / "index.html").read_text()
    m = re.search(r'var V = "[^"]*", S = (\[.*?\]), C = (\{.*?\}), X = (\[.*?\]), U = (\[.*?\]),', page)
    if not m:
        return None
    return {"S": json.loads(m.group(1)), "C": json.loads(m.group(2)), "X": json.loads(m.group(3)), "U": json.loads(m.group(4))}


def cle(p):
    """Même règle que cle() du chargeur."""
    if not p:
        return None
    if p["system"] == "FR":
        return "FR"
    return str(p["grade"]) + ("mp" if p.get("track") == "mp" and p["grade"] >= 12 else "")


def premier(ch, p):
    """Fichiers téléchargés avant le premier écran pour le profil p."""
    L = ch["C"].get(cle(p)) if p else ch["U"]
    if L is None:
        L = list(range(len(ch["S"])))
    return ["index.html"] + [ch["S"][i] for i in L] + ["start.js"]


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
        ch = chargeur(d)
        if ch is None:
            print("(ancienne construction : app.js + paquets p-*.js)"); continue
        print(f"\nAvant le premier écran (index.html + segments de la classe + start.js) :")
        for k in PROFILS:
            fichiers = premier(ch, PROFILS[k])
            b = [(d / f).read_bytes() for f in fichiers]
            print(f"  {NOMS.get(k, k):32s}{sum(map(len, b)) / 1024:7.0f} Ko brut{sum(map(gz, b)) / 1024:7.0f} Ko gzip   ({len(fichiers) - 2} segments)")


# ---------------------------------------------------------------- empreinte
EMPREINTE_JS = r"""
function H(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); }
function G(n) { try { return (0, eval)("typeof " + n + " === 'undefined' ? undefined : " + n); } catch (e) { return undefined; } }
function J(v) { try { return JSON.stringify(v, (k, x) => typeof x === "function" ? "fn" : x); } catch (e) { return "E:" + e.message; } }
function empreinte(profil, pas) {
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
  /* 27.11 (tests à deux niveaux) : niveau rapide = une notion sur `pas` (même échantillon des deux côtés) */
  const qids = pas > 1 ? ids.filter((_, i) => i % pas === 0) : ids;
  for (const id of qids) {
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
  /* 27.11 (agent ordre) : registres restreints aux notions de la classe (leçons, défis, séries riches, indices…) ; les
     fonctions comptent pour "fn" (leur texte change avec la minification de docs/). */
  if (profil) { const S = new Set(ids); out.regc = {};
    for (const n of ["NOTIONS", "LESSONS", "LESSONS_V2", "ACTIVE", "RICH", "VAR", "VARX", "PROBX", "HINTS", "PREREQ", "GEN", "PROB"]) {
      const v = G(n); if (v === undefined || v === null) continue;
      /* NOTIONS : pour une classe suisse, sans les champs propres à la France (FR, againFR, labelFR : lus seulement pour
         un profil France, src/engine.js) ; les fichiers fr_* les posent aussi sur les notions suisses. */
      if (Array.isArray(v)) out.regc[n] = H(J(v.filter((x) => x && S.has(x.id)).map((x) => profil.system === "FR" ? x : Object.fromEntries(Object.entries(x).filter(([k]) => !["FR", "againFR", "labelFR"].includes(k))))));
      else out.regc[n] = H(Object.keys(v).filter((k) => S.has(k)).sort().map((k) => k + "=" + J(v[k])).join("\n"));
    } }
  return out;
}
"""

BLOQUE = r"""<script>
window.MathJax = { typesetPromise: () => Promise.resolve() };
window.__m2mTest = 1;
/* on garde le chargeur, mais on n'ouvre pas l'app (start.js) ni MathJax ; on note les segments exécutés au moment où
   le chargeur lance l'app (window.__startAt) */
(function () { const ap = Node.prototype.appendChild;
  Node.prototype.appendChild = function (n) { const src = n && n.tagName === "SCRIPT" ? n.getAttribute("src") || "" : "";
    if (/(^|\/)start\.js/.test(src)) { window.__startAt = (window.__segs || []).slice(); return n; }
    if (/vendor\/mathjax/.test(src)) return n;
    return ap.call(this, n); }; })();
window.addEventListener("error", (e) => (window.__errs = window.__errs || []).push(String(e.message) + " " + (e.filename || "").split("/").pop() + ":" + e.lineno));
</script>"""


def page_docs(dossier, profil, tout=False, apres_x=False, pas=1):
    """docs/ chargé par son vrai chargeur pour un élève de profil `profil` (ou tout le code : tout=True, comme un lien
    #q-…) ; empreinte au moment où l'app démarrerait, ou (apres_x) après le paquet « x » ajouté à la demande. Une
    empreinte par page : des générateurs gardent une mémoire (anti-répétition), une 2e empreinte dans la même page
    diffère."""
    d = Path(dossier).resolve()
    html = (d / "index.html").read_text()
    loader = re.search(r'(<script>\s*\(function \(\) \{\s*// Chargement dans l.ordre des sources.*?</script>)', html, re.S).group(1)
    pre = ("<script>try { localStorage.clear(); sessionStorage.clear(); %s %s } catch (e) {}</script>"
           % ("localStorage.setItem('5m2m.v1', JSON.stringify({ profile: %s }));" % json.dumps(profil) if profil else "",
              "sessionStorage.setItem('m2m-ordre', '{\"tout\":1}');" if tout else ""))
    return ('<!doctype html><meta charset="utf-8"><base href="file://%s/"><main id="app"></main>' % d + pre + BLOQUE + loader
            + "<pre id=out>en cours</pre><script>" + EMPREINTE_JS + """
const __P = %s, __X = %s, __PAS = %d, __t0 = Date.now();
const __fin = (o) => { document.getElementById("out").textContent = JSON.stringify(o); };
(function __attend() {
  if (!window.__startAt) { if (Date.now() - __t0 > 60000) return __fin({ echec: "le chargeur n'a pas lancé l'app : " + ((document.getElementById("app") || {}).textContent || "").slice(0, 80) }); return setTimeout(__attend, 20); }
  const startAt = window.__startAt;
  setTimeout(() => { /* rien d'autre ne s'exécute après le lancement de l'app (plus de paquets en arrière-plan) */
    const apres = window.__segs.slice();
    (__X ? window.loadPack("x") : Promise.resolve()).then(() => { const o = empreinte(__P, __PAS); o.startAt = startAt; o.apres = apres; o.mode = window.__m2mMode(); o.x = window.__segs.slice();
      o.err = window.__errs || []; __fin(o); }, (e) => __fin({ echec: "paquet x : " + e.message }));
  }, 3000);
})();
</script>""" % (json.dumps(profil), json.dumps(apres_x), pas))


def page_src(profil, pas=1):
    """Sources dans l'ordre de build.py (= dist/ et pages de test) : empreinte du profil (None = tout), page neuve."""
    src = (ROOT / "build.py").read_text()
    js = json.loads("[" + re.search(r"^JS = \[(.*?)\]", src, re.M | re.S).group(1) + "]")
    js = [f for f in js if f != "app.js"]
    return ('<!doctype html><meta charset="utf-8"><main id="app"></main><script>try { localStorage.clear(); } catch (e) {}</script>' + BLOQUE
            + "".join('<script src="file://%s/src/%s"></script>' % (ROOT, f) for f in js)
            + "<pre id=out>en cours</pre><script>" + EMPREINTE_JS
            + "const __o = empreinte(%s, %d); __o.err = window.__errs || []; document.getElementById('out').textContent = JSON.stringify(__o);</script>" % (json.dumps(profil), pas))


def chromium(html, budget=120000):
    import fcntl
    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False, dir=ROOT / "tests", prefix="_poids_") as f:
        f.write(html); p = f.name
    try:
        with open(LOCK, "w") as lk:
            if not os.environ.get("M2M_VERROU_TENU"):  # dans tools/run_tests.sh, le verrou est déjà tenu par la série
                fcntl.flock(lk, fcntl.LOCK_EX)
            r = subprocess.run(["timeout", "-k", "5", "400", "nice", "chromium", "--headless", "--disable-gpu", "--no-sandbox",
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


def compare(a, b, registres=True):
    """Différences entre deux empreintes : questions, leçons, catalogue, registres restreints à la classe (regc) et,
    si registres, registres complets."""
    diff = []
    if registres:
        for k in sorted(set(a.get("reg", {})) | set(b.get("reg", {}))):
            if a["reg"].get(k) != b["reg"].get(k):
                diff.append("registre " + k)
    for k in sorted(set(a.get("regc") or {}) | set(b.get("regc") or {})):
        if (a.get("regc") or {}).get(k) != (b.get("regc") or {}).get(k):
            diff.append("registre de la classe " + k)
    if a.get("cat") != b.get("cat"):
        diff.append("catalogue")
    qa, qb = a.get("q", {}), b.get("q", {})
    for k in sorted(set(qa) | set(qb)):
        if qa.get(k) != qb.get(k):
            diff.append(k)
    return diff


def ordre(profils, dossier=DOCS, pas=1):
    """Contrôle de la suite (27.11, agent ordre) : pour chaque classe, la version publiée (dossier) exécute exactement les
    segments de la classe, dans l'ordre des sources, tous avant le lancement de l'app, rien après (sauf le paquet x à la
    demande), et donne la même empreinte que les sources (questions, leçons, catalogue, registres de la classe), au
    premier écran comme après le paquet x ; tout le code (liens #q-…) = les sources, registres complets compris."""
    res, echec = [], False

    def note(cond, msg):
        nonlocal echec
        res.append(("ok " if cond else "ÉCHEC ") + msg); print(res[-1], flush=True)
        if not cond: echec = True

    ch = chargeur(dossier)
    if ch is None:
        note(False, "%s : pas de chargeur par segments (ancienne construction ?)" % dossier); return True
    S, C, X, U = ch["S"], ch["C"], ch["X"], ch["U"]
    sx = lambda L: [i for i in L if i not in X]
    # 27.11 (tests à deux niveaux) : niveau rapide (pas > 1) = premier écran seulement, sans « tout le code »,
    # empreinte sur une notion sur `pas` ; ordre des segments, lancement et erreurs JS contrôlés pour chaque classe.
    for k in profils + (["nouveau"] if pas > 1 else ["tout", "nouveau"]):
        p = PROFILS.get(k)
        nom = "nouvel élève" if k == "nouveau" else "tout le code (#q-…)" if k == "tout" else k
        if k == "nouveau":
            o = chromium(page_docs(dossier, None), 300000)
            if "echec" in o:
                note(False, "%s : %s" % (nom, o["echec"])); continue
            note(o["startAt"] == U and sx(o["apres"]) == U and not o["err"],
                 "%s : code commun seul avant l'accueil (%d segments)%s" % (nom, len(U), "" if o["startAt"] == U else ", exécutés : %s" % o["startAt"]))
            continue
        ref = chromium(page_src(p, pas), 300000)
        if "echec" in ref or ref.get("err"):
            note(False, "%s : sources : %s" % (nom, ref.get("echec") or ref.get("err"))); continue
        attendu = list(range(len(S))) if k == "tout" else C.get(cle(p))
        for ax in ((False,) if pas > 1 else (False, True)):
            o = chromium(page_docs(dossier, p, tout=(k == "tout"), apres_x=ax, pas=pas), 300000)
            quand = "après le paquet x" if ax else "premier écran"
            if "echec" in o:
                note(False, "%s (%s) : %s" % (nom, quand, o["echec"])); continue
            d = compare(ref, o, registres=(k == "tout" and ax))
            note(attendu is not None and o["startAt"] == attendu and sx(o["apres"]) == sx(attendu) and not d and not o["err"],
                 "%s (%s) : %d segments exécutés dans l'ordre des sources avant l'app%s, %d notions, empreinte %s%s%s" % (
                     nom, quand, len(o["startAt"]), "" if o["startAt"] == attendu else " (ATTENDU %s, EXÉCUTÉS %s)" % (attendu, o["startAt"]),
                     len(o.get("q", {})), "identique aux sources" if not d else "DIFFÉRENTE des sources (%d : %s)" % (len(d), ", ".join(d[:12])),
                     "" if sx(o["apres"]) == sx(attendu) else ", segments exécutés APRÈS le lancement : %s" % o["apres"],
                     ", erreurs JS : %s" % o["err"][:3] if o["err"] else ""))
    return echec


def main():
    a = sys.argv[1:]
    if not a or a[0] == "taille":
        taille(a[1:] or [DOCS]); return
    if a[0] in ("ordre", "empreinte"):
        prof = a[a.index("--profils") + 1].split(",") if "--profils" in a else [k for k in PROFILS if k != "nouveau"]
        d = Path(a[a.index("--dossier") + 1]) if "--dossier" in a else DOCS
        pas = int(a[a.index("--rapide") + 1]) if "--rapide" in a else 1
        sys.exit(1 if ordre(prof, d, pas) else 0)
    print(__doc__)


if __name__ == "__main__":
    main()
