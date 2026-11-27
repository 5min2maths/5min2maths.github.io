#!/usr/bin/env python3
"""Mesure du temps de chargement de l'app construite (chantier F, 23.11).

Usage :
  python3 tools/mesure_chargement.py              → tableau des temps (docs/index.html) + répartition de la taille
  python3 tools/mesure_chargement.py --taille     → seulement la répartition de la taille par fichier source
  python3 tools/mesure_chargement.py -n 5         → 5 mesures par scénario (médiane ; 3 par défaut)
  python3 tools/mesure_chargement.py --par-fichier → temps d'exécution du code de premier niveau de chaque fichier JS

Comment : un petit serveur local sert docs/ (compressé en gzip, comme GitHub Pages) ; Chromium sans interface est
piloté par le protocole DevTools (module websockets) : CPU ralenti (×1, ×4, ×6 ≈ téléphone d'entrée de gamme) et
réseau émulé (« 4G lente » = préréglage « Slow 4G » de DevTools : 562,5 ms de latence, 1,6 Mbit/s). Les envois de
statistiques (script.google.com) sont bloqués. Depuis le 24.11, MathJax et les polices sont servis avec l'app
(docs/vendor/) et comptés dans « Ko reçus » ; une ancienne construction les télécharge encore sur Internet (non comptés).

Mesures (depuis le début de la navigation) :
  accueil = première fois que #app contient l'écran (accueil pour un habitué, écran d'entrée pour un nouveau) ;
  Ko reçus = page + fichiers de la même origine, compressés ; DCL = DOMContentLoaded ; MathJax = MathJax prêt (formules affichables).
Scénarios : « nouveau » (rien en mémoire) et « habitué » (élève de 11e déjà placé ; cache HTTP chaud).

Machine fragile : un seul Chromium, toujours sous timeout -k, tué à la fin.
"""
import argparse, asyncio, gzip, http.server, json, os, re, shutil, socket, statistics, subprocess, sys, tempfile, threading, time, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"

RESEAUX = {
    "aucun": None,
    "4g": dict(latency=165, downloadThroughput=9e6 / 8, uploadThroughput=1.5e6 / 8),           # « Fast 4G » de DevTools
    "4g-lente": dict(latency=562.5, downloadThroughput=1.6e6 / 8 * 0.9, uploadThroughput=750e3 / 8 * 0.9),  # « Slow 4G »
}

# ---------------------------------------------------------------- répartition de la taille
def js_list():
    src = (ROOT / "build.py").read_text()
    return json.loads("[" + re.search(r"^JS = \[(.*?)\]", src, re.M | re.S).group(1) + "]")

def taille():
    rows = []
    for f in js_list() + ["style.css"]:
        s = (ROOT / "src" / f).read_text()
        lines = s.split("\n")
        com = sum(len(l.encode()) + 1 for l in lines if l.strip().startswith("//"))
        ind = sum(len(l) - len(l.lstrip()) for l in lines)
        rows.append((len(s.encode()), f, com, ind, len(gzip.compress(s.encode(), 6))))
    rows.sort(reverse=True)
    tot = sum(r[0] for r in rows)
    print(f"\nRépartition de la taille (sources, {len(rows)} fichiers, {tot / 1024:.0f} Ko) :")
    print(f"{'fichier':22s}{'Ko':>7s}{'%':>6s}{'gzip Ko':>9s}{'comm. Ko':>10s}{'indent. Ko':>11s}")
    for n, f, c, i, g in rows[:20]:
        print(f"{f:22s}{n / 1024:7.0f}{100 * n / tot:6.1f}{g / 1024:9.0f}{c / 1024:10.1f}{i / 1024:11.1f}")
    reste = rows[20:]
    print(f"{'(' + str(len(reste)) + ' autres)':22s}{sum(r[0] for r in reste) / 1024:7.0f}{100 * sum(r[0] for r in reste) / tot:6.1f}")
    c, i = sum(r[2] for r in rows), sum(r[3] for r in rows)
    print(f"Commentaires de ligne : {c / 1024:.0f} Ko ({100 * c / tot:.1f} %) ; indentation : {i / 1024:.0f} Ko ({100 * i / tot:.1f} %)")
    page = (DOCS / "index.html").read_bytes()
    print(f"docs/index.html : {len(page) / 1024:.0f} Ko, {len(gzip.compress(page, 6)) / 1024:.0f} Ko en gzip")

# ---------------------------------------------------------------- serveur local (gzip comme GitHub Pages)
class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
    def do_GET(self):
        p = self.path.split("?")[0].split("#")[0]
        f = Path(self.directory) / (p.lstrip("/") or "index.html")
        if f.is_dir(): f = f / "index.html"
        if not f.is_file(): return self.send_error(404)
        data = f.read_bytes()
        typ = self.guess_type(str(f))
        gz = "gzip" in self.headers.get("Accept-Encoding", "") and typ.split(";")[0] in ("text/html", "text/javascript", "application/javascript", "text/css", "application/manifest+json")
        if gz: data = gzip.compress(data, 6)
        self.send_response(200)
        self.send_header("Content-Type", typ)
        if gz: self.send_header("Content-Encoding", "gzip")
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "max-age=600")  # comme GitHub Pages
        self.end_headers()
        self.wfile.write(data)

def serveur(directory):
    h = lambda *a, **k: Handler(*a, directory=str(directory), **k)
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), h)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv

def port_libre():
    s = socket.socket(); s.bind(("127.0.0.1", 0)); p = s.getsockname()[1]; s.close(); return p

# ---------------------------------------------------------------- pilotage de Chromium
INSTRU = r"""
(() => {
  window.__m = {};
  const t0 = () => performance.now();
  const obs = new MutationObserver(() => {
    const a = document.getElementById("app");
    if (a && a.firstElementChild && !__m.accueil) { __m.accueil = t0(); __m.ecran = a.querySelector(".home-head") ? "accueil" : "entrée"; }
  });
  obs.observe(document, { childList: true, subtree: true });
  document.addEventListener("DOMContentLoaded", () => { __m.dcl = t0(); });
  const mj = setInterval(() => { if (window.MathJax && MathJax.typesetPromise) { __m.mathjax = t0(); clearInterval(mj); } }, 20);
  window.addEventListener("error", (e) => { (__m.erreurs = __m.erreurs || []).push(String(e.message)); });
})();
"""

ETAT_HABITUE = """(() => { const s = Engine.newState({ system: "CH", grade: 11, track: "college", minutes: 5 }); Engine.autoInit(s);
  s.placed = true; s.tourDone = true; Store.save(s); localStorage.setItem("m2m-auteur", "1"); return 1; })()"""

class CDP:
    def __init__(self, ws): self.ws, self.n, self.events = ws, 0, []
    async def call(self, method, **params):
        self.n += 1; i = self.n
        await self.ws.send(json.dumps({"id": i, "method": method, "params": params}))
        while True:
            m = json.loads(await self.ws.recv())
            if m.get("id") == i:
                if "error" in m: raise RuntimeError(f"{method}: {m['error']}")
                return m.get("result", {})
            self.events.append(m)
    async def attendre(self, cond, delai=60):
        fin = time.time() + delai
        while time.time() < fin:
            r = await self.call("Runtime.evaluate", expression=cond, returnByValue=True)
            v = r.get("result", {}).get("value")
            if v: return v
            await asyncio.sleep(0.1)
        return None

async def une_mesure(cdp, url, cpu, reseau, habitue):
    await cdp.call("Emulation.setCPUThrottlingRate", rate=1)
    await cdp.call("Network.emulateNetworkConditions", offline=False, latency=0, downloadThroughput=-1, uploadThroughput=-1)
    if not habitue:
        await cdp.call("Network.clearBrowserCache")
        await cdp.call("Storage.clearDataForOrigin", origin=url.rsplit("/", 1)[0], storageTypes="all")
        await cdp.call("Network.setCacheDisabled", cacheDisabled=True)
    else:
        await cdp.call("Network.setCacheDisabled", cacheDisabled=False)
    await cdp.call("Emulation.setCPUThrottlingRate", rate=cpu)
    r = RESEAUX[reseau]
    if r: await cdp.call("Network.emulateNetworkConditions", offline=False, **r)
    await cdp.call("Page.navigate", url=url)
    m = await cdp.attendre("window.__m && __m.accueil && __m.mathjax && document.readyState === 'complete' ? __m : null", 120)
    if not m: return None
    nav = await cdp.call("Runtime.evaluate", returnByValue=True, expression="(() => { const n = performance.getEntriesByType('navigation')[0]; const r = performance.getEntriesByType('resource').filter(e => e.name.startsWith(location.origin)).reduce((a, e) => a + e.transferSize, 0); return { reponse: n.responseEnd, octets: n.transferSize + r}; })()")
    m.update(nav["result"]["value"])
    return m

async def piloter(port, url, scenarios, n, cb_par_fichier=None):
    import websockets
    for _ in range(100):
        try:
            cible = json.load(urllib.request.urlopen(f"http://127.0.0.1:{port}/json/list"))
            cible = [c for c in cible if c["type"] == "page"][0]; break
        except Exception: await asyncio.sleep(0.2)
    else: raise RuntimeError("Chromium injoignable")
    async with websockets.connect(cible["webSocketDebuggerUrl"], max_size=2 ** 26) as ws:
        cdp = CDP(ws)
        for d in ("Page", "Runtime", "Network"): await cdp.call(d + ".enable")
        await cdp.call("Network.setBlockedURLs", urls=["*script.google.com*"])
        await cdp.call("Page.addScriptToEvaluateOnNewDocument", source=INSTRU)
        if cb_par_fichier: return await cb_par_fichier(cdp)
        urls = url if isinstance(url, dict) else {"": url}
        # Préparer un élève « habitué » (localStorage de l'origine locale)
        await cdp.call("Page.navigate", url=next(iter(urls.values())))
        await cdp.attendre("window.__m && __m.accueil ? 1 : null")
        res = {}
        # Variantes entrelacées (A, B, A, B…) : la charge de la machine pèse pareil sur chacune.
        for (nom, cpu, reseau, habitue) in scenarios:
            for k in range(n):
                for var, u in urls.items():
                    if habitue:
                        await cdp.call("Network.setCacheDisabled", cacheDisabled=False)
                        await cdp.call("Page.navigate", url=u)
                        await cdp.attendre("typeof Engine !== 'undefined' && typeof Store !== 'undefined' ? 1 : null")
                        await cdp.call("Runtime.evaluate", expression=ETAT_HABITUE)
                    m = await une_mesure(cdp, u, cpu, reseau, habitue)
                    res.setdefault((var, nom), []).append(m)
                    print(f"  {var + ' · ' if var else ''}{nom} #{k + 1} : " + (f"écran {m['accueil']:.0f} ms ({m['ecran']}), MathJax {m['mathjax']:.0f} ms" if m else "délai dépassé"), file=sys.stderr)
        await cdp.call("Emulation.setCPUThrottlingRate", rate=1)
        return res

def lancer(directory, page, fn):
    srv = serveur(directory)
    url = f"http://127.0.0.1:{srv.server_address[1]}/{page}"
    port = port_libre()
    profil = Path(tempfile.mkdtemp(prefix="m2m-mesure-", dir=Path.home() / "snap" / "chromium" / "common")) \
        if (Path.home() / "snap" / "chromium" / "common").is_dir() else Path(tempfile.mkdtemp(prefix="m2m-mesure-"))
    proc = subprocess.Popen(["timeout", "-k", "5", "900", "chromium", "--headless", "--disable-gpu", "--no-sandbox",
                             "--no-first-run", "--disable-extensions", f"--remote-debugging-port={port}",
                             f"--user-data-dir={profil}", "--window-size=412,915", "about:blank"],
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)
    try:
        return asyncio.run(fn(port, url))
    finally:
        fermer(port)  # Chromium du snap : les signaux sont refusés (confinement), on le ferme par le protocole
        try: os.killpg(proc.pid, 15); proc.wait(10)
        except Exception:
            try: os.killpg(proc.pid, 9)
            except Exception: pass
        srv.shutdown()
        shutil.rmtree(profil, ignore_errors=True)

def fermer(port):
    async def f():
        import websockets
        v = json.load(urllib.request.urlopen(f"http://127.0.0.1:{port}/json/version", timeout=5))
        async with websockets.connect(v["webSocketDebuggerUrl"]) as ws:
            await ws.send(json.dumps({"id": 1, "method": "Browser.close"})); await asyncio.wait_for(ws.recv(), 5)
    try: asyncio.run(f())
    except Exception: pass
    time.sleep(1)

def med(vals, k):
    v = [x[k] for x in vals if x and isinstance(x.get(k), (int, float))]
    return statistics.median(v) if v else float("nan")

# ---------------------------------------------------------------- temps par fichier (code de premier niveau)
def par_fichier(cpu):
    """Page instrumentée : le JS de build.py, un performance.mark() avant chaque fichier (un seul <script>, comme l'app)."""
    tmp = Path(tempfile.mkdtemp(prefix="m2m-pf-"))
    try:
        for f in DOCS.iterdir():
            if f.is_file(): shutil.copy(f, tmp / f.name)
        page = (DOCS / "index.html").read_text()
        js = "\n".join(f'performance.mark("f:{f}");\n' + (ROOT / "src" / f).read_text() for f in js_list()) + '\nperformance.mark("f:fin");\n'
        if (tmp / "app.js").exists() and "app.js?v=" in page:
            (tmp / "app.js").write_text(js)
        else:
            debut, fin = page.index('<main id="app"'), page.rindex("</script>")
            page = page[:debut] + '<main id="app"></main>\n<script>\n' + js + "\n" + page[fin:]
        (tmp / "pf.html").write_text(page)
        async def cb(cdp):
            await cdp.call("Network.setCacheDisabled", cacheDisabled=True)
            await cdp.call("Emulation.setCPUThrottlingRate", rate=cpu)
            await cdp.call("Page.navigate", url=cdp.url)
            await cdp.attendre("document.readyState === 'complete' ? 1 : null")
            r = await cdp.call("Runtime.evaluate", returnByValue=True, expression="performance.getEntriesByType('mark').filter(m => m.name.startsWith('f:')).map(m => [m.name.slice(2), m.startTime])")
            await cdp.call("Emulation.setCPUThrottlingRate", rate=1)
            return r["result"]["value"]
        async def fn(port, url):
            async def cb2(cdp): cdp.url = url; return await cb(cdp)
            return await piloter(port, url, [], 0, cb2)
        marks = lancer(tmp, "pf.html", fn)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    d = sorted(((marks[i + 1][1] - marks[i][1], marks[i][0]) for i in range(len(marks) - 1)), reverse=True)
    tot = marks[-1][1] - marks[0][1]
    print(f"\nExécution du code de premier niveau (CPU ×{cpu}) : {tot:.0f} ms au total ; du début de la navigation au 1er fichier : {marks[0][1]:.0f} ms")
    for t, f in d[:15]: print(f"  {f:22s}{t:8.0f} ms")

# ---------------------------------------------------------------- profil CPU du démarrage
def profil(cpu, habitue):
    """Échantillonne le démarrage (Profiler de DevTools) ; temps propre par fonction, ramené au fichier source."""
    page = (DOCS / "index.html").read_text().split("\n")
    externe = (DOCS / "app.js").exists() and any("app.js?v=" in l for l in page)
    debut = 0 if externe else next(i for i, l in enumerate(page) if l.startswith('<main id="app"')) + 2  # ligne (0-based) du 1er fichier
    bornes, l0 = [], debut
    for f in js_list():
        n = (ROOT / "src" / f).read_text().count("\n") + 1
        bornes.append((l0, l0 + n, f)); l0 += n
    def ou(ligne):
        for a, b, f in bornes:
            if a <= ligne < b: return f, ligne - a + 1
        return "?", ligne
    async def fn(port, url):
        async def cb(cdp):
            await cdp.call("Page.navigate", url=url)
            await cdp.attendre("typeof Engine !== 'undefined' && typeof Store !== 'undefined' ? 1 : null")
            if habitue: await cdp.call("Runtime.evaluate", expression=ETAT_HABITUE)
            else: await cdp.call("Storage.clearDataForOrigin", origin=url.rsplit("/", 1)[0], storageTypes="all")
            await cdp.call("Profiler.enable"); await cdp.call("Profiler.setSamplingInterval", interval=200)
            await cdp.call("Emulation.setCPUThrottlingRate", rate=cpu)
            await cdp.call("Profiler.start")
            await cdp.call("Page.navigate", url=url)
            await cdp.attendre("window.__m && __m.accueil && document.readyState === 'complete' ? 1 : null")
            prof = (await cdp.call("Profiler.stop"))["profile"]
            await cdp.call("Emulation.setCPUThrottlingRate", rate=1)
            return prof
        return await piloter(port, url, [], 0, cb)
    prof = lancer(DOCS, "index.html", fn)
    dt = {}
    for nid, d in zip(prof["samples"], prof["timeDeltas"]): dt[nid] = dt.get(nid, 0) + d
    par_fn, par_f = {}, {}
    for nd in prof["nodes"]:
        t = dt.get(nd["id"], 0) / 1000
        cf = nd["callFrame"]
        if ("/app.js" in cf["url"]) if externe else ("index.html" in cf["url"]):
            f, l = ou(cf["lineNumber"]); cle = f"{cf['functionName'] or '(premier niveau)'}  {f}:{l}"
        else:
            f = cf["url"].rsplit("/", 1)[-1] or cf["functionName"] or "?"; cle = f"{cf['functionName'] or '?'}  {f}"
        par_fn[cle] = par_fn.get(cle, 0) + t; par_f[f] = par_f.get(f, 0) + t
    print(f"\nProfil du démarrage ({'habitué' if habitue else 'nouveau'}, CPU ×{cpu}), temps propre en ms :")
    for k, v in sorted(par_f.items(), key=lambda x: -x[1])[:12]: print(f"  {k:30s}{v:8.0f}")
    print("Fonctions :")
    for k, v in sorted(par_fn.items(), key=lambda x: -x[1])[:25]: print(f"  {k:60s}{v:8.0f}")

# ---------------------------------------------------------------- principal
def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("-n", type=int, default=3)
    ap.add_argument("--taille", action="store_true")
    ap.add_argument("--par-fichier", action="store_true")
    ap.add_argument("--scenarios", help="numéros des scénarios à garder (1 à 7), ex. 2,6")
    ap.add_argument("--comparer", nargs="+", metavar="DOSSIER", help="comparer plusieurs constructions (mesures entrelacées)")
    ap.add_argument("--dossier", help="mesurer une autre construction (dossier contenant index.html) au lieu de docs/")
    ap.add_argument("--profil", action="store_true", help="profil CPU du démarrage (nouveau et habitué, CPU ×4)")
    ap.add_argument("--rapide", action="store_true", help="seulement CPU ×4 (nouveau, habitué) et ×6 en 4G lente")
    a = ap.parse_args()
    global DOCS
    if a.dossier: DOCS = Path(a.dossier).resolve()
    if not (DOCS / "index.html").exists(): sys.exit("docs/index.html absent : lancer d'abord python3 build.py")
    taille()
    if a.taille: return
    if a.profil:
        for hab in (False, True): profil(4, hab)
        return
    if a.par_fichier:
        for cpu in (1, 4): par_fichier(cpu)
        return
    sc = [("nouveau · CPU ×1 · réseau local", 1, "aucun", False),
          ("nouveau · CPU ×4 · réseau local", 4, "aucun", False),
          ("nouveau · CPU ×4 · 4G", 4, "4g", False),
          ("nouveau · CPU ×6 · 4G lente", 6, "4g-lente", False),
          ("habitué · CPU ×1 · réseau local", 1, "aucun", True),
          ("habitué · CPU ×4 · réseau local", 4, "aucun", True),
          ("habitué · CPU ×6 · 4G lente", 6, "4g-lente", True)]
    if a.rapide: sc = [s for s in sc if s[1] >= 4 and s[2] != "4g"]
    if a.scenarios: sc = [s for i, s in enumerate(sc) if str(i + 1) in a.scenarios.split(",")]
    if a.comparer:
        racine = Path(tempfile.mkdtemp(prefix="m2m-cmp-"))
        noms = []
        for d in a.comparer:
            nom = Path(d).resolve().name
            while nom in noms: nom += "_"
            (racine / nom).symlink_to(Path(d).resolve()); noms.append(nom)
        try:
            res = lancer(racine, "", lambda port, url: piloter(port, {v: url + v + "/index.html" for v in noms}, sc, a.n))
        finally:
            shutil.rmtree(racine, ignore_errors=True)
    else:
        res = lancer(DOCS, "index.html", lambda port, url: piloter(port, url, sc, a.n))
    print(f"\nTemps de chargement (médiane de {a.n}, ms depuis le début de la navigation) :")
    print(f"{'construction':16s}{'scénario':36s}{'page reçue':>11s}{'DCL':>8s}{'écran':>8s}{'MathJax':>9s}{'Ko reçus':>10s}")
    for (var, nom), vals in sorted(res.items(), key=lambda x: ([s[0] for s in sc].index(x[0][1]), x[0][0])):
        print(f"{var or DOCS.name:16s}{nom:36s}{med(vals, 'reponse'):11.0f}{med(vals, 'dcl'):8.0f}{med(vals, 'accueil'):8.0f}{med(vals, 'mathjax'):9.0f}{med(vals, 'octets') / 1024:10.0f}")
    errs = {e for vals in res.values() for x in vals if x for e in x.get("erreurs", [])}
    print("Erreurs JS : " + ("; ".join(sorted(errs)) if errs else "aucune"))

if __name__ == "__main__":
    import signal
    signal.signal(signal.SIGTERM, lambda *a: sys.exit(1))  # pour que Chromium soit fermé (finally) même sous timeout
    main()
