#!/bin/bash
# 27.11 (agent écrans) : captures des écrans principaux aux tailles téléphone, tablette et ordinateur (Chromium sans
# interface, page tests/ecrans.html#cap=…). Usage : tools/ecrans_captures.sh [dossier] [écran…]
# → <dossier>/<L>x<H>_<écran>.png (défaut tests/_shots/ecrans). 360 px : fenêtre de 500 px recadrée (minimum de Chromium).
cd "$(dirname "$0")/.." || exit 1
D=${1:-tests/_shots/ecrans}; shift
mkdir -p "$D"
E=${*:-accueil figure pave probleme lecon bilan progres competences reglages}
for t in ${TAILLES:-1440x900 1280x800 1024x768 820x1180:tab 1180x820:tab 360x640}; do
  sz=${t%%:*}; ec=auto; [[ $t == *:* ]] && ec=${t##*:}; w=${sz%x*}; h=${sz#*x}; ww=$(( w < 500 ? 500 : w ))
  for e in $E; do
    f="$D/${sz}_$e.png"
    timeout -k 5 90 nice chromium --headless --disable-gpu --no-sandbox --allow-file-access-from-files --hide-scrollbars --virtual-time-budget=12000 \
      --window-size=$ww,$h --screenshot="$f" "file://$PWD/tests/ecrans.html#cap=$e&w=$w&h=$h&ecran=$ec" >/dev/null 2>&1 9>&-
    [ "$w" -lt 500 ] && python3 -c "import sys;from PIL import Image;i=Image.open(sys.argv[1]);i.crop((0,0,int(sys.argv[2]),i.size[1])).save(sys.argv[1])" "$f" "$w"
  done
done
ls "$D" | wc -l | xargs echo "captures :"
