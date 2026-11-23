#!/bin/bash
# Formes sans pas à pas pour des notions : tools/guides_manquants.sh fracsimp,fracper (24.11)
cd "$(dirname "$0")/.." || exit 1
timeout -k 5 90 chromium --headless --disable-gpu --no-sandbox --virtual-time-budget=10000 --dump-dom "file://$PWD/tests/_guides_manquants.html#$1" 2>/dev/null | python3 -c "import sys,re,html;s=sys.stdin.read();m=re.search(r'<pre id=\"log\">(.*?)</pre>',s,re.S);print(html.unescape(m.group(1)).replace(' || ','\n') if m else 'rien')"
