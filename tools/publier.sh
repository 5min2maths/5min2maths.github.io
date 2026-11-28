#!/bin/bash
# Publication sûre (24.11) : construit, lance les tests et le test de bout en bout du chargement,
# et ne pousse sur GitHub que si TOUT est vert.
# Usage : tools/publier.sh "message de commit"             → niveau RAPIDE (2–4 min, tools/tests_rapides.txt)
#         tools/publier.sh --complet "message de commit"   → suite COMPLÈTE (10–15 min) : gros changements
#                                                            (chargement, build.py, moteur)
# 27.11 (décision de l'enseignant : tests à deux niveaux) : la suite complète tourne chaque nuit (tools/tests_nuit.sh,
# 5 h) ; les pages en échec la nuit dernière sont ajoutées au niveau rapide (tools/tests_rapides.py). Doc tools/tests.md.
# 28.11 (écran d'ouverture publié avant son recadrage : modifié PENDANT les tests, puis emporté par le « git add » de la
# fin sans avoir été testé) : l'état est FIGÉ AVANT les tests. Ordre : construire → commit (c'est ce commit qui est
# testé) → tests → l'arbre doit être encore identique au commit → push. Échec des tests ou arbre modifié pendant les
# tests : rien n'est poussé, le commit est défait (git reset, les modifications restent dans l'arbre), à relancer.
cd "$(dirname "$0")/.." || exit 1
NIV=rapide; [ "${1:-}" = "--complet" ] && { NIV=complet; shift; }
CHEMINS="src docs tools tests build.py"   # 24.11 : build.py aussi (oubli du chargeur)
python3 build.py | tail -1 || exit 1
AVANT=$(git rev-parse HEAD)
git add -A $CHEMINS 2>/dev/null
git reset -q tests/_syntaxe.html tests/_probe.py 2>/dev/null
NOUVEAU=
if ! git diff --cached --quiet; then
  git commit -qm "${1:-Publication}

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" || exit 1
  NOUVEAU=1
fi
TESTE=$(git rev-parse HEAD)
echo "TESTS sur le commit $(git log --oneline -1 | cut -c1-90)"
annule() {   # rien n'est poussé ; le commit de cette publication est défait, les modifications restent dans l'arbre
  echo "PUBLICATION ANNULÉE : $1"
  if [ -n "$NOUVEAU" ] && [ "$(git rev-parse HEAD)" = "$TESTE" ]; then git reset -q "$AVANT" && echo "  (commit défait : les modifications sont toujours là, non commitées)"; fi
  exit 1
}
T0=$(date +%s)
if [ $NIV = complet ]; then
  echo "TESTS : niveau COMPLET (toutes les pages + tools/poids.py ordre complet)"
  R=$(nice -n 10 tools/run_tests.sh 2>&1); CODE=$?
else
  echo "TESTS : niveau RAPIDE (tools/tests_rapides.txt ; suite complète la nuit, ou tools/publier.sh --complet)"
  python3 tools/tests_rapides.py 2>&1 >/dev/null | sed 's/^/  page ajoutée :/'
  R=$(nice -n 10 tools/run_tests.sh --rapide 2>&1); CODE=$?
fi
echo "$R" | tail -5; echo "TESTS : niveau $NIV terminé en $(( ($(date +%s) - T0) / 60 )) min $(( ($(date +%s) - T0) % 60 )) s"
{ [ $CODE -eq 0 ] && echo "$R" | grep -aq "aucun échec"; } || annule "échec des tests (niveau $NIV, code $CODE)"
P=$(timeout -k 5 300 nice python3 tools/test_paquets.py 2>/dev/null); echo "$P" | grep -av "^ok"
echo "$P" | grep -aq "ÉCHEC" && annule "échec du test de chargement"
# L'arbre doit être resté celui qui a été testé (aucune modification de src, docs, tools, tests, build.py pendant les tests).
[ "$(git rev-parse HEAD)" = "$TESTE" ] || annule "un autre commit a été fait pendant les tests"
CH=$(git status --porcelain -- $CHEMINS | grep -v -e ' tests/_syntaxe.html$' -e ' tests/_probe.py$')
[ -z "$CH" ] || annule "fichiers modifiés pendant les tests (non testés) :
$(echo "$CH" | head -10)"
git push -q && echo "publié : $(git log --oneline -1)"
