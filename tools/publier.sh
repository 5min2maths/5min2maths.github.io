#!/bin/bash
# Publication sûre (24.11) : construit, lance les tests et le test de bout en bout du chargement,
# et ne pousse sur GitHub que si TOUT est vert.
# Usage : tools/publier.sh "message de commit"             → niveau RAPIDE (2–4 min, tools/tests_rapides.txt)
#         tools/publier.sh --complet "message de commit"   → suite COMPLÈTE (25–30 min) : gros changements
#                                                            (chargement, build.py, moteur)
# 27.11 (décision de l'enseignant : tests à deux niveaux) : la suite complète tourne chaque nuit (tools/tests_nuit.sh,
# 5 h) ; les pages en échec la nuit dernière sont ajoutées au niveau rapide (tools/tests_rapides.py). Doc tools/tests.md.
cd "$(dirname "$0")/.." || exit 1
NIV=rapide; [ "${1:-}" = "--complet" ] && { NIV=complet; shift; }
python3 build.py | tail -1 || exit 1
T0=$(date +%s)
if [ $NIV = complet ]; then
  echo "TESTS : niveau COMPLET (toutes les pages + tools/poids.py ordre complet)"
  R=$(nice -n 10 tools/run_tests.sh 2>&1)
else
  echo "TESTS : niveau RAPIDE (tools/tests_rapides.txt ; suite complète la nuit, ou tools/publier.sh --complet)"
  python3 tools/tests_rapides.py 2>&1 >/dev/null | sed 's/^/  page ajoutée :/'
  R=$(nice -n 10 tools/run_tests.sh --rapide 2>&1)
fi
echo "$R" | tail -5; echo "TESTS : niveau $NIV terminé en $(( ($(date +%s) - T0) / 60 )) min $(( ($(date +%s) - T0) % 60 )) s"
echo "$R" | grep -q "aucun échec" || { echo "PUBLICATION ANNULÉE : échec des tests (niveau $NIV)"; exit 1; }
P=$(timeout -k 5 300 nice python3 tools/test_paquets.py 2>/dev/null); echo "$P" | grep -v "^ok"
echo "$P" | grep -q "ÉCHEC" && { echo "PUBLICATION ANNULÉE : échec du test de chargement"; exit 1; }
git add -A src docs tools tests build.py 2>/dev/null; # 24.11 : build.py aussi (oubli du chargeur)
 git reset -q tests/_syntaxe.html tests/_probe.py 2>/dev/null
git diff --cached --quiet || git commit -qm "${1:-Publication}

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push -q && echo "publié : $(git log --oneline -1)"
