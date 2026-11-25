/* Séparation complète France / romand (25.11 soir, règle de l'auteur : « profil France voit des choses françaises
   uniquement, profil romand des choses romandes uniquement »). On ouvre chaque écran sous plusieurs profils et on
   cherche les marqueurs de l'autre système dans le texte affiché. #detail : liste complète. */
(function () {
  const DETAIL = /detail/.test(location.hash), SANSPZ = /sanspz/.test(location.hash), SANSQ = /sansq/.test(location.hash), ONLYPZ = /onlypz/.test(location.hash);
  const CH_MARK = [[/Genève|genevois/i, "Genève"], [/romand/i, "romand"], [/\bPER\b/, "PER"], [/\bCO\b|Cycle d'orientation|du Cycle\b/, "CO"], [/maturité|\bMP\b|\bmatu\b/i, "maturité/MP"],
    [/\bCHF\b|\bfrancs?\b/, "CHF"], [/(?<![\d^{])\b(9|10|11)e\b(?![\^{])/, "9e–11e"], [/évaluation bilan|EVACOM|épreuves? communes?/i, "épreuve romande"], [/Collège de Genève|\bau Collège\b|du Collège\b/, "Collège GE"],
    [/\bPGDC|\bPPMC|cathète/, "vocabulaire suisse"], [/notes? de 1 à 6|note \(1 à 6\)|notes? sur 6|échelle de 1 à 6|notes suisses/, "notes 1–6"] /* 25.11 : « dé numéroté de 1 à 6 » n'est pas une note suisse */, [/Sésamath|HarmoS|plan d'études/i, "référentiel suisse"]];
  const FR_MARK = [[/€/, "€"], [/brevet|\bDNB\b/i, "brevet"], [/lycée|\b2nde\b|\bTle\b|terminale/i, "lycée"], [/Éducation nationale|académie|Bulletin officiel/i, "institution FR"], [/\bBO\b/, "institution FR"],
    [/\bPGCD\b|\bPPCM\b/, "vocabulaire FR"], [/maîtrise (insuffisante|fragile|satisfaisante)|\bLSU\b/i, "LSU"], [/collégien/i, "collégien"], [/épreuve anticipée/i, "épreuve anticipée"]];
  const PROFILES = [["FR 6e", { system: "FR", grade: 6, track: "college" }], ["FR 3e", { system: "FR", grade: 9, track: "college" }], ["FR 2nde", { system: "FR", grade: 10, track: "college" }], ["FR Tle", { system: "FR", grade: 12, track: "college" }],
    ["CH 9e", { system: "CH", grade: 9, track: "college" }], ["CH 11e", { system: "CH", grade: 11, track: "college" }], ["CH Col 1re", { system: "CH", grade: 12, track: "college" }], ["CH MP 2e", { system: "CH", grade: 13, track: "mp" }]];
  const found = {}, add = (prof, scr, lab, ctx) => { const k = prof + " | " + scr + " | " + lab; if (!found[k]) found[k] = ctx; };
  const scan = (prof, scr, fr) => {
    const t = app.innerText || app.textContent;
    for (const [re, lab] of fr ? CH_MARK : FR_MARK) { const m = re.exec(t); if (m) add(prof, scr, lab, Array.from(t.slice(Math.max(0, m.index - 50), m.index + 50)).filter((c) => !/^[\ud800-\udfff]$/.test(c)).join("").replace(/\s+/g, " ")); }
  };
  const SCREENS = [
    ["accueil", () => { homeTab = "today"; screenHome(); }], ["problème", () => { homeTab = "prob"; screenHome(); }], ["évaluation", () => { homeTab = "test"; screenHome(); }],
    ["carnet", () => { homeTab = "carnet"; screenHome(); }], ["progrès", () => { homeTab = "prog"; screenHome(); }], ["compétences", () => screenComps()], ["en classe", () => screenNow()],
    ["en classe (liste)", () => screenNowList()], ["réglages", () => screenSettings()], ["confidentialité", () => screenPrivacy()], ["mentions", () => screenLegal()],
    ["grades", () => screenGrades()], ["préparer", () => screenPrep()], ["changer de classe", () => { draft = { ...state.profile, keepSys: true }; screenLevel(); }],
    ["leçon", () => { const id = Engine.catalog(state.profile).filter((c) => c.current && LESSONS[c.id])[0]; if (id) screenLesson(id.id, () => {}); }],
    ["présentation élèves", () => { history.replaceState(null, "", "#decouvrir"); presentRoute(); }], ["présentation parents", () => { history.replaceState(null, "", "#parents"); presentRoute(); }],
    ["présentation enseignants", () => { history.replaceState(null, "", "#enseignants"); presentRoute(); }],
  ];
  const errs = [];
  for (const [pl, p] of PROFILES) {
    state = Engine.newState({ ...p, minutes: 5 }); Engine.autoInit(state); state.placed = true; homeTab = "today";
    const fr = p.system === "FR";
    for (const [sn, f] of SCREENS) {
      if (ONLYPZ && !/présentation/.test(sn)) continue;
      if (/présentation/.test(sn) && SANSPZ) continue;
      try { f(); if (typeof frDom === "function") frDom(app); scan(pl, sn, fr); } catch (e) { errs.push(pl + " " + sn + " : " + e.message); }
      history.replaceState(null, "", location.pathname); if (typeof pzStop === "function") pzStop();
    }
    /* questions de l'année : énoncés et corrections */
    const cur = SANSQ ? [] : Engine.catalog(p).filter((c) => c.current && GEN[c.id]);
    for (const c of cur) for (const d of [1, 2, 3]) {
      let q; try { q = Engine.make(state, c.id, d, 11 + d); } catch (e) { continue; }
      if (!q) continue;
      app.innerHTML = `<div>${q.q || ""}</div><div>${q.sol || ""}</div>`;
      scan(pl, "question " + c.id + "|" + d, fr);
    }
  }
  const keys = Object.keys(found), byScr = {};
  for (const k of keys) { const [pr, sc, lab] = k.split(" | "); const s = sc.startsWith("question") ? "questions" : sc; (byScr[pr + " · " + s] = byScr[pr + " · " + s] || new Set()).add(lab); }
  const detail = DETAIL;
  const out = (keys.length || errs.length ? "ÉCHEC " + keys.length + " marqueurs de l'autre système\n" : "ok séparation France / romand\n") + errs.join("\n") + "\n" +
    Object.entries(byScr).map(([k, v]) => k + " : " + [...v].join(", ")).join("\n") + (detail ? "\n\n" + keys.map((k) => k + " → « " + found[k] + " »").join("\n") : "");
  document.getElementById("out").textContent = out;
})();
