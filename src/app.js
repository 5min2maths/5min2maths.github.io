// Interface : entrée (niveau, temps, notions, positionnement), accueil, séance, bilan.
// Point de collecte des votes 👍 / 👎 : laisser vide tant qu'aucun n'est configuré (votes gardés sur l'appareil).
const VOTE_ENDPOINT = "https://script.google.com/macros/s/AKfycbym3jQKGDc1RrOsR7gqEVGIeAbBF0cML8VEDYtQfaOmO0743jRcmeHSQ-WglFVCb-dd/exec";

const app = document.getElementById("app");
let state = Store.load();
const save = () => Store.save(state);
const h = (html) => { app.innerHTML = html; typeset(app); window.scrollTo(0, 0); };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const gradeName = (p) => (SYSTEMS[p.system].grades.find(([g]) => g === p.grade) || [0, ""])[1];
const brand = '<div class="brand"><b>5 minutes de maths</b><span>par jour</span></div>';
const PRAISE = ["Juste !", "Bien vu !", "Exact !", "Parfait.", "C'est ça !", "Bravo !"];
const pick = (a) => a[Math.floor(Math.random() * a.length)];

function typeset(el) {
  const go = () => window.MathJax && MathJax.typesetPromise ? MathJax.typesetPromise([el]).catch(() => {}) : setTimeout(go, 150);
  go();
}
const hash = (s) => { let x = 0; for (const c of s) x = (x * 31 + c.charCodeAt(0)) >>> 0; return x.toString(36).slice(-4); };

// ---------------- Entrée ----------------
let draft = { system: "CH", grade: 11, track: "college", minutes: 5 };

function screenWelcome() {
  const demo = GEN.pyth(1);
  const c = demo.spec.value;
  h(`${brand}
  <div class="stack"><h1>Chaque jour, <span class="mark">5 minutes</span> de maths, à ton niveau.</h1>
  <p class="muted">Une question du jour choisie pour toi, une figure, une correction immédiate. Ton Mathélo monte quand tu progresses. Pas de compte : tout reste sur ton téléphone.</p></div>
  <div class="card tilt"><div class="qmeta"><span class="chip">Exemple · Pythagore</span><span class="dots"><i class="on"></i><i></i><i></i></span></div>
  <div class="qtext">${demo.q}</div><div class="figwrap">${demo.fig || ""}</div>
  <p class="small muted">Tape ta réponse comme tu veux : ${c}, √${c * c}, ${2 * c}/2… le calculateur comprend.</p></div>
  <button class="btn-primary btn-big" id="go">Commencer (3 minutes)</button>`);
  document.getElementById("go").onclick = screenLevel;
}

function screenLevel() {
  const sys = SYSTEMS[draft.system];
  if (!sys.grades.some(([g]) => g === draft.grade)) draft.grade = sys.grades[sys.grades.length - 2][0];
  const sec2 = draft.system === "CH" && draft.grade >= 12;
  h(`${brand}<div class="eyebrow">Étape 1 sur 3</div><h2>Où en es-tu ?</h2>
  <div class="card flat stack"><h3>Ton école</h3><div class="seg" id="sys">${Object.entries(SYSTEMS).map(([k, v]) => `<button aria-pressed="${k === draft.system}" data-v="${k}">${v.label}</button>`).join("")}</div>
  <h3>Ta classe cette année</h3><div class="seg" id="grade">${sys.grades.map(([g, n]) => `<button aria-pressed="${g === draft.grade}" data-v="${g}">${n}</button>`).join("")}</div>
  ${sec2 ? `<h3>Ta voie</h3><div class="seg" id="track"><button aria-pressed="${draft.track === "college"}" data-v="college">Collège (maturité gymnasiale)</button><button aria-pressed="${draft.track === "mp"}" data-v="mp">Maturité professionnelle</button></div>` : ""}</div>
  <div class="card flat stack"><h3>Combien de temps par jour ?</h3><div class="timepick" id="time">${[1, 2, 5, 10].map((m) => `<button aria-pressed="${m === draft.minutes}" data-v="${m}"><b>${m}</b><small>${m === 1 ? "minute" : "minutes"} · ${QUESTIONS_FOR[m]} q.</small></button>`).join("")}</div>
  <p class="small muted">5 minutes, c'est le conseil. Tu pourras changer chaque jour.</p></div>
  <button class="btn-primary btn-big" id="next">Continuer</button>`);
  const bind = (id, key, num) => app.querySelectorAll("#" + id + " button").forEach((b) => (b.onclick = () => { draft[key] = num ? +b.dataset.v : b.dataset.v; screenLevel(); }));
  bind("sys", "system"); bind("grade", "grade", true); bind("track", "track"); bind("time", "minutes", true);
  document.getElementById("next").onclick = () => { draft.statuses = null; screenNotions(); };
}

function screenNotions(editing = false) {
  const prof = editing ? state.profile : draft;
  const cat = Engine.catalog(prof);
  const st = editing ? Object.fromEntries(Object.entries(state.notions).map(([k, v]) => [k, v.status])) : (draft.statuses ||= Object.fromEntries(cat.map((c) => [c.id, c.defaultStatus])));
  const groups = {};
  cat.forEach((c) => (groups[c.theme] = groups[c.theme] || []).push(c));
  const label = { vu: "déjà vu", encours: "en cours", nonvu: "pas encore" };
  h(`${brand}${editing ? "" : '<div class="eyebrow">Étape 2 sur 3</div>'}<h2>${editing ? "Mes notions" : "Qu'as-tu déjà étudié ?"}</h2>
  <p class="muted">${editing ? "Tu as vu une nouvelle notion en classe ? Mets-la à jour : elle entrera dans tes questions." : "J'ai coché selon la date ; corrige si besoin. Les notions des années précédentes comptent comme vues."}</p>
  ${Object.entries(groups).map(([th, list]) => `<div class="card flat"><h3>${THEMES[th]}</h3>${list.map((c) => `<div class="notion"><div><b>${c.label}</b>${c.current ? "" : ' <span class="small muted">· années précédentes</span>'}</div><div class="ex">\\(${c.ex}\\)</div>
    <div class="tri" data-id="${c.id}">${["vu", "encours", "nonvu"].map((s) => `<button aria-pressed="${st[c.id] === s}" data-v="${s}">${label[s]}</button>`).join("")}</div></div>`).join("")}</div>`).join("")}
  <button class="btn-primary btn-big" id="next">${editing ? "Enregistrer" : "Continuer"}</button>${editing ? '<button class="btn-ghost" id="back">Annuler</button>' : ""}`);
  app.querySelectorAll(".tri").forEach((tri) => tri.querySelectorAll("button").forEach((b) => (b.onclick = () => {
    st[tri.dataset.id] = b.dataset.v;
    tri.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b));
  })));
  document.getElementById("next").onclick = () => {
    if (editing) {
      for (const [id, s] of Object.entries(st)) {
        const n = state.notions[id];
        if (n.status === "nonvu" && s !== "nonvu") Object.assign(n, { m: 0.4, box: 0, due: day() });
        n.status = s;
      }
      save(); screenHome();
    } else {
      state = Engine.newState({ system: draft.system, grade: draft.grade, track: draft.track, minutes: draft.minutes });
      Engine.initNotions(state, st);
      save(); startPlacement();
    }
  };
  if (editing) document.getElementById("back").onclick = screenHome;
}

// ---------------- Positionnement ----------------
function startPlacement() {
  const plan = Engine.placementPlan(state);
  let i = 0;
  const next = () => {
    if (i >= plan.length) { state.placed = true; save(); return screenPlacementDone(); }
    const id = plan[i], q = Engine.make(state, id, Math.min(2, difficultyCap(state.profile)));
    renderQuestion(q, {
      eyebrow: "Étape 3 sur 3 · positionnement " + (i + 1) + "/" + plan.length, single: true,
      onDone: (res) => { Engine.placementResult(state, id, res.solved ? true : res.dontKnow ? null : false, q.d); save(); },
      onNext: () => { i++; next(); },
    });
  };
  next();
}

function screenPlacementDone() {
  const lv = Engine.themeLevels(state);
  h(`${brand}<h2>Ton <span class="mark">point de départ</span></h2>
  <div class="card">${eloBlock()}</div>
  <div class="card flat"><h3>Par thème</h3><div class="bars">${themeBars(lv)}</div>
  <p class="small muted">Ton niveau va se préciser au fil des séances : les 20 premières questions servent de calibrage.</p></div>
  <button class="btn-primary btn-big" id="go">Voir ma première séance</button>`);
  document.getElementById("go").onclick = screenHome;
}

// ---------------- Accueil ----------------
function eloBlock() {
  const e = state.elo, prev = e.log.length > 1 ? e.log[e.log.length - 2][1] : null, d = prev === null ? 0 : e.r - prev;
  const pts = e.log.slice(-30).map((x) => x[1]);
  let spark = "";
  if (pts.length > 1) {
    const lo = Math.min(...pts) - 10, hi = Math.max(...pts) + 10, X = (i) => (i / (pts.length - 1)) * 300, Y = (v) => 52 - ((v - lo) / (hi - lo)) * 48;
    const line = pts.map((v, i) => (i ? "L" : "M") + X(i).toFixed(1) + "," + Y(v).toFixed(1)).join(" ");
    spark = `<svg class="spark" viewBox="0 0 300 56" preserveAspectRatio="none"><path class="a" d="${line} L300,56 L0,56 Z"/><path class="l" d="${line}"/><circle cx="300" cy="${Y(pts[pts.length - 1]).toFixed(1)}" r="3.5"/></svg>`;
  }
  return `<div class="elo"><div><div class="eyebrow">Mathélo ${Engine.isProvisional(state) ? '<span class="badge">provisoire</span>' : ""}</div><div class="num">${e.r}</div>
  ${d ? `<div class="delta ${d > 0 ? "up" : "down"}">${d > 0 ? "▲ +" : "▼ "}${d} depuis hier</div>` : ""}</div>
  <div class="stack"><b>${eloLabel(state.profile, e.r)}</b>${spark}</div></div>`;
}
function themeBars(lv) {
  return Object.entries(lv).map(([th, m]) => `<div class="bar"><span>${THEMES[th]}</span><span class="track"><i style="width:${Math.round(m * 100)}%"></i></span></div>`).join("");
}

function screenHome() {
  if (!state) return screenWelcome();
  const today = day(), done = state.history.find((x) => x.date === today);
  const s = state.streak, alive = s.last === today || s.last === addDays(today, -1), wp = Engine.weeklyProblem(state);
  h(`<div class="spread">${brand}<span class="small muted">${SYSTEMS[state.profile.system].label} · ${gradeName(state.profile)}</span></div>
  <div class="card flat streak"><span class="flame" aria-hidden="true">${alive && s.count ? "🔥" : "✏️"}</span><div><b>${alive ? s.count : 0} ${(alive ? s.count : 0) > 1 ? "jours" : "jour"}</b> <span class="muted">d'affilée</span><div class="small muted">${done ? "Séance du jour faite : " + done.n + " question" + (done.n > 1 ? "s" : "") + ". Tu peux en refaire une." : "Ta séance du jour t'attend."}</div></div></div>
  <div class="card">${eloBlock()}</div>
  <div class="card flat stack"><h3>Temps aujourd'hui</h3><div class="timepick" id="time">${[1, 2, 5, 10].map((m) => `<button aria-pressed="${m === state.profile.minutes}" data-v="${m}"><b>${m}</b><small>min · ${QUESTIONS_FOR[m]} q.</small></button>`).join("")}</div>
  <button class="btn-primary btn-big" id="go">${done ? "Encore une séance" : "Ma question du jour"}</button></div>
  ${Engine.prepActive(state) ? (() => { const left = Math.round((new Date(state.prep.date) - new Date(today)) / 864e5); return `<div class="card flat stack"><div class="eyebrow">Je prépare mon test</div><h3>${left === 0 ? "Test aujourd'hui" : left === 1 ? "Test demain" : "Test dans " + left + " jours"} · ${state.prep.ids.length} notion${state.prep.ids.length > 1 ? "s" : ""}</h3><p class="small muted">${state.prep.ids.map((id) => NOTIONS.find((n) => n.id === id).label).join(" · ")}</p><div class="row"><button class="btn-primary" id="prepgo">Séance de révision</button><button class="btn-ghost" id="prepedit">Modifier</button></div></div>`; })() : ""}
  ${wp ? `<div class="card flat stack"><div class="eyebrow">Problème de la semaine</div><h3>${NOTIONS.find((n) => n.id === wp).label}</h3><p class="small muted">Un problème en plusieurs étapes, avec indices. Facultatif, et il rapporte gros.</p><button id="wp">Relever le défi</button></div>` : ""}
  <div class="card flat"><h3>Mes thèmes</h3><div class="bars">${themeBars(Engine.themeLevels(state))}</div></div>
  <div class="stack">${Engine.prepActive(state) ? "" : '<button id="prep">Je prépare un test</button>'}<button id="notions">J'ai vu une nouvelle notion en classe</button><button id="level">Changer de classe ou d'école</button>
  <div class="confirm" id="reset"><button class="btn-ghost" id="r1">Tout effacer</button></div></div>`);
  app.querySelectorAll("#time button").forEach((b) => (b.onclick = () => { state.profile.minutes = +b.dataset.v; save(); screenHome(); }));
  document.getElementById("go").onclick = startSession;
  if (wp) document.getElementById("wp").onclick = () => { session = { plan: [wp], i: 0, score: 0, answered: 0, start: Date.now(), elo0: state.elo.r, ids: new Set(), limit: 600, weekly: true }; nextQuestion(); };
  document.getElementById("notions").onclick = () => screenNotions(true);
  const byId = (x) => document.getElementById(x);
  if (byId("prep")) byId("prep").onclick = screenPrep;
  if (byId("prepedit")) byId("prepedit").onclick = screenPrep;
  if (byId("prepgo")) byId("prepgo").onclick = () => { session = { plan: Engine.planPrep(state), i: 0, score: 0, answered: 0, start: Date.now(), elo0: state.elo.r, ids: new Set(), limit: state.profile.minutes * 60, prep: true }; nextQuestion(); };
  document.getElementById("level").onclick = () => { draft = { ...state.profile }; screenLevel(); };
  document.getElementById("r1").onclick = () => {
    document.getElementById("reset").innerHTML = '<span class="small">Effacer ta progression et ton Mathélo ?</span><button id="r2">Oui, effacer</button><button class="btn-ghost" id="r3">Non</button>';
    document.getElementById("r2").onclick = () => { Store.clear(); state = null; screenWelcome(); };
    document.getElementById("r3").onclick = screenHome;
  };
}

// ---------------- Je prépare mon test ----------------
function screenPrep() {
  const cat = Engine.catalog(state.profile).filter((c) => state.notions[c.id] && state.notions[c.id].status !== "nonvu");
  const chosen = new Set(state.prep && Engine.prepActive(state) ? state.prep.ids : []);
  const groups = {};
  cat.forEach((c) => (groups[c.theme] = groups[c.theme] || []).push(c));
  const date = state.prep && Engine.prepActive(state) ? state.prep.date : addDays(day(), 7);
  h(`${brand}<h2>Je prépare <span class="mark">un test</span></h2>
  <p class="muted">Choisis les notions de ton test et sa date. Jusqu'à ce jour-là, tes séances porteront surtout sur elles, avec un problème pour finir.</p>
  <div class="card flat stack"><label for="pdate"><h3>Date du test</h3></label><input type="date" id="pdate" value="${date}" min="${day()}" class="datein"></div>
  ${Object.entries(groups).map(([th, list]) => `<div class="card flat"><h3>${THEMES[th]}</h3><div class="checks">${list.map((c) => `<label class="check"><input type="checkbox" value="${c.id}" ${chosen.has(c.id) ? "checked" : ""}> <span>${c.label}</span></label>`).join("")}</div></div>`).join("")}
  <p class="small muted" id="perr"></p>
  <button class="btn-primary btn-big" id="save">Enregistrer mon test</button>
  <div class="row"><button class="btn-ghost" id="back">Annuler</button>${chosen.size ? '<button class="btn-ghost" id="del">Supprimer ce test</button>' : ""}</div>`);
  document.getElementById("save").onclick = () => {
    const ids = [...app.querySelectorAll(".check input:checked")].map((i) => i.value), dt = document.getElementById("pdate").value;
    if (!ids.length) { document.getElementById("perr").textContent = "Coche au moins une notion."; return; }
    if (!dt || dt < day()) { document.getElementById("perr").textContent = "Choisis une date à partir d'aujourd'hui."; return; }
    state.prep = { ids, date: dt }; save(); screenHome();
  };
  document.getElementById("back").onclick = screenHome;
  const del = document.getElementById("del");
  if (del) del.onclick = () => { state.prep = null; save(); screenHome(); };
}

// ---------------- Mini-leçons ----------------
function lessonBody(id) {
  const L = LESSONS[id];
  if (!L) return "";
  return `<p>${L.intro}</p><div class="rule"><b>À retenir</b> · ${L.regle}</div>
  <div class="ex-list">${L.exemple.map((e) => `<div>${e}</div>`).join("")}</div>
  <div class="trap"><b>Piège</b> · ${L.piege}</div>`;
}
const lessonDetails = (id) => (LESSONS[id] ? `<details class="lesson"><summary>📖 Rappel de cours</summary><div class="stack">${lessonBody(id)}</div></details>` : "");
function screenLesson(id, cont) {
  const L = LESSONS[id];
  h(`${brand}<div class="eyebrow">Nouvelle notion · 30 secondes de cours</div>
  <div class="card pop lesson-card"><h2>${L.titre}</h2>${lessonBody(id)}</div>
  <button class="btn-primary btn-big" id="go">J'ai compris, à moi !</button>`);
  document.getElementById("go").onclick = cont;
}

// ---------------- Séance ----------------
let session = null;
function startSession() {
  const plan = Engine.planSession(state);
  session = { plan, i: 0, score: 0, answered: 0, start: Date.now(), elo0: state.elo.r, ids: new Set(), limit: state.profile.minutes * 60 };
  nextQuestion();
}
function nextQuestion(redo) {
  // Le temps est un repère, jamais une limite : la séance finit quand les questions prévues sont faites.
  if (!redo && session.i >= session.plan.length) return screenSummary();
  const raw = redo ? redo.id : session.plan[session.i], forceProb = String(raw).startsWith("PROB:"), id = forceProb ? raw.slice(5) : raw;
  const ns = state.notions[id];
  // Écran de leçon : seulement la première fois, et pour une notion en cours en classe ou encore fragile.
  if (!redo && LESSONS[id] && ns && !ns.lessonSeen && (ns.status === "encours" || ns.m < 0.4)) {
    state.notions[id].lessonSeen = true; save();
    return screenLesson(id, () => { session.lessonShown = id; nextQuestion(); });
  }
  const q = redo ? Engine.make(state, id, redo.d === 4 ? 4 : Math.max(1, redo.d - 1)) : Engine.make(state, id, session.weekly || forceProb ? 4 : undefined);
  renderQuestion(q, {
    eyebrow: (session.weekly ? "Problème de la semaine" : session.prep ? "Révision du test · " + (session.i + 1) + " sur " + session.plan.length : session.i === 0 && !redo ? "Question du jour" : "Question " + (session.i + 1) + " sur " + session.plan.length) + (redo ? " · nouvelles valeurs" : ""),
    onDone: (res) => {
      const sc = Engine.record(state, id, q.d, res.tries, res.solved, res.partial);
      res.delta = Engine.updateElo(state, id, q.d, sc);
      session.score += sc; session.answered++; session.ids.add(id);
      Engine.finishDay(state, 1, sc); save();
      return res.delta;
    },
    onNext: (wantRedo) => { if (wantRedo) return nextQuestion(q); session.i++; nextQuestion(); },
  });
}

// Clavier mathématique partagé : écrit dans le champ actif.
const KEYS = ["7", "8", "9", "/", "(", ")", "4", "5", "6", "*", "^", "√", "1", "2", "3", "-", "x", "π", "0", ",", "+", ";", "⌫", "⌨"];
const keypadHtml = () => `<div class="keypad" id="kp">${KEYS.map((k) => `<button type="button" class="${/[\d,]/.test(k) ? "" : "k-op"}" data-k="${k}">${k === "*" ? "×" : k}</button>`).join("")}</div>`;
function previewOf(inp, prev) {
  const v = inp.value.trim();
  if (!v) { prev.innerHTML = ""; return; }
  try {
    const t = Expr.parse(v), val = Expr.vars(t).size || t.t === "list" ? "" : Expr.evaluate(t);
    prev.innerHTML = "\\(" + Expr.tex(t) + "\\)" + (val !== "" && isFinite(val) ? `<span class="val">≈ ${String(+val.toPrecision(8)).replace(".", ",")}</span>` : "");
    typeset(prev);
  } catch (e) { prev.innerHTML = `<span class="err">${esc(e.message)}</span>`; }
}
function bindKeypad(getInput, after) {
  let mode = window.matchMedia("(pointer: fine)").matches ? "text" : "none";
  app.querySelectorAll("input.ans").forEach((i) => i.setAttribute("inputmode", mode));
  app.querySelectorAll("#kp button").forEach((b) => (b.onclick = () => {
    const inp = getInput(), k = b.dataset.k;
    if (!inp || inp.disabled) return;
    if (k === "⌨") { mode = mode === "none" ? "text" : "none"; app.querySelectorAll("input.ans").forEach((i) => i.setAttribute("inputmode", mode)); inp.blur(); inp.focus(); return; }
    const s = inp.selectionStart ?? inp.value.length, e = inp.selectionEnd ?? inp.value.length;
    if (k === "⌫") { const a = s === e ? Math.max(0, s - 1) : s; inp.value = inp.value.slice(0, a) + inp.value.slice(e); inp.setSelectionRange(a, a); }
    else { inp.value = inp.value.slice(0, s) + k + inp.value.slice(e); inp.setSelectionRange(s + k.length, s + k.length); }
    after(inp);
  }));
}

// Problème en plusieurs parties : 3 essais, indices progressifs (outil, puis calcul), score partiel.
function renderProblem(q, opt) {
  const notion = NOTIONS.find((n) => n.id === q.id);
  const code = q.code;
  let tries = 0, finished = false, active = null;
  const ok = q.parts.map(() => false);
  h(`<div class="spread">${brand}</div><div class="eyebrow">${opt.eyebrow}</div>
  <div class="card pop"><div class="qmeta"><span class="chip">Problème · ${notion.label}</span><span class="dots" title="difficulté"><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i></span></div>
  <div class="qtext">${q.q}</div>${q.fig ? `<div class="figwrap">${q.fig}</div>` : ""}
  ${lessonDetails(q.id)}
  ${q.parts.map((p, i) => `<div class="answer part" data-i="${i}"><label for="p${i}"><b>${p.label}</b> <span class="mk" id="mk${i}"></span></label>
    <input id="p${i}" class="ans" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Ta réponse…"><div class="preview" id="pv${i}"></div></div>`).join("")}
  ${keypadHtml()}
  <div class="actions"><button class="btn-primary" id="check">Valider</button><button id="idk">Voir le corrigé</button></div>
  <div id="fb"></div></div>`);
  const fb = document.getElementById("fb");
  q.parts.forEach((p, i) => {
    const inp = document.getElementById("p" + i), pv = document.getElementById("pv" + i);
    inp.onfocus = () => (active = inp);
    let tm; inp.oninput = () => { clearTimeout(tm); tm = setTimeout(() => previewOf(inp, pv), 180); };
    inp.onkeydown = (e) => { if (e.key === "Enter") check(); };
  });
  active = document.getElementById("p0");
  bindKeypad(() => active, (inp) => previewOf(inp, document.getElementById("pv" + inp.id.slice(1))));
  const end = (giveUp) => {
    finished = true;
    app.querySelectorAll("input.ans, #kp button, #check, #idk").forEach((b) => (b.disabled = true));
    const frac = ok.filter(Boolean).length / q.parts.length, factor = [1, 1, 2 / 3, 1 / 3][Math.min(tries, 3)] || 1 / 3;
    const score = giveUp && tries === 0 ? 0 : Math.round(frac * factor * 100) / 100;
    if (frac === 1) burst();
    const delta = opt.onDone({ solved: frac === 1, tries, partial: score });
    const d = typeof delta === "number" && delta !== 0 ? `<span class="delta ${delta > 0 ? "up" : "down"}">Mathélo ${delta > 0 ? "+" : ""}${delta}</span>` : "";
    fb.innerHTML = `<div class="fb ${frac === 1 ? "ok" : "bad"} pop"><div class="spread"><b>${frac === 1 ? (tries === 1 ? "Problème résolu du premier coup !" : "Problème résolu.") : ok.filter(Boolean).length + " partie(s) juste(s) sur " + q.parts.length + "."}</b>${d}</div><div class="sol">${q.sol}</div></div>
      <div class="vote"><span>Ce problème était… <button data-v="up" aria-label="Bon problème">👍</button> <button data-v="down" aria-label="Problème à revoir">👎</button></span><span class="code">${code}</span></div>
      <div class="actions">${frac === 1 ? "" : '<button id="redo">Refaire avec d\'autres valeurs</button>'}<button class="btn-primary" id="nx">Continuer</button></div>`;
    typeset(fb);
    fb.querySelectorAll(".vote button").forEach((b) => (b.onclick = () => { vote(code, b.dataset.v); fb.querySelectorAll(".vote button").forEach((x) => x.setAttribute("aria-pressed", x === b)); }));
    document.getElementById("nx").onclick = () => opt.onNext(false);
    const r = document.getElementById("redo"); if (r) r.onclick = () => opt.onNext(true);
  };
  const check = () => {
    if (finished) return;
    let invalid = "";
    q.parts.forEach((p, i) => {
      if (ok[i]) return;
      const v = document.getElementById("p" + i).value.trim();
      if (!v) return;
      const r = checkAnswer(p.spec, v);
      if (r.status === "invalid" || r.status === "form") invalid = r.message || "Réponse illisible.";
      else ok[i] = r.status === "correct";
    });
    if (invalid) { fb.innerHTML = `<div class="fb hint pop"><b>Je n'arrive pas à lire une réponse</b><span>${esc(invalid)}</span></div>`; return; }
    tries++;
    q.parts.forEach((p, i) => {
      document.getElementById("mk" + i).textContent = ok[i] ? "✓" : "✗";
      if (ok[i]) document.getElementById("p" + i).disabled = true;
    });
    if (ok.every(Boolean) || tries >= 3) return end(false);
    fb.innerHTML = `<div class="fb hint pop"><b>${ok.some(Boolean) ? "En partie juste. Continue !" : "Pas encore."}</b><span><b>Indice ${tries}</b> · ${esc(q.hints[tries - 1])}</span></div>`;
  };
  document.getElementById("check").onclick = check;
  document.getElementById("idk").onclick = () => { if (!finished) end(true); };
}

// Affiche une question ; feedback Moodle : indice au 1er échec, corrigé au 2e.
function renderQuestion(q, opt) {
  if (q.parts) return renderProblem(q, opt);
  const notion = NOTIONS.find((n) => n.id === q.id);
  const code = q.code;
  let tries = 0, finished = false, inputMode = "none";
  h(`<div class="spread">${brand}${session && !opt.single ? '<span class="timer small muted" id="timer"></span>' : ""}</div>
  ${session && !opt.single && session.answered > 0 ? '<div class="spread"><span></span><button class="btn-ghost small" id="stop">Terminer ici</button></div>' : ""}
  <div class="eyebrow">${opt.eyebrow}</div>
  <div class="card pop"><div class="qmeta"><span class="chip">${notion.label}</span><span class="dots" title="difficulté">${[1, 2, 3].map((k) => `<i class="${k <= q.d ? "on" : ""}"></i>`).join("")}</span></div>
  <div class="qtext">${q.q}</div>${q.fig ? `<div class="figwrap">${q.fig}</div>` : ""}
  ${opt.single ? "" : lessonDetails(q.id)}
  <div class="answer"><input id="ans" autocomplete="off" autocapitalize="off" spellcheck="false" inputmode="none" placeholder="Ta réponse…" aria-label="Ta réponse">
  <div class="preview" id="prev"><span class="err">L'aperçu de ta réponse s'affiche ici.</span></div>
  <div class="keypad" id="kp">${["7", "8", "9", "/", "(", ")", "4", "5", "6", "*", "^", "√", "1", "2", "3", "-", "x", "π", "0", ",", "+", ";", "⌫", "⌨"].map((k) => `<button type="button" class="${/[\d,]/.test(k) ? "" : "k-op"}" data-k="${k}">${k === "*" ? "×" : k}</button>`).join("")}</div>
  <div class="actions"><button class="btn-primary" id="check">Valider</button><button id="idk">Je ne sais pas</button></div></div>
  <div id="fb"></div></div>`);
  const inp = document.getElementById("ans"), prev = document.getElementById("prev"), fb = document.getElementById("fb");
  if (window.matchMedia("(pointer: fine)").matches) { inp.setAttribute("inputmode", "text"); inputMode = "text"; inp.focus(); }
  let tm;
  const showPreview = () => {
    clearTimeout(tm);
    tm = setTimeout(() => {
      const v = inp.value.trim();
      if (!v) { prev.innerHTML = '<span class="err">L\'aperçu de ta réponse s\'affiche ici.</span>'; return; }
      try {
        const t = Expr.parse(v);
        const val = Expr.vars(t).size || t.t === "list" ? "" : Expr.evaluate(t);
        prev.innerHTML = "\\(" + Expr.tex(t) + "\\)" + (val !== "" && isFinite(val) ? `<span class="val">≈ ${String(+val.toPrecision(8)).replace(".", ",")}</span>` : "");
        typeset(prev);
      } catch (e) { prev.innerHTML = `<span class="err">${esc(e.message)}</span>`; }
    }, 180);
  };
  inp.oninput = showPreview;
  inp.onkeydown = (e) => { if (e.key === "Enter") check(); };
  app.querySelectorAll("#kp button").forEach((b) => (b.onclick = () => {
    const k = b.dataset.k;
    if (k === "⌨") { inputMode = inputMode === "none" ? "text" : "none"; inp.setAttribute("inputmode", inputMode); inp.blur(); inp.focus(); return; }
    const s = inp.selectionStart ?? inp.value.length, e = inp.selectionEnd ?? inp.value.length;
    if (k === "⌫") { const a = s === e ? Math.max(0, s - 1) : s; inp.value = inp.value.slice(0, a) + inp.value.slice(e); inp.setSelectionRange(a, a); }
    else { inp.value = inp.value.slice(0, s) + k + inp.value.slice(e); inp.setSelectionRange(s + k.length, s + k.length); }
    showPreview();
  }));
  const stopBtn = document.getElementById("stop");
  if (stopBtn) stopBtn.onclick = screenSummary;
  const timerEl = document.getElementById("timer");
  if (timerEl) {
    const tick = () => {
      if (!document.body.contains(timerEl)) return;
      const left = Math.max(0, session.limit - Math.floor((Date.now() - session.start) / 1000));
      timerEl.textContent = left ? "⏱ " + Math.floor(left / 60) + ":" + String(left % 60).padStart(2, "0") : "✓ " + Math.round(session.limit / 60) + " min atteintes, finis tranquillement";
      setTimeout(tick, 1000);
    };
    tick();
  }

  const end = (solved, dontKnow) => {
    finished = true;
    inp.disabled = true;
    app.querySelectorAll("#kp button, #check, #idk").forEach((b) => (b.disabled = true));
    const res = { solved, tries, dontKnow };
    if (solved) burst();
    const delta = opt.onDone(res);
    if (opt.single) {
      fb.innerHTML = `<div class="fb ${solved ? "ok" : "bad"} pop"><b>${solved ? pick(PRAISE) : dontKnow ? "D'accord, on s'en occupera." : "Noté."}</b>${solved ? "" : '<span class="sol">' + q.sol + "</span>"}</div><div class="actions"><button class="btn-primary" id="nx">Suivant</button></div>`;
      typeset(fb);
      document.getElementById("nx").onclick = () => opt.onNext();
      document.getElementById("nx").focus();
      return;
    }
    const d = typeof delta === "number" && delta !== 0 ? `<span class="delta ${delta > 0 ? "up" : "down"}">Mathélo ${delta > 0 ? "+" : ""}${delta}</span>` : "";
    fb.innerHTML = `<div class="fb ${solved ? "ok" : "bad"} pop"><div class="spread"><b>${solved ? (tries === 1 ? pick(PRAISE) : "Juste au deuxième essai.") : dontKnow ? "Voici la méthode." : "Pas cette fois."}</b>${d}</div>
      <div class="sol">${q.sol}</div></div>
      <div class="vote"><span>Cette question était… <button data-v="up" aria-label="Bonne question">👍</button> <button data-v="down" aria-label="Question à revoir">👎</button></span><span class="code" title="Code de la question">${code}</span></div>
      <div class="actions">${solved ? "" : '<button id="redo">Refaire avec d\'autres valeurs</button>'}<button class="btn-primary" id="nx">Continuer</button></div>`;
    typeset(fb);
    fb.querySelectorAll(".vote button").forEach((b) => (b.onclick = () => { vote(code, b.dataset.v); fb.querySelectorAll(".vote button").forEach((x) => x.setAttribute("aria-pressed", x === b)); }));
    document.getElementById("nx").onclick = () => opt.onNext(false);
    const r = document.getElementById("redo");
    if (r) r.onclick = () => opt.onNext(true);
    document.getElementById("nx").focus();
  };

  const check = () => {
    if (finished) return;
    const v = inp.value.trim();
    if (!v) return;
    const r = checkAnswer(q.spec, v);
    if (r.status === "correct") { tries++; return end(true); }
    if (r.status === "invalid" || r.status === "form") {
      fb.innerHTML = `<div class="fb hint pop"><b>${r.status === "form" ? "Presque" : "Je n'arrive pas à lire ta réponse"}</b><span>${esc(r.message || "")}</span></div>`;
      return;
    }
    tries++;
    if (opt.single || tries >= 2) return end(false);
    fb.innerHTML = `<div class="fb hint pop"><b>${r.status === "close" ? "Presque !" : "Pas encore. Réessaie !"}</b><span>${esc(r.message || "")}</span><span><b>Indice</b> · ${esc(q.hint)}</span></div>`;
    inp.select();
  };
  document.getElementById("check").onclick = check;
  document.getElementById("idk").onclick = () => { if (!finished) end(false, true); };
}

function burst() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const b = document.createElement("div");
  b.className = "burst";
  const syms = ["π", "√", "∞", "Σ", "x²", "½", "Δ", "∫", "≈", "%", "θ", "+"];
  const cx = window.innerWidth / 2, cy = window.innerHeight * 0.55;
  for (let i = 0; i < 22; i++) {
    const s = document.createElement("span"), a = Math.random() * Math.PI * 2, r = 120 + Math.random() * 180;
    s.textContent = syms[i % syms.length];
    s.style.left = cx + "px"; s.style.top = cy + "px"; s.style.fontSize = 16 + Math.random() * 18 + "px";
    s.style.setProperty("--dx", Math.cos(a) * r + "px"); s.style.setProperty("--dy", Math.sin(a) * r - 80 + "px"); s.style.setProperty("--r", (Math.random() * 120 - 60) + "deg");
    b.appendChild(s);
  }
  document.body.appendChild(b);
  setTimeout(() => b.remove(), 1000);
}

function vote(code, v) {
  try {
    state.votes = state.votes || {};
    state.votes[code] = { v, date: day() };
    save();
    if (VOTE_ENDPOINT) fetch(VOTE_ENDPOINT, { method: "POST", mode: "no-cors", body: JSON.stringify({ code, vote: v, date: day() }) }).catch(() => {});
  } catch (e) {}
}

function screenSummary() {
  const n = session.answered, sc = session.score, d = state.elo.r - session.elo0;
  h(`${brand}<h2>${sc >= n * 0.8 ? "Excellente séance !" : sc >= n * 0.5 ? "Bonne séance." : "Séance faite : c'est en pratiquant qu'on progresse."}</h2>
  <div class="card flat streak"><span class="flame">🔥</span><div><b>${state.streak.count} ${state.streak.count > 1 ? "jours" : "jour"}</b> <span class="muted">d'affilée</span><div class="small muted">À demain pour ta question du jour.</div></div></div>
  <div class="card stack"><div class="spread"><span>Score</span><b>${String(sc).replace(".", ",")} / ${n}</b></div>
  <div class="spread"><span>Mathélo</span><b>${state.elo.r} <span class="delta ${d >= 0 ? "up" : "down"}">${d >= 0 ? "+" : ""}${d}</span></b></div>
  <div class="small muted">Notions travaillées : ${[...session.ids].map((id) => NOTIONS.find((x) => x.id === id).label).join(" · ")}</div></div>
  <button class="btn-primary btn-big" id="home">Retour à l'accueil</button>`);
  document.getElementById("home").onclick = screenHome;
}

// Consultation d'une question par son code : adresse …/#q-eq2disc-2-k3f (rien n'est enregistré).
function showCode() {
  const m = /^#q-(.+)$/.exec(location.hash);
  if (!m) return false;
  const q = Engine.fromCode(m[1]);
  if (!q) { h(`${brand}<div class="card flat"><h3>Code inconnu</h3><p class="muted">« ${esc(m[1])} » ne correspond à aucune question.</p></div>`); return true; }
  const back = () => { history.replaceState(null, "", location.pathname); state && state.placed ? screenHome() : screenWelcome(); };
  renderQuestion(q, { eyebrow: "Question " + q.code + " (consultation)", onDone: () => 0, onNext: back });
  return true;
}
window.addEventListener("hashchange", showCode);

// Application installable (hors claude.ai) : cache hors ligne.
if ("serviceWorker" in navigator && location.protocol === "https:" && !/claude/.test(location.hostname)) navigator.serviceWorker.register("sw.js").catch(() => {});

// Démarrage
if (!showCode()) { if (state && state.placed) screenHome(); else { state = null; screenWelcome(); } }
