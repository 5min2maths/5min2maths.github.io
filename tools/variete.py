#!/usr/bin/env python3
"""Variété des questions (27.11, règle de l'enseignant : au moins 3 FORMES de question par niveau, pas seulement
d'autres nombres). Mesure, pour chaque notion et chaque niveau 1 à 3, le nombre de formes distinctes sur 200 tirages
(énoncé lisible, nombres et lettres isolées remplacés), et la fréquence d'apparition de chaque (notion, niveau) dans
les séances d'élèves simulés (tests/eleves.js, vrai moteur, 14 semaines dès septembre, trois profils).
Usage : tools/variete.py            → suivi/variete.json + tableau résumé à l'écran (verrou des tests, ~2 min)
        tools/variete.py --liste N  → les N niveaux à moins de 3 formes les plus fréquents
        tools/variete.py --formes   → formes seulement (fréquences reprises de suivi/variete.json), sans verrou
        tools/variete.py --relire   → tableau d'après suivi/variete.json, sans mesure
        tools/variete.py --garde    → régénère le garde-fou tests/variete_niveaux.html (dans la suite)
La page générée tests/_variete_mesure.html (hors suite) charge exactement les fichiers de build.py."""
import json, re, subprocess, sys, tempfile, html, fcntl, os
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
PAGE = ROOT / "tests" / "_variete_mesure.html"
OUT = ROOT / "suivi" / "variete.json"

def page():
    s = (ROOT / "build.py").read_text()
    JS = eval(re.search(r"JS = (\[.*?\])", s, re.S).group(1))
    head = """<!doctype html><meta charset="utf-8"><main id="app" style="display:none"></main><pre id="out">en cours</pre>
<script>
const _D = Date; let OFF = 0;
class FD extends _D { constructor(...a) { if (!a.length) super(_D.now() + OFF); else super(...a); } static now() { return _D.now() + OFF; } }
window.Date = FD;
window.MathJax = { typesetPromise: () => Promise.resolve() }; try { localStorage.clear(); } catch (e) {}
window.fetch = () => Promise.resolve(new Response("{}")); if (navigator.sendBeacon) navigator.sendBeacon = () => true;
window.ensurePacks = () => Promise.resolve();
</script>"""
    scripts = "".join('<script src="../src/%s"></script>' % f for f in JS)
    tail = """<script>window.SIM_NO_AUTO = true;</script><script src="eleves.js"></script><script src="vrai_collecte.js"></script><script src="variete_formes.js"></script>
<script>
(function () {
  const out = { forms: {}, freq: {} }, H = location.hash;
  try {
    const N = +((/n=(\\d+)/.exec(H) || [])[1] || 200);
    for (const id of Object.keys(GEN)) for (let d = 1; d <= 3; d++) out.forms[id + "|" + d] = VARIETE.mesure(id, d, N);
    if (!/sansfreq/.test(H)) {
      const C = SimEleves.CLASSES;
      Object.assign(C, { "3e": { system: "CH", grade: 14, track: "college" }, "4e": { system: "CH", grade: 15, track: "college" },
        "MP3": { system: "CH", grade: 14, track: "mp" }, "MP4": { system: "CH", grade: 15, track: "mp" },
        "FR6e": { system: "FR", grade: 6, track: "college" }, "FR5e": { system: "FR", grade: 7, track: "college" }, "FR4e": { system: "FR", grade: 8, track: "college" },
        "FR3e": { system: "FR", grade: 9, track: "college" }, "FR2nde": { system: "FR", grade: 10, track: "college" }, "FR1re": { system: "FR", grade: 11, track: "college" } });
      let cur = null, depth = 0; const mk = Engine.make;
      Engine.make = function (...a) { depth++; let q; try { q = mk.apply(this, a); } finally { depth--; }
        if (!depth && cur && q && q.id && q.d) { const k = q.id + "|" + q.d; cur[k] = (cur[k] || 0) + 1; } return q; };
      for (const cl of Object.keys(C)) { cur = out.freq[cl] = {};
        for (const p of ["moyen_regulier", "faible_regulier", "fort"]) { try { SimEleves.simulate(cl, p, { semaines: 14, graine: 7 }); } catch (e) { cur["ERR"] = String(e); } } }
    }
    document.getElementById("out").textContent = JSON.stringify(out);
  } catch (e) { document.getElementById("out").textContent = "ERR " + e.stack; }
})();
</script>"""
    PAGE.write_text(head + scripts + tail)

def run(hash_=""):
    page()
    lock = open("/tmp/5m2m_tests_v2.lock", "w")
    if not os.environ.get("M2M_VERROU_TENU"): fcntl.flock(lock, fcntl.LOCK_EX)
    r = subprocess.run(["nice", "chromium", "--headless", "--disable-gpu", "--no-sandbox", "--virtual-time-budget=900000",
                        "--dump-dom", "file://%s#%s" % (PAGE, hash_)], capture_output=True, text=True, timeout=1500, pass_fds=())
    m = re.findall(r"<pre[^>]*>(.*?)</pre>", r.stdout, re.S)
    t = html.unescape(m[-1]) if m else ""
    if not t.startswith("{"): sys.exit("mesure impossible : " + t[:500])
    return json.loads(t)

ORDRE = ["9e", "10e", "11e", "1re", "2e", "3e", "4e", "MP1", "MP2", "MP3", "MP4", "FR6e", "FR5e", "FR4e", "FR3e", "FR2nde", "FR1re"]

def resume(d):
    F, Q = d["forms"], d["freq"]
    tot = {}
    for cl, c in Q.items():
        for k, v in c.items():
            if k != "ERR": tot[k] = tot.get(k, 0) + v
    lines = ["| Classe | Questions simulées | niveaux 1–3 vus | à 1 forme (part des questions) | à 2 formes (part des questions) |", "|---|---|---|---|---|"]
    for cl in ORDRE:
        c = {k: v for k, v in Q.get(cl, {}).items() if k in F}
        n = sum(c.values()) or 1
        one = [k for k in c if F[k]["n"] == 1]; two = [k for k in c if F[k]["n"] == 2]
        lines.append("| %s | %d | %d | %d (%d %%) | %d (%d %%) |" % (cl, n, len(c), len(one), round(100 * sum(c[k] for k in one) / n), len(two), round(100 * sum(c[k] for k in two) / n)))
    return lines, tot

GARDE = ROOT / "tests" / "variete_niveaux.html"
def garde(niveaux):
    """Page de la suite (tests/variete_niveaux.html) : échoue si un niveau de la liste a moins de 3 formes sur 200
    tirages, ou si une forme ajoutée le 27.11 (ctx « v27-… ») n'est pas reconnue par son oracle de recalcul."""
    s = (ROOT / "build.py").read_text()
    JS = [f for f in eval(re.search(r"JS = (\[.*?\])", s, re.S).group(1)) if f not in ("parents.js", "presente.js", "app.js")]
    lst = json.dumps(niveaux, ensure_ascii=False)
    GARDE.write_text("""<!doctype html><meta charset="utf-8"><meta name="budget" content="90000"><main id="app" style="display:none"></main><pre id="out">en cours</pre>
<script>window.MathJax = { typesetPromise: () => Promise.resolve() }; try { localStorage.clear(); } catch (e) {} window.fetch = () => Promise.resolve(new Response("{}"));</script>
<!-- 27.11 (agent variete) : page générée par tools/variete.py --garde (liste des niveaux protégés, sources de build.py) -->
""" + "".join('<script src="../src/%s"></script>' % f for f in JS) + """
<script src="vrai_collecte.js"></script><script src="recalc_oracles.js"></script><script src="recalc_oracles34.js"></script><script src="recalc_oracles_frl.js"></script><script src="recalc_oracles_var.js"></script><script src="variete_formes.js"></script>
<script>
/* Garde-fou de variété (27.11, règle de l'enseignant : au moins 3 FORMES de question par niveau ; tools/archive/variete_27-11.md).
   NIV = niveaux protégés (« notion|niveau ») : ceux complétés le 27.11 et les plus fréquents des séances simulées.
   Échoue si l'un d'eux a moins de 3 formes sur 200 tirages (tests/variete_formes.js), ou si une forme v27 n'est pas
   reconnue par son oracle (tests/recalc_oracles_var.js, ou l'oracle générique « Résous ») ou est contredite par lui. */
(function () {
  const NIV = """ + lst + """, fails = [], t0 = performance.now(); let nv = 0, nk = 0;
  const GR = { alpha: "α", beta: "β", gamma: "γ" }, prep = (s) => String(s == null ? "" : s).replace(/\\\\(alpha|beta|gamma)\\b/g, (m, g) => GR[g]).replace(/\\\\(sin|cos|tan)\\b/g, "$1");
  const item = (q, id, d) => ({ id, d, code: q.code, raw: String(q.q || ""), fig: q.fig || "", txt: VRAI.plain(prep(q.q)), sol: VRAI.plain(prep(q.sol)), rawSol: String(q.sol || ""), spec: q.spec, parts: [] });
  try {
    for (const k of NIV) { const [id, d] = k.split("|"); if (!GEN[id]) { fails.push(k + " : notion absente"); continue; }
      const m = VARIETE.mesure(id, +d, 200); nv++; if (m.n < 3) fails.push(k + " : " + m.n + " forme(s) sur 200 tirages (3 au moins)");
      for (let s = 1; s <= 60; s++) { const q = Engine.build(id, +d, s); if (!q || !/^v27-/.test(q.ctx || "")) continue; nk++;
        const r = RECALC.check(item(q, id, +d)); if (!r.length) fails.push(q.code + " (" + q.ctx + ") : forme non reconnue par l'oracle — " + VRAI.plain(q.q).slice(0, 90));
        for (const c of r) if (c.msg) fails.push(q.code + " (" + q.ctx + ") [" + c.rule + "] " + c.msg); } }
  } catch (e) { fails.push("EXC " + e.message + " " + (e.stack || "").split("\\n")[1]); }
  document.getElementById("out").textContent = (fails.length ? "ÉCHEC " + [...new Set(fails)].slice(0, 30).join(" | ") : "ok variété") + " : " + nv + " niveaux à 3 formes au moins, " + nk + " formes v27 recalculées (" + Math.round((performance.now() - t0) / 1000) + " s)";
})();
</script>""")

if __name__ == "__main__":
    if "--garde" in sys.argv:  # régénère tests/variete_niveaux.html : niveaux complétés le 27.11 + niveaux fréquents (≥ 20 questions simulées)
        d = json.loads(OUT.read_text()); src = (ROOT / "src" / "variantes.js").read_text(); src = src[src.index("27.11 : variété"):]
        faits = sorted(set("%s|%s" % m for m in re.findall(r'VZ\("(\w+)", (\d)', src)))
        _, tot = resume(d); freq = [k for k, v in sorted(tot.items(), key=lambda x: -x[1]) if v >= 20 and k in d["forms"]]
        garde(faits + [k for k in freq if k not in faits]); print("tests/variete_niveaux.html :", len(faits), "niveaux complétés +", len([k for k in freq if k not in faits]), "niveaux fréquents"); sys.exit()
    if "--relire" in sys.argv: d = json.loads(OUT.read_text())
    elif "--formes" in sys.argv:  # formes seulement (page légère, sans le verrou) ; fréquences reprises de la dernière mesure
        old = json.loads(OUT.read_text()); os.environ["M2M_VERROU_TENU"] = "1"; d = run("sansfreq"); d["freq"] = old["freq"]; OUT.write_text(json.dumps(d, ensure_ascii=False))
    else:
        d = run(); OUT.parent.mkdir(exist_ok=True); OUT.write_text(json.dumps(d, ensure_ascii=False))
    lines, tot = resume(d)
    print("\n".join(lines))
    if "--liste" in sys.argv:
        n = int(sys.argv[sys.argv.index("--liste") + 1])
        L = sorted([k for k in tot if k in d["forms"] and d["forms"][k]["n"] < 3], key=lambda k: -tot[k])
        for k in L[:n]:
            f = d["forms"][k]; cls = [cl for cl in ORDRE if d["freq"].get(cl, {}).get(k)]
            print("%5d  %-22s %d forme(s)  [%s]  %s" % (tot[k], k, f["n"], ",".join(cls), " || ".join(f["ex"])[:230]))
