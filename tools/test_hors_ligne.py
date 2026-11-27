#!/usr/bin/env python3
"""Test de la version publiée (docs/) sans service externe ni réseau (24.11, confidentialité).

Pilote un Chromium réel (outils de tools/mesure_chargement.py), docs/ servi en http local :
  1. élève de 11e : aucune requête vers une autre origine que le site (hors envois script.google.com, bloqués) ;
  2. les 4 polices de docs/vendor/fonts sont chargées (document.fonts) ;
  3. MathJax (docs/vendor/mathjax) compose une formule, y compris avec une extension chargée à la demande (\\boldsymbol) ;
  4. le service worker a mis en cache MathJax et les polices ; hors ligne, la page se recharge, l'accueil s'affiche
     et MathJax est prêt.
Usage : python3 tools/test_hors_ligne.py   (sortie : « ok … » / « ÉCHEC … », code de retour 1 en cas d'échec)
"""
import asyncio, json, re, sys, urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import mesure_chargement as mc  # noqa: E402

RES = []


def ok(cond, msg):
    RES.append(("ok " if cond else "ÉCHEC ") + msg)


async def scenario(port, url):
    import websockets
    for _ in range(100):
        try:
            cible = [c for c in json.load(urllib.request.urlopen(f"http://127.0.0.1:{port}/json/list")) if c["type"] == "page"][0]
            break
        except Exception:
            await asyncio.sleep(0.2)
    origine = url.rsplit("/", 1)[0]
    async with websockets.connect(cible["webSocketDebuggerUrl"], max_size=2 ** 26) as ws:
        cdp = mc.CDP(ws)
        for d in ("Page", "Runtime", "Network"):
            await cdp.call(d + ".enable")
        await cdp.call("Network.setBlockedURLs", urls=["*script.google.com*"])
        ev = lambda js: cdp.call("Runtime.evaluate", expression=js, awaitPromise=True, returnByValue=True)
        val = lambda r: (r.get("result", {}).get("result") or r.get("result", {})).get("value")

        # Élève de 11e déjà placé
        await cdp.call("Page.navigate", url=url)
        await cdp.attendre("typeof Engine !== 'undefined' && typeof Store !== 'undefined' ? 1 : null")
        await ev(mc.ETAT_HABITUE)
        cdp.events.clear()
        await cdp.call("Page.navigate", url=url)
        pret = await cdp.attendre("document.querySelector('#app .home-head') && window.MathJax && MathJax.typesetPromise ? 1 : null", 60)
        ok(bool(pret), "élève de 11e : accueil affiché et MathJax prêt")
        f = val(await ev(r"""(async () => { const d = document.createElement('div'); d.innerHTML = '\\(\\boldsymbol{v} = \\dfrac{3}{4}\\,\\mathbb{R}\\)';
          document.body.appendChild(d); await MathJax.typesetPromise([d]); const r = { svg: !!d.querySelector('svg'), err: !!d.querySelector('[data-mjx-error], merror') };
          d.remove(); return JSON.stringify(r); })()"""))
        ok(f == '{"svg":true,"err":false}', "MathJax compose \\boldsymbol (extension chargée à la demande) " + str(f))
        await ev("document.fonts.ready.then(() => 1)")
        polices = val(await ev("JSON.stringify([...document.fonts].filter(f => f.status === 'loaded').map(f => f.family.replace(/\"/g, '') + ' ' + f.weight).sort())"))
        familles = set(re.sub(r"( \d+)+$", "", p) for p in json.loads(polices or "[]"))
        ok({"Atkinson Hyperlegible", "Bricolage Grotesque", "JetBrains Mono"} <= familles,
           "polices chargées depuis le site : " + str(polices))
        await asyncio.sleep(1.5)
        await cdp.call("Runtime.evaluate", expression="1")
        urls = sorted(set(e["params"]["request"]["url"].split("?")[0] for e in cdp.events if e.get("method") == "Network.requestWillBeSent"))
        ext = [u for u in urls if not u.startswith(origine) and not u.startswith("data:") and "script.google.com" not in u]
        ok(not ext, "aucune requête vers un autre site " + (str(ext) if ext else f"({len(urls)} requêtes, toutes vers le site)"))
        ok(any("vendor/fonts/" in u for u in urls) and any("vendor/mathjax/tex-svg.js" in u for u in urls), "polices et MathJax demandés à docs/vendor/")

        # Service worker : cache complet, puis rechargement hors ligne
        # L'app n'enregistre le service worker qu'en https : on l'enregistre ici à la main (même fichier sw.js).
        await ev("navigator.serviceWorker.register('sw.js').then(() => navigator.serviceWorker.ready).then(() => 1)")
        await ev("window.__ancien = 1")
        await cdp.call("Page.reload")
        sw = await cdp.attendre("!window.__ancien && navigator.serviceWorker.controller ? 1 : null", 30)
        ok(bool(sw), "service worker actif")
        cache = val(await ev("caches.keys().then(ks => Promise.all(ks.map(k => caches.open(k).then(c => c.keys())))).then(rs => JSON.stringify(rs.flat().map(r => r.url.replace(location.origin, '')).filter(u => /vendor/.test(u))))"))
        ok(cache and "tex-svg.js" in cache and cache.count("woff2") >= 4, "MathJax et polices dans le cache hors ligne " + str(cache))
        # 27.11 (agent poids ; agent ordre : segments docs/sNN.js) : tous les segments précachés à l'installation du service worker
        pq = val(await ev("caches.keys().then(ks => Promise.all(ks.map(k => caches.open(k).then(c => c.keys())))).then(rs => { const s = new Set(rs.flat().map(r => (/\\/(s[0-9]+\\.js)\\?/.exec(r.url) || [])[1]).filter(Boolean)); return window.__segNames.filter(n => !s.has(n)).join(',') + '|' + s.size; })"))
        ok(pq and pq.startswith("|") and int(pq[1:]) > 5, "tous les segments dans le cache hors ligne (manquants|en cache : " + str(pq) + ")")
        await cdp.call("Network.emulateNetworkConditions", offline=True, latency=0, downloadThroughput=-1, uploadThroughput=-1)
        await ev("window.__ancien = 1")
        await cdp.call("Page.reload")
        hl = await cdp.attendre("!window.__ancien && document.querySelector('#app .home-head') && window.MathJax && MathJax.typesetPromise ? 1 : null", 40)
        ok(bool(hl), "hors ligne : accueil affiché et MathJax prêt")
        f2 = val(await ev(r"""(async () => { const d = document.createElement('div'); d.innerHTML = '\\(x^2 + \\sqrt{2}\\)'; document.body.appendChild(d);
          await MathJax.typesetPromise([d]); const r = !!d.querySelector('svg'); d.remove(); return r; })()"""))
        ok(f2 is True, "hors ligne : formule composée")
        # 27.11 (agent ordre) : hors ligne, changement de classe (rechargement avec le code de la 2e Collège, depuis le cache)
        await ev("window.__ancien = 1, 1")
        await ev("ensurePacks({ system: 'CH', grade: 13, track: 'college', minutes: 5 }, true), 1")
        hc = await cdp.attendre("!window.__ancien && window.__packsAtStart && state && state.profile && state.profile.grade === 13 && state.placement ? JSON.stringify(window.__packsAtStart) : null", 40)
        ok(bool(hc) and json.loads(hc) == val(await ev("window.__ordre.C['13']")), "hors ligne : changement de classe (2e Collège), code de la classe depuis le cache")
        await cdp.call("Network.emulateNetworkConditions", offline=False, latency=0, downloadThroughput=-1, uploadThroughput=-1)

        # Mentions légales : lien direct, Réglages, écran « Ce que l'app envoie »
        await cdp.call("Page.navigate", url="about:blank")
        await cdp.call("Page.navigate", url=url + "#confidentialite")
        ml = await cdp.attendre("typeof screenLegal === 'function' && document.querySelector('#app h2') ? document.querySelector('#app').innerText : null", 30)
        ok(bool(ml) and "Mentions légales" in ml and "à faire valider" in ml and ml.count("À COMPLÉTER") >= 8 and "Google LLC" in ml,
           "#confidentialite : mentions légales affichées (" + str(ml.count("À COMPLÉTER") if ml else 0) + " champs à compléter)")
        r = val(await ev("(screenSettings(), document.getElementById('legal').click(), document.querySelector('#app h2').innerText)"))
        ok(r and "Mentions légales" in r, "Réglages → mentions légales")
        r = val(await ev("(screenPrivacy(screenSettings), (document.querySelector('#app').innerText.match(/Cloudflare|Google Fonts/) || ['aucune'])[0] + ' / ' + (document.getElementById('legal').click(), document.querySelector('#app h2').innerText))"))
        ok(r and r.startswith("aucune /") and "Mentions légales" in r, "« Ce que l'app envoie » : plus de Cloudflare ni de Google Fonts, lien vers les mentions (" + str(r) + ")")


def main():
    docs = mc.DOCS
    if not (docs / "index.html").exists():
        sys.exit("docs/index.html absent : lancer d'abord python3 build.py")
    mc.lancer(docs, "index.html", scenario)
    print("\n".join(RES))
    sys.exit(1 if any(r.startswith("ÉCHEC") for r in RES) else 0)


if __name__ == "__main__":
    main()
