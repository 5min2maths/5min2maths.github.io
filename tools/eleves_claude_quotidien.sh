#!/bin/bash
# Élèves Claude quotidiens (26.11, demande de l'enseignant : « il faudra des élèves Claude qui tournent tous les jours »).
# Chaque matin (cron, 6 h 40, après le couvre-feu) : deux élèves joués par Claude (rotation sur cinq profils) parcourent
# l'app à jour dans la vraie interface (tests/_trace.html), refont les calculs, jugent la vraisemblance et la durée, et
# écrivent une revue courte : suivi/revues/AAAA-MM-JJ.md (seulement les problèmes NOUVEAUX par rapport aux revues récentes).
# Travaille dans une copie jetable (worktree « quotidien », remise sur master chaque jour) : rien n'est modifié dans l'app.
# Ne publie rien. Lu par Claude en début de session (point 5min2maths).
set -u
R=/home/jj/Projets/5min2maths
W=/home/jj/Projets/5min2maths-wt/quotidien
D=$(date +%F)
C=$(ls -d /home/jj/.vscode/extensions/anthropic.claude-code-*/resources/native-binary/claude 2>/dev/null | sort -V | tail -1)
[ -x "$C" ] || { echo "$D : binaire claude introuvable" >> "$R/suivi/revues/erreurs.log"; exit 1; }
mkdir -p "$R/suivi/revues"
cd "$R" || exit 1
[ -d "$W" ] || git worktree add -q "$W" -B quotidien master
cd "$W" && git reset -q --hard master && git clean -qfd -e tests/_trace.html >/dev/null 2>&1
git -C "$R" show master:tests/_trace.html > tests/_trace.html 2>/dev/null
python3 build.py >/dev/null 2>&1
# Rotation : deux élèves par jour (jour de l'année).
E=(lea noah ines malik chloe); N=$(( 10#$(date +%j) ))
A=${E[$(( N % 5 ))]}; B=${E[$(( (N + 2) % 5 ))]}
PREV=$(ls -1 "$R"/suivi/revues/20*.md 2>/dev/null | tail -3 | tr '\n' ' ')
PROMPT="Tu es testeur de l'app 5min2maths (dossier courant : une copie jetable). Joue deux élèves aujourd'hui : « $A » puis « $B » (profils décrits dans tools/archive/revue_eleves_claude_26-11.md), chacun sur 2 séances, avec l'outil tests/_trace.html :
nice timeout 300 chromium --headless --disable-gpu --no-sandbox --virtual-time-budget=120000 --dump-dom \"file://$W/tests/_trace.html#eleve=$A\"
(fais varier le jour ou la graine si l'outil le permet, pour voir d'autres questions que les jours précédents). Lis chaque écran comme l'élève, refais chaque calcul, juge : erreurs de contenu, énoncés invraisemblables (règle : un énoncé absurde fait décrocher un élève), arrondis, indices, corrigés, durée réelle (promesse : 5 minutes), libellés, séparation France / romand, motivation.
Lis d'abord les revues récentes ($PREV) et ne signale que les problèmes NOUVEAUX ou encore présents (dis lesquels persistent).
Écris le résultat dans le fichier tools/revue_quotidienne.md (en français, court) : en tête, une ligne « RAS » ou « N problème(s) dont X grave(s) » ; puis, par problème : gravité (haute / moyenne / basse), texte exact vu à l'écran, code de question q-… s'il y en a, comment reproduire, correction proposée en une ligne (règle : resserrer plutôt qu'enrichir). Ne modifie aucun autre fichier. Ne publie rien."
# Écriture permise dans la copie jetable seulement (acceptEdits, dossier courant) ; commandes : chromium, ls, grep.
flock /tmp/bot5m2m.lock nice -n 10 timeout 3000 "$C" -p "$PROMPT" --max-turns 80 --permission-mode acceptEdits \
  --allowedTools "Read" "Bash(nice timeout 300 chromium:*)" "Bash(timeout 300 chromium:*)" "Bash(ls:*)" "Bash(grep:*)" \
  > "$R/suivi/revues/$D.log" 2>&1
if [ -s tools/revue_quotidienne.md ]; then cp tools/revue_quotidienne.md "$R/suivi/revues/$D.md"
  # Copie immédiate dans Dropbox (l'enseignant lit depuis Dropbox ; la synchronisation complète n'a lieu qu'à 6 h 10).
  mkdir -p /home/jj/Dropbox/Projets/5min2maths/suivi/revues && cp "$R/suivi/revues/$D.md" /home/jj/Dropbox/Projets/5min2maths/suivi/revues/
else echo "$D : pas de revue produite (voir $D.log)" >> "$R/suivi/revues/erreurs.log"; fi
