#!/usr/bin/env python3
"""Couverture du programme français par 5min2maths, attendu par attendu (25.11.2026, branche agent/frcouv).

Lit tools/referentiels_fr.json (attendus officiels, tools/referentiels_fr.py) et deux instantanés du catalogue d'un profil
français (Engine.catalog, classes 6e → Tle) : « avant » et « après » le chantier. Les instantanés se prennent avec une
page de sonde qui écrit {notions, cat: {grade: [[id, de l'année 0/1, thème]]}} (voir tools/france_couverture.md, § Méthode).
La table MAP ci-dessous remplace la correspondance du JSON quand elle est périmée ou fausse (notions créées depuis le 23.11,
notions retirées, attendu mal rattaché) ; PARTIEL = attendu seulement en partie couvert ; NS = non saisissable en plus
de ceux que le JSON marque.

Usage : python3 tools/france_couverture.py avant.json apres.json > tools/france_couverture.md
"""
import json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REF = json.loads((ROOT / "tools/referentiels_fr.json").read_text())["classes"]
CLASSES = [("6e", 6), ("5e", 7), ("4e-2019", 8), ("3e-2019", 9), ("2nde", 10), ("1re", 11), ("Tle", 12)]
NOM = {6: "6e", 7: "5e", 8: "4e", 9: "3e", 10: "2nde", 11: "1re spécialité", 12: "Tle spécialité"}

MAP = {
    # 6e (cycle 3, 2025)
    "6e.NC.26": ["decdiv", "multdiv"], "6e.EG.02": ["mediatrice"], "6e.EG.06": ["mediatrice"], "6e.EG.07": ["mediatrice"], "6e.EG.08": ["mediatrice"], "6e.EG.17": ["mediatrice"],
    "6e.EG.19": ["symax"], "6e.EG.20": ["symax"], "6e.DP.05": ["proba6"], "6e.DP.06": ["proba6"], "6e.DP.07": ["proba6"], "6e.PF.05": ["echelle6"], "6e.NC.42": ["prop", "fractout"], "6e.NC.43": ["motifs"], "6e.DP.04": ["diagr"],
    # 5e (2026)
    "5e.NC.11": ["tradexpr", "progcalc"], "5e.EG.05": ["empil"], "5e.EG.06": ["empil"], "5e.EG.25": ["mediatrice"], "5e.EG.28": ["mediatrice"], "5e.NC.33": ["automat"], "5e.NC.47": ["automat"], "5e.NC.55": ["motifs"], "5e.NC.56": ["motifs"], "5e.NC.57": ["motifs"], "5e.NC.58": ["automat"], "5e.NC.62": ["structexpr"],
    # 4e (attendus 2019)
    "4e-2019.NC.21": ["premiers"], "4e-2019.NC.22": ["structexpr"], "4e-2019.NC.25": ["probeq", "progcalc"], "4e-2019.EG.07": ["thales4e", "cos4e", "pyth"],
    "4e-2019.PF.04": ["prop", "agrand", "ratio"],
    # 3e (attendus 2019)
    "3e-2019.NC.02": ["fracops", "autodnb"], "3e-2019.NC.07": ["premiers", "divcrit"], "3e-2019.NC.10": ["idrem", "factor", "autodnb"],
    "3e-2019.PF.01": ["linfn"], "3e-2019.PF.12": ["linfn"], "3e-2019.PF.09": ["affine", "linfn"], "3e-2019.PF.02": ["pctvar", "linfn"],
    # 2nde (2026)
    "2nde.AP.03": ["algopy"], "2nde.AP.06": ["algopy"], "2nde.AP.07": ["algopy", "stats"], "2nde.AP.08": ["algopy"], "2nde.NC.10": ["ratio", "tauxevol", "compdiff"], "2nde.AU.01": ["compdiff"],
    "2nde.GE.01": ["vect3e"], "2nde.GE.02": ["vect3e"], "2nde.GE.03": ["vect3e"], "2nde.GE.05": ["vect3e"], "2nde.GE.06": ["vect3e", "vecgeo"], "2nde.GE.07": ["vect3e", "cart"],
    "2nde.GE.08": ["droites", "vect3e"], "2nde.GE.09": ["droites", "vect3e"], "2nde.AN.08": ["tabvar", "lectgraph"], "2nde.AN.09": ["tabvar", "lectgraph"],
    "2nde.AN.05": ["tabsignes", "ineq1"], "2nde.SP.05": ["stats", "diagr"], "2nde.SP.07": ["probcond"], "2nde.SP.11": ["probcond"], "2nde.SP.12": ["probcond", "proba2"],
    "2nde.SP.13": ["probcond", "proba2"], "2nde.SP.14": ["probcond"], "2nde.SP.10": ["probcond"], "2nde.AU.18": ["affine", "linfn"], "2nde.AU.10": ["eq1", "eq2fact", "ineq1"],
    # 1re spécialité (2026)
    "1re.AU.06": ["ineq1", "affzero", "ineq2", "tabsignes"], "1re.AU.07": ["distrib", "factor", "idrem"], "1re.AU.09": ["lectgraph", "tabvar"], "1re.AU.13": ["diagr", "stats", "quartiles"],
    "1re.AU.15": ["stats", "quartiles"], "1re.AU.16": ["probcond", "probtot"], "1re.AU.17": ["probcond", "probtot"],
    "1re.AL.01": ["suitedef"], "1re.AL.02": ["suitedef", "suitearith", "suitegeo"], "1re.AL.04": ["suitearith", "suitegeo", "suitesomme"], "1re.AL.05": ["suitearith", "suitegeo"],
    "1re.AN.01": ["tauxvar"], "1re.AN.02": ["nbderive", "tangente"], "1re.AN.04": ["tangente"], "1re.AN.05": ["tangente"], "1re.AN.06": ["derivref", "derivregles", "derivprodquot"],
    "1re.AN.07": ["variations"], "1re.AN.09": ["variations", "posrelc"], "1re.AN.08": ["optimderiv", "optim"], "1re.AN.10": ["variations", "f2"], "1re.AN.11": ["expfn"], "1re.AN.12": ["expderiv"],
    "1re.AN.13": ["expderiv"], "1re.AN.14": ["expderiv", "suitegeo"], "1re.AN.15": ["trigrad"], "1re.AN.16": ["trigrad"],
    "1re.GE.02": ["pscal"], "1re.GE.03": ["pscal"], "1re.GE.04": ["droitenorm"], "1re.GE.05": ["droitenorm"], "1re.GE.08": ["droitenorm", "pscal", "cart"],
    "1re.SP.01": ["probtot", "condbayes"], "1re.SP.04": ["probarbre"], "1re.SP.07": ["vaesp", "varalea"], "1re.SP.08": ["vaesp", "varalea"], "1re.SP.09": ["vaesp", "varalea"],
    # Tle spécialité (texte 2026 du JSON ; 2019 en vigueur, contenus voisins)
    "Tle.AG.01": ["denombr", "combi"], "Tle.AG.02": ["denombr", "combi"], "Tle.AG.04": ["colin"], "Tle.AG.05": ["posrel"], "Tle.AG.06": ["colin"], "Tle.AG.07": ["colin"],
    "Tle.AG.08": ["colin", "vect3d"], "Tle.AG.10": ["distances", "pscal3d"], "Tle.AG.11": ["distances"], "Tle.AG.12": ["pscal3d", "plans"], "Tle.AG.13": ["droite3d"],
    "Tle.AG.14": ["plans"], "Tle.AG.15": ["pscal3d", "distances"], "Tle.AG.16": ["posrel", "colin"],
    "Tle.AN.01": ["suitelim"], "Tle.AN.02": ["recurrence"], "Tle.AN.03": ["suitelim", "suitegeo"], "Tle.AN.04": ["limites", "limitinf", "suitelim"], "Tle.AN.05": ["asymptotes"],
    "Tle.AN.06": ["derivcomp", "lnexp"], "Tle.AN.10": ["derivseconde"], "Tle.AN.11": ["tvi"], "Tle.AN.12": ["tvi", "suitelim"], "Tle.AN.13": ["lnfr", "lnexp"],
    "Tle.AN.14": ["lnfr", "etudelnexp", "croissance"], "Tle.AN.15": ["trigfr"], "Tle.AN.16": ["trigfr"], "Tle.AN.17": ["trigfr"], "Tle.AN.18": ["trigfr"],
    "Tle.AN.19": ["primitives"], "Tle.AN.20": ["eqdiff"], "Tle.AN.21": ["eqdiff"], "Tle.AN.22": ["integrale"], "Tle.AN.23": ["integrale", "intparties"],
    "Tle.AN.24": ["intmaj"], "Tle.AN.25": ["aireint"], "Tle.AN.26": ["suiteint"], "Tle.AN.27": ["integrale"],
    "Tle.SP.01": ["probarbre", "binom"], "Tle.SP.02": ["binom", "binomiale"], "Tle.SP.03": ["binom", "binomiale"], "Tle.SP.06": ["sommeva"], "Tle.SP.07": ["sommeva"],
}
# Couverture partielle (la notion ne traite qu'une partie de l'attendu)
PARTIEL = {"6e.NC.42", "6e.NC.26", "3e-2019.NC.07", "2nde.AP.08", "1re.AN.05", "6e.EG.02", "6e.EG.17", "5e.EG.28", "1re.AN.13", "1re.GE.08", "1re.SP.04", "2nde.SP.10",
           "Tle.AG.06", "Tle.AG.12", "Tle.AN.21", "Tle.AN.12"}
# Attendu couvert en partie seulement tant que la notion indiquée manque (notions créées par agent/frfin, 25.11 au soir)
SANS = {"1re.AN.09": "posrelc", "2nde.NC.10": "compdiff"}
# Non saisissables en plus de ceux du JSON : Python (listes) en Tle
NS = {"Tle.AP.01", "Tle.AP.02", "Tle.AP.03", "Tle.AP.04"}


def load(path):
    d = json.loads(Path(path).read_text())
    return {int(g): {c[0]: c[1] for c in v} for g, v in d["cat"].items()}


def verdict(code, a, grade, cat):
    ns = (a.get("saisie") is False) or code in NS
    ids = MAP.get(code, a["notions"])
    if ns:
        return "—", ids
    here = [i for i in ids if i in cat[grade]]
    cur = [i for i in here if cat[grade][i]]
    if not here:
        return "✗", ids
    if code in PARTIEL or (code in SANS and SANS[code] not in here):
        return "◐", here
    if cur or a.get("type") == "automatisme":
        return "✅", here
    return "◐", here  # seulement en révision d'une année antérieure


def main():
    av, ap = load(sys.argv[1]), load(sys.argv[2])
    out, synth = [], []
    for key, g in CLASSES:
        rows, cnt = [], {"av": [0, 0, 0], "ap": [0, 0, 0]}
        for t in REF[key]["themes"]:
            for a in t["attendus"]:
                v0, _ = verdict(a["code"], a, g, av)
                v1, ids = verdict(a["code"], a, g, ap)
                for k, v in (("av", v0), ("ap", v1)):
                    if v == "✅": cnt[k][0] += 1
                    elif v == "◐": cnt[k][1] += 1
                    elif v == "✗": cnt[k][2] += 1
                txt = a["texte"].replace("|", "/")
                rows.append("| %s | %s | %s | %s%s |" % (a["code"], txt[:110] + ("…" if len(txt) > 110 else ""), ", ".join("`%s`" % i for i in ids) or "—", v1, "" if v0 == v1 else " (avant %s)" % v0))
        tot = lambda c: sum(c)
        pct = lambda c: round(100 * (c[0] + 0.5 * c[1]) / max(1, tot(c)))
        synth.append("| %s | %d | %d ✅ · %d ◐ · %d ✗ → **%d %%** | %d ✅ · %d ◐ · %d ✗ → **%d %%** | %d / %d |" % (
            NOM[g], tot(cnt["ap"]), *cnt["av"], pct(cnt["av"]), *cnt["ap"], pct(cnt["ap"]),
            sum(1 for i, c in ap[g].items() if c), len(ap[g])))
        out.append("\n## %s (`%s`, %s)\n\n| Code | Attendu | Notions | Verdict |\n|---|---|---|---|\n%s" % (NOM[g], key, REF[key]["reference"], "\n".join(rows)))
    print(HEAD)
    print("| Classe | Attendus saisissables | Avant (agent/frcouv) | Après (agent/frfin) | Notions de l'année / catalogue |\n|---|---|---|---|---|")
    print("\n".join(synth))
    print(LEGEND)
    print("\n".join(out))
    print(FOOT)


HEAD = """# Couverture du programme français, attendu par attendu (25.11.2026)

Branches `agent/frcouv` puis `agent/frfin` (25.11 au soir). Calculé par `tools/france_couverture.py` à partir des attendus officiels (`tools/referentiels_fr.json` :
cycle 3 2025, cycle 4 2026 pour la 5e, attendus 2019 en 4e et 3e — en vigueur en 2026-2027 —, 2nde et 1re 2026, Tle (texte
2026, très proche du 2019 en vigueur) et du catalogue réel d'un profil français (`Engine.catalog`), avant et après le chantier.
Décisions, rattachements, retraits et niveau : § final de `tools/france.md` et rapport de l'agent.

## Synthèse
"""
LEGEND = """
Taux = (✅ + ½ ◐) / attendus saisissables. ✅ : une notion du catalogue de la classe entraîne l'attendu (de l'année, ou
automatisme repris) ; ◐ : couverture partielle, ou seulement en révision d'une année antérieure ; ✗ : rien ; — : non
saisissable (construction, démonstration, programmation). « avant » = catalogue après la branche agent/frcouv
(25.11 après-midi) ; « après » = branche agent/frfin (25.11 au soir).
"""

FOOT = """
## Méthode (pour refaire le calcul)

1. Instantané du catalogue : page de sonde (non commitée) qui charge les sources dans l'ordre de `build.py` et écrit
   `OK {"notions": [...], "cat": {"6": [[id, 1 si de l'année, thème], …], …}}` pour les profils `{ system: "FR", grade: 6…12 }`
   (`Engine.catalog`) ; Chromium sans interface (`--dump-dom`), une page à la fois, verrou de `tools/run_tests.sh`.
2. `python3 tools/france_couverture.py avant.json apres.json > tools/france_couverture.md`.
3. La table `MAP` du script corrige la correspondance attendu → notions du JSON (périmée depuis le 23.11) ; `PARTIEL` et
   `NS` sont des jugements de l'agent, à relire.

## Ce qui a été fait (25.11, branche agent/frcouv)

- **Rattachées** (attendu contrôlé forme par forme ; formes hors programme écartées par `HORS_FR`, `src/fr_couv.js`) :
  1re : `tauxvar`, `nbderive`, `derivref` (sans exposants rationnels ; sin/cos en Tle), `derivregles`, `derivprodquot`,
  `tangente` (Newton en Tle), `variations`, `optimderiv`, `probarbre`, `condbayes`, `varalea` ; Tle : `derivcomp`,
  `derivseconde`, `limites`, `limitinf`, `asymptotes` (sans asymptote oblique), `continuite`, `etudefct`, `lnexp`,
  `etudelnexp`, `croissance`, `primitives` (sans x^(3/2)), `eqdiff` (sans variables séparables), `integrale`, `aireint`,
  `intparties` (sans e^x cos x), `combi` (sans le jass), `binomiale`, `vect3d`, `colin`, `droite3d`, `plans`, `posrel`,
  `pscal3d`, `distances` ; 2nde : `probaxiomes` ; 3e : `ineq1` (programme 2026, fin d'année), `proba2` (effacées par
  `applyFrCollege` depuis le 23.11).
- **Retirées** du catalogue français : `sinlaw`, `recip`, `expo`, `modexp`, `trigcercle`, `trigassoc`, `trigfn`, `trigeq`
  (degrés), `log` (log₂), `vecteurs` (« composantes »). Non rattachées : `sphere`, `volrev`, `intsubst`, `normale`,
  `statdesc`, `matrices`… (hors programme français).
- **Créées** (3 niveaux, ≥ 3 formes par niveau, pas à pas, pièges, contextes, leçon, compétences ; défi de niveau 4
  pour `expderiv`, `trigrad`, `autodnb`, `tabvar`, `lnfr`) : 1re `expderiv`, `trigrad`, `droitenorm` (`src/fr_1re.js`) ;
  4e `cos4e`, `thales4e` ; 3e `linfn`, `autodnb`, `vecgeo` ; 2nde `tabvar` (`src/fr_3e.js`) ; Tle `lnfr`, `trigfr`, `tvi`,
  `sommeva`, `recurrence` (`src/fr_tle.js`).
- **Niveau** : `UPFR` (`src/fr_couv.js`, lu par `Engine.make`) relève le niveau 1 des notions reprises d'une année
  inférieure en 4e, 3e, 2nde et 1re (sonde `tests/_niv_fr.html` : « 3² », « 5 − 7 », « 50 % de 260 », « 4(2x + 2 ) »…) ;
  automatismes de l'épreuve anticipée repris en 1re (`againFR` 11). Profils suisses inchangés (test `tests/france.html`).
- **Vocabulaire** (`frLocal`) : y = mx + p, « côtés de l'angle droit » (cathètes), « ensemble de définition ».

## Ce qui a été fait (25.11 au soir, branche agent/frfin)

- **Créées** (`src/fr_fin.js` ; 3 niveaux, ≥ 3 formes par niveau, pas à pas, pièges, contextes, leçon, compétences, défi de
  niveau 4 ; leçon active à curseurs dans `src/fr_act.js`) : 6e `symax` (symétrie axiale : axes d'une figure, conservation,
  quadrillage, droite graduée), `mediatrice` (équidistance, milieu, cercle circonscrit), `echelle6` (plans, cartes,
  maquettes ; la notion suisse `echelle` mélange aires × k² et volumes × k³, de 4e), `proba6` (dé, sac, roue, fréquences ;
  `proba`, de 5e, a deux dés et des tirages sans remise) ; 5e `empil` (empilements de cubes, vues de dessus, de face, de
  droite) ; 2nde `compdiff` (comparer par différence ou par quotient) ; 1re `posrelc` (position relative de deux courbes,
  signe de f − g) ; Tle `intmaj` (majorer, encadrer une intégrale, rectangles), `suiteint` (suites d'intégrales).
- **Rattachée** : `progcalc` (programmes de calcul) passe de la 4e à la 5e (5e.NC.11), reprise en 4e et 3e ; formes de 4e
  écartées en 5e par `HORS_FR` (nombre négatif multiplié, (x + a)², (x + a)(x − a)), deux formes de 5e ajoutées au niveau 3 ;
  niveau 1 relevé en 4e (`UPFR`).
- **Notes sur 20** : pour un profil français, `FR_NOTES` (lu par `Engine.finalize`) remplace les questions à notes suisses
  (1 à 6) de `statfreq`, `stats`, `diagr`, `probeq` par des questions de même niveau et de même graine, notes sur 20.
- Contrôle : `tests/frfin.html` (générateurs, défis, classes, progcalc en 5e, notes), `tests/act_frfin.html` (leçons actives).

## Ce qui reste

- 6e : distances à un point, cercle comme ensemble de points, bissectrice (surtout des constructions) ; filtrer un tableau.
- 5e : tableaux de valeurs et graphiques sans la notation f(x) (`tabval` et `lectgraph` placés en 3e et 4e) ; hauteurs
  concourantes.
- 4e–3e : repérage dans un pavé droit, sur une sphère (latitude, longitude).
- 2nde : algorithmique de simulation (AP.08).
- 1re : arbre de n ⩽ 4 épreuves de Bernoulli
  (SP.04, en partie dans `probarbre`) ; tracé des courbes de e^(kt) (AN.13, non saisissable).
- Tle : équations y' = ay + f (AN.21, en partie) ; Python
  (listes) hors périmètre.
- Programmes 2026 de 4e (2027-2028) et de 3e (2028-2029) : `vecgeo` et `ineq1` sont déjà en fin de 3e.
"""

if __name__ == "__main__":
    main()
