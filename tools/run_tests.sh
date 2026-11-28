#!/bin/bash
# Lance toutes les pages de test (tests/*.html) dans Chromium sans interface, 3 en parallèle (22.11).
# Usage : tools/run_tests.sh            → toutes les pages, résumé + échecs (suite COMPLÈTE : nuit, publier.sh --complet)
#         Code de retour (28.11) : 0 = aucun échec, 1 = échec(s), 2 = verrou occupé (rien n'a été testé).
#         tools/run_tests.sh test explo → seulement ces pages (paramètres permis : recalcul#n=5)
#         tools/run_tests.sh --rapide   → niveau RAPIDE (27.11) : pages de tools/tests_rapides.txt + pages touchées par
#                                         les changements non publiés + échecs de la nuit (tools/tests_rapides.py),
#                                         et tools/poids.py ordre --rapide (toutes les classes, premier écran)
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
# 28.11 (agent /contenu) : un résultat contenant un octet inattendu faisait voir le texte comme binaire à grep
# (« fichiers binaires correspondent ») : l'échec disparaissait du résumé et le code restait 0. Tout grep lit en texte (-a).
grep() { command grep -a "$@"; }; export -f grep
LOCK=/tmp/5m2m_tests_v2.lock
exec 9>"$LOCK"
# 28.11 : codes de retour explicites (avant, la série sortait toujours avec 0, sauf verrou) : 0 = tout vert,
# 1 = au moins un échec, 2 = verrou occupé (série annulée, AUCUN test lancé : c'est un échec, jamais un succès).
flock -w ${M2M_ATTENTE_VERROU:-1200} 9 || { echo "verrou des tests occupé depuis plus de $(( ${M2M_ATTENTE_VERROU:-1200} / 60 )) min ($LOCK) : série annulée, ÉCHEC (aucun test lancé)"; exit 2; }
un() {
  f=$1; fp=${f%%#*}   # 27.11 : « tests/recalcul.html#n=5 » = page + paramètres d'adresse
  t=$(mktemp); t0=$(date +%s)
  # 25.11 : une page peut demander un budget de temps virtuel plus long (<meta name="budget" content="40000">) :
  # kp_stable (pauses en boucle) restait « en cours » sous charge avec 15 s.
  bud=$(grep -o '<meta name="budget" content="[0-9]*"' "$fp" | grep -o '[0-9]*' | head -1); bud=${bud:-15000}
  (chromium --headless --disable-gpu --no-sandbox --virtual-time-budget=$bud --dump-dom "file://$PWD/$f" >"$t" 2>/dev/null 9>&- & echo $! >"$t.pid")
  # 28.11 : navigateur sorti sans rien écrire (plantage) → on n'attend pas les 400 s (la page est reprise une fois plus bas)
  pid=$(cat "$t.pid" 2>/dev/null); rm -f "$t.pid"
  for _ in $(seq 1 800); do grep -q "</html>" "$t" 2>/dev/null && break; [ -n "$pid" ] && [ ! -d /proc/$pid ] && { sleep 1; grep -q "</html>" "$t" 2>/dev/null || break; }; sleep 0.5; done
  if grep -q "</html>" "$t" 2>/dev/null; then
    out=$(python3 -c "
import sys,re,html
s=open(sys.argv[1],errors='replace').read().replace(chr(0),''); m=re.findall(r'<pre[^>]*>(.*?)</pre>',s,re.S)
t=html.unescape(m[-1]).strip() if m else ''
bad=re.search(r'ÉCHEC|FAIL|EXC',t) or re.match(r'(en cours|chargement)',t,re.I)  # 24.11 : page restée « en cours » (erreur JS) = échec
print(('ÉCHEC ' if bad else 'ok ')+(t[:260].replace(chr(10),' | ') or '(page d aperçu, sans résultat écrit)'))" "$t")
    [ -n "$out" ] || out="ÉCHEC résultat illisible (lecture du DOM impossible)"   # 28.11 : jamais un succès par défaut
  else
    if [ -n "$pid" ] && [ ! -d /proc/$pid ]; then out="ÉCHEC navigateur sorti sans résultat"; else out="ÉCHEC délai dépassé (400 s) : page abandonnée"; fi
  fi
  rm -f "$t"
  echo "$f: $out [$(( $(date +%s) - t0 )) s]"   # 28.11 : durée de la page (journal de nuit : pages les plus lentes)
}
export -f un
# bot.html = élève-robot complet (tools/bot_eleve.py) : trop lourd pour la batterie, lancé à part chaque nuit (23.11).
RAPIDE=; ORDRE_PAS=
if [ "${1:-}" = "--rapide" ]; then
  RAPIDE=1; LR=$(python3 tools/tests_rapides.py ${M2M_BASE:+--base $M2M_BASE})   # M2M_BASE : autre référence que origin/master (essais)
  ORDRE_PAS=$(echo "$LR" | sed -n 's/^ORDRE //p'); set -- $(echo "$LR" | grep -v '^ORDRE ')
fi
# 28.11 (pages par thème) : une page peut demander à être lancée plusieurs fois avec des paramètres différents
# (<meta name="suite" content="part=1 part=2"> → tests/recalcul.html#part=1, tests/recalcul.html#part=2) : pages
# longues coupées en morceaux sans copier la page.
suite() { for f in "$@"; do v=$(grep -o '<meta name="suite" content="[^"]*"' "$f" | sed 's/.*content="//;s/"$//'); if [ -n "$v" ]; then for x in $v; do echo "$f#$x"; done; else echo "$f"; fi; done; }
if [ $# -gt 0 ]; then L=$(for t in "$@"; do case $t in *'#'*) echo "tests/${t%%#*}.html#${t#*#}";; *) suite "tests/$t.html";; esac; done); else L=$(suite $(ls tests/*.html | grep -v "/_" | grep -v "/bot.html" | grep -v "/eleves.html")); fi
# 24.11 : contrôle de syntaxe de tous les fichiers de l'app (une erreur de syntaxe fait disparaître un fichier entier
# sans qu'une page de test le voie forcément : act_ch11c.js, 24.11). Page générée d'après la liste JS de build.py ;
# les erreurs sont lues dans la console de Chromium (nom du fichier et ligne).
python3 - <<'PY'
import re
s = open("build.py").read(); JS = eval(re.search(r"JS = (\[.*?\])", s, re.S).group(1))
open("tests/_syntaxe.html", "w").write('<!doctype html><meta charset="utf-8"><main id="app"></main><script>window.MathJax={typesetPromise:()=>Promise.resolve()};</script>' + "".join('<script src="../src/%s"></script>' % f for f in JS) + '<pre id="log">fin</pre>')
PY
SYN=$(timeout -k 5 90 chromium --headless --disable-gpu --no-sandbox --enable-logging=stderr --v=0 --virtual-time-budget=8000 --dump-dom "file://$PWD/tests/_syntaxe.html" 2>&1 >/dev/null 9>&- | grep -o '"Uncaught [^"]*", source: [^ ]* ([0-9]*)' | sed 's#file://[^ ]*/src/##')
# M2M_PARALLELE=1 : un seul navigateur à la fois (mesures, machine déjà chargée par un autre agent).
R=$(echo "$L" | xargs -P ${M2M_PARALLELE:-2} -I{} bash -c 'un "$1"' _ {} 9>&-)
# 25.11 : une page en échec pendant la série (2 navigateurs, machine chargée : kp_stable mesure des positions au
# minutage près) est reprise une fois, seule ; elle ne compte comme échec que si elle échoue encore.
for f in $(echo "$R" | grep "ÉCHEC" | cut -d: -f1 | grep "^tests/"); do
  r2=$(un "$f" 9>&-)
  if ! echo "$r2" | grep -q "ÉCHEC"; then R=$(echo "$R" | grep -vF "$f: "; echo "$r2 (réussie à la reprise)"); fi
done
# 26.11 : nom de l'app centralisé (constantes APP_* de src/curriculum.js), contrôle sur les sources.
R=$(printf '%s\ntools/test_nom.py: %s' "$R" "$(python3 tools/test_nom.py)")
# 27.11 (agent ordre) : la version publiée (docs/) doit exécuter exactement les sources, dans l'ordre de build.py, pour
# chaque classe, avant que l'app démarre (empreinte des questions, leçons et registres de la classe identique aux
# sources ; aucun segment exécuté après le lancement). Échoue aussi si docs/ n'a pas été reconstruit après une
# modification des sources. Le verrou est déjà tenu par cette série (M2M_VERROU_TENU). Série complète seulement.
# 27.11 : niveau rapide = même contrôle, toutes les classes, premier écran, échantillon (tools/poids.py --rapide).
if [ $# -eq 0 ] || [ -n "$ORDRE_PAS" ]; then
ORD=$(M2M_VERROU_TENU=1 python3 tools/poids.py ordre ${ORDRE_PAS:+--rapide $ORDRE_PAS} 2>&1 9>&-)
if echo "$ORD" | grep -q "^ok " && ! echo "$ORD" | grep -qv "^ok "; then ORD="ok $(echo "$ORD" | grep -c "^ok ") contrôles ($([ -n "$ORDRE_PAS" ] && echo "rapide : toutes les classes au premier écran, une notion sur $ORDRE_PAS, nouvel élève" || echo "classes, tout le code, nouvel élève")) : docs/ = sources, dans l'ordre"
else ORD="ÉCHEC $(echo "$ORD" | grep -v "^ok " | tr '\n' ' ' | cut -c1-600)"; fi
R=$(printf '%s\ntools/poids.py ordre: %s' "$R" "$ORD")
fi
[ -n "$SYN" ] && R=$(printf '%s\n%s' "$R" "$(echo "$SYN" | sed 's/^/syntaxe : ÉCHEC /')")
echo "$R" | grep -c "" | xargs echo "pages testées :"
# 28.11 : M2M_JOURNAL=fichier → résultat de chaque page, avec sa durée (suite de nuit : tools/tests_nuit.sh)
[ -n "${M2M_JOURNAL:-}" ] && echo "$R" > "$M2M_JOURNAL"
if echo "$R" | grep "ÉCHEC"; then exit 1; fi
echo "aucun échec"
echo "$R" | grep -o '^tests/[^ ]*\.html[^:]*:.* \[[0-9]* s\]' | sed 's/^\(tests\/[^:]*\):.*\[\([0-9]*\) s\]$/\2 \1/' | sort -rn | head -3 | awk '{printf "%s%s (%s s)", (NR>1?", ":"pages les plus longues : "), $2, $1} END {if (NR) print ""}'
exit 0
