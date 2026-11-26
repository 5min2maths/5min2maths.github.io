#!/usr/bin/env python3
"""Référentiel de la maturité professionnelle (MP 1re–4e) embarqué dans l'app : src/ref_mp.js (26.11, phase MP).

Règle de l'enseignant : chaque système affiche SON référentiel, avec SES dénominations. Pour la MP, c'est le plan
d'études d'établissement de mathématiques du CFPT (PEE MP 8, ordonnance 2026 : semestres S1–S8, mathématiques
fondamentales S1–S4 et spécifiques S5–S8), lui-même tiré du plan d'études cadre fédéral (PEC MP du SEFRI ; PEC 2025 pour
la nouvelle ordonnance, PEC 2012 pour les volées qui la précèdent). L'enseignant en a tiré un référentiel de compétences
(~/Dropbox/2026-2027/CFPT/Referentiel/referentiel_MP.csv, hors dépôt, lu sans modification) : un objectif par ligne du
PEE, avec son statut (PEC = au plan d'études cadre ; * = ajouté par le groupe de mathématiques ; facultatif). Ce sont les
compétences des grilles « Je sais… » des champs d'évaluation de la MP.

On n'embarque que code, année (MP1–MP4), semestre, chapitre et intitulé (forme courte : « Savoir » retiré,
« facultatif » ajouté aux objectifs facultatifs du PEE, PGDC au lieu de PGCD) ; rien d'autre du CSV (exercices, polycopiés, équivalences
avec le Collège, Sésamath restent hors de l'app : séparation des systèmes).

Rattachement compétence ↔ questions : motifs « MP » de tools/referentiels.py (MAP) et champ codesMP des notions de src/*.js,
puis (dans l'app, src/referentiel.js) seulement les notions du catalogue MP : jamais une notion propre au Collège ou au CO.
Affiné au niveau de question quand c'est net (NIVEAUX) ; objectifs de tracé, de construction ou de vocabulaire : aucun
rattachement (SANS), ils sont « travaillés en classe ».

Usage : python3 tools/ref_mp.py   (relancer après un changement du CSV, des motifs MP, de NIVEAUX ou de SANS)
"""
import csv, json, re, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import referentiels as R  # noqa: E402

ROOT = R.ROOT
CSV = R.REFS["MP"][0]
OUT = ROOT / "src" / "ref_mp.js"
STATUTS = ["PEC", "*", "facultatif"]

# Notion → { code : niveaux de question qui travaillent l'objectif } ([] : la notion ne l'alimente pas), pour les
# motifs MP de tools/referentiels.py trop larges (lu dans src/competences.js et les générateurs ; à valider).
NIVEAUX = {
    "fracadd": {"S1.CN.04": [], "S1.CN.10": [1]},  # pas de changement d'écriture (décimale, pourcentage) dans fracadd
    "affine": {"S3.FA.06": []},  # la réciproque est la notion recipaff
    "droitesrem": {"S2.GE.02": []},  # notion hors du catalogue MP (constructions du Collège)
}

# Rattachements ajoutés (26.11) : notions propres à la MP sans motif (soutien de MP 1re–2e, rangées par
# THEME_FALLBACK) et notions de MP 3e–4e (src/ch_mp3.js, ch_mp4.js : un objet { th, sem } sans codesMP). « id@12 » =
# niveaux 1 et 2. Lu dans les savoir-faire par niveau (comps) de chaque notion ; à valider par l'enseignant.
AJOUTS = {
    # MP 1re–2e : notions de soutien
    "S1.CN.06": ["fracops@3"], "S1.CN.07": ["divcrit", "premiers@1"], "S1.CN.08": ["premiers"], "S1.CN.10": ["fracsimp"],
    "S1.CN.11": ["fracops@12"], "S1.CA.04": ["parenth"], "S1.EQ.01": ["eqfrac", "eqspec"], "S1.EQ.04": ["eq2fact"],
    "S2.GE.04": ["pythfig"], "S2.GE.05": ["pythrec"], "S2.GE.08": ["cercthales"], "S2.GE.09": ["geocomb"],
    "S2.TR.05": ["trigexact"], "S2.SY.05": ["sysprob"], "S2.FO.05": ["lectgraph"],
    "S3.FA.01": ["affzero"], "S3.FA.05": ["modaff"], "S3.FA.06": ["recipaff"], "S3.FA.03": ["droitesinter"],
    "S3.FQ.01": ["f2formes@1"], "S3.FQ.02": ["f2formes"], "S3.FQ.05": ["f2trois"],
    "S4.TG.03": ["trigassoc"], "S4.TG.06": ["triaire"], "S4.TG.08": ["trigeq2"],
    # MP 3e (S5–S6)
    "S5.EA.01": ["eqabs"], "S5.EA.02": ["eq2disc"], "S5.EA.03": ["eqbic"], "S5.EA.05": ["eqirrmp"], "S5.EA.06": ["eqratmp"],
    "S5.EA.07": ["eqratmp@3"], "S5.PL.01": ["puiss"], "S5.PL.02": ["puisrat@1"], "S5.PL.03": ["puisrat@23"],
    "S5.PL.04": ["logdef@1"], "S5.PL.05": ["logdef@12"], "S5.PL.06": ["logprop"],
    "S6.EL.01": ["eqexp"], "S6.EL.02": ["eqlog"], "S6.EL.03": ["croissexp"],
    "S6.VS.01": ["volmp@1"], "S6.VS.02": ["volmp@3"], "S6.VS.03": ["volmp@2"], "S6.VS.04": ["similmp@3"],
    "S6.VS.05": ["similmp@12"], "S6.VS.06": ["similmp@12"],
    # MP 4e (S7–S8)
    "S7.CO.01": ["coordmp@1"], "S7.CO.02": ["coordmp@2"], "S7.CO.03": ["coordmp@3"],
    "S7.VE.03": ["vectmp@1"], "S7.VE.04": ["vectmp"], "S7.VE.05": ["vectmp@12"], "S7.VE.06": ["vectmp@2"],
    "S7.VE.07": ["scalmp", "projmp@1"], "S7.VE.08": ["scalmp@13"], "S7.VE.09": ["scalmp@2"], "S7.VE.10": ["pvectmp"],
    "S7.DP.01": ["droiteparam@1"], "S7.DP.02": ["droiteparam@1"], "S7.DP.03": ["posdroites"], "S7.DP.04": ["droiteparam@2"],
    "S7.DP.05": ["droiteparam@3", "projmp@2"],
    "S8.IN.01": ["ineqmp@1"], "S8.IN.02": ["ineqmp@23"], "S8.IN.03": ["ineqmp@23"],
    "S8.FP.01": ["fimg", "domaine"], "S8.FP.02": ["lectgraph"], "S8.FP.03": ["fctmp@12"], "S8.FP.04": ["fctmp@1"],
    "S8.FP.06": ["fctmp@23"], "S8.FP.07": ["polymp@13"], "S8.FP.08": ["polymp@2"], "S8.FP.09": ["polymp@3"],
    "S8.FS.01": ["sinusmp@12"], "S8.FS.02": ["sinusmp@3"], "S8.FS.03": ["explogfn@12"], "S8.FS.04": ["explogfn@13"],
    "S8.FS.05": ["explogfn@23", "sinusmp@3"], "S8.FS.06": ["fratmp"],
}

# Objectifs qu'une réponse saisie n'évalue pas (tracer, représenter, construire, vocabulaire, définition) : pas de
# rattachement, même si un motif de notion les couvre (26.11, lu dans les intitulés ; à valider par l'enseignant).
SANS = {
    "S2.GE.01": "connaître les figures (vocabulaire)",
    "S2.GE.03": "vocabulaire du cercle",
    "S3.FA.02": "tracer une droite",
    "S3.FQ.04": "tracer une parabole",
    "S4.AD.04": "représenter des données (diagrammes)",
    "S7.VE.01": "définition d'un vecteur",
    "S7.VE.02": "opérations graphiques sur les vecteurs",
    "S8.FP.05": "tracer une fonction transformée",
}
# Notions des MP 3e–4e (enregistrées par src/ch_mp3.js et ch_mp4.js, hors du format lu par tools/referentiels.py).
MP34 = re.compile(r'\{ id: "(\w+)", th: "[A-Z]{2}", sem: "S[5-8]"')


def rows():
    return list(csv.DictReader(open(CSV, encoding="utf-8"), delimiter=";"))


def court(r):
    """Intitulé affiché : « Savoir résoudre … » → « Résoudre … » ; « (facultatif) » si le PEE le dit."""
    t = re.sub(r"^Savoir ", "", r["competence"].strip())
    t = t[0].upper() + t[1:]
    t = t.replace("PGCD", "PGDC")  # dénomination romande (celle de l'app) ; « PGCD » est le terme français
    if r["statut"] == "facultatif":
        t = t[:-1] + ", facultatif)" if t.endswith(")") else t + " (facultatif)"
    return t


def chapitre(r):
    """Chapitre du PEE sans la mention de semestres « (S1 et S2) » (le semestre est affiché à part)."""
    return re.sub(r"\s*\(S\d et S\d\)", "", r["chapitre"]).strip()


def links(rs=None):
    """{ code : ["notion" | "notion@13"] } ; seulement les notions qui existent dans l'app et dont un motif MP couvre le code."""
    ids, _ = R.load_map()
    known = set(ids) | set(MP34.findall("".join((ROOT / "src" / f).read_text(encoding="utf-8") for f in ("ch_mp3.js", "ch_mp4.js"))))
    out = {}
    for r in rs or rows():
        L = []
        if r["code"] not in SANS:
            for n, m in R.MAP.items():
                if n not in known or "MP" not in m or not re.match(m["MP"], r["code"]):
                    continue
                lv = NIVEAUX.get(n, {}).get(r["code"])
                if lv is None:
                    L.append(n)
                elif lv:
                    L.append(n + "@" + "".join(map(str, lv)))
            for s in AJOUTS.get(r["code"], []):
                assert s.split("@")[0] in known, ("notion inconnue", r["code"], s)
                if s not in L:
                    L.append(s)
        out[r["code"]] = L
    return out


def etat(r, L):
    return "couvert" if L else ("hors saisie" if r["code"] in SANS or R.HORS.search(r["competence"]) else "à faire")


def main():
    rs = rows()
    for r in rs:
        assert re.fullmatch(r"S[1-8]\.[A-Z]{2}\.\d\d", r["code"]), r["code"]
        assert r["annee"] == "MP" + str((int(r["code"][1]) + 1) // 2), r["code"]  # S1–S2 = MP1 … S7–S8 = MP4
        assert r["semestre"] == r["code"][:2], r["code"]
        assert r["statut"] in STATUTS, r["statut"]
    assert len({r["code"] for r in rs}) == len(rs), "codes en double"
    for c in list(SANS) + list(AJOUTS):
        assert any(r["code"] == c for r in rs), c
    assert not set(SANS) & set(AJOUTS)
    lk = links(rs)
    th = []
    idx = lambda L, x: L.index(x) if x in L else (L.append(x) or len(L) - 1)
    # [code, statut, thème (« Semestre n — chapitre »), notion (vide), intitulé, année MP (1–4)]
    data = [[r["code"], STATUTS.index(r["statut"]), idx(th, "Semestre " + r["semestre"][1] + " — " + chapitre(r)), 0, court(r), int(r["annee"][2])] for r in rs]
    js = ("// Généré par tools/ref_mp.py (26.11) : objectifs de mathématiques de la maturité professionnelle (plan d'études\n"
          "// d'établissement MP, semestres 1 à 8, d'après le plan d'études cadre fédéral) et rattachement aux notions de l'app.\n"
          "// Champs : code, statut (0 = plan d'études cadre, 1 = ajouté par l'école, 2 = facultatif), thème, notion, intitulé, année MP.\n"
          "const REF_MP = {\n  niv: " + json.dumps(STATUTS, ensure_ascii=False) + ",\n"
          "  th: " + json.dumps(th, ensure_ascii=False) + ",\n"
          "  no: [\"\"],\n"
          "  c: [\n" + ",\n".join("    " + json.dumps(d, ensure_ascii=False) for d in data) + "\n  ],\n"
          "  // objectif → notions de l'app (« id » : tous les niveaux de question ; « id@13 » : niveaux 1 et 3)\n"
          "  q: " + json.dumps({c: L for c, L in lk.items() if L}, ensure_ascii=False, separators=(",", ":")) + ",\n};\n")
    assert not any("//" in l for l in js.splitlines() if not l.lstrip().startswith("//")), "« // » au milieu d'une ligne"
    OUT.write_text(js, encoding="utf-8")
    by = {}
    for r in rs:
        t = by.setdefault(r["semestre"], [0, 0, 0])
        t[0] += 1
        t[1] += bool(lk[r["code"]])
        t[2] += etat(r, lk[r["code"]]) == "hors saisie"
    print(f"{OUT.relative_to(ROOT)} : {len(rs)} objectifs, {sum(bool(v) for v in lk.values())} rattachés à des questions")
    for s, (t, q, h) in sorted(by.items()):
        print(f"  {s} {t:3} objectifs, {q:3} avec questions, {h:2} hors saisie, {t - q - h:2} à faire")
    if "-v" in sys.argv:
        for r in rs:
            print(f"  {r['code']:9} {etat(r, lk[r['code']]):11} {','.join(lk[r['code']]):40.40} {court(r)[:80]}")


if __name__ == "__main__":
    main()
