#!/usr/bin/env python3
"""Audit des « Retiens » des leçons actives (24.11, règle de l'enseignant du 15.11).

Une leçon active (src/active.js : devine / manipule / retiens) ne doit afficher dans « Retiens » que ce que les
défis ont présenté, avec le vocabulaire exact. Ce script :
1. génère tests/_retiens_audit.html (non commité) qui charge l'app et vide, pour chaque leçon active, le texte du
   « Retiens » réellement affiché (LESSONS[id] ou le champ retiens de la leçon, via actRetiens) et ses défis ;
2. le lance dans Chromium sans interface (nice) ;
3. découpe le « Retiens » en unités (phrases de la règle, chaque exemple, le piège) et cherche leurs mots-clés et
   leurs symboles dans le texte des défis (Devine, défis, messages de réussite et coups de pouce : le bloc de la leçon
   dans son fichier act_*.js) ;
4. écrit tools/audit-retiens.md (non commité) : les leçons classées par écart probable, unités suspectes en tête.

C'est une heuristique : un mot absent n'est pas forcément un écart (reformulation), et un mot présent ne garantit
pas que la règle a été présentée. La relecture reste humaine.

Usage : nice python3 tools/audit_retiens.py [fichier act_… …]   (sans argument : tous les fichiers)
"""
import json, re, subprocess, sys, unicodedata, html
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
JS = eval(re.search(r"JS = (\[.*?\])", (ROOT / "build.py").read_text(), re.S).group(1))

# ---------- 1. page de vidage ----------
mark = """<script>(function(){window.__F=window.__F||{};window.__S=window.__S||{};if(typeof ACTIVE==="undefined")return;
for(const k of Object.keys(ACTIVE)){const a=ACTIVE[k];if(window.__S[k]!==a){window.__S[k]=a;window.__F[k]=%s;}}})();</script>"""
page = ['<!doctype html><meta charset="utf-8"><main id="app"></main><script>window.MathJax={typesetPromise:()=>Promise.resolve()};</script>']
for f in JS:
    page.append('<script src="../src/%s"></script>' % f)
    if f == "active.js" or f.startswith("act_"):
        page.append(mark % json.dumps(f))
page.append("""<pre id="log"></pre><script>
const out={};
const strs=(o,d)=>{const r=[];if(d>4||o==null)return r;if(typeof o==="string")r.push(o);else if(typeof o==="function"){}else if(Array.isArray(o))o.forEach(x=>r.push(...strs(x,d+1)));else if(typeof o==="object")for(const k of Object.keys(o))r.push(...strs(o[k],d+1));return r;};
for(const id of Object.keys(ACTIVE)){try{const A=ACTIVE[id],L=LESSONS[id];if(!L){out[id]={file:__F[id],nolesson:true};continue;}
 const R=actRetiens(A,L),X=actPrep(A);
 out[id]={file:__F[id],titre:L.titre,own:!!A.retiens,regle:R.regle,exemple:R.exemple,piege:R.piege,mode:X.mode,
  predict:[A.predict.q,...A.predict.choices,A.predict.why],defis:A.defis,shown:X.defis,ostr:strs(A.play&&A.play.o,0)};}
 catch(e){out[(id)]={file:__F[id],err:String(e)};}}
document.getElementById("log").textContent=JSON.stringify(out);
</script>""")
(ROOT / "tests" / "_retiens_audit.html").write_text("".join(page))
dom = subprocess.run(["nice", "chromium", "--headless", "--disable-gpu", "--no-sandbox", "--virtual-time-budget=10000", "--dump-dom",
                      "file://%s/tests/_retiens_audit.html" % ROOT], capture_output=True, text=True, timeout=180).stdout
m = re.search(r'<pre id="log">(.*?)</pre>', dom, re.S)
DATA = json.loads(html.unescape(m.group(1)))

# ---------- 2. texte source de chaque leçon ----------
def blocks(fname):
    s = (SRC / fname).read_text()
    ids = [i for i, v in DATA.items() if v.get("file") == fname]
    pos = []
    for i in ids:
        for mm in re.finditer(r'(?:^\s*|[{,]\s*)%s: \{|set\("%s",' % (re.escape(i), re.escape(i)), s, re.M):
            pos.append((mm.start(), i))
    pos.sort()
    out = {}
    for k, (p, i) in enumerate(pos):
        end = pos[k + 1][0] if k + 1 < len(pos) else len(s)
        out[i] = out.get(i, "") + s[p:end]
    return out

SRCB = {}
for f in sorted({v.get("file") for v in DATA.values() if v.get("file")}):
    SRCB.update(blocks(f))

# ---------- 3. comparaison ----------
SUPS = str.maketrans("⁰¹²³⁴⁵⁶⁷⁸⁹⁻", "0123456789-")
def norm(t):
    t = html.unescape(re.sub(r"<[^>]+>", " ", t))
    t = t.replace("\\(", " ").replace("\\)", " ")
    t = re.sub(r"\\(?:d?frac)\{([^{}]*)\}\{([^{}]*)\}", r"(\1)/(\2)", t)
    t = re.sub(r"\\sqrt", " √", t)
    t = re.sub(r"\\(sin|cos|tan|ln|log|exp|det|lim|int|pi|sum|infty|cdot|times|neq|leq|geq|approx|mathbb|vec|overrightarrow)", r" \1 ", t)
    t = t.replace("π", " pi ").replace("∫", " int ").replace("∞", " infty ").replace("·", " cdot ").replace("×", " times ")
    t = re.sub(r"\\[a-zA-Z]+", " ", t).replace("{", " ").replace("}", " ")
    t = t.translate(SUPS)
    t = "".join(c for c in unicodedata.normalize("NFD", t.lower()) if unicodedata.category(c) != "Mn")
    return t

STOP = set("""avec dans pour sont cela cette ceux elle elles leur leurs aussi alors donc mais comme plus moins tout tous toute toutes
fait faire etre avoir entre chaque meme autre autres deux trois quand dont celui celle encore ainsi deja tres bien peut
peuvent doit sans sous selon vers puis ensuite enfin ici voici quel quelle quels quelles nombre nombres valeur egal egale
donne donnent obtient obtenir calcule calculer exemple attention piege toujours jamais rien seul seule premier premiere
second seconde fois ligne cote cotes""".split())
MATHW = ["sin", "cos", "tan", "ln", "log", "exp", "det", "lim", "int", "pi", "√", "infty", "%", "°"]

def toks(t):
    n = norm(t)
    w = {x[:6] for x in re.findall(r"[a-z]{4,}", n) if x not in STOP}
    m = {x for x in MATHW if re.search(r"(?<![a-z])%s(?![a-z])" % re.escape(x), n)}
    return w, m

def units(v):
    u = []
    for s in re.split(r"(?<=[.;])\s+(?=[A-ZÀÂÉÈÊÎÔÛÇ0-9«\\])", v["regle"]):
        if s.strip(): u.append(("règle", s))
    for e in v["exemple"]: u.append(("exemple", e))
    u.append(("piège", v["piege"]))
    return u

only = set(sys.argv[1:])
rows = []
for id_, v in DATA.items():
    if "regle" not in v: continue
    if only and v["file"] not in only: continue
    corpus = " ".join(v["predict"] + v["defis"] + v["ostr"]) + " " + SRCB.get(id_, "")
    cw, cm = toks(corpus)
    cn = norm(corpus)
    bad = []
    for kind, u in units(v):
        w, m = toks(u)
        mw, mm = sorted(w - cw), sorted(m - cm)
        cov = 1 - len(mw) / max(1, len(w))
        if mm or (len(w) >= 3 and cov < 0.6):
            bad.append((kind, round(cov, 2), mw, mm, re.sub(r"\s+", " ", u)[:220]))
    drop = [d for d in v["defis"] if d not in v["shown"]]
    score = sum(len(b[2]) + 3 * len(b[3]) for b in bad)
    rows.append((score, id_, v, bad, drop))

rows.sort(key=lambda r: (-r[0], r[1]))
L = ["# Audit des « Retiens » (heuristique, %d leçons)\n" % len(rows),
     "Score = mots absents des défis + 3 × symboles absents (sin, ln, det, π, %…). À relire à la main.\n"]
for score, id_, v, bad, drop in rows:
    if not bad and not drop: continue
    L.append("\n## %s (%s, %s) · score %d%s · %s" % (id_, v["file"], v["mode"], score, " · retiens propre" if v["own"] else "", v["titre"]))
    if drop: L.append("- mode « À toi » : défis non montrés : " + " / ".join(d[:80] for d in drop))
    for kind, cov, mw, mm, u in bad:
        L.append("- **%s** (%.0f %%) %s%s · « %s »" % (kind, 100 * cov, ("symboles absents " + ", ".join(mm) + " ; ") if mm else "", "mots absents " + ", ".join(mw) if mw else "", u))
(ROOT / "tools" / "audit-retiens.md").write_text("\n".join(L) + "\n")
print("leçons auditées :", len(rows), "· avec écart probable :", sum(1 for r in rows if r[3]), "· score total :", sum(r[0] for r in rows))
for score, id_, v, bad, drop in rows[:40]:
    if bad: print("%4d %-14s %s" % (score, id_, v["file"]))
