/* Référentiel France dans « Mes compétences » (25.11, phase France : tools/ref_fr.py, src/ref_fr.js, src/referentiel.js).
   Nombre d'items par classe (= tools/referentiels_fr.json), pastilles LSU sans chiffre, items non saisissables
   « travaillé en classe », années précédentes repliées (lycée : 2nde et collège à part), compteurs de la carte,
   « Me tester » limité au catalogue France, rien ne dépasse à 360 px, profils suisses inchangés. */
(function () {
  const out = [], bad = [];
  const ok = (c, m) => { if (!c) bad.push(m); };
  /* Comptes du JSON (25.11) : 6e 94 (cycle 3 2025) ; 5e 151 (cycle 4 2026) ; 4e 64 et 3e 53 (attendus 2019) ;
     2nde 79, 1re 60, Tle 54 (programmes 2026, automatismes compris). */
  const EXP = [["6e", 6, 94], ["5e", 7, 151], ["4e", 8, 64], ["3e", 9, 53], ["2nde", 10, 79], ["1re", 11, 60], ["Tle", 12, 54]];
  const OLDS = { 6: 0, 7: 1, 8: 1, 9: 1, 10: 1, 11: 2, 12: 3 };
  const P = (grade) => ({ system: "FR", grade, track: "college", minutes: 5 });
  const overflow = () => {
    const R = app.getBoundingClientRect().right + 0.5, xs = [];
    app.querySelectorAll("*").forEach((e) => { const r = e.getBoundingClientRect(); if (r.width && r.right > R) xs.push((e.className || e.tagName) + " " + (e.textContent || "").slice(0, 40)); });
    return xs;
  };
  const fresh = (p) => { state = Engine.newState(p); Engine.autoInit(state); state.placed = true; };
  try {
    ok(REF_FR.c.length === 555, "555 items dans REF_FR (" + REF_FR.c.length + ")");
    const ids = new Set(NOTIONS.map((n) => n.id));
    for (const [lab, g, n] of EXP) {
      const p = P(g), L = Referentiel.list(p);
      ok(Referentiel.of(p) === "FR", lab + " : référentiel FR");
      ok(L.length === n, lab + " : " + L.length + " items au lieu de " + n);
      ok(L.every((r) => r.year === g), lab + " : classes mélangées");
      const linked = L.filter(Referentiel.hasQuestions);
      ok(linked.every((r) => r.links.every((id) => ids.has(id) && GEN[id])), lab + " : notion rattachée sans générateur");
      const testable = linked.filter((r) => Referentiel.plan(p, r).length);
      const hors = linked.filter((r) => !Referentiel.plan(p, r).length).map((r) => r.code);
      ok(!hors.length, lab + " : rattaché sans question du catalogue France : " + hors.slice(0, 5).join(", "));
      const drop = L.filter((r) => (REF_FR.q[r.code] || []).length && !r.links.length).map((r) => r.code + " [" + REF_FR.q[r.code].join(",") + "]");
      out.push(lab + " " + L.length + " (" + testable.length + " avec questions" + (drop.length ? " ; notions hors catalogue France : " + drop.join(" ") : "") + ")");
    }
    /* Écran 3e : codes, intitulés, domaines, pastilles LSU sans chiffre, « travaillé en classe ». */
    fresh(P(9));
    const f = (c) => Referentiel.find(state.profile, c);
    const r1 = Referentiel.list(state.profile).find((r) => Referentiel.hasQuestions(r) && Referentiel.plan(state.profile, r).length);
    const cid = Referentiel.cids(r1)[0];
    state.comps = { [cid]: { r: [1, 0, 1, 0, 1], n: 5, last: "2026-11-24" } };
    const before = JSON.stringify(state.comps);
    ok(Referentiel.note(state, r1) !== null, "3e : note calculée depuis state.comps");
    screenComps();
    let t = app.innerText;
    const top = [...app.querySelectorAll(".rcomp")].filter((e) => !e.closest(".olds"));
    ok(top.length === 53, "3e : 53 lignes de l'année à l'écran (" + top.length + ")");
    ok(!new RegExp(r1.code.replace(/\./g, "\\.")).test(t) && !!app.querySelector('.rcomp [title="' + r1.code + '"]') && t.includes(r1.label), "3e : intitulé affiché, code seulement en title (" + r1.code + ")");
    for (const d of ["Nombres et calculs", "Organisation et gestion de données, fonctions", "Grandeurs et mesures", "Espace et géométrie", "Algorithmique et programmation"]) ok(t.includes(d), "3e : domaine « " + d + " »");
    ok(!/\b(?:6e|5e|4e|3e)(?:-2019)?\.[A-Z]{2}\.\d{2}\b/.test(t), "3e : aucun code visible");
    const notes = [...app.querySelectorAll(".rcomp .note")];
    ok(notes.length && notes.every((e) => !/\d/.test(e.textContent)), "pastilles sans chiffre");
    ok(notes.every((e) => /^(pas encore|Insuffisante|Fragile|Satisfaisante|Très bonne)$/.test(e.textContent.trim())), "pastilles LSU : " + [...new Set(notes.map((e) => e.textContent.trim()))].join(", "));
    ok(notes.some((e) => e.classList.contains("frag") || e.classList.contains("ok")), "pastille de niveau affichée (3/5 = fragile ou satisfaisante)");
    const ns = top.filter((e) => /travaillé en classe/.test(e.textContent));
    const nsExp = Referentiel.list(state.profile).filter((r) => !Referentiel.hasQuestions(r)).length;
    ok(ns.length === nsExp && nsExp > 0, "3e : " + ns.length + " items « travaillé en classe » au lieu de " + nsExp);
    ok(ns.every((e) => !e.querySelector(".note") && !e.querySelector(".rtest")), "item non saisissable : ni pastille ni « Me tester »");
    ok(/sont travaillés en classe, sans niveau ici/.test(t), "3e : phrase des items travaillés en classe");
    ok(/maîtrise/.test(t) && !/note de 1 à 6|moyenne/.test(t), "3e : vocabulaire LSU, pas de note suisse");
    ok(app.querySelectorAll(".olds").length === 1, "3e : un bloc replié (6e, 5e, 4e)");
    const d = app.querySelector(".olds"); if (d) d.open = true;
    ok(app.querySelectorAll(".rcomp").length === 53 + 64 + 151 + 94, "3e : années précédentes = 4e + 5e + 6e (" + app.querySelectorAll(".rcomp").length + ")");
    let xs = overflow(); ok(!xs.length, "3e : débordement à 360 px : " + xs.slice(0, 3).join(" | "));
    ok(JSON.stringify(state.comps) === before, "state.comps intact à l'affichage");
    /* Carte de l'accueil : X compétences positionnées sur N (N = items officiels de la classe). */
    let card = compsCard().replace(/<[^>]+>/g, "");
    ok(/1 compétence positionnée sur 53 cette année/.test(card), "compsCard 3e : " + card.replace(/\s+/g, " ").slice(0, 160));
    /* « Me tester » */
    const b = app.querySelector('.rtest[data-code="' + r1.code + '"]');
    ok(!!b, "bouton Me tester sur " + r1.code);
    if (b) {
      b.click();
      ok(session && session.ctest && session.ctest.code === r1.code && session.plan.length === 3, "Me tester : 3 questions");
      const cat = new Set(Engine.catalog(P(9)).map((c) => c.id));
      ok(session.plan.every((x) => cat.has(x.split("|")[0])), "Me tester : notions du catalogue France (" + session.plan.join(", ") + ")");
      ok(ctestNote(session.ctest) === Referentiel.note(state, r1), "bilan du test : niveau de l'item officiel");
      session = null;
    }
    /* Chaque classe : blocs repliés, rien ne dépasse à 360 px (tout déplié), compteur de la carte. */
    for (const [lab, g, n] of EXP) {
      fresh(P(g)); screenComps();
      const o = app.querySelectorAll(".olds");
      ok(o.length === OLDS[g], lab + " : " + o.length + " blocs repliés au lieu de " + OLDS[g]);
      ok([...o].every((e) => !e.open), lab + " : années précédentes repliées");
      if (g >= 10) ok(/Collège \(6e–3e\)/.test(app.innerText), lab + " : collège replié à part");
      if (g >= 11) ok([...o].some((e) => /^2nde/.test(e.querySelector("summary").textContent)), lab + " : 2nde repliée à part");
      if (g === 10 || g === 11) ok(app.innerText.includes("Automatismes"), lab + " : automatismes");
      o.forEach((e) => (e.open = true));
      xs = overflow(); ok(!xs.length, lab + " : débordement à 360 px : " + xs.slice(0, 3).join(" | "));
      card = compsCard().replace(/<[^>]+>/g, "");
      ok(new RegExp("Ton niveau de maîtrise apparaît").test(card) && !/sur \d+ cette année/.test(card), lab + " : carte sans positionnement");
      state.comps = {};
      const r = Referentiel.list(state.profile).find((x) => Referentiel.hasQuestions(x));
      if (r) for (const c of Referentiel.cids(r)) state.comps[c] = { r: [1, 1, 1], n: 3, last: "2026-11-25" };
      card = compsCard().replace(/<[^>]+>/g, "");
      ok(new RegExp("positionnées? sur " + n + " cette année").test(card), lab + " : compsCard sur " + n + " (" + card.replace(/\s+/g, " ").slice(0, 120) + ")");
    }
    /* Profils suisses inchangés : Collège = REF_MATU (98 en 1re), CO et MP = compétences par notion. */
    fresh({ system: "CH", grade: 12, track: "college", minutes: 5 });
    ok(Referentiel.of(state.profile) === "MATU" && Referentiel.list(state.profile).length === 98, "Collège 1re : référentiel MATU, 98 compétences");
    screenComps(); t = app.innerText;
    ok(/note de 1 à 6/.test(t) && !/maîtrise|positionn|travaillé en classe\b/.test(t), "Collège 1re : notes 1–6, vocabulaire inchangé");
    ok(app.querySelectorAll(".olds").length === 0, "Collège 1re : pas d'années précédentes");
    fresh({ system: "CH", grade: 15, track: "college", niv: "R", minutes: 5 }); screenComps();
    ok(app.querySelectorAll(".olds").length === 1 && /Années précédentes/.test(app.querySelector(".olds summary").textContent), "Collège 4e : un seul bloc « Années précédentes »");
    for (const [lab, p] of [["CO 10e", { system: "CH", grade: 10, track: "college" }], ["CO 11e", { system: "CH", grade: 11, track: "college" }], ["MP 2e", { system: "CH", grade: 13, track: "mp" }]]) {
      fresh({ ...p, minutes: 5 });
      ok(Referentiel.of(state.profile) === null, lab + " : pas de référentiel officiel");
      screenComps();
      ok(!app.querySelector(".rcomp") && app.querySelectorAll(".ctest").length > 0, lab + " : compétences par notion (affichage actuel)");
    }
  } catch (e) { bad.push("EXC " + e.message + " " + (e.stack || "").split("\n")[1]); }
  document.getElementById("out").textContent = (bad.length ? "ÉCHEC " + bad.join(" ; ") : "ok référentiel France : " + out.join(" · "));
})();
