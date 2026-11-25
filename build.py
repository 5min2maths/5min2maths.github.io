#!/usr/bin/env python3
"""Assemble l'app en un seul fichier HTML.
dist/5min2maths.html : page pour un lien claude.ai (sans <html>/<head>, ajoutés à la publication)
dist/index.html      : document complet, prêt pour un hébergement statique (GitHub Pages, Netlify…)
"""
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "src"
JS = ["curriculum.js", "ordre.js", "expr.js", "figures.js", "geo.js", "generators.js", "gen2.js", "gen3.js", "variantes.js", "defis_9.js", "defis_910.js", "defis_2c.js", "defis_sec2.js", "competences.js", "ch11_prop.js", "ch11_litt.js", "ch1c_eq.js", "ch1c_sys.js", "ch11_no.js", "ch11_gm.js", "ch11_ang.js", "ch11_thales.js", "ch11_proba.js", "ch1c_no.js", "ch1c_fct.js", "ch1c_alg.js", "ch1c_f2b.js", "ch11_no2.js", "ch1c_geo.js", "ch1c_trig.js", "ch_mp1.js", "ch11_fct.js", "ch10_no.js", "ch_mp2.js", "ch_mp3.js", "ch_mp4.js", "fr_lycee.js", "fr_2nde.js", "ch3c_ana.js", "ch3c_geo.js", "ch4c_ana.js", "ch2c.js", "ch1c_arg.js", "fr_college.js", "defis.js", "riche.js", "riche_11b.js", "riche_11c.js", "riche_1c.js", "riche_sys1c.js", "riche_9.js", "riche_10.js", "riche_mp2.js", "riche_mp1.js", "riche_2c.js", "riche_col34.js", "riche_mp34.js", "curieux.js", "histoire.js", "badges.js", "backup.js", "qr.js", "lessons.js", "lessons2.js", "dyn.js", "manip.js", "active.js", "act_prop11.js", "act_litt11.js", "act_eq1c.js", "act_sys1c.js", "act_ch11b.js", "act_ch11c.js", "act_9a.js", "act_9b.js", "act_10a.js", "act_10b.js", "act_11d.js", "act_1c.js", "act_mp2.js", "act_mp34.js", "act_2c.js", "act_col34.js", "act_col34b.js", "act_manip.js", "act_manip2.js", "sujet.js", "qcm.js", "engine.js", "parents.js", "presente.js", "app.js"]

head = """<title>5minutes2mathsparjour</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="Chaque jour, quelques minutes de maths, à ton niveau.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=JetBrains+Mono:wght@400;600&display=swap">
<style>
""" + (SRC / "style.css").read_text() + (SRC / "parents.css").read_text() + (SRC / "presente.css").read_text() + """
</style>
<script>
window.MathJax = { tex: { inlineMath: [["\\\\(", "\\\\)"]] }, svg: { fontCache: "global" }, startup: { typeset: false, ready() { MathJax.startup.defaultReady(); MathJax.startup.input[0].preFilters.add(({ math }) => { if (window.divSign) math.math = window.divSign(math.math); }); } } };
</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-svg.min.js"></script>
"""
body = '<main id="app" aria-live="polite"></main>\n<script>\n' + "\n".join((SRC / f).read_text() for f in JS) + "\n</script>\n"
# Version (23.11, erreurs JS) : empreinte du contenu, la même que celle du cache hors ligne (sw.js), injectée dans
# const BUILD de src/app.js ; calculée avant l'injection pour rester stable d'une construction à l'autre.
import hashlib
version = hashlib.sha1((head + body + (SRC / "pwa" / "sw.js").read_text()).encode()).hexdigest()[:10]
assert 'const BUILD = "dev";' in body
body = body.replace('const BUILD = "dev";', f'const BUILD = "{version}";', 1)

# 24.11 (confidentialité) : polices et MathJax hébergés avec l'app (docs/vendor/, licences dans docs/vendor/LICENCES.txt) :
# plus aucune requête vers Google Fonts ni Cloudflare depuis le site publié. Seule dist/5min2maths.html (aperçu claude.ai,
# un seul fichier sans dossier à côté) garde les adresses externes.
import re, shutil
VENDOR = ROOT / "docs" / "vendor"
assert (VENDOR / "mathjax" / "tex-svg.js").exists() and (VENDOR / "fonts" / "fonts.css").exists(), "docs/vendor incomplet"
GF = re.search(r'<link rel="preconnect" href="https://fonts\.googleapis\.com">.*?\n<link rel="stylesheet" href="https://fonts\.googleapis\.com/[^"]+">\n', head, re.S).group(0)
MJ_CDN = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-svg.min.js"
MJ = "vendor/mathjax/tex-svg.js"
fonts_css = re.sub(r"/\*.*?\*/\n?", "", (VENDOR / "fonts" / "fonts.css").read_text(), flags=re.S).replace("url(", "url(vendor/fonts/")
fonts_local = ('<link rel="preload" as="font" type="font/woff2" href="vendor/fonts/atkinson-400.woff2" crossorigin>\n'
               "<style>\n" + fonts_css + "</style>\n")
head_local = head.replace(GF, fonts_local).replace(MJ_CDN, MJ)
assert "googleapis" not in head_local and "cdnjs" not in head_local
(ROOT / "dist").mkdir(exist_ok=True)
(ROOT / "dist" / "5min2maths.html").write_text(head + body)
(ROOT / "dist" / "index.html").write_text(
    '<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
    + head_local + "</head>\n<body>\n" + body + "</body>\n</html>\n")
shutil.copytree(VENDOR, ROOT / "dist" / "vendor", dirs_exist_ok=True)
# Version GitHub Pages : application installable (manifeste, icônes, cache hors ligne)
# 23.11 (chantier F, chargement ; mesures : tools/mesure_chargement.py) : le code de l'app est servi à part
# (docs/app.js?v=<version>) : le navigateur garde alors le code déjà compilé d'une ouverture à l'autre (cache de code
# de V8, impossible pour un script en ligne de 4 Mo), et le service worker le met en cache dès l'installation.
# Polices : @font-face en ligne (docs/vendor/fonts, font-display: swap), police du texte préchargée ; MathJax :
# docs/vendor/mathjax, chargé par le chargeur ci-dessous (24.11) ; voir tools/chargement.md.
pwa_head = ('<link rel="manifest" href="manifest.webmanifest">\n<meta name="theme-color" content="#2457d6">\n'
            '<link rel="apple-touch-icon" href="icon-192.png">\n<meta name="apple-mobile-web-app-capable" content="yes">\n')
# 24.11 (chantier F2, chargement par niveau ; plan : tools/chargement.md) : docs/app.js = code commun ; un paquet par
# niveau (docs/p-<niveau>.js) ; docs/start.js = app.js (démarrage). Le chargeur en ligne charge les paquets requis pour
# le profil (son niveau et les niveaux inférieurs de sa filière), démarre l'app, puis charge les autres en arrière-plan.
def paquet(f):
    if f.startswith("fr_"): return "fr"
    if f in ("ch3c_ana.js", "act_col34.js", "act_col34b.js", "riche_col34.js"): return "14"  # 24.11 (25.11 : act_col34b.js, 2e série) : leçons actives et séries riches de 3e–4e Collège (paquet 14 : chargé en 3e et en 4e)
    if f == "ch3c_geo.js": return "14"  # 24.11 (agent c3geo) : géométrie vectorielle de l'espace, 3e Collège
    if f.startswith("ch4c"): return "15"  # 24.11 : 4e du Collège
    if f in ("ch_mp1.js", "ch_mp2.js"): return "12"  # 24.11 : versions récentes de notions partagées avec le Collège (sinlaw, trigfn, stats…) : chargées dès la 1re, toutes filières
    if f == "riche_mp2.js": return ""  # définit RX, outils communs aussi utilisés par riche_2c et riche_mp1
    if f == "act_mp2.js": return "13"  # 24.11 : leçons aussi utiles au Collège (droites, trigonométrie en 2e ; stats, quartiles en 4e)
    if f.startswith(("ch_mp", "riche_mp")) or f == "act_mp34.js": return "mp"
    if f.startswith(("ch1c", "riche_1c", "riche_sys1c")) or f in ("act_1c.js", "act_eq1c.js", "act_sys1c.js"): return "12"
    if f.startswith("riche_2c") or f == "act_2c.js": return "13"
    if f == "defis_2c.js": return "13"  # 25.11 : défis (niveau 4) propres à la 2e Collège (PROBX, co: [13])
    if f == "ch2c.js": return "13"  # 24.11 (agent niv2c) : niveaux de 2e Collège ; après le paquet 12 (ch_mp2.js redéfinit droites et trigeq)
    if f.startswith(("ch11", "riche_11", "act_ch11")) or f in ("act_prop11.js", "act_litt11.js", "act_11d.js"): return "11"
    if f in ("riche_9.js", "act_9a.js", "act_9b.js", "defis_9.js", "defis_910.js"): return "9"  # 25.11 : defis_9.js = défis propres à la 9e (PROBX)
    if f in ("riche_10.js", "act_10a.js", "act_10b.js", "ch10_no.js"): return "10"
    return ""
ORDRE_P = ["9", "10", "11", "12", "13", "14", "15", "mp", "fr"]
PAQ = {k: [f for f in JS if paquet(f) == k] for k in ORDRE_P}
app_js = (SRC / "app.js").read_text()
assert 'const BUILD = "dev";' in app_js
loader = """<script src="app.js?v=%(v)s"></script>
<script>
(function () {
  // Chargement par niveau (24.11). Paquets requis : le niveau de l'élève et les niveaux inférieurs de sa filière ;
  // France et liens de consultation (#q-, #l-, #auteur) : tout. Puis le reste en arrière-plan (hors ligne complet).
  var V = "%(v)s", K = %(keys)s, loaded = {}, pending = {};
  window.__packs = loaded; // pour les tests (tools/test_paquets.py)
  function need(p) {
    if (!p || p.system === "FR") return K.slice();
    var g = +p.grade || 9, r = [];
    ["9", "10", "11", "12", "13", "14", "15"].forEach(function (k) { if (+k <= g) r.push(k); });
    if (p.track === "mp") r.push("mp");
    return r;
  }
  function sync() { // recopies faites au chargement par lessons.js et engine.js (rappels et indices des paquets)
    try { if (typeof HINTS_EXTRA !== "undefined") Object.assign(HINTS, HINTS_EXTRA); } catch (e) {}
    try { if (typeof LESSONS_EXTRA !== "undefined") Object.keys(LESSONS_EXTRA).forEach(function (k) { if (typeof LESSONS_V2 === "undefined" || !LESSONS_V2[k]) LESSONS[k] = L_.apply(null, LESSONS_EXTRA[k]); }); } catch (e) {}
    try { window.dispatchEvent(new Event("m2m-pack")); } catch (e) {} // 24.11 : l'app met à jour une leçon ouverte trop tôt
  }
  window.loadPack = function (k) {
    if (loaded[k]) return Promise.resolve();
    if (pending[k]) return pending[k];
    return (pending[k] = new Promise(function (ok, ko) {
      var s = document.createElement("script"); s.src = "p-" + k + ".js?v=" + V;
      s.onload = function () { loaded[k] = 1; sync(); ok(); };
      s.onerror = function () { delete pending[k]; ko(new Error("paquet " + k)); };
      document.body.appendChild(s);
    }));
  };
  window.ensurePacks = function (p) { return need(p).reduce(function (pr, k) { return pr.then(function () { return loadPack(k); }); }, Promise.resolve()); };
  var st = null; try { st = JSON.parse(localStorage.getItem("5m2m.v1")); } catch (e) {}
  var first = /^#(q-|l-|auteur)/.test(location.hash) ? K.slice() : st && st.profile ? need(st.profile) : [];
  // MathJax (24.11) : chez un habitué il est en cache, on le charge tout de suite et l'app attend qu'il soit prêt
  // (pas de TeX brut à l'écran) ; pour une première visite, il vient après l'affichage (il ne prend pas la bande passante du code).
  function mathjax() { if (window.__mj) return; window.__mj = 1; var m = document.createElement("script"); m.src = "%(mj)s"; m.async = true; document.head.appendChild(m); }
  function mjReady(cb) { var t0 = Date.now(); (function w() { if ((window.MathJax && MathJax.typesetPromise) || Date.now() - t0 > 1500) cb(); else setTimeout(w, 30); })(); }
  if (st && st.profile) mathjax();
  function start() {
    window.__packsAtStart = Object.keys(loaded);
    var s = document.createElement("script"); s.src = "start.js?v=" + V;
    s.onload = function () { var rest = function () { K.reduce(function (pr, k) { return pr.then(function () { return loadPack(k).catch(function () {}); }); }, Promise.resolve()); };
      if ("requestIdleCallback" in window) requestIdleCallback(rest, { timeout: 3000 }); else setTimeout(rest, 1500); };
    if (st && st.profile) mjReady(function () { document.body.appendChild(s); }); else { document.body.appendChild(s); setTimeout(mathjax, 0); }
  }
  first.reduce(function (pr, k) { return pr.then(function () { return loadPack(k); }); }, Promise.resolve()).then(start, start);
})();
</script>
"""
head_docs = head_local.replace('<script src="' + MJ + '"></script>', "")
assert head_docs != head_local, "balise MathJax introuvable dans head"
docs_body = '<main id="app" aria-live="polite"></main>\n' + loader % {"v": version, "keys": str(ORDRE_P).replace("'", '"'), "mj": MJ}
(ROOT / "docs").mkdir(exist_ok=True)
(ROOT / "docs" / "index.html").write_text(
    '<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
    + pwa_head + head_docs + "</head>\n<body>\n" + docs_body + "</body>\n</html>\n")
# Code de l'app = le script de body, BUILD compris (même contenu que dist/).
PRE = '<main id="app" aria-live="polite"></main>\n<script>\n'
assert body.startswith(PRE) and body.endswith("\n</script>\n")
(ROOT / "docs" / "app.js").write_text("\n".join((SRC / f).read_text() for f in JS if not paquet(f) and f != "app.js") + "\n")
for k, fs in PAQ.items():
    (ROOT / "docs" / f"p-{k}.js").write_text("\n".join((SRC / f).read_text() for f in fs) + "\n")
(ROOT / "docs" / "start.js").write_text(app_js.replace('const BUILD = "dev";', f'const BUILD = "{version}";', 1))
(ROOT / "docs" / "sw.js").write_text((SRC / "pwa" / "sw.js").read_text().replace("__VERSION__", version))
for f in ("manifest.webmanifest", "icon-192.png", "icon-512.png"):
    shutil.copy(SRC / "pwa" / f, ROOT / "docs" / f)
(ROOT / "docs" / ".nojekyll").write_text("")
print("dist/5min2maths.html, dist/index.html et docs/index.html (GitHub Pages) :", round(len(head + body) / 1024), "Ko")
