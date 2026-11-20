// Interface : entrée (niveau, positionnement), accueil, séance, bilan, compétences.
// Point de collecte des votes 👍 / 👎 : laisser vide tant qu'aucun n'est configuré (votes gardés sur l'appareil).
const VOTE_ENDPOINT = "https://script.google.com/macros/s/AKfycbym3jQKGDc1RrOsR7gqEVGIeAbBF0cML8VEDYtQfaOmO0743jRcmeHSQ-WglFVCb-dd/exec";

const app = document.getElementById("app");
let state = Store.load();
if (state && state.profile && !SYSTEMS[state.profile.system]) state = null; // système masqué (France) : on repart de zéro
// Voie MP gardée en revenant au CO (bug 14.11 : « 9e MP » sans critères de divisibilité, nombres premiers ni PGDC) : la voie n'existe qu'au sec. II.
if (state && state.profile && state.profile.track === "mp" && state.profile.grade < 12) { state.profile.track = "college"; Store.save(state); }
if (state && state.profile && state.notions && Object.keys(state.notions).length && Engine.migrate(state)) Store.save(state);
const save = () => Store.save(state);
// Barre d'onglets du bas (19.11 : visible partout, même pendant une activité, pour pouvoir interrompre).
const navTabs = (cur, dots = {}) => `<nav class="tabs" aria-label="Sections"><div class="tabs-inner" role="tablist">${HOME_TABS.map(([id, label, ic]) => `<button class="tab" role="tab" data-tab="${id}" aria-selected="${id === cur}"><span class="tab-ic"><svg viewBox="0 0 24 24">${ic}</svg>${dots[id] && id !== cur ? '<i class="tab-dot"></i>' : ""}</span>${label}</button>`).join("")}</div></nav>`;
const addTabs = () => {
  if (typeof state === "undefined" || !state || !state.placed || app.querySelector("nav.tabs")) return;
  app.insertAdjacentHTML("beforeend", navTabs(null)); app.classList.add("has-tabs");
  app.querySelectorAll("nav.tabs .tab").forEach((b) => (b.onclick = () => {
    const busy = typeof session !== "undefined" && session && session.i < session.plan.length && session.answered > 0;
    if (busy && !confirm("Interrompre l'activité en cours ?")) return;
    homeTab = b.dataset.tab; screenHome();
  }));
};
// Commentaire depuis n'importe quel écran (20.11, demande de l'auteur) : bouton 💬 fixe ; le commentaire part avec le
// code de la question affichée, sinon le titre de l'écran (« page-… »).
// pageQ (20.11) : code de la question ou de la leçon affichée, connu dès l'affichage (le code visible n'apparaît
// qu'avec la correction : avant, le commentaire partait sans la question).
var pageQ = null;
function pageCode() {
  if (pageQ) return pageQ;
  const q = app.querySelector(".code"), t = app.querySelector("h2") || app.querySelector(".eyebrow");
  if (q && q.textContent.trim()) return q.textContent.trim();
  return "page-" + ((t && t.textContent) || "accueil").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
}
function addFab() {
  if (document.getElementById("fabc")) return;
  document.body.insertAdjacentHTML("beforeend", `<button type="button" id="fabc" class="fab-cmt" aria-label="Envoyer un commentaire sur cette page">💬</button>
  <div id="fabs" class="fab-sheet" hidden><div class="card stack"><div class="spread"><b>Un commentaire sur cette page ?</b><button type="button" class="btn-ghost small" id="fabx" aria-label="Fermer">✕</button></div>
  <textarea id="fabt" maxlength="500" rows="4" placeholder="Une erreur, une idée, une remarque générale… (n'écris pas ton nom)"></textarea>
  <div class="spread"><span class="small muted" id="fabo"></span><button type="button" class="btn-primary" id="fabg">Envoyer</button></div></div></div>`);
  const sheet = document.getElementById("fabs"), ta = document.getElementById("fabt"), ok = document.getElementById("fabo");
  document.getElementById("fabc").onclick = () => { sheet.hidden = !sheet.hidden; ok.textContent = ""; if (!sheet.hidden) ta.focus(); };
  document.getElementById("fabx").onclick = () => (sheet.hidden = true);
  document.getElementById("fabg").onclick = () => {
    const text = ta.value.trim(); if (!text) { ok.textContent = "Écris d'abord ton commentaire."; return; }
    comment(pageCode(), text); ta.value = ""; ok.textContent = "Merci ! C'est envoyé."; setTimeout(() => (sheet.hidden = true), 1200);
  };
}
// Bouton 💬 dans l'en-tête, à droite du titre (20.11 : flottant, il recouvrait une touche du clavier de l'app) ;
// flottant seulement sur un écran sans en-tête. La fenêtre du commentaire s'ouvre alors en haut.
function placeFab() {
  const b = document.getElementById("fabc"), sh = document.getElementById("fabs"), br = app.querySelector(".brand");
  if (!b) return;
  if (br) br.appendChild(b); else document.body.appendChild(b);
  if (sh) sh.classList.toggle("top", !!br);
}
const h = (html) => { sigClose(); pageQ = null; app.classList.remove("has-tabs"); app.innerHTML = html; addTabs(); addFab(); const sh = document.getElementById("fabs"); if (sh) sh.hidden = true; placeFab(); typeset(app); window.scrollTo(0, 0); bindLessonFeedback(app); bindLessonOpen(app); if (typeof bindDyn !== "undefined") bindDyn(app); };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
// Textes de l'app (indices, erreurs typiques) : échappés, sauf <b>, <i>, <br> (16.11 : les balises s'affichaient telles quelles).
const escT = (s) => esc(s).replace(/&lt;(\/?)(b|i|br)&gt;/g, "<$1$2>");
const gradeName = (p) => (SYSTEMS[p.system].grades.find(([g]) => g === p.grade) || [0, ""])[1];
const brand = '<div class="brand"><b>5 minutes de maths</b><span>par jour</span></div>';
const PRAISE = ["Juste !", "Bien vu !", "Exact !", "Parfait.", "C'est ça !", "Bravo !"];
const pick = (a) => a[Math.floor(Math.random() * a.length)];

// Signe de division (14.11, décision de l'utilisateur) : « : » devient ÷ dans toutes les formules, au rendu.
// Restent « : » : le texte \text{…}, la ponctuation suivie de \; ou ;, et ce qui n'a pas d'espaces (échelle 1\,:\,200, f\colon).
window.divSign = (t) => t.replace(/(\\text\{[^}]*\})|( : (?!\\;|;))/g, (m, txt) => txt || " \\div ");
function typeset(el) {
  const go = () => window.MathJax && MathJax.typesetPromise ? MathJax.typesetPromise([el]).catch(() => {}) : setTimeout(go, 150);
  go();
}
const hash = (s) => { let x = 0; for (const c of s) x = (x * 31 + c.charCodeAt(0)) >>> 0; return x.toString(36).slice(-4); };

// ---------------- Entrée ----------------
let draft = { system: "CH", grade: 11, track: "college", minutes: 5 };

// Accueil (18.11) : un exemple JOUABLE (réponse, correction, pas à pas) qui change de sujet à chaque visite,
// tiré parmi des notions au point (chapitres repris au standard) — pour goûter l'app avant de choisir son niveau.
const DEMO_POOL = ["pyth", "fracadd", "fracmul", "eq1", "sci", "vitesse", "thales", "angles", "puiss", "reduire", "tabval", "volcone", "ucomp", "prio", "cercthales"];
function demoQuestion() {
  for (let k = 0; k < 30; k++) {
    const id = DEMO_POOL[Math.floor(Math.random() * DEMO_POOL.length)];
    if (!GEN[id]) continue;
    let q; try { q = Engine.build(id, Math.random() < 0.6 ? 1 : 2, 1 + Math.floor(Math.random() * 1e6)); } catch (e) { continue; }
    if (q && q.spec && q.spec.kind === "value" && !q.parts && q.guide && q.guide.length) return q;
  }
  return Engine.build("pyth", 1, 7);
}
function screenWelcome() {
  const q = demoQuestion(), n = NOTIONS.find((x) => x.id === q.id), fine = window.matchMedia("(pointer: fine)").matches;
  h(`${brand}
  <div class="stack"><h1>Chaque jour, <span class="mark">5 minutes</span> de maths, à ton niveau.</h1>
  <p class="muted">Une question du jour choisie pour toi, une figure, une correction immédiate. Ton Mathélo monte quand tu progresses. Pas de compte : tout reste sur ton téléphone.</p></div>
  <div class="card tilt" id="demo"><div class="qmeta"><span class="chip">Essaie · ${n ? n.label : "exemple"}</span><span class="dots"><i class="on"></i><i></i><i></i></span></div>
  <div class="qtext">${q.q}</div>${q.fig ? `<div class="figwrap">${q.fig}</div>` : ""}
  <div class="answer"><input class="ans" id="dans" inputmode="${fine ? "text" : "none"}" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Ta réponse…" aria-label="Ta réponse">
  <div class="preview" id="dprev"></div>${keypadHtml(q.spec.kind === "value" && !q.spec.sci && (Math.abs(q.spec.value) >= 1e-3 || q.spec.value === 0) && Math.abs(q.spec.value) < 1e7 ? { ...q.spec, final: true } : q.spec)}<div class="actions"><button class="btn-primary" id="dok">Vérifier</button></div></div>
  <div id="dfb"></div>
  <p class="small muted">Un autre sujet à chaque visite. Tape ta réponse comme tu veux : fractions, racines, π… le calculateur comprend.</p></div>
  <button class="btn-primary btn-big" id="go">Commencer</button>
  <button class="btn-ghost" id="restore">J'ai déjà un code de sauvegarde</button>
  <button class="btn-ghost small" id="privacy">🔒 Ce que l'app envoie</button>`);
  const inp = document.getElementById("dans"), prev = document.getElementById("dprev"), fb = document.getElementById("dfb");
  const show = () => previewOf(inp, prev, q.spec);
  inp.oninput = show;
  bindKeypad(() => inp, show);
  const done = (ok, msg) => {
    inp.disabled = true; const kp = document.getElementById("kp"); if (kp) kp.remove(); document.getElementById("dok").remove(); prev.remove();
    fb.innerHTML = `<div class="fb ${ok ? "ok" : "hint"} pop">${ok ? "✓ Juste !" : msg}</div><div class="sol">${q.sol}</div>
      <p class="small">${ok ? "C'est ça, chaque jour : une question adaptée, puis la suivante un peu plus loin." : "Chaque jour, l'app t'aide comme ça, étape par étape."} <b>Commencer</b> pour choisir ton niveau.</p>`;
    typeset(fb);
  };
  const go = () => {
    const v = inp.value.trim(); if (!v) return;
    const r = checkAnswer(q.spec, v);
    if (r.status === "correct") { done(true); return; }
    if (r.status === "invalid" || r.status === "form") { fb.innerHTML = `<div class="fb hint pop">${escT(r.message || "Écris un nombre.")}</div>`; typeset(fb); return; }
    const d = diagnose(q, v);
    fb.innerHTML = `<div class="fb hint pop">${d ? escT(d) : r.status === "close" ? escT(r.message || "Presque !") : "Pas tout à fait."}</div>
      <div class="actions"><button class="btn-primary" id="dguide">On le fait ensemble</button><button class="btn-ghost" id="dsol">Voir la solution</button></div><div id="dgbox"></div>`;
    typeset(fb);
    document.getElementById("dsol").onclick = () => done(false, "Voici la solution :");
    document.getElementById("dguide").onclick = () => { inp.disabled = true; const kp = document.getElementById("kp"); if (kp) kp.remove(); document.getElementById("dok").remove(); prev.remove();
      fb.querySelector(".actions").remove(); runGuide(q, document.getElementById("dgbox"), () => {}); };
  };
  document.getElementById("dok").onclick = go;
  inp.onkeydown = (e) => { if (e.key === "Enter") go(); };
  document.getElementById("go").onclick = screenLevel;
  document.getElementById("privacy").onclick = () => screenPrivacy(screenWelcome);
  document.getElementById("restore").onclick = () => screenRestore();
}

function screenLevel() {
  const sys = SYSTEMS[draft.system];
  if (!sys.grades.some(([g]) => g === draft.grade)) draft.grade = sys.grades[sys.grades.length - 2][0];
  const sec2 = draft.system === "CH" && draft.grade >= 12;
  h(`${brand}<div class="eyebrow">Étape 1 sur 2</div><h2>Où en es-tu ?</h2>
  <div class="card flat stack">${Object.keys(SYSTEMS).length > 1 ? `<h3>Ton école</h3><div class="seg" id="sys">${Object.entries(SYSTEMS).map(([k, v]) => `<button aria-pressed="${k === draft.system}" data-v="${k}">${v.label}</button>`).join("")}</div>` : ""}
  <h3>Ta classe cette année</h3><div class="seg" id="grade">${sys.grades.map(([g, n]) => `<button aria-pressed="${g === draft.grade}" data-v="${g}">${n}</button>`).join("")}</div>
  ${sec2 ? `<h3>Ta voie</h3><div class="seg" id="track"><button aria-pressed="${draft.track === "college"}" data-v="college">Collège (maturité gymnasiale)</button><button aria-pressed="${draft.track === "mp"}" data-v="mp">Maturité professionnelle</button></div>` : ""}</div>
  <p class="small muted">Chaque jour, l'app te propose un programme différent (un défi, une série d'automatismes, des applications…), équilibré sur la semaine. Pas de chrono : l'important, c'est de venir chaque jour.</p>
  <button class="btn-primary btn-big" id="next">Continuer</button>`);
  const bind = (id, key, num) => app.querySelectorAll("#" + id + " button").forEach((b) => (b.onclick = () => { draft[key] = num ? +b.dataset.v : b.dataset.v; screenLevel(); }));
  bind("sys", "system"); bind("grade", "grade", true); bind("track", "track");
  // Plus de questionnaire sur les notions : celles de l'année s'ouvrent dans l'ordre du référentiel.
  document.getElementById("next").onclick = () => {
    const keep = state && state.comps;
    state = Engine.newState({ system: draft.system, grade: draft.grade, track: draft.system === "CH" && draft.grade >= 12 ? draft.track : "college", minutes: draft.minutes });
    if (keep) state.comps = keep; // changement de classe : les notes des compétences restent
    Engine.autoInit(state);
    save(); startPlacement();
  };
}

// ---------------- Positionnement ----------------
function startPlacement() {
  const plan = Engine.placementPlan(state);
  let i = 0;
  const next = () => {
    if (i >= plan.length) { state.placed = true; save(); return screenPlacementDone(); }
    const id = plan[i], q = Engine.make(state, id, Math.min(2, difficultyCap(state.profile)));
    renderQuestion(q, {
      eyebrow: "Étape 2 sur 2 · positionnement " + (i + 1) + "/" + plan.length, single: true, track: "positionnement",
      onDone: (res) => { Engine.placementResult(state, id, res.solved ? true : res.dontKnow ? null : false, q.d); save(); },
      onNext: () => { i++; next(); },
      onNotYet: () => { Engine.notYet(state, id); save(); toast("Noté : cette notion reviendra plus tard."); i++; next(); },
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
  <div class="card flat"><p class="small muted">Les notions de ton année s'ajoutent au fur et à mesure, dans l'ordre du programme. Si une question porte sur quelque chose que tu n'as pas encore vu en classe, touche « Pas encore vu en classe » : elle reviendra plus tard, sans pénalité.</p></div>
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
  <div class="stack">${spark}</div></div>`;
}
// Bandeau Mathélo (14.11, demande de l'utilisateur : « on a envie de le voir monter ») : sur tous les cadres de l'accueil.
function eloBanner() {
  const e = state.elo, prev = e.log.length > 1 ? e.log[e.log.length - 2][1] : null, d = prev === null ? 0 : e.r - prev;
  const pts = e.log.slice(-30).map((x) => x[1]);
  let spark = "";
  if (pts.length > 1) {
    const lo = Math.min(...pts) - 10, hi = Math.max(...pts) + 10, X = (i) => (i / (pts.length - 1)) * 200, Y = (v) => 30 - ((v - lo) / (hi - lo)) * 26;
    const line = pts.map((v, i) => (i ? "L" : "M") + X(i).toFixed(1) + "," + Y(v).toFixed(1)).join(" ");
    spark = `<svg class="spark" viewBox="0 0 200 32" preserveAspectRatio="none"><path class="a" d="${line} L200,32 L0,32 Z"/><path class="l" d="${line}"/><circle cx="200" cy="${Y(pts[pts.length - 1]).toFixed(1)}" r="3"/></svg>`;
  }
  return `<button type="button" class="elo-band" id="eloband" aria-label="Mathélo ${e.r}, voir mes progrès">
    <span class="eb-l"><span class="eyebrow">Mathélo${Engine.isProvisional(state) ? " · provisoire" : ""}</span><span class="eb-n"><b class="num">${e.r}</b>${d ? `<span class="delta ${d > 0 ? "up" : "down"}">${d > 0 ? "▲ +" : "▼ "}${d}</span>` : ""}</span></span>
    <span class="eb-r">${spark || '<span class="small muted">Ta courbe apparaît après ta 2e séance.</span>'}</span></button>`;
}
function themeBars(lv) {
  return Object.entries(lv).map(([th, m]) => `<div class="bar"><span>${Engine.themeLabel(th, state.profile)}</span><span class="track"><i style="width:${Math.round(m * 100)}%"></i></span></div>`).join("");
}

// Accueil en cadres (14.11, principe du projet Etalon) : une barre d'onglets fixe en bas, un cadre par sujet
// qui tient sur un écran, passage d'un cadre à l'autre en glissant le doigt. Réglages derrière la roue dentée.
let homeTab = "today";
const weekKey = () => { const d = new Date(); return d.getFullYear() + "-" + Math.floor((d - new Date(d.getFullYear(), 0, 1)) / 6048e5); };
const HOME_TABS = [
  // Calendrier avec le jour pointé (14.11 : l'ancien soleil à rayons rappelait, d'un coup d'œil, l'étoile de David).
  ["today", "Aujourd'hui", '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/><circle cx="12" cy="15.2" r="1.8" fill="currentColor" stroke="none"/>'],
  ["prob", "Problème", '<path d="M12 2l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17l-5.9 3 1.2-6.5L2.5 8.9 9.1 8z"/>'],
  ["test", "Test", '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>'],
  ["prog", "Progrès", '<path d="M4 20V10M10 20V5M16 20v-7M22 20H2"/>'],
];
function screenHome() {
  if (!state) return screenWelcome();
  Badges.check(state);
  const today = day(), done = state.history.find((x) => x.date === today);
  const s = state.streak, alive = s.last === today || s.last === addDays(today, -1), wp = Engine.weeklyProblem(state), fmt = Engine.todayFormat(state);
  const wpDone = wp && state.weeklyDone === weekKey(), prep = Engine.prepActive(state);
  const left = prep ? Math.round((new Date(state.prep.date) - new Date(today)) / 864e5) : null;
  const dots = { prob: !!wp && !wpDone, test: prep && left <= 3, prog: (state.badgesNew || []).length > 0 };
  save();
  const panels = {
    today: () => `<div class="card stack mode-school"><div class="eyebrow">🎒 Mode scolaire${done ? " · séance faite, tu peux en refaire une" : ""}</div>
      <h2>Ton chapitre, au rythme de la classe</h2>
      <p class="muted">Tes séances suivent ce que tu fais en classe : le chapitre en cours, des révisions au bon moment pour ne rien oublier, et la préparation de tes tests.</p>
      <div class="fmt-box stack"><div class="spread"><span class="eyebrow">Aujourd'hui</span><button class="btn-ghost small" id="other">🔁 Changer de format</button></div>
        <h3>${FORMATS[fmt].label}</h3><p class="small muted">${FORMATS[fmt].text} Le format change d'un jour à l'autre.</p></div>
      <button class="btn-primary btn-big" id="go">${done ? "Encore une séance" : "C'est parti"}</button>${nowCard()}</div>
      ${freeCard()}`,
    prob: () => !wp ? `<div class="card flat stack"><div class="eyebrow">Problème de la semaine</div><h3>Pas encore de problème pour toi</h3><p class="small muted">Les problèmes arrivent avec les notions que tu as déjà travaillées. Fais quelques séances !</p></div>`
      : `<div class="card stack"><div class="eyebrow">Problème de la semaine${wpDone ? " · fait ✓" : ""}</div><h2>${NOTIONS.find((n) => n.id === wp).label}</h2>
        <p class="muted">Un problème en plusieurs étapes, avec des indices si tu bloques. Facultatif, et il rapporte gros.</p>
        <button class="${wpDone ? "" : "btn-primary btn-big"}" id="wp">${wpDone ? "Le refaire" : "Relever le défi"}</button>
        <p class="small muted">${wpDone ? "Bravo ! Un nouveau problème arrive la semaine prochaine." : "Un nouveau problème chaque semaine."}</p></div>`,
    test: () => prep ? `<div class="card stack"><div class="eyebrow">Je prépare mon test</div><h2>${left === 0 ? "Test aujourd'hui" : left === 1 ? "Test demain" : "Test dans " + left + " jours"}</h2>
        <p class="small muted">${state.prep.ids.length} notion${state.prep.ids.length > 1 ? "s" : ""} : ${state.prep.ids.map((id) => NOTIONS.find((n) => n.id === id).label).join(" · ")}</p>
        <button class="btn-primary btn-big" id="prepgo">Séance de révision</button>
        <button id="mock">📝 Sujet de préparation (avec corrigé)</button>${state.mock && state.mock.done && state.mock.ids.join() === state.prep.ids.join() ? `<p class="small muted">Dernier sujet de préparation : ${state.mock.done.n ? state.mock.done.juste + " question" + (state.mock.done.juste > 1 ? "s" : "") + " juste" + (state.mock.done.juste > 1 ? "s" : "") + " sur " + state.mock.done.n : "fait"}.</p>` : ""}
        <button class="btn-ghost" id="prepedit">Modifier le test</button></div>`
      : `<div class="card stack"><div class="eyebrow">Je prépare un test</div><h2>Un test approche ?</h2>
        <p class="muted">Dis-moi sa date et les notions : chaque jour, l'app te fait réviser juste ce qu'il faut, jusqu'au jour J. Tu pourras aussi t'entraîner sur un sujet de préparation, avec son corrigé.</p>
        <button class="btn-primary btn-big" id="prep">Je prépare un test</button></div>`,
    prog: () => `${newBadgesCard()}${themeMapCard()}${compsCard()}`,
  };
  if (!panels[homeTab]) homeTab = "today";
  h(`<div class="spread home-head">${brand}<span class="row" style="gap:6px"><span class="streak-chip" title="jours d'affilée">${alive && s.count ? "🔥" : "✏️"} <b>${alive ? s.count : 0}</b> j</span><span class="small muted">${gradeName(state.profile)}</span><button class="btn-ghost gear" id="settings" aria-label="Réglages">⚙️</button></span></div>
  ${eloBanner()}
  <div class="home-panel" data-tab="${homeTab}">${panels[homeTab]()}</div>
  ${navTabs(homeTab, dots)}`);
  app.classList.add("has-tabs");
  const byId = (x) => document.getElementById(x), on = (x, f) => { if (byId(x)) byId(x).onclick = f; };
  app.querySelectorAll(".tab").forEach((b) => (b.onclick = () => { homeTab = b.dataset.tab; screenHome(); }));
  on("settings", screenSettings);
  on("eloband", () => { if (homeTab !== "prog") { homeTab = "prog"; screenHome(); } });
  on("go", startSession);
  on("freego", startFree);
  on("other", () => { Engine.otherFormat(state); save(); screenHome(); });
  if (homeTab === "today") bindNowCard();
  on("wp", () => { session = { plan: [wp], i: 0, score: 0, answered: 0, start: Date.now(), elo0: state.elo.r, ids: new Set(), weekly: true }; nextQuestion(); });
  on("comps", screenComps);
  on("prep", screenPrep); on("prepedit", screenPrep);
  if (typeof screenMock === "function") on("mock", screenMock);
  on("prepgo", () => { session = { plan: Engine.planPrep(state), i: 0, score: 0, answered: 0, start: Date.now(), elo0: state.elo.r, ids: new Set(), prep: true }; nextQuestion(); });
}
// Glisser à gauche / à droite sur l'accueil : cadre suivant / précédent (pas sur un curseur ou un champ).
(() => {
  let x0 = null, y0 = 0;
  app.addEventListener("touchstart", (e) => { x0 = !app.querySelector(".tabs") || e.target.closest("input, select, textarea, .seg, details, svg") ? null : e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  app.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
    if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx) * 0.7) return;
    const ids = HOME_TABS.map((t) => t[0]), k = ids.indexOf(homeTab) + (dx < 0 ? 1 : -1);
    if (k >= 0 && k < ids.length) { homeTab = ids[k]; screenHome(); }
  }, { passive: true });
})();
function screenSettings() {
  h(`${brand}<h2>Réglages</h2><div class="stack">
  <button id="backup">💾 Sauvegarder ou transférer ma progression</button><button id="level">Changer de classe ou d'école</button><button id="privacy">🔒 Ce que l'app envoie</button>
  <div class="confirm" id="reset"><button class="btn-ghost" id="r1">Tout effacer</button></div>
  <button class="btn-primary" id="back">Retour</button></div>`);
  document.getElementById("back").onclick = screenHome;
  document.getElementById("privacy").onclick = () => screenPrivacy(screenSettings);
  document.getElementById("backup").onclick = screenBackup;
  document.getElementById("level").onclick = () => { draft = { ...state.profile }; screenLevel(); };
  document.getElementById("r1").onclick = () => {
    document.getElementById("reset").innerHTML = '<span class="small">Effacer ta progression et ton Mathélo ?</span><button id="r2">Oui, effacer</button><button class="btn-ghost" id="r3">Non</button>';
    document.getElementById("r2").onclick = () => { Store.clear(); try { localStorage.removeItem("m2m-device"); localStorage.removeItem("m2m-ping"); } catch (e) {} state = null; screenWelcome(); };
    document.getElementById("r3").onclick = screenSettings;
  };
}

// ---------------- Mes compétences ----------------
const noteCls = (n) => (n === null ? "none" : n >= 5 ? "good" : n >= 4 ? "ok" : "low");
const noteTxt = (n) => (n === null ? "pas testé" : String(n).replace(".", ","));
function compStats(ids) {
  const all = ids.flatMap((id) => compsOf(id)), notes = all.map((c) => compNote((state.comps || {})[c.cid])).filter((x) => x !== null);
  return { total: all.length, tested: notes.length, avg: notes.length ? notes.reduce((a, b) => a + b, 0) / notes.length : null };
}
function compsCard() {
  const cur = Engine.catalog(state.profile).filter((c) => c.current).map((c) => c.id), st = compStats(cur);
  return `<div class="card flat stack"><div class="spread"><h3>Mes compétences</h3>${st.avg !== null ? `<span class="note ${noteCls(Math.round(st.avg * 2) / 2)}">${String(Math.round(st.avg * 10) / 10).replace(".", ",")}</span>` : ""}</div>
  <p class="small muted">${st.tested ? `${st.tested} compétence${st.tested > 1 ? "s" : ""} notée${st.tested > 1 ? "s" : ""} sur ${st.total} cette année.` : "Tes notes apparaissent au fil des séances, compétence par compétence."}</p>
  <p class="small">🏅 ${Object.keys(state.badges || {}).length} badge${Object.keys(state.badges || {}).length > 1 ? "s" : ""} sur ${Badges.list(state).length}</p>
  <button id="comps">Voir mes compétences et mes badges</button></div>`;
}
function screenComps() {
  const cat = Engine.catalog(state.profile), comps = state.comps || {};
  const statusTag = (id) => { const s = state.notions[id]; return !s ? "" : s.status === "avenir" ? '<span class="tag">à venir</span>' : s.status === "nonvu" ? '<span class="tag">pas encore vu en classe</span>' : ""; };
  const block = (list) => Engine.themeOrder(list, state.profile).map((th) => {
    const ns = list.filter((c) => c.theme === th).sort((a, b) => Engine.rank(state.profile, a.id) - Engine.rank(state.profile, b.id));
    if (!ns.length) return "";
    return `<div class="card flat"><h3>${Engine.themeLabel(th, state.profile)}</h3>${ns.map((c) => `<div class="cnotion"><div class="spread"><b>${c.label}</b>${statusTag(c.id)}</div>
      ${compsOf(c.id).map((k) => { const n = compNote(comps[k.cid]); return `<div class="comp"><span>${k.label}</span><span class="comp-r"><button type="button" class="ctest" data-id="${c.id}" data-d="${k.i + 1}" data-label="${esc(k.label)}" title="3 questions sur cette compétence">Me tester</button><span class="note ${noteCls(n)}">${noteTxt(n)}</span></span></div>`; }).join("")}</div>`).join("")}</div>`;
  }).join("");
  const cur = cat.filter((c) => c.current), old = cat.filter((c) => !c.current), st = compStats(cur.map((c) => c.id));
  // CO (14.11, demande de l'utilisateur) : compétences du cycle classées par grand thème du PER, un bloc repliable par thème.
  const co = state.profile.system === "CH" && state.profile.grade <= 11;
  const yearOf = (c) => (placeOf(c, state.profile) || [state.profile.grade])[0];
  const compLine = (c) => compsOf(c.id).map((k) => { const n = compNote(comps[k.cid]); return `<div class="comp"><span>${k.label}</span><span class="comp-r"><button type="button" class="ctest" data-id="${c.id}" data-d="${k.i + 1}" data-label="${esc(k.label)}" title="3 questions sur cette compétence">Me tester</button><span class="note ${noteCls(n)}">${noteTxt(n)}</span></span></div>`; }).join("");
  const cycle = () => Object.keys(THEMES).map((th, i) => {
    const ns = cat.filter((c) => NOTIONS.find((n) => n.id === c.id).theme === th).sort((a, b) => yearOf(a) - yearOf(b) || Engine.rank(state.profile, a.id) - Engine.rank(state.profile, b.id));
    if (!ns.length) return "";
    const t = compStats(ns.map((c) => c.id));
    return `<details class="card flat cyc"><summary><span class="cyc-h"><b>${THEMES[th]}</b><span class="small muted">${t.tested} / ${t.total} notées${t.avg !== null ? " · moyenne " + String(Math.round(t.avg * 10) / 10).replace(".", ",") : ""}</span></span>${t.avg !== null ? `<span class="note ${noteCls(Math.round(t.avg * 2) / 2)}">${String(Math.round(t.avg * 10) / 10).replace(".", ",")}</span>` : ""}</summary>
      ${ns.map((c) => `<div class="cnotion"><div class="spread"><b>${c.label}</b><span class="row" style="gap:4px"><span class="tag yr">${yearOf(c)}e</span>${statusTag(c.id)}</span></div>${LESSONS[c.id] ? `<button type="button" class="btn-ghost small lopen" data-id="${c.id}">${typeof ACTIVE !== "undefined" && ACTIVE[c.id] ? "🖐 Leçon à manipuler" : "📖 Leçon"}</button>` : ""}${compLine(c)}</div>`).join("")}</details>`;
  }).join("");
  const sc = compStats(cat.map((c) => c.id));
  Badges.check(state); state.badgesNew = []; save();
  h(`${brand}<h2>Mes <span class="mark">compétences</span></h2>
  <p class="muted">Chaque compétence reçoit une note de 1 à 6 dès que tu y as répondu 3 fois. La note suit tes 8 dernières réponses : elle monte quand tu progresses.</p>
  ${badgesSection()}
  ${co ? `<div class="card flat"><div class="spread"><span>Cycle 3 · jusqu'en ${state.profile.grade}e</span><b>${sc.tested} / ${sc.total} notées${sc.avg !== null ? " · moyenne " + String(Math.round(sc.avg * 10) / 10).replace(".", ",") : ""}</b></div></div>
  ${cycle()}` : `<div class="card flat"><div class="spread"><span>Cette année</span><b>${st.tested} / ${st.total} notées${st.avg !== null ? " · moyenne " + String(Math.round(st.avg * 10) / 10).replace(".", ",") : ""}</b></div></div>
  ${block(cur)}
  ${old.length ? `<details class="olds"><summary>Années précédentes (${compStats(old.map((c) => c.id)).tested} notées)</summary>${block(old)}</details>` : ""}`}
  <button class="btn-primary btn-big" id="back">Retour</button>`);
  bindBadges(app);
  app.querySelectorAll(".lopen").forEach((b) => (b.onclick = () => screenLesson(b.dataset.id, screenComps, true)));
  // « Me tester » (14.11, demande de l'utilisateur) : 3 questions de la compétence, au niveau de la compétence.
  app.querySelectorAll(".ctest").forEach((b) => (b.onclick = () => {
    const id = b.dataset.id, d = +b.dataset.d, cid = id + ":" + (d - 1);
    // Tous les niveaux qui travaillent cette compétence (même libellé), pour varier les 3 questions (14.11).
    const lab = (COMPS[id] || [])[d - 1], lvls = lab ? COMPS[id].map((x, j) => (x === lab ? j + 1 : 0)).filter(Boolean) : [d];
    const order = lvls.slice().sort(() => Math.random() - 0.5), pick = [0, 1, 2].map((k) => order[k % order.length]);
    session = { plan: pick.map((lv) => id + "|" + lv), i: 0, score: 0, answered: 0, start: Date.now(), elo0: state.elo.r, ids: new Set(), prep: true,
      ctest: { label: b.dataset.label, cid, before: compNote((state.comps || {})[cid]) } };
    nextQuestion();
  }));
  document.getElementById("back").onclick = screenHome;
}

// ---------------- Badges ----------------
function newBadgesCard() {
  const ids = (state.badgesNew || []).filter((id, i, a) => a.indexOf(id) === i), L = Badges.list(state);
  if (!ids.length) return "";
  state.badgesNew = []; save();
  const xs = ids.map((id) => L.find((x) => x.id === id)).filter(Boolean);
  return `<div class="card pop stack bdg-new"><div class="eyebrow">${xs.length > 1 ? "Nouveaux badges" : "Nouveau badge"} !</div>
  ${xs.map((x) => `<div class="bdg-row">${Badges.icon(x, true, 64)}<div><b>${x.name}</b><div class="small muted">${x.crit}</div></div></div>`).join("")}</div>`;
}
function badgesSection() {
  const got = state.badges || {}, b = Badges.bc(state), L = Badges.list(state);
  const fmt = (d) => d.slice(8, 10) + "." + d.slice(5, 7);
  return `<div class="card flat stack bdg-sec"><div class="spread"><h3>Mes badges</h3><b>${Object.keys(got).length} / ${L.length}</b></div>
  ${Object.entries(BADGE_FAM).map(([f, label]) => `<div class="eyebrow">${label}</div><div class="bdg-grid">${L.filter((x) => x.fam === f).map((x) => {
    const on = !!got[x.id], p = x.prog(state, b);
    const info = on ? "Gagné le " + fmt(got[x.id]) + ". " + x.crit : x.crit + (p[1] > 1 ? ` Où tu en es : ${p[0]} / ${p[1]}.` : "");
    return `<button type="button" class="bdg${on ? "" : " off"}" data-info="${esc(x.name + " · " + info)}">${Badges.icon(x, on, 48)}<span class="bdg-n">${x.name}</span><span class="small muted">${on ? fmt(got[x.id]) : p[1] > 1 ? p[0] + " / " + p[1] : "à gagner"}</span></button>`;
  }).join("")}</div>`).join("")}
  <p class="small muted bdg-info" aria-live="polite">Touche un badge pour savoir comment le gagner.</p></div>`;
}
function bindBadges(root) {
  const info = root.querySelector(".bdg-info");
  root.querySelectorAll(".bdg[data-info]").forEach((x) => (x.onclick = () => { info.textContent = x.dataset.info; root.querySelectorAll(".bdg").forEach((y) => y.setAttribute("aria-pressed", y === x)); }));
}
function bindLessonOpen(root) {
  root.querySelectorAll("details.lesson[data-id]").forEach((d) => d.addEventListener("toggle", () => { if (d.open && state) { Badges.onLesson(state, d.dataset.id); Badges.check(state); save(); } if (d.open) startInlineAct(d); }));
}
// Manipulation dans le rappel de cours (14.11) : les défis de la leçon active, lancés à l'ouverture.
function startInlineAct(root) {
  root.querySelectorAll(".act-inline[data-act]").forEach((el) => {
    if (el.dataset.on) return;
    const A = ACTIVE[el.dataset.act]; if (!A) return;
    el.dataset.on = 1;
    const goal = el.querySelector(".act-goal"), fb = el.querySelector(".act-fb");
    goal.textContent = "Défi 1 · " + A.defis[0];
    A.play(el.querySelector(".act-box"), (k, msg) => {
      fb.innerHTML = `<div class="fb ok">✓ ${msg}</div>`;
      goal.textContent = k + 1 < A.defis.length ? "Défi " + (k + 2) + " · " + A.defis[k + 1] : "Défis réussis !";
    });
  });
}

// ---------------- Ce que l'app envoie (13.11) ----------------
function screenPrivacy(back) {
  h(`${brand}<h2>Ce que l'app <span class="mark">envoie</span></h2>
  <p class="muted">Pas de compte, pas de nom, pas d'adresse e-mail. Ta progression reste sur ton appareil.</p>
  <div class="card flat stack"><b>Ce qui reste sur ton appareil</b>
  <ul class="plain"><li>Ta progression : tes notes de compétences, tes badges, ton Mathélo, l'historique de tes réponses.</li>
  <li>Rien de tout cela n'est envoyé (sauf ce qui est décrit ci-dessous, question par question, sans rien qui te désigne). Le code de sauvegarde, lui aussi, n'est envoyé nulle part : c'est toi qui le gardes.</li></ul></div>
  <div class="card flat stack"><b>Ce qui est envoyé, de façon anonyme</b>
  <span class="small muted">Vers un tableau tenu par l'auteur de l'app (Google Sheets), pour l'améliorer pendant la phase de test :</span>
  <ul class="plain"><li><b>Un signal d'ouverture</b> (au plus une fois par jour) et <b>un signal de fin de séance</b>, avec la date et un identifiant tiré au hasard, propre à cet appareil. Il sert seulement à compter combien de personnes testent l'app.</li>
  <li><b>Le début et la fin de chaque séance</b>, avec ta classe et le format ; à la fin, le nombre de questions, le score et la durée en minutes. Ça sert à savoir si les séances sont trop longues ou trop difficiles.</li>
  <li><b>Pour chaque question et chaque rappel de cours</b> : le code de la question, si tu as trouvé (du premier coup ou non), si tu as quitté avant de répondre, le temps passé, l'aide utilisée (pas à pas, correction) et ta première réponse fausse (un nombre ou un calcul ; si tu as écrit des mots, seulement « [texte] »), avec le même identifiant. Ça sert à repérer les questions mal posées, trop dures, ou que l'app corrige mal.</li>
  <li><b>Tes avis</b> 👍 / 👎, « trop facile » et « pas compris », avec le code de la question ou du rappel et le même identifiant.</li>
  <li><b>Tes commentaires</b>, si tu en écris, avec ta classe (par exemple « 10e ») et le même identifiant. N'y écris pas ton nom.</li>
  <li><b>Ton chapitre du moment</b>, si tu en choisis un : les notions, ta classe et le mois, sans identifiant. Ça sert à proposer les notions dans l'ordre où elles se font vraiment en classe.</li></ul></div>
  <p class="small muted">Identifiant tiré au hasard pour cet appareil : <code>${esc(deviceId() || "—")}</code></p>
  <div class="card flat stack"><b>À savoir</b>
  <ul class="plain"><li>L'identifiant ne permet pas de savoir qui tu es : il n'est lié à aucun nom ni compte.</li>
  <li>Comme pour tout site, les services qui hébergent l'app (GitHub) et chargent ses polices et ses formules (Google Fonts, Cloudflare) voient passer la connexion. L'auteur de l'app n'y a pas accès.</li>
  <li>« Tout effacer » (en bas de l'accueil) supprime ta progression et l'identifiant de cet appareil. Les avis et commentaires déjà envoyés ne contiennent rien qui te désigne.</li></ul></div>
  <button class="btn-primary btn-big" id="back">Retour</button>`);
  document.getElementById("back").onclick = back;
}

// ---------------- Sauvegarde ----------------
async function screenBackup() {
  h(`${brand}<h2>Sauvegarder <span class="mark">ma progression</span></h2><p class="muted">Préparation du code…</p>`);
  let code;
  try { code = await Backup.encode(state); } catch (e) { code = null; }
  if (!code) { h(`${brand}<div class="card flat"><p>Impossible de créer le code sur ce navigateur.</p></div><button class="btn-primary btn-big" id="back">Retour</button>`); document.getElementById("back").onclick = screenHome; return; }
  const url = Backup.url(code), qr = url.length <= 2000 ? QR.svg(url) : "";
  h(`${brand}<h2>Sauvegarder <span class="mark">ma progression</span></h2>
  <p class="muted">Ce code contient toute ta progression : notions, compétences, badges, Mathélo. Rien n'est envoyé sur Internet. Garde-le pour changer de téléphone ou continuer sur un ordinateur.</p>
  ${qr ? `<div class="card flat stack center"><b>Sur un autre appareil</b><span class="small muted">Scanne ce QR code avec l'appareil photo : l'app s'ouvre et propose de reprendre ta progression.</span><div class="qrwrap">${qr}</div></div>` : ""}
  <div class="card flat stack"><b>Ou garde le code</b><span class="small muted">Envoie-le-toi (message, mail) ou colle-le dans tes notes. Le code d'aujourd'hui remplace les anciens.</span>
  <textarea class="code-box" readonly rows="4">${code}</textarea>
  <div class="row"><button class="btn-primary" id="copy">Copier le code</button>${navigator.share ? '<button id="share">Envoyer…</button>' : ""}</div><span class="small muted" id="msg"></span></div>
  <div class="card flat stack"><b>Reprendre une progression</b><span class="small muted">Tu as un code d'un autre appareil ?</span><button id="restore">J'ai un code de sauvegarde</button></div>
  <button class="btn-primary btn-big" id="back">Retour</button>`);
  const msg = document.getElementById("msg"), ta = app.querySelector(".code-box");
  document.getElementById("copy").onclick = async () => {
    try { await navigator.clipboard.writeText(code); msg.textContent = "Code copié."; } catch (e) { ta.select(); msg.textContent = "Sélectionne le code et copie-le."; }
  };
  if (document.getElementById("share")) document.getElementById("share").onclick = () => navigator.share({ title: "Ma progression 5 minutes de maths", text: "Mon code de sauvegarde 5 minutes de maths (ouvre ce lien sur l'autre appareil) :", url }).catch(() => {});
  document.getElementById("restore").onclick = () => screenRestore();
  document.getElementById("back").onclick = screenHome;
}
function screenRestore(code) {
  h(`${brand}<h2>Reprendre <span class="mark">ma progression</span></h2>
  <p class="muted">Colle ici ton code de sauvegarde (ou le lien qui le contient).</p>
  <textarea class="code-box" id="code" rows="4" placeholder="1x…">${code ? esc(code) : ""}</textarea>
  <div id="prev" class="stack"></div>
  <button class="btn-primary btn-big" id="check">Vérifier le code</button>
  <button class="btn-ghost" id="back">Annuler</button>`);
  const back = () => { history.replaceState(null, "", location.pathname); state && state.placed ? screenHome() : screenWelcome(); };
  document.getElementById("back").onclick = back;
  const check = async () => {
    const box = document.getElementById("prev");
    let s;
    try { s = await Backup.decode(document.getElementById("code").value); } catch (e) { box.innerHTML = '<div class="card flat"><b>Code illisible.</b><p class="small muted">Vérifie qu\'il est complet (copie-le en entier).</p></div>'; return; }
    const nb = Object.keys(s.badges || {}).length, days = s.bc ? s.bc.days : s.history.length;
    box.innerHTML = `<div class="card flat stack"><b>Progression trouvée</b><span>${SYSTEMS[s.profile.system].label} · ${gradeName(s.profile)} · Mathélo ${s.elo.r} · ${days} jour${days > 1 ? "s" : ""} d'entraînement · ${nb} badge${nb > 1 ? "s" : ""}</span>
    ${state && state.placed ? '<span class="small">Elle remplacera la progression de cet appareil.</span>' : ""}<button class="btn-primary" id="ok">Reprendre cette progression</button></div>`;
    document.getElementById("check").style.display = "none";
    document.getElementById("ok").onclick = () => { state = s; save(); history.replaceState(null, "", location.pathname); toast("Progression reprise."); screenHome(); };
  };
  document.getElementById("check").onclick = check;
  if (code) check();
}
function restoreFromHash() {
  const m = /^#r=(.+)$/.exec(location.hash);
  if (!m) return false;
  screenRestore(m[1]);
  return true;
}

// ---------------- En ce moment en classe (13.11) ----------------
const nLabel = (id) => NOTIONS.find((n) => n.id === id).label;
function nowCard() {
  if (!Engine.nowActive(state)) return `<div class="stack now-in"><div class="eyebrow">📚 En ce moment en classe</div>
    <p class="small">Dis-moi ce que tu étudies en classe en ce moment : tes séances s'y concentreront.</p><button class="btn-primary btn-big" id="nowpick">Choisir mon chapitre</button></div>`;
  const labels = state.now.ids.map(nLabel).join(" · ");
  if (Engine.nowStale(state)) return `<div class="stack now-in"><div class="eyebrow">📚 En ce moment en classe</div>
    <h3>Toujours sur ${state.now.ids.length > 1 ? "ces notions" : "cette notion"} ?</h3><p class="small muted">${labels}</p>
    <div class="row"><button class="btn-primary" id="nowyes">Oui, toujours</button><button id="nowpick">On est passés à autre chose</button></div></div>`;
  return `<div class="stack now-in"><div class="spread"><div class="eyebrow">📚 En ce moment en classe</div><button class="btn-ghost small" id="nowpick">Changer</button></div>
    <h3>${labels}</h3><p class="small muted">Environ 2 questions sur 3 de tes séances portent dessus.</p></div>`;
}
function bindNowCard() {
  const b = document.getElementById("nowpick"), y = document.getElementById("nowyes");
  if (b) b.onclick = screenNow;
  if (y) y.onclick = () => { state.now.since = day(); save(); screenHome(); };
}
function screenNow() {
  const p = state.profile, cur = Engine.catalog(p).filter((c) => c.current && state.notions[c.id]);
  const chosen = new Set(Engine.nowActive(state) ? state.now.ids : []), sug = Engine.nowSuggest(state);
  const box = (c) => `<label class="check"><input type="checkbox" value="${c.id}" ${chosen.has(c.id) ? "checked" : ""}> <span>${c.label}</span></label>`;
  const groups = Engine.themeOrder(cur, state.profile).map((th) => [th, cur.filter((c) => c.theme === th).sort((a, b) => Engine.rank(p, a.id) - Engine.rank(p, b.id))]).filter(([, l]) => l.length);
  h(`${brand}<h2>En ce moment <span class="mark">en classe</span></h2>
  <p class="muted">Choisis 1 à 3 notions que vous travaillez en ce moment. Tes séances s'y concentreront, avec le rappel de cours la première fois, et je te redemanderai dans 3 semaines.</p>
  ${sug.length ? `<div class="card flat"><h3>Probablement en ce moment</h3><div class="checks">${sug.map((id) => box(cur.find((c) => c.id === id))).join("")}</div></div>` : ""}
  <details class="olds"><summary>Toutes les notions de l'année</summary>${groups.map(([th, l]) => `<div class="card flat"><h3>${Engine.themeLabel(th, state.profile)}</h3><div class="checks">${l.map(box).join("")}</div></div>`).join("")}</details>
  <p class="small muted" id="nerr"></p>
  <button class="btn-primary btn-big" id="save">C'est ça</button>
  <div class="row"><button class="btn-ghost" id="back">Annuler</button>${chosen.size ? '<button class="btn-ghost" id="none">Rien de particulier en ce moment</button>' : ""}</div>`);
  const inputs = [...app.querySelectorAll(".check input")];
  inputs.forEach((i) => (i.onchange = () => {
    // Une même notion peut apparaître une seule fois ; au plus 3 cochées.
    // 20.11 : une notion suggérée figure aussi dans son chapitre (deux cases) : on les garde synchronisées.
    inputs.filter((x) => x !== i && x.value === i.value).forEach((x) => (x.checked = i.checked));
    const on = [...new Set(inputs.filter((x) => x.checked).map((x) => x.value))];
    if (on.length > 3) { inputs.filter((x) => x.value === i.value).forEach((x) => (x.checked = false)); document.getElementById("nerr").textContent = "3 notions au plus : décoche-en une d'abord."; } else document.getElementById("nerr").textContent = "";
  }));
  document.getElementById("save").onclick = () => {
    const ids = [...new Set(inputs.filter((x) => x.checked).map((x) => x.value))];
    if (!ids.length) { document.getElementById("nerr").textContent = "Coche au moins une notion."; return; }
    Engine.setNow(state, ids); save(); sendNow(ids); toast("Noté : tes séances se concentrent sur ce chapitre."); screenHome();
  };
  document.getElementById("back").onclick = screenHome;
  const none = document.getElementById("none");
  if (none) none.onclick = () => { Engine.setNow(state, []); save(); screenHome(); };
}
// Chapitre du moment, anonyme (sans identifiant d'appareil) : notions, classe, mois. Sert à recaler l'ordre des notions.
function sendNow(ids) {
  try {
    if (!canSend()) return;
    const p = state.profile, niveau = gradeName(p) + (p.track === "mp" ? " MP" : "");
    fetch(VOTE_ENDPOINT, { method: "POST", mode: "no-cors", body: JSON.stringify({ ev: "now", ids: ids.join(","), niveau, mois: day().slice(0, 7) }) }).catch(() => {});
  } catch (e) {}
}

// ---------------- Je prépare mon test ----------------
function screenPrep() {
  const cat = Engine.catalog(state.profile).filter((c) => state.notions[c.id]);
  const chosen = new Set(state.prep && Engine.prepActive(state) ? state.prep.ids : []);
  // On ne demande que les notions de l'année : celles des années précédentes sont vues, sans poser la question.
  const groups = {};
  Engine.themeOrder(cat.filter((c) => c.current), state.profile).forEach((th) => { const l = cat.filter((c) => c.current && c.theme === th); if (l.length) groups[th] = l; });
  const date = state.prep && Engine.prepActive(state) ? state.prep.date : addDays(day(), 7);
  h(`${brand}<h2>Je prépare <span class="mark">un test</span></h2>
  <p class="muted">Choisis les notions de ton test et sa date. Jusqu'à ce jour-là, tes séances porteront surtout sur elles, avec un problème pour finir.</p>
  <div class="card flat stack"><label for="pdate"><h3>Date du test</h3></label><input type="date" id="pdate" value="${date}" min="${day()}" class="datein"></div>
  ${Object.keys(groups).length ? "" : '<div class="card flat"><p class="muted">Rien à cocher : tout ce qui te concerne vient des années précédentes.</p></div>'}
  ${Object.entries(groups).map(([th, list]) => `<div class="card flat"><h3>${Engine.themeLabel(th, state.profile)}</h3><div class="checks">${list.map((c) => `<label class="check"><input type="checkbox" value="${c.id}" ${chosen.has(c.id) ? "checked" : ""}> <span>${c.label}</span></label>`).join("")}</div></div>`).join("")}
  <p class="small muted" id="perr"></p>
  <button class="btn-primary btn-big" id="save">Enregistrer mon test</button>
  <div class="row"><button class="btn-ghost" id="back">Annuler</button>${chosen.size ? '<button class="btn-ghost" id="del">Supprimer ce test</button>' : ""}</div>`);
  document.getElementById("save").onclick = () => {
    const ids = [...app.querySelectorAll(".check input:checked")].map((i) => i.value), dt = document.getElementById("pdate").value;
    if (!ids.length) { document.getElementById("perr").textContent = "Coche au moins une notion."; return; }
    if (!dt || dt < day()) { document.getElementById("perr").textContent = "Choisis une date à partir d'aujourd'hui."; return; }
    state.prep = { ids, date: dt };
    for (const id of ids) { const n = state.notions[id]; if (n.status !== "vu" && n.status !== "encours") Object.assign(n, { status: "encours", m: Math.max(0.4, n.m), due: day() }); }
    save(); screenHome();
  };
  document.getElementById("back").onclick = screenHome;
  const del = document.getElementById("del");
  if (del) del.onclick = () => { state.prep = null; save(); screenHome(); };
}

// ---------------- Mini-leçons ----------------
// Découpe un texte en phrases (hors des formules \( … \)) : une phrase par ligne, plus lisible.
function sentences(t) {
  const out = []; let cur = "", math = 0;
  for (let i = 0; i < t.length; i++) {
    if (t.startsWith("\\(", i)) math++;
    if (t.startsWith("\\)", i)) math = Math.max(0, math - 1);
    cur += t[i];
    // fin de phrase hors formule : « . » suivi d'une majuscule, d'un chiffre ou d'une formule ; « ; » suivi d'une majuscule
    const next = t.slice(i + 1, i + 4);
    const endDot = t[i] === "." && /^ (?:[A-ZÀÂÉÈÊÎÔÛÇ0-9«]|\\\()/.test(next);
    const endSemi = t[i] === ";" && /^ [A-ZÀÂÉÈÊÎÔÛÇ]/.test(next);
    const listOfFormulas = t[i] === "," && cur.endsWith("\\),") && next.startsWith(" \\("); // « \(a\), \(b\) » : une formule par ligne
    if (!math && (endDot || endSemi || listOfFormulas)) { out.push(cur.trim().replace(/,$/, "")); cur = ""; }
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
function lessonBody(id) {
  const L = LESSONS[id];
  if (!L) return "";
  const fig = typeof LESSON_FIGS !== "undefined" && LESSON_FIGS[id] ? `<div class="figwrap">${LESSON_FIGS[id]()}</div>` : "";
  const act = typeof ACTIVE !== "undefined" && ACTIVE[id] ? `<div class="act-inline stack" data-act="${id}"><div class="act-h"><span class="act-n">🖐</span> Manipule</div><p class="act-goal"></p><div class="act-box stack"></div><div class="act-fb"></div></div>` : "";
  return `<p>${L.intro}</p>${act || fig}<div class="rule"><b>À retenir</b>${(() => { const ss = sentences(L.regle); return ss.length > 1 ? "<ul>" + ss.map((x) => "<li>" + x + "</li>").join("") + "</ul>" : " · " + L.regle; })()}</div>
  <div class="ex-list">${L.exemple.map((e) => `<div>${e}</div>`).join("")}</div>
  <div class="trap"><b>Piège</b> · ${L.piege}</div>
  <div class="lfb" data-id="${id}"><span class="small muted">Ce rappel est…</span><button class="small" data-v="up">👍 clair</button><button class="small" data-v="down">🤔 pas compris</button><span class="small muted lfb-msg"></span></div>
  ${commentBox("💬 Un commentaire sur ce rappel ?", "Ce qui n'est pas clair, un exemple qui manque… (n'écris pas ton nom)", "lecon-" + id)}`;
}
const lessonDetails = (id) => (LESSONS[id] ? `<details class="lesson" data-id="${id}"><summary>📖 Rappel de cours</summary><div class="stack">${lessonBody(id)}</div></details>` : "");
// review : leçon rouverte depuis « Mes compétences » (pas une nouvelle notion), retour à cet écran.
// track = false : consultation par lien (#l-…, contrôle de l'auteur), rien n'est envoyé.
function screenLesson(id, cont0, review, track = true) {
  const L = LESSONS[id];
  if (state) { Badges.onLesson(state, id); save(); }
  let S = null;
  const cont = () => { if (S) { S.issue = "lue"; S.sec = sigSec(S); } cont0(); };
  const open = () => { pageQ = "lecon-" + id; if (track) S = sigOpen({ ev: "lecon", code: "lecon-" + id, fmt: review ? "revue" : "nouvelle", kind: typeof ACTIVE !== "undefined" && ACTIVE[id] ? "active" : "rappel" }); };
  if (typeof ACTIVE !== "undefined" && ACTIVE[id]) { const r = activeLesson(id, L, cont, review); open(); return r; }
  h(`${brand}<div class="eyebrow">${review ? "Leçon" : "Nouvelle notion · 30 secondes de cours"}</div>
  <div class="card pop lesson-card"><h2>${L.titre}</h2>${lessonBody(id)}</div>
  <button class="btn-primary btn-big" id="go">${review ? "Retour à mes compétences" : "J'ai compris, à moi !"}</button>`);
  open();
  document.getElementById("go").onclick = cont;
}

// ---------------- Séance ----------------
let session = null;
// Mode « progression libre » (18.11) : deux portes égales sur l'accueil ; l'élève choisit le périmètre.
const FREE_THEMES = { no: "Nombres et opérations", fa: "Fonctions et algèbre", gm: "Grandeurs et mesures", es: "Espace et géométrie" };
function freeCard() {
  return `<div class="card stack mode-free"><div class="eyebrow">🧭 Mode libre · mon défi du jour</div><h2>Tous les sujets, à ton rythme</h2>
    <p class="muted">Un parcours qui s'adapte à toi : si tout va bien, tu avances vite vers des notions nouvelles et plus difficiles ; si ça coince, on reprend d'abord les bases. Sans programme ni note : juste progresser.</p>
    <button class="btn-primary btn-big" id="freego">Relever le défi</button></div>`;
}
function startFree() {
  const plan = Engine.freePlan(state, "annee", 6);
  if (!plan.length) return startSession();
  session = { free: true, plan, i: 0, score: 0, answered: 0, start: Date.now(), elo0: state.elo.r, ids: new Set() };
  nextQuestion();
}
// Carte de progression par thème : une case par notion, colorée selon la maîtrise (grise : jamais travaillée).
function themeMapCard() {
  const by = {};
  for (const [id, s] of Object.entries(state.notions)) { const n = NOTIONS.find((x) => x.id === id); if (!n || !GEN[id]) continue; (by[n.theme] = by[n.theme] || []).push([n, s]); }
  const col = (s) => (!s.seen ? "var(--line)" : s.m >= 0.7 ? "var(--ok)" : s.m >= 0.45 ? "var(--warn)" : "var(--bad)");
  const rows = Object.keys(FREE_THEMES).filter((k) => by[k]).map((k) => { const L = by[k], done = L.filter(([, s]) => s.seen && s.m >= 0.7).length;
    return `<div style="margin:8px 0"><div class="spread small"><b>${FREE_THEMES[k]}</b><span class="muted">${done} / ${L.length} maîtrisées</span></div>
      <div style="display:flex;flex-wrap:wrap;gap:3px;margin-top:4px">${L.map(([n, s]) => `<span title="${esc(n.label)}" aria-label="${esc(n.label)}" style="width:14px;height:14px;border-radius:3px;background:${col(s)};display:inline-block"></span>`).join("")}</div></div>`; }).join("");
  return `<div class="card stack"><div class="eyebrow">Ma carte de progression</div>${rows}
    <p class="small muted">Vert : maîtrisé · orange : en route · rouge : à travailler · gris : pas encore essayé.</p></div>`;
}
function startSession() {
  const fmt = Engine.todayFormat(state), plan = Engine.planSession(state, fmt);
  Engine.logFormat(state, fmt); save();
  session = { fmt, plan, i: 0, score: 0, answered: 0, start: Date.now(), elo0: state.elo.r, ids: new Set() };
  nextQuestion();
}
function nextQuestion(redo) {
  if (!redo && session.i === 0 && !session.pinged) { session.pinged = true; ping("start", sessionInfo()); }
  // Pas de chrono : la séance finit quand le programme du jour est fait.
  if (!redo && session.i >= session.plan.length) return screenSummary();
  const raw = redo ? redo.id : session.plan[session.i], forceProb = String(raw).startsWith("PROB:");
  const parts = String(raw).split("|"), id = forceProb ? raw.slice(5) : parts[0], level = parts[1] ? +parts[1] : undefined, kind = redo ? redo.kind : parts[2];
  const ns = state.notions[id];
  // Écran de leçon : seulement la première fois, et pour une notion en cours en classe ou encore fragile.
  // Pas dans « Me tester » (14.11, retour de l'utilisateur) : on y attend 3 questions sur la compétence choisie ;
  // le rappel de cours reste ouvrable dans chaque question.
  if (!redo && !session.ctest && LESSONS[id] && ns && !ns.lessonSeen && (ns.status === "encours" || ns.m < 0.4)) {
    state.notions[id].lessonSeen = true; save();
    return screenLesson(id, () => { session.lessonShown = id; nextQuestion(); });
  }
  const q = redo ? Engine.make(state, id, redo.d === 4 ? 4 : Math.max(1, redo.d - 1)) : Engine.make(state, id, session.weekly || forceProb ? 4 : level);
  q.kind = kind;
  renderQuestion(q, {
    track: sessionInfo().fmt || "seance", redo: !!redo,
    eyebrow: (session.free ? "Mon défi du jour · " + (session.i + 1) + " sur " + session.plan.length : session.weekly ? "Problème de la semaine" : session.ctest ? "Me tester · " + session.ctest.label + " · " + (session.i + 1) + " sur " + session.plan.length : session.prep ? "Révision du test · " + (session.i + 1) + " sur " + session.plan.length : session.plan.length === 1 ? (session.fmt ? FORMATS[session.fmt].label : "Question du jour") : (session.fmt ? FORMATS[session.fmt].label + " · " : "") + (session.i + 1) + " sur " + session.plan.length) + (kind && KIND_LABEL[kind] ? " · " + KIND_LABEL[kind] : "") + (ns && !session.prep && !Engine.isRecent(state, id) ? " · 🔙 Rappel" : "") + (redo ? " · nouvelles valeurs" : ""),
    onDone: (res) => {
      const sc = Engine.record(state, id, q.d, res.tries, res.solved, res.partial);
      // Deux échecs de suite : on glisse juste après une question sur une notion de base (une fois par notion et par séance).
      if (!session.weekly && !session.prep && sc < 0.5) {
        session.remed = session.remed || new Set();
        const p = !session.remed.has(id) && Engine.remediation(state, id);
        if (p) { session.remed.add(id); session.plan.splice(session.i + 1, 0, p + "|1|rem"); }
      }
      res.delta = Engine.updateElo(state, id, q.d, sc);
      session.score += sc; session.answered++; session.ids.add(id);
      Engine.finishDay(state, 1, sc); save();
      return res.delta;
    },
    onNext: (wantRedo) => { if (wantRedo) return nextQuestion(q); session.i++; nextQuestion(); },
    // « Pas encore vu en classe » : pas en préparation de test (l'élève a choisi ses notions) ni pour le problème de la semaine.
    onNotYet: session.weekly || session.prep ? null : () => { Engine.notYet(state, id); save(); toast("Noté : cette notion reviendra dans quelques semaines."); session.i++; nextQuestion(); },
    // « Trop facile » : au plus 3 par séance, pas en préparation de test ni pour le problème de la semaine.
    onEasy: session.weekly || (session.skips || 0) >= 3 ? null : () => {
      session.skips = (session.skips || 0) + 1;
      const r = Engine.tooEasy(state, id, q.d, kind);
      vote(q.code, "facile");
      session.ids.add(id);
      if (r.next && !redo) session.plan[session.i] = r.next; else session.i++;
      save();
      toast(r.next ? "Noté : on monte d'un cran." + (r.delta ? " Mathélo +" + r.delta : "") : "Noté, on passe à la suite.");
      nextQuestion();
    },
  });
}

// Clavier mathématique partagé : écrit dans le champ actif.
// Clavier 7 colonnes : y et = ajoutés (13.11) ; 0 et ⌨ prennent deux cases.
const KEYS = ["7", "8", "9", "/", "(", ")", "⌫", "4", "5", "6", "*", "^", "√", "π", "1", "2", "3", "-", "x", "y", "=", "0", ",", "+", ";", "⌨"];
// Réponse exacte non décimale sans arrondi demandé (audit 13.11) : on le dit à l'élève, sauf si l'énoncé le précise déjà.
const isTerm = (v) => Math.abs(v * 1e6 - Math.round(v * 1e6)) < 1e-6;
function exactNote(spec, text) {
  if (!spec) return "";
  const t = text || "", notes = [];
  // Consigne de saisie quand l'énoncé ne la donne pas (audit 13.11).
  if (spec.kind === "set" && !/« ; »|sépare|aucune/i.test(t)) notes.push("Plusieurs solutions : sépare-les par « ; » ; « aucune » s'il n'y en a pas.");
  if (spec.kind === "solset" && !/intervalle|« x|aucune/i.test(t)) notes.push("Réponds avec des intervalles (par exemple ]-∞ ; 2] ∪ [5 ; +∞[), « x ≥ 3 » ou « aucune ».");
  // Commentaire testeur du 20.11 (« comment on tape infini ? ») : la touche ∞ existait, mais rien ne la signalait.
  if (spec.kind === "solset" && spec.ivs.some(([lo, , hi]) => !isFinite(lo) || !isFinite(hi))) notes.push("Infini : touche ∞ du clavier de l'app (−∞ : touche − puis ∞), ou tape « inf ».");
  if (!spec.round && !spec.plain && !/exact|fraction|arrondi|au centième|au dixième/i.test(t)) {
    const vals = spec.kind === "value" ? [spec.value] : spec.kind === "set" || spec.kind === "pair" ? spec.values : [];
    if (vals.some((v) => isFinite(v) && !isTerm(v))) notes.push(vals.some((v) => isFinite(v) && !isTerm(v) && niceQ(v / Math.PI)) ? "Réponse exacte attendue (avec la touche π), pas d'arrondi." : "Réponse exacte attendue : fraction ou racine, pas d'arrondi.");
  }
  return notes.join(" ");
}
// Clavier « intervalles » (13.11) : domaines, inéquations, ensembles de solutions. « | » = place du curseur après insertion.
const SET_KEYS = ["7", "8", "9", "-", "+", "/", "⌫", "4", "5", "6", "[", "]", ";", "∞", "1", "2", "3", "x", "<", ">", "∪",
  "0", ",", "≤", "≥", "≠", "=", "ℝ \\ {|}", "ℝ", "∅", "√", "⌨"];
const KEY_LABEL = { "*": "×", "ℝ \\ {|}": "ℝ∖{ }" };
const keyBtn = (k, set) => `<button type="button" class="${/^[\d,]$/.test(k) ? "" : "k-op"}${k === "0" || (k === "⌨" && !set) || k === "ℝ \\ {|}" || (k === "⌨" && set) ? " k-wide" : ""}" data-k="${esc(k)}">${KEY_LABEL[k] || k}</button>`;
const isSetSpec = (spec) => !!spec && (spec.kind === "solset" || spec.kind === "ineq");
// Clavier « résultat » (14.11) : chiffres seulement, pas de calculatrice ; √ si la réponse exacte en a besoin.
// 19.11 (urgent, testeur) : touche π quand la réponse exacte est un multiple simple de π (volumes « en fonction de π »).
const niceQ = (x) => { if (!isFinite(x) || Math.abs(x) < 1e-3) return false; for (let d = 1; d <= 12; d++) if (Math.round(x * d) !== 0 && Math.abs(x * d - Math.round(x * d)) < 1e-6) return true; return false; };
const exactKeys = (spec) => { const v = spec.value; if (!isFinite(v) || isTerm(v)) return []; if (!spec.radical && !spec.pi && niceQ(v)) return []; /* fraction : chiffres et / suffisent */ const pi = spec.pi || niceQ(v / Math.PI), root = spec.radical || !pi; return [...(root ? ["√"] : []), ...(pi ? ["π"] : [])]; };
const numKeys = (spec) => { const ex = exactKeys(spec); return ["7", "8", "9", "⌫", "4", "5", "6", "-", "1", "2", "3", "/", "0", ",", ...ex, "⌨"]
  .map((k) => `<button type="button" class="${/^[\d,]$/.test(k) ? "" : "k-op"}${k === "0" && !ex.length ? " k-wide" : ""}" data-k="${esc(k)}">${KEY_LABEL[k] || k}</button>`).join(""); };
// Lettres du clavier (15.11) : celles de l'expression attendue (a, b, n…) remplacent x et y ; une 3e lettre prend la place de « = ».
const keyLetters = (spec) => { let L = []; try { if (spec && spec.kind === "expr") L = [...Expr.vars(Expr.parse(spec.expr))].sort(); } catch (e) {} if (!L.length || (L.length <= 2 && L.every((v) => v === "x" || v === "y"))) return KEYS; const k = KEYS.slice(); k[k.indexOf("x")] = L[0]; k[k.indexOf("y")] = L[1] || (L[0] === "x" ? "y" : "x"); if (L[2]) k[k.indexOf("=")] = L[2]; return k; };
const keysFor = (spec) => (spec && spec.final ? numKeys(spec) : isSetSpec(spec) ? SET_KEYS.map((k) => keyBtn(k, true)).join("") : keyLetters(spec).map((k) => keyBtn(k)).join(""));
const keypadHtml = (spec) => { const kind = spec && spec.final ? "k-num" : isSetSpec(spec) ? "k-set" : ""; return `<div class="keypad${kind ? " " + kind : ""}" id="kp" data-kind="${kind + (kind === "k-num" && exactKeys(spec).length ? "r" : "")}">${keysFor(spec)}</div>`; };
// Insère une touche dans le champ (avec « | » : place du curseur), ou efface.
function typeKey(inp, k) {
  const s = inp.selectionStart ?? inp.value.length, e = inp.selectionEnd ?? inp.value.length;
  if (k === "⌫") { const a = s === e ? Math.max(0, s - 1) : s; inp.value = inp.value.slice(0, a) + inp.value.slice(e); inp.setSelectionRange(a, a); return; }
  const at = k.indexOf("|"), t = k.replace("|", ""), c = s + (at >= 0 ? at : t.length);
  inp.value = inp.value.slice(0, s) + t + inp.value.slice(e); inp.setSelectionRange(c, c);
}
// Aperçu d'une réponse : ensemble (intervalles, ℝ \ {…}, x ≥ …) pour les questions d'ensemble, sinon calcul.
function previewHtml(v, spec) {
  if (isSetSpec(spec)) {
    const ivs = SolSet.parse(v).slice().sort((x, y) => x[0] - y[0]);
    // ℝ privé de points : ]-∞ ; a[ ∪ ]a ; b[ ∪ … ∪ ]z ; +∞[
    const holes = ivs.length && ivs[0][0] === -Infinity && ivs[ivs.length - 1][2] === Infinity && ivs.every((x, i) => !x[1] && !x[3] && (i === 0 || x[0] === ivs[i - 1][2])) ? ivs.slice(1).map((x) => x[0]) : null;
    const nt = (x) => SolSet.show([[x, true, x, true]]).replace(/^\\\{|\\\}$/g, "");
    return "\\(S = " + (holes ? "\\mathbb{R}" + (holes.length ? " \\setminus \\{" + holes.map(nt).join(" ; ") + "\\}" : "") : SolSet.show(ivs)) + "\\)";
  }
  const t = Expr.parse(v), val = Expr.vars(t).size || t.t === "list" ? "" : Expr.evaluate(t);
  return "\\(" + Expr.tex(t) + "\\)" + (val !== "" && isFinite(val) && !(spec && spec.final) ? `<span class="val">≈ ${String(+val.toPrecision(8)).replace(".", ",")}</span>` : "");
}
function previewOf(inp, prev, spec) {
  const v = inp.value.trim();
  if (!v) { prev.innerHTML = ""; return; }
  try { prev.innerHTML = previewHtml(v, spec); typeset(prev); } catch (e) { prev.innerHTML = `<span class="err">${esc(e.message)}</span>`; }
}
function bindKeypad(getInput, after) {
  let mode = window.matchMedia("(pointer: fine)").matches ? "text" : "none";
  app.querySelectorAll("input.ans").forEach((i) => i.setAttribute("inputmode", mode));
  app.querySelectorAll("#kp button").forEach((b) => (b.onclick = () => {
    const inp = getInput(), k = b.dataset.k;
    if (!inp || inp.disabled) return;
    if (k === "⌨") { mode = mode === "none" ? "text" : "none"; app.querySelectorAll("input.ans").forEach((i) => i.setAttribute("inputmode", mode)); inp.blur(); inp.focus(); return; }
    typeKey(inp, k);
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
  ${q.parts.map((p, i) => `<div class="answer part" data-i="${i}"><label for="p${i}"><b>${p.label}</b>${exactNote(p.spec, p.label) ? ` <span class="small muted">(valeur exacte)</span>` : ""} <span class="mk" id="mk${i}"></span></label>
    <input id="p${i}" class="ans" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Ta réponse…"><div class="preview" id="pv${i}"></div></div>`).join("")}
  ${keypadHtml(q.parts[0].spec)}
  <div class="actions"><button class="btn-primary" id="check">Valider</button><button id="idk">Voir le corrigé</button></div>
  <div id="fb"></div></div>`);
  const S = opt.track ? sigOpen({ ev: "q", code, d: q.d, kind: q.kind || "", fmt: opt.track, redo: opt.redo ? 1 : 0 }) : null;
  sigWatchLesson(S); pageQ = code;
  const fb = document.getElementById("fb");
  q.parts.forEach((p, i) => {
    const inp = document.getElementById("p" + i), pv = document.getElementById("pv" + i);
    // Clavier adapté à la partie active (intervalles ou calcul).
    inp.onfocus = () => {
      active = inp;
      const kp = document.getElementById("kp"), kind = p.spec && p.spec.final ? "k-num" : isSetSpec(p.spec) ? "k-set" : "";
      if ((kp.dataset.kind || "") !== kind + (kind === "k-num" && !isTerm(p.spec.value) ? "r" : "")) {
        kp.classList.remove("k-set", "k-num"); if (kind) kp.classList.add(kind);
        kp.dataset.kind = kind + (kind === "k-num" && !isTerm(p.spec.value) ? "r" : ""); kp.innerHTML = keysFor(p.spec); bindKp(); }
      placeKp(inp);
    };
    let tm; inp.oninput = () => { clearTimeout(tm); tm = setTimeout(() => previewOf(inp, pv, p.spec), 180); };
    inp.onkeydown = (e) => { if (e.key === "Enter") check(); };
  });
  // Clavier sous la case active (20.11, demande de l'auteur) : il suit la réponse en cours, plus besoin de défiler.
  const placeKp = (inp) => { const kp = document.getElementById("kp"), part = inp.closest(".part"); if (!kp || !part || kp.previousElementSibling === part) return; part.after(kp); setTimeout(() => kp.scrollIntoView({ behavior: "smooth", block: "nearest" }), 40); };
  active = document.getElementById("p0");
  placeKp(active);
  const bindKp = () => bindKeypad(() => active, (inp) => previewOf(inp, document.getElementById("pv" + inp.id.slice(1)), q.parts[+inp.id.slice(1)].spec));
  bindKp();
  const end = (giveUp) => {
    finished = true;
    app.querySelectorAll("input.ans, #kp button, #check, #idk").forEach((b) => (b.disabled = true));
    const frac = ok.filter(Boolean).length / q.parts.length, factor = [1, 1, 2 / 3, 1 / 3][Math.min(tries, 3)] || 1 / 3;
    const score = giveUp && tries === 0 ? 0 : Math.round(frac * factor * 100) / 100;
    if (S) { S.issue = frac === 1 ? (tries === 1 ? "ok1" : "ok2") : giveUp && tries === 0 ? "idk" : ok.some(Boolean) ? "partiel" : "faux"; S.essais = tries; S.sec = sigSec(S); }
    if (frac === 1) burst();
    const delta = opt.onDone({ solved: frac === 1, tries, partial: score });
    const d = typeof delta === "number" && delta !== 0 ? `<span class="delta ${delta > 0 ? "up" : "down"}">Mathélo ${delta > 0 ? "+" : ""}${delta}</span>` : "";
    fb.innerHTML = `<div class="fb ${frac === 1 ? "ok" : "bad"} pop"><div class="spread"><b>${frac === 1 ? (tries === 1 ? "Problème résolu du premier coup !" : "Problème résolu.") : ok.filter(Boolean).length + " partie(s) juste(s) sur " + q.parts.length + "."}</b>${d}</div><div class="sol">${q.sol}</div></div>
      <div class="vote"><span>Ce problème était… <button data-v="up" aria-label="Bon problème">👍</button> <button data-v="down" aria-label="Problème à revoir">👎</button></span><span class="code">${code}</span></div>${commentBox()}
      <div class="actions">${frac === 1 ? "" : '<button id="redo">Refaire avec d\'autres valeurs</button>'}<button class="btn-primary" id="nx">Continuer</button></div>`;
    typeset(fb);
    fb.querySelectorAll(".vote button").forEach((b) => (b.onclick = () => { vote(code, b.dataset.v); fb.querySelectorAll(".vote button").forEach((x) => x.setAttribute("aria-pressed", x === b)); }));
    bindComment(fb, code);
    document.getElementById("nx").onclick = () => opt.onNext(false);
    const r = document.getElementById("redo"); if (r) r.onclick = () => { sigAide(S, "x"); opt.onNext(true); };
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
      if (S && !S.rep1 && !ok[i] && r.status !== "invalid" && r.status !== "form") S.rep1 = "p" + (i + 1) + ":" + sigRep(v);
    });
    if (invalid) { if (S) S.illis = (S.illis || 0) + 1; fb.innerHTML = `<div class="fb hint pop"><b>Je n'arrive pas à lire une réponse</b><span>${esc(invalid)}</span></div>`; return; }
    tries++;
    q.parts.forEach((p, i) => {
      document.getElementById("mk" + i).textContent = ok[i] ? "✓" : "✗";
      if (ok[i]) document.getElementById("p" + i).disabled = true;
    });
    if (ok.every(Boolean) || tries >= 3) return end(false);
    const nx = ok.findIndex((v) => !v); if (nx >= 0) { active = document.getElementById("p" + nx); placeKp(active); }
    fb.innerHTML = `<div class="fb hint pop"><b>${ok.some(Boolean) ? "En partie juste. Continue !" : "Pas encore."}</b><span><b>Indice ${tries}</b> · ${escT(q.hints[tries - 1])}</span></div>`;
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
  h(`<div class="spread">${brand}</div>
  ${session && !opt.single && session.answered > 0 ? '<div class="spread"><span></span><button class="btn-ghost small" id="stop">Terminer ici</button></div>' : ""}
  <div class="eyebrow">${opt.eyebrow}</div>
  <div class="card pop"><div class="qmeta"><span class="chip">${notion.label}</span><span class="dots" title="difficulté">${[1, 2, 3].map((k) => `<i class="${k <= q.d ? "on" : ""}"></i>`).join("")}</span>${opt.onEasy ? '<button class="btn-ghost small easy" id="easy" title="Passer cette question et monter d\'un cran">Trop facile ⏭</button>' : ""}</div>
  <div class="qtext">${q.q}</div>${exactNote(q.spec, q.q) ? `<p class="small muted exact-note">${exactNote(q.spec, q.q)}</p>` : ""}${q.fig ? `<div class="figwrap">${q.fig}</div>` : ""}
  ${opt.single ? "" : lessonDetails(q.id)}
  <div class="answer"><input id="ans" autocomplete="off" autocapitalize="off" spellcheck="false" inputmode="none" placeholder="Ta réponse…" aria-label="Ta réponse">
  <div class="preview" id="prev"><span class="err">L'aperçu de ta réponse s'affiche ici.</span></div>
  ${keypadHtml(q.spec)}
  <div class="actions"><button class="btn-primary" id="check">Valider</button><button id="idk">Je ne sais pas</button></div>
  ${opt.onNotYet ? '<button class="btn-ghost small notyet" id="notyet">Pas encore vu en classe</button>' : ""}</div>
  <div id="fb"></div></div>`);
  const S = opt.track ? sigOpen({ ev: "q", code, d: q.d, kind: q.kind || "", fmt: opt.track, redo: opt.redo ? 1 : 0 }) : null;
  sigWatchLesson(S); pageQ = code;
  const inp = document.getElementById("ans"), prev = document.getElementById("prev"), fb = document.getElementById("fb");
  if (window.matchMedia("(pointer: fine)").matches) { inp.setAttribute("inputmode", "text"); inputMode = "text"; inp.focus(); }
  let tm;
  const showPreview = () => {
    clearTimeout(tm);
    tm = setTimeout(() => {
      const v = inp.value.trim();
      if (!v) { prev.innerHTML = '<span class="err">L\'aperçu de ta réponse s\'affiche ici.</span>'; return; }
      try {
        prev.innerHTML = previewHtml(v, q.spec);
        typeset(prev);
      } catch (e) { prev.innerHTML = `<span class="err">${esc(e.message)}</span>`; }
    }, 180);
  };
  inp.oninput = showPreview;
  inp.onkeydown = (e) => { if (e.key === "Enter") check(); };
  app.querySelectorAll("#kp button").forEach((b) => (b.onclick = () => {
    const k = b.dataset.k;
    if (k === "⌨") { inputMode = inputMode === "none" ? "text" : "none"; inp.setAttribute("inputmode", inputMode); inp.blur(); inp.focus(); return; }
    typeKey(inp, k);
    showPreview();
  }));
  const stopBtn = document.getElementById("stop");
  if (stopBtn) stopBtn.onclick = screenSummary;

  let lastDiag = null;
  const end = (solved, dontKnow) => {
    finished = true;
    inp.disabled = true;
    app.querySelectorAll("#kp button, #check, #idk, #notyet").forEach((b) => (b.disabled = true));
    const res = { solved, tries, dontKnow };
    if (S) { S.issue = solved ? (tries === 1 ? "ok1" : "ok2") : dontKnow ? "idk" : "faux"; S.essais = tries; S.sec = sigSec(S); }
    if (solved) burst();
    const delta = opt.onDone(res);
    if (opt.single) {
      fb.innerHTML = `<div class="fb ${solved ? "ok" : "bad"} pop"><b>${solved ? "✓ Juste ! " + pick(PRAISE) : dontKnow ? "D'accord, on s'en occupera. Voici la solution :" : "✗ Pas tout à fait. Voici la solution :"}</b>${solved ? "" : '<span class="sol">' + q.sol + "</span>"}</div><div class="actions"><button class="btn-primary" id="nx">Suivant</button></div>`;
      typeset(fb);
      document.getElementById("nx").onclick = () => opt.onNext();
      document.getElementById("nx").focus();
      return;
    }
    const d = typeof delta === "number" && delta !== 0 ? `<span class="delta ${delta > 0 ? "up" : "down"}">Mathélo ${delta > 0 ? "+" : ""}${delta}</span>` : "";
    // Élève en difficulté (13.11) : erreur reconnue, et « on le fait ensemble » (sous-questions guidées) avant la correction complète.
    const guided = !solved && q.guide && q.guide.length;
    // Sans guide interactif : correction dévoilée étape par étape (étape 0, 14.11).
    const solSteps = !solved && !guided && splitSol(q.sol);
    fb.innerHTML = `<div class="fb ${solved ? "ok" : "bad"} pop"><div class="spread"><b>${solved ? (tries === 1 ? pick(PRAISE) : "Juste au deuxième essai.") : dontKnow ? "Voici la méthode." : "Pas cette fois."}</b>${d}</div>
      ${!solved && lastDiag ? `<div class="diag">🔎 ${esc(lastDiag)}</div>` : ""}
      ${guided ? `<button class="btn-primary" id="guide">🪜 On le fait ensemble, pas à pas</button><div id="gsteps" class="stack"></div><details class="solfull"><summary>Voir directement la correction</summary><div class="sol">${q.sol}</div></details>` : solSteps ? `<button class="btn-primary" id="solstep">🪜 Voir la correction étape par étape</button><div id="ssteps" class="stack"></div><details class="solfull"><summary>Voir directement la correction</summary><div class="sol">${q.sol}</div></details>` : `<div class="sol">${q.sol}</div>`}</div>
      <div class="vote"><span>Cette question était… <button data-v="up" aria-label="Bonne question">👍</button> <button data-v="down" aria-label="Question à revoir">👎</button></span><span class="code" title="Code de la question">${code}</span></div>${commentBox()}
      <div class="actions">${solved ? "" : '<button id="redo">Refaire avec d\'autres valeurs</button>'}<button class="btn-primary" id="nx">Continuer</button></div>`;
    typeset(fb);
    fb.querySelectorAll(".vote button").forEach((b) => (b.onclick = () => { vote(code, b.dataset.v); fb.querySelectorAll(".vote button").forEach((x) => x.setAttribute("aria-pressed", x === b)); }));
    bindComment(fb, code);
    document.getElementById("nx").onclick = () => opt.onNext(false);
    const r = document.getElementById("redo");
    if (r) r.onclick = () => { sigAide(S, "x"); opt.onNext(true); };
    const sf = fb.querySelector("details.solfull"); if (sf) sf.addEventListener("toggle", () => { if (sf.open) sigAide(S, "s"); });
    // Pas à pas (demande du 15.11) : tout ce qui sépare l'énoncé des étapes est replié (réponse, clavier, rappel,
    // diagnostic), pour garder l'énoncé en lecture directe juste au-dessus des étapes ; un bouton le rouvre.
    const fold = (box) => {
      const els = [app.querySelector(".card .answer"), fb.querySelector(".fb > .spread"), fb.querySelector(".diag")].filter(Boolean);
      els.forEach((e) => (e.style.display = "none"));
      app.querySelectorAll(".card details:not(.solfull)").forEach((d) => (d.open = false));
      const lesson = app.querySelector(".card details.lesson, .card .lesson-details"); if (lesson) lesson.style.display = "none";
      const tg = document.createElement("button");
      tg.type = "button"; tg.className = "btn-ghost small fold-toggle"; tg.textContent = "Afficher ma réponse";
      tg.onclick = () => { const show = els[0] && els[0].style.display === "none"; els.forEach((e) => (e.style.display = show ? "" : "none")); if (lesson) lesson.style.display = show ? "" : "none"; tg.textContent = show ? "Replier ma réponse" : "Afficher ma réponse"; };
      box.parentNode.insertBefore(tg, box);
      const qt = app.querySelector(".qtext"); if (qt) qt.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const gb = document.getElementById("guide");
    if (gb) { gb.onclick = () => { sigAide(S, "g"); gb.remove(); fold(document.getElementById("gsteps")); runGuide(q, document.getElementById("gsteps"), () => { const rd = document.getElementById("redo"); if (rd) { rd.classList.add("btn-primary"); rd.textContent = "À toi : une question du même type"; rd.focus(); } }); }; gb.focus(); }
    else if (solSteps) {
      const sb = document.getElementById("solstep"), box = document.getElementById("ssteps");
      let k = 0, folded = false;
      const more = () => {
        if (!folded) { folded = true; fold(box); }
        box.insertAdjacentHTML("beforeend", `<div class="gstep"><span class="small muted">Étape ${k + 1} sur ${solSteps.length}</span><div class="sol">${solSteps[k]}</div></div>`);
        typeset(box); k++; sigAide(S, "e");
        if (k < solSteps.length) { sb.textContent = "Étape suivante (essaie d'abord de la trouver)"; sb.focus(); }
        else { sb.remove(); fb.querySelector("details.solfull").remove(); const rd = document.getElementById("redo"); if (rd) { rd.classList.add("btn-primary"); rd.textContent = "À toi : une question du même type"; rd.focus(); } }
      };
      sb.onclick = more; sb.focus();
    }
    else document.getElementById("nx").focus();
  };

  const check = () => {
    if (finished) return;
    const v = inp.value.trim();
    if (!v) return;
    const r = checkAnswer(q.spec, v);
    if (r.status === "correct") { tries++; return end(true); }
    if (r.status === "invalid" || r.status === "form") {
      if (S) S.illis = (S.illis || 0) + 1;
      fb.innerHTML = `<div class="fb hint pop"><b>${r.status === "form" ? "Presque" : "Je n'arrive pas à lire ta réponse"}</b><span>${esc(r.message || "")}</span></div>`;
      return;
    }
    tries++;
    const ez = document.getElementById("easy"); if (ez) ez.remove();
    const ny = document.getElementById("notyet"); if (ny) ny.remove();
    const diag = r.status === "wrong" || (r.status === "close" && q.spec.kind === "set") ? diagnose(q, v) : null;
    lastDiag = diag;
    if (S && !S.rep1) { S.rep1 = sigRep(v); S.diag = diag ? 1 : 0; }
    if (opt.single || tries >= 2) return end(false);
    fb.innerHTML = `<div class="fb hint pop"><b>${r.status === "close" ? "Presque !" : "Pas encore. Réessaie !"}</b><span>${escT(diag || r.message || "")}</span><span><b>Indice</b> · ${escT(q.hint)}</span></div>`;
    typeset(fb);
    inp.select();
  };
  document.getElementById("check").onclick = check;
  document.getElementById("idk").onclick = () => { if (!finished) end(false, true); };
  const ny = document.getElementById("notyet");
  if (ny) ny.onclick = () => { if (!finished && tries === 0) { finished = true; if (S) { S.issue = "pasvu"; S.sec = sigSec(S); } opt.onNotYet(); } };
  const ez = document.getElementById("easy");
  if (ez) ez.onclick = () => { if (!finished && tries === 0) { finished = true; if (S) { S.issue = "facile"; S.sec = sigSec(S); } opt.onEasy(); } };
}

// « On le fait ensemble » : une sous-question à la fois ; juste ou non, on montre l'étape et on continue.
function runGuide(q, box, done) {
  let k = 0;
  const step = () => {
    if (k >= q.guide.length) { box.insertAdjacentHTML("beforeend", `<div class="gstep ok"><b>Bravo, tu as reconstruit la solution.</b><div class="sol">${q.sol}</div></div>`); typeset(box); done(); return; }
    const g = q.guide[k], id = "gs" + k;
    // Saisie de l'étape (15.11) : comme la question principale — champ large, aperçu, clavier de l'app (repliée au-dessus).
    const fine = window.matchMedia("(pointer: fine)").matches, ks = g.spec.kind === "value" && !g.spec.sci ? { ...g.spec, final: true } : g.spec; // notation scientifique : clavier avec puissances
    box.insertAdjacentHTML("beforeend", `<div class="gstep" id="${id}"><span class="small muted">Étape ${k + 1} sur ${q.guide.length}</span><div>${g.ask}</div>
      <div class="answer gans"><input class="ans gin" inputmode="${fine ? "text" : "none"}" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Ta réponse…" aria-label="Réponse de l'étape">
      <div class="preview gprev"></div>${keypadHtml(ks).replace(' id="kp"', "")}
      <div class="actions"><button class="btn-primary gok">Valider l'étape</button></div></div><div class="gfb"></div></div>`);
    typeset(box);
    const el = document.getElementById(id), inp = el.querySelector("input"), fbk = el.querySelector(".gfb"), gprev = el.querySelector(".gprev");
    let gmode = fine ? "text" : "none";
    const gshow = () => previewOf(inp, gprev, g.spec);
    inp.oninput = gshow;
    el.querySelectorAll(".keypad button").forEach((b) => (b.onclick = () => {
      if (inp.disabled) return;
      const kk = b.dataset.k;
      if (kk === "⌨") { gmode = gmode === "none" ? "text" : "none"; inp.setAttribute("inputmode", gmode); inp.blur(); inp.focus(); return; }
      typeKey(inp, kk); gshow();
    }));
    const go = () => {
      const v = inp.value.trim(); if (!v) return;
      const r = checkAnswer(g.spec, v);
      if (r.status === "invalid") { fbk.innerHTML = `<span class="small">${esc(r.message || "Réponse illisible.")}</span>`; return; }
      inp.disabled = true; el.querySelector(".gok").remove(); const kp = el.querySelector(".keypad"); if (kp) kp.remove(); gprev.remove();
      fbk.innerHTML = `<div class="${r.status === "correct" ? "gok-msg" : "gno-msg"}">${r.status === "correct" ? "✓ Oui." : "Pas tout à fait."} ${g.sol}</div>`;
      typeset(fbk); k++; step();
    };
    el.querySelector(".gok").onclick = go;
    inp.onkeydown = (e) => { if (e.key === "Enter") go(); };
    inp.focus({ preventScroll: true });
    if (k > 0) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };
  step();
}

// Petit message éphémère.
function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast pop"; t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2200);
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

// Identifiant anonyme de l'appareil (aléatoire, sans lien avec une personne) : sert uniquement à compter les testeurs.
function deviceId() {
  try {
    let id = localStorage.getItem("m2m-device");
    if (!id) { id = Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4); localStorage.setItem("m2m-device", id); }
    return id;
  } catch (e) { return ""; }
}
function ping(ev, extra = {}) {
  try {
    if (!VOTE_ENDPOINT || location.protocol !== "https:" || /claude/.test(location.hostname)) return;
    if (ev === "open") { if (localStorage.getItem("m2m-ping") === day()) return; localStorage.setItem("m2m-ping", day()); }
    fetch(VOTE_ENDPOINT, { method: "POST", mode: "no-cors", body: JSON.stringify({ ev, dev: deviceId(), date: day(), ...extra }) }).catch(() => {});
  } catch (e) {}
}

// Signaux muets (20.11) : ce que les élèves font sans le dire, pour repérer les questions qui posent problème.
// Une ligne anonyme par question jouée (issue, essais, réponses illisibles, durée, aide utilisée, 1re réponse fausse)
// et par leçon (durée, devine / défis / passé). Rien de nominatif ; un mot tapé à la place d'un calcul est remplacé par
// « [texte] ». La ligne part quand l'élève quitte l'écran ; un instantané part aussi si l'app passe en arrière-plan
// (même uid : l'analyse garde la dernière). Consultation par lien (#q-…, #l-…) et démo de l'accueil : rien n'est envoyé.
// Codes : issue ok1 / ok2 / faux / partiel / idk (je ne sais pas) / facile / pasvu / quitte (écran quitté sans répondre) / lue ;
// aide : r rappel ouvert, g pas à pas guidé, e une étape de correction (répété), s correction complète, x refaire ;
// leçon active : D devine juste / d devine faux, f un défi réussi (répété), P défis passés.
var sig = null;
const sigSec = (S) => Math.round((Date.now() - S.t0) / 1000);
const sigAide = (S, c) => { if (S && !(c !== "e" && c !== "f" && S.aide.includes(c))) S.aide += c; };
function sigRep(v) {
  const s = String(v || "").replace(/\s+/g, " ").trim().slice(0, 24);
  return /[a-zà-ÿ]{3,}/i.test(s.toLowerCase().replace(/sqrt|racine|sin|cos|tan|log|ln|pi/g, "")) ? "[texte]" : s;
}
function sigSend(S) {
  if (!S || !canSend()) return;
  const p = state && state.profile, niveau = p ? gradeName(p) + (p.track === "mp" ? " MP" : "") : "";
  const { t0, ...rec } = S;
  try { fetch(VOTE_ENDPOINT, { method: "POST", mode: "no-cors", keepalive: true, body: JSON.stringify({ ...rec, sec: S.sec != null ? S.sec : sigSec(S), niveau, dev: deviceId(), date: day() }) }).catch(() => {}); } catch (e) {}
}
function sigOpen(rec) { sigClose(); sig = { uid: Math.random().toString(36).slice(2, 10), t0: Date.now(), aide: "", issue: "", ...rec }; return sig; }
function sigClose() { if (!sig) return; if (!sig.issue) sig.issue = "quitte"; sigSend(sig); sig = null; }
function sigWatchLesson(S) { if (S) app.querySelectorAll(".card details.lesson").forEach((d) => d.addEventListener("toggle", () => { if (d.open) sigAide(S, "r"); })); }
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden" && sig) sigSend({ ...sig, issue: sig.issue || "quitte" }); });

// Commentaire libre (facultatif) : envoyé avec le code de la question, la classe et l'identifiant anonyme de l'appareil.
// Envois vers la feuille Google : seulement depuis le site publié (jamais depuis les pages de test ni claude.ai).
const canSend = () => VOTE_ENDPOINT && location.protocol === "https:" && !/claude/.test(location.hostname);
const commentBox = (title = "💬 Un commentaire sur cette question ?", ph = "Une erreur, une consigne pas claire, une idée… (n'écris pas ton nom)", code = "") =>
  `<details class="cmt"${code ? ` data-code="${code}"` : ""}><summary>${title}</summary><textarea class="cmt-t" maxlength="500" rows="3" placeholder="${ph}"></textarea>
  <div class="spread"><span class="small muted cmt-ok"></span><button class="small cmt-s">Envoyer</button></div></details>`;
function bindComment(root, code) {
  root.querySelectorAll("details.cmt").forEach((box) => {
    const b = box.querySelector(".cmt-s"), ta = box.querySelector(".cmt-t"), ok = box.querySelector(".cmt-ok");
    if (!b || b.dataset.bound) return;
    b.dataset.bound = 1;
    b.onclick = () => {
      const text = ta.value.trim();
      if (!text) { ok.textContent = "Écris d'abord ton commentaire."; return; }
      comment(box.dataset.code || code, text);
      ta.value = ""; ta.disabled = true; b.disabled = true; ok.textContent = "Merci ! Ton commentaire est envoyé.";
    };
  });
}
// Rappel de cours : « clair » ou « pas compris » (+ commentaire). « Pas compris » : la leçon sera reproposée.
function bindLessonFeedback(root) {
  root.querySelectorAll(".lfb").forEach((box) => {
    if (box.dataset.bound) return;
    box.dataset.bound = 1;
    const id = box.dataset.id;
    box.querySelectorAll("button[data-v]").forEach((b) => (b.onclick = () => {
      vote("lecon-" + id, b.dataset.v === "up" ? "up" : "down");
      box.querySelectorAll("button[data-v]").forEach((x) => x.setAttribute("aria-pressed", x === b));
      const msg = box.querySelector(".lfb-msg");
      if (b.dataset.v === "down") {
        if (state && state.notions[id]) { state.notions[id].lessonSeen = false; Badges.onLessonDown(state, id); save(); }
        msg.textContent = "Merci. Dis-nous ce qui n'est pas clair : on améliorera ce rappel.";
        const d = box.parentNode.querySelector("details.cmt"); if (d) d.open = true;
      } else msg.textContent = "Merci !";
    }));
  });
  bindComment(root, "");
}

function comment(code, text) {
  try {
    const p = state && state.profile, niveau = p ? gradeName(p) + (p.track === "mp" ? " MP" : "") : "";
    state.comments = (state.comments || []).concat({ code, text, date: day() }).slice(-50);
    Badges.onFeedback(state);
    save();
    if (canSend()) fetch(VOTE_ENDPOINT, { method: "POST", mode: "no-cors", body: JSON.stringify({ ev: "comment", code, text: text.slice(0, 500), niveau, dev: deviceId(), date: day() }) }).catch(() => {});
  } catch (e) {}
}

function vote(code, v) {
  try {
    state.votes = state.votes || {};
    if (v !== "facile") Badges.onFeedback(state);
    state.votes[code] = { v, date: day() };
    save();
    if (canSend()) fetch(VOTE_ENDPOINT, { method: "POST", mode: "no-cors", body: JSON.stringify({ code, vote: v, date: day(), dev: deviceId() }) }).catch(() => {});
  } catch (e) {}
}

// Début et fin de séance (anonymes) : classe, format ; à la fin, nombre de questions, score, durée en minutes.
const sessionInfo = () => ({ niveau: state ? gradeName(state.profile) + (state.profile.track === "mp" ? " MP" : "") : "", fmt: session.ctest ? "competence" : session.prep ? "test" : session.weekly ? "semaine" : session.fmt || "" });
function screenSummary() {
  if (session && session.weekly && state) { state.weeklyDone = weekKey(); save(); }
  ping("session", { ...sessionInfo(), n: session.answered, score: session.score, min: Math.max(1, Math.round((Date.now() - session.start) / 6e4)) });
  Badges.check(state); save();
  const nb = newBadgesCard();
  const n = session.answered, sc = session.score, d = state.elo.r - session.elo0;
  h(`${brand}<h2>${sc >= n * 0.8 ? "Excellente séance !" : sc >= n * 0.5 ? "Bonne séance." : "Séance faite : c'est en pratiquant qu'on progresse."}</h2>
  <div class="card flat streak"><span class="flame">🔥</span><div><b>${state.streak.count} ${state.streak.count > 1 ? "jours" : "jour"}</b> <span class="muted">d'affilée</span><div class="small muted">À demain pour ta question du jour.</div></div></div>
  <div class="card stack"><div class="spread"><span>Score</span><b>${String(sc).replace(".", ",")} / ${n}</b></div>
  <div class="spread"><span>Mathélo</span><b>${state.elo.r} <span class="delta ${d >= 0 ? "up" : "down"}">${d >= 0 ? "+" : ""}${d}</span></b></div>
  <div class="small muted">Notions travaillées : ${[...session.ids].map((id) => NOTIONS.find((x) => x.id === id).label).join(" · ")}</div></div>
  ${session.ctest ? (() => { const a = compNote((state.comps || {})[session.ctest.cid]), b = session.ctest.before; return `<div class="card flat"><div class="spread"><span>${esc(session.ctest.label)}</span><span class="note ${noteCls(a)}">${noteTxt(a)}</span></div><div class="small muted">${a === null ? "La note apparaît après 3 réponses sur cette compétence." : b === null ? "Première note pour cette compétence." : a > b ? "En progrès : " + noteTxt(b) + " → " + noteTxt(a) + "." : a < b ? "Avant : " + noteTxt(b) + ". Elle remontera avec la pratique." : "Note stable."}</div><button id="backcomps" class="btn-big">Retour à mes compétences</button></div>`; })() : ""}
  ${nb}
  <div class="card flat">${commentBox("Une remarque sur l'application ?", "Ce qui te plaît, ce qui te gêne, une idée… (n'écris pas ton nom)", "app")}</div>
  <button class="btn-primary btn-big" id="home">Retour à l'accueil</button>`);
  bindComment(app, "app");
  if (nb) setTimeout(burst, 250);
  document.getElementById("home").onclick = screenHome;
  if (document.getElementById("backcomps")) document.getElementById("backcomps").onclick = screenComps;
}

// Consultation d'une question par son code : adresse …/#q-eq2disc-2-k3f (rien n'est enregistré).
function showCode() {
  // Consultation d'une leçon (active ou rappel) : …/#l-vitesse (lien du tableau de suivi, 15.11).
  const ml = /^#l-([a-z0-9]+)$/.exec(location.hash);
  if (ml && typeof LESSONS !== "undefined" && LESSONS[ml[1]]) { screenLesson(ml[1], () => { history.replaceState(null, "", location.pathname); state && state.placed ? screenHome() : screenWelcome(); }, false, false); return true; }
  const m = /^#q-(.+)$/.exec(location.hash);
  if (!m) return false;
  let q = Engine.fromCode(m[1]);
  // Même exigence qu'en séance (commentaire testeur du 15.11) : au CO, on donne le résultat, pas le calcul.
  if (q) { const n = NOTIONS.find((x) => x.id === q.id), y = n && n.CH && n.CH[0]; if (y && y <= 11) q = Engine.finalize({ profile: { system: "CH", grade: y } }, q.id, q); }
  if (!q) { h(`${brand}<div class="card flat"><h3>Code inconnu</h3><p class="muted">« ${esc(m[1])} » ne correspond à aucune question.</p></div>`); return true; }
  const back = () => { history.replaceState(null, "", location.pathname); state && state.placed ? screenHome() : screenWelcome(); };
  renderQuestion(q, { eyebrow: "Question " + q.code + " (consultation)", onDone: () => 0, onNext: back });
  return true;
}
window.addEventListener("hashchange", () => showCode() || restoreFromHash());

// Application installable (hors claude.ai) : cache hors ligne.
if ("serviceWorker" in navigator && location.protocol === "https:" && !/claude/.test(location.hostname)) navigator.serviceWorker.register("sw.js").catch(() => {});

// Démarrage
ping("open");
if (!showCode() && !restoreFromHash()) { if (state && state.placed) screenHome(); else { state = null; screenWelcome(); } }
