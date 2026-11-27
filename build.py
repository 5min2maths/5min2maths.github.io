#!/usr/bin/env python3
"""Assemble l'app en un seul fichier HTML.
dist/5min2maths.html : page pour un lien claude.ai (sans <html>/<head>, ajoutés à la publication)
dist/index.html      : document complet, prêt pour un hébergement statique (GitHub Pages, Netlify…)
"""
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "src"
JS = ["curriculum.js", "ordre.js", "expr.js", "figures.js", "geo.js", "generators.js", "gen2.js", "gen3.js", "variantes.js", "defis_9.js", "defis_910.js", "defis_2c.js", "defis_sec2.js", "competences.js", "referentiel.js", "trx.js", "ch11_prop.js", "ch11_litt.js", "ch1c_eq.js", "ch1c_sys.js", "ch11_no.js", "ch11_gm.js", "ch11_ang.js", "ch11_thales.js", "ch11_proba.js", "ch1c_no.js", "ch1c_fct.js", "ch1c_alg.js", "ch1c_f2b.js", "ch11_no2.js", "ch1c_geo.js", "ch1c_trig.js", "ch_mp1.js", "ch11_fct.js", "ch10_no.js", "ch_mp2.js", "ch_mp3.js", "ch_mp4.js", "fr_lycee.js", "fr_2nde.js", "ch3c_ana.js", "ch3c_geo.js", "ch4c_ana.js", "ch4c_trous.js", "ch2c.js", "ch1c_arg.js", "ch1c_trous.js", "ch1c_argact.js", "ch11_rep3d.js", "perco.js", "primaire.js", "fr_college.js", "fr_1re.js", "fr_3e.js", "fr_tle.js", "fr_fin.js", "fr_trous.js", "fr_couv.js", "ref_matu.js", "ref_fr.js", "ref_co.js", "ref_mp.js", "defis.js", "riche.js", "riche_11b.js", "riche_11c.js", "riche_1c.js", "riche_sys1c.js", "riche_9.js", "riche_10.js", "riche_mp2.js", "riche_mp1.js", "riche_2c.js", "riche_col34.js", "riche_mp34.js", "curieux.js", "histoire.js", "badges.js", "backup.js", "qr.js", "lessons.js", "lessons2.js", "dyn.js", "manip.js", "active.js", "act_prop11.js", "act_litt11.js", "act_eq1c.js", "act_sys1c.js", "act_ch11b.js", "act_ch11c.js", "act_9a.js", "act_9b.js", "act_10a.js", "act_10b.js", "act_11d.js", "act_1c.js", "act_mp2.js", "act_mp34.js", "act_2c.js", "act_col34.js", "act_col34b.js", "act_manip.js", "act_manip2.js", "fr_act.js", "sujet.js", "qcm.js", "engine.js", "parents.js", "presente.js", "app.js"]

# 26.11 : nom de l'app centralisé dans src/curriculum.js (APP_NAME, APP_TAGLINE, APP_SHORT, APP_TITLE), reporté ici dans
# le titre de la page et le manifeste de l'app installable.
import re as _re, json as _json
APP = dict(_re.findall(r'^const (APP_[A-Z]+) = "([^"]*)";', (SRC / "curriculum.js").read_text(), _re.M))
assert {"APP_NAME", "APP_TAGLINE", "APP_SHORT", "APP_TITLE"} <= set(APP), "constantes APP_* introuvables dans src/curriculum.js"
head = """<title>""" + APP["APP_TITLE"] + """</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content=\"""" + APP["APP_TAGLINE"] + """ : chaque jour, quelques minutes de maths, à ton niveau.">
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
body = '<main id="app"></main>\n<script>\n' + "\n".join((SRC / f).read_text() for f in JS) + "\n</script>\n"
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
            '<link rel="icon" href="favicon.svg" type="image/svg+xml">\n<link rel="icon" href="favicon-32.png" sizes="32x32">\n'
            '<link rel="apple-touch-icon" href="apple-touch-icon.png">\n<meta name="apple-mobile-web-app-capable" content="yes">\n'
            '<meta name="apple-mobile-web-app-title" content="' + APP["APP_SHORT"] + '">\n')
# 24.11 (chantier F2, chargement par niveau ; plan : tools/chargement.md) : docs/app.js = code commun ; un paquet par
# niveau (docs/p-<niveau>.js) ; docs/start.js = app.js (démarrage). Le chargeur en ligne charge les paquets requis pour
# le profil (son niveau et les niveaux inférieurs de sa filière), démarre l'app, puis charge les autres en arrière-plan.
def paquet(f):
    # 27.11 (agent poids, tools/poids.md) : histoires, questions curieuses et présentations = paquet « x », chargé en
    # arrière-plan après le premier écran ou à l'ouverture de leur page (withX, src/app.js) ; jamais avant le premier écran.
    if f in ("histoire.js", "curieux.js", "presente.js"): return "x"
    if f.startswith("fr_"): return "fr"
    if f in ("ch3c_ana.js", "act_col34.js", "act_col34b.js", "riche_col34.js"): return "14"  # 24.11 (25.11 : act_col34b.js, 2e série) : leçons actives et séries riches de 3e–4e Collège (paquet 14 : chargé en 3e et en 4e)
    if f == "ch3c_geo.js": return "14"  # 24.11 (agent c3geo) : géométrie vectorielle de l'espace, 3e Collège
    if f.startswith("ch4c"): return "15"  # 24.11 : 4e du Collège
    if f in ("ch_mp1.js", "ch_mp2.js"): return "12"  # 24.11 : versions récentes de notions partagées avec le Collège (sinlaw, trigfn, stats…) : chargées dès la 1re, toutes filières
    if f == "riche_mp2.js": return ""  # définit RX, outils communs aussi utilisés par riche_2c et riche_mp1
    if f == "act_mp2.js": return "13"  # 24.11 : leçons aussi utiles au Collège (droites, trigonométrie en 2e ; stats, quartiles en 4e)
    if f.startswith(("ch_mp", "riche_mp")) or f == "act_mp34.js": return "mp"
    if f == "ref_fr.js": return "fr"  # 25.11 : référentiel France (« Mes compétences » des profils France, 6e–Tle)
    if f == "ref_co.js": return "9"  # 25.11 (phase CO) : référentiel du PER (« Mes compétences » en 9e–11e ; paquet 9 : chargé dès la 9e)
    if f == "ref_mp.js": return "mp"  # 26.11 (phase MP) : objectifs du plan d'études MP (« Mes compétences » en MP 1re–4e)
    if f == "ref_matu.js": return "12"  # 25.11 : référentiel de compétences du Collège (« Mes compétences » en 1re–4e)
    if f.startswith(("ch1c", "riche_1c", "riche_sys1c")) or f in ("act_1c.js", "act_eq1c.js", "act_sys1c.js"): return "12"
    if f.startswith("riche_2c") or f == "act_2c.js": return "13"
    if f == "defis_2c.js": return "13"  # 25.11 : défis (niveau 4) propres à la 2e Collège (PROBX, co: [13])
    if f == "ch2c.js": return "13"  # 24.11 (agent niv2c) : niveaux de 2e Collège ; après le paquet 12 (ch_mp2.js redéfinit droites et trigeq)
    if f.startswith(("ch11", "riche_11", "act_ch11")) or f in ("act_prop11.js", "act_litt11.js", "act_11d.js"): return "11"
    if f == "primaire.js": return "9"  # 27.11 (agent primaire) : automatismes de fin de primaire, 9e en grande difficulté seulement
    if f in ("riche_9.js", "act_9a.js", "act_9b.js", "defis_9.js", "defis_910.js"): return "9"  # 25.11 : defis_9.js = défis propres à la 9e (PROBX)
    if f in ("riche_10.js", "act_10a.js", "act_10b.js", "ch10_no.js"): return "10"
    return ""
# 27.11 (agent ordre, tools/poids.md § « Ordre d'exécution ») : la version publiée exécute EXACTEMENT les sources dans
# l'ordre de JS (celui des pages de test et de dist/). Avant : code commun d'abord, paquets ensuite, donc des fichiers
# écrasés au lieu de remplacer (defis.js, act_manip2.js…) et, au premier écran, des générateurs provisoires.
# Désormais : JS découpé en SEGMENTS consécutifs (docs/sNN.js) ; pour chaque classe, le chargeur exécute, dans l'ordre
# des sources, le code commun et les segments des paquets de CLASSES[classe] (ci-dessous), tous AVANT l'app (start.js) ;
# rien d'autre ne s'exécute ensuite (plus de paquets en arrière-plan ; le service worker précache tout). Changement de
# classe (ou page qui a besoin de tout : liens #q-, #l-, présentations, espace parent, #auteur) : rechargement de la page
# avec le bon jeu de segments (ensurePacks). Le paquet « x » (histoires, curieux, présentations), indépendant, peut
# s'ajouter à la fin à la demande (withX). Contrôle : tools/poids.py ordre (dans la suite), tools/poids.py empreinte.
# CLASSES[c] = paquets (étiquettes de paquet()) dont dépendent les questions de la classe c, choisis avec
# tools/poids.py empreinte (questions, leçons, registres de la classe identiques à ceux des sources complètes).
NIV = ["9", "10", "11", "12", "13", "14", "15", "mp", "fr"]
CLASSES = {  # mesures du 27.11 (tools/poids.md) : paquets de la classe et des classes inférieures (chargeur du 24.11), plus
    # ceux qui redéfinissent ses notions : 10, 11, 12 en 9e–11e (ch10_no, ch11_*, ch1c_*) ; 13 en 1re (ch2c.js : absval) ;
    # fr en MP 2e–4e (fr_couv.js : quartiles). Vérifié par tools/poids.py ordre (suite de tests).
    "9": ["9", "10", "11", "12"], "10": ["9", "10", "11", "12"], "11": ["9", "10", "11", "12"],
    "12": ["9", "10", "11", "12", "13"], "13": ["9", "10", "11", "12", "13"],
    "14": ["9", "10", "11", "12", "13", "14"], "15": ["9", "10", "11", "12", "13", "14", "15"],
    "12mp": ["9", "10", "11", "12", "mp"], "13mp": ["9", "10", "11", "12", "13", "mp", "fr"],
    "14mp": ["9", "10", "11", "12", "13", "14", "mp", "fr"], "15mp": NIV, "FR": NIV,
}
TOUS = list(CLASSES)
assert all(set(v) <= set(NIV) for v in CLASSES.values())
def groupe(f):
    k = paquet(f)
    if k in ("", "x"): return k
    return ",".join(c for c in TOUS if k in CLASSES[c])  # paquets requis par les mêmes classes : un seul groupe
    # (un paquet requis par toutes les classes reste hors du code commun : pas chargé pour l'écran d'entrée d'un nouvel élève)
SEG = []  # [nom publié, groupe, fichiers]
for f in JS:
    if f == "app.js": continue  # = start.js
    g = groupe(f)
    if SEG and SEG[-1][1] == g: SEG[-1][2].append(f)
    else: SEG.append([None, g, [f]])
for i, s in enumerate(SEG): s[0] = "s%02d.js" % i
SEGS_DE = {c: [i for i, s in enumerate(SEG) if s[1] == "" or (s[1] not in ("", "x") and c in s[1].split(","))] for c in TOUS}
COMMUN = [i for i, s in enumerate(SEG) if s[1] == ""]
XS = [i for i, s in enumerate(SEG) if s[1] == "x"]
TOUT = list(range(len(SEG)))
for c in TOUS:  # chaque classe : exactement les sources de ses paquets, dans l'ordre de JS
    assert [f for i in SEGS_DE[c] for f in SEG[i][2]] == [f for f in JS if f != "app.js" and (paquet(f) == "" or paquet(f) in CLASSES[c])], c
assert [f for s in SEG for f in s[2]] + ["app.js"] == JS
app_js = (SRC / "app.js").read_text()
assert 'const BUILD = "dev";' in app_js
loader = """<script>
(function () {
  // Chargement dans l'ordre des sources (27.11, agent ordre ; build.py, tools/poids.md). S = segments (ordre de JS),
  // C = segments de chaque classe, X = paquet « x » (à la demande), U = code commun (nouvel élève).
  var V = "%(v)s", S = %(S)s, C = %(C)s, X = %(X)s, U = %(U)s, T = [], done = [], mode = "";
  for (var i = 0; i < S.length; i++) T.push(i);
  window.__segs = done; window.__segNames = S; window.__ordre = { S: S, C: C, X: X, U: U }; // pour les tests
  function cle(p) {
    if (!p || typeof p !== "object") return null;
    if (p.system === "FR") return C.FR ? "FR" : null;
    var g = +p.grade, k = g + (p.track === "mp" && g >= 12 ? "mp" : "");
    return C[k] ? k : null;
  }
  function segs(p) { var k = cle(p); return k ? C[k] : T; } // classe inconnue : tout (= sources complètes)
  function sansX(L) { return L.filter(function (i) { return X.indexOf(i) < 0; }); }
  function url(i) { return S[i] + "?v=" + V; }
  // Code exécuté identique à celui des sources pour cette classe (tout, ou exactement ses segments, dans l'ordre).
  window.packsOk = function (p) { if (mode === "tout") return true; var a = sansX(done), b = sansX(segs(p)); return a.length === b.length && a.every(function (x, j) { return x === b[j]; }); };
  window.__m2mMode = function () { return mode; };
  // Segments exécutés dans l'ordre de la liste (téléchargés en parallèle, async = false) ; échec si l'un manque.
  function charge(L) {
    var err = null;
    return Promise.all(L.filter(function (i) { return done.indexOf(i) < 0; }).map(function (i) {
      return new Promise(function (ok) { var s = document.createElement("script"); s.src = url(i); s.async = false;
        s.onload = function () { if (!err) done.push(i); ok(); }; s.onerror = function () { err = err || new Error(S[i]); ok(); }; document.body.appendChild(s); });
    })).then(function () { if (err) throw err; });
  }
  // Classe (classe = true) ou page qui a besoin de tout : si le code exécuté n'est pas exactement le bon, on vérifie que
  // les segments sont disponibles (cache hors ligne ou réseau), puis on recharge la page avec le bon jeu ; l'app reprend
  // le choix de classe (window.__reprise). Sinon (déjà le bon code) : tout de suite.
  window.ensurePacks = function (p, classe) {
    if (classe ? window.packsOk(p) : mode === "tout") return Promise.resolve();
    var L = classe ? segs(p) : T;
    return Promise.all(L.map(function (i) { return fetch(url(i)).then(function (r) { if (!r.ok) throw new Error(S[i]); }); })).then(function () {
      try { sessionStorage.setItem("m2m-ordre", JSON.stringify(classe ? { p: p } : { tout: 1 })); } catch (e) {}
      location.reload();
      return new Promise(function () {});
    });
  };
  // Paquet « x » à la demande, ajouté à la fin (indépendant du reste : rien ne le redéfinit, il ne redéfinit rien).
  var px = null;
  window.loadPack = function (k) {
    if (k !== "x") return Promise.reject(new Error("paquet " + k));
    if (!px) px = charge(X).then(function () { try { window.dispatchEvent(new Event("m2m-pack")); } catch (e) {} }, function (e) { px = null; throw e; });
    return px;
  };
  var st = null, o = null;
  try { st = JSON.parse(localStorage.getItem("5m2m.v1")); } catch (e) {}
  try { o = JSON.parse(sessionStorage.getItem("m2m-ordre")); sessionStorage.removeItem("m2m-ordre"); } catch (e) {}
  var first;
  if ((o && o.tout) || /^#(q-|l-|auteur|decouvrir|parents?\\b|enseignants)/.test(location.hash)) first = T;
  else if (o && o.p && cle(o.p)) { window.__reprise = o.p; first = segs(o.p); }
  else first = st && st.profile ? segs(st.profile) : U;
  if (first === T) mode = "tout";
  // MathJax (24.11) : chez un habitué il est en cache, on le charge tout de suite et l'app attend qu'il soit prêt
  // (pas de TeX brut à l'écran) ; pour une première visite, il vient après l'affichage (il ne prend pas la bande passante du code).
  function mathjax() { if (window.__mj) return; window.__mj = 1; var m = document.createElement("script"); m.src = "%(mj)s"; m.async = true; document.head.appendChild(m); }
  function mjReady(cb) { var t0 = Date.now(); (function w() { if ((window.MathJax && MathJax.typesetPromise) || Date.now() - t0 > 1500) cb(); else setTimeout(w, 30); })(); }
  if (st && st.profile) mathjax();
  function start() {
    window.__packsAtStart = done.slice();
    var s = document.createElement("script"); s.src = "start.js?v=" + V;
    s.onload = function () { var x = function () { window.loadPack("x").catch(function () {}); };
      if ("requestIdleCallback" in window) requestIdleCallback(x, { timeout: 3000 }); else setTimeout(x, 1500); };
    if (st && st.profile) mjReady(function () { document.body.appendChild(s); }); else { document.body.appendChild(s); setTimeout(mathjax, 0); }
  }
  // Un segment manquant (hors ligne, jamais mis en cache) : pas d'app à moitié chargée (elle servirait d'autres questions).
  function echec() {
    var a = document.getElementById("app");
    if (a) a.innerHTML = '<section class="card" style="margin:24px 16px"><h2>Pas de connexion</h2><p>L\\'app n\\'est pas encore entièrement sur cet appareil. Reconnecte-toi, puis réessaie.</p><button type="button" class="btn-primary" onclick="location.reload()">Réessayer</button></section>';
  }
  charge(first).then(start, echec);
})();
</script>
"""
head_docs = head_local.replace('<script src="' + MJ + '"></script>', "")
assert head_docs != head_local, "balise MathJax introuvable dans head"
J_ = lambda v: _json.dumps(v, separators=(",", ":"))
docs_body = '<main id="app"></main>\n' + loader % {"v": version, "S": J_([s[0] for s in SEG]), "C": J_(SEGS_DE), "X": J_(XS), "U": J_(COMMUN), "mj": MJ}
(ROOT / "docs").mkdir(exist_ok=True)
(ROOT / "docs" / "index.html").write_text(
    '<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
    + pwa_head + head_docs + "</head>\n<body>\n" + docs_body + "</body>\n</html>\n")
# Code de l'app = le script de body, BUILD compris (même contenu que dist/).
PRE = '<main id="app"></main>\n<script>\n'
assert body.startswith(PRE) and body.endswith("\n</script>\n")
# 27.11 (agent poids, tools/poids.md) : code publié minifié (tools/minijs.py : commentaires et indentation retirés,
# sauts de ligne gardés, donc mêmes numéros de ligne dans les erreurs JS ; chaînes, gabarits et regex intacts).
import sys as _sys
_sys.path.insert(0, str(ROOT / "tools")); _sys.dont_write_bytecode = True
from minijs import minify
def ecrire_js(nom, t): (ROOT / "docs" / nom).write_text(minify(t))
for vieux in list((ROOT / "docs").glob("p-*.js")) + list((ROOT / "docs").glob("s[0-9][0-9].js")) + [ROOT / "docs" / "app.js"]:
    vieux.unlink(missing_ok=True)  # anciens paquets (avant le 27.11) et segments d'une construction précédente
for nom, g, fs in SEG:
    ecrire_js(nom, "\n".join((SRC / f).read_text() for f in fs) + "\n")
ecrire_js("start.js", app_js.replace('const BUILD = "dev";', f'const BUILD = "{version}";', 1))
# Service worker : tous les segments dans le précache d'installation (hors ligne complet, toute classe, dès la 1re visite).
SW = (SRC / "pwa" / "sw.js").read_text()
assert '"./start.js?v=__VERSION__",' in SW
SW = SW.replace('"./start.js?v=__VERSION__",', '"./start.js?v=__VERSION__",\n  ' + ", ".join('"./%s?v=__VERSION__"' % s[0] for s in SEG) + ",", 1)
(ROOT / "docs" / "sw.js").write_text(SW.replace("__VERSION__", version))
# Données de tests/poids.html et de tools/poids.py (fichier généré, hors git) : tailles publiées brutes et gzip,
# segments (fichiers, groupe), segments de chaque classe.
import gzip
POIDS = {"files": {f.name: [len(b), len(gzip.compress(b, 9))] for f in sorted((ROOT / "docs").glob("*.js")) + [ROOT / "docs" / "index.html"] for b in [f.read_bytes()]},
         "seg": SEG, "classes": SEGS_DE, "paquets": CLASSES, "x": XS, "commun": COMMUN, "JS": JS}
(ROOT / "tests" / "_poids_data.js").write_text("window.POIDS = " + _json.dumps(POIDS) + ";\n")
for f in ("icon-192.png", "icon-512.png", "icon-maskable-192.png", "icon-maskable-512.png", "apple-touch-icon.png", "favicon-32.png", "favicon.svg"):  # 27.11 : logo Pépite² (tools/logo/gen_logos.py)
    shutil.copy(SRC / "pwa" / f, ROOT / "docs" / f)
MAN = _json.loads((SRC / "pwa" / "manifest.webmanifest").read_text())
MAN["name"], MAN["short_name"] = APP["APP_NAME"], APP["APP_SHORT"]
MAN["description"] = APP["APP_TAGLINE"] + " : chaque jour, quelques minutes de maths, à ton niveau."
(ROOT / "docs" / "manifest.webmanifest").write_text(_json.dumps(MAN, ensure_ascii=False, indent=2) + "\n")
(ROOT / "docs" / ".nojekyll").write_text("")
print("dist/5min2maths.html, dist/index.html et docs/index.html (GitHub Pages) :", round(len(head + body) / 1024), "Ko")
