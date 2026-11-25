/* Référentiels officiels de compétences, un par système (25.11, règle de l'enseignant : chaque système a SON
   référentiel et SES dénominations ; séparation complète France / romand).
   « Mes compétences » affiche le référentiel du système de l'élève quand il est embarqué dans l'app :
   - Collège de Genève (1re–4e, MA1 / MA2) : REF_MATU (src/ref_matu.js, généré par tools/ref_matu.py) ;
   - CO, MP, France : pas encore (phases suivantes) ; ces profils gardent les compétences par notion (src/competences.js).
   Pour ajouter un système : un fichier de données généré (même forme que REF_MATU) et une entrée dans SYS ci-dessous.
   Aucune donnée nouvelle n'est enregistrée : la maîtrise d'une compétence officielle se calcule à la volée à partir de
   state.comps (réponses par notion et niveau de question, déjà enregistrées), donc rien n'est perdu ni remis à zéro. */
const Referentiel = (() => {
  const SYS = {
    MATU: {
      data: () => (typeof REF_MATU !== "undefined" ? REF_MATU : null),
      applies: (p) => p.system === "CH" && p.track === "college" && p.grade >= 12 && p.grade <= 15,
      year: (p) => p.grade - 11,
      yearLabel: (y) => (y === 1 ? "1re" : y + "e"),
      /* niveau 0 = MA1 et MA2 ; 1 = MA2 seulement ; 2 = MA1 seulement. Sans choix (1re, 2e, ou profil ancien) : MA1. */
      allowed: (p, niv) => niv === 0 || (niv === 1 ? p.niv === "R" : p.niv !== "R"),
      track: (p) => (p.grade >= 14 ? (p.niv === "R" ? "MA2" : "MA1") : ""),
      title: "Collège",
    },
  };
  const cache = {};
  const sysOf = (p) => { if (!p) return null; for (const k in SYS) if (SYS[k].applies(p) && SYS[k].data()) return k; return null; };
  /* Compétences du référentiel, dépliées : { code, year, niv, theme, notion, label, links } */
  const rows = (k) => {
    if (cache[k]) return cache[k];
    const D = SYS[k].data();
    return (cache[k] = D.c.map(([code, niv, th, no, label]) => ({ code, year: +code[0], niv, theme: D.th[th], notion: D.no[no], label, links: D.q[code] || [] })));
  };
  /* Couples (notion, niveau de question) rattachés à une compétence. */
  const pairs = (r) => r.links.flatMap((s) => { const [id, lv] = s.split("@"); return (lv ? lv.split("") : ["1", "2", "3"]).map((d) => [id, +d]); });
  /* Identifiants d'enregistrement (state.comps) alimentés par une compétence : ceux de src/competences.js (compOf). */
  const cids = (r) => [...new Set(pairs(r).map(([id, d]) => compOf(id, d)))];
  return {
    of: sysOf,
    title: (p) => { const k = sysOf(p); return k ? SYS[k].title : ""; },
    yearLabel: (p, y) => SYS[sysOf(p)].yearLabel(y),
    track: (p) => SYS[sysOf(p)].track(p),
    year: (p) => SYS[sysOf(p)].year(p),
    /* Compétences de l'élève : année y (par défaut la sienne), filtrées par niveau (MA2 retiré en MA1 et inversement). */
    list(p, y) {
      const k = sysOf(p), S = SYS[k];
      return rows(k).filter((r) => r.year === (y || S.year(p)) && S.allowed(p, r.niv));
    },
    years(p) { const y = this.year(p); return Array.from({ length: y }, (_, i) => i + 1); },
    find(p, code) { const k = sysOf(p); return k ? rows(k).find((r) => r.code === code) || null : null; },
    cids,
    /* Note 1–6 d'une compétence officielle : les 8 dernières réponses aux questions rattachées (toutes notions
       et niveaux confondus ; ordre approché par le jour de la dernière réponse de chaque savoir-faire). */
    note(st, r) {
      const recs = cids(r).map((c) => (st.comps || {})[c]).filter((x) => x && x.r && x.r.length);
      if (!recs.length) return null;
      recs.sort((a, b) => String(a.last || "").localeCompare(String(b.last || "")));
      return compNote({ r: recs.flatMap((x) => x.r).slice(-8) });
    },
    hasQuestions: (r) => r.links.length > 0,
    /* « Me tester » : questions des notions rattachées que l'élève peut recevoir (son catalogue), sinon toutes. */
    plan(p, r) {
      const ok = new Set(Engine.catalog(p).map((c) => c.id)), gen = (id) => typeof GEN === "undefined" || GEN[id];
      let ps = pairs(r).filter(([id]) => ok.has(id) && gen(id));
      if (!ps.length) ps = pairs(r).filter(([id]) => gen(id) && NOTIONS.some((n) => n.id === id));
      return ps;
    },
    stats(st, list) {
      const notes = list.map((r) => this.note(st, r)).filter((x) => x !== null);
      return { total: list.length, tested: notes.length, avg: notes.length ? notes.reduce((a, b) => a + b, 0) / notes.length : null };
    },
  };
})();
