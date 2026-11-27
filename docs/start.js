

const VOTE_ENDPOINT = "https://script.google.com/macros/s/AKfycbym3jQKGDc1RrOsR7gqEVGIeAbBF0cML8VEDYtQfaOmO0743jRcmeHSQ-WglFVCb-dd/exec";







const BUILD = "abe8841079";
const ERR_MAX = 5;
var errMem = null;



function statsOk() { try { return localStorage.getItem("m2m-stats") === "oui"; } catch (e) { return false; } }
function statsAsked() { try { return !!localStorage.getItem("m2m-stats"); } catch (e) { return true; } }
function statsSet(v) { try { localStorage.setItem("m2m-stats", v ? "oui" : "non"); } catch (e) {} }
function errCanSend() {
if (!statsOk()) return false;
try { return !!VOTE_ENDPOINT && location.protocol === "https:" && !/claude/.test(location.hostname) && !isAuthor() && !/^#(auteur|parent)/.test(location.hash); }
catch (e) { return false; }
}


const errFile = (u) => { const b = String(u || "").split(/[?#]/)[0]; return b ? (b.split("/").pop() || "page").slice(0, 40) : ""; };
const errExt = (s) => /(chrome|moz|safari(-web)?)-extension:|webkit-masked-url:/i.test(String(s || ""));

const errStack = (st) => String(st || "").split("\n").map((l) => l.trim()).filter((l) => l && !/^\w*Error\b.*:/.test(l)).slice(0, 3)
.map((l) => l.replace(/(?:https?|file|blob):\/\/[^\s)]*\/([^\s/)?#]*)(?:[?#][^\s):]*)?/g, "$1").slice(0, 120)).join(" | ");
function errRecord(msg, src, ligne, col, stack) {
msg = String(msg || "").replace(/\s+/g, " ").trim();
if (!msg || errExt(src) || errExt(stack)) return null;
if (/^Script error\.?$/i.test(msg) && !src) return null;
if (/ResizeObserver loop/.test(msg)) return null;
if (/^Promesse rejetée : (TypeError: )?(Failed to fetch|Load failed|NetworkError)/.test(msg)) return null;
let ecran = "", niveau = "";
try { ecran = String(pageCode() || "").slice(0, 40); } catch (e) {}
try { const p = state && state.profile; if (p) niveau = gradeName(p) + (p.track === "mp" ? " MP" : ""); } catch (e) {}
let dev = "", date = "";
try { dev = deviceId(); } catch (e) {}
try { date = day(); } catch (e) { date = new Date().toISOString().slice(0, 10); }
return { ev: "err", msg: msg.slice(0, 200), src: errFile(src), ligne: +ligne || 0, col: +col || 0, pile: errStack(stack), ecran, version: BUILD, niveau, dev, date };
}

function errGate(rec) {
let m = null;
try { m = JSON.parse(localStorage.getItem("m2m-err") || "null"); } catch (e) { m = errMem; }
if (!m || m.d !== rec.date) m = { d: rec.date, n: 0, m: [] };
const k = rec.msg.slice(0, 80);
if (m.n >= ERR_MAX || m.m.includes(k)) return false;
m.n++; m.m.push(k); errMem = m;
try { localStorage.setItem("m2m-err", JSON.stringify(m)); } catch (e) {}
return true;
}

function errReport(msg, src, ligne, col, stack, envoyer = errCanSend) {
try {
if (!envoyer()) return null;
const rec = errRecord(msg, src, ligne, col, stack);
if (!rec || !errGate(rec)) return null;
fetch(VOTE_ENDPOINT, { method: "POST", mode: "no-cors", keepalive: true, body: JSON.stringify(rec) }).catch(() => {});
return rec;
} catch (e) { return null; }
}





const ERRLOG_KEY = "m2m-errlog", ERRLOG_MAX = 3;
function errLogGet() {
try { const a = JSON.parse(localStorage.getItem(ERRLOG_KEY) || "[]"); return Array.isArray(a) ? a.filter((x) => x && x.msg).slice(-ERRLOG_MAX) : []; }
catch (e) { return []; }
}
function errLogPut(a) { try { localStorage.setItem(ERRLOG_KEY, JSON.stringify(a.slice(-ERRLOG_MAX))); } catch (e) {} }
function errLog(msg, src, ligne, stack) {
try {
msg = String(msg || "").replace(/\s+/g, " ").trim();
if (!msg || errExt(src) || errExt(stack) || /ResizeObserver loop/.test(msg) || (/^Script error\.?$/i.test(msg) && !src)) return null;
if (/^Promesse rejetée : (TypeError: )?(Failed to fetch|Load failed|NetworkError)/.test(msg)) return null;
let d = ""; try { d = day(); } catch (e) { d = new Date().toISOString().slice(0, 10); }
const rec = { msg: msg.slice(0, 100), src: errFile(src), ligne: +ligne || 0, v: BUILD, d, s: 0 }, a = errLogGet();
const same = a.find((x) => x.msg === rec.msg && x.src === rec.src && x.ligne === rec.ligne && x.v === rec.v);
if (same) { same.d = d; a.splice(a.indexOf(same), 1); a.push(same); } else a.push(rec);
errLogPut(a);
return a[a.length - 1];
} catch (e) { return null; }
}
const errLogSent = (rec) => { if (!rec) return; const a = errLogGet(), x = a.find((y) => y.msg === rec.msg && y.src === rec.src && y.ligne === rec.ligne && y.v === rec.v); if (x) { x.s = 1; errLogPut(a); } };

function errFlush(envoyer = errCanSend, post = (rec) => fetch(VOTE_ENDPOINT, { method: "POST", mode: "no-cors", keepalive: true, body: JSON.stringify(rec) }).catch(() => {})) {
try {
if (!envoyer()) return [];
const a = errLogGet(), out = [];
let dev = ""; try { dev = deviceId(); } catch (e) {}
for (const x of a) if (!x.s) { const rec = { ev: "err", msg: x.msg, src: x.src, ligne: x.ligne, col: 0, pile: "", ecran: "journal", version: x.v, niveau: "", dev, date: x.d }; post(rec); out.push(rec); x.s = 1; }
if (out.length) errLogPut(a);
return out;
} catch (e) { return []; }
}
window.addEventListener("error", (e) => {
if (!e || (e.target && e.target !== window)) return;
const j = errLog(e.message, e.filename, e.lineno, e.error && e.error.stack);
if (errReport(e.message, e.filename, e.lineno, e.colno, e.error && e.error.stack)) errLogSent(j);
});
window.addEventListener("unhandledrejection", (e) => {
const r = e && e.reason, st = r && r.stack ? String(r.stack) : "";
const at = /(?:https?|file):\/\/[^\s)]+?:(\d+):(\d+)/.exec(st) || [];
const msg = "Promesse rejetée : " + ((r && r.message) || String(r)), src = at[0] ? at[0].replace(/:\d+:\d+$/, "") : "";
const j = errLog(msg, src, at[1], st);
if (errReport(msg, src, at[1], at[2], st)) errLogSent(j);
});




const reducedMotion = () => { try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } };
function a11yMotion() {
const calm = (a) => (a && typeof a === "object" && a.behavior === "smooth" && reducedMotion() ? { ...a, behavior: "auto" } : a);
const wrap = (o, k) => { const f = o && o[k]; if (typeof f !== "function" || f.__m2m) return; const g = function (a, ...r) { return f.call(this, calm(a), ...r); }; g.__m2m = 1; o[k] = g; };
wrap(Element.prototype, "scrollIntoView"); wrap(Element.prototype, "scrollTo"); wrap(Element.prototype, "scrollBy"); wrap(window, "scrollTo"); wrap(window, "scrollBy");
}
try { a11yMotion(); } catch (e) {}
const app = document.getElementById("app");


try {
if (location.hash === "#france") localStorage.setItem("m2m-france", "1");
else if (location.hash === "#france-off") localStorage.removeItem("m2m-france");
if (localStorage.getItem("m2m-france") === "1" && !SYSTEMS.FR) SYSTEMS.FR = SYSTEMS_HIDDEN.FR;
} catch (e) {}





function bootState(s, store = true) {
if (!s || typeof s !== "object" || !s.profile || typeof s.profile !== "object") return null;
if (!SYSTEMS[s.profile.system]) return null;
let changed = false, bak = null;
try { bak = JSON.stringify(s); } catch (e) {}
try {

if (s.profile.track === "mp" && s.profile.grade < 12) { s.profile.track = "college"; changed = true; }
if (Engine.upgrade(s)) changed = true;
if (Object.keys(s.notions).length && Engine.migrate(s)) changed = true;

if (s.placed) { const k = (s.snaps || []).length; Engine.snap(s); if ((s.snaps || []).length !== k) changed = true; }
} catch (e) {
changed = false; errLog(e && e.message, "boot", 0, e && e.stack);
try { if (bak) s = JSON.parse(bak); } catch (e2) {}
}
if (changed && store) Store.save(s);
return s;
}
let state = bootState(Store.load());
const save = () => Store.save(state);

const navTabs = (cur, dots = {}) => `<nav class="tabs" aria-label="Sections"><div class="tabs-inner" role="tablist">${HOME_TABS.map(([id, label, ic]) => `<button class="tab" role="tab" data-tab="${id}" aria-selected="${id === cur}"><span class="tab-ic"><svg viewBox="0 0 24 24">${ic}</svg>${dots[id] && id !== cur ? '<i class="tab-dot"></i>' : ""}</span>${label}</button>`).join("")}</div></nav>`;


const homeBusy = () => typeof session !== "undefined" && session && session.i < session.plan.length && session.answered > 0;
const goHome = () => { if (homeBusy() && !confirm("Interrompre l'activité en cours ?")) return false; homeTab = "today"; screenHome(); return true; };
const addTabs = () => {
if (typeof state === "undefined" || !state || !state.placed) return;
const br = app.querySelector(".brand");
if (br && !app.querySelector(".hub")) { br.classList.add("brand-home"); br.title = "Accueil";


br.onclick = (e) => { if (e.target.closest("#fabc, #fabs") || !e.target.closest(".brand > b")) return; goHome(); }; }
if (!app.querySelector(".hub") && !(history.state && history.state.m2m)) history.pushState({ m2m: 1 }, "");
};
window.addEventListener("popstate", () => {
if (typeof state === "undefined" || !state || !state.placed || app.querySelector(".hub")) return;
if (!goHome()) history.pushState({ m2m: 1 }, "");
});
const addTabsOld = () => {
if (typeof state === "undefined" || !state || !state.placed || app.querySelector("nav.tabs")) return;
app.insertAdjacentHTML("beforeend", navTabs(null)); app.classList.add("has-tabs");
app.querySelectorAll("nav.tabs .tab").forEach((b) => (b.onclick = () => {
const busy = typeof session !== "undefined" && session && session.i < session.plan.length && session.answered > 0;
if (busy && !confirm("Interrompre l'activité en cours ?")) return;
homeTab = b.dataset.tab; screenHome();
}));
};




var pageQ = null;
function pageCode() {
if (pageQ) return pageQ;
const q = app.querySelector(".code"), t = app.querySelector("h2") || app.querySelector(".eyebrow");
if (q && q.textContent.trim()) return q.textContent.trim();
return "page-" + ((t && t.textContent) || "accueil").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
}
function addFab() {
if (document.getElementById("fabc")) return;


const old = document.getElementById("fabs"); if (old) old.remove();
document.body.insertAdjacentHTML("beforeend", `<button type="button" id="fabc" class="fab-cmt" aria-label="Envoyer un commentaire sur cette page">💬</button>
  <div id="fabs" class="fab-sheet" hidden><div class="card stack"><div class="spread"><b>Un commentaire sur cette page ?</b><button type="button" class="btn-ghost small" id="fabx" aria-label="Fermer">✕</button></div>
  <div class="fab-sujet small" id="fabw" hidden>À propos de : <label><input type="radio" name="fabw" value="page" checked> <span id="fabwl">cette question</span></label> <label><input type="radio" name="fabw" value="app"> l'application en général</label></div>
  <textarea id="fabt" maxlength="500" rows="4" placeholder="Une erreur, une idée, une remarque générale… (n'écris pas ton nom)"></textarea>
  <div class="spread"><span class="small muted" id="fabo"></span><button type="button" class="btn-primary" id="fabg">Envoyer</button></div></div></div>`);
const sheet = document.getElementById("fabs"), ta = document.getElementById("fabt"), ok = document.getElementById("fabo");


const sujet = document.getElementById("fabw");
document.getElementById("fabc").onclick = (e) => { e.stopPropagation(); sheet.hidden = !sheet.hidden; ok.textContent = "";
if (!sheet.hidden) { const c = pageCode(), surQ = !/^page-/.test(c); sujet.hidden = !surQ; sujet.querySelector('[value="page"]').checked = true; document.getElementById("fabwl").textContent = /^lecon-/.test(c) ? "cette leçon" : "cette question"; ta.focus(); } };
document.getElementById("fabx").onclick = () => (sheet.hidden = true);
document.getElementById("fabg").onclick = () => {
const text = ta.value.trim(); if (!text) { ok.textContent = "Écris d'abord ton commentaire."; return; }
const gen = !sujet.hidden && sujet.querySelector('[value="app"]').checked;
comment(gen ? "app" : pageCode(), text); ta.value = ""; sheet.hidden = true; toast("Merci ! Ton commentaire est envoyé.");
};
}


function placeFab() {
const b = document.getElementById("fabc"), sh = document.getElementById("fabs"), br = app.querySelector(".brand");
if (!b) return;
if (br) br.appendChild(b); else document.body.appendChild(b);
if (sh) sh.classList.toggle("top", !!br);
}


const boldData = (html) => {
const words = String(html).replace(/\\\(.*?\\\)/g, " ").replace(/<[^>]+>/g, " ").split(/\s+/).filter((w) => /[a-zà-ÿ]{2,}/i.test(w)).length;
if (words < 8) return html;

return String(html).split(/(<[^>]+>|\\\(.*?\\\))/).map((t, i) => {
if (i % 2) return t.replace(/^\\\((-?\d[\d{},']*(?:\\,\\%)?)((?:\\ |\\,)\\text\{[^}]*\})?\\\)$/, (m, n, u) => "\\(\\mathbf{" + n + "}" + (u || "") + "\\)");
return t.replace(/(^|[\s(«'’])(-?\d+(?:[.,'’]\d+)*)(?=[\s).,;:!?»%]|$)/g, "$1<b>$2</b>");
}).join("");
};

const h = (html) => { const tr = document.getElementById("tour"); if (tr) tr.remove(); sigClose(); pageQ = null; if (typeof Upd !== "undefined" && Upd) Upd.scr = ""; app.classList.remove("has-tabs"); app.innerHTML = html; ecranSplit(); addTabs(); addFab(); const sh = document.getElementById("fabs"); if (sh) sh.hidden = true; placeFab(); typeset(app); window.scrollTo(0, 0); bindLessonFeedback(app); bindLessonOpen(app); if (typeof bindDyn !== "undefined") bindDyn(app); };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const escT = (s) => esc(s).replace(/&lt;(\/?)(b|i|br)&gt;/g, "<$1$2>");


const backTop = (id = "backtop") => `<button type="button" class="btn-ghost back-home" id="${id}">← Retour</button>`;
const gradeName = (p) => ((SYSTEMS[p.system] || SYSTEMS_HIDDEN[p.system] || { grades: [] }).grades.find(([g]) => g === p.grade) || [0, ""])[1];
const brand = '<div class="brand"><b>' + APP_NAME + '</b><span>' + APP_TAGLINE + '</span></div>';
const PRAISE = ["Juste !", "Bien vu !", "Exact !", "Parfait.", "C'est ça !", "Bravo !"];
const pick = (a) => a[Math.floor(Math.random() * a.length)];



window.divSign = (t) => frThou(t.replace(/(\\text\{[^}]*\})|( : (?!\\;|;))/g, (m, txt) => txt || " \\div "));



const isFR = () => !!(state && state.profile && state.profile.system === "FR");
function frThou(t) { return isFR() ? frLocalPart(t, true) : t; }


function frDom(el) {
if (!isFR() || !el || !document.createTreeWalker) return;
const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.parentNode && (/^(SCRIPT|STYLE|TEXTAREA)$/.test(n.parentNode.nodeName) || (n.parentNode.closest && n.parentNode.closest("[data-noloc]"))) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT) });
const ns = []; while (w.nextNode()) ns.push(w.currentNode);

for (const n of ns) { const v = n.nodeValue; let r = n.parentNode.closest && n.parentNode.closest(".eyebrow") ? frWords(v) : frLocal(v); if (state.profile.grade >= 10 && typeof frZero === "function") r = frZero(r);


if (n.parentNode.closest && n.parentNode.closest(".act-inline, .lesson-card, .act-out")) {
const nx = n.nextSibling && n.nextSibling.nodeType === 1 ? n.nextSibling.textContent : "";
if (/^[\d?(]/.test(nx)) r = r.replace(/(\d|\))\s·\s*$/, "$1 × ");
if (/^\s*·\s\d/.test(r) && !n.previousSibling) r = r.replace(/^(\s*)·\s/, "$1× ");
}
if (r !== v) n.nodeValue = r; }
}



if (typeof MutationObserver !== "undefined" && app) new MutationObserver((ms) => { if (!isFR()) return; const seen = new Set();
for (const m of ms) { const t = m.target && m.target.closest ? m.target.closest(".lesson-card, .act-inline") : null; if (t && !seen.has(m.target)) { seen.add(m.target); try { frDom(m.target); } catch (e) {} } } }).observe(app, { childList: true, subtree: true });



function splitEq(tex) {
if (tex.length < 26 || /\\begin|\\\\/.test(tex)) return null;
const pos = [], semi = [], plus = []; let d2 = 0;
for (let i = 0; i < tex.length; i++) {
const c = tex[i];
if (c === "\\") { const m = tex.slice(i).match(/^\\(approx|leq|geq|neq|iff|Rightarrow|Leftrightarrow|to)(?![a-zA-Z])/); if (m && d2 === 0) pos.push(i); i += m ? m[0].length - 1 : 1; continue; }
if ("({[".includes(c)) d2++; else if (")}]".includes(c)) d2--;
else if (d2 === 0 && (c === "=" || c === "<" || c === ">")) pos.push(i);

else if (d2 === 0 && c === ";") { const m = tex.slice(i + 1).match(/^\s*(\\[,;]\s*)?/); semi.push(i + 1 + m[0].length); }
else if (d2 === 0 && c === "+") plus.push(i);
}
if (!pos.length && semi.length >= 4) pos.push(...semi.filter((_, k) => k % 3 === 2));
if (!pos.length && plus.length >= 4 && tex.length >= 40) pos.push(...plus.filter((_, k) => k % 3 === 2));
const P = pos.filter((i) => i > 0 && i < tex.length).sort((a, b) => a - b);
if (!P.length) return null;
const parts = []; let last = 0;
for (const i of P) { parts.push(tex.slice(last, i).trim()); last = i; }
parts.push(tex.slice(last).trim());
return parts.filter((x) => x).map((x) => "\\(" + x + "\\)").join(" ");
}
function splitLongMath(el) {
const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), nodes = [];
while (w.nextNode()) if (w.currentNode.nodeValue.includes("\\(")) nodes.push(w.currentNode);
for (const n of nodes) {
if (n.parentNode && n.parentNode.closest && n.parentNode.closest("textarea, input, script, mjx-container")) continue;
const v = n.nodeValue.replace(/\\\((.+?)\\\)/gs, (m, t) => splitEq(t) || m);
if (v !== n.nodeValue) n.nodeValue = v;
}
}
function typeset(el) {
try { frDom(el); } catch (e) {}
try { splitLongMath(el); } catch (e) {}
const go = () => window.MathJax && MathJax.typesetPromise ? MathJax.typesetPromise([el]).then(() => glueDots(el)).catch(() => {}) : setTimeout(go, 150);
go();
}


function glueDots(el) {
if (!el || !el.querySelectorAll) return;
for (const c of el.querySelectorAll("mjx-container:not([display=true])")) {
const t = c.nextSibling;
if (!t || t.nodeType !== 3 || !/^[.,;]/.test(t.nodeValue) || (c.parentNode && c.parentNode.classList && c.parentNode.classList.contains("nobr"))) continue;
const w = document.createElement("span"); w.className = "nobr"; w.style.whiteSpace = "nowrap";
c.parentNode.insertBefore(w, c); w.appendChild(c); w.appendChild(document.createTextNode(t.nodeValue[0])); t.nodeValue = t.nodeValue.slice(1);
}
}
const hash = (s) => { let x = 0; for (const c of s) x = (x * 31 + c.charCodeAt(0)) >>> 0; return x.toString(36).slice(-4); };



let draft = { system: "CH", grade: 11, track: null, minutes: 5 };







const DEMO_BASE = ["prio", "decadd", "decmul", "prop"];
let demoGrade = null, demoSkip = [];


const demoSys = () => (state && state.profile ? (state.profile.system === "FR" ? "FR" : "CH") : SYSTEMS.FR ? "FR" : "CH");
const DEMO_GRADES = { CH: [[9, "9e"], [10, "10e"], [11, "11e"], [12, "Sec. II<small class=\"seg-sub\">Collège, MP</small>"]] , FR: [[6, "6e"], [7, "5e"], [8, "4e"], [9, "3e"], [10, "Lycée"]] };
function demoPoolFor(grade) {
if (!grade) return DEMO_BASE.map((id) => [id, 1]);
const st = Engine.newState({ system: demoSys(), grade, track: "college", minutes: 5 });
Engine.autoInit(st);
const seen = Object.keys(st.notions).filter((id) => ["vu", "encours"].includes(st.notions[id].status) && GEN[id]);



const all = seen.map((id) => { const pl = placeOf(NOTIONS.find((n) => n.id === id), st.profile); return [id, pl && pl[0] < grade ? 2 : 1, pl ? pl[0] : 0]; });
const near = all.filter((x) => x[2] >= grade - 1);
return (near.length ? near : all).map(([id, lv]) => [id, lv]);
}
function demoQuestion() {
let pool = demoPoolFor(demoGrade).filter(([id]) => !demoSkip.includes(id));
if (!pool.length) { demoSkip = []; pool = demoPoolFor(demoGrade); }
const prof = { profile: demoSys() === "FR" ? { system: "FR", grade: demoGrade || 6 } : { system: "CH", grade: Math.min(demoGrade || 9, 11) } };
for (let k = 0; k < 40; k++) {
const [id, maxLv] = pool[Math.floor(Math.random() * pool.length)];
let q; try { q = Engine.build(id, maxLv > 1 && Math.random() < 0.4 ? 2 : 1, 1 + Math.floor(Math.random() * 46655)); } catch (e) { continue; }
if (q && prof.profile.system === "FR" && Engine.horsCO(prof, id, q)) continue;
if (q && q.spec && q.spec.kind === "value" && !q.parts && q.guide && q.guide.length) return Engine.finalize(prof, id, q);
}
return Engine.build("prio", 1, 7);
}
function screenWelcome() {
const q = demoQuestion(), n = NOTIONS.find((x) => x.id === q.id), fine = window.matchMedia("(pointer: fine)").matches;
h(`${brand}
  <div class="stack"><h1>Chaque jour, <span class="mark">5 minutes</span> de maths, à ton niveau.</h1>
  <p class="muted">Une question du jour choisie pour toi, une figure, une correction immédiate. Ton grade monte avec ton travail. Pas de compte, pas de nom : ta progression reste sur ton téléphone ; rien n'est envoyé sans ton accord, seulement des statistiques anonymes si tu dis oui (<a href="#" id="envoie-lien">ce que l'app envoie</a>).</p></div>
  <div class="row welcome-pz"><a class="btn-sec small" href="#decouvrir">▶ Découvrir l'app en 1 minute</a><a class="btn-ghost small" href="#parents">👪 Je suis parent</a></div> <!-- 25.11 soir (revue d'un testeur : présentations introuvables pour un nouveau visiteur) -->
  <div class="stack"><span class="small muted">Je suis en :</span><div class="seg" id="dgrade">${DEMO_GRADES[demoSys()].map(([g, l]) => `<button aria-pressed="${g === demoGrade}" data-v="${g}">${l}</button>`).join("")}</div></div>
  <div class="card tilt" id="demo"><div class="qmeta"><span class="chip">Essaie · ${n ? n.label : "exemple"}</span><span class="dots"><i class="on"></i><i></i><i></i></span></div>
  <div class="qtext">${q.q}</div>${q.fig ? `<div class="figwrap">${q.fig}</div>` : ""}
  <div class="answer"><input class="ans" id="dans" inputmode="${fine ? "text" : "none"}" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Ta réponse…" aria-label="Ta réponse">
  <div class="preview" id="dprev"></div>${keypadHtml(q.spec.kind === "value" && !q.spec.sci && (Math.abs(q.spec.value) >= 1e-3 || q.spec.value === 0) && Math.abs(q.spec.value) < 1e7 ? { ...q.spec, final: true } : q.spec)}<div class="actions"><button class="btn-primary" id="dok">Vérifier</button></div></div>
  <div id="dfb" aria-live="polite"></div>
  <div class="spread"><span></span><button class="btn-ghost small" id="dskip">Pas encore vu ça ? Autre question</button></div>
  <p class="small muted">Un autre sujet à chaque visite. Tape ta réponse comme tu veux : fractions, racines, π… le calculateur comprend.</p></div>
  <button class="btn-primary btn-big" id="go">Commencer</button>
  <button class="btn-ghost" id="restore">J'ai déjà un code de sauvegarde</button>
  <button class="btn-ghost small" id="privacy">🔒 Ce que l'app envoie</button>
  <p class="small muted"><a href="#" id="legal-lien">Mentions légales et confidentialité</a></p>`);
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
const d = diagPlus(q, v);


fb.innerHTML = `<div class="fb hint pop">${d ? escT(d) : r.status === "close" ? escT(r.message || "Presque !") : "<b>Pas encore.</b>" + (q.hint ? " <b>Indice</b> · " + escT(q.hint) : "")}</div>
      <div class="actions"><button class="btn-sec" id="dretry">↺ Réessayer</button><button class="btn-primary" id="dguide">🪜 On le fait ensemble</button><button class="btn-ghost" id="dsol">Voir la solution</button></div><div id="dgbox"></div>`;
typeset(fb);
document.getElementById("dretry").onclick = () => { fb.innerHTML = ""; inp.value = ""; show(); inp.focus({ preventScroll: true }); };
document.getElementById("dsol").onclick = () => done(false, "Voici la solution :");
document.getElementById("dguide").onclick = () => { inp.disabled = true; const kp = document.getElementById("kp"); if (kp) kp.remove(); document.getElementById("dok").remove(); prev.remove();
fb.querySelector(".actions").remove(); runGuide(q, document.getElementById("dgbox"), () => {}); };
};
document.getElementById("dok").onclick = go;
inp.onkeydown = (e) => { if (e.key === "Enter") go(); };
document.getElementById("go").onclick = screenLevel;
const redraw = () => { screenWelcome(); const d = document.getElementById("demo"); if (d && d.scrollIntoView) d.scrollIntoView({ block: "nearest" }); };
document.getElementById("dskip").onclick = () => { demoSkip.push(q.id); redraw(); };
app.querySelectorAll("#dgrade button").forEach((b) => (b.onclick = () => { demoGrade = +b.dataset.v; demoSkip = []; draft.system = demoSys(); draft.grade = demoGrade; draft.fromWelcome = demoGrade; redraw(); }));
document.getElementById("privacy").onclick = () => screenPrivacy(screenWelcome);
document.getElementById("envoie-lien").onclick = (e) => { e.preventDefault(); screenPrivacy(screenWelcome); };
document.getElementById("legal-lien").onclick = (e) => { e.preventDefault(); screenLegal(screenWelcome); };
document.getElementById("restore").onclick = () => screenRestore();
}




function setProfile(prof) {
const keep = state && state.comps, keepA = state && state.a11y, keepY = state && ypSync(state), keepN = state && state.gradeNo;
state = Engine.newState(prof);
if (keepY) state.yp = keepY;
ypSync(state);
if (keepN) state.gradeNo = keepN;
if (keep) state.comps = keep;
if (keepA) state.a11y = keepA;
Engine.autoInit(state);
save(); startPlacement();
}
function screenLevel() {

if (!SYSTEMS[draft.system] && typeof SYSTEMS_HIDDEN !== "undefined" && SYSTEMS_HIDDEN[draft.system]) SYSTEMS[draft.system] = SYSTEMS_HIDDEN[draft.system];
if (!SYSTEMS[draft.system]) draft.system = "CH";
const sys = SYSTEMS[draft.system];
if (!sys.grades.some(([g]) => g === draft.grade)) draft.grade = sys.grades.some(([g]) => g === 11) ? 11 : sys.grades[0][0];


if (draft.autoTrack) { draft.track = null; draft.autoTrack = false; }
const sec2 = draft.system === "CH" && draft.grade >= 12;


const fw = !draft.keepSys && draft.system === demoSys() ? draft.fromWelcome : null, top = draft.system === "FR" ? 10 : 12;
const gList = fw === top ? sys.grades.filter(([g]) => g >= top) : sys.grades;
const gBlock = fw && fw < top && draft.grade === fw ? `<p class="small" id="gradeknown">Ta classe : <b>${esc(gradeName({ system: draft.system, grade: fw }))}</b> <button type="button" class="btn-ghost small" id="gradechg">changer</button></p>`
: `<h3>${fw === top && draft.system === "CH" ? "Ta classe au secondaire II (Collège, MP)" : "Ta classe cette année"}</h3><div class="seg" id="grade">${gList.map(([g, n]) => `<button aria-pressed="${g === draft.grade}" data-v="${g}">${n}</button>`).join("")}</div>`;
h(`${brand}<div class="eyebrow">Étape 1 sur 2</div><h2>Où en es-tu ?</h2>
  <div class="card flat stack">${Object.keys(SYSTEMS).length > 1 && !draft.keepSys ? `<h3>Ton école</h3><div class="seg" id="sys">${Object.entries(SYSTEMS).map(([k, v]) => `<button aria-pressed="${k === draft.system}" data-v="${k}">${v.label}</button>`).join("")}</div>` : ""}
  ${gBlock}
  ${sec2 ? `<h3>Ta voie</h3><p class="small muted">Important : choisis ton école, le programme n'est pas le même.</p><div class="seg track-seg" id="track"><button aria-pressed="${draft.track === "college"}" data-v="college">Collège (maturité gymnasiale)</button><button aria-pressed="${draft.track === "mp"}" data-v="mp">Maturité professionnelle (CFPT, école professionnelle…)</button></div><p class="small" id="trackerr" style="color:var(--bad, #c0392b)"></p>` : ""}
  ${sec2 && draft.track === "college" && draft.grade >= 14 ? `<h3>Ton niveau de maths</h3><div class="seg track-seg" id="niv"><button aria-pressed="${draft.niv === "N"}" data-v="N">MA1 · niveau normal</button><button aria-pressed="${draft.niv === "R"}" data-v="R">MA2 · niveau renforcé</button></div><p class="small" id="niverr" style="color:var(--bad, #c0392b)"></p>` : ""}</div>
  <p class="small muted">Chaque jour, l'app te propose un programme différent (un défi, une série d'automatismes, des applications…), équilibré sur la semaine. Pas de chrono : l'important, c'est de venir chaque jour.</p>
  <p class="small muted">Ensuite : au plus 5 questions pour trouver ton point de départ (environ 5 minutes). Tu peux t'arrêter, tu reprendras au même endroit.</p>
  <button class="btn-primary btn-big" id="next">Continuer</button>${draft.keepSys && Object.keys(SYSTEMS).length > 1 ? '<button class="btn-ghost small" id="chgpays">Changer de pays</button>' : ""}`);
const bind = (id, key, num) => app.querySelectorAll("#" + id + " button").forEach((b) => (b.onclick = () => { draft[key] = num ? +b.dataset.v : b.dataset.v; screenLevel(); }));
bind("sys", "system"); bind("grade", "grade", true); bind("track", "track"); bind("niv", "niv");
const gc = document.getElementById("gradechg"); if (gc) gc.onclick = () => { draft.fromWelcome = null; screenLevel(); };


const cp = document.getElementById("chgpays"); if (cp) cp.onclick = () => { draft.keepSys = false; screenLevel(); };

document.getElementById("next").onclick = () => {
if (draft.system === "CH" && draft.grade >= 12 && !draft.track) { document.getElementById("trackerr").textContent = "Choisis d'abord ta voie : Collège ou maturité professionnelle."; document.getElementById("track").scrollIntoView({ behavior: "smooth", block: "center" }); return; }

const needNiv = draft.system === "CH" && draft.grade >= 14 && draft.track === "college";
if (needNiv && !draft.niv) { document.getElementById("niverr").textContent = "Choisis ton niveau : MA1 (normal) ou MA2 (renforcé)."; document.getElementById("niv").scrollIntoView({ block: "center" }); return; }
const prof = { system: draft.system, grade: draft.grade, track: draft.system === "CH" && draft.grade >= 12 ? draft.track : "college", minutes: draft.minutes, ...(needNiv ? { niv: draft.niv } : {}) };
const go = () => setProfile(prof);



if (typeof ensurePacks !== "function") return go();
const b = document.getElementById("next"); b.disabled = true; b.textContent = "Chargement…";
ensurePacks(prof, true).then(go, () => { b.disabled = false; b.textContent = "Réessayer"; toast("Pas de connexion : les notions de cette classe ne sont pas encore sur ton téléphone. Réessaie une fois connecté."); });
};
}




function startPlacement() {
if (!state.placement || !state.placement.plan || !state.placement.plan.length) { state.placement = { plan: Engine.placementPlan(state), i: 0 }; save(); }
const plan = state.placement.plan;
let i = state.placement.i;
const next = () => {
state.placement.i = i; save();


if (i >= plan.length || (state.placement.miss || 0) >= 3) { state.placeMiss = state.placement.miss || 0; state.placed = true; state.placedOn = day();  delete state.placement; Engine.snapPlaced(state);  save(); return screenPlacementDone(); }
const id = plan[i], q = Engine.make(state, id, Engine.placementLevel(state, i));
renderQuestion(q, {
eyebrow: "Étape 2 sur 2 · question " + (i + 1) + " sur " + plan.length + (plan.length - i > 1 ? " · encore " + (plan.length - i - 1) + " après celle-ci · environ " + (plan.length - i) + " min"  : " · la dernière !") + `<span class="pbar" aria-hidden="true"><i style="width:${Math.round((i / plan.length) * 100)}%"></i></span>`, single: true, track: "positionnement",


onDone: (res) => { Engine.placementResult(state, id, res.solved ? true : res.dontKnow ? null : false, q.d); if (!res.solved) state.placement.miss = (state.placement.miss || 0) + 1; save(); },
onNext: () => { i++; next(); },
onNotYet: () => { Engine.notYet(state, id); save(); toast("Noté : cette notion reviendra plus tard."); i++; next(); },
});

if (i === 0 && typeof a11yOf === "function") {
const eb = app.querySelector(".eyebrow"), f = a11yOf(state).font;
if (eb) { eb.insertAdjacentHTML("afterend", `<button type="button" class="btn-ghost small font-hint" id="fonthint" aria-pressed="${!!f}">Aa ${f ? "Police habituelle" : "Lettres difficiles à lire ? Police plus lisible"}</button>`);
document.getElementById("fonthint").onclick = (e) => { const on = !a11yOf(state).font; state.a11y = { ...a11yOf(state), font: on ? 1 : 0 }; save(); uiApply(); e.currentTarget.setAttribute("aria-pressed", on); e.currentTarget.textContent = "Aa " + (on ? "Police habituelle" : "Lettres difficiles à lire ? Police plus lisible"); }; }
}
};
next();
}

function screenPlacementDone() {
const lv = Engine.themeLevels(state);

const P = Object.values(state.notions).filter((s) => s.placed), r = P.length ? P.filter((s) => s.m >= 0.75).length / P.length : 0.5;
const cheer = r >= 0.75 ? "Bon départ : tu as de solides bases. On va pouvoir avancer vite vers les notions de ton année."
: r >= 0.4 ? "C'est fait ! Tu as des acquis sur lesquels t'appuyer, et l'app sait maintenant quoi consolider avec toi."
: "Merci d'avoir joué le jeu : ces questions servaient à te situer, pas à te noter. On commence par les bases, à ton rythme, et ça va monter.";
h(`${brand}<h2>Ton <span class="mark">point de départ</span></h2>
  <p class="placement-cheer">${cheer}</p>
  <div class="card">${eloBlock()}</div>
  <div class="card flat"><h3>Par thème</h3><div class="bars">${themeBars(lv)}</div>
  <p class="small muted">Ton niveau va se préciser au fil des séances : les 20 premières questions servent de calibrage.</p></div>
  <div class="card flat"><p class="small muted">Les notions de ton année s'ajoutent au fur et à mesure, dans l'ordre du programme. Si une question porte sur quelque chose que tu n'as pas encore vu en classe, touche « Pas encore vu en classe » : elle reviendra plus tard, sans pénalité.</p></div>
  <button class="btn-primary btn-big" id="go">Voir ma première séance</button>`);
document.getElementById("go").onclick = screenHome;
}


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







const GRADES = [[0, "🌱", "Pousse"], [150, "✏️", "Apprenti"], [350, "📏", "Arpenteur"], [600, "🧮", "Calculateur"], [850, "📐", "Bâtisseur"],
[1100, "🗺️", "Explorateur"], [1450, "🔦", "Enquêteur"], [1800, "🔭", "Chercheur"], [2150, "♟️", "Stratège"], [2550, "🦉", "Penseur"],
[3000, "🥇", "Expert"], [3450, "🎓", "Érudit"], [3950, "🧪", "Savant"], [4500, "🏆", "Maître"], [5050, "🧬", "Inventeur"],
[5600, "💎", "Virtuose"], [6250, "🪐", "Astronome"], [6900, "👑", "Génie"], [7550, "⚡", "Prodige"], [8250, "🌌", "Visionnaire"], [9000, "🌟", "Légende"]];



const YP = { cap: 40, session: 10, carnet: 5, weekly: 10, start: "08-15" };
const schoolYear = (d = day()) => +d.slice(0, 4) - (d.slice(5) >= YP.start ? 0 : 1);
const yearLabel = (y) => y + "-" + String(y + 1).slice(2);

function classTag(p) {
if (!p) return "";
if (p.system === "FR") return gradeName(p);
const y = p.grade >= 12 ? (p.grade === 12 ? "1re" : p.grade - 11 + "e") : p.grade + "e";
return p.grade < 12 ? y : p.track === "mp" ? "MP " + y : y + " Coll.";
}
const ypKey = (p, d) => schoolYear(d) + "|" + p.system + "|" + (p.track === "mp" ? "mp" : "co") + "|" + p.grade;



function ypMigrate(s, k, d) {
const from = schoolYear(d) + "-" + YP.start;
const pd = (x) => Math.min(YP.cap, Math.round(x.n + 3 * (x.score || 0)) + YP.session), H = (s.history || []).filter((x) => x && x.date >= from && x.date <= d && x.n > 0);
let pts = H.reduce((a, x) => a + pd(x), 0);
if (!pts && s.elo && s.elo.n > 0) pts = Math.min(50, s.elo.n);
const t = H.find((x) => x.date === d), dp = t ? pd(t) : 0;
return { k, c: classTag(s.profile), pts, d, dp, ds: t ? 1 : 0, past: [], mig: d };
}


function ypSync(s = state, d = day()) {
if (!s || !s.profile) return null;
const k = ypKey(s.profile, d);
if (!s.yp) s.yp = ypMigrate(s, k, d);
const y = s.yp;
if (y.k !== k) {
const past = (y.past || []).filter((x) => x.k !== y.k);
if (y.pts > 0) past.push({ k: y.k, c: y.c, p: y.pts });
const back = past.find((x) => x.k === k);
Object.assign(y, { k, c: classTag(s.profile), pts: back ? back.p : 0, d: null, dp: 0, ds: 0, past: past.filter((x) => x !== back).slice(-12) });
}
return y;
}

function ypAdd(s, n, kind, d = day()) {
const y = ypSync(s, d);
if (!y || !(n > 0)) return 0;
if (kind === "w") { const w = Engine.weekOf(d); if (y.wk === w) return 0; y.wk = w; y.pts += n; return n; }
if (y.d !== d) { y.d = d; y.dp = 0; y.ds = 0; }
if (kind === "s") { if (y.ds >= 2) return 0; y.ds++; }
const g = Math.max(0, Math.min(n, YP.cap - y.dp));
y.dp += g; y.pts += g;
return g;
}

function ypPoints(d, res, redo) {
if (redo || !res) return 0;
return 1 + (res.solved ? 2 + (res.tries === 1 ? 1 : 0) + Math.max(0, Math.min(3, (d || 1) - 1)) : res.partial ? 1 : 0);
}
const ypPts = () => { const y = ypSync(); return y ? y.pts : 0; };
const nbFmt = (x) => String(x).replace(/\B(?=(\d{3})+$)/g, isFR() ? "\u202f" : "'");




function gradeNumbers(done) {
if (!canSend()) return;
const r = ypPts(), no = (state.gradeNo = state.gradeNo || {});
const todo = GRADES.filter(([at, , name]) => at && r >= at && !no[name]).map(([, , name]) => name);
todo.forEach((name) => fetch(VOTE_ENDPOINT + "?grade=" + encodeURIComponent(name) + "&app=" + encodeURIComponent(deviceId()))
.then((x) => x.json()).then((j) => { if (j && j.n) { no[name] = j.n; save(); if (done) done(); } }).catch(() => {}));
}
function gradeCard(name) {
const G = GRADES.find((x) => x[2] === name); if (!G) return;
const au = isAuthor(), n = au ? 0 : (state.gradeNo || {})[name];
document.querySelectorAll(".collector-bg").forEach((x) => x.remove());
document.body.insertAdjacentHTML("beforeend", `<div class="collector-bg" role="dialog" aria-label="Carte du grade ${name}"><div class="collector pop">
    <div class="eyebrow">Grade collector</div><div class="col-ic">${G[1]}</div><h2>${name}</h2>
    ${G[0] ? `<div class="col-no">${n != null ? "#" + n : "# …"}</div>` : ""}
    ${G[0] && au ? `<div class="col-exp">le créateur de l'app</div>` : G[0] && n ? `<div class="col-exp">${n === 1 ? "1<sup>er</sup>" : n + "<sup>e</sup>"} utilisateur à obtenir ce grade</div>` : ""}
    <p class="small muted">${!G[0] ? "Le grade de départ : tout le monde commence ici à la rentrée." : au ? "Avant tous les utilisateurs : le numéro 0." : n ? `Ton numéro de collection : le rang auquel tu as atteint le grade ${name}, parmi tous les utilisateurs de l'app.` : "Le numéro (ton rang parmi les utilisateurs qui ont atteint ce grade) arrive dès que l'app est en ligne."}</p>
    ${G[0] ? `<p class="small muted">Atteint à ${nbFmt(G[0])} points de l'année.</p>` : ""}
    <button type="button" class="btn-primary" id="colx">Fermer</button></div></div>`);
const bg = document.querySelector(".collector-bg");
bg.onclick = (e) => { if (e.target === bg || e.target.id === "colx") bg.remove(); };
}


function gradeOf(r) {
let i = 0; while (i + 1 < GRADES.length && r >= GRADES[i + 1][0]) i++;
const [lo, ic, name] = GRADES[i], nx = GRADES[i + 1], c = state && state.profile ? classTag(state.profile) : "";
return { i, ic, name, title: name + (c ? "\u00a0· " + c : ""), lo, next: nx ? { at: nx[0], ic: nx[1], name: nx[2] } : null, pct: nx ? Math.round(((r - lo) / (nx[0] - lo)) * 100) : 100 };
}

function screenGrades() {
if (!state.eloSeen) { state.eloSeen = true; save(); }
const y = ypSync(), r = y.pts, g = gradeOf(r);
const past = (y.past || []).map((x) => { const G = GRADES.filter(([at]) => x.p >= at).pop(); return `<li>${esc(x.c)} · ${yearLabel(+x.k.split("|")[0])} : ${G[1]} ${G[2]} atteint</li>`; }).reverse().join("");
h(`${brand}${backTop()}<div class="eyebrow">Grades de l'année\u00a0· ${esc(y.c)}</div><h2>Mes grades</h2>
  <div class="card stack grade-now"><div class="ic-row"><button type="button" class="ic grade-big grade-open" data-g="${g.name}" aria-label="Voir la carte du grade ${g.name}">${g.ic}</button><div><div class="eyebrow">Mon grade</div><h2>${esc(g.title)}</h2><div class="small muted">${nbFmt(r)} points cette année</div></div></div>
    ${g.next ? `<div class="stack" style="gap:4px"><span class="pbar"><i style="width:${g.pct}%"></i></span><span class="small">Prochain grade : <b>${g.next.ic} ${g.next.name}</b>, encore ${nbFmt(g.next.at - r)} points.</span></div>` : '<p class="small">Le plus haut grade : bravo !</p>'}</div>
  <div class="card flat stack yp-rules"><h3>Gagner des points</h3><p class="small">Question faite <b>+1</b>, réussie <b>+2</b>, du premier coup <b>+1</b>, difficile jusqu'à <b>+3</b> ; séance finie <b>+10</b> ; erreur effacée du carnet <b>+5</b> ; problème de la semaine réussi <b>+10</b>.</p>
    <p class="small muted">Au plus ${YP.cap} points par jour (hors problème de la semaine) ; « Refaire » ne rapporte rien. Tout le monde repart 🌱 Pousse à la rentrée et au changement de classe.</p></div>
  <div class="card">${eloBlock()}<p class="small muted yp-explain">Mathélo = ton niveau : il monte et descend selon tes réponses · Points de l'année = ton travail, ils font monter ton grade.</p></div>
  <div class="card flat stack"><h3>L'échelle de l'année</h3><p class="small muted">Touche un grade atteint pour voir sa carte.</p>
    <ol class="grades">${GRADES.slice().reverse().map(([at, ic, name]) => { const st = r >= at ? (g.name === name ? "cur" : "ok") : "todo";
const no = st !== "todo" && at && (isAuthor() ? "0" : (state.gradeNo || {})[name]);
return `<li class="${st}"><span class="g-ic">${st !== "todo" && at ? `<button type="button" class="grade-open" data-g="${name}" aria-label="Voir la carte du grade ${name}">${ic}</button>` : ic}</span><span class="g-n">${name}${st === "cur" ? " <span class=\"badge\">toi</span>" : ""}${no ? ` <small class="g-no" title="${no}e utilisateur à obtenir ce grade">#${no}</small>` : ""}</span><span class="g-at">${at ? nbFmt(at) : "–"}</span></li>`; }).join("")}</ol></div>
  ${past ? `<div class="card flat stack yp-past"><h3>Souvenirs</h3><ul class="small">${past}</ul></div>` : ""}
  <button class="btn-primary btn-big" id="back">Retour</button>`);
document.getElementById("back").onclick = screenHome; document.getElementById("backtop").onclick = screenHome;
gradeNumbers();
const cur = app.querySelector(".grades li.cur"); if (cur) cur.scrollIntoView({ block: "center" });
window.scrollTo(0, 0);
}





function eloBanner() {
const r = ypPts(), g = gradeOf(r);
return `<button type="button" class="elo-band elo-compact" id="eloband" aria-label="Grade ${g.title}, ${nbFmt(r)} points de l'année, voir mes grades">
    <span class="eb-num"><span class="eyebrow">Points de l'année</span><b class="num">${nbFmt(r)}</b></span>
    <span class="eb-grade"><b><span class="eb-gic" aria-hidden="true">${g.ic}</span> ${esc(g.title)}</b>${g.next ? `<span class="pbar"><i style="width:${g.pct}%"></i></span><span class="eb-next">${g.next.ic} ${g.next.name} dans ${nbFmt(g.next.at - r)} pts</span>` : ""}</span>
    <span class="eb-chev" aria-hidden="true">›</span></button>`;
}
function themeBars(lv) {
return Object.entries(lv).map(([th, m]) => `<div class="bar"><span>${Engine.themeLabel(th, state.profile)}</span><span class="track"><i style="width:${Math.round(m * 100)}%"></i></span></div>`).join("");
}



let homeTab = "today";
const weekKey = () => { const d = new Date(); return d.getFullYear() + "-" + Math.floor((d - new Date(d.getFullYear(), 0, 1)) / 6048e5); };
const HOME_TABS = [

["today", "Aujourd'hui", '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/><circle cx="12" cy="15.2" r="1.8" fill="currentColor" stroke="none"/>'],

["prob", "Exploration", '<circle cx="10" cy="10" r="7.6"/><path d="M15.6 15.6L21.5 21.5" stroke-width="2.6"/><path d="M7.7 8.3a2.4 2.4 0 1 1 3.3 2.2c-.6.3-1 .8-1 1.4v.5" stroke-width="2.1"/><circle cx="10" cy="14.6" r="1.15" fill="currentColor" stroke="none"/>'],
["test", "Test", '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>'],
["prog", "Progrès", '<path d="M4 20V10M10 20V5M16 20v-7M22 20H2"/>'],
];

function streakNudge() {
const s = state.streak, today = day();
if (s.count && s.last === addDays(today, -2) && Engine.jokerFree(state)) return `<div class="streak-nudge small"><span>🛡</span><span><b>Joker de série</b> : tu as manqué hier, mais ta série de ${s.count} jours continue si tu fais ta séance aujourd'hui (un joker par semaine).</span></div>`;
if (!s.count || s.last === today || s.last !== addDays(today, -1)) return "";
return `<div class="streak-nudge small"><span>🔥</span><span><b>${s.count} ${s.count > 1 ? "jours" : "jour"} d'affilée</b> · une séance aujourd'hui et tu passes à ${s.count + 1}${s.count + 1 > (s.best || 0) ? " (record !)" : ""}</span></div>`;
}


function backupCard() {
const days = (state.history || []).filter((x) => x.n > 0).length, last = UI.lastBackup, later = UI.backupLater;
if (days < 7 || (last && addDays(last, 30) > day()) || (later && addDays(later, 7) > day())) return "";
return `<div class="card flat stack backup-card"><div class="ic-row"><span class="ic">💾</span><div><b>Sauvegarde ta progression</b><div class="small muted">${days} jours de pratique, et tout est sur ce téléphone : un téléphone changé ou un cache vidé, et tout est perdu. Un code suffit pour tout récupérer.</div></div></div>
    <div class="row"><button class="btn-primary" id="bkgo">Faire mon code de sauvegarde</button><button class="btn-ghost small" id="bkno">Plus tard</button></div></div>`;
}


function eloHintCard() {
return "";
if (state.eloSeen || !state.tourDone) return "";
const g = gradeOf(ypPts());
return `<div class="card flat stack elo-hint"><p class="small"><b>📈 Mathélo</b> = ton score de maths. Ton <b>grade</b>, lui, monte avec les points de l'année (séances, réussites) : tu es ${g.ic} ${g.name}${g.next ? `, le prochain est ${g.next.ic} ${g.next.name}` : ""}.</p>
    <div class="row"><button class="btn-ghost small" id="elohok">Compris</button><button class="btn-ghost small" id="elohmore">Voir tous les grades</button></div></div>`;
}

function weekRecapCard() {
const now = new Date(day() + "T12:00:00"), dow = (now.getDay() + 6) % 7;
if (dow > 2 || state.recapSeen === weekKey()) return "";
const mon = addDays(day(), -dow), from = addDays(mon, -7), to = addDays(mon, -1);
const H = (state.history || []).filter((x) => x.date >= from && x.date <= to && x.n > 0);
if (!H.length) return "";
const n = H.reduce((a, x) => a + x.n, 0), log = (state.elo && state.elo.log) || [];
const at = (d) => { const L = log.filter((x) => x[0] <= d); return L.length ? L[L.length - 1][1] : null; };
const r1 = at(to), r0 = at(addDays(from, -1)) ?? (log.find((x) => x[0] >= from) || [])[1], dr = r1 !== null && r0 != null ? r1 - r0 : null;
return `<div class="card flat stack recap-card"><div class="eyebrow">📅 Ta semaine dernière</div>
    <p><b>${H.length}</b> jour${H.length > 1 ? "s" : ""} de pratique · <b>${n}</b> question${n > 1 ? "s" : ""}</p>
    <p class="small muted">${H.length >= 5 ? "Superbe régularité, continue comme ça !" : H.length >= 3 ? "Bonne régularité. Essaie d'ajouter un jour cette semaine." : "Chaque jour compte : vise 3 jours cette semaine."}</p>
    <button class="btn-ghost small" id="recapok">OK</button></div>`;
}


const TOUR = [
[".sess-card", "▶ Ta séance du jour", "En classe : au rythme de ton cours (choisis ton chapitre). Libre : tous les sujets, à ton rythme. Quelques minutes suffisent."],
[".elo-band", "🏅 Ton grade de l'année", "Pousse, Apprenti… : ton grade monte avec tes points de l'année (séances, réussites). Touche-le pour voir l'échelle des grades."],
[".doors", "🧭 Tes rubriques", "Le problème de la semaine, les questions curieuses, l'histoire des maths, ton évaluation (révision jusqu'au jour J), ton carnet d'erreurs et tes progrès."],
];
let tourK = 0, doorHintCounted = false;
function tourShow() {
const old = document.getElementById("tour"); if (old) old.remove();
if (homeTab !== "today") return;
const [sel, title, text] = TOUR[tourK];
if (sel === ".elo-band" && !state.eloSeen) { state.eloSeen = true; save(); }
document.body.insertAdjacentHTML("beforeend", `<div id="tour" class="tour" role="dialog" aria-label="Visite guidée"><div class="tour-card"><div class="spread"><b>${title}</b><span class="small muted">${tourK + 1} / ${TOUR.length}</span></div><p class="small">${text}</p>
    <div class="row"><button class="btn-ghost small" id="tourskip">Passer</button><button class="btn-primary" id="tournext">${tourK + 1 < TOUR.length ? "Suivant" : "C'est parti !"}</button></div></div></div>`);
app.querySelectorAll(".tour-hi").forEach((x) => x.classList.remove("tour-hi"));
const el = app.querySelector(sel); if (el) el.classList.add("tour-hi");



const tw = document.getElementById("tour"), card = tw && tw.querySelector(".tour-card");
if (tw) tw.addEventListener("click", (ev) => { if (!ev.target.closest(".tour-card")) { ev.preventDefault(); ev.stopPropagation(); card.classList.remove("tour-nudge"); void card.offsetWidth; card.classList.add("tour-nudge"); } });
if (el && card) {
document.body.style.paddingBottom = Math.round(card.getBoundingClientRect().height + 40) + "px";
const ct = card.getBoundingClientRect().top, r = el.getBoundingClientRect();
if (r.top < 8 || r.bottom > ct - 8) window.scrollBy(0, r.top - Math.max(8, (ct - r.height) / 2));
}
const end = () => { state.tourDone = true; save(); tourK = 0; document.body.style.paddingBottom = ""; app.querySelectorAll(".tour-hi").forEach((x) => x.classList.remove("tour-hi")); const t = document.getElementById("tour"); if (t) t.remove(); };
document.getElementById("tourskip").onclick = end;
document.getElementById("tournext").onclick = () => { if (++tourK >= TOUR.length) return end(); tourShow(); };
}
function screenHome() {
if (!state) return screenWelcome();
Badges.check(state);
const today = day(), done = state.history.find((x) => x.date === today);
const s = state.streak, alive = s.last === today || s.last === addDays(today, -1) || (s.last === addDays(today, -2) && Engine.jokerFree(state)), wp = Engine.weeklyProblem(state), fmt = Engine.todayFormat(state);
const wpDone = wp && state.weeklyDone === weekKey(), prep = Engine.prepActive(state);
const left = prep ? Math.round((new Date(state.prep.date) - new Date(today)) / 864e5) : null;
const dots = { prob: !!wp && !wpDone, test: prep && left <= 3, prog: (state.badgesNew || []).length > 0 };
save();
const panels = {
today: () => `${resumeCard()}${weekRecapCard()}${backupCard()}${streakNudge()}${prepTodayCard()}${carnetCard(false)}<div class="card stack mode-school"><div class="eyebrow">🎒 Mode scolaire · au rythme de ton cours en classe${done ? " · séance faite, tu peux en refaire une" : ""}</div>
      <div class="fmt-box stack"><div class="spread"><span class="eyebrow">Aujourd'hui</span><button class="btn-ghost small" id="other">🔁 Changer de format</button></div>
        <h3>${FORMATS[fmt].label}</h3><p class="small muted">${Engine.fmtText(state, fmt)}</p></div>
      <button class="btn-primary btn-big" id="go">${done ? "Encore une séance" : "C'est parti"}</button>${nowCard()}</div>
      ${freeCard()}`,
prob: () => (!wp ? `<div class="card flat stack"><div class="eyebrow">🔍 Problème de la semaine</div><h3>Pas encore de problème pour toi</h3><p class="small muted">Les problèmes arrivent avec les notions que tu as déjà travaillées. Fais quelques séances !</p></div>`
: `<div class="card stack"><div class="eyebrow">🔍 Problème de la semaine${wpDone ? " · fait ✓" : ""}</div><h2>${nLabel(wp)}</h2>
        <p class="muted">Un problème en plusieurs étapes, avec des indices si tu bloques. Facultatif, et il rapporte gros.</p>
        <button class="btn-primary btn-big" id="wp">${wpDone ? "Le refaire" : "Relever le défi"}</button>
        <p class="small muted">${wpDone ? "Bravo ! Un nouveau problème arrive la semaine prochaine." : "Un nouveau problème chaque semaine."}</p></div>`),

test: () => (prep ? prepPanel(left)
: `<div class="card stack"><div class="eyebrow">Je prépare une évaluation</div><h2>Une évaluation approche ?</h2>
        <p class="muted">Dis-moi sa date et les notions : chaque jour, l'app te fait réviser juste ce qu'il faut, jusqu'au jour J. Tu pourras aussi t'entraîner sur un sujet de préparation, avec son corrigé.</p>
        <button class="btn-primary btn-big" id="prep">Je prépare une évaluation</button></div>`) + (typeof evacomCard === "function" ? evacomCard() : ""),
prog: () => `${newBadgesCard()}${carnetCard(true)}${themeMapCard()}${compsCard()}`,
};

panels.carnet = () => carnetCard(true) || `<div class="card flat stack"><div class="eyebrow">📕 Carnet d'erreurs</div><p class="small muted">Vide : bravo ! Chaque question ratée viendra s'y ranger, pour que tu puisses la réussir plus tard.</p>${carnetWeekN() ? `<p class="small carnet-week">${carnetWeekTxt()}</p>` : ""}</div>`;

panels.prog = () => `${weekCard()}<div class="card flat stack grades-go"><button type="button" class="btn-sec" id="gradesgo">🏅 Mes grades et mon Mathélo</button><p class="small muted yp-explain">Mathélo = ton niveau · Points de l'année = ton travail, ils font monter ton grade.</p></div>${newBadgesCard()}${typeof ficheProgCard === "function" ? ficheProgCard() : ""}${themeMapCard()}${compsCard()}${typeof parentCard === "function" ? parentCard() : ""}`;
if (!panels[homeTab]) homeTab = "today";
const head = `<div class="spread home-head">${brand}<span class="row" style="gap:6px"><span class="streak-chip" title="${alive && s.count ? "jours d'affilée" : "une séance aujourd'hui et ta série repart à 1"}${s.best > 1 ? " · record " + s.best : ""}">${alive && s.count ? "🔥 <b>" + s.count + "</b> j" : "✏️" }</span><span class="small muted hh-cl" title="Ta classe"><span class="hh-w">Classe </span>${classTag(state.profile) }</span><button class="btn-ghost gear" id="settings" aria-label="Réglages">⚙️</button></span></div>`;
if (homeTab !== "today") {
const T = { prob: "Problème de la semaine", test: "Mon évaluation", carnet: "Carnet d'erreurs", prog: "Progrès" };
h(`${head}<button type="button" class="btn-ghost back-home" id="hb">← Accueil</button><h2 class="sub-title">${T[homeTab]}</h2>
    <div class="home-panel" data-tab="${homeTab}">${panels[homeTab]()}</div>`);
document.getElementById("hb").onclick = () => { homeTab = "today"; screenHome(); };
} else {
const mode = state.homeMode === "libre" ? "libre" : "classe", nC = (state.carnet || []).length;


const paused = !!resumeCard();


const evalDone = done && !paused && state.fmtDone !== today && !!(state.prep && (state.prep.log || {})[today]);
const doneLab = done && !paused && !evalDone;

const nudge = streakNudge(), joker = /Joker/.test(nudge);



const prepNow0 = prep && !paused && !(state.prep.log || {})[today] && prepKind() !== "mock";
const banner = [resumeCard(), prepNow0 ? prepTodayCard() : "", joker ? nudge : ""].find((x) => x) || "";
const ios = iosStoreCard();
const below = [prepNow0 ? "" : prepTodayCard(), weekRecapCard(), ios || backupCard(), joker ? "" : nudge, eloHintCard()].join("");

const lostK = s.count >= 1 && !alive && s.last ? s.last : null;
if (lostK && (!state.lostSeen || state.lostSeen.k !== lostK)) { state.lostSeen = { k: lostK, d: today }; save(); }


const away = lostK && lostK <= addDays(today, -3), rec = Math.max(s.best || 0, s.count);
const lostLine = lostK && state.lostSeen && state.lostSeen.k === lostK && state.lostSeen.d === today ? `<p class="small streak-lost">${away ? "Content de te revoir ! " : ""}Ta série de ${s.count} ${s.count > 1 ? "jours" : "jour"} s'est arrêtée. Fais une séance aujourd'hui : elle repart à 1.${rec > 1 ? " Ton record : " + rec + " jours." : ""}</p>` : "";
const nowLine = !Engine.nowActive(state) ? `<button type="button" class="btn-sec small" id="nowpick">📚 Choisir mon chapitre travaillé en classe</button>`
: Engine.nowStale(state) ? `<div class="now-ask"><b>📚 Cette semaine en classe, tu travailles toujours :</b><span>${esc(state.now.ids.map(nLabel).join(" · "))} ?</span><div class="row now-ask-btns"><button type="button" class="btn-sec small" id="nowyes">Oui, toujours</button><button type="button" class="btn-sec small" id="nowpick">J'ai changé de chapitre</button></div></div>`
: `<span class="small now-lab">📚 ${esc(state.now.ids.map(nLabel).join(" · "))}</span><button type="button" class="btn-ghost small" id="nowpick">changer</button>`;

const DOOR_NAME = { prob: "Problème de la semaine", cur: "Questions curieuses", hist: "Histoires des maths", test: "Mon évaluation", carnet: "Carnet d'erreurs", prog: "Mes progrès" };


if (!doorHintCounted) { doorHintCounted = true; state.doorHints = (state.doorHints || 0) + 1; save(); }
const DOOR_HINT = { prob: "chaque semaine", cur: "maths cachées", hist: "découvertes", test: "prépare le jour J", carnet: "tes erreurs", prog: "grades, badges" };
const hintOn = (state.doorHints || 0) <= 3;
const door = (id, ic, label, sub0, badge) => { const sub = sub0 || (hintOn ? DOOR_HINT[id] : ""), hint = !sub0 && !!sub; return `<button type="button" class="door" data-door="${id}" aria-label="${esc(DOOR_NAME[id] || label)}${sub ? " : " + esc(sub) : ""}${badge === "!" ? " (nouveau)" : ""}">${badge ? `<span class="door-badge">${badge}</span>` : ""}<span class="door-sq">${ic}</span><b>${label}</b>${sub ? `<small${hint ? ' class="door-hint"' : ""}>${sub}</small>` : ""}</button>`; };
const svgI = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`, TI = Object.fromEntries(HOME_TABS.map(([k, , ic]) => [k, ic]));


const prepNow = prep && !paused && !(state.prep.log || {})[today] && prepKind() !== "mock";
h(`<div class="hub">${head}
    ${eloBanner()}
    ${banner}
    ${prepNow ? lostLine : `<div class="card stack sess-card sess-first">${lostLine} <!-- 24.11 : « Séance d'abord » (choix de l'enseignant) : le bouton en premier, le reste discret -->
      <button class="btn-primary btn-big sess-go" id="${mode === "classe" ? "go" : "freego"}">▶ ${paused ? "Nouvelle séance" : done ? "Encore une séance" : mode === "classe" ? "Ma séance du jour" : "Mon défi du jour"}</button>
      ${mode === "classe" ? `<div class="sess-fmt"><span class="sess-fmt-t">${evalDone ? `<b class="fmt-lab">Séance du jour faite ✓ (évaluation)</b><span class="small muted fmt-txt">Pour en refaire une : ${FORMATS[fmt].label}</span>` : `<b class="fmt-lab">${FORMATS[fmt].label}</b><span class="small muted fmt-txt">${Engine.fmtText(state, fmt)}${doneLab ? " · séance faite ✓" : ""}</span>`}</span><button type="button" class="btn-sec small" id="other" aria-label="Changer de format">🔁<span class="chg-t"> Changer</span></button></div>
        <div class="now-line">${nowLine}</div>` : ""}
      <div class="sess-modes"><div class="seg sess-seg" role="tablist"><button type="button" data-m="classe" aria-pressed="${mode === "classe"}">🎒 En classe</button><button type="button" data-m="libre" aria-pressed="${mode === "libre"}">🧭 Libre</button></div><button type="button" class="btn-ghost small sess-info" id="sessinfo" aria-label="En classe ou Libre : explication" aria-expanded="false">ⓘ</button></div>
      <div class="small muted sess-sub sess-subs" hidden id="sessexp"><span class="${mode === "classe" ? "on" : ""}">Suit le chapitre que tu travailles en classe, avec des révisions.</span><span class="${mode === "libre" ? "on" : ""}">Tous les sujets de ton année, à ton rythme.</span></div>
    </div>`}
    ${below}${statsCard()}
    <div class="doors">
      ${door("prob", svgI(TI.prob), "Problème", "", dots.prob ? "!" : "")}
      ${door("cur", svgI('<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>'), "Curieux", "", "")}
      ${door("hist", svgI('<path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a3 3 0 0 1-3-3V6"/><path d="M4 6a2 2 0 1 0 4 0V4"/><path d="M9 9h7M9 13h7M9 17h4"/>'), "Histoire", "", "")}
      ${door("test", svgI(TI.test), "Évaluation", prep ? (left === 0 ? "aujourd'hui !" : left === 1 ? "demain" : "dans " + left + " j") : "", dots.test ? "!" : "")}
      ${door("carnet", svgI('<path d="M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h10"/><path d="M9 8l4 4M13 8l-4 4"/>'), "Carnet", nC ? nC + " à effacer" : "", nC || "")}
      ${door("prog", svgI(TI.prog), "Progrès", "", dots.prog ? "!" : "")}
    </div></div>`);

const backHome = () => { homeTab = "today"; screenHome(); };
app.querySelectorAll(".door").forEach((b) => (b.onclick = () => {
const d = b.dataset.door;
if (d === "cur") return withX(() => screenCurious(typeof Curieux !== "undefined" ? Curieux.pick(state) : null, backHome, "onglet"));
if (d === "hist") return withX(() => screenHistory(Histoire.pick(state).k, backHome));
homeTab = d; screenHome();
}));
app.querySelectorAll(".sess-seg button").forEach((b) => (b.onclick = () => { state.homeMode = b.dataset.m; save(); screenHome(); }));
}
const byId = (x) => document.getElementById(x), on = (x, f) => { if (byId(x)) byId(x).onclick = f; };
on("settings", screenSettings);
on("eloband", screenGrades);
on("gradesgo", screenGrades);
on("elohok", () => { state.eloSeen = true; save(); screenHome(); });
on("elohmore", screenGrades);
on("go", startSession);
on("freego", startFree);

on("other", () => {
const f = Engine.otherFormat(state); save();
const lab = app.querySelector(".fmt-lab"), txt = app.querySelector(".fmt-txt"), box = app.querySelector(".sess-fmt");
if (!lab || !box) return screenHome();
lab.textContent = FORMATS[f].label; if (txt) txt.textContent = Engine.fmtText(state, f);
box.classList.remove("fmt-swap"); void box.offsetWidth; box.classList.add("fmt-swap");
});
if (homeTab === "today") bindNowCard();
on("resgo", resumeSession);
on("resno", () => { delete state.resume; save(); screenHome(); });
on("bkgo", screenBackup);
on("bkno", () => { UI.backupLater = day(); uiSave(); screenHome(); });
bindIosStore();
on("sessinfo", () => { const e = document.getElementById("sessexp"), b = document.getElementById("sessinfo"); if (!e) return; e.hidden = !e.hidden; b.setAttribute("aria-expanded", String(!e.hidden)); });
on("statsoui", () => { statsSet(true); toast("Merci ! Tu peux changer d'avis dans les Réglages."); screenHome(); });
on("statsnon", () => { statsSet(false); toast("C'est noté : rien n'est envoyé. Modifiable dans les Réglages."); screenHome(); });
on("statsplus", () => screenPrivacy(screenHome));
on("statslater", () => { UI.statsLater = day(); uiSave(); screenHome(); });
on("recapok", () => { state.recapSeen = weekKey(); save(); screenHome(); });
if (!state.tourDone) tourShow();
on("wp", () => { session = { plan: [wp], i: 0, score: 0, answered: 0, start: Date.now(), elo0: state.elo.r, ids: new Set(), weekly: true }; nextQuestion(); });
on("curgo", () => withX(() => screenCurious(Curieux.pick(state), () => { homeTab = "prob"; screenHome(); }, "onglet")));
if (typeof Histoire !== "undefined") Histoire.bind(app, (k) => screenHistory(k, () => { homeTab = "prob"; screenHome(); }));
on("comps", screenComps);
on("prep", screenPrep); on("prepedit", screenPrep);
if (typeof screenMock === "function") on("mock", screenMock);
if (typeof screenQcm === "function") on("qcm", screenQcm);
if (typeof screenEvacom === "function") { on("evacom", () => screenEvacom()); on("evcbilan", screenEvacomResult); }
on("prepgo", () => startPrepTask(prepKind()));
on("preptask", () => startPrepTask(prepKind()));
on("preptab", () => { homeTab = "test"; screenHome(); });
on("prepauto", () => screenQcm());
if (typeof screenFiche === "function") { on("prepfiche", () => screenFiche({ test: true })); app.querySelectorAll("[data-fiche]").forEach((b) => (b.onclick = () => screenFiche({ chap: b.dataset.fiche }))); }
app.querySelectorAll(".pday").forEach((b) => (b.onclick = () => { app.querySelectorAll(".pday").forEach((x) => x.classList.toggle("sel", x === b)); const i = document.getElementById("pdayinfo"); if (i) i.innerHTML = b.dataset.info; }));
on("carnetgo", () => startCarnet());
updBanner("home");
}

(() => {
let x0 = null, y0 = 0;


app.addEventListener("touchstart", (e) => { x0 = !app.querySelector(".home-panel") || e.target.closest("input, select, textarea, .seg, details, svg") ? null : e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
app.addEventListener("touchend", (e) => {
if (x0 === null) return;
const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx) * 0.7) return;
const ids = HOME_TABS.map((t) => t[0]), k = ids.indexOf(homeTab) + (dx < 0 ? 1 : -1);
if (k >= 0 && k < ids.length) { homeTab = ids[k]; screenHome(); }
}, { passive: true });
})();

window.addEventListener("beforeunload", (e) => { if (typeof session !== "undefined" && session && session.i < session.plan.length && session.answered > 0) { e.preventDefault(); e.returnValue = ""; } });


const UI = (() => { let u = {}; try { u = JSON.parse(localStorage.getItem("m2m-ui") || "{}"); } catch (e) {} return Object.assign({ fs: 1, vib: true }, u); })();
const uiSave = () => { try { localStorage.setItem("m2m-ui", JSON.stringify(UI)); } catch (e) {} };



const A11Y_FS = [[1, "Normale"], [1.15, "Grande"], [1.3, "Très grande"]];
const a11yOf = (s) => {
const a = Object.assign({ fs: 1, font: 0, hc: 0 }, s && s.a11y), f = +a.fs || 1;
return { fs: A11Y_FS.map((x) => x[0]).reduce((b, v) => (Math.abs(v - f) < Math.abs(b - f) ? v : b), 1), font: a.font ? 1 : 0, hc: a.hc ? 1 : 0 };
};

if (state && !state.a11y && UI.fs && UI.fs !== 1) { state.a11y = a11yOf({ a11y: { fs: UI.fs } }); save(); }
const uiApply = () => {
const a = a11yOf(state), r = document.documentElement;
r.style.removeProperty("font-size"); document.body.style.removeProperty("font-size");
r.style.setProperty("--fs", a.fs);
if (a.font) r.dataset.font = "lisible"; else delete r.dataset.font;
if (a.hc) r.dataset.hc = "1"; else delete r.dataset.hc;
};
uiApply();






const ECRANS = [["auto", "Automatique"], ["tel", "Téléphone"], ["tab", "Tablette"], ["ordi", "Ordinateur"]];
const ecranAuto = (w, coarse) => (w < 700 ? "tel" : coarse ? "tab" : w >= 1024 ? "ordi" : "tel");
function ecranApply() {
const r = document.documentElement, w = window.innerWidth, hh = window.innerHeight;
const coarse = !!(window.matchMedia && matchMedia("(pointer: coarse)").matches);
const e = ECRANS.some((x) => x[0] === UI.ecran && x[0] !== "auto") ? UI.ecran : ecranAuto(w, coarse);
const two = (e === "ordi" && w >= 900) || (e === "tab" && w >= 1000 && w > hh);
const cls = ["ecran-" + (e === "tab" ? "tablette" : e)].concat(two ? ["ecran-2col"] : []);
for (const c of [...r.classList]) if (c.startsWith("ecran-") && !cls.includes(c)) r.classList.remove(c);
for (const c of cls) r.classList.add(c);
}
ecranApply();
window.addEventListener("resize", ecranApply);




function ecranSplit() {
if (!document.documentElement.classList.contains("ecran-2col")) return;
const card = app.querySelector(":scope > .card.pop"), bar = app.querySelector(":scope > .qbar");
if (!card || !bar || !card.querySelector(":scope > .qtext") || !card.querySelector(":scope > .answer")) return;
const L = document.createElement("div"), R = document.createElement("div");
L.className = "q-l"; R.className = "q-r";
for (const el of [...card.children]) (el.matches(".qmeta, .qtext, .exact-note, .figwrap") ? L : R).appendChild(el);
R.insertBefore(bar, R.querySelector(":scope > #fb"));
card.classList.add("q-2col"); card.append(L, R);
}

function ecranCols() {
if (!document.documentElement.classList.contains("ecran-2col")) return;
const kids = [...app.children], i = kids.findIndex((el) => el.matches(".card, details")), end = kids.map((el) => el.matches("button.btn-big")).lastIndexOf(true);
if (i < 0 || end <= i + 1) return;
const box = document.createElement("div"); box.className = "e-cols";
app.insertBefore(box, kids[i]); kids.slice(i, end).forEach((el) => box.appendChild(el));
}

const buzz = (ok) => { if (UI.vib && navigator.vibrate) try { navigator.vibrate(ok ? 35 : [40, 70, 40]); } catch (e) {} };

let installEvt = null;
window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); installEvt = e; });
window.addEventListener("appinstalled", () => { UI.installed = true; uiSave(); });
const isStandalone = () => (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const installHow = () => isIOS() ? "Dans Safari : touche <b>Partager</b> (le carré avec la flèche ⬆️), puis <b>« Sur l'écran d'accueil »</b>." : "Dans le menu du navigateur (<b>⋮</b> en haut à droite) : <b>« Installer l'application »</b> ou <b>« Ajouter à l'écran d'accueil »</b>.";
function installCard(where) {
if (isStandalone() || UI.installed) return "";
return `<div class="card flat stack install-card"><div class="ic-row"><span class="ic">📲</span><div><b>Mets l'app sur ton écran d'accueil</b><div class="small muted">Un toucher et ta question du jour est là, comme une vraie application. Rien à télécharger d'un store.</div></div></div>
    ${installEvt ? '<button class="btn-primary" id="instgo">Installer</button>' : `<p class="small">${installHow()}</p>`}${where === "bilan" ? '<button class="btn-ghost small" id="instno">Plus tard</button>' : ""}</div>`;
}
function bindInstall(after) {
const g = document.getElementById("instgo"), n = document.getElementById("instno");
if (g) g.onclick = async () => { const e = installEvt; installEvt = null; e.prompt(); try { const c = await e.userChoice; if (c && c.outcome === "accepted") { UI.installed = true; uiSave(); } } catch (x) {} after(); };
if (n) n.onclick = () => { UI.installLater = day(); uiSave(); const c = n.closest(".install-card"); if (c) c.remove(); };
}


function returnCard() {
if (iosRisk()) return "";
const days = (state.history || []).length;
const later = (d, n) => !d || addDays(d, n) <= day();

if (days >= 2 && !isStandalone() && !UI.installed && later(UI.installLater, 7) && later(UI.installShown, 7)) { UI.installShown = day(); uiSave(); return installCard("bilan"); }
return "";
}


const sessDone = () => Math.max(+UI.sessN || 0, (state && state.history || []).filter((x) => x && x.n > 0).length);



function storagePersist() {
if (UI.persistAsked || sessDone() < 1) return;
UI.persistAsked = day();
const S = navigator.storage;
if (!S || typeof S.persist !== "function" || (/firefox/i.test(navigator.userAgent) && !isIOS())) { UI.persisted = "na"; uiSave(); return; }
uiSave();
try { S.persist().then((g) => (typeof S.persisted === "function" ? S.persisted() : g)).then((p) => { UI.persisted = p ? 1 : 0; uiSave(); }, () => {}); } catch (e) {}
}


const iosRisk = () => isIOS() && !isStandalone() && !UI.installed;
function iosStoreCard() {
if (!state || !iosRisk() || sessDone() < 2) return "";
const t = day(), recent = (d) => d && addDays(d, 14) > t;
if (recent(UI.lastBackup) || recent(UI.iosLater) || (UI.iosShown !== t && recent(UI.iosShown))) return "";
if (UI.iosShown !== t) { UI.iosShown = t; uiSave(); }
const dev = /ipad/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ? "iPad" : "iPhone";
return `<div class="card flat stack ios-store"><p class="small">📲 Sur ${dev}, installe l'app (Partager → Sur l'écran d'accueil) pour ne pas perdre ta progression, ou garde ton code de sauvegarde.</p>
    <p class="small" id="ioshow" hidden>${installHow()}</p>
    <div class="row"><button type="button" class="btn-sec small" id="iosinst">Comment installer</button><button type="button" class="btn-sec small" id="iosbk">Mon code de sauvegarde</button><button type="button" class="btn-ghost small" id="iosno">Plus tard</button></div></div>`;
}
function bindIosStore() {
const g = (x) => document.getElementById(x);
if (g("iosinst")) g("iosinst").onclick = () => { g("ioshow").hidden = false; g("iosinst").remove(); };
if (g("iosbk")) g("iosbk").onclick = screenBackup;
if (g("iosno")) g("iosno").onclick = () => { UI.iosLater = day(); uiSave(); const c = app.querySelector(".ios-store"); if (c) c.remove(); };
}
function screenSettings() {
const A = a11yOf(state);


const ecranOpt = window.innerWidth >= 700 || (UI.ecran && UI.ecran !== "auto");
h(`${brand}${backTop()}<h2>Réglages</h2><div class="stack">
  <div class="card flat stack"><h3>Affichage</h3>
    <span class="small muted" id="fs-l">Taille du texte</span><div class="seg" id="fs" role="group" aria-labelledby="fs-l">${A11Y_FS.map(([v, l]) => `<button aria-pressed="${A.fs === v}" data-v="${v}">${l}</button>`).join("")}</div>
    <span class="small muted" id="font-l">Police</span><div class="seg" id="font" role="group" aria-labelledby="font-l"><button aria-pressed="${!A.font}" data-v="0">Habituelle</button><button aria-pressed="${!!A.font}" data-v="1">Plus lisible</button></div>
    <span class="small muted" id="hc-l">Contraste</span><div class="seg" id="hc" role="group" aria-labelledby="hc-l"><button aria-pressed="${!A.hc}" data-v="0">Normal</button><button aria-pressed="${!!A.hc}" data-v="1">Renforcé</button></div>
    <span class="small muted" id="st-l">Statistiques anonymes pour améliorer l'app</span><div class="seg" id="statsset" role="group" aria-labelledby="st-l"><button aria-pressed="${statsOk()}" data-v="1">J'aide</button><button aria-pressed="${!statsOk()}" data-v="0">Ne rien envoyer</button></div>
    <span class="small muted">Vibrer à chaque réponse (téléphone)</span><div class="seg" id="vib"><button aria-pressed="${UI.vib}" data-v="1">Oui</button><button aria-pressed="${!UI.vib}" data-v="0">Non</button></div>${ecranOpt ? `
    <span class="small muted" id="ecran-l">Mise en page (cet appareil)</span><div class="seg" id="ecran" role="group" aria-labelledby="ecran-l">${ECRANS.map(([v, l]) => `<button aria-pressed="${(UI.ecran || "auto") === v}" data-v="${v}">${l}</button>`).join("")}</div>` : ""}</div>
  ${installCard("")}
  <button class="btn-sec" id="backup">💾 Sauvegarder ou transférer ma progression</button><button class="btn-sec" id="level">Changer de classe ou d'école</button><button class="btn-sec" id="present" onclick="location.hash='#decouvrir'">📣 Présenter l'app (élèves)</button><button class="btn-sec" onclick="location.hash='#parents'">👪 Présenter l'app (parents)</button><button class="btn-sec" id="privacy">🔒 Ce que l'app envoie</button><button class="btn-ghost small" id="legal">Mentions légales et confidentialité</button>
  ${isAuthor() ? '<button class="btn-primary" id="stats">📊 Statistiques d\'usage (auteur)</button>' : ""}
  <div class="confirm" id="reset"><button class="btn-ghost" id="r1">Tout effacer</button></div>
  <button class="btn-primary" id="back">Retour</button></div>`);
document.getElementById("back").onclick = screenHome; document.getElementById("backtop").onclick = screenHome;
bindInstall(screenSettings);
const setA = (k, v) => { state.a11y = { ...a11yOf(state), [k]: v }; save(); uiApply(); screenSettings(); const f = document.querySelector(`#${k} button[data-v="${v}"]`); if (f) f.focus(); };
app.querySelectorAll("#fs button").forEach((b) => (b.onclick = () => setA("fs", +b.dataset.v)));
app.querySelectorAll("#font button").forEach((b) => (b.onclick = () => setA("font", +b.dataset.v)));
app.querySelectorAll("#hc button").forEach((b) => (b.onclick = () => setA("hc", +b.dataset.v)));
app.querySelectorAll("#ecran button").forEach((b) => (b.onclick = () => { UI.ecran = b.dataset.v; uiSave(); ecranApply(); screenSettings(); const f = document.querySelector(`#ecran button[data-v="${b.dataset.v}"]`); if (f) f.focus(); }));
app.querySelectorAll("#vib button").forEach((b) => (b.onclick = () => { UI.vib = b.dataset.v === "1"; uiSave(); if (UI.vib) buzz(true); screenSettings(); }));
app.querySelectorAll("#statsset button").forEach((b) => (b.onclick = () => { statsSet(b.dataset.v === "1"); screenSettings(); }));
document.getElementById("privacy").onclick = () => screenPrivacy(screenSettings);
document.getElementById("legal").onclick = () => screenLegal(screenSettings);
if (document.getElementById("stats")) document.getElementById("stats").onclick = () => screenStats(screenSettings);
document.getElementById("backup").onclick = screenBackup;
document.getElementById("level").onclick = () => { draft = { ...state.profile, keepSys: true }; screenLevel(); };
document.getElementById("r1").onclick = () => {
document.getElementById("reset").innerHTML = '<span class="small">Effacer ta progression et ton Mathélo ?</span><button id="r2">Oui, effacer</button><button class="btn-ghost" id="r3">Non</button>';
document.getElementById("r2").onclick = () => { Store.clear(); try { localStorage.removeItem("m2m-device"); localStorage.removeItem("m2m-ping"); localStorage.removeItem(ERRLOG_KEY); } catch (e) {} state = null; uiApply(); screenWelcome(); };
document.getElementById("r3").onclick = screenSettings;
};
}





const LSU = ["Insuffisante", "Fragile", "Satisfaisante", "Très bonne"];
const lsuK = (n) => (n < 3 ? 0 : n < 4 ? 1 : n < 5.5 ? 2 : 3);
const noteCls = (n) => (n === null ? "none" : isFR() ? ["low", "frag", "ok", "good"][lsuK(n)] : n >= 5 ? "good" : n >= 4 ? "ok" : "low");
const noteTxt = (n) => (n === null ? (isFR() ? "pas encore" : "pas testé") : isFR() ? LSU[lsuK(n)] : String(n).replace(".", ","));
const avgTxt = (a) => (a === null ? "" : isFR() ? " · maîtrise " + LSU[lsuK(a)].toLowerCase() : " · moyenne " + String(Math.round(a * 10) / 10).replace(".", ","));
function compStats(ids) {
const all = ids.flatMap((id) => compsOf(id)), notes = all.map((c) => compNote((state.comps || {})[c.cid])).filter((x) => x !== null);
return { total: all.length, tested: notes.length, avg: notes.length ? notes.reduce((a, b) => a + b, 0) / notes.length : null };
}

const ctestNote = (ct) => { const r = ct.code && typeof Referentiel !== "undefined" ? Referentiel.find(state.profile, ct.code) : null; return r ? Referentiel.note(state, r) : compNote((state.comps || {})[ct.cid]); };
const refOn = () => typeof Referentiel !== "undefined" && !!Referentiel.of(state.profile);
function compsCard() {
const cur = Engine.catalog(state.profile).filter((c) => c.current).map((c) => c.id), st = refOn() ? Referentiel.stats(state, Referentiel.list(state.profile)) : compStats(cur);
return `<div class="card flat stack"><div class="spread"><h3>Mes compétences</h3>${st.avg !== null ? `<span class="note ${noteCls(Math.round(st.avg * 2) / 2)}">${isFR() ? noteTxt(st.avg) : String(Math.round(st.avg * 10) / 10).replace(".", ",")}</span>` : ""}</div>
  <p class="small muted">${st.tested ? `${st.tested} compétence${st.tested > 1 ? "s" : ""} ${isFR() ? "positionnée" : "notée"}${st.tested > 1 ? "s" : ""} sur ${st.total} cette année.` : isFR() ? "Ton niveau de maîtrise apparaît au fil des séances, compétence par compétence." : "Tes notes apparaissent au fil des séances, compétence par compétence."}</p>
  <p class="small">🏅 ${Object.keys(state.badges || {}).length} badge${Object.keys(state.badges || {}).length > 1 ? "s" : ""} sur ${Badges.list(state).length}</p>
  <button class="btn-primary" id="comps">Voir mes compétences et mes badges</button></div>`;
}
function screenComps() {
if (refOn()) return screenCompsRef();
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
h(`${brand}${backTop()}<h2>Mes <span class="mark">compétences</span></h2>
  <p class="muted">${isFR() ? "Chaque compétence reçoit un niveau de maîtrise (insuffisante, fragile, satisfaisante, très bonne) dès que tu y as répondu 3 fois. Il suit tes 8 dernières réponses : il monte quand tu progresses." : "Chaque compétence reçoit une note de 1 à 6 dès que tu y as répondu 3 fois. La note suit tes 8 dernières réponses : elle monte quand tu progresses."}</p>
  <div class="card flat"><div class="spread"><span>${classTag(state.profile) || "Cette année" }</span><b>${st.tested} / ${st.total} ${isFR() ? "positionnées" : "notées"}${avgTxt(st.avg)}</b></div></div>
  ${block(cur)}
  ${old.length ? `<details class="olds"><summary>Années précédentes (${compStats(old.map((c) => c.id)).tested} ${isFR() ? "positionnées" : "notées"})</summary>${block(old)}</details>` : ""}
  ${badgesSection()}
  <button class="btn-primary btn-big" id="back">Retour</button>`);
ecranCols(); bindBadges(app);

app.querySelectorAll(".ctest").forEach((b) => (b.onclick = () => {
const id = b.dataset.id, d = +b.dataset.d, cid = id + ":" + (d - 1);

const lab = (COMPS[id] || [])[d - 1], lvls = lab ? COMPS[id].map((x, j) => (x === lab ? j + 1 : 0)).filter(Boolean) : [d];
const order = lvls.slice().sort(() => Math.random() - 0.5), pick = [0, 1, 2].map((k) => order[k % order.length]);
session = { plan: pick.map((lv) => id + "|" + lv), i: 0, score: 0, answered: 0, start: Date.now(), elo0: state.elo.r, ids: new Set(), prep: true,
ctest: { label: b.dataset.label, cid, before: compNote((state.comps || {})[cid]) } };
nextQuestion();
}));
document.getElementById("back").onclick = screenHome; document.getElementById("backtop").onclick = screenHome;
}








function screenCompsRef() {
const p = state.profile, y0 = Referentiel.year(p), fr = Referentiel.isFR(p), W = fr ? "positionnées" : "notées";
const line = (r) => {
if (!Referentiel.hasQuestions(r)) return `<div class="comp rcomp"><span title="${r.code}">${esc(r.label)}</span><span class="comp-r"><span class="tag">${fr ? "travaillé en classe" : "travaillée en classe"}</span></span></div>`;
const n = Referentiel.note(state, r), t = Referentiel.plan(p, r).length;
return `<div class="comp rcomp"><span title="${r.code}">${esc(r.label)}</span><span class="comp-r">${t ? `<button type="button" class="ctest rtest" data-code="${r.code}" title="3 questions sur cette compétence">Me tester</button>` : ""}<span class="note ${noteCls(n)}">${noteTxt(n)}</span></span></div>`;
};

const themes = (list) => [...new Set(list.map((r) => r.theme))].map((th) => {
const rs = list.filter((r) => r.theme === th), t = Referentiel.stats(state, rs);
return `<div class="card flat"><div class="spread"><h3>${esc(th)}</h3><span class="small muted">${t.tested} / ${t.total} ${W}</span></div>${[...new Set(rs.map((r) => r.notion))].map((no) => { const rn = rs.filter((r) => r.notion === no); return `<div class="cnotion">${no ? `<b>${esc(no)}</b>` : ""}${rn.map(line).join("")}</div>`; }).join("")}</div>`;
}).join("");
const cur = Referentiel.list(p), st = Referentiel.stats(state, cur), nq = cur.filter(Referentiel.hasQuestions).length, k = st.total - nq;
const olds = Referentiel.olds(p);
const tr = Referentiel.track(p);
const hint = !k ? "" : fr ? `${k} attendu${k > 1 ? "s" : ""} (constructions, démonstrations, programmation…) ${k > 1 ? "sont travaillés" : "est travaillé"} en classe, sans niveau ici.`
: `${k} compétence${k > 1 ? "s" : ""} (démonstrations, constructions, représentations…) ${k > 1 ? "sont travaillées" : "est travaillée"} en classe, sans note ici.`;
Badges.check(state); state.badgesNew = []; save();
h(`${brand}${backTop()}<h2>Mes <span class="mark">compétences</span></h2>
  <p class="muted">${Referentiel.intro(p)}</p>
  <div class="card flat"><div class="spread"><span>${Referentiel.yearLabel(p, y0)}${tr ? " · " + tr : ""}</span><b>${st.tested} / ${st.total} ${W}${avgTxt(st.avg)}</b></div>${hint ? `<p class="small muted">${hint}</p>` : ""}</div>
  ${themes(cur)}
  ${olds.map(([lab, ys]) => `<details class="olds"><summary>${lab} (${ys.map((y) => Referentiel.stats(state, Referentiel.list(p, y)).tested).reduce((a, b) => a + b, 0)} ${W})</summary>${ys.map((y) => `<h3 class="ryear">${Referentiel.yearLabel(p, y)}</h3>${themes(Referentiel.list(p, y))}`).join("")}</details>`).join("")}
  ${badgesSection()}
  <button class="btn-primary btn-big" id="back">Retour</button>`);
ecranCols(); bindBadges(app);
app.querySelectorAll(".rtest").forEach((b) => (b.onclick = () => {
const r = Referentiel.find(p, b.dataset.code), ps = Referentiel.plan(p, r);
if (!ps.length) return;
const order = ps.slice().sort(() => Math.random() - 0.5), pick = [0, 1, 2].map((k) => order[k % order.length]);
session = { plan: pick.map(([id, d]) => id + "|" + d), i: 0, score: 0, answered: 0, start: Date.now(), elo0: state.elo.r, ids: new Set(), prep: true,
ctest: { label: r.label, code: r.code, cid: Referentiel.cids(r)[0], before: Referentiel.note(state, r), forms: r.forms || null } };
nextQuestion();
}));
document.getElementById("back").onclick = screenHome; document.getElementById("backtop").onclick = screenHome;
}


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

return `<details class="card flat stack bdg-sec bdg-fold"><summary class="spread"><h3>🏅 Mes badges</h3><b>${Object.keys(got).length} / ${L.length}</b></summary>
  ${Object.entries(BADGE_FAM).map(([f, label]) => `<div class="eyebrow">${label}</div><div class="bdg-grid">${L.filter((x) => x.fam === f).map((x) => {
const on = !!got[x.id], p = x.prog(state, b);
const info = on ? "Gagné le " + fmt(got[x.id]) + ". " + x.crit : x.crit + (p[1] > 1 ? ` Où tu en es : ${p[0]} / ${p[1]}.` : "");
return `<button type="button" class="bdg${on ? "" : " off"}" data-info="${esc(x.name + " · " + info)}">${Badges.icon(x, on, 48)}<span class="bdg-n">${x.name}</span><span class="small muted">${on ? fmt(got[x.id]) : p[1] > 1 ? p[0] + " / " + p[1] : "à gagner"}</span></button>`;
}).join("")}</div>`).join("")}
  <p class="small muted bdg-info" aria-live="polite">Touche un badge pour savoir comment le gagner.</p></details>`;
}
function bindBadges(root) {
const info = root.querySelector(".bdg-info");
root.querySelectorAll(".bdg[data-info]").forEach((x) => (x.onclick = () => { info.textContent = x.dataset.info; root.querySelectorAll(".bdg").forEach((y) => y.setAttribute("aria-pressed", y === x)); }));
}


function upgradeLesson(d) {
const id = d.dataset.id, box = d.querySelector(":scope > .stack");
if (!box || d.querySelector(".act-inline") || typeof ACTIVE === "undefined" || !ACTIVE[id]) return;
box.innerHTML = lessonBody(id); typeset(box); bindLessonFeedback(box); bindComment(box, "lecon-" + id); startInlineAct(box);
}
window.addEventListener("m2m-pack", () => document.querySelectorAll("details.lesson[data-id][open]").forEach(upgradeLesson));
function bindLessonOpen(root) {
root.querySelectorAll("details.lesson[data-id]").forEach((d) => d.addEventListener("toggle", () => { if (d.open && state) { Badges.onLesson(state, d.dataset.id); Badges.check(state); save(); } if (d.open) upgradeLesson(d); if (d.open) startInlineAct(d); }));
}

function startInlineAct(root) {
root.querySelectorAll(".act-inline[data-act]").forEach((el) => {
if (el.dataset.on) return;
const A = ACTIVE[el.dataset.act]; if (!A) return;
el.dataset.on = 1;
const X = actPrep(A), goal = el.querySelector(".act-goal"), fb = el.querySelector(".act-fb"), h = el.querySelector(".act-h");
if (h) h.innerHTML = '<span class="act-n">' + (X.mode === "guide" ? "✍" : "🖐") + "</span> " + X.titre;
const setG = (t) => { if (t.includes("\\(")) { goal.innerHTML = t; typeset(goal); } else goal.textContent = t; };
setG(X.lab(0) + " · " + X.defis[0]);
if (fb && goal && goal.previousElementSibling !== fb) goal.before(fb);
X.play(el.querySelector(".act-box"), (k, msg) => {
fb.innerHTML = `<div class="fb ok">✓ ${msg}</div>`;
if (k + 1 < X.defis.length) setG(X.lab(k + 1) + " · " + X.defis[k + 1]); else goal.textContent = X.fin;
});
});
}







const statsCard = () => {
if (statsAsked() || !(state && (state.firstDone || (state.history || []).length >= 2))) return "";
const t = day(), seen = UI.statsSeen || [];


if (UI.statsLater && addDays(UI.statsLater, 7) > t) return "";
if (!seen.includes(t)) { if (seen.length >= 2) return ""; UI.statsSeen = [...seen, t]; uiSave(); }
return `<div class="card flat stats-line" id="statscard"><span class="small">📊 Envoyer des statistiques <b>anonymes</b> pour améliorer l'app ?</span>
  <span class="row stats-btns"><button class="btn-primary small" id="statsoui">Oui</button><button class="btn-sec small" id="statsnon">Non</button><button class="btn-ghost small" id="statslater">Plus tard</button><button class="btn-ghost small" id="statsplus" aria-label="Le détail de ce qui est envoyé">?</button></span></div>`;
};



const exClasse = () => (state && state.profile && state.profile.system === "FR" ? "4e" : "10e");
function screenPrivacy(back) {
h(`${brand}<h2>Ce que l'app <span class="mark">envoie</span></h2>
  <p class="muted">Pas de compte, pas de nom, pas d'adresse e-mail. Ta progression reste sur ton appareil.</p>
  <div class="card flat"><b>Ton choix :</b> ${statsAsked() ? (statsOk() ? "tu aides à améliorer l'app (statistiques anonymes envoyées)." : "rien n'est envoyé (sauf les commentaires 💬 que tu écris toi-même).") : "pas encore choisi : rien n'est envoyé tant que tu n'as pas dit oui."} Modifiable dans les Réglages.</div>
  <div class="card flat stack"><b>Ce qui reste sur ton appareil</b>
  <ul class="plain"><li>Ta progression : ${isFR() ? "tes niveaux de maîtrise" : "tes notes de compétences"}, tes badges, ton Mathélo, l'historique de tes réponses.</li>
  <li>Un journal des 3 dernières erreurs techniques de l'app (message court, endroit dans le code, version, jour ; rien sur toi) : il ne part avec les statistiques que si tu as dit oui.</li>
  <li>Rien de tout cela n'est envoyé (sauf ce qui est décrit ci-dessous, question par question, sans rien qui te désigne). Le code de sauvegarde, lui aussi, n'est envoyé nulle part : c'est toi qui le gardes.</li></ul></div>
  <div class="card flat stack"><b>Ce qui est envoyé, de façon anonyme</b>
  <span class="small muted">Vers un tableau tenu par l'auteur de l'app (Google Sheets), pour l'améliorer pendant la phase de test :</span>
  <ul class="plain"><li><b>Un signal d'ouverture</b> (au plus une fois par jour) et <b>un signal de fin de séance</b>, avec la date et un identifiant tiré au hasard, propre à cet appareil. Il sert seulement à compter combien de personnes testent l'app.</li>
  <li><b>Le début et la fin de chaque séance</b>, avec ta classe et le format ; à la fin, le nombre de questions, le score et la durée en minutes. Ça sert à savoir si les séances sont trop longues ou trop difficiles.</li>
  <li><b>Pour chaque question et chaque rappel de cours</b> : le code de la question, si tu as trouvé (du premier coup ou non), si tu as quitté avant de répondre, le temps passé, l'aide utilisée (pas à pas, correction) et ta première réponse fausse (un nombre ou un calcul ; si tu as écrit des mots, seulement « [texte] »), avec le même identifiant. Ça sert à repérer les questions mal posées, trop dures, ou que l'app corrige mal.</li>
  <li><b>Tes avis</b> 👍 / 👎, « trop facile » et « pas compris », avec le code de la question ou du rappel et le même identifiant.</li>
  <li><b>Tes commentaires</b>, si tu en écris, avec ta classe (par exemple « ${exClasse()} ») et le même identifiant. N'y écris pas ton nom.</li>
  <li><b>Tes grades Mathélo</b>, quand tu en atteins un : le nom du grade et le même identifiant, pour te donner ton numéro de « collector ».</li>
  <li><b>Ton chapitre du moment</b>, si tu en choisis un : les notions, ta classe et le mois, sans identifiant. Ça sert à proposer les notions dans l'ordre où elles se font vraiment en classe.</li>
  <li><b>Les erreurs techniques</b> de l'app, si elle plante : le message d'erreur, l'endroit dans le code, la version de l'app, l'écran ou le code de la question, ta classe et le même identifiant (au plus 5 par jour). Ça sert à réparer les bugs qu'on ne voit pas.</li></ul></div>
  <p class="small muted">Identifiant tiré au hasard pour cet appareil : <code>${esc(deviceId() || "—")}</code></p>${isAuthor() ? '<p class="small"><b>Appareil de l\'auteur</b> : rien n\'est envoyé depuis cet appareil, sauf les commentaires 💬 (marqués « auteur »).</p>' : ""}
  <div class="card flat stack"><b>À savoir</b>
  <ul class="plain"><li>L'identifiant ne permet pas de savoir qui tu es : il n'est lié à aucun nom ni compte.</li>
  <li>Comme pour tout site, GitHub, qui héberge l'app, voit passer la connexion (adresse IP, type de navigateur) ; Google aussi, à chaque envoi vers le tableau. L'auteur de l'app n'a pas accès à ces adresses, et elles ne sont pas inscrites dans le tableau.</li>
  <li>Les polices et les formules mathématiques sont fournies par le site de l'app lui-même : aucun autre service n'est contacté.</li>
  <li>« Tout effacer » (dans les Réglages) supprime ta progression et l'identifiant de cet appareil. Ce qui a déjà été envoyé reste dans le tableau : pour le faire effacer, note d'abord ton identifiant (voir les mentions légales).</li></ul></div>
  <button class="btn-ghost small" id="legal">Mentions légales et confidentialité</button>
  <button class="btn-primary btn-big" id="back">Retour</button>`);
document.getElementById("back").onclick = back;
document.getElementById("legal").onclick = () => screenLegal(() => screenPrivacy(back));
}




const AC = (t) => `<mark>[À COMPLÉTER par l'enseignant : ${t}]</mark>`;
function screenLegal(back) {
let id = "";
try { id = localStorage.getItem("m2m-device") || ""; } catch (e) {}
const sec = (titre, corps) => `<div class="card flat stack"><h3>${titre}</h3>${corps}</div>`;
h(`${brand}<h2>Mentions légales <span class="mark">et confidentialité</span></h2>
  <div class="card flat stack"><b>Projet — à faire valider</b><span class="small muted">Ce texte est une première version. Les parties marquées « À COMPLÉTER » doivent encore être remplies et le tout vérifié avant une diffusion large.</span></div>
  <p class="muted">« ${APP_NAME} ${APP_TAGLINE} » est une application d'exercices de mathématiques, gratuite, sans compte et sans publicité. Cette page explique, pour les élèves et leurs parents, quelles données elle utilise, pourquoi, et comment exercer vos droits.</p>
  ${sec("1. Qui est responsable ?", `<ul class="plain"><li>Éditeur de l'app et responsable du traitement des données : ${AC("nom")}.</li>
  <li>Adresse : ${AC("adresse postale")}.</li>
  <li>Contact pour toute question ou demande sur les données : ${AC("adresse e-mail de contact")}.</li>
  <li>Cadre : ${AC("projet personnel ou projet lié à un établissement scolaire")}.</li></ul>`)}
  ${sec("2. À quoi servent les données ?", `<p>Uniquement à améliorer l'app pendant sa phase de test : compter combien de personnes l'utilisent, repérer les questions mal posées, trop difficiles ou mal corrigées, ajuster la durée des séances, réparer les erreurs techniques, proposer les notions dans l'ordre où elles se font en classe.</p>
  <p class="small muted">Pas de publicité, pas de revente, pas d'évaluation des élèves : les données ne servent pas à noter ni à juger qui que ce soit.</p>`)}
  ${sec("3. Quelles données ?", `<p><b>Jamais demandé :</b> nom, prénom, adresse e-mail, numéro de téléphone, école, compte. Il n'y a pas d'inscription.</p>
  <p><b>Gardé seulement sur l'appareil</b> (stockage local du navigateur) : la progression (notions, compétences, badges, Mathélo, historique des réponses), les réglages d'affichage, et un identifiant tiré au hasard, propre à l'appareil.</p>
  <p><b>Envoyé vers un tableau tenu par l'éditeur</b> (Google Sheets), avec cet identifiant :</p>
  <ul class="plain"><li>l'ouverture de l'app (au plus une fois par jour), le début et la fin de chaque séance, avec la date, la classe (par exemple « ${exClasse()} »), le format, le nombre de questions, le score et la durée ;</li>
  <li>pour chaque question ou rappel de cours : son code, le résultat (trouvé ou non, du premier coup ou non, quitté), le temps passé, l'aide utilisée et la première réponse fausse (un nombre ou un calcul ; des mots sont remplacés par « [texte] ») ;</li>
  <li>les avis (👍 / 👎, « trop facile », « pas compris ») et les commentaires écrits librement (500 caractères au plus ; il est demandé de ne pas y écrire de nom) ;</li>
  <li>les grades Mathélo atteints ;</li>
  <li>les erreurs techniques de l'app (message, endroit dans le code, version, écran), 5 par jour au plus.</li></ul>
  <p>Envoyé <b>sans identifiant</b> : le chapitre du moment choisi par l'élève (notions, classe, mois).</p>
  <p class="small muted">Le détail, écran par écran, est dans « Ce que l'app envoie ». Ces données ne permettent pas, à elles seules, de savoir qui est l'élève. Elles concernent toutefois un appareil précis : elles sont donc traitées comme des données personnelles.</p>`)}
  ${sec("4. Sur quelle base ?", `<p>Base légale du traitement : ${AC("par exemple intérêt légitime à améliorer un outil pédagogique, consentement, ou mission d'intérêt public si l'app est utilisée dans le cadre de l'école ; à déterminer avec l'établissement")}.</p>
  <p class="small muted">Lois applicables : loi fédérale suisse sur la protection des données (LPD) ; règlement européen (RGPD) pour les utilisateurs de l'Union européenne ; ${AC("loi cantonale, si l'app est utilisée par une école publique")}.</p>`)}
  ${sec("5. Combien de temps ?", `<ul class="plain"><li>Données envoyées : conservées ${AC("durée, par exemple jusqu'à la fin de la phase de test et au plus 12 mois")}, puis effacées ou rendues entièrement anonymes (totaux sans identifiant).</li>
  <li>Données sur l'appareil : jusqu'à ce que l'élève les efface (Réglages → « Tout effacer ») ou vide les données du site dans son navigateur.</li></ul>`)}
  ${sec("6. Qui reçoit les données ?", `<ul class="plain"><li>L'éditeur de l'app, seul à avoir accès au tableau.</li>
  <li><b>Google LLC</b> (États-Unis), qui fournit le tableau (Google Sheets) et le petit programme qui reçoit les envois (Google Apps Script) : il agit comme sous-traitant. Les données sont donc stockées <b>hors de Suisse et de l'Union européenne</b>. Garanties pour ce transfert : ${AC("par exemple certification Data Privacy Framework de Google, clauses contractuelles types")}.</li>
  <li><b>GitHub</b> (GitHub Inc., filiale de Microsoft, États-Unis) héberge l'app (GitHub Pages) : comme tout hébergeur, il reçoit l'adresse IP et le type de navigateur des visiteurs pour leur servir les pages, et peut les garder dans ses journaux techniques.</li>
  <li>Les polices de caractères et l'outil d'affichage des formules (MathJax) sont fournis par le site de l'app lui-même : aucun autre service n'est contacté.</li>
  <li>Aucune donnée n'est vendue ni transmise à des fins publicitaires.</li></ul>`)}
  ${sec("7. Vos droits", `<p>Vous pouvez demander à consulter les données envoyées depuis un appareil, à les faire corriger ou effacer, ou vous opposer à leur envoi.</p>
  <p><b>Comment :</b> écrire à ${AC("adresse e-mail de contact")} en indiquant l'identifiant de l'appareil. C'est le seul moyen de retrouver ses données, puisqu'elles ne sont liées à aucun nom. Les données envoyées sans identifiant (chapitre du moment) ne peuvent pas être retrouvées.</p>
  <p>Identifiant de cet appareil : ${id ? `<code>${esc(id)}</code>` : "aucun pour l'instant (rien n'a encore été envoyé depuis cet appareil)"}</p>
  <p class="small muted">Notez cet identifiant <b>avant</b> d'utiliser « Tout effacer » : l'effacement supprime la progression et l'identifiant sur l'appareil, mais pas ce qui a déjà été envoyé. En cas de désaccord, vous pouvez vous adresser à ${AC("autorité de protection des données compétente, par exemple le Préposé fédéral à la protection des données et à la transparence (PFPDT)")}.</p>`)}
  ${sec("8. Élèves mineurs", `<p>L'app s'adresse à des élèves, en général mineurs. C'est pourquoi elle ne demande aucune donnée qui permette de les identifier, ne montre pas de publicité et ne contient pas de messagerie. Les parents peuvent exercer les droits décrits ci-dessus pour leur enfant.</p>
  <p class="small muted">${AC("préciser si un accord des parents ou de l'établissement est demandé avant l'utilisation en classe")}</p>`)}
  ${sec("9. Cookies et stockage local", `<p>L'app n'utilise <b>aucun cookie</b> ni traceur publicitaire. Elle utilise le stockage local du navigateur pour garder la progression, les réglages et l'identifiant de l'appareil, ainsi qu'un cache hors ligne (pour fonctionner sans connexion). Ces informations restent sur l'appareil, sauf les envois décrits au point 3.</p>`)}
  ${sec("10. Hébergement et licences", `<ul class="plain"><li>Hébergement : GitHub Pages, GitHub Inc., San Francisco, États-Unis.</li>
  <li>Composants libres inclus : MathJax (licence Apache 2.0) ; polices Atkinson Hyperlegible, Bricolage Grotesque et JetBrains Mono (licence SIL Open Font License 1.1). <a href="vendor/LICENCES.txt" target="_blank" rel="noopener">Textes des licences</a>.</li></ul>`)}
  <p class="small muted">Version du ${AC("date de validation")}.</p>
  <button class="btn-primary btn-big" id="back">Retour</button>`);
document.getElementById("back").onclick = back;
try { window.scrollTo(0, 0); } catch (e) {}
}


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
  <div class="row"><button class="btn-primary" id="copy">Copier le code</button>${navigator.share ? '<button class="btn-sec" id="share">Envoyer…</button>' : ""}</div><span class="small muted" id="msg"></span></div>
  <div class="card flat stack"><b>Reprendre une progression</b><span class="small muted">Tu as un code d'un autre appareil ?</span><button class="btn-primary" id="restore">J'ai un code de sauvegarde</button></div>
  <button class="btn-primary btn-big" id="back">Retour</button>`);
const msg = document.getElementById("msg"), ta = app.querySelector(".code-box");

const marked = () => { UI.lastBackup = day(); uiSave(); };
app.querySelector(".code-box").addEventListener("copy", marked);
document.getElementById("copy").onclick = async () => { marked();
try { await navigator.clipboard.writeText(code); msg.textContent = "Code copié."; } catch (e) { ta.select(); msg.textContent = "Sélectionne le code et copie-le."; }
};
if (document.getElementById("share")) document.getElementById("share").onclick = () => marked() || navigator.share({ title: "Ma progression " + APP_NAME, text: "Mon code de sauvegarde " + APP_NAME + " (ouvre ce lien sur l'autre appareil) :", url }).catch(() => {});
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
document.getElementById("ok").onclick = () => { if (!s.a11y && state && state.a11y) s.a11y = state.a11y; state = s; save(); uiApply(); history.replaceState(null, "", location.pathname); toast("Progression reprise."); screenHome(); };
};
document.getElementById("check").onclick = check;
if (code) check();
}
function restoreFromHash() {


const ck = /^#auteur-cle=([A-Za-z0-9_-]{6,80})$/.exec(location.hash);
if (ck) {
try { localStorage.setItem("m2m-auteur", "1"); localStorage.setItem("m2m-cle", ck[1]); } catch (e) {}
history.replaceState(null, "", location.pathname);
screenStats(() => (state && state.placed ? screenHome() : screenWelcome()));
return true;
}
const au = /^#auteur(-off)?$/.exec(location.hash);
if (au) {
try { if (au[1]) localStorage.removeItem("m2m-auteur"); else localStorage.setItem("m2m-auteur", "1"); } catch (e) {}
history.replaceState(null, "", location.pathname);
h(`${brand}<div class="card stack"><div class="eyebrow">${au[1] ? "Appareil ordinaire" : "Appareil de l'auteur"}</div>
      <h2>${au[1] ? "Cet appareil compte de nouveau dans les statistiques" : "Cet appareil n'est plus compté dans les statistiques"}</h2>
      <p class="muted">${au[1] ? "Visites, séances, signaux et votes sont de nouveau envoyés, comme pour un élève." : "Plus de visites, séances, signaux muets ni votes envoyés depuis cet appareil. Tes commentaires 💬 arrivent toujours, marqués « auteur ». Pour annuler : …/#auteur-off."}</p>
      <button class="btn-primary btn-big" id="aok">Continuer</button></div>`);
document.getElementById("aok").onclick = () => (state && state.placed ? screenHome() : screenWelcome());
return true;
}
const m = /^#r=(.+)$/.exec(location.hash);
if (!m) return false;
screenRestore(m[1]);
return true;
}




function screenStats(back) {
const cle = (() => { try { return localStorage.getItem("m2m-cle") || ""; } catch (e) { return ""; } })();
const get = (q) => fetch(VOTE_ENDPOINT + "?" + q).then((r) => r.json());
const tile = (n, l) => `<div class="st-tile"><b>${n}</b><span class="small muted">${l}</span></div>`;
const fr = (d) => d.slice(8, 10) + "." + d.slice(5, 7);
h(`${brand}<div class="eyebrow">Appareil de l'auteur</div><h2>Statistiques d'usage</h2>
  <div class="card stack" id="st1"><p class="small muted">Chargement…</p></div>
  <div class="card stack" id="st2" ${cle ? "" : "hidden"}></div><div class="card stack" id="st4" ${cle ? "" : "hidden"}></div>
  ${cle ? "" : '<div class="card flat"><p class="small">Pour voir l\'activité par jour, ouvre une fois le lien <code>…/#auteur-cle=CLÉ</code> sur cet appareil (clé de lecture de l\'Apps Script).</p></div>'}
  <button class="btn-sec" id="streload">Actualiser</button><button class="btn-primary btn-big" id="stback">Retour</button>`);
const $ = (x) => document.getElementById(x);
$("stback").onclick = back; $("streload").onclick = () => screenStats(back);
if (!VOTE_ENDPOINT) { $("st1").innerHTML = "<p>Pas de point de collecte configuré.</p>"; return; }
get("testeurs=1").then((t) => {
$("st1").innerHTML = `<h3>Testeurs</h3><div class="st-tiles">${tile(t.testeurs_total, "appareils en tout")}${tile(t.actifs_7_jours, "actifs sur 7 jours")}${tile(t.actifs_aujourdhui, "aujourd'hui")}${tile(t.seances_terminees, "séances terminées")}</div>`;
}).catch(() => { $("st1").innerHTML = '<p class="small">Statistiques indisponibles (réseau ?).</p>'; });
if (!cle) return;
get("activite=" + encodeURIComponent(cle)).then((a) => {
if (a.erreur) { $("st2").innerHTML = `<p class="small">Clé refusée : ${esc(a.erreur)}</p>`; return; }
const J = (a.jours || []).slice(-14).reverse(), cl = {};
(a.jours || []).slice(-7).forEach((j) => Object.entries(j.classes || {}).forEach(([k, n]) => (cl[k] = (cl[k] || 0) + n)));
const pct = (x) => (x == null ? "–" : Math.round(x * 100) + " %"), mn = (x) => (x == null ? "–" : String(Math.round(x * 10) / 10).replace(".", ",") + " min");
$("st2").innerHTML = `<h3>Activité (14 derniers jours)</h3>
      <div class="st-tiles">${tile(a.retention ? a.retention["2_jours_ou_plus"] : "–", "revenus 2 jours ou plus")}${tile(a.retention ? a.retention["5_jours_ou_plus"] : "–", "revenus 5 jours ou plus")}${tile(a.trop_facile ?? "–", "« trop facile »")}</div>
      <table class="st-table"><thead><tr><th>Jour</th><th>Appareils</th><th>Séances</th><th>Réussite</th><th>Durée</th></tr></thead><tbody>
      ${J.map((j) => `<tr><td>${fr(j.jour)}</td><td>${j.appareils}</td><td>${j.seances_terminees}/${j.seances_commencees}</td><td>${pct(j.reussite_moy)}</td><td>${mn(j.minutes_moy)}</td></tr>`).join("")}</tbody></table>
      <p class="small muted">Séances : terminées / commencées. Classes sur 7 jours : ${Object.entries(cl).sort((x, y) => y[1] - x[1]).map(([k, n]) => esc(k) + " " + n).join(", ") || "aucune"}.</p>`;
}).catch(() => { $("st2").innerHTML = '<p class="small">Activité indisponible.</p>'; });

get("gradescomptes=" + encodeURIComponent(cle)).then((g) => {
if (!g || !Array.isArray(g.grades)) { $("st4").innerHTML = `<h3>Grades atteints</h3><p class="small">Indisponible${g && g.erreur ? " : " + esc(g.erreur) : " : redéploie l'Apps Script (tools/votes.gs)"}.</p>`; return; }
const L = g.grades.filter(([, n]) => n > 0), max = Math.max(1, ...L.map(([, n]) => n)), ic = Object.fromEntries(GRADES.map(([, i, name]) => [name, i]));
$("st4").innerHTML = `<h3>Grades atteints (appareils)</h3>${L.length ? `<table class="st-table"><tbody>${L.map(([name, n]) => `<tr><td>${ic[name] || ""} ${esc(name)}</td><td><span class="st-bar" style="width:${Math.round((n / max) * 100)}%"></span></td><td>${n}</td></tr>`).join("")}</tbody></table>` : '<p class="small muted">Aucun grade enregistré pour l\'instant.</p>'}
      <p class="small muted">Depuis le 25.11, grades de l'année (points de travail, remis à zéro à la rentrée), et non plus le Mathélo. Comptés depuis la mise en place des numéros collector : un grade atteint avant est enregistré quand l'élève ouvre « Mes grades » ou passe un nouveau grade. Tes appareils ne sont pas comptés.</p>`;
}).catch(() => { $("st4").innerHTML = '<h3>Grades atteints</h3><p class="small">Indisponible (réseau ?).</p>'; });

}


const nLabel = (id) => { const n = NOTIONS.find((x) => x.id === id), p = typeof state !== "undefined" && state && state.profile; if (!n) return id; return p && p.system === "FR" && n.labelFR && p.grade < n.labelFR[0] ? n.labelFR[1] : n.label; };
function nowCard() {
if (!Engine.nowActive(state)) return `<div class="stack now-in"><div class="eyebrow">📚 En ce moment en classe</div>
    <p class="small">Dis-moi ce que tu étudies en classe en ce moment : tes séances s'y concentreront.</p><button class="btn-primary btn-big" id="nowpick">Choisir mon chapitre</button></div>`;
const labels = state.now.ids.map(nLabel).join(" · ");
if (Engine.nowStale(state)) return `<div class="stack now-in"><div class="eyebrow">📚 En ce moment en classe</div>
    <h3>Toujours sur ${state.now.ids.length > 1 ? "ces notions" : "cette notion"} ?</h3><p class="small muted">${labels}</p>
    <div class="row"><button class="btn-primary" id="nowyes">Oui, toujours</button><button class="btn-sec" id="nowpick">On est passés à autre chose</button></div></div>`;
return `<div class="stack now-in"><div class="spread"><div class="eyebrow">📚 En ce moment en classe</div><button class="btn-ghost small" id="nowpick">Changer</button></div>
    <h3>${labels}</h3><p class="small muted">Environ 2 questions sur 3 de tes séances portent dessus.</p></div>`;
}
function bindNowCard() {
const b = document.getElementById("nowpick"), y = document.getElementById("nowyes");
if (b) b.onclick = screenNow;
if (y) y.onclick = () => { state.now.since = day(); save(); screenHome(); };
}



function nowChapters() {
const p = state.profile, cur = Engine.catalog(p).filter((c) => c.current && state.notions[c.id]);
return Engine.themeOrder(cur, p).map((th) => ({ th, label: Engine.themeLabel(th, p), ids: cur.filter((c) => c.theme === th).sort((a, b) => Engine.rank(p, a.id) - Engine.rank(p, b.id)).map((c) => c.id) })).filter((c) => c.ids.length);
}

function nowSample(ch) {
const own = ch.ids.filter(nowOwn), L = own.length ? own : ch.ids, id = L[Math.floor((L.length - 1) / 2)];
let q = null; try { q = Engine.make(state, id, 2, 7); } catch (e) {}
if (!q || !q.q) return "";
return `<div class="now-sample"><div class="qtext">${q.q}</div>${q.fig ? `<div class="figwrap">${q.fig}</div>` : ""}</div>`;
}



const nowOwn = (id) => { const n = NOTIONS.find((x) => x.id === id), pl = n && placeOf(n, state.profile); return !!(pl && pl[0] === state.profile.grade); };
function nowPickIds(ch) {
const open = ch.ids.filter((id) => { const n = state.notions[id]; return !(n && n.m >= 0.75 && n.ok >= 3); });
const L = open.length ? open : ch.ids, pick = new Set([...L.filter(nowOwn), ...L.filter((id) => !nowOwn(id))].slice(0, 5));
return ch.ids.filter((id) => pick.has(id));
}
function nowChoose(ch) { const ids = nowPickIds(ch); Engine.setNow(state, ids); save(); sendNow(ids); toast("Noté : tes séances se concentrent sur « " + ch.label.replace(/^\d+\.\s*/, "") + " »."); screenHome(); }
function screenNow() {
const chs = nowChapters();
if (chs.length < 2) return screenNowList();
const act = Engine.nowActive(state) ? new Set(state.now.ids) : null;
const isCur = (c) => act && c.ids.some((id) => act.has(id));
h(`${brand}<h2>Ça ressemble à <span class="mark">quoi</span> en classe ?</h2>
  <p class="muted">Touche le chapitre dont les exercices ressemblent à ceux que tu fais en ce moment.</p>
  <p class="small muted">Pas sûr ? Regarde ton cahier ou ta dernière fiche d'exercices.</p>
  ${((card) => {

const older = (c) => /^(CO )?\d+e · |^(2nde|1re|Tle|Collège) · /.test(c.label), L = chs.map((c, i) => [c, i]), A = L.filter(([c]) => !older(c)), B = L.filter(([c]) => older(c));
if (!A.length || !B.length) return L.map(card).join("");
return A.map(card).join("") + `<details class="now-older"${B.some(([c]) => isCur(c)) ? " open" : ""}><summary class="btn-ghost small">Chapitres des années précédentes (${B.length})</summary>${B.map(card).join("")}</details>`;
})(([c, i]) => `<button type="button" class="card now-card-pick${isCur(c) ? " now-was" : ""}" data-i="${i}"><b>${esc(c.label)}</b>${isCur(c) ? '<span class="small muted">Ton chapitre actuel</span>' : ""}${nowSample(c)}</button>`)}
  <div class="row"><button class="btn-ghost" id="back">Annuler</button>${act ? '<button class="btn-ghost" id="none">Rien de particulier en ce moment</button>' : ""}<button class="btn-ghost small" id="adv">Choisir notion par notion</button></div>`);
app.querySelectorAll(".now-card-pick").forEach((b) => (b.onclick = () => nowChoose(chs[+b.dataset.i])));
document.getElementById("back").onclick = screenHome;
document.getElementById("adv").onclick = screenNowList;
const none = document.getElementById("none");
if (none) none.onclick = () => { Engine.setNow(state, []); save(); screenHome(); };
}
function screenNowList() {
const p = state.profile, cur = Engine.catalog(p).filter((c) => c.current && state.notions[c.id]);
const chosen = new Set(Engine.nowActive(state) ? state.now.ids : []);
const box = (c) => `<label class="check"><input type="checkbox" value="${c.id}" ${chosen.has(c.id) ? "checked" : ""}> <span>${c.label}</span></label>`;
const groups = Engine.themeOrder(cur, state.profile).map((th) => [th, cur.filter((c) => c.theme === th).sort((a, b) => Engine.rank(p, a.id) - Engine.rank(p, b.id))]).filter(([, l]) => l.length);
h(`${brand}<h2>En ce moment <span class="mark">en classe</span></h2>
  <p class="muted">Choisis 1 à 5 notions que tu travailles en classe en ce moment. Tes séances s'y concentreront, avec le rappel de cours la première fois.</p>
  ${groups.map(([th, l]) => `<div class="card flat"><h3>${Engine.themeLabel(th, state.profile)}</h3><div class="checks">${l.map(box).join("")}</div></div>`).join("")}
  <p class="small muted" id="nerr"></p>
  <button class="btn-primary btn-big save-sticky" id="save">C'est ça</button>
  <div class="row"><button class="btn-ghost" id="back">Annuler</button>${chosen.size ? '<button class="btn-ghost" id="none">Rien de particulier en ce moment</button>' : ""}</div>`);
const inputs = [...app.querySelectorAll(".check input")];
inputs.forEach((i) => (i.onchange = () => {


inputs.filter((x) => x !== i && x.value === i.value).forEach((x) => (x.checked = i.checked));
const on = [...new Set(inputs.filter((x) => x.checked).map((x) => x.value))];

if (on.length > 5) { inputs.filter((x) => x.value === i.value).forEach((x) => (x.checked = false)); document.getElementById("nerr").textContent = "5 notions au plus : décoche-en une d'abord."; } else document.getElementById("nerr").textContent = "";
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

function sendNow(ids) {
try {
if (!canSend()) return;
const p = state.profile, niveau = gradeName(p) + (p.track === "mp" ? " MP" : "");
fetch(VOTE_ENDPOINT, { method: "POST", mode: "no-cors", body: JSON.stringify({ ev: "now", ids: ids.join(","), niveau, mois: day().slice(0, 7) }) }).catch(() => {});
} catch (e) {}
}


function screenPrep() {
const cat = Engine.catalog(state.profile).filter((c) => state.notions[c.id]);
const chosen = new Set(state.prep && Engine.prepActive(state) ? state.prep.ids : []);

const groups = {};

Engine.themeOrder(cat.filter((c) => c.current), state.profile).forEach((th) => { const l = cat.filter((c) => c.current && c.theme === th); if (l.length) groups[th] = [...l.filter((c) => nowOwn(c.id)), ...l.filter((c) => !nowOwn(c.id))]; });
const date = state.prep && Engine.prepActive(state) ? state.prep.date : addDays(day(), 7);


const nowIds = Engine.nowActive(state) ? state.now.ids : [];



const lastOf = (id) => Object.entries(state.comps || {}).reduce((a, [k, r]) => k.split(":")[0] === id && r.last > a ? r.last : a, "");
const G0 = Object.entries(groups), lastD = (l) => l.reduce((a, c) => (state.notions[c.id].seen > 0 && lastOf(c.id) > a ? lastOf(c.id) : a), "");
const pinned = new Set(G0.filter(([, l]) => l.some((c) => nowIds.includes(c.id) || chosen.has(c.id))).map(([th]) => th));
{ let best = null; G0.forEach(([th, l]) => { const d = lastD(l); if (d && (!best || d >= best[1])) best = [th, d]; });
if (best) pinned.add(best[0]); else if (!pinned.size) { const e = G0.find(([, l]) => l.some((c) => state.notions[c.id].status === "encours")); if (e) pinned.add(e[0]); } }
const recentG = (l) => G0.some(([th, l2]) => l2 === l && pinned.has(th));


const prepLab = (c, thL) => { const bare = (s) => String(s).replace(/^.*·\s*/, "").replace(/^\d+\.\s*/, "").trim().toLowerCase(); return bare(c.label) === bare(thL) ? "Les bases" + (c.ex ? " : " + esc(c.ex) : " du chapitre") : c.label; };
const grp = ([th, list]) => { const thL = Engine.themeLabel(th, state.profile); return `<div class="card flat"><h3>${thL}</h3><div class="checks">${list.map((c) => `<label class="check"><input type="checkbox" value="${c.id}" ${chosen.has(c.id) ? "checked" : ""}> <span>${prepLab(c, thL)}</span></label>`).join("")}</div></div>`; };
h(`${brand}<h2>Je prépare <span class="mark">une évaluation</span></h2>
  <p class="muted">Choisis les notions de ton évaluation et sa date. Jusqu'à ce jour-là, tes séances porteront surtout sur elles.</p>
  <div class="card flat stack"><label for="pdate"><h3>Date de l'évaluation</h3></label><input type="date" id="pdate" value="${date}" min="${day()}" class="datein"></div>
  ${Object.keys(groups).length ? "" : '<div class="card flat"><p class="muted">Rien à cocher : tout ce qui te concerne vient des années précédentes.</p></div>'}
  ${((G) => G.filter(([, l]) => recentG(l)).map(grp).join("") + (G.some(([, l]) => !recentG(l)) ? `<details class="card flat prep-more"${G.some(([, l]) => recentG(l)) ? "" : " open"}><summary>Autres chapitres de l'année (${G.filter(([, l]) => !recentG(l)).reduce((a, [, l]) => a + l.length, 0)} notions)</summary>${G.filter(([, l]) => !recentG(l)).map(grp).join("")}</details>` : ""))(Object.entries(groups))}
  <p class="small muted" id="perr"></p>
  <button class="btn-primary btn-big save-sticky" id="save">Enregistrer mon évaluation</button>
  <div class="row"><button class="btn-ghost" id="back">Annuler</button>${chosen.size ? '<button class="btn-ghost" id="del">Supprimer cette évaluation</button>' : ""}</div>`);
document.getElementById("save").onclick = () => {
const ids = [...app.querySelectorAll(".check input:checked")].map((i) => i.value), dt = document.getElementById("pdate").value;
if (!ids.length) { document.getElementById("perr").textContent = "Coche au moins une notion."; return; }
if (!dt || dt < day()) { document.getElementById("perr").textContent = "Choisis une date à partir d'aujourd'hui."; return; }
state.prep = { ids, date: dt, start: state.prep && state.prep.date === dt && state.prep.start ? state.prep.start : day() };
for (const id of ids) { const n = state.notions[id]; if (n.status !== "vu" && n.status !== "encours") Object.assign(n, { status: "encours", m: Math.max(0.4, n.m), due: day() }); }
save(); screenHome();
};
document.getElementById("back").onclick = screenHome;
const del = document.getElementById("del");
if (del) del.onclick = () => { state.prep = null; save(); screenHome(); };
}



function sentences(t) {
const out = []; let cur = "", math = 0;
for (let i = 0; i < t.length; i++) {
if (t.startsWith("\\(", i)) math++;
if (t.startsWith("\\)", i)) math = Math.max(0, math - 1);
cur += t[i];

const next = t.slice(i + 1, i + 4);
const endDot = t[i] === "." && /^ (?:[A-ZÀÂÉÈÊÎÔÛÇ0-9«]|\\\()/.test(next);
const endSemi = t[i] === ";" && /^ [A-ZÀÂÉÈÊÎÔÛÇ]/.test(next);
const listOfFormulas = t[i] === "," && cur.endsWith("\\),") && next.startsWith(" \\(");
if (!math && (endDot || endSemi || listOfFormulas)) { out.push(cur.trim().replace(/,$/, "")); cur = ""; }
}
if (cur.trim()) out.push(cur.trim());
return out;
}


const LESSON_FR_COL = { quartiles: L_("Étendue et médiane", "Deux nombres pour résumer une série.", "Trie d'abord la série. Étendue : la plus grande valeur moins la plus petite. Médiane : la valeur du milieu ; avec un effectif pair, la moyenne des deux valeurs centrales.",
["2, 3, 5, 8, 9 : étendue \\(9 - 2 = 7\\), médiane \\(5\\)", "4, 6, 9, 13 : médiane \\(\\frac{6 + 9}{2} = 7{,}5\\)"], "Chercher la médiane sans avoir trié la série.") };
const frCol = (id) => { const n = LESSON_FR_COL[id] && state && state.profile && state.profile.system === "FR" && NOTIONS.find((x) => x.id === id); return !!(n && n.labelFR && state.profile.grade < n.labelFR[0]); };
const lessonOf = (id) => (frCol(id) ? LESSON_FR_COL[id] : LESSONS[id]);
const activeOf = (id) => typeof ACTIVE !== "undefined" && !!ACTIVE[id] && !frCol(id);
function lessonBody(id) {
const L = lessonOf(id);
if (!L) return "";
const fig = typeof LESSON_FIGS !== "undefined" && LESSON_FIGS[id] && !frCol(id) ? `<div class="figwrap">${LESSON_FIGS[id]()}</div>` : "";
const act = activeOf(id) ? `<div class="act-inline stack" data-act="${id}"><div class="act-h"><span class="act-n">🖐</span> Manipule</div><p class="act-goal"></p><div class="act-box stack"></div><div class="act-fb"></div></div>` : "";
return `<p>${L.intro}</p>${act || fig}${retiensHtml(L)}
  <div class="lfb" data-id="${id}"><span class="small muted">Ce rappel est…</span><button class="small" data-v="up">👍 clair</button><button class="small" data-v="down">🤔 pas compris</button><span class="small muted lfb-msg"></span></div>
  ${commentBox("💬 Un commentaire sur ce rappel ?", "Ce qui n'est pas clair, un exemple qui manque… (n'écris pas ton nom)", "lecon-" + id)}`;
}


function retiensHtml(L) {
const ss = sentences(L.regle || ""), rule = ss.length > 1 ? "<ul>" + ss.map((x) => "<li>" + x + "</li>").join("") + "</ul>" : " · " + (L.regle || "");
const ex = L.exemple || [];
return `<div class="rule"><b>À retenir</b>${rule}</div>${ex.length ? `<details class="lx lx-ex"><summary>${ex.length > 1 ? "Voir des exemples" : "Voir un exemple"}</summary><div class="ex-list">${ex.map((e) => `<div>${e}</div>`).join("")}</div></details>` : ""}${L.piege ? `<details class="lx lx-trap"><summary>Le piège</summary><div class="trap"><b>Piège</b> · ${L.piege}</div></details>` : ""}`;
}
const lessonDetails = (id) => (LESSONS[id] ? `<details class="lesson" data-id="${id}"><summary>📖 Rappel de cours</summary><div class="stack">${lessonBody(id)}</div></details>` : "");



function screenLesson(id, cont0, review, track = true, opts = {}) {
const L = lessonOf(id);
if (state) { Badges.onLesson(state, id); save(); }
let S = null;
const cont = () => { if (S) { S.issue = "lue"; S.sec = sigSec(S); } cont0(); };
const open = () => { pageQ = "lecon-" + id; if (track) S = sigOpen({ ev: "lecon", code: "lecon-" + id, fmt: review ? "revue" : "nouvelle", kind: typeof ACTIVE !== "undefined" && ACTIVE[id] ? "active" : "rappel" }); };
if (activeOf(id)) { const r = activeLesson(id, L, cont, review, opts); open(); return r; }
h(`${brand}<div class="eyebrow">${review ? "Leçon" : opts.eyebrow || "Nouvelle notion · 30 secondes de cours"}</div>
  <div class="card pop lesson-card"><h2>${L.titre}</h2>${lessonBody(id)}</div>
  <button class="btn-primary btn-big" id="go">${review ? "Retour à mes compétences" : "J'ai compris, à moi !"}</button>`);
open();
document.getElementById("go").onclick = cont;
}


let session = null;

const FREE_THEMES = { no: "Nombres et opérations", fa: "Fonctions et algèbre", gm: "Grandeurs et mesures", es: "Espace" };



const CARNET_MAX = 40, CARNET_OK = 2;




const carnetNeed = () => (state && Engine.struggling(state) ? 1 : CARNET_OK);
const carnetRule = () => (carnetNeed() === 1 ? "une réussite du premier coup, ici ou dans tes séances" : "2 réussites de suite, du premier coup");

const carnetWeekN = () => (Array.isArray(state && state.carnetOut) ? state.carnetOut : []).filter((d) => d >= addDays(day(), -6)).length;
const carnetWeekTxt = () => { const n = carnetWeekN(); return n ? `✓ ${n} effacée${n > 1 ? "s" : ""} cette semaine` : ""; };




const isPrimId = (id) => typeof PRIM !== "undefined" && PRIM.isPrim(id);
function carnetAdd(id, d, code, m, a) {
if (!state || !id || !d || d > 3 || isPrimId(id)) return false;
const c = (state.carnet = state.carnet || []), e = c.find((x) => x.id === id && x.d === d);
if (e) { e.ok = 0; e.code = code; e.date = day(); } else c.push({ id, d, code, date: day(), ok: 0 });
{ const x = c.find((y) => y.id === id && y.d === d); if (m) { x.m = String(m).slice(0, 300); x.a = a ? String(a).slice(0, 60) : undefined; } else { delete x.m; delete x.a; } }
state.carnet = c.slice(-CARNET_MAX);
return true;
}
function carnetResult(id, d, firstTry) {
const c = state.carnet || [], e = c.find((x) => x.id === id && x.d === d);
if (!e) return null;
e.ok = firstTry ? e.ok + 1 : 0;
if (e.ok >= carnetNeed()) {
state.carnet = c.filter((x) => x !== e);

state.carnetOut = [...(Array.isArray(state.carnetOut) ? state.carnetOut : []).filter((d) => d >= addDays(day(), -6)), day()];
return "efface";
}
return firstTry ? "encore" : "rate";
}


function carnetSessionOk(id, d) {
if (!state || carnetNeed() !== 1) return 0;
let k = 0;
for (const e of (state.carnet || []).filter((x) => x.id === id && x.d <= d)) if (carnetResult(e.id, e.d, true) === "efface") k++;
return k;
}

function carnetPlan(n = 5, only) {
const c = (state.carnet || []).filter((x) => !only || only.includes(x.id));
return c.map((x, i) => [x, i]).sort((a, b) => b[0].ok - a[0].ok || a[1] - b[1]).slice(0, n).map(([x]) => x.id + "|" + x.d + "|carnet");
}


const carnetMax = () => (state && Engine.struggling(state) ? 3 : 5);
function startCarnet(only) {
const plan = carnetPlan(carnetMax(), only);
if (!plan.length) return screenHome();
session = { carnet: true, plan, i: 0, score: 0, answered: 0, start: Date.now(), elo0: state.elo.r, ids: new Set() };
nextQuestion();
toast("📕 Pour effacer une erreur : " + carnetRule() + ".", 4000);
}
const nLab = (id) => nLabel(id);


function carnetLeft(c) {
const near = c.filter((x) => x.ok >= carnetNeed() - 1 && x.ok > 0).length;
return c.length + " à effacer" + (near ? (near === c.length ? (near > 1 ? ", toutes presque effacées" : ", presque effacée") : ", dont " + near + " presque effacée" + (near > 1 ? "s" : "")) + " (encore 1 réussite)" : "");
}
function carnetCard(full) {
const c = state.carnet || [];
if (!c.length) return full ? `<div class="card flat stack"><div class="eyebrow">📕 Carnet d'erreurs</div><p class="small muted">Vide : bravo ! Chaque question ratée viendra s'y ranger, pour que tu puisses la réussir plus tard.</p>${carnetWeekN() ? `<p class="small carnet-week">${carnetWeekTxt()}</p>` : ""}</div>` : "";
const rows = full ? `<ul class="carnet-list">${c.slice().reverse().map((x) => `<li><span>${nLab(x.id)} <span class="dots small">${[1, 2, 3].map((k) => `<i class="${k <= x.d ? "on" : ""}"></i>`).join("")}</span></span><span class="small muted">${x.ok && carnetNeed() > 1 ? "✓ 1 sur 2" : "à refaire"}</span></li>`).join("")}</ul>` : "";
return `<div class="card stack carnet-card"><div class="eyebrow">📕 Carnet d'erreurs</div><h3>${c.length} erreur${c.length > 1 ? "s" : ""} à effacer</h3>${carnetWeekN() ? `<p class="small carnet-week">${carnetWeekTxt()}</p>` : ""}${c.some((x) => x.ok > 0) && carnetNeed() > 1 ? `<p class="small">${esc(carnetLeft(c).replace(/^\d+ à effacer, (dont )?/, "").replace(/^./, (m) => m.toUpperCase()))}.</p>` : ""}
    <p class="small muted">Refais-les avec d'autres nombres : ${carnetNeed() === 1 ? "une réussite du premier coup, ici ou dans tes séances, et elle disparaît" : "deux réussites de suite du premier coup, et elle disparaît"}.</p>${rows}
    <button class="btn-primary" id="carnetgo">Effacer mes erreurs (${Math.min(carnetMax(), c.length)} question${Math.min(carnetMax(), c.length) > 1 ? "s" : ""})</button></div>`;
}






const PREP_TASK = {
autoeval: { ic: "📋", label: "Autoévaluation", text: "Où en es-tu ? Coche ce que tu sais faire, puis un test rapide te dira si tu avais raison." },
revision: { ic: "🎯", label: "Révision ciblée", text: "4 questions sur les notions où tu es le moins sûr·e." },
mock: { ic: "📝", label: "Sujet de préparation", text: "Au choix, si tu as du temps : un sujet comme le vrai, sur une feuille, puis tu te corriges avec le corrigé." },
apres: { ic: "📋", label: "Test rapide final", text: "Où en es-tu maintenant ? Refais le test rapide : ta grille compare avec le début. Puis révise ce qui coince encore." },
tour: { ic: "📕", label: "Tes erreurs, une dernière fois", text: "4 questions : tes erreurs sur ces notions, puis ce qui reste à consolider, avec d'autres nombres." },
jourj: { ic: "✏️", label: "Échauffement, puis l'évaluation", text: "3 questions pour te mettre en route. Tu es prêt·e : bonne chance !" },
};




const prepTask = (kind) => {
if (kind === "apres" && !(typeof atState === "function" && atState().runs.length)) return PREP_TASK.autoeval;
if (kind === "tour" && state && state.prep) { let n = 4, at = false; try { const T = tourPlan(); n = T.plan.length; at = T.rat; } catch (e) {  }
return { ...PREP_TASK.tour, text: n + " question" + (n > 1 ? "s" : "") + " : tes erreurs sur cette évaluation" + (at ? ", puis ce que ton test rapide a raté" : ", puis ce qui reste à consolider") + ", avec d'autres nombres." }; }
return PREP_TASK[kind];
};
const prepLeft = (date, from = day()) => Math.round((new Date(date) - new Date(from)) / 864e5);
const prepStart = () => state.prep.start || Object.keys(state.prep.log || {}).sort()[0] || day();

function prepKindOn(dt = day()) {
const L = prepLeft(state.prep.date, dt);
if (L <= 0) return "jourj";
if (L === 1) return "tour";
if (L === 2) return "mock";
if (dt === prepStart() && L >= 3) return "autoeval";
return "revision";
}
const prepKind = () => prepKindOn(day());

function prepDays() {
const start = prepStart() < day() ? prepStart() : day(), n = prepLeft(state.prep.date, start), out = [];
for (let k = 0; k <= n; k++) { const dt = addDays(start, k); out.push({ dt, kind: prepKindOn(dt), done: !!(state.prep.log || {})[dt] }); }
if (out.length > 8) { const keep = out.slice(0, 1).concat([{ gap: out.length - 7 }], out.slice(-6)); return keep; }
return out;
}

function tomorrowLabel() {
if (Engine.prepActive(state) && prepLeft(state.prep.date, addDays(day(), 1)) >= 0) { const k = prepKindOn(addDays(day(), 1)); if (k === "tour") return PREP_TASK.tour.ic + " " + PREP_TASK.tour.label; if (k === "jourj") return "jour J : " + PREP_TASK.jourj.ic + " " + PREP_TASK.jourj.label; }
return FORMATS[Engine.tomorrowFormat(state)].label;
}
function prepMark(kind) {
if (!state || !Engine.prepActive(state)) return;
if (prepKind() !== kind) return;
(state.prep.log = state.prep.log || {})[day()] = kind; save();
}
function startPrepTask(kind) {
const ids = state.prep.ids.filter((id) => state.notions[id]);
if (kind === "autoeval") return screenQcm();
if (kind === "apres") { const A = typeof atState === "function" ? atState() : null; return A && A.runs.length ? atTest() : screenQcm(); }
if (kind === "mock") return typeof screenMock === "function" ? screenMock() : screenHome();
let plan;
if (kind === "revision") { const c = carnetPlan(2, ids); plan = c.concat(Engine.planPrep(state).slice(c.length)); }
else if (kind === "tour") plan = tourPlan().plan;
else plan = [...ids].sort((a, b) => state.notions[b].m - state.notions[a].m).slice(0, 3).map((id) => id + "|1");
session = { plan, i: 0, score: 0, answered: 0, start: Date.now(), elo0: state.elo.r, ids: new Set(), prep: true, prepKind: kind };
nextQuestion();
}


function tourPlan() {
const ids = state.prep.ids.filter((id) => state.notions[id]);
const A = state.autotest && state.autotest.key === state.prep.ids.join() && Array.isArray(state.autotest.rows) ? state.autotest : null, last = A && A.runs.length ? A.runs[A.runs.length - 1].r : {};
const rat = A ? A.rows.filter((r) => last[r.cid] === 0 && state.notions[r.id]).map((r) => r.id + "|" + Math.min(3, r.lv || 1)) : [];
const weak = [...ids].sort((a, b) => state.notions[a].m - state.notions[b].m).map((id) => id + "|" + Math.max(state.notions[id].m < 0.6 ? 1 : 2, Engine.minLevel(state, id)));
const plan = carnetPlan(4, ids);
for (const e of [...rat, ...weak]) if (plan.length < 4 && !plan.some((x) => x.split("|")[0] === e.split("|")[0])) plan.push(e);
return { plan, rat: rat.length > 0 };
}

function prepTodayCard() {
if (!Engine.prepActive(state)) return "";
const L = prepLeft(state.prep.date), kind = prepKind(), t = prepTask(kind), done = (state.prep.log || {})[day()];
return `<div class="card stack mode-test"><div class="eyebrow">📝 Mon évaluation · ${L === 0 ? "aujourd'hui" : L === 1 ? "demain" : "dans " + L + " jours"}${done ? " · étape du jour faite ✓" : ""}</div>
    <h2>${t.ic} ${t.label}</h2><p class="muted">${t.text}</p>
    <button class="${done ? "btn-ghost small" : kind === "mock" ? "btn-sec" : "btn-primary btn-big"}" id="preptask">${done ? "Refaire" : "C'est parti"}</button>
    <button class="btn-ghost small" id="preptab">Voir mon programme</button></div>`;
}
const prepJ = (dt, short) => { const d = new Date(dt + "T12:00:00"); return (short ? ["di", "lu", "ma", "me", "je", "ve", "sa"] : ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."])[d.getDay()] + (short ? "" : " " + d.getDate() + "." + String(d.getMonth() + 1).padStart(2, "0")); };

function prepPanel(left) {
const kind = prepKind(), t = prepTask(kind), done = (state.prep.log || {})[day()], days = prepDays(), steps = days.filter((x) => !x.gap);
const k = steps.findIndex((x) => x.dt === day()) + 1, nxt = steps.find((x) => x.dt > day());
const A = state.autotest && state.autotest.key === state.prep.ids.join() ? state.autotest : null, R0 = A && A.runs.length ? A.runs[A.runs.length - 1].r : null;
const okA = R0 ? Object.values(R0).filter((x) => x === 1).length : 0, nA = R0 ? Object.keys(R0).length : 0;
const mk = state.mock && state.mock.done && state.mock.ids.join() === state.prep.ids.join() ? state.mock.done : null;
const info = (x) => esc(prepJ(x.dt) + " · " + prepTask(x.kind).ic + " " + prepTask(x.kind).label + (x.dt === day() ? " (aujourd'hui)" : x.done ? " · fait ✓" : ""));
return `<div class="card stack prep-head"><div class="spread"><div class="eyebrow">📝 Mon évaluation</div><button class="btn-ghost small" id="prepedit">Modifier</button></div>
    <h2>${left === 0 ? "Aujourd'hui !" : left === 1 ? "Demain, " : prepJ(state.prep.date) + " · "}${left > 1 ? "dans " + left + " jours" : left === 1 ? prepJ(state.prep.date) : ""}</h2>
    <div class="chips">${state.prep.ids.map((id) => `<span class="chip">${esc(nLabel(id))}</span>`).join("")}</div></div>
  <div class="card stack prep-now"><div class="eyebrow">Aujourd'hui${k ? " · étape " + k + " sur " + steps.length : ""}${done ? " · fait ✓" : ""}</div>
    <h2>${t.ic} ${t.label}</h2><p class="small muted">${t.text}</p>
    <button class="btn-primary btn-big" id="prepgo">${done ? "Refaire" : "Commencer"}</button>
    ${done && nxt ? `<p class="small muted">Bravo ! Demain : ${prepTask(nxt.kind).ic} ${prepTask(nxt.kind).label}.</p>` : ""}</div>
  <div class="card flat stack"><h3>Mon programme</h3>
    <div class="pdays">${days.map((x) => x.gap ? `<span class="pgap" title="${x.gap} jours de révision ciblée">…</span>` : `<button type="button" class="pday${x.dt === day() ? " today sel" : ""}${x.done ? " done" : ""}" data-info="${info(x)}"><span class="pd-d">${prepJ(x.dt, true)}</span><span class="pd-i">${x.done ? "✓" : prepTask(x.kind).ic}</span></button>`).join("")}</div>
    <p class="small" id="pdayinfo">${info(days.find((x) => x.dt === day()) || steps[0])}</p>
    <p class="small muted">Touche un jour pour voir ce qu'on y fait.</p></div>
  <div class="card flat stack"><h3>En plus, quand tu veux</h3>
    <div class="tools2"><button class="btn-sec" id="prepauto">📋 ${A && A.runs.length ? "Ma grille" : "Autoévaluation"}<span class="small muted">${R0 ? okA + " juste" + (okA > 1 ? "s" : "") + " sur " + nA : "pas encore faite"}</span></button>
    <button class="btn-sec" id="mock">📝 Sujet de préparation<span class="small muted">${mk ? (mk.n ? mk.juste + " juste" + (mk.juste > 1 ? "s" : "") + " sur " + mk.n : "fait") : "avec corrigé"}</span></button>${typeof screenFiche === "function" ? '<button class="btn-sec fiche-btn" id="prepfiche">🗺 Ma fiche<span class="small muted">carte et règles de l\'évaluation</span></button>' : ""}</div></div>`;
}
function prepProgramHtml() {
const J = (dt) => { const d = new Date(dt + "T12:00:00"); return ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."][d.getDay()] + " " + d.getDate() + "." + String(d.getMonth() + 1).padStart(2, "0"); };
return `<ol class="prep-days">${prepDays().map((x) => x.gap ? `<li class="small muted">… ${x.gap} jour${x.gap > 1 ? "s" : ""} de révision ciblée de plus …</li>` : `<li class="${x.dt === day() ? "today" : ""}"><span>${J(x.dt)}</span><span>${prepTask(x.kind).ic} ${prepTask(x.kind).label}</span><span>${x.done ? "✓" : x.dt === day() ? "◀ aujourd'hui" : ""}</span></li>`).join("")}</ol>`;
}

function freeCard() {
return `<div class="card stack mode-free"><div class="eyebrow">🧭 Mode libre · mon défi du jour</div><h2>Tous les sujets, à ton rythme</h2>
    <p class="muted">Un parcours qui s'adapte à toi : si tout va bien, tu avances vite vers des notions nouvelles et plus difficiles ; si ça coince, on reprend d'abord les bases. Sans programme ni note : juste progresser.</p>
    <button class="btn-primary btn-big" id="freego">Relever le défi</button></div>`;
}
function startFree() {

let plan = Engine.oneLesson(state, Engine.freePlan(state, "annee", 8), 5);


const yearSet = new Set(Engine.catalog(state.profile).filter((c) => c.current).map((c) => c.id));
let p4 = 0; plan = plan.map((e) => { const x = e.split("|"); if (+x[1] === 4 && (!yearSet.has(x[0]) || p4++)) x[1] = "3"; return x.join("|"); });
const est = () => (lessonAtStart(plan) === 0 ? 60 : 0) + plan.reduce((t, e) => t + (+e.split("|")[1] === 4 ? 180 : 50), 0);
while (plan.length > 2 && est() > 330) plan.splice(plan.length - 1 - (+plan[plan.length - 1].split("|")[1] === 4 ? 1 : 0), 1);
plan = Engine.firstDayCap(state, plan);
if (!plan.length) return startSession();
if (state.freeRecent && state.freeRecent.length) state.freeRecent[state.freeRecent.length - 1] = plan.map((x) => x.split("|")[0]);
session = { free: true, plan, i: 0, score: 0, answered: 0, start: Date.now(), elo0: state.elo.r, ids: new Set(), lessonAt: lessonAtStart(plan) };
nextQuestion();
}
document.addEventListener("click", (e) => { const b = e.target.closest && e.target.closest(".pm-sq"); if (!b) return;
const box = b.parentNode.nextElementSibling, on = b.classList.contains("on");
document.querySelectorAll(".pm-sq.on").forEach((x) => x.classList.remove("on")); document.querySelectorAll(".pm-info").forEach((x) => (x.hidden = true));
if (!on && box) { b.classList.add("on"); box.textContent = b.dataset.i; box.hidden = false; } });

function themeMapCard() {


const p = state.profile, co = p.system === "CH" && p.grade <= 11, cat = Engine.catalog(p), cur = new Set(cat.filter((c) => c.current).map((c) => c.id));
const by = {}, order = [];
for (const [id, s] of Object.entries(state.notions)) {
const n = NOTIONS.find((x) => x.id === id); if (!n || !GEN[id] || isPrimId(id)) continue;
const k = co ? n.theme : cur.has(id) ? Engine.themeKey(p, id) : "_old";
if (!by[k]) { by[k] = []; order.push(k); }
by[k].push([n, s]);
}
const keys = co ? Object.keys(FREE_THEMES).filter((k) => by[k]) : [...Engine.themeOrder(order.filter((k) => k !== "_old").map((theme) => ({ theme })), p), ...(by._old ? ["_old"] : [])];
const title = (k) => (co ? FREE_THEMES[k] : k === "_old" ? "Années précédentes" : Engine.themeLabel(k, p));
const col = (s) => (!s.seen ? "var(--line)" : s.m >= 0.7 ? "var(--ok)" : s.m >= 0.45 ? "var(--warn)" : "var(--bad)");

const etat = (s) => (!s.seen ? "pas encore essayée" : s.m >= 0.7 ? "maîtrisée" : s.m >= 0.45 ? "en route" : "à travailler");
const rows = keys.map((k) => { const L = by[k], done = L.filter(([, s]) => s.seen && s.m >= 0.7).length;
return `<div style="margin:8px 0"><div class="spread small"><b>${esc(title(k))}</b><span class="muted">${done} / ${L.length} maîtrisées</span></div>
      <div class="pm-row">${L.map(([n, s]) => `<button type="button" class="pm-sq" title="${esc(n.label)}" aria-label="${esc(n.label)} : ${etat(s)}" data-i="${esc(n.label)} — ${etat(s)}" style="background:${col(s)}"></button>`).join("")}</div><div class="pm-info small" hidden></div></div>`; }).join("");
return `<div class="card stack"><div class="eyebrow">Ma carte de progression</div>${rows}
    <p class="small muted">Vert : maîtrisé · orange : en route · rouge : à travailler · gris : pas encore essayé. Touche une case pour voir la notion.</p></div>`;
}
function startSession() {
const fmt = Engine.todayFormat(state), plan = Engine.planSession(state, fmt);
Engine.logFormat(state, fmt); save();
session = { fmt, plan, i: 0, score: 0, answered: 0, start: Date.now(), elo0: state.elo.r, ids: new Set(), lessonAt: fmt === "auto" || plan.noLesson ? null : lessonAtStart(plan), noLesson: !!plan.noLesson };
nextQuestion();
}


const newNotion = (id) => { const ns = state.notions[id], n = NOTIONS.find((x) => x.id === id), pl = n && placeOf(n, state.profile); return !!(ns && !ns.seen && pl && pl[0] === state.profile.grade); };




const lessonAtStart = (plan) => {
const j = plan.findIndex((e) => !String(e).startsWith("PROB:") && Engine.lessonDue(state, String(e).split("|")[0]));
if (j < 0) return null;
if (j > 0) plan.unshift(plan.splice(j, 1)[0]);
return 0;
};
function sessStep(s) { const L = s.lessonAt != null ? 1 : 0; return { pos: s.i + 1 + (L && s.lessonAt <= s.i ? 1 : 0), total: s.plan.length + L }; }

const numsOf = (t) => new Set((String(t).replace(/<[^>]*>/g, " ").replace(/\\[a-z]+/gi, " ").match(/\d+(?:[.,]\d+)?/g) || []).map((x) => x.replace(",", ".")).filter((x) => x !== "0" && x !== "1"));
function lessonEcho(id, q) {
const A = typeof ACTIVE !== "undefined" && ACTIVE[id], L = LESSONS[id] || {}, R = A && A.retiens && typeof A.retiens === "object" ? A.retiens : {};
const items = [A && A.predict && A.predict.q, ...((A && A.defis) || []), ...((A && Array.isArray(A.plus) && A.plus.map((x) => x.d)) || []), ...(R.exemple || []), ...(L.exemple || [])].filter(Boolean);
const plain = (t) => String(t).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(), Q = numsOf(q.q);
const last = A && A.defis && A.defis.length ? plain(A.defis[A.defis.length - 1]) : null;
if (last && plain(q.q) === last) return true;
return Q.size >= 2 && items.some((t) => { const T = numsOf(t); return [...Q].every((x) => T.has(x)); });
}

const scratchHtml = () => `<button type="button" class="btn-ghost small scratch-btn" id="scrbtn">✏️ Brouillon</button>
  <div class="scratch" id="scr" hidden><canvas aria-label="Brouillon : écris avec le doigt"></canvas><div class="row"><button type="button" class="btn-ghost small" id="scrclr">Effacer</button><button type="button" class="btn-ghost small" id="scrclose">Fermer</button></div></div>`;
function bindScratch(S) {
const btn = document.getElementById("scrbtn"), box = document.getElementById("scr");
if (!btn || !box) return;
const cv = box.querySelector("canvas"); let ctx = null, down = false, used = false;
const setup = () => {
const r = cv.getBoundingClientRect(), k = window.devicePixelRatio || 1;
cv.width = r.width * k; cv.height = r.height * k; ctx = cv.getContext("2d"); ctx.scale(k, k);
ctx.lineWidth = 2.4; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = getComputedStyle(document.body).color;
};
const pos = (e) => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
cv.addEventListener("pointerdown", (e) => { down = true; cv.setPointerCapture(e.pointerId); const [x, y] = pos(e); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 0.1, y + 0.1); ctx.stroke(); if (!used && S) { used = true; sigAide(S, "b"); } });
cv.addEventListener("pointermove", (e) => { if (!down) return; const [x, y] = pos(e); ctx.lineTo(x, y); ctx.stroke(); });
["pointerup", "pointercancel"].forEach((t) => cv.addEventListener(t, () => (down = false)));
btn.onclick = () => { box.hidden = !box.hidden; btn.textContent = box.hidden ? "✏️ Brouillon" : "✏️ Cacher le brouillon"; if (!box.hidden && !ctx) setup(); };
document.getElementById("scrclr").onclick = () => { if (ctx) ctx.clearRect(0, 0, cv.width, cv.height); };
document.getElementById("scrclose").onclick = () => btn.onclick();
}

function sessionKeep() {
if (!session || session.weekly) return;
state.resume = { date: day(), s: { ...session, ids: [...(session.ids || [])], remed: [...(session.remed || [])] } }; save();
}
function resumeCard() {
const r = state.resume;
if (!r || r.date !== day() || !r.s || !r.s.answered || r.s.i >= r.s.plan.length) return "";
return `<div class="card stack resume-card"><div class="eyebrow">⏸ Séance en cours</div><p>Tu t'étais arrêté·e à l'étape <b>${sessStep(r.s).pos} sur ${sessStep(r.s).total}</b>.</p>
    <div class="row"><button class="btn-primary" id="resgo">Reprendre ma séance</button><button class="btn-ghost small" id="resno">Abandonner</button></div></div>`;
}
function resumeSession() {
const r = state.resume; if (!r) return;
session = { ...r.s, ids: new Set(r.s.ids || []), remed: new Set(r.s.remed || []), start: Date.now(), pinged: true };
nextQuestion();
}
function nextQuestion(redo) {
if (!redo) sessionKeep();
if (!redo && session.i === 0 && !session.pinged) { session.pinged = true; ping("start", sessionInfo()); }

if (!redo && session.i >= session.plan.length) return screenSummary();
const raw = redo ? redo.id : session.plan[session.i], forceProb = String(raw).startsWith("PROB:");
const parts = String(raw).split("|"), id = forceProb ? raw.slice(5) : parts[0], kind = redo ? redo.kind : parts[2];

const level = parts[2] === "drill" ? 1 : parts[1] ? +parts[1] : undefined;
const ns = state.notions[id];







const due = !redo && !session.ctest && !session.carnet && !session.prep && !forceProb && session.fmt !== "auto"  && !session.noLesson && ns && Engine.lessonDue(state, id)



&& !session.weekly;
if (due && !session.lessonDone && (session.lessonAt == null || session.lessonAt === session.i)) {
state.notions[id].lessonSeen = true; session.lessonDone = true; session.lessonAt = session.i; save();
const st = sessStep(session);
return screenLesson(id, () => { session.lessonShown = id; nextQuestion(); }, false, true, { short: true,
eyebrow: (newNotion(id) ? "Nouvelle notion" : "Rappel de cours") + " · étape " + (session.lessonAt + 1) + " sur " + st.total + `<span class="pbar" aria-hidden="true"><i style="width:${Math.round((session.lessonAt / st.total) * 100)}%"></i></span>` });
}


if (due && session.lessonDone && Engine.lessonFirst(state, id) && !ns.seen) { const sw = Engine.swapLesson(state, session.plan, session.i); if (sw) { session.plan[session.i] = sw; return nextQuestion(); } }


const easy = !redo && !session.weekly && !forceProb && session.lessonShown === id && !session.eased;
if (easy) session.eased = true;

let q = redo ? Engine.make(state, id, redo.d === 4 ? 4 : Math.max(1, redo.d - 1)) : Engine.make(state, id, session.weekly || forceProb ? 4 : easy ? 1 : level, undefined, !session.weekly && !forceProb);

if (!redo && session.ctest && session.ctest.forms && session.ctest.forms[id]) { const F = session.ctest.forms[id]; for (let k = 0; k < 60 && q && !F.includes(q.ctx); k++) q = Engine.make(state, id, level); }


if (!redo && session.ctest && q) {
const F = session.ctest.forms && session.ctest.forms[id], key = (x) => id + "|" + (x.ctx || qForm(x).replace(/\b(?:double|triple|quadruple|quintuple|moitié|tiers|quart)\b/g, "#"));
const used = (session.ctest.used = session.ctest.used || []);
for (let k = 0; k < 40 && used.includes(key(q)); k++) { const q2 = Engine.make(state, id, level); if (q2 && (!F || F.includes(q2.ctx))) q = q2; }
used.push(key(q));
}

if (!redo && session.weekly) for (let k = 0; k < 20 && q && q.d !== 4; k++) q = Engine.make(state, id, 4, undefined, false);


if (!redo && session.lessonShown === id) { const lv = q && q.d ? q.d : easy ? 1 : level; for (let k = 0; k < 40 && q && lessonEcho(id, q); k++) q = Engine.make(state, id, lv); }





if (redo && redo.d > 1 && redo.d < 4 && q) {
const W = (t) => new Set((String(t).replace(/\\\(.*?\\\)|<[^>]*>/g, " ").toLowerCase().match(/\p{L}{4,}/gu) || []));
const R0 = W(redo.q), near = (x) => (x.ctx && x.ctx === redo.ctx ? 100 : 0) + [...W(x.q)].filter((w) => R0.has(w)).length;
for (let k = 0, best = near(q); k < 9 && best < 100; k++) { const c = Engine.make(state, id, redo.d - 1); if (c && c.q !== redo.q && near(c) > best) { q = c; best = near(c); } }
}


if (!redo && q && session.replayQ && session.replayAt === session.i) {
const R = session.replayQ, near = (x) => (x.q === R.q ? -1 : x.ctx && x.ctx === R.ctx ? 1 : 0);
for (let k = 0, best = near(q); k < 10 && best < 1; k++) { const c = Engine.make(state, id, level); if (c && near(c) > best) { q = c; best = near(c); } }
}
if (redo) { for (let k = 0; k < 12 && q && q.q === redo.q; k++) q = Engine.make(state, id, redo.d === 4 ? 4 : Math.max(1, redo.d - 1));
if (!q || q.q === redo.q) { toast("Pas d'autre version de ce problème pour l'instant : on continue."); session.i++; return nextQuestion(); } }


if (!redo && !forceProb && kind === "drill" && !Engine.isDrill(q)) {
const q2 = Engine.makeDrill(state, id);
if (q2) q = q2;
else if ((session.drillSwap = (session.drillSwap || 0) + 1) <= 8) {
const ex = new Set([...session.plan.map((e) => String(e).split("|")[0]), id]), sw = Engine.planSlots(state, ["drill"], { exclude: ex })[0];
if (sw) { session.plan[session.i] = sw; return nextQuestion(); }
}
}


if (!redo && !forceProb && session.fmt === "defi" && level === 4 && q && q.d !== 4 && (session.defiSkip = [...(session.defiSkip || []), id]).length <= 4) {
const sw = Engine.planSlots(state, ["defi4"], { exclude: new Set(session.defiSkip) })[0];
if (sw && sw.split("|")[1] === "4") { session.plan[session.i] = sw; return nextQuestion(); }
}


if (!redo && q && session.lessonShown === id && lessonEcho(id, q)) {
for (let k = 0; k < 60; k++) {
const c = kind === "drill" && k < 20 ? Engine.makeDrill(state, id) : Engine.make(state, id, Math.min(4, (q.d || level) + (k >= 40 ? 1 : 0)));
if (c && !lessonEcho(id, c)) { q = c; break; }
}
}
q.kind = kind;
const ST = sessStep(session), nTxt = ST.pos + " sur " + ST.total;
const fmtLab = session.fmt && FORMATS[session.fmt] ? (newNotion(id) && session.lessonShown === id  ? "Nouvelle notion" : FORMATS[session.fmt].label)  : "";
renderQuestion(q, {
track: sessionInfo().fmt || "seance", redo: !!redo,





noRedo: !!redo || session.fmt === "auto" || Engine.struggling(state),
sub: session.ctest ? session.ctest.label : "",


eyebrow: ((s) => s + (ST.total > 1 && !session.weekly ? `<span class="pbar" aria-hidden="true"><i style="width:${Math.round((Math.min(ST.pos - 1, ST.total) / ST.total) * 100)}%"></i></span>` : ""))((session.carnet ? "Carnet d'erreurs · " + nTxt : session.free ? "Mon défi du jour · " + nTxt : session.weekly ? "🔍 Problème de la semaine" : session.ctest ? "Me tester · " + nTxt  : session.prep ? "Révision de l'évaluation · " + nTxt : ST.total === 1 ? (fmtLab || "Question du jour") : (fmtLab ? fmtLab + " · " : "") + nTxt) + (kind && KIND_LABEL[kind] && !(session.fmt && FORMATS[session.fmt] && FORMATS[session.fmt].slots.every((x) => x.replace(/\d+$/, "") === kind)) ? " · " + KIND_LABEL[kind] : "") + (ns && !session.prep && !Engine.isRecent(state, id) ? " · 🔙 Rappel" : "") + (redo || (session.replayQ && session.replayAt === session.i) ? " · nouvelles valeurs" : "")),


onGuided: (delta) => {
if (redo || session.weekly) return;
const back = Engine.eloRefund(state, delta), yp = ypAdd(state, 1);
session.ypg = (session.ypg || 0) + yp; session.rebuilt = (session.rebuilt || 0) + 1; save();
if (back || yp) toast("🪜 Tu as reconstruit la solution" + (yp ? " : +1 point de l'année" : "") + ".");
},
onDone: (res) => {
const sc = Engine.record(state, id, q.d, res.tries, res.solved, res.partial);

if ((session.carnet || kind === "carnet") && !redo) { const r = carnetResult(id, q.d, res.solved && res.tries === 1); if (r === "efface") { session.fixedN = (session.fixedN || 0) + 1; session.ypg = (session.ypg || 0) + ypAdd(state, YP.carnet); toast("📕 Effacée de ton carnet d'erreurs ✓"); } else if (r === "encore") toast("📕 1 réussite sur 2 : encore une, du premier coup, et elle sort du carnet.", 4000); else if (r === "rate") toast("📕 Elle reste dans ton carnet : il faut " + carnetRule() + ".", 4000); }
else if (!res.solved && !q.parts && !session.weekly && carnetAdd(id, q.d, q.code, res.diag, res.ans)) toast("📕 Rangée dans ton carnet d'erreurs : tu pourras la refaire.");

else if (res.solved && res.tries === 1 && !q.parts && !session.weekly) { const k = carnetSessionOk(id, q.d); if (k) { session.fixedN = (session.fixedN || 0) + k; session.ypg = (session.ypg || 0) + ypAdd(state, YP.carnet * k); toast("📕 Réussie : " + (k > 1 ? k + " erreurs effacées" : "erreur effacée") + " de ton carnet ✓"); } }



const replay = !redo && !session.replayUsed && !session.weekly && !session.prep && !session.carnet && !session.ctest && session.fmt !== "auto" && !q.parts && !(res.solved && res.tries === 1)
&& Engine.replayNext(state, session.plan, session.i, id, q.d, kind, session);
if (replay) { session.replayWas = session.plan[session.i + 1]; session.plan[session.i + 1] = replay; session.replayUsed = true; session.replayAt = session.i + 1; session.replayQ = { q: q.q, ctx: q.ctx }; }

if (!replay && !session.weekly && !session.prep && !session.carnet && sc < 0.5) {
session.remed = session.remed || new Set();

const p = !session.remed.has(id) && session.i + 1 < session.plan.length && Engine.remediation(state, id);
if (p) { session.remed.add(id); session.plan[session.i + 1] = p + "|1|rem"; }
}



if (!redo) session.failRun = res.solved && res.tries === 1 ? 0 : (session.failRun || 0) + 1;
if (!redo && !replay && !session.easeUsed && !session.weekly && !session.prep && !session.carnet && !session.ctest && session.failRun >= 2 && session.i + 1 < session.plan.length) { const e2 = Engine.easeNext(state, session.plan, session.i, id, q.d); if (e2) { session.plan[session.i + 1] = e2; session.easeUsed = true; } }


const w = redo ? 0 : res.dontKnow ? 0.4 : 1;
res.delta = w ? Engine.updateElo(state, id, q.d, sc, w) : 0;

session.ypg = (session.ypg || 0) + ypAdd(state, ypPoints(q.d, res, !!redo)) + (session.weekly && res.solved && !redo ? ypAdd(state, YP.weekly, "w") : 0);
session.score += sc; session.answered++; session.ids.add(id); if (res.solved) session.solvedN = (session.solvedN || 0) + 1;
if (res.parts) { session.parts = [(session.parts ? session.parts[0] : 0) + res.parts[0], (session.parts ? session.parts[1] : 0) + res.parts[1]]; session.nP = (session.nP || 0) + 1; }
session.res = session.res || {}; const rr = (session.res[id] = session.res[id] || { n: 0, ok: 0 }); rr.n++; if (res.solved) rr.ok++;
if (Engine.finishDay(state, 1, sc) === "joker") toast("🛡 Joker de série utilisé : ta série continue !"); save();
return res.delta;
},
onNext: (wantRedo) => {

if (wantRedo && !redo && session.replayQ && session.replayAt === session.i + 1) { session.plan[session.i + 1] = session.replayWas; session.replayQ = null; }
if (wantRedo) return nextQuestion(q); session.i++; nextQuestion(); },

onNotYet: session.weekly || session.prep || session.carnet ? null : () => { Engine.notYet(state, id); save(); toast("Noté : cette notion reviendra dans quelques semaines."); session.i++; nextQuestion(); },

onEasy: session.weekly || session.carnet || (session.skips || 0) >= 3 ? null : () => {
session.skips = (session.skips || 0) + 1;
const r = Engine.tooEasy(state, id, q.d, kind);
vote(q.code, "facile");
session.ids.add(id);
if (r.next && !redo) session.plan[session.i] = r.next; else session.i++;
save();
toast(r.next ? "Noté : on monte d'un cran." : "Noté, on passe à la suite.");
nextQuestion();
},
});
}



const KEYS = ["7", "8", "9", "/", "(", ")", "⌫", "4", "5", "6", "*", "^", "√", "π", "1", "2", "3", "-", "x", "y", "=", "0", ",", "+", ";", "⌨"];


const isTerm = (v) => { const m = String(+(+v).toPrecision(12)).match(/^-?\d+(?:\.(\d+))?(?:e([+-]\d+))?$/); return !!m && (m[1] || "").length - (+m[2] || 0) <= 8; };
function exactNote(spec, text) {
if (!spec) return "";
const t = text || "", notes = [];

if (spec.kind === "set" && !/« ; »|sépare/i.test(t)) notes.push("Plusieurs solutions : sépare-les par « ; ».");

if ((spec.kind === "set" || spec.kind === "solset") && !/∅/.test(t) && !notes.some((n) => /∅/.test(n))) notes.push(/aucune/i.test(t) ? "« aucune » : touche ∅ du clavier." : "Pas de solution : touche ∅ (ou écris « aucune »).");
if (spec.kind === "solset" && !/intervalle|« x|aucune|∅/i.test(t)) notes.push(notes.some((n) => /∅/.test(n))  ? "Réponds avec des intervalles (par exemple ]-∞ ; 2] ∪ [5 ; +∞[) ou « x ≥ 3 »." : "Réponds avec des intervalles (par exemple ]-∞ ; 2] ∪ [5 ; +∞[), « x ≥ 3 », ou ∅ (« aucune ») s'il n'y a pas de solution.");

if (spec.kind === "solset" && spec.ivs.some(([lo, , hi]) => !isFinite(lo) || !isFinite(hi))) notes.push("Infini : touche ∞ du clavier de l'app (−∞ : touche − puis ∞), ou tape « inf ».");

if (!spec.round && !spec.plain && !spec.sci && !spec.pow && !/exact|fraction|arrondi|au centième|au dixième|notation scientifique|puissance de 10/i.test(t)) {
const vals = spec.kind === "value" ? [spec.value] : spec.kind === "set" || spec.kind === "pair" ? spec.values : [];
if (vals.some((v) => isFinite(v) && !isTerm(v))) notes.push(vals.some((v) => isFinite(v) && !isTerm(v) && niceQ(v / Math.PI)) ? "Réponse exacte attendue (avec la touche π), pas d'arrondi." : "Réponse exacte attendue : fraction ou racine, pas d'arrondi.");
}
return notes.join(" ");
}

const SET_KEYS = ["7", "8", "9", "-", "+", "/", "⌫", "4", "5", "6", "[", "]", ";", "∞", "1", "2", "3", "x", "<", ">", "∪",
"0", ",", "≤", "≥", "≠", "=", "ℝ \\ {|}", "ℝ", "∅", "√", "⌨"];
const KEY_LABEL = { "*": "×", "ℝ \\ {|}": "ℝ∖{ }" };

const KEY_SUB = { "/": "fraction", "⌨": "clavier", "^": "puissance" };
const KEY_NAME = { "/": "barre de fraction", "⌨": "afficher le clavier du téléphone", "^": "puissance", "⌫": "effacer", "√": "racine carrée", "*": "fois", ";": "séparer deux réponses", "∪": "union", "∞": "infini", "∅": "aucune solution",

"-": "moins", "+": "plus", "(": "parenthèse ouvrante", ")": "parenthèse fermante", "[": "crochet ouvrant", "]": "crochet fermant", "<": "plus petit que", ">": "plus grand que",
"≤": "plus petit ou égal", "≥": "plus grand ou égal", "≠": "différent de", "=": "égal", "π": "pi", "ℝ": "ensemble des réels", "ℝ \\ {|}": "réels privés de", ",": "virgule" };
const keyIn = (k) => (KEY_LABEL[k] || k) + (KEY_SUB[k] ? `<small class="k-sub">${KEY_SUB[k]}</small>` : "");
const keyAttr = (k) => (KEY_NAME[k] ? ` title="${KEY_NAME[k]}" aria-label="${KEY_NAME[k]}"` : "");
const keyBtn = (k, narrowKb) => `<button type="button" class="${/^[\d,]$/.test(k) ? "" : "k-op"}${k === "0" || (k === "⌨" && !narrowKb) || k === "ℝ \\ {|}" ? " k-wide" : ""}" data-k="${esc(k)}"${keyAttr(k)}>${keyIn(k)}</button>`;
const isSetSpec = (spec) => !!spec && (spec.kind === "solset" || spec.kind === "ineq");


const niceQ = (x) => { if (!isFinite(x) || Math.abs(x) < 1e-3) return false; for (let d = 1; d <= 12; d++) if (Math.round(x * d) !== 0 && Math.abs(x * d - Math.round(x * d)) < 1e-6) return true; return false; };
const exactKeys = (spec) => { const v = spec.value; if (!isFinite(v) || isTerm(v)) return []; if (!spec.radical && !spec.pi && niceQ(v)) return [];  const pi = spec.pi || niceQ(v / Math.PI), root = spec.radical || !pi; return [...(root ? ["√"] : []), ...(pi ? ["π"] : [])]; };
const numKeys = (spec) => { const ex = exactKeys(spec).concat(spec.pow ? ["^"] : []);  return ["7", "8", "9", "⌫", "4", "5", "6", "-", "1", "2", "3", "/", "0", ",", ...ex, "⌨"]
.map((k) => `<button type="button" class="${/^[\d,]$/.test(k) ? "" : "k-op"}${k === "0" && !ex.length ? " k-wide" : ""}" data-k="${esc(k)}"${keyAttr(k)}>${keyIn(k)}</button>`).join(""); };

const keyLetters = (spec) => { let L = []; try { if (spec && spec.kind === "expr") L = [...Expr.vars(Expr.parse(spec.expr))].sort(); } catch (e) {} if (!L.length || (L.length <= 2 && L.every((v) => v === "x" || v === "y"))) return KEYS; const k = KEYS.slice(); k[k.indexOf("x")] = L[0]; k[k.indexOf("y")] = L[1] || (L[0] === "x" ? "y" : "x"); if (L[2]) k[k.indexOf("=")] = L[2]; return k; };





const CALC_KEYS = ["7", "8", "9", "/", "(", ")", "4", "5", "6", "*", "^", "⌫", "1", "2", "3", "-", "√", "π", "0", ",", "+", "⌨"];
const isCalcSpec = (spec) => !!spec && spec.kind === "value" && !spec.final;

const choixKeys = (n) => [...Array(n).keys()].map((i) => String(i + 1)).concat(["⌫"]).map((k) => `<button type="button" class="${k === "⌫" ? "k-op" : ""}" data-k="${k}"${keyAttr(k)}>${keyIn(k)}</button>`).join("");
const keysFor = (spec) => (spec && spec.choix ? choixKeys(spec.choix) : spec && spec.final ? numKeys(spec) : isSetSpec(spec) ? SET_KEYS.map((k) => keyBtn(k)).join("")
: isCalcSpec(spec) ? CALC_KEYS.map((k) => keyBtn(k)).join("")
: spec && spec.kind === "set" ? keyLetters(spec).flatMap((k) => (k === "⌨" ? ["∅", k] : [k])).map((k) => keyBtn(k, true)).join("") : keyLetters(spec).map((k) => keyBtn(k)).join(""));
const kpKind = (spec) => (spec && spec.choix ? "k-choix" : spec && spec.final ? "k-num" : isSetSpec(spec) ? "k-set" : isCalcSpec(spec) ? "k-calc" : spec && spec.kind === "set" ? "k-list" : "");
const kpKey = (spec) => { const kind = kpKind(spec); return kind + (spec && spec.choix ? spec.choix : "") + (kind === "k-num" && exactKeys(spec).length ? "r" : "") + (kind === "k-num" && spec.pow ? "p" : ""); };
const keypadHtml = (spec) => { const kind = kpKind(spec); return `<div class="keypad${kind ? " " + kind : ""}" id="kp" data-kind="${kpKey(spec)}">${keysFor(spec)}</div>`; };

function typeKey(inp, k) {
const s = inp.selectionStart ?? inp.value.length, e = inp.selectionEnd ?? inp.value.length;
if (k === "⌫") { const a = s === e ? Math.max(0, s - 1) : s; inp.value = inp.value.slice(0, a) + inp.value.slice(e); inp.setSelectionRange(a, a); return; }
const at = k.indexOf("|"), t = k.replace("|", ""), c = s + (at >= 0 ? at : t.length);
inp.value = inp.value.slice(0, s) + t + inp.value.slice(e); inp.setSelectionRange(c, c);
}

function previewHtml(v, spec) {
if (isSetSpec(spec)) {
const ivs = SolSet.parse(v).slice().sort((x, y) => x[0] - y[0]);

const holes = ivs.length && ivs[0][0] === -Infinity && ivs[ivs.length - 1][2] === Infinity && ivs.every((x, i) => !x[1] && !x[3] && (i === 0 || x[0] === ivs[i - 1][2])) ? ivs.slice(1).map((x) => x[0]) : null;
const nt = (x) => SolSet.show([[x, true, x, true]]).replace(/^\\\{|\\\}$/g, "");
return "\\(S = " + (holes ? "\\mathbb{R}" + (holes.length ? " \\setminus \\{" + holes.map(nt).join(" ; ") + "\\}" : "") : SolSet.show(ivs)) + "\\)";
}

if (spec && spec.kind === "set" && NONE_RE.test(v)) return "\\(S = \\varnothing\\)";
const t = Expr.parse(spec && spec.kind === "set" ? setInput(v) : v), val = Expr.vars(t).size || t.t === "list" ? "" : Expr.evaluate(t);

const plain = /^-?\d+([.,]\d+)?$/.test(v.replace(/\s|'/g, ""));
return "\\(" + Expr.tex(t) + "\\)" + (val !== "" && isFinite(val) && !plain && !(spec && spec.final) ? `<span class="val">≈ ${String(+val.toPrecision(8)).replace(".", ",")}</span>` : "");
}
function previewOf(inp, prev, spec) {
const v = inp.value.trim();
if (!v) { prev.innerHTML = ""; return; }


if (/^-?\d+([.,]\d+)?$/.test(v.replace(/\s|'/g, "")) && !isSetSpec(spec)) { prev.innerHTML = ""; return; }
try { prev.innerHTML = previewHtml(v, spec); typeset(prev); } catch (e) { prev.innerHTML = `<span class="err">${esc(e.message)}</span>`; }
}




const KP_GUARD = { moved: 0 };
window.addEventListener("scroll", () => { if (app.querySelector("#kp")) KP_GUARD.moved = performance.now(); }, { passive: true });
function kpWatch() {
const kp = app.querySelector("#kp"); if (!kp || !window.requestAnimationFrame) return;

let y = kp.getBoundingClientRect().top, t0 = performance.now();
const tick = () => {
if (!kp.isConnected || performance.now() - t0 > 4000) return;
const y2 = kp.getBoundingClientRect().top;
if (Math.abs(y2 - y) > 2) { KP_GUARD.moved = performance.now(); y = y2; }
requestAnimationFrame(tick);
};
requestAnimationFrame(tick);
}
function bindKeypad(getInput, after) {
let mode = window.matchMedia("(pointer: fine)").matches ? "text" : "none";
app.querySelectorAll("input.ans").forEach((i) => i.setAttribute("inputmode", mode));
KP_GUARD.moved = 0; kpWatch();
app.querySelectorAll("#kp button").forEach((b) => (b.onclick = (e) => {
const inp = getInput(), k = b.dataset.k;
if (!inp || inp.disabled) return;
if (e && e.isTrusted && KP_GUARD.moved && performance.now() - KP_GUARD.moved < 350) return;
if (k === "⌨") { mode = mode === "none" ? "text" : "none"; app.querySelectorAll("input.ans").forEach((i) => i.setAttribute("inputmode", mode)); inp.blur(); inp.focus(); return; }
typeKey(inp, k);
after(inp);
}));
}



function fbInView(el, ms = 60) {
setTimeout(() => { if (!el || !el.isConnected) return; const r = el.getBoundingClientRect(); if (r.height && r.bottom > innerHeight - qbarH()) el.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, ms);
}



function ansInView(inp, all) {
if (!inp || !inp.isConnected) return;
const vh = (window.visualViewport ? visualViewport.height : innerHeight) - qbarH(), r = inp.getBoundingClientRect();
if (all && imOf(inp) === "none") {
const box = inp.closest(".answer"), b = box ? box.getBoundingClientRect() : r;


const rc0 = document.getElementById("qrecap"), top0 = rc0 && !rc0.hidden ? rc0.getBoundingClientRect().bottom : 0;
if (b.bottom > vh - 4) { const d = Math.min(b.bottom - vh + 12, r.top - top0 - 8); if (d > 4) { window.scrollBy({ top: d, behavior: "smooth" }); return; } }
}
const rc = document.getElementById("qrecap"), top = rc && !rc.hidden ? rc.getBoundingClientRect().bottom : 0;
if (r.top < top + 4) window.scrollBy({ top: r.top - top - 12, behavior: "smooth" });
else if (r.bottom > vh - 4) inp.scrollIntoView({ block: "nearest", behavior: "smooth" });
}
const imOf = (inp) => inp.getAttribute("inputmode") || "text";


if (window.visualViewport) visualViewport.addEventListener("resize", () => {
const a = document.activeElement;
if (!a || !a.matches || !a.matches("input.ans, input#ans, textarea")) return;
const r = a.getBoundingClientRect(), vh = visualViewport.height - qbarH();
if (r.bottom > vh - 8 || r.top < 0) a.scrollIntoView({ block: "center", behavior: "smooth" });
});


function solStepper(box, btn, steps, onStep, onEnd) {
let k = 0;
const show = () => {
if (onStep) onStep(k);
box.insertAdjacentHTML("beforeend", `<div class="gstep"><span class="small muted">Étape ${k + 1} sur ${steps.length}</span><div class="sol">${steps[k]}</div></div>`);
typeset(box); k++;
if (k < steps.length) { btn.textContent = "Voir l'étape suivante (" + (k + 1) + " sur " + steps.length + ")"; if (k > 1) fbInView(btn, 120); }
else { btn.remove(); if (onEnd) onEnd(); }
};
btn.onclick = show; show(); btn.focus({ preventScroll: true });
}


function bindRecap() {
const rc = document.getElementById("qrecap"), qt = app.querySelector(".qtext"), card = app.querySelector(".card");
if (!rc || !qt || !card) return;
const upd = () => {
if (!rc.isConnected) { removeEventListener("scroll", onScroll); return; }
const on = qt.getBoundingClientRect().bottom < 0 && card.getBoundingClientRect().bottom > 90;
if (rc.hidden === !on) return;
rc.hidden = !on; if (!on) { rc.classList.remove("open"); rc.setAttribute("aria-expanded", "false"); }
};
const onScroll = () => upd();
addEventListener("scroll", onScroll, { passive: true });
rc.onclick = () => { const o = !rc.classList.contains("open"); rc.classList.toggle("open", o); rc.setAttribute("aria-expanded", String(o)); };
}






const qbarHtml = (left, right, more) => `<div class="qbar" id="qbar"><div class="qbar-in"><div class="qbar-l">${more ? `<div class="qmore"><button type="button" class="btn-ghost qmore-b" id="qmore" aria-label="Autres choix : pas encore vu, trop facile" aria-haspopup="true" aria-expanded="false">⋯</button><div class="qmenu" id="qmenu" hidden>${more}</div></div>` : ""}${left}</div><div class="qbar-r">${right}</div></div></div>`;
function qbarSet(left, right) { const b = document.getElementById("qbar"); if (!b) return; b.querySelector(".qbar-l").innerHTML = left; b.querySelector(".qbar-r").innerHTML = right; }
const qbarH = () => { const b = document.getElementById("qbar"); return b && b.isConnected && b.getClientRects().length && getComputedStyle(b).position !== "static" ? b.getBoundingClientRect().height : 0; };
const qmenuShow = (on) => { const m = document.getElementById("qmenu"), b = document.getElementById("qmore"); if (!m || !b) return; m.hidden = !on; b.setAttribute("aria-expanded", String(on)); };
function bindQmore() { const b = document.getElementById("qmore"); if (b) b.onclick = (e) => { e.stopPropagation(); qmenuShow(document.getElementById("qmenu").hidden); }; }

function qmoreTidy() { const m = app.querySelector(".qmore"); if (m && !m.querySelector("#notyet, #easy")) m.remove(); }
document.addEventListener("click", (e) => { if (e.target.closest && !e.target.closest(".qmore")) qmenuShow(false); });


const avisHtml = (code, lab, up, down) => `<div class="qfb"><span class="code" title="Code de la question">${code}</span><details class="cmt qfb-d"><summary aria-label="Ton avis : 👍, 👎 ou un commentaire" title="Ton avis sur cette question">💬</summary>
  <div class="vote"><span>${lab} <button data-v="up" aria-label="${up}">👍</button> <button data-v="down" aria-label="${down}">👎</button></span></div>
  <textarea class="cmt-t" maxlength="500" rows="3" placeholder="Un commentaire ? Une erreur, une consigne pas claire, une idée… (n'écris pas ton nom)" aria-label="Ton commentaire"></textarea>
  <div class="spread"><span class="small muted cmt-ok"></span><button class="small cmt-s">Envoyer</button></div></details></div>`;

function renderProblem(q, opt) {
const notion = NOTIONS.find((n) => n.id === q.id);
const code = q.code;
let tries = 0, finished = false, active = null, hintsShown = [];
const ok = q.parts.map(() => false);
h(`<div class="spread">${brand}</div><div class="eyebrow">${opt.eyebrow}</div>
  <div class="card pop"><div class="qmeta"><span class="chip">Problème · ${nLabel(notion.id)}</span><span class="dots" title="difficulté"><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i></span></div>
  <div class="qtext">${boldData(q.q)}</div>${q.fig ? `<div class="figwrap">${q.fig}</div>` : ""}
  ${scratchHtml()}
  ${lessonDetails(q.id)}
  ${q.parts.map((p, i) => `<div class="answer part" data-i="${i}"><label for="p${i}"><b>${p.label}</b>${exactNote(p.spec, p.label) ? ` <span class="small muted">${p.spec.kind === "set" ? "(« ; » entre les solutions, ∅ s'il n'y en a pas)" : "(valeur exacte)"}</span>` : ""} <span class="mk" id="mk${i}"></span></label>
    <input id="p${i}" class="ans" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Ta réponse…" enterkeyhint="${i < q.parts.length - 1 ? "next" : "done"}"><div class="preview" id="pv${i}"></div>${i < q.parts.length - 1 ? `<button type="button" class="btn-ghost small next-part" data-i="${i}">partie suivante ↓</button>` : ""}</div>`).join("")}
  ${keypadHtml(q.parts[0].spec)}
  <div id="fb" aria-live="polite"></div></div>
  ${qbarHtml('<button class="btn-sec" id="idk">Voir le corrigé</button>', '<button class="btn-primary" id="check">Vérifier</button>')}
  <button type="button" class="qrecap" id="qrecap" hidden aria-expanded="false"><span class="qr-tag">📌 Énoncé</span><span class="qr-txt">${boldData(q.q)}</span></button>`);
bindRecap();
const S = opt.track ? sigOpen({ ev: "q", code, d: q.d, kind: q.kind || "", fmt: opt.track, redo: opt.redo ? 1 : 0 }) : null;
sigWatchLesson(S); pageQ = code; bindScratch(S);
const fb = document.getElementById("fb");
q.parts.forEach((p, i) => {
const inp = document.getElementById("p" + i), pv = document.getElementById("pv" + i);

inp.onfocus = () => {
active = inp;
const kp = document.getElementById("kp"), kind = kpKind(p.spec);
if ((kp.dataset.kind || "") !== kpKey(p.spec)) {
kp.classList.remove("k-set", "k-num", "k-list", "k-calc", "k-choix"); if (kind) kp.classList.add(kind);
kp.dataset.kind = kpKey(p.spec); kp.innerHTML = keysFor(p.spec); bindKp(); }
placeKp(inp);
};
let tm; inp.oninput = () => { clearTimeout(tm); tm = setTimeout(() => previewOf(inp, pv, p.spec), 180); };
inp.onkeydown = (e) => { if (e.key === "Enter") { e.preventDefault(); goNext(i); } };
});



const goNext = (i) => {
if (finished) return;
const n = q.parts.length, L = [...Array(n - 1)].map((_, k) => (i + 1 + k) % n), j = L.find((k) => !ok[k] && !document.getElementById("p" + k).value.trim());
if (j === undefined || (i === n - 1 && j < i)) return check();
const inp = document.getElementById("p" + j); active = inp;
try { inp.focus({ preventScroll: true }); } catch (e) {}
inp.onfocus();
setTimeout(() => { const part = inp.closest(".part"), kp = document.getElementById("kp"); if (!part) return; const top = part.getBoundingClientRect().top, bot = (kp || part).getBoundingClientRect().bottom, vh = (window.visualViewport ? visualViewport.height : innerHeight) - qbarH();
if (top < 8 || bot > vh - 4) { window.scrollBy(0, top < 8 || bot - top > vh - 16 ? top - 8 : bot - vh + 12); KP_GUARD.moved = performance.now(); } }, 60);
};
app.querySelectorAll(".next-part").forEach((b) => (b.onclick = () => goNext(+b.dataset.i)));

const placeKp = (inp) => { const kp = document.getElementById("kp"), part = inp.closest(".part"); if (!kp || !part || kp.previousElementSibling === part) return; part.after(kp); KP_GUARD.moved = performance.now(); kpWatch(); setTimeout(() => kp.scrollIntoView({ behavior: "smooth", block: "nearest" }), 40); };
active = document.getElementById("p0");
placeKp(active);
if (window.matchMedia("(pointer: fine)").matches) setTimeout(() => { if (active && active.isConnected) active.focus({ preventScroll: true }); }, 30);
const bindKp = () => bindKeypad(() => active, (inp) => { previewOf(inp, document.getElementById("pv" + inp.id.slice(1)), q.parts[+inp.id.slice(1)].spec); ansInView(inp); });
bindKp();
const end = (giveUp) => {
finished = true;
app.querySelectorAll("input.ans, #kp button, #check, #idk").forEach((b) => (b.disabled = true));
app.querySelectorAll(".next-part").forEach((b) => b.remove());
{ const kp = document.getElementById("kp"); if (kp) kp.style.display = "none"; app.querySelectorAll(".card .preview").forEach((x) => (x.style.display = "none")); }
const frac = ok.filter(Boolean).length / q.parts.length, factor = [1, 1, 2 / 3, 1 / 3][Math.min(tries, 3)] || 1 / 3;
const score = giveUp && tries === 0 ? 0 : Math.round(frac * factor * 100) / 100;
if (S) { S.issue = frac === 1 ? (tries === 1 ? "ok1" : "ok2") : giveUp && tries === 0 ? "idk" : ok.some(Boolean) ? "partiel" : "faux"; S.essais = tries; S.sec = sigSec(S); }
if (frac === 1) burst();
buzz(frac === 1);
const delta = opt.onDone({ solved: frac === 1, tries, partial: score, dontKnow: !!(giveUp && tries === 0), parts: [ok.filter(Boolean).length, q.parts.length] });
const d = "";
const pSteps = frac < 1 && splitSol(q.sol);


const pAns = (sp) => !sp ? "" : sp.kind === "value" && isFinite(sp.value) ? String(sp.round ? +(Math.round(+(sp.value / sp.round).toPrecision(12)) * sp.round).toPrecision(12) : +sp.value.toPrecision(10)) .replace(/(\.\d*?)0{6,}\d*$/, "$1").replace(".", ",") : sp.kind === "expr" && sp.expr ? sp.expr : "";
const missed = q.parts.map((p, i) => [p, i]).filter(([, i]) => !ok[i]).map(([p, i]) => { const a = pAns(p.spec); return a ? `<li>${p.label.replace(/\s*\(.*?\)\s*$/, "")} : <b>${esc(a)}</b></li>` : ""; }).join("");
fb.innerHTML = `<div class="fb ${frac === 1 ? "ok" : "bad"} pop"><div class="spread"><b>${frac === 1 ? (tries === 1 ? "Problème résolu du premier coup !" : "Problème résolu.") : ok.filter(Boolean).length + " partie(s) juste(s) sur " + q.parts.length + "."}</b>${d}</div>${missed ? `<div class="small"><b>Les bonnes réponses</b><ul class="plain p-ans">${missed}</ul></div>` : ""}${pSteps ? `<div id="ssteps" class="stack"></div><button class="btn-primary" id="solstep">Voir l'étape suivante</button><details class="solfull"><summary>Voir directement la correction</summary><div class="sol">${q.sol}</div></details>` : `<div class="sol">${q.sol}</div>`}</div>
      ${avisHtml(code, "Ce problème était…", "Bon problème", "Problème à revoir")}`;
qbarSet(frac === 1 || opt.noRedo ? "" : '<button class="btn-sec" id="redo">Refaire avec d\'autres valeurs</button>', '<button class="btn-primary" id="nx">Continuer</button>');
typeset(fb);
fb.querySelectorAll(".vote button").forEach((b) => (b.onclick = () => { vote(code, b.dataset.v); fb.querySelectorAll(".vote button").forEach((x) => x.setAttribute("aria-pressed", x === b)); }));
bindComment(fb, code);
{ const t0 = performance.now(); document.getElementById("nx").onclick = (e) => { if (e && e.isTrusted && performance.now() - t0 < 400) return; opt.onNext(false); }; }
const r = document.getElementById("redo"); if (r) r.onclick = () => { sigAide(S, "x"); opt.onNext(true); };
if (pSteps) { const sf = fb.querySelector("details.solfull"); if (sf) sf.addEventListener("toggle", () => { if (sf.open) sigAide(S, "s"); }); solStepper(document.getElementById("ssteps"), document.getElementById("solstep"), pSteps, (k) => { if (k > 0) sigAide(S, "e"); }, () => { const sf2 = fb.querySelector("details.solfull"); if (sf2) sf2.remove(); document.getElementById("nx").focus({ preventScroll: true }); }); }
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
if (invalid) { if (S) S.illis = (S.illis || 0) + 1; fb.innerHTML = `<div class="fb hint pop"><b>Je n'arrive pas à lire une réponse</b><span>${esc(invalid)}</span></div>`; fbInView(fb); return; }
tries++;
q.parts.forEach((p, i) => {
document.getElementById("mk" + i).textContent = ok[i] ? "✓" : "✗";
if (ok[i]) document.getElementById("p" + i).disabled = true;
});
if (ok.every(Boolean) || tries >= 3) return end(false);
const nx = ok.findIndex((v) => !v); if (nx >= 0) { active = document.getElementById("p" + nx); placeKp(active); }


const L = String.fromCharCode(97 + nx), H = (q.hints || []).map((x) => String(x));
const tagged = H.find((x) => x.trim().startsWith(L + ")")), free = H.filter((x) => !/^[a-h]\)/.test(x.trim()));


let nHint = typeof HINTS !== "undefined" && HINTS[q.id] ? plainTeX(HINTS[q.id]) : "";

if (nHint && state.profile.system === "FR" && horsFRTexte(state.profile.grade, nHint)) nHint = typeof HINTS_FR_COL !== "undefined" && HINTS_FR_COL[q.id] ? plainTeX(HINTS_FR_COL[q.id]) : "";
let hint = tagged || (nx === q.parts.length - 1 && free.length ? free[Math.min(tries - 1, free.length - 1)] : nHint ? nHint  : "Partie " + L + ") : relis bien ce qui est demandé, et fais un calcul à la fois. Les données utiles sont dans l'énoncé.");


let rappel = false;
if (hintsShown.includes(hint)) { const alt = H.filter((x) => !/^[a-h]\)/.test(x.trim()) && !/(^|\s)[a-h]\)/.test(x.replace(new RegExp("(^|\\s)" + L + "\\)"), "")) && !hintsShown.includes(x)).concat(H.filter((x) => x.trim().startsWith(L + ")") && !hintsShown.includes(x)))[0];
if (alt) hint = alt; else rappel = true; }
if (!rappel) hintsShown.push(hint);
const hNum = hintsShown.length;
fb.innerHTML = `<div class="fb hint pop"><b>${ok.some(Boolean) ? "En partie juste. Continue !" : "Pas encore."}</b><span><b>${rappel ? "Rappel de l'indice" : "Indice " + hNum}</b> · ${escT(hint)}</span></div>`; fbInView(fb, 120);
};
document.getElementById("check").onclick = check;
document.getElementById("idk").onclick = () => { if (!finished) end(true); };
}


function renderQuestion(q, opt) {
if (q.parts) return renderProblem(q, opt);
const notion = NOTIONS.find((n) => n.id === q.id);
const code = q.code;
let tries = 0, finished = false, inputMode = "none";
h(`<div class="spread">${brand}</div>
  ${session && !opt.single && session.answered > 0 ? '<div class="spread"><span></span><button class="btn-ghost small" id="stop">Terminer ici</button></div>' : ""}
  <div class="eyebrow">${opt.eyebrow}</div>${opt.sub ? `<p class="small eb-sub">${esc(opt.sub)}</p>` : ""}
  <div class="card pop"><div class="qmeta"><span class="chip">${nLabel(notion.id)}</span><span class="dots" title="difficulté">${[1, 2, 3].map((k) => `<i class="${k <= q.d ? "on" : ""}"></i>`).join("")}</span></div>
  <div class="qtext">${boldData(q.q)}</div>${exactNote(q.spec, q.q) ? `<p class="small muted exact-note">${exactNote(q.spec, q.q)}</p>` : ""}${q.fig ? `<div class="figwrap">${q.fig}</div>` : ""}
  ${scratchHtml()}
  ${opt.single ? "" : lessonDetails(q.id)}
  <div class="answer"><input id="ans" autocomplete="off" autocapitalize="off" spellcheck="false" inputmode="none" placeholder="Ta réponse…" aria-label="Ta réponse">
  <div class="preview" id="prev"></div>
  ${keypadHtml(q.choix > 1 && q.choix <= 9 && q.spec.kind === "value" ? { ...q.spec, choix: q.choix } : q.spec)}</div>
  <div id="fb" aria-live="polite"></div></div>
  ${qbarHtml('<button class="btn-sec" id="idk">Je ne sais pas</button>', '<button class="btn-primary" id="check">Vérifier</button>', opt.onNotYet || opt.onEasy ? (opt.onNotYet ? '<button type="button" class="btn-sec notyet" id="notyet">Pas encore vu en classe</button>' : "") + (opt.onEasy ? '<button type="button" class="btn-sec easy" id="easy" title="Passer cette question et monter d\'un cran">Trop facile ⏭</button>' : "") : "")}`);
const S = opt.track ? sigOpen({ ev: "q", code, d: q.d, kind: q.kind || "", fmt: opt.track, redo: opt.redo ? 1 : 0 }) : null;
sigWatchLesson(S); pageQ = code; bindScratch(S);
const inp = document.getElementById("ans"), prev = document.getElementById("prev"), fb = document.getElementById("fb");


if (window.matchMedia("(pointer: fine)").matches) setTimeout(() => { if (inp.isConnected && !inp.disabled) inp.focus({ preventScroll: true }); }, 30);
if (window.matchMedia("(pointer: fine)").matches) { inp.setAttribute("inputmode", "text"); inputMode = "text"; inp.focus(); }
let tm;
const showPreview = () => {
clearTimeout(tm);
tm = setTimeout(() => {
const v = inp.value.trim();
if (!v) { prev.innerHTML = ""; return; }
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
showPreview(); ansInView(inp);
}));
if (!window.matchMedia("(pointer: fine)").matches) inp.addEventListener("focus", () => ansInView(inp, true));
const stopBtn = document.getElementById("stop");
if (stopBtn) stopBtn.onclick = () => { if (session) session.stopped = true; screenSummary(); };

let lastDiag = null, lastAns = null;
const end = (solved, dontKnow) => {
finished = true;
inp.disabled = true;
app.querySelectorAll("#kp button, #check, #idk, #notyet").forEach((b) => (b.disabled = true));

["kp", "prev"].forEach((x) => { const el = document.getElementById(x); if (el) el.style.display = "none"; });
buzz(solved);
setTimeout(() => { const f = document.getElementById("fb"); if (f && f.getBoundingClientRect().top > innerHeight * 0.75) f.scrollIntoView({ behavior: "smooth", block: "start" }); }, 80);
const res = { solved, tries, dontKnow, diag: solved ? null : lastDiag, ans: solved ? null : lastAns };
if (S) { S.issue = solved ? (tries === 1 ? "ok1" : "ok2") : dontKnow ? "idk" : "faux"; S.essais = tries; S.sec = sigSec(S); }
if (solved) burst();
const delta = opt.onDone(res);
if (opt.single) {
fb.innerHTML = `<div class="fb ${solved ? "ok" : "bad"} pop"><b>${solved ? "✓ Juste ! " + pick(PRAISE.filter((x) => x !== "Juste !")) : dontKnow ? "D'accord, on s'en occupera. Voici la solution :" : "✗ Pas tout à fait. Voici la solution :"}</b>${solved ? (q.sol ? '<details class="solfull"><summary>Voir la correction</summary><div class="sol">' + q.sol + "</div></details>" : "")  : '<span class="sol">' + q.sol + "</span>"}</div>`;
qbarSet("", '<button class="btn-primary" id="nx">Suivant</button>');
typeset(fb);
{ const t0 = performance.now(); document.getElementById("nx").onclick = (e) => { if (e && e.isTrusted && performance.now() - t0 < 400) return; opt.onNext(); }; }
document.getElementById("nx").focus();
return;
}
const d = "";

const guided = !solved && q.guide && q.guide.length;

const solSteps = !solved && !guided && splitSol(q.sol);
fb.innerHTML = `<div class="fb ${solved ? "ok" : "bad"} pop"><div class="spread"><b>${solved ? (tries === 1 ? pick(PRAISE) : "Juste au deuxième essai.") : dontKnow ? "Voici la méthode." : "Pas cette fois."}</b>${d}</div>
      ${!solved && lastDiag ? `<div class="diag">🔎 ${escT(lastDiag) }</div>` : ""}
      ${guided ? `<button class="btn-primary" id="guide">🪜 On le fait ensemble, pas à pas</button><div id="gsteps" class="stack"></div><details class="solfull"><summary>Voir directement la correction</summary><div class="sol">${q.sol}</div></details>` : solSteps ? `<div id="ssteps" class="stack"></div><button class="btn-primary" id="solstep">Voir l'étape suivante</button><details class="solfull"><summary>Voir directement la correction</summary><div class="sol">${q.sol}</div></details>` : `<div class="sol">${q.sol}</div>`}</div>
      ${avisHtml(code, "Cette question était…", "Bonne question", "Question à revoir")}`;

qbarSet(solved || opt.noRedo ? "" : `<button id="redo" class="${!guided && !solSteps ? "btn-primary" : "btn-sec"}">${q.d > 1 && q.d < 4 ? "💪 Une plus facile pour repartir" : "Refaire avec d'autres valeurs"}</button>`, `<button class="${solved || opt.noRedo ? "btn-primary" : "btn-sec"}" id="nx">Continuer</button>`);
typeset(fb);
fb.querySelectorAll(".vote button").forEach((b) => (b.onclick = () => { vote(code, b.dataset.v); fb.querySelectorAll(".vote button").forEach((x) => x.setAttribute("aria-pressed", x === b)); }));
bindComment(fb, code);
{ const t0 = performance.now(); document.getElementById("nx").onclick = (e) => { if (e && e.isTrusted && performance.now() - t0 < 400) return; opt.onNext(false); }; }
const r = document.getElementById("redo");
if (r) r.onclick = () => { sigAide(S, "x"); opt.onNext(true); };
const sf = fb.querySelector("details.solfull"); if (sf) sf.addEventListener("toggle", () => { if (sf.open) sigAide(S, "s"); });


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
if (gb) { gb.onclick = () => { sigAide(S, "g"); gb.remove(); fold(document.getElementById("gsteps")); runGuide(q, document.getElementById("gsteps"), (full) => { if (full && opt.onGuided) opt.onGuided(delta); const rd = document.getElementById("redo"); if (rd) { rd.classList.add("btn-primary"); rd.textContent = q.d > 1 && q.d < 4 ? "À toi : la même, un cran plus facile" : "À toi : une question du même type"; rd.focus(); } }); }; gb.focus(); }
else if (solSteps) {
const sb = document.getElementById("solstep"), box = document.getElementById("ssteps");


let folded = false;
solStepper(box, sb, solSteps, (k) => { if (k > 0 && !folded) { folded = true; fold(box); } if (k > 0) sigAide(S, "e"); }, () => { const sf2 = fb.querySelector("details.solfull"); if (sf2) sf2.remove(); const rd = document.getElementById("redo"); if (rd) { rd.classList.add("btn-primary"); rd.textContent = q.d > 1 && q.d < 4 ? "À toi : la même, un cran plus facile" : "À toi : une question du même type"; rd.focus(); } });
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
fb.innerHTML = `<div class="fb hint pop"><b>${r.calc ? "Le résultat, pas le calcul" : r.status === "form" ? "Presque" : "Je n'arrive pas à lire ta réponse"}</b><span>${esc(r.message || "")}</span></div>`;
fbInView(fb); return;
}
tries++;
const ez = document.getElementById("easy"); if (ez) ez.remove();
const ny = document.getElementById("notyet"); if (ny) ny.remove();
qmoreTidy();
const diag = r.status === "wrong" || (r.status === "close" && q.spec.kind === "set") ? diagnose(q, v) : null;
lastDiag = diag; if (diag) lastAns = v;
if (S && !S.rep1) { S.rep1 = sigRep(v); S.diag = diag ? 1 : 0; }
if (opt.single || tries >= 2) return end(false);
buzz(false);
fb.innerHTML = `<div class="fb hint pop"><b>${r.status === "close" ? "Presque !" : "Pas encore. Réessaie !"}</b><span>${escT(diag || r.message || "")}</span><span><b>Indice</b> · ${escT(q.hint)}</span></div>`;
typeset(fb);
inp.select(); fbInView(fb);
};
document.getElementById("check").onclick = check;
document.getElementById("idk").onclick = () => { if (!finished) end(false, true); };
bindQmore();
const ny = document.getElementById("notyet");
if (ny) ny.onclick = () => { if (!finished && tries === 0) { finished = true; if (S) { S.issue = "pasvu"; S.sec = sigSec(S); } opt.onNotYet(); } };
const ez = document.getElementById("easy");
if (ez) ez.onclick = () => { if (!finished && tries === 0) { finished = true; if (S) { S.issue = "facile"; S.sec = sigSec(S); } opt.onEasy(); } };
}



function diagPlus(q, v, text) {
const d = diagnose(q, v); if (d) return d;
if (!q.spec || q.spec.kind !== "value") return null;
let x; try { x = Expr.evaluate(Expr.parse(String(v))); } catch (e) { return null; }
const nums = (String(text || q.q || "").replace(/<[^>]*>/g, " ").match(/\d+(?:[.,]\d+)?/g) || []).map((t) => +t.replace(",", "."));
return isFinite(x) && Math.abs(x - q.spec.value) > 1e-9 && nums.some((n) => Math.abs(n - x) < 1e-9) ? "Il manque une partie du calcul : " + String(x).replace(".", ",") + " est un des nombres de départ, pas le résultat (n'oublie aucun terme)." : null;
}

function runGuide(q, box, done) {
let k = 0, nOk = 0;
const step = () => {

const fin = nOk === q.guide.length ? "Bravo, tu as reconstruit la solution." : nOk ? "Voici la solution complète (" + nOk + " étape" + (nOk > 1 ? "s" : "") + " juste" + (nOk > 1 ? "s" : "") + " sur " + q.guide.length + ")." : "Voici la solution complète : relis-la, étape par étape.";
if (k >= q.guide.length) { box.insertAdjacentHTML("beforeend", `<div class="gstep${nOk === q.guide.length ? " ok" : ""}"><b>${fin}</b><div class="sol">${q.sol}</div></div>`); typeset(box); done(nOk === q.guide.length); return; }
const g = q.guide[k], id = "gs" + k;

const fine = window.matchMedia("(pointer: fine)").matches, ks = g.spec.kind === "value" && !g.spec.sci ? { ...g.spec, final: true } : g.spec;
box.insertAdjacentHTML("beforeend", `<div class="gstep" id="${id}"><span class="small muted">Étape ${k + 1} sur ${q.guide.length}</span><div>${g.ask}</div>
      <div class="answer gans"><input class="ans gin" inputmode="${fine ? "text" : "none"}" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Ta réponse…" aria-label="Réponse de l'étape">
      <div class="preview gprev"></div>${keypadHtml(ks).replace(' id="kp"', "")}
      <div class="actions"><button class="btn-primary gok">Vérifier l'étape</button></div></div><div class="gfb"></div></div>`);
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
if (r.status === "invalid" || r.calc) { fbk.innerHTML = `<span class="small">${esc(r.message || "Réponse illisible.")}</span>`; return; }
inp.disabled = true; el.querySelector(".gok").remove(); const kp = el.querySelector(".keypad"); if (kp) kp.remove(); gprev.remove();
if (r.status === "correct") nOk++;
const dg = r.status === "correct" ? "" : diagPlus({ spec: g.spec, traps: g.traps }, v, g.ask);


const gv = g.spec.kind === "value" && isFinite(g.spec.value) ? (g.spec.round ? (+g.spec.value).toFixed(Math.max(0, Math.round(-Math.log10(g.spec.round)))) : String(+(+g.spec.value).toPrecision(10))).replace(".", ",").replace("-", "−") : "";
const solTxt = String(g.sol || "").replace(/<[^>]+>/g, " ").replace(/\{,\}/g, ",").replace(/\\text\{'\}/g, "'").replace(/-/g, "−");
const shown = !gv || new RegExp("(^|[^\\d,])" + gv.replace(/[,.]/g, "\\$&") + "(?![\\d]|,\\d)").test(solTxt);
fbk.innerHTML = `<div class="${r.status === "correct" ? "gok-msg" : "gno-msg"}">${r.status === "correct" ? "✓ Oui." : dg ? escT(dg) : "Pas tout à fait."}${r.status !== "correct" && !shown ? ` Réponse de l'étape : <b>${esc(gv)}</b>.` : ""} ${g.sol}</div>`;
typeset(fbk); k++; step();
};
el.querySelector(".gok").onclick = go;
inp.onkeydown = (e) => { if (e.key === "Enter") go(); };
inp.focus({ preventScroll: true });
if (k > 0) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
};
step();
}


function toast(msg, ms = 2200) {
const t = document.createElement("div");
t.className = "toast pop"; t.setAttribute("role", "status"); t.textContent = msg;
document.body.appendChild(t);
setTimeout(() => t.remove(), ms);
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


function deviceId() {
try {
let id = localStorage.getItem("m2m-device");
if (!id) { id = Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4); localStorage.setItem("m2m-device", id); }
return id;
} catch (e) { return ""; }
}
function ping(ev, extra = {}) {
try {
if (!VOTE_ENDPOINT || location.protocol !== "https:" || /claude/.test(location.hostname) || isAuthor() || location.hash === "#auteur" || /^#parent/.test(location.hash) || !statsOk()) return;
if (ev === "open") { if (localStorage.getItem("m2m-ping") === day()) return; localStorage.setItem("m2m-ping", day()); errFlush();  }
fetch(VOTE_ENDPOINT, { method: "POST", mode: "no-cors", body: JSON.stringify({ ev, dev: deviceId(), date: day(), ...extra }) }).catch(() => {});
} catch (e) {}
}









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



const canSend = () => VOTE_ENDPOINT && location.protocol === "https:" && !/claude/.test(location.hostname) && !isAuthor() && statsOk();



function isAuthor() { try { return localStorage.getItem("m2m-auteur") === "1"; } catch (e) { return false; } }
try { if (isAuthor()) document.documentElement.classList.add("auteur"); } catch (e) {}
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


function flushComments(except) {
document.querySelectorAll("details.cmt").forEach((box) => {
const b = box.querySelector(".cmt-s"), ta = box.querySelector(".cmt-t");
if (b && ta && b !== except && !ta.disabled && ta.value.trim()) b.click();
});
const sheet = document.getElementById("fabs"), fg = document.getElementById("fabg"), ft = document.getElementById("fabt");
if (sheet && fg && ft && fg !== except && ft.value.trim()) fg.click();
}

document.addEventListener("click", (e) => { const g = e.target.closest && e.target.closest(".grade-open, .grade-now, .grade-up, .grades li.ok, .grades li.cur"); if (!g) return; const o = g.matches(".grade-open") ? g : g.querySelector(".grade-open"); if (o) gradeCard(o.dataset.g); });
document.addEventListener("click", (e) => {
const b = e.target.closest && e.target.closest("button");
if (!b || b.matches(".cmt-s, #fabg, #fabx, #fabc") || b.closest("details.cmt, #fabs")) return;
flushComments(b);
}, true);

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
if (VOTE_ENDPOINT && location.protocol === "https:" && !/claude/.test(location.hostname)) fetch(VOTE_ENDPOINT, { method: "POST", mode: "no-cors", body: JSON.stringify({ ev: "comment", code, text: text.slice(0, 500), niveau: (isAuthor() ? "auteur · " : "") + niveau, dev: deviceId(), date: day() }) }).catch(() => {});
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


const sessionInfo = () => ({ niveau: state ? gradeName(state.profile) + (state.profile.track === "mp" ? " MP" : "") : "", fmt: session.carnet ? "carnet" : session.ctest ? "competence" : session.prep ? (session.prepKind ? "test-" + session.prepKind : "test") : session.weekly ? "semaine" : session.fmt || "" });



const xReady = () => typeof Curieux !== "undefined" || typeof window.loadPack !== "function";
function withX(f) {
if (xReady()) return f();
window.loadPack("x").then(f, () => toast("Pas de connexion : cette partie de l'app n'est pas encore sur cet appareil. Réessaie une fois connecté."));
}
const curBonus = () => (typeof Curieux !== "undefined" && Curieux.available(state).length ? '<button class="btn-primary" id="curbonus">🤔 Bonus : une question curieuse</button>' : "");

function curiousCard() {
if (typeof Curieux === "undefined" || !Curieux.available(state).length) return "";
return `<div class="card stack"><div class="eyebrow">🤔 Question curieuse</div><h2>Les maths cachées</h2>
    <p class="muted">Une pub, un paradoxe, une situation de tous les jours : fais ton pari, puis vérifie par le calcul. Ça surprend souvent !</p>
    <button class="btn-primary" id="curgo">Essayer</button><p class="small muted">Facultatif, sans note ni Mathélo.</p></div>`;
}





function screenCurious(q, back, from = "") {
if (!q) { toast("Pas encore de question curieuse pour toi : elles arrivent avec les notions vues en classe."); return back(); }
if (state) { state.curSeen = [...(state.curSeen || []).filter((k) => k !== q.key), q.key].slice(-20); save(); }
const F = CUR_FAM[q.fam] || { label: "Question curieuse", ic: "🤔" };
const spec = { kind: "value", value: q.calc.value, ...(q.calc.round ? { round: q.calc.round } : {}) };
h(`${brand}${backTop("cback0")}<div class="eyebrow">${F.ic} Question curieuse · ${F.label}</div>
  <div class="card pop stack"><h2>${q.titre}</h2><div class="qtext">${q.q}</div>${q.fig ? `<div class="figwrap">${q.fig}</div>` : ""}
    <div class="act-step"><div class="act-h"><span class="act-n">1</span> Ton pari</div><p>${q.bet.q}</p>
      <div class="seg" id="cbet">${q.bet.choices.map((c, i) => `<button type="button" data-i="${i}">${c}</button>`).join("")}</div><div id="cbfb" aria-live="polite"></div></div>
    <div class="act-step" id="cs2" hidden><div class="act-h"><span class="act-n">2</span> On vérifie</div><p>${q.calc.label}</p>
      <div class="answer"><input class="ans" id="cans" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Ta réponse…" aria-label="Ta réponse">
      <div class="preview" id="cprev"></div>${keypadHtml(spec)}
      <div class="actions"><button class="btn-primary" id="cok">Vérifier</button><button class="btn-sec" id="cidk">Voir la réponse</button></div></div><div id="cfb" aria-live="polite"></div></div>
    <div class="act-step" id="cs3" hidden><div class="act-h"><span class="act-n">3</span> Le fin mot</div><div class="sol">${q.reveal}</div>
      <div class="rule"><b>🧠 Ici, tu as utilisé</b> ${q.outil}</div><p class="small muted code cur-code">${q.code}</p></div>
  </div>
  <button class="btn-primary btn-big" id="cnext" hidden>Une autre question curieuse</button>
  <button class="btn-ghost" id="cback">Retour</button>`);
pageQ = q.code;
const S = from ? sigOpen({ ev: "q", code: q.code, d: 0, kind: "curieux", fmt: from }) : null;
const $ = (x) => document.getElementById(x), inp = $("cans"), prev = $("cprev");
const show = (el) => { el.hidden = false; el.classList.add("pop"); typeset(el); setTimeout(() => el.scrollIntoView && el.scrollIntoView({ behavior: "smooth", block: "start" }), 60); };
let betOk = null, tries = 0;
app.querySelectorAll("#cbet button").forEach((b) => (b.onclick = () => {
betOk = +b.dataset.i === q.bet.good;
if (S) sigAide(S, betOk ? "P" : "p");
app.querySelectorAll("#cbet button").forEach((x) => (x.disabled = true));
b.setAttribute("aria-pressed", "true");
$("cbfb").innerHTML = `<div class="small muted">Pari noté. Vérifions par le calcul !</div>`;
show($("cs2")); if (window.matchMedia("(pointer: fine)").matches) inp.focus();
}));
inp.oninput = () => previewOf(inp, prev, spec);
bindKeypad(() => inp, () => previewOf(inp, prev, spec));

const rangeCheck = (v) => {
let x; try { const t = Expr.parse(v.replace(/[\s'’]/g, "")); if (Expr.vars(t).size) throw new Error("La réponse est un nombre : pas de lettre."); x = Expr.evaluate(t); } catch (e) { return { status: "invalid", message: e.message }; }
const [lo, hi] = q.calc.range;
if (x >= lo - 1e-9 && x <= hi + 1e-9) return { status: "correct" };
if (x >= lo / 2 && x <= hi * 2) return { status: "close", message: "Le bon ordre de grandeur ! Vérifie tes calculs pour t'approcher encore." };
return { status: "wrong" };
};
const finish = (calcOk, idk) => {
if (S) { S.issue = calcOk ? (tries === 0 ? "ok1" : "ok2") : idk && tries === 0 ? "idk" : "faux"; S.essais = tries + (calcOk ? 1 : 0); S.sec = sigSec(S); if (idk) sigAide(S, "s"); }
inp.disabled = true; ["kp", "cok", "cidk"].forEach((x) => $(x) && $(x).remove()); prev.remove();
app.querySelectorAll("#cbet button").forEach((x) => { if (+x.dataset.i === q.bet.good) x.classList.add("act-ok-btn"); else if (x.getAttribute("aria-pressed") === "true") x.classList.add("act-wrong"); });
const val = (q.calc.range ? "environ " : "") + String(+(+q.calc.value).toFixed(q.calc.round ? Math.max(0, -Math.floor(Math.log10(q.calc.round))) : 4)).replace(/^\d+/, (i) => i.replace(/\B(?=(\d{3})+(?!\d))/g, "'")).replace(".", ",");
$("cfb").innerHTML = `<div class="fb ${calcOk ? "ok" : "hint"} pop">${calcOk ? "✓ Juste !" : "Réponse : " + val}
      <span>${betOk ? "Et ton intuition était la bonne : bravo !" : "Ton pari était : « " + esc(q.bet.choices[+app.querySelector('#cbet button[aria-pressed="true"]').dataset.i]) + " ». La bonne réponse : « " + q.bet.choices[q.bet.good] + " ». Beaucoup de gens se trompent ici : c'est tout l'intérêt !"}</span></div>`;
show($("cs3")); $("cnext").hidden = false;
};
const go = () => {
const v = inp.value.trim(); if (!v) return;
const r = q.calc.range ? rangeCheck(v) : checkAnswer(spec, v);
if (r.status === "correct") return finish(true);
if (r.status === "invalid" || r.status === "form") { if (S) S.illis = (S.illis || 0) + 1; $("cfb").innerHTML = `<div class="fb hint pop">${escT(r.message || "Écris un nombre.")}</div>`; return; }
if (S && !S.rep1) S.rep1 = sigRep(v);
tries++;
if (tries >= 2) return finish(false);
$("cfb").innerHTML = `<div class="fb hint pop">${r.status === "close" ? escT(r.message || "Presque !") : "Pas tout à fait. Encore un essai ?"}</div>`;
};
$("cok").onclick = go; inp.onkeydown = (e) => { if (e.key === "Enter") go(); };
$("cidk").onclick = () => finish(false, true);
$("cnext").onclick = () => screenCurious(Curieux.pick(state), back, from);
$("cback").onclick = back; $("cback0").onclick = back;
}



function screenHistory(k, back) {



const H = HISTOIRE[k], E = H.ex(), spec = E.calc ? { kind: "value", value: E.value } : { kind: "value", value: E.value, final: true };
Histoire.seen(state, k); save();
h(`${brand}${backTop("hback0")}<div class="eyebrow">📜 Histoire des maths · ${H.t}</div>
  <div class="card pop stack hist-story"><h2>${H.titre}</h2><div class="figwrap">${H.fig(E)}</div><p>${H.txt}</p>
    <div class="act-step"><div class="act-h"><span class="act-n">✍️</span> À toi</div><div class="qtext">${E.q}</div>
      <div class="answer"><input class="ans" id="hans" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Ta réponse…" aria-label="Ta réponse">
      <div class="preview" id="hprev"></div>${keypadHtml(spec)}
      <div class="actions"><button class="btn-primary" id="hok">Vérifier</button><button class="btn-sec" id="hidk">Voir la réponse</button></div></div><div id="hfb" aria-live="polite"></div>
      ${scratchHtml() }</div><div id="hmore"></div>
    <p class="small muted">Lien avec : ${H.lien}</p></div>
  <button class="btn-primary btn-big" id="hnext">Une autre histoire</button>
  <button class="btn-ghost" id="hback">Retour</button>`);
pageQ = "hist-" + k;
typeset(app); bindScratch(null);
const $ = (x) => document.getElementById(x), inp = $("hans"), prev = $("hprev");
let tries = 0;
const finish = (ok) => {
inp.disabled = true; ["kp", "hok", "hidk"].forEach((x) => $(x) && $(x).remove()); prev.remove();
$("hfb").innerHTML = `<div class="fb ${ok ? "ok" : "hint"} pop">${ok ? "✓ Juste !" : "Réponse : " + String(E.value).replace(/\B(?=(\d{3})+(?!\d))/g, "'")}<div class="sol">${E.sol}</div></div>`;
typeset($("hfb"));
histMore(H, $("hmore"));
};
const go = () => {
const v = inp.value.trim(); if (!v) return;
const r = checkAnswer(spec, v);
if (r.status === "correct") return finish(true);
if (r.status === "invalid" || r.status === "form") { $("hfb").innerHTML = `<div class="fb hint pop">${escT(r.message || "Écris un nombre.")}</div>`; return; }
if (++tries >= 2) return finish(false);
$("hfb").innerHTML = `<div class="fb hint pop">${r.status === "close" ? escT(r.message || "Presque !") : "Pas tout à fait. Encore un essai ?"}</div>`;
};
inp.oninput = () => previewOf(inp, prev, spec);
bindKeypad(() => inp, () => previewOf(inp, prev, spec));
$("hok").onclick = go; inp.onkeydown = (e) => { if (e.key === "Enter") go(); };
$("hidk").onclick = () => finish(false);
$("hnext").onclick = () => screenHistory(Histoire.other(k), back);
$("hback").onclick = back; $("hback0").onclick = back;
window.scrollTo(0, 0);
}




const histFmt = (v) => String(v).replace(".", ",").replace(/^(-?\d+)/, (m) => m.replace(/\B(?=(\d{3})+(?!\d))/g, "'"));
function histMore(H, box) {
if (!box) return;
const adv = state && state.profile && (state.profile.grade >= 12 || state.profile.system === "FR" && state.profile.grade >= 12);
const opts = [H.plus && ["plus", "🚀 Pour aller plus loin"], H.expert && adv && ["expert", "🎓 Défi expert"]].filter(Boolean);
if (!opts.length) return;
box.innerHTML = `<div class="row hist-more">${opts.map(([k, t]) => `<button type="button" class="btn-sec" data-more="${k}">${t}</button>`).join("")}</div>`;
box.querySelectorAll("[data-more]").forEach((b) => (b.onclick = () => {
const P = H[b.dataset.more](), steps = P.steps; let i = 0, juste = 0;
box.innerHTML = `<div class="act-step hist-plus"><div class="act-h"><span class="act-n">${b.dataset.more === "expert" ? "🎓" : "🚀"}</span> ${b.dataset.more === "expert" ? "Défi expert" : "Pour aller plus loin"}</div><p>${P.intro}</p><div id="hsteps"></div></div>`;
const list = box.querySelector("#hsteps");
const next = () => {
if (i >= steps.length) { list.insertAdjacentHTML("beforeend", `<p class="small"><b>${juste} / ${steps.length}</b> du premier coup${juste === steps.length ? " : bravo !" : "."}</p>`); return; }
const holder = document.createElement("div"); holder.className = "hist-step"; list.appendChild(holder);
histStep(holder, steps[i], i + 1, steps.length, (ok) => { if (ok) juste++; i++; next(); });
};
next(); typeset(box);
}));
}
function histStep(holder, E, n, tot, done) {
const spec = E.round ? { kind: "value", value: E.value, round: E.round } : { kind: "value", value: E.value };
holder.innerHTML = `<div class="qtext"><b>${tot > 1 ? "Étape " + n + " sur " + tot + ". " : ""}</b>${E.q}</div>
    <div class="answer"><input class="ans" id="hsin" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Ta réponse…" aria-label="Ta réponse">
    <div class="preview" id="hsprev"></div>${keypadHtml(spec)}
    <div class="actions"><button class="btn-primary" id="hsok">Vérifier</button><button class="btn-sec" id="hsidk">Voir la réponse</button></div></div><div class="hsfb"></div>`;
typeset(holder);
const inp = holder.querySelector("#hsin"), prev = holder.querySelector("#hsprev"), fb = holder.querySelector(".hsfb");
let tries = 0;
const finish = (ok) => {
inp.disabled = true; ["#kp", "#hsok", "#hsidk", "#hsprev"].forEach((x) => { const e = holder.querySelector(x); if (e) e.remove(); });
inp.removeAttribute("id");
fb.innerHTML = `<div class="fb ${ok ? "ok" : "hint"} pop">${ok ? "✓ Juste !" : "Réponse : " + histFmt(E.value)}<div class="sol">${E.sol}</div></div>`;
typeset(fb); done(ok);
};
const go = () => {
const v = inp.value.trim(); if (!v) return;
const r = checkAnswer(spec, v);
if (r.status === "correct") return finish(tries === 0);
if (r.status === "invalid" || r.status === "form") { fb.innerHTML = `<div class="fb hint pop">${escT(r.message || "Écris un nombre.")}</div>`; return; }
if (++tries >= 2) return finish(false);
fb.innerHTML = `<div class="fb hint pop">${r.status === "close" ? escT(r.message || "Presque !") : "Pas tout à fait. Encore un essai ?"}</div>`;
};
inp.oninput = () => previewOf(inp, prev, spec);
bindKeypad(() => inp, () => previewOf(inp, prev, spec));
holder.querySelector("#hsok").onclick = go; inp.onkeydown = (e) => { if (e.key === "Enter") go(); };
holder.querySelector("#hsidk").onclick = () => finish(false);
inp.focus({ preventScroll: true });
}



const plur = (n, one, many) => n + " " + (n > 1 ? many : one);
const ddmm = (d) => d.slice(8, 10) + "." + d.slice(5, 7);

function weekText(w) {
const parts = [];
if (w.ups.length) parts.push(plur(w.ups.length, "compétence a monté", "compétences ont monté"));
if (w.cons.length) parts.push(plur(w.cons.length, "notion consolidée", "notions consolidées"));
if (w.fixed) parts.push(plur(w.fixed, "erreur effacée du carnet", "erreurs effacées du carnet"));
if (!parts.length && w.first.length) parts.push(isFR() ? plur(w.first.length, "premier niveau de maîtrise", "premiers niveaux de maîtrise") : plur(w.first.length, "première note de compétence", "premières notes de compétences"));

if (!parts.length && !w.n) return { main: "Une séance de quelques minutes suffit pour reprendre le fil.", sub: "" };
if (!parts.length) return { main: `Cette semaine : ${plur(w.days, "jour", "jours")} de pratique, ${plur(w.n, "question", "questions")} en séance.` , sub: "Les notes bougent au fil des réponses : chaque séance compte pour la suite." };
const last = parts.pop(), main = `${w.since ? "Depuis le " + ddmm(w.since) : "Cette semaine"} : ${parts.length ? parts.join(", ") + " et " : ""}${last}.`;
const top = w.ups[0];
return { main, sub: top ? `Plus belle progression : ${top.label} (${noteTxt(top.b)} → ${noteTxt(top.a)}).` : "" };
}
function weekLine() {
if (!state) return "";
const w = Engine.week(state), t = weekText(w);
return `<div class="card flat week-line"><div class="sum-line"><span>📈</span><div><b>${esc(t.main)}</b>${t.sub ? `<div class="small muted">${esc(t.sub)}</div>` : ""}</div></div></div>`;
}

function weekCard() {
const w = Engine.week(state), MAX = 5;
const more = (n) => (n > MAX ? `<li class="small muted">et ${n - MAX} autre${n - MAX > 1 ? "s" : ""}</li>` : "");
const ups = w.ups.length ? `<div><b>${plur(w.ups.length, "compétence en hausse", "compétences en hausse")}</b><ul class="week-list">${w.ups.slice(0, MAX).map((x) => `<li><span>${esc(x.label)}</span><span class="week-notes"><span class="note ${noteCls(x.b)}">${noteTxt(x.b)}</span>→<span class="note ${noteCls(x.a)}">${noteTxt(x.a)}</span></span></li>`).join("")}${more(w.ups.length)}</ul></div>` : "";
const cons = w.cons.length ? `<div><b>${plur(w.cons.length, "notion consolidée", "notions consolidées")}</b><ul class="week-list">${w.cons.slice(0, MAX).map((id) => `<li><span>✅ ${esc(nLab(id))}</span></li>`).join("")}${more(w.cons.length)}</ul></div>` : "";
const first = w.first.length ? `<div class="small">🆕 ${isFR() ? plur(w.first.length, "premier niveau de maîtrise", "premiers niveaux de maîtrise") : plur(w.first.length, "première note de compétence", "premières notes de compétences")}</div>` : "";
const fixed = w.fixed ? `<div class="small">📕 ${plur(w.fixed, "erreur effacée", "erreurs effacées")} de ton carnet</div>` : "";
const calm = !ups && !cons && !first && !fixed ? `<p class="small muted">${w.days ? (isFR() ? "Pas encore de niveau de maîtrise en hausse : les niveaux bougent au fil des réponses, chaque séance compte." : "Pas encore de note en hausse : les notes bougent au fil des réponses, chaque séance compte.") : "Pas encore de séance ces 7 derniers jours : une séance de quelques minutes suffit pour reprendre."}</p>` : "";
return `<div class="card stack week-card"><div class="spread"><span class="eyebrow">📈 Ma semaine</span><span class="small muted">7 derniers jours</span></div>
    <div class="week-days"><span>Jours actifs</span><b>${w.days} / 7</b></div>${ups}${cons}${first}${fixed}${calm}${w.since ? `<p class="small muted">Notes comparées depuis le ${ddmm(w.since)}, début du suivi.</p>` : ""}</div>`;
}


function summaryByNotion() {
const r = session.res || {}, ids = [...session.ids].filter((id) => r[id]);
if (!ids.length) return "";
const lab = (id) => nLabel(id);
const ok = ids.filter((id) => r[id].ok === r[id].n), mid = ids.filter((id) => r[id].ok > 0 && r[id].ok < r[id].n), ko = ids.filter((id) => !r[id].ok);
const line = (ic, t, arr, note) => arr.length ? `<div class="sum-line"><span>${ic}</span><div><b>${t}</b><div class="small">${arr.map(lab).join(" · ")}</div>${note ? `<div class="small muted">${note}</div>` : ""}</div></div>` : "";
return `<div class="card flat stack sum-notions">${line("✅", ok.length > 1 ? "Réussies" : "Réussie", ok)}${line("📈", "En progrès", mid, "Une partie juste : encore une ou deux séances.")}${line("🔁", ko.length > 1 ? "Reviendront bientôt" : "Reviendra bientôt", ko, (state.carnet || []).length ? "Rangées dans ton carnet d'erreurs, à refaire quand tu veux." : "L'app te les reproposera dans les prochains jours.")}</div>`;
}

function sumGoal(g) {

const r = session.res || {}, weak = [...(session.ids || [])].find((id) => r[id] && r[id].ok < r[id].n)
|| ((state.carnet || []).filter((x) => !x.ok).slice(-1)[0] || {}).id;
const parts = [g && g.next ? `encore <b>${nbFmt(g.next.at - ypPts())} points</b> avant ${g.next.ic} ${g.next.name}` : "", weak ? `consolider <b>${esc(nLab(weak))}</b>` : ""].filter(Boolean);
return parts.length ? `<div class="small goal">🎯 Objectif pour demain : ${parts.join(" · ")}</div>` : "";
}


function scoreRow(n, sc) {
const P = session.parts;


if (P && (n === 1 || session.nP === n)) return `<div class="spread"><span>Parties justes</span><b>${P[0]} / ${P[1]}</b></div>`;
return `<div class="spread"><span>Score</span><b>${String(Math.round(sc * 10) / 10).replace(".", ",")} / ${n}</b></div>`;
}


function sumTitle(n, sc) {
if (sc >= n * 0.8) return "Excellente séance !";
const P = [session.solvedN ? plur(session.solvedN, "question réussie", "questions réussies") : "", session.rebuilt ? plur(session.rebuilt, "solution reconstruite", "solutions reconstruites") : "",
session.fixedN ? plur(session.fixedN, "erreur effacée du carnet", "erreurs effacées du carnet") : ""].filter(Boolean);
const txt = P.length > 1 ? P.slice(0, -1).join(", ") + " et " + P[P.length - 1] : P[0];
if (sc >= n * 0.5) return txt ? "Bonne séance : " + txt + "." : "Bonne séance.";
return txt ? "Aujourd'hui : " + txt + "." : plur(n, "question travaillée", "questions travaillées") + " : c'est en pratiquant qu'on progresse.";
}
function screenSummary() {
if (state) { delete state.resume; if (session && session.answered) state.firstDone = true; save(); }
if (session && session.answered && !session.counted) { session.counted = true; UI.sessN = (+UI.sessN || 0) + 1; uiSave(); storagePersist(); }
if (session && session.weekly && state) { state.weeklyDone = weekKey(); save(); }
if (session && session.prepKind && session.answered) prepMark(session.prepKind);

if (state && session && session.answered && !session.prep && !session.weekly && !session.carnet) { state.fmtDone = day(); save(); }
ping("session", { ...sessionInfo(), n: session.answered, score: session.score, min: Math.max(1, Math.round((Date.now() - session.start) / 6e4)) });
Badges.check(state); save();
const nb = newBadgesCard();
const n = session.answered, sc = session.score, d = state.elo.r - session.elo0;

if (!session.weekly && !session.ypDone && n >= Math.min(3, session.plan.length)) { session.ypDone = true; session.ypg = (session.ypg || 0) + ypAdd(state, YP.session, "s"); save(); }
const yg = session.ypg || 0, ypt = ypPts(), g0 = gradeOf(ypt - yg), g1 = gradeOf(ypt);
if (g1.i > g0.i) gradeNumbers();
const newGrade = g1.i > g0.i ? `<div class="card stack grade-up"><div class="eyebrow">Nouveau grade !</div><div class="ic-row"><button type="button" class="ic grade-ic grade-open" data-g="${g1.name}" aria-label="Voir la carte du grade ${g1.name}">${g1.ic}</button><div><h3>Tu es maintenant ${esc(g1.title)}</h3><div class="small muted">${g1.next ? "Prochain grade : " + g1.next.ic + " " + g1.next.name + ", encore " + nbFmt(g1.next.at - ypt) + " points." : "Le plus haut grade : bravo !"}</div></div></div></div>` : "";

const ypCapped = !yg && ((ypSync() || {}).dp || 0) >= YP.cap;
const ypRow = ypCapped ? `<div class="spread yp-row"><span>Points de l'année</span><b class="small">plafond du jour atteint, reviens demain</b></div>` : `<div class="spread yp-row"><span>Points de l'année</span><b>+${yg}${g1.next ? ` <span class="small muted">\u00a0· encore ${nbFmt(g1.next.at - ypt)} avant ${g1.next.name}</span>` : ""}</b></div>`;





if (session.carnet) {
const left = (state.carnet || []).length, fx = session.fixedN || 0, ok = session.solvedN || 0;
const title = fx ? "📕 Bien joué : " + plur(fx, "erreur effacée", "erreurs effacées") + " !" : ok ? "📕 " + plur(ok, "question réussie", "questions réussies") + ", pas encore effacée" + (ok > 1 ? "s" : "") + "." : "📕 C'est noté.";
const rule = left && fx < n ? `<div class="small muted">Pour effacer une erreur : ${carnetRule()}.</div>` : "";
h(`${brand}<h2>${esc(title)}</h2>
    <div class="card flat stack">${ypRow}<div class="spread"><span>Carnet d'erreurs</span><b>${left ? carnetLeft(state.carnet) : "vide : bravo !"}</b></div>${rule}</div>
    ${newGrade}${nb}
    ${left ? '<button class="btn-primary btn-big" id="carnetagain">📕 Continuer à effacer</button>' : ""}
    <button class="${left ? "btn-sec" : "btn-primary btn-big"}" id="home">Retour à l'accueil</button>`);
if (nb || newGrade) setTimeout(burst, 250);
updBanner("bilan");
document.getElementById("home").onclick = screenHome;
if (document.getElementById("carnetagain")) document.getElementById("carnetagain").onclick = () => startCarnet();
return;
}

const shortMsg = session.stopped && session.i < session.plan.length ? "Séance interrompue : tu reprendras demain. Tu peux aussi continuer maintenant."
: session.fmt === "defi" ? (n === 1 ? "Une seule question aujourd'hui : c'était le défi du jour. " : "C'était le défi du jour. ") + "Tu peux continuer autant que tu veux."

: Date.now() - session.start < 4 * 6e4 ? "Séance courte aujourd'hui. Tu peux continuer autant que tu veux." : "";

h(`${brand}<h2>${esc(sumTitle(n, sc))}</h2>
  <div class="card flat streak"><span class="flame">🔥</span><div><b>${state.streak.count} ${state.streak.count > 1 ? "jours" : "jour"}</b> <span class="muted">d'affilée</span>${state.streak.best > 1 ? `<span class="small muted"> · record ${state.streak.best}</span>` : ""}<div class="small muted">Reviens demain : ta série passe à ${state.streak.count + 1} jours${state.streak.count + 1 > (state.streak.best || 0) ? " (nouveau record)" : ""}.</div><div class="small tomorrow">Demain : <b>${tomorrowLabel()}</b></div>${sumGoal(g1)}</div></div>
  ${summaryByNotion()}
  ${weekLine()}
  <div class="card stack">${scoreRow(n, sc)}
  ${ypRow}${session.rebuilt ? `<p class="small">🪜 Tu as reconstruit ${session.rebuilt > 1 ? session.rebuilt + " solutions" : "une solution"} pas à pas : ça compte aussi.</p>` : ""}</div>
  ${session.ctest ? (() => { const a = ctestNote(session.ctest), b = session.ctest.before; return `<div class="card flat"><div class="spread"><span>${esc(session.ctest.label)}</span><span class="note ${noteCls(a)}">${noteTxt(a)}</span></div><div class="small muted">${a === null ? (isFR() ? "Le niveau apparaît après 3 réponses sur cette compétence." : "La note apparaît après 3 réponses sur cette compétence.") : b === null ? (isFR() ? "Premier positionnement pour cette compétence." : "Première note pour cette compétence.") : a > b ? "En progrès : " + noteTxt(b) + " → " + noteTxt(a) + "." : a < b ? "Avant : " + noteTxt(b) + ". " + (isFR() ? "Il remontera" : "Elle remontera") + " avec la pratique." : isFR() ? "Niveau stable." : "Note stable."}</div><button id="backcomps" class="btn-big">Retour à mes compétences</button></div>`; })() : ""}
  ${newGrade}${nb}
  ${(state.carnet || []).length ? `<div class="card flat stack"><div class="spread"><span>📕 Carnet d'erreurs</span><b>${carnetLeft(state.carnet)}</b></div><span class="small muted">${carnetWeekN() ? carnetWeekTxt() + " · " : ""}Pour effacer une erreur : ${carnetRule()}.</span><button class="btn-primary" id="carnetagain">${session.carnet ? "Continuer à effacer" : "📕 Effacer mes erreurs maintenant"}</button></div>` : session.carnet ? '<div class="card flat"><p>📕 Carnet d\'erreurs vide : bravo !</p></div>' : ""}
  ${returnCard()}
  ${xReady() ? curBonus() : '<span id="curslot" hidden></span>'}
  <div class="card flat">${commentBox("Une remarque sur l'application ?", "Ce qui te plaît, ce qui te gêne, une idée… (n'écris pas ton nom)", "app")}</div>
  ${n <= 2 && shortMsg && !session.weekly && !session.carnet && !session.prep ? `<div class="card flat stack"><p class="small">${shortMsg}</p><button class="btn-sec" id="again">➕ Encore une séance</button></div>` : ""}
  <button class="btn-primary btn-big" id="home">Retour à l'accueil</button>`);
ecranCols(); bindComment(app, "app"); bindInstall(screenHome);

if (document.getElementById("again")) document.getElementById("again").onclick = () => { if (n === 1) Engine.otherFormat(state); session = null; save(); startSession(); };
if (nb || newGrade) setTimeout(burst, 250);
updBanner("bilan");
document.getElementById("home").onclick = screenHome;
const bindCur = () => { if (document.getElementById("curbonus")) document.getElementById("curbonus").onclick = () => screenCurious(Curieux.pick(state), screenHome, "bilan"); };
bindCur();

if (!xReady()) window.loadPack("x").then(() => { const sl = document.getElementById("curslot"); if (sl) { sl.outerHTML = curBonus(); bindCur(); } }, () => {});
if (document.getElementById("carnetagain")) document.getElementById("carnetagain").onclick = () => startCarnet();
if (document.getElementById("backcomps")) document.getElementById("backcomps").onclick = screenComps;
}


function showCode() {


if (location.hash === "#france" || location.hash === "#france-off") {
const on = location.hash === "#france";
try { if (on) localStorage.setItem("m2m-france", "1"); else localStorage.removeItem("m2m-france"); } catch (e) {}
history.replaceState(null, "", location.pathname);
if (!on) { location.reload(); return true; }
SYSTEMS.FR = SYSTEMS_HIDDEN.FR;
if (typeof draft !== "undefined" && draft) draft.system = "FR";
screenLevel(); toast("Aperçu France activé sur cet appareil (…/#france-off pour le retirer).", 4000);
return true;
}



if (typeof window.__m2mMode === "function" && window.__m2mMode() !== "tout" && /^#(q-|l-|auteur|decouvrir|parents?\b|enseignants)/.test(location.hash)) {
window.ensurePacks(null).catch(() => { history.replaceState(null, "", location.pathname); state && state.placed ? screenHome() : screenWelcome(); toast("Pas de connexion : cette page n'est pas encore sur cet appareil."); });
return true;
}
if (typeof presentRoute === "function" && presentRoute()) return true;
if (typeof parentRoute === "function" && parentRoute()) return true;
if (location.hash === "#confidentialite") { screenLegal(() => { history.replaceState(null, "", location.pathname); state && state.placed ? screenHome() : screenWelcome(); }); return true; }

const ml = /^#l-([a-z0-9]+)$/.exec(location.hash);
if (ml && typeof LESSONS !== "undefined" && LESSONS[ml[1]]) { screenLesson(ml[1], () => { history.replaceState(null, "", location.pathname); state && state.placed ? screenHome() : screenWelcome(); }, false, false); return true; }
const m = /^#q-(.+)$/.exec(location.hash);
if (!m) return false;
const back0 = () => { history.replaceState(null, "", location.pathname); state && state.placed ? screenHome() : screenWelcome(); };
if (/^cur-/.test(m[1]) && typeof Curieux !== "undefined") { const cq = Curieux.fromCode(m[1]); if (cq) { screenCurious(cq, back0); return true; } }
let q = Engine.fromCode(m[1]);

if (q) { const n = NOTIONS.find((x) => x.id === q.id), y = (n && n.CH && n.CH[0]) || 12; q = Engine.finalize({ profile: { system: "CH", grade: y } }, q.id, q); }
if (!q) { h(`${brand}<div class="card flat"><h3>Code inconnu</h3><p class="muted">« ${esc(m[1])} » ne correspond à aucune question.</p></div>`); return true; }
const back = () => { history.replaceState(null, "", location.pathname); state && state.placed ? screenHome() : screenWelcome(); };
renderQuestion(q, { eyebrow: "Question " + q.code + " (consultation)", onDone: () => 0, onNext: back });
return true;
}
window.addEventListener("hashchange", () => showCode() || restoreFromHash());










var Upd = {
ready: false, scr: "", lastCheck: 0, reg: null, gap: 30 * 60 * 1000,
reload: () => location.reload(),
safe() { return (Upd.scr === "home" || Upd.scr === "bilan") && !homeBusy() && !app.querySelector(".qtext, .lesson-card"); },
check(now = Date.now()) { if (!Upd.reg || now - Upd.lastCheck < Upd.gap) return false; Upd.lastCheck = now; try { Upd.reg.update().catch(() => {}); } catch (e) {} return true; },
found() { if (Upd.ready) return; Upd.ready = true; updBanner(Upd.scr); },
visible() { if (Upd.ready && Upd.safe()) { Upd.reload(); return true; } Upd.check(); return false; },
};

function updBanner(where) {
if (typeof Upd === "undefined" || !Upd) return;
Upd.scr = where || "";
if (!where || !Upd.ready || app.querySelector(".upd-line")) return;
app.insertAdjacentHTML("afterbegin", '<div class="upd-line" role="status"><span>Nouvelle version prête</span><button type="button" class="btn-ghost small" id="updgo">Recharger</button></div>');
document.getElementById("updgo").onclick = () => Upd.reload();
}
if ("serviceWorker" in navigator && location.protocol === "https:" && !/claude/.test(location.hostname)) {
const sw = navigator.serviceWorker;
let had = !!sw.controller;
sw.addEventListener("controllerchange", () => { if (had) Upd.found(); had = true; });
sw.register("sw.js").then((reg) => { Upd.reg = reg; Upd.lastCheck = Date.now(); }).catch(() => {});
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") Upd.visible(); });
}


ping("open");



if (window.__reprise && typeof window.packsOk === "function" && window.packsOk(window.__reprise)) { const rp = window.__reprise; window.__reprise = null; setProfile(rp); }
else if (state && state.profile && typeof window.packsOk === "function" && !window.packsOk(state.profile)) window.ensurePacks(null).catch(() => { app.innerHTML = '<section class="card"><h2>Pas de connexion</h2><p>Reconnecte-toi, puis rouvre l\'app.</p></section>'; });
else if (!showCode() && !restoreFromHash()) { if (state && state.placed) screenHome(); else if (state && state.placement) { toast("On reprend ton positionnement là où tu l'avais laissé."); startPlacement(); } else { state = null; screenWelcome(); } }
