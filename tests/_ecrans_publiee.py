#!/usr/bin/env python3
"""Captures des écrans de la VERSION PUBLIÉE (docs/, servie en local) aux tailles ordinateur / tablette / téléphone
(27.11, agent eleves8 ; outil hors suite). Un seul Chromium, une taille après l'autre.
Usage : python3 tests/_ecrans_publiee.py [taille…]   (ex. 1440x900 820x1180:tab) → tests/_shots/pub/<L>x<H>_<écran>.png
et tests/_shots/pub/mesures.txt (débordements, petits textes, réponse visible sans défiler, colonnes).
"""
import asyncio, base64, json, sys, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
import mesure_chargement as mc  # noqa: E402

import os
OUT = ROOT / "tests" / "_shots" / os.environ.get("SHOTS", "pub")
TAILLES = sys.argv[1:] or ["1440x900", "1280x800", "1024x768", "820x1180:tab", "1180x820:tab", "360x640"]

SEED = r"""(() => { localStorage.clear(); const s = Engine.newState({ system: "CH", grade: 11, track: "college", minutes: 5 }); Engine.autoInit(s);
  s.placed = true; s.tourDone = true; s.firstDone = true; s.doorHints = 9; Store.save(s); return 1; })()"""

PREP = r"""(() => {
  window.__k = 1;
  document.head.insertAdjacentHTML("beforeend", "<style>*, *::before, *::after { animation: none !important; transition: none !important; }</style>");
  let s = 20261127; Math.random = () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  window.confirm = () => true;
  window.__opt = (o) => Object.assign({ eyebrow: "Séance · question 2 sur 5", onDone: () => 3, onNext: () => 0, onNotYet: () => 0, onEasy: () => 0, track: "" }, o || {});
  window.__qWith = (pred) => { for (const n of NOTIONS) for (const d of [2, 1, 3]) { let q = null; try { q = Engine.build(n.id, d, 11); } catch (e) {} if (q && pred(q)) return Engine.finalize(state, n.id, q); } return null; };
  window.__clean = () => { document.querySelectorAll("#tour, .collector-bg").forEach((t) => t.remove()); window.scrollTo(0, 0); };
  window.__door = (d) => { session = null; homeTab = "today"; screenHome(); app.querySelector('[data-door="' + d + '"]').click(); };
  /* carnet : trois erreurs (comme après une séance ratée) */
  let k = 0; for (const n of NOTIONS) { if (k >= 3) break; let q = null; try { q = Engine.build(n.id, 2, 5); } catch (e) {} if (q && q.code && !q.parts && carnetAdd(n.id, 2, q.code, "Tu as additionné au lieu de multiplier.", "12")) k++; }
  save();
  return 1; })()"""

ECRANS = {
    "accueil": "session = null; homeTab = 'today'; screenHome();",
    "figure": "renderQuestion(__qWith((q) => q.fig && !q.parts && String(q.q).length > 60 && /<svg/.test(q.fig)), __opt());",
    "pave": "renderQuestion(__qWith((q) => !q.fig && !q.parts && q.spec && q.spec.kind === 'value'), __opt());",
    "probleme": "session = { plan: ['x'], i: 0, score: 0, answered: 0, start: Date.now(), elo0: state.elo.r, ids: new Set(), weekly: true }; let q = null; for (const n of NOTIONS) { if (!hasProb(n.id)) continue; try { q = Engine.make(state, n.id, 4); } catch (e) { q = null; } if (q && q.parts && q.parts.length >= 3 && String(q.q).length > 120) break; } renderQuestion(q, __opt({ eyebrow: '🔍 Problème de la semaine' }));",
    "lecon": "screenLesson(ACTIVE.fractout ? 'fractout' : Object.keys(ACTIVE)[0], () => {});",
    "lecon_s2": "screenLesson(ACTIVE.fractout ? 'fractout' : Object.keys(ACTIVE)[0], () => {}); (document.querySelector('#pc button') || {click(){}}).click(); (document.getElementById('tryopt') || {click(){}}).click();",
    "bilan": "session = { fmt: 'revision', plan: ['eq1|1|rev', 'eq1|1|rev', 'eq1|1|rev', 'eq1|1|rev'], i: 4, score: 3, answered: 4, start: Date.now() - 300000, elo0: state.elo.r - 12, ids: new Set(['eq1']) }; screenSummary();",
    "competences": "screenComps();",
    "reglages": "screenSettings();",
    "progres": "__door('prog');",
    "histoire": "__door('hist');",
    "histoire_recit": "__door('hist'); (app.querySelector('.hist-card, [data-k], .card button, button.hist') || {click(){}}).click();",
    "curieux": "__door('cur');",
    "carnet": "__door('carnet');",
    "evaluation": "__door('test'); (document.getElementById('prep') || {click(){}}).click();",
    "probleme_porte": "__door('prob');",
    "figure_retour": "renderQuestion(__qWith((q) => q.fig && !q.parts && String(q.q).length > 60 && /<svg/.test(q.fig)), __opt()); const i = document.getElementById('ans'); i.value = '1'; i.dispatchEvent(new Event('input')); document.getElementById('check').click(); i.value = '2'; i.dispatchEvent(new Event('input')); document.getElementById('check').click();",
    "pave_juste": "const q = __qWith((q) => !q.fig && !q.parts && q.spec && q.spec.kind === 'value'); renderQuestion(q, __opt()); const i = document.getElementById('ans'); i.value = String(q.spec.value).replace('.', ','); i.dispatchEvent(new Event('input')); document.getElementById('check').click();",
    "guide": "renderQuestion(__qWith((q) => q.guide && q.guide.length >= 2 && !q.parts), __opt()); document.getElementById('idk').click(); (document.getElementById('guide') || {click(){}}).click();",
}

MESURE = r"""(() => {
  const W = innerWidth, H = innerHeight, r = [], H5 = document.documentElement;
  r.push("classe " + H5.className);
  if (H5.scrollWidth > W + 1) r.push("DÉBORDE page " + H5.scrollWidth);
  const over = [];
  for (const el of document.querySelectorAll("#app *")) {
    const b = el.getBoundingClientRect(); if (!b.width) continue;
    if (b.right <= W + 1 && b.left >= -1) continue;
    let p = el.parentElement, clip = false; while (p && p !== document.body) { if (getComputedStyle(p).overflowX !== "visible") { clip = true; break; } p = p.parentElement; }
    if (!clip && !el.closest("details:not([open])")) over.push((el.id || String(el.className).split(" ")[0] || el.tagName) + " " + Math.round(b.left) + "→" + Math.round(b.right));
  }
  if (over.length) r.push("DÉBORDE " + over.slice(0, 4).join(" | "));
  const small = new Set();
  for (const el of document.querySelectorAll("#app *")) { if (!el.childNodes.length || ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue; const b = el.getBoundingClientRect(); if (!b.width || el.closest("details:not([open])")) continue; const fs = parseFloat(getComputedStyle(el).fontSize); if (fs < 12.5) small.add(Math.round(fs) + "px:" + (el.textContent.trim().slice(0, 18))); }
  if (small.size) r.push("petit texte " + [...small].slice(0, 5).join(" | "));
  const tiny = [...document.querySelectorAll("#app button, .qbar button")].filter((b) => { const q = b.getBoundingClientRect(); return q.width && q.height < 30 && !b.closest("details:not([open])"); }).map((b) => Math.round(b.getBoundingClientRect().height) + ":" + (b.innerText || b.getAttribute("aria-label") || "").trim().slice(0, 12));
  if (tiny.length) r.push("boutons < 30 px " + tiny.slice(0, 6).join(" | "));
  const vis = (e) => e && e.getBoundingClientRect().width > 0;
  const a = [...document.querySelectorAll("#ans, #p0, #app input[type=text], #app input:not([type])")].find(vis), c = document.getElementById("check") || [...document.querySelectorAll("#app button, .qbar button")].find((b) => vis(b) && /^\s*(Vérifier|Valider)/.test(b.innerText));
  if (a && c) { const ra = a.getBoundingClientRect(), rc = c.getBoundingClientRect(); r.push("réponse bas " + Math.round(ra.bottom) + " / Vérifier bas " + Math.round(rc.bottom) + " / H " + H + (rc.bottom > H || ra.bottom > H ? " → DÉFILER" : "")); }
  const L = document.querySelector(".q-l"), R = document.querySelector(".q-r");
  if (L && R) r.push("colonnes " + Math.round(L.getBoundingClientRect().width) + "×" + Math.round(L.scrollHeight) + " / " + Math.round(R.getBoundingClientRect().width) + "×" + Math.round(R.scrollHeight));
  const E = document.querySelector(".e-cols"); if (E) r.push("e-cols " + Math.round(E.getBoundingClientRect().width) + " h " + Math.round(E.getBoundingClientRect().height));
  const kp = document.querySelector(".keypad"); if (kp) { const k = kp.getBoundingClientRect(); r.push("pavé " + Math.round(k.left) + "," + Math.round(k.top) + " " + Math.round(k.width) + "×" + Math.round(k.height)); }
  const fig = document.querySelector(".figwrap svg, #app svg.fig"); if (fig) { const f = fig.getBoundingClientRect(); r.push("figure " + Math.round(f.width) + "×" + Math.round(f.height)); }
  r.push("hauteur page " + H5.scrollHeight);
  const h2 = document.querySelector("#app h2"); r.push("titre « " + (h2 ? h2.innerText.slice(0, 40) : (app.innerText || "").slice(0, 40).replace(/\s+/g, " ")) + " »");
  return r.join(" ; ");
})()"""


async def run(port, url):
    import websockets
    for _ in range(100):
        try:
            cible = [c for c in json.load(__import__("urllib.request").request.urlopen(f"http://127.0.0.1:{port}/json/list")) if c["type"] == "page"][0]
            break
        except Exception:
            await asyncio.sleep(0.2)
    OUT.mkdir(parents=True, exist_ok=True)
    lignes = []
    async with websockets.connect(cible["webSocketDebuggerUrl"], max_size=2 ** 27) as ws:
        cdp = mc.CDP(ws)
        for d in ("Page", "Runtime"):
            await cdp.call(d + ".enable")
        ev = lambda js: cdp.call("Runtime.evaluate", expression=js, awaitPromise=True, returnByValue=True)
        val = lambda r: (r.get("result", {}) or {}).get("value", r.get("exceptionDetails", {}).get("exception", {}).get("description", "?"))
        for t in TAILLES:
            sz, ec = (t.split(":") + ["auto"])[:2]
            w, h = map(int, sz.split("x"))
            await cdp.call("Emulation.setDeviceMetricsOverride", width=w, height=h, deviceScaleFactor=1, mobile=w < 500)
            await cdp.call("Page.navigate", url=url)
            await cdp.attendre("typeof Engine !== 'undefined' && typeof Store !== 'undefined' ? 1 : null")
            await ev(SEED)
            await ev("localStorage.setItem('m2m-ui', JSON.stringify({ fs: 1, vib: true, ecran: %s })), 1" % json.dumps(ec))
            await cdp.call("Page.navigate", url=url)
            await cdp.attendre("document.querySelector('#app .home-head') && window.MathJax && MathJax.typesetPromise ? 1 : null")
            await cdp.attendre("window.__ordre.X.every(i => window.__segs.includes(i)) ? 1 : null", 20)
            await ev(PREP)
            for nom, js in ECRANS.items():
                r = await ev("(async () => { try { %s } catch (e) { return 'EXC ' + e.message; } __clean(); if (window.MathJax && MathJax.typesetPromise) await MathJax.typesetPromise([app]).catch(() => 0); await new Promise(r => setTimeout(r, 250)); __clean(); return 'ok'; })()" % js)
                v = val(r)
                m = val(await ev(MESURE))
                shot = await cdp.call("Page.captureScreenshot", format="png")
                f = OUT / f"{sz}_{nom}.png"
                f.write_bytes(base64.b64decode(shot["data"]))
                lignes.append(f"{sz}{'(tab)' if ec == 'tab' else ''} {nom} : {v if v != 'ok' else ''}{m}")
                print(lignes[-1], flush=True)
    (OUT / "mesures.txt").write_text("\n".join(lignes) + "\n")


if __name__ == "__main__":
    mc.lancer(Path(os.environ["DOCS"]) if os.environ.get("DOCS") else mc.DOCS, "index.html", run)
