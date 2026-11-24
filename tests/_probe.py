import sys
from pathlib import Path
ids=sys.argv[1].split(","); grade=sys.argv[2]; track=sys.argv[3]
s=Path("tests/signaux.html").read_text()
head=s[:s.index("<script>\n// Signaux")]
Path("tests/_g.html").write_text(head+r'''<script>
const o=[],IDS=%s;
const CAND=[];for(const k of [1,2,3,4,5,6,7,8,9,10,11,12])for(const d of [1,2,3,4,5,6,7,8,9,10,12])for(const n of [2,3,5,6,7,10,11,13,14,15,17,19,21,22,23])for(const sg of ["","-"])CAND.push(sg+(k===1?"":k)+"√"+n+(d===1?"":"/"+d));for(const k of [1,2,3,4,5,6,7,8,9,10,11,12])for(const d of [1,2,3,4,5,6,7,8,9,10,12])for(const sg of ["","-"])CAND.push(sg+(k===1?"":k)+"π"+(d===1?"":"/"+d));for(const n of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,17,19])for(const sg of ["","-"])CAND.push(sg+"1/√"+n);
const exact=(s2)=>{for(const c of CAND){try{if(checkAnswer(s2,c).status==="correct")return c}catch(e){}}return null};
const frx=(v)=>{if(Math.abs(v*1e6-Math.round(v*1e6))<1e-6)return String(+v.toFixed(6));for(let d=2;d<=200;d++){const n=Math.round(v*d);if(Math.abs(n/d-v)<1e-9)return n+"/"+d}return exact({kind:"value",value:v})||String(v)};
const ans=(s2)=> s2.kind==="value"? (s2.radical? (exact(s2)||frx(s2.value)) : frx(s2.value)) : s2.kind==="set"? (s2.values.length? s2.values.map(frx).join(";"):"aucune") : s2.kind==="expr"? s2.expr : s2.kind==="pair"? s2.values.map(frx).join(" ; ") : s2.kind==="solset"? SolSet.show(s2.ivs,false):"";
for(const id of IDS)for(const d of [1,2,3,4]){let g=0,n=0,tr=0,err=[],pb=0;const cx={};
 for(let k=1;k<=250;k++){let q;try{q=Engine.make(Engine.newState({system:"CH",grade:%s,track:"%s",minutes:5}),id,d)}catch(e){err.push("EXC "+e.message);continue}
  if(!q){err.push("null");continue} n++; if(q.parts){pb++;continue}
  if(q.guide&&q.guide.length)g++; if(q.traps&&q.traps.length)tr++; cx[q.ctx]=(cx[q.ctx]||0)+1;
  if(/undefined|NaN|Infinity(?!.{0,3}\\infty)/.test(q.q+q.sol+JSON.stringify(q.guide))) err.push("texte: "+(q.q+" | "+q.sol).slice(0,200));
  try{ const a=q.canon||ans(q.spec); const r=checkAnswer(q.spec,a); if(r.status!=="correct") err.push("refusée "+q.code+" « "+a+" » "+r.status+" "+(r.message||""));
   for(const st of q.guide||[]){const b=ans(st.spec);const r2=checkAnswer(st.spec,b); if(r2.status!=="correct"){err.push("étape refusée "+q.code+" « "+b+" » "+st.ask.slice(0,80)+" "+(r2.message||""));break;}}
  }catch(e){err.push("check EXC "+e.message+" "+q.code)}
 }
 o.push(id+" N"+d+" : "+n+" · guide "+g+" · pièges "+tr+(pb?" · problèmes "+pb:"")+" · "+JSON.stringify(cx)+(err.length?"\n   ERREURS ("+err.length+") : "+[...new Set(err)].slice(0,6).join("\n   "):""));}
const seen={};for(const id of IDS)for(const d of [1,2,3])for(let k=1;k<=150;k++){const q=Engine.make(Engine.newState({system:"CH",grade:%s,track:"%s",minutes:5}),id,d);if(seen[id+q.ctx])continue;seen[id+q.ctx]=1;o.push("● "+id+" N"+d+" ["+q.ctx+"] "+q.q+"\n   SOL: "+q.sol)}
document.body.insertAdjacentHTML("beforeend","<pre id=out>"+o.join("\n").replace(/</g,"&lt;")+"</pre>")</script>''' % (repr(ids).replace("'",'"'), grade, track, grade, track))
