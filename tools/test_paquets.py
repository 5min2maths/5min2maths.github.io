#!/usr/bin/env python3
"""Test de bout en bout du chargement par niveau (24.11, chantier F2) sur la version publiée (docs/).

Pilote un Chromium réel (protocole DevTools, outils de tools/mesure_chargement.py) servi en http local :
  1. nouvel élève : aucun paquet avant l'accueil, tous chargés ensuite en arrière-plan ;
  2. élève de 11e : paquets 9, 10 et 11 (et pas les autres) présents avant l'accueil ;
  3. changement de classe (2e Collège) : ensurePacks charge ce qu'il faut, les questions du niveau se construisent ;
  4. lien vers une question d'un autre niveau (#q-expo-2-3) : la question s'affiche (pas « Code inconnu ») ;
  5. aucune erreur JavaScript.
Usage : python3 tools/test_paquets.py   (sortie : « ok … » / « ÉCHEC … », code de retour 1 en cas d'échec)
"""
import asyncio, json, sys, urllib.request
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
    async with websockets.connect(cible["webSocketDebuggerUrl"], max_size=2 ** 26) as ws:
        cdp = mc.CDP(ws)
        for d in ("Page", "Runtime"):
            await cdp.call(d + ".enable")
        await cdp.call("Page.addScriptToEvaluateOnNewDocument", source="window.__err = []; addEventListener('error', (e) => __err.push((e.filename || '').split('/').pop() + ':' + e.lineno + ' ' + String(e.message)));")
        ev = lambda js: cdp.call("Runtime.evaluate", expression=js, awaitPromise=True, returnByValue=True)
        val = lambda r: (r.get("result", {}).get("result") or r.get("result", {})).get("value")

        # 1. nouvel élève
        await cdp.call("Page.navigate", url=url)
        await cdp.attendre("typeof Engine !== 'undefined' ? 1 : null")
        await ev("localStorage.clear(), 1")
        await cdp.call("Page.navigate", url=url)
        await cdp.attendre("window.__packsAtStart && typeof screenHome === 'function' ? 1 : null")
        a0 = val(await ev("JSON.stringify(window.__packsAtStart)"))
        ok(a0 == "[]", "nouvel élève : aucun paquet avant l'accueil (" + str(a0) + ")")
        tous = None
        for _ in range(100):
            tous = val(await ev("Object.keys(window.__packs).sort().join(',')"))
            if tous and len(tous.split(",")) == 10:
                break
            await asyncio.sleep(0.2)
        ok(tous and len(tous.split(",")) == 10, "nouvel élève : les 10 paquets chargés en arrière-plan (" + str(tous) + ")")  # 24.11 : paquet 15 (4e Collège) ; 27.11 : paquet x (histoires, curieux, présentations)

        # 2. élève de 11e
        await ev(mc.ETAT_HABITUE)
        await cdp.call("Page.navigate", url=url)
        await cdp.attendre("window.__packsAtStart && typeof screenHome === 'function' ? 1 : null")
        a1 = val(await ev("window.__packsAtStart.slice().sort().join(',')"))
        ok(a1 == "10,11,9", "élève de 11e : paquets 9, 10, 11 avant l'accueil (" + str(a1) + ")")
        h1 = val(await ev("!!document.querySelector('#app .hub')"))
        ok(h1, "élève de 11e : l'accueil s'affiche")
        # 27.11 (agent poids) : paquet « x » (histoires, curieux, présentations) : jamais avant l'accueil ; les cases l'ouvrent
        hx = val(await ev("new Promise((ok) => { document.querySelector('[data-door=hist]').click(); const t0 = Date.now(); (function w() { const e = document.querySelector('#app .eyebrow'); if (e && /Histoire des maths/.test(e.textContent)) ok(1); else if (Date.now() - t0 > 8000) ok(0); else setTimeout(w, 50); })(); })"))
        ok(hx == 1 and "x" not in (a1 or "").split(","), "élève de 11e : la case Histoire ouvre un récit (paquet x chargé à la demande)")
        await ev("screenHome(), 1")
        cx = val(await ev("new Promise((ok) => { document.querySelector('[data-door=cur]').click(); const t0 = Date.now(); (function w() { const a = document.querySelector('#app'); if (a && /pari|Pari/.test(a.textContent)) ok(1); else if (Date.now() - t0 > 8000) ok(a ? a.textContent.slice(0, 80) : 0); else setTimeout(w, 50); })(); })"))
        ok(cx == 1, "élève de 11e : la case Curieux ouvre une question curieuse (" + str(cx) + ")")
        await ev("screenHome(), 1")

        # 3. changement de classe (2e Collège)
        r = val(await ev("ensurePacks({ system: 'CH', grade: 13, track: 'college' }).then(() => { const ids = ['expo', 'eqrat', 'polydiv']; return ids.map((id) => { const q = Engine.build(id, 2, 5); return q && (q.q || q.parts) ? 1 : 0; }).join(''); })"))
        ok(r == "111", "changement de classe : questions de 2e Collège construites (" + str(r) + ")")
        # 24.11 : 4e du Collège (paquet 15)
        r4 = val(await ev("ensurePacks({ system: 'CH', grade: 15, track: 'college' }).then(() => { const ids = ['primitives', 'lnexp', 'binomiale']; return ids.map((id) => { const q = Engine.build(id, 2, 5); return q && (q.q || q.parts) ? 1 : 0; }).join('') + (window.__packs['15'] ? 'p' : ''); })"))
        ok(r4 == "111p", "4e Collège : paquet 15 chargé, questions construites (" + str(r4) + ")")

        # 3 bis. élève de MP 3e (24.11, src/ch_mp3.js et ch_mp4.js dans le paquet « mp ») : notions de l'année et questions
        r = val(await ev("ensurePacks({ system: 'CH', grade: 14, track: 'mp' }).then(() => { const p = { system: 'CH', grade: 14, track: 'mp' }, cur = Engine.catalog(p).filter((c) => c.current).map((c) => c.id); return (cur.includes('eqabs') && cur.includes('similmp') && !cur.includes('tauxvar') ? 'c' : '-') + ['eqabs', 'logdef', 'volmp', 'coordmp', 'sinusmp'].map((id) => { const q = Engine.build(id, 2, 7); return q && (q.q || q.parts) ? 1 : 0; }).join(''); })"))
        ok(r == "c11111", "élève de MP 3e : notions MP 3e de l'année, questions MP 3e et 4e construites (" + str(r) + ")")

        # 4. lien vers une question d'un autre niveau
        await ev("localStorage.clear(), 1")
        await cdp.call("Page.navigate", url=url + "#q-expo-2-3")
        await cdp.attendre("window.__packsAtStart && document.querySelector('#app') && document.querySelector('#app').textContent.length > 20 ? 1 : null")
        t = val(await ev("document.querySelector('#app').textContent.slice(0, 200)"))
        ok(t and "Code inconnu" not in t and "Résous" in t, "lien #q-expo-2-3 : la question s'affiche")

        # 4 bis. présentation …/#decouvrir (paquet x requis au démarrage)
        await cdp.call("Page.navigate", url="about:blank")
        await asyncio.sleep(0.3)
        await cdp.call("Page.navigate", url=url + "#decouvrir")
        await cdp.attendre("window.__packsAtStart && document.querySelector('#app') && document.querySelector('#app').textContent.length > 20 ? 1 : null")
        px = val(await ev("(window.__packsAtStart || []).join(',') + '|' + (typeof screenDecouvrir)"))
        ok(px and px.split("|")[0].split(",").count("x") == 1 and px.endswith("function"), "…/#decouvrir : paquet x chargé avant l'écran (" + str(px) + ")")

        # 5. erreurs JavaScript
        e = val(await ev("JSON.stringify(window.__err || [])"))
        ok(e == "[]", "aucune erreur JavaScript (" + str(e)[:160] + ")")


def main():
    mc.lancer(mc.DOCS, "index.html", lambda port, url: scenario(port, url))
    print("\n".join(RES))
    sys.exit(1 if any(r.startswith("ÉCHEC") for r in RES) else 0)


if __name__ == "__main__":
    main()
