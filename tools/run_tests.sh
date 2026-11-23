#!/bin/bash
# Lance toutes les pages de test (tests/*.html) dans Chromium sans interface, 6 en parallèle (22.11).
# Usage : tools/run_tests.sh            → toutes les pages, résumé + échecs
#         tools/run_tests.sh test explo → seulement ces pages
# Une page de test écrit son résultat dans un <pre> ; « ÉCHEC », « FAIL » ou « EXC » = échec.
cd "$(dirname "$0")/.." || exit 1
# 23.11 (machine saturée : plusieurs agents lançaient leurs tests en même temps) : une seule série de tests à la fois
# sur toute la machine (verrou partagé par tous les worktrees), et 3 navigateurs en parallèle au plus.
exec 9>/tmp/5m2m_tests.lock
flock 9
un() {
  f=$1
  out=$(timeout 120 chromium --headless --disable-gpu --no-sandbox --virtual-time-budget=15000 --dump-dom "file://$PWD/$f" 2>/dev/null | python3 -c "
import sys,re,html
s=sys.stdin.read(); m=re.findall(r'<pre[^>]*>(.*?)</pre>',s,re.S)
t=html.unescape(m[-1]).strip() if m else ''
print(('ÉCHEC ' if re.search(r'ÉCHEC|FAIL|EXC',t) else 'ok ')+t[:260].replace(chr(10),' | '))")
  echo "$f: $out"
}
export -f un
if [ $# -gt 0 ]; then L=$(for t in "$@"; do echo "tests/$t.html"; done); else L=$(ls tests/*.html | grep -v "/_"); fi
R=$(echo "$L" | xargs -P 3 -I{} bash -c 'un {}')
echo "$R" | grep -c "" | xargs echo "pages testées :"
echo "$R" | grep "ÉCHEC" || echo "aucun échec"
