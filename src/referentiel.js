/* Référentiels officiels de compétences, un par système (25.11, règle de l'enseignant : chaque système a SON
   référentiel et SES dénominations ; séparation complète France / romand).
   « Mes compétences » affiche le référentiel du système de l'élève quand il est embarqué dans l'app :
   - Collège de Genève (1re–4e, MA1 / MA2) : REF_MATU (src/ref_matu.js, généré par tools/ref_matu.py) ;
   - France (6e–Tle) : REF_FR (src/ref_fr.js, généré par tools/ref_fr.py) : attendus et capacités officiels, échelle LSU ;
   - Cycle d'orientation (9e–11e) : REF_CO (src/ref_co.js, généré par tools/ref_co.py) : progression des apprentissages
     du Plan d'études romand (PER, MSN 31–34), groupée par axe ; un item couvre une ou plusieurs années (y1–y2) ;
   - Maturité professionnelle (MP 1re–4e) : REF_MP (src/ref_mp.js, généré par tools/ref_mp.py) : objectifs du plan
     d'études d'établissement MP (semestres 1 à 8), groupés par semestre et chapitre (26.11).
   Pour ajouter un système : un fichier de données généré (même forme que REF_MATU) et une entrée dans SYS ci-dessous.
   Aucune donnée nouvelle n'est enregistrée : la maîtrise d'une compétence officielle se calcule à la volée à partir de
   state.comps (réponses par notion et niveau de question, déjà enregistrées), donc rien n'est perdu ni remis à zéro. */
const Referentiel = (() => {
  const FR_Y = { 6: "6e", 7: "5e", 8: "4e", 9: "3e", 10: "2nde", 11: "1re", 12: "Terminale" };
  const SYS = {
    /* 25.11 (phase CO) : PER cycle 3. Un item est affiché dans l'année de l'élève si elle est dans ses années (y1–y2) ;
       les items terminés une année précédente sont repliés sous cette année. Pas de niveau (profil CO sans niveau). */
    CO: {
      data: () => (typeof REF_CO !== "undefined" ? REF_CO : null),
      applies: (p) => p.system === "CH" && p.track !== "mp" && p.grade >= 9 && p.grade <= 11,
      year: (p) => p.grade,
      years: (p) => Array.from({ length: p.grade - 8 }, (_, i) => i + 9),
      yearLabel: (y) => y + "e",
      allowed: () => true,
      track: () => "",
      title: "Plan d'études romand",
      intro: "Les apprentissages du Plan d'études romand (PER) pour ton année, par axe. Chacun reçoit une note de 1 à 6 dès que tu as répondu 3 fois à ses questions. La note suit tes 8 dernières réponses : elle monte quand tu progresses.",
    },
    /* 26.11 (phase MP) : objectifs du plan d'études MP, groupés « Semestre n — chapitre » ; année = MP 1re–4e. Les
       questions viennent seulement du catalogue MP (catalogOnly) : jamais une notion propre au Collège ou au CO. */
    MP: {
      data: () => (typeof REF_MP !== "undefined" ? REF_MP : null),
      applies: (p) => p.system === "CH" && p.track === "mp" && p.grade >= 12 && p.grade <= 15,
      year: (p) => p.grade - 11,
      yearLabel: (y) => "MP " + (y === 1 ? "1re" : y + "e"),
      allowed: () => true,
      track: () => "",
      catalogOnly: () => [12, 13, 14, 15].map((grade) => ({ system: "CH", grade, track: "mp", minutes: 5 })),
      title: "maturité professionnelle",
      intro: "Les objectifs du plan d'études de mathématiques de la maturité professionnelle, semestre par semestre. Chacun reçoit une note de 1 à 6 dès que tu as répondu 3 fois à ses questions. La note suit tes 8 dernières réponses : elle monte quand tu progresses.",
    },
    MATU: {
      data: () => (typeof REF_MATU !== "undefined" ? REF_MATU : null),
      applies: (p) => p.system === "CH" && p.track === "college" && p.grade >= 12 && p.grade <= 15,
      year: (p) => p.grade - 11,
      yearLabel: (y) => (y === 1 ? "1re" : y + "e"),
      /* niveau 0 = MA1 et MA2 ; 1 = MA2 seulement ; 2 = MA1 seulement. Sans choix (1re, 2e, ou profil ancien) : MA1. */
      allowed: (p, niv) => niv === 0 || (niv === 1 ? p.niv === "R" : p.niv !== "R"),
      track: (p) => (p.grade >= 14 ? (p.niv === "R" ? "MA2" : "MA1") : ""),
      title: "Collège",
      intro: "Les compétences officielles du programme du Collège. Chacune reçoit une note de 1 à 6 dès que tu as répondu 3 fois à ses questions. La note suit tes 8 dernières réponses : elle monte quand tu progresses.",
    },
    /* 25.11 (phase France) : items officiels de la classe (attendus de fin d'année au collège, capacités attendues et
       automatismes au lycée), groupés par domaine (collège) ou partie du programme (lycée). Classe = grade du profil
       (6 = 6e … 12 = Tle) ; au lycée, le collège et la 2nde sont repliés à part. */
    FR: {
      data: () => (typeof REF_FR !== "undefined" ? REF_FR : null),
      applies: (p) => p.system === "FR" && p.grade >= 6 && p.grade <= 12,
      year: (p) => p.grade,
      years: (p) => Array.from({ length: p.grade - 5 }, (_, i) => i + 6),
      yearLabel: (y) => FR_Y[y],
      allowed: () => true,
      track: (p) => (p.grade === 11 || p.grade === 12 ? "spécialité" : ""),
      /* Années précédentes, repliées : au collège en un bloc ; au lycée, 2nde (et 1re en Tle) à part, puis le collège. */
      olds: (p) => (p.grade <= 9 ? [["Années précédentes", Array.from({ length: p.grade - 6 }, (_, i) => p.grade - 1 - i)]]
        : [...Array.from({ length: p.grade - 10 }, (_, i) => [FR_Y[p.grade - 1 - i], [p.grade - 1 - i]]), ["Collège (6e–3e)", [9, 8, 7, 6]]]),
      catalogOnly: () => [6, 7, 8, 9, 10, 11, 12].map((grade) => ({ system: "FR", grade, track: "college", minutes: 5 })),
      fr: true,
      title: "programme de mathématiques",
      intro: (p) => (p.grade <= 9 ? "Les attendus de fin d'année du programme officiel de mathématiques de ta classe." : "Les capacités attendues et les automatismes du programme officiel de mathématiques de ta classe.")
        + " Chacun reçoit un niveau de maîtrise (insuffisante, fragile, satisfaisante, très bonne) dès que tu as répondu 3 fois à ses questions. Il suit tes 8 dernières réponses : il monte quand tu progresses.",
    },
  };
  const cache = {};
  const sysOf = (p) => { if (!p) return null; for (const k in SYS) if (SYS[k].applies(p) && SYS[k].data()) return k; return null; };
  /* Compétences du référentiel, dépliées : { code, year, y2, niv, theme, notion, label, links } ; y2 = dernière année
     de l'item (7e champ, REF_CO) ; sans 7e champ, y2 = year (une seule année : Collège, France). */
  const rows = (k) => {
    if (cache[k]) return cache[k];
    const D = SYS[k].data();
    /* 6e champ facultatif : l'année (REF_FR : 6 = 6e … 12 = Tle) ; sinon premier chiffre du code (REF_MATU). */
    return (cache[k] = D.c.map(([code, niv, th, no, label, y, y2]) => { const year = y === undefined ? +code[0] : y; return { code, year, y2: y2 === undefined ? year : y2, niv, theme: D.th[th], notion: D.no[no], label, links: D.q[code] || [] }; }));
  };
  /* France (catalogOnly, séparation 25.11) : on ne garde que les notions du catalogue France (toutes classes), jamais
     une notion propre à la Suisse ; un item sans notion restante est « travaillé en classe ». 26.11 : idem pour la MP
     (catalogue MP 1re–4e, jamais une notion propre au Collège ou au CO). catalogOnly = profils dont on unit les catalogues. */
  const catSet = {};
  const catOk = (k, id) => {
    if (!catSet[k]) { catSet[k] = new Set(); SYS[k].catalogOnly().forEach((p) => Engine.catalog(p).forEach((c) => catSet[k].add(c.id))); }
    return catSet[k].has(id);
  };
  const rowsOf = (k) => {
    const rs = rows(k);
    if (!SYS[k].catalogOnly || rs.filtered) return rs;
    rs.forEach((r) => { r.links = r.links.filter((s) => catOk(k, s.split("@")[0])); });
    rs.filtered = true;
    return rs;
  };
  /* Couples (notion, niveau de question) rattachés à une compétence. */
  const pairs = (r) => r.links.flatMap((s) => { const [id, lv] = s.split("@"); return (lv ? lv.split("") : ["1", "2", "3"]).map((d) => [id, +d]); });
  /* Identifiants d'enregistrement (state.comps) alimentés par une compétence : ceux de src/competences.js (compOf). */
  const cids = (r) => [...new Set(pairs(r).map(([id, d]) => compOf(id, d)))];
  return {
    of: sysOf,
    title: (p) => { const k = sysOf(p); return k ? SYS[k].title : ""; },
    intro: (p) => { const S = SYS[sysOf(p)], t = S.intro; return typeof t === "function" ? t(p) : t; },
    isFR: (p) => !!SYS[sysOf(p)].fr,
    /* Années précédentes, repliées : [[libellé du bloc, [années]]] ; par défaut un seul bloc. */
    olds(p) {
      const S = SYS[sysOf(p)];
      if (S.olds) return S.olds(p).filter(([, ys]) => ys.length);
      const ys = this.years(p).filter((y) => y < S.year(p)).reverse();
      return ys.length ? [["Années précédentes", ys]] : [];
    },
    yearLabel: (p, y) => SYS[sysOf(p)].yearLabel(y),
    track: (p) => SYS[sysOf(p)].track(p),
    year: (p) => SYS[sysOf(p)].year(p),
    /* Compétences de l'élève : année y (par défaut la sienne), filtrées par niveau (MA2 retiré en MA1 et inversement).
       Son année : les items qui la couvrent (year ≤ y ≤ y2) ; une année précédente : les items terminés cette année-là
       (y2 = y), pour que chaque item n'apparaisse qu'une fois. Items d'une seule année (y2 = year) : comme avant. */
    list(p, y) {
      const k = sysOf(p), S = SYS[k], y0 = S.year(p), yy = y || y0;
      return rowsOf(k).filter((r) => (yy === y0 ? r.year <= yy && r.y2 >= yy : r.y2 === yy) && S.allowed(p, r.niv));
    },
    years(p) { const S = SYS[sysOf(p)]; if (S.years) return S.years(p); const y = this.year(p); return Array.from({ length: y }, (_, i) => i + 1); },
    find(p, code) { const k = sysOf(p); return k ? rowsOf(k).find((r) => r.code === code) || null : null; },
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
    /* « Me tester » : questions des notions rattachées que l'élève peut recevoir (son catalogue), sinon toutes.
       France (catalogOnly) : sinon le catalogue France des autres classes, jamais une notion propre à la Suisse (25.11) ;
       MP (26.11) : sinon le catalogue MP des autres années. */
    plan(p, r) {
      const ok = new Set(Engine.catalog(p).map((c) => c.id)), gen = (id) => typeof GEN === "undefined" || GEN[id];
      let ps = pairs(r).filter(([id]) => ok.has(id) && gen(id));
      if (!ps.length) { const k = sysOf(p); ps = pairs(r).filter(([id]) => gen(id) && (SYS[k].catalogOnly ? catOk(k, id) : NOTIONS.some((n) => n.id === id))); }
      return ps;
    },
    stats(st, list) {
      const notes = list.map((r) => this.note(st, r)).filter((x) => x !== null);
      return { total: list.length, tested: notes.length, avg: notes.length ? notes.reduce((a, b) => a + b, 0) / notes.length : null };
    },
  };
})();
