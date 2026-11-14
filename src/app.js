// Interface : entrée (niveau, positionnement), accueil, séance, bilan, compétences.
// Point de collecte des votes 👍 / 👎 : laisser vide tant qu'aucun n'est configuré (votes gardés sur l'appareil).
const VOTE_ENDPOINT = "https://script.google.com/macros/s/AKfycbym3jQKGDc1RrOsR7gqEVGIeAbBF0cML8VEDYtQfaOmO0743jRcmeHSQ-WglFVCb-dd/exec";

const app = document.getElementById("app");
let state = Store.load();
if (state && state.profile && !SYSTEMS[state.profile.system]) state = null; // système masqué (France) : on repart de zéro
if (state && state.profile && state.notions && Object.keys(state.notions).length && Engine.migrate(state)) Store.save(state);
const save = () => Store.save(state);
const h = (html) => { app.innerHTML = html; typeset(app); window.scrollTo(0, 0); bindLessonFeedback(app); bindLessonOpen(app); if (typeof bindDyn !== "undefined") bindDyn(app); };
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
  <button class="btn-primary btn-big" id="go">Commencer</button>
  <button class="btn-ghost" id="restore">J'ai déjà un code de sauvegarde</button>
  <button class="btn-ghost small" id="privacy">🔒 Ce que l'app envoie</button>`);
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
    state = Engine.newState({ system: draft.system, grade: draft.grade, track: draft.track, minutes: draft.minutes });
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
      eyebrow: "Étape 2 sur 2 · positionnement " + (i + 1) + "/" + plan.length, single: true,
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
  <div class="stack"><b>${eloLabel(state.profile, e.r)}</b>${spark}</div></div>`;
}
function themeBars(lv) {
  return Object.entries(lv).map(([th, m]) => `<div class="bar"><span>${Engine.themeLabel(th, state.profile)}</span><span class="track"><i style="width:${Math.round(m * 100)}%"></i></span></div>`).join("");
}

function screenHome() {
  if (!state) return screenWelcome();
  Badges.check(state);
  const today = day(), done = state.history.find((x) => x.date === today);
  const s = state.streak, alive = s.last === today || s.last === addDays(today, -1), wp = Engine.weeklyProblem(state), fmt = Engine.todayFormat(state);
  save();
  h(`<div class="spread">${brand}<span class="small muted">${SYSTEMS[state.profile.system].label} · ${gradeName(state.profile)}</span></div>
  <div class="card flat streak"><span class="flame" aria-hidden="true">${alive && s.count ? "🔥" : "✏️"}</span><div><b>${alive ? s.count : 0} ${(alive ? s.count : 0) > 1 ? "jours" : "jour"}</b> <span class="muted">d'affilée</span><div class="small muted">${done ? "Séance du jour faite : " + done.n + " question" + (done.n > 1 ? "s" : "") + ". Tu peux en refaire une." : "Ta séance du jour t'attend."}</div></div></div>
  <div class="card">${eloBlock()}</div>
  ${nowCard()}
  <div class="card stack"><div class="eyebrow">${done ? "Séance faite · tu peux en refaire une" : "Ton programme aujourd'hui"}</div>
  <h2>${FORMATS[fmt].label}</h2><p class="muted">${FORMATS[fmt].text} </p>
  <button class="btn-primary btn-big" id="go">${done ? "Encore une séance" : "C'est parti"}</button>
  <div class="spread"><span class="small muted">Varié d'un jour à l'autre, équilibré sur la semaine.</span><button class="btn-ghost small" id="other">Autre format</button></div></div>
  ${Engine.prepActive(state) ? (() => { const left = Math.round((new Date(state.prep.date) - new Date(today)) / 864e5); return `<div class="card flat stack"><div class="eyebrow">Je prépare mon test</div><h3>${left === 0 ? "Test aujourd'hui" : left === 1 ? "Test demain" : "Test dans " + left + " jours"} · ${state.prep.ids.length} notion${state.prep.ids.length > 1 ? "s" : ""}</h3><p class="small muted">${state.prep.ids.map((id) => NOTIONS.find((n) => n.id === id).label).join(" · ")}</p><div class="row"><button class="btn-primary" id="prepgo">Séance de révision</button><button class="btn-ghost" id="prepedit">Modifier</button></div></div>`; })() : ""}
  ${wp ? `<div class="card flat stack"><div class="eyebrow">Problème de la semaine</div><h3>${NOTIONS.find((n) => n.id === wp).label}</h3><p class="small muted">Un problème en plusieurs étapes, avec indices. Facultatif, et il rapporte gros.</p><button id="wp">Relever le défi</button></div>` : ""}
  ${newBadgesCard()}
  ${compsCard()}
  <div class="stack">${Engine.prepActive(state) ? "" : '<button id="prep">Je prépare un test</button>'}<button id="backup">💾 Sauvegarder ou transférer ma progression</button><button id="level">Changer de classe ou d'école</button>
  <div class="confirm" id="reset"><button class="btn-ghost" id="r1">Tout effacer</button><button class="btn-ghost" id="privacy">🔒 Ce que l'app envoie</button></div></div>`);
  document.getElementById("privacy").onclick = () => screenPrivacy(screenHome);
  document.getElementById("go").onclick = startSession;
  bindNowCard();
  document.getElementById("other").onclick = () => { Engine.otherFormat(state); save(); screenHome(); };
  if (wp) document.getElementById("wp").onclick = () => { session = { plan: [wp], i: 0, score: 0, answered: 0, start: Date.now(), elo0: state.elo.r, ids: new Set(), weekly: true }; nextQuestion(); };
  document.getElementById("comps").onclick = screenComps;
  document.getElementById("backup").onclick = screenBackup;
  const byId = (x) => document.getElementById(x);
  if (byId("prep")) byId("prep").onclick = screenPrep;
  if (byId("prepedit")) byId("prepedit").onclick = screenPrep;
  if (byId("prepgo")) byId("prepgo").onclick = () => { session = { plan: Engine.planPrep(state), i: 0, score: 0, answered: 0, start: Date.now(), elo0: state.elo.r, ids: new Set(), prep: true }; nextQuestion(); };
  document.getElementById("level").onclick = () => { draft = { ...state.profile }; screenLevel(); };
  document.getElementById("r1").onclick = () => {
    document.getElementById("reset").innerHTML = '<span class="small">Effacer ta progression et ton Mathélo ?</span><button id="r2">Oui, effacer</button><button class="btn-ghost" id="r3">Non</button>';
    document.getElementById("r2").onclick = () => { Store.clear(); try { localStorage.removeItem("m2m-device"); localStorage.removeItem("m2m-ping"); } catch (e) {} state = null; screenWelcome(); };
    document.getElementById("r3").onclick = screenHome;
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
  Badges.check(state); state.badgesNew = []; save();
  h(`${brand}<h2>Mes <span class="mark">compétences</span></h2>
  <p class="muted">Chaque compétence reçoit une note de 1 à 6 dès que tu y as répondu 3 fois. La note suit tes 8 dernières réponses : elle monte quand tu progresses.</p>
  ${badgesSection()}
  <div class="card flat"><div class="spread"><span>Cette année</span><b>${st.tested} / ${st.total} notées${st.avg !== null ? " · moyenne " + String(Math.round(st.avg * 10) / 10).replace(".", ",") : ""}</b></div></div>
  ${block(cur)}
  ${old.length ? `<details class="olds"><summary>Années précédentes (${compStats(old.map((c) => c.id)).tested} notées)</summary>${block(old)}</details>` : ""}
  <button class="btn-primary btn-big" id="back">Retour</button>`);
  bindBadges(app);
  // « Me tester » (14.11, demande de l'utilisateur) : 3 questions de la compétence, au niveau de la compétence.
  app.querySelectorAll(".ctest").forEach((b) => (b.onclick = () => {
    const id = b.dataset.id, d = +b.dataset.d, cid = id + ":" + (d - 1);
    session = { plan: [1, 2, 3].map(() => id + "|" + d), i: 0, score: 0, answered: 0, start: Date.now(), elo0: state.elo.r, ids: new Set(), prep: true,
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
  root.querySelectorAll("details.lesson[data-id]").forEach((d) => d.addEventListener("toggle", () => { if (d.open && state) { Badges.onLesson(state, d.dataset.id); Badges.check(state); save(); } }));
}

// ---------------- Ce que l'app envoie (13.11) ----------------
function screenPrivacy(back) {
  h(`${brand}<h2>Ce que l'app <span class="mark">envoie</span></h2>
  <p class="muted">Pas de compte, pas de nom, pas d'adresse e-mail. Ta progression reste sur ton appareil.</p>
  <div class="card flat stack"><b>Ce qui reste sur ton appareil</b>
  <ul class="plain"><li>Tes réponses, tes notes de compétences, tes badges, ton Mathélo et ta classe.</li>
  <li>Rien de tout cela n'est envoyé. Le code de sauvegarde, lui aussi, n'est envoyé nulle part : c'est toi qui le gardes.</li></ul></div>
  <div class="card flat stack"><b>Ce qui est envoyé, de façon anonyme</b>
  <span class="small muted">Vers un tableau tenu par l'auteur de l'app (Google Sheets), pour l'améliorer pendant la phase de test :</span>
  <ul class="plain"><li><b>Un signal d'ouverture</b> (au plus une fois par jour) et <b>un signal de fin de séance</b>, avec la date et un identifiant tiré au hasard, propre à cet appareil. Il sert seulement à compter combien de personnes testent l'app.</li>
  <li><b>Le début et la fin de chaque séance</b>, avec ta classe et le format ; à la fin, le nombre de questions, le score et la durée en minutes. Ni les questions, ni tes réponses. Ça sert à savoir si les séances sont trop longues ou trop difficiles.</li>
  <li><b>Tes avis</b> 👍 / 👎, « trop facile » et « pas compris », avec le code de la question ou du rappel et le même identifiant.</li>
  <li><b>Tes commentaires</b>, si tu en écris, avec ta classe (par exemple « 10e ») et le même identifiant. N'y écris pas ton nom.</li>
  <li><b>Ton chapitre du moment</b>, si tu en choisis un : les notions, ta classe et le mois, sans identifiant. Ça sert à proposer les notions dans l'ordre où elles se font vraiment en classe.</li></ul></div>
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
  if (!Engine.nowActive(state)) return `<div class="card flat stack now-card"><div class="eyebrow">En ce moment en classe</div>
    <p class="small">Dis-moi ce que vous faites en classe : tes séances s'y concentreront.</p><button id="nowpick">Choisir mon chapitre</button></div>`;
  const labels = state.now.ids.map(nLabel).join(" · ");
  if (Engine.nowStale(state)) return `<div class="card flat stack now-card"><div class="eyebrow">En ce moment en classe</div>
    <h3>Toujours sur ${state.now.ids.length > 1 ? "ces notions" : "cette notion"} ?</h3><p class="small muted">${labels}</p>
    <div class="row"><button class="btn-primary" id="nowyes">Oui, toujours</button><button id="nowpick">On est passés à autre chose</button></div></div>`;
  return `<div class="card flat stack now-card"><div class="spread"><div class="eyebrow">En ce moment en classe</div><button class="btn-ghost small" id="nowpick">Changer</button></div>
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
  const groups = Engine.themeOrder(cur, state.profile).map((th) => [th, cur.filter((c) => c.theme === th && !sug.includes(c.id)).sort((a, b) => Engine.rank(p, a.id) - Engine.rank(p, b.id))]).filter(([, l]) => l.length);
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
    const on = inputs.filter((x) => x.checked);
    if (on.length > 3) { i.checked = false; document.getElementById("nerr").textContent = "3 notions au plus : décoche-en une d'abord."; } else document.getElementById("nerr").textContent = "";
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
  return `<p>${L.intro}</p>${fig}<div class="rule"><b>À retenir</b>${(() => { const ss = sentences(L.regle); return ss.length > 1 ? "<ul>" + ss.map((x) => "<li>" + x + "</li>").join("") + "</ul>" : " · " + L.regle; })()}</div>
  <div class="ex-list">${L.exemple.map((e) => `<div>${e}</div>`).join("")}</div>
  <div class="trap"><b>Piège</b> · ${L.piege}</div>
  <div class="lfb" data-id="${id}"><span class="small muted">Ce rappel est…</span><button class="small" data-v="up">👍 clair</button><button class="small" data-v="down">🤔 pas compris</button><span class="small muted lfb-msg"></span></div>
  ${commentBox("💬 Un commentaire sur ce rappel ?", "Ce qui n'est pas clair, un exemple qui manque… (n'écris pas ton nom)", "lecon-" + id)}`;
}
const lessonDetails = (id) => (LESSONS[id] ? `<details class="lesson" data-id="${id}"><summary>📖 Rappel de cours</summary><div class="stack">${lessonBody(id)}</div></details>` : "");
function screenLesson(id, cont) {
  const L = LESSONS[id];
  if (state) { Badges.onLesson(state, id); save(); }
  h(`${brand}<div class="eyebrow">Nouvelle notion · 30 secondes de cours</div>
  <div class="card pop lesson-card"><h2>${L.titre}</h2>${lessonBody(id)}</div>
  <button class="btn-primary btn-big" id="go">J'ai compris, à moi !</button>`);
  document.getElementById("go").onclick = cont;
}

// ---------------- Séance ----------------
let session = null;
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
  if (!redo && LESSONS[id] && ns && !ns.lessonSeen && (ns.status === "encours" || ns.m < 0.4)) {
    state.notions[id].lessonSeen = true; save();
    return screenLesson(id, () => { session.lessonShown = id; nextQuestion(); });
  }
  const q = redo ? Engine.make(state, id, redo.d === 4 ? 4 : Math.max(1, redo.d - 1)) : Engine.make(state, id, session.weekly || forceProb ? 4 : level);
  q.kind = kind;
  renderQuestion(q, {
    eyebrow: (session.weekly ? "Problème de la semaine" : session.ctest ? "Me tester · " + session.ctest.label + " · " + (session.i + 1) + " sur " + session.plan.length : session.prep ? "Révision du test · " + (session.i + 1) + " sur " + session.plan.length : session.plan.length === 1 ? (session.fmt ? FORMATS[session.fmt].label : "Question du jour") : (session.fmt ? FORMATS[session.fmt].label + " · " : "") + (session.i + 1) + " sur " + session.plan.length) + (kind && KIND_LABEL[kind] ? " · " + KIND_LABEL[kind] : "") + (ns && !session.prep && !Engine.isRecent(state, id) ? " · 🔙 Rappel" : "") + (redo ? " · nouvelles valeurs" : ""),
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
  if (!spec.round && !spec.plain && !/exact|fraction|arrondi|au centième|au dixième/i.test(t)) {
    const vals = spec.kind === "value" ? [spec.value] : spec.kind === "set" || spec.kind === "pair" ? spec.values : [];
    if (vals.some((v) => isFinite(v) && !isTerm(v))) notes.push("Réponse exacte attendue : fraction ou racine, pas d'arrondi.");
  }
  return notes.join(" ");
}
// Clavier « intervalles » (13.11) : domaines, inéquations, ensembles de solutions. « | » = place du curseur après insertion.
const SET_KEYS = ["7", "8", "9", "-", "+", "/", "⌫", "4", "5", "6", "[", "]", ";", "∞", "1", "2", "3", "x", "<", ">", "∪",
  "0", ",", "≤", "≥", "≠", "=", "ℝ \\ {|}", "ℝ", "∅", "√", "⌨"];
const KEY_LABEL = { "*": "×", "ℝ \\ {|}": "ℝ∖{ }" };
const keyBtn = (k, set) => `<button type="button" class="${/^[\d,]$/.test(k) ? "" : "k-op"}${k === "0" || (k === "⌨" && !set) || k === "ℝ \\ {|}" || (k === "⌨" && set) ? " k-wide" : ""}" data-k="${esc(k)}">${KEY_LABEL[k] || k}</button>`;
const isSetSpec = (spec) => !!spec && (spec.kind === "solset" || spec.kind === "ineq");
const keysFor = (spec) => (isSetSpec(spec) ? SET_KEYS.map((k) => keyBtn(k, true)) : KEYS.map((k) => keyBtn(k))).join("");
const keypadHtml = (spec) => `<div class="keypad${isSetSpec(spec) ? " k-set" : ""}" id="kp">${keysFor(spec)}</div>`;
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
  return "\\(" + Expr.tex(t) + "\\)" + (val !== "" && isFinite(val) ? `<span class="val">≈ ${String(+val.toPrecision(8)).replace(".", ",")}</span>` : "");
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
  const fb = document.getElementById("fb");
  q.parts.forEach((p, i) => {
    const inp = document.getElementById("p" + i), pv = document.getElementById("pv" + i);
    // Clavier adapté à la partie active (intervalles ou calcul).
    inp.onfocus = () => {
      active = inp;
      const kp = document.getElementById("kp"), set = isSetSpec(p.spec);
      if (kp.classList.contains("k-set") !== set) { kp.classList.toggle("k-set", set); kp.innerHTML = keysFor(p.spec); bindKp(); }
    };
    let tm; inp.oninput = () => { clearTimeout(tm); tm = setTimeout(() => previewOf(inp, pv, p.spec), 180); };
    inp.onkeydown = (e) => { if (e.key === "Enter") check(); };
  });
  active = document.getElementById("p0");
  const bindKp = () => bindKeypad(() => active, (inp) => previewOf(inp, document.getElementById("pv" + inp.id.slice(1)), q.parts[+inp.id.slice(1)].spec));
  bindKp();
  const end = (giveUp) => {
    finished = true;
    app.querySelectorAll("input.ans, #kp button, #check, #idk").forEach((b) => (b.disabled = true));
    const frac = ok.filter(Boolean).length / q.parts.length, factor = [1, 1, 2 / 3, 1 / 3][Math.min(tries, 3)] || 1 / 3;
    const score = giveUp && tries === 0 ? 0 : Math.round(frac * factor * 100) / 100;
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
    if (r) r.onclick = () => opt.onNext(true);
    const gb = document.getElementById("guide");
    if (gb) { gb.onclick = () => { gb.remove(); runGuide(q, document.getElementById("gsteps"), () => { const rd = document.getElementById("redo"); if (rd) { rd.classList.add("btn-primary"); rd.textContent = "À toi : une question du même type"; rd.focus(); } }); }; gb.focus(); }
    else if (solSteps) {
      const sb = document.getElementById("solstep"), box = document.getElementById("ssteps");
      let k = 0;
      const more = () => {
        box.insertAdjacentHTML("beforeend", `<div class="gstep"><span class="small muted">Étape ${k + 1} sur ${solSteps.length}</span><div class="sol">${solSteps[k]}</div></div>`);
        typeset(box); k++;
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
      fb.innerHTML = `<div class="fb hint pop"><b>${r.status === "form" ? "Presque" : "Je n'arrive pas à lire ta réponse"}</b><span>${esc(r.message || "")}</span></div>`;
      return;
    }
    tries++;
    const ez = document.getElementById("easy"); if (ez) ez.remove();
    const ny = document.getElementById("notyet"); if (ny) ny.remove();
    const diag = r.status === "wrong" ? diagnose(q, v) : null;
    lastDiag = diag;
    if (opt.single || tries >= 2) return end(false);
    fb.innerHTML = `<div class="fb hint pop"><b>${r.status === "close" ? "Presque !" : "Pas encore. Réessaie !"}</b><span>${esc(diag || r.message || "")}</span><span><b>Indice</b> · ${esc(q.hint)}</span></div>`;
    typeset(fb);
    inp.select();
  };
  document.getElementById("check").onclick = check;
  document.getElementById("idk").onclick = () => { if (!finished) end(false, true); };
  const ny = document.getElementById("notyet");
  if (ny) ny.onclick = () => { if (!finished && tries === 0) { finished = true; opt.onNotYet(); } };
  const ez = document.getElementById("easy");
  if (ez) ez.onclick = () => { if (!finished && tries === 0) { finished = true; opt.onEasy(); } };
}

// « On le fait ensemble » : une sous-question à la fois ; juste ou non, on montre l'étape et on continue.
function runGuide(q, box, done) {
  let k = 0;
  const step = () => {
    if (k >= q.guide.length) { box.insertAdjacentHTML("beforeend", `<div class="gstep ok"><b>Bravo, tu as reconstruit la solution.</b><div class="sol">${q.sol}</div></div>`); typeset(box); done(); return; }
    const g = q.guide[k], id = "gs" + k;
    box.insertAdjacentHTML("beforeend", `<div class="gstep" id="${id}"><span class="small muted">Étape ${k + 1} sur ${q.guide.length}</span><div>${g.ask}</div>
      <div class="row"><input class="ans gin" inputmode="decimal" autocomplete="off" aria-label="Réponse de l'étape"><button class="small gok">OK</button></div><div class="gfb"></div></div>`);
    typeset(box);
    const el = document.getElementById(id), inp = el.querySelector("input"), fbk = el.querySelector(".gfb");
    const go = () => {
      const v = inp.value.trim(); if (!v) return;
      const r = checkAnswer(g.spec, v);
      if (r.status === "invalid") { fbk.innerHTML = `<span class="small">${esc(r.message || "Réponse illisible.")}</span>`; return; }
      inp.disabled = true; el.querySelector(".gok").remove();
      fbk.innerHTML = `<div class="${r.status === "correct" ? "gok-msg" : "gno-msg"}">${r.status === "correct" ? "✓ Oui." : "Pas tout à fait."} ${g.sol}</div>`;
      typeset(fbk); k++; step();
    };
    el.querySelector(".gok").onclick = go;
    inp.onkeydown = (e) => { if (e.key === "Enter") go(); };
    inp.focus();
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
  const m = /^#q-(.+)$/.exec(location.hash);
  if (!m) return false;
  const q = Engine.fromCode(m[1]);
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
