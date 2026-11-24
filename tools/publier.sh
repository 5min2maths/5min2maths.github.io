#!/bin/bash
# Publication sûre (24.11) : construit, lance la batterie complète et le test de bout en bout du chargement,
# et ne pousse sur GitHub que si TOUT est vert. Usage : tools/publier.sh "message de commit"
cd "$(dirname "$0")/.." || exit 1
python3 build.py | tail -1 || exit 1
R=$(nice -n 10 tools/run_tests.sh 2>&1); echo "$R" | tail -5
echo "$R" | grep -q "aucun échec" || { echo "PUBLICATION ANNULÉE : échec des tests"; exit 1; }
P=$(timeout -k 5 300 nice python3 tools/test_paquets.py 2>/dev/null); echo "$P" | grep -v "^ok"
echo "$P" | grep -q "ÉCHEC" && { echo "PUBLICATION ANNULÉE : échec du test de chargement"; exit 1; }
git add -A src docs tools tests build.py 2>/dev/null; # 24.11 : build.py aussi (oubli du chargeur)
 git reset -q tests/_syntaxe.html tests/_probe.py 2>/dev/null
git diff --cached --quiet || git commit -qm "${1:-Publication}

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push -q && echo "publié : $(git log --oneline -1)"
