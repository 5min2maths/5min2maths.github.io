/* Référentiel de la maturité professionnelle dans « Mes compétences » (26.11, phase MP : tools/ref_mp.py, src/ref_mp.js,
   src/referentiel.js). Objectifs du plan d'études MP par année (MP 1re–4e), groupés « Semestre n — chapitre », intitulé
   seul (code en title), note 1–6, « travaillée en classe », années précédentes repliées, « Me tester » sur le catalogue
   MP ; couverture (objectifs rattachés à des questions) ; séparation des systèmes : aucun intitulé MP dans les profils
   CO, Collège et France, aucun intitulé de ces référentiels (ni leurs marqueurs) dans l'affichage MP. */
(function () {
  const out = [], bad = [];
  const ok = (c, m) => { if (!c) bad.push(m); };
  /* Comptes de tools/ref_mp.py (26.11) : 150 objectifs ; MP 1re 62 (S1–S2), 2e 30, 3e 22, 4e 36 ; 139 rattachés. */
  const EXP = [[12, 62], [13, 30], [14, 22], [15, 36]];
  const P = (grade) => ({ system: "CH", grade, track: "mp", minutes: 5 });
  const overflow = () => {
    const R = app.getBoundingClientRect().right + 0.5, xs = [];
    app.querySelectorAll("*").forEach((e) => { const r = e.getBoundingClientRect(); if (r.width && r.right > R) xs.push((e.className || e.tagName) + " " + (e.textContent || "").slice(0, 40)); });
    return xs;
  };
  const fresh = (p) => { state = Engine.newState(p); Engine.autoInit(state); state.placed = true; };
  /* Intitulés et titres affichés, élément par élément (pas de recherche de sous-chaîne : « … des fractions » est le
     début de « … des fractions rationnelles »). */
  const shown = () => new Set([...app.querySelectorAll(".rcomp > span[title], .card h3, .cnotion > b, .comp > span:first-child")].map((e) => e.textContent.trim()));
  const CODE = /\bS[1-8]\.[A-Z]{2}\.\d\d\b/;
  try {
    ok(REF_MP.c.length === 150, "150 objectifs dans REF_MP (" + REF_MP.c.length + ")");
    ok(REF_MP.c.every((c) => CODE.test(c[0]) && c[5] === Math.ceil(+c[0][1] / 2)), "année = semestre (S1–S2 = MP 1re …)");
    ok(REF_MP.th.every((t) => /^Semestre [1-8] — \S/.test(t)), "thèmes « Semestre n — chapitre »");
    /* Couverture : tous les rattachements sont des notions du catalogue MP (aucun n'est retiré par le filtre). */
    const mpCat = new Set([12, 13, 14, 15].flatMap((g) => Engine.catalog(P(g)).map((c) => c.id)));
    const horsMP = Object.entries(REF_MP.q).flatMap(([c, L]) => L.filter((s) => !mpCat.has(s.split("@")[0])).map((s) => c + ":" + s));
    ok(!horsMP.length, "rattachement hors catalogue MP : " + horsMP.join(", "));
    let linkedAll = 0;
    for (const [g, n] of EXP) {
      const p = P(g), L = Referentiel.list(p), lab = "MP " + (g === 12 ? "1re" : g - 11 + "e");
      ok(Referentiel.of(p) === "MP", lab + " : référentiel MP");
      ok(L.length === n, lab + " : " + L.length + " objectifs au lieu de " + n);
      const linked = L.filter(Referentiel.hasQuestions);
      linkedAll += linked.length;
      ok(linked.every((r) => r.links.every((s) => GEN[s.split("@")[0]])), lab + " : notion rattachée sans générateur");
      const sans = linked.filter((r) => !Referentiel.plan(p, r).length).map((r) => r.code);
      ok(!sans.length, lab + " : rattaché sans question : " + sans.join(", "));
      const cat = new Set(Engine.catalog(p).map((c) => c.id));
      const hors = linked.filter((r) => Referentiel.plan(p, r).some(([id]) => !mpCat.has(id) && !cat.has(id))).map((r) => r.code);
      ok(!hors.length, lab + " : « Me tester » hors catalogue MP : " + hors.join(", "));
      out.push(lab + " " + linked.length + "/" + L.length);
    }
    ok(linkedAll === Object.keys(REF_MP.q).length && linkedAll >= 139, "couverture : " + linkedAll + " objectifs rattachés sur 150 (attendu 139, tous ceux de REF_MP.q)");
    out.push("couverture " + linkedAll + "/150");
    /* Années précédentes : chaque objectif n'apparaît qu'une fois sur l'écran d'un élève de MP 4e. */
    const all4 = [4, 3, 2, 1].flatMap((y) => Referentiel.list(P(15), y).map((r) => r.code));
    ok(all4.length === 150 && new Set(all4).size === 150, "MP 4e : 150 objectifs en tout, sans doublon (" + all4.length + ")");
    /* Écran MP 2e */
    fresh(P(13));
    const r1 = Referentiel.list(state.profile).find((r) => Referentiel.hasQuestions(r) && Referentiel.plan(state.profile, r).length);
    const cid = Referentiel.cids(r1)[0];
    state.comps = { [cid]: { r: [1, 1, 0, 1, 1], n: 5, last: "2026-11-24" } };
    const before = JSON.stringify(state.comps);
    ok(Referentiel.note(state, r1) !== null, "MP 2e : note calculée depuis state.comps");
    screenComps();
    let t = app.innerText;
    const top = [...app.querySelectorAll(".rcomp")].filter((e) => !e.closest(".olds"));
    ok(top.length === 30, "MP 2e : 30 lignes de l'année à l'écran (" + top.length + ")");
    ok(/MP 2e/.test(app.querySelector(".card.flat .spread span").textContent), "MP 2e : en-tête « MP 2e »");
    const h3 = [...app.querySelectorAll(".card h3")].filter((e) => !e.closest(".olds")).map((e) => e.textContent.trim()).filter((x) => /^Semestre/.test(x));
    ok(h3.length === 4 && /^Semestre 3/.test(h3[0]) && /^Semestre 4/.test(h3[3]), "MP 2e : chapitres des semestres 3 et 4 (" + h3.join(", ") + ")");
    ok(!!app.querySelector('.rcomp [title="' + r1.code + '"]') && t.includes(r1.label), "MP 2e : intitulé affiché, code en title (" + r1.code + ")");
    app.querySelectorAll("details").forEach((d) => (d.open = true));
    t = app.innerText;
    ok(!CODE.test(t), "MP 2e : aucun code visible (" + (CODE.exec(t) || [""])[0] + ")");
    ok(/maturité professionnelle/.test(t) && /note de 1 à 6/.test(t) && !/maîtrise|positionn/.test(t), "MP 2e : intro MP, notes 1–6");
    ok(!/Collège|Plan d'études romand|\bPER\b|Cycle d'orientation|\bCO\b|\bMA[12]\b|lycée|brevet|\bPGCD\b|Sésamath/.test(t), "MP 2e : aucun marqueur d'un autre système");
    const notes = [...app.querySelectorAll(".rcomp .note")];
    ok(notes.some((e) => /^\d/.test(e.textContent.trim())), "MP 2e : une note chiffrée affichée");
    const ns = top.filter((e) => /travaillée en classe/.test(e.textContent));
    const nsExp = Referentiel.list(state.profile).filter((r) => !Referentiel.hasQuestions(r)).length;
    ok(ns.length === nsExp && nsExp > 0, "MP 2e : " + ns.length + " objectifs « travaillée en classe » au lieu de " + nsExp);
    ok(ns.every((e) => !e.querySelector(".note") && !e.querySelector(".rtest")), "objectif non saisissable : ni note ni « Me tester »");
    ok(app.querySelectorAll(".olds").length === 1 && /Années précédentes/.test(app.querySelector(".olds summary").textContent), "MP 2e : un bloc « Années précédentes »");
    ok([...app.querySelectorAll(".olds .ryear")].map((e) => e.textContent).join() === "MP 1re", "MP 2e : MP 1re repliée");
    ok(app.querySelectorAll(".rcomp").length === 30 + 62, "MP 2e : années précédentes = 62 objectifs de MP 1re");
    let xs = overflow(); ok(!xs.length, "MP 2e : débordement à 360 px : " + xs.slice(0, 3).join(" | "));
    ok(JSON.stringify(state.comps) === before, "state.comps intact à l'affichage");
    let card = compsCard().replace(/<[^>]+>/g, "");
    ok(/\d compétences? notées? sur 30 cette année/.test(card), "compsCard MP 2e : " + card.replace(/\s+/g, " ").slice(0, 160));
    /* « Me tester » */
    screenComps();
    const b = app.querySelector('.rtest[data-code="' + r1.code + '"]');
    ok(!!b, "bouton Me tester sur " + r1.code);
    if (b) {
      b.click();
      ok(session && session.ctest && session.ctest.code === r1.code && session.plan.length === 3, "Me tester : 3 questions");
      ok(session.plan.every((x) => mpCat.has(x.split("|")[0])), "Me tester : notions du catalogue MP (" + session.plan.join(", ") + ")");
      ok(ctestNote(session.ctest) === Referentiel.note(state, r1), "bilan du test : note de l'objectif MP");
      session = null;
    }
    /* Chaque année : en-tête, blocs repliés, rien ne dépasse à 360 px (tout déplié), compteur de la carte. */
    for (const [g, n] of EXP) {
      fresh(P(g)); screenComps();
      const lab = "MP " + (g === 12 ? "1re" : g - 11 + "e");
      ok(app.querySelector(".card.flat .spread span").textContent.trim() === lab, g + " : en-tête « " + lab + " »");
      ok(app.querySelectorAll(".olds").length === (g === 12 ? 0 : 1), lab + " : blocs repliés");
      app.querySelectorAll("details").forEach((e) => (e.open = true));
      ok(!CODE.test(app.innerText), lab + " : aucun code visible");
      xs = overflow(); ok(!xs.length, lab + " : débordement à 360 px : " + xs.slice(0, 3).join(" | "));
      state.comps = {};
      const r = Referentiel.list(state.profile).find((x) => Referentiel.hasQuestions(x));
      if (r) for (const c of Referentiel.cids(r)) state.comps[c] = { r: [1, 1, 1], n: 3, last: "2026-11-25" };
      card = compsCard().replace(/<[^>]+>/g, "");
      ok(new RegExp("notées? sur " + n + " cette année").test(card), lab + " : compsCard sur " + n + " (" + card.replace(/\s+/g, " ").slice(0, 120) + ")");
    }
    /* Séparation des systèmes : chaque profil n'affiche que les intitulés de SON référentiel. Quelques intitulés
       génériques sont identiques mot pour mot dans deux référentiels (« Utiliser le théorème de Pythagore ») : ils
       viennent chacun de leur source ; on contrôle les intitulés propres à un seul référentiel. */
    const labs = (D) => D.c.map((c) => c[4]).concat(D.th);
    const autres = new Set([REF_MATU, REF_CO, REF_FR].flatMap(labs));
    const mpOnly = labs(REF_MP).filter((x) => !autres.has(x));
    const autresOnly = [...autres].filter((x) => !labs(REF_MP).includes(x) && x.length > 12);
    for (const [g] of EXP) {
      fresh(P(g)); screenComps(); app.querySelectorAll("details").forEach((d) => (d.open = true));
      const tt = shown(), vus = autresOnly.filter((x) => tt.has(x));
      ok(!vus.length, "MP " + g + " : intitulé d'un autre référentiel affiché : " + vus.slice(0, 2).join(" | "));
    }
    for (const [lab, p] of [["CO 10e", { system: "CH", grade: 10, track: "college" }], ["Collège 2e", { system: "CH", grade: 13, track: "college" }], ["Collège 4e", { system: "CH", grade: 15, track: "college", niv: "R" }], ["FR 1re", { system: "FR", grade: 11, track: "college" }]]) {
      fresh({ ...p, minutes: 5 });
      ok(Referentiel.of(state.profile) !== "MP", lab + " : pas le référentiel MP");
      screenComps(); app.querySelectorAll("details").forEach((d) => (d.open = true));
      const tt = shown(), vus = mpOnly.filter((x) => tt.has(x));
      ok(!vus.length && !/maturité professionnelle|Semestre [1-8] —/.test(app.innerText), lab + " : intitulé MP affiché : " + vus.slice(0, 2).join(" | "));
    }
  } catch (e) { bad.push("EXC " + e.message + " " + (e.stack || "").split("\n")[1]); }
  document.getElementById("out").textContent = (bad.length ? "ÉCHEC " + bad.join(" ; ") : "ok référentiel MP : " + out.join(" · "));
})();
