#!/usr/bin/env python3
"""Version PUBLIÉE (docs/) : chargement par segments, service worker, mises à jour, séances complètes (27.11, agent eleves8).

Outil hors suite (préfixe _). Copie docs/ dans un dossier temporaire, la sert en https local (certificat de test,
Chromium avec --ignore-certificate-errors : l'app n'enregistre son service worker qu'en https), pilote un Chromium réel
(protocole DevTools, outils de tools/mesure_chargement.py) et écrit un journal « ok / ÉCHEC / note ».
Usage : python3 tests/_charge_publiee.py [scénario…]   scénarios : premier mp2 fr4 liens horsligne maj (défaut : tous)
Captures : tests/_shots/charge/*.png
"""
import asyncio, json, os, re, shutil, ssl, subprocess, sys, tempfile, threading, time, http.server, urllib.request, base64
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
import mesure_chargement as mc  # noqa: E402

SHOTS = ROOT / "tests" / "_shots" / "charge"
RES = []


def note(cond, msg):
    s = ("ok " if cond is True else "ÉCHEC " if cond is False else "note ") + msg
    RES.append(s); print(s, flush=True)


# ------------------------------------------------------------------ robot d'élève (tests/_trace.html, garde=1)
def robot(cfg):
    s = (ROOT / "tests" / "_trace.html").read_text()
    blocs = re.findall(r"<script>\n(\(async function \(\) \{.*?)</script>", s, re.S)
    code = blocs[-1].replace("(async function () {", "window.__trace = (async function () {", 1)
    pre = ("if (!document.getElementById('out')) { const o = document.createElement('pre'); o.id = 'out'; o.hidden = true; document.body.appendChild(o); }\n"
           "var _D = Date, OFF = 0, HP = {};\n"
           "var CFG = " + json.dumps(cfg) + ";\n")
    return pre + code + "\n;window.__trace.then(() => document.getElementById('out').textContent)"


class Sess:
    def __init__(self, cdp, url):
        self.cdp, self.url, self.nav = cdp, url, 0

    async def ev(self, js, await_=True):
        try:
            r = await self.cdp.call("Runtime.evaluate", expression=js, awaitPromise=await_, returnByValue=True)
        except RuntimeError as e:
            return "NAV " + str(e)[:120]
        if "exceptionDetails" in r:
            return "EXC " + json.dumps(r["exceptionDetails"].get("exception", {}).get("description", r["exceptionDetails"].get("text")))[:400]
        return r.get("result", {}).get("value")

    async def wait(self, cond, delai=40):
        return await self.cdp.attendre(cond, delai)

    def navs(self):
        n = sum(1 for e in self.cdp.events if e.get("method") == "Page.frameNavigated" and not e["params"]["frame"].get("parentId")
                and e["params"]["frame"].get("url", "").startswith(self.url))
        return n

    def erreurs(self):
        out = []
        for e in self.cdp.events:
            if e.get("method") == "Runtime.exceptionThrown":
                d = e["params"]["exceptionDetails"]
                out.append((d.get("exception", {}).get("description") or d.get("text", ""))[:200])
        return out

    async def shot(self, nom, w=None, h=None):
        SHOTS.mkdir(parents=True, exist_ok=True)
        r = await self.cdp.call("Page.captureScreenshot", format="png")
        (SHOTS / (nom + ".png")).write_bytes(base64.b64decode(r["data"]))
        return "tests/_shots/charge/" + nom + ".png"

    async def texte(self, n=300):
        return await self.ev(f"(document.getElementById('app') ? document.getElementById('app').innerText : '').replace(/\\s+/g, ' ').slice(0, {n})")

    async def goto(self, url):
        await self.cdp.call("Page.navigate", url="about:blank")
        await asyncio.sleep(0.3)
        self.cdp.events.clear()
        await self.cdp.call("Page.navigate", url=url)


PRET = "document.querySelector('#app') && document.querySelector('#app').firstElementChild ? 1 : null"
ACCUEIL = "document.querySelector('#app .home-head') ? 1 : null"


async def premier_lancement(S, etiquette, choix):
    """choix : liste d'étapes JS (clics) jusqu'au « Continuer » de l'étape 1 ; renvoie après le positionnement."""
    await S.goto(S.url)
    t0 = time.time()
    await S.wait(PRET)
    seg = await S.ev("JSON.stringify(window.__segs.slice().sort((a,b)=>a-b)) + ' mode=' + __m2mMode()")
    U = await S.ev("JSON.stringify(window.__ordre.U)")
    note(seg and seg.startswith(U), f"{etiquette} : premier écran en {time.time()-t0:.1f} s, code commun seulement ({seg})")
    await S.shot(f"{etiquette}_01_entree")
    for js in choix:
        r = await S.ev(js)
        if isinstance(r, str) and r.startswith("EXC"):
            note(False, f"{etiquette} : étape « {js[:80]} » → {r}")
        await asyncio.sleep(0.4)
    await S.shot(f"{etiquette}_02_etape1")
    n0 = S.navs()
    await S.ev("window.__avant = 1; document.getElementById('next').click(), 1")
    q = await S.wait("!window.__avant && (document.querySelector('#app .qtext') || document.querySelector('#app h2')) ? 1 : null", 60)
    await asyncio.sleep(1)
    n = S.navs() - n0
    ps = await S.ev("JSON.stringify(window.__packsAtStart)")
    prof = await S.ev("JSON.stringify(state && state.profile)")
    txt = await S.texte(200)
    note(bool(q) and n == 1, f"{etiquette} : « Continuer » → {n} rechargement(s), positionnement : {txt[:120]!r}")
    note(None, f"{etiquette} : profil {prof}, segments exécutés {ps}")
    await S.shot(f"{etiquette}_03_positionnement")
    # positionnement : « Je ne sais pas » puis « Continuer » jusqu'au bouton « Voir ma première séance »
    for k in range(30):
        r = await S.ev("""(() => { const $ = (i) => document.getElementById(i);
          if ($('go') && /première séance/.test($('go').innerText)) return 'fin';
          if ($('nx')) { $('nx').click(); return 'nx'; }
          if ($('idk') && !$('idk').disabled) { $('idk').click(); return 'idk'; }
          return 'rien:' + document.querySelector('#app').innerText.slice(0, 120); })()""")
        if r == "fin":
            break
        await asyncio.sleep(0.4)
    note(r == "fin", f"{etiquette} : positionnement terminé ({r})")
    await S.shot(f"{etiquette}_04_fin_positionnement")
    await S.ev("document.getElementById('go').click(), 1")
    ok = await S.wait(ACCUEIL, 20)
    note(bool(ok) and S.navs() - n0 == 1, f"{etiquette} : accueil après le positionnement, aucun autre rechargement ({S.navs()-n0})")
    await S.shot(f"{etiquette}_05_accueil")


async def seance(S, etiquette, eleve):
    cfg = {"nom": etiquette, "profil": eleve, "niveau": "moyen", "strategie": "aide", "wpm": 220, "jours": 1, "premier": 0,
           "garde": 1, "extras": "", "jour0": "2026-11-27", "graine": 7}
    log = await S.ev(robot(cfg))
    (SHOTS / f"{etiquette}_seance.txt").write_text(str(log))
    fin = await S.ev("document.querySelector('#app').innerText.replace(/\\s+/g,' ').slice(0, 200)")
    exc = "EXCEPTION" in str(log) or str(log).startswith("EXC")
    nq = str(log).count("QUESTION ")
    await S.ev("document.querySelector('#app').style.display = '', 1")
    await S.shot(f"{etiquette}_06_bilan")
    note(not exc and nq >= 2 and "FIN · Séance" in str(log), f"{etiquette} : séance complète ({nq} questions) ; bilan : {fin[:140]!r}")
    if exc:
        note(False, f"{etiquette} : {str(log)[-600:]}")


# ------------------------------------------------------------------ scénarios
async def sc_premier(S):
    """11e : premier lancement, choix de classe (1 rechargement), séance, retour après fermeture, changement de classe."""
    await premier_lancement(S, "11e", [
        "[...document.querySelectorAll('#dgrade button')].find(b => /^11/.test(b.innerText.trim())).click(), 1",
        "(() => { const i = document.getElementById('dans'); if (!i) return 'pas de démo'; i.value = '12'; i.dispatchEvent(new Event('input')); document.getElementById('dok').click(); return 1; })()",
        "document.getElementById('go').click(), 1",
    ])
    await seance(S, "11e", "CH-11")
    # retour après fermeture
    await S.goto(S.url)
    t0 = time.time()
    ok = await S.wait(ACCUEIL, 30)
    await asyncio.sleep(1.5)
    ps = await S.ev("JSON.stringify(window.__packsAtStart) === JSON.stringify(window.__ordre.C['11'])")
    note(bool(ok) and ps is True and S.navs() == 1, f"11e : retour après fermeture : accueil en {time.time()-t0:.1f} s, segments de la 11e, {S.navs()} chargement(s)")
    x = await S.ev("JSON.stringify(window.__ordre.X.map(i => window.__segs.includes(i)))")
    note(x == "[true,true]", f"11e : paquet x chargé après l'accueil ({x})")
    # changement de classe dans les Réglages → 2e Collège
    await S.ev("screenSettings(), document.getElementById('level').click(), 1")
    await asyncio.sleep(0.4)
    await S.ev("[...document.querySelectorAll('#grade button')].find(b => b.dataset.v === '13').click(), 1")
    await asyncio.sleep(0.3)
    await S.ev("(document.querySelector('#track button[data-v=college]') || {click(){}}).click(), 1")
    await asyncio.sleep(0.3)
    await S.shot("11e_07_changement_classe")
    n0 = S.navs()
    await S.ev("window.__avant = 1; document.getElementById('next').click(), 1")
    q = await S.wait("!window.__avant && document.querySelector('#app .qtext') ? 1 : null", 40)
    await asyncio.sleep(1)
    ps = await S.ev("JSON.stringify(window.__packsAtStart) === JSON.stringify(window.__ordre.C['13']) && state.profile.grade === 13")
    note(bool(q) and ps is True and S.navs() - n0 == 1, f"changement 11e → 2e Collège : {S.navs()-n0} rechargement, code de la 2e, positionnement affiché")
    # retour à la même classe dans les Réglages : pas de rechargement
    note(None, "erreurs JS (11e) : " + json.dumps(S.erreurs())[:400])


async def sc_mp2(S):
    await premier_lancement(S, "MP2e", [
        "[...document.querySelectorAll('#dgrade button')].find(b => /^Sec/.test(b.innerText.trim())).click(), 1",
        "document.getElementById('go').click(), 1",
        "[...document.querySelectorAll('#grade button')].find(b => b.dataset.v === '13').click(), 1",
        "document.querySelector('#track button[data-v=mp]').click(), 1",
    ])
    ps = await S.ev("JSON.stringify(window.__packsAtStart) === JSON.stringify(window.__ordre.C['13mp'])")
    note(ps is True, "MP 2e : segments exécutés = ceux de la MP 2e")
    await seance(S, "MP2e", "MP-13")
    note(None, "erreurs JS (MP 2e) : " + json.dumps(S.erreurs())[:400])


async def sc_fr4(S):
    await S.goto(S.url + "#france")
    await S.wait(PRET)
    await asyncio.sleep(0.5)
    await premier_lancement(S, "4eFR", [
        "document.getElementById('go') && document.getElementById('go').click(), 1",
        "(() => { const b = document.querySelector('#sys button[data-v=FR]'); if (b) b.click(); return 1; })()",
        "[...document.querySelectorAll('#grade button')].find(b => b.dataset.v === '8').click(), 1",
    ])
    ps = await S.ev("JSON.stringify(window.__packsAtStart) === JSON.stringify(window.__ordre.C['FR']) && state.profile.system")
    note(ps == "FR", f"4e France : segments exécutés = ceux de la France ({ps})")
    await seance(S, "4eFR", "FR-8")
    note(None, "erreurs JS (4e FR) : " + json.dumps(S.erreurs())[:400])


async def sc_liens(S):
    """#q-, #decouvrir, #parents : premier visiteur (rien en mémoire) et élève placé ; hashchange dans l'app ouverte."""
    code = await S.ev("(async () => 1)()")
    for h in ["#decouvrir", "#parents", "#enseignants"]:
        await S.goto(S.url + h)
        ok = await S.wait(PRET, 30)
        await asyncio.sleep(1)
        m = await S.ev("__m2mMode()")
        t = await S.texte(120)
        note(bool(ok) and m == "tout" and S.navs() == 1, f"{h} (élève placé de 11e) : mode {m}, {S.navs()} chargement, écran {t[:90]!r}")
        await S.shot("lien_" + h[1:])
    # #q- : code d'une question réelle
    qc = await S.ev("Engine.finalize(state, 'rel', Engine.build('rel', 2, 11)).code")
    await S.goto(S.url + "#q-" + str(qc))
    ok = await S.wait("document.querySelector('#app .qtext') ? 1 : null", 30)
    await asyncio.sleep(1)
    note(bool(ok) and S.navs() == 1, f"#q-{qc} : question affichée, {S.navs()} chargement")
    await S.shot("lien_q")
    # app ouverte (élève), puis adresse changée → un rechargement avec tout le code
    await S.goto(S.url)
    await S.wait(ACCUEIL)
    await asyncio.sleep(1)
    n0 = S.navs()
    await S.ev("window.__avant = 1; location.hash = '#decouvrir', 1")
    ok = await S.wait("!window.__avant && __m2mMode() === 'tout' && document.querySelector('#app').firstElementChild ? 1 : null", 30)
    await asyncio.sleep(1)
    note(bool(ok) and S.navs() - n0 == 1, f"app ouverte → #decouvrir : {S.navs()-n0} rechargement, mode tout")
    # retour normal ensuite : code de la classe
    await S.goto(S.url)
    ok = await S.wait(ACCUEIL)
    await asyncio.sleep(1)
    m = await S.ev("__m2mMode() + ' ' + (JSON.stringify(window.__packsAtStart) === JSON.stringify(window.__ordre.C[String(state.profile.grade) + (state.profile.track === 'mp' && state.profile.grade >= 12 ? 'mp' : '')]))")
    note(bool(ok) and S.navs() == 1 and m == " true", f"réouverture après #decouvrir : code de la classe ({m!r}), {S.navs()} chargement")
    # nouveau visiteur sur #decouvrir puis « Commencer »
    await S.ev("localStorage.clear(), sessionStorage.clear(), 1")
    await S.goto(S.url + "#decouvrir")
    await S.wait(PRET)
    await asyncio.sleep(1)
    t = await S.ev("[...document.querySelectorAll('#app a, #app button')].map(b => b.innerText.trim()).filter(Boolean).slice(0, 12).join(' | ')")
    note(None, f"#decouvrir (nouveau visiteur) : boutons {t}")
    note(None, "erreurs JS (liens) : " + json.dumps(S.erreurs())[:400])


async def sc_horsligne(S):
    """Service worker installé par l'app (https) ; hors ligne : réouverture, changement de classe, lien #q-, #parents."""
    await S.ev("localStorage.clear(), 1")
    seed = """(() => { const s = Engine.newState({ system: "CH", grade: 11, track: "college", minutes: 5 }); Engine.autoInit(s);
      s.placed = true; s.tourDone = true; Store.save(s); return 1; })()"""
    await S.goto(S.url)
    await S.wait(PRET)
    await S.ev(seed)
    await S.goto(S.url)
    await S.wait(ACCUEIL)
    sw = await S.wait("navigator.serviceWorker && navigator.serviceWorker.controller ? 1 : (navigator.serviceWorker.ready.then(() => 0), null)", 60)
    if not sw:
        await S.goto(S.url); await S.wait(ACCUEIL)
        sw = await S.wait("navigator.serviceWorker.controller ? 1 : null", 30)
    note(bool(sw), "service worker enregistré par l'app (https) et actif")
    pq = await S.ev("caches.keys().then(ks => Promise.all(ks.map(k => caches.open(k).then(c => c.keys())))).then(rs => { const s = new Set(rs.flat().map(r => (/\\/(s[0-9]+\\.js)\\?/.exec(r.url) || [])[1]).filter(Boolean)); return s.size + '/' + window.__segNames.length; })")
    note(pq == "36/36", f"segments en cache : {pq}")
    await S.cdp.call("Network.emulateNetworkConditions", offline=True, latency=0, downloadThroughput=-1, uploadThroughput=-1)
    await S.goto(S.url)
    t0 = time.time()
    ok = await S.wait(ACCUEIL, 30)
    note(bool(ok), f"hors ligne : réouverture → accueil en {time.time()-t0:.1f} s")
    await S.shot("horsligne_accueil")
    # séance hors ligne (quelques questions)
    await seance(S, "horsligne11e", "CH-11")
    await S.ev("screenHome(), 1")
    # changement de classe hors ligne → MP 2e
    await S.ev("screenSettings(), document.getElementById('level').click(), 1")
    await asyncio.sleep(0.3)
    await S.ev("[...document.querySelectorAll('#grade button')].find(b => b.dataset.v === '13').click(), 1")
    await asyncio.sleep(0.3)
    await S.ev("document.querySelector('#track button[data-v=mp]').click(), 1")
    n0 = S.navs()
    await S.ev("window.__avant = 1; document.getElementById('next').click(), 1")
    q = await S.wait("!window.__avant && document.querySelector('#app .qtext') ? 1 : null", 30)
    t = await S.texte(150)
    note(bool(q) and S.navs() - n0 == 1, f"hors ligne : changement 11e → MP 2e : {S.navs()-n0} rechargement ; écran {t[:100]!r}")
    await S.shot("horsligne_changement")
    for h in ["#parents", "#q-" + str(await S.ev("Engine.finalize(state, 'rel', Engine.build('rel', 2, 11)).code"))]:
        await S.goto(S.url + h)
        ok = await S.wait(PRET, 30)
        await asyncio.sleep(1)
        t = await S.texte(120)
        note(bool(ok) and "Pas de connexion" not in t and S.navs() == 1, f"hors ligne : {h[:20]} → {t[:90]!r}")
    await S.cdp.call("Network.emulateNetworkConditions", offline=False, latency=0, downloadThroughput=-1, uploadThroughput=-1)
    note(None, "erreurs JS (hors ligne) : " + json.dumps(S.erreurs())[:400])


async def sc_maj(S, racine):
    """Nouvelle version publiée pendant que l'app est ouverte : ligne « Nouvelle version prête », Recharger, nouveau code."""
    seed = """(() => { const s = Engine.newState({ system: "CH", grade: 11, track: "college", minutes: 5 }); Engine.autoInit(s);
      s.placed = true; s.tourDone = true; Store.save(s); return 1; })()"""
    await S.goto(S.url)
    await S.wait(PRET)
    await S.ev(seed)
    await S.goto(S.url)
    await S.wait(ACCUEIL)
    await S.wait("navigator.serviceWorker.controller ? 1 : null", 60)
    await S.goto(S.url)
    await S.wait(ACCUEIL)
    await S.wait("Upd.reg ? 1 : null", 20)
    V = await S.ev("window.__ordre && document.querySelector('script[src^=\"start.js\"]').src.split('v=')[1]")
    # nouvelle version : même code, autre numéro (comme une publication)
    nv = "f00d" + V[4:]
    for f in ["index.html", "sw.js"]:
        p = racine / f
        p.write_text(p.read_text().replace(V, nv))
    # pendant une question : rien ; puis accueil
    await S.ev("startSession && (state.today = null, 1)")
    await S.ev("document.getElementById('go').click(), 1")
    await asyncio.sleep(0.8)
    await S.ev("Upd.reg.update().then(() => 1)")
    ok = await S.wait("Upd.ready ? 1 : null", 40)
    pend = await S.ev("!!document.querySelector('.upd-line') + ' ' + !!document.querySelector('#app .qtext, #app .lesson-card')")
    note(bool(ok) and pend == "false true", f"mise à jour trouvée pendant une question : rien affiché ({pend})")
    await S.ev("screenHome(), 1")
    await asyncio.sleep(0.3)
    lig = await S.ev("document.querySelector('.upd-line') ? document.querySelector('.upd-line').innerText : null")
    note(bool(lig), f"retour à l'accueil : ligne « {lig} »")
    await S.shot("maj_ligne")
    n0 = S.navs()
    await S.ev("window.__avant = 1; document.getElementById('updgo').click(), 1")
    ok = await S.wait("!window.__avant && document.querySelector('#app .home-head') ? 1 : null", 30)
    await asyncio.sleep(2)
    v2 = await S.ev("document.querySelector('script[src^=\"start.js\"]').src.split('v=')[1]")
    note(bool(ok) and v2 == nv and S.navs() - n0 == 1, f"« Recharger » : nouvelle version {v2} ({S.navs()-n0} rechargement, pas de boucle)")
    note(None, "erreurs JS (maj) : " + json.dumps(S.erreurs())[:400])


async def sc_transition(S, racine, ancien):
    """Élève qui a l'ANCIENNE version installée (service worker, cache) quand la nouvelle est publiée."""
    seed = """(() => { const s = Engine.newState({ system: "CH", grade: 11, track: "college", minutes: 5 }); Engine.autoInit(s);
      s.placed = true; s.tourDone = true; Store.save(s); return 1; })()"""
    await S.goto(S.url)
    await S.wait("typeof Engine !== 'undefined' && typeof Store !== 'undefined' ? 1 : null")
    await S.ev(seed)
    await S.goto(S.url)
    ok = await S.wait(ACCUEIL, 40)
    sw = await S.wait("navigator.serviceWorker.controller ? 1 : null", 60)
    if not sw:
        await S.goto(S.url); await S.wait(ACCUEIL); sw = await S.wait("navigator.serviceWorker.controller ? 1 : null", 30)
    note(bool(ok) and bool(sw), f"ancienne version {ancien} : accueil et service worker actif")
    await asyncio.sleep(2)
    # publication de la nouvelle version
    neuf = Path(str(racine) + "_neuf")
    for f in racine.iterdir():
        shutil.rmtree(f) if f.is_dir() else f.unlink()
    for f in neuf.iterdir():
        (shutil.copytree if f.is_dir() else shutil.copy2)(f, racine / f.name)
    # 1re ouverture après la publication (en ligne)
    await S.goto(S.url)
    t0 = time.time()
    ok = await S.wait(ACCUEIL, 40)
    await asyncio.sleep(3)
    m = await S.ev("typeof __m2mMode === 'function' ? 'segments ' + JSON.stringify(window.__packsAtStart) : 'ancienne page'")
    note(bool(ok), f"1re ouverture après publication : accueil en {time.time()-t0:.1f} s, {m}, {S.navs()} chargement(s), {await S.texte(80)!r}")
    await S.shot("transition_" + ancien + "_1")
    # attendre l'installation du nouveau service worker, puis 2e ouverture en ligne et hors ligne
    w = await S.wait("caches.keys().then(k => k.join(','))", 5)
    for _ in range(60):
        w = await S.ev("caches.keys().then(k => k.join(','))")
        if w and "abe8841079" in w and "," not in w: break
        await asyncio.sleep(1)
    note(None, f"caches après la mise à jour : {w}")
    await S.goto(S.url)
    ok = await S.wait(ACCUEIL, 40); await asyncio.sleep(1.5)
    m = await S.ev("typeof __m2mMode === 'function' ? JSON.stringify(window.__packsAtStart) === JSON.stringify(window.__ordre.C['11']) : 'ancienne page'")
    note(bool(ok) and m is True and S.navs() == 1, f"2e ouverture en ligne : nouvelle version, code de la 11e ({m}), {S.navs()} chargement(s)")
    await S.cdp.call("Network.emulateNetworkConditions", offline=True, latency=0, downloadThroughput=-1, uploadThroughput=-1)
    await S.goto(S.url)
    ok = await S.wait(ACCUEIL, 30); await asyncio.sleep(1)
    note(bool(ok), f"puis hors ligne : {await S.texte(80)!r}")
    await S.cdp.call("Network.emulateNetworkConditions", offline=False, latency=0, downloadThroughput=-1, uploadThroughput=-1)
    note(None, "erreurs JS (transition) : " + json.dumps(S.erreurs())[:400])


# ------------------------------------------------------------------ lancement
def serveur_https(directory, certdir):
    h = lambda *a, **k: mc.Handler(*a, directory=str(directory), **k)
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), h)
    ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    ctx.load_cert_chain(certdir / "c.pem", certdir / "k.pem")
    srv.socket = ctx.wrap_socket(srv.socket, server_side=True)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


def un_scenario(nom, fn, ancien=None):
    tmp = Path(tempfile.mkdtemp(prefix="m2m-charge-"))
    racine = tmp / "pub"
    if ancien:
        shutil.copytree(ROOT / "docs", Path(str(racine) + "_neuf"), ignore=shutil.ignore_patterns("_*"))
        racine.mkdir()
        subprocess.run(f"git -C {ROOT} archive {ancien} docs | tar -x -C {tmp} && cp -r {tmp}/docs/. {racine}/ && rm -rf {tmp}/docs", shell=True, check=True)
    else:
        shutil.copytree(ROOT / "docs", racine, ignore=shutil.ignore_patterns("_*"))
    subprocess.run(["openssl", "req", "-x509", "-newkey", "rsa:2048", "-nodes", "-days", "2", "-subj", "/CN=127.0.0.1",
                    "-keyout", str(tmp / "k.pem"), "-out", str(tmp / "c.pem")], capture_output=True, check=True)
    srv = serveur_https(racine, tmp)
    url = f"https://127.0.0.1:{srv.server_address[1]}/"
    port = mc.port_libre()
    base = Path.home() / "snap" / "chromium" / "common"
    profil = Path(tempfile.mkdtemp(prefix="m2m-charge-", dir=base if base.is_dir() else None))
    proc = subprocess.Popen(["nice", "timeout", "-k", "5", "600", "chromium", "--headless", "--disable-gpu", "--no-sandbox",
                             "--no-first-run", "--disable-extensions", "--ignore-certificate-errors", f"--remote-debugging-port={port}",
                             f"--user-data-dir={profil}", "--window-size=412,915", "about:blank"],
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)

    async def run():
        import websockets
        for _ in range(100):
            try:
                cible = [c for c in json.load(urllib.request.urlopen(f"http://127.0.0.1:{port}/json/list")) if c["type"] == "page"][0]
                break
            except Exception:
                await asyncio.sleep(0.2)
        async with websockets.connect(cible["webSocketDebuggerUrl"], max_size=2 ** 26) as ws:
            cdp = mc.CDP(ws)
            for d in ("Page", "Runtime", "Network"):
                await cdp.call(d + ".enable")
            await cdp.call("Network.setBlockedURLs", urls=["*script.google.com*"])
            await cdp.call("Emulation.setDeviceMetricsOverride", width=360, height=640, deviceScaleFactor=1, mobile=True)
            S = Sess(cdp, url)
            try:
                if nom == "maj":
                    await fn(S, racine)
                elif ancien:
                    await fn(S, racine, ancien)
                else:
                    await fn(S)
            except Exception as e:
                note(False, f"{nom} : exception du pilote {e!r}")
    try:
        asyncio.run(asyncio.wait_for(run(), 500))
    except Exception as e:
        note(False, f"{nom} : délai dépassé ou erreur {e!r}")
    finally:
        mc.fermer(port)
        try:
            os.killpg(proc.pid, 15); proc.wait(10)
        except Exception:
            pass
        srv.shutdown()
        shutil.rmtree(profil, ignore_errors=True)
        shutil.rmtree(tmp, ignore_errors=True)


SC = {"premier": sc_premier, "mp2": sc_mp2, "fr4": sc_fr4, "liens": None, "horsligne": sc_horsligne, "maj": sc_maj}

if __name__ == "__main__":
    noms = sys.argv[1:] or list(SC)
    for n in noms:
        print(f"── {n}", flush=True)
        if n.startswith("transition"):
            un_scenario(n, sc_transition, n.split(":")[1] if ":" in n else "784821d")
            continue
        if n == "liens":
            async def liens(S):
                seed = """(() => { const s = Engine.newState({ system: "CH", grade: 11, track: "college", minutes: 5 }); Engine.autoInit(s);
                  s.placed = true; s.tourDone = true; Store.save(s); return 1; })()"""
                await S.goto(S.url); await S.wait(PRET); await S.ev(seed)
                await sc_liens(S)
            un_scenario(n, liens)
        else:
            un_scenario(n, SC[n])
    print("\n".join(RES))
