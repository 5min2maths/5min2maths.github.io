#!/usr/bin/env python3
"""Plan de l'aide pas à pas (« On le fait ensemble », q.guide) — lissé dans le temps (demande du 14.11).

Repère, pour chaque notion, les niveaux (1 à 3) qui ont déjà un guide, classe les notions par priorité
(11e et 1re Collège d'abord, en alternant leurs lots — les bêta-testeurs sont sur ces deux niveaux, 14.11 —, puis MP, 2e Collège, 10e, 9e) et découpe le reste en lots de LOT notions.
Écrit tools/plan_pas_a_pas.md ; `--prochain` affiche une ligne (lue par le point du jour).
"""
import json, os, re, sys

RAC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOT = 5
# Chantier en cours (décision du 15.11 : la rétention passe par la qualité) : on finit « nickel » les chapitres
# que les bêta-testeurs travaillent, dans l'ordre de leur année, avant tout le reste (liste de contrôle locale).
CHANTIER = [
    ("11e · 4. Proportionnalité (chapitre en cours des testeurs)", ["utemps", "ucomp", "vitesse", "gquot"]),
    ("11e · 5. Calcul littéral 1 (chapitre suivant)", ["litelab", "valnum", "reduire", "monomes", "parenth", "distrib"]),
    ("11e · 5. Calcul littéral 2 (ensuite)", ["idrem", "factor"]),
    ("1re Collège · équations du 1er degré (testeurs de 1re)", ["eq1", "eqfrac", "eqspec", "formule", "probeq"]),
    ("1re Collège · équations du 2e degré", ["eq2fact", "eq2", "eq2disc", "probeq2", "eq3", "bicarre", "eqirr"]),
    # Suite du plan de cheminement 11e (demande du 17.11) : les testeurs de 11e
    # comblent d'abord le début d'année (ch. 1–3, déjà vus : décision du 17.11), puis la suite du plan.
    ("11e · 1. Nombres et opérations (début d'année, déjà vu par les testeurs)", ["prio", "fracconv", "fracadd", "fracmul", "puiss", "sci", "scicalc"]),
    ("11e · 2. Pythagore (début d'année, déjà vu par les testeurs)", ["pyth", "pythfig", "pythrec"]),
    ("11e · 3. 3D (début d'année, déjà vu par les testeurs)", ["vol", "volcone", "airepyr", "volcomp", "volmanq"]),
    ("11e · 7. Angles", ["angles", "cercthales"]),
    ("11e · 8. Thalès", ["thales", "thalesrec", "simil"]),
    ("11e · 9. Systèmes d'équations", ["sys2", "sysprob"]),
    ("11e · 10. Fonctions", ["repere", "tabval", "affine"]),
    ("11e · 12. Probabilités", ["denombr", "proba"]),
]
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
    # Modules de chapitre (chantier du 15.11) : toutes les formes ont un guide ; ils remplacent les anciennes versions.
    for f in ("ch11_prop.js", "ch11_litt.js", "ch1c_eq.js", "ch1c_sys.js", "ch11_no.js", "ch11_gm.js", "ch11_ang.js", "ch11_thales.js", "ch11_fct.js", "ch11_proba.js", "ch1c_no.js", "ch1c_fct.js", "ch1c_alg.js", "ch1c_f2b.js", "ch11_no2.js", "ch1c_geo.js"):
        if os.path.exists(os.path.join(RAC, "src", f)):
            m = re.search(r"const ALL = \{([^}]*)\}", src(f))
            for i in re.findall(r"([a-z0-9]+):", m.group(1) if m else ""):
                out[i] = "guide: guide: guide:"
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
    groupes = [("11e CO (bêta-testeurs)", co(11)), ("1re Collège (bêta-testeurs)", m1), ("MP", rang(O["MP"])),
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
    # 11e et 1re Collège en priorité égale (bêta-testeurs, 14.11) : leurs lots alternent, puis les autres niveaux.
    prio = [[x for x in a_faire if x[0] == g] for g in ("11e CO (bêta-testeurs)", "1re Collège (bêta-testeurs)")]
    autres = [x for x in a_faire if x[0] not in ("11e CO (bêta-testeurs)", "1re Collège (bêta-testeurs)")]
    chunks = [[g[k:k + LOT] for k in range(0, len(g), LOT)] for g in prio]
    lots = [c for pair in __import__("itertools").zip_longest(*chunks) for c in pair if c] + [autres[k:k + LOT] for k in range(0, len(autres), LOT)]
    # Chantier en tête : ses notions sont retirées des lots ordinaires.
    pris = {i for _, ids in CHANTIER for i in ids}
    fait = set(faits)
    lots = [l for l in ([(nom, i) for i in ids if i not in fait] for nom, ids in CHANTIER) if l] + [l for l in ([x for x in lot if x[1] not in pris] for lot in lots) if l]
    if "--prochain" in sys.argv:
        if lots:
            print(f"Pas à pas : prochain lot ({len(lots)} restants) — " + ", ".join(i for _, i in lots[0]) + f" ({lots[0][0][0]}) ; {len(faits)} notions couvertes sur {len(liste)}")
        return
    L = ["# Plan de l'aide pas à pas (généré par tools/plan_pas_a_pas.py — ne pas éditer à la main)", "",
         f"Couverture : {len(faits)} notions complètes (3 niveaux), {len(partiels)} partielles, {len(a_faire)} à faire, sur {len(liste)}.",
         f"Rythme visé : 1 lot de {LOT} notions par séance de travail, 2 séances par semaine → ≈ {len(lots) / 2:.0f} semaines.", "",
         "Méthode par lot : GS() pour chaque niveau (2 à 4 étapes, la dernière = la réponse), q.traps pour les erreurs typiques ;",
         "problèmes à contexte : au moins 3 situations parlantes par niveau, étiquette ctx (règle du 14.11 : jamais le même contexte en boucle),",
         "puis tests/test.html (contrôle des guides) et tests/trivial.html, commit, push. Le point du jour affiche le prochain lot.", ""]
    for k, lot in enumerate(lots, 1):
        L.append(f"- [ ] Lot {k} ({lot[0][0]}) : " + ", ".join(f"{i}" + (f" ({niveaux_guides(B[i])}/3)" if niveaux_guides(B[i]) else "") for _, i in lot))
    open(os.path.join(RAC, "tools", "plan_pas_a_pas.md"), "w", encoding="utf-8").write("\n".join(L) + "\n")
    print("\n".join(L[:4])); print(f"{len(lots)} lots")

if __name__ == "__main__":
    main()
