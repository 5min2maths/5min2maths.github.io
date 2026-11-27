#!/usr/bin/env python3
"""Test de bout en bout du chargement de la version publiée (docs/), dans l'ordre des sources (27.11, agent ordre ;
avant : chargement par paquets du 24.11, chantier F2).

Pilote un Chromium réel (protocole DevTools, outils de tools/mesure_chargement.py) servi en http local :
  1. nouvel élève : seulement le code commun avant l'accueil, rien d'autre ensuite (sauf le paquet « x ») ;
  2. élève de 11e : exactement les segments de la 11e (ordre des sources) avant l'accueil ; cases Histoire et Curieux ;
  3. changement de classe (2e Collège, 4e Collège, MP 3e) : la page se recharge avec le code de la nouvelle classe, le
     positionnement démarre, les questions du niveau se construisent ;
  4. choix de classe d'un nouvel élève depuis l'écran de classe (bouton) : rechargement, positionnement ;
  5. liens #q-expo-2-3 (au démarrage et depuis l'app ouverte) et #decouvrir : tout le code, dans l'ordre ;
  6. aucune erreur JavaScript.
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

        err_total = []

        async def charge(u, cond="window.__packsAtStart && typeof screenHome === 'function' && document.querySelector('#app') && document.querySelector('#app').textContent.length > 20 ? 1 : null"):
            await cdp.call("Page.navigate", url="about:blank")
            await asyncio.sleep(0.2)
            await cdp.call("Page.navigate", url=u)
            return await cdp.attendre(cond)

        async def erreurs():
            e = val(await ev("JSON.stringify(window.__err || [])"))
            if e and e != "[]": err_total.append(e)

        async def apres_rechargement(js):
            """js déclenche un rechargement (ensurePacks) : on attend la nouvelle page démarrée."""
            await ev("window.__ancien = 1, 1")
            await ev(js)
            return await cdp.attendre("!window.__ancien && window.__packsAtStart && typeof screenHome === 'function' && document.querySelector('#app') && document.querySelector('#app').textContent.length > 20 ? 1 : null")

        # 1. nouvel élève
        await cdp.call("Page.navigate", url=url)
        await cdp.attendre("typeof Engine !== 'undefined' ? 1 : null")
        await ev("localStorage.clear(), sessionStorage.clear(), 1")
        await charge(url)
        D = json.loads(val(await ev("JSON.stringify(window.__ordre)")))
        sansx = lambda L: [i for i in L if i not in D["X"]]
        a0 = val(await ev("JSON.stringify(window.__packsAtStart)"))
        ok(json.loads(a0) == D["U"], "nouvel élève : seulement le code commun avant l'accueil (%d segments)" % len(json.loads(a0)))
        await asyncio.sleep(4)
        ap = json.loads(val(await ev("JSON.stringify(window.__segs)")))
        ok(sansx(ap) == D["U"] and all(i in ap for i in D["X"]), "nouvel élève : rien d'autre ensuite que le paquet x (" + str(len(ap)) + " segments)")
        await erreurs()

        # 2. élève de 11e
        await ev(mc.ETAT_HABITUE)
        await charge(url)
        a1 = json.loads(val(await ev("JSON.stringify(window.__packsAtStart)")))
        ok(a1 == D["C"]["11"], "élève de 11e : exactement les %d segments de la 11e, dans l'ordre, avant l'accueil" % len(a1))
        h1 = val(await ev("!!document.querySelector('#app .hub')"))
        ok(h1, "élève de 11e : l'accueil s'affiche")
        hx = val(await ev("new Promise((ok) => { document.querySelector('[data-door=hist]').click(); const t0 = Date.now(); (function w() { const e = document.querySelector('#app .eyebrow'); if (e && /Histoire des maths/.test(e.textContent)) ok(1); else if (Date.now() - t0 > 8000) ok(0); else setTimeout(w, 50); })(); })"))
        ok(hx == 1 and not any(i in a1 for i in D["X"]), "élève de 11e : la case Histoire ouvre un récit (paquet x à la demande)")
        await ev("screenHome(), 1")
        cx = val(await ev("new Promise((ok) => { document.querySelector('[data-door=cur]').click(); const t0 = Date.now(); (function w() { const a = document.querySelector('#app'); if (a && /pari|Pari/.test(a.textContent)) ok(1); else if (Date.now() - t0 > 8000) ok(a ? a.textContent.slice(0, 80) : 0); else setTimeout(w, 50); })(); })"))
        ok(cx == 1, "élève de 11e : la case Curieux ouvre une question curieuse (" + str(cx) + ")")
        await ev("screenHome(), 1")
        ap = json.loads(val(await ev("JSON.stringify(window.__segs)")))
        ok(sansx(ap) == D["C"]["11"], "élève de 11e : aucun autre segment exécuté après l'accueil")
        await erreurs()

        # 3. changement de classe : rechargement avec le code de la classe, positionnement, questions
        for prof, k, ids in ((("CH", 13, "college"), "13", ["expo", "eqrat", "polydiv"]), (("CH", 15, "college"), "15", ["primitives", "lnexp", "binomiale"]),
                             (("CH", 14, "mp"), "14mp", ["eqabs", "logdef", "volmp", "coordmp", "sinusmp"])):
            pj = "{ system: '%s', grade: %d, track: '%s', minutes: 5%s }" % (prof + (", niv: 'MA1'" if prof[1] >= 14 and prof[2] == "college" else "",))
            r = await apres_rechargement("ensurePacks(%s, true), 1" % pj)
            at = json.loads(val(await ev("JSON.stringify(window.__packsAtStart)")) or "null")
            g = val(await ev("state && state.profile ? state.profile.grade + state.profile.track : ''"))
            pl = val(await ev("!!(state && state.placement && state.placement.plan && state.placement.plan.length)"))
            q = val(await ev("%s.map((id) => { const q = Engine.build(id, 2, 7); return q && (q.q || q.parts) ? 1 : 0; }).join('')" % json.dumps(ids)))
            ok(r and at == D["C"][k] and g == "%d%s" % (prof[1], prof[2]) and pl and q == "1" * len(ids),
               "changement de classe → %s : rechargement avec ses %s segments, profil %s, positionnement %s, questions %s" % (k, len(at or []), g, pl, q))
            await erreurs()
        cur = val(await ev("(() => { const p = { system: 'CH', grade: 14, track: 'mp' }, cur = Engine.catalog(p).filter((c) => c.current).map((c) => c.id); return cur.includes('eqabs') && cur.includes('similmp') && !cur.includes('tauxvar') ? 'c' : '-'; })()"))
        ok(cur == "c", "élève de MP 3e : notions MP 3e de l'année")

        # 4. nouvel élève : choix de la classe à l'écran (bouton) → rechargement → positionnement de 10e
        await ev("localStorage.clear(), sessionStorage.clear(), 1")
        await charge(url)
        r = await apres_rechargement("(() => { draft = { system: 'CH', grade: 10, track: 'college', minutes: 5 }; screenLevel(); document.getElementById('next').click(); return 1; })()")
        at = json.loads(val(await ev("JSON.stringify(window.__packsAtStart)")) or "null")
        t = val(await ev("(state && state.profile ? state.profile.grade : 0) + '|' + !!(state && state.placement) + '|' + !!document.querySelector('#app .qtext, #app input, #app .choices')"))
        ok(r and at == D["C"]["10"] and t and t.startswith("10|true"), "nouvel élève → 10e : rechargement avec les segments de la 10e, positionnement (" + str(t) + ")")
        await erreurs()

        # 5. liens : tout le code, dans l'ordre
        tout = list(range(len(D["S"])))
        await charge(url + "#q-expo-2-3", "window.__packsAtStart && document.querySelector('#app') && document.querySelector('#app').textContent.length > 20 ? 1 : null")
        t = val(await ev("document.querySelector('#app').textContent.slice(0, 200)"))
        at = json.loads(val(await ev("JSON.stringify(window.__packsAtStart)")))
        ok(t and "Code inconnu" not in t and "Résous" in t and at == tout, "lien #q-expo-2-3 : tout le code dans l'ordre, la question s'affiche")
        await erreurs()
        await ev(mc.ETAT_HABITUE)
        await charge(url)
        await ev("window.__ancien = 1, 1")
        await ev("location.hash = '#q-expo-2-3', 1")
        r = await cdp.attendre("!window.__ancien && window.__packsAtStart && document.querySelector('#app') && /Résous/.test(document.querySelector('#app').textContent) ? 1 : null")
        at = json.loads(val(await ev("JSON.stringify(window.__packsAtStart)")) or "null")
        ok(r and at == tout, "lien #q-expo-2-3 depuis l'app ouverte (11e) : rechargement avec tout le code, la question s'affiche")
        await erreurs()
        await charge(url + "#decouvrir", "window.__packsAtStart && typeof screenDecouvrir === 'function' && document.querySelector('#app') && document.querySelector('#app').textContent.length > 20 ? 1 : null")
        at = json.loads(val(await ev("JSON.stringify(window.__packsAtStart)")) or "null")
        ok(at == tout, "…/#decouvrir : tout le code dans l'ordre avant l'écran")
        await erreurs()

        # 6. erreurs JavaScript
        ok(not err_total, "aucune erreur JavaScript (" + str(err_total)[:200] + ")")


def main():
    mc.lancer(mc.DOCS, "index.html", lambda port, url: scenario(port, url))
    print("\n".join(RES))
    sys.exit(1 if any(r.startswith("ÉCHEC") for r in RES) else 0)


if __name__ == "__main__":
    main()
