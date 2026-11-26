/* Référentiel du CO dans « Mes compétences » (25.11, phase CO : tools/ref_co.py, src/ref_co.js, src/referentiel.js).
   Items du PER (MSN 31–34) par année (= fichier généré), groupés par axe, intitulé seul (code en title), note 1–6,
   « Me tester », « travaillée en classe », années précédentes du cycle repliées, leçons accessibles, compteurs de la
   carte, state.comps intact, rien ne dépasse à 360 px ; profils Collège, MP et France inchangés. */
(function () {
  const out = [], bad = [];
  const ok = (c, m) => { if (!c) bad.push(m); };
  /* Comptes de tools/ref_co.py (25.11) : 93 items ; 9e 47, 10e 65, 11e 67 (items qui couvrent l'année). */
  const EXP = [[9, 47], [10, 65], [11, 67]];
  const AXES = ["Espace", "Nombres", "Opérations", "Grandeurs et mesures"];
  const P = (grade) => ({ system: "CH", grade, track: "college", minutes: 5 });
  const overflow = () => {
    const R = app.getBoundingClientRect().right + 0.5, xs = [];
    app.querySelectorAll("*").forEach((e) => { const r = e.getBoundingClientRect(); if (r.width && r.right > R) xs.push((e.className || e.tagName) + " " + (e.textContent || "").slice(0, 40)); });
    return xs;
  };
  const fresh = (p) => { state = Engine.newState(p); Engine.autoInit(state); state.placed = true; };
  try {
    ok(REF_CO.c.length === 93, "93 items dans REF_CO (" + REF_CO.c.length + ")");
    ok(REF_CO.c.every((c) => c[5] >= 9 && c[5] <= c[6] && c[6] <= 11), "années des items dans 9e–11e");
    ok(JSON.stringify(REF_CO.th) === JSON.stringify(AXES), "axes du PER : " + REF_CO.th.join(", "));
    const ids = new Set(NOTIONS.map((n) => n.id));
    for (const [g, n] of EXP) {
      const p = P(g), L = Referentiel.list(p);
      ok(Referentiel.of(p) === "CO", g + "e : référentiel CO");
      ok(L.length === n && L.length === REF_CO.c.filter((c) => c[5] <= g && g <= c[6]).length, g + "e : " + L.length + " items au lieu de " + n);
      const linked = L.filter(Referentiel.hasQuestions);
      ok(linked.every((r) => r.links.every((s) => ids.has(s.split("@")[0]) && GEN[s.split("@")[0]])), g + "e : notion rattachée sans générateur");
      const sans = linked.filter((r) => !Referentiel.plan(p, r).length).map((r) => r.code);
      ok(!sans.length, g + "e : rattaché sans question : " + sans.join(", "));
      out.push(g + "e " + L.length + " (" + linked.length + " avec questions)");
    }
    /* Années précédentes : chaque item n'apparaît qu'une fois sur l'écran d'un élève de 11e. */
    const all11 = [11, 10, 9].flatMap((y) => Referentiel.list(P(11), y).map((r) => r.code));
    ok(all11.length === 93 && new Set(all11).size === 93, "11e : 93 items en tout, sans doublon (" + all11.length + ")");
    /* Écran 10e */
    fresh(P(10));
    const r1 = Referentiel.list(state.profile).find((r) => Referentiel.hasQuestions(r) && Referentiel.plan(state.profile, r).length);
    const cid = Referentiel.cids(r1)[0];
    state.comps = { [cid]: { r: [1, 1, 0, 1, 1], n: 5, last: "2026-11-24" } };
    const before = JSON.stringify(state.comps);
    ok(Referentiel.note(state, r1) !== null, "10e : note calculée depuis state.comps");
    screenComps();
    let t = app.innerText;
    const top = [...app.querySelectorAll(".rcomp")].filter((e) => !e.closest(".olds"));
    ok(top.length === 65, "10e : 65 lignes de l'année à l'écran (" + top.length + ")");
    const h3 = [...app.querySelectorAll(".card h3")].filter((e) => !e.closest(".olds")).map((e) => e.textContent.trim()).filter((x) => AXES.includes(x));
    ok(JSON.stringify(h3) === JSON.stringify(AXES), "10e : groupement par axe dans l'ordre du PER (" + h3.join(", ") + ")");
    ok(!!app.querySelector('.rcomp [title="' + r1.code + '"]') && t.includes(r1.label) && !t.includes(r1.code), "10e : intitulé affiché, code seulement en title (" + r1.code + ")");
    ok(!/\b3[1-4]-[A-Z]{2,4}\d*\b/.test(t), "10e : aucun code visible");
    ok(/Plan d'études romand/.test(t) && /note de 1 à 6/.test(t) && !/maîtrise|positionn/.test(t), "10e : intro PER, notes 1–6");
    const notes = [...app.querySelectorAll(".rcomp .note")];
    ok(notes.length && notes.some((e) => /^\d/.test(e.textContent.trim())), "10e : une note chiffrée affichée");
    const ns = top.filter((e) => /travaillée en classe/.test(e.textContent));
    const nsExp = Referentiel.list(state.profile).filter((r) => !Referentiel.hasQuestions(r)).length;
    ok(ns.length === nsExp && nsExp > 0, "10e : " + ns.length + " items « travaillée en classe » au lieu de " + nsExp);
    ok(ns.every((e) => !e.querySelector(".note") && !e.querySelector(".rtest")), "item non saisissable : ni note ni « Me tester »");
    ok(/sont travaillées en classe, sans note ici/.test(t), "10e : phrase des items travaillés en classe");
    ok(app.querySelectorAll(".olds").length === 1 && /Années précédentes/.test(app.querySelector(".olds summary").textContent), "10e : un bloc « Années précédentes »");
    ok(!app.querySelector(".olds").open, "10e : années précédentes repliées");
    app.querySelectorAll("details").forEach((d) => (d.open = true));
    const n9 = REF_CO.c.filter((c) => c[6] === 9).length;
    ok(app.querySelectorAll(".rcomp").length === 65 + n9, "10e : années précédentes = items terminés en 9e (" + app.querySelectorAll(".rcomp").length + " au lieu de " + (65 + n9) + ")");
    let xs = overflow(); ok(!xs.length, "10e : débordement à 360 px : " + xs.slice(0, 3).join(" | "));
    ok(JSON.stringify(state.comps) === before, "state.comps intact à l'affichage");
    let card = compsCard().replace(/<[^>]+>/g, "");
    ok(/1 compétence notée sur 65 cette année/.test(card), "compsCard 10e : " + card.replace(/\s+/g, " ").slice(0, 160));
    /* « Me tester » */
    const b = app.querySelector('.rtest[data-code="' + r1.code + '"]');
    ok(!!b, "bouton Me tester sur " + r1.code);
    if (b) {
      b.click();
      ok(session && session.ctest && session.ctest.code === r1.code && session.plan.length === 3, "Me tester : 3 questions");
      const cat = new Set(Engine.catalog(P(10)).map((c) => c.id));
      ok(session.plan.every((x) => cat.has(x.split("|")[0])), "Me tester : notions du catalogue de l'élève (" + session.plan.join(", ") + ")");
      ok(ctestNote(session.ctest) === Referentiel.note(state, r1), "bilan du test : note de l'item du PER");
      session = null;
    }
    /* 26.11 (décision de l'enseignant, n° 15) : plus de ligne « Leçons » dans « Mes compétences » au CO */
    screenComps();
    ok(!app.querySelector(".lopen") && !app.querySelector("details.rles"), "10e : pas de ligne « Leçons » dans « Mes compétences »");
    /* Chaque année : blocs repliés, rien ne dépasse à 360 px (tout déplié), compteur de la carte. */
    for (const [g, n] of EXP) {
      fresh(P(g)); screenComps();
      const o = app.querySelectorAll(".olds");
      ok(o.length === (g === 9 ? 0 : 1), g + "e : " + o.length + " blocs repliés");
      if (g === 11) ok(o[0] && o[0].querySelectorAll(".ryear").length === 2, "11e : 10e et 9e repliées");
      app.querySelectorAll("details").forEach((e) => (e.open = true));
      xs = overflow(); ok(!xs.length, g + "e : débordement à 360 px : " + xs.slice(0, 3).join(" | "));
      state.comps = {};
      const r = Referentiel.list(state.profile).find((x) => Referentiel.hasQuestions(x));
      if (r) for (const c of Referentiel.cids(r)) state.comps[c] = { r: [1, 1, 1], n: 3, last: "2026-11-25" };
      card = compsCard().replace(/<[^>]+>/g, "");
      ok(new RegExp("notée sur " + n + " cette année").test(card), g + "e : compsCard sur " + n + " (" + card.replace(/\s+/g, " ").slice(0, 120) + ")");
    }
    /* Profils inchangés : Collège = REF_MATU (98 en 1re), MP = compétences par notion, France = REF_FR (53 en 3e). */
    fresh({ system: "CH", grade: 12, track: "college", minutes: 5 });
    ok(Referentiel.of(state.profile) === "MATU" && Referentiel.list(state.profile).length === 98, "Collège 1re : référentiel MATU, 98 compétences");
    screenComps();
    ok(!app.querySelector(".lopen") && app.querySelectorAll(".olds").length === 0, "Collège 1re : affichage inchangé");
    fresh({ system: "CH", grade: 15, track: "college", niv: "R", minutes: 5 }); screenComps();
    ok(app.querySelectorAll(".olds").length === 1 && Referentiel.list(state.profile, 1).every((r) => r.year === 1), "Collège 4e : années précédentes inchangées");
    /* 26.11 (phase MP) : la MP a son référentiel (plan d'études MP, src/ref_mp.js ; détail : tests/ref_mp.js). */
    fresh({ system: "CH", grade: 13, track: "mp", minutes: 5 });
    ok(Referentiel.of(state.profile) === "MP", "MP 2e : référentiel MP");
    screenComps(); t = app.innerText;
    ok(!!app.querySelector(".rcomp") && /note de 1 à 6/.test(t) && !/maîtrise|positionn|Plan d'études romand/.test(t), "MP 2e : objectifs MP, notes 1–6");
    fresh({ system: "FR", grade: 9, track: "college", minutes: 5 });
    ok(Referentiel.of(state.profile) === "FR" && Referentiel.list(state.profile).length === 53, "France 3e : REF_FR, 53 items");
  } catch (e) { bad.push("EXC " + e.message + " " + (e.stack || "").split("\n")[1]); }
  document.getElementById("out").textContent = (bad.length ? "ÉCHEC " + bad.join(" ; ") : "ok référentiel CO : " + out.join(" · "));
})();
