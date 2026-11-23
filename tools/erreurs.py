#!/usr/bin/env python3
"""Erreurs JavaScript des testeurs (chantier N) et rétention (chantier T), 23.11.

Erreurs : feuille « erreurs » de l'Apps Script (…/exec?erreurs=CLÉ&jours=7), une ligne anonyme par erreur non
rattrapée dans l'app (voir src/app.js, « Erreurs JavaScript des testeurs » ; anti-déluge côté app).
Rétention : ouvertures de l'app (événements « open » de la feuille « visites », …/exec?visites=CLÉ).
Les appareils de l'auteur (tools/appareils_auteur.txt) sont exclus des deux.
Tant que l'Apps Script n'est pas redéployé, ces adresses n'existent pas : une ligne « indisponible », sans erreur.

Usage : python3 tools/erreurs.py            détail (erreurs groupées par message, rétention)
        python3 tools/erreurs.py --point    2 lignes pour le point du jour (appelé par tools/signaux.py --point)
        python3 tools/erreurs.py --jours 30 fenêtre des erreurs (7 jours par défaut)
        python3 tools/erreurs.py --fichier-erreurs x.json --fichier-visites y.json --aujourdhui 2026-11-23   (test)
"""
import datetime as dt, json, re, sys, urllib.request
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ABSENT = "feuille pas encore disponible : redéployer l'Apps Script (tools/votes.gs)"


def auteur():
    f = ROOT / "tools" / "appareils_auteur.txt"
    if not f.exists():
        return set()
    return {l.strip() for l in f.read_text().splitlines() if l.strip() and not l.startswith("#")}


def lire(param, jours, fichier=None):
    """Lignes (dict) de …/exec?<param>=CLÉ&jours=N, ou d'un fichier JSON local {colonnes, lignes}."""
    if fichier:
        d = json.loads(Path(fichier).read_text())
    else:
        url = re.search(r'VOTE_ENDPOINT = "([^"]+)"', (ROOT / "src" / "app.js").read_text()).group(1)
        cle = (ROOT / "tools" / ".cle_lecture").read_text().strip()
        with urllib.request.urlopen(f"{url}?{param}={cle}&jours={jours}", timeout=30) as r:
            d = json.loads(r.read().decode())
    if not isinstance(d, dict) or "lignes" not in d:
        # ancien script : l'adresse retombe sur le bilan des votes (pas de « lignes »)
        raise RuntimeError(d.get("erreur") if isinstance(d, dict) and d.get("erreur") else ABSENT)
    exclus = auteur()
    return [x for x in (dict(zip(d["colonnes"], l)) for l in d["lignes"]) if x.get("appareil") not in exclus]


def resume_erreurs(lignes):
    """Erreurs groupées par message (le même bug peut toucher plusieurs appareils), de la plus fréquente à la moins fréquente."""
    g = defaultdict(list)
    for l in lignes:
        g[str(l.get("message", "")).lstrip("'")].append(l)
    return sorted(g.items(), key=lambda kv: (-len({x.get("appareil") for x in kv[1]}), -len(kv[1])))


def ou(l):
    f = str(l.get("fichier", "")).lstrip("'")
    return f"{f}:{l.get('ligne', '')}" if f else "?"


def retention(visites, aujourdhui):
    """Rétention J+N (définition du 23.11) : parmi les appareils dont la 1re ouverture date d'au moins N jours
    (J0 ≤ aujourd'hui − N), part de ceux qui ont rouvert l'app au moins une fois le jour J0 + N ou plus tard.
    J0 = 1re ouverture connue de l'appareil (dans la fenêtre lue). Renvoie {N: (revenus, éligibles)}."""
    jours = defaultdict(set)
    for v in visites:
        try:
            jours[v["appareil"]].add(dt.date.fromisoformat(str(v["jour"])[:10]))
        except (KeyError, ValueError):
            pass
    res = {}
    for n in (1, 7, 30):
        elig = revenus = 0
        for js in jours.values():
            j0 = min(js)
            if (aujourdhui - j0).days >= n:
                elig += 1
                revenus += any((j - j0).days >= n for j in js)
        res[n] = (revenus, elig)
    return res, len(jours)


def ligne_erreurs(lignes, jours):
    if not lignes:
        return f"Erreurs JS ({jours} j) : aucune"
    groupes = resume_erreurs(lignes)
    msg, ls = groupes[0]
    ecrans = Counter(str(l.get("écran", "")) for l in ls if l.get("écran")).most_common(1)
    return (f"Erreurs JS ({jours} j) : {len(lignes)} erreur{'s' if len(lignes) > 1 else ''}, "
            f"{len({l.get('appareil') for l in lignes})} appareil{'s' if len({l.get('appareil') for l in lignes}) > 1 else ''}, "
            f"{len(groupes)} message{'s' if len(groupes) > 1 else ''} ; la plus fréquente : « {msg[:90]} » ({ou(ls[-1])}, {len(ls)}×"
            + (f", écran {ecrans[0][0]}" if ecrans else "") + ")")


def ligne_retention(res, n_app):
    def pc(r, e):
        return f"{round(100 * r / e)} % ({r}/{e})" if e else "—"
    return (f"Rétention ({n_app} appareils, auteur exclu ; revenus le jour J+N ou après) : "
            + " · ".join(f"J+{n} {pc(*res[n])}" for n in (1, 7, 30)))


def point(jours=7, f_err=None, f_vis=None, aujourdhui=None):
    """Lignes pour le point du jour ; chaque partie tolère l'absence de sa feuille."""
    out = []
    try:
        out.append(ligne_erreurs(lire("erreurs", jours, f_err), jours))
    except Exception as e:
        out.append(f"Erreurs JS : indisponibles ({e})")
    try:
        res, n = retention(lire("visites", 400, f_vis), aujourdhui or dt.date.today())
        out.append(ligne_retention(res, n))
    except Exception as e:
        out.append(f"Rétention J+1/J+7/J+30 : indisponible ({e})")
    return out


def main():
    a = sys.argv[1:]
    opt = lambda k, d=None: a[a.index(k) + 1] if k in a else d
    jours = int(opt("--jours", 7))
    f_err, f_vis = opt("--fichier-erreurs"), opt("--fichier-visites")
    auj = dt.date.fromisoformat(opt("--aujourdhui")) if opt("--aujourdhui") else None
    if "--point" in a:
        print("\n".join(point(jours, f_err, f_vis, auj)))
        return
    for l in point(jours, f_err, f_vis, auj):
        print(l)
    try:
        lignes = lire("erreurs", jours, f_err)
    except Exception:
        return
    print(f"\nERREURS ({jours} jours) : message · occurrences · appareils · versions · écrans · fichier:ligne · pile")
    for msg, ls in resume_erreurs(lignes):
        print(f"  « {msg[:150]} »")
        print(f"      {len(ls)}× · {len({l.get('appareil') for l in ls})} app. · versions {', '.join(sorted({str(l.get('version', '')) for l in ls}))} · "
              f"écrans {', '.join(e for e, _ in Counter(str(l.get('écran', '')) for l in ls).most_common(3))} · {ou(ls[-1])}")
        pile = str(ls[-1].get("pile", "")).lstrip("'")
        if pile:
            print(f"      {pile[:200]}")


if __name__ == "__main__":
    main()
