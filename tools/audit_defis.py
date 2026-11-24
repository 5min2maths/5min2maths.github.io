#!/usr/bin/env python3
"""Audit des défis (niveau 4, « Problème de la semaine ») — 24.11.
Génère tests/_defis.html (scripts de build.py), tire n problèmes par notion ayant un niveau 4 (Engine.build(id, 4, graine))
et écrit un rapport texte : id, classe (CH / MP), énoncé, nombre de parts, réponses, plus une question de niveau 3
pour comparer. Résultat dans suivi/robot/defis.txt.
Usage : nice python3 tools/audit_defis.py [n, défaut 3] [ids séparés par des virgules]
"""
import html, re, subprocess, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
n = sys.argv[1] if len(sys.argv) > 1 else "3"
ids = sys.argv[2] if len(sys.argv) > 2 else ""
s = (ROOT / "build.py").read_text()
JS = eval(re.search(r"JS = (\[.*?\])", s, re.S).group(1))
JS = [f for f in JS if f != "app.js"]
page = '<!doctype html><meta charset="utf-8"><main id="app"></main><script>window.MathJax={typesetPromise:()=>Promise.resolve()};</script>' \
    + "".join('<script src="../src/%s"></script>' % f for f in JS) + r'''<pre id="log">en cours</pre><script>
const txt = (h) => String(h || "").replace(/<svg[\s\S]*?<\/svg>/g, "[fig]").replace(/<[^>]+>/g, "").replace(/\\\(|\\\)/g, "").replace(/\s+/g, " ").trim();
const hp = new URLSearchParams(location.hash.slice(1)), N = +hp.get("n") || 3, only = (hp.get("ids") || "").split(",").filter(Boolean);
const cls = (id) => { const nn = NOTIONS.find((x) => x.id === id); if (!nn) return "?"; const a = []; if (nn.CH) a.push("CH" + nn.CH[0]); if (nn.MP) a.push("MP" + nn.MP.join("")); return a.join(" ") || "-"; };
const out = [];
const all = Object.keys(GEN).filter((id) => hasProb(id) && (!only.length || only.includes(id))).sort();
out.push("notions avec défi : " + all.length);
for (const id of all) {
  out.push("", "=== " + id + " [" + cls(id) + "] — " + probList(id).length + " problème(s)");
  try { const q3 = Engine.build(id, 3, 17); out.push("  niv.3 : " + txt(q3.q).slice(0, 200)); } catch (e) { out.push("  niv.3 : EXC " + e.message); }
  for (let k = 0; k < N; k++) {
    try {
      const p = Engine.build(id, 4, 101 + k * 977);
      out.push("  - " + txt(p.q).slice(0, 400));
      (p.parts || []).forEach((pt) => out.push("      " + txt(pt.label) + " → " + JSON.stringify(pt.spec.value !== undefined ? pt.spec.value : (pt.spec.values || pt.spec.expr || pt.spec))));
      out.push("      sol : " + txt(p.sol).slice(0, 300));
    } catch (e) { out.push("  - EXC " + e.message); }
  }
}
document.getElementById("log").textContent = out.join("\n");
</script>'''
(ROOT / "tests" / "_defis.html").write_text(page)
url = f"file://{ROOT}/tests/_defis.html#n={n}" + (f"&ids={ids}" if ids else "")
dom = subprocess.run(["timeout", "-k", "5", "240", "chromium", "--headless", "--disable-gpu", "--no-sandbox", "--virtual-time-budget=60000", "--dump-dom", url],
                     capture_output=True, text=True).stdout
m = re.search(r'<pre id="log">(.*?)</pre>', dom, re.S)
out = html.unescape(m.group(1)).strip() if m else "pas de résultat (page bloquée)"
(ROOT / "suivi" / "robot").mkdir(parents=True, exist_ok=True)
(ROOT / "suivi" / "robot" / "defis.txt").write_text(out + "\n")
print(out.splitlines()[0] if out else "vide", "→ suivi/robot/defis.txt")
