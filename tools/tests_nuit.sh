#!/bin/bash
# Suite COMPLÈTE des tests chaque nuit (27.11, décision de l'enseignant : tests à deux niveaux ; doc tools/tests.md).
# cron, 5 h 00 (avant la sauvegarde de 6 h 10 et les élèves Claude de 6 h 40) :
#   0 5 * * * /home/jj/Projets/5min2maths/tools/tests_nuit.sh
# Travaille dans une copie jetable (worktree « nuit », remise sur master chaque nuit, comme
# tools/eleves_claude_quotidien.sh) : construit, lance tools/run_tests.sh (toutes les pages + tools/poids.py ordre
# complet) avec nice. Ne publie JAMAIS rien, ne commite rien.
# Résultat : suivi/tests_nuit/AAAA-MM-JJ.log (journal complet), suivi/tests_nuit/pages.txt (chaque page, sa durée) et
# suivi/tests_nuit/dernier.txt, une ligne :
#   « OK 98 pages (28.11, 12 min) » ou « 2 ÉCHEC(S) : kp_stable, recalcul3 (27.11, 27 min) »
# lue par le point du matin (Calendrier/point.py) et par tools/tests_rapides.py (pages en échec ajoutées au niveau
# rapide de la publication suivante).
set -u
R=/home/jj/Projets/5min2maths
W=/home/jj/Projets/5min2maths-wt/nuit
O=$R/suivi/tests_nuit
D=$(date +%F); J=$(date +%d.%m)
mkdir -p "$O"
LOG=$O/$D.log
# Une seule suite nuit à la fois (en plus du verrou commun des tests, pris par run_tests.sh, qui attend 20 min au plus).
exec 8>/tmp/5m2m_tests_nuit.lock
flock -n 8 || { echo "$(date '+%F %T') suite de nuit déjà en cours : abandon" >> "$LOG"; exit 0; }
{
  echo "== suite complète de nuit, $(date '+%F %T')"
  cd "$R" || exit 1
  [ -d "$W" ] || git worktree add -q "$W" -B nuit master
  cd "$W" || exit 1
  git reset -q --hard master && git clean -qfd >/dev/null 2>&1
  echo "master : $(git log --oneline -1)"
  python3 build.py | tail -1
} >> "$LOG" 2>&1
T0=$(date +%s)
# 28.11 : résultat de chaque page avec sa durée dans suivi/tests_nuit/pages.txt (dernière nuit), pour repérer les pages lentes
RES=$(M2M_JOURNAL=$O/pages.txt nice -n 15 tools/run_tests.sh 2>&1 8>&-)
MIN=$(( ($(date +%s) - T0 + 30) / 60 ))
{ echo "$RES"; echo "== fin $(date '+%F %T') ($MIN min)"; } >> "$LOG"
N=$(echo "$RES" | sed -n 's/^pages testées : //p')
if echo "$RES" | grep -aq "^aucun échec"; then
  L="OK ${N:-?} pages ($J, $MIN min)"
elif echo "$RES" | grep -aq "verrou des tests occupé"; then
  L="NON LANCÉE : verrou des tests occupé ($J) — voir $D.log"
else
  # noms des pages en échec (tests/x.html → x ; outils : tools/poids.py ordre → poids_ordre, syntaxe → syntaxe)
  P=$(echo "$RES" | grep -a "ÉCHEC" | sed -n 's#^tests/\([^.:]*\)\.html[^:]*:.*#\1#p; s#^tools/poids.py ordre:.*#poids_ordre#p; s#^tools/test_nom.py:.*#test_nom#p; s#^syntaxe : .*#syntaxe#p' | sort -u)
  L="$(echo "$P" | grep -c .) ÉCHEC(S) : $(echo "$P" | paste -sd, - | sed 's/,/, /g') ($J, $MIN min)"
fi
echo "$L" > "$O/dernier.txt"
echo "$L" >> "$LOG"
# Copie immédiate dans Dropbox (la synchronisation complète n'a lieu qu'à 6 h 10).
mkdir -p /home/jj/Dropbox/Projets/5min2maths/suivi/tests_nuit && cp "$O/dernier.txt" "$LOG" /home/jj/Dropbox/Projets/5min2maths/suivi/tests_nuit/ 2>/dev/null
exit 0
