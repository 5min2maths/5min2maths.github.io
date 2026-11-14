#!/usr/bin/env python3
"""Plan de l'aide pas à pas (« On le fait ensemble », q.guide) — lissé dans le temps (demande du 14.11).

Repère, pour chaque notion, les niveaux (1 à 3) qui ont déjà un guide, classe les notions par priorité
(bêta-testeurs 1re Collège, puis 11e, MP, 2e Collège, 10e, 9e) et découpe le reste en lots de LOT notions.
Écrit tools/plan_pas_a_pas.md ; `--prochain` affiche une ligne (lue par le point du jour).
"""
import json, os, re, sys

RAC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOT = 5
src = lambda f: open(os.path.join(RAC, "src", f), encoding="utf-8").read()

def blocs():
    """id -> texte du générateur (méthodes « id(d) { » et notions fines « { id: "…" »)."""
    out = {}
    for f in ("generators.js", "gen2.js"):
        t = src(f)
        ms = list(re.finditer(r"^  ([a-z0-9]+)\(d\) \{", t, re.M))
        for i, m in enumerate(ms):
            out[m.group(1)] = t[m.start(): ms[i + 1].start() if i + 1 < len(ms) else len(t)]
    t = src("gen3.js")
    ms = list(re.finditer(r'^  \{ id: "([a-z0-9]+)"', t, re.M))
    for i, m in enumerate(ms):
        out[m.group(1)] = t[m.start(): ms[i + 1].start() if i + 1 < len(ms) else len(t)]
    return out

def niveaux_guides(b):
    """Nombre approximatif de branches avec guide (0 à 3)."""
    return min(3, len(re.findall(r"\bguide:", b)))

def ordre():
    t = src("ordre.js")
    O = json.loads(re.search(r"const ORDRE = (\{.*?\});", t).group(1))
    T = json.loads(re.search(r"const ORDRE_THEME = (\{.*?\});\n", t).group(1))
    rang = lambda d: sorted(d, key=d.get)
    m1 = [i for i in rang(O["MATU"]) if T["MATU"].get(i, "").startswith("M1")]
    m2 = [i for i in rang(O["MATU"]) if T["MATU"].get(i, "").startswith("M2")]
    co = lambda y: [i for i in rang(O["CO"]) if str(y) in T["CO_BY"].get(i, {})]
    groupes = [("1re Collège (bêta-testeurs)", m1), ("11e CO", co(11)), ("MP", rang(O["MP"])),
               ("2e Collège", m2), ("10e CO", co(10)), ("9e CO", co(9))]
    vus, res = set(), []
    for nom, ids in groupes:
        for i in ids:
            if i not in vus:
                vus.add(i); res.append((nom, i))
    return res

def main():
    B, liste = blocs(), ordre()
    a_faire = [(g, i) for g, i in liste if i in B and niveaux_guides(B[i]) < 3]
    faits = [i for g, i in liste if i in B and niveaux_guides(B[i]) >= 3]
    partiels = [i for g, i in a_faire if niveaux_guides(B[i]) > 0]
    lots = [a_faire[k:k + LOT] for k in range(0, len(a_faire), LOT)]
    if "--prochain" in sys.argv:
        if lots:
            print(f"Pas à pas : lot 1/{len(lots)} — " + ", ".join(i for _, i in lots[0]) + f" ({lots[0][0][0]}) ; {len(faits)} notions couvertes sur {len(liste)}")
        return
    L = ["# Plan de l'aide pas à pas (généré par tools/plan_pas_a_pas.py — ne pas éditer à la main)", "",
         f"Couverture : {len(faits)} notions complètes (3 niveaux), {len(partiels)} partielles, {len(a_faire)} à faire, sur {len(liste)}.",
         f"Rythme visé : 1 lot de {LOT} notions par séance de travail, 2 séances par semaine → ≈ {len(lots) / 2:.0f} semaines.", "",
         "Méthode par lot : GS() pour chaque niveau (2 à 4 étapes, la dernière = la réponse), q.traps pour les erreurs typiques,",
         "puis tests/test.html (contrôle des guides) et tests/trivial.html, commit, push. Le point du jour affiche le prochain lot.", ""]
    for k, lot in enumerate(lots, 1):
        L.append(f"- [ ] Lot {k} ({lot[0][0]}) : " + ", ".join(f"{i}" + (f" ({niveaux_guides(B[i])}/3)" if niveaux_guides(B[i]) else "") for _, i in lot))
    open(os.path.join(RAC, "tools", "plan_pas_a_pas.md"), "w", encoding="utf-8").write("\n".join(L) + "\n")
    print("\n".join(L[:4])); print(f"{len(lots)} lots")

if __name__ == "__main__":
    main()
