#!/bin/bash
# Lance toutes les pages de test (tests/*.html) dans Chromium sans interface, 3 en parallèle (22.11).
# Usage : tools/run_tests.sh            → toutes les pages, résumé + échecs
#         tools/run_tests.sh test explo → seulement ces pages
# Une page de test écrit son résultat dans un <pre> ; « ÉCHEC », « FAIL » ou « EXC » = échec.
cd "$(dirname "$0")/.." || exit 1
# 23.11 (machine saturée : plusieurs agents lançaient leurs tests en même temps) : une seule série de tests à la fois
# sur toute la machine (verrou partagé par tous les worktrees), et 2 navigateurs en parallèle au plus (24.11 : 4 cœurs, charge 9 avec les agents).
# 24.11 : la série de la nuit est restée bloquée 7 h. Un Chromium (snap) qui ne répond plus ne se laisse pas tuer
# (AppArmor refuse le signal), donc « timeout » attendait sans fin ; et ce Chromium avait hérité du verrou, ce qui
# bloquait aussi toutes les séries suivantes. Désormais : Chromium ne reçoit pas le verrou (9>&-), une page sans
# réponse après 120 s est abandonnée (comptée « ÉCHEC délai dépassé ») au lieu d'être attendue, et l'attente du
# verrou est limitée à 20 min. Fichier de verrou renommé (l'ancien reste tenu par le Chromium bloqué jusqu'au
# prochain redémarrage).
LOCK=/tmp/5m2m_tests_v2.lock
exec 9>"$LOCK"
flock -w 1200 9 || { echo "verrou des tests occupé depuis plus de 20 min ($LOCK) : série annulée"; exit 1; }
un() {
  f=$1
  t=$(mktemp)
  (chromium --headless --disable-gpu --no-sandbox --virtual-time-budget=15000 --dump-dom "file://$PWD/$f" >"$t" 2>/dev/null 9>&- &)
  for _ in $(seq 1 240); do grep -q "</html>" "$t" 2>/dev/null && break; sleep 0.5; done
  if grep -q "</html>" "$t" 2>/dev/null; then
    out=$(python3 -c "
import sys,re,html
s=open(sys.argv[1]).read(); m=re.findall(r'<pre[^>]*>(.*?)</pre>',s,re.S)
t=html.unescape(m[-1]).strip() if m else ''
bad=re.search(r'ÉCHEC|FAIL|EXC',t) or not t or re.match(r'(en cours|chargement|…|\.\.\.)',t,re.I)  # 24.11 : page restée « en cours » (erreur JS) = échec
print(('ÉCHEC ' if bad else 'ok ')+(t[:260].replace(chr(10),' | ') or 'pas de résultat (page bloquée par une erreur JS ?)'))" "$t")
  else
    out="ÉCHEC délai dépassé (120 s) : page abandonnée"
  fi
  rm -f "$t"
  echo "$f: $out"
}
export -f un
# bot.html = élève-robot complet (tools/bot_eleve.py) : trop lourd pour la batterie, lancé à part chaque nuit (23.11).
if [ $# -gt 0 ]; then L=$(for t in "$@"; do echo "tests/$t.html"; done); else L=$(ls tests/*.html | grep -v "/_" | grep -v "/bot.html"); fi
# 24.11 : contrôle de syntaxe de tous les fichiers de l'app (une erreur de syntaxe fait disparaître un fichier entier
# sans qu'une page de test le voie forcément : act_ch11c.js, 24.11). Page générée d'après la liste JS de build.py ;
# les erreurs sont lues dans la console de Chromium (nom du fichier et ligne).
python3 - <<'PY'
import re
s = open("build.py").read(); JS = eval(re.search(r"JS = (\[.*?\])", s, re.S).group(1))
open("tests/_syntaxe.html", "w").write('<!doctype html><meta charset="utf-8"><main id="app"></main><script>window.MathJax={typesetPromise:()=>Promise.resolve()};</script>' + "".join('<script src="../src/%s"></script>' % f for f in JS) + '<pre id="log">fin</pre>')
PY
SYN=$(timeout -k 5 90 chromium --headless --disable-gpu --no-sandbox --enable-logging=stderr --v=0 --virtual-time-budget=8000 --dump-dom "file://$PWD/tests/_syntaxe.html" 2>&1 >/dev/null 9>&- | grep -o '"Uncaught [^"]*", source: [^ ]* ([0-9]*)' | sed 's#file://[^ ]*/src/##')
R=$(echo "$L" | xargs -P 2 -I{} bash -c 'un {}' 9>&-)
[ -n "$SYN" ] && R=$(printf '%s\n%s' "$R" "$(echo "$SYN" | sed 's/^/syntaxe : ÉCHEC /')")
echo "$R" | grep -c "" | xargs echo "pages testées :"
echo "$R" | grep "ÉCHEC" || echo "aucun échec"
