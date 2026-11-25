/* Référentiel du Collège dans « Mes compétences » (25.11, tools/ref_matu.py, src/referentiel.js).
   Nombre de compétences par année et niveau (= CSV de l'enseignant), MA2 retiré en MA1, maîtrise calculée depuis des
   réponses simulées, anciennes données conservées, rien ne dépasse à 360 px, profils CO / MP / France inchangés. */
(function () {
  const out = [], bad = [];
  const ok = (c, m) => { if (!c) bad.push(m); };
  /* Comptes du CSV (referentiel_matu.csv, 25.11) : 1re 98 ; 2e 78 ; 3e 56 communes + 11 MA2 ; 4e 46 communes + 31 MA2 + 4 MA1. */
  const EXP = [["1re", 12, null, 98], ["2e", 13, null, 78], ["3e MA1", 14, "N", 56], ["3e MA2", 14, "R", 67], ["4e MA1", 15, "N", 50], ["4e MA2", 15, "R", 77]];
  const P = (grade, niv, extra) => Object.assign({ system: "CH", grade, track: "college", minutes: 5 }, niv ? { niv } : {}, extra || {});
  const overflow = () => {
    const R = app.getBoundingClientRect().right + 0.5, xs = [];
    app.querySelectorAll("*").forEach((e) => { const r = e.getBoundingClientRect(); if (r.width && r.right > R) xs.push((e.className || e.tagName) + " " + (e.textContent || "").slice(0, 40)); });
    return xs;
  };
  try {
    ok(REF_MATU.c.length === 324, "324 compétences dans REF_MATU (" + REF_MATU.c.length + ")");
    for (const [lab, g, niv, n] of EXP) {
      const p = P(g, niv), L = Referentiel.list(p);
      ok(Referentiel.of(p) === "MATU", lab + " : référentiel MATU");
      ok(L.length === n, lab + " : " + L.length + " compétences au lieu de " + n);
      ok(L.every((r) => r.year === g - 11), lab + " : années mélangées");
      if (niv === "N") ok(!L.some((r) => r.niv === 1), lab + " : compétence MA2 affichée en MA1");
      if (niv === "R") ok(!L.some((r) => r.niv === 2), lab + " : compétence MA1 seule affichée en MA2");
      out.push(lab + " " + L.length + " (" + L.filter(Referentiel.hasQuestions).length + " avec questions)");
    }
    /* Maîtrise : anciennes données (format state.comps inchangé) + réponses simulées. */
    state = Engine.newState(P(12)); Engine.autoInit(state); state.placed = true;
    state.comps = { "factor:0": { r: [1, 1, 1, 1], n: 4, last: "2026-11-20" }, "f2:0": { r: [1, 0], n: 2, last: "2026-11-21" }, "eq2:0": { r: [1, 1, 0, 1], n: 4, last: "2026-11-22" }, "pyth:0": { r: [0, 0, 1], n: 3, last: "2026-11-01" } };
    const before = JSON.stringify(state.comps);
    const f = (c) => Referentiel.find(state.profile, c);
    ok(Referentiel.note(state, f("1.AL.03a")) === 6, "1.AL.03a (factor niv. 1, 4/4) : note " + Referentiel.note(state, f("1.AL.03a")));
    ok(Referentiel.note(state, f("1.FO.07a")) === null, "1.FO.07a : 2 réponses seulement, pas de note");
    ok(Referentiel.note(state, f("1.GE.02a")) === null && !Referentiel.hasQuestions(f("1.GE.02a")), "1.GE.02a (énoncer) : sans question");
    for (let i = 0; i < 3; i++) Engine.recordComp(state, "factor", 2, 0);
    ok(Referentiel.note(state, f("1.AL.03b")) === 1, "1.AL.03b après 3 erreurs au niveau 2 : note " + Referentiel.note(state, f("1.AL.03b")));
    ok(Referentiel.note(state, f("1.AL.03a")) === 6, "1.AL.03a inchangée par le niveau 2");
    Engine.recordComp(state, "f2", 1, 1);
    ok(Referentiel.note(state, f("1.FO.07a")) !== null, "1.FO.07a notée à la 3e réponse");
    const old = JSON.parse(before);
    ok(Object.keys(old).every((k) => state.comps[k] && state.comps[k].r.join() .startsWith(old[k].r.join())), "anciennes données de state.comps conservées");
    ok(JSON.stringify(state.comps["eq2:0"]) === JSON.stringify(old["eq2:0"]) && JSON.stringify(state.comps["pyth:0"]) === JSON.stringify(old["pyth:0"]), "enregistrements non touchés intacts");
    /* Écran : compétences officielles, code, intitulé, note, « travaillée en classe », rien ne dépasse à 360 px. */
    screenComps();
    const t = app.innerText;
    ok(app.querySelectorAll(".rcomp").length === 98, "1re : 98 lignes de compétences à l'écran (" + app.querySelectorAll(".rcomp").length + ")");
    ok(!/1\.AL\.03a/.test(t) && !!app.querySelector('.rcomp [title="1.AL.03a"]') && /mise en évidence/.test(t), "intitulé officiel affiché, code seulement en title");
    ok(/travaillée en classe/.test(t), "« travaillée en classe » affiché");
    ok(/\d+ \/ 98 notées/.test(t), "compteur sur 98");
    ok(!app.querySelector(".olds"), "1re : pas d'années précédentes");
    let xs = overflow(); ok(!xs.length, "1re : débordement à 360 px : " + xs.slice(0, 3).join(" | "));
    ok(Badges.list(state).length > 0 && Array.isArray(Badges.notes(state)), "badges calculés");
    /* Carte de l'accueil : X compétences notées sur N (N officiel). */
    const card = compsCard();
    ok(/sur 98 cette année/.test(card.replace(/<[^>]+>/g, "")), "compsCard : sur 98 cette année");
    /* « Me tester » sur une compétence officielle */
    const b = app.querySelector('.rtest[data-code="1.AL.03a"]');
    ok(!!b, "bouton Me tester sur 1.AL.03a");
    if (b) {
      b.click();
      ok(session && session.ctest && session.ctest.code === "1.AL.03a" && session.plan.length === 3, "Me tester : 3 questions, compétence officielle");
      ok(session.plan.every((x) => /^(factor)\|1$/.test(x)), "Me tester : questions de factor niveau 1 (" + session.plan.join(", ") + ")");
      ok(ctestNote(session.ctest) === 6, "bilan du test : note officielle");
      session = null;
    }
    /* 4e MA1 : années précédentes repliées, 3e sans MA2 ; 4e MA2 : rien ne dépasse, dépliés */
    for (const niv of ["N", "R"]) {
      state = Engine.newState(P(15, niv)); Engine.autoInit(state); state.placed = true; state.comps = { "derivprodquot:0": { r: [1, 1, 0.5], n: 3, last: "2026-11-24" } };
      screenComps();
      const d = app.querySelector(".olds");
      ok(!!d, "4e " + niv + " : années précédentes");
      if (d) d.open = true;
      const n = app.querySelectorAll(".rcomp").length, exp = niv === "N" ? 98 + 78 + 56 + 50 : 98 + 78 + 67 + 77;
      ok(n === exp, "4e " + niv + " : " + n + " lignes au lieu de " + exp);
      ok(niv === "R" || !app.querySelector('[title="3.AN.08a"]'), "4e MA1 : MA2 de 3e retiré");
      ok(!!app.querySelector('.olds [title="3.AN.05b"]'), "4e : compétence de 3e dans les années précédentes");
      xs = overflow(); ok(!xs.length, "4e " + niv + " : débordement à 360 px : " + xs.slice(0, 3).join(" | "));
    }
    /* Profils CO, MP, France : affichage par notion inchangé */
    for (const [lab, p] of [["CO 10e", { system: "CH", grade: 10, track: "college" }], ["CO 11e", { system: "CH", grade: 11, track: "college" }], ["MP 2e", { system: "CH", grade: 13, track: "mp" }], ["FR 3e", { system: "FR", grade: 9, track: "college" }], ["FR 2nde", { system: "FR", grade: 10, track: "college" }]]) {
      state = Engine.newState({ ...p, minutes: 5 }); Engine.autoInit(state); state.placed = true;
      ok(Referentiel.of(state.profile) === null, lab + " : pas de référentiel officiel");
      screenComps();
      ok(!app.querySelector(".rcomp") && app.querySelectorAll(".ctest").length > 0, lab + " : compétences par notion (affichage actuel)");
    }
  } catch (e) { bad.push("EXC " + e.message + " " + (e.stack || "").split("\n")[1]); }
  document.getElementById("out").textContent = (bad.length ? "ÉCHEC " + bad.join(" ; ") : "ok référentiel Collège : " + out.join(" · "));
})();
