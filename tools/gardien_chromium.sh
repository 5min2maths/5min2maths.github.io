#!/bin/bash
# Gardien (24.11, demande de l'auteur : « tuer un process automatiquement quand il dure trop longtemps »).
# Lancé par cron toutes les 5 minutes. Tue tout Chromium sans interface (--headless) lancé depuis plus de
# MAX secondes (10 min par défaut) : tests, robot élève, mesures. Les commandes lancées depuis VS Code ne
# peuvent pas le faire (AppArmor : le profil snap de Chromium refuse les signaux venant du profil « vscode ») ;
# cron, lui, n'est pas confiné. Journal : ~/Projets/5min2maths/suivi/gardien.log (une ligne par processus tué).
MAX=${1:-600}
LOG="$HOME/Projets/5min2maths/suivi/gardien.log"
ps -eo pid=,etimes=,args= | while read -r pid age args; do
  case "$args" in
    *chrom*--headless*)
      if [ "$age" -gt "$MAX" ]; then
        kill -9 "$pid" 2>/dev/null && echo "$(date '+%d.%m %H:%M') tué $pid après $((age / 60)) min : ${args:0:90}" >> "$LOG"
      fi ;;
  esac
done
