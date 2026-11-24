"""Génère tests/riche2.html (banques riches du secondaire II, 23.11) à partir de la liste JS de build.py."""
import re
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
JS = re.search(r"JS = \[(.*?)\]", (ROOT / "build.py").read_text()).group(1)
files = re.findall(r'"([^"]+)"', JS)
scripts = "".join(f'<script src="../src/{f}"></script>' for f in files)
BANKS = ["affmp2", "trigmp2", "statmp2", "cnmp1", "no1c", "cart2c", "poly2c", "rat2c", "exp2c", "compo2c", "log2c", "tri2c", "trigfn2c", "vec2c", "eqmp3", "logmp3", "volmp3", "vecmp4", "fctmp4"]
# chapitre (ids) -> banque attendue, profil
CHAPS = [
    ("affine droites recipaff affzero modaff droitesinter", "affmp2", "mp"),
    ("trigcercle trigfn sinlaw trigeq trigassoc trigeq2 triaire", "trigmp2", "mp"),
    ("statfreq stats quartiles", "statmp2", "mp"),
    ("ensembles vabs fracadd rel arith fracmul puiss rac ratden divcrit premiers fracsimp fracops pctvar", "cnmp1", "mp1"),
    ("racprop", "no1c", "col1"),
    ("droites cart droitesinter cercle cercletan", "cart2c", "col"),
    ("ineq polydiv polyfact polyexpr", "poly2c", "col"),
    ("ineqfrac valint fracrat fracetage eqrat probrat homog homogrec", "rat2c", "col"),
    ("expo expfrac modexp", "exp2c", "col"),
    ("absval morceaux compo decomp bijection recip", "compo2c", "col"),
    ("log logbase", "log2c", "col"),
    ("sinlaw triaire", "tri2c", "col"),
    ("trigrel trigcercle trigassoc trigeq trigfn trigeq2", "trigfn2c", "col"),
    ("vecteurs", "vec2c", "col"),
    # MP 3e et MP 4e (24.11, src/riche_mp34.js)
    ("eqabs eqbic eqirrmp eqratmp", "eqmp3", "mp"),
    ("puisrat logdef logprop", "logmp3", "mp"),
    ("eqexp eqlog croissexp", "logmp3", "mp"),
    ("volmp similmp", "volmp3", "mp"),
    ("coordmp vectmp scalmp droiteparam", "vecmp4", "mp"),
    ("ineqmp fctmp polymp sinusmp explogfn", "fctmp4", "mp"),
    # 24.11 (agent mp4plus) : notions ajoutées aux banques MP 4e
    ("projmp pvectmp posdroites", "vecmp4", "mp"),
    ("fratmp", "fctmp4", "mp"),
]
JSCODE = r"""
const L=[];let fails=0;const seenK={};const bad=(m)=>{fails++;const k=m.replace(/graine \d+/,"").slice(0,48);seenK[k]=(seenK[k]||0)+1;if(seenK[k]<=1&&fails<400)L.push("ÉCHEC "+m);};
const plainR=(s)=>String(s).replace(/\{,\}/g,",").replace(/\\text\{'\}/g,"'").replace(/\\frac\{(\d+)\}\{(\d+)\}/g,"$1/$2");
const PROF={mp:{system:"CH",grade:13,track:"mp"},mp1:{system:"CH",grade:12,track:"mp"},col:{system:"CH",grade:13,track:"college"},col1:{system:"CH",grade:12,track:"college"}};
try{
for(const ch of BANKS){const C=RICH[ch];if(!C){L.push(ch+" : absente");continue;}let n=0,nc=0;
 for(const [kind,arr] of [["ex",C.ex],["raison",C.raison]])arr.forEach((f,k)=>{for(let s=1;s<=100;s++){R.seed(s);let x;try{x=f();}catch(e){bad(ch+" "+kind+k+" graine "+s+" : "+e.message);continue;}n++;
  const t=x.q+x.sol+x.parts.map(p=>p.label).join("")+(x.fig||"");
  if(/NaN|undefined|Infinity|\bnull\b|\[object/.test(t))bad(ch+" "+kind+k+" ("+x.titre+") graine "+s+" : "+t.match(/.{0,60}(NaN|undefined|Infinity|\bnull\b|\[object).{0,20}/)[0]);
  if(!C.ids.includes(x.id))bad(ch+" "+kind+k+" id "+x.id+" hors banque");
  const m=t.replace(/<[^>]*>/g," ").match(/(^|[^\d{,.\w])[-+]?1x(?![\w])|[+-] 0(?![{,.\d°^]| \\cdot)|[+-] -\d|\+ \+|- \+|\^\{?1\}?(?![\d])|\\frac\{0\}/);
  if(m)bad(ch+" "+kind+k+" ("+x.titre+") graine "+s+" écriture triviale « "+m[0]+" » : "+t.replace(/<[^>]*>/g," ").slice(Math.max(0,m.index-50),m.index+30));
  (x.chk||[]).forEach((c,j)=>{nc++;const [v,sh,tol]=c;if(!isFinite(v)){bad(ch+" "+kind+k+" chk"+j+" valeur non finie");return;}
   const sp={kind:"value",value:v};if(tol)sp.round=tol;let st;try{st=checkAnswer(sp,plainR(sh)).status;}catch(e){st="exc "+e.message;}
   if(st!=="correct")bad(ch+" "+kind+k+" ("+x.titre+") graine "+s+" chk"+j+" : attendu "+v+", affiché « "+plainR(sh)+" » → "+st);
   if(Math.abs(v)<1e-12)bad(ch+" "+kind+k+" ("+x.titre+") graine "+s+" chk"+j+" : réponse nulle (triviale)");});
 }});
 const lv=[1,2,3].map(l=>C.ex.filter(f=>{R.seed(1);return f().lv===l}).length);
 L.push(ch+" : "+C.ex.length+" ex. (niv. "+lv.join("/")+"), "+C.raison.length+" raisonnements, "+n+" tirages, "+nc+" réponses vérifiées");
 for(const lev of ["facile","standard","exigeant"]){const it=mockPlan(C.ids,lev);if(it.filter(i=>i.part==="B").length<3)bad(ch+" "+lev+" : moins de 3 exercices");}
}
for(const [ids,want,pr] of CHAPS){const got=richChapter(ids.split(" "),PROF[pr]);if(got!==want)bad("chapitre « "+ids.slice(0,40)+" » ("+pr+") → "+got+" au lieu de "+want);}
// Une banque MP ne doit jamais servir un élève du Collège.
for(const [ids,want,pr] of CHAPS){const got=richChapter(ids.split(" "),PROF.col);if(got&&RICH[got].track==="mp")bad("Collège : chapitre « "+ids.slice(0,30)+" » → banque MP "+got);}
}catch(e){bad("EXC "+e.stack);}
L.unshift(fails?"ÉCHEC : "+fails+" défaut(s)":"OK");
document.body.innerHTML="<pre id=\"log\">"+L.join("\n").replace(/</g,"&lt;")+"</pre>";
"""
html = ('<!doctype html><meta charset="utf-8"><body><main id="app"></main><pre id="log"></pre>\n'
        '<script>window.MathJax={typesetPromise:()=>Promise.resolve()};try{localStorage.clear()}catch(e){}</script>\n'
        + scripts + "\n<script>const BANKS=" + repr(BANKS).replace("'", '"') + ";const CHAPS=" + repr([list(c) for c in CHAPS]).replace("'", '"') + ";" + JSCODE + "</script>\n")
(ROOT / "tests" / "riche2.html").write_text(html)
print("tests/riche2.html écrit")
