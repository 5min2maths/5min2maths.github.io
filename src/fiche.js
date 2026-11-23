// « Ma fiche » (22.11, décisions de l'enseignant ; proposition tools/syntheses.md, maquette design/maquette_synthese.html).
// Une fiche par chapitre (derrière Progrès) ou pour les notions du test (derrière Mon test) :
//  - Fiche : règles à trous (mode « Je me teste » par défaut, « Je relis » pour tout voir), exemple, erreurs du carnet,
//    une question « Explique en une phrase », lignes « Je sais… » ✓ ~ ✗ partagées avec l'autoévaluation de Mon test ;
//    tri personnel : à revoir → en progrès → acquis (repliés) → pas encore vu.
//  - Carte : petit graphe du chapitre en SVG dessiné en code, couleurs = maîtrise ; « Je refais la carte » de mémoire.
//  - Impression : A4 paysage, 3 colonnes (comme synthese.typ), à compléter ou corrigé, par la fenêtre d'impression.
// Données : src/fiche_data.js (FICHES). Rien n'est envoyé ; ce que l'élève écrit reste dans state.fiche.
(function () {
  const FS = () => (state.fiche = state.fiche || { self: {}, why: {}, map: {}, mode: "teste" });
  const chapLabel = (c) => ((typeof THEME_LABEL !== "undefined" && THEME_LABEL.CO && THEME_LABEL.CO[c]) || c).replace(/^\d+\.\s*/, "");
  const has = (id) => !!(state.notions && state.notions[id]);
  const carnetOf = (id) => (state.carnet || []).filter((e) => e.id === id);
  const fmtD = (d) => (d ? d.slice(8, 10) + "." + d.slice(5, 7) : "");
  const strip = (s) => String(s).replace(/\\\(|\\\)/g, "").replace(/\\[a-z]+/g, "").replace(/[{}\\]/g, "");
  // Chapitres de fiche pour l'année de l'élève (CO seulement pour l'instant : 11e d'abord).
  function chapsOfYear() {
    const p = state && state.profile;
    if (!p || p.system !== "CH" || p.grade > 11 || p.track === "mp") return [];
    return Object.keys(FICHES).filter((k) => k.startsWith(p.grade + "C") && FICHES[k].ids.some(has));
  }
  const chapsFor = (ids) => Object.keys(FICHES).filter((k) => FICHES[k].ids.some((i) => ids.includes(i)));
  const lessonOf = (id) => (typeof LESSONS !== "undefined" && LESSONS[id]) || null;
  const ruleOf = (id) => { for (const k of Object.keys(FICHES)) if (FICHES[k].regle && FICHES[k].regle[id]) return FICHES[k].regle[id]; return null; };
  const whyOf = (id) => { for (const k of Object.keys(FICHES)) if (FICHES[k].why && FICHES[k].why[id]) return FICHES[k].why[id]; return null; };

  // ---------- Autoévaluation partagée avec Mon test ----------
  // Pendant un test, une compétence qui a sa ligne dans la grille de Mon test lit et écrit la colonne « Avant » (state.autotest.avant) ;
  // sinon, la note de l'élève est gardée dans state.fiche.self. Les deux sont tenus à jour ensemble.
  function atShared() {
    if (!Engine.prepActive(state) || typeof atState !== "function") return null;
    if (state.autotest && state.autotest.key === state.prep.ids.join()) return state.autotest;
    return null;
  }
  function selfGet(cid) { const A = atShared(); if (A && A.rows.some((r) => r.cid === cid) && A.avant[cid] !== undefined) return A.avant[cid]; const v = FS().self[cid]; return v === undefined ? null : v; }
  function selfSet(cid, v) { FS().self[cid] = v; const A = atShared(); if (A && A.rows.some((r) => r.cid === cid)) A.avant[cid] = v; save(); }

  // ---------- Tri personnel ----------
  function groupOf(id) {
    const s = state.notions[id];
    if (!s) return "nonvu";
    const A = atShared(), run = A && A.runs.length ? A.runs[A.runs.length - 1].r : null;
    const failed = run && compsOf(id).some((c) => run[c.cid] === 0);
    if ((s.status === "avenir" || s.status === "nonvu") && !s.seen && !carnetOf(id).length) return "nonvu";
    if (carnetOf(id).length || failed || s.m < 0.5) return "revoir";
    if (s.m < 0.75) return "progres";
    return "acquis";
  }
  const G = { revoir: ["À revoir d'abord", "bad"], progres: ["En progrès", "mid"], acquis: ["Acquis", "ok"], nonvu: ["Pas encore vu en classe", "no"] };
  function noteOf(id) {
    const n = compsOf(id).map((c) => compNote((state.comps || {})[c.cid])).filter((x) => x !== null);
    return n.length ? Math.round((n.reduce((a, b) => a + b, 0) / n.length) * 2) / 2 : null;
  }

  // ---------- Règles à trous ----------
  const parts = (line) => String(line).split(/\[\[(.+?)\]\]/);
  function ruleHtml(line) {
    return parts(line).map((p, i) => (i % 2 ? `<button type="button" class="fi-gap" aria-label="Vérifier ce trou"><span class="fi-ans">${p}</span></button>` : p)).join("");
  }
  function printLine(line, corr) {
    return parts(line).map((p, i) => (!(i % 2) ? p : corr ? `<b class="fp-ans">${p}</b>` : `<span class="fp-blank" style="min-width:${Math.min(16, Math.max(3, strip(p).length * 0.55)).toFixed(1)}em"></span>`)).join("");
  }

  // ---------- Carte du chapitre (SVG) ----------
  const NW = 136, NH = 62, CX = (c) => 8 + c * 184, RY = (r) => 8 + r * 112;
  function edgePt(a, b) { // point du bord du rectangle a, vers le centre de b
    const ax = CX(a[0]) + NW / 2, ay = RY(a[1]) + NH / 2, bx = CX(b[0]) + NW / 2, by = RY(b[1]) + NH / 2, dx = bx - ax, dy = by - ay;
    const t = Math.min(dx ? NW / 2 / Math.abs(dx) : Infinity, dy ? NH / 2 / Math.abs(dy) : Infinity);
    return [ax + dx * t, ay + dy * t];
  }
  // opt : { redo: { placed: {id:true} }, print: "vide"|"plein", only: [ids du test] }
  function mapSvg(chap, opt = {}) {
    const C = FICHES[chap].carte, ids = Object.keys(C.pos).filter(has), rows = Math.max(...ids.map((i) => C.pos[i][1])) + 1, H = RY(rows - 1) + NH + 8;
    const r1 = (v) => Math.round(v * 10) / 10;
    const links = C.liens.filter(([a, b]) => ids.includes(a) && ids.includes(b)).map(([a, b, lab, both]) => {
      const pa = C.pos[a], pb = C.pos[b], [x1, y1] = edgePt(pa, pb), [x2, y2] = edgePt(pb, pa);
      const s = 6, L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L; // on raccourcit un peu pour la pointe
      const X1 = both ? x1 + ux * 2 : x1, Y1 = both ? y1 + uy * 2 : y1, X2 = x2 - ux * 2, Y2 = y2 - uy * 2;
      const L2 = String(lab || "").split("|"), mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      const vert = pa[0] === pb[0], hor = pa[1] === pb[1];
      const tx = vert ? mx + 8 : mx, anchor = vert ? "start" : "middle", ty0 = vert ? my - (L2.length - 1) * 6 + 3 : hor ? (y1 + 16) : my - (L2.length - 1) * 6 + 3;
      return `<path class="fi-ar" d="M${r1(X1)} ${r1(Y1)} L${r1(X2)} ${r1(Y2)}" marker-end="url(#fi-ah)"${both ? ' marker-start="url(#fi-ah)"' : ""}/>` +
        L2.map((t, k) => `<text class="fi-lk" x="${r1(tx)}" y="${r1(ty0 + k * 11)}" text-anchor="${anchor}">${esc(t)}</text>`).join("") + (s ? "" : "");
    }).join("");
    const nodes = ids.map((id) => {
      const [c, r] = C.pos[id], x = CX(c), y = RY(r), [t1, t2, ex] = C.txt[id] || [nLabel(id), "", ""], g = groupOf(id), n = carnetOf(id).length;
      const dim = opt.only && !opt.only.includes(id);
      if (opt.redo && !opt.redo.placed[id]) return `<g class="fi-slot" data-slot="${id}" role="button" tabindex="0" aria-label="Case vide"><rect class="fi-nd fi-empty" x="${x}" y="${y}" width="${NW}" height="${NH}" rx="12"/><text class="fi-q" x="${x + NW / 2}" y="${y + NH / 2 + 6}" text-anchor="middle">?</text></g>`;
      if (opt.print === "vide") return `<g><rect class="fi-nd" x="${x}" y="${y}" width="${NW}" height="${NH}" rx="12"/></g>`;
      const dot = opt.print || opt.redo ? "" : g === "nonvu" ? `<circle class="fi-dot-no" cx="${x + NW - 14}" cy="${y + 14}" r="5"/>` : `<circle class="fi-dot-${G[g][1]}" cx="${x + NW - 14}" cy="${y + 14}" r="6"/>`;
      const sub = !opt.print && !opt.redo && n ? "📕 " + n + " dans ton carnet" : t2;
      return `<g class="fi-node${dim ? " fi-dim" : ""}${g === "nonvu" && !opt.print ? " fi-nonvu" : ""}" data-node="${id}"><rect class="fi-nd${!opt.print && !opt.redo && g === "revoir" && !dim ? " fi-focus" : ""}" x="${x}" y="${y}" width="${NW}" height="${NH}" rx="12"/>${dot}
        <text class="fi-t1" x="${x + 10}" y="${y + 20}">${esc(t1)}</text><text class="fi-t2" x="${x + 10}" y="${y + 34}">${esc(sub)}</text><text class="fi-ex" x="${x + 10}" y="${y + 52}">${esc(ex)}</text></g>`;
    }).join("");
    return `<svg class="fi-map" viewBox="0 0 336 ${H}" role="img" aria-label="Carte du chapitre ${esc(chapLabel(chap))}"><defs><marker id="fi-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="fi-ahp" d="M0 0L10 5L0 10z"/></marker></defs>${links}${nodes}</svg>`;
  }
  const legend = `<div class="fi-legend"><span><i class="fi-d fi-d-ok"></i>acquis</span><span><i class="fi-d fi-d-mid"></i>en progrès</span><span><i class="fi-d fi-d-bad"></i>à revoir</span><span><i class="fi-d fi-d-no"></i>pas encore vu</span></div>`;

  // ---------- Écran ----------
  let tab = "fiche"; // onglet affiché ; une fiche ouverte de l'extérieur commence sur « Fiche »
  // opt : { test: true } (notions du test) ou { chap: "11C05" } ; back : fonction de retour.
  function screenFiche(opt = {}, back) {
    const F = FS();
    tab = opt.tab || "fiche";
    let ids, chaps, title;
    if (opt.test && Engine.prepActive(state)) {
      ids = state.prep.ids.filter(has); chaps = chapsFor(ids); title = "Mon test";
      if (typeof atState === "function") { try { atState(); } catch (e) {} } // grille de Mon test : mêmes cases ✓ ~ ✗
    } else {
      const c = opt.chap && FICHES[opt.chap] ? opt.chap : chapsOfYear()[0];
      if (!c) return screenHome();
      opt = { chap: c, tab }; ids = FICHES[c].ids.filter(has); chaps = [c]; title = chapLabel(c);
    }
    const goBack = back || (() => { homeTab = opt.test ? "test" : "prog"; screenHome(); });
    if (!chaps.length) tab = "fiche";
    const order = ["revoir", "progres", "acquis", "nonvu"], by = {};
    ids.forEach((id) => (by[groupOf(id)] = by[groupOf(id)] || []).push(id));
    const teste = F.mode !== "relis";
    // Une seule question « Explique » : la première notion à revoir qui en a une (avec une erreur au carnet si possible).
    const whyId = [...(by.revoir || []).filter((i) => carnetOf(i).length), ...(by.revoir || []), ...(by.progres || [])].find((i) => whyOf(i));
    const card = (id, g) => {
      const L = lessonOf(id), R = ruleOf(id), note = noteOf(id), nC = carnetOf(id), withM = nC.filter((e) => e.m).slice(-2);
      const rule = R ? R.map(ruleHtml).join("<br>") : L ? `<button type="button" class="fi-gap fi-whole" aria-label="Montrer la règle"><span class="fi-ans">${L.regle}</span></button>` : "";
      const errs = withM.map((e) => `<div class="fi-mine"><b>Ton erreur du ${fmtD(e.date)}</b> · ${e.a ? "tu as répondu " + esc(e.a) + " : " : ""}${escT(e.m)}</div>`).join("")
        + (nC.length > withM.length ? `<div class="fi-mine"><b>📕 ${nC.length} erreur${nC.length > 1 ? "s" : ""} dans ton carnet</b>${L && L.piege && !withM.length ? " · Piège : " + L.piege : " · refais-les pour les effacer."}</div>` : "");
      const why = id === whyId ? `<div class="fi-why"><span>💬 <b>Explique en une phrase</b> : ${whyOf(id)}</span><textarea data-why="${id}" rows="2" placeholder="Parce que…">${esc(F.why[id] || "")}</textarea></div>` : "";
      const js = compsOf(id).map((c) => { const v = selfGet(c.cid); return `<div class="fi-js"><span class="fi-jl">Je sais ${esc(c.label.charAt(0).toLowerCase() + c.label.slice(1))}</span>
        <span class="seg at-seg" data-cid="${c.cid}">${[2, 1, 0].map((x) => `<button type="button" data-v="${x}" aria-pressed="${v === x}" aria-label="${["pas encore", "à peu près", "je sais faire"][x]}">${AT_SYM[x]}</button>`).join("")}</span></div>`; }).join("");
      return `<div class="fi-card fi-${G[g][1]}" data-id="${id}"><h3><span>${esc(L ? L.titre : nLabel(id))}</span><span class="row" style="gap:4px">${nC.length ? `<span class="tag">📕 ${nC.length}</span>` : ""}${note !== null ? `<span class="note ${noteCls(note)}">${noteTxt(note)}</span>` : ""}</span></h3>
        ${rule ? `<div class="rule fi-rule">${rule}</div>` : ""}${L && L.exemple && L.exemple[0] ? `<div class="fi-ex1">Exemple : ${L.exemple[0]}</div>` : ""}${errs}${why}${js}</div>`;
    };
    const fiche = order.filter((g) => by[g]).map((g) => `<div class="fi-grp">${G[g][0]}${g === "revoir" && opt.test ? " · avant ton test" : ""}</div>` +
      by[g].map((id) => (g === "acquis" || g === "nonvu" ? `<details class="fi-mini"><summary><span>${esc((lessonOf(id) || {}).titre || nLabel(id))}</span>${noteOf(id) !== null ? `<span class="note ${noteCls(noteOf(id))}">${noteTxt(noteOf(id))}</span>` : `<span class="tag">${g === "nonvu" ? "plus tard" : "acquis"}</span>`}</summary>${card(id, g)}</details>` : card(id, g))).join("")).join("");
    const carte = chaps.map((c) => `<div class="fi-ess"><b>L'essentiel${chaps.length > 1 ? " · " + esc(chapLabel(c)) : " en 3 lignes"}</b><ol>${FICHES[c].ess.map((x) => `<li>${x}</li>`).join("")}</ol></div>
      <div class="fi-mapbox">${mapSvg(c, { only: opt.test ? ids : null })}</div>
      <button type="button" class="btn-sec fi-redo" data-chap="${c}">🧠 Je refais la carte${F.map[c] ? `<span class="small muted"> · dernière fois : ${F.map[c].err} erreur${F.map[c].err > 1 ? "s" : ""}</span>` : ""}</button>`).join("") + legend +
      `<p class="small muted">Touche une case pour ouvrir sa fiche. Bord rouge : à revoir${opt.test ? " avant ton test" : ""}.</p>`;
    h(`${brand}<button type="button" class="btn-ghost back-home" id="fiback">← Retour</button>
    <div class="fi-wrap ${teste ? "fi-teste" : "fi-relis"}">
    <div class="eyebrow">🗺 Ma fiche</div><h2 class="fi-title">${esc(title)}</h2>
    ${chaps.length ? `<div class="fi-sel" role="tablist"><button type="button" data-tab="carte" aria-pressed="${tab === "carte"}">🗺 Carte</button><button type="button" data-tab="fiche" aria-pressed="${tab === "fiche"}">📝 Fiche</button></div>` : ""}
    ${tab === "carte" && chaps.length ? `<div class="fi-carte stack">${carte}</div>` : `<div class="fi-sel" id="fimode"><button type="button" data-m="teste" aria-pressed="${teste}">🔎 Je me teste</button><button type="button" data-m="relis" aria-pressed="${!teste}">📖 Je relis</button></div>
      <p class="small muted fi-help">${teste ? "Dis la réponse dans ta tête, puis touche la case <b>?</b> pour vérifier. Ensuite, dis si tu savais : ✓ oui, ~ à peu près, ✗ pas encore." : "Tout est visible. Pour vraiment retenir, repasse ensuite en « Je me teste »."}</p>
      <div class="fi-list stack">${fiche || '<p class="muted">Pas de notion dans cette fiche.</p>'}</div>`}
    <div class="card flat stack fi-acts"><button class="btn-primary" id="fitrain">S'entraîner · 5 min</button>
      <div class="fi-two"><button class="btn-sec" id="fiprint0">🖨 À compléter</button><button class="btn-sec" id="fiprint1">🖨 Corrigé</button></div>
      <p class="small muted">Imprime ta fiche (A4 paysage) ou enregistre-la en PDF depuis la fenêtre d'impression.</p></div>
    </div>`);
    typeset(app);
    document.getElementById("fiback").onclick = goBack;
    app.querySelectorAll(".fi-sel [data-tab]").forEach((b) => (b.onclick = () => screenFiche({ ...opt, tab: b.dataset.tab }, back)));
    app.querySelectorAll("#fimode [data-m]").forEach((b) => (b.onclick = () => { F.mode = b.dataset.m; save(); screenFiche({ ...opt, tab: "fiche" }, back); }));
    app.querySelectorAll(".fi-gap").forEach((g) => (g.onclick = () => g.classList.add("shown")));
    app.querySelectorAll(".fi-js .at-seg").forEach((s) => s.querySelectorAll("button").forEach((b) => (b.onclick = () => {
      selfSet(s.dataset.cid, +b.dataset.v); s.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b));
    })));
    app.querySelectorAll("textarea[data-why]").forEach((t) => (t.oninput = () => { F.why[t.dataset.why] = t.value.slice(0, 400); save(); }));
    app.querySelectorAll(".fi-node[data-node]").forEach((n) => (n.onclick = () => { screenFiche({ ...opt, tab: "fiche" }, back); const el = app.querySelector(`.fi-card[data-id="${n.dataset.node}"]`); if (el) { const d = el.closest("details"); if (d) d.open = true; el.scrollIntoView({ block: "start" }); } }));
    app.querySelectorAll(".fi-redo").forEach((b) => (b.onclick = () => screenMapRedo(b.dataset.chap, () => screenFiche({ ...opt, tab: "carte" }, back))));
    document.getElementById("fitrain").onclick = () => {
      const pri = [...(by.revoir || []), ...(by.progres || []), ...(by.acquis || [])].slice(0, 5);
      if (!pri.length) return toast("Rien à travailler ici pour l'instant.");
      const plan = []; for (let k = 0; plan.length < 5; k++) { const id = pri[k % pri.length]; plan.push(id + "|" + (groupOf(id) === "revoir" ? 1 : 2)); }
      session = { plan, i: 0, score: 0, answered: 0, start: Date.now(), elo0: state.elo.r, ids: new Set(), prep: true };
      nextQuestion();
    };
    document.getElementById("fiprint0").onclick = () => fichePrint(opt, false);
    document.getElementById("fiprint1").onclick = () => fichePrint(opt, true);
  }

  // ---------- Je refais la carte (récupération) ----------
  function screenMapRedo(chap, back) {
    const C = FICHES[chap].carte, ids = Object.keys(C.pos).filter(has), R = { placed: {} };
    let sel = null, err = 0;
    const chips = ids.slice().sort(() => Math.random() - 0.5);
    const draw = () => {
      const done = ids.every((i) => R.placed[i]);
      h(`${brand}<button type="button" class="btn-ghost back-home" id="fiback">← Retour</button>
      <div class="fi-wrap"><div class="eyebrow">🧠 Je refais la carte</div><h2 class="fi-title">${esc(chapLabel(chap))}</h2>
      <p class="small muted">${done ? "" : "Touche une étiquette, puis la case où elle va. Les flèches t'aident : relis leurs mots."}</p>
      <div class="fi-mapbox">${mapSvg(chap, { redo: R })}</div>
      ${done ? `<div class="card stack"><h3>${err === 0 ? "Parfait : refaite sans erreur !" : "Carte refaite"}</h3><p class="small muted">${err} erreur${err > 1 ? "s" : ""} de placement. ${err ? "Refais-la dans quelques jours : se rappeler, c'est ce qui fait retenir." : "Bravo : tu as la structure du chapitre en tête."}</p><button class="btn-primary" id="fiok">Voir ma carte</button></div>`
        : `<div class="fi-chips">${chips.filter((i) => !R.placed[i]).map((i) => `<button type="button" class="fi-chip" data-id="${i}" aria-pressed="${sel === i}">${esc((C.txt[i] || [nLabel(i)])[0])}</button>`).join("")}</div>
        <p class="small fi-fb" aria-live="polite"></p>`}</div>`);
      document.getElementById("fiback").onclick = back;
      const ok = document.getElementById("fiok");
      if (ok) { ok.onclick = back; return; }
      app.querySelectorAll(".fi-chip").forEach((b) => (b.onclick = () => { sel = b.dataset.id; app.querySelectorAll(".fi-chip").forEach((x) => x.setAttribute("aria-pressed", x === b)); }));
      app.querySelectorAll("[data-slot]").forEach((g) => (g.onclick = () => {
        const fb = app.querySelector(".fi-fb");
        if (!sel) { fb.textContent = "Choisis d'abord une étiquette en dessous."; return; }
        if (g.dataset.slot === sel) {
          R.placed[sel] = true; sel = null;
          if (ids.every((i) => R.placed[i])) { FS().map[chap] = { date: day(), err }; save(); if (!err && typeof burst === "function") burst(); }
          draw();
        } else { err++; g.classList.add("fi-wrong"); fb.textContent = "Pas là : regarde les flèches qui arrivent à cette case."; setTimeout(() => g.classList.remove("fi-wrong"), 600); }
      }));
    };
    draw();
  }

  // ---------- Impression A4 paysage, 3 colonnes ----------
  const PAL = ["#ff595e", "#ff751f", "#E0A500", "#B1B62B", "#82BC24", "#36949d", "#1982c4", "#4267ac", "#565aa0", "#6a4c93"];
  function printHtml(opt, corr) {
    const test = opt.test && Engine.prepActive(state), ids = test ? state.prep.ids.filter(has) : FICHES[opt.chap].ids.filter(has), chaps = test ? chapsFor(ids) : [opt.chap];
    const title = test ? "Mon test" : chapLabel(opt.chap);
    const secs = ids.map((id, k) => {
      const L = lessonOf(id), R = ruleOf(id), nC = carnetOf(id).filter((e) => e.m).slice(-2);
      return `<div class="fp-sec"><h4 style="background:${PAL[k % PAL.length]}">${k + 1} ${esc(L ? L.titre : nLabel(id))}</h4>
        ${R ? R.map((l) => printLine(l, corr)).join("<br>") : L ? (corr ? L.regle : '<span class="fp-blank" style="min-width:100%"></span><br><span class="fp-blank" style="min-width:100%"></span>') : ""}
        ${L && L.exemple && L.exemple[0] ? `<div class="fp-ex">Exemple : ${L.exemple[0]}</div>` : ""}
        ${nC.map((e) => `<div class="fp-pers"><b>Mon erreur du ${fmtD(e.date)}</b> : ${e.a ? "j'ai répondu " + esc(e.a) + ". " : ""}${escT(e.m)}</div>`).join("")}</div>`;
    }).join("");
    const maps = chaps.map((c) => `<div class="fp-sec"><h4 style="background:#4267ac">Carte · ${esc(chapLabel(c))}</h4><div class="fp-ess">${FICHES[c].ess.map((x, i) => `${i + 1}. ${x}`).join("<br>")}</div>
      ${mapSvg(c, { print: corr ? "plein" : "vide" })}${corr ? "" : `<div class="fp-place">À placer : ${Object.keys(FICHES[c].carte.pos).filter(has).map((i) => esc(FICHES[c].carte.txt[i][0])).sort().join(" · ")}</div>`}</div>`).join("");
    const rows = ids.flatMap((id) => compsOf(id)), sym = (v) => (v === null || v === undefined ? "" : AT_SYM[v]);
    const js = `<div class="fp-sec"><h4 style="background:#565aa0">Je sais…</h4><table class="fp-tab"><tr><th>Je sais…</th><th>Avant</th><th>Après</th></tr>${rows.map((c) => `<tr><td>${esc(c.label)}</td><td>${sym(selfGet(c.cid))}</td><td></td></tr>`).join("")}</table></div>`;
    const errs = ids.flatMap((id) => carnetOf(id).filter((e) => e.m)).slice(-5);
    const mine = `<div class="fp-sec fp-pers"><b>Mes erreurs à ne plus faire</b> (carnet)<br>${errs.length ? errs.map((e, i) => `${i + 1}. ${escT(e.m)}`).join("<br>") : '1. <span class="fp-blank" style="min-width:90%"></span><br>2. <span class="fp-blank" style="min-width:90%"></span><br>3. <span class="fp-blank" style="min-width:90%"></span>'}</div>`;
    const ws = Object.entries(FS().why).filter(([id, t]) => ids.includes(id) && t.trim());
    const why = ws.length ? `<div class="fp-sec"><b>Mes explications</b><br>${ws.map(([id, t]) => `${whyOf(id) || ""}<br><i>${esc(t)}</i>`).join("<br>")}</div>` : "";
    const g = state.profile ? state.profile.grade + "e · " : "";
    return `<h1>${esc(title)} — ma fiche</h1><div class="fp-sub">${g}${corr ? "corrigé" : "version à compléter"} · imprimée le ${fmtD(day())}${test ? " · test le " + fmtD(state.prep.date) : ""}</div>
      <div class="fp-cols">${secs}${maps}${js}${mine}${why}</div>`;
  }
  function fichePrint(opt, corr, dry) {
    let el = document.getElementById("fiche-print");
    if (!el) { el = document.createElement("div"); el.id = "fiche-print"; document.body.appendChild(el); }
    el.innerHTML = printHtml(opt, corr);
    document.body.classList.add("fiche-printing");
    const end = () => { document.body.classList.remove("fiche-printing"); window.removeEventListener("afterprint", end); };
    if (dry) return el;
    window.addEventListener("afterprint", end);
    const go = () => { try { window.print(); } catch (e) {} };
    if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise([el]).then(go, go); else go();
    return el;
  }

  // ---------- Carte « Mes fiches » dans Progrès ----------
  function ficheProgCard() {
    if (!state) return "";
    const cs = chapsOfYear();
    if (!cs.length) return "";
    const nowC = Engine.nowActive && Engine.nowActive(state) ? chapsFor(state.now.ids) : [];
    const sorted = cs.filter((c) => nowC.includes(c)).concat(cs.filter((c) => !nowC.includes(c)));
    return `<div class="card flat stack fi-prog"><h3>🗺 Mes fiches</h3><p class="small muted">Carte du chapitre, règles à compléter et tes erreurs. À imprimer aussi.</p>
      <div class="fi-chaps">${sorted.map((c) => { const r = FICHES[c].ids.filter(has).filter((i) => groupOf(i) === "revoir").length; return `<button type="button" class="btn-sec" data-fiche="${c}">${esc(chapLabel(c))}<span class="small muted">${nowC.includes(c) ? "en classe" : ""}${nowC.includes(c) && r ? " · " : ""}${r ? r + " à revoir" : ""}</span></button>`; }).join("")}</div></div>`;
  }

  // ---------- Styles (écran et impression) ----------
  const CSS = `
  .fi-wrap { display: grid; gap: 12px; min-width: 0; }
  .fi-title { margin: 0; }
  .fi-sel { display: grid; grid-template-columns: 1fr 1fr; border: 1px solid var(--line); border-radius: 999px; overflow: hidden; }
  .fi-sel button { border: 0; border-radius: 0; padding: 9px 4px; font-weight: 700; background: transparent; color: var(--ink-soft); min-width: 0; }
  .fi-sel button[aria-pressed="true"] { background: var(--blue-soft); color: var(--blue); }
  .fi-help { margin: 0; }
  .fi-grp { font-family: var(--font-mono); font-size: .72rem; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-soft); margin: 6px 2px -2px; }
  .fi-card { background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 12px; display: grid; gap: 8px; min-width: 0; overflow-wrap: anywhere; }
  .fi-card.fi-bad { border-left: 5px solid var(--bad); } .fi-card.fi-mid { border-left: 5px solid var(--warn); }
  .fi-card h3 { margin: 0; font-size: 1rem; display: flex; justify-content: space-between; align-items: center; gap: 6px; }
  .fi-rule { line-height: 1.7; font-size: .95rem; }
  .fi-gap { display: inline; position: relative; font: inherit; padding: 0 4px; margin: 0 1px; border: 1.5px dashed var(--blue); border-radius: 6px; background: var(--card); color: inherit; min-width: 2.6em; max-width: 100%; white-space: normal; text-align: left; cursor: pointer; box-shadow: none; }
  .fi-teste .fi-gap:not(.shown) .fi-ans { visibility: hidden; }
  .fi-teste .fi-gap:not(.shown)::before { content: "?"; position: absolute; left: 6px; top: 0; color: var(--blue); font-weight: 700; }
  .fi-gap.fi-whole { display: block; width: 100%; min-height: 2.4em; }
  .fi-teste .fi-gap.fi-whole:not(.shown)::before { content: "? Redis la règle dans ta tête, puis touche ici"; position: static; font-weight: 600; }
  .fi-teste .fi-gap.fi-whole:not(.shown) .fi-ans { display: none; }
  .fi-gap.shown { border-style: solid; border-color: var(--ok); background: var(--ok-soft); font-weight: 700; }
  .fi-relis .fi-gap { border: 0; background: transparent; padding: 0; font-weight: 700; color: var(--ink); cursor: default; }
  .fi-ex1 { font-size: .9rem; color: var(--ink-soft); }
  .fi-mine { background: var(--bad-soft); border-radius: 10px; padding: 8px 10px; font-size: .9rem; line-height: 1.4; }
  .fi-mine b { color: var(--bad); }
  .fi-why { background: var(--blue-soft); border-radius: 10px; padding: 8px 10px; font-size: .9rem; display: grid; gap: 6px; }
  .fi-why textarea { width: 100%; font: inherit; font-size: .9rem; border: 1px solid var(--line); border-radius: 8px; padding: 6px 8px; background: var(--card); color: var(--ink); resize: vertical; }
  .fi-js { display: flex; align-items: center; gap: 8px; border-top: 1px dashed var(--line); padding-top: 8px; }
  .fi-jl { flex: 1; min-width: 0; font-size: .88rem; line-height: 1.3; }
  .fi-js .at-seg { flex: none; flex-wrap: nowrap; gap: 4px; }
  .fi-js .at-seg button { min-width: 34px; padding: 5px 7px; }
  .fi-mini { background: var(--card); border: 1px solid var(--line); border-radius: 12px; }
  .fi-mini > summary { display: flex; justify-content: space-between; align-items: center; gap: 8px; padding: 10px 12px; cursor: pointer; list-style: none; }
  .fi-mini > summary::-webkit-details-marker { display: none; }
  .fi-mini[open] > summary { border-bottom: 1px dashed var(--line); }
  .fi-mini > .fi-card { border: 0; border-radius: 0 0 12px 12px; }
  .fi-ess { background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 10px 12px; font-size: .92rem; }
  .fi-ess ol { margin: 6px 0 0; padding-left: 1.2em; display: grid; gap: 4px; line-height: 1.4; }
  .fi-mapbox { background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 6px 4px; }
  .fi-map { display: block; width: 100%; height: auto; }
  .fi-map text { font-family: var(--font-body); fill: var(--ink); }
  .fi-map .fi-t1 { font-weight: 700; font-size: 12.5px; } .fi-map .fi-t2 { font-size: 11px; }
  .fi-map .fi-ex { font-family: var(--font-mono); font-size: 10.5px; fill: var(--ink-soft); }
  .fi-map .fi-lk { font-size: 10px; fill: var(--ink-soft); font-style: italic; }
  .fi-map .fi-q { font-size: 20px; font-weight: 700; fill: var(--blue); }
  .fi-nd { fill: var(--card); stroke: var(--line); stroke-width: 1.5; }
  .fi-nd.fi-focus { stroke: var(--margin); stroke-width: 2.2; }
  .fi-nd.fi-empty { stroke: var(--blue); stroke-dasharray: 5 4; fill: var(--blue-soft); }
  .fi-wrong .fi-nd { stroke: var(--bad); fill: var(--bad-soft); }
  .fi-node, .fi-slot { cursor: pointer; }
  .fi-dim, .fi-nonvu { opacity: .5; } .fi-nonvu .fi-nd { stroke-dasharray: 5 4; }
  .fi-ar { stroke: var(--ink-soft); stroke-width: 1.4; fill: none; } .fi-ahp { fill: var(--ink-soft); }
  .fi-dot-ok { fill: var(--ok); } .fi-dot-mid { fill: var(--warn); } .fi-dot-bad { fill: var(--bad); } .fi-dot-no { fill: none; stroke: var(--line); stroke-width: 2; }
  .fi-legend { display: flex; flex-wrap: wrap; gap: 4px 12px; font-size: .8rem; color: var(--ink-soft); }
  .fi-d { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 4px; vertical-align: -1px; }
  .fi-d-ok { background: var(--ok); } .fi-d-mid { background: var(--warn); } .fi-d-bad { background: var(--bad); } .fi-d-no { border: 2px solid var(--line); }
  .fi-redo .small { font-weight: 400; }
  .fi-chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .fi-chip { padding: 8px 12px; border-radius: 999px; font-weight: 700; }
  .fi-chip[aria-pressed="true"] { background: var(--blue); border-color: var(--blue); color: #fff; }
  .fi-two, .fi-chaps { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .fi-chaps button { display: grid; gap: 2px; text-align: center; padding: 10px 6px; min-width: 0; }
  .fi-two button { min-width: 0; padding: 10px 6px; }
  .tools2 .fiche-btn { grid-column: 1 / -1; }
  #fiche-print { display: none; }
  @media print {
    @page { size: A4 landscape; margin: 13mm 7mm 4mm; }
    body.fiche-printing { background: #fff !important; }
    body.fiche-printing > *:not(#fiche-print) { display: none !important; }
    body.fiche-printing #fiche-print { display: block; }
  }
  #fiche-print { --ink: #111; --ink-soft: #444; --card: #fff; --line: #999; --blue: #2457d6; --blue-soft: #fff; --bad: #c2413f; --ok: #1e8a5a; --warn: #b7791f; --margin: #c2413f;
    color: #111; background: #fff; font-family: "Atkinson Hyperlegible", system-ui, sans-serif; font-size: 9pt; line-height: 1.35; }
  #fiche-print h1 { text-align: center; font-size: 18pt; margin: 0 0 2pt; }
  #fiche-print .fp-sub { text-align: center; font-size: 9pt; color: #555; margin-bottom: 6pt; }
  #fiche-print .fp-cols { column-count: 3; column-gap: 12pt; column-fill: balance; }
  #fiche-print .fp-sec { break-inside: avoid; margin-bottom: 6pt; }
  #fiche-print h4 { color: #fff; margin: 0 0 3pt; padding: 2pt 5pt; border-radius: 3pt; font-size: 9pt; width: 92%; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  #fiche-print .fp-blank { display: inline-block; border-bottom: 1px solid #333; height: 1.1em; vertical-align: bottom; max-width: 100%; }
  #fiche-print .fp-ex { color: #444; }
  #fiche-print .fp-pers { border: 1.2pt solid #c2413f; border-radius: 4pt; padding: 3pt 5pt; margin-top: 3pt; }
  #fiche-print .fp-tab { border-collapse: collapse; width: 100%; font-size: 8.5pt; }
  #fiche-print .fp-tab td, #fiche-print .fp-tab th { border: 1px solid #888; padding: 2pt 3pt; }
  #fiche-print .fp-tab td + td, #fiche-print .fp-tab th + th { width: 3.2em; text-align: center; }
  #fiche-print .fi-map { width: 100%; max-height: 62mm; }
  #fiche-print .fp-place, #fiche-print .fp-ess { font-size: 8.5pt; margin: 2pt 0; }
  `;
  if (typeof document !== "undefined" && !document.getElementById("fiche-css")) {
    const st = document.createElement("style"); st.id = "fiche-css"; st.textContent = CSS; document.head.appendChild(st);
  }
  Object.assign(window, { screenFiche, ficheProgCard, fichePrint, screenMapRedo, ficheGroupOf: groupOf, ficheMapSvg: mapSvg, ficheChapsOfYear: chapsOfYear });
})();
