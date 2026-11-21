#!/usr/bin/env python3
"""Signaux muets (20.11) : ce que les élèves font sans le dire, pour savoir quoi regarder.

Source : feuille « questions » de l'Apps Script (…/exec?questions=CLÉ), une ligne anonyme par question jouée ou
leçon vue (voir src/app.js, « Signaux muets »). Les appareils de l'auteur (tools/appareils_auteur.txt) sont exclus.
Principe (décision du 20.11) : ce sont les élèves qui jugent ; la relecture de l'auteur ne porte que sur ce qu'ils
signalent par leur comportement, surtout quand c'est peut-être l'app qui se trompe (réponse juste refusée).

Usage : python3 tools/signaux.py            détail par notion et niveau
        python3 tools/signaux.py --point    4 à 6 lignes pour le point du jour (Calendrier/stats_5min2maths.py)
        python3 tools/signaux.py --jours 30 fenêtre (60 jours par défaut)
        python3 tools/signaux.py --fichier x.json   données locales (test)
"""
import json, re, statistics, sys, urllib.request
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://5min2maths.github.io/"
ECHEC = {"faux", "idk", "partiel"}
REPONDU = {"ok1", "ok2"} | ECHEC
MIN_N, MIN_APP = 4, 2  # au moins 4 passages sur au moins 2 appareils avant de signaler quoi que ce soit


def charger(jours=60, fichier=None):
    if fichier:
        d = json.loads(Path(fichier).read_text())
    else:
        url = re.search(r'VOTE_ENDPOINT = "([^"]+)"', (ROOT / "src" / "app.js").read_text()).group(1)
        cle = (ROOT / "tools" / ".cle_lecture").read_text().strip()
        with urllib.request.urlopen(f"{url}?questions={cle}&jours={jours}", timeout=30) as r:
            d = json.loads(r.read().decode())
    if "lignes" not in d:
        raise RuntimeError(d.get("erreur", "réponse inattendue (script Google pas encore redéployé ?)"))
    cols = d["colonnes"]
    lignes = [dict(zip(cols, l)) for l in d["lignes"]]
    auteur = set()
    f = ROOT / "tools" / "appareils_auteur.txt"
    if f.exists():
        auteur = {l.strip() for l in f.read_text().splitlines() if l.strip() and not l.startswith("#")}
    # même uid : instantané (app en arrière-plan) puis ligne finale → on garde la dernière reçue
    par_uid = {}
    for l in lignes:
        if l.get("appareil") in auteur:
            continue
        par_uid[l.get("uid") or id(l)] = l
    return list(par_uid.values())


def pc(a, b):
    return round(100 * a / b) if b else 0


def analyser(lignes):
    # Questions curieuses (21.11) : genre « curieux », code cur-<clé>-<graine> ; à part (pas de niveau, pari en plus).
    cur = [l for l in lignes if l.get("type") == "q" and (l.get("genre") == "curieux" or str(l.get("code", "")).startswith("cur-"))]
    q = [l for l in lignes if l.get("type") == "q" and l not in cur]
    lec = [l for l in lignes if l.get("type") == "lecon"]
    groupes = defaultdict(list)
    for l in q:
        groupes[(l["notion"], int(l["niveau"] or 0))].append(l)
    # durée de référence par niveau (médiane des questions auxquelles on a répondu)
    ref = defaultdict(list)
    for l in q:
        if l["issue"] in REPONDU and l["secondes"] != "":
            ref[int(l["niveau"] or 0)].append(float(l["secondes"]))
    ref = {k: statistics.median(v) for k, v in ref.items() if v}
    stats, alertes = [], []
    for (notion, niv), ls in groupes.items():
        n, apps = len(ls), len({l["appareil"] for l in ls})
        rep = [l for l in ls if l["issue"] in REPONDU]
        ech = [l for l in rep if l["issue"] in ECHEC]
        quit = [l for l in ls if l["issue"] == "quitte"]
        illis = [l for l in ls if (l["illisibles"] or 0) > 0]
        secs = [float(l["secondes"]) for l in rep if l["secondes"] != ""]
        med = statistics.median(secs) if secs else None
        aide = [l for l in rep if re.search(r"[ges]", str(l["aide"]))]
        s = dict(notion=notion, niv=niv, n=n, apps=apps, ok1=pc(sum(l["issue"] == "ok1" for l in rep), len(rep)),
                 echec=pc(len(ech), len(rep)), quitte=pc(len(quit), n), illis=len({l["appareil"] for l in illis}),
                 sec=med, aide=pc(len(aide), len(rep)), ex=[(l["code"], str(l["1re réponse fausse"]).lstrip("'")) for l in ech if l["1re réponse fausse"] != ""][:3])
        stats.append(s)
        if n < MIN_N or apps < MIN_APP:
            continue
        nom = f"{notion} N{niv}" if niv < 4 else f"{notion} défi"
        # 1. peut-être l'app : réponses refusées comme illisibles chez plusieurs élèves, ou échec massif
        if s["illis"] >= 2:
            alertes.append((0, nom, f"réponse illisible chez {s['illis']} élèves — format refusé ?", [l["code"] for l in illis][:3]))
        if len(rep) >= MIN_N and s["echec"] >= 75:
            alertes.append((1, nom, f"{s['echec']} % d'échec — l'app ou la question ?", [c for c, _ in s["ex"]] or [ls[0]["code"]], s["ex"]))
        # 2. décroche : on quitte l'écran sans répondre
        if s["quitte"] >= 30:
            alertes.append((2, nom, f"{s['quitte']} % quittent sans répondre — énoncé peu clair ou trop long ?", [l["code"] for l in quit][:2]))
        # 3. très long par rapport aux autres questions du même niveau
        if med and ref.get(niv) and med > 2.5 * ref[niv] and len(secs) >= MIN_N:
            alertes.append((3, nom, f"{round(med)} s en médiane (≈ {round(ref[niv])} s ailleurs) — trop long ?", [ls[0]["code"]]))
    # leçons : vite passées, défis sautés
    lgr = defaultdict(list)
    for l in lec:
        lgr[l["notion"]].append(l)
    lstats = []
    for notion, ls in lgr.items():
        n, apps = len(ls), len({l["appareil"] for l in ls})
        lues = [l for l in ls if l["issue"] == "lue"]
        secs = [float(l["secondes"]) for l in lues if l["secondes"] != ""]
        med = statistics.median(secs) if secs else None
        act = [l for l in ls if l["genre"] == "active"]
        passe = pc(sum("P" in str(l["aide"]) for l in act), len(act))
        dev = pc(sum("D" in str(l["aide"]) for l in act), sum(bool(re.search("[Dd]", str(l["aide"]))) for l in act))
        lstats.append(dict(notion=notion, n=n, apps=apps, sec=med, passe=passe, devine=dev, quitte=pc(n - len(lues), n)))
        if n < MIN_N or apps < MIN_APP:
            continue
        if med is not None and med < 10:
            alertes.append((4, "leçon " + notion, f"lue en {round(med)} s en médiane — pas lue ?", ["lecon-" + notion]))
        if len(act) >= MIN_N and passe >= 60:
            alertes.append((4, "leçon " + notion, f"{passe} % passent les défis", ["lecon-" + notion]))
    cgr = defaultdict(list)
    for l in cur:
        cgr[str(l["code"]).split("-")[1] if str(l["code"]).count("-") >= 2 else "?"].append(l)
    cstats = []
    for cle, ls in cgr.items():
        n, apps = len(ls), len({l["appareil"] for l in ls})
        paris = [l for l in ls if re.search("[Pp]", str(l["aide"]))]
        rep = [l for l in ls if l["issue"] in ("ok1", "ok2", "faux")]
        secs = [float(l["secondes"]) for l in ls if l["issue"] != "quitte" and l["secondes"] != ""]
        s = dict(cle=cle, n=n, apps=apps, pari=pc(sum("P" in str(l["aide"]) for l in paris), len(paris)),
                 calc=pc(sum(l["issue"] in ("ok1", "ok2") for l in rep), len(rep)), vu=pc(sum(l["issue"] == "idk" for l in ls), n),
                 quitte=pc(sum(l["issue"] == "quitte" for l in ls), n), sansp=pc(n - len(paris), n), sec=statistics.median(secs) if secs else None,
                 ex=[(l["code"], str(l["1re réponse fausse"]).lstrip("'")) for l in ls if l["1re réponse fausse"] != ""][:3])
        cstats.append(s)
        if n < MIN_N or apps < MIN_APP:
            continue
        if s["sansp"] >= 40:
            alertes.append((2, "curieuse " + cle, f"{s['sansp']} % repartent avant de parier — énoncé trop long ?", [ls[0]["code"]]))
        if len(rep) >= MIN_N and s["calc"] <= 25:
            alertes.append((1, "curieuse " + cle, f"{100 - s['calc']} % ratent le calcul — trop dur ou réponse mal lue ?", [c for c, _ in s["ex"]] or [ls[0]["code"]], s["ex"]))
    alertes.sort(key=lambda a: a[0])
    return stats, lstats, alertes, cstats


def lien(code):
    return SITE + ("#l-" + code[6:] if code.startswith("lecon-") else "#q-" + code)


def main():
    a = sys.argv[1:]
    jours = int(a[a.index("--jours") + 1]) if "--jours" in a else 60
    fichier = a[a.index("--fichier") + 1] if "--fichier" in a else None
    try:
        lignes = charger(jours, fichier)
    except Exception as e:
        print(f"Signaux muets : indisponibles ({e})")
        return
    stats, lstats, alertes, cstats = analyser(lignes)
    nq = sum(s["n"] for s in stats)
    if "--point" in a:
        print(f"Signaux muets ({jours} j) : {nq} questions jouées, {sum(s['n'] for s in lstats)} leçons, "
              f"{len({l['appareil'] for l in lignes})} appareils · {len(alertes) or 'aucune'} alerte{'s' if len(alertes) > 1 else ''}"
              + (f" · questions curieuses : {sum(c['n'] for c in cstats)} jouées, pari juste {pc(sum(c['pari'] * c['n'] for c in cstats), 100 * sum(c['n'] for c in cstats))} %" if cstats else ""))
        for al in alertes[:5]:
            ex = "" if len(al) < 5 or not al[4] else " · ex. " + ", ".join(f"« {r} »" for _, r in al[4][:2])
            print(f"    {al[1]} : {al[2]}{ex} → {lien(al[3][0])}")
        if len(alertes) > 5:
            print(f"    … et {len(alertes) - 5} autres (python3 tools/signaux.py)")
        return
    print(f"{len(lignes)} lignes ({jours} jours, appareils de l'auteur exclus)\n")
    print("ALERTES (à regarder, par ordre : l'app se trompe peut-être → décrochage → durée → leçons)")
    for al in alertes or [(0, "—", "aucune pour l'instant (seuils : ≥ 4 passages sur ≥ 2 appareils)", [""])]:
        print(f"  {al[1]:<22} {al[2]}")
        for c in al[3]:
            if c:
                print(f"  {'':<22} {lien(c)}")
        if len(al) > 4:
            for c, r in al[4]:
                print(f"  {'':<22} {c} : 1re réponse « {r} »")
    print("\nQUESTIONS (notion, niveau) : passages · appareils · juste du 1er coup · échec · quittées · illisibles (élèves) · durée médiane · aide")
    for s in sorted(stats, key=lambda s: (-s["n"])):
        print(f"  {s['notion']:<12} N{s['niv']}  {s['n']:>4} · {s['apps']:>3} app. · {s['ok1']:>3} % · {s['echec']:>3} % · {s['quitte']:>3} % · "
              f"{s['illis']} · {('%d s' % s['sec']) if s['sec'] else '—':>5} · {s['aide']} %")
    print("\nQUESTIONS CURIEUSES : passages · appareils · pari juste · calcul juste · réponse affichée · parties sans parier · quittées · durée médiane")
    for s in sorted(cstats, key=lambda s: -s["n"]):
        print(f"  {s['cle']:<12} {s['n']:>4} · {s['apps']:>3} app. · {s['pari']:>3} % · {s['calc']:>3} % · {s['vu']:>3} % · {s['sansp']:>3} % · {s['quitte']:>3} % · "
              f"{('%d s' % s['sec']) if s['sec'] else '—':>5}")
    print("\nLEÇONS : vues · appareils · durée médiane · devine juste · défis passés · quittées")
    for s in sorted(lstats, key=lambda s: -s["n"]):
        print(f"  {s['notion']:<12} {s['n']:>4} · {s['apps']:>3} app. · {('%d s' % s['sec']) if s['sec'] else '—':>5} · {s['devine']} % · {s['passe']} % · {s['quitte']} %")


if __name__ == "__main__":
    main()
